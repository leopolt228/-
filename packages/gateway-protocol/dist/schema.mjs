// packages/gateway-protocol/src/schema/primitives.ts
import { Type as Type2 } from "typebox";

// packages/gateway-protocol/src/client-info.ts
var GATEWAY_CLIENT_IDS = {
  WEBCHAT_UI: "webchat-ui",
  CONTROL_UI: "openclaw-control-ui",
  BROWSER_COPILOT: "openclaw-browser-copilot",
  TUI: "openclaw-tui",
  WEBCHAT: "webchat",
  CLI: "cli",
  GATEWAY_CLIENT: "gateway-client",
  MACOS_APP: "openclaw-macos",
  // Native Linux UI uses the same trusted-client admission class as the macOS app.
  LINUX_APP: "openclaw-linux",
  IOS_APP: "openclaw-ios",
  WATCHOS_APP: "openclaw-watchos",
  ANDROID_APP: "openclaw-android",
  NODE_HOST: "node-host",
  WORKER: "openclaw-worker",
  TEST: "test",
  FINGERPRINT: "fingerprint",
  PROBE: "openclaw-probe"
};
var GATEWAY_CLIENT_MODES = {
  WEBCHAT: "webchat",
  CLI: "cli",
  UI: "ui",
  BACKEND: "backend",
  NODE: "node",
  WORKER: "worker",
  PROBE: "probe",
  TEST: "test"
};
var GATEWAY_CLIENT_ID_SET = new Set(Object.values(GATEWAY_CLIENT_IDS));
var GATEWAY_CLIENT_MODE_SET = new Set(Object.values(GATEWAY_CLIENT_MODES));

// packages/gateway-protocol/src/secret-ref-contract.ts
var SINGLE_VALUE_FILE_REF_ID = "value";
var SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
var FILE_SECRET_REF_ID_ABSOLUTE_JSON_SCHEMA_PATTERN = "^/";
var FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN = "~(?:[^01]|$)";
var EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN = "^(?!.*(?:^|/)\\.{1,2}(?:/|$))[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$";

// packages/gateway-protocol/src/schema/closed-object.ts
import { Type } from "typebox";
function closedObject(properties) {
  return Type.Object(properties, { additionalProperties: false });
}

// packages/gateway-protocol/src/schema/primitives.ts
var ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
var INPUT_PROVENANCE_KIND_VALUES = ["external_user", "inter_session", "internal_system"];
var SESSION_LABEL_MAX_LENGTH = 512;
var NonEmptyString = Type2.String({ minLength: 1 });
var CHAT_SEND_SESSION_KEY_MAX_LENGTH = 512;
var ChatSendSessionKeyString = Type2.String({
  minLength: 1,
  maxLength: CHAT_SEND_SESSION_KEY_MAX_LENGTH
});
var SessionLabelString = Type2.String({
  minLength: 1,
  maxLength: SESSION_LABEL_MAX_LENGTH
});
var InputProvenanceSchema = closedObject({
  kind: Type2.String({ enum: [...INPUT_PROVENANCE_KIND_VALUES] }),
  originSessionId: Type2.Optional(Type2.String()),
  sourceSessionKey: Type2.Optional(Type2.String()),
  sourceChannel: Type2.Optional(Type2.String()),
  sourceTool: Type2.Optional(Type2.String())
});
var GatewayClientIdSchema = Type2.Enum(GATEWAY_CLIENT_IDS);
var GatewayClientModeSchema = Type2.Enum(GATEWAY_CLIENT_MODES);
var SecretProviderAliasString = Type2.String({
  pattern: SECRET_PROVIDER_ALIAS_PATTERN.source
});
var EnvSecretRefSchema = closedObject({
  source: Type2.Literal("env"),
  provider: SecretProviderAliasString,
  id: Type2.String({ pattern: ENV_SECRET_REF_ID_RE.source })
});
var FileSecretRefIdSchema = Type2.Unsafe({
  type: "string",
  anyOf: [
    { const: SINGLE_VALUE_FILE_REF_ID },
    {
      allOf: [
        { pattern: FILE_SECRET_REF_ID_ABSOLUTE_JSON_SCHEMA_PATTERN },
        { not: { pattern: FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN } }
      ]
    }
  ]
});
var FileSecretRefSchema = closedObject({
  source: Type2.Literal("file"),
  provider: SecretProviderAliasString,
  id: FileSecretRefIdSchema
});
var ExecSecretRefSchema = closedObject({
  source: Type2.Literal("exec"),
  provider: SecretProviderAliasString,
  id: Type2.String({ pattern: EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN })
});
var SecretRefSchema = Type2.Union([
  EnvSecretRefSchema,
  FileSecretRefSchema,
  ExecSecretRefSchema
]);
var SecretInputSchema = Type2.Union([Type2.String(), SecretRefSchema]);

// packages/gateway-protocol/src/schema/agent.ts
import { Type as Type3 } from "typebox";
var AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION = "task_completion";
var AGENT_INTERNAL_EVENT_SOURCES = [
  "subagent",
  "cron",
  "image_generation",
  "video_generation",
  "music_generation"
];
var AGENT_INTERNAL_EVENT_STATUSES = ["ok", "timeout", "error", "unknown"];
var CONVERSATION_REF_PATTERN = "^conv_[a-f0-9]{32}$";
var AgentGeneratedAttachmentSchema = closedObject({
  type: Type3.Optional(Type3.String({ enum: ["image", "audio", "video", "file"] })),
  path: Type3.Optional(Type3.String()),
  url: Type3.Optional(Type3.String()),
  mediaUrl: Type3.Optional(Type3.String()),
  filePath: Type3.Optional(Type3.String()),
  mimeType: Type3.Optional(Type3.String()),
  name: Type3.Optional(Type3.String())
});
var AgentInternalEventSchema = closedObject({
  type: Type3.Literal(AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION),
  source: Type3.String({ enum: [...AGENT_INTERNAL_EVENT_SOURCES] }),
  childSessionKey: Type3.String(),
  childSessionId: Type3.Optional(Type3.String()),
  announceType: Type3.String(),
  taskLabel: Type3.String(),
  status: Type3.String({ enum: [...AGENT_INTERNAL_EVENT_STATUSES] }),
  statusLabel: Type3.String(),
  result: Type3.String(),
  attachments: Type3.Optional(Type3.Array(AgentGeneratedAttachmentSchema)),
  mediaUrls: Type3.Optional(Type3.Array(Type3.String())),
  statsLine: Type3.Optional(Type3.String()),
  replyInstruction: Type3.String()
});
var AgentEventSchema = closedObject({
  runId: NonEmptyString,
  seq: Type3.Integer({ minimum: 0 }),
  stream: NonEmptyString,
  ts: Type3.Integer({ minimum: 0 }),
  spawnedBy: Type3.Optional(NonEmptyString),
  isHeartbeat: Type3.Optional(Type3.Boolean()),
  data: Type3.Record(Type3.String(), Type3.Unknown())
});
var MessageActionToolContextSchema = closedObject({
  currentChannelId: Type3.Optional(Type3.String()),
  currentMessagingTarget: Type3.Optional(Type3.String()),
  currentGraphChannelId: Type3.Optional(Type3.String()),
  currentChannelProvider: Type3.Optional(Type3.String()),
  currentThreadTs: Type3.Optional(Type3.String()),
  currentMessageId: Type3.Optional(Type3.Union([Type3.String(), Type3.Number()])),
  replyToMode: Type3.Optional(
    Type3.Union([
      Type3.Literal("off"),
      Type3.Literal("first"),
      Type3.Literal("all"),
      Type3.Literal("batched")
    ])
  ),
  hasRepliedRef: Type3.Optional(
    closedObject({
      value: Type3.Boolean()
    })
  ),
  sameChannelThreadRequired: Type3.Optional(Type3.Boolean()),
  skipCrossContextDecoration: Type3.Optional(Type3.Boolean())
});
var MessageActionParamsSchema = closedObject({
  channel: NonEmptyString,
  action: NonEmptyString,
  params: Type3.Record(Type3.String(), Type3.Unknown()),
  accountId: Type3.Optional(Type3.String()),
  requesterAccountId: Type3.Optional(Type3.String()),
  requesterSenderId: Type3.Optional(Type3.String()),
  // Honored only when the RPC caller has the full operator scope set
  // (shared-secret bearer or `operator.admin`). For narrowly-scoped
  // callers (e.g. `operator.write`-only) the gateway forces this to
  // `false` regardless of the value sent here.
  senderIsOwner: Type3.Optional(Type3.Boolean()),
  sessionKey: Type3.Optional(Type3.String()),
  sessionId: Type3.Optional(Type3.String()),
  inboundTurnKind: Type3.Optional(Type3.String({ enum: ["user_request", "room_event"] })),
  agentId: Type3.Optional(Type3.String()),
  toolContext: Type3.Optional(MessageActionToolContextSchema),
  /**
   * Explicit operation-local marker for an authenticated direct operator.
   * Missing values remain delegated, and agent runtime identity wins server-side.
   */
  conversationReadOrigin: Type3.Optional(Type3.Literal("direct-operator")),
  idempotencyKey: NonEmptyString
});
var SendParamsSchema = closedObject({
  to: NonEmptyString,
  message: Type3.Optional(Type3.String()),
  mediaUrl: Type3.Optional(Type3.String()),
  mediaUrls: Type3.Optional(Type3.Array(Type3.String())),
  /** Base64 attachment payload for gateway-local media materialization. */
  buffer: Type3.Optional(Type3.String()),
  /** Optional filename for a base64 attachment payload. */
  filename: Type3.Optional(Type3.String()),
  /** Optional MIME type for a base64 attachment payload. */
  contentType: Type3.Optional(Type3.String()),
  asVoice: Type3.Optional(Type3.Boolean()),
  gifPlayback: Type3.Optional(Type3.Boolean()),
  channel: Type3.Optional(Type3.String()),
  accountId: Type3.Optional(Type3.String()),
  /** Optional agent id for per-agent media root resolution on gateway sends. */
  agentId: Type3.Optional(Type3.String()),
  /** Reply target message id for native quoted/threaded sends where supported. */
  replyToId: Type3.Optional(Type3.String()),
  /** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */
  threadId: Type3.Optional(Type3.String()),
  /** Force document-style media sends where supported. */
  forceDocument: Type3.Optional(Type3.Boolean()),
  /** Send silently (no notification) where supported. */
  silent: Type3.Optional(Type3.Boolean()),
  /** Channel-specific parse mode for formatted text. */
  parseMode: Type3.Optional(Type3.Literal("HTML")),
  /** Optional session key for mirroring delivered output back into the transcript. */
  sessionKey: Type3.Optional(Type3.String()),
  idempotencyKey: NonEmptyString
});
var ConversationListParamsSchema = closedObject({
  agentId: NonEmptyString,
  channel: Type3.Optional(NonEmptyString),
  query: Type3.Optional(NonEmptyString),
  limit: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 100 }))
});
var ConversationListItemSchema = closedObject({
  conversationRef: Type3.String({ pattern: CONVERSATION_REF_PATTERN }),
  channel: NonEmptyString,
  accountId: NonEmptyString,
  kind: Type3.Union([Type3.Literal("direct"), Type3.Literal("group"), Type3.Literal("channel")]),
  target: NonEmptyString,
  threadId: Type3.Optional(NonEmptyString),
  label: Type3.Optional(NonEmptyString),
  firstSeenAt: Type3.Integer({ minimum: 0 }),
  lastSeenAt: Type3.Integer({ minimum: 0 })
});
var ConversationListResultSchema = closedObject({
  conversations: Type3.Array(ConversationListItemSchema)
});
var ConversationSendParamsSchema = closedObject({
  agentId: NonEmptyString,
  sourceSessionKey: Type3.Optional(NonEmptyString),
  operationId: NonEmptyString,
  conversationRef: Type3.String({ pattern: CONVERSATION_REF_PATTERN }),
  message: NonEmptyString
});
var ConversationSendResultSchema = closedObject({
  status: Type3.Union([
    Type3.Literal("sent"),
    Type3.Literal("queued"),
    Type3.Literal("suppressed"),
    Type3.Literal("unknown")
  ]),
  conversationRef: Type3.String({ pattern: CONVERSATION_REF_PATTERN }),
  channel: NonEmptyString,
  messageId: Type3.Optional(NonEmptyString),
  queueId: Type3.Optional(NonEmptyString)
});
var ConversationTurnParamsSchema = closedObject({
  agentId: NonEmptyString,
  sourceSessionKey: Type3.Optional(NonEmptyString),
  turnId: NonEmptyString,
  conversationRef: Type3.String({ pattern: CONVERSATION_REF_PATTERN }),
  message: NonEmptyString,
  timeoutMs: Type3.Integer({ minimum: 1, maximum: 3e5 })
});
var ConversationTurnCancelParamsSchema = closedObject({
  agentId: NonEmptyString,
  turnId: NonEmptyString
});
var ConversationTurnCancelResultSchema = closedObject({
  cancelled: Type3.Boolean()
});
var ConversationTurnReplySchema = closedObject({
  conversationRef: Type3.String({ pattern: CONVERSATION_REF_PATTERN }),
  messageId: NonEmptyString,
  replyToId: Type3.Optional(NonEmptyString),
  threadId: Type3.Optional(NonEmptyString),
  text: Type3.String(),
  timestamp: Type3.Integer({ minimum: 0 }),
  transcriptArtifactId: Type3.Optional(NonEmptyString),
  transcriptMessageId: Type3.Optional(NonEmptyString)
});
var ConversationTurnBaseResultSchema = {
  conversationRef: Type3.String({ pattern: CONVERSATION_REF_PATTERN }),
  channel: NonEmptyString,
  messageId: NonEmptyString,
  correlationPersisted: Type3.Boolean()
};
var ConversationTurnResultSchema = Type3.Union([
  closedObject({
    ...ConversationTurnBaseResultSchema,
    status: Type3.Literal("replied"),
    reply: ConversationTurnReplySchema
  }),
  closedObject({
    ...ConversationTurnBaseResultSchema,
    status: Type3.Literal("timeout")
  }),
  closedObject({
    conversationRef: Type3.String({ pattern: CONVERSATION_REF_PATTERN }),
    channel: NonEmptyString,
    messageId: Type3.Optional(NonEmptyString),
    correlationPersisted: Type3.Boolean(),
    status: Type3.Union([
      Type3.Literal("sent"),
      Type3.Literal("queued"),
      Type3.Literal("suppressed"),
      Type3.Literal("unknown")
    ]),
    error: NonEmptyString
  })
]);
var PollParamsSchema = closedObject({
  to: NonEmptyString,
  question: NonEmptyString,
  options: Type3.Array(NonEmptyString, { minItems: 2, maxItems: 12 }),
  maxSelections: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 12 })),
  /** Poll duration in seconds (channel-specific limits may apply). */
  durationSeconds: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 604800 })),
  durationHours: Type3.Optional(Type3.Integer({ minimum: 1 })),
  /** Send silently (no notification) where supported. */
  silent: Type3.Optional(Type3.Boolean()),
  /** Poll anonymity where supported (e.g. Telegram polls default to anonymous). */
  isAnonymous: Type3.Optional(Type3.Boolean()),
  /** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */
  threadId: Type3.Optional(Type3.String()),
  channel: Type3.Optional(Type3.String()),
  accountId: Type3.Optional(Type3.String()),
  idempotencyKey: NonEmptyString
});
var AgentParamsSchema = closedObject({
  message: NonEmptyString,
  agentId: Type3.Optional(NonEmptyString),
  provider: Type3.Optional(Type3.String()),
  model: Type3.Optional(Type3.String()),
  to: Type3.Optional(Type3.String()),
  replyTo: Type3.Optional(Type3.String()),
  sessionId: Type3.Optional(Type3.String()),
  sessionKey: Type3.Optional(Type3.String()),
  // Backend-owned continuations can bind work to an already-admitted transcript.
  expectedExistingSessionId: Type3.Optional(NonEmptyString),
  thinking: Type3.Optional(Type3.String()),
  deliver: Type3.Optional(Type3.Boolean()),
  attachments: Type3.Optional(Type3.Array(Type3.Unknown())),
  channel: Type3.Optional(Type3.String()),
  replyChannel: Type3.Optional(Type3.String()),
  accountId: Type3.Optional(Type3.String()),
  replyAccountId: Type3.Optional(Type3.String()),
  threadId: Type3.Optional(Type3.String()),
  groupId: Type3.Optional(Type3.String()),
  groupChannel: Type3.Optional(Type3.String()),
  groupSpace: Type3.Optional(Type3.String()),
  timeout: Type3.Optional(Type3.Integer({ minimum: 0 })),
  bestEffortDeliver: Type3.Optional(Type3.Boolean()),
  lane: Type3.Optional(Type3.String()),
  cwd: Type3.Optional(NonEmptyString),
  // One-shot CLI gateway requests can ask the gateway to close process-wide
  // bundle MCP resources after the run instead of keeping them warm.
  cleanupBundleMcpOnRunEnd: Type3.Optional(Type3.Boolean()),
  modelRun: Type3.Optional(Type3.Boolean()),
  promptMode: Type3.Optional(
    Type3.Union([Type3.Literal("full"), Type3.Literal("minimal"), Type3.Literal("none")])
  ),
  extraSystemPrompt: Type3.Optional(Type3.String()),
  bootstrapContextMode: Type3.Optional(
    Type3.Union([Type3.Literal("full"), Type3.Literal("lightweight")])
  ),
  // Commitment fan-out scope is scheduler-internal and cannot be selected over Gateway RPC.
  bootstrapContextRunKind: Type3.Optional(
    Type3.Union([Type3.Literal("default"), Type3.Literal("heartbeat"), Type3.Literal("cron")])
  ),
  acpTurnSource: Type3.Optional(Type3.Literal("manual_spawn")),
  internalRuntimeHandoffId: Type3.Optional(NonEmptyString),
  execApprovalFollowupExpectedSessionId: Type3.Optional(NonEmptyString),
  internalEvents: Type3.Optional(Type3.Array(AgentInternalEventSchema)),
  inputProvenance: Type3.Optional(InputProvenanceSchema),
  suppressPromptPersistence: Type3.Optional(Type3.Boolean()),
  sessionEffects: Type3.Optional(Type3.Union([Type3.Literal("visible"), Type3.Literal("internal")])),
  sourceReplyDeliveryMode: Type3.Optional(
    Type3.Union([Type3.Literal("automatic"), Type3.Literal("message_tool_only")])
  ),
  disableMessageTool: Type3.Optional(Type3.Boolean()),
  swarmCollector: Type3.Optional(Type3.Boolean()),
  swarmOutputSchema: Type3.Optional(Type3.Record(Type3.String(), Type3.Unknown())),
  // Host-owned recovery turns can force every Code Mode exec onto the
  // restart-safe path even if the model omits or clears the tool argument.
  forceRestartSafeTools: Type3.Optional(Type3.Boolean()),
  voiceWakeTrigger: Type3.Optional(Type3.String()),
  idempotencyKey: NonEmptyString,
  label: Type3.Optional(SessionLabelString)
});
var AgentIdentityParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  sessionKey: Type3.Optional(Type3.String())
});
var AgentIdentityResultSchema = closedObject({
  agentId: NonEmptyString,
  name: Type3.Optional(NonEmptyString),
  avatar: Type3.Optional(NonEmptyString),
  avatarSource: Type3.Optional(NonEmptyString),
  avatarStatus: Type3.Optional(Type3.String({ enum: ["none", "local", "remote", "data"] })),
  avatarReason: Type3.Optional(NonEmptyString),
  emoji: Type3.Optional(NonEmptyString)
});
var AgentWaitParamsSchema = closedObject({
  runId: NonEmptyString,
  timeoutMs: Type3.Optional(Type3.Integer({ minimum: 0 }))
});
var WakeParamsSchema = Type3.Object(
  {
    mode: Type3.Union([Type3.Literal("now"), Type3.Literal("next-heartbeat")]),
    text: NonEmptyString,
    // Typed field; misspelled variants remain opaque metadata because wake
    // senders already rely on additionalProperties.
    sessionKey: Type3.Optional(NonEmptyString),
    /**
     * Optional agent id paired with `sessionKey`. Routes multi-agent setups
     * to the agent that owns the targeted session — closes the related half
     * of #46886 ("always routes to default agent").
     */
    agentId: Type3.Optional(NonEmptyString)
  },
  { additionalProperties: true }
  // external wake senders may attach opaque metadata
);

// packages/gateway-protocol/src/schema/agents-models-skills.ts
import { Type as Type4 } from "typebox";
var GatewayAgentRuntimeSchema = closedObject({
  id: NonEmptyString,
  fallback: Type4.Optional(Type4.Union([Type4.Literal("openclaw"), Type4.Literal("none")])),
  source: Type4.Union([
    Type4.Literal("env"),
    Type4.Literal("agent"),
    Type4.Literal("defaults"),
    Type4.Literal("model"),
    Type4.Literal("provider"),
    Type4.Literal("implicit"),
    Type4.Literal("session"),
    Type4.Literal("session-key")
  ])
});
var ModelChoiceSchema = closedObject({
  id: NonEmptyString,
  name: NonEmptyString,
  provider: NonEmptyString,
  alias: Type4.Optional(NonEmptyString),
  available: Type4.Optional(Type4.Boolean()),
  contextWindow: Type4.Optional(Type4.Integer({ minimum: 1 })),
  reasoning: Type4.Optional(Type4.Boolean()),
  agentRuntime: Type4.Optional(GatewayAgentRuntimeSchema),
  apiKeySupported: Type4.Optional(Type4.Boolean()),
  input: Type4.Optional(
    Type4.Array(
      Type4.Union([
        Type4.Literal("text"),
        Type4.Literal("image"),
        Type4.Literal("audio"),
        Type4.Literal("video"),
        Type4.Literal("document")
      ])
    )
  )
});
var AgentSummarySchema = closedObject({
  id: NonEmptyString,
  name: Type4.Optional(NonEmptyString),
  identity: Type4.Optional(
    closedObject({
      name: Type4.Optional(NonEmptyString),
      theme: Type4.Optional(NonEmptyString),
      emoji: Type4.Optional(NonEmptyString),
      avatar: Type4.Optional(NonEmptyString),
      avatarUrl: Type4.Optional(NonEmptyString)
    })
  ),
  workspace: Type4.Optional(NonEmptyString),
  workspaceGit: Type4.Optional(Type4.Boolean()),
  model: Type4.Optional(
    closedObject({
      primary: Type4.Optional(NonEmptyString),
      fallbacks: Type4.Optional(Type4.Array(NonEmptyString))
    })
  ),
  agentRuntime: Type4.Optional(GatewayAgentRuntimeSchema),
  thinkingLevels: Type4.Optional(
    Type4.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString
      })
    )
  ),
  thinkingOptions: Type4.Optional(Type4.Array(NonEmptyString)),
  thinkingDefault: Type4.Optional(NonEmptyString)
});
var AgentsListParamsSchema = closedObject({});
var AgentsListResultSchema = closedObject({
  defaultId: NonEmptyString,
  mainKey: NonEmptyString,
  scope: Type4.Union([Type4.Literal("per-sender"), Type4.Literal("global")]),
  agents: Type4.Array(AgentSummarySchema)
});
var AgentsCreateParamsSchema = closedObject({
  name: NonEmptyString,
  workspace: Type4.Optional(NonEmptyString),
  model: Type4.Optional(NonEmptyString),
  emoji: Type4.Optional(Type4.String()),
  avatar: Type4.Optional(Type4.String())
});
var AgentsCreateResultSchema = closedObject({
  ok: Type4.Literal(true),
  agentId: NonEmptyString,
  name: NonEmptyString,
  workspace: NonEmptyString,
  model: Type4.Optional(NonEmptyString)
});
var AgentsUpdateParamsSchema = closedObject({
  agentId: NonEmptyString,
  name: Type4.Optional(NonEmptyString),
  workspace: Type4.Optional(NonEmptyString),
  model: Type4.Optional(Type4.Union([NonEmptyString, Type4.Null()])),
  emoji: Type4.Optional(Type4.String()),
  avatar: Type4.Optional(Type4.String())
});
var AgentsUpdateResultSchema = closedObject({
  ok: Type4.Literal(true),
  agentId: NonEmptyString
});
var AgentsDeleteParamsSchema = closedObject({
  agentId: NonEmptyString,
  deleteFiles: Type4.Optional(Type4.Boolean())
});
var AgentsDeleteResultSchema = closedObject({
  ok: Type4.Literal(true),
  agentId: NonEmptyString,
  removedBindings: Type4.Integer({ minimum: 0 }),
  removed: Type4.Optional(
    Type4.Array(
      closedObject({
        path: NonEmptyString,
        method: Type4.Union([Type4.Literal("trash"), Type4.Literal("missing")])
      })
    )
  ),
  failed: Type4.Optional(
    Type4.Array(
      closedObject({
        path: NonEmptyString,
        reason: NonEmptyString
      })
    )
  )
});
var AgentsFileEntrySchema = closedObject({
  name: NonEmptyString,
  path: NonEmptyString,
  missing: Type4.Boolean(),
  size: Type4.Optional(Type4.Integer({ minimum: 0 })),
  updatedAtMs: Type4.Optional(Type4.Integer({ minimum: 0 })),
  content: Type4.Optional(Type4.String())
});
var AgentsFilesListParamsSchema = closedObject({
  agentId: NonEmptyString
});
var AgentsFilesListResultSchema = closedObject({
  agentId: NonEmptyString,
  workspace: NonEmptyString,
  files: Type4.Array(AgentsFileEntrySchema)
});
var AgentsFilesGetParamsSchema = closedObject({
  agentId: NonEmptyString,
  name: NonEmptyString
});
var AgentsFilesGetResultSchema = closedObject({
  agentId: NonEmptyString,
  workspace: NonEmptyString,
  file: AgentsFileEntrySchema
});
var AgentsFilesSetParamsSchema = closedObject({
  agentId: NonEmptyString,
  name: NonEmptyString,
  content: Type4.String()
});
var AgentsFilesSetResultSchema = closedObject({
  ok: Type4.Literal(true),
  agentId: NonEmptyString,
  workspace: NonEmptyString,
  file: AgentsFileEntrySchema
});
var ModelsListParamsSchema = closedObject({
  includeProviderCapabilities: Type4.Optional(Type4.Boolean()),
  view: Type4.Optional(
    Type4.Union([
      Type4.Literal("default"),
      Type4.Literal("configured"),
      Type4.Literal("provider-config"),
      Type4.Literal("all")
    ])
  )
});
var ModelsListResultSchema = closedObject({
  models: Type4.Array(ModelChoiceSchema)
});
var ModelsProbeParamsSchema = closedObject({
  provider: NonEmptyString,
  profileId: Type4.Optional(NonEmptyString),
  timeoutMs: Type4.Optional(Type4.Integer({ minimum: 1 }))
});
var AuthProbeStatusSchema = Type4.Union([
  Type4.Literal("ok"),
  Type4.Literal("auth"),
  Type4.Literal("rate_limit"),
  Type4.Literal("billing"),
  Type4.Literal("timeout"),
  Type4.Literal("format"),
  Type4.Literal("unknown"),
  Type4.Literal("no_model")
]);
var ModelsProbeTargetResultSchema = closedObject({
  profileId: Type4.Optional(NonEmptyString),
  label: NonEmptyString,
  status: AuthProbeStatusSchema,
  latencyMs: Type4.Optional(Type4.Integer({ minimum: 0 })),
  error: Type4.Optional(Type4.String())
});
var ModelsProbeResultSchema = closedObject({
  provider: NonEmptyString,
  status: AuthProbeStatusSchema,
  latencyMs: Type4.Optional(Type4.Integer({ minimum: 0 })),
  error: Type4.Optional(Type4.String()),
  results: Type4.Array(ModelsProbeTargetResultSchema)
});
var SkillsStatusParamsSchema = closedObject({
  agentId: Type4.Optional(NonEmptyString)
});
var SkillsBinsParamsSchema = closedObject({});
var SkillsBinsResultSchema = closedObject({
  bins: Type4.Array(NonEmptyString)
});
var Sha256String = Type4.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-fA-F0-9]{64}$"
});
var SkillUploadIdempotencyKeyString = Type4.String({
  minLength: 1,
  maxLength: 2048
});
var SkillUploadDataBase64String = Type4.String({
  minLength: 1,
  maxLength: 5592408
});
var SkillsUploadBeginParamsSchema = closedObject({
  kind: Type4.Literal("skill-archive"),
  slug: NonEmptyString,
  sizeBytes: Type4.Integer({ minimum: 1 }),
  sha256: Type4.Optional(Sha256String),
  force: Type4.Optional(Type4.Boolean()),
  idempotencyKey: Type4.Optional(SkillUploadIdempotencyKeyString)
});
var SkillsUploadChunkParamsSchema = closedObject({
  uploadId: NonEmptyString,
  offset: Type4.Integer({ minimum: 0 }),
  dataBase64: SkillUploadDataBase64String
});
var SkillsUploadCommitParamsSchema = closedObject({
  uploadId: NonEmptyString,
  sha256: Type4.Optional(Sha256String)
});
var SkillsInstallParamsSchema = Type4.Union([
  closedObject({
    agentId: Type4.Optional(NonEmptyString),
    name: NonEmptyString,
    installId: NonEmptyString,
    dangerouslyForceUnsafeInstall: Type4.Optional(
      Type4.Boolean({
        deprecated: true,
        description: "Deprecated compatibility field. Current servers ignore it; install policy is controlled by security.installPolicy."
      })
    ),
    timeoutMs: Type4.Optional(Type4.Integer({ minimum: 1e3 }))
  }),
  closedObject({
    agentId: Type4.Optional(NonEmptyString),
    source: Type4.Literal("clawhub"),
    slug: NonEmptyString,
    version: Type4.Optional(NonEmptyString),
    force: Type4.Optional(Type4.Boolean()),
    acknowledgeClawHubRisk: Type4.Optional(Type4.Boolean()),
    timeoutMs: Type4.Optional(Type4.Integer({ minimum: 1e3 }))
  }),
  closedObject({
    agentId: Type4.Optional(NonEmptyString),
    source: Type4.Literal("upload"),
    uploadId: NonEmptyString,
    slug: NonEmptyString,
    force: Type4.Optional(Type4.Boolean()),
    sha256: Type4.Optional(Sha256String),
    timeoutMs: Type4.Optional(Type4.Integer({ minimum: 1e3 }))
  })
]);
var SkillsUpdateParamsSchema = Type4.Union([
  closedObject({
    skillKey: NonEmptyString,
    enabled: Type4.Optional(Type4.Boolean()),
    apiKey: Type4.Optional(Type4.String()),
    env: Type4.Optional(Type4.Record(NonEmptyString, Type4.String()))
  }),
  closedObject({
    agentId: Type4.Optional(NonEmptyString),
    source: Type4.Literal("clawhub"),
    slug: Type4.Optional(NonEmptyString),
    all: Type4.Optional(Type4.Boolean()),
    acknowledgeClawHubRisk: Type4.Optional(Type4.Boolean())
  })
]);
var SkillsSearchParamsSchema = closedObject({
  query: Type4.Optional(NonEmptyString),
  limit: Type4.Optional(Type4.Integer({ minimum: 1, maximum: 100 }))
});
var SkillsSearchResultSchema = closedObject({
  results: Type4.Array(
    closedObject({
      score: Type4.Number(),
      slug: NonEmptyString,
      displayName: NonEmptyString,
      summary: Type4.Optional(Type4.String()),
      version: Type4.Optional(NonEmptyString),
      updatedAt: Type4.Optional(Type4.Integer())
    })
  )
});
var SkillsDetailParamsSchema = closedObject({
  slug: NonEmptyString
});
var SkillsSecurityVerdictsParamsSchema = closedObject({
  agentId: Type4.Optional(NonEmptyString)
});
var SkillsDetailResultSchema = closedObject({
  skill: Type4.Union([
    closedObject({
      slug: NonEmptyString,
      displayName: NonEmptyString,
      summary: Type4.Optional(Type4.String()),
      tags: Type4.Optional(Type4.Record(NonEmptyString, Type4.String())),
      channel: Type4.Optional(Type4.Union([Type4.String(), Type4.Null()])),
      isOfficial: Type4.Optional(Type4.Union([Type4.Boolean(), Type4.Null()])),
      createdAt: Type4.Integer(),
      updatedAt: Type4.Integer()
    }),
    Type4.Null()
  ]),
  latestVersion: Type4.Optional(
    Type4.Union([
      closedObject({
        version: NonEmptyString,
        createdAt: Type4.Integer(),
        changelog: Type4.Optional(Type4.String())
      }),
      Type4.Null()
    ])
  ),
  metadata: Type4.Optional(
    Type4.Union([
      closedObject({
        os: Type4.Optional(Type4.Union([Type4.Array(Type4.String()), Type4.Null()])),
        systems: Type4.Optional(Type4.Union([Type4.Array(Type4.String()), Type4.Null()]))
      }),
      Type4.Null()
    ])
  ),
  owner: Type4.Optional(
    Type4.Union([
      closedObject({
        handle: Type4.Optional(Type4.Union([NonEmptyString, Type4.Null()])),
        displayName: Type4.Optional(Type4.Union([NonEmptyString, Type4.Null()])),
        image: Type4.Optional(Type4.Union([Type4.String(), Type4.Null()])),
        official: Type4.Optional(Type4.Union([Type4.Boolean(), Type4.Null()])),
        channel: Type4.Optional(Type4.Union([Type4.String(), Type4.Null()])),
        isOfficial: Type4.Optional(Type4.Union([Type4.Boolean(), Type4.Null()]))
      }),
      Type4.Null()
    ])
  )
});
var SkillsSecurityVerdictsResultSchema = closedObject({
  schema: Type4.Literal("openclaw.skills.security-verdicts.v1"),
  items: Type4.Array(
    closedObject({
      registry: NonEmptyString,
      ok: Type4.Boolean(),
      decision: NonEmptyString,
      reasons: Type4.Array(Type4.String()),
      requestedSlug: NonEmptyString,
      requestedVersion: NonEmptyString,
      slug: Type4.Optional(Type4.Union([NonEmptyString, Type4.Null()])),
      version: Type4.Optional(Type4.Union([NonEmptyString, Type4.Null()])),
      displayName: Type4.Optional(Type4.Union([Type4.String(), Type4.Null()])),
      publisherHandle: Type4.Optional(Type4.Union([Type4.String(), Type4.Null()])),
      publisherDisplayName: Type4.Optional(Type4.Union([Type4.String(), Type4.Null()])),
      createdAt: Type4.Optional(Type4.Union([Type4.Integer(), Type4.Null()])),
      checkedAt: Type4.Optional(Type4.Union([Type4.Integer(), Type4.Null()])),
      skillUrl: Type4.Optional(Type4.Union([Type4.String(), Type4.Null()])),
      securityAuditUrl: Type4.Optional(Type4.Union([Type4.String(), Type4.Null()])),
      securityStatus: Type4.Optional(Type4.Union([Type4.String(), Type4.Null()])),
      securityPassed: Type4.Optional(Type4.Union([Type4.Boolean(), Type4.Null()])),
      error: Type4.Optional(
        closedObject({
          code: Type4.Optional(Type4.String()),
          message: Type4.Optional(Type4.String())
        })
      )
    })
  )
});
var SkillsSkillCardParamsSchema = closedObject({
  agentId: Type4.Optional(NonEmptyString),
  skillKey: NonEmptyString
});
var SkillsSkillCardResultSchema = closedObject({
  schema: Type4.Literal("openclaw.skills.skill-card.v1"),
  skillKey: NonEmptyString,
  path: NonEmptyString,
  sizeBytes: Type4.Integer({ minimum: 0 }),
  content: Type4.String()
});
var SkillProposalStatusSchema = Type4.Union([
  Type4.Literal("pending"),
  Type4.Literal("applied"),
  Type4.Literal("rejected"),
  Type4.Literal("quarantined"),
  Type4.Literal("stale")
]);
var SkillProposalKindSchema = Type4.Union([Type4.Literal("create"), Type4.Literal("update")]);
var SkillProposalScanStateSchema = Type4.Union([
  Type4.Literal("pending"),
  Type4.Literal("clean"),
  Type4.Literal("failed"),
  Type4.Literal("quarantined")
]);
var SkillProposalSourceSchema = Type4.Union([
  Type4.Literal("skill-workshop"),
  Type4.Literal("cli"),
  Type4.Literal("gateway")
]);
var SkillProposalContentString = Type4.String({ minLength: 1, maxLength: 1048576 });
var SkillProposalSupportFileInputSchema = closedObject({
  path: NonEmptyString,
  content: Type4.String({ maxLength: 262144 })
});
var SkillProposalSupportFileSchema = closedObject({
  path: NonEmptyString,
  sizeBytes: Type4.Integer({ minimum: 0, maximum: 262144 }),
  hash: Sha256String,
  targetExisted: Type4.Optional(Type4.Boolean()),
  targetContentHash: Type4.Optional(Sha256String)
});
var SkillProposalFindingSchema = closedObject({
  ruleId: NonEmptyString,
  severity: Type4.Union([Type4.Literal("info"), Type4.Literal("warn"), Type4.Literal("critical")]),
  file: NonEmptyString,
  line: Type4.Integer({ minimum: 1 }),
  message: NonEmptyString,
  evidence: Type4.String()
});
var SkillProposalScanSchema = closedObject({
  state: SkillProposalScanStateSchema,
  scannedAt: NonEmptyString,
  critical: Type4.Integer({ minimum: 0 }),
  warn: Type4.Integer({ minimum: 0 }),
  info: Type4.Integer({ minimum: 0 }),
  findings: Type4.Array(SkillProposalFindingSchema)
});
var SkillProposalTargetSchema = closedObject({
  skillName: NonEmptyString,
  skillKey: NonEmptyString,
  skillDir: NonEmptyString,
  skillFile: NonEmptyString,
  source: Type4.Optional(NonEmptyString),
  currentContentHash: Type4.Optional(NonEmptyString)
});
var SkillProposalOriginSchema = closedObject({
  agentId: Type4.Optional(NonEmptyString),
  sessionKey: Type4.Optional(NonEmptyString),
  runId: Type4.Optional(NonEmptyString),
  messageId: Type4.Optional(NonEmptyString)
});
var SkillProposalRecordSchema = closedObject({
  schema: Type4.Literal("openclaw.skill-workshop.proposal.v1"),
  id: NonEmptyString,
  kind: SkillProposalKindSchema,
  status: SkillProposalStatusSchema,
  title: NonEmptyString,
  description: NonEmptyString,
  createdAt: NonEmptyString,
  updatedAt: NonEmptyString,
  createdBy: SkillProposalSourceSchema,
  origin: Type4.Optional(SkillProposalOriginSchema),
  proposedVersion: NonEmptyString,
  draftFile: Type4.Literal("PROPOSAL.md"),
  draftHash: NonEmptyString,
  supportFiles: Type4.Optional(Type4.Array(SkillProposalSupportFileSchema, { maxItems: 64 })),
  target: SkillProposalTargetSchema,
  scan: SkillProposalScanSchema,
  goal: Type4.Optional(Type4.String()),
  evidence: Type4.Optional(Type4.String()),
  appliedAt: Type4.Optional(NonEmptyString),
  rejectedAt: Type4.Optional(NonEmptyString),
  quarantinedAt: Type4.Optional(NonEmptyString),
  staleAt: Type4.Optional(NonEmptyString),
  statusReason: Type4.Optional(Type4.String())
});
var SkillProposalManifestEntrySchema = closedObject({
  id: NonEmptyString,
  kind: SkillProposalKindSchema,
  status: SkillProposalStatusSchema,
  title: NonEmptyString,
  description: NonEmptyString,
  skillName: NonEmptyString,
  skillKey: NonEmptyString,
  createdAt: NonEmptyString,
  updatedAt: NonEmptyString,
  scanState: SkillProposalScanStateSchema
});
var SkillsProposalsListParamsSchema = closedObject({
  agentId: Type4.Optional(NonEmptyString)
});
var SkillsProposalsListResultSchema = closedObject({
  schema: Type4.Literal("openclaw.skill-workshop.proposals-manifest.v1"),
  updatedAt: NonEmptyString,
  proposals: Type4.Array(SkillProposalManifestEntrySchema)
});
var SkillsProposalInspectParamsSchema = closedObject({
  agentId: Type4.Optional(NonEmptyString),
  proposalId: NonEmptyString
});
var SkillsProposalInspectResultSchema = closedObject({
  record: SkillProposalRecordSchema,
  content: Type4.String(),
  supportFiles: Type4.Optional(Type4.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 }))
});
var SkillsProposalCreateParamsSchema = closedObject({
  agentId: Type4.Optional(NonEmptyString),
  name: NonEmptyString,
  description: NonEmptyString,
  content: SkillProposalContentString,
  supportFiles: Type4.Optional(Type4.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
  goal: Type4.Optional(Type4.String()),
  evidence: Type4.Optional(Type4.String())
});
var SkillsProposalUpdateParamsSchema = closedObject({
  agentId: Type4.Optional(NonEmptyString),
  skillName: NonEmptyString,
  description: Type4.Optional(NonEmptyString),
  content: SkillProposalContentString,
  supportFiles: Type4.Optional(Type4.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
  goal: Type4.Optional(Type4.String()),
  evidence: Type4.Optional(Type4.String())
});
var SkillsProposalReviseParamsSchema = closedObject({
  agentId: Type4.Optional(NonEmptyString),
  proposalId: NonEmptyString,
  content: SkillProposalContentString,
  supportFiles: Type4.Optional(Type4.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
  description: Type4.Optional(NonEmptyString),
  goal: Type4.Optional(Type4.String()),
  evidence: Type4.Optional(Type4.String())
});
var SkillsProposalRequestRevisionParamsSchema = closedObject({
  agentId: Type4.Optional(NonEmptyString),
  targetAgentId: Type4.Optional(NonEmptyString),
  proposalId: NonEmptyString,
  instructions: Type4.String({ minLength: 1, maxLength: 32768 }),
  sessionKey: NonEmptyString,
  sessionId: Type4.Optional(NonEmptyString),
  idempotencyKey: NonEmptyString
});
var SkillsProposalRequestRevisionResultSchema = Type4.Object(
  {
    runId: NonEmptyString,
    status: Type4.Union([
      Type4.Literal("started"),
      Type4.Literal("in_flight"),
      Type4.Literal("ok"),
      Type4.Literal("timeout"),
      Type4.Literal("error")
    ])
  },
  { additionalProperties: true }
);
var SkillsProposalActionParamsSchema = closedObject({
  agentId: Type4.Optional(NonEmptyString),
  proposalId: NonEmptyString,
  reason: Type4.Optional(Type4.String())
});
var SkillsProposalApplyResultSchema = closedObject({
  record: SkillProposalRecordSchema,
  targetSkillFile: NonEmptyString
});
var SkillsProposalRecordResultSchema = SkillProposalRecordSchema;
var SkillLifecycleStateSchema = Type4.Union([
  Type4.Literal("active"),
  Type4.Literal("stale"),
  Type4.Literal("archived")
]);
var SkillCuratorEntrySchema = closedObject({
  skillFile: NonEmptyString,
  skillKey: NonEmptyString,
  skillName: NonEmptyString,
  state: SkillLifecycleStateSchema,
  pinned: Type4.Boolean(),
  createdAtMs: Type4.Number(),
  stateChangedAtMs: Type4.Number(),
  lastUsedAtMs: Type4.Union([Type4.Number(), Type4.Null()]),
  useCount: Type4.Number(),
  archivedReason: Type4.Union([Type4.String(), Type4.Null()])
});
var SkillOverlapCandidateSchema = closedObject({
  left: NonEmptyString,
  right: NonEmptyString,
  score: Type4.Number()
});
var SkillsCuratorStatusParamsSchema = closedObject({});
var SkillsCuratorStatusResultSchema = closedObject({
  lastAttemptAtMs: Type4.Union([Type4.Number(), Type4.Null()]),
  lastSuccessAtMs: Type4.Union([Type4.Number(), Type4.Null()]),
  lastError: Type4.Union([Type4.String(), Type4.Null()]),
  counts: closedObject({
    active: Type4.Number(),
    stale: Type4.Number(),
    archived: Type4.Number()
  }),
  skills: Type4.Array(SkillCuratorEntrySchema),
  overlaps: Type4.Array(SkillOverlapCandidateSchema)
});
var SkillsCuratorActionParamsSchema = closedObject({ skill: NonEmptyString });
var SkillsCuratorActionResultSchema = SkillCuratorEntrySchema;
var ToolsCatalogParamsSchema = closedObject({
  agentId: Type4.Optional(NonEmptyString),
  includePlugins: Type4.Optional(Type4.Boolean())
});
var ToolsEffectiveParamsSchema = closedObject({
  agentId: Type4.Optional(NonEmptyString),
  sessionKey: NonEmptyString
});
var ToolsInvokeParamsSchema = closedObject({
  name: NonEmptyString,
  args: Type4.Optional(Type4.Record(Type4.String(), Type4.Unknown())),
  sessionKey: Type4.Optional(NonEmptyString),
  agentId: Type4.Optional(NonEmptyString),
  confirm: Type4.Optional(Type4.Boolean()),
  idempotencyKey: Type4.Optional(NonEmptyString),
  /**
   * Explicit operation-local marker for an authenticated direct operator.
   * Missing values remain delegated, and agent runtime identity wins server-side.
   */
  conversationReadOrigin: Type4.Optional(Type4.Literal("direct-operator"))
});
var ToolCatalogProfileSchema = closedObject({
  id: Type4.Union([
    Type4.Literal("minimal"),
    Type4.Literal("coding"),
    Type4.Literal("messaging"),
    Type4.Literal("full")
  ]),
  label: NonEmptyString
});
var ToolCatalogEntrySchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  description: Type4.String(),
  source: Type4.Union([Type4.Literal("core"), Type4.Literal("plugin")]),
  pluginId: Type4.Optional(NonEmptyString),
  optional: Type4.Optional(Type4.Boolean()),
  risk: Type4.Optional(
    Type4.Union([Type4.Literal("low"), Type4.Literal("medium"), Type4.Literal("high")])
  ),
  tags: Type4.Optional(Type4.Array(NonEmptyString)),
  defaultProfiles: Type4.Array(
    Type4.Union([
      Type4.Literal("minimal"),
      Type4.Literal("coding"),
      Type4.Literal("messaging"),
      Type4.Literal("full")
    ])
  )
});
var ToolCatalogGroupSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  source: Type4.Union([Type4.Literal("core"), Type4.Literal("plugin")]),
  pluginId: Type4.Optional(NonEmptyString),
  tools: Type4.Array(ToolCatalogEntrySchema)
});
var ToolsCatalogResultSchema = closedObject({
  agentId: NonEmptyString,
  profiles: Type4.Array(ToolCatalogProfileSchema),
  groups: Type4.Array(ToolCatalogGroupSchema)
});
var ToolsEffectiveEntrySchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  description: Type4.String(),
  rawDescription: Type4.String(),
  source: Type4.Union([
    Type4.Literal("core"),
    Type4.Literal("plugin"),
    Type4.Literal("channel"),
    Type4.Literal("mcp")
  ]),
  pluginId: Type4.Optional(NonEmptyString),
  channelId: Type4.Optional(NonEmptyString),
  risk: Type4.Optional(
    Type4.Union([Type4.Literal("low"), Type4.Literal("medium"), Type4.Literal("high")])
  ),
  tags: Type4.Optional(Type4.Array(NonEmptyString))
});
var ToolsEffectiveGroupSchema = closedObject({
  id: Type4.Union([
    Type4.Literal("core"),
    Type4.Literal("plugin"),
    Type4.Literal("channel"),
    Type4.Literal("mcp")
  ]),
  label: NonEmptyString,
  source: Type4.Union([
    Type4.Literal("core"),
    Type4.Literal("plugin"),
    Type4.Literal("channel"),
    Type4.Literal("mcp")
  ]),
  tools: Type4.Array(ToolsEffectiveEntrySchema)
});
var ToolsEffectiveNoticeSchema = closedObject({
  id: NonEmptyString,
  severity: Type4.Union([Type4.Literal("info"), Type4.Literal("warning")]),
  message: Type4.String()
});
var ToolsEffectiveResultSchema = closedObject({
  agentId: NonEmptyString,
  profile: NonEmptyString,
  groups: Type4.Array(ToolsEffectiveGroupSchema),
  notices: Type4.Optional(Type4.Array(ToolsEffectiveNoticeSchema))
});
var ToolsInvokeErrorSchema = closedObject({
  code: NonEmptyString,
  message: NonEmptyString,
  details: Type4.Optional(Type4.Unknown())
});
var ToolsInvokeResultSchema = closedObject({
  ok: Type4.Boolean(),
  toolName: NonEmptyString,
  output: Type4.Optional(Type4.Unknown()),
  requiresApproval: Type4.Optional(Type4.Boolean()),
  approvalId: Type4.Optional(NonEmptyString),
  source: Type4.Optional(
    Type4.Union([
      Type4.Literal("core"),
      Type4.Literal("plugin"),
      Type4.Literal("mcp"),
      Type4.Literal("channel"),
      Type4.String()
    ])
  ),
  error: Type4.Optional(ToolsInvokeErrorSchema)
});

// packages/gateway-protocol/src/schema/agents-workspace.ts
import { Type as Type5 } from "typebox";
var AgentsWorkspaceEntrySchema = closedObject({
  path: NonEmptyString,
  name: NonEmptyString,
  kind: Type5.Union([Type5.Literal("file"), Type5.Literal("directory")]),
  size: Type5.Optional(Type5.Integer({ minimum: 0 })),
  updatedAtMs: Type5.Optional(Type5.Integer({ minimum: 0 }))
});
var AgentsWorkspaceListParamsSchema = closedObject({
  agentId: NonEmptyString,
  path: Type5.Optional(Type5.String()),
  offset: Type5.Optional(Type5.Integer({ minimum: 0 })),
  limit: Type5.Optional(Type5.Integer({ minimum: 1 }))
});
var AgentsWorkspaceListResultSchema = closedObject({
  agentId: NonEmptyString,
  path: Type5.String(),
  parentPath: Type5.Optional(Type5.String()),
  entries: Type5.Array(AgentsWorkspaceEntrySchema),
  totalEntries: Type5.Integer({ minimum: 0 }),
  offset: Type5.Integer({ minimum: 0 })
});
var AgentsWorkspaceFileSchema = closedObject({
  path: NonEmptyString,
  name: NonEmptyString,
  size: Type5.Integer({ minimum: 0 }),
  updatedAtMs: Type5.Integer({ minimum: 0 }),
  mimeType: NonEmptyString,
  encoding: Type5.Union([Type5.Literal("utf8"), Type5.Literal("base64")]),
  content: Type5.String()
});
var AgentsWorkspaceGetParamsSchema = closedObject({
  agentId: NonEmptyString,
  path: NonEmptyString
});
var AgentsWorkspaceGetResultSchema = closedObject({
  agentId: NonEmptyString,
  file: AgentsWorkspaceFileSchema
});

// packages/gateway-protocol/src/schema/artifacts.ts
import { Type as Type6 } from "typebox";
var ArtifactQueryParamsProperties = {
  sessionKey: Type6.Optional(NonEmptyString),
  runId: Type6.Optional(NonEmptyString),
  taskId: Type6.Optional(NonEmptyString),
  agentId: Type6.Optional(NonEmptyString)
};
var ArtifactQueryParamsSchema = closedObject(ArtifactQueryParamsProperties);
var ArtifactGetParamsSchema = closedObject({
  ...ArtifactQueryParamsProperties,
  artifactId: NonEmptyString
});
var ArtifactSummarySchema = closedObject({
  id: NonEmptyString,
  type: NonEmptyString,
  title: NonEmptyString,
  mimeType: Type6.Optional(NonEmptyString),
  sizeBytes: Type6.Optional(Type6.Integer({ minimum: 0 })),
  sessionKey: Type6.Optional(NonEmptyString),
  runId: Type6.Optional(NonEmptyString),
  taskId: Type6.Optional(NonEmptyString),
  messageSeq: Type6.Optional(Type6.Integer({ minimum: 1 })),
  source: Type6.Optional(NonEmptyString),
  download: closedObject({
    mode: Type6.Union([Type6.Literal("bytes"), Type6.Literal("url"), Type6.Literal("unsupported")])
  })
});
var ArtifactsListParamsSchema = ArtifactQueryParamsSchema;
var ArtifactsListResultSchema = closedObject({
  artifacts: Type6.Array(ArtifactSummarySchema)
});
var ArtifactsGetParamsSchema = ArtifactGetParamsSchema;
var ArtifactsGetResultSchema = closedObject({
  artifact: ArtifactSummarySchema
});
var ArtifactsDownloadParamsSchema = ArtifactGetParamsSchema;
var ArtifactsDownloadResultSchema = closedObject({
  artifact: ArtifactSummarySchema,
  encoding: Type6.Optional(Type6.Literal("base64")),
  data: Type6.Optional(Type6.String()),
  url: Type6.Optional(NonEmptyString)
});

// packages/gateway-protocol/src/schema/approvals.ts
import { Type as Type7 } from "typebox";

// packages/gateway-protocol/src/schema/approval-id.ts
var APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN = "^(?!\\.{1,2}$)(?:[^\\uD800-\\uDFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF])+$";
function isWellFormedApprovalId(value) {
  if (value.length === 0 || value === "." || value === "..") {
    return false;
  }
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit >= 55296 && codeUnit <= 56319) {
      if (index + 1 >= value.length) {
        return false;
      }
      const next = value.charCodeAt(index + 1);
      if (next < 56320 || next > 57343) {
        return false;
      }
      index += 1;
    } else if (codeUnit >= 56320 && codeUnit <= 57343) {
      return false;
    }
  }
  return true;
}

// packages/gateway-protocol/src/schema/since.ts
function withSince(train, schema) {
  Object.assign(schema, { "x-openclaw-since": train });
  return schema;
}

// packages/gateway-protocol/src/schema/approvals.ts
var ApprovalIdSchema = Type7.String({
  minLength: 1,
  pattern: APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN,
  description: "Exact full approval id encoded safely in deep-link paths."
});
var ApprovalKindSchema = Type7.Union([
  Type7.Literal("exec"),
  Type7.Literal("plugin"),
  Type7.Literal("system-agent")
]);
var ApprovalDecisionSchema = Type7.Union([
  Type7.Literal("allow-once"),
  Type7.Literal("allow-always"),
  Type7.Literal("deny")
]);
var ApprovalAllowDecisionSchema = Type7.Union([
  Type7.Literal("allow-once"),
  Type7.Literal("allow-always")
]);
var ApprovalTerminalReasonSchema = Type7.Union([
  Type7.Literal("user"),
  Type7.Literal("timeout"),
  Type7.Literal("malformed-verdict"),
  Type7.Literal("no-route"),
  Type7.Literal("run-aborted"),
  Type7.Literal("gateway-restart"),
  Type7.Literal("storage-corrupt")
]);
var ApprovalAllowedReasonSchema = Type7.Union([Type7.Literal("user")]);
var ApprovalDeniedReasonSchema = Type7.Union([
  Type7.Literal("user"),
  Type7.Literal("malformed-verdict"),
  Type7.Literal("no-route"),
  Type7.Literal("storage-corrupt")
]);
var ApprovalExpiredReasonSchema = Type7.Union([Type7.Literal("timeout")]);
var ApprovalCancelledReasonSchema = Type7.Union([
  Type7.Literal("run-aborted"),
  Type7.Literal("gateway-restart")
]);
var PluginApprovalSeveritySchema = Type7.Union([
  Type7.Literal("info"),
  Type7.Literal("warning"),
  Type7.Literal("critical")
]);
var ApprovalAllowedDecisionsSchema = Type7.Array(ApprovalDecisionSchema, {
  minItems: 1,
  maxItems: 3,
  uniqueItems: true,
  contains: Type7.Literal("deny"),
  description: "Available reviewer decisions. Deny is always available so malformed or unsafe input can fail closed."
});
var SystemAgentApprovalAllowedDecisionsSchema = Type7.Tuple([
  Type7.Literal("allow-once"),
  Type7.Literal("deny")
]);
var ExecApprovalPresentationSchema = Type7.Object(
  {
    kind: Type7.Literal("exec"),
    commandText: NonEmptyString,
    commandPreview: Type7.Optional(Type7.Union([Type7.String(), Type7.Null()])),
    warningText: Type7.Optional(Type7.Union([Type7.String(), Type7.Null()])),
    host: Type7.Optional(Type7.Union([Type7.String(), Type7.Null()])),
    nodeId: Type7.Optional(Type7.Union([NonEmptyString, Type7.Null()])),
    agentId: Type7.Optional(Type7.Union([NonEmptyString, Type7.Null()])),
    allowedDecisions: ApprovalAllowedDecisionsSchema
  },
  {
    additionalProperties: false,
    description: "Reviewer-safe exec presentation. Runtime cwd, environment, system-run binding, and execution plan are intentionally excluded."
  }
);
var PluginApprovalPresentationSchema = closedObject({
  kind: Type7.Literal("plugin"),
  title: Type7.String({ minLength: 1, maxLength: 80 }),
  description: Type7.String({ minLength: 1, maxLength: 512 }),
  severity: PluginApprovalSeveritySchema,
  pluginId: Type7.Optional(Type7.Union([NonEmptyString, Type7.Null()])),
  toolName: Type7.Optional(Type7.Union([NonEmptyString, Type7.Null()])),
  agentId: Type7.Optional(Type7.Union([NonEmptyString, Type7.Null()])),
  allowedDecisions: ApprovalAllowedDecisionsSchema
});
var SystemAgentApprovalPresentationSchema = closedObject({
  kind: Type7.Literal("system-agent"),
  title: Type7.String({ minLength: 1, maxLength: 80 }),
  description: Type7.String({ minLength: 1, maxLength: 512 }),
  proposalHash: Type7.String({ pattern: "^[a-f0-9]{64}$" }),
  agentId: Type7.Optional(Type7.Union([NonEmptyString, Type7.Null()])),
  allowedDecisions: SystemAgentApprovalAllowedDecisionsSchema
});
var ApprovalPresentationSchema = Type7.Union([
  ExecApprovalPresentationSchema,
  PluginApprovalPresentationSchema,
  SystemAgentApprovalPresentationSchema
]);
var ApprovalRecordCommonFields = {
  id: ApprovalIdSchema,
  urlPath: NonEmptyString,
  createdAtMs: Type7.Integer({ minimum: 0 }),
  expiresAtMs: Type7.Integer({ minimum: 0 }),
  presentation: ApprovalPresentationSchema
};
var ApprovalHistorySourceAttributionSchema = closedObject({
  agentId: Type7.Optional(NonEmptyString),
  sessionKey: Type7.Optional(NonEmptyString)
});
var ApprovalHistoryResolverAttributionSchema = closedObject({
  kind: Type7.Union([
    Type7.Literal("device"),
    Type7.Literal("channel"),
    Type7.Literal("runtime"),
    Type7.Literal("system")
  ]),
  id: Type7.Optional(NonEmptyString)
});
var ApprovalResolutionFields = {
  resolvedAtMs: Type7.Integer({ minimum: 0 }),
  source: Type7.Optional(ApprovalHistorySourceAttributionSchema),
  resolver: Type7.Optional(ApprovalHistoryResolverAttributionSchema)
};
var PendingApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  status: Type7.Literal("pending")
});
var AllowedApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type7.Literal("allowed"),
  decision: ApprovalAllowDecisionSchema,
  reason: ApprovalAllowedReasonSchema
});
var DeniedApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type7.Literal("denied"),
  decision: Type7.Literal("deny"),
  reason: ApprovalDeniedReasonSchema
});
var ExpiredApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type7.Literal("expired"),
  reason: ApprovalExpiredReasonSchema
});
var CancelledApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type7.Literal("cancelled"),
  reason: ApprovalCancelledReasonSchema
});
var ApprovalSnapshotSchema = Type7.Union([
  PendingApprovalSnapshotSchema,
  AllowedApprovalSnapshotSchema,
  DeniedApprovalSnapshotSchema,
  ExpiredApprovalSnapshotSchema,
  CancelledApprovalSnapshotSchema
]);
var TerminalApprovalSnapshotSchema = Type7.Union([
  AllowedApprovalSnapshotSchema,
  DeniedApprovalSnapshotSchema,
  ExpiredApprovalSnapshotSchema,
  CancelledApprovalSnapshotSchema
]);
var ApprovalGetParamsSchema = closedObject({ id: ApprovalRecordCommonFields.id });
var ApprovalGetResultSchema = closedObject({ approval: ApprovalSnapshotSchema });
var ApprovalHistoryParamsSchema = closedObject({
  cursor: Type7.Optional(Type7.String({ minLength: 1, maxLength: 512 })),
  limit: Type7.Optional(Type7.Integer({ minimum: 1, maximum: 100 })),
  kind: Type7.Optional(ApprovalKindSchema)
});
var ApprovalHistoryResultSchema = closedObject({
  items: Type7.Array(TerminalApprovalSnapshotSchema),
  nextCursor: Type7.Optional(Type7.String({ minLength: 1, maxLength: 512 }))
});
var ApprovalResolveParamsSchema = closedObject({
  id: ApprovalRecordCommonFields.id,
  kind: ApprovalKindSchema,
  decision: ApprovalDecisionSchema
});
var ApprovalResolveResultSchema = closedObject({
  applied: Type7.Boolean(),
  approval: TerminalApprovalSnapshotSchema
});
var SessionApprovalEventCommonFields = {
  sessionKey: NonEmptyString,
  sourceSessionKey: Type7.Optional(NonEmptyString),
  updatedAtMs: Type7.Integer({ minimum: 0 })
};
var PendingSessionApprovalEventSchema = withSince(
  "2026.7",
  closedObject({
    ...SessionApprovalEventCommonFields,
    phase: Type7.Literal("pending"),
    approval: PendingApprovalSnapshotSchema
  })
);
var TerminalSessionApprovalEventSchema = withSince(
  "2026.7",
  closedObject({
    ...SessionApprovalEventCommonFields,
    phase: Type7.Literal("terminal"),
    approval: TerminalApprovalSnapshotSchema
  })
);
var SessionApprovalEventSchema = withSince(
  "2026.7",
  Type7.Union([PendingSessionApprovalEventSchema, TerminalSessionApprovalEventSchema])
);
var SessionApprovalReplaySchema = withSince(
  "2026.7",
  closedObject({
    sessionKey: NonEmptyString,
    updatedAtMs: Type7.Integer({ minimum: 0 }),
    approvals: Type7.Array(PendingApprovalSnapshotSchema),
    truncated: Type7.Boolean()
  })
);

// packages/gateway-protocol/src/schema/audit-activity.ts
import { Type as Type8 } from "typebox";
var AuditActivitySchemaVersionV1Schema = Type8.Integer({ minimum: 1, maximum: 1 });
var AuditActivityStatusV1Schema = Type8.Union([
  Type8.Literal("started"),
  Type8.Literal("succeeded"),
  Type8.Literal("failed"),
  Type8.Literal("cancelled"),
  Type8.Literal("timed_out"),
  Type8.Literal("blocked"),
  Type8.Literal("unknown")
]);
var AuditActivityKindV1Schema = Type8.Union([
  Type8.Literal("agent_run"),
  Type8.Literal("tool_action"),
  Type8.Literal("message")
]);
var AuditActivityDirectionV1Schema = Type8.Union([
  Type8.Literal("inbound"),
  Type8.Literal("outbound")
]);
var AuditActivityConversationKindV1Schema = Type8.Union([
  Type8.Literal("direct"),
  Type8.Literal("group"),
  Type8.Literal("channel"),
  Type8.Literal("unknown")
]);
var AuditActivityHmacRefV1Schema = Type8.String({
  pattern: "^hmac-sha256:v1:[a-f0-9]{32}:[a-f0-9]{64}$"
});
var AuditActivityAgentActorV1Schema = closedObject({
  type: Type8.Union([Type8.Literal("agent"), Type8.Literal("system")]),
  id: NonEmptyString
});
var AuditActivityInboundActorV1Schema = Type8.Union([
  closedObject({
    type: Type8.Literal("channel_sender"),
    id: AuditActivityHmacRefV1Schema
  }),
  closedObject({
    type: Type8.Literal("system"),
    id: NonEmptyString
  })
]);
var AuditActivityOutboundActorV1Schema = closedObject({
  type: Type8.Union([Type8.Literal("agent"), Type8.Literal("system")]),
  id: NonEmptyString
});
var commonProperties = {
  schemaVersion: AuditActivitySchemaVersionV1Schema,
  eventId: NonEmptyString,
  sequence: Type8.Integer({ minimum: 1 }),
  sourceSequence: Type8.Integer({ minimum: 1 }),
  occurredAt: Type8.Integer({ minimum: 0 }),
  redaction: Type8.Literal("metadata_only")
};
var agentProperties = {
  actor: AuditActivityAgentActorV1Schema,
  agentId: NonEmptyString,
  sessionKey: Type8.Optional(NonEmptyString),
  sessionId: Type8.Optional(NonEmptyString),
  runId: NonEmptyString
};
var messageProperties = {
  channel: NonEmptyString,
  conversationKind: AuditActivityConversationKindV1Schema,
  durationMs: Type8.Optional(Type8.Integer({ minimum: 0 })),
  resultCount: Type8.Optional(Type8.Integer({ minimum: 0 })),
  agentId: Type8.Optional(NonEmptyString),
  runId: Type8.Optional(NonEmptyString),
  accountRef: Type8.Optional(AuditActivityHmacRefV1Schema),
  conversationRef: Type8.Optional(AuditActivityHmacRefV1Schema),
  messageRef: Type8.Optional(AuditActivityHmacRefV1Schema),
  targetRef: Type8.Optional(AuditActivityHmacRefV1Schema)
};
function correlatedObject(properties, variants) {
  return Type8.Object(properties, { additionalProperties: false, allOf: [variants] });
}
function withoutField(field) {
  return { not: { required: [field] } };
}
var withoutErrorCode = withoutField("errorCode");
var withoutReasonCode = withoutField("reasonCode");
var withoutFailureStage = withoutField("failureStage");
var withoutDeliveryKind = withoutField("deliveryKind");
var agentRunProperties = {
  eventType: Type8.Literal("agent_run"),
  ...commonProperties,
  ...agentProperties,
  kind: Type8.Literal("agent_run")
};
var AuditActivityAgentRunV1Schema = correlatedObject(
  {
    ...agentRunProperties,
    action: Type8.Union([Type8.Literal("agent.run.started"), Type8.Literal("agent.run.finished")]),
    status: Type8.Union([
      Type8.Literal("started"),
      Type8.Literal("succeeded"),
      Type8.Literal("failed"),
      Type8.Literal("cancelled"),
      Type8.Literal("timed_out"),
      Type8.Literal("blocked")
    ]),
    errorCode: Type8.Optional(
      Type8.Union([
        Type8.Literal("run_failed"),
        Type8.Literal("run_cancelled"),
        Type8.Literal("run_timed_out"),
        Type8.Literal("run_blocked")
      ])
    )
  },
  Type8.Union([
    Type8.Intersect([
      Type8.Object({
        action: Type8.Literal("agent.run.started"),
        status: Type8.Literal("started")
      }),
      withoutErrorCode
    ]),
    Type8.Intersect([
      Type8.Object({
        action: Type8.Literal("agent.run.finished"),
        status: Type8.Literal("succeeded")
      }),
      withoutErrorCode
    ]),
    Type8.Object({
      action: Type8.Literal("agent.run.finished"),
      status: Type8.Literal("failed"),
      errorCode: Type8.Literal("run_failed")
    }),
    Type8.Object({
      action: Type8.Literal("agent.run.finished"),
      status: Type8.Literal("cancelled"),
      errorCode: Type8.Literal("run_cancelled")
    }),
    Type8.Object({
      action: Type8.Literal("agent.run.finished"),
      status: Type8.Literal("timed_out"),
      errorCode: Type8.Literal("run_timed_out")
    }),
    Type8.Object({
      action: Type8.Literal("agent.run.finished"),
      status: Type8.Literal("blocked"),
      errorCode: Type8.Literal("run_blocked")
    })
  ])
);
var toolActionProperties = {
  eventType: Type8.Literal("tool_action"),
  ...commonProperties,
  ...agentProperties,
  kind: Type8.Literal("tool_action"),
  toolCallId: Type8.Optional(NonEmptyString),
  toolName: Type8.Optional(NonEmptyString)
};
var AuditActivityToolActionV1Schema = correlatedObject(
  {
    ...toolActionProperties,
    action: Type8.Union([Type8.Literal("tool.action.started"), Type8.Literal("tool.action.finished")]),
    status: AuditActivityStatusV1Schema,
    errorCode: Type8.Optional(
      Type8.Union([
        Type8.Literal("tool_failed"),
        Type8.Literal("tool_cancelled"),
        Type8.Literal("tool_timed_out"),
        Type8.Literal("tool_blocked"),
        Type8.Literal("tool_outcome_unknown")
      ])
    )
  },
  Type8.Union([
    Type8.Intersect([
      Type8.Object({
        action: Type8.Literal("tool.action.started"),
        status: Type8.Literal("started")
      }),
      withoutErrorCode
    ]),
    Type8.Intersect([
      Type8.Object({
        action: Type8.Literal("tool.action.finished"),
        status: Type8.Literal("succeeded")
      }),
      withoutErrorCode
    ]),
    Type8.Object({
      action: Type8.Literal("tool.action.finished"),
      status: Type8.Literal("failed"),
      errorCode: Type8.Literal("tool_failed")
    }),
    Type8.Object({
      action: Type8.Literal("tool.action.finished"),
      status: Type8.Literal("cancelled"),
      errorCode: Type8.Literal("tool_cancelled")
    }),
    Type8.Object({
      action: Type8.Literal("tool.action.finished"),
      status: Type8.Literal("timed_out"),
      errorCode: Type8.Literal("tool_timed_out")
    }),
    Type8.Object({
      action: Type8.Literal("tool.action.finished"),
      status: Type8.Literal("blocked"),
      errorCode: Type8.Literal("tool_blocked")
    }),
    Type8.Object({
      action: Type8.Literal("tool.action.finished"),
      status: Type8.Literal("unknown"),
      errorCode: Type8.Literal("tool_outcome_unknown")
    })
  ])
);
var inboundMessageProperties = {
  eventType: Type8.Literal("inbound_message"),
  ...commonProperties,
  ...messageProperties,
  kind: Type8.Literal("message"),
  action: Type8.Literal("message.inbound.processed"),
  direction: Type8.Literal("inbound"),
  actor: AuditActivityInboundActorV1Schema
};
var inboundCompletedReasonSchema = Type8.Union([
  Type8.Literal("fast_abort"),
  Type8.Literal("plugin_bound_handled"),
  Type8.Literal("plugin_bound_unavailable"),
  Type8.Literal("plugin_bound_declined"),
  Type8.Literal("before_dispatch_handled"),
  Type8.Literal("acp_dispatch_completed"),
  Type8.Literal("acp_dispatch_empty")
]);
var inboundSkippedReasonSchema = Type8.Union([
  Type8.Literal("duplicate"),
  Type8.Literal("reply_operation_active"),
  Type8.Literal("reply_operation_aborted"),
  Type8.Literal("acp_dispatch_aborted")
]);
var inboundFailureReasonSchema = Type8.Union([
  Type8.Literal("acp_dispatch_failed"),
  Type8.Literal("plugin_bound_error")
]);
var AuditActivityInboundMessageV1Schema = correlatedObject(
  {
    ...inboundMessageProperties,
    status: Type8.Union([
      Type8.Literal("succeeded"),
      Type8.Literal("blocked"),
      Type8.Literal("failed")
    ]),
    outcome: Type8.Union([
      Type8.Literal("completed"),
      Type8.Literal("skipped"),
      Type8.Literal("failed")
    ]),
    errorCode: Type8.Optional(Type8.Literal("message_processing_failed")),
    reasonCode: Type8.Optional(
      Type8.Union([
        ...inboundCompletedReasonSchema.anyOf,
        ...inboundSkippedReasonSchema.anyOf,
        ...inboundFailureReasonSchema.anyOf
      ])
    )
  },
  Type8.Union([
    Type8.Intersect([
      Type8.Object({
        status: Type8.Literal("succeeded"),
        outcome: Type8.Literal("completed"),
        reasonCode: Type8.Optional(inboundCompletedReasonSchema)
      }),
      withoutErrorCode
    ]),
    Type8.Intersect([
      Type8.Object({
        status: Type8.Literal("blocked"),
        outcome: Type8.Literal("skipped"),
        reasonCode: Type8.Optional(inboundSkippedReasonSchema)
      }),
      withoutErrorCode
    ]),
    Type8.Object({
      status: Type8.Literal("failed"),
      outcome: Type8.Literal("failed"),
      errorCode: Type8.Literal("message_processing_failed"),
      reasonCode: Type8.Optional(inboundFailureReasonSchema)
    })
  ])
);
var outboundMessageProperties = {
  eventType: Type8.Literal("outbound_message"),
  ...commonProperties,
  ...messageProperties,
  kind: Type8.Literal("message"),
  action: Type8.Literal("message.outbound.finished"),
  direction: Type8.Literal("outbound"),
  actor: AuditActivityOutboundActorV1Schema,
  deliveryKind: Type8.Optional(
    Type8.Union([Type8.Literal("text"), Type8.Literal("media"), Type8.Literal("other")])
  )
};
var outboundSuppressedReasonSchema = Type8.Union([
  Type8.Literal("cancelled_by_message_sending_hook"),
  Type8.Literal("cancelled_by_reply_payload_sending_hook"),
  Type8.Literal("empty_after_message_sending_hook"),
  Type8.Literal("empty_after_reply_payload_sending_hook"),
  Type8.Literal("no_visible_payload")
]);
var outboundFailureStageSchema = Type8.Union([
  Type8.Literal("platform_send"),
  Type8.Literal("queue"),
  Type8.Literal("unknown")
]);
var outboundFailureErrorSchema = Type8.Union([
  Type8.Literal("message_delivery_failed"),
  Type8.Literal("message_delivery_partial_failure")
]);
var AuditActivityOutboundMessageV1Schema = correlatedObject(
  {
    ...outboundMessageProperties,
    status: Type8.Union([
      Type8.Literal("succeeded"),
      Type8.Literal("blocked"),
      Type8.Literal("failed"),
      Type8.Literal("unknown")
    ]),
    outcome: Type8.Union([
      Type8.Literal("sent"),
      Type8.Literal("suppressed"),
      Type8.Literal("failed"),
      Type8.Literal("unknown")
    ]),
    errorCode: Type8.Optional(outboundFailureErrorSchema),
    reasonCode: Type8.Optional(outboundSuppressedReasonSchema),
    failureStage: Type8.Optional(outboundFailureStageSchema)
  },
  Type8.Union([
    Type8.Intersect([
      Type8.Object({ status: Type8.Literal("succeeded"), outcome: Type8.Literal("sent") }),
      withoutErrorCode,
      withoutReasonCode,
      withoutFailureStage
    ]),
    Type8.Intersect([
      Type8.Object({
        status: Type8.Literal("blocked"),
        outcome: Type8.Literal("suppressed"),
        reasonCode: outboundSuppressedReasonSchema
      }),
      withoutErrorCode,
      withoutFailureStage,
      withoutDeliveryKind
    ]),
    Type8.Intersect([
      Type8.Object({
        status: Type8.Literal("failed"),
        outcome: Type8.Literal("failed"),
        errorCode: outboundFailureErrorSchema,
        failureStage: outboundFailureStageSchema
      }),
      withoutReasonCode
    ]),
    Type8.Intersect([
      Type8.Object({
        status: Type8.Literal("unknown"),
        outcome: Type8.Literal("unknown"),
        failureStage: outboundFailureStageSchema
      }),
      withoutErrorCode,
      withoutReasonCode,
      withoutDeliveryKind
    ])
  ])
);
var AuditActivityEventV1Schema = Type8.Union([
  AuditActivityAgentRunV1Schema,
  AuditActivityToolActionV1Schema,
  AuditActivityInboundMessageV1Schema,
  AuditActivityOutboundMessageV1Schema
]);
var AuditActivityListParamsSchema = closedObject({
  agentId: Type8.Optional(NonEmptyString),
  sessionKey: Type8.Optional(NonEmptyString),
  runId: Type8.Optional(NonEmptyString),
  kind: Type8.Optional(AuditActivityKindV1Schema),
  status: Type8.Optional(AuditActivityStatusV1Schema),
  direction: Type8.Optional(AuditActivityDirectionV1Schema),
  channel: Type8.Optional(NonEmptyString),
  after: Type8.Optional(Type8.Integer({ minimum: 0 })),
  before: Type8.Optional(Type8.Integer({ minimum: 0 })),
  limit: Type8.Optional(Type8.Integer({ minimum: 1, maximum: 500 })),
  cursor: Type8.Optional(NonEmptyString)
});
var AuditActivityListResultSchema = closedObject({
  events: Type8.Array(AuditActivityEventV1Schema),
  nextCursor: Type8.Optional(NonEmptyString)
});

// packages/gateway-protocol/src/schema/audit.ts
import { Type as Type9 } from "typebox";
var AuditEventKindSchema = Type9.Union([Type9.Literal("agent_run"), Type9.Literal("tool_action")]);
var AuditEventActionSchema = Type9.Union([
  Type9.Literal("agent.run.started"),
  Type9.Literal("agent.run.finished"),
  Type9.Literal("tool.action.started"),
  Type9.Literal("tool.action.finished")
]);
var AuditEventStatusSchema = Type9.Union([
  Type9.Literal("started"),
  Type9.Literal("succeeded"),
  Type9.Literal("failed"),
  Type9.Literal("cancelled"),
  Type9.Literal("timed_out"),
  Type9.Literal("blocked"),
  Type9.Literal("unknown")
]);
var AuditEventErrorCodeSchema = Type9.Union([
  Type9.Literal("run_failed"),
  Type9.Literal("run_cancelled"),
  Type9.Literal("run_timed_out"),
  Type9.Literal("run_blocked"),
  Type9.Literal("tool_failed"),
  Type9.Literal("tool_cancelled"),
  Type9.Literal("tool_timed_out"),
  Type9.Literal("tool_blocked"),
  Type9.Literal("tool_outcome_unknown")
]);
var AuditEventSchema = closedObject({
  eventId: NonEmptyString,
  sequence: Type9.Integer({ minimum: 1 }),
  sourceSequence: Type9.Integer({ minimum: 1 }),
  occurredAt: Type9.Integer({ minimum: 0 }),
  kind: AuditEventKindSchema,
  action: AuditEventActionSchema,
  status: AuditEventStatusSchema,
  errorCode: Type9.Optional(AuditEventErrorCodeSchema),
  actor: closedObject({
    type: Type9.Union([Type9.Literal("agent"), Type9.Literal("system")]),
    id: NonEmptyString
  }),
  agentId: NonEmptyString,
  sessionKey: Type9.Optional(NonEmptyString),
  sessionId: Type9.Optional(NonEmptyString),
  runId: NonEmptyString,
  toolCallId: Type9.Optional(NonEmptyString),
  toolName: Type9.Optional(NonEmptyString),
  redaction: Type9.Literal("metadata_only")
});
var AuditListParamsSchema = closedObject({
  agentId: Type9.Optional(NonEmptyString),
  sessionKey: Type9.Optional(NonEmptyString),
  runId: Type9.Optional(NonEmptyString),
  kind: Type9.Optional(AuditEventKindSchema),
  status: Type9.Optional(AuditEventStatusSchema),
  after: Type9.Optional(Type9.Integer({ minimum: 0 })),
  before: Type9.Optional(Type9.Integer({ minimum: 0 })),
  limit: Type9.Optional(Type9.Integer({ minimum: 1, maximum: 500 })),
  cursor: Type9.Optional(NonEmptyString)
});
var AuditListResultSchema = closedObject({
  events: Type9.Array(AuditEventSchema),
  nextCursor: Type9.Optional(NonEmptyString)
});

// packages/gateway-protocol/src/schema/board.ts
import { Type as Type10 } from "typebox";
var BoardTabIdSchema = Type10.String({ pattern: "^[a-z0-9-]{1,40}$" });
var BoardWidgetNameSchema = Type10.String({
  pattern: "^[a-z0-9][a-z0-9._-]{0,63}$"
});
var BoardChatDockSchema = Type10.Union([
  Type10.Literal("left"),
  Type10.Literal("right"),
  Type10.Literal("bottom"),
  Type10.Literal("hidden")
]);
var BoardSizeSchema = Type10.Union([
  Type10.Literal("sm"),
  Type10.Literal("md"),
  Type10.Literal("lg"),
  Type10.Literal("xl"),
  Type10.Literal("full")
]);
var BOARD_CRON_JOB_ID_MAX_LENGTH = 256;
var BOARD_CRON_TRIGGER_PREFIX = "cron.trigger:";
var BOARD_WIDGET_TOOL_MAX_LENGTH = BOARD_CRON_TRIGGER_PREFIX.length + BOARD_CRON_JOB_ID_MAX_LENGTH;
var BoardTabSchema = closedObject({
  tabId: BoardTabIdSchema,
  title: Type10.String({ minLength: 1, maxLength: 80 }),
  position: Type10.Integer({ minimum: 0 }),
  chatDock: BoardChatDockSchema
});
var BoardWidgetDeclaredSchema = closedObject({
  netOrigins: Type10.Optional(
    Type10.Array(Type10.String({ minLength: 1, maxLength: 2048 }), { maxItems: 32 })
  ),
  tools: Type10.Optional(
    Type10.Array(Type10.String({ minLength: 1, maxLength: BOARD_WIDGET_TOOL_MAX_LENGTH }), {
      maxItems: 64
    })
  )
});
var BoardWidgetSchema = closedObject({
  name: BoardWidgetNameSchema,
  tabId: BoardTabIdSchema,
  title: Type10.Optional(Type10.String({ minLength: 1, maxLength: 80 })),
  contentKind: Type10.Union([Type10.Literal("html"), Type10.Literal("mcp-app")]),
  sizeW: Type10.Integer({ minimum: 1, maximum: 12 }),
  sizeH: Type10.Integer({ minimum: 1, maximum: 20 }),
  position: Type10.Integer({ minimum: 0 }),
  grantState: Type10.Union([
    Type10.Literal("none"),
    Type10.Literal("pending"),
    Type10.Literal("granted"),
    Type10.Literal("rejected")
  ]),
  revision: Type10.Integer({ minimum: 1 }),
  instanceId: Type10.Optional(NonEmptyString),
  declaredSummary: Type10.Optional(Type10.Array(Type10.String())),
  declared: Type10.Optional(BoardWidgetDeclaredSchema),
  frameUrl: Type10.Optional(Type10.String()),
  viewTicket: Type10.Optional(Type10.String()),
  viewTicketTtlMs: Type10.Optional(Type10.Integer({ minimum: 1 })),
  viewGeneration: Type10.Optional(Type10.String({ pattern: "^[a-f0-9]{32}$" })),
  sandboxUrl: Type10.Optional(Type10.String()),
  sandboxPort: Type10.Optional(Type10.Integer({ minimum: 1, maximum: 65535 })),
  sandboxOrigin: Type10.Optional(Type10.String())
});
var BoardSnapshotSchema = closedObject({
  sessionKey: NonEmptyString,
  revision: Type10.Integer({ minimum: 0 }),
  tabs: Type10.Array(BoardTabSchema),
  widgets: Type10.Array(BoardWidgetSchema)
});
var BoardTabCreateOpSchema = closedObject({
  kind: Type10.Literal("tab_create"),
  tabId: BoardTabIdSchema,
  title: Type10.String({ minLength: 1, maxLength: 80 }),
  chatDock: Type10.Optional(BoardChatDockSchema)
});
var BoardTabUpdateOpSchema = closedObject({
  kind: Type10.Literal("tab_update"),
  tabId: BoardTabIdSchema,
  title: Type10.Optional(Type10.String({ minLength: 1, maxLength: 80 })),
  chatDock: Type10.Optional(BoardChatDockSchema),
  position: Type10.Optional(Type10.Integer({ minimum: 0 }))
});
var BoardTabDeleteOpSchema = closedObject({
  kind: Type10.Literal("tab_delete"),
  tabId: BoardTabIdSchema
});
var BoardTabsReorderOpSchema = closedObject({
  kind: Type10.Literal("tabs_reorder"),
  tabIds: Type10.Array(BoardTabIdSchema)
});
var BoardWidgetMoveOpSchema = closedObject({
  kind: Type10.Literal("widget_move"),
  name: BoardWidgetNameSchema,
  tabId: Type10.Optional(BoardTabIdSchema),
  position: Type10.Optional(Type10.Integer({ minimum: 0 })),
  after: Type10.Optional(BoardWidgetNameSchema)
});
var BoardWidgetResizeOpSchema = closedObject({
  kind: Type10.Literal("widget_resize"),
  name: BoardWidgetNameSchema,
  sizeW: Type10.Integer(),
  sizeH: Type10.Integer()
});
var BoardWidgetRemoveOpSchema = closedObject({
  kind: Type10.Literal("widget_remove"),
  name: BoardWidgetNameSchema
});
var BoardOpSchema = Type10.Union([
  BoardTabCreateOpSchema,
  BoardTabUpdateOpSchema,
  BoardTabDeleteOpSchema,
  BoardTabsReorderOpSchema,
  BoardWidgetMoveOpSchema,
  BoardWidgetResizeOpSchema,
  BoardWidgetRemoveOpSchema
]);
var BoardGetParamsSchema = closedObject({ sessionKey: NonEmptyString });
var BoardUpdateParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  ops: Type10.Array(BoardOpSchema)
});
var BoardMcpAppDescriptorSchema = closedObject({
  serverName: NonEmptyString,
  toolName: NonEmptyString,
  uiResourceUri: NonEmptyString,
  toolCallId: NonEmptyString
});
var BoardWidgetHtmlContentSchema = closedObject({
  kind: Type10.Literal("html"),
  html: Type10.String({ maxLength: 262144 })
});
var BoardWidgetMcpAppContentSchema = closedObject({
  kind: Type10.Literal("mcp-app"),
  descriptor: BoardMcpAppDescriptorSchema
});
var BoardWidgetMcpAppPutContentSchema = closedObject({
  kind: Type10.Literal("mcp-app"),
  viewId: NonEmptyString
});
var BoardWidgetContentSchema = Type10.Union([
  BoardWidgetHtmlContentSchema,
  BoardWidgetMcpAppContentSchema
]);
var BoardCanvasDocumentSourceSchema = closedObject({
  kind: Type10.Literal("canvas-doc"),
  docId: NonEmptyString
});
var BoardWidgetPutContentSchema = Type10.Union([
  BoardWidgetHtmlContentSchema,
  BoardWidgetMcpAppPutContentSchema,
  BoardCanvasDocumentSourceSchema
]);
var BoardWidgetPutParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  name: BoardWidgetNameSchema,
  title: Type10.Optional(Type10.String({ minLength: 1, maxLength: 80 })),
  content: BoardWidgetPutContentSchema,
  placement: Type10.Optional(
    closedObject({
      tabId: Type10.Optional(BoardTabIdSchema),
      size: Type10.Optional(BoardSizeSchema),
      after: Type10.Optional(BoardWidgetNameSchema)
    })
  ),
  declared: Type10.Optional(BoardWidgetDeclaredSchema)
});
var BoardWidgetGrantParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  name: BoardWidgetNameSchema,
  decision: Type10.Union([Type10.Literal("granted"), Type10.Literal("rejected")]),
  revision: Type10.Integer({ minimum: 1 }),
  instanceId: NonEmptyString
});
var BoardWidgetAppViewParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  name: BoardWidgetNameSchema,
  revision: Type10.Integer({ minimum: 1 }),
  instanceId: NonEmptyString
});
var BoardWidgetAppViewResultSchema = closedObject({
  viewId: NonEmptyString,
  expiresAtMs: Type10.Integer({ minimum: 0 })
});
var BoardViewTicketSchema = Type10.String({ minLength: 1, maxLength: 2048 });
var BoardLegacyEventParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  widget: BoardWidgetNameSchema,
  payload: Type10.Unknown()
});
var BoardTicketEventParamsSchema = closedObject({
  ticket: BoardViewTicketSchema,
  payload: Type10.Unknown()
});
var BoardEventParamsSchema = Type10.Union([
  BoardLegacyEventParamsSchema,
  BoardTicketEventParamsSchema
]);
var BoardPromptAuthorizeParamsSchema = closedObject({
  ticket: BoardViewTicketSchema
});
var BoardDataReadParamsSchema = closedObject({
  ticket: BoardViewTicketSchema,
  bindingId: Type10.String({ minLength: 1, maxLength: 64 }),
  params: Type10.Optional(
    Type10.Record(Type10.String({ minLength: 1, maxLength: 80 }), Type10.Unknown(), {
      maxProperties: 64
    })
  )
});
var BoardActionParamsSchema = closedObject({
  ticket: BoardViewTicketSchema,
  action: Type10.Literal("cron.trigger"),
  jobId: Type10.String({ minLength: 1, maxLength: BOARD_CRON_JOB_ID_MAX_LENGTH })
});
var BoardChangedEventSchema = closedObject({
  sessionKey: NonEmptyString,
  revision: Type10.Integer({ minimum: 0 }),
  widget: Type10.Optional(BoardWidgetNameSchema)
});
var BoardFocusTabCommandSchema = closedObject({
  kind: Type10.Literal("focus_tab"),
  tabId: BoardTabIdSchema
});
var BoardSetChatDockCommandSchema = closedObject({
  kind: Type10.Literal("set_chat_dock"),
  dock: BoardChatDockSchema
});
var BoardCommandSchema = Type10.Union([
  BoardFocusTabCommandSchema,
  BoardSetChatDockCommandSchema
]);
var BoardCommandEventSchema = closedObject({
  sessionKey: NonEmptyString,
  command: BoardCommandSchema
});

// packages/gateway-protocol/src/schema/users.ts
import { Type as Type11 } from "typebox";
var UserProfileIdSchema = Type11.String({ minLength: 1, maxLength: 128 });
var UserProfileDisplayNameSchema = Type11.String({ maxLength: 256 });
var UserProfileAvatarMimeSchema = Type11.Union([
  Type11.Literal("image/png"),
  Type11.Literal("image/jpeg"),
  Type11.Literal("image/webp")
]);
var UserProfileSchema = closedObject({
  id: UserProfileIdSchema,
  displayName: Type11.Union([UserProfileDisplayNameSchema, Type11.Null()]),
  avatarMime: Type11.Union([UserProfileAvatarMimeSchema, Type11.Null()]),
  mergedInto: Type11.Union([UserProfileIdSchema, Type11.Null()]),
  createdAt: Type11.Integer({ minimum: 0 }),
  updatedAt: Type11.Integer({ minimum: 0 }),
  emails: Type11.Array(NonEmptyString),
  hasAvatar: Type11.Boolean()
});
var UsersListParamsSchema = closedObject({});
var UsersListResultSchema = closedObject({ profiles: Type11.Array(UserProfileSchema) });
var UsersSelfParamsSchema = closedObject({});
var UsersSelfResultSchema = closedObject({ profile: UserProfileSchema });
var UsersLinkEmailParamsSchema = closedObject({
  email: Type11.String({ minLength: 1, maxLength: 320 }),
  targetProfileId: UserProfileIdSchema
});
var UsersLinkEmailResultSchema = closedObject({ profile: UserProfileSchema });
var UsersSetDisplayNameParamsSchema = closedObject({
  profileId: UserProfileIdSchema,
  displayName: Type11.Union([UserProfileDisplayNameSchema, Type11.Null()])
});
var UsersSetDisplayNameResultSchema = closedObject({ profile: UserProfileSchema });
var UsersSetAvatarParamsSchema = closedObject({
  profileId: UserProfileIdSchema,
  mime: UserProfileAvatarMimeSchema,
  avatarBase64: Type11.String({ minLength: 1, maxLength: 7e5 })
});
var UsersSetAvatarResultSchema = closedObject({ profile: UserProfileSchema });

// packages/gateway-protocol/src/schema/channels.ts
import { Type as Type12 } from "typebox";
var TalkModeParamsSchema = closedObject({
  enabled: Type12.Boolean(),
  phase: Type12.Optional(Type12.String())
});
var TalkConfigParamsSchema = closedObject({
  includeSecrets: Type12.Optional(Type12.Boolean())
});
var TalkSpeakParamsSchema = closedObject({
  text: NonEmptyString,
  voiceId: Type12.Optional(Type12.String()),
  modelId: Type12.Optional(Type12.String()),
  outputFormat: Type12.Optional(Type12.String()),
  speed: Type12.Optional(Type12.Number()),
  rateWpm: Type12.Optional(Type12.Integer({ minimum: 1 })),
  stability: Type12.Optional(Type12.Number()),
  similarity: Type12.Optional(Type12.Number()),
  style: Type12.Optional(Type12.Number()),
  speakerBoost: Type12.Optional(Type12.Boolean()),
  seed: Type12.Optional(Type12.Integer({ minimum: 0 })),
  normalize: Type12.Optional(Type12.String()),
  language: Type12.Optional(Type12.String()),
  latencyTier: Type12.Optional(Type12.Integer({ minimum: 0 }))
});
var TtsSpeakParamsSchema = closedObject({
  text: NonEmptyString
});
var TalkModeSchema = Type12.Union([
  Type12.Literal("realtime"),
  Type12.Literal("stt-tts"),
  Type12.Literal("transcription")
]);
var TalkTransportSchema = Type12.Union([
  Type12.Literal("webrtc"),
  Type12.Literal("provider-websocket"),
  Type12.Literal("gateway-relay"),
  Type12.Literal("managed-room")
]);
var TalkBrainSchema = Type12.Union([
  Type12.Literal("agent-consult"),
  Type12.Literal("direct-tools"),
  Type12.Literal("none")
]);
var TalkAgentControlModeSchema = Type12.Union([
  Type12.Literal("status"),
  Type12.Literal("steer"),
  Type12.Literal("cancel"),
  Type12.Literal("followup")
]);
var TalkEventTypeSchema = Type12.Union([
  Type12.Literal("session.started"),
  Type12.Literal("session.ready"),
  Type12.Literal("session.closed"),
  Type12.Literal("session.error"),
  Type12.Literal("session.replaced"),
  Type12.Literal("turn.started"),
  Type12.Literal("turn.ended"),
  Type12.Literal("turn.cancelled"),
  Type12.Literal("capture.started"),
  Type12.Literal("capture.stopped"),
  Type12.Literal("capture.cancelled"),
  Type12.Literal("capture.once"),
  Type12.Literal("input.audio.delta"),
  Type12.Literal("input.audio.committed"),
  Type12.Literal("transcript.delta"),
  Type12.Literal("transcript.done"),
  Type12.Literal("output.text.delta"),
  Type12.Literal("output.text.done"),
  Type12.Literal("output.audio.started"),
  Type12.Literal("output.audio.delta"),
  Type12.Literal("output.audio.done"),
  Type12.Literal("tool.call"),
  Type12.Literal("tool.progress"),
  Type12.Literal("tool.result"),
  Type12.Literal("tool.error"),
  Type12.Literal("usage.metrics"),
  Type12.Literal("latency.metrics"),
  Type12.Literal("health.changed")
]);
var TURN_SCOPED_TALK_EVENT_TYPES = [
  "turn.started",
  "turn.ended",
  "turn.cancelled",
  "input.audio.delta",
  "input.audio.committed",
  "transcript.delta",
  "transcript.done",
  "output.text.delta",
  "output.text.done",
  "output.audio.started",
  "output.audio.delta",
  "output.audio.done",
  "tool.call",
  "tool.progress",
  "tool.result",
  "tool.error"
];
var CAPTURE_SCOPED_TALK_EVENT_TYPES = [
  "capture.started",
  "capture.stopped",
  "capture.cancelled",
  "capture.once"
];
function requireJsonSchemaProperties(properties) {
  const conditionalRequirementKey = ["th", "en"].join("");
  return Object.fromEntries([[conditionalRequirementKey, { required: properties }]]);
}
var TalkEventSchema = Type12.Object(
  {
    id: NonEmptyString,
    type: TalkEventTypeSchema,
    sessionId: NonEmptyString,
    turnId: Type12.Optional(Type12.String()),
    captureId: Type12.Optional(Type12.String()),
    seq: Type12.Integer({ minimum: 1 }),
    timestamp: NonEmptyString,
    mode: TalkModeSchema,
    transport: TalkTransportSchema,
    brain: TalkBrainSchema,
    provider: Type12.Optional(Type12.String()),
    final: Type12.Optional(Type12.Boolean()),
    callId: Type12.Optional(Type12.String()),
    itemId: Type12.Optional(Type12.String()),
    parentId: Type12.Optional(Type12.String()),
    payload: Type12.Unknown()
  },
  {
    additionalProperties: false,
    allOf: [
      {
        if: {
          properties: { type: { enum: TURN_SCOPED_TALK_EVENT_TYPES } },
          required: ["type"]
        },
        ...requireJsonSchemaProperties(["turnId"])
      },
      {
        if: {
          properties: { type: { enum: CAPTURE_SCOPED_TALK_EVENT_TYPES } },
          required: ["type"]
        },
        ...requireJsonSchemaProperties(["captureId"])
      }
    ]
  }
);
var VoiceIdString = Type12.String({ pattern: "^[A-Za-z0-9_-]{1,128}$" });
var TalkClientCreateParamsSchema = closedObject({
  sessionKey: Type12.Optional(NonEmptyString),
  voiceSessionId: Type12.Optional(VoiceIdString),
  provider: Type12.Optional(Type12.String()),
  model: Type12.Optional(Type12.String()),
  voice: Type12.Optional(Type12.String()),
  vadThreshold: Type12.Optional(Type12.Number()),
  silenceDurationMs: Type12.Optional(Type12.Integer({ minimum: 1 })),
  prefixPaddingMs: Type12.Optional(Type12.Integer({ minimum: 0 })),
  reasoningEffort: Type12.Optional(Type12.String()),
  mode: Type12.Optional(TalkModeSchema),
  transport: Type12.Optional(TalkTransportSchema),
  brain: Type12.Optional(TalkBrainSchema),
  capabilities: Type12.Optional(
    Type12.Array(Type12.Union([Type12.Literal("camera-frame"), Type12.Literal("voice-transcript")]), {
      uniqueItems: true
    })
  )
});
var TalkClientToolCallParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  voiceSessionId: Type12.Optional(VoiceIdString),
  callId: NonEmptyString,
  name: NonEmptyString,
  args: Type12.Optional(Type12.Unknown()),
  relaySessionId: Type12.Optional(NonEmptyString)
});
var TalkClientTranscriptParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  voiceSessionId: VoiceIdString,
  entryId: VoiceIdString,
  role: Type12.Union([Type12.Literal("user"), Type12.Literal("assistant")]),
  text: NonEmptyString,
  timestamp: Type12.Optional(Type12.Number())
});
var TalkClientCloseParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  voiceSessionId: VoiceIdString
});
var TalkClientMutationResultSchema = closedObject({
  ok: Type12.Literal(true)
});
var TalkClientToolCallResultSchema = closedObject({
  runId: NonEmptyString,
  idempotencyKey: NonEmptyString
});
var TalkClientSteerParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  text: NonEmptyString,
  mode: Type12.Optional(TalkAgentControlModeSchema)
});
var TalkAgentControlResultSchema = closedObject({
  ok: Type12.Boolean(),
  mode: TalkAgentControlModeSchema,
  sessionKey: NonEmptyString,
  sessionId: Type12.Optional(NonEmptyString),
  active: Type12.Boolean(),
  queued: Type12.Optional(Type12.Boolean()),
  aborted: Type12.Optional(Type12.Boolean()),
  target: Type12.Optional(Type12.Union([Type12.Literal("embedded_run"), Type12.Literal("reply_run")])),
  reason: Type12.Optional(Type12.String()),
  message: Type12.String(),
  speak: Type12.Boolean(),
  show: Type12.Boolean(),
  suppress: Type12.Boolean(),
  providerResult: Type12.Optional(
    closedObject({
      status: Type12.Literal("cancelled"),
      message: Type12.String()
    })
  ),
  enqueuedAtMs: Type12.Optional(Type12.Number()),
  deliveredAtMs: Type12.Optional(Type12.Number())
});
var TalkSessionJoinParamsSchema = closedObject({
  sessionId: NonEmptyString,
  token: NonEmptyString
});
var TalkSessionCreateParamsSchema = closedObject({
  sessionKey: Type12.Optional(Type12.String()),
  spawnedBy: Type12.Optional(NonEmptyString),
  provider: Type12.Optional(Type12.String()),
  model: Type12.Optional(Type12.String()),
  voice: Type12.Optional(Type12.String()),
  language: Type12.Optional(Type12.String({ pattern: "^[a-z]{2}$" })),
  vadThreshold: Type12.Optional(Type12.Number()),
  silenceDurationMs: Type12.Optional(Type12.Integer({ minimum: 1 })),
  prefixPaddingMs: Type12.Optional(Type12.Integer({ minimum: 0 })),
  reasoningEffort: Type12.Optional(Type12.String()),
  mode: Type12.Optional(TalkModeSchema),
  transport: Type12.Optional(TalkTransportSchema),
  brain: Type12.Optional(TalkBrainSchema),
  ttlMs: Type12.Optional(Type12.Integer({ minimum: 1e3, maximum: 36e5 }))
});
var TalkSessionAppendAudioParamsSchema = closedObject({
  sessionId: NonEmptyString,
  audioBase64: NonEmptyString,
  timestamp: Type12.Optional(Type12.Number())
});
var TalkSessionTurnParamsSchema = closedObject({
  sessionId: NonEmptyString,
  turnId: Type12.Optional(Type12.String())
});
var TalkSessionCancelTurnParamsSchema = closedObject({
  sessionId: NonEmptyString,
  turnId: Type12.Optional(Type12.String()),
  reason: Type12.Optional(Type12.String())
});
var TalkSessionCancelOutputParamsSchema = closedObject({
  sessionId: NonEmptyString,
  turnId: Type12.Optional(Type12.String()),
  reason: Type12.Optional(Type12.String())
});
var TalkSessionSubmitToolResultParamsSchema = closedObject({
  sessionId: NonEmptyString,
  callId: NonEmptyString,
  result: Type12.Unknown(),
  options: Type12.Optional(
    closedObject({
      suppressResponse: Type12.Optional(Type12.Boolean()),
      willContinue: Type12.Optional(Type12.Boolean())
    })
  )
});
var TalkSessionSteerParamsSchema = closedObject({
  sessionId: NonEmptyString,
  sessionKey: Type12.Optional(NonEmptyString),
  text: NonEmptyString,
  mode: Type12.Optional(TalkAgentControlModeSchema)
});
var TalkSessionCloseParamsSchema = closedObject({
  sessionId: NonEmptyString
});
var TalkSessionManagedRoomStateSchema = closedObject({
  activeClientId: Type12.Optional(Type12.String()),
  activeTurnId: Type12.Optional(Type12.String()),
  recentTalkEvents: Type12.Array(TalkEventSchema)
});
var TalkSessionManagedRoomRecordSchema = closedObject({
  id: NonEmptyString,
  roomId: NonEmptyString,
  roomUrl: NonEmptyString,
  sessionKey: NonEmptyString,
  sessionId: Type12.Optional(Type12.String()),
  channel: Type12.Optional(Type12.String()),
  target: Type12.Optional(Type12.String()),
  provider: Type12.Optional(Type12.String()),
  model: Type12.Optional(Type12.String()),
  voice: Type12.Optional(Type12.String()),
  mode: TalkModeSchema,
  transport: TalkTransportSchema,
  brain: TalkBrainSchema,
  createdAt: Type12.Number(),
  expiresAt: Type12.Number(),
  room: TalkSessionManagedRoomStateSchema
});
var TalkCatalogParamsSchema = closedObject({});
var TalkCatalogProviderSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  configured: Type12.Boolean(),
  aliases: Type12.Optional(Type12.Array(NonEmptyString)),
  models: Type12.Optional(Type12.Array(Type12.String())),
  voices: Type12.Optional(Type12.Array(Type12.String())),
  defaultModel: Type12.Optional(Type12.String()),
  modes: Type12.Optional(Type12.Array(TalkModeSchema)),
  transports: Type12.Optional(Type12.Array(TalkTransportSchema)),
  brains: Type12.Optional(Type12.Array(TalkBrainSchema)),
  inputAudioFormats: Type12.Optional(
    Type12.Array(
      closedObject({
        encoding: Type12.Union([Type12.Literal("pcm16"), Type12.Literal("g711_ulaw")]),
        sampleRateHz: Type12.Integer({ minimum: 1 }),
        channels: Type12.Integer({ minimum: 1 })
      })
    )
  ),
  outputAudioFormats: Type12.Optional(
    Type12.Array(
      closedObject({
        encoding: Type12.Union([Type12.Literal("pcm16"), Type12.Literal("g711_ulaw")]),
        sampleRateHz: Type12.Integer({ minimum: 1 }),
        channels: Type12.Integer({ minimum: 1 })
      })
    )
  ),
  supportsBrowserSession: Type12.Optional(Type12.Boolean()),
  supportsBargeIn: Type12.Optional(Type12.Boolean()),
  supportsToolCalls: Type12.Optional(Type12.Boolean()),
  supportsVideoFrames: Type12.Optional(Type12.Boolean()),
  supportsSessionResumption: Type12.Optional(Type12.Boolean())
});
var TalkCatalogProviderGroupSchema = closedObject({
  ready: Type12.Optional(Type12.Boolean()),
  activeProvider: Type12.Optional(Type12.String()),
  providers: Type12.Array(TalkCatalogProviderSchema)
});
var TalkCatalogResultSchema = closedObject({
  modes: Type12.Array(TalkModeSchema),
  transports: Type12.Array(TalkTransportSchema),
  brains: Type12.Array(TalkBrainSchema),
  speech: TalkCatalogProviderGroupSchema,
  transcription: TalkCatalogProviderGroupSchema,
  realtime: TalkCatalogProviderGroupSchema
});
var BrowserRealtimeAudioContractSchema = closedObject({
  inputEncoding: Type12.Union([Type12.Literal("pcm16"), Type12.Literal("g711_ulaw")]),
  inputSampleRateHz: Type12.Integer({ minimum: 1 }),
  outputEncoding: Type12.Union([Type12.Literal("pcm16"), Type12.Literal("g711_ulaw")]),
  outputSampleRateHz: Type12.Integer({ minimum: 1 })
});
var TalkSessionCreateResultSchema = closedObject({
  sessionId: NonEmptyString,
  provider: Type12.Optional(Type12.String()),
  mode: TalkModeSchema,
  transport: TalkTransportSchema,
  brain: TalkBrainSchema,
  relaySessionId: Type12.Optional(NonEmptyString),
  transcriptionSessionId: Type12.Optional(NonEmptyString),
  handoffId: Type12.Optional(NonEmptyString),
  roomId: Type12.Optional(NonEmptyString),
  roomUrl: Type12.Optional(NonEmptyString),
  token: Type12.Optional(NonEmptyString),
  audio: Type12.Optional(Type12.Unknown()),
  model: Type12.Optional(Type12.String()),
  voice: Type12.Optional(Type12.String()),
  expiresAt: Type12.Optional(Type12.Number())
});
var TalkSessionTurnResultSchema = closedObject({
  ok: Type12.Boolean(),
  turnId: Type12.Optional(Type12.String()),
  events: Type12.Optional(Type12.Array(TalkEventSchema))
});
var TalkSessionJoinResultSchema = TalkSessionManagedRoomRecordSchema;
var TalkSessionOkResultSchema = closedObject({
  ok: Type12.Boolean()
});
var BrowserRealtimeWebRtcSdpSessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type12.Literal("webrtc"),
  voiceSessionId: NonEmptyString,
  clientSecret: NonEmptyString,
  offerUrl: Type12.Optional(Type12.String()),
  offerHeaders: Type12.Optional(Type12.Record(Type12.String(), Type12.String())),
  model: Type12.Optional(Type12.String()),
  voice: Type12.Optional(Type12.String()),
  expiresAt: Type12.Optional(Type12.Number())
});
var BrowserRealtimeJsonPcmWebSocketSessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type12.Literal("provider-websocket"),
  voiceSessionId: NonEmptyString,
  protocol: NonEmptyString,
  clientSecret: NonEmptyString,
  websocketUrl: NonEmptyString,
  audio: BrowserRealtimeAudioContractSchema,
  initialMessage: Type12.Optional(Type12.Unknown()),
  model: Type12.Optional(Type12.String()),
  voice: Type12.Optional(Type12.String()),
  expiresAt: Type12.Optional(Type12.Number())
});
var BrowserRealtimeGatewayRelaySessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type12.Literal("gateway-relay"),
  // Server-owned: older gateways omit it and clients derive it from relaySessionId.
  voiceSessionId: Type12.Optional(NonEmptyString),
  relaySessionId: NonEmptyString,
  audio: BrowserRealtimeAudioContractSchema,
  model: Type12.Optional(Type12.String()),
  voice: Type12.Optional(Type12.String()),
  expiresAt: Type12.Optional(Type12.Number())
});
var BrowserRealtimeManagedRoomSessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type12.Literal("managed-room"),
  // Server-owned rooms carry no client voice bookkeeping yet.
  voiceSessionId: Type12.Optional(NonEmptyString),
  roomUrl: NonEmptyString,
  token: Type12.Optional(Type12.String()),
  model: Type12.Optional(Type12.String()),
  voice: Type12.Optional(Type12.String()),
  expiresAt: Type12.Optional(Type12.Number())
});
var TalkClientCreateResultSchema = Type12.Union([
  BrowserRealtimeWebRtcSdpSessionSchema,
  BrowserRealtimeJsonPcmWebSocketSessionSchema,
  BrowserRealtimeGatewayRelaySessionSchema,
  BrowserRealtimeManagedRoomSessionSchema
]);
var talkProviderFieldSchemas = {
  apiKey: Type12.Optional(SecretInputSchema)
};
var TalkProviderConfigSchema = Type12.Object(talkProviderFieldSchemas, {
  additionalProperties: true
});
var TalkRealtimeConfigSchema = closedObject({
  provider: Type12.Optional(Type12.String()),
  providers: Type12.Optional(Type12.Record(Type12.String(), TalkProviderConfigSchema)),
  model: Type12.Optional(Type12.String()),
  speakerVoice: Type12.Optional(Type12.String()),
  speakerVoiceId: Type12.Optional(Type12.String()),
  voice: Type12.Optional(Type12.String()),
  instructions: Type12.Optional(Type12.String()),
  mode: Type12.Optional(TalkModeSchema),
  transport: Type12.Optional(TalkTransportSchema),
  vadThreshold: Type12.Optional(Type12.Number({ minimum: 0, maximum: 1 })),
  silenceDurationMs: Type12.Optional(Type12.Integer({ minimum: 1 })),
  prefixPaddingMs: Type12.Optional(Type12.Integer({ minimum: 0 })),
  reasoningEffort: Type12.Optional(Type12.String({ minLength: 1 })),
  brain: Type12.Optional(TalkBrainSchema),
  consultRouting: Type12.Optional(
    Type12.Union([Type12.Literal("provider-direct"), Type12.Literal("force-agent-consult")])
  )
});
var ResolvedTalkConfigSchema = closedObject({
  provider: Type12.String(),
  config: TalkProviderConfigSchema
});
var TalkConfigSchema = closedObject({
  provider: Type12.Optional(Type12.String()),
  providers: Type12.Optional(Type12.Record(Type12.String(), TalkProviderConfigSchema)),
  realtime: Type12.Optional(TalkRealtimeConfigSchema),
  resolved: Type12.Optional(ResolvedTalkConfigSchema),
  consultThinkingLevel: Type12.Optional(Type12.String()),
  consultFastMode: Type12.Optional(Type12.Boolean()),
  speechLocale: Type12.Optional(Type12.String()),
  interruptOnSpeech: Type12.Optional(Type12.Boolean()),
  silenceTimeoutMs: Type12.Optional(Type12.Integer({ minimum: 1 }))
});
var TalkConfigResultSchema = closedObject({
  config: closedObject({
    talk: Type12.Optional(TalkConfigSchema),
    session: Type12.Optional(
      closedObject({
        mainKey: Type12.Optional(Type12.String())
      })
    ),
    ui: Type12.Optional(
      closedObject({
        seamColor: Type12.Optional(Type12.String())
      })
    )
  })
});
var TalkSpeakResultSchema = closedObject({
  audioBase64: NonEmptyString,
  provider: NonEmptyString,
  outputFormat: Type12.Optional(Type12.String()),
  voiceCompatible: Type12.Optional(Type12.Boolean()),
  mimeType: Type12.Optional(Type12.String()),
  fileExtension: Type12.Optional(Type12.String())
});
var TtsSpeakResultSchema = closedObject({
  audioBase64: NonEmptyString,
  provider: NonEmptyString,
  outputFormat: Type12.Optional(Type12.String()),
  mimeType: Type12.Optional(Type12.String()),
  fileExtension: Type12.Optional(Type12.String())
});
var ChannelsStatusParamsSchema = closedObject({
  probe: Type12.Optional(Type12.Boolean()),
  timeoutMs: Type12.Optional(Type12.Integer({ minimum: 0 })),
  channel: Type12.Optional(NonEmptyString)
});
var ChannelAccountSnapshotSchema = Type12.Object(
  {
    accountId: NonEmptyString,
    name: Type12.Optional(Type12.String()),
    enabled: Type12.Optional(Type12.Boolean()),
    configured: Type12.Optional(Type12.Boolean()),
    linked: Type12.Optional(Type12.Boolean()),
    running: Type12.Optional(Type12.Boolean()),
    connected: Type12.Optional(Type12.Boolean()),
    reconnectAttempts: Type12.Optional(Type12.Integer({ minimum: 0 })),
    lastConnectedAt: Type12.Optional(Type12.Integer({ minimum: 0 })),
    lastError: Type12.Optional(Type12.String()),
    healthState: Type12.Optional(Type12.String()),
    lastStartAt: Type12.Optional(Type12.Integer({ minimum: 0 })),
    lastStopAt: Type12.Optional(Type12.Integer({ minimum: 0 })),
    lastInboundAt: Type12.Optional(Type12.Integer({ minimum: 0 })),
    lastOutboundAt: Type12.Optional(Type12.Integer({ minimum: 0 })),
    lastTransportActivityAt: Type12.Optional(Type12.Integer({ minimum: 0 })),
    busy: Type12.Optional(Type12.Boolean()),
    activeRuns: Type12.Optional(Type12.Integer({ minimum: 0 })),
    lastRunActivityAt: Type12.Optional(Type12.Integer({ minimum: 0 })),
    lastProbeAt: Type12.Optional(Type12.Integer({ minimum: 0 })),
    mode: Type12.Optional(Type12.String()),
    dmPolicy: Type12.Optional(Type12.String()),
    allowFrom: Type12.Optional(Type12.Array(Type12.String())),
    tokenSource: Type12.Optional(Type12.String()),
    botTokenSource: Type12.Optional(Type12.String()),
    appTokenSource: Type12.Optional(Type12.String()),
    baseUrl: Type12.Optional(Type12.String()),
    allowUnmentionedGroups: Type12.Optional(Type12.Boolean()),
    cliPath: Type12.Optional(Type12.Union([Type12.String(), Type12.Null()])),
    dbPath: Type12.Optional(Type12.Union([Type12.String(), Type12.Null()])),
    port: Type12.Optional(Type12.Union([Type12.Integer({ minimum: 0 }), Type12.Null()])),
    probe: Type12.Optional(Type12.Unknown()),
    audit: Type12.Optional(Type12.Unknown()),
    application: Type12.Optional(Type12.Unknown())
  },
  { additionalProperties: true }
);
var ChannelUiMetaSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  detailLabel: NonEmptyString,
  systemImage: Type12.Optional(Type12.String())
});
var ChannelEventLoopHealthSchema = closedObject({
  degraded: Type12.Boolean(),
  reasons: Type12.Array(
    Type12.Union([
      Type12.Literal("event_loop_delay"),
      Type12.Literal("event_loop_utilization"),
      Type12.Literal("cpu")
    ])
  ),
  intervalMs: Type12.Integer({ minimum: 0 }),
  delayP99Ms: Type12.Number({ minimum: 0 }),
  delayMaxMs: Type12.Number({ minimum: 0 }),
  utilization: Type12.Number({ minimum: 0 }),
  cpuCoreRatio: Type12.Number({ minimum: 0 })
});
var ChannelsStatusResultSchema = closedObject({
  ts: Type12.Integer({ minimum: 0 }),
  channelOrder: Type12.Array(NonEmptyString),
  channelLabels: Type12.Record(NonEmptyString, NonEmptyString),
  channelDetailLabels: Type12.Optional(Type12.Record(NonEmptyString, NonEmptyString)),
  channelSystemImages: Type12.Optional(Type12.Record(NonEmptyString, NonEmptyString)),
  channelMeta: Type12.Optional(Type12.Array(ChannelUiMetaSchema)),
  channels: Type12.Record(NonEmptyString, Type12.Unknown()),
  channelAccounts: Type12.Record(NonEmptyString, Type12.Array(ChannelAccountSnapshotSchema)),
  channelDefaultAccountId: Type12.Record(NonEmptyString, NonEmptyString),
  eventLoop: Type12.Optional(ChannelEventLoopHealthSchema),
  partial: Type12.Optional(Type12.Boolean()),
  warnings: Type12.Optional(Type12.Array(Type12.String()))
});
var ChannelsLogoutParamsSchema = closedObject({
  channel: NonEmptyString,
  accountId: Type12.Optional(Type12.String())
});
var ChannelsStopParamsSchema = closedObject({
  channel: NonEmptyString,
  accountId: Type12.Optional(Type12.String())
});
var ChannelsStartParamsSchema = closedObject({
  channel: NonEmptyString,
  accountId: Type12.Optional(Type12.String())
});
var WebLoginStartParamsSchema = closedObject({
  force: Type12.Optional(Type12.Boolean()),
  timeoutMs: Type12.Optional(Type12.Integer({ minimum: 0 })),
  verbose: Type12.Optional(Type12.Boolean()),
  accountId: Type12.Optional(Type12.String())
});
var QrDataUrlSchema = Type12.String({
  maxLength: 16384,
  pattern: "^data:image/png;base64,"
});
var WebLoginWaitParamsSchema = closedObject({
  timeoutMs: Type12.Optional(Type12.Integer({ minimum: 0 })),
  accountId: Type12.Optional(Type12.String()),
  currentQrDataUrl: Type12.Optional(QrDataUrlSchema)
});

// packages/gateway-protocol/src/schema/talk-marks.ts
var TalkSessionAcknowledgeMarkParamsSchema = closedObject({
  sessionId: NonEmptyString,
  markName: NonEmptyString
});

// packages/gateway-protocol/src/schema/commands.ts
import { Type as Type13 } from "typebox";
var COMMAND_NAME_MAX_LENGTH = 200;
var COMMAND_DESCRIPTION_MAX_LENGTH = 2e3;
var COMMAND_ALIAS_MAX_ITEMS = 20;
var COMMAND_ARGS_MAX_ITEMS = 20;
var COMMAND_ARG_NAME_MAX_LENGTH = 200;
var COMMAND_ARG_DESCRIPTION_MAX_LENGTH = 500;
var COMMAND_ARG_CHOICES_MAX_ITEMS = 50;
var COMMAND_CHOICE_VALUE_MAX_LENGTH = 200;
var COMMAND_CHOICE_LABEL_MAX_LENGTH = 200;
var COMMAND_LIST_MAX_ITEMS = 500;
var BoundedNonEmptyString = (maxLength) => Type13.String({ minLength: 1, maxLength });
var CommandSourceSchema = Type13.Union([
  Type13.Literal("native"),
  Type13.Literal("skill"),
  Type13.Literal("plugin")
]);
var CommandScopeSchema = Type13.Union([
  Type13.Literal("text"),
  Type13.Literal("native"),
  Type13.Literal("both")
]);
var CommandCategorySchema = Type13.Union([
  Type13.Literal("session"),
  Type13.Literal("options"),
  Type13.Literal("status"),
  Type13.Literal("management"),
  Type13.Literal("media"),
  Type13.Literal("tools"),
  Type13.Literal("docks")
]);
var CommandArgChoiceSchema = closedObject({
  value: Type13.String({ maxLength: COMMAND_CHOICE_VALUE_MAX_LENGTH }),
  label: Type13.String({ maxLength: COMMAND_CHOICE_LABEL_MAX_LENGTH })
});
var CommandArgSchema = closedObject({
  name: BoundedNonEmptyString(COMMAND_ARG_NAME_MAX_LENGTH),
  description: Type13.String({ maxLength: COMMAND_ARG_DESCRIPTION_MAX_LENGTH }),
  type: Type13.Union([Type13.Literal("string"), Type13.Literal("number"), Type13.Literal("boolean")]),
  required: Type13.Optional(Type13.Boolean()),
  choices: Type13.Optional(
    Type13.Array(CommandArgChoiceSchema, { maxItems: COMMAND_ARG_CHOICES_MAX_ITEMS })
  ),
  dynamic: Type13.Optional(Type13.Boolean())
});
var CommandEntrySchema = closedObject({
  name: BoundedNonEmptyString(COMMAND_NAME_MAX_LENGTH),
  nativeName: Type13.Optional(BoundedNonEmptyString(COMMAND_NAME_MAX_LENGTH)),
  textAliases: Type13.Optional(
    Type13.Array(BoundedNonEmptyString(COMMAND_NAME_MAX_LENGTH), {
      maxItems: COMMAND_ALIAS_MAX_ITEMS
    })
  ),
  description: Type13.String({ maxLength: COMMAND_DESCRIPTION_MAX_LENGTH }),
  category: Type13.Optional(CommandCategorySchema),
  source: CommandSourceSchema,
  scope: CommandScopeSchema,
  acceptsArgs: Type13.Boolean(),
  args: Type13.Optional(Type13.Array(CommandArgSchema, { maxItems: COMMAND_ARGS_MAX_ITEMS }))
});
var CommandsListParamsSchema = closedObject({
  agentId: Type13.Optional(NonEmptyString),
  provider: Type13.Optional(NonEmptyString),
  scope: Type13.Optional(CommandScopeSchema),
  includeArgs: Type13.Optional(Type13.Boolean())
});
var CommandsListResultSchema = closedObject({
  commands: Type13.Array(CommandEntrySchema, { maxItems: COMMAND_LIST_MAX_ITEMS })
});

// packages/gateway-protocol/src/schema/config.ts
import { Type as Type14 } from "typebox";
var ConfigSchemaLookupPathString = Type14.String({
  minLength: 1,
  maxLength: 1024,
  pattern: "^[A-Za-z0-9_./\\[\\]\\-*]+$"
});
var ConfigDeliveryContextSchema = closedObject({
  channel: Type14.Optional(Type14.String()),
  to: Type14.Optional(Type14.String()),
  accountId: Type14.Optional(Type14.String()),
  threadId: Type14.Optional(Type14.Union([Type14.String(), Type14.Number()]))
});
var ConfigGetParamsSchema = closedObject({});
var ConfigSetParamsSchema = closedObject({
  raw: NonEmptyString,
  baseHash: Type14.Optional(NonEmptyString)
});
var ConfigApplyLikeParamProperties = {
  raw: NonEmptyString,
  baseHash: Type14.Optional(NonEmptyString),
  sessionKey: Type14.Optional(Type14.String()),
  deliveryContext: Type14.Optional(ConfigDeliveryContextSchema),
  note: Type14.Optional(Type14.String()),
  restartDelayMs: Type14.Optional(Type14.Integer({ minimum: 0 }))
};
var ConfigApplyLikeParamsSchema = closedObject(ConfigApplyLikeParamProperties);
var ConfigApplyParamsSchema = ConfigApplyLikeParamsSchema;
var ConfigPatchParamsSchema = closedObject({
  ...ConfigApplyLikeParamProperties,
  replacePaths: Type14.Optional(Type14.Array(NonEmptyString, { maxItems: 256 }))
});
var ConfigSchemaParamsSchema = closedObject({});
var ConfigSchemaLookupParamsSchema = closedObject({
  path: ConfigSchemaLookupPathString
});
var UpdateStatusParamsSchema = closedObject({});
var UpdateRunParamsSchema = closedObject({
  sessionKey: Type14.Optional(Type14.String()),
  deliveryContext: Type14.Optional(ConfigDeliveryContextSchema),
  note: Type14.Optional(Type14.String()),
  continuationMessage: Type14.Optional(Type14.String()),
  restartDelayMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  timeoutMs: Type14.Optional(Type14.Integer({ minimum: 1 }))
});
var ConfigUiHintSchema = closedObject({
  label: Type14.Optional(Type14.String()),
  help: Type14.Optional(Type14.String()),
  tags: Type14.Optional(Type14.Array(Type14.String())),
  group: Type14.Optional(Type14.String()),
  order: Type14.Optional(Type14.Integer()),
  advanced: Type14.Optional(Type14.Boolean()),
  sensitive: Type14.Optional(Type14.Boolean()),
  placeholder: Type14.Optional(Type14.String()),
  itemTemplate: Type14.Optional(Type14.Unknown())
});
var ConfigSchemaResponseSchema = closedObject({
  schema: Type14.Unknown(),
  uiHints: Type14.Record(Type14.String(), ConfigUiHintSchema),
  version: NonEmptyString,
  generatedAt: NonEmptyString
});
var ConfigSchemaLookupChildSchema = closedObject({
  key: NonEmptyString,
  path: NonEmptyString,
  type: Type14.Optional(Type14.Union([Type14.String(), Type14.Array(Type14.String())])),
  required: Type14.Boolean(),
  hasChildren: Type14.Boolean(),
  reloadKind: Type14.Optional(
    Type14.Union([Type14.Literal("restart"), Type14.Literal("hot"), Type14.Literal("none")])
  ),
  hint: Type14.Optional(ConfigUiHintSchema),
  hintPath: Type14.Optional(Type14.String())
});
var ConfigSchemaLookupResultSchema = closedObject({
  path: NonEmptyString,
  schema: Type14.Unknown(),
  reloadKind: Type14.Optional(
    Type14.Union([Type14.Literal("restart"), Type14.Literal("hot"), Type14.Literal("none")])
  ),
  hint: Type14.Optional(ConfigUiHintSchema),
  hintPath: Type14.Optional(Type14.String()),
  children: Type14.Array(ConfigSchemaLookupChildSchema)
});

// packages/gateway-protocol/src/schema/openclaw.ts
import { Type as Type16 } from "typebox";

// packages/gateway-protocol/src/schema/wizard.ts
import { Type as Type15 } from "typebox";
var WizardRunStatusSchema = Type15.Union([
  Type15.Literal("running"),
  Type15.Literal("done"),
  Type15.Literal("cancelled"),
  Type15.Literal("error")
]);
var WizardStartParamsSchema = closedObject({
  mode: Type15.Optional(Type15.Union([Type15.Literal("local"), Type15.Literal("remote")])),
  workspace: Type15.Optional(Type15.String()),
  // "setup" (default) runs full onboarding; "channels" runs the guided
  // channel-setup flow (openclaw channels add) over the same step protocol.
  flow: Type15.Optional(Type15.Union([Type15.Literal("setup"), Type15.Literal("channels")])),
  // Preselected channel id for flow "channels" (e.g. "telegram").
  channel: Type15.Optional(NonEmptyString)
});
var WizardAnswerSchema = closedObject({
  stepId: NonEmptyString,
  value: Type15.Optional(Type15.Unknown())
});
var WizardNextParamsSchema = closedObject({
  sessionId: NonEmptyString,
  answer: Type15.Optional(WizardAnswerSchema)
});
var WizardSessionIdParamsSchema = closedObject({
  sessionId: NonEmptyString
});
var WizardCancelParamsSchema = WizardSessionIdParamsSchema;
var WizardStatusParamsSchema = WizardSessionIdParamsSchema;
var WizardStepOptionSchema = closedObject({
  value: Type15.Unknown(),
  label: NonEmptyString,
  hint: Type15.Optional(Type15.String())
});
var WizardDeviceCodeSchema = closedObject({
  code: NonEmptyString,
  expiresInMinutes: Type15.Optional(Type15.Integer({ minimum: 1, maximum: 1440 })),
  message: Type15.Optional(Type15.String())
});
var WizardStepSchema = closedObject({
  id: NonEmptyString,
  type: Type15.Union([
    Type15.Literal("note"),
    Type15.Literal("select"),
    Type15.Literal("text"),
    Type15.Literal("confirm"),
    Type15.Literal("multiselect"),
    Type15.Literal("progress"),
    Type15.Literal("action")
  ]),
  title: Type15.Optional(Type15.String()),
  message: Type15.Optional(Type15.String()),
  format: Type15.Optional(Type15.Union([Type15.Literal("plain")])),
  options: Type15.Optional(Type15.Array(WizardStepOptionSchema)),
  initialValue: Type15.Optional(Type15.Unknown()),
  placeholder: Type15.Optional(Type15.String()),
  sensitive: Type15.Optional(Type15.Boolean()),
  executor: Type15.Optional(Type15.Union([Type15.Literal("gateway"), Type15.Literal("client")])),
  externalUrl: Type15.Optional(Type15.String()),
  deviceCode: Type15.Optional(WizardDeviceCodeSchema)
});
var WizardConfiguredAccountSchema = closedObject({
  channel: NonEmptyString,
  accountId: NonEmptyString
});
var WizardResultFields = {
  done: Type15.Boolean(),
  step: Type15.Optional(WizardStepSchema),
  status: Type15.Optional(WizardRunStatusSchema),
  error: Type15.Optional(Type15.String()),
  // What the flow actually configured; set on the terminal result of
  // wizard.start flow "channels" sessions so clients run channel-specific
  // completion (e.g. WhatsApp QR linking for the right account) from the
  // real outcome rather than the preselection.
  channels: Type15.Optional(Type15.Array(NonEmptyString)),
  accounts: Type15.Optional(Type15.Array(WizardConfiguredAccountSchema))
};
var WizardNextResultSchema = closedObject(WizardResultFields);
var WizardStartResultSchema = closedObject({
  sessionId: NonEmptyString,
  ...WizardResultFields
});
var WizardStatusResultSchema = closedObject({
  status: WizardRunStatusSchema,
  error: Type15.Optional(Type15.String())
});

// packages/gateway-protocol/src/schema/openclaw.ts
var SystemAgentChatParamsSchema = closedObject({
  sessionId: NonEmptyString,
  message: Type16.Optional(Type16.String()),
  /** Seeds a purpose-specific first greeting for a fresh conversation. */
  welcomeVariant: Type16.Optional(
    Type16.Union([Type16.Literal("onboarding"), Type16.Literal("new-agent")])
  ),
  /** Drop any in-flight approval/wizard state and start the session over. */
  reset: Type16.Optional(Type16.Boolean()),
  /** Host-only regular-agent delegation context. Never model-authored. */
  delegation: Type16.Optional(
    closedObject({
      agentId: Type16.Optional(NonEmptyString),
      sessionKey: Type16.Optional(NonEmptyString),
      turnSourceChannel: Type16.Optional(NonEmptyString),
      turnSourceTo: Type16.Optional(NonEmptyString),
      turnSourceAccountId: Type16.Optional(NonEmptyString),
      turnSourceThreadId: Type16.Optional(Type16.Union([Type16.String(), Type16.Number()]))
    })
  )
});
var SystemAgentChatQuestionSchema = closedObject({
  id: NonEmptyString,
  header: NonEmptyString,
  question: NonEmptyString,
  options: Type16.Array(
    closedObject({
      label: NonEmptyString,
      description: Type16.Optional(Type16.String()),
      recommended: Type16.Optional(Type16.Boolean()),
      /** Message text a client sends when this option is chosen; defaults to label. */
      reply: Type16.Optional(NonEmptyString)
    }),
    { minItems: 2, maxItems: 4 }
  ),
  /** Free-text answers are also accepted for this question. */
  isOther: Type16.Optional(Type16.Boolean())
});
var SystemAgentChatResultSchema = closedObject({
  sessionId: NonEmptyString,
  reply: NonEmptyString,
  /** The next reply is a hosted-wizard secret and clients must mask its input/echo. */
  sensitive: Type16.Optional(Type16.Boolean()),
  /** The hosted wizard will consume the next message as its current step answer. */
  wizardInputPending: Type16.Optional(Type16.Boolean()),
  action: Type16.Union([
    Type16.Literal("none"),
    // The user asked to talk to their agent; clients should move to their
    // normal agent chat surface.
    Type16.Literal("open-agent"),
    Type16.Literal("exit")
  ]),
  /** Optional localized-draft intent for an `open-agent` handoff. */
  agentDraft: Type16.Optional(Type16.Literal("hatch")),
  /** Destination agent for a specific `open-agent` handoff. */
  agentId: Type16.Optional(NonEmptyString),
  needsApproval: Type16.Optional(Type16.Boolean()),
  proposalId: Type16.Optional(NonEmptyString),
  question: Type16.Optional(SystemAgentChatQuestionSchema)
});
var SystemAgentChatHistoryParamsSchema = closedObject({
  limit: Type16.Optional(Type16.Integer({ minimum: 1, maximum: 500, default: 100 }))
});
var SystemAgentChatHistoryTurnSchema = closedObject({
  role: Type16.Union([Type16.Literal("user"), Type16.Literal("assistant")]),
  text: Type16.String(),
  at: Type16.Number()
});
var SystemAgentChatHistoryResultSchema = closedObject({
  turns: Type16.Array(SystemAgentChatHistoryTurnSchema)
});
var SystemChangeKindSchema = Type16.Union([
  Type16.Literal("operation"),
  Type16.Literal("config-write"),
  Type16.Literal("external-edit")
]);
var SystemChangeSourceSchema = Type16.Union([
  Type16.Literal("system-agent"),
  Type16.Literal("doctor"),
  Type16.Literal("config-rpc"),
  Type16.Literal("cli"),
  Type16.Literal("plugin-install"),
  Type16.Literal("external"),
  Type16.Literal("unknown")
]);
var SystemChangeEntrySchema = closedObject({
  id: NonEmptyString,
  at: Type16.Number(),
  kind: SystemChangeKindSchema,
  source: SystemChangeSourceSchema,
  summary: Type16.String(),
  changedPaths: Type16.Optional(Type16.Array(Type16.String())),
  invalid: Type16.Optional(Type16.Boolean()),
  opaqueChange: Type16.Optional(Type16.Boolean())
});
var SystemChangesListParamsSchema = closedObject({
  limit: Type16.Optional(Type16.Integer({ minimum: 1, maximum: 200, default: 50 })),
  beforeCursor: Type16.Optional(NonEmptyString)
});
var SystemChangesListResultSchema = closedObject({
  entries: Type16.Array(SystemChangeEntrySchema),
  nextCursor: Type16.Optional(NonEmptyString)
});
var SystemAgentSetupDetectParamsSchema = closedObject({});
var ProviderAutoSetupInferenceKind = Type16.TemplateLiteral("provider-auto:${string}", {
  pattern: "^provider-auto:.+$"
});
var SetupInferenceHttpsUrl = Type16.String({
  minLength: 1,
  maxLength: 2048,
  pattern: "^https://"
});
var SetupInferenceKind = Type16.Union([
  Type16.Literal("existing-model"),
  Type16.Literal("openai-api-key"),
  Type16.Literal("anthropic-api-key"),
  Type16.Literal("claude-cli"),
  Type16.Literal("codex-cli"),
  Type16.Literal("gemini-cli"),
  ProviderAutoSetupInferenceKind
]);
var SetupInferenceStatus = Type16.Union([
  Type16.Literal("ok"),
  Type16.Literal("auth"),
  Type16.Literal("rate_limit"),
  Type16.Literal("billing"),
  Type16.Literal("timeout"),
  Type16.Literal("format"),
  Type16.Literal("unavailable"),
  Type16.Literal("unknown")
]);
var SetupInferenceFailureStatus = Type16.Union([
  Type16.Literal("auth"),
  Type16.Literal("rate_limit"),
  Type16.Literal("billing"),
  Type16.Literal("timeout"),
  Type16.Literal("format"),
  Type16.Literal("unavailable"),
  Type16.Literal("unknown")
]);
var SystemAgentSetupDetectResultSchema = closedObject({
  candidates: Type16.Array(
    closedObject({
      kind: SetupInferenceKind,
      label: NonEmptyString,
      detail: Type16.String(),
      modelRef: NonEmptyString,
      recommended: Type16.Boolean(),
      /** true: verified; false: definitively logged out; absent: unknown. */
      credentials: Type16.Optional(Type16.Boolean()),
      icon: Type16.Optional(SetupInferenceHttpsUrl),
      website: Type16.Optional(SetupInferenceHttpsUrl)
    })
  ),
  unavailableCandidates: Type16.Optional(
    Type16.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString,
        detail: Type16.String(),
        reason: NonEmptyString
      })
    )
  ),
  /** Text-inference key/token methods exposed by the Gateway provider registry. */
  manualProviders: Type16.Array(
    closedObject({
      /** Opaque provider-auth choice sent back during activation. */
      id: NonEmptyString,
      label: NonEmptyString,
      hint: Type16.Optional(Type16.String()),
      icon: Type16.Optional(SetupInferenceHttpsUrl),
      website: Type16.Optional(SetupInferenceHttpsUrl)
    })
  ),
  /** Provider-owned browser and device-code login methods. */
  authOptions: Type16.Optional(
    Type16.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString,
        hint: Type16.Optional(Type16.String()),
        groupLabel: Type16.Optional(Type16.String()),
        icon: Type16.Optional(SetupInferenceHttpsUrl),
        website: Type16.Optional(SetupInferenceHttpsUrl),
        kind: Type16.Union([Type16.Literal("oauth"), Type16.Literal("device-code")]),
        featured: Type16.Boolean()
      })
    )
  ),
  recommendedInstalls: Type16.Optional(
    Type16.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString,
        hint: NonEmptyString,
        website: SetupInferenceHttpsUrl,
        icon: SetupInferenceHttpsUrl
      })
    )
  ),
  workspace: NonEmptyString,
  codexAppServerDetected: Type16.Optional(Type16.Boolean()),
  configuredModel: Type16.Optional(Type16.String()),
  setupComplete: Type16.Boolean()
});
var SystemAgentSetupVerifyParamsSchema = closedObject({});
var SystemAgentSetupVerifyResultSchema = Type16.Union([
  closedObject({
    ok: Type16.Literal(true),
    modelRef: NonEmptyString,
    latencyMs: Type16.Number()
  }),
  closedObject({
    ok: Type16.Literal(false),
    status: SetupInferenceFailureStatus,
    error: NonEmptyString
  })
]);
var SystemAgentSetupActivateParamsSchema = closedObject({
  kind: Type16.Union([
    Type16.Literal("existing-model"),
    Type16.Literal("openai-api-key"),
    Type16.Literal("anthropic-api-key"),
    Type16.Literal("claude-cli"),
    Type16.Literal("codex-cli"),
    Type16.Literal("gemini-cli"),
    ProviderAutoSetupInferenceKind,
    Type16.Literal("api-key")
  ]),
  /** Exact detected model for this route; prevents detect/activate drift. */
  modelRef: Type16.Optional(NonEmptyString),
  /** Manual step only: opaque provider-auth choice returned by detection. */
  authChoice: Type16.Optional(Type16.String()),
  /** Manual step only: the pasted API key or token; masked by clients, never echoed. */
  apiKey: Type16.Optional(Type16.String()),
  workspace: Type16.Optional(Type16.String())
});
var SystemAgentSetupActivateResultSchema = closedObject({
  ok: Type16.Boolean(),
  /** Present on success: the model ref that answered the live test. */
  modelRef: Type16.Optional(Type16.String()),
  latencyMs: Type16.Optional(Type16.Number()),
  /** Human-readable setup summary lines (workspace, model, gateway). */
  lines: Type16.Optional(Type16.Array(Type16.String())),
  /** Present on failure: coarse bucket for client copy + docs links. */
  status: Type16.Optional(SetupInferenceStatus),
  error: Type16.Optional(Type16.String())
});
var SystemAgentSetupAuthStartParamsSchema = closedObject({
  /** Client-generated so cancellation remains possible if the start reply is lost. */
  sessionId: NonEmptyString,
  authChoice: NonEmptyString,
  workspace: Type16.Optional(Type16.String())
});
var SystemAgentSetupAuthStartResultSchema = WizardStartResultSchema;

// packages/gateway-protocol/src/schema/cron.ts
import { Type as Type17 } from "typebox";
function cronAgentTurnPayloadSchema(params) {
  return closedObject({
    kind: Type17.Literal("agentTurn"),
    message: params.message,
    model: Type17.Optional(params.model),
    fallbacks: Type17.Optional(params.fallbacks),
    thinking: Type17.Optional(params.thinking),
    timeoutSeconds: Type17.Optional(Type17.Number({ minimum: 0 })),
    allowUnsafeExternalContent: Type17.Optional(Type17.Boolean()),
    lightContext: Type17.Optional(Type17.Boolean()),
    toolsAllow: Type17.Optional(params.toolsAllow),
    // Server-managed marker for auto-stamped defaults; persisted so CLI cron
    // runs can drop only the cap that was never user-explicit.
    toolsAllowIsDefault: Type17.Optional(Type17.Boolean())
  });
}
function cronCommandPayloadSchema(params) {
  return closedObject({
    kind: Type17.Literal("command"),
    argv: params.argv,
    cwd: Type17.Optional(Type17.String({ minLength: 1 })),
    env: Type17.Optional(Type17.Record(Type17.String({ minLength: 1 }), Type17.String())),
    input: Type17.Optional(Type17.String()),
    timeoutSeconds: Type17.Optional(Type17.Number({ minimum: 0 })),
    noOutputTimeoutSeconds: Type17.Optional(Type17.Number({ minimum: 0 })),
    outputMaxBytes: Type17.Optional(Type17.Integer({ minimum: 1 })),
    toolsAllow: Type17.Optional(params.toolsAllow),
    toolsAllowIsDefault: Type17.Optional(Type17.Boolean())
  });
}
function cronScriptPayloadSchema(params) {
  return closedObject({
    kind: Type17.Literal("script"),
    script: params.script,
    timeoutSeconds: Type17.Optional(Type17.Number({ minimum: 1 })),
    toolBudget: Type17.Optional(Type17.Integer({ minimum: 1 })),
    toolsAllow: Type17.Optional(params.toolsAllow),
    toolsAllowIsDefault: Type17.Optional(Type17.Boolean())
  });
}
var CronSessionTargetSchema = Type17.Union([
  Type17.Literal("main"),
  Type17.Literal("isolated"),
  Type17.Literal("current"),
  Type17.String({ pattern: "^session:.+" })
]);
var CronWakeModeSchema = Type17.Union([Type17.Literal("next-heartbeat"), Type17.Literal("now")]);
function cronRunStatusSchema(options = {}) {
  return Type17.Union([Type17.Literal("ok"), Type17.Literal("error"), Type17.Literal("skipped")], options);
}
var CronRunStatusSchema = cronRunStatusSchema();
var CronConfigRevisionSchema = Type17.String({ minLength: 1, maxLength: 128 });
var DeprecatedCronRunStatusSchema = cronRunStatusSchema({
  deprecated: true,
  description: "Deprecated alias for lastRunStatus."
});
var CronSortDirSchema = Type17.Union([Type17.Literal("asc"), Type17.Literal("desc")]);
var CronJobsEnabledFilterSchema = Type17.Union([
  Type17.Literal("all"),
  Type17.Literal("enabled"),
  Type17.Literal("disabled")
]);
var CronJobsScheduleKindFilterSchema = Type17.Union([
  Type17.Literal("all"),
  Type17.Literal("at"),
  Type17.Literal("every"),
  Type17.Literal("cron"),
  Type17.Literal("on-exit")
]);
var CronJobsLastRunStatusFilterSchema = Type17.Union([
  Type17.Literal("all"),
  Type17.Literal("ok"),
  Type17.Literal("error"),
  Type17.Literal("skipped"),
  Type17.Literal("unknown")
]);
var CronJobsSortBySchema = Type17.Union([
  Type17.Literal("nextRunAtMs"),
  Type17.Literal("updatedAtMs"),
  Type17.Literal("name")
]);
var CronRunsStatusFilterSchema = Type17.Union([
  Type17.Literal("all"),
  Type17.Literal("ok"),
  Type17.Literal("error"),
  Type17.Literal("skipped")
]);
var CronRunsStatusValueSchema = Type17.Union([
  Type17.Literal("ok"),
  Type17.Literal("error"),
  Type17.Literal("skipped")
]);
var CronDeliveryStatusSchema = Type17.Union([
  Type17.Literal("delivered"),
  Type17.Literal("not-delivered"),
  Type17.Literal("unknown"),
  Type17.Literal("not-requested")
]);
var NonBlankString = Type17.String({ minLength: 1, pattern: "\\S" });
var CronDeclarationKeySchema = Type17.String({ minLength: 1, maxLength: 200, pattern: "\\S" });
var CronDisplayNameSchema = Type17.String({ minLength: 1, maxLength: 200, pattern: "\\S" });
var CronOwnerSchema = closedObject({
  agentId: Type17.Optional(NonEmptyString),
  sessionKey: Type17.Optional(NonEmptyString)
});
var CronAnnounceChannelSchema = Type17.Union([Type17.Literal("last"), NonBlankString]);
var CronFailoverReasonSchema = Type17.Union([
  Type17.Literal("auth"),
  Type17.Literal("auth_permanent"),
  Type17.Literal("format"),
  Type17.Literal("rate_limit"),
  Type17.Literal("overloaded"),
  Type17.Literal("billing"),
  Type17.Literal("server_error"),
  Type17.Literal("timeout"),
  Type17.Literal("context_overflow"),
  Type17.Literal("model_not_found"),
  Type17.Literal("session_expired"),
  Type17.Literal("empty_response"),
  Type17.Literal("no_error_details"),
  Type17.Literal("unclassified"),
  Type17.Literal("unknown")
]);
var CronRunDiagnosticSeveritySchema = Type17.Union([
  Type17.Literal("info"),
  Type17.Literal("warn"),
  Type17.Literal("error")
]);
var CronRunDiagnosticSourceSchema = Type17.Union([
  Type17.Literal("cron-preflight"),
  Type17.Literal("cron-setup"),
  Type17.Literal("model-preflight"),
  Type17.Literal("agent-run"),
  Type17.Literal("tool"),
  Type17.Literal("exec"),
  Type17.Literal("delivery")
]);
var CronRunDiagnosticSchema = closedObject({
  ts: Type17.Integer({ minimum: 0 }),
  source: CronRunDiagnosticSourceSchema,
  severity: CronRunDiagnosticSeveritySchema,
  message: Type17.String(),
  toolName: Type17.Optional(Type17.String()),
  exitCode: Type17.Optional(Type17.Union([Type17.Number(), Type17.Null()])),
  truncated: Type17.Optional(Type17.Boolean())
});
var CronRunDiagnosticsSchema = closedObject({
  summary: Type17.Optional(Type17.String()),
  entries: Type17.Array(CronRunDiagnosticSchema)
});
var CronCommonOptionalFields = {
  agentId: Type17.Optional(Type17.Union([NonEmptyString, Type17.Null()])),
  sessionKey: Type17.Optional(Type17.Union([NonEmptyString, Type17.Null()])),
  description: Type17.Optional(Type17.String()),
  enabled: Type17.Optional(Type17.Boolean()),
  deleteAfterRun: Type17.Optional(Type17.Boolean())
};
function cronIdOrJobIdParams(extraFields) {
  return Type17.Union([
    closedObject({
      id: NonEmptyString,
      ...extraFields
    }),
    closedObject({
      jobId: NonEmptyString,
      ...extraFields
    })
  ]);
}
var CronRunLogJobIdSchema = Type17.String({
  minLength: 1,
  // Prevent path traversal via separators in cron.runs id/jobId.
  pattern: "^[^/\\\\]+$"
});
var CronScheduleSchema = Type17.Union([
  closedObject({
    kind: Type17.Literal("at"),
    at: NonEmptyString
  }),
  closedObject({
    kind: Type17.Literal("every"),
    everyMs: Type17.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
    anchorMs: Type17.Optional(Type17.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }))
  }),
  closedObject({
    kind: Type17.Literal("cron"),
    expr: NonEmptyString,
    tz: Type17.Optional(Type17.String()),
    staggerMs: Type17.Optional(Type17.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }))
  }),
  closedObject({
    // Event-driven trigger: fires once when the gateway-owned watcher running
    // `command` exits. Survives per-turn CLI teardown (runs under the gateway
    // ProcessSupervisor, not the turn process tree).
    kind: Type17.Literal("on-exit"),
    command: NonEmptyString,
    cwd: Type17.Optional(NonEmptyString)
  })
]);
var CronTriggerSchema = closedObject({
  script: Type17.String({ minLength: 1, maxLength: 65536 }),
  once: Type17.Optional(Type17.Boolean())
});
var CronPacingSchema = Type17.Object(
  {
    min: Type17.Optional(NonBlankString),
    max: Type17.Optional(NonBlankString)
  },
  {
    additionalProperties: false,
    description: "Dynamic-cadence bounds; at least one of min or max is required"
  }
);
var CronPayloadSchema = Type17.Union([
  closedObject({
    kind: Type17.Literal("systemEvent"),
    text: NonEmptyString,
    toolsAllow: Type17.Optional(Type17.Array(Type17.String())),
    toolsAllowIsDefault: Type17.Optional(Type17.Boolean())
  }),
  cronAgentTurnPayloadSchema({
    message: NonEmptyString,
    model: Type17.String(),
    fallbacks: Type17.Array(Type17.String()),
    toolsAllow: Type17.Array(Type17.String()),
    thinking: Type17.String()
  }),
  cronCommandPayloadSchema({
    argv: Type17.Array(NonEmptyString, { minItems: 1 }),
    toolsAllow: Type17.Array(Type17.String())
  }),
  cronScriptPayloadSchema({
    script: Type17.String({ minLength: 1, maxLength: 65536 }),
    toolsAllow: Type17.Array(Type17.String())
  })
]);
var CronPayloadPatchSchema = Type17.Union([
  closedObject({
    kind: Type17.Literal("systemEvent"),
    text: Type17.Optional(NonEmptyString),
    toolsAllow: Type17.Optional(Type17.Union([Type17.Array(Type17.String()), Type17.Null()])),
    toolsAllowIsDefault: Type17.Optional(Type17.Boolean())
  }),
  cronAgentTurnPayloadSchema({
    message: Type17.Optional(NonEmptyString),
    model: Type17.Union([Type17.String(), Type17.Null()]),
    fallbacks: Type17.Union([Type17.Array(Type17.String()), Type17.Null()]),
    toolsAllow: Type17.Union([Type17.Array(Type17.String()), Type17.Null()]),
    thinking: Type17.Union([Type17.String(), Type17.Null()])
  }),
  cronCommandPayloadSchema({
    argv: Type17.Optional(Type17.Array(NonEmptyString, { minItems: 1 })),
    toolsAllow: Type17.Union([Type17.Array(Type17.String()), Type17.Null()])
  }),
  cronScriptPayloadSchema({
    script: Type17.Optional(Type17.String({ minLength: 1, maxLength: 65536 })),
    toolsAllow: Type17.Union([Type17.Array(Type17.String()), Type17.Null()])
  })
]);
var CronFailureAlertSchema = closedObject({
  after: Type17.Optional(Type17.Integer({ minimum: 1 })),
  channel: Type17.Optional(CronAnnounceChannelSchema),
  to: Type17.Optional(NonBlankString),
  cooldownMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  includeSkipped: Type17.Optional(Type17.Boolean()),
  mode: Type17.Optional(Type17.Union([Type17.Literal("announce"), Type17.Literal("webhook")])),
  accountId: Type17.Optional(NonEmptyString)
});
var CronFailureAlertPatchSchema = closedObject({
  after: Type17.Optional(Type17.Union([Type17.Integer({ minimum: 1 }), Type17.Null()])),
  channel: Type17.Optional(Type17.Union([CronAnnounceChannelSchema, Type17.Null()])),
  to: Type17.Optional(Type17.Union([NonBlankString, Type17.Null()])),
  cooldownMs: Type17.Optional(Type17.Union([Type17.Integer({ minimum: 0 }), Type17.Null()])),
  includeSkipped: Type17.Optional(Type17.Union([Type17.Boolean(), Type17.Null()])),
  mode: Type17.Optional(Type17.Union([Type17.Literal("announce"), Type17.Literal("webhook"), Type17.Null()])),
  accountId: Type17.Optional(Type17.Union([NonEmptyString, Type17.Null()]))
});
var CronFailureDestinationSchema = closedObject({
  channel: Type17.Optional(CronAnnounceChannelSchema),
  to: Type17.Optional(NonBlankString),
  accountId: Type17.Optional(NonEmptyString),
  mode: Type17.Optional(Type17.Union([Type17.Literal("announce"), Type17.Literal("webhook")]))
});
var CronFailureDestinationPatchSchema = closedObject({
  channel: Type17.Optional(Type17.Union([CronAnnounceChannelSchema, Type17.Null()])),
  to: Type17.Optional(Type17.Union([NonBlankString, Type17.Null()])),
  accountId: Type17.Optional(Type17.Union([NonEmptyString, Type17.Null()])),
  mode: Type17.Optional(Type17.Union([Type17.Literal("announce"), Type17.Literal("webhook"), Type17.Null()]))
});
var CronCompletionDestinationSchema = closedObject({
  mode: Type17.Literal("webhook"),
  to: NonBlankString
});
var CronDeliverySharedProperties = {
  channel: Type17.Optional(CronAnnounceChannelSchema),
  threadId: Type17.Optional(Type17.Union([Type17.String(), Type17.Number()])),
  accountId: Type17.Optional(NonEmptyString),
  bestEffort: Type17.Optional(Type17.Boolean()),
  failureDestination: Type17.Optional(CronFailureDestinationSchema)
};
var CronDeliveryPatchSharedProperties = {
  channel: Type17.Optional(Type17.Union([CronAnnounceChannelSchema, Type17.Null()])),
  threadId: Type17.Optional(Type17.Union([Type17.String(), Type17.Number(), Type17.Null()])),
  accountId: Type17.Optional(Type17.Union([NonEmptyString, Type17.Null()])),
  bestEffort: Type17.Optional(Type17.Boolean()),
  failureDestination: Type17.Optional(Type17.Union([CronFailureDestinationPatchSchema, Type17.Null()]))
};
var CronDeliveryNoopSchema = closedObject({
  mode: Type17.Literal("none"),
  ...CronDeliverySharedProperties,
  to: Type17.Optional(NonBlankString)
});
var CronDeliveryAnnounceSchema = closedObject({
  mode: Type17.Literal("announce"),
  ...CronDeliverySharedProperties,
  completionDestination: Type17.Optional(CronCompletionDestinationSchema),
  to: Type17.Optional(NonBlankString)
});
var CronDeliveryWebhookSchema = closedObject({
  mode: Type17.Literal("webhook"),
  ...CronDeliverySharedProperties,
  to: NonBlankString
});
var CronDeliverySchema = Type17.Union([
  CronDeliveryNoopSchema,
  CronDeliveryAnnounceSchema,
  CronDeliveryWebhookSchema
]);
var CronDeliveryPatchSchema = closedObject({
  mode: Type17.Optional(
    Type17.Union([Type17.Literal("none"), Type17.Literal("announce"), Type17.Literal("webhook")])
  ),
  ...CronDeliveryPatchSharedProperties,
  completionDestination: Type17.Optional(Type17.Union([CronCompletionDestinationSchema, Type17.Null()])),
  to: Type17.Optional(Type17.Union([NonBlankString, Type17.Null()]))
});
var CronFailureNotificationDeliverySchema = closedObject({
  delivered: Type17.Optional(Type17.Boolean()),
  status: CronDeliveryStatusSchema,
  error: Type17.Optional(Type17.String())
});
var CronJobStateSchema = closedObject({
  nextRunAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  runningAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  lastRunAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  lastRunStatus: Type17.Optional(CronRunStatusSchema),
  lastStatus: Type17.Optional(DeprecatedCronRunStatusSchema),
  lastError: Type17.Optional(Type17.String()),
  lastDiagnostics: Type17.Optional(CronRunDiagnosticsSchema),
  lastDiagnosticSummary: Type17.Optional(Type17.String()),
  lastErrorReason: Type17.Optional(CronFailoverReasonSchema),
  lastDurationMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  consecutiveErrors: Type17.Optional(Type17.Integer({ minimum: 0 })),
  consecutiveSkipped: Type17.Optional(Type17.Integer({ minimum: 0 })),
  lastDelivered: Type17.Optional(Type17.Boolean()),
  lastDeliveryStatus: Type17.Optional(CronDeliveryStatusSchema),
  lastDeliveryError: Type17.Optional(Type17.String()),
  lastFailureNotificationDelivered: Type17.Optional(Type17.Boolean()),
  lastFailureNotificationDeliveryStatus: Type17.Optional(CronDeliveryStatusSchema),
  lastFailureNotificationDeliveryError: Type17.Optional(Type17.String()),
  lastFailureAlertAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  lastTriggerEvalAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  triggerEvalCount: Type17.Optional(Type17.Integer({ minimum: 0 })),
  lastTriggerFireAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  triggerState: Type17.Optional(Type17.Unknown())
});
var CronJobStatePatchSchema = closedObject({
  nextRunAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  runningAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  lastRunAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  lastRunStatus: Type17.Optional(CronRunStatusSchema),
  lastStatus: Type17.Optional(DeprecatedCronRunStatusSchema),
  lastError: Type17.Optional(Type17.String()),
  lastErrorReason: Type17.Optional(CronFailoverReasonSchema),
  lastDurationMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  consecutiveErrors: Type17.Optional(Type17.Integer({ minimum: 0 })),
  consecutiveSkipped: Type17.Optional(Type17.Integer({ minimum: 0 })),
  lastDelivered: Type17.Optional(Type17.Boolean()),
  lastDeliveryStatus: Type17.Optional(CronDeliveryStatusSchema),
  lastDeliveryError: Type17.Optional(Type17.String()),
  lastFailureNotificationDelivered: Type17.Optional(Type17.Boolean()),
  lastFailureNotificationDeliveryStatus: Type17.Optional(CronDeliveryStatusSchema),
  lastFailureNotificationDeliveryError: Type17.Optional(Type17.String()),
  lastFailureAlertAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  lastTriggerEvalAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  triggerEvalCount: Type17.Optional(Type17.Integer({ minimum: 0 })),
  lastTriggerFireAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  triggerState: Type17.Optional(Type17.Unknown())
});
var CronJobSchema = closedObject({
  id: NonEmptyString,
  declarationKey: Type17.Optional(CronDeclarationKeySchema),
  displayName: Type17.Optional(CronDisplayNameSchema),
  owner: Type17.Optional(CronOwnerSchema),
  agentId: Type17.Optional(NonEmptyString),
  sessionKey: Type17.Optional(NonEmptyString),
  name: NonEmptyString,
  description: Type17.Optional(Type17.String()),
  enabled: Type17.Boolean(),
  deleteAfterRun: Type17.Optional(Type17.Boolean()),
  createdAtMs: Type17.Integer({ minimum: 0 }),
  updatedAtMs: Type17.Integer({ minimum: 0 }),
  /** Opaque Gateway-computed token for the job definition, excluding scheduler state. */
  configRevision: Type17.Optional(CronConfigRevisionSchema),
  schedule: CronScheduleSchema,
  pacing: Type17.Optional(CronPacingSchema),
  trigger: Type17.Optional(CronTriggerSchema),
  sessionTarget: CronSessionTargetSchema,
  wakeMode: CronWakeModeSchema,
  payload: CronPayloadSchema,
  delivery: Type17.Optional(CronDeliverySchema),
  failureAlert: Type17.Optional(Type17.Union([Type17.Literal(false), CronFailureAlertSchema])),
  state: CronJobStateSchema,
  nextRunAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  lastRunAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  lastRunStatus: Type17.Optional(CronRunStatusSchema),
  lastRunError: Type17.Optional(Type17.String()),
  lastDelivered: Type17.Optional(Type17.Boolean()),
  lastDeliveryStatus: Type17.Optional(CronDeliveryStatusSchema),
  lastDeliveryError: Type17.Optional(Type17.String()),
  lastFailureNotificationDelivered: Type17.Optional(Type17.Boolean()),
  lastFailureNotificationDeliveryStatus: Type17.Optional(CronDeliveryStatusSchema),
  lastFailureNotificationDeliveryError: Type17.Optional(Type17.String())
});
var CronListParamsSchema = closedObject({
  includeDisabled: Type17.Optional(Type17.Boolean()),
  limit: Type17.Optional(Type17.Integer({ minimum: 1, maximum: 200 })),
  offset: Type17.Optional(Type17.Integer({ minimum: 0 })),
  query: Type17.Optional(Type17.String()),
  enabled: Type17.Optional(CronJobsEnabledFilterSchema),
  scheduleKind: Type17.Optional(CronJobsScheduleKindFilterSchema),
  lastRunStatus: Type17.Optional(CronJobsLastRunStatusFilterSchema),
  sortBy: Type17.Optional(CronJobsSortBySchema),
  sortDir: Type17.Optional(CronSortDirSchema),
  agentId: Type17.Optional(NonEmptyString),
  compact: Type17.Optional(Type17.Boolean())
});
var CronStatusParamsSchema = closedObject({});
var CronGetParamsSchema = cronIdOrJobIdParams({});
var CronAddParamsSchema = closedObject({
  name: NonEmptyString,
  declarationKey: Type17.Optional(CronDeclarationKeySchema),
  displayName: Type17.Optional(CronDisplayNameSchema),
  owner: Type17.Optional(CronOwnerSchema),
  ...CronCommonOptionalFields,
  schedule: CronScheduleSchema,
  pacing: Type17.Optional(CronPacingSchema),
  trigger: Type17.Optional(CronTriggerSchema),
  sessionTarget: CronSessionTargetSchema,
  wakeMode: CronWakeModeSchema,
  payload: CronPayloadSchema,
  delivery: Type17.Optional(CronDeliverySchema),
  failureAlert: Type17.Optional(Type17.Union([Type17.Literal(false), CronFailureAlertSchema]))
});
var CronDeclarativeAddResultSchema = closedObject({
  created: Type17.Boolean(),
  updated: Type17.Optional(Type17.Boolean()),
  job: CronJobSchema
});
var CronAddResultSchema = Type17.Union([CronJobSchema, CronDeclarativeAddResultSchema]);
var CronJobPatchSchema = closedObject({
  name: Type17.Optional(NonEmptyString),
  displayName: Type17.Optional(Type17.Union([CronDisplayNameSchema, Type17.Null()])),
  ...CronCommonOptionalFields,
  schedule: Type17.Optional(CronScheduleSchema),
  pacing: Type17.Optional(Type17.Union([CronPacingSchema, Type17.Null()])),
  trigger: Type17.Optional(Type17.Union([CronTriggerSchema, Type17.Null()])),
  sessionTarget: Type17.Optional(CronSessionTargetSchema),
  wakeMode: Type17.Optional(CronWakeModeSchema),
  payload: Type17.Optional(CronPayloadPatchSchema),
  delivery: Type17.Optional(CronDeliveryPatchSchema),
  failureAlert: Type17.Optional(
    Type17.Union([Type17.Literal(false), CronFailureAlertPatchSchema, Type17.Null()])
  ),
  state: Type17.Optional(CronJobStatePatchSchema)
});
var CronUpdateParamsSchema = cronIdOrJobIdParams({
  patch: CronJobPatchSchema,
  /** Rejects the patch when the current definition does not match the caller's token. */
  expectedConfigRevision: Type17.Optional(CronConfigRevisionSchema)
});
var CronRemoveParamsSchema = cronIdOrJobIdParams({});
var CronRunParamsSchema = cronIdOrJobIdParams({
  mode: Type17.Optional(Type17.Union([Type17.Literal("due"), Type17.Literal("force")])),
  /** Rejects the mutation if the Gateway restarted after the caller's preflight. */
  expectedProcessInstanceId: Type17.Optional(NonEmptyString)
});
var CronRunsParamsSchema = closedObject({
  agentId: Type17.Optional(NonEmptyString),
  scope: Type17.Optional(Type17.Union([Type17.Literal("job"), Type17.Literal("all")])),
  id: Type17.Optional(CronRunLogJobIdSchema),
  jobId: Type17.Optional(CronRunLogJobIdSchema),
  runId: Type17.Optional(NonEmptyString),
  limit: Type17.Optional(Type17.Integer({ minimum: 1, maximum: 200 })),
  offset: Type17.Optional(Type17.Integer({ minimum: 0 })),
  statuses: Type17.Optional(Type17.Array(CronRunsStatusValueSchema, { minItems: 1, maxItems: 3 })),
  status: Type17.Optional(CronRunsStatusFilterSchema),
  deliveryStatuses: Type17.Optional(
    Type17.Array(CronDeliveryStatusSchema, { minItems: 1, maxItems: 4 })
  ),
  deliveryStatus: Type17.Optional(CronDeliveryStatusSchema),
  query: Type17.Optional(Type17.String()),
  sortDir: Type17.Optional(CronSortDirSchema)
});
var CronRunLogEntrySchema = closedObject({
  ts: Type17.Integer({ minimum: 0 }),
  jobId: NonEmptyString,
  action: Type17.Literal("finished"),
  status: Type17.Optional(CronRunStatusSchema),
  error: Type17.Optional(Type17.String()),
  errorReason: Type17.Optional(CronFailoverReasonSchema),
  summary: Type17.Optional(Type17.String()),
  diagnostics: Type17.Optional(CronRunDiagnosticsSchema),
  delivered: Type17.Optional(Type17.Boolean()),
  deliveryStatus: Type17.Optional(CronDeliveryStatusSchema),
  deliveryError: Type17.Optional(Type17.String()),
  failureNotificationDelivery: Type17.Optional(CronFailureNotificationDeliverySchema),
  sessionId: Type17.Optional(NonEmptyString),
  sessionKey: Type17.Optional(NonEmptyString),
  runId: Type17.Optional(NonEmptyString),
  runAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  durationMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  nextRunAtMs: Type17.Optional(Type17.Integer({ minimum: 0 })),
  triggerFired: Type17.Optional(Type17.Boolean()),
  model: Type17.Optional(Type17.String()),
  provider: Type17.Optional(Type17.String()),
  usage: Type17.Optional(
    closedObject({
      input_tokens: Type17.Optional(Type17.Number()),
      output_tokens: Type17.Optional(Type17.Number()),
      total_tokens: Type17.Optional(Type17.Number()),
      cache_read_tokens: Type17.Optional(Type17.Number()),
      cache_write_tokens: Type17.Optional(Type17.Number())
    })
  ),
  jobName: Type17.Optional(Type17.String())
});

// packages/gateway-protocol/src/schema/error-codes.ts
import { Type as Type18 } from "typebox";

// packages/gateway-protocol/src/gateway-error-details.ts
var ErrorCodes = {
  /** Client has not completed account/device linking for this gateway. */
  NOT_LINKED: "NOT_LINKED",
  /** Device exists but still needs an explicit pairing approval. */
  NOT_PAIRED: "NOT_PAIRED",
  /** Agent turn exceeded the gateway wait window. */
  AGENT_TIMEOUT: "AGENT_TIMEOUT",
  /** Request payload failed protocol validation or method preconditions. */
  INVALID_REQUEST: "INVALID_REQUEST",
  /** Authenticated caller lacks permission for the requested operation. */
  FORBIDDEN: "FORBIDDEN",
  /** Approval resolution referenced a missing or expired approval request. */
  APPROVAL_NOT_FOUND: "APPROVAL_NOT_FOUND",
  /** Gateway service or required backend is temporarily unavailable. */
  UNAVAILABLE: "UNAVAILABLE"
};
var GatewayErrorDetailCodes = {
  MISSING_SCOPE: "MISSING_SCOPE",
  MCP_APP_VIEW_EXPIRED: "MCP_APP_VIEW_EXPIRED"
};
var LEGACY_MISSING_SCOPE_PATTERN = /\bmissing scope:\s*([a-z0-9._-]+)/i;
function asRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function readMissingScopeErrorDetails(details) {
  const record = asRecord(details);
  if (record?.code !== GatewayErrorDetailCodes.MISSING_SCOPE) {
    return null;
  }
  const missingScope = typeof record.missingScope === "string" ? record.missingScope.trim() : "";
  const requiredScopes = Array.isArray(record.requiredScopes) ? record.requiredScopes.map((scope) => typeof scope === "string" ? scope.trim() : "") : [];
  if (!missingScope || requiredScopes.length === 0 || requiredScopes.some((scope) => !scope)) {
    return null;
  }
  return {
    code: GatewayErrorDetailCodes.MISSING_SCOPE,
    missingScope,
    requiredScopes
  };
}
function isMcpAppViewExpiredError(error) {
  const record = asRecord(error);
  return asRecord(record?.details)?.code === GatewayErrorDetailCodes.MCP_APP_VIEW_EXPIRED;
}
function readMissingScopeError(error) {
  const record = asRecord(error);
  if (!record) {
    return null;
  }
  const structured = readMissingScopeErrorDetails(record.details);
  if (structured) {
    return structured;
  }
  const gatewayError = record;
  const code = typeof gatewayError.gatewayCode === "string" ? gatewayError.gatewayCode : typeof gatewayError.code === "string" ? gatewayError.code : "";
  if (code !== ErrorCodes.FORBIDDEN && code !== ErrorCodes.INVALID_REQUEST) {
    return null;
  }
  const message = typeof gatewayError.message === "string" ? gatewayError.message : "";
  const missingScope = message.match(LEGACY_MISSING_SCOPE_PATTERN)?.[1];
  return missingScope ? {
    code: GatewayErrorDetailCodes.MISSING_SCOPE,
    missingScope,
    requiredScopes: [missingScope]
  } : null;
}

// packages/gateway-protocol/src/schema/error-codes.ts
var MissingScopeErrorDetailsSchema = closedObject({
  code: Type18.Literal(GatewayErrorDetailCodes.MISSING_SCOPE),
  missingScope: NonEmptyString,
  requiredScopes: Type18.Array(NonEmptyString, { minItems: 1 })
});
var McpAppViewExpiredErrorDetailsSchema = closedObject({
  code: Type18.Literal(GatewayErrorDetailCodes.MCP_APP_VIEW_EXPIRED)
});
var GatewayErrorDetailsSchema = Type18.Union([
  MissingScopeErrorDetailsSchema,
  McpAppViewExpiredErrorDetailsSchema
]);
function errorShape(code, message, opts) {
  return {
    code,
    message,
    ...opts
  };
}
function buildMissingScopeErrorDetails(params) {
  const requiredScopes = params.requiredScopes.length > 0 ? [...params.requiredScopes] : [params.missingScope];
  return {
    code: GatewayErrorDetailCodes.MISSING_SCOPE,
    missingScope: params.missingScope,
    requiredScopes
  };
}
function missingScopeErrorShape(params) {
  const details = buildMissingScopeErrorDetails(params);
  return errorShape(ErrorCodes.FORBIDDEN, `missing scope: ${params.missingScope}`, { details });
}

// packages/gateway-protocol/src/schema/environments.ts
import { Type as Type19 } from "typebox";
var EnvironmentStatusSchema = Type19.String({
  enum: ["available", "unavailable", "starting", "stopping", "error"]
});
var WorkerEnvironmentStateSchema = Type19.Union([
  Type19.Literal("requested"),
  Type19.Literal("provisioning"),
  Type19.Literal("bootstrapping"),
  Type19.Literal("ready"),
  Type19.Literal("attached"),
  Type19.Literal("idle"),
  Type19.Literal("draining"),
  Type19.Literal("destroying"),
  Type19.Literal("destroyed"),
  Type19.Literal("failed"),
  Type19.Literal("orphaned")
]);
var WorkerTunnelStatusSchema = Type19.Union([
  Type19.Literal("stopped"),
  Type19.Literal("connecting"),
  Type19.Literal("connected"),
  Type19.Literal("reconnecting")
]);
var WorkerEnvironmentMetadataSchema = closedObject({
  providerId: NonEmptyString,
  leaseId: Type19.Optional(NonEmptyString),
  state: WorkerEnvironmentStateSchema,
  ageMs: Type19.Integer({ minimum: 0 }),
  idleMs: Type19.Optional(Type19.Integer({ minimum: 0 })),
  attachedSessionIds: Type19.Array(NonEmptyString),
  tunnelStatus: WorkerTunnelStatusSchema
});
function createEnvironmentSummarySchema() {
  return closedObject({
    id: NonEmptyString,
    type: NonEmptyString,
    label: Type19.Optional(NonEmptyString),
    status: EnvironmentStatusSchema,
    capabilities: Type19.Optional(Type19.Array(NonEmptyString)),
    worker: Type19.Optional(WorkerEnvironmentMetadataSchema)
  });
}
var EnvironmentSummarySchema = createEnvironmentSummarySchema();
var EnvironmentsListParamsSchema = closedObject({});
var WorkerEnvironmentProfileSummarySchema = closedObject({
  id: NonEmptyString,
  providerId: NonEmptyString
});
var EnvironmentsListResultSchema = closedObject({
  environments: Type19.Array(EnvironmentSummarySchema),
  profiles: Type19.Optional(Type19.Array(WorkerEnvironmentProfileSummarySchema))
});
var EnvironmentsStatusParamsSchema = closedObject({ environmentId: NonEmptyString });
var EnvironmentsStatusResultSchema = createEnvironmentSummarySchema();
var EnvironmentsCreateParamsSchema = closedObject({
  profileId: NonEmptyString,
  idempotencyKey: NonEmptyString
});
var EnvironmentsCreateResultSchema = createEnvironmentSummarySchema();
var EnvironmentsDestroyParamsSchema = closedObject({
  environmentId: NonEmptyString,
  force: Type19.Optional(Type19.Boolean())
});
var EnvironmentsDestroyResultSchema = createEnvironmentSummarySchema();

// packages/gateway-protocol/src/schema/exec-approvals.ts
import { Type as Type20 } from "typebox";
var ExecApprovalsAllowlistEntrySchema = closedObject({
  id: Type20.Optional(NonEmptyString),
  pattern: Type20.String(),
  source: Type20.Optional(Type20.Literal("allow-always")),
  commandText: Type20.Optional(Type20.String()),
  argPattern: Type20.Optional(Type20.String()),
  lastUsedAt: Type20.Optional(Type20.Number({ minimum: 0 })),
  lastUsedCommand: Type20.Optional(Type20.String()),
  lastResolvedPath: Type20.Optional(Type20.String())
});
var ExecApprovalsPolicyFields = {
  security: Type20.Optional(Type20.String()),
  ask: Type20.Optional(Type20.String()),
  askFallback: Type20.Optional(Type20.String()),
  autoAllowSkills: Type20.Optional(Type20.Boolean())
};
var ExecSecuritySchema = Type20.Union([
  Type20.Literal("deny"),
  Type20.Literal("allowlist"),
  Type20.Literal("full")
]);
var ExecAskSchema = Type20.Union([
  Type20.Literal("off"),
  Type20.Literal("on-miss"),
  Type20.Literal("always")
]);
var ExecApprovalsResolvedDefaultsSchema = closedObject({
  security: ExecSecuritySchema,
  ask: ExecAskSchema,
  askFallback: ExecSecuritySchema,
  autoAllowSkills: Type20.Boolean()
});
var ExecApprovalsDefaultsSchema = closedObject(ExecApprovalsPolicyFields);
var ExecApprovalsAgentSchema = closedObject({
  ...ExecApprovalsPolicyFields,
  allowlist: Type20.Optional(Type20.Array(ExecApprovalsAllowlistEntrySchema))
});
var ExecApprovalsFileSchema = closedObject({
  version: Type20.Literal(1),
  socket: Type20.Optional(
    closedObject({
      path: Type20.Optional(Type20.String()),
      token: Type20.Optional(Type20.String())
    })
  ),
  defaults: Type20.Optional(ExecApprovalsDefaultsSchema),
  agents: Type20.Optional(Type20.Record(Type20.String(), ExecApprovalsAgentSchema))
});
var ExecApprovalsSnapshotSchema = closedObject({
  path: NonEmptyString,
  exists: Type20.Boolean(),
  hash: NonEmptyString,
  file: ExecApprovalsFileSchema
});
var NativeExecApprovalActionSchema = Type20.Union([
  Type20.Literal("allow"),
  Type20.Literal("deny"),
  Type20.Literal("prompt")
]);
var NativeExecApprovalRuleSchema = closedObject({
  pattern: NonEmptyString,
  action: NativeExecApprovalActionSchema,
  shells: Type20.Optional(Type20.Array(NonEmptyString)),
  description: Type20.Optional(Type20.String()),
  enabled: Type20.Optional(Type20.Boolean())
});
var NativeExecApprovalConstraintsSchema = closedObject({
  baseHashRequired: Type20.Optional(Type20.Boolean()),
  defaultAllowAllowed: Type20.Optional(Type20.Boolean()),
  broadAllowRulesAllowed: Type20.Optional(Type20.Boolean()),
  dangerousAllowRulesAllowed: Type20.Optional(Type20.Boolean())
});
var ExecApprovalsNodeSnapshotSchema = Type20.Object(
  {
    path: Type20.Optional(Type20.String()),
    exists: Type20.Optional(Type20.Boolean()),
    hash: Type20.Optional(Type20.String()),
    file: Type20.Optional(ExecApprovalsFileSchema),
    resolvedDefaults: Type20.Optional(ExecApprovalsResolvedDefaultsSchema),
    enabled: Type20.Optional(Type20.Boolean()),
    baseHash: Type20.Optional(NonEmptyString),
    defaultAction: Type20.Optional(NativeExecApprovalActionSchema),
    rules: Type20.Optional(Type20.Array(NativeExecApprovalRuleSchema)),
    constraints: Type20.Optional(NativeExecApprovalConstraintsSchema),
    message: Type20.Optional(Type20.String())
  },
  {
    additionalProperties: false,
    oneOf: [
      {
        required: ["path", "exists", "hash", "file"],
        not: {
          anyOf: [
            { required: ["enabled"] },
            { required: ["baseHash"] },
            { required: ["defaultAction"] },
            { required: ["rules"] },
            { required: ["constraints"] },
            { required: ["message"] }
          ]
        }
      },
      {
        properties: { enabled: { const: true }, hash: { minLength: 1 } },
        required: ["enabled", "hash", "defaultAction", "rules"],
        not: {
          anyOf: [
            { required: ["path"] },
            { required: ["exists"] },
            { required: ["file"] },
            { required: ["resolvedDefaults"] },
            { required: ["message"] }
          ]
        }
      },
      {
        properties: { enabled: { const: false } },
        required: ["enabled"],
        not: {
          anyOf: [
            { required: ["path"] },
            { required: ["exists"] },
            { required: ["hash"] },
            { required: ["file"] },
            { required: ["resolvedDefaults"] },
            { required: ["baseHash"] },
            { required: ["defaultAction"] },
            { required: ["rules"] },
            { required: ["constraints"] }
          ]
        }
      }
    ]
  }
);
var ExecApprovalsGetParamsSchema = closedObject({});
var ExecApprovalsSetParamsSchema = closedObject({
  file: ExecApprovalsFileSchema,
  baseHash: Type20.Optional(NonEmptyString)
});
var ExecApprovalsNodeGetParamsSchema = closedObject({
  nodeId: NonEmptyString
});
var NativeExecApprovalPolicySchema = closedObject({
  defaultAction: Type20.Optional(NativeExecApprovalActionSchema),
  // Windows treats set as full replacement; omission would silently clear the rule list.
  rules: Type20.Array(NativeExecApprovalRuleSchema)
});
var ExecApprovalsNodeSetParamsSchema = Type20.Object(
  {
    nodeId: NonEmptyString,
    file: Type20.Optional(ExecApprovalsFileSchema),
    native: Type20.Optional(NativeExecApprovalPolicySchema),
    baseHash: Type20.Optional(NonEmptyString)
  },
  {
    additionalProperties: false,
    oneOf: [
      { required: ["file"], not: { required: ["native"] } },
      {
        required: ["native", "baseHash"],
        not: { required: ["file"] }
      }
    ]
  }
);
var ExecApprovalGetParamsSchema = closedObject({
  id: NonEmptyString
});
var ExecApprovalPolicySecuritySchema = Type20.Union([
  Type20.Literal("deny"),
  Type20.Literal("allowlist"),
  Type20.Literal("full")
]);
var ExecApprovalPolicySnapshotSchema = closedObject({
  security: ExecApprovalPolicySecuritySchema,
  ask: Type20.Union([Type20.Literal("off"), Type20.Literal("on-miss"), Type20.Literal("always")]),
  askFallback: ExecApprovalPolicySecuritySchema,
  autoAllowSkills: Type20.Boolean(),
  allowlistRules: Type20.Array(
    closedObject({
      pattern: Type20.String(),
      argPattern: Type20.Optional(Type20.String()),
      source: Type20.Optional(Type20.Literal("allow-always"))
    })
  )
});
var ExecApprovalRequestParamsSchema = closedObject({
  id: Type20.Optional(NonEmptyString),
  command: Type20.Optional(NonEmptyString),
  commandArgv: Type20.Optional(Type20.Array(Type20.String())),
  systemRunPlan: Type20.Optional(
    closedObject({
      argv: Type20.Array(Type20.String()),
      cwd: Type20.Union([Type20.String(), Type20.Null()]),
      commandText: Type20.String(),
      commandPreview: Type20.Optional(Type20.Union([Type20.String(), Type20.Null()])),
      agentId: Type20.Union([Type20.String(), Type20.Null()]),
      sessionKey: Type20.Union([Type20.String(), Type20.Null()]),
      policySnapshot: Type20.Optional(ExecApprovalPolicySnapshotSchema),
      mutableFileOperand: Type20.Optional(
        Type20.Union([
          closedObject({
            argvIndex: Type20.Integer({ minimum: 0 }),
            path: Type20.String(),
            sha256: Type20.String()
          }),
          Type20.Null()
        ])
      )
    })
  ),
  env: Type20.Optional(Type20.Record(NonEmptyString, Type20.String())),
  cwd: Type20.Optional(Type20.Union([Type20.String(), Type20.Null()])),
  nodeId: Type20.Optional(Type20.Union([NonEmptyString, Type20.Null()])),
  host: Type20.Optional(Type20.Union([Type20.String(), Type20.Null()])),
  security: Type20.Optional(Type20.Union([Type20.String(), Type20.Null()])),
  ask: Type20.Optional(Type20.Union([Type20.String(), Type20.Null()])),
  warningText: Type20.Optional(Type20.Union([Type20.String(), Type20.Null()])),
  unavailableDecisions: Type20.Optional(
    Type20.Array(Type20.String({ enum: ["allow-always"] }), {
      minItems: 1,
      maxItems: 1
    })
  ),
  commandSpans: Type20.Optional(
    Type20.Array(
      closedObject({
        startIndex: Type20.Integer({
          minimum: 0,
          description: "Inclusive UTF-16 code unit offset into command."
        }),
        endIndex: Type20.Integer({
          minimum: 1,
          description: "Exclusive UTF-16 code unit offset into command; must be greater than startIndex and no greater than command.length."
        })
      })
    )
  ),
  agentId: Type20.Optional(Type20.Union([Type20.String(), Type20.Null()])),
  resolvedPath: Type20.Optional(Type20.Union([Type20.String(), Type20.Null()])),
  sessionKey: Type20.Optional(Type20.Union([Type20.String(), Type20.Null()])),
  sessionId: Type20.Optional(Type20.Union([Type20.String(), Type20.Null()])),
  runId: Type20.Optional(Type20.Union([Type20.String(), Type20.Null()])),
  toolCallId: Type20.Optional(Type20.Union([Type20.String(), Type20.Null()])),
  turnSourceChannel: Type20.Optional(Type20.Union([Type20.String(), Type20.Null()])),
  turnSourceTo: Type20.Optional(Type20.Union([Type20.String(), Type20.Null()])),
  turnSourceAccountId: Type20.Optional(Type20.Union([Type20.String(), Type20.Null()])),
  turnSourceThreadId: Type20.Optional(Type20.Union([Type20.String(), Type20.Number(), Type20.Null()])),
  approvalReviewerDeviceIds: Type20.Optional(
    Type20.Array(NonEmptyString, {
      description: "Trusted approval-runtime metadata naming operator devices that may review this approval; ordinary Gateway clients may send the field, but the Gateway only binds it for internal approval-runtime requests."
    })
  ),
  requireDeliveryRoute: Type20.Optional(Type20.Boolean()),
  suppressDelivery: Type20.Optional(Type20.Boolean()),
  timeoutMs: Type20.Optional(Type20.Integer({ minimum: 1 })),
  twoPhase: Type20.Optional(Type20.Boolean())
});
var ExecApprovalResolveParamsSchema = closedObject({
  id: NonEmptyString,
  decision: NonEmptyString
});

// packages/gateway-protocol/src/schema/devices.ts
import { Type as Type21 } from "typebox";
var DevicePairListParamsSchema = closedObject({});
var DevicePairApproveParamsSchema = closedObject({ requestId: NonEmptyString });
var DevicePairRejectParamsSchema = closedObject({ requestId: NonEmptyString });
var DevicePairRemoveParamsSchema = closedObject({ deviceId: NonEmptyString });
var DevicePairLabelString = Type21.String({ minLength: 1, maxLength: 64 });
var DevicePairRenameParamsSchema = closedObject({
  deviceId: NonEmptyString,
  label: DevicePairLabelString
});
var DeviceTokenRotateParamsSchema = closedObject({
  deviceId: NonEmptyString,
  role: NonEmptyString,
  scopes: Type21.Optional(Type21.Array(NonEmptyString))
});
var DeviceTokenRevokeParamsSchema = closedObject({
  deviceId: NonEmptyString,
  role: NonEmptyString
});
var DevicePairRequestedEventSchema = closedObject({
  requestId: NonEmptyString,
  deviceId: NonEmptyString,
  publicKey: NonEmptyString,
  displayName: Type21.Optional(NonEmptyString),
  platform: Type21.Optional(NonEmptyString),
  deviceFamily: Type21.Optional(NonEmptyString),
  clientId: Type21.Optional(NonEmptyString),
  clientMode: Type21.Optional(NonEmptyString),
  browserOrigin: Type21.Optional(NonEmptyString),
  role: Type21.Optional(NonEmptyString),
  roles: Type21.Optional(Type21.Array(NonEmptyString)),
  scopes: Type21.Optional(Type21.Array(NonEmptyString)),
  remoteIp: Type21.Optional(NonEmptyString),
  silent: Type21.Optional(Type21.Boolean()),
  isRepair: Type21.Optional(Type21.Boolean()),
  ts: Type21.Integer({ minimum: 0 })
});
var DevicePairResolvedEventSchema = closedObject({
  requestId: NonEmptyString,
  deviceId: NonEmptyString,
  decision: NonEmptyString,
  ts: Type21.Integer({ minimum: 0 })
});
var SetupCodeQrDataUrlSchema = Type21.String({
  maxLength: 16384,
  pattern: "^data:image/png;base64,"
});
var DevicePairSetupCodeParamsSchema = closedObject({
  publicUrl: Type21.Optional(NonEmptyString),
  preferRemoteUrl: Type21.Optional(Type21.Boolean()),
  includeQr: Type21.Optional(Type21.Boolean()),
  bootstrapProfile: Type21.Optional(Type21.String({ enum: ["limited", "node"] }))
});
var DevicePairSetupCodeResultSchema = closedObject({
  setupCode: NonEmptyString,
  qrDataUrl: Type21.Optional(SetupCodeQrDataUrlSchema),
  gatewayUrl: NonEmptyString,
  gatewayUrls: Type21.Optional(
    Type21.Array(NonEmptyString, { minItems: 2, maxItems: 8, uniqueItems: true })
  ),
  auth: Type21.Union([Type21.Literal("token"), Type21.Literal("password")]),
  urlSource: NonEmptyString,
  access: Type21.Optional(
    Type21.Union([Type21.Literal("full"), Type21.Literal("limited"), Type21.Literal("node")])
  ),
  accessDowngraded: Type21.Optional(Type21.Boolean())
});

// packages/gateway-protocol/src/schema/frames.ts
import { Type as Type23 } from "typebox";

// packages/gateway-protocol/src/schema/snapshot.ts
import { Type as Type22 } from "typebox";
var PresenceEntrySchema = closedObject({
  host: Type22.Optional(NonEmptyString),
  ip: Type22.Optional(NonEmptyString),
  version: Type22.Optional(NonEmptyString),
  platform: Type22.Optional(NonEmptyString),
  deviceFamily: Type22.Optional(NonEmptyString),
  modelIdentifier: Type22.Optional(NonEmptyString),
  mode: Type22.Optional(NonEmptyString),
  lastInputSeconds: Type22.Optional(Type22.Integer({ minimum: 0 })),
  reason: Type22.Optional(NonEmptyString),
  tags: Type22.Optional(Type22.Array(NonEmptyString)),
  text: Type22.Optional(Type22.String()),
  ts: Type22.Integer({ minimum: 0 }),
  deviceId: Type22.Optional(NonEmptyString),
  roles: Type22.Optional(Type22.Array(NonEmptyString)),
  scopes: Type22.Optional(Type22.Array(NonEmptyString)),
  instanceId: Type22.Optional(NonEmptyString),
  user: Type22.Optional(
    closedObject({
      /** Opaque identity key: authenticated email today, durable profile id later. Clients group presence by this. */
      id: NonEmptyString,
      email: Type22.Optional(NonEmptyString),
      name: Type22.Optional(NonEmptyString),
      avatarUrl: Type22.Optional(NonEmptyString)
    })
  ),
  /** Session keys this connection is actively subscribed to (watching). Sorted lexicographically for deterministic snapshots. */
  watchedSessions: Type22.Optional(Type22.Array(NonEmptyString))
});
var HealthSessionSummarySchema = closedObject({
  path: Type22.String(),
  count: Type22.Integer({ minimum: 0 }),
  recent: Type22.Array(
    closedObject({
      key: Type22.String(),
      updatedAt: Type22.Union([Type22.Integer({ minimum: 0 }), Type22.Null()]),
      age: Type22.Union([Type22.Integer({ minimum: 0 }), Type22.Null()])
    })
  )
});
var HealthSnapshotSchema = closedObject({
  // Every field is optional because hello snapshots use an empty object until
  // the asynchronous health producer has populated the cache.
  ok: Type22.Optional(Type22.Literal(true)),
  ts: Type22.Optional(Type22.Integer({ minimum: 0 })),
  durationMs: Type22.Optional(Type22.Integer({ minimum: 0 })),
  eventLoop: Type22.Optional(
    closedObject({
      degraded: Type22.Boolean(),
      reasons: Type22.Array(
        Type22.Union([
          Type22.Literal("event_loop_delay"),
          Type22.Literal("event_loop_utilization"),
          Type22.Literal("cpu")
        ])
      ),
      intervalMs: Type22.Number({ minimum: 0 }),
      delayP99Ms: Type22.Number({ minimum: 0 }),
      delayMaxMs: Type22.Number({ minimum: 0 }),
      utilization: Type22.Number({ minimum: 0 }),
      cpuCoreRatio: Type22.Number({ minimum: 0 })
    })
  ),
  plugins: Type22.Optional(
    closedObject({
      loaded: Type22.Array(Type22.String()),
      errors: Type22.Array(
        closedObject({
          id: Type22.String(),
          origin: Type22.String(),
          activated: Type22.Boolean(),
          activationSource: Type22.Optional(Type22.String()),
          activationReason: Type22.Optional(Type22.String()),
          failurePhase: Type22.Optional(Type22.String()),
          error: Type22.String()
        })
      ),
      unavailable: Type22.Optional(
        Type22.Array(
          closedObject({
            id: Type22.String(),
            state: Type22.Literal("configured-unavailable"),
            diagnostic: closedObject({
              kind: Type22.Literal("plugin-verification"),
              reason: Type22.String(),
              detail: Type22.String()
            })
          })
        )
      )
    })
  ),
  contextEngines: Type22.Optional(
    closedObject({
      quarantined: Type22.Array(
        closedObject({
          engineId: Type22.String(),
          owner: Type22.Optional(Type22.String()),
          operation: Type22.String(),
          reason: Type22.String(),
          failedAt: Type22.Integer({ minimum: 0 })
        })
      )
    })
  ),
  deliveryQueues: Type22.Optional(
    closedObject({
      failed: Type22.Array(
        closedObject({
          queueName: Type22.String(),
          count: Type22.Integer({ minimum: 0 }),
          oldestFailedAt: Type22.Optional(Type22.Integer({ minimum: 0 }))
        })
      )
    })
  ),
  modelPricing: Type22.Optional(
    closedObject({
      state: Type22.Union([Type22.Literal("ok"), Type22.Literal("degraded"), Type22.Literal("disabled")]),
      sources: Type22.Array(
        closedObject({
          source: Type22.Union([
            Type22.Literal("openrouter"),
            Type22.Literal("litellm"),
            Type22.Literal("bootstrap"),
            Type22.Literal("refresh")
          ]),
          state: Type22.Union([Type22.Literal("ok"), Type22.Literal("degraded")]),
          lastFailureAt: Type22.Optional(Type22.Integer({ minimum: 0 })),
          detail: Type22.Optional(Type22.String())
        })
      ),
      lastFailureAt: Type22.Optional(Type22.Integer({ minimum: 0 })),
      detail: Type22.Optional(Type22.String())
    })
  ),
  configReload: Type22.Optional(
    closedObject({
      hotReloadStatus: Type22.Union([Type22.Literal("active"), Type22.Literal("disabled")])
    })
  ),
  // Channel plugins own their nested account/probe summaries, so this is the
  // one provider-contributed bag that deliberately remains unknown.
  channels: Type22.Optional(Type22.Record(Type22.String(), Type22.Unknown())),
  channelOrder: Type22.Optional(Type22.Array(Type22.String())),
  channelLabels: Type22.Optional(Type22.Record(Type22.String(), Type22.String())),
  heartbeatSeconds: Type22.Optional(Type22.Integer({ minimum: 0 })),
  defaultAgentId: Type22.Optional(Type22.String()),
  agents: Type22.Optional(
    Type22.Array(
      closedObject({
        agentId: Type22.String(),
        name: Type22.Optional(Type22.String()),
        isDefault: Type22.Boolean(),
        heartbeat: closedObject({
          enabled: Type22.Boolean(),
          every: Type22.String(),
          everyMs: Type22.Union([Type22.Integer({ minimum: 0 }), Type22.Null()]),
          prompt: Type22.String(),
          target: Type22.String(),
          model: Type22.Optional(Type22.String()),
          ackMaxChars: Type22.Integer({ minimum: 0 })
        }),
        sessions: HealthSessionSummarySchema
      })
    )
  ),
  sessions: Type22.Optional(HealthSessionSummarySchema)
});
var SessionDefaultsSchema = closedObject({
  defaultAgentId: NonEmptyString,
  mainKey: NonEmptyString,
  mainSessionKey: NonEmptyString,
  scope: Type22.Optional(NonEmptyString)
});
var StateVersionSchema = closedObject({
  presence: Type22.Integer({ minimum: 0 }),
  health: Type22.Integer({ minimum: 0 })
});
var SnapshotSchema = closedObject({
  presence: Type22.Array(PresenceEntrySchema),
  health: HealthSnapshotSchema,
  stateVersion: StateVersionSchema,
  uptimeMs: Type22.Integer({ minimum: 0 }),
  /** Resolved source-config revision accepted by the active Gateway runtime. */
  appliedConfigHash: Type22.Optional(Type22.Union([NonEmptyString, Type22.Null()])),
  configPath: Type22.Optional(NonEmptyString),
  stateDir: Type22.Optional(NonEmptyString),
  sessionDefaults: Type22.Optional(SessionDefaultsSchema),
  authMode: Type22.Optional(
    Type22.Union([
      Type22.Literal("none"),
      Type22.Literal("token"),
      Type22.Literal("password"),
      Type22.Literal("trusted-proxy")
    ])
  ),
  updateAvailable: Type22.Optional(
    Type22.Object({
      currentVersion: NonEmptyString,
      latestVersion: NonEmptyString,
      channel: NonEmptyString
    })
  )
});

// packages/gateway-protocol/src/schema/frames.ts
var GATEWAY_SERVER_CAPS = {
  BOARD_WIDGET_PUT_CANVAS_DOC: "board-widget-put-canvas-doc",
  CHAT_SEND_ROUTING_CONTRACT: "chat-send-routing-contract",
  SYSTEM_AGENT_SETUP_MODEL_REF: "openclaw-setup-model-ref"
};
var TickEventSchema = closedObject({
  ts: Type23.Integer({ minimum: 0 })
});
var ShutdownEventSchema = closedObject({
  reason: NonEmptyString,
  restartExpectedMs: Type23.Optional(Type23.Integer({ minimum: 0 }))
});
var ConnectParamsSchema = closedObject({
  minProtocol: Type23.Integer({ minimum: 1 }),
  maxProtocol: Type23.Integer({ minimum: 1 }),
  client: closedObject({
    id: GatewayClientIdSchema,
    displayName: Type23.Optional(NonEmptyString),
    version: NonEmptyString,
    platform: NonEmptyString,
    deviceFamily: Type23.Optional(NonEmptyString),
    modelIdentifier: Type23.Optional(NonEmptyString),
    mode: GatewayClientModeSchema,
    instanceId: Type23.Optional(NonEmptyString)
  }),
  caps: Type23.Optional(Type23.Array(NonEmptyString, { default: [] })),
  commands: Type23.Optional(Type23.Array(NonEmptyString)),
  permissions: Type23.Optional(Type23.Record(NonEmptyString, Type23.Boolean())),
  pathEnv: Type23.Optional(Type23.String()),
  role: Type23.Optional(NonEmptyString),
  scopes: Type23.Optional(Type23.Array(NonEmptyString)),
  device: Type23.Optional(
    closedObject({
      id: NonEmptyString,
      publicKey: NonEmptyString,
      signature: NonEmptyString,
      signedAt: Type23.Integer({ minimum: 0 }),
      nonce: NonEmptyString
    })
  ),
  auth: Type23.Optional(
    closedObject({
      token: Type23.Optional(Type23.String()),
      bootstrapToken: Type23.Optional(Type23.String()),
      deviceToken: Type23.Optional(Type23.String()),
      password: Type23.Optional(Type23.String()),
      approvalRuntimeToken: Type23.Optional(Type23.String()),
      agentRuntimeIdentityToken: Type23.Optional(Type23.String())
    })
  ),
  locale: Type23.Optional(Type23.String()),
  userAgent: Type23.Optional(Type23.String())
});
var HelloOkSchema = closedObject({
  type: Type23.Literal("hello-ok"),
  protocol: Type23.Integer({ minimum: 1 }),
  server: closedObject({
    version: NonEmptyString,
    connId: NonEmptyString
  }),
  features: closedObject({
    methods: Type23.Array(NonEmptyString),
    events: Type23.Array(NonEmptyString),
    capabilities: Type23.Optional(Type23.Array(NonEmptyString))
  }),
  snapshot: SnapshotSchema,
  // Additive: plugin-declared Control UI tabs (surface "tab" descriptors).
  controlUiTabs: Type23.Optional(
    Type23.Array(
      closedObject({
        pluginId: NonEmptyString,
        id: NonEmptyString,
        label: NonEmptyString,
        description: Type23.Optional(Type23.String()),
        icon: Type23.Optional(Type23.String()),
        path: Type23.Optional(Type23.String()),
        requiresGatewayAuth: Type23.Optional(Type23.Boolean()),
        group: Type23.Optional(Type23.Union([Type23.Literal("control"), Type23.Literal("agent")])),
        order: Type23.Optional(Type23.Number())
      })
    )
  ),
  pluginSurfaceUrls: Type23.Optional(Type23.Record(NonEmptyString, NonEmptyString)),
  auth: closedObject({
    deviceToken: Type23.Optional(NonEmptyString),
    role: NonEmptyString,
    scopes: Type23.Array(NonEmptyString),
    issuedAtMs: Type23.Optional(Type23.Integer({ minimum: 0 })),
    deviceTokens: Type23.Optional(
      Type23.Array(
        closedObject({
          deviceToken: NonEmptyString,
          role: NonEmptyString,
          scopes: Type23.Array(NonEmptyString),
          issuedAtMs: Type23.Integer({ minimum: 0 })
        })
      )
    )
  }),
  policy: closedObject({
    maxPayload: Type23.Integer({ minimum: 1 }),
    maxBufferedBytes: Type23.Integer({ minimum: 1 }),
    tickIntervalMs: Type23.Integer({ minimum: 1 })
  })
});
var ErrorShapeSchema = closedObject({
  code: NonEmptyString,
  message: NonEmptyString,
  details: Type23.Optional(Type23.Unknown()),
  retryable: Type23.Optional(Type23.Boolean()),
  retryAfterMs: Type23.Optional(Type23.Integer({ minimum: 0 }))
});
var RequestFrameSchema = closedObject({
  type: Type23.Literal("req"),
  id: NonEmptyString,
  method: NonEmptyString,
  params: Type23.Optional(Type23.Unknown())
});
var ResponseFrameSchema = closedObject({
  type: Type23.Literal("res"),
  id: NonEmptyString,
  ok: Type23.Boolean(),
  payload: Type23.Optional(Type23.Unknown()),
  error: Type23.Optional(ErrorShapeSchema)
});
var EventFrameSchema = closedObject({
  type: Type23.Literal("event"),
  event: NonEmptyString,
  payload: Type23.Optional(Type23.Unknown()),
  seq: Type23.Optional(Type23.Integer({ minimum: 0 })),
  stateVersion: Type23.Optional(StateVersionSchema)
});
var GatewayFrameSchema = Type23.Union(
  [RequestFrameSchema, ResponseFrameSchema, EventFrameSchema],
  { discriminator: "type" }
);

// packages/gateway-protocol/src/schema/fs.ts
import { Type as Type24 } from "typebox";
var FsListDirParamsSchema = closedObject({
  /** Absolute directory to list; omitted means the selected host's home directory. */
  path: Type24.Optional(NonEmptyString),
  /** Connected node host to browse; omitted means the Gateway host. */
  nodeId: Type24.Optional(NonEmptyString)
});
var FsDirEntrySchema = closedObject({
  name: NonEmptyString,
  path: NonEmptyString,
  /** Dot-prefixed directories; clients render them dimmed after visible ones. */
  hidden: Type24.Optional(Type24.Boolean())
});
var FsListDirResultSchema = closedObject({
  /** Resolved absolute path that was listed. */
  path: NonEmptyString,
  /** Absent at the filesystem root. */
  parent: Type24.Optional(NonEmptyString),
  /** Selected host's home directory, for the picker's "home" shortcut. */
  home: NonEmptyString,
  entries: Type24.Array(FsDirEntrySchema)
});

// packages/gateway-protocol/src/schema/gateway-suspend.ts
import { Type as Type25 } from "typebox";
var SuspensionTokenSchema = Type25.String({ minLength: 1, maxLength: 128, pattern: "\\S" });
var CountSchema = Type25.Integer({ minimum: 0 });
var GatewaySuspendTaskBlockerSchema = closedObject({
  taskId: Type25.String(),
  status: Type25.Literal("running"),
  runtime: Type25.Union([
    Type25.Literal("subagent"),
    Type25.Literal("acp"),
    Type25.Literal("cli"),
    Type25.Literal("cron")
  ]),
  runId: Type25.Optional(Type25.String()),
  label: Type25.Optional(Type25.String()),
  title: Type25.Optional(Type25.String())
});
var GatewaySuspendBlockerSchema = closedObject({
  kind: Type25.Union([
    Type25.Literal("queue"),
    Type25.Literal("reply"),
    Type25.Literal("embedded-run"),
    Type25.Literal("background-exec"),
    Type25.Literal("cron-run"),
    Type25.Literal("task"),
    Type25.Literal("root-request"),
    Type25.Literal("session-admission"),
    Type25.Literal("session-mutation"),
    Type25.Literal("chat-run"),
    Type25.Literal("queued-turn"),
    Type25.Literal("terminal-persistence"),
    Type25.Literal("terminal-session")
  ]),
  count: CountSchema,
  message: Type25.String(),
  task: Type25.Optional(GatewaySuspendTaskBlockerSchema)
});
var GatewaySuspendPrepareParamsSchema = closedObject({ requestId: SuspensionTokenSchema });
var GatewaySuspendPrepareBusyResultSchema = closedObject({
  status: Type25.Literal("busy"),
  reason: Type25.Union([Type25.Literal("active-work"), Type25.Literal("gateway-draining")]),
  retryAfterMs: CountSchema,
  activeCount: CountSchema,
  blockers: Type25.Array(GatewaySuspendBlockerSchema)
});
var GatewaySuspendPrepareReadyResultSchema = closedObject({
  status: Type25.Literal("ready"),
  suspensionId: SuspensionTokenSchema,
  expiresAtMs: CountSchema,
  activeCount: CountSchema,
  blockers: Type25.Array(GatewaySuspendBlockerSchema)
});
var GatewaySuspendPrepareResultSchema = Type25.Union([
  GatewaySuspendPrepareBusyResultSchema,
  GatewaySuspendPrepareReadyResultSchema
]);
var GatewaySuspendStatusParamsSchema = closedObject({
  suspensionId: SuspensionTokenSchema
});
var GatewaySuspendStatusRunningResultSchema = closedObject({
  status: Type25.Literal("running")
});
var GatewaySuspendStatusReadyResultSchema = closedObject({
  status: Type25.Literal("ready"),
  expiresAtMs: CountSchema
});
var GatewaySuspendStatusResultSchema = Type25.Union([
  GatewaySuspendStatusRunningResultSchema,
  GatewaySuspendStatusReadyResultSchema
]);
var GatewaySuspendResumeParamsSchema = GatewaySuspendStatusParamsSchema;
var GatewaySuspendResumeResultSchema = closedObject({
  ok: Type25.Literal(true),
  status: Type25.Literal("running"),
  resumed: Type25.Boolean()
});

// packages/gateway-protocol/src/schema/logs-chat.ts
import { Type as Type26 } from "typebox";
var LogsTailParamsSchema = closedObject({
  cursor: Type26.Optional(Type26.Integer({ minimum: 0 })),
  limit: Type26.Optional(Type26.Integer({ minimum: 1, maximum: 5e3 })),
  maxBytes: Type26.Optional(Type26.Integer({ minimum: 1, maximum: 1e6 }))
});
var LogsTailResultSchema = closedObject({
  file: NonEmptyString,
  cursor: Type26.Integer({ minimum: 0 }),
  size: Type26.Integer({ minimum: 0 }),
  lines: Type26.Array(Type26.String()),
  truncated: Type26.Optional(Type26.Boolean()),
  reset: Type26.Optional(Type26.Boolean())
});
var ChatHistoryParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type26.Optional(NonEmptyString),
  limit: Type26.Optional(Type26.Integer({ minimum: 1, maximum: 1e3 })),
  offset: Type26.Optional(Type26.Integer({ minimum: 0 })),
  messageId: Type26.Optional(NonEmptyString),
  sessionId: Type26.Optional(NonEmptyString),
  maxChars: Type26.Optional(Type26.Integer({ minimum: 1, maximum: 5e5 }))
});
var ChatMetadataParamsSchema = closedObject({
  agentId: Type26.Optional(NonEmptyString)
});
var ChatToolTitlesParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type26.Optional(NonEmptyString),
  items: Type26.Array(
    closedObject({
      id: Type26.String({ minLength: 1, maxLength: 64 }),
      name: Type26.String({ minLength: 1, maxLength: 200 }),
      input: Type26.String({ minLength: 1, maxLength: 4e3 })
    }),
    { minItems: 1, maxItems: 24 }
  )
});
var ChatToolTitlesResultSchema = closedObject({
  titles: Type26.Record(Type26.String(), Type26.String()),
  disabled: Type26.Optional(Type26.Boolean())
});
var ChatMessageGetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type26.Optional(NonEmptyString),
  messageId: NonEmptyString,
  maxChars: Type26.Optional(Type26.Integer({ minimum: 1, maximum: 2e6 }))
});
var ChatMessageGetResultSchema = closedObject({
  ok: Type26.Boolean(),
  message: Type26.Optional(Type26.Unknown()),
  unavailableReason: Type26.Optional(
    Type26.Union([Type26.Literal("not_found"), Type26.Literal("oversized"), Type26.Literal("not_visible")])
  )
});
var ChatAttachmentsSchema = Type26.Array(Type26.Unknown());
var RunToolBindingsSchema = Type26.Record(
  Type26.String({ minLength: 1, maxLength: 128 }),
  Type26.Unknown(),
  { maxProperties: 16 }
);
var ChatSendParamsSchema = closedObject({
  sessionKey: ChatSendSessionKeyString,
  agentId: Type26.Optional(NonEmptyString),
  sessionId: Type26.Optional(NonEmptyString),
  message: Type26.String(),
  thinking: Type26.Optional(Type26.String()),
  fastMode: Type26.Optional(Type26.Union([Type26.Boolean(), Type26.Literal("auto")])),
  // One-turn override for auto fast-mode cutoff seconds.
  fastAutoOnSeconds: Type26.Optional(Type26.Integer({ minimum: 1 })),
  // One-turn override for active-run queue admission.
  queueMode: Type26.Optional(Type26.String({ enum: ["steer", "followup", "collect", "interrupt"] })),
  deliver: Type26.Optional(Type26.Boolean()),
  originatingChannel: Type26.Optional(Type26.String()),
  originatingTo: Type26.Optional(Type26.String()),
  originatingAccountId: Type26.Optional(Type26.String()),
  originatingThreadId: Type26.Optional(Type26.String()),
  // Transcript id of the message this send replies to; the Gateway hydrates
  // channel-agnostic reply context metadata from session history.
  replyToId: Type26.Optional(NonEmptyString),
  attachments: Type26.Optional(ChatAttachmentsSchema),
  toolBindings: Type26.Optional(RunToolBindingsSchema),
  timeoutMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  systemInputProvenance: Type26.Optional(InputProvenanceSchema),
  systemProvenanceReceipt: Type26.Optional(Type26.String()),
  suppressCommandInterpretation: Type26.Optional(Type26.Boolean()),
  expectedSessionRoutingContract: Type26.Optional(NonEmptyString),
  idempotencyKey: NonEmptyString
});
var ChatAbortParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type26.Optional(NonEmptyString),
  runId: Type26.Optional(NonEmptyString),
  preserveSideRuns: Type26.Optional(Type26.Boolean())
});
var ChatInjectParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type26.Optional(NonEmptyString),
  message: NonEmptyString,
  label: Type26.Optional(Type26.String({ maxLength: 100 }))
});
var ChatEventBaseSchema = {
  runId: NonEmptyString,
  sessionKey: NonEmptyString,
  agentId: Type26.Optional(NonEmptyString),
  spawnedBy: Type26.Optional(NonEmptyString),
  seq: Type26.Integer({ minimum: 0 })
};
var ChatEventErrorKindSchema = Type26.Union([
  Type26.Literal("refusal"),
  Type26.Literal("timeout"),
  Type26.Literal("rate_limit"),
  Type26.Literal("context_length"),
  Type26.Literal("unknown")
]);
var ChatDeltaEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type26.Literal("delta"),
  message: Type26.Optional(Type26.Unknown()),
  deltaText: Type26.String(),
  replace: Type26.Optional(Type26.Boolean()),
  usage: Type26.Optional(Type26.Unknown())
});
var ChatFinalEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type26.Literal("final"),
  message: Type26.Optional(Type26.Unknown()),
  usage: Type26.Optional(Type26.Unknown()),
  stopReason: Type26.Optional(Type26.String()),
  yielded: Type26.Optional(Type26.Literal(true))
});
var ChatAbortedEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type26.Literal("aborted"),
  message: Type26.Optional(Type26.Unknown()),
  errorMessage: Type26.Optional(Type26.String()),
  stopReason: Type26.Optional(Type26.String())
});
var ChatErrorEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type26.Literal("error"),
  message: Type26.Optional(Type26.Unknown()),
  errorMessage: Type26.Optional(Type26.String()),
  errorKind: Type26.Optional(ChatEventErrorKindSchema),
  usage: Type26.Optional(Type26.Unknown()),
  stopReason: Type26.Optional(Type26.String())
});
var ChatEventSchema = Type26.Union([
  ChatDeltaEventSchema,
  ChatFinalEventSchema,
  ChatAbortedEventSchema,
  ChatErrorEventSchema
]);

// packages/gateway-protocol/src/schema/migrations.ts
import { Type as Type27 } from "typebox";
var MAX_MEMORY_MIGRATION_ITEMS = 2e3;
var MemoryMigrationPlanFingerprintSchema = Type27.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var MemoryMigrationItemStatusSchema = Type27.Union([
  Type27.Literal("planned"),
  Type27.Literal("migrated"),
  Type27.Literal("skipped"),
  Type27.Literal("warning"),
  Type27.Literal("conflict"),
  Type27.Literal("error")
]);
var MemoryMigrationItemSchema = Type27.Object(
  {
    id: NonEmptyString,
    status: MemoryMigrationItemStatusSchema,
    source: Type27.Optional(NonEmptyString),
    target: Type27.Optional(NonEmptyString),
    message: Type27.Optional(Type27.String()),
    reason: Type27.Optional(Type27.String()),
    details: Type27.Optional(Type27.Record(Type27.String(), Type27.Unknown()))
  },
  { additionalProperties: false }
);
var MemoryMigrationSummarySchema = Type27.Object(
  {
    total: Type27.Integer({ minimum: 0 }),
    planned: Type27.Integer({ minimum: 0 }),
    migrated: Type27.Integer({ minimum: 0 }),
    skipped: Type27.Integer({ minimum: 0 }),
    conflicts: Type27.Integer({ minimum: 0 }),
    errors: Type27.Integer({ minimum: 0 }),
    sensitive: Type27.Integer({ minimum: 0 })
  },
  { additionalProperties: false }
);
var MemoryMigrationProviderPlanSchema = Type27.Object(
  {
    providerId: NonEmptyString,
    label: NonEmptyString,
    description: Type27.Optional(Type27.String()),
    planFingerprint: Type27.Optional(MemoryMigrationPlanFingerprintSchema),
    found: Type27.Boolean(),
    source: Type27.Optional(NonEmptyString),
    target: Type27.Optional(NonEmptyString),
    confidence: Type27.Optional(
      Type27.Union([Type27.Literal("low"), Type27.Literal("medium"), Type27.Literal("high")])
    ),
    message: Type27.Optional(Type27.String()),
    error: Type27.Optional(Type27.String()),
    summary: MemoryMigrationSummarySchema,
    items: Type27.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
    warnings: Type27.Optional(Type27.Array(Type27.String()))
  },
  { additionalProperties: false }
);
var MigrationsMemoryPlanParamsSchema = Type27.Object(
  {
    agentId: NonEmptyString,
    overwrite: Type27.Optional(Type27.Boolean())
  },
  { additionalProperties: false }
);
var MigrationsMemoryPlanResultSchema = Type27.Object(
  {
    agentId: NonEmptyString,
    workspace: NonEmptyString,
    providers: Type27.Array(MemoryMigrationProviderPlanSchema)
  },
  { additionalProperties: false }
);
var MigrationsMemoryApplyParamsSchema = Type27.Object(
  {
    idempotencyKey: NonEmptyString,
    agentId: NonEmptyString,
    providerId: NonEmptyString,
    planFingerprint: MemoryMigrationPlanFingerprintSchema,
    itemIds: Type27.Array(NonEmptyString, {
      minItems: 1,
      uniqueItems: true,
      maxItems: MAX_MEMORY_MIGRATION_ITEMS
    }),
    overwrite: Type27.Optional(Type27.Boolean())
  },
  { additionalProperties: false }
);
var MigrationsMemoryApplyResultSchema = Type27.Object(
  {
    providerId: NonEmptyString,
    source: NonEmptyString,
    target: Type27.Optional(NonEmptyString),
    summary: MemoryMigrationSummarySchema,
    items: Type27.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
    warnings: Type27.Optional(Type27.Array(Type27.String())),
    backupPath: Type27.Optional(NonEmptyString),
    reportDir: Type27.Optional(NonEmptyString)
  },
  { additionalProperties: false }
);
var MigrationProtocolSchemas = {
  MemoryMigrationItemStatus: MemoryMigrationItemStatusSchema,
  MemoryMigrationItem: MemoryMigrationItemSchema,
  MemoryMigrationSummary: MemoryMigrationSummarySchema,
  MemoryMigrationProviderPlan: MemoryMigrationProviderPlanSchema,
  MigrationsMemoryPlanParams: MigrationsMemoryPlanParamsSchema,
  MigrationsMemoryPlanResult: MigrationsMemoryPlanResultSchema,
  MigrationsMemoryApplyParams: MigrationsMemoryApplyParamsSchema,
  MigrationsMemoryApplyResult: MigrationsMemoryApplyResultSchema
};

// packages/gateway-protocol/src/schema/nodes.ts
import { Type as Type28 } from "typebox";
var NodePluginToolNameSchema = Type28.String({
  minLength: 1,
  maxLength: 64,
  pattern: "^[A-Za-z][A-Za-z0-9_-]{0,63}$"
});
var NodeSkillNameSchema = Type28.String({
  minLength: 1,
  maxLength: 64,
  pattern: "^(?!.*--)[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$"
});
var NodePendingWorkTypeSchema = Type28.String({
  enum: ["status.request", "location.request"]
});
var NodePendingWorkPrioritySchema = Type28.String({
  enum: ["normal", "high"]
});
var NodePresenceAliveReasonSchema = Type28.String({
  enum: [
    "background",
    "silent_push",
    "bg_app_refresh",
    "significant_location",
    "manual",
    "connect"
  ]
});
var NodePresenceAlivePayloadSchema = closedObject({
  trigger: NodePresenceAliveReasonSchema,
  sentAtMs: Type28.Optional(Type28.Integer({ minimum: 0 })),
  displayName: Type28.Optional(NonEmptyString),
  version: Type28.Optional(NonEmptyString),
  platform: Type28.Optional(NonEmptyString),
  deviceFamily: Type28.Optional(NonEmptyString),
  modelIdentifier: Type28.Optional(NonEmptyString),
  pushTransport: Type28.Optional(NonEmptyString)
});
var NodePresenceActivityPayloadSchema = closedObject({
  idleSeconds: Type28.Integer({ minimum: 0, maximum: 2592e3 }),
  saturated: Type28.Optional(Type28.Boolean())
});
var NodeEventResultSchema = closedObject({
  ok: Type28.Boolean(),
  event: NonEmptyString,
  handled: Type28.Boolean(),
  reason: Type28.Optional(NonEmptyString)
});
var NodePairListParamsSchema = closedObject({});
var NodePairApproveParamsSchema = closedObject({ requestId: NonEmptyString });
var NodePairRejectParamsSchema = closedObject({ requestId: NonEmptyString });
var NodePairRemoveParamsSchema = closedObject({ nodeId: NonEmptyString });
var NodeRenameParamsSchema = closedObject({
  nodeId: NonEmptyString,
  displayName: NonEmptyString
});
var NodeListParamsSchema = closedObject({});
var NodePluginToolDescriptorSchema = closedObject({
  pluginId: NonEmptyString,
  name: NodePluginToolNameSchema,
  description: NonEmptyString,
  parameters: Type28.Optional(Type28.Record(Type28.String(), Type28.Unknown())),
  command: Type28.Optional(NonEmptyString),
  mcp: Type28.Optional(
    closedObject({
      server: NonEmptyString,
      tool: NonEmptyString
    })
  )
});
var NodePluginToolsUpdateParamsSchema = closedObject({
  tools: Type28.Array(NodePluginToolDescriptorSchema)
});
var NodeSkillDescriptorSchema = closedObject({
  name: NodeSkillNameSchema,
  description: Type28.String({ minLength: 1, maxLength: 1024 }),
  content: Type28.String({ minLength: 1, maxLength: 64 * 1024 })
});
var NodeSkillsUpdateParamsSchema = closedObject({
  skills: Type28.Array(NodeSkillDescriptorSchema, { maxItems: 64 })
});
var NodePendingAckParamsSchema = closedObject({
  ids: Type28.Array(NonEmptyString, { minItems: 1 })
});
var NodeDescribeParamsSchema = closedObject({ nodeId: NonEmptyString });
var NodeInvokeParamsSchema = closedObject({
  nodeId: NonEmptyString,
  command: NonEmptyString,
  params: Type28.Optional(Type28.Unknown()),
  timeoutMs: Type28.Optional(Type28.Integer({ minimum: 0 })),
  idempotencyKey: NonEmptyString,
  // Gateway-only agent ownership metadata. Forwarded beside params, never inside them.
  sessionKey: Type28.Optional(NonEmptyString),
  // Gateway-only approval routing metadata. Node forwarding strips these fields.
  turnSourceChannel: Type28.Optional(Type28.String()),
  turnSourceTo: Type28.Optional(Type28.String()),
  turnSourceAccountId: Type28.Optional(Type28.String()),
  turnSourceThreadId: Type28.Optional(Type28.Union([Type28.String(), Type28.Number()]))
});
var NodeInvokeResultParamsSchema = closedObject({
  id: NonEmptyString,
  nodeId: NonEmptyString,
  ok: Type28.Boolean(),
  payload: Type28.Optional(Type28.Unknown()),
  payloadJSON: Type28.Optional(Type28.String()),
  error: Type28.Optional(
    closedObject({
      code: Type28.Optional(NonEmptyString),
      message: Type28.Optional(NonEmptyString)
    })
  )
});
var NodeInvokeProgressParamsSchema = closedObject({
  invokeId: NonEmptyString,
  nodeId: NonEmptyString,
  seq: Type28.Integer({ minimum: 0 }),
  // Empty chunks are liveness heartbeats for captured stderr or capped stdout.
  chunk: Type28.String({ maxLength: 16 * 1024 })
});
var NodeEventParamsSchema = closedObject({
  event: NonEmptyString,
  payload: Type28.Optional(Type28.Unknown()),
  payloadJSON: Type28.Optional(Type28.String())
});
var NodePendingDrainParamsSchema = closedObject({
  maxItems: Type28.Optional(Type28.Integer({ minimum: 1, maximum: 10 }))
});
var NodePendingDrainItemSchema = closedObject({
  id: NonEmptyString,
  type: NodePendingWorkTypeSchema,
  priority: Type28.String({ enum: ["default", "normal", "high"] }),
  createdAtMs: Type28.Integer({ minimum: 0 }),
  expiresAtMs: Type28.Optional(Type28.Union([Type28.Integer({ minimum: 0 }), Type28.Null()])),
  payload: Type28.Optional(Type28.Record(Type28.String(), Type28.Unknown()))
});
var NodePendingDrainResultSchema = closedObject({
  nodeId: NonEmptyString,
  revision: Type28.Integer({ minimum: 0 }),
  items: Type28.Array(NodePendingDrainItemSchema),
  hasMore: Type28.Boolean()
});
var NodePendingEnqueueParamsSchema = closedObject({
  nodeId: NonEmptyString,
  type: NodePendingWorkTypeSchema,
  priority: Type28.Optional(NodePendingWorkPrioritySchema),
  expiresInMs: Type28.Optional(Type28.Integer({ minimum: 1e3, maximum: 864e5 })),
  wake: Type28.Optional(Type28.Boolean())
});
var NodePendingEnqueueResultSchema = closedObject({
  nodeId: NonEmptyString,
  revision: Type28.Integer({ minimum: 0 }),
  queued: NodePendingDrainItemSchema,
  wakeTriggered: Type28.Boolean()
});
var NodeInvokeRequestEventSchema = closedObject({
  id: NonEmptyString,
  nodeId: NonEmptyString,
  command: NonEmptyString,
  paramsJSON: Type28.Optional(Type28.String()),
  timeoutMs: Type28.Optional(Type28.Integer({ minimum: 0 })),
  idempotencyKey: Type28.Optional(NonEmptyString)
});
var NodeInvokeInputEventSchema = closedObject({
  id: NonEmptyString,
  nodeId: NonEmptyString,
  seq: Type28.Integer({ minimum: 0 }),
  payloadJSON: Type28.String({ maxLength: 16 * 1024 })
});

// packages/gateway-protocol/src/schema/log-migration-protocol-schemas.ts
var LogMigrationProtocolSchemas = {
  LogsTailParams: LogsTailParamsSchema,
  LogsTailResult: LogsTailResultSchema,
  ...MigrationProtocolSchemas
};

// packages/gateway-protocol/src/schema/plugin-approvals.ts
import { Type as Type29 } from "typebox";
var MAX_PLUGIN_APPROVAL_TIMEOUT_MS = 6e5;
var PLUGIN_APPROVAL_TITLE_MAX_LENGTH = 80;
var PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH = 512;
var PluginApprovalRequestParamsSchema = closedObject({
  pluginId: Type29.Optional(NonEmptyString),
  title: Type29.String({ minLength: 1, maxLength: PLUGIN_APPROVAL_TITLE_MAX_LENGTH }),
  description: Type29.String({ minLength: 1, maxLength: PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH }),
  severity: Type29.Optional(Type29.String({ enum: ["info", "warning", "critical"] })),
  toolName: Type29.Optional(Type29.String()),
  toolCallId: Type29.Optional(Type29.String()),
  allowedDecisions: Type29.Optional(
    Type29.Array(Type29.String({ enum: ["allow-once", "allow-always", "deny"] }), {
      minItems: 1,
      maxItems: 3
    })
  ),
  agentId: Type29.Optional(Type29.String()),
  sessionKey: Type29.Optional(Type29.String()),
  approvalReviewerDeviceIds: Type29.Optional(
    Type29.Array(NonEmptyString, {
      description: "Trusted approval-runtime metadata naming operator devices that may review this approval; ordinary Gateway clients may send the field, but the Gateway only binds it for internal approval-runtime requests."
    })
  ),
  turnSourceChannel: Type29.Optional(Type29.String()),
  turnSourceTo: Type29.Optional(Type29.String()),
  turnSourceAccountId: Type29.Optional(Type29.String()),
  turnSourceThreadId: Type29.Optional(Type29.Union([Type29.String(), Type29.Number()])),
  timeoutMs: Type29.Optional(Type29.Integer({ minimum: 1, maximum: MAX_PLUGIN_APPROVAL_TIMEOUT_MS })),
  twoPhase: Type29.Optional(Type29.Boolean())
});
var PluginApprovalResolveParamsSchema = closedObject({
  id: NonEmptyString,
  decision: NonEmptyString
});

// packages/gateway-protocol/src/schema/plugins.ts
import { Type as Type30 } from "typebox";
var PluginJsonValueSchema = Type30.Unknown();
var PluginControlUiDescriptorSchema = closedObject({
  id: NonEmptyString,
  pluginId: NonEmptyString,
  pluginName: Type30.Optional(NonEmptyString),
  surface: Type30.Union([
    Type30.Literal("session"),
    Type30.Literal("tool"),
    Type30.Literal("run"),
    Type30.Literal("settings")
  ]),
  label: NonEmptyString,
  description: Type30.Optional(Type30.String()),
  placement: Type30.Optional(Type30.String()),
  schema: Type30.Optional(PluginJsonValueSchema),
  requiredScopes: Type30.Optional(Type30.Array(NonEmptyString))
});
var PluginsUiDescriptorsParamsSchema = closedObject({});
var PluginsUiDescriptorsResultSchema = closedObject({
  ok: Type30.Literal(true),
  descriptors: Type30.Array(PluginControlUiDescriptorSchema)
});
var PluginsSessionActionParamsSchema = closedObject({
  pluginId: NonEmptyString,
  actionId: NonEmptyString,
  sessionKey: Type30.Optional(NonEmptyString),
  payload: Type30.Optional(PluginJsonValueSchema)
});
var PluginsSessionActionSuccessResultSchema = closedObject({
  ok: Type30.Literal(true),
  result: Type30.Optional(PluginJsonValueSchema),
  continueAgent: Type30.Optional(Type30.Boolean()),
  reply: Type30.Optional(PluginJsonValueSchema)
});
var PluginsSessionActionFailureResultSchema = closedObject({
  ok: Type30.Literal(false),
  error: Type30.String(),
  code: Type30.Optional(Type30.String()),
  details: Type30.Optional(PluginJsonValueSchema)
});
var PluginsSessionActionResultSchema = Type30.Union([
  PluginsSessionActionSuccessResultSchema,
  PluginsSessionActionFailureResultSchema
]);
var PluginCatalogClawHubInstallSchema = closedObject({
  source: Type30.Literal("clawhub"),
  packageName: NonEmptyString
});
var PluginCatalogOfficialInstallSchema = closedObject({
  source: Type30.Literal("official"),
  pluginId: NonEmptyString
});
var PluginCatalogInstallActionSchema = Type30.Union([
  PluginCatalogClawHubInstallSchema,
  PluginCatalogOfficialInstallSchema
]);
var PluginCatalogEntrySchema = closedObject({
  id: NonEmptyString,
  name: NonEmptyString,
  packageName: Type30.Optional(NonEmptyString),
  description: Type30.Optional(Type30.String()),
  version: Type30.Optional(NonEmptyString),
  kind: Type30.Optional(Type30.Array(NonEmptyString)),
  origin: Type30.Optional(NonEmptyString),
  installed: Type30.Boolean(),
  enabled: Type30.Boolean(),
  state: Type30.Union([
    Type30.Literal("enabled"),
    Type30.Literal("disabled"),
    Type30.Literal("not-installed"),
    Type30.Literal("error")
  ]),
  featured: Type30.Optional(Type30.Boolean()),
  featuredAt: Type30.Optional(Type30.Integer({ minimum: 0 })),
  order: Type30.Optional(Type30.Number()),
  /** True when the gateway can resolve a manifest or catalog icon for this plugin identity. */
  hasIcon: Type30.Optional(Type30.Boolean()),
  install: Type30.Optional(PluginCatalogInstallActionSchema),
  error: Type30.Optional(Type30.String()),
  /** Coarse manifest-derived grouping (channel, provider, memory, ...) for catalog UIs. */
  category: Type30.Optional(NonEmptyString),
  /** True when the plugin has an install record and can be removed via plugins.uninstall. */
  removable: Type30.Optional(Type30.Boolean())
});
var PluginsListParamsSchema = closedObject({});
var PluginsListResultSchema = closedObject({
  plugins: Type30.Array(PluginCatalogEntrySchema),
  diagnostics: Type30.Array(Type30.Unknown()),
  mutationAllowed: Type30.Boolean()
});
var PluginsSearchParamsSchema = closedObject({
  query: NonEmptyString,
  limit: Type30.Optional(Type30.Integer({ minimum: 1, maximum: 100 }))
});
var PluginSearchPackageSchema = closedObject({
  name: NonEmptyString,
  displayName: NonEmptyString,
  family: Type30.Union([Type30.Literal("code-plugin"), Type30.Literal("bundle-plugin")]),
  channel: Type30.Union([
    Type30.Literal("official"),
    Type30.Literal("community"),
    Type30.Literal("private")
  ]),
  isOfficial: Type30.Boolean(),
  summary: Type30.Optional(Type30.String()),
  latestVersion: Type30.Optional(NonEmptyString),
  runtimeId: Type30.Optional(NonEmptyString),
  downloads: Type30.Optional(Type30.Number({ minimum: 0 })),
  verificationTier: Type30.Optional(NonEmptyString)
});
var PluginSearchResultEntrySchema = closedObject({
  score: Type30.Number(),
  package: PluginSearchPackageSchema
});
var PluginsSearchResultSchema = closedObject({
  results: Type30.Array(PluginSearchResultEntrySchema)
});
var PluginsInstallParamsSchema = Type30.Union([
  closedObject({
    source: Type30.Literal("clawhub"),
    packageName: NonEmptyString,
    version: Type30.Optional(NonEmptyString),
    acknowledgeClawHubRisk: Type30.Optional(Type30.Boolean())
  }),
  closedObject({
    source: Type30.Literal("official"),
    pluginId: NonEmptyString
  })
]);
var PluginsInstallResultSchema = closedObject({
  ok: Type30.Literal(true),
  plugin: PluginCatalogEntrySchema,
  restartRequired: Type30.Literal(true),
  warnings: Type30.Optional(Type30.Array(Type30.String()))
});
var PluginsRefreshParamsSchema = closedObject({});
var PluginsRefreshResultSchema = closedObject({
  ok: Type30.Literal(true)
});
var PluginsUninstallParamsSchema = closedObject({
  pluginId: NonEmptyString
});
var PluginsUninstallResultSchema = closedObject({
  ok: Type30.Literal(true),
  pluginId: NonEmptyString,
  restartRequired: Type30.Literal(true),
  removed: Type30.Array(Type30.String()),
  warnings: Type30.Optional(Type30.Array(Type30.String()))
});
var PluginsSetEnabledParamsSchema = closedObject({
  pluginId: NonEmptyString,
  enabled: Type30.Boolean()
});
var PluginsSetEnabledResultSchema = closedObject({
  ok: Type30.Literal(true),
  plugin: PluginCatalogEntrySchema,
  restartRequired: Type30.Boolean(),
  warnings: Type30.Optional(Type30.Array(Type30.String()))
});

// packages/gateway-protocol/src/schema/protocol-schemas-node-invoke.ts
var NodeInvokeProtocolSchemas = {
  NodeInvokeParams: NodeInvokeParamsSchema,
  NodeInvokeInputEvent: NodeInvokeInputEventSchema,
  NodeInvokeProgressParams: NodeInvokeProgressParamsSchema,
  NodeInvokeResultParams: NodeInvokeResultParamsSchema,
  NodeInvokeRequestEvent: NodeInvokeRequestEventSchema
};

// packages/gateway-protocol/src/schema/protocol-schemas-node-presence.ts
var NodePresenceProtocolSchemas = {
  NodePresenceAliveReason: NodePresenceAliveReasonSchema,
  NodePresenceActivityPayload: NodePresenceActivityPayloadSchema
};

// packages/gateway-protocol/src/schema/push.ts
import { Type as Type31 } from "typebox";
var ApnsEnvironmentSchema = Type31.String({ enum: ["sandbox", "production"] });
var PushTestParamsSchema = closedObject({
  nodeId: NonEmptyString,
  title: Type31.Optional(Type31.String()),
  body: Type31.Optional(Type31.String()),
  environment: Type31.Optional(ApnsEnvironmentSchema)
});
var PushTestResultSchema = closedObject({
  ok: Type31.Boolean(),
  status: Type31.Integer(),
  apnsId: Type31.Optional(Type31.String()),
  reason: Type31.Optional(Type31.String()),
  tokenSuffix: Type31.String(),
  topic: Type31.String(),
  environment: ApnsEnvironmentSchema,
  transport: Type31.String({ enum: ["direct", "relay"] })
});
var WebPushKeysSchema = closedObject({
  p256dh: Type31.String({ minLength: 1, maxLength: 512 }),
  auth: Type31.String({ minLength: 1, maxLength: 512 })
});
var WebPushVapidPublicKeyParamsSchema = closedObject({});
var WebPushSubscribeParamsSchema = closedObject({
  endpoint: Type31.String({ minLength: 1, maxLength: 2048, pattern: "^https://" }),
  keys: WebPushKeysSchema
});
var WebPushUnsubscribeParamsSchema = closedObject({
  endpoint: Type31.String({ minLength: 1, maxLength: 2048, pattern: "^https://" })
});
var WebPushTestParamsSchema = closedObject({
  title: Type31.Optional(Type31.String()),
  body: Type31.Optional(Type31.String())
});

// packages/gateway-protocol/src/schema/questions.ts
import { Type as Type32 } from "typebox";
var QuestionIdSchema = Type32.String({ pattern: "^[a-z][a-z0-9_]*$" });
var QuestionHeaderSchema = Type32.String({ maxLength: 12 });
var QuestionOptionSchema = closedObject({
  label: NonEmptyString,
  description: Type32.Optional(Type32.String())
});
var QuestionInputFields = {
  questionId: QuestionIdSchema,
  header: QuestionHeaderSchema,
  question: NonEmptyString,
  options: Type32.Array(QuestionOptionSchema, { maxItems: 4 }),
  multiSelect: Type32.Optional(Type32.Boolean()),
  isOther: Type32.Optional(Type32.Boolean()),
  isSecret: Type32.Optional(Type32.Boolean())
};
var QuestionRequestQuestionSchema = closedObject(QuestionInputFields);
var QuestionFields = {
  ...QuestionInputFields
};
var QuestionSchema = closedObject(QuestionFields);
var QuestionAnswersSchema = closedObject({
  answers: Type32.Record(QuestionIdSchema, Type32.Array(Type32.String()))
});
var QuestionStatusSchema = Type32.Union([
  Type32.Literal("pending"),
  Type32.Literal("answered"),
  Type32.Literal("cancelled"),
  Type32.Literal("expired")
]);
var QuestionRecordSchema = closedObject({
  id: NonEmptyString,
  questions: Type32.Array(QuestionSchema, { minItems: 1, maxItems: 3 }),
  agentId: Type32.Optional(NonEmptyString),
  sessionKey: Type32.Optional(NonEmptyString),
  createdAtMs: Type32.Integer({ minimum: 0 }),
  expiresAtMs: Type32.Integer({ minimum: 0 }),
  status: QuestionStatusSchema,
  answers: Type32.Optional(QuestionAnswersSchema),
  resolvedBy: Type32.Optional(NonEmptyString)
});
var QuestionRequestParamsSchema = closedObject({
  id: Type32.Optional(NonEmptyString),
  questions: Type32.Array(QuestionRequestQuestionSchema, { minItems: 1, maxItems: 3 }),
  agentId: Type32.Optional(NonEmptyString),
  sessionKey: Type32.Optional(NonEmptyString),
  timeoutMs: Type32.Optional(Type32.Integer({ minimum: 1 }))
});
var QuestionRequestResultSchema = closedObject({
  id: NonEmptyString,
  expiresAtMs: Type32.Integer({ minimum: 0 })
});
var QuestionWaitAnswerParamsSchema = closedObject({
  id: NonEmptyString,
  timeoutMs: Type32.Optional(Type32.Integer({ minimum: 1 }))
});
var QuestionWaitAnswerResultSchema = Type32.Union([
  closedObject({ status: Type32.Literal("pending") }),
  closedObject({ status: Type32.Literal("answered"), answers: QuestionAnswersSchema }),
  closedObject({ status: Type32.Literal("cancelled") }),
  closedObject({ status: Type32.Literal("expired") })
]);
var QuestionResolveParamsSchema = Type32.Union([
  closedObject({
    id: NonEmptyString,
    answers: QuestionAnswersSchema,
    resolvedBy: Type32.Optional(NonEmptyString)
  }),
  closedObject({
    id: NonEmptyString,
    cancel: Type32.Literal(true),
    resolvedBy: Type32.Optional(NonEmptyString)
  })
]);
var QuestionResolveResultSchema = Type32.Union([
  closedObject({ status: Type32.Literal("answered"), answers: QuestionAnswersSchema }),
  closedObject({ status: Type32.Literal("cancelled") })
]);
var QuestionGetParamsSchema = closedObject({ id: NonEmptyString });
var QuestionGetResultSchema = closedObject({ question: QuestionRecordSchema });
var QuestionListParamsSchema = closedObject({});
var QuestionListResultSchema = closedObject({
  questions: Type32.Array(QuestionRecordSchema)
});
var QuestionRequestedEventSchema = withSince("2026.7", QuestionRecordSchema);
var QuestionResolvedEventSchema = withSince(
  "2026.7",
  Type32.Union([
    closedObject({
      id: NonEmptyString,
      status: Type32.Literal("answered"),
      answers: QuestionAnswersSchema
    }),
    closedObject({ id: NonEmptyString, status: Type32.Literal("cancelled") }),
    closedObject({ id: NonEmptyString, status: Type32.Literal("expired") })
  ])
);

// packages/gateway-protocol/src/schema/secrets.ts
import { Type as Type33 } from "typebox";
var SecretsReloadParamsSchema = closedObject({});
var SecretsResolveParamsSchema = closedObject({
  commandName: NonEmptyString,
  targetIds: Type33.Array(NonEmptyString),
  allowedPaths: Type33.Optional(Type33.Array(NonEmptyString)),
  forcedActivePaths: Type33.Optional(Type33.Array(NonEmptyString)),
  optionalActivePaths: Type33.Optional(Type33.Array(NonEmptyString)),
  providerOverrides: Type33.Optional(
    closedObject({
      webSearch: Type33.Optional(NonEmptyString),
      webFetch: Type33.Optional(NonEmptyString)
    })
  )
});
var SecretsResolveAssignmentSchema = closedObject({
  path: Type33.Optional(NonEmptyString),
  pathSegments: Type33.Array(NonEmptyString),
  value: Type33.Unknown()
});
var SecretsResolveResultSchema = closedObject({
  ok: Type33.Optional(Type33.Boolean()),
  assignments: Type33.Optional(Type33.Array(SecretsResolveAssignmentSchema)),
  diagnostics: Type33.Optional(Type33.Array(NonEmptyString)),
  inactiveRefPaths: Type33.Optional(Type33.Array(NonEmptyString))
});

// packages/gateway-protocol/src/schema/session-discussion.ts
import { Type as Type34 } from "typebox";
var SessionDiscussionStateSchema = Type34.Union([
  Type34.Literal("none"),
  Type34.Literal("available"),
  Type34.Literal("open")
]);
var SessionDiscussionInfoSchema = closedObject({
  state: SessionDiscussionStateSchema,
  embedUrl: Type34.Optional(Type34.String()),
  openUrl: Type34.Optional(Type34.String())
});
var SessionDiscussionInfoParamsSchema = closedObject({
  sessionKey: NonEmptyString
});
var SessionDiscussionOpenParamsSchema = closedObject({
  sessionKey: NonEmptyString
});
var SessionDiscussionInfoResultSchema = SessionDiscussionInfoSchema;
var SessionDiscussionOpenResultSchema = SessionDiscussionInfoSchema;

// packages/gateway-protocol/src/schema/session-placement.ts
import { Type as Type35 } from "typebox";

// packages/gateway-protocol/src/schema/session-placement-state.ts
function isCloudWorkerPlacementState(state) {
  return state !== void 0 && state !== "local" && state !== "reclaimed";
}

// packages/gateway-protocol/src/schema/session-placement.ts
var SessionPlacementStateSchema = Type35.Union([
  Type35.Literal("local"),
  Type35.Literal("requested"),
  Type35.Literal("provisioning"),
  Type35.Literal("syncing"),
  Type35.Literal("starting"),
  Type35.Literal("active"),
  Type35.Literal("draining"),
  Type35.Literal("reconciling"),
  Type35.Literal("reclaimed"),
  Type35.Literal("failed")
]);
var SessionPlacementTimingProperties = {
  generation: Type35.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  createdAtMs: Type35.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  updatedAtMs: Type35.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  stateChangedAtMs: Type35.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
};
var SessionPlacementOwnerEpochSchema = Type35.Integer({
  minimum: 1,
  maximum: Number.MAX_SAFE_INTEGER
});
var WorkerBundleHashSchema = Type35.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var SessionPlacementWorkspaceProperties = {
  workspaceBaseManifestRef: NonEmptyString,
  remoteWorkspaceDir: NonEmptyString
};
var SessionPlacementAckProperties = {
  lastTranscriptAckCursor: Type35.Optional(
    Type35.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
  ),
  lastLiveEventAckCursor: Type35.Optional(
    Type35.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
  )
};
var WorkspaceResultConflictSchema = closedObject({
  paths: Type35.Array(NonEmptyString, { minItems: 1, maxItems: 256 }),
  stagedResultRef: NonEmptyString,
  totalCount: Type35.Optional(Type35.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }))
});
var SessionPlacementConflictProperties = {
  workspaceResultConflict: Type35.Optional(WorkspaceResultConflictSchema)
};
var TerminalSessionPlacementProperties = {
  environmentId: Type35.Optional(NonEmptyString),
  activeOwnerEpoch: Type35.Optional(SessionPlacementOwnerEpochSchema),
  workspaceBaseManifestRef: Type35.Optional(NonEmptyString),
  remoteWorkspaceDir: Type35.Optional(NonEmptyString),
  workerBundleHash: Type35.Optional(WorkerBundleHashSchema),
  ...SessionPlacementAckProperties,
  ...SessionPlacementConflictProperties
};
function createUnownedSessionPlacementSchema(state) {
  return closedObject({ state: Type35.Literal(state), ...SessionPlacementTimingProperties });
}
function createWorkerOwnedSessionPlacementSchema(state) {
  return closedObject({
    state: Type35.Literal(state),
    ...SessionPlacementTimingProperties,
    environmentId: NonEmptyString,
    activeOwnerEpoch: SessionPlacementOwnerEpochSchema,
    workerBundleHash: WorkerBundleHashSchema,
    ...SessionPlacementWorkspaceProperties,
    ...SessionPlacementAckProperties,
    ...SessionPlacementConflictProperties
  });
}
var LocalSessionPlacementSchema = createUnownedSessionPlacementSchema("local");
var RequestedSessionPlacementSchema = createUnownedSessionPlacementSchema("requested");
var ProvisioningSessionPlacementSchema = closedObject({
  state: Type35.Literal("provisioning"),
  ...SessionPlacementTimingProperties,
  environmentId: Type35.Optional(NonEmptyString)
});
var SyncingSessionPlacementSchema = closedObject({
  state: Type35.Literal("syncing"),
  ...SessionPlacementTimingProperties,
  environmentId: NonEmptyString,
  workerBundleHash: WorkerBundleHashSchema
});
var StartingSessionPlacementSchema = closedObject({
  state: Type35.Literal("starting"),
  ...SessionPlacementTimingProperties,
  environmentId: NonEmptyString,
  workerBundleHash: WorkerBundleHashSchema,
  ...SessionPlacementWorkspaceProperties
});
var ActiveWorkerSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("active");
var DrainingSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("draining");
var ReconcilingSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("reconciling");
var ReclaimedSessionPlacementSchema = closedObject({
  state: Type35.Literal("reclaimed"),
  ...SessionPlacementTimingProperties,
  ...TerminalSessionPlacementProperties
});
var FailedSessionPlacementSchema = closedObject({
  state: Type35.Literal("failed"),
  ...SessionPlacementTimingProperties,
  ...TerminalSessionPlacementProperties,
  recoveryError: NonEmptyString
});
var SessionPlacementSchema = Type35.Union([
  LocalSessionPlacementSchema,
  RequestedSessionPlacementSchema,
  ProvisioningSessionPlacementSchema,
  SyncingSessionPlacementSchema,
  StartingSessionPlacementSchema,
  ActiveWorkerSessionPlacementSchema,
  DrainingSessionPlacementSchema,
  ReconcilingSessionPlacementSchema,
  ReclaimedSessionPlacementSchema,
  FailedSessionPlacementSchema
]);
var SessionsDispatchParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type35.Optional(NonEmptyString),
  profileId: NonEmptyString
});
var SessionsDispatchResultSchema = closedObject({
  ok: Type35.Literal(true),
  key: NonEmptyString,
  sessionId: NonEmptyString,
  placement: ActiveWorkerSessionPlacementSchema
});
var SessionsReclaimParamsSchema = Type35.Object(
  {
    key: NonEmptyString,
    agentId: Type35.Optional(NonEmptyString)
  },
  { additionalProperties: false }
);
var SessionsReclaimResultSchema = Type35.Object(
  {
    ok: Type35.Literal(true),
    key: NonEmptyString,
    sessionId: NonEmptyString,
    placement: ReclaimedSessionPlacementSchema
  },
  { additionalProperties: false }
);
var SessionPlacementProtocolSchemas = {
  SessionPlacementState: SessionPlacementStateSchema,
  LocalSessionPlacement: LocalSessionPlacementSchema,
  RequestedSessionPlacement: RequestedSessionPlacementSchema,
  ProvisioningSessionPlacement: ProvisioningSessionPlacementSchema,
  SyncingSessionPlacement: SyncingSessionPlacementSchema,
  StartingSessionPlacement: StartingSessionPlacementSchema,
  ActiveWorkerSessionPlacement: ActiveWorkerSessionPlacementSchema,
  DrainingSessionPlacement: DrainingSessionPlacementSchema,
  ReconcilingSessionPlacement: ReconcilingSessionPlacementSchema,
  ReclaimedSessionPlacement: ReclaimedSessionPlacementSchema,
  FailedSessionPlacement: FailedSessionPlacementSchema,
  SessionPlacement: SessionPlacementSchema,
  SessionsDispatchParams: SessionsDispatchParamsSchema,
  SessionsDispatchResult: SessionsDispatchResultSchema,
  SessionsReclaimParams: SessionsReclaimParamsSchema,
  SessionsReclaimResult: SessionsReclaimResultSchema
};

// packages/gateway-protocol/src/schema/sessions-catalog.ts
import { Type as Type36 } from "typebox";
var SessionCatalogErrorSchema = closedObject({ code: NonEmptyString, message: NonEmptyString });
var SessionCatalogLocatorSchema = closedObject({
  catalogId: NonEmptyString,
  hostId: NonEmptyString,
  threadId: NonEmptyString
});
var SessionCatalogCapabilitiesSchema = closedObject({
  continueSession: Type36.Boolean(),
  archive: Type36.Boolean(),
  createSession: Type36.Optional(closedObject({ model: NonEmptyString })),
  openTerminal: Type36.Optional(Type36.Boolean())
});
var SessionCatalogDescriptorSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  capabilities: SessionCatalogCapabilitiesSchema
});
var SessionCatalogSessionSchema = closedObject({
  threadId: NonEmptyString,
  name: Type36.Optional(Type36.String()),
  cwd: Type36.Optional(Type36.String()),
  status: NonEmptyString,
  createdAt: Type36.Optional(Type36.Number()),
  updatedAt: Type36.Optional(Type36.Number()),
  recencyAt: Type36.Optional(Type36.Number()),
  source: Type36.Optional(Type36.String()),
  modelProvider: Type36.Optional(Type36.String()),
  cliVersion: Type36.Optional(Type36.String()),
  gitBranch: Type36.Optional(Type36.String()),
  customGroup: Type36.Optional(Type36.String()),
  archived: Type36.Boolean(),
  sessionKey: Type36.Optional(NonEmptyString),
  canContinue: Type36.Boolean(),
  canArchive: Type36.Boolean(),
  canOpenTerminal: Type36.Optional(Type36.Boolean())
});
var SessionCatalogHostSchema = closedObject({
  hostId: NonEmptyString,
  label: NonEmptyString,
  kind: Type36.Union([Type36.Literal("gateway"), Type36.Literal("node")]),
  connected: Type36.Boolean(),
  nodeId: Type36.Optional(NonEmptyString),
  sessions: Type36.Array(SessionCatalogSessionSchema),
  nextCursor: Type36.Optional(Type36.String()),
  error: Type36.Optional(SessionCatalogErrorSchema)
});
var SessionCatalogSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  capabilities: SessionCatalogCapabilitiesSchema,
  hosts: Type36.Array(SessionCatalogHostSchema),
  error: Type36.Optional(SessionCatalogErrorSchema)
});
var SessionsCatalogListCommonProperties = {
  agentId: Type36.Optional(NonEmptyString),
  progressId: Type36.Optional(Type36.String({ minLength: 1, maxLength: 128 })),
  search: Type36.Optional(Type36.String()),
  limitPerHost: Type36.Optional(Type36.Integer({ minimum: 1 })),
  hostIds: Type36.Optional(Type36.Array(NonEmptyString))
};
var SessionsCatalogListParamsSchema = closedObject({
  catalogId: Type36.Optional(NonEmptyString),
  cursors: Type36.Optional(Type36.Record(NonEmptyString, Type36.String())),
  ...SessionsCatalogListCommonProperties
});
var SessionsCatalogListResultSchema = closedObject({
  catalogs: Type36.Array(SessionCatalogSchema)
});
var SessionsCatalogHostEventCatalogSchema = closedObject({
  ...SessionCatalogSchema.properties,
  hosts: Type36.Array(SessionCatalogHostSchema, { minItems: 1, maxItems: 1 })
});
var SessionsCatalogHostEventSchema = closedObject({
  progressId: Type36.String({ minLength: 1, maxLength: 128 }),
  agentId: NonEmptyString,
  catalog: SessionsCatalogHostEventCatalogSchema
});
var SessionCatalogTranscriptItemSchema = closedObject({
  id: Type36.Optional(Type36.String()),
  type: Type36.Union([
    Type36.Literal("userMessage"),
    Type36.Literal("agentMessage"),
    Type36.Literal("reasoning"),
    Type36.Literal("toolCall"),
    Type36.Literal("toolResult"),
    Type36.Literal("other")
  ]),
  text: Type36.Optional(Type36.String()),
  timestamp: Type36.Optional(Type36.String()),
  model: Type36.Optional(Type36.String()),
  truncated: Type36.Optional(Type36.Boolean()),
  raw: Type36.Optional(PluginJsonValueSchema)
});
var SessionsCatalogReadParamsSchema = closedObject({
  ...SessionCatalogLocatorSchema.properties,
  limit: Type36.Optional(Type36.Integer({ minimum: 1 })),
  cursor: Type36.Optional(Type36.String())
});
var SessionsCatalogReadResultSchema = closedObject({
  hostId: NonEmptyString,
  label: Type36.Optional(Type36.String()),
  threadId: NonEmptyString,
  items: Type36.Array(SessionCatalogTranscriptItemSchema),
  nextCursor: Type36.Optional(Type36.String())
});
var SessionsCatalogContinueParamsSchema = closedObject({
  ...SessionCatalogLocatorSchema.properties
});
var SessionsCatalogContinueResultSchema = closedObject({ sessionKey: NonEmptyString });
var SessionsCatalogArchiveParamsSchema = closedObject({
  ...SessionCatalogLocatorSchema.properties,
  confirmNoOtherRunner: Type36.Literal(true)
});
var SessionsCatalogArchiveResultSchema = closedObject({ ok: Type36.Literal(true) });

// packages/gateway-protocol/src/schema/sessions.ts
import { Type as Type38 } from "typebox";

// packages/gateway-protocol/src/session-icon.ts
var SESSION_AGENT_ATTENTION_ICON_IDS = [
  "hand",
  "key",
  "alert",
  "flag",
  "lock",
  "hourglass"
];
var graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
var SVG_NUMBER_SOURCE = "[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][-+]?\\d+)?";
var SVG_NUMBER_RE = new RegExp(`^${SVG_NUMBER_SOURCE}$`);
var SVG_TRANSFORM_RE = new RegExp(`^([a-z]+)\\s*\\(([^)]*)\\)`);

// packages/gateway-protocol/src/schema/sessions-create.ts
import { Type as Type37 } from "typebox";
var SessionsCreateParamsSchema = closedObject({
  key: Type37.Optional(NonEmptyString),
  agentId: Type37.Optional(NonEmptyString),
  label: Type37.Optional(SessionLabelString),
  model: Type37.Optional(NonEmptyString),
  thinkingLevel: Type37.Optional(NonEmptyString),
  catalogId: Type37.Optional(NonEmptyString),
  parentSessionKey: Type37.Optional(NonEmptyString),
  fork: Type37.Optional(
    Type37.Boolean({ description: "Fork the parent transcript; requires parentSessionKey." })
  ),
  emitCommandHooks: Type37.Optional(Type37.Boolean()),
  succeedsParent: Type37.Optional(
    Type37.Boolean({
      description: "When sessions.create creates a distinct child, whether that child succeeds its parent and emits the parent's terminal session_end. Requires parentSessionKey and emitCommandHooks. False keeps the parent active; omission preserves legacy behavior."
    })
  ),
  task: Type37.Optional(Type37.String()),
  message: Type37.Optional(Type37.String()),
  attachments: Type37.Optional(ChatAttachmentsSchema),
  worktree: Type37.Optional(Type37.Boolean()),
  worktreeBaseRef: Type37.Optional(
    Type37.String({
      minLength: 1,
      description: "Base ref for the new managed worktree branch. Requires worktree=true."
    })
  ),
  worktreeName: Type37.Optional(
    Type37.String({
      pattern: "^[a-z0-9][a-z0-9-]{0,63}$",
      description: "Managed worktree name; becomes branch openclaw/<name>. Requires worktree=true."
    })
  ),
  execNode: Type37.Optional(
    Type37.String({
      minLength: 1,
      description: "Bind session exec to host=node with this node id/name. Requires operator.admin."
    })
  ),
  cwd: Type37.Optional(
    Type37.String({
      minLength: 1,
      description: "Absolute source directory for a managed worktree, or the working directory on execNode. Requires operator.admin."
    })
  )
});

// packages/gateway-protocol/src/schema/sessions.ts
var SessionCompactionCheckpointReasonSchema = Type38.Union([
  Type38.Literal("manual"),
  Type38.Literal("auto-threshold"),
  Type38.Literal("overflow-retry"),
  Type38.Literal("timeout-retry")
]);
var SessionOperationEventSchema = closedObject({
  operationId: NonEmptyString,
  operation: Type38.Literal("compact"),
  phase: Type38.Union([Type38.Literal("start"), Type38.Literal("end")]),
  sessionKey: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString),
  ts: Type38.Integer({ minimum: 0 }),
  completed: Type38.Optional(Type38.Boolean()),
  reason: Type38.Optional(Type38.String())
});
var SessionCompactionTranscriptReferenceSchema = closedObject({
  sessionId: NonEmptyString,
  sessionFile: Type38.Optional(NonEmptyString),
  leafId: Type38.Optional(NonEmptyString),
  entryId: Type38.Optional(NonEmptyString)
});
var SessionCompactionCheckpointSchema = closedObject({
  checkpointId: NonEmptyString,
  sessionKey: NonEmptyString,
  sessionId: NonEmptyString,
  createdAt: Type38.Integer({ minimum: 0 }),
  reason: SessionCompactionCheckpointReasonSchema,
  tokensBefore: Type38.Optional(Type38.Integer({ minimum: 0 })),
  tokensAfter: Type38.Optional(Type38.Integer({ minimum: 0 })),
  summary: Type38.Optional(Type38.String()),
  firstKeptEntryId: Type38.Optional(NonEmptyString),
  preCompaction: SessionCompactionTranscriptReferenceSchema,
  postCompaction: SessionCompactionTranscriptReferenceSchema
});
var SessionFileKindSchema = Type38.Union([Type38.Literal("modified"), Type38.Literal("read")]);
var SessionFileRelevanceSchema = Type38.Union([
  Type38.Literal("modified"),
  Type38.Literal("read"),
  Type38.Literal("mixed")
]);
var SessionFileHashSchema = Type38.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var SessionFileEntrySchema = closedObject({
  path: NonEmptyString,
  workspacePath: Type38.Optional(NonEmptyString),
  name: NonEmptyString,
  kind: SessionFileKindSchema,
  missing: Type38.Boolean(),
  size: Type38.Optional(Type38.Integer({ minimum: 0 })),
  updatedAtMs: Type38.Optional(Type38.Integer({ minimum: 0 })),
  content: Type38.Optional(Type38.String()),
  hash: Type38.Optional(SessionFileHashSchema)
});
var SessionFileBrowserEntrySchema = closedObject({
  path: Type38.String(),
  name: NonEmptyString,
  kind: Type38.Union([Type38.Literal("file"), Type38.Literal("directory")]),
  sessionKind: Type38.Optional(SessionFileRelevanceSchema),
  size: Type38.Optional(Type38.Integer({ minimum: 0 })),
  updatedAtMs: Type38.Optional(Type38.Integer({ minimum: 0 }))
});
var SessionFileBrowserResultSchema = closedObject({
  path: Type38.String(),
  parentPath: Type38.Optional(Type38.String()),
  search: Type38.Optional(Type38.String()),
  entries: Type38.Array(SessionFileBrowserEntrySchema),
  truncated: Type38.Optional(Type38.Boolean())
});
var SessionsFilesListParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString),
  path: Type38.Optional(Type38.String()),
  search: Type38.Optional(Type38.String())
});
var SessionsFilesListResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type38.Optional(NonEmptyString),
  files: Type38.Array(SessionFileEntrySchema),
  browser: Type38.Optional(SessionFileBrowserResultSchema)
});
var SessionsFilesGetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  path: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString)
});
var SessionsFilesGetResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type38.Optional(NonEmptyString),
  file: SessionFileEntrySchema
});
var SessionsFilesSetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  path: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString),
  content: Type38.String(),
  expectedHash: SessionFileHashSchema
});
var SessionsFilesSetResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type38.Optional(NonEmptyString),
  file: SessionFileEntrySchema
});
var SessionsFilesRevealParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString)
});
var SessionsFilesRevealResultSchema = closedObject({
  ok: Type38.Boolean(),
  path: Type38.Optional(NonEmptyString),
  error: Type38.Optional(NonEmptyString)
});
var SessionDiffFileStatusSchema = Type38.Union([
  Type38.Literal("added"),
  Type38.Literal("modified"),
  Type38.Literal("deleted"),
  Type38.Literal("renamed")
]);
var SessionDiffFileSchema = closedObject({
  path: NonEmptyString,
  oldPath: Type38.Optional(NonEmptyString),
  status: SessionDiffFileStatusSchema,
  additions: Type38.Integer({ minimum: 0 }),
  deletions: Type38.Integer({ minimum: 0 }),
  binary: Type38.Optional(Type38.Boolean()),
  untracked: Type38.Optional(Type38.Boolean()),
  /** Per-file unified patch text; absent for binary or oversized files. */
  patch: Type38.Optional(Type38.String()),
  truncated: Type38.Optional(Type38.Boolean())
});
var SessionsDiffParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString)
});
var SessionsDiffResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type38.Optional(NonEmptyString),
  branch: Type38.Optional(NonEmptyString),
  /** Display label of the diff base: the default branch name or "HEAD". */
  baseRef: Type38.Optional(NonEmptyString),
  files: Type38.Array(SessionDiffFileSchema),
  additions: Type38.Integer({ minimum: 0 }),
  deletions: Type38.Integer({ minimum: 0 }),
  truncated: Type38.Optional(Type38.Boolean()),
  unavailableReason: Type38.Optional(
    Type38.Union([Type38.Literal("unknown_session"), Type38.Literal("not_git")])
  )
});
var SessionsListParamsSchema = closedObject({
  /** Maximum rows to return; omitted Gateway RPC calls use a bounded default. */
  limit: Type38.Optional(Type38.Integer({ minimum: 1 })),
  offset: Type38.Optional(Type38.Integer({ minimum: 0 })),
  activeMinutes: Type38.Optional(Type38.Integer({ minimum: 1 })),
  /** Require a real user/channel interaction; excludes synthetic isolated heartbeat rows. */
  requireLastInteraction: Type38.Optional(Type38.Boolean()),
  sortBy: Type38.Optional(Type38.Union([Type38.Literal("updatedAt"), Type38.Literal("lastInteractionAt")])),
  includeGlobal: Type38.Optional(Type38.Boolean()),
  includeUnknown: Type38.Optional(Type38.Boolean()),
  /** Limit agent-scoped rows to agents currently present in config. */
  configuredAgentsOnly: Type38.Optional(Type38.Boolean()),
  /**
   * Read first 8KB of each session transcript to derive title from first user message.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeDerivedTitles: Type38.Optional(Type38.Boolean()),
  /**
   * Read last 16KB of each session transcript to extract most recent message preview.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeLastMessage: Type38.Optional(Type38.Boolean()),
  label: Type38.Optional(SessionLabelString),
  spawnedBy: Type38.Optional(NonEmptyString),
  agentId: Type38.Optional(NonEmptyString),
  search: Type38.Optional(Type38.String()),
  /** True lists archived sessions; false or omitted lists active sessions. */
  archived: Type38.Optional(Type38.Boolean())
});
var SessionsSearchParamsSchema = closedObject({
  agentId: Type38.Optional(NonEmptyString),
  sessionKeys: Type38.Optional(Type38.Array(NonEmptyString, { minItems: 1, maxItems: 200 })),
  query: Type38.String({ minLength: 1, maxLength: 4096 }),
  limit: Type38.Optional(Type38.Integer({ minimum: 1, maximum: 25 }))
});
var SessionsSearchHitSchema = closedObject({
  sessionKey: NonEmptyString,
  sessionId: NonEmptyString,
  messageId: NonEmptyString,
  role: Type38.Union([Type38.Literal("user"), Type38.Literal("assistant")]),
  timestamp: Type38.Integer({ minimum: 0 }),
  snippet: Type38.String(),
  score: Type38.Number()
});
var SessionsSearchResultSchema = closedObject({
  results: Type38.Array(SessionsSearchHitSchema),
  indexing: Type38.Optional(Type38.Boolean()),
  truncated: Type38.Optional(Type38.Boolean())
});
var SessionsCleanupParamsSchema = closedObject({
  agent: Type38.Optional(NonEmptyString),
  allAgents: Type38.Optional(Type38.Boolean()),
  enforce: Type38.Optional(Type38.Boolean()),
  activeKey: Type38.Optional(NonEmptyString),
  fixMissing: Type38.Optional(Type38.Boolean()),
  fixDmScope: Type38.Optional(Type38.Boolean())
});
var SessionsPreviewParamsSchema = closedObject({
  keys: Type38.Array(NonEmptyString, { minItems: 1 }),
  limit: Type38.Optional(Type38.Integer({ minimum: 1 })),
  maxChars: Type38.Optional(Type38.Integer({ minimum: 20 }))
});
var SessionsDescribeParamsSchema = closedObject({
  key: NonEmptyString,
  includeDerivedTitles: Type38.Optional(Type38.Boolean()),
  includeLastMessage: Type38.Optional(Type38.Boolean())
});
var SessionsResolveParamsSchema = closedObject({
  key: Type38.Optional(NonEmptyString),
  sessionId: Type38.Optional(NonEmptyString),
  label: Type38.Optional(SessionLabelString),
  agentId: Type38.Optional(NonEmptyString),
  spawnedBy: Type38.Optional(NonEmptyString),
  includeGlobal: Type38.Optional(Type38.Boolean()),
  includeUnknown: Type38.Optional(Type38.Boolean()),
  /** Return a successful `{ ok: false }` response when the selector does not match a session. */
  allowMissing: Type38.Optional(Type38.Boolean())
});
var SessionWorktreeInfoSchema = closedObject({
  id: NonEmptyString,
  path: NonEmptyString,
  branch: NonEmptyString
});
var SessionsCreateResultSchema = Type38.Object(
  {
    ok: Type38.Literal(true),
    key: NonEmptyString,
    sessionId: Type38.Optional(NonEmptyString),
    entry: Type38.Optional(Type38.Record(Type38.String(), Type38.Unknown())),
    runStarted: Type38.Optional(Type38.Boolean()),
    runError: Type38.Optional(ErrorShapeSchema),
    worktree: Type38.Optional(SessionWorktreeInfoSchema)
  },
  { additionalProperties: true }
);
var SessionsSendParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString),
  message: Type38.String(),
  thinking: Type38.Optional(Type38.String()),
  attachments: Type38.Optional(Type38.Array(Type38.Unknown())),
  timeoutMs: Type38.Optional(Type38.Integer({ minimum: 0 })),
  idempotencyKey: Type38.Optional(NonEmptyString)
});
var SessionsMessagesSubscribeParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString),
  /** Opt in to sanitized durable approval events for this session and its descendants. */
  includeApprovals: Type38.Optional(Type38.Literal(true))
});
var SessionsMessagesUnsubscribeParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString)
});
var SessionsAbortParamsSchema = closedObject({
  key: Type38.Optional(NonEmptyString),
  runId: Type38.Optional(NonEmptyString),
  agentId: Type38.Optional(NonEmptyString)
});
var SessionsPatchParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString),
  label: Type38.Optional(Type38.Union([SessionLabelString, Type38.Null()])),
  /** User-defined organization bucket ("category", not chat-group); null clears it. */
  category: Type38.Optional(Type38.Union([SessionLabelString, Type38.Null()])),
  icon: Type38.Optional(
    Type38.Union([NonEmptyString, Type38.Null()], {
      description: "Sidebar icon: one emoji, name:<id>, or svg:<svg ...>...</svg>."
    })
  ),
  statusNote: Type38.Optional(
    Type38.Union([Type38.String({ maxLength: 120 }), Type38.Null()], {
      description: "Short expiring sidebar status note; null clears it and any declared attention."
    })
  ),
  attention: Type38.Optional(
    Type38.Union([Type38.String({ enum: [...SESSION_AGENT_ATTENTION_ICON_IDS] }), Type38.Null()])
  ),
  ttlMinutes: Type38.Optional(Type38.Integer({ minimum: 1, maximum: 120 })),
  archived: Type38.Optional(Type38.Boolean()),
  pinned: Type38.Optional(Type38.Boolean()),
  unread: Type38.Optional(
    Type38.Boolean({ description: "Set true to mark unread; false records the session as read." })
  ),
  thinkingLevel: Type38.Optional(Type38.Union([NonEmptyString, Type38.Null()])),
  fastMode: Type38.Optional(Type38.Union([Type38.Boolean(), Type38.Literal("auto"), Type38.Null()])),
  verboseLevel: Type38.Optional(Type38.Union([NonEmptyString, Type38.Null()])),
  traceLevel: Type38.Optional(Type38.Union([NonEmptyString, Type38.Null()])),
  reasoningLevel: Type38.Optional(Type38.Union([NonEmptyString, Type38.Null()])),
  responseUsage: Type38.Optional(
    Type38.Union([
      Type38.Literal("off"),
      Type38.Literal("tokens"),
      Type38.Literal("full"),
      // Backward compat with older clients/stores.
      Type38.Literal("on"),
      Type38.Null()
    ])
  ),
  elevatedLevel: Type38.Optional(Type38.Union([NonEmptyString, Type38.Null()])),
  execHost: Type38.Optional(Type38.Union([NonEmptyString, Type38.Null()])),
  execSecurity: Type38.Optional(Type38.Union([NonEmptyString, Type38.Null()])),
  execAsk: Type38.Optional(Type38.Union([NonEmptyString, Type38.Null()])),
  execNode: Type38.Optional(Type38.Union([NonEmptyString, Type38.Null()])),
  model: Type38.Optional(Type38.Union([NonEmptyString, Type38.Null()])),
  spawnedBy: Type38.Optional(Type38.Union([NonEmptyString, Type38.Null()])),
  spawnedWorkspaceDir: Type38.Optional(Type38.Union([NonEmptyString, Type38.Null()])),
  spawnedCwd: Type38.Optional(Type38.Union([NonEmptyString, Type38.Null()])),
  spawnDepth: Type38.Optional(Type38.Union([Type38.Integer({ minimum: 0 }), Type38.Null()])),
  subagentRole: Type38.Optional(
    Type38.Union([Type38.Literal("orchestrator"), Type38.Literal("leaf"), Type38.Null()])
  ),
  subagentControlScope: Type38.Optional(
    Type38.Union([Type38.Literal("children"), Type38.Literal("none"), Type38.Null()])
  ),
  inheritedToolAllow: Type38.Optional(Type38.Union([Type38.Array(NonEmptyString), Type38.Null()])),
  inheritedToolDeny: Type38.Optional(Type38.Union([Type38.Array(NonEmptyString), Type38.Null()])),
  sendPolicy: Type38.Optional(Type38.Union([Type38.Literal("allow"), Type38.Literal("deny"), Type38.Null()])),
  groupActivation: Type38.Optional(
    Type38.Union([Type38.Literal("mention"), Type38.Literal("always"), Type38.Null()])
  )
});
var SessionsPluginPatchParamsSchema = closedObject({
  key: NonEmptyString,
  pluginId: NonEmptyString,
  namespace: NonEmptyString,
  value: Type38.Optional(PluginJsonValueSchema),
  unset: Type38.Optional(Type38.Boolean())
});
var SessionsPluginPatchResultSchema = closedObject({
  ok: Type38.Literal(true),
  key: NonEmptyString,
  value: Type38.Optional(PluginJsonValueSchema)
});
var SessionsResetParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString),
  reason: Type38.Optional(Type38.Union([Type38.Literal("new"), Type38.Literal("reset")]))
});
var SessionsDeleteParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString),
  deleteTranscript: Type38.Optional(Type38.Boolean()),
  // Internal compare-and-delete guard for lifecycle-owned cleanup.
  expectedSessionId: Type38.Optional(NonEmptyString),
  expectedLifecycleRevision: Type38.Optional(NonEmptyString),
  expectedSessionUpdatedAt: Type38.Optional(Type38.Number({ minimum: 0 })),
  // Internal control: when false, still unbind thread bindings but skip hook emission.
  emitLifecycleHooks: Type38.Optional(Type38.Boolean()),
  /**
   * Restricts the delete to already-archived sessions (archive-then-delete).
   * operator.write callers must set this; deletes without it require
   * operator.admin.
   */
  archivedOnly: Type38.Optional(Type38.Boolean())
});
var SessionsGroupsListParamsSchema = closedObject({});
var SessionGroupSchema = closedObject({
  name: SessionLabelString,
  position: Type38.Integer({ minimum: 0 })
});
var SessionsGroupsListResultSchema = closedObject({
  groups: Type38.Array(SessionGroupSchema)
});
var SessionsGroupsPutParamsSchema = closedObject({
  names: Type38.Array(SessionLabelString, { maxItems: 200 })
});
var SessionsGroupsRenameParamsSchema = closedObject({
  name: SessionLabelString,
  to: SessionLabelString
});
var SessionsGroupsDeleteParamsSchema = closedObject({ name: SessionLabelString });
var SessionsGroupsMutationResultSchema = closedObject({
  ok: Type38.Literal(true),
  groups: Type38.Array(SessionGroupSchema),
  updatedSessions: Type38.Optional(Type38.Integer({ minimum: 0 }))
});
var SessionsCompactParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString),
  maxLines: Type38.Optional(Type38.Integer({ minimum: 1 }))
});
var SessionsCompactionListParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString)
});
var SessionsCompactionGetParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString),
  checkpointId: NonEmptyString
});
var SessionsCompactionBranchParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString),
  checkpointId: NonEmptyString
});
var SessionsCompactionRestoreParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString),
  checkpointId: NonEmptyString
});
var SessionsRewindParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString),
  entryId: NonEmptyString
});
var SessionsForkParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString),
  entryId: NonEmptyString
});
var SessionsRewindResultSchema = closedObject({
  editorText: Type38.Optional(Type38.String())
});
var SessionsForkResultSchema = closedObject({
  sessionKey: NonEmptyString,
  editorText: Type38.Optional(Type38.String())
});
var SessionBranchSchema = closedObject({
  leafEntryId: NonEmptyString,
  headline: Type38.String(),
  messageCount: Type38.Integer({ minimum: 0 }),
  updatedAt: Type38.Optional(NonEmptyString),
  active: Type38.Boolean()
});
var SessionsBranchesListParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString)
});
var SessionsBranchesListResultSchema = closedObject({
  branches: Type38.Array(SessionBranchSchema)
});
var SessionsBranchesSwitchParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type38.Optional(NonEmptyString),
  leafEntryId: NonEmptyString
});
var SessionsBranchesSwitchResultSchema = closedObject({});
var SessionsCompactionListResultSchema = closedObject({
  ok: Type38.Literal(true),
  key: NonEmptyString,
  checkpoints: Type38.Array(SessionCompactionCheckpointSchema)
});
var SessionsCompactionGetResultSchema = closedObject({
  ok: Type38.Literal(true),
  key: NonEmptyString,
  checkpoint: SessionCompactionCheckpointSchema
});
var SessionsCompactionBranchResultSchema = closedObject({
  ok: Type38.Literal(true),
  sourceKey: NonEmptyString,
  key: NonEmptyString,
  sessionId: NonEmptyString,
  checkpoint: SessionCompactionCheckpointSchema,
  entry: Type38.Object(
    {
      sessionId: NonEmptyString,
      updatedAt: Type38.Integer({ minimum: 0 })
    },
    { additionalProperties: true }
  )
});
var SessionsCompactionRestoreResultSchema = closedObject({
  ok: Type38.Literal(true),
  key: NonEmptyString,
  sessionId: NonEmptyString,
  checkpoint: SessionCompactionCheckpointSchema,
  entry: Type38.Object(
    {
      sessionId: NonEmptyString,
      updatedAt: Type38.Integer({ minimum: 0 })
    },
    { additionalProperties: true }
  )
});
var SessionsUsageParamsSchema = closedObject({
  /** Specific session key to analyze; if omitted returns sessions for the effective agent. */
  key: Type38.Optional(NonEmptyString),
  /** Agent scope for list-style usage queries. */
  agentId: Type38.Optional(NonEmptyString),
  /** Explicit all-agent scope for list-style usage queries. */
  agentScope: Type38.Optional(Type38.Literal("all")),
  /** Start date for range filter (YYYY-MM-DD). */
  startDate: Type38.Optional(Type38.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
  /** End date for range filter (YYYY-MM-DD). */
  endDate: Type38.Optional(Type38.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
  /** How start/end dates should be interpreted. Defaults to UTC when omitted. */
  mode: Type38.Optional(
    Type38.Union([Type38.Literal("utc"), Type38.Literal("gateway"), Type38.Literal("specific")])
  ),
  /** Preset range for usage queries when explicit start/end dates are omitted. */
  range: Type38.Optional(
    Type38.Union([
      Type38.Literal("7d"),
      Type38.Literal("30d"),
      Type38.Literal("90d"),
      Type38.Literal("1y"),
      Type38.Literal("all")
    ])
  ),
  /** Usage row grouping. `family` rolls up known rotated session ids for a logical key. */
  groupBy: Type38.Optional(Type38.Union([Type38.Literal("instance"), Type38.Literal("family")])),
  /** Backward-compatible alias for requesting family grouping. */
  includeHistorical: Type38.Optional(
    Type38.Boolean({
      deprecated: true,
      description: "Deprecated alias for groupBy: family."
    })
  ),
  /** UTC offset to use when mode is `specific` (for example, UTC-4 or UTC+5:30). */
  utcOffset: Type38.Optional(
    Type38.String({
      pattern: "^UTC[+-]\\d{1,2}(?::[0-5]\\d)?$",
      deprecated: true,
      description: "Deprecated compatibility fallback; use timeZone."
    })
  ),
  /** IANA time zone for `specific`; preferred over `utcOffset`, which remains a compatibility fallback. */
  timeZone: Type38.Optional(NonEmptyString),
  /** Maximum sessions to return (default 50). */
  limit: Type38.Optional(Type38.Integer({ minimum: 1 })),
  /** Include context weight breakdown (systemPromptReport). */
  includeContextWeight: Type38.Optional(Type38.Boolean())
});

// packages/gateway-protocol/src/schema/skill-history.ts
import { Type as Type39 } from "typebox";

// packages/gateway-protocol/src/protocol-validator.ts
import { Compile } from "typebox/compile";
// @__NO_SIDE_EFFECTS__
function lazyCompile(schema, precheck) {
  let compiled;
  let errors = null;
  const getCompiled = () => {
    compiled ??= Compile(schema);
    return compiled;
  };
  const validate = ((data) => {
    const precheckError = precheck?.(data);
    if (precheckError) {
      errors = [precheckError];
      return false;
    }
    const current = getCompiled();
    const valid = current.Check(data);
    errors = valid ? null : [...current.Errors(data)];
    return valid;
  });
  Object.defineProperties(validate, {
    errors: {
      configurable: true,
      enumerable: true,
      get: () => errors,
      set: (nextErrors) => {
        errors = nextErrors ?? null;
      }
    },
    schema: {
      configurable: true,
      enumerable: true,
      get: () => schema
    }
  });
  return validate;
}

// packages/gateway-protocol/src/schema/skill-history.ts
var SkillsProposalHistoryStatusParamsSchema = Type39.Object(
  { agentId: Type39.Optional(NonEmptyString) },
  { additionalProperties: false }
);
var SkillsProposalHistoryScanParamsSchema = Type39.Object(
  {
    agentId: Type39.Optional(NonEmptyString),
    direction: Type39.Optional(Type39.Union([Type39.Literal("older"), Type39.Literal("newer")]))
  },
  { additionalProperties: false }
);
var SkillsProposalHistoryScanResultSchema = Type39.Object(
  {
    schema: Type39.Literal("openclaw.skill-workshop.history-scan.v1"),
    hasScanned: Type39.Boolean(),
    reviewedSessions: Type39.Integer({ minimum: 0 }),
    ideasFound: Type39.Integer({ minimum: 0 }),
    hasMore: Type39.Boolean(),
    lastScanReviewed: Type39.Integer({ minimum: 0 }),
    lastScanIdeas: Type39.Integer({ minimum: 0 }),
    lastScanAt: Type39.Optional(NonEmptyString),
    oldestReviewedAt: Type39.Optional(NonEmptyString),
    newestReviewedAt: Type39.Optional(NonEmptyString)
  },
  { additionalProperties: false }
);
var validateSkillsProposalHistoryStatusParams = lazyCompile(
  SkillsProposalHistoryStatusParamsSchema
);
var validateSkillsProposalHistoryScanParams = lazyCompile(
  SkillsProposalHistoryScanParamsSchema
);

// packages/gateway-protocol/src/schema/skill-protocol-schemas.ts
var SkillWorkshopProtocolSchemas = {
  SkillsProposalsListParams: SkillsProposalsListParamsSchema,
  SkillsProposalsListResult: SkillsProposalsListResultSchema,
  SkillsProposalHistoryStatusParams: SkillsProposalHistoryStatusParamsSchema,
  SkillsProposalHistoryScanParams: SkillsProposalHistoryScanParamsSchema,
  SkillsProposalHistoryScanResult: SkillsProposalHistoryScanResultSchema
};

// packages/gateway-protocol/src/schema/system-info.ts
import { Type as Type40 } from "typebox";
var SystemInfoParamsSchema = closedObject({});
var SystemInfoResultSchema = closedObject({
  machineName: Type40.String(),
  hostname: Type40.String(),
  platform: Type40.String(),
  release: Type40.String(),
  arch: Type40.String(),
  osLabel: Type40.String(),
  lanAddress: Type40.Optional(Type40.String()),
  port: Type40.Optional(Type40.Integer()),
  nodeVersion: Type40.String(),
  pid: Type40.Integer(),
  /** Process-start identity for invalidating work that cannot survive a Gateway restart. */
  processInstanceId: Type40.Optional(Type40.String({ minLength: 1 })),
  uptimeMs: Type40.Integer(),
  cpuCount: Type40.Integer(),
  cpuModel: Type40.Optional(Type40.String()),
  loadAverage: Type40.Optional(Type40.Tuple([Type40.Number(), Type40.Number(), Type40.Number()])),
  memoryTotalBytes: Type40.Integer(),
  memoryFreeBytes: Type40.Integer(),
  diskTotalBytes: Type40.Optional(Type40.Integer()),
  diskAvailableBytes: Type40.Optional(Type40.Integer()),
  diskPath: Type40.Optional(Type40.String())
});

// packages/gateway-protocol/src/schema/task-suggestions.ts
import { Type as Type41 } from "typebox";
var TaskIdSchema = Type41.String({ minLength: 1, maxLength: 128 });
var TaskTitleSchema = Type41.String({ minLength: 1, maxLength: 60 });
var TaskPromptSchema = Type41.String({ minLength: 1, maxLength: 32768 });
var TaskTldrSchema = Type41.String({ minLength: 1, maxLength: 1024 });
var TaskCwdSchema = Type41.String({ minLength: 1, maxLength: 4096 });
var TaskSessionKeySchema = Type41.String({ minLength: 1, maxLength: 512 });
var TaskAgentIdSchema = Type41.String({ minLength: 1, maxLength: 128 });
var TaskSuggestionSchema = closedObject({
  id: TaskIdSchema,
  title: TaskTitleSchema,
  prompt: TaskPromptSchema,
  tldr: TaskTldrSchema,
  cwd: TaskCwdSchema,
  sessionKey: TaskSessionKeySchema,
  agentId: Type41.Optional(TaskAgentIdSchema),
  createdAt: Type41.Integer({ minimum: 0 })
});
var TaskSuggestionsListParamsSchema = closedObject({
  sessionKey: Type41.Optional(TaskSessionKeySchema),
  agentId: Type41.Optional(TaskAgentIdSchema)
});
var TaskSuggestionsListResultSchema = closedObject({
  suggestions: Type41.Array(TaskSuggestionSchema)
});
var TaskSuggestionsCreateParamsSchema = closedObject({
  title: TaskTitleSchema,
  prompt: TaskPromptSchema,
  tldr: TaskTldrSchema,
  cwd: TaskCwdSchema,
  sessionKey: TaskSessionKeySchema,
  agentId: Type41.Optional(TaskAgentIdSchema)
});
var TaskSuggestionsCreateResultSchema = closedObject({
  taskId: TaskIdSchema,
  suggestion: TaskSuggestionSchema
});
var TaskSuggestionResolutionSchema = Type41.Union([
  Type41.Literal("dismissed"),
  Type41.Literal("accepted"),
  Type41.Literal("expired")
]);
var TaskSuggestionsAcceptParamsSchema = closedObject({ taskId: TaskIdSchema });
var TaskSuggestionsAcceptResultSchema = closedObject({
  taskId: TaskIdSchema,
  key: TaskSessionKeySchema
});
var TaskSuggestionsDismissParamsSchema = closedObject({
  taskId: TaskIdSchema,
  reason: Type41.Optional(Type41.String({ maxLength: 1024 }))
});
var TaskSuggestionsDismissResultSchema = closedObject({
  taskId: TaskIdSchema,
  dismissed: Type41.Boolean()
});
var TaskSuggestionEventSchema = Type41.Union([
  closedObject({ action: Type41.Literal("created"), suggestion: TaskSuggestionSchema }),
  closedObject({
    action: Type41.Literal("resolved"),
    taskId: TaskIdSchema,
    resolution: TaskSuggestionResolutionSchema
  })
]);

// packages/gateway-protocol/src/schema/tasks.ts
import { Type as Type42 } from "typebox";
var TaskLedgerStatusSchema = Type42.Union([
  Type42.Literal("queued"),
  Type42.Literal("running"),
  Type42.Literal("completed"),
  Type42.Literal("failed"),
  Type42.Literal("cancelled"),
  Type42.Literal("timed_out")
]);
var TimestampSchema = Type42.Union([Type42.String(), Type42.Integer({ minimum: 0 })]);
var TaskSummarySchema = closedObject({
  id: NonEmptyString,
  kind: Type42.Optional(Type42.String()),
  runtime: Type42.Optional(Type42.String()),
  status: TaskLedgerStatusSchema,
  title: Type42.Optional(Type42.String()),
  agentId: Type42.Optional(Type42.String()),
  sessionKey: Type42.Optional(Type42.String()),
  childSessionKey: Type42.Optional(Type42.String()),
  ownerKey: Type42.Optional(Type42.String()),
  runId: Type42.Optional(Type42.String()),
  taskId: Type42.Optional(Type42.String()),
  flowId: Type42.Optional(Type42.String()),
  parentTaskId: Type42.Optional(Type42.String()),
  sourceId: Type42.Optional(Type42.String()),
  createdAt: Type42.Optional(TimestampSchema),
  updatedAt: Type42.Optional(TimestampSchema),
  startedAt: Type42.Optional(TimestampSchema),
  endedAt: Type42.Optional(TimestampSchema),
  toolUseCount: Type42.Optional(Type42.Integer({ minimum: 0 })),
  lastToolName: Type42.Optional(Type42.String()),
  progressSummary: Type42.Optional(Type42.String()),
  terminalSummary: Type42.Optional(Type42.String()),
  error: Type42.Optional(Type42.String()),
  /** Bounded task input. Returned by tasks.get; omitted from list/event summaries. */
  prompt: Type42.Optional(Type42.String())
});
var TasksListParamsSchema = closedObject({
  status: Type42.Optional(Type42.Union([TaskLedgerStatusSchema, Type42.Array(TaskLedgerStatusSchema)])),
  agentId: Type42.Optional(NonEmptyString),
  sessionKey: Type42.Optional(NonEmptyString),
  limit: Type42.Optional(Type42.Integer({ minimum: 1, maximum: 500 })),
  cursor: Type42.Optional(Type42.String())
});
var TasksListResultSchema = closedObject({
  tasks: Type42.Array(TaskSummarySchema),
  nextCursor: Type42.Optional(Type42.String())
});
var TasksGetParamsSchema = closedObject({
  taskId: NonEmptyString
});
var TasksGetResultSchema = closedObject({
  task: TaskSummarySchema
});
var TasksCancelParamsSchema = closedObject({
  taskId: NonEmptyString,
  reason: Type42.Optional(Type42.String())
});
var TasksCancelResultSchema = closedObject({
  found: Type42.Boolean(),
  cancelled: Type42.Boolean(),
  reason: Type42.Optional(Type42.String()),
  task: Type42.Optional(TaskSummarySchema)
});

// packages/gateway-protocol/src/schema/terminal.ts
import { Type as Type43 } from "typebox";

// packages/gateway-protocol/src/schema/terminal-constants.ts
var MAX_TERMINAL_UPLOAD_BYTES = 16 * 1024 * 1024;
var MAX_TERMINAL_UPLOAD_BASE64_LENGTH = Math.ceil(MAX_TERMINAL_UPLOAD_BYTES / 3) * 4;
var MAX_TERMINAL_UPLOAD_NAME_LENGTH = 255;

// packages/gateway-protocol/src/schema/terminal.ts
var TerminalDimension = Type43.Integer({ minimum: 1, maximum: 2e3 });
var TerminalOpenParamsSchema = closedObject({
  // Optional agent selector; defaults to the gateway's default agent. The
  // session starts in that agent's workspace and inherits its isolation.
  agentId: Type43.Optional(NonEmptyString),
  catalog: Type43.Optional(SessionCatalogLocatorSchema),
  cols: TerminalDimension,
  rows: TerminalDimension
});
var TerminalOpenResultSchema = closedObject({
  sessionId: NonEmptyString,
  agentId: NonEmptyString,
  shell: NonEmptyString,
  cwd: NonEmptyString,
  // True when the shell runs inside the agent's sandbox and cannot escape the
  // workspace; false for a host shell that can navigate the whole filesystem.
  confined: Type43.Boolean(),
  title: Type43.Optional(NonEmptyString)
});
var TerminalInputParamsSchema = closedObject({
  sessionId: NonEmptyString,
  // Raw terminal input (already-encoded escape sequences from the emulator).
  data: Type43.String()
});
var TerminalUploadParamsSchema = closedObject({
  sessionId: NonEmptyString,
  name: Type43.String({ minLength: 1, maxLength: MAX_TERMINAL_UPLOAD_NAME_LENGTH }),
  contentBase64: Type43.String({ maxLength: MAX_TERMINAL_UPLOAD_BASE64_LENGTH })
});
var TerminalUploadResultSchema = closedObject({
  path: NonEmptyString,
  size: Type43.Integer({ minimum: 0, maximum: MAX_TERMINAL_UPLOAD_BYTES })
});
var TerminalResizeParamsSchema = closedObject({
  sessionId: NonEmptyString,
  cols: TerminalDimension,
  rows: TerminalDimension
});
var TerminalCloseParamsSchema = closedObject({ sessionId: NonEmptyString });
var TerminalAttachParamsSchema = closedObject({ sessionId: NonEmptyString });
var TerminalAttachResultSchema = closedObject({
  sessionId: NonEmptyString,
  agentId: NonEmptyString,
  shell: NonEmptyString,
  cwd: NonEmptyString,
  confined: Type43.Boolean(),
  // Recent raw output from the server's bounded ring buffer, replayed into
  // the client emulator before live terminal.data resumes. Not a true screen
  // snapshot: after truncation it can start mid-escape-sequence; emulators
  // recover on the next full repaint (prompt, clear, resize redraw).
  buffer: Type43.String(),
  // Gateways include this cumulative UTF-16 snapshot offset when the client
  // advertises terminal-offset-seq. Optional across protocol-4 version skew.
  seq: Type43.Optional(Type43.Integer({ minimum: 0 }))
});
var TerminalSessionInfoSchema = closedObject({
  sessionId: NonEmptyString,
  agentId: NonEmptyString,
  shell: NonEmptyString,
  cwd: NonEmptyString,
  confined: Type43.Boolean(),
  /** False while the session is detached (no connection owns its stream). */
  attached: Type43.Boolean(),
  /** Connection-owned session, or the trusted agent session key that owns it. */
  owner: Type43.Optional(Type43.Union([Type43.Literal("conn"), Type43.String({ pattern: "^agent:.+" })])),
  createdAtMs: Type43.Integer({ minimum: 0 })
});
var TerminalListResultSchema = closedObject({
  sessions: Type43.Array(TerminalSessionInfoSchema)
});
var TerminalTextParamsSchema = closedObject({ sessionId: NonEmptyString });
var TerminalTextResultSchema = closedObject({ text: Type43.String() });
var TerminalAckResultSchema = closedObject({ ok: Type43.Boolean() });
var TerminalDataEventSchema = withSince(
  "2026.7",
  closedObject({
    sessionId: NonEmptyString,
    seq: Type43.Integer({ minimum: 0 }),
    data: Type43.String()
  })
);
var TerminalExitEventSchema = withSince(
  "2026.7",
  closedObject({
    sessionId: NonEmptyString,
    exitCode: Type43.Optional(Type43.Union([Type43.Integer(), Type43.Null()])),
    signal: Type43.Optional(Type43.Union([Type43.Integer(), Type43.Null()])),
    // Stable reason code so clients can distinguish process exit from a
    // server-side teardown (disconnect, idle sweep, config disable).
    reason: Type43.Optional(
      Type43.Union([
        Type43.Literal("process_exit"),
        Type43.Literal("closed"),
        Type43.Literal("disconnected"),
        // Another admin connection attached the session away; the session is
        // still alive server-side, but no longer streams to this connection.
        Type43.Literal("detached"),
        Type43.Literal("error")
      ])
    ),
    error: Type43.Optional(Type43.String())
  })
);
var TerminalEventSchema = withSince(
  "2026.7",
  Type43.Union([TerminalDataEventSchema, TerminalExitEventSchema])
);

// packages/gateway-protocol/src/schema/terminal-protocol-schemas.ts
var TerminalProtocolSchemas = {
  TerminalOpenParams: TerminalOpenParamsSchema,
  TerminalOpenResult: TerminalOpenResultSchema,
  TerminalInputParams: TerminalInputParamsSchema,
  TerminalResizeParams: TerminalResizeParamsSchema,
  TerminalCloseParams: TerminalCloseParamsSchema,
  TerminalAttachParams: TerminalAttachParamsSchema,
  TerminalAttachResult: TerminalAttachResultSchema,
  TerminalSessionInfo: TerminalSessionInfoSchema,
  TerminalListResult: TerminalListResultSchema,
  TerminalTextParams: TerminalTextParamsSchema,
  TerminalTextResult: TerminalTextResultSchema,
  TerminalUploadParams: TerminalUploadParamsSchema,
  TerminalUploadResult: TerminalUploadResultSchema,
  TerminalAckResult: TerminalAckResultSchema,
  TerminalDataEvent: TerminalDataEventSchema,
  TerminalExitEvent: TerminalExitEventSchema,
  TerminalEvent: TerminalEventSchema
};

// packages/gateway-protocol/src/schema/ui-command.ts
import { Type as Type44 } from "typebox";
var UiSplitCommandSchema = closedObject({
  kind: Type44.Literal("split"),
  direction: Type44.Union([Type44.Literal("right"), Type44.Literal("down")]),
  sessionKey: NonEmptyString
});
var UiClosePaneCommandSchema = closedObject({
  kind: Type44.Literal("close-pane"),
  sessionKey: NonEmptyString
});
var UiFocusCommandSchema = closedObject({
  kind: Type44.Literal("focus"),
  sessionKey: NonEmptyString
});
var UiSidebarCommandSchema = closedObject({
  kind: Type44.Literal("sidebar"),
  visible: Type44.Boolean()
});
var UiPanelCommandSchema = closedObject({
  kind: Type44.Literal("panel"),
  panel: Type44.Union([Type44.Literal("terminal"), Type44.Literal("browser")]),
  open: Type44.Boolean(),
  dock: Type44.Optional(Type44.Union([Type44.Literal("bottom"), Type44.Literal("right")])),
  terminalSessionId: Type44.Optional(NonEmptyString)
});
var UiNavigateCommandSchema = closedObject({
  kind: Type44.Literal("navigate"),
  sessionKey: NonEmptyString
});
var UiCommandSchema = Type44.Union([
  UiSplitCommandSchema,
  UiClosePaneCommandSchema,
  UiFocusCommandSchema,
  UiSidebarCommandSchema,
  UiPanelCommandSchema,
  UiNavigateCommandSchema
]);
var UiCommandParamsSchema = closedObject({
  command: UiCommandSchema,
  sessionKey: Type44.Optional(NonEmptyString)
});
var UiCommandResultSchema = closedObject({ ok: Type44.Boolean() });

// packages/gateway-protocol/src/schema/worker-admission.ts
import { Type as Type46 } from "typebox";

// packages/gateway-protocol/src/schema/worker-protocol-primitives.ts
import { Type as Type45 } from "typebox";
var WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH = 256;
var WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH = 128;
var WORKER_PROTOCOL_MAX_PAYLOAD_BYTES = 64 * 1024;
var WorkerIdentifierSchema = Type45.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH,
  pattern: "^\\S(?:.*\\S)?$"
});
var WorkerFrameIdSchema = Type45.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH
});
var WorkerAdmissionFailureReasonSchema = Type45.Union([
  Type45.Literal("invalid-credential"),
  Type45.Literal("credential-expired"),
  Type45.Literal("environment-mismatch"),
  Type45.Literal("environment-unavailable"),
  Type45.Literal("bundle-mismatch"),
  Type45.Literal("version-mismatch"),
  Type45.Literal("session-mismatch"),
  Type45.Literal("placement-mismatch"),
  Type45.Literal("owner-epoch-mismatch"),
  Type45.Literal("rpc-set-mismatch"),
  Type45.Literal("protocol-features-mismatch")
]);
var WorkerProtocolCloseReasonSchema = Type45.Union([
  WorkerAdmissionFailureReasonSchema,
  Type45.Literal("invalid-handshake"),
  Type45.Literal("protocol-mismatch"),
  Type45.Literal("gateway-unavailable"),
  Type45.Literal("invalid-frame"),
  Type45.Literal("slow-consumer"),
  Type45.Literal("method-not-allowed"),
  Type45.Literal("invalid-heartbeat"),
  Type45.Literal("credential-replaced"),
  Type45.Literal("gateway-shutdown")
]);
var WorkerErrorCodeSchema = Type45.Union([
  Type45.Literal("INVALID_REQUEST"),
  Type45.Literal("UNAVAILABLE")
]);
var WorkerErrorDetailsSchema = closedObject({ reason: WorkerProtocolCloseReasonSchema });
var WorkerErrorShapeSchema = closedObject({
  code: WorkerErrorCodeSchema,
  message: Type45.String({ minLength: 1, maxLength: 256 }),
  details: WorkerErrorDetailsSchema,
  retryable: Type45.Optional(Type45.Boolean()),
  retryAfterMs: Type45.Optional(Type45.Integer({ minimum: 0 }))
});
var WorkerErrorResponseFrameSchema = closedObject({
  type: Type45.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type45.Literal(false),
  error: WorkerErrorShapeSchema
});
var WorkerTranscriptUsageSchema = closedObject({
  input: Type45.Number({ minimum: 0 }),
  output: Type45.Number({ minimum: 0 }),
  cacheRead: Type45.Number({ minimum: 0 }),
  cacheWrite: Type45.Number({ minimum: 0 }),
  contextUsage: Type45.Optional(
    Type45.Union([
      closedObject({
        state: Type45.Literal("available"),
        promptTokens: Type45.Number({ minimum: 0 }),
        totalTokens: Type45.Number({ minimum: 0 })
      }),
      closedObject({ state: Type45.Literal("unavailable") })
    ])
  ),
  totalTokens: Type45.Number({ minimum: 0 }),
  cost: closedObject({
    input: Type45.Number({ minimum: 0 }),
    output: Type45.Number({ minimum: 0 }),
    cacheRead: Type45.Number({ minimum: 0 }),
    cacheWrite: Type45.Number({ minimum: 0 }),
    total: Type45.Number({ minimum: 0 }),
    totalOrigin: Type45.Optional(Type45.Literal("provider-billed"))
  })
});
var WorkerTranscriptAssistantDiagnosticSchema = closedObject({
  type: WorkerIdentifierSchema,
  timestamp: Type45.Integer({ minimum: 0 }),
  error: Type45.Optional(
    closedObject({
      name: Type45.Optional(Type45.String({ maxLength: 256 })),
      message: Type45.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
      stack: Type45.Optional(Type45.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
      code: Type45.Optional(Type45.Union([Type45.String({ maxLength: 256 }), Type45.Number()]))
    })
  ),
  details: Type45.Optional(
    Type45.Record(Type45.String({ minLength: 1, maxLength: 256 }), Type45.Unknown())
  )
});
var LiveTextSchema = Type45.String({
  maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
});
var LiveIntegerSchema = Type45.Integer({
  minimum: 0,
  maximum: Number.MAX_SAFE_INTEGER
});
var LiveSequenceSchema = Type45.Integer({
  minimum: 1,
  maximum: Number.MAX_SAFE_INTEGER
});

// packages/gateway-protocol/src/schema/worker-admission.ts
var WORKER_RPC_SET_VERSION = 1;
var WORKER_HEARTBEAT_INTERVAL_MS = 15e3;
var WORKER_PROTOCOL_METHODS = [
  "worker.heartbeat",
  "worker.transcript.commit",
  "worker.live-event"
];
var WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE = "worker-transcript-commit-v1";
var WORKER_LIVE_EVENT_PROTOCOL_FEATURE = "worker-live-event-v1";
var WORKER_PROTOCOL_FEATURES = [
  "worker-heartbeat-v1",
  WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE,
  WORKER_LIVE_EVENT_PROTOCOL_FEATURE,
  "worker-inference-v1"
];
var WORKER_PROTOCOL_MAX_METHOD_LENGTH = 64;
var WORKER_PROTOCOL_MAX_FEATURES = 64;
var WORKER_PROTOCOL_MAX_FEATURE_LENGTH = 128;
var WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES = 64;
var WORKER_TRANSCRIPT_MAX_CONTENT_PARTS = 128;
var WORKER_TRANSCRIPT_MAX_JSON_DEPTH = 32;
var WorkerCredentialSchema = Type46.String({ minLength: 16, maxLength: 256 });
var WorkerProtocolFeatureSchema = Type46.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_FEATURE_LENGTH
});
var WorkerBundleHashSchema2 = Type46.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var WorkerAdmissionHandshakeSchema = withSince(
  "2026.7",
  closedObject({
    bundleHash: WorkerBundleHashSchema2,
    openclawVersion: Type46.String({ minLength: 1, maxLength: 128 }),
    protocolFeatures: Type46.Array(WorkerProtocolFeatureSchema, {
      maxItems: WORKER_PROTOCOL_MAX_FEATURES,
      uniqueItems: true
    })
  })
);
var WorkerConnectAdmissionCommonProperties = {
  environmentId: WorkerIdentifierSchema,
  credential: WorkerCredentialSchema,
  ownerEpoch: Type46.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  rpcSetVersion: Type46.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
  handshake: WorkerAdmissionHandshakeSchema
};
var WorkerConnectAdmissionSchema = Type46.Union([
  closedObject({
    ...WorkerConnectAdmissionCommonProperties,
    sessionId: Type46.Null(),
    runId: Type46.Null()
  }),
  closedObject({
    ...WorkerConnectAdmissionCommonProperties,
    sessionId: WorkerIdentifierSchema,
    runId: WorkerIdentifierSchema
  })
]);
var WorkerConnectParamsSchema = closedObject({
  minProtocol: Type46.Integer({ minimum: 1 }),
  maxProtocol: Type46.Integer({ minimum: 1 }),
  client: closedObject({
    id: Type46.Literal(GATEWAY_CLIENT_IDS.WORKER),
    version: Type46.String({ minLength: 1, maxLength: 128 }),
    platform: Type46.String({ minLength: 1, maxLength: 128 }),
    mode: Type46.Literal(GATEWAY_CLIENT_MODES.WORKER)
  }),
  role: Type46.Literal("worker"),
  admission: WorkerConnectAdmissionSchema
});
var WorkerConnectRequestFrameSchema = closedObject({
  type: Type46.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type46.Literal("connect"),
  params: WorkerConnectParamsSchema
});
var WorkerHelloOkSchema = closedObject({
  type: Type46.Literal("worker-hello-ok"),
  environmentId: WorkerIdentifierSchema,
  sessionId: Type46.Union([WorkerIdentifierSchema, Type46.Null()]),
  ownerEpoch: Type46.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  rpcSetVersion: Type46.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
  protocolFeatures: Type46.Array(WorkerProtocolFeatureSchema, {
    maxItems: WORKER_PROTOCOL_MAX_FEATURES,
    uniqueItems: true
  }),
  credentialExpiresAtMs: Type46.Integer({ minimum: 0 }),
  policy: closedObject({
    heartbeatIntervalMs: Type46.Integer({ minimum: 1 }),
    maxPayload: Type46.Integer({ minimum: 1 })
  })
});
var WorkerAdmissionSuccessResponseFrameSchema = closedObject({
  type: Type46.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type46.Literal(true),
  payload: WorkerHelloOkSchema
});
var WorkerAdmissionResponseFrameSchema = Type46.Union([
  WorkerAdmissionSuccessResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
var WorkerStatusSchema = Type46.Union([
  Type46.Literal("ready"),
  Type46.Literal("busy"),
  Type46.Literal("draining")
]);
var WorkerHeartbeatParamsSchema = closedObject({
  sentAtMs: Type46.Integer({ minimum: 0 }),
  status: WorkerStatusSchema
});
var WorkerHeartbeatResultSchema = closedObject({
  receivedAtMs: Type46.Integer({ minimum: 0 }),
  status: Type46.Literal("ok"),
  ownerEpoch: Type46.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
});
var WorkerHeartbeatRequestFrameSchema = closedObject({
  type: Type46.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type46.Literal(WORKER_PROTOCOL_METHODS[0]),
  params: WorkerHeartbeatParamsSchema
});
var WorkerHeartbeatSuccessResponseFrameSchema = closedObject({
  type: Type46.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type46.Literal(true),
  payload: WorkerHeartbeatResultSchema
});
var WorkerHeartbeatResponseFrameSchema = Type46.Union([
  WorkerHeartbeatSuccessResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
var WorkerTranscriptTextContentSchema = closedObject({
  type: Type46.Literal("text"),
  text: Type46.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
  textSignature: Type46.Optional(
    Type46.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })
  )
});
var WorkerTranscriptThinkingContentSchema = closedObject({
  type: Type46.Literal("thinking"),
  thinking: Type46.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
  thinkingSignature: Type46.Optional(
    Type46.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })
  ),
  redacted: Type46.Optional(Type46.Boolean())
});
var WorkerTranscriptImageContentSchema = closedObject({
  type: Type46.Literal("image"),
  data: Type46.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
  mimeType: Type46.String({ minLength: 1, maxLength: 256 })
});
var WorkerTranscriptToolCallSchema = closedObject({
  type: Type46.Literal("toolCall"),
  id: WorkerIdentifierSchema,
  name: WorkerIdentifierSchema,
  arguments: Type46.Record(Type46.String({ minLength: 1, maxLength: 256 }), Type46.Unknown()),
  thoughtSignature: Type46.Optional(
    Type46.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })
  ),
  executionMode: Type46.Optional(Type46.Union([Type46.Literal("sequential"), Type46.Literal("parallel")]))
});
var WorkerTranscriptUserMessageSchema = closedObject({
  role: Type46.Literal("user"),
  content: Type46.Array(
    Type46.Union([WorkerTranscriptTextContentSchema, WorkerTranscriptImageContentSchema]),
    { minItems: 1, maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
  ),
  timestamp: Type46.Integer({ minimum: 0 })
});
var WorkerTranscriptAssistantMessageSchema = closedObject({
  role: Type46.Literal("assistant"),
  content: Type46.Array(
    Type46.Union([
      WorkerTranscriptTextContentSchema,
      WorkerTranscriptThinkingContentSchema,
      WorkerTranscriptToolCallSchema
    ]),
    { maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
  ),
  api: WorkerIdentifierSchema,
  provider: WorkerIdentifierSchema,
  model: WorkerIdentifierSchema,
  responseModel: Type46.Optional(WorkerIdentifierSchema),
  responseId: Type46.Optional(WorkerIdentifierSchema),
  diagnostics: Type46.Optional(
    Type46.Array(WorkerTranscriptAssistantDiagnosticSchema, {
      maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
    })
  ),
  usage: WorkerTranscriptUsageSchema,
  stopReason: Type46.Union([
    Type46.Literal("stop"),
    Type46.Literal("length"),
    Type46.Literal("toolUse"),
    Type46.Literal("error"),
    Type46.Literal("aborted")
  ]),
  errorMessage: Type46.Optional(Type46.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
  errorCode: Type46.Optional(Type46.String({ maxLength: 256 })),
  errorType: Type46.Optional(Type46.String({ maxLength: 256 })),
  errorBody: Type46.Optional(Type46.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
  timestamp: Type46.Integer({ minimum: 0 })
});
var WorkerTranscriptToolResultMessageSchema = closedObject({
  role: Type46.Literal("toolResult"),
  toolCallId: WorkerIdentifierSchema,
  toolName: WorkerIdentifierSchema,
  content: Type46.Array(
    Type46.Union([WorkerTranscriptTextContentSchema, WorkerTranscriptImageContentSchema]),
    { maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
  ),
  details: Type46.Optional(Type46.Unknown()),
  isError: Type46.Boolean(),
  timestamp: Type46.Integer({ minimum: 0 })
});
var WorkerTranscriptMessageSchema = Type46.Union([
  WorkerTranscriptUserMessageSchema,
  WorkerTranscriptAssistantMessageSchema,
  WorkerTranscriptToolResultMessageSchema
]);
var WorkerTranscriptCommitParamsSchema = closedObject({
  runEpoch: Type46.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  seq: Type46.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
  baseLeafId: Type46.Union([WorkerIdentifierSchema, Type46.Null()]),
  messages: Type46.Array(WorkerTranscriptMessageSchema, {
    minItems: 1,
    maxItems: WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES
  })
});
var WorkerTranscriptCommitResultSchema = closedObject({
  entryIds: Type46.Array(WorkerIdentifierSchema, {
    minItems: 1,
    maxItems: WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES
  }),
  newLeafId: WorkerIdentifierSchema
});
var WorkerTranscriptCommitErrorReasonSchema = Type46.Union([
  Type46.Literal("stale-base-leaf"),
  Type46.Literal("epoch-mismatch"),
  Type46.Literal("invalid-batch"),
  Type46.Literal("session-not-attached")
]);
var WorkerTranscriptCommitErrorShapeSchema = closedObject({
  code: Type46.Literal("INVALID_REQUEST"),
  message: Type46.String({ minLength: 1, maxLength: 256 }),
  details: closedObject({ reason: WorkerTranscriptCommitErrorReasonSchema })
});
var WorkerTranscriptCommitRequestFrameSchema = closedObject({
  type: Type46.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type46.Literal(WORKER_PROTOCOL_METHODS[1]),
  params: WorkerTranscriptCommitParamsSchema
});
var WorkerTranscriptCommitSuccessResponseFrameSchema = closedObject({
  type: Type46.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type46.Literal(true),
  payload: WorkerTranscriptCommitResultSchema
});
var WorkerTranscriptCommitErrorResponseFrameSchema = closedObject({
  type: Type46.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type46.Literal(false),
  error: WorkerTranscriptCommitErrorShapeSchema
});
var WorkerTranscriptCommitResponseFrameSchema = Type46.Union([
  WorkerTranscriptCommitSuccessResponseFrameSchema,
  WorkerTranscriptCommitErrorResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
function workerLiveObject(properties) {
  return closedObject(properties);
}
var OptionalLiveTextSchema = Type46.Optional(LiveTextSchema);
var OptionalLiveIntegerSchema = Type46.Optional(LiveIntegerSchema);
var LiveIdentifierSchema = Type46.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES,
  pattern: "^\\S(?:.*\\S)?$"
});
var WorkerLiveAssistantPayloadSchema = workerLiveObject({
  text: LiveTextSchema,
  delta: LiveTextSchema,
  replace: Type46.Optional(Type46.Literal(true)),
  mediaUrls: Type46.Optional(
    Type46.Array(LiveIdentifierSchema, {
      maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
    })
  ),
  phase: Type46.Optional(Type46.Union([Type46.Literal("commentary"), Type46.Literal("final_answer")])),
  itemId: Type46.Optional(WorkerIdentifierSchema)
});
var WorkerLiveThinkingPayloadSchema = workerLiveObject({
  text: LiveTextSchema,
  delta: LiveTextSchema
});
var WorkerLiveToolCommonProperties = {
  name: WorkerIdentifierSchema,
  toolCallId: WorkerIdentifierSchema,
  hideFromChannelProgress: Type46.Optional(Type46.Literal(true))
};
var WorkerLiveToolPayloadSchema = Type46.Union([
  workerLiveObject({
    ...WorkerLiveToolCommonProperties,
    phase: Type46.Literal("start"),
    args: Type46.Unknown()
  }),
  workerLiveObject({
    ...WorkerLiveToolCommonProperties,
    phase: Type46.Literal("update"),
    partialResult: Type46.Unknown()
  }),
  workerLiveObject({
    ...WorkerLiveToolCommonProperties,
    phase: Type46.Literal("result"),
    meta: OptionalLiveTextSchema,
    isError: Type46.Boolean(),
    result: Type46.Unknown(),
    toolErrorSummary: OptionalLiveTextSchema
  })
]);
var WorkerLiveApprovalCommonProperties = {
  kind: Type46.Union([Type46.Literal("exec"), Type46.Literal("plugin"), Type46.Literal("unknown")]),
  title: LiveTextSchema,
  itemId: Type46.Optional(WorkerIdentifierSchema),
  toolCallId: Type46.Optional(WorkerIdentifierSchema),
  approvalId: Type46.Optional(WorkerIdentifierSchema),
  approvalSlug: Type46.Optional(WorkerIdentifierSchema),
  command: OptionalLiveTextSchema,
  host: OptionalLiveTextSchema,
  reason: OptionalLiveTextSchema,
  scope: Type46.Optional(Type46.Union([Type46.Literal("turn"), Type46.Literal("session")])),
  message: OptionalLiveTextSchema
};
var WorkerLiveApprovalPayloadSchema = Type46.Union([
  workerLiveObject({
    ...WorkerLiveApprovalCommonProperties,
    phase: Type46.Literal("requested"),
    status: Type46.Union([Type46.Literal("pending"), Type46.Literal("unavailable")])
  }),
  workerLiveObject({
    ...WorkerLiveApprovalCommonProperties,
    phase: Type46.Literal("resolved"),
    status: Type46.Union([Type46.Literal("approved"), Type46.Literal("denied"), Type46.Literal("failed")])
  })
]);
var WorkerLiveLifecycleStartPayloadSchema = workerLiveObject({
  phase: Type46.Literal("start"),
  startedAt: LiveIntegerSchema
});
var WorkerLiveFallbackReasonSchema = Type46.Union([
  Type46.Literal("auth"),
  Type46.Literal("auth_permanent"),
  Type46.Literal("format"),
  Type46.Literal("rate_limit"),
  Type46.Literal("overloaded"),
  Type46.Literal("billing"),
  Type46.Literal("server_error"),
  Type46.Literal("timeout"),
  Type46.Literal("context_overflow"),
  Type46.Literal("model_not_found"),
  Type46.Literal("session_expired"),
  Type46.Literal("empty_response"),
  Type46.Literal("no_error_details"),
  Type46.Literal("unclassified"),
  Type46.Literal("unknown")
]);
var WorkerLiveFallbackAttemptSchema = workerLiveObject({
  provider: LiveIdentifierSchema,
  model: LiveIdentifierSchema,
  error: LiveTextSchema,
  reason: Type46.Optional(WorkerLiveFallbackReasonSchema),
  authMode: Type46.Optional(LiveIdentifierSchema),
  status: OptionalLiveIntegerSchema,
  code: Type46.Optional(Type46.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }))
});
var WorkerLiveFallbackCommonProperties = {
  selectedProvider: LiveIdentifierSchema,
  selectedModel: LiveIdentifierSchema,
  activeProvider: LiveIdentifierSchema,
  activeModel: LiveIdentifierSchema
};
var WorkerLiveLifecycleFallbackPayloadSchema = workerLiveObject({
  ...WorkerLiveFallbackCommonProperties,
  phase: Type46.Literal("fallback"),
  reasonSummary: LiveTextSchema,
  attemptSummaries: Type46.Array(LiveTextSchema, {
    maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
  }),
  attempts: Type46.Array(WorkerLiveFallbackAttemptSchema, {
    maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
  })
});
var WorkerLiveLifecycleFallbackClearedPayloadSchema = workerLiveObject({
  ...WorkerLiveFallbackCommonProperties,
  phase: Type46.Literal("fallback_cleared"),
  previousActiveModel: Type46.Optional(LiveIdentifierSchema)
});
var WorkerLiveLifecycleFallbackStepPayloadSchema = workerLiveObject({
  phase: Type46.Literal("fallback_step"),
  fallbackStepType: Type46.Literal("fallback_step"),
  fallbackStepFromModel: LiveIdentifierSchema,
  fallbackStepToModel: Type46.Optional(LiveIdentifierSchema),
  fallbackStepFromFailureReason: Type46.Optional(WorkerLiveFallbackReasonSchema),
  fallbackStepFromFailureDetail: OptionalLiveTextSchema,
  fallbackStepChainPosition: OptionalLiveIntegerSchema,
  fallbackStepFinalOutcome: Type46.Union([
    Type46.Literal("next_fallback"),
    Type46.Literal("succeeded"),
    Type46.Literal("chain_exhausted")
  ])
});
var WorkerLiveLifecycleTerminalCommonProperties = {
  startedAt: OptionalLiveIntegerSchema,
  endedAt: LiveIntegerSchema,
  stopReason: Type46.Optional(WorkerIdentifierSchema),
  yielded: Type46.Optional(Type46.Literal(true)),
  timeoutPhase: Type46.Optional(
    Type46.Union([
      Type46.Literal("queue"),
      Type46.Literal("preflight"),
      Type46.Literal("provider"),
      Type46.Literal("post_turn"),
      Type46.Literal("gateway_draining")
    ])
  ),
  providerStarted: Type46.Optional(Type46.Boolean()),
  aborted: Type46.Optional(Type46.Boolean()),
  toolErrorSummary: OptionalLiveTextSchema,
  livenessState: Type46.Optional(
    Type46.Union([
      Type46.Literal("working"),
      Type46.Literal("paused"),
      Type46.Literal("blocked"),
      Type46.Literal("abandoned")
    ])
  ),
  replayInvalid: Type46.Optional(Type46.Literal(true))
};
var WorkerLiveLifecycleTerminalPayloadSchema = Type46.Union([
  workerLiveObject({
    ...WorkerLiveLifecycleTerminalCommonProperties,
    phase: Type46.Literal("finishing"),
    error: OptionalLiveTextSchema
  }),
  workerLiveObject({
    ...WorkerLiveLifecycleTerminalCommonProperties,
    phase: Type46.Literal("end")
  }),
  workerLiveObject({
    ...WorkerLiveLifecycleTerminalCommonProperties,
    phase: Type46.Literal("error"),
    error: LiveTextSchema,
    fallbackExhaustedFailure: Type46.Optional(Type46.Literal(true))
  })
]);
var WorkerLiveLifecyclePayloadSchema = Type46.Union([
  WorkerLiveLifecycleStartPayloadSchema,
  WorkerLiveLifecycleFallbackPayloadSchema,
  WorkerLiveLifecycleFallbackClearedPayloadSchema,
  WorkerLiveLifecycleFallbackStepPayloadSchema,
  WorkerLiveLifecycleTerminalPayloadSchema
]);
var WorkerLiveEventSchema = Type46.Union([
  workerLiveObject({ kind: Type46.Literal("assistant"), payload: WorkerLiveAssistantPayloadSchema }),
  workerLiveObject({ kind: Type46.Literal("thinking"), payload: WorkerLiveThinkingPayloadSchema }),
  workerLiveObject({ kind: Type46.Literal("tool"), payload: WorkerLiveToolPayloadSchema }),
  workerLiveObject({ kind: Type46.Literal("approval"), payload: WorkerLiveApprovalPayloadSchema }),
  workerLiveObject({ kind: Type46.Literal("lifecycle"), payload: WorkerLiveLifecyclePayloadSchema })
]);
var WorkerLiveEventParamsSchema = workerLiveObject({
  runEpoch: LiveIntegerSchema,
  lastAckedSeq: LiveIntegerSchema,
  seq: LiveSequenceSchema,
  runId: WorkerIdentifierSchema,
  event: WorkerLiveEventSchema
});
var WorkerLiveEventResultSchema = workerLiveObject({
  ackedSeq: LiveIntegerSchema
});
var WorkerLiveEventErrorDetailsSchema = Type46.Union([
  workerLiveObject({
    reason: Type46.Union([
      Type46.Literal("epoch-mismatch"),
      Type46.Literal("session-not-attached"),
      Type46.Literal("invalid-event"),
      Type46.Literal("capacity-exceeded")
    ])
  }),
  workerLiveObject({
    reason: Type46.Literal("resync-required"),
    ackedSeq: LiveIntegerSchema,
    expectedSeq: LiveSequenceSchema
  })
]);
var WorkerLiveEventErrorShapeSchema = workerLiveObject({
  code: Type46.Literal("INVALID_REQUEST"),
  message: Type46.String({ minLength: 1, maxLength: 256 }),
  details: WorkerLiveEventErrorDetailsSchema
});
var WorkerLiveEventRequestFrameSchema = workerLiveObject({
  type: Type46.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type46.Literal(WORKER_PROTOCOL_METHODS[2]),
  params: WorkerLiveEventParamsSchema
});
var WorkerLiveEventSuccessResponseFrameSchema = workerLiveObject({
  type: Type46.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type46.Literal(true),
  payload: WorkerLiveEventResultSchema
});
var WorkerLiveEventErrorResponseFrameSchema = workerLiveObject({
  type: Type46.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type46.Literal(false),
  error: WorkerLiveEventErrorShapeSchema
});
var WorkerLiveEventResponseFrameSchema = Type46.Union([
  WorkerLiveEventSuccessResponseFrameSchema,
  WorkerLiveEventErrorResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);

// packages/gateway-protocol/src/schema/worktrees.ts
import { Type as Type47 } from "typebox";
var WorktreeNameSchema = Type47.String({ pattern: "^[a-z0-9][a-z0-9-]{0,63}$" });
var WorktreeRecordSchema = closedObject({
  id: NonEmptyString,
  name: WorktreeNameSchema,
  repoFingerprint: Type47.String({ pattern: "^[a-f0-9]{16}$" }),
  repoRoot: NonEmptyString,
  path: NonEmptyString,
  branch: NonEmptyString,
  baseRef: NonEmptyString,
  ownerKind: Type47.String({ enum: ["manual", "workboard", "session"] }),
  ownerId: Type47.Optional(NonEmptyString),
  snapshotRef: Type47.Optional(NonEmptyString),
  createdAt: Type47.Integer({ minimum: 0 }),
  lastActiveAt: Type47.Integer({ minimum: 0 }),
  removedAt: Type47.Optional(Type47.Integer({ minimum: 0 }))
});
var WorktreesListParamsSchema = closedObject({});
var WorktreesListResultSchema = closedObject({
  worktrees: Type47.Array(WorktreeRecordSchema)
});
var WorktreesCreateParamsSchema = closedObject({
  repoRoot: NonEmptyString,
  name: Type47.Optional(WorktreeNameSchema),
  baseRef: Type47.Optional(NonEmptyString)
});
var WorktreesRemoveParamsSchema = closedObject({
  id: NonEmptyString,
  force: Type47.Optional(Type47.Boolean())
});
var WorktreesRemoveResultSchema = closedObject({
  removed: Type47.Boolean(),
  snapshotRef: Type47.Optional(NonEmptyString),
  /** Why the pre-removal snapshot failed; present only on forced removals that continued without one. */
  snapshotError: Type47.Optional(NonEmptyString)
});
var WorktreesBranchesParamsSchema = closedObject({ repoRoot: NonEmptyString });
var WorktreeBranchSchema = closedObject({
  name: NonEmptyString,
  kind: Type47.Union([Type47.Literal("local"), Type47.Literal("remote")])
});
var WorktreesBranchesResultSchema = closedObject({
  branches: Type47.Array(WorktreeBranchSchema),
  defaultBranch: Type47.Optional(NonEmptyString),
  headBranch: Type47.Optional(NonEmptyString)
});
var WorktreesRestoreParamsSchema = closedObject({ id: NonEmptyString });
var WorktreesGcParamsSchema = closedObject({});
var WorktreesGcResultSchema = closedObject({
  removed: Type47.Array(NonEmptyString),
  orphansDeleted: Type47.Integer({ minimum: 0 }),
  snapshotsPruned: Type47.Integer({ minimum: 0 })
});

// packages/gateway-protocol/src/version.ts
var PROTOCOL_VERSION = 4;
var MIN_CLIENT_PROTOCOL_VERSION = 4;
var MIN_NODE_PROTOCOL_VERSION = 3;
var MIN_PROBE_PROTOCOL_VERSION = 3;

// packages/gateway-protocol/src/schema/protocol-schemas.ts
var ProtocolSchemas = {
  BoardTab: BoardTabSchema,
  BoardWidget: BoardWidgetSchema,
  BoardWidgetDeclared: BoardWidgetDeclaredSchema,
  BoardSnapshot: BoardSnapshotSchema,
  BoardTabCreateOp: BoardTabCreateOpSchema,
  BoardTabUpdateOp: BoardTabUpdateOpSchema,
  BoardTabDeleteOp: BoardTabDeleteOpSchema,
  BoardTabsReorderOp: BoardTabsReorderOpSchema,
  BoardWidgetMoveOp: BoardWidgetMoveOpSchema,
  BoardWidgetResizeOp: BoardWidgetResizeOpSchema,
  BoardWidgetRemoveOp: BoardWidgetRemoveOpSchema,
  BoardOp: BoardOpSchema,
  BoardMcpAppDescriptor: BoardMcpAppDescriptorSchema,
  BoardWidgetHtmlContent: BoardWidgetHtmlContentSchema,
  BoardWidgetMcpAppContent: BoardWidgetMcpAppContentSchema,
  BoardWidgetMcpAppPutContent: BoardWidgetMcpAppPutContentSchema,
  BoardCanvasDocumentSource: BoardCanvasDocumentSourceSchema,
  BoardWidgetContent: BoardWidgetContentSchema,
  BoardWidgetPutContent: BoardWidgetPutContentSchema,
  BoardGetParams: BoardGetParamsSchema,
  BoardUpdateParams: BoardUpdateParamsSchema,
  BoardWidgetPutParams: BoardWidgetPutParamsSchema,
  BoardWidgetGrantParams: BoardWidgetGrantParamsSchema,
  BoardWidgetAppViewParams: BoardWidgetAppViewParamsSchema,
  BoardWidgetAppViewResult: BoardWidgetAppViewResultSchema,
  BoardEventParams: BoardEventParamsSchema,
  BoardPromptAuthorizeParams: BoardPromptAuthorizeParamsSchema,
  BoardDataReadParams: BoardDataReadParamsSchema,
  BoardActionParams: BoardActionParamsSchema,
  BoardChangedEvent: BoardChangedEventSchema,
  BoardFocusTabCommand: BoardFocusTabCommandSchema,
  BoardSetChatDockCommand: BoardSetChatDockCommandSchema,
  BoardCommand: BoardCommandSchema,
  BoardCommandEvent: BoardCommandEventSchema,
  AuthProbeStatus: AuthProbeStatusSchema,
  // Handshake, transport frames, state snapshots, and shared error envelopes.
  ConnectParams: ConnectParamsSchema,
  WorkerAdmissionHandshake: WorkerAdmissionHandshakeSchema,
  HelloOk: HelloOkSchema,
  RequestFrame: RequestFrameSchema,
  ResponseFrame: ResponseFrameSchema,
  EventFrame: EventFrameSchema,
  GatewayFrame: GatewayFrameSchema,
  PresenceEntry: PresenceEntrySchema,
  StateVersion: StateVersionSchema,
  Snapshot: SnapshotSchema,
  ErrorShape: ErrorShapeSchema,
  MissingScopeErrorDetails: MissingScopeErrorDetailsSchema,
  McpAppViewExpiredErrorDetails: McpAppViewExpiredErrorDetailsSchema,
  GatewayErrorDetails: GatewayErrorDetailsSchema,
  GatewaySuspendTaskBlocker: GatewaySuspendTaskBlockerSchema,
  GatewaySuspendBlocker: GatewaySuspendBlockerSchema,
  GatewaySuspendPrepareParams: GatewaySuspendPrepareParamsSchema,
  GatewaySuspendPrepareBusyResult: GatewaySuspendPrepareBusyResultSchema,
  GatewaySuspendPrepareReadyResult: GatewaySuspendPrepareReadyResultSchema,
  GatewaySuspendPrepareResult: GatewaySuspendPrepareResultSchema,
  GatewaySuspendStatusParams: GatewaySuspendStatusParamsSchema,
  GatewaySuspendStatusRunningResult: GatewaySuspendStatusRunningResultSchema,
  GatewaySuspendStatusReadyResult: GatewaySuspendStatusReadyResultSchema,
  GatewaySuspendStatusResult: GatewaySuspendStatusResultSchema,
  GatewaySuspendResumeParams: GatewaySuspendResumeParamsSchema,
  GatewaySuspendResumeResult: GatewaySuspendResumeResultSchema,
  // Environment and agent-facing control RPC payloads.
  EnvironmentStatus: EnvironmentStatusSchema,
  WorkerEnvironmentState: WorkerEnvironmentStateSchema,
  WorkerTunnelStatus: WorkerTunnelStatusSchema,
  WorkerEnvironmentMetadata: WorkerEnvironmentMetadataSchema,
  EnvironmentSummary: EnvironmentSummarySchema,
  EnvironmentsCreateParams: EnvironmentsCreateParamsSchema,
  EnvironmentsCreateResult: EnvironmentsCreateResultSchema,
  EnvironmentsDestroyParams: EnvironmentsDestroyParamsSchema,
  EnvironmentsDestroyResult: EnvironmentsDestroyResultSchema,
  EnvironmentsListParams: EnvironmentsListParamsSchema,
  EnvironmentsListResult: EnvironmentsListResultSchema,
  EnvironmentsStatusParams: EnvironmentsStatusParamsSchema,
  EnvironmentsStatusResult: EnvironmentsStatusResultSchema,
  SystemInfoParams: SystemInfoParamsSchema,
  SystemInfoResult: SystemInfoResultSchema,
  AgentEvent: AgentEventSchema,
  ConversationSendParams: ConversationSendParamsSchema,
  ConversationSendResult: ConversationSendResultSchema,
  ConversationListItem: ConversationListItemSchema,
  ConversationListParams: ConversationListParamsSchema,
  ConversationListResult: ConversationListResultSchema,
  ConversationTurnCancelParams: ConversationTurnCancelParamsSchema,
  ConversationTurnCancelResult: ConversationTurnCancelResultSchema,
  ConversationTurnParams: ConversationTurnParamsSchema,
  ConversationTurnReply: ConversationTurnReplySchema,
  ConversationTurnResult: ConversationTurnResultSchema,
  MessageActionParams: MessageActionParamsSchema,
  SendParams: SendParamsSchema,
  PollParams: PollParamsSchema,
  AgentParams: AgentParamsSchema,
  AgentIdentityParams: AgentIdentityParamsSchema,
  AgentIdentityResult: AgentIdentityResultSchema,
  AgentWaitParams: AgentWaitParamsSchema,
  WakeParams: WakeParamsSchema,
  WorktreeRecord: WorktreeRecordSchema,
  WorktreesListParams: WorktreesListParamsSchema,
  WorktreesListResult: WorktreesListResultSchema,
  WorktreesCreateParams: WorktreesCreateParamsSchema,
  WorktreesRemoveParams: WorktreesRemoveParamsSchema,
  WorktreesRemoveResult: WorktreesRemoveResultSchema,
  WorktreesRestoreParams: WorktreesRestoreParamsSchema,
  WorktreesGcParams: WorktreesGcParamsSchema,
  WorktreesGcResult: WorktreesGcResultSchema,
  WorktreeBranch: WorktreeBranchSchema,
  WorktreesBranchesParams: WorktreesBranchesParamsSchema,
  WorktreesBranchesResult: WorktreesBranchesResultSchema,
  FsDirEntry: FsDirEntrySchema,
  FsListDirParams: FsListDirParamsSchema,
  FsListDirResult: FsListDirResultSchema,
  // Node pairing, invocation, presence, and pending-queue payloads.
  NodePairListParams: NodePairListParamsSchema,
  NodePairApproveParams: NodePairApproveParamsSchema,
  NodePairRejectParams: NodePairRejectParamsSchema,
  NodePairRemoveParams: NodePairRemoveParamsSchema,
  NodeRenameParams: NodeRenameParamsSchema,
  NodeListParams: NodeListParamsSchema,
  NodePluginToolDescriptor: NodePluginToolDescriptorSchema,
  NodePluginToolsUpdateParams: NodePluginToolsUpdateParamsSchema,
  NodeSkillDescriptor: NodeSkillDescriptorSchema,
  NodeSkillsUpdateParams: NodeSkillsUpdateParamsSchema,
  NodePendingAckParams: NodePendingAckParamsSchema,
  NodeDescribeParams: NodeDescribeParamsSchema,
  ...NodeInvokeProtocolSchemas,
  NodeEventParams: NodeEventParamsSchema,
  NodeEventResult: NodeEventResultSchema,
  NodePresenceAlivePayload: NodePresenceAlivePayloadSchema,
  ...NodePresenceProtocolSchemas,
  NodePendingDrainParams: NodePendingDrainParamsSchema,
  NodePendingDrainResult: NodePendingDrainResultSchema,
  NodePendingEnqueueParams: NodePendingEnqueueParamsSchema,
  NodePendingEnqueueResult: NodePendingEnqueueResultSchema,
  // Push and secret-resolution payloads used by mobile/control integrations.
  PushTestParams: PushTestParamsSchema,
  PushTestResult: PushTestResultSchema,
  UiSplitCommand: UiSplitCommandSchema,
  UiClosePaneCommand: UiClosePaneCommandSchema,
  UiFocusCommand: UiFocusCommandSchema,
  UiSidebarCommand: UiSidebarCommandSchema,
  UiPanelCommand: UiPanelCommandSchema,
  UiNavigateCommand: UiNavigateCommandSchema,
  UiCommand: UiCommandSchema,
  UiCommandParams: UiCommandParamsSchema,
  UiCommandResult: UiCommandResultSchema,
  SecretsReloadParams: SecretsReloadParamsSchema,
  SecretsResolveParams: SecretsResolveParamsSchema,
  SecretsResolveAssignment: SecretsResolveAssignmentSchema,
  SecretsResolveResult: SecretsResolveResultSchema,
  // Session lifecycle, message routing, compaction, and usage accounting.
  SessionsListParams: SessionsListParamsSchema,
  SessionCatalogCapabilities: SessionCatalogCapabilitiesSchema,
  SessionCatalogDescriptor: SessionCatalogDescriptorSchema,
  SessionCatalogSession: SessionCatalogSessionSchema,
  SessionCatalogHost: SessionCatalogHostSchema,
  SessionCatalog: SessionCatalogSchema,
  SessionCatalogTranscriptItem: SessionCatalogTranscriptItemSchema,
  SessionsCatalogListParams: SessionsCatalogListParamsSchema,
  SessionsCatalogListResult: SessionsCatalogListResultSchema,
  SessionsCatalogReadParams: SessionsCatalogReadParamsSchema,
  SessionsCatalogReadResult: SessionsCatalogReadResultSchema,
  SessionsCatalogContinueParams: SessionsCatalogContinueParamsSchema,
  SessionsCatalogContinueResult: SessionsCatalogContinueResultSchema,
  SessionsCatalogArchiveParams: SessionsCatalogArchiveParamsSchema,
  SessionsCatalogArchiveResult: SessionsCatalogArchiveResultSchema,
  SessionsCleanupParams: SessionsCleanupParamsSchema,
  SessionsPreviewParams: SessionsPreviewParamsSchema,
  SessionsDescribeParams: SessionsDescribeParamsSchema,
  SessionsResolveParams: SessionsResolveParamsSchema,
  SessionsSearchHit: SessionsSearchHitSchema,
  SessionsSearchParams: SessionsSearchParamsSchema,
  SessionsSearchResult: SessionsSearchResultSchema,
  SessionCompactionCheckpoint: SessionCompactionCheckpointSchema,
  SessionOperationEvent: SessionOperationEventSchema,
  ...SessionPlacementProtocolSchemas,
  SessionDiscussionState: SessionDiscussionStateSchema,
  SessionDiscussionInfo: SessionDiscussionInfoSchema,
  SessionDiscussionInfoParams: SessionDiscussionInfoParamsSchema,
  SessionDiscussionInfoResult: SessionDiscussionInfoResultSchema,
  SessionDiscussionOpenParams: SessionDiscussionOpenParamsSchema,
  SessionDiscussionOpenResult: SessionDiscussionOpenResultSchema,
  SessionsCompactionListParams: SessionsCompactionListParamsSchema,
  SessionsCompactionGetParams: SessionsCompactionGetParamsSchema,
  SessionsCompactionBranchParams: SessionsCompactionBranchParamsSchema,
  SessionsCompactionRestoreParams: SessionsCompactionRestoreParamsSchema,
  SessionsCompactionListResult: SessionsCompactionListResultSchema,
  SessionsCompactionGetResult: SessionsCompactionGetResultSchema,
  SessionsCompactionBranchResult: SessionsCompactionBranchResultSchema,
  SessionsCompactionRestoreResult: SessionsCompactionRestoreResultSchema,
  SessionsRewindParams: SessionsRewindParamsSchema,
  SessionsRewindResult: SessionsRewindResultSchema,
  SessionsForkParams: SessionsForkParamsSchema,
  SessionsForkResult: SessionsForkResultSchema,
  SessionFileBrowserEntry: SessionFileBrowserEntrySchema,
  SessionFileBrowserResult: SessionFileBrowserResultSchema,
  SessionFileKind: SessionFileKindSchema,
  SessionFileEntry: SessionFileEntrySchema,
  SessionFileRelevance: SessionFileRelevanceSchema,
  SessionsFilesListParams: SessionsFilesListParamsSchema,
  SessionsFilesListResult: SessionsFilesListResultSchema,
  SessionsFilesGetParams: SessionsFilesGetParamsSchema,
  SessionsFilesGetResult: SessionsFilesGetResultSchema,
  SessionsFilesRevealParams: SessionsFilesRevealParamsSchema,
  SessionsFilesRevealResult: SessionsFilesRevealResultSchema,
  SessionsFilesSetParams: SessionsFilesSetParamsSchema,
  SessionsFilesSetResult: SessionsFilesSetResultSchema,
  SessionDiffFileStatus: SessionDiffFileStatusSchema,
  SessionDiffFile: SessionDiffFileSchema,
  SessionsDiffParams: SessionsDiffParamsSchema,
  SessionsDiffResult: SessionsDiffResultSchema,
  SessionWorktreeInfo: SessionWorktreeInfoSchema,
  SessionsCreateParams: SessionsCreateParamsSchema,
  SessionsCreateResult: SessionsCreateResultSchema,
  SessionsSendParams: SessionsSendParamsSchema,
  SessionsMessagesSubscribeParams: SessionsMessagesSubscribeParamsSchema,
  SessionsMessagesUnsubscribeParams: SessionsMessagesUnsubscribeParamsSchema,
  SessionsAbortParams: SessionsAbortParamsSchema,
  SessionsPatchParams: SessionsPatchParamsSchema,
  SessionsPluginPatchParams: SessionsPluginPatchParamsSchema,
  SessionsPluginPatchResult: SessionsPluginPatchResultSchema,
  SessionsResetParams: SessionsResetParamsSchema,
  SessionsDeleteParams: SessionsDeleteParamsSchema,
  SessionGroup: SessionGroupSchema,
  SessionsGroupsListParams: SessionsGroupsListParamsSchema,
  SessionsGroupsListResult: SessionsGroupsListResultSchema,
  SessionsGroupsPutParams: SessionsGroupsPutParamsSchema,
  SessionsGroupsRenameParams: SessionsGroupsRenameParamsSchema,
  SessionsGroupsDeleteParams: SessionsGroupsDeleteParamsSchema,
  SessionsGroupsMutationResult: SessionsGroupsMutationResultSchema,
  SessionsCompactParams: SessionsCompactParamsSchema,
  SessionsUsageParams: SessionsUsageParamsSchema,
  // Audit/task ledgers and config/wizard setup payloads.
  AuditActivityAgentRunV1: AuditActivityAgentRunV1Schema,
  AuditActivityToolActionV1: AuditActivityToolActionV1Schema,
  AuditActivityInboundMessageV1: AuditActivityInboundMessageV1Schema,
  AuditActivityOutboundMessageV1: AuditActivityOutboundMessageV1Schema,
  AuditActivityEventV1: AuditActivityEventV1Schema,
  AuditActivityListParams: AuditActivityListParamsSchema,
  AuditActivityListResult: AuditActivityListResultSchema,
  AuditEvent: AuditEventSchema,
  AuditListParams: AuditListParamsSchema,
  AuditListResult: AuditListResultSchema,
  TaskSuggestion: TaskSuggestionSchema,
  TaskSuggestionEvent: TaskSuggestionEventSchema,
  TaskSuggestionResolution: TaskSuggestionResolutionSchema,
  TaskSuggestionsAcceptParams: TaskSuggestionsAcceptParamsSchema,
  TaskSuggestionsAcceptResult: TaskSuggestionsAcceptResultSchema,
  TaskSuggestionsCreateParams: TaskSuggestionsCreateParamsSchema,
  TaskSuggestionsCreateResult: TaskSuggestionsCreateResultSchema,
  TaskSuggestionsDismissParams: TaskSuggestionsDismissParamsSchema,
  TaskSuggestionsDismissResult: TaskSuggestionsDismissResultSchema,
  TaskSuggestionsListParams: TaskSuggestionsListParamsSchema,
  TaskSuggestionsListResult: TaskSuggestionsListResultSchema,
  TaskSummary: TaskSummarySchema,
  TasksListParams: TasksListParamsSchema,
  TasksListResult: TasksListResultSchema,
  TasksGetParams: TasksGetParamsSchema,
  TasksGetResult: TasksGetResultSchema,
  TasksCancelParams: TasksCancelParamsSchema,
  TasksCancelResult: TasksCancelResultSchema,
  ConfigGetParams: ConfigGetParamsSchema,
  ConfigSetParams: ConfigSetParamsSchema,
  ConfigApplyParams: ConfigApplyParamsSchema,
  ConfigPatchParams: ConfigPatchParamsSchema,
  ConfigSchemaParams: ConfigSchemaParamsSchema,
  ConfigSchemaLookupParams: ConfigSchemaLookupParamsSchema,
  ConfigSchemaResponse: ConfigSchemaResponseSchema,
  ConfigSchemaLookupResult: ConfigSchemaLookupResultSchema,
  SystemAgentChatParams: SystemAgentChatParamsSchema,
  SystemAgentChatResult: SystemAgentChatResultSchema,
  SystemAgentChatHistoryParams: SystemAgentChatHistoryParamsSchema,
  SystemAgentChatHistoryTurn: SystemAgentChatHistoryTurnSchema,
  SystemAgentChatHistoryResult: SystemAgentChatHistoryResultSchema,
  SystemChangeEntry: SystemChangeEntrySchema,
  SystemChangeKind: SystemChangeKindSchema,
  SystemChangeSource: SystemChangeSourceSchema,
  SystemChangesListParams: SystemChangesListParamsSchema,
  SystemChangesListResult: SystemChangesListResultSchema,
  SystemAgentSetupDetectParams: SystemAgentSetupDetectParamsSchema,
  SystemAgentSetupDetectResult: SystemAgentSetupDetectResultSchema,
  SystemAgentSetupVerifyParams: SystemAgentSetupVerifyParamsSchema,
  SystemAgentSetupVerifyResult: SystemAgentSetupVerifyResultSchema,
  SystemAgentSetupActivateParams: SystemAgentSetupActivateParamsSchema,
  SystemAgentSetupActivateResult: SystemAgentSetupActivateResultSchema,
  SystemAgentSetupAuthStartParams: SystemAgentSetupAuthStartParamsSchema,
  SystemAgentSetupAuthStartResult: SystemAgentSetupAuthStartResultSchema,
  WizardStartParams: WizardStartParamsSchema,
  WizardNextParams: WizardNextParamsSchema,
  WizardCancelParams: WizardCancelParamsSchema,
  WizardStatusParams: WizardStatusParamsSchema,
  WizardStep: WizardStepSchema,
  WizardNextResult: WizardNextResultSchema,
  WizardStartResult: WizardStartResultSchema,
  WizardStatusResult: WizardStatusResultSchema,
  // Realtime Talk client/session events and channel control payloads.
  TalkModeParams: TalkModeParamsSchema,
  TalkEvent: TalkEventSchema,
  TalkCatalogParams: TalkCatalogParamsSchema,
  TalkCatalogResult: TalkCatalogResultSchema,
  TalkClientCreateParams: TalkClientCreateParamsSchema,
  TalkClientCreateResult: TalkClientCreateResultSchema,
  TalkClientCloseParams: TalkClientCloseParamsSchema,
  TalkClientMutationResult: TalkClientMutationResultSchema,
  TalkClientSteerParams: TalkClientSteerParamsSchema,
  TalkAgentControlResult: TalkAgentControlResultSchema,
  TalkClientToolCallParams: TalkClientToolCallParamsSchema,
  TalkClientToolCallResult: TalkClientToolCallResultSchema,
  TalkClientTranscriptParams: TalkClientTranscriptParamsSchema,
  TalkConfigParams: TalkConfigParamsSchema,
  TalkConfigResult: TalkConfigResultSchema,
  TalkSessionAppendAudioParams: TalkSessionAppendAudioParamsSchema,
  TalkSessionAcknowledgeMarkParams: TalkSessionAcknowledgeMarkParamsSchema,
  TalkSessionCancelOutputParams: TalkSessionCancelOutputParamsSchema,
  TalkSessionCancelTurnParams: TalkSessionCancelTurnParamsSchema,
  TalkSessionCreateParams: TalkSessionCreateParamsSchema,
  TalkSessionCreateResult: TalkSessionCreateResultSchema,
  TalkSessionJoinParams: TalkSessionJoinParamsSchema,
  TalkSessionJoinResult: TalkSessionJoinResultSchema,
  TalkSessionTurnParams: TalkSessionTurnParamsSchema,
  TalkSessionTurnResult: TalkSessionTurnResultSchema,
  TalkSessionSteerParams: TalkSessionSteerParamsSchema,
  TalkSessionSubmitToolResultParams: TalkSessionSubmitToolResultParamsSchema,
  TalkSessionCloseParams: TalkSessionCloseParamsSchema,
  TalkSessionOkResult: TalkSessionOkResultSchema,
  TalkSpeakParams: TalkSpeakParamsSchema,
  TalkSpeakResult: TalkSpeakResultSchema,
  TtsSpeakParams: TtsSpeakParamsSchema,
  TtsSpeakResult: TtsSpeakResultSchema,
  ChannelsStatusParams: ChannelsStatusParamsSchema,
  ChannelsStatusResult: ChannelsStatusResultSchema,
  ChannelsStartParams: ChannelsStartParamsSchema,
  ChannelsStopParams: ChannelsStopParamsSchema,
  ChannelsLogoutParams: ChannelsLogoutParamsSchema,
  WebLoginStartParams: WebLoginStartParamsSchema,
  WebLoginWaitParams: WebLoginWaitParamsSchema,
  // Agent files, artifacts, model catalogs, commands, tools, and skill workshop.
  AgentSummary: AgentSummarySchema,
  AgentsCreateParams: AgentsCreateParamsSchema,
  AgentsCreateResult: AgentsCreateResultSchema,
  AgentsUpdateParams: AgentsUpdateParamsSchema,
  AgentsUpdateResult: AgentsUpdateResultSchema,
  AgentsDeleteParams: AgentsDeleteParamsSchema,
  AgentsDeleteResult: AgentsDeleteResultSchema,
  AgentsFileEntry: AgentsFileEntrySchema,
  AgentsFilesListParams: AgentsFilesListParamsSchema,
  AgentsFilesListResult: AgentsFilesListResultSchema,
  AgentsFilesGetParams: AgentsFilesGetParamsSchema,
  AgentsFilesGetResult: AgentsFilesGetResultSchema,
  AgentsFilesSetParams: AgentsFilesSetParamsSchema,
  AgentsFilesSetResult: AgentsFilesSetResultSchema,
  AgentsWorkspaceEntry: AgentsWorkspaceEntrySchema,
  AgentsWorkspaceFile: AgentsWorkspaceFileSchema,
  AgentsWorkspaceListParams: AgentsWorkspaceListParamsSchema,
  AgentsWorkspaceListResult: AgentsWorkspaceListResultSchema,
  AgentsWorkspaceGetParams: AgentsWorkspaceGetParamsSchema,
  AgentsWorkspaceGetResult: AgentsWorkspaceGetResultSchema,
  ArtifactSummary: ArtifactSummarySchema,
  ArtifactsListParams: ArtifactsListParamsSchema,
  ArtifactsListResult: ArtifactsListResultSchema,
  ArtifactsGetParams: ArtifactsGetParamsSchema,
  ArtifactsGetResult: ArtifactsGetResultSchema,
  ArtifactsDownloadParams: ArtifactsDownloadParamsSchema,
  ArtifactsDownloadResult: ArtifactsDownloadResultSchema,
  AgentsListParams: AgentsListParamsSchema,
  AgentsListResult: AgentsListResultSchema,
  ModelChoice: ModelChoiceSchema,
  ModelsListParams: ModelsListParamsSchema,
  ModelsListResult: ModelsListResultSchema,
  ModelsProbeParams: ModelsProbeParamsSchema,
  ModelsProbeTargetResult: ModelsProbeTargetResultSchema,
  ModelsProbeResult: ModelsProbeResultSchema,
  CommandEntry: CommandEntrySchema,
  CommandsListParams: CommandsListParamsSchema,
  CommandsListResult: CommandsListResultSchema,
  SkillsStatusParams: SkillsStatusParamsSchema,
  ToolsCatalogParams: ToolsCatalogParamsSchema,
  ToolCatalogProfile: ToolCatalogProfileSchema,
  ToolCatalogEntry: ToolCatalogEntrySchema,
  ToolCatalogGroup: ToolCatalogGroupSchema,
  ToolsCatalogResult: ToolsCatalogResultSchema,
  ToolsEffectiveParams: ToolsEffectiveParamsSchema,
  ToolsEffectiveEntry: ToolsEffectiveEntrySchema,
  ToolsEffectiveGroup: ToolsEffectiveGroupSchema,
  ToolsEffectiveNotice: ToolsEffectiveNoticeSchema,
  ToolsEffectiveResult: ToolsEffectiveResultSchema,
  ToolsInvokeParams: ToolsInvokeParamsSchema,
  ToolsInvokeError: ToolsInvokeErrorSchema,
  ToolsInvokeResult: ToolsInvokeResultSchema,
  SkillsBinsParams: SkillsBinsParamsSchema,
  SkillsBinsResult: SkillsBinsResultSchema,
  SkillsSearchParams: SkillsSearchParamsSchema,
  SkillsSearchResult: SkillsSearchResultSchema,
  SkillsDetailParams: SkillsDetailParamsSchema,
  SkillsDetailResult: SkillsDetailResultSchema,
  SkillsCuratorActionParams: SkillsCuratorActionParamsSchema,
  SkillsCuratorActionResult: SkillsCuratorActionResultSchema,
  SkillsCuratorStatusParams: SkillsCuratorStatusParamsSchema,
  SkillsCuratorStatusResult: SkillsCuratorStatusResultSchema,
  ...SkillWorkshopProtocolSchemas,
  SkillsProposalInspectParams: SkillsProposalInspectParamsSchema,
  SkillsProposalInspectResult: SkillsProposalInspectResultSchema,
  SkillsProposalCreateParams: SkillsProposalCreateParamsSchema,
  SkillsProposalUpdateParams: SkillsProposalUpdateParamsSchema,
  SkillsProposalReviseParams: SkillsProposalReviseParamsSchema,
  SkillsProposalRequestRevisionParams: SkillsProposalRequestRevisionParamsSchema,
  SkillsProposalRequestRevisionResult: SkillsProposalRequestRevisionResultSchema,
  SkillsProposalActionParams: SkillsProposalActionParamsSchema,
  SkillsProposalApplyResult: SkillsProposalApplyResultSchema,
  SkillsProposalRecordResult: SkillsProposalRecordResultSchema,
  SkillsSecurityVerdictsParams: SkillsSecurityVerdictsParamsSchema,
  SkillsSecurityVerdictsResult: SkillsSecurityVerdictsResultSchema,
  SkillsSkillCardParams: SkillsSkillCardParamsSchema,
  SkillsSkillCardResult: SkillsSkillCardResultSchema,
  SkillsUploadBeginParams: SkillsUploadBeginParamsSchema,
  SkillsUploadChunkParams: SkillsUploadChunkParamsSchema,
  SkillsUploadCommitParams: SkillsUploadCommitParamsSchema,
  SkillsInstallParams: SkillsInstallParamsSchema,
  SkillsUpdateParams: SkillsUpdateParamsSchema,
  // Scheduler, logs, approval, plugin control, device, chat, and lifecycle events.
  CronJob: CronJobSchema,
  CronListParams: CronListParamsSchema,
  CronStatusParams: CronStatusParamsSchema,
  CronGetParams: CronGetParamsSchema,
  CronAddParams: CronAddParamsSchema,
  CronAddResult: CronAddResultSchema,
  CronDeclarativeAddResult: CronDeclarativeAddResultSchema,
  CronUpdateParams: CronUpdateParamsSchema,
  CronRemoveParams: CronRemoveParamsSchema,
  CronRunParams: CronRunParamsSchema,
  CronRunsParams: CronRunsParamsSchema,
  CronRunLogEntry: CronRunLogEntrySchema,
  ...LogMigrationProtocolSchemas,
  ...TerminalProtocolSchemas,
  ApprovalKind: ApprovalKindSchema,
  ApprovalDecision: ApprovalDecisionSchema,
  ApprovalAllowDecision: ApprovalAllowDecisionSchema,
  ApprovalAllowedReason: ApprovalAllowedReasonSchema,
  ApprovalDeniedReason: ApprovalDeniedReasonSchema,
  ApprovalExpiredReason: ApprovalExpiredReasonSchema,
  ApprovalCancelledReason: ApprovalCancelledReasonSchema,
  PluginApprovalSeverity: PluginApprovalSeveritySchema,
  ExecApprovalPresentation: ExecApprovalPresentationSchema,
  PluginApprovalPresentation: PluginApprovalPresentationSchema,
  SystemAgentApprovalPresentation: SystemAgentApprovalPresentationSchema,
  ApprovalPresentation: ApprovalPresentationSchema,
  PendingApprovalSnapshot: PendingApprovalSnapshotSchema,
  AllowedApprovalSnapshot: AllowedApprovalSnapshotSchema,
  DeniedApprovalSnapshot: DeniedApprovalSnapshotSchema,
  ExpiredApprovalSnapshot: ExpiredApprovalSnapshotSchema,
  CancelledApprovalSnapshot: CancelledApprovalSnapshotSchema,
  ApprovalSnapshot: ApprovalSnapshotSchema,
  ApprovalTerminalReason: ApprovalTerminalReasonSchema,
  TerminalApprovalSnapshot: TerminalApprovalSnapshotSchema,
  ApprovalGetParams: ApprovalGetParamsSchema,
  ApprovalGetResult: ApprovalGetResultSchema,
  ApprovalHistoryParams: ApprovalHistoryParamsSchema,
  ApprovalHistoryResult: ApprovalHistoryResultSchema,
  ApprovalResolveParams: ApprovalResolveParamsSchema,
  ApprovalResolveResult: ApprovalResolveResultSchema,
  PendingSessionApprovalEvent: PendingSessionApprovalEventSchema,
  TerminalSessionApprovalEvent: TerminalSessionApprovalEventSchema,
  SessionApprovalEvent: SessionApprovalEventSchema,
  SessionApprovalReplay: SessionApprovalReplaySchema,
  ExecApprovalsGetParams: ExecApprovalsGetParamsSchema,
  ExecApprovalsSetParams: ExecApprovalsSetParamsSchema,
  ExecApprovalsNodeGetParams: ExecApprovalsNodeGetParamsSchema,
  ExecApprovalsNodeSnapshot: ExecApprovalsNodeSnapshotSchema,
  ExecApprovalsNodeSetParams: ExecApprovalsNodeSetParamsSchema,
  ExecApprovalsSnapshot: ExecApprovalsSnapshotSchema,
  ExecApprovalGetParams: ExecApprovalGetParamsSchema,
  ExecApprovalRequestParams: ExecApprovalRequestParamsSchema,
  ExecApprovalResolveParams: ExecApprovalResolveParamsSchema,
  QuestionOption: QuestionOptionSchema,
  Question: QuestionSchema,
  QuestionRequestQuestion: QuestionRequestQuestionSchema,
  QuestionAnswers: QuestionAnswersSchema,
  QuestionStatus: QuestionStatusSchema,
  QuestionRecord: QuestionRecordSchema,
  QuestionRequestParams: QuestionRequestParamsSchema,
  QuestionRequestResult: QuestionRequestResultSchema,
  QuestionWaitAnswerParams: QuestionWaitAnswerParamsSchema,
  QuestionWaitAnswerResult: QuestionWaitAnswerResultSchema,
  QuestionResolveParams: QuestionResolveParamsSchema,
  QuestionResolveResult: QuestionResolveResultSchema,
  QuestionGetParams: QuestionGetParamsSchema,
  QuestionGetResult: QuestionGetResultSchema,
  QuestionListParams: QuestionListParamsSchema,
  QuestionListResult: QuestionListResultSchema,
  // QuestionRequestedEvent is a TS-only alias of QuestionRecord; registering both
  // names makes native codegen reference a type it never emits.
  QuestionResolvedEvent: QuestionResolvedEventSchema,
  PluginApprovalRequestParams: PluginApprovalRequestParamsSchema,
  PluginApprovalResolveParams: PluginApprovalResolveParamsSchema,
  PluginCatalogClawHubInstall: PluginCatalogClawHubInstallSchema,
  PluginCatalogEntry: PluginCatalogEntrySchema,
  PluginCatalogInstallAction: PluginCatalogInstallActionSchema,
  PluginCatalogOfficialInstall: PluginCatalogOfficialInstallSchema,
  PluginControlUiDescriptor: PluginControlUiDescriptorSchema,
  PluginSearchPackage: PluginSearchPackageSchema,
  PluginSearchResultEntry: PluginSearchResultEntrySchema,
  PluginsInstallParams: PluginsInstallParamsSchema,
  PluginsInstallResult: PluginsInstallResultSchema,
  PluginsListParams: PluginsListParamsSchema,
  PluginsListResult: PluginsListResultSchema,
  PluginsRefreshParams: PluginsRefreshParamsSchema,
  PluginsRefreshResult: PluginsRefreshResultSchema,
  PluginsSearchParams: PluginsSearchParamsSchema,
  PluginsSearchResult: PluginsSearchResultSchema,
  PluginsSessionActionFailureResult: PluginsSessionActionFailureResultSchema,
  PluginsSessionActionParams: PluginsSessionActionParamsSchema,
  PluginsSessionActionResult: PluginsSessionActionResultSchema,
  PluginsSessionActionSuccessResult: PluginsSessionActionSuccessResultSchema,
  PluginsSetEnabledParams: PluginsSetEnabledParamsSchema,
  PluginsSetEnabledResult: PluginsSetEnabledResultSchema,
  PluginsUiDescriptorsParams: PluginsUiDescriptorsParamsSchema,
  PluginsUiDescriptorsResult: PluginsUiDescriptorsResultSchema,
  PluginsUninstallParams: PluginsUninstallParamsSchema,
  PluginsUninstallResult: PluginsUninstallResultSchema,
  DevicePairListParams: DevicePairListParamsSchema,
  DevicePairApproveParams: DevicePairApproveParamsSchema,
  DevicePairRejectParams: DevicePairRejectParamsSchema,
  DevicePairRemoveParams: DevicePairRemoveParamsSchema,
  DevicePairSetupCodeParams: DevicePairSetupCodeParamsSchema,
  DevicePairSetupCodeResult: DevicePairSetupCodeResultSchema,
  DevicePairRenameParams: DevicePairRenameParamsSchema,
  DeviceTokenRotateParams: DeviceTokenRotateParamsSchema,
  DeviceTokenRevokeParams: DeviceTokenRevokeParamsSchema,
  DevicePairRequestedEvent: DevicePairRequestedEventSchema,
  DevicePairResolvedEvent: DevicePairResolvedEventSchema,
  ChatHistoryParams: ChatHistoryParamsSchema,
  ChatMetadataParams: ChatMetadataParamsSchema,
  ChatMessageGetParams: ChatMessageGetParamsSchema,
  ChatMessageGetResult: ChatMessageGetResultSchema,
  ChatToolTitlesParams: ChatToolTitlesParamsSchema,
  ChatToolTitlesResult: ChatToolTitlesResultSchema,
  ChatSendParams: ChatSendParamsSchema,
  ChatAbortParams: ChatAbortParamsSchema,
  ChatInjectParams: ChatInjectParamsSchema,
  ChatDeltaEvent: ChatDeltaEventSchema,
  ChatFinalEvent: ChatFinalEventSchema,
  ChatAbortedEvent: ChatAbortedEventSchema,
  ChatErrorEvent: ChatErrorEventSchema,
  ChatEvent: ChatEventSchema,
  UpdateStatusParams: UpdateStatusParamsSchema,
  UpdateRunParams: UpdateRunParamsSchema,
  TickEvent: TickEventSchema,
  ShutdownEvent: ShutdownEventSchema
};

// packages/gateway-protocol/src/schema/system-event.ts
import { Type as Type48 } from "typebox";
var SystemEventParamsSchema = closedObject({
  text: Type48.String(),
  idempotencyKey: Type48.Optional(Type48.String({ minLength: 1 })),
  sessionKey: Type48.Optional(Type48.String()),
  wake: Type48.Optional(Type48.Boolean()),
  deviceId: Type48.Optional(Type48.String()),
  instanceId: Type48.Optional(Type48.String()),
  host: Type48.Optional(Type48.String()),
  ip: Type48.Optional(Type48.String()),
  mode: Type48.Optional(Type48.String()),
  version: Type48.Optional(Type48.String()),
  platform: Type48.Optional(Type48.String()),
  deviceFamily: Type48.Optional(Type48.String()),
  modelIdentifier: Type48.Optional(Type48.String()),
  lastInputSeconds: Type48.Optional(Type48.Number()),
  reason: Type48.Optional(Type48.String()),
  roles: Type48.Optional(Type48.Array(Type48.String())),
  scopes: Type48.Optional(Type48.Array(Type48.String())),
  tags: Type48.Optional(Type48.Array(Type48.String()))
});
var validateSystemEventParams = lazyCompile(SystemEventParamsSchema);

// packages/gateway-protocol/src/schema/worker-inference.ts
import { Type as Type49 } from "typebox";
import { Value } from "typebox/value";
var WORKER_INFERENCE_PROTOCOL_FEATURE = "worker-inference-v1";
var WORKER_INFERENCE_METHODS = [
  "worker.inference.start",
  "worker.inference.cancel"
];
var WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES = 25 * 1024 * 1024;
var WORKER_INFERENCE_MAX_CONTEXT_MESSAGES = 1024;
var WORKER_INFERENCE_MAX_TOOLS = 256;
var WORKER_INFERENCE_MAX_OUTPUT_TOKENS = 1e6;
function workerInferenceObject(properties) {
  return closedObject(properties);
}
var InferenceTextSchema = Type49.String({
  maxLength: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES
});
var OptionalInferenceTextSchema = Type49.Optional(InferenceTextSchema);
var WorkerInferenceTextContentSchema = workerInferenceObject({
  type: Type49.Literal("text"),
  text: InferenceTextSchema,
  textSignature: OptionalInferenceTextSchema
});
var WorkerInferenceImageContentSchema = workerInferenceObject({
  type: Type49.Literal("image"),
  data: Type49.String({
    minLength: 1,
    maxLength: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES
  }),
  mimeType: Type49.String({ minLength: 1, maxLength: 256 })
});
var WorkerInferenceThinkingContentSchema = workerInferenceObject({
  type: Type49.Literal("thinking"),
  thinking: InferenceTextSchema,
  thinkingSignature: OptionalInferenceTextSchema,
  redacted: Type49.Optional(Type49.Boolean())
});
var WorkerInferenceToolCallSchema = workerInferenceObject({
  type: Type49.Literal("toolCall"),
  id: WorkerIdentifierSchema,
  name: WorkerIdentifierSchema,
  arguments: Type49.Record(Type49.String({ minLength: 1, maxLength: 256 }), Type49.Unknown()),
  thoughtSignature: OptionalInferenceTextSchema,
  executionMode: Type49.Optional(Type49.Union([Type49.Literal("sequential"), Type49.Literal("parallel")]))
});
var WorkerInferenceUserMessageSchema = workerInferenceObject({
  role: Type49.Literal("user"),
  content: Type49.Union([
    InferenceTextSchema,
    Type49.Array(Type49.Union([WorkerInferenceTextContentSchema, WorkerInferenceImageContentSchema]), {
      minItems: 1,
      maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
    })
  ]),
  timestamp: LiveIntegerSchema,
  runtimeContextCarrier: Type49.Optional(Type49.Boolean())
});
var WorkerInferenceAssistantMessageProperties = {
  role: Type49.Literal("assistant"),
  content: Type49.Array(
    Type49.Union([
      WorkerInferenceTextContentSchema,
      WorkerInferenceThinkingContentSchema,
      WorkerInferenceToolCallSchema
    ]),
    { maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
  ),
  api: WorkerIdentifierSchema,
  provider: WorkerIdentifierSchema,
  model: WorkerIdentifierSchema,
  responseModel: Type49.Optional(WorkerIdentifierSchema),
  responseId: Type49.Optional(WorkerIdentifierSchema),
  usage: WorkerTranscriptUsageSchema,
  timestamp: LiveIntegerSchema
};
var WorkerInferenceAssistantMessageSchema = workerInferenceObject({
  ...WorkerInferenceAssistantMessageProperties,
  stopReason: Type49.Union([Type49.Literal("stop"), Type49.Literal("length"), Type49.Literal("toolUse")])
});
var WorkerInferenceContextAssistantMessageSchema = workerInferenceObject({
  ...WorkerInferenceAssistantMessageProperties,
  diagnostics: Type49.Optional(
    Type49.Array(WorkerTranscriptAssistantDiagnosticSchema, {
      maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
    })
  ),
  stopReason: Type49.Union([
    Type49.Literal("stop"),
    Type49.Literal("length"),
    Type49.Literal("toolUse"),
    Type49.Literal("error"),
    Type49.Literal("aborted")
  ]),
  errorMessage: OptionalInferenceTextSchema,
  errorCode: Type49.Optional(Type49.String({ maxLength: 256 })),
  errorType: Type49.Optional(Type49.String({ maxLength: 256 })),
  errorBody: OptionalInferenceTextSchema
});
var WorkerInferenceMessageSchema = Type49.Union([
  WorkerInferenceUserMessageSchema,
  WorkerInferenceContextAssistantMessageSchema,
  workerInferenceObject({
    role: Type49.Literal("toolResult"),
    toolCallId: WorkerIdentifierSchema,
    toolName: WorkerIdentifierSchema,
    content: Type49.Array(
      Type49.Union([WorkerInferenceTextContentSchema, WorkerInferenceImageContentSchema]),
      { maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
    ),
    details: Type49.Optional(Type49.Unknown()),
    isError: Type49.Boolean(),
    timestamp: LiveIntegerSchema
  })
]);
var WorkerInferenceToolSchema = workerInferenceObject({
  name: WorkerIdentifierSchema,
  description: LiveTextSchema,
  parameters: Type49.Unknown()
});
var WorkerInferenceModelRefSchema = workerInferenceObject({
  provider: WorkerIdentifierSchema,
  model: WorkerIdentifierSchema
});
var WorkerInferenceContextSchema = workerInferenceObject({
  systemPrompt: Type49.Optional(InferenceTextSchema),
  messages: Type49.Array(WorkerInferenceMessageSchema, {
    maxItems: WORKER_INFERENCE_MAX_CONTEXT_MESSAGES
  }),
  tools: Type49.Optional(
    Type49.Array(WorkerInferenceToolSchema, { maxItems: WORKER_INFERENCE_MAX_TOOLS })
  )
});
var WorkerInferenceReasoningSchema = Type49.Union([
  Type49.Literal("off"),
  Type49.Literal("minimal"),
  Type49.Literal("low"),
  Type49.Literal("medium"),
  Type49.Literal("high"),
  Type49.Literal("xhigh"),
  Type49.Literal("adaptive"),
  Type49.Literal("max")
]);
var WorkerInferenceThinkingBudgetSchema = Type49.Integer({
  minimum: 0,
  maximum: WORKER_INFERENCE_MAX_OUTPUT_TOKENS
});
var WorkerInferenceThinkingBudgetsSchema = workerInferenceObject({
  minimal: Type49.Optional(WorkerInferenceThinkingBudgetSchema),
  low: Type49.Optional(WorkerInferenceThinkingBudgetSchema),
  medium: Type49.Optional(WorkerInferenceThinkingBudgetSchema),
  high: Type49.Optional(WorkerInferenceThinkingBudgetSchema),
  max: Type49.Optional(WorkerInferenceThinkingBudgetSchema)
});
var WorkerInferenceOptionsSchema = workerInferenceObject({
  temperature: Type49.Optional(Type49.Number({ minimum: 0, maximum: 2 })),
  maxTokens: Type49.Optional(
    Type49.Integer({ minimum: 1, maximum: WORKER_INFERENCE_MAX_OUTPUT_TOKENS })
  ),
  reasoning: Type49.Optional(WorkerInferenceReasoningSchema),
  thinkingBudgets: Type49.Optional(WorkerInferenceThinkingBudgetsSchema)
});
var WorkerInferenceIdentityProperties = {
  runEpoch: LiveIntegerSchema,
  sessionId: WorkerIdentifierSchema,
  runId: WorkerIdentifierSchema,
  turnId: WorkerIdentifierSchema
};
var WorkerInferenceStartParamsSchema = workerInferenceObject({
  ...WorkerInferenceIdentityProperties,
  modelRef: WorkerInferenceModelRefSchema,
  context: WorkerInferenceContextSchema,
  options: WorkerInferenceOptionsSchema
});
var WorkerInferenceStartResultSchema = workerInferenceObject({
  status: Type49.Union([Type49.Literal("accepted"), Type49.Literal("replayed")])
});
var WorkerInferenceErrorReasonSchema = Type49.Union([
  Type49.Literal("model-not-approved"),
  Type49.Literal("invalid-context"),
  Type49.Literal("epoch-mismatch"),
  Type49.Literal("session-not-attached"),
  Type49.Literal("provider-error"),
  Type49.Literal("cancelled")
]);
var WorkerInferenceErrorShapeSchema = workerInferenceObject({
  code: Type49.Union([Type49.Literal("INVALID_REQUEST"), Type49.Literal("UNAVAILABLE")]),
  message: Type49.String({ minLength: 1, maxLength: 256 }),
  details: workerInferenceObject({ reason: WorkerInferenceErrorReasonSchema })
});
var WorkerInferenceStartRequestFrameSchema = workerInferenceObject({
  type: Type49.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type49.Literal(WORKER_INFERENCE_METHODS[0]),
  params: WorkerInferenceStartParamsSchema
});
var WorkerInferenceStartSuccessResponseFrameSchema = workerInferenceObject({
  type: Type49.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type49.Literal(true),
  payload: WorkerInferenceStartResultSchema
});
var WorkerInferenceErrorResponseFrameSchema = workerInferenceObject({
  type: Type49.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type49.Literal(false),
  error: WorkerInferenceErrorShapeSchema
});
var WorkerInferenceStartResponseFrameSchema = Type49.Union([
  WorkerInferenceStartSuccessResponseFrameSchema,
  WorkerInferenceErrorResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
var WorkerInferenceCancelParamsSchema = workerInferenceObject({
  ...WorkerInferenceIdentityProperties
});
var WorkerInferenceCancelResultSchema = workerInferenceObject({
  status: Type49.Literal("cancelled")
});
var WorkerInferenceCancelRequestFrameSchema = workerInferenceObject({
  type: Type49.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type49.Literal(WORKER_INFERENCE_METHODS[1]),
  params: WorkerInferenceCancelParamsSchema
});
var WorkerInferenceCancelSuccessResponseFrameSchema = workerInferenceObject({
  type: Type49.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type49.Literal(true),
  payload: WorkerInferenceCancelResultSchema
});
var WorkerInferenceCancelResponseFrameSchema = Type49.Union([
  WorkerInferenceCancelSuccessResponseFrameSchema,
  WorkerInferenceErrorResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
var WorkerInferenceResolvedModelSchema = workerInferenceObject({
  api: WorkerIdentifierSchema,
  provider: WorkerIdentifierSchema,
  model: WorkerIdentifierSchema
});
var WorkerInferenceStreamEventSchema = Type49.Union([
  workerInferenceObject({
    type: Type49.Literal("start"),
    resolvedModel: WorkerInferenceResolvedModelSchema,
    timestamp: LiveIntegerSchema
  }),
  workerInferenceObject({
    type: Type49.Literal("text_start"),
    contentIndex: LiveIntegerSchema,
    contentSignature: OptionalInferenceTextSchema
  }),
  workerInferenceObject({
    type: Type49.Literal("text_delta"),
    contentIndex: LiveIntegerSchema,
    delta: InferenceTextSchema
  }),
  workerInferenceObject({
    type: Type49.Literal("text_end"),
    contentIndex: LiveIntegerSchema,
    contentSignature: OptionalInferenceTextSchema
  }),
  workerInferenceObject({ type: Type49.Literal("thinking_start"), contentIndex: LiveIntegerSchema }),
  workerInferenceObject({
    type: Type49.Literal("thinking_delta"),
    contentIndex: LiveIntegerSchema,
    delta: InferenceTextSchema
  }),
  workerInferenceObject({
    type: Type49.Literal("thinking_end"),
    contentIndex: LiveIntegerSchema,
    contentSignature: OptionalInferenceTextSchema
  }),
  workerInferenceObject({
    type: Type49.Literal("toolcall_start"),
    contentIndex: LiveIntegerSchema,
    id: WorkerIdentifierSchema,
    toolName: WorkerIdentifierSchema
  }),
  workerInferenceObject({
    type: Type49.Literal("toolcall_delta"),
    contentIndex: LiveIntegerSchema,
    delta: InferenceTextSchema
  }),
  workerInferenceObject({ type: Type49.Literal("toolcall_end"), contentIndex: LiveIntegerSchema })
]);
var WorkerInferenceEventParamsSchema = workerInferenceObject({
  ...WorkerInferenceIdentityProperties,
  seq: LiveSequenceSchema,
  event: WorkerInferenceStreamEventSchema
});
var WorkerInferenceEventFrameSchema = workerInferenceObject({
  type: Type49.Literal("event"),
  event: Type49.Literal("worker.inference.event"),
  payload: WorkerInferenceEventParamsSchema
});
var WorkerInferenceTerminalDoneSchema = workerInferenceObject({
  type: Type49.Literal("done"),
  message: WorkerInferenceAssistantMessageSchema
});
var WorkerInferenceTerminalErrorSchema = workerInferenceObject({
  type: Type49.Literal("error"),
  reason: WorkerInferenceErrorReasonSchema,
  message: Type49.String({ minLength: 1, maxLength: 256 }),
  usage: Type49.Optional(WorkerTranscriptUsageSchema)
});
var WorkerInferenceTerminalOutcomeSchema = Type49.Union([
  WorkerInferenceTerminalDoneSchema,
  WorkerInferenceTerminalErrorSchema
]);
var WorkerInferenceTerminalParamsSchema = workerInferenceObject({
  ...WorkerInferenceIdentityProperties,
  seq: LiveSequenceSchema,
  outcome: WorkerInferenceTerminalOutcomeSchema
});
var WorkerInferenceTerminalFrameSchema = workerInferenceObject({
  type: Type49.Literal("event"),
  event: Type49.Literal("worker.inference.terminal"),
  payload: WorkerInferenceTerminalParamsSchema
});
function isSafeWorkerInferenceJson(data) {
  const stack = [{ depth: 0, value: data }];
  const seen = /* @__PURE__ */ new WeakSet();
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || current.depth > WORKER_TRANSCRIPT_MAX_JSON_DEPTH) {
      return false;
    }
    if (current.value === null || typeof current.value === "string" || typeof current.value === "boolean") {
      continue;
    }
    if (typeof current.value === "number") {
      if (!Number.isFinite(current.value)) {
        return false;
      }
      continue;
    }
    if (typeof current.value !== "object" || seen.has(current.value)) {
      return false;
    }
    seen.add(current.value);
    const values = Array.isArray(current.value) ? current.value : Object.values(current.value);
    for (const value of values) {
      stack.push({ depth: current.depth + 1, value });
    }
  }
  return true;
}
function validateWorkerInferenceStartParams(data) {
  return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceStartParamsSchema, data);
}
function validateWorkerInferenceCancelParams(data) {
  return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceCancelParamsSchema, data);
}
function validateWorkerInferenceTerminalOutcome(data) {
  return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceTerminalOutcomeSchema, data);
}
function validateWorkerInferenceEventFrame(data) {
  return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceEventFrameSchema, data);
}
function validateWorkerInferenceTerminalFrame(data) {
  return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceTerminalFrameSchema, data);
}
export {
  AgentEventSchema,
  AgentIdentityParamsSchema,
  AgentIdentityResultSchema,
  AgentParamsSchema,
  AgentSummarySchema,
  AgentWaitParamsSchema,
  AgentsCreateParamsSchema,
  AgentsCreateResultSchema,
  AgentsDeleteParamsSchema,
  AgentsDeleteResultSchema,
  AgentsFileEntrySchema,
  AgentsFilesGetParamsSchema,
  AgentsFilesGetResultSchema,
  AgentsFilesListParamsSchema,
  AgentsFilesListResultSchema,
  AgentsFilesSetParamsSchema,
  AgentsFilesSetResultSchema,
  AgentsListParamsSchema,
  AgentsListResultSchema,
  AgentsUpdateParamsSchema,
  AgentsUpdateResultSchema,
  AgentsWorkspaceEntrySchema,
  AgentsWorkspaceFileSchema,
  AgentsWorkspaceGetParamsSchema,
  AgentsWorkspaceGetResultSchema,
  AgentsWorkspaceListParamsSchema,
  AgentsWorkspaceListResultSchema,
  AllowedApprovalSnapshotSchema,
  ApprovalAllowDecisionSchema,
  ApprovalAllowedReasonSchema,
  ApprovalCancelledReasonSchema,
  ApprovalDecisionSchema,
  ApprovalDeniedReasonSchema,
  ApprovalExpiredReasonSchema,
  ApprovalGetParamsSchema,
  ApprovalGetResultSchema,
  ApprovalHistoryParamsSchema,
  ApprovalHistoryResultSchema,
  ApprovalKindSchema,
  ApprovalPresentationSchema,
  ApprovalResolveParamsSchema,
  ApprovalResolveResultSchema,
  ApprovalSnapshotSchema,
  ApprovalTerminalReasonSchema,
  ArtifactSummarySchema,
  ArtifactsDownloadParamsSchema,
  ArtifactsDownloadResultSchema,
  ArtifactsGetParamsSchema,
  ArtifactsGetResultSchema,
  ArtifactsListParamsSchema,
  ArtifactsListResultSchema,
  AuditActivityAgentRunV1Schema,
  AuditActivityEventV1Schema,
  AuditActivityInboundMessageV1Schema,
  AuditActivityListParamsSchema,
  AuditActivityListResultSchema,
  AuditActivityOutboundMessageV1Schema,
  AuditActivityToolActionV1Schema,
  AuditEventSchema,
  AuditListParamsSchema,
  AuditListResultSchema,
  AuthProbeStatusSchema,
  BOARD_CRON_JOB_ID_MAX_LENGTH,
  BOARD_CRON_TRIGGER_PREFIX,
  BOARD_WIDGET_TOOL_MAX_LENGTH,
  BoardActionParamsSchema,
  BoardCanvasDocumentSourceSchema,
  BoardChangedEventSchema,
  BoardChatDockSchema,
  BoardCommandEventSchema,
  BoardCommandSchema,
  BoardDataReadParamsSchema,
  BoardEventParamsSchema,
  BoardFocusTabCommandSchema,
  BoardGetParamsSchema,
  BoardLegacyEventParamsSchema,
  BoardMcpAppDescriptorSchema,
  BoardOpSchema,
  BoardPromptAuthorizeParamsSchema,
  BoardSetChatDockCommandSchema,
  BoardSizeSchema,
  BoardSnapshotSchema,
  BoardTabCreateOpSchema,
  BoardTabDeleteOpSchema,
  BoardTabIdSchema,
  BoardTabSchema,
  BoardTabUpdateOpSchema,
  BoardTabsReorderOpSchema,
  BoardTicketEventParamsSchema,
  BoardUpdateParamsSchema,
  BoardViewTicketSchema,
  BoardWidgetAppViewParamsSchema,
  BoardWidgetAppViewResultSchema,
  BoardWidgetContentSchema,
  BoardWidgetDeclaredSchema,
  BoardWidgetGrantParamsSchema,
  BoardWidgetHtmlContentSchema,
  BoardWidgetMcpAppContentSchema,
  BoardWidgetMcpAppPutContentSchema,
  BoardWidgetMoveOpSchema,
  BoardWidgetNameSchema,
  BoardWidgetPutContentSchema,
  BoardWidgetPutParamsSchema,
  BoardWidgetRemoveOpSchema,
  BoardWidgetResizeOpSchema,
  BoardWidgetSchema,
  CHAT_SEND_SESSION_KEY_MAX_LENGTH,
  COMMAND_ALIAS_MAX_ITEMS,
  COMMAND_ARGS_MAX_ITEMS,
  COMMAND_ARG_CHOICES_MAX_ITEMS,
  COMMAND_ARG_DESCRIPTION_MAX_LENGTH,
  COMMAND_ARG_NAME_MAX_LENGTH,
  COMMAND_CHOICE_LABEL_MAX_LENGTH,
  COMMAND_CHOICE_VALUE_MAX_LENGTH,
  COMMAND_DESCRIPTION_MAX_LENGTH,
  COMMAND_LIST_MAX_ITEMS,
  COMMAND_NAME_MAX_LENGTH,
  CancelledApprovalSnapshotSchema,
  ChannelsLogoutParamsSchema,
  ChannelsStartParamsSchema,
  ChannelsStatusParamsSchema,
  ChannelsStatusResultSchema,
  ChannelsStopParamsSchema,
  ChatAbortParamsSchema,
  ChatAbortedEventSchema,
  ChatAttachmentsSchema,
  ChatDeltaEventSchema,
  ChatErrorEventSchema,
  ChatEventSchema,
  ChatFinalEventSchema,
  ChatHistoryParamsSchema,
  ChatInjectParamsSchema,
  ChatMessageGetParamsSchema,
  ChatMessageGetResultSchema,
  ChatMetadataParamsSchema,
  ChatSendParamsSchema,
  ChatSendSessionKeyString,
  ChatToolTitlesParamsSchema,
  ChatToolTitlesResultSchema,
  CommandEntrySchema,
  CommandsListParamsSchema,
  CommandsListResultSchema,
  ConfigApplyParamsSchema,
  ConfigGetParamsSchema,
  ConfigPatchParamsSchema,
  ConfigSchemaLookupParamsSchema,
  ConfigSchemaLookupResultSchema,
  ConfigSchemaParamsSchema,
  ConfigSchemaResponseSchema,
  ConfigSetParamsSchema,
  ConnectParamsSchema,
  ConversationListItemSchema,
  ConversationListParamsSchema,
  ConversationListResultSchema,
  ConversationSendParamsSchema,
  ConversationSendResultSchema,
  ConversationTurnCancelParamsSchema,
  ConversationTurnCancelResultSchema,
  ConversationTurnParamsSchema,
  ConversationTurnReplySchema,
  ConversationTurnResultSchema,
  CronAddParamsSchema,
  CronAddResultSchema,
  CronDeclarativeAddResultSchema,
  CronDeliverySchema,
  CronGetParamsSchema,
  CronJobSchema,
  CronJobStateSchema,
  CronListParamsSchema,
  CronPacingSchema,
  CronRemoveParamsSchema,
  CronRunLogEntrySchema,
  CronRunParamsSchema,
  CronRunsParamsSchema,
  CronStatusParamsSchema,
  CronUpdateParamsSchema,
  DeniedApprovalSnapshotSchema,
  DevicePairApproveParamsSchema,
  DevicePairListParamsSchema,
  DevicePairRejectParamsSchema,
  DevicePairRemoveParamsSchema,
  DevicePairRenameParamsSchema,
  DevicePairRequestedEventSchema,
  DevicePairResolvedEventSchema,
  DevicePairSetupCodeParamsSchema,
  DevicePairSetupCodeResultSchema,
  DeviceTokenRevokeParamsSchema,
  DeviceTokenRotateParamsSchema,
  EnvironmentStatusSchema,
  EnvironmentSummarySchema,
  EnvironmentsCreateParamsSchema,
  EnvironmentsCreateResultSchema,
  EnvironmentsDestroyParamsSchema,
  EnvironmentsDestroyResultSchema,
  EnvironmentsListParamsSchema,
  EnvironmentsListResultSchema,
  EnvironmentsStatusParamsSchema,
  EnvironmentsStatusResultSchema,
  ErrorCodes,
  ErrorShapeSchema,
  EventFrameSchema,
  ExecApprovalGetParamsSchema,
  ExecApprovalPresentationSchema,
  ExecApprovalRequestParamsSchema,
  ExecApprovalResolveParamsSchema,
  ExecApprovalsGetParamsSchema,
  ExecApprovalsNodeGetParamsSchema,
  ExecApprovalsNodeSetParamsSchema,
  ExecApprovalsNodeSnapshotSchema,
  ExecApprovalsSetParamsSchema,
  ExecApprovalsSnapshotSchema,
  ExpiredApprovalSnapshotSchema,
  FsDirEntrySchema,
  FsListDirParamsSchema,
  FsListDirResultSchema,
  GATEWAY_SERVER_CAPS,
  GatewayClientIdSchema,
  GatewayClientModeSchema,
  GatewayErrorDetailCodes,
  GatewayErrorDetailsSchema,
  GatewayFrameSchema,
  GatewaySuspendBlockerSchema,
  GatewaySuspendPrepareBusyResultSchema,
  GatewaySuspendPrepareParamsSchema,
  GatewaySuspendPrepareReadyResultSchema,
  GatewaySuspendPrepareResultSchema,
  GatewaySuspendResumeParamsSchema,
  GatewaySuspendResumeResultSchema,
  GatewaySuspendStatusParamsSchema,
  GatewaySuspendStatusReadyResultSchema,
  GatewaySuspendStatusResultSchema,
  GatewaySuspendStatusRunningResultSchema,
  GatewaySuspendTaskBlockerSchema,
  HelloOkSchema,
  InputProvenanceSchema,
  LogsTailParamsSchema,
  LogsTailResultSchema,
  MAX_MEMORY_MIGRATION_ITEMS,
  MIN_CLIENT_PROTOCOL_VERSION,
  MIN_NODE_PROTOCOL_VERSION,
  MIN_PROBE_PROTOCOL_VERSION,
  McpAppViewExpiredErrorDetailsSchema,
  MessageActionParamsSchema,
  MigrationProtocolSchemas,
  MigrationsMemoryApplyParamsSchema,
  MigrationsMemoryPlanParamsSchema,
  MissingScopeErrorDetailsSchema,
  ModelChoiceSchema,
  ModelsListParamsSchema,
  ModelsListResultSchema,
  ModelsProbeParamsSchema,
  ModelsProbeResultSchema,
  ModelsProbeTargetResultSchema,
  NodeDescribeParamsSchema,
  NodeEventParamsSchema,
  NodeEventResultSchema,
  NodeInvokeInputEventSchema,
  NodeInvokeParamsSchema,
  NodeInvokeProgressParamsSchema,
  NodeInvokeRequestEventSchema,
  NodeInvokeResultParamsSchema,
  NodeListParamsSchema,
  NodePairApproveParamsSchema,
  NodePairListParamsSchema,
  NodePairRejectParamsSchema,
  NodePairRemoveParamsSchema,
  NodePendingAckParamsSchema,
  NodePendingDrainParamsSchema,
  NodePendingDrainResultSchema,
  NodePendingEnqueueParamsSchema,
  NodePendingEnqueueResultSchema,
  NodePluginToolDescriptorSchema,
  NodePluginToolsUpdateParamsSchema,
  NodePresenceActivityPayloadSchema,
  NodePresenceAlivePayloadSchema,
  NodePresenceAliveReasonSchema,
  NodeRenameParamsSchema,
  NodeSkillDescriptorSchema,
  NodeSkillsUpdateParamsSchema,
  NonEmptyString,
  PROTOCOL_VERSION,
  PendingApprovalSnapshotSchema,
  PendingSessionApprovalEventSchema,
  PluginApprovalPresentationSchema,
  PluginApprovalRequestParamsSchema,
  PluginApprovalResolveParamsSchema,
  PluginApprovalSeveritySchema,
  PluginCatalogClawHubInstallSchema,
  PluginCatalogEntrySchema,
  PluginCatalogInstallActionSchema,
  PluginCatalogOfficialInstallSchema,
  PluginControlUiDescriptorSchema,
  PluginJsonValueSchema,
  PluginSearchPackageSchema,
  PluginSearchResultEntrySchema,
  PluginsInstallParamsSchema,
  PluginsInstallResultSchema,
  PluginsListParamsSchema,
  PluginsListResultSchema,
  PluginsRefreshParamsSchema,
  PluginsRefreshResultSchema,
  PluginsSearchParamsSchema,
  PluginsSearchResultSchema,
  PluginsSessionActionFailureResultSchema,
  PluginsSessionActionParamsSchema,
  PluginsSessionActionResultSchema,
  PluginsSessionActionSuccessResultSchema,
  PluginsSetEnabledParamsSchema,
  PluginsSetEnabledResultSchema,
  PluginsUiDescriptorsParamsSchema,
  PluginsUiDescriptorsResultSchema,
  PluginsUninstallParamsSchema,
  PluginsUninstallResultSchema,
  PollParamsSchema,
  PresenceEntrySchema,
  ProtocolSchemas,
  PushTestParamsSchema,
  PushTestResultSchema,
  QuestionAnswersSchema,
  QuestionGetParamsSchema,
  QuestionGetResultSchema,
  QuestionListParamsSchema,
  QuestionListResultSchema,
  QuestionOptionSchema,
  QuestionRecordSchema,
  QuestionRequestParamsSchema,
  QuestionRequestQuestionSchema,
  QuestionRequestResultSchema,
  QuestionRequestedEventSchema,
  QuestionResolveParamsSchema,
  QuestionResolveResultSchema,
  QuestionResolvedEventSchema,
  QuestionSchema,
  QuestionStatusSchema,
  QuestionWaitAnswerParamsSchema,
  QuestionWaitAnswerResultSchema,
  RequestFrameSchema,
  ResponseFrameSchema,
  SecretInputSchema,
  SecretRefSchema,
  SecretsReloadParamsSchema,
  SecretsResolveAssignmentSchema,
  SecretsResolveParamsSchema,
  SecretsResolveResultSchema,
  SendParamsSchema,
  SessionApprovalEventSchema,
  SessionApprovalReplaySchema,
  SessionBranchSchema,
  SessionCatalogCapabilitiesSchema,
  SessionCatalogDescriptorSchema,
  SessionCatalogHostSchema,
  SessionCatalogLocatorSchema,
  SessionCatalogSchema,
  SessionCatalogSessionSchema,
  SessionCatalogTranscriptItemSchema,
  SessionCompactionCheckpointSchema,
  SessionDiffFileSchema,
  SessionDiffFileStatusSchema,
  SessionDiscussionInfoParamsSchema,
  SessionDiscussionInfoResultSchema,
  SessionDiscussionInfoSchema,
  SessionDiscussionOpenParamsSchema,
  SessionDiscussionOpenResultSchema,
  SessionDiscussionStateSchema,
  SessionFileBrowserEntrySchema,
  SessionFileBrowserResultSchema,
  SessionFileEntrySchema,
  SessionFileKindSchema,
  SessionFileRelevanceSchema,
  SessionGroupSchema,
  SessionLabelString,
  SessionOperationEventSchema,
  SessionPlacementProtocolSchemas,
  SessionPlacementSchema,
  SessionPlacementStateSchema,
  SessionWorktreeInfoSchema,
  SessionsAbortParamsSchema,
  SessionsBranchesListParamsSchema,
  SessionsBranchesListResultSchema,
  SessionsBranchesSwitchParamsSchema,
  SessionsBranchesSwitchResultSchema,
  SessionsCatalogArchiveParamsSchema,
  SessionsCatalogArchiveResultSchema,
  SessionsCatalogContinueParamsSchema,
  SessionsCatalogContinueResultSchema,
  SessionsCatalogHostEventSchema,
  SessionsCatalogListParamsSchema,
  SessionsCatalogListResultSchema,
  SessionsCatalogReadParamsSchema,
  SessionsCatalogReadResultSchema,
  SessionsCleanupParamsSchema,
  SessionsCompactParamsSchema,
  SessionsCompactionBranchParamsSchema,
  SessionsCompactionBranchResultSchema,
  SessionsCompactionGetParamsSchema,
  SessionsCompactionGetResultSchema,
  SessionsCompactionListParamsSchema,
  SessionsCompactionListResultSchema,
  SessionsCompactionRestoreParamsSchema,
  SessionsCompactionRestoreResultSchema,
  SessionsCreateParamsSchema,
  SessionsCreateResultSchema,
  SessionsDeleteParamsSchema,
  SessionsDescribeParamsSchema,
  SessionsDiffParamsSchema,
  SessionsDiffResultSchema,
  SessionsDispatchParamsSchema,
  SessionsDispatchResultSchema,
  SessionsFilesGetParamsSchema,
  SessionsFilesGetResultSchema,
  SessionsFilesListParamsSchema,
  SessionsFilesListResultSchema,
  SessionsFilesRevealParamsSchema,
  SessionsFilesRevealResultSchema,
  SessionsFilesSetParamsSchema,
  SessionsFilesSetResultSchema,
  SessionsForkParamsSchema,
  SessionsForkResultSchema,
  SessionsGroupsDeleteParamsSchema,
  SessionsGroupsListParamsSchema,
  SessionsGroupsListResultSchema,
  SessionsGroupsMutationResultSchema,
  SessionsGroupsPutParamsSchema,
  SessionsGroupsRenameParamsSchema,
  SessionsListParamsSchema,
  SessionsMessagesSubscribeParamsSchema,
  SessionsMessagesUnsubscribeParamsSchema,
  SessionsPatchParamsSchema,
  SessionsPluginPatchParamsSchema,
  SessionsPluginPatchResultSchema,
  SessionsPreviewParamsSchema,
  SessionsReclaimParamsSchema,
  SessionsReclaimResultSchema,
  SessionsResetParamsSchema,
  SessionsResolveParamsSchema,
  SessionsRewindParamsSchema,
  SessionsRewindResultSchema,
  SessionsSearchHitSchema,
  SessionsSearchParamsSchema,
  SessionsSearchResultSchema,
  SessionsSendParamsSchema,
  SessionsUsageParamsSchema,
  ShutdownEventSchema,
  SkillsBinsParamsSchema,
  SkillsBinsResultSchema,
  SkillsCuratorActionParamsSchema,
  SkillsCuratorActionResultSchema,
  SkillsCuratorStatusParamsSchema,
  SkillsCuratorStatusResultSchema,
  SkillsDetailParamsSchema,
  SkillsDetailResultSchema,
  SkillsInstallParamsSchema,
  SkillsProposalActionParamsSchema,
  SkillsProposalApplyResultSchema,
  SkillsProposalCreateParamsSchema,
  SkillsProposalHistoryScanParamsSchema,
  SkillsProposalHistoryScanResultSchema,
  SkillsProposalHistoryStatusParamsSchema,
  SkillsProposalInspectParamsSchema,
  SkillsProposalInspectResultSchema,
  SkillsProposalRecordResultSchema,
  SkillsProposalRequestRevisionParamsSchema,
  SkillsProposalRequestRevisionResultSchema,
  SkillsProposalReviseParamsSchema,
  SkillsProposalUpdateParamsSchema,
  SkillsProposalsListParamsSchema,
  SkillsProposalsListResultSchema,
  SkillsSearchParamsSchema,
  SkillsSearchResultSchema,
  SkillsSecurityVerdictsParamsSchema,
  SkillsSecurityVerdictsResultSchema,
  SkillsSkillCardParamsSchema,
  SkillsSkillCardResultSchema,
  SkillsStatusParamsSchema,
  SkillsUpdateParamsSchema,
  SkillsUploadBeginParamsSchema,
  SkillsUploadChunkParamsSchema,
  SkillsUploadCommitParamsSchema,
  SnapshotSchema,
  StateVersionSchema,
  SystemAgentApprovalPresentationSchema,
  SystemAgentChatHistoryParamsSchema,
  SystemAgentChatHistoryResultSchema,
  SystemAgentChatHistoryTurnSchema,
  SystemAgentChatParamsSchema,
  SystemAgentChatQuestionSchema,
  SystemAgentChatResultSchema,
  SystemAgentSetupActivateParamsSchema,
  SystemAgentSetupActivateResultSchema,
  SystemAgentSetupAuthStartParamsSchema,
  SystemAgentSetupAuthStartResultSchema,
  SystemAgentSetupDetectParamsSchema,
  SystemAgentSetupDetectResultSchema,
  SystemAgentSetupVerifyParamsSchema,
  SystemAgentSetupVerifyResultSchema,
  SystemChangeEntrySchema,
  SystemChangeKindSchema,
  SystemChangeSourceSchema,
  SystemChangesListParamsSchema,
  SystemChangesListResultSchema,
  SystemInfoParamsSchema,
  SystemInfoResultSchema,
  TalkAgentControlResultSchema,
  TalkCatalogParamsSchema,
  TalkCatalogResultSchema,
  TalkClientCloseParamsSchema,
  TalkClientCreateParamsSchema,
  TalkClientCreateResultSchema,
  TalkClientMutationResultSchema,
  TalkClientSteerParamsSchema,
  TalkClientToolCallParamsSchema,
  TalkClientToolCallResultSchema,
  TalkClientTranscriptParamsSchema,
  TalkConfigParamsSchema,
  TalkConfigResultSchema,
  TalkEventSchema,
  TalkModeParamsSchema,
  TalkSessionAcknowledgeMarkParamsSchema,
  TalkSessionAppendAudioParamsSchema,
  TalkSessionCancelOutputParamsSchema,
  TalkSessionCancelTurnParamsSchema,
  TalkSessionCloseParamsSchema,
  TalkSessionCreateParamsSchema,
  TalkSessionCreateResultSchema,
  TalkSessionJoinParamsSchema,
  TalkSessionJoinResultSchema,
  TalkSessionOkResultSchema,
  TalkSessionSteerParamsSchema,
  TalkSessionSubmitToolResultParamsSchema,
  TalkSessionTurnParamsSchema,
  TalkSessionTurnResultSchema,
  TalkSpeakParamsSchema,
  TalkSpeakResultSchema,
  TaskSuggestionEventSchema,
  TaskSuggestionResolutionSchema,
  TaskSuggestionSchema,
  TaskSuggestionsAcceptParamsSchema,
  TaskSuggestionsAcceptResultSchema,
  TaskSuggestionsCreateParamsSchema,
  TaskSuggestionsCreateResultSchema,
  TaskSuggestionsDismissParamsSchema,
  TaskSuggestionsDismissResultSchema,
  TaskSuggestionsListParamsSchema,
  TaskSuggestionsListResultSchema,
  TaskSummarySchema,
  TasksCancelParamsSchema,
  TasksCancelResultSchema,
  TasksGetParamsSchema,
  TasksGetResultSchema,
  TasksListParamsSchema,
  TasksListResultSchema,
  TerminalAckResultSchema,
  TerminalApprovalSnapshotSchema,
  TerminalAttachParamsSchema,
  TerminalAttachResultSchema,
  TerminalCloseParamsSchema,
  TerminalDataEventSchema,
  TerminalEventSchema,
  TerminalExitEventSchema,
  TerminalInputParamsSchema,
  TerminalListResultSchema,
  TerminalOpenParamsSchema,
  TerminalOpenResultSchema,
  TerminalResizeParamsSchema,
  TerminalSessionApprovalEventSchema,
  TerminalSessionInfoSchema,
  TerminalTextParamsSchema,
  TerminalTextResultSchema,
  TerminalUploadParamsSchema,
  TerminalUploadResultSchema,
  TickEventSchema,
  ToolCatalogEntrySchema,
  ToolCatalogGroupSchema,
  ToolCatalogProfileSchema,
  ToolsCatalogParamsSchema,
  ToolsCatalogResultSchema,
  ToolsEffectiveEntrySchema,
  ToolsEffectiveGroupSchema,
  ToolsEffectiveNoticeSchema,
  ToolsEffectiveParamsSchema,
  ToolsEffectiveResultSchema,
  ToolsInvokeErrorSchema,
  ToolsInvokeParamsSchema,
  ToolsInvokeResultSchema,
  TtsSpeakParamsSchema,
  TtsSpeakResultSchema,
  UiClosePaneCommandSchema,
  UiCommandParamsSchema,
  UiCommandResultSchema,
  UiCommandSchema,
  UiFocusCommandSchema,
  UiNavigateCommandSchema,
  UiPanelCommandSchema,
  UiSidebarCommandSchema,
  UiSplitCommandSchema,
  UpdateRunParamsSchema,
  UpdateStatusParamsSchema,
  UserProfileAvatarMimeSchema,
  UserProfileSchema,
  UsersLinkEmailParamsSchema,
  UsersLinkEmailResultSchema,
  UsersListParamsSchema,
  UsersListResultSchema,
  UsersSelfParamsSchema,
  UsersSelfResultSchema,
  UsersSetAvatarParamsSchema,
  UsersSetAvatarResultSchema,
  UsersSetDisplayNameParamsSchema,
  UsersSetDisplayNameResultSchema,
  WORKER_HEARTBEAT_INTERVAL_MS,
  WORKER_INFERENCE_MAX_CONTEXT_MESSAGES,
  WORKER_INFERENCE_MAX_OUTPUT_TOKENS,
  WORKER_INFERENCE_METHODS,
  WORKER_INFERENCE_PROTOCOL_FEATURE,
  WORKER_LIVE_EVENT_PROTOCOL_FEATURE,
  WORKER_PROTOCOL_FEATURES,
  WORKER_PROTOCOL_MAX_FEATURES,
  WORKER_PROTOCOL_MAX_FEATURE_LENGTH,
  WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH,
  WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH,
  WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES,
  WORKER_PROTOCOL_MAX_METHOD_LENGTH,
  WORKER_PROTOCOL_MAX_PAYLOAD_BYTES,
  WORKER_PROTOCOL_METHODS,
  WORKER_RPC_SET_VERSION,
  WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE,
  WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES,
  WORKER_TRANSCRIPT_MAX_CONTENT_PARTS,
  WORKER_TRANSCRIPT_MAX_JSON_DEPTH,
  WakeParamsSchema,
  WebLoginStartParamsSchema,
  WebLoginWaitParamsSchema,
  WebPushSubscribeParamsSchema,
  WebPushTestParamsSchema,
  WebPushUnsubscribeParamsSchema,
  WebPushVapidPublicKeyParamsSchema,
  WizardCancelParamsSchema,
  WizardNextParamsSchema,
  WizardNextResultSchema,
  WizardStartParamsSchema,
  WizardStartResultSchema,
  WizardStatusParamsSchema,
  WizardStatusResultSchema,
  WizardStepSchema,
  WorkerAdmissionFailureReasonSchema,
  WorkerAdmissionHandshakeSchema,
  WorkerAdmissionResponseFrameSchema,
  WorkerConnectRequestFrameSchema,
  WorkerEnvironmentMetadataSchema,
  WorkerEnvironmentStateSchema,
  WorkerHeartbeatParamsSchema,
  WorkerHeartbeatRequestFrameSchema,
  WorkerHeartbeatResponseFrameSchema,
  WorkerInferenceCancelRequestFrameSchema,
  WorkerInferenceCancelResponseFrameSchema,
  WorkerInferenceModelRefSchema,
  WorkerInferenceOptionsSchema,
  WorkerInferenceStartRequestFrameSchema,
  WorkerInferenceStartResponseFrameSchema,
  WorkerLiveEventErrorDetailsSchema,
  WorkerLiveEventErrorShapeSchema,
  WorkerLiveEventParamsSchema,
  WorkerLiveEventRequestFrameSchema,
  WorkerLiveEventResponseFrameSchema,
  WorkerLiveEventResultSchema,
  WorkerLiveEventSchema,
  WorkerProtocolCloseReasonSchema,
  WorkerTranscriptCommitErrorReasonSchema,
  WorkerTranscriptCommitErrorShapeSchema,
  WorkerTranscriptCommitParamsSchema,
  WorkerTranscriptCommitRequestFrameSchema,
  WorkerTranscriptCommitResponseFrameSchema,
  WorkerTranscriptCommitResultSchema,
  WorkerTranscriptMessageSchema,
  WorkerTunnelStatusSchema,
  WorktreeBranchSchema,
  WorktreeRecordSchema,
  WorktreesBranchesParamsSchema,
  WorktreesBranchesResultSchema,
  WorktreesCreateParamsSchema,
  WorktreesGcParamsSchema,
  WorktreesGcResultSchema,
  WorktreesListParamsSchema,
  WorktreesListResultSchema,
  WorktreesRemoveParamsSchema,
  WorktreesRemoveResultSchema,
  WorktreesRestoreParamsSchema,
  buildMissingScopeErrorDetails,
  errorShape,
  isCloudWorkerPlacementState,
  isMcpAppViewExpiredError,
  isWellFormedApprovalId,
  missingScopeErrorShape,
  readMissingScopeError,
  readMissingScopeErrorDetails,
  validateSkillsProposalHistoryScanParams,
  validateSkillsProposalHistoryStatusParams,
  validateSystemEventParams,
  validateWorkerInferenceCancelParams,
  validateWorkerInferenceEventFrame,
  validateWorkerInferenceStartParams,
  validateWorkerInferenceTerminalFrame,
  validateWorkerInferenceTerminalOutcome
};
