// packages/gateway-protocol/src/schema/agent.ts
import { Type as Type3 } from "typebox";

// packages/gateway-protocol/src/schema/closed-object.ts
import { Type } from "typebox";
function closedObject(properties) {
  return Type.Object(properties, { additionalProperties: false });
}

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

// packages/gateway-protocol/src/schema/approvals.ts
import { Type as Type6 } from "typebox";

// packages/gateway-protocol/src/schema/approval-id.ts
var APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN = "^(?!\\.{1,2}$)(?:[^\\uD800-\\uDFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF])+$";

// packages/gateway-protocol/src/schema/since.ts
function withSince(train, schema) {
  Object.assign(schema, { "x-openclaw-since": train });
  return schema;
}

// packages/gateway-protocol/src/schema/approvals.ts
var ApprovalIdSchema = Type6.String({
  minLength: 1,
  pattern: APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN,
  description: "Exact full approval id encoded safely in deep-link paths."
});
var ApprovalKindSchema = Type6.Union([
  Type6.Literal("exec"),
  Type6.Literal("plugin"),
  Type6.Literal("system-agent")
]);
var ApprovalDecisionSchema = Type6.Union([
  Type6.Literal("allow-once"),
  Type6.Literal("allow-always"),
  Type6.Literal("deny")
]);
var ApprovalAllowDecisionSchema = Type6.Union([
  Type6.Literal("allow-once"),
  Type6.Literal("allow-always")
]);
var ApprovalTerminalReasonSchema = Type6.Union([
  Type6.Literal("user"),
  Type6.Literal("timeout"),
  Type6.Literal("malformed-verdict"),
  Type6.Literal("no-route"),
  Type6.Literal("run-aborted"),
  Type6.Literal("gateway-restart"),
  Type6.Literal("storage-corrupt")
]);
var ApprovalAllowedReasonSchema = Type6.Union([Type6.Literal("user")]);
var ApprovalDeniedReasonSchema = Type6.Union([
  Type6.Literal("user"),
  Type6.Literal("malformed-verdict"),
  Type6.Literal("no-route"),
  Type6.Literal("storage-corrupt")
]);
var ApprovalExpiredReasonSchema = Type6.Union([Type6.Literal("timeout")]);
var ApprovalCancelledReasonSchema = Type6.Union([
  Type6.Literal("run-aborted"),
  Type6.Literal("gateway-restart")
]);
var PluginApprovalSeveritySchema = Type6.Union([
  Type6.Literal("info"),
  Type6.Literal("warning"),
  Type6.Literal("critical")
]);
var ApprovalAllowedDecisionsSchema = Type6.Array(ApprovalDecisionSchema, {
  minItems: 1,
  maxItems: 3,
  uniqueItems: true,
  contains: Type6.Literal("deny"),
  description: "Available reviewer decisions. Deny is always available so malformed or unsafe input can fail closed."
});
var SystemAgentApprovalAllowedDecisionsSchema = Type6.Tuple([
  Type6.Literal("allow-once"),
  Type6.Literal("deny")
]);
var ExecApprovalPresentationSchema = Type6.Object(
  {
    kind: Type6.Literal("exec"),
    commandText: NonEmptyString,
    commandPreview: Type6.Optional(Type6.Union([Type6.String(), Type6.Null()])),
    warningText: Type6.Optional(Type6.Union([Type6.String(), Type6.Null()])),
    host: Type6.Optional(Type6.Union([Type6.String(), Type6.Null()])),
    nodeId: Type6.Optional(Type6.Union([NonEmptyString, Type6.Null()])),
    agentId: Type6.Optional(Type6.Union([NonEmptyString, Type6.Null()])),
    allowedDecisions: ApprovalAllowedDecisionsSchema
  },
  {
    additionalProperties: false,
    description: "Reviewer-safe exec presentation. Runtime cwd, environment, system-run binding, and execution plan are intentionally excluded."
  }
);
var PluginApprovalPresentationSchema = closedObject({
  kind: Type6.Literal("plugin"),
  title: Type6.String({ minLength: 1, maxLength: 80 }),
  description: Type6.String({ minLength: 1, maxLength: 512 }),
  severity: PluginApprovalSeveritySchema,
  pluginId: Type6.Optional(Type6.Union([NonEmptyString, Type6.Null()])),
  toolName: Type6.Optional(Type6.Union([NonEmptyString, Type6.Null()])),
  agentId: Type6.Optional(Type6.Union([NonEmptyString, Type6.Null()])),
  allowedDecisions: ApprovalAllowedDecisionsSchema
});
var SystemAgentApprovalPresentationSchema = closedObject({
  kind: Type6.Literal("system-agent"),
  title: Type6.String({ minLength: 1, maxLength: 80 }),
  description: Type6.String({ minLength: 1, maxLength: 512 }),
  proposalHash: Type6.String({ pattern: "^[a-f0-9]{64}$" }),
  agentId: Type6.Optional(Type6.Union([NonEmptyString, Type6.Null()])),
  allowedDecisions: SystemAgentApprovalAllowedDecisionsSchema
});
var ApprovalPresentationSchema = Type6.Union([
  ExecApprovalPresentationSchema,
  PluginApprovalPresentationSchema,
  SystemAgentApprovalPresentationSchema
]);
var ApprovalRecordCommonFields = {
  id: ApprovalIdSchema,
  urlPath: NonEmptyString,
  createdAtMs: Type6.Integer({ minimum: 0 }),
  expiresAtMs: Type6.Integer({ minimum: 0 }),
  presentation: ApprovalPresentationSchema
};
var ApprovalHistorySourceAttributionSchema = closedObject({
  agentId: Type6.Optional(NonEmptyString),
  sessionKey: Type6.Optional(NonEmptyString)
});
var ApprovalHistoryResolverAttributionSchema = closedObject({
  kind: Type6.Union([
    Type6.Literal("device"),
    Type6.Literal("channel"),
    Type6.Literal("runtime"),
    Type6.Literal("system")
  ]),
  id: Type6.Optional(NonEmptyString)
});
var ApprovalResolutionFields = {
  resolvedAtMs: Type6.Integer({ minimum: 0 }),
  source: Type6.Optional(ApprovalHistorySourceAttributionSchema),
  resolver: Type6.Optional(ApprovalHistoryResolverAttributionSchema)
};
var PendingApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  status: Type6.Literal("pending")
});
var AllowedApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type6.Literal("allowed"),
  decision: ApprovalAllowDecisionSchema,
  reason: ApprovalAllowedReasonSchema
});
var DeniedApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type6.Literal("denied"),
  decision: Type6.Literal("deny"),
  reason: ApprovalDeniedReasonSchema
});
var ExpiredApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type6.Literal("expired"),
  reason: ApprovalExpiredReasonSchema
});
var CancelledApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type6.Literal("cancelled"),
  reason: ApprovalCancelledReasonSchema
});
var ApprovalSnapshotSchema = Type6.Union([
  PendingApprovalSnapshotSchema,
  AllowedApprovalSnapshotSchema,
  DeniedApprovalSnapshotSchema,
  ExpiredApprovalSnapshotSchema,
  CancelledApprovalSnapshotSchema
]);
var TerminalApprovalSnapshotSchema = Type6.Union([
  AllowedApprovalSnapshotSchema,
  DeniedApprovalSnapshotSchema,
  ExpiredApprovalSnapshotSchema,
  CancelledApprovalSnapshotSchema
]);
var ApprovalGetParamsSchema = closedObject({ id: ApprovalRecordCommonFields.id });
var ApprovalGetResultSchema = closedObject({ approval: ApprovalSnapshotSchema });
var ApprovalHistoryParamsSchema = closedObject({
  cursor: Type6.Optional(Type6.String({ minLength: 1, maxLength: 512 })),
  limit: Type6.Optional(Type6.Integer({ minimum: 1, maximum: 100 })),
  kind: Type6.Optional(ApprovalKindSchema)
});
var ApprovalHistoryResultSchema = closedObject({
  items: Type6.Array(TerminalApprovalSnapshotSchema),
  nextCursor: Type6.Optional(Type6.String({ minLength: 1, maxLength: 512 }))
});
var ApprovalResolveParamsSchema = closedObject({
  id: ApprovalRecordCommonFields.id,
  kind: ApprovalKindSchema,
  decision: ApprovalDecisionSchema
});
var ApprovalResolveResultSchema = closedObject({
  applied: Type6.Boolean(),
  approval: TerminalApprovalSnapshotSchema
});
var SessionApprovalEventCommonFields = {
  sessionKey: NonEmptyString,
  sourceSessionKey: Type6.Optional(NonEmptyString),
  updatedAtMs: Type6.Integer({ minimum: 0 })
};
var PendingSessionApprovalEventSchema = withSince(
  "2026.7",
  closedObject({
    ...SessionApprovalEventCommonFields,
    phase: Type6.Literal("pending"),
    approval: PendingApprovalSnapshotSchema
  })
);
var TerminalSessionApprovalEventSchema = withSince(
  "2026.7",
  closedObject({
    ...SessionApprovalEventCommonFields,
    phase: Type6.Literal("terminal"),
    approval: TerminalApprovalSnapshotSchema
  })
);
var SessionApprovalEventSchema = withSince(
  "2026.7",
  Type6.Union([PendingSessionApprovalEventSchema, TerminalSessionApprovalEventSchema])
);
var SessionApprovalReplaySchema = withSince(
  "2026.7",
  closedObject({
    sessionKey: NonEmptyString,
    updatedAtMs: Type6.Integer({ minimum: 0 }),
    approvals: Type6.Array(PendingApprovalSnapshotSchema),
    truncated: Type6.Boolean()
  })
);

// packages/gateway-protocol/src/schema/artifacts.ts
import { Type as Type7 } from "typebox";
var ArtifactQueryParamsProperties = {
  sessionKey: Type7.Optional(NonEmptyString),
  runId: Type7.Optional(NonEmptyString),
  taskId: Type7.Optional(NonEmptyString),
  agentId: Type7.Optional(NonEmptyString)
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
  mimeType: Type7.Optional(NonEmptyString),
  sizeBytes: Type7.Optional(Type7.Integer({ minimum: 0 })),
  sessionKey: Type7.Optional(NonEmptyString),
  runId: Type7.Optional(NonEmptyString),
  taskId: Type7.Optional(NonEmptyString),
  messageSeq: Type7.Optional(Type7.Integer({ minimum: 1 })),
  source: Type7.Optional(NonEmptyString),
  download: closedObject({
    mode: Type7.Union([Type7.Literal("bytes"), Type7.Literal("url"), Type7.Literal("unsupported")])
  })
});
var ArtifactsListParamsSchema = ArtifactQueryParamsSchema;
var ArtifactsListResultSchema = closedObject({
  artifacts: Type7.Array(ArtifactSummarySchema)
});
var ArtifactsGetParamsSchema = ArtifactGetParamsSchema;
var ArtifactsGetResultSchema = closedObject({
  artifact: ArtifactSummarySchema
});
var ArtifactsDownloadParamsSchema = ArtifactGetParamsSchema;
var ArtifactsDownloadResultSchema = closedObject({
  artifact: ArtifactSummarySchema,
  encoding: Type7.Optional(Type7.Literal("base64")),
  data: Type7.Optional(Type7.String()),
  url: Type7.Optional(NonEmptyString)
});

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

// packages/gateway-protocol/src/schema/channels.ts
import { Type as Type11 } from "typebox";
var TalkModeParamsSchema = closedObject({
  enabled: Type11.Boolean(),
  phase: Type11.Optional(Type11.String())
});
var TalkConfigParamsSchema = closedObject({
  includeSecrets: Type11.Optional(Type11.Boolean())
});
var TalkSpeakParamsSchema = closedObject({
  text: NonEmptyString,
  voiceId: Type11.Optional(Type11.String()),
  modelId: Type11.Optional(Type11.String()),
  outputFormat: Type11.Optional(Type11.String()),
  speed: Type11.Optional(Type11.Number()),
  rateWpm: Type11.Optional(Type11.Integer({ minimum: 1 })),
  stability: Type11.Optional(Type11.Number()),
  similarity: Type11.Optional(Type11.Number()),
  style: Type11.Optional(Type11.Number()),
  speakerBoost: Type11.Optional(Type11.Boolean()),
  seed: Type11.Optional(Type11.Integer({ minimum: 0 })),
  normalize: Type11.Optional(Type11.String()),
  language: Type11.Optional(Type11.String()),
  latencyTier: Type11.Optional(Type11.Integer({ minimum: 0 }))
});
var TtsSpeakParamsSchema = closedObject({
  text: NonEmptyString
});
var TalkModeSchema = Type11.Union([
  Type11.Literal("realtime"),
  Type11.Literal("stt-tts"),
  Type11.Literal("transcription")
]);
var TalkTransportSchema = Type11.Union([
  Type11.Literal("webrtc"),
  Type11.Literal("provider-websocket"),
  Type11.Literal("gateway-relay"),
  Type11.Literal("managed-room")
]);
var TalkBrainSchema = Type11.Union([
  Type11.Literal("agent-consult"),
  Type11.Literal("direct-tools"),
  Type11.Literal("none")
]);
var TalkAgentControlModeSchema = Type11.Union([
  Type11.Literal("status"),
  Type11.Literal("steer"),
  Type11.Literal("cancel"),
  Type11.Literal("followup")
]);
var TalkEventTypeSchema = Type11.Union([
  Type11.Literal("session.started"),
  Type11.Literal("session.ready"),
  Type11.Literal("session.closed"),
  Type11.Literal("session.error"),
  Type11.Literal("session.replaced"),
  Type11.Literal("turn.started"),
  Type11.Literal("turn.ended"),
  Type11.Literal("turn.cancelled"),
  Type11.Literal("capture.started"),
  Type11.Literal("capture.stopped"),
  Type11.Literal("capture.cancelled"),
  Type11.Literal("capture.once"),
  Type11.Literal("input.audio.delta"),
  Type11.Literal("input.audio.committed"),
  Type11.Literal("transcript.delta"),
  Type11.Literal("transcript.done"),
  Type11.Literal("output.text.delta"),
  Type11.Literal("output.text.done"),
  Type11.Literal("output.audio.started"),
  Type11.Literal("output.audio.delta"),
  Type11.Literal("output.audio.done"),
  Type11.Literal("tool.call"),
  Type11.Literal("tool.progress"),
  Type11.Literal("tool.result"),
  Type11.Literal("tool.error"),
  Type11.Literal("usage.metrics"),
  Type11.Literal("latency.metrics"),
  Type11.Literal("health.changed")
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
var TalkEventSchema = Type11.Object(
  {
    id: NonEmptyString,
    type: TalkEventTypeSchema,
    sessionId: NonEmptyString,
    turnId: Type11.Optional(Type11.String()),
    captureId: Type11.Optional(Type11.String()),
    seq: Type11.Integer({ minimum: 1 }),
    timestamp: NonEmptyString,
    mode: TalkModeSchema,
    transport: TalkTransportSchema,
    brain: TalkBrainSchema,
    provider: Type11.Optional(Type11.String()),
    final: Type11.Optional(Type11.Boolean()),
    callId: Type11.Optional(Type11.String()),
    itemId: Type11.Optional(Type11.String()),
    parentId: Type11.Optional(Type11.String()),
    payload: Type11.Unknown()
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
var VoiceIdString = Type11.String({ pattern: "^[A-Za-z0-9_-]{1,128}$" });
var TalkClientCreateParamsSchema = closedObject({
  sessionKey: Type11.Optional(NonEmptyString),
  voiceSessionId: Type11.Optional(VoiceIdString),
  provider: Type11.Optional(Type11.String()),
  model: Type11.Optional(Type11.String()),
  voice: Type11.Optional(Type11.String()),
  vadThreshold: Type11.Optional(Type11.Number()),
  silenceDurationMs: Type11.Optional(Type11.Integer({ minimum: 1 })),
  prefixPaddingMs: Type11.Optional(Type11.Integer({ minimum: 0 })),
  reasoningEffort: Type11.Optional(Type11.String()),
  mode: Type11.Optional(TalkModeSchema),
  transport: Type11.Optional(TalkTransportSchema),
  brain: Type11.Optional(TalkBrainSchema),
  capabilities: Type11.Optional(
    Type11.Array(Type11.Union([Type11.Literal("camera-frame"), Type11.Literal("voice-transcript")]), {
      uniqueItems: true
    })
  )
});
var TalkClientToolCallParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  voiceSessionId: Type11.Optional(VoiceIdString),
  callId: NonEmptyString,
  name: NonEmptyString,
  args: Type11.Optional(Type11.Unknown()),
  relaySessionId: Type11.Optional(NonEmptyString)
});
var TalkClientTranscriptParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  voiceSessionId: VoiceIdString,
  entryId: VoiceIdString,
  role: Type11.Union([Type11.Literal("user"), Type11.Literal("assistant")]),
  text: NonEmptyString,
  timestamp: Type11.Optional(Type11.Number())
});
var TalkClientCloseParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  voiceSessionId: VoiceIdString
});
var TalkClientMutationResultSchema = closedObject({
  ok: Type11.Literal(true)
});
var TalkClientToolCallResultSchema = closedObject({
  runId: NonEmptyString,
  idempotencyKey: NonEmptyString
});
var TalkClientSteerParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  text: NonEmptyString,
  mode: Type11.Optional(TalkAgentControlModeSchema)
});
var TalkAgentControlResultSchema = closedObject({
  ok: Type11.Boolean(),
  mode: TalkAgentControlModeSchema,
  sessionKey: NonEmptyString,
  sessionId: Type11.Optional(NonEmptyString),
  active: Type11.Boolean(),
  queued: Type11.Optional(Type11.Boolean()),
  aborted: Type11.Optional(Type11.Boolean()),
  target: Type11.Optional(Type11.Union([Type11.Literal("embedded_run"), Type11.Literal("reply_run")])),
  reason: Type11.Optional(Type11.String()),
  message: Type11.String(),
  speak: Type11.Boolean(),
  show: Type11.Boolean(),
  suppress: Type11.Boolean(),
  providerResult: Type11.Optional(
    closedObject({
      status: Type11.Literal("cancelled"),
      message: Type11.String()
    })
  ),
  enqueuedAtMs: Type11.Optional(Type11.Number()),
  deliveredAtMs: Type11.Optional(Type11.Number())
});
var TalkSessionJoinParamsSchema = closedObject({
  sessionId: NonEmptyString,
  token: NonEmptyString
});
var TalkSessionCreateParamsSchema = closedObject({
  sessionKey: Type11.Optional(Type11.String()),
  spawnedBy: Type11.Optional(NonEmptyString),
  provider: Type11.Optional(Type11.String()),
  model: Type11.Optional(Type11.String()),
  voice: Type11.Optional(Type11.String()),
  language: Type11.Optional(Type11.String({ pattern: "^[a-z]{2}$" })),
  vadThreshold: Type11.Optional(Type11.Number()),
  silenceDurationMs: Type11.Optional(Type11.Integer({ minimum: 1 })),
  prefixPaddingMs: Type11.Optional(Type11.Integer({ minimum: 0 })),
  reasoningEffort: Type11.Optional(Type11.String()),
  mode: Type11.Optional(TalkModeSchema),
  transport: Type11.Optional(TalkTransportSchema),
  brain: Type11.Optional(TalkBrainSchema),
  ttlMs: Type11.Optional(Type11.Integer({ minimum: 1e3, maximum: 36e5 }))
});
var TalkSessionAppendAudioParamsSchema = closedObject({
  sessionId: NonEmptyString,
  audioBase64: NonEmptyString,
  timestamp: Type11.Optional(Type11.Number())
});
var TalkSessionTurnParamsSchema = closedObject({
  sessionId: NonEmptyString,
  turnId: Type11.Optional(Type11.String())
});
var TalkSessionCancelTurnParamsSchema = closedObject({
  sessionId: NonEmptyString,
  turnId: Type11.Optional(Type11.String()),
  reason: Type11.Optional(Type11.String())
});
var TalkSessionCancelOutputParamsSchema = closedObject({
  sessionId: NonEmptyString,
  turnId: Type11.Optional(Type11.String()),
  reason: Type11.Optional(Type11.String())
});
var TalkSessionSubmitToolResultParamsSchema = closedObject({
  sessionId: NonEmptyString,
  callId: NonEmptyString,
  result: Type11.Unknown(),
  options: Type11.Optional(
    closedObject({
      suppressResponse: Type11.Optional(Type11.Boolean()),
      willContinue: Type11.Optional(Type11.Boolean())
    })
  )
});
var TalkSessionSteerParamsSchema = closedObject({
  sessionId: NonEmptyString,
  sessionKey: Type11.Optional(NonEmptyString),
  text: NonEmptyString,
  mode: Type11.Optional(TalkAgentControlModeSchema)
});
var TalkSessionCloseParamsSchema = closedObject({
  sessionId: NonEmptyString
});
var TalkSessionManagedRoomStateSchema = closedObject({
  activeClientId: Type11.Optional(Type11.String()),
  activeTurnId: Type11.Optional(Type11.String()),
  recentTalkEvents: Type11.Array(TalkEventSchema)
});
var TalkSessionManagedRoomRecordSchema = closedObject({
  id: NonEmptyString,
  roomId: NonEmptyString,
  roomUrl: NonEmptyString,
  sessionKey: NonEmptyString,
  sessionId: Type11.Optional(Type11.String()),
  channel: Type11.Optional(Type11.String()),
  target: Type11.Optional(Type11.String()),
  provider: Type11.Optional(Type11.String()),
  model: Type11.Optional(Type11.String()),
  voice: Type11.Optional(Type11.String()),
  mode: TalkModeSchema,
  transport: TalkTransportSchema,
  brain: TalkBrainSchema,
  createdAt: Type11.Number(),
  expiresAt: Type11.Number(),
  room: TalkSessionManagedRoomStateSchema
});
var TalkCatalogParamsSchema = closedObject({});
var TalkCatalogProviderSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  configured: Type11.Boolean(),
  aliases: Type11.Optional(Type11.Array(NonEmptyString)),
  models: Type11.Optional(Type11.Array(Type11.String())),
  voices: Type11.Optional(Type11.Array(Type11.String())),
  defaultModel: Type11.Optional(Type11.String()),
  modes: Type11.Optional(Type11.Array(TalkModeSchema)),
  transports: Type11.Optional(Type11.Array(TalkTransportSchema)),
  brains: Type11.Optional(Type11.Array(TalkBrainSchema)),
  inputAudioFormats: Type11.Optional(
    Type11.Array(
      closedObject({
        encoding: Type11.Union([Type11.Literal("pcm16"), Type11.Literal("g711_ulaw")]),
        sampleRateHz: Type11.Integer({ minimum: 1 }),
        channels: Type11.Integer({ minimum: 1 })
      })
    )
  ),
  outputAudioFormats: Type11.Optional(
    Type11.Array(
      closedObject({
        encoding: Type11.Union([Type11.Literal("pcm16"), Type11.Literal("g711_ulaw")]),
        sampleRateHz: Type11.Integer({ minimum: 1 }),
        channels: Type11.Integer({ minimum: 1 })
      })
    )
  ),
  supportsBrowserSession: Type11.Optional(Type11.Boolean()),
  supportsBargeIn: Type11.Optional(Type11.Boolean()),
  supportsToolCalls: Type11.Optional(Type11.Boolean()),
  supportsVideoFrames: Type11.Optional(Type11.Boolean()),
  supportsSessionResumption: Type11.Optional(Type11.Boolean())
});
var TalkCatalogProviderGroupSchema = closedObject({
  ready: Type11.Optional(Type11.Boolean()),
  activeProvider: Type11.Optional(Type11.String()),
  providers: Type11.Array(TalkCatalogProviderSchema)
});
var TalkCatalogResultSchema = closedObject({
  modes: Type11.Array(TalkModeSchema),
  transports: Type11.Array(TalkTransportSchema),
  brains: Type11.Array(TalkBrainSchema),
  speech: TalkCatalogProviderGroupSchema,
  transcription: TalkCatalogProviderGroupSchema,
  realtime: TalkCatalogProviderGroupSchema
});
var BrowserRealtimeAudioContractSchema = closedObject({
  inputEncoding: Type11.Union([Type11.Literal("pcm16"), Type11.Literal("g711_ulaw")]),
  inputSampleRateHz: Type11.Integer({ minimum: 1 }),
  outputEncoding: Type11.Union([Type11.Literal("pcm16"), Type11.Literal("g711_ulaw")]),
  outputSampleRateHz: Type11.Integer({ minimum: 1 })
});
var TalkSessionCreateResultSchema = closedObject({
  sessionId: NonEmptyString,
  provider: Type11.Optional(Type11.String()),
  mode: TalkModeSchema,
  transport: TalkTransportSchema,
  brain: TalkBrainSchema,
  relaySessionId: Type11.Optional(NonEmptyString),
  transcriptionSessionId: Type11.Optional(NonEmptyString),
  handoffId: Type11.Optional(NonEmptyString),
  roomId: Type11.Optional(NonEmptyString),
  roomUrl: Type11.Optional(NonEmptyString),
  token: Type11.Optional(NonEmptyString),
  audio: Type11.Optional(Type11.Unknown()),
  model: Type11.Optional(Type11.String()),
  voice: Type11.Optional(Type11.String()),
  expiresAt: Type11.Optional(Type11.Number())
});
var TalkSessionTurnResultSchema = closedObject({
  ok: Type11.Boolean(),
  turnId: Type11.Optional(Type11.String()),
  events: Type11.Optional(Type11.Array(TalkEventSchema))
});
var TalkSessionJoinResultSchema = TalkSessionManagedRoomRecordSchema;
var TalkSessionOkResultSchema = closedObject({
  ok: Type11.Boolean()
});
var BrowserRealtimeWebRtcSdpSessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type11.Literal("webrtc"),
  voiceSessionId: NonEmptyString,
  clientSecret: NonEmptyString,
  offerUrl: Type11.Optional(Type11.String()),
  offerHeaders: Type11.Optional(Type11.Record(Type11.String(), Type11.String())),
  model: Type11.Optional(Type11.String()),
  voice: Type11.Optional(Type11.String()),
  expiresAt: Type11.Optional(Type11.Number())
});
var BrowserRealtimeJsonPcmWebSocketSessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type11.Literal("provider-websocket"),
  voiceSessionId: NonEmptyString,
  protocol: NonEmptyString,
  clientSecret: NonEmptyString,
  websocketUrl: NonEmptyString,
  audio: BrowserRealtimeAudioContractSchema,
  initialMessage: Type11.Optional(Type11.Unknown()),
  model: Type11.Optional(Type11.String()),
  voice: Type11.Optional(Type11.String()),
  expiresAt: Type11.Optional(Type11.Number())
});
var BrowserRealtimeGatewayRelaySessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type11.Literal("gateway-relay"),
  // Server-owned: older gateways omit it and clients derive it from relaySessionId.
  voiceSessionId: Type11.Optional(NonEmptyString),
  relaySessionId: NonEmptyString,
  audio: BrowserRealtimeAudioContractSchema,
  model: Type11.Optional(Type11.String()),
  voice: Type11.Optional(Type11.String()),
  expiresAt: Type11.Optional(Type11.Number())
});
var BrowserRealtimeManagedRoomSessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type11.Literal("managed-room"),
  // Server-owned rooms carry no client voice bookkeeping yet.
  voiceSessionId: Type11.Optional(NonEmptyString),
  roomUrl: NonEmptyString,
  token: Type11.Optional(Type11.String()),
  model: Type11.Optional(Type11.String()),
  voice: Type11.Optional(Type11.String()),
  expiresAt: Type11.Optional(Type11.Number())
});
var TalkClientCreateResultSchema = Type11.Union([
  BrowserRealtimeWebRtcSdpSessionSchema,
  BrowserRealtimeJsonPcmWebSocketSessionSchema,
  BrowserRealtimeGatewayRelaySessionSchema,
  BrowserRealtimeManagedRoomSessionSchema
]);
var talkProviderFieldSchemas = {
  apiKey: Type11.Optional(SecretInputSchema)
};
var TalkProviderConfigSchema = Type11.Object(talkProviderFieldSchemas, {
  additionalProperties: true
});
var TalkRealtimeConfigSchema = closedObject({
  provider: Type11.Optional(Type11.String()),
  providers: Type11.Optional(Type11.Record(Type11.String(), TalkProviderConfigSchema)),
  model: Type11.Optional(Type11.String()),
  speakerVoice: Type11.Optional(Type11.String()),
  speakerVoiceId: Type11.Optional(Type11.String()),
  voice: Type11.Optional(Type11.String()),
  instructions: Type11.Optional(Type11.String()),
  mode: Type11.Optional(TalkModeSchema),
  transport: Type11.Optional(TalkTransportSchema),
  vadThreshold: Type11.Optional(Type11.Number({ minimum: 0, maximum: 1 })),
  silenceDurationMs: Type11.Optional(Type11.Integer({ minimum: 1 })),
  prefixPaddingMs: Type11.Optional(Type11.Integer({ minimum: 0 })),
  reasoningEffort: Type11.Optional(Type11.String({ minLength: 1 })),
  brain: Type11.Optional(TalkBrainSchema),
  consultRouting: Type11.Optional(
    Type11.Union([Type11.Literal("provider-direct"), Type11.Literal("force-agent-consult")])
  )
});
var ResolvedTalkConfigSchema = closedObject({
  provider: Type11.String(),
  config: TalkProviderConfigSchema
});
var TalkConfigSchema = closedObject({
  provider: Type11.Optional(Type11.String()),
  providers: Type11.Optional(Type11.Record(Type11.String(), TalkProviderConfigSchema)),
  realtime: Type11.Optional(TalkRealtimeConfigSchema),
  resolved: Type11.Optional(ResolvedTalkConfigSchema),
  consultThinkingLevel: Type11.Optional(Type11.String()),
  consultFastMode: Type11.Optional(Type11.Boolean()),
  speechLocale: Type11.Optional(Type11.String()),
  interruptOnSpeech: Type11.Optional(Type11.Boolean()),
  silenceTimeoutMs: Type11.Optional(Type11.Integer({ minimum: 1 }))
});
var TalkConfigResultSchema = closedObject({
  config: closedObject({
    talk: Type11.Optional(TalkConfigSchema),
    session: Type11.Optional(
      closedObject({
        mainKey: Type11.Optional(Type11.String())
      })
    ),
    ui: Type11.Optional(
      closedObject({
        seamColor: Type11.Optional(Type11.String())
      })
    )
  })
});
var TalkSpeakResultSchema = closedObject({
  audioBase64: NonEmptyString,
  provider: NonEmptyString,
  outputFormat: Type11.Optional(Type11.String()),
  voiceCompatible: Type11.Optional(Type11.Boolean()),
  mimeType: Type11.Optional(Type11.String()),
  fileExtension: Type11.Optional(Type11.String())
});
var TtsSpeakResultSchema = closedObject({
  audioBase64: NonEmptyString,
  provider: NonEmptyString,
  outputFormat: Type11.Optional(Type11.String()),
  mimeType: Type11.Optional(Type11.String()),
  fileExtension: Type11.Optional(Type11.String())
});
var ChannelsStatusParamsSchema = closedObject({
  probe: Type11.Optional(Type11.Boolean()),
  timeoutMs: Type11.Optional(Type11.Integer({ minimum: 0 })),
  channel: Type11.Optional(NonEmptyString)
});
var ChannelAccountSnapshotSchema = Type11.Object(
  {
    accountId: NonEmptyString,
    name: Type11.Optional(Type11.String()),
    enabled: Type11.Optional(Type11.Boolean()),
    configured: Type11.Optional(Type11.Boolean()),
    linked: Type11.Optional(Type11.Boolean()),
    running: Type11.Optional(Type11.Boolean()),
    connected: Type11.Optional(Type11.Boolean()),
    reconnectAttempts: Type11.Optional(Type11.Integer({ minimum: 0 })),
    lastConnectedAt: Type11.Optional(Type11.Integer({ minimum: 0 })),
    lastError: Type11.Optional(Type11.String()),
    healthState: Type11.Optional(Type11.String()),
    lastStartAt: Type11.Optional(Type11.Integer({ minimum: 0 })),
    lastStopAt: Type11.Optional(Type11.Integer({ minimum: 0 })),
    lastInboundAt: Type11.Optional(Type11.Integer({ minimum: 0 })),
    lastOutboundAt: Type11.Optional(Type11.Integer({ minimum: 0 })),
    lastTransportActivityAt: Type11.Optional(Type11.Integer({ minimum: 0 })),
    busy: Type11.Optional(Type11.Boolean()),
    activeRuns: Type11.Optional(Type11.Integer({ minimum: 0 })),
    lastRunActivityAt: Type11.Optional(Type11.Integer({ minimum: 0 })),
    lastProbeAt: Type11.Optional(Type11.Integer({ minimum: 0 })),
    mode: Type11.Optional(Type11.String()),
    dmPolicy: Type11.Optional(Type11.String()),
    allowFrom: Type11.Optional(Type11.Array(Type11.String())),
    tokenSource: Type11.Optional(Type11.String()),
    botTokenSource: Type11.Optional(Type11.String()),
    appTokenSource: Type11.Optional(Type11.String()),
    baseUrl: Type11.Optional(Type11.String()),
    allowUnmentionedGroups: Type11.Optional(Type11.Boolean()),
    cliPath: Type11.Optional(Type11.Union([Type11.String(), Type11.Null()])),
    dbPath: Type11.Optional(Type11.Union([Type11.String(), Type11.Null()])),
    port: Type11.Optional(Type11.Union([Type11.Integer({ minimum: 0 }), Type11.Null()])),
    probe: Type11.Optional(Type11.Unknown()),
    audit: Type11.Optional(Type11.Unknown()),
    application: Type11.Optional(Type11.Unknown())
  },
  { additionalProperties: true }
);
var ChannelUiMetaSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  detailLabel: NonEmptyString,
  systemImage: Type11.Optional(Type11.String())
});
var ChannelEventLoopHealthSchema = closedObject({
  degraded: Type11.Boolean(),
  reasons: Type11.Array(
    Type11.Union([
      Type11.Literal("event_loop_delay"),
      Type11.Literal("event_loop_utilization"),
      Type11.Literal("cpu")
    ])
  ),
  intervalMs: Type11.Integer({ minimum: 0 }),
  delayP99Ms: Type11.Number({ minimum: 0 }),
  delayMaxMs: Type11.Number({ minimum: 0 }),
  utilization: Type11.Number({ minimum: 0 }),
  cpuCoreRatio: Type11.Number({ minimum: 0 })
});
var ChannelsStatusResultSchema = closedObject({
  ts: Type11.Integer({ minimum: 0 }),
  channelOrder: Type11.Array(NonEmptyString),
  channelLabels: Type11.Record(NonEmptyString, NonEmptyString),
  channelDetailLabels: Type11.Optional(Type11.Record(NonEmptyString, NonEmptyString)),
  channelSystemImages: Type11.Optional(Type11.Record(NonEmptyString, NonEmptyString)),
  channelMeta: Type11.Optional(Type11.Array(ChannelUiMetaSchema)),
  channels: Type11.Record(NonEmptyString, Type11.Unknown()),
  channelAccounts: Type11.Record(NonEmptyString, Type11.Array(ChannelAccountSnapshotSchema)),
  channelDefaultAccountId: Type11.Record(NonEmptyString, NonEmptyString),
  eventLoop: Type11.Optional(ChannelEventLoopHealthSchema),
  partial: Type11.Optional(Type11.Boolean()),
  warnings: Type11.Optional(Type11.Array(Type11.String()))
});
var ChannelsLogoutParamsSchema = closedObject({
  channel: NonEmptyString,
  accountId: Type11.Optional(Type11.String())
});
var ChannelsStopParamsSchema = closedObject({
  channel: NonEmptyString,
  accountId: Type11.Optional(Type11.String())
});
var ChannelsStartParamsSchema = closedObject({
  channel: NonEmptyString,
  accountId: Type11.Optional(Type11.String())
});
var WebLoginStartParamsSchema = closedObject({
  force: Type11.Optional(Type11.Boolean()),
  timeoutMs: Type11.Optional(Type11.Integer({ minimum: 0 })),
  verbose: Type11.Optional(Type11.Boolean()),
  accountId: Type11.Optional(Type11.String())
});
var QrDataUrlSchema = Type11.String({
  maxLength: 16384,
  pattern: "^data:image/png;base64,"
});
var WebLoginWaitParamsSchema = closedObject({
  timeoutMs: Type11.Optional(Type11.Integer({ minimum: 0 })),
  accountId: Type11.Optional(Type11.String()),
  currentQrDataUrl: Type11.Optional(QrDataUrlSchema)
});

