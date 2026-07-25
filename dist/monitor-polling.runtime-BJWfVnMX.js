import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { n as computeBackoff, s as sleepWithAbort } from "./src-DKBD8PDy.js";
import { r as formatDurationPrecise } from "./format-duration-DKk9BtRb.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./error-runtime-DUxkdoW4.js";
import "./runtime-env-BDC_axp1.js";
import { t as isRecoverableTelegramNetworkError } from "./network-errors-DCsO9L1u.js";
import { t as TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS } from "./request-timeouts-C2F_8uWi.js";
import { n as createTelegramIngressWorker } from "./telegram-ingress-worker-BTqLy6YM.js";
import { t as drainPendingDeliveries } from "./delivery-queue-runtime-BVClaDyK.js";
import "./ssrf-runtime-b7ye-Z-7.js";
import { n as createConnectedChannelStatusPatch, r as createTransportActivityStatusPatch } from "./gateway-runtime-BpblXBwU.js";
import { c as writeTelegramUpdateOffset, o as readTelegramUpdateOffset, r as deleteTelegramUpdateOffset } from "./update-offset-store-BJtVniop.js";
import { at as withTelegramApiErrorLogging } from "./send-BNztnYW3.js";
import { a as telegramSpooledUpdateLaneKey, i as resolveTelegramIngressSpoolDir, n as resolveTelegramAdoptionStallTimeoutMs, o as writeTelegramSpooledUpdate, r as createTelegramBot, t as createTelegramTransportIngressMonitor } from "./telegram-ingress-drain-factory-BlwkNg86.js";
import { run } from "@grammyjs/runner";
//#region extensions/telegram/src/polling-liveness.ts
var TelegramPollingLivenessTracker = class {
	#lastGetUpdatesAt;
	#lastGetUpdatesActivityAt;
	#lastGetUpdatesStartedAt = null;
	#lastGetUpdatesFinishedAt = null;
	#lastGetUpdatesDurationMs = null;
	#lastGetUpdatesOutcome = "not-started";
	#lastGetUpdatesError = null;
	#lastGetUpdatesOffset = null;
	#inFlightGetUpdates = 0;
	#stallDiagLoggedAt = 0;
	constructor(options = {}) {
		this.options = options;
		this.#lastGetUpdatesAt = this.#now();
		this.#lastGetUpdatesActivityAt = this.#lastGetUpdatesAt;
	}
	get inFlightGetUpdates() {
		return this.#inFlightGetUpdates;
	}
	noteGetUpdatesStarted(payload, at = this.#now()) {
		this.#lastGetUpdatesAt = at;
		this.#lastGetUpdatesActivityAt = at;
		this.#lastGetUpdatesStartedAt = at;
		this.#lastGetUpdatesOffset = resolveGetUpdatesOffset(payload);
		this.#inFlightGetUpdates += 1;
		this.#lastGetUpdatesOutcome = "started";
		this.#lastGetUpdatesError = null;
	}
	noteGetUpdatesSuccess(result, at = this.#now()) {
		this.#lastGetUpdatesActivityAt = at;
		this.#lastGetUpdatesFinishedAt = at;
		this.#lastGetUpdatesDurationMs = this.#lastGetUpdatesStartedAt == null ? null : at - this.#lastGetUpdatesStartedAt;
		this.#lastGetUpdatesOutcome = Array.isArray(result) ? `ok:${result.length}` : "ok";
		this.options.onPollSuccess?.(at);
	}
	noteGetUpdatesSuccessCount(count, at = this.#now()) {
		this.#lastGetUpdatesActivityAt = at;
		this.#lastGetUpdatesFinishedAt = at;
		this.#lastGetUpdatesDurationMs = this.#lastGetUpdatesStartedAt == null ? null : at - this.#lastGetUpdatesStartedAt;
		const normalizedCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
		this.#lastGetUpdatesOutcome = `ok:${normalizedCount}`;
		this.options.onPollSuccess?.(at);
	}
	noteGetUpdatesError(err, at = this.#now()) {
		this.#lastGetUpdatesActivityAt = at;
		this.#lastGetUpdatesFinishedAt = at;
		this.#lastGetUpdatesDurationMs = this.#lastGetUpdatesStartedAt == null ? null : at - this.#lastGetUpdatesStartedAt;
		this.#lastGetUpdatesOutcome = "error";
		this.#lastGetUpdatesError = formatErrorMessage(err);
	}
	noteGetUpdatesFinished() {
		this.#inFlightGetUpdates = Math.max(0, this.#inFlightGetUpdates - 1);
	}
	noteGetUpdatesActivity(at = this.#now()) {
		this.#lastGetUpdatesActivityAt = at;
	}
	detectStall(params) {
		const now = params.now ?? this.#now();
		const activeElapsed = this.#inFlightGetUpdates > 0 && this.#lastGetUpdatesStartedAt != null ? now - this.#lastGetUpdatesActivityAt : 0;
		const idleElapsed = this.#inFlightGetUpdates > 0 ? 0 : now - (this.#lastGetUpdatesFinishedAt ?? this.#lastGetUpdatesAt);
		const elapsed = this.#inFlightGetUpdates > 0 ? activeElapsed : idleElapsed;
		if (elapsed <= params.thresholdMs) return null;
		if (this.#stallDiagLoggedAt && now - this.#stallDiagLoggedAt < params.thresholdMs / 2) return null;
		this.#stallDiagLoggedAt = now;
		return { message: `Polling stall detected (${this.#inFlightGetUpdates > 0 ? `active getUpdates stuck for ${formatDurationPrecise(elapsed)}` : `no completed getUpdates for ${formatDurationPrecise(elapsed)}`}); forcing restart. [diag ${this.formatDiagnosticFields("error")}]` };
	}
	formatDiagnosticFields(errorLabel) {
		const error = this.#lastGetUpdatesError && errorLabel ? ` ${errorLabel}=${this.#lastGetUpdatesError}` : "";
		return `inFlight=${this.#inFlightGetUpdates} outcome=${this.#lastGetUpdatesOutcome} startedAt=${this.#lastGetUpdatesStartedAt ?? "n/a"} finishedAt=${this.#lastGetUpdatesFinishedAt ?? "n/a"} durationMs=${this.#lastGetUpdatesDurationMs ?? "n/a"} offset=${this.#lastGetUpdatesOffset ?? "n/a"}${error}`;
	}
	#now() {
		return this.options.now?.() ?? Date.now();
	}
};
function resolveGetUpdatesOffset(payload) {
	if (!payload || typeof payload !== "object" || !("offset" in payload)) return null;
	const offset = payload.offset;
	return typeof offset === "number" ? offset : null;
}
//#endregion
//#region extensions/telegram/src/polling-session-restart-policy.ts
const TELEGRAM_POLL_RESTART_POLICY = {
	initialMs: 3e4,
	maxMs: 6e5,
	factor: 2,
	jitter: .2
};
const TELEGRAM_POLL_STOP_TIMEOUT_COOLDOWN_POLICY = {
	initialMs: 12e4,
	maxMs: 6e5,
	factor: 2,
	jitter: .2
};
const TELEGRAM_POLL_STOP_TIMEOUT_BURST_LIMIT = 2;
function createTelegramRestartBackoffState() {
	return {
		restartAttempts: 0,
		stopTimeoutBurst: 0,
		stopTimeoutCooldownAttempts: 0
	};
}
function resetTelegramRestartBackoffState(state) {
	state.restartAttempts = 0;
	state.stopTimeoutBurst = 0;
	state.stopTimeoutCooldownAttempts = 0;
}
function resolveTelegramRestartDelayMs(state, opts = {}) {
	state.restartAttempts += 1;
	let delayMs = computeBackoff(TELEGRAM_POLL_RESTART_POLICY, state.restartAttempts);
	let stopTimeoutSuffix = "";
	if (opts.stopTimedOut) {
		state.stopTimeoutBurst += 1;
		if (state.stopTimeoutBurst >= TELEGRAM_POLL_STOP_TIMEOUT_BURST_LIMIT) {
			state.stopTimeoutCooldownAttempts += 1;
			const cooldownMs = computeBackoff(TELEGRAM_POLL_STOP_TIMEOUT_COOLDOWN_POLICY, state.stopTimeoutCooldownAttempts);
			delayMs = Math.max(delayMs, cooldownMs);
			stopTimeoutSuffix = ` Stop timeout burst=${state.stopTimeoutBurst}; applying cooldown.`;
		}
	} else {
		state.stopTimeoutBurst = 0;
		state.stopTimeoutCooldownAttempts = 0;
	}
	return {
		delayMs,
		stopTimeoutSuffix
	};
}
//#endregion
//#region extensions/telegram/src/polling-status.ts
function createTelegramPollingStatusPublisher(setStatus) {
	return {
		notePollingStart() {
			setStatus?.({
				mode: "polling",
				connected: false,
				lastConnectedAt: null,
				lastEventAt: null,
				lastTransportActivityAt: null
			});
		},
		notePollSuccess(at = Date.now()) {
			setStatus?.({
				...createConnectedChannelStatusPatch(at),
				...createTransportActivityStatusPatch(at),
				mode: "polling",
				lastError: null
			});
		},
		notePollingError(error) {
			setStatus?.({
				mode: "polling",
				connected: false,
				lastError: error
			});
		},
		notePollingStop() {
			setStatus?.({
				mode: "polling",
				connected: false
			});
		}
	};
}
//#endregion
//#region extensions/telegram/src/polling-transport-state.ts
var TelegramPollingTransportState = class {
	#telegramTransport;
	#transportDirty = false;
	#disposed = false;
	constructor(opts) {
		this.opts = opts;
		this.#telegramTransport = opts.initialTransport;
	}
	markDirty() {
		this.#transportDirty = true;
	}
	acquireForNextCycle() {
		if (this.#disposed) return;
		const previous = this.#telegramTransport;
		const nextTransport = this.#transportDirty || !previous ? this.opts.createTelegramTransport?.() ?? previous : previous;
		if (this.#transportDirty && previous && nextTransport !== previous) {
			this.opts.log("[telegram][diag] closing stale transport before rebuild");
			this.#closeTransportAsync(previous, "stale-transport rebuild");
		}
		if (this.#transportDirty && nextTransport) this.opts.log("[telegram][diag] rebuilding transport for next polling cycle");
		this.#telegramTransport = nextTransport;
		this.#transportDirty = false;
		return nextTransport;
	}
	async dispose() {
		if (this.#disposed) return;
		this.#disposed = true;
		const transport = this.#telegramTransport;
		this.#telegramTransport = void 0;
		if (!transport) return;
		try {
			await transport.close();
		} catch (err) {
			this.opts.log(`[telegram][diag] failed to close transport during dispose: ${formatCloseError(err)}`);
		}
	}
	#closeTransportAsync(transport, context) {
		transport.close().catch((err) => {
			this.opts.log(`[telegram][diag] failed to close transport (${context}): ${formatCloseError(err)}`);
		});
	}
};
function formatCloseError(err) {
	if (err instanceof Error) return err.message;
	return String(err);
}
//#endregion
//#region extensions/telegram/src/polling-session.ts
const TELEGRAM_GET_UPDATES_CONFLICT_HINT = " Another OpenClaw gateway, script, or Telegram poller may be using this bot token; stop the duplicate poller or switch this account to webhook mode.";
const DEFAULT_POLL_STALL_THRESHOLD_MS = 12e4;
const MIN_POLL_STALL_THRESHOLD_MS = 3e4;
const TELEGRAM_DELIVERY_DRAIN_INTERVAL_MS = 5e3;
const MAX_POLL_STALL_THRESHOLD_MS = 6e5;
const POLL_WATCHDOG_INTERVAL_MS = 3e4;
const POLL_STOP_GRACE_MS = 15e3;
const TELEGRAM_POLLING_CLIENT_TIMEOUT_FLOOR_SECONDS = Math.ceil(TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS / 1e3);
function normalizeTelegramAccountId(accountId) {
	return accountId?.trim() || "default";
}
const waitForGracefulStop = async (stop) => {
	let timer;
	try {
		await Promise.race([stop(), new Promise((resolve) => {
			timer = setTimeout(resolve, POLL_STOP_GRACE_MS);
			timer.unref?.();
		})]);
	} finally {
		if (timer) clearTimeout(timer);
	}
};
const resolvePollingStallThresholdMs = (value) => {
	if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_POLL_STALL_THRESHOLD_MS;
	return Math.min(MAX_POLL_STALL_THRESHOLD_MS, Math.max(MIN_POLL_STALL_THRESHOLD_MS, Math.floor(value)));
};
var TelegramPollingSession = class {
	#restartBackoffState = createTelegramRestartBackoffState();
	#webhookCleared = false;
	#forceRestarted = false;
	#activeRunner;
	#activeCycleAbort;
	#transportState;
	#status;
	#stallThresholdMs;
	#spooledUpdateHandlerTimeoutMs;
	#deliveryDrainInFlight = false;
	#nextDeliveryDrainAt = 0;
	constructor(opts) {
		this.opts = opts;
		this.#transportState = new TelegramPollingTransportState({
			log: opts.log,
			initialTransport: opts.telegramTransport,
			createTelegramTransport: opts.createTelegramTransport
		});
		this.#status = createTelegramPollingStatusPublisher(opts.setStatus);
		this.#stallThresholdMs = resolvePollingStallThresholdMs(opts.stallThresholdMs);
		this.#spooledUpdateHandlerTimeoutMs = resolveTelegramAdoptionStallTimeoutMs({
			...opts.isolatedIngress?.spooledUpdateHandlerTimeoutMs !== void 0 ? { configured: opts.isolatedIngress.spooledUpdateHandlerTimeoutMs } : {},
			env: process.env
		});
	}
	get activeRunner() {
		return this.#activeRunner;
	}
	markForceRestarted() {
		this.#forceRestarted = true;
	}
	markTransportDirty() {
		this.#transportState.markDirty();
	}
	abortActiveFetch() {
		this.#activeCycleAbort?.abort();
	}
	async runUntilAbort() {
		this.#status.notePollingStart();
		try {
			while (!this.opts.abortSignal?.aborted) {
				const bot = await this.#createPollingBot();
				if (!bot) continue;
				const cleanupState = await this.#ensureWebhookCleanup(bot);
				if (cleanupState === "retry") continue;
				if (cleanupState === "exit") return;
				if ((this.opts.isolatedIngress?.enabled ? await this.#runIsolatedIngressCycle(bot) : await this.#runPollingCycle(bot)) === "exit") return;
			}
		} finally {
			await this.#transportState.dispose();
			this.#status.notePollingStop();
		}
	}
	#noteHealthyPollingCycle() {
		resetTelegramRestartBackoffState(this.#restartBackoffState);
	}
	async #waitBeforeRestart(buildLine, opts = {}) {
		const { delayMs, stopTimeoutSuffix } = resolveTelegramRestartDelayMs(this.#restartBackoffState, opts);
		const delay = formatDurationPrecise(delayMs);
		this.opts.log(`${buildLine(delay)}${stopTimeoutSuffix}`);
		try {
			await sleepWithAbort(delayMs, this.opts.abortSignal);
		} catch (sleepErr) {
			if (this.opts.abortSignal?.aborted) return false;
			throw sleepErr;
		}
		return true;
	}
	async #waitBeforeRetryOnRecoverableSetupError(err, logPrefix) {
		if (this.opts.abortSignal?.aborted) return false;
		if (!isRecoverableTelegramNetworkError(err, { context: "unknown" })) throw err;
		return this.#waitBeforeRestart((delay) => `${logPrefix}: ${formatErrorMessage(err)}; retrying in ${delay}.`);
	}
	#drainPendingDeliveriesAfterReconnect() {
		if (this.#deliveryDrainInFlight) return;
		if (!this.opts.config) return;
		this.#deliveryDrainInFlight = true;
		const accountId = normalizeTelegramAccountId(this.opts.accountId);
		const cfg = this.opts.config;
		drainPendingDeliveries({
			drainKey: `telegram:${accountId}`,
			logLabel: "Telegram reconnect drain",
			cfg,
			log: {
				info: (message) => this.opts.log(`[telegram][diag] ${message}`),
				warn: (message) => this.opts.log(`[telegram] ${message}`),
				error: (message) => this.opts.log(`[telegram] ${message}`)
			},
			selectEntry: (entry) => ({
				match: entry.channel === "telegram" && normalizeTelegramAccountId(entry.accountId) === accountId,
				bypassBackoff: false
			})
		}).catch((err) => {
			this.opts.log(`[telegram] reconnect delivery drain failed: ${formatErrorMessage(err)}`);
		}).finally(() => {
			this.#deliveryDrainInFlight = false;
		});
	}
	#maybeDrainPendingDeliveries(finishedAt) {
		if (finishedAt < this.#nextDeliveryDrainAt) return;
		this.#nextDeliveryDrainAt = finishedAt + TELEGRAM_DELIVERY_DRAIN_INTERVAL_MS;
		this.#drainPendingDeliveriesAfterReconnect();
	}
	#rearmPendingDeliveryDrain() {
		this.#nextDeliveryDrainAt = 0;
	}
	async #createPollingBot() {
		const cycleAbortController = new AbortController();
		this.#activeCycleAbort = cycleAbortController;
		const cycleAbortSignal = this.opts.abortSignal ? AbortSignal.any([this.opts.abortSignal, cycleAbortController.signal]) : cycleAbortController.signal;
		const botApiAbortSignal = this.opts.isolatedIngress?.enabled ? this.opts.abortSignal : cycleAbortSignal;
		const telegramTransport = this.#transportState.acquireForNextCycle();
		const persistedLastUpdateId = this.opts.getLastUpdateId();
		const updateOffset = {
			lastUpdateId: this.opts.isolatedIngress?.enabled ? null : persistedLastUpdateId,
			persistenceFloorUpdateId: persistedLastUpdateId,
			onUpdateId: this.opts.persistUpdateId
		};
		try {
			return createTelegramBot({
				token: this.opts.token,
				runtime: this.opts.runtime,
				proxyFetch: this.opts.proxyFetch,
				config: this.opts.config,
				accountId: this.opts.accountId,
				botInfo: this.opts.botInfo,
				...botApiAbortSignal ? { fetchAbortSignal: botApiAbortSignal } : {},
				mediaAbortSignal: cycleAbortSignal,
				minimumClientTimeoutSeconds: TELEGRAM_POLLING_CLIENT_TIMEOUT_FLOOR_SECONDS,
				...updateOffset ? { updateOffset } : {},
				telegramTransport
			});
		} catch (err) {
			await this.#waitBeforeRetryOnRecoverableSetupError(err, "Telegram setup network error");
			if (this.#activeCycleAbort === cycleAbortController) this.#activeCycleAbort = void 0;
			return;
		}
	}
	async #ensureWebhookCleanup(bot) {
		if (this.#webhookCleared) return "ready";
		try {
			await withTelegramApiErrorLogging({
				operation: "deleteWebhook",
				runtime: this.opts.runtime,
				fn: () => bot.api.deleteWebhook({ drop_pending_updates: false })
			});
			this.#webhookCleared = true;
			return "ready";
		} catch (err) {
			if (isRecoverableTelegramNetworkError(err, { context: "unknown" })) {
				this.opts.log(`[telegram] deleteWebhook failed with a recoverable network error; continuing to polling so getUpdates can confirm webhook state: ${formatErrorMessage(err)}`);
				return "ready";
			}
			return await this.#waitBeforeRetryOnRecoverableSetupError(err, "Telegram webhook cleanup failed") ? "retry" : "exit";
		}
	}
	#ingressMonitor;
	/** Long-lived monitor for this session; stop only when the cycle ends. */
	#getOrCreateSpooledMonitor(params) {
		if (this.#ingressMonitor) return this.#ingressMonitor;
		this.#ingressMonitor = createTelegramTransportIngressMonitor({
			spoolDir: params.spoolDir,
			bot: params.bot,
			cfg: this.opts.config,
			accountId: this.opts.accountId,
			botInfo: this.opts.botInfo,
			adoptionStallTimeoutMs: this.#spooledUpdateHandlerTimeoutMs,
			pollIntervalMs: params.pollIntervalMs,
			...params.abortSignal ? { abortSignal: params.abortSignal } : {},
			onLog: (message) => this.opts.log(message),
			onError: (error) => this.opts.log(`[telegram][diag] isolated polling spool drain failed: ${formatErrorMessage(error)}`)
		});
		return this.#ingressMonitor;
	}
	async #runIsolatedIngressCycle(bot) {
		const ingress = this.opts.isolatedIngress;
		if (!ingress?.enabled) return this.#runPollingCycle(bot);
		const cycleAbortController = this.#activeCycleAbort;
		const abortMedia = () => {
			cycleAbortController?.abort();
		};
		try {
			await bot.init();
		} catch (err) {
			abortMedia();
			if (this.#activeCycleAbort === cycleAbortController) this.#activeCycleAbort = void 0;
			return await this.#waitBeforeRetryOnRecoverableSetupError(err, "Telegram bot init failed") ? "continue" : "exit";
		}
		const spoolDir = ingress.spoolDir ?? resolveTelegramIngressSpoolDir({ accountId: this.opts.accountId });
		const worker = (ingress.createWorker ?? createTelegramIngressWorker)({
			token: this.opts.token,
			accountId: this.opts.accountId,
			initialUpdateId: this.opts.getLastUpdateId(),
			spoolDir,
			apiRoot: ingress.apiRoot,
			timeoutSeconds: ingress.timeoutSeconds,
			network: ingress.network,
			proxy: ingress.proxy
		});
		let stopWorkerPromise;
		const stopWorker = () => {
			stopWorkerPromise ??= Promise.resolve(worker.stop()).then(() => void 0).catch(() => void 0);
			return stopWorkerPromise;
		};
		this.opts.log(`[telegram][diag] isolated polling ingress started spool=${spoolDir}`);
		const pollState = {
			startedAt: null,
			offset: null,
			outcome: "not-started",
			errorCode: null
		};
		const liveness = new TelegramPollingLivenessTracker();
		let restartRequested = false;
		let stalledRestart = false;
		let stopTimedOut = false;
		let forceCycleTimer;
		let forceCycleResolve;
		const forceCyclePromise = new Promise((resolve) => {
			forceCycleResolve = resolve;
		});
		let requestImmediateDrain = () => void 0;
		const endCycle = () => {
			abortMedia();
		};
		const drainIntervalMs = Math.max(100, Math.floor(ingress.drainIntervalMs ?? 500));
		const ingressAbortSignal = cycleAbortController ? this.opts.abortSignal ? AbortSignal.any([cycleAbortController.signal, this.opts.abortSignal]) : cycleAbortController.signal : this.opts.abortSignal;
		const ingressMonitor = this.#getOrCreateSpooledMonitor({
			bot,
			spoolDir,
			pollIntervalMs: drainIntervalMs,
			...ingressAbortSignal ? { abortSignal: ingressAbortSignal } : {}
		});
		requestImmediateDrain = ingressMonitor.requestDrain;
		const unsubscribe = worker.onMessage((message) => {
			const ackSpooledUpdate = (requestId, result) => {
				try {
					worker.ackSpooledUpdate?.(requestId, result);
				} catch (err) {
					this.opts.log(`[telegram][diag] isolated polling worker ack failed: ${formatErrorMessage(err)}`);
				}
			};
			if (message.type === "poll-start") {
				liveness.noteGetUpdatesStarted({ offset: message.offset }, message.startedAt);
				pollState.startedAt = message.startedAt;
				pollState.offset = message.offset;
				pollState.outcome = "started";
				delete pollState.error;
				pollState.errorCode = null;
				return;
			}
			if (message.type === "poll-success") {
				liveness.noteGetUpdatesSuccessCount(message.count, message.finishedAt);
				liveness.noteGetUpdatesFinished();
				this.#noteHealthyPollingCycle();
				if (!restartRequested) this.#status.notePollSuccess(message.finishedAt);
				this.#maybeDrainPendingDeliveries(message.finishedAt);
				pollState.outcome = `ok:${message.count}`;
				return;
			}
			if (message.type === "poll-error") {
				this.#rearmPendingDeliveryDrain();
				liveness.noteGetUpdatesError(new Error(message.message), message.finishedAt);
				liveness.noteGetUpdatesFinished();
				pollState.outcome = "error";
				pollState.error = message.message;
				pollState.errorCode = message.errorCode ?? null;
				return;
			}
			if (message.type === "update") {
				writeTelegramSpooledUpdate({
					spoolDir,
					update: message.update,
					laneKey: telegramSpooledUpdateLaneKey(message.update, this.opts.botInfo)
				}).then((updateId) => {
					ackSpooledUpdate(message.requestId, {
						ok: true,
						updateId
					});
					requestImmediateDrain();
				}, (err) => {
					ackSpooledUpdate(message.requestId, {
						ok: false,
						message: formatErrorMessage(err)
					});
				});
				return;
			}
			if (message.type === "spooled") {
				liveness.noteGetUpdatesActivity();
				requestImmediateDrain();
			}
		});
		const stopOnAbort = () => {
			endCycle();
			stopWorker();
		};
		this.opts.abortSignal?.addEventListener("abort", stopOnAbort, { once: true });
		const stopBot = () => {
			return Promise.resolve(bot.stop()).then(() => void 0).catch(() => void 0);
		};
		const clearForceCycleTimer = () => {
			if (!forceCycleTimer) return;
			clearTimeout(forceCycleTimer);
			forceCycleTimer = void 0;
		};
		const requestStopForRestart = () => {
			if (restartRequested) return;
			restartRequested = true;
			endCycle();
			stopWorker();
			if (!forceCycleTimer) forceCycleTimer = setTimeout(() => {
				if (this.opts.abortSignal?.aborted) return;
				this.opts.log(`[telegram] Isolated polling ingress stop timed out after ${formatDurationPrecise(POLL_STOP_GRACE_MS)}; forcing restart cycle.`);
				stopTimedOut = true;
				forceCycleResolve?.();
			}, POLL_STOP_GRACE_MS);
		};
		ingressMonitor.start();
		const watchdog = setInterval(() => {
			if (this.opts.abortSignal?.aborted || restartRequested) return;
			const stall = liveness.detectStall({ thresholdMs: this.#stallThresholdMs });
			if (!stall) return;
			this.#transportState.markDirty();
			stalledRestart = true;
			this.opts.log(`[telegram] ${stall.message}`);
			this.#status.notePollingError(stall.message);
			requestStopForRestart();
		}, POLL_WATCHDOG_INTERVAL_MS);
		watchdog.unref?.();
		try {
			try {
				await Promise.race([worker.task(), forceCyclePromise]);
				clearForceCycleTimer();
				endCycle();
			} catch (err) {
				if (this.opts.abortSignal?.aborted) return "exit";
				endCycle();
				const isConflict = pollState.errorCode === 409;
				if (isConflict) {
					this.#webhookCleared = false;
					this.#transportState.markDirty();
				} else if (pollState.error && !isRecoverableTelegramNetworkError(new Error(pollState.error), { context: "polling" })) {
					this.#status.notePollingError(pollState.error);
					throw new Error(pollState.error, { cause: err });
				}
				const message = isConflict ? `Telegram getUpdates conflict: ${pollState.error}.${TELEGRAM_GET_UPDATES_CONFLICT_HINT}` : formatErrorMessage(err);
				this.opts.log(`[telegram][diag] isolated polling ingress failed: ${message}`);
				this.#status.notePollingError(message);
				clearForceCycleTimer();
				return await this.#waitBeforeRestart((delay) => `Telegram isolated polling ingress failed; restarting in ${delay}.`) ? "continue" : "exit";
			}
			if (this.opts.abortSignal?.aborted) return "exit";
			if (restartRequested) {
				if (stalledRestart) this.opts.log(`[telegram][diag] isolated polling ingress finished reason=polling stall detected ${liveness.formatDiagnosticFields("error")}`);
				return await this.#waitBeforeRestart((delay) => `Telegram isolated polling ingress restart requested; restarting in ${delay}.`, { stopTimedOut }) ? "continue" : "exit";
			}
			const errorText = pollState.error ? ` error=${pollState.error}` : "";
			this.opts.log(`[telegram][diag] isolated polling ingress stopped outcome=${pollState.outcome} startedAt=${pollState.startedAt ?? "n/a"} offset=${pollState.offset ?? "n/a"}${errorText}`);
			return await this.#waitBeforeRestart((delay) => `Telegram isolated polling ingress stopped; restarting in ${delay}.`) ? "continue" : "exit";
		} finally {
			clearInterval(watchdog);
			clearForceCycleTimer();
			unsubscribe();
			this.opts.abortSignal?.removeEventListener("abort", stopOnAbort);
			endCycle();
			await stopWorker();
			await waitForGracefulStop(() => ingressMonitor.stop());
			this.#ingressMonitor = void 0;
			await waitForGracefulStop(stopBot);
			if (this.#activeCycleAbort === cycleAbortController) this.#activeCycleAbort = void 0;
		}
	}
	async #runPollingCycle(bot) {
		const liveness = new TelegramPollingLivenessTracker({ onPollSuccess: (finishedAt) => {
			this.#noteHealthyPollingCycle();
			this.#status.notePollSuccess(finishedAt);
			this.#maybeDrainPendingDeliveries(finishedAt);
		} });
		bot.api.config.use(async (prev, method, payload, signal) => {
			if (method !== "getUpdates") return await prev(method, payload, signal);
			liveness.noteGetUpdatesStarted(payload);
			try {
				const result = await prev(method, payload, signal);
				liveness.noteGetUpdatesSuccess(result);
				return result;
			} catch (err) {
				this.#rearmPendingDeliveryDrain();
				liveness.noteGetUpdatesError(err);
				throw err;
			} finally {
				liveness.noteGetUpdatesFinished();
			}
		});
		const runner = run(bot, this.opts.runnerOptions);
		this.opts.log(`[telegram][diag] polling cycle started ${liveness.formatDiagnosticFields()}`);
		this.#activeRunner = runner;
		const fetchAbortController = this.#activeCycleAbort;
		const abortFetch = () => {
			fetchAbortController?.abort();
		};
		if (this.opts.abortSignal && fetchAbortController) this.opts.abortSignal.addEventListener("abort", abortFetch, { once: true });
		let stopPromise;
		let stalledRestart = false;
		let forceCycleTimer;
		let forceCycleResolve;
		const forceCyclePromise = new Promise((resolve) => {
			forceCycleResolve = resolve;
		});
		const clearForceCycleTimer = () => {
			if (!forceCycleTimer) return;
			clearTimeout(forceCycleTimer);
			forceCycleTimer = void 0;
		};
		const stopRunner = () => {
			fetchAbortController?.abort();
			stopPromise ??= Promise.resolve(runner.stop()).then(() => void 0).catch(() => void 0);
			return stopPromise;
		};
		let stopBotPromise;
		const stopBot = () => {
			stopBotPromise ??= Promise.resolve(bot.stop()).then(() => void 0).catch(() => void 0);
			return stopBotPromise;
		};
		const stopOnAbort = () => {
			if (this.opts.abortSignal?.aborted) stopRunner();
		};
		let restartRequested = false;
		let stopTimedOut = false;
		const requestStopForRestart = () => {
			if (restartRequested) return;
			restartRequested = true;
			stopRunner();
			stopBot();
			if (!forceCycleTimer) forceCycleTimer = setTimeout(() => {
				if (this.opts.abortSignal?.aborted) return;
				this.opts.log(`[telegram] Polling runner stop timed out after ${formatDurationPrecise(POLL_STOP_GRACE_MS)}; forcing restart cycle.`);
				stopTimedOut = true;
				forceCycleResolve?.();
			}, POLL_STOP_GRACE_MS);
		};
		const watchdog = setInterval(() => {
			if (this.opts.abortSignal?.aborted || restartRequested) return;
			const stall = liveness.detectStall({ thresholdMs: this.#stallThresholdMs });
			if (stall) {
				this.#transportState.markDirty();
				stalledRestart = true;
				this.opts.log(`[telegram] ${stall.message}`);
				this.#status.notePollingError(stall.message);
				requestStopForRestart();
			}
		}, POLL_WATCHDOG_INTERVAL_MS);
		this.opts.abortSignal?.addEventListener("abort", stopOnAbort, { once: true });
		try {
			await Promise.race([runner.task(), forceCyclePromise]);
			clearForceCycleTimer();
			if (this.opts.abortSignal?.aborted) return "exit";
			const reason = stalledRestart ? "polling stall detected" : this.#forceRestarted ? "unhandled network error" : "runner stopped (maxRetryTime exceeded or graceful stop)";
			this.#forceRestarted = false;
			this.opts.log(`[telegram][diag] polling cycle finished reason=${reason} ${liveness.formatDiagnosticFields("error")}`);
			return await this.#waitBeforeRestart((delay) => `Telegram polling runner stopped (${reason}); restarting in ${delay}.`, { stopTimedOut }) ? "continue" : "exit";
		} catch (err) {
			this.#forceRestarted = false;
			if (this.opts.abortSignal?.aborted) throw err;
			const isConflict = isGetUpdatesConflict(err);
			if (isConflict) this.#webhookCleared = false;
			const isRecoverable = isRecoverableTelegramNetworkError(err, { context: "polling" });
			if (isRecoverable || isConflict) this.#transportState.markDirty();
			if (!isConflict && !isRecoverable) throw err;
			const reason = isConflict ? "getUpdates conflict" : "network error";
			const errMsg = formatErrorMessage(err);
			const conflictHint = isConflict ? TELEGRAM_GET_UPDATES_CONFLICT_HINT : "";
			this.opts.log(`[telegram][diag] polling cycle error reason=${reason} ${liveness.formatDiagnosticFields("lastGetUpdatesError")} err=${errMsg}${conflictHint}`);
			if (isConflict) this.#status.notePollingError(`Telegram ${reason}: ${errMsg}.${conflictHint}`);
			clearForceCycleTimer();
			return await this.#waitBeforeRestart((delay) => `Telegram ${reason}: ${errMsg};${conflictHint} retrying in ${delay}.`) ? "continue" : "exit";
		} finally {
			clearInterval(watchdog);
			clearForceCycleTimer();
			this.opts.abortSignal?.removeEventListener("abort", abortFetch);
			this.opts.abortSignal?.removeEventListener("abort", stopOnAbort);
			await waitForGracefulStop(stopRunner);
			await waitForGracefulStop(stopBot);
			this.#activeRunner = void 0;
			if (this.#activeCycleAbort === fetchAbortController) this.#activeCycleAbort = void 0;
		}
	}
};
const isGetUpdatesConflict = (err) => {
	if (!err || typeof err !== "object") return false;
	const typed = err;
	if ((typed.error_code ?? typed.errorCode) !== 409) return false;
	return normalizeLowercaseStringOrEmpty([
		typed.method,
		typed.description,
		typed.message
	].filter((value) => typeof value === "string").join(" ")).includes("getupdates");
};
//#endregion
export { TelegramPollingSession, deleteTelegramUpdateOffset, readTelegramUpdateOffset, writeTelegramUpdateOffset };
