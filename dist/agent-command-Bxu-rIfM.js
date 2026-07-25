import { c as normalizeOptionalString$1 } from "./string-coerce-DW4mBlAt.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { y as parseStrictNonNegativeInteger } from "./number-coercion-Crk_c9KW.js";
import "./parse-finite-number-CG8VFQF4.js";
import { t as sanitizeForLog } from "./ansi-BEaQ2G9r.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { r as defaultRuntime } from "./runtime-ZHfN2VLf.js";
import { r as getChildLogger } from "./logger-Dy4xN1lg.js";
import { f as isDiagnosticsEnabled, o as emitTrustedDiagnosticEvent } from "./diagnostic-events-Dt41CZkD.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import "./utils-K2PjeLaV.js";
import { l as isSecretRef } from "./types.secrets-BgE_Zq2x.js";
import { c as normalizePluginsConfig } from "./config-state-rO7K73Ka.js";
import { _ as resolveSessionAgentId, a as markAutoFallbackPrimaryProbe, i as hasLegacyAutoFallbackWithoutOrigin, m as resolveEffectiveModelFallbacks, n as entryMatchesAutoFallbackPrimaryProbe, o as resolveAgentEffectiveModelPrimary, p as resolveAutoFallbackPrimaryProbe, t as clearAutoFallbackPrimaryProbeSelection, w as hasSessionAutoModelFallbackProvenance } from "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { C as isSubagentSessionKey, c as isUnscopedSessionKeySentinel, d as resolveAgentIdFromSessionKey, h as scopeLegacySessionKeyToAgent, s as classifySessionKeyShape } from "./session-key-Drrs61Fd.js";
import { t as resolveEffectiveAgentSkillFilter } from "./agent-filter-DcBVtCFz.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, n as listAgentIds, o as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-S7z_Yn4H.js";
import { r as discoverConfigSecretTargetsByIds } from "./target-registry-query-DKaR_5Cb.js";
import "./target-registry-B8VdrXt8.js";
import { d as readConfigFileSnapshotForWrite, r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-Cq9SwNpx.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-DqR_mVNH.js";
import { w as setRuntimeConfigSnapshot } from "./runtime-snapshot-BW7iP5ad.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { n as isThinkingLevelSupported, t as formatThinkingLevels } from "./thinking-DDtbvjQ1.js";
import { s as normalizeThinkLevel, u as normalizeVerboseLevel } from "./thinking.shared-BWnbgBUO.js";
import { S as resolveModelRefFromString, i as buildModelAliasIndex, r as buildConfiguredModelCatalog, y as resolveConfiguredModelRef } from "./model-selection-shared-CPPxIJAX.js";
import { s as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-DbVdNqi2.js";
import { n as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-BlCyhiC_.js";
import { a as normalizeModelRef, i as modelKey, o as normalizeProviderId } from "./model-selection-normalize-D7Dhjaxs.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-CV4VBWUf.js";
import { O as withAgentRunLifecycleGeneration, S as registerAgentRunContext, i as clearAgentRunContext, l as emitAgentEvent, n as captureAgentRunLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Dg0sI2pr.js";
import { o as normalizeDeliveryContext } from "./delivery-context.shared-D6zu5SGz.js";
import "./message-channel-constants-BlZ7xkRW.js";
import { St as patchSessionEntry, Wt as hasNonzeroUsage } from "./session-accessor-Mu3lv_Tl.js";
import { o as resolveMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-DYDkUiW3.js";
import "./message-channel-CkiwT4Uh.js";
import { D as isValidAgentHarnessSessionStoreEntry, O as resolveAgentHarnessSessionContextError, b as AGENT_HARNESS_MODEL_RUN_FORBIDDEN_MESSAGE, bt as beginSessionWorkAdmission, d as buildRestartRecoveryClaimCleanupPatch } from "./store-DDuGv_UJ.js";
import { n as withPluginRuntimeGatewayRequestScope, t as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-CiIBNuZX.js";
import { i as ensureAuthProfileStore } from "./store-BTcmQtbp.js";
import { r as loadManifestModelCatalog } from "./model-catalog-Be-bQQxa.js";
import { n as isStoredCredentialCompatibleWithAuthProvider } from "./order-FUfwr_5s.js";
import { t as resolveThinkingDefault } from "./model-thinking-default-Bn7kjmzP.js";
import "./model-selection-Dx2ArePR.js";
import { i as loadPreparedModelCatalogSnapshot, n as loadPreparedModelCatalog } from "./prepared-model-catalog-CoGiwhz3.js";
import { f as stripInternalRuntimeContext, l as hasInternalRuntimeContext } from "./internal-runtime-context-BW7WOTKc.js";
import { d as ensureAgentWorkspace } from "./workspace-GYctLxSN.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-f-lb12_n.js";
import { d as recordSessionHumanDirectMessage, n as classifySessionStateActor } from "./session-state-events-BG_mebdA.js";
import "./agent-run-terminal-outcome-C9geO1r1.js";
import { c as resolveAgentRunAbortLifecycleFields, d as throwAgentRunRestartAbortReason, i as createAgentRunRestartAbortError, l as resolveAgentRunErrorLifecycleFields, o as isAgentRunDirectAbortReason, s as isAgentRunRestartAbortReason } from "./run-termination-BQ_P-sPi.js";
import { a as hasNewGeneratedMediaTaskForSessionKey, r as getGeneratedMediaTaskIdsForSessionKey } from "./task-status-access-CLMWwpdp.js";
import { n as resolveAgentTimeoutMs } from "./timeout-BEGWfRGM.js";
import { s as resolveCronJobsStorePath } from "./store-CFkN1_TJ.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-Vx3ij-ME.js";
import { o as isAgentMediatedCompletionSourceTool } from "./input-provenance-B6vSIOBi.js";
import { r as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-CGtM0hst.js";
import { t as resolveFastModeState } from "./fast-mode-DLmTLUz8.js";
import { n as resolveCandidateThinkingLevel, r as resolveEffectiveAgentRuntime } from "./thinking-runtime-g8O2MT43.js";
import { i as resolveModelCostConfig, t as estimateUsageCost } from "./usage-format-eg_0FVCW.js";
import { a as createUserTurnTranscriptRecorder } from "./user-turn-transcript-Dums4a4X.js";
import { a as normalizePendingFinalRecoveryPayloads, i as normalizePendingFinalDeliveryPayloads, r as buildRecoverablePendingFinalDeliveryText } from "./pending-final-delivery-C3iA5iUb.js";
import { a as readMainSessionRecoveryOwner, i as inspectMainSessionRecoveryRequired, n as claimMainSessionRecoveryOwner, o as releaseMainSessionRecoveryOwner, t as bindMainSessionRecoveryOwnerRun } from "./main-session-recovery-store-Dr0yGqam.js";
import { n as resolveSendPolicy } from "./send-policy-DYCRpCMq.js";
import { t as scheduleMainSessionRecoveryPendingTarget } from "./main-session-recovery-owner-release-CKDi4nci.js";
import { n as scheduleAdmittedRecoveryRestore, t as restoreAdmittedRecoveryWithRetries } from "./main-session-recovery-restore-CaM__oRH.js";
import { a as isAgentDeletionBlocked } from "./agent-lifecycle-registry-CkmkoYeX.js";
import { t as buildOutboundSessionContext } from "./session-context-Cq_Z7k0n.js";
import { _ as hasVisibleCommittedMessagingToolDeliveryEvidence, c as hasCommittedOutboundDeliveryEvidence, g as hasVisibleAgentPayload, h as hasUnaccountedMessagingToolAggregateEvidence, i as collectMessagingToolDeliveredMediaUrls, r as collectDeliveredMediaUrls } from "./delivery-evidence-DV3bbMhs.js";
import { r as resolveAvailableAgentHarnessPolicy } from "./selection-6xddiFwm.js";
import { N as isHeartbeatLifecycleRunKind } from "./openclaw-tools-U0Zy3sfO.js";
import { n as removeInternalSessionEffectsSession, r as resolveInternalSessionEffectsTarget, t as prepareInternalSessionEffectsSession } from "./internal-session-effects-ANMXQxxz.js";
import { f as formatAgentInternalEventsForPlainPrompt, p as formatAgentInternalEventsForPrompt } from "./subagent-announce-origin-DHldKZbu.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-ey8aD0rO.js";
import { r as resolveMessageChannelSelection } from "./channel-selection-DA0nSDDM.js";
import { u as LiveSessionModelSwitchError } from "./model-fallback-CVFSvXjG.js";
import { a as isModelSelectionLocked, i as applyModelOverrideToSessionEntry, o as repairProviderWrappedModelOverride, r as ModelSelectionLockedError, t as MODEL_SELECTION_LOCKED_MESSAGE } from "./model-overrides-BlzAR7Nc.js";
import { n as clearRotatedSessionMetadata, r as resolveSession } from "./session-BGTcM179.js";
import { d as getScopedChannelsCommandSecretTargets, t as getAgentRuntimeCommandSecretTargetIds } from "./command-secret-targets-CztQ0pHm.js";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-D6Ef-vpo.js";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-CI0_P-yC.js";
import { n as normalizeSpawnedRunMetadata } from "./spawned-context-DFWZoOgE.js";
import { t as createTrajectoryRuntimeRecorder } from "./runtime-DKjdpXlx.js";
import "./live-model-switch-ZRvkn9KR.js";
import { r as mergeSessionSnapshotChanges } from "./session-snapshot-merge-BPS3tTmG.js";
import { t as CronService } from "./service-I5TL4vDE.js";
import { t as resolveChannelModelOverride } from "./model-overrides-DSx8yLqf.js";
import { r as createChatRunEntry } from "./server-chat-state-B5sGX0h3.js";
import { t as clearSessionAuthProfileOverride } from "./session-override-B_a62NAZ.js";
import { r as resolveInlineAgentImageAttachments } from "./agent-turn-attachments-DaaBjcac.js";
import { t as NodeRegistry } from "./node-registry-CpV3kdT3.js";
import { n as resolveAgentExplicitRecipientSession, r as resolveAgentOutboundTarget, t as resolveAgentDeliveryPlanWithSessionRoute } from "./agent-delivery-CwaCB4DE.js";
import { n as acquireWorktreeRunLease, o as resolveWorktreeIdForPath } from "./run-lease-B0Jb1kT6.js";
import { t as runEmbeddedAgentEntry } from "./run-entry-sQjl-grE.js";
import { n as applyVerboseOverride } from "./level-overrides-O6qMB_-w.js";
import { t as resolveAgentRunContext } from "./run-context-DA84mV6k.js";
import path from "node:path";
//#region src/gateway/local-request-context.ts
function cronUnavailable() {
	throw new Error("Cron is unavailable in local embedded agent gateway context.");
}
const unavailableCron = {
	start: async () => {
		cronUnavailable();
	},
	stop: () => {},
	pauseScheduling: () => {},
	resumeScheduling: () => {},
	status: async () => cronUnavailable(),
	list: async () => cronUnavailable(),
	listPage: async () => cronUnavailable(),
	add: async () => cronUnavailable(),
	update: async () => cronUnavailable(),
	updateWithPrecondition: async () => cronUnavailable(),
	remove: async () => cronUnavailable(),
	removeAgentJobsTransactional: async () => cronUnavailable(),
	run: async () => cronUnavailable(),
	enqueueRun: async () => cronUnavailable(),
	getJob: () => void 0,
	readJob: async () => void 0,
	getDefaultAgentId: () => void 0,
	wake: () => ({
		ok: false,
		reason: "unwakeable-session-key"
	})
};
/** Creates the minimal gateway context used by embedded local agent execution. */
function createLocalGatewayRequestContext(params) {
	const logGateway = createSubsystemLogger("gateway/local");
	const cron = {
		...unavailableCron,
		removeAgentJobsTransactional: async (agentId, commit) => {
			const cfg = params.getRuntimeConfig();
			const storePath = resolveCronJobsStorePath(cfg.cron?.store);
			const service = new CronService({
				storePath,
				cronEnabled: cfg.cron?.enabled !== false,
				cronConfig: cfg.cron,
				log: getChildLogger({
					module: "cron",
					storePath
				}),
				defaultAgentId: resolveDefaultAgentId(cfg),
				resolveDefaultAgentId: () => resolveDefaultAgentId(params.getRuntimeConfig()),
				isAgentAvailable: (id) => !isAgentDeletionBlocked(id) && listAgentIds(params.getRuntimeConfig()).some((configuredId) => normalizeAgentId(configuredId) === id),
				enqueueSystemEvent: () => false,
				requestHeartbeat: () => {},
				runIsolatedAgentJob: async () => {
					throw new Error("Cron execution is unavailable in local embedded agent gateway context.");
				}
			});
			try {
				return await service.removeAgentJobsTransactional(agentId, commit);
			} finally {
				service.stop();
			}
		}
	};
	const sessionEvents = /* @__PURE__ */ new Set();
	const chatRuns = /* @__PURE__ */ new Map();
	const chatRunBuffers = /* @__PURE__ */ new Map();
	const chatRunPlanSnapshots = /* @__PURE__ */ new Map();
	const chatDeltaSentAt = /* @__PURE__ */ new Map();
	const chatDeltaLastBroadcastLen = /* @__PURE__ */ new Map();
	const chatDeltaLastBroadcastText = /* @__PURE__ */ new Map();
	const agentDeltaSentAt = /* @__PURE__ */ new Map();
	const bufferedAgentEvents = /* @__PURE__ */ new Map();
	const clearChatRunState = (runId) => {
		chatRunBuffers.delete(runId);
		chatRunPlanSnapshots.delete(runId);
		chatDeltaSentAt.delete(runId);
		chatDeltaLastBroadcastLen.delete(runId);
		chatDeltaLastBroadcastText.delete(runId);
		for (const key of [
			runId,
			`${runId}:assistant`,
			`${runId}:thinking`
		]) {
			agentDeltaSentAt.delete(key);
			bufferedAgentEvents.delete(key);
		}
	};
	return {
		deps: params.deps,
		cron,
		cronStorePath: "",
		getRuntimeConfig: params.getRuntimeConfig,
		notifyPluginMetadataChanged: () => {},
		resolveTerminalLaunchPolicy: () => ({
			ok: false,
			block: { kind: "disabled" }
		}),
		isTerminalEnabled: () => false,
		loadGatewayModelCatalog: async ({ agentId, agentDir, readOnly, workspaceDir } = {}) => loadPreparedModelCatalog({
			...agentId ? { agentId } : {},
			...agentDir ? { agentDir } : {},
			config: params.getRuntimeConfig(),
			readOnly: readOnly !== false,
			...workspaceDir ? { workspaceDir } : {}
		}),
		loadGatewayModelCatalogSnapshot: async ({ agentId, agentDir, readOnly, workspaceDir } = {}) => loadPreparedModelCatalogSnapshot({
			...agentId ? { agentId } : {},
			...agentDir ? { agentDir } : {},
			config: params.getRuntimeConfig(),
			readOnly: readOnly !== false,
			...workspaceDir ? { workspaceDir } : {}
		}),
		getHealthCache: () => null,
		refreshHealthSnapshot: async () => ({}),
		logHealth: { error: (message) => logGateway.error(message) },
		logGateway,
		incrementPresenceVersion: () => 0,
		getHealthVersion: () => 0,
		broadcast: () => {},
		broadcastToConnIds: () => {},
		nodeSendToSession: () => {},
		nodeSendToAllSubscribed: () => {},
		nodeSubscribe: () => {},
		nodeUnsubscribe: () => {},
		nodeUnsubscribeAll: () => {},
		hasConnectedTalkNode: () => false,
		nodeRegistry: new NodeRegistry(),
		agentRunSeq: /* @__PURE__ */ new Map(),
		chatAbortControllers: /* @__PURE__ */ new Map(),
		chatQueuedTurns: /* @__PURE__ */ new Map(),
		chatAbortedRuns: /* @__PURE__ */ new Map(),
		chatRunBuffers,
		chatRunPlanSnapshots,
		chatDeltaSentAt,
		chatDeltaLastBroadcastLen,
		chatDeltaLastBroadcastText,
		agentDeltaSentAt,
		bufferedAgentEvents,
		clearChatRunState,
		addChatRun: (sessionId, entry) => {
			chatRuns.set(sessionId, createChatRunEntry(entry));
		},
		removeChatRun: (sessionId, clientRunId, sessionKey) => {
			const entry = chatRuns.get(sessionId);
			if (!entry || entry.clientRunId !== clientRunId) return;
			if (sessionKey !== void 0 && entry.sessionKey !== sessionKey) return;
			chatRuns.delete(sessionId);
			return entry;
		},
		subscribeSessionEvents: (connId) => {
			sessionEvents.add(connId);
		},
		unsubscribeSessionEvents: (connId) => {
			sessionEvents.delete(connId);
		},
		subscribeSessionMessageEvents: () => void 0,
		unsubscribeSessionMessageEvents: () => {},
		unsubscribeAllSessionEvents: (connId) => {
			sessionEvents.delete(connId);
		},
		getSessionEventSubscriberConnIds: () => sessionEvents,
		registerToolEventRecipient: () => {},
		dedupe: /* @__PURE__ */ new Map(),
		wizardSessions: /* @__PURE__ */ new Map(),
		systemAgentSessions: /* @__PURE__ */ new Map(),
		findRunningWizard: () => null,
		purgeWizardSession: () => {},
		getRuntimeSnapshot: () => ({}),
		startChannel: async () => {
			throw new Error("Channel start is unavailable in local embedded agent gateway context.");
		},
		stopChannel: async () => {
			throw new Error("Channel stop is unavailable in local embedded agent gateway context.");
		},
		markChannelLoggedOut: () => {},
		wizardRunner: async () => {
			throw new Error("Onboarding wizard is unavailable in local embedded agent gateway context.");
		},
		channelWizardRunner: async () => {
			throw new Error("Channel setup wizard is unavailable in local embedded agent gateway context.");
		},
		broadcastVoiceWakeChanged: () => {},
		broadcastVoiceWakeRoutingChanged: () => {},
		unavailableGatewayMethods: /* @__PURE__ */ new Set()
	};
}
/** Runs code inside a local gateway request scope unless an outer scope already exists. */
function withLocalGatewayRequestScope(params, run) {
	const existing = getPluginRuntimeGatewayRequestScope();
	if (existing?.context) return run();
	const context = createLocalGatewayRequestContext(params);
	return withPluginRuntimeGatewayRequestScope({
		...existing,
		context,
		isWebchatConnect: existing?.isWebchatConnect ?? (() => false)
	}, run);
}
//#endregion
//#region src/agents/agent-command-recovery-owner.ts
const log$5 = createSubsystemLogger("agents/agent-command");
function cloneRecoveryOwnerEntry(entry) {
	return {
		...entry,
		...entry.restartRecoveryRuns ? { restartRecoveryRuns: entry.restartRecoveryRuns.map((run) => ({ ...run })) } : {},
		...entry.mainRestartRecovery ? { mainRestartRecovery: structuredClone(entry.mainRestartRecovery) } : {}
	};
}
function refreshPreparedRecoveryOwnerTarget(prepared, acquired) {
	if (!acquired || acquired.entry.sessionId !== prepared.sessionId) return;
	const entry = cloneRecoveryOwnerEntry(acquired.entry);
	prepared.sessionEntry = entry;
	if (prepared.sessionStore && prepared.sessionKey) prepared.sessionStore[prepared.sessionKey] = entry;
}
async function claimAgentCommandRecoveryOwner(params) {
	const transferredLease = params.opts.mainRestartRecoveryOwnerLease;
	if (transferredLease) {
		const expectedLeaseSessionId = params.prepared.isNewSession ? params.prepared.previousSessionId : params.prepared.sessionId;
		if (!(expectedLeaseSessionId !== void 0 && transferredLease.lifecycleGeneration === params.lifecycleGeneration && transferredLease.sessionId === expectedLeaseSessionId && transferredLease.sessionKey === params.prepared.sessionKey && path.resolve(transferredLease.storePath) === path.resolve(params.prepared.storePath))) throw new Error("main-session recovery owner changed during ingress preparation; retry");
		if (params.opts.runId) return await bindMainSessionRecoveryOwnerRun(transferredLease, params.opts.runId);
		const snapshot = await readMainSessionRecoveryOwner(transferredLease);
		if (!snapshot) throw new Error("main-session recovery owner changed during ingress preparation; retry");
		return {
			...snapshot,
			lease: transferredLease
		};
	}
	if (params.opts.sessionEffects === "internal") return;
	if (params.opts.mainRestartRecoveryAdmitted === true) return;
	const sessionKey = params.prepared.sessionKey;
	if (!sessionKey) return;
	if (params.mode === "reject_uncoordinated") {
		const recoveryInspection = await inspectMainSessionRecoveryRequired({
			allowMissingSession: params.prepared.isNewSession && !params.prepared.previousSessionId || params.opts.sessionId?.trim() === params.prepared.sessionId,
			expectedSessionId: params.prepared.previousSessionId ?? params.prepared.sessionId,
			lifecycleGeneration: params.lifecycleGeneration,
			target: {
				sessionKey,
				storePath: params.prepared.storePath
			}
		});
		if (recoveryInspection.kind === "invalidated") throw new Error(`Session "${sessionKey}" changed while starting work. Retry.`);
		if (recoveryInspection.kind === "required") throw new Error(`Session "${sessionKey}" has interrupted work pending restart recovery; retry through a healthy Gateway or reset it there with /new or /reset.`);
		return;
	}
	const claim = await claimMainSessionRecoveryOwner({
		allowMissingSession: params.prepared.isNewSession && !params.prepared.previousSessionId || params.opts.sessionId?.trim() === params.prepared.sessionId,
		lifecycleGeneration: params.lifecycleGeneration,
		sessionId: params.prepared.previousSessionId ?? params.prepared.sessionId,
		replacementSessionId: params.prepared.isNewSession ? params.prepared.sessionId : void 0,
		runId: params.opts.runId,
		target: {
			sessionKey,
			storePath: params.prepared.storePath
		}
	});
	if (claim.kind === "invalidated") throw new Error(`Session "${sessionKey}" changed while starting work. Retry.`);
	if (claim.kind === "not_required") return;
	return {
		lease: claim.lease,
		entry: claim.entry,
		sessionKey: claim.sessionKey
	};
}
async function runWithAgentCommandRecoveryOwner(params) {
	let lease = params.opts.mainRestartRecoveryOwnerLease;
	let pendingRecovery = void 0;
	let prepared;
	try {
		try {
			prepared = await params.prepare(params.opts);
		} catch (error) {
			if (params.restoreAdmittedRecovery) try {
				pendingRecovery = await restoreAdmittedRecoveryWithRetries(params.restoreAdmittedRecovery);
			} catch (restoreError) {
				log$5.warn(`failed to restore admitted recovery after command preparation: ${formatErrorMessage(restoreError)}`);
				scheduleAdmittedRecoveryRestore(params.restoreAdmittedRecovery);
			}
			throw error;
		}
		const acquired = await claimAgentCommandRecoveryOwner({
			...params,
			prepared
		});
		lease = acquired?.lease;
		refreshPreparedRecoveryOwnerTarget(prepared, acquired);
		return await params.run(prepared);
	} finally {
		try {
			const releasedRecovery = await releaseMainSessionRecoveryOwner(lease);
			pendingRecovery ??= releasedRecovery;
		} catch (error) {
			log$5.warn(`failed to release main-session recovery owner: ${formatErrorMessage(error)}`);
		}
		try {
			await prepared?.runLease?.release();
		} finally {
			scheduleMainSessionRecoveryPendingTarget(pendingRecovery);
		}
	}
}
//#endregion
//#region src/agents/agent-command-restart-recovery.ts
function normalizeOptionalString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function normalizeOptionalThreadId(value) {
	return normalizeOptionalString(value) ?? (typeof value === "number" && Number.isFinite(value) ? String(value) : void 0);
}
function sameDeliveryContext(left, right) {
	return left !== void 0 && right !== void 0 && left.channel === right.channel && left.to === right.to && left.accountId === right.accountId && normalizeOptionalThreadId(left.threadId) === normalizeOptionalThreadId(right.threadId);
}
/** Replace model-selected media with the exact host-owned delivery set. */
function constrainRestartRecoveryDeliveryPayloads(payloads, mediaUrls, suppressText = false) {
	const constrained = [];
	for (const payload of payloads ?? []) {
		const constrainedPayload = {};
		if (!suppressText && typeof payload.text === "string") constrainedPayload.text = payload.text;
		if (payload.isError === true) constrainedPayload.isError = true;
		if (payload.isReasoning === true) constrainedPayload.isReasoning = true;
		if (payload.isCommentary === true) constrainedPayload.isCommentary = true;
		if (payload.isReasoningSnapshot === true) constrainedPayload.isReasoningSnapshot = true;
		if (payload.isCompactionNotice === true) constrainedPayload.isCompactionNotice = true;
		if (payload.isFallbackNotice === true) constrainedPayload.isFallbackNotice = true;
		if (payload.isStatusNotice === true) constrainedPayload.isStatusNotice = true;
		if (Object.keys(constrainedPayload).length > 0) constrained.push(constrainedPayload);
	}
	const exactMediaUrls = Array.from(new Set(mediaUrls.map((url) => url.trim()).filter((url) => url.length > 0)));
	if (exactMediaUrls.length > 0) constrained.push({
		mediaUrls: exactMediaUrls,
		trustedLocalMedia: true
	});
	return constrained;
}
function hasExplicitlyVisiblePayload(payload) {
	if (payload && typeof payload === "object" && !Array.isArray(payload)) {
		const visible = payload.visible;
		if (typeof visible === "boolean") return visible;
	}
	return hasVisibleAgentPayload({ payloads: [payload] }, {
		includeErrorPayloads: false,
		includeReasoningPayloads: false
	});
}
/** Reduce a terminal result to bounded, route-checkable delivery evidence. */
function buildRestartRecoveryTerminalDeliveryEvidence(result) {
	const rawPayloads = Array.isArray(result.payloads) ? result.payloads : void 0;
	const payloads = Array.isArray(rawPayloads) ? rawPayloads.slice(0, 64).map((payload) => {
		const mediaUrls = collectDeliveredMediaUrls({ payloads: [payload] });
		const evidence = { visible: hasExplicitlyVisiblePayload(payload) };
		if (mediaUrls.length > 0) evidence.mediaUrls = mediaUrls;
		return evidence;
	}) : void 0;
	const payloadsTruncated = rawPayloads && rawPayloads.length > 64 ? true : void 0;
	const rawDeliveryStatus = result.deliveryStatus;
	const status = rawDeliveryStatus?.status === "failed" || rawDeliveryStatus?.status === "partial_failed" || rawDeliveryStatus?.status === "sent" || rawDeliveryStatus?.status === "suppressed" ? rawDeliveryStatus.status : void 0;
	const rawPayloadOutcomes = rawDeliveryStatus && typeof rawDeliveryStatus === "object" ? rawDeliveryStatus.payloadOutcomes : void 0;
	const payloadOutcomes = Array.isArray(rawPayloadOutcomes) ? rawPayloadOutcomes.flatMap((outcome) => {
		if (!outcome || typeof outcome !== "object" || Array.isArray(outcome)) return [];
		const record = outcome;
		const outcomeStatus = record.status === "failed" || record.status === "sent" || record.status === "suppressed" ? record.status : void 0;
		if (!outcomeStatus || typeof record.index !== "number" || !Number.isInteger(record.index)) return [];
		return [{
			index: record.index,
			status: outcomeStatus,
			...typeof record.sentBeforeError === "boolean" ? { sentBeforeError: record.sentBeforeError } : {}
		}];
	}) : void 0;
	const errorMessage = normalizeOptionalString(rawDeliveryStatus?.errorMessage);
	const deliveryStatus = status ? {
		status,
		...errorMessage ? { errorMessage } : {},
		...payloadOutcomes?.length ? { payloadOutcomes } : {}
	} : void 0;
	const rawMessagingToolSentTargets = Array.isArray(result.messagingToolSentTargets) ? result.messagingToolSentTargets : void 0;
	const messagingToolSentTargets = rawMessagingToolSentTargets ? rawMessagingToolSentTargets.slice(0, 64).flatMap((target) => {
		if (!target || typeof target !== "object" || Array.isArray(target)) return [];
		const record = target;
		const mediaUrls = collectMessagingToolDeliveredMediaUrls({ messagingToolSentTargets: [record] });
		const evidence = { visible: hasVisibleCommittedMessagingToolDeliveryEvidence({ messagingToolSentTargets: [record] }) };
		const provider = normalizeOptionalString(record.provider);
		const accountId = normalizeOptionalString(record.accountId);
		const to = normalizeOptionalString(record.to);
		const threadId = normalizeOptionalThreadId(record.threadId);
		if (provider) evidence.provider = provider;
		if (accountId) evidence.accountId = accountId;
		if (to) evidence.to = to;
		if (threadId) evidence.threadId = threadId;
		if (record.threadImplicit === true) evidence.threadImplicit = true;
		if (record.threadSuppressed === true) evidence.threadSuppressed = true;
		if (mediaUrls.length > 0) evidence.mediaUrls = mediaUrls;
		return [evidence];
	}) : void 0;
	const messagingToolSentTargetsTruncated = rawMessagingToolSentTargets && rawMessagingToolSentTargets.length > 64 ? true : void 0;
	const messagingToolAggregateEvidenceUnaccounted = hasUnaccountedMessagingToolAggregateEvidence(result) ? true : void 0;
	const restartUnsafeSideEffectsDetected = hasCommittedOutboundDeliveryEvidence(result) || result.didSendDeterministicApprovalPrompt === true ? true : void 0;
	return {
		captured: true,
		...payloads?.length ? { payloads } : {},
		...payloadsTruncated ? { payloadsTruncated } : {},
		...deliveryStatus ? { deliveryStatus } : {},
		...messagingToolSentTargets?.length ? { messagingToolSentTargets } : {},
		...messagingToolSentTargetsTruncated ? { messagingToolSentTargetsTruncated } : {},
		...messagingToolAggregateEvidenceUnaccounted ? { messagingToolAggregateEvidenceUnaccounted } : {},
		...restartUnsafeSideEffectsDetected ? { restartUnsafeSideEffectsDetected } : {}
	};
}
function shouldPersistCurrentRunSessionCleanup(current, sessionId) {
	return current !== void 0 && current.sessionId === sessionId && current.abortedLastRun !== true;
}
function shouldPersistRestartRecoveryContextClaim(current, sessionId, runId, allowCreate) {
	if (!current) return allowCreate;
	if (!shouldPersistCurrentRunSessionCleanup(current, sessionId)) return false;
	return current.restartRecoveryDeliveryRunId === void 0 || current.restartRecoveryDeliveryRunId === runId;
}
function shouldPersistRestartRecoveryCleanup(current, sessionId, runId) {
	return shouldPersistCurrentRunSessionCleanup(current, sessionId) && current?.restartRecoveryDeliveryRunId === runId;
}
function buildCurrentRunRestartRecoveryClaim(params) {
	const adoptsExistingClaim = params.entry.restartRecoveryDeliveryRunId === params.runId;
	if (adoptsExistingClaim && params.deliveryContext !== void 0 && !sameDeliveryContext(params.entry.restartRecoveryDeliveryContext, params.deliveryContext)) throw new Error("restart recovery delivery route changed after the run was claimed");
	const createsTranscriptOnlySourceClaim = params.sourceRunId !== void 0 && params.deliveryContext === void 0;
	const createsScopedDeliveryClaim = params.sourceRunId !== void 0;
	if (!adoptsExistingClaim && createsScopedDeliveryClaim && !params.sourceIngress) throw new Error("restart recovery source ownership is required for a new claim");
	return {
		restartRecoveryDeliveryContext: adoptsExistingClaim ? params.entry.restartRecoveryDeliveryContext : params.deliveryContext,
		restartRecoveryDeliveryMediaUrls: adoptsExistingClaim ? params.entry.restartRecoveryDeliveryMediaUrls : createsScopedDeliveryClaim && params.deliveryMediaUrls !== void 0 ? [...params.deliveryMediaUrls] : void 0,
		restartRecoveryDisableMessageTool: adoptsExistingClaim ? params.entry.restartRecoveryDisableMessageTool : createsScopedDeliveryClaim && params.disableMessageTool === true ? true : void 0,
		restartRecoverySuppressTextDelivery: adoptsExistingClaim ? params.entry.restartRecoverySuppressTextDelivery : createsScopedDeliveryClaim && params.suppressTextDelivery === true ? true : void 0,
		restartRecoveryDeliveryRunId: params.deliveryContext || adoptsExistingClaim || createsTranscriptOnlySourceClaim ? params.runId : void 0,
		restartRecoveryDeliverySourceRunId: adoptsExistingClaim ? params.entry.restartRecoveryDeliverySourceRunId : params.sourceRunId,
		restartRecoverySourceIngress: adoptsExistingClaim ? params.entry.restartRecoverySourceIngress : createsScopedDeliveryClaim ? params.sourceIngress : void 0,
		restartRecoverySourceReplyDeliveryMode: adoptsExistingClaim ? params.entry.restartRecoverySourceReplyDeliveryMode : params.sourceRunId ? params.sourceReplyDeliveryMode : void 0,
		restartRecoveryForceSafeTools: adoptsExistingClaim ? params.entry.restartRecoveryForceSafeTools : createsScopedDeliveryClaim && params.forceRestartSafeTools === true ? true : void 0
	};
}
//#endregion
//#region src/agents/agent-runtime-config.ts
/** Resolves agent runtime config, including SecretRef materialization for agent command use. */
/** Loads runtime/source config and resolves command SecretRefs when the agent path needs them. */
async function resolveAgentRuntimeConfig(runtime, params) {
	const loadedRaw = getRuntimeConfig();
	const includeChannelTargets = params?.runtimeTargetsChannelSecrets === true;
	const channelSecretScope = params?.runtimeChannelSecretScope;
	const hasRuntimeSecretRefs = hasAgentRuntimeSecretRefs({
		config: loadedRaw,
		includeChannelTargets,
		channel: channelSecretScope?.channel
	});
	const sourceConfig = await (async () => {
		try {
			const { snapshot } = await readConfigFileSnapshotForWrite();
			if (snapshot.valid) return snapshot.resolved;
		} catch {}
		return loadedRaw;
	})();
	const cfg = hasRuntimeSecretRefs ? await (async () => {
		const runtimeSecretTargets = resolveAgentRuntimeSecretTargets({
			config: loadedRaw,
			includeChannelTargets,
			channelSecretScope
		});
		return (await (await import("./command-config-resolution.runtime.js")).resolveCommandConfigWithSecrets({
			config: loadedRaw,
			commandName: "agent",
			targetIds: runtimeSecretTargets.targetIds,
			...runtimeSecretTargets.allowedPaths ? { allowedPaths: runtimeSecretTargets.allowedPaths } : {},
			runtime
		})).resolvedConfig;
	})() : loadedRaw;
	const secretsRuntime = await import("./runtime-DtUE6KsA.js");
	if (secretsRuntime.getActiveSecretsRuntimeSnapshot()) setRuntimeConfigSnapshot(cfg, sourceConfig);
	else {
		const snapshot = await secretsRuntime.prepareSecretsRuntimeSnapshot({
			config: sourceConfig,
			assignmentConfig: cfg,
			includeConfigRefs: false
		});
		secretsRuntime.activateSecretsRuntimeSnapshot(snapshot);
	}
	return {
		loadedRaw,
		sourceConfig,
		cfg
	};
}
function hasNestedSecretRef(value) {
	if (isSecretRef(value)) return true;
	if (Array.isArray(value)) return value.some((entry) => hasNestedSecretRef(entry));
	if (!value || typeof value !== "object") return false;
	return Object.values(value).some((entry) => hasNestedSecretRef(entry));
}
function hasAgentRuntimeSecretRefs(params) {
	const { config } = params;
	if (hasNestedSecretRef(config.models?.providers)) return true;
	if (hasNestedSecretRef(config.agents?.defaults?.memorySearch?.remote?.apiKey)) return true;
	if (Array.isArray(config.agents?.list) && config.agents.list.some((agent) => hasNestedSecretRef(agent?.memorySearch?.remote?.apiKey))) return true;
	if (hasNestedSecretRef(config.messages?.tts?.providers)) return true;
	if (hasNestedSecretRef(config.skills?.entries)) return true;
	if (hasNestedSecretRef(config.tools?.web?.search)) return true;
	if (config.plugins?.entries && Object.values(config.plugins.entries).some((entry) => hasNestedSecretRef({
		webSearch: entry?.config?.webSearch,
		webFetch: entry?.config?.webFetch
	}))) return true;
	if (params.includeChannelTargets) return hasNestedSecretRef(config.channels);
	if (!params.channel) return false;
	return hasNestedSecretRef(config.channels?.[params.channel]);
}
function resolveAgentRuntimeSecretTargets(params) {
	const baseTargetIds = getAgentRuntimeCommandSecretTargetIds({ includeChannelTargets: params.includeChannelTargets });
	if (params.includeChannelTargets || !params.channelSecretScope) return { targetIds: baseTargetIds };
	const channelTargets = getScopedChannelsCommandSecretTargets({
		config: params.config,
		channel: params.channelSecretScope.channel,
		accountId: params.channelSecretScope.accountId,
		defaultAccountWhenMissing: true
	});
	const targetIds = new Set(baseTargetIds);
	for (const targetId of channelTargets.targetIds) targetIds.add(targetId);
	if (!channelTargets.allowedPaths) return { targetIds };
	const allowedPaths = new Set(channelTargets.allowedPaths);
	for (const target of discoverConfigSecretTargetsByIds(params.config, baseTargetIds)) allowedPaths.add(target.path);
	return {
		targetIds,
		allowedPaths
	};
}
//#endregion
//#region src/agents/command/lifecycle.ts
const log$4 = createSubsystemLogger("agents/agent-command");
function resolveTerminalLogLevel(outcome) {
	if (!outcome.stopReason || outcome.stopReason === "end_turn") return;
	if (outcome.reason === "completed") return "info";
	return outcome.status === "timeout" ? "warn" : "error";
}
function applyAgentRunAbortMetadata(result, signal) {
	const abortFields = resolveAgentRunAbortLifecycleFields(signal);
	if (abortFields.aborted !== true) return result;
	return {
		...result,
		meta: {
			...result.meta,
			...abortFields
		}
	};
}
function createAgentCommandLifecycle(params) {
	let lifecycleFinishingEmitted = false;
	const resolveResultError = (runResult, includeErrorPayload) => params.state.lifecycleError ?? (includeErrorPayload ? runResult.payloads?.find((payload) => payload.isError === true && typeof payload.text === "string")?.text : void 0) ?? (runResult.meta.error ? "Agent run failed" : void 0);
	return {
		emitFinishing(terminal) {
			if (params.state.lifecycleEnded || params.state.lifecycleFinishing || lifecycleFinishingEmitted) return;
			lifecycleFinishingEmitted = true;
			params.state.lifecycleFinishing = true;
			emitAgentEvent({
				runId: params.runId,
				lifecycleGeneration: params.lifecycleGeneration(),
				stream: "lifecycle",
				data: {
					phase: "finishing",
					startedAt: params.startedAt,
					endedAt: Date.now(),
					aborted: terminal.metadata.aborted ?? false,
					stopReason: terminal.outcome.stopReason,
					...resolveAgentRunAbortLifecycleFields(params.abortSignal)
				}
			});
		},
		emitEnd(terminal) {
			if (params.state.lifecycleEnded) return;
			params.state.lifecycleEnded = true;
			const stopReason = terminal.outcome.stopReason;
			const logLevel = resolveTerminalLogLevel(terminal.outcome);
			if (logLevel) log$4[logLevel](`[agent] run ${params.runId} ended with stopReason=${stopReason}`);
			emitAgentEvent({
				runId: params.runId,
				lifecycleGeneration: params.lifecycleGeneration(),
				stream: "lifecycle",
				data: {
					phase: "end",
					startedAt: params.startedAt,
					endedAt: Date.now(),
					aborted: terminal.metadata.aborted ?? false,
					stopReason,
					...resolveAgentRunAbortLifecycleFields(params.abortSignal)
				}
			});
		},
		resolveResultError,
		emitResultError(runResult, fallbackExhausted, terminal) {
			if (params.state.lifecycleEnded) return;
			params.state.lifecycleEnded = true;
			const error = resolveResultError(runResult, fallbackExhausted) ?? (fallbackExhausted ? "All model fallback candidates failed" : "Agent run failed");
			emitAgentEvent({
				runId: params.runId,
				lifecycleGeneration: params.lifecycleGeneration(),
				stream: "lifecycle",
				data: {
					phase: "error",
					startedAt: params.startedAt,
					endedAt: Date.now(),
					error,
					...terminal.metadata,
					...fallbackExhausted ? { fallbackExhaustedFailure: true } : {}
				}
			});
		},
		emitPostTurnError(error) {
			if (params.state.lifecycleEnded) return;
			params.state.lifecycleEnded = true;
			emitAgentEvent({
				runId: params.runId,
				lifecycleGeneration: params.lifecycleGeneration(),
				stream: "lifecycle",
				data: {
					phase: "error",
					startedAt: params.startedAt,
					endedAt: Date.now(),
					error: error instanceof Error ? error.message : "Agent run failed",
					...resolveAgentRunErrorLifecycleFields(error, params.abortSignal)
				}
			});
		}
	};
}
//#endregion
//#region src/agents/command/runtime-loaders.ts
const attemptExecutionRuntimeLoader = createLazyImportLoader(() => import("./attempt-execution.runtime.js"));
const acpManagerRuntimeLoader = createLazyImportLoader(() => import("./acp/control-plane/manager.js"));
const acpPolicyRuntimeLoader = createLazyImportLoader(() => import("./policy-RWMrdSFD.js"));
const acpRuntimeErrorsRuntimeLoader = createLazyImportLoader(() => import("./errors-ZwGWzN3T.js"));
const acpSessionIdentifiersRuntimeLoader = createLazyImportLoader(() => import("./acp-core/runtime/session-identifiers.js"));
const deliveryRuntimeLoader = createLazyImportLoader(() => import("./delivery.runtime.js"));
const sessionStoreRuntimeLoader = createLazyImportLoader(() => import("./session-store.runtime.js"));
const cliCompactionRuntimeLoader = createLazyImportLoader(() => import("./cli-compaction-DLxHLMNK.js"));
const transcriptResolveRuntimeLoader = createLazyImportLoader(() => import("./transcript-resolve.runtime.js"));
const cliDepsRuntimeLoader = createLazyImportLoader(() => import("./deps-DQk7Hb-k.js"));
const execDefaultsRuntimeLoader = createLazyImportLoader(() => import("./exec-defaults-li2FbRYp.js"));
const skillsRuntimeLoader = createLazyImportLoader(async () => {
	const [remote, sessionSnapshot] = await Promise.all([import("./remote-B2kp4CK-.js"), import("./session-snapshot-B-UsXPgX.js")]);
	return {
		getRemoteSkillEligibility: remote.getRemoteSkillEligibility,
		resolveReusableWorkspaceSkillSnapshot: sessionSnapshot.resolveReusableWorkspaceSkillSnapshot
	};
});
function loadAttemptExecutionRuntime() {
	return attemptExecutionRuntimeLoader.load();
}
function loadAcpManagerRuntime() {
	return acpManagerRuntimeLoader.load();
}
function loadAcpPolicyRuntime() {
	return acpPolicyRuntimeLoader.load();
}
function loadAcpRuntimeErrorsRuntime() {
	return acpRuntimeErrorsRuntimeLoader.load();
}
function loadAcpSessionIdentifiersRuntime() {
	return acpSessionIdentifiersRuntimeLoader.load();
}
function loadDeliveryRuntime() {
	return deliveryRuntimeLoader.load();
}
function loadSessionStoreRuntime() {
	return sessionStoreRuntimeLoader.load();
}
function loadCliCompactionRuntime() {
	return cliCompactionRuntimeLoader.load();
}
function loadTranscriptResolveRuntime() {
	return transcriptResolveRuntimeLoader.load();
}
function loadExecDefaultsRuntime() {
	return execDefaultsRuntimeLoader.load();
}
function loadSkillsRuntime() {
	return skillsRuntimeLoader.load();
}
async function resolveAgentCommandDeps(deps) {
	if (deps) return deps;
	const { createDefaultDeps } = await cliDepsRuntimeLoader.load();
	return createDefaultDeps();
}
//#endregion
//#region src/agents/command/attempt-execution.shared.ts
/**
* Shared session persistence and prompt-body helpers for agent attempt
* execution paths.
*/
/** Persists one session entry while keeping the caller's in-memory store aligned. */
async function persistSessionEntry$1(params) {
	let rejectedMissingEntry = false;
	const persisted = await patchSessionEntry({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, (_entry, context) => {
		const shouldPersistCurrent = params.shouldPersist?.(context.existingEntry);
		if (!context.existingEntry && shouldPersistCurrent !== true) {
			rejectedMissingEntry = true;
			return null;
		}
		if (shouldPersistCurrent === false) {
			rejectedMissingEntry = !context.existingEntry;
			return null;
		}
		if (!context.existingEntry) return params.entry;
		if (context.existingEntry.sessionId !== params.initialEntry.sessionId) return null;
		return mergeSessionSnapshotChanges({
			initial: params.initialEntry,
			next: params.entry,
			current: context.existingEntry
		});
	}, {
		fallbackEntry: params.sessionStore[params.sessionKey] ?? params.entry,
		replaceEntry: true
	});
	if (rejectedMissingEntry) {
		delete params.sessionStore[params.sessionKey];
		return;
	}
	if (persisted) params.sessionStore[params.sessionKey] = persisted;
	else delete params.sessionStore[params.sessionKey];
	return persisted ?? void 0;
}
/** Prepends hidden internal event context unless the body already carries it. */
function prependInternalEventContext(body, events) {
	if (hasInternalRuntimeContext(body)) return body;
	const renderedEvents = formatAgentInternalEventsForPrompt(events);
	if (!renderedEvents) return body;
	return [renderedEvents, body].filter(Boolean).join("\n\n");
}
function resolvePlainInternalEventBody(body, events) {
	const renderedEvents = formatAgentInternalEventsForPlainPrompt(events);
	if (!renderedEvents) return body;
	return [renderedEvents, stripInternalRuntimeContext(body).trim()].filter(Boolean).join("\n\n") || body;
}
/** Resolves the prompt body submitted to ACP runtimes. */
function resolveAcpPromptBody(body, events) {
	return events?.length ? resolvePlainInternalEventBody(body, events) : body;
}
/** Resolves the body stored in transcripts after internal event rendering. */
function resolveInternalEventTranscriptBody(body, events) {
	if (!hasInternalRuntimeContext(body)) return body;
	return resolvePlainInternalEventBody(body, events);
}
//#endregion
//#region src/agents/command/session-helpers.ts
async function persistSessionEntry(params) {
	return await persistSessionEntry$1(params);
}
function clearPendingFinalDeliveryFields(entry, updatedAt) {
	return {
		...entry,
		pendingFinalDelivery: void 0,
		pendingFinalDeliveryText: void 0,
		pendingFinalDeliveryCreatedAt: void 0,
		pendingFinalDeliveryLastAttemptAt: void 0,
		pendingFinalDeliveryAttemptCount: void 0,
		pendingFinalDeliveryLastError: void 0,
		pendingFinalDeliveryContext: void 0,
		pendingFinalDeliveryIntentId: void 0,
		restartRecoveryForceSafeTools: void 0,
		restartRecoveryDeliveryMediaUrls: void 0,
		restartRecoveryDisableMessageTool: void 0,
		restartRecoverySuppressTextDelivery: void 0,
		updatedAt
	};
}
async function prepareCurrentRunDelivery(params) {
	const { cfg, opts, sessionEntry } = params;
	if (opts.deliver !== true) return;
	const buildPlan = async (requestedChannel) => await resolveAgentDeliveryPlanWithSessionRoute({
		cfg,
		agentId: params.agentId,
		currentSessionKey: params.currentSessionKey,
		sessionEntry,
		requestedChannel,
		explicitTo: opts.replyTo ?? opts.to,
		explicitThreadId: opts.threadId,
		accountId: opts.replyAccountId ?? opts.accountId,
		wantsDelivery: true,
		turnSourceChannel: opts.runContext?.messageChannel ?? opts.messageChannel,
		turnSourceTo: opts.runContext?.currentChannelId ?? opts.to,
		turnSourceAccountId: opts.runContext?.accountId ?? opts.accountId,
		turnSourceThreadId: opts.runContext?.currentThreadTs ?? opts.threadId
	});
	let deliveryPlan = await buildPlan(opts.replyChannel ?? opts.channel);
	const explicitChannelHint = normalizeOptionalString$1(opts.replyChannel ?? opts.channel);
	const explicitThreadId = opts.threadId != null && opts.threadId !== "" ? opts.threadId : void 0;
	if (deliveryPlan.resolvedChannel === "webchat" && !explicitChannelHint) deliveryPlan = await buildPlan((await resolveMessageChannelSelection({ cfg })).channel);
	if (deliveryPlan.targetResolutionError) throw deliveryPlan.targetResolutionError;
	if (!isDeliverableMessageChannel(deliveryPlan.resolvedChannel)) throw new Error("delivery channel is required: pass --channel/--reply-channel or use a main session with a previous channel");
	const targetMode = opts.deliveryTargetMode ?? deliveryPlan.deliveryTargetMode ?? (opts.replyTo ?? opts.to ? "explicit" : "implicit");
	const resolved = resolveAgentOutboundTarget({
		cfg,
		plan: deliveryPlan,
		targetMode,
		validateExplicitTarget: true
	});
	if (resolved.resolvedTarget && !resolved.resolvedTarget.ok) throw resolved.resolvedTarget.error;
	const resolvedTo = resolved.resolvedTo;
	if (!resolvedTo) throw new Error(`delivery target is required for ${deliveryPlan.resolvedChannel}`);
	const threadId = targetMode === "explicit" ? explicitThreadId ?? (deliveryPlan.baseDelivery.threadIdSource === "explicit" ? deliveryPlan.resolvedThreadId : void 0) : deliveryPlan.resolvedThreadId;
	const context = normalizeDeliveryContext({
		channel: deliveryPlan.resolvedChannel,
		to: resolvedTo,
		accountId: deliveryPlan.resolvedAccountId,
		threadId
	});
	return context ? {
		context,
		targetMode
	} : void 0;
}
function createAgentCommandSessionWorkingCopy(params) {
	const result = {};
	if (params.sessionEntry) result.sessionEntry = { ...params.sessionEntry };
	if (params.sessionStore || params.sessionKey) result.sessionStore = {};
	if (params.sessionKey && result.sessionEntry && result.sessionStore) result.sessionStore[params.sessionKey] = result.sessionEntry;
	return result;
}
function resolveInternalSessionEffectsSource(params) {
	if (!params.storePath || !params.sessionKey) return;
	return {
		agentId: params.agentId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	};
}
//#endregion
//#region src/agents/command/acp-execution.ts
const log$3 = createSubsystemLogger("agents/agent-command");
async function runAcpAgentCommand(params) {
	const attemptExecutionRuntime = await loadAttemptExecutionRuntime();
	const acpToolTracker = attemptExecutionRuntime.createAcpToolLifecycleTracker();
	const startedAt = Date.now();
	registerAgentRunContext(params.runId, {
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.sessionAgentId,
		lifecycleGeneration: params.lifecycleGeneration,
		...params.suppressVisibleSessionEffects ? { isControlUiVisible: false } : {}
	});
	attemptExecutionRuntime.emitAcpLifecycleStart({
		runId: params.runId,
		startedAt,
		agentId: params.sessionAgentId,
		lifecycleGeneration: params.lifecycleGeneration
	});
	const visibleTextAccumulator = attemptExecutionRuntime.createAcpVisibleTextAccumulator();
	let stopReason;
	let resultStatus;
	let terminalOutcome;
	try {
		const { resolveAcpAgentPolicyError, resolveAcpDispatchPolicyError, resolveAcpExplicitTurnPolicyError } = await loadAcpPolicyRuntime();
		const turnPolicyError = params.opts.acpTurnSource === "manual_spawn" ? resolveAcpExplicitTurnPolicyError(params.cfg) : resolveAcpDispatchPolicyError(params.cfg);
		if (turnPolicyError) {
			terminalOutcome = "blocked";
			throw turnPolicyError;
		}
		const acpAgent = normalizeAgentId(params.acpResolution.meta.agent || resolveAgentIdFromSessionKey(params.sessionKey));
		const agentPolicyError = resolveAcpAgentPolicyError(params.cfg, acpAgent);
		if (agentPolicyError) {
			terminalOutcome = "blocked";
			throw agentPolicyError;
		}
		const acpImageAttachments = resolveInlineAgentImageAttachments(params.opts.images);
		assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
		await params.acpManager.runTurn({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			provenance: params.provenance,
			text: params.body,
			attachments: acpImageAttachments.length > 0 ? acpImageAttachments : void 0,
			mode: "prompt",
			requestId: params.runId,
			signal: params.opts.abortSignal,
			onLifecycle: (event) => {
				if (event.type === "prompt_submitted") attemptExecutionRuntime.emitAcpPromptSubmitted({
					runId: params.runId,
					sessionKey: params.sessionKey,
					at: event.at
				});
			},
			onEvent: (event) => {
				if (event.type !== "text_delta") attemptExecutionRuntime.emitAcpRuntimeEvent({
					runId: params.runId,
					toolTracker: acpToolTracker,
					sessionKey: params.sessionKey,
					agentId: params.sessionAgentId,
					abortSignal: params.opts.abortSignal,
					event
				});
				if (event.type === "done") {
					stopReason = event.stopReason;
					resultStatus = event.status;
					return;
				}
				if (event.type !== "text_delta" || event.stream && event.stream !== "output" || !event.text) return;
				const visibleUpdate = visibleTextAccumulator.consume(event.text);
				if (visibleUpdate) attemptExecutionRuntime.emitAcpAssistantDelta({
					runId: params.runId,
					text: visibleUpdate.text,
					delta: visibleUpdate.delta
				});
			}
		});
		if (isAgentRunRestartAbortReason(params.opts.abortSignal?.reason)) throw params.opts.abortSignal?.reason;
	} catch (error) {
		const { toAcpRuntimeError } = await loadAcpRuntimeErrorsRuntime();
		const acpError = toAcpRuntimeError({
			error,
			fallbackCode: "ACP_TURN_FAILED",
			fallbackMessage: "ACP turn failed before completion."
		});
		attemptExecutionRuntime.emitAcpLifecycleError({
			runId: params.runId,
			toolTracker: acpToolTracker,
			error: acpError,
			sessionKey: params.sessionKey,
			agentId: params.sessionAgentId,
			lifecycleGeneration: params.lifecycleGeneration,
			abortSignal: params.opts.abortSignal,
			...terminalOutcome ? { terminalOutcome } : {}
		});
		throw acpError;
	}
	const finalTextRaw = visibleTextAccumulator.finalizeRaw();
	const finalText = visibleTextAccumulator.finalize();
	let sessionEntry = params.sessionEntry;
	try {
		const { resolveAcpSessionCwd } = await loadAcpSessionIdentifiersRuntime();
		const internalSource = params.suppressVisibleSessionEffects ? resolveInternalSessionEffectsSource({
			agentId: params.sessionAgentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}) : void 0;
		const internalTarget = params.suppressVisibleSessionEffects ? await prepareInternalSessionEffectsSession({
			agentId: params.sessionAgentId,
			cwd: resolveAcpSessionCwd(params.acpResolution.meta) ?? params.workspaceDir,
			runId: params.runId,
			source: internalSource,
			storePath: params.storePath
		}) : void 0;
		params.trackInternalModelRunTarget(internalTarget);
		const transcriptResult = await attemptExecutionRuntime.persistAcpTurnTranscript({
			body: params.body,
			transcriptBody: params.transcriptBody,
			...params.opts.suppressPromptPersistence !== true && params.opts.transcriptMedia?.length ? { userInput: {
				text: params.transcriptBody,
				media: params.opts.transcriptMedia
			} } : {},
			finalText: finalTextRaw,
			sessionId: internalTarget?.sessionId ?? params.sessionId,
			sessionKey: internalTarget?.sessionKey ?? params.sessionKey,
			sessionEntry: internalTarget?.sessionEntry ?? sessionEntry,
			sessionStore: params.suppressVisibleSessionEffects ? void 0 : params.sessionStore,
			storePath: internalTarget?.storePath ?? params.storePath,
			sessionAgentId: internalTarget?.agentId ?? params.sessionAgentId,
			threadId: params.opts.threadId,
			sessionCwd: resolveAcpSessionCwd(params.acpResolution.meta) ?? params.workspaceDir,
			config: params.cfg
		});
		if (!internalTarget) sessionEntry = transcriptResult.sessionEntry;
	} catch (error) {
		log$3.warn(`ACP transcript persistence failed for ${params.sessionKey}: ${formatErrorMessage(error)}`);
	}
	const restartAbortReason = params.opts.abortSignal?.reason;
	if (isAgentRunRestartAbortReason(restartAbortReason)) {
		attemptExecutionRuntime.emitAcpLifecycleError({
			runId: params.runId,
			toolTracker: acpToolTracker,
			error: restartAbortReason,
			sessionKey: params.sessionKey,
			agentId: params.sessionAgentId,
			lifecycleGeneration: params.lifecycleGeneration,
			abortSignal: params.opts.abortSignal
		});
		throw restartAbortReason;
	}
	attemptExecutionRuntime.emitAcpLifecycleEnd({
		runId: params.runId,
		toolTracker: acpToolTracker,
		agentId: params.sessionAgentId,
		lifecycleGeneration: params.lifecycleGeneration,
		abortSignal: params.opts.abortSignal,
		stopReason,
		resultStatus
	});
	const result = applyAgentRunAbortMetadata(attemptExecutionRuntime.buildAcpResult({
		payloadText: finalText,
		startedAt,
		stopReason,
		resultStatus,
		abortSignal: params.opts.abortSignal
	}), params.opts.abortSignal);
	const { deliverAgentCommandResult } = await loadDeliveryRuntime();
	return await deliverAgentCommandResult({
		cfg: params.cfg,
		deps: params.deps,
		runtime: params.runtime,
		opts: params.opts,
		outboundSession: params.outboundSession,
		sessionEntry,
		result,
		payloads: result.payloads,
		assertDeliveryCurrent: () => assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration)
	});
}
//#endregion
//#region src/agents/command/ingress-diagnostics.ts
/** Resolve the channel label for model.usage diagnostics from ingress run options. */
function ingressDiagnosticChannel(opts) {
	return opts.runContext?.messageChannel ?? opts.messageChannel ?? opts.channel ?? "http";
}
/** Emit the ingress-only model usage diagnostic after a completed agent run. */
function emitIngressModelUsageDiagnostic(result, opts) {
	const cfg = getRuntimeConfig();
	if (!isDiagnosticsEnabled(cfg)) return;
	const agentMeta = result.meta?.agentMeta;
	const usage = agentMeta?.usage;
	if (!agentMeta || !hasNonzeroUsage(usage)) return;
	const providerUsed = agentMeta.provider ?? "";
	const modelUsed = agentMeta.model ?? "";
	const input = usage.input ?? 0;
	const output = usage.output ?? 0;
	const cacheRead = usage.cacheRead ?? 0;
	const cacheWrite = usage.cacheWrite ?? 0;
	const usagePromptTokens = input + cacheRead + cacheWrite;
	const totalTokens = usage.total ?? usagePromptTokens + output;
	const hasBillableUsageBuckets = usage.input !== void 0 || usage.output !== void 0 || usage.cacheRead !== void 0 || usage.cacheWrite !== void 0;
	const costConfig = resolveModelCostConfig({
		provider: providerUsed,
		model: modelUsed,
		config: cfg
	});
	const costUsd = hasBillableUsageBuckets ? estimateUsageCost({
		usage,
		cost: costConfig
	}) : void 0;
	emitTrustedDiagnosticEvent({
		type: "model.usage",
		sessionKey: opts.sessionKey,
		sessionId: agentMeta.sessionId,
		channel: ingressDiagnosticChannel(opts),
		agentId: opts.agentId,
		provider: providerUsed,
		model: modelUsed,
		usage: {
			input,
			output,
			cacheRead,
			cacheWrite,
			promptTokens: usagePromptTokens,
			total: totalTokens
		},
		lastCallUsage: agentMeta.lastCallUsage,
		context: {
			limit: agentMeta.contextTokens,
			...agentMeta.promptTokens !== void 0 ? { used: agentMeta.promptTokens } : {}
		},
		costUsd,
		durationMs: result.meta?.durationMs
	});
}
//#endregion
//#region src/agents/command/model-ref.ts
function hasExactConfiguredProviderModel(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	const model = params.model.trim();
	if (!normalizedProvider || !model) return false;
	for (const [providerId, providerConfig] of Object.entries(params.cfg.models?.providers ?? {})) {
		if (normalizeProviderId(providerId) !== normalizedProvider) continue;
		return (providerConfig.models ?? []).some((entry) => entry.id.trim() === model);
	}
	return false;
}
function hasConfiguredProvider(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	if (!normalizedProvider) return false;
	return Object.keys(params.cfg.models?.providers ?? {}).some((providerId) => normalizeProviderId(providerId) === normalizedProvider);
}
function allowPluginModelNormalizationForRef(params) {
	if (!normalizePluginsConfig(params.cfg.plugins).enabled && hasConfiguredProvider(params)) return false;
	return !hasExactConfiguredProviderModel(params);
}
function normalizeAgentCommandModelRef(cfg, provider, model, modelManifestContext) {
	return normalizeModelRef(provider, model, {
		...modelManifestContext,
		allowPluginNormalization: allowPluginModelNormalizationForRef({
			cfg,
			provider,
			model
		})
	});
}
function normalizeAgentCommandDefaultModelRef(cfg, provider, model, modelManifestContext) {
	const normalizedProvider = normalizeProviderId(provider);
	if (hasConfiguredProvider({
		cfg,
		provider: normalizedProvider
	})) return {
		provider: normalizedProvider,
		model: normalizeConfiguredProviderCatalogModelId(normalizedProvider, model, { manifestPlugins: modelManifestContext.manifestPlugins })
	};
	return normalizeAgentCommandModelRef(cfg, provider, model, modelManifestContext);
}
function parseAgentCommandModelRef(cfg, raw, defaultProvider, modelManifestContext) {
	const parsed = resolveModelRefFromString({
		cfg,
		raw,
		defaultProvider,
		aliasIndex: buildModelAliasIndex({
			cfg,
			defaultProvider,
			...modelManifestContext,
			allowPluginNormalization: false
		}),
		...modelManifestContext,
		allowPluginNormalization: false
	})?.ref;
	return parsed ? normalizeAgentCommandModelRef(cfg, parsed.provider, parsed.model, modelManifestContext) : null;
}
//#endregion
//#region src/agents/command/prepare.ts
const OVERRIDE_VALUE_MAX_LENGTH = 256;
function containsControlCharacters(value) {
	for (const char of value) {
		const code = char.codePointAt(0);
		if (code === void 0) continue;
		if (code <= 31 || code >= 127 && code <= 159) return true;
	}
	return false;
}
function normalizeExplicitOverrideInput(raw, kind) {
	const trimmed = raw.trim();
	const label = kind === "provider" ? "Provider" : "Model";
	if (!trimmed) throw new Error(`${label} override must be non-empty.`);
	if (trimmed.length > OVERRIDE_VALUE_MAX_LENGTH) throw new Error(`${label} override exceeds ${String(OVERRIDE_VALUE_MAX_LENGTH)} characters.`);
	if (containsControlCharacters(trimmed)) throw new Error(`${label} override contains invalid control characters.`);
	return trimmed;
}
function resolveExplicitAgentCommandSessionKey(params) {
	if (isUnscopedSessionKeySentinel(params.rawExplicitSessionKey) && !params.agentIdOverride && !params.shouldScopeDefaultAgentKey) return params.rawExplicitSessionKey;
	return scopeLegacySessionKeyToAgent({
		agentId: params.agentIdOverride ?? (params.shouldScopeDefaultAgentKey ? resolveDefaultAgentId(params.cfg) : void 0),
		sessionKey: params.rawExplicitSessionKey,
		mainKey: params.cfg.session?.mainKey
	});
}
async function prepareAgentCommandExecution(opts, runtime) {
	const isRawModelRun = opts.modelRun === true || opts.promptMode === "none";
	const message = opts.message ?? "";
	if (!message.trim()) throw new Error("Message (--message) is required");
	const rawExplicitSessionKey = opts.sessionKey?.trim();
	const requestedSessionId = opts.sessionId?.trim() || void 0;
	const rawTo = opts.to?.trim();
	const toSessionKey = !rawExplicitSessionKey && !requestedSessionId && classifySessionKeyShape(rawTo) === "agent" ? rawTo : void 0;
	const recipientChannel = resolveMessageChannel(opts.channel);
	const shouldResolveExplicitRecipientSession = Boolean(!rawExplicitSessionKey && !requestedSessionId && !toSessionKey && opts.agentId?.trim() && recipientChannel && isDeliverableMessageChannel(recipientChannel) && rawTo);
	if (!opts.to && !requestedSessionId && !rawExplicitSessionKey && !opts.agentId) throw new Error("Pass --to <E.164>, --session-key, --session-id, or --agent to choose a session");
	const { cfg } = await resolveAgentRuntimeConfig(runtime, {
		runtimeTargetsChannelSecrets: opts.deliver === true,
		runtimeChannelSecretScope: opts.deliver !== true && shouldResolveExplicitRecipientSession && recipientChannel ? {
			channel: recipientChannel,
			accountId: opts.accountId
		} : void 0
	});
	const normalizedSpawned = normalizeSpawnedRunMetadata({
		spawnedBy: opts.spawnedBy,
		groupId: opts.groupId,
		groupChannel: opts.groupChannel,
		groupSpace: opts.groupSpace,
		workspaceDir: opts.workspaceDir
	});
	const agentIdOverrideRaw = opts.agentId?.trim();
	const agentIdOverride = agentIdOverrideRaw ? normalizeAgentId(agentIdOverrideRaw) : void 0;
	if (agentIdOverride) {
		if (!listAgentIds(cfg).includes(agentIdOverride)) throw new Error(`Unknown agent id "${agentIdOverrideRaw}". Use "${formatCliCommand("openclaw agents list")}" to see configured agents.`);
	}
	const shouldScopeDefaultAgentKey = Boolean(rawExplicitSessionKey && !agentIdOverride && classifySessionKeyShape(rawExplicitSessionKey) === "legacy_or_alias" && !isUnscopedSessionKeySentinel(rawExplicitSessionKey));
	const explicitSessionKey = toSessionKey ?? resolveExplicitAgentCommandSessionKey({
		rawExplicitSessionKey,
		agentIdOverride,
		shouldScopeDefaultAgentKey,
		cfg
	});
	if (explicitSessionKey && classifySessionKeyShape(explicitSessionKey) === "malformed_agent") throw new Error(`Invalid --session-key "${explicitSessionKey}". Agent-prefixed session keys must use agent:<agent-id>:<session-key>.`);
	if (agentIdOverride && explicitSessionKey && classifySessionKeyShape(explicitSessionKey) === "agent") {
		const sessionAgentId = resolveAgentIdFromSessionKey(explicitSessionKey);
		if (sessionAgentId !== agentIdOverride) throw new Error(`Agent id "${agentIdOverrideRaw}" does not match session key agent "${sessionAgentId}".`);
	}
	const agentCfg = cfg.agents?.defaults;
	const verboseOverride = normalizeVerboseLevel(opts.verbose);
	if (opts.verbose && !verboseOverride) throw new Error("Invalid verbose level. Use \"on\", \"full\", or \"off\".");
	const isSubagentLane = (normalizeOptionalString$1(opts.lane) ?? "") === AGENT_LANE_SUBAGENT;
	const hasExplicitTimeoutOption = opts.timeout !== void 0;
	const timeoutSecondsRaw = hasExplicitTimeoutOption ? parseStrictNonNegativeInteger(opts.timeout) ?? NaN : isSubagentLane ? 0 : void 0;
	if (timeoutSecondsRaw !== void 0 && (Number.isNaN(timeoutSecondsRaw) || timeoutSecondsRaw < 0)) throw new Error("--timeout must be a non-negative integer (seconds; 0 means no timeout)");
	const timeoutMs = resolveAgentTimeoutMs({
		cfg,
		overrideSeconds: timeoutSecondsRaw
	});
	const runTimeoutOverrideMs = hasExplicitTimeoutOption ? timeoutMs : void 0;
	const selectedCommandOpts = toSessionKey ? {
		...opts,
		to: void 0,
		sessionKey: explicitSessionKey
	} : opts;
	const explicitRecipientSession = shouldResolveExplicitRecipientSession && agentIdOverride && recipientChannel && rawTo ? await resolveAgentExplicitRecipientSession({
		cfg,
		agentId: agentIdOverride,
		channel: recipientChannel,
		to: rawTo,
		accountId: selectedCommandOpts.accountId,
		threadId: selectedCommandOpts.threadId
	}) : void 0;
	if (explicitRecipientSession?.error) throw explicitRecipientSession.error;
	const commandOpts = explicitRecipientSession?.sessionKey ? {
		...selectedCommandOpts,
		channel: explicitRecipientSession.channel,
		to: explicitRecipientSession.to,
		accountId: explicitRecipientSession.accountId,
		threadId: explicitRecipientSession.threadId
	} : selectedCommandOpts;
	const sessionResolution = resolveSession({
		cfg,
		to: commandOpts.to,
		sessionId: commandOpts.sessionId,
		sessionKey: explicitSessionKey ?? explicitRecipientSession?.sessionKey,
		agentId: agentIdOverride,
		clone: false
	});
	const { sessionId, sessionKey, storePath, isNewSession, previousSessionId, persistedThinking, persistedVerbose } = sessionResolution;
	const harnessSessionError = sessionKey ? resolveAgentHarnessSessionContextError(sessionKey, sessionResolution.sessionEntry) : void 0;
	if (harnessSessionError) throw new Error(harnessSessionError);
	if ((opts.modelRun === true || opts.promptMode === "none") && sessionKey && sessionResolution.sessionEntry?.modelSelectionLocked === true) throw new Error(AGENT_HARNESS_MODEL_RUN_FORBIDDEN_MESSAGE);
	const { sessionEntry: sessionEntryRaw, sessionStore } = createAgentCommandSessionWorkingCopy({
		sessionKey,
		sessionEntry: sessionResolution.sessionEntry,
		sessionStore: sessionResolution.sessionStore
	});
	const sessionAgentId = agentIdOverride ?? resolveSessionAgentId({
		sessionKey: sessionKey ?? explicitSessionKey,
		config: cfg
	});
	const outboundSession = buildOutboundSessionContext({
		cfg,
		agentId: sessionAgentId,
		sessionKey
	});
	const workspaceDirRaw = normalizedSpawned.workspaceDir ?? resolveAgentWorkspaceDir(cfg, sessionAgentId);
	const workspaceDir = resolveUserPath(workspaceDirRaw);
	const cwd = normalizeOptionalString$1(opts.cwd) ?? normalizeOptionalString$1(sessionEntryRaw?.spawnedCwd);
	const agentDir = resolveAgentDir(cfg, sessionAgentId);
	const pluginsEnabled = normalizePluginsConfig(cfg.plugins).enabled;
	const manifestMetadataSnapshot = pluginsEnabled ? loadManifestMetadataSnapshot({
		config: cfg,
		workspaceDir,
		env: process.env
	}) : void 0;
	const modelManifestContext = { manifestPlugins: manifestMetadataSnapshot?.plugins ?? [] };
	const configuredModel = resolveConfiguredModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowPluginNormalization: pluginsEnabled,
		...modelManifestContext
	});
	const configuredThinkingCatalog = buildConfiguredModelCatalog({
		cfg,
		workspaceDir,
		...modelManifestContext
	});
	const configuredThinkingRuntime = resolveEffectiveAgentRuntime({
		cfg,
		provider: configuredModel.provider,
		modelId: configuredModel.model,
		agentId: sessionAgentId,
		sessionKey,
		sessionEntry: sessionEntryRaw
	});
	const thinkingLevelsHint = formatThinkingLevels(configuredModel.provider, configuredModel.model, ", ", configuredThinkingCatalog.length > 0 ? configuredThinkingCatalog : void 0, configuredThinkingRuntime);
	const thinkOverride = normalizeThinkLevel(opts.thinking);
	const thinkOnce = normalizeThinkLevel(opts.thinkingOnce);
	if (opts.thinking && !thinkOverride) throw new Error(`Invalid thinking level. Use one of: ${thinkingLevelsHint}.`);
	if (opts.thinkingOnce && !thinkOnce) throw new Error(`Invalid one-shot thinking level. Use one of: ${thinkingLevelsHint}.`);
	const resolvedCwd = cwd ? resolveUserPath(cwd) : void 0;
	const worktreeId = await resolveWorktreeIdForPath({
		sessionEntry: sessionEntryRaw,
		candidatePaths: [resolvedCwd ?? workspaceDir, workspaceDir]
	});
	const runLease = worktreeId ? await acquireWorktreeRunLease(worktreeId) : void 0;
	try {
		await ensureAgentWorkspace({
			dir: workspaceDirRaw,
			ensureBootstrapFiles: !agentCfg?.skipBootstrap,
			skipOptionalBootstrapFiles: agentCfg?.skipOptionalBootstrapFiles
		});
		const runId = opts.runId?.trim() || sessionId;
		const { getAcpSessionManager } = await loadAcpManagerRuntime();
		const acpManager = getAcpSessionManager();
		const acpResolution = sessionKey ? acpManager.resolveSession({
			cfg,
			sessionKey
		}) : null;
		return {
			opts: commandOpts,
			body: !isRawModelRun && acpResolution?.kind === "ready" ? resolveAcpPromptBody(message, opts.internalEvents) : prependInternalEventContext(message, opts.internalEvents),
			transcriptBody: opts.transcriptMessage ?? resolveInternalEventTranscriptBody(message, opts.internalEvents),
			cfg,
			configuredThinkingCatalog,
			normalizedSpawned,
			agentCfg,
			thinkOverride,
			thinkOnce,
			verboseOverride,
			timeoutMs,
			runTimeoutOverrideMs,
			sessionId,
			sessionKey,
			sessionEntry: sessionEntryRaw,
			sessionStore,
			storePath,
			isNewSession,
			previousSessionId,
			persistedThinking,
			persistedVerbose,
			sessionAgentId,
			outboundSession,
			workspaceDir,
			cwd: resolvedCwd,
			agentDir,
			pluginsEnabled,
			manifestMetadataSnapshot,
			modelManifestContext,
			runId,
			isSubagentLane,
			acpManager,
			acpResolution,
			runLease
		};
	} catch (error) {
		await runLease?.release();
		throw error;
	}
}
//#endregion
//#region src/agents/command/model-selection.ts
async function resolveEmbeddedModelSelection(params) {
	const configuredDefaultRef = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.sessionAgentId,
		allowPluginNormalization: params.pluginsEnabled,
		...params.modelManifestContext
	});
	const configuredDefaultAuthProfileId = splitTrailingAuthProfile(resolveAgentEffectiveModelPrimary(params.cfg, params.sessionAgentId) ?? "").profile;
	const { provider: defaultProvider, model: defaultModel } = normalizeAgentCommandDefaultModelRef(params.cfg, configuredDefaultRef.provider, configuredDefaultRef.model, params.modelManifestContext);
	let provider = defaultProvider;
	let model = defaultModel;
	let sessionEntry = params.sessionEntry;
	const hasStoredOverride = Boolean(sessionEntry?.modelOverride || sessionEntry?.providerOverride);
	let storedModelOverrideSource = hasStoredOverride ? sessionEntry?.modelOverrideSource : void 0;
	let hasStoredAutoFallbackProvenance = hasStoredOverride && hasSessionAutoModelFallbackProvenance(sessionEntry);
	let hasLegacyAutoFallbackOverrideWithoutOrigin = hasStoredOverride && hasLegacyAutoFallbackWithoutOrigin(sessionEntry);
	const explicitProviderOverride = typeof params.opts.provider === "string" ? normalizeExplicitOverrideInput(params.opts.provider, "provider") : void 0;
	const explicitModelOverride = typeof params.opts.model === "string" ? normalizeExplicitOverrideInput(params.opts.model, "model") : void 0;
	const hasExplicitRunOverride = Boolean(explicitProviderOverride || explicitModelOverride);
	if (hasExplicitRunOverride && isModelSelectionLocked(sessionEntry)) throw new ModelSelectionLockedError();
	if (hasExplicitRunOverride && params.opts.allowModelOverride !== true) throw new Error("Model override is not authorized for this caller.");
	let allowedModelCatalog = [];
	let modelCatalog = null;
	let visibilityPolicy = createModelVisibilityPolicy({
		cfg: params.cfg,
		catalog: [],
		defaultProvider,
		defaultModel,
		agentId: params.sessionAgentId,
		allowManifestNormalization: true,
		allowPluginNormalization: params.pluginsEnabled,
		...params.modelManifestContext
	});
	const hasAllowlist = !visibilityPolicy.allowAny;
	const agentModels = resolveAgentConfig(params.cfg, params.sessionAgentId)?.models;
	const hasConfiguredModels = Object.keys(params.cfg.agents?.defaults?.models ?? {}).length > 0 || Object.keys(agentModels ?? {}).length > 0;
	if (hasAllowlist || hasConfiguredModels) {
		modelCatalog = params.pluginsEnabled ? loadManifestModelCatalog({
			config: params.cfg,
			workspaceDir: params.workspaceDir
		}) : [];
		visibilityPolicy = createModelVisibilityPolicy({
			cfg: params.cfg,
			catalog: modelCatalog,
			defaultProvider,
			defaultModel,
			agentId: params.sessionAgentId,
			allowManifestNormalization: true,
			allowPluginNormalization: params.pluginsEnabled,
			...params.modelManifestContext
		});
		allowedModelCatalog = visibilityPolicy.allowedCatalog;
	}
	if (sessionEntry && params.sessionStore && params.sessionKey && hasStoredOverride && !isValidAgentHarnessSessionStoreEntry(params.sessionKey, sessionEntry) && !params.suppressVisibleSessionEffects) {
		const initialEntry = sessionEntry;
		const entry = { ...sessionEntry };
		let entryUpdated = false;
		if (hasLegacyAutoFallbackOverrideWithoutOrigin) {
			const { updated } = applyModelOverrideToSessionEntry({
				entry,
				selection: {
					provider: defaultProvider,
					model: defaultModel,
					isDefault: true
				}
			});
			if (updated) {
				storedModelOverrideSource = void 0;
				entryUpdated = true;
			}
		}
		const repaired = repairProviderWrappedModelOverride({
			entry,
			defaultProvider,
			defaultModel
		});
		entryUpdated ||= repaired.updated;
		const overrideProvider = entry.providerOverride?.trim() || defaultProvider;
		const overrideModel = entry.modelOverride?.trim();
		if (overrideModel) {
			const normalizedOverride = normalizeAgentCommandModelRef(params.cfg, overrideProvider, overrideModel, params.modelManifestContext);
			if (!visibilityPolicy.allowsKey(modelKey(normalizedOverride.provider, normalizedOverride.model))) {
				const { updated } = applyModelOverrideToSessionEntry({
					entry,
					selection: {
						provider: defaultProvider,
						model: defaultModel,
						isDefault: true
					}
				});
				entryUpdated ||= updated;
			}
		}
		if (entryUpdated) {
			sessionEntry = await persistSessionEntry({
				sessionStore: params.sessionStore,
				sessionKey: params.sessionKey,
				storePath: params.storePath,
				initialEntry,
				entry
			});
			const adoptedHasStoredOverride = Boolean(sessionEntry?.modelOverride || sessionEntry?.providerOverride);
			storedModelOverrideSource = adoptedHasStoredOverride ? sessionEntry?.modelOverrideSource : void 0;
			hasStoredAutoFallbackProvenance = adoptedHasStoredOverride && hasSessionAutoModelFallbackProvenance(sessionEntry);
			hasLegacyAutoFallbackOverrideWithoutOrigin = adoptedHasStoredOverride && hasLegacyAutoFallbackWithoutOrigin(sessionEntry);
		}
	}
	const storedProviderOverride = hasLegacyAutoFallbackOverrideWithoutOrigin ? void 0 : sessionEntry?.providerOverride?.trim();
	const storedModelOverride = hasLegacyAutoFallbackOverrideWithoutOrigin ? void 0 : sessionEntry?.modelOverride?.trim();
	const currentRunModelChannel = [
		params.runContext.messageChannel,
		params.opts.replyChannel,
		params.opts.channel
	].find((channel) => Boolean(channel && isDeliverableMessageChannel(channel)));
	const channelOverrideGroupId = currentRunModelChannel ? params.runContext.groupId ?? sessionEntry?.groupId ?? params.runContext.currentChannelId : sessionEntry?.groupId ?? params.runContext.groupId ?? params.runContext.currentChannelId;
	const channelModelOverride = params.cfg.channels?.modelByChannel && !hasExplicitRunOverride ? resolveChannelModelOverride({
		cfg: params.cfg,
		channel: currentRunModelChannel ?? sessionEntry?.channel ?? sessionEntry?.lastChannel ?? sessionEntry?.origin?.provider,
		groupId: channelOverrideGroupId,
		groupChatType: sessionEntry?.chatType ?? sessionEntry?.origin?.chatType,
		groupChannel: params.runContext.groupChannel ?? sessionEntry?.groupChannel,
		groupSubject: sessionEntry?.subject,
		parentSessionKey: sessionEntry?.parentSessionKey ?? params.sessionKey,
		directUserIds: [
			sessionEntry?.origin?.nativeDirectUserId,
			sessionEntry?.origin?.from,
			sessionEntry?.origin?.to
		]
	}) : null;
	const normalizedChannelOverride = channelModelOverride ? parseAgentCommandModelRef(params.cfg, channelModelOverride.model, defaultProvider, params.modelManifestContext) : null;
	const primaryProvider = normalizedChannelOverride?.provider ?? defaultProvider;
	const primaryModel = normalizedChannelOverride?.model ?? defaultModel;
	if (normalizedChannelOverride && !Boolean(storedProviderOverride || storedModelOverride)) {
		provider = normalizedChannelOverride.provider;
		model = normalizedChannelOverride.model;
	}
	if (storedModelOverride) {
		const candidateProvider = storedProviderOverride || defaultProvider;
		const normalizedStored = normalizeAgentCommandModelRef(params.cfg, candidateProvider, storedModelOverride, params.modelManifestContext);
		if (visibilityPolicy.allowsKey(modelKey(normalizedStored.provider, normalizedStored.model))) {
			provider = normalizedStored.provider;
			model = normalizedStored.model;
		}
	}
	const autoFallbackPrimaryProbe = !hasExplicitRunOverride && !isModelSelectionLocked(sessionEntry) ? resolveAutoFallbackPrimaryProbe({
		entry: sessionEntry,
		sessionKey: params.sessionKey,
		primaryProvider,
		primaryModel
	}) : void 0;
	let autoFallbackPrimaryProbeSessionEntry;
	if (autoFallbackPrimaryProbe && sessionEntry) {
		provider = autoFallbackPrimaryProbe.provider;
		model = autoFallbackPrimaryProbe.model;
		autoFallbackPrimaryProbeSessionEntry = { ...sessionEntry };
		clearAutoFallbackPrimaryProbeSelection(autoFallbackPrimaryProbeSessionEntry);
	}
	if (hasExplicitRunOverride) {
		const explicitRef = explicitModelOverride ? explicitProviderOverride ? normalizeAgentCommandModelRef(params.cfg, explicitProviderOverride, explicitModelOverride, params.modelManifestContext) : parseAgentCommandModelRef(params.cfg, explicitModelOverride, provider, params.modelManifestContext) : explicitProviderOverride ? normalizeAgentCommandModelRef(params.cfg, explicitProviderOverride, model, params.modelManifestContext) : null;
		if (!explicitRef) throw new Error("Invalid model override.");
		if (!visibilityPolicy.allowsKey(modelKey(explicitRef.provider, explicitRef.model))) {
			const rejectedKey = `${sanitizeForLog(explicitRef.provider)}/${sanitizeForLog(explicitRef.model)}`;
			const policyPath = visibilityPolicy.allowConfigPath ?? "modelPolicy.allow";
			const repairPath = visibilityPolicy.allowRepairConfigPath;
			throw new Error(`Model override "${rejectedKey}" is not allowed for agent "${params.sessionAgentId}" by ${policyPath}. Add "${rejectedKey}" or "${sanitizeForLog(explicitRef.provider)}/*" to ${repairPath}, or remove/empty the list to allow any model.`);
		}
		provider = explicitRef.provider;
		model = explicitRef.model;
	}
	const allowedInitialSelection = visibilityPolicy.resolveSelection({
		provider,
		model
	});
	if (!allowedInitialSelection) {
		const policyPath = visibilityPolicy.allowConfigPath ?? "modelPolicy.allow";
		throw new Error(`Configured default model "${modelKey(provider, model)}" is not allowed by ${policyPath}, and no allowed model is available.`);
	}
	provider = allowedInitialSelection.provider;
	model = allowedInitialSelection.model;
	const providerForAuthProfileValidation = provider;
	let sessionEntryForAttempt = autoFallbackPrimaryProbeSessionEntry ?? sessionEntry;
	const initialAgentHarnessRuntimeOverride = resolveSessionRuntimeOverrideForProvider({
		provider,
		entry: sessionEntryForAttempt,
		cfg: params.cfg
	});
	await ensureSelectedAgentHarnessPlugin({
		config: params.cfg,
		provider,
		modelId: model,
		agentId: params.sessionAgentId,
		sessionKey: params.sessionKey,
		agentHarnessRuntimeOverride: initialAgentHarnessRuntimeOverride,
		workspaceDir: params.workspaceDir
	});
	const authProfileId = sessionEntryForAttempt?.authProfileOverride;
	if (sessionEntryForAttempt && authProfileId) {
		const entry = sessionEntryForAttempt;
		const profile = ensureAuthProfileStore().profiles[authProfileId];
		const acceptedAuthProviders = listOpenAIAuthProfileProvidersForAgentRuntime({
			provider: providerForAuthProfileValidation,
			harnessRuntime: resolveAvailableAgentHarnessPolicy({
				provider: providerForAuthProfileValidation,
				modelId: model,
				config: params.cfg,
				agentId: params.sessionAgentId,
				sessionKey: params.sessionKey
			}).runtime,
			config: params.cfg
		}).map((candidateProvider) => params.pluginsEnabled ? resolveProviderIdForAuth(candidateProvider, {
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			...params.manifestMetadataSnapshot ? { metadataSnapshot: params.manifestMetadataSnapshot } : {}
		}) : candidateProvider);
		const authAliasLookupParams = params.pluginsEnabled ? {
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			...params.manifestMetadataSnapshot ? { metadataSnapshot: params.manifestMetadataSnapshot } : {}
		} : {
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			metadataSnapshot: { plugins: [] }
		};
		if (!(profile && acceptedAuthProviders.some((candidateProvider) => isStoredCredentialCompatibleWithAuthProvider({
			cfg: params.cfg,
			authAliasLookupParams,
			provider: candidateProvider,
			credential: profile
		})))) {
			if (hasExplicitRunOverride || autoFallbackPrimaryProbe) sessionEntryForAttempt = {
				...entry,
				authProfileOverride: void 0,
				authProfileOverrideSource: void 0,
				authProfileOverrideCompactionCount: void 0
			};
			else if (params.sessionStore && params.sessionKey && !params.suppressVisibleSessionEffects) await clearSessionAuthProfileOverride({
				sessionEntry: entry,
				sessionStore: params.sessionStore,
				sessionKey: params.sessionKey,
				storePath: params.storePath
			});
		}
	}
	const catalogForThinking = allowedModelCatalog.length > 0 ? allowedModelCatalog : modelCatalog && modelCatalog.length > 0 ? modelCatalog : params.configuredThinkingCatalog;
	const thinkingCatalog = catalogForThinking.length > 0 ? catalogForThinking : void 0;
	const thinkingRuntime = resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider,
		modelId: model,
		agentId: params.sessionAgentId,
		sessionKey: params.sessionKey,
		sessionEntry: sessionEntryForAttempt
	});
	const configuredThinkLevel = normalizeThinkLevel(resolveAgentConfig(params.cfg, params.sessionAgentId)?.thinkingDefault);
	const immutableThinkLevel = params.requestedThinkLevel ?? configuredThinkLevel;
	const primaryThinkLevel = immutableThinkLevel ?? resolveThinkingDefault({
		cfg: params.cfg,
		provider,
		model,
		catalog: thinkingCatalog,
		agentRuntime: thinkingRuntime
	});
	if (!isThinkingLevelSupported({
		provider,
		model,
		level: primaryThinkLevel,
		catalog: thinkingCatalog,
		agentRuntime: thinkingRuntime
	})) {
		const explicitThink = Boolean(params.thinkOnce || params.thinkOverride);
		const isSubagentSpawnRun = params.isSubagentLane && isSubagentSessionKey(params.sessionKey);
		if (explicitThink && !isSubagentSpawnRun) throw new Error(`Thinking level "${primaryThinkLevel}" is not supported for ${provider}/${model}. Use one of: ${formatThinkingLevels(provider, model, ", ", thinkingCatalog, thinkingRuntime)}.`);
	}
	if (params.thinkOverride && params.sessionStore && params.sessionKey && !params.suppressVisibleSessionEffects) {
		const now = Date.now();
		const entry = params.sessionStore[params.sessionKey] ?? sessionEntry ?? {
			sessionId: params.sessionId,
			updatedAt: now,
			sessionStartedAt: now
		};
		const next = {
			...entry,
			sessionId: params.sessionId,
			updatedAt: now,
			sessionStartedAt: entry.sessionStartedAt ?? now,
			lastInteractionAt: now,
			thinkingLevel: params.thinkOverride
		};
		sessionEntry = await persistSessionEntry({
			sessionStore: params.sessionStore,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			initialEntry: entry,
			entry: next
		}) ?? sessionEntry;
		sessionEntryForAttempt = {
			...sessionEntryForAttempt ?? next,
			thinkingLevel: params.thinkOverride
		};
	}
	const { resolveSessionTranscriptFile } = await loadTranscriptResolveRuntime();
	let sessionFile;
	if (params.sessionStore && params.sessionKey) {
		const resolvedSessionFile = await resolveSessionTranscriptFile({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionStore: params.suppressVisibleSessionEffects ? void 0 : params.sessionStore,
			storePath: params.suppressVisibleSessionEffects ? void 0 : params.storePath,
			sessionEntry,
			agentId: params.sessionAgentId,
			threadId: params.opts.threadId
		});
		sessionFile = resolvedSessionFile.sessionFile;
		sessionEntry = resolvedSessionFile.sessionEntry;
	}
	if (!sessionFile) {
		const resolvedSessionFile = await resolveSessionTranscriptFile({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey ?? params.sessionId,
			storePath: params.storePath,
			sessionEntry,
			agentId: params.sessionAgentId,
			threadId: params.opts.threadId
		});
		sessionFile = resolvedSessionFile.sessionFile;
		sessionEntry = resolvedSessionFile.sessionEntry;
	}
	return {
		sessionEntry,
		provider,
		model,
		defaultProvider,
		defaultModel,
		configuredDefaultAuthProfileId,
		providerForAuthProfileValidation,
		visibilityPolicy,
		hasExplicitRunOverride,
		storedProviderOverride,
		storedModelOverride,
		storedModelOverrideSource,
		hasStoredAutoFallbackProvenance,
		autoFallbackPrimaryProbe,
		sessionEntryForAttempt,
		thinkingCatalog,
		immutableThinkLevel,
		effectiveTurnThinkLevel: primaryThinkLevel,
		sessionFile
	};
}
//#endregion
//#region src/agents/pending-final-delivery-marker.ts
async function persistPendingFinalDeliveryMarker(params) {
	const recoveryPayloads = normalizePendingFinalRecoveryPayloads(params.payloads);
	const hasSendableFinalPayload = normalizePendingFinalDeliveryPayloads(params.payloads).length > 0;
	const recoverableText = buildRecoverablePendingFinalDeliveryText(recoveryPayloads);
	if (!params.deliver || !params.sessionStore || !params.sessionKey || params.suppressVisibleSessionEffects || params.sessionReboundDuringRun || params.payloads.length === 0 || isSubagentSessionKey(params.sessionKey) || !recoverableText || !hasSendableFinalPayload) return {
		sessionEntry: params.sessionEntry,
		pendingFinalDeliveryMarkerPersisted: false,
		hasSendableFinalPayload
	};
	const entry = params.sessionStore[params.sessionKey] ?? params.sessionEntry;
	if (!entry) return {
		sessionEntry: params.sessionEntry,
		pendingFinalDeliveryMarkerPersisted: false,
		hasSendableFinalPayload
	};
	const now = Date.now();
	const persisted = await persistSessionEntry$1({
		sessionStore: params.sessionStore,
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		initialEntry: entry,
		entry: {
			...entry,
			pendingFinalDelivery: true,
			pendingFinalDeliveryText: recoverableText,
			pendingFinalDeliveryContext: params.deliveryContext,
			pendingFinalDeliveryCreatedAt: now,
			updatedAt: now
		},
		shouldPersist: (current) => current?.sessionId === params.runOwnedSessionId && current.abortedLastRun !== true
	});
	const markerPersisted = persisted?.pendingFinalDelivery === true && persisted.pendingFinalDeliveryText === recoverableText;
	return {
		sessionEntry: persisted,
		pendingFinalDeliveryTextForThisRun: markerPersisted ? recoverableText : void 0,
		pendingFinalDeliveryMarkerPersisted: markerPersisted,
		hasSendableFinalPayload
	};
}
//#endregion
//#region src/agents/command/post-run.ts
const log$2 = createSubsystemLogger("agents/agent-command");
async function finalizeEmbeddedAgentCommand(params) {
	const { cfg, body, transcriptBody, sessionId, sessionKey, sessionStore, storePath, sessionAgentId, workspaceDir, cwd, agentDir, outboundSession, agentCfg } = params.prepared;
	const { fallbackProvider, fallbackModel, fallbackExhausted, provider, model, effectiveTurnThinkLevel, internalSessionTarget, attemptExecutionRuntime, messageChannel, suppressUserTurnPersistence, userTurnTranscriptRecorder, fallbackTrajectoryRecorder, lifecycle, terminal, lifecycleGeneration } = params.attempt;
	const { skillsSnapshot, runContext } = params.embeddedSessionState;
	const effectiveCwd = cwd ?? workspaceDir;
	let sessionEntry = params.sessionEntry;
	let result = params.attempt.result;
	let { runOwnedSessionId, sessionReboundDuringRun } = params.sessionOwnership;
	const publishSessionOwnership = () => {
		params.onSessionOwnershipChanged({
			runOwnedSessionId,
			sessionReboundDuringRun
		});
	};
	try {
		await fallbackTrajectoryRecorder?.flush();
		if (params.opts.internalDeliveryMediaUrls !== void 0) result = {
			...result,
			payloads: constrainRestartRecoveryDeliveryPayloads(result.payloads, params.opts.internalDeliveryMediaUrls, params.opts.internalDeliverySuppressText === true)
		};
		params.onTerminalDeliveryEvidenceChanged(buildRestartRecoveryTerminalDeliveryEvidence(result));
		const effectiveSessionId = result.meta.agentMeta?.sessionFile ? result.meta.agentMeta?.sessionId ?? internalSessionTarget?.sessionId ?? sessionId : internalSessionTarget?.sessionId ?? sessionId;
		if (internalSessionTarget && effectiveSessionId !== internalSessionTarget.sessionId) params.trackInternalModelRunTarget({
			...internalSessionTarget,
			sessionId: effectiveSessionId
		});
		if (sessionStore && sessionKey && !params.suppressVisibleSessionEffects) {
			const isHeartbeatLifecycleRun = isHeartbeatLifecycleRunKind(params.opts.bootstrapContextRunKind);
			const { updateSessionStoreAfterAgentRun } = await loadSessionStoreRuntime();
			await updateSessionStoreAfterAgentRun({
				cfg,
				contextTokensOverride: agentCfg?.contextTokens,
				sessionId: effectiveSessionId,
				sessionKey,
				storePath,
				sessionStore,
				defaultProvider: provider,
				defaultModel: model,
				fallbackProvider,
				fallbackModel,
				result,
				touchInteraction: params.opts.bootstrapContextRunKind !== "cron" && !isHeartbeatLifecycleRun && !params.opts.internalEvents?.length,
				touchActivity: !isHeartbeatLifecycleRun && !params.opts.internalEvents?.length,
				preserveRuntimeModel: fallbackExhausted || isHeartbeatLifecycleRun || params.preserveUserFacingSessionModelState,
				preserveUserFacingSessionModelState: params.preserveUserFacingSessionModelState,
				clearRestartRecoveryForceSafeTools: params.opts.forceRestartSafeTools === true && params.opts.deliver !== true
			});
			sessionEntry = sessionStore[sessionKey] ?? sessionEntry;
		}
		runOwnedSessionId = effectiveSessionId;
		publishSessionOwnership();
		const transcriptPersistenceRunner = result.meta.executionTrace?.runner;
		const embeddedAssistantGapFill = transcriptPersistenceRunner === "embedded" || transcriptPersistenceRunner === void 0 && Boolean(result.meta.finalAssistantVisibleText?.trim());
		let persistedCliTurnTranscript = false;
		if (!sessionReboundDuringRun && (transcriptPersistenceRunner === "cli" || embeddedAssistantGapFill)) try {
			const transcriptResult = await attemptExecutionRuntime.persistCliTurnTranscript({
				body,
				transcriptBody,
				result,
				sessionId: effectiveSessionId,
				sessionKey: internalSessionTarget?.sessionKey ?? sessionKey ?? effectiveSessionId,
				sessionEntry: internalSessionTarget?.sessionEntry ?? sessionEntry,
				sessionStore: params.suppressVisibleSessionEffects ? void 0 : sessionStore,
				storePath: internalSessionTarget?.storePath ?? storePath,
				sessionAgentId: internalSessionTarget?.agentId ?? sessionAgentId,
				threadId: params.opts.threadId,
				sessionCwd: effectiveCwd,
				config: cfg,
				embeddedAssistantGapFill,
				skipUserTurn: suppressUserTurnPersistence || userTurnTranscriptRecorder.hasPersisted() || userTurnTranscriptRecorder.isBlocked()
			});
			sessionReboundDuringRun = transcriptResult.kind === "session-rebound";
			publishSessionOwnership();
			if (!internalSessionTarget) sessionEntry = transcriptResult.sessionEntry;
			persistedCliTurnTranscript = transcriptResult.kind === "persisted";
		} catch (error) {
			log$2.warn(`Turn transcript persistence failed for ${sessionKey ?? sessionId}: ${error instanceof Error ? error.message : String(error)}`);
		}
		const payloads = result.payloads ?? [];
		const pendingFinalDeliveryMarker = await persistPendingFinalDeliveryMarker({
			deliver: params.opts.deliver === true,
			sessionStore,
			sessionKey,
			sessionEntry,
			storePath,
			suppressVisibleSessionEffects: params.suppressVisibleSessionEffects,
			sessionReboundDuringRun,
			payloads,
			deliveryContext: params.currentRunDeliveryContext,
			runOwnedSessionId
		});
		sessionEntry = pendingFinalDeliveryMarker.sessionEntry;
		const canSafelyRunPostTurnCompaction = params.opts.deliver !== true || !pendingFinalDeliveryMarker.hasSendableFinalPayload || pendingFinalDeliveryMarker.pendingFinalDeliveryMarkerPersisted;
		if (persistedCliTurnTranscript && !params.suppressVisibleSessionEffects && canSafelyRunPostTurnCompaction) try {
			const compactedSessionEntry = await (await loadCliCompactionRuntime()).runCliTurnCompactionLifecycle({
				cfg,
				sessionId: effectiveSessionId,
				sessionKey: sessionKey ?? effectiveSessionId,
				sessionEntry,
				sessionStore,
				storePath,
				sessionAgentId,
				workspaceDir,
				cwd: effectiveCwd,
				agentDir,
				provider: result.meta.agentMeta?.provider ?? provider,
				model: result.meta.agentMeta?.model ?? model,
				skillsSnapshot,
				messageChannel,
				agentAccountId: runContext.accountId,
				senderIsOwner: params.opts.senderIsOwner,
				thinkLevel: effectiveTurnThinkLevel,
				extraSystemPrompt: params.opts.extraSystemPrompt
			});
			throwAgentRunRestartAbortReason(params.opts.abortSignal?.reason);
			assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			sessionEntry = compactedSessionEntry;
			runOwnedSessionId = compactedSessionEntry?.sessionId ?? runOwnedSessionId;
			publishSessionOwnership();
		} catch (error) {
			throwAgentRunRestartAbortReason(params.opts.abortSignal?.reason);
			throwAgentRunRestartAbortReason(error);
			assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			if (params.opts.deliver !== true || !pendingFinalDeliveryMarker.pendingFinalDeliveryMarkerPersisted || !pendingFinalDeliveryMarker.hasSendableFinalPayload) throw error;
			log$2.warn(`Post-turn transcript compaction failed for ${sessionKey ?? sessionId}; continuing final delivery: ${formatErrorMessage(error)}`);
		}
		const { deliverAgentCommandResult } = await loadDeliveryRuntime();
		const resolveFreshSessionEntryForDelivery = sessionStore && sessionKey && !params.suppressVisibleSessionEffects ? async () => {
			const { loadSessionEntry } = await loadSessionStoreRuntime();
			const freshEntry = loadSessionEntry({
				storePath,
				sessionKey,
				readConsistency: "latest",
				clone: false
			});
			if (!freshEntry || freshEntry.sessionId !== runOwnedSessionId) return;
			sessionStore[sessionKey] = freshEntry;
			return freshEntry;
		} : void 0;
		const deliveryParams = {
			cfg,
			deps: params.deps,
			runtime: params.runtime,
			opts: params.opts,
			outboundSession,
			sessionEntry,
			result,
			payloads,
			assertDeliveryCurrent: () => assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration),
			onDeliveryResult: (deliveryResult) => {
				params.onTerminalDeliveryEvidenceChanged(buildRestartRecoveryTerminalDeliveryEvidence(deliveryResult));
			}
		};
		const deliveryResult = await deliverAgentCommandResult(resolveFreshSessionEntryForDelivery ? {
			...deliveryParams,
			expectedSessionIdForFreshDelivery: runOwnedSessionId,
			resolveFreshSessionEntryForDelivery
		} : deliveryParams);
		if (sessionStore && sessionKey && !isSubagentSessionKey(sessionKey) && !params.suppressVisibleSessionEffects && !sessionReboundDuringRun) {
			const entry = sessionStore[sessionKey] ?? sessionEntry;
			if (!entry) throw new Error("Cannot clear pending delivery without a session entry");
			const noPendingTextForThisRun = params.opts.deliver === true && pendingFinalDeliveryMarker.pendingFinalDeliveryTextForThisRun === void 0 && entry.pendingFinalDelivery === true && !entry.pendingFinalDeliveryText;
			if (deliveryResult?.deliverySucceeded === true || noPendingTextForThisRun) sessionEntry = await persistSessionEntry({
				sessionStore,
				sessionKey,
				storePath,
				initialEntry: entry,
				entry: clearPendingFinalDeliveryFields(entry, Date.now()),
				shouldPersist: (current) => shouldPersistCurrentRunSessionCleanup(current, runOwnedSessionId)
			});
		}
		if (fallbackExhausted || lifecycle.resolveResultError(result, false)) lifecycle.emitResultError(result, fallbackExhausted, terminal);
		else lifecycle.emitEnd(terminal);
		return {
			deliveryResult,
			sessionEntry,
			runOwnedSessionId,
			sessionReboundDuringRun
		};
	} catch (error) {
		lifecycle.emitPostTurnError(error);
		throw error;
	}
}
//#endregion
//#region src/agents/command/attempt-callbacks.ts
/** Creates callbacks that update lifecycle flags for persistence decisions. */
function createAgentAttemptLifecycleCallbacks(state) {
	return {
		onUserMessagePersisted: () => {
			state.currentTurnUserMessagePersisted = true;
		},
		onAgentEvent: (evt) => {
			if (evt.stream !== "lifecycle" || typeof evt.data?.phase !== "string") return;
			if (typeof evt.data.error === "string" && evt.data.error.trim()) state.lifecycleError = evt.data.error;
			if (evt.data.phase === "finishing") {
				state.lifecycleFinishing = true;
				return;
			}
			if (evt.data.phase === "end" || evt.data.phase === "error") state.lifecycleEnded = true;
		}
	};
}
//#endregion
//#region src/agents/command/run-embedded-attempt.ts
const log$1 = createSubsystemLogger("agents/agent-command");
const MAX_LIVE_SWITCH_RETRIES = 5;
async function runEmbeddedAgentAttempt(params) {
	const { cfg, body, transcriptBody, sessionId, sessionKey, sessionStore, storePath, sessionAgentId, workspaceDir, cwd, agentDir, runId, pluginsEnabled, manifestMetadataSnapshot, modelManifestContext, normalizedSpawned, isNewSession, timeoutMs, runTimeoutOverrideMs } = params.prepared;
	const { runContext, skillsSnapshot, resolvedVerboseLevel } = params.embeddedSessionState;
	const { defaultProvider, defaultModel, configuredDefaultAuthProfileId, visibilityPolicy, hasExplicitRunOverride, storedProviderOverride, hasStoredAutoFallbackProvenance, autoFallbackPrimaryProbe, thinkingCatalog, immutableThinkLevel, sessionFile } = params.modelSelection;
	let { provider, model, providerForAuthProfileValidation, sessionEntryForAttempt, storedModelOverride, storedModelOverrideSource, effectiveTurnThinkLevel } = params.modelSelection;
	let sessionEntry = params.sessionEntry;
	let lifecycleGeneration = params.lifecycleGeneration;
	const sessionEffectsSource = resolveInternalSessionEffectsSource({
		agentId: sessionAgentId,
		sessionId,
		sessionKey,
		storePath
	});
	const internalSessionTarget = params.suppressVisibleSessionEffects ? await prepareInternalSessionEffectsSession({
		agentId: sessionAgentId,
		cwd: cwd ?? workspaceDir,
		runId,
		source: sessionEffectsSource,
		storePath
	}) : void 0;
	params.trackInternalModelRunTarget(internalSessionTarget);
	const attemptSessionFile = internalSessionTarget?.sessionFile ?? sessionFile;
	const startedAt = Date.now();
	const attemptLifecycleState = {
		currentTurnUserMessagePersisted: false,
		lifecycleFinishing: false,
		lifecycleEnded: false
	};
	const attemptLifecycleCallbacks = createAgentAttemptLifecycleCallbacks(attemptLifecycleState);
	const transcriptMedia = params.opts.transcriptMedia ?? [];
	const hasTranscriptMedia = transcriptMedia.length > 0;
	const suppressUserTurnPersistence = params.opts.suppressPromptPersistence === true || params.opts.transcriptMessage === "" && !hasTranscriptMedia;
	const recorderTranscriptText = transcriptBody || void 0;
	const userTurnTranscriptRecorder = createUserTurnTranscriptRecorder({
		...!suppressUserTurnPersistence && (recorderTranscriptText || hasTranscriptMedia) ? { input: {
			text: recorderTranscriptText,
			...hasTranscriptMedia ? { media: transcriptMedia } : {}
		} } : {},
		target: {
			sessionId: internalSessionTarget?.sessionId ?? sessionId,
			agentId: internalSessionTarget?.agentId ?? sessionAgentId,
			sessionKey: internalSessionTarget?.sessionKey ?? sessionKey ?? sessionId,
			sessionEntry: internalSessionTarget?.sessionEntry ?? sessionEntry,
			sessionStore: params.suppressVisibleSessionEffects ? void 0 : sessionStore,
			storePath: internalSessionTarget?.storePath ?? storePath,
			cwd: cwd ?? workspaceDir,
			config: cfg
		},
		beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
		errorContext: "agent command user turn transcript"
	});
	if (suppressUserTurnPersistence) userTurnTranscriptRecorder.markBlocked();
	const lifecycle = createAgentCommandLifecycle({
		runId,
		lifecycleGeneration: () => lifecycleGeneration,
		startedAt,
		abortSignal: params.opts.abortSignal,
		state: attemptLifecycleState
	});
	const attemptExecutionRuntime = await loadAttemptExecutionRuntime();
	const messageChannel = resolveMessageChannel(runContext.messageChannel, params.opts.replyChannel ?? params.opts.channel);
	let result;
	let fallbackProvider = provider;
	let fallbackModel = model;
	let fallbackExhausted = false;
	let terminal;
	let liveSwitchRetries = 0;
	let autoFallbackPrimaryProbeInterruptedByLiveSwitch = false;
	const fastModeStartedAtMs = Date.now();
	const fallbackTrajectoryRecorder = createTrajectoryRuntimeRecorder({
		cfg,
		runId,
		sessionId,
		sessionKey,
		sessionFile: attemptSessionFile,
		provider,
		modelId: model,
		workspaceDir
	});
	let liveSwitchMediaTaskIds = /* @__PURE__ */ new Set();
	for (;;) try {
		liveSwitchMediaTaskIds = sessionKey ? getGeneratedMediaTaskIdsForSessionKey(sessionKey) : /* @__PURE__ */ new Set();
		const spawnedBy = normalizedSpawned.spawnedBy ?? sessionEntry?.spawnedBy;
		const effectiveFallbacksOverride = isModelSelectionLocked(sessionEntry) ? [] : resolveEffectiveModelFallbacks({
			cfg,
			agentId: sessionAgentId,
			sessionKey,
			hasSessionModelOverride: hasExplicitRunOverride || Boolean(storedProviderOverride || storedModelOverride),
			modelOverrideSource: hasExplicitRunOverride ? "user" : storedModelOverrideSource,
			hasAutoFallbackProvenance: hasExplicitRunOverride ? false : hasStoredAutoFallbackProvenance
		});
		const fallbackRuntimeState = {};
		attemptLifecycleState.currentTurnUserMessagePersisted = false;
		let attemptMediaTaskIds = liveSwitchMediaTaskIds;
		const currentAttemptCommittedCronMedia = () => Boolean(sessionKey && hasNewGeneratedMediaTaskForSessionKey(sessionKey, attemptMediaTaskIds));
		const fallbackResult = await runEmbeddedAgentEntry({
			selection: {
				cfg,
				provider,
				model,
				agentDir,
				fallbacksOverride: effectiveFallbacksOverride,
				...modelManifestContext
			},
			identity: {
				runId,
				agentId: sessionAgentId,
				sessionId,
				sessionKey: sessionKey ?? sessionId
			},
			harness: {
				workspaceDir,
				sessionKey,
				preparation: { kind: "direct" },
				resolveRuntimeOverride: (candidateProvider) => resolveSessionRuntimeOverrideForProvider({
					provider: candidateProvider,
					entry: sessionEntryForAttempt,
					cfg
				})
			},
			behavior: {
				kind: "command-rpc",
				hasCommittedSideEffect: currentAttemptCommittedCronMedia
			},
			sessionOverride: {
				kind: "reconcile-completed",
				reconcile: async ({ provider: winnerProvider, model: winnerModel }) => {
					if (!autoFallbackPrimaryProbe || autoFallbackPrimaryProbeInterruptedByLiveSwitch || !sessionEntry || !sessionStore || !sessionKey || isModelSelectionLocked(sessionEntry) || params.suppressVisibleSessionEffects || params.preserveUserFacingSessionModelState || !entryMatchesAutoFallbackPrimaryProbe(sessionEntry, autoFallbackPrimaryProbe) || winnerProvider !== autoFallbackPrimaryProbe.provider || winnerModel !== autoFallbackPrimaryProbe.model) return;
					const nextSessionEntry = { ...sessionEntry };
					clearAutoFallbackPrimaryProbeSelection(nextSessionEntry);
					sessionEntry = await persistSessionEntry({
						sessionStore,
						sessionKey,
						storePath,
						initialEntry: sessionEntry,
						entry: nextSessionEntry,
						shouldPersist: (current) => Boolean(current && entryMatchesAutoFallbackPrimaryProbe(current, autoFallbackPrimaryProbe))
					});
				}
			},
			abortSignal: params.opts.abortSignal,
			onFallbackStep: (step) => {
				fallbackTrajectoryRecorder?.recordEvent("model.fallback_step", step);
			},
			runCandidate: async (providerOverride, modelOverride, runOptions) => {
				attemptMediaTaskIds = sessionKey ? getGeneratedMediaTaskIdsForSessionKey(sessionKey) : /* @__PURE__ */ new Set();
				attemptLifecycleState.lifecycleError = void 0;
				attemptLifecycleState.lifecycleFinishing = false;
				attemptLifecycleState.lifecycleEnded = false;
				const isAutoFallbackPrimaryProbeCandidate = autoFallbackPrimaryProbe && providerOverride === autoFallbackPrimaryProbe.provider && modelOverride === autoFallbackPrimaryProbe.model;
				const attemptSessionEntry = autoFallbackPrimaryProbe && providerOverride === autoFallbackPrimaryProbe.fallbackProvider && !isAutoFallbackPrimaryProbeCandidate ? sessionEntry : sessionEntryForAttempt;
				if (isAutoFallbackPrimaryProbeCandidate) markAutoFallbackPrimaryProbe({
					probe: autoFallbackPrimaryProbe,
					sessionKey
				});
				await params.opts.onActiveModelSelected?.({
					provider: providerOverride,
					model: modelOverride
				});
				const fastModeState = resolveFastModeState({
					cfg,
					provider: providerOverride,
					model: modelOverride,
					agentId: sessionAgentId,
					sessionEntry
				});
				const fastMode = params.opts.fastMode ?? fastModeState.mode;
				const configuredAuthProfileId = providerOverride === defaultProvider && modelOverride === defaultModel ? configuredDefaultAuthProfileId : void 0;
				const agentHarnessRuntimeOverride = resolveSessionRuntimeOverrideForProvider({
					provider: providerOverride,
					entry: attemptSessionEntry,
					cfg
				});
				const candidateRuntime = resolveEffectiveAgentRuntime({
					cfg,
					provider: providerOverride,
					modelId: modelOverride,
					agentId: sessionAgentId,
					sessionKey,
					sessionEntry: attemptSessionEntry
				});
				const candidateRequestedThinkLevel = immutableThinkLevel ?? resolveThinkingDefault({
					cfg,
					provider: providerOverride,
					model: modelOverride,
					catalog: thinkingCatalog,
					agentRuntime: candidateRuntime
				});
				const candidateThinkLevel = resolveCandidateThinkingLevel({
					cfg,
					provider: providerOverride,
					modelId: modelOverride,
					level: candidateRequestedThinkLevel,
					catalog: thinkingCatalog,
					agentId: sessionAgentId,
					sessionKey,
					sessionEntry: attemptSessionEntry,
					agentRuntime: candidateRuntime
				}) ?? candidateRequestedThinkLevel;
				effectiveTurnThinkLevel = candidateThinkLevel;
				return attemptExecutionRuntime.runAgentAttempt({
					providerOverride,
					modelOverride,
					configuredAuthProfileId,
					modelFallbacksOverride: effectiveFallbacksOverride,
					originalProvider: provider,
					cfg,
					sessionEntry: attemptSessionEntry,
					agentHarnessRuntimeOverride,
					sessionId,
					sessionKey,
					...internalSessionTarget ? { sessionTarget: internalSessionTarget } : {},
					sessionAgentId,
					sessionFile: attemptSessionFile,
					workspaceDir,
					cwd,
					body,
					transcriptBody,
					isFallbackRetry: runOptions.isFallbackRetry,
					resolvedThinkLevel: candidateThinkLevel,
					fastMode,
					fastModeStartedAtMs,
					fastModeAutoOnSeconds: fastMode === "auto" ? params.opts.fastModeAutoOnSeconds ?? fastModeState.fastAutoOnSeconds : fastModeState.fastAutoOnSeconds,
					isFinalFallbackAttempt: runOptions?.isFinalFallbackAttempt,
					timeoutMs,
					runTimeoutOverrideMs,
					runId,
					lifecycleGeneration,
					opts: params.opts,
					runContext,
					spawnedBy,
					messageChannel,
					skillsSnapshot,
					resolvedVerboseLevel,
					agentDir,
					authProfileProvider: providerForAuthProfileValidation,
					sessionStore: params.suppressVisibleSessionEffects ? void 0 : sessionStore,
					storePath: params.suppressVisibleSessionEffects ? void 0 : storePath,
					pluginsEnabled,
					...manifestMetadataSnapshot ? { metadataSnapshot: manifestMetadataSnapshot } : {},
					allowTransientCooldownProbe: runOptions?.allowTransientCooldownProbe,
					sessionHasHistory: !isNewSession || await attemptExecutionRuntime.sessionFileHasContent(attemptSessionFile),
					fallbackRuntimeState,
					suppressPromptPersistenceOnRetry: suppressUserTurnPersistence || userTurnTranscriptRecorder.hasPersisted() || userTurnTranscriptRecorder.isBlocked() || runOptions.isFallbackRetry && attemptLifecycleState.currentTurnUserMessagePersisted,
					userTurnTranscriptRecorder,
					onUserMessagePersisted: attemptLifecycleCallbacks.onUserMessagePersisted,
					onLifecycleGenerationChanged: (nextLifecycleGeneration) => {
						lifecycleGeneration = nextLifecycleGeneration;
						params.onLifecycleGenerationChanged(nextLifecycleGeneration);
					},
					onAgentEvent: attemptLifecycleCallbacks.onAgentEvent,
					deferTerminalLifecycle: true
				});
			}
		});
		result = fallbackResult.result;
		terminal = fallbackResult.terminal;
		if (isAgentRunRestartAbortReason(params.opts.abortSignal?.reason)) throw params.opts.abortSignal?.reason;
		fallbackProvider = fallbackResult.provider;
		fallbackModel = fallbackResult.model;
		fallbackExhausted = fallbackResult.outcome === "exhausted";
		await fallbackResult.settleSessionOverride();
		if (fallbackResult.attempts.length > 0 && result.meta.agentMeta) result = {
			...result,
			meta: {
				...result.meta,
				agentMeta: {
					...result.meta.agentMeta,
					fallbackAttempts: fallbackResult.attempts
				}
			}
		};
		if (!fallbackExhausted) lifecycle.emitFinishing(terminal);
		break;
	} catch (err) {
		if (err instanceof LiveSessionModelSwitchError) {
			if (isModelSelectionLocked(sessionEntry)) {
				if (!attemptLifecycleState.lifecycleEnded) emitAgentEvent({
					runId,
					lifecycleGeneration,
					stream: "lifecycle",
					data: {
						phase: "error",
						startedAt,
						endedAt: Date.now(),
						error: MODEL_SELECTION_LOCKED_MESSAGE
					}
				});
				await fallbackTrajectoryRecorder?.flush();
				throw new ModelSelectionLockedError();
			}
			if (sessionKey && hasNewGeneratedMediaTaskForSessionKey(sessionKey, liveSwitchMediaTaskIds)) throw err;
			liveSwitchRetries += 1;
			if (liveSwitchRetries > MAX_LIVE_SWITCH_RETRIES) {
				log$1.error(`Live session model switch in subagent run ${runId}: exceeded maximum retries (${MAX_LIVE_SWITCH_RETRIES})`);
				if (!attemptLifecycleState.lifecycleEnded) emitAgentEvent({
					runId,
					lifecycleGeneration,
					stream: "lifecycle",
					data: {
						phase: "error",
						startedAt,
						endedAt: Date.now(),
						error: "Agent run failed"
					}
				});
				await fallbackTrajectoryRecorder?.flush();
				throw new Error(`Exceeded maximum live model switch retries (${MAX_LIVE_SWITCH_RETRIES})`, { cause: err });
			}
			const switchRef = normalizeAgentCommandModelRef(cfg, err.provider, err.model, modelManifestContext);
			if (!visibilityPolicy.allowsKey(modelKey(switchRef.provider, switchRef.model))) {
				log$1.info(`Live session model switch in subagent run ${runId}: rejected ${sanitizeForLog(err.provider)}/${sanitizeForLog(err.model)} (not in allowlist)`);
				if (!attemptLifecycleState.lifecycleEnded) emitAgentEvent({
					runId,
					lifecycleGeneration,
					stream: "lifecycle",
					data: {
						phase: "error",
						startedAt,
						endedAt: Date.now(),
						error: "Agent run failed"
					}
				});
				await fallbackTrajectoryRecorder?.flush();
				throw new Error(`Live model switch rejected: ${sanitizeForLog(err.provider)}/${sanitizeForLog(err.model)} is not in the agent allowlist`, { cause: err });
			}
			const previousProvider = provider;
			const previousModel = model;
			if (autoFallbackPrimaryProbe) autoFallbackPrimaryProbeInterruptedByLiveSwitch = true;
			provider = err.provider;
			model = err.model;
			fallbackProvider = err.provider;
			fallbackModel = err.model;
			providerForAuthProfileValidation = err.provider;
			if (sessionEntry) {
				sessionEntry = { ...sessionEntry };
				if (err.agentRuntimeOverride) sessionEntry.agentRuntimeOverride = err.agentRuntimeOverride;
				else delete sessionEntry.agentRuntimeOverride;
				sessionEntry.authProfileOverride = err.authProfileId;
				sessionEntry.authProfileOverrideSource = err.authProfileId ? err.authProfileIdSource : void 0;
				sessionEntry.authProfileOverrideCompactionCount = void 0;
				sessionEntryForAttempt = sessionEntry;
			}
			if (storedModelOverride || err.model !== previousModel || err.provider !== previousProvider) {
				storedModelOverride = err.model;
				storedModelOverrideSource = "user";
			}
			attemptLifecycleState.lifecycleEnded = false;
			log$1.info(`Live session model switch in subagent run ${runId}: switching to ${sanitizeForLog(err.provider)}/${sanitizeForLog(err.model)}`);
			continue;
		}
		if (!attemptLifecycleState.lifecycleEnded) {
			const errorLifecycleFields = isAgentRunDirectAbortReason(err) ? {
				aborted: true,
				stopReason: "aborted"
			} : resolveAgentRunErrorLifecycleFields(err, params.opts.abortSignal);
			emitAgentEvent({
				runId,
				lifecycleGeneration,
				stream: "lifecycle",
				data: {
					phase: "error",
					startedAt,
					endedAt: Date.now(),
					error: err instanceof Error ? err.message : "Agent run failed",
					...errorLifecycleFields
				}
			});
		}
		await fallbackTrajectoryRecorder?.flush();
		throw err;
	}
	return {
		result,
		fallbackProvider,
		fallbackModel,
		fallbackExhausted,
		provider,
		model,
		sessionEntry,
		lifecycleGeneration,
		effectiveTurnThinkLevel,
		internalSessionTarget,
		attemptExecutionRuntime,
		messageChannel,
		suppressUserTurnPersistence,
		userTurnTranscriptRecorder,
		fallbackTrajectoryRecorder,
		lifecycle,
		terminal
	};
}
//#endregion
//#region src/agents/command/session-preparation.ts
async function prepareEmbeddedSessionState(params) {
	const requestedThinkLevel = params.thinkOnce ?? params.thinkOverride ?? params.persistedThinking;
	const resolvedVerboseLevel = params.verboseOverride ?? params.persistedVerbose ?? params.verboseDefault;
	assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
	if (params.sessionKey || params.suppressVisibleSessionEffects) registerAgentRunContext(params.runId, {
		...params.sessionKey ? {
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		} : {},
		agentId: params.sessionAgentId,
		lifecycleGeneration: params.lifecycleGeneration,
		verboseLevel: resolvedVerboseLevel,
		isControlUiVisible: !params.suppressVisibleSessionEffects
	});
	let sessionEntry = params.sessionEntry;
	const skillFilter = resolveEffectiveAgentSkillFilter(params.cfg, params.sessionAgentId);
	const currentSkillsSnapshot = sessionEntry?.skillsSnapshot;
	const [{ getRemoteSkillEligibility, resolveReusableWorkspaceSkillSnapshot }, { resolveNodeExecEligibility }] = await Promise.all([loadSkillsRuntime(), loadExecDefaultsRuntime()]);
	const nodeSkillsEligibility = resolveNodeExecEligibility({
		cfg: params.cfg,
		sessionEntry,
		sessionKey: params.sessionKey,
		agentId: params.sessionAgentId
	});
	const skillSnapshotState = resolveReusableWorkspaceSkillSnapshot({
		workspaceDir: params.workspaceDir,
		config: params.cfg,
		agentId: params.sessionAgentId,
		existingSnapshot: params.isNewSession ? void 0 : currentSkillsSnapshot,
		skillFilter,
		eligibility: {
			nodeSkills: nodeSkillsEligibility,
			remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkillsEligibility.canExec })
		},
		watch: false
	});
	const needsSkillsSnapshot = params.isNewSession || !currentSkillsSnapshot || skillSnapshotState.shouldRefresh;
	const skillsSnapshot = skillSnapshotState.snapshot;
	if (skillsSnapshot && params.sessionStore && params.sessionKey && needsSkillsSnapshot && !params.suppressVisibleSessionEffects) {
		const now = Date.now();
		const current = sessionEntry ?? {
			sessionId: params.sessionId,
			updatedAt: now,
			sessionStartedAt: now
		};
		const next = {
			...current,
			sessionId: params.sessionId,
			updatedAt: now,
			sessionStartedAt: current.sessionStartedAt ?? now,
			skillsSnapshot
		};
		sessionEntry = await persistSessionEntry({
			sessionStore: params.sessionStore,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			initialEntry: current,
			entry: next
		});
	}
	const shouldPersistInitialSessionTouch = params.opts.skipInitialSessionTouch !== true || Boolean(params.verboseOverride);
	if (params.sessionStore && params.sessionKey && !params.suppressVisibleSessionEffects && shouldPersistInitialSessionTouch) {
		const now = Date.now();
		const entry = params.sessionStore[params.sessionKey] ?? sessionEntry ?? {
			sessionId: params.sessionId,
			updatedAt: now,
			sessionStartedAt: now
		};
		const next = {
			...entry,
			sessionId: params.sessionId,
			updatedAt: now,
			sessionStartedAt: entry.sessionStartedAt ?? now,
			lastInteractionAt: now,
			agentStatus: void 0
		};
		applyVerboseOverride(next, params.verboseOverride);
		sessionEntry = await persistSessionEntry({
			sessionStore: params.sessionStore,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			initialEntry: entry,
			entry: next
		});
	}
	if (params.sessionKey && !params.isSubagentLaneTurn) recordSessionHumanDirectMessage({
		sessionKey: params.sessionKey,
		entry: sessionEntry,
		agentId: params.sessionAgentId,
		actor: params.sessionStateActor,
		channel: params.opts.channel,
		runId: params.runId
	});
	return {
		sessionEntry,
		requestedThinkLevel,
		resolvedVerboseLevel,
		skillsSnapshot,
		runContext: resolveAgentRunContext(params.opts)
	};
}
//#endregion
//#region src/agents/agent-command.ts
/** Main agent command orchestration for sessions, model selection, delivery, and attempts. */
const log = createSubsystemLogger("agents/agent-command");
async function agentCommandInternal(prepared, initialOpts, runtime = defaultRuntime, deps) {
	const resolvedDeps = await resolveAgentCommandDeps(deps);
	const isRawModelRun = initialOpts.modelRun === true || initialOpts.promptMode === "none";
	const suppressVisibleSessionEffects = initialOpts.sessionEffects === "internal";
	const preserveUserFacingSessionModelState = initialOpts.preserveUserFacingSessionModelState === true;
	const lifecycleAbortController = new AbortController();
	const storedDeliveryMediaUrls = prepared.sessionEntry?.restartRecoveryDeliveryRunId === prepared.runId && Array.isArray(prepared.sessionEntry.restartRecoveryDeliveryMediaUrls) ? prepared.sessionEntry.restartRecoveryDeliveryMediaUrls : void 0;
	const preparedOpts = storedDeliveryMediaUrls !== void 0 ? {
		...prepared.opts,
		internalDeliveryMediaUrls: [...storedDeliveryMediaUrls],
		internalDeliverySuppressText: prepared.sessionEntry?.restartRecoverySuppressTextDelivery,
		sourceReplyDeliveryMode: prepared.sessionEntry?.restartRecoverySourceReplyDeliveryMode,
		disableMessageTool: prepared.sessionEntry?.restartRecoveryDisableMessageTool,
		forceRestartSafeTools: prepared.sessionEntry?.restartRecoveryForceSafeTools
	} : prepared.opts;
	if (preparedOpts.internalDeliverySuppressText === true && preparedOpts.internalDeliveryMediaUrls === void 0 || (preparedOpts.internalDeliveryMediaUrls !== void 0 || preparedOpts.internalDeliverySuppressText === true) && (preparedOpts.forceRestartSafeTools !== true || preparedOpts.disableMessageTool !== true || preparedOpts.sourceReplyDeliveryMode !== "automatic")) throw new Error("internal delivery media constraints require automatic delivery with restart-safe tools and no message tool");
	let opts = {
		...preparedOpts,
		abortSignal: preparedOpts.abortSignal ? AbortSignal.any([preparedOpts.abortSignal, lifecycleAbortController.signal]) : lifecycleAbortController.signal
	};
	const { body, transcriptBody, cfg, configuredThinkingCatalog, agentCfg, thinkOverride, thinkOnce, verboseOverride, sessionId, sessionKey, sessionStore, storePath, isNewSession, persistedThinking, persistedVerbose, sessionAgentId, outboundSession, workspaceDir, runId, isSubagentLane, acpManager, acpResolution, pluginsEnabled, manifestMetadataSnapshot, modelManifestContext } = prepared;
	let lifecycleGeneration = opts.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(runId);
	let sessionEntry = prepared.sessionEntry, runOwnedSessionId = sessionId;
	const sessionStateActor = classifySessionStateActor({
		inputProvenance: opts.inputProvenance,
		internalEvents: opts.internalEvents,
		sessionEffects: opts.sessionEffects
	});
	const isSubagentLaneTurn = normalizeOptionalString$1(opts.lane) === AGENT_LANE_SUBAGENT;
	let sessionReboundDuringRun = false;
	let trackedRestartRecoveryDeliveryClaim = false;
	let currentRunDeliveryContext;
	let restartRecoveryTerminalDeliveryEvidence;
	const preparedSessionId = sessionEntry?.sessionId;
	const internalModelRunTargets = initialOpts.modelRun === true && suppressVisibleSessionEffects ? /* @__PURE__ */ new Map() : void 0;
	const trackInternalModelRunTarget = (target) => {
		if (!internalModelRunTargets || !target?.sessionKey || !target.storePath) return;
		internalModelRunTargets.set(`${target.storePath}\n${target.sessionKey}`, target);
	};
	if (internalModelRunTargets && storePath) trackInternalModelRunTarget(resolveInternalSessionEffectsTarget({
		agentId: sessionAgentId,
		runId,
		storePath
	}));
	let sessionWorkAdmission;
	try {
		assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
		const sessionStoreRuntime = storePath && sessionKey ? await loadSessionStoreRuntime() : void 0;
		sessionWorkAdmission = await beginSessionWorkAdmission({
			scope: storePath ?? `agent:${sessionAgentId}`,
			identities: [sessionKey, sessionId],
			signal: opts.abortSignal,
			onInterrupt: () => lifecycleAbortController.abort(createAgentRunRestartAbortError()),
			assertAllowed: () => {
				const currentEntry = sessionStoreRuntime && storePath && sessionKey ? sessionStoreRuntime.loadSessionEntry({
					storePath,
					sessionKey,
					readConsistency: "latest"
				}) : sessionEntry;
				if (!currentEntry && preparedSessionId) throw new Error(`Session "${sessionKey ?? sessionId}" changed while starting work. Retry.`);
				const matchesIntentionalRollover = isNewSession && currentEntry?.sessionId === preparedSessionId;
				if (currentEntry && currentEntry.sessionId !== sessionId && !matchesIntentionalRollover) throw new Error(`Session "${sessionKey ?? sessionId}" changed while starting work. Retry.`);
				const archivedSessionError = resolveSessionWorkStartError(sessionKey ?? sessionId, currentEntry);
				if (archivedSessionError) throw new Error(archivedSessionError);
				sessionEntry = currentEntry;
				if (sessionStore && sessionKey) if (currentEntry) sessionStore[sessionKey] = currentEntry;
				else delete sessionStore[sessionKey];
			}
		});
		return await sessionWorkAdmission.run(async () => {
			if (opts.deliver === true) {
				if (resolveSendPolicy({
					cfg,
					entry: sessionEntry,
					sessionKey,
					channel: sessionEntry?.channel,
					chatType: sessionEntry?.chatType
				}) === "deny") throw new Error("send blocked by session policy");
			}
			if (!isRawModelRun && acpResolution?.kind === "stale") throw acpResolution.error;
			let currentRunDeliveryPrepared = false;
			const prepareDeliveryForRun = async (candidateSessionEntry) => {
				if (currentRunDeliveryPrepared || opts.deliver !== true) return;
				currentRunDeliveryPrepared = true;
				let preparedDelivery;
				try {
					preparedDelivery = await prepareCurrentRunDelivery({
						cfg,
						opts,
						agentId: sessionAgentId,
						currentSessionKey: sessionKey,
						sessionEntry: candidateSessionEntry
					});
				} catch (error) {
					if (opts.bestEffortDeliver !== true) throw error;
					log.warn(`delivery preflight failed; continuing session-only because bestEffortDeliver is enabled: ${error instanceof Error ? error.message : String(error)}`);
					opts = {
						...opts,
						deliver: false
					};
				}
				assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
				if (preparedDelivery) {
					currentRunDeliveryContext = preparedDelivery.context;
					opts = {
						...opts,
						replyChannel: preparedDelivery.context.channel,
						replyTo: preparedDelivery.context.to,
						replyAccountId: preparedDelivery.context.accountId,
						threadId: preparedDelivery.context.threadId,
						deliveryTargetMode: preparedDelivery.targetMode
					};
				}
			};
			if (sessionStore && sessionKey && !suppressVisibleSessionEffects && !isSubagentSessionKey(sessionKey)) {
				const now = Date.now();
				const currentStoreEntry = sessionStore[sessionKey];
				const allowCreateRestartRecoveryEntry = currentStoreEntry === void 0 && sessionEntry === void 0;
				const initialEntry = currentStoreEntry ?? sessionEntry ?? {
					sessionId,
					updatedAt: now,
					sessionStartedAt: now
				};
				const isSessionRollover = isNewSession && initialEntry.sessionId !== sessionId;
				const entry = isSessionRollover ? clearRotatedSessionMetadata(initialEntry) : initialEntry;
				await prepareDeliveryForRun(entry);
				const generatedMediaSourceRunId = opts.internalDeliveryMediaUrls !== void 0 && opts.inputProvenance?.kind === "inter_session" && isAgentMediatedCompletionSourceTool(opts.inputProvenance.sourceTool) ? runId : void 0;
				assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
				const next = {
					...entry,
					sessionId,
					updatedAt: now,
					sessionStartedAt: isSessionRollover ? now : entry.sessionStartedAt,
					lastInteractionAt: isSessionRollover ? now : entry.lastInteractionAt,
					...buildCurrentRunRestartRecoveryClaim({
						deliveryContext: currentRunDeliveryContext,
						deliveryMediaUrls: opts.internalDeliveryMediaUrls,
						disableMessageTool: opts.disableMessageTool,
						entry,
						forceRestartSafeTools: opts.forceRestartSafeTools,
						runId,
						sourceIngress: generatedMediaSourceRunId ? "internal" : void 0,
						sourceRunId: generatedMediaSourceRunId,
						sourceReplyDeliveryMode: opts.sourceReplyDeliveryMode,
						suppressTextDelivery: opts.internalDeliverySuppressText
					})
				};
				const persisted = await persistSessionEntry({
					sessionStore,
					sessionKey,
					storePath,
					initialEntry,
					entry: next,
					shouldPersist: (current) => isSessionRollover ? current?.sessionId === initialEntry.sessionId : shouldPersistRestartRecoveryContextClaim(current, sessionId, runId, allowCreateRestartRecoveryEntry)
				});
				sessionEntry = persisted;
				trackedRestartRecoveryDeliveryClaim = persisted?.restartRecoveryDeliveryRunId === runId;
			}
			await prepareDeliveryForRun(sessionEntry);
			if (!isRawModelRun && acpResolution?.kind === "ready" && sessionKey) {
				assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
				return await runAcpAgentCommand({
					cfg,
					deps: resolvedDeps,
					runtime,
					opts,
					outboundSession,
					sessionEntry,
					sessionStore,
					body,
					transcriptBody,
					suppressVisibleSessionEffects,
					provenance: isSubagentLaneTurn ? "agent" : sessionStateActor.actorType,
					sessionAgentId,
					sessionId,
					sessionKey,
					storePath,
					workspaceDir,
					runId,
					lifecycleGeneration,
					acpManager,
					acpResolution,
					trackInternalModelRunTarget
				});
			}
			const embeddedSessionState = await prepareEmbeddedSessionState({
				cfg,
				opts,
				sessionEntry,
				sessionStore,
				sessionKey,
				sessionId,
				storePath,
				sessionAgentId,
				lifecycleGeneration,
				runId,
				workspaceDir,
				isNewSession,
				isSubagentLaneTurn,
				suppressVisibleSessionEffects,
				thinkOnce,
				thinkOverride,
				persistedThinking,
				verboseOverride,
				persistedVerbose,
				verboseDefault: agentCfg?.verboseDefault,
				sessionStateActor
			});
			sessionEntry = embeddedSessionState.sessionEntry;
			const { requestedThinkLevel, runContext } = embeddedSessionState;
			const modelSelection = await resolveEmbeddedModelSelection({
				cfg,
				opts,
				sessionEntry,
				sessionStore,
				sessionKey,
				sessionId,
				storePath,
				sessionAgentId,
				workspaceDir,
				pluginsEnabled,
				manifestMetadataSnapshot,
				modelManifestContext,
				configuredThinkingCatalog,
				requestedThinkLevel,
				thinkOverride,
				thinkOnce,
				isSubagentLane,
				suppressVisibleSessionEffects,
				runContext
			});
			sessionEntry = modelSelection.sessionEntry;
			const embeddedAttempt = await runEmbeddedAgentAttempt({
				prepared,
				opts,
				sessionEntry,
				lifecycleGeneration,
				onLifecycleGenerationChanged: (nextLifecycleGeneration) => {
					lifecycleGeneration = nextLifecycleGeneration;
				},
				suppressVisibleSessionEffects,
				preserveUserFacingSessionModelState,
				modelSelection,
				embeddedSessionState,
				trackInternalModelRunTarget
			});
			sessionEntry = embeddedAttempt.sessionEntry;
			lifecycleGeneration = embeddedAttempt.lifecycleGeneration;
			const finalized = await finalizeEmbeddedAgentCommand({
				prepared,
				opts,
				deps: resolvedDeps,
				runtime,
				sessionEntry,
				attempt: embeddedAttempt,
				embeddedSessionState,
				suppressVisibleSessionEffects,
				preserveUserFacingSessionModelState,
				currentRunDeliveryContext,
				sessionOwnership: {
					runOwnedSessionId,
					sessionReboundDuringRun
				},
				trackInternalModelRunTarget,
				onSessionOwnershipChanged: (ownership) => {
					runOwnedSessionId = ownership.runOwnedSessionId;
					sessionReboundDuringRun = ownership.sessionReboundDuringRun;
				},
				onTerminalDeliveryEvidenceChanged: (evidence) => {
					restartRecoveryTerminalDeliveryEvidence = evidence;
				}
			});
			sessionEntry = finalized.sessionEntry;
			runOwnedSessionId = finalized.runOwnedSessionId;
			sessionReboundDuringRun = finalized.sessionReboundDuringRun;
			return finalized.deliveryResult;
		});
	} finally {
		sessionWorkAdmission?.release();
		if (internalModelRunTargets) for (const target of internalModelRunTargets.values()) try {
			await removeInternalSessionEffectsSession(target);
		} catch (error) {
			log.warn(`failed to remove model-run SQLite session: ${error instanceof Error ? error.message : String(error)}`);
		}
		if (!sessionReboundDuringRun && trackedRestartRecoveryDeliveryClaim && sessionStore && sessionKey) try {
			const entry = sessionStore[sessionKey] ?? sessionEntry;
			if (entry?.restartRecoveryDeliveryRunId === runId) sessionEntry = await persistSessionEntry({
				sessionStore,
				sessionKey,
				storePath,
				initialEntry: entry,
				entry: {
					...entry,
					...buildRestartRecoveryClaimCleanupPatch({
						entry,
						recordTerminalSource: true,
						terminalRunId: runId,
						terminalDeliveryEvidence: restartRecoveryTerminalDeliveryEvidence
					}),
					updatedAt: Date.now()
				},
				shouldPersist: (current) => shouldPersistRestartRecoveryCleanup(current, runOwnedSessionId, runId)
			});
		} catch (error) {
			log.warn(`failed to clear restart recovery delivery context for ${sessionKey}: ${error instanceof Error ? error.message : String(error)}`);
		}
		clearAgentRunContext(runId, lifecycleGeneration);
	}
}
/** Runs an agent turn from CLI/runtime options against the resolved session and model policy. */
async function agentCommand(opts, runtime = defaultRuntime, deps) {
	const resolvedDeps = await resolveAgentCommandDeps(deps);
	const lifecycleGeneration = opts.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(opts.runId ?? "");
	return await withAgentRunLifecycleGeneration(lifecycleGeneration, () => withLocalGatewayRequestScope({
		deps: resolvedDeps,
		getRuntimeConfig
	}, async () => await runWithAgentCommandRecoveryOwner({
		lifecycleGeneration,
		mode: "reject_uncoordinated",
		opts: {
			...opts,
			lifecycleGeneration,
			senderIsOwner: opts.senderIsOwner ?? true,
			allowModelOverride: opts.allowModelOverride ?? true
		},
		prepare: async (preparedOpts) => await prepareAgentCommandExecution(preparedOpts, runtime),
		run: async (prepared) => await agentCommandInternal(prepared, prepared.opts, runtime, resolvedDeps)
	})));
}
async function agentCommandFromIngressInternal(opts, runtime = defaultRuntime, deps, recovery) {
	if (typeof opts.allowModelOverride !== "boolean") throw new Error("allowModelOverride must be explicitly set for ingress agent runs.");
	const lifecycleGeneration = opts.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(opts.runId ?? "");
	return await withAgentRunLifecycleGeneration(lifecycleGeneration, async () => {
		const result = await runWithAgentCommandRecoveryOwner({
			lifecycleGeneration,
			mode: "claim",
			opts: {
				...opts,
				lifecycleGeneration,
				senderIsOwner: opts.senderIsOwner === true
			},
			prepare: async (preparedOpts) => await prepareAgentCommandExecution(preparedOpts, runtime),
			restoreAdmittedRecovery: recovery?.restoreAdmittedRecovery,
			run: async (prepared) => await agentCommandInternal(prepared, prepared.opts, runtime, deps)
		});
		if (result) emitIngressModelUsageDiagnostic(result, opts);
		return result;
	});
}
/** Runs an agent turn from an inbound channel/gateway ingress context. */
async function agentCommandFromIngress(opts, runtime = defaultRuntime, deps) {
	return await agentCommandFromIngressInternal(opts, runtime, deps);
}
/** Internal Gateway entrypoint that restores a rejected restart-recovery admission. */
async function agentCommandFromGatewayIngress(opts, runtime, deps, recovery) {
	return await agentCommandFromIngressInternal(opts, runtime, deps, recovery);
}
//#endregion
export { agentCommandFromGatewayIngress as n, agentCommandFromIngress as r, agentCommand as t };