// packages/gateway-protocol/src/schema/commands.ts
import { Type as Type12 } from "typebox";
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
var BoundedNonEmptyString = (maxLength) => Type12.String({ minLength: 1, maxLength });
var CommandSourceSchema = Type12.Union([
  Type12.Literal("native"),
  Type12.Literal("skill"),
  Type12.Literal("plugin")
]);
var CommandScopeSchema = Type12.Union([
  Type12.Literal("text"),
  Type12.Literal("native"),
  Type12.Literal("both")
]);
var CommandCategorySchema = Type12.Union([
  Type12.Literal("session"),
  Type12.Literal("options"),
  Type12.Literal("status"),
  Type12.Literal("management"),
  Type12.Literal("media"),
  Type12.Literal("tools"),
  Type12.Literal("docks")
]);
var CommandArgChoiceSchema = closedObject({
  value: Type12.String({ maxLength: COMMAND_CHOICE_VALUE_MAX_LENGTH }),
  label: Type12.String({ maxLength: COMMAND_CHOICE_LABEL_MAX_LENGTH })
});
var CommandArgSchema = closedObject({
  name: BoundedNonEmptyString(COMMAND_ARG_NAME_MAX_LENGTH),
  description: Type12.String({ maxLength: COMMAND_ARG_DESCRIPTION_MAX_LENGTH }),
  type: Type12.Union([Type12.Literal("string"), Type12.Literal("number"), Type12.Literal("boolean")]),
  required: Type12.Optional(Type12.Boolean()),
  choices: Type12.Optional(
    Type12.Array(CommandArgChoiceSchema, { maxItems: COMMAND_ARG_CHOICES_MAX_ITEMS })
  ),
  dynamic: Type12.Optional(Type12.Boolean())
});
var CommandEntrySchema = closedObject({
  name: BoundedNonEmptyString(COMMAND_NAME_MAX_LENGTH),
  nativeName: Type12.Optional(BoundedNonEmptyString(COMMAND_NAME_MAX_LENGTH)),
  textAliases: Type12.Optional(
    Type12.Array(BoundedNonEmptyString(COMMAND_NAME_MAX_LENGTH), {
      maxItems: COMMAND_ALIAS_MAX_ITEMS
    })
  ),
  description: Type12.String({ maxLength: COMMAND_DESCRIPTION_MAX_LENGTH }),
  category: Type12.Optional(CommandCategorySchema),
  source: CommandSourceSchema,
  scope: CommandScopeSchema,
  acceptsArgs: Type12.Boolean(),
  args: Type12.Optional(Type12.Array(CommandArgSchema, { maxItems: COMMAND_ARGS_MAX_ITEMS }))
});
var CommandsListParamsSchema = closedObject({
  agentId: Type12.Optional(NonEmptyString),
  provider: Type12.Optional(NonEmptyString),
  scope: Type12.Optional(CommandScopeSchema),
  includeArgs: Type12.Optional(Type12.Boolean())
});
var CommandsListResultSchema = closedObject({
  commands: Type12.Array(CommandEntrySchema, { maxItems: COMMAND_LIST_MAX_ITEMS })
});

// packages/gateway-protocol/src/schema/config.ts
import { Type as Type13 } from "typebox";
var ConfigSchemaLookupPathString = Type13.String({
  minLength: 1,
  maxLength: 1024,
  pattern: "^[A-Za-z0-9_./\\[\\]\\-*]+$"
});
var ConfigDeliveryContextSchema = closedObject({
  channel: Type13.Optional(Type13.String()),
  to: Type13.Optional(Type13.String()),
  accountId: Type13.Optional(Type13.String()),
  threadId: Type13.Optional(Type13.Union([Type13.String(), Type13.Number()]))
});
var ConfigGetParamsSchema = closedObject({});
var ConfigSetParamsSchema = closedObject({
  raw: NonEmptyString,
  baseHash: Type13.Optional(NonEmptyString)
});
var ConfigApplyLikeParamProperties = {
  raw: NonEmptyString,
  baseHash: Type13.Optional(NonEmptyString),
  sessionKey: Type13.Optional(Type13.String()),
  deliveryContext: Type13.Optional(ConfigDeliveryContextSchema),
  note: Type13.Optional(Type13.String()),
  restartDelayMs: Type13.Optional(Type13.Integer({ minimum: 0 }))
};
var ConfigApplyLikeParamsSchema = closedObject(ConfigApplyLikeParamProperties);
var ConfigApplyParamsSchema = ConfigApplyLikeParamsSchema;
var ConfigPatchParamsSchema = closedObject({
  ...ConfigApplyLikeParamProperties,
  replacePaths: Type13.Optional(Type13.Array(NonEmptyString, { maxItems: 256 }))
});
var ConfigSchemaParamsSchema = closedObject({});
var ConfigSchemaLookupParamsSchema = closedObject({
  path: ConfigSchemaLookupPathString
});
var UpdateStatusParamsSchema = closedObject({});
var UpdateRunParamsSchema = closedObject({
  sessionKey: Type13.Optional(Type13.String()),
  deliveryContext: Type13.Optional(ConfigDeliveryContextSchema),
  note: Type13.Optional(Type13.String()),
  continuationMessage: Type13.Optional(Type13.String()),
  restartDelayMs: Type13.Optional(Type13.Integer({ minimum: 0 })),
  timeoutMs: Type13.Optional(Type13.Integer({ minimum: 1 }))
});
var ConfigUiHintSchema = closedObject({
  label: Type13.Optional(Type13.String()),
  help: Type13.Optional(Type13.String()),
  tags: Type13.Optional(Type13.Array(Type13.String())),
  group: Type13.Optional(Type13.String()),
  order: Type13.Optional(Type13.Integer()),
  advanced: Type13.Optional(Type13.Boolean()),
  sensitive: Type13.Optional(Type13.Boolean()),
  placeholder: Type13.Optional(Type13.String()),
  itemTemplate: Type13.Optional(Type13.Unknown())
});
var ConfigSchemaResponseSchema = closedObject({
  schema: Type13.Unknown(),
  uiHints: Type13.Record(Type13.String(), ConfigUiHintSchema),
  version: NonEmptyString,
  generatedAt: NonEmptyString
});
var ConfigSchemaLookupChildSchema = closedObject({
  key: NonEmptyString,
  path: NonEmptyString,
  type: Type13.Optional(Type13.Union([Type13.String(), Type13.Array(Type13.String())])),
  required: Type13.Boolean(),
  hasChildren: Type13.Boolean(),
  reloadKind: Type13.Optional(
    Type13.Union([Type13.Literal("restart"), Type13.Literal("hot"), Type13.Literal("none")])
  ),
  hint: Type13.Optional(ConfigUiHintSchema),
  hintPath: Type13.Optional(Type13.String())
});
var ConfigSchemaLookupResultSchema = closedObject({
  path: NonEmptyString,
  schema: Type13.Unknown(),
  reloadKind: Type13.Optional(
    Type13.Union([Type13.Literal("restart"), Type13.Literal("hot"), Type13.Literal("none")])
  ),
  hint: Type13.Optional(ConfigUiHintSchema),
  hintPath: Type13.Optional(Type13.String()),
  children: Type13.Array(ConfigSchemaLookupChildSchema)
});

