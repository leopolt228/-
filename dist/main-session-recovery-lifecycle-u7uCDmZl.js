import { g as mergeRestartRecoveryTerminalRunIds } from "./store-DDuGv_UJ.js";
import { n as buildMainSessionRecoveryClearPatch } from "./main-session-recovery-clear-BngYLTap.js";
//#region src/agents/main-session-recovery-lifecycle.ts
const MAIN_RESTART_RECOVERY_WEDGED_FALLBACK_REASON = "main-session restart recovery is tombstoned for this session";
function inspectMainSessionRecoveryHealth(entry) {
	const state = entry.mainRestartRecovery;
	if (!state) return { status: "none" };
	if (!state.tombstone) return { status: "active" };
	return {
		status: "tombstoned",
		reason: state.tombstone.reason.trim() || MAIN_RESTART_RECOVERY_WEDGED_FALLBACK_REASON,
		repair: entry.abortedLastRun === true ? "clear_stale_abort" : null
	};
}
function lifecyclePhase(event) {
	const phase = event.data?.phase;
	return phase === "start" || phase === "end" || phase === "error" ? phase : null;
}
function isMainSessionRecoveryLifecycleEvent(params) {
	const runId = params.event.runId?.trim();
	const lifecycleGeneration = params.event.lifecycleGeneration?.trim();
	const phase = lifecyclePhase(params.event);
	const interrupted = params.event.data?.stopReason === "restart";
	return Boolean(runId && lifecycleGeneration && params.entry?.restartRecoveryRuns?.some((run) => run.runId === runId && run.lifecycleGeneration === lifecycleGeneration)) && (phase === "start" || (phase === "end" || phase === "error") && interrupted);
}
function projectMainSessionRecoveryLifecycle(params) {
	if (params.entry?.mainRestartRecovery?.tombstone) return isMainSessionRecoveryLifecycleEvent(params) ? { action: "suppress" } : {
		action: "apply",
		patch: {
			...params.snapshotPatch,
			abortedLastRun: params.entry.abortedLastRun,
			restartRecoveryRuns: params.entry.restartRecoveryRuns,
			mainRestartRecovery: params.entry.mainRestartRecovery
		}
	};
	if (isMainSessionRecoveryLifecycleEvent(params)) return { action: "suppress" };
	const phase = lifecyclePhase(params.event);
	const settlesRecovery = (phase === "end" || phase === "error") && params.event.data?.stopReason !== "restart";
	const patch = { ...params.snapshotPatch };
	const runId = params.event.runId?.trim();
	const lifecycleGeneration = params.event.lifecycleGeneration?.trim();
	const runs = params.entry?.restartRecoveryRuns;
	const matchesFence = Boolean(runId && lifecycleGeneration && runs?.some((run) => run.runId === runId && run.lifecycleGeneration === lifecycleGeneration));
	const remaining = matchesFence ? runs?.filter((run) => run.runId !== runId || run.lifecycleGeneration !== lifecycleGeneration) : runs;
	if (settlesRecovery) {
		const foregroundClaims = params.entry?.mainRestartRecovery?.foregroundClaims;
		const foregroundOwnerClaimId = runId && lifecycleGeneration && lifecycleGeneration === params.currentLifecycleGeneration && foregroundClaims?.lifecycleGeneration === lifecycleGeneration ? foregroundClaims.tokens.find((claimId) => foregroundClaims.runIdsByClaimId?.[claimId] === runId) : void 0;
		const remainingForegroundClaimIds = foregroundOwnerClaimId ? foregroundClaims.tokens.filter((claimId) => claimId !== foregroundOwnerClaimId) : foregroundClaims?.tokens;
		const remainingForegroundRunIds = foregroundOwnerClaimId ? Object.fromEntries(Object.entries(foregroundClaims?.runIdsByClaimId ?? {}).filter(([claimId]) => claimId !== foregroundOwnerClaimId)) : foregroundClaims?.runIdsByClaimId;
		const remainingForegroundClaims = remainingForegroundClaimIds?.length ? {
			lifecycleGeneration: foregroundClaims.lifecycleGeneration,
			tokens: remainingForegroundClaimIds,
			...remainingForegroundRunIds && Object.keys(remainingForegroundRunIds).length > 0 ? { runIdsByClaimId: remainingForegroundRunIds } : {}
		} : void 0;
		const recoveryStateAfterForegroundSettlement = foregroundOwnerClaimId ? {
			...params.entry.mainRestartRecovery,
			revision: params.entry.mainRestartRecovery.revision + 1,
			foregroundClaims: remainingForegroundClaims
		} : params.entry?.mainRestartRecovery;
		const hasForegroundOwners = Boolean(remainingForegroundClaims?.lifecycleGeneration === params.currentLifecycleGeneration && remainingForegroundClaims.tokens.length);
		const hasCurrentReservation = (params.entry?.mainRestartRecovery?.reservation)?.lifecycleGeneration === params.currentLifecycleGeneration;
		const hasCurrentOwner = hasForegroundOwners || hasCurrentReservation;
		if (!matchesFence) return params.entry?.mainRestartRecovery || runs?.length ? { action: "suppress" } : {
			action: "apply",
			patch
		};
		if (hasCurrentOwner) return {
			action: "apply",
			patch: {
				restartRecoveryRuns: remaining?.length ? remaining : void 0,
				restartRecoveryTerminalRunIds: mergeRestartRecoveryTerminalRunIds(params.entry?.restartRecoveryTerminalRunIds, [runId]),
				...foregroundOwnerClaimId ? { mainRestartRecovery: recoveryStateAfterForegroundSettlement } : {}
			}
		};
		if (foregroundOwnerClaimId) {
			Object.assign(patch, buildMainSessionRecoveryClearPatch(params.entry));
			return {
				action: "apply",
				patch
			};
		}
		if (!hasForegroundOwners && !hasCurrentReservation && params.entry?.abortedLastRun === true && (remaining?.length ?? 0) > 0) return {
			action: "apply",
			patch: { restartRecoveryRuns: remaining }
		};
		const recoveryDeliveryRunId = typeof params.entry?.restartRecoveryDeliveryRunId === "string" ? params.entry.restartRecoveryDeliveryRunId.trim() : void 0;
		if ((remaining?.length ?? 0) > 0 && recoveryDeliveryRunId !== runId) {
			patch.abortedLastRun = false;
			patch.restartRecoveryRuns = remaining;
			patch.mainRestartRecovery = params.entry?.mainRestartRecovery;
			return {
				action: "apply",
				patch
			};
		}
		Object.assign(patch, buildMainSessionRecoveryClearPatch(params.entry));
		return {
			action: "apply",
			patch
		};
	}
	if (phase === "start" || !matchesFence || !remaining) return {
		action: "apply",
		patch
	};
	if (params.entry?.abortedLastRun === true && remaining.length > 0) return {
		action: "apply",
		patch: { restartRecoveryRuns: remaining }
	};
	patch.restartRecoveryRuns = remaining.length > 0 ? remaining : void 0;
	return {
		action: "apply",
		patch
	};
}
//#endregion
export { isMainSessionRecoveryLifecycleEvent as n, projectMainSessionRecoveryLifecycle as r, inspectMainSessionRecoveryHealth as t };
