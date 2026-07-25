import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import childProcess from "node:child_process";
function readProcessStartTime(pid) {
	if (!Number.isSafeInteger(pid) || pid <= 0) return null;
	if (process.platform === "darwin") try {
		const startedAt = childProcess.execFileSync("/bin/ps", [
			"-o",
			"lstart=",
			"-p",
			String(pid)
		], {
			encoding: "utf8",
			env: {
				...process.env,
				LC_ALL: "C",
				TZ: "UTC"
			},
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			],
			timeout: 2e3,
			killSignal: "SIGKILL"
		}).trim();
		const startedAtMs = Date.parse(`${startedAt} UTC`);
		return Number.isFinite(startedAtMs) ? Math.floor(startedAtMs / 1e3) : null;
	} catch {
		return null;
	}
	if (process.platform !== "linux") return null;
	try {
		const stat = fs.readFileSync(`/proc/${pid}/stat`, "utf8");
		const commEndIndex = stat.lastIndexOf(")");
		if (commEndIndex < 0) return null;
		const fields = stat.slice(commEndIndex + 1).trimStart().split(/\s+/);
		const starttime = Number(fields[19]);
		return Number.isInteger(starttime) && starttime >= 0 ? starttime : null;
	} catch {
		return null;
	}
}
const INGRESS_CLAIM_PROCESS_START_TIME = readProcessStartTime(process.pid);
const INGRESS_CLAIM_PROCESS_ID = [
	process.pid,
	INGRESS_CLAIM_PROCESS_START_TIME ?? "x",
	randomUUID()
].join(":");
/** Process-local live drain instance UUIDs (ownerId third field). */
const liveIngressDrainInstanceIds = /* @__PURE__ */ new Set();
function processPidFromOwnerId(ownerId) {
	const pid = Number.parseInt(ownerId.split(":", 1)[0] ?? "", 10);
	return Number.isSafeInteger(pid) && pid > 0 ? pid : -1;
}
/** Instance UUID from ownerId `pid:startToken:uuid`. */
function processInstanceIdFromOwnerId(ownerId) {
	const parts = ownerId.split(":");
	if (parts.length < 3) return null;
	const instanceId = parts[2];
	return instanceId && instanceId.length > 0 ? instanceId : null;
}
/** Mint a unique per-drain ownerId (`pid:startToken:uuid`). Caller registers via drain. */
function createIngressDrainOwnerId() {
	return [
		process.pid,
		INGRESS_CLAIM_PROCESS_START_TIME ?? "x",
		randomUUID()
	].join(":");
}
function registerLiveIngressDrainInstance(ownerId) {
	const instanceId = processInstanceIdFromOwnerId(ownerId);
	if (instanceId) liveIngressDrainInstanceIds.add(instanceId);
}
function deregisterLiveIngressDrainInstance(ownerId) {
	const instanceId = processInstanceIdFromOwnerId(ownerId);
	if (instanceId) liveIngressDrainInstanceIds.delete(instanceId);
}
/**
* True when a same-process drain instance still holds this ownerId.
* Recovery must not steal claims from a live peer drain on the same queue.
*/
function isLiveLocalIngressDrainOwner(ownerId) {
	const instanceId = processInstanceIdFromOwnerId(ownerId);
	return instanceId != null && liveIngressDrainInstanceIds.has(instanceId);
}
function parseOwnerStartToken(ownerId) {
	const parts = ownerId.split(":");
	if (parts.length === 2) return { kind: "existence-only" };
	if (parts.length < 2) return { kind: "missing" };
	const startField = parts[1] ?? "";
	if (startField === "x") return { kind: "existence-only" };
	const starttime = Number(startField);
	if (Number.isSafeInteger(starttime) && starttime >= 0) return {
		kind: "numeric",
		value: starttime
	};
	return { kind: "missing" };
}
function processExists(pid) {
	if (!Number.isSafeInteger(pid) || pid <= 0) return false;
	try {
		process.kill(pid, 0);
		return true;
	} catch (err) {
		const code = err.code;
		return code !== "ESRCH" && code !== "EINVAL";
	}
}
function isFreshClaimOwner(claim, options) {
	const now = options?.now ?? Date.now();
	const maxAgeMs = options?.maxAgeMs ?? 18e5;
	return now - claim.claimedAt < maxAgeMs;
}
function isClaimOwnerProcessInstanceLive(claim, options) {
	const exists = options?.processExists ?? processExists;
	const readStart = options?.readProcessStartTime ?? readProcessStartTime;
	if (!exists(claim.processPid)) return false;
	const startToken = parseOwnerStartToken(claim.processId);
	if (startToken.kind === "missing") return false;
	if (startToken.kind === "existence-only") return true;
	const actualStart = readStart(claim.processPid);
	if (actualStart === null) return true;
	return actualStart === startToken.value;
}
function toOwnerIdentity(claim) {
	return {
		processId: claim.ownerId,
		processPid: processPidFromOwnerId(claim.ownerId),
		claimedAt: claim.claimedAt
	};
}
function resolveOwnerIdentity(claim) {
	const raw = claim.claim;
	if (!raw) return null;
	if ("ownerId" in raw) return toOwnerIdentity(raw);
	return {
		processId: raw.processId,
		processPid: raw.processPid,
		claimedAt: raw.claimedAt
	};
}
/** True when another live process still holds a fresh claim on this event. */
function isIngressClaimOwnedByOtherLiveProcess(claim, options) {
	const owner = resolveOwnerIdentity(claim);
	if (!owner) return false;
	return owner.processId !== INGRESS_CLAIM_PROCESS_ID && owner.processPid !== process.pid && isFreshClaimOwner(owner, options) && isClaimOwnerProcessInstanceLive(owner, options);
}
/** True when a corrupt claimed row is still live-owned by this or another process. */
function isIngressCorruptClaimOwnedByOtherLiveProcess(claim, options) {
	const owner = toOwnerIdentity(claim.claim);
	if (owner.processId === INGRESS_CLAIM_PROCESS_ID) return isFreshClaimOwner(owner, options);
	return owner.processPid !== process.pid && isFreshClaimOwner(owner, options) && isClaimOwnerProcessInstanceLive(owner, options);
}
//#endregion
//#region src/channels/message/ingress-retry-policy.ts
/**
* Generic ingress retry backoff and dead-letter decisions.
*
* Channel-specific non-retryable classification stays out of core; pass it in.
*/
const DEFAULT_INGRESS_RETRY_MAX_ATTEMPTS = 8;
const DEFAULT_INGRESS_RETRY_DEAD_LETTER_MIN_AGE_MS = 1440 * 60 * 1e3;
const DEFAULT_INGRESS_RETRY_BASE_MS = 1e3;
const DEFAULT_INGRESS_RETRY_MAX_MS = 3 * 6e4;
function resolveConfig(config) {
	return {
		maxAttempts: config?.maxAttempts ?? 8,
		deadLetterMinAgeMs: config?.deadLetterMinAgeMs ?? 864e5,
		baseMs: config?.baseMs ?? 1e3,
		maxMs: config?.maxMs ?? 18e4
	};
}
/** Next attempt number after a failed dispatch (1-based for the attempt just finished). */
function resolveIngressAttemptNumber(event) {
	return (event.attempts ?? 0) + 1;
}
/** Remaining backoff delay before a released event may be claimed again. */
function resolveIngressRetryDelayMs(event, config, now = Date.now()) {
	const { baseMs, maxMs } = resolveConfig(config);
	const attempts = event.attempts ?? 0;
	if (!event.lastError || event.lastAttemptAt === void 0 || attempts <= 0) return 0;
	const exponent = Math.min(attempts - 1, 8);
	const delayMs = Math.min(maxMs, baseMs * 2 ** exponent);
	return Math.max(0, event.lastAttemptAt + delayMs - now);
}
/**
* Dead-letter requires BOTH attempt floor and minimum age.
* Over-limit events keep retrying at the capped delay until age is met.
*/
function shouldDeadLetterRetryableIngressEvent(event, attempt, config, now = Date.now()) {
	const { maxAttempts, deadLetterMinAgeMs } = resolveConfig(config);
	return attempt >= maxAttempts && now - event.receivedAt >= deadLetterMinAgeMs;
}
/** Resolve release vs fail for a dispatch error using optional non-retryable hook. */
function resolveIngressFailureDisposition(params) {
	const now = params.now ?? Date.now();
	const attempt = resolveIngressAttemptNumber(params.event);
	const message = params.formatError(params.err);
	const nonRetryable = params.resolveNonRetryableFailure?.(params.err) ?? null;
	if (nonRetryable) return {
		kind: "fail",
		reason: nonRetryable.reason,
		message: nonRetryable.message,
		attempt
	};
	if (shouldDeadLetterRetryableIngressEvent(params.event, attempt, params.config, now)) return {
		kind: "fail",
		reason: "retry-limit-exceeded",
		message,
		attempt
	};
	return {
		kind: "release",
		attempt,
		message
	};
}
/** Abortable delay used by drain retry/backoff loops. */
function sleepIngressRetryDelay(ms, abortSignal) {
	const abortError = () => abortSignal?.reason instanceof Error ? abortSignal.reason : /* @__PURE__ */ new Error("ingress-aborted");
	if (abortSignal?.aborted) return Promise.reject(abortError());
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			abortSignal?.removeEventListener("abort", onAbort);
			resolve();
		}, ms);
		timer.unref?.();
		const onAbort = () => {
			clearTimeout(timer);
			reject(abortError());
		};
		abortSignal?.addEventListener("abort", onAbort, { once: true });
	});
}
//#endregion
//#region src/channels/message/ingress-drain.ts
/**
* Core-owned durable channel-ingress drain.
*
* Owns claim recovery, per-lane serialization, adoption-time complete, retry /
* dead-letter disposition, pre-adoption stall watchdog, and optional supersede.
*/
/** Default claim→adoption stall before dead-lettering with handler-timeout. */
const DEFAULT_INGRESS_ADOPTION_STALL_MS = 300 * 1e3;
/** Bounded tombstone write retries — wedged ownership beats silent double-dispatch. */
const INGRESS_TOMBSTONE_RETRY_MAX_ATTEMPTS = 8;
/**
* Closed error when adoption races a pre-adoption guillotine/supersede, or when
* a claim-token fence rejects complete/fail (lease reclaimed by another owner).
* Callers must stop the turn (abortSignal is also aborted when applicable).
*/
var IngressAdoptionLostError = class extends Error {
	constructor(code) {
		super(`ingress adoption lost: ${code}`);
		this.name = "IngressAdoptionLostError";
		this.code = code;
	}
};
function isIngressAdoptionLostError(error) {
	return error instanceof IngressAdoptionLostError;
}
function resolveLaneKey(record, deriveLaneKey) {
	return deriveLaneKey?.(record) ?? record.laneKey ?? record.id;
}
function sortedKeys(keys) {
	return [...keys].toSorted((a, b) => a.localeCompare(b));
}
/**
* Maps a drain lifecycle onto reply options.
* Single surface: turnAdoptionLifecycle only.
* Marks exclusive admission so collect isolation is not inferred from onAbandoned.
*/
function bindIngressLifecycleToReplyOptions(lifecycle) {
	return { turnAdoptionLifecycle: {
		admission: "exclusive",
		onAdopted: lifecycle.onAdopted,
		onDeferred: lifecycle.onDeferred,
		onAbandoned: lifecycle.onAbandoned,
		abortSignal: lifecycle.abortSignal
	} };
}
/** Creates a channel-agnostic durable ingress drain over an existing queue. */
function createChannelIngressDrain(options) {
	const queue = options.queue;
	const ownerId = options.ownerId ?? createIngressDrainOwnerId();
	registerLiveIngressDrainInstance(ownerId);
	const adoptionStallTimeoutMs = options.adoptionStallTimeoutMs ?? 3e5;
	const claimLeaseMs = options.claimLeaseMs ?? 18e5;
	const now = options.now ?? Date.now;
	const formatError = options.formatError ?? formatErrorMessage;
	const orderBy = options.orderBy ?? "received";
	const scanLimit = options.scanLimit ?? 100;
	const startLimit = options.startLimit ?? 32;
	const activeByLane = /* @__PURE__ */ new Map();
	let disposed = false;
	const log = (message) => {
		options.onLog?.(message);
	};
	const clearStallTimer = (state) => {
		if (state.stallTimer) {
			clearTimeout(state.stallTimer);
			state.stallTimer = void 0;
		}
	};
	const clearClaimRefresh = (state) => {
		if (state.claimRefreshTimer) {
			clearInterval(state.claimRefreshTimer);
			state.claimRefreshTimer = void 0;
		}
	};
	const abortActiveClaims = () => {
		deregisterLiveIngressDrainInstance(ownerId);
		const reason = toErrorObject(options.abortSignal?.reason, "ingress-drain-aborted");
		for (const state of activeByLane.values()) if (state.phase === "dispatching" || state.phase === "deferred") state.abortController.abort(reason);
	};
	if (options.abortSignal?.aborted) abortActiveClaims();
	else options.abortSignal?.addEventListener("abort", abortActiveClaims, { once: true });
	const removeActive = (state) => {
		clearStallTimer(state);
		clearClaimRefresh(state);
		if (activeByLane.get(state.laneKey) === state) activeByLane.delete(state.laneKey);
	};
	const markLeaseReclaimed = (state) => {
		if (state.phase === "settled" || state.guillotined || state.superseded) return;
		state.guillotined = true;
		clearStallTimer(state);
		clearClaimRefresh(state);
		try {
			state.abortController.abort(/* @__PURE__ */ new Error("ingress claim lease reclaimed"));
		} catch {}
	};
	const armClaimRefresh = (state) => {
		clearClaimRefresh(state);
		const intervalMs = Math.max(1, Math.floor(claimLeaseMs / 3));
		state.claimRefreshTimer = setInterval(() => {
			if (state.phase === "settled" || state.guillotined || state.superseded) {
				clearClaimRefresh(state);
				return;
			}
			if (!queue.refreshClaim) return;
			queue.refreshClaim(state.claim, { refreshedAt: now() }).then((refreshed) => {
				if (!refreshed) markLeaseReclaimed(state);
			}).catch(() => void 0);
		}, intervalMs);
		state.claimRefreshTimer.unref?.();
	};
	/**
	* Claim-token fenced writes can throw OR return false when the lease was
	* reclaimed. For complete, false is ownership loss (do not settle success).
	* For release/fail, false means the row is already gone from this owner —
	* treat as done so abandon races do not wedge.
	*/
	const isStopped = () => disposed || options.abortSignal?.aborted === true;
	const commitClaimWriteWithRetry = async (params) => {
		let attempt = 0;
		for (;;) {
			if (attempt > 0 && isStopped()) throw new Error("ingress drain stopped during claim write");
			try {
				if (!await params.write()) {
					if (params.falseMeansReclaimed) throw new IngressAdoptionLostError("reclaimed");
					return;
				}
				return;
			} catch (err) {
				if (isIngressAdoptionLostError(err)) throw err;
				attempt += 1;
				if (isStopped() || attempt >= INGRESS_TOMBSTONE_RETRY_MAX_ATTEMPTS) {
					if (attempt >= INGRESS_TOMBSTONE_RETRY_MAX_ATTEMPTS && !isStopped()) log(`ingress drain: ${params.label} write failed for event ${params.claim.id} after ${attempt} attempt(s); holding claim: ${formatError(err)}`);
					throw err;
				}
				const delayMs = Math.min(DEFAULT_INGRESS_RETRY_MAX_MS, DEFAULT_INGRESS_RETRY_BASE_MS * 2 ** (attempt - 1));
				const displayId = params.claim.id.replace(/^0+(?=\d)/, "") || params.claim.id;
				log(`ingress drain: ${params.label} retry ${attempt}/${INGRESS_TOMBSTONE_RETRY_MAX_ATTEMPTS} for event ${params.claim.id} in ${delayMs}ms: ${formatError(err)}`);
				if (params.label === "tombstone") log(`completion retry ${attempt} scheduled for event ${displayId}`);
				await sleepIngressRetryDelay(delayMs, options.abortSignal);
			}
		}
	};
	const completeClaimWithRetry = async (claim) => {
		await commitClaimWriteWithRetry({
			claim,
			label: "tombstone",
			write: () => queue.complete(claim),
			falseMeansReclaimed: true
		});
	};
	const releaseClaim = async (claim, lastError) => {
		await commitClaimWriteWithRetry({
			claim,
			label: "release",
			write: () => queue.release(claim, lastError === void 0 ? {} : {
				lastError,
				releasedAt: now()
			}),
			falseMeansReclaimed: false
		});
	};
	const failClaim = async (claim, reason, message) => {
		await commitClaimWriteWithRetry({
			claim,
			label: "dead-letter",
			write: () => queue.fail(claim, {
				reason,
				message,
				failedAt: now()
			}),
			falseMeansReclaimed: false
		});
	};
	const applyFailureDisposition = async (claim, err) => {
		const disposition = resolveIngressFailureDisposition({
			err,
			event: claim,
			formatError,
			resolveNonRetryableFailure: options.resolveNonRetryableFailure,
			config: options.retryPolicy,
			now: now()
		});
		if (disposition.kind === "fail") {
			const displayId = claim.id.replace(/^0+(?=\d)/, "") || claim.id;
			log(`spooled update ${displayId} failed with non-retryable ${disposition.reason}: ${disposition.message}; dead-lettered`);
			if (disposition.reason === "retry-limit-exceeded") log(`spooled update ${displayId} on lane ${claim.laneKey ?? displayId} reached retry limit after ${disposition.attempt} attempts; dead-lettered`);
			await failClaim(claim, disposition.reason, disposition.message);
			return;
		}
		const displayId = claim.id.replace(/^0+(?=\d)/, "") || claim.id;
		log(`spooled update ${displayId} failed; keeping for retry: ${disposition.message}`);
		await releaseClaim(claim, disposition.message);
	};
	const createSettleOwner = (state) => {
		let settlePromise;
		let settled = false;
		return async (fn) => {
			if (settled) return;
			if (settlePromise) {
				await settlePromise;
				return;
			}
			settlePromise = (async () => {
				await fn();
				settled = true;
				state.phase = "settled";
				removeActive(state);
			})();
			try {
				await settlePromise;
			} catch (err) {
				settlePromise = void 0;
				throw err;
			}
		};
	};
	const armStallWatchdog = (state) => {
		clearStallTimer(state);
		state.stallTimer = setTimeout(() => {
			if (state.phase !== "dispatching" && state.phase !== "deferred") return;
			const ageMs = now() - state.startedAt;
			const displayId = state.eventId.replace(/^0+(?=\d)/, "") || state.eventId;
			const message = `Channel ingress claim→adoption stalled for event ${displayId} on lane ${state.laneKey} after ${ageMs}ms; marking failed (handler-timeout).`;
			state.guillotined = true;
			clearStallTimer(state);
			log(message);
			try {
				state.abortController.abort(new Error(message));
			} catch {}
			state.settleOnce(async () => {
				await failClaim(state.claim, "handler-timeout", message);
			}).catch((err) => {
				log(`ingress drain: failed to dead-letter stalled event ${displayId}; holding claim: ${formatError(err)}`);
			});
		}, adoptionStallTimeoutMs);
		state.stallTimer.unref?.();
	};
	const createLifecycle = (state) => {
		return {
			abortSignal: state.abortController.signal,
			onAdopted: async () => {
				if (state.guillotined) throw new IngressAdoptionLostError("guillotined");
				if (state.superseded) throw new IngressAdoptionLostError("superseded");
				if (state.phase === "adopted" || state.phase === "settled") return;
				state.phase = "adopted";
				clearStallTimer(state);
				await state.settleOnce(async () => {
					await completeClaimWithRetry(state.claim);
				});
			},
			onDeferred: () => {
				if (state.phase !== "dispatching") return;
				state.phase = "deferred";
			},
			onAdoptionFinalizing: () => {
				if (state.phase !== "dispatching" && state.phase !== "deferred") return;
				if (state.guillotined || state.superseded) return;
				clearStallTimer(state);
			},
			onAbandoned: async () => {
				if (state.phase !== "deferred" && state.phase !== "dispatching") return;
				if (state.guillotined || state.superseded) return;
				clearStallTimer(state);
				await state.settleOnce(async () => {
					await releaseClaim(state.claim, "turn-abandoned");
				}).catch(() => void 0);
			}
		};
	};
	const supersedeActiveIfNeeded = async (candidate, laneKey) => {
		const pending = activeByLane.get(laneKey);
		if (!pending || pending.phase === "adopted" || pending.phase === "settled") return false;
		if (!await options.shouldSupersedePending?.(candidate, pending.claim)) return false;
		const stillPending = activeByLane.get(laneKey);
		if (stillPending !== pending || stillPending.phase === "adopted" || stillPending.phase === "settled" || stillPending.guillotined || stillPending.superseded) return false;
		stillPending.superseded = true;
		clearStallTimer(stillPending);
		try {
			stillPending.abortController.abort(/* @__PURE__ */ new Error("ingress-superseded"));
		} catch {}
		try {
			await stillPending.settleOnce(async () => {
				await completeClaimWithRetry(stillPending.claim);
			});
		} catch (err) {
			log(`ingress drain: failed to tombstone superseded event ${stillPending.eventId}: ${formatError(err)}`);
		}
		return true;
	};
	const runClaimed = (claim, laneKey) => {
		const abortController = new AbortController();
		const state = {
			eventId: claim.id,
			laneKey,
			claim,
			abortController,
			startedAt: now(),
			phase: "dispatching",
			guillotined: false,
			superseded: false,
			task: Promise.resolve(),
			settleOnce: async () => {}
		};
		state.settleOnce = createSettleOwner(state);
		const lifecycle = createLifecycle(state);
		armStallWatchdog(state);
		armClaimRefresh(state);
		state.task = (async () => {
			try {
				const result = await options.dispatchClaimedEvent(claim, lifecycle);
				if (disposed) return;
				if (options.abortSignal?.aborted && result?.kind !== "completed" && result?.kind !== "failed-retryable") return;
				if (state.phase === "settled" || state.phase === "adopted") return;
				if (state.guillotined || state.superseded) return;
				if (result?.kind === "deferred") {
					lifecycle.onDeferred();
					return;
				}
				if (result?.kind === "failed-retryable") {
					clearStallTimer(state);
					await state.settleOnce(async () => {
						await applyFailureDisposition(claim, result.error);
					});
					return;
				}
				if (state.phase === "dispatching") {
					state.phase = "adopted";
					clearStallTimer(state);
					await state.settleOnce(async () => {
						await completeClaimWithRetry(claim);
					});
				}
			} catch (err) {
				if (disposed) return;
				if (options.abortSignal?.aborted) return;
				if (state.phase === "settled") return;
				if (state.guillotined || state.superseded) return;
				if (state.phase === "adopted") {
					log(`ingress drain: post-adoption error for event ${claim.id} while claim held: ${formatError(err)}`);
					return;
				}
				clearStallTimer(state);
				await state.settleOnce(async () => {
					await applyFailureDisposition(claim, err);
				});
			}
		})();
		activeByLane.set(laneKey, state);
		return state;
	};
	const recoverStaleClaims = async () => {
		const activeLanes = new Set(activeByLane.keys());
		return await queue.recoverStaleClaims({
			staleMs: 0,
			now: now(),
			shouldRecover: (claim) => {
				const laneKey = resolveLaneKey(claim, options.deriveLaneKey);
				if (activeLanes.has(laneKey)) return false;
				if (activeByLane.has(laneKey)) return false;
				if (isLiveLocalIngressDrainOwner(claim.claim.ownerId)) return false;
				return !isIngressClaimOwnedByOtherLiveProcess(claim, {
					maxAgeMs: claimLeaseMs,
					now: now()
				});
			},
			shouldRecoverCorrupt: (claim) => {
				if (claim.laneKey && activeLanes.has(claim.laneKey)) return false;
				if (isLiveLocalIngressDrainOwner(claim.claim.ownerId)) return false;
				return !isIngressCorruptClaimOwnedByOtherLiveProcess(claim, {
					maxAgeMs: claimLeaseMs,
					now: now()
				});
			}
		});
	};
	const drainOnce = async (drainOptions) => {
		if (disposed) return { started: 0 };
		const shouldStop = () => disposed || drainOptions?.shouldStop?.() === true || options.abortSignal?.aborted === true;
		await recoverStaleClaims();
		const pending = await queue.listPending({
			limit: "all",
			orderBy
		});
		const claims = await queue.listClaims();
		const activeLaneKeys = new Set([...activeByLane.values()].filter((state) => state.phase !== "settled").map((state) => state.laneKey));
		const claimedLaneKeys = new Set(claims.map((claim) => resolveLaneKey(claim, options.deriveLaneKey)));
		const retryDelayedLaneKeys = /* @__PURE__ */ new Set();
		for (const event of pending) if (resolveIngressRetryDelayMs(event, options.retryPolicy, now()) > 0) retryDelayedLaneKeys.add(resolveLaneKey(event, options.deriveLaneKey));
		const blockedLaneKeys = /* @__PURE__ */ new Set([
			...sortedKeys(activeLaneKeys),
			...sortedKeys(claimedLaneKeys),
			...sortedKeys(retryDelayedLaneKeys)
		]);
		for (const event of pending) {
			if (shouldStop()) break;
			const laneKey = resolveLaneKey(event, options.deriveLaneKey);
			if (await supersedeActiveIfNeeded(event, laneKey)) blockedLaneKeys.delete(laneKey);
		}
		const candidateIds = pending.map((event) => event.id);
		let started = 0;
		while (started < startLimit) {
			if (shouldStop()) break;
			const claimed = await queue.claimNext({
				ownerId,
				blockedLaneKeys,
				orderBy,
				scanLimit,
				candidateIds,
				deriveLaneKey: options.deriveLaneKey
			});
			if (!claimed) break;
			if (shouldStop()) {
				await queue.release(claimed, { recordAttempt: false });
				break;
			}
			const laneKey = resolveLaneKey(claimed, options.deriveLaneKey);
			const existing = activeByLane.get(laneKey);
			if (existing && existing.phase !== "settled") {
				if (await supersedeActiveIfNeeded(claimed, laneKey)) blockedLaneKeys.delete(laneKey);
				if (activeByLane.has(laneKey)) {
					await queue.release(claimed, { recordAttempt: false });
					blockedLaneKeys.add(laneKey);
					continue;
				}
			}
			runClaimed(claimed, laneKey);
			blockedLaneKeys.add(laneKey);
			started += 1;
		}
		return { started };
	};
	return {
		recoverStaleClaims,
		drainOnce,
		activeLaneKeys: () => new Set(activeByLane.keys()),
		waitForIdle: async () => {
			const tasks = [...activeByLane.values()].map((state) => state.task);
			await Promise.allSettled(tasks);
		},
		dispose: () => {
			disposed = true;
			options.abortSignal?.removeEventListener("abort", abortActiveClaims);
			deregisterLiveIngressDrainInstance(ownerId);
			const activeStates = Array.from(activeByLane.values());
			for (const state of activeStates) {
				clearStallTimer(state);
				if (state.phase === "dispatching" || state.phase === "deferred") try {
					state.abortController.abort(/* @__PURE__ */ new Error("ingress-drain-disposed"));
				} catch {}
				removeActive(state);
			}
		}
	};
}
//#endregion
export { DEFAULT_INGRESS_RETRY_DEAD_LETTER_MIN_AGE_MS as a, processPidFromOwnerId as c, isIngressAdoptionLostError as i, bindIngressLifecycleToReplyOptions as n, DEFAULT_INGRESS_RETRY_MAX_ATTEMPTS as o, createChannelIngressDrain as r, INGRESS_CLAIM_PROCESS_ID as s, DEFAULT_INGRESS_ADOPTION_STALL_MS as t };
