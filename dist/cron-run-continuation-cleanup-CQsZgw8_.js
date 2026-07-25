import { D as parseCronRunScopeSuffix, d as resolveAgentIdFromSessionKey } from "./session-key-Drrs61Fd.js";
import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import "./config-BOMcY2yX.js";
import { p as getAgentEventLifecycleGeneration } from "./agent-events-Dg0sI2pr.js";
import { l as resolveStorePath } from "./paths-BpMRJ7TJ.js";
import { lt as deleteSessionEntryLifecycle, yt as loadSessionEntry } from "./session-accessor-Mu3lv_Tl.js";
import { o as hasPendingGeneratedMediaTaskForSessionKey } from "./task-status-access-CLMWwpdp.js";
import { f as loadPendingSessionDeliveries } from "./session-delivery-queue-C4JZF_kR.js";
//#region src/tasks/cron-run-continuation-cleanup.ts
/** Removes an idle exact-run continuation through the session lifecycle owner. */
function canRemoveCronRunContinuation(marker) {
	if (!marker || marker.basePersisted !== true) return false;
	if (marker.phase === "ready") return !marker.ownerRunId;
	if (marker.phase !== "continuing" || !marker.ownerRunId) return false;
	const ownerLifecycleGeneration = marker.ownerLifecycleGeneration?.trim();
	return Boolean(ownerLifecycleGeneration && ownerLifecycleGeneration !== getAgentEventLifecycleGeneration());
}
async function removeCronRunContinuationSessionIfIdle(sessionKey, settledDeliveryId) {
	if (!parseCronRunScopeSuffix(sessionKey).runId || hasPendingGeneratedMediaTaskForSessionKey(sessionKey)) return;
	if ((await loadPendingSessionDeliveries()).some((entry) => entry.sessionKey === sessionKey && entry.id !== settledDeliveryId && entry.settlementOutcome === void 0 && entry.acknowledgedAt === void 0)) return;
	const agentId = resolveAgentIdFromSessionKey(sessionKey);
	const storePath = resolveStorePath(getRuntimeConfig().session?.store, { agentId });
	const entry = loadSessionEntry({
		agentId,
		sessionKey,
		storePath,
		readConsistency: "latest",
		hydrateSkillPromptRefs: false
	});
	const marker = entry?.cronRunContinuation;
	if (!entry || !canRemoveCronRunContinuation(marker)) return;
	await deleteSessionEntryLifecycle({
		agentId,
		archiveTranscript: false,
		expectedEntry: entry,
		expectedLifecycleRevision: entry.lifecycleRevision,
		expectedSessionId: entry.sessionId,
		expectedUpdatedAt: entry.updatedAt,
		requireWriteSuccess: true,
		storePath,
		target: {
			canonicalKey: sessionKey,
			storeKeys: [sessionKey]
		}
	});
}
//#endregion
export { removeCronRunContinuationSessionIfIdle as t };
