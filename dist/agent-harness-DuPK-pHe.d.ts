import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { t as ChatType } from "./chat-type-B6XXSSnm.js";
import { o as ModelCompatConfig } from "./types.models-FHGBX8Gn.js";
import { $c as SkillWorkshopRunOptions, Qa as DelegationCapability, Qs as ExecToolDefaults, Xr as ProcessToolDefaults, qs as ConversationRecallContext, ro as ToolOutcomeObserver } from "./types-Bi5Leigi.js";
import { g as SourceReplyDeliveryMode } from "./types-D43pE80v.js";
import { a as TaskSuggestionDeliveryMode } from "./types-BBQnzy9U.js";
import { d as AgentToolResult, f as AgentToolUpdateCallback } from "./types-Dedz4oTJ.js";
import { _ as InboundEventKind, h as PluginHookChannelContext } from "./templating-CzGprbNA.js";
import { a as AuthProfileStore } from "./types-BYLj8dvi.js";
import { t as DiagnosticTraceContext } from "./diagnostic-trace-context-c5mRZYEt.js";
import { a as SkillUsagePath, r as SkillSnapshot } from "./types-BTvzpfNv.js";
import { n as AnyAgentTool } from "./common-B6rw6aZ3.js";
import { s as ToolDefinition } from "./index-DTRqLAuB.js";
import { t as ModelAuthMode } from "./model-auth-BPNLBT2A.js";
import { t as PreparedModelRuntimeSnapshot } from "./prepared-model-runtime-CVh56uBC.js";
import { i as SandboxToolPolicy, n as SandboxContext } from "./types-WKXQUTm1.js";
import { n as ResolvedConversationCapabilityProfile } from "./conversation-capability-profile-q5ovk19e.js";
import { et as OpenClawCodingToolConstructionPlan } from "./agent-harness-runtime-DtkeMYBU.js";
import { t as PluginToolMcpMeta } from "./tools-B8VefXxP.js";
import { t as SystemAgentToolOptions } from "./system-agent-tool-TABAIVXI.js";
import { TSchema, Type } from "typebox";

