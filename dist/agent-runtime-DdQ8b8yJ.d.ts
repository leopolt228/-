import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { t as FastMode } from "./string-coerce-DJnd-JG-.js";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-Dw9i7sK6.js";
import { n as RuntimeEnv } from "./runtime-DRcp7-j9.js";
import { Gr as CliSessionBindingFacts, Is as AgentInternalEvent, Js as AgentStreamParams, Xs as BootstrapContextRunKind, Yc as EmbeddedAgentRunMeta, Ys as ClientToolDefinition, Zc as MessagingToolSend, Zs as ExecElevatedDefaults } from "./types-Bi5Leigi.js";
import { g as SourceReplyDeliveryMode } from "./types-D43pE80v.js";
import { c as PromptImageOrderEntry } from "./types-BBQnzy9U.js";
import { n as UserTurnTranscriptRecorder, r as InputProvenance, t as UserTurnInput } from "./user-turn-transcript.types-CKMcFFg2.js";
import { h as PluginHookChannelContext } from "./templating-CzGprbNA.js";
import { t as RuntimePluginToolGrant } from "./tool-grant-BSRz7IOf.js";
import { t as PromptMode } from "./system-prompt.types-DK8-zL3a.js";
import { t as ModelCatalogEntry } from "./model-catalog.types-cokHDhLz.js";
import { C as ChannelOutboundTargetMode } from "./types.core-Di2R8WTy.js";
import { c as projectOutboundPayloadPlanForJson } from "./deliver-BQZVrxCL.js";
import { t as CliDeps } from "./deps.types-BdV6g6qp.js";
import { t as LoadPreparedModelCatalogParams } from "./prepared-model-catalog-_dTFJGqN.js";
import { i as SerializedDurableMessagePayloadOutcome } from "./runtime-BD2-iO24.js";
//#region src/agents/auth-profiles/path-resolve.d.ts
/** Resolve the user-facing auth profile database path. */
declare function resolveAuthStorePathForDisplay(agentDir?: string): string;
//#endregion
//#region src/agents/identity-avatar.d.ts
type AgentAvatarResolution = {
  kind: "none";
  reason: string;
  source?: string;
} | {
  kind: "local";
  filePath: string;
  source: string;
} | {
  kind: "remote";
  url: string;
  source: string;
} | {
  kind: "data";
  url: string;
  source: string;
};
/** Resolve the effective avatar for an agent, including config and IDENTITY.md. */
declare function resolveAgentAvatar(cfg: OpenClawConfig, agentId: string, opts?: {
  includeUiOverride?: boolean;
}): AgentAvatarResolution;
//#endregion
//#region src/agents/spawned-context.d.ts
type SpawnedRunMetadata = {
  spawnedBy?: string | null;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  workspaceDir?: string | null;
};
//#endregion
//#region src/agents/main-session-recovery-types.d.ts
type MainSessionRecoveryOwnerClaim = {
  cycleId: string;
  lifecycleGeneration: string;
  claimId: string;
  sessionId: string;
  sessionKey: string;
  runId?: string;
};
//#endregion
//#region src/agents/main-session-recovery-store.d.ts
type MainSessionRecoveryStoreTarget = {
  sessionKey: string;
  storePath: string;
};
type MainSessionRecoveryOwnerLease = MainSessionRecoveryOwnerClaim & MainSessionRecoveryStoreTarget;
//#endregion
//#region src/agents/command/types.d.ts
/** Image content block for Claude API multimodal messages. */
type ImageContent = {
  type: "image";
  data: string;
  mimeType: string;
};
/** Metadata overrides for trusted internal agent command callers. */
type AgentCommandResultMetaOverrides = {
  transport?: "embedded";
  fallbackFrom?: "gateway";
  fallbackReason?: "gateway_timeout" | "gateway_closed";
  fallbackSessionId?: string;
  fallbackSessionKey?: string;
  fallback?: {
    reason: "gateway_timeout" | "gateway_closed";
    requestedSessionKey: string | null;
    sessionKey: string;
  };
};
/** ACP turn source markers accepted by trusted command callsites. */
type AcpTurnSource = "manual_spawn";
/** Channel/account/thread context carried into an agent run. */
type AgentRunContext = {
  messageChannel?: string;
  accountId?: string;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  currentChannelId?: string; /** Transport-native chat/conversation ID for plugin hook identity context. */
  chatId?: string; /** Channel-specific sender/chat metadata for plugin hook identity context. */
  channelContext?: PluginHookChannelContext;
  currentThreadTs?: string;
  currentInboundAudio?: boolean;
  senderId?: string | null;
  replyToMode?: "off" | "first" | "all" | "batched";
  hasRepliedRef?: {
    value: boolean;
  };
};
/** Full trusted option surface for running an agent command. */
type AgentCommandOpts = {
  message: string; /** User-visible transcript body; defaults to message and excludes runtime-only context. */
  transcriptMessage?: string; /** Durable media metadata for the user-visible transcript turn. */
  transcriptMedia?: UserTurnInput["media"]; /** Optional image attachments for multimodal messages. */
  images?: ImageContent[]; /** Original inline/offloaded attachment order for inbound images. */
  imageOrder?: PromptImageOrderEntry[]; /** Optional client-provided tools (OpenResponses hosted tools). */
  clientTools?: ClientToolDefinition[]; /** Agent id override (must exist in config). */
  agentId?: string; /** Per-run provider override. */
  provider?: string; /** Per-run model override. */
  model?: string;
  to?: string;
  sessionId?: string;
  sessionKey?: string;
  thinking?: string;
  thinkingOnce?: string;
  verbose?: string;
  json?: boolean;
  timeout?: string;
  deliver?: boolean; /** Override delivery target (separate from session routing). */
  replyTo?: string; /** Override delivery channel (separate from session routing). */
  replyChannel?: string; /** Override delivery account id (separate from session routing). */
  replyAccountId?: string; /** Override delivery thread/topic id (separate from session routing). */
  threadId?: string | number; /** Message channel context. */
  messageChannel?: string; /** Tool-policy/output surface context. Defaults to messageChannel. */
  messageProvider?: string; /** Delivery channel. */
  channel?: string; /** Account ID for multi-account channel routing. */
  accountId?: string; /** Context for embedded run routing (channel/account/thread). */
  runContext?: AgentRunContext; /** Device-scoped operator session allowed to review approvals initiated by this run. */
  approvalReviewerDeviceId?: string; /** Internal trusted exec approval follow-up elevated defaults. */
  bashElevated?: ExecElevatedDefaults; /** Trusted sender identity bit for command/channel-action auth; defaults true for local CLI calls. */
  senderIsOwner?: boolean; /** Whether this caller is authorized to use provider/model per-run overrides. */
  allowModelOverride?: boolean; /** Optional runtime tool allow-list; when set, only these tools are exposed for this run. */
  toolsAllow?: string[]; /** Trusted owner-scoped plugin tool grant; normal policy and deny rules still apply. */
  runtimePluginToolGrant?: RuntimePluginToolGrant; /** Internal marker for an auto-applied cap that CLI runtimes must omit. */
  toolsAllowIsDefault?: boolean; /** Preserve the originating run's message-tool policy across internal continuation turns. */
  requireExplicitMessageTarget?: boolean;
  cliSessionBindingFacts?: CliSessionBindingFacts; /** Group/spawn metadata for subagent policy inheritance and routing context. */
  groupId?: SpawnedRunMetadata["groupId"];
  groupChannel?: SpawnedRunMetadata["groupChannel"];
  groupSpace?: SpawnedRunMetadata["groupSpace"];
  spawnedBy?: SpawnedRunMetadata["spawnedBy"];
  deliveryTargetMode?: ChannelOutboundTargetMode;
  bestEffortDeliver?: boolean;
  abortSignal?: AbortSignal;
  lane?: string;
  runId?: string; /** Immutable gateway lifecycle ownership captured when this run was admitted. */
  lifecycleGeneration?: string;
  extraSystemPrompt?: string; /** Bootstrap workspace context injection mode for this run. */
  bootstrapContextMode?: "full" | "lightweight"; /** Run kind hint for bootstrap context behavior. */
  bootstrapContextRunKind?: BootstrapContextRunKind;
  internalEvents?: AgentInternalEvent[];
  inputProvenance?: InputProvenance; /** Internal runs can execute against a session without updating visible status/model/usage. */
  sessionEffects?: "visible" | "internal"; /** Internal handoffs can write transcript turns without changing user-facing model/usage state. */
  preserveUserFacingSessionModelState?: boolean; /** Visible source replies must be sent through the message tool when set. */
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode; /** Internal runs can omit the channel message tool entirely. */
  disableMessageTool?: boolean; /** Collector children fail closed instead of emitting operator approval requests. */
  swarmCollector?: boolean; /** Synthetic structured_output input schema for collector children. */
  swarmOutputSchema?: Record<string, unknown>; /** Restrict this reconstructed run to restart-safe tools. */
  forceRestartSafeTools?: boolean; /** Host-owned exact media set for a scoped automatic recovery delivery. */
  internalDeliveryMediaUrls?: string[];
  internalDeliverySuppressText?: boolean; /** Gateway ingress that already persisted visible activity can skip the duplicate pre-run touch. */
  skipInitialSessionTouch?: boolean; /** Per-call stream param overrides (best-effort). */
  streamParams?: AgentStreamParams; /** Resolved per-run fast mode from channel/directive handling. */
  fastMode?: FastMode; /** Resolved per-run auto cutoff seconds for fast mode. */
  fastModeAutoOnSeconds?: number; /** Explicit workspace directory override (for subagents to inherit parent workspace). */
  workspaceDir?: SpawnedRunMetadata["workspaceDir"]; /** Explicit task working directory for this run. Bootstrap still uses workspaceDir. */
  cwd?: string; /** Force bundled MCP teardown when a one-shot local run completes. */
  cleanupBundleMcpOnRunEnd?: boolean; /** Force long-lived CLI live session teardown when a one-shot local run completes. */
  cleanupCliLiveSessionOnRunEnd?: boolean; /** Mark explicit one-shot local CLI runs so plugin tools can release resources promptly. */
  oneShotCliRun?: boolean; /** Gateway-owned runs can late-bind plugin subagent and node runtime helpers. */
  allowGatewaySubagentBinding?: boolean; /** Opaque foreground fence transferred by Gateway after atomic session admission. */
  mainRestartRecoveryOwnerLease?: MainSessionRecoveryOwnerLease; /** Gateway already consumed this automatic recovery run's durable reservation. */
  mainRestartRecoveryAdmitted?: boolean; /** Internal local CLI callers can annotate result metadata before JSON/text output. */
  resultMetaOverrides?: AgentCommandResultMetaOverrides; /** Called when the actual run model is selected, including fallback retries. */
  onActiveModelSelected?: (ctx: {
    provider: string;
    model: string;
  }) => void | Promise<void>; /** Called when compaction rotates the active run onto a successor session. */
  onSessionIdChanged?: (sessionId: string) => void; /** Internal one-shot model probe mode: no tools, no workspace/chat prompt policy. */
  modelRun?: boolean; /** Internal prompt-mode override for trusted local/gateway callsites. */
  promptMode?: PromptMode; /** Internal ACP-ready session turn source. Manual spawn turns bypass only the dispatch gate. */
  acpTurnSource?: AcpTurnSource; /** Internal handoffs can feed the model without writing the synthetic prompt to transcript. */
  suppressPromptPersistence?: boolean; /** Gateway/channel ingress can provide a canonical user-turn persistence owner. */
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder;
};
/** Restricted option surface for external ingress callsites. */
type AgentCommandIngressOpts = Omit<AgentCommandOpts, "senderIsOwner" | "allowModelOverride" | "resultMetaOverrides"> & {
  /** Trusted sender identity bit for command/channel-action auth; defaults false for ingress. */senderIsOwner?: boolean; /** Ingress callsites must always pass explicit model-override authorization state. */
  allowModelOverride: boolean;
};
//#endregion
//#region src/agents/agent-command.d.ts
/** Runs an agent turn from an inbound channel/gateway ingress context. */
declare function agentCommandFromIngress(opts: AgentCommandIngressOpts, runtime?: RuntimeEnv, deps?: CliDeps): Promise<{
  payloads: ReturnType<typeof projectOutboundPayloadPlanForJson>;
  meta: EmbeddedAgentRunMeta & AgentCommandResultMetaOverrides;
  didSendViaMessagingTool?: boolean;
  messagingToolSentTexts?: string[];
  messagingToolSentMediaUrls?: string[];
  messagingToolSentTargets?: MessagingToolSend[];
  deliverySucceeded?: boolean;
  deliveryStatus?: {
    requested: true;
    attempted: boolean;
    status: "sent" | "suppressed" | "partial_failed" | "failed";
    succeeded: true | false | "partial";
    error?: true;
    errorMessage?: string;
    reason?: string;
    resultCount?: number;
    sentBeforeError?: true;
    payloadOutcomes?: SerializedDurableMessagePayloadOutcome[];
  };
}>;
//#endregion
//#region src/plugin-sdk/agent-runtime.d.ts
type LoadModelCatalogCompatibilityParams = LoadPreparedModelCatalogParams & {
  /** @deprecated Lifecycle publication owns refreshes; retained for source compatibility. */useCache?: boolean; /** @deprecated Use getPreparedModelCatalogSnapshot for new nonblocking readers. */
  cacheOnly?: boolean; /** @deprecated Plugin metadata belongs to the published lifecycle generation. */
  metadataSnapshot?: PluginMetadataSnapshot;
};
/** @deprecated Use loadPreparedModelCatalog or getPreparedModelCatalogSnapshot. */
declare function loadModelCatalog(params?: LoadModelCatalogCompatibilityParams): Promise<ModelCatalogEntry[]>;
//#endregion
export { resolveAuthStorePathForDisplay as a, resolveAgentAvatar as i, agentCommandFromIngress as n, AgentAvatarResolution as r, loadModelCatalog as t };