// packages/gateway-protocol/src/schema/wizard.ts
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

// packages/gateway-protocol/src/schema/wizard.ts
var WizardRunStatusSchema = Type3.Union([
  Type3.Literal("running"),
  Type3.Literal("done"),
  Type3.Literal("cancelled"),
  Type3.Literal("error")
]);
var WizardStartParamsSchema = closedObject({
  mode: Type3.Optional(Type3.Union([Type3.Literal("local"), Type3.Literal("remote")])),
  workspace: Type3.Optional(Type3.String()),
  // "setup" (default) runs full onboarding; "channels" runs the guided
  // channel-setup flow (openclaw channels add) over the same step protocol.
  flow: Type3.Optional(Type3.Union([Type3.Literal("setup"), Type3.Literal("channels")])),
  // Preselected channel id for flow "channels" (e.g. "telegram").
  channel: Type3.Optional(NonEmptyString)
});
var WizardAnswerSchema = closedObject({
  stepId: NonEmptyString,
  value: Type3.Optional(Type3.Unknown())
});
var WizardNextParamsSchema = closedObject({
  sessionId: NonEmptyString,
  answer: Type3.Optional(WizardAnswerSchema)
});
var WizardSessionIdParamsSchema = closedObject({
  sessionId: NonEmptyString
});
var WizardCancelParamsSchema = WizardSessionIdParamsSchema;
var WizardStatusParamsSchema = WizardSessionIdParamsSchema;
var WizardStepOptionSchema = closedObject({
  value: Type3.Unknown(),
  label: NonEmptyString,
  hint: Type3.Optional(Type3.String())
});
var WizardDeviceCodeSchema = closedObject({
  code: NonEmptyString,
  expiresInMinutes: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 1440 })),
  message: Type3.Optional(Type3.String())
});
var WizardStepSchema = closedObject({
  id: NonEmptyString,
  type: Type3.Union([
    Type3.Literal("note"),
    Type3.Literal("select"),
    Type3.Literal("text"),
    Type3.Literal("confirm"),
    Type3.Literal("multiselect"),
    Type3.Literal("progress"),
    Type3.Literal("action")
  ]),
  title: Type3.Optional(Type3.String()),
  message: Type3.Optional(Type3.String()),
  format: Type3.Optional(Type3.Union([Type3.Literal("plain")])),
  options: Type3.Optional(Type3.Array(WizardStepOptionSchema)),
  initialValue: Type3.Optional(Type3.Unknown()),
  placeholder: Type3.Optional(Type3.String()),
  sensitive: Type3.Optional(Type3.Boolean()),
  executor: Type3.Optional(Type3.Union([Type3.Literal("gateway"), Type3.Literal("client")])),
  externalUrl: Type3.Optional(Type3.String()),
  deviceCode: Type3.Optional(WizardDeviceCodeSchema)
});
var WizardConfiguredAccountSchema = closedObject({
  channel: NonEmptyString,
  accountId: NonEmptyString
});
var WizardResultFields = {
  done: Type3.Boolean(),
  step: Type3.Optional(WizardStepSchema),
  status: Type3.Optional(WizardRunStatusSchema),
  error: Type3.Optional(Type3.String()),
  // What the flow actually configured; set on the terminal result of
  // wizard.start flow "channels" sessions so clients run channel-specific
  // completion (e.g. WhatsApp QR linking for the right account) from the
  // real outcome rather than the preselection.
  channels: Type3.Optional(Type3.Array(NonEmptyString)),
  accounts: Type3.Optional(Type3.Array(WizardConfiguredAccountSchema))
};
var WizardNextResultSchema = closedObject(WizardResultFields);
var WizardStartResultSchema = closedObject({
  sessionId: NonEmptyString,
  ...WizardResultFields
});
var WizardStatusResultSchema = closedObject({
  status: WizardRunStatusSchema,
  error: Type3.Optional(Type3.String())
});
export {
  WizardCancelParamsSchema,
  WizardNextParamsSchema,
  WizardNextResultSchema,
  WizardStartParamsSchema,
  WizardStartResultSchema,
  WizardStatusParamsSchema,
  WizardStatusResultSchema,
  WizardStepSchema
};
