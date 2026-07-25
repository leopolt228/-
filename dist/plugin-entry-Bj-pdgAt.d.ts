import { $i as PluginControlUiDescriptor$1, A as OpenClawPluginSecurityAuditContext$1, Ac as ProviderAuthContext$1, B as OpenClawPluginCommandDefinition$1, Bc as ProviderReplayPolicy$1, Bn as MigrationItem$1, Cc as ProviderResolveDynamicModelContext$1, D as OpenClawPluginNodeInvokePolicyResult$1, Dc as ProviderAppGuidedSetup$1, E as OpenClawPluginNodeInvokePolicyContext$1, Ec as ProviderUsageAuthToken$1, F as OpenClawPluginGatewayEventScope$1, Gc as ProviderToolSchemaDiagnostic$1, H as PluginCommandResult$1, Hc as ProviderReplaySessionEntry$1, Hn as MigrationProviderContext$1, I as OpenClawPluginGatewayEvents$1, Ji as ProviderResolveConfigApiKeyContext$1, Kc as ProviderValidateReplayTurnsContext$1, Ki as ProviderApplyConfigDefaultsContext$1, L as AgentPromptGuidance$1, Lc as ProviderNormalizeToolSchemasContext$1, M as OpenClawPluginServiceContext$1, Mc as ProviderAuthMethodNonInteractiveContext$1, Nc as ProviderAuthResult$1, O as OpenClawPluginReloadRegistration$1, Oc as ProviderAppGuidedSetupCandidate$1, Pc as ProviderDeferSyntheticProfileAuthContext$1, Qi as PluginAgentEventSubscriptionRegistration$1, Qr as MediaUnderstandingProviderPlugin$1, R as AgentPromptGuidanceEntry$1, Rc as ProviderReasoningOutputMode$1, Rn as MigrationApplyResult$1, S as OpenClawPluginHttpRouteHandler$1, Sc as ProviderPreparedRuntimeAuth$1, T as OpenClawPluginNodeInvokePolicy$1, Tc as ProviderResolvedUsageAuth$1, Uc as ProviderReplaySessionState$1, Ui as OpenClawPluginNodeHostCommand$1, Un as MigrationProviderPlugin$1, V as PluginCommandContext$1, Vc as ProviderReplayPolicyContext$1, Vn as MigrationPlan$1, Wc as ProviderSanitizeReplayHistoryContext$1, Wi as OpenClawPluginNodeHostCommandAvailabilityContext$1, Wn as MigrationSummary$1, Xi as PluginAgentEventEmitParams$1, Yi as PluginLogger$1, Zi as PluginAgentEventEmitResult$1, _c as ProviderNormalizeResolvedModelContext$1, a as ProviderPlugin$1, aa as PluginSessionActionResult$1, ac as ProviderBuildMissingAuthMessageContext$1, ai as WorkerLease$1, as as OpenClawPluginToolFactory$1, bc as ProviderPrepareExtraParamsContext$1, c as ProviderBuiltInModelSuppressionResult$1, ca as PluginSessionExtensionProjection$1, cc as ProviderFailoverErrorContext$1, ci as WorkerProvider$1, d as ProviderModernModelPolicyContext$1, da as PluginSessionSchedulerJobRegistration$1, dc as ProviderTransportTurnState$1, di as WorkerSshIdentity$1, ea as PluginRunContextGetParams$1, ei as RealtimeTranscriptionProviderPlugin$1, fa as PluginSessionTurnScheduleParams$1, fc as ProviderWebSocketSessionPolicy$1, fi as WorkerSshIdentityRequest$1, g as OpenClawGatewayDiscoveryService$1, ga as PluginTrustedToolPolicyRegistration$1, gc as ProviderNormalizeModelIdContext$1, h as OpenClawGatewayDiscoveryAdvertiseContext$1, ha as PluginToolMetadataRegistration$1, hc as ProviderFetchUsageSnapshotContext$1, ia as PluginSessionActionRegistration$1, is as OpenClawPluginToolContext$1, j as OpenClawPluginService$1, jc as ProviderAuthMethod$1, k as OpenClawPluginSecurityAuditCollector$1, ka as AgentHarness$1, kc as ProviderAppGuidedSetupContext$1, l as ProviderCatalogContext$1, la as PluginSessionExtensionRegistration$1, lc as ProviderResolveTransportTurnStateContext$1, m as UnifiedModelCatalogProviderPlugin$1, ma as PluginSessionTurnUnscheduleByTagResult$1, mc as ProviderAuthDoctorHintContext$1, n as OpenClawPluginConfigSchema$1, na as PluginRuntimeLifecycleRegistration$1, ni as SpeechProviderPlugin$1, o as ProviderAugmentModelCatalogContext$1, oa as PluginSessionAttachmentParams$1, oc as ProviderBuildUnknownModelHintContext$1, oi as WorkerLeaseStatus$1, p as UnifiedModelCatalogProviderContext$1, pa as PluginSessionTurnUnscheduleByTagParams$1, pc as ProviderWrapStreamFnContext$1, qi as ProviderNormalizeConfigContext$1, r as OpenClawPluginApi$1, ra as PluginSessionActionContext$1, ri as TranscriptSourceProvider$1, s as ProviderBuiltInModelSuppressionContext$1, sa as PluginSessionAttachmentResult$1, sc as ProviderCacheTtlEligibilityContext$1, si as WorkerProfile$1, t as OpenClawPluginDefinition$1, ta as PluginRunContextPatch$1, u as ProviderCatalogResult$1, ua as PluginSessionSchedulerJobHandle$1, uc as ProviderResolveWebSocketSessionPolicyContext$1, ui as WorkerSshEndpoint$1, vc as ProviderNormalizeTransportContext$1, wc as ProviderResolveUsageAuthContext$1, xc as ProviderPrepareRuntimeAuthContext$1, yc as ProviderPrepareDynamicModelContext$1, z as AgentPromptSurfaceKind$1, zc as ProviderReasoningOutputModeContext$1, zn as MigrationDetection$1 } from "./types-Bi5Leigi.js";
import { dt as PluginHeartbeatPromptContributionEvent$1, ft as PluginHeartbeatPromptContributionResult$1, gt as PluginJsonValue$1, ht as PluginNextTurnInjectionRecord$1, lt as PluginAgentTurnPrepareEvent$1, mt as PluginNextTurnInjectionEnqueueResult$1, pt as PluginNextTurnInjection$1, ut as PluginAgentTurnPrepareResult$1 } from "./hook-types-Y_WIyhXM.js";
import { n as AnyAgentTool$1 } from "./common-B6rw6aZ3.js";
import { n as ProviderThinkingPolicyContext$1, r as ProviderThinkingProfile$1, t as ProviderDefaultThinkingPolicyContext$1 } from "./provider-thinking.types-DhIiOz1Q.js";

