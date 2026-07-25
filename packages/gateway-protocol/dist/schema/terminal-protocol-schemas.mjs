// packages/gateway-protocol/src/schema/terminal.ts
import { Type as Type5 } from "typebox";

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

// packages/gateway-protocol/src/schema/sessions-catalog.ts
import { Type as Type4 } from "typebox";

// packages/gateway-protocol/src/schema/plugins.ts
import { Type as Type3 } from "typebox";
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

// packages/gateway-protocol/src/schema/sessions-catalog.ts
var SessionCatalogErrorSchema = closedObject({ code: NonEmptyString, message: NonEmptyString });
var SessionCatalogLocatorSchema = closedObject({
  catalogId: NonEmptyString,
  hostId: NonEmptyString,
  threadId: NonEmptyString
});
var SessionCatalogCapabilitiesSchema = closedObject({
  continueSession: Type4.Boolean(),
  archive: Type4.Boolean(),
  createSession: Type4.Optional(closedObject({ model: NonEmptyString })),
  openTerminal: Type4.Optional(Type4.Boolean())
});
var SessionCatalogDescriptorSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  capabilities: SessionCatalogCapabilitiesSchema
});
var SessionCatalogSessionSchema = closedObject({
  threadId: NonEmptyString,
  name: Type4.Optional(Type4.String()),
  cwd: Type4.Optional(Type4.String()),
  status: NonEmptyString,
  createdAt: Type4.Optional(Type4.Number()),
  updatedAt: Type4.Optional(Type4.Number()),
  recencyAt: Type4.Optional(Type4.Number()),
  source: Type4.Optional(Type4.String()),
  modelProvider: Type4.Optional(Type4.String()),
  cliVersion: Type4.Optional(Type4.String()),
  gitBranch: Type4.Optional(Type4.String()),
  customGroup: Type4.Optional(Type4.String()),
  archived: Type4.Boolean(),
  sessionKey: Type4.Optional(NonEmptyString),
  canContinue: Type4.Boolean(),
  canArchive: Type4.Boolean(),
  canOpenTerminal: Type4.Optional(Type4.Boolean())
});
var SessionCatalogHostSchema = closedObject({
  hostId: NonEmptyString,
  label: NonEmptyString,
  kind: Type4.Union([Type4.Literal("gateway"), Type4.Literal("node")]),
  connected: Type4.Boolean(),
  nodeId: Type4.Optional(NonEmptyString),
  sessions: Type4.Array(SessionCatalogSessionSchema),
  nextCursor: Type4.Optional(Type4.String()),
  error: Type4.Optional(SessionCatalogErrorSchema)
});
var SessionCatalogSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  capabilities: SessionCatalogCapabilitiesSchema,
  hosts: Type4.Array(SessionCatalogHostSchema),
  error: Type4.Optional(SessionCatalogErrorSchema)
});
var SessionsCatalogListCommonProperties = {
  agentId: Type4.Optional(NonEmptyString),
  progressId: Type4.Optional(Type4.String({ minLength: 1, maxLength: 128 })),
  search: Type4.Optional(Type4.String()),
  limitPerHost: Type4.Optional(Type4.Integer({ minimum: 1 })),
  hostIds: Type4.Optional(Type4.Array(NonEmptyString))
};
var SessionsCatalogListParamsSchema = closedObject({
  catalogId: Type4.Optional(NonEmptyString),
  cursors: Type4.Optional(Type4.Record(NonEmptyString, Type4.String())),
  ...SessionsCatalogListCommonProperties
});
var SessionsCatalogListResultSchema = closedObject({
  catalogs: Type4.Array(SessionCatalogSchema)
});
var SessionsCatalogHostEventCatalogSchema = closedObject({
  ...SessionCatalogSchema.properties,
  hosts: Type4.Array(SessionCatalogHostSchema, { minItems: 1, maxItems: 1 })
});
var SessionsCatalogHostEventSchema = closedObject({
  progressId: Type4.String({ minLength: 1, maxLength: 128 }),
  agentId: NonEmptyString,
  catalog: SessionsCatalogHostEventCatalogSchema
});
var SessionCatalogTranscriptItemSchema = closedObject({
  id: Type4.Optional(Type4.String()),
  type: Type4.Union([
    Type4.Literal("userMessage"),
    Type4.Literal("agentMessage"),
    Type4.Literal("reasoning"),
    Type4.Literal("toolCall"),
    Type4.Literal("toolResult"),
    Type4.Literal("other")
  ]),
  text: Type4.Optional(Type4.String()),
  timestamp: Type4.Optional(Type4.String()),
  model: Type4.Optional(Type4.String()),
  truncated: Type4.Optional(Type4.Boolean()),
  raw: Type4.Optional(PluginJsonValueSchema)
});
var SessionsCatalogReadParamsSchema = closedObject({
  ...SessionCatalogLocatorSchema.properties,
  limit: Type4.Optional(Type4.Integer({ minimum: 1 })),
  cursor: Type4.Optional(Type4.String())
});
var SessionsCatalogReadResultSchema = closedObject({
  hostId: NonEmptyString,
  label: Type4.Optional(Type4.String()),
  threadId: NonEmptyString,
  items: Type4.Array(SessionCatalogTranscriptItemSchema),
  nextCursor: Type4.Optional(Type4.String())
});
var SessionsCatalogContinueParamsSchema = closedObject({
  ...SessionCatalogLocatorSchema.properties
});
var SessionsCatalogContinueResultSchema = closedObject({ sessionKey: NonEmptyString });
var SessionsCatalogArchiveParamsSchema = closedObject({
  ...SessionCatalogLocatorSchema.properties,
  confirmNoOtherRunner: Type4.Literal(true)
});
var SessionsCatalogArchiveResultSchema = closedObject({ ok: Type4.Literal(true) });