// packages/gateway-protocol/src/schema/cron.ts
import { Type as Type14 } from "typebox";
function cronAgentTurnPayloadSchema(params) {
  return closedObject({
    kind: Type14.Literal("agentTurn"),
    message: params.message,
    model: Type14.Optional(params.model),
    fallbacks: Type14.Optional(params.fallbacks),
    thinking: Type14.Optional(params.thinking),
    timeoutSeconds: Type14.Optional(Type14.Number({ minimum: 0 })),
    allowUnsafeExternalContent: Type14.Optional(Type14.Boolean()),
    lightContext: Type14.Optional(Type14.Boolean()),
    toolsAllow: Type14.Optional(params.toolsAllow),
    // Server-managed marker for auto-stamped defaults; persisted so CLI cron
    // runs can drop only the cap that was never user-explicit.
    toolsAllowIsDefault: Type14.Optional(Type14.Boolean())
  });
}
function cronCommandPayloadSchema(params) {
  return closedObject({
    kind: Type14.Literal("command"),
    argv: params.argv,
    cwd: Type14.Optional(Type14.String({ minLength: 1 })),
    env: Type14.Optional(Type14.Record(Type14.String({ minLength: 1 }), Type14.String())),
    input: Type14.Optional(Type14.String()),
    timeoutSeconds: Type14.Optional(Type14.Number({ minimum: 0 })),
    noOutputTimeoutSeconds: Type14.Optional(Type14.Number({ minimum: 0 })),
    outputMaxBytes: Type14.Optional(Type14.Integer({ minimum: 1 })),
    toolsAllow: Type14.Optional(params.toolsAllow),
    toolsAllowIsDefault: Type14.Optional(Type14.Boolean())
  });
}
function cronScriptPayloadSchema(params) {
  return closedObject({
    kind: Type14.Literal("script"),
    script: params.script,
    timeoutSeconds: Type14.Optional(Type14.Number({ minimum: 1 })),
    toolBudget: Type14.Optional(Type14.Integer({ minimum: 1 })),
    toolsAllow: Type14.Optional(params.toolsAllow),
    toolsAllowIsDefault: Type14.Optional(Type14.Boolean())
  });
}
var CronSessionTargetSchema = Type14.Union([
  Type14.Literal("main"),
  Type14.Literal("isolated"),
  Type14.Literal("current"),
  Type14.String({ pattern: "^session:.+" })
]);
var CronWakeModeSchema = Type14.Union([Type14.Literal("next-heartbeat"), Type14.Literal("now")]);
function cronRunStatusSchema(options = {}) {
  return Type14.Union([Type14.Literal("ok"), Type14.Literal("error"), Type14.Literal("skipped")], options);
}
var CronRunStatusSchema = cronRunStatusSchema();
var CronConfigRevisionSchema = Type14.String({ minLength: 1, maxLength: 128 });
var DeprecatedCronRunStatusSchema = cronRunStatusSchema({
  deprecated: true,
  description: "Deprecated alias for lastRunStatus."
});
var CronSortDirSchema = Type14.Union([Type14.Literal("asc"), Type14.Literal("desc")]);
var CronJobsEnabledFilterSchema = Type14.Union([
  Type14.Literal("all"),
  Type14.Literal("enabled"),
  Type14.Literal("disabled")
]);
var CronJobsScheduleKindFilterSchema = Type14.Union([
  Type14.Literal("all"),
  Type14.Literal("at"),
  Type14.Literal("every"),
  Type14.Literal("cron"),
  Type14.Literal("on-exit")
]);
var CronJobsLastRunStatusFilterSchema = Type14.Union([
  Type14.Literal("all"),
  Type14.Literal("ok"),
  Type14.Literal("error"),
  Type14.Literal("skipped"),
  Type14.Literal("unknown")
]);
var CronJobsSortBySchema = Type14.Union([
  Type14.Literal("nextRunAtMs"),
  Type14.Literal("updatedAtMs"),
  Type14.Literal("name")
]);
var CronRunsStatusFilterSchema = Type14.Union([
  Type14.Literal("all"),
  Type14.Literal("ok"),
  Type14.Literal("error"),
  Type14.Literal("skipped")
]);
var CronRunsStatusValueSchema = Type14.Union([
  Type14.Literal("ok"),
  Type14.Literal("error"),
  Type14.Literal("skipped")
]);
var CronDeliveryStatusSchema = Type14.Union([
  Type14.Literal("delivered"),
  Type14.Literal("not-delivered"),
  Type14.Literal("unknown"),
  Type14.Literal("not-requested")
]);
var NonBlankString = Type14.String({ minLength: 1, pattern: "\\S" });
var CronDeclarationKeySchema = Type14.String({ minLength: 1, maxLength: 200, pattern: "\\S" });
var CronDisplayNameSchema = Type14.String({ minLength: 1, maxLength: 200, pattern: "\\S" });
var CronOwnerSchema = closedObject({
  agentId: Type14.Optional(NonEmptyString),
  sessionKey: Type14.Optional(NonEmptyString)
});
var CronAnnounceChannelSchema = Type14.Union([Type14.Literal("last"), NonBlankString]);
var CronFailoverReasonSchema = Type14.Union([
  Type14.Literal("auth"),
  Type14.Literal("auth_permanent"),
  Type14.Literal("format"),
  Type14.Literal("rate_limit"),
  Type14.Literal("overloaded"),
  Type14.Literal("billing"),
  Type14.Literal("server_error"),
  Type14.Literal("timeout"),
  Type14.Literal("context_overflow"),
  Type14.Literal("model_not_found"),
  Type14.Literal("session_expired"),
  Type14.Literal("empty_response"),
  Type14.Literal("no_error_details"),
  Type14.Literal("unclassified"),
  Type14.Literal("unknown")
]);
var CronRunDiagnosticSeveritySchema = Type14.Union([
  Type14.Literal("info"),
  Type14.Literal("warn"),
  Type14.Literal("error")
]);
var CronRunDiagnosticSourceSchema = Type14.Union([
  Type14.Literal("cron-preflight"),
  Type14.Literal("cron-setup"),
  Type14.Literal("model-preflight"),
  Type14.Literal("agent-run"),
  Type14.Literal("tool"),
  Type14.Literal("exec"),
  Type14.Literal("delivery")
]);
var CronRunDiagnosticSchema = closedObject({
  ts: Type14.Integer({ minimum: 0 }),
  source: CronRunDiagnosticSourceSchema,
  severity: CronRunDiagnosticSeveritySchema,
  message: Type14.String(),
  toolName: Type14.Optional(Type14.String()),
  exitCode: Type14.Optional(Type14.Union([Type14.Number(), Type14.Null()])),
  truncated: Type14.Optional(Type14.Boolean())
});
var CronRunDiagnosticsSchema = closedObject({
  summary: Type14.Optional(Type14.String()),
  entries: Type14.Array(CronRunDiagnosticSchema)
});
var CronCommonOptionalFields = {
  agentId: Type14.Optional(Type14.Union([NonEmptyString, Type14.Null()])),
  sessionKey: Type14.Optional(Type14.Union([NonEmptyString, Type14.Null()])),
  description: Type14.Optional(Type14.String()),
  enabled: Type14.Optional(Type14.Boolean()),
  deleteAfterRun: Type14.Optional(Type14.Boolean())
};
function cronIdOrJobIdParams(extraFields) {
  return Type14.Union([
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
var CronRunLogJobIdSchema = Type14.String({
  minLength: 1,
  // Prevent path traversal via separators in cron.runs id/jobId.
  pattern: "^[^/\\\\]+$"
});
var CronScheduleSchema = Type14.Union([
  closedObject({
    kind: Type14.Literal("at"),
    at: NonEmptyString
  }),
  closedObject({
    kind: Type14.Literal("every"),
    everyMs: Type14.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
    anchorMs: Type14.Optional(Type14.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }))
  }),
  closedObject({
    kind: Type14.Literal("cron"),
    expr: NonEmptyString,
    tz: Type14.Optional(Type14.String()),
    staggerMs: Type14.Optional(Type14.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }))
  }),
  closedObject({
    // Event-driven trigger: fires once when the gateway-owned watcher running
    // `command` exits. Survives per-turn CLI teardown (runs under the gateway
    // ProcessSupervisor, not the turn process tree).
    kind: Type14.Literal("on-exit"),
    command: NonEmptyString,
    cwd: Type14.Optional(NonEmptyString)
  })
]);
var CronTriggerSchema = closedObject({
  script: Type14.String({ minLength: 1, maxLength: 65536 }),
  once: Type14.Optional(Type14.Boolean())
});
var CronPacingSchema = Type14.Object(
  {
    min: Type14.Optional(NonBlankString),
    max: Type14.Optional(NonBlankString)
  },
  {
    additionalProperties: false,
    description: "Dynamic-cadence bounds; at least one of min or max is required"
  }
);
var CronPayloadSchema = Type14.Union([
  closedObject({
    kind: Type14.Literal("systemEvent"),
    text: NonEmptyString,
    toolsAllow: Type14.Optional(Type14.Array(Type14.String())),
    toolsAllowIsDefault: Type14.Optional(Type14.Boolean())
  }),
  cronAgentTurnPayloadSchema({
    message: NonEmptyString,
    model: Type14.String(),
    fallbacks: Type14.Array(Type14.String()),
    toolsAllow: Type14.Array(Type14.String()),
    thinking: Type14.String()
  }),
  cronCommandPayloadSchema({
    argv: Type14.Array(NonEmptyString, { minItems: 1 }),
    toolsAllow: Type14.Array(Type14.String())
  }),
  cronScriptPayloadSchema({
    script: Type14.String({ minLength: 1, maxLength: 65536 }),
    toolsAllow: Type14.Array(Type14.String())
  })
]);
var CronPayloadPatchSchema = Type14.Union([
  closedObject({
    kind: Type14.Literal("systemEvent"),
    text: Type14.Optional(NonEmptyString),
    toolsAllow: Type14.Optional(Type14.Union([Type14.Array(Type14.String()), Type14.Null()])),
    toolsAllowIsDefault: Type14.Optional(Type14.Boolean())
  }),
  cronAgentTurnPayloadSchema({
    message: Type14.Optional(NonEmptyString),
    model: Type14.Union([Type14.String(), Type14.Null()]),
    fallbacks: Type14.Union([Type14.Array(Type14.String()), Type14.Null()]),
    toolsAllow: Type14.Union([Type14.Array(Type14.String()), Type14.Null()]),
    thinking: Type14.Union([Type14.String(), Type14.Null()])
  }),
  cronCommandPayloadSchema({
    argv: Type14.Optional(Type14.Array(NonEmptyString, { minItems: 1 })),
    toolsAllow: Type14.Union([Type14.Array(Type14.String()), Type14.Null()])
  }),
  cronScriptPayloadSchema({
    script: Type14.Optional(Type14.String({ minLength: 1, maxLength: 65536 })),
    toolsAllow: Type14.Union([Type14.Array(Type14.String()), Type14.Null()])
  })
]);
var CronFailureAlertSchema = closedObject({
  after: Type14.Optional(Type14.Integer({ minimum: 1 })),
  channel: Type14.Optional(CronAnnounceChannelSchema),
  to: Type14.Optional(NonBlankString),
  cooldownMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  includeSkipped: Type14.Optional(Type14.Boolean()),
  mode: Type14.Optional(Type14.Union([Type14.Literal("announce"), Type14.Literal("webhook")])),
  accountId: Type14.Optional(NonEmptyString)
});
var CronFailureAlertPatchSchema = closedObject({
  after: Type14.Optional(Type14.Union([Type14.Integer({ minimum: 1 }), Type14.Null()])),
  channel: Type14.Optional(Type14.Union([CronAnnounceChannelSchema, Type14.Null()])),
  to: Type14.Optional(Type14.Union([NonBlankString, Type14.Null()])),
  cooldownMs: Type14.Optional(Type14.Union([Type14.Integer({ minimum: 0 }), Type14.Null()])),
  includeSkipped: Type14.Optional(Type14.Union([Type14.Boolean(), Type14.Null()])),
  mode: Type14.Optional(Type14.Union([Type14.Literal("announce"), Type14.Literal("webhook"), Type14.Null()])),
  accountId: Type14.Optional(Type14.Union([NonEmptyString, Type14.Null()]))
});
var CronFailureDestinationSchema = closedObject({
  channel: Type14.Optional(CronAnnounceChannelSchema),
  to: Type14.Optional(NonBlankString),
  accountId: Type14.Optional(NonEmptyString),
  mode: Type14.Optional(Type14.Union([Type14.Literal("announce"), Type14.Literal("webhook")]))
});
var CronFailureDestinationPatchSchema = closedObject({
  channel: Type14.Optional(Type14.Union([CronAnnounceChannelSchema, Type14.Null()])),
  to: Type14.Optional(Type14.Union([NonBlankString, Type14.Null()])),
  accountId: Type14.Optional(Type14.Union([NonEmptyString, Type14.Null()])),
  mode: Type14.Optional(Type14.Union([Type14.Literal("announce"), Type14.Literal("webhook"), Type14.Null()]))
});
var CronCompletionDestinationSchema = closedObject({
  mode: Type14.Literal("webhook"),
  to: NonBlankString
});
var CronDeliverySharedProperties = {
  channel: Type14.Optional(CronAnnounceChannelSchema),
  threadId: Type14.Optional(Type14.Union([Type14.String(), Type14.Number()])),
  accountId: Type14.Optional(NonEmptyString),
  bestEffort: Type14.Optional(Type14.Boolean()),
  failureDestination: Type14.Optional(CronFailureDestinationSchema)
};
var CronDeliveryPatchSharedProperties = {
  channel: Type14.Optional(Type14.Union([CronAnnounceChannelSchema, Type14.Null()])),
  threadId: Type14.Optional(Type14.Union([Type14.String(), Type14.Number(), Type14.Null()])),
  accountId: Type14.Optional(Type14.Union([NonEmptyString, Type14.Null()])),
  bestEffort: Type14.Optional(Type14.Boolean()),
  failureDestination: Type14.Optional(Type14.Union([CronFailureDestinationPatchSchema, Type14.Null()]))
};
var CronDeliveryNoopSchema = closedObject({
  mode: Type14.Literal("none"),
  ...CronDeliverySharedProperties,
  to: Type14.Optional(NonBlankString)
});
var CronDeliveryAnnounceSchema = closedObject({
  mode: Type14.Literal("announce"),
  ...CronDeliverySharedProperties,
  completionDestination: Type14.Optional(CronCompletionDestinationSchema),
  to: Type14.Optional(NonBlankString)
});
var CronDeliveryWebhookSchema = closedObject({
  mode: Type14.Literal("webhook"),
  ...CronDeliverySharedProperties,
  to: NonBlankString
});
var CronDeliverySchema = Type14.Union([
  CronDeliveryNoopSchema,
  CronDeliveryAnnounceSchema,
  CronDeliveryWebhookSchema
]);
var CronDeliveryPatchSchema = closedObject({
  mode: Type14.Optional(
    Type14.Union([Type14.Literal("none"), Type14.Literal("announce"), Type14.Literal("webhook")])
  ),
  ...CronDeliveryPatchSharedProperties,
  completionDestination: Type14.Optional(Type14.Union([CronCompletionDestinationSchema, Type14.Null()])),
  to: Type14.Optional(Type14.Union([NonBlankString, Type14.Null()]))
});
var CronFailureNotificationDeliverySchema = closedObject({
  delivered: Type14.Optional(Type14.Boolean()),
  status: CronDeliveryStatusSchema,
  error: Type14.Optional(Type14.String())
});
var CronJobStateSchema = closedObject({
  nextRunAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  runningAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  lastRunAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  lastRunStatus: Type14.Optional(CronRunStatusSchema),
  lastStatus: Type14.Optional(DeprecatedCronRunStatusSchema),
  lastError: Type14.Optional(Type14.String()),
  lastDiagnostics: Type14.Optional(CronRunDiagnosticsSchema),
  lastDiagnosticSummary: Type14.Optional(Type14.String()),
  lastErrorReason: Type14.Optional(CronFailoverReasonSchema),
  lastDurationMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  consecutiveErrors: Type14.Optional(Type14.Integer({ minimum: 0 })),
  consecutiveSkipped: Type14.Optional(Type14.Integer({ minimum: 0 })),
  lastDelivered: Type14.Optional(Type14.Boolean()),
  lastDeliveryStatus: Type14.Optional(CronDeliveryStatusSchema),
  lastDeliveryError: Type14.Optional(Type14.String()),
  lastFailureNotificationDelivered: Type14.Optional(Type14.Boolean()),
  lastFailureNotificationDeliveryStatus: Type14.Optional(CronDeliveryStatusSchema),
  lastFailureNotificationDeliveryError: Type14.Optional(Type14.String()),
  lastFailureAlertAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  lastTriggerEvalAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  triggerEvalCount: Type14.Optional(Type14.Integer({ minimum: 0 })),
  lastTriggerFireAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  triggerState: Type14.Optional(Type14.Unknown())
});
var CronJobStatePatchSchema = closedObject({
  nextRunAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  runningAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  lastRunAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  lastRunStatus: Type14.Optional(CronRunStatusSchema),
  lastStatus: Type14.Optional(DeprecatedCronRunStatusSchema),
  lastError: Type14.Optional(Type14.String()),
  lastErrorReason: Type14.Optional(CronFailoverReasonSchema),
  lastDurationMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  consecutiveErrors: Type14.Optional(Type14.Integer({ minimum: 0 })),
  consecutiveSkipped: Type14.Optional(Type14.Integer({ minimum: 0 })),
  lastDelivered: Type14.Optional(Type14.Boolean()),
  lastDeliveryStatus: Type14.Optional(CronDeliveryStatusSchema),
  lastDeliveryError: Type14.Optional(Type14.String()),
  lastFailureNotificationDelivered: Type14.Optional(Type14.Boolean()),
  lastFailureNotificationDeliveryStatus: Type14.Optional(CronDeliveryStatusSchema),
  lastFailureNotificationDeliveryError: Type14.Optional(Type14.String()),
  lastFailureAlertAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  lastTriggerEvalAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  triggerEvalCount: Type14.Optional(Type14.Integer({ minimum: 0 })),
  lastTriggerFireAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  triggerState: Type14.Optional(Type14.Unknown())
});
var CronJobSchema = closedObject({
  id: NonEmptyString,
  declarationKey: Type14.Optional(CronDeclarationKeySchema),
  displayName: Type14.Optional(CronDisplayNameSchema),
  owner: Type14.Optional(CronOwnerSchema),
  agentId: Type14.Optional(NonEmptyString),
  sessionKey: Type14.Optional(NonEmptyString),
  name: NonEmptyString,
  description: Type14.Optional(Type14.String()),
  enabled: Type14.Boolean(),
  deleteAfterRun: Type14.Optional(Type14.Boolean()),
  createdAtMs: Type14.Integer({ minimum: 0 }),
  updatedAtMs: Type14.Integer({ minimum: 0 }),
  /** Opaque Gateway-computed token for the job definition, excluding scheduler state. */
  configRevision: Type14.Optional(CronConfigRevisionSchema),
  schedule: CronScheduleSchema,
  pacing: Type14.Optional(CronPacingSchema),
  trigger: Type14.Optional(CronTriggerSchema),
  sessionTarget: CronSessionTargetSchema,
  wakeMode: CronWakeModeSchema,
  payload: CronPayloadSchema,
  delivery: Type14.Optional(CronDeliverySchema),
  failureAlert: Type14.Optional(Type14.Union([Type14.Literal(false), CronFailureAlertSchema])),
  state: CronJobStateSchema,
  nextRunAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  lastRunAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  lastRunStatus: Type14.Optional(CronRunStatusSchema),
  lastRunError: Type14.Optional(Type14.String()),
  lastDelivered: Type14.Optional(Type14.Boolean()),
  lastDeliveryStatus: Type14.Optional(CronDeliveryStatusSchema),
  lastDeliveryError: Type14.Optional(Type14.String()),
  lastFailureNotificationDelivered: Type14.Optional(Type14.Boolean()),
  lastFailureNotificationDeliveryStatus: Type14.Optional(CronDeliveryStatusSchema),
  lastFailureNotificationDeliveryError: Type14.Optional(Type14.String())
});
var CronListParamsSchema = closedObject({
  includeDisabled: Type14.Optional(Type14.Boolean()),
  limit: Type14.Optional(Type14.Integer({ minimum: 1, maximum: 200 })),
  offset: Type14.Optional(Type14.Integer({ minimum: 0 })),
  query: Type14.Optional(Type14.String()),
  enabled: Type14.Optional(CronJobsEnabledFilterSchema),
  scheduleKind: Type14.Optional(CronJobsScheduleKindFilterSchema),
  lastRunStatus: Type14.Optional(CronJobsLastRunStatusFilterSchema),
  sortBy: Type14.Optional(CronJobsSortBySchema),
  sortDir: Type14.Optional(CronSortDirSchema),
  agentId: Type14.Optional(NonEmptyString),
  compact: Type14.Optional(Type14.Boolean())
});
var CronStatusParamsSchema = closedObject({});
var CronGetParamsSchema = cronIdOrJobIdParams({});
var CronAddParamsSchema = closedObject({
  name: NonEmptyString,
  declarationKey: Type14.Optional(CronDeclarationKeySchema),
  displayName: Type14.Optional(CronDisplayNameSchema),
  owner: Type14.Optional(CronOwnerSchema),
  ...CronCommonOptionalFields,
  schedule: CronScheduleSchema,
  pacing: Type14.Optional(CronPacingSchema),
  trigger: Type14.Optional(CronTriggerSchema),
  sessionTarget: CronSessionTargetSchema,
  wakeMode: CronWakeModeSchema,
  payload: CronPayloadSchema,
  delivery: Type14.Optional(CronDeliverySchema),
  failureAlert: Type14.Optional(Type14.Union([Type14.Literal(false), CronFailureAlertSchema]))
});
var CronDeclarativeAddResultSchema = closedObject({
  created: Type14.Boolean(),
  updated: Type14.Optional(Type14.Boolean()),
  job: CronJobSchema
});
var CronAddResultSchema = Type14.Union([CronJobSchema, CronDeclarativeAddResultSchema]);
var CronJobPatchSchema = closedObject({
  name: Type14.Optional(NonEmptyString),
  displayName: Type14.Optional(Type14.Union([CronDisplayNameSchema, Type14.Null()])),
  ...CronCommonOptionalFields,
  schedule: Type14.Optional(CronScheduleSchema),
  pacing: Type14.Optional(Type14.Union([CronPacingSchema, Type14.Null()])),
  trigger: Type14.Optional(Type14.Union([CronTriggerSchema, Type14.Null()])),
  sessionTarget: Type14.Optional(CronSessionTargetSchema),
  wakeMode: Type14.Optional(CronWakeModeSchema),
  payload: Type14.Optional(CronPayloadPatchSchema),
  delivery: Type14.Optional(CronDeliveryPatchSchema),
  failureAlert: Type14.Optional(
    Type14.Union([Type14.Literal(false), CronFailureAlertPatchSchema, Type14.Null()])
  ),
  state: Type14.Optional(CronJobStatePatchSchema)
});
var CronUpdateParamsSchema = cronIdOrJobIdParams({
  patch: CronJobPatchSchema,
  /** Rejects the patch when the current definition does not match the caller's token. */
  expectedConfigRevision: Type14.Optional(CronConfigRevisionSchema)
});
var CronRemoveParamsSchema = cronIdOrJobIdParams({});
var CronRunParamsSchema = cronIdOrJobIdParams({
  mode: Type14.Optional(Type14.Union([Type14.Literal("due"), Type14.Literal("force")])),
  /** Rejects the mutation if the Gateway restarted after the caller's preflight. */
  expectedProcessInstanceId: Type14.Optional(NonEmptyString)
});
var CronRunsParamsSchema = closedObject({
  agentId: Type14.Optional(NonEmptyString),
  scope: Type14.Optional(Type14.Union([Type14.Literal("job"), Type14.Literal("all")])),
  id: Type14.Optional(CronRunLogJobIdSchema),
  jobId: Type14.Optional(CronRunLogJobIdSchema),
  runId: Type14.Optional(NonEmptyString),
  limit: Type14.Optional(Type14.Integer({ minimum: 1, maximum: 200 })),
  offset: Type14.Optional(Type14.Integer({ minimum: 0 })),
  statuses: Type14.Optional(Type14.Array(CronRunsStatusValueSchema, { minItems: 1, maxItems: 3 })),
  status: Type14.Optional(CronRunsStatusFilterSchema),
  deliveryStatuses: Type14.Optional(
    Type14.Array(CronDeliveryStatusSchema, { minItems: 1, maxItems: 4 })
  ),
  deliveryStatus: Type14.Optional(CronDeliveryStatusSchema),
  query: Type14.Optional(Type14.String()),
  sortDir: Type14.Optional(CronSortDirSchema)
});
var CronRunLogEntrySchema = closedObject({
  ts: Type14.Integer({ minimum: 0 }),
  jobId: NonEmptyString,
  action: Type14.Literal("finished"),
  status: Type14.Optional(CronRunStatusSchema),
  error: Type14.Optional(Type14.String()),
  errorReason: Type14.Optional(CronFailoverReasonSchema),
  summary: Type14.Optional(Type14.String()),
  diagnostics: Type14.Optional(CronRunDiagnosticsSchema),
  delivered: Type14.Optional(Type14.Boolean()),
  deliveryStatus: Type14.Optional(CronDeliveryStatusSchema),
  deliveryError: Type14.Optional(Type14.String()),
  failureNotificationDelivery: Type14.Optional(CronFailureNotificationDeliverySchema),
  sessionId: Type14.Optional(NonEmptyString),
  sessionKey: Type14.Optional(NonEmptyString),
  runId: Type14.Optional(NonEmptyString),
  runAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  durationMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  nextRunAtMs: Type14.Optional(Type14.Integer({ minimum: 0 })),
  triggerFired: Type14.Optional(Type14.Boolean()),
  model: Type14.Optional(Type14.String()),
  provider: Type14.Optional(Type14.String()),
  usage: Type14.Optional(
    closedObject({
      input_tokens: Type14.Optional(Type14.Number()),
      output_tokens: Type14.Optional(Type14.Number()),
      total_tokens: Type14.Optional(Type14.Number()),
      cache_read_tokens: Type14.Optional(Type14.Number()),
      cache_write_tokens: Type14.Optional(Type14.Number())
    })
  ),
  jobName: Type14.Optional(Type14.String())
});

// packages/gateway-protocol/src/schema/devices.ts
import { Type as Type15 } from "typebox";
var DevicePairListParamsSchema = closedObject({});
var DevicePairApproveParamsSchema = closedObject({ requestId: NonEmptyString });
var DevicePairRejectParamsSchema = closedObject({ requestId: NonEmptyString });
var DevicePairRemoveParamsSchema = closedObject({ deviceId: NonEmptyString });
var DevicePairLabelString = Type15.String({ minLength: 1, maxLength: 64 });
var DevicePairRenameParamsSchema = closedObject({
  deviceId: NonEmptyString,
  label: DevicePairLabelString
});
var DeviceTokenRotateParamsSchema = closedObject({
  deviceId: NonEmptyString,
  role: NonEmptyString,
  scopes: Type15.Optional(Type15.Array(NonEmptyString))
});
var DeviceTokenRevokeParamsSchema = closedObject({
  deviceId: NonEmptyString,
  role: NonEmptyString
});
var DevicePairRequestedEventSchema = closedObject({
  requestId: NonEmptyString,
  deviceId: NonEmptyString,
  publicKey: NonEmptyString,
  displayName: Type15.Optional(NonEmptyString),
  platform: Type15.Optional(NonEmptyString),
  deviceFamily: Type15.Optional(NonEmptyString),
  clientId: Type15.Optional(NonEmptyString),
  clientMode: Type15.Optional(NonEmptyString),
  browserOrigin: Type15.Optional(NonEmptyString),
  role: Type15.Optional(NonEmptyString),
  roles: Type15.Optional(Type15.Array(NonEmptyString)),
  scopes: Type15.Optional(Type15.Array(NonEmptyString)),
  remoteIp: Type15.Optional(NonEmptyString),
  silent: Type15.Optional(Type15.Boolean()),
  isRepair: Type15.Optional(Type15.Boolean()),
  ts: Type15.Integer({ minimum: 0 })
});
var DevicePairResolvedEventSchema = closedObject({
  requestId: NonEmptyString,
  deviceId: NonEmptyString,
  decision: NonEmptyString,
  ts: Type15.Integer({ minimum: 0 })
});
var SetupCodeQrDataUrlSchema = Type15.String({
  maxLength: 16384,
  pattern: "^data:image/png;base64,"
});
var DevicePairSetupCodeParamsSchema = closedObject({
  publicUrl: Type15.Optional(NonEmptyString),
  preferRemoteUrl: Type15.Optional(Type15.Boolean()),
  includeQr: Type15.Optional(Type15.Boolean()),
  bootstrapProfile: Type15.Optional(Type15.String({ enum: ["limited", "node"] }))
});
var DevicePairSetupCodeResultSchema = closedObject({
  setupCode: NonEmptyString,
  qrDataUrl: Type15.Optional(SetupCodeQrDataUrlSchema),
  gatewayUrl: NonEmptyString,
  gatewayUrls: Type15.Optional(
    Type15.Array(NonEmptyString, { minItems: 2, maxItems: 8, uniqueItems: true })
  ),
  auth: Type15.Union([Type15.Literal("token"), Type15.Literal("password")]),
  urlSource: NonEmptyString,
  access: Type15.Optional(
    Type15.Union([Type15.Literal("full"), Type15.Literal("limited"), Type15.Literal("node")])
  ),
  accessDowngraded: Type15.Optional(Type15.Boolean())
});

// packages/gateway-protocol/src/schema/environments.ts
import { Type as Type16 } from "typebox";
var EnvironmentStatusSchema = Type16.String({
  enum: ["available", "unavailable", "starting", "stopping", "error"]
});
var WorkerEnvironmentStateSchema = Type16.Union([
  Type16.Literal("requested"),
  Type16.Literal("provisioning"),
  Type16.Literal("bootstrapping"),
  Type16.Literal("ready"),
  Type16.Literal("attached"),
  Type16.Literal("idle"),
  Type16.Literal("draining"),
  Type16.Literal("destroying"),
  Type16.Literal("destroyed"),
  Type16.Literal("failed"),
  Type16.Literal("orphaned")
]);
var WorkerTunnelStatusSchema = Type16.Union([
  Type16.Literal("stopped"),
  Type16.Literal("connecting"),
  Type16.Literal("connected"),
  Type16.Literal("reconnecting")
]);
var WorkerEnvironmentMetadataSchema = closedObject({
  providerId: NonEmptyString,
  leaseId: Type16.Optional(NonEmptyString),
  state: WorkerEnvironmentStateSchema,
  ageMs: Type16.Integer({ minimum: 0 }),
  idleMs: Type16.Optional(Type16.Integer({ minimum: 0 })),
  attachedSessionIds: Type16.Array(NonEmptyString),
  tunnelStatus: WorkerTunnelStatusSchema
});
function createEnvironmentSummarySchema() {
  return closedObject({
    id: NonEmptyString,
    type: NonEmptyString,
    label: Type16.Optional(NonEmptyString),
    status: EnvironmentStatusSchema,
    capabilities: Type16.Optional(Type16.Array(NonEmptyString)),
    worker: Type16.Optional(WorkerEnvironmentMetadataSchema)
  });
}
var EnvironmentSummarySchema = createEnvironmentSummarySchema();
var EnvironmentsListParamsSchema = closedObject({});
var WorkerEnvironmentProfileSummarySchema = closedObject({
  id: NonEmptyString,
  providerId: NonEmptyString
});
var EnvironmentsListResultSchema = closedObject({
  environments: Type16.Array(EnvironmentSummarySchema),
  profiles: Type16.Optional(Type16.Array(WorkerEnvironmentProfileSummarySchema))
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
  force: Type16.Optional(Type16.Boolean())
});
var EnvironmentsDestroyResultSchema = createEnvironmentSummarySchema();

// packages/gateway-protocol/src/schema/error-codes.ts
import { Type as Type17 } from "typebox";

// packages/gateway-protocol/src/gateway-error-details.ts
var GatewayErrorDetailCodes = {
  MISSING_SCOPE: "MISSING_SCOPE",
  MCP_APP_VIEW_EXPIRED: "MCP_APP_VIEW_EXPIRED"
};

// packages/gateway-protocol/src/schema/error-codes.ts
var MissingScopeErrorDetailsSchema = closedObject({
  code: Type17.Literal(GatewayErrorDetailCodes.MISSING_SCOPE),
  missingScope: NonEmptyString,
  requiredScopes: Type17.Array(NonEmptyString, { minItems: 1 })
});
var McpAppViewExpiredErrorDetailsSchema = closedObject({
  code: Type17.Literal(GatewayErrorDetailCodes.MCP_APP_VIEW_EXPIRED)
});
var GatewayErrorDetailsSchema = Type17.Union([
  MissingScopeErrorDetailsSchema,
  McpAppViewExpiredErrorDetailsSchema
]);

