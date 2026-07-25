import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { a as addTimerTimeoutGraceMs } from "./number-coercion-Crk_c9KW.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as sanitizeForLog } from "./ansi-BEaQ2G9r.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { T as freezeDiagnosticTraceContext, n as emitDiagnosticEvent, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-Dt41CZkD.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import "./utils-K2PjeLaV.js";
import { s as sleepWithAbort } from "./src-DKBD8PDy.js";
import { r as hasConfiguredModelFallbacks, v as resolveSessionAgentIds } from "./agent-scope-CrBA-6Gx.js";
import { E as parseAgentSessionKey, d as resolveAgentIdFromSessionKey } from "./session-key-Drrs61Fd.js";
import { a as resolveAgentDir, o as resolveAgentWorkspaceDir, s as resolveDefaultAgentDir } from "./agent-scope-config-S7z_Yn4H.js";
import { L as isDefaultAgentRuntimeId, b as providerModelRouteAcceptsAuthMode, c as resolveContextConfigProviderForRuntime, d as resolveSelectedOpenAIRuntimeProvider, i as isOpenAIProvider, n as OPENAI_PROVIDER_ID, z as normalizeOptionalAgentRuntimeId } from "./openai-routing-Cq9SwNpx.js";
import { t as resolveAgentHarnessPolicy } from "./policy-CZpNJ432.js";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-CThCRo6Z.js";
import { a as getRuntimeConfigSnapshot } from "./runtime-snapshot-BW7iP5ad.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { S as resolveModelRefFromString, i as buildModelAliasIndex } from "./model-selection-shared-CPPxIJAX.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-CV4VBWUf.js";
import "./config-BOMcY2yX.js";
import { a as unwrapSecretSentinelsForProviderEgress, c as looksLikeSecretSentinel, t as protectPreparedProviderRuntimeAuth, u as resolveSecretSentinel } from "./provider-secret-egress-BC9ES6v4.js";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-DrrUROfX.js";
import { D as resolveContextEngine, O as resolveContextEngineOwnerPluginId } from "./registry-BSBtFA2q.js";
import { O as withAgentRunLifecycleGeneration, S as registerAgentRunContext, d as emitAgentItemEvent, m as getAgentRunContext, n as captureAgentRunLifecycleGeneration, p as getAgentEventLifecycleGeneration, r as claimAgentRunContext, t as assertAgentRunLifecycleGenerationCurrent, y as onAgentEvent } from "./agent-events-Dg0sI2pr.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-C6QB2pJa.js";
import { a as getReplyPayloadMetadata, i as copyReplyPayloadMetadata, p as markReplyPayloadForSourceSuppressionDelivery, t as FAST_MODE_AUTO_PROGRESS_KIND } from "./reply-payload-BtIUrr9c.js";
import { l as resolveStorePath } from "./paths-BpMRJ7TJ.js";
import { Kt as normalizeUsage, Vt as deriveContextPromptTokens, _ as resolveSessionTranscriptRuntimeReadTarget, et as updateSessionEntry, w as appendTranscriptMessage, yt as loadSessionEntry } from "./session-accessor-Mu3lv_Tl.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-DYDkUiW3.js";
import { o as isMarkdownCapableMessageChannel } from "./message-channel-CkiwT4Uh.js";
import { n as parseSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import "./backoff-CCtTkmwj.js";
import { a as resolveProviderAuthProfileId } from "./provider-hook-runtime-D3TqXLuP.js";
import { b as prepareProviderRuntimeAuth } from "./provider-runtime-BE5KxvKF.js";
import { i as ensureAuthProfileStore, o as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-BTcmQtbp.js";
import { r as resolveSubscriptionAuthModeForProfiles } from "./profile-list-DPdEwKBx.js";
import { o as isProfileInCooldown } from "./usage-state-BNklJz_j.js";
import { s as prepareModelRuntimeSnapshot, t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-CrzRpeq_.js";
import { T as classifyRateLimitWindow } from "./sessions-Coo3M9oK.js";
import { t as SessionManager } from "./session-manager-Ofb7FHrt.js";
import { i as buildUsageWithNoCost, n as buildAssistantMessage } from "./stream-message-shared-DKS8UMJ_.js";
import { t as resolveThinkingDefault } from "./model-thinking-default-Bn7kjmzP.js";
import "./model-selection-Dx2ArePR.js";
import { t as MissingProviderAuthError } from "./model-auth-runtime-shared-BVzqP6NP.js";
import { t as ensureRuntimePluginsLoaded } from "./runtime-plugins-C2HQO8GV.js";
import "./auth-profiles-D9OcwMed.js";
import { n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-DTFzouyz.js";
import { n as markAuthProfileSuccess } from "./profiles-C6oqGGG6.js";
import { t as redactIdentifier } from "./redact-identifier-BjaGGxG8.js";
import { t as sanitizeForConsole } from "./console-sanitize-NjY4pEOW.js";
import { a as markAuthProfileFailure, c as resolveProfilesUnavailableReason } from "./usage-DaLssncS.js";
import { n as applyLocalNoAuthHeaderOverride, o as getApiKeyForModel, t as applyAuthHeaderOverride } from "./model-auth-919iJVmy.js";
import { n as formatBillingErrorMessage, x as isTimeoutErrorMessage } from "./sanitize-user-facing-text-sWgeyF-a.js";
import { E as parseImageSizeError, T as parseImageDimensionError, _ as isFailoverAssistantError, b as isLikelyContextOverflowError, c as extractObservedOverflowTokenCount, f as isAuthAssistantError, h as isCompactionFailureError, i as classifyFailoverReason, l as formatAssistantErrorText, p as isBillingAssistantError, r as classifyAssistantFailoverReason, v as isFailoverErrorMessage, x as isRateLimitAssistantError, y as isGenericUnknownStreamErrorMessage } from "./errors-DMOgb-Rt.js";
import { m as normalizeToolName } from "./tool-policy-GYMCyycR.js";
import { a as describeFailoverError, i as coerceToFailoverError, p as resolveFailoverStatus, t as FailoverError } from "./failover-error-B8xHNn2y.js";
import { a as fingerprintResolvedAuthProfileCredential, i as fingerprintOpaqueRuntimeOwner, n as fingerprintAuthProfileOwnerShape, o as fingerprintResolvedProviderAuth, r as fingerprintAwsSdkRuntimeOwner } from "./execution-auth-binding-CmucNoqo.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-f-lb12_n.js";
import { n as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-C9geO1r1.js";
import { c as resolveAgentRunAbortLifecycleFields, r as createAgentRunDirectAbortError, s as isAgentRunRestartAbortReason } from "./run-termination-BQ_P-sPi.js";
import { c as resolveFastModeForElapsed, l as resolveFastModeModelAutoOnSeconds, n as formatFastModeAutoProgressText } from "./fast-mode-CFWkImo-.js";
import { t as DEFAULT_AGENT_TIMEOUT_MS } from "./timeout-BEGWfRGM.js";
import { j as resolveCompactionTimeoutMs, k as compactContextEngineWithSafetyTimeout } from "./diagnostic-CiatiVjT.js";
import { _ as resolveActiveEmbeddedRunHandleSessionIdBySessionFile, g as resolveActiveEmbeddedRunHandleSessionId, r as clearActiveEmbeddedRun, u as isEmbeddedAgentRunHandleActive, x as setActiveEmbeddedRun } from "./runs-DDczt14d.js";
import { n as SILENT_REPLY_TOKEN } from "./tokens-DKI4eGAu.js";
import "./sessions-Uqhj6EXw.js";
import "./fast-mode-DLmTLUz8.js";
import { n as resolveCandidateThinkingLevel, o as resolveAgentHarnessPreparedAuthSupport, s as resolveAgentHarnessPreparedRouteSupport } from "./thinking-runtime-g8O2MT43.js";
import { r as pickFallbackThinkingLevel } from "./embedded-agent-helpers-DDAtCAER.js";
import { a as revokeMessageActionTurnCapability, i as resolveMessageActionTurnCapabilityLifetime, n as mintMessageActionTurnCapability, t as isTrustedMessageActionTurnIngress } from "./message-action-turn-capability-BcyILfBH.js";
import { o as getCommandLaneSnapshot, r as enqueueCommandInLane } from "./command-queue-B2fMJE4M.js";
import { l as retireSessionMcpRuntime, u as retireSessionMcpRuntimeForSessionKey } from "./agent-bundle-mcp-manager-api-ChkvrkDs.js";
import "./agent-bundle-mcp-tools-DaXqeeyj.js";
import { n as OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST } from "./host-compat-BibWlia2.js";
import { t as ensureContextEnginesInitialized } from "./init-CJad3Rp1.js";
import { d as waitForDeferredTurnMaintenanceForSession, f as buildContextEngineRuntimeSettings, u as runContextEngineMaintenance } from "./agent-end-side-effects-6JsKr3JF.js";
import { c as createFileBackedCompactionCheckpointStore, d as readSessionLeafStateFromTranscriptAsync, f as resolveCompactionCheckpointTranscriptPosition, o as runPostCompactionSideEffects, p as resolveSessionCompactionCheckpointReason, s as buildCompactionHarnessModelProvider, t as asCompactionHookRunner } from "./compaction-hooks-B-YGchd1.js";
import { a as resolveContextWindowInfo } from "./context-window-guard-DIdj9nbP.js";
import { n as isRecoverableNativeHarnessBindingFailure, t as maybeCompactAgentHarnessSession } from "./compaction-BL8P38pZ.js";
import { r as resolveModelAsync, t as createEmptyAgentDiscoveryStores } from "./model-CQuJLPwU.js";
import { t as materializePreparedRuntimeModel } from "./materialize-model-YlD3OH5m.js";
import { n as canRunPreparedAgentRuntimeAuthAttempt, r as prepareAgentRuntimeAuth } from "./prepare-auth-C1BJH449.js";
import { a as resolveReusableRuntimeModelAuth, i as resolveCredentialScopedAuthAttemptModelDecision, n as hasPreparedAuthAttemptModelMetadata, r as providerUsesCredentialScopedModelMetadata, t as createPreparedRuntimeModelMaterializer } from "./credential-scoped-model-DWmTy7Ph.js";
import { n as isToolResultError } from "./tool-result-error-W5qOAoXI.js";
import { t as log$3 } from "./logger-DTutvtjM.js";
import { m as hasOutboundDeliveryEvidence, p as hasMessagingToolDeliveryEvidence } from "./delivery-evidence-DV3bbMhs.js";
import { B as resolveReasoningOnlyRetryInstruction, G as shouldRetryMissingAssistantTurn, H as resolveRunLivenessState, I as hasAttemptTerminalState, J as isStrictAgenticExecutionContractActive, K as shouldRetrySilentErrorAssistantTurn, L as resolveAttemptReplayMetadata, N as rotateTranscriptFileAfterCompaction, P as shouldRotateCompactionTranscript, R as resolveEmptyResponseRetryInstruction, U as resolveSilentToolResultReplyPayload, V as resolveReplayInvalidFlag, W as resolveToolUseTerminalContinuationInstruction, a as runAgentHarnessAttempt, d as createEmbeddedRunStageSummaryEmitter, f as createEmbeddedRunStageTracker, it as observeReplayMetadata, nt as createToolTerminalObserver, o as selectAgentHarness, p as formatEmbeddedRunStageSummary, q as shouldTreatEmptyAssistantReplyAsSilent, rt as createEmbeddedRunReplayState, s as selectAgentHarnessForPreparedModelProviders, t as agentHarnessBuildsOpenClawTools, u as EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE, z as resolveIncompleteTurnPayloadText } from "./selection-6xddiFwm.js";
import { n as isExecLikeToolName } from "./tool-error-summary-DDV0ZoKC.js";
import { _ as listActiveProcessSessionReferences, f as buildEmbeddedCompactionRuntimeContext, m as resolveEmbeddedCompactionTarget, p as resolveCompactionHarnessRuntime, r as forgetPromptBuildDrainCacheForRun, v as resolveContextEngineCapabilities } from "./attempt.prompt-helpers-CxGA3lR4.js";
import { n as resolveProcessToolScopeKey, r as resolveDelegationCapability } from "./agent-tools-D19rPL7p.js";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-0-LpzH8H.js";
import { n as resolveGlobalLane, r as resolveSessionLane } from "./lanes-CVttd5qX.js";
import { d as shouldUseTransientCooldownProbeSlot, l as shouldSuppressRawErrorConsoleSuffix, s as buildApiErrorObservationFields, u as LiveSessionModelSwitchError } from "./model-fallback-CVFSvXjG.js";
import { a as resolveStoredSessionKeyForSessionId, i as resolveSessionKeyForRequest } from "./session-BGTcM179.js";
import { a as resolveSessionSuspensionTarget, i as resolveSessionSuspensionReason, s as suspendSession } from "./session-suspension-DNYLXcr7.js";
import { S as hasOnlyAssistantReasoningContent } from "./openai-transport-stream-810ZIbd4.js";
import { l as truncateOversizedToolResultsInActiveTarget, o as resolveLiveToolResultMaxChars, s as sessionLikelyHasOversizedToolResults } from "./tool-result-truncation-B8woaAfh.js";
import { n as buildAgentHookContextIdentityFields, t as buildAgentHookContextChannelFields } from "./hook-agent-context-DtfLo2HB.js";
import { n as runAgentCleanupStep } from "./attempt.tool-run-context-Cuo-wu8Q.js";
import { t as createTrajectoryRuntimeRecorder } from "./runtime-DKjdpXlx.js";
import { _ as resolveRateLimitProfileRotationLimit, a as buildUsageAgentMetaFields, b as createUsageAccumulator, c as resolveActiveErrorContext, d as resolveFinalAssistantVisibleText, f as resolveLatestCallUsage, g as resolveOverloadProfileRotationLimit, h as resolveOverloadFailoverBackoffMs, i as buildErrorAgentMeta, l as resolveEmbeddedAttemptBasePrompt, m as resolveNextSameModelRateLimitRetryCount, n as RUNTIME_AUTH_REFRESH_MIN_DELAY_MS, o as createCompactionDiagId, p as resolveMaxRunRetryIterations, r as RUNTIME_AUTH_REFRESH_RETRY_MS, s as isAssistantForModelRef, t as RUNTIME_AUTH_REFRESH_MARGIN_MS, u as resolveFinalAssistantRawText, v as resolveReportedModelRef, x as mergeUsageIntoAccumulator, y as resolveSameModelRateLimitRetryDelayMs } from "./helpers-AZJkDTWd.js";
import { n as mapThinkingLevelForProvider, r as normalizeContextTokenBudget } from "./utils-CefVZRZM.js";
import { n as resolveAgentRunSessionTarget, t as applyAgentRunSessionTargetIdentity } from "./run-session-target-Dw5KCZj4.js";
import { t as DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON } from "./compact-reasons-CZXtIq5M.js";
import { t as readAgentModelContextTokens } from "./model-context-tokens-C7jGfEZp.js";
import { n as buildHandledBeforeAgentReplyPayloads, r as runBeforeAgentReplyForTurn, t as buildEmbeddedRunPayloads } from "./payloads-NfuDeA4g.js";
import { n as resolveRunWorkspaceDir, t as redactRunIdentifier } from "./workspace-run-CtHGAsQu.js";
import { i as stripOpenClawMcpToolPrefix, t as OPENCLAW_MCP_TOOL_PREFIX } from "./tool-policy-DG4CDDHR.js";
import { t as resolveEmbeddedCliBackendDispatchEligibility } from "./cli-backend-dispatch-eligibility-nfYp7Bx3.js";
import { n as buildAgentRuntimePlan } from "./build-B9vAwyJq.js";
import { n as createAgentHarnessTaskRuntimeScope } from "./agent-harness-task-runtime-scope-uxOv49aZ.js";
import { r as shouldSwitchToLiveModel, t as clearLiveModelSwitchPending } from "./live-model-switch-ZRvkn9KR.js";
import { a as resolveHookModelSelection, i as resolveEmbeddedRuntimeModelPolicy, n as createNativeModelOwnedRuntimeModel, o as resolveNativeModelOwnedHarnessId, r as resolveAgentHarnessRunAdmissionError, t as buildBeforeModelResolveAttachments } from "./setup-zUSJFlDF.js";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-C-fEJI6p.js";
import { t as resolveExternalCliAuthOverlayScopeFromSelection } from "./external-cli-auth-selection-e6Tb0vkP.js";
import { a as withSessionPlacementTurnAdmission } from "./session-placement-admission-C_WzNYGC.js";
import { n as readChannelSourceTurnId, r as readChannelSourceTurnSameThreadRequired } from "./source-turn-id-DkfnVuuJ.js";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
//#region src/context-engine/types.ts
/**
* Resolve the post-compaction live transcript identity from a compact result.
*
* Prefers the typed `sessionTarget`. Reading the raw fields is the named
* compat path for shipped third-party engines that predate `sessionTarget`;
* it is removed together with the deprecated `sessionFile` result field.
*/
function resolveCompactionSuccessorTranscript(result) {
	return {
		sessionId: (result.result?.sessionTarget)?.sessionId ?? result.result?.sessionId,
		sessionFile: result.result?.sessionFile
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/compact.queued.ts
/**
* Queues embedded-agent session compaction onto the correct command lane.
*/
const compactionCheckpointStore = createFileBackedCompactionCheckpointStore();
function shouldFallbackAfterHarnessCompaction(result) {
	return isRecoverableNativeHarnessBindingFailure(result);
}
function lockedCompactionRuntimeFailure(runtime) {
	return {
		ok: false,
		compacted: false,
		reason: runtime ? `Model selection is locked to native agent harness "${runtime}", but native compaction is unavailable.` : "Model selection is locked but the persisted agent harness is unavailable.",
		failure: { reason: "model_selection_locked" }
	};
}
const DEFERRED_CONTEXT_ENGINE_COMPACTION_SCHEDULE_FAILURE_REASON = "failed to schedule background context-engine maintenance";
const MANUAL_COMPACTION_ACTIVE_RUN_REASON = "manual compaction unavailable while another embedded run is active";
const COMPACTION_ABORTED_REASON = "compaction aborted";
function createCompactionAbortedResult() {
	return {
		ok: false,
		compacted: false,
		reason: COMPACTION_ABORTED_REASON
	};
}
function resolveManualCompactionActiveRunSessionId(params) {
	return (isEmbeddedAgentRunHandleActive(params.sessionId) ? params.sessionId : void 0) ?? (params.sessionKey ? resolveActiveEmbeddedRunHandleSessionId(params.sessionKey) : void 0) ?? resolveActiveEmbeddedRunHandleSessionIdBySessionFile(params.sessionFile);
}
function shouldDeferOwningContextEngineBudgetCompaction(params) {
	return params.compactParams.deferOwningContextEngineCompaction === true && params.compactParams.trigger === "budget" && params.contextEngine.info.ownsCompaction === true && params.contextEngine.info.turnMaintenanceMode === "background" && typeof params.contextEngine.maintain === "function";
}
function buildContextEngineCompactionSessionTarget$1(params) {
	const sqliteMarker = parseSqliteSessionFileMarker(params.sessionFile);
	const agentId = params.sessionTarget?.agentId ?? params.agentId ?? sqliteMarker?.agentId;
	const sessionKey = params.sessionTarget?.sessionKey ?? params.sessionKey ?? params.sessionId;
	const storePath = params.sessionTarget?.storePath ?? sqliteMarker?.storePath;
	return {
		...agentId ? { agentId } : {},
		sessionId: params.sessionTarget?.sessionId ?? sqliteMarker?.sessionId ?? params.sessionId,
		...sessionKey ? { sessionKey } : {},
		...storePath ? { storePath } : {},
		...params.sessionTarget?.threadId !== void 0 ? { threadId: params.sessionTarget.threadId } : {}
	};
}
async function disposeContextEngine(contextEngine) {
	try {
		await contextEngine.dispose?.();
	} catch (err) {
		log$3.warn("context engine dispose failed", { errorMessage: formatErrorMessage(err) });
	}
}
async function deferOwningContextEngineBudgetCompaction(params) {
	let deferredScheduled = false;
	let deferredScheduleFailure;
	try {
		await runContextEngineMaintenance({
			contextEngine: params.contextEngine,
			sessionId: params.compactParams.sessionId,
			sessionKey: params.compactParams.sessionKey,
			sessionTarget: buildContextEngineCompactionSessionTarget$1(params.compactParams),
			sessionFile: params.compactParams.sessionFile,
			reason: "turn",
			runtimeContext: params.contextEngineRuntimeContext,
			runtimeSettings: params.contextEngineRuntimeSettings,
			config: params.compactParams.config,
			disposeDeferredContextEngineAfterMaintenance: true,
			onDeferredMaintenance: () => {
				deferredScheduled = true;
			},
			onDeferredMaintenanceFailure: (error) => {
				deferredScheduleFailure = error;
			}
		});
	} catch (err) {
		log$3.warn("failed to defer context-engine budget compaction", { errorMessage: formatErrorMessage(err) });
	}
	if (!deferredScheduled || deferredScheduleFailure) {
		log$3.warn(`[compaction] failed to schedule context-engine-owned budget compaction background maintenance (sessionKey=${params.compactParams.sessionKey ?? params.compactParams.sessionId}${deferredScheduleFailure ? ` error=${formatErrorMessage(deferredScheduleFailure)}` : ""})`);
		return {
			ok: false,
			compacted: false,
			reason: DEFERRED_CONTEXT_ENGINE_COMPACTION_SCHEDULE_FAILURE_REASON,
			failure: { reason: "deferred_compaction_not_scheduled" }
		};
	}
	log$3.info(`[compaction] deferred context-engine-owned budget compaction to background maintenance (sessionKey=${params.compactParams.sessionKey ?? params.compactParams.sessionId} scheduled=${String(deferredScheduled)})`);
	return {
		ok: true,
		compacted: false,
		reason: DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON
	};
}
function mergeSecondaryNativeHarnessCompactionDetails(params) {
	if (!params.nativeResult) return params.details;
	if (params.details && typeof params.details === "object" && !Array.isArray(params.details)) return {
		...params.details,
		[params.detailsKey]: params.nativeResult
	};
	if (params.details !== void 0) return {
		contextEngine: params.details,
		[params.detailsKey]: params.nativeResult
	};
	return { [params.detailsKey]: params.nativeResult };
}
/**
* Compacts a session with lane queueing (session lane + global lane).
* Use this from outside a lane context. If already inside a lane, use
* `compactEmbeddedAgentSessionDirect` to avoid deadlocks.
*/
async function compactEmbeddedAgentSession(params) {
	if (params.trigger !== "manual") return await compactEmbeddedAgentSessionImpl(params);
	if (resolveManualCompactionActiveRunSessionId(params)) return {
		ok: false,
		compacted: false,
		reason: MANUAL_COMPACTION_ACTIVE_RUN_REASON,
		failure: { reason: "active_run" }
	};
	const controller = new AbortController();
	const abortSignal = params.abortSignal ? AbortSignal.any([params.abortSignal, controller.signal]) : controller.signal;
	const handle = {
		kind: "embedded",
		queueMessage: async () => {},
		isStreaming: () => true,
		isCompacting: () => true,
		abort: (reason) => controller.abort(reason ?? "user_abort"),
		cancel: (reason) => controller.abort(reason ?? "user_abort")
	};
	setActiveEmbeddedRun(params.sessionId, handle, params.sessionKey, params.sessionFile);
	try {
		return await compactEmbeddedAgentSessionImpl({
			...params,
			abortSignal
		});
	} finally {
		clearActiveEmbeddedRun(params.sessionId, handle, params.sessionKey, params.sessionFile);
	}
}
async function compactEmbeddedAgentSessionImpl(params) {
	if (params.abortSignal?.aborted) return createCompactionAbortedResult();
	ensureRuntimePluginsLoaded({
		config: params.config,
		workspaceDir: params.workspaceDir,
		allowGatewaySubagentBinding: params.allowGatewaySubagentBinding
	});
	ensureContextEnginesInitialized();
	const agentIds = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId
	});
	const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, agentIds.sessionAgentId);
	const resolvedWorkspaceDir = resolveUserPath(params.workspaceDir);
	const contextEngine = await resolveContextEngine(params.config, {
		agentDir,
		workspaceDir: resolvedWorkspaceDir
	});
	let disposeContextEngineOnExit = true;
	try {
		return await compactResolvedContextEngine(params, contextEngine, agentDir, resolvedWorkspaceDir, () => {
			disposeContextEngineOnExit = false;
		});
	} finally {
		if (disposeContextEngineOnExit) await disposeContextEngine(contextEngine);
	}
}
async function compactResolvedContextEngine(params, contextEngine, agentDir, resolvedWorkspaceDir, releaseContextEngineOwnership) {
	const runtimePolicySessionKey = params.sandboxSessionKey ?? params.sessionKey;
	const runtimePolicyAgentId = params.sandboxSessionKey && parseAgentSessionKey(params.sandboxSessionKey) ? void 0 : params.agentId;
	const policyCompactionTarget = resolveEmbeddedCompactionTarget({
		config: params.config,
		provider: params.provider,
		modelId: params.model,
		authProfileId: params.authProfileId,
		modelSelectionLocked: params.modelSelectionLocked,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const policyProvider = policyCompactionTarget.provider ?? "openai";
	const policyModelId = policyCompactionTarget.model ?? "gpt-5.6-sol";
	const configuredHarnessPolicy = resolveAgentHarnessPolicy({
		provider: policyProvider,
		modelId: policyModelId,
		config: params.config,
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey
	});
	const configuredHarnessRuntime = configuredHarnessPolicy.runtimeSource && configuredHarnessPolicy.runtimeSource !== "implicit" && !isDefaultAgentRuntimeId(configuredHarnessPolicy.runtime) ? configuredHarnessPolicy.runtime : void 0;
	const lockedHarnessRuntime = params.modelSelectionLocked === true ? normalizeOptionalAgentRuntimeId(params.agentHarnessId) : void 0;
	if (params.modelSelectionLocked === true && (!lockedHarnessRuntime || lockedHarnessRuntime === "auto")) return lockedCompactionRuntimeFailure();
	const selectedHarnessRuntime = params.modelSelectionLocked === true ? lockedHarnessRuntime : resolveCompactionHarnessRuntime({
		boundHarnessRuntime: params.agentHarnessId,
		preparedRuntimePlan: params.runtimePlan,
		configuredHarnessRuntime,
		provider: policyProvider,
		modelId: policyModelId
	});
	const lockedNativeHarness = params.modelSelectionLocked === true && selectedHarnessRuntime !== "openclaw";
	const resolvedCompactionTarget = resolveEmbeddedCompactionTarget({
		config: params.config,
		provider: params.provider,
		modelId: params.model,
		authProfileId: params.authProfileId,
		harnessRuntime: selectedHarnessRuntime,
		modelSelectionLocked: params.modelSelectionLocked,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const ceProvider = resolvedCompactionTarget.provider ?? "openai";
	const ceRuntimeProvider = resolvedCompactionTarget.runtimeProvider ?? ceProvider;
	const ceContextConfigProvider = resolvedCompactionTarget.contextProvider ?? ceProvider;
	const ceModelId = resolvedCompactionTarget.model ?? "gpt-5.6-sol";
	const { plan: reusableRuntimeAuthPlan, modelAuth: initialModelAuth } = resolveReusableRuntimeModelAuth({
		plan: params.runtimeAuthPlan ?? params.runtimePlan?.auth,
		provider: ceProvider,
		modelId: ceModelId,
		authProfileId: resolvedCompactionTarget.authProfileId
	});
	const attemptNativeHarnessCompaction = shouldAttemptNativeHarnessCompaction({
		provider: ceProvider,
		nativeHarnessCompaction: resolvedCompactionTarget.nativeHarnessCompaction,
		selectedHarnessRuntime
	});
	let effectiveRuntimeModel;
	let preparedHarnessRuntime = selectedHarnessRuntime;
	let preparedParams = params;
	try {
		await ensureSelectedAgentHarnessPlugin({
			config: params.config,
			provider: ceProvider,
			modelId: ceModelId,
			agentId: runtimePolicyAgentId,
			sessionKey: runtimePolicySessionKey,
			agentHarnessId: params.agentHarnessId,
			agentHarnessRuntimeOverride: selectedHarnessRuntime,
			workspaceDir: resolvedWorkspaceDir
		});
		const { model: ceModel, authStorage, modelRegistry } = await resolveModelAsync(ceRuntimeProvider, ceModelId, agentDir, params.config, initialModelAuth);
		const ceRuntimeModel = ceModel;
		const runtimeAuthProfileStore = isOpenAIProvider(ceProvider) ? ensureAuthProfileStore(agentDir, {
			externalCliProviderIds: ["openai"],
			allowKeychainPrompt: false
		}) : ensureAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: false });
		const selectHarnessForPreparedAttempts = (attempts) => selectAgentHarnessForPreparedModelProviders({
			provider: ceProvider,
			modelId: ceModelId,
			modelProviders: attempts.map((attempt) => buildCompactionHarnessModelProvider({
				model: ceRuntimeModel,
				plan: attempt.plan,
				attempt
			})),
			config: params.config,
			agentId: runtimePolicyAgentId,
			sessionKey: runtimePolicySessionKey,
			agentHarnessId: params.agentHarnessId,
			agentHarnessRuntimeOverride: selectedHarnessRuntime
		});
		const initialHarness = reusableRuntimeAuthPlan ? void 0 : selectAgentHarness({
			provider: ceProvider,
			modelId: ceModelId,
			modelProvider: buildCompactionHarnessModelProvider({ model: ceRuntimeModel }),
			config: params.config,
			agentId: runtimePolicyAgentId,
			sessionKey: runtimePolicySessionKey,
			agentHarnessId: params.agentHarnessId,
			agentHarnessRuntimeOverride: selectedHarnessRuntime
		});
		const prepareRuntimeAuth = (harness) => prepareAgentRuntimeAuth({
			provider: ceProvider,
			modelId: ceModelId,
			modelApi: ceRuntimeModel?.api,
			modelBaseUrl: ceRuntimeModel?.baseUrl,
			config: params.config,
			env: process.env,
			agentDir,
			workspaceDir: resolvedWorkspaceDir,
			authProfileStore: runtimeAuthProfileStore,
			sessionAuthProfileId: resolvedCompactionTarget.authProfileId,
			sessionAuthProfileSource: params.authProfileIdSource,
			harnessId: harness.id,
			harnessRuntime: harness.id,
			harnessAuthBootstrap: harness.authBootstrap
		});
		let runtimeAuthPreparation = reusableRuntimeAuthPlan ? {
			plan: reusableRuntimeAuthPlan,
			attempts: [{
				kind: "implicit",
				plan: reusableRuntimeAuthPlan
			}]
		} : prepareRuntimeAuth(initialHarness);
		let selectedPreparedHarness = selectHarnessForPreparedAttempts(runtimeAuthPreparation.attempts);
		if (!reusableRuntimeAuthPlan && selectedPreparedHarness.id !== initialHarness?.id) {
			runtimeAuthPreparation = prepareRuntimeAuth(selectedPreparedHarness);
			const confirmedHarness = selectHarnessForPreparedAttempts(runtimeAuthPreparation.attempts);
			if (confirmedHarness.id !== selectedPreparedHarness.id) throw new Error(`Prepared queued compaction auth routes did not converge on one agent harness for ${ceProvider}/${ceModelId}.`);
			selectedPreparedHarness = confirmedHarness;
		}
		preparedHarnessRuntime = selectedPreparedHarness.id;
		const runtimeAuthPlan = runtimeAuthPreparation.plan;
		const providerUsesProfileScopedModelMetadata = providerUsesCredentialScopedModelMetadata({
			provider: ceRuntimeProvider,
			modelId: ceModelId,
			config: params.config,
			agentDir,
			workspaceDir: resolvedWorkspaceDir
		});
		effectiveRuntimeModel = await materializePreparedRuntimeModel({
			plan: runtimeAuthPlan,
			provider: ceProvider,
			modelId: ceModelId,
			config: params.config,
			model: ceRuntimeModel,
			forceResolve: providerUsesProfileScopedModelMetadata && Boolean(runtimeAuthPlan.selectedAuthMode),
			resolveModel: async ({ config, authProfileId, authProfileMode }) => {
				const resolved = await resolveModelAsync(ceRuntimeProvider, ceModelId, agentDir, config, {
					authStorage,
					modelRegistry,
					skipAgentDiscovery: true,
					allowBundledStaticCatalogFallback: true,
					preferBundledStaticCatalogTransport: true,
					workspaceDir: resolvedWorkspaceDir,
					authProfileId,
					authProfileMode
				});
				return {
					...resolved,
					model: resolved.model
				};
			}
		});
		preparedParams = {
			...params,
			provider: ceProvider,
			model: ceModelId,
			agentHarnessId: preparedHarnessRuntime,
			...reusableRuntimeAuthPlan ? {
				authProfileId: runtimeAuthPlan.forwardedAuthProfileId,
				authProfileIdSource: runtimeAuthPlan.forwardedAuthProfileSource,
				runtimeAuthPlan
			} : {
				authProfileId: resolvedCompactionTarget.authProfileId,
				authProfileIdSource: resolvedCompactionTarget.authProfileId ? params.authProfileIdSource : void 0,
				runtimeAuthPlan: void 0,
				runtimePlan: void 0
			}
		};
	} catch (err) {
		await disposeContextEngine(contextEngine);
		releaseContextEngineOwnership();
		throw err;
	}
	const resolvedContextTokenBudget = normalizeContextTokenBudget(resolveContextWindowInfo({
		cfg: params.config,
		provider: ceContextConfigProvider,
		modelId: ceModelId,
		modelContextTokens: readAgentModelContextTokens(effectiveRuntimeModel),
		modelContextWindow: effectiveRuntimeModel?.contextWindow,
		defaultTokens: 2e5
	}).tokens) ?? 2e5;
	const requestedContextTokenBudget = normalizeContextTokenBudget(params.contextTokenBudget);
	const contextTokenBudget = Math.min(requestedContextTokenBudget ?? resolvedContextTokenBudget, resolvedContextTokenBudget);
	const contextEngineRuntimeContext = buildCompactionContextEngineRuntimeContext({
		params: preparedParams,
		agentDir,
		harnessRuntime: preparedHarnessRuntime,
		contextTokenBudget,
		contextEnginePluginId: resolveContextEngineOwnerPluginId(contextEngine)
	});
	const contextEngineRuntimeSettings = buildContextEngineRuntimeSettings({
		contextEngineHost: OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
		provider: ceProvider,
		requestedModel: params.model,
		resolvedModel: ceModelId,
		selectedContextEngineId: contextEngine.info.id,
		contextEngineSelectionSource: contextEngine.info.id === "legacy" ? "default" : "configured",
		promptTokenBudget: contextTokenBudget
	});
	const contextEngineOwnsCompaction = contextEngine.info.ownsCompaction === true;
	const harnessResult = attemptNativeHarnessCompaction && (!contextEngineOwnsCompaction || lockedNativeHarness) ? await maybeCompactAgentHarnessSession({
		...preparedParams,
		runtimeModel: effectiveRuntimeModel,
		contextEngine,
		contextTokenBudget,
		contextEngineRuntimeContext
	}) : void 0;
	if (lockedNativeHarness) return harnessResult ?? lockedCompactionRuntimeFailure(selectedHarnessRuntime);
	if (harnessResult) {
		if (!shouldFallbackAfterHarnessCompaction(harnessResult)) return harnessResult;
		log$3.warn(`native harness compaction could not use its session binding; falling back to context engine: ${harnessResult.reason ?? "unknown"}`);
	}
	if (shouldDeferOwningContextEngineBudgetCompaction({
		compactParams: preparedParams,
		contextEngine
	})) {
		const deferredResult = await deferOwningContextEngineBudgetCompaction({
			compactParams: preparedParams,
			contextEngine,
			contextEngineRuntimeContext,
			contextEngineRuntimeSettings
		});
		if (deferredResult.ok) releaseContextEngineOwnership();
		return deferredResult;
	}
	const sessionLane = resolveSessionLane(params.sessionKey?.trim() || params.sessionId);
	const globalLane = resolveGlobalLane(params.lane);
	const enqueueGlobal = params.enqueue ?? ((task, opts) => enqueueCommandInLane(globalLane, task, opts));
	return await enqueueCommandInLane(sessionLane, () => enqueueGlobal(async () => {
		let checkpointSnapshot;
		let checkpointSnapshotRetained = false;
		try {
			if (params.abortSignal?.aborted) return createCompactionAbortedResult();
			const engineOwnsCompaction = contextEngine.info.ownsCompaction === true;
			const isSqliteSessionTranscript = Boolean(parseSqliteSessionFileMarker(params.sessionFile));
			checkpointSnapshot = engineOwnsCompaction ? await compactionCheckpointStore.captureSnapshot({
				sessionFile: params.sessionFile,
				...isSqliteSessionTranscript ? { sessionManager: SessionManager.open(params.sessionFile) } : {}
			}) : null;
			const hookRunner = engineOwnsCompaction ? asCompactionHookRunner(getGlobalHookRunner()) : null;
			const hookSessionKey = params.sessionKey?.trim() || params.sessionId;
			const { sessionAgentId } = resolveSessionAgentIds({
				sessionKey: params.sessionKey,
				config: params.config,
				agentId: params.agentId
			});
			const resolvedMessageProvider = params.messageChannel ?? params.messageProvider;
			const hookCtx = {
				sessionId: params.sessionId,
				agentId: sessionAgentId,
				sessionKey: hookSessionKey,
				workspaceDir: resolvedWorkspaceDir,
				messageProvider: resolvedMessageProvider
			};
			const runtimeContext = contextEngineRuntimeContext;
			if (hookRunner?.hasHooks?.("before_compaction") && hookRunner.runBeforeCompaction) try {
				await hookRunner.runBeforeCompaction({
					messageCount: -1,
					sessionFile: params.sessionFile
				}, hookCtx);
			} catch (err) {
				log$3.warn("before_compaction hook failed", { errorMessage: formatErrorMessage(err) });
			}
			let result;
			try {
				const compactionSessionTarget = buildContextEngineCompactionSessionTarget$1(params);
				result = await compactContextEngineWithSafetyTimeout(contextEngine, {
					sessionId: params.sessionId,
					sessionKey: hookSessionKey,
					...compactionSessionTarget.agentId ? { agentId: compactionSessionTarget.agentId } : {},
					sessionTarget: compactionSessionTarget,
					tokenBudget: contextTokenBudget,
					currentTokenCount: params.currentTokenCount,
					compactionTarget: params.trigger === "manual" ? "threshold" : "budget",
					customInstructions: params.customInstructions,
					force: params.force === true || params.forcePreflight === true || params.preflightRequired === true || params.trigger === "manual",
					runtimeContext: {
						...runtimeContext,
						forceReason: params.forcePreflight === true || params.preflightRequired === true ? "preflight_required" : params.trigger === "manual" ? "manual" : void 0,
						preflightCompactionTrigger: params.preflightCompactionTrigger
					},
					runtimeSettings: contextEngineRuntimeSettings
				}, resolveCompactionTimeoutMs(params.config), params.abortSignal);
			} catch (compactErr) {
				log$3.warn("context-engine compaction failed", { errorMessage: formatErrorMessage(compactErr) });
				result = {
					ok: false,
					compacted: false,
					reason: formatErrorMessage(compactErr)
				};
			}
			const delegatedSuccessor = resolveCompactionSuccessorTranscript(result);
			const delegatedSessionTarget = result.result?.sessionTarget;
			const delegatedSessionId = delegatedSuccessor.sessionId;
			const delegatedSessionFile = delegatedSuccessor.sessionFile;
			const delegatedRotatedTranscript = typeof delegatedSessionId === "string" && delegatedSessionId !== params.sessionId || typeof delegatedSessionFile === "string" && delegatedSessionFile !== params.sessionFile;
			let postCompactionSessionId = delegatedSessionId ?? params.sessionId;
			let postCompactionSessionFile = delegatedSessionFile ?? params.sessionFile;
			if (delegatedSessionTarget) {
				const resolvedDelegatedTarget = await resolveAgentRunSessionTarget({
					agentId: delegatedSessionTarget.agentId ?? sessionAgentId,
					config: params.config,
					sessionId: delegatedSessionTarget.sessionId ?? postCompactionSessionId,
					sessionKey: delegatedSessionTarget.sessionKey ?? params.sessionKey,
					sessionTarget: delegatedSessionTarget
				});
				postCompactionSessionId = resolvedDelegatedTarget.sessionId;
				postCompactionSessionFile = resolvedDelegatedTarget.sessionFile;
			}
			let postCompactionLeafId;
			if (result.ok && result.compacted) {
				if (shouldRotateCompactionTranscript(params.config) && !delegatedRotatedTranscript && !isSqliteSessionTranscript) try {
					const rotation = await rotateTranscriptFileAfterCompaction({ sessionFile: params.sessionFile });
					if (rotation.rotated) {
						postCompactionSessionId = rotation.sessionId ?? postCompactionSessionId;
						postCompactionSessionFile = rotation.sessionFile ?? postCompactionSessionFile;
						postCompactionLeafId = rotation.leafId;
						log$3.info(`[compaction] rotated active transcript after context-engine compaction (sessionKey=${params.sessionKey ?? params.sessionId})`);
					}
				} catch (err) {
					log$3.warn("failed to rotate compacted transcript", { errorMessage: formatErrorMessage(err) });
				}
				if (params.config && params.sessionKey && checkpointSnapshot) try {
					const transcriptState = await readSessionLeafStateFromTranscriptAsync(postCompactionSessionFile);
					const checkpointPosition = resolveCompactionCheckpointTranscriptPosition({
						preferredLeafId: postCompactionLeafId,
						transcriptState
					});
					checkpointSnapshotRetained = await compactionCheckpointStore.persistCheckpoint({
						cfg: params.config,
						sessionKey: params.sessionKey,
						sessionId: postCompactionSessionId,
						reason: resolveSessionCompactionCheckpointReason({ trigger: params.trigger }),
						snapshot: checkpointSnapshot,
						summary: result.result?.summary,
						firstKeptEntryId: result.result?.firstKeptEntryId,
						tokensBefore: result.result?.tokensBefore,
						tokensAfter: result.result?.tokensAfter,
						postSessionFile: postCompactionSessionFile,
						postLeafId: checkpointPosition.leafId,
						postEntryId: checkpointPosition.entryId
					}) !== null;
				} catch (err) {
					log$3.warn("failed to persist compaction checkpoint", { errorMessage: formatErrorMessage(err) });
				}
				await runContextEngineMaintenance({
					contextEngine,
					sessionId: postCompactionSessionId,
					sessionKey: params.sessionKey,
					sessionTarget: buildContextEngineCompactionSessionTarget$1({
						...params,
						sessionFile: postCompactionSessionFile,
						sessionId: postCompactionSessionId,
						sessionTarget: delegatedSessionTarget ?? params.sessionTarget
					}),
					sessionFile: postCompactionSessionFile,
					reason: "compaction",
					runtimeContext,
					runtimeSettings: contextEngineRuntimeSettings,
					config: params.config
				});
			}
			if (engineOwnsCompaction && result.ok && result.compacted) await runPostCompactionSideEffects({
				config: params.config,
				sessionKey: params.sessionKey,
				sessionId: postCompactionSessionId,
				agentId: sessionAgentId,
				sessionFile: postCompactionSessionFile
			});
			if (result.ok && result.compacted && hookRunner?.hasHooks?.("after_compaction") && hookRunner.runAfterCompaction) try {
				const afterHookCtx = {
					...hookCtx,
					sessionId: postCompactionSessionId
				};
				await hookRunner.runAfterCompaction({
					messageCount: -1,
					compactedCount: -1,
					tokenCount: result.result?.tokensAfter,
					sessionFile: postCompactionSessionFile,
					...postCompactionSessionId !== params.sessionId ? { previousSessionId: params.sessionId } : {}
				}, afterHookCtx);
			} catch (err) {
				log$3.warn("after_compaction hook failed", { errorMessage: formatErrorMessage(err) });
			}
			let secondaryNativeHarnessCompaction;
			if (engineOwnsCompaction && result.ok && result.compacted && attemptNativeHarnessCompaction) try {
				secondaryNativeHarnessCompaction = await maybeCompactAgentHarnessSession({
					...preparedParams,
					sessionId: postCompactionSessionId,
					sessionFile: postCompactionSessionFile,
					runtimeModel: effectiveRuntimeModel,
					contextEngine,
					contextTokenBudget,
					contextEngineRuntimeContext
				}, { nativeCompactionRequest: "after_context_engine" });
				if (secondaryNativeHarnessCompaction && !secondaryNativeHarnessCompaction.ok) log$3.warn("secondary native harness compaction failed after context-engine compaction", { reason: secondaryNativeHarnessCompaction.reason });
			} catch (err) {
				secondaryNativeHarnessCompaction = {
					ok: false,
					compacted: false,
					reason: formatErrorMessage(err)
				};
				log$3.warn("secondary native harness compaction threw after context-engine compaction", { errorMessage: formatErrorMessage(err) });
			}
			const secondaryNativeDetailsKey = normalizeOptionalAgentRuntimeId(preparedHarnessRuntime) === "codex" ? "codexNativeCompaction" : "nativeHarnessCompaction";
			return {
				ok: result.ok,
				compacted: result.compacted,
				reason: result.reason,
				result: result.result ? {
					summary: result.result.summary ?? "",
					firstKeptEntryId: result.result.firstKeptEntryId ?? "",
					tokensBefore: result.result.tokensBefore,
					tokensAfter: result.result.tokensAfter,
					details: mergeSecondaryNativeHarnessCompactionDetails({
						details: result.result.details,
						nativeResult: secondaryNativeHarnessCompaction,
						detailsKey: secondaryNativeDetailsKey
					}),
					...postCompactionSessionId !== params.sessionId ? { sessionId: postCompactionSessionId } : {},
					...postCompactionSessionFile !== params.sessionFile ? { sessionFile: postCompactionSessionFile } : {}
				} : void 0
			};
		} finally {
			if (!checkpointSnapshotRetained) await compactionCheckpointStore.cleanupSnapshot(checkpointSnapshot);
		}
	}));
}
function shouldAttemptNativeHarnessCompaction(params) {
	const selectedRuntime = normalizeOptionalAgentRuntimeId(params.selectedHarnessRuntime);
	if (!selectedRuntime || selectedRuntime === "auto" || selectedRuntime === "openclaw") return false;
	return isOpenAIProvider(params.provider) ? params.nativeHarnessCompaction === true : true;
}
function buildCompactionContextEngineRuntimeContext(params) {
	const { sessionAgentId } = resolveSessionAgentIds({
		sessionKey: params.params.sessionKey,
		config: params.params.config,
		agentId: params.params.agentId
	});
	const { sessionFile: _sessionFile, ...runtimeParams } = params.params;
	return {
		...runtimeParams,
		sessionTarget: buildContextEngineCompactionSessionTarget$1(params.params),
		...buildEmbeddedCompactionRuntimeContext({
			sessionKey: params.params.sessionKey,
			messageChannel: params.params.messageChannel,
			messageProvider: params.params.messageProvider,
			agentAccountId: params.params.agentAccountId,
			currentChannelId: params.params.currentChannelId,
			currentThreadTs: params.params.currentThreadTs,
			currentMessageId: params.params.currentMessageId,
			authProfileId: params.params.authProfileId,
			authProfileIdSource: params.params.authProfileIdSource,
			runtimeAuthPlan: params.params.runtimeAuthPlan,
			workspaceDir: params.params.workspaceDir,
			cwd: params.params.cwd,
			agentDir: params.agentDir,
			config: params.params.config,
			skillsSnapshot: params.params.skillsSnapshot,
			senderIsOwner: params.params.senderIsOwner,
			senderId: params.params.senderId,
			provider: params.params.provider,
			modelId: params.params.model,
			harnessRuntime: params.harnessRuntime,
			modelSelectionLocked: params.params.modelSelectionLocked,
			modelFallbacksOverride: params.params.modelFallbacksOverride,
			thinkLevel: params.params.thinkLevel,
			reasoningLevel: params.params.reasoningLevel,
			bashElevated: params.params.bashElevated,
			extraSystemPrompt: params.params.extraSystemPrompt,
			sourceReplyDeliveryMode: params.params.sourceReplyDeliveryMode,
			ownerNumbers: params.params.ownerNumbers
		}),
		...resolveContextEngineCapabilities({
			config: params.params.config,
			sessionKey: params.params.sessionKey,
			agentId: sessionAgentId,
			authProfileId: params.params.authProfileId,
			contextEnginePluginId: params.contextEnginePluginId,
			purpose: "context-engine.compaction"
		}),
		tokenBudget: params.contextTokenBudget,
		currentTokenCount: params.params.currentTokenCount
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/cli-backend-dispatch-transcript.ts
/**
* Transcript recorder for CLI-dispatched embedded runs.
*
* The CLI backend runs its tool loop inside the external process and writes
* no OpenClaw transcript records, but one-shot callers (e.g. active-memory
* recall) read the run's transcript for timeout partial-text salvage,
* tool-result evidence, and a live terminal-search watcher that polls
* mid-run. Mirror the run into canonical transcript records through the
* session accessor: the user turn at start, tool calls/results as they
* stream, and the final assistant snapshot at run end.
*/
const log$2 = createSubsystemLogger("agents/embedded-cli-dispatch");
/**
* Records a CLI-dispatched run into the run's session transcript by session
* identity. Tool records append as events arrive (the terminal-search
* watcher polls the transcript live); the assistant snapshot is held in
* memory and flushed once at finalize (or immediately on abort) so streamed
* text does not append a record per delta while timeout salvage still finds
* the last text the model produced.
*/
function createCliDispatchTranscriptRecorder(params) {
	let tail = Promise.resolve();
	let lastAssistantText = "";
	let lastWrittenAssistantText = "";
	let finalized = false;
	let toolRecordSequence = 0;
	const scope = {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		sessionFile: params.sessionFile
	};
	const enqueue = (build) => {
		tail = tail.then(async () => {
			await appendTranscriptMessage(scope, {
				message: build(),
				config: params.config,
				cwd: params.cwd
			});
		});
		tail = tail.catch((error) => {
			log$2.warn(`cli dispatch transcript append failed: runId=${params.runId} error=${String(error)}`);
		});
	};
	const model = {
		api: "cli",
		provider: params.provider,
		id: params.model ?? ""
	};
	const buildZeroUsageAssistantMessage = (content, stopReason) => buildAssistantMessage({
		model,
		content,
		stopReason,
		usage: buildUsageWithNoCost({})
	});
	enqueue(() => ({
		role: "user",
		content: [{
			type: "text",
			text: params.prompt
		}],
		timestamp: Date.now()
	}));
	return {
		noteToolEvent: (event) => {
			if (finalized) return;
			toolRecordSequence += 1;
			const toolCallId = event.toolCallId?.trim() || `${params.runId}-tool-${String(toolRecordSequence)}`;
			if (event.phase === "start") {
				enqueue(() => buildZeroUsageAssistantMessage([{
					type: "toolCall",
					id: toolCallId,
					name: event.toolName,
					arguments: event.args ?? {}
				}], "toolUse"));
				return;
			}
			enqueue(() => ({
				role: "toolResult",
				toolCallId,
				toolName: event.toolName,
				content: normalizeToolResultContent(event.result),
				details: readToolResultDetails(event.result),
				isError: event.isError === true,
				timestamp: Date.now()
			}));
		},
		noteAssistantText: (text) => {
			if (!finalized && text.trim()) lastAssistantText = text;
		},
		flushAssistantSnapshot: () => {
			if (finalized) return;
			const text = lastAssistantText.trim();
			if (!text || text === lastWrittenAssistantText) return;
			lastWrittenAssistantText = text;
			enqueue(() => buildZeroUsageAssistantMessage([{
				type: "text",
				text
			}], "aborted"));
		},
		finalize: async (finalText) => {
			if (finalized) {
				await tail;
				return;
			}
			finalized = true;
			const text = finalText?.trim() || lastAssistantText.trim();
			if (text && text !== lastWrittenAssistantText) {
				lastWrittenAssistantText = text;
				enqueue(() => buildZeroUsageAssistantMessage([{
					type: "text",
					text
				}], "stop"));
			}
			await tail;
		}
	};
}
/** Maps a sanitized CLI tool result onto transcript content blocks. */
function normalizeToolResultContent(result) {
	if (typeof result === "string") return result ? [{
		type: "text",
		text: result
	}] : [];
	if (!result || typeof result !== "object") return [];
	const content = Array.isArray(result) ? result : result.content;
	if (!Array.isArray(content)) return [];
	const blocks = [];
	for (const block of content) {
		if (typeof block === "string") {
			blocks.push({
				type: "text",
				text: block
			});
			continue;
		}
		if (!block || typeof block !== "object") continue;
		const type = block.type;
		const text = block.text;
		if (type === "text" && typeof text === "string") {
			blocks.push({
				type: "text",
				text
			});
			continue;
		}
		const data = block.data;
		const mimeType = block.mimeType;
		if (type === "image" && typeof data === "string" && typeof mimeType === "string") blocks.push({
			type: "image",
			data,
			mimeType
		});
	}
	return blocks;
}
function readToolResultDetails(result) {
	if (!result || typeof result !== "object") return;
	const details = result.details;
	return details && typeof details === "object" ? details : void 0;
}
//#endregion
//#region src/agents/embedded-agent-runner/cli-backend-dispatch.ts
/**
* Opt-in CLI-backend dispatch for one-shot embedded runs.
*
* Embedded runs targeting a CLI runtime provider normally fall through to the
* openclaw harness and call the provider API directly with that runtime's
* credentials (`cli_runtime_passthrough_openclaw`). Anthropic routes direct
* anthropic-messages calls on subscription OAuth tokens to metered "extra
* usage" billing: without extra-usage balance the passthrough fails closed
* with a billing error, and with it the run silently draws paid usage instead
* of the plan limits the CLI runtime was configured for. Callers that
* tolerate CLI latency opt in via `cliBackendDispatch: "subscription-auth"`
* to run through the CLI backend on plan limits instead.
*/
const log$1 = createSubsystemLogger("agents/embedded-cli-dispatch");
/**
* Runs the embedded turn through the CLI backend when the opt-in dispatch
* gate matches; returns undefined so the caller continues on the native path.
*/
async function runEmbeddedAgentViaCliBackendIfEligible(params) {
	const dispatch = resolveEmbeddedCliBackendDispatch(params);
	return dispatch ? await runEmbeddedAgentViaCliBackend(params, dispatch) : void 0;
}
/** Applies the opt-in and transcript-path gates on top of shared eligibility. */
function resolveEmbeddedCliBackendDispatch(params) {
	if (params.cliBackendDispatch !== "subscription-auth") return;
	const sessionFile = params.sessionFile?.trim();
	if (!sessionFile) return;
	const toolsAllow = resolveDispatchableToolsAllow(params);
	if (!toolsAllow) return;
	const eligibility = resolveEmbeddedCliBackendDispatchEligibility(params);
	return eligibility ? {
		provider: eligibility.provider,
		sessionFile,
		toolsAllow
	} : void 0;
}
/**
* Fail closed on tool policy: dispatch only runs whose embedded tool state the
* CLI bridge can express faithfully — a non-empty named allowlist bounded by
* the loopback grant. Deny-all (`[]`), wildcards, absent allowlists, and
* flag-based restrictions (`disableTools`, `modelRun`) keep the embedded
* passthrough so no closed state silently widens on the CLI surface; full
* translation can arrive with the first caller that needs it (#57326).
*/
function resolveDispatchableToolsAllow(params) {
	if (params.disableTools || params.modelRun) return;
	if (!params.toolsAllow || params.toolsAllow.length === 0) return;
	const names = params.toolsAllow.map((name) => normalizeToolName(name));
	if (names.some((name) => !name || name === "*" || name.includes("*"))) return;
	return [...new Set(names)];
}
/** Runs an opted-in embedded run through the CLI backend as a one-shot turn. */
async function runEmbeddedAgentViaCliBackend(params, dispatch) {
	const { runCliAgent } = await import("./cli-runner.runtime.js");
	const cliToolAvailability = {
		native: [],
		mcp: dispatch.toolsAllow.map((name) => `${OPENCLAW_MCP_TOOL_PREFIX}${name}`)
	};
	const onAgentToolResult = params.onAgentToolResult;
	const transcript = createCliDispatchTranscriptRecorder({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		sessionFile: dispatch.sessionFile,
		runId: params.runId,
		prompt: params.prompt,
		provider: dispatch.provider,
		model: params.model,
		cwd: params.cwd ?? params.workspaceDir,
		config: params.config
	});
	const unsubscribe = onAgentEvent((evt) => {
		if (evt.runId !== params.runId) return;
		if (evt.stream === "assistant" && typeof evt.data.text === "string") {
			transcript.noteAssistantText(evt.data.text);
			return;
		}
		if (evt.stream !== "tool") return;
		const phase = evt.data.phase;
		if (phase !== "start" && phase !== "result") return;
		const rawName = typeof evt.data.name === "string" ? evt.data.name : "";
		if (!rawName) return;
		const toolName = normalizeToolName(stripOpenClawMcpToolPrefix(rawName));
		const toolCallId = typeof evt.data.toolCallId === "string" ? evt.data.toolCallId : void 0;
		if (phase === "start") {
			transcript.noteToolEvent({
				phase,
				toolName,
				toolCallId,
				args: isRecord(evt.data.args) ? evt.data.args : void 0
			});
			return;
		}
		const isError = evt.data.isError === true || isToolResultError(evt.data.result);
		transcript.noteToolEvent({
			phase,
			toolName,
			toolCallId,
			result: evt.data.result,
			isError
		});
		onAgentToolResult?.({
			toolName,
			result: evt.data.result,
			isError
		});
	});
	const flushOnAbort = () => transcript.flushAssistantSnapshot();
	params.abortSignal?.addEventListener("abort", flushOnAbort, { once: true });
	params.onExecutionStarted?.(params.lifecycleGeneration !== void 0 ? { lifecycleGeneration: params.lifecycleGeneration } : void 0);
	log$1.info(`dispatching embedded run through CLI backend: runId=${params.runId} provider=${dispatch.provider} model=${params.model ?? ""}`);
	let finalAssistantText;
	try {
		const result = await runCliAgent({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			trigger: params.trigger,
			sessionFile: dispatch.sessionFile,
			workspaceDir: params.workspaceDir,
			agentDir: params.agentDir,
			config: params.config,
			prompt: params.prompt,
			provider: dispatch.provider,
			model: params.model,
			thinkLevel: params.thinkLevel,
			timeoutMs: params.timeoutMs,
			runTimeoutOverrideMs: params.runTimeoutOverrideMs ?? params.timeoutMs,
			runId: params.runId,
			lifecycleGeneration: params.lifecycleGeneration,
			lane: params.lane,
			extraSystemPrompt: params.extraSystemPrompt,
			messageChannel: params.messageChannel,
			messageProvider: params.messageProvider,
			bootstrapContextMode: params.bootstrapContextMode,
			bootstrapContextRunKind: params.bootstrapContextRunKind,
			abortSignal: params.abortSignal,
			onExecutionPhase: params.onExecutionPhase,
			cliToolAvailability,
			disableCliLiveSession: true,
			cleanupCliLiveSessionOnRunEnd: true,
			requireExplicitMessageTarget: true
		});
		finalAssistantText = result.payloads?.find((payload) => payload.isReasoning !== true && typeof payload.text === "string")?.text;
		return withoutCliSessionBinding(result);
	} finally {
		params.abortSignal?.removeEventListener("abort", flushOnAbort);
		unsubscribe();
		await transcript.finalize(finalAssistantText);
		if (params.cleanupBundleMcpOnRunEnd === true) await retireDispatchSessionMcpRuntime(params);
	}
}
/**
* Mirrors the embedded runner's cleanupBundleMcpOnRunEnd semantics for the
* CLI dispatch path: retire only this run's session-scoped MCP runtimes so
* stdio children do not idle until the TTL reaper, without touching the
* process-wide loopback server shared with concurrent CLI turns.
*/
async function retireDispatchSessionMcpRuntime(params) {
	try {
		const { retireSessionMcpRuntime, retireSessionMcpRuntimeForSessionKey } = await import("./agent-bundle-mcp-tools-DPNE7g6j.js");
		const onError = (error, sessionId) => {
			log$1.warn(`bundle-mcp cleanup failed after CLI dispatch run: runId=${params.runId} sessionId=${sessionId} error=${String(error)}`);
		};
		if (!await retireSessionMcpRuntimeForSessionKey({
			sessionKey: params.sessionKey,
			reason: "embedded-cli-dispatch-run-end",
			onError
		})) await retireSessionMcpRuntime({
			sessionId: params.sessionId,
			reason: "embedded-cli-dispatch-run-end",
			onError
		});
	} catch (error) {
		log$1.warn(`bundle-mcp cleanup unavailable after CLI dispatch run: runId=${params.runId} error=${String(error)}`);
	}
}
/** Dispatch runs own no session entry, so a returned CLI binding has no owner to persist it. */
function withoutCliSessionBinding(result) {
	const agentMeta = result.meta.agentMeta;
	if (!agentMeta?.cliSessionBinding && agentMeta?.clearCliSessionBinding !== true) return result;
	return {
		...result,
		meta: {
			...result.meta,
			agentMeta: {
				...agentMeta,
				cliSessionBinding: void 0,
				clearCliSessionBinding: void 0
			}
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/post-compaction-loop-guard.ts
/**
* Guards against repeated tool-loop compactions that never make progress.
*/
/**
* Detects identical tool-call loops immediately after automatic compaction.
*
* The guard only observes a small post-compaction window; if compaction failed to break an
* identical args/result loop, the runner aborts before spending unbounded tokens.
*/
const log = createSubsystemLogger("agents/post-compaction-guard");
const DEFAULT_WINDOW_SIZE = 3;
/** Creates a stateful post-compaction loop detector for one embedded run. */
function createPostCompactionLoopGuard(options) {
	const state = {
		enabled: options?.enabled ?? true,
		windowSize: DEFAULT_WINDOW_SIZE,
		remainingAttempts: 0,
		history: []
	};
	const armPostCompaction = () => {
		state.remainingAttempts = state.windowSize;
		state.history = [];
		if (state.enabled) log.info(`post-compaction guard armed for ${state.windowSize} attempts`);
	};
	const observe = (call) => {
		if (!state.enabled) return {
			shouldAbort: false,
			armed: false,
			remainingAttempts: 0
		};
		if (state.remainingAttempts <= 0) return {
			shouldAbort: false,
			armed: false,
			remainingAttempts: 0
		};
		state.remainingAttempts -= 1;
		state.history.push(call);
		const armedAfter = state.remainingAttempts > 0;
		const matches = state.history.filter((entry) => entry.toolName === call.toolName && entry.argsHash === call.argsHash && entry.resultHash === call.resultHash);
		if (matches.length >= state.windowSize) {
			log.error(`post-compaction loop persisted: tool=${call.toolName} repeated ${matches.length} times with identical args+result post-compaction`);
			return {
				shouldAbort: true,
				armed: armedAfter,
				remainingAttempts: state.remainingAttempts,
				detector: "compaction_loop_persisted",
				count: matches.length,
				toolName: call.toolName,
				message: `CRITICAL: tool ${call.toolName} repeated ${matches.length} times with identical arguments and identical results within ${state.windowSize} attempts after auto-compaction. The compaction did not break the loop. Aborting to prevent runaway resource use.`
			};
		}
		return {
			shouldAbort: false,
			armed: armedAfter,
			remainingAttempts: state.remainingAttempts
		};
	};
	const snapshot = () => ({
		armed: state.remainingAttempts > 0,
		remainingAttempts: state.remainingAttempts
	});
	return {
		armPostCompaction,
		observe,
		snapshot
	};
}
/** Error raised when the post-compaction loop guard aborts a run. */
var PostCompactionLoopPersistedError = class PostCompactionLoopPersistedError extends Error {
	constructor(message, details) {
		super(message);
		this.name = "PostCompactionLoopPersistedError";
		this.detector = details.detector;
		this.count = details.count;
		this.toolName = details.toolName;
	}
	static fromVerdict(verdict) {
		return new PostCompactionLoopPersistedError(verdict.message, {
			detector: verdict.detector,
			count: verdict.count,
			toolName: verdict.toolName
		});
	}
};
//#endregion
//#region src/agents/embedded-agent-runner/run/failover-policy.ts
function shouldEscalateRetryLimit(reason) {
	return Boolean(reason && reason !== "timeout" && reason !== "format" && reason !== "session_expired");
}
function isTerminalFormatFailure(params) {
	return params.failoverFailure && params.failoverReason === "format" && params.allowFormatRetry !== true;
}
function shouldRotatePrompt(params) {
	if (params.timedOutByRunBudget) return false;
	return params.failoverFailure && params.failoverReason !== "timeout" && !isTerminalFormatFailure(params);
}
function isAssistantTimeoutFailure(params) {
	return params.idleTimedOut || params.timedOut && !params.timedOutDuringCompaction && !params.timedOutDuringToolExecution;
}
function isConcreteNonTimeoutAssistantFailure(params) {
	return params.failoverFailure && Boolean(params.failoverReason) && params.failoverReason !== "timeout";
}
function shouldRotateAssistant(params) {
	if (isTerminalFormatFailure(params)) return false;
	if (params.timedOutByRunBudget) return false;
	const timeoutFailure = isAssistantTimeoutFailure(params);
	if (params.harnessOwnsTransport && (timeoutFailure || params.failoverReason === "timeout") && !isConcreteNonTimeoutAssistantFailure(params)) return false;
	return !params.aborted && params.failoverFailure || timeoutFailure;
}
function assistantFallbackReason(params) {
	const failoverReason = params.failoverReason;
	if (params.failoverFailure && failoverReason && failoverReason !== "timeout") return failoverReason;
	return isAssistantTimeoutFailure(params) ? "timeout" : failoverReason ?? "unknown";
}
/** Preserves an existing retry reason unless the current attempt produced a stronger signal. */
function mergeRetryFailoverReason(params) {
	return params.failoverReason ?? (params.timedOut ? "timeout" : null) ?? params.previous;
}
/**
* Chooses whether a run should rotate auth profile, switch model fallback,
* surface the error, continue normally, or return an error payload. Prompt,
* assistant, and retry-limit stages intentionally use different action sets.
*/
function resolveRunFailoverDecision(params) {
	if (params.stage === "retry_limit") {
		if (params.fallbackConfigured && shouldEscalateRetryLimit(params.failoverReason)) return {
			action: "fallback_model",
			reason: params.failoverReason ?? "unknown"
		};
		return { action: "return_error_payload" };
	}
	if (params.stage === "prompt") {
		if (params.failoverCode === "cli_max_turns") return {
			action: "surface_error",
			reason: params.failoverReason
		};
		if (params.externalAbort) return {
			action: "surface_error",
			reason: params.failoverReason
		};
		if (params.timedOutByRunBudget) return {
			action: "surface_error",
			reason: params.failoverReason
		};
		if (params.harnessOwnsTransport && params.failoverReason === "timeout") {
			if (params.promptTimeoutFallbackSafe === true && params.fallbackConfigured) return {
				action: "fallback_model",
				reason: "timeout"
			};
			return {
				action: "surface_error",
				reason: params.failoverReason
			};
		}
		if (!params.profileRotated && shouldRotatePrompt(params)) return {
			action: "rotate_profile",
			reason: params.failoverReason
		};
		if (params.fallbackConfigured && params.failoverFailure && !isTerminalFormatFailure(params)) return {
			action: "fallback_model",
			reason: params.failoverReason ?? "unknown"
		};
		return {
			action: "surface_error",
			reason: params.failoverReason
		};
	}
	if (params.externalAbort) return {
		action: "surface_error",
		reason: params.failoverReason
	};
	if (isTerminalFormatFailure(params)) return {
		action: "surface_error",
		reason: params.failoverReason
	};
	const assistantShouldRotate = shouldRotateAssistant(params);
	if (!params.profileRotated && assistantShouldRotate) return {
		action: "rotate_profile",
		reason: params.failoverReason
	};
	if (assistantShouldRotate && params.fallbackConfigured) return {
		action: "fallback_model",
		reason: assistantFallbackReason(params)
	};
	if (!assistantShouldRotate) return { action: "continue_normal" };
	return {
		action: "surface_error",
		reason: params.failoverReason
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/assistant-failover.ts
/**
* Handles assistant-stage failover decisions during embedded-agent attempts.
*/
function resolveShortWindowRateLimitRetry(message) {
	const window = classifyRateLimitWindow(message);
	if (window.kind !== "short") return null;
	return window.retryAfterSeconds === void 0 ? {} : { retryAfterSeconds: window.retryAfterSeconds };
}
function isShortWindowRateLimitMessage(message) {
	return resolveShortWindowRateLimitRetry(message) !== null;
}
/**
* Applies an assistant-stage failover decision and returns the next run action.
* It owns auth-profile rotation, overload/rate-limit escalation, same-model
* idle-timeout retry, and FailoverError construction for outer model fallback.
*/
async function handleAssistantFailover(params) {
	let overloadProfileRotations = params.overloadProfileRotations;
	let decision = params.initialDecision;
	const sameModelIdleTimeoutRetry = () => {
		params.warn(`[llm-idle-timeout] ${sanitizeForLog(params.provider)}/${sanitizeForLog(params.modelId)} produced no reply before the idle watchdog; retrying same model`);
		return {
			action: "retry",
			overloadProfileRotations,
			retryKind: "same_model_idle_timeout",
			lastRetryFailoverReason: mergeRetryFailoverReason({
				previous: params.previousRetryFailoverReason,
				failoverReason: params.failoverReason,
				timedOut: true
			})
		};
	};
	const sameModelRateLimitRetry = () => ({
		action: "retry",
		overloadProfileRotations,
		retryKind: "same_model_rate_limit",
		lastRetryFailoverReason: mergeRetryFailoverReason({
			previous: params.previousRetryFailoverReason,
			failoverReason: params.failoverReason,
			timedOut: params.timedOut || params.idleTimedOut
		})
	});
	if (decision.action === "rotate_profile") {
		const failedProfileId = params.lastProfileId;
		const timeoutFailure = params.timedOut || params.idleTimedOut;
		const failureReason = params.assistantProfileFailureReason;
		const markFailedProfile = async () => {
			if (!failedProfileId || !failureReason) return;
			try {
				await params.maybeMarkAuthProfileFailure({
					profileId: failedProfileId,
					reason: failureReason,
					modelId: params.modelId
				});
			} catch (err) {
				params.warn(`profile failure mark failed: ${String(err)}`);
			}
		};
		if (params.failoverReason === "overloaded") {
			overloadProfileRotations += 1;
			if (overloadProfileRotations > params.overloadProfileRotationLimit && params.fallbackConfigured) {
				const status = resolveFailoverStatus("overloaded");
				params.warn(`overload profile rotation cap reached for ${sanitizeForLog(params.provider)}/${sanitizeForLog(params.modelId)} after ${overloadProfileRotations} rotations; escalating to model fallback`);
				await markFailedProfile();
				params.logAssistantFailoverDecision("fallback_model", { status });
				return {
					action: "throw",
					overloadProfileRotations,
					error: new FailoverError("The AI service is temporarily overloaded. Please try again in a moment.", {
						reason: "overloaded",
						provider: params.activeErrorContext.provider,
						model: params.activeErrorContext.model,
						profileId: params.lastProfileId,
						status,
						rawError: params.lastAssistant?.errorMessage?.trim()
					})
				};
			}
		}
		if (params.failoverReason === "rate_limit") {
			const shortWindowRetry = resolveShortWindowRateLimitRetry(params.lastAssistant?.errorMessage);
			if (params.allowSameModelRateLimitRetry && shortWindowRetry && await params.maybeRetrySameModelRateLimit(shortWindowRetry)) return sameModelRateLimitRetry();
			params.maybeEscalateRateLimitProfileFallback({
				failoverProvider: params.activeErrorContext.provider,
				failoverModel: params.activeErrorContext.model,
				logFallbackDecision: params.logAssistantFailoverDecision
			});
		}
		const rotated = await params.advanceAuthProfile();
		const markFailedProfilePromise = markFailedProfile();
		if (timeoutFailure && !params.isProbeSession && failedProfileId) {
			const timeoutLabel = params.idleTimedOut ? "idle timeout (model silent)" : "timed out";
			params.warn(`Profile ${failedProfileId} ${timeoutLabel}. Trying next account...`);
		}
		if (params.cloudCodeAssistFormatError && failedProfileId) params.warn(`Profile ${failedProfileId} hit Cloud Code Assist format error. Tool calls will be sanitized on retry.`);
		if (rotated) {
			params.logAssistantFailoverDecision("rotate_profile");
			await params.maybeBackoffBeforeOverloadFailover(params.failoverReason);
			return {
				action: "retry",
				overloadProfileRotations,
				retryKind: "profile_rotation",
				lastRetryFailoverReason: mergeRetryFailoverReason({
					previous: params.previousRetryFailoverReason,
					failoverReason: params.failoverReason,
					timedOut: params.timedOut || params.idleTimedOut
				})
			};
		}
		await markFailedProfilePromise;
		if (params.idleTimedOut && params.allowSameModelIdleTimeoutRetry) return sameModelIdleTimeoutRetry();
		decision = resolveRunFailoverDecision({
			stage: "assistant",
			allowFormatRetry: params.cloudCodeAssistFormatError,
			aborted: params.aborted,
			externalAbort: params.externalAbort,
			fallbackConfigured: params.fallbackConfigured,
			failoverFailure: params.failoverFailure,
			failoverReason: params.failoverReason,
			timedOut: params.timedOut,
			idleTimedOut: params.idleTimedOut,
			timedOutDuringCompaction: params.timedOutDuringCompaction,
			timedOutDuringToolExecution: params.timedOutDuringToolExecution,
			timedOutByRunBudget: params.timedOutByRunBudget,
			profileRotated: true
		});
	}
	if (decision.action === "fallback_model") {
		await params.maybeBackoffBeforeOverloadFailover(params.failoverReason);
		const message = resolveAssistantFailoverErrorMessage(params);
		const status = resolveFailoverStatus(decision.reason) ?? (isTimeoutErrorMessage(message) ? 408 : void 0);
		params.logAssistantFailoverDecision("fallback_model", { status });
		const shouldSuspend = Boolean(params.sessionKey) && (decision.reason === "rate_limit" || decision.reason === "billing");
		return {
			action: "throw",
			overloadProfileRotations,
			error: new FailoverError(message, {
				reason: decision.reason,
				provider: params.activeErrorContext.provider,
				model: params.activeErrorContext.model,
				profileId: params.lastProfileId,
				authMode: params.authMode,
				status,
				rawError: params.lastAssistant?.errorMessage?.trim(),
				suspend: shouldSuspend
			})
		};
	}
	if (decision.action === "surface_error") {
		if (!params.externalAbort && params.idleTimedOut && params.allowSameModelIdleTimeoutRetry) return sameModelIdleTimeoutRetry();
		params.logAssistantFailoverDecision("surface_error");
		if (!params.externalAbort && !params.timedOut && params.failoverFailure) {
			const message = resolveAssistantFailoverErrorMessage(params);
			const reason = resolveSurfaceErrorReason(decision.reason, params);
			const status = resolveFailoverStatus(reason) ?? (isTimeoutErrorMessage(message) ? 408 : void 0);
			const shouldSuspend = Boolean(params.sessionKey) && (reason === "rate_limit" || reason === "billing");
			return {
				action: "throw",
				overloadProfileRotations,
				error: new FailoverError(message, {
					reason,
					provider: params.activeErrorContext.provider,
					model: params.activeErrorContext.model,
					profileId: params.lastProfileId,
					authMode: params.authMode,
					status,
					rawError: params.lastAssistant?.errorMessage?.trim(),
					suspend: shouldSuspend
				})
			};
		}
	}
	return {
		action: "continue_normal",
		overloadProfileRotations
	};
}
function resolveAssistantFailoverErrorMessage(params) {
	const timeoutFailure = params.timedOut || params.idleTimedOut;
	return (params.lastAssistant ? formatAssistantErrorText(params.lastAssistant, {
		cfg: params.config,
		sessionKey: params.sessionKey,
		provider: params.activeErrorContext.provider,
		model: params.activeErrorContext.model,
		authMode: params.authMode
	}) : void 0) || params.lastAssistant?.errorMessage?.trim() || (timeoutFailure ? "LLM request timed out." : params.rateLimitFailure ? "LLM request rate limited." : params.billingFailure ? formatBillingErrorMessage(params.activeErrorContext.provider, params.activeErrorContext.model, params.authMode) : params.authFailure ? "LLM request unauthorized." : "LLM request failed.");
}
function resolveSurfaceErrorReason(declared, params) {
	if (declared) return declared;
	if (params.billingFailure) return "billing";
	if (params.authFailure) return "auth";
	if (params.rateLimitFailure) return "rate_limit";
	return "unknown";
}
//#endregion
//#region src/agents/embedded-agent-runner/run/failover-observation.ts
/**
* Logs redacted failover decisions for embedded-agent attempts.
*/
/**
* Derives timeout failure reasons for logs that were built from timeout state
* before the normal provider error classifier had a raw error to inspect.
*/
function normalizeFailoverDecisionObservationBase(base) {
	return {
		...base,
		failoverReason: base.failoverReason ?? (base.timedOut ? "timeout" : null),
		profileFailureReason: base.profileFailureReason ?? (base.timedOut ? "timeout" : null)
	};
}
/**
* Captures sanitized failover context and returns a decision logger. The closure
* keeps prompt/assistant failover branches consistent while still allowing the
* final decision and HTTP status to be supplied at the action point.
*/
function createFailoverDecisionLogger(base) {
	const normalizedBase = normalizeFailoverDecisionObservationBase(base);
	const safeProfileId = normalizedBase.profileId ? redactIdentifier(normalizedBase.profileId, { len: 12 }) : void 0;
	const safeRunId = sanitizeForConsole(normalizedBase.runId) ?? "-";
	const safeProvider = sanitizeForConsole(normalizedBase.provider) ?? "-";
	const safeModel = sanitizeForConsole(normalizedBase.model) ?? "-";
	const safeSourceProvider = sanitizeForConsole(normalizedBase.sourceProvider) ?? safeProvider;
	const safeSourceModel = sanitizeForConsole(normalizedBase.sourceModel) ?? safeModel;
	const profileText = safeProfileId ?? "-";
	const reasonText = normalizedBase.failoverReason ?? "none";
	const sourceChanged = safeSourceProvider !== safeProvider || safeSourceModel !== safeModel;
	return (decision, extra) => {
		const observedError = buildApiErrorObservationFields(normalizedBase.rawError);
		const safeRawErrorPreview = sanitizeForConsole(observedError.rawErrorPreview);
		const rawErrorConsoleSuffix = safeRawErrorPreview && !shouldSuppressRawErrorConsoleSuffix(observedError.providerRuntimeFailureKind) ? ` rawError=${safeRawErrorPreview}` : "";
		log$3.warn("embedded run failover decision", {
			event: "embedded_run_failover_decision",
			tags: [
				"error_handling",
				"failover",
				normalizedBase.stage,
				decision
			],
			runId: normalizedBase.runId,
			stage: normalizedBase.stage,
			decision,
			failoverReason: normalizedBase.failoverReason,
			profileFailureReason: normalizedBase.profileFailureReason,
			provider: normalizedBase.provider,
			model: normalizedBase.model,
			sourceProvider: normalizedBase.sourceProvider ?? normalizedBase.provider,
			sourceModel: normalizedBase.sourceModel ?? normalizedBase.model,
			profileId: safeProfileId,
			fallbackConfigured: normalizedBase.fallbackConfigured,
			timedOut: normalizedBase.timedOut,
			aborted: normalizedBase.aborted,
			status: extra?.status,
			...observedError,
			consoleMessage: `embedded run failover decision: runId=${safeRunId} stage=${normalizedBase.stage} decision=${decision} reason=${reasonText} from=${safeSourceProvider}/${safeSourceModel}${sourceChanged ? ` to=${safeProvider}/${safeModel}` : ""} profile=${profileText}${rawErrorConsoleSuffix}`
		});
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/assistant-failure.ts
const MAX_EMPTY_ERROR_RETRIES = 3;
const MAX_SAME_MODEL_IDLE_TIMEOUT_RETRIES = 1;
async function handleEmbeddedAssistantFailure(input) {
	const fallbackThinking = pickFallbackThinkingLevel({
		message: input.attemptAssistant?.errorMessage,
		attempted: input.attemptedThinking
	});
	if (fallbackThinking && !input.terminalInterrupted) {
		log$3.warn(`unsupported thinking level for ${input.provider}/${input.modelId}; retrying with ${fallbackThinking}`);
		return buildOutcome(input, {
			action: "retry",
			thinkLevel: fallbackThinking,
			preserveSameModelRateLimitRetryCount: true,
			assistantProfileFailureReason: null
		});
	}
	const authFailure = isAuthAssistantError(input.attemptAssistant);
	const rateLimitFailure = isRateLimitAssistantError(input.attemptAssistant);
	const billingFailure = isBillingAssistantError(input.attemptAssistant);
	const failoverFailure = isFailoverAssistantError(input.attemptAssistant);
	const assistantFailoverReason = classifyAssistantFailoverReason(input.attemptAssistant);
	const assistantProviderStarted = Boolean(input.currentAttemptAssistant?.provider) || input.terminalProviderStarted;
	const assistantProfileFailoverReason = assistantFailoverReason ?? (assistantProviderStarted && (input.timedOut || input.idleTimedOut) ? "timeout" : null);
	const assistantProfileFailureReason = input.resolveAuthProfileFailureReason(assistantProfileFailoverReason, {
		providerStarted: assistantProviderStarted,
		transientRateLimit: assistantProfileFailoverReason === "rate_limit" && isShortWindowRateLimitMessage(input.attemptAssistant?.errorMessage)
	});
	const cloudCodeAssistFormatError = input.attempt.cloudCodeAssistFormatError;
	const imageDimensionError = parseImageDimensionError(input.attemptAssistant?.errorMessage ?? "");
	const genericUnknownReasoningError = assistantFailoverReason === "timeout" && isGenericUnknownStreamErrorMessage(input.attemptAssistant?.errorMessage ?? "") && Boolean(input.attemptAssistant && hasOnlyAssistantReasoningContent(input.attemptAssistant));
	const silentErrorRetryReason = assistantFailoverReason === null || genericUnknownReasoningError || assistantFailoverReason === "no_error_details" || assistantFailoverReason === "unclassified" || assistantFailoverReason === "unknown" || assistantFailoverReason === "server_error";
	if (!authFailure && !rateLimitFailure && !billingFailure && !cloudCodeAssistFormatError && !imageDimensionError && !input.terminalInterrupted && !input.promptError && silentErrorRetryReason && shouldRetrySilentErrorAssistantTurn({
		attempt: input.attempt,
		assistant: input.attemptAssistant
	}) && input.emptyErrorRetries < MAX_EMPTY_ERROR_RETRIES) {
		const emptyErrorRetries = input.emptyErrorRetries + 1;
		log$3.warn(`[empty-error-retry] stopReason=error non-visible-output; resubmitting attempt=${emptyErrorRetries}/${MAX_EMPTY_ERROR_RETRIES} provider=${input.attemptAssistant?.provider ?? input.provider} model=${input.attemptAssistant?.model ?? input.model} sessionKey=${input.runParams.sessionKey ?? input.runParams.sessionId}`);
		return buildOutcome(input, {
			action: "retry",
			emptyErrorRetries,
			preserveSameModelRateLimitRetryCount: true,
			assistantProfileFailureReason
		});
	}
	const failedProfileId = input.authProfileId;
	const logFailoverDecision = createFailoverDecisionLogger({
		stage: "assistant",
		runId: input.runParams.runId,
		rawError: input.attemptAssistant?.errorMessage?.trim(),
		failoverReason: assistantFailoverReason,
		profileFailureReason: assistantProfileFailureReason,
		provider: input.activeErrorContext.provider,
		model: input.activeErrorContext.model,
		sourceProvider: input.attemptAssistant?.provider ?? input.provider,
		sourceModel: input.attemptAssistant?.model ?? input.modelId,
		profileId: failedProfileId,
		fallbackConfigured: input.fallbackConfigured,
		timedOut: input.timedOut,
		aborted: input.aborted
	});
	if (!input.signalOwnedInterruption && authFailure && await input.maybeRefreshRuntimeAuthForAuthError(input.attemptAssistant?.errorMessage ?? "", input.runtimeAuthRetry)) return buildOutcome(input, {
		action: "retry",
		authRetryPending: true,
		preserveSameModelRateLimitRetryCount: true,
		assistantProfileFailureReason
	});
	if (imageDimensionError && input.authProfileId) {
		const details = [
			imageDimensionError.messageIndex !== void 0 ? `message=${imageDimensionError.messageIndex}` : null,
			imageDimensionError.contentIndex !== void 0 ? `content=${imageDimensionError.contentIndex}` : null,
			imageDimensionError.maxDimensionPx !== void 0 ? `limit=${imageDimensionError.maxDimensionPx}px` : null
		].filter(Boolean).join(" ");
		log$3.warn(`Profile ${input.authProfileId} rejected image payload${details ? ` (${details})` : ""}.`);
	}
	const initialDecision = resolveRunFailoverDecision({
		stage: "assistant",
		allowFormatRetry: cloudCodeAssistFormatError,
		aborted: input.aborted,
		externalAbort: input.externalAbort || input.signalOwnedInterruption,
		fallbackConfigured: input.fallbackConfigured,
		failoverFailure,
		failoverReason: assistantFailoverReason,
		timedOut: input.timedOut,
		idleTimedOut: input.idleTimedOut,
		timedOutDuringCompaction: input.timedOutDuringCompaction,
		timedOutDuringToolExecution: input.timedOutDuringToolExecution,
		harnessOwnsTransport: input.pluginHarnessOwnsTransport,
		timedOutByRunBudget: input.timedOutByRunBudget,
		profileRotated: false
	});
	const outcome = await handleAssistantFailover({
		initialDecision,
		aborted: input.aborted,
		externalAbort: input.externalAbort || input.signalOwnedInterruption,
		fallbackConfigured: input.fallbackConfigured,
		failoverFailure,
		failoverReason: assistantFailoverReason,
		timedOut: input.timedOut,
		idleTimedOut: input.idleTimedOut,
		timedOutDuringCompaction: input.timedOutDuringCompaction,
		timedOutDuringToolExecution: input.timedOutDuringToolExecution,
		timedOutByRunBudget: input.timedOutByRunBudget,
		allowSameModelIdleTimeoutRetry: input.timedOut && input.idleTimedOut && !input.timedOutDuringCompaction && !input.fallbackConfigured && input.canRestartForLiveSwitch && input.sameModelIdleTimeoutRetries < MAX_SAME_MODEL_IDLE_TIMEOUT_RETRIES,
		allowSameModelRateLimitRetry: input.rateLimitProfileRotations < input.rateLimitProfileRotationLimit,
		assistantProfileFailureReason,
		lastProfileId: input.authProfileId,
		modelId: input.modelId,
		provider: input.provider,
		activeErrorContext: input.activeErrorContext,
		lastAssistant: input.attemptAssistant,
		config: input.runParams.config,
		sessionKey: input.runParams.sessionKey ?? input.runParams.sessionId,
		authFailure,
		rateLimitFailure,
		billingFailure,
		authMode: input.authProfileId ? input.authProfileStore.profiles?.[input.authProfileId]?.type : void 0,
		cloudCodeAssistFormatError,
		isProbeSession: input.isProbeSession,
		overloadProfileRotations: input.overloadProfileRotations,
		overloadProfileRotationLimit: input.overloadProfileRotationLimit,
		previousRetryFailoverReason: input.previousRetryFailoverReason,
		logAssistantFailoverDecision: logFailoverDecision,
		warn: (message) => log$3.warn(message),
		maybeMarkAuthProfileFailure: input.maybeMarkAuthProfileFailure,
		maybeEscalateRateLimitProfileFallback: input.maybeEscalateRateLimitProfileFallback,
		maybeRetrySameModelRateLimit: input.maybeRetrySameModelRateLimit,
		maybeBackoffBeforeOverloadFailover: input.maybeBackoffBeforeOverloadFailover,
		advanceAuthProfile: input.advanceAttemptAuthProfile
	});
	if (outcome.action === "retry") {
		const retryTraceResult = outcome.retryKind === "same_model_rate_limit" ? "same_model_rate_limit" : outcome.retryKind === "same_model_idle_timeout" || assistantFailoverReason === "timeout" ? "timeout" : "rotate_profile";
		input.traceAttempts.push({
			provider: input.activeErrorContext.provider,
			model: input.activeErrorContext.model,
			result: retryTraceResult,
			...assistantFailoverReason ? { reason: assistantFailoverReason } : {},
			stage: "assistant"
		});
		return buildOutcome(input, {
			action: "retry",
			thinkLevel: outcome.retryKind === "profile_rotation" ? input.getThinkLevel() : input.thinkLevel,
			overloadProfileRotations: outcome.overloadProfileRotations,
			sameModelIdleTimeoutRetries: input.sameModelIdleTimeoutRetries + (outcome.retryKind === "same_model_idle_timeout" ? 1 : 0),
			lastRetryFailoverReason: outcome.lastRetryFailoverReason,
			preserveSameModelRateLimitRetryCount: outcome.retryKind === "same_model_rate_limit",
			assistantProfileFailureReason
		});
	}
	if (outcome.action === "throw") {
		input.traceAttempts.push({
			provider: input.activeErrorContext.provider,
			model: input.activeErrorContext.model,
			result: assistantFailoverReason === "timeout" ? "timeout" : initialDecision.action === "fallback_model" ? "fallback_model" : "error",
			...assistantFailoverReason ? { reason: assistantFailoverReason } : {},
			stage: "assistant",
			...typeof outcome.error.status === "number" ? { status: outcome.error.status } : {}
		});
		if (outcome.error.suspend) input.suspendForFailure({
			cfg: input.runParams.config,
			agentDir: input.agentDir,
			sessionId: input.suspensionSessionId,
			reason: resolveSessionSuspensionReason(outcome.error.reason),
			failedProvider: outcome.error.provider ?? input.provider,
			failedModel: outcome.error.model ?? input.modelId
		});
		throw outcome.error;
	}
	return buildOutcome(input, {
		action: "proceed",
		overloadProfileRotations: outcome.overloadProfileRotations,
		assistantProfileFailureReason
	});
}
function buildOutcome(input, override) {
	return {
		action: override.action,
		thinkLevel: override.thinkLevel ?? input.thinkLevel,
		authRetryPending: override.authRetryPending ?? false,
		emptyErrorRetries: override.emptyErrorRetries ?? input.emptyErrorRetries,
		overloadProfileRotations: override.overloadProfileRotations ?? input.overloadProfileRotations,
		sameModelIdleTimeoutRetries: override.sameModelIdleTimeoutRetries ?? input.sameModelIdleTimeoutRetries,
		lastRetryFailoverReason: override.lastRetryFailoverReason ?? input.previousRetryFailoverReason,
		preserveSameModelRateLimitRetryCount: override.preserveSameModelRateLimitRetryCount ?? false,
		assistantProfileFailureReason: override.assistantProfileFailureReason
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-store.ts
function resolveAttemptDispatchApiKey(params) {
	if (params.runtimeAuthState) return;
	return params.apiKeyInfo?.apiKey;
}
function createEmptyAuthProfileStore() {
	return {
		version: 1,
		profiles: {}
	};
}
function createScopedAuthProfileStore(store, profileIds) {
	const profiles = store.profiles ?? {};
	const normalizedProfileIds = (Array.isArray(profileIds) ? profileIds : [profileIds]).map((profileId) => profileId?.trim()).filter((profileId) => Boolean(profileId));
	const scopedProfiles = Object.fromEntries(normalizedProfileIds.flatMap((profileId) => {
		const credential = profiles[profileId];
		return credential ? [[profileId, credential]] : [];
	}));
	const scopedRuntimeExternalProfileIds = (store.runtimeExternalProfileIds ?? []).filter((profileId) => scopedProfiles[profileId]);
	const scopedRuntimePersistedProfileIds = (store.runtimePersistedProfileIds ?? []).filter((profileId) => scopedProfiles[profileId]);
	return Object.keys(scopedProfiles).length > 0 ? {
		version: store.version,
		profiles: scopedProfiles,
		...scopedRuntimePersistedProfileIds.length > 0 ? { runtimePersistedProfileIds: scopedRuntimePersistedProfileIds } : {},
		...scopedRuntimeExternalProfileIds.length > 0 || store.runtimeExternalProfileIdsAuthoritative === true ? { runtimeExternalProfileIds: scopedRuntimeExternalProfileIds } : {},
		...store.runtimeExternalProfileIdsAuthoritative === true ? { runtimeExternalProfileIdsAuthoritative: true } : {}
	} : createEmptyAuthProfileStore();
}
//#endregion
//#region src/agents/embedded-agent-runner/run/backend.ts
/**
* Dispatches embedded attempts to native harness or OpenClaw backend execution.
*/
/**
* Backend bridge for executing one embedded-agent attempt through the selected harness.
*/
async function runEmbeddedAttemptWithBackend(params) {
	return runAgentHarnessAttempt(params);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/lane-runtime.ts
const EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS = 3e4;
const EMBEDDED_RUN_LANE_HEARTBEAT_MS = EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS / 2;
function resolveEmbeddedRunLaneTimeoutMs(timeoutMs) {
	const defaultLaneTimeoutMs = DEFAULT_AGENT_TIMEOUT_MS + EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS;
	if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs >= 2147e6) return defaultLaneTimeoutMs;
	return addTimerTimeoutGraceMs(Math.floor(timeoutMs), 3e4) ?? defaultLaneTimeoutMs;
}
function withEmbeddedRunLaneTimeout(opts, laneTaskTimeoutMs) {
	if (opts?.taskTimeoutMs !== void 0) return opts;
	return {
		...opts,
		taskTimeoutMs: laneTaskTimeoutMs
	};
}
function resolveEmbeddedRunSessionQueuePriority(trigger) {
	switch (trigger) {
		case "user":
		case "manual": return "foreground";
		case "cron":
		case "heartbeat":
		case "memory":
		case "overflow": return "background";
		default: return "normal";
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/run/skill-workshop-attempt-params.ts
function resolveSkillWorkshopAttemptParams(params) {
	return {
		skillWorkshopProposalOnly: params.skillWorkshopProposalOnly,
		skillWorkshopProposalEnv: params.skillWorkshopProposalEnv,
		skillWorkshopOrigin: params.skillWorkshopOrigin,
		skillWorkshopProposalMutationBudget: params.skillWorkshopProposalMutationBudget,
		skillWorkshopProposalReviewCompletion: params.skillWorkshopProposalReviewCompletion
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/run-attempt-dispatch.ts
async function dispatchEmbeddedRunAttempt(input) {
	const { params, runtime, control } = input;
	const observeToolTerminal = createToolTerminalObserver(params.runId);
	const attemptAbortController = new AbortController();
	control.setPostCompactionAbortController(attemptAbortController);
	const parentAbortSignal = params.abortSignal;
	const relayParentAbort = () => {
		control.laneTaskAbortController.abort(parentAbortSignal?.reason);
		attemptAbortController.abort(parentAbortSignal?.reason);
	};
	if (parentAbortSignal?.aborted) relayParentAbort();
	else parentAbortSignal?.addEventListener("abort", relayParentAbort, { once: true });
	let progressInterval;
	const stopLaneProgressHeartbeat = () => {
		if (progressInterval) {
			clearInterval(progressInterval);
			progressInterval = void 0;
		}
		attemptAbortController.signal.removeEventListener("abort", stopLaneProgressHeartbeat);
	};
	const startLaneProgressHeartbeat = () => {
		if (progressInterval || attemptAbortController.signal.aborted) return;
		progressInterval = setInterval(() => control.noteLaneTaskProgress(), EMBEDDED_RUN_LANE_HEARTBEAT_MS);
		progressInterval.unref?.();
		attemptAbortController.signal.addEventListener("abort", stopLaneProgressHeartbeat, { once: true });
	};
	let timeoutReleaseTimer;
	const clearAttemptTimeoutRelease = () => {
		if (timeoutReleaseTimer) {
			clearTimeout(timeoutReleaseTimer);
			timeoutReleaseTimer = void 0;
		}
	};
	const armAttemptTimeoutRelease = (reason) => {
		if (timeoutReleaseTimer) return;
		timeoutReleaseTimer = setTimeout(() => control.laneTaskReleaseController.abort(reason), EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS);
		timeoutReleaseTimer.unref?.();
	};
	let cancellationRequested = false;
	const rawAttempt = await runEmbeddedAttemptWithBackend({
		sessionId: runtime.sessionId,
		sessionKey: runtime.sessionKey,
		conversationRecall: params.conversationRecall,
		promptCacheKey: params.promptCacheKey,
		sandboxSessionKey: params.sandboxSessionKey,
		trigger: params.trigger,
		memoryFlushWritePath: params.memoryFlushWritePath,
		messageChannel: params.messageChannel,
		messageProvider: params.messageProvider,
		clientCaps: params.clientCaps,
		chatType: params.chatType,
		agentAccountId: params.agentAccountId,
		messageTo: params.messageTo,
		messageThreadId: params.messageThreadId,
		messageActionTurnCapability: params.messageActionTurnCapability,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		memberRoleIds: params.memberRoleIds,
		spawnedBy: params.spawnedBy,
		isCanonicalWorkspace: runtime.isCanonicalWorkspace,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		senderIsOwner: params.senderIsOwner,
		approvalReviewerDeviceId: params.approvalReviewerDeviceId,
		currentChannelId: params.currentChannelId,
		chatId: params.chatId,
		channelContext: params.channelContext,
		currentMessagingTarget: params.currentMessagingTarget,
		currentThreadTs: params.currentThreadTs,
		currentMessageId: params.currentMessageId,
		currentInboundAudio: params.currentInboundAudio,
		replyToMode: params.replyToMode,
		hasRepliedRef: params.hasRepliedRef,
		sessionFile: runtime.sessionFile,
		sessionTarget: runtime.sessionTarget,
		trajectorySessionFile: runtime.trajectorySessionFile,
		trajectoryRecorder: runtime.trajectoryRecorder,
		workspaceDir: runtime.workspaceDir,
		cwd: params.cwd,
		agentDir: runtime.agentDir,
		preparedModelRuntime: runtime.preparedModelRuntime,
		config: params.config,
		allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
		...runtime.contextEngine ? {
			contextEngine: runtime.contextEngine,
			contextTokenBudget: runtime.contextTokenBudget,
			contextWindowInfo: runtime.contextWindowInfo
		} : {},
		skillsSnapshot: params.skillsSnapshot,
		prompt: runtime.prompt,
		transcriptPrompt: params.transcriptPrompt,
		userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
		skipPreparedUserTurnMessage: runtime.skipPreparedUserTurnMessage,
		currentInboundEventKind: params.currentInboundEventKind,
		currentInboundContext: params.currentInboundContext,
		images: params.images,
		imageOrder: params.imageOrder,
		clientTools: params.clientTools,
		disableTools: params.disableTools,
		provider: runtime.provider,
		modelId: runtime.modelId,
		requestedModelId: runtime.requestedModelId,
		fallbackActive: runtime.fallbackActive,
		fallbackReason: runtime.fallbackReason,
		delegationCapability: resolveDelegationCapability({
			fallbackActive: runtime.fallbackActive,
			inputProvenance: params.inputProvenance
		}),
		isFinalFallbackAttempt: params.isFinalFallbackAttempt,
		agentHarnessId: runtime.agentHarnessId,
		agentHarnessRuntimeOverride: runtime.agentHarnessId,
		modelSelectionLocked: params.modelSelectionLocked,
		...runtime.captureRuntimeArtifact ? { captureRuntimeArtifact: true } : {},
		...runtime.expectedRuntimeArtifact ? { expectedRuntimeArtifact: runtime.expectedRuntimeArtifact } : {},
		...params.sessionKey ? { agentHarnessTaskRuntimeScope: createAgentHarnessTaskRuntimeScope({ requesterSessionKey: params.sessionKey }) } : {},
		runtimePlan: runtime.runtimePlan,
		observeToolTerminal,
		model: applyAuthHeaderOverride(applyLocalNoAuthHeaderOverride(runtime.model, runtime.apiKeyInfo), runtime.runtimeAuthActive ? null : runtime.apiKeyInfo, params.config),
		resolvedApiKey: runtime.resolvedApiKey,
		authProfileId: runtime.authProfileId,
		authProfileIdSource: runtime.authProfileIdSource,
		initialReplayState: runtime.initialReplayState,
		authStorage: runtime.authStorage,
		authProfileStore: runtime.authProfileStore,
		toolAuthProfileStore: runtime.toolAuthProfileStore,
		modelRegistry: runtime.modelRegistry,
		agentId: runtime.agentId,
		thinkLevel: runtime.thinkLevel,
		onToolOutcome: control.onToolOutcome,
		allocateToolOutcomeOrdinal: control.allocateToolOutcomeOrdinal,
		onToolStreamBoundary: control.onToolStreamBoundary,
		onRunProgress: control.onRunProgress,
		fastMode: runtime.fastMode,
		fastModeAuto: params.fastMode === "auto",
		...params.fastMode === "auto" ? {
			fastModeStartedAtMs: runtime.fastModeStartedAtMs,
			fastModeAutoOnSeconds: runtime.fastModeAutoOnSeconds,
			fastModeAutoProgressState: runtime.fastModeAutoProgressState
		} : {},
		verboseLevel: params.verboseLevel,
		reasoningLevel: params.reasoningLevel,
		toolResultFormat: runtime.toolResultFormat,
		toolProgressDetail: params.toolProgressDetail,
		execOverrides: params.execOverrides,
		bashElevated: params.bashElevated,
		timeoutMs: params.timeoutMs,
		runTimeoutOverrideMs: params.runTimeoutOverrideMs,
		runId: params.runId,
		lifecycleGeneration: control.lifecycleGeneration,
		abortSignal: attemptAbortController.signal,
		onAttemptTimeoutArmed: control.pluginHarnessOwnsTransport ? void 0 : startLaneProgressHeartbeat,
		onAttemptTimeout: control.pluginHarnessOwnsTransport ? void 0 : armAttemptTimeoutRelease,
		onAttemptAbort: () => {
			cancellationRequested = true;
			if (!params.abortSignal?.aborted) params.replyOperation?.abortByUser();
			if (!control.pluginHarnessOwnsTransport) {
				stopLaneProgressHeartbeat();
				control.laneTaskAbortController.abort();
			}
		},
		replyOperation: params.replyOperation,
		shouldEmitToolResult: params.shouldEmitToolResult,
		shouldEmitToolOutput: params.shouldEmitToolOutput,
		onPartialReply: params.onPartialReply,
		onAssistantMessageStart: params.onAssistantMessageStart,
		onBlockReply: params.onBlockReply,
		onBlockReplyFlush: params.onBlockReplyFlush,
		blockReplyBreak: params.blockReplyBreak,
		blockReplyChunking: params.blockReplyChunking,
		onReasoningStream: params.onReasoningStream,
		streamReasoningInNonStreamModes: params.streamReasoningInNonStreamModes,
		onReasoningEnd: params.onReasoningEnd,
		onToolResult: control.onToolResult,
		onAgentToolResult: params.onAgentToolResult,
		onAgentEvent: control.onAgentEvent,
		deferTerminalLifecycle: params.deferTerminalLifecycle ?? params.deferTerminalLifecycleEnd,
		onExecutionPhase: params.onExecutionPhase,
		extraSystemPrompt: params.extraSystemPrompt,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		taskSuggestionDeliveryMode: params.taskSuggestionDeliveryMode,
		inputProvenance: params.inputProvenance,
		streamParams: params.streamParams,
		modelRun: params.modelRun,
		disableTrajectory: params.disableTrajectory,
		...resolveSkillWorkshopAttemptParams(params),
		promptMode: params.promptMode,
		ownerNumbers: params.ownerNumbers,
		enforceFinalTag: params.enforceFinalTag,
		silentExpected: params.silentExpected,
		suppressLiveStreamOutput: params.suppressLiveStreamOutput,
		bootstrapContextMode: params.bootstrapContextMode,
		bootstrapContextRunKind: params.bootstrapContextRunKind,
		jobId: params.jobId,
		toolsAllow: params.toolsAllow,
		...params.systemAgentTool ? { systemAgentTool: params.systemAgentTool } : {},
		cleanupBundleMcpOnRunEnd: params.cleanupBundleMcpOnRunEnd,
		disableMessageTool: params.disableMessageTool,
		swarmCollector: params.swarmCollector,
		swarmOutputSchema: params.swarmOutputSchema,
		forceRestartSafeTools: params.forceRestartSafeTools,
		forceMessageTool: params.forceMessageTool,
		enableHeartbeatTool: params.enableHeartbeatTool,
		forceHeartbeatTool: params.forceHeartbeatTool,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget,
		internalEvents: params.internalEvents,
		bootstrapPromptWarningSignaturesSeen: input.bootstrapPromptWarningSignaturesSeen,
		bootstrapPromptWarningSignature: input.bootstrapPromptWarningSignaturesSeen[input.bootstrapPromptWarningSignaturesSeen.length - 1],
		suppressNextUserMessagePersistence: input.suppressNextUserMessagePersistence,
		beforeAgentFinalizeRevisionAttempts: input.beforeAgentFinalizeRevisionAttempts,
		maxBeforeAgentFinalizeRevisions: input.maxBeforeAgentFinalizeRevisions,
		suppressTranscriptOnlyAssistantPersistence: params.suppressTranscriptOnlyAssistantPersistence,
		suppressAssistantErrorPersistence: params.suppressAssistantErrorPersistence,
		onUserMessagePersisted: control.onUserMessagePersisted,
		onUserMessagePersistenceInvalidated: control.onUserMessagePersistenceInvalidated,
		onAssistantErrorMessagePersisted: params.onAssistantErrorMessagePersisted
	}).catch((err) => {
		throw control.getPostCompactionAbortError() ?? err;
	}).finally(() => {
		clearAttemptTimeoutRelease();
		stopLaneProgressHeartbeat();
		parentAbortSignal?.removeEventListener?.("abort", relayParentAbort);
		control.clearPostCompactionAbortController(attemptAbortController);
	});
	const postCompactionAbortError = control.getPostCompactionAbortError();
	if (postCompactionAbortError) throw postCompactionAbortError;
	return {
		rawAttempt,
		cancellationRequested
	};
}
const OPENAI_RESPONSES_API = "openai-responses";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
function normalizeRuntimeId(value) {
	return value?.trim().toLowerCase() ?? "";
}
function resolveAttemptTrajectoryAttribution(params) {
	const authProfileProvider = normalizeRuntimeId(params.runtimePlan.auth?.authProfileProviderForAuth);
	if (normalizeRuntimeId(params.runtimePlan.observability?.harnessId) === "codex" && authProfileProvider !== "openai" && normalizeRuntimeId(params.model.provider) === "openai" && normalizeRuntimeId(params.model.api) === OPENAI_RESPONSES_API) return {
		modelApi: OPENAI_CODEX_RESPONSES_API,
		modelId: params.modelId,
		provider: OPENAI_PROVIDER_ID
	};
	return {
		...params.model.api ? { modelApi: params.model.api } : {},
		modelId: params.modelId,
		provider: params.provider
	};
}
function resolveInitialThinkLevel(params) {
	if (params.requested) return params.requested;
	return resolveThinkingDefault({
		cfg: params.config ?? {},
		provider: params.provider,
		model: params.modelId,
		catalog: [{
			provider: params.provider,
			id: params.modelId,
			name: params.modelId,
			reasoning: params.model.reasoning
		}]
	});
}
/** Marks only request parameters that OpenClaw applies to provider egress. */
function resolveRequestStreamTransportOverrides(streamParams) {
	return streamParams && Object.keys(streamParams).length > 0 ? "present" : void 0;
}
function resolveInitialEmbeddedRunModel(params) {
	const cfg = params.config ?? {};
	const configuredDefault = resolveDefaultModelForAgent({
		cfg,
		agentId: params.agentId
	});
	const explicitProvider = normalizeOptionalString(params.provider);
	const explicitModel = normalizeOptionalString(params.model);
	const defaultProvider = configuredDefault.provider || "openai";
	if (explicitProvider && explicitModel) return {
		provider: explicitProvider,
		modelId: explicitModel
	};
	if (explicitModel) {
		const provider = explicitProvider ?? defaultProvider;
		const resolved = resolveModelRefFromString({
			cfg,
			raw: explicitModel,
			defaultProvider: provider,
			aliasIndex: buildModelAliasIndex({
				cfg,
				defaultProvider: provider
			})
		});
		return {
			provider: explicitProvider ?? resolved?.ref.provider ?? provider,
			modelId: resolved?.ref.model ?? explicitModel
		};
	}
	return {
		provider: explicitProvider ?? defaultProvider,
		modelId: configuredDefault.model || "gpt-5.6-sol"
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/terminal-retry-state.ts
function createEmbeddedRunTerminalRetryState() {
	return {
		reasoningOnlyAttempts: 0,
		emptyResponseAttempts: 0,
		missingAssistantAttempts: 0,
		toolUseContinuationAttempts: 0,
		compactionContinuationAttempts: 0,
		compactionContinuationInstruction: null,
		beforeFinalizeRevisionAttempts: 0
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-dispatch-preparation.ts
async function prepareAndDispatchEmbeddedRunAttempt(input) {
	const { runInput, preparedRuntime, contextEngine, sessionPromptState, terminalRetryState, provider, modelId } = input;
	const params = runInput.runParams;
	const { workspaceResolution, workspaceDir, isCanonicalWorkspace, agentDir, resolvedSessionKey, resolvedToolResultFormat, startupStages, emitStartupStageSummary, lifecycleGeneration } = runInput;
	const { fastModeAutoOnSeconds, fastModeAutoProgressState, fastModeStartedAtMs, maybeAnnounceFastModeAutoOff, notifyAgentEvent, notifyExecutionPhase, notifyRunProgress, notifyToolResult, resolveAttemptFastModeParam } = runInput.progressController;
	const { laneTaskAbortController, laneTaskReleaseController, noteLaneTaskProgress } = runInput.laneController;
	const { requestedModelId, expectedHarnessArtifact, nativeModelOwned, authStorage, modelRegistry, attemptAuthProfileStore, lockedProfileId, resolveRunAttemptAuthProfileStore } = preparedRuntime;
	const runtime = preparedRuntime.snapshot();
	await fs.mkdir(workspaceDir, { recursive: true });
	if (!input.startupStagesEmitted) startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.workspace);
	const basePrompt = sessionPromptState.activePrompt.override ?? resolveEmbeddedAttemptBasePrompt({
		nativeModelOwned,
		provider,
		prompt: params.prompt
	});
	const prompt = terminalRetryState.compactionContinuationInstruction ? `${basePrompt}\n\n${terminalRetryState.compactionContinuationInstruction}` : basePrompt;
	const resolvedStreamApiKey = resolveAttemptDispatchApiKey({
		apiKeyInfo: runtime.apiKeyInfo,
		runtimeAuthState: runtime.runtimeAuthState
	});
	const attemptFastMode = resolveAttemptFastModeParam();
	const trajectorySessionFile = resolvedSessionKey ? (await resolveSessionTranscriptRuntimeReadTarget({
		agentId: workspaceResolution.agentId,
		sessionId: sessionPromptState.sessionId,
		sessionKey: resolvedSessionKey,
		storePath: resolveStorePath(params.config?.session?.store, { agentId: workspaceResolution.agentId })
	})).sessionFile : sessionPromptState.sessionFile;
	if (!input.startupStagesEmitted) startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.prompt);
	const runtimePlan = buildAgentRuntimePlan({
		provider,
		modelId,
		model: runtime.effectiveModel,
		modelApi: runtime.effectiveModel.api,
		harnessId: runtime.agentHarness.id,
		harnessRuntime: runtime.agentHarness.id,
		preparedAuthPlan: runtime.activePreparedAuthPlan,
		config: params.config,
		workspaceDir,
		agentDir,
		agentId: workspaceResolution.agentId,
		thinkingLevel: mapThinkingLevelForProvider(runtime.thinkLevel),
		extraParamsOverride: {
			...params.streamParams,
			fastMode: attemptFastMode
		}
	});
	const trajectoryAttribution = resolveAttemptTrajectoryAttribution({
		model: runtime.effectiveModel,
		modelId,
		provider,
		runtimePlan
	});
	const trajectoryRecorder = runtime.agentHarness.id === "codex" && !params.disableTrajectory ? createTrajectoryRuntimeRecorder({
		cfg: params.config,
		env: process.env,
		runId: params.runId,
		sessionId: sessionPromptState.sessionId,
		sessionKey: resolvedSessionKey,
		sessionFile: trajectorySessionFile,
		provider: trajectoryAttribution.provider,
		modelId: trajectoryAttribution.modelId,
		modelApi: trajectoryAttribution.modelApi,
		workspaceDir
	}) : void 0;
	let startupStagesEmitted = input.startupStagesEmitted;
	if (!startupStagesEmitted) {
		startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.runtimePlan);
		startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.dispatch);
		notifyExecutionPhase("attempt_dispatch", {
			provider,
			model: modelId
		});
		emitStartupStageSummary(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.dispatch);
		startupStagesEmitted = true;
	}
	return {
		dispatchedAttempt: await dispatchEmbeddedRunAttempt({
			params,
			runtime: {
				sessionId: sessionPromptState.sessionId,
				sessionFile: sessionPromptState.sessionFile,
				sessionTarget: sessionPromptState.sessionTarget,
				sessionKey: resolvedSessionKey,
				trajectorySessionFile,
				trajectoryRecorder: trajectoryRecorder ?? void 0,
				workspaceDir,
				isCanonicalWorkspace,
				agentDir,
				preparedModelRuntime: runInput.preparedModelRuntime,
				contextEngine: nativeModelOwned ? void 0 : contextEngine,
				contextTokenBudget: runtime.contextTokenBudget,
				contextWindowInfo: runtime.contextWindowInfo,
				prompt,
				provider,
				modelId,
				requestedModelId,
				fallbackActive: modelId !== requestedModelId || Boolean(input.resolveRuntimeFallbackReason()),
				fallbackReason: input.resolveRuntimeFallbackReason(),
				agentHarnessId: runtime.agentHarness.id,
				expectedRuntimeArtifact: expectedHarnessArtifact?.artifact,
				runtimePlan,
				model: runtime.effectiveModel,
				resolvedApiKey: resolvedStreamApiKey,
				authProfileId: runtime.lastProfileId,
				authProfileIdSource: lockedProfileId ? "user" : "auto",
				initialReplayState: input.replayState,
				authStorage,
				authProfileStore: resolveRunAttemptAuthProfileStore(),
				toolAuthProfileStore: agentHarnessBuildsOpenClawTools(runtime.agentHarness.id) ? attemptAuthProfileStore : void 0,
				modelRegistry,
				agentId: workspaceResolution.agentId,
				thinkLevel: runtime.thinkLevel,
				fastMode: attemptFastMode,
				fastModeStartedAtMs,
				fastModeAutoOnSeconds,
				fastModeAutoProgressState,
				toolResultFormat: resolvedToolResultFormat,
				skipPreparedUserTurnMessage: sessionPromptState.activePrompt.internal,
				apiKeyInfo: runtime.apiKeyInfo,
				runtimeAuthActive: runtime.runtimeAuthState !== null,
				captureRuntimeArtifact: Boolean(params.onSuccessfulAuthBinding || expectedHarnessArtifact)
			},
			control: {
				lifecycleGeneration,
				pluginHarnessOwnsTransport: runtime.pluginHarnessOwnsTransport,
				laneTaskAbortController,
				laneTaskReleaseController,
				noteLaneTaskProgress,
				onToolOutcome: input.observeToolOutcome,
				allocateToolOutcomeOrdinal: input.allocateToolOutcomeOrdinal,
				onToolStreamBoundary: maybeAnnounceFastModeAutoOff,
				onRunProgress: notifyRunProgress,
				onToolResult: notifyToolResult,
				onAgentEvent: notifyAgentEvent,
				onUserMessagePersisted: sessionPromptState.onUserMessagePersisted,
				onUserMessagePersistenceInvalidated: () => {
					sessionPromptState.activePrompt.persisted = false;
				},
				getPostCompactionAbortError: input.getPostCompactionAbortError,
				setPostCompactionAbortController: input.setPostCompactionAbortController,
				clearPostCompactionAbortController: input.clearPostCompactionAbortController
			},
			bootstrapPromptWarningSignaturesSeen: input.bootstrapPromptWarningSignaturesSeen,
			suppressNextUserMessagePersistence: sessionPromptState.suppressNextUserMessagePersistence,
			beforeAgentFinalizeRevisionAttempts: terminalRetryState.beforeFinalizeRevisionAttempts,
			maxBeforeAgentFinalizeRevisions: 3
		}),
		runtimePlan,
		startupStagesEmitted
	};
}
/** Creates a fresh breaker counter for one embedded run loop. */
function createIdleTimeoutBreakerState() {
	return { consecutiveIdleTimeoutsBeforeOutput: 0 };
}
/**
* Update the breaker counter from the latest attempt's outcome and report
* whether the cap is now tripped. Designed to be called from the outer run
* loop right after an embedded attempt completes.
*
* Pure function modulo the mutable `state.consecutiveIdleTimeoutsBeforeOutput`
* field, so the caller decides where the state lives (typically a `let` in
* the outer loop).
*
* Decision table:
*   idleTimedOut  completedModelProgress   action
*   ------------  ----------------------   ------
*   true          false                    count += 1   (wedged provider candidate)
*   true          true                     count = 0    (model is alive but slow tail)
*   false         true                     count = 0    (clean progress, all good)
*   false         false                    count unchanged (e.g. non-timeout error;
*                                                          don't poison or reset)
*
* The "false / false" branch matters: a non-timeout error attempt with no
* completed progress should not reset the breaker (it isn't a sign the
* provider is healthy), but it also shouldn't increment it (the issue at hand
* is idle timeouts, not arbitrary errors).
*
* `outputTokens` is intentionally not part of the reset condition. Some
* transports can accumulate billed output tokens from partial tool-call
* argument deltas before the model stalls; those tokens are cost, not completed
* progress, so they must not keep the breaker disarmed.
*/
function stepIdleTimeoutBreaker(state, input, options) {
	const cap = options?.cap ?? 5;
	if (input.idleTimedOut && !input.completedModelProgress) state.consecutiveIdleTimeoutsBeforeOutput += 1;
	else if (input.completedModelProgress) state.consecutiveIdleTimeoutsBeforeOutput = 0;
	return {
		consecutive: state.consecutiveIdleTimeoutsBeforeOutput,
		tripped: cap > 0 && state.consecutiveIdleTimeoutsBeforeOutput >= cap
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/retry-limit.ts
/**
* Converts retry-limit exhaustion into failover errors or terminal replies.
*/
/**
* Converts retry-limit exhaustion into either a failover escalation or a local
* user-visible error payload. Replay-safe provider failures throw FailoverError
* so the outer run loop can switch models; non-escalating reasons preserve
* retry metadata on the returned run result.
*/
function handleRetryLimitExhaustion(params) {
	if (params.decision.action === "fallback_model") throw new FailoverError(params.message, {
		reason: params.decision.reason,
		provider: params.provider,
		model: params.model,
		profileId: params.profileId,
		status: resolveFailoverStatus(params.decision.reason)
	});
	return {
		payloads: [{
			text: "Request failed after repeated internal retries. Please try again, or use /new to start a fresh session.",
			isError: true
		}],
		meta: {
			durationMs: params.durationMs,
			agentMeta: params.agentMeta,
			...params.replayInvalid ? { replayInvalid: true } : {},
			...params.livenessState ? { livenessState: params.livenessState } : {},
			error: {
				kind: "retry_limit",
				message: params.message
			}
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/run-attempt-result.ts
function normalizeEmbeddedRunAttemptResult(attempt) {
	const raw = attempt;
	return {
		...attempt,
		assistantTexts: raw.assistantTexts ?? [],
		toolMetas: raw.toolMetas ?? [],
		acceptedSessionSpawns: raw.acceptedSessionSpawns ?? [],
		messagesSnapshot: raw.messagesSnapshot ?? [],
		messagingToolSentTexts: raw.messagingToolSentTexts ?? [],
		messagingToolSentMediaUrls: raw.messagingToolSentMediaUrls ?? [],
		messagingToolSentTargets: raw.messagingToolSentTargets ?? [],
		messagingToolSourceReplyPayloads: raw.messagingToolSourceReplyPayloads ?? [],
		didDeliverSourceReplyViaMessageTool: raw.didDeliverSourceReplyViaMessageTool === true,
		itemLifecycle: raw.itemLifecycle ?? {
			startedCount: 0,
			completedCount: 0,
			activeCount: 0
		},
		replayMetadata: resolveAttemptReplayMetadata(raw),
		currentAttemptReplayMetadata: raw.currentAttemptReplayMetadata ?? void 0
	};
}
function hasCompletedModelProgressForIdleBreaker(attempt) {
	return attempt.assistantTexts.some((text) => text.trim().length > 0) || attempt.toolMetas.length > 0 || (attempt.clientToolCalls?.length ?? 0) > 0 || hasOutboundDeliveryEvidence(attempt) || attempt.itemLifecycle.completedCount > 0;
}
function buildTraceToolSummary(params) {
	if (!params.toolMetas?.length) return;
	const tools = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of params.toolMetas) {
		const toolName = normalizeOptionalString(entry.toolName);
		if (!toolName || seen.has(toolName)) continue;
		seen.add(toolName);
		tools.push(toolName);
	}
	const failedToolCalls = params.toolMetas.filter((entry) => entry.isError === true).length;
	return {
		calls: params.toolMetas.length,
		tools,
		failures: failedToolCalls || Number(params.fallbackHadFailure)
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/terminal-outcome.ts
function hasRestartAbortReason(value) {
	let candidate = value;
	for (let depth = 0; depth < 3; depth += 1) {
		if (isAgentRunRestartAbortReason(candidate)) return true;
		if (!(candidate instanceof Error)) return false;
		try {
			if (candidate.cause === void 0) return false;
			candidate = candidate.cause;
		} catch {
			return false;
		}
	}
	return false;
}
/** Projects private attempt metadata into the canonical agent terminal outcome. */
function resolveEmbeddedRunAttemptTerminalOutcome(params) {
	const { attempt } = params;
	const abortFields = resolveAgentRunAbortLifecycleFields(params.abortSignal);
	const attemptTimedOut = attempt.timedOut || attempt.idleTimedOut;
	const timedOut = attemptTimedOut || abortFields.stopReason === "timeout";
	const timedOutDuringPrompt = attemptTimedOut && !attempt.timedOutDuringCompaction && attempt.timedOutDuringToolExecution !== true;
	const timeoutPhase = attempt.promptTimeoutOutcome?.timeoutPhase ?? (timedOutDuringPrompt ? "provider" : void 0);
	const providerStarted = attempt.promptTimeoutOutcome?.providerStarted ?? (timedOutDuringPrompt ? true : void 0);
	const restartAborted = hasRestartAbortReason(attempt.promptError);
	const assistantStopReason = attempt.promptError ? void 0 : params.assistant?.stopReason;
	const stopReason = attemptTimedOut && timeoutPhase === void 0 && providerStarted !== true ? void 0 : abortFields.stopReason ?? (restartAborted ? "restart" : void 0) ?? (!timedOut && attempt.aborted ? "aborted" : void 0) ?? (!timedOut ? assistantStopReason : void 0);
	return buildAgentRunTerminalOutcome({
		status: timedOut ? "timeout" : abortFields.aborted || attempt.aborted || attempt.promptError || assistantStopReason === "error" ? "error" : "ok",
		error: attempt.promptError ?? params.assistant?.errorMessage,
		stopReason,
		livenessState: attempt.promptTimeoutOutcome?.livenessState,
		timeoutPhase,
		providerStarted
	});
}
function isEmbeddedRunTerminalTimeout(outcome) {
	return outcome.reason === "hard_timeout" || outcome.reason === "timed_out";
}
function isEmbeddedRunTerminalAbort(outcome) {
	return outcome.reason === "aborted" || outcome.reason === "cancelled";
}
function isEmbeddedRunTerminalInterrupted(outcome) {
	return isEmbeddedRunTerminalTimeout(outcome) || isEmbeddedRunTerminalAbort(outcome);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-normalization.ts
async function normalizeEmbeddedRunAttempt(input) {
	const { runInput, preparedRuntime, dispatchedAttempt, sessionPromptState, provider, modelId } = input;
	const params = runInput.runParams;
	const runtime = preparedRuntime.snapshot();
	const attempt = normalizeEmbeddedRunAttemptResult(dispatchedAttempt.rawAttempt);
	await sessionPromptState.waitForCurrentUserMessagePersistence();
	sessionPromptState.suppressNextUserMessagePersistence = sessionPromptState.activePrompt.persisted;
	if (dispatchedAttempt.cancellationRequested) {
		runInput.laneController.throwIfAborted();
		throw createAgentRunDirectAbortError();
	}
	const { aborted, externalAbort, promptError, promptErrorSource, preflightRecovery, timedOut, idleTimedOut, timedOutDuringCompaction, sessionIdUsed, sessionFileUsed, lastAssistant: sessionLastAssistant, currentAttemptAssistant, currentAttemptCompletedAssistant } = attempt;
	const timedOutDuringToolExecution = attempt.timedOutDuringToolExecution ?? false;
	const timedOutByRunBudget = attempt.timedOutByRunBudget ?? false;
	const sessionAssistantForCandidate = !currentAttemptAssistant && !isAssistantForModelRef(sessionLastAssistant, {
		provider: runtime.effectiveModel.provider,
		model: runtime.effectiveModel.id
	}) ? void 0 : sessionLastAssistant;
	const attemptAssistant = currentAttemptAssistant ?? sessionAssistantForCandidate;
	const terminalOutcome = resolveEmbeddedRunAttemptTerminalOutcome({
		attempt,
		assistant: currentAttemptAssistant,
		abortSignal: params.abortSignal
	});
	const terminalAborted = isEmbeddedRunTerminalAbort(terminalOutcome);
	const terminalTimedOut = isEmbeddedRunTerminalTimeout(terminalOutcome);
	const terminalInterrupted = isEmbeddedRunTerminalInterrupted(terminalOutcome);
	const signalOwnedInterruption = terminalInterrupted && params.abortSignal?.aborted === true;
	const setTerminalLifecycleMeta = (meta) => {
		const { stopReason, ...remainingMeta } = meta;
		const terminalStopReason = terminalInterrupted ? terminalOutcome.stopReason : stopReason;
		attempt.setTerminalLifecycleMeta?.({
			...remainingMeta,
			...terminalStopReason ? { stopReason: terminalStopReason } : {},
			aborted: terminalAborted
		});
	};
	const previousSessionId = sessionPromptState.sessionId;
	const previousSessionFile = sessionPromptState.sessionFile;
	sessionPromptState.adoptSessionId(sessionIdUsed);
	if (sessionFileUsed && sessionFileUsed !== sessionPromptState.sessionFile) sessionPromptState.sessionFile = sessionFileUsed;
	if (sessionIdUsed && sessionIdUsed !== previousSessionId || sessionFileUsed && sessionFileUsed !== previousSessionFile) {
		const marker = parseSqliteSessionFileMarker(sessionPromptState.sessionFile);
		sessionPromptState.sessionTarget = marker ? {
			agentId: marker.agentId,
			sessionId: marker.sessionId,
			sessionKey: runInput.resolvedSessionKey,
			storePath: marker.storePath
		} : void 0;
	}
	const bootstrapPromptWarningSignaturesSeen = attempt.bootstrapPromptWarningSignaturesSeen ?? (attempt.bootstrapPromptWarningSignature ? Array.from(/* @__PURE__ */ new Set([...input.bootstrapPromptWarningSignaturesSeen, attempt.bootstrapPromptWarningSignature])) : input.bootstrapPromptWarningSignaturesSeen);
	const lastAssistantUsage = normalizeUsage(sessionLastAssistant?.usage);
	const callUsage = resolveLatestCallUsage({
		currentAttemptCandidates: [normalizeUsage(currentAttemptAssistant?.usage), normalizeUsage(attempt.promptCache?.lastCallUsage)],
		carriedCandidates: [input.lastRunPromptUsage, lastAssistantUsage]
	});
	const attemptUsage = attempt.attemptUsage ?? callUsage.currentAttempt;
	mergeUsageIntoAccumulator(input.usageAccumulator, attemptUsage);
	const lastRunPromptUsage = callUsage.latest;
	const lastTurnTotal = callUsage.latest?.total;
	const breakerStep = stepIdleTimeoutBreaker(input.idleTimeoutBreakerState, {
		idleTimedOut: terminalTimedOut && idleTimedOut,
		completedModelProgress: hasCompletedModelProgressForIdleBreaker(attempt),
		outputTokens: attemptUsage?.output
	});
	if (breakerStep.tripped) {
		const message = `Idle-timeout cost-runaway breaker tripped: ${breakerStep.consecutive} consecutive idle timeouts without completed model progress (cap=5). Halting further attempts to bound paid model calls. See issue #76293.`;
		log$3.error(`[idle-timeout-circuit-breaker-tripped] sessionKey=${params.sessionKey ?? params.sessionId} provider=${provider}/${modelId} consecutive=${breakerStep.consecutive} cap=5`);
		return {
			action: "complete",
			result: handleRetryLimitExhaustion({
				message,
				decision: resolveRunFailoverDecision({
					stage: "retry_limit",
					fallbackConfigured: runInput.fallbackConfigured,
					failoverReason: input.lastRetryFailoverReason
				}),
				provider,
				model: modelId,
				profileId: runtime.lastProfileId,
				durationMs: Date.now() - runInput.startedAtMs,
				agentMeta: buildErrorAgentMeta({
					sessionId: sessionPromptState.sessionId,
					sessionFile: sessionPromptState.sessionFile,
					provider,
					model: preparedRuntime.model.id,
					...runtime.outerContextTokenMeta,
					usageAccumulator: input.usageAccumulator,
					lastRunPromptUsage,
					lastTurnTotal
				}),
				replayInvalid: input.replayState.replayInvalid ? true : void 0,
				livenessState: "blocked"
			})
		};
	}
	const attemptCompactionCount = Math.max(0, attempt.compactionCount ?? 0);
	input.contextRecoveryState.autoCompactionCount += attemptCompactionCount;
	if (typeof attempt.compactionTokensAfter === "number" && Number.isFinite(attempt.compactionTokensAfter) && attempt.compactionTokensAfter >= 0) input.contextRecoveryState.lastCompactionTokensAfter = Math.floor(attempt.compactionTokensAfter);
	if (attempt.contextBudgetStatus) input.contextRecoveryState.lastContextBudgetStatus = attempt.contextBudgetStatus;
	const activeErrorContext = resolveActiveErrorContext({
		provider,
		model: modelId,
		assistant: attemptAssistant
	});
	let replayState = input.replayState;
	const resolveReplayInvalidForAttempt = (incompleteTurnText) => replayState.replayInvalid || resolveReplayInvalidFlag({
		attempt,
		incompleteTurnText
	});
	if (resolveReplayInvalidForAttempt(null)) replayState.replayInvalid = true;
	replayState = observeReplayMetadata(replayState, attempt.replayMetadata);
	const formattedAssistantErrorText = sessionAssistantForCandidate ? formatAssistantErrorText(sessionAssistantForCandidate, {
		cfg: params.config,
		sessionKey: runInput.resolvedSessionKey ?? params.sessionId,
		provider: activeErrorContext.provider,
		model: activeErrorContext.model,
		authMode: runtime.lastProfileId ? preparedRuntime.attemptAuthProfileStore.profiles?.[runtime.lastProfileId]?.type : void 0
	}) : void 0;
	const assistantErrorText = sessionAssistantForCandidate?.stopReason === "error" ? sessionAssistantForCandidate.errorMessage?.trim() || formattedAssistantErrorText : void 0;
	if (!signalOwnedInterruption && !preparedRuntime.nativeModelOwned && preflightRecovery?.handled) {
		const retryingFromTranscript = preflightRecovery.source === "mid-turn";
		log$3.info(`[context-overflow-precheck] early recovery route=${preflightRecovery.route} completed for ${provider}/${modelId}; ` + (retryingFromTranscript ? "retrying from current transcript" : "retrying prompt"));
		if (retryingFromTranscript) sessionPromptState.continueFromCurrentTranscript();
		return {
			action: "retry",
			bootstrapPromptWarningSignaturesSeen,
			lastRunPromptUsage,
			lastTurnTotal,
			replayState
		};
	}
	return {
		action: "proceed",
		bootstrapPromptWarningSignaturesSeen,
		lastRunPromptUsage,
		lastTurnTotal,
		replayState,
		attempt,
		aborted,
		externalAbort,
		promptError,
		promptErrorSource,
		timedOut,
		idleTimedOut,
		timedOutDuringCompaction,
		timedOutDuringToolExecution,
		timedOutByRunBudget,
		sessionIdUsed,
		sessionFileUsed,
		currentAttemptAssistant,
		currentAttemptCompletedAssistant,
		attemptAssistant,
		terminalOutcome,
		terminalAborted,
		terminalTimedOut,
		terminalInterrupted,
		signalOwnedInterruption,
		setTerminalLifecycleMeta,
		attemptCompactionCount,
		activeErrorContext,
		resolveReplayInvalidForAttempt,
		assistantErrorText,
		canRestartForLiveSwitch: !hasOutboundDeliveryEvidence(attempt) && !attempt.didSendDeterministicApprovalPrompt && !attempt.lastToolError && (attempt.toolMetas?.length ?? 0) === 0 && (attempt.assistantTexts?.length ?? 0) === 0
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/blocked-run-result.ts
function buildEmbeddedRunBlockedResult(input) {
	return {
		payloads: [{
			text: input.text,
			isError: true
		}],
		meta: {
			durationMs: input.durationMs,
			agentMeta: input.agentMeta,
			systemPromptReport: input.attempt.systemPromptReport,
			finalAssistantVisibleText: input.text,
			finalAssistantRawText: input.text,
			finalPromptText: input.finalPromptText,
			replayInvalid: input.replayInvalid,
			livenessState: "blocked",
			error: {
				kind: input.errorKind,
				message: input.errorMessage
			}
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/codex-app-server-recovery.ts
function hasCodexAppServerRecoveryRetryBudget(params) {
	return !params.alreadyRetried && params.runLoopIterations < params.maxRunLoopIterations;
}
/**
* Decides whether a Codex app-server failure can be retried by replaying the
* same turn. The retry is intentionally narrow: stdio-only, replay-safe, once
* per run, and only before any assistant/tool/item side effects escape.
*/
function resolveCodexAppServerRecoveryRetry(params) {
	const failure = params.attempt.codexAppServerFailure;
	if (!failure) return {
		retry: false,
		reason: "not_codex_app_server_failure"
	};
	if (failure.kind !== "client_closed_before_turn_completed" && failure.kind !== "turn_completion_idle_timeout") return {
		retry: false,
		reason: failure.kind
	};
	if (failure.kind === "turn_completion_idle_timeout" && failure.turnWatchTimeoutKind !== "completion") return {
		retry: false,
		reason: failure.turnWatchTimeoutKind ?? "unknown_turn_watch_timeout"
	};
	if (failure.transport !== "stdio") return {
		retry: false,
		reason: "non_stdio_transport"
	};
	if (!params.retryAvailable) return {
		retry: false,
		reason: "retry_exhausted"
	};
	if (!failure.replaySafe || !params.attempt.replayMetadata.replaySafe) return {
		retry: false,
		reason: failure.replayBlockedReason ?? "replay_unsafe"
	};
	if (params.attempt.assistantTexts.some((text) => text.trim().length > 0)) return {
		retry: false,
		reason: "assistant_output"
	};
	if (params.attempt.toolMetas.length > 0 || params.attempt.clientToolCalls || params.attempt.lastToolError || params.attempt.didSendDeterministicApprovalPrompt) return {
		retry: false,
		reason: "tool_activity"
	};
	if (params.attempt.itemLifecycle.startedCount > 0 || params.attempt.itemLifecycle.activeCount > 0) return {
		retry: false,
		reason: "active_item"
	};
	return { retry: true };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/session-bootstrap.ts
const NO_REAL_CONVERSATION_MESSAGES_REASON = "no real conversation messages";
function buildContextEngineCompactionSessionTarget(params) {
	const sqliteMarker = parseSqliteSessionFileMarker(params.sessionFile);
	const agentId = params.sessionTarget?.agentId ?? sqliteMarker?.agentId ?? params.agentId;
	const sessionKey = params.sessionTarget?.sessionKey ?? params.sessionKey ?? params.sessionId;
	const storePath = params.sessionTarget?.storePath ?? sqliteMarker?.storePath ?? resolveStorePath(params.config?.session?.store, { agentId });
	return {
		agentId,
		sessionId: params.sessionTarget?.sessionId ?? sqliteMarker?.sessionId ?? params.sessionId,
		...sessionKey ? { sessionKey } : {},
		...storePath ? { storePath } : {},
		...params.sessionTarget?.threadId !== void 0 ? { threadId: params.sessionTarget.threadId } : {}
	};
}
function isNoRealConversationCompactionNoop(params) {
	return params.ok === true && params.compacted === false && params.reason === NO_REAL_CONVERSATION_MESSAGES_REASON;
}
async function resetNoRealConversationTokenSnapshot(params) {
	if (!params.sessionKey) return;
	const storePath = resolveStorePath(params.config?.session?.store, { agentId: params.agentId });
	try {
		await updateSessionEntry({
			storePath,
			sessionKey: params.sessionKey
		}, async () => ({
			totalTokens: 0,
			totalTokensFresh: true,
			inputTokens: void 0,
			outputTokens: void 0,
			cacheRead: void 0,
			cacheWrite: void 0,
			contextBudgetStatus: void 0,
			updatedAt: Date.now()
		}), {
			skipMaintenance: true,
			takeCacheOwnership: true
		});
	} catch (err) {
		log$3.warn(`[context-overflow-precheck] failed to reset stale context snapshot for ${params.sessionKey}: ${String(err)}`);
	}
}
/** Best-effort read-only session-key lookup for callers that only provide sessionId. */
function backfillSessionKey(params) {
	const trimmed = normalizeOptionalString(params.sessionKey);
	if (trimmed) return trimmed;
	if (!params.config || !params.sessionId) return;
	try {
		return normalizeOptionalString((normalizeOptionalString(params.agentId) ? resolveStoredSessionKeyForSessionId({
			cfg: params.config,
			sessionId: params.sessionId,
			agentId: params.agentId
		}) : resolveSessionKeyForRequest({
			cfg: params.config,
			sessionId: params.sessionId,
			clone: false
		})).sessionKey);
	} catch (err) {
		log$3.warn(`[backfillSessionKey] Failed to resolve sessionKey for sessionId=${redactRunIdentifier(sanitizeForLog(params.sessionId))}: ${formatErrorMessage(err)}`);
		return;
	}
}
function assertAgentHarnessRunAdmission(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return;
	const admissionAgentId = params.agentId ?? resolveAgentIdFromSessionKey(sessionKey);
	const storePath = normalizeOptionalString(params.sessionTarget?.storePath) ?? resolveStorePath(params.config?.session?.store, { agentId: admissionAgentId });
	const durableEntry = loadSessionEntry({
		...admissionAgentId ? { agentId: admissionAgentId } : {},
		readConsistency: "latest",
		sessionKey,
		storePath
	});
	const admissionError = resolveAgentHarnessRunAdmissionError({
		agentHarnessId: params.agentHarnessId,
		entry: durableEntry,
		modelSelectionLocked: params.modelSelectionLocked,
		sessionId: params.sessionId,
		sessionKey
	});
	if (admissionError) throw new Error(admissionError);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/overflow-context-recovery.ts
const MAX_OVERFLOW_COMPACTION_ATTEMPTS = 3;
async function recoverEmbeddedRunOverflow(input) {
	const contextOverflowError = !input.aborted && !input.signalOwnedInterruption ? (() => {
		if (input.promptError) {
			const errorText = formatErrorMessage(input.promptError);
			if (isLikelyContextOverflowError(errorText)) return {
				text: errorText,
				source: "promptError"
			};
			return null;
		}
		if (input.assistantErrorText && isLikelyContextOverflowError(input.assistantErrorText)) return {
			text: input.assistantErrorText,
			source: "assistantError"
		};
		return null;
	})() : null;
	if (!contextOverflowError || !input.genericCompactionRecoveryAllowed || input.contextTokenBudget === void 0) return { action: "none" };
	const runParams = input.runParams;
	const overflowDiagId = createCompactionDiagId();
	const errorText = contextOverflowError.text;
	const observedOverflowTokens = extractObservedOverflowTokenCount(errorText);
	const preflightRecovery = input.attempt.preflightRecovery;
	const preflightEstimatedPromptTokens = typeof preflightRecovery?.estimatedPromptTokens === "number" && Number.isFinite(preflightRecovery.estimatedPromptTokens) && preflightRecovery.estimatedPromptTokens > 0 ? Math.ceil(preflightRecovery.estimatedPromptTokens) : void 0;
	const overflowTokenCountForCompaction = observedOverflowTokens ?? preflightEstimatedPromptTokens ?? (input.contextTokenBudget > 0 ? input.contextTokenBudget + 1 : void 0);
	const activeSession = input.getActiveSession();
	log$3.warn(`[context-overflow-diag] sessionKey=${runParams.sessionKey ?? runParams.sessionId} provider=${input.provider}/${input.modelId} source=${contextOverflowError.source} messages=${input.attempt.messagesSnapshot?.length ?? 0} sessionFile=${activeSession.file} diagId=${overflowDiagId} compactionAttempts=${input.state.overflowCompactionAttempts} observedTokens=${observedOverflowTokens ?? "unknown"} preflightEstimatedTokens=${preflightEstimatedPromptTokens ?? "unknown"} compactionTokens=${overflowTokenCountForCompaction ?? "unknown"} error=${truncateUtf16Safe(errorText, 200)}`);
	const isCompactionFailure = isCompactionFailureError(errorText);
	if (!isCompactionFailure && input.attemptCompactionCount > 0 && input.state.overflowCompactionAttempts < MAX_OVERFLOW_COMPACTION_ATTEMPTS) {
		input.state.overflowCompactionAttempts += 1;
		log$3.warn(`context overflow persisted after in-attempt compaction (attempt ${input.state.overflowCompactionAttempts}/${MAX_OVERFLOW_COMPACTION_ATTEMPTS}); retrying prompt without additional compaction for ${input.provider}/${input.modelId}`);
		if (preflightRecovery?.source === "mid-turn") input.prepareCurrentTranscriptRetry();
		return { action: "retry" };
	}
	if (!isCompactionFailure && input.attemptCompactionCount === 0 && input.state.overflowCompactionAttempts < MAX_OVERFLOW_COMPACTION_ATTEMPTS) {
		if (log$3.isEnabled("debug")) log$3.debug(`[compaction-diag] decision diagId=${overflowDiagId} branch=compact isCompactionFailure=${isCompactionFailure} hasOversizedToolResults=unknown attempt=${input.state.overflowCompactionAttempts + 1} maxAttempts=${MAX_OVERFLOW_COMPACTION_ATTEMPTS}`);
		input.state.overflowCompactionAttempts += 1;
		log$3.warn(`context overflow detected (attempt ${input.state.overflowCompactionAttempts}/${MAX_OVERFLOW_COMPACTION_ATTEMPTS}); attempting auto-compaction for ${input.provider}/${input.modelId}`);
		let compactResult;
		let previousSessionId;
		await input.runOwnsCompactionBeforeHook("overflow recovery");
		try {
			const sessionBeforeCompaction = input.getActiveSession();
			const overflowCompactionRuntimeContext = {
				...buildEmbeddedCompactionRuntimeContext({
					sessionKey: runParams.sessionKey,
					messageChannel: runParams.messageChannel,
					messageProvider: runParams.messageProvider,
					clientCaps: runParams.clientCaps,
					chatType: runParams.chatType,
					agentAccountId: runParams.agentAccountId,
					currentChannelId: runParams.currentChannelId,
					currentThreadTs: runParams.currentThreadTs,
					currentMessageId: runParams.currentMessageId,
					authProfileId: input.authProfileId,
					authProfileIdSource: input.authProfileIdSource,
					runtimeAuthPlan: input.runtimeAuthPlan,
					workspaceDir: input.workspaceDir,
					agentDir: input.agentDir,
					config: runParams.config,
					skillsSnapshot: runParams.skillsSnapshot,
					senderId: runParams.senderId,
					provider: input.provider,
					modelId: input.modelId,
					harnessRuntime: input.harnessRuntime,
					modelSelectionLocked: runParams.modelSelectionLocked,
					modelFallbacksOverride: runParams.modelFallbacksOverride,
					thinkLevel: input.thinkLevel,
					reasoningLevel: runParams.reasoningLevel,
					bashElevated: runParams.bashElevated,
					extraSystemPrompt: runParams.extraSystemPrompt,
					sourceReplyDeliveryMode: runParams.sourceReplyDeliveryMode,
					ownerNumbers: runParams.ownerNumbers,
					activeProcessSessions: listActiveProcessSessionReferences({ scopeKey: resolveProcessToolScopeKey({
						sessionKey: runParams.sandboxSessionKey?.trim() || runParams.sessionKey,
						sessionId: sessionBeforeCompaction.id,
						agentId: input.sessionAgentId
					}) })
				}),
				...resolveContextEngineCapabilities({
					config: runParams.config,
					sessionKey: runParams.sessionKey,
					agentId: input.sessionAgentId,
					contextEnginePluginId: input.resolveContextEnginePluginId(),
					purpose: "context-engine.overflow-compaction"
				}),
				onCompactionHookMessages: input.onCompactionHookMessages,
				...input.attempt.promptCache ? { promptCache: input.attempt.promptCache } : {},
				runId: runParams.runId,
				trigger: "overflow",
				...overflowTokenCountForCompaction !== void 0 ? { currentTokenCount: overflowTokenCountForCompaction } : {},
				diagId: overflowDiagId,
				attempt: input.state.overflowCompactionAttempts,
				maxAttempts: MAX_OVERFLOW_COMPACTION_ATTEMPTS
			};
			const overflowCompactionRuntimeSettings = input.buildRuntimeSettings({
				tokenBudget: input.contextTokenBudget,
				degradedReason: "context_overflow"
			});
			compactResult = await compactContextEngineWithSafetyTimeout(input.contextEngine, {
				sessionId: sessionBeforeCompaction.id,
				sessionKey: input.resolvedSessionKey,
				agentId: input.sessionAgentId,
				sessionTarget: buildContextEngineCompactionSessionTarget({
					agentId: input.sessionAgentId,
					config: runParams.config,
					sessionFile: sessionBeforeCompaction.file,
					sessionId: sessionBeforeCompaction.id,
					sessionKey: input.resolvedSessionKey,
					sessionTarget: sessionBeforeCompaction.target
				}),
				tokenBudget: input.contextTokenBudget,
				...overflowTokenCountForCompaction !== void 0 ? { currentTokenCount: overflowTokenCountForCompaction } : {},
				force: true,
				compactionTarget: "budget",
				runtimeContext: overflowCompactionRuntimeContext,
				runtimeSettings: overflowCompactionRuntimeSettings
			}, resolveCompactionTimeoutMs(runParams.config), runParams.abortSignal);
			if (compactResult.ok && compactResult.compacted) {
				previousSessionId = await input.adoptCompactionTranscript(compactResult);
				const sessionAfterCompaction = input.getActiveSession();
				await runContextEngineMaintenance({
					contextEngine: input.contextEngine,
					sessionId: sessionAfterCompaction.id,
					sessionKey: runParams.sessionKey,
					sessionTarget: sessionAfterCompaction.target,
					sessionFile: sessionAfterCompaction.file,
					reason: "compaction",
					runtimeContext: overflowCompactionRuntimeContext,
					runtimeSettings: overflowCompactionRuntimeSettings,
					config: runParams.config,
					agentId: input.sessionAgentId
				});
			}
		} catch (compactErr) {
			log$3.warn(`contextEngine.compact() threw during overflow recovery for ${input.provider}/${input.modelId}: ${String(compactErr)}`);
			compactResult = {
				ok: false,
				compacted: false,
				reason: String(compactErr)
			};
		}
		await input.runOwnsCompactionAfterHook("overflow recovery", compactResult, previousSessionId);
		if (preflightRecovery && isNoRealConversationCompactionNoop(compactResult)) {
			input.state.lastCompactionTokensAfter = void 0;
			input.state.lastContextBudgetStatus = void 0;
			await resetNoRealConversationTokenSnapshot({
				config: runParams.config,
				sessionKey: runParams.sessionKey,
				agentId: input.sessionAgentId
			});
			log$3.info(`[context-overflow-precheck] stale token state had no real conversation messages for ${input.provider}/${input.modelId}; resetting the context snapshot and retrying prompt`);
			if (preflightRecovery.source === "mid-turn") input.prepareCurrentTranscriptRetry();
			return { action: "retry" };
		}
		if (compactResult.compacted) {
			await input.adoptCompactionTranscript(compactResult);
			const tokensAfter = compactResult.result?.tokensAfter;
			if (typeof tokensAfter === "number" && Number.isFinite(tokensAfter) && tokensAfter >= 0) input.state.lastCompactionTokensAfter = Math.floor(tokensAfter);
			if (preflightRecovery?.route === "compact_then_truncate") {
				const sessionAfterCompaction = input.getActiveSession();
				const truncResult = await truncateOversizedToolResultsInActiveTarget({
					scope: {
						sessionId: sessionAfterCompaction.id,
						sessionKey: runParams.sessionKey ?? sessionAfterCompaction.id,
						sessionFile: sessionAfterCompaction.file,
						agentId: input.sessionAgentId
					},
					contextWindowTokens: input.contextTokenBudget,
					maxCharsOverride: resolveLiveToolResultMaxChars({
						contextWindowTokens: input.contextTokenBudget,
						cfg: runParams.config,
						agentId: input.sessionAgentId
					}),
					config: runParams.config,
					protectTrailingToolResults: true
				});
				if (truncResult.truncated) log$3.info(`[context-overflow-precheck] post-compaction tool-result truncation succeeded for ${input.provider}/${input.modelId}; truncated ${truncResult.truncatedCount} tool result(s)`);
				else log$3.warn(`[context-overflow-precheck] post-compaction tool-result truncation did not help for ${input.provider}/${input.modelId}: ${truncResult.reason ?? "unknown"}`);
			}
			input.state.autoCompactionCount += 1;
			log$3.info(`auto-compaction succeeded for ${input.provider}/${input.modelId}; retrying prompt`);
			input.armPostCompactionGuard();
			if (preflightRecovery?.source === "mid-turn") input.prepareCurrentTranscriptRetry();
			else await input.prepareCompactedTranscriptRetry();
			return { action: "retry" };
		}
		log$3.warn(`auto-compaction failed for ${input.provider}/${input.modelId}: ${compactResult.reason ?? "nothing to compact"}`);
	}
	if (!input.state.toolResultTruncationAttempted) {
		const toolResultMaxChars = resolveLiveToolResultMaxChars({
			contextWindowTokens: input.contextTokenBudget,
			cfg: runParams.config,
			agentId: input.sessionAgentId
		});
		if (input.attempt.messagesSnapshot ? sessionLikelyHasOversizedToolResults({
			messages: input.attempt.messagesSnapshot,
			contextWindowTokens: input.contextTokenBudget,
			maxCharsOverride: toolResultMaxChars
		}) : false) {
			input.state.toolResultTruncationAttempted = true;
			log$3.warn(`[context-overflow-recovery] Attempting tool result truncation for ${input.provider}/${input.modelId} (contextWindow=${input.contextTokenBudget} tokens)`);
			const session = input.getActiveSession();
			const truncResult = await truncateOversizedToolResultsInActiveTarget({
				scope: {
					sessionId: session.id,
					sessionKey: runParams.sessionKey ?? session.id,
					sessionFile: session.file,
					agentId: input.sessionAgentId
				},
				contextWindowTokens: input.contextTokenBudget,
				maxCharsOverride: toolResultMaxChars,
				config: runParams.config,
				protectTrailingToolResults: preflightRecovery?.route === "compact_then_truncate"
			});
			if (truncResult.truncated) {
				log$3.info(`[context-overflow-recovery] Truncated ${truncResult.truncatedCount} tool result(s); retrying prompt`);
				if (preflightRecovery?.source === "mid-turn") input.prepareCurrentTranscriptRetry();
				return { action: "retry" };
			}
			log$3.warn(`[context-overflow-recovery] Tool result truncation did not help: ${truncResult.reason ?? "unknown"}`);
		}
	}
	if ((isCompactionFailure || input.state.overflowCompactionAttempts >= MAX_OVERFLOW_COMPACTION_ATTEMPTS) && log$3.isEnabled("debug")) log$3.debug(`[compaction-diag] decision diagId=${overflowDiagId} branch=give_up isCompactionFailure=${isCompactionFailure} hasOversizedToolResults=unknown attempt=${input.state.overflowCompactionAttempts} maxAttempts=${MAX_OVERFLOW_COMPACTION_ATTEMPTS}`);
	const kind = isCompactionFailure ? "compaction_failure" : "context_overflow";
	const userText = "Context overflow: prompt too large for the model. Try /reset (or /new) to start a fresh session, or use a larger-context model.";
	log$3.warn(`[context-overflow-recovery] exhausted provider overflow recovery for ${input.provider}/${input.modelId}; livenessState=blocked suggestedAction=reset_or_new kind=${kind}`);
	return {
		action: "surface",
		kind,
		errorText,
		userText
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/prompt-failure.ts
async function handleEmbeddedPromptFailure(input) {
	const promptAuthMode = input.authProfileId ? input.authProfileStore.profiles?.[input.authProfileId]?.type : void 0;
	const normalizedPromptFailover = coerceToFailoverError(input.promptError, {
		provider: input.activeErrorContext.provider,
		model: input.activeErrorContext.model,
		profileId: input.authProfileId,
		authMode: promptAuthMode,
		sessionId: input.sessionIdUsed,
		lane: input.lane
	});
	const promptErrorDetails = normalizedPromptFailover ? describeFailoverError(normalizedPromptFailover) : describeFailoverError(input.promptError);
	if (normalizedPromptFailover?.suspend) input.suspendForFailure({
		cfg: input.runParams.config,
		agentDir: input.agentDir,
		sessionId: input.suspensionSessionId,
		reason: resolveSessionSuspensionReason(normalizedPromptFailover.reason),
		failedProvider: normalizedPromptFailover.provider ?? input.provider,
		failedModel: normalizedPromptFailover.model ?? input.modelId
	});
	const errorText = promptErrorDetails.message || formatErrorMessage(input.promptError);
	if (await input.maybeRefreshRuntimeAuthForAuthError(errorText, input.runtimeAuthRetry)) return {
		action: "retry",
		thinkLevel: input.thinkLevel,
		authRetryPending: true,
		lastRetryFailoverReason: input.previousRetryFailoverReason
	};
	const blockedResult = resolveBlockedPromptResult(input, errorText);
	if (blockedResult) return {
		action: "complete",
		result: blockedResult
	};
	const promptFailoverReason = promptErrorDetails.reason ?? classifyFailoverReason(errorText, { provider: input.provider });
	const promptProfileFailureReason = input.resolveAuthProfileFailureReason(promptFailoverReason, {
		providerStarted: input.promptErrorSource === "prompt",
		transientRateLimit: promptFailoverReason === "rate_limit" && isShortWindowRateLimitMessage(errorText)
	});
	const promptFailoverFailure = promptFailoverReason !== null || isFailoverErrorMessage(errorText, { provider: input.provider });
	const promptTimeoutFallbackSafe = input.promptErrorSource === "prompt" && promptFailoverReason === "timeout" && !input.attempt.codexAppServerFailure && input.attempt.promptTimeoutOutcome?.replayInvalid !== true && input.attempt.replayMetadata.replaySafe;
	const failedProfileId = input.authProfileId;
	const logFailoverDecision = createFailoverDecisionLogger({
		stage: "prompt",
		runId: input.runParams.runId,
		rawError: errorText,
		failoverReason: promptFailoverReason,
		profileFailureReason: promptProfileFailureReason,
		provider: input.provider,
		model: input.modelId,
		sourceProvider: input.provider,
		sourceModel: input.modelId,
		profileId: failedProfileId,
		fallbackConfigured: input.fallbackConfigured,
		aborted: input.aborted
	});
	if (promptFailoverReason === "rate_limit") input.maybeEscalateRateLimitProfileFallback({
		failoverProvider: input.provider,
		failoverModel: input.modelId,
		logFallbackDecision: logFailoverDecision
	});
	let failoverDecision = resolveRunFailoverDecision({
		stage: "prompt",
		aborted: input.aborted,
		externalAbort: input.externalAbort,
		fallbackConfigured: input.fallbackConfigured,
		failoverCode: promptErrorDetails.code,
		failoverFailure: promptFailoverFailure,
		failoverReason: promptFailoverReason,
		harnessOwnsTransport: input.pluginHarnessOwnsTransport,
		promptTimeoutFallbackSafe,
		timedOutByRunBudget: input.timedOutByRunBudget,
		profileRotated: false
	});
	if (failoverDecision.action === "rotate_profile" && await input.advanceAttemptAuthProfile()) {
		if (failedProfileId && promptProfileFailureReason) input.maybeMarkAuthProfileFailure({
			profileId: failedProfileId,
			reason: promptProfileFailureReason,
			modelId: input.modelId
		}).catch((error) => {
			log$3.warn(`prompt profile failure mark failed: ${String(error)}`);
		});
		input.traceAttempts.push({
			provider: input.provider,
			model: input.modelId,
			result: promptFailoverReason === "timeout" ? "timeout" : "rotate_profile",
			...promptFailoverReason ? { reason: promptFailoverReason } : {},
			stage: "prompt"
		});
		const lastRetryFailoverReason = mergeRetryFailoverReason({
			previous: input.previousRetryFailoverReason,
			failoverReason: promptFailoverReason
		});
		logFailoverDecision("rotate_profile");
		await input.maybeBackoffBeforeOverloadFailover(promptFailoverReason);
		return {
			action: "retry",
			thinkLevel: input.getThinkLevel(),
			authRetryPending: false,
			lastRetryFailoverReason
		};
	}
	if (failoverDecision.action === "rotate_profile") failoverDecision = resolveRunFailoverDecision({
		stage: "prompt",
		aborted: input.aborted,
		externalAbort: input.externalAbort,
		fallbackConfigured: input.fallbackConfigured,
		failoverCode: promptErrorDetails.code,
		failoverFailure: promptFailoverFailure,
		failoverReason: promptFailoverReason,
		harnessOwnsTransport: input.pluginHarnessOwnsTransport,
		promptTimeoutFallbackSafe,
		timedOutByRunBudget: input.timedOutByRunBudget,
		profileRotated: true
	});
	if (failedProfileId && promptProfileFailureReason) try {
		await input.maybeMarkAuthProfileFailure({
			profileId: failedProfileId,
			reason: promptProfileFailureReason,
			modelId: input.modelId
		});
	} catch (error) {
		log$3.warn(`prompt profile failure mark failed: ${String(error)}`);
	}
	const fallbackThinking = pickFallbackThinkingLevel({
		message: errorText,
		attempted: input.attemptedThinking
	});
	if (fallbackThinking) {
		log$3.warn(`unsupported thinking level for ${input.provider}/${input.modelId}; retrying with ${fallbackThinking}`);
		return {
			action: "retry",
			thinkLevel: fallbackThinking,
			authRetryPending: false,
			lastRetryFailoverReason: input.previousRetryFailoverReason
		};
	}
	if (failoverDecision.action === "fallback_model") {
		const fallbackReason = failoverDecision.reason ?? "unknown";
		const status = resolveFailoverStatus(fallbackReason);
		input.traceAttempts.push({
			provider: input.provider,
			model: input.modelId,
			result: promptFailoverReason === "timeout" ? "timeout" : "fallback_model",
			reason: fallbackReason,
			stage: "prompt",
			...typeof status === "number" ? { status } : {}
		});
		logFailoverDecision("fallback_model", { status });
		await input.maybeBackoffBeforeOverloadFailover(promptFailoverReason);
		throw normalizedPromptFailover ?? new FailoverError(errorText, {
			reason: fallbackReason,
			provider: input.provider,
			model: input.modelId,
			profileId: input.authProfileId,
			authMode: promptAuthMode,
			sessionId: input.sessionIdUsed,
			lane: input.lane,
			status
		});
	}
	if (failoverDecision.action === "surface_error") {
		input.traceAttempts.push({
			provider: input.provider,
			model: input.modelId,
			result: promptFailoverReason === "timeout" ? "timeout" : "surface_error",
			...promptFailoverReason ? { reason: promptFailoverReason } : {},
			stage: "prompt"
		});
		logFailoverDecision("surface_error");
	}
	throw toErrorObject(input.promptError, "Prompt failed");
}
function resolveBlockedPromptResult(input, errorText) {
	let text;
	let errorKind;
	if (/incorrect role information|roles must alternate/i.test(errorText)) {
		text = "Message ordering conflict - please try again. If this persists, use /new to start a fresh session.";
		errorKind = "role_ordering";
	} else {
		const imageSizeError = parseImageSizeError(errorText);
		if (!imageSizeError) return;
		const maxMb = imageSizeError.maxMb;
		const maxMbLabel = typeof maxMb === "number" && Number.isFinite(maxMb) ? `${maxMb}` : null;
		text = `Image too large for the model${maxMbLabel ? ` (max ${maxMbLabel}MB)` : ""}. Please compress or resize the image and try again.`;
		errorKind = "image_size";
	}
	const replayInvalid = input.resolveReplayInvalid();
	input.setTerminalLifecycleMeta({
		replayInvalid,
		livenessState: "blocked"
	});
	return buildEmbeddedRunBlockedResult({
		text,
		errorKind,
		errorMessage: errorText,
		durationMs: Date.now() - input.startedAtMs,
		agentMeta: input.buildErrorAgentMeta(),
		attempt: input.attempt,
		replayInvalid,
		finalPromptText: input.attempt.finalPromptText
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run/timeout-context-recovery.ts
const MAX_TIMEOUT_COMPACTION_ATTEMPTS = 2;
async function recoverEmbeddedRunTimeout(input) {
	if (!input.genericCompactionRecoveryAllowed || input.contextTokenBudget === void 0 || !input.timedOut || input.signalOwnedInterruption || input.timedOutDuringCompaction || input.timedOutDuringToolExecution || input.timedOutByRunBudget) return false;
	const lastTurnPromptTokens = deriveContextPromptTokens({ lastCallUsage: input.lastRunPromptUsage });
	const tokenUsedRatio = lastTurnPromptTokens != null && input.contextTokenBudget > 0 ? lastTurnPromptTokens / input.contextTokenBudget : 0;
	if (input.state.timeoutCompactionAttempts >= MAX_TIMEOUT_COMPACTION_ATTEMPTS) {
		log$3.warn(`[timeout-compaction] already attempted timeout compaction ${input.state.timeoutCompactionAttempts} time(s); falling through to failover rotation`);
		return false;
	}
	if (tokenUsedRatio <= .65) return false;
	const timeoutDiagId = createCompactionDiagId();
	input.state.timeoutCompactionAttempts += 1;
	log$3.warn(`[timeout-compaction] LLM timed out with high prompt token usage (${Math.round(tokenUsedRatio * 100)}%); attempting compaction before retry (attempt ${input.state.timeoutCompactionAttempts}/${MAX_TIMEOUT_COMPACTION_ATTEMPTS}) diagId=${timeoutDiagId}`);
	let timeoutCompactResult;
	await input.runOwnsCompactionBeforeHook("timeout recovery");
	try {
		const activeSession = input.getActiveSession();
		const runParams = input.runParams;
		const timeoutCompactionRuntimeContext = {
			...buildEmbeddedCompactionRuntimeContext({
				sessionKey: runParams.sessionKey,
				messageChannel: runParams.messageChannel,
				messageProvider: runParams.messageProvider,
				clientCaps: runParams.clientCaps,
				chatType: runParams.chatType,
				agentAccountId: runParams.agentAccountId,
				currentChannelId: runParams.currentChannelId,
				currentThreadTs: runParams.currentThreadTs,
				currentMessageId: runParams.currentMessageId,
				authProfileId: input.authProfileId,
				authProfileIdSource: input.authProfileIdSource,
				runtimeAuthPlan: input.runtimeAuthPlan,
				workspaceDir: input.workspaceDir,
				agentDir: input.agentDir,
				config: runParams.config,
				skillsSnapshot: runParams.skillsSnapshot,
				senderId: runParams.senderId,
				provider: input.provider,
				modelId: input.modelId,
				harnessRuntime: input.harnessRuntime,
				modelSelectionLocked: runParams.modelSelectionLocked,
				modelFallbacksOverride: runParams.modelFallbacksOverride,
				thinkLevel: input.thinkLevel,
				reasoningLevel: runParams.reasoningLevel,
				bashElevated: runParams.bashElevated,
				extraSystemPrompt: runParams.extraSystemPrompt,
				sourceReplyDeliveryMode: runParams.sourceReplyDeliveryMode,
				ownerNumbers: runParams.ownerNumbers,
				activeProcessSessions: listActiveProcessSessionReferences({ scopeKey: resolveProcessToolScopeKey({
					sessionKey: runParams.sandboxSessionKey?.trim() || runParams.sessionKey,
					sessionId: activeSession.id,
					agentId: input.sessionAgentId
				}) })
			}),
			...resolveContextEngineCapabilities({
				config: runParams.config,
				sessionKey: runParams.sessionKey,
				agentId: input.sessionAgentId,
				contextEnginePluginId: input.resolveContextEnginePluginId(),
				purpose: "context-engine.timeout-compaction"
			}),
			onCompactionHookMessages: input.onCompactionHookMessages,
			...input.attempt.promptCache ? { promptCache: input.attempt.promptCache } : {},
			runId: runParams.runId,
			trigger: "timeout_recovery",
			diagId: timeoutDiagId,
			attempt: input.state.timeoutCompactionAttempts,
			maxAttempts: MAX_TIMEOUT_COMPACTION_ATTEMPTS
		};
		timeoutCompactResult = await compactContextEngineWithSafetyTimeout(input.contextEngine, {
			sessionId: activeSession.id,
			sessionKey: input.resolvedSessionKey,
			agentId: input.sessionAgentId,
			sessionTarget: buildContextEngineCompactionSessionTarget({
				agentId: input.sessionAgentId,
				config: runParams.config,
				sessionFile: activeSession.file,
				sessionId: activeSession.id,
				sessionKey: input.resolvedSessionKey,
				sessionTarget: activeSession.target
			}),
			tokenBudget: input.contextTokenBudget,
			force: true,
			compactionTarget: "budget",
			runtimeContext: timeoutCompactionRuntimeContext,
			runtimeSettings: input.buildRuntimeSettings({ tokenBudget: input.contextTokenBudget })
		}, resolveCompactionTimeoutMs(runParams.config), runParams.abortSignal);
	} catch (compactErr) {
		log$3.warn(`[timeout-compaction] contextEngine.compact() threw during timeout recovery for ${input.provider}/${input.modelId}: ${String(compactErr)}`);
		timeoutCompactResult = {
			ok: false,
			compacted: false,
			reason: String(compactErr)
		};
	}
	const previousSessionId = timeoutCompactResult.compacted ? await input.adoptCompactionTranscript(timeoutCompactResult) : void 0;
	await input.runOwnsCompactionAfterHook("timeout recovery", timeoutCompactResult, previousSessionId);
	if (!timeoutCompactResult.compacted) {
		log$3.warn(`[timeout-compaction] compaction did not reduce context for ${input.provider}/${input.modelId}; falling through to normal handling`);
		return false;
	}
	input.state.autoCompactionCount += 1;
	const tokensAfter = timeoutCompactResult.result?.tokensAfter;
	if (typeof tokensAfter === "number" && Number.isFinite(tokensAfter) && tokensAfter >= 0) input.state.lastCompactionTokensAfter = Math.floor(tokensAfter);
	if (input.contextEngine.info.ownsCompaction === true) {
		const activeSession = input.getActiveSession();
		await runPostCompactionSideEffects({
			config: input.runParams.config,
			sessionKey: input.runParams.sessionKey,
			sessionId: activeSession.id,
			agentId: input.sessionAgentId,
			sessionFile: activeSession.file
		});
	}
	log$3.info(`[timeout-compaction] compaction succeeded for ${input.provider}/${input.modelId}; retrying prompt`);
	input.armPostCompactionGuard();
	return true;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-recovery.ts
async function recoverEmbeddedRunAttempt(input) {
	const { runInput, preparedRuntime, normalizedAttempt, runtimePlan, sessionPromptState, failoverRetryController, compactionRuntime } = input;
	const params = runInput.runParams;
	const runtime = preparedRuntime.snapshot();
	const { attempt, aborted, externalAbort, promptError, promptErrorSource, timedOut, timedOutDuringCompaction, timedOutDuringToolExecution, timedOutByRunBudget, sessionIdUsed, attemptAssistant, terminalInterrupted, signalOwnedInterruption, setTerminalLifecycleMeta, attemptCompactionCount, activeErrorContext, resolveReplayInvalidForAttempt, assistantErrorText, canRestartForLiveSwitch } = normalizedAttempt;
	const retry = (updates) => ({
		action: "retry",
		authRetryPending: updates?.authRetryPending ?? false,
		codexAppServerRecoveryRetries: updates?.codexAppServerRecoveryRetries ?? input.codexAppServerRecoveryRetries,
		lastRetryFailoverReason: updates?.lastRetryFailoverReason === void 0 ? input.lastRetryFailoverReason : updates.lastRetryFailoverReason,
		thinkLevel: updates?.thinkLevel ?? runtime.thinkLevel
	});
	const requestedSelection = shouldSwitchToLiveModel({
		cfg: params.config,
		sessionKey: runInput.resolvedSessionKey,
		agentId: params.agentId,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		currentProvider: preparedRuntime.provider,
		currentModel: preparedRuntime.modelId,
		currentAgentRuntimeOverride: params.agentHarnessRuntimeOverride,
		currentAuthProfileId: preparedRuntime.preferredProfileId,
		currentAuthProfileIdSource: params.authProfileIdSource
	});
	if (!signalOwnedInterruption && requestedSelection && canRestartForLiveSwitch) {
		await clearLiveModelSwitchPending({
			cfg: params.config,
			sessionKey: runInput.resolvedSessionKey,
			agentId: params.agentId
		});
		log$3.info(`live session model switch requested during active attempt for ${params.sessionId}: ${preparedRuntime.provider}/${preparedRuntime.modelId} -> ${requestedSelection.provider}/${requestedSelection.model}`);
		throw new LiveSessionModelSwitchError(requestedSelection);
	}
	const commonRecoveryInput = {
		runParams: params,
		state: input.contextRecoveryState,
		contextEngine: input.contextEngine,
		contextTokenBudget: runtime.contextTokenBudget,
		genericCompactionRecoveryAllowed: preparedRuntime.genericCompactionRecoveryAllowed,
		attempt,
		runtimeAuthPlan: runtimePlan.auth,
		resolvedSessionKey: runInput.resolvedSessionKey,
		sessionAgentId: input.sessionAgentId,
		agentDir: runInput.agentDir,
		workspaceDir: runInput.workspaceDir,
		provider: preparedRuntime.provider,
		modelId: preparedRuntime.modelId,
		harnessRuntime: runtime.agentHarness.id,
		thinkLevel: runtime.thinkLevel,
		authProfileId: runtime.lastProfileId,
		authProfileIdSource: preparedRuntime.lockedProfileId ? "user" : "auto",
		resolveContextEnginePluginId: input.resolveContextEnginePluginId,
		buildRuntimeSettings: input.buildRuntimeSettings,
		...compactionRuntime,
		getActiveSession: () => ({
			id: sessionPromptState.sessionId,
			file: sessionPromptState.sessionFile,
			target: sessionPromptState.sessionTarget
		}),
		armPostCompactionGuard: input.armPostCompactionGuard
	};
	if (await recoverEmbeddedRunTimeout({
		...commonRecoveryInput,
		timedOut,
		signalOwnedInterruption,
		timedOutDuringCompaction,
		timedOutDuringToolExecution,
		timedOutByRunBudget,
		lastRunPromptUsage: input.lastRunPromptUsage
	})) return retry();
	const overflowRecovery = await recoverEmbeddedRunOverflow({
		...commonRecoveryInput,
		aborted,
		signalOwnedInterruption,
		promptError,
		assistantErrorText,
		attemptCompactionCount,
		prepareCurrentTranscriptRetry: sessionPromptState.continueFromCurrentTranscript,
		prepareCompactedTranscriptRetry: sessionPromptState.prepareCompactedTranscriptRetry
	});
	if (overflowRecovery.action === "retry") return retry();
	if (overflowRecovery.action === "surface") {
		const replayInvalid = resolveReplayInvalidForAttempt();
		setTerminalLifecycleMeta({
			replayInvalid,
			livenessState: "blocked"
		});
		return {
			action: "complete",
			result: buildEmbeddedRunBlockedResult({
				text: overflowRecovery.userText,
				errorKind: overflowRecovery.kind,
				errorMessage: overflowRecovery.errorText,
				durationMs: Date.now() - runInput.startedAtMs,
				agentMeta: buildErrorAgentMeta({
					sessionId: sessionIdUsed,
					sessionFile: sessionPromptState.sessionFile,
					provider: preparedRuntime.provider,
					model: preparedRuntime.model.id,
					...runtime.outerContextTokenMeta,
					usageAccumulator: input.usageAccumulator,
					lastRunPromptUsage: input.lastRunPromptUsage,
					lastAssistant: attemptAssistant,
					lastTurnTotal: input.lastTurnTotal
				}),
				attempt,
				replayInvalid,
				finalPromptText: attempt.finalPromptText
			})
		};
	}
	if (promptErrorSource === "hook:before_agent_run" && !terminalInterrupted) {
		const errorText = formatErrorMessage(promptError);
		const replayInvalid = resolveReplayInvalidForAttempt();
		setTerminalLifecycleMeta({
			replayInvalid,
			livenessState: "blocked"
		});
		return {
			action: "complete",
			result: buildEmbeddedRunBlockedResult({
				text: errorText,
				errorKind: "hook_block",
				errorMessage: errorText,
				durationMs: Date.now() - runInput.startedAtMs,
				agentMeta: buildErrorAgentMeta({
					sessionId: sessionIdUsed,
					sessionFile: sessionPromptState.sessionFile,
					provider: preparedRuntime.provider,
					model: preparedRuntime.model.id,
					...runtime.outerContextTokenMeta,
					usageAccumulator: input.usageAccumulator,
					lastRunPromptUsage: input.lastRunPromptUsage,
					lastAssistant: attemptAssistant,
					lastTurnTotal: input.lastTurnTotal
				}),
				attempt,
				replayInvalid
			})
		};
	}
	const hasRecoverableCodexAppServerTimeoutOutcome = Boolean(attempt.codexAppServerFailure && attempt.promptTimeoutOutcome);
	let shouldSurfaceCodexCompletionTimeout = false;
	if (promptError && promptErrorSource !== "compaction" && attempt.codexAppServerFailure) {
		if (resolveCodexAppServerRecoveryRetry({
			attempt,
			retryAvailable: input.codexAppServerRecoveryRetryAvailable
		}).retry) {
			runInput.laneController.throwIfAborted();
			sessionPromptState.suppressNextUserMessagePersistence = true;
			log$3.warn(`codex app-server replay-safe failure; retrying once failureKind=${attempt.codexAppServerFailure?.kind} runId=${params.runId} sessionId=${params.sessionId}`);
			return retry({ codexAppServerRecoveryRetries: input.codexAppServerRecoveryRetries + 1 });
		}
		shouldSurfaceCodexCompletionTimeout = attempt.codexAppServerFailure?.kind === "turn_completion_idle_timeout" && attempt.timedOut;
		if (attempt.codexAppServerFailure && !hasRecoverableCodexAppServerTimeoutOutcome && !shouldSurfaceCodexCompletionTimeout) throw toErrorObject(promptError, "Prompt failed");
	}
	if (promptError && !terminalInterrupted && promptErrorSource !== "compaction" && !hasRecoverableCodexAppServerTimeoutOutcome && !shouldSurfaceCodexCompletionTimeout) {
		const promptFailureOutcome = await handleEmbeddedPromptFailure({
			runParams: params,
			attempt,
			promptError,
			promptErrorSource,
			activeErrorContext,
			provider: preparedRuntime.provider,
			modelId: preparedRuntime.modelId,
			authProfileId: runtime.lastProfileId,
			authProfileStore: preparedRuntime.attemptAuthProfileStore,
			sessionIdUsed,
			lane: runInput.globalLane,
			agentDir: runInput.agentDir,
			suspensionSessionId: sessionPromptState.sessionId ?? params.sessionId,
			runtimeAuthRetry: input.runtimeAuthRetry,
			maybeRefreshRuntimeAuthForAuthError: preparedRuntime.maybeRefreshRuntimeAuthForAuthError,
			suspendForFailure: runInput.suspendForFailure,
			resolveReplayInvalid: resolveReplayInvalidForAttempt,
			setTerminalLifecycleMeta,
			buildErrorAgentMeta: () => buildErrorAgentMeta({
				sessionId: sessionIdUsed,
				sessionFile: sessionPromptState.sessionFile,
				provider: preparedRuntime.provider,
				model: preparedRuntime.model.id,
				...runtime.outerContextTokenMeta,
				usageAccumulator: input.usageAccumulator,
				lastRunPromptUsage: input.lastRunPromptUsage,
				lastAssistant: attemptAssistant,
				lastTurnTotal: input.lastTurnTotal
			}),
			startedAtMs: runInput.startedAtMs,
			fallbackConfigured: runInput.fallbackConfigured,
			aborted,
			externalAbort,
			pluginHarnessOwnsTransport: runtime.pluginHarnessOwnsTransport,
			timedOutByRunBudget,
			resolveAuthProfileFailureReason: failoverRetryController.resolveAuthProfileFailureReason,
			maybeEscalateRateLimitProfileFallback: failoverRetryController.maybeEscalateRateLimitProfileFallback,
			advanceAttemptAuthProfile: preparedRuntime.advanceAttemptAuthProfile,
			maybeMarkAuthProfileFailure: failoverRetryController.maybeMarkAuthProfileFailure,
			maybeBackoffBeforeOverloadFailover: failoverRetryController.maybeBackoffBeforeOverloadFailover,
			attemptedThinking: preparedRuntime.attemptedThinking,
			thinkLevel: runtime.thinkLevel,
			getThinkLevel: () => preparedRuntime.snapshot().thinkLevel,
			traceAttempts: input.traceAttempts,
			previousRetryFailoverReason: input.lastRetryFailoverReason
		});
		if (promptFailureOutcome.action === "complete") return {
			action: "complete",
			result: promptFailureOutcome.result
		};
		preparedRuntime.setThinkLevel(promptFailureOutcome.thinkLevel);
		return retry({
			authRetryPending: promptFailureOutcome.authRetryPending,
			lastRetryFailoverReason: promptFailureOutcome.lastRetryFailoverReason,
			thinkLevel: promptFailureOutcome.thinkLevel
		});
	}
	return {
		action: "proceed",
		shouldSurfaceCodexCompletionTimeout
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/compaction-runtime.ts
function createEmbeddedRunCompactionRuntime(input) {
	const { runParams: params, contextEngine, hookRunner, hookContext, sessionPromptState } = input;
	const resolveActiveHookContext = () => ({
		...hookContext,
		sessionId: sessionPromptState.sessionId
	});
	const adoptCompactionTranscript = async (compactResult) => {
		const previousSessionId = sessionPromptState.sessionId;
		const nextSessionTarget = compactResult.result?.sessionTarget;
		const successor = resolveCompactionSuccessorTranscript(compactResult);
		await sessionPromptState.adoptSessionTarget(nextSessionTarget && successor.sessionId ? {
			...nextSessionTarget,
			sessionId: nextSessionTarget.sessionId ?? successor.sessionId
		} : nextSessionTarget);
		if (!nextSessionTarget && successor.sessionFile && successor.sessionFile !== sessionPromptState.sessionFile) sessionPromptState.sessionFile = successor.sessionFile;
		sessionPromptState.adoptSessionId(successor.sessionId);
		return successor.sessionId && successor.sessionId !== previousSessionId ? previousSessionId : void 0;
	};
	const onCompactionHookMessages = async (payload) => {
		const messages = payload.messages.filter((message) => message.trim().length > 0);
		if (messages.length === 0) return;
		await params.onAgentEvent?.({
			stream: "compaction",
			data: {
				phase: payload.phase === "before" ? "start" : "end",
				...payload.phase === "after" ? { completed: true } : {},
				messages
			},
			...params.sessionKey ? { sessionKey: params.sessionKey } : {}
		});
	};
	const runOwnsCompactionBeforeHook = async (reason) => {
		if (contextEngine.info.ownsCompaction !== true || !hookRunner?.hasHooks("before_compaction")) return;
		try {
			await hookRunner.runBeforeCompaction({
				messageCount: -1,
				sessionFile: sessionPromptState.sessionFile
			}, resolveActiveHookContext());
		} catch (error) {
			log$3.warn(`before_compaction hook failed during ${reason}: ${String(error)}`);
		}
	};
	const runOwnsCompactionAfterHook = async (reason, compactResult, previousSessionId) => {
		if (contextEngine.info.ownsCompaction !== true || !compactResult.ok || !compactResult.compacted || !hookRunner?.hasHooks("after_compaction")) return;
		try {
			await hookRunner.runAfterCompaction({
				messageCount: -1,
				compactedCount: -1,
				tokenCount: compactResult.result?.tokensAfter,
				sessionFile: resolveCompactionSuccessorTranscript(compactResult).sessionFile ?? sessionPromptState.sessionFile,
				...previousSessionId ? { previousSessionId } : {}
			}, resolveActiveHookContext());
		} catch (error) {
			log$3.warn(`after_compaction hook failed during ${reason}: ${String(error)}`);
		}
	};
	return {
		adoptCompactionTranscript,
		onCompactionHookMessages,
		runOwnsCompactionBeforeHook,
		runOwnsCompactionAfterHook
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/context-recovery-state.ts
function createEmbeddedRunContextRecoveryState() {
	return {
		autoCompactionCount: 0,
		lastCompactionTokensAfter: void 0,
		lastContextBudgetStatus: void 0,
		overflowCompactionAttempts: 0,
		timeoutCompactionAttempts: 0,
		toolResultTruncationAttempted: false
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-profile-failure-policy.ts
/**
* Returns the subset of failover reasons that should affect shared auth-profile
* health. Local helper failures and request-shape/transport outcomes stay
* session-local so one bad transcript or connection does not cool down an
* otherwise healthy provider profile.
*/
function resolveAuthProfileFailureReason(params) {
	if (params.policy === "local" || !params.failoverReason || params.policy === "local_transient" && (params.failoverReason === "overloaded" || params.failoverReason === "rate_limit" && params.transientRateLimit === true) || params.failoverReason === "server_error" || params.failoverReason === "empty_response" || params.failoverReason === "context_overflow" || params.failoverReason === "format") return null;
	if (params.failoverReason === "timeout" && params.providerStarted !== true) return null;
	return params.failoverReason;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/failover-retry-controller.ts
function createEmbeddedRunFailoverRetryController(input) {
	const { runParams: params, provider, modelId, globalLane, agentDir, fallbackConfigured, profileFailureStore } = input;
	const overloadFailoverBackoffMs = resolveOverloadFailoverBackoffMs();
	const overloadProfileRotationLimit = resolveOverloadProfileRotationLimit();
	const rateLimitProfileRotationLimit = resolveRateLimitProfileRotationLimit();
	let rateLimitProfileRotations = 0;
	let consecutiveSameModelRateLimitRetries = 0;
	const sleepForRetry = async (delayMs) => {
		try {
			await sleepWithAbort(delayMs, params.abortSignal);
		} catch (error) {
			if (!params.abortSignal?.aborted) throw error;
			const abortError = new Error("Operation aborted", { cause: error });
			abortError.name = "AbortError";
			throw abortError;
		}
	};
	return {
		overloadProfileRotationLimit,
		rateLimitProfileRotationLimit,
		get rateLimitProfileRotations() {
			return rateLimitProfileRotations;
		},
		get consecutiveSameModelRateLimitRetries() {
			return consecutiveSameModelRateLimitRetries;
		},
		resetSameModelRateLimitRetries: () => {
			consecutiveSameModelRateLimitRetries = resolveNextSameModelRateLimitRetryCount({
				retriesSoFar: consecutiveSameModelRateLimitRetries,
				retriedSameModelRateLimit: false
			});
		},
		maybeEscalateRateLimitProfileFallback: (paramsLocal) => {
			rateLimitProfileRotations += 1;
			if (rateLimitProfileRotations <= rateLimitProfileRotationLimit || !fallbackConfigured) return;
			const status = resolveFailoverStatus("rate_limit");
			log$3.warn(`rate-limit profile rotation cap reached for ${sanitizeForLog(provider)}/${sanitizeForLog(modelId)} after ${rateLimitProfileRotations} rotations; escalating to model fallback`);
			paramsLocal.logFallbackDecision("fallback_model", { status });
			throw new FailoverError("The AI service is temporarily rate-limited. Please try again in a moment.", {
				reason: "rate_limit",
				provider: paramsLocal.failoverProvider,
				model: paramsLocal.failoverModel,
				profileId: input.getLastProfileId(),
				sessionId: input.getSessionId(),
				lane: globalLane,
				status
			});
		},
		maybeMarkAuthProfileFailure: async (failure) => {
			if (params.authProfileStateMode === "read-only") return;
			const { profileId, reason } = failure;
			if (!profileId || !reason) return;
			if (input.harnessOwnsTransport() && reason === "timeout") return;
			await markAuthProfileFailure({
				store: profileFailureStore,
				profileId,
				reason,
				cfg: params.config,
				agentDir,
				runId: params.runId,
				modelId: failure.modelId
			});
		},
		resolveAuthProfileFailureReason: (failoverReason, opts) => {
			return resolveAuthProfileFailureReason({
				failoverReason,
				providerStarted: opts?.providerStarted,
				transientRateLimit: opts?.transientRateLimit,
				policy: params.authProfileFailurePolicy
			});
		},
		maybeBackoffBeforeOverloadFailover: async (reason) => {
			if (reason !== "overloaded" || overloadFailoverBackoffMs <= 0) return;
			log$3.warn(`overload backoff before failover for ${provider}/${modelId}: delayMs=${overloadFailoverBackoffMs}`);
			await sleepForRetry(overloadFailoverBackoffMs);
		},
		maybeRetrySameModelRateLimit: async (retry) => {
			if (consecutiveSameModelRateLimitRetries >= 3) return false;
			const delayMs = resolveSameModelRateLimitRetryDelayMs({
				retriesSoFar: consecutiveSameModelRateLimitRetries,
				retryAfterSeconds: retry?.retryAfterSeconds
			});
			log$3.warn(`rate-limit same-model retry ${consecutiveSameModelRateLimitRetries + 1}/3 for ${sanitizeForLog(provider)}/${sanitizeForLog(modelId)}: delayMs=${delayMs}`);
			await sleepForRetry(delayMs);
			consecutiveSameModelRateLimitRetries = resolveNextSameModelRateLimitRetryCount({
				retriesSoFar: consecutiveSameModelRateLimitRetries,
				retriedSameModelRateLimit: true
			});
			return true;
		}
	};
}
//#endregion
//#region src/agents/auth-profiles/failure-copy.ts
function describeReason(reason, provider, allInCooldown) {
	if (allInCooldown) switch (reason) {
		case "auth":
		case "session_expired": return `Couldn't sign in to ${provider}. Your saved login looks expired or no longer works.`;
		case "auth_permanent": return `${provider} isn't accepting your saved login anymore.`;
		case "billing": return `${provider} rejected the request — looks like a billing issue on the account.`;
		case "rate_limit": return `${provider} is asking us to slow down. Please wait a moment before trying again.`;
		case "overloaded": return `${provider} is overloaded right now. Please wait a moment before trying again.`;
		case "timeout": return `${provider} hasn't been responding. Please wait a moment before trying again.`;
		case "model_not_found": return `${provider} can't find the model you're using right now.`;
		case "server_error": return `${provider} is having issues right now. Please wait a moment before trying again.`;
		default: return `Couldn't reach ${provider} with any of your saved logins right now.`;
	}
	switch (reason) {
		case "auth":
		case "session_expired": return `Couldn't sign in to ${provider}. Your saved login looks expired or no longer works.`;
		case "auth_permanent": return `${provider} isn't accepting your saved login.`;
		case "billing": return `${provider} rejected the request — looks like a billing issue on the account.`;
		default: return null;
	}
}
function shouldIncludeRecoveryHint(reason) {
	switch (reason) {
		case "auth":
		case "auth_permanent":
		case "session_expired":
		case "billing": return true;
		case "rate_limit":
		case "overloaded":
		case "timeout":
		case "server_error":
		case "model_not_found":
		case "format": return false;
		default: return true;
	}
}
function diagnosticSuffix(cause, primary) {
	if (cause === void 0 || cause === null) return null;
	const text = formatErrorMessage(cause).trim();
	if (!text || primary.includes(text)) return null;
	return ` (${text})`;
}
/**
* Single source of truth for user-facing copy when an auth-profile rotation
* fails. Composes a reason-specific sentence with an actionable next-step
* derived from the provider's plugin manifest (`buildProviderAuthRecoveryHint`).
*
* Falls back to the underlying error's text when the reason maps to nothing
* actionable, so we never produce worse copy than the raw error.
*/
function formatAuthProfileFailureMessage(params) {
	const description = describeReason(params.reason, params.provider, params.allInCooldown);
	if (!description) {
		const causeText = params.cause ? formatErrorMessage(params.cause).trim() : "";
		if (causeText) return causeText;
		return `Couldn't reach ${params.provider} with any of your saved logins right now.`;
	}
	const hint = shouldIncludeRecoveryHint(params.reason) ? buildProviderAuthRecoveryHint({
		provider: params.provider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	}) : null;
	const suffix = diagnosticSuffix(params.cause, description);
	const parts = [description];
	if (hint) parts.push(hint);
	const message = parts.join(" ");
	return suffix ? `${message}${suffix}` : message;
}
//#endregion
//#region src/agents/runtime-auth-refresh.ts
/**
* Runtime auth refresh timer helper.
*
* Clamps refresh deadlines before they are passed to setTimeout.
*/
/** Clamp an auth refresh deadline to a safe setTimeout delay. */
function clampRuntimeAuthRefreshDelayMs(params) {
	return resolveSafeTimeoutDelayMs(params.refreshAt - params.now, { minMs: params.minDelayMs });
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-controller.ts
/** Decides whether one automatic profile may bypass its current cooldown. */
function resolveEmbeddedAuthCooldownProbePolicy(params) {
	const autoProfileCandidates = params.profileCandidates.filter((candidate) => typeof candidate === "string" && candidate.length > 0 && candidate !== params.lockedProfileId);
	const allAutoProfilesInCooldown = autoProfileCandidates.length > 0 && autoProfileCandidates.every((candidate) => isProfileInCooldown(params.authStore, candidate, void 0, params.modelId));
	const unavailableReason = allAutoProfilesInCooldown ? resolveProfilesUnavailableReason({
		store: params.authStore,
		profileIds: autoProfileCandidates
	}) ?? "unknown" : null;
	return {
		allowProbe: params.allowTransientCooldownProbe && allAutoProfilesInCooldown && shouldUseTransientCooldownProbeSlot(unavailableReason),
		unavailableReason
	};
}
/**
* Coordinates auth profile selection, runtime auth preparation/refresh, and
* profile failover for one embedded run. State is injected through accessors so
* the runner can keep provider/model/auth snapshots in sync across retries.
*/
function createEmbeddedRunAuthController(params) {
	const baseRuntimeModel = params.getRuntimeModel();
	const baseEffectiveModel = params.getEffectiveModel();
	const commitPreparedModel = (preparedModel) => {
		preparedModel?.commit();
		if (preparedModel?.authRequirement) return;
		params.setRuntimeModel(baseRuntimeModel);
		params.setEffectiveModel(baseEffectiveModel);
	};
	const applyPreparedRuntimeRequestOverrides = (paramsForApply) => {
		const runtimeModel = applyPreparedRuntimeAuthToModel(paramsForApply.runtimeModel, paramsForApply.preparedAuth);
		if (runtimeModel === paramsForApply.runtimeModel) return;
		params.setRuntimeModel(runtimeModel);
		params.setEffectiveModel(applyPreparedRuntimeAuthToModel(params.getEffectiveModel(), paramsForApply.preparedAuth));
	};
	const hasRefreshableRuntimeAuth = () => Boolean(params.getRuntimeAuthState()?.sourceApiKey.trim());
	const nextRuntimeAuthGeneration = () => (params.getRuntimeAuthState()?.generation ?? 0) + 1;
	const prepareRuntimeAuthForModel = async (prepareParams) => {
		const preparedAuth = await prepareProviderRuntimeAuth({
			provider: prepareParams.runtimeModel.provider,
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: process.env,
			context: {
				config: params.config,
				agentDir: params.agentDir,
				workspaceDir: params.workspaceDir,
				env: process.env,
				provider: prepareParams.runtimeModel.provider,
				modelId: params.getModelId(),
				model: prepareParams.runtimeModel,
				apiKey: unwrapSecretSentinelsForProviderEgress(prepareParams.apiKey, "provider runtime auth exchange"),
				authMode: prepareParams.authMode,
				profileId: prepareParams.profileId
			}
		});
		return protectPreparedProviderRuntimeAuth({
			provider: prepareParams.runtimeModel.provider,
			preparedAuth
		});
	};
	const clearRuntimeAuthRefreshTimer = () => {
		const runtimeAuthState = params.getRuntimeAuthState();
		if (!runtimeAuthState?.refreshTimer) return;
		clearTimeout(runtimeAuthState.refreshTimer);
		runtimeAuthState.refreshTimer = void 0;
	};
	const stopRuntimeAuthRefreshTimer = () => {
		if (!params.getRuntimeAuthState()) return;
		params.setRuntimeAuthRefreshCancelled(true);
		clearRuntimeAuthRefreshTimer();
	};
	const refreshRuntimeAuth = async (reason) => {
		const runtimeAuthState = params.getRuntimeAuthState();
		if (!runtimeAuthState) return;
		if (runtimeAuthState.refreshInFlight) {
			await runtimeAuthState.refreshInFlight;
			return;
		}
		const refreshGeneration = runtimeAuthState.generation;
		const refreshProfileId = runtimeAuthState.profileId;
		const refreshPromise = (async () => {
			const currentRuntimeAuthState = params.getRuntimeAuthState();
			const sourceApiKey = currentRuntimeAuthState?.sourceApiKey.trim() ?? "";
			if (!sourceApiKey) throw new Error(`Runtime auth refresh requires a source credential.`);
			const runtimeModel = params.getRuntimeModel();
			params.log.debug(`Refreshing runtime auth for ${runtimeModel.provider} (${reason})...`);
			const preparedAuth = await prepareRuntimeAuthForModel({
				runtimeModel,
				apiKey: sourceApiKey,
				authMode: currentRuntimeAuthState?.authMode ?? "unknown",
				profileId: currentRuntimeAuthState?.profileId
			});
			if (!preparedAuth?.apiKey) throw new Error(`Provider "${runtimeModel.provider}" does not support runtime auth refresh.`);
			const activeRuntimeAuthState = params.getRuntimeAuthState();
			if (!activeRuntimeAuthState || activeRuntimeAuthState.generation !== refreshGeneration || activeRuntimeAuthState.profileId !== refreshProfileId || activeRuntimeAuthState.sourceApiKey.trim() !== sourceApiKey) {
				params.log.debug(`Ignoring stale runtime auth refresh for ${runtimeModel.provider}; auth state advanced before ${reason} refresh completed.`);
				return;
			}
			params.authStorage.setRuntimeApiKey(runtimeModel.provider, preparedAuth.apiKey);
			applyPreparedRuntimeRequestOverrides({
				runtimeModel,
				preparedAuth
			});
			params.setRuntimeAuthState({
				...activeRuntimeAuthState,
				expiresAt: preparedAuth.expiresAt
			});
			if (preparedAuth.expiresAt) {
				const remaining = preparedAuth.expiresAt - Date.now();
				params.log.debug(`Runtime auth refreshed for ${runtimeModel.provider}; expires in ${Math.max(0, Math.floor(remaining / 1e3))}s.`);
			}
		})().catch((err) => {
			const runtimeModel = params.getRuntimeModel();
			params.log.warn(`Runtime auth refresh failed for ${runtimeModel.provider}: ${formatErrorMessage(err)}`);
			throw err;
		}).finally(() => {
			const activeState = params.getRuntimeAuthState();
			if (activeState && activeState.generation === refreshGeneration && activeState.refreshInFlight === refreshPromise) activeState.refreshInFlight = void 0;
		});
		runtimeAuthState.refreshInFlight = refreshPromise;
		await refreshPromise;
	};
	const scheduleRuntimeAuthRefresh = () => {
		const runtimeAuthState = params.getRuntimeAuthState();
		if (!runtimeAuthState || params.getRuntimeAuthRefreshCancelled()) return;
		const runtimeModel = params.getRuntimeModel();
		if (!hasRefreshableRuntimeAuth()) {
			params.log.warn(`Skipping runtime auth refresh scheduling for ${runtimeModel.provider}; source credential missing.`);
			return;
		}
		if (!runtimeAuthState.expiresAt) return;
		clearRuntimeAuthRefreshTimer();
		const now = Date.now();
		const delayMs = clampRuntimeAuthRefreshDelayMs({
			refreshAt: runtimeAuthState.expiresAt - RUNTIME_AUTH_REFRESH_MARGIN_MS,
			now,
			minDelayMs: RUNTIME_AUTH_REFRESH_MIN_DELAY_MS
		});
		const timer = setTimeout(() => {
			if (params.getRuntimeAuthRefreshCancelled()) return;
			refreshRuntimeAuth("scheduled").then(() => scheduleRuntimeAuthRefresh()).catch(() => {
				if (params.getRuntimeAuthRefreshCancelled()) return;
				const retryTimer = setTimeout(() => {
					if (params.getRuntimeAuthRefreshCancelled()) return;
					refreshRuntimeAuth("scheduled-retry").then(() => scheduleRuntimeAuthRefresh()).catch(() => void 0);
				}, RUNTIME_AUTH_REFRESH_RETRY_MS);
				const activeRuntimeAuthState = params.getRuntimeAuthState();
				if (activeRuntimeAuthState) activeRuntimeAuthState.refreshTimer = retryTimer;
				if (params.getRuntimeAuthRefreshCancelled() && activeRuntimeAuthState) {
					clearTimeout(retryTimer);
					activeRuntimeAuthState.refreshTimer = void 0;
				}
			});
		}, delayMs);
		runtimeAuthState.refreshTimer = timer;
		if (params.getRuntimeAuthRefreshCancelled()) {
			clearTimeout(timer);
			runtimeAuthState.refreshTimer = void 0;
		}
	};
	const resolveAuthProfileFailoverReason = (failoverParams) => {
		if (failoverParams.allInCooldown) {
			const profileIds = (failoverParams.profileIds ?? params.profileCandidates).filter((id) => typeof id === "string" && id.length > 0);
			return resolveProfilesUnavailableReason({
				store: params.authStore,
				profileIds
			}) ?? "unknown";
		}
		return classifyFailoverReason(failoverParams.message, { provider: params.getProvider() }) ?? "auth";
	};
	const throwAuthProfileFailover = (failoverParams) => {
		const provider = params.getProvider();
		const modelId = params.getModelId();
		const messageForReason = failoverParams.message?.trim() || (failoverParams.error ? formatErrorMessage(failoverParams.error).trim() : "");
		const reason = resolveAuthProfileFailoverReason({
			allInCooldown: failoverParams.allInCooldown,
			message: messageForReason,
			profileIds: params.profileCandidates
		});
		const message = failoverParams.message?.trim() || formatAuthProfileFailureMessage({
			reason,
			provider,
			allInCooldown: failoverParams.allInCooldown,
			cause: failoverParams.error,
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: process.env
		});
		if (params.fallbackConfigured) throw new FailoverError(message, {
			reason,
			provider,
			model: modelId,
			authMode: reason === "billing" ? resolveSubscriptionAuthModeForProfiles({
				store: params.authStore,
				profileIds: failoverParams.allInCooldown ? params.profileCandidates : [params.profileCandidates[params.getProfileIndex()]]
			}) : void 0,
			status: resolveFailoverStatus(reason),
			authProfileFailure: { allInCooldown: failoverParams.allInCooldown },
			cause: failoverParams.error
		});
		if (failoverParams.error instanceof Error) throw failoverParams.error;
		throw new Error(message);
	};
	const resolveApiKeyForCandidate = async (candidate, model = params.getRuntimeModel(), allowAuthProfileFallback) => {
		return getApiKeyForModel({
			model,
			cfg: params.config,
			profileId: candidate,
			store: params.authStore,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			lockedProfile: candidate != null && candidate === params.lockedProfileId,
			allowAuthProfileFallback,
			secretSentinels: true
		});
	};
	const applyApiKeyInfo = async (candidate, attemptIndex) => {
		const preparedModel = await params.prepareModelForAuthProfile?.(candidate, attemptIndex);
		const apiKeyInfo = await resolveApiKeyForCandidate(candidate, preparedModel?.runtimeModel, preparedModel?.allowAuthProfileFallback);
		if (preparedModel?.authRequirement && !providerModelRouteAcceptsAuthMode({
			requirement: preparedModel.authRequirement,
			mode: apiKeyInfo.mode ?? (apiKeyInfo.apiKey ? "api-key" : void 0)
		})) throw new Error(`Resolved ${apiKeyInfo.mode ?? "unknown"} credentials are incompatible with the selected ${preparedModel.authRequirement} route for ${preparedModel.runtimeModel.provider}.`);
		params.setApiKeyInfo(apiKeyInfo);
		const resolvedProfileId = apiKeyInfo.profileId ?? candidate;
		if (!apiKeyInfo.apiKey) {
			if (apiKeyInfo.mode !== "aws-sdk") throw new MissingProviderAuthError((preparedModel?.runtimeModel ?? params.getRuntimeModel()).provider, apiKeyInfo);
			commitPreparedModel(preparedModel);
			const runtimeModel = params.getRuntimeModel();
			const AWS_SDK_AUTH_SENTINEL = "__aws_sdk_auth__";
			try {
				const preparedAuth = await prepareRuntimeAuthForModel({
					runtimeModel,
					apiKey: AWS_SDK_AUTH_SENTINEL,
					authMode: apiKeyInfo.mode,
					profileId: apiKeyInfo.profileId
				});
				applyPreparedRuntimeRequestOverrides({
					runtimeModel,
					preparedAuth: preparedAuth ?? {}
				});
				if (preparedAuth?.apiKey) {
					clearRuntimeAuthRefreshTimer();
					params.authStorage.setRuntimeApiKey(runtimeModel.provider, preparedAuth.apiKey);
					params.setRuntimeAuthState({
						generation: nextRuntimeAuthGeneration(),
						sourceApiKey: AWS_SDK_AUTH_SENTINEL,
						authMode: apiKeyInfo.mode,
						profileId: resolvedProfileId,
						expiresAt: preparedAuth.expiresAt
					});
					if (preparedAuth.expiresAt) scheduleRuntimeAuthRefresh();
					params.setLastProfileId(resolvedProfileId);
					return;
				}
			} catch (error) {
				params.log.warn(`prepareProviderRuntimeAuth failed for ${runtimeModel.provider}, falling back to sentinel: ${formatErrorMessage(error)}`);
			}
			clearRuntimeAuthRefreshTimer();
			params.authStorage.setRuntimeApiKey(runtimeModel.provider, AWS_SDK_AUTH_SENTINEL);
			params.setRuntimeAuthState(null);
			params.setLastProfileId(resolvedProfileId);
			return;
		}
		commitPreparedModel(preparedModel);
		let runtimeAuthHandled = false;
		const runtimeModel = params.getRuntimeModel();
		const preparedAuth = await prepareRuntimeAuthForModel({
			runtimeModel,
			apiKey: apiKeyInfo.apiKey,
			authMode: apiKeyInfo.mode,
			profileId: apiKeyInfo.profileId
		});
		applyPreparedRuntimeRequestOverrides({
			runtimeModel,
			preparedAuth: preparedAuth ?? {}
		});
		if (preparedAuth?.apiKey) {
			clearRuntimeAuthRefreshTimer();
			params.authStorage.setRuntimeApiKey(runtimeModel.provider, preparedAuth.apiKey);
			params.setRuntimeAuthState({
				generation: nextRuntimeAuthGeneration(),
				sourceApiKey: apiKeyInfo.apiKey,
				authMode: apiKeyInfo.mode,
				profileId: apiKeyInfo.profileId,
				expiresAt: preparedAuth.expiresAt
			});
			if (preparedAuth.expiresAt) scheduleRuntimeAuthRefresh();
			runtimeAuthHandled = true;
		}
		if (!runtimeAuthHandled) {
			clearRuntimeAuthRefreshTimer();
			params.authStorage.setRuntimeApiKey(runtimeModel.provider, apiKeyInfo.apiKey);
			params.setRuntimeAuthState(null);
		}
		params.setLastProfileId(apiKeyInfo.profileId);
	};
	const advanceAuthProfile = async () => {
		if (params.lockedProfileId) return false;
		let nextIndex = params.getProfileIndex() + 1;
		while (nextIndex < params.profileCandidates.length) {
			const candidate = params.profileCandidates[nextIndex];
			if (candidate && isProfileInCooldown(params.authStore, candidate, void 0, params.getModelId())) {
				nextIndex += 1;
				continue;
			}
			try {
				await applyApiKeyInfo(candidate, nextIndex);
				params.setProfileIndex(nextIndex);
				params.setThinkLevel(params.initialThinkLevel);
				params.attemptedThinking.clear();
				return true;
			} catch (err) {
				if (err instanceof SecretSurfaceUnavailableError) throw err;
				if (candidate && candidate === params.lockedProfileId) throw err;
				nextIndex += 1;
			}
		}
		return false;
	};
	const initializeAuthProfile = async () => {
		try {
			const modelId = params.getModelId();
			const cooldownProbePolicy = resolveEmbeddedAuthCooldownProbePolicy({
				authStore: params.authStore,
				profileCandidates: params.profileCandidates,
				lockedProfileId: params.lockedProfileId,
				modelId,
				allowTransientCooldownProbe: params.allowTransientCooldownProbe
			});
			let didTransientCooldownProbe = false;
			while (params.getProfileIndex() < params.profileCandidates.length) {
				const candidate = params.profileCandidates[params.getProfileIndex()];
				if (candidate && candidate !== params.lockedProfileId && isProfileInCooldown(params.authStore, candidate, void 0, modelId)) if (cooldownProbePolicy.allowProbe && !didTransientCooldownProbe) {
					didTransientCooldownProbe = true;
					params.log.warn(`probing cooldowned auth profile for ${params.getProvider()}/${modelId} due to ${cooldownProbePolicy.unavailableReason ?? "transient"} unavailability`);
				} else {
					params.setProfileIndex(params.getProfileIndex() + 1);
					continue;
				}
				await applyApiKeyInfo(params.profileCandidates[params.getProfileIndex()], params.getProfileIndex());
				break;
			}
			if (params.getProfileIndex() >= params.profileCandidates.length) throwAuthProfileFailover({ allInCooldown: true });
		} catch (err) {
			if (err instanceof FailoverError || err instanceof SecretSurfaceUnavailableError) throw err;
			if (params.profileCandidates[params.getProfileIndex()] === params.lockedProfileId) throwAuthProfileFailover({
				allInCooldown: false,
				error: err
			});
			if (!await advanceAuthProfile()) throwAuthProfileFailover({
				allInCooldown: false,
				error: err
			});
		}
	};
	const maybeRefreshRuntimeAuthForAuthError = async (errorText, retried) => {
		if (!params.getRuntimeAuthState() || retried) return false;
		if (!isFailoverErrorMessage(errorText, { provider: params.getProvider() })) return false;
		if (classifyFailoverReason(errorText, { provider: params.getProvider() }) !== "auth") return false;
		try {
			await refreshRuntimeAuth("auth-error");
			scheduleRuntimeAuthRefresh();
			return true;
		} catch {
			return false;
		}
	};
	return {
		applyAuthProfileCandidate: applyApiKeyInfo,
		advanceAuthProfile,
		initializeAuthProfile,
		maybeRefreshRuntimeAuthForAuthError,
		stopRuntimeAuthRefreshTimer
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-plan.ts
async function prepareEmbeddedRunAuthPlan(params) {
	const runParams = params.runParams;
	const usesOpenAIAuthRouting = params.provider === OPENAI_PROVIDER_ID;
	const initialPluginHarnessOwnsTransport = params.getAgentHarness().id !== "openclaw";
	const openClawNativeCodexResponsesNeedsAuthBootstrap = !initialPluginHarnessOwnsTransport && usesOpenAIAuthRouting && params.getEffectiveModel().api === "openai-chatgpt-responses";
	let externalCliAuthScope = initialPluginHarnessOwnsTransport ? { ignoreAutoPreferredProfile: false } : openClawNativeCodexResponsesNeedsAuthBootstrap ? {
		providerIds: [OPENAI_PROVIDER_ID],
		ignoreAutoPreferredProfile: false
	} : resolveExternalCliAuthOverlayScopeFromSelection({
		provider: params.provider,
		cfg: runParams.config,
		agentId: runParams.agentId,
		modelId: params.modelId,
		workspaceDir: params.workspaceDir,
		userLockedAuthProfileId: runParams.authProfileIdSource === "user" ? runParams.authProfileId : void 0
	});
	let noExternalAuthStore;
	if (!initialPluginHarnessOwnsTransport && !externalCliAuthScope.providerIds) {
		noExternalAuthStore = ensureAuthProfileStoreWithoutExternalProfiles(params.agentDir, { allowKeychainPrompt: false });
		externalCliAuthScope = resolveExternalCliAuthOverlayScopeFromSelection({
			provider: params.provider,
			cfg: runParams.config,
			agentId: runParams.agentId,
			modelId: params.modelId,
			workspaceDir: params.workspaceDir,
			store: noExternalAuthStore,
			userLockedAuthProfileId: runParams.authProfileIdSource === "user" ? runParams.authProfileId : void 0
		});
	}
	params.markStage?.("scope");
	const attemptAuthProfileStore = usesOpenAIAuthRouting ? ensureAuthProfileStore(params.agentDir, {
		externalCliProviderIds: [OPENAI_PROVIDER_ID],
		allowKeychainPrompt: false
	}) : initialPluginHarnessOwnsTransport ? ensureAuthProfileStoreWithoutExternalProfiles(params.agentDir, { allowKeychainPrompt: false }) : externalCliAuthScope.providerIds ? ensureAuthProfileStore(params.agentDir, {
		externalCliProviderIds: externalCliAuthScope.providerIds,
		allowKeychainPrompt: false
	}) : noExternalAuthStore ?? ensureAuthProfileStoreWithoutExternalProfiles(params.agentDir, { allowKeychainPrompt: false });
	params.markStage?.("store");
	const requestedProfileId = runParams.authProfileId?.trim() || void 0;
	const lockedProfileId = runParams.authProfileIdSource === "user" ? requestedProfileId : void 0;
	const preferredProfileId = externalCliAuthScope.ignoreAutoPreferredProfile && !lockedProfileId ? void 0 : requestedProfileId;
	const createAuthPreparation = () => {
		const harness = params.getAgentHarness();
		return prepareAgentRuntimeAuth({
			provider: params.provider,
			modelId: params.modelId,
			modelApi: params.model.api,
			modelBaseUrl: params.model.baseUrl,
			requestTransportOverrides: params.requestStreamTransportOverrides,
			config: runParams.config,
			env: process.env,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			authProfileStore: attemptAuthProfileStore,
			sessionAuthProfileId: preferredProfileId,
			sessionAuthProfileSource: runParams.authProfileIdSource,
			harnessId: harness.id,
			harnessRuntime: harness.id,
			harnessAuthBootstrap: harness.authBootstrap,
			allowHarnessAuthProfileForwarding: true,
			allowTransientCooldownProbe: runParams.allowTransientCooldownProbe === true,
			resolveProviderPreferredProfileId: (context) => resolveProviderAuthProfileId({
				provider: params.provider,
				config: runParams.config,
				workspaceDir: params.workspaceDir,
				env: process.env,
				context
			})
		});
	};
	const providerUsesProfileScopedModelMetadata = providerUsesCredentialScopedModelMetadata({
		provider: params.provider,
		modelId: params.modelId,
		config: runParams.config,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	});
	const { materialize: materializeAuthPlan, materializeUncached: materializeAuthPlanUncached } = createPreparedRuntimeModelMaterializer({
		provider: params.provider,
		modelId: params.modelId,
		config: runParams.config,
		getModel: params.getRuntimeModel,
		nativeModelOwned: params.nativeModelOwned,
		requestedProfileId: runParams.authProfileId,
		providerUsesProfileScopedModelMetadata,
		resolveModel: ({ config, authProfileId, authProfileMode }) => resolveModelAsync(params.provider, params.modelId, params.agentDir, config, {
			authStorage: params.authStorage,
			modelRegistry: params.modelRegistry,
			skipAgentDiscovery: true,
			allowBundledStaticCatalogFallback: true,
			preferBundledStaticCatalogTransport: true,
			workspaceDir: params.workspaceDir,
			authProfileId,
			authProfileMode
		})
	});
	let resolvedAuthPreparation = createAuthPreparation();
	let preparedAuthAttempts = resolvedAuthPreparation.attempts;
	let activePreparedAuthPlan = resolvedAuthPreparation.plan;
	params.applyResolvedRuntimeModel(await materializeAuthPlan(activePreparedAuthPlan));
	params.markStage?.("prepare-plan");
	const finalizedHarness = params.selectHarnessForPreparedAttempts(params.getEffectiveModel(), preparedAuthAttempts);
	if (finalizedHarness.id !== params.getAgentHarness().id) {
		params.setAgentHarness(finalizedHarness);
		resolvedAuthPreparation = createAuthPreparation();
		preparedAuthAttempts = resolvedAuthPreparation.attempts;
		activePreparedAuthPlan = resolvedAuthPreparation.plan;
		params.applyResolvedRuntimeModel(await materializeAuthPlan(activePreparedAuthPlan));
		if (params.selectHarnessForPreparedAttempts(params.getEffectiveModel(), preparedAuthAttempts).id !== params.getAgentHarness().id) throw new Error(`Prepared auth route did not converge on one agent harness for ${params.provider}/${params.modelId}.`);
	}
	params.markStage?.("harness");
	return {
		usesOpenAIAuthRouting,
		attemptAuthProfileStore,
		lockedProfileId,
		preferredProfileId,
		providerUsesProfileScopedModelMetadata,
		materializeAuthPlan,
		materializeAuthPlanUncached,
		preparedAuthAttempts,
		activePreparedAuthPlan
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/model-harness.ts
function resolveEmbeddedRunEffectiveModel(params) {
	return resolveEmbeddedRuntimeModelPolicy({
		cfg: params.runParams.config,
		provider: params.provider,
		contextConfigProvider: resolveContextConfigProviderForRuntime({
			provider: params.modelConfigProvider,
			runtimeId: params.agentHarnessId,
			config: params.runParams.config
		}),
		modelId: params.modelId,
		runtimeModel: params.runtimeModel,
		nativeModelOwned: params.nativeModelOwned
	});
}
function buildHarnessModelProvider(params) {
	const route = params.plan?.modelRoute;
	const routeSupport = resolveAgentHarnessPreparedRouteSupport(params.plan);
	const requestTransportOverrides = params.requestStreamTransportOverrides ?? routeSupport.requestTransportOverrides;
	return {
		api: route?.api ?? params.model.api,
		baseUrl: route?.baseUrl ?? params.model.baseUrl,
		...requestTransportOverrides ? { requestTransportOverrides } : {},
		...routeSupport.runtimePolicy ? { runtimePolicy: routeSupport.runtimePolicy } : {},
		...params.plan ? { preparedAuth: resolveAgentHarnessPreparedAuthSupport({
			plan: params.plan,
			...params.preparedAuthAttempt?.kind === "profile" || params.preparedAuthAttempt?.kind === "direct" ? { source: params.preparedAuthAttempt.kind } : {}
		}) } : {}
	};
}
function assertPinnedHarness(nativeModelOwnedHarnessId, selected, subject) {
	if (nativeModelOwnedHarnessId && selected.id !== nativeModelOwnedHarnessId) throw new Error(`${subject} changed the session-pinned agent harness from "${nativeModelOwnedHarnessId}" to "${selected.id}".`);
}
function selectEmbeddedRunHarness(params) {
	const selected = selectAgentHarness({
		provider: params.provider,
		modelId: params.modelId,
		modelProvider: buildHarnessModelProvider(params),
		config: params.runParams.config,
		agentId: params.runParams.agentId,
		sessionKey: params.runParams.sessionKey,
		agentHarnessId: params.runParams.agentHarnessId,
		agentHarnessRuntimeOverride: params.runParams.agentHarnessRuntimeOverride
	});
	assertPinnedHarness(params.nativeModelOwnedHarnessId, selected, "Prepared model route");
	return selected;
}
function selectEmbeddedRunHarnessForPreparedAttempts(params) {
	const selected = selectAgentHarnessForPreparedModelProviders({
		provider: params.provider,
		modelId: params.modelId,
		modelProviders: params.attempts.map((attempt) => {
			const route = attempt.plan.modelRoute;
			const model = route ? {
				...params.model,
				api: route.api,
				baseUrl: route.baseUrl
			} : params.model;
			return buildHarnessModelProvider({
				...params,
				model,
				plan: attempt.plan,
				preparedAuthAttempt: attempt
			});
		}),
		config: params.runParams.config,
		agentId: params.runParams.agentId,
		sessionKey: params.runParams.sessionKey,
		agentHarnessId: params.runParams.agentHarnessId,
		agentHarnessRuntimeOverride: params.runParams.agentHarnessRuntimeOverride
	});
	assertPinnedHarness(params.nativeModelOwnedHarnessId, selected, "Prepared auth routes");
	return selected;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/model-setup.ts
async function resolveEmbeddedRunModelSetup(params) {
	const runParams = params.runParams;
	const hookSelection = await resolveHookModelSelection({
		prompt: runParams.prompt,
		attachments: buildBeforeModelResolveAttachments(runParams.images),
		provider: params.provider,
		modelId: params.modelId,
		modelSelectionLocked: runParams.modelSelectionLocked,
		hookRunner: params.hookRunner,
		hookContext: params.hookContext
	});
	const modelSelectionChangedByHook = hookSelection.provider !== params.provider || hookSelection.modelId !== params.modelId;
	let provider = hookSelection.provider;
	const modelId = hookSelection.modelId;
	const requestedModelId = modelId;
	const requestStreamTransportOverrides = resolveRequestStreamTransportOverrides(runParams.streamParams);
	params.onHooksResolved();
	await ensureSelectedAgentHarnessPlugin({
		provider,
		modelId,
		config: runParams.config,
		agentId: runParams.agentId,
		sessionKey: runParams.sessionKey,
		agentHarnessId: runParams.agentHarnessId,
		agentHarnessRuntimeOverride: runParams.agentHarnessRuntimeOverride,
		requestTransportOverrides: requestStreamTransportOverrides,
		workspaceDir: params.workspaceDir
	});
	const agentHarness = selectAgentHarness({
		provider,
		modelId,
		...requestStreamTransportOverrides ? { modelProvider: { requestTransportOverrides: requestStreamTransportOverrides } } : {},
		config: runParams.config,
		agentId: runParams.agentId,
		sessionKey: runParams.sessionKey,
		agentHarnessId: runParams.agentHarnessId,
		agentHarnessRuntimeOverride: runParams.agentHarnessRuntimeOverride
	});
	const pluginHarnessOwnsTransport = agentHarness.id !== "openclaw";
	const expectedHarnessArtifact = runParams.expectedAgentHarnessRuntimeArtifact;
	if (expectedHarnessArtifact && expectedHarnessArtifact.harnessId !== agentHarness.id) throw new Error(`Verified inference requires agent harness ${expectedHarnessArtifact.harnessId}, but ${agentHarness.id} was selected.`);
	if (expectedHarnessArtifact && !agentHarness.runtimeArtifact) throw new Error(`Agent harness ${agentHarness.id} cannot attest the verified inference runtime artifact.`);
	const nativeModelOwnedHarnessId = resolveNativeModelOwnedHarnessId({
		agentHarnessId: runParams.agentHarnessId,
		modelSelectionLocked: runParams.modelSelectionLocked,
		selectedHarnessId: agentHarness.id
	});
	const nativeModelOwned = nativeModelOwnedHarnessId !== void 0;
	const modelConfigProvider = provider;
	let resolvedModelProvider = provider;
	let firstModelResolution;
	let modelResolution;
	if (nativeModelOwned) modelResolution = {
		model: createNativeModelOwnedRuntimeModel({
			provider,
			modelId
		}),
		...createEmptyAgentDiscoveryStores()
	};
	else {
		const selectedRuntimeProvider = resolveSelectedOpenAIRuntimeProvider({
			provider,
			harnessRuntime: agentHarness.id,
			agentHarnessId: agentHarness.id,
			authProfileProvider: runParams.authProfileId?.split(":", 1)[0],
			authProfileId: runParams.authProfileId,
			config: runParams.config,
			workspaceDir: params.workspaceDir
		});
		const modelResolutionProviders = selectedRuntimeProvider !== provider ? [selectedRuntimeProvider, provider] : [provider];
		for (const candidateProvider of modelResolutionProviders) {
			const candidateResolution = await resolveModelAsync(candidateProvider, modelId, params.agentDir, runParams.config, {
				skipAgentDiscovery: true,
				allowBundledStaticCatalogFallback: pluginHarnessOwnsTransport,
				preferBundledStaticCatalogTransport: pluginHarnessOwnsTransport,
				workspaceDir: params.workspaceDir,
				authProfileId: runParams.authProfileId
			});
			firstModelResolution ??= candidateResolution;
			if (candidateResolution.model) {
				resolvedModelProvider = candidateProvider;
				modelResolution = candidateResolution;
				break;
			}
		}
		if (!modelResolution && pluginHarnessOwnsTransport) modelResolution = firstModelResolution;
		if (!modelResolution) {
			const config = runParams.config ?? {};
			const preparedStores = (params.preparedModelRuntime ?? await prepareModelRuntimeSnapshot({
				config,
				agentDir: params.agentDir,
				inheritedAuthDir: resolveDefaultAgentDir(config),
				workspaceDir: params.workspaceDir
			})).createStores();
			for (const candidateProvider of modelResolutionProviders) {
				const candidateResolution = await resolveModelAsync(candidateProvider, modelId, params.agentDir, runParams.config, {
					authStorage: preparedStores.authStorage,
					modelRegistry: preparedStores.modelRegistry,
					workspaceDir: params.workspaceDir,
					authProfileId: runParams.authProfileId,
					allowBundledStaticCatalogFallback: true
				});
				firstModelResolution ??= candidateResolution;
				if (candidateResolution.model) {
					resolvedModelProvider = candidateProvider;
					modelResolution = candidateResolution;
					break;
				}
			}
		}
		modelResolution ??= firstModelResolution;
	}
	if (!modelResolution) throw new FailoverError(`Unknown model: ${provider}/${modelId}`, {
		reason: "model_not_found",
		provider,
		model: modelId,
		sessionId: runParams.sessionId,
		lane: params.globalLane
	});
	provider = resolvedModelProvider;
	const { model, error, authStorage, modelRegistry } = modelResolution;
	if (!model) throw new FailoverError(error ?? `Unknown model: ${provider}/${modelId}`, {
		reason: "model_not_found",
		provider,
		model: modelId,
		sessionId: runParams.sessionId,
		lane: params.globalLane
	});
	return {
		provider,
		modelId,
		requestedModelId,
		modelSelectionChangedByHook,
		requestStreamTransportOverrides,
		expectedHarnessArtifact,
		agentHarness,
		pluginHarnessOwnsTransport,
		nativeModelOwnedHarnessId,
		nativeModelOwned,
		modelConfigProvider,
		model,
		authStorage,
		modelRegistry
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/runtime-preparation.ts
async function prepareEmbeddedRunRuntime(input) {
	const params = input.runParams;
	let provider = input.provider;
	let modelId = input.modelId;
	const modelSetup = await resolveEmbeddedRunModelSetup({
		runParams: params,
		provider,
		modelId,
		agentDir: input.agentDir,
		workspaceDir: input.workspaceDir,
		globalLane: input.globalLane,
		hookRunner: input.hookRunner,
		hookContext: input.hookContext,
		onHooksResolved: () => input.markStartupStage("hooks"),
		preparedModelRuntime: input.preparedModelRuntime
	});
	provider = modelSetup.provider;
	modelId = modelSetup.modelId;
	const { requestedModelId, modelSelectionChangedByHook, requestStreamTransportOverrides, expectedHarnessArtifact, nativeModelOwnedHarnessId, nativeModelOwned, modelConfigProvider, model, authStorage, modelRegistry } = modelSetup;
	let agentHarness = modelSetup.agentHarness;
	let pluginHarnessOwnsTransport = modelSetup.pluginHarnessOwnsTransport;
	let runtimeModel = model;
	const resolveEffectiveModel = (candidate) => resolveEmbeddedRunEffectiveModel({
		runParams: params,
		provider,
		modelConfigProvider,
		modelId,
		agentHarnessId: agentHarness.id,
		runtimeModel: candidate,
		nativeModelOwned,
		requestStreamTransportOverrides,
		nativeModelOwnedHarnessId
	});
	const initialResolvedRuntimeModel = resolveEffectiveModel(runtimeModel);
	let contextTokenBudget = initialResolvedRuntimeModel.contextTokenBudget;
	let contextWindowInfo = initialResolvedRuntimeModel.contextWindowInfo;
	let outerContextTokenMeta = contextTokenBudget === void 0 ? {} : { contextTokens: contextTokenBudget };
	let effectiveModel = initialResolvedRuntimeModel.effectiveModel;
	const applyResolvedRuntimeModel = (candidate, resolved = resolveEffectiveModel(candidate)) => {
		runtimeModel = candidate;
		effectiveModel = resolved.effectiveModel;
		contextTokenBudget = resolved.contextTokenBudget;
		contextWindowInfo = resolved.contextWindowInfo;
		outerContextTokenMeta = contextTokenBudget === void 0 ? {} : { contextTokens: contextTokenBudget };
	};
	const selectHarnessForModel = (candidate, plan, preparedAuthAttempt) => selectEmbeddedRunHarness({
		runParams: params,
		provider,
		modelId,
		model: candidate,
		plan,
		preparedAuthAttempt,
		requestStreamTransportOverrides,
		nativeModelOwnedHarnessId
	});
	const selectHarnessForPreparedAttempts = (candidate, attempts) => selectEmbeddedRunHarnessForPreparedAttempts({
		runParams: params,
		provider,
		modelId,
		model: candidate,
		attempts,
		requestStreamTransportOverrides,
		nativeModelOwnedHarnessId
	});
	input.markStartupStage("model-resolution");
	input.notifyExecutionPhase("model_resolution", {
		provider,
		model: modelId
	});
	agentHarness = selectHarnessForModel(effectiveModel);
	pluginHarnessOwnsTransport = agentHarness.id !== "openclaw";
	const authStages = log$3.isEnabled("trace") ? createEmbeddedRunStageTracker() : void 0;
	const preparedAuthPlan = await prepareEmbeddedRunAuthPlan({
		runParams: params,
		provider,
		modelId,
		model,
		agentDir: input.agentDir,
		workspaceDir: input.workspaceDir,
		requestStreamTransportOverrides,
		nativeModelOwned,
		authStorage,
		modelRegistry,
		getAgentHarness: () => agentHarness,
		setAgentHarness: (nextHarness) => {
			agentHarness = nextHarness;
			pluginHarnessOwnsTransport = agentHarness.id !== "openclaw";
		},
		getRuntimeModel: () => runtimeModel,
		getEffectiveModel: () => effectiveModel,
		applyResolvedRuntimeModel,
		selectHarnessForPreparedAttempts,
		markStage: (stage) => authStages?.mark(stage)
	});
	const { usesOpenAIAuthRouting, attemptAuthProfileStore, lockedProfileId, preferredProfileId, providerUsesProfileScopedModelMetadata, materializeAuthPlan, materializeAuthPlanUncached, preparedAuthAttempts } = preparedAuthPlan;
	let { activePreparedAuthPlan } = preparedAuthPlan;
	const genericCompactionRecoveryAllowed = !pluginHarnessOwnsTransport;
	const profileCandidates = preparedAuthAttempts.map((attempt) => attempt.profileId);
	const forwardedPluginHarnessProfileId = pluginHarnessOwnsTransport ? activePreparedAuthPlan.forwardedAuthProfileId : void 0;
	let profileIndex = 0;
	const requestedThinkLevel = resolveInitialThinkLevel({
		requested: params.thinkLevel,
		config: params.config,
		provider,
		modelId,
		model: effectiveModel
	});
	const initialThinkLevel = modelSelectionChangedByHook ? resolveCandidateThinkingLevel({
		cfg: params.config,
		provider,
		modelId,
		level: requestedThinkLevel,
		catalog: [{
			provider,
			id: modelId,
			api: effectiveModel.api,
			reasoning: effectiveModel.reasoning,
			params: effectiveModel.params,
			compat: effectiveModel.compat
		}],
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		agentRuntime: agentHarness.id
	}) ?? requestedThinkLevel : requestedThinkLevel;
	let thinkLevel = initialThinkLevel;
	const attemptedThinking = /* @__PURE__ */ new Set();
	let apiKeyInfo = null;
	let lastProfileId;
	let runtimeAuthState = null;
	let runtimeAuthRefreshCancelled = false;
	const pluginHarnessOwnsAuthBootstrap = pluginHarnessOwnsTransport && agentHarness.authBootstrap === "harness";
	const preparedApiKeyRoute = activePreparedAuthPlan.modelRoute?.authRequirement === "api-key";
	const pluginHarnessHasPreparedApiKeyAttempt = preparedAuthAttempts.some((attempt) => attempt.plan.modelRoute?.authRequirement === "api-key");
	const pluginHarnessNeedsOpenClawAuthBootstrap = pluginHarnessOwnsTransport && usesOpenAIAuthRouting && (preparedApiKeyRoute || !pluginHarnessOwnsAuthBootstrap && profileCandidates.some((profileId) => Boolean(profileId)));
	const findPreparedAuthAttempt = (profileId, attemptIndex) => {
		const attempt = attemptIndex === void 0 ? preparedAuthAttempts.find((candidate) => candidate.profileId === profileId) : preparedAuthAttempts[attemptIndex];
		return attempt?.profileId === profileId ? attempt : void 0;
	};
	let preparedProfileAttempted = false;
	const prepareAuthAttempt = async (attempt) => {
		if (!canRunPreparedAgentRuntimeAuthAttempt({
			attempt,
			priorProfileAttempted: preparedProfileAttempted
		})) throw new Error(`Prepared direct auth fallback cannot bypass unavailable profiles for ${provider}/${modelId}.`);
		const modelDecision = resolveCredentialScopedAuthAttemptModelDecision({
			attempt,
			priorProfileAttempted: preparedProfileAttempted,
			requestedProfileId: params.authProfileId,
			providerUsesProfileScopedModelMetadata
		});
		const nextRuntimeModel = modelDecision.shouldMaterialize ? modelDecision.forceResolve ? await materializeAuthPlanUncached(attempt.plan, true) : await materializeAuthPlan(attempt.plan) : runtimeModel;
		const nextResolvedModel = resolveEffectiveModel(nextRuntimeModel);
		if (selectHarnessForPreparedAttempts(nextResolvedModel.effectiveModel, preparedAuthAttempts).id !== agentHarness.id) throw new Error(`Prepared auth retry changed the selected agent harness for ${provider}/${modelId}.`);
		preparedProfileAttempted ||= attempt.kind === "profile";
		return {
			runtimeModel: nextRuntimeModel,
			authRequirement: modelDecision.authRequirement,
			allowAuthProfileFallback: attempt.allowAuthProfileFallback,
			commit() {
				applyResolvedRuntimeModel(nextRuntimeModel, nextResolvedModel);
				activePreparedAuthPlan = attempt.plan;
			}
		};
	};
	const prepareModelForAuthProfile = hasPreparedAuthAttemptModelMetadata({
		attempts: preparedAuthAttempts,
		providerUsesProfileScopedModelMetadata
	}) && (!pluginHarnessOwnsAuthBootstrap || pluginHarnessHasPreparedApiKeyAttempt) ? async (profileId, attemptIndex) => {
		const attempt = findPreparedAuthAttempt(profileId, attemptIndex);
		if (!attempt) throw new Error(`Auth profile "${profileId ?? "(none)"}" is outside the prepared attempts for ${provider}/${modelId}.`);
		const prepared = await prepareAuthAttempt(attempt);
		if (attempt.plan.modelRoute && !prepared.authRequirement) throw new Error(`Prepared route metadata is missing for ${provider}/${modelId}.`);
		return {
			runtimeModel: prepared.runtimeModel,
			authRequirement: prepared.authRequirement,
			allowAuthProfileFallback: prepared.allowAuthProfileFallback,
			commit: () => prepared.commit()
		};
	} : void 0;
	const authController = createEmbeddedRunAuthController({
		config: params.config,
		agentDir: input.agentDir,
		workspaceDir: input.workspaceDir,
		authStore: attemptAuthProfileStore,
		authStorage,
		profileCandidates,
		lockedProfileId,
		initialThinkLevel,
		attemptedThinking,
		fallbackConfigured: input.fallbackConfigured,
		allowTransientCooldownProbe: params.allowTransientCooldownProbe === true,
		getProvider: () => provider,
		getModelId: () => modelId,
		getRuntimeModel: () => runtimeModel,
		setRuntimeModel: (next) => {
			runtimeModel = next;
		},
		getEffectiveModel: () => effectiveModel,
		setEffectiveModel: (next) => {
			effectiveModel = next;
		},
		getApiKeyInfo: () => apiKeyInfo,
		setApiKeyInfo: (next) => {
			apiKeyInfo = next;
		},
		getLastProfileId: () => lastProfileId,
		setLastProfileId: (next) => {
			lastProfileId = next;
		},
		getRuntimeAuthState: () => runtimeAuthState,
		setRuntimeAuthState: (next) => {
			runtimeAuthState = next;
		},
		getRuntimeAuthRefreshCancelled: () => runtimeAuthRefreshCancelled,
		setRuntimeAuthRefreshCancelled: (next) => {
			runtimeAuthRefreshCancelled = next;
		},
		getProfileIndex: () => profileIndex,
		setProfileIndex: (next) => {
			profileIndex = next;
		},
		...prepareModelForAuthProfile ? { prepareModelForAuthProfile } : {},
		setThinkLevel: (next) => {
			thinkLevel = next;
		},
		log: log$3
	});
	authStages?.mark("controller");
	const advancePluginHarnessAuthAttempt = async () => {
		if (!pluginHarnessOwnsTransport || lockedProfileId) return false;
		let nextIndex = profileIndex + 1;
		while (nextIndex < preparedAuthAttempts.length) {
			const candidateAttempt = preparedAuthAttempts[nextIndex];
			if (!candidateAttempt) {
				nextIndex += 1;
				continue;
			}
			const candidate = candidateAttempt.profileId;
			if (candidate && isProfileInCooldown(attemptAuthProfileStore, candidate, void 0, modelId)) {
				nextIndex += 1;
				continue;
			}
			if (!canRunPreparedAgentRuntimeAuthAttempt({
				attempt: candidateAttempt,
				priorProfileAttempted: preparedProfileAttempted
			})) return false;
			if (candidateAttempt.plan.modelRoute?.authRequirement === "api-key") try {
				await authController.applyAuthProfileCandidate(candidate, nextIndex);
				profileIndex = nextIndex;
				thinkLevel = initialThinkLevel;
				attemptedThinking.clear();
				return true;
			} catch {
				nextIndex += 1;
				continue;
			}
			if (!candidate || candidateAttempt.plan.forwardedAuthProfileId !== candidate) {
				nextIndex += 1;
				continue;
			}
			const prepared = await prepareAuthAttempt(candidateAttempt);
			authController.stopRuntimeAuthRefreshTimer();
			apiKeyInfo = null;
			runtimeAuthState = null;
			prepared.commit();
			profileIndex = nextIndex;
			lastProfileId = candidate;
			thinkLevel = initialThinkLevel;
			attemptedThinking.clear();
			return true;
		}
		return false;
	};
	const advanceAttemptAuthProfile = pluginHarnessOwnsAuthBootstrap ? advancePluginHarnessAuthAttempt : authController.advanceAuthProfile;
	if (!pluginHarnessOwnsTransport || pluginHarnessNeedsOpenClawAuthBootstrap) await authController.initializeAuthProfile();
	else if (lockedProfileId) lastProfileId = lockedProfileId;
	else if (forwardedPluginHarnessProfileId) {
		const initialAttempt = preparedAuthAttempts[profileIndex];
		const initialProfileInCooldown = initialAttempt?.kind === "profile" && isProfileInCooldown(attemptAuthProfileStore, initialAttempt.profileId, void 0, modelId);
		const cooldownProbePolicy = resolveEmbeddedAuthCooldownProbePolicy({
			authStore: attemptAuthProfileStore,
			profileCandidates,
			lockedProfileId,
			modelId,
			allowTransientCooldownProbe: params.allowTransientCooldownProbe === true
		});
		if (initialProfileInCooldown && !cooldownProbePolicy.allowProbe) {
			if (!await advancePluginHarnessAuthAttempt()) throw new Error(`Prepared auth profiles are temporarily unavailable for ${provider}/${modelId}.`);
		} else {
			if (initialProfileInCooldown) log$3.warn(`probing cooldowned auth profile for ${provider}/${modelId} due to ${cooldownProbePolicy.unavailableReason ?? "transient"} unavailability`);
			preparedProfileAttempted = initialAttempt?.kind === "profile";
			lastProfileId = forwardedPluginHarnessProfileId;
		}
	}
	authStages?.mark("initialize");
	if (authStages) log$3.trace(formatEmbeddedRunStageSummary(`[trace:embedded-run] auth stages: runId=${params.runId} sessionId=${params.sessionId} phase=auth`, authStages.snapshot()));
	input.markStartupStage("auth");
	input.notifyExecutionPhase("auth", {
		provider,
		model: modelId
	});
	return {
		provider,
		modelId,
		requestedModelId,
		expectedHarnessArtifact,
		nativeModelOwned,
		model,
		authStorage,
		modelRegistry,
		attemptAuthProfileStore,
		lockedProfileId,
		preferredProfileId,
		profileCandidates,
		profileFailureStore: attemptAuthProfileStore,
		genericCompactionRecoveryAllowed,
		pluginHarnessOwnsAuthBootstrap,
		attemptedThinking,
		advanceAttemptAuthProfile,
		maybeRefreshRuntimeAuthForAuthError: authController.maybeRefreshRuntimeAuthForAuthError,
		stopRuntimeAuthRefreshTimer: authController.stopRuntimeAuthRefreshTimer,
		getApiKeyInfo: () => apiKeyInfo,
		setThinkLevel: (next) => {
			thinkLevel = next;
		},
		resolveRunAttemptAuthProfileStore: () => {
			if (!pluginHarnessOwnsTransport) return attemptAuthProfileStore;
			const activeProfileIds = activePreparedAuthPlan.modelRoute ? [activePreparedAuthPlan.forwardedAuthProfileId, ...activePreparedAuthPlan.forwardedAuthProfileCandidateIds ?? []] : [lastProfileId];
			return createScopedAuthProfileStore(attemptAuthProfileStore, activeProfileIds.filter((profileId) => Boolean(profileId)));
		},
		snapshot: () => ({
			agentHarness,
			pluginHarnessOwnsTransport,
			effectiveModel,
			contextTokenBudget,
			contextWindowInfo,
			outerContextTokenMeta,
			activePreparedAuthPlan,
			thinkLevel,
			apiKeyInfo,
			lastProfileId,
			runtimeAuthState
		})
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/session-prompt-state.ts
const MID_TURN_PRECHECK_CONTINUATION_PROMPT = "Continue from the current transcript after the latest tool result. Do not repeat the original user request, and do not rerun completed tools unless the transcript shows they are still needed.";
function createEmbeddedRunSessionPromptState(input) {
	const { runParams: params, sessionAgentId, resolvedSessionKey, lifecycleGeneration } = input;
	let activeSessionId = params.sessionId;
	let activeSessionFile = params.sessionFile;
	let activeSessionTarget = buildContextEngineCompactionSessionTarget({
		agentId: params.agentId ?? sessionAgentId,
		config: params.config,
		sessionFile: activeSessionFile,
		sessionId: activeSessionId,
		sessionKey: resolvedSessionKey,
		sessionTarget: params.sessionTarget
	});
	let suppressNextUserMessagePersistence = params.suppressNextUserMessagePersistence ?? false;
	let activePrompt = {
		persisted: suppressNextUserMessagePersistence,
		internal: false
	};
	const adoptSessionId = (nextSessionId) => {
		if (!nextSessionId || nextSessionId === activeSessionId) return;
		activeSessionId = nextSessionId;
		params.replyOperation?.updateSessionId(activeSessionId);
		params.onSessionIdChanged?.(activeSessionId);
		registerAgentRunContext(params.runId, {
			sessionId: activeSessionId,
			lifecycleGeneration
		});
	};
	const adoptSessionTarget = async (nextSessionTarget) => {
		if (!nextSessionTarget) return;
		const resolvedTarget = await resolveAgentRunSessionTarget({
			agentId: nextSessionTarget.agentId ?? sessionAgentId,
			config: params.config,
			sessionId: nextSessionTarget.sessionId ?? activeSessionId,
			sessionKey: nextSessionTarget.sessionKey ?? resolvedSessionKey,
			sessionTarget: nextSessionTarget
		});
		activeSessionTarget = nextSessionTarget;
		activeSessionFile = resolvedTarget.sessionFile;
		adoptSessionId(resolvedTarget.sessionId);
	};
	const activateInternalPrompt = (prompt, persisted) => {
		activePrompt = {
			override: prompt,
			persisted,
			internal: true
		};
		suppressNextUserMessagePersistence = persisted;
	};
	const onUserMessagePersisted = (message) => {
		const blockedBeforeAgentRun = message["__openclaw"]?.beforeAgentRunBlocked;
		const markCurrentUserMessagePersisted = () => {
			activePrompt.persisted = true;
			params.onUserMessagePersisted?.(message);
		};
		const recorder = params.userTurnTranscriptRecorder;
		if (!recorder) {
			markCurrentUserMessagePersisted();
			return;
		}
		const markWhenPersisted = (persisted) => {
			if (persisted?.message || recorder.hasPersisted()) markCurrentUserMessagePersisted();
		};
		const observedPersistence = (blockedBeforeAgentRun !== void 0 ? recorder.persistBlocked(message) : recorder.persistApproved()).then(markWhenPersisted).catch((persistError) => {
			log$3.warn(`failed to persist canonical ${blockedBeforeAgentRun !== void 0 ? "blocked " : ""}embedded user turn transcript: ${formatErrorMessage(persistError)}`);
		});
		recorder.markRuntimePersistencePending(observedPersistence);
	};
	const waitForCurrentUserMessagePersistence = async () => {
		if (params.userTurnTranscriptRecorder?.hasRuntimePersistencePending() === true) await params.userTurnTranscriptRecorder.waitForRuntimePersistence();
	};
	return {
		get sessionId() {
			return activeSessionId;
		},
		get sessionFile() {
			return activeSessionFile;
		},
		set sessionFile(value) {
			activeSessionFile = value;
		},
		get sessionTarget() {
			return activeSessionTarget;
		},
		set sessionTarget(value) {
			activeSessionTarget = value;
		},
		get activePrompt() {
			return activePrompt;
		},
		get suppressNextUserMessagePersistence() {
			return suppressNextUserMessagePersistence;
		},
		set suppressNextUserMessagePersistence(value) {
			suppressNextUserMessagePersistence = value;
		},
		adoptSessionId,
		adoptSessionTarget,
		activateInternalPrompt,
		continueFromCurrentTranscript: () => activateInternalPrompt(MID_TURN_PRECHECK_CONTINUATION_PROMPT, true),
		onUserMessagePersisted,
		waitForCurrentUserMessagePersistence,
		prepareCompactedTranscriptRetry: async () => {
			await waitForCurrentUserMessagePersistence();
			if (activePrompt.internal) suppressNextUserMessagePersistence = activePrompt.persisted;
			else if (activePrompt.persisted) activateInternalPrompt(MID_TURN_PRECHECK_CONTINUATION_PROMPT, true);
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/failure-signal.ts
/**
* Converts embedded run failures into provider failover signals.
*/
/**
* Converts terminal tool errors from unattended embedded runs into failure signals.
*
* Cron runs need fatal execution-denied signals so schedulers do not treat blocked shell access as
* a normal silent completion.
*/
const FAILURE_SIGNAL_CODES = ["SYSTEM_RUN_DENIED", "INVALID_REQUEST"];
function resolveFailureSignalCode(value) {
	for (const code of FAILURE_SIGNAL_CODES) if (value === code) return code;
}
/** Resolves fatal cron failure metadata from the last exec-like tool error, if applicable. */
function resolveEmbeddedRunFailureSignal(params) {
	if (params.trigger !== "cron") return;
	const lastToolError = params.lastToolError;
	if (!lastToolError || !isExecLikeToolName(lastToolError.toolName)) return;
	const code = resolveFailureSignalCode(normalizeOptionalString(lastToolError.errorCode));
	if (!code) return;
	const message = normalizeOptionalString(lastToolError.error) ?? code;
	return {
		kind: "execution_denied",
		source: "tool",
		...lastToolError.toolName ? { toolName: lastToolError.toolName } : {},
		code,
		message,
		fatalForCron: true
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/tool-media-payloads.ts
/**
* Merges media emitted by tools into the channel payloads produced by the
* assistant turn. The first non-reasoning reply owns the media so text and
* attachments stay together; metadata is preserved for delivery bookkeeping.
*/
function mergeAttemptToolMediaPayloads(params) {
	const mediaUrls = Array.from(new Set(params.toolMediaUrls?.map((url) => url.trim()).filter(Boolean) ?? []));
	const mediaUrlSet = new Set(mediaUrls);
	const hostOwnedMediaUrls = Array.from(new Set(params.hostOwnedToolMediaUrls?.map((url) => url.trim()).filter((url) => url.length > 0 && mediaUrlSet.has(url)) ?? []));
	if (mediaUrls.length === 0 && !params.toolAudioAsVoice && !params.toolTrustedLocalMedia) return params.payloads;
	const buildMediaPayload = (urls, includeAudio) => ({
		mediaUrls: urls.length ? urls : void 0,
		mediaUrl: urls[0],
		audioAsVoice: includeAudio && params.toolAudioAsVoice || void 0,
		trustedLocalMedia: params.toolTrustedLocalMedia || void 0
	});
	const shouldSplitHostOwnedMedia = params.sourceReplyDeliveryMode === "message_tool_only" && hostOwnedMediaUrls.length > 0;
	const hostOwnedMediaUrlSet = new Set(hostOwnedMediaUrls);
	const mergeableMediaUrls = shouldSplitHostOwnedMedia ? mediaUrls.filter((url) => !hostOwnedMediaUrlSet.has(url)) : mediaUrls;
	const appendHostOwnedMedia = (nextPayloads) => {
		if (!shouldSplitHostOwnedMedia) return nextPayloads;
		return [...nextPayloads, markReplyPayloadForSourceSuppressionDelivery(buildMediaPayload(hostOwnedMediaUrls, false))];
	};
	const payloads = params.payloads?.length ? [...params.payloads] : [];
	const payloadIndex = payloads.findIndex((payload) => !payload.isReasoning);
	if (payloadIndex >= 0) {
		const payload = payloads.at(payloadIndex);
		if (!payload) return payloads;
		if (params.sourceReplyDeliveryMode === "message_tool_only" && getReplyPayloadMetadata(payload)?.sourceReplyTranscriptMirror) return appendHostOwnedMedia(payloads);
		if (mergeableMediaUrls.length === 0 && shouldSplitHostOwnedMedia) return appendHostOwnedMedia(payloads);
		const mergedMediaUrls = Array.from(/* @__PURE__ */ new Set([...payload.mediaUrls ?? [], ...mergeableMediaUrls]));
		payloads[payloadIndex] = copyReplyPayloadMetadata(payload, {
			...payload,
			mediaUrls: mergedMediaUrls.length ? mergedMediaUrls : void 0,
			mediaUrl: payload.mediaUrl ?? mergedMediaUrls[0],
			audioAsVoice: payload.audioAsVoice || params.toolAudioAsVoice || void 0,
			trustedLocalMedia: payload.trustedLocalMedia || params.toolTrustedLocalMedia || void 0
		});
		return appendHostOwnedMedia(payloads);
	}
	if (shouldSplitHostOwnedMedia) {
		const genericMediaPayload = mergeableMediaUrls.length > 0 ? [buildMediaPayload(mergeableMediaUrls, true)] : [];
		return appendHostOwnedMedia([...payloads, ...genericMediaPayload]);
	}
	const mediaPayload = buildMediaPayload(mergeableMediaUrls, true);
	return [...payloads, mediaPayload];
}
//#endregion
//#region src/agents/embedded-agent-runner/run/terminal-preparation.ts
function prepareEmbeddedRunTerminal(input) {
	const { runParams, attempt } = input;
	const timedOutDuringPrompt = input.terminalTimedOut && !input.timedOutDuringCompaction && !input.timedOutDuringToolExecution;
	const terminalAssistant = input.currentAttemptCompletedAssistant;
	const usageMeta = buildUsageAgentMetaFields({
		usageAccumulator: input.usageAccumulator,
		lastAssistantUsage: terminalAssistant?.usage,
		lastRunPromptUsage: input.lastRunPromptUsage,
		lastTurnTotal: input.lastTurnTotal
	});
	const reportedModelRef = resolveReportedModelRef({
		provider: input.provider,
		model: input.model,
		assistant: terminalAssistant
	});
	const agentMeta = {
		sessionId: input.sessionIdUsed,
		sessionFile: input.sessionFileUsed,
		provider: reportedModelRef.provider,
		model: reportedModelRef.model,
		...input.outerContextTokenMeta,
		agentHarnessId: attempt.agentHarnessId,
		usage: usageMeta.usage,
		lastCallUsage: usageMeta.lastCallUsage,
		promptTokens: usageMeta.promptTokens,
		...input.contextRecoveryState.lastContextBudgetStatus ? { contextBudgetStatus: input.contextRecoveryState.lastContextBudgetStatus } : {},
		compactionCount: input.contextRecoveryState.autoCompactionCount > 0 ? input.contextRecoveryState.autoCompactionCount : void 0,
		compactionTokensAfter: input.contextRecoveryState.lastCompactionTokensAfter
	};
	const attemptFinalText = attempt.assistantTexts.toReversed().map((text) => text.trim()).find((text) => text.length > 0);
	const finalAssistantVisibleText = resolveFinalAssistantVisibleText(terminalAssistant) ?? attemptFinalText;
	const finalAssistantRawText = resolveFinalAssistantRawText(terminalAssistant) ?? attemptFinalText;
	const payloadAssistant = attempt.yieldDetected ? attempt.lastAssistant : input.currentAttemptCompletedAssistant;
	const payloads = buildEmbeddedRunPayloads({
		assistantTexts: attempt.assistantTexts,
		assistantMessageIndex: attempt.lastAssistantTextMessageIndex,
		assistantTranscriptOwned: attempt.assistantTranscriptOwned,
		toolMetas: attempt.toolMetas,
		lastAssistant: payloadAssistant,
		currentAssistant: attempt.yieldDetected ? null : payloadAssistant ?? null,
		lastToolError: attempt.lastToolError,
		config: runParams.config,
		isCronTrigger: runParams.trigger === "cron",
		isHeartbeatTrigger: runParams.trigger === "heartbeat",
		sessionKey: runParams.sessionKey ?? runParams.sessionId,
		provider: input.activeErrorContext.provider,
		model: input.activeErrorContext.model,
		authMode: input.authProfileId ? input.authProfileStore.profiles?.[input.authProfileId]?.type : void 0,
		verboseLevel: runParams.verboseLevel,
		reasoningLevel: runParams.reasoningLevel,
		thinkingLevel: runParams.thinkLevel,
		toolResultFormat: input.resolvedToolResultFormat,
		suppressToolErrorWarnings: runParams.suppressToolErrorWarnings,
		inlineToolResultsAllowed: false,
		didSendViaMessagingTool: attempt.didSendViaMessagingTool,
		didDeliverSourceReplyViaMessageTool: attempt.didDeliverSourceReplyViaMessageTool === true,
		messagingToolSentTargets: attempt.messagingToolSentTargets,
		messagingToolSourceReplyPayloads: attempt.messagingToolSourceReplyPayloads,
		sourceReplyDeliveryMode: runParams.sourceReplyDeliveryMode,
		agentId: runParams.agentId,
		runId: runParams.runId,
		runAborted: input.terminalInterrupted,
		didSendDeterministicApprovalPrompt: attempt.didSendDeterministicApprovalPrompt,
		heartbeatToolResponse: attempt.heartbeatToolResponse
	});
	const payloadsWithToolMedia = mergeAttemptToolMediaPayloads({
		payloads,
		toolMediaUrls: attempt.toolMediaUrls,
		hostOwnedToolMediaUrls: attempt.hostOwnedToolMediaUrls,
		toolAudioAsVoice: attempt.toolAudioAsVoice,
		toolTrustedLocalMedia: attempt.toolTrustedLocalMedia,
		sourceReplyDeliveryMode: runParams.sourceReplyDeliveryMode
	});
	const finalAssistantStopReason = (terminalAssistant?.stopReason ?? "").trim().toLowerCase();
	const recoveredFinalAssistantTextAfterPromptTimeout = timedOutDuringPrompt && [
		"completed",
		"end_turn",
		"stop"
	].includes(finalAssistantStopReason) ? (finalAssistantVisibleText ?? finalAssistantRawText)?.trim() : void 0;
	const payloadAlreadyContainsRecoveredFinalAssistant = recoveredFinalAssistantTextAfterPromptTimeout ? (payloadsWithToolMedia ?? []).some((payload) => payload?.isError !== true && payload?.isReasoning !== true && typeof payload.text === "string" && payload.text.trim() === recoveredFinalAssistantTextAfterPromptTimeout) : false;
	const recoveredFinalAssistantPayloadsAfterPromptTimeout = recoveredFinalAssistantTextAfterPromptTimeout && !payloadAlreadyContainsRecoveredFinalAssistant ? replacePartialAssistantPayload({
		payloads: payloadsWithToolMedia,
		assistantTexts: attempt.assistantTexts,
		recoveredText: recoveredFinalAssistantTextAfterPromptTimeout
	}) : void 0;
	return {
		agentMeta,
		reportedModelRef,
		finalAssistantVisibleText,
		finalAssistantRawText,
		payloads,
		payloadsWithToolMedia,
		timedOutDuringPrompt,
		recoveredFinalAssistantPayloadsAfterPromptTimeout,
		hasSuccessfulFinalAssistantAfterPromptTimeout: timedOutDuringPrompt && Boolean(payloadAlreadyContainsRecoveredFinalAssistant || recoveredFinalAssistantPayloadsAfterPromptTimeout?.length),
		hasPartialAssistantTextAfterPromptTimeout: timedOutDuringPrompt && (attempt.assistantTexts ?? []).some((text) => text.trim().length > 0) && !attempt.clientToolCalls && !attempt.yieldDetected && !attempt.didSendViaMessagingTool && !attempt.didSendDeterministicApprovalPrompt && !attempt.lastToolError && (attempt.toolMetas?.length ?? 0) === 0,
		attemptToolSummary: buildTraceToolSummary({
			toolMetas: attempt.toolMetas,
			fallbackHadFailure: Boolean(attempt.lastToolError)
		}),
		failureSignal: resolveEmbeddedRunFailureSignal({
			trigger: runParams.trigger,
			lastToolError: attempt.lastToolError
		})
	};
}
function replacePartialAssistantPayload(input) {
	const payloads = input.payloads ? [...input.payloads] : [];
	const assistantTextSignatures = new Set((input.assistantTexts ?? []).map((text) => text.trim()).filter((text) => text.length > 0));
	const partialPayloadIndex = payloads.findLastIndex((payload) => payload.isError !== true && payload.isReasoning !== true && typeof payload.text === "string" && assistantTextSignatures.has(payload.text.trim()));
	if (partialPayloadIndex < 0) return [...payloads, { text: input.recoveredText }];
	const partialPayload = payloads[partialPayloadIndex];
	if (!partialPayload) return [...payloads, { text: input.recoveredText }];
	payloads[partialPayloadIndex] = copyReplyPayloadMetadata(partialPayload, {
		...partialPayload,
		text: input.recoveredText
	});
	return payloads;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-profile-success.ts
const POST_RUN_AUTH_PROFILE_SUCCESS_SLOW_MS = 1e3;
function markEmbeddedRunAuthProfileSuccess(input) {
	if (input.authProfileStateMode === "read-only" || !input.profileId) return;
	const successProfileId = input.profileId;
	const safeSuccessProfileId = redactIdentifier(successProfileId, { len: 12 });
	const successProvider = resolveAuthProfileStateProvider(input.profileStore, successProfileId, input.provider);
	const successStarted = Date.now();
	markAuthProfileSuccess({
		store: input.profileStore,
		provider: successProvider,
		profileId: successProfileId,
		agentDir: input.agentDir
	}).then(() => {
		const durationMs = Date.now() - successStarted;
		if (durationMs >= POST_RUN_AUTH_PROFILE_SUCCESS_SLOW_MS) log$3.warn(`post-run auth-profile success bookkeeping completed after ${durationMs}ms: runId=${input.runId} sessionId=${input.sessionId} provider=${sanitizeForLog(successProvider)} profileId=${safeSuccessProfileId}`);
		else if (log$3.isEnabled("trace")) log$3.trace(`post-run auth-profile success bookkeeping completed: runId=${input.runId} sessionId=${input.sessionId} durationMs=${durationMs}`);
	}).catch((error) => {
		log$3.warn(`post-run auth-profile success bookkeeping failed: runId=${input.runId} sessionId=${input.sessionId} provider=${sanitizeForLog(successProvider)} profileId=${safeSuccessProfileId} error=${formatErrorMessage(error)}`);
	});
}
function reportEmbeddedRunSuccessfulAuthBinding(input) {
	const credential = input.profileId ? input.profileStore.profiles[input.profileId] : void 0;
	const pluginHarnessApiKeyInfo = resolvePluginHarnessApiKeyInfo({
		apiKeyInfo: input.apiKeyInfo,
		pluginHarnessOwnsTransport: input.pluginHarnessOwnsTransport
	});
	const authFingerprint = credential?.type === "oauth" && input.profileId ? fingerprintResolvedAuthProfileCredential({
		profileId: input.profileId,
		credential,
		resolvedAuth: input.apiKeyInfo
	}) : credential && input.profileId && input.pluginHarnessOwnsAuthBootstrap ? input.attempt.authBindingFingerprint : credential && input.profileId && input.pluginHarnessOwnsTransport ? fingerprintResolvedAuthProfileCredential({
		profileId: input.profileId,
		credential,
		resolvedAuth: pluginHarnessApiKeyInfo
	}) : input.apiKeyInfo ? fingerprintResolvedProviderAuth(input.apiKeyInfo) : void 0;
	const authProfileOwnerFingerprint = input.profileId && credential !== void 0 ? fingerprintAuthProfileOwnerShape({
		profileId: input.profileId,
		credential
	}) : void 0;
	const runtimeArtifact = input.pluginHarnessOwnsTransport ? input.attempt.runtimeArtifact : void 0;
	const runtimeOwnerFingerprint = authFingerprint ? void 0 : input.apiKeyInfo?.mode === "aws-sdk" ? fingerprintAwsSdkRuntimeOwner({
		provider: input.provider,
		backendId: input.agentHarnessId,
		auth: input.apiKeyInfo
	}) : input.pluginHarnessOwnsTransport ? fingerprintOpaqueRuntimeOwner({
		kind: "plugin-harness",
		runner: "embedded",
		provider: input.provider,
		backendId: input.agentHarnessId,
		...runtimeArtifact ? { runtimeArtifactFingerprint: runtimeArtifact.fingerprint } : {},
		...input.profileId ? { authProfileId: input.profileId } : {},
		...authProfileOwnerFingerprint ? { authProfileOwnerFingerprint } : {}
	}) : void 0;
	const runtimeOwnerKind = runtimeOwnerFingerprint ? input.apiKeyInfo?.mode === "aws-sdk" ? "aws-sdk" : input.pluginHarnessOwnsTransport ? "plugin-harness" : void 0 : input.pluginHarnessOwnsTransport ? "plugin-harness" : void 0;
	input.onSuccessfulAuthBinding?.({
		...input.profileId ? { authProfileId: input.profileId } : {},
		agentHarnessId: input.agentHarnessId,
		...authFingerprint ? { authFingerprint } : {},
		...runtimeOwnerFingerprint ? { runtimeOwnerFingerprint } : {},
		...runtimeOwnerKind ? { runtimeOwnerKind } : {},
		...runtimeOwnerKind ? { runtimeOwnerId: input.agentHarnessId } : {},
		...runtimeArtifact ? {
			runtimeArtifactId: runtimeArtifact.id,
			runtimeArtifactFingerprint: runtimeArtifact.fingerprint
		} : {}
	});
}
function resolvePluginHarnessApiKeyInfo(input) {
	const apiKeyInfo = input.apiKeyInfo;
	const apiKey = apiKeyInfo?.apiKey;
	if (!input.pluginHarnessOwnsTransport || !apiKeyInfo || !apiKey || !looksLikeSecretSentinel(apiKey)) return apiKeyInfo;
	const resolvedApiKey = resolveSecretSentinel(apiKey);
	return resolvedApiKey ? {
		...apiKeyInfo,
		apiKey: resolvedApiKey
	} : null;
}
function resolveAuthProfileStateProvider(store, profileId, fallbackProvider) {
	const profileProvider = store.profiles?.[profileId]?.provider?.trim();
	if (profileProvider) return profileProvider;
	return profileId.split(":", 1)[0]?.trim() || fallbackProvider;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/terminal-resolution.ts
const MAX_MISSING_ASSISTANT_RETRIES = 1;
const MAX_TOOL_USE_TERMINAL_CONTINUATIONS = 1;
const COMPACTION_CONTINUATION_RETRY_INSTRUCTION = "The previous attempt compacted the conversation context before producing a final user-visible answer. Continue from the compacted transcript and produce the final answer now. Do not restart from scratch, do not repeat completed work, and do not rerun tools unless the transcript clearly lacks required evidence.";
const BEFORE_AGENT_FINALIZE_RETRY_PROMPT_PREFIX = "Before accepting the previous final answer, apply this revision request and produce the revised final answer. Do not repeat completed work or rerun tools unless the request explicitly requires it.";
async function resolveEmbeddedRunTerminal(input) {
	const { runParams, attempt, retryState } = input;
	const silentToolResultReplyPayload = resolveSilentToolResultReplyPayload({
		isCronTrigger: runParams.trigger === "cron",
		payloadCount: input.payloadsWithToolMedia?.length ?? 0,
		aborted: input.terminalAborted,
		timedOut: input.terminalTimedOut,
		attempt
	});
	const payloadsForTerminalPath = input.recoveredFinalAssistantPayloadsAfterPromptTimeout ? input.recoveredFinalAssistantPayloadsAfterPromptTimeout : input.payloadsWithToolMedia?.length ? input.payloadsWithToolMedia : silentToolResultReplyPayload ? [silentToolResultReplyPayload] : input.payloadsWithToolMedia;
	const payloadCount = payloadsForTerminalPath?.length ?? 0;
	const emptyAssistantReplyIsSilent = shouldTreatEmptyAssistantReplyAsSilent({
		allowEmptyAssistantReplyAsSilent: runParams.allowEmptyAssistantReplyAsSilent,
		payloadCount,
		aborted: input.terminalAborted,
		timedOut: input.terminalTimedOut,
		attempt
	});
	const nextReasoningOnlyRetryInstruction = emptyAssistantReplyIsSilent ? null : resolveReasoningOnlyRetryInstruction({
		provider: input.activeErrorContext.provider,
		modelId: input.activeErrorContext.model,
		modelApi: input.modelApi,
		executionContract: input.executionContract,
		aborted: input.terminalAborted,
		timedOut: input.terminalTimedOut,
		attempt
	});
	const nextEmptyResponseRetryInstruction = emptyAssistantReplyIsSilent ? null : resolveEmptyResponseRetryInstruction({
		provider: input.activeErrorContext.provider,
		modelId: input.activeErrorContext.model,
		modelApi: input.modelApi,
		executionContract: input.executionContract,
		payloadCount,
		aborted: input.terminalAborted,
		timedOut: input.terminalTimedOut,
		attempt
	});
	if (nextReasoningOnlyRetryInstruction && retryState.reasoningOnlyAttempts < input.maxReasoningOnlyRetryAttempts) {
		retryState.reasoningOnlyAttempts += 1;
		input.activateInternalPrompt(nextReasoningOnlyRetryInstruction, false);
		log$3.warn(`reasoning-only assistant turn detected: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${input.activeErrorContext.provider}/${input.activeErrorContext.model} — retrying ${retryState.reasoningOnlyAttempts}/${input.maxReasoningOnlyRetryAttempts} with visible-answer continuation`);
		return { action: "retry" };
	}
	const reasoningOnlyRetriesExhausted = nextReasoningOnlyRetryInstruction && retryState.reasoningOnlyAttempts >= input.maxReasoningOnlyRetryAttempts;
	if (!emptyAssistantReplyIsSilent && shouldRetryMissingAssistantTurn({
		payloadCount,
		aborted: input.terminalAborted,
		promptError: input.promptError,
		timedOut: input.terminalTimedOut,
		attempt
	}) && retryState.missingAssistantAttempts < MAX_MISSING_ASSISTANT_RETRIES) {
		retryState.missingAssistantAttempts += 1;
		input.setSuppressNextUserMessagePersistence(input.activePromptPersisted);
		log$3.warn(`missing assistant terminal message detected: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${input.activeErrorContext.provider}/${input.activeErrorContext.model} — retrying ${retryState.missingAssistantAttempts}/${MAX_MISSING_ASSISTANT_RETRIES} with same prompt`);
		return { action: "retry" };
	}
	if (!nextReasoningOnlyRetryInstruction && nextEmptyResponseRetryInstruction && retryState.emptyResponseAttempts < input.maxEmptyResponseRetryAttempts) {
		retryState.emptyResponseAttempts += 1;
		input.activateInternalPrompt(nextEmptyResponseRetryInstruction, false);
		log$3.warn(`empty response detected: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${input.activeErrorContext.provider}/${input.activeErrorContext.model} — retrying ${retryState.emptyResponseAttempts}/${input.maxEmptyResponseRetryAttempts} with visible-answer continuation`);
		return { action: "retry" };
	}
	const availableTerminalToolPresentation = input.readTerminalToolPresentation();
	const nextToolUseTerminalContinuationInstruction = emptyAssistantReplyIsSilent ? null : resolveToolUseTerminalContinuationInstruction({
		provider: input.activeErrorContext.provider,
		modelId: input.activeErrorContext.model,
		modelApi: input.modelApi,
		executionContract: input.executionContract,
		payloadCount,
		hasTerminalToolPresentation: Boolean(availableTerminalToolPresentation),
		aborted: input.terminalAborted,
		promptError: input.promptError,
		timedOut: input.terminalTimedOut,
		attempt
	});
	if (nextToolUseTerminalContinuationInstruction && retryState.toolUseContinuationAttempts < MAX_TOOL_USE_TERMINAL_CONTINUATIONS) {
		retryState.toolUseContinuationAttempts += 1;
		input.activateInternalPrompt(nextToolUseTerminalContinuationInstruction, false);
		log$3.warn(`tool-use terminal turn lacked a final answer: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${input.activeErrorContext.provider}/${input.activeErrorContext.model} — continuing ${retryState.toolUseContinuationAttempts}/${MAX_TOOL_USE_TERMINAL_CONTINUATIONS} from settled tool results`);
		return { action: "retry" };
	}
	const incompleteTurnText = emptyAssistantReplyIsSilent ? null : resolveIncompleteTurnPayloadText({
		payloadCount,
		aborted: input.terminalAborted,
		externalAbort: input.externalAbort || input.signalOwnedInterruption,
		timedOut: input.terminalTimedOut,
		attempt
	});
	const incompleteTurnFallbackSafe = Boolean(incompleteTurnText && !input.terminalInterrupted && !input.promptError && !attempt.lastToolError && !hasAttemptTerminalState(attempt) && !input.replayState.hadPotentialSideEffects);
	const terminalToolPresentation = incompleteTurnFallbackSafe ? availableTerminalToolPresentation : void 0;
	if (!emptyAssistantReplyIsSilent && input.attemptCompactionCount > 0 && payloadCount === 0 && !input.terminalInterrupted && !input.promptError && !attempt.clientToolCalls && !attempt.yieldDetected && !attempt.didSendDeterministicApprovalPrompt && !attempt.lastToolError && !input.replayState.hadPotentialSideEffects && retryState.compactionContinuationAttempts < 1) {
		retryState.compactionContinuationAttempts += 1;
		retryState.compactionContinuationInstruction = COMPACTION_CONTINUATION_RETRY_INSTRUCTION;
		log$3.warn(`compaction interrupted visible final answer: runId=${runParams.runId} sessionId=${runParams.sessionId} compactions=${input.attemptCompactionCount} — retrying ${retryState.compactionContinuationAttempts}/1 with compacted-transcript continuation`);
		input.armPostCompactionGuard();
		return { action: "retry" };
	}
	retryState.compactionContinuationInstruction = null;
	if (reasoningOnlyRetriesExhausted && !input.finalAssistantVisibleText) {
		const incompletePayloadText = "⚠️ Agent couldn't generate a response. Please try again.";
		log$3.warn(`reasoning-only retries exhausted: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${input.activeErrorContext.provider}/${input.activeErrorContext.model} attempts=${retryState.reasoningOnlyAttempts}/${input.maxReasoningOnlyRetryAttempts} — surfacing incomplete-turn error`);
		return surfaceIncompleteTurn({
			...input,
			text: incompletePayloadText,
			payloadCount: 0,
			incompleteTurnFallbackSafe,
			terminalToolPresentation
		});
	}
	if (!nextReasoningOnlyRetryInstruction && nextEmptyResponseRetryInstruction && retryState.emptyResponseAttempts >= input.maxEmptyResponseRetryAttempts) log$3.warn(`empty response retries exhausted: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${input.activeErrorContext.provider}/${input.activeErrorContext.model} attempts=${retryState.emptyResponseAttempts}/${input.maxEmptyResponseRetryAttempts} — surfacing incomplete-turn error`);
	if (incompleteTurnText) {
		const replayMetadata = resolveAttemptReplayMetadata(attempt);
		const incompleteStopReason = attempt.currentAttemptAssistant?.stopReason ?? attempt.lastAssistant?.stopReason;
		log$3.warn(`incomplete turn detected: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${input.activeErrorContext.provider}/${input.activeErrorContext.model} stopReason=${incompleteStopReason ?? "missing"} hasLastAssistant=${attempt.lastAssistant ? "yes" : "no"} hasCurrentAttemptAssistant=${attempt.currentAttemptAssistant ? "yes" : "no"} payloads=${payloadCount} tools=${attempt.toolMetas?.length ?? 0} replaySafe=${replayMetadata.replaySafe ? "yes" : "no"} compactions=${input.attemptCompactionCount} reasoningRetries=${retryState.reasoningOnlyAttempts}/${input.maxReasoningOnlyRetryAttempts} emptyRetries=${retryState.emptyResponseAttempts}/${input.maxEmptyResponseRetryAttempts} missingAssistantRetries=${retryState.missingAssistantAttempts}/${MAX_MISSING_ASSISTANT_RETRIES} toolUseContinuations=${retryState.toolUseContinuationAttempts}/${MAX_TOOL_USE_TERMINAL_CONTINUATIONS} — ` + (terminalToolPresentation ? "surfacing tool-authored terminal presentation" : "surfacing error to user"));
		return surfaceIncompleteTurn({
			...input,
			text: incompleteTurnText,
			payloadCount,
			incompleteTurnFallbackSafe,
			terminalToolPresentation
		});
	}
	const beforeFinalizeRevisionReason = attempt.beforeAgentFinalizeRevisionReason;
	if (beforeFinalizeRevisionReason && !input.terminalInterrupted && !input.promptError && !attempt.clientToolCalls && !attempt.yieldDetected && !emptyAssistantReplyIsSilent) {
		retryState.beforeFinalizeRevisionAttempts += 1;
		input.activateInternalPrompt(`${BEFORE_AGENT_FINALIZE_RETRY_PROMPT_PREFIX}\n\n${beforeFinalizeRevisionReason}`, true);
		retryState.compactionContinuationInstruction = null;
		log$3.warn(`before_agent_finalize requested one more pass: runId=${runParams.runId} sessionId=${runParams.sessionId} attempt=${retryState.beforeFinalizeRevisionAttempts}/3`);
		return { action: "retry" };
	}
	return completeEmbeddedRun({
		...input,
		payloadCount,
		payloadsForTerminalPath,
		emptyAssistantReplyIsSilent
	});
}
async function surfaceIncompleteTurn(input) {
	const replayInvalid = input.resolveReplayInvalid(input.text);
	const livenessState = resolveRunLivenessState({
		payloadCount: input.payloadCount,
		aborted: input.terminalAborted,
		timedOut: input.terminalTimedOut,
		attempt: input.attempt,
		incompleteTurnText: input.text
	});
	input.setTerminalLifecycleMeta({
		replayInvalid,
		livenessState
	});
	if (input.authProfileId) await input.maybeMarkAuthProfileFailure({
		profileId: input.authProfileId,
		reason: input.assistantProfileFailureReason,
		modelId: input.modelId
	});
	return {
		action: "complete",
		result: {
			payloads: [{
				text: input.terminalToolPresentation ? input.terminalToolPresentation.concat("\n\n", input.text) : input.text,
				isError: true
			}],
			meta: {
				durationMs: Date.now() - input.startedAtMs,
				agentMeta: input.agentMeta,
				aborted: input.terminalAborted,
				systemPromptReport: input.attempt.systemPromptReport,
				finalPromptText: input.attempt.finalPromptText,
				finalAssistantVisibleText: input.finalAssistantVisibleText,
				finalAssistantRawText: input.finalAssistantRawText,
				replayInvalid,
				livenessState,
				error: {
					kind: "incomplete_turn",
					message: "Agent couldn't generate a response.",
					fallbackSafe: input.incompleteTurnFallbackSafe,
					terminalPresentation: input.terminalToolPresentation !== void 0
				},
				toolSummary: input.attemptToolSummary,
				...input.failureSignal ? { failureSignal: input.failureSignal } : {},
				agentHarnessResultClassification: input.attempt.agentHarnessResultClassification
			},
			...copyAttemptDeliveryState(input.attempt)
		}
	};
}
function completeEmbeddedRun(input) {
	log$3.debug(`embedded run done: runId=${input.runParams.runId} sessionId=${input.runParams.sessionId} durationMs=${Date.now() - input.startedAtMs} aborted=${input.terminalAborted}`);
	markEmbeddedRunAuthProfileSuccess({
		authProfileStateMode: input.runParams.authProfileStateMode,
		profileId: input.authProfileId,
		profileStore: input.profileFailureStore,
		provider: input.provider,
		agentDir: input.runParams.agentDir,
		runId: input.runParams.runId,
		sessionId: input.runParams.sessionId
	});
	reportEmbeddedRunSuccessfulAuthBinding({
		profileId: input.authProfileId,
		profileStore: input.attemptAuthProfileStore,
		apiKeyInfo: input.apiKeyInfo,
		attempt: input.attempt,
		provider: input.provider,
		agentHarnessId: input.agentHarnessId,
		pluginHarnessOwnsTransport: input.pluginHarnessOwnsTransport,
		pluginHarnessOwnsAuthBootstrap: input.pluginHarnessOwnsAuthBootstrap,
		onSuccessfulAuthBinding: input.runParams.onSuccessfulAuthBinding
	});
	const replayInvalid = input.resolveReplayInvalid(null);
	const livenessState = input.attempt.yieldDetected ? "paused" : resolveRunLivenessState({
		payloadCount: input.payloadCount,
		aborted: input.terminalAborted,
		timedOut: input.terminalTimedOut,
		attempt: input.attempt,
		incompleteTurnText: null
	});
	const stopReason = input.attempt.clientToolCalls ? "tool_calls" : input.attempt.yieldDetected ? "end_turn" : input.attemptAssistant?.stopReason;
	const terminalPayloads = input.emptyAssistantReplyIsSilent ? [{ text: SILENT_REPLY_TOKEN }] : input.payloadsForTerminalPath;
	input.setTerminalLifecycleMeta({
		replayInvalid,
		livenessState,
		stopReason,
		yielded: input.attempt.yieldDetected === true
	});
	return {
		action: "complete",
		result: {
			payloads: terminalPayloads?.length ? terminalPayloads : void 0,
			...input.attempt.diagnosticTrace ? { diagnosticTrace: freezeDiagnosticTraceContext(input.attempt.diagnosticTrace) } : {},
			meta: {
				durationMs: Date.now() - input.startedAtMs,
				agentMeta: input.agentMeta,
				aborted: input.terminalAborted,
				systemPromptReport: input.attempt.systemPromptReport,
				finalPromptText: input.attempt.finalPromptText,
				finalAssistantVisibleText: input.finalAssistantVisibleText,
				finalAssistantRawText: input.finalAssistantRawText,
				replayInvalid,
				livenessState,
				agentHarnessResultClassification: input.attempt.agentHarnessResultClassification,
				...input.attempt.yieldDetected ? { yielded: true } : {},
				...input.emptyAssistantReplyIsSilent ? { terminalReplyKind: "silent-empty" } : {},
				stopReason,
				pendingToolCalls: input.attempt.clientToolCalls?.map((call) => ({
					id: randomBytes(5).toString("hex").slice(0, 9),
					name: call.name,
					arguments: JSON.stringify(call.params)
				})),
				executionTrace: {
					winnerProvider: input.reportedModelRef.provider,
					winnerModel: input.reportedModelRef.model,
					attempts: input.traceAttempts.length > 0 || input.attemptAssistant?.provider || input.attemptAssistant?.model ? [...input.traceAttempts, {
						provider: input.reportedModelRef.provider,
						model: input.reportedModelRef.model,
						result: "success",
						stage: "assistant"
					}] : void 0,
					fallbackUsed: input.traceAttempts.some(input.traceAttemptUsesFallback),
					runner: "embedded"
				},
				requestShaping: {
					...input.authProfileId ? { authMode: "auth-profile" } : {},
					...input.thinkLevel ? { thinking: input.thinkLevel } : {},
					...input.runParams.reasoningLevel ? { reasoning: input.runParams.reasoningLevel } : {},
					...input.runParams.verboseLevel ? { verbose: input.runParams.verboseLevel } : {},
					...input.runParams.blockReplyBreak ? { blockStreaming: input.runParams.blockReplyBreak } : {}
				},
				toolSummary: input.attemptToolSummary,
				...input.failureSignal ? { failureSignal: input.failureSignal } : {},
				completion: {
					...stopReason ? { stopReason } : {},
					...stopReason ? { finishReason: stopReason } : {},
					...stopReason?.toLowerCase().includes("refusal") ? { refusal: true } : {}
				},
				contextManagement: input.contextRecoveryState.autoCompactionCount > 0 ? { lastTurnCompactions: input.contextRecoveryState.autoCompactionCount } : void 0
			},
			...copyAttemptDeliveryState(input.attempt)
		}
	};
}
function copyAttemptDeliveryState(attempt) {
	return {
		latestMcpAppChannelView: attempt.latestMcpAppChannelView,
		didSendViaMessagingTool: attempt.didSendViaMessagingTool,
		didDeliverSourceReplyViaMessageTool: attempt.didDeliverSourceReplyViaMessageTool === true,
		didSendDeterministicApprovalPrompt: attempt.didSendDeterministicApprovalPrompt,
		messagingToolSentTexts: attempt.messagingToolSentTexts,
		messagingToolSentMediaUrls: attempt.messagingToolSentMediaUrls,
		messagingToolSentTargets: attempt.messagingToolSentTargets,
		messagingToolSourceReplyPayloads: attempt.messagingToolSourceReplyPayloads,
		heartbeatToolResponse: attempt.heartbeatToolResponse,
		successfulCronAdds: attempt.successfulCronAdds,
		acceptedSessionSpawns: attempt.acceptedSessionSpawns
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/terminal-timeout.ts
function resolveEmbeddedRunTerminalTimeout(input) {
	if (!input.timedOutDuringPrompt || input.hasSuccessfulFinalAssistantAfterPromptTimeout || !input.shouldSurfaceCodexCompletionTimeout && hasMessagingToolDeliveryEvidence(input.attempt)) return;
	const defaultTimeoutText = input.idleTimedOut ? "The model did not produce a response before the model idle timeout. Please try again, or increase `models.providers.<id>.timeoutSeconds` for slow local or self-hosted providers. If `agents.defaults.timeoutSeconds` or a run-specific timeout is lower, raise that ceiling too; provider timeouts cannot extend the whole agent run." : "Request timed out before a response was generated. Please try again, or increase `agents.defaults.timeoutSeconds` in your config.";
	const timeoutText = input.attempt.promptTimeoutOutcome?.message?.trim() || defaultTimeoutText;
	const replayInvalid = input.attempt.promptTimeoutOutcome?.replayInvalid ?? input.resolveReplayInvalid(null);
	const livenessState = input.attempt.promptTimeoutOutcome?.livenessState ?? resolveRunLivenessState({
		payloadCount: input.hasPartialAssistantTextAfterPromptTimeout ? 0 : input.payloads?.length ?? 0,
		aborted: input.terminalAborted,
		timedOut: input.terminalTimedOut,
		attempt: input.attempt,
		incompleteTurnText: null
	});
	const timeoutPhase = input.attempt.promptTimeoutOutcome?.timeoutPhase ?? input.terminalOutcome.timeoutPhase;
	const providerStarted = input.attempt.promptTimeoutOutcome?.providerStarted ?? input.terminalOutcome.providerStarted;
	const timeoutAttribution = {
		...timeoutPhase ? { timeoutPhase } : {},
		...typeof providerStarted === "boolean" ? { providerStarted } : {}
	};
	input.setTerminalLifecycleMeta({
		replayInvalid,
		livenessState,
		...timeoutAttribution
	});
	return {
		payloads: [...input.hasPartialAssistantTextAfterPromptTimeout ? [] : input.payloadsWithToolMedia || [], {
			text: timeoutText,
			isError: true
		}],
		meta: {
			durationMs: Date.now() - input.startedAtMs,
			agentMeta: input.agentMeta,
			aborted: input.terminalAborted,
			systemPromptReport: input.attempt.systemPromptReport,
			finalPromptText: input.attempt.finalPromptText,
			finalAssistantVisibleText: input.finalAssistantVisibleText,
			finalAssistantRawText: input.finalAssistantRawText,
			replayInvalid,
			livenessState,
			...timeoutAttribution,
			...input.shouldSurfaceCodexCompletionTimeout ? { error: {
				kind: "incomplete_turn",
				message: timeoutText,
				fallbackSafe: false
			} } : {},
			toolSummary: input.attemptToolSummary,
			...input.failureSignal ? { failureSignal: input.failureSignal } : {},
			agentHarnessResultClassification: input.attempt.agentHarnessResultClassification
		},
		...copyAttemptDeliveryState(input.attempt)
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run-loop.ts
/** Prepared embedded-agent loop and cleanup. */
async function runPreparedEmbeddedLoop(input) {
	const params = input.runParams;
	let { provider, modelId } = input;
	const { agentDir, workspaceDir: resolvedWorkspace, globalLane, hookRunner, hookContext: hookCtx, fallbackConfigured, isProbeSession, resolvedSessionKey, resolvedToolResultFormat, startedAtMs: started, startupStages, lifecycleGeneration, suspendForFailure } = input;
	const { maybeEmitFastModeAutoResetBestEffort, notifyExecutionPhase } = input.progressController;
	const { laneTaskAbortController } = input.laneController;
	let startupStagesEmitted = false;
	const preparedRuntime = await prepareEmbeddedRunRuntime({
		runParams: params,
		provider,
		modelId,
		agentDir,
		workspaceDir: resolvedWorkspace,
		globalLane,
		hookRunner,
		hookContext: hookCtx,
		markStartupStage: (stage) => startupStages.mark(stage),
		notifyExecutionPhase,
		fallbackConfigured,
		preparedModelRuntime: input.preparedModelRuntime
	});
	provider = preparedRuntime.provider;
	modelId = preparedRuntime.modelId;
	const { requestedModelId, model, attemptAuthProfileStore, profileCandidates, profileFailureStore, pluginHarnessOwnsAuthBootstrap, attemptedThinking, advanceAttemptAuthProfile, maybeRefreshRuntimeAuthForAuthError, stopRuntimeAuthRefreshTimer, getApiKeyInfo } = preparedRuntime;
	let { agentHarness, pluginHarnessOwnsTransport, effectiveModel, outerContextTokenMeta, thinkLevel, lastProfileId } = preparedRuntime.snapshot();
	const refreshPreparedRuntimeSnapshot = () => {
		({agentHarness, pluginHarnessOwnsTransport, effectiveModel, outerContextTokenMeta, thinkLevel, lastProfileId} = preparedRuntime.snapshot());
	};
	const traceAttempts = [];
	const traceAttemptUsesFallback = (attempt) => attempt.result === "rotate_profile" || attempt.result === "fallback_model";
	const resolveRuntimeFallbackReason = () => {
		return traceAttempts.findLast((attempt) => attempt.result === "fallback_model" && typeof attempt.reason === "string")?.reason ?? lastRetryFailoverReason ?? null;
	};
	const buildEmbeddedContextEngineRuntimeSettings = (settingsParams) => {
		const fallbackReason = resolveRuntimeFallbackReason();
		return buildContextEngineRuntimeSettings({
			contextEngineHost: OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
			provider,
			requestedModel: requestedModelId,
			resolvedModel: modelId,
			selectedContextEngineId: contextEngine.info.id,
			contextEngineSelectionSource: contextEngine.info.id === "legacy" ? "default" : "configured",
			promptTokenBudget: settingsParams.tokenBudget,
			maxOutputTokens: settingsParams.maxOutputTokens,
			fallbackReason,
			degradedReason: settingsParams.degradedReason
		});
	};
	const { sessionAgentId } = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId
	});
	const executionContract = isStrictAgenticExecutionContractActive({
		config: params.config,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		provider,
		modelId
	}) ? "strict-agentic" : "default";
	const maxReasoningOnlyRetryAttempts = 2;
	const maxEmptyResponseRetryAttempts = 1;
	const MAX_RUN_LOOP_ITERATIONS = resolveMaxRunRetryIterations(profileCandidates.length);
	const contextRecoveryState = createEmbeddedRunContextRecoveryState();
	let bootstrapPromptWarningSignaturesSeen = params.bootstrapPromptWarningSignaturesSeen ?? (params.bootstrapPromptWarningSignature ? [params.bootstrapPromptWarningSignature] : []);
	const usageAccumulator = createUsageAccumulator();
	let lastRunPromptUsage;
	let runLoopIterations = 0;
	let overloadProfileRotations = 0;
	const terminalRetryState = createEmbeddedRunTerminalRetryState();
	let sameModelIdleTimeoutRetries = 0;
	const idleTimeoutBreakerState = createIdleTimeoutBreakerState();
	const postCompactionGuard = createPostCompactionLoopGuard({ enabled: resolveToolLoopDetectionConfig({
		cfg: params.config,
		agentId: sessionAgentId
	})?.enabled !== false });
	let postCompactionAbortController;
	let postCompactionAbortError;
	const attemptTerminalToolPresentation = {
		ordinal: -1,
		value: void 0
	};
	let nextToolOutcomeOrdinal = 0;
	const allocateToolOutcomeOrdinal = () => nextToolOutcomeOrdinal++;
	const readAttemptTerminalToolPresentation = () => attemptTerminalToolPresentation.value;
	const observeToolOutcome = (observation) => {
		const observationOrdinal = observation.toolCallOrdinal ?? attemptTerminalToolPresentation.ordinal + 1;
		if (observationOrdinal >= attemptTerminalToolPresentation.ordinal) {
			attemptTerminalToolPresentation.ordinal = observationOrdinal;
			attemptTerminalToolPresentation.value = observation.terminalPresentation;
		}
		if (observation.presentationOnly) return;
		const verdict = postCompactionGuard.observe(observation);
		if (verdict.shouldAbort) {
			postCompactionAbortError ??= PostCompactionLoopPersistedError.fromVerdict(verdict);
			laneTaskAbortController.abort(postCompactionAbortError);
			postCompactionAbortController?.abort(postCompactionAbortError);
		}
	};
	let lastRetryFailoverReason = null;
	let codexAppServerRecoveryRetries = 0;
	let emptyErrorRetries = 0;
	const sessionPromptState = createEmbeddedRunSessionPromptState({
		runParams: params,
		sessionAgentId,
		resolvedSessionKey,
		lifecycleGeneration
	});
	const failoverRetryController = createEmbeddedRunFailoverRetryController({
		runParams: params,
		provider,
		modelId,
		globalLane,
		agentDir,
		fallbackConfigured,
		profileFailureStore,
		getLastProfileId: () => preparedRuntime.snapshot().lastProfileId,
		getSessionId: () => sessionPromptState.sessionId,
		harnessOwnsTransport: () => preparedRuntime.snapshot().pluginHarnessOwnsTransport
	});
	ensureContextEnginesInitialized();
	const contextEngine = await resolveContextEngine(params.config, {
		agentDir,
		workspaceDir: resolvedWorkspace
	});
	const resolveContextEnginePluginId = () => resolveContextEngineOwnerPluginId(contextEngine);
	startupStages.mark("context-engine");
	notifyExecutionPhase("context_engine", {
		provider,
		model: modelId
	});
	try {
		const compactionRuntime = createEmbeddedRunCompactionRuntime({
			runParams: params,
			contextEngine,
			hookRunner,
			hookContext: hookCtx,
			sessionPromptState
		});
		let authRetryPending = false;
		let accumulatedReplayState = createEmbeddedRunReplayState();
		let latestMcpAppChannelView;
		let lastTurnTotal;
		while (true) {
			refreshPreparedRuntimeSnapshot();
			if (runLoopIterations >= MAX_RUN_LOOP_ITERATIONS) {
				const message = `Exceeded retry limit after ${runLoopIterations} attempts (max=${MAX_RUN_LOOP_ITERATIONS}).`;
				log$3.error(`[run-retry-limit] sessionKey=${params.sessionKey ?? params.sessionId} provider=${provider}/${modelId} attempts=${runLoopIterations} maxAttempts=${MAX_RUN_LOOP_ITERATIONS}`);
				return handleRetryLimitExhaustion({
					message,
					decision: resolveRunFailoverDecision({
						stage: "retry_limit",
						fallbackConfigured,
						failoverReason: lastRetryFailoverReason
					}),
					provider,
					model: modelId,
					profileId: lastProfileId,
					durationMs: Date.now() - started,
					agentMeta: buildErrorAgentMeta({
						sessionId: sessionPromptState.sessionId,
						sessionFile: sessionPromptState.sessionFile,
						provider,
						model: model.id,
						...outerContextTokenMeta,
						usageAccumulator,
						lastRunPromptUsage,
						lastTurnTotal
					}),
					replayInvalid: accumulatedReplayState.replayInvalid ? true : void 0,
					livenessState: "blocked"
				});
			}
			runLoopIterations += 1;
			const runtimeAuthRetry = authRetryPending;
			authRetryPending = false;
			attemptedThinking.add(thinkLevel);
			const codexAppServerRecoveryRetryAvailable = hasCodexAppServerRecoveryRetryBudget({
				alreadyRetried: codexAppServerRecoveryRetries > 0,
				runLoopIterations,
				maxRunLoopIterations: MAX_RUN_LOOP_ITERATIONS
			});
			const dispatch = await prepareAndDispatchEmbeddedRunAttempt({
				runInput: input,
				preparedRuntime,
				contextEngine,
				sessionPromptState,
				terminalRetryState,
				replayState: accumulatedReplayState,
				provider,
				modelId,
				startupStagesEmitted,
				bootstrapPromptWarningSignaturesSeen,
				resolveRuntimeFallbackReason,
				observeToolOutcome,
				allocateToolOutcomeOrdinal,
				getPostCompactionAbortError: () => postCompactionAbortError,
				setPostCompactionAbortController: (controller) => {
					postCompactionAbortController = controller;
				},
				clearPostCompactionAbortController: (controller) => {
					if (postCompactionAbortController === controller) postCompactionAbortController = void 0;
				}
			});
			startupStagesEmitted = dispatch.startupStagesEmitted;
			const { dispatchedAttempt, runtimePlan } = dispatch;
			const normalizedAttempt = await normalizeEmbeddedRunAttempt({
				runInput: input,
				preparedRuntime,
				dispatchedAttempt,
				sessionPromptState,
				provider,
				modelId,
				bootstrapPromptWarningSignaturesSeen,
				usageAccumulator,
				lastRunPromptUsage,
				lastTurnTotal,
				idleTimeoutBreakerState,
				contextRecoveryState,
				replayState: accumulatedReplayState,
				lastRetryFailoverReason
			});
			if (normalizedAttempt.action === "complete") return normalizedAttempt.result;
			if (normalizedAttempt.action === "retry") {
				bootstrapPromptWarningSignaturesSeen = normalizedAttempt.bootstrapPromptWarningSignaturesSeen;
				lastRunPromptUsage = normalizedAttempt.lastRunPromptUsage;
				lastTurnTotal = normalizedAttempt.lastTurnTotal;
				accumulatedReplayState = normalizedAttempt.replayState;
				continue;
			}
			bootstrapPromptWarningSignaturesSeen = normalizedAttempt.bootstrapPromptWarningSignaturesSeen;
			lastRunPromptUsage = normalizedAttempt.lastRunPromptUsage;
			lastTurnTotal = normalizedAttempt.lastTurnTotal;
			accumulatedReplayState = normalizedAttempt.replayState;
			const { attempt, aborted, externalAbort, promptError, timedOut, idleTimedOut, timedOutDuringCompaction, timedOutDuringToolExecution, timedOutByRunBudget, sessionIdUsed, sessionFileUsed, currentAttemptAssistant, currentAttemptCompletedAssistant, attemptAssistant, terminalOutcome, terminalAborted, terminalTimedOut, terminalInterrupted, signalOwnedInterruption, setTerminalLifecycleMeta, attemptCompactionCount, activeErrorContext, resolveReplayInvalidForAttempt, canRestartForLiveSwitch } = normalizedAttempt;
			latestMcpAppChannelView = attempt.latestMcpAppChannelView ?? latestMcpAppChannelView;
			attempt.latestMcpAppChannelView = latestMcpAppChannelView;
			const recovery = await recoverEmbeddedRunAttempt({
				runInput: input,
				preparedRuntime,
				normalizedAttempt,
				runtimePlan,
				sessionPromptState,
				failoverRetryController,
				compactionRuntime,
				contextEngine,
				contextRecoveryState,
				resolveContextEnginePluginId,
				buildRuntimeSettings: buildEmbeddedContextEngineRuntimeSettings,
				armPostCompactionGuard: () => postCompactionGuard.armPostCompaction(),
				usageAccumulator,
				lastRunPromptUsage,
				lastTurnTotal,
				runtimeAuthRetry,
				codexAppServerRecoveryRetryAvailable,
				codexAppServerRecoveryRetries,
				lastRetryFailoverReason,
				traceAttempts,
				sessionAgentId
			});
			if (recovery.action === "complete") return recovery.result;
			if (recovery.action === "retry") {
				thinkLevel = recovery.thinkLevel;
				authRetryPending = recovery.authRetryPending;
				codexAppServerRecoveryRetries = recovery.codexAppServerRecoveryRetries;
				lastRetryFailoverReason = recovery.lastRetryFailoverReason;
				continue;
			}
			const { shouldSurfaceCodexCompletionTimeout } = recovery;
			const assistantFailureOutcome = await handleEmbeddedAssistantFailure({
				runParams: params,
				attempt,
				attemptAssistant,
				currentAttemptAssistant,
				terminalProviderStarted: terminalOutcome.providerStarted === true,
				terminalInterrupted,
				promptError,
				activeErrorContext,
				provider,
				modelId,
				model: model.id,
				thinkLevel,
				getThinkLevel: () => preparedRuntime.snapshot().thinkLevel,
				attemptedThinking,
				timedOut,
				idleTimedOut,
				timedOutDuringCompaction,
				timedOutDuringToolExecution,
				timedOutByRunBudget,
				signalOwnedInterruption,
				externalAbort,
				aborted,
				fallbackConfigured,
				pluginHarnessOwnsTransport,
				canRestartForLiveSwitch,
				authProfileId: lastProfileId,
				authProfileStore: attemptAuthProfileStore,
				runtimeAuthRetry,
				maybeRefreshRuntimeAuthForAuthError,
				resolveAuthProfileFailureReason: failoverRetryController.resolveAuthProfileFailureReason,
				emptyErrorRetries,
				overloadProfileRotations,
				overloadProfileRotationLimit: failoverRetryController.overloadProfileRotationLimit,
				rateLimitProfileRotations: failoverRetryController.rateLimitProfileRotations,
				rateLimitProfileRotationLimit: failoverRetryController.rateLimitProfileRotationLimit,
				sameModelIdleTimeoutRetries,
				previousRetryFailoverReason: lastRetryFailoverReason,
				maybeMarkAuthProfileFailure: failoverRetryController.maybeMarkAuthProfileFailure,
				maybeEscalateRateLimitProfileFallback: failoverRetryController.maybeEscalateRateLimitProfileFallback,
				maybeRetrySameModelRateLimit: failoverRetryController.maybeRetrySameModelRateLimit,
				maybeBackoffBeforeOverloadFailover: failoverRetryController.maybeBackoffBeforeOverloadFailover,
				advanceAttemptAuthProfile,
				traceAttempts,
				suspendForFailure,
				suspensionSessionId: sessionPromptState.sessionId ?? params.sessionId,
				agentDir,
				isProbeSession
			});
			thinkLevel = assistantFailureOutcome.thinkLevel;
			preparedRuntime.setThinkLevel(thinkLevel);
			authRetryPending = assistantFailureOutcome.authRetryPending;
			emptyErrorRetries = assistantFailureOutcome.emptyErrorRetries;
			overloadProfileRotations = assistantFailureOutcome.overloadProfileRotations;
			sameModelIdleTimeoutRetries = assistantFailureOutcome.sameModelIdleTimeoutRetries;
			lastRetryFailoverReason = assistantFailureOutcome.lastRetryFailoverReason;
			if (!assistantFailureOutcome.preserveSameModelRateLimitRetryCount) failoverRetryController.resetSameModelRateLimitRetries();
			if (assistantFailureOutcome.action === "retry") continue;
			const assistantProfileFailureReason = assistantFailureOutcome.assistantProfileFailureReason;
			const { agentMeta, reportedModelRef, finalAssistantVisibleText, finalAssistantRawText, payloads, payloadsWithToolMedia, timedOutDuringPrompt, recoveredFinalAssistantPayloadsAfterPromptTimeout, hasSuccessfulFinalAssistantAfterPromptTimeout, hasPartialAssistantTextAfterPromptTimeout, attemptToolSummary, failureSignal } = prepareEmbeddedRunTerminal({
				runParams: params,
				attempt,
				currentAttemptCompletedAssistant,
				provider,
				model: model.id,
				activeErrorContext,
				authProfileStore: attemptAuthProfileStore,
				authProfileId: lastProfileId,
				sessionIdUsed,
				sessionFileUsed,
				outerContextTokenMeta,
				usageAccumulator,
				lastRunPromptUsage,
				lastTurnTotal,
				contextRecoveryState,
				resolvedToolResultFormat,
				terminalInterrupted,
				terminalTimedOut,
				timedOutDuringCompaction,
				timedOutDuringToolExecution
			});
			const terminalTimeoutResult = resolveEmbeddedRunTerminalTimeout({
				timedOutDuringPrompt,
				hasSuccessfulFinalAssistantAfterPromptTimeout,
				shouldSurfaceCodexCompletionTimeout,
				idleTimedOut,
				attempt,
				hasPartialAssistantTextAfterPromptTimeout,
				payloads,
				payloadsWithToolMedia,
				terminalAborted,
				terminalTimedOut,
				terminalOutcome,
				resolveReplayInvalid: resolveReplayInvalidForAttempt,
				setTerminalLifecycleMeta,
				startedAtMs: started,
				agentMeta,
				finalAssistantVisibleText,
				finalAssistantRawText,
				attemptToolSummary,
				failureSignal
			});
			if (terminalTimeoutResult) return terminalTimeoutResult;
			const terminalResolution = await resolveEmbeddedRunTerminal({
				runParams: params,
				retryState: terminalRetryState,
				attempt,
				attemptAssistant,
				activeErrorContext,
				modelApi: effectiveModel.api,
				executionContract,
				terminalAborted,
				terminalTimedOut,
				terminalInterrupted,
				externalAbort,
				signalOwnedInterruption,
				promptError,
				payloadsWithToolMedia,
				recoveredFinalAssistantPayloadsAfterPromptTimeout,
				finalAssistantVisibleText,
				finalAssistantRawText,
				agentMeta,
				attemptToolSummary,
				failureSignal,
				maxReasoningOnlyRetryAttempts,
				maxEmptyResponseRetryAttempts,
				attemptCompactionCount,
				replayState: accumulatedReplayState,
				activePromptPersisted: sessionPromptState.activePrompt.persisted,
				activateInternalPrompt: sessionPromptState.activateInternalPrompt,
				setSuppressNextUserMessagePersistence: (value) => {
					sessionPromptState.suppressNextUserMessagePersistence = value;
				},
				armPostCompactionGuard: () => postCompactionGuard.armPostCompaction(),
				readTerminalToolPresentation: readAttemptTerminalToolPresentation,
				resolveReplayInvalid: resolveReplayInvalidForAttempt,
				setTerminalLifecycleMeta,
				maybeMarkAuthProfileFailure: failoverRetryController.maybeMarkAuthProfileFailure,
				assistantProfileFailureReason,
				startedAtMs: started,
				provider,
				modelId,
				authProfileId: lastProfileId,
				profileFailureStore,
				attemptAuthProfileStore,
				apiKeyInfo: getApiKeyInfo(),
				agentHarnessId: agentHarness.id,
				pluginHarnessOwnsTransport,
				pluginHarnessOwnsAuthBootstrap,
				reportedModelRef,
				traceAttempts,
				traceAttemptUsesFallback,
				thinkLevel,
				contextRecoveryState
			});
			if (terminalResolution.action === "retry") continue;
			return terminalResolution.result;
		}
	} finally {
		if (params.isFinalFallbackAttempt !== false) await maybeEmitFastModeAutoResetBestEffort();
		forgetPromptBuildDrainCacheForRun(params.runId);
		stopRuntimeAuthRefreshTimer();
		await runAgentCleanupStep({
			runId: params.runId,
			sessionId: params.sessionId,
			step: "context-engine-dispose",
			log: log$3,
			cleanup: async () => {
				await contextEngine.dispose?.();
			}
		});
		if (params.cleanupBundleMcpOnRunEnd === true) await runAgentCleanupStep({
			runId: params.runId,
			sessionId: params.sessionId,
			step: "bundle-mcp-retire",
			log: log$3,
			cleanup: async () => {
				const onError = (errorLocal, sessionId) => {
					log$3.warn(`bundle-mcp cleanup failed after run for ${sessionId}: ${formatErrorMessage(errorLocal)}`);
				};
				if (!await retireSessionMcpRuntimeForSessionKey({
					sessionKey: params.sessionKey,
					reason: "embedded-run-end",
					preserveActiveLeases: true,
					onError
				})) await retireSessionMcpRuntime({
					sessionId: params.sessionId,
					reason: "embedded-run-end",
					preserveActiveLeases: true,
					onError
				});
			}
		});
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/run-execution.ts
/** Runs one fully prepared embedded-agent request. */
function executePreparedEmbeddedRun(input) {
	return runPreparedEmbeddedLoop(input);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/execution-phase-diagnostics.ts
/**
* Wraps params.onExecutionPhase so every phase transition also emits a
* run.execution_phase diagnostic event. Applied once at the runner entry;
* downstream call sites all read the forwarded callback. Session compaction
* can rotate the session id mid-run, so the wrapper tracks the current id via
* onSessionIdChanged instead of capturing the initial value. The returned
* params always carry both callbacks (the wrapper installs them), so callers
* can invoke them unconditionally.
*/
function withExecutionPhaseDiagnostics(params) {
	const forwardPhase = params.onExecutionPhase;
	const forwardSessionIdChanged = params.onSessionIdChanged;
	let currentSessionId = params.sessionId;
	const onSessionIdChanged = (sessionId) => {
		currentSessionId = sessionId;
		forwardSessionIdChanged?.(sessionId);
	};
	const onExecutionPhase = (info) => {
		if (areDiagnosticsEnabledForProcess()) emitDiagnosticEvent({
			type: "run.execution_phase",
			runId: params.runId,
			sessionId: currentSessionId,
			sessionKey: params.sessionKey,
			...info
		});
		forwardPhase?.(info);
	};
	return {
		...params,
		onExecutionPhase,
		onSessionIdChanged
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/fallbacks.ts
/**
* Resolves whether this embedded run has any model fallback path available.
* Per-run overrides are authoritative so compaction/replay callers can force
* either a fallback lane or a no-fallback lane independent of agent defaults.
*/
function hasEmbeddedRunConfiguredModelFallbacks(params) {
	if (params.modelFallbacksOverride !== void 0) return params.modelFallbacksOverride.length > 0;
	return hasConfiguredModelFallbacks({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run/lane-controller.ts
function createEmbeddedRunLaneController(options) {
	const initialParams = options.getParams();
	const sessionQueuePriority = resolveEmbeddedRunSessionQueuePriority(initialParams.trigger);
	const laneTaskTimeoutMs = resolveEmbeddedRunLaneTimeoutMs(initialParams.timeoutMs);
	const laneTaskAbortController = new AbortController();
	const laneTaskReleaseController = new AbortController();
	let laneTaskProgressAtMs = Date.now();
	const noteLaneTaskProgress = () => {
		laneTaskProgressAtMs = Date.now();
	};
	const throwIfAborted = () => {
		const params = options.getParams();
		if (!params.abortSignal?.aborted) return;
		const reason = params.abortSignal.reason;
		if (reason instanceof Error) throw reason;
		const abortError = reason !== void 0 ? new Error("Operation aborted", { cause: reason }) : /* @__PURE__ */ new Error("Operation aborted");
		abortError.name = "AbortError";
		throw abortError;
	};
	const withLaneTimeout = (opts) => withEmbeddedRunLaneTimeout({
		...opts,
		taskTimeoutProgressAtMs: () => laneTaskProgressAtMs,
		taskTimeoutAbortSignal: laneTaskAbortController.signal,
		taskTimeoutAbortGraceMs: EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS,
		taskTimeoutReleaseSignal: laneTaskReleaseController.signal
	}, laneTaskTimeoutMs);
	const withRunLaneWait = (opts) => {
		const params = options.getParams();
		if (!opts?.onWait && !params.onLaneWait) return opts;
		return {
			...opts,
			onWait: (waitMs, queuedAhead) => {
				opts?.onWait?.(waitMs, queuedAhead);
				options.getParams().onLaneWait?.({
					waitMs,
					queuedAhead,
					waiting: true
				});
			}
		};
	};
	const noteLaneWaitIfBusy = (lane) => {
		const params = options.getParams();
		if (!params.onLaneWait) return;
		const snapshot = getCommandLaneSnapshot(lane);
		if (snapshot.queuedCount > 0 || snapshot.activeCount >= snapshot.maxConcurrent) params.onLaneWait({
			waitMs: 0,
			queuedAhead: snapshot.queuedCount + snapshot.activeCount,
			waiting: true
		});
	};
	const enqueueGlobal = (task, opts) => {
		const globalOpts = {
			...opts,
			priority: sessionQueuePriority
		};
		const taskWithCurrentLifecycle = async () => {
			let params = options.getParams();
			params.onLaneWait?.({
				waitMs: 0,
				queuedAhead: 0,
				waiting: false
			});
			throwIfAborted();
			let lifecycleGeneration = options.getLifecycleGeneration();
			const currentLifecycleGeneration = getAgentEventLifecycleGeneration();
			const existingContext = getAgentRunContext(params.runId);
			if (lifecycleGeneration !== currentLifecycleGeneration) {
				const wasQueuedBeforeRotation = options.initialQueuedLifecycleGeneration === lifecycleGeneration;
				const canResumeAcrossRotation = sessionQueuePriority === "foreground";
				const newerSameIdExecutionOwnsContext = existingContext?.lifecycleGeneration === currentLifecycleGeneration;
				if (!wasQueuedBeforeRotation || !canResumeAcrossRotation || newerSameIdExecutionOwnsContext) assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
				lifecycleGeneration = currentLifecycleGeneration;
				options.setLifecycleGeneration(lifecycleGeneration);
				params = {
					...params,
					lifecycleGeneration
				};
				options.setParams(params);
			}
			assertAgentHarnessRunAdmission(params);
			return await withAgentRunLifecycleGeneration(lifecycleGeneration, () => withSessionPlacementTurnAdmission({
				sessionId: params.sessionId,
				...params.agentId ? { agentId: params.agentId } : {},
				...params.sessionKey ? { sessionKey: params.sessionKey } : {},
				runId: params.runId
			}, params, () => {
				claimAgentRunContext(params.runId, {
					...existingContext,
					sessionKey: params.sessionKey ?? existingContext?.sessionKey,
					sessionId: params.sessionId ?? existingContext?.sessionId,
					lifecycleGeneration
				});
				return task();
			}));
		};
		const params = options.getParams();
		if (params.enqueue) return params.enqueue(taskWithCurrentLifecycle, withLaneTimeout(withRunLaneWait(globalOpts)));
		noteLaneWaitIfBusy(options.globalLane);
		return enqueueCommandInLane(options.globalLane, taskWithCurrentLifecycle, withLaneTimeout(withRunLaneWait(globalOpts)));
	};
	const enqueueSession = (task, opts) => {
		const sessionOpts = {
			...opts,
			priority: sessionQueuePriority
		};
		const taskWithLaneAdmission = () => {
			options.getParams().onLaneWait?.({
				waitMs: 0,
				queuedAhead: 0,
				waiting: false
			});
			return task();
		};
		const params = options.getParams();
		if (params.enqueue) return params.enqueue(taskWithLaneAdmission, withRunLaneWait(sessionOpts));
		noteLaneWaitIfBusy(options.sessionLane);
		return enqueueCommandInLane(options.sessionLane, taskWithLaneAdmission, withRunLaneWait(sessionOpts));
	};
	return {
		enqueueGlobal,
		enqueueSession,
		laneTaskAbortController,
		laneTaskReleaseController,
		noteLaneTaskProgress,
		throwIfAborted
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/prepared-runtime-context.ts
/** Rebinds every config-derived run projection to one committed prepared generation. */
function bindRunToPreparedModelRuntime(params) {
	const preparedAgentId = params.preparedModelRuntime.agentId ?? params.requestedWorkspaceResolution.agentId;
	const workspaceResolution = {
		...params.requestedWorkspaceResolution,
		agentId: preparedAgentId,
		workspaceDir: params.preparedModelRuntime.workspaceDir ?? params.requestedWorkspaceResolution.workspaceDir
	};
	return {
		runParams: {
			...params.runParams,
			agentId: preparedAgentId,
			agentDir: params.preparedModelRuntime.agentDir,
			config: params.preparedModelRuntime.config,
			workspaceDir: workspaceResolution.workspaceDir
		},
		workspaceResolution
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/progress-controller.ts
function createEmbeddedRunProgressController(params) {
	const fastModeStartedAtMs = params.attempt.fastModeStartedAtMs ?? params.startedAtMs;
	const fastModeAutoOnSeconds = params.attempt.fastModeAutoOnSeconds ?? resolveFastModeModelAutoOnSeconds({
		cfg: params.attempt.config,
		provider: params.attempt.provider,
		model: params.attempt.model
	});
	const fastModeAutoProgressState = params.attempt.fastModeAutoProgressState ?? {
		offAnnounced: false,
		resetAnnounced: false
	};
	const notifyExecutionPhase = (phase, extra) => {
		params.noteLaneTaskProgress();
		params.attempt.onExecutionPhase?.({
			phase,
			...extra
		});
	};
	const notifyRunProgress = (info) => {
		params.noteLaneTaskProgress();
		params.attempt.onRunProgress?.(info);
	};
	const emitFastModeAutoProgress = async (payload) => {
		const summary = formatFastModeAutoProgressText(payload);
		try {
			emitAgentItemEvent({
				runId: params.attempt.runId,
				...params.attempt.sessionKey ? { sessionKey: params.attempt.sessionKey } : {},
				data: {
					itemId: `fast-mode-auto:${payload.enabled ? "on" : "off"}`,
					kind: "status",
					title: "Fast",
					phase: "update",
					status: "running",
					summary
				}
			});
		} catch (error) {
			log$3.debug(`embedded run fast mode auto global event failed: ${formatErrorMessage(error)}`);
		}
		try {
			await params.attempt.onAgentEvent?.({
				stream: "item",
				data: {
					kind: "status",
					title: "Fast",
					phase: "update",
					summary
				},
				...params.attempt.sessionKey ? { sessionKey: params.attempt.sessionKey } : {}
			});
		} catch (error) {
			log$3.debug(`embedded run fast mode auto event failed: ${formatErrorMessage(error)}`);
		}
		try {
			await params.attempt.onToolResult?.({
				text: summary,
				channelData: { openclawProgressKind: FAST_MODE_AUTO_PROGRESS_KIND }
			});
		} catch (error) {
			log$3.debug(`embedded run fast mode auto progress failed: ${formatErrorMessage(error)}`);
		}
	};
	const maybeAnnounceFastModeAutoOff = async () => {
		if (params.attempt.fastMode !== "auto" || fastModeAutoProgressState.offAnnounced) return;
		const next = resolveFastModeForElapsed({
			mode: "auto",
			startedAtMs: fastModeStartedAtMs,
			fastAutoOnSeconds: fastModeAutoOnSeconds
		});
		if (next.enabled) return;
		fastModeAutoProgressState.offAnnounced = true;
		await emitFastModeAutoProgress(next);
	};
	const notifyToolResult = async (payload) => {
		await params.attempt.onToolResult?.(payload);
	};
	const notifyAgentEvent = async (event) => {
		await params.attempt.onAgentEvent?.(event);
	};
	const resolveAttemptFastMode = () => {
		const resolved = resolveFastModeForElapsed({
			mode: params.attempt.fastMode,
			startedAtMs: fastModeStartedAtMs,
			fastAutoOnSeconds: fastModeAutoOnSeconds
		});
		return resolved.mode === void 0 ? void 0 : resolved.enabled;
	};
	const resolveAttemptFastModeParam = () => {
		if (params.attempt.fastMode === "auto") return resolveAttemptFastMode;
		return resolveAttemptFastMode();
	};
	const maybeEmitFastModeAutoReset = async () => {
		if (params.attempt.fastMode !== "auto" || !fastModeAutoProgressState.offAnnounced || fastModeAutoProgressState.resetAnnounced) return;
		fastModeAutoProgressState.resetAnnounced = true;
		await emitFastModeAutoProgress({
			enabled: true,
			elapsedSeconds: 0,
			fastAutoOnSeconds: fastModeAutoOnSeconds
		});
	};
	const maybeEmitFastModeAutoResetBestEffort = async () => {
		try {
			await maybeEmitFastModeAutoReset();
		} catch (error) {
			log$3.warn(`embedded run fast mode auto reset progress failed: ${formatErrorMessage(error)}`);
		}
	};
	return {
		fastModeAutoOnSeconds,
		fastModeAutoProgressState,
		fastModeStartedAtMs,
		maybeAnnounceFastModeAutoOff,
		maybeEmitFastModeAutoResetBestEffort,
		notifyAgentEvent,
		notifyExecutionPhase,
		notifyRunProgress,
		notifyToolResult,
		resolveAttemptFastModeParam
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/recovery-message-action-capability.ts
/** Reconstructs a one-run action capability from host-only restart correlation. */
function createRecoveryMessageActionTurnCapability(params) {
	const sourceTurnId = readChannelSourceTurnId(params);
	const sourceChannel = normalizeMessageChannel(params.messageProvider ?? params.messageChannel);
	if (params.messageActionTurnCapability || !sourceTurnId || !sourceChannel || !isTrustedMessageActionTurnIngress(sourceChannel) || !params.agentId || !params.sessionKey || !params.currentChannelId) return;
	return mintMessageActionTurnCapability({
		agentId: params.agentId,
		runId: params.runId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		requesterAccountId: params.agentAccountId,
		requesterSenderId: params.senderId ?? void 0,
		toolContext: {
			currentChannelId: params.currentChannelId,
			currentChatType: params.chatType,
			currentMessagingTarget: params.messageTo,
			currentChannelProvider: sourceChannel,
			currentThreadTs: params.currentThreadTs,
			currentSourceTurnId: sourceTurnId,
			replyToMode: params.replyToMode,
			hasRepliedRef: params.hasRepliedRef,
			sameChannelThreadRequired: readChannelSourceTurnSameThreadRequired(params)
		},
		...resolveMessageActionTurnCapabilityLifetime(params.timeoutMs)
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run-orchestrator.ts
/**
* Embedded-agent run orchestration implementation.
*/
const EMPTY_EMBEDDED_AGENT_CONFIG = Object.freeze({});
function runEmbeddedAgent(paramsInput) {
	const internalParamsInput = paramsInput;
	const requestedProvider = normalizeOptionalString(internalParamsInput.provider);
	const requestedModel = normalizeOptionalString(internalParamsInput.model);
	const needsConfiguredDefault = !internalParamsInput.config && !requestedProvider && !requestedModel;
	const config = internalParamsInput.config ?? (needsConfiguredDefault ? getRuntimeConfigSnapshot() ?? void 0 : void 0);
	const lifecycleGeneration = internalParamsInput.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(internalParamsInput.runId);
	return withAgentRunLifecycleGeneration(lifecycleGeneration, () => runEmbeddedAgentInternal({
		...internalParamsInput,
		config,
		lifecycleGeneration
	}));
}
async function runEmbeddedAgentInternal(paramsInput) {
	const paramsBase = applyAgentRunSessionTargetIdentity(paramsInput);
	const skillWorkshopProposalMutationBudget = paramsBase.skillWorkshopProposalOnly ? paramsBase.skillWorkshopProposalMutationBudget ?? { remaining: 1 } : void 0;
	let lifecycleGeneration = paramsBase.lifecycleGeneration;
	const queuedLifecycleGeneration = getAgentEventLifecycleGeneration();
	const effectiveSessionKey = backfillSessionKey({
		config: paramsBase.config,
		sessionId: paramsBase.sessionId,
		sessionKey: paramsBase.sessionKey,
		agentId: paramsBase.agentId
	});
	assertAgentHarnessRunAdmission({
		...paramsBase,
		sessionKey: effectiveSessionKey
	});
	const runSessionTarget = await resolveAgentRunSessionTarget({
		...paramsBase,
		sessionKey: effectiveSessionKey
	});
	let params = withExecutionPhaseDiagnostics({
		...paramsBase,
		agentId: paramsBase.agentId ?? runSessionTarget.agentId,
		sessionId: runSessionTarget.sessionId,
		sessionKey: normalizeOptionalString(effectiveSessionKey ?? runSessionTarget.sessionKey),
		sessionFile: runSessionTarget.sessionFile,
		skillWorkshopProposalMutationBudget
	});
	const sessionLane = resolveSessionLane(params.sessionKey?.trim() || params.sessionId);
	const globalLane = resolveGlobalLane(params.lane);
	const failureSuspension = resolveSessionSuspensionTarget();
	const suspendForFailure = (suspensionParams) => {
		const suspension = {
			...suspensionParams,
			laneId: globalLane
		};
		if (failureSuspension.mode === "defer") {
			failureSuspension.defer(suspension);
			return;
		}
		suspendSession(suspension);
	};
	const laneController = createEmbeddedRunLaneController({
		getLifecycleGeneration: () => lifecycleGeneration,
		getParams: () => params,
		globalLane,
		initialQueuedLifecycleGeneration: queuedLifecycleGeneration,
		sessionLane,
		setLifecycleGeneration: (generation) => {
			lifecycleGeneration = generation;
		},
		setParams: (nextParams) => {
			params = nextParams;
		}
	});
	const { enqueueGlobal, enqueueSession, noteLaneTaskProgress, throwIfAborted } = laneController;
	const channelHint = params.messageChannel ?? params.messageProvider;
	const resolvedToolResultFormat = params.toolResultFormat ?? (channelHint ? isMarkdownCapableMessageChannel(channelHint) ? "markdown" : "plain" : "markdown");
	const isProbeSession = params.sessionId?.startsWith("probe-") ?? false;
	throwIfAborted();
	const recoveryMessageActionTurnCapability = createRecoveryMessageActionTurnCapability(params);
	if (recoveryMessageActionTurnCapability) params = {
		...params,
		messageActionTurnCapability: recoveryMessageActionTurnCapability
	};
	return enqueueSession(async () => {
		throwIfAborted();
		params.replyOperation?.markWaitingForDeferredMaintenance();
		try {
			await waitForDeferredTurnMaintenanceForSession(params.sessionKey);
		} finally {
			params.replyOperation?.markDeferredMaintenanceWaitEnded();
		}
		throwIfAborted();
		return enqueueGlobal(async () => {
			throwIfAborted();
			const cliDispatched = await runEmbeddedAgentViaCliBackendIfEligible(params);
			if (cliDispatched) return cliDispatched;
			const started = Date.now();
			const startupStages = createEmbeddedRunStageTracker();
			const requestedWorkspaceResolution = resolveRunWorkspaceDir({
				workspaceDir: params.workspaceDir,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				config: params.config
			});
			const config = params.config ?? EMPTY_EMBEDDED_AGENT_CONFIG;
			const requestedAgentDir = params.agentDir ?? resolveAgentDir(config, requestedWorkspaceResolution.agentId);
			const retainIdleRunOwner = params.config === void 0;
			const preparedModelRuntimeLease = await acquireAgentRunPreparedModelRuntime({
				config,
				agentId: requestedWorkspaceResolution.agentId,
				agentDir: requestedAgentDir,
				inheritedAuthDir: resolveDefaultAgentDir(config),
				workspaceDir: requestedWorkspaceResolution.workspaceDir,
				preserveWorkspaceDirOnRefresh: !requestedWorkspaceResolution.isCanonicalWorkspace
			}, { retainIdleRunOwner });
			const preparedModelRuntime = preparedModelRuntimeLease.snapshot;
			try {
				const rebound = bindRunToPreparedModelRuntime({
					runParams: params,
					requestedWorkspaceResolution,
					preparedModelRuntime
				});
				params = rebound.runParams;
				const workspaceResolution = rebound.workspaceResolution;
				const preparedAgentId = workspaceResolution.agentId;
				const resolvedWorkspace = workspaceResolution.workspaceDir;
				const agentDir = preparedModelRuntime.agentDir;
				const progressController = createEmbeddedRunProgressController({
					attempt: params,
					noteLaneTaskProgress,
					startedAtMs: started
				});
				const { notifyExecutionPhase } = progressController;
				const emitStartupStageSummary = createEmbeddedRunStageSummaryEmitter({
					label: "startup stages",
					log: log$3,
					runId: params.runId,
					sessionId: params.sessionId,
					tracker: startupStages
				});
				params.onExecutionStarted?.({ lifecycleGeneration });
				notifyExecutionPhase("runner_entered");
				const isCanonicalWorkspace = resolveUserPath(resolveAgentWorkspaceDir(preparedModelRuntime.config, preparedAgentId)) === resolvedWorkspace;
				const redactedSessionId = redactRunIdentifier(params.sessionId);
				const redactedSessionKey = redactRunIdentifier(params.sessionKey);
				const redactedWorkspace = redactRunIdentifier(resolvedWorkspace);
				if (requestedWorkspaceResolution.usedFallback) log$3.warn(`[workspace-fallback] caller=runEmbeddedAgent reason=${requestedWorkspaceResolution.fallbackReason} run=${params.runId} session=${redactedSessionId} sessionKey=${redactedSessionKey} agent=${preparedAgentId} workspace=${redactedWorkspace}`);
				startupStages.mark("workspace");
				notifyExecutionPhase("workspace");
				ensureRuntimePluginsLoaded({
					config: preparedModelRuntime.config,
					workspaceDir: resolvedWorkspace,
					...params.allowGatewaySubagentBinding !== void 0 ? { allowGatewaySubagentBinding: params.allowGatewaySubagentBinding } : {}
				});
				startupStages.mark("runtime-plugins");
				notifyExecutionPhase("runtime_plugins");
				const { provider, modelId } = resolveInitialEmbeddedRunModel({
					config: params.config,
					agentId: workspaceResolution.agentId,
					provider: params.provider,
					model: params.model
				});
				const normalizedSessionKey = params.sessionKey?.trim();
				const fallbackConfigured = hasEmbeddedRunConfiguredModelFallbacks({
					cfg: params.config,
					agentId: params.agentId,
					sessionKey: normalizedSessionKey,
					modelFallbacksOverride: params.modelFallbacksOverride
				});
				const resolvedSessionKey = normalizedSessionKey ?? params.sessionTarget?.sessionKey ?? params.sessionId;
				const hookRunner = getGlobalHookRunner();
				const hookCtx = {
					runId: params.runId,
					jobId: params.jobId,
					agentId: workspaceResolution.agentId,
					sessionKey: resolvedSessionKey,
					sessionId: params.sessionId,
					workspaceDir: resolvedWorkspace,
					modelProviderId: provider,
					modelId,
					trigger: params.trigger,
					...buildAgentHookContextChannelFields(params),
					...buildAgentHookContextIdentityFields({
						trigger: params.trigger,
						senderId: params.senderId,
						chatId: params.chatId,
						channelContext: params.channelContext
					})
				};
				const hookResult = await runBeforeAgentReplyForTurn({
					runId: params.runId,
					trigger: params.trigger,
					event: { cleanedBody: params.prompt },
					context: hookCtx,
					onDispatch: () => notifyExecutionPhase("before_agent_reply", {
						provider,
						model: modelId
					}),
					onDeclined: () => notifyExecutionPhase("runtime_plugins", {
						provider,
						model: modelId
					})
				});
				if (hookResult?.handled) return {
					payloads: buildHandledBeforeAgentReplyPayloads(hookResult.reply),
					meta: {
						durationMs: Date.now() - started,
						agentMeta: {
							sessionId: params.sessionId,
							provider,
							model: modelId
						},
						finalAssistantVisibleText: hookResult.reply?.text ?? "NO_REPLY",
						finalAssistantRawText: hookResult.reply?.text ?? "NO_REPLY"
					}
				};
				return await executePreparedEmbeddedRun({
					runParams: params,
					provider,
					modelId,
					agentDir,
					workspaceResolution,
					workspaceDir: resolvedWorkspace,
					isCanonicalWorkspace,
					globalLane,
					hookRunner,
					hookContext: hookCtx,
					fallbackConfigured,
					isProbeSession,
					resolvedSessionKey,
					resolvedToolResultFormat,
					startedAtMs: started,
					startupStages,
					emitStartupStageSummary,
					progressController,
					laneController,
					lifecycleGeneration,
					suspendForFailure,
					preparedModelRuntime
				});
			} finally {
				preparedModelRuntimeLease.release();
			}
		});
	}).finally(() => {
		revokeMessageActionTurnCapability(recoveryMessageActionTurnCapability);
	});
}
//#endregion
export { formatAuthProfileFailureMessage as n, compactEmbeddedAgentSession as r, runEmbeddedAgent as t };