//#region src/plugin-sdk/plugin-entry.d.ts
type AgentHarness = AgentHarness$1;
type AgentPromptGuidance = AgentPromptGuidance$1;
type AgentPromptGuidanceEntry = AgentPromptGuidanceEntry$1;
type AgentPromptSurfaceKind = AgentPromptSurfaceKind$1;
type AnyAgentTool = AnyAgentTool$1;
type MediaUnderstandingProviderPlugin = MediaUnderstandingProviderPlugin$1;
type MigrationApplyResult = MigrationApplyResult$1;
type MigrationDetection = MigrationDetection$1;
type MigrationItem = MigrationItem$1;
type MigrationPlan = MigrationPlan$1;
type MigrationProviderContext = MigrationProviderContext$1;
type MigrationProviderPlugin = MigrationProviderPlugin$1;
type ProviderPlugin = ProviderPlugin$1;
type MigrationSummary = MigrationSummary$1;
type OpenClawGatewayDiscoveryAdvertiseContext = OpenClawGatewayDiscoveryAdvertiseContext$1;
type OpenClawGatewayDiscoveryService = OpenClawGatewayDiscoveryService$1;
type OpenClawPluginApi = OpenClawPluginApi$1;
type OpenClawPluginCommandDefinition = OpenClawPluginCommandDefinition$1;
type OpenClawPluginConfigSchema = OpenClawPluginConfigSchema$1;
type OpenClawPluginDefinition = OpenClawPluginDefinition$1;
type OpenClawPluginHttpRouteHandler = OpenClawPluginHttpRouteHandler$1;
type OpenClawPluginNodeHostCommand = OpenClawPluginNodeHostCommand$1;
type OpenClawPluginNodeHostCommandAvailabilityContext = OpenClawPluginNodeHostCommandAvailabilityContext$1;
type OpenClawPluginNodeInvokePolicy = OpenClawPluginNodeInvokePolicy$1;
type OpenClawPluginNodeInvokePolicyContext = OpenClawPluginNodeInvokePolicyContext$1;
type OpenClawPluginNodeInvokePolicyResult = OpenClawPluginNodeInvokePolicyResult$1;
type OpenClawPluginReloadRegistration = OpenClawPluginReloadRegistration$1;
type OpenClawPluginSecurityAuditCollector = OpenClawPluginSecurityAuditCollector$1;
type OpenClawPluginSecurityAuditContext = OpenClawPluginSecurityAuditContext$1;
type OpenClawPluginService = OpenClawPluginService$1;
type OpenClawPluginServiceContext = OpenClawPluginServiceContext$1;
type OpenClawPluginToolContext = OpenClawPluginToolContext$1;
type OpenClawPluginToolFactory = OpenClawPluginToolFactory$1;
type PluginAgentEventEmitParams = PluginAgentEventEmitParams$1;
type PluginAgentEventEmitResult = PluginAgentEventEmitResult$1;
type PluginAgentEventSubscriptionRegistration = PluginAgentEventSubscriptionRegistration$1;
type PluginAgentTurnPrepareEvent = PluginAgentTurnPrepareEvent$1;
type PluginAgentTurnPrepareResult = PluginAgentTurnPrepareResult$1;
type PluginCommandContext = PluginCommandContext$1;
type PluginCommandResult = PluginCommandResult$1;
type PluginControlUiDescriptor = PluginControlUiDescriptor$1;
type PluginHeartbeatPromptContributionEvent = PluginHeartbeatPromptContributionEvent$1;
type PluginHeartbeatPromptContributionResult = PluginHeartbeatPromptContributionResult$1;
type PluginJsonValue = PluginJsonValue$1;
type PluginLogger = PluginLogger$1;
type PluginNextTurnInjection = PluginNextTurnInjection$1;
type PluginNextTurnInjectionEnqueueResult = PluginNextTurnInjectionEnqueueResult$1;
type PluginNextTurnInjectionRecord = PluginNextTurnInjectionRecord$1;
type PluginRunContextGetParams = PluginRunContextGetParams$1;
type PluginRunContextPatch = PluginRunContextPatch$1;
type PluginRuntimeLifecycleRegistration = PluginRuntimeLifecycleRegistration$1;
type PluginSessionActionContext = PluginSessionActionContext$1;
type PluginSessionActionRegistration = PluginSessionActionRegistration$1;
type PluginSessionActionResult = PluginSessionActionResult$1;
type PluginSessionAttachmentParams = PluginSessionAttachmentParams$1;
type PluginSessionAttachmentResult = PluginSessionAttachmentResult$1;
type PluginSessionExtensionProjection = PluginSessionExtensionProjection$1;
type PluginSessionExtensionRegistration = PluginSessionExtensionRegistration$1;
type PluginSessionSchedulerJobHandle = PluginSessionSchedulerJobHandle$1;
type PluginSessionSchedulerJobRegistration = PluginSessionSchedulerJobRegistration$1;
type PluginSessionTurnScheduleParams = PluginSessionTurnScheduleParams$1;
type PluginSessionTurnUnscheduleByTagParams = PluginSessionTurnUnscheduleByTagParams$1;
type PluginSessionTurnUnscheduleByTagResult = PluginSessionTurnUnscheduleByTagResult$1;
type PluginToolMetadataRegistration = PluginToolMetadataRegistration$1;
type PluginTrustedToolPolicyRegistration = PluginTrustedToolPolicyRegistration$1;
type ProviderApplyConfigDefaultsContext = ProviderApplyConfigDefaultsContext$1;
type ProviderAugmentModelCatalogContext = ProviderAugmentModelCatalogContext$1;
type ProviderAuthContext = ProviderAuthContext$1;
type ProviderAuthDoctorHintContext = ProviderAuthDoctorHintContext$1;
type ProviderAuthMethod = ProviderAuthMethod$1;
type ProviderAuthMethodNonInteractiveContext = ProviderAuthMethodNonInteractiveContext$1;
type ProviderAppGuidedSetup = ProviderAppGuidedSetup$1;
type ProviderAppGuidedSetupCandidate = ProviderAppGuidedSetupCandidate$1;
type ProviderAppGuidedSetupContext = ProviderAppGuidedSetupContext$1;
type ProviderAuthResult = ProviderAuthResult$1;
type ProviderBuildMissingAuthMessageContext = ProviderBuildMissingAuthMessageContext$1;
type ProviderBuildUnknownModelHintContext = ProviderBuildUnknownModelHintContext$1;
type ProviderBuiltInModelSuppressionContext = ProviderBuiltInModelSuppressionContext$1;
type ProviderBuiltInModelSuppressionResult = ProviderBuiltInModelSuppressionResult$1;
type ProviderCacheTtlEligibilityContext = ProviderCacheTtlEligibilityContext$1;
type ProviderCatalogContext = ProviderCatalogContext$1;
type ProviderCatalogResult = ProviderCatalogResult$1;
type ProviderDefaultThinkingPolicyContext = ProviderDefaultThinkingPolicyContext$1;
type ProviderDeferSyntheticProfileAuthContext = ProviderDeferSyntheticProfileAuthContext$1;
type ProviderFailoverErrorContext = ProviderFailoverErrorContext$1;
type ProviderFetchUsageSnapshotContext = ProviderFetchUsageSnapshotContext$1;
type ProviderModernModelPolicyContext = ProviderModernModelPolicyContext$1;
type ProviderNormalizeConfigContext = ProviderNormalizeConfigContext$1;
type ProviderNormalizeModelIdContext = ProviderNormalizeModelIdContext$1;
type ProviderNormalizeResolvedModelContext = ProviderNormalizeResolvedModelContext$1;
type ProviderNormalizeToolSchemasContext = ProviderNormalizeToolSchemasContext$1;
type ProviderNormalizeTransportContext = ProviderNormalizeTransportContext$1;
type ProviderPrepareDynamicModelContext = ProviderPrepareDynamicModelContext$1;
type ProviderPrepareExtraParamsContext = ProviderPrepareExtraParamsContext$1;
type ProviderPrepareRuntimeAuthContext = ProviderPrepareRuntimeAuthContext$1;
type ProviderPreparedRuntimeAuth = ProviderPreparedRuntimeAuth$1;
type ProviderReasoningOutputMode = ProviderReasoningOutputMode$1;
type ProviderReasoningOutputModeContext = ProviderReasoningOutputModeContext$1;
type ProviderReplayPolicy = ProviderReplayPolicy$1;
type ProviderReplayPolicyContext = ProviderReplayPolicyContext$1;
type ProviderReplaySessionEntry = ProviderReplaySessionEntry$1;
type ProviderReplaySessionState = ProviderReplaySessionState$1;
type ProviderResolveConfigApiKeyContext = ProviderResolveConfigApiKeyContext$1;
type ProviderResolveDynamicModelContext = ProviderResolveDynamicModelContext$1;
type ProviderResolveTransportTurnStateContext = ProviderResolveTransportTurnStateContext$1;
type ProviderResolveUsageAuthContext = ProviderResolveUsageAuthContext$1;
type ProviderResolveWebSocketSessionPolicyContext = ProviderResolveWebSocketSessionPolicyContext$1;
type ProviderResolvedUsageAuth = ProviderResolvedUsageAuth$1;
type ProviderSanitizeReplayHistoryContext = ProviderSanitizeReplayHistoryContext$1;
type ProviderThinkingPolicyContext = ProviderThinkingPolicyContext$1;
type ProviderThinkingProfile = ProviderThinkingProfile$1;
type ProviderToolSchemaDiagnostic = ProviderToolSchemaDiagnostic$1;
type ProviderTransportTurnState = ProviderTransportTurnState$1;
type ProviderUsageAuthToken = ProviderUsageAuthToken$1;
type ProviderValidateReplayTurnsContext = ProviderValidateReplayTurnsContext$1;
type ProviderWebSocketSessionPolicy = ProviderWebSocketSessionPolicy$1;
type ProviderWrapStreamFnContext = ProviderWrapStreamFnContext$1;
type RealtimeTranscriptionProviderPlugin = RealtimeTranscriptionProviderPlugin$1;
type SpeechProviderPlugin = SpeechProviderPlugin$1;
type TranscriptSourceProvider = TranscriptSourceProvider$1;
type UnifiedModelCatalogProviderContext = UnifiedModelCatalogProviderContext$1;
type UnifiedModelCatalogProviderPlugin = UnifiedModelCatalogProviderPlugin$1;
type WorkerLease = WorkerLease$1;
type WorkerLeaseStatus = WorkerLeaseStatus$1;
type WorkerProfile = WorkerProfile$1;
type WorkerProvider = WorkerProvider$1;
type WorkerSshEndpoint = WorkerSshEndpoint$1;
type WorkerSshIdentity = WorkerSshIdentity$1;
type WorkerSshIdentityRequest = WorkerSshIdentityRequest$1;
type OpenClawPluginGatewayEventScope = OpenClawPluginGatewayEventScope$1;
type OpenClawPluginGatewayEvents = OpenClawPluginGatewayEvents$1;
/** Options for a plugin entry that registers providers, tools, commands, or services. */
type DefinePluginEntryOptions = {
  id: string;
  name: string;
  description: string;
  /**
   * @deprecated Declare exclusive plugin kind in `openclaw.plugin.json` via
   * manifest `kind`. Runtime-entry `kind` remains only as a compatibility
   * fallback for older plugins.
   */
  kind?: OpenClawPluginDefinition["kind"];
  configSchema?: OpenClawPluginConfigSchema | (() => OpenClawPluginConfigSchema);
  reload?: OpenClawPluginDefinition["reload"];
  nodeHostCommands?: OpenClawPluginDefinition["nodeHostCommands"];
  securityAuditCollectors?: OpenClawPluginDefinition["securityAuditCollectors"];
  register: (api: OpenClawPluginApi) => void;
};
/** Normalized object shape that OpenClaw loads from a plugin entry module. */
type DefinedPluginEntry = {
  id: string;
  name: string;
  description: string;
  configSchema: OpenClawPluginConfigSchema;
  register: NonNullable<OpenClawPluginDefinition["register"]>;
} & Pick<OpenClawPluginDefinition, "kind" | "reload" | "nodeHostCommands" | "securityAuditCollectors">;
/**
 * Canonical entry helper for non-channel plugins.
 *
 * Use this for provider, tool, command, service, memory, and context-engine
 * plugins. Channel plugins should use `defineChannelPluginEntry(...)` from
 * `openclaw/plugin-sdk/core` so they inherit the channel capability wiring.
 */
