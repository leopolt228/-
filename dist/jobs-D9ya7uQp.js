import { c as normalizeOptionalString, u as normalizeOptionalThreadValue } from "./string-coerce-DW4mBlAt.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-COWbwBfI.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { u as normalizeOptionalAgentId } from "./session-key-Drrs61Fd.js";
import { t as shouldDefaultCronDeliveryToAnnounce } from "./delivery-defaults-vgPfq_jw.js";
import { t as parseAbsoluteTimeMs } from "./parse-mvoz8PbH.js";
import { i as coerceFiniteScheduleNumber, n as normalizePayloadToSystemText, r as normalizeRequiredName } from "./normalize-BuYGN5hz.js";
import { t as assertSafeCronSessionTargetId } from "./session-target-DJsUULzX.js";
import { n as resolveCronStaggerMs, r as resolveDefaultCronStaggerMs, t as normalizeCronStaggerMs } from "./stagger-D-EV0PpM.js";
import { t as parseCronPacingBounds } from "./pacing-DJkK49TC.js";
import { s as isCronJobActive } from "./active-jobs-BSWUEHJl.js";
import { t as normalizeHttpWebhookUrl } from "./webhook-url-BOvGxtq0.js";
import { n as resolveCronTriggerMinIntervalMs } from "./cron-limits-txevLFpr.js";
import { n as resolveCronDeliveryPlan } from "./delivery-plan-DNk_xIW4.js";
import { n as computePreviousRunAtMs, t as computeNextRunAtMs } from "./schedule-kOGACmyF.js";
import crypto from "node:crypto";
function clampPositiveInteger(value, fallback, maximum) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return fallback;
	return Math.min(maximum, Math.max(1, Math.floor(value)));
}
/** Applies the persisted defaults and hard caps for unattended script payloads. */
function normalizeCronScriptPayload(payload) {
	return {
		...payload,
		script: payload.script.trim(),
		timeoutSeconds: clampPositiveInteger(payload.timeoutSeconds, 300, 900),
		toolBudget: clampPositiveInteger(payload.toolBudget, 50, 200)
	};
}
//#endregion
//#region src/cron/service/initial-delivery.ts
/** Resolves create-time default delivery for new cron jobs. */
/**
* Resolves default cron delivery for new jobs when callers omit explicit delivery config.
* This is the direct-service contract: supported creation paths (gateway `cron.add`,
* agent cron tool) already fill delivery in `normalizeCronJobCreate`, so this default
* only governs callers that reach `CronService.add`/declarative convergence directly.
* The shared predicate keeps this contract consistent across write-time,
* read-time, and service-bypass paths.
*/
function resolveInitialCronDelivery(input) {
	if (input.delivery) return input.delivery;
	if (shouldDefaultCronDeliveryToAnnounce({
		payloadKind: input.payload.kind,
		sessionTarget: input.sessionTarget
	})) return { mode: "announce" };
}
//#endregion
//#region src/cron/service/payload-merge.ts
function applyToolsAllowPatch(payload, patch, existing) {
	if (Array.isArray(patch.toolsAllow)) {
		payload.toolsAllow = patch.toolsAllow;
		const existingDefaultUnchanged = existing?.toolsAllowIsDefault === true && toolsAllowEqual(existing, patch);
		const installsDefault = patch.toolsAllowIsDefault === true && existing?.toolsAllowIsDefault !== true;
		if (existingDefaultUnchanged || installsDefault) payload.toolsAllowIsDefault = true;
		else delete payload.toolsAllowIsDefault;
	} else if (patch.toolsAllow === null) {
		delete payload.toolsAllow;
		delete payload.toolsAllowIsDefault;
	}
}
function toolsAllowEqual(left, right) {
	const rightToolsAllow = right.toolsAllow;
	return Array.isArray(left.toolsAllow) && Array.isArray(rightToolsAllow) && left.toolsAllow.length === rightToolsAllow.length && left.toolsAllow.every((toolName, index) => toolName === rightToolsAllow[index]);
}
function mergeCronPayload(existing, patch) {
	if (patch.kind !== existing.kind) {
		const next = buildPayloadFromPatch(patch);
		if (patch.toolsAllow === void 0 && Array.isArray(existing.toolsAllow)) {
			next.toolsAllow = [...existing.toolsAllow];
			if (existing.toolsAllowIsDefault === true) next.toolsAllowIsDefault = true;
		}
		return next;
	}
	if (patch.kind === "systemEvent") {
		if (existing.kind !== "systemEvent") return buildPayloadFromPatch(patch);
		const text = typeof patch.text === "string" ? patch.text : existing.text;
		const next = {
			...existing,
			text
		};
		applyToolsAllowPatch(next, patch, existing);
		return next;
	}
	if (patch.kind === "command") {
		if (existing.kind !== "command") return buildPayloadFromPatch(patch);
		const next = { ...existing };
		if (Array.isArray(patch.argv)) next.argv = patch.argv;
		if (typeof patch.cwd === "string") next.cwd = patch.cwd;
		if (patch.env && typeof patch.env === "object" && !Array.isArray(patch.env)) next.env = patch.env;
		if (typeof patch.input === "string") next.input = patch.input;
		if (typeof patch.timeoutSeconds === "number") next.timeoutSeconds = patch.timeoutSeconds;
		if (typeof patch.noOutputTimeoutSeconds === "number") next.noOutputTimeoutSeconds = patch.noOutputTimeoutSeconds;
		if (typeof patch.outputMaxBytes === "number") next.outputMaxBytes = patch.outputMaxBytes;
		applyToolsAllowPatch(next, patch, existing);
		return next;
	}
	if (patch.kind === "script") {
		if (existing.kind !== "script") return buildPayloadFromPatch(patch);
		const next = { ...existing };
		if (typeof patch.script === "string") next.script = patch.script;
		if (typeof patch.timeoutSeconds === "number") next.timeoutSeconds = patch.timeoutSeconds;
		if (typeof patch.toolBudget === "number") next.toolBudget = patch.toolBudget;
		applyToolsAllowPatch(next, patch, existing);
		return next;
	}
	if (existing.kind !== "agentTurn") return buildPayloadFromPatch(patch);
	const next = { ...existing };
	if (typeof patch.message === "string") next.message = patch.message;
	if (typeof patch.model === "string") next.model = patch.model;
	else if (patch.model === null) delete next.model;
	if (Array.isArray(patch.fallbacks)) next.fallbacks = patch.fallbacks;
	else if (patch.fallbacks === null) delete next.fallbacks;
	applyToolsAllowPatch(next, patch, existing);
	if (typeof patch.thinking === "string") next.thinking = patch.thinking;
	else if (patch.thinking === null) delete next.thinking;
	if (typeof patch.timeoutSeconds === "number") next.timeoutSeconds = patch.timeoutSeconds;
	if (typeof patch.lightContext === "boolean") next.lightContext = patch.lightContext;
	if (typeof patch.allowUnsafeExternalContent === "boolean") next.allowUnsafeExternalContent = patch.allowUnsafeExternalContent;
	return next;
}
function buildPayloadFromPatch(patch) {
	if (patch.kind === "systemEvent") {
		if (typeof patch.text !== "string" || patch.text.length === 0) throw new Error("cron.update payload.kind=\"systemEvent\" requires text");
		const next = {
			kind: "systemEvent",
			text: patch.text
		};
		applyToolsAllowPatch(next, patch);
		return next;
	}
	if (patch.kind === "command") {
		if (!Array.isArray(patch.argv) || patch.argv.length === 0) throw new Error("cron.update payload.kind=\"command\" requires argv");
		const next = {
			kind: "command",
			argv: patch.argv,
			cwd: patch.cwd,
			env: patch.env,
			input: patch.input,
			timeoutSeconds: patch.timeoutSeconds,
			noOutputTimeoutSeconds: patch.noOutputTimeoutSeconds,
			outputMaxBytes: patch.outputMaxBytes
		};
		applyToolsAllowPatch(next, patch);
		return next;
	}
	if (patch.kind === "script") {
		if (typeof patch.script !== "string" || patch.script.trim().length === 0) throw new Error("cron.update payload.kind=\"script\" requires script");
		const next = {
			kind: "script",
			script: patch.script,
			timeoutSeconds: patch.timeoutSeconds,
			toolBudget: patch.toolBudget
		};
		applyToolsAllowPatch(next, patch);
		return next;
	}
	if (typeof patch.message !== "string" || patch.message.length === 0) throw new Error("cron.update payload.kind=\"agentTurn\" requires message");
	const next = {
		kind: "agentTurn",
		message: patch.message,
		model: typeof patch.model === "string" ? patch.model : void 0,
		fallbacks: Array.isArray(patch.fallbacks) ? patch.fallbacks : void 0,
		thinking: typeof patch.thinking === "string" ? patch.thinking : void 0,
		timeoutSeconds: patch.timeoutSeconds,
		lightContext: patch.lightContext,
		allowUnsafeExternalContent: patch.allowUnsafeExternalContent
	};
	applyToolsAllowPatch(next, patch);
	return next;
}
//#endregion
//#region src/cron/service/run-admission.ts
function resolveRunConcurrency() {
	return 8;
}
function dispatchWaiters(state) {
	const admission = state.runAdmission;
	if (state.stopped) {
		cancelCronRunAdmissionWaiters(state);
		return;
	}
	const maxConcurrentRuns = resolveRunConcurrency();
	while (admission.active < maxConcurrentRuns) {
		const waiter = admission.waiters.shift();
		if (!waiter) return;
		admission.active += 1;
		let released = false;
		waiter(() => {
			if (released) return;
			released = true;
			admission.active -= 1;
			dispatchWaiters(state);
		});
	}
}
async function acquireCronRunAdmission(state) {
	const admission = state.runAdmission;
	if (state.stopped) return null;
	if (admission.waiters.length === 0 && admission.active < resolveRunConcurrency()) {
		admission.active += 1;
		let released = false;
		return () => {
			if (released) return;
			released = true;
			admission.active -= 1;
			dispatchWaiters(state);
		};
	}
	return await new Promise((resolve) => {
		admission.waiters.push(resolve);
	});
}
/** Wake queued work on stop so each caller can release its durable reservation. */
function cancelCronRunAdmissionWaiters(state) {
	const waiters = state.runAdmission.waiters.splice(0);
	for (const waiter of waiters) waiter(null);
}
/** Track a persisted marker through shared admission and payload execution. */
function reserveQueuedCronRun(state, jobId, reservationAt, opts) {
	const identity = {};
	state.queuedRunReservationsByJobId.set(jobId, {
		identity,
		markerAtMs: reservationAt,
		preserveWhenDisabled: opts?.preserveWhenDisabled === true
	});
	return identity;
}
function releaseQueuedCronRun(state, jobId, identity) {
	if (state.queuedRunReservationsByJobId.get(jobId)?.identity !== identity) return false;
	state.queuedRunReservationsByJobId.delete(jobId);
	return true;
}
function isQueuedCronRunReservationCurrent(state, jobId, identity) {
	return state.queuedRunReservationsByJobId.get(jobId)?.identity === identity;
}
function updateQueuedCronRunReservationMarker(state, jobId, identity, runningAtMs, previousLastError) {
	const reservation = state.queuedRunReservationsByJobId.get(jobId);
	if (reservation?.identity !== identity) return false;
	reservation.markerAtMs = runningAtMs;
	reservation.activationPreviousLastError = { value: previousLastError };
	return true;
}
function restoreQueuedCronRunReservationLastError(state, jobId, identity, jobState) {
	const reservation = state.queuedRunReservationsByJobId.get(jobId);
	if (reservation?.identity === identity && reservation.activationPreviousLastError) jobState.lastError = reservation.activationPreviousLastError.value;
}
/** Clear a locally owned reservation, including a persisted-but-unstarted activation. */
function clearQueuedCronRunReservationMarker(state, jobId, identity, jobState) {
	const reservation = state.queuedRunReservationsByJobId.get(jobId);
	if (reservation?.identity !== identity) return false;
	const queuedMatches = reservation.markerAtMs === jobState.queuedAtMs;
	const runningMatches = reservation.markerAtMs === jobState.runningAtMs;
	if (!queuedMatches && !runningMatches) return false;
	restoreQueuedCronRunReservationLastError(state, jobId, identity, jobState);
	if (queuedMatches) delete jobState.queuedAtMs;
	if (runningMatches) delete jobState.runningAtMs;
	return true;
}
function isQueuedCronRunReservationMarkerCurrent(state, jobId, identity, runningAtMs) {
	const reservation = state.queuedRunReservationsByJobId.get(jobId);
	return reservation?.identity === identity && reservation.markerAtMs === runningAtMs;
}
/** A matching process-local record means this durable queued or running marker is still owned. */
function isQueuedCronRun(state, jobId, queuedAtMs) {
	return state.queuedRunReservationsByJobId.get(jobId)?.markerAtMs === queuedAtMs;
}
/** A disabled job can retain only a force reservation that predated the disabled state. */
function isQueuedForceCronRun(state, jobId, markerAtMs) {
	const reservation = state.queuedRunReservationsByJobId.get(jobId);
	return reservation?.markerAtMs === markerAtMs && reservation.preserveWhenDisabled;
}
/**
* Apply one service-level cap to every cron execution source. Queue waiters
* keep their job reservation, then recheck scheduler state before execution.
*/
async function runWithCronAdmission(state, execute) {
	const release = await acquireCronRunAdmission(state);
	if (!release) return { kind: "stopped" };
	try {
		return {
			kind: "admitted",
			value: await execute()
		};
	} finally {
		release();
	}
}
//#endregion
//#region src/cron/service/jobs.ts
/** Cron job scheduling, validation, creation, and patch helpers. */
const STUCK_RUN_MS = 7200 * 1e3;
const STAGGER_OFFSET_CACHE_MAX = 4096;
const CRON_DECLARATIVE_LABEL_MAX_LENGTH = 200;
const staggerOffsetCache = /* @__PURE__ */ new Map();
/** Default retry delays applied after consecutive cron execution errors. */
const DEFAULT_ERROR_BACKOFF_SCHEDULE_MS = [
	3e4,
	6e4,
	5 * 6e4,
	15 * 6e4,
	60 * 6e4
];
function isFiniteTimestamp(value) {
	return typeof value === "number" && Number.isFinite(value);
}
/** Returns whether a stored next-run timestamp is finite and schedulable. */
function hasScheduledNextRunAtMs(value) {
	return isFiniteTimestamp(value) && value > 0;
}
/** Resolves the newest persisted cron run status while older state is still readable. */
function resolveJobLastRunStatus(job) {
	return job.state.lastRunStatus ?? job.state.lastStatus;
}
/** Resolves the retry backoff delay for a one-based consecutive error count. */
function errorBackoffMs(consecutiveErrors, scheduleMs = DEFAULT_ERROR_BACKOFF_SCHEDULE_MS) {
	const idx = Math.min(consecutiveErrors - 1, scheduleMs.length - 1);
	return expectDefined(scheduleMs[Math.max(0, idx)], "schedule ms entry at math.max(0, idx)") ?? DEFAULT_ERROR_BACKOFF_SCHEDULE_MS[0];
}
/** Returns the earliest retry timestamp after a failed cron run and its runtime duration. */
function resolveJobErrorBackoffUntilMs(job, scheduleMs = DEFAULT_ERROR_BACKOFF_SCHEDULE_MS) {
	if (resolveJobLastRunStatus(job) !== "error" || !isFiniteTimestamp(job.state.lastRunAtMs)) return;
	const consecutiveErrorsRaw = job.state.consecutiveErrors;
	const consecutiveErrors = typeof consecutiveErrorsRaw === "number" && Number.isFinite(consecutiveErrorsRaw) ? Math.max(1, Math.floor(consecutiveErrorsRaw)) : 1;
	const lastDurationMs = typeof job.state.lastDurationMs === "number" && Number.isFinite(job.state.lastDurationMs) ? Math.max(0, Math.floor(job.state.lastDurationMs)) : 0;
	return job.state.lastRunAtMs + lastDurationMs + errorBackoffMs(consecutiveErrors, scheduleMs);
}
function resolveStableCronOffsetMs(jobId, staggerMs) {
	if (staggerMs <= 1) return 0;
	const cacheKey = `${staggerMs}:${jobId}`;
	const cached = staggerOffsetCache.get(cacheKey);
	if (cached !== void 0) return cached;
	const offset = crypto.createHash("sha256").update(jobId).digest().readUInt32BE(0) % staggerMs;
	if (staggerOffsetCache.size >= STAGGER_OFFSET_CACHE_MAX) {
		const first = staggerOffsetCache.keys().next();
		if (!first.done) staggerOffsetCache.delete(first.value);
	}
	staggerOffsetCache.set(cacheKey, offset);
	return offset;
}
function computeStaggeredCronNextRunAtMs(job, nowMs) {
	if (job.schedule.kind !== "cron") return computeNextRunAtMs(job.schedule, nowMs);
	const staggerMs = resolveCronStaggerMs(job.schedule);
	const offsetMs = resolveStableCronOffsetMs(job.id, staggerMs);
	if (offsetMs <= 0) return computeNextRunAtMs(job.schedule, nowMs);
	let cursorMs = Math.max(0, nowMs - offsetMs);
	for (let attempt = 0; attempt < 4; attempt += 1) {
		const baseNext = computeNextRunAtMs(job.schedule, cursorMs);
		if (baseNext === void 0) return;
		const shifted = baseNext + offsetMs;
		if (shifted > nowMs) return shifted;
		cursorMs = Math.max(cursorMs + 1, baseNext + 1e3);
	}
}
function computeStaggeredCronPreviousRunAtMs(job, nowMs) {
	if (job.schedule.kind !== "cron") return;
	const staggerMs = resolveCronStaggerMs(job.schedule);
	const offsetMs = resolveStableCronOffsetMs(job.id, staggerMs);
	if (offsetMs <= 0) return computePreviousRunAtMs(job.schedule, nowMs);
	let cursorMs = Math.max(0, nowMs - offsetMs);
	for (let attempt = 0; attempt < 4; attempt += 1) {
		const basePrevious = computePreviousRunAtMs(job.schedule, cursorMs);
		if (basePrevious === void 0) return;
		const shifted = basePrevious + offsetMs;
		if (shifted <= nowMs) return shifted;
		cursorMs = Math.max(0, basePrevious - 1e3);
	}
}
function computeStaggeredCronPreviousRunAtOrBeforeMs(job, nowMs) {
	const previous = computeStaggeredCronPreviousRunAtMs(job, nowMs);
	const probeMs = nowMs + 1e3;
	if (!Number.isFinite(probeMs)) return previous;
	const boundary = computeStaggeredCronPreviousRunAtMs(job, probeMs);
	if (isFiniteTimestamp(boundary) && boundary <= nowMs && (!isFiniteTimestamp(previous) || boundary > previous)) return boundary;
	return previous;
}
function isStaggeredCronRunAtMs(job, runAtMs) {
	if (job.schedule.kind !== "cron" || !isFiniteTimestamp(runAtMs)) return false;
	return computeStaggeredCronPreviousRunAtOrBeforeMs(job, runAtMs) === runAtMs;
}
function isPendingErrorBackoffSlot(params) {
	const { job, nextRunAtMs, nowMs } = params;
	const backoffUntilMs = resolveJobErrorBackoffUntilMs(job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
	return backoffUntilMs !== void 0 && nowMs < backoffUntilMs && nextRunAtMs <= backoffUntilMs;
}
function shouldRepairFutureCronNextRunAtMs(params) {
	const { state, job, nowMs } = params;
	const nextRun = job.state.nextRunAtMs;
	if (job.schedule.kind !== "cron" || !hasScheduledNextRunAtMs(nextRun) || nowMs >= nextRun || typeof job.state.queuedAtMs === "number" || typeof job.state.runningAtMs === "number") return false;
	if (isPendingErrorBackoffSlot({
		state,
		job,
		nextRunAtMs: nextRun,
		nowMs
	})) return false;
	let naturalNext;
	try {
		naturalNext = computeStaggeredCronNextRunAtMs(job, nowMs);
	} catch {
		return false;
	}
	if (!isFiniteTimestamp(naturalNext)) return false;
	let isScheduledSlot;
	try {
		isScheduledSlot = isStaggeredCronRunAtMs(job, nextRun);
	} catch {
		return false;
	}
	if (isScheduledSlot) return false;
	if (nextRun < naturalNext) return job.payload.kind !== "agentTurn";
	if (nextRun === naturalNext) return false;
	let followingNaturalNext;
	try {
		followingNaturalNext = computeStaggeredCronNextRunAtMs(job, naturalNext);
	} catch {
		return false;
	}
	if (!isFiniteTimestamp(followingNaturalNext)) return false;
	const naturalIntervalMs = followingNaturalNext - naturalNext;
	return naturalIntervalMs > 0 && nextRun >= followingNaturalNext + naturalIntervalMs;
}
function resolveEveryAnchorMs(params) {
	const coerced = coerceFiniteScheduleNumber(params.schedule.anchorMs);
	if (coerced !== void 0) return Math.max(0, Math.floor(coerced));
	if (isFiniteTimestamp(params.fallbackAnchorMs)) return Math.max(0, Math.floor(params.fallbackAnchorMs));
	return 0;
}
/** Validates that session target and payload kind form a supported cron job shape. */
function assertSupportedJobSpec(job) {
	if (typeof job.sessionTarget !== "string") throw new Error("cron job is missing sessionTarget; expected \"main\", \"isolated\", \"current\", or \"session:<id>\"");
	const isIsolatedLike = job.sessionTarget === "isolated" || job.sessionTarget === "current" || job.sessionTarget.startsWith("session:");
	if (job.sessionTarget.startsWith("session:")) assertSafeCronSessionTargetId(job.sessionTarget.slice(8));
	if (job.sessionTarget === "main" && job.payload.kind !== "systemEvent" && job.payload.kind !== "script") throw new Error("main cron jobs require payload.kind=\"systemEvent\" or \"script\"");
	if (job.payload.kind === "script" && job.sessionTarget !== "main" && job.sessionTarget !== "isolated") throw new Error("script cron jobs require sessionTarget=\"main\" or \"isolated\"");
	if (isIsolatedLike && job.payload.kind !== "agentTurn" && job.payload.kind !== "command" && !(job.sessionTarget === "isolated" && job.payload.kind === "script")) throw new Error("isolated cron jobs require payload.kind=\"agentTurn\", \"command\", or \"script\"; script payloads do not support current/session targets");
}
function assertScriptPayloadSupport(job, opts) {
	if (job.payload.kind !== "script") return;
	if (!job.payload.script.trim()) throw new Error("cron script payload must not be empty");
	if (job.trigger) throw new Error("cron script payloads cannot be combined with a condition trigger");
	if (opts?.requireEnabled && opts.cronConfig?.triggers?.enabled !== true) throw new Error("cron script payloads are disabled; set cron.triggers.enabled=true to allow unattended scripts");
}
function assertTriggerSupport(job, opts) {
	if (!job.trigger) return;
	if (opts?.requireEnabled && opts.cronConfig?.triggers?.enabled !== true) throw new Error("cron triggers are disabled; set cron.triggers.enabled=true");
	if (job.schedule.kind !== "every" && job.schedule.kind !== "cron") throw new Error("cron triggers require an every or cron schedule");
	const minIntervalMs = resolveCronTriggerMinIntervalMs();
	if (job.schedule.kind === "every" && job.schedule.everyMs < minIntervalMs) throw new Error(`cron trigger every interval must be at least ${minIntervalMs}ms`);
}
function assertPacingSupport(job) {
	if (job.pacing === void 0) return;
	parseCronPacingBounds(job.pacing);
	if (job.schedule.kind !== "every" && job.schedule.kind !== "cron") throw new Error("cron pacing requires an every or cron schedule");
}
function assertCronExpressionSatisfiable(job, nowMs) {
	if (job.schedule.kind !== "cron") return;
	if (computeJobNextRunAtMs({
		...job,
		enabled: true
	}, nowMs) !== void 0) return;
	throw new Error(`cron expression "${job.schedule.expr}" has no upcoming run time and would never fire`);
}
function assertMainSessionAgentId(job, defaultAgentId) {
	if (job.sessionTarget !== "main") return;
	if (!job.agentId) return;
	if (job.payload.kind === "script") return;
	if (normalizeAgentId(job.agentId) !== normalizeAgentId(defaultAgentId)) throw new Error(`cron: sessionTarget "main" is only valid for the default agent. Use sessionTarget "isolated" with payload.kind "agentTurn" for non-default agents (agentId: ${job.agentId})`);
}
function assertDeliverySupport(job) {
	if (!job.delivery) return;
	if (job.delivery.mode === "none" && !job.delivery.completionDestination) return;
	if (job.delivery.mode === "webhook") {
		const target = normalizeHttpWebhookUrl(job.delivery.to);
		if (!target) throw new Error("cron webhook delivery requires delivery.to to be a valid http(s) URL");
		job.delivery.to = target;
	}
	if (job.delivery.completionDestination?.mode === "webhook") {
		if (job.delivery.mode !== "announce") throw new Error("cron completion destination webhook is only supported with delivery.mode=\"announce\"");
		const target = normalizeHttpWebhookUrl(job.delivery.completionDestination.to);
		if (!target) throw new Error("cron completion destination webhook requires delivery.completionDestination.to to be a valid http(s) URL");
		job.delivery.completionDestination.to = target;
	}
	if (job.delivery.mode === "none") return;
	if (job.delivery.mode === "webhook") return;
	if (!(job.sessionTarget === "isolated" || job.sessionTarget === "current" || job.sessionTarget.startsWith("session:"))) throw new Error("cron channel delivery config is only supported for sessionTarget=\"isolated\"");
}
function hasConcreteFailureDestination(destination) {
	return Boolean(destination && (destination.channel !== void 0 || destination.to !== void 0 || destination.accountId !== void 0 || destination.mode !== void 0));
}
function assertFailureDestinationSupport(job) {
	const failureDestination = job.delivery?.failureDestination;
	if (!failureDestination) return;
	if (!hasConcreteFailureDestination(failureDestination)) return;
	if (job.sessionTarget === "main" && job.delivery?.mode !== "webhook") throw new Error("cron delivery.failureDestination is only supported for sessionTarget=\"isolated\" unless delivery.mode=\"webhook\"");
	if (failureDestination.mode === "webhook") {
		const target = normalizeHttpWebhookUrl(failureDestination.to);
		if (!target) throw new Error("cron failure destination webhook requires delivery.failureDestination.to to be a valid http(s) URL");
		failureDestination.to = target;
	}
}
/** Finds an in-memory cron job or throws the public unknown-id error. */
function findJobOrThrow(state, id) {
	const job = state.store?.jobs.find((j) => j.id === id);
	if (!job) throw new Error(`unknown cron job id: ${id}`);
	return job;
}
/** Returns the effective enabled flag, defaulting missing values to enabled. */
function isJobEnabled(job) {
	return job.enabled ?? true;
}
/** Computes the next run timestamp for enabled jobs across every/at/cron schedules. */
function computeJobNextRunAtMs(job, nowMs) {
	if (!isJobEnabled(job)) return;
	if (job.schedule.kind === "every") {
		const everyMsRaw = coerceFiniteScheduleNumber(job.schedule.everyMs);
		if (everyMsRaw === void 0) return;
		const everyMs = Math.max(1, Math.floor(everyMsRaw));
		const lastRunAtMs = job.state.lastRunAtMs;
		if (typeof lastRunAtMs === "number" && Number.isFinite(lastRunAtMs)) {
			const nextFromLastRun = Math.floor(lastRunAtMs) + everyMs;
			if (nextFromLastRun > nowMs) return nextFromLastRun;
		}
		const fallbackAnchorMs = isFiniteTimestamp(job.createdAtMs) ? job.createdAtMs : nowMs;
		const anchorMs = resolveEveryAnchorMs({
			schedule: job.schedule,
			fallbackAnchorMs
		});
		const next = computeNextRunAtMs({
			...job.schedule,
			everyMs,
			anchorMs
		}, nowMs);
		return isFiniteTimestamp(next) ? next : void 0;
	}
	if (job.schedule.kind === "at") {
		const atMs = parseAbsoluteTimeMs(job.schedule.at);
		if (resolveJobLastRunStatus(job) === "ok" && job.state.lastRunAtMs) {
			if (atMs !== null && Number.isFinite(atMs) && atMs > job.state.lastRunAtMs) return atMs;
			return;
		}
		return atMs !== null && Number.isFinite(atMs) ? atMs : void 0;
	}
	const next = computeStaggeredCronNextRunAtMs(job, nowMs);
	if (next === void 0 && job.schedule.kind === "cron") return computeStaggeredCronNextRunAtMs(job, Math.floor(nowMs / 1e3) * 1e3 + 1e3);
	return isFiniteTimestamp(next) ? next : void 0;
}
/** Computes the previous effective cron timestamp, including per-job staggering. */
function computeJobPreviousRunAtMs(job, nowMs) {
	if (!isJobEnabled(job) || job.schedule.kind !== "cron") return;
	const previous = computeStaggeredCronPreviousRunAtMs(job, nowMs);
	return isFiniteTimestamp(previous) ? previous : void 0;
}
/** Computes the latest effective cron timestamp at or before the supplied time. */
function computeJobPreviousRunAtOrBeforeMs(job, nowMs) {
	if (!isJobEnabled(job) || job.schedule.kind !== "cron") return;
	const previous = computeStaggeredCronPreviousRunAtOrBeforeMs(job, nowMs);
	return isFiniteTimestamp(previous) ? previous : void 0;
}
/** Maximum consecutive schedule errors before auto-disabling a job. */
const MAX_SCHEDULE_ERRORS = 3;
/** Records a schedule-computation failure and auto-disables after repeated errors. */
function recordScheduleComputeError(params) {
	const { state, job, err } = params;
	const errorCount = (job.state.scheduleErrorCount ?? 0) + 1;
	const errText = String(err);
	job.state.scheduleErrorCount = errorCount;
	job.state.nextRunAtMs = void 0;
	job.state.lastError = `schedule error: ${errText}`;
	if (errorCount >= MAX_SCHEDULE_ERRORS) {
		job.enabled = false;
		state.deps.log.error({
			jobId: job.id,
			name: job.name,
			errorCount,
			err: errText
		}, "cron: auto-disabled job after repeated schedule errors");
		const notifyText = `⚠️ Cron job "${job.name}" has been auto-disabled after ${errorCount} consecutive schedule errors. Last error: ${errText}`;
		const notify = () => {
			state.deps.enqueueSystemEvent(notifyText, {
				agentId: job.agentId,
				sessionKey: job.sessionKey,
				contextKey: `cron:${job.id}:auto-disabled`
			});
			state.deps.requestHeartbeat({
				source: "cron",
				intent: "event",
				reason: `cron:${job.id}:auto-disabled`,
				agentId: job.agentId,
				sessionKey: job.sessionKey
			});
		};
		if (params.deferredAutoDisableNotifications) params.deferredAutoDisableNotifications.push(notify);
		else notify();
	} else state.deps.log.warn({
		jobId: job.id,
		name: job.name,
		errorCount,
		err: errText
	}, "cron: failed to compute next run for job (skipping)");
	return true;
}
function normalizeJobTickState(params) {
	const { state, job, nowMs } = params;
	let changed = false;
	if (!job.state) {
		job.state = {};
		changed = true;
	}
	if (job.schedule.kind === "every") {
		const normalizedAnchorMs = resolveEveryAnchorMs({
			schedule: job.schedule,
			fallbackAnchorMs: isFiniteTimestamp(job.createdAtMs) ? job.createdAtMs : nowMs
		});
		if (job.schedule.anchorMs !== normalizedAnchorMs) {
			job.schedule = {
				...job.schedule,
				anchorMs: normalizedAnchorMs
			};
			job.state.pacedNextRunAtMs = void 0;
			job.state.forcePreservedNextRunAtMs = void 0;
			changed = true;
		}
	}
	if (!isJobEnabled(job)) {
		if (job.state.startupCatchupAtMs !== void 0) {
			job.state.startupCatchupAtMs = void 0;
			changed = true;
		}
		if (job.state.pacedNextRunAtMs !== void 0) {
			job.state.pacedNextRunAtMs = void 0;
			changed = true;
		}
		if (job.state.forcePreservedNextRunAtMs !== void 0) {
			job.state.forcePreservedNextRunAtMs = void 0;
			changed = true;
		}
		if (job.state.nextRunAtMs !== void 0) {
			job.state.nextRunAtMs = void 0;
			changed = true;
		}
		if (job.state.queuedAtMs !== void 0 && !isQueuedForceCronRun(state, job.id, job.state.queuedAtMs)) {
			job.state.queuedAtMs = void 0;
			changed = true;
		}
		if (job.state.runningAtMs !== void 0 && !isQueuedForceCronRun(state, job.id, job.state.runningAtMs) && !isCronJobActive(job.id)) {
			job.state.runningAtMs = void 0;
			changed = true;
		}
		return {
			changed,
			skip: true
		};
	}
	if (!hasScheduledNextRunAtMs(job.state.nextRunAtMs) && job.state.nextRunAtMs !== void 0) {
		job.state.nextRunAtMs = void 0;
		changed = true;
	}
	const forcePreservedNextRunAtMs = job.state.forcePreservedNextRunAtMs;
	if (forcePreservedNextRunAtMs !== void 0 && (!isFiniteTimestamp(forcePreservedNextRunAtMs) || forcePreservedNextRunAtMs !== job.state.nextRunAtMs)) {
		job.state.forcePreservedNextRunAtMs = void 0;
		changed = true;
	}
	const queuedAt = job.state.queuedAtMs;
	if (typeof queuedAt === "number" && nowMs - queuedAt > STUCK_RUN_MS && !isQueuedCronRun(state, job.id, queuedAt)) {
		state.deps.log.warn({
			jobId: job.id,
			queuedAtMs: queuedAt
		}, "cron: clearing stuck queued marker");
		job.state.queuedAtMs = void 0;
		changed = true;
	}
	const runningAt = job.state.runningAtMs;
	if (typeof runningAt === "number" && nowMs - runningAt > STUCK_RUN_MS && !isQueuedCronRun(state, job.id, runningAt)) {
		state.deps.log.warn({
			jobId: job.id,
			runningAtMs: runningAt
		}, "cron: clearing stuck running marker");
		job.state.runningAtMs = void 0;
		changed = true;
		const nextRun = job.state.nextRunAtMs;
		const lastRun = job.state.lastRunAtMs;
		const alreadyExecutedSlot = hasScheduledNextRunAtMs(nextRun) && isFiniteTimestamp(lastRun) && lastRun >= nextRun;
		return {
			changed,
			skip: !alreadyExecutedSlot
		};
	}
	return {
		changed,
		skip: false
	};
}
function walkSchedulableJobs(state, fn, nowMs = state.deps.nowMs()) {
	if (!state.store) return false;
	let changed = false;
	for (const job of state.store.jobs) {
		const tick = normalizeJobTickState({
			state,
			job,
			nowMs
		});
		if (tick.changed) changed = true;
		if (tick.skip) continue;
		if (fn({
			job,
			nowMs
		})) changed = true;
	}
	return changed;
}
function recomputeJobNextRunAtMs(params) {
	let changed = false;
	try {
		let newNext = computeJobNextRunAtMs(params.job, params.nowMs);
		if (params.job.schedule.kind !== "at" && resolveJobLastRunStatus(params.job) === "error" && isFiniteTimestamp(params.job.state.lastRunAtMs)) {
			const backoffFloor = resolveJobErrorBackoffUntilMs(params.job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
			if (newNext !== void 0) newNext = backoffFloor !== void 0 ? Math.max(newNext, backoffFloor) : newNext;
		}
		if (params.job.state.nextRunAtMs !== newNext) {
			params.job.state.nextRunAtMs = newNext;
			changed = true;
		}
		if (params.job.state.scheduleErrorCount) {
			params.job.state.scheduleErrorCount = void 0;
			changed = true;
		}
	} catch (err) {
		if (recordScheduleComputeError({
			state: params.state,
			job: params.job,
			err,
			deferredAutoDisableNotifications: params.deferredAutoDisableNotifications
		})) changed = true;
	}
	return changed;
}
/** Recomputes missing, due, or repairable next-run timestamps for all schedulable jobs. */
function recomputeNextRuns(state) {
	return walkSchedulableJobs(state, ({ job, nowMs: now }) => {
		let changed = false;
		const nextRun = job.state.nextRunAtMs;
		const hasForcePreservedNextRun = isFiniteTimestamp(job.state.forcePreservedNextRunAtMs) && hasScheduledNextRunAtMs(nextRun) && job.state.forcePreservedNextRunAtMs === nextRun;
		const isDueOrMissing = !hasScheduledNextRunAtMs(nextRun) || now >= nextRun;
		if (!hasForcePreservedNextRun && (isDueOrMissing || shouldRepairFutureCronNextRunAtMs({
			state,
			job,
			nowMs: now
		}))) {
			if (recomputeJobNextRunAtMs({
				state,
				job,
				nowMs: now
			})) changed = true;
		}
		return changed;
	});
}
/**
* Maintenance-only version of recomputeNextRuns that handles disabled jobs
* and stuck markers, but does NOT recompute nextRunAtMs for enabled jobs
* with existing values. Used during timer ticks when no due jobs were found
* to prevent silently advancing past-due nextRunAtMs values without execution
* (see #13992).
*/
function recomputeNextRunsForMaintenance(state, opts) {
	const recomputeExpired = opts?.recomputeExpired ?? false;
	const repairFutureCronNextRunAtMs = opts?.repairFutureCronNextRunAtMs ?? true;
	const recomputeJob = (job, nowMs) => recomputeJobNextRunAtMs({
		state,
		job,
		nowMs,
		deferredAutoDisableNotifications: opts?.deferredAutoDisableNotifications
	});
	return walkSchedulableJobs(state, ({ job, nowMs: now }) => {
		let changed = false;
		const startupCatchupAtMs = job.state.startupCatchupAtMs;
		const pacedNextRunAtMs = job.state.pacedNextRunAtMs;
		const nextRunAtMs = job.state.nextRunAtMs;
		const hasForcePreservedNextRun = isFiniteTimestamp(job.state.forcePreservedNextRunAtMs) && hasScheduledNextRunAtMs(nextRunAtMs) && job.state.forcePreservedNextRunAtMs === nextRunAtMs;
		const hasPendingStartupCatchup = isFiniteTimestamp(startupCatchupAtMs) && hasScheduledNextRunAtMs(nextRunAtMs) && startupCatchupAtMs === nextRunAtMs && now < startupCatchupAtMs;
		if (startupCatchupAtMs !== void 0 && !hasPendingStartupCatchup) {
			job.state.startupCatchupAtMs = void 0;
			changed = true;
		}
		const hasPendingPacedNextRun = isFiniteTimestamp(pacedNextRunAtMs) && hasScheduledNextRunAtMs(nextRunAtMs) && pacedNextRunAtMs === nextRunAtMs && (now < pacedNextRunAtMs || opts?.preserveExpiredPacedNextRunJobId === job.id);
		if (pacedNextRunAtMs !== void 0 && !hasPendingPacedNextRun) {
			job.state.pacedNextRunAtMs = void 0;
			changed = true;
		}
		if (!hasScheduledNextRunAtMs(job.state.nextRunAtMs)) {
			if (recomputeJob(job, now)) changed = true;
		} else if (repairFutureCronNextRunAtMs && !hasPendingStartupCatchup && !hasPendingPacedNextRun && !hasForcePreservedNextRun && shouldRepairFutureCronNextRunAtMs({
			state,
			job,
			nowMs: now
		})) {
			if (recomputeJob(job, now)) changed = true;
		} else if (recomputeExpired && !hasForcePreservedNextRun && now >= job.state.nextRunAtMs && typeof job.state.queuedAtMs !== "number" && typeof job.state.runningAtMs !== "number") {
			const lastRun = job.state.lastRunAtMs;
			const alreadyExecutedSlot = isFiniteTimestamp(lastRun) && lastRun >= job.state.nextRunAtMs;
			const backoffUntilMs = resolveJobErrorBackoffUntilMs(job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
			const isStaleBackoffSlot = backoffUntilMs !== void 0 && now < backoffUntilMs && job.state.nextRunAtMs < backoffUntilMs;
			if (alreadyExecutedSlot || isStaleBackoffSlot) {
				if (recomputeJob(job, now)) changed = true;
			}
		}
		return changed;
	}, opts?.nowMs);
}
/** Returns the next enabled wake timestamp from the in-memory cron store. */
function nextWakeAtMs(state) {
	const enabled = (state.store?.jobs ?? []).filter((j) => isJobEnabled(j) && hasScheduledNextRunAtMs(j.state.nextRunAtMs));
	if (enabled.length === 0) return;
	const first = enabled[0]?.state.nextRunAtMs;
	if (!hasScheduledNextRunAtMs(first)) return;
	return enabled.reduce((min, j) => {
		const next = j.state.nextRunAtMs;
		return hasScheduledNextRunAtMs(next) ? Math.min(min, next) : min;
	}, first);
}
/** Creates a normalized cron job row from public add input and computes its initial schedule. */
function createJob(state, input) {
	const now = state.deps.nowMs();
	const id = normalizeOptionalString(input.id) ?? crypto.randomUUID();
	const schedule = input.schedule.kind === "every" ? {
		...input.schedule,
		anchorMs: resolveEveryAnchorMs({
			schedule: input.schedule,
			fallbackAnchorMs: now
		})
	} : input.schedule.kind === "cron" ? (() => {
		const explicitStaggerMs = normalizeCronStaggerMs(input.schedule.staggerMs);
		if (explicitStaggerMs !== void 0) return {
			...input.schedule,
			staggerMs: explicitStaggerMs
		};
		const defaultStaggerMs = resolveDefaultCronStaggerMs(input.schedule.expr);
		return defaultStaggerMs !== void 0 ? {
			...input.schedule,
			staggerMs: defaultStaggerMs
		} : input.schedule;
	})() : input.schedule;
	const deleteAfterRun = typeof input.deleteAfterRun === "boolean" ? input.deleteAfterRun : schedule.kind === "at" ? true : void 0;
	const enabled = typeof input.enabled === "boolean" ? input.enabled : true;
	const declarationKey = normalizeOptionalString(input.declarationKey);
	if (input.declarationKey !== void 0 && !declarationKey) throw new Error("cron declarationKey must not be blank");
	if (declarationKey && declarationKey.length > CRON_DECLARATIVE_LABEL_MAX_LENGTH) throw new Error(`cron declarationKey must be at most ${CRON_DECLARATIVE_LABEL_MAX_LENGTH} characters`);
	const displayName = normalizeOptionalString(input.displayName);
	if (input.displayName !== void 0 && !displayName) throw new Error("cron displayName must not be blank");
	if (displayName && displayName.length > CRON_DECLARATIVE_LABEL_MAX_LENGTH) throw new Error(`cron displayName must be at most ${CRON_DECLARATIVE_LABEL_MAX_LENGTH} characters`);
	const ownerAgentId = normalizeOptionalAgentId(input.owner?.agentId);
	const ownerSessionKey = normalizeOptionalString(input.owner?.sessionKey);
	const job = {
		id,
		...declarationKey ? { declarationKey } : {},
		...displayName ? { displayName } : {},
		...ownerAgentId || ownerSessionKey ? { owner: {
			...ownerAgentId ? { agentId: ownerAgentId } : {},
			...ownerSessionKey ? { sessionKey: ownerSessionKey } : {}
		} } : {},
		agentId: normalizeOptionalAgentId(input.agentId),
		sessionKey: normalizeOptionalString(input.sessionKey),
		name: normalizeRequiredName(input.name),
		description: normalizeOptionalString(input.description),
		enabled,
		deleteAfterRun,
		createdAtMs: now,
		updatedAtMs: now,
		schedule,
		...input.pacing !== void 0 ? { pacing: structuredClone(input.pacing) } : {},
		sessionTarget: input.sessionTarget,
		wakeMode: input.wakeMode,
		payload: input.payload.kind === "script" ? normalizeCronScriptPayload(structuredClone(input.payload)) : input.payload,
		delivery: resolveInitialCronDelivery(input),
		failureAlert: input.failureAlert,
		...input.trigger ? { trigger: structuredClone(input.trigger) } : {},
		state: { ...input.state }
	};
	assertSupportedJobSpec(job);
	assertPacingSupport(job);
	assertTriggerSupport(job, {
		cronConfig: state.deps.cronConfig,
		requireEnabled: job.trigger !== void 0
	});
	assertScriptPayloadSupport(job, {
		cronConfig: state.deps.cronConfig,
		requireEnabled: job.payload.kind === "script"
	});
	assertMainSessionAgentId(job, state.deps.defaultAgentId);
	assertDeliverySupport(job);
	assertFailureDestinationSupport(job);
	assertCronExpressionSatisfiable(job, now);
	job.state.nextRunAtMs = computeJobNextRunAtMs(job, now);
	return job;
}
/** Applies a public cron patch in-place, preserving omitted nested fields and validating the result. */
function applyJobPatch(job, patch, opts) {
	const previousScheduleKind = job.schedule.kind;
	if ("name" in patch) job.name = normalizeRequiredName(patch.name);
	if ("description" in patch) job.description = normalizeOptionalString(patch.description);
	if ("displayName" in patch) {
		const displayName = normalizeOptionalString(patch.displayName);
		if (patch.displayName !== null && patch.displayName !== void 0 && !displayName) throw new Error("cron displayName must not be blank");
		if (displayName && displayName.length > CRON_DECLARATIVE_LABEL_MAX_LENGTH) throw new Error(`cron displayName must be at most ${CRON_DECLARATIVE_LABEL_MAX_LENGTH} characters`);
		if (displayName) job.displayName = displayName;
		else delete job.displayName;
	}
	if (typeof patch.enabled === "boolean") job.enabled = patch.enabled;
	if (typeof patch.deleteAfterRun === "boolean") job.deleteAfterRun = patch.deleteAfterRun;
	else if (patch.schedule?.kind === "at" && (previousScheduleKind === "every" || previousScheduleKind === "cron")) job.deleteAfterRun = true;
	else if (previousScheduleKind === "at" && (patch.schedule?.kind === "every" || patch.schedule?.kind === "cron")) delete job.deleteAfterRun;
	if (patch.schedule) if (patch.schedule.kind === "cron") {
		const explicitStaggerMs = normalizeCronStaggerMs(patch.schedule.staggerMs);
		if (explicitStaggerMs !== void 0) job.schedule = {
			...patch.schedule,
			staggerMs: explicitStaggerMs
		};
		else if (job.schedule.kind === "cron") job.schedule = {
			...patch.schedule,
			staggerMs: job.schedule.staggerMs
		};
		else {
			const defaultStaggerMs = resolveDefaultCronStaggerMs(patch.schedule.expr);
			job.schedule = defaultStaggerMs !== void 0 ? {
				...patch.schedule,
				staggerMs: defaultStaggerMs
			} : patch.schedule;
		}
	} else job.schedule = patch.schedule;
	if ("trigger" in patch) if (patch.trigger === null || patch.trigger === void 0) delete job.trigger;
	else job.trigger = structuredClone(patch.trigger);
	if ("pacing" in patch) if (patch.pacing === null || patch.pacing === void 0) delete job.pacing;
	else job.pacing = structuredClone(patch.pacing);
	if (patch.sessionTarget) job.sessionTarget = patch.sessionTarget;
	if (patch.wakeMode) job.wakeMode = patch.wakeMode;
	if (patch.payload) {
		job.payload = mergeCronPayload(job.payload, patch.payload);
		if (job.payload.kind === "script") job.payload = normalizeCronScriptPayload(job.payload);
	}
	if (patch.delivery) {
		const implicitMode = resolveCronDeliveryPlan(job).mode;
		job.delivery = mergeCronDelivery(job.delivery, patch.delivery, implicitMode);
	}
	if ("failureAlert" in patch) job.failureAlert = mergeCronFailureAlert(job.failureAlert, patch.failureAlert);
	if (job.sessionTarget === "main" && job.delivery?.mode !== "webhook" && hasConcreteFailureDestination(job.delivery?.failureDestination)) throw new Error("cron delivery.failureDestination is only supported for sessionTarget=\"isolated\" unless delivery.mode=\"webhook\"");
	if (job.sessionTarget === "main" && job.delivery?.mode !== "webhook") {
		const failureDestination = job.delivery?.failureDestination;
		job.delivery = failureDestination && !hasConcreteFailureDestination(failureDestination) ? {
			mode: "none",
			failureDestination
		} : void 0;
	}
	if (patch.state) job.state = {
		...job.state,
		...patch.state
	};
	if ("agentId" in patch) job.agentId = normalizeOptionalAgentId(patch.agentId);
	if ("sessionKey" in patch) job.sessionKey = normalizeOptionalString(patch.sessionKey);
	assertSupportedJobSpec(job);
	assertPacingSupport(job);
	assertTriggerSupport(job, {
		cronConfig: opts?.cronConfig,
		requireEnabled: patch.trigger !== null && patch.trigger !== void 0
	});
	assertScriptPayloadSupport(job, {
		cronConfig: opts?.cronConfig,
		requireEnabled: patch.payload?.kind === "script"
	});
	assertMainSessionAgentId(job, opts?.defaultAgentId);
	assertDeliverySupport(job);
	assertFailureDestinationSupport(job);
	if (opts?.scheduleValidationNowMs !== void 0 && (patch.schedule !== void 0 || patch.enabled === true)) assertCronExpressionSatisfiable(job, opts.scheduleValidationNowMs);
}
/** Converges the declared schedule, payload, delivery, and display label only. */
function applyDeclarativeJobSpec(job, input, opts) {
	const displayName = normalizeOptionalString(input.displayName);
	if (input.displayName !== void 0 && !displayName) throw new Error("cron displayName must not be blank");
	if (displayName && displayName.length > CRON_DECLARATIVE_LABEL_MAX_LENGTH) throw new Error(`cron displayName must be at most ${CRON_DECLARATIVE_LABEL_MAX_LENGTH} characters`);
	if (displayName) job.displayName = displayName;
	else delete job.displayName;
	if (input.schedule.kind === "every" && input.schedule.anchorMs === void 0 && job.schedule.kind === "every" && job.schedule.everyMs === input.schedule.everyMs) job.schedule = {
		...input.schedule,
		anchorMs: job.schedule.anchorMs
	};
	else if (input.schedule.kind === "every" && input.schedule.anchorMs === void 0) job.schedule = {
		...input.schedule,
		anchorMs: opts.nowMs
	};
	else if (input.schedule.kind === "cron") {
		const explicitStaggerMs = normalizeCronStaggerMs(input.schedule.staggerMs);
		const defaultStaggerMs = resolveDefaultCronStaggerMs(input.schedule.expr);
		job.schedule = {
			...input.schedule,
			...explicitStaggerMs !== void 0 ? { staggerMs: explicitStaggerMs } : defaultStaggerMs !== void 0 ? { staggerMs: defaultStaggerMs } : {}
		};
	} else job.schedule = structuredClone(input.schedule);
	if (input.pacing !== void 0) job.pacing = structuredClone(input.pacing);
	else delete job.pacing;
	job.payload = input.payload.kind === "script" ? normalizeCronScriptPayload(structuredClone(input.payload)) : structuredClone(input.payload);
	if (input.trigger) job.trigger = structuredClone(input.trigger);
	else delete job.trigger;
	const delivery = resolveInitialCronDelivery(input);
	if (delivery) job.delivery = structuredClone(delivery);
	else delete job.delivery;
	if (opts.enabledExplicit) job.enabled = input.enabled;
	assertTriggerSupport(job, {
		cronConfig: opts.cronConfig,
		requireEnabled: input.trigger !== void 0
	});
	assertScriptPayloadSupport(job, {
		cronConfig: opts.cronConfig,
		requireEnabled: input.payload.kind === "script"
	});
	assertSupportedJobSpec(job);
	assertPacingSupport(job);
	assertMainSessionAgentId(job, opts.defaultAgentId);
	assertDeliverySupport(job);
	assertFailureDestinationSupport(job);
	assertCronExpressionSatisfiable(job, opts.nowMs);
}
function mergeCronDelivery(existing, patch, implicitMode) {
	const hasCompletionDestinationPatch = "completionDestination" in patch;
	const next = {
		mode: existing?.mode ?? implicitMode,
		channel: existing?.channel,
		to: existing?.to,
		threadId: existing?.threadId,
		accountId: existing?.accountId,
		bestEffort: existing?.bestEffort,
		completionDestination: existing?.completionDestination,
		failureDestination: existing?.failureDestination
	};
	if (typeof patch.mode === "string") {
		const previousMode = next.mode;
		next.mode = patch.mode === "deliver" ? "announce" : patch.mode;
		if (previousMode !== next.mode && (previousMode === "webhook" || next.mode === "webhook")) next.to = void 0;
		if (next.mode === "webhook") {
			next.channel = void 0;
			next.threadId = void 0;
			next.accountId = void 0;
		}
		if (!hasCompletionDestinationPatch && (next.mode === "none" || next.mode === "webhook")) next.completionDestination = void 0;
	}
	if ("channel" in patch) next.channel = normalizeOptionalString(patch.channel);
	if ("to" in patch) next.to = normalizeOptionalString(patch.to);
	if ("threadId" in patch) next.threadId = normalizeOptionalThreadValue(patch.threadId);
	if ("accountId" in patch) next.accountId = normalizeOptionalString(patch.accountId);
	if (typeof patch.bestEffort === "boolean") next.bestEffort = patch.bestEffort;
	if (hasCompletionDestinationPatch) if (patch.completionDestination == null) next.completionDestination = void 0;
	else {
		const to = normalizeOptionalString(patch.completionDestination.to);
		next.completionDestination = {
			mode: "webhook",
			...to ? { to } : {}
		};
	}
	if ("failureDestination" in patch) if (patch.failureDestination == null) next.failureDestination = void 0;
	else {
		const existingFd = next.failureDestination;
		const patchFd = patch.failureDestination;
		const nextFd = {};
		if (existingFd) {
			if (Object.hasOwn(existingFd, "channel")) nextFd.channel = existingFd.channel;
			if (Object.hasOwn(existingFd, "to")) nextFd.to = existingFd.to;
			if (Object.hasOwn(existingFd, "accountId")) nextFd.accountId = existingFd.accountId;
			if (Object.hasOwn(existingFd, "mode")) nextFd.mode = existingFd.mode;
		}
		if (patchFd) {
			if ("channel" in patchFd) {
				const channel = normalizeOptionalString(patchFd.channel) ?? "";
				nextFd.channel = channel ? channel : void 0;
			}
			if ("to" in patchFd) {
				const to = normalizeOptionalString(patchFd.to) ?? "";
				nextFd.to = to ? to : void 0;
			}
			if ("accountId" in patchFd) {
				const accountId = normalizeOptionalString(patchFd.accountId) ?? "";
				nextFd.accountId = accountId ? accountId : void 0;
			}
			if ("mode" in patchFd) {
				const mode = normalizeOptionalString(patchFd.mode) ?? "";
				nextFd.mode = mode === "announce" || mode === "webhook" ? mode : void 0;
			}
		}
		next.failureDestination = Object.hasOwn(nextFd, "channel") || Object.hasOwn(nextFd, "to") || Object.hasOwn(nextFd, "accountId") || Object.hasOwn(nextFd, "mode") ? nextFd : void 0;
	}
	if (existing === void 0 && !("mode" in patch) && next.channel === void 0 && next.to === void 0 && next.threadId === void 0 && next.accountId === void 0 && next.bestEffort === void 0 && next.completionDestination === void 0 && next.failureDestination === void 0) return;
	return next;
}
function mergeCronFailureAlert(existing, patch) {
	if (patch === false) return false;
	if (patch === null) return;
	if (patch === void 0) return existing;
	const next = { ...existing === false || existing === void 0 ? {} : existing };
	if ("after" in patch) {
		const after = typeof patch.after === "number" && Number.isFinite(patch.after) ? patch.after : 0;
		next.after = after > 0 ? Math.floor(after) : void 0;
	}
	if ("channel" in patch) next.channel = normalizeOptionalString(patch.channel);
	if ("to" in patch) next.to = normalizeOptionalString(patch.to);
	if ("cooldownMs" in patch) {
		const cooldownMs = typeof patch.cooldownMs === "number" && Number.isFinite(patch.cooldownMs) ? patch.cooldownMs : -1;
		next.cooldownMs = cooldownMs >= 0 ? Math.floor(cooldownMs) : void 0;
	}
	if ("includeSkipped" in patch) next.includeSkipped = typeof patch.includeSkipped === "boolean" ? patch.includeSkipped : void 0;
	if ("mode" in patch) {
		const mode = normalizeOptionalString(patch.mode) ?? "";
		next.mode = mode === "announce" || mode === "webhook" ? mode : void 0;
	}
	if ("accountId" in patch) {
		const accountId = normalizeOptionalString(patch.accountId) ?? "";
		next.accountId = accountId ? accountId : void 0;
	}
	return next;
}
/**
* Covers both durable reservations and the process marker that survives mutable job state.
* Every timer/manual admission path must use this or disable/re-enable can duplicate a run.
*/
function hasActiveCronRun(job) {
	return typeof job.state.queuedAtMs === "number" || typeof job.state.runningAtMs === "number" || isCronJobActive(job.id);
}
/** Returns whether a cron job should execute at `nowMs`, honoring force mode and active runs. */
function isJobDue(job, nowMs, opts) {
	if (!job.state) job.state = {};
	if (hasActiveCronRun(job)) return false;
	if (opts.forced) return true;
	return isJobEnabled(job) && hasScheduledNextRunAtMs(job.state.nextRunAtMs) && nowMs >= job.state.nextRunAtMs;
}
/** Returns main-session queue text for system-event jobs, or undefined when empty/unsupported. */
function resolveJobPayloadTextForMain(job) {
	if (job.payload.kind !== "systemEvent") return;
	const text = normalizePayloadToSystemText(job.payload);
	return text.trim() ? text : void 0;
}
//#endregion
export { runWithCronAdmission as A, clearQueuedCronRunReservationMarker as C, reserveQueuedCronRun as D, releaseQueuedCronRun as E, resolveRunConcurrency as O, cancelCronRunAdmissionWaiters as S, isQueuedCronRunReservationMarkerCurrent as T, recomputeNextRunsForMaintenance as _, computeJobNextRunAtMs as a, resolveJobLastRunStatus as b, createJob as c, hasActiveCronRun as d, hasScheduledNextRunAtMs as f, recomputeNextRuns as g, nextWakeAtMs as h, assertSupportedJobSpec as i, updateQueuedCronRunReservationMarker as j, restoreQueuedCronRunReservationLastError as k, errorBackoffMs as l, isJobEnabled as m, applyDeclarativeJobSpec as n, computeJobPreviousRunAtMs as o, isJobDue as p, applyJobPatch as r, computeJobPreviousRunAtOrBeforeMs as s, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS as t, findJobOrThrow as u, recordScheduleComputeError as v, isQueuedCronRunReservationCurrent as w, resolveJobPayloadTextForMain as x, resolveJobErrorBackoffUntilMs as y };
