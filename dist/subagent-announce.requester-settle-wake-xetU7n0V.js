import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { S as isCronSessionKey } from "./session-key-Drrs61Fd.js";
import { a as logWarn } from "./logger-DT9z6GgH.js";
import { o as normalizeDeliveryContext } from "./delivery-context.shared-D6zu5SGz.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-BlZ7xkRW.js";
import "./message-channel-CkiwT4Uh.js";
import { n as SILENT_REPLY_TOKEN } from "./tokens-DKI4eGAu.js";
import { n as hasSubagentRunEnded } from "./subagent-run-liveness-DmeVB_Vn.js";
import { s as getSubagentDepthFromSessionStore } from "./subagent-capabilities-DEarAhR2.js";
import "./delivery-context-CxAO83bE.js";
import { o as dedupeLatestChildCompletionRows, r as buildChildCompletionFindings, s as filterCurrentDirectChildCompletionRows } from "./subagent-session-cleanup-B3gE-rC8.js";
import { n as buildAnnounceIdempotencyKey } from "./announce-idempotency-DRIcQ039.js";
import { i as loadRequesterSessionEntry, n as deliverSubagentAnnouncement, t as resolveAnnounceOrigin } from "./subagent-announce-origin-DHldKZbu.js";
import { t as hasUsableSessionEntry } from "./subagent-announce-FZDkktu1.js";
//#region src/agents/subagent-announce.requester-settle-wake.ts
/**
* Durable top-level requester settle wake delivery.
*
* Lifecycle owns the persisted outbox state on retained subagent run rows;
* this module selects a drained wave and delivers its synthesized wake.
*/
const subagentRegistryRuntimeLoader = createLazyImportLoader(() => import("./subagent-announce.registry.runtime.js"));
function loadSubagentRegistryRuntime() {
	return subagentRegistryRuntimeLoader.load();
}
let requesterSettleWakeDeps = { loadSubagentRegistryRuntime };
const REQUESTER_SETTLE_WAKE_MAX_ATTEMPTS = 3;
const REQUESTER_SETTLE_WAKE_MAX_AMBIGUOUS_REPLAYS = 3;
const REQUESTER_SETTLE_WAKE_RETRY_DELAYS_MS = [3e4, 12e4];
const activeRequesterSettleWakeBatches = /* @__PURE__ */ new Set();
function runIntervalsOverlap(a, b) {
	const aEnd = typeof a.endedAt === "number" ? a.endedAt : Number.MAX_SAFE_INTEGER;
	const bEnd = typeof b.endedAt === "number" ? b.endedAt : Number.MAX_SAFE_INTEGER;
	return a.createdAt <= bEnd && b.createdAt <= aEnd;
}
function buildRequesterSettleWakeMessage(params) {
	return [
		"[Subagent Context] Every subagent spawned from this session has now settled — none are still running or awaiting completion delivery.",
		"[Subagent Context] Do not keep waiting or call sessions_yield again for this batch; no further completion events will arrive.",
		"[Subagent Context] Review the completion results and send your consolidated final answer to the user now.",
		`[Subagent Context] Reply ONLY: ${SILENT_REPLY_TOKEN} only if you already delivered the consolidated final answer for this batch.`,
		"",
		params.findings ?? "(each child result was announced individually in earlier completion events)"
	].join("\n");
}
function buildConnectedSettledWave(candidates, settledEntry) {
	const unclaimed = new Set(candidates);
	const batch = [];
	const frontier = [settledEntry];
	for (const entry of unclaimed) if (entry.runId === settledEntry.runId) {
		unclaimed.delete(entry);
		batch.push(entry);
		frontier.push(entry);
		break;
	}
	for (let pivot = frontier.pop(); pivot; pivot = frontier.pop()) for (const entry of unclaimed) if (runIntervalsOverlap(entry, pivot)) {
		unclaimed.delete(entry);
		batch.push(entry);
		frontier.push(entry);
	}
	return batch;
}
function readSharedBatchState(batch) {
	const states = batch.map((entry) => entry.requesterSettleWake).filter((state) => Boolean(state));
	const source = states.find((state) => state.status === "dispatching") ?? states[0];
	return {
		status: source?.status ?? "pending",
		attemptCount: Math.max(0, ...states.map((state) => state.attemptCount)),
		...source?.replayCount !== void 0 ? { replayCount: source.replayCount } : {},
		...source?.nextAttemptAt !== void 0 ? { nextAttemptAt: source.nextAttemptAt } : {},
		...source?.batchRunIds ? { batchRunIds: [...source.batchRunIds] } : {},
		...states.some((state) => state.requesterYieldBatch === true) ? { requesterYieldBatch: true } : {},
		...states.some((state) => state.afterRequesterYield === true) ? { afterRequesterYield: true } : {},
		...source?.rearmGeneration !== void 0 ? { rearmGeneration: source.rearmGeneration } : {},
		...source?.lastError !== void 0 ? { lastError: source.lastError } : {}
	};
}
function deferRequesterSettleWakeBatch(params) {
	params.transitionBatch(params.batchRunIds, {
		status: params.state.status,
		attemptCount: params.state.attemptCount,
		...params.state.replayCount !== void 0 ? { replayCount: params.state.replayCount } : {},
		nextAttemptAt: Math.max(params.state.nextAttemptAt ?? 0, Date.now() + REQUESTER_SETTLE_WAKE_RETRY_DELAYS_MS[0]),
		batchRunIds: [...params.batchRunIds],
		...params.state.requesterYieldBatch === true ? { requesterYieldBatch: true } : {},
		...params.state.afterRequesterYield === true ? { afterRequesterYield: true } : {},
		...params.state.rearmGeneration !== void 0 ? { rearmGeneration: params.state.rearmGeneration } : {},
		...params.state.lastError !== void 0 ? { lastError: params.state.lastError } : {}
	});
}
function completeRequesterSettleWakeBatch(params) {
	if (params.state.rearmGeneration === void 0) {
		params.completeBatch(params.runIds);
		return;
	}
	params.completeBatch(params.runIds, params.state.rearmGeneration);
}
/**
* Wakes a registry-less top-level requester once its last spawned child
* reaches terminal settle. Durable state transitions happen synchronously
* through lifecycle-owned callbacks before and after every async delivery.
*/
async function maybeWakeRequesterAfterAllChildrenSettled(params) {
	if (params.signal?.aborted) return false;
	const completeBatch = (runIds, rearmGeneration) => {
		if (rearmGeneration === void 0) {
			params.completeBatch(runIds);
			return;
		}
		params.completeBatch(runIds, rearmGeneration);
	};
	const requesterSessionKey = params.requesterSessionKey.trim();
	const initialState = params.settledEntry.requesterSettleWake;
	if (!requesterSessionKey || !initialState) return false;
	if (isCronSessionKey(requesterSessionKey)) {
		completeRequesterSettleWakeBatch({
			runIds: [params.settledEntry.runId],
			state: initialState,
			completeBatch
		});
		return false;
	}
	const registryRuntime = await requesterSettleWakeDeps.loadSubagentRegistryRuntime();
	const listedRuns = registryRuntime.listSubagentRunsForRequester(requesterSessionKey);
	const requesterRuns = Array.isArray(listedRuns) ? listedRuns : [];
	const currentSettledEntry = requesterRuns.find((entry) => entry.runId === params.settledEntry.runId) ?? params.settledEntry;
	if (!currentSettledEntry.requesterSettleWake) return false;
	const requesterHasUnsettledDescendants = () => registryRuntime.hasDescendantRunAwaitingSettle(requesterSessionKey, currentSettledEntry.runId);
	const frozenBatchRunIds = currentSettledEntry.requesterSettleWake.batchRunIds;
	const currentRearmGeneration = currentSettledEntry.requesterSettleWake.rearmGeneration;
	let settledBatch;
	if (frozenBatchRunIds && frozenBatchRunIds.length > 0) {
		const runsById = new Map(requesterRuns.map((entry) => [entry.runId, entry]));
		settledBatch = frozenBatchRunIds.map((runId) => runsById.get(runId)).filter((entry) => Boolean(entry?.requesterSettleWake) && entry?.requesterSettleWake?.rearmGeneration === currentRearmGeneration);
	} else settledBatch = buildConnectedSettledWave(requesterRuns.filter((entry) => entry.requesterSettleWake && hasSubagentRunEnded(entry)), currentSettledEntry);
	if (settledBatch.length === 0) return false;
	const batchRunIds = settledBatch.map((entry) => entry.runId).toSorted();
	const selectedState = readSharedBatchState(settledBatch);
	if (requesterHasUnsettledDescendants()) {
		if (frozenBatchRunIds && frozenBatchRunIds.length > 0) deferRequesterSettleWakeBatch({
			batchRunIds,
			state: selectedState,
			transitionBatch: params.transitionBatch
		});
		return false;
	}
	const requiredSettled = settledBatch.filter((entry) => entry.expectsCompletionMessage === true);
	const hasUndeliveredRequiredCompletion = requiredSettled.some((entry) => entry.delivery?.status !== "delivered");
	const requesterYieldedAfterDelivery = selectedState.afterRequesterYield === true;
	if (requiredSettled.length === 0 || requiredSettled.length < 2 && !hasUndeliveredRequiredCompletion && !requesterYieldedAfterDelivery || getSubagentDepthFromSessionStore(requesterSessionKey) >= 1) {
		completeRequesterSettleWakeBatch({
			runIds: batchRunIds,
			state: selectedState,
			completeBatch
		});
		return false;
	}
	const { entry: requesterEntry } = loadRequesterSessionEntry(requesterSessionKey);
	if (!hasUsableSessionEntry(requesterEntry)) {
		completeRequesterSettleWakeBatch({
			runIds: batchRunIds,
			state: selectedState,
			completeBatch
		});
		return false;
	}
	const wakeMessage = buildRequesterSettleWakeMessage({ findings: buildChildCompletionFindings(dedupeLatestChildCompletionRows(filterCurrentDirectChildCompletionRows(settledBatch, {
		requesterSessionKey,
		getLatestSubagentRunByChildSessionKey: registryRuntime.getLatestSubagentRunByChildSessionKey
	}))) });
	const requesterSessionOrigin = normalizeDeliveryContext(params.requesterOrigin);
	const directOrigin = resolveAnnounceOrigin(requesterEntry, requesterSessionOrigin);
	const wakeKeyBase = [`requester-settle:${requesterSessionKey}:${batchRunIds.join(",")}`, selectedState.rearmGeneration === void 0 ? void 0 : `yield-${selectedState.rearmGeneration}`].filter(Boolean).join(":");
	if (activeRequesterSettleWakeBatches.has(wakeKeyBase)) return false;
	activeRequesterSettleWakeBatches.add(wakeKeyBase);
	try {
		if (params.signal?.aborted) return false;
		let state = readSharedBatchState(settledBatch);
		if (!settledBatch.some((entry) => entry.requesterSettleWake)) return false;
		if ((state.nextAttemptAt ?? 0) > Date.now()) return false;
		if (requesterHasUnsettledDescendants()) {
			deferRequesterSettleWakeBatch({
				batchRunIds,
				state,
				transitionBatch: params.transitionBatch
			});
			return false;
		}
		let attemptIndex;
		if (state.status === "dispatching") attemptIndex = Math.max(0, state.attemptCount - 1);
		else {
			if (state.attemptCount >= REQUESTER_SETTLE_WAKE_MAX_ATTEMPTS) {
				completeRequesterSettleWakeBatch({
					runIds: batchRunIds,
					state,
					completeBatch
				});
				return false;
			}
			attemptIndex = state.attemptCount;
			state = {
				status: "dispatching",
				attemptCount: state.attemptCount + 1,
				batchRunIds,
				...state.requesterYieldBatch === true ? { requesterYieldBatch: true } : {},
				...state.afterRequesterYield === true ? { afterRequesterYield: true } : {},
				...state.rearmGeneration !== void 0 ? { rearmGeneration: state.rearmGeneration } : {}
			};
			params.transitionBatch(batchRunIds, state);
		}
		let delivery;
		try {
			delivery = await deliverSubagentAnnouncement({
				requesterSessionKey,
				triggerMessage: wakeMessage,
				steerMessage: wakeMessage,
				summaryLine: "all spawned subagents settled",
				requesterSessionOrigin,
				requesterOrigin: requesterSessionOrigin,
				directOrigin,
				sourceSessionKey: currentSettledEntry.childSessionKey,
				sourceChannel: INTERNAL_MESSAGE_CHANNEL,
				sourceTool: "subagent_announce",
				targetRequesterSessionKey: requesterSessionKey,
				requesterIsSubagent: false,
				expectsCompletionMessage: false,
				directIdempotencyKey: buildAnnounceIdempotencyKey(attemptIndex === 0 ? wakeKeyBase : `${wakeKeyBase}:retry-${attemptIndex}`),
				signal: params.signal
			});
		} catch (error) {
			const lastError = error instanceof Error ? error.message : String(error);
			const replayCount = (state.replayCount ?? 0) + 1;
			const retryDelayMs = REQUESTER_SETTLE_WAKE_RETRY_DELAYS_MS[replayCount - 1];
			if (replayCount >= REQUESTER_SETTLE_WAKE_MAX_AMBIGUOUS_REPLAYS || retryDelayMs === void 0) {
				completeRequesterSettleWakeBatch({
					runIds: batchRunIds,
					state,
					completeBatch
				});
				return false;
			}
			const nextAttemptAt = Date.now() + retryDelayMs;
			state = {
				status: "dispatching",
				attemptCount: state.attemptCount,
				replayCount,
				nextAttemptAt,
				batchRunIds,
				...state.requesterYieldBatch === true ? { requesterYieldBatch: true } : {},
				...state.afterRequesterYield === true ? { afterRequesterYield: true } : {},
				...state.rearmGeneration !== void 0 ? { rearmGeneration: state.rearmGeneration } : {},
				lastError
			};
			params.transitionBatch(batchRunIds, state);
			logWarn(`requester settle wake transport replay ${replayCount} scheduled in ${Math.round(retryDelayMs / 1e3)}s: ${lastError}`);
			return false;
		}
		if (delivery.delivered) {
			completeRequesterSettleWakeBatch({
				runIds: batchRunIds,
				state,
				completeBatch
			});
			return true;
		}
		if (delivery.terminal === true || delivery.reason === "requester_abandoned") {
			completeRequesterSettleWakeBatch({
				runIds: batchRunIds,
				state,
				completeBatch
			});
			return false;
		}
		const attemptCount = attemptIndex + 1;
		const retryDelayMs = REQUESTER_SETTLE_WAKE_RETRY_DELAYS_MS[attemptIndex];
		if (attemptCount >= REQUESTER_SETTLE_WAKE_MAX_ATTEMPTS || retryDelayMs === void 0) {
			completeRequesterSettleWakeBatch({
				runIds: batchRunIds,
				state,
				completeBatch
			});
			return false;
		}
		const lastError = delivery.error ?? delivery.reason ?? "undelivered";
		const nextAttemptAt = Date.now() + retryDelayMs;
		params.transitionBatch(batchRunIds, {
			status: "pending",
			attemptCount,
			nextAttemptAt,
			batchRunIds,
			...state.requesterYieldBatch === true ? { requesterYieldBatch: true } : {},
			...state.afterRequesterYield === true ? { afterRequesterYield: true } : {},
			...state.rearmGeneration !== void 0 ? { rearmGeneration: state.rearmGeneration } : {},
			lastError
		});
		logWarn(`requester settle wake attempt ${attemptCount} failed; retrying in ${Math.round(retryDelayMs / 1e3)}s: ${lastError}`);
		return false;
	} finally {
		activeRequesterSettleWakeBatches.delete(wakeKeyBase);
	}
}
//#endregion
export { maybeWakeRequesterAfterAllChildrenSettled };
