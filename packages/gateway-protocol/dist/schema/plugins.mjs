// packages/gateway-protocol/src/schema/plugins.ts
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

// packages/gateway-protocol/src/schema/plugins.ts
var PluginJsonValueSchema = Type3.Unknown();
var PluginControlUiDescriptorSchema = closedObject({
  id: NonEmptyString,
  pluginId: NonEmptyString,
  pluginName: Type3.Optional(NonEmptyString),
  surface: Type3.Union([
    Type3.Literal("session"),
    Type3.Literal("tool"),
    Type3.Literal("run"),
    Type3.Literal("settings")
  ]),
  label: NonEmptyString,
  description: Type3.Optional(Type3.String()),
  placement: Type3.Optional(Type3.String()),
  schema: Type3.Optional(PluginJsonValueSchema),
  requiredScopes: Type3.Optional(Type3.Array(NonEmptyString))
});
var PluginsUiDescriptorsParamsSchema = closedObject({});
var PluginsUiDescriptorsResultSchema = closedObject({
  ok: Type3.Literal(true),
  descriptors: Type3.Array(PluginControlUiDescriptorSchema)
});
var PluginsSessionActionParamsSchema = closedObject({
  pluginId: NonEmptyString,
  actionId: NonEmptyString,
  sessionKey: Type3.Optional(NonEmptyString),
  payload: Type3.Optional(PluginJsonValueSchema)
});
var PluginsSessionActionSuccessResultSchema = closedObject({
  ok: Type3.Literal(true),
  result: Type3.Optional(PluginJsonValueSchema),
  continueAgent: Type3.Optional(Type3.Boolean()),
  reply: Type3.Optional(PluginJsonValueSchema)
});
var PluginsSessionActionFailureResultSchema = closedObject({
  ok: Type3.Literal(false),
  error: Type3.String(),
  code: Type3.Optional(Type3.String()),
  details: Type3.Optional(PluginJsonValueSchema)
});
var PluginsSessionActionResultSchema = Type3.Union([
  PluginsSessionActionSuccessResultSchema,
  PluginsSessionActionFailureResultSchema
]);
var PluginCatalogClawHubInstallSchema = closedObject({
  source: Type3.Literal("clawhub"),
  packageName: NonEmptyString
});
var PluginCatalogOfficialInstallSchema = closedObject({
  source: Type3.Literal("official"),
  pluginId: NonEmptyString
});
var PluginCatalogInstallActionSchema = Type3.Union([
  PluginCatalogClawHubInstallSchema,
  PluginCatalogOfficialInstallSchema
]);
var PluginCatalogEntrySchema = closedObject({
  id: NonEmptyString,
  name: NonEmptyString,
  packageName: Type3.Optional(NonEmptyString),
  description: Type3.Optional(Type3.String()),
  version: Type3.Optional(NonEmptyString),
  kind: Type3.Optional(Type3.Array(NonEmptyString)),
  origin: Type3.Optional(NonEmptyString),
  installed: Type3.Boolean(),
  enabled: Type3.Boolean(),
  state: Type3.Union([
    Type3.Literal("enabled"),
    Type3.Literal("disabled"),
    Type3.Literal("not-installed"),
    Type3.Literal("error")
  ]),
  featured: Type3.Optional(Type3.Boolean()),
  featuredAt: Type3.Optional(Type3.Integer({ minimum: 0 })),
  order: Type3.Optional(Type3.Number()),
  /** True when the gateway can resolve a manifest or catalog icon for this plugin identity. */
  hasIcon: Type3.Optional(Type3.Boolean()),
  install: Type3.Optional(PluginCatalogInstallActionSchema),
  error: Type3.Optional(Type3.String()),
  /** Coarse manifest-derived grouping (channel, provider, memory, ...) for catalog UIs. */
  category: Type3.Optional(NonEmptyString),
  /** True when the plugin has an install record and can be removed via plugins.uninstall. */
  removable: Type3.Optional(Type3.Boolean())
});
var PluginsListParamsSchema = closedObject({});
var PluginsListResultSchema = closedObject({
  plugins: Type3.Array(PluginCatalogEntrySchema),
  diagnostics: Type3.Array(Type3.Unknown()),
  mutationAllowed: Type3.Boolean()
});
var PluginsSearchParamsSchema = closedObject({
  query: NonEmptyString,
  limit: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 100 }))
});
var PluginSearchPackageSchema = closedObject({
  name: NonEmptyString,
  displayName: NonEmptyString,
  family: Type3.Union([Type3.Literal("code-plugin"), Type3.Literal("bundle-plugin")]),
  channel: Type3.Union([
    Type3.Literal("official"),
    Type3.Literal("community"),
    Type3.Literal("private")
  ]),
  isOfficial: Type3.Boolean(),
  summary: Type3.Optional(Type3.String()),
  latestVersion: Type3.Optional(NonEmptyString),
  runtimeId: Type3.Optional(NonEmptyString),
  downloads: Type3.Optional(Type3.Number({ minimum: 0 })),
  verificationTier: Type3.Optional(NonEmptyString)
});
var PluginSearchResultEntrySchema = closedObject({
  score: Type3.Number(),
  package: PluginSearchPackageSchema
});
var PluginsSearchResultSchema = closedObject({
  results: Type3.Array(PluginSearchResultEntrySchema)
});
var PluginsInstallParamsSchema = Type3.Union([
  closedObject({
    source: Type3.Literal("clawhub"),
    packageName: NonEmptyString,
    version: Type3.Optional(NonEmptyString),
    acknowledgeClawHubRisk: Type3.Optional(Type3.Boolean())
  }),
  closedObject({
    source: Type3.Literal("official"),
    pluginId: NonEmptyString
  })
]);
var PluginsInstallResultSchema = closedObject({
  ok: Type3.Literal(true),
  plugin: PluginCatalogEntrySchema,
  restartRequired: Type3.Literal(true),
  warnings: Type3.Optional(Type3.Array(Type3.String()))
});
var PluginsRefreshParamsSchema = closedObject({});
var PluginsRefreshResultSchema = closedObject({
  ok: Type3.Literal(true)
});
var PluginsUninstallParamsSchema = closedObject({
  pluginId: NonEmptyString
});
var PluginsUninstallResultSchema = closedObject({
  ok: Type3.Literal(true),
  pluginId: NonEmptyString,
  restartRequired: Type3.Literal(true),
  removed: Type3.Array(Type3.String()),
  warnings: Type3.Optional(Type3.Array(Type3.String()))
});
var PluginsSetEnabledParamsSchema = closedObject({
  pluginId: NonEmptyString,
  enabled: Type3.Boolean()
});
var PluginsSetEnabledResultSchema = closedObject({
  ok: Type3.Literal(true),
  plugin: PluginCatalogEntrySchema,
  restartRequired: Type3.Boolean(),
  warnings: Type3.Optional(Type3.Array(Type3.String()))
});
export {
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
  PluginsUninstallResultSchema
};
