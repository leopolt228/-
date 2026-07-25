import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { Vt as deriveContextPromptTokens, et as updateSessionEntry, yt as loadSessionEntry } from "./session-accessor-Mu3lv_Tl.js";
import { d as buildRestartRecoveryClaimCleanupPatch, h as hasRestartRecoveryTerminalRun, m as hasRestartRecoverySourceClaim, v as sameRestartRecoveryTerminalRunIds } from "./store-DDuGv_UJ.js";
import { i as resolveModelCostConfig, t as estimateUsageCost } from "./usage-format-eg_0FVCW.js";
import { n as resolveAgentIdentity } from "./identity-DV846zOa.js";
import { randomUUID } from "node:crypto";
//#region src/auto-reply/reply/restart-recovery-claim.ts
/** Provider redelivery guard shared by ingress and the agent admission boundary. */
function isDuplicateRestartRecoverySource(entry, sourceTurnId) {
	const normalizedSourceTurnId = normalizeOptionalString(sourceTurnId);
	return Boolean(normalizedSourceTurnId && (hasRestartRecoveryTerminalRun(entry ?? void 0, normalizedSourceTurnId) || hasRestartRecoverySourceClaim(entry ?? void 0, normalizedSourceTurnId)));
}
async function retireTerminalRestartRecoverySourceClaim(params) {
	let didRetire = false;
	const retired = await updateSessionEntry({
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}, (current) => {
		if (current.sessionId !== params.sessionId || current.status === "running" || current.restartRecoveryDeliveryReceiptState === "terminal-pending" || !hasRestartRecoverySourceClaim(current, params.sourceTurnId)) return null;
		didRetire = true;
		return {
			...buildRestartRecoveryClaimCleanupPatch({
				entry: current,
				recordTerminalSource: true,
				terminalSourceRunId: params.sourceTurnId
			}),
			updatedAt: Date.now()
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
	return didRetire ? retired ?? void 0 : void 0;
}
function buildExpectedSessionState(entry) {
	return {
		abortedLastRun: entry.abortedLastRun,
		restartRecoveryBeforeAgentReplyState: entry.restartRecoveryBeforeAgentReplyState,
		restartRecoveryDeliveryReceiptState: entry.restartRecoveryDeliveryReceiptState,
		restartRecoveryDeliveryToolCallId: entry.restartRecoveryDeliveryToolCallId,
		restartRecoveryDeliveryRequestFingerprint: entry.restartRecoveryDeliveryRequestFingerprint,
		restartRecoveryDeliveryRunId: entry.restartRecoveryDeliveryRunId,
		restartRecoveryDeliverySourceRunId: entry.restartRecoveryDeliverySourceRunId,
		restartRecoveryRequesterAccountId: entry.restartRecoveryRequesterAccountId,
		restartRecoveryRequesterSenderId: entry.restartRecoveryRequesterSenderId,
		restartRecoverySameChannelThreadRequired: entry.restartRecoverySameChannelThreadRequired,
		restartRecoverySourceIngress: entry.restartRecoverySourceIngress,
		restartRecoverySourceReplyDeliveryMode: entry.restartRecoverySourceReplyDeliveryMode,
		restartRecoveryTerminalRunIds: entry.restartRecoveryTerminalRunIds,
		status: entry.status,
		updatedAt: entry.updatedAt
	};
}
function matchesExpectedSessionState(entry, sessionId, expected) {
	return entry.sessionId === sessionId && entry.abortedLastRun === expected.abortedLastRun && entry.restartRecoveryBeforeAgentReplyState === expected.restartRecoveryBeforeAgentReplyState && entry.restartRecoveryDeliveryReceiptState === expected.restartRecoveryDeliveryReceiptState && entry.restartRecoveryDeliveryToolCallId === expected.restartRecoveryDeliveryToolCallId && entry.restartRecoveryDeliveryRequestFingerprint === expected.restartRecoveryDeliveryRequestFingerprint && entry.restartRecoveryDeliveryRunId === expected.restartRecoveryDeliveryRunId && entry.restartRecoveryDeliverySourceRunId === expected.restartRecoveryDeliverySourceRunId && entry.restartRecoveryRequesterAccountId === expected.restartRecoveryRequesterAccountId && entry.restartRecoveryRequesterSenderId === expected.restartRecoveryRequesterSenderId && entry.restartRecoverySameChannelThreadRequired === expected.restartRecoverySameChannelThreadRequired && entry.restartRecoverySourceIngress === expected.restartRecoverySourceIngress && entry.restartRecoverySourceReplyDeliveryMode === expected.restartRecoverySourceReplyDeliveryMode && sameRestartRecoveryTerminalRunIds(entry.restartRecoveryTerminalRunIds, expected.restartRecoveryTerminalRunIds) && entry.status === expected.status && entry.updatedAt === expected.updatedAt;
}
function createReplyRestartRecoveryClaimController(params) {
	let recoveryRunId = randomUUID();
	let recoverySourceRunId;
	let tracked = false;
	const persistAdmissionPatch = async (options) => {
		const expectedSessionState = buildExpectedSessionState(options.entry);
		if (options.recorder && !options.recorder.hasPersisted()) {
			const result = await options.recorder.persistApproved({
				expectedSessionId: options.sessionId,
				expectedSessionState,
				sessionLifecyclePatch: options.patch
			});
			if (!result?.sessionEntry) throw new Error("session changed before durable user-turn admission");
			return result.sessionEntry;
		}
		const persisted = await updateSessionEntry({
			storePath: options.storePath,
			sessionKey: options.sessionKey
		}, (current) => matchesExpectedSessionState(current, options.sessionId, expectedSessionState) ? options.patch : null);
		if (!persisted) throw new Error("restart recovery claim changed before agent adoption");
		return persisted;
	};
	const persistUserTurnOnly = async (recorder, sessionId) => {
		if (!recorder || recorder.hasPersisted()) return;
		const result = await recorder.persistApproved({ expectedSessionId: sessionId });
		if (!result) throw new Error("session changed before durable user-turn admission");
		if (result.sessionEntry) params.setEntry(result.sessionEntry);
	};
	const admitUserTurn = async (recorder) => {
		if (!params.sessionKey || !params.storePath) {
			await recorder?.persistApproved();
			return "admitted";
		}
		const sessionId = params.getSessionId();
		const entry = loadSessionEntry({
			storePath: params.storePath,
			sessionKey: params.sessionKey,
			clone: false,
			hydrateSkillPromptRefs: false
		}) ?? params.getEntry();
		if (!entry || entry.sessionId !== sessionId) throw new Error("session changed before durable user-turn admission");
		const admissionRunId = normalizeOptionalString(params.admissionRunId);
		const sourceTurnId = normalizeOptionalString(params.sourceTurnId);
		if (sourceTurnId) {
			if (hasRestartRecoveryTerminalRun(entry, sourceTurnId)) return "duplicate-source";
			if (hasRestartRecoverySourceClaim(entry, sourceTurnId)) {
				if (entry.status !== "running") {
					const retired = await retireTerminalRestartRecoverySourceClaim({
						sessionId,
						sessionKey: params.sessionKey,
						sourceTurnId,
						storePath: params.storePath
					});
					if (retired) params.setEntry(retired);
				}
				return "duplicate-source";
			}
		}
		const activeClaimRunId = normalizeOptionalString(entry?.restartRecoveryDeliveryRunId);
		if (admissionRunId && entry && entry.restartRecoveryDeliveryContext === void 0 && activeClaimRunId === admissionRunId) {
			if (entry.status !== "running" || entry.abortedLastRun === true) throw new Error("restart recovery claim changed before agent adoption");
			const recoveredBeforeAgentReplyState = activeClaimRunId === admissionRunId ? entry.restartRecoveryBeforeAgentReplyState : void 0;
			const adopted = await persistAdmissionPatch({
				entry,
				patch: {
					restartRecoveryBeforeAgentReplyState: recoveredBeforeAgentReplyState ?? params.beforeAgentReplyState,
					restartRecoveryDeliveryReceiptState: void 0,
					restartRecoveryDeliveryToolCallId: void 0,
					restartRecoveryDeliveryRequestFingerprint: void 0,
					restartRecoverySourceIngress: entry.restartRecoverySourceIngress ?? "control-ui",
					updatedAt: Date.now()
				},
				recorder,
				sessionId,
				sessionKey: params.sessionKey,
				storePath: params.storePath
			});
			params.setEntry(adopted);
			recoveryRunId = admissionRunId;
			recoverySourceRunId = normalizeOptionalString(adopted.restartRecoveryDeliverySourceRunId);
			tracked = true;
			return "admitted";
		}
		const deliveryContext = params.resolveDeliveryContext(entry);
		const recoverableDeliveryContext = deliveryContext && sourceTurnId ? deliveryContext : void 0;
		if (recoverableDeliveryContext) {
			const persistedSourceTurnId = normalizeOptionalString((recorder?.getPersistedMessage?.() ?? await recorder?.resolveMessage())?.idempotencyKey);
			if (!recorder || persistedSourceTurnId !== sourceTurnId) throw new Error("channel restart recovery requires source-keyed user-turn admission");
		}
		if (!recoverableDeliveryContext && !activeClaimRunId) {
			await persistUserTurnOnly(recorder, sessionId);
			return "admitted";
		}
		const updatedAt = Date.now();
		if (activeClaimRunId && (entry.abortedLastRun === true || entry.status === "running" || entry.restartRecoveryDeliveryReceiptState === "terminal-pending")) throw new Error("restart recovery claim changed before agent adoption");
		const retiredClaim = activeClaimRunId ? buildRestartRecoveryClaimCleanupPatch({
			entry,
			recordTerminalSource: true,
			terminalSourceRunId: normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId)
		}) : {};
		const patch = recoverableDeliveryContext ? {
			...retiredClaim,
			abortedLastRun: false,
			endedAt: void 0,
			restartRecoveryBeforeAgentReplyState: params.beforeAgentReplyState,
			restartRecoveryDeliveryReceiptState: void 0,
			restartRecoveryDeliveryToolCallId: void 0,
			restartRecoveryDeliveryContext: recoverableDeliveryContext,
			restartRecoveryDeliveryRequestFingerprint: void 0,
			restartRecoveryDeliveryRunId: recoveryRunId,
			restartRecoveryDeliverySourceRunId: sourceTurnId,
			restartRecoveryRequesterAccountId: sourceTurnId ? normalizeOptionalString(params.requesterAccountId) : void 0,
			restartRecoveryRequesterSenderId: sourceTurnId ? normalizeOptionalString(params.requesterSenderId) : void 0,
			restartRecoverySameChannelThreadRequired: sourceTurnId && params.sameChannelThreadRequired === true ? true : void 0,
			restartRecoverySourceIngress: sourceTurnId ? "channel" : void 0,
			restartRecoverySourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
			runtimeMs: void 0,
			startedAt: updatedAt,
			status: "running",
			updatedAt
		} : {
			...retiredClaim,
			updatedAt
		};
		const persisted = await persistAdmissionPatch({
			entry,
			patch,
			recorder,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		});
		params.setEntry(persisted);
		recoverySourceRunId = normalizeOptionalString(persisted.restartRecoveryDeliverySourceRunId);
		tracked = persisted.restartRecoveryDeliveryRunId === recoveryRunId;
		return "admitted";
	};
	const checkpointBeforeAgentReply = async ({ state, pendingFinalDelivery }) => {
		if (!tracked || !params.sessionKey || !params.storePath) return;
		const updatedAt = Date.now();
		const persisted = await updateSessionEntry({
			storePath: params.storePath,
			sessionKey: params.sessionKey
		}, (current) => current.sessionId === params.getSessionId() && current.restartRecoveryDeliveryRunId === recoveryRunId && current.restartRecoveryDeliverySourceRunId === recoverySourceRunId && current.restartRecoveryBeforeAgentReplyState === "pending" ? {
			restartRecoveryBeforeAgentReplyState: state,
			...pendingFinalDelivery ? {
				pendingFinalDelivery: true,
				pendingFinalDeliveryText: pendingFinalDelivery.text,
				pendingFinalDeliveryIntentId: pendingFinalDelivery.intentId,
				pendingFinalDeliveryContext: pendingFinalDelivery.context,
				pendingFinalDeliveryCreatedAt: updatedAt,
				restartRecoveryForceSafeTools: true
			} : {},
			updatedAt
		} : null, {
			skipMaintenance: true,
			takeCacheOwnership: true
		});
		if (!persisted) throw new Error("before_agent_reply checkpoint lost restart recovery ownership");
		params.setEntry(persisted);
	};
	const beginBeforeAgentReply = async () => {
		if (!tracked || !params.sessionKey || !params.storePath) return true;
		const current = loadSessionEntry({
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			clone: false,
			hydrateSkillPromptRefs: false
		});
		if (current?.sessionId === params.getSessionId() && current.restartRecoveryDeliveryRunId === recoveryRunId && current.restartRecoveryDeliverySourceRunId === recoverySourceRunId && current.restartRecoveryBeforeAgentReplyState === "continue") return false;
		const updatedAt = Date.now();
		const persisted = await updateSessionEntry({
			storePath: params.storePath,
			sessionKey: params.sessionKey
		}, (persistedCurrent) => persistedCurrent.sessionId === params.getSessionId() && persistedCurrent.restartRecoveryDeliveryRunId === recoveryRunId && persistedCurrent.restartRecoveryDeliverySourceRunId === recoverySourceRunId && persistedCurrent.restartRecoveryBeforeAgentReplyState === "admitted" ? {
			restartRecoveryBeforeAgentReplyState: "pending",
			updatedAt
		} : null, {
			skipMaintenance: true,
			takeCacheOwnership: true
		});
		if (!persisted) throw new Error("before_agent_reply start lost restart recovery ownership");
		params.setEntry(persisted);
		return true;
	};
	const clear = async () => {
		if (!tracked || !params.sessionKey || !params.storePath || params.isRestartAbort()) return;
		const persisted = await updateSessionEntry({
			storePath: params.storePath,
			sessionKey: params.sessionKey
		}, (current) => {
			if (current.sessionId !== params.getSessionId() || current.restartRecoveryDeliveryRunId !== recoveryRunId) return null;
			if (current.restartRecoveryDeliveryReceiptState === "terminal-pending") {
				const endedAt = Date.now();
				return {
					...buildRestartRecoveryClaimCleanupPatch({
						entry: current,
						recordTerminalSource: true,
						terminalSourceRunId: recoverySourceRunId
					}),
					abortedLastRun: true,
					endedAt,
					pendingFinalDelivery: void 0,
					pendingFinalDeliveryText: void 0,
					pendingFinalDeliveryCreatedAt: void 0,
					pendingFinalDeliveryLastAttemptAt: void 0,
					pendingFinalDeliveryAttemptCount: void 0,
					pendingFinalDeliveryLastError: void 0,
					pendingFinalDeliveryContext: void 0,
					pendingFinalDeliveryIntentId: void 0,
					runtimeMs: typeof current.startedAt === "number" ? Math.max(0, endedAt - current.startedAt) : void 0,
					status: "failed",
					updatedAt: endedAt
				};
			}
			const preservesPendingFinal = current.pendingFinalDelivery === true || normalizeOptionalString(current.pendingFinalDeliveryText) !== void 0;
			const endedAt = current.restartRecoveryBeforeAgentReplyState === "handled-silent" && !preservesPendingFinal ? Date.now() : void 0;
			return {
				...buildRestartRecoveryClaimCleanupPatch({
					entry: current,
					recordTerminalSource: true,
					terminalSourceRunId: recoverySourceRunId
				}),
				...preservesPendingFinal ? {
					restartRecoveryBeforeAgentReplyState: current.restartRecoveryBeforeAgentReplyState,
					restartRecoverySourceIngress: current.restartRecoverySourceIngress,
					restartRecoveryForceSafeTools: current.restartRecoveryForceSafeTools
				} : {},
				...endedAt !== void 0 ? {
					abortedLastRun: false,
					endedAt,
					runtimeMs: typeof current.startedAt === "number" ? Math.max(0, endedAt - current.startedAt) : void 0,
					status: "done"
				} : {},
				updatedAt: endedAt ?? Date.now()
			};
		});
		if (persisted) params.setEntry(persisted);
	};
	const isArmed = () => {
		if (!tracked || !params.sessionKey || !params.storePath) return false;
		return loadSessionEntry({
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			clone: false,
			hydrateSkillPromptRefs: false
		})?.abortedLastRun === true || params.getEntry()?.abortedLastRun === true;
	};
	return {
		admitUserTurn,
		beginBeforeAgentReply,
		checkpointBeforeAgentReply,
		clear,
		isArmed
	};
}
//#endregion
//#region src/auto-reply/reply/reply-usage-state.ts
const TTL_MS = 5 * 6e4;
const MAX_REPLY_USAGE_STATE_ENTRIES = 1024;
const store = /* @__PURE__ */ new Map();
function buildReplyUsageState(params) {
	const resolvedProvider = params.fallbackExhausted ? void 0 : params.winnerProvider;
	const resolvedModel = params.fallbackExhausted ? void 0 : params.winnerModel;
	const hasBillableUsageBuckets = params.usage && (params.usage.input !== void 0 || params.usage.output !== void 0 || params.usage.cacheRead !== void 0 || params.usage.cacheWrite !== void 0);
	return {
		provider: params.provider,
		model: params.model,
		resolvedRef: resolvedProvider && resolvedModel ? `${resolvedProvider}/${resolvedModel}` : void 0,
		reasoningEffort: params.reasoningEffort,
		fastMode: params.fastMode,
		fallbackUsed: params.fallbackUsed,
		agentId: params.agentId,
		sessionId: params.sessionId,
		chatType: params.chatType,
		authMode: params.authMode,
		overrideSource: params.overrideSource,
		requested: params.requestedProvider && params.requestedModel ? `${params.requestedProvider}/${params.requestedModel}` : void 0,
		turnUsd: hasBillableUsageBuckets ? estimateUsageCost({
			usage: params.usage,
			cost: resolveModelCostConfig({
				provider: params.provider,
				model: params.model,
				config: params.config
			})
		}) : void 0,
		durationMs: params.durationMs,
		identity: resolveAgentIdentity(params.config, params.agentId),
		compactionCount: params.compactionCount,
		contextTokenBudget: typeof params.contextTokenBudget === "number" && Number.isFinite(params.contextTokenBudget) ? params.contextTokenBudget : void 0,
		contextUsedTokens: typeof params.contextUsedTokens === "number" && Number.isFinite(params.contextUsedTokens) ? params.contextUsedTokens : deriveContextPromptTokens({
			lastCallUsage: params.lastCallUsage,
			promptTokens: params.promptTokens,
			usage: params.usage
		}),
		usage: params.usage ? {
			input: params.usage.input,
			output: params.usage.output,
			cacheRead: params.usage.cacheRead,
			cacheWrite: params.usage.cacheWrite,
			total: params.usage.total
		} : void 0,
		lastUsage: params.lastCallUsage ? {
			input: params.lastCallUsage.input,
			output: params.lastCallUsage.output,
			cacheRead: params.lastCallUsage.cacheRead,
			cacheWrite: params.lastCallUsage.cacheWrite,
			total: params.lastCallUsage.total
		} : void 0
	};
}
function prune(now) {
	for (const [key, value] of store) if (value.expiresAt < now) store.delete(key);
	while (store.size > MAX_REPLY_USAGE_STATE_ENTRIES) {
		const oldest = store.keys().next();
		if (oldest.done) return;
		store.delete(oldest.value);
	}
}
function recordReplyUsageState(runId, snapshot) {
	if (!runId) return;
	const now = Date.now();
	store.set(runId, {
		snapshot,
		expiresAt: now + TTL_MS
	});
	prune(now);
}
function consumeReplyUsageState(runId) {
	if (!runId) return;
	const value = store.get(runId);
	return value && value.expiresAt >= Date.now() ? value.snapshot : void 0;
}
//#endregion
export { isDuplicateRestartRecoverySource as a, createReplyRestartRecoveryClaimController as i, consumeReplyUsageState as n, retireTerminalRestartRecoverySourceClaim as o, recordReplyUsageState as r, buildReplyUsageState as t };
