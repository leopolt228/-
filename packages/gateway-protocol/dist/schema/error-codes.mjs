// packages/gateway-protocol/src/schema/error-codes.ts
import { Type as Type3 } from "typebox";

// packages/gateway-protocol/src/gateway-error-details.ts
var ErrorCodes = {
  /** Client has not completed account/device linking for this gateway. */
  NOT_LINKED: "NOT_LINKED",
  /** Device exists but still needs an explicit pairing approval. */
  NOT_PAIRED: "NOT_PAIRED",
  /** Agent turn exceeded the gateway wait window. */
  AGENT_TIMEOUT: "AGENT_TIMEOUT",
  /** Request payload failed protocol validation or method preconditions. */
  INVALID_REQUEST: "INVALID_REQUEST",
  /** Authenticated caller lacks permission for the requested operation. */
  FORBIDDEN: "FORBIDDEN",
  /** Approval resolution referenced a missing or expired approval request. */
  APPROVAL_NOT_FOUND: "APPROVAL_NOT_FOUND",
  /** Gateway service or required backend is temporarily unavailable. */
  UNAVAILABLE: "UNAVAILABLE"
};
var GatewayErrorDetailCodes = {
  MISSING_SCOPE: "MISSING_SCOPE",
  MCP_APP_VIEW_EXPIRED: "MCP_APP_VIEW_EXPIRED"
};
var LEGACY_MISSING_SCOPE_PATTERN = /\bmissing scope:\s*([a-z0-9._-]+)/i;
function asRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function readMissingScopeErrorDetails(details) {
  const record = asRecord(details);
  if (record?.code !== GatewayErrorDetailCodes.MISSING_SCOPE) {
    return null;
  }
  const missingScope = typeof record.missingScope === "string" ? record.missingScope.trim() : "";
  const requiredScopes = Array.isArray(record.requiredScopes) ? record.requiredScopes.map((scope) => typeof scope === "string" ? scope.trim() : "") : [];
  if (!missingScope || requiredScopes.length === 0 || requiredScopes.some((scope) => !scope)) {
    return null;
  }
  return {
    code: GatewayErrorDetailCodes.MISSING_SCOPE,
    missingScope,
    requiredScopes
  };
}
function isMcpAppViewExpiredError(error) {
  const record = asRecord(error);
  return asRecord(record?.details)?.code === GatewayErrorDetailCodes.MCP_APP_VIEW_EXPIRED;
}
function readMissingScopeError(error) {
  const record = asRecord(error);
  if (!record) {
    return null;
  }
  const structured = readMissingScopeErrorDetails(record.details);
  if (structured) {
    return structured;
  }
  const gatewayError = record;
  const code = typeof gatewayError.gatewayCode === "string" ? gatewayError.gatewayCode : typeof gatewayError.code === "string" ? gatewayError.code : "";
  if (code !== ErrorCodes.FORBIDDEN && code !== ErrorCodes.INVALID_REQUEST) {
    return null;
  }
  const message = typeof gatewayError.message === "string" ? gatewayError.message : "";
  const missingScope = message.match(LEGACY_MISSING_SCOPE_PATTERN)?.[1];
  return missingScope ? {
    code: GatewayErrorDetailCodes.MISSING_SCOPE,
    missingScope,
    requiredScopes: [missingScope]
  } : null;
}

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

// packages/gateway-protocol/src/schema/error-codes.ts
var MissingScopeErrorDetailsSchema = closedObject({
  code: Type3.Literal(GatewayErrorDetailCodes.MISSING_SCOPE),
  missingScope: NonEmptyString,
  requiredScopes: Type3.Array(NonEmptyString, { minItems: 1 })
});
var McpAppViewExpiredErrorDetailsSchema = closedObject({
  code: Type3.Literal(GatewayErrorDetailCodes.MCP_APP_VIEW_EXPIRED)
});
var GatewayErrorDetailsSchema = Type3.Union([
  MissingScopeErrorDetailsSchema,
  McpAppViewExpiredErrorDetailsSchema
]);
function errorShape(code, message, opts) {
  return {
    code,
    message,
    ...opts
  };
}
function buildMissingScopeErrorDetails(params) {
  const requiredScopes = params.requiredScopes.length > 0 ? [...params.requiredScopes] : [params.missingScope];
  return {
    code: GatewayErrorDetailCodes.MISSING_SCOPE,
    missingScope: params.missingScope,
    requiredScopes
  };
}
function missingScopeErrorShape(params) {
  const details = buildMissingScopeErrorDetails(params);
  return errorShape(ErrorCodes.FORBIDDEN, `missing scope: ${params.missingScope}`, { details });
}
export {
  ErrorCodes,
  GatewayErrorDetailCodes,
  GatewayErrorDetailsSchema,
  McpAppViewExpiredErrorDetailsSchema,
  MissingScopeErrorDetailsSchema,
  buildMissingScopeErrorDetails,
  errorShape,
  isMcpAppViewExpiredError,
  missingScopeErrorShape,
  readMissingScopeError,
  readMissingScopeErrorDetails
};
