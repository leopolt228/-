// packages/gateway-protocol/src/protocol-validator.ts
import { Compile } from "typebox/compile";
// @__NO_SIDE_EFFECTS__
function lazyCompile(schema, precheck) {
  let compiled;
  let errors = null;
  const getCompiled = () => {
    compiled ??= Compile(schema);
    return compiled;
  };
  const validate = ((data) => {
    const precheckError = precheck?.(data);
    if (precheckError) {
      errors = [precheckError];
      return false;
    }
    const current = getCompiled();
    const valid = current.Check(data);
    errors = valid ? null : [...current.Errors(data)];
    return valid;
  });
  Object.defineProperties(validate, {
    errors: {
      configurable: true,
      enumerable: true,
      get: () => errors,
      set: (nextErrors) => {
        errors = nextErrors ?? null;
      }
    },
    schema: {
      configurable: true,
      enumerable: true,
      get: () => schema
    }
  });
  return validate;
}

// packages/gateway-protocol/src/schema/approvals.ts
import { Type as Type3 } from "typebox";

// packages/gateway-protocol/src/schema/approval-id.ts
var APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN = "^(?!\\.{1,2}$)(?:[^\\uD800-\\uDFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF])+$";

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

// packages/gateway-protocol/src/schema/since.ts
function withSince(train, schema) {
  Object.assign(schema, { "x-openclaw-since": train });
  return schema;
}