declare function definePluginEntry({
  id,
  name,
  description,
  kind,
  configSchema,
  reload,
  nodeHostCommands,
  securityAuditCollectors,
  register
}: DefinePluginEntryOptions): DefinedPluginEntry;
//#endregion
export { PluginSessionActionContext as $, ProviderResolveTransportTurnStateContext as $t, OpenClawPluginSecurityAuditContext as A, ProviderDefaultThinkingPolicyContext as At, PluginCommandContext as B, ProviderPlugin as Bt, OpenClawPluginNodeHostCommand as C, WorkerSshIdentityRequest as Cn, ProviderBuildMissingAuthMessageContext as Ct, OpenClawPluginNodeInvokePolicyResult as D, ProviderCacheTtlEligibilityContext as Dt, OpenClawPluginNodeInvokePolicyContext as E, ProviderBuiltInModelSuppressionResult as Et, PluginAgentEventEmitParams as F, ProviderNormalizeConfigContext as Ft, PluginJsonValue as G, ProviderReasoningOutputMode as Gt, PluginControlUiDescriptor as H, ProviderPrepareExtraParamsContext as Ht, PluginAgentEventEmitResult as I, ProviderNormalizeModelIdContext as It, PluginNextTurnInjectionEnqueueResult as J, ProviderReplayPolicyContext as Jt, PluginLogger as K, ProviderReasoningOutputModeContext as Kt, PluginAgentEventSubscriptionRegistration as L, ProviderNormalizeResolvedModelContext as Lt, OpenClawPluginServiceContext as M, ProviderFailoverErrorContext as Mt, OpenClawPluginToolContext as N, ProviderFetchUsageSnapshotContext as Nt, OpenClawPluginReloadRegistration as O, ProviderCatalogContext as Ot, OpenClawPluginToolFactory as P, ProviderModernModelPolicyContext as Pt, PluginRuntimeLifecycleRegistration as Q, ProviderResolveDynamicModelContext as Qt, PluginAgentTurnPrepareEvent as R, ProviderNormalizeToolSchemasContext as Rt, OpenClawPluginHttpRouteHandler as S, WorkerSshIdentity as Sn, ProviderAuthResult as St, OpenClawPluginNodeInvokePolicy as T, ProviderBuiltInModelSuppressionContext as Tt, PluginHeartbeatPromptContributionEvent as U, ProviderPrepareRuntimeAuthContext as Ut, PluginCommandResult as V, ProviderPrepareDynamicModelContext as Vt, PluginHeartbeatPromptContributionResult as W, ProviderPreparedRuntimeAuth as Wt, PluginRunContextGetParams as X, ProviderReplaySessionState as Xt, PluginNextTurnInjectionRecord as Y, ProviderReplaySessionEntry as Yt, PluginRunContextPatch as Z, ProviderResolveConfigApiKeyContext as Zt, OpenClawPluginCommandDefinition as _, WorkerLease as _n, ProviderAugmentModelCatalogContext as _t, AnyAgentTool as a, ProviderThinkingProfile as an, PluginSessionExtensionRegistration as at, OpenClawPluginGatewayEventScope as b, WorkerProvider as bn, ProviderAuthMethod as bt, MigrationDetection as c, ProviderUsageAuthToken as cn, PluginSessionTurnScheduleParams as ct, MigrationProviderContext as d, ProviderWrapStreamFnContext as dn, PluginToolMetadataRegistration as dt, ProviderResolveUsageAuthContext as en, PluginSessionActionRegistration as et, MigrationProviderPlugin as f, RealtimeTranscriptionProviderPlugin as fn, PluginTrustedToolPolicyRegistration as ft, OpenClawPluginApi as g, UnifiedModelCatalogProviderPlugin as gn, ProviderApplyConfigDefaultsContext as gt, OpenClawGatewayDiscoveryService as h, UnifiedModelCatalogProviderContext as hn, ProviderAppGuidedSetupContext as ht, AgentPromptSurfaceKind as i, ProviderThinkingPolicyContext as in, PluginSessionExtensionProjection as it, OpenClawPluginService as j, ProviderDeferSyntheticProfileAuthContext as jt, OpenClawPluginSecurityAuditCollector as k, ProviderCatalogResult as kt, MigrationItem as l, ProviderValidateReplayTurnsContext as ln, PluginSessionTurnUnscheduleByTagParams as lt, OpenClawGatewayDiscoveryAdvertiseContext as m, TranscriptSourceProvider as mn, ProviderAppGuidedSetupCandidate as mt, AgentPromptGuidance as n, ProviderResolvedUsageAuth as nn, PluginSessionAttachmentParams as nt, MediaUnderstandingProviderPlugin as o, ProviderToolSchemaDiagnostic as on, PluginSessionSchedulerJobHandle as ot, MigrationSummary as p, SpeechProviderPlugin as pn, ProviderAppGuidedSetup as pt, PluginNextTurnInjection as q, ProviderReplayPolicy as qt, AgentPromptGuidanceEntry as r, ProviderSanitizeReplayHistoryContext as rn, PluginSessionAttachmentResult as rt, MigrationApplyResult as s, ProviderTransportTurnState as sn, PluginSessionSchedulerJobRegistration as st, AgentHarness as t, ProviderResolveWebSocketSessionPolicyContext as tn, PluginSessionActionResult as tt, MigrationPlan as u, ProviderWebSocketSessionPolicy as un, PluginSessionTurnUnscheduleByTagResult as ut, OpenClawPluginConfigSchema as v, WorkerLeaseStatus as vn, ProviderAuthContext as vt, OpenClawPluginNodeHostCommandAvailabilityContext as w, definePluginEntry as wn, ProviderBuildUnknownModelHintContext as wt, OpenClawPluginGatewayEvents as x, WorkerSshEndpoint as xn, ProviderAuthMethodNonInteractiveContext as xt, OpenClawPluginDefinition as y, WorkerProfile as yn, ProviderAuthDoctorHintContext as yt, PluginAgentTurnPrepareResult as z, ProviderNormalizeTransportContext as zt };