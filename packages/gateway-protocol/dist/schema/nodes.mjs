// packages/gateway-protocol/src/schema/nodes.ts
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

// packages/gateway-protocol/src/schema/nodes.ts
var NodePluginToolNameSchema = Type3.String({
  minLength: 1,
  maxLength: 64,
  pattern: "^[A-Za-z][A-Za-z0-9_-]{0,63}$"
});
var NodeSkillNameSchema = Type3.String({
  minLength: 1,
  maxLength: 64,
  pattern: "^(?!.*--)[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$"
});
var NodePendingWorkTypeSchema = Type3.String({
  enum: ["status.request", "location.request"]
});
var NodePendingWorkPrioritySchema = Type3.String({
  enum: ["normal", "high"]
});
var NodePresenceAliveReasonSchema = Type3.String({
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
  sentAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  displayName: Type3.Optional(NonEmptyString),
  version: Type3.Optional(NonEmptyString),
  platform: Type3.Optional(NonEmptyString),
  deviceFamily: Type3.Optional(NonEmptyString),
  modelIdentifier: Type3.Optional(NonEmptyString),
  pushTransport: Type3.Optional(NonEmptyString)
});
var NodePresenceActivityPayloadSchema = closedObject({
  idleSeconds: Type3.Integer({ minimum: 0, maximum: 2592e3 }),
  saturated: Type3.Optional(Type3.Boolean())
});
var NodeEventResultSchema = closedObject({
  ok: Type3.Boolean(),
  event: NonEmptyString,
  handled: Type3.Boolean(),
  reason: Type3.Optional(NonEmptyString)
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
  parameters: Type3.Optional(Type3.Record(Type3.String(), Type3.Unknown())),
  command: Type3.Optional(NonEmptyString),
  mcp: Type3.Optional(
    closedObject({
      server: NonEmptyString,
      tool: NonEmptyString
    })
  )
});
var NodePluginToolsUpdateParamsSchema = closedObject({
  tools: Type3.Array(NodePluginToolDescriptorSchema)
});
var NodeSkillDescriptorSchema = closedObject({
  name: NodeSkillNameSchema,
  description: Type3.String({ minLength: 1, maxLength: 1024 }),
  content: Type3.String({ minLength: 1, maxLength: 64 * 1024 })
});
var NodeSkillsUpdateParamsSchema = closedObject({
  skills: Type3.Array(NodeSkillDescriptorSchema, { maxItems: 64 })
});
var NodePendingAckParamsSchema = closedObject({
  ids: Type3.Array(NonEmptyString, { minItems: 1 })
});
var NodeDescribeParamsSchema = closedObject({ nodeId: NonEmptyString });
var NodeInvokeParamsSchema = closedObject({
  nodeId: NonEmptyString,
  command: NonEmptyString,
  params: Type3.Optional(Type3.Unknown()),
  timeoutMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  idempotencyKey: NonEmptyString,
  // Gateway-only agent ownership metadata. Forwarded beside params, never inside them.
  sessionKey: Type3.Optional(NonEmptyString),
  // Gateway-only approval routing metadata. Node forwarding strips these fields.
  turnSourceChannel: Type3.Optional(Type3.String()),
  turnSourceTo: Type3.Optional(Type3.String()),
  turnSourceAccountId: Type3.Optional(Type3.String()),
  turnSourceThreadId: Type3.Optional(Type3.Union([Type3.String(), Type3.Number()]))
});
var NodeInvokeResultParamsSchema = closedObject({
  id: NonEmptyString,
  nodeId: NonEmptyString,
  ok: Type3.Boolean(),
  payload: Type3.Optional(Type3.Unknown()),
  payloadJSON: Type3.Optional(Type3.String()),
  error: Type3.Optional(
    closedObject({
      code: Type3.Optional(NonEmptyString),
      message: Type3.Optional(NonEmptyString)
    })
  )
});
var NodeInvokeProgressParamsSchema = closedObject({
  invokeId: NonEmptyString,
  nodeId: NonEmptyString,
  seq: Type3.Integer({ minimum: 0 }),
  // Empty chunks are liveness heartbeats for captured stderr or capped stdout.
  chunk: Type3.String({ maxLength: 16 * 1024 })
});
var NodeEventParamsSchema = closedObject({
  event: NonEmptyString,
  payload: Type3.Optional(Type3.Unknown()),
  payloadJSON: Type3.Optional(Type3.String())
});
var NodePendingDrainParamsSchema = closedObject({
  maxItems: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 10 }))
});
var NodePendingDrainItemSchema = closedObject({
  id: NonEmptyString,
  type: NodePendingWorkTypeSchema,
  priority: Type3.String({ enum: ["default", "normal", "high"] }),
  createdAtMs: Type3.Integer({ minimum: 0 }),
  expiresAtMs: Type3.Optional(Type3.Union([Type3.Integer({ minimum: 0 }), Type3.Null()])),
  payload: Type3.Optional(Type3.Record(Type3.String(), Type3.Unknown()))
});
var NodePendingDrainResultSchema = closedObject({
  nodeId: NonEmptyString,
  revision: Type3.Integer({ minimum: 0 }),
  items: Type3.Array(NodePendingDrainItemSchema),
  hasMore: Type3.Boolean()
});
var NodePendingEnqueueParamsSchema = closedObject({
  nodeId: NonEmptyString,
  type: NodePendingWorkTypeSchema,
  priority: Type3.Optional(NodePendingWorkPrioritySchema),
  expiresInMs: Type3.Optional(Type3.Integer({ minimum: 1e3, maximum: 864e5 })),
  wake: Type3.Optional(Type3.Boolean())
});
var NodePendingEnqueueResultSchema = closedObject({
  nodeId: NonEmptyString,
  revision: Type3.Integer({ minimum: 0 }),
  queued: NodePendingDrainItemSchema,
  wakeTriggered: Type3.Boolean()
});
var NodeInvokeRequestEventSchema = closedObject({
  id: NonEmptyString,
  nodeId: NonEmptyString,
  command: NonEmptyString,
  paramsJSON: Type3.Optional(Type3.String()),
  timeoutMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  idempotencyKey: Type3.Optional(NonEmptyString)
});
var NodeInvokeInputEventSchema = closedObject({
  id: NonEmptyString,
  nodeId: NonEmptyString,
  seq: Type3.Integer({ minimum: 0 }),
  payloadJSON: Type3.String({ maxLength: 16 * 1024 })
});
export {
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
  NodeSkillsUpdateParamsSchema
};
