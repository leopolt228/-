import { t as retryAsync } from "./retry-Cn-q-rcX.js";
import { p as getAgentEventLifecycleGeneration } from "./agent-events-Dg0sI2pr.js";
import { rt as applySessionEntryReplacements } from "./session-accessor-Mu3lv_Tl.js";
import { r as transitionMainSessionRecovery, t as isMainRestartRecoveryCandidate } from "./main-session-recovery-state-CTVh5Ed7.js";
import { randomUUID } from "node:crypto";
//#region src/agents/main-session-recovery-store.ts
const OWNER_RELEASE_RETRY_DELAY_MS = 1e3;
const OWNER_RELEASE_RETRY_MAX_DELAY_MS = 3e4;
function transitionChanged(result) {
	return result.kind !== "foreground_validated" && result.kind !== "no_change" && result.kind !== "observed" && result.kind !== "rejected";
}
function matchesReservation(entry, reservation) {
	const state = entry.mainRestartRecovery;
	return entry.sessionId === reservation.sessionId && state?.cycleId === reservation.cycleId && state.reservation?.runId === reservation.runId && state.reservation.lifecycleGeneration === reservation.lifecycleGeneration;
}
function matchesRecoveryAdmission(entry, command) {
	const reservation = entry.mainRestartRecovery?.reservation;
	return entry.sessionId === command.sessionId && reservation?.runId === command.runId && reservation.lifecycleGeneration === command.lifecycleGeneration;
}
function matchesOwnerClaim(entry, claim) {
	const state = entry.mainRestartRecovery;
	return state?.cycleId === claim.cycleId && state.foregroundClaims?.lifecycleGeneration === claim.lifecycleGeneration && state.foregroundClaims.tokens.includes(claim.claimId);
}
function currentGenerationRequiredBy(command) {
	switch (command.kind) {
		case "admit_recovery":
		case "claim_foreground":
		case "inspect":
		case "mark_admitted_recovery_interrupted":
		case "observe":
		case "prepare_attempt":
		case "validate_recovery": return command.lifecycleGeneration;
		case "validate_foreground":
		case "bind_foreground_run": return command.claim.lifecycleGeneration;
		default: return;
	}
}
async function commitMainSessionRecovery(params) {
	const cancellation = params.command.kind === "cancel_reservation" ? params.command.reservation : void 0;
	const abandonment = params.command.kind === "abandon_reservation" ? params.command.reservation : void 0;
	const recoveryAdmission = params.command.kind === "admit_recovery" || params.command.kind === "validate_recovery" ? params.command : void 0;
	const ownerClaim = params.command.kind === "claim_foreground" ? params.command : void 0;
	const ownerValidation = params.command.kind === "validate_foreground" ? params.command.claim : void 0;
	const ownerRelease = params.command.kind === "release_foreground" ? params.command.claim : void 0;
	const reservationCleanup = cancellation ?? abandonment;
	const scansAliases = Boolean(params.scanAliases || reservationCleanup || recoveryAdmission || ownerValidation || ownerRelease);
	return await applySessionEntryReplacements({
		requireWriteSuccess: params.requireWriteSuccess,
		...scansAliases ? {} : { sessionKeys: [params.target.sessionKey] },
		storePath: params.target.storePath,
		update: (entries) => {
			const expectedGeneration = currentGenerationRequiredBy(params.command);
			if (expectedGeneration && expectedGeneration !== getAgentEventLifecycleGeneration()) return { result: { transition: {
				kind: "rejected",
				reason: "stale_generation"
			} } };
			const selected = entries.find(({ sessionKey }) => sessionKey === params.target.sessionKey);
			let candidate = params.expectedSessionId && selected?.entry.sessionId !== params.expectedSessionId || ownerClaim && selected?.entry.sessionId !== ownerClaim.sessionId ? void 0 : selected;
			if (reservationCleanup) candidate = entries.find(({ entry }) => matchesReservation(entry, reservationCleanup)) ?? selected;
			else if (recoveryAdmission) candidate = entries.find(({ entry }) => matchesRecoveryAdmission(entry, recoveryAdmission)) ?? selected;
			else if (ownerValidation || ownerRelease) {
				const exactClaim = ownerValidation ?? ownerRelease;
				candidate = entries.find(({ entry }) => matchesOwnerClaim(entry, exactClaim)) ?? selected;
			} else if (ownerClaim && (!selected || selected.entry.sessionId !== ownerClaim.sessionId)) candidate = entries.find(({ entry }) => entry.sessionId === ownerClaim.sessionId);
			else if (params.scanAliases && params.expectedSessionId) candidate = entries.find(({ entry }) => entry.sessionId === params.expectedSessionId);
			if (!candidate) return { result: {
				entry: selected?.entry,
				sessionKey: selected?.sessionKey,
				transition: {
					kind: "rejected",
					reason: "session_replaced"
				}
			} };
			const entry = candidate.entry;
			const previousRecoveryState = entry.mainRestartRecovery;
			let command;
			if (ownerClaim) command = ownerClaim.sessionKey === candidate.sessionKey ? ownerClaim : {
				...ownerClaim,
				sessionKey: candidate.sessionKey
			};
			else if ((params.command.kind === "observe" || params.command.kind === "inspect") && params.command.sessionKey !== candidate.sessionKey) command = {
				...params.command,
				sessionKey: candidate.sessionKey
			};
			else command = params.command;
			const transition = transitionMainSessionRecovery(entry, command);
			const changed = transitionChanged(transition) || previousRecoveryState !== entry.mainRestartRecovery;
			return {
				result: {
					entry,
					sessionKey: candidate.sessionKey,
					transition
				},
				...changed ? { replacements: [{
					sessionKey: candidate.sessionKey,
					entry
				}] } : {}
			};
		}
	});
}
async function readMainSessionRecoveryOwner(lease) {
	const result = await commitMainSessionRecovery({
		command: {
			kind: "validate_foreground",
			claim: lease
		},
		requireWriteSuccess: true,
		target: lease
	});
	return result.transition.kind === "foreground_validated" && result.entry && result.sessionKey ? {
		entry: result.entry,
		sessionKey: result.sessionKey
	} : void 0;
}
async function claimMainSessionRecoveryOwner(params) {
	const command = {
		kind: "claim_foreground",
		cycleId: randomUUID(),
		lifecycleGeneration: params.lifecycleGeneration,
		sessionId: params.sessionId,
		sessionKey: params.target.sessionKey,
		claimId: randomUUID(),
		...params.runId ? { runId: params.runId } : {}
	};
	let claim = await commitMainSessionRecovery({
		command,
		requireWriteSuccess: true,
		target: params.target
	});
	if (claim.transition.kind === "rejected" && claim.transition.reason === "session_replaced") claim = await commitMainSessionRecovery({
		command,
		requireWriteSuccess: true,
		scanAliases: true,
		target: params.target
	});
	if (claim.transition.kind === "foreground_claimed") {
		if (!claim.entry || !claim.sessionKey) return {
			kind: "invalidated",
			reason: "state_changed"
		};
		return {
			kind: "claimed",
			lease: {
				...claim.transition.claim,
				storePath: params.target.storePath
			},
			entry: claim.entry,
			sessionKey: claim.sessionKey
		};
	}
	if (claim.transition.kind === "rejected" && claim.transition.reason === "stale_generation") return {
		kind: "invalidated",
		reason: claim.transition.reason
	};
	if (!claim.entry && (params.allowMissingSession || params.replacementSessionId)) return { kind: "not_required" };
	if (params.replacementSessionId && claim.entry?.sessionId === params.replacementSessionId && claim.entry.abortedLastRun !== true && claim.entry.restartRecoveryRuns === void 0 && claim.entry.mainRestartRecovery === void 0) return { kind: "not_required" };
	if (claim.entry?.sessionId === params.sessionId && claim.sessionKey && !isMainRestartRecoveryCandidate(claim.entry, claim.sessionKey)) return { kind: "not_required" };
	if (claim.entry?.sessionId === params.sessionId && claim.entry.abortedLastRun !== true && claim.entry.restartRecoveryRuns === void 0 && claim.entry.mainRestartRecovery === void 0) return { kind: "not_required" };
	return {
		kind: "invalidated",
		reason: claim.transition.kind === "rejected" ? claim.transition.reason : "state_changed"
	};
}
async function bindMainSessionRecoveryOwnerRun(lease, runId) {
	const result = await commitMainSessionRecovery({
		command: {
			kind: "bind_foreground_run",
			claim: lease,
			runId
		},
		requireWriteSuccess: true,
		target: lease
	});
	if (result.transition.kind !== "applied" || !result.entry || !result.sessionKey) throw new Error("main-session recovery owner changed before run binding");
	return {
		lease: {
			...lease,
			runId
		},
		entry: result.entry,
		sessionKey: result.sessionKey
	};
}
async function inspectMainSessionRecoveryRequired(params) {
	const command = {
		kind: "inspect",
		lifecycleGeneration: params.lifecycleGeneration,
		sessionKey: params.target.sessionKey
	};
	let result = await commitMainSessionRecovery({
		command,
		expectedSessionId: params.expectedSessionId,
		requireWriteSuccess: true,
		target: params.target
	});
	if (result.transition.kind === "rejected" && result.transition.reason === "session_replaced") result = await commitMainSessionRecovery({
		command,
		expectedSessionId: params.expectedSessionId,
		requireWriteSuccess: true,
		scanAliases: true,
		target: params.target
	});
	if (result.transition.kind === "observed") return result.transition.view.status === "inactive" ? { kind: "not_required" } : { kind: "required" };
	if (result.transition.kind === "rejected" && result.transition.reason === "session_replaced") return !result.entry && params.allowMissingSession ? { kind: "not_required" } : {
		kind: "invalidated",
		reason: result.transition.reason
	};
	return {
		kind: "invalidated",
		reason: result.transition.kind === "rejected" ? result.transition.reason : "state_changed"
	};
}
async function releaseMainSessionRecoveryOwnerWithRetries(lease) {
	const released = await retryAsync(async () => await commitMainSessionRecovery({
		command: {
			kind: "release_foreground",
			claim: lease
		},
		requireWriteSuccess: true,
		target: lease
	}), 3, 25);
	const { entry, sessionKey } = released;
	const state = entry?.mainRestartRecovery;
	if (released.transition.kind !== "applied" && released.transition.kind !== "no_change" || !entry || !sessionKey || entry.sessionId !== lease.sessionId || entry.status !== "running" || entry.abortedLastRun !== true || !isMainRestartRecoveryCandidate(entry, sessionKey) || state?.foregroundClaims || state?.reservation || state?.tombstone) return;
	return {
		sessionId: entry.sessionId,
		sessionKey,
		storePath: lease.storePath
	};
}
function scheduleMainSessionRecoveryOwnerRelease(lease, delayMs = OWNER_RELEASE_RETRY_DELAY_MS) {
	setTimeout(() => {
		releaseMainSessionRecoveryOwnerWithRetries(lease).then(async (pending) => {
			if (!pending) return;
			const { scheduleMainSessionRecoveryPendingTarget } = await import("./main-session-recovery-owner-release-BU6dDJBR.js");
			scheduleMainSessionRecoveryPendingTarget(pending);
		}, () => {
			scheduleMainSessionRecoveryOwnerRelease(lease, Math.min(delayMs * 2, OWNER_RELEASE_RETRY_MAX_DELAY_MS));
		});
	}, delayMs).unref?.();
}
async function releaseMainSessionRecoveryOwner(lease) {
	if (!lease) return;
	try {
		return await releaseMainSessionRecoveryOwnerWithRetries(lease);
	} catch (error) {
		scheduleMainSessionRecoveryOwnerRelease(lease);
		throw error;
	}
}
//#endregion
export { readMainSessionRecoveryOwner as a, inspectMainSessionRecoveryRequired as i, claimMainSessionRecoveryOwner as n, releaseMainSessionRecoveryOwner as o, commitMainSessionRecovery as r, bindMainSessionRecoveryOwnerRun as t };