// packages/gateway-protocol/src/schema/approvals.ts
var ApprovalIdSchema = Type3.String({
  minLength: 1,
  pattern: APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN,
  description: "Exact full approval id encoded safely in deep-link paths."
});
var ApprovalKindSchema = Type3.Union([
  Type3.Literal("exec"),
  Type3.Literal("plugin"),
  Type3.Literal("system-agent")
]);
var ApprovalDecisionSchema = Type3.Union([
  Type3.Literal("allow-once"),
  Type3.Literal("allow-always"),
  Type3.Literal("deny")
]);
var ApprovalAllowDecisionSchema = Type3.Union([
  Type3.Literal("allow-once"),
  Type3.Literal("allow-always")
]);
var ApprovalTerminalReasonSchema = Type3.Union([
  Type3.Literal("user"),
  Type3.Literal("timeout"),
  Type3.Literal("malformed-verdict"),
  Type3.Literal("no-route"),
  Type3.Literal("run-aborted"),
  Type3.Literal("gateway-restart"),
  Type3.Literal("storage-corrupt")
]);
var ApprovalAllowedReasonSchema = Type3.Union([Type3.Literal("user")]);
var ApprovalDeniedReasonSchema = Type3.Union([
  Type3.Literal("user"),
  Type3.Literal("malformed-verdict"),
  Type3.Literal("no-route"),
  Type3.Literal("storage-corrupt")
]);
var ApprovalExpiredReasonSchema = Type3.Union([Type3.Literal("timeout")]);
var ApprovalCancelledReasonSchema = Type3.Union([
  Type3.Literal("run-aborted"),
  Type3.Literal("gateway-restart")
]);
var PluginApprovalSeveritySchema = Type3.Union([
  Type3.Literal("info"),
  Type3.Literal("warning"),
  Type3.Literal("critical")
]);
var ApprovalAllowedDecisionsSchema = Type3.Array(ApprovalDecisionSchema, {
  minItems: 1,
  maxItems: 3,
  uniqueItems: true,
  contains: Type3.Literal("deny"),
  description: "Available reviewer decisions. Deny is always available so malformed or unsafe input can fail closed."
});
var SystemAgentApprovalAllowedDecisionsSchema = Type3.Tuple([
  Type3.Literal("allow-once"),
  Type3.Literal("deny")
]);
var ExecApprovalPresentationSchema = Type3.Object(
  {
    kind: Type3.Literal("exec"),
    commandText: NonEmptyString,
    commandPreview: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
    warningText: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
    host: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
    nodeId: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
    agentId: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
    allowedDecisions: ApprovalAllowedDecisionsSchema
  },
  {
    additionalProperties: false,
    description: "Reviewer-safe exec presentation. Runtime cwd, environment, system-run binding, and execution plan are intentionally excluded."
  }
);
var PluginApprovalPresentationSchema = closedObject({
  kind: Type3.Literal("plugin"),
  title: Type3.String({ minLength: 1, maxLength: 80 }),
  description: Type3.String({ minLength: 1, maxLength: 512 }),
  severity: PluginApprovalSeveritySchema,
  pluginId: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
  toolName: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
  agentId: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
  allowedDecisions: ApprovalAllowedDecisionsSchema
});
var SystemAgentApprovalPresentationSchema = closedObject({
  kind: Type3.Literal("system-agent"),
  title: Type3.String({ minLength: 1, maxLength: 80 }),
  description: Type3.String({ minLength: 1, maxLength: 512 }),
  proposalHash: Type3.String({ pattern: "^[a-f0-9]{64}$" }),
  agentId: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
  allowedDecisions: SystemAgentApprovalAllowedDecisionsSchema
});
var ApprovalPresentationSchema = Type3.Union([
  ExecApprovalPresentationSchema,
  PluginApprovalPresentationSchema,
  SystemAgentApprovalPresentationSchema
]);
var ApprovalRecordCommonFields = {
  id: ApprovalIdSchema,
  urlPath: NonEmptyString,
  createdAtMs: Type3.Integer({ minimum: 0 }),
  expiresAtMs: Type3.Integer({ minimum: 0 }),
  presentation: ApprovalPresentationSchema
};
var ApprovalHistorySourceAttributionSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  sessionKey: Type3.Optional(NonEmptyString)
});
var ApprovalHistoryResolverAttributionSchema = closedObject({
  kind: Type3.Union([
    Type3.Literal("device"),
    Type3.Literal("channel"),
    Type3.Literal("runtime"),
    Type3.Literal("system")
  ]),
  id: Type3.Optional(NonEmptyString)
});
var ApprovalResolutionFields = {
  resolvedAtMs: Type3.Integer({ minimum: 0 }),
  source: Type3.Optional(ApprovalHistorySourceAttributionSchema),
  resolver: Type3.Optional(ApprovalHistoryResolverAttributionSchema)
};
var PendingApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  status: Type3.Literal("pending")
});
var AllowedApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type3.Literal("allowed"),
  decision: ApprovalAllowDecisionSchema,
  reason: ApprovalAllowedReasonSchema
});
var DeniedApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type3.Literal("denied"),
  decision: Type3.Literal("deny"),
  reason: ApprovalDeniedReasonSchema
});
var ExpiredApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type3.Literal("expired"),
  reason: ApprovalExpiredReasonSchema
});
var CancelledApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type3.Literal("cancelled"),
  reason: ApprovalCancelledReasonSchema
});
var ApprovalSnapshotSchema = Type3.Union([
  PendingApprovalSnapshotSchema,
  AllowedApprovalSnapshotSchema,
  DeniedApprovalSnapshotSchema,
  ExpiredApprovalSnapshotSchema,
  CancelledApprovalSnapshotSchema
]);
var TerminalApprovalSnapshotSchema = Type3.Union([
  AllowedApprovalSnapshotSchema,
  DeniedApprovalSnapshotSchema,
  ExpiredApprovalSnapshotSchema,
  CancelledApprovalSnapshotSchema
]);
var ApprovalGetParamsSchema = closedObject({ id: ApprovalRecordCommonFields.id });
var ApprovalGetResultSchema = closedObject({ approval: ApprovalSnapshotSchema });
var ApprovalHistoryParamsSchema = closedObject({
  cursor: Type3.Optional(Type3.String({ minLength: 1, maxLength: 512 })),
  limit: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 100 })),
  kind: Type3.Optional(ApprovalKindSchema)
});
var ApprovalHistoryResultSchema = closedObject({
  items: Type3.Array(TerminalApprovalSnapshotSchema),
  nextCursor: Type3.Optional(Type3.String({ minLength: 1, maxLength: 512 }))
});
var ApprovalResolveParamsSchema = closedObject({
  id: ApprovalRecordCommonFields.id,
  kind: ApprovalKindSchema,
  decision: ApprovalDecisionSchema
});
var ApprovalResolveResultSchema = closedObject({
  applied: Type3.Boolean(),
  approval: TerminalApprovalSnapshotSchema
});
var SessionApprovalEventCommonFields = {
  sessionKey: NonEmptyString,
  sourceSessionKey: Type3.Optional(NonEmptyString),
  updatedAtMs: Type3.Integer({ minimum: 0 })
};
var PendingSessionApprovalEventSchema = withSince(
  "2026.7",
  closedObject({
    ...SessionApprovalEventCommonFields,
    phase: Type3.Literal("pending"),
    approval: PendingApprovalSnapshotSchema
  })
);
var TerminalSessionApprovalEventSchema = withSince(
  "2026.7",
  closedObject({
    ...SessionApprovalEventCommonFields,
    phase: Type3.Literal("terminal"),
    approval: TerminalApprovalSnapshotSchema
  })
);
var SessionApprovalEventSchema = withSince(
  "2026.7",
  Type3.Union([PendingSessionApprovalEventSchema, TerminalSessionApprovalEventSchema])
);
var SessionApprovalReplaySchema = withSince(
  "2026.7",
  closedObject({
    sessionKey: NonEmptyString,
    updatedAtMs: Type3.Integer({ minimum: 0 }),
    approvals: Type3.Array(PendingApprovalSnapshotSchema),
    truncated: Type3.Boolean()
  })
);

// packages/gateway-protocol/src/approval-result-validators.ts
var validateApprovalGetResult = lazyCompile(ApprovalGetResultSchema);
var validateApprovalHistoryResult = lazyCompile(ApprovalHistoryResultSchema);
var validateApprovalResolveResult = lazyCompile(ApprovalResolveResultSchema);
export {
  validateApprovalGetResult,
  validateApprovalHistoryResult,
  validateApprovalResolveResult
};