// packages/gateway-protocol/src/schema/exec-approvals.ts
import { Type as Type18 } from "typebox";
var ExecApprovalsAllowlistEntrySchema = closedObject({
  id: Type18.Optional(NonEmptyString),
  pattern: Type18.String(),
  source: Type18.Optional(Type18.Literal("allow-always")),
  commandText: Type18.Optional(Type18.String()),
  argPattern: Type18.Optional(Type18.String()),
  lastUsedAt: Type18.Optional(Type18.Number({ minimum: 0 })),
  lastUsedCommand: Type18.Optional(Type18.String()),
  lastResolvedPath: Type18.Optional(Type18.String())
});
var ExecApprovalsPolicyFields = {
  security: Type18.Optional(Type18.String()),
  ask: Type18.Optional(Type18.String()),
  askFallback: Type18.Optional(Type18.String()),
  autoAllowSkills: Type18.Optional(Type18.Boolean())
};
var ExecSecuritySchema = Type18.Union([
  Type18.Literal("deny"),
  Type18.Literal("allowlist"),
  Type18.Literal("full")
]);
var ExecAskSchema = Type18.Union([
  Type18.Literal("off"),
  Type18.Literal("on-miss"),
  Type18.Literal("always")
]);
var ExecApprovalsResolvedDefaultsSchema = closedObject({
  security: ExecSecuritySchema,
  ask: ExecAskSchema,
  askFallback: ExecSecuritySchema,
  autoAllowSkills: Type18.Boolean()
});
var ExecApprovalsDefaultsSchema = closedObject(ExecApprovalsPolicyFields);
var ExecApprovalsAgentSchema = closedObject({
  ...ExecApprovalsPolicyFields,
  allowlist: Type18.Optional(Type18.Array(ExecApprovalsAllowlistEntrySchema))
});
var ExecApprovalsFileSchema = closedObject({
  version: Type18.Literal(1),
  socket: Type18.Optional(
    closedObject({
      path: Type18.Optional(Type18.String()),
      token: Type18.Optional(Type18.String())
    })
  ),
  defaults: Type18.Optional(ExecApprovalsDefaultsSchema),
  agents: Type18.Optional(Type18.Record(Type18.String(), ExecApprovalsAgentSchema))
});
var ExecApprovalsSnapshotSchema = closedObject({
  path: NonEmptyString,
  exists: Type18.Boolean(),
  hash: NonEmptyString,
  file: ExecApprovalsFileSchema
});
var NativeExecApprovalActionSchema = Type18.Union([
  Type18.Literal("allow"),
  Type18.Literal("deny"),
  Type18.Literal("prompt")
]);
var NativeExecApprovalRuleSchema = closedObject({
  pattern: NonEmptyString,
  action: NativeExecApprovalActionSchema,
  shells: Type18.Optional(Type18.Array(NonEmptyString)),
  description: Type18.Optional(Type18.String()),
  enabled: Type18.Optional(Type18.Boolean())
});
var NativeExecApprovalConstraintsSchema = closedObject({
  baseHashRequired: Type18.Optional(Type18.Boolean()),
  defaultAllowAllowed: Type18.Optional(Type18.Boolean()),
  broadAllowRulesAllowed: Type18.Optional(Type18.Boolean()),
  dangerousAllowRulesAllowed: Type18.Optional(Type18.Boolean())
});
var ExecApprovalsNodeSnapshotSchema = Type18.Object(
  {
    path: Type18.Optional(Type18.String()),
    exists: Type18.Optional(Type18.Boolean()),
    hash: Type18.Optional(Type18.String()),
    file: Type18.Optional(ExecApprovalsFileSchema),
    resolvedDefaults: Type18.Optional(ExecApprovalsResolvedDefaultsSchema),
    enabled: Type18.Optional(Type18.Boolean()),
    baseHash: Type18.Optional(NonEmptyString),
    defaultAction: Type18.Optional(NativeExecApprovalActionSchema),
    rules: Type18.Optional(Type18.Array(NativeExecApprovalRuleSchema)),
    constraints: Type18.Optional(NativeExecApprovalConstraintsSchema),
    message: Type18.Optional(Type18.String())
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
  baseHash: Type18.Optional(NonEmptyString)
});
var ExecApprovalsNodeGetParamsSchema = closedObject({
  nodeId: NonEmptyString
});
var NativeExecApprovalPolicySchema = closedObject({
  defaultAction: Type18.Optional(NativeExecApprovalActionSchema),
  // Windows treats set as full replacement; omission would silently clear the rule list.
  rules: Type18.Array(NativeExecApprovalRuleSchema)
});
var ExecApprovalsNodeSetParamsSchema = Type18.Object(
  {
    nodeId: NonEmptyString,
    file: Type18.Optional(ExecApprovalsFileSchema),
    native: Type18.Optional(NativeExecApprovalPolicySchema),
    baseHash: Type18.Optional(NonEmptyString)
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
var ExecApprovalPolicySecuritySchema = Type18.Union([
  Type18.Literal("deny"),
  Type18.Literal("allowlist"),
  Type18.Literal("full")
]);
var ExecApprovalPolicySnapshotSchema = closedObject({
  security: ExecApprovalPolicySecuritySchema,
  ask: Type18.Union([Type18.Literal("off"), Type18.Literal("on-miss"), Type18.Literal("always")]),
  askFallback: ExecApprovalPolicySecuritySchema,
  autoAllowSkills: Type18.Boolean(),
  allowlistRules: Type18.Array(
    closedObject({
      pattern: Type18.String(),
      argPattern: Type18.Optional(Type18.String()),
      source: Type18.Optional(Type18.Literal("allow-always"))
    })
  )
});
var ExecApprovalRequestParamsSchema = closedObject({
  id: Type18.Optional(NonEmptyString),
  command: Type18.Optional(NonEmptyString),
  commandArgv: Type18.Optional(Type18.Array(Type18.String())),
  systemRunPlan: Type18.Optional(
    closedObject({
      argv: Type18.Array(Type18.String()),
      cwd: Type18.Union([Type18.String(), Type18.Null()]),
      commandText: Type18.String(),
      commandPreview: Type18.Optional(Type18.Union([Type18.String(), Type18.Null()])),
      agentId: Type18.Union([Type18.String(), Type18.Null()]),
      sessionKey: Type18.Union([Type18.String(), Type18.Null()]),
      policySnapshot: Type18.Optional(ExecApprovalPolicySnapshotSchema),
      mutableFileOperand: Type18.Optional(
        Type18.Union([
          closedObject({
            argvIndex: Type18.Integer({ minimum: 0 }),
            path: Type18.String(),
            sha256: Type18.String()
          }),
          Type18.Null()
        ])
      )
    })
  ),
  env: Type18.Optional(Type18.Record(NonEmptyString, Type18.String())),
  cwd: Type18.Optional(Type18.Union([Type18.String(), Type18.Null()])),
  nodeId: Type18.Optional(Type18.Union([NonEmptyString, Type18.Null()])),
  host: Type18.Optional(Type18.Union([Type18.String(), Type18.Null()])),
  security: Type18.Optional(Type18.Union([Type18.String(), Type18.Null()])),
  ask: Type18.Optional(Type18.Union([Type18.String(), Type18.Null()])),
  warningText: Type18.Optional(Type18.Union([Type18.String(), Type18.Null()])),
  unavailableDecisions: Type18.Optional(
    Type18.Array(Type18.String({ enum: ["allow-always"] }), {
      minItems: 1,
      maxItems: 1
    })
  ),
  commandSpans: Type18.Optional(
    Type18.Array(
      closedObject({
        startIndex: Type18.Integer({
          minimum: 0,
          description: "Inclusive UTF-16 code unit offset into command."
        }),
        endIndex: Type18.Integer({
          minimum: 1,
          description: "Exclusive UTF-16 code unit offset into command; must be greater than startIndex and no greater than command.length."
        })
      })
    )
  ),
  agentId: Type18.Optional(Type18.Union([Type18.String(), Type18.Null()])),
  resolvedPath: Type18.Optional(Type18.Union([Type18.String(), Type18.Null()])),
  sessionKey: Type18.Optional(Type18.Union([Type18.String(), Type18.Null()])),
  sessionId: Type18.Optional(Type18.Union([Type18.String(), Type18.Null()])),
  runId: Type18.Optional(Type18.Union([Type18.String(), Type18.Null()])),
  toolCallId: Type18.Optional(Type18.Union([Type18.String(), Type18.Null()])),
  turnSourceChannel: Type18.Optional(Type18.Union([Type18.String(), Type18.Null()])),
  turnSourceTo: Type18.Optional(Type18.Union([Type18.String(), Type18.Null()])),
  turnSourceAccountId: Type18.Optional(Type18.Union([Type18.String(), Type18.Null()])),
  turnSourceThreadId: Type18.Optional(Type18.Union([Type18.String(), Type18.Number(), Type18.Null()])),
  approvalReviewerDeviceIds: Type18.Optional(
    Type18.Array(NonEmptyString, {
      description: "Trusted approval-runtime metadata naming operator devices that may review this approval; ordinary Gateway clients may send the field, but the Gateway only binds it for internal approval-runtime requests."
    })
  ),
  requireDeliveryRoute: Type18.Optional(Type18.Boolean()),
  suppressDelivery: Type18.Optional(Type18.Boolean()),
  timeoutMs: Type18.Optional(Type18.Integer({ minimum: 1 })),
  twoPhase: Type18.Optional(Type18.Boolean())
});
var ExecApprovalResolveParamsSchema = closedObject({
  id: NonEmptyString,
  decision: NonEmptyString
});

// packages/gateway-protocol/src/schema/frames.ts
import { Type as Type20 } from "typebox";

// packages/gateway-protocol/src/schema/snapshot.ts
import { Type as Type19 } from "typebox";
var PresenceEntrySchema = closedObject({
  host: Type19.Optional(NonEmptyString),
  ip: Type19.Optional(NonEmptyString),
  version: Type19.Optional(NonEmptyString),
  platform: Type19.Optional(NonEmptyString),
  deviceFamily: Type19.Optional(NonEmptyString),
  modelIdentifier: Type19.Optional(NonEmptyString),
  mode: Type19.Optional(NonEmptyString),
  lastInputSeconds: Type19.Optional(Type19.Integer({ minimum: 0 })),
  reason: Type19.Optional(NonEmptyString),
  tags: Type19.Optional(Type19.Array(NonEmptyString)),
  text: Type19.Optional(Type19.String()),
  ts: Type19.Integer({ minimum: 0 }),
  deviceId: Type19.Optional(NonEmptyString),
  roles: Type19.Optional(Type19.Array(NonEmptyString)),
  scopes: Type19.Optional(Type19.Array(NonEmptyString)),
  instanceId: Type19.Optional(NonEmptyString),
  user: Type19.Optional(
    closedObject({
      /** Opaque identity key: authenticated email today, durable profile id later. Clients group presence by this. */
      id: NonEmptyString,
      email: Type19.Optional(NonEmptyString),
      name: Type19.Optional(NonEmptyString),
      avatarUrl: Type19.Optional(NonEmptyString)
    })
  ),
  /** Session keys this connection is actively subscribed to (watching). Sorted lexicographically for deterministic snapshots. */
  watchedSessions: Type19.Optional(Type19.Array(NonEmptyString))
});
var HealthSessionSummarySchema = closedObject({
  path: Type19.String(),
  count: Type19.Integer({ minimum: 0 }),
  recent: Type19.Array(
    closedObject({
      key: Type19.String(),
      updatedAt: Type19.Union([Type19.Integer({ minimum: 0 }), Type19.Null()]),
      age: Type19.Union([Type19.Integer({ minimum: 0 }), Type19.Null()])
    })
  )
});
var HealthSnapshotSchema = closedObject({
  // Every field is optional because hello snapshots use an empty object until
  // the asynchronous health producer has populated the cache.
  ok: Type19.Optional(Type19.Literal(true)),
  ts: Type19.Optional(Type19.Integer({ minimum: 0 })),
  durationMs: Type19.Optional(Type19.Integer({ minimum: 0 })),
  eventLoop: Type19.Optional(
    closedObject({
      degraded: Type19.Boolean(),
      reasons: Type19.Array(
        Type19.Union([
          Type19.Literal("event_loop_delay"),
          Type19.Literal("event_loop_utilization"),
          Type19.Literal("cpu")
        ])
      ),
      intervalMs: Type19.Number({ minimum: 0 }),
      delayP99Ms: Type19.Number({ minimum: 0 }),
      delayMaxMs: Type19.Number({ minimum: 0 }),
      utilization: Type19.Number({ minimum: 0 }),
      cpuCoreRatio: Type19.Number({ minimum: 0 })
    })
  ),
  plugins: Type19.Optional(
    closedObject({
      loaded: Type19.Array(Type19.String()),
      errors: Type19.Array(
        closedObject({
          id: Type19.String(),
          origin: Type19.String(),
          activated: Type19.Boolean(),
          activationSource: Type19.Optional(Type19.String()),
          activationReason: Type19.Optional(Type19.String()),
          failurePhase: Type19.Optional(Type19.String()),
          error: Type19.String()
        })
      ),
      unavailable: Type19.Optional(
        Type19.Array(
          closedObject({
            id: Type19.String(),
            state: Type19.Literal("configured-unavailable"),
            diagnostic: closedObject({
              kind: Type19.Literal("plugin-verification"),
              reason: Type19.String(),
              detail: Type19.String()
            })
          })
        )
      )
    })
  ),
  contextEngines: Type19.Optional(
    closedObject({
      quarantined: Type19.Array(
        closedObject({
          engineId: Type19.String(),
          owner: Type19.Optional(Type19.String()),
          operation: Type19.String(),
          reason: Type19.String(),
          failedAt: Type19.Integer({ minimum: 0 })
        })
      )
    })
  ),
  deliveryQueues: Type19.Optional(
    closedObject({
      failed: Type19.Array(
        closedObject({
          queueName: Type19.String(),
          count: Type19.Integer({ minimum: 0 }),
          oldestFailedAt: Type19.Optional(Type19.Integer({ minimum: 0 }))
        })
      )
    })
  ),
  modelPricing: Type19.Optional(
    closedObject({
      state: Type19.Union([Type19.Literal("ok"), Type19.Literal("degraded"), Type19.Literal("disabled")]),
      sources: Type19.Array(
        closedObject({
          source: Type19.Union([
            Type19.Literal("openrouter"),
            Type19.Literal("litellm"),
            Type19.Literal("bootstrap"),
            Type19.Literal("refresh")
          ]),
          state: Type19.Union([Type19.Literal("ok"), Type19.Literal("degraded")]),
          lastFailureAt: Type19.Optional(Type19.Integer({ minimum: 0 })),
          detail: Type19.Optional(Type19.String())
        })
      ),
      lastFailureAt: Type19.Optional(Type19.Integer({ minimum: 0 })),
      detail: Type19.Optional(Type19.String())
    })
  ),
  configReload: Type19.Optional(
    closedObject({
      hotReloadStatus: Type19.Union([Type19.Literal("active"), Type19.Literal("disabled")])
    })
  ),
  // Channel plugins own their nested account/probe summaries, so this is the
  // one provider-contributed bag that deliberately remains unknown.
  channels: Type19.Optional(Type19.Record(Type19.String(), Type19.Unknown())),
  channelOrder: Type19.Optional(Type19.Array(Type19.String())),
  channelLabels: Type19.Optional(Type19.Record(Type19.String(), Type19.String())),
  heartbeatSeconds: Type19.Optional(Type19.Integer({ minimum: 0 })),
  defaultAgentId: Type19.Optional(Type19.String()),
  agents: Type19.Optional(
    Type19.Array(
      closedObject({
        agentId: Type19.String(),
        name: Type19.Optional(Type19.String()),
        isDefault: Type19.Boolean(),
        heartbeat: closedObject({
          enabled: Type19.Boolean(),
          every: Type19.String(),
          everyMs: Type19.Union([Type19.Integer({ minimum: 0 }), Type19.Null()]),
          prompt: Type19.String(),
          target: Type19.String(),
          model: Type19.Optional(Type19.String()),
          ackMaxChars: Type19.Integer({ minimum: 0 })
        }),
        sessions: HealthSessionSummarySchema
      })
    )
  ),
  sessions: Type19.Optional(HealthSessionSummarySchema)
});
var SessionDefaultsSchema = closedObject({
  defaultAgentId: NonEmptyString,
  mainKey: NonEmptyString,
  mainSessionKey: NonEmptyString,
  scope: Type19.Optional(NonEmptyString)
});
var StateVersionSchema = closedObject({
  presence: Type19.Integer({ minimum: 0 }),
  health: Type19.Integer({ minimum: 0 })
});
var SnapshotSchema = closedObject({
  presence: Type19.Array(PresenceEntrySchema),
  health: HealthSnapshotSchema,
  stateVersion: StateVersionSchema,
  uptimeMs: Type19.Integer({ minimum: 0 }),
  /** Resolved source-config revision accepted by the active Gateway runtime. */
  appliedConfigHash: Type19.Optional(Type19.Union([NonEmptyString, Type19.Null()])),
  configPath: Type19.Optional(NonEmptyString),
  stateDir: Type19.Optional(NonEmptyString),
  sessionDefaults: Type19.Optional(SessionDefaultsSchema),
  authMode: Type19.Optional(
    Type19.Union([
      Type19.Literal("none"),
      Type19.Literal("token"),
      Type19.Literal("password"),
      Type19.Literal("trusted-proxy")
    ])
  ),
  updateAvailable: Type19.Optional(
    Type19.Object({
      currentVersion: NonEmptyString,
      latestVersion: NonEmptyString,
      channel: NonEmptyString
    })
  )
});

// packages/gateway-protocol/src/schema/frames.ts
var TickEventSchema = closedObject({
  ts: Type20.Integer({ minimum: 0 })
});
var ShutdownEventSchema = closedObject({
  reason: NonEmptyString,
  restartExpectedMs: Type20.Optional(Type20.Integer({ minimum: 0 }))
});
var ConnectParamsSchema = closedObject({
  minProtocol: Type20.Integer({ minimum: 1 }),
  maxProtocol: Type20.Integer({ minimum: 1 }),
  client: closedObject({
    id: GatewayClientIdSchema,
    displayName: Type20.Optional(NonEmptyString),
    version: NonEmptyString,
    platform: NonEmptyString,
    deviceFamily: Type20.Optional(NonEmptyString),
    modelIdentifier: Type20.Optional(NonEmptyString),
    mode: GatewayClientModeSchema,
    instanceId: Type20.Optional(NonEmptyString)
  }),
  caps: Type20.Optional(Type20.Array(NonEmptyString, { default: [] })),
  commands: Type20.Optional(Type20.Array(NonEmptyString)),
  permissions: Type20.Optional(Type20.Record(NonEmptyString, Type20.Boolean())),
  pathEnv: Type20.Optional(Type20.String()),
  role: Type20.Optional(NonEmptyString),
  scopes: Type20.Optional(Type20.Array(NonEmptyString)),
  device: Type20.Optional(
    closedObject({
      id: NonEmptyString,
      publicKey: NonEmptyString,
      signature: NonEmptyString,
      signedAt: Type20.Integer({ minimum: 0 }),
      nonce: NonEmptyString
    })
  ),
  auth: Type20.Optional(
    closedObject({
      token: Type20.Optional(Type20.String()),
      bootstrapToken: Type20.Optional(Type20.String()),
      deviceToken: Type20.Optional(Type20.String()),
      password: Type20.Optional(Type20.String()),
      approvalRuntimeToken: Type20.Optional(Type20.String()),
      agentRuntimeIdentityToken: Type20.Optional(Type20.String())
    })
  ),
  locale: Type20.Optional(Type20.String()),
  userAgent: Type20.Optional(Type20.String())
});
var HelloOkSchema = closedObject({
  type: Type20.Literal("hello-ok"),
  protocol: Type20.Integer({ minimum: 1 }),
  server: closedObject({
    version: NonEmptyString,
    connId: NonEmptyString
  }),
  features: closedObject({
    methods: Type20.Array(NonEmptyString),
    events: Type20.Array(NonEmptyString),
    capabilities: Type20.Optional(Type20.Array(NonEmptyString))
  }),
  snapshot: SnapshotSchema,
  // Additive: plugin-declared Control UI tabs (surface "tab" descriptors).
  controlUiTabs: Type20.Optional(
    Type20.Array(
      closedObject({
        pluginId: NonEmptyString,
        id: NonEmptyString,
        label: NonEmptyString,
        description: Type20.Optional(Type20.String()),
        icon: Type20.Optional(Type20.String()),
        path: Type20.Optional(Type20.String()),
        requiresGatewayAuth: Type20.Optional(Type20.Boolean()),
        group: Type20.Optional(Type20.Union([Type20.Literal("control"), Type20.Literal("agent")])),
        order: Type20.Optional(Type20.Number())
      })
    )
  ),
  pluginSurfaceUrls: Type20.Optional(Type20.Record(NonEmptyString, NonEmptyString)),
  auth: closedObject({
    deviceToken: Type20.Optional(NonEmptyString),
    role: NonEmptyString,
    scopes: Type20.Array(NonEmptyString),
    issuedAtMs: Type20.Optional(Type20.Integer({ minimum: 0 })),
    deviceTokens: Type20.Optional(
      Type20.Array(
        closedObject({
          deviceToken: NonEmptyString,
          role: NonEmptyString,
          scopes: Type20.Array(NonEmptyString),
          issuedAtMs: Type20.Integer({ minimum: 0 })
        })
      )
    )
  }),
  policy: closedObject({
    maxPayload: Type20.Integer({ minimum: 1 }),
    maxBufferedBytes: Type20.Integer({ minimum: 1 }),
    tickIntervalMs: Type20.Integer({ minimum: 1 })
  })
});
var ErrorShapeSchema = closedObject({
  code: NonEmptyString,
  message: NonEmptyString,
  details: Type20.Optional(Type20.Unknown()),
  retryable: Type20.Optional(Type20.Boolean()),
  retryAfterMs: Type20.Optional(Type20.Integer({ minimum: 0 }))
});
var RequestFrameSchema = closedObject({
  type: Type20.Literal("req"),
  id: NonEmptyString,
  method: NonEmptyString,
  params: Type20.Optional(Type20.Unknown())
});
var ResponseFrameSchema = closedObject({
  type: Type20.Literal("res"),
  id: NonEmptyString,
  ok: Type20.Boolean(),
  payload: Type20.Optional(Type20.Unknown()),
  error: Type20.Optional(ErrorShapeSchema)
});
var EventFrameSchema = closedObject({
  type: Type20.Literal("event"),
  event: NonEmptyString,
  payload: Type20.Optional(Type20.Unknown()),
  seq: Type20.Optional(Type20.Integer({ minimum: 0 })),
  stateVersion: Type20.Optional(StateVersionSchema)
});
var GatewayFrameSchema = Type20.Union(
  [RequestFrameSchema, ResponseFrameSchema, EventFrameSchema],
  { discriminator: "type" }
);

// packages/gateway-protocol/src/schema/fs.ts
import { Type as Type21 } from "typebox";
var FsListDirParamsSchema = closedObject({
  /** Absolute directory to list; omitted means the selected host's home directory. */
  path: Type21.Optional(NonEmptyString),
  /** Connected node host to browse; omitted means the Gateway host. */
  nodeId: Type21.Optional(NonEmptyString)
});
var FsDirEntrySchema = closedObject({
  name: NonEmptyString,
  path: NonEmptyString,
  /** Dot-prefixed directories; clients render them dimmed after visible ones. */
  hidden: Type21.Optional(Type21.Boolean())
});
var FsListDirResultSchema = closedObject({
  /** Resolved absolute path that was listed. */
  path: NonEmptyString,
  /** Absent at the filesystem root. */
  parent: Type21.Optional(NonEmptyString),
  /** Selected host's home directory, for the picker's "home" shortcut. */
  home: NonEmptyString,
  entries: Type21.Array(FsDirEntrySchema)
});

// packages/gateway-protocol/src/schema/gateway-suspend.ts
import { Type as Type22 } from "typebox";
var SuspensionTokenSchema = Type22.String({ minLength: 1, maxLength: 128, pattern: "\\S" });
var CountSchema = Type22.Integer({ minimum: 0 });
var GatewaySuspendTaskBlockerSchema = closedObject({
  taskId: Type22.String(),
  status: Type22.Literal("running"),
  runtime: Type22.Union([
    Type22.Literal("subagent"),
    Type22.Literal("acp"),
    Type22.Literal("cli"),
    Type22.Literal("cron")
  ]),
  runId: Type22.Optional(Type22.String()),
  label: Type22.Optional(Type22.String()),
  title: Type22.Optional(Type22.String())
});
var GatewaySuspendBlockerSchema = closedObject({
  kind: Type22.Union([
    Type22.Literal("queue"),
    Type22.Literal("reply"),
    Type22.Literal("embedded-run"),
    Type22.Literal("background-exec"),
    Type22.Literal("cron-run"),
    Type22.Literal("task"),
    Type22.Literal("root-request"),
    Type22.Literal("session-admission"),
    Type22.Literal("session-mutation"),
    Type22.Literal("chat-run"),
    Type22.Literal("queued-turn"),
    Type22.Literal("terminal-persistence"),
    Type22.Literal("terminal-session")
  ]),
  count: CountSchema,
  message: Type22.String(),
  task: Type22.Optional(GatewaySuspendTaskBlockerSchema)
});
var GatewaySuspendPrepareParamsSchema = closedObject({ requestId: SuspensionTokenSchema });
var GatewaySuspendPrepareBusyResultSchema = closedObject({
  status: Type22.Literal("busy"),
  reason: Type22.Union([Type22.Literal("active-work"), Type22.Literal("gateway-draining")]),
  retryAfterMs: CountSchema,
  activeCount: CountSchema,
  blockers: Type22.Array(GatewaySuspendBlockerSchema)
});
var GatewaySuspendPrepareReadyResultSchema = closedObject({
  status: Type22.Literal("ready"),
  suspensionId: SuspensionTokenSchema,
  expiresAtMs: CountSchema,
  activeCount: CountSchema,
  blockers: Type22.Array(GatewaySuspendBlockerSchema)
});
var GatewaySuspendPrepareResultSchema = Type22.Union([
  GatewaySuspendPrepareBusyResultSchema,
  GatewaySuspendPrepareReadyResultSchema
]);
var GatewaySuspendStatusParamsSchema = closedObject({
  suspensionId: SuspensionTokenSchema
});
var GatewaySuspendStatusRunningResultSchema = closedObject({
  status: Type22.Literal("running")
});
var GatewaySuspendStatusReadyResultSchema = closedObject({
  status: Type22.Literal("ready"),
  expiresAtMs: CountSchema
});
var GatewaySuspendStatusResultSchema = Type22.Union([
  GatewaySuspendStatusRunningResultSchema,
  GatewaySuspendStatusReadyResultSchema
]);
var GatewaySuspendResumeParamsSchema = GatewaySuspendStatusParamsSchema;
var GatewaySuspendResumeResultSchema = closedObject({
  ok: Type22.Literal(true),
  status: Type22.Literal("running"),
  resumed: Type22.Boolean()
});

// packages/gateway-protocol/src/schema/logs-chat.ts
import { Type as Type23 } from "typebox";
var LogsTailParamsSchema = closedObject({
  cursor: Type23.Optional(Type23.Integer({ minimum: 0 })),
  limit: Type23.Optional(Type23.Integer({ minimum: 1, maximum: 5e3 })),
  maxBytes: Type23.Optional(Type23.Integer({ minimum: 1, maximum: 1e6 }))
});
var LogsTailResultSchema = closedObject({
  file: NonEmptyString,
  cursor: Type23.Integer({ minimum: 0 }),
  size: Type23.Integer({ minimum: 0 }),
  lines: Type23.Array(Type23.String()),
  truncated: Type23.Optional(Type23.Boolean()),
  reset: Type23.Optional(Type23.Boolean())
});
var ChatHistoryParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type23.Optional(NonEmptyString),
  limit: Type23.Optional(Type23.Integer({ minimum: 1, maximum: 1e3 })),
  offset: Type23.Optional(Type23.Integer({ minimum: 0 })),
  messageId: Type23.Optional(NonEmptyString),
  sessionId: Type23.Optional(NonEmptyString),
  maxChars: Type23.Optional(Type23.Integer({ minimum: 1, maximum: 5e5 }))
});
var ChatMetadataParamsSchema = closedObject({
  agentId: Type23.Optional(NonEmptyString)
});
var ChatToolTitlesParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type23.Optional(NonEmptyString),
  items: Type23.Array(
    closedObject({
      id: Type23.String({ minLength: 1, maxLength: 64 }),
      name: Type23.String({ minLength: 1, maxLength: 200 }),
      input: Type23.String({ minLength: 1, maxLength: 4e3 })
    }),
    { minItems: 1, maxItems: 24 }
  )
});
var ChatToolTitlesResultSchema = closedObject({
  titles: Type23.Record(Type23.String(), Type23.String()),
  disabled: Type23.Optional(Type23.Boolean())
});
var ChatMessageGetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type23.Optional(NonEmptyString),
  messageId: NonEmptyString,
  maxChars: Type23.Optional(Type23.Integer({ minimum: 1, maximum: 2e6 }))
});
var ChatMessageGetResultSchema = closedObject({
  ok: Type23.Boolean(),
  message: Type23.Optional(Type23.Unknown()),
  unavailableReason: Type23.Optional(
    Type23.Union([Type23.Literal("not_found"), Type23.Literal("oversized"), Type23.Literal("not_visible")])
  )
});
var ChatAttachmentsSchema = Type23.Array(Type23.Unknown());
var RunToolBindingsSchema = Type23.Record(
  Type23.String({ minLength: 1, maxLength: 128 }),
  Type23.Unknown(),
  { maxProperties: 16 }
);
var ChatSendParamsSchema = closedObject({
  sessionKey: ChatSendSessionKeyString,
  agentId: Type23.Optional(NonEmptyString),
  sessionId: Type23.Optional(NonEmptyString),
  message: Type23.String(),
  thinking: Type23.Optional(Type23.String()),
  fastMode: Type23.Optional(Type23.Union([Type23.Boolean(), Type23.Literal("auto")])),
  // One-turn override for auto fast-mode cutoff seconds.
  fastAutoOnSeconds: Type23.Optional(Type23.Integer({ minimum: 1 })),
  // One-turn override for active-run queue admission.
  queueMode: Type23.Optional(Type23.String({ enum: ["steer", "followup", "collect", "interrupt"] })),
  deliver: Type23.Optional(Type23.Boolean()),
  originatingChannel: Type23.Optional(Type23.String()),
  originatingTo: Type23.Optional(Type23.String()),
  originatingAccountId: Type23.Optional(Type23.String()),
  originatingThreadId: Type23.Optional(Type23.String()),
  // Transcript id of the message this send replies to; the Gateway hydrates
  // channel-agnostic reply context metadata from session history.
  replyToId: Type23.Optional(NonEmptyString),
  attachments: Type23.Optional(ChatAttachmentsSchema),
  toolBindings: Type23.Optional(RunToolBindingsSchema),
  timeoutMs: Type23.Optional(Type23.Integer({ minimum: 0 })),
  systemInputProvenance: Type23.Optional(InputProvenanceSchema),
  systemProvenanceReceipt: Type23.Optional(Type23.String()),
  suppressCommandInterpretation: Type23.Optional(Type23.Boolean()),
  expectedSessionRoutingContract: Type23.Optional(NonEmptyString),
  idempotencyKey: NonEmptyString
});
var ChatAbortParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type23.Optional(NonEmptyString),
  runId: Type23.Optional(NonEmptyString),
  preserveSideRuns: Type23.Optional(Type23.Boolean())
});
var ChatInjectParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type23.Optional(NonEmptyString),
  message: NonEmptyString,
  label: Type23.Optional(Type23.String({ maxLength: 100 }))
});
var ChatEventBaseSchema = {
  runId: NonEmptyString,
  sessionKey: NonEmptyString,
  agentId: Type23.Optional(NonEmptyString),
  spawnedBy: Type23.Optional(NonEmptyString),
  seq: Type23.Integer({ minimum: 0 })
};
var ChatEventErrorKindSchema = Type23.Union([
  Type23.Literal("refusal"),
  Type23.Literal("timeout"),
  Type23.Literal("rate_limit"),
  Type23.Literal("context_length"),
  Type23.Literal("unknown")
]);
var ChatDeltaEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type23.Literal("delta"),
  message: Type23.Optional(Type23.Unknown()),
  deltaText: Type23.String(),
  replace: Type23.Optional(Type23.Boolean()),
  usage: Type23.Optional(Type23.Unknown())
});
var ChatFinalEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type23.Literal("final"),
  message: Type23.Optional(Type23.Unknown()),
  usage: Type23.Optional(Type23.Unknown()),
  stopReason: Type23.Optional(Type23.String()),
  yielded: Type23.Optional(Type23.Literal(true))
});
var ChatAbortedEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type23.Literal("aborted"),
  message: Type23.Optional(Type23.Unknown()),
  errorMessage: Type23.Optional(Type23.String()),
  stopReason: Type23.Optional(Type23.String())
});
var ChatErrorEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type23.Literal("error"),
  message: Type23.Optional(Type23.Unknown()),
  errorMessage: Type23.Optional(Type23.String()),
  errorKind: Type23.Optional(ChatEventErrorKindSchema),
  usage: Type23.Optional(Type23.Unknown()),
  stopReason: Type23.Optional(Type23.String())
});
var ChatEventSchema = Type23.Union([
  ChatDeltaEventSchema,
  ChatFinalEventSchema,
  ChatAbortedEventSchema,
  ChatErrorEventSchema
]);