// packages/gateway-protocol/src/schema/since.ts
function withSince(train, schema) {
  Object.assign(schema, { "x-openclaw-since": train });
  return schema;
}

// packages/gateway-protocol/src/schema/terminal-constants.ts
var MAX_TERMINAL_UPLOAD_BYTES = 16 * 1024 * 1024;
var MAX_TERMINAL_UPLOAD_BASE64_LENGTH = Math.ceil(MAX_TERMINAL_UPLOAD_BYTES / 3) * 4;
var MAX_TERMINAL_UPLOAD_NAME_LENGTH = 255;

// packages/gateway-protocol/src/schema/terminal.ts
var TerminalDimension = Type5.Integer({ minimum: 1, maximum: 2e3 });
var TerminalOpenParamsSchema = closedObject({
  // Optional agent selector; defaults to the gateway's default agent. The
  // session starts in that agent's workspace and inherits its isolation.
  agentId: Type5.Optional(NonEmptyString),
  catalog: Type5.Optional(SessionCatalogLocatorSchema),
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
  confined: Type5.Boolean(),
  title: Type5.Optional(NonEmptyString)
});
var TerminalInputParamsSchema = closedObject({
  sessionId: NonEmptyString,
  // Raw terminal input (already-encoded escape sequences from the emulator).
  data: Type5.String()
});
var TerminalUploadParamsSchema = closedObject({
  sessionId: NonEmptyString,
  name: Type5.String({ minLength: 1, maxLength: MAX_TERMINAL_UPLOAD_NAME_LENGTH }),
  contentBase64: Type5.String({ maxLength: MAX_TERMINAL_UPLOAD_BASE64_LENGTH })
});
var TerminalUploadResultSchema = closedObject({
  path: NonEmptyString,
  size: Type5.Integer({ minimum: 0, maximum: MAX_TERMINAL_UPLOAD_BYTES })
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
  confined: Type5.Boolean(),
  // Recent raw output from the server's bounded ring buffer, replayed into
  // the client emulator before live terminal.data resumes. Not a true screen
  // snapshot: after truncation it can start mid-escape-sequence; emulators
  // recover on the next full repaint (prompt, clear, resize redraw).
  buffer: Type5.String(),
  // Gateways include this cumulative UTF-16 snapshot offset when the client
  // advertises terminal-offset-seq. Optional across protocol-4 version skew.
  seq: Type5.Optional(Type5.Integer({ minimum: 0 }))
});
var TerminalSessionInfoSchema = closedObject({
  sessionId: NonEmptyString,
  agentId: NonEmptyString,
  shell: NonEmptyString,
  cwd: NonEmptyString,
  confined: Type5.Boolean(),
  /** False while the session is detached (no connection owns its stream). */
  attached: Type5.Boolean(),
  /** Connection-owned session, or the trusted agent session key that owns it. */
  owner: Type5.Optional(Type5.Union([Type5.Literal("conn"), Type5.String({ pattern: "^agent:.+" })])),
  createdAtMs: Type5.Integer({ minimum: 0 })
});
var TerminalListResultSchema = closedObject({
  sessions: Type5.Array(TerminalSessionInfoSchema)
});
var TerminalTextParamsSchema = closedObject({ sessionId: NonEmptyString });
var TerminalTextResultSchema = closedObject({ text: Type5.String() });
var TerminalAckResultSchema = closedObject({ ok: Type5.Boolean() });
var TerminalDataEventSchema = withSince(
  "2026.7",
  closedObject({
    sessionId: NonEmptyString,
    seq: Type5.Integer({ minimum: 0 }),
    data: Type5.String()
  })
);
var TerminalExitEventSchema = withSince(
  "2026.7",
  closedObject({
    sessionId: NonEmptyString,
    exitCode: Type5.Optional(Type5.Union([Type5.Integer(), Type5.Null()])),
    signal: Type5.Optional(Type5.Union([Type5.Integer(), Type5.Null()])),
    // Stable reason code so clients can distinguish process exit from a
    // server-side teardown (disconnect, idle sweep, config disable).
    reason: Type5.Optional(
      Type5.Union([
        Type5.Literal("process_exit"),
        Type5.Literal("closed"),
        Type5.Literal("disconnected"),
        // Another admin connection attached the session away; the session is
        // still alive server-side, but no longer streams to this connection.
        Type5.Literal("detached"),
        Type5.Literal("error")
      ])
    ),
    error: Type5.Optional(Type5.String())
  })
);
var TerminalEventSchema = withSince(
  "2026.7",
  Type5.Union([TerminalDataEventSchema, TerminalExitEventSchema])
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
export {
  TerminalProtocolSchemas
};
