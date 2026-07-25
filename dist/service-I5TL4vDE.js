import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { p as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-Crk_c9KW.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { O as resolveOpenClawStateSqlitePath } from "./openclaw-state-db-DkOMT2fb.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { C as isSubagentSessionKey, d as resolveAgentIdFromSessionKey, u as normalizeOptionalAgentId, x as isCronRunSessionKey } from "./session-key-Drrs61Fd.js";
import { t as parseDurationMs } from "./parse-duration-Be19e01j.js";
import { h as runWithGatewayIndependentRootWorkContinuation, r as beginGatewayRootWorkAdmissionWhenOpen, t as GatewayDrainingError } from "./gateway-work-admission-CLw1UuhK.js";
import { n as deliveryContextFromSession } from "./delivery-context.shared-D6zu5SGz.js";
import { gt as listSessionEntries, nt as applySessionEntryLifecycleMutation, yt as loadSessionEntry } from "./session-accessor-Mu3lv_Tl.js";
import { $ as resolveMaintenanceConfig } from "./store-DDuGv_UJ.js";
import { f as resolveFailoverReasonFromError } from "./failover-error-B8xHNn2y.js";
import { a as isRetryableHeartbeatBusySkipReason } from "./heartbeat-wake-CH_r-5du.js";
import { t as buildPendingGeneratedMediaSessionKeySet } from "./task-status-access-CLMWwpdp.js";
import { c as normalizeCronJobIdentityFields, s as cronSchedulingInputsEqual } from "./row-codec-BzovYt5m.js";
import { n as normalizeCronJobInput } from "./normalize-CfE4TIm1.js";
import "./normalize-BuYGN5hz.js";
import { r as isInvalidCronSessionTargetIdError } from "./session-target-DJsUULzX.js";
import { t as getInvalidPersistedCronJobReason } from "./persisted-shape-BR73JfPK.js";
import { n as resolvePacedNextRunAtMs } from "./pacing-DJkK49TC.js";
import { f as saveCronQuarantineFile, r as loadCronJobsStoreWithConfigJobs, u as saveCronJobsStore } from "./store-CFkN1_TJ.js";
import { c as markCronJobActive, n as clearCronJobActive, o as isCronActiveJobMarkerCurrent, s as isCronJobActive } from "./active-jobs-BSWUEHJl.js";
import { i as registerActiveCronTaskRun, o as startActiveCronTaskRunSettlementGrace, s as trackActiveCronTaskRunSettlement } from "./active-run-cancellation-b13k1cU0.js";
import { r as enqueueCommandInLane } from "./command-queue-B2fMJE4M.js";
import { n as AgentDeletionCommitUncertainError, t as AgentDeletionAuthorityRollbackError } from "./agent-lifecycle-registry-CkmkoYeX.js";
import { a as preExecutionTimeoutErrorMessage, c as timeoutErrorMessage, i as normalizeCronRunErrorText, r as isSetupTimeoutErrorText, s as setupTimeoutErrorMessage, t as abortErrorMessage } from "./execution-errors-zetyeuvZ.js";
import { n as resolveCronTriggerMinIntervalMs } from "./cron-limits-txevLFpr.js";
import { n as resolveCronDeliveryPlan, r as resolveFailureDestination } from "./delivery-plan-DNk_xIW4.js";
import { a as normalizeCronRunDiagnostics, n as createCronRunDiagnosticsFromError, o as summarizeCronRunDiagnostics } from "./run-diagnostics-BdlDOlTp.js";
import { i as resolveCronListSnapshotRevision, n as normalizeCronTaskRunJobId } from "./task-run-history-CUPuZknC.js";
import { t as computeNextRunAtMs } from "./schedule-kOGACmyF.js";
import { A as runWithCronAdmission, C as clearQueuedCronRunReservationMarker, D as reserveQueuedCronRun, E as releaseQueuedCronRun, O as resolveRunConcurrency, S as cancelCronRunAdmissionWaiters, T as isQueuedCronRunReservationMarkerCurrent, _ as recomputeNextRunsForMaintenance, a as computeJobNextRunAtMs, b as resolveJobLastRunStatus$1, c as createJob, d as hasActiveCronRun, f as hasScheduledNextRunAtMs, g as recomputeNextRuns, h as nextWakeAtMs, i as assertSupportedJobSpec, j as updateQueuedCronRunReservationMarker, k as restoreQueuedCronRunReservationLastError, l as errorBackoffMs, m as isJobEnabled, n as applyDeclarativeJobSpec, o as computeJobPreviousRunAtMs, p as isJobDue, r as applyJobPatch, s as computeJobPreviousRunAtOrBeforeMs, t as DEFAULT_ERROR_BACKOFF_SCHEDULE_MS, u as findJobOrThrow, v as recordScheduleComputeError, w as isQueuedCronRunReservationCurrent, x as resolveJobPayloadTextForMain, y as resolveJobErrorBackoffUntilMs } from "./jobs-D9ya7uQp.js";
import { a as tryFindFinalizedCronTaskRun, i as tryFindCronTaskRunIdForRecovery, n as resolveMainSessionCronRunSessionKey, o as tryFinishCronTaskRun, r as tryCreateCronTaskRun, s as tryFinishCronTaskRunWithoutHistory } from "./task-runs-DrI8SkHH.js";
import { isDeepStrictEqual } from "node:util";
import pMap, { pMapSkip } from "p-map";
//#region src/cron/service/failure-alerts.ts
/** Resolves and emits cron failure-alert notifications. */
const DEFAULT_FAILURE_ALERT_AFTER = 2;
const DEFAULT_FAILURE_ALERT_COOLDOWN_MS = 60 * 6e4;
/** Returns the last failure-notification delivery trace persisted on a cron job. */
function failureNotificationDeliveryFromJobState(job) {
	const status = job.state.lastFailureNotificationDeliveryStatus;
	if (!status || status === "not-requested") return;
	return {
		delivered: job.state.lastFailureNotificationDelivered,
		status,
		error: job.state.lastFailureNotificationDeliveryError
	};
}
function normalizeCronMessageChannel(input) {
	const channel = normalizeOptionalLowercaseString(input);
	return channel ? channel : void 0;
}
function normalizeTo(input) {
	if (typeof input !== "string") return;
	const to = input.trim();
	return to ? to : void 0;
}
function clampPositiveInt(value, fallback) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	const floored = Math.floor(value);
	return floored >= 1 ? floored : fallback;
}
function clampNonNegativeInt(value, fallback) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	const floored = Math.floor(value);
	return floored >= 0 ? floored : fallback;
}
/** Resolves effective failure-alert policy from job config, delivery defaults, and global cron config. */
function resolveFailureAlert(state, job) {
	const globalConfig = state.deps.cronConfig?.failureAlert;
	const jobConfig = job.failureAlert === false ? void 0 : job.failureAlert;
	if (job.failureAlert === false) return null;
	if (!jobConfig && globalConfig?.enabled !== true) return null;
	const mode = jobConfig?.mode ?? globalConfig?.mode;
	const explicitTo = normalizeTo(jobConfig?.to);
	return {
		after: clampPositiveInt(jobConfig?.after ?? globalConfig?.after, DEFAULT_FAILURE_ALERT_AFTER),
		cooldownMs: clampNonNegativeInt(jobConfig?.cooldownMs ?? globalConfig?.cooldownMs, DEFAULT_FAILURE_ALERT_COOLDOWN_MS),
		channel: normalizeCronMessageChannel(jobConfig?.channel) ?? normalizeCronMessageChannel(job.delivery?.channel) ?? "last",
		to: mode === "webhook" ? explicitTo : explicitTo ?? normalizeTo(job.delivery?.to),
		mode,
		accountId: jobConfig?.accountId ?? globalConfig?.accountId,
		includeSkipped: jobConfig?.includeSkipped ?? globalConfig?.includeSkipped ?? false
	};
}
function emitFailureAlert(state, params) {
	const safeJobName = params.job.name || params.job.id;
	const truncatedError = truncateUtf16Safe(params.error?.trim() || "unknown reason", 200);
	const errorReason = params.status === "error" && typeof params.error === "string" ? resolveFailoverReasonFromError(params.error, params.provider) ?? void 0 : void 0;
	const statusVerb = params.status === "skipped" ? "skipped" : "failed";
	const detailLabel = params.status === "skipped" ? "Skip reason" : "Last error";
	const text = [
		`Cron job "${safeJobName}" ${statusVerb} ${params.consecutiveErrors} times`,
		...errorReason ? [`Cause: ${errorReason}`] : [],
		`${detailLabel}: ${truncatedError}`
	].join("\n");
	if (state.deps.sendCronFailureAlert) {
		state.deps.sendCronFailureAlert({
			job: params.job,
			text,
			channel: params.channel,
			to: params.to,
			mode: params.mode,
			accountId: params.accountId
		}).catch((err) => {
			state.deps.log.warn({
				jobId: params.job.id,
				err: String(err)
			}, "cron: failure alert delivery failed");
		});
		return;
	}
	state.deps.enqueueSystemEvent(text, { agentId: params.job.agentId });
	if (params.job.wakeMode === "now") state.deps.requestHeartbeat({
		source: "cron",
		intent: "immediate",
		reason: `cron:${params.job.id}:failure-alert`
	});
}
/** Emits a failure alert when threshold, best-effort, and cooldown policy allow it. */
function maybeEmitFailureAlert(state, params) {
	if (!params.alertConfig || params.consecutiveCount < params.alertConfig.after) return;
	if (params.job.delivery?.bestEffort === true) return;
	const now = params.occurredAtMs ?? state.deps.nowMs();
	const lastAlert = params.job.state.lastFailureAlertAtMs;
	if (typeof lastAlert === "number" && now - lastAlert < Math.max(0, params.alertConfig.cooldownMs)) return;
	if (params.delivery !== "record-only") emitFailureAlert(state, {
		job: params.job,
		error: params.error,
		consecutiveErrors: params.consecutiveCount,
		channel: params.alertConfig.channel,
		to: params.alertConfig.to,
		mode: params.alertConfig.mode,
		accountId: params.alertConfig.accountId,
		status: params.status,
		provider: params.provider
	});
	params.job.state.lastFailureAlertAtMs = now;
}
//#endregion
//#region src/cron/service/list-page-sort.ts
function sortCronJobs(jobs, sortBy, sortDir) {
	const dir = sortDir === "desc" ? -1 : 1;
	return jobs.toSorted((a, b) => {
		let cmp;
		if (sortBy === "name") {
			const aName = typeof a.name === "string" ? a.name : "";
			const bName = typeof b.name === "string" ? b.name : "";
			cmp = aName.localeCompare(bName, void 0, { sensitivity: "base" });
		} else if (sortBy === "updatedAtMs") cmp = a.updatedAtMs - b.updatedAtMs;
		else {
			const aNext = a.state.nextRunAtMs;
			const bNext = b.state.nextRunAtMs;
			if (typeof aNext === "number" && typeof bNext === "number") cmp = aNext - bNext;
			else if (typeof aNext === "number") cmp = -1;
			else if (typeof bNext === "number") cmp = 1;
			else cmp = 0;
		}
		if (cmp !== 0) return cmp * dir;
		const aId = typeof a.id === "string" ? a.id : "";
		const bId = typeof b.id === "string" ? b.id : "";
		return aId.localeCompare(bId);
	});
}
//#endregion
//#region src/cron/service/locked.ts
const storeLocks = /* @__PURE__ */ new Map();
const resolveChain = (promise) => promise.then(() => void 0, () => void 0);
/** Serializes cron operations per store path while preserving state-local operation ordering. */
async function locked(state, fn) {
	const storePath = state.deps.storePath;
	const storeOp = storeLocks.get(storePath) ?? Promise.resolve();
	const next = Promise.all([resolveChain(state.op), resolveChain(storeOp)]).then(fn);
	const keepAlive = resolveChain(next);
	state.op = keepAlive;
	storeLocks.set(storePath, keepAlive);
	return await next;
}
//#endregion
//#region src/cron/retry-hint.ts
const SERVER_ERROR_PATTERN = /\b(?:https?|status(?:[ _]code)?|response(?:[ _]code)?|http(?:[ _]status)?)\b[\s:=#"']{0,4}5\d{2}\b|\b5\d{2}\b[\s:)\].,-]*(?:internal server error|server error|bad gateway|service unavailable|gateway time-?out)\b|\binternal server error\b|\bbad gateway\b|\bservice unavailable\b|\bgateway time-?out\b|\b5xx\b|^\s*5\d{2}\s*$/i;
const SESSION_LIFECYCLE_CLAIM_ERROR_PATTERN = /^(?:(?:CronSessionLifecycleClaimError|Error): )?Session "[^"\n]+" (?:changed|was deleted) while starting work\. Retry\.$/;
const TRANSIENT_PATTERNS = {
	rate_limit: /(rate[_ ]limit|too many requests|429|resource has been exhausted|cloudflare|tokens per day)/i,
	overloaded: /\b529\b|\boverloaded(?:_error)?\b|high demand|temporar(?:ily|y) overloaded|capacity exceeded/i,
	network: /(network|fetch failed|socket|econnreset|econnrefused|eai_again|enetdown|ehostunreach|ehostdown|enetreset|enetunreach|epipe)/i,
	timeout: /(timeout|timed out|stalled before execution start|etimedout)/i,
	server_error: SERVER_ERROR_PATTERN
};
/** Classifies cron execution errors against the configured retryable transient categories. */
function resolveCronExecutionRetryHint(input) {
	const { error, retryOn, classifiedReason, executionStarted } = input;
	if (!error || typeof error !== "string") return { retryable: false };
	if (SESSION_LIFECYCLE_CLAIM_ERROR_PATTERN.test(error)) return { retryable: executionStarted !== true };
	const keys = retryOn?.length ? retryOn : Object.keys(TRANSIENT_PATTERNS);
	const classified = classifiedReason ?? void 0;
	if (classified && keys.includes(classified)) return {
		retryable: true,
		category: classified
	};
	for (const key of keys) if (TRANSIENT_PATTERNS[key]?.test(error)) return {
		retryable: true,
		category: key
	};
	return { retryable: false };
}
//#endregion
//#region src/cron/session-reaper.ts
/** Prunes expired per-run cron sessions and archives unreferenced transcripts. */
const DEFAULT_RETENTION_MS = 24 * 36e5;
/** Minimum interval between reaper sweeps (avoid running every timer tick). */
const MIN_SWEEP_INTERVAL_MS = 5 * 6e4;
const lastSweepAtMsByStore = /* @__PURE__ */ new Map();
/** Resolves cron run-session retention; `false` disables pruning, bad strings fall back safely. */
function resolveRetentionMs(cronConfig) {
	if (cronConfig?.sessionRetention === false) return null;
	const raw = cronConfig?.sessionRetention;
	if (typeof raw === "string" && raw.trim()) try {
		return parseDurationMs(raw.trim(), { defaultUnit: "h" });
	} catch {
		return DEFAULT_RETENTION_MS;
	}
	return DEFAULT_RETENTION_MS;
}
/**
* Sweeps completed isolated cron run sessions while preserving base cron sessions.
*
* Must run outside the cron service `locked()` section because this acquires
* the session-store file lock; reversing that order can deadlock timer ticks.
*/
async function sweepCronRunSessions(params) {
	const now = params.nowMs ?? Date.now();
	const storePath = params.sessionStorePath;
	const lastSweepAtMs = lastSweepAtMsByStore.get(storePath) ?? 0;
	if (!params.force && now - lastSweepAtMs < MIN_SWEEP_INTERVAL_MS) return {
		swept: false,
		pruned: 0
	};
	lastSweepAtMsByStore.set(storePath, now);
	const retentionMs = resolveRetentionMs(params.cronConfig);
	if (retentionMs === null) return {
		swept: false,
		pruned: 0
	};
	let pruned = 0;
	let transcriptCleanupError;
	try {
		const cutoff = now - retentionMs;
		let pendingMediaSessionKeys;
		const removals = [];
		for (const { sessionKey, entry } of listSessionEntries({ storePath })) {
			if (!isCronRunSessionKey(sessionKey)) continue;
			if ((entry.updatedAt ?? 0) >= cutoff) continue;
			if (entry.cronRunContinuation) {
				pendingMediaSessionKeys ??= buildPendingGeneratedMediaSessionKeySet();
				if (pendingMediaSessionKeys.has(sessionKey)) continue;
			}
			removals.push({
				sessionKey,
				expectedEntry: entry,
				...entry.sessionId ? { expectedSessionId: entry.sessionId } : {},
				expectedUpdatedAt: entry.updatedAt,
				archiveRemovedTranscript: true
			});
		}
		if (removals.length > 0) {
			const archiveRetentionMs = resolveMaintenanceConfig().resetArchiveRetentionMs;
			const result = await applySessionEntryLifecycleMutation({
				storePath,
				removals,
				preserveActiveWork: true,
				restrictArchivedTranscriptsToStoreDir: true,
				...archiveRetentionMs == null ? {} : { cleanupArchivedTranscripts: {
					rules: [{
						reason: "deleted",
						olderThanMs: archiveRetentionMs
					}],
					nowMs: now
				} },
				captureArtifactCleanupError: true
			});
			pruned = result.removedEntries;
			transcriptCleanupError = result.artifactCleanupError;
		}
	} catch (err) {
		params.log.warn({ err: String(err) }, "cron-reaper: failed to sweep session store");
		return {
			swept: false,
			pruned: 0
		};
	}
	if (transcriptCleanupError) params.log.warn({ err: formatErrorMessage(transcriptCleanupError) }, "cron-reaper: transcript cleanup failed");
	if (pruned > 0) params.log.info({
		pruned,
		retentionMs
	}, `cron-reaper: pruned ${pruned} expired cron run session(s)`);
	return {
		swept: true,
		pruned
	};
}
/** Resets per-store reaper throttles between tests. */
function resetReaperThrottle() {
	lastSweepAtMsByStore.clear();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.cronSessionReaperTestApi")] = { resetReaperThrottle };
//#endregion
//#region src/cron/service/agent-watchdog.ts
const CRON_TIMEOUT_CLEANUP_GUARD_MS = 2e4;
const CRON_AGENT_SETUP_WATCHDOG_MS = 6e4;
const CRON_AGENT_PRE_EXECUTION_WATCHDOG_MS = 6e4;
const CRON_AGENT_PRE_EXECUTION_MIN_WATCHDOG_MS = 1e3;
const CRON_AGENT_PHASE_WATCHDOG_STAGE = {
	runner_entered: "pre_execution",
	workspace: "pre_execution",
	runtime_plugins: "pre_execution",
	before_agent_reply: "execution",
	model_resolution: "pre_execution",
	auth: "pre_execution",
	context_engine: "pre_execution",
	attempt_dispatch: "execution",
	context_assembled: "execution",
	turn_accepted: "execution",
	process_spawned: "execution",
	tool_execution_started: "execution",
	assistant_output_started: "execution",
	model_call_started: "execution"
};
/** Tracks isolated-agent setup/execution progress and fires the correct cron timeout reason. */
function createCronAgentWatchdog(params) {
	let state = params.deferUntilRunner ? "waiting_for_runner" : "executing";
	let timeoutId;
	let setupTimeoutId;
	let preExecutionTimeoutId;
	let activeExecution;
	let observedLaneWait = false;
	const setTimedOut = (reason) => {
		if (state === "timed_out" || state === "disposed") return;
		state = "timed_out";
		params.triggerTimeout(reason);
	};
	const startTimeout = () => {
		if (timeoutId || state === "disposed") return;
		timeoutId = setTimeout(() => {
			setTimedOut(timeoutErrorMessage(activeExecution));
		}, params.jobTimeoutMs);
	};
	const clearSetupTimeout = () => {
		if (!setupTimeoutId) return;
		clearTimeout(setupTimeoutId);
		setupTimeoutId = void 0;
	};
	const clearPreExecutionTimeout = () => {
		if (!preExecutionTimeoutId) return;
		clearTimeout(preExecutionTimeoutId);
		preExecutionTimeoutId = void 0;
	};
	const startPreExecutionTimeout = () => {
		if (preExecutionTimeoutId || state !== "waiting_for_execution") return;
		preExecutionTimeoutId = setTimeout(() => {
			if (state === "waiting_for_execution") setTimedOut(preExecutionTimeoutErrorMessage(activeExecution));
		}, resolveCronAgentPreExecutionWatchdogMs(params.jobTimeoutMs));
	};
	const noteExecutionProgress = (info) => {
		if (!info) return;
		const previousPhase = activeExecution?.phase;
		activeExecution = {
			...activeExecution,
			...info
		};
		const stage = info.phase ? CRON_AGENT_PHASE_WATCHDOG_STAGE[info.phase] : void 0;
		if (state === "executing" && previousPhase === "before_agent_reply" && stage === "pre_execution") {
			state = "waiting_for_execution";
			startPreExecutionTimeout();
			return;
		}
		if (stage === "execution") {
			state = "executing";
			clearPreExecutionTimeout();
		}
	};
	return {
		start: () => {
			if (params.deferUntilRunner) {
				setupTimeoutId = setTimeout(() => {
					if (state === "waiting_for_runner") setTimedOut(setupTimeoutErrorMessage(activeExecution));
				}, CRON_AGENT_SETUP_WATCHDOG_MS);
				return;
			}
			startTimeout();
		},
		noteLaneWait: () => {
			if (state === "waiting_for_runner") observedLaneWait = true;
		},
		noteLaneAdmitted: () => {
			if (state === "waiting_for_runner") observedLaneWait = false;
		},
		noteRunnerStarted: (info) => {
			if (state === "disposed" || state === "timed_out") return;
			clearSetupTimeout();
			startTimeout();
			if (state !== "executing") state = "waiting_for_execution";
			noteExecutionProgress(info);
			startPreExecutionTimeout();
		},
		notePhase: (info) => {
			if (state === "disposed" || state === "timed_out") return;
			noteExecutionProgress(info);
		},
		activeExecution: () => activeExecution,
		observedLaneWait: () => observedLaneWait,
		dispose: () => {
			state = "disposed";
			if (timeoutId) clearTimeout(timeoutId);
			clearSetupTimeout();
			clearPreExecutionTimeout();
		}
	};
}
/** Runs timeout cleanup with a guard so stuck cleanup cannot block the cron lane. */
async function cleanupTimedOutCronAgentRun(state, job, timeoutMs, execution) {
	if (!state.deps.cleanupTimedOutAgentRun) return;
	let settleTimer;
	const cleanupPromise = state.deps.cleanupTimedOutAgentRun({
		job,
		timeoutMs,
		execution
	});
	const settleTimeout = new Promise((resolve) => {
		settleTimer = setTimeout(resolve, CRON_TIMEOUT_CLEANUP_GUARD_MS);
	});
	try {
		await Promise.race([cleanupPromise, settleTimeout]);
	} catch (err) {
		state.deps.log.warn({
			jobId: job.id,
			err: String(err)
		}, "cron: timed-out agent cleanup failed");
	} finally {
		if (settleTimer) clearTimeout(settleTimer);
	}
}
function resolveCronAgentPreExecutionWatchdogMs(jobTimeoutMs) {
	return Math.max(CRON_AGENT_PRE_EXECUTION_MIN_WATCHDOG_MS, Math.min(CRON_AGENT_PRE_EXECUTION_WATCHDOG_MS, Math.floor(jobTimeoutMs / 2)));
}
//#endregion
//#region src/cron/service/state.ts
/** Creates mutable cron service state with a concrete clock dependency. */
function createCronServiceState(deps) {
	return {
		deps: {
			...deps,
			nowMs: deps.nowMs ?? (() => Date.now())
		},
		store: null,
		durableNextRunAtMsByJobId: /* @__PURE__ */ new Map(),
		timer: null,
		running: false,
		stopped: false,
		schedulingPaused: false,
		schedulerStarted: false,
		restartRecoveryPending: false,
		activeManualRunJobIds: /* @__PURE__ */ new Set(),
		manualSetupTimeoutNotified: false,
		runAdmission: {
			active: 0,
			waiters: []
		},
		queuedRunReservationsByJobId: /* @__PURE__ */ new Map(),
		op: Promise.resolve(),
		warnedDisabled: false,
		warnedInvalidPersistedJobKeys: /* @__PURE__ */ new Set(),
		pendingQuarantineConfigJobs: [],
		lastQuarantineFailureWarnKey: null,
		storeLoadedAtMs: null
	};
}
/** Dispatches a cron event without letting subscriber errors escape scheduler work. */
function emit(state, evt) {
	try {
		state.deps.onEvent?.(evt);
	} catch {}
}
//#endregion
//#region src/cron/service/store.ts
/** Loads, normalizes, quarantines, and persists cron service store state. */
function durableNextRunsFromJobs(jobs) {
	return new Map(jobs.map((job) => [job.id, job.state.nextRunAtMs]));
}
function publishDurableNextRunChanges(params) {
	const previous = params.state.durableNextRunAtMsByJobId;
	const next = params.stateOnly ? new Map(previous) : durableNextRunsFromJobs(params.storeJobs);
	if (params.stateOnly) {
		const currentJobsById = new Map(params.storeJobs.map((job) => [job.id, job]));
		for (const jobId of previous.keys()) {
			const job = currentJobsById.get(jobId);
			if (job) next.set(jobId, job.state.nextRunAtMs);
		}
	}
	const changedJobs = params.storeJobs.filter((job) => {
		if (!previous.has(job.id) || !next.has(job.id)) return false;
		return previous.get(job.id) !== next.get(job.id);
	});
	params.state.durableNextRunAtMsByJobId = next;
	for (const job of changedJobs) {
		if (job.id === params.suppressScheduledJobId) continue;
		emit(params.state, {
			jobId: job.id,
			action: "scheduled",
			job,
			nextRunAtMs: job.state.nextRunAtMs
		});
	}
}
function invalidateStaleNextRunOnScheduleChange(params) {
	const previousJob = params.previousJobsById.get(params.hydrated.id);
	if (!previousJob || cronSchedulingInputsEqual(previousJob, params.hydrated)) return;
	params.hydrated.state ??= {};
	params.hydrated.state.nextRunAtMs = void 0;
	params.hydrated.state.startupCatchupAtMs = void 0;
	params.hydrated.state.pacedNextRunAtMs = void 0;
	params.hydrated.state.forcePreservedNextRunAtMs = void 0;
}
function warnInvalidPersistedCronJob(params) {
	const jobId = typeof params.raw.id === "string" ? params.raw.id : void 0;
	const dedupeKey = jobId ?? `index:${params.index}`;
	if (params.state.warnedInvalidPersistedJobKeys.has(dedupeKey)) return;
	params.state.warnedInvalidPersistedJobKeys.add(dedupeKey);
	params.state.deps.log.warn({
		storePath: params.state.deps.storePath,
		jobId,
		jobIndex: params.index,
		reason: params.reason
	}, "cron: quarantined invalid persisted job and skipped it from runtime");
}
async function flushPendingQuarantine(state, nowMs) {
	if (state.pendingQuarantineConfigJobs.length === 0) return null;
	try {
		const quarantinePath = await saveCronQuarantineFile({
			storePath: state.deps.storePath,
			entries: state.pendingQuarantineConfigJobs,
			nowMs
		});
		state.pendingQuarantineConfigJobs = [];
		state.lastQuarantineFailureWarnKey = null;
		return quarantinePath;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		const warnKey = `${state.deps.storePath}\0${errorMessage}`;
		if (state.lastQuarantineFailureWarnKey !== warnKey) {
			state.lastQuarantineFailureWarnKey = warnKey;
			state.deps.log.warn({
				storePath: state.deps.storePath,
				error: errorMessage
			}, "cron: failed to quarantine malformed persisted jobs; skipping active store sanitization");
		}
		return null;
	}
}
/** Loads and normalizes the cron store, quarantining invalid persisted rows before runtime use. */
async function ensureLoaded(state, opts) {
	if (state.store && !opts?.forceReload) return;
	const previousJobsById = /* @__PURE__ */ new Map();
	for (const job of state.store?.jobs ?? []) previousJobsById.set(job.id, job);
	const loaded = await loadCronJobsStoreWithConfigJobs(state.deps.storePath);
	const loadedJobs = loaded.store.jobs ?? [];
	const jobs = [];
	const durableNextRunAtMsByJobId = /* @__PURE__ */ new Map();
	const quarantinedConfigJobs = [...loaded.invalidConfigRows];
	for (const [index, raw] of loadedJobs.entries()) {
		const rawConfigJob = loaded.configJobs[index] ?? structuredClone(raw);
		const sourceIndex = loaded.configJobIndexes[index] ?? index;
		const runtimeEntry = loaded.configJobRuntimeEntries[index];
		normalizeCronJobIdentityFields(raw);
		let normalized;
		try {
			normalized = normalizeCronJobInput(raw);
		} catch (error) {
			if (!isInvalidCronSessionTargetIdError(error)) throw error;
			normalized = null;
			state.deps.log.warn({
				storePath: state.deps.storePath,
				jobId: typeof raw.id === "string" ? raw.id : void 0
			}, "cron: job has invalid persisted sessionTarget; run openclaw doctor --fix to repair");
		}
		const hydratedRaw = normalized ?? raw;
		const invalidReason = getInvalidPersistedCronJobReason(hydratedRaw);
		if (invalidReason) {
			const quarantineEntry = {
				sourceIndex,
				reason: invalidReason,
				job: rawConfigJob
			};
			const runtimeState = runtimeEntry?.state ?? raw.state;
			if (runtimeState && typeof runtimeState === "object" && !Array.isArray(runtimeState)) quarantineEntry.state = structuredClone(runtimeState);
			const updatedAtMs = runtimeEntry?.updatedAtMs ?? raw.updatedAtMs;
			if (typeof updatedAtMs === "number" && Number.isFinite(updatedAtMs)) quarantineEntry.updatedAtMs = updatedAtMs;
			if (typeof runtimeEntry?.scheduleIdentity === "string") quarantineEntry.scheduleIdentity = runtimeEntry.scheduleIdentity;
			quarantinedConfigJobs.push(quarantineEntry);
			warnInvalidPersistedCronJob({
				state,
				raw,
				index: sourceIndex,
				reason: invalidReason
			});
			continue;
		}
		const hydrated = hydratedRaw;
		jobs.push(hydrated);
		durableNextRunAtMsByJobId.set(hydrated.id, hydrated.state.nextRunAtMs);
		invalidateStaleNextRunOnScheduleChange({
			previousJobsById,
			hydrated
		});
	}
	state.store = {
		version: 1,
		jobs
	};
	state.durableNextRunAtMsByJobId = durableNextRunAtMsByJobId;
	state.storeLoadedAtMs = state.deps.nowMs();
	if (quarantinedConfigJobs.length > 0) {
		state.pendingQuarantineConfigJobs = quarantinedConfigJobs;
		const quarantinePath = await flushPendingQuarantine(state, state.storeLoadedAtMs);
		if (quarantinePath) try {
			await persist(state);
			state.deps.log.warn({
				storePath: state.deps.storePath,
				quarantinePath,
				quarantinedJobs: quarantinedConfigJobs.length
			}, "cron: sanitized active cron store after quarantining malformed persisted jobs");
		} catch (error) {
			state.deps.log.warn({
				storePath: state.deps.storePath,
				error: error instanceof Error ? error.message : String(error)
			}, "cron: failed to sanitize malformed persisted jobs after quarantine; continuing with quarantined in-memory view");
		}
	}
	if (!opts?.skipRecompute) recomputeNextRuns(state);
}
/** Emits the cron-disabled warning once per service state. */
function warnIfDisabled(state, action) {
	if (state.deps.cronEnabled) return;
	if (state.warnedDisabled) return;
	state.warnedDisabled = true;
	state.deps.log.warn({
		enabled: false,
		action,
		storePath: state.deps.storePath
	}, "cron: scheduler disabled; jobs will not run automatically");
}
/** Persists the in-memory cron store, flushing pending quarantine records first. */
async function persist(state, opts) {
	const store = state.store;
	if (!store) return false;
	let flushedPendingQuarantine = false;
	if (state.pendingQuarantineConfigJobs.length > 0) {
		if (!await flushPendingQuarantine(state, state.deps.nowMs())) return false;
		flushedPendingQuarantine = true;
	}
	const stateOnly = !flushedPendingQuarantine && opts?.stateOnly === true;
	await saveCronJobsStore(state.deps.storePath, store, stateOnly ? { stateOnly: true } : void 0);
	publishDurableNextRunChanges({
		state,
		storeJobs: store.jobs,
		stateOnly,
		suppressScheduledJobId: opts?.suppressScheduledJobId
	});
	return true;
}
/** Captures the live cron state that must stay aligned with the durable store. */
function snapshotStoreForRollback(state) {
	return {
		store: state.store ? structuredClone(state.store) : null,
		durableNextRunAtMsByJobId: new Map(state.durableNextRunAtMsByJobId)
	};
}
async function persistOrRestore(state, snapshot, opts = {}) {
	try {
		if (!await persist(state, opts.suppressScheduledJobId === void 0 ? void 0 : { suppressScheduledJobId: opts.suppressScheduledJobId })) throw new Error("cron: durable store write did not complete");
	} catch (err) {
		state.store = snapshot.store;
		state.durableNextRunAtMsByJobId = snapshot.durableNextRunAtMsByJobId;
		throw err;
	}
	for (const notify of opts.postPersistAutoDisableNotifications ?? []) notify();
}
//#endregion
//#region src/cron/service/timeout-policy.ts
/** Resolves cron job wall-clock timeout policy. */
/**
* Maximum wall-clock time for a single job execution. Acts as a safety net
* on top of per-provider/per-agent timeouts to prevent one stuck job from
* wedging the entire cron lane.
*/
const DEFAULT_JOB_TIMEOUT_MS = 10 * 6e4;
/**
* Agent turns can legitimately run much longer than generic cron jobs.
* Use a larger safety ceiling when no explicit timeout is set.
*/
const AGENT_TURN_SAFETY_TIMEOUT_MS = 60 * 6e4;
/** Resolves the wall-clock timeout for a cron job, including explicit detached-run overrides. */
function resolveCronJobTimeoutMs(job) {
	const configuredTimeoutMs = (job.payload.kind === "agentTurn" || job.payload.kind === "command" || job.payload.kind === "script") && typeof job.payload.timeoutSeconds === "number" ? finiteSecondsToTimerSafeMilliseconds(job.payload.timeoutSeconds) ?? 0 : void 0;
	if (configuredTimeoutMs === void 0) return job.payload.kind === "agentTurn" ? AGENT_TURN_SAFETY_TIMEOUT_MS : DEFAULT_JOB_TIMEOUT_MS;
	return configuredTimeoutMs <= 0 ? void 0 : configuredTimeoutMs;
}
//#endregion
//#region src/cron/service/timer-outcome-finalization.ts
/** Finalizes cron task rows and active markers after timer outcome persistence. */
function finishPersistedQuietCronTaskRuns(state, outcomes) {
	for (const outcome of outcomes) if (outcome.status === "ok" && outcome.triggerEval && !outcome.triggerEval.fired) tryFinishCronTaskRunWithoutHistory(state, outcome);
}
function clearActiveMarkersForOutcomes(outcomes) {
	for (const outcome of outcomes) clearCronJobActive(outcome.jobId, outcome.activeJobMarker);
}
function filterCurrentCronRunOutcomes(outcomes) {
	return outcomes.filter((outcome) => isCronActiveJobMarkerCurrent(outcome.activeJobMarker));
}
function finishRetiredCronTaskRuns(state, outcomes, currentOutcomes) {
	const current = new Set(currentOutcomes);
	for (const outcome of outcomes) if (!current.has(outcome)) tryFinishCronTaskRunWithoutHistory(state, outcome);
}
function clearUnstartedStartupCatchupReservationMarkers(state, plan, outcomes) {
	const pendingReleases = [];
	const startedJobIds = new Set(outcomes.map((outcome) => outcome.jobId));
	for (const candidate of plan.candidates) {
		if (startedJobIds.has(candidate.jobId)) continue;
		const job = state.store?.jobs.find((entry) => entry.id === candidate.jobId);
		if (job && clearQueuedCronRunReservationMarker(state, candidate.jobId, candidate.reservationIdentity, job.state)) pendingReleases.push(candidate);
		else releaseQueuedCronRun(state, candidate.jobId, candidate.reservationIdentity);
	}
	return pendingReleases;
}
//#endregion
//#region src/cron/service/wake.ts
/** Manual cron wake helper for queueing system events into sessions. */
function enqueueCronSystemEvent(state, text, opts) {
	return state.deps.enqueueSystemEvent(text, opts);
}
function requestCronHeartbeat(state, opts) {
	state.deps.requestHeartbeat({
		source: "cron",
		...opts
	});
}
/** Enqueues a manual cron wake event and optionally pokes the targeted heartbeat loop. */
function wake(state, opts) {
	const text = opts.text.trim();
	if (!text) return { ok: false };
	const sessionKey = opts.sessionKey?.trim() || void 0;
	const agentId = opts.agentId?.trim() || void 0;
	if (sessionKey && isSubagentSessionKey(sessionKey)) return {
		ok: false,
		reason: "unwakeable-session-key"
	};
	const originDeliveryContext = sessionKey || agentId ? state.deps.resolveOriginDeliveryContext?.({
		sessionKey,
		agentId
	}) : void 0;
	const enqueueOpts = sessionKey || agentId ? {
		...sessionKey ? { sessionKey } : {},
		...agentId ? { agentId } : {},
		...originDeliveryContext ? { deliveryContext: originDeliveryContext } : {}
	} : void 0;
	state.deps.enqueueSystemEvent(text, enqueueOpts);
	if (opts.mode === "now") state.deps.requestHeartbeat({
		source: "manual",
		intent: "immediate",
		reason: "wake",
		...sessionKey ? { sessionKey } : {},
		...agentId ? { agentId } : {}
	});
	else if (sessionKey) state.deps.requestHeartbeat({
		source: "manual",
		intent: "immediate",
		reason: "wake",
		sessionKey,
		...agentId ? { agentId } : {}
	});
	return { ok: true };
}
//#endregion
//#region src/cron/service/timer.ts
/** Cron timer loop, execution, catch-up, and run-result state transitions. */
const MAX_TIMER_DELAY_MS = 6e4;
const HEARTBEAT_SKIP_DISABLED = "disabled";
/**
* Minimum gap between consecutive fires of the same cron job.  This is a
* safety net that prevents spin-loops when `computeJobNextRunAtMs` returns
* a value within the same second as the just-completed run.  The guard
* is intentionally generous (2 s) so it never masks a legitimate schedule
* but always breaks an infinite re-trigger cycle.  (See #17821)
*/
const MIN_REFIRE_GAP_MS = 2e3;
const DEFAULT_MISSED_JOB_STAGGER_MS = 5e3;
const DEFAULT_MAX_MISSED_JOBS_PER_RESTART = 5;
const DEFAULT_STARTUP_DEFERRED_MISSED_AGENT_JOB_DELAY_MS = 2 * 6e4;
/** Script payloads run headlessly even when their notifications target main. */
function runsDetachedFromMainSession(job) {
	return job.sessionTarget !== "main" || job.payload.kind === "script";
}
/**
* Carries the already-resolved run attribution from watchdog-visible execution
* state into a timer-built error outcome. The wall-clock/cancel paths return
* their own outcome (the inner run result loses the Promise.race), so without
* this the persisted cron run record drops provider/model/session for a
* post-runner timeout or cancel even though they were already known. Stays
* empty before the runner starts, so pre-execution setup timeouts read blank.
*/
function cronRunAttributionFromExecution(execution) {
	if (!execution) return {};
	return {
		provider: execution.provider,
		model: execution.model,
		sessionId: execution.sessionId,
		sessionKey: execution.sessionKey
	};
}
/** Executes cron job core logic with the configured wall-clock timeout and watchdog cleanup. */
async function executeJobCoreWithTimeout(state, job, opts) {
	const runAbortController = new AbortController();
	const operatorCancellationMarker = Symbol("cron-operator-cancelled");
	let resolveOperatorCancellation;
	const operatorCancellationPromise = new Promise((resolve) => {
		resolveOperatorCancellation = resolve;
	});
	const createOperatorCancellationOutcome = (execution) => {
		const error = abortErrorMessage(runAbortController.signal);
		return {
			status: "error",
			error,
			...cronRunAttributionFromExecution(execution),
			diagnostics: createCronRunDiagnosticsFromError("cron-setup", error, { nowMs: state.deps.nowMs })
		};
	};
	if (!isCronActiveJobMarkerCurrent(opts?.activeJobMarker)) {
		runAbortController.abort("Gateway restarting.");
		return createOperatorCancellationOutcome();
	}
	const releaseCronTaskRun = runsDetachedFromMainSession(job) ? registerActiveCronTaskRun({
		runId: opts?.runId ?? `cron-active:${job.id}`,
		controller: runAbortController,
		onCancel: () => resolveOperatorCancellation?.(operatorCancellationMarker)
	}) : void 0;
	const jobTimeoutMs = resolveCronJobTimeoutMs(job);
	try {
		if (typeof jobTimeoutMs !== "number") {
			let activeExecution;
			const accumulateExecution = (info) => {
				if (info) activeExecution = {
					...activeExecution,
					...info
				};
			};
			const corePromise = executeJobCore(state, job, runAbortController.signal, {
				activeJobMarker: opts?.activeJobMarker,
				owningCronLaneTaskMarker: opts?.owningCronLaneTaskMarker,
				onExecutionStarted: accumulateExecution,
				onExecutionPhase: accumulateExecution
			});
			trackActiveCronTaskRunSettlement(corePromise);
			corePromise.catch((err) => {
				if (runAbortController.signal.aborted) state.deps.log.warn({
					jobId: job.id,
					err: String(err)
				}, "cron: job core rejected after cancellation abort");
			});
			const first = await Promise.race([corePromise, operatorCancellationPromise]);
			if (first !== operatorCancellationMarker) return first;
			startActiveCronTaskRunSettlementGrace();
			return createOperatorCancellationOutcome(activeExecution);
		}
		let timeoutReason;
		const timeoutMarker = Symbol("cron-timeout");
		let resolveTimeout;
		const timeoutPromise = new Promise((resolve) => {
			resolveTimeout = resolve;
		});
		const deferTimeoutUntilExecutionStart = job.sessionTarget !== "main" && job.payload.kind === "agentTurn";
		const triggerTimeout = (reason) => {
			timeoutReason = reason;
			if (!runAbortController.signal.aborted) {
				const timeoutError = new Error(reason);
				timeoutError.name = "TimeoutError";
				runAbortController.abort(timeoutError);
			}
			resolveTimeout?.(timeoutMarker);
		};
		const watchdog = createCronAgentWatchdog({
			deferUntilRunner: deferTimeoutUntilExecutionStart,
			jobTimeoutMs,
			triggerTimeout
		});
		const noteLaneState = (info) => {
			if (info?.waiting === false) {
				watchdog.noteLaneAdmitted();
				return;
			}
			watchdog.noteLaneWait();
		};
		const corePromise = executeJobCore(state, job, runAbortController.signal, {
			activeJobMarker: opts?.activeJobMarker,
			owningCronLaneTaskMarker: opts?.owningCronLaneTaskMarker,
			onExecutionStarted: deferTimeoutUntilExecutionStart ? watchdog.noteRunnerStarted : void 0,
			onExecutionPhase: deferTimeoutUntilExecutionStart ? watchdog.notePhase : void 0,
			onLaneWait: deferTimeoutUntilExecutionStart ? noteLaneState : void 0
		});
		trackActiveCronTaskRunSettlement(corePromise);
		watchdog.start();
		corePromise.catch((err) => {
			if (runAbortController.signal.aborted) state.deps.log.warn({
				jobId: job.id,
				err: String(err)
			}, "cron: job core rejected after timeout abort");
		});
		try {
			const first = await Promise.race([
				corePromise,
				timeoutPromise,
				operatorCancellationPromise
			]);
			if (first === operatorCancellationMarker) {
				startActiveCronTaskRunSettlementGrace();
				return createOperatorCancellationOutcome(watchdog.activeExecution());
			}
			if (first !== timeoutMarker) return first;
			startActiveCronTaskRunSettlementGrace();
			const activeExecution = watchdog.activeExecution();
			await cleanupTimedOutCronAgentRun(state, job, jobTimeoutMs, activeExecution);
			const error = timeoutReason ?? timeoutErrorMessage(activeExecution);
			const observedLaneWait = watchdog.observedLaneWait();
			const isolatedAgentSetupTimeout = job.sessionTarget === "isolated" && isSetupTimeoutErrorText(error) && !observedLaneWait ? {
				error,
				timeoutMs: CRON_AGENT_SETUP_WATCHDOG_MS,
				otherCronJobsActiveAtTimeout: false
			} : void 0;
			return {
				status: "error",
				error,
				...cronRunAttributionFromExecution(activeExecution),
				diagnostics: createCronRunDiagnosticsFromError("cron-setup", error, { nowMs: state.deps.nowMs }),
				...isolatedAgentSetupTimeout ? { isolatedAgentSetupTimeout } : {}
			};
		} finally {
			watchdog.dispose();
		}
	} finally {
		releaseCronTaskRun?.();
	}
}
function notifyIsolatedAgentSetupTimeout(state, job, error, timeoutMs) {
	const notify = state.deps.onIsolatedAgentSetupTimeout;
	if (!notify) return false;
	try {
		Promise.resolve(notify({
			job,
			error,
			timeoutMs
		})).catch((err) => {
			state.restartRecoveryPending = false;
			state.deps.log.warn({
				jobId: job.id,
				err: String(err)
			}, "cron: isolated setup timeout handler failed");
			armTimer(state);
		});
		return true;
	} catch (err) {
		state.deps.log.warn({
			jobId: job.id,
			err: String(err)
		}, "cron: isolated setup timeout handler failed");
		return false;
	}
}
function maybeNotifyIsolatedAgentSetupTimeout(state, result) {
	const signal = result.isolatedAgentSetupTimeout;
	if (!signal) return false;
	if (!notifyIsolatedAgentSetupTimeout(state, result.job, signal.error, signal.timeoutMs)) return false;
	return true;
}
function resolveMainSessionCronDeliveryContext(state, job) {
	const targetSessionKey = job.sessionKey?.trim();
	if (!targetSessionKey) return;
	const explicitAgentId = job.agentId?.trim();
	const agentId = normalizeAgentId(explicitAgentId || resolveAgentIdFromSessionKey(targetSessionKey));
	const storePath = state.deps.resolveSessionStorePath?.(agentId) ?? state.deps.sessionStorePath;
	if (!storePath) return;
	try {
		return deliveryContextFromSession(loadSessionEntry({
			agentId,
			sessionKey: targetSessionKey,
			storePath
		}));
	} catch {
		return;
	}
}
/** Default max retries for cron jobs on transient errors (#24355). */
const DEFAULT_MAX_TRANSIENT_RETRIES = 3;
function resolveCronNextRunWithLowerBound(params) {
	if (params.naturalNext === void 0) {
		params.state.deps.log.warn({
			jobId: params.job.id,
			jobName: params.job.name,
			context: params.context
		}, "cron: next run unresolved; clearing schedule to avoid a refire loop");
		return;
	}
	return Math.max(params.naturalNext, params.lowerBoundMs);
}
function resolveRetryConfig() {
	return {
		maxAttempts: DEFAULT_MAX_TRANSIENT_RETRIES,
		backoffMs: DEFAULT_ERROR_BACKOFF_SCHEDULE_MS.slice(0, 3),
		retryOn: void 0
	};
}
function resolveTransientCronRetryDecision(params) {
	const retryConfig = resolveRetryConfig();
	const retryHint = resolveCronExecutionRetryHint({
		error: params.error,
		retryOn: retryConfig.retryOn,
		classifiedReason: params.lastErrorReason,
		executionStarted: params.executionStarted
	});
	const consecutiveErrors = params.consecutiveErrors ?? 0;
	if (!retryHint.retryable) return {
		retryable: false,
		consecutiveErrors,
		retryCategory: retryHint.category,
		reason: "permanent error"
	};
	if (consecutiveErrors > retryConfig.maxAttempts) return {
		retryable: false,
		consecutiveErrors,
		retryCategory: retryHint.category,
		reason: "max retries exhausted"
	};
	return {
		retryable: true,
		consecutiveErrors,
		retryCategory: retryHint.category,
		backoffMs: errorBackoffMs(consecutiveErrors, retryConfig.backoffMs),
		reason: "transient retry"
	};
}
function resolveDisabledHeartbeatOneShotRetryDecision(params) {
	const retryConfig = resolveRetryConfig();
	const consecutiveSkipped = params.consecutiveSkipped ?? 0;
	if (consecutiveSkipped > retryConfig.maxAttempts) return {
		retryable: false,
		consecutiveSkipped,
		reason: "max retries exhausted"
	};
	return {
		retryable: true,
		consecutiveSkipped,
		backoffMs: errorBackoffMs(consecutiveSkipped, retryConfig.backoffMs),
		reason: "disabled heartbeat retry"
	};
}
function normalizeQueuedSystemEventHandle(result) {
	if (typeof result === "boolean") return { accepted: result };
	if (result && typeof result === "object") return {
		accepted: result.accepted !== false,
		...result.remove ? { remove: result.remove } : {}
	};
	return { accepted: true };
}
function removeQueuedSystemEventHandle(state, job, queued) {
	if (!queued.accepted || !queued.remove) return;
	try {
		queued.remove();
	} catch (err) {
		state.deps.log.warn({
			jobId: job.id,
			jobName: job.name,
			err
		}, "cron: failed to remove undelivered main-session system event");
	}
}
function shouldRetryDisabledHeartbeatOneShot(job, result) {
	return job.schedule.kind === "at" && job.sessionTarget === "main" && job.wakeMode === "now" && result.status === "skipped" && result.error === HEARTBEAT_SKIP_DISABLED;
}
function isScheduledTerminalOneShotRetry(job, lastRunStatus, lastRun, nextRun) {
	if (!isJobEnabled(job) || typeof nextRun !== "number" || typeof lastRun !== "number" || nextRun <= lastRun) return false;
	if (lastRunStatus === "error") return true;
	return lastRunStatus === "skipped" && job.sessionTarget === "main" && job.wakeMode === "now" && job.state.lastError === HEARTBEAT_SKIP_DISABLED;
}
function resolveDeliveryState(params) {
	const primaryDeliveryRequested = resolveCronDeliveryPlan(params.job).requested;
	const alternateFailureNotificationRequested = params.runStatus === "error" && params.job.delivery?.bestEffort !== true && resolveFailureDestination(params.job, params.globalFailureDestination) !== null;
	if (!primaryDeliveryRequested) return {
		status: "not-requested",
		failureNotification: { status: alternateFailureNotificationRequested ? "unknown" : "not-requested" }
	};
	if (params.runStatus === "error") {
		const failureNotification = alternateFailureNotificationRequested ? { status: "unknown" } : { status: "delivered" };
		if (params.delivered === true) return {
			delivered: false,
			status: "not-delivered",
			error: params.error,
			failureNotification: alternateFailureNotificationRequested ? failureNotification : {
				delivered: true,
				status: "delivered"
			}
		};
		if (params.delivered === false) return {
			delivered: false,
			status: "not-delivered",
			error: params.error,
			failureNotification: alternateFailureNotificationRequested ? failureNotification : {
				delivered: false,
				status: "not-delivered",
				...params.error ? { error: params.error } : {}
			}
		};
		return {
			status: "unknown",
			error: params.error,
			failureNotification: { status: "unknown" }
		};
	}
	if (params.delivered === true) return {
		delivered: true,
		status: "delivered",
		failureNotification: { status: "not-requested" }
	};
	if (params.delivered === false) return {
		delivered: false,
		status: "not-delivered",
		error: params.error,
		failureNotification: { status: "not-requested" }
	};
	return {
		status: "unknown",
		failureNotification: { status: "not-requested" }
	};
}
/** Applies run outcome state, delivery state, backoff/next-run scheduling, and delete-after-run policy. */
function applyJobResult(state, job, result, opts) {
	const previousScheduleState = {
		nextRunAtMs: job.state.nextRunAtMs,
		pacedNextRunAtMs: job.state.pacedNextRunAtMs
	};
	job.state.queuedAtMs = void 0;
	job.state.runningAtMs = void 0;
	job.state.pacedNextRunAtMs = void 0;
	job.state.forcePreservedNextRunAtMs = void 0;
	job.state.lastRunAtMs = result.startedAt;
	job.state.lastRunStatus = result.status;
	job.state.lastStatus = result.status;
	job.state.lastDurationMs = Math.max(0, result.endedAt - result.startedAt);
	job.state.lastError = result.error;
	job.state.lastDiagnostics = normalizeCronRunDiagnostics(result.diagnostics);
	job.state.lastDiagnosticSummary = summarizeCronRunDiagnostics(job.state.lastDiagnostics);
	job.state.lastErrorReason = result.status === "error" && typeof result.error === "string" ? resolveFailoverReasonFromError(result.error, result.provider) ?? void 0 : void 0;
	if (result.status === "error") state.deps.log.warn({
		jobId: job.id,
		jobName: job.name,
		error: result.error,
		diagnosticsSummary: job.state.lastDiagnosticSummary
	}, "cron: job run returned error status");
	const deliveryState = resolveDeliveryState({
		job,
		runStatus: result.status,
		delivered: result.delivered,
		error: result.deliveryError ?? result.error,
		globalFailureDestination: state.deps.cronConfig?.failureDestination
	});
	job.state.lastDelivered = deliveryState.delivered;
	job.state.lastDeliveryStatus = deliveryState.status;
	job.state.lastDeliveryError = deliveryState.status === "not-delivered" && deliveryState.error ? deliveryState.error : void 0;
	job.state.lastFailureNotificationDelivered = deliveryState.failureNotification.delivered;
	job.state.lastFailureNotificationDeliveryStatus = deliveryState.failureNotification.status;
	job.state.lastFailureNotificationDeliveryError = deliveryState.failureNotification.error;
	job.updatedAtMs = result.endedAt;
	const previousConsecutiveErrors = job.state.consecutiveErrors ?? 0;
	const alertConfig = resolveFailureAlert(state, job);
	if (result.status === "error") {
		job.state.consecutiveErrors = (job.state.consecutiveErrors ?? 0) + 1;
		job.state.consecutiveSkipped = 0;
		maybeEmitFailureAlert(state, {
			job,
			alertConfig,
			status: "error",
			error: result.error,
			provider: result.provider,
			consecutiveCount: job.state.consecutiveErrors,
			...opts?.replayFailureAlertAtMs !== void 0 ? {
				delivery: "record-only",
				occurredAtMs: opts.replayFailureAlertAtMs
			} : {}
		});
	} else if (result.status === "skipped") {
		job.state.consecutiveErrors = 0;
		job.state.consecutiveSkipped = (job.state.consecutiveSkipped ?? 0) + 1;
		if (alertConfig?.includeSkipped) maybeEmitFailureAlert(state, {
			job,
			alertConfig,
			status: "skipped",
			error: result.error,
			provider: result.provider,
			consecutiveCount: job.state.consecutiveSkipped,
			...opts?.replayFailureAlertAtMs !== void 0 ? {
				delivery: "record-only",
				occurredAtMs: opts.replayFailureAlertAtMs
			} : {}
		});
		else job.state.lastFailureAlertAtMs = void 0;
	} else {
		job.state.consecutiveErrors = 0;
		job.state.consecutiveSkipped = 0;
		job.state.lastFailureAlertAtMs = void 0;
	}
	const shouldDelete = (job.schedule.kind === "at" || job.schedule.kind === "on-exit") && job.deleteAfterRun === true && result.status === "ok";
	const retryDisabledHeartbeatOneShot = shouldRetryDisabledHeartbeatOneShot(job, result);
	if (!shouldDelete) if (job.schedule.kind === "at") {
		if (retryDisabledHeartbeatOneShot) {
			const retryDecision = resolveDisabledHeartbeatOneShotRetryDecision({
				cronConfig: state.deps.cronConfig,
				consecutiveSkipped: job.state.consecutiveSkipped
			});
			if (retryDecision.retryable && retryDecision.backoffMs !== void 0) {
				job.enabled = true;
				job.state.nextRunAtMs = result.endedAt + retryDecision.backoffMs;
				state.deps.log.info({
					jobId: job.id,
					jobName: job.name,
					consecutiveSkipped: retryDecision.consecutiveSkipped,
					backoffMs: retryDecision.backoffMs,
					nextRunAtMs: job.state.nextRunAtMs
				}, "cron: scheduling one-shot retry after disabled heartbeat");
			} else {
				job.enabled = false;
				job.state.nextRunAtMs = void 0;
				state.deps.log.warn({
					jobId: job.id,
					jobName: job.name,
					consecutiveSkipped: retryDecision.consecutiveSkipped,
					reason: retryDecision.reason
				}, "cron: disabling one-shot job after disabled heartbeat retries");
			}
		} else if (result.status === "ok" || result.status === "skipped") {
			job.enabled = false;
			job.state.nextRunAtMs = void 0;
		} else if (result.status === "error") {
			const retryDecision = resolveTransientCronRetryDecision({
				cronConfig: state.deps.cronConfig,
				error: result.error,
				lastErrorReason: job.state.lastErrorReason,
				executionStarted: result.executionStarted,
				consecutiveErrors: job.state.consecutiveErrors
			});
			if (retryDecision.retryable && retryDecision.backoffMs !== void 0) {
				job.state.nextRunAtMs = result.endedAt + retryDecision.backoffMs;
				state.deps.log.info({
					jobId: job.id,
					jobName: job.name,
					consecutiveErrors: retryDecision.consecutiveErrors,
					backoffMs: retryDecision.backoffMs,
					nextRunAtMs: job.state.nextRunAtMs,
					retryCategory: retryDecision.retryCategory
				}, "cron: scheduling one-shot retry after transient error");
			} else {
				job.enabled = false;
				job.state.nextRunAtMs = void 0;
				state.deps.log.warn({
					jobId: job.id,
					jobName: job.name,
					consecutiveErrors: retryDecision.consecutiveErrors,
					error: result.error,
					reason: retryDecision.reason,
					retryCategory: retryDecision.retryCategory
				}, "cron: disabling one-shot job after error");
			}
		}
	} else if (opts?.scheduleMode === "preserve") {
		job.state.nextRunAtMs = previousScheduleState.nextRunAtMs;
		job.state.pacedNextRunAtMs = previousScheduleState.pacedNextRunAtMs;
		job.state.forcePreservedNextRunAtMs = previousScheduleState.nextRunAtMs;
	} else if (result.status === "error" && isJobEnabled(job)) {
		const retryDecision = resolveTransientCronRetryDecision({
			cronConfig: state.deps.cronConfig,
			error: result.error,
			lastErrorReason: job.state.lastErrorReason,
			executionStarted: result.executionStarted,
			consecutiveErrors: job.state.consecutiveErrors
		});
		let normalNext;
		let normalNextComputed = false;
		const computeNormalNext = () => {
			if (!normalNextComputed) {
				try {
					normalNext = (retryDecision.retryable || previousConsecutiveErrors > 0) && job.schedule.kind === "every" ? computeNextRunAtMs(job.schedule, result.endedAt) : computeJobNextRunAtMs(job, result.endedAt);
				} catch (err) {
					recordScheduleComputeError({
						state,
						job,
						err
					});
				}
				normalNextComputed = true;
			}
			return normalNext;
		};
		if (retryDecision.retryable && retryDecision.backoffMs !== void 0) {
			normalNext = computeNormalNext();
			const retryNextRunAtMs = result.endedAt + retryDecision.backoffMs;
			if (normalNext === void 0) {} else if (retryNextRunAtMs < normalNext) {
				job.state.nextRunAtMs = retryNextRunAtMs;
				state.deps.log.info({
					jobId: job.id,
					jobName: job.name,
					consecutiveErrors: retryDecision.consecutiveErrors,
					backoffMs: retryDecision.backoffMs,
					nextRunAtMs: job.state.nextRunAtMs,
					normalNextRunAtMs: normalNext,
					retryCategory: retryDecision.retryCategory
				}, "cron: scheduling recurring retry after transient error");
				return shouldDelete;
			}
		}
		const backoff = errorBackoffMs(job.state.consecutiveErrors ?? 1, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
		normalNext = computeNormalNext();
		const backoffNext = result.endedAt + backoff;
		job.state.nextRunAtMs = job.schedule.kind === "cron" ? resolveCronNextRunWithLowerBound({
			state,
			job,
			naturalNext: normalNext,
			lowerBoundMs: backoffNext,
			context: "error_backoff"
		}) : normalNext !== void 0 ? Math.max(normalNext, backoffNext) : backoffNext;
		state.deps.log.info({
			jobId: job.id,
			consecutiveErrors: job.state.consecutiveErrors,
			backoffMs: backoff,
			nextRunAtMs: job.state.nextRunAtMs
		}, "cron: applying error backoff");
	} else if (isJobEnabled(job) && result.status === "ok" && job.pacing !== void 0 && result.nextCheck !== void 0) {
		const pacedNextRunAtMs = resolvePacedNextRunAtMs({
			nowMs: result.endedAt,
			delayMs: result.nextCheck.delayMs,
			pacing: job.pacing
		});
		const nextRunAtMs = job.trigger ? Math.max(pacedNextRunAtMs, result.endedAt + Math.max(MIN_REFIRE_GAP_MS, resolveCronTriggerMinIntervalMs())) : pacedNextRunAtMs;
		job.state.nextRunAtMs = nextRunAtMs;
		job.state.pacedNextRunAtMs = nextRunAtMs;
	} else if (isJobEnabled(job)) {
		let naturalNext;
		try {
			naturalNext = previousConsecutiveErrors > 0 && job.schedule.kind === "every" ? computeNextRunAtMs(job.schedule, result.endedAt) : computeJobNextRunAtMs(job, result.endedAt);
		} catch (err) {
			recordScheduleComputeError({
				state,
				job,
				err
			});
		}
		if (job.schedule.kind === "cron") {
			const minNext = result.endedAt + Math.max(MIN_REFIRE_GAP_MS, job.trigger ? resolveCronTriggerMinIntervalMs() : 0);
			job.state.nextRunAtMs = resolveCronNextRunWithLowerBound({
				state,
				job,
				naturalNext,
				lowerBoundMs: minNext,
				context: "completion"
			});
		} else job.state.nextRunAtMs = naturalNext !== void 0 && job.trigger ? Math.max(naturalNext, result.endedAt + resolveCronTriggerMinIntervalMs()) : naturalNext;
	} else job.state.nextRunAtMs = void 0;
	return shouldDelete;
}
function applyTriggerEvaluationState(job, triggerEval, evaluatedAtMs) {
	if (triggerEval.busy) return;
	job.state.lastTriggerEvalAtMs = evaluatedAtMs;
	job.state.triggerEvalCount = (job.state.triggerEvalCount ?? 0) + 1;
	if (triggerEval.stateChanged) job.state.triggerState = triggerEval.state;
	if (triggerEval.fired) job.state.lastTriggerFireAtMs = evaluatedAtMs;
}
/** Persists fired/error evaluation metadata and applies successful once-disarm policy. */
function applyTriggerRunResult(job, result) {
	if (!result.triggerEval) return;
	applyTriggerEvaluationState(job, result.status === "ok" ? result.triggerEval : {
		...result.triggerEval,
		stateChanged: false,
		state: void 0
	}, result.endedAt);
	if (result.triggerEval.fired && job.trigger?.once === true && result.status === "ok") {
		job.enabled = false;
		job.state.nextRunAtMs = void 0;
	}
}
/** Commits payload-script state only after the complete cron run succeeds. */
function applyScriptRunResult(job, result) {
	if (result.status === "ok" && result.scriptStateChanged === true) job.state.triggerState = result.scriptState;
}
/** Applies a quiet trigger tick without mutating normal run-history state. */
function applyTriggerNoFireResult(state, job, result, opts) {
	const previousNextRunAtMs = job.state.nextRunAtMs;
	const previousPacedNextRunAtMs = job.state.pacedNextRunAtMs;
	job.state.queuedAtMs = void 0;
	job.state.runningAtMs = void 0;
	job.updatedAtMs = result.endedAt;
	if (!result.triggerEval.busy) {
		job.state.consecutiveErrors = 0;
		job.state.scheduleErrorCount = 0;
		job.state.lastFailureAlertAtMs = void 0;
		applyTriggerEvaluationState(job, result.triggerEval, result.endedAt);
	}
	if (opts?.scheduleMode === "preserve") {
		job.state.nextRunAtMs = previousNextRunAtMs;
		job.state.pacedNextRunAtMs = previousPacedNextRunAtMs;
		job.state.forcePreservedNextRunAtMs = previousNextRunAtMs;
		return;
	}
	job.state.pacedNextRunAtMs = void 0;
	job.state.forcePreservedNextRunAtMs = void 0;
	try {
		const naturalNext = computeJobNextRunAtMs(job, result.endedAt);
		const floorMs = Math.max(MIN_REFIRE_GAP_MS, resolveCronTriggerMinIntervalMs());
		job.state.nextRunAtMs = naturalNext === void 0 ? void 0 : Math.max(naturalNext, result.endedAt + floorMs);
	} catch (err) {
		recordScheduleComputeError({
			state,
			job,
			err
		});
	}
}
function applyOutcomeToStoredJob(state, result) {
	const store = state.store;
	if (!store) {
		tryFinishCronTaskRunWithoutHistory(state, result);
		return;
	}
	const jobs = store.jobs;
	const job = jobs.find((entry) => entry.id === result.jobId);
	if (!job) {
		if (result.status === "ok" && result.triggerEval?.fired === false) {
			tryFinishCronTaskRunWithoutHistory(state, result);
			return;
		}
		if (result.status === "ok") {
			applyJobResult(state, result.job, result);
			emitJobFinished(state, result.job, result, result.startedAt);
			state.deps.log.info({ jobId: result.jobId }, "cron: finalized successful run after job was removed during execution");
			return;
		}
		state.deps.log.warn({ jobId: result.jobId }, "cron: applyOutcomeToStoredJob — job not found after forceReload, result discarded");
		tryFinishCronTaskRunWithoutHistory(state, result);
		return;
	}
	if (result.status === "ok" && result.triggerEval && !result.triggerEval.fired) {
		applyTriggerNoFireResult(state, job, {
			startedAt: result.startedAt,
			endedAt: result.endedAt,
			triggerEval: result.triggerEval
		});
		job.state.startupCatchupAtMs = void 0;
		job.state.pacedNextRunAtMs = void 0;
		return;
	}
	const shouldDelete = applyJobResult(state, job, result);
	applyTriggerRunResult(job, result);
	applyScriptRunResult(job, result);
	job.state.startupCatchupAtMs = void 0;
	emitJobFinished(state, job, result, result.startedAt);
	if (shouldDelete) {
		store.jobs = jobs.filter((entry) => entry.id !== job.id);
		return job;
	}
}
/** Arms the cron timer for the next wake or a maintenance recheck. */
function armTimer(state) {
	if (state.timer) clearTimeout(state.timer);
	state.timer = null;
	if (state.stopped || state.schedulingPaused) {
		state.deps.log.debug({}, "cron: armTimer skipped - scheduler stopped");
		return;
	}
	if (!state.deps.cronEnabled) {
		state.deps.log.debug({}, "cron: armTimer skipped - scheduler disabled");
		return;
	}
	if (state.restartRecoveryPending) {
		state.deps.log.warn({}, "cron: armTimer skipped - restart recovery pending");
		return;
	}
	const nextAt = nextWakeAtMs(state);
	if (!nextAt) {
		const jobCount = state.store?.jobs.length ?? 0;
		const enabledCount = state.store?.jobs.filter((j) => j.enabled).length ?? 0;
		const withNextRun = state.store?.jobs.filter((j) => j.enabled && hasScheduledNextRunAtMs(j.state.nextRunAtMs)).length ?? 0;
		if (enabledCount > 0) {
			armRunningRecheckTimer(state);
			state.deps.log.debug({
				jobCount,
				enabledCount,
				withNextRun,
				delayMs: MAX_TIMER_DELAY_MS
			}, "cron: timer armed for maintenance recheck");
			return;
		}
		state.deps.log.debug({
			jobCount,
			enabledCount,
			withNextRun
		}, "cron: armTimer skipped - no jobs with nextRunAtMs");
		return;
	}
	const now = state.deps.nowMs();
	const delay = Math.max(nextAt - now, 0);
	const clampedDelay = Math.min(delay === 0 ? MIN_REFIRE_GAP_MS : delay, MAX_TIMER_DELAY_MS);
	state.timer = setTimeout(() => {
		onTimer(state).catch((err) => {
			state.deps.log.error({ err: String(err) }, "cron: timer tick failed");
		});
	}, clampedDelay);
	state.deps.log.debug({
		nextAt,
		delayMs: clampedDelay,
		clamped: delay > MAX_TIMER_DELAY_MS
	}, "cron: timer armed");
}
function armRunningRecheckTimer(state) {
	if (state.stopped || state.schedulingPaused) return;
	if (state.timer) clearTimeout(state.timer);
	state.timer = setTimeout(() => {
		onTimer(state).catch((err) => {
			state.deps.log.error({ err: String(err) }, "cron: timer tick failed");
		});
	}, MAX_TIMER_DELAY_MS);
}
/** Handles one cron timer tick under the process-wide root work admission. */
async function onTimer(state) {
	let admission;
	try {
		admission = await beginGatewayRootWorkAdmissionWhenOpen();
	} catch (err) {
		if (err instanceof GatewayDrainingError) return;
		throw err;
	}
	try {
		await admission.run(async () => await onAdmittedTimer(state));
	} finally {
		admission.release();
	}
}
/** Loads due jobs, reserves them, executes, persists, and re-arms. */
async function onAdmittedTimer(state) {
	if (state.stopped || state.schedulingPaused) return;
	if (state.restartRecoveryPending) {
		state.deps.log.warn({}, "cron: timer tick skipped - restart recovery pending");
		return;
	}
	if (state.running) {
		armRunningRecheckTimer(state);
		return;
	}
	state.running = true;
	armRunningRecheckTimer(state);
	try {
		const dueJobs = await locked(state, async () => {
			await ensureLoaded(state, {
				forceReload: true,
				skipRecompute: true
			});
			if (state.stopped || state.restartRecoveryPending) {
				state.deps.log.warn({
					stopped: state.stopped,
					restartRecoveryPending: state.restartRecoveryPending
				}, "cron: due job reservation skipped - scheduler unavailable");
				return [];
			}
			const dueCheckNow = state.deps.nowMs();
			const due = collectRunnableJobs(state, dueCheckNow);
			if (due.length === 0) {
				if (recomputeNextRunsForMaintenance(state, {
					recomputeExpired: true,
					nowMs: dueCheckNow
				})) await persist(state);
				return [];
			}
			const now = state.deps.nowMs();
			const reservationRollbackSnapshot = snapshotStoreForRollback(state);
			for (const job of due) job.state.queuedAtMs = now;
			await persistOrRestore(state, reservationRollbackSnapshot);
			const reservedDue = due.map((job) => ({
				id: job.id,
				job,
				reservedAtMs: now,
				reservationIdentity: reserveQueuedCronRun(state, job.id, now)
			}));
			if (state.stopped) {
				const cleanup = async () => {
					const rollbackSnapshot = snapshotStoreForRollback(state);
					const pendingReleases = [];
					for (const candidate of reservedDue) {
						if (!isQueuedCronRunReservationCurrent(state, candidate.id, candidate.reservationIdentity)) continue;
						const persistedJob = state.store?.jobs.find((entry) => entry.id === candidate.id);
						if (typeof persistedJob?.state.queuedAtMs === "number" && isQueuedCronRunReservationMarkerCurrent(state, candidate.id, candidate.reservationIdentity, persistedJob.state.queuedAtMs)) {
							restoreQueuedCronRunReservationLastError(state, candidate.id, candidate.reservationIdentity, persistedJob.state);
							delete persistedJob.state.queuedAtMs;
							pendingReleases.push(candidate);
						} else releaseQueuedCronRun(state, candidate.id, candidate.reservationIdentity);
					}
					recomputeNextRunsForMaintenance(state);
					await persistOrRestore(state, rollbackSnapshot);
					for (const candidate of pendingReleases) releaseQueuedCronRun(state, candidate.id, candidate.reservationIdentity);
				};
				try {
					await cleanup();
				} catch {
					try {
						await cleanup();
					} catch (error) {
						for (const candidate of reservedDue) releaseQueuedCronRun(state, candidate.id, candidate.reservationIdentity);
						throw error;
					}
				}
				return [];
			}
			return reservedDue;
		});
		const runDueJob = async (params) => {
			const { id, job, startedAt } = params;
			const executionJob = structuredClone(job);
			executionJob.state.runningAtMs = startedAt;
			executionJob.state.lastError = void 0;
			const activeJobMarker = markCronJobActive(executionJob.id, { preserveAcrossGenerationAdvance: !runsDetachedFromMainSession(executionJob) });
			emit(state, {
				jobId: executionJob.id,
				action: "started",
				job: executionJob,
				runAtMs: startedAt
			});
			const jobTimeoutMs = resolveCronJobTimeoutMs(executionJob);
			const taskRunId = tryCreateCronTaskRun({
				state,
				job: executionJob,
				startedAt,
				runIdStartedAt: params.reservedAtMs
			});
			try {
				const result = await executeJobCoreWithTimeout(state, executionJob, {
					runId: taskRunId,
					activeJobMarker
				});
				return {
					jobId: id,
					job: executionJob,
					taskRunId,
					activeJobMarker,
					reservationIdentity: params.reservationIdentity,
					...result,
					startedAt,
					endedAt: state.deps.nowMs()
				};
			} catch (err) {
				const errorText = normalizeCronRunErrorText(err);
				state.deps.log.warn({
					jobId: id,
					jobName: executionJob.name,
					timeoutMs: jobTimeoutMs ?? null
				}, `cron: job failed: ${errorText}`);
				return {
					jobId: id,
					job: executionJob,
					taskRunId,
					activeJobMarker,
					reservationIdentity: params.reservationIdentity,
					status: "error",
					error: errorText,
					diagnostics: createCronRunDiagnosticsFromError("cron-setup", errorText, { nowMs: state.deps.nowMs }),
					startedAt,
					endedAt: state.deps.nowMs()
				};
			}
		};
		const finalizeCompletedResults = async (completedResults, opts) => {
			if (completedResults.length === 0) return [];
			let finalizedResults = [];
			let finalizationSucceeded = false;
			try {
				const currentResults = filterCurrentCronRunOutcomes(completedResults);
				if (currentResults.length === 0) {
					finishRetiredCronTaskRuns(state, completedResults, currentResults);
					return [];
				}
				await locked(state, async () => {
					await ensureLoaded(state, {
						forceReload: true,
						skipRecompute: true
					});
					finalizedResults = filterCurrentCronRunOutcomes(currentResults);
					finishRetiredCronTaskRuns(state, completedResults, finalizedResults);
					const rollbackSnapshot = snapshotStoreForRollback(state);
					const removedJobs = [];
					for (const result of finalizedResults) {
						const removedJob = applyOutcomeToStoredJob(state, result);
						if (removedJob) removedJobs.push(removedJob);
					}
					if (finalizedResults.length === 0) return;
					recomputeNextRunsForMaintenance(state);
					await persistOrRestore(state, rollbackSnapshot);
					finishPersistedQuietCronTaskRuns(state, finalizedResults);
					for (const removedJob of removedJobs) emit(state, {
						jobId: removedJob.id,
						action: "removed",
						job: removedJob
					});
				});
				finalizationSucceeded = finalizedResults.length > 0;
				return finalizedResults;
			} finally {
				for (const result of completedResults) if (result.reservationIdentity) releaseQueuedCronRun(state, result.jobId, result.reservationIdentity);
				if (opts?.clearOnFailure !== false || finalizationSucceeded) clearActiveMarkersForOutcomes(completedResults);
			}
		};
		const concurrency = Math.min(resolveRunConcurrency(), Math.max(1, dueJobs.length));
		const claimedIndexes = /* @__PURE__ */ new Set();
		let reservationReleaseError;
		let setupTimeoutNotified = false;
		let stopAdmittingDueJobs = false;
		const hasSetupTimeoutRecoveryHandler = state.deps.onIsolatedAgentSetupTimeout !== void 0;
		const releaseUnclaimedDueJobReservations = async () => {
			if (claimedIndexes.size >= dueJobs.length) return;
			await locked(state, async () => {
				await ensureLoaded(state, {
					forceReload: true,
					skipRecompute: true
				});
				const rollbackSnapshot = snapshotStoreForRollback(state);
				const pendingReleases = [];
				for (const [index, due] of dueJobs.entries()) {
					if (claimedIndexes.has(index)) continue;
					const job = state.store?.jobs.find((entry) => entry.id === due.id);
					if (job && clearQueuedCronRunReservationMarker(state, due.id, due.reservationIdentity, job.state)) pendingReleases.push(due);
					else releaseQueuedCronRun(state, due.id, due.reservationIdentity);
				}
				recomputeNextRunsForMaintenance(state);
				await persistOrRestore(state, rollbackSnapshot);
				for (const due of pendingReleases) releaseQueuedCronRun(state, due.id, due.reservationIdentity);
			});
		};
		const releaseUnclaimedDueJobReservationsWithRetry = async () => {
			try {
				await releaseUnclaimedDueJobReservations();
			} catch {
				try {
					await releaseUnclaimedDueJobReservations();
				} catch (error) {
					for (const [index, due] of dueJobs.entries()) if (!claimedIndexes.has(index)) releaseQueuedCronRun(state, due.id, due.reservationIdentity);
					throw error;
				}
			}
		};
		if (state.stopped) {
			await releaseUnclaimedDueJobReservationsWithRetry();
			return;
		}
		let completedResults;
		let batchExecutionError;
		try {
			completedResults = await pMap(dueJobs, async (due, index) => {
				if (stopAdmittingDueJobs || state.stopped || state.restartRecoveryPending) {
					stopAdmittingDueJobs = true;
					return pMapSkip;
				}
				try {
					const admission = await runWithCronAdmission(state, async () => {
						const currentDueJob = await locked(state, async () => {
							await ensureLoaded(state, {
								forceReload: true,
								skipRecompute: true
							});
							if (stopAdmittingDueJobs || state.stopped || state.restartRecoveryPending) {
								stopAdmittingDueJobs = true;
								return;
							}
							const job = state.store?.jobs.find((entry) => entry.id === due.id);
							if (!job || !isQueuedCronRunReservationCurrent(state, due.id, due.reservationIdentity) || job.state.queuedAtMs !== due.reservedAtMs) {
								releaseQueuedCronRun(state, due.id, due.reservationIdentity);
								return;
							}
							const dueProbe = structuredClone(job);
							delete dueProbe.state.queuedAtMs;
							if (!isJobEnabled(job) || !isRunnableJob({
								state,
								job: dueProbe,
								nowMs: state.deps.nowMs()
							})) {
								const rollbackSnapshot = snapshotStoreForRollback(state);
								delete job.state.queuedAtMs;
								await persistOrRestore(state, rollbackSnapshot);
								releaseQueuedCronRun(state, due.id, due.reservationIdentity);
								return;
							}
							const startedAt = state.deps.nowMs();
							const previousLastError = job.state.lastError;
							const activationRollbackSnapshot = snapshotStoreForRollback(state);
							delete job.state.queuedAtMs;
							job.state.runningAtMs = startedAt;
							job.state.lastError = void 0;
							await persistOrRestore(state, activationRollbackSnapshot);
							updateQueuedCronRunReservationMarker(state, due.id, due.reservationIdentity, startedAt, previousLastError);
							if (state.stopped || state.restartRecoveryPending) {
								stopAdmittingDueJobs = true;
								job.state.lastError = previousLastError;
								const rollbackSnapshot = snapshotStoreForRollback(state);
								delete job.state.runningAtMs;
								await persistOrRestore(state, rollbackSnapshot);
								releaseQueuedCronRun(state, due.id, due.reservationIdentity);
								return;
							}
							return {
								...due,
								job,
								startedAt
							};
						});
						if (!currentDueJob) return pMapSkip;
						claimedIndexes.add(index);
						let result;
						try {
							result = await runDueJob(currentDueJob);
						} catch (error) {
							releaseQueuedCronRun(state, due.id, due.reservationIdentity);
							throw error;
						}
						if (!result.isolatedAgentSetupTimeout) return result;
						let finalizedResults;
						try {
							finalizedResults = await finalizeCompletedResults([result], { clearOnFailure: false });
						} catch {
							return result;
						}
						if (!hasSetupTimeoutRecoveryHandler || finalizedResults.length === 0) return pMapSkip;
						if (!setupTimeoutNotified) {
							setupTimeoutNotified = true;
							stopAdmittingDueJobs = true;
							try {
								await releaseUnclaimedDueJobReservationsWithRetry();
							} catch (err) {
								reservationReleaseError = err;
							}
							maybeNotifyIsolatedAgentSetupTimeout(state, result);
						}
						return pMapSkip;
					});
					if (admission.kind === "stopped") {
						stopAdmittingDueJobs = true;
						return pMapSkip;
					}
					return admission.value;
				} catch (error) {
					stopAdmittingDueJobs = true;
					batchExecutionError ??= error;
					return pMapSkip;
				}
			}, {
				concurrency,
				stopOnError: false
			});
		} catch (error) {
			await releaseUnclaimedDueJobReservationsWithRetry();
			throw error instanceof AggregateError && error.errors.length > 0 ? error.errors[0] : error;
		}
		let postBatchError = reservationReleaseError;
		if (stopAdmittingDueJobs) try {
			await releaseUnclaimedDueJobReservationsWithRetry();
		} catch (error) {
			postBatchError ??= error;
		}
		if (completedResults.length > 0) {
			const finalizedResults = await finalizeCompletedResults(completedResults);
			for (const result of finalizedResults) if (!setupTimeoutNotified && result.isolatedAgentSetupTimeout && maybeNotifyIsolatedAgentSetupTimeout(state, result)) {
				setupTimeoutNotified = true;
				break;
			}
		}
		if (postBatchError) throw postBatchError instanceof Error ? postBatchError : new Error(formatErrorMessage(postBatchError));
		if (batchExecutionError) throw batchExecutionError instanceof Error ? batchExecutionError : new Error(formatErrorMessage(batchExecutionError));
	} finally {
		const storePaths = /* @__PURE__ */ new Set();
		if (state.deps.resolveSessionStorePath) {
			const defaultAgentId = state.deps.defaultAgentId ?? "main";
			if (state.store?.jobs?.length) for (const job of state.store.jobs) {
				const agentId = typeof job.agentId === "string" && job.agentId.trim() ? job.agentId : defaultAgentId;
				storePaths.add(state.deps.resolveSessionStorePath(agentId));
			}
			else storePaths.add(state.deps.resolveSessionStorePath(defaultAgentId));
		} else if (state.deps.sessionStorePath) storePaths.add(state.deps.sessionStorePath);
		if (storePaths.size > 0) {
			const nowMs = state.deps.nowMs();
			for (const storePath of storePaths) try {
				await sweepCronRunSessions({
					cronConfig: state.deps.cronConfig,
					sessionStorePath: storePath,
					nowMs,
					log: state.deps.log
				});
			} catch (err) {
				state.deps.log.warn({
					err: String(err),
					storePath
				}, "cron: session reaper sweep failed");
			}
		}
		state.running = false;
		armTimer(state);
	}
}
function isRunnableJob(params) {
	const { job, nowMs } = params;
	if (!job.state) job.state = {};
	if (!isJobEnabled(job)) return false;
	if (params.skipJobIds?.has(job.id)) return false;
	if (hasActiveCronRun(job)) return false;
	const lastRunStatus = resolveJobLastRunStatus$1(job);
	if (params.skipAtIfAlreadyRan && job.schedule.kind === "at" && lastRunStatus) {
		const lastRun = job.state.lastRunAtMs;
		const nextRun = job.state.nextRunAtMs;
		if (isScheduledTerminalOneShotRetry(job, lastRunStatus, lastRun, nextRun)) return typeof nextRun === "number" && nowMs >= nextRun;
		return false;
	}
	const next = job.state.nextRunAtMs;
	if (isErrorBackoffPending(params.state, job, nowMs)) return false;
	if (hasScheduledNextRunAtMs(next) && nowMs >= next) {
		const lastRunAtMs = job.state.lastRunAtMs;
		if (!(params.allowCronMissedRunByLastRun && job.schedule.kind === "cron" && (lastRunStatus === "ok" || lastRunStatus === "skipped") && typeof lastRunAtMs === "number" && Number.isFinite(lastRunAtMs) && lastRunAtMs >= next)) return true;
		let latestRunAtMs;
		try {
			latestRunAtMs = computeJobPreviousRunAtOrBeforeMs(job, nowMs);
		} catch {
			return false;
		}
		return typeof latestRunAtMs === "number" && latestRunAtMs > lastRunAtMs;
	}
	if (!params.allowCronMissedRunByLastRun || job.schedule.kind !== "cron") return false;
	let previousRunAtMs;
	try {
		previousRunAtMs = computeJobPreviousRunAtMs(job, nowMs);
	} catch {
		return false;
	}
	if (typeof previousRunAtMs !== "number" || !Number.isFinite(previousRunAtMs)) return false;
	const lastRunAtMs = job.state.lastRunAtMs;
	if (typeof lastRunAtMs !== "number" || !Number.isFinite(lastRunAtMs)) return false;
	return previousRunAtMs > lastRunAtMs;
}
function isErrorBackoffPending(_state, job, nowMs) {
	if (job.schedule.kind === "at" || resolveJobLastRunStatus$1(job) !== "error") return false;
	const backoffUntilMs = resolveJobErrorBackoffUntilMs(job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
	return backoffUntilMs !== void 0 && nowMs < backoffUntilMs;
}
function collectRunnableJobs(state, nowMs, opts) {
	if (!state.store) return [];
	return state.store.jobs.filter((job) => isRunnableJob({
		state,
		job,
		nowMs,
		skipJobIds: opts?.skipJobIds,
		skipAtIfAlreadyRan: opts?.skipAtIfAlreadyRan,
		allowCronMissedRunByLastRun: opts?.allowCronMissedRunByLastRun
	}));
}
function deferPendingBackoffMissedCronSlots(state, nowMs, opts) {
	if (!state.store) return false;
	let changed = false;
	for (const job of state.store.jobs) {
		if (!isJobEnabled(job) || job.schedule.kind !== "cron" || opts?.skipJobIds?.has(job.id) || typeof job.state.queuedAtMs === "number" || typeof job.state.runningAtMs === "number") continue;
		const backoffUntilMs = resolveJobErrorBackoffUntilMs(job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
		if (backoffUntilMs === void 0 || nowMs >= backoffUntilMs) continue;
		let previousRunAtMs;
		try {
			previousRunAtMs = computeJobPreviousRunAtMs(job, nowMs);
		} catch {
			continue;
		}
		const lastRunAtMs = job.state.lastRunAtMs;
		if (typeof previousRunAtMs !== "number" || !Number.isFinite(previousRunAtMs) || typeof lastRunAtMs !== "number" || !Number.isFinite(lastRunAtMs) || previousRunAtMs <= lastRunAtMs) continue;
		if (job.state.nextRunAtMs !== backoffUntilMs) {
			job.state.nextRunAtMs = backoffUntilMs;
			changed = true;
		}
	}
	return changed;
}
async function releaseStartupCatchupReservationsAfterFailure(state, plan, outcomes) {
	const attempt = async () => {
		await locked(state, async () => {
			await ensureLoaded(state, {
				forceReload: true,
				skipRecompute: true
			});
			const rollbackSnapshot = snapshotStoreForRollback(state);
			const pendingReleases = clearUnstartedStartupCatchupReservationMarkers(state, plan, outcomes);
			if (pendingReleases.length === 0) return;
			recomputeNextRunsForMaintenance(state, { repairFutureCronNextRunAtMs: false });
			await persistOrRestore(state, rollbackSnapshot);
			for (const pending of pendingReleases) releaseQueuedCronRun(state, pending.jobId, pending.reservationIdentity);
		});
	};
	try {
		await attempt();
	} catch {
		try {
			await attempt();
		} catch (error) {
			for (const candidate of plan.candidates) releaseQueuedCronRun(state, candidate.jobId, candidate.reservationIdentity);
			throw error;
		}
	}
}
/** Runs or defers missed startup jobs using restart catch-up limits. */
async function runMissedJobs(state, opts) {
	if (state.stopped) return;
	const plan = await planStartupCatchup(state, opts);
	if (plan.candidates.length === 0 && plan.deferredJobs.length === 0) return;
	const execution = await executeStartupCatchupPlan(state, plan);
	let finalizedOutcomes;
	try {
		finalizedOutcomes = await applyStartupCatchupOutcomes(state, plan, execution.outcomes);
	} catch (finalizationError) {
		if (execution.ok) {
			try {
				await releaseStartupCatchupReservationsAfterFailure(state, plan, execution.outcomes);
			} catch (cleanupError) {
				state.deps.log.warn({ err: String(cleanupError) }, "cron: failed to release startup catch-up reservations after finalization error");
			}
			throw finalizationError;
		}
		try {
			await releaseStartupCatchupReservationsAfterFailure(state, plan, execution.outcomes);
		} catch (cleanupError) {
			state.deps.log.warn({ err: String(cleanupError) }, "cron: failed to release startup catch-up reservations after execution error");
		}
		throw execution.error;
	}
	for (const outcome of finalizedOutcomes) maybeNotifyIsolatedAgentSetupTimeout(state, outcome);
	if (!execution.ok) throw execution.error;
}
async function planStartupCatchup(state, opts) {
	const maxImmediate = Math.max(0, state.deps.maxMissedJobsPerRestart ?? DEFAULT_MAX_MISSED_JOBS_PER_RESTART);
	return locked(state, async () => {
		await ensureLoaded(state, { skipRecompute: true });
		if (state.stopped || !state.store) return {
			candidates: [],
			deferredJobs: []
		};
		const now = state.deps.nowMs();
		const deferredBackoffMissedSlot = deferPendingBackoffMissedCronSlots(state, now, { skipJobIds: opts?.skipJobIds });
		const missed = collectRunnableJobs(state, now, {
			skipJobIds: opts?.skipJobIds,
			skipAtIfAlreadyRan: true,
			allowCronMissedRunByLastRun: true
		});
		if (missed.length === 0) {
			if (deferredBackoffMissedSlot) await persist(state);
			return {
				candidates: [],
				deferredJobs: []
			};
		}
		const sorted = missed.toSorted((a, b) => (a.state.nextRunAtMs ?? 0) - (b.state.nextRunAtMs ?? 0));
		const deferredAgentJobs = opts?.deferAgentTurnJobs ? sorted.filter((job) => job.payload.kind === "agentTurn") : [];
		const startupEligible = opts?.deferAgentTurnJobs ? sorted.filter((job) => job.payload.kind !== "agentTurn") : sorted;
		const startupCandidates = startupEligible.slice(0, maxImmediate);
		const deferredOverflow = startupEligible.slice(maxImmediate);
		const deferredAgentDelayMs = Math.max(0, state.deps.startupDeferredMissedAgentJobDelayMs ?? DEFAULT_STARTUP_DEFERRED_MISSED_AGENT_JOB_DELAY_MS);
		const deferred = [...deferredOverflow.map((job) => ({ jobId: job.id })), ...deferredAgentJobs.map((job) => ({
			jobId: job.id,
			delayMs: deferredAgentDelayMs
		}))];
		if (deferred.length > 0) state.deps.log.info({
			immediateCount: startupCandidates.length,
			deferredCount: deferred.length,
			totalMissed: missed.length
		}, "cron: staggering missed jobs to prevent gateway overload");
		if (deferredAgentJobs.length > 0) state.deps.log.info({
			count: deferredAgentJobs.length,
			jobIds: deferredAgentJobs.map((job) => job.id),
			delayMs: deferredAgentDelayMs
		}, "cron: deferring missed agent jobs until after gateway startup");
		if (startupCandidates.length > 0) state.deps.log.info({
			count: startupCandidates.length,
			jobIds: startupCandidates.map((j) => j.id)
		}, "cron: running missed jobs after restart");
		const reservationRollbackSnapshot = snapshotStoreForRollback(state);
		for (const job of startupCandidates) job.state.queuedAtMs = now;
		await persistOrRestore(state, reservationRollbackSnapshot);
		return {
			candidates: startupCandidates.map((job) => ({
				jobId: job.id,
				job,
				reservedAtMs: now,
				reservationIdentity: reserveQueuedCronRun(state, job.id, now)
			})),
			deferredJobs: deferred
		};
	});
}
async function executeStartupCatchupPlan(state, plan) {
	const outcomes = [];
	try {
		for (const candidate of plan.candidates) {
			if (state.stopped) break;
			const admission = await runWithCronAdmission(state, async () => {
				const startedCandidate = await locked(state, async () => {
					await ensureLoaded(state, {
						forceReload: true,
						skipRecompute: true
					});
					const job = state.store?.jobs.find((entry) => entry.id === candidate.jobId);
					if (state.stopped || state.restartRecoveryPending) return;
					if (!job || !isQueuedCronRunReservationCurrent(state, candidate.jobId, candidate.reservationIdentity) || job.state.queuedAtMs !== candidate.reservedAtMs) {
						releaseQueuedCronRun(state, candidate.jobId, candidate.reservationIdentity);
						return;
					}
					const dueProbe = structuredClone(job);
					delete dueProbe.state.queuedAtMs;
					if (!isRunnableJob({
						state,
						job: dueProbe,
						nowMs: state.deps.nowMs(),
						skipAtIfAlreadyRan: true,
						allowCronMissedRunByLastRun: true
					})) {
						const rollbackSnapshot = snapshotStoreForRollback(state);
						delete job.state.queuedAtMs;
						recomputeNextRunsForMaintenance(state, { repairFutureCronNextRunAtMs: false });
						await persistOrRestore(state, rollbackSnapshot);
						releaseQueuedCronRun(state, candidate.jobId, candidate.reservationIdentity);
						return;
					}
					const startedAt = state.deps.nowMs();
					const previousLastError = job.state.lastError;
					const activationRollbackSnapshot = snapshotStoreForRollback(state);
					delete job.state.queuedAtMs;
					job.state.runningAtMs = startedAt;
					job.state.lastError = void 0;
					await persistOrRestore(state, activationRollbackSnapshot);
					updateQueuedCronRunReservationMarker(state, candidate.jobId, candidate.reservationIdentity, startedAt, previousLastError);
					if (state.stopped || state.restartRecoveryPending) {
						job.state.lastError = previousLastError;
						const rollbackSnapshot = snapshotStoreForRollback(state);
						delete job.state.runningAtMs;
						await persistOrRestore(state, rollbackSnapshot);
						releaseQueuedCronRun(state, candidate.jobId, candidate.reservationIdentity);
						return;
					}
					return {
						...candidate,
						job,
						startedAt
					};
				});
				if (!startedCandidate) return;
				try {
					return await runStartupCatchupCandidate(state, startedCandidate);
				} catch (error) {
					releaseQueuedCronRun(state, candidate.jobId, candidate.reservationIdentity);
					throw error;
				}
			});
			if (admission.kind === "stopped") break;
			if (admission.value) outcomes.push(admission.value);
		}
	} catch (error) {
		return {
			ok: false,
			outcomes,
			error
		};
	}
	return {
		ok: true,
		outcomes
	};
}
async function runStartupCatchupCandidate(state, candidate) {
	const { startedAt } = candidate;
	const executionJob = structuredClone(candidate.job);
	executionJob.state.runningAtMs = startedAt;
	const taskRunId = tryCreateCronTaskRun({
		state,
		job: executionJob,
		startedAt,
		runIdStartedAt: candidate.reservedAtMs
	});
	const activeJobMarker = markCronJobActive(executionJob.id, { preserveAcrossGenerationAdvance: !runsDetachedFromMainSession(executionJob) });
	emit(state, {
		jobId: executionJob.id,
		action: "started",
		job: executionJob,
		runAtMs: startedAt
	});
	try {
		const result = await executeJobCoreWithTimeout(state, executionJob, {
			runId: taskRunId,
			activeJobMarker
		});
		return {
			jobId: candidate.jobId,
			job: executionJob,
			taskRunId,
			activeJobMarker,
			reservationIdentity: candidate.reservationIdentity,
			...result,
			startedAt,
			endedAt: state.deps.nowMs()
		};
	} catch (err) {
		return {
			jobId: candidate.jobId,
			job: executionJob,
			taskRunId,
			activeJobMarker,
			reservationIdentity: candidate.reservationIdentity,
			status: "error",
			error: normalizeCronRunErrorText(err),
			diagnostics: createCronRunDiagnosticsFromError("cron-setup", normalizeCronRunErrorText(err), { nowMs: state.deps.nowMs }),
			startedAt,
			endedAt: state.deps.nowMs()
		};
	}
}
async function applyStartupCatchupOutcomes(state, plan, outcomes) {
	const staggerMs = Math.max(0, state.deps.missedJobStaggerMs ?? DEFAULT_MISSED_JOB_STAGGER_MS);
	try {
		const currentOutcomes = filterCurrentCronRunOutcomes(outcomes);
		let finalizedOutcomes = [];
		await locked(state, async () => {
			await ensureLoaded(state, {
				forceReload: true,
				skipRecompute: true
			});
			if (!state.store) return;
			if (state.stopped) {
				const rollbackSnapshot = snapshotStoreForRollback(state);
				finishRetiredCronTaskRuns(state, outcomes, []);
				const pendingReleases = clearUnstartedStartupCatchupReservationMarkers(state, plan, outcomes);
				if (pendingReleases.length > 0) {
					recomputeNextRunsForMaintenance(state, { repairFutureCronNextRunAtMs: false });
					await persistOrRestore(state, rollbackSnapshot);
					for (const pending of pendingReleases) releaseQueuedCronRun(state, pending.jobId, pending.reservationIdentity);
				}
				return;
			}
			finalizedOutcomes = filterCurrentCronRunOutcomes(currentOutcomes);
			finishRetiredCronTaskRuns(state, outcomes, finalizedOutcomes);
			const rollbackSnapshot = snapshotStoreForRollback(state);
			const pendingReleases = clearUnstartedStartupCatchupReservationMarkers(state, plan, outcomes);
			const removedJobs = [];
			for (const result of finalizedOutcomes) {
				const removedJob = applyOutcomeToStoredJob(state, result);
				if (removedJob) removedJobs.push(removedJob);
			}
			if (finalizedOutcomes.length === 0 && plan.deferredJobs.length === 0) {
				if (pendingReleases.length > 0) {
					recomputeNextRunsForMaintenance(state, { repairFutureCronNextRunAtMs: false });
					await persistOrRestore(state, rollbackSnapshot);
					for (const pending of pendingReleases) releaseQueuedCronRun(state, pending.jobId, pending.reservationIdentity);
				}
				return;
			}
			if (plan.deferredJobs.length > 0) {
				const baseNow = state.deps.nowMs();
				let offset = staggerMs;
				for (const deferred of plan.deferredJobs) {
					const jobId = deferred.jobId;
					const job = state.store.jobs.find((entry) => entry.id === jobId);
					if (!job || !isJobEnabled(job)) continue;
					if (typeof deferred.delayMs === "number") {
						const runAtMs = baseNow + deferred.delayMs + offset - staggerMs;
						job.state.nextRunAtMs = runAtMs;
						job.state.startupCatchupAtMs = runAtMs;
						offset += staggerMs;
						continue;
					}
					const runAtMs = baseNow + offset;
					job.state.nextRunAtMs = runAtMs;
					job.state.startupCatchupAtMs = runAtMs;
					offset += staggerMs;
				}
			}
			recomputeNextRunsForMaintenance(state, { repairFutureCronNextRunAtMs: false });
			await persistOrRestore(state, rollbackSnapshot);
			for (const pending of pendingReleases) releaseQueuedCronRun(state, pending.jobId, pending.reservationIdentity);
			finishPersistedQuietCronTaskRuns(state, finalizedOutcomes);
			for (const removedJob of removedJobs) emit(state, {
				jobId: removedJob.id,
				action: "removed",
				job: removedJob
			});
		});
		return finalizedOutcomes;
	} finally {
		for (const outcome of outcomes) if (outcome.reservationIdentity) releaseQueuedCronRun(state, outcome.jobId, outcome.reservationIdentity);
		clearActiveMarkersForOutcomes(outcomes);
	}
}
/** Executes a cron job without mutating persisted job state. */
async function executeJobCore(state, job, abortSignal, options) {
	const resolveAbortError = () => ({
		status: "error",
		error: abortErrorMessage(abortSignal)
	});
	const waitWithAbort = async (ms) => {
		if (!abortSignal) {
			await new Promise((resolve) => {
				setTimeout(resolve, ms);
			});
			return;
		}
		if (abortSignal.aborted) return;
		await new Promise((resolve) => {
			const timer = setTimeout(() => {
				abortSignal.removeEventListener("abort", onAbort);
				resolve();
			}, ms);
			const onAbort = () => {
				clearTimeout(timer);
				abortSignal.removeEventListener("abort", onAbort);
				resolve();
			};
			abortSignal.addEventListener("abort", onAbort, { once: true });
		});
	};
	if (abortSignal?.aborted) return resolveAbortError();
	let effectiveJob = job;
	let triggerEval;
	if (job.trigger) {
		const evaluator = state.deps.evaluateCronTrigger;
		if (!evaluator) return {
			status: "error",
			error: "cron trigger evaluator is unavailable"
		};
		const evaluation = await evaluator({
			job,
			script: job.trigger.script,
			state: job.state.triggerState,
			abortSignal
		});
		if (evaluation.kind === "busy") {
			state.deps.log.debug({ jobId: job.id }, "cron: trigger evaluation skipped while busy");
			return {
				status: "ok",
				triggerEval: {
					fired: false,
					stateChanged: false,
					busy: true
				}
			};
		}
		if (evaluation.kind === "error") return {
			status: "error",
			error: `cron trigger evaluation failed (${evaluation.code}): ${evaluation.error}`,
			triggerEval: {
				fired: false,
				stateChanged: false
			}
		};
		const stateChanged = Object.hasOwn(evaluation, "state");
		triggerEval = {
			fired: evaluation.fire,
			stateChanged,
			...stateChanged ? { state: evaluation.state } : {}
		};
		if (!evaluation.fire) return {
			status: "ok",
			triggerEval
		};
		if (evaluation.message !== void 0) {
			const payload = job.payload.kind === "systemEvent" ? {
				...job.payload,
				text: `${job.payload.text}\n\n${evaluation.message}`
			} : job.payload.kind === "agentTurn" ? {
				...job.payload,
				message: `${job.payload.message}\n\n${evaluation.message}`
			} : job.payload;
			effectiveJob = {
				...job,
				payload
			};
		}
	}
	if (effectiveJob.payload.kind === "script") {
		const result = await executeScriptCronJob(state, effectiveJob, abortSignal, options?.activeJobMarker);
		return triggerEval ? {
			...result,
			triggerEval
		} : result;
	}
	if (effectiveJob.sessionTarget === "main") {
		const result = await executeMainSessionCronJob(state, effectiveJob, abortSignal, waitWithAbort, options?.activeJobMarker, options?.owningCronLaneTaskMarker);
		return triggerEval ? {
			...result,
			triggerEval
		} : result;
	}
	const result = await executeDetachedCronJob(state, effectiveJob, abortSignal, resolveAbortError, options);
	return triggerEval ? {
		...result,
		triggerEval
	} : result;
}
async function executeMainSessionCronJob(state, job, abortSignal, waitWithAbort, activeJobMarker, owningCronLaneTaskMarker) {
	const text = resolveJobPayloadTextForMain(job);
	if (!text) return {
		status: "skipped",
		error: job.payload.kind === "systemEvent" ? "main job requires non-empty systemEvent text" : "main job requires payload.kind=\"systemEvent\""
	};
	const cronRunSessionKey = resolveMainSessionCronRunSessionKey(job, typeof job.state.runningAtMs === "number" ? job.state.runningAtMs : state.deps.nowMs());
	const deliveryContext = resolveMainSessionCronDeliveryContext(state, job);
	const queuedSystemEvent = normalizeQueuedSystemEventHandle(enqueueCronSystemEvent(state, text, {
		agentId: job.agentId,
		sessionKey: cronRunSessionKey,
		contextKey: `cron:${job.id}`,
		...deliveryContext ? { deliveryContext } : {}
	}));
	if (job.wakeMode === "now" && state.deps.runHeartbeatOnce) {
		const reason = `cron:${job.id}`;
		const maxWaitMs = state.deps.wakeNowHeartbeatBusyMaxWaitMs ?? 2 * 6e4;
		const retryDelayMs = state.deps.wakeNowHeartbeatBusyRetryDelayMs ?? 250;
		const waitStartedAt = state.deps.nowMs();
		let heartbeatResult;
		for (;;) {
			if (abortSignal?.aborted) {
				removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
				return {
					status: "error",
					error: timeoutErrorMessage()
				};
			}
			heartbeatResult = await state.deps.runHeartbeatOnce({
				source: "cron",
				intent: "immediate",
				reason,
				agentId: job.agentId,
				sessionKey: cronRunSessionKey,
				owningCronJobMarker: activeJobMarker,
				owningCronLaneTaskMarker,
				heartbeat: { target: "last" }
			});
			if (abortSignal?.aborted) {
				removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
				return {
					status: "error",
					error: timeoutErrorMessage()
				};
			}
			if (heartbeatResult.status !== "skipped" || !isRetryableHeartbeatBusySkipReason(heartbeatResult.reason)) break;
			if (heartbeatResult.reason === "cron-in-progress") {
				state.deps.requestHeartbeat({
					source: "cron",
					intent: "immediate",
					reason,
					agentId: job.agentId,
					sessionKey: cronRunSessionKey,
					heartbeat: { target: "last" }
				});
				return {
					status: "ok",
					summary: text,
					sessionKey: cronRunSessionKey
				};
			}
			if (abortSignal?.aborted) {
				removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
				return {
					status: "error",
					error: timeoutErrorMessage()
				};
			}
			if (state.deps.nowMs() - waitStartedAt > maxWaitMs) {
				if (abortSignal?.aborted) {
					removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
					return {
						status: "error",
						error: timeoutErrorMessage()
					};
				}
				state.deps.requestHeartbeat({
					source: "cron",
					intent: "immediate",
					reason,
					agentId: job.agentId,
					sessionKey: cronRunSessionKey,
					heartbeat: { target: "last" }
				});
				return {
					status: "ok",
					summary: text,
					sessionKey: cronRunSessionKey
				};
			}
			await waitWithAbort(retryDelayMs);
		}
		if (heartbeatResult.status === "ran") return {
			status: "ok",
			summary: text,
			sessionKey: cronRunSessionKey
		};
		if (heartbeatResult.status === "skipped") {
			removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
			return {
				status: "skipped",
				error: heartbeatResult.reason,
				summary: text,
				sessionKey: cronRunSessionKey
			};
		}
		removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
		return {
			status: "error",
			error: heartbeatResult.reason,
			summary: text,
			sessionKey: cronRunSessionKey
		};
	}
	if (abortSignal?.aborted) {
		removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
		return {
			status: "error",
			error: timeoutErrorMessage()
		};
	}
	requestCronHeartbeat(state, {
		intent: job.wakeMode === "now" ? "immediate" : "event",
		reason: `cron:${job.id}`,
		agentId: job.agentId,
		sessionKey: cronRunSessionKey,
		heartbeat: { target: "last" }
	});
	return {
		status: "ok",
		summary: text,
		sessionKey: cronRunSessionKey
	};
}
async function executeDetachedCronJob(state, job, abortSignal, resolveAbortError, options) {
	if (job.payload.kind === "command") {
		if (!state.deps.runCommandJob) {
			const error = "cron command runner is not configured";
			return {
				status: "skipped",
				error,
				diagnostics: createCronRunDiagnosticsFromError("cron-preflight", error, {
					severity: "warn",
					nowMs: state.deps.nowMs
				})
			};
		}
		const res = await state.deps.runCommandJob({
			job,
			abortSignal
		});
		if (abortSignal?.aborted) {
			const error = abortErrorMessage(abortSignal);
			return {
				status: "error",
				error,
				diagnostics: createCronRunDiagnosticsFromError("cron-setup", error, { nowMs: state.deps.nowMs })
			};
		}
		return {
			status: res.status,
			error: res.error,
			deliveryError: res.deliveryError,
			summary: res.summary,
			delivered: res.delivered,
			deliveryAttempted: res.deliveryAttempted,
			delivery: res.delivery,
			diagnostics: res.diagnostics
		};
	}
	if (job.payload.kind !== "agentTurn") {
		const error = "isolated job requires payload.kind=\"agentTurn\" or \"command\"";
		return {
			status: "skipped",
			error,
			diagnostics: createCronRunDiagnosticsFromError("cron-preflight", error, {
				severity: "warn",
				nowMs: state.deps.nowMs
			})
		};
	}
	if (abortSignal?.aborted) {
		const aborted = resolveAbortError();
		return {
			...aborted,
			diagnostics: createCronRunDiagnosticsFromError("cron-setup", aborted.error, { nowMs: state.deps.nowMs })
		};
	}
	const res = await state.deps.runIsolatedAgentJob({
		job,
		message: job.payload.message,
		abortSignal,
		onExecutionStarted: options?.onExecutionStarted,
		onExecutionPhase: options?.onExecutionPhase,
		onLaneWait: options?.onLaneWait
	});
	if (abortSignal?.aborted) {
		const error = abortErrorMessage(abortSignal);
		return {
			status: "error",
			error,
			diagnostics: createCronRunDiagnosticsFromError("cron-setup", error, { nowMs: state.deps.nowMs })
		};
	}
	return {
		status: res.status,
		error: res.error,
		executionStarted: res.executionStarted,
		deliveryError: res.deliveryError,
		nextCheck: res.nextCheck,
		summary: res.summary,
		delivered: res.delivered,
		deliveryAttempted: res.deliveryAttempted,
		delivery: res.delivery,
		sessionId: res.sessionId,
		sessionKey: res.sessionKey,
		diagnostics: res.diagnostics,
		model: res.model,
		provider: res.provider,
		usage: res.usage
	};
}
async function executeScriptCronJob(state, job, abortSignal, activeJobMarker) {
	if (state.deps.cronConfig?.triggers?.enabled !== true) return {
		status: "error",
		error: "cron script payload execution is disabled; set cron.triggers.enabled=true to allow unattended scripts"
	};
	if (!state.deps.runScriptJob) return {
		status: "error",
		error: "cron script payload executor is unavailable"
	};
	const result = await state.deps.runScriptJob({
		job,
		abortSignal
	});
	if (!isCronActiveJobMarkerCurrent(activeJobMarker)) return {
		status: "error",
		error: "Gateway restarting."
	};
	if (abortSignal?.aborted) return {
		status: "error",
		error: abortErrorMessage(abortSignal)
	};
	if (result.status !== "ok") return result;
	if (result.nextCheck && !job.pacing) return {
		status: "error",
		error: "cron script payload returned nextCheck, but this job has no pacing bounds"
	};
	const notify = result.notify?.trim() ? result.notify : void 0;
	if (job.sessionTarget === "main" && notify) enqueueCronSystemEvent(state, notify, {
		agentId: job.agentId,
		contextKey: `cron:${job.id}:script`
	});
	if (result.wake) {
		const eventText = notify ?? `script job ${job.name} completed`;
		if (job.sessionTarget !== "main" || !notify) enqueueCronSystemEvent(state, eventText, {
			agentId: job.agentId,
			contextKey: `cron:${job.id}:script-wake`
		});
		requestCronHeartbeat(state, {
			intent: result.wake === "now" ? "immediate" : "event",
			reason: `cron:${job.id}:script`,
			agentId: job.agentId
		});
	}
	return {
		status: "ok",
		...notify ? { summary: notify } : {},
		delivered: result.delivered,
		deliveryAttempted: result.deliveryAttempted,
		deliveryError: result.deliveryError,
		delivery: result.delivery,
		nextCheck: result.nextCheck,
		scriptStateChanged: result.stateChanged === true,
		...result.stateChanged === true ? { scriptState: result.state } : {}
	};
}
function emitJobFinished(state, job, result, runAtMs) {
	const event = {
		jobId: job.id,
		action: "finished",
		job,
		status: result.status,
		error: result.error,
		summary: result.summary,
		diagnostics: result.diagnostics,
		delivered: job.state.lastDelivered,
		deliveryStatus: job.state.lastDeliveryStatus,
		deliveryError: job.state.lastDeliveryError,
		failureNotificationDelivery: failureNotificationDeliveryFromJobState(job),
		delivery: result.delivery,
		sessionId: result.sessionId,
		sessionKey: result.sessionKey,
		runAtMs,
		durationMs: job.state.lastDurationMs,
		nextRunAtMs: job.state.nextRunAtMs,
		...result.triggerEval?.fired ? { triggerFired: true } : {},
		model: result.model,
		provider: result.provider,
		usage: result.usage
	};
	tryFinishCronTaskRun(state, {
		taskRunId: result.taskRunId,
		job,
		event,
		...result.scriptStateChanged === true ? { scriptResult: result } : {},
		...result.triggerEval ? { triggerEval: result.triggerEval } : {}
	});
	emit(state, event);
}
/** Clears the currently armed cron timer. */
function stopTimer(state) {
	if (state.timer) clearTimeout(state.timer);
	state.timer = null;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.cronTimerTestApi")] = {
	executeJobCore,
	onTimer
};
//#endregion
//#region src/cron/service/startup-run-repair.ts
/** Repairs interrupted and finalized cron runs while the service starts. */
const STARTUP_INTERRUPTED_ERROR = "cron: job interrupted by gateway restart";
function resolveInterruptedStartupFailureNotificationStatus(params) {
	if (params.job.delivery?.bestEffort === true) return "not-requested";
	if (resolveFailureDestination(params.job, params.state.deps.cronConfig?.failureDestination)) return "unknown";
	const primaryPlan = resolveCronDeliveryPlan(params.job);
	return primaryPlan.mode === "announce" && primaryPlan.requested ? "unknown" : "not-requested";
}
function markInterruptedStartupRun(params) {
	const { job, runningAtMs, nowMs } = params;
	const failureNotificationStatus = resolveInterruptedStartupFailureNotificationStatus({
		state: params.state,
		job
	});
	const previousErrors = typeof job.state.consecutiveErrors === "number" && Number.isFinite(job.state.consecutiveErrors) ? Math.max(0, Math.floor(job.state.consecutiveErrors)) : 0;
	params.state.deps.log.warn({
		jobId: job.id,
		runningAtMs
	}, "cron: marking interrupted running job failed on startup");
	job.state.runningAtMs = void 0;
	job.state.lastRunAtMs = runningAtMs;
	job.state.lastRunStatus = "error";
	job.state.lastStatus = "error";
	job.state.lastError = STARTUP_INTERRUPTED_ERROR;
	job.state.lastDurationMs = Math.max(0, nowMs - runningAtMs);
	job.state.consecutiveErrors = previousErrors + 1;
	job.state.lastDelivered = false;
	job.state.lastDeliveryStatus = "unknown";
	job.state.lastDeliveryError = STARTUP_INTERRUPTED_ERROR;
	job.state.lastFailureNotificationDelivered = void 0;
	job.state.lastFailureNotificationDeliveryStatus = failureNotificationStatus;
	job.state.lastFailureNotificationDeliveryError = void 0;
	job.state.nextRunAtMs = void 0;
	job.updatedAtMs = nowMs;
	if (job.schedule.kind === "at") job.enabled = false;
	return {
		jobId: job.id,
		...params.taskRunId ? { taskRunId: params.taskRunId } : {},
		runAtMs: runningAtMs,
		durationMs: job.state.lastDurationMs
	};
}
function restoreFinalizedStartupRun(params) {
	const { state, job, runningAtMs, entry } = params;
	const startedAt = entry.runAtMs ?? runningAtMs;
	const shouldDelete = applyJobResult(state, job, {
		...entry,
		startedAt,
		endedAt: entry.ts
	}, { replayFailureAlertAtMs: entry.ts });
	job.state.lastDurationMs = entry.durationMs ?? Math.max(0, entry.ts - startedAt);
	job.state.lastErrorReason = entry.errorReason;
	job.state.lastDelivered = entry.delivered;
	job.state.lastDeliveryStatus = entry.deliveryStatus;
	job.state.lastDeliveryError = entry.deliveryError;
	job.state.lastFailureNotificationDelivered = entry.failureNotificationDelivery?.delivered;
	job.state.lastFailureNotificationDeliveryStatus = entry.failureNotificationDelivery?.status;
	job.state.lastFailureNotificationDeliveryError = entry.failureNotificationDelivery?.error;
	job.state.nextRunAtMs = entry.nextRunAtMs;
	if (job.schedule.kind === "at" && entry.nextRunAtMs === void 0) job.enabled = false;
	if (params.triggerEval) applyTriggerRunResult(job, {
		status: entry.status,
		endedAt: entry.ts,
		triggerEval: params.triggerEval
	});
	if (params.scriptResult) applyScriptRunResult(job, {
		status: entry.status,
		...params.scriptResult
	});
	state.deps.log.info({
		jobId: job.id,
		runningAtMs,
		status: entry.status
	}, "cron: restored finalized task-ledger run on startup");
	return shouldDelete;
}
function mergeManualRunSnapshotAfterReload(params) {
	if (!params.state.store) return;
	if (params.removed) {
		params.state.store.jobs = params.state.store.jobs.filter((job) => job.id !== params.jobId);
		return;
	}
	if (!params.snapshot) return;
	const reloaded = params.state.store.jobs.find((job) => job.id === params.jobId);
	if (!reloaded) return;
	reloaded.enabled = params.snapshot.enabled;
	reloaded.updatedAtMs = params.snapshot.updatedAtMs;
	reloaded.state = params.snapshot.state;
}
//#endregion
//#region src/cron/service/ops.ts
/** Public cron service operations for lifecycle, CRUD, listing, and manual runs. */
function markManualCronJobActive(state, job) {
	const jobId = job.id;
	state.activeManualRunJobIds.add(jobId);
	return markCronJobActive(jobId, { preserveAcrossGenerationAdvance: !runsDetachedFromMainSession(job) });
}
function clearManualCronJobActive(state, jobId, activeJobMarker) {
	state.activeManualRunJobIds.delete(jobId);
	clearCronJobActive(jobId, activeJobMarker);
	if (state.activeManualRunJobIds.size === 0) state.manualSetupTimeoutNotified = false;
}
function maybeNotifyManualIsolatedSetupTimeout(state, result) {
	if (!result.isolatedAgentSetupTimeout || state.manualSetupTimeoutNotified) return false;
	const notified = maybeNotifyIsolatedAgentSetupTimeout(state, result);
	state.manualSetupTimeoutNotified ||= notified;
	return notified;
}
async function ensureLoadedForRead(state) {
	await ensureLoaded(state, { skipRecompute: true });
	if (!state.store) return;
	if (recomputeNextRunsForMaintenance(state)) await persist(state);
}
/** Starts the cron service, recovers interrupted runs, catches up missed jobs, and arms the timer. */
async function start(state) {
	state.stopped = false;
	if (!state.deps.cronEnabled) {
		state.deps.log.info({ enabled: false }, "cron: disabled");
		return;
	}
	const interruptedJobIds = /* @__PURE__ */ new Set();
	const interruptedRuns = [];
	const completedJobIdsToDelete = /* @__PURE__ */ new Set();
	let repairedAnyStartupRun = false;
	await locked(state, async () => {
		await ensureLoaded(state, { skipRecompute: true });
		if (state.stopped) return;
		const jobs = state.store?.jobs ?? [];
		for (const job of jobs) {
			job.state ??= {};
			if (typeof job.state.queuedAtMs === "number") {
				state.deps.log.info({
					jobId: job.id,
					queuedAtMs: job.state.queuedAtMs
				}, "cron: releasing queued job reservation on startup");
				job.state.queuedAtMs = void 0;
				repairedAnyStartupRun = true;
			}
			if (typeof job.state.runningAtMs === "number") {
				const runningAtMs = job.state.runningAtMs;
				const taskRunId = tryFindCronTaskRunIdForRecovery(state, job.id, runningAtMs);
				const finalized = tryFindFinalizedCronTaskRun(state, job.id, runningAtMs);
				if (finalized) {
					interruptedJobIds.add(job.id);
					if (restoreFinalizedStartupRun({
						state,
						job,
						runningAtMs,
						entry: finalized.entry,
						...finalized.scriptResult ? { scriptResult: finalized.scriptResult } : {},
						...finalized.triggerEval ? { triggerEval: finalized.triggerEval } : {}
					})) completedJobIdsToDelete.add(job.id);
					repairedAnyStartupRun = true;
					continue;
				}
				const interrupted = markInterruptedStartupRun({
					state,
					job,
					taskRunId,
					runningAtMs,
					nowMs: state.deps.nowMs()
				});
				interruptedJobIds.add(job.id);
				interruptedRuns.push(interrupted);
				repairedAnyStartupRun = true;
			}
		}
		if (completedJobIdsToDelete.size > 0 && state.store) state.store.jobs = jobs.filter((job) => !completedJobIdsToDelete.has(job.id));
		if (repairedAnyStartupRun || jobs.length > 0) await persist(state, repairedAnyStartupRun ? void 0 : { stateOnly: true });
	});
	if (state.stopped) return;
	await runMissedJobs(state, {
		skipJobIds: interruptedJobIds.size > 0 ? interruptedJobIds : void 0,
		deferAgentTurnJobs: true
	});
	await locked(state, async () => {
		await ensureLoaded(state, { skipRecompute: true });
		if (state.stopped) return;
		if (recomputeNextRunsForMaintenance(state, { recomputeExpired: true })) await persist(state);
		for (const interrupted of interruptedRuns) {
			const job = state.store?.jobs.find((entry) => entry.id === interrupted.jobId);
			emitCronRunFinished(state, {
				jobId: interrupted.jobId,
				action: "finished",
				job,
				status: "error",
				error: STARTUP_INTERRUPTED_ERROR,
				delivered: false,
				deliveryStatus: "unknown",
				deliveryError: STARTUP_INTERRUPTED_ERROR,
				failureNotificationDelivery: job ? failureNotificationDeliveryFromJobState(job) : void 0,
				runAtMs: interrupted.runAtMs,
				durationMs: interrupted.durationMs,
				nextRunAtMs: job?.state.nextRunAtMs
			}, void 0, interrupted.taskRunId);
		}
		armTimer(state);
		state.deps.log.info({
			enabled: true,
			jobs: state.store?.jobs.length ?? 0,
			nextWakeAtMs: nextWakeAtMs(state) ?? null
		}, "cron: started");
	});
}
/** Stops the cron service timer without mutating persisted job state. */
function stop(state) {
	state.stopped = true;
	cancelCronRunAdmissionWaiters(state);
	state.schedulerStarted = false;
	stopTimer(state);
}
/** Temporarily stops automatic ticks without running startup recovery on resume. */
function pauseScheduling(state) {
	state.schedulingPaused = true;
	stopTimer(state);
}
function resumeScheduling(state) {
	if (!state.schedulingPaused) return;
	state.schedulingPaused = false;
	if (!state.schedulerStarted) return;
	try {
		armTimer(state);
	} catch (err) {
		state.schedulingPaused = true;
		stopTimer(state);
		throw err;
	}
}
/** Returns cron service status after a read-only maintenance pass. */
async function status(state) {
	return await locked(state, async () => {
		await ensureLoadedForRead(state);
		const sqlitePath = resolveOpenClawStateSqlitePath();
		return {
			enabled: state.deps.cronEnabled,
			storePath: sqlitePath,
			storage: "sqlite",
			sqlitePath,
			jobs: state.store?.jobs.length ?? 0,
			nextWakeAtMs: state.deps.cronEnabled ? nextWakeAtMs(state) ?? null : null
		};
	});
}
/** Lists cron jobs sorted by next run time, excluding disabled jobs unless requested. */
async function list(state, opts) {
	return await locked(state, async () => {
		await ensureLoadedForRead(state);
		const includeDisabled = opts?.includeDisabled === true;
		return (state.store?.jobs ?? []).filter((j) => includeDisabled || isJobEnabled(j)).toSorted((a, b) => (a.state.nextRunAtMs ?? 0) - (b.state.nextRunAtMs ?? 0));
	});
}
/** Reads one cron job by id without advancing due schedules. */
async function readJob(state, id) {
	return await locked(state, async () => {
		await ensureLoadedForRead(state);
		return state.store?.jobs.find((job) => job.id === id);
	});
}
function resolveEnabledFilter(opts) {
	if (opts?.enabled === "all" || opts?.enabled === "enabled" || opts?.enabled === "disabled") return opts.enabled;
	return opts?.includeDisabled ? "all" : "enabled";
}
function resolveScheduleKindFilter(opts) {
	if (opts?.scheduleKind === "all" || opts?.scheduleKind === "at" || opts?.scheduleKind === "every" || opts?.scheduleKind === "cron" || opts?.scheduleKind === "on-exit") return opts.scheduleKind;
	return "all";
}
function resolveLastRunStatusFilter(opts) {
	if (opts?.lastRunStatus === "all" || opts?.lastRunStatus === "ok" || opts?.lastRunStatus === "error" || opts?.lastRunStatus === "skipped" || opts?.lastRunStatus === "unknown") return opts.lastRunStatus;
	return "all";
}
function resolveJobLastRunStatus(job) {
	return job.state.lastRunStatus ?? job.state.lastStatus ?? "unknown";
}
function resolveEffectiveJobAgentId(job, defaultAgentId) {
	return normalizeOptionalAgentId(job.agentId) ?? normalizeOptionalAgentId(defaultAgentId) ?? "main";
}
function resolveCurrentDefaultAgentId(state) {
	return state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId;
}
/** Lists a filtered, sorted, bounded page of cron jobs for CLI/RPC callers. */
async function listPage(state, opts) {
	return await locked(state, async () => {
		await ensureLoadedForRead(state);
		const query = normalizeLowercaseStringOrEmpty(opts?.query);
		const enabledFilter = resolveEnabledFilter(opts);
		const scheduleKindFilter = resolveScheduleKindFilter(opts);
		const lastRunStatusFilter = resolveLastRunStatusFilter(opts);
		const sortBy = opts?.sortBy ?? "nextRunAtMs";
		const sortDir = opts?.sortDir ?? "asc";
		const requestedAgentId = normalizeOptionalAgentId(opts?.agentId);
		const filtered = (state.store?.jobs ?? []).filter((job) => {
			if (enabledFilter === "enabled" && !isJobEnabled(job)) return false;
			if (enabledFilter === "disabled" && isJobEnabled(job)) return false;
			if (requestedAgentId && resolveEffectiveJobAgentId(job, state.deps.defaultAgentId) !== requestedAgentId) return false;
			if (scheduleKindFilter !== "all" && job.schedule.kind !== scheduleKindFilter) return false;
			if (lastRunStatusFilter !== "all" && resolveJobLastRunStatus(job) !== lastRunStatusFilter) return false;
			if (!query) return true;
			return normalizeLowercaseStringOrEmpty([
				job.id,
				job.name,
				job.description ?? "",
				job.agentId ?? ""
			].join(" ")).includes(query);
		});
		const snapshot = structuredClone(sortCronJobs(filtered, sortBy, sortDir));
		const snapshotRevision = resolveCronListSnapshotRevision(snapshot);
		const total = snapshot.length;
		const offset = Math.max(0, Math.min(total, Math.floor(opts?.offset ?? 0)));
		const defaultLimit = total === 0 ? 50 : total;
		const limit = Math.max(1, Math.min(200, Math.floor(opts?.limit ?? defaultLimit)));
		const jobs = snapshot.slice(offset, offset + limit);
		const nextOffset = offset + jobs.length;
		return {
			jobs,
			snapshotRevision,
			total,
			offset,
			limit,
			hasMore: nextOffset < total,
			nextOffset: nextOffset < total ? nextOffset : null
		};
	});
}
function finalizeUpdatedJob(params) {
	const { job, nextJob, now } = params;
	if (nextJob.schedule.kind === "every") {
		const anchor = nextJob.schedule.anchorMs;
		if (typeof anchor !== "number" || !Number.isFinite(anchor)) {
			const fallbackAnchorMs = (job.schedule.kind === "every" && job.schedule.everyMs === nextJob.schedule.everyMs && typeof job.schedule.anchorMs === "number" && Number.isFinite(job.schedule.anchorMs) ? job.schedule.anchorMs : void 0) ?? (params.scheduleChanged ? now : typeof nextJob.createdAtMs === "number" && Number.isFinite(nextJob.createdAtMs) ? nextJob.createdAtMs : now);
			nextJob.schedule = {
				...nextJob.schedule,
				anchorMs: Math.max(0, Math.floor(fallbackAnchorMs))
			};
		}
	}
	const schedulingInputsChanged = params.schedulingInputsRequested && !cronSchedulingInputsEqual(job, nextJob);
	if (params.scheduleChanged && nextJob.schedule.kind === "cron" && !isJobEnabled(nextJob)) computeJobNextRunAtMs({
		...nextJob,
		enabled: true
	}, now);
	nextJob.updatedAtMs = now;
	if (schedulingInputsChanged) {
		nextJob.state.startupCatchupAtMs = void 0;
		nextJob.state.pacedNextRunAtMs = void 0;
		nextJob.state.forcePreservedNextRunAtMs = void 0;
		if (isJobEnabled(nextJob)) nextJob.state.nextRunAtMs = computeJobNextRunAtMs(nextJob, now);
		else {
			nextJob.state.nextRunAtMs = void 0;
			nextJob.state.queuedAtMs = void 0;
			if (!isCronJobActive(nextJob.id)) nextJob.state.runningAtMs = void 0;
		}
	} else if (isJobEnabled(nextJob) && !hasScheduledNextRunAtMs(nextJob.state.nextRunAtMs)) nextJob.state.nextRunAtMs = computeJobNextRunAtMs(nextJob, now);
}
async function persistUpdatedJob(params) {
	const { state, snapshot, nextJob } = params;
	if (state.store) {
		const index = state.store.jobs.findIndex((entry) => entry.id === nextJob.id);
		if (index >= 0) state.store.jobs[index] = nextJob;
	}
	await persistOrRestore(state, snapshot, { suppressScheduledJobId: nextJob.id });
	armTimer(state);
	emit(state, {
		jobId: nextJob.id,
		action: "updated",
		job: nextJob,
		nextRunAtMs: nextJob.state.nextRunAtMs
	});
}
function declarativeFields(job, includeEnabled) {
	return {
		schedule: job.schedule,
		pacing: job.pacing,
		trigger: job.trigger,
		payload: job.payload,
		delivery: job.delivery,
		displayName: job.displayName,
		...includeEnabled ? { enabled: job.enabled } : {}
	};
}
/** Adds or converges a declaration-keyed cron job inside one store lock and write transaction. */
async function add(state, input, opts) {
	return await locked(state, async () => {
		warnIfDisabled(state, "add");
		await ensureLoaded(state, { skipRecompute: true });
		const agentId = resolveEffectiveJobAgentId(input, resolveCurrentDefaultAgentId(state));
		if (state.deps.isAgentAvailable?.(agentId) === false) throw new Error(`cron job agent is unavailable: ${agentId}`);
		const normalizedId = normalizeOptionalString(input.id);
		if (input.id !== void 0 && !normalizedId) throw new Error("cron job id must not be blank");
		if (normalizedId) normalizeCronTaskRunJobId(normalizedId);
		const normalizedInput = normalizedId ? {
			...input,
			id: normalizedId
		} : input;
		const declarationKey = normalizeOptionalString(input.declarationKey);
		const matches = declarationKey ? state.store?.jobs.filter((job) => job.declarationKey === declarationKey && (opts?.matchesExisting?.(job) ?? true)) ?? [] : [];
		if (matches.length > 1) throw new Error(`cron declarationKey is ambiguous within caller scope: ${declarationKey}`);
		const existing = matches[0];
		if (existing) {
			const now = state.deps.nowMs();
			const nextJob = structuredClone(existing);
			applyDeclarativeJobSpec(nextJob, normalizedInput, {
				defaultAgentId: state.deps.defaultAgentId,
				enabledExplicit: opts?.enabledExplicit === true,
				nowMs: now,
				cronConfig: state.deps.cronConfig
			});
			const includeEnabled = opts?.enabledExplicit === true;
			if (isDeepStrictEqual(declarativeFields(existing, includeEnabled), declarativeFields(nextJob, includeEnabled))) return {
				...existing,
				created: false,
				updated: false,
				job: existing
			};
			const snapshot = snapshotStoreForRollback(state);
			finalizeUpdatedJob({
				job: existing,
				nextJob,
				now,
				schedulingInputsRequested: true,
				scheduleChanged: !isDeepStrictEqual(existing.schedule, nextJob.schedule)
			});
			await persistUpdatedJob({
				state,
				snapshot,
				nextJob
			});
			return {
				...nextJob,
				created: false,
				updated: true,
				job: nextJob
			};
		}
		if (normalizedId && state.store?.jobs.some((job) => job.id === normalizedId)) throw new Error(`cron job already exists: ${normalizedId}`);
		const snapshot = snapshotStoreForRollback(state);
		const job = createJob(state, normalizedInput);
		state.store?.jobs.push(job);
		const postPersistAutoDisableNotifications = [];
		recomputeNextRunsForMaintenance(state, { deferredAutoDisableNotifications: postPersistAutoDisableNotifications });
		await persistOrRestore(state, snapshot, {
			postPersistAutoDisableNotifications,
			suppressScheduledJobId: job.id
		});
		armTimer(state);
		state.deps.log.info({
			jobId: job.id,
			jobName: job.name,
			nextRunAtMs: job.state.nextRunAtMs,
			schedulerNextWakeAtMs: nextWakeAtMs(state) ?? null,
			timerArmed: state.timer !== null,
			cronEnabled: state.deps.cronEnabled
		}, "cron: job added");
		emit(state, {
			jobId: job.id,
			action: "added",
			job,
			nextRunAtMs: job.state.nextRunAtMs
		});
		return declarationKey ? {
			...job,
			created: true,
			job
		} : job;
	});
}
async function updateLoadedJob(params) {
	const { state, id, patch, precondition } = params;
	warnIfDisabled(state, "update");
	await ensureLoaded(state, { skipRecompute: true });
	const snapshot = snapshotStoreForRollback(state);
	const job = findJobOrThrow(state, id);
	const now = state.deps.nowMs();
	await precondition?.(structuredClone(job), now);
	const nextJob = structuredClone(job);
	applyJobPatch(nextJob, patch, {
		defaultAgentId: state.deps.defaultAgentId,
		scheduleValidationNowMs: now,
		cronConfig: state.deps.cronConfig
	});
	if (patch.agentId !== void 0) {
		const agentId = resolveEffectiveJobAgentId(nextJob, resolveCurrentDefaultAgentId(state));
		if (state.deps.isAgentAvailable?.(agentId) === false) throw new Error(`cron job agent is unavailable: ${agentId}`);
	}
	finalizeUpdatedJob({
		job,
		nextJob,
		now,
		schedulingInputsRequested: patch.schedule !== void 0 || patch.enabled !== void 0 || "trigger" in patch || "pacing" in patch,
		scheduleChanged: patch.schedule !== void 0
	});
	await persistUpdatedJob({
		state,
		snapshot,
		nextJob
	});
	return nextJob;
}
/** Updates a cron job patch in-place, recomputes affected schedule state, and persists it. */
async function update(state, id, patch) {
	return await locked(state, async () => await updateLoadedJob({
		state,
		id,
		patch
	}));
}
/** Updates a cron job only after a store-locked caller precondition passes. */
async function updateWithPrecondition(state, id, patch, precondition) {
	return await locked(state, async () => await updateLoadedJob({
		state,
		id,
		patch,
		precondition
	}));
}
/** Removes a cron job by id and re-arms the timer when the in-memory store changes. */
async function remove(state, id) {
	return await locked(state, async () => {
		warnIfDisabled(state, "remove");
		await ensureLoaded(state, { skipRecompute: true });
		const before = state.store?.jobs.length ?? 0;
		if (!state.store) return {
			ok: false,
			removed: false
		};
		const snapshot = snapshotStoreForRollback(state);
		const removedJob = state.store.jobs.find((j) => j.id === id);
		state.store.jobs = state.store.jobs.filter((j) => j.id !== id);
		const removed = (state.store.jobs.length ?? 0) !== before;
		const postPersistAutoDisableNotifications = [];
		recomputeNextRunsForMaintenance(state, { deferredAutoDisableNotifications: postPersistAutoDisableNotifications });
		await persistOrRestore(state, snapshot, {
			postPersistAutoDisableNotifications,
			suppressScheduledJobId: id
		});
		armTimer(state);
		if (removed) emit(state, {
			jobId: id,
			action: "removed",
			job: removedJob
		});
		return {
			ok: true,
			removed
		};
	});
}
/** Remove one agent's jobs while holding the cron lock across an external roster commit. */
async function removeAgentJobsTransactional(state, agentId, commit) {
	return await locked(state, async () => {
		warnIfDisabled(state, "remove agent jobs");
		await ensureLoaded(state, { skipRecompute: true });
		const id = normalizeOptionalAgentId(agentId);
		if (!id || !state.store) return await commit();
		const defaultAgentId = resolveCurrentDefaultAgentId(state);
		const removedJobs = state.store.jobs.filter((job) => resolveEffectiveJobAgentId(job, defaultAgentId) === id);
		if (removedJobs.length === 0) return await commit();
		const snapshot = snapshotStoreForRollback(state);
		state.store.jobs = state.store.jobs.filter((job) => resolveEffectiveJobAgentId(job, defaultAgentId) !== id);
		recomputeNextRunsForMaintenance(state);
		await persistOrRestore(state, snapshot);
		let result;
		try {
			result = await commit();
		} catch (error) {
			if (error instanceof AgentDeletionCommitUncertainError) {
				armTimer(state);
				for (const job of removedJobs) emit(state, {
					jobId: job.id,
					action: "removed",
					job
				});
				throw error;
			}
			state.store = snapshot.store;
			state.durableNextRunAtMsByJobId = snapshot.durableNextRunAtMsByJobId;
			try {
				if (!await persist(state)) throw new Error("cron: rollback store write did not complete", { cause: error });
				armTimer(state);
			} catch (rollbackError) {
				throw new AgentDeletionAuthorityRollbackError([error, rollbackError], `cron: failed to roll back agent job deletion for ${id}`, { cause: error });
			}
			throw error;
		}
		armTimer(state);
		for (const job of removedJobs) emit(state, {
			jobId: job.id,
			action: "removed",
			job
		});
		return result;
	});
}
function emitCronRunFinished(state, evt, tracker, taskRunId, triggerEval, scriptResult) {
	tryFinishCronTaskRun(state, {
		taskRunId,
		job: evt.job,
		event: evt,
		...scriptResult ? { scriptResult } : {},
		...triggerEval ? { triggerEval } : {}
	});
	emit(state, evt);
	if (tracker) tracker.emitted = true;
}
let nextManualRunId = 1;
async function skipInvalidPersistedManualRun(params) {
	const rollbackSnapshot = snapshotStoreForRollback(params.state);
	const endedAt = params.state.deps.nowMs();
	const errorText = normalizeCronRunErrorText(params.error);
	const diagnostics = createCronRunDiagnosticsFromError("cron-preflight", errorText, {
		severity: "warn",
		nowMs: params.state.deps.nowMs
	});
	applyJobResult(params.state, params.job, {
		status: "skipped",
		error: errorText,
		diagnostics,
		startedAt: endedAt,
		endedAt
	}, { scheduleMode: params.mode === "force" ? "preserve" : "advance" });
	emitCronRunFinished(params.state, {
		jobId: params.job.id,
		action: "finished",
		job: params.job,
		status: "skipped",
		error: errorText,
		diagnostics,
		runId: params.runId,
		runAtMs: endedAt,
		durationMs: params.job.state.lastDurationMs,
		nextRunAtMs: params.job.state.nextRunAtMs,
		deliveryStatus: params.job.state.lastDeliveryStatus,
		deliveryError: params.job.state.lastDeliveryError,
		failureNotificationDelivery: failureNotificationDeliveryFromJobState(params.job)
	}, params.terminalTracker);
	recomputeNextRunsForMaintenance(params.state, {
		recomputeExpired: true,
		...params.mode === "force" ? { preserveExpiredPacedNextRunJobId: params.job.id } : {}
	});
	await persistOrRestore(params.state, rollbackSnapshot);
	armTimer(params.state);
}
async function inspectManualRunPreflight(state, id, mode, runId, terminalTracker) {
	return await locked(state, async () => {
		warnIfDisabled(state, "run");
		await ensureLoaded(state, { skipRecompute: true });
		if (state.stopped) return {
			ok: true,
			ran: false,
			reason: "stopped"
		};
		if (state.restartRecoveryPending) return {
			ok: true,
			ran: false,
			reason: "restart-recovery-pending"
		};
		recomputeNextRunsForMaintenance(state, mode === "force" ? { preserveExpiredPacedNextRunJobId: id } : void 0);
		const job = findJobOrThrow(state, id);
		try {
			assertSupportedJobSpec(job);
		} catch (error) {
			await skipInvalidPersistedManualRun({
				state,
				job,
				mode,
				runId,
				terminalTracker,
				error
			});
			return {
				ok: true,
				ran: false,
				reason: "invalid-spec"
			};
		}
		if (hasActiveCronRun(job)) return {
			ok: true,
			ran: false,
			reason: "already-running"
		};
		const now = state.deps.nowMs();
		if (!isJobDue(job, now, { forced: mode === "force" })) return {
			ok: true,
			ran: false,
			reason: "not-due"
		};
		return {
			ok: true,
			runnable: true,
			job,
			now
		};
	});
}
async function inspectManualRunDisposition(state, id, mode) {
	const result = await inspectManualRunPreflight(state, id, mode);
	if (!result.ok) return result;
	if ("reason" in result) return result;
	return {
		ok: true,
		runnable: true
	};
}
async function prepareManualRun(state, id, mode, opts) {
	const preflight = await inspectManualRunPreflight(state, id, mode, opts?.runId, opts?.terminalTracker);
	if (!preflight.ok) return preflight;
	if ("reason" in preflight) return {
		ok: true,
		ran: false,
		reason: preflight.reason
	};
	return await locked(state, async () => {
		if (state.stopped) return {
			ok: true,
			ran: false,
			reason: "stopped"
		};
		if (state.restartRecoveryPending) return {
			ok: true,
			ran: false,
			reason: "restart-recovery-pending"
		};
		await ensureLoaded(state, { skipRecompute: true });
		recomputeNextRunsForMaintenance(state, mode === "force" ? { preserveExpiredPacedNextRunJobId: id } : void 0);
		const job = findJobOrThrow(state, id);
		try {
			assertSupportedJobSpec(job);
		} catch (error) {
			await skipInvalidPersistedManualRun({
				state,
				job,
				mode,
				runId: opts?.runId,
				terminalTracker: opts?.terminalTracker,
				error
			});
			return {
				ok: true,
				ran: false,
				reason: "invalid-spec"
			};
		}
		if (hasActiveCronRun(job)) return {
			ok: true,
			ran: false,
			reason: "already-running"
		};
		const reservationAt = state.deps.nowMs();
		if (!isJobDue(job, reservationAt, { forced: mode === "force" })) return {
			ok: true,
			ran: false,
			reason: "not-due"
		};
		const reservationRollbackSnapshot = snapshotStoreForRollback(state);
		job.state.queuedAtMs = reservationAt;
		await persistOrRestore(state, reservationRollbackSnapshot);
		const reservationIdentity = reserveQueuedCronRun(state, job.id, reservationAt, { preserveWhenDisabled: mode === "force" && !isJobEnabled(job) });
		if (state.stopped) {
			const cleanup = async () => {
				await ensureLoaded(state, {
					forceReload: true,
					skipRecompute: true
				});
				const persistedJob = state.store?.jobs.find((entry) => entry.id === id);
				if (typeof persistedJob?.state.queuedAtMs !== "number" || !isQueuedCronRunReservationMarkerCurrent(state, job.id, reservationIdentity, persistedJob.state.queuedAtMs)) {
					releaseQueuedCronRun(state, job.id, reservationIdentity);
					return;
				}
				const rollbackSnapshot = snapshotStoreForRollback(state);
				delete persistedJob.state.queuedAtMs;
				await persistOrRestore(state, rollbackSnapshot);
				releaseQueuedCronRun(state, job.id, reservationIdentity);
			};
			try {
				await cleanup();
			} catch {
				try {
					await cleanup();
				} catch (error) {
					releaseQueuedCronRun(state, job.id, reservationIdentity);
					throw error;
				}
			}
			return {
				ok: true,
				ran: false,
				reason: "stopped"
			};
		}
		return {
			ok: true,
			ran: true,
			jobId: job.id,
			runId: opts?.runId,
			terminalTracker: opts?.terminalTracker,
			owningCronLaneTaskMarker: opts?.owningCronLaneTaskMarker,
			reservationAt,
			reservationIdentity,
			wasEnabled: isJobEnabled(job),
			...opts?.payload ? { payload: structuredClone(opts.payload) } : {}
		};
	});
}
async function activatePreparedManualRun(state, prepared, mode) {
	return await locked(state, async () => {
		await ensureLoaded(state, {
			forceReload: true,
			skipRecompute: true
		});
		if (state.stopped) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "stopped"
			};
		}
		if (state.restartRecoveryPending) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "restart-recovery-pending"
			};
		}
		const job = state.store?.jobs.find((entry) => entry.id === prepared.jobId);
		if (!job || !isQueuedCronRunReservationCurrent(state, prepared.jobId, prepared.reservationIdentity) || job.state.queuedAtMs !== prepared.reservationAt) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "not-due"
			};
		}
		const dueProbe = structuredClone(job);
		delete dueProbe.state.queuedAtMs;
		if (prepared.wasEnabled && !isJobEnabled(job) || !isJobDue(dueProbe, state.deps.nowMs(), { forced: mode === "force" })) {
			await releasePreparedManualReservationWithRetry(state, prepared);
			return {
				ok: true,
				ran: false,
				reason: "not-due"
			};
		}
		try {
			assertSupportedJobSpec(job);
		} catch (error) {
			await skipInvalidPersistedManualRun({
				state,
				job,
				mode,
				runId: prepared.runId,
				terminalTracker: prepared.terminalTracker,
				error
			});
			releaseQueuedCronRun(state, prepared.jobId, prepared.reservationIdentity);
			return {
				ok: true,
				ran: false,
				reason: "invalid-spec"
			};
		}
		const startedAt = state.deps.nowMs();
		const previousLastError = job.state.lastError;
		const activationRollbackSnapshot = snapshotStoreForRollback(state);
		delete job.state.queuedAtMs;
		job.state.runningAtMs = startedAt;
		job.state.lastError = void 0;
		await persistOrRestore(state, activationRollbackSnapshot);
		updateQueuedCronRunReservationMarker(state, prepared.jobId, prepared.reservationIdentity, startedAt, previousLastError);
		if (state.stopped || state.restartRecoveryPending) {
			job.state.lastError = previousLastError;
			const rollbackSnapshot = snapshotStoreForRollback(state);
			delete job.state.runningAtMs;
			try {
				await persistOrRestore(state, rollbackSnapshot);
			} catch (error) {
				await releasePreparedManualReservationWithRetry(state, prepared);
				throw error;
			}
			releaseQueuedCronRun(state, prepared.jobId, prepared.reservationIdentity);
			return {
				ok: true,
				ran: false,
				reason: state.stopped ? "stopped" : "restart-recovery-pending"
			};
		}
		emit(state, {
			jobId: job.id,
			action: "started",
			job,
			runAtMs: startedAt
		});
		const taskRunId = tryCreateCronTaskRun({
			state,
			job,
			startedAt,
			publicRunId: prepared.runId
		});
		const activeJobMarker = markManualCronJobActive(state, job);
		const executionJob = structuredClone(job);
		if (mode === "force" && executionJob.trigger) delete executionJob.trigger;
		if (prepared.payload) executionJob.payload = structuredClone(prepared.payload);
		return {
			...prepared,
			startedAt,
			runId: prepared.runId ?? taskRunId,
			taskRunId,
			activeJobMarker,
			executionJob
		};
	});
}
async function releasePreparedManualReservation(state, prepared) {
	if (!isQueuedCronRunReservationCurrent(state, prepared.jobId, prepared.reservationIdentity)) return;
	const job = state.store?.jobs.find((entry) => entry.id === prepared.jobId);
	const rollbackSnapshot = snapshotStoreForRollback(state);
	if (!job || !clearQueuedCronRunReservationMarker(state, prepared.jobId, prepared.reservationIdentity, job.state)) {
		releaseQueuedCronRun(state, prepared.jobId, prepared.reservationIdentity);
		return;
	}
	await persistOrRestore(state, rollbackSnapshot);
	releaseQueuedCronRun(state, prepared.jobId, prepared.reservationIdentity);
}
async function releasePreparedManualReservationWithRetry(state, prepared) {
	try {
		await releasePreparedManualReservation(state, prepared);
	} catch {
		try {
			await releasePreparedManualReservation(state, prepared);
		} catch (error) {
			releaseQueuedCronRun(state, prepared.jobId, prepared.reservationIdentity);
			throw error;
		}
	}
}
async function releasePreparedManualReservationAfterReloadWithRetry(state, prepared) {
	const attempt = async () => {
		await locked(state, async () => {
			await ensureLoaded(state, {
				forceReload: true,
				skipRecompute: true
			});
			await releasePreparedManualReservation(state, prepared);
		});
	};
	try {
		await attempt();
	} catch {
		try {
			await attempt();
		} catch (error) {
			releaseQueuedCronRun(state, prepared.jobId, prepared.reservationIdentity);
			throw error;
		}
	}
}
async function finishPreparedManualRun(state, prepared, mode) {
	const executionJob = prepared.executionJob;
	const startedAt = prepared.startedAt;
	const jobId = prepared.jobId;
	const taskRunId = prepared.taskRunId;
	const runId = prepared.runId;
	try {
		let coreResult;
		try {
			coreResult = await executeJobCoreWithTimeout(state, executionJob, {
				runId: taskRunId,
				activeJobMarker: prepared.activeJobMarker,
				owningCronLaneTaskMarker: prepared.owningCronLaneTaskMarker
			});
		} catch (err) {
			coreResult = {
				status: "error",
				error: normalizeCronRunErrorText(err)
			};
		}
		const endedAt = state.deps.nowMs();
		const triggerSkipped = coreResult.status === "ok" && coreResult.triggerEval?.fired === false;
		const emitMissingQueuedTerminal = () => {
			const tracker = prepared.terminalTracker;
			if (!tracker || tracker.emitted) return;
			const job = state.store?.jobs.find((entry) => entry.id === jobId);
			emitCronRunFinished(state, {
				jobId,
				action: "finished",
				job,
				status: triggerSkipped ? "skipped" : coreResult.status,
				error: triggerSkipped ? "queued manual run skipped: trigger condition not met" : coreResult.error,
				deliveryError: coreResult.deliveryError,
				summary: triggerSkipped ? void 0 : coreResult.summary,
				diagnostics: coreResult.diagnostics,
				delivered: coreResult.delivered,
				delivery: coreResult.delivery,
				sessionId: coreResult.sessionId,
				sessionKey: coreResult.sessionKey,
				runId,
				runAtMs: startedAt,
				durationMs: Math.max(0, endedAt - startedAt),
				nextRunAtMs: job?.state.nextRunAtMs,
				model: coreResult.model,
				provider: coreResult.provider,
				usage: coreResult.usage
			}, tracker, taskRunId);
		};
		if (!triggerSkipped) tryFinishCronTaskRunWithoutHistory(state, {
			taskRunId,
			status: coreResult.status,
			error: coreResult.error,
			endedAt,
			summary: coreResult.summary,
			childSessionKey: coreResult.sessionKey
		});
		if (!isCronActiveJobMarkerCurrent(prepared.activeJobMarker)) {
			emitMissingQueuedTerminal();
			return;
		}
		let finalized = false;
		let notifySetupTimeout = coreResult.isolatedAgentSetupTimeout !== void 0;
		await locked(state, async () => {
			await ensureLoaded(state, { skipRecompute: true });
			if (!isCronActiveJobMarkerCurrent(prepared.activeJobMarker)) {
				notifySetupTimeout = false;
				return;
			}
			const job = state.store?.jobs.find((entry) => entry.id === jobId);
			if (!job) return;
			let shouldDelete = false;
			if (coreResult.status === "ok" && coreResult.triggerEval?.fired === false) applyTriggerNoFireResult(state, job, {
				startedAt,
				endedAt,
				triggerEval: coreResult.triggerEval
			}, { scheduleMode: mode === "force" ? "preserve" : "advance" });
			else {
				shouldDelete = applyJobResult(state, job, {
					...coreResult,
					startedAt,
					endedAt
				}, { scheduleMode: mode === "force" ? "preserve" : "advance" });
				applyTriggerRunResult(job, {
					status: coreResult.status,
					endedAt,
					triggerEval: coreResult.triggerEval
				});
				applyScriptRunResult(job, coreResult);
				emitCronRunFinished(state, {
					jobId: job.id,
					action: "finished",
					job,
					status: coreResult.status,
					error: coreResult.error,
					summary: coreResult.summary,
					diagnostics: coreResult.diagnostics,
					delivered: job.state.lastDelivered,
					deliveryStatus: job.state.lastDeliveryStatus,
					deliveryError: job.state.lastDeliveryError,
					failureNotificationDelivery: failureNotificationDeliveryFromJobState(job),
					delivery: coreResult.delivery,
					sessionId: coreResult.sessionId,
					sessionKey: coreResult.sessionKey,
					runId,
					runAtMs: startedAt,
					durationMs: job.state.lastDurationMs,
					nextRunAtMs: job.state.nextRunAtMs,
					...coreResult.triggerEval?.fired ? { triggerFired: true } : {},
					model: coreResult.model,
					provider: coreResult.provider,
					usage: coreResult.usage
				}, prepared.terminalTracker, taskRunId, coreResult.triggerEval, coreResult);
			}
			const postRunSnapshot = shouldDelete ? null : {
				enabled: job.enabled,
				updatedAtMs: job.updatedAtMs,
				state: structuredClone(job.state)
			};
			const postRunRemoved = shouldDelete;
			const removedJob = shouldDelete ? structuredClone(job) : void 0;
			await ensureLoaded(state, {
				forceReload: true,
				skipRecompute: true
			});
			if (!isCronActiveJobMarkerCurrent(prepared.activeJobMarker)) {
				notifySetupTimeout = false;
				return;
			}
			const rollbackSnapshot = snapshotStoreForRollback(state);
			mergeManualRunSnapshotAfterReload({
				state,
				jobId,
				snapshot: postRunSnapshot,
				removed: postRunRemoved
			});
			recomputeNextRunsForMaintenance(state, {
				recomputeExpired: true,
				...mode === "force" ? { preserveExpiredPacedNextRunJobId: jobId } : {}
			});
			await persistOrRestore(state, rollbackSnapshot);
			if (removedJob) emit(state, {
				jobId: removedJob.id,
				action: "removed",
				job: removedJob
			});
			finalized = true;
		});
		if (notifySetupTimeout && isCronActiveJobMarkerCurrent(prepared.activeJobMarker)) maybeNotifyManualIsolatedSetupTimeout(state, {
			jobId,
			job: executionJob,
			isolatedAgentSetupTimeout: coreResult.isolatedAgentSetupTimeout
		});
		if (finalized) {
			if (triggerSkipped) tryFinishCronTaskRunWithoutHistory(state, {
				taskRunId,
				status: coreResult.status,
				error: coreResult.error,
				endedAt,
				summary: coreResult.summary,
				childSessionKey: coreResult.sessionKey
			});
			armTimer(state);
		}
		emitMissingQueuedTerminal();
	} finally {
		releaseQueuedCronRun(state, prepared.jobId, prepared.reservationIdentity);
		clearManualCronJobActive(state, jobId, prepared.activeJobMarker);
	}
}
/** Runs a cron job manually, reserving it under lock before executing outside the lock. */
async function run(state, id, mode, opts) {
	const prepared = await prepareManualRun(state, id, mode, opts);
	if (!prepared.ok || !prepared.ran) return prepared;
	const admission = await runWithCronAdmission(state, async () => {
		let activeRun;
		try {
			activeRun = await activatePreparedManualRun(state, prepared, mode);
		} catch (error) {
			try {
				await locked(state, async () => {
					await releasePreparedManualReservationWithRetry(state, prepared);
				});
			} catch (cleanupError) {
				state.deps.log.warn({
					jobId: prepared.jobId,
					err: String(cleanupError)
				}, "cron: failed to release manual run reservation after activation error");
			}
			throw error;
		}
		if (!activeRun.ran) return activeRun;
		await finishPreparedManualRun(state, activeRun, mode);
		return {
			ok: true,
			ran: true
		};
	});
	if (admission.kind === "stopped") {
		await releasePreparedManualReservationAfterReloadWithRetry(state, prepared);
		return {
			ok: true,
			ran: false,
			reason: "stopped"
		};
	}
	return admission.value;
}
/** Queues a manual cron run behind the cron command lane and returns an immediate run id. */
async function enqueueRun(state, id, mode) {
	const disposition = await inspectManualRunDisposition(state, id, mode);
	if (!disposition.ok || !("runnable" in disposition && disposition.runnable)) return disposition;
	const runId = `manual:${id}:${state.deps.nowMs()}:${nextManualRunId++}`;
	const terminalTracker = { emitted: false };
	runWithGatewayIndependentRootWorkContinuation(() => enqueueCommandInLane("cron", async (owningCronLaneTaskMarker) => {
		const result = await run(state, id, mode, {
			runId,
			terminalTracker,
			owningCronLaneTaskMarker
		});
		if (result.ok && "ran" in result && !result.ran) {
			if (result.reason !== "invalid-spec") {
				const finishedAt = state.deps.nowMs();
				const job = state.store?.jobs.find((entry) => entry.id === id);
				emitCronRunFinished(state, {
					jobId: id,
					action: "finished",
					job,
					status: "skipped",
					error: `queued manual run skipped before execution: ${result.reason}`,
					runId,
					runAtMs: finishedAt,
					durationMs: 0,
					nextRunAtMs: job?.state.nextRunAtMs
				}, terminalTracker);
			}
			state.deps.log.info({
				jobId: id,
				runId,
				reason: result.reason
			}, "cron: queued manual run skipped before execution");
		}
		return result;
	}, {
		warnAfterMs: 5e3,
		onWait: (waitMs, queuedAhead) => {
			state.deps.log.warn({
				jobId: id,
				runId,
				waitMs,
				queuedAhead
			}, "cron: queued manual run waiting for an execution slot");
		}
	})).catch((err) => {
		if (terminalTracker.emitted) {
			state.deps.log.error({
				jobId: id,
				runId,
				err: String(err)
			}, "cron: queued manual run failed after emitting its terminal event");
			return;
		}
		const finishedAt = state.deps.nowMs();
		const job = state.store?.jobs.find((entry) => entry.id === id);
		emitCronRunFinished(state, {
			jobId: id,
			action: "finished",
			job,
			status: "error",
			error: normalizeCronRunErrorText(err),
			runId,
			runAtMs: finishedAt,
			durationMs: 0,
			nextRunAtMs: job?.state.nextRunAtMs
		}, terminalTracker);
		state.deps.log.error({
			jobId: id,
			runId,
			err: String(err)
		}, "cron: queued manual run background execution failed");
	});
	return {
		ok: true,
		enqueued: true,
		runId
	};
}
/** Enqueues manual wake text through the cron wake API. */
function wakeNow(state, opts) {
	return wake(state, opts);
}
//#endregion
//#region src/cron/service.ts
/** Public cron service facade that owns mutable scheduler state and delegates to locked ops. */
var CronService = class {
	constructor(deps) {
		this.startInProgress = 0;
		this.startState = null;
		this.lifecycleGeneration = 0;
		this.state = createCronServiceState(deps);
	}
	async start() {
		const generation = this.lifecycleGeneration;
		const pending = this.startState;
		if (pending) {
			try {
				await pending.promise;
			} catch (err) {
				if (pending.generation === generation) throw err;
			}
			if (pending.generation === generation) return;
			await this.start();
			return;
		}
		const promise = this.startOnce(generation);
		this.startState = {
			generation,
			promise
		};
		try {
			await promise;
		} finally {
			if (this.startState?.promise === promise) this.startState = null;
		}
	}
	async startOnce(generation) {
		this.startInProgress += 1;
		this.state.schedulerStarted = false;
		try {
			await start(this.state);
			if (generation !== this.lifecycleGeneration) {
				stop(this.state);
				return;
			}
			this.state.schedulerStarted = !this.state.stopped;
		} finally {
			this.startInProgress -= 1;
		}
	}
	stop() {
		this.lifecycleGeneration += 1;
		stop(this.state);
	}
	pauseScheduling() {
		pauseScheduling(this.state);
	}
	resumeScheduling() {
		resumeScheduling(this.state);
	}
	getSuspensionBlockerCount() {
		return this.startInProgress;
	}
	async status() {
		return await status(this.state);
	}
	async list(opts) {
		return await list(this.state, opts);
	}
	async listPage(opts) {
		return await listPage(this.state, opts);
	}
	async add(input, opts) {
		return await add(this.state, input, opts);
	}
	async update(id, patch) {
		return await update(this.state, id, patch);
	}
	async updateWithPrecondition(id, patch, precondition) {
		return await updateWithPrecondition(this.state, id, patch, precondition);
	}
	async remove(id) {
		return await remove(this.state, id);
	}
	async removeAgentJobsTransactional(agentId, commit) {
		return await removeAgentJobsTransactional(this.state, agentId, commit);
	}
	async run(id, mode, opts) {
		return await run(this.state, id, mode, opts);
	}
	async enqueueRun(id, mode) {
		const result = await enqueueRun(this.state, id, mode);
		if (result.ok && "runnable" in result) throw new Error("cron enqueueRun returned unresolved runnable disposition");
		return result;
	}
	getJob(id) {
		return this.state.store?.jobs.find((job) => job.id === id);
	}
	/** In-memory job snapshot; undefined until the store is loaded. */
	getLoadedJobs() {
		return this.state.store?.jobs;
	}
	async readJob(id) {
		return await readJob(this.state, id);
	}
	getDefaultAgentId() {
		return this.state.deps.defaultAgentId;
	}
	wake(opts) {
		return wakeNow(this.state, opts);
	}
};
//#endregion
export { CronService as t };
