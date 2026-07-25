import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { D as parseCronRunScopeSuffix } from "./session-key-Drrs61Fd.js";
import { p as getAgentEventLifecycleGeneration } from "./agent-events-Dg0sI2pr.js";
import { et as updateSessionEntry } from "./session-accessor-Mu3lv_Tl.js";
import { d as sanitizeUserFacingText } from "./sanitize-user-facing-text-sWgeyF-a.js";
import { n as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-C9geO1r1.js";
import { u as loadSessionEntry } from "./session-utils-CEU0rCPC.js";
import { n as isMainSessionRecoveryLifecycleEvent, r as projectMainSessionRecoveryLifecycle } from "./main-session-recovery-lifecycle-u7uCDmZl.js";
//#region src/agents/agent-lifecycle-parent-state.ts
function isAgentLifecycleYieldedWaiting(event) {
	return event.phase === "end" && event.yielded === true && event.livenessState === "paused" && event.stopReason === "end_turn" && event.aborted !== true && event.status !== "cancelled" && event.status !== "timed_out" && event.timeoutPhase == null && event.error == null;
}
//#endregion
//#region src/gateway/session-lifecycle-state.ts
const SESSION_RUN_ERROR_MAX_CHARS = 160;
function isFiniteTimestamp(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function resolveLifecyclePhase(event) {
	const phase = typeof event.data?.phase === "string" ? event.data.phase : "";
	return phase === "start" || phase === "end" || phase === "error" ? phase : null;
}
function mapAgentRunTerminalOutcomeToSessionStatus(outcome) {
	switch (outcome.reason) {
		case "completed": return "done";
		case "hard_timeout":
		case "timed_out": return "timeout";
		case "cancelled":
		case "aborted": return "killed";
		case "blocked":
		case "abandoned":
		case "failed": return "failed";
		default: return outcome.reason;
	}
}
function resolveTerminalOutcome(event) {
	return buildAgentRunTerminalOutcome({
		status: resolveLifecyclePhase(event) === "error" ? "error" : event.data?.aborted === true ? "timeout" : "ok",
		error: event.data?.error,
		stopReason: event.data?.stopReason,
		livenessState: event.data?.livenessState,
		timeoutPhase: event.data?.timeoutPhase,
		providerStarted: event.data?.providerStarted,
		startedAt: event.data?.startedAt,
		endedAt: event.data?.endedAt ?? event.ts
	});
}
function resolveSessionRunError(outcome, status) {
	if (status !== "failed" && status !== "timeout" || !outcome.error) return;
	const sanitized = sanitizeUserFacingText(outcome.error, { errorContext: true }).replace(/\s+/g, " ").trim();
	return sanitized ? truncateUtf16Safe(sanitized, SESSION_RUN_ERROR_MAX_CHARS) : void 0;
}
function resolveLifecycleStartedAt(existingStartedAt, event) {
	if (isFiniteTimestamp(event.data?.startedAt)) return event.data.startedAt;
	if (isFiniteTimestamp(existingStartedAt)) return existingStartedAt;
	return isFiniteTimestamp(event.ts) ? event.ts : void 0;
}
function resolveLifecycleEndedAt(event) {
	if (isFiniteTimestamp(event.data?.endedAt)) return event.data.endedAt;
	return isFiniteTimestamp(event.ts) ? event.ts : void 0;
}
function resolveRuntimeMs(params) {
	const { startedAt, endedAt, existingRuntimeMs } = params;
	if (isFiniteTimestamp(startedAt) && isFiniteTimestamp(endedAt)) return Math.max(0, endedAt - startedAt);
	if (typeof existingRuntimeMs === "number" && Number.isFinite(existingRuntimeMs) && existingRuntimeMs >= 0) return existingRuntimeMs;
}
function deriveGatewaySessionLifecycleSnapshot(params) {
	const phase = resolveLifecyclePhase(params.event);
	if (!phase) return {};
	const existing = params.session ?? void 0;
	if (phase === "start") {
		const startedAt = resolveLifecycleStartedAt(existing?.startedAt, params.event);
		return {
			updatedAt: startedAt ?? existing?.updatedAt,
			status: "running",
			lastRunError: void 0,
			startedAt,
			endedAt: void 0,
			runtimeMs: void 0,
			abortedLastRun: false
		};
	}
	const startedAt = resolveLifecycleStartedAt(existing?.startedAt, params.event);
	const endedAt = resolveLifecycleEndedAt(params.event);
	const updatedAt = endedAt ?? existing?.updatedAt;
	const terminal = isAgentLifecycleYieldedWaiting({
		phase,
		yielded: params.event.data?.yielded,
		livenessState: params.event.data?.livenessState,
		stopReason: params.event.data?.stopReason,
		aborted: params.event.data?.aborted,
		status: params.event.data?.status,
		timeoutPhase: params.event.data?.timeoutPhase,
		error: params.event.data?.error
	}) ? void 0 : resolveTerminalOutcome(params.event);
	const status = terminal ? mapAgentRunTerminalOutcomeToSessionStatus(terminal) : "running";
	return {
		updatedAt,
		status,
		lastRunError: terminal ? resolveSessionRunError(terminal, status) : void 0,
		startedAt,
		endedAt,
		runtimeMs: resolveRuntimeMs({
			startedAt,
			endedAt,
			existingRuntimeMs: existing?.runtimeMs
		}),
		abortedLastRun: status === "killed"
	};
}
function derivePersistedSessionLifecyclePatch(params) {
	const snapshot = deriveGatewaySessionLifecycleSnapshot({
		session: params.entry ?? void 0,
		event: params.event
	});
	const snapshotPatch = {
		...snapshot,
		updatedAt: typeof snapshot.updatedAt === "number" ? snapshot.updatedAt : void 0
	};
	const projection = projectMainSessionRecoveryLifecycle({
		currentLifecycleGeneration: getAgentEventLifecycleGeneration(),
		entry: params.entry,
		event: params.event,
		snapshotPatch
	});
	return projection.action === "suppress" ? {} : projection.patch;
}
function deriveGatewaySessionLifecycleProjectionPatch(params) {
	const { restartRecoveryRuns: _restartRecoveryRuns, ...patch } = derivePersistedSessionLifecyclePatch(params);
	return patch;
}
function isRestartRecoveryLifecycleEvent(params) {
	return isMainSessionRecoveryLifecycleEvent(params);
}
/**
* A pre-`sessions.reset` run's lifecycle event must not mutate a session row
* whose sessionId was rotated by the reset. True only when both the owning
* run's sessionId and the current row's sessionId are known and differ.
*/
function isStaleLifecycleEventForSession(params) {
	return Boolean(params.owningSessionId && params.currentSessionId && params.owningSessionId !== params.currentSessionId);
}
function acceptsCronRunContinuationLifecycleEvent(params) {
	const marker = params.entry.cronRunContinuation;
	if (marker?.phase === "running") return true;
	const runId = params.event.runId?.trim();
	return Boolean(marker?.phase === "continuing" && runId && marker.ownerRunId === runId);
}
async function persistGatewaySessionLifecycleEvent(params) {
	if (!resolveLifecyclePhase(params.event)) return;
	const sessionEntry = loadSessionEntry(params.sessionKey, {
		...params.agentId ? { agentId: params.agentId } : {},
		clone: false
	});
	if (!sessionEntry.entry) return;
	const owningSessionId = typeof params.event.sessionId === "string" && params.event.sessionId ? params.event.sessionId : void 0;
	const exactCronRun = parseCronRunScopeSuffix(sessionEntry.canonicalKey).runId !== void 0;
	await updateSessionEntry({
		storePath: sessionEntry.storePath,
		sessionKey: sessionEntry.canonicalKey
	}, async (entry) => {
		if (exactCronRun && !acceptsCronRunContinuationLifecycleEvent({
			entry,
			event: params.event
		})) return null;
		if (isStaleLifecycleEventForSession({
			owningSessionId,
			currentSessionId: entry.sessionId
		})) return null;
		const patch = derivePersistedSessionLifecyclePatch({
			entry,
			event: params.event
		});
		return Object.keys(patch).length > 0 ? patch : null;
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true,
		requireWriteSuccess: true
	});
}
//#endregion
export { isAgentLifecycleYieldedWaiting as a, persistGatewaySessionLifecycleEvent as i, isRestartRecoveryLifecycleEvent as n, isStaleLifecycleEventForSession as r, deriveGatewaySessionLifecycleProjectionPatch as t };
