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
export {
  AgentEventSchema,
  AgentIdentityParamsSchema,
  AgentIdentityResultSchema,
  AgentParamsSchema,
  AgentWaitParamsSchema,
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
  MessageActionParamsSchema,
  PollParamsSchema,
  SendParamsSchema,
  WakeParamsSchema
};
