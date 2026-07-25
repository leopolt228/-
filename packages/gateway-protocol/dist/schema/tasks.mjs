// packages/gateway-protocol/src/schema/tasks.ts
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

// packages/gateway-protocol/src/schema/tasks.ts
var TaskLedgerStatusSchema = Type3.Union([
  Type3.Literal("queued"),
  Type3.Literal("running"),
  Type3.Literal("completed"),
  Type3.Literal("failed"),
  Type3.Literal("cancelled"),
  Type3.Literal("timed_out")
]);
var TimestampSchema = Type3.Union([Type3.String(), Type3.Integer({ minimum: 0 })]);
var TaskSummarySchema = closedObject({
  id: NonEmptyString,
  kind: Type3.Optional(Type3.String()),
  runtime: Type3.Optional(Type3.String()),
  status: TaskLedgerStatusSchema,
  title: Type3.Optional(Type3.String()),
  agentId: Type3.Optional(Type3.String()),
  sessionKey: Type3.Optional(Type3.String()),
  childSessionKey: Type3.Optional(Type3.String()),
  ownerKey: Type3.Optional(Type3.String()),
  runId: Type3.Optional(Type3.String()),
  taskId: Type3.Optional(Type3.String()),
  flowId: Type3.Optional(Type3.String()),
  parentTaskId: Type3.Optional(Type3.String()),
  sourceId: Type3.Optional(Type3.String()),
  createdAt: Type3.Optional(TimestampSchema),
  updatedAt: Type3.Optional(TimestampSchema),
  startedAt: Type3.Optional(TimestampSchema),
  endedAt: Type3.Optional(TimestampSchema),
  toolUseCount: Type3.Optional(Type3.Integer({ minimum: 0 })),
  lastToolName: Type3.Optional(Type3.String()),
  progressSummary: Type3.Optional(Type3.String()),
  terminalSummary: Type3.Optional(Type3.String()),
  error: Type3.Optional(Type3.String()),
  /** Bounded task input. Returned by tasks.get; omitted from list/event summaries. */
  prompt: Type3.Optional(Type3.String())
});
var TasksListParamsSchema = closedObject({
  status: Type3.Optional(Type3.Union([TaskLedgerStatusSchema, Type3.Array(TaskLedgerStatusSchema)])),
  agentId: Type3.Optional(NonEmptyString),
  sessionKey: Type3.Optional(NonEmptyString),
  limit: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 500 })),
  cursor: Type3.Optional(Type3.String())
});
var TasksListResultSchema = closedObject({
  tasks: Type3.Array(TaskSummarySchema),
  nextCursor: Type3.Optional(Type3.String())
});
var TasksGetParamsSchema = closedObject({
  taskId: NonEmptyString
});
var TasksGetResultSchema = closedObject({
  task: TaskSummarySchema
});
var TasksCancelParamsSchema = closedObject({
  taskId: NonEmptyString,
  reason: Type3.Optional(Type3.String())
});
var TasksCancelResultSchema = closedObject({
  found: Type3.Boolean(),
  cancelled: Type3.Boolean(),
  reason: Type3.Optional(Type3.String()),
  task: Type3.Optional(TaskSummarySchema)
});
export {
  TaskSummarySchema,
  TasksCancelParamsSchema,
  TasksCancelResultSchema,
  TasksGetParamsSchema,
  TasksGetResultSchema,
  TasksListParamsSchema,
  TasksListResultSchema
};
