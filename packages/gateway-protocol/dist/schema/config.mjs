// packages/gateway-protocol/src/schema/config.ts
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

// packages/gateway-protocol/src/schema/config.ts
var ConfigSchemaLookupPathString = Type3.String({
  minLength: 1,
  maxLength: 1024,
  pattern: "^[A-Za-z0-9_./\\[\\]\\-*]+$"
});
var ConfigDeliveryContextSchema = closedObject({
  channel: Type3.Optional(Type3.String()),
  to: Type3.Optional(Type3.String()),
  accountId: Type3.Optional(Type3.String()),
  threadId: Type3.Optional(Type3.Union([Type3.String(), Type3.Number()]))
});
var ConfigGetParamsSchema = closedObject({});
var ConfigSetParamsSchema = closedObject({
  raw: NonEmptyString,
  baseHash: Type3.Optional(NonEmptyString)
});
var ConfigApplyLikeParamProperties = {
  raw: NonEmptyString,
  baseHash: Type3.Optional(NonEmptyString),
  sessionKey: Type3.Optional(Type3.String()),
  deliveryContext: Type3.Optional(ConfigDeliveryContextSchema),
  note: Type3.Optional(Type3.String()),
  restartDelayMs: Type3.Optional(Type3.Integer({ minimum: 0 }))
};
var ConfigApplyLikeParamsSchema = closedObject(ConfigApplyLikeParamProperties);
var ConfigApplyParamsSchema = ConfigApplyLikeParamsSchema;
var ConfigPatchParamsSchema = closedObject({
  ...ConfigApplyLikeParamProperties,
  replacePaths: Type3.Optional(Type3.Array(NonEmptyString, { maxItems: 256 }))
});
var ConfigSchemaParamsSchema = closedObject({});
var ConfigSchemaLookupParamsSchema = closedObject({
  path: ConfigSchemaLookupPathString
});
var UpdateStatusParamsSchema = closedObject({});
var UpdateRunParamsSchema = closedObject({
  sessionKey: Type3.Optional(Type3.String()),
  deliveryContext: Type3.Optional(ConfigDeliveryContextSchema),
  note: Type3.Optional(Type3.String()),
  continuationMessage: Type3.Optional(Type3.String()),
  restartDelayMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  timeoutMs: Type3.Optional(Type3.Integer({ minimum: 1 }))
});
var ConfigUiHintSchema = closedObject({
  label: Type3.Optional(Type3.String()),
  help: Type3.Optional(Type3.String()),
  tags: Type3.Optional(Type3.Array(Type3.String())),
  group: Type3.Optional(Type3.String()),
  order: Type3.Optional(Type3.Integer()),
  advanced: Type3.Optional(Type3.Boolean()),
  sensitive: Type3.Optional(Type3.Boolean()),
  placeholder: Type3.Optional(Type3.String()),
  itemTemplate: Type3.Optional(Type3.Unknown())
});
var ConfigSchemaResponseSchema = closedObject({
  schema: Type3.Unknown(),
  uiHints: Type3.Record(Type3.String(), ConfigUiHintSchema),
  version: NonEmptyString,
  generatedAt: NonEmptyString
});
var ConfigSchemaLookupChildSchema = closedObject({
  key: NonEmptyString,
  path: NonEmptyString,
  type: Type3.Optional(Type3.Union([Type3.String(), Type3.Array(Type3.String())])),
  required: Type3.Boolean(),
  hasChildren: Type3.Boolean(),
  reloadKind: Type3.Optional(
    Type3.Union([Type3.Literal("restart"), Type3.Literal("hot"), Type3.Literal("none")])
  ),
  hint: Type3.Optional(ConfigUiHintSchema),
  hintPath: Type3.Optional(Type3.String())
});
var ConfigSchemaLookupResultSchema = closedObject({
  path: NonEmptyString,
  schema: Type3.Unknown(),
  reloadKind: Type3.Optional(
    Type3.Union([Type3.Literal("restart"), Type3.Literal("hot"), Type3.Literal("none")])
  ),
  hint: Type3.Optional(ConfigUiHintSchema),
  hintPath: Type3.Optional(Type3.String()),
  children: Type3.Array(ConfigSchemaLookupChildSchema)
});
export {
  ConfigApplyParamsSchema,
  ConfigGetParamsSchema,
  ConfigPatchParamsSchema,
  ConfigSchemaLookupParamsSchema,
  ConfigSchemaLookupResultSchema,
  ConfigSchemaParamsSchema,
  ConfigSchemaResponseSchema,
  ConfigSetParamsSchema,
  UpdateRunParamsSchema,
  UpdateStatusParamsSchema
};
