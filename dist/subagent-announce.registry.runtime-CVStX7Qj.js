import { o as normalizeDeliveryContext } from "./delivery-context.shared-D6zu5SGz.js";
import { b as shouldIgnorePostCompletionAnnounceForSessionFromRuns, d as countPendingDescendantRunsExcludingRunFromRuns, f as countPendingDescendantRunsFromRuns, h as isSubagentSessionRunActiveFromRuns, j as subagentRuns, m as hasDescendantRunAwaitingSettleFromRuns, n as getSubagentRunsSnapshotForRead, v as listRunsForRequesterFromRuns, y as resolveRequesterForChildSessionFromRuns } from "./subagent-registry-state-D4-t_yGj.js";
import { i as getLatestSubagentRunByChildSessionKey, r as countActiveDescendantRuns } from "./subagent-registry-read-DeKC5r-U.js";
import { r as replaceSubagentRunAfterSteer } from "./subagent-registry-steer-runtime-DA3cUVgK.js";
//#region src/agents/subagent-registry-announce-read.ts
/**
* Read-side helpers for subagent completion announcements. These wrappers keep
* announce delivery code on normalized registry snapshots instead of reaching
* into persistence or mutation paths.
*/
/** Resolves the requester session and origin for a child subagent session. */
function resolveRequesterForChildSession(childSessionKey) {
	const resolved = resolveRequesterForChildSessionFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), childSessionKey);
	if (!resolved) return null;
	return {
		requesterSessionKey: resolved.requesterSessionKey,
		requesterOrigin: normalizeDeliveryContext(resolved.requesterOrigin)
	};
}
/** True when a subagent session still has an active run record. */
function isSubagentSessionRunActive(childSessionKey) {
	return isSubagentSessionRunActiveFromRuns(subagentRuns, childSessionKey);
}
/** True when post-completion announce should be skipped for a child session. */
function shouldIgnorePostCompletionAnnounceForSession(childSessionKey) {
	return shouldIgnorePostCompletionAnnounceForSessionFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), childSessionKey);
}
/** Lists subagent runs requested by one session key. */
function listSubagentRunsForRequester(requesterSessionKey, options) {
	return listRunsForRequesterFromRuns(subagentRuns, requesterSessionKey, options);
}
/** Counts pending descendant subagent runs below a root session. */
function countPendingDescendantRuns(rootSessionKey) {
	return countPendingDescendantRunsFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), rootSessionKey);
}
/** Counts pending descendant runs while excluding one run id. */
function countPendingDescendantRunsExcludingRun(rootSessionKey, excludeRunId) {
	return countPendingDescendantRunsExcludingRunFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), rootSessionKey, excludeRunId);
}
/** True when any descendant run still awaits terminal settle (suspended delivery counts as settled). */
function hasDescendantRunAwaitingSettle(rootSessionKey, excludeRunId) {
	return hasDescendantRunAwaitingSettleFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), rootSessionKey, excludeRunId);
}
//#endregion
export { countActiveDescendantRuns, countPendingDescendantRuns, countPendingDescendantRunsExcludingRun, getLatestSubagentRunByChildSessionKey, hasDescendantRunAwaitingSettle, isSubagentSessionRunActive, listSubagentRunsForRequester, replaceSubagentRunAfterSteer, resolveRequesterForChildSession, shouldIgnorePostCompletionAnnounceForSession };
