// packages/gateway-protocol/src/schema/board.ts
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

// packages/gateway-protocol/src/schema/board.ts
var BoardTabIdSchema = Type3.String({ pattern: "^[a-z0-9-]{1,40}$" });
var BoardWidgetNameSchema = Type3.String({
  pattern: "^[a-z0-9][a-z0-9._-]{0,63}$"
});
var BoardChatDockSchema = Type3.Union([
  Type3.Literal("left"),
  Type3.Literal("right"),
  Type3.Literal("bottom"),
  Type3.Literal("hidden")
]);
var BoardSizeSchema = Type3.Union([
  Type3.Literal("sm"),
  Type3.Literal("md"),
  Type3.Literal("lg"),
  Type3.Literal("xl"),
  Type3.Literal("full")
]);
var BOARD_CRON_JOB_ID_MAX_LENGTH = 256;
var BOARD_CRON_TRIGGER_PREFIX = "cron.trigger:";
var BOARD_WIDGET_TOOL_MAX_LENGTH = BOARD_CRON_TRIGGER_PREFIX.length + BOARD_CRON_JOB_ID_MAX_LENGTH;
var BoardTabSchema = closedObject({
  tabId: BoardTabIdSchema,
  title: Type3.String({ minLength: 1, maxLength: 80 }),
  position: Type3.Integer({ minimum: 0 }),
  chatDock: BoardChatDockSchema
});
var BoardWidgetDeclaredSchema = closedObject({
  netOrigins: Type3.Optional(
    Type3.Array(Type3.String({ minLength: 1, maxLength: 2048 }), { maxItems: 32 })
  ),
  tools: Type3.Optional(
    Type3.Array(Type3.String({ minLength: 1, maxLength: BOARD_WIDGET_TOOL_MAX_LENGTH }), {
      maxItems: 64
    })
  )
});
var BoardWidgetSchema = closedObject({
  name: BoardWidgetNameSchema,
  tabId: BoardTabIdSchema,
  title: Type3.Optional(Type3.String({ minLength: 1, maxLength: 80 })),
  contentKind: Type3.Union([Type3.Literal("html"), Type3.Literal("mcp-app")]),
  sizeW: Type3.Integer({ minimum: 1, maximum: 12 }),
  sizeH: Type3.Integer({ minimum: 1, maximum: 20 }),
  position: Type3.Integer({ minimum: 0 }),
  grantState: Type3.Union([
    Type3.Literal("none"),
    Type3.Literal("pending"),
    Type3.Literal("granted"),
    Type3.Literal("rejected")
  ]),
  revision: Type3.Integer({ minimum: 1 }),
  instanceId: Type3.Optional(NonEmptyString),
  declaredSummary: Type3.Optional(Type3.Array(Type3.String())),
  declared: Type3.Optional(BoardWidgetDeclaredSchema),
  frameUrl: Type3.Optional(Type3.String()),
  viewTicket: Type3.Optional(Type3.String()),
  viewTicketTtlMs: Type3.Optional(Type3.Integer({ minimum: 1 })),
  viewGeneration: Type3.Optional(Type3.String({ pattern: "^[a-f0-9]{32}$" })),
  sandboxUrl: Type3.Optional(Type3.String()),
  sandboxPort: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 65535 })),
  sandboxOrigin: Type3.Optional(Type3.String())
});
var BoardSnapshotSchema = closedObject({
  sessionKey: NonEmptyString,
  revision: Type3.Integer({ minimum: 0 }),
  tabs: Type3.Array(BoardTabSchema),
  widgets: Type3.Array(BoardWidgetSchema)
});
var BoardTabCreateOpSchema = closedObject({
  kind: Type3.Literal("tab_create"),
  tabId: BoardTabIdSchema,
  title: Type3.String({ minLength: 1, maxLength: 80 }),
  chatDock: Type3.Optional(BoardChatDockSchema)
});
var BoardTabUpdateOpSchema = closedObject({
  kind: Type3.Literal("tab_update"),
  tabId: BoardTabIdSchema,
  title: Type3.Optional(Type3.String({ minLength: 1, maxLength: 80 })),
  chatDock: Type3.Optional(BoardChatDockSchema),
  position: Type3.Optional(Type3.Integer({ minimum: 0 }))
});
var BoardTabDeleteOpSchema = closedObject({
  kind: Type3.Literal("tab_delete"),
  tabId: BoardTabIdSchema
});
var BoardTabsReorderOpSchema = closedObject({
  kind: Type3.Literal("tabs_reorder"),
  tabIds: Type3.Array(BoardTabIdSchema)
});
var BoardWidgetMoveOpSchema = closedObject({
  kind: Type3.Literal("widget_move"),
  name: BoardWidgetNameSchema,
  tabId: Type3.Optional(BoardTabIdSchema),
  position: Type3.Optional(Type3.Integer({ minimum: 0 })),
  after: Type3.Optional(BoardWidgetNameSchema)
});
var BoardWidgetResizeOpSchema = closedObject({
  kind: Type3.Literal("widget_resize"),
  name: BoardWidgetNameSchema,
  sizeW: Type3.Integer(),
  sizeH: Type3.Integer()
});
var BoardWidgetRemoveOpSchema = closedObject({
  kind: Type3.Literal("widget_remove"),
  name: BoardWidgetNameSchema
});
var BoardOpSchema = Type3.Union([
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
  ops: Type3.Array(BoardOpSchema)
});
var BoardMcpAppDescriptorSchema = closedObject({
  serverName: NonEmptyString,
  toolName: NonEmptyString,
  uiResourceUri: NonEmptyString,
  toolCallId: NonEmptyString
});
var BoardWidgetHtmlContentSchema = closedObject({
  kind: Type3.Literal("html"),
  html: Type3.String({ maxLength: 262144 })
});
var BoardWidgetMcpAppContentSchema = closedObject({
  kind: Type3.Literal("mcp-app"),
  descriptor: BoardMcpAppDescriptorSchema
});
var BoardWidgetMcpAppPutContentSchema = closedObject({
  kind: Type3.Literal("mcp-app"),
  viewId: NonEmptyString
});
var BoardWidgetContentSchema = Type3.Union([
  BoardWidgetHtmlContentSchema,
  BoardWidgetMcpAppContentSchema
]);
var BoardCanvasDocumentSourceSchema = closedObject({
  kind: Type3.Literal("canvas-doc"),
  docId: NonEmptyString
});
var BoardWidgetPutContentSchema = Type3.Union([
  BoardWidgetHtmlContentSchema,
  BoardWidgetMcpAppPutContentSchema,
  BoardCanvasDocumentSourceSchema
]);
var BoardWidgetPutParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  name: BoardWidgetNameSchema,
  title: Type3.Optional(Type3.String({ minLength: 1, maxLength: 80 })),
  content: BoardWidgetPutContentSchema,
  placement: Type3.Optional(
    closedObject({
      tabId: Type3.Optional(BoardTabIdSchema),
      size: Type3.Optional(BoardSizeSchema),
      after: Type3.Optional(BoardWidgetNameSchema)
    })
  ),
  declared: Type3.Optional(BoardWidgetDeclaredSchema)
});
var BoardWidgetGrantParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  name: BoardWidgetNameSchema,
  decision: Type3.Union([Type3.Literal("granted"), Type3.Literal("rejected")]),
  revision: Type3.Integer({ minimum: 1 }),
  instanceId: NonEmptyString
});
var BoardWidgetAppViewParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  name: BoardWidgetNameSchema,
  revision: Type3.Integer({ minimum: 1 }),
  instanceId: NonEmptyString
});
var BoardWidgetAppViewResultSchema = closedObject({
  viewId: NonEmptyString,
  expiresAtMs: Type3.Integer({ minimum: 0 })
});
var BoardViewTicketSchema = Type3.String({ minLength: 1, maxLength: 2048 });
var BoardLegacyEventParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  widget: BoardWidgetNameSchema,
  payload: Type3.Unknown()
});
var BoardTicketEventParamsSchema = closedObject({
  ticket: BoardViewTicketSchema,
  payload: Type3.Unknown()
});
var BoardEventParamsSchema = Type3.Union([
  BoardLegacyEventParamsSchema,
  BoardTicketEventParamsSchema
]);
var BoardPromptAuthorizeParamsSchema = closedObject({
  ticket: BoardViewTicketSchema
});
var BoardDataReadParamsSchema = closedObject({
  ticket: BoardViewTicketSchema,
  bindingId: Type3.String({ minLength: 1, maxLength: 64 }),
  params: Type3.Optional(
    Type3.Record(Type3.String({ minLength: 1, maxLength: 80 }), Type3.Unknown(), {
      maxProperties: 64
    })
  )
});
var BoardActionParamsSchema = closedObject({
  ticket: BoardViewTicketSchema,
  action: Type3.Literal("cron.trigger"),
  jobId: Type3.String({ minLength: 1, maxLength: BOARD_CRON_JOB_ID_MAX_LENGTH })
});
var BoardChangedEventSchema = closedObject({
  sessionKey: NonEmptyString,
  revision: Type3.Integer({ minimum: 0 }),
  widget: Type3.Optional(BoardWidgetNameSchema)
});
var BoardFocusTabCommandSchema = closedObject({
  kind: Type3.Literal("focus_tab"),
  tabId: BoardTabIdSchema
});
var BoardSetChatDockCommandSchema = closedObject({
  kind: Type3.Literal("set_chat_dock"),
  dock: BoardChatDockSchema
});
var BoardCommandSchema = Type3.Union([
  BoardFocusTabCommandSchema,
  BoardSetChatDockCommandSchema
]);
var BoardCommandEventSchema = closedObject({
  sessionKey: NonEmptyString,
  command: BoardCommandSchema
});
export {
  BOARD_CRON_JOB_ID_MAX_LENGTH,
  BOARD_CRON_TRIGGER_PREFIX,
  BOARD_WIDGET_TOOL_MAX_LENGTH,
  BoardActionParamsSchema,
  BoardCanvasDocumentSourceSchema,
  BoardChangedEventSchema,
  BoardChatDockSchema,
  BoardCommandEventSchema,
  BoardCommandSchema,
  BoardDataReadParamsSchema,
  BoardEventParamsSchema,
  BoardFocusTabCommandSchema,
  BoardGetParamsSchema,
  BoardLegacyEventParamsSchema,
  BoardMcpAppDescriptorSchema,
  BoardOpSchema,
  BoardPromptAuthorizeParamsSchema,
  BoardSetChatDockCommandSchema,
  BoardSizeSchema,
  BoardSnapshotSchema,
  BoardTabCreateOpSchema,
  BoardTabDeleteOpSchema,
  BoardTabIdSchema,
  BoardTabSchema,
  BoardTabUpdateOpSchema,
  BoardTabsReorderOpSchema,
  BoardTicketEventParamsSchema,
  BoardUpdateParamsSchema,
  BoardViewTicketSchema,
  BoardWidgetAppViewParamsSchema,
  BoardWidgetAppViewResultSchema,
  BoardWidgetContentSchema,
  BoardWidgetDeclaredSchema,
  BoardWidgetGrantParamsSchema,
  BoardWidgetHtmlContentSchema,
  BoardWidgetMcpAppContentSchema,
  BoardWidgetMcpAppPutContentSchema,
  BoardWidgetMoveOpSchema,
  BoardWidgetNameSchema,
  BoardWidgetPutContentSchema,
  BoardWidgetPutParamsSchema,
  BoardWidgetRemoveOpSchema,
  BoardWidgetResizeOpSchema,
  BoardWidgetSchema
};