// packages/gateway-protocol/src/schema/migrations.ts
import { Type as Type24 } from "typebox";
var MAX_MEMORY_MIGRATION_ITEMS = 2e3;
var MemoryMigrationPlanFingerprintSchema = Type24.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var MemoryMigrationItemStatusSchema = Type24.Union([
  Type24.Literal("planned"),
  Type24.Literal("migrated"),
  Type24.Literal("skipped"),
  Type24.Literal("warning"),
  Type24.Literal("conflict"),
  Type24.Literal("error")
]);
var MemoryMigrationItemSchema = Type24.Object(
  {
    id: NonEmptyString,
    status: MemoryMigrationItemStatusSchema,
    source: Type24.Optional(NonEmptyString),
    target: Type24.Optional(NonEmptyString),
    message: Type24.Optional(Type24.String()),
    reason: Type24.Optional(Type24.String()),
    details: Type24.Optional(Type24.Record(Type24.String(), Type24.Unknown()))
  },
  { additionalProperties: false }
);
var MemoryMigrationSummarySchema = Type24.Object(
  {
    total: Type24.Integer({ minimum: 0 }),
    planned: Type24.Integer({ minimum: 0 }),
    migrated: Type24.Integer({ minimum: 0 }),
    skipped: Type24.Integer({ minimum: 0 }),
    conflicts: Type24.Integer({ minimum: 0 }),
    errors: Type24.Integer({ minimum: 0 }),
    sensitive: Type24.Integer({ minimum: 0 })
  },
  { additionalProperties: false }
);
var MemoryMigrationProviderPlanSchema = Type24.Object(
  {
    providerId: NonEmptyString,
    label: NonEmptyString,
    description: Type24.Optional(Type24.String()),
    planFingerprint: Type24.Optional(MemoryMigrationPlanFingerprintSchema),
    found: Type24.Boolean(),
    source: Type24.Optional(NonEmptyString),
    target: Type24.Optional(NonEmptyString),
    confidence: Type24.Optional(
      Type24.Union([Type24.Literal("low"), Type24.Literal("medium"), Type24.Literal("high")])
    ),
    message: Type24.Optional(Type24.String()),
    error: Type24.Optional(Type24.String()),
    summary: MemoryMigrationSummarySchema,
    items: Type24.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
    warnings: Type24.Optional(Type24.Array(Type24.String()))
  },
  { additionalProperties: false }
);
var MigrationsMemoryPlanParamsSchema = Type24.Object(
  {
    agentId: NonEmptyString,
    overwrite: Type24.Optional(Type24.Boolean())
  },
  { additionalProperties: false }
);
var MigrationsMemoryPlanResultSchema = Type24.Object(
  {
    agentId: NonEmptyString,
    workspace: NonEmptyString,
    providers: Type24.Array(MemoryMigrationProviderPlanSchema)
  },
  { additionalProperties: false }
);
var MigrationsMemoryApplyParamsSchema = Type24.Object(
  {
    idempotencyKey: NonEmptyString,
    agentId: NonEmptyString,
    providerId: NonEmptyString,
    planFingerprint: MemoryMigrationPlanFingerprintSchema,
    itemIds: Type24.Array(NonEmptyString, {
      minItems: 1,
      uniqueItems: true,
      maxItems: MAX_MEMORY_MIGRATION_ITEMS
    }),
    overwrite: Type24.Optional(Type24.Boolean())
  },
  { additionalProperties: false }
);
var MigrationsMemoryApplyResultSchema = Type24.Object(
  {
    providerId: NonEmptyString,
    source: NonEmptyString,
    target: Type24.Optional(NonEmptyString),
    summary: MemoryMigrationSummarySchema,
    items: Type24.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
    warnings: Type24.Optional(Type24.Array(Type24.String())),
    backupPath: Type24.Optional(NonEmptyString),
    reportDir: Type24.Optional(NonEmptyString)
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

// packages/gateway-protocol/src/schema/log-migration-protocol-schemas.ts
var LogMigrationProtocolSchemas = {
  LogsTailParams: LogsTailParamsSchema,
  LogsTailResult: LogsTailResultSchema,
  ...MigrationProtocolSchemas
};

// packages/gateway-protocol/src/schema/nodes.ts
import { Type as Type25 } from "typebox";
var NodePluginToolNameSchema = Type25.String({
  minLength: 1,
  maxLength: 64,
  pattern: "^[A-Za-z][A-Za-z0-9_-]{0,63}$"
});
var NodeSkillNameSchema = Type25.String({
  minLength: 1,
  maxLength: 64,
  pattern: "^(?!.*--)[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$"
});
var NodePendingWorkTypeSchema = Type25.String({
  enum: ["status.request", "location.request"]
});
var NodePendingWorkPrioritySchema = Type25.String({
  enum: ["normal", "high"]
});
var NodePresenceAliveReasonSchema = Type25.String({
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
  sentAtMs: Type25.Optional(Type25.Integer({ minimum: 0 })),
  displayName: Type25.Optional(NonEmptyString),
  version: Type25.Optional(NonEmptyString),
  platform: Type25.Optional(NonEmptyString),
  deviceFamily: Type25.Optional(NonEmptyString),
  modelIdentifier: Type25.Optional(NonEmptyString),
  pushTransport: Type25.Optional(NonEmptyString)
});
var NodePresenceActivityPayloadSchema = closedObject({
  idleSeconds: Type25.Integer({ minimum: 0, maximum: 2592e3 }),
  saturated: Type25.Optional(Type25.Boolean())
});
var NodeEventResultSchema = closedObject({
  ok: Type25.Boolean(),
  event: NonEmptyString,
  handled: Type25.Boolean(),
  reason: Type25.Optional(NonEmptyString)
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
  parameters: Type25.Optional(Type25.Record(Type25.String(), Type25.Unknown())),
  command: Type25.Optional(NonEmptyString),
  mcp: Type25.Optional(
    closedObject({
      server: NonEmptyString,
      tool: NonEmptyString
    })
  )
});
var NodePluginToolsUpdateParamsSchema = closedObject({
  tools: Type25.Array(NodePluginToolDescriptorSchema)
});
var NodeSkillDescriptorSchema = closedObject({
  name: NodeSkillNameSchema,
  description: Type25.String({ minLength: 1, maxLength: 1024 }),
  content: Type25.String({ minLength: 1, maxLength: 64 * 1024 })
});
var NodeSkillsUpdateParamsSchema = closedObject({
  skills: Type25.Array(NodeSkillDescriptorSchema, { maxItems: 64 })
});
var NodePendingAckParamsSchema = closedObject({
  ids: Type25.Array(NonEmptyString, { minItems: 1 })
});
var NodeDescribeParamsSchema = closedObject({ nodeId: NonEmptyString });
var NodeInvokeParamsSchema = closedObject({
  nodeId: NonEmptyString,
  command: NonEmptyString,
  params: Type25.Optional(Type25.Unknown()),
  timeoutMs: Type25.Optional(Type25.Integer({ minimum: 0 })),
  idempotencyKey: NonEmptyString,
  // Gateway-only agent ownership metadata. Forwarded beside params, never inside them.
  sessionKey: Type25.Optional(NonEmptyString),
  // Gateway-only approval routing metadata. Node forwarding strips these fields.
  turnSourceChannel: Type25.Optional(Type25.String()),
  turnSourceTo: Type25.Optional(Type25.String()),
  turnSourceAccountId: Type25.Optional(Type25.String()),
  turnSourceThreadId: Type25.Optional(Type25.Union([Type25.String(), Type25.Number()]))
});
var NodeInvokeResultParamsSchema = closedObject({
  id: NonEmptyString,
  nodeId: NonEmptyString,
  ok: Type25.Boolean(),
  payload: Type25.Optional(Type25.Unknown()),
  payloadJSON: Type25.Optional(Type25.String()),
  error: Type25.Optional(
    closedObject({
      code: Type25.Optional(NonEmptyString),
      message: Type25.Optional(NonEmptyString)
    })
  )
});
var NodeInvokeProgressParamsSchema = closedObject({
  invokeId: NonEmptyString,
  nodeId: NonEmptyString,
  seq: Type25.Integer({ minimum: 0 }),
  // Empty chunks are liveness heartbeats for captured stderr or capped stdout.
  chunk: Type25.String({ maxLength: 16 * 1024 })
});
var NodeEventParamsSchema = closedObject({
  event: NonEmptyString,
  payload: Type25.Optional(Type25.Unknown()),
  payloadJSON: Type25.Optional(Type25.String())
});
var NodePendingDrainParamsSchema = closedObject({
  maxItems: Type25.Optional(Type25.Integer({ minimum: 1, maximum: 10 }))
});
var NodePendingDrainItemSchema = closedObject({
  id: NonEmptyString,
  type: NodePendingWorkTypeSchema,
  priority: Type25.String({ enum: ["default", "normal", "high"] }),
  createdAtMs: Type25.Integer({ minimum: 0 }),
  expiresAtMs: Type25.Optional(Type25.Union([Type25.Integer({ minimum: 0 }), Type25.Null()])),
  payload: Type25.Optional(Type25.Record(Type25.String(), Type25.Unknown()))
});
var NodePendingDrainResultSchema = closedObject({
  nodeId: NonEmptyString,
  revision: Type25.Integer({ minimum: 0 }),
  items: Type25.Array(NodePendingDrainItemSchema),
  hasMore: Type25.Boolean()
});
var NodePendingEnqueueParamsSchema = closedObject({
  nodeId: NonEmptyString,
  type: NodePendingWorkTypeSchema,
  priority: Type25.Optional(NodePendingWorkPrioritySchema),
  expiresInMs: Type25.Optional(Type25.Integer({ minimum: 1e3, maximum: 864e5 })),
  wake: Type25.Optional(Type25.Boolean())
});
var NodePendingEnqueueResultSchema = closedObject({
  nodeId: NonEmptyString,
  revision: Type25.Integer({ minimum: 0 }),
  queued: NodePendingDrainItemSchema,
  wakeTriggered: Type25.Boolean()
});
var NodeInvokeRequestEventSchema = closedObject({
  id: NonEmptyString,
  nodeId: NonEmptyString,
  command: NonEmptyString,
  paramsJSON: Type25.Optional(Type25.String()),
  timeoutMs: Type25.Optional(Type25.Integer({ minimum: 0 })),
  idempotencyKey: Type25.Optional(NonEmptyString)
});
var NodeInvokeInputEventSchema = closedObject({
  id: NonEmptyString,
  nodeId: NonEmptyString,
  seq: Type25.Integer({ minimum: 0 }),
  payloadJSON: Type25.String({ maxLength: 16 * 1024 })
});

// packages/gateway-protocol/src/schema/openclaw.ts
import { Type as Type27 } from "typebox";

// packages/gateway-protocol/src/schema/wizard.ts
import { Type as Type26 } from "typebox";
var WizardRunStatusSchema = Type26.Union([
  Type26.Literal("running"),
  Type26.Literal("done"),
  Type26.Literal("cancelled"),
  Type26.Literal("error")
]);
var WizardStartParamsSchema = closedObject({
  mode: Type26.Optional(Type26.Union([Type26.Literal("local"), Type26.Literal("remote")])),
  workspace: Type26.Optional(Type26.String()),
  // "setup" (default) runs full onboarding; "channels" runs the guided
  // channel-setup flow (openclaw channels add) over the same step protocol.
  flow: Type26.Optional(Type26.Union([Type26.Literal("setup"), Type26.Literal("channels")])),
  // Preselected channel id for flow "channels" (e.g. "telegram").
  channel: Type26.Optional(NonEmptyString)
});
var WizardAnswerSchema = closedObject({
  stepId: NonEmptyString,
  value: Type26.Optional(Type26.Unknown())
});
var WizardNextParamsSchema = closedObject({
  sessionId: NonEmptyString,
  answer: Type26.Optional(WizardAnswerSchema)
});
var WizardSessionIdParamsSchema = closedObject({
  sessionId: NonEmptyString
});
var WizardCancelParamsSchema = WizardSessionIdParamsSchema;
var WizardStatusParamsSchema = WizardSessionIdParamsSchema;
var WizardStepOptionSchema = closedObject({
  value: Type26.Unknown(),
  label: NonEmptyString,
  hint: Type26.Optional(Type26.String())
});
var WizardDeviceCodeSchema = closedObject({
  code: NonEmptyString,
  expiresInMinutes: Type26.Optional(Type26.Integer({ minimum: 1, maximum: 1440 })),
  message: Type26.Optional(Type26.String())
});
var WizardStepSchema = closedObject({
  id: NonEmptyString,
  type: Type26.Union([
    Type26.Literal("note"),
    Type26.Literal("select"),
    Type26.Literal("text"),
    Type26.Literal("confirm"),
    Type26.Literal("multiselect"),
    Type26.Literal("progress"),
    Type26.Literal("action")
  ]),
  title: Type26.Optional(Type26.String()),
  message: Type26.Optional(Type26.String()),
  format: Type26.Optional(Type26.Union([Type26.Literal("plain")])),
  options: Type26.Optional(Type26.Array(WizardStepOptionSchema)),
  initialValue: Type26.Optional(Type26.Unknown()),
  placeholder: Type26.Optional(Type26.String()),
  sensitive: Type26.Optional(Type26.Boolean()),
  executor: Type26.Optional(Type26.Union([Type26.Literal("gateway"), Type26.Literal("client")])),
  externalUrl: Type26.Optional(Type26.String()),
  deviceCode: Type26.Optional(WizardDeviceCodeSchema)
});
var WizardConfiguredAccountSchema = closedObject({
  channel: NonEmptyString,
  accountId: NonEmptyString
});
var WizardResultFields = {
  done: Type26.Boolean(),
  step: Type26.Optional(WizardStepSchema),
  status: Type26.Optional(WizardRunStatusSchema),
  error: Type26.Optional(Type26.String()),
  // What the flow actually configured; set on the terminal result of
  // wizard.start flow "channels" sessions so clients run channel-specific
  // completion (e.g. WhatsApp QR linking for the right account) from the
  // real outcome rather than the preselection.
  channels: Type26.Optional(Type26.Array(NonEmptyString)),
  accounts: Type26.Optional(Type26.Array(WizardConfiguredAccountSchema))
};
var WizardNextResultSchema = closedObject(WizardResultFields);
var WizardStartResultSchema = closedObject({
  sessionId: NonEmptyString,
  ...WizardResultFields
});
var WizardStatusResultSchema = closedObject({
  status: WizardRunStatusSchema,
  error: Type26.Optional(Type26.String())
});

// packages/gateway-protocol/src/schema/openclaw.ts
var SystemAgentChatParamsSchema = closedObject({
  sessionId: NonEmptyString,
  message: Type27.Optional(Type27.String()),
  /** Seeds a purpose-specific first greeting for a fresh conversation. */
  welcomeVariant: Type27.Optional(
    Type27.Union([Type27.Literal("onboarding"), Type27.Literal("new-agent")])
  ),
  /** Drop any in-flight approval/wizard state and start the session over. */
  reset: Type27.Optional(Type27.Boolean()),
  /** Host-only regular-agent delegation context. Never model-authored. */
  delegation: Type27.Optional(
    closedObject({
      agentId: Type27.Optional(NonEmptyString),
      sessionKey: Type27.Optional(NonEmptyString),
      turnSourceChannel: Type27.Optional(NonEmptyString),
      turnSourceTo: Type27.Optional(NonEmptyString),
      turnSourceAccountId: Type27.Optional(NonEmptyString),
      turnSourceThreadId: Type27.Optional(Type27.Union([Type27.String(), Type27.Number()]))
    })
  )
});
var SystemAgentChatQuestionSchema = closedObject({
  id: NonEmptyString,
  header: NonEmptyString,
  question: NonEmptyString,
  options: Type27.Array(
    closedObject({
      label: NonEmptyString,
      description: Type27.Optional(Type27.String()),
      recommended: Type27.Optional(Type27.Boolean()),
      /** Message text a client sends when this option is chosen; defaults to label. */
      reply: Type27.Optional(NonEmptyString)
    }),
    { minItems: 2, maxItems: 4 }
  ),
  /** Free-text answers are also accepted for this question. */
  isOther: Type27.Optional(Type27.Boolean())
});
var SystemAgentChatResultSchema = closedObject({
  sessionId: NonEmptyString,
  reply: NonEmptyString,
  /** The next reply is a hosted-wizard secret and clients must mask its input/echo. */
  sensitive: Type27.Optional(Type27.Boolean()),
  /** The hosted wizard will consume the next message as its current step answer. */
  wizardInputPending: Type27.Optional(Type27.Boolean()),
  action: Type27.Union([
    Type27.Literal("none"),
    // The user asked to talk to their agent; clients should move to their
    // normal agent chat surface.
    Type27.Literal("open-agent"),
    Type27.Literal("exit")
  ]),
  /** Optional localized-draft intent for an `open-agent` handoff. */
  agentDraft: Type27.Optional(Type27.Literal("hatch")),
  /** Destination agent for a specific `open-agent` handoff. */
  agentId: Type27.Optional(NonEmptyString),
  needsApproval: Type27.Optional(Type27.Boolean()),
  proposalId: Type27.Optional(NonEmptyString),
  question: Type27.Optional(SystemAgentChatQuestionSchema)
});
var SystemAgentChatHistoryParamsSchema = closedObject({
  limit: Type27.Optional(Type27.Integer({ minimum: 1, maximum: 500, default: 100 }))
});
var SystemAgentChatHistoryTurnSchema = closedObject({
  role: Type27.Union([Type27.Literal("user"), Type27.Literal("assistant")]),
  text: Type27.String(),
  at: Type27.Number()
});
var SystemAgentChatHistoryResultSchema = closedObject({
  turns: Type27.Array(SystemAgentChatHistoryTurnSchema)
});
var SystemChangeKindSchema = Type27.Union([
  Type27.Literal("operation"),
  Type27.Literal("config-write"),
  Type27.Literal("external-edit")
]);
var SystemChangeSourceSchema = Type27.Union([
  Type27.Literal("system-agent"),
  Type27.Literal("doctor"),
  Type27.Literal("config-rpc"),
  Type27.Literal("cli"),
  Type27.Literal("plugin-install"),
  Type27.Literal("external"),
  Type27.Literal("unknown")
]);
var SystemChangeEntrySchema = closedObject({
  id: NonEmptyString,
  at: Type27.Number(),
  kind: SystemChangeKindSchema,
  source: SystemChangeSourceSchema,
  summary: Type27.String(),
  changedPaths: Type27.Optional(Type27.Array(Type27.String())),
  invalid: Type27.Optional(Type27.Boolean()),
  opaqueChange: Type27.Optional(Type27.Boolean())
});
var SystemChangesListParamsSchema = closedObject({
  limit: Type27.Optional(Type27.Integer({ minimum: 1, maximum: 200, default: 50 })),
  beforeCursor: Type27.Optional(NonEmptyString)
});
var SystemChangesListResultSchema = closedObject({
  entries: Type27.Array(SystemChangeEntrySchema),
  nextCursor: Type27.Optional(NonEmptyString)
});
var SystemAgentSetupDetectParamsSchema = closedObject({});
var ProviderAutoSetupInferenceKind = Type27.TemplateLiteral("provider-auto:${string}", {
  pattern: "^provider-auto:.+$"
});
var SetupInferenceHttpsUrl = Type27.String({
  minLength: 1,
  maxLength: 2048,
  pattern: "^https://"
});
var SetupInferenceKind = Type27.Union([
  Type27.Literal("existing-model"),
  Type27.Literal("openai-api-key"),
  Type27.Literal("anthropic-api-key"),
  Type27.Literal("claude-cli"),
  Type27.Literal("codex-cli"),
  Type27.Literal("gemini-cli"),
  ProviderAutoSetupInferenceKind
]);
var SetupInferenceStatus = Type27.Union([
  Type27.Literal("ok"),
  Type27.Literal("auth"),
  Type27.Literal("rate_limit"),
  Type27.Literal("billing"),
  Type27.Literal("timeout"),
  Type27.Literal("format"),
  Type27.Literal("unavailable"),
  Type27.Literal("unknown")
]);
var SetupInferenceFailureStatus = Type27.Union([
  Type27.Literal("auth"),
  Type27.Literal("rate_limit"),
  Type27.Literal("billing"),
  Type27.Literal("timeout"),
  Type27.Literal("format"),
  Type27.Literal("unavailable"),
  Type27.Literal("unknown")
]);
var SystemAgentSetupDetectResultSchema = closedObject({
  candidates: Type27.Array(
    closedObject({
      kind: SetupInferenceKind,
      label: NonEmptyString,
      detail: Type27.String(),
      modelRef: NonEmptyString,
      recommended: Type27.Boolean(),
      /** true: verified; false: definitively logged out; absent: unknown. */
      credentials: Type27.Optional(Type27.Boolean()),
      icon: Type27.Optional(SetupInferenceHttpsUrl),
      website: Type27.Optional(SetupInferenceHttpsUrl)
    })
  ),
  unavailableCandidates: Type27.Optional(
    Type27.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString,
        detail: Type27.String(),
        reason: NonEmptyString
      })
    )
  ),
  /** Text-inference key/token methods exposed by the Gateway provider registry. */
  manualProviders: Type27.Array(
    closedObject({
      /** Opaque provider-auth choice sent back during activation. */
      id: NonEmptyString,
      label: NonEmptyString,
      hint: Type27.Optional(Type27.String()),
      icon: Type27.Optional(SetupInferenceHttpsUrl),
      website: Type27.Optional(SetupInferenceHttpsUrl)
    })
  ),
  /** Provider-owned browser and device-code login methods. */
  authOptions: Type27.Optional(
    Type27.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString,
        hint: Type27.Optional(Type27.String()),
        groupLabel: Type27.Optional(Type27.String()),
        icon: Type27.Optional(SetupInferenceHttpsUrl),
        website: Type27.Optional(SetupInferenceHttpsUrl),
        kind: Type27.Union([Type27.Literal("oauth"), Type27.Literal("device-code")]),
        featured: Type27.Boolean()
      })
    )
  ),
  recommendedInstalls: Type27.Optional(
    Type27.Array(
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
  codexAppServerDetected: Type27.Optional(Type27.Boolean()),
  configuredModel: Type27.Optional(Type27.String()),
  setupComplete: Type27.Boolean()
});
var SystemAgentSetupVerifyParamsSchema = closedObject({});
var SystemAgentSetupVerifyResultSchema = Type27.Union([
  closedObject({
    ok: Type27.Literal(true),
    modelRef: NonEmptyString,
    latencyMs: Type27.Number()
  }),
  closedObject({
    ok: Type27.Literal(false),
    status: SetupInferenceFailureStatus,
    error: NonEmptyString
  })
]);
var SystemAgentSetupActivateParamsSchema = closedObject({
  kind: Type27.Union([
    Type27.Literal("existing-model"),
    Type27.Literal("openai-api-key"),
    Type27.Literal("anthropic-api-key"),
    Type27.Literal("claude-cli"),
    Type27.Literal("codex-cli"),
    Type27.Literal("gemini-cli"),
    ProviderAutoSetupInferenceKind,
    Type27.Literal("api-key")
  ]),
  /** Exact detected model for this route; prevents detect/activate drift. */
  modelRef: Type27.Optional(NonEmptyString),
  /** Manual step only: opaque provider-auth choice returned by detection. */
  authChoice: Type27.Optional(Type27.String()),
  /** Manual step only: the pasted API key or token; masked by clients, never echoed. */
  apiKey: Type27.Optional(Type27.String()),
  workspace: Type27.Optional(Type27.String())
});
var SystemAgentSetupActivateResultSchema = closedObject({
  ok: Type27.Boolean(),
  /** Present on success: the model ref that answered the live test. */
  modelRef: Type27.Optional(Type27.String()),
  latencyMs: Type27.Optional(Type27.Number()),
  /** Human-readable setup summary lines (workspace, model, gateway). */
  lines: Type27.Optional(Type27.Array(Type27.String())),
  /** Present on failure: coarse bucket for client copy + docs links. */
  status: Type27.Optional(SetupInferenceStatus),
  error: Type27.Optional(Type27.String())
});
var SystemAgentSetupAuthStartParamsSchema = closedObject({
  /** Client-generated so cancellation remains possible if the start reply is lost. */
  sessionId: NonEmptyString,
  authChoice: NonEmptyString,
  workspace: Type27.Optional(Type27.String())
});
var SystemAgentSetupAuthStartResultSchema = WizardStartResultSchema;

// packages/gateway-protocol/src/schema/plugin-approvals.ts
import { Type as Type28 } from "typebox";
var MAX_PLUGIN_APPROVAL_TIMEOUT_MS = 6e5;
var PLUGIN_APPROVAL_TITLE_MAX_LENGTH = 80;
var PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH = 512;
var PluginApprovalRequestParamsSchema = closedObject({
  pluginId: Type28.Optional(NonEmptyString),
  title: Type28.String({ minLength: 1, maxLength: PLUGIN_APPROVAL_TITLE_MAX_LENGTH }),
  description: Type28.String({ minLength: 1, maxLength: PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH }),
  severity: Type28.Optional(Type28.String({ enum: ["info", "warning", "critical"] })),
  toolName: Type28.Optional(Type28.String()),
  toolCallId: Type28.Optional(Type28.String()),
  allowedDecisions: Type28.Optional(
    Type28.Array(Type28.String({ enum: ["allow-once", "allow-always", "deny"] }), {
      minItems: 1,
      maxItems: 3
    })
  ),
  agentId: Type28.Optional(Type28.String()),
  sessionKey: Type28.Optional(Type28.String()),
  approvalReviewerDeviceIds: Type28.Optional(
    Type28.Array(NonEmptyString, {
      description: "Trusted approval-runtime metadata naming operator devices that may review this approval; ordinary Gateway clients may send the field, but the Gateway only binds it for internal approval-runtime requests."
    })
  ),
  turnSourceChannel: Type28.Optional(Type28.String()),
  turnSourceTo: Type28.Optional(Type28.String()),
  turnSourceAccountId: Type28.Optional(Type28.String()),
  turnSourceThreadId: Type28.Optional(Type28.Union([Type28.String(), Type28.Number()])),
  timeoutMs: Type28.Optional(Type28.Integer({ minimum: 1, maximum: MAX_PLUGIN_APPROVAL_TIMEOUT_MS })),
  twoPhase: Type28.Optional(Type28.Boolean())
});
var PluginApprovalResolveParamsSchema = closedObject({
  id: NonEmptyString,
  decision: NonEmptyString
});