//#region src/agents/tool-search.d.ts
type CatalogSource = "openclaw" | "mcp" | "client";
type CatalogTool = AnyAgentTool | ToolDefinition;
type ToolSearchCatalogToolExecutor = (params: {
  tool: CatalogTool;
  toolName: string;
  source: CatalogSource;
  sourceName?: string;
  toolCallId: string;
  parentToolCallId?: string;
  input: unknown;
  signal?: AbortSignal;
  onUpdate?: AgentToolUpdateCallback;
  acceptResultBeforeProjection: (result: AgentToolResult<unknown>) => Promise<AgentToolResult<unknown>>;
}) => Promise<AgentToolResult<unknown>>;
/** Catalog entry retained behind compacted Tool Search control tools. */
type ToolSearchCatalogEntry = {
  id: string;
  source: CatalogSource;
  sourceName?: string;
  mcp?: PluginToolMcpMeta;
  name: string;
  label?: string;
  description: string;
  parameters?: unknown;
  outputSchema?: TSchema;
  tool: CatalogTool;
};
type ToolSearchCatalogSession = {
  entries: ToolSearchCatalogEntry[];
  searchCount: number;
  describeCount: number;
  callCount: number;
};
type ToolSearchCatalogRef = {
  current?: ToolSearchCatalogSession;
};
//#endregion
//#region src/agents/tools/cron-tool.types.d.ts
type CronCreatorToolAllowlistEntry = string | {
  name: string;
  pluginId?: string;
};
//#endregion
//#region src/agents/agent-tools.d.ts
/** Public options for building one plugin-owned agent tool surface. */
type OpenClawCodingToolsOptions = {
  agentId?: string;
  exec?: ExecToolDefaults & ProcessToolDefaults;
  messageProvider?: string; /** Canonical transport channel when tool-policy provider differs from delivery channel. */
  messageChannel?: string; /** Capabilities declared by the gateway client that originated this run. */
  clientCaps?: string[]; /** Out-of-band plugin bindings attached by the run initiator. */
  toolBindings?: Readonly<Record<string, unknown>>; /** Trusted runtime-only authorization for one bounded cross-conversation recall pass. */
  conversationRecall?: ConversationRecallContext; /** Normalized conversation kind when the caller already has channel metadata. */
  chatType?: ChatType; /** Specific ingress provider used only for transport tool availability. */
  toolPolicyMessageProvider?: string;
  agentAccountId?: string;
  messageTo?: string;
  messageThreadId?: string | number; /** Trusted platform-native conversation id for the active inbound turn. */
  nativeChannelId?: string; /** Opaque host-issued capability for current-turn channel message actions. */
  messageActionTurnCapability?: string;
  sandbox?: SandboxContext | null;
  sessionKey?: string;
  /**
   * The actual live run session key. When the tool set is constructed with a
   * sandbox/policy session key, this allows `session_status({sessionKey:"current"})`
   * to resolve to the live run session instead of the stale sandbox key.
   */
  runSessionKey?: string; /** Ephemeral session UUID — regenerated on /new and /reset. */
  sessionId?: string;
  /**
   * Explicit one-shot local CLI runs should not keep plugin-owned process
   * resources alive after emitting their result.
   */
  oneShotCliRun?: boolean; /** Stable run identifier for this agent invocation. */
  runId?: string; /** Device-scoped operator session allowed to review approvals initiated by this run. */
  approvalReviewerDeviceId?: string; /** Diagnostic trace context for hook/log correlation during this run. */
  trace?: DiagnosticTraceContext; /** What initiated this run (for trigger-specific tool restrictions). */
  trigger?: string; /** Stable cron job identifier populated for cron-triggered runs. */
  jobId?: string; /** Relative workspace path that memory-triggered writes may append to. */
  memoryFlushWritePath?: string;
  agentDir?: string;
  preparedModelRuntime?: PreparedModelRuntimeSnapshot; /** Task working directory for coding tools. Defaults to workspaceDir. */
  cwd?: string;
  workspaceDir?: string;
  /**
   * Workspace directory that spawned subagents should inherit.
   * When sandboxing uses a copied workspace (`ro` or `none`), workspaceDir is the
   * sandbox copy but subagents should inherit the real agent workspace instead.
   * Defaults to workspaceDir when not set.
   */
  spawnWorkspaceDir?: string;
  config?: OpenClawConfig;
  abortSignal?: AbortSignal; /** Disable hook-owned diagnostics when an outer runtime owns tool diagnostics. */
  emitBeforeToolCallDiagnostics?: boolean;
  /**
   * Provider of the currently selected model (used for provider-specific tool quirks).
   * Example: "anthropic", "openai", "google", "openai".
   */
  modelProvider?: string; /** Model id for the current provider (used for model-specific tool gating). */
  modelId?: string; /** Internal review-run restrictions and proposal provenance. */
  skillWorkshop?: SkillWorkshopRunOptions; /** Attempt-local authority to start or redirect delegated work. */
  delegationCapability?: DelegationCapability; /** Model API for the current provider (used for provider-native tool arbitration). */
  modelApi?: string; /** Model context window in tokens (used to scale read-tool output budget). */
  modelContextWindowTokens?: number; /** Resolved runtime model compatibility hints. */
  modelCompat?: ModelCompatConfig; /** If false, keep OpenClaw web_search even when a provider-native search tool is active. */
  suppressManagedWebSearch?: boolean;
  /**
   * Auth mode for the current provider. We only need this for Anthropic OAuth
   * tool-name blocking quirks.
   */
  modelAuthMode?: ModelAuthMode; /** Current channel ID for auto-threading (Slack). */
  currentChannelId?: string; /** Routable target for the current conversation when it differs from the native channel ID. */
  currentMessagingTarget?: string; /** Normalized conversation id exposed to tool hooks. Defaults to currentChannelId. */
  hookChannelId?: string; /** Channel-owned sender/chat metadata exposed to subprocess environments. */
  channelContext?: PluginHookChannelContext; /** Current thread timestamp for auto-threading (Slack). */
  currentThreadTs?: string; /** Current inbound message id for action fallbacks (e.g. Telegram react). */
  currentMessageId?: string | number; /** True when the current inbound turn carried audio media. */
  currentInboundAudio?: boolean; /** Dynamic audio state for runs that can accept steered input after tool creation. */
  hasCurrentInboundAudio?: () => boolean; /** Group id for channel-level tool policy resolution. */
  groupId?: string | null; /** Group channel label (e.g. #general) for channel-level tool policy resolution. */
  groupChannel?: string | null; /** Group space label (e.g. guild/team id) for channel-level tool policy resolution. */
  groupSpace?: string | null; /** Trusted provider role ids for the requester in this group turn. */
  memberRoleIds?: string[]; /** Parent session key for subagent group policy inheritance. */
  spawnedBy?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null; /** Reply-to mode for Slack auto-threading. */
  replyToMode?: "off" | "first" | "all" | "batched"; /** Mutable ref to track if a reply was sent (for "first" mode). */
  hasRepliedRef?: {
    value: boolean;
  }; /** Allow plugin tools for this run to late-bind the gateway subagent. */
  allowGatewaySubagentBinding?: boolean; /** Runtime-scoped explicit allowlist used to materialize matching plugin tools. */
  runtimeToolAllowlist?: string[]; /** Mutable cron creator cap ref for callers that append final runtime tools later. */
  cronCreatorToolAllowlistRef?: CronCreatorToolAllowlistEntry[]; /** If true, the model has native vision capability */
  modelHasVision?: boolean; /** Mutable model-context generation used to expire screenshot coordinate frames. */
  computerContextEpoch?: {
    value: number;
  }; /** Require explicit message targets (no implicit last-route sends). */
  requireExplicitMessageTarget?: boolean; /** Visible source replies must be sent through the message tool when set to message_tool_only. */
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode; /** Action sink available for model-proposed follow-up tasks. */
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
  inboundEventKind?: InboundEventKind; /** If true, omit the message tool from the tool list. */
  disableMessageTool?: boolean; /** Collector runs never open operator approval flows. */
  swarmCollector?: boolean; /** Synthetic structured_output schema for collector runs. */
  swarmOutputSchema?: Record<string, unknown>; /** Keep the message tool available even when the selected profile omits it. */
  forceMessageTool?: boolean; /** Include the heartbeat response tool for structured heartbeat outcomes. */
  enableHeartbeatTool?: boolean; /** Keep the heartbeat response tool available even when the selected profile omits it. */
  forceHeartbeatTool?: boolean; /** If false, build plugin tools only while preserving the shared policy pipeline. */
  includeCoreTools?: boolean; /** Include Tool Search control tools when enabled for this run. */
  includeToolSearchControls?: boolean; /** Executes cataloged tools through the active agent run lifecycle. */
  toolSearchCatalogExecutor?: ToolSearchCatalogToolExecutor; /** Runtime-local Tool Search catalog ref shared with attempt compaction. */
  toolSearchCatalogRef?: ToolSearchCatalogRef; /** Limits which tool families are materialized before the shared policy pipeline runs. */
  toolConstructionPlan?: OpenClawCodingToolConstructionPlan; /** Ring-zero OpenClaw tool; set only by the OpenClaw agent runner. */
  systemAgentTool?: SystemAgentToolOptions; /** Trusted sender identity bit for command/channel-action auth and owner-gated plugin tools. */
  senderIsOwner?: boolean; /** Auth profiles already loaded for this run; used for prompt-time tool availability. */
  authProfileStore?: AuthProfileStore; /** Callback invoked when sessions_yield tool is called. */
  onYield?: (message: string) => Promise<void> | void; /** Optional instrumentation callback for tool preparation stage timing. */
  recordToolPrepStage?: (name: string) => void; /** Lower routine policy-removal audits for diagnostic-only tool probes. */
  toolPolicyAuditLogLevel?: "info" | "debug"; /** Live observer called after wrapped tool outcomes are recorded. */
  onToolOutcome?: ToolOutcomeObserver; /** Supplies run-global model-call ordering for parallel tool outcomes. */
  allocateToolOutcomeOrdinal?: (toolCallId?: string) => number; /** Runtime-only resolved skill paths that the read tool may load under workspaceOnly. */
  skillsSnapshot?: SkillSnapshot; /** Original identities for sandbox-materialized skill instruction paths. */
  skillUsagePaths?: SkillUsagePath[]; /** Prepared conversation-scoped facts for callers that already resolved this run context. */
  conversationCapabilityProfile?: ResolvedConversationCapabilityProfile;
};
/** Build the runtime tool list exposed through the public agent harness SDK. */
declare function createOpenClawCodingTools(options?: OpenClawCodingToolsOptions): AnyAgentTool[];
//#endregion
//#region src/agents/web-search-tool-policy.d.ts
type WebSearchToolPolicyParams = {
  config?: OpenClawConfig;
  modelProvider?: string;
  modelId?: string;
  agentId?: string;
  sessionKey?: string;
  sandboxToolPolicy?: SandboxToolPolicy;
  messageProvider?: string;
  agentAccountId?: string | null;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  spawnedBy?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
};
type WebSearchToolPolicyResolution = {
  allowed: boolean;
  persistentAllowed: boolean;
};
/** Resolves current and sender-independent policy for the managed web_search tool. */
declare function resolveWebSearchToolPolicy(params: WebSearchToolPolicyParams): WebSearchToolPolicyResolution;
//#endregion
export { ToolSearchCatalogToolExecutor as i, createOpenClawCodingTools as n, ToolSearchCatalogRef as r, resolveWebSearchToolPolicy as t };