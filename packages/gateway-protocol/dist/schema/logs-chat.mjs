// packages/gateway-protocol/src/schema/logs-chat.ts
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

// packages/gateway-protocol/src/schema/logs-chat.ts
var LogsTailParamsSchema = closedObject({
  cursor: Type3.Optional(Type3.Integer({ minimum: 0 })),
  limit: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 5e3 })),
  maxBytes: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 1e6 }))
});
var LogsTailResultSchema = closedObject({
  file: NonEmptyString,
  cursor: Type3.Integer({ minimum: 0 }),
  size: Type3.Integer({ minimum: 0 }),
  lines: Type3.Array(Type3.String()),
  truncated: Type3.Optional(Type3.Boolean()),
  reset: Type3.Optional(Type3.Boolean())
});
var ChatHistoryParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type3.Optional(NonEmptyString),
  limit: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 1e3 })),
  offset: Type3.Optional(Type3.Integer({ minimum: 0 })),
  messageId: Type3.Optional(NonEmptyString),
  sessionId: Type3.Optional(NonEmptyString),
  maxChars: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 5e5 }))
});
var ChatMetadataParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString)
});
var ChatToolTitlesParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type3.Optional(NonEmptyString),
  items: Type3.Array(
    closedObject({
      id: Type3.String({ minLength: 1, maxLength: 64 }),
      name: Type3.String({ minLength: 1, maxLength: 200 }),
      input: Type3.String({ minLength: 1, maxLength: 4e3 })
    }),
    { minItems: 1, maxItems: 24 }
  )
});
var ChatToolTitlesResultSchema = closedObject({
  titles: Type3.Record(Type3.String(), Type3.String()),
  disabled: Type3.Optional(Type3.Boolean())
});
var ChatMessageGetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type3.Optional(NonEmptyString),
  messageId: NonEmptyString,
  maxChars: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 2e6 }))
});
var ChatMessageGetResultSchema = closedObject({
  ok: Type3.Boolean(),
  message: Type3.Optional(Type3.Unknown()),
  unavailableReason: Type3.Optional(
    Type3.Union([Type3.Literal("not_found"), Type3.Literal("oversized"), Type3.Literal("not_visible")])
  )
});
var ChatAttachmentsSchema = Type3.Array(Type3.Unknown());
var RunToolBindingsSchema = Type3.Record(
  Type3.String({ minLength: 1, maxLength: 128 }),
  Type3.Unknown(),
  { maxProperties: 16 }
);
var ChatSendParamsSchema = closedObject({
  sessionKey: ChatSendSessionKeyString,
  agentId: Type3.Optional(NonEmptyString),
  sessionId: Type3.Optional(NonEmptyString),
  message: Type3.String(),
  thinking: Type3.Optional(Type3.String()),
  fastMode: Type3.Optional(Type3.Union([Type3.Boolean(), Type3.Literal("auto")])),
  // One-turn override for auto fast-mode cutoff seconds.
  fastAutoOnSeconds: Type3.Optional(Type3.Integer({ minimum: 1 })),
  // One-turn override for active-run queue admission.
  queueMode: Type3.Optional(Type3.String({ enum: ["steer", "followup", "collect", "interrupt"] })),
  deliver: Type3.Optional(Type3.Boolean()),
  originatingChannel: Type3.Optional(Type3.String()),
  originatingTo: Type3.Optional(Type3.String()),
  originatingAccountId: Type3.Optional(Type3.String()),
  originatingThreadId: Type3.Optional(Type3.String()),
  // Transcript id of the message this send replies to; the Gateway hydrates
  // channel-agnostic reply context metadata from session history.
  replyToId: Type3.Optional(NonEmptyString),
  attachments: Type3.Optional(ChatAttachmentsSchema),
  toolBindings: Type3.Optional(RunToolBindingsSchema),
  timeoutMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  systemInputProvenance: Type3.Optional(InputProvenanceSchema),
  systemProvenanceReceipt: Type3.Optional(Type3.String()),
  suppressCommandInterpretation: Type3.Optional(Type3.Boolean()),
  expectedSessionRoutingContract: Type3.Optional(NonEmptyString),
  idempotencyKey: NonEmptyString
});
var ChatAbortParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type3.Optional(NonEmptyString),
  runId: Type3.Optional(NonEmptyString),
  preserveSideRuns: Type3.Optional(Type3.Boolean())
});
var ChatInjectParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type3.Optional(NonEmptyString),
  message: NonEmptyString,
  label: Type3.Optional(Type3.String({ maxLength: 100 }))
});
var ChatEventBaseSchema = {
  runId: NonEmptyString,
  sessionKey: NonEmptyString,
  agentId: Type3.Optional(NonEmptyString),
  spawnedBy: Type3.Optional(NonEmptyString),
  seq: Type3.Integer({ minimum: 0 })
};
var ChatEventErrorKindSchema = Type3.Union([
  Type3.Literal("refusal"),
  Type3.Literal("timeout"),
  Type3.Literal("rate_limit"),
  Type3.Literal("context_length"),
  Type3.Literal("unknown")
]);
var ChatDeltaEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type3.Literal("delta"),
  message: Type3.Optional(Type3.Unknown()),
  deltaText: Type3.String(),
  replace: Type3.Optional(Type3.Boolean()),
  usage: Type3.Optional(Type3.Unknown())
});
var ChatFinalEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type3.Literal("final"),
  message: Type3.Optional(Type3.Unknown()),
  usage: Type3.Optional(Type3.Unknown()),
  stopReason: Type3.Optional(Type3.String()),
  yielded: Type3.Optional(Type3.Literal(true))
});
var ChatAbortedEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type3.Literal("aborted"),
  message: Type3.Optional(Type3.Unknown()),
  errorMessage: Type3.Optional(Type3.String()),
  stopReason: Type3.Optional(Type3.String())
});
var ChatErrorEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type3.Literal("error"),
  message: Type3.Optional(Type3.Unknown()),
  errorMessage: Type3.Optional(Type3.String()),
  errorKind: Type3.Optional(ChatEventErrorKindSchema),
  usage: Type3.Optional(Type3.Unknown()),
  stopReason: Type3.Optional(Type3.String())
});
var ChatEventSchema = Type3.Union([
  ChatDeltaEventSchema,
  ChatFinalEventSchema,
  ChatAbortedEventSchema,
  ChatErrorEventSchema
]);
export {
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
  ChatToolTitlesParamsSchema,
  ChatToolTitlesResultSchema,
  LogsTailParamsSchema,
  LogsTailResultSchema
};
