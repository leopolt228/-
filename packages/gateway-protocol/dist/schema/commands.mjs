// packages/gateway-protocol/src/schema/commands.ts
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

// packages/gateway-protocol/src/schema/commands.ts
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
var BoundedNonEmptyString = (maxLength) => Type3.String({ minLength: 1, maxLength });
var CommandSourceSchema = Type3.Union([
  Type3.Literal("native"),
  Type3.Literal("skill"),
  Type3.Literal("plugin")
]);
var CommandScopeSchema = Type3.Union([
  Type3.Literal("text"),
  Type3.Literal("native"),
  Type3.Literal("both")
]);
var CommandCategorySchema = Type3.Union([
  Type3.Literal("session"),
  Type3.Literal("options"),
  Type3.Literal("status"),
  Type3.Literal("management"),
  Type3.Literal("media"),
  Type3.Literal("tools"),
  Type3.Literal("docks")
]);
var CommandArgChoiceSchema = closedObject({
  value: Type3.String({ maxLength: COMMAND_CHOICE_VALUE_MAX_LENGTH }),
  label: Type3.String({ maxLength: COMMAND_CHOICE_LABEL_MAX_LENGTH })
});
var CommandArgSchema = closedObject({
  name: BoundedNonEmptyString(COMMAND_ARG_NAME_MAX_LENGTH),
  description: Type3.String({ maxLength: COMMAND_ARG_DESCRIPTION_MAX_LENGTH }),
  type: Type3.Union([Type3.Literal("string"), Type3.Literal("number"), Type3.Literal("boolean")]),
  required: Type3.Optional(Type3.Boolean()),
  choices: Type3.Optional(
    Type3.Array(CommandArgChoiceSchema, { maxItems: COMMAND_ARG_CHOICES_MAX_ITEMS })
  ),
  dynamic: Type3.Optional(Type3.Boolean())
});
var CommandEntrySchema = closedObject({
  name: BoundedNonEmptyString(COMMAND_NAME_MAX_LENGTH),
  nativeName: Type3.Optional(BoundedNonEmptyString(COMMAND_NAME_MAX_LENGTH)),
  textAliases: Type3.Optional(
    Type3.Array(BoundedNonEmptyString(COMMAND_NAME_MAX_LENGTH), {
      maxItems: COMMAND_ALIAS_MAX_ITEMS
    })
  ),
  description: Type3.String({ maxLength: COMMAND_DESCRIPTION_MAX_LENGTH }),
  category: Type3.Optional(CommandCategorySchema),
  source: CommandSourceSchema,
  scope: CommandScopeSchema,
  acceptsArgs: Type3.Boolean(),
  args: Type3.Optional(Type3.Array(CommandArgSchema, { maxItems: COMMAND_ARGS_MAX_ITEMS }))
});
var CommandsListParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  provider: Type3.Optional(NonEmptyString),
  scope: Type3.Optional(CommandScopeSchema),
  includeArgs: Type3.Optional(Type3.Boolean())
});
var CommandsListResultSchema = closedObject({
  commands: Type3.Array(CommandEntrySchema, { maxItems: COMMAND_LIST_MAX_ITEMS })
});
export {
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
  CommandEntrySchema,
  CommandsListParamsSchema,
  CommandsListResultSchema
};