// packages/gateway-protocol/src/schema/plugins.ts
import { Type as Type29 } from "typebox";
var PluginJsonValueSchema = Type29.Unknown();
var PluginControlUiDescriptorSchema = closedObject({
  id: NonEmptyString,
  pluginId: NonEmptyString,
  pluginName: Type29.Optional(NonEmptyString),
  surface: Type29.Union([
    Type29.Literal("session"),
    Type29.Literal("tool"),
    Type29.Literal("run"),
    Type29.Literal("settings")
  ]),
  label: NonEmptyString,
  description: Type29.Optional(Type29.String()),
  placement: Type29.Optional(Type29.String()),
  schema: Type29.Optional(PluginJsonValueSchema),
  requiredScopes: Type29.Optional(Type29.Array(NonEmptyString))
});
var PluginsUiDescriptorsParamsSchema = closedObject({});
var PluginsUiDescriptorsResultSchema = closedObject({
  ok: Type29.Literal(true),
  descriptors: Type29.Array(PluginControlUiDescriptorSchema)
});
var PluginsSessionActionParamsSchema = closedObject({
  pluginId: NonEmptyString,
  actionId: NonEmptyString,
  sessionKey: Type29.Optional(NonEmptyString),
  payload: Type29.Optional(PluginJsonValueSchema)
});
var PluginsSessionActionSuccessResultSchema = closedObject({
  ok: Type29.Literal(true),
  result: Type29.Optional(PluginJsonValueSchema),
  continueAgent: Type29.Optional(Type29.Boolean()),
  reply: Type29.Optional(PluginJsonValueSchema)
});
var PluginsSessionActionFailureResultSchema = closedObject({
  ok: Type29.Literal(false),
  error: Type29.String(),
  code: Type29.Optional(Type29.String()),
  details: Type29.Optional(PluginJsonValueSchema)
});
var PluginsSessionActionResultSchema = Type29.Union([
  PluginsSessionActionSuccessResultSchema,
  PluginsSessionActionFailureResultSchema
]);
var PluginCatalogClawHubInstallSchema = closedObject({
  source: Type29.Literal("clawhub"),
  packageName: NonEmptyString
});
var PluginCatalogOfficialInstallSchema = closedObject({
  source: Type29.Literal("official"),
  pluginId: NonEmptyString
});
var PluginCatalogInstallActionSchema = Type29.Union([
  PluginCatalogClawHubInstallSchema,
  PluginCatalogOfficialInstallSchema
]);
var PluginCatalogEntrySchema = closedObject({
  id: NonEmptyString,
  name: NonEmptyString,
  packageName: Type29.Optional(NonEmptyString),
  description: Type29.Optional(Type29.String()),
  version: Type29.Optional(NonEmptyString),
  kind: Type29.Optional(Type29.Array(NonEmptyString)),
  origin: Type29.Optional(NonEmptyString),
  installed: Type29.Boolean(),
  enabled: Type29.Boolean(),
  state: Type29.Union([
    Type29.Literal("enabled"),
    Type29.Literal("disabled"),
    Type29.Literal("not-installed"),
    Type29.Literal("error")
  ]),
  featured: Type29.Optional(Type29.Boolean()),
  featuredAt: Type29.Optional(Type29.Integer({ minimum: 0 })),
  order: Type29.Optional(Type29.Number()),
  /** True when the gateway can resolve a manifest or catalog icon for this plugin identity. */
  hasIcon: Type29.Optional(Type29.Boolean()),
  install: Type29.Optional(PluginCatalogInstallActionSchema),
  error: Type29.Optional(Type29.String()),
  /** Coarse manifest-derived grouping (channel, provider, memory, ...) for catalog UIs. */
  category: Type29.Optional(NonEmptyString),
  /** True when the plugin has an install record and can be removed via plugins.uninstall. */
  removable: Type29.Optional(Type29.Boolean())
});
var PluginsListParamsSchema = closedObject({});
var PluginsListResultSchema = closedObject({
  plugins: Type29.Array(PluginCatalogEntrySchema),
  diagnostics: Type29.Array(Type29.Unknown()),
  mutationAllowed: Type29.Boolean()
});
var PluginsSearchParamsSchema = closedObject({
  query: NonEmptyString,
  limit: Type29.Optional(Type29.Integer({ minimum: 1, maximum: 100 }))
});
var PluginSearchPackageSchema = closedObject({
  name: NonEmptyString,
  displayName: NonEmptyString,
  family: Type29.Union([Type29.Literal("code-plugin"), Type29.Literal("bundle-plugin")]),
  channel: Type29.Union([
    Type29.Literal("official"),
    Type29.Literal("community"),
    Type29.Literal("private")
  ]),
  isOfficial: Type29.Boolean(),
  summary: Type29.Optional(Type29.String()),
  latestVersion: Type29.Optional(NonEmptyString),
  runtimeId: Type29.Optional(NonEmptyString),
  downloads: Type29.Optional(Type29.Number({ minimum: 0 })),
  verificationTier: Type29.Optional(NonEmptyString)
});
var PluginSearchResultEntrySchema = closedObject({
  score: Type29.Number(),
  package: PluginSearchPackageSchema
});
var PluginsSearchResultSchema = closedObject({
  results: Type29.Array(PluginSearchResultEntrySchema)
});
var PluginsInstallParamsSchema = Type29.Union([
  closedObject({
    source: Type29.Literal("clawhub"),
    packageName: NonEmptyString,
    version: Type29.Optional(NonEmptyString),
    acknowledgeClawHubRisk: Type29.Optional(Type29.Boolean())
  }),
  closedObject({
    source: Type29.Literal("official"),
    pluginId: NonEmptyString
  })
]);
var PluginsInstallResultSchema = closedObject({
  ok: Type29.Literal(true),
  plugin: PluginCatalogEntrySchema,
  restartRequired: Type29.Literal(true),
  warnings: Type29.Optional(Type29.Array(Type29.String()))
});
var PluginsRefreshParamsSchema = closedObject({});
var PluginsRefreshResultSchema = closedObject({
  ok: Type29.Literal(true)
});
var PluginsUninstallParamsSchema = closedObject({
  pluginId: NonEmptyString
});
var PluginsUninstallResultSchema = closedObject({
  ok: Type29.Literal(true),
  pluginId: NonEmptyString,
  restartRequired: Type29.Literal(true),
  removed: Type29.Array(Type29.String()),
  warnings: Type29.Optional(Type29.Array(Type29.String()))
});
var PluginsSetEnabledParamsSchema = closedObject({
  pluginId: NonEmptyString,
  enabled: Type29.Boolean()
});
var PluginsSetEnabledResultSchema = closedObject({
  ok: Type29.Literal(true),
  plugin: PluginCatalogEntrySchema,
  restartRequired: Type29.Boolean(),
  warnings: Type29.Optional(Type29.Array(Type29.String()))
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
import { Type as Type30 } from "typebox";
var ApnsEnvironmentSchema = Type30.String({ enum: ["sandbox", "production"] });
var PushTestParamsSchema = closedObject({
  nodeId: NonEmptyString,
  title: Type30.Optional(Type30.String()),
  body: Type30.Optional(Type30.String()),
  environment: Type30.Optional(ApnsEnvironmentSchema)
});
var PushTestResultSchema = closedObject({
  ok: Type30.Boolean(),
  status: Type30.Integer(),
  apnsId: Type30.Optional(Type30.String()),
  reason: Type30.Optional(Type30.String()),
  tokenSuffix: Type30.String(),
  topic: Type30.String(),
  environment: ApnsEnvironmentSchema,
  transport: Type30.String({ enum: ["direct", "relay"] })
});
var WebPushKeysSchema = closedObject({
  p256dh: Type30.String({ minLength: 1, maxLength: 512 }),
  auth: Type30.String({ minLength: 1, maxLength: 512 })
});
var WebPushVapidPublicKeyParamsSchema = closedObject({});
var WebPushSubscribeParamsSchema = closedObject({
  endpoint: Type30.String({ minLength: 1, maxLength: 2048, pattern: "^https://" }),
  keys: WebPushKeysSchema
});
var WebPushUnsubscribeParamsSchema = closedObject({
  endpoint: Type30.String({ minLength: 1, maxLength: 2048, pattern: "^https://" })
});
var WebPushTestParamsSchema = closedObject({
  title: Type30.Optional(Type30.String()),
  body: Type30.Optional(Type30.String())
});

// packages/gateway-protocol/src/schema/questions.ts
import { Type as Type31 } from "typebox";
var QuestionIdSchema = Type31.String({ pattern: "^[a-z][a-z0-9_]*$" });
var QuestionHeaderSchema = Type31.String({ maxLength: 12 });
var QuestionOptionSchema = closedObject({
  label: NonEmptyString,
  description: Type31.Optional(Type31.String())
});
var QuestionInputFields = {
  questionId: QuestionIdSchema,
  header: QuestionHeaderSchema,
  question: NonEmptyString,
  options: Type31.Array(QuestionOptionSchema, { maxItems: 4 }),
  multiSelect: Type31.Optional(Type31.Boolean()),
  isOther: Type31.Optional(Type31.Boolean()),
  isSecret: Type31.Optional(Type31.Boolean())
};
var QuestionRequestQuestionSchema = closedObject(QuestionInputFields);
var QuestionFields = {
  ...QuestionInputFields
};
var QuestionSchema = closedObject(QuestionFields);
var QuestionAnswersSchema = closedObject({
  answers: Type31.Record(QuestionIdSchema, Type31.Array(Type31.String()))
});
var QuestionStatusSchema = Type31.Union([
  Type31.Literal("pending"),
  Type31.Literal("answered"),
  Type31.Literal("cancelled"),
  Type31.Literal("expired")
]);
var QuestionRecordSchema = closedObject({
  id: NonEmptyString,
  questions: Type31.Array(QuestionSchema, { minItems: 1, maxItems: 3 }),
  agentId: Type31.Optional(NonEmptyString),
  sessionKey: Type31.Optional(NonEmptyString),
  createdAtMs: Type31.Integer({ minimum: 0 }),
  expiresAtMs: Type31.Integer({ minimum: 0 }),
  status: QuestionStatusSchema,
  answers: Type31.Optional(QuestionAnswersSchema),
  resolvedBy: Type31.Optional(NonEmptyString)
});
var QuestionRequestParamsSchema = closedObject({
  id: Type31.Optional(NonEmptyString),
  questions: Type31.Array(QuestionRequestQuestionSchema, { minItems: 1, maxItems: 3 }),
  agentId: Type31.Optional(NonEmptyString),
  sessionKey: Type31.Optional(NonEmptyString),
  timeoutMs: Type31.Optional(Type31.Integer({ minimum: 1 }))
});
var QuestionRequestResultSchema = closedObject({
  id: NonEmptyString,
  expiresAtMs: Type31.Integer({ minimum: 0 })
});
var QuestionWaitAnswerParamsSchema = closedObject({
  id: NonEmptyString,
  timeoutMs: Type31.Optional(Type31.Integer({ minimum: 1 }))
});
var QuestionWaitAnswerResultSchema = Type31.Union([
  closedObject({ status: Type31.Literal("pending") }),
  closedObject({ status: Type31.Literal("answered"), answers: QuestionAnswersSchema }),
  closedObject({ status: Type31.Literal("cancelled") }),
  closedObject({ status: Type31.Literal("expired") })
]);
var QuestionResolveParamsSchema = Type31.Union([
  closedObject({
    id: NonEmptyString,
    answers: QuestionAnswersSchema,
    resolvedBy: Type31.Optional(NonEmptyString)
  }),
  closedObject({
    id: NonEmptyString,
    cancel: Type31.Literal(true),
    resolvedBy: Type31.Optional(NonEmptyString)
  })
]);
var QuestionResolveResultSchema = Type31.Union([
  closedObject({ status: Type31.Literal("answered"), answers: QuestionAnswersSchema }),
  closedObject({ status: Type31.Literal("cancelled") })
]);
var QuestionGetParamsSchema = closedObject({ id: NonEmptyString });
var QuestionGetResultSchema = closedObject({ question: QuestionRecordSchema });
var QuestionListParamsSchema = closedObject({});
var QuestionListResultSchema = closedObject({
  questions: Type31.Array(QuestionRecordSchema)
});
var QuestionRequestedEventSchema = withSince("2026.7", QuestionRecordSchema);
var QuestionResolvedEventSchema = withSince(
  "2026.7",
  Type31.Union([
    closedObject({
      id: NonEmptyString,
      status: Type31.Literal("answered"),
      answers: QuestionAnswersSchema
    }),
    closedObject({ id: NonEmptyString, status: Type31.Literal("cancelled") }),
    closedObject({ id: NonEmptyString, status: Type31.Literal("expired") })
  ])
);

// packages/gateway-protocol/src/schema/secrets.ts
import { Type as Type32 } from "typebox";
var SecretsReloadParamsSchema = closedObject({});
var SecretsResolveParamsSchema = closedObject({
  commandName: NonEmptyString,
  targetIds: Type32.Array(NonEmptyString),
  allowedPaths: Type32.Optional(Type32.Array(NonEmptyString)),
  forcedActivePaths: Type32.Optional(Type32.Array(NonEmptyString)),
  optionalActivePaths: Type32.Optional(Type32.Array(NonEmptyString)),
  providerOverrides: Type32.Optional(
    closedObject({
      webSearch: Type32.Optional(NonEmptyString),
      webFetch: Type32.Optional(NonEmptyString)
    })
  )
});
var SecretsResolveAssignmentSchema = closedObject({
  path: Type32.Optional(NonEmptyString),
  pathSegments: Type32.Array(NonEmptyString),
  value: Type32.Unknown()
});
var SecretsResolveResultSchema = closedObject({
  ok: Type32.Optional(Type32.Boolean()),
  assignments: Type32.Optional(Type32.Array(SecretsResolveAssignmentSchema)),
  diagnostics: Type32.Optional(Type32.Array(NonEmptyString)),
  inactiveRefPaths: Type32.Optional(Type32.Array(NonEmptyString))
});

// packages/gateway-protocol/src/schema/session-discussion.ts
import { Type as Type33 } from "typebox";
var SessionDiscussionStateSchema = Type33.Union([
  Type33.Literal("none"),
  Type33.Literal("available"),
  Type33.Literal("open")
]);
var SessionDiscussionInfoSchema = closedObject({
  state: SessionDiscussionStateSchema,
  embedUrl: Type33.Optional(Type33.String()),
  openUrl: Type33.Optional(Type33.String())
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
import { Type as Type34 } from "typebox";
var SessionPlacementStateSchema = Type34.Union([
  Type34.Literal("local"),
  Type34.Literal("requested"),
  Type34.Literal("provisioning"),
  Type34.Literal("syncing"),
  Type34.Literal("starting"),
  Type34.Literal("active"),
  Type34.Literal("draining"),
  Type34.Literal("reconciling"),
  Type34.Literal("reclaimed"),
  Type34.Literal("failed")
]);
var SessionPlacementTimingProperties = {
  generation: Type34.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  createdAtMs: Type34.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  updatedAtMs: Type34.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  stateChangedAtMs: Type34.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
};
var SessionPlacementOwnerEpochSchema = Type34.Integer({
  minimum: 1,
  maximum: Number.MAX_SAFE_INTEGER
});
var WorkerBundleHashSchema = Type34.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var SessionPlacementWorkspaceProperties = {
  workspaceBaseManifestRef: NonEmptyString,
  remoteWorkspaceDir: NonEmptyString
};
var SessionPlacementAckProperties = {
  lastTranscriptAckCursor: Type34.Optional(
    Type34.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
  ),
  lastLiveEventAckCursor: Type34.Optional(
    Type34.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
  )
};
var WorkspaceResultConflictSchema = closedObject({
  paths: Type34.Array(NonEmptyString, { minItems: 1, maxItems: 256 }),
  stagedResultRef: NonEmptyString,
  totalCount: Type34.Optional(Type34.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }))
});
var SessionPlacementConflictProperties = {
  workspaceResultConflict: Type34.Optional(WorkspaceResultConflictSchema)
};
var TerminalSessionPlacementProperties = {
  environmentId: Type34.Optional(NonEmptyString),
  activeOwnerEpoch: Type34.Optional(SessionPlacementOwnerEpochSchema),
  workspaceBaseManifestRef: Type34.Optional(NonEmptyString),
  remoteWorkspaceDir: Type34.Optional(NonEmptyString),
  workerBundleHash: Type34.Optional(WorkerBundleHashSchema),
  ...SessionPlacementAckProperties,
  ...SessionPlacementConflictProperties
};
function createUnownedSessionPlacementSchema(state) {
  return closedObject({ state: Type34.Literal(state), ...SessionPlacementTimingProperties });
}
function createWorkerOwnedSessionPlacementSchema(state) {
  return closedObject({
    state: Type34.Literal(state),
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
  state: Type34.Literal("provisioning"),
  ...SessionPlacementTimingProperties,
  environmentId: Type34.Optional(NonEmptyString)
});
var SyncingSessionPlacementSchema = closedObject({
  state: Type34.Literal("syncing"),
  ...SessionPlacementTimingProperties,
  environmentId: NonEmptyString,
  workerBundleHash: WorkerBundleHashSchema
});
var StartingSessionPlacementSchema = closedObject({
  state: Type34.Literal("starting"),
  ...SessionPlacementTimingProperties,
  environmentId: NonEmptyString,
  workerBundleHash: WorkerBundleHashSchema,
  ...SessionPlacementWorkspaceProperties
});
var ActiveWorkerSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("active");
var DrainingSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("draining");
var ReconcilingSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("reconciling");
var ReclaimedSessionPlacementSchema = closedObject({
  state: Type34.Literal("reclaimed"),
  ...SessionPlacementTimingProperties,
  ...TerminalSessionPlacementProperties
});
var FailedSessionPlacementSchema = closedObject({
  state: Type34.Literal("failed"),
  ...SessionPlacementTimingProperties,
  ...TerminalSessionPlacementProperties,
  recoveryError: NonEmptyString
});
var SessionPlacementSchema = Type34.Union([
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
  agentId: Type34.Optional(NonEmptyString),
  profileId: NonEmptyString
});
var SessionsDispatchResultSchema = closedObject({
  ok: Type34.Literal(true),
  key: NonEmptyString,
  sessionId: NonEmptyString,
  placement: ActiveWorkerSessionPlacementSchema
});
var SessionsReclaimParamsSchema = Type34.Object(
  {
    key: NonEmptyString,
    agentId: Type34.Optional(NonEmptyString)
  },
  { additionalProperties: false }
);
var SessionsReclaimResultSchema = Type34.Object(
  {
    ok: Type34.Literal(true),
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
import { Type as Type35 } from "typebox";
var SessionCatalogErrorSchema = closedObject({ code: NonEmptyString, message: NonEmptyString });
var SessionCatalogLocatorSchema = closedObject({
  catalogId: NonEmptyString,
  hostId: NonEmptyString,
  threadId: NonEmptyString
});
var SessionCatalogCapabilitiesSchema = closedObject({
  continueSession: Type35.Boolean(),
  archive: Type35.Boolean(),
  createSession: Type35.Optional(closedObject({ model: NonEmptyString })),
  openTerminal: Type35.Optional(Type35.Boolean())
});
var SessionCatalogDescriptorSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  capabilities: SessionCatalogCapabilitiesSchema
});
var SessionCatalogSessionSchema = closedObject({
  threadId: NonEmptyString,
  name: Type35.Optional(Type35.String()),
  cwd: Type35.Optional(Type35.String()),
  status: NonEmptyString,
  createdAt: Type35.Optional(Type35.Number()),
  updatedAt: Type35.Optional(Type35.Number()),
  recencyAt: Type35.Optional(Type35.Number()),
  source: Type35.Optional(Type35.String()),
  modelProvider: Type35.Optional(Type35.String()),
  cliVersion: Type35.Optional(Type35.String()),
  gitBranch: Type35.Optional(Type35.String()),
  customGroup: Type35.Optional(Type35.String()),
  archived: Type35.Boolean(),
  sessionKey: Type35.Optional(NonEmptyString),
  canContinue: Type35.Boolean(),
  canArchive: Type35.Boolean(),
  canOpenTerminal: Type35.Optional(Type35.Boolean())
});
var SessionCatalogHostSchema = closedObject({
  hostId: NonEmptyString,
  label: NonEmptyString,
  kind: Type35.Union([Type35.Literal("gateway"), Type35.Literal("node")]),
  connected: Type35.Boolean(),
  nodeId: Type35.Optional(NonEmptyString),
  sessions: Type35.Array(SessionCatalogSessionSchema),
  nextCursor: Type35.Optional(Type35.String()),
  error: Type35.Optional(SessionCatalogErrorSchema)
});
var SessionCatalogSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  capabilities: SessionCatalogCapabilitiesSchema,
  hosts: Type35.Array(SessionCatalogHostSchema),
  error: Type35.Optional(SessionCatalogErrorSchema)
});
var SessionsCatalogListCommonProperties = {
  agentId: Type35.Optional(NonEmptyString),
  progressId: Type35.Optional(Type35.String({ minLength: 1, maxLength: 128 })),
  search: Type35.Optional(Type35.String()),
  limitPerHost: Type35.Optional(Type35.Integer({ minimum: 1 })),
  hostIds: Type35.Optional(Type35.Array(NonEmptyString))
};
var SessionsCatalogListParamsSchema = closedObject({
  catalogId: Type35.Optional(NonEmptyString),
  cursors: Type35.Optional(Type35.Record(NonEmptyString, Type35.String())),
  ...SessionsCatalogListCommonProperties
});
var SessionsCatalogListResultSchema = closedObject({
  catalogs: Type35.Array(SessionCatalogSchema)
});
var SessionsCatalogHostEventCatalogSchema = closedObject({
  ...SessionCatalogSchema.properties,
  hosts: Type35.Array(SessionCatalogHostSchema, { minItems: 1, maxItems: 1 })
});
var SessionsCatalogHostEventSchema = closedObject({
  progressId: Type35.String({ minLength: 1, maxLength: 128 }),
  agentId: NonEmptyString,
  catalog: SessionsCatalogHostEventCatalogSchema
});
var SessionCatalogTranscriptItemSchema = closedObject({
  id: Type35.Optional(Type35.String()),
  type: Type35.Union([
    Type35.Literal("userMessage"),
    Type35.Literal("agentMessage"),
    Type35.Literal("reasoning"),
    Type35.Literal("toolCall"),
    Type35.Literal("toolResult"),
    Type35.Literal("other")
  ]),
  text: Type35.Optional(Type35.String()),
  timestamp: Type35.Optional(Type35.String()),
  model: Type35.Optional(Type35.String()),
  truncated: Type35.Optional(Type35.Boolean()),
  raw: Type35.Optional(PluginJsonValueSchema)
});
var SessionsCatalogReadParamsSchema = closedObject({
  ...SessionCatalogLocatorSchema.properties,
  limit: Type35.Optional(Type35.Integer({ minimum: 1 })),
  cursor: Type35.Optional(Type35.String())
});
var SessionsCatalogReadResultSchema = closedObject({
  hostId: NonEmptyString,
  label: Type35.Optional(Type35.String()),
  threadId: NonEmptyString,
  items: Type35.Array(SessionCatalogTranscriptItemSchema),
  nextCursor: Type35.Optional(Type35.String())
});
var SessionsCatalogContinueParamsSchema = closedObject({
  ...SessionCatalogLocatorSchema.properties
});
var SessionsCatalogContinueResultSchema = closedObject({ sessionKey: NonEmptyString });
var SessionsCatalogArchiveParamsSchema = closedObject({
  ...SessionCatalogLocatorSchema.properties,
  confirmNoOtherRunner: Type35.Literal(true)
});
var SessionsCatalogArchiveResultSchema = closedObject({ ok: Type35.Literal(true) });

// packages/gateway-protocol/src/schema/sessions.ts
import { Type as Type37 } from "typebox";

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
import { Type as Type36 } from "typebox";
var SessionsCreateParamsSchema = closedObject({
  key: Type36.Optional(NonEmptyString),
  agentId: Type36.Optional(NonEmptyString),
  label: Type36.Optional(SessionLabelString),
  model: Type36.Optional(NonEmptyString),
  thinkingLevel: Type36.Optional(NonEmptyString),
  catalogId: Type36.Optional(NonEmptyString),
  parentSessionKey: Type36.Optional(NonEmptyString),
  fork: Type36.Optional(
    Type36.Boolean({ description: "Fork the parent transcript; requires parentSessionKey." })
  ),
  emitCommandHooks: Type36.Optional(Type36.Boolean()),
  succeedsParent: Type36.Optional(
    Type36.Boolean({
      description: "When sessions.create creates a distinct child, whether that child succeeds its parent and emits the parent's terminal session_end. Requires parentSessionKey and emitCommandHooks. False keeps the parent active; omission preserves legacy behavior."
    })
  ),
  task: Type36.Optional(Type36.String()),
  message: Type36.Optional(Type36.String()),
  attachments: Type36.Optional(ChatAttachmentsSchema),
  worktree: Type36.Optional(Type36.Boolean()),
  worktreeBaseRef: Type36.Optional(
    Type36.String({
      minLength: 1,
      description: "Base ref for the new managed worktree branch. Requires worktree=true."
    })
  ),
  worktreeName: Type36.Optional(
    Type36.String({
      pattern: "^[a-z0-9][a-z0-9-]{0,63}$",
      description: "Managed worktree name; becomes branch openclaw/<name>. Requires worktree=true."
    })
  ),
  execNode: Type36.Optional(
    Type36.String({
      minLength: 1,
      description: "Bind session exec to host=node with this node id/name. Requires operator.admin."
    })
  ),
  cwd: Type36.Optional(
    Type36.String({
      minLength: 1,
      description: "Absolute source directory for a managed worktree, or the working directory on execNode. Requires operator.admin."
    })
  )
});

// packages/gateway-protocol/src/schema/sessions.ts
var SessionCompactionCheckpointReasonSchema = Type37.Union([
  Type37.Literal("manual"),
  Type37.Literal("auto-threshold"),
  Type37.Literal("overflow-retry"),
  Type37.Literal("timeout-retry")
]);
var SessionOperationEventSchema = closedObject({
  operationId: NonEmptyString,
  operation: Type37.Literal("compact"),
  phase: Type37.Union([Type37.Literal("start"), Type37.Literal("end")]),
  sessionKey: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString),
  ts: Type37.Integer({ minimum: 0 }),
  completed: Type37.Optional(Type37.Boolean()),
  reason: Type37.Optional(Type37.String())
});
var SessionCompactionTranscriptReferenceSchema = closedObject({
  sessionId: NonEmptyString,
  sessionFile: Type37.Optional(NonEmptyString),
  leafId: Type37.Optional(NonEmptyString),
  entryId: Type37.Optional(NonEmptyString)
});
var SessionCompactionCheckpointSchema = closedObject({
  checkpointId: NonEmptyString,
  sessionKey: NonEmptyString,
  sessionId: NonEmptyString,
  createdAt: Type37.Integer({ minimum: 0 }),
  reason: SessionCompactionCheckpointReasonSchema,
  tokensBefore: Type37.Optional(Type37.Integer({ minimum: 0 })),
  tokensAfter: Type37.Optional(Type37.Integer({ minimum: 0 })),
  summary: Type37.Optional(Type37.String()),
  firstKeptEntryId: Type37.Optional(NonEmptyString),
  preCompaction: SessionCompactionTranscriptReferenceSchema,
  postCompaction: SessionCompactionTranscriptReferenceSchema
});
var SessionFileKindSchema = Type37.Union([Type37.Literal("modified"), Type37.Literal("read")]);
var SessionFileRelevanceSchema = Type37.Union([
  Type37.Literal("modified"),
  Type37.Literal("read"),
  Type37.Literal("mixed")
]);
var SessionFileHashSchema = Type37.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var SessionFileEntrySchema = closedObject({
  path: NonEmptyString,
  workspacePath: Type37.Optional(NonEmptyString),
  name: NonEmptyString,
  kind: SessionFileKindSchema,
  missing: Type37.Boolean(),
  size: Type37.Optional(Type37.Integer({ minimum: 0 })),
  updatedAtMs: Type37.Optional(Type37.Integer({ minimum: 0 })),
  content: Type37.Optional(Type37.String()),
  hash: Type37.Optional(SessionFileHashSchema)
});
var SessionFileBrowserEntrySchema = closedObject({
  path: Type37.String(),
  name: NonEmptyString,
  kind: Type37.Union([Type37.Literal("file"), Type37.Literal("directory")]),
  sessionKind: Type37.Optional(SessionFileRelevanceSchema),
  size: Type37.Optional(Type37.Integer({ minimum: 0 })),
  updatedAtMs: Type37.Optional(Type37.Integer({ minimum: 0 }))
});
var SessionFileBrowserResultSchema = closedObject({
  path: Type37.String(),
  parentPath: Type37.Optional(Type37.String()),
  search: Type37.Optional(Type37.String()),
  entries: Type37.Array(SessionFileBrowserEntrySchema),
  truncated: Type37.Optional(Type37.Boolean())
});
var SessionsFilesListParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString),
  path: Type37.Optional(Type37.String()),
  search: Type37.Optional(Type37.String())
});
var SessionsFilesListResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type37.Optional(NonEmptyString),
  files: Type37.Array(SessionFileEntrySchema),
  browser: Type37.Optional(SessionFileBrowserResultSchema)
});
var SessionsFilesGetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  path: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString)
});
var SessionsFilesGetResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type37.Optional(NonEmptyString),
  file: SessionFileEntrySchema
});
var SessionsFilesSetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  path: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString),
  content: Type37.String(),
  expectedHash: SessionFileHashSchema
});
var SessionsFilesSetResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type37.Optional(NonEmptyString),
  file: SessionFileEntrySchema
});
var SessionsFilesRevealParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString)
});
var SessionsFilesRevealResultSchema = closedObject({
  ok: Type37.Boolean(),
  path: Type37.Optional(NonEmptyString),
  error: Type37.Optional(NonEmptyString)
});
var SessionDiffFileStatusSchema = Type37.Union([
  Type37.Literal("added"),
  Type37.Literal("modified"),
  Type37.Literal("deleted"),
  Type37.Literal("renamed")
]);
var SessionDiffFileSchema = closedObject({
  path: NonEmptyString,
  oldPath: Type37.Optional(NonEmptyString),
  status: SessionDiffFileStatusSchema,
  additions: Type37.Integer({ minimum: 0 }),
  deletions: Type37.Integer({ minimum: 0 }),
  binary: Type37.Optional(Type37.Boolean()),
  untracked: Type37.Optional(Type37.Boolean()),
  /** Per-file unified patch text; absent for binary or oversized files. */
  patch: Type37.Optional(Type37.String()),
  truncated: Type37.Optional(Type37.Boolean())
});
var SessionsDiffParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString)
});
var SessionsDiffResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type37.Optional(NonEmptyString),
  branch: Type37.Optional(NonEmptyString),
  /** Display label of the diff base: the default branch name or "HEAD". */
  baseRef: Type37.Optional(NonEmptyString),
  files: Type37.Array(SessionDiffFileSchema),
  additions: Type37.Integer({ minimum: 0 }),
  deletions: Type37.Integer({ minimum: 0 }),
  truncated: Type37.Optional(Type37.Boolean()),
  unavailableReason: Type37.Optional(
    Type37.Union([Type37.Literal("unknown_session"), Type37.Literal("not_git")])
  )
});
var SessionsListParamsSchema = closedObject({
  /** Maximum rows to return; omitted Gateway RPC calls use a bounded default. */
  limit: Type37.Optional(Type37.Integer({ minimum: 1 })),
  offset: Type37.Optional(Type37.Integer({ minimum: 0 })),
  activeMinutes: Type37.Optional(Type37.Integer({ minimum: 1 })),
  /** Require a real user/channel interaction; excludes synthetic isolated heartbeat rows. */
  requireLastInteraction: Type37.Optional(Type37.Boolean()),
  sortBy: Type37.Optional(Type37.Union([Type37.Literal("updatedAt"), Type37.Literal("lastInteractionAt")])),
  includeGlobal: Type37.Optional(Type37.Boolean()),
  includeUnknown: Type37.Optional(Type37.Boolean()),
  /** Limit agent-scoped rows to agents currently present in config. */
  configuredAgentsOnly: Type37.Optional(Type37.Boolean()),
  /**
   * Read first 8KB of each session transcript to derive title from first user message.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeDerivedTitles: Type37.Optional(Type37.Boolean()),
  /**
   * Read last 16KB of each session transcript to extract most recent message preview.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeLastMessage: Type37.Optional(Type37.Boolean()),
  label: Type37.Optional(SessionLabelString),
  spawnedBy: Type37.Optional(NonEmptyString),
  agentId: Type37.Optional(NonEmptyString),
  search: Type37.Optional(Type37.String()),
  /** True lists archived sessions; false or omitted lists active sessions. */
  archived: Type37.Optional(Type37.Boolean())
});
var SessionsSearchParamsSchema = closedObject({
  agentId: Type37.Optional(NonEmptyString),
  sessionKeys: Type37.Optional(Type37.Array(NonEmptyString, { minItems: 1, maxItems: 200 })),
  query: Type37.String({ minLength: 1, maxLength: 4096 }),
  limit: Type37.Optional(Type37.Integer({ minimum: 1, maximum: 25 }))
});
var SessionsSearchHitSchema = closedObject({
  sessionKey: NonEmptyString,
  sessionId: NonEmptyString,
  messageId: NonEmptyString,
  role: Type37.Union([Type37.Literal("user"), Type37.Literal("assistant")]),
  timestamp: Type37.Integer({ minimum: 0 }),
  snippet: Type37.String(),
  score: Type37.Number()
});
var SessionsSearchResultSchema = closedObject({
  results: Type37.Array(SessionsSearchHitSchema),
  indexing: Type37.Optional(Type37.Boolean()),
  truncated: Type37.Optional(Type37.Boolean())
});
var SessionsCleanupParamsSchema = closedObject({
  agent: Type37.Optional(NonEmptyString),
  allAgents: Type37.Optional(Type37.Boolean()),
  enforce: Type37.Optional(Type37.Boolean()),
  activeKey: Type37.Optional(NonEmptyString),
  fixMissing: Type37.Optional(Type37.Boolean()),
  fixDmScope: Type37.Optional(Type37.Boolean())
});
var SessionsPreviewParamsSchema = closedObject({
  keys: Type37.Array(NonEmptyString, { minItems: 1 }),
  limit: Type37.Optional(Type37.Integer({ minimum: 1 })),
  maxChars: Type37.Optional(Type37.Integer({ minimum: 20 }))
});
var SessionsDescribeParamsSchema = closedObject({
  key: NonEmptyString,
  includeDerivedTitles: Type37.Optional(Type37.Boolean()),
  includeLastMessage: Type37.Optional(Type37.Boolean())
});
var SessionsResolveParamsSchema = closedObject({
  key: Type37.Optional(NonEmptyString),
  sessionId: Type37.Optional(NonEmptyString),
  label: Type37.Optional(SessionLabelString),
  agentId: Type37.Optional(NonEmptyString),
  spawnedBy: Type37.Optional(NonEmptyString),
  includeGlobal: Type37.Optional(Type37.Boolean()),
  includeUnknown: Type37.Optional(Type37.Boolean()),
  /** Return a successful `{ ok: false }` response when the selector does not match a session. */
  allowMissing: Type37.Optional(Type37.Boolean())
});
var SessionWorktreeInfoSchema = closedObject({
  id: NonEmptyString,
  path: NonEmptyString,
  branch: NonEmptyString
});
var SessionsCreateResultSchema = Type37.Object(
  {
    ok: Type37.Literal(true),
    key: NonEmptyString,
    sessionId: Type37.Optional(NonEmptyString),
    entry: Type37.Optional(Type37.Record(Type37.String(), Type37.Unknown())),
    runStarted: Type37.Optional(Type37.Boolean()),
    runError: Type37.Optional(ErrorShapeSchema),
    worktree: Type37.Optional(SessionWorktreeInfoSchema)
  },
  { additionalProperties: true }
);
var SessionsSendParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString),
  message: Type37.String(),
  thinking: Type37.Optional(Type37.String()),
  attachments: Type37.Optional(Type37.Array(Type37.Unknown())),
  timeoutMs: Type37.Optional(Type37.Integer({ minimum: 0 })),
  idempotencyKey: Type37.Optional(NonEmptyString)
});
var SessionsMessagesSubscribeParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString),
  /** Opt in to sanitized durable approval events for this session and its descendants. */
  includeApprovals: Type37.Optional(Type37.Literal(true))
});
var SessionsMessagesUnsubscribeParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString)
});
var SessionsAbortParamsSchema = closedObject({
  key: Type37.Optional(NonEmptyString),
  runId: Type37.Optional(NonEmptyString),
  agentId: Type37.Optional(NonEmptyString)
});
var SessionsPatchParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString),
  label: Type37.Optional(Type37.Union([SessionLabelString, Type37.Null()])),
  /** User-defined organization bucket ("category", not chat-group); null clears it. */
  category: Type37.Optional(Type37.Union([SessionLabelString, Type37.Null()])),
  icon: Type37.Optional(
    Type37.Union([NonEmptyString, Type37.Null()], {
      description: "Sidebar icon: one emoji, name:<id>, or svg:<svg ...>...</svg>."
    })
  ),
  statusNote: Type37.Optional(
    Type37.Union([Type37.String({ maxLength: 120 }), Type37.Null()], {
      description: "Short expiring sidebar status note; null clears it and any declared attention."
    })
  ),
  attention: Type37.Optional(
    Type37.Union([Type37.String({ enum: [...SESSION_AGENT_ATTENTION_ICON_IDS] }), Type37.Null()])
  ),
  ttlMinutes: Type37.Optional(Type37.Integer({ minimum: 1, maximum: 120 })),
  archived: Type37.Optional(Type37.Boolean()),
  pinned: Type37.Optional(Type37.Boolean()),
  unread: Type37.Optional(
    Type37.Boolean({ description: "Set true to mark unread; false records the session as read." })
  ),
  thinkingLevel: Type37.Optional(Type37.Union([NonEmptyString, Type37.Null()])),
  fastMode: Type37.Optional(Type37.Union([Type37.Boolean(), Type37.Literal("auto"), Type37.Null()])),
  verboseLevel: Type37.Optional(Type37.Union([NonEmptyString, Type37.Null()])),
  traceLevel: Type37.Optional(Type37.Union([NonEmptyString, Type37.Null()])),
  reasoningLevel: Type37.Optional(Type37.Union([NonEmptyString, Type37.Null()])),
  responseUsage: Type37.Optional(
    Type37.Union([
      Type37.Literal("off"),
      Type37.Literal("tokens"),
      Type37.Literal("full"),
      // Backward compat with older clients/stores.
      Type37.Literal("on"),
      Type37.Null()
    ])
  ),
  elevatedLevel: Type37.Optional(Type37.Union([NonEmptyString, Type37.Null()])),
  execHost: Type37.Optional(Type37.Union([NonEmptyString, Type37.Null()])),
  execSecurity: Type37.Optional(Type37.Union([NonEmptyString, Type37.Null()])),
  execAsk: Type37.Optional(Type37.Union([NonEmptyString, Type37.Null()])),
  execNode: Type37.Optional(Type37.Union([NonEmptyString, Type37.Null()])),
  model: Type37.Optional(Type37.Union([NonEmptyString, Type37.Null()])),
  spawnedBy: Type37.Optional(Type37.Union([NonEmptyString, Type37.Null()])),
  spawnedWorkspaceDir: Type37.Optional(Type37.Union([NonEmptyString, Type37.Null()])),
  spawnedCwd: Type37.Optional(Type37.Union([NonEmptyString, Type37.Null()])),
  spawnDepth: Type37.Optional(Type37.Union([Type37.Integer({ minimum: 0 }), Type37.Null()])),
  subagentRole: Type37.Optional(
    Type37.Union([Type37.Literal("orchestrator"), Type37.Literal("leaf"), Type37.Null()])
  ),
  subagentControlScope: Type37.Optional(
    Type37.Union([Type37.Literal("children"), Type37.Literal("none"), Type37.Null()])
  ),
  inheritedToolAllow: Type37.Optional(Type37.Union([Type37.Array(NonEmptyString), Type37.Null()])),
  inheritedToolDeny: Type37.Optional(Type37.Union([Type37.Array(NonEmptyString), Type37.Null()])),
  sendPolicy: Type37.Optional(Type37.Union([Type37.Literal("allow"), Type37.Literal("deny"), Type37.Null()])),
  groupActivation: Type37.Optional(
    Type37.Union([Type37.Literal("mention"), Type37.Literal("always"), Type37.Null()])
  )
});
var SessionsPluginPatchParamsSchema = closedObject({
  key: NonEmptyString,
  pluginId: NonEmptyString,
  namespace: NonEmptyString,
  value: Type37.Optional(PluginJsonValueSchema),
  unset: Type37.Optional(Type37.Boolean())
});
var SessionsPluginPatchResultSchema = closedObject({
  ok: Type37.Literal(true),
  key: NonEmptyString,
  value: Type37.Optional(PluginJsonValueSchema)
});
var SessionsResetParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString),
  reason: Type37.Optional(Type37.Union([Type37.Literal("new"), Type37.Literal("reset")]))
});
var SessionsDeleteParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString),
  deleteTranscript: Type37.Optional(Type37.Boolean()),
  // Internal compare-and-delete guard for lifecycle-owned cleanup.
  expectedSessionId: Type37.Optional(NonEmptyString),
  expectedLifecycleRevision: Type37.Optional(NonEmptyString),
  expectedSessionUpdatedAt: Type37.Optional(Type37.Number({ minimum: 0 })),
  // Internal control: when false, still unbind thread bindings but skip hook emission.
  emitLifecycleHooks: Type37.Optional(Type37.Boolean()),
  /**
   * Restricts the delete to already-archived sessions (archive-then-delete).
   * operator.write callers must set this; deletes without it require
   * operator.admin.
   */
  archivedOnly: Type37.Optional(Type37.Boolean())
});
var SessionsGroupsListParamsSchema = closedObject({});
var SessionGroupSchema = closedObject({
  name: SessionLabelString,
  position: Type37.Integer({ minimum: 0 })
});
var SessionsGroupsListResultSchema = closedObject({
  groups: Type37.Array(SessionGroupSchema)
});
var SessionsGroupsPutParamsSchema = closedObject({
  names: Type37.Array(SessionLabelString, { maxItems: 200 })
});
var SessionsGroupsRenameParamsSchema = closedObject({
  name: SessionLabelString,
  to: SessionLabelString
});
var SessionsGroupsDeleteParamsSchema = closedObject({ name: SessionLabelString });
var SessionsGroupsMutationResultSchema = closedObject({
  ok: Type37.Literal(true),
  groups: Type37.Array(SessionGroupSchema),
  updatedSessions: Type37.Optional(Type37.Integer({ minimum: 0 }))
});
var SessionsCompactParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString),
  maxLines: Type37.Optional(Type37.Integer({ minimum: 1 }))
});
var SessionsCompactionListParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString)
});
var SessionsCompactionGetParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString),
  checkpointId: NonEmptyString
});
var SessionsCompactionBranchParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString),
  checkpointId: NonEmptyString
});
var SessionsCompactionRestoreParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString),
  checkpointId: NonEmptyString
});
var SessionsRewindParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString),
  entryId: NonEmptyString
});
var SessionsForkParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString),
  entryId: NonEmptyString
});
var SessionsRewindResultSchema = closedObject({
  editorText: Type37.Optional(Type37.String())
});
var SessionsForkResultSchema = closedObject({
  sessionKey: NonEmptyString,
  editorText: Type37.Optional(Type37.String())
});
var SessionBranchSchema = closedObject({
  leafEntryId: NonEmptyString,
  headline: Type37.String(),
  messageCount: Type37.Integer({ minimum: 0 }),
  updatedAt: Type37.Optional(NonEmptyString),
  active: Type37.Boolean()
});
var SessionsBranchesListParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString)
});
var SessionsBranchesListResultSchema = closedObject({
  branches: Type37.Array(SessionBranchSchema)
});
var SessionsBranchesSwitchParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type37.Optional(NonEmptyString),
  leafEntryId: NonEmptyString
});
var SessionsBranchesSwitchResultSchema = closedObject({});
var SessionsCompactionListResultSchema = closedObject({
  ok: Type37.Literal(true),
  key: NonEmptyString,
  checkpoints: Type37.Array(SessionCompactionCheckpointSchema)
});
var SessionsCompactionGetResultSchema = closedObject({
  ok: Type37.Literal(true),
  key: NonEmptyString,
  checkpoint: SessionCompactionCheckpointSchema
});
var SessionsCompactionBranchResultSchema = closedObject({
  ok: Type37.Literal(true),
  sourceKey: NonEmptyString,
  key: NonEmptyString,
  sessionId: NonEmptyString,
  checkpoint: SessionCompactionCheckpointSchema,
  entry: Type37.Object(
    {
      sessionId: NonEmptyString,
      updatedAt: Type37.Integer({ minimum: 0 })
    },
    { additionalProperties: true }
  )
});
var SessionsCompactionRestoreResultSchema = closedObject({
  ok: Type37.Literal(true),
  key: NonEmptyString,
  sessionId: NonEmptyString,
  checkpoint: SessionCompactionCheckpointSchema,
  entry: Type37.Object(
    {
      sessionId: NonEmptyString,
      updatedAt: Type37.Integer({ minimum: 0 })
    },
    { additionalProperties: true }
  )
});
var SessionsUsageParamsSchema = closedObject({
  /** Specific session key to analyze; if omitted returns sessions for the effective agent. */
  key: Type37.Optional(NonEmptyString),
  /** Agent scope for list-style usage queries. */
  agentId: Type37.Optional(NonEmptyString),
  /** Explicit all-agent scope for list-style usage queries. */
  agentScope: Type37.Optional(Type37.Literal("all")),
  /** Start date for range filter (YYYY-MM-DD). */
  startDate: Type37.Optional(Type37.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
  /** End date for range filter (YYYY-MM-DD). */
  endDate: Type37.Optional(Type37.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
  /** How start/end dates should be interpreted. Defaults to UTC when omitted. */
  mode: Type37.Optional(
    Type37.Union([Type37.Literal("utc"), Type37.Literal("gateway"), Type37.Literal("specific")])
  ),
  /** Preset range for usage queries when explicit start/end dates are omitted. */
  range: Type37.Optional(
    Type37.Union([
      Type37.Literal("7d"),
      Type37.Literal("30d"),
      Type37.Literal("90d"),
      Type37.Literal("1y"),
      Type37.Literal("all")
    ])
  ),
  /** Usage row grouping. `family` rolls up known rotated session ids for a logical key. */
  groupBy: Type37.Optional(Type37.Union([Type37.Literal("instance"), Type37.Literal("family")])),
  /** Backward-compatible alias for requesting family grouping. */
  includeHistorical: Type37.Optional(
    Type37.Boolean({
      deprecated: true,
      description: "Deprecated alias for groupBy: family."
    })
  ),
  /** UTC offset to use when mode is `specific` (for example, UTC-4 or UTC+5:30). */
  utcOffset: Type37.Optional(
    Type37.String({
      pattern: "^UTC[+-]\\d{1,2}(?::[0-5]\\d)?$",
      deprecated: true,
      description: "Deprecated compatibility fallback; use timeZone."
    })
  ),
  /** IANA time zone for `specific`; preferred over `utcOffset`, which remains a compatibility fallback. */
  timeZone: Type37.Optional(NonEmptyString),
  /** Maximum sessions to return (default 50). */
  limit: Type37.Optional(Type37.Integer({ minimum: 1 })),
  /** Include context weight breakdown (systemPromptReport). */
  includeContextWeight: Type37.Optional(Type37.Boolean())
});

// packages/gateway-protocol/src/schema/skill-history.ts
import { Type as Type38 } from "typebox";

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
var SkillsProposalHistoryStatusParamsSchema = Type38.Object(
  { agentId: Type38.Optional(NonEmptyString) },
  { additionalProperties: false }
);
var SkillsProposalHistoryScanParamsSchema = Type38.Object(
  {
    agentId: Type38.Optional(NonEmptyString),
    direction: Type38.Optional(Type38.Union([Type38.Literal("older"), Type38.Literal("newer")]))
  },
  { additionalProperties: false }
);
var SkillsProposalHistoryScanResultSchema = Type38.Object(
  {
    schema: Type38.Literal("openclaw.skill-workshop.history-scan.v1"),
    hasScanned: Type38.Boolean(),
    reviewedSessions: Type38.Integer({ minimum: 0 }),
    ideasFound: Type38.Integer({ minimum: 0 }),
    hasMore: Type38.Boolean(),
    lastScanReviewed: Type38.Integer({ minimum: 0 }),
    lastScanIdeas: Type38.Integer({ minimum: 0 }),
    lastScanAt: Type38.Optional(NonEmptyString),
    oldestReviewedAt: Type38.Optional(NonEmptyString),
    newestReviewedAt: Type38.Optional(NonEmptyString)
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
import { Type as Type39 } from "typebox";
var SystemInfoParamsSchema = closedObject({});
var SystemInfoResultSchema = closedObject({
  machineName: Type39.String(),
  hostname: Type39.String(),
  platform: Type39.String(),
  release: Type39.String(),
  arch: Type39.String(),
  osLabel: Type39.String(),
  lanAddress: Type39.Optional(Type39.String()),
  port: Type39.Optional(Type39.Integer()),
  nodeVersion: Type39.String(),
  pid: Type39.Integer(),
  /** Process-start identity for invalidating work that cannot survive a Gateway restart. */
  processInstanceId: Type39.Optional(Type39.String({ minLength: 1 })),
  uptimeMs: Type39.Integer(),
  cpuCount: Type39.Integer(),
  cpuModel: Type39.Optional(Type39.String()),
  loadAverage: Type39.Optional(Type39.Tuple([Type39.Number(), Type39.Number(), Type39.Number()])),
  memoryTotalBytes: Type39.Integer(),
  memoryFreeBytes: Type39.Integer(),
  diskTotalBytes: Type39.Optional(Type39.Integer()),
  diskAvailableBytes: Type39.Optional(Type39.Integer()),
  diskPath: Type39.Optional(Type39.String())
});

// packages/gateway-protocol/src/schema/talk-marks.ts
var TalkSessionAcknowledgeMarkParamsSchema = closedObject({
  sessionId: NonEmptyString,
  markName: NonEmptyString
});

// packages/gateway-protocol/src/schema/task-suggestions.ts
import { Type as Type40 } from "typebox";
var TaskIdSchema = Type40.String({ minLength: 1, maxLength: 128 });
var TaskTitleSchema = Type40.String({ minLength: 1, maxLength: 60 });
var TaskPromptSchema = Type40.String({ minLength: 1, maxLength: 32768 });
var TaskTldrSchema = Type40.String({ minLength: 1, maxLength: 1024 });
var TaskCwdSchema = Type40.String({ minLength: 1, maxLength: 4096 });
var TaskSessionKeySchema = Type40.String({ minLength: 1, maxLength: 512 });
var TaskAgentIdSchema = Type40.String({ minLength: 1, maxLength: 128 });
var TaskSuggestionSchema = closedObject({
  id: TaskIdSchema,
  title: TaskTitleSchema,
  prompt: TaskPromptSchema,
  tldr: TaskTldrSchema,
  cwd: TaskCwdSchema,
  sessionKey: TaskSessionKeySchema,
  agentId: Type40.Optional(TaskAgentIdSchema),
  createdAt: Type40.Integer({ minimum: 0 })
});
var TaskSuggestionsListParamsSchema = closedObject({
  sessionKey: Type40.Optional(TaskSessionKeySchema),
  agentId: Type40.Optional(TaskAgentIdSchema)
});
var TaskSuggestionsListResultSchema = closedObject({
  suggestions: Type40.Array(TaskSuggestionSchema)
});
var TaskSuggestionsCreateParamsSchema = closedObject({
  title: TaskTitleSchema,
  prompt: TaskPromptSchema,
  tldr: TaskTldrSchema,
  cwd: TaskCwdSchema,
  sessionKey: TaskSessionKeySchema,
  agentId: Type40.Optional(TaskAgentIdSchema)
});
var TaskSuggestionsCreateResultSchema = closedObject({
  taskId: TaskIdSchema,
  suggestion: TaskSuggestionSchema
});
var TaskSuggestionResolutionSchema = Type40.Union([
  Type40.Literal("dismissed"),
  Type40.Literal("accepted"),
  Type40.Literal("expired")
]);
var TaskSuggestionsAcceptParamsSchema = closedObject({ taskId: TaskIdSchema });
var TaskSuggestionsAcceptResultSchema = closedObject({
  taskId: TaskIdSchema,
  key: TaskSessionKeySchema
});
var TaskSuggestionsDismissParamsSchema = closedObject({
  taskId: TaskIdSchema,
  reason: Type40.Optional(Type40.String({ maxLength: 1024 }))
});
var TaskSuggestionsDismissResultSchema = closedObject({
  taskId: TaskIdSchema,
  dismissed: Type40.Boolean()
});
var TaskSuggestionEventSchema = Type40.Union([
  closedObject({ action: Type40.Literal("created"), suggestion: TaskSuggestionSchema }),
  closedObject({
    action: Type40.Literal("resolved"),
    taskId: TaskIdSchema,
    resolution: TaskSuggestionResolutionSchema
  })
]);

// packages/gateway-protocol/src/schema/tasks.ts
import { Type as Type41 } from "typebox";
var TaskLedgerStatusSchema = Type41.Union([
  Type41.Literal("queued"),
  Type41.Literal("running"),
  Type41.Literal("completed"),
  Type41.Literal("failed"),
  Type41.Literal("cancelled"),
  Type41.Literal("timed_out")
]);
var TimestampSchema = Type41.Union([Type41.String(), Type41.Integer({ minimum: 0 })]);
var TaskSummarySchema = closedObject({
  id: NonEmptyString,
  kind: Type41.Optional(Type41.String()),
  runtime: Type41.Optional(Type41.String()),
  status: TaskLedgerStatusSchema,
  title: Type41.Optional(Type41.String()),
  agentId: Type41.Optional(Type41.String()),
  sessionKey: Type41.Optional(Type41.String()),
  childSessionKey: Type41.Optional(Type41.String()),
  ownerKey: Type41.Optional(Type41.String()),
  runId: Type41.Optional(Type41.String()),
  taskId: Type41.Optional(Type41.String()),
  flowId: Type41.Optional(Type41.String()),
  parentTaskId: Type41.Optional(Type41.String()),
  sourceId: Type41.Optional(Type41.String()),
  createdAt: Type41.Optional(TimestampSchema),
  updatedAt: Type41.Optional(TimestampSchema),
  startedAt: Type41.Optional(TimestampSchema),
  endedAt: Type41.Optional(TimestampSchema),
  toolUseCount: Type41.Optional(Type41.Integer({ minimum: 0 })),
  lastToolName: Type41.Optional(Type41.String()),
  progressSummary: Type41.Optional(Type41.String()),
  terminalSummary: Type41.Optional(Type41.String()),
  error: Type41.Optional(Type41.String()),
  /** Bounded task input. Returned by tasks.get; omitted from list/event summaries. */
  prompt: Type41.Optional(Type41.String())
});
var TasksListParamsSchema = closedObject({
  status: Type41.Optional(Type41.Union([TaskLedgerStatusSchema, Type41.Array(TaskLedgerStatusSchema)])),
  agentId: Type41.Optional(NonEmptyString),
  sessionKey: Type41.Optional(NonEmptyString),
  limit: Type41.Optional(Type41.Integer({ minimum: 1, maximum: 500 })),
  cursor: Type41.Optional(Type41.String())
});
var TasksListResultSchema = closedObject({
  tasks: Type41.Array(TaskSummarySchema),
  nextCursor: Type41.Optional(Type41.String())
});
var TasksGetParamsSchema = closedObject({
  taskId: NonEmptyString
});
var TasksGetResultSchema = closedObject({
  task: TaskSummarySchema
});
var TasksCancelParamsSchema = closedObject({
  taskId: NonEmptyString,
  reason: Type41.Optional(Type41.String())
});
var TasksCancelResultSchema = closedObject({
  found: Type41.Boolean(),
  cancelled: Type41.Boolean(),
  reason: Type41.Optional(Type41.String()),
  task: Type41.Optional(TaskSummarySchema)
});

// packages/gateway-protocol/src/schema/terminal.ts
import { Type as Type42 } from "typebox";

// packages/gateway-protocol/src/schema/terminal-constants.ts
var MAX_TERMINAL_UPLOAD_BYTES = 16 * 1024 * 1024;
var MAX_TERMINAL_UPLOAD_BASE64_LENGTH = Math.ceil(MAX_TERMINAL_UPLOAD_BYTES / 3) * 4;
var MAX_TERMINAL_UPLOAD_NAME_LENGTH = 255;

// packages/gateway-protocol/src/schema/terminal.ts
var TerminalDimension = Type42.Integer({ minimum: 1, maximum: 2e3 });
var TerminalOpenParamsSchema = closedObject({
  // Optional agent selector; defaults to the gateway's default agent. The
  // session starts in that agent's workspace and inherits its isolation.
  agentId: Type42.Optional(NonEmptyString),
  catalog: Type42.Optional(SessionCatalogLocatorSchema),
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
  confined: Type42.Boolean(),
  title: Type42.Optional(NonEmptyString)
});
var TerminalInputParamsSchema = closedObject({
  sessionId: NonEmptyString,
  // Raw terminal input (already-encoded escape sequences from the emulator).
  data: Type42.String()
});
var TerminalUploadParamsSchema = closedObject({
  sessionId: NonEmptyString,
  name: Type42.String({ minLength: 1, maxLength: MAX_TERMINAL_UPLOAD_NAME_LENGTH }),
  contentBase64: Type42.String({ maxLength: MAX_TERMINAL_UPLOAD_BASE64_LENGTH })
});
var TerminalUploadResultSchema = closedObject({
  path: NonEmptyString,
  size: Type42.Integer({ minimum: 0, maximum: MAX_TERMINAL_UPLOAD_BYTES })
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
  confined: Type42.Boolean(),
  // Recent raw output from the server's bounded ring buffer, replayed into
  // the client emulator before live terminal.data resumes. Not a true screen
  // snapshot: after truncation it can start mid-escape-sequence; emulators
  // recover on the next full repaint (prompt, clear, resize redraw).
  buffer: Type42.String(),
  // Gateways include this cumulative UTF-16 snapshot offset when the client
  // advertises terminal-offset-seq. Optional across protocol-4 version skew.
  seq: Type42.Optional(Type42.Integer({ minimum: 0 }))
});
var TerminalSessionInfoSchema = closedObject({
  sessionId: NonEmptyString,
  agentId: NonEmptyString,
  shell: NonEmptyString,
  cwd: NonEmptyString,
  confined: Type42.Boolean(),
  /** False while the session is detached (no connection owns its stream). */
  attached: Type42.Boolean(),
  /** Connection-owned session, or the trusted agent session key that owns it. */
  owner: Type42.Optional(Type42.Union([Type42.Literal("conn"), Type42.String({ pattern: "^agent:.+" })])),
  createdAtMs: Type42.Integer({ minimum: 0 })
});
var TerminalListResultSchema = closedObject({
  sessions: Type42.Array(TerminalSessionInfoSchema)
});
var TerminalTextParamsSchema = closedObject({ sessionId: NonEmptyString });
var TerminalTextResultSchema = closedObject({ text: Type42.String() });
var TerminalAckResultSchema = closedObject({ ok: Type42.Boolean() });
var TerminalDataEventSchema = withSince(
  "2026.7",
  closedObject({
    sessionId: NonEmptyString,
    seq: Type42.Integer({ minimum: 0 }),
    data: Type42.String()
  })
);
var TerminalExitEventSchema = withSince(
  "2026.7",
  closedObject({
    sessionId: NonEmptyString,
    exitCode: Type42.Optional(Type42.Union([Type42.Integer(), Type42.Null()])),
    signal: Type42.Optional(Type42.Union([Type42.Integer(), Type42.Null()])),
    // Stable reason code so clients can distinguish process exit from a
    // server-side teardown (disconnect, idle sweep, config disable).
    reason: Type42.Optional(
      Type42.Union([
        Type42.Literal("process_exit"),
        Type42.Literal("closed"),
        Type42.Literal("disconnected"),
        // Another admin connection attached the session away; the session is
        // still alive server-side, but no longer streams to this connection.
        Type42.Literal("detached"),
        Type42.Literal("error")
      ])
    ),
    error: Type42.Optional(Type42.String())
  })
);
var TerminalEventSchema = withSince(
  "2026.7",
  Type42.Union([TerminalDataEventSchema, TerminalExitEventSchema])
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
import { Type as Type43 } from "typebox";
var UiSplitCommandSchema = closedObject({
  kind: Type43.Literal("split"),
  direction: Type43.Union([Type43.Literal("right"), Type43.Literal("down")]),
  sessionKey: NonEmptyString
});
var UiClosePaneCommandSchema = closedObject({
  kind: Type43.Literal("close-pane"),
  sessionKey: NonEmptyString
});
var UiFocusCommandSchema = closedObject({
  kind: Type43.Literal("focus"),
  sessionKey: NonEmptyString
});
var UiSidebarCommandSchema = closedObject({
  kind: Type43.Literal("sidebar"),
  visible: Type43.Boolean()
});
var UiPanelCommandSchema = closedObject({
  kind: Type43.Literal("panel"),
  panel: Type43.Union([Type43.Literal("terminal"), Type43.Literal("browser")]),
  open: Type43.Boolean(),
  dock: Type43.Optional(Type43.Union([Type43.Literal("bottom"), Type43.Literal("right")])),
  terminalSessionId: Type43.Optional(NonEmptyString)
});
var UiNavigateCommandSchema = closedObject({
  kind: Type43.Literal("navigate"),
  sessionKey: NonEmptyString
});
var UiCommandSchema = Type43.Union([
  UiSplitCommandSchema,
  UiClosePaneCommandSchema,
  UiFocusCommandSchema,
  UiSidebarCommandSchema,
  UiPanelCommandSchema,
  UiNavigateCommandSchema
]);
var UiCommandParamsSchema = closedObject({
  command: UiCommandSchema,
  sessionKey: Type43.Optional(NonEmptyString)
});
var UiCommandResultSchema = closedObject({ ok: Type43.Boolean() });

// packages/gateway-protocol/src/schema/worker-admission.ts
import { Type as Type45 } from "typebox";

// packages/gateway-protocol/src/schema/worker-protocol-primitives.ts
import { Type as Type44 } from "typebox";
var WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH = 256;
var WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH = 128;
var WORKER_PROTOCOL_MAX_PAYLOAD_BYTES = 64 * 1024;
var WorkerIdentifierSchema = Type44.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH,
  pattern: "^\\S(?:.*\\S)?$"
});
var WorkerFrameIdSchema = Type44.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH
});
var WorkerAdmissionFailureReasonSchema = Type44.Union([
  Type44.Literal("invalid-credential"),
  Type44.Literal("credential-expired"),
  Type44.Literal("environment-mismatch"),
  Type44.Literal("environment-unavailable"),
  Type44.Literal("bundle-mismatch"),
  Type44.Literal("version-mismatch"),
  Type44.Literal("session-mismatch"),
  Type44.Literal("placement-mismatch"),
  Type44.Literal("owner-epoch-mismatch"),
  Type44.Literal("rpc-set-mismatch"),
  Type44.Literal("protocol-features-mismatch")
]);
var WorkerProtocolCloseReasonSchema = Type44.Union([
  WorkerAdmissionFailureReasonSchema,
  Type44.Literal("invalid-handshake"),
  Type44.Literal("protocol-mismatch"),
  Type44.Literal("gateway-unavailable"),
  Type44.Literal("invalid-frame"),
  Type44.Literal("slow-consumer"),
  Type44.Literal("method-not-allowed"),
  Type44.Literal("invalid-heartbeat"),
  Type44.Literal("credential-replaced"),
  Type44.Literal("gateway-shutdown")
]);
var WorkerErrorCodeSchema = Type44.Union([
  Type44.Literal("INVALID_REQUEST"),
  Type44.Literal("UNAVAILABLE")
]);
var WorkerErrorDetailsSchema = closedObject({ reason: WorkerProtocolCloseReasonSchema });
var WorkerErrorShapeSchema = closedObject({
  code: WorkerErrorCodeSchema,
  message: Type44.String({ minLength: 1, maxLength: 256 }),
  details: WorkerErrorDetailsSchema,
  retryable: Type44.Optional(Type44.Boolean()),
  retryAfterMs: Type44.Optional(Type44.Integer({ minimum: 0 }))
});
var WorkerErrorResponseFrameSchema = closedObject({
  type: Type44.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type44.Literal(false),
  error: WorkerErrorShapeSchema
});
var WorkerTranscriptUsageSchema = closedObject({
  input: Type44.Number({ minimum: 0 }),
  output: Type44.Number({ minimum: 0 }),
  cacheRead: Type44.Number({ minimum: 0 }),
  cacheWrite: Type44.Number({ minimum: 0 }),
  contextUsage: Type44.Optional(
    Type44.Union([
      closedObject({
        state: Type44.Literal("available"),
        promptTokens: Type44.Number({ minimum: 0 }),
        totalTokens: Type44.Number({ minimum: 0 })
      }),
      closedObject({ state: Type44.Literal("unavailable") })
    ])
  ),
  totalTokens: Type44.Number({ minimum: 0 }),
  cost: closedObject({
    input: Type44.Number({ minimum: 0 }),
    output: Type44.Number({ minimum: 0 }),
    cacheRead: Type44.Number({ minimum: 0 }),
    cacheWrite: Type44.Number({ minimum: 0 }),
    total: Type44.Number({ minimum: 0 }),
    totalOrigin: Type44.Optional(Type44.Literal("provider-billed"))
  })
});
var WorkerTranscriptAssistantDiagnosticSchema = closedObject({
  type: WorkerIdentifierSchema,
  timestamp: Type44.Integer({ minimum: 0 }),
  error: Type44.Optional(
    closedObject({
      name: Type44.Optional(Type44.String({ maxLength: 256 })),
      message: Type44.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
      stack: Type44.Optional(Type44.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
      code: Type44.Optional(Type44.Union([Type44.String({ maxLength: 256 }), Type44.Number()]))
    })
  ),
  details: Type44.Optional(
    Type44.Record(Type44.String({ minLength: 1, maxLength: 256 }), Type44.Unknown())
  )
});
var LiveTextSchema = Type44.String({
  maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
});
var LiveIntegerSchema = Type44.Integer({
  minimum: 0,
  maximum: Number.MAX_SAFE_INTEGER
});
var LiveSequenceSchema = Type44.Integer({
  minimum: 1,
  maximum: Number.MAX_SAFE_INTEGER
});

// packages/gateway-protocol/src/schema/worker-admission.ts
var WORKER_PROTOCOL_METHODS = [
  "worker.heartbeat",
  "worker.transcript.commit",
  "worker.live-event"
];
var WORKER_PROTOCOL_MAX_FEATURES = 64;
var WORKER_PROTOCOL_MAX_FEATURE_LENGTH = 128;
var WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES = 64;
var WORKER_TRANSCRIPT_MAX_CONTENT_PARTS = 128;
var WorkerCredentialSchema = Type45.String({ minLength: 16, maxLength: 256 });
var WorkerProtocolFeatureSchema = Type45.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_FEATURE_LENGTH
});
var WorkerBundleHashSchema2 = Type45.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var WorkerAdmissionHandshakeSchema = withSince(
  "2026.7",
  closedObject({
    bundleHash: WorkerBundleHashSchema2,
    openclawVersion: Type45.String({ minLength: 1, maxLength: 128 }),
    protocolFeatures: Type45.Array(WorkerProtocolFeatureSchema, {
      maxItems: WORKER_PROTOCOL_MAX_FEATURES,
      uniqueItems: true
    })
  })
);
var WorkerConnectAdmissionCommonProperties = {
  environmentId: WorkerIdentifierSchema,
  credential: WorkerCredentialSchema,
  ownerEpoch: Type45.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  rpcSetVersion: Type45.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
  handshake: WorkerAdmissionHandshakeSchema
};
var WorkerConnectAdmissionSchema = Type45.Union([
  closedObject({
    ...WorkerConnectAdmissionCommonProperties,
    sessionId: Type45.Null(),
    runId: Type45.Null()
  }),
  closedObject({
    ...WorkerConnectAdmissionCommonProperties,
    sessionId: WorkerIdentifierSchema,
    runId: WorkerIdentifierSchema
  })
]);
var WorkerConnectParamsSchema = closedObject({
  minProtocol: Type45.Integer({ minimum: 1 }),
  maxProtocol: Type45.Integer({ minimum: 1 }),
  client: closedObject({
    id: Type45.Literal(GATEWAY_CLIENT_IDS.WORKER),
    version: Type45.String({ minLength: 1, maxLength: 128 }),
    platform: Type45.String({ minLength: 1, maxLength: 128 }),
    mode: Type45.Literal(GATEWAY_CLIENT_MODES.WORKER)
  }),
  role: Type45.Literal("worker"),
  admission: WorkerConnectAdmissionSchema
});
var WorkerConnectRequestFrameSchema = closedObject({
  type: Type45.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type45.Literal("connect"),
  params: WorkerConnectParamsSchema
});
var WorkerHelloOkSchema = closedObject({
  type: Type45.Literal("worker-hello-ok"),
  environmentId: WorkerIdentifierSchema,
  sessionId: Type45.Union([WorkerIdentifierSchema, Type45.Null()]),
  ownerEpoch: Type45.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  rpcSetVersion: Type45.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
  protocolFeatures: Type45.Array(WorkerProtocolFeatureSchema, {
    maxItems: WORKER_PROTOCOL_MAX_FEATURES,
    uniqueItems: true
  }),
  credentialExpiresAtMs: Type45.Integer({ minimum: 0 }),
  policy: closedObject({
    heartbeatIntervalMs: Type45.Integer({ minimum: 1 }),
    maxPayload: Type45.Integer({ minimum: 1 })
  })
});
var WorkerAdmissionSuccessResponseFrameSchema = closedObject({
  type: Type45.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type45.Literal(true),
  payload: WorkerHelloOkSchema
});
var WorkerAdmissionResponseFrameSchema = Type45.Union([
  WorkerAdmissionSuccessResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
var WorkerStatusSchema = Type45.Union([
  Type45.Literal("ready"),
  Type45.Literal("busy"),
  Type45.Literal("draining")
]);
var WorkerHeartbeatParamsSchema = closedObject({
  sentAtMs: Type45.Integer({ minimum: 0 }),
  status: WorkerStatusSchema
});
var WorkerHeartbeatResultSchema = closedObject({
  receivedAtMs: Type45.Integer({ minimum: 0 }),
  status: Type45.Literal("ok"),
  ownerEpoch: Type45.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
});
var WorkerHeartbeatRequestFrameSchema = closedObject({
  type: Type45.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type45.Literal(WORKER_PROTOCOL_METHODS[0]),
  params: WorkerHeartbeatParamsSchema
});
var WorkerHeartbeatSuccessResponseFrameSchema = closedObject({
  type: Type45.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type45.Literal(true),
  payload: WorkerHeartbeatResultSchema
});
var WorkerHeartbeatResponseFrameSchema = Type45.Union([
  WorkerHeartbeatSuccessResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
var WorkerTranscriptTextContentSchema = closedObject({
  type: Type45.Literal("text"),
  text: Type45.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
  textSignature: Type45.Optional(
    Type45.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })
  )
});
var WorkerTranscriptThinkingContentSchema = closedObject({
  type: Type45.Literal("thinking"),
  thinking: Type45.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
  thinkingSignature: Type45.Optional(
    Type45.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })
  ),
  redacted: Type45.Optional(Type45.Boolean())
});
var WorkerTranscriptImageContentSchema = closedObject({
  type: Type45.Literal("image"),
  data: Type45.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
  mimeType: Type45.String({ minLength: 1, maxLength: 256 })
});
var WorkerTranscriptToolCallSchema = closedObject({
  type: Type45.Literal("toolCall"),
  id: WorkerIdentifierSchema,
  name: WorkerIdentifierSchema,
  arguments: Type45.Record(Type45.String({ minLength: 1, maxLength: 256 }), Type45.Unknown()),
  thoughtSignature: Type45.Optional(
    Type45.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })
  ),
  executionMode: Type45.Optional(Type45.Union([Type45.Literal("sequential"), Type45.Literal("parallel")]))
});
var WorkerTranscriptUserMessageSchema = closedObject({
  role: Type45.Literal("user"),
  content: Type45.Array(
    Type45.Union([WorkerTranscriptTextContentSchema, WorkerTranscriptImageContentSchema]),
    { minItems: 1, maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
  ),
  timestamp: Type45.Integer({ minimum: 0 })
});
var WorkerTranscriptAssistantMessageSchema = closedObject({
  role: Type45.Literal("assistant"),
  content: Type45.Array(
    Type45.Union([
      WorkerTranscriptTextContentSchema,
      WorkerTranscriptThinkingContentSchema,
      WorkerTranscriptToolCallSchema
    ]),
    { maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
  ),
  api: WorkerIdentifierSchema,
  provider: WorkerIdentifierSchema,
  model: WorkerIdentifierSchema,
  responseModel: Type45.Optional(WorkerIdentifierSchema),
  responseId: Type45.Optional(WorkerIdentifierSchema),
  diagnostics: Type45.Optional(
    Type45.Array(WorkerTranscriptAssistantDiagnosticSchema, {
      maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
    })
  ),
  usage: WorkerTranscriptUsageSchema,
  stopReason: Type45.Union([
    Type45.Literal("stop"),
    Type45.Literal("length"),
    Type45.Literal("toolUse"),
    Type45.Literal("error"),
    Type45.Literal("aborted")
  ]),
  errorMessage: Type45.Optional(Type45.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
  errorCode: Type45.Optional(Type45.String({ maxLength: 256 })),
  errorType: Type45.Optional(Type45.String({ maxLength: 256 })),
  errorBody: Type45.Optional(Type45.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
  timestamp: Type45.Integer({ minimum: 0 })
});
var WorkerTranscriptToolResultMessageSchema = closedObject({
  role: Type45.Literal("toolResult"),
  toolCallId: WorkerIdentifierSchema,
  toolName: WorkerIdentifierSchema,
  content: Type45.Array(
    Type45.Union([WorkerTranscriptTextContentSchema, WorkerTranscriptImageContentSchema]),
    { maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
  ),
  details: Type45.Optional(Type45.Unknown()),
  isError: Type45.Boolean(),
  timestamp: Type45.Integer({ minimum: 0 })
});
var WorkerTranscriptMessageSchema = Type45.Union([
  WorkerTranscriptUserMessageSchema,
  WorkerTranscriptAssistantMessageSchema,
  WorkerTranscriptToolResultMessageSchema
]);
var WorkerTranscriptCommitParamsSchema = closedObject({
  runEpoch: Type45.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  seq: Type45.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
  baseLeafId: Type45.Union([WorkerIdentifierSchema, Type45.Null()]),
  messages: Type45.Array(WorkerTranscriptMessageSchema, {
    minItems: 1,
    maxItems: WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES
  })
});
var WorkerTranscriptCommitResultSchema = closedObject({
  entryIds: Type45.Array(WorkerIdentifierSchema, {
    minItems: 1,
    maxItems: WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES
  }),
  newLeafId: WorkerIdentifierSchema
});
var WorkerTranscriptCommitErrorReasonSchema = Type45.Union([
  Type45.Literal("stale-base-leaf"),
  Type45.Literal("epoch-mismatch"),
  Type45.Literal("invalid-batch"),
  Type45.Literal("session-not-attached")
]);
var WorkerTranscriptCommitErrorShapeSchema = closedObject({
  code: Type45.Literal("INVALID_REQUEST"),
  message: Type45.String({ minLength: 1, maxLength: 256 }),
  details: closedObject({ reason: WorkerTranscriptCommitErrorReasonSchema })
});
var WorkerTranscriptCommitRequestFrameSchema = closedObject({
  type: Type45.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type45.Literal(WORKER_PROTOCOL_METHODS[1]),
  params: WorkerTranscriptCommitParamsSchema
});
var WorkerTranscriptCommitSuccessResponseFrameSchema = closedObject({
  type: Type45.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type45.Literal(true),
  payload: WorkerTranscriptCommitResultSchema
});
var WorkerTranscriptCommitErrorResponseFrameSchema = closedObject({
  type: Type45.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type45.Literal(false),
  error: WorkerTranscriptCommitErrorShapeSchema
});
var WorkerTranscriptCommitResponseFrameSchema = Type45.Union([
  WorkerTranscriptCommitSuccessResponseFrameSchema,
  WorkerTranscriptCommitErrorResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
function workerLiveObject(properties) {
  return closedObject(properties);
}
var OptionalLiveTextSchema = Type45.Optional(LiveTextSchema);
var OptionalLiveIntegerSchema = Type45.Optional(LiveIntegerSchema);
var LiveIdentifierSchema = Type45.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES,
  pattern: "^\\S(?:.*\\S)?$"
});
var WorkerLiveAssistantPayloadSchema = workerLiveObject({
  text: LiveTextSchema,
  delta: LiveTextSchema,
  replace: Type45.Optional(Type45.Literal(true)),
  mediaUrls: Type45.Optional(
    Type45.Array(LiveIdentifierSchema, {
      maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
    })
  ),
  phase: Type45.Optional(Type45.Union([Type45.Literal("commentary"), Type45.Literal("final_answer")])),
  itemId: Type45.Optional(WorkerIdentifierSchema)
});
var WorkerLiveThinkingPayloadSchema = workerLiveObject({
  text: LiveTextSchema,
  delta: LiveTextSchema
});
var WorkerLiveToolCommonProperties = {
  name: WorkerIdentifierSchema,
  toolCallId: WorkerIdentifierSchema,
  hideFromChannelProgress: Type45.Optional(Type45.Literal(true))
};
var WorkerLiveToolPayloadSchema = Type45.Union([
  workerLiveObject({
    ...WorkerLiveToolCommonProperties,
    phase: Type45.Literal("start"),
    args: Type45.Unknown()
  }),
  workerLiveObject({
    ...WorkerLiveToolCommonProperties,
    phase: Type45.Literal("update"),
    partialResult: Type45.Unknown()
  }),
  workerLiveObject({
    ...WorkerLiveToolCommonProperties,
    phase: Type45.Literal("result"),
    meta: OptionalLiveTextSchema,
    isError: Type45.Boolean(),
    result: Type45.Unknown(),
    toolErrorSummary: OptionalLiveTextSchema
  })
]);
var WorkerLiveApprovalCommonProperties = {
  kind: Type45.Union([Type45.Literal("exec"), Type45.Literal("plugin"), Type45.Literal("unknown")]),
  title: LiveTextSchema,
  itemId: Type45.Optional(WorkerIdentifierSchema),
  toolCallId: Type45.Optional(WorkerIdentifierSchema),
  approvalId: Type45.Optional(WorkerIdentifierSchema),
  approvalSlug: Type45.Optional(WorkerIdentifierSchema),
  command: OptionalLiveTextSchema,
  host: OptionalLiveTextSchema,
  reason: OptionalLiveTextSchema,
  scope: Type45.Optional(Type45.Union([Type45.Literal("turn"), Type45.Literal("session")])),
  message: OptionalLiveTextSchema
};
var WorkerLiveApprovalPayloadSchema = Type45.Union([
  workerLiveObject({
    ...WorkerLiveApprovalCommonProperties,
    phase: Type45.Literal("requested"),
    status: Type45.Union([Type45.Literal("pending"), Type45.Literal("unavailable")])
  }),
  workerLiveObject({
    ...WorkerLiveApprovalCommonProperties,
    phase: Type45.Literal("resolved"),
    status: Type45.Union([Type45.Literal("approved"), Type45.Literal("denied"), Type45.Literal("failed")])
  })
]);
var WorkerLiveLifecycleStartPayloadSchema = workerLiveObject({
  phase: Type45.Literal("start"),
  startedAt: LiveIntegerSchema
});
var WorkerLiveFallbackReasonSchema = Type45.Union([
  Type45.Literal("auth"),
  Type45.Literal("auth_permanent"),
  Type45.Literal("format"),
  Type45.Literal("rate_limit"),
  Type45.Literal("overloaded"),
  Type45.Literal("billing"),
  Type45.Literal("server_error"),
  Type45.Literal("timeout"),
  Type45.Literal("context_overflow"),
  Type45.Literal("model_not_found"),
  Type45.Literal("session_expired"),
  Type45.Literal("empty_response"),
  Type45.Literal("no_error_details"),
  Type45.Literal("unclassified"),
  Type45.Literal("unknown")
]);
var WorkerLiveFallbackAttemptSchema = workerLiveObject({
  provider: LiveIdentifierSchema,
  model: LiveIdentifierSchema,
  error: LiveTextSchema,
  reason: Type45.Optional(WorkerLiveFallbackReasonSchema),
  authMode: Type45.Optional(LiveIdentifierSchema),
  status: OptionalLiveIntegerSchema,
  code: Type45.Optional(Type45.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }))
});
var WorkerLiveFallbackCommonProperties = {
  selectedProvider: LiveIdentifierSchema,
  selectedModel: LiveIdentifierSchema,
  activeProvider: LiveIdentifierSchema,
  activeModel: LiveIdentifierSchema
};
var WorkerLiveLifecycleFallbackPayloadSchema = workerLiveObject({
  ...WorkerLiveFallbackCommonProperties,
  phase: Type45.Literal("fallback"),
  reasonSummary: LiveTextSchema,
  attemptSummaries: Type45.Array(LiveTextSchema, {
    maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
  }),
  attempts: Type45.Array(WorkerLiveFallbackAttemptSchema, {
    maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
  })
});
var WorkerLiveLifecycleFallbackClearedPayloadSchema = workerLiveObject({
  ...WorkerLiveFallbackCommonProperties,
  phase: Type45.Literal("fallback_cleared"),
  previousActiveModel: Type45.Optional(LiveIdentifierSchema)
});
var WorkerLiveLifecycleFallbackStepPayloadSchema = workerLiveObject({
  phase: Type45.Literal("fallback_step"),
  fallbackStepType: Type45.Literal("fallback_step"),
  fallbackStepFromModel: LiveIdentifierSchema,
  fallbackStepToModel: Type45.Optional(LiveIdentifierSchema),
  fallbackStepFromFailureReason: Type45.Optional(WorkerLiveFallbackReasonSchema),
  fallbackStepFromFailureDetail: OptionalLiveTextSchema,
  fallbackStepChainPosition: OptionalLiveIntegerSchema,
  fallbackStepFinalOutcome: Type45.Union([
    Type45.Literal("next_fallback"),
    Type45.Literal("succeeded"),
    Type45.Literal("chain_exhausted")
  ])
});
var WorkerLiveLifecycleTerminalCommonProperties = {
  startedAt: OptionalLiveIntegerSchema,
  endedAt: LiveIntegerSchema,
  stopReason: Type45.Optional(WorkerIdentifierSchema),
  yielded: Type45.Optional(Type45.Literal(true)),
  timeoutPhase: Type45.Optional(
    Type45.Union([
      Type45.Literal("queue"),
      Type45.Literal("preflight"),
      Type45.Literal("provider"),
      Type45.Literal("post_turn"),
      Type45.Literal("gateway_draining")
    ])
  ),
  providerStarted: Type45.Optional(Type45.Boolean()),
  aborted: Type45.Optional(Type45.Boolean()),
  toolErrorSummary: OptionalLiveTextSchema,
  livenessState: Type45.Optional(
    Type45.Union([
      Type45.Literal("working"),
      Type45.Literal("paused"),
      Type45.Literal("blocked"),
      Type45.Literal("abandoned")
    ])
  ),
  replayInvalid: Type45.Optional(Type45.Literal(true))
};
var WorkerLiveLifecycleTerminalPayloadSchema = Type45.Union([
  workerLiveObject({
    ...WorkerLiveLifecycleTerminalCommonProperties,
    phase: Type45.Literal("finishing"),
    error: OptionalLiveTextSchema
  }),
  workerLiveObject({
    ...WorkerLiveLifecycleTerminalCommonProperties,
    phase: Type45.Literal("end")
  }),
  workerLiveObject({
    ...WorkerLiveLifecycleTerminalCommonProperties,
    phase: Type45.Literal("error"),
    error: LiveTextSchema,
    fallbackExhaustedFailure: Type45.Optional(Type45.Literal(true))
  })
]);
var WorkerLiveLifecyclePayloadSchema = Type45.Union([
  WorkerLiveLifecycleStartPayloadSchema,
  WorkerLiveLifecycleFallbackPayloadSchema,
  WorkerLiveLifecycleFallbackClearedPayloadSchema,
  WorkerLiveLifecycleFallbackStepPayloadSchema,
  WorkerLiveLifecycleTerminalPayloadSchema
]);
var WorkerLiveEventSchema = Type45.Union([
  workerLiveObject({ kind: Type45.Literal("assistant"), payload: WorkerLiveAssistantPayloadSchema }),
  workerLiveObject({ kind: Type45.Literal("thinking"), payload: WorkerLiveThinkingPayloadSchema }),
  workerLiveObject({ kind: Type45.Literal("tool"), payload: WorkerLiveToolPayloadSchema }),
  workerLiveObject({ kind: Type45.Literal("approval"), payload: WorkerLiveApprovalPayloadSchema }),
  workerLiveObject({ kind: Type45.Literal("lifecycle"), payload: WorkerLiveLifecyclePayloadSchema })
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
var WorkerLiveEventErrorDetailsSchema = Type45.Union([
  workerLiveObject({
    reason: Type45.Union([
      Type45.Literal("epoch-mismatch"),
      Type45.Literal("session-not-attached"),
      Type45.Literal("invalid-event"),
      Type45.Literal("capacity-exceeded")
    ])
  }),
  workerLiveObject({
    reason: Type45.Literal("resync-required"),
    ackedSeq: LiveIntegerSchema,
    expectedSeq: LiveSequenceSchema
  })
]);
var WorkerLiveEventErrorShapeSchema = workerLiveObject({
  code: Type45.Literal("INVALID_REQUEST"),
  message: Type45.String({ minLength: 1, maxLength: 256 }),
  details: WorkerLiveEventErrorDetailsSchema
});
var WorkerLiveEventRequestFrameSchema = workerLiveObject({
  type: Type45.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type45.Literal(WORKER_PROTOCOL_METHODS[2]),
  params: WorkerLiveEventParamsSchema
});
var WorkerLiveEventSuccessResponseFrameSchema = workerLiveObject({
  type: Type45.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type45.Literal(true),
  payload: WorkerLiveEventResultSchema
});
var WorkerLiveEventErrorResponseFrameSchema = workerLiveObject({
  type: Type45.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type45.Literal(false),
  error: WorkerLiveEventErrorShapeSchema
});
var WorkerLiveEventResponseFrameSchema = Type45.Union([
  WorkerLiveEventSuccessResponseFrameSchema,
  WorkerLiveEventErrorResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);

// packages/gateway-protocol/src/schema/worktrees.ts
import { Type as Type46 } from "typebox";
var WorktreeNameSchema = Type46.String({ pattern: "^[a-z0-9][a-z0-9-]{0,63}$" });
var WorktreeRecordSchema = closedObject({
  id: NonEmptyString,
  name: WorktreeNameSchema,
  repoFingerprint: Type46.String({ pattern: "^[a-f0-9]{16}$" }),
  repoRoot: NonEmptyString,
  path: NonEmptyString,
  branch: NonEmptyString,
  baseRef: NonEmptyString,
  ownerKind: Type46.String({ enum: ["manual", "workboard", "session"] }),
  ownerId: Type46.Optional(NonEmptyString),
  snapshotRef: Type46.Optional(NonEmptyString),
  createdAt: Type46.Integer({ minimum: 0 }),
  lastActiveAt: Type46.Integer({ minimum: 0 }),
  removedAt: Type46.Optional(Type46.Integer({ minimum: 0 }))
});
var WorktreesListParamsSchema = closedObject({});
var WorktreesListResultSchema = closedObject({
  worktrees: Type46.Array(WorktreeRecordSchema)
});
var WorktreesCreateParamsSchema = closedObject({
  repoRoot: NonEmptyString,
  name: Type46.Optional(WorktreeNameSchema),
  baseRef: Type46.Optional(NonEmptyString)
});
var WorktreesRemoveParamsSchema = closedObject({
  id: NonEmptyString,
  force: Type46.Optional(Type46.Boolean())
});
var WorktreesRemoveResultSchema = closedObject({
  removed: Type46.Boolean(),
  snapshotRef: Type46.Optional(NonEmptyString),
  /** Why the pre-removal snapshot failed; present only on forced removals that continued without one. */
  snapshotError: Type46.Optional(NonEmptyString)
});
var WorktreesBranchesParamsSchema = closedObject({ repoRoot: NonEmptyString });
var WorktreeBranchSchema = closedObject({
  name: NonEmptyString,
  kind: Type46.Union([Type46.Literal("local"), Type46.Literal("remote")])
});
var WorktreesBranchesResultSchema = closedObject({
  branches: Type46.Array(WorktreeBranchSchema),
  defaultBranch: Type46.Optional(NonEmptyString),
  headBranch: Type46.Optional(NonEmptyString)
});
var WorktreesRestoreParamsSchema = closedObject({ id: NonEmptyString });
var WorktreesGcParamsSchema = closedObject({});
var WorktreesGcResultSchema = closedObject({
  removed: Type46.Array(NonEmptyString),
  orphansDeleted: Type46.Integer({ minimum: 0 }),
  snapshotsPruned: Type46.Integer({ minimum: 0 })
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
export {
  MIN_CLIENT_PROTOCOL_VERSION,
  MIN_NODE_PROTOCOL_VERSION,
  MIN_PROBE_PROTOCOL_VERSION,
  PROTOCOL_VERSION,
  ProtocolSchemas
};
