// packages/gateway-protocol/src/clawhub-trust-error-details.ts
var ClawHubTrustErrorCodes = {
  SECURITY_UNAVAILABLE: "clawhub_security_unavailable",
  RISK_ACKNOWLEDGEMENT_REQUIRED: "clawhub_risk_acknowledgement_required",
  DOWNLOAD_BLOCKED: "clawhub_download_blocked"
};
function normalizeNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value : void 0;
}
function isClawHubTrustErrorCode(value) {
  return value === ClawHubTrustErrorCodes.SECURITY_UNAVAILABLE || value === ClawHubTrustErrorCodes.RISK_ACKNOWLEDGEMENT_REQUIRED || value === ClawHubTrustErrorCodes.DOWNLOAD_BLOCKED;
}
function buildClawHubTrustErrorDetails(params) {
  if (!params.code && !params.version && !params.warning) {
    return void 0;
  }
  return {
    ...params.code ? { clawhubTrustCode: params.code } : {},
    ...params.version ? { version: params.version } : {},
    ...params.warning ? { warning: params.warning } : {}
  };
}
function readClawHubTrustErrorDetails(details) {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return void 0;
  }
  const raw = details;
  const code = isClawHubTrustErrorCode(raw.clawhubTrustCode) ? raw.clawhubTrustCode : void 0;
  const version = normalizeNonEmptyString(raw.version);
  const warning = normalizeNonEmptyString(raw.warning);
  if (!code && !version && !warning) {
    return void 0;
  }
  return {
    ...code ? { clawhubTrustCode: code } : {},
    ...version ? { version } : {},
    ...warning ? { warning } : {}
  };
}

// packages/gateway-protocol/src/system-agent-error-details.ts
var SystemAgentErrorDetailCodes = {
  SESSION_INVALIDATED: "system_agent_session_invalidated"
};
function buildSystemAgentSessionInvalidatedErrorDetails() {
  return { code: SystemAgentErrorDetailCodes.SESSION_INVALIDATED };
}
function readSystemAgentSessionInvalidatedErrorDetails(details) {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return void 0;
  }
  const code = details.code;
  return code === SystemAgentErrorDetailCodes.SESSION_INVALIDATED ? { code } : void 0;
}

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

// packages/gateway-protocol/src/session-icon.ts
var SESSION_AGENT_ATTENTION_ICON_IDS = [
  "hand",
  "key",
  "alert",
  "flag",
  "lock",
  "hourglass"
];
var NAMED_ICON_RE = /^[a-z0-9-]{1,32}$/;
var EXTENDED_PICTOGRAPHIC_RE = /\p{Extended_Pictographic}/u;
var SVG_PREFIX = "svg:";
var SVG_MAX_BYTES = 4096;
var graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
var SVG_ELEMENTS = /* @__PURE__ */ new Set([
  "svg",
  "g",
  "path",
  "circle",
  "ellipse",
  "rect",
  "line",
  "polyline",
  "polygon",
  "title"
]);
var SVG_ATTRIBUTES = /* @__PURE__ */ new Set([
  "viewBox",
  "xmlns",
  "d",
  "fill",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "x",
  "y",
  "x1",
  "y1",
  "x2",
  "y2",
  "width",
  "height",
  "points",
  "opacity",
  "fill-rule",
  "transform"
]);
var SVG_PAINT_RE = /^(?:none|currentColor|#[0-9a-fA-F]{3,4}|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{8})$/;
var SVG_NUMBER_SOURCE = "[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][-+]?\\d+)?";
var SVG_NUMBER_RE = new RegExp(`^${SVG_NUMBER_SOURCE}$`);
var SVG_TRANSFORM_RE = new RegExp(`^([a-z]+)\\s*\\(([^)]*)\\)`);
var SVG_SUSPICIOUS_VALUE_RE = /(?:javascript|url\s*\(|data:|expression)/i;
var XML_ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'"
};
function parseXmlEntities(value) {
  let result = "";
  let offset = 0;
  while (offset < value.length) {
    const ampersand = value.indexOf("&", offset);
    if (ampersand < 0) {
      return result + value.slice(offset);
    }
    result += value.slice(offset, ampersand);
    const semicolon = value.indexOf(";", ampersand + 1);
    if (semicolon < 0) {
      return null;
    }
    const entity = value.slice(ampersand, semicolon + 1);
    const decoded = XML_ENTITIES[entity];
    if (decoded === void 0) {
      return null;
    }
    result += decoded;
    offset = semicolon + 1;
  }
  return result;
}
function escapeXmlText(value) {
  return value.replace(/[&<>]/g, (character) => {
    if (character === "&") {
      return "&amp;";
    }
    return character === "<" ? "&lt;" : "&gt;";
  });
}
function escapeXmlAttribute(value) {
  return escapeXmlText(value).replace(/"/g, "&quot;");
}
function parseTransformNumbers(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }
  const parts = trimmed.split(/[\s,]+/);
  if (parts.some((part) => !SVG_NUMBER_RE.test(part))) {
    return null;
  }
  return parts.length;
}
function isValidTransform(value) {
  let remaining = value.trim();
  while (remaining) {
    const match = SVG_TRANSFORM_RE.exec(remaining);
    if (!match) {
      return false;
    }
    const name = match[1];
    const count = parseTransformNumbers(match[2] ?? "");
    const validCount = name === "translate" || name === "scale" ? count === 1 || count === 2 : name === "rotate" ? count === 1 || count === 3 : name === "matrix" ? count === 6 : false;
    if (!validCount) {
      return false;
    }
    remaining = remaining.slice(match[0].length).trimStart();
    if (remaining.startsWith(",")) {
      remaining = remaining.slice(1).trimStart();
    }
  }
  return true;
}
function isNameCharacter(character) {
  return /[A-Za-z0-9-]/.test(character);
}
function sanitizeSvg(svg) {
  let offset = 0;
  let rootSeen = false;
  let rootClosed = false;
  const stack = [];
  const output = [];
  const skipWhitespace = () => {
    while (offset < svg.length && /\s/.test(svg[offset] ?? "")) {
      offset += 1;
    }
  };
  const readName = () => {
    const start = offset;
    while (offset < svg.length && isNameCharacter(svg[offset] ?? "")) {
      offset += 1;
    }
    return svg.slice(start, offset);
  };
  while (offset < svg.length) {
    if (svg[offset] !== "<") {
      const nextTag = svg.indexOf("<", offset);
      const end = nextTag < 0 ? svg.length : nextTag;
      const rawText = svg.slice(offset, end);
      const text = parseXmlEntities(rawText);
      if (text === null || stack.length === 0 || rootClosed) {
        if (rawText.trim()) {
          return null;
        }
      } else if (text.trim()) {
        if (stack.at(-1) !== "title") {
          return null;
        }
        output.push(escapeXmlText(text));
      }
      offset = end;
      continue;
    }
    offset += 1;
    if (svg[offset] === "/") {
      offset += 1;
      const name2 = readName();
      skipWhitespace();
      if (!name2 || svg[offset] !== ">" || stack.at(-1) !== name2) {
        return null;
      }
      offset += 1;
      stack.pop();
      output.push(`</${name2}>`);
      if (stack.length === 0) {
        rootClosed = true;
      }
      continue;
    }
    const name = readName();
    if (!SVG_ELEMENTS.has(name) || rootClosed || stack.at(-1) === "title") {
      return null;
    }
    if (stack.length === 0) {
      if (rootSeen || name !== "svg") {
        return null;
      }
      rootSeen = true;
    } else if (name === "svg") {
      return null;
    }
    const attributes = [];
    const attributeNames = /* @__PURE__ */ new Set();
    let selfClosing = false;
    let tagClosed = false;
    while (offset < svg.length) {
      skipWhitespace();
      if (svg.startsWith("/>", offset)) {
        selfClosing = true;
        tagClosed = true;
        offset += 2;
        break;
      }
      if (svg[offset] === ">") {
        tagClosed = true;
        offset += 1;
        break;
      }
      const attributeName = readName();
      if (!SVG_ATTRIBUTES.has(attributeName) || attributeNames.has(attributeName) || attributeName.toLowerCase().startsWith("on")) {
        return null;
      }
      attributeNames.add(attributeName);
      skipWhitespace();
      if (svg[offset] !== "=") {
        return null;
      }
      offset += 1;
      skipWhitespace();
      const quote = svg[offset];
      if (quote !== '"' && quote !== "'") {
        return null;
      }
      offset += 1;
      const valueStart = offset;
      while (offset < svg.length && svg[offset] !== quote) {
        if (svg[offset] === "<") {
          return null;
        }
        offset += 1;
      }
      if (svg[offset] !== quote) {
        return null;
      }
      const rawValue = svg.slice(valueStart, offset);
      offset += 1;
      const value = parseXmlEntities(rawValue);
      if (value === null || SVG_SUSPICIOUS_VALUE_RE.test(value)) {
        return null;
      }
      const isRoot = stack.length === 0 && name === "svg";
      if (attributeName === "xmlns" && (!isRoot || value !== "http://www.w3.org/2000/svg") || (attributeName === "fill" || attributeName === "stroke") && !SVG_PAINT_RE.test(value) || attributeName === "transform" && !isValidTransform(value)) {
        return null;
      }
      attributes.push({ name: attributeName, value });
    }
    if (!tagClosed || name === "svg" && selfClosing) {
      return null;
    }
    const serializedAttributes = attributes.map((attribute) => ` ${attribute.name}="${escapeXmlAttribute(attribute.value)}"`).join("");
    output.push(`<${name}${serializedAttributes}${selfClosing ? "/>" : ">"}`);
    if (!selfClosing) {
      stack.push(name);
    }
  }
  return rootSeen && rootClosed && stack.length === 0 ? output.join("") : null;
}
function isEmoji(value) {
  return value.length <= 16 && EXTENDED_PICTOGRAPHIC_RE.test(value) && Array.from(graphemeSegmenter.segment(value)).length === 1;
}
function parseSessionIcon(value) {
  if (value.startsWith("name:")) {
    const name = value.slice("name:".length);
    return NAMED_ICON_RE.test(name) ? { kind: "named", name } : null;
  }
  if (value.startsWith(SVG_PREFIX)) {
    const svg = value.slice(SVG_PREFIX.length);
    return /^<svg(?:\s|>)/.test(svg) && svg.endsWith("</svg>") ? { kind: "svg", svg } : null;
  }
  return isEmoji(value) ? { kind: "emoji", emoji: value } : null;
}
function normalizeSessionIconInput(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: false, reason: "session icon is empty" };
  }
  if (trimmed.startsWith(SVG_PREFIX)) {
    if (new TextEncoder().encode(trimmed).byteLength > SVG_MAX_BYTES) {
      return { ok: false, reason: `session SVG icon exceeds ${SVG_MAX_BYTES} bytes` };
    }
    const parsed2 = parseSessionIcon(trimmed);
    if (!parsed2 || parsed2.kind !== "svg") {
      return { ok: false, reason: "invalid session SVG icon shape" };
    }
    const sanitized = sanitizeSvg(parsed2.svg);
    if (!sanitized) {
      return { ok: false, reason: "session SVG icon contains disallowed markup" };
    }
    const canonical = `${SVG_PREFIX}${sanitized}`;
    if (new TextEncoder().encode(canonical).byteLength > SVG_MAX_BYTES) {
      return { ok: false, reason: `session SVG icon exceeds ${SVG_MAX_BYTES} bytes` };
    }
    return { ok: true, value: canonical };
  }
  const parsed = parseSessionIcon(trimmed);
  if (!parsed) {
    return { ok: false, reason: "session icon must be one emoji, name:<id>, or svg:<svg>" };
  }
  return { ok: true, value: trimmed };
}

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

// packages/gateway-protocol/src/terminal-validators.ts
var validateTerminalOpenParams = lazyCompile(TerminalOpenParamsSchema);
var validateTerminalInputParams = lazyCompile(TerminalInputParamsSchema);
var validateTerminalResizeParams = lazyCompile(TerminalResizeParamsSchema);
var validateTerminalCloseParams = lazyCompile(TerminalCloseParamsSchema);
var validateTerminalAttachParams = lazyCompile(TerminalAttachParamsSchema);
var validateTerminalTextParams = lazyCompile(TerminalTextParamsSchema);
var validateTerminalUploadParams = lazyCompile(TerminalUploadParamsSchema);
var validateTerminalUploadResult = lazyCompile(TerminalUploadResultSchema);

// packages/gateway-protocol/src/schema/approvals.ts
import { Type as Type6 } from "typebox";

// packages/gateway-protocol/src/schema/approval-id.ts
var APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN = "^(?!\\.{1,2}$)(?:[^\\uD800-\\uDFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF])+$";
function isWellFormedApprovalId(value) {
  if (value.length === 0 || value === "." || value === "..") {
    return false;
  }
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit >= 55296 && codeUnit <= 56319) {
      if (index + 1 >= value.length) {
        return false;
      }
      const next = value.charCodeAt(index + 1);
      if (next < 56320 || next > 57343) {
        return false;
      }
      index += 1;
    } else if (codeUnit >= 56320 && codeUnit <= 57343) {
      return false;
    }
  }
  return true;
}

// packages/gateway-protocol/src/schema/approvals.ts
var ApprovalIdSchema = Type6.String({
  minLength: 1,
  pattern: APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN,
  description: "Exact full approval id encoded safely in deep-link paths."
});
var ApprovalKindSchema = Type6.Union([
  Type6.Literal("exec"),
  Type6.Literal("plugin"),
  Type6.Literal("system-agent")
]);
var ApprovalDecisionSchema = Type6.Union([
  Type6.Literal("allow-once"),
  Type6.Literal("allow-always"),
  Type6.Literal("deny")
]);
var ApprovalAllowDecisionSchema = Type6.Union([
  Type6.Literal("allow-once"),
  Type6.Literal("allow-always")
]);
var ApprovalTerminalReasonSchema = Type6.Union([
  Type6.Literal("user"),
  Type6.Literal("timeout"),
  Type6.Literal("malformed-verdict"),
  Type6.Literal("no-route"),
  Type6.Literal("run-aborted"),
  Type6.Literal("gateway-restart"),
  Type6.Literal("storage-corrupt")
]);
var ApprovalAllowedReasonSchema = Type6.Union([Type6.Literal("user")]);
var ApprovalDeniedReasonSchema = Type6.Union([
  Type6.Literal("user"),
  Type6.Literal("malformed-verdict"),
  Type6.Literal("no-route"),
  Type6.Literal("storage-corrupt")
]);
var ApprovalExpiredReasonSchema = Type6.Union([Type6.Literal("timeout")]);
var ApprovalCancelledReasonSchema = Type6.Union([
  Type6.Literal("run-aborted"),
  Type6.Literal("gateway-restart")
]);
var PluginApprovalSeveritySchema = Type6.Union([
  Type6.Literal("info"),
  Type6.Literal("warning"),
  Type6.Literal("critical")
]);
var ApprovalAllowedDecisionsSchema = Type6.Array(ApprovalDecisionSchema, {
  minItems: 1,
  maxItems: 3,
  uniqueItems: true,
  contains: Type6.Literal("deny"),
  description: "Available reviewer decisions. Deny is always available so malformed or unsafe input can fail closed."
});
var SystemAgentApprovalAllowedDecisionsSchema = Type6.Tuple([
  Type6.Literal("allow-once"),
  Type6.Literal("deny")
]);
var ExecApprovalPresentationSchema = Type6.Object(
  {
    kind: Type6.Literal("exec"),
    commandText: NonEmptyString,
    commandPreview: Type6.Optional(Type6.Union([Type6.String(), Type6.Null()])),
    warningText: Type6.Optional(Type6.Union([Type6.String(), Type6.Null()])),
    host: Type6.Optional(Type6.Union([Type6.String(), Type6.Null()])),
    nodeId: Type6.Optional(Type6.Union([NonEmptyString, Type6.Null()])),
    agentId: Type6.Optional(Type6.Union([NonEmptyString, Type6.Null()])),
    allowedDecisions: ApprovalAllowedDecisionsSchema
  },
  {
    additionalProperties: false,
    description: "Reviewer-safe exec presentation. Runtime cwd, environment, system-run binding, and execution plan are intentionally excluded."
  }
);
var PluginApprovalPresentationSchema = closedObject({
  kind: Type6.Literal("plugin"),
  title: Type6.String({ minLength: 1, maxLength: 80 }),
  description: Type6.String({ minLength: 1, maxLength: 512 }),
  severity: PluginApprovalSeveritySchema,
  pluginId: Type6.Optional(Type6.Union([NonEmptyString, Type6.Null()])),
  toolName: Type6.Optional(Type6.Union([NonEmptyString, Type6.Null()])),
  agentId: Type6.Optional(Type6.Union([NonEmptyString, Type6.Null()])),
  allowedDecisions: ApprovalAllowedDecisionsSchema
});
var SystemAgentApprovalPresentationSchema = closedObject({
  kind: Type6.Literal("system-agent"),
  title: Type6.String({ minLength: 1, maxLength: 80 }),
  description: Type6.String({ minLength: 1, maxLength: 512 }),
  proposalHash: Type6.String({ pattern: "^[a-f0-9]{64}$" }),
  agentId: Type6.Optional(Type6.Union([NonEmptyString, Type6.Null()])),
  allowedDecisions: SystemAgentApprovalAllowedDecisionsSchema
});
var ApprovalPresentationSchema = Type6.Union([
  ExecApprovalPresentationSchema,
  PluginApprovalPresentationSchema,
  SystemAgentApprovalPresentationSchema
]);
var ApprovalRecordCommonFields = {
  id: ApprovalIdSchema,
  urlPath: NonEmptyString,
  createdAtMs: Type6.Integer({ minimum: 0 }),
  expiresAtMs: Type6.Integer({ minimum: 0 }),
  presentation: ApprovalPresentationSchema
};
var ApprovalHistorySourceAttributionSchema = closedObject({
  agentId: Type6.Optional(NonEmptyString),
  sessionKey: Type6.Optional(NonEmptyString)
});
var ApprovalHistoryResolverAttributionSchema = closedObject({
  kind: Type6.Union([
    Type6.Literal("device"),
    Type6.Literal("channel"),
    Type6.Literal("runtime"),
    Type6.Literal("system")
  ]),
  id: Type6.Optional(NonEmptyString)
});
var ApprovalResolutionFields = {
  resolvedAtMs: Type6.Integer({ minimum: 0 }),
  source: Type6.Optional(ApprovalHistorySourceAttributionSchema),
  resolver: Type6.Optional(ApprovalHistoryResolverAttributionSchema)
};
var PendingApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  status: Type6.Literal("pending")
});
var AllowedApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type6.Literal("allowed"),
  decision: ApprovalAllowDecisionSchema,
  reason: ApprovalAllowedReasonSchema
});
var DeniedApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type6.Literal("denied"),
  decision: Type6.Literal("deny"),
  reason: ApprovalDeniedReasonSchema
});
var ExpiredApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type6.Literal("expired"),
  reason: ApprovalExpiredReasonSchema
});
var CancelledApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type6.Literal("cancelled"),
  reason: ApprovalCancelledReasonSchema
});
var ApprovalSnapshotSchema = Type6.Union([
  PendingApprovalSnapshotSchema,
  AllowedApprovalSnapshotSchema,
  DeniedApprovalSnapshotSchema,
  ExpiredApprovalSnapshotSchema,
  CancelledApprovalSnapshotSchema
]);
var TerminalApprovalSnapshotSchema = Type6.Union([
  AllowedApprovalSnapshotSchema,
  DeniedApprovalSnapshotSchema,
  ExpiredApprovalSnapshotSchema,
  CancelledApprovalSnapshotSchema
]);
var ApprovalGetParamsSchema = closedObject({ id: ApprovalRecordCommonFields.id });
var ApprovalGetResultSchema = closedObject({ approval: ApprovalSnapshotSchema });
var ApprovalHistoryParamsSchema = closedObject({
  cursor: Type6.Optional(Type6.String({ minLength: 1, maxLength: 512 })),
  limit: Type6.Optional(Type6.Integer({ minimum: 1, maximum: 100 })),
  kind: Type6.Optional(ApprovalKindSchema)
});
var ApprovalHistoryResultSchema = closedObject({
  items: Type6.Array(TerminalApprovalSnapshotSchema),
  nextCursor: Type6.Optional(Type6.String({ minLength: 1, maxLength: 512 }))
});
var ApprovalResolveParamsSchema = closedObject({
  id: ApprovalRecordCommonFields.id,
  kind: ApprovalKindSchema,
  decision: ApprovalDecisionSchema
});
var ApprovalResolveResultSchema = closedObject({
  applied: Type6.Boolean(),
  approval: TerminalApprovalSnapshotSchema
});
var SessionApprovalEventCommonFields = {
  sessionKey: NonEmptyString,
  sourceSessionKey: Type6.Optional(NonEmptyString),
  updatedAtMs: Type6.Integer({ minimum: 0 })
};
var PendingSessionApprovalEventSchema = withSince(
  "2026.7",
  closedObject({
    ...SessionApprovalEventCommonFields,
    phase: Type6.Literal("pending"),
    approval: PendingApprovalSnapshotSchema
  })
);
var TerminalSessionApprovalEventSchema = withSince(
  "2026.7",
  closedObject({
    ...SessionApprovalEventCommonFields,
    phase: Type6.Literal("terminal"),
    approval: TerminalApprovalSnapshotSchema
  })
);
var SessionApprovalEventSchema = withSince(
  "2026.7",
  Type6.Union([PendingSessionApprovalEventSchema, TerminalSessionApprovalEventSchema])
);
var SessionApprovalReplaySchema = withSince(
  "2026.7",
  closedObject({
    sessionKey: NonEmptyString,
    updatedAtMs: Type6.Integer({ minimum: 0 }),
    approvals: Type6.Array(PendingApprovalSnapshotSchema),
    truncated: Type6.Boolean()
  })
);

// packages/gateway-protocol/src/approval-result-validators.ts
var validateApprovalGetResult = lazyCompile(ApprovalGetResultSchema);
var validateApprovalHistoryResult = lazyCompile(ApprovalHistoryResultSchema);
var validateApprovalResolveResult = lazyCompile(ApprovalResolveResultSchema);

// packages/gateway-protocol/src/validation-errors.ts
function firstStringParam(value) {
  if (typeof value === "string" && value.trim()) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.find(
      (entry) => typeof entry === "string" && entry.trim().length > 0
    );
  }
  return void 0;
}
function formatValidationErrors(errors) {
  if (!errors?.length) {
    return "unknown validation error";
  }
  const parts = [];
  for (const err of errors) {
    const keyword = typeof err?.keyword === "string" ? err.keyword : "";
    const instancePath = typeof err?.instancePath === "string" ? err.instancePath : "";
    if (keyword === "additionalProperties") {
      const additionalProperty = firstStringParam(err?.params?.additionalProperty) ?? firstStringParam(err?.params?.additionalProperties);
      if (additionalProperty) {
        const where2 = instancePath ? `at ${instancePath}` : "at root";
        parts.push(`${where2}: unexpected property '${additionalProperty}'`);
        continue;
      }
    }
    if (keyword === "required") {
      const missingProperty = firstStringParam(err?.params?.missingProperty) ?? firstStringParam(err?.params?.requiredProperties);
      if (missingProperty) {
        const where2 = instancePath ? `at ${instancePath}: ` : "";
        parts.push(`${where2}must have required property '${missingProperty}'`);
        continue;
      }
    }
    const failingKeyword = typeof err?.params?.failingKeyword === "string" ? err.params.failingKeyword : "";
    const message = keyword === "then" || keyword === "if" && failingKeyword === "then" ? "must have required conditional properties" : typeof err?.message === "string" && err.message.trim() ? err.message : "validation error";
    const where = instancePath ? `at ${instancePath}: ` : "";
    parts.push(`${where}${message}`);
  }
  const unique = [...new Set(parts.filter((part) => part.trim()))];
  return unique.length > 0 ? unique.join("; ") : "unknown validation error";
}

// packages/gateway-protocol/src/schema/worker-inference.ts
import { Type as Type9 } from "typebox";
import { Value } from "typebox/value";

// packages/gateway-protocol/src/schema/worker-admission.ts
import { Type as Type8 } from "typebox";

// packages/gateway-protocol/src/schema/worker-protocol-primitives.ts
import { Type as Type7 } from "typebox";
var WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH = 256;
var WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH = 128;
var WORKER_PROTOCOL_MAX_PAYLOAD_BYTES = 64 * 1024;
var WorkerIdentifierSchema = Type7.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH,
  pattern: "^\\S(?:.*\\S)?$"
});
var WorkerFrameIdSchema = Type7.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH
});
var WorkerAdmissionFailureReasonSchema = Type7.Union([
  Type7.Literal("invalid-credential"),
  Type7.Literal("credential-expired"),
  Type7.Literal("environment-mismatch"),
  Type7.Literal("environment-unavailable"),
  Type7.Literal("bundle-mismatch"),
  Type7.Literal("version-mismatch"),
  Type7.Literal("session-mismatch"),
  Type7.Literal("placement-mismatch"),
  Type7.Literal("owner-epoch-mismatch"),
  Type7.Literal("rpc-set-mismatch"),
  Type7.Literal("protocol-features-mismatch")
]);
var WorkerProtocolCloseReasonSchema = Type7.Union([
  WorkerAdmissionFailureReasonSchema,
  Type7.Literal("invalid-handshake"),
  Type7.Literal("protocol-mismatch"),
  Type7.Literal("gateway-unavailable"),
  Type7.Literal("invalid-frame"),
  Type7.Literal("slow-consumer"),
  Type7.Literal("method-not-allowed"),
  Type7.Literal("invalid-heartbeat"),
  Type7.Literal("credential-replaced"),
  Type7.Literal("gateway-shutdown")
]);
var WorkerErrorCodeSchema = Type7.Union([
  Type7.Literal("INVALID_REQUEST"),
  Type7.Literal("UNAVAILABLE")
]);
var WorkerErrorDetailsSchema = closedObject({ reason: WorkerProtocolCloseReasonSchema });
var WorkerErrorShapeSchema = closedObject({
  code: WorkerErrorCodeSchema,
  message: Type7.String({ minLength: 1, maxLength: 256 }),
  details: WorkerErrorDetailsSchema,
  retryable: Type7.Optional(Type7.Boolean()),
  retryAfterMs: Type7.Optional(Type7.Integer({ minimum: 0 }))
});
var WorkerErrorResponseFrameSchema = closedObject({
  type: Type7.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type7.Literal(false),
  error: WorkerErrorShapeSchema
});
var WorkerTranscriptUsageSchema = closedObject({
  input: Type7.Number({ minimum: 0 }),
  output: Type7.Number({ minimum: 0 }),
  cacheRead: Type7.Number({ minimum: 0 }),
  cacheWrite: Type7.Number({ minimum: 0 }),
  contextUsage: Type7.Optional(
    Type7.Union([
      closedObject({
        state: Type7.Literal("available"),
        promptTokens: Type7.Number({ minimum: 0 }),
        totalTokens: Type7.Number({ minimum: 0 })
      }),
      closedObject({ state: Type7.Literal("unavailable") })
    ])
  ),
  totalTokens: Type7.Number({ minimum: 0 }),
  cost: closedObject({
    input: Type7.Number({ minimum: 0 }),
    output: Type7.Number({ minimum: 0 }),
    cacheRead: Type7.Number({ minimum: 0 }),
    cacheWrite: Type7.Number({ minimum: 0 }),
    total: Type7.Number({ minimum: 0 }),
    totalOrigin: Type7.Optional(Type7.Literal("provider-billed"))
  })
});
var WorkerTranscriptAssistantDiagnosticSchema = closedObject({
  type: WorkerIdentifierSchema,
  timestamp: Type7.Integer({ minimum: 0 }),
  error: Type7.Optional(
    closedObject({
      name: Type7.Optional(Type7.String({ maxLength: 256 })),
      message: Type7.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
      stack: Type7.Optional(Type7.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
      code: Type7.Optional(Type7.Union([Type7.String({ maxLength: 256 }), Type7.Number()]))
    })
  ),
  details: Type7.Optional(
    Type7.Record(Type7.String({ minLength: 1, maxLength: 256 }), Type7.Unknown())
  )
});
var LiveTextSchema = Type7.String({
  maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
});
var LiveIntegerSchema = Type7.Integer({
  minimum: 0,
  maximum: Number.MAX_SAFE_INTEGER
});
var LiveSequenceSchema = Type7.Integer({
  minimum: 1,
  maximum: Number.MAX_SAFE_INTEGER
});

// packages/gateway-protocol/src/schema/worker-admission.ts
var WORKER_RPC_SET_VERSION = 1;
var WORKER_HEARTBEAT_INTERVAL_MS = 15e3;
var WORKER_PROTOCOL_METHODS = [
  "worker.heartbeat",
  "worker.transcript.commit",
  "worker.live-event"
];
var WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE = "worker-transcript-commit-v1";
var WORKER_LIVE_EVENT_PROTOCOL_FEATURE = "worker-live-event-v1";
var WORKER_PROTOCOL_FEATURES = [
  "worker-heartbeat-v1",
  WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE,
  WORKER_LIVE_EVENT_PROTOCOL_FEATURE,
  "worker-inference-v1"
];
var WORKER_PROTOCOL_MAX_METHOD_LENGTH = 64;
var WORKER_PROTOCOL_MAX_FEATURES = 64;
var WORKER_PROTOCOL_MAX_FEATURE_LENGTH = 128;
var WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES = 64;
var WORKER_TRANSCRIPT_MAX_CONTENT_PARTS = 128;
var WORKER_TRANSCRIPT_MAX_JSON_DEPTH = 32;
var WorkerCredentialSchema = Type8.String({ minLength: 16, maxLength: 256 });
var WorkerProtocolFeatureSchema = Type8.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_FEATURE_LENGTH
});
var WorkerBundleHashSchema = Type8.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var WorkerAdmissionHandshakeSchema = withSince(
  "2026.7",
  closedObject({
    bundleHash: WorkerBundleHashSchema,
    openclawVersion: Type8.String({ minLength: 1, maxLength: 128 }),
    protocolFeatures: Type8.Array(WorkerProtocolFeatureSchema, {
      maxItems: WORKER_PROTOCOL_MAX_FEATURES,
      uniqueItems: true
    })
  })
);
var WorkerConnectAdmissionCommonProperties = {
  environmentId: WorkerIdentifierSchema,
  credential: WorkerCredentialSchema,
  ownerEpoch: Type8.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  rpcSetVersion: Type8.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
  handshake: WorkerAdmissionHandshakeSchema
};
var WorkerConnectAdmissionSchema = Type8.Union([
  closedObject({
    ...WorkerConnectAdmissionCommonProperties,
    sessionId: Type8.Null(),
    runId: Type8.Null()
  }),
  closedObject({
    ...WorkerConnectAdmissionCommonProperties,
    sessionId: WorkerIdentifierSchema,
    runId: WorkerIdentifierSchema
  })
]);
var WorkerConnectParamsSchema = closedObject({
  minProtocol: Type8.Integer({ minimum: 1 }),
  maxProtocol: Type8.Integer({ minimum: 1 }),
  client: closedObject({
    id: Type8.Literal(GATEWAY_CLIENT_IDS.WORKER),
    version: Type8.String({ minLength: 1, maxLength: 128 }),
    platform: Type8.String({ minLength: 1, maxLength: 128 }),
    mode: Type8.Literal(GATEWAY_CLIENT_MODES.WORKER)
  }),
  role: Type8.Literal("worker"),
  admission: WorkerConnectAdmissionSchema
});
var WorkerConnectRequestFrameSchema = closedObject({
  type: Type8.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type8.Literal("connect"),
  params: WorkerConnectParamsSchema
});
var WorkerHelloOkSchema = closedObject({
  type: Type8.Literal("worker-hello-ok"),
  environmentId: WorkerIdentifierSchema,
  sessionId: Type8.Union([WorkerIdentifierSchema, Type8.Null()]),
  ownerEpoch: Type8.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  rpcSetVersion: Type8.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
  protocolFeatures: Type8.Array(WorkerProtocolFeatureSchema, {
    maxItems: WORKER_PROTOCOL_MAX_FEATURES,
    uniqueItems: true
  }),
  credentialExpiresAtMs: Type8.Integer({ minimum: 0 }),
  policy: closedObject({
    heartbeatIntervalMs: Type8.Integer({ minimum: 1 }),
    maxPayload: Type8.Integer({ minimum: 1 })
  })
});
var WorkerAdmissionSuccessResponseFrameSchema = closedObject({
  type: Type8.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type8.Literal(true),
  payload: WorkerHelloOkSchema
});
var WorkerAdmissionResponseFrameSchema = Type8.Union([
  WorkerAdmissionSuccessResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
var WorkerStatusSchema = Type8.Union([
  Type8.Literal("ready"),
  Type8.Literal("busy"),
  Type8.Literal("draining")
]);
var WorkerHeartbeatParamsSchema = closedObject({
  sentAtMs: Type8.Integer({ minimum: 0 }),
  status: WorkerStatusSchema
});
var WorkerHeartbeatResultSchema = closedObject({
  receivedAtMs: Type8.Integer({ minimum: 0 }),
  status: Type8.Literal("ok"),
  ownerEpoch: Type8.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
});
var WorkerHeartbeatRequestFrameSchema = closedObject({
  type: Type8.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type8.Literal(WORKER_PROTOCOL_METHODS[0]),
  params: WorkerHeartbeatParamsSchema
});
var WorkerHeartbeatSuccessResponseFrameSchema = closedObject({
  type: Type8.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type8.Literal(true),
  payload: WorkerHeartbeatResultSchema
});
var WorkerHeartbeatResponseFrameSchema = Type8.Union([
  WorkerHeartbeatSuccessResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
var WorkerTranscriptTextContentSchema = closedObject({
  type: Type8.Literal("text"),
  text: Type8.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
  textSignature: Type8.Optional(
    Type8.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })
  )
});
var WorkerTranscriptThinkingContentSchema = closedObject({
  type: Type8.Literal("thinking"),
  thinking: Type8.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
  thinkingSignature: Type8.Optional(
    Type8.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })
  ),
  redacted: Type8.Optional(Type8.Boolean())
});
var WorkerTranscriptImageContentSchema = closedObject({
  type: Type8.Literal("image"),
  data: Type8.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
  mimeType: Type8.String({ minLength: 1, maxLength: 256 })
});
var WorkerTranscriptToolCallSchema = closedObject({
  type: Type8.Literal("toolCall"),
  id: WorkerIdentifierSchema,
  name: WorkerIdentifierSchema,
  arguments: Type8.Record(Type8.String({ minLength: 1, maxLength: 256 }), Type8.Unknown()),
  thoughtSignature: Type8.Optional(
    Type8.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })
  ),
  executionMode: Type8.Optional(Type8.Union([Type8.Literal("sequential"), Type8.Literal("parallel")]))
});
var WorkerTranscriptUserMessageSchema = closedObject({
  role: Type8.Literal("user"),
  content: Type8.Array(
    Type8.Union([WorkerTranscriptTextContentSchema, WorkerTranscriptImageContentSchema]),
    { minItems: 1, maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
  ),
  timestamp: Type8.Integer({ minimum: 0 })
});
var WorkerTranscriptAssistantMessageSchema = closedObject({
  role: Type8.Literal("assistant"),
  content: Type8.Array(
    Type8.Union([
      WorkerTranscriptTextContentSchema,
      WorkerTranscriptThinkingContentSchema,
      WorkerTranscriptToolCallSchema
    ]),
    { maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
  ),
  api: WorkerIdentifierSchema,
  provider: WorkerIdentifierSchema,
  model: WorkerIdentifierSchema,
  responseModel: Type8.Optional(WorkerIdentifierSchema),
  responseId: Type8.Optional(WorkerIdentifierSchema),
  diagnostics: Type8.Optional(
    Type8.Array(WorkerTranscriptAssistantDiagnosticSchema, {
      maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
    })
  ),
  usage: WorkerTranscriptUsageSchema,
  stopReason: Type8.Union([
    Type8.Literal("stop"),
    Type8.Literal("length"),
    Type8.Literal("toolUse"),
    Type8.Literal("error"),
    Type8.Literal("aborted")
  ]),
  errorMessage: Type8.Optional(Type8.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
  errorCode: Type8.Optional(Type8.String({ maxLength: 256 })),
  errorType: Type8.Optional(Type8.String({ maxLength: 256 })),
  errorBody: Type8.Optional(Type8.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
  timestamp: Type8.Integer({ minimum: 0 })
});
var WorkerTranscriptToolResultMessageSchema = closedObject({
  role: Type8.Literal("toolResult"),
  toolCallId: WorkerIdentifierSchema,
  toolName: WorkerIdentifierSchema,
  content: Type8.Array(
    Type8.Union([WorkerTranscriptTextContentSchema, WorkerTranscriptImageContentSchema]),
    { maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
  ),
  details: Type8.Optional(Type8.Unknown()),
  isError: Type8.Boolean(),
  timestamp: Type8.Integer({ minimum: 0 })
});
var WorkerTranscriptMessageSchema = Type8.Union([
  WorkerTranscriptUserMessageSchema,
  WorkerTranscriptAssistantMessageSchema,
  WorkerTranscriptToolResultMessageSchema
]);
var WorkerTranscriptCommitParamsSchema = closedObject({
  runEpoch: Type8.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  seq: Type8.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
  baseLeafId: Type8.Union([WorkerIdentifierSchema, Type8.Null()]),
  messages: Type8.Array(WorkerTranscriptMessageSchema, {
    minItems: 1,
    maxItems: WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES
  })
});
var WorkerTranscriptCommitResultSchema = closedObject({
  entryIds: Type8.Array(WorkerIdentifierSchema, {
    minItems: 1,
    maxItems: WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES
  }),
  newLeafId: WorkerIdentifierSchema
});
var WorkerTranscriptCommitErrorReasonSchema = Type8.Union([
  Type8.Literal("stale-base-leaf"),
  Type8.Literal("epoch-mismatch"),
  Type8.Literal("invalid-batch"),
  Type8.Literal("session-not-attached")
]);
var WorkerTranscriptCommitErrorShapeSchema = closedObject({
  code: Type8.Literal("INVALID_REQUEST"),
  message: Type8.String({ minLength: 1, maxLength: 256 }),
  details: closedObject({ reason: WorkerTranscriptCommitErrorReasonSchema })
});
var WorkerTranscriptCommitRequestFrameSchema = closedObject({
  type: Type8.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type8.Literal(WORKER_PROTOCOL_METHODS[1]),
  params: WorkerTranscriptCommitParamsSchema
});
var WorkerTranscriptCommitSuccessResponseFrameSchema = closedObject({
  type: Type8.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type8.Literal(true),
  payload: WorkerTranscriptCommitResultSchema
});
var WorkerTranscriptCommitErrorResponseFrameSchema = closedObject({
  type: Type8.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type8.Literal(false),
  error: WorkerTranscriptCommitErrorShapeSchema
});
var WorkerTranscriptCommitResponseFrameSchema = Type8.Union([
  WorkerTranscriptCommitSuccessResponseFrameSchema,
  WorkerTranscriptCommitErrorResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
function workerLiveObject(properties) {
  return closedObject(properties);
}
var OptionalLiveTextSchema = Type8.Optional(LiveTextSchema);
var OptionalLiveIntegerSchema = Type8.Optional(LiveIntegerSchema);
var LiveIdentifierSchema = Type8.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES,
  pattern: "^\\S(?:.*\\S)?$"
});
var WorkerLiveAssistantPayloadSchema = workerLiveObject({
  text: LiveTextSchema,
  delta: LiveTextSchema,
  replace: Type8.Optional(Type8.Literal(true)),
  mediaUrls: Type8.Optional(
    Type8.Array(LiveIdentifierSchema, {
      maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
    })
  ),
  phase: Type8.Optional(Type8.Union([Type8.Literal("commentary"), Type8.Literal("final_answer")])),
  itemId: Type8.Optional(WorkerIdentifierSchema)
});
var WorkerLiveThinkingPayloadSchema = workerLiveObject({
  text: LiveTextSchema,
  delta: LiveTextSchema
});
var WorkerLiveToolCommonProperties = {
  name: WorkerIdentifierSchema,
  toolCallId: WorkerIdentifierSchema,
  hideFromChannelProgress: Type8.Optional(Type8.Literal(true))
};
var WorkerLiveToolPayloadSchema = Type8.Union([
  workerLiveObject({
    ...WorkerLiveToolCommonProperties,
    phase: Type8.Literal("start"),
    args: Type8.Unknown()
  }),
  workerLiveObject({
    ...WorkerLiveToolCommonProperties,
    phase: Type8.Literal("update"),
    partialResult: Type8.Unknown()
  }),
  workerLiveObject({
    ...WorkerLiveToolCommonProperties,
    phase: Type8.Literal("result"),
    meta: OptionalLiveTextSchema,
    isError: Type8.Boolean(),
    result: Type8.Unknown(),
    toolErrorSummary: OptionalLiveTextSchema
  })
]);
var WorkerLiveApprovalCommonProperties = {
  kind: Type8.Union([Type8.Literal("exec"), Type8.Literal("plugin"), Type8.Literal("unknown")]),
  title: LiveTextSchema,
  itemId: Type8.Optional(WorkerIdentifierSchema),
  toolCallId: Type8.Optional(WorkerIdentifierSchema),
  approvalId: Type8.Optional(WorkerIdentifierSchema),
  approvalSlug: Type8.Optional(WorkerIdentifierSchema),
  command: OptionalLiveTextSchema,
  host: OptionalLiveTextSchema,
  reason: OptionalLiveTextSchema,
  scope: Type8.Optional(Type8.Union([Type8.Literal("turn"), Type8.Literal("session")])),
  message: OptionalLiveTextSchema
};
var WorkerLiveApprovalPayloadSchema = Type8.Union([
  workerLiveObject({
    ...WorkerLiveApprovalCommonProperties,
    phase: Type8.Literal("requested"),
    status: Type8.Union([Type8.Literal("pending"), Type8.Literal("unavailable")])
  }),
  workerLiveObject({
    ...WorkerLiveApprovalCommonProperties,
    phase: Type8.Literal("resolved"),
    status: Type8.Union([Type8.Literal("approved"), Type8.Literal("denied"), Type8.Literal("failed")])
  })
]);
var WorkerLiveLifecycleStartPayloadSchema = workerLiveObject({
  phase: Type8.Literal("start"),
  startedAt: LiveIntegerSchema
});
var WorkerLiveFallbackReasonSchema = Type8.Union([
  Type8.Literal("auth"),
  Type8.Literal("auth_permanent"),
  Type8.Literal("format"),
  Type8.Literal("rate_limit"),
  Type8.Literal("overloaded"),
  Type8.Literal("billing"),
  Type8.Literal("server_error"),
  Type8.Literal("timeout"),
  Type8.Literal("context_overflow"),
  Type8.Literal("model_not_found"),
  Type8.Literal("session_expired"),
  Type8.Literal("empty_response"),
  Type8.Literal("no_error_details"),
  Type8.Literal("unclassified"),
  Type8.Literal("unknown")
]);
var WorkerLiveFallbackAttemptSchema = workerLiveObject({
  provider: LiveIdentifierSchema,
  model: LiveIdentifierSchema,
  error: LiveTextSchema,
  reason: Type8.Optional(WorkerLiveFallbackReasonSchema),
  authMode: Type8.Optional(LiveIdentifierSchema),
  status: OptionalLiveIntegerSchema,
  code: Type8.Optional(Type8.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }))
});
var WorkerLiveFallbackCommonProperties = {
  selectedProvider: LiveIdentifierSchema,
  selectedModel: LiveIdentifierSchema,
  activeProvider: LiveIdentifierSchema,
  activeModel: LiveIdentifierSchema
};
var WorkerLiveLifecycleFallbackPayloadSchema = workerLiveObject({
  ...WorkerLiveFallbackCommonProperties,
  phase: Type8.Literal("fallback"),
  reasonSummary: LiveTextSchema,
  attemptSummaries: Type8.Array(LiveTextSchema, {
    maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
  }),
  attempts: Type8.Array(WorkerLiveFallbackAttemptSchema, {
    maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
  })
});
var WorkerLiveLifecycleFallbackClearedPayloadSchema = workerLiveObject({
  ...WorkerLiveFallbackCommonProperties,
  phase: Type8.Literal("fallback_cleared"),
  previousActiveModel: Type8.Optional(LiveIdentifierSchema)
});
var WorkerLiveLifecycleFallbackStepPayloadSchema = workerLiveObject({
  phase: Type8.Literal("fallback_step"),
  fallbackStepType: Type8.Literal("fallback_step"),
  fallbackStepFromModel: LiveIdentifierSchema,
  fallbackStepToModel: Type8.Optional(LiveIdentifierSchema),
  fallbackStepFromFailureReason: Type8.Optional(WorkerLiveFallbackReasonSchema),
  fallbackStepFromFailureDetail: OptionalLiveTextSchema,
  fallbackStepChainPosition: OptionalLiveIntegerSchema,
  fallbackStepFinalOutcome: Type8.Union([
    Type8.Literal("next_fallback"),
    Type8.Literal("succeeded"),
    Type8.Literal("chain_exhausted")
  ])
});
var WorkerLiveLifecycleTerminalCommonProperties = {
  startedAt: OptionalLiveIntegerSchema,
  endedAt: LiveIntegerSchema,
  stopReason: Type8.Optional(WorkerIdentifierSchema),
  yielded: Type8.Optional(Type8.Literal(true)),
  timeoutPhase: Type8.Optional(
    Type8.Union([
      Type8.Literal("queue"),
      Type8.Literal("preflight"),
      Type8.Literal("provider"),
      Type8.Literal("post_turn"),
      Type8.Literal("gateway_draining")
    ])
  ),
  providerStarted: Type8.Optional(Type8.Boolean()),
  aborted: Type8.Optional(Type8.Boolean()),
  toolErrorSummary: OptionalLiveTextSchema,
  livenessState: Type8.Optional(
    Type8.Union([
      Type8.Literal("working"),
      Type8.Literal("paused"),
      Type8.Literal("blocked"),
      Type8.Literal("abandoned")
    ])
  ),
  replayInvalid: Type8.Optional(Type8.Literal(true))
};
var WorkerLiveLifecycleTerminalPayloadSchema = Type8.Union([
  workerLiveObject({
    ...WorkerLiveLifecycleTerminalCommonProperties,
    phase: Type8.Literal("finishing"),
    error: OptionalLiveTextSchema
  }),
  workerLiveObject({
    ...WorkerLiveLifecycleTerminalCommonProperties,
    phase: Type8.Literal("end")
  }),
  workerLiveObject({
    ...WorkerLiveLifecycleTerminalCommonProperties,
    phase: Type8.Literal("error"),
    error: LiveTextSchema,
    fallbackExhaustedFailure: Type8.Optional(Type8.Literal(true))
  })
]);
var WorkerLiveLifecyclePayloadSchema = Type8.Union([
  WorkerLiveLifecycleStartPayloadSchema,
  WorkerLiveLifecycleFallbackPayloadSchema,
  WorkerLiveLifecycleFallbackClearedPayloadSchema,
  WorkerLiveLifecycleFallbackStepPayloadSchema,
  WorkerLiveLifecycleTerminalPayloadSchema
]);
var WorkerLiveEventSchema = Type8.Union([
  workerLiveObject({ kind: Type8.Literal("assistant"), payload: WorkerLiveAssistantPayloadSchema }),
  workerLiveObject({ kind: Type8.Literal("thinking"), payload: WorkerLiveThinkingPayloadSchema }),
  workerLiveObject({ kind: Type8.Literal("tool"), payload: WorkerLiveToolPayloadSchema }),
  workerLiveObject({ kind: Type8.Literal("approval"), payload: WorkerLiveApprovalPayloadSchema }),
  workerLiveObject({ kind: Type8.Literal("lifecycle"), payload: WorkerLiveLifecyclePayloadSchema })
]);
var WorkerLiveEventParamsSchema = workerLiveObject({
  runEpoch: LiveIntegerSchema,
  lastAckedSeq: LiveIntegerSchema,
  seq: LiveSequenceSchema,
  runId: WorkerIdentifierSchema,
  event: WorkerLiveEventSchema
});
var WorkerLiveEventResultSchema = workerLiveObject({
  ackedSeq: LiveIntegerSchema
});
var WorkerLiveEventErrorDetailsSchema = Type8.Union([
  workerLiveObject({
    reason: Type8.Union([
      Type8.Literal("epoch-mismatch"),
      Type8.Literal("session-not-attached"),
      Type8.Literal("invalid-event"),
      Type8.Literal("capacity-exceeded")
    ])
  }),
  workerLiveObject({
    reason: Type8.Literal("resync-required"),
    ackedSeq: LiveIntegerSchema,
    expectedSeq: LiveSequenceSchema
  })
]);
var WorkerLiveEventErrorShapeSchema = workerLiveObject({
  code: Type8.Literal("INVALID_REQUEST"),
  message: Type8.String({ minLength: 1, maxLength: 256 }),
  details: WorkerLiveEventErrorDetailsSchema
});
var WorkerLiveEventRequestFrameSchema = workerLiveObject({
  type: Type8.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type8.Literal(WORKER_PROTOCOL_METHODS[2]),
  params: WorkerLiveEventParamsSchema
});
var WorkerLiveEventSuccessResponseFrameSchema = workerLiveObject({
  type: Type8.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type8.Literal(true),
  payload: WorkerLiveEventResultSchema
});
var WorkerLiveEventErrorResponseFrameSchema = workerLiveObject({
  type: Type8.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type8.Literal(false),
  error: WorkerLiveEventErrorShapeSchema
});
var WorkerLiveEventResponseFrameSchema = Type8.Union([
  WorkerLiveEventSuccessResponseFrameSchema,
  WorkerLiveEventErrorResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);

// packages/gateway-protocol/src/schema/worker-inference.ts
var WORKER_INFERENCE_PROTOCOL_FEATURE = "worker-inference-v1";
var WORKER_INFERENCE_METHODS = [
  "worker.inference.start",
  "worker.inference.cancel"
];
var WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES = 25 * 1024 * 1024;
var WORKER_INFERENCE_MAX_CONTEXT_MESSAGES = 1024;
var WORKER_INFERENCE_MAX_TOOLS = 256;
var WORKER_INFERENCE_MAX_OUTPUT_TOKENS = 1e6;
function workerInferenceObject(properties) {
  return closedObject(properties);
}
var InferenceTextSchema = Type9.String({
  maxLength: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES
});
var OptionalInferenceTextSchema = Type9.Optional(InferenceTextSchema);
var WorkerInferenceTextContentSchema = workerInferenceObject({
  type: Type9.Literal("text"),
  text: InferenceTextSchema,
  textSignature: OptionalInferenceTextSchema
});
var WorkerInferenceImageContentSchema = workerInferenceObject({
  type: Type9.Literal("image"),
  data: Type9.String({
    minLength: 1,
    maxLength: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES
  }),
  mimeType: Type9.String({ minLength: 1, maxLength: 256 })
});
var WorkerInferenceThinkingContentSchema = workerInferenceObject({
  type: Type9.Literal("thinking"),
  thinking: InferenceTextSchema,
  thinkingSignature: OptionalInferenceTextSchema,
  redacted: Type9.Optional(Type9.Boolean())
});
var WorkerInferenceToolCallSchema = workerInferenceObject({
  type: Type9.Literal("toolCall"),
  id: WorkerIdentifierSchema,
  name: WorkerIdentifierSchema,
  arguments: Type9.Record(Type9.String({ minLength: 1, maxLength: 256 }), Type9.Unknown()),
  thoughtSignature: OptionalInferenceTextSchema,
  executionMode: Type9.Optional(Type9.Union([Type9.Literal("sequential"), Type9.Literal("parallel")]))
});
var WorkerInferenceUserMessageSchema = workerInferenceObject({
  role: Type9.Literal("user"),
  content: Type9.Union([
    InferenceTextSchema,
    Type9.Array(Type9.Union([WorkerInferenceTextContentSchema, WorkerInferenceImageContentSchema]), {
      minItems: 1,
      maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
    })
  ]),
  timestamp: LiveIntegerSchema,
  runtimeContextCarrier: Type9.Optional(Type9.Boolean())
});
var WorkerInferenceAssistantMessageProperties = {
  role: Type9.Literal("assistant"),
  content: Type9.Array(
    Type9.Union([
      WorkerInferenceTextContentSchema,
      WorkerInferenceThinkingContentSchema,
      WorkerInferenceToolCallSchema
    ]),
    { maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
  ),
  api: WorkerIdentifierSchema,
  provider: WorkerIdentifierSchema,
  model: WorkerIdentifierSchema,
  responseModel: Type9.Optional(WorkerIdentifierSchema),
  responseId: Type9.Optional(WorkerIdentifierSchema),
  usage: WorkerTranscriptUsageSchema,
  timestamp: LiveIntegerSchema
};
var WorkerInferenceAssistantMessageSchema = workerInferenceObject({
  ...WorkerInferenceAssistantMessageProperties,
  stopReason: Type9.Union([Type9.Literal("stop"), Type9.Literal("length"), Type9.Literal("toolUse")])
});
var WorkerInferenceContextAssistantMessageSchema = workerInferenceObject({
  ...WorkerInferenceAssistantMessageProperties,
  diagnostics: Type9.Optional(
    Type9.Array(WorkerTranscriptAssistantDiagnosticSchema, {
      maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
    })
  ),
  stopReason: Type9.Union([
    Type9.Literal("stop"),
    Type9.Literal("length"),
    Type9.Literal("toolUse"),
    Type9.Literal("error"),
    Type9.Literal("aborted")
  ]),
  errorMessage: OptionalInferenceTextSchema,
  errorCode: Type9.Optional(Type9.String({ maxLength: 256 })),
  errorType: Type9.Optional(Type9.String({ maxLength: 256 })),
  errorBody: OptionalInferenceTextSchema
});
var WorkerInferenceMessageSchema = Type9.Union([
  WorkerInferenceUserMessageSchema,
  WorkerInferenceContextAssistantMessageSchema,
  workerInferenceObject({
    role: Type9.Literal("toolResult"),
    toolCallId: WorkerIdentifierSchema,
    toolName: WorkerIdentifierSchema,
    content: Type9.Array(
      Type9.Union([WorkerInferenceTextContentSchema, WorkerInferenceImageContentSchema]),
      { maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
    ),
    details: Type9.Optional(Type9.Unknown()),
    isError: Type9.Boolean(),
    timestamp: LiveIntegerSchema
  })
]);
var WorkerInferenceToolSchema = workerInferenceObject({
  name: WorkerIdentifierSchema,
  description: LiveTextSchema,
  parameters: Type9.Unknown()
});
var WorkerInferenceModelRefSchema = workerInferenceObject({
  provider: WorkerIdentifierSchema,
  model: WorkerIdentifierSchema
});
var WorkerInferenceContextSchema = workerInferenceObject({
  systemPrompt: Type9.Optional(InferenceTextSchema),
  messages: Type9.Array(WorkerInferenceMessageSchema, {
    maxItems: WORKER_INFERENCE_MAX_CONTEXT_MESSAGES
  }),
  tools: Type9.Optional(
    Type9.Array(WorkerInferenceToolSchema, { maxItems: WORKER_INFERENCE_MAX_TOOLS })
  )
});
var WorkerInferenceReasoningSchema = Type9.Union([
  Type9.Literal("off"),
  Type9.Literal("minimal"),
  Type9.Literal("low"),
  Type9.Literal("medium"),
  Type9.Literal("high"),
  Type9.Literal("xhigh"),
  Type9.Literal("adaptive"),
  Type9.Literal("max")
]);
var WorkerInferenceThinkingBudgetSchema = Type9.Integer({
  minimum: 0,
  maximum: WORKER_INFERENCE_MAX_OUTPUT_TOKENS
});
var WorkerInferenceThinkingBudgetsSchema = workerInferenceObject({
  minimal: Type9.Optional(WorkerInferenceThinkingBudgetSchema),
  low: Type9.Optional(WorkerInferenceThinkingBudgetSchema),
  medium: Type9.Optional(WorkerInferenceThinkingBudgetSchema),
  high: Type9.Optional(WorkerInferenceThinkingBudgetSchema),
  max: Type9.Optional(WorkerInferenceThinkingBudgetSchema)
});
var WorkerInferenceOptionsSchema = workerInferenceObject({
  temperature: Type9.Optional(Type9.Number({ minimum: 0, maximum: 2 })),
  maxTokens: Type9.Optional(
    Type9.Integer({ minimum: 1, maximum: WORKER_INFERENCE_MAX_OUTPUT_TOKENS })
  ),
  reasoning: Type9.Optional(WorkerInferenceReasoningSchema),
  thinkingBudgets: Type9.Optional(WorkerInferenceThinkingBudgetsSchema)
});
var WorkerInferenceIdentityProperties = {
  runEpoch: LiveIntegerSchema,
  sessionId: WorkerIdentifierSchema,
  runId: WorkerIdentifierSchema,
  turnId: WorkerIdentifierSchema
};
var WorkerInferenceStartParamsSchema = workerInferenceObject({
  ...WorkerInferenceIdentityProperties,
  modelRef: WorkerInferenceModelRefSchema,
  context: WorkerInferenceContextSchema,
  options: WorkerInferenceOptionsSchema
});
var WorkerInferenceStartResultSchema = workerInferenceObject({
  status: Type9.Union([Type9.Literal("accepted"), Type9.Literal("replayed")])
});
var WorkerInferenceErrorReasonSchema = Type9.Union([
  Type9.Literal("model-not-approved"),
  Type9.Literal("invalid-context"),
  Type9.Literal("epoch-mismatch"),
  Type9.Literal("session-not-attached"),
  Type9.Literal("provider-error"),
  Type9.Literal("cancelled")
]);
var WorkerInferenceErrorShapeSchema = workerInferenceObject({
  code: Type9.Union([Type9.Literal("INVALID_REQUEST"), Type9.Literal("UNAVAILABLE")]),
  message: Type9.String({ minLength: 1, maxLength: 256 }),
  details: workerInferenceObject({ reason: WorkerInferenceErrorReasonSchema })
});
var WorkerInferenceStartRequestFrameSchema = workerInferenceObject({
  type: Type9.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type9.Literal(WORKER_INFERENCE_METHODS[0]),
  params: WorkerInferenceStartParamsSchema
});
var WorkerInferenceStartSuccessResponseFrameSchema = workerInferenceObject({
  type: Type9.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type9.Literal(true),
  payload: WorkerInferenceStartResultSchema
});
var WorkerInferenceErrorResponseFrameSchema = workerInferenceObject({
  type: Type9.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type9.Literal(false),
  error: WorkerInferenceErrorShapeSchema
});
var WorkerInferenceStartResponseFrameSchema = Type9.Union([
  WorkerInferenceStartSuccessResponseFrameSchema,
  WorkerInferenceErrorResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
var WorkerInferenceCancelParamsSchema = workerInferenceObject({
  ...WorkerInferenceIdentityProperties
});
var WorkerInferenceCancelResultSchema = workerInferenceObject({
  status: Type9.Literal("cancelled")
});
var WorkerInferenceCancelRequestFrameSchema = workerInferenceObject({
  type: Type9.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type9.Literal(WORKER_INFERENCE_METHODS[1]),
  params: WorkerInferenceCancelParamsSchema
});
var WorkerInferenceCancelSuccessResponseFrameSchema = workerInferenceObject({
  type: Type9.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type9.Literal(true),
  payload: WorkerInferenceCancelResultSchema
});
var WorkerInferenceCancelResponseFrameSchema = Type9.Union([
  WorkerInferenceCancelSuccessResponseFrameSchema,
  WorkerInferenceErrorResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
var WorkerInferenceResolvedModelSchema = workerInferenceObject({
  api: WorkerIdentifierSchema,
  provider: WorkerIdentifierSchema,
  model: WorkerIdentifierSchema
});
var WorkerInferenceStreamEventSchema = Type9.Union([
  workerInferenceObject({
    type: Type9.Literal("start"),
    resolvedModel: WorkerInferenceResolvedModelSchema,
    timestamp: LiveIntegerSchema
  }),
  workerInferenceObject({
    type: Type9.Literal("text_start"),
    contentIndex: LiveIntegerSchema,
    contentSignature: OptionalInferenceTextSchema
  }),
  workerInferenceObject({
    type: Type9.Literal("text_delta"),
    contentIndex: LiveIntegerSchema,
    delta: InferenceTextSchema
  }),
  workerInferenceObject({
    type: Type9.Literal("text_end"),
    contentIndex: LiveIntegerSchema,
    contentSignature: OptionalInferenceTextSchema
  }),
  workerInferenceObject({ type: Type9.Literal("thinking_start"), contentIndex: LiveIntegerSchema }),
  workerInferenceObject({
    type: Type9.Literal("thinking_delta"),
    contentIndex: LiveIntegerSchema,
    delta: InferenceTextSchema
  }),
  workerInferenceObject({
    type: Type9.Literal("thinking_end"),
    contentIndex: LiveIntegerSchema,
    contentSignature: OptionalInferenceTextSchema
  }),
  workerInferenceObject({
    type: Type9.Literal("toolcall_start"),
    contentIndex: LiveIntegerSchema,
    id: WorkerIdentifierSchema,
    toolName: WorkerIdentifierSchema
  }),
  workerInferenceObject({
    type: Type9.Literal("toolcall_delta"),
    contentIndex: LiveIntegerSchema,
    delta: InferenceTextSchema
  }),
  workerInferenceObject({ type: Type9.Literal("toolcall_end"), contentIndex: LiveIntegerSchema })
]);
var WorkerInferenceEventParamsSchema = workerInferenceObject({
  ...WorkerInferenceIdentityProperties,
  seq: LiveSequenceSchema,
  event: WorkerInferenceStreamEventSchema
});
var WorkerInferenceEventFrameSchema = workerInferenceObject({
  type: Type9.Literal("event"),
  event: Type9.Literal("worker.inference.event"),
  payload: WorkerInferenceEventParamsSchema
});
var WorkerInferenceTerminalDoneSchema = workerInferenceObject({
  type: Type9.Literal("done"),
  message: WorkerInferenceAssistantMessageSchema
});
var WorkerInferenceTerminalErrorSchema = workerInferenceObject({
  type: Type9.Literal("error"),
  reason: WorkerInferenceErrorReasonSchema,
  message: Type9.String({ minLength: 1, maxLength: 256 }),
  usage: Type9.Optional(WorkerTranscriptUsageSchema)
});
var WorkerInferenceTerminalOutcomeSchema = Type9.Union([
  WorkerInferenceTerminalDoneSchema,
  WorkerInferenceTerminalErrorSchema
]);
var WorkerInferenceTerminalParamsSchema = workerInferenceObject({
  ...WorkerInferenceIdentityProperties,
  seq: LiveSequenceSchema,
  outcome: WorkerInferenceTerminalOutcomeSchema
});
var WorkerInferenceTerminalFrameSchema = workerInferenceObject({
  type: Type9.Literal("event"),
  event: Type9.Literal("worker.inference.terminal"),
  payload: WorkerInferenceTerminalParamsSchema
});
function isSafeWorkerInferenceJson(data) {
  const stack = [{ depth: 0, value: data }];
  const seen = /* @__PURE__ */ new WeakSet();
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || current.depth > WORKER_TRANSCRIPT_MAX_JSON_DEPTH) {
      return false;
    }
    if (current.value === null || typeof current.value === "string" || typeof current.value === "boolean") {
      continue;
    }
    if (typeof current.value === "number") {
      if (!Number.isFinite(current.value)) {
        return false;
      }
      continue;
    }
    if (typeof current.value !== "object" || seen.has(current.value)) {
      return false;
    }
    seen.add(current.value);
    const values = Array.isArray(current.value) ? current.value : Object.values(current.value);
    for (const value of values) {
      stack.push({ depth: current.depth + 1, value });
    }
  }
  return true;
}
function validateWorkerInferenceStartParams(data) {
  return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceStartParamsSchema, data);
}
function validateWorkerInferenceCancelParams(data) {
  return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceCancelParamsSchema, data);
}
function validateWorkerInferenceTerminalOutcome(data) {
  return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceTerminalOutcomeSchema, data);
}
function validateWorkerInferenceEventFrame(data) {
  return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceEventFrameSchema, data);
}
function validateWorkerInferenceTerminalFrame(data) {
  return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceTerminalFrameSchema, data);
}

// packages/gateway-protocol/src/schema/skill-history.ts
import { Type as Type10 } from "typebox";
var SkillsProposalHistoryStatusParamsSchema = Type10.Object(
  { agentId: Type10.Optional(NonEmptyString) },
  { additionalProperties: false }
);
var SkillsProposalHistoryScanParamsSchema = Type10.Object(
  {
    agentId: Type10.Optional(NonEmptyString),
    direction: Type10.Optional(Type10.Union([Type10.Literal("older"), Type10.Literal("newer")]))
  },
  { additionalProperties: false }
);
var SkillsProposalHistoryScanResultSchema = Type10.Object(
  {
    schema: Type10.Literal("openclaw.skill-workshop.history-scan.v1"),
    hasScanned: Type10.Boolean(),
    reviewedSessions: Type10.Integer({ minimum: 0 }),
    ideasFound: Type10.Integer({ minimum: 0 }),
    hasMore: Type10.Boolean(),
    lastScanReviewed: Type10.Integer({ minimum: 0 }),
    lastScanIdeas: Type10.Integer({ minimum: 0 }),
    lastScanAt: Type10.Optional(NonEmptyString),
    oldestReviewedAt: Type10.Optional(NonEmptyString),
    newestReviewedAt: Type10.Optional(NonEmptyString)
  },
  { additionalProperties: false }
);
var validateSkillsProposalHistoryStatusParams = lazyCompile(
  SkillsProposalHistoryStatusParamsSchema
);
var validateSkillsProposalHistoryScanParams = lazyCompile(
  SkillsProposalHistoryScanParamsSchema
);

// packages/gateway-protocol/src/schema/ui-command.ts
import { Type as Type11 } from "typebox";
var UiSplitCommandSchema = closedObject({
  kind: Type11.Literal("split"),
  direction: Type11.Union([Type11.Literal("right"), Type11.Literal("down")]),
  sessionKey: NonEmptyString
});
var UiClosePaneCommandSchema = closedObject({
  kind: Type11.Literal("close-pane"),
  sessionKey: NonEmptyString
});
var UiFocusCommandSchema = closedObject({
  kind: Type11.Literal("focus"),
  sessionKey: NonEmptyString
});
var UiSidebarCommandSchema = closedObject({
  kind: Type11.Literal("sidebar"),
  visible: Type11.Boolean()
});
var UiPanelCommandSchema = closedObject({
  kind: Type11.Literal("panel"),
  panel: Type11.Union([Type11.Literal("terminal"), Type11.Literal("browser")]),
  open: Type11.Boolean(),
  dock: Type11.Optional(Type11.Union([Type11.Literal("bottom"), Type11.Literal("right")])),
  terminalSessionId: Type11.Optional(NonEmptyString)
});
var UiNavigateCommandSchema = closedObject({
  kind: Type11.Literal("navigate"),
  sessionKey: NonEmptyString
});
var UiCommandSchema = Type11.Union([
  UiSplitCommandSchema,
  UiClosePaneCommandSchema,
  UiFocusCommandSchema,
  UiSidebarCommandSchema,
  UiPanelCommandSchema,
  UiNavigateCommandSchema
]);
var UiCommandParamsSchema = closedObject({
  command: UiCommandSchema,
  sessionKey: Type11.Optional(NonEmptyString)
});
var UiCommandResultSchema = closedObject({ ok: Type11.Boolean() });

// packages/gateway-protocol/src/schema/board.ts
import { Type as Type12 } from "typebox";
var BoardTabIdSchema = Type12.String({ pattern: "^[a-z0-9-]{1,40}$" });
var BoardWidgetNameSchema = Type12.String({
  pattern: "^[a-z0-9][a-z0-9._-]{0,63}$"
});
var BoardChatDockSchema = Type12.Union([
  Type12.Literal("left"),
  Type12.Literal("right"),
  Type12.Literal("bottom"),
  Type12.Literal("hidden")
]);
var BoardSizeSchema = Type12.Union([
  Type12.Literal("sm"),
  Type12.Literal("md"),
  Type12.Literal("lg"),
  Type12.Literal("xl"),
  Type12.Literal("full")
]);
var BOARD_CRON_JOB_ID_MAX_LENGTH = 256;
var BOARD_CRON_TRIGGER_PREFIX = "cron.trigger:";
var BOARD_WIDGET_TOOL_MAX_LENGTH = BOARD_CRON_TRIGGER_PREFIX.length + BOARD_CRON_JOB_ID_MAX_LENGTH;
var BoardTabSchema = closedObject({
  tabId: BoardTabIdSchema,
  title: Type12.String({ minLength: 1, maxLength: 80 }),
  position: Type12.Integer({ minimum: 0 }),
  chatDock: BoardChatDockSchema
});
var BoardWidgetDeclaredSchema = closedObject({
  netOrigins: Type12.Optional(
    Type12.Array(Type12.String({ minLength: 1, maxLength: 2048 }), { maxItems: 32 })
  ),
  tools: Type12.Optional(
    Type12.Array(Type12.String({ minLength: 1, maxLength: BOARD_WIDGET_TOOL_MAX_LENGTH }), {
      maxItems: 64
    })
  )
});
var BoardWidgetSchema = closedObject({
  name: BoardWidgetNameSchema,
  tabId: BoardTabIdSchema,
  title: Type12.Optional(Type12.String({ minLength: 1, maxLength: 80 })),
  contentKind: Type12.Union([Type12.Literal("html"), Type12.Literal("mcp-app")]),
  sizeW: Type12.Integer({ minimum: 1, maximum: 12 }),
  sizeH: Type12.Integer({ minimum: 1, maximum: 20 }),
  position: Type12.Integer({ minimum: 0 }),
  grantState: Type12.Union([
    Type12.Literal("none"),
    Type12.Literal("pending"),
    Type12.Literal("granted"),
    Type12.Literal("rejected")
  ]),
  revision: Type12.Integer({ minimum: 1 }),
  instanceId: Type12.Optional(NonEmptyString),
  declaredSummary: Type12.Optional(Type12.Array(Type12.String())),
  declared: Type12.Optional(BoardWidgetDeclaredSchema),
  frameUrl: Type12.Optional(Type12.String()),
  viewTicket: Type12.Optional(Type12.String()),
  viewTicketTtlMs: Type12.Optional(Type12.Integer({ minimum: 1 })),
  viewGeneration: Type12.Optional(Type12.String({ pattern: "^[a-f0-9]{32}$" })),
  sandboxUrl: Type12.Optional(Type12.String()),
  sandboxPort: Type12.Optional(Type12.Integer({ minimum: 1, maximum: 65535 })),
  sandboxOrigin: Type12.Optional(Type12.String())
});
var BoardSnapshotSchema = closedObject({
  sessionKey: NonEmptyString,
  revision: Type12.Integer({ minimum: 0 }),
  tabs: Type12.Array(BoardTabSchema),
  widgets: Type12.Array(BoardWidgetSchema)
});
var BoardTabCreateOpSchema = closedObject({
  kind: Type12.Literal("tab_create"),
  tabId: BoardTabIdSchema,
  title: Type12.String({ minLength: 1, maxLength: 80 }),
  chatDock: Type12.Optional(BoardChatDockSchema)
});
var BoardTabUpdateOpSchema = closedObject({
  kind: Type12.Literal("tab_update"),
  tabId: BoardTabIdSchema,
  title: Type12.Optional(Type12.String({ minLength: 1, maxLength: 80 })),
  chatDock: Type12.Optional(BoardChatDockSchema),
  position: Type12.Optional(Type12.Integer({ minimum: 0 }))
});
var BoardTabDeleteOpSchema = closedObject({
  kind: Type12.Literal("tab_delete"),
  tabId: BoardTabIdSchema
});
var BoardTabsReorderOpSchema = closedObject({
  kind: Type12.Literal("tabs_reorder"),
  tabIds: Type12.Array(BoardTabIdSchema)
});
var BoardWidgetMoveOpSchema = closedObject({
  kind: Type12.Literal("widget_move"),
  name: BoardWidgetNameSchema,
  tabId: Type12.Optional(BoardTabIdSchema),
  position: Type12.Optional(Type12.Integer({ minimum: 0 })),
  after: Type12.Optional(BoardWidgetNameSchema)
});
var BoardWidgetResizeOpSchema = closedObject({
  kind: Type12.Literal("widget_resize"),
  name: BoardWidgetNameSchema,
  sizeW: Type12.Integer(),
  sizeH: Type12.Integer()
});
var BoardWidgetRemoveOpSchema = closedObject({
  kind: Type12.Literal("widget_remove"),
  name: BoardWidgetNameSchema
});
var BoardOpSchema = Type12.Union([
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
  ops: Type12.Array(BoardOpSchema)
});
var BoardMcpAppDescriptorSchema = closedObject({
  serverName: NonEmptyString,
  toolName: NonEmptyString,
  uiResourceUri: NonEmptyString,
  toolCallId: NonEmptyString
});
var BoardWidgetHtmlContentSchema = closedObject({
  kind: Type12.Literal("html"),
  html: Type12.String({ maxLength: 262144 })
});
var BoardWidgetMcpAppContentSchema = closedObject({
  kind: Type12.Literal("mcp-app"),
  descriptor: BoardMcpAppDescriptorSchema
});
var BoardWidgetMcpAppPutContentSchema = closedObject({
  kind: Type12.Literal("mcp-app"),
  viewId: NonEmptyString
});
var BoardWidgetContentSchema = Type12.Union([
  BoardWidgetHtmlContentSchema,
  BoardWidgetMcpAppContentSchema
]);
var BoardCanvasDocumentSourceSchema = closedObject({
  kind: Type12.Literal("canvas-doc"),
  docId: NonEmptyString
});
var BoardWidgetPutContentSchema = Type12.Union([
  BoardWidgetHtmlContentSchema,
  BoardWidgetMcpAppPutContentSchema,
  BoardCanvasDocumentSourceSchema
]);
var BoardWidgetPutParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  name: BoardWidgetNameSchema,
  title: Type12.Optional(Type12.String({ minLength: 1, maxLength: 80 })),
  content: BoardWidgetPutContentSchema,
  placement: Type12.Optional(
    closedObject({
      tabId: Type12.Optional(BoardTabIdSchema),
      size: Type12.Optional(BoardSizeSchema),
      after: Type12.Optional(BoardWidgetNameSchema)
    })
  ),
  declared: Type12.Optional(BoardWidgetDeclaredSchema)
});
var BoardWidgetGrantParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  name: BoardWidgetNameSchema,
  decision: Type12.Union([Type12.Literal("granted"), Type12.Literal("rejected")]),
  revision: Type12.Integer({ minimum: 1 }),
  instanceId: NonEmptyString
});
var BoardWidgetAppViewParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  name: BoardWidgetNameSchema,
  revision: Type12.Integer({ minimum: 1 }),
  instanceId: NonEmptyString
});
var BoardWidgetAppViewResultSchema = closedObject({
  viewId: NonEmptyString,
  expiresAtMs: Type12.Integer({ minimum: 0 })
});
var BoardViewTicketSchema = Type12.String({ minLength: 1, maxLength: 2048 });
var BoardLegacyEventParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  widget: BoardWidgetNameSchema,
  payload: Type12.Unknown()
});
var BoardTicketEventParamsSchema = closedObject({
  ticket: BoardViewTicketSchema,
  payload: Type12.Unknown()
});
var BoardEventParamsSchema = Type12.Union([
  BoardLegacyEventParamsSchema,
  BoardTicketEventParamsSchema
]);
var BoardPromptAuthorizeParamsSchema = closedObject({
  ticket: BoardViewTicketSchema
});
var BoardDataReadParamsSchema = closedObject({
  ticket: BoardViewTicketSchema,
  bindingId: Type12.String({ minLength: 1, maxLength: 64 }),
  params: Type12.Optional(
    Type12.Record(Type12.String({ minLength: 1, maxLength: 80 }), Type12.Unknown(), {
      maxProperties: 64
    })
  )
});
var BoardActionParamsSchema = closedObject({
  ticket: BoardViewTicketSchema,
  action: Type12.Literal("cron.trigger"),
  jobId: Type12.String({ minLength: 1, maxLength: BOARD_CRON_JOB_ID_MAX_LENGTH })
});
var BoardChangedEventSchema = closedObject({
  sessionKey: NonEmptyString,
  revision: Type12.Integer({ minimum: 0 }),
  widget: Type12.Optional(BoardWidgetNameSchema)
});
var BoardFocusTabCommandSchema = closedObject({
  kind: Type12.Literal("focus_tab"),
  tabId: BoardTabIdSchema
});
var BoardSetChatDockCommandSchema = closedObject({
  kind: Type12.Literal("set_chat_dock"),
  dock: BoardChatDockSchema
});
var BoardCommandSchema = Type12.Union([
  BoardFocusTabCommandSchema,
  BoardSetChatDockCommandSchema
]);
var BoardCommandEventSchema = closedObject({
  sessionKey: NonEmptyString,
  command: BoardCommandSchema
});

// packages/gateway-protocol/src/schema/migrations.ts
import { Type as Type13 } from "typebox";
var MAX_MEMORY_MIGRATION_ITEMS = 2e3;
var MemoryMigrationPlanFingerprintSchema = Type13.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var MemoryMigrationItemStatusSchema = Type13.Union([
  Type13.Literal("planned"),
  Type13.Literal("migrated"),
  Type13.Literal("skipped"),
  Type13.Literal("warning"),
  Type13.Literal("conflict"),
  Type13.Literal("error")
]);
var MemoryMigrationItemSchema = Type13.Object(
  {
    id: NonEmptyString,
    status: MemoryMigrationItemStatusSchema,
    source: Type13.Optional(NonEmptyString),
    target: Type13.Optional(NonEmptyString),
    message: Type13.Optional(Type13.String()),
    reason: Type13.Optional(Type13.String()),
    details: Type13.Optional(Type13.Record(Type13.String(), Type13.Unknown()))
  },
  { additionalProperties: false }
);
var MemoryMigrationSummarySchema = Type13.Object(
  {
    total: Type13.Integer({ minimum: 0 }),
    planned: Type13.Integer({ minimum: 0 }),
    migrated: Type13.Integer({ minimum: 0 }),
    skipped: Type13.Integer({ minimum: 0 }),
    conflicts: Type13.Integer({ minimum: 0 }),
    errors: Type13.Integer({ minimum: 0 }),
    sensitive: Type13.Integer({ minimum: 0 })
  },
  { additionalProperties: false }
);
var MemoryMigrationProviderPlanSchema = Type13.Object(
  {
    providerId: NonEmptyString,
    label: NonEmptyString,
    description: Type13.Optional(Type13.String()),
    planFingerprint: Type13.Optional(MemoryMigrationPlanFingerprintSchema),
    found: Type13.Boolean(),
    source: Type13.Optional(NonEmptyString),
    target: Type13.Optional(NonEmptyString),
    confidence: Type13.Optional(
      Type13.Union([Type13.Literal("low"), Type13.Literal("medium"), Type13.Literal("high")])
    ),
    message: Type13.Optional(Type13.String()),
    error: Type13.Optional(Type13.String()),
    summary: MemoryMigrationSummarySchema,
    items: Type13.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
    warnings: Type13.Optional(Type13.Array(Type13.String()))
  },
  { additionalProperties: false }
);
var MigrationsMemoryPlanParamsSchema = Type13.Object(
  {
    agentId: NonEmptyString,
    overwrite: Type13.Optional(Type13.Boolean())
  },
  { additionalProperties: false }
);
var MigrationsMemoryPlanResultSchema = Type13.Object(
  {
    agentId: NonEmptyString,
    workspace: NonEmptyString,
    providers: Type13.Array(MemoryMigrationProviderPlanSchema)
  },
  { additionalProperties: false }
);
var MigrationsMemoryApplyParamsSchema = Type13.Object(
  {
    idempotencyKey: NonEmptyString,
    agentId: NonEmptyString,
    providerId: NonEmptyString,
    planFingerprint: MemoryMigrationPlanFingerprintSchema,
    itemIds: Type13.Array(NonEmptyString, {
      minItems: 1,
      uniqueItems: true,
      maxItems: MAX_MEMORY_MIGRATION_ITEMS
    }),
    overwrite: Type13.Optional(Type13.Boolean())
  },
  { additionalProperties: false }
);
var MigrationsMemoryApplyResultSchema = Type13.Object(
  {
    providerId: NonEmptyString,
    source: NonEmptyString,
    target: Type13.Optional(NonEmptyString),
    summary: MemoryMigrationSummarySchema,
    items: Type13.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
    warnings: Type13.Optional(Type13.Array(Type13.String())),
    backupPath: Type13.Optional(NonEmptyString),
    reportDir: Type13.Optional(NonEmptyString)
  },
  { additionalProperties: false }
);
var MigrationProtocolSchemas = {
  MemoryMigrationItemStatus: MemoryMigrationItemStatusSchema,
  MemoryMigrationItem: MemoryMigrationItemSchema,
  MemoryMigrationSummary: MemoryMigrationSummarySchema,
  MemoryMigrationProviderPlan: MemoryMigrationProviderPlanSchema,
  MigrationsMemoryPlanParams: MigrationsMemoryPlanParamsSchema,
  MigrationsMemoryPlanResult: MigrationsMemoryPlanResultSchema,
  MigrationsMemoryApplyParams: MigrationsMemoryApplyParamsSchema,
  MigrationsMemoryApplyResult: MigrationsMemoryApplyResultSchema
};

// packages/gateway-protocol/src/migration-api.ts
var validateMigrationsMemoryPlanParams = lazyCompile(MigrationsMemoryPlanParamsSchema);
var validateMigrationsMemoryApplyParams = lazyCompile(MigrationsMemoryApplyParamsSchema);

// packages/gateway-protocol/src/schema/agent.ts
import { Type as Type14 } from "typebox";
var AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION = "task_completion";
var AGENT_INTERNAL_EVENT_SOURCES = [
  "subagent",
  "cron",
  "image_generation",
  "video_generation",
  "music_generation"
];
var AGENT_INTERNAL_EVENT_STATUSES = ["ok", "timeout", "error", "unknown"];
var CONVERSATION_REF_PATTERN = "^conv_[a-f0-9]{32}$";
var AgentGeneratedAttachmentSchema = closedObject({
  type: Type14.Optional(Type14.String({ enum: ["image", "audio", "video", "file"] })),
  path: Type14.Optional(Type14.String()),
  url: Type14.Optional(Type14.String()),
  mediaUrl: Type14.Optional(Type14.String()),
  filePath: Type14.Optional(Type14.String()),
  mimeType: Type14.Optional(Type14.String()),
  name: Type14.Optional(Type14.String())
});
var AgentInternalEventSchema = closedObject({
  type: Type14.Literal(AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION),
  source: Type14.String({ enum: [...AGENT_INTERNAL_EVENT_SOURCES] }),
  childSessionKey: Type14.String(),
  childSessionId: Type14.Optional(Type14.String()),
  announceType: Type14.String(),
  taskLabel: Type14.String(),
  status: Type14.String({ enum: [...AGENT_INTERNAL_EVENT_STATUSES] }),
  statusLabel: Type14.String(),
  result: Type14.String(),
  attachments: Type14.Optional(Type14.Array(AgentGeneratedAttachmentSchema)),
  mediaUrls: Type14.Optional(Type14.Array(Type14.String())),
  statsLine: Type14.Optional(Type14.String()),
  replyInstruction: Type14.String()
});
var AgentEventSchema = closedObject({
  runId: NonEmptyString,
  seq: Type14.Integer({ minimum: 0 }),
  stream: NonEmptyString,
  ts: Type14.Integer({ minimum: 0 }),
  spawnedBy: Type14.Optional(NonEmptyString),
  isHeartbeat: Type14.Optional(Type14.Boolean()),
  data: Type14.Record(Type14.String(), Type14.Unknown())
});
var MessageActionToolContextSchema = closedObject({
  currentChannelId: Type14.Optional(Type14.String()),
  currentMessagingTarget: Type14.Optional(Type14.String()),
  currentGraphChannelId: Type14.Optional(Type14.String()),
  currentChannelProvider: Type14.Optional(Type14.String()),
  currentThreadTs: Type14.Optional(Type14.String()),
  currentMessageId: Type14.Optional(Type14.Union([Type14.String(), Type14.Number()])),
  replyToMode: Type14.Optional(
    Type14.Union([
      Type14.Literal("off"),
      Type14.Literal("first"),
      Type14.Literal("all"),
      Type14.Literal("batched")
    ])
  ),
  hasRepliedRef: Type14.Optional(
    closedObject({
      value: Type14.Boolean()
    })
  ),
  sameChannelThreadRequired: Type14.Optional(Type14.Boolean()),
  skipCrossContextDecoration: Type14.Optional(Type14.Boolean())
});
var MessageActionParamsSchema = closedObject({
  channel: NonEmptyString,
  action: NonEmptyString,
  params: Type14.Record(Type14.String(), Type14.Unknown()),
  accountId: Type14.Optional(Type14.String()),
  requesterAccountId: Type14.Optional(Type14.String()),
  requesterSenderId: Type14.Optional(Type14.String()),
  // Honored only when the RPC caller has the full operator scope set
  // (shared-secret bearer or `operator.admin`). For narrowly-scoped
  // callers (e.g. `operator.write`-only) the gateway forces this to
  // `false` regardless of the value sent here.
  senderIsOwner: Type14.Optional(Type14.Boolean()),
  sessionKey: Type14.Optional(Type14.String()),
  sessionId: Type14.Optional(Type14.String()),
  inboundTurnKind: Type14.Optional(Type14.String({ enum: ["user_request", "room_event"] })),
  agentId: Type14.Optional(Type14.String()),
  toolContext: Type14.Optional(MessageActionToolContextSchema),
  /**
   * Explicit operation-local marker for an authenticated direct operator.
   * Missing values remain delegated, and agent runtime identity wins server-side.
   */
  conversationReadOrigin: Type14.Optional(Type14.Literal("direct-operator")),
  idempotencyKey: NonEmptyString
});
var SendParamsSchema = closedObject({
  to: NonEmptyString,
  message: Type14.Optional(Type14.String()),
  mediaUrl: Type14.Optional(Type14.String()),
  mediaUrls: Type14.Optional(Type14.Array(Type14.String())),
  /** Base64 attachment payload for gateway-local media materialization. */
  buffer: Type14.Optional(Type14.String()),
  /** Optional filename for a base64 attachment payload. */
  filename: Type14.Optional(Type14.String()),
  /** Optional MIME type for a base64 attachment payload. */
  contentType: Type14.Optional(Type14.String()),
  asVoice: Type14.Optional(Type14.Boolean()),
  gifPlayback: Type14.Optional(Type14.Boolean()),
  channel: Type14.Optional(Type14.String()),
  accountId: Type14.Optional(Type14.String()),
  /** Optional agent id for per-agent media root resolution on gateway sends. */
  agentId: Type14.Optional(Type14.String()),
  /** Reply target message id for native quoted/threaded sends where supported. */
  replyToId: Type14.Optional(Type14.String()),
  /** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */
  threadId: Type14.Optional(Type14.String()),
  /** Force document-style media sends where supported. */
  forceDocument: Type14.Optional(Type14.Boolean()),
  /** Send silently (no notification) where supported. */
  silent: Type14.Optional(Type14.Boolean()),
  /** Channel-specific parse mode for formatted text. */
  parseMode: Type14.Optional(Type14.Literal("HTML")),
  /** Optional session key for mirroring delivered output back into the transcript. */
  sessionKey: Type14.Optional(Type14.String()),
  idempotencyKey: NonEmptyString
});
var ConversationListParamsSchema = closedObject({
  agentId: NonEmptyString,
  channel: Type14.Optional(NonEmptyString),
  query: Type14.Optional(NonEmptyString),
  limit: Type14.Optional(Type14.Integer({ minimum: 1, maximum: 100 }))
});
var ConversationListItemSchema = closedObject({
  conversationRef: Type14.String({ pattern: CONVERSATION_REF_PATTERN }),
  channel: NonEmptyString,
  accountId: NonEmptyString,
  kind: Type14.Union([Type14.Literal("direct"), Type14.Literal("group"), Type14.Literal("channel")]),
  target: NonEmptyString,
  threadId: Type14.Optional(NonEmptyString),
  label: Type14.Optional(NonEmptyString),
  firstSeenAt: Type14.Integer({ minimum: 0 }),
  lastSeenAt: Type14.Integer({ minimum: 0 })
});
var ConversationListResultSchema = closedObject({
  conversations: Type14.Array(ConversationListItemSchema)
});
var ConversationSendParamsSchema = closedObject({
  agentId: NonEmptyString,
  sourceSessionKey: Type14.Optional(NonEmptyString),
  operationId: NonEmptyString,
  conversationRef: Type14.String({ pattern: CONVERSATION_REF_PATTERN }),
  message: NonEmptyString
});
var ConversationSendResultSchema = closedObject({
  status: Type14.Union([
    Type14.Literal("sent"),
    Type14.Literal("queued"),
    Type14.Literal("suppressed"),
    Type14.Literal("unknown")
  ]),
  conversationRef: Type14.String({ pattern: CONVERSATION_REF_PATTERN }),
  channel: NonEmptyString,
  messageId: Type14.Optional(NonEmptyString),
  queueId: Type14.Optional(NonEmptyString)
});
var ConversationTurnParamsSchema = closedObject({
  agentId: NonEmptyString,
  sourceSessionKey: Type14.Optional(NonEmptyString),
  turnId: NonEmptyString,
  conversationRef: Type14.String({ pattern: CONVERSATION_REF_PATTERN }),
  message: NonEmptyString,
  timeoutMs: Type14.Integer({ minimum: 1, maximum: 3e5 })
});
var ConversationTurnCancelParamsSchema = closedObject({
  agentId: NonEmptyString,
  turnId: NonEmptyString
});
var ConversationTurnCancelResultSchema = closedObject({
  cancelled: Type14.Boolean()
});
var ConversationTurnReplySchema = closedObject({
  conversationRef: Type14.String({ pattern: CONVERSATION_REF_PATTERN }),
  messageId: NonEmptyString,
  replyToId: Type14.Optional(NonEmptyString),
  threadId: Type14.Optional(NonEmptyString),
  text: Type14.String(),
  timestamp: Type14.Integer({ minimum: 0 }),
  transcriptArtifactId: Type14.Optional(NonEmptyString),
  transcriptMessageId: Type14.Optional(NonEmptyString)
});
var ConversationTurnBaseResultSchema = {
  conversationRef: Type14.String({ pattern: CONVERSATION_REF_PATTERN }),
  channel: NonEmptyString,
  messageId: NonEmptyString,
  correlationPersisted: Type14.Boolean()
};
var ConversationTurnResultSchema = Type14.Union([
  closedObject({
    ...ConversationTurnBaseResultSchema,
    status: Type14.Literal("replied"),
    reply: ConversationTurnReplySchema
  }),
  closedObject({
    ...ConversationTurnBaseResultSchema,
    status: Type14.Literal("timeout")
  }),
  closedObject({
    conversationRef: Type14.String({ pattern: CONVERSATION_REF_PATTERN }),
    channel: NonEmptyString,
    messageId: Type14.Optional(NonEmptyString),
    correlationPersisted: Type14.Boolean(),
    status: Type14.Union([
      Type14.Literal("sent"),
      Type14.Literal("queued"),
      Type14.Literal("suppressed"),
      Type14.Literal("unknown")
    ]),
    error: NonEmptyString
  })
]);
var PollParamsSchema = closedObject({
  to: NonEmptyString,
  question: NonEmptyString,
  options: Type14.Array(NonEmptyString, { minItems: 2, maxItems: 12 }),
  maxSelections: Type14.Optional(Type14.Integer({ minimum: 1, maximum: 12 })),
  /** Poll duration in seconds (channel-specific limits may apply). */
  durationSeconds: Type14.Optional(Type14.Integer({ minimum: 1, maximum: 604800 })),
  durationHours: Type14.Optional(Type14.Integer({ minimum: 1 })),
  /** Send silently (no notification) where supported. */
  silent: Type14.Optional(Type14.Boolean()),
  /** Poll anonymity where supported (e.g. Telegram polls default to anonymous). */
  isAnonymous: Type14.Optional(Type14.Boolean()),
  /** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */
  threadId: Type14.Optional(Type14.String()),
  channel: Type14.Optional(Type14.String()),
  accountId: Type14.Optional(Type14.String()),
  idempotencyKey: NonEmptyString
});
var AgentParamsSchema = closedObject({
  message: NonEmptyString,
  agentId: Type14.Optional(NonEmptyString),
  provider: Type14.Optional(Type14.String()),
  model: Type14.Optional(Type14.String()),
  to: Type14.Optional(Type14.String()),
  replyTo: Type14.Optional(Type14.String()),
  sessionId: Type14.Optional(Type14.String()),
  sessionKey: Type14.Optional(Type14.String()),
  // Backend-owned continuations can bind work to an already-admitted transcript.
  expectedExistingSessionId: Type14.Optional(NonEmptyString),
  thinking: Type14.Optional(Type14.String()),
  deliver: Type14.Optional(Type14.Boolean()),
  attachments: Type14.Optional(Type14.Array(Type14.Unknown())),
  channel: Type14.Optional(Type14.String()),
  replyChannel: Type14.Optional(Type14.String()),
  accountId: Type14.Optional(Type14.String()),
  replyAccountId: Type14.Optional(Type14.String()),
  threadId: Type14.Optional(Type14.String()),
  groupId: Type14.Optional(Type14.String()),
  groupChannel: Type14.Optional(Type14.String()),
  groupSpace: Type14.Optional(Type14.String()),
  timeout: Type14.Optional(Type14.Integer({ minimum: 0 })),
  bestEffortDeliver: Type14.Optional(Type14.Boolean()),
  lane: Type14.Optional(Type14.String()),
  cwd: Type14.Optional(NonEmptyString),
  // One-shot CLI gateway requests can ask the gateway to close process-wide
  // bundle MCP resources after the run instead of keeping them warm.
  cleanupBundleMcpOnRunEnd: Type14.Optional(Type14.Boolean()),
  modelRun: Type14.Optional(Type14.Boolean()),
  promptMode: Type14.Optional(
    Type14.Union([Type14.Literal("full"), Type14.Literal("minimal"), Type14.Literal("none")])
  ),
  extraSystemPrompt: Type14.Optional(Type14.String()),
  bootstrapContextMode: Type14.Optional(
    Type14.Union([Type14.Literal("full"), Type14.Literal("lightweight")])
  ),
  // Commitment fan-out scope is scheduler-internal and cannot be selected over Gateway RPC.
  bootstrapContextRunKind: Type14.Optional(
    Type14.Union([Type14.Literal("default"), Type14.Literal("heartbeat"), Type14.Literal("cron")])
  ),
  acpTurnSource: Type14.Optional(Type14.Literal("manual_spawn")),
  internalRuntimeHandoffId: Type14.Optional(NonEmptyString),
  execApprovalFollowupExpectedSessionId: Type14.Optional(NonEmptyString),
  internalEvents: Type14.Optional(Type14.Array(AgentInternalEventSchema)),
  inputProvenance: Type14.Optional(InputProvenanceSchema),
  suppressPromptPersistence: Type14.Optional(Type14.Boolean()),
  sessionEffects: Type14.Optional(Type14.Union([Type14.Literal("visible"), Type14.Literal("internal")])),
  sourceReplyDeliveryMode: Type14.Optional(
    Type14.Union([Type14.Literal("automatic"), Type14.Literal("message_tool_only")])
  ),
  disableMessageTool: Type14.Optional(Type14.Boolean()),
  swarmCollector: Type14.Optional(Type14.Boolean()),
  swarmOutputSchema: Type14.Optional(Type14.Record(Type14.String(), Type14.Unknown())),
  // Host-owned recovery turns can force every Code Mode exec onto the
  // restart-safe path even if the model omits or clears the tool argument.
  forceRestartSafeTools: Type14.Optional(Type14.Boolean()),
  voiceWakeTrigger: Type14.Optional(Type14.String()),
  idempotencyKey: NonEmptyString,
  label: Type14.Optional(SessionLabelString)
});
var AgentIdentityParamsSchema = closedObject({
  agentId: Type14.Optional(NonEmptyString),
  sessionKey: Type14.Optional(Type14.String())
});
var AgentIdentityResultSchema = closedObject({
  agentId: NonEmptyString,
  name: Type14.Optional(NonEmptyString),
  avatar: Type14.Optional(NonEmptyString),
  avatarSource: Type14.Optional(NonEmptyString),
  avatarStatus: Type14.Optional(Type14.String({ enum: ["none", "local", "remote", "data"] })),
  avatarReason: Type14.Optional(NonEmptyString),
  emoji: Type14.Optional(NonEmptyString)
});
var AgentWaitParamsSchema = closedObject({
  runId: NonEmptyString,
  timeoutMs: Type14.Optional(Type14.Integer({ minimum: 0 }))
});
var WakeParamsSchema = Type14.Object(
  {
    mode: Type14.Union([Type14.Literal("now"), Type14.Literal("next-heartbeat")]),
    text: NonEmptyString,
    // Typed field; misspelled variants remain opaque metadata because wake
    // senders already rely on additionalProperties.
    sessionKey: Type14.Optional(NonEmptyString),
    /**
     * Optional agent id paired with `sessionKey`. Routes multi-agent setups
     * to the agent that owns the targeted session — closes the related half
     * of #46886 ("always routes to default agent").
     */
    agentId: Type14.Optional(NonEmptyString)
  },
  { additionalProperties: true }
  // external wake senders may attach opaque metadata
);

// packages/gateway-protocol/src/schema/agents-models-skills.ts
import { Type as Type15 } from "typebox";
var GatewayAgentRuntimeSchema = closedObject({
  id: NonEmptyString,
  fallback: Type15.Optional(Type15.Union([Type15.Literal("openclaw"), Type15.Literal("none")])),
  source: Type15.Union([
    Type15.Literal("env"),
    Type15.Literal("agent"),
    Type15.Literal("defaults"),
    Type15.Literal("model"),
    Type15.Literal("provider"),
    Type15.Literal("implicit"),
    Type15.Literal("session"),
    Type15.Literal("session-key")
  ])
});
var ModelChoiceSchema = closedObject({
  id: NonEmptyString,
  name: NonEmptyString,
  provider: NonEmptyString,
  alias: Type15.Optional(NonEmptyString),
  available: Type15.Optional(Type15.Boolean()),
  contextWindow: Type15.Optional(Type15.Integer({ minimum: 1 })),
  reasoning: Type15.Optional(Type15.Boolean()),
  agentRuntime: Type15.Optional(GatewayAgentRuntimeSchema),
  apiKeySupported: Type15.Optional(Type15.Boolean()),
  input: Type15.Optional(
    Type15.Array(
      Type15.Union([
        Type15.Literal("text"),
        Type15.Literal("image"),
        Type15.Literal("audio"),
        Type15.Literal("video"),
        Type15.Literal("document")
      ])
    )
  )
});
var AgentSummarySchema = closedObject({
  id: NonEmptyString,
  name: Type15.Optional(NonEmptyString),
  identity: Type15.Optional(
    closedObject({
      name: Type15.Optional(NonEmptyString),
      theme: Type15.Optional(NonEmptyString),
      emoji: Type15.Optional(NonEmptyString),
      avatar: Type15.Optional(NonEmptyString),
      avatarUrl: Type15.Optional(NonEmptyString)
    })
  ),
  workspace: Type15.Optional(NonEmptyString),
  workspaceGit: Type15.Optional(Type15.Boolean()),
  model: Type15.Optional(
    closedObject({
      primary: Type15.Optional(NonEmptyString),
      fallbacks: Type15.Optional(Type15.Array(NonEmptyString))
    })
  ),
  agentRuntime: Type15.Optional(GatewayAgentRuntimeSchema),
  thinkingLevels: Type15.Optional(
    Type15.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString
      })
    )
  ),
  thinkingOptions: Type15.Optional(Type15.Array(NonEmptyString)),
  thinkingDefault: Type15.Optional(NonEmptyString)
});
var AgentsListParamsSchema = closedObject({});
var AgentsListResultSchema = closedObject({
  defaultId: NonEmptyString,
  mainKey: NonEmptyString,
  scope: Type15.Union([Type15.Literal("per-sender"), Type15.Literal("global")]),
  agents: Type15.Array(AgentSummarySchema)
});
var AgentsCreateParamsSchema = closedObject({
  name: NonEmptyString,
  workspace: Type15.Optional(NonEmptyString),
  model: Type15.Optional(NonEmptyString),
  emoji: Type15.Optional(Type15.String()),
  avatar: Type15.Optional(Type15.String())
});
var AgentsCreateResultSchema = closedObject({
  ok: Type15.Literal(true),
  agentId: NonEmptyString,
  name: NonEmptyString,
  workspace: NonEmptyString,
  model: Type15.Optional(NonEmptyString)
});
var AgentsUpdateParamsSchema = closedObject({
  agentId: NonEmptyString,
  name: Type15.Optional(NonEmptyString),
  workspace: Type15.Optional(NonEmptyString),
  model: Type15.Optional(Type15.Union([NonEmptyString, Type15.Null()])),
  emoji: Type15.Optional(Type15.String()),
  avatar: Type15.Optional(Type15.String())
});
var AgentsUpdateResultSchema = closedObject({
  ok: Type15.Literal(true),
  agentId: NonEmptyString
});
var AgentsDeleteParamsSchema = closedObject({
  agentId: NonEmptyString,
  deleteFiles: Type15.Optional(Type15.Boolean())
});
var AgentsDeleteResultSchema = closedObject({
  ok: Type15.Literal(true),
  agentId: NonEmptyString,
  removedBindings: Type15.Integer({ minimum: 0 }),
  removed: Type15.Optional(
    Type15.Array(
      closedObject({
        path: NonEmptyString,
        method: Type15.Union([Type15.Literal("trash"), Type15.Literal("missing")])
      })
    )
  ),
  failed: Type15.Optional(
    Type15.Array(
      closedObject({
        path: NonEmptyString,
        reason: NonEmptyString
      })
    )
  )
});
var AgentsFileEntrySchema = closedObject({
  name: NonEmptyString,
  path: NonEmptyString,
  missing: Type15.Boolean(),
  size: Type15.Optional(Type15.Integer({ minimum: 0 })),
  updatedAtMs: Type15.Optional(Type15.Integer({ minimum: 0 })),
  content: Type15.Optional(Type15.String())
});
var AgentsFilesListParamsSchema = closedObject({
  agentId: NonEmptyString
});
var AgentsFilesListResultSchema = closedObject({
  agentId: NonEmptyString,
  workspace: NonEmptyString,
  files: Type15.Array(AgentsFileEntrySchema)
});
var AgentsFilesGetParamsSchema = closedObject({
  agentId: NonEmptyString,
  name: NonEmptyString
});
var AgentsFilesGetResultSchema = closedObject({
  agentId: NonEmptyString,
  workspace: NonEmptyString,
  file: AgentsFileEntrySchema
});
var AgentsFilesSetParamsSchema = closedObject({
  agentId: NonEmptyString,
  name: NonEmptyString,
  content: Type15.String()
});
var AgentsFilesSetResultSchema = closedObject({
  ok: Type15.Literal(true),
  agentId: NonEmptyString,
  workspace: NonEmptyString,
  file: AgentsFileEntrySchema
});
var ModelsListParamsSchema = closedObject({
  includeProviderCapabilities: Type15.Optional(Type15.Boolean()),
  view: Type15.Optional(
    Type15.Union([
      Type15.Literal("default"),
      Type15.Literal("configured"),
      Type15.Literal("provider-config"),
      Type15.Literal("all")
    ])
  )
});
var ModelsListResultSchema = closedObject({
  models: Type15.Array(ModelChoiceSchema)
});
var ModelsProbeParamsSchema = closedObject({
  provider: NonEmptyString,
  profileId: Type15.Optional(NonEmptyString),
  timeoutMs: Type15.Optional(Type15.Integer({ minimum: 1 }))
});
var AuthProbeStatusSchema = Type15.Union([
  Type15.Literal("ok"),
  Type15.Literal("auth"),
  Type15.Literal("rate_limit"),
  Type15.Literal("billing"),
  Type15.Literal("timeout"),
  Type15.Literal("format"),
  Type15.Literal("unknown"),
  Type15.Literal("no_model")
]);
var ModelsProbeTargetResultSchema = closedObject({
  profileId: Type15.Optional(NonEmptyString),
  label: NonEmptyString,
  status: AuthProbeStatusSchema,
  latencyMs: Type15.Optional(Type15.Integer({ minimum: 0 })),
  error: Type15.Optional(Type15.String())
});
var ModelsProbeResultSchema = closedObject({
  provider: NonEmptyString,
  status: AuthProbeStatusSchema,
  latencyMs: Type15.Optional(Type15.Integer({ minimum: 0 })),
  error: Type15.Optional(Type15.String()),
  results: Type15.Array(ModelsProbeTargetResultSchema)
});
var SkillsStatusParamsSchema = closedObject({
  agentId: Type15.Optional(NonEmptyString)
});
var SkillsBinsParamsSchema = closedObject({});
var SkillsBinsResultSchema = closedObject({
  bins: Type15.Array(NonEmptyString)
});
var Sha256String = Type15.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-fA-F0-9]{64}$"
});
var SkillUploadIdempotencyKeyString = Type15.String({
  minLength: 1,
  maxLength: 2048
});
var SkillUploadDataBase64String = Type15.String({
  minLength: 1,
  maxLength: 5592408
});
var SkillsUploadBeginParamsSchema = closedObject({
  kind: Type15.Literal("skill-archive"),
  slug: NonEmptyString,
  sizeBytes: Type15.Integer({ minimum: 1 }),
  sha256: Type15.Optional(Sha256String),
  force: Type15.Optional(Type15.Boolean()),
  idempotencyKey: Type15.Optional(SkillUploadIdempotencyKeyString)
});
var SkillsUploadChunkParamsSchema = closedObject({
  uploadId: NonEmptyString,
  offset: Type15.Integer({ minimum: 0 }),
  dataBase64: SkillUploadDataBase64String
});
var SkillsUploadCommitParamsSchema = closedObject({
  uploadId: NonEmptyString,
  sha256: Type15.Optional(Sha256String)
});
var SkillsInstallParamsSchema = Type15.Union([
  closedObject({
    agentId: Type15.Optional(NonEmptyString),
    name: NonEmptyString,
    installId: NonEmptyString,
    dangerouslyForceUnsafeInstall: Type15.Optional(
      Type15.Boolean({
        deprecated: true,
        description: "Deprecated compatibility field. Current servers ignore it; install policy is controlled by security.installPolicy."
      })
    ),
    timeoutMs: Type15.Optional(Type15.Integer({ minimum: 1e3 }))
  }),
  closedObject({
    agentId: Type15.Optional(NonEmptyString),
    source: Type15.Literal("clawhub"),
    slug: NonEmptyString,
    version: Type15.Optional(NonEmptyString),
    force: Type15.Optional(Type15.Boolean()),
    acknowledgeClawHubRisk: Type15.Optional(Type15.Boolean()),
    timeoutMs: Type15.Optional(Type15.Integer({ minimum: 1e3 }))
  }),
  closedObject({
    agentId: Type15.Optional(NonEmptyString),
    source: Type15.Literal("upload"),
    uploadId: NonEmptyString,
    slug: NonEmptyString,
    force: Type15.Optional(Type15.Boolean()),
    sha256: Type15.Optional(Sha256String),
    timeoutMs: Type15.Optional(Type15.Integer({ minimum: 1e3 }))
  })
]);
var SkillsUpdateParamsSchema = Type15.Union([
  closedObject({
    skillKey: NonEmptyString,
    enabled: Type15.Optional(Type15.Boolean()),
    apiKey: Type15.Optional(Type15.String()),
    env: Type15.Optional(Type15.Record(NonEmptyString, Type15.String()))
  }),
  closedObject({
    agentId: Type15.Optional(NonEmptyString),
    source: Type15.Literal("clawhub"),
    slug: Type15.Optional(NonEmptyString),
    all: Type15.Optional(Type15.Boolean()),
    acknowledgeClawHubRisk: Type15.Optional(Type15.Boolean())
  })
]);
var SkillsSearchParamsSchema = closedObject({
  query: Type15.Optional(NonEmptyString),
  limit: Type15.Optional(Type15.Integer({ minimum: 1, maximum: 100 }))
});
var SkillsSearchResultSchema = closedObject({
  results: Type15.Array(
    closedObject({
      score: Type15.Number(),
      slug: NonEmptyString,
      displayName: NonEmptyString,
      summary: Type15.Optional(Type15.String()),
      version: Type15.Optional(NonEmptyString),
      updatedAt: Type15.Optional(Type15.Integer())
    })
  )
});
var SkillsDetailParamsSchema = closedObject({
  slug: NonEmptyString
});
var SkillsSecurityVerdictsParamsSchema = closedObject({
  agentId: Type15.Optional(NonEmptyString)
});
var SkillsDetailResultSchema = closedObject({
  skill: Type15.Union([
    closedObject({
      slug: NonEmptyString,
      displayName: NonEmptyString,
      summary: Type15.Optional(Type15.String()),
      tags: Type15.Optional(Type15.Record(NonEmptyString, Type15.String())),
      channel: Type15.Optional(Type15.Union([Type15.String(), Type15.Null()])),
      isOfficial: Type15.Optional(Type15.Union([Type15.Boolean(), Type15.Null()])),
      createdAt: Type15.Integer(),
      updatedAt: Type15.Integer()
    }),
    Type15.Null()
  ]),
  latestVersion: Type15.Optional(
    Type15.Union([
      closedObject({
        version: NonEmptyString,
        createdAt: Type15.Integer(),
        changelog: Type15.Optional(Type15.String())
      }),
      Type15.Null()
    ])
  ),
  metadata: Type15.Optional(
    Type15.Union([
      closedObject({
        os: Type15.Optional(Type15.Union([Type15.Array(Type15.String()), Type15.Null()])),
        systems: Type15.Optional(Type15.Union([Type15.Array(Type15.String()), Type15.Null()]))
      }),
      Type15.Null()
    ])
  ),
  owner: Type15.Optional(
    Type15.Union([
      closedObject({
        handle: Type15.Optional(Type15.Union([NonEmptyString, Type15.Null()])),
        displayName: Type15.Optional(Type15.Union([NonEmptyString, Type15.Null()])),
        image: Type15.Optional(Type15.Union([Type15.String(), Type15.Null()])),
        official: Type15.Optional(Type15.Union([Type15.Boolean(), Type15.Null()])),
        channel: Type15.Optional(Type15.Union([Type15.String(), Type15.Null()])),
        isOfficial: Type15.Optional(Type15.Union([Type15.Boolean(), Type15.Null()]))
      }),
      Type15.Null()
    ])
  )
});
var SkillsSecurityVerdictsResultSchema = closedObject({
  schema: Type15.Literal("openclaw.skills.security-verdicts.v1"),
  items: Type15.Array(
    closedObject({
      registry: NonEmptyString,
      ok: Type15.Boolean(),
      decision: NonEmptyString,
      reasons: Type15.Array(Type15.String()),
      requestedSlug: NonEmptyString,
      requestedVersion: NonEmptyString,
      slug: Type15.Optional(Type15.Union([NonEmptyString, Type15.Null()])),
      version: Type15.Optional(Type15.Union([NonEmptyString, Type15.Null()])),
      displayName: Type15.Optional(Type15.Union([Type15.String(), Type15.Null()])),
      publisherHandle: Type15.Optional(Type15.Union([Type15.String(), Type15.Null()])),
      publisherDisplayName: Type15.Optional(Type15.Union([Type15.String(), Type15.Null()])),
      createdAt: Type15.Optional(Type15.Union([Type15.Integer(), Type15.Null()])),
      checkedAt: Type15.Optional(Type15.Union([Type15.Integer(), Type15.Null()])),
      skillUrl: Type15.Optional(Type15.Union([Type15.String(), Type15.Null()])),
      securityAuditUrl: Type15.Optional(Type15.Union([Type15.String(), Type15.Null()])),
      securityStatus: Type15.Optional(Type15.Union([Type15.String(), Type15.Null()])),
      securityPassed: Type15.Optional(Type15.Union([Type15.Boolean(), Type15.Null()])),
      error: Type15.Optional(
        closedObject({
          code: Type15.Optional(Type15.String()),
          message: Type15.Optional(Type15.String())
        })
      )
    })
  )
});
var SkillsSkillCardParamsSchema = closedObject({
  agentId: Type15.Optional(NonEmptyString),
  skillKey: NonEmptyString
});
var SkillsSkillCardResultSchema = closedObject({
  schema: Type15.Literal("openclaw.skills.skill-card.v1"),
  skillKey: NonEmptyString,
  path: NonEmptyString,
  sizeBytes: Type15.Integer({ minimum: 0 }),
  content: Type15.String()
});
var SkillProposalStatusSchema = Type15.Union([
  Type15.Literal("pending"),
  Type15.Literal("applied"),
  Type15.Literal("rejected"),
  Type15.Literal("quarantined"),
  Type15.Literal("stale")
]);
var SkillProposalKindSchema = Type15.Union([Type15.Literal("create"), Type15.Literal("update")]);
var SkillProposalScanStateSchema = Type15.Union([
  Type15.Literal("pending"),
  Type15.Literal("clean"),
  Type15.Literal("failed"),
  Type15.Literal("quarantined")
]);
var SkillProposalSourceSchema = Type15.Union([
  Type15.Literal("skill-workshop"),
  Type15.Literal("cli"),
  Type15.Literal("gateway")
]);
var SkillProposalContentString = Type15.String({ minLength: 1, maxLength: 1048576 });
var SkillProposalSupportFileInputSchema = closedObject({
  path: NonEmptyString,
  content: Type15.String({ maxLength: 262144 })
});
var SkillProposalSupportFileSchema = closedObject({
  path: NonEmptyString,
  sizeBytes: Type15.Integer({ minimum: 0, maximum: 262144 }),
  hash: Sha256String,
  targetExisted: Type15.Optional(Type15.Boolean()),
  targetContentHash: Type15.Optional(Sha256String)
});
var SkillProposalFindingSchema = closedObject({
  ruleId: NonEmptyString,
  severity: Type15.Union([Type15.Literal("info"), Type15.Literal("warn"), Type15.Literal("critical")]),
  file: NonEmptyString,
  line: Type15.Integer({ minimum: 1 }),
  message: NonEmptyString,
  evidence: Type15.String()
});
var SkillProposalScanSchema = closedObject({
  state: SkillProposalScanStateSchema,
  scannedAt: NonEmptyString,
  critical: Type15.Integer({ minimum: 0 }),
  warn: Type15.Integer({ minimum: 0 }),
  info: Type15.Integer({ minimum: 0 }),
  findings: Type15.Array(SkillProposalFindingSchema)
});
var SkillProposalTargetSchema = closedObject({
  skillName: NonEmptyString,
  skillKey: NonEmptyString,
  skillDir: NonEmptyString,
  skillFile: NonEmptyString,
  source: Type15.Optional(NonEmptyString),
  currentContentHash: Type15.Optional(NonEmptyString)
});
var SkillProposalOriginSchema = closedObject({
  agentId: Type15.Optional(NonEmptyString),
  sessionKey: Type15.Optional(NonEmptyString),
  runId: Type15.Optional(NonEmptyString),
  messageId: Type15.Optional(NonEmptyString)
});
var SkillProposalRecordSchema = closedObject({
  schema: Type15.Literal("openclaw.skill-workshop.proposal.v1"),
  id: NonEmptyString,
  kind: SkillProposalKindSchema,
  status: SkillProposalStatusSchema,
  title: NonEmptyString,
  description: NonEmptyString,
  createdAt: NonEmptyString,
  updatedAt: NonEmptyString,
  createdBy: SkillProposalSourceSchema,
  origin: Type15.Optional(SkillProposalOriginSchema),
  proposedVersion: NonEmptyString,
  draftFile: Type15.Literal("PROPOSAL.md"),
  draftHash: NonEmptyString,
  supportFiles: Type15.Optional(Type15.Array(SkillProposalSupportFileSchema, { maxItems: 64 })),
  target: SkillProposalTargetSchema,
  scan: SkillProposalScanSchema,
  goal: Type15.Optional(Type15.String()),
  evidence: Type15.Optional(Type15.String()),
  appliedAt: Type15.Optional(NonEmptyString),
  rejectedAt: Type15.Optional(NonEmptyString),
  quarantinedAt: Type15.Optional(NonEmptyString),
  staleAt: Type15.Optional(NonEmptyString),
  statusReason: Type15.Optional(Type15.String())
});
var SkillProposalManifestEntrySchema = closedObject({
  id: NonEmptyString,
  kind: SkillProposalKindSchema,
  status: SkillProposalStatusSchema,
  title: NonEmptyString,
  description: NonEmptyString,
  skillName: NonEmptyString,
  skillKey: NonEmptyString,
  createdAt: NonEmptyString,
  updatedAt: NonEmptyString,
  scanState: SkillProposalScanStateSchema
});
var SkillsProposalsListParamsSchema = closedObject({
  agentId: Type15.Optional(NonEmptyString)
});
var SkillsProposalsListResultSchema = closedObject({
  schema: Type15.Literal("openclaw.skill-workshop.proposals-manifest.v1"),
  updatedAt: NonEmptyString,
  proposals: Type15.Array(SkillProposalManifestEntrySchema)
});
var SkillsProposalInspectParamsSchema = closedObject({
  agentId: Type15.Optional(NonEmptyString),
  proposalId: NonEmptyString
});
var SkillsProposalInspectResultSchema = closedObject({
  record: SkillProposalRecordSchema,
  content: Type15.String(),
  supportFiles: Type15.Optional(Type15.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 }))
});
var SkillsProposalCreateParamsSchema = closedObject({
  agentId: Type15.Optional(NonEmptyString),
  name: NonEmptyString,
  description: NonEmptyString,
  content: SkillProposalContentString,
  supportFiles: Type15.Optional(Type15.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
  goal: Type15.Optional(Type15.String()),
  evidence: Type15.Optional(Type15.String())
});
var SkillsProposalUpdateParamsSchema = closedObject({
  agentId: Type15.Optional(NonEmptyString),
  skillName: NonEmptyString,
  description: Type15.Optional(NonEmptyString),
  content: SkillProposalContentString,
  supportFiles: Type15.Optional(Type15.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
  goal: Type15.Optional(Type15.String()),
  evidence: Type15.Optional(Type15.String())
});
var SkillsProposalReviseParamsSchema = closedObject({
  agentId: Type15.Optional(NonEmptyString),
  proposalId: NonEmptyString,
  content: SkillProposalContentString,
  supportFiles: Type15.Optional(Type15.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
  description: Type15.Optional(NonEmptyString),
  goal: Type15.Optional(Type15.String()),
  evidence: Type15.Optional(Type15.String())
});
var SkillsProposalRequestRevisionParamsSchema = closedObject({
  agentId: Type15.Optional(NonEmptyString),
  targetAgentId: Type15.Optional(NonEmptyString),
  proposalId: NonEmptyString,
  instructions: Type15.String({ minLength: 1, maxLength: 32768 }),
  sessionKey: NonEmptyString,
  sessionId: Type15.Optional(NonEmptyString),
  idempotencyKey: NonEmptyString
});
var SkillsProposalRequestRevisionResultSchema = Type15.Object(
  {
    runId: NonEmptyString,
    status: Type15.Union([
      Type15.Literal("started"),
      Type15.Literal("in_flight"),
      Type15.Literal("ok"),
      Type15.Literal("timeout"),
      Type15.Literal("error")
    ])
  },
  { additionalProperties: true }
);
var SkillsProposalActionParamsSchema = closedObject({
  agentId: Type15.Optional(NonEmptyString),
  proposalId: NonEmptyString,
  reason: Type15.Optional(Type15.String())
});
var SkillsProposalApplyResultSchema = closedObject({
  record: SkillProposalRecordSchema,
  targetSkillFile: NonEmptyString
});
var SkillsProposalRecordResultSchema = SkillProposalRecordSchema;
var SkillLifecycleStateSchema = Type15.Union([
  Type15.Literal("active"),
  Type15.Literal("stale"),
  Type15.Literal("archived")
]);
var SkillCuratorEntrySchema = closedObject({
  skillFile: NonEmptyString,
  skillKey: NonEmptyString,
  skillName: NonEmptyString,
  state: SkillLifecycleStateSchema,
  pinned: Type15.Boolean(),
  createdAtMs: Type15.Number(),
  stateChangedAtMs: Type15.Number(),
  lastUsedAtMs: Type15.Union([Type15.Number(), Type15.Null()]),
  useCount: Type15.Number(),
  archivedReason: Type15.Union([Type15.String(), Type15.Null()])
});
var SkillOverlapCandidateSchema = closedObject({
  left: NonEmptyString,
  right: NonEmptyString,
  score: Type15.Number()
});
var SkillsCuratorStatusParamsSchema = closedObject({});
var SkillsCuratorStatusResultSchema = closedObject({
  lastAttemptAtMs: Type15.Union([Type15.Number(), Type15.Null()]),
  lastSuccessAtMs: Type15.Union([Type15.Number(), Type15.Null()]),
  lastError: Type15.Union([Type15.String(), Type15.Null()]),
  counts: closedObject({
    active: Type15.Number(),
    stale: Type15.Number(),
    archived: Type15.Number()
  }),
  skills: Type15.Array(SkillCuratorEntrySchema),
  overlaps: Type15.Array(SkillOverlapCandidateSchema)
});
var SkillsCuratorActionParamsSchema = closedObject({ skill: NonEmptyString });
var SkillsCuratorActionResultSchema = SkillCuratorEntrySchema;
var ToolsCatalogParamsSchema = closedObject({
  agentId: Type15.Optional(NonEmptyString),
  includePlugins: Type15.Optional(Type15.Boolean())
});
var ToolsEffectiveParamsSchema = closedObject({
  agentId: Type15.Optional(NonEmptyString),
  sessionKey: NonEmptyString
});
var ToolsInvokeParamsSchema = closedObject({
  name: NonEmptyString,
  args: Type15.Optional(Type15.Record(Type15.String(), Type15.Unknown())),
  sessionKey: Type15.Optional(NonEmptyString),
  agentId: Type15.Optional(NonEmptyString),
  confirm: Type15.Optional(Type15.Boolean()),
  idempotencyKey: Type15.Optional(NonEmptyString),
  /**
   * Explicit operation-local marker for an authenticated direct operator.
   * Missing values remain delegated, and agent runtime identity wins server-side.
   */
  conversationReadOrigin: Type15.Optional(Type15.Literal("direct-operator"))
});
var ToolCatalogProfileSchema = closedObject({
  id: Type15.Union([
    Type15.Literal("minimal"),
    Type15.Literal("coding"),
    Type15.Literal("messaging"),
    Type15.Literal("full")
  ]),
  label: NonEmptyString
});
var ToolCatalogEntrySchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  description: Type15.String(),
  source: Type15.Union([Type15.Literal("core"), Type15.Literal("plugin")]),
  pluginId: Type15.Optional(NonEmptyString),
  optional: Type15.Optional(Type15.Boolean()),
  risk: Type15.Optional(
    Type15.Union([Type15.Literal("low"), Type15.Literal("medium"), Type15.Literal("high")])
  ),
  tags: Type15.Optional(Type15.Array(NonEmptyString)),
  defaultProfiles: Type15.Array(
    Type15.Union([
      Type15.Literal("minimal"),
      Type15.Literal("coding"),
      Type15.Literal("messaging"),
      Type15.Literal("full")
    ])
  )
});
var ToolCatalogGroupSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  source: Type15.Union([Type15.Literal("core"), Type15.Literal("plugin")]),
  pluginId: Type15.Optional(NonEmptyString),
  tools: Type15.Array(ToolCatalogEntrySchema)
});
var ToolsCatalogResultSchema = closedObject({
  agentId: NonEmptyString,
  profiles: Type15.Array(ToolCatalogProfileSchema),
  groups: Type15.Array(ToolCatalogGroupSchema)
});
var ToolsEffectiveEntrySchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  description: Type15.String(),
  rawDescription: Type15.String(),
  source: Type15.Union([
    Type15.Literal("core"),
    Type15.Literal("plugin"),
    Type15.Literal("channel"),
    Type15.Literal("mcp")
  ]),
  pluginId: Type15.Optional(NonEmptyString),
  channelId: Type15.Optional(NonEmptyString),
  risk: Type15.Optional(
    Type15.Union([Type15.Literal("low"), Type15.Literal("medium"), Type15.Literal("high")])
  ),
  tags: Type15.Optional(Type15.Array(NonEmptyString))
});
var ToolsEffectiveGroupSchema = closedObject({
  id: Type15.Union([
    Type15.Literal("core"),
    Type15.Literal("plugin"),
    Type15.Literal("channel"),
    Type15.Literal("mcp")
  ]),
  label: NonEmptyString,
  source: Type15.Union([
    Type15.Literal("core"),
    Type15.Literal("plugin"),
    Type15.Literal("channel"),
    Type15.Literal("mcp")
  ]),
  tools: Type15.Array(ToolsEffectiveEntrySchema)
});
var ToolsEffectiveNoticeSchema = closedObject({
  id: NonEmptyString,
  severity: Type15.Union([Type15.Literal("info"), Type15.Literal("warning")]),
  message: Type15.String()
});
var ToolsEffectiveResultSchema = closedObject({
  agentId: NonEmptyString,
  profile: NonEmptyString,
  groups: Type15.Array(ToolsEffectiveGroupSchema),
  notices: Type15.Optional(Type15.Array(ToolsEffectiveNoticeSchema))
});
var ToolsInvokeErrorSchema = closedObject({
  code: NonEmptyString,
  message: NonEmptyString,
  details: Type15.Optional(Type15.Unknown())
});
var ToolsInvokeResultSchema = closedObject({
  ok: Type15.Boolean(),
  toolName: NonEmptyString,
  output: Type15.Optional(Type15.Unknown()),
  requiresApproval: Type15.Optional(Type15.Boolean()),
  approvalId: Type15.Optional(NonEmptyString),
  source: Type15.Optional(
    Type15.Union([
      Type15.Literal("core"),
      Type15.Literal("plugin"),
      Type15.Literal("mcp"),
      Type15.Literal("channel"),
      Type15.String()
    ])
  ),
  error: Type15.Optional(ToolsInvokeErrorSchema)
});

// packages/gateway-protocol/src/schema/agents-workspace.ts
import { Type as Type16 } from "typebox";
var AgentsWorkspaceEntrySchema = closedObject({
  path: NonEmptyString,
  name: NonEmptyString,
  kind: Type16.Union([Type16.Literal("file"), Type16.Literal("directory")]),
  size: Type16.Optional(Type16.Integer({ minimum: 0 })),
  updatedAtMs: Type16.Optional(Type16.Integer({ minimum: 0 }))
});
var AgentsWorkspaceListParamsSchema = closedObject({
  agentId: NonEmptyString,
  path: Type16.Optional(Type16.String()),
  offset: Type16.Optional(Type16.Integer({ minimum: 0 })),
  limit: Type16.Optional(Type16.Integer({ minimum: 1 }))
});
var AgentsWorkspaceListResultSchema = closedObject({
  agentId: NonEmptyString,
  path: Type16.String(),
  parentPath: Type16.Optional(Type16.String()),
  entries: Type16.Array(AgentsWorkspaceEntrySchema),
  totalEntries: Type16.Integer({ minimum: 0 }),
  offset: Type16.Integer({ minimum: 0 })
});
var AgentsWorkspaceFileSchema = closedObject({
  path: NonEmptyString,
  name: NonEmptyString,
  size: Type16.Integer({ minimum: 0 }),
  updatedAtMs: Type16.Integer({ minimum: 0 }),
  mimeType: NonEmptyString,
  encoding: Type16.Union([Type16.Literal("utf8"), Type16.Literal("base64")]),
  content: Type16.String()
});
var AgentsWorkspaceGetParamsSchema = closedObject({
  agentId: NonEmptyString,
  path: NonEmptyString
});
var AgentsWorkspaceGetResultSchema = closedObject({
  agentId: NonEmptyString,
  file: AgentsWorkspaceFileSchema
});

// packages/gateway-protocol/src/schema/artifacts.ts
import { Type as Type17 } from "typebox";
var ArtifactQueryParamsProperties = {
  sessionKey: Type17.Optional(NonEmptyString),
  runId: Type17.Optional(NonEmptyString),
  taskId: Type17.Optional(NonEmptyString),
  agentId: Type17.Optional(NonEmptyString)
};
var ArtifactQueryParamsSchema = closedObject(ArtifactQueryParamsProperties);
var ArtifactGetParamsSchema = closedObject({
  ...ArtifactQueryParamsProperties,
  artifactId: NonEmptyString
});
var ArtifactSummarySchema = closedObject({
  id: NonEmptyString,
  type: NonEmptyString,
  title: NonEmptyString,
  mimeType: Type17.Optional(NonEmptyString),
  sizeBytes: Type17.Optional(Type17.Integer({ minimum: 0 })),
  sessionKey: Type17.Optional(NonEmptyString),
  runId: Type17.Optional(NonEmptyString),
  taskId: Type17.Optional(NonEmptyString),
  messageSeq: Type17.Optional(Type17.Integer({ minimum: 1 })),
  source: Type17.Optional(NonEmptyString),
  download: closedObject({
    mode: Type17.Union([Type17.Literal("bytes"), Type17.Literal("url"), Type17.Literal("unsupported")])
  })
});
var ArtifactsListParamsSchema = ArtifactQueryParamsSchema;
var ArtifactsListResultSchema = closedObject({
  artifacts: Type17.Array(ArtifactSummarySchema)
});
var ArtifactsGetParamsSchema = ArtifactGetParamsSchema;
var ArtifactsGetResultSchema = closedObject({
  artifact: ArtifactSummarySchema
});
var ArtifactsDownloadParamsSchema = ArtifactGetParamsSchema;
var ArtifactsDownloadResultSchema = closedObject({
  artifact: ArtifactSummarySchema,
  encoding: Type17.Optional(Type17.Literal("base64")),
  data: Type17.Optional(Type17.String()),
  url: Type17.Optional(NonEmptyString)
});

// packages/gateway-protocol/src/schema/audit-activity.ts
import { Type as Type18 } from "typebox";
var AuditActivitySchemaVersionV1Schema = Type18.Integer({ minimum: 1, maximum: 1 });
var AuditActivityStatusV1Schema = Type18.Union([
  Type18.Literal("started"),
  Type18.Literal("succeeded"),
  Type18.Literal("failed"),
  Type18.Literal("cancelled"),
  Type18.Literal("timed_out"),
  Type18.Literal("blocked"),
  Type18.Literal("unknown")
]);
var AuditActivityKindV1Schema = Type18.Union([
  Type18.Literal("agent_run"),
  Type18.Literal("tool_action"),
  Type18.Literal("message")
]);
var AuditActivityDirectionV1Schema = Type18.Union([
  Type18.Literal("inbound"),
  Type18.Literal("outbound")
]);
var AuditActivityConversationKindV1Schema = Type18.Union([
  Type18.Literal("direct"),
  Type18.Literal("group"),
  Type18.Literal("channel"),
  Type18.Literal("unknown")
]);
var AuditActivityHmacRefV1Schema = Type18.String({
  pattern: "^hmac-sha256:v1:[a-f0-9]{32}:[a-f0-9]{64}$"
});
var AuditActivityAgentActorV1Schema = closedObject({
  type: Type18.Union([Type18.Literal("agent"), Type18.Literal("system")]),
  id: NonEmptyString
});
var AuditActivityInboundActorV1Schema = Type18.Union([
  closedObject({
    type: Type18.Literal("channel_sender"),
    id: AuditActivityHmacRefV1Schema
  }),
  closedObject({
    type: Type18.Literal("system"),
    id: NonEmptyString
  })
]);
var AuditActivityOutboundActorV1Schema = closedObject({
  type: Type18.Union([Type18.Literal("agent"), Type18.Literal("system")]),
  id: NonEmptyString
});
var commonProperties = {
  schemaVersion: AuditActivitySchemaVersionV1Schema,
  eventId: NonEmptyString,
  sequence: Type18.Integer({ minimum: 1 }),
  sourceSequence: Type18.Integer({ minimum: 1 }),
  occurredAt: Type18.Integer({ minimum: 0 }),
  redaction: Type18.Literal("metadata_only")
};
var agentProperties = {
  actor: AuditActivityAgentActorV1Schema,
  agentId: NonEmptyString,
  sessionKey: Type18.Optional(NonEmptyString),
  sessionId: Type18.Optional(NonEmptyString),
  runId: NonEmptyString
};
var messageProperties = {
  channel: NonEmptyString,
  conversationKind: AuditActivityConversationKindV1Schema,
  durationMs: Type18.Optional(Type18.Integer({ minimum: 0 })),
  resultCount: Type18.Optional(Type18.Integer({ minimum: 0 })),
  agentId: Type18.Optional(NonEmptyString),
  runId: Type18.Optional(NonEmptyString),
  accountRef: Type18.Optional(AuditActivityHmacRefV1Schema),
  conversationRef: Type18.Optional(AuditActivityHmacRefV1Schema),
  messageRef: Type18.Optional(AuditActivityHmacRefV1Schema),
  targetRef: Type18.Optional(AuditActivityHmacRefV1Schema)
};
function correlatedObject(properties, variants) {
  return Type18.Object(properties, { additionalProperties: false, allOf: [variants] });
}
function withoutField(field) {
  return { not: { required: [field] } };
}
var withoutErrorCode = withoutField("errorCode");
var withoutReasonCode = withoutField("reasonCode");
var withoutFailureStage = withoutField("failureStage");
var withoutDeliveryKind = withoutField("deliveryKind");
var agentRunProperties = {
  eventType: Type18.Literal("agent_run"),
  ...commonProperties,
  ...agentProperties,
  kind: Type18.Literal("agent_run")
};
var AuditActivityAgentRunV1Schema = correlatedObject(
  {
    ...agentRunProperties,
    action: Type18.Union([Type18.Literal("agent.run.started"), Type18.Literal("agent.run.finished")]),
    status: Type18.Union([
      Type18.Literal("started"),
      Type18.Literal("succeeded"),
      Type18.Literal("failed"),
      Type18.Literal("cancelled"),
      Type18.Literal("timed_out"),
      Type18.Literal("blocked")
    ]),
    errorCode: Type18.Optional(
      Type18.Union([
        Type18.Literal("run_failed"),
        Type18.Literal("run_cancelled"),
        Type18.Literal("run_timed_out"),
        Type18.Literal("run_blocked")
      ])
    )
  },
  Type18.Union([
    Type18.Intersect([
      Type18.Object({
        action: Type18.Literal("agent.run.started"),
        status: Type18.Literal("started")
      }),
      withoutErrorCode
    ]),
    Type18.Intersect([
      Type18.Object({
        action: Type18.Literal("agent.run.finished"),
        status: Type18.Literal("succeeded")
      }),
      withoutErrorCode
    ]),
    Type18.Object({
      action: Type18.Literal("agent.run.finished"),
      status: Type18.Literal("failed"),
      errorCode: Type18.Literal("run_failed")
    }),
    Type18.Object({
      action: Type18.Literal("agent.run.finished"),
      status: Type18.Literal("cancelled"),
      errorCode: Type18.Literal("run_cancelled")
    }),
    Type18.Object({
      action: Type18.Literal("agent.run.finished"),
      status: Type18.Literal("timed_out"),
      errorCode: Type18.Literal("run_timed_out")
    }),
    Type18.Object({
      action: Type18.Literal("agent.run.finished"),
      status: Type18.Literal("blocked"),
      errorCode: Type18.Literal("run_blocked")
    })
  ])
);
var toolActionProperties = {
  eventType: Type18.Literal("tool_action"),
  ...commonProperties,
  ...agentProperties,
  kind: Type18.Literal("tool_action"),
  toolCallId: Type18.Optional(NonEmptyString),
  toolName: Type18.Optional(NonEmptyString)
};
var AuditActivityToolActionV1Schema = correlatedObject(
  {
    ...toolActionProperties,
    action: Type18.Union([Type18.Literal("tool.action.started"), Type18.Literal("tool.action.finished")]),
    status: AuditActivityStatusV1Schema,
    errorCode: Type18.Optional(
      Type18.Union([
        Type18.Literal("tool_failed"),
        Type18.Literal("tool_cancelled"),
        Type18.Literal("tool_timed_out"),
        Type18.Literal("tool_blocked"),
        Type18.Literal("tool_outcome_unknown")
      ])
    )
  },
  Type18.Union([
    Type18.Intersect([
      Type18.Object({
        action: Type18.Literal("tool.action.started"),
        status: Type18.Literal("started")
      }),
      withoutErrorCode
    ]),
    Type18.Intersect([
      Type18.Object({
        action: Type18.Literal("tool.action.finished"),
        status: Type18.Literal("succeeded")
      }),
      withoutErrorCode
    ]),
    Type18.Object({
      action: Type18.Literal("tool.action.finished"),
      status: Type18.Literal("failed"),
      errorCode: Type18.Literal("tool_failed")
    }),
    Type18.Object({
      action: Type18.Literal("tool.action.finished"),
      status: Type18.Literal("cancelled"),
      errorCode: Type18.Literal("tool_cancelled")
    }),
    Type18.Object({
      action: Type18.Literal("tool.action.finished"),
      status: Type18.Literal("timed_out"),
      errorCode: Type18.Literal("tool_timed_out")
    }),
    Type18.Object({
      action: Type18.Literal("tool.action.finished"),
      status: Type18.Literal("blocked"),
      errorCode: Type18.Literal("tool_blocked")
    }),
    Type18.Object({
      action: Type18.Literal("tool.action.finished"),
      status: Type18.Literal("unknown"),
      errorCode: Type18.Literal("tool_outcome_unknown")
    })
  ])
);
var inboundMessageProperties = {
  eventType: Type18.Literal("inbound_message"),
  ...commonProperties,
  ...messageProperties,
  kind: Type18.Literal("message"),
  action: Type18.Literal("message.inbound.processed"),
  direction: Type18.Literal("inbound"),
  actor: AuditActivityInboundActorV1Schema
};
var inboundCompletedReasonSchema = Type18.Union([
  Type18.Literal("fast_abort"),
  Type18.Literal("plugin_bound_handled"),
  Type18.Literal("plugin_bound_unavailable"),
  Type18.Literal("plugin_bound_declined"),
  Type18.Literal("before_dispatch_handled"),
  Type18.Literal("acp_dispatch_completed"),
  Type18.Literal("acp_dispatch_empty")
]);
var inboundSkippedReasonSchema = Type18.Union([
  Type18.Literal("duplicate"),
  Type18.Literal("reply_operation_active"),
  Type18.Literal("reply_operation_aborted"),
  Type18.Literal("acp_dispatch_aborted")
]);
var inboundFailureReasonSchema = Type18.Union([
  Type18.Literal("acp_dispatch_failed"),
  Type18.Literal("plugin_bound_error")
]);
var AuditActivityInboundMessageV1Schema = correlatedObject(
  {
    ...inboundMessageProperties,
    status: Type18.Union([
      Type18.Literal("succeeded"),
      Type18.Literal("blocked"),
      Type18.Literal("failed")
    ]),
    outcome: Type18.Union([
      Type18.Literal("completed"),
      Type18.Literal("skipped"),
      Type18.Literal("failed")
    ]),
    errorCode: Type18.Optional(Type18.Literal("message_processing_failed")),
    reasonCode: Type18.Optional(
      Type18.Union([
        ...inboundCompletedReasonSchema.anyOf,
        ...inboundSkippedReasonSchema.anyOf,
        ...inboundFailureReasonSchema.anyOf
      ])
    )
  },
  Type18.Union([
    Type18.Intersect([
      Type18.Object({
        status: Type18.Literal("succeeded"),
        outcome: Type18.Literal("completed"),
        reasonCode: Type18.Optional(inboundCompletedReasonSchema)
      }),
      withoutErrorCode
    ]),
    Type18.Intersect([
      Type18.Object({
        status: Type18.Literal("blocked"),
        outcome: Type18.Literal("skipped"),
        reasonCode: Type18.Optional(inboundSkippedReasonSchema)
      }),
      withoutErrorCode
    ]),
    Type18.Object({
      status: Type18.Literal("failed"),
      outcome: Type18.Literal("failed"),
      errorCode: Type18.Literal("message_processing_failed"),
      reasonCode: Type18.Optional(inboundFailureReasonSchema)
    })
  ])
);
var outboundMessageProperties = {
  eventType: Type18.Literal("outbound_message"),
  ...commonProperties,
  ...messageProperties,
  kind: Type18.Literal("message"),
  action: Type18.Literal("message.outbound.finished"),
  direction: Type18.Literal("outbound"),
  actor: AuditActivityOutboundActorV1Schema,
  deliveryKind: Type18.Optional(
    Type18.Union([Type18.Literal("text"), Type18.Literal("media"), Type18.Literal("other")])
  )
};
var outboundSuppressedReasonSchema = Type18.Union([
  Type18.Literal("cancelled_by_message_sending_hook"),
  Type18.Literal("cancelled_by_reply_payload_sending_hook"),
  Type18.Literal("empty_after_message_sending_hook"),
  Type18.Literal("empty_after_reply_payload_sending_hook"),
  Type18.Literal("no_visible_payload")
]);
var outboundFailureStageSchema = Type18.Union([
  Type18.Literal("platform_send"),
  Type18.Literal("queue"),
  Type18.Literal("unknown")
]);
var outboundFailureErrorSchema = Type18.Union([
  Type18.Literal("message_delivery_failed"),
  Type18.Literal("message_delivery_partial_failure")
]);
var AuditActivityOutboundMessageV1Schema = correlatedObject(
  {
    ...outboundMessageProperties,
    status: Type18.Union([
      Type18.Literal("succeeded"),
      Type18.Literal("blocked"),
      Type18.Literal("failed"),
      Type18.Literal("unknown")
    ]),
    outcome: Type18.Union([
      Type18.Literal("sent"),
      Type18.Literal("suppressed"),
      Type18.Literal("failed"),
      Type18.Literal("unknown")
    ]),
    errorCode: Type18.Optional(outboundFailureErrorSchema),
    reasonCode: Type18.Optional(outboundSuppressedReasonSchema),
    failureStage: Type18.Optional(outboundFailureStageSchema)
  },
  Type18.Union([
    Type18.Intersect([
      Type18.Object({ status: Type18.Literal("succeeded"), outcome: Type18.Literal("sent") }),
      withoutErrorCode,
      withoutReasonCode,
      withoutFailureStage
    ]),
    Type18.Intersect([
      Type18.Object({
        status: Type18.Literal("blocked"),
        outcome: Type18.Literal("suppressed"),
        reasonCode: outboundSuppressedReasonSchema
      }),
      withoutErrorCode,
      withoutFailureStage,
      withoutDeliveryKind
    ]),
    Type18.Intersect([
      Type18.Object({
        status: Type18.Literal("failed"),
        outcome: Type18.Literal("failed"),
        errorCode: outboundFailureErrorSchema,
        failureStage: outboundFailureStageSchema
      }),
      withoutReasonCode
    ]),
    Type18.Intersect([
      Type18.Object({
        status: Type18.Literal("unknown"),
        outcome: Type18.Literal("unknown"),
        failureStage: outboundFailureStageSchema
      }),
      withoutErrorCode,
      withoutReasonCode,
      withoutDeliveryKind
    ])
  ])
);
var AuditActivityEventV1Schema = Type18.Union([
  AuditActivityAgentRunV1Schema,
  AuditActivityToolActionV1Schema,
  AuditActivityInboundMessageV1Schema,
  AuditActivityOutboundMessageV1Schema
]);
var AuditActivityListParamsSchema = closedObject({
  agentId: Type18.Optional(NonEmptyString),
  sessionKey: Type18.Optional(NonEmptyString),
  runId: Type18.Optional(NonEmptyString),
  kind: Type18.Optional(AuditActivityKindV1Schema),
  status: Type18.Optional(AuditActivityStatusV1Schema),
  direction: Type18.Optional(AuditActivityDirectionV1Schema),
  channel: Type18.Optional(NonEmptyString),
  after: Type18.Optional(Type18.Integer({ minimum: 0 })),
  before: Type18.Optional(Type18.Integer({ minimum: 0 })),
  limit: Type18.Optional(Type18.Integer({ minimum: 1, maximum: 500 })),
  cursor: Type18.Optional(NonEmptyString)
});
var AuditActivityListResultSchema = closedObject({
  events: Type18.Array(AuditActivityEventV1Schema),
  nextCursor: Type18.Optional(NonEmptyString)
});

// packages/gateway-protocol/src/schema/audit.ts
import { Type as Type19 } from "typebox";
var AuditEventKindSchema = Type19.Union([Type19.Literal("agent_run"), Type19.Literal("tool_action")]);
var AuditEventActionSchema = Type19.Union([
  Type19.Literal("agent.run.started"),
  Type19.Literal("agent.run.finished"),
  Type19.Literal("tool.action.started"),
  Type19.Literal("tool.action.finished")
]);
var AuditEventStatusSchema = Type19.Union([
  Type19.Literal("started"),
  Type19.Literal("succeeded"),
  Type19.Literal("failed"),
  Type19.Literal("cancelled"),
  Type19.Literal("timed_out"),
  Type19.Literal("blocked"),
  Type19.Literal("unknown")
]);
var AuditEventErrorCodeSchema = Type19.Union([
  Type19.Literal("run_failed"),
  Type19.Literal("run_cancelled"),
  Type19.Literal("run_timed_out"),
  Type19.Literal("run_blocked"),
  Type19.Literal("tool_failed"),
  Type19.Literal("tool_cancelled"),
  Type19.Literal("tool_timed_out"),
  Type19.Literal("tool_blocked"),
  Type19.Literal("tool_outcome_unknown")
]);
var AuditEventSchema = closedObject({
  eventId: NonEmptyString,
  sequence: Type19.Integer({ minimum: 1 }),
  sourceSequence: Type19.Integer({ minimum: 1 }),
  occurredAt: Type19.Integer({ minimum: 0 }),
  kind: AuditEventKindSchema,
  action: AuditEventActionSchema,
  status: AuditEventStatusSchema,
  errorCode: Type19.Optional(AuditEventErrorCodeSchema),
  actor: closedObject({
    type: Type19.Union([Type19.Literal("agent"), Type19.Literal("system")]),
    id: NonEmptyString
  }),
  agentId: NonEmptyString,
  sessionKey: Type19.Optional(NonEmptyString),
  sessionId: Type19.Optional(NonEmptyString),
  runId: NonEmptyString,
  toolCallId: Type19.Optional(NonEmptyString),
  toolName: Type19.Optional(NonEmptyString),
  redaction: Type19.Literal("metadata_only")
});
var AuditListParamsSchema = closedObject({
  agentId: Type19.Optional(NonEmptyString),
  sessionKey: Type19.Optional(NonEmptyString),
  runId: Type19.Optional(NonEmptyString),
  kind: Type19.Optional(AuditEventKindSchema),
  status: Type19.Optional(AuditEventStatusSchema),
  after: Type19.Optional(Type19.Integer({ minimum: 0 })),
  before: Type19.Optional(Type19.Integer({ minimum: 0 })),
  limit: Type19.Optional(Type19.Integer({ minimum: 1, maximum: 500 })),
  cursor: Type19.Optional(NonEmptyString)
});
var AuditListResultSchema = closedObject({
  events: Type19.Array(AuditEventSchema),
  nextCursor: Type19.Optional(NonEmptyString)
});

// packages/gateway-protocol/src/schema/users.ts
import { Type as Type20 } from "typebox";
var UserProfileIdSchema = Type20.String({ minLength: 1, maxLength: 128 });
var UserProfileDisplayNameSchema = Type20.String({ maxLength: 256 });
var UserProfileAvatarMimeSchema = Type20.Union([
  Type20.Literal("image/png"),
  Type20.Literal("image/jpeg"),
  Type20.Literal("image/webp")
]);
var UserProfileSchema = closedObject({
  id: UserProfileIdSchema,
  displayName: Type20.Union([UserProfileDisplayNameSchema, Type20.Null()]),
  avatarMime: Type20.Union([UserProfileAvatarMimeSchema, Type20.Null()]),
  mergedInto: Type20.Union([UserProfileIdSchema, Type20.Null()]),
  createdAt: Type20.Integer({ minimum: 0 }),
  updatedAt: Type20.Integer({ minimum: 0 }),
  emails: Type20.Array(NonEmptyString),
  hasAvatar: Type20.Boolean()
});
var UsersListParamsSchema = closedObject({});
var UsersListResultSchema = closedObject({ profiles: Type20.Array(UserProfileSchema) });
var UsersSelfParamsSchema = closedObject({});
var UsersSelfResultSchema = closedObject({ profile: UserProfileSchema });
var UsersLinkEmailParamsSchema = closedObject({
  email: Type20.String({ minLength: 1, maxLength: 320 }),
  targetProfileId: UserProfileIdSchema
});
var UsersLinkEmailResultSchema = closedObject({ profile: UserProfileSchema });
var UsersSetDisplayNameParamsSchema = closedObject({
  profileId: UserProfileIdSchema,
  displayName: Type20.Union([UserProfileDisplayNameSchema, Type20.Null()])
});
var UsersSetDisplayNameResultSchema = closedObject({ profile: UserProfileSchema });
var UsersSetAvatarParamsSchema = closedObject({
  profileId: UserProfileIdSchema,
  mime: UserProfileAvatarMimeSchema,
  avatarBase64: Type20.String({ minLength: 1, maxLength: 7e5 })
});
var UsersSetAvatarResultSchema = closedObject({ profile: UserProfileSchema });

// packages/gateway-protocol/src/schema/channels.ts
import { Type as Type21 } from "typebox";
var TalkModeParamsSchema = closedObject({
  enabled: Type21.Boolean(),
  phase: Type21.Optional(Type21.String())
});
var TalkConfigParamsSchema = closedObject({
  includeSecrets: Type21.Optional(Type21.Boolean())
});
var TalkSpeakParamsSchema = closedObject({
  text: NonEmptyString,
  voiceId: Type21.Optional(Type21.String()),
  modelId: Type21.Optional(Type21.String()),
  outputFormat: Type21.Optional(Type21.String()),
  speed: Type21.Optional(Type21.Number()),
  rateWpm: Type21.Optional(Type21.Integer({ minimum: 1 })),
  stability: Type21.Optional(Type21.Number()),
  similarity: Type21.Optional(Type21.Number()),
  style: Type21.Optional(Type21.Number()),
  speakerBoost: Type21.Optional(Type21.Boolean()),
  seed: Type21.Optional(Type21.Integer({ minimum: 0 })),
  normalize: Type21.Optional(Type21.String()),
  language: Type21.Optional(Type21.String()),
  latencyTier: Type21.Optional(Type21.Integer({ minimum: 0 }))
});
var TtsSpeakParamsSchema = closedObject({
  text: NonEmptyString
});
var TalkModeSchema = Type21.Union([
  Type21.Literal("realtime"),
  Type21.Literal("stt-tts"),
  Type21.Literal("transcription")
]);
var TalkTransportSchema = Type21.Union([
  Type21.Literal("webrtc"),
  Type21.Literal("provider-websocket"),
  Type21.Literal("gateway-relay"),
  Type21.Literal("managed-room")
]);
var TalkBrainSchema = Type21.Union([
  Type21.Literal("agent-consult"),
  Type21.Literal("direct-tools"),
  Type21.Literal("none")
]);
var TalkAgentControlModeSchema = Type21.Union([
  Type21.Literal("status"),
  Type21.Literal("steer"),
  Type21.Literal("cancel"),
  Type21.Literal("followup")
]);
var TalkEventTypeSchema = Type21.Union([
  Type21.Literal("session.started"),
  Type21.Literal("session.ready"),
  Type21.Literal("session.closed"),
  Type21.Literal("session.error"),
  Type21.Literal("session.replaced"),
  Type21.Literal("turn.started"),
  Type21.Literal("turn.ended"),
  Type21.Literal("turn.cancelled"),
  Type21.Literal("capture.started"),
  Type21.Literal("capture.stopped"),
  Type21.Literal("capture.cancelled"),
  Type21.Literal("capture.once"),
  Type21.Literal("input.audio.delta"),
  Type21.Literal("input.audio.committed"),
  Type21.Literal("transcript.delta"),
  Type21.Literal("transcript.done"),
  Type21.Literal("output.text.delta"),
  Type21.Literal("output.text.done"),
  Type21.Literal("output.audio.started"),
  Type21.Literal("output.audio.delta"),
  Type21.Literal("output.audio.done"),
  Type21.Literal("tool.call"),
  Type21.Literal("tool.progress"),
  Type21.Literal("tool.result"),
  Type21.Literal("tool.error"),
  Type21.Literal("usage.metrics"),
  Type21.Literal("latency.metrics"),
  Type21.Literal("health.changed")
]);
var TURN_SCOPED_TALK_EVENT_TYPES = [
  "turn.started",
  "turn.ended",
  "turn.cancelled",
  "input.audio.delta",
  "input.audio.committed",
  "transcript.delta",
  "transcript.done",
  "output.text.delta",
  "output.text.done",
  "output.audio.started",
  "output.audio.delta",
  "output.audio.done",
  "tool.call",
  "tool.progress",
  "tool.result",
  "tool.error"
];
var CAPTURE_SCOPED_TALK_EVENT_TYPES = [
  "capture.started",
  "capture.stopped",
  "capture.cancelled",
  "capture.once"
];
function requireJsonSchemaProperties(properties) {
  const conditionalRequirementKey = ["th", "en"].join("");
  return Object.fromEntries([[conditionalRequirementKey, { required: properties }]]);
}
var TalkEventSchema = Type21.Object(
  {
    id: NonEmptyString,
    type: TalkEventTypeSchema,
    sessionId: NonEmptyString,
    turnId: Type21.Optional(Type21.String()),
    captureId: Type21.Optional(Type21.String()),
    seq: Type21.Integer({ minimum: 1 }),
    timestamp: NonEmptyString,
    mode: TalkModeSchema,
    transport: TalkTransportSchema,
    brain: TalkBrainSchema,
    provider: Type21.Optional(Type21.String()),
    final: Type21.Optional(Type21.Boolean()),
    callId: Type21.Optional(Type21.String()),
    itemId: Type21.Optional(Type21.String()),
    parentId: Type21.Optional(Type21.String()),
    payload: Type21.Unknown()
  },
  {
    additionalProperties: false,
    allOf: [
      {
        if: {
          properties: { type: { enum: TURN_SCOPED_TALK_EVENT_TYPES } },
          required: ["type"]
        },
        ...requireJsonSchemaProperties(["turnId"])
      },
      {
        if: {
          properties: { type: { enum: CAPTURE_SCOPED_TALK_EVENT_TYPES } },
          required: ["type"]
        },
        ...requireJsonSchemaProperties(["captureId"])
      }
    ]
  }
);
var VoiceIdString = Type21.String({ pattern: "^[A-Za-z0-9_-]{1,128}$" });
var TalkClientCreateParamsSchema = closedObject({
  sessionKey: Type21.Optional(NonEmptyString),
  voiceSessionId: Type21.Optional(VoiceIdString),
  provider: Type21.Optional(Type21.String()),
  model: Type21.Optional(Type21.String()),
  voice: Type21.Optional(Type21.String()),
  vadThreshold: Type21.Optional(Type21.Number()),
  silenceDurationMs: Type21.Optional(Type21.Integer({ minimum: 1 })),
  prefixPaddingMs: Type21.Optional(Type21.Integer({ minimum: 0 })),
  reasoningEffort: Type21.Optional(Type21.String()),
  mode: Type21.Optional(TalkModeSchema),
  transport: Type21.Optional(TalkTransportSchema),
  brain: Type21.Optional(TalkBrainSchema),
  capabilities: Type21.Optional(
    Type21.Array(Type21.Union([Type21.Literal("camera-frame"), Type21.Literal("voice-transcript")]), {
      uniqueItems: true
    })
  )
});
var TalkClientToolCallParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  voiceSessionId: Type21.Optional(VoiceIdString),
  callId: NonEmptyString,
  name: NonEmptyString,
  args: Type21.Optional(Type21.Unknown()),
  relaySessionId: Type21.Optional(NonEmptyString)
});
var TalkClientTranscriptParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  voiceSessionId: VoiceIdString,
  entryId: VoiceIdString,
  role: Type21.Union([Type21.Literal("user"), Type21.Literal("assistant")]),
  text: NonEmptyString,
  timestamp: Type21.Optional(Type21.Number())
});
var TalkClientCloseParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  voiceSessionId: VoiceIdString
});
var TalkClientMutationResultSchema = closedObject({
  ok: Type21.Literal(true)
});
var TalkClientToolCallResultSchema = closedObject({
  runId: NonEmptyString,
  idempotencyKey: NonEmptyString
});
var TalkClientSteerParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  text: NonEmptyString,
  mode: Type21.Optional(TalkAgentControlModeSchema)
});
var TalkAgentControlResultSchema = closedObject({
  ok: Type21.Boolean(),
  mode: TalkAgentControlModeSchema,
  sessionKey: NonEmptyString,
  sessionId: Type21.Optional(NonEmptyString),
  active: Type21.Boolean(),
  queued: Type21.Optional(Type21.Boolean()),
  aborted: Type21.Optional(Type21.Boolean()),
  target: Type21.Optional(Type21.Union([Type21.Literal("embedded_run"), Type21.Literal("reply_run")])),
  reason: Type21.Optional(Type21.String()),
  message: Type21.String(),
  speak: Type21.Boolean(),
  show: Type21.Boolean(),
  suppress: Type21.Boolean(),
  providerResult: Type21.Optional(
    closedObject({
      status: Type21.Literal("cancelled"),
      message: Type21.String()
    })
  ),
  enqueuedAtMs: Type21.Optional(Type21.Number()),
  deliveredAtMs: Type21.Optional(Type21.Number())
});
var TalkSessionJoinParamsSchema = closedObject({
  sessionId: NonEmptyString,
  token: NonEmptyString
});
var TalkSessionCreateParamsSchema = closedObject({
  sessionKey: Type21.Optional(Type21.String()),
  spawnedBy: Type21.Optional(NonEmptyString),
  provider: Type21.Optional(Type21.String()),
  model: Type21.Optional(Type21.String()),
  voice: Type21.Optional(Type21.String()),
  language: Type21.Optional(Type21.String({ pattern: "^[a-z]{2}$" })),
  vadThreshold: Type21.Optional(Type21.Number()),
  silenceDurationMs: Type21.Optional(Type21.Integer({ minimum: 1 })),
  prefixPaddingMs: Type21.Optional(Type21.Integer({ minimum: 0 })),
  reasoningEffort: Type21.Optional(Type21.String()),
  mode: Type21.Optional(TalkModeSchema),
  transport: Type21.Optional(TalkTransportSchema),
  brain: Type21.Optional(TalkBrainSchema),
  ttlMs: Type21.Optional(Type21.Integer({ minimum: 1e3, maximum: 36e5 }))
});
var TalkSessionAppendAudioParamsSchema = closedObject({
  sessionId: NonEmptyString,
  audioBase64: NonEmptyString,
  timestamp: Type21.Optional(Type21.Number())
});
var TalkSessionTurnParamsSchema = closedObject({
  sessionId: NonEmptyString,
  turnId: Type21.Optional(Type21.String())
});
var TalkSessionCancelTurnParamsSchema = closedObject({
  sessionId: NonEmptyString,
  turnId: Type21.Optional(Type21.String()),
  reason: Type21.Optional(Type21.String())
});
var TalkSessionCancelOutputParamsSchema = closedObject({
  sessionId: NonEmptyString,
  turnId: Type21.Optional(Type21.String()),
  reason: Type21.Optional(Type21.String())
});
var TalkSessionSubmitToolResultParamsSchema = closedObject({
  sessionId: NonEmptyString,
  callId: NonEmptyString,
  result: Type21.Unknown(),
  options: Type21.Optional(
    closedObject({
      suppressResponse: Type21.Optional(Type21.Boolean()),
      willContinue: Type21.Optional(Type21.Boolean())
    })
  )
});
var TalkSessionSteerParamsSchema = closedObject({
  sessionId: NonEmptyString,
  sessionKey: Type21.Optional(NonEmptyString),
  text: NonEmptyString,
  mode: Type21.Optional(TalkAgentControlModeSchema)
});
var TalkSessionCloseParamsSchema = closedObject({
  sessionId: NonEmptyString
});
var TalkSessionManagedRoomStateSchema = closedObject({
  activeClientId: Type21.Optional(Type21.String()),
  activeTurnId: Type21.Optional(Type21.String()),
  recentTalkEvents: Type21.Array(TalkEventSchema)
});
var TalkSessionManagedRoomRecordSchema = closedObject({
  id: NonEmptyString,
  roomId: NonEmptyString,
  roomUrl: NonEmptyString,
  sessionKey: NonEmptyString,
  sessionId: Type21.Optional(Type21.String()),
  channel: Type21.Optional(Type21.String()),
  target: Type21.Optional(Type21.String()),
  provider: Type21.Optional(Type21.String()),
  model: Type21.Optional(Type21.String()),
  voice: Type21.Optional(Type21.String()),
  mode: TalkModeSchema,
  transport: TalkTransportSchema,
  brain: TalkBrainSchema,
  createdAt: Type21.Number(),
  expiresAt: Type21.Number(),
  room: TalkSessionManagedRoomStateSchema
});
var TalkCatalogParamsSchema = closedObject({});
var TalkCatalogProviderSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  configured: Type21.Boolean(),
  aliases: Type21.Optional(Type21.Array(NonEmptyString)),
  models: Type21.Optional(Type21.Array(Type21.String())),
  voices: Type21.Optional(Type21.Array(Type21.String())),
  defaultModel: Type21.Optional(Type21.String()),
  modes: Type21.Optional(Type21.Array(TalkModeSchema)),
  transports: Type21.Optional(Type21.Array(TalkTransportSchema)),
  brains: Type21.Optional(Type21.Array(TalkBrainSchema)),
  inputAudioFormats: Type21.Optional(
    Type21.Array(
      closedObject({
        encoding: Type21.Union([Type21.Literal("pcm16"), Type21.Literal("g711_ulaw")]),
        sampleRateHz: Type21.Integer({ minimum: 1 }),
        channels: Type21.Integer({ minimum: 1 })
      })
    )
  ),
  outputAudioFormats: Type21.Optional(
    Type21.Array(
      closedObject({
        encoding: Type21.Union([Type21.Literal("pcm16"), Type21.Literal("g711_ulaw")]),
        sampleRateHz: Type21.Integer({ minimum: 1 }),
        channels: Type21.Integer({ minimum: 1 })
      })
    )
  ),
  supportsBrowserSession: Type21.Optional(Type21.Boolean()),
  supportsBargeIn: Type21.Optional(Type21.Boolean()),
  supportsToolCalls: Type21.Optional(Type21.Boolean()),
  supportsVideoFrames: Type21.Optional(Type21.Boolean()),
  supportsSessionResumption: Type21.Optional(Type21.Boolean())
});
var TalkCatalogProviderGroupSchema = closedObject({
  ready: Type21.Optional(Type21.Boolean()),
  activeProvider: Type21.Optional(Type21.String()),
  providers: Type21.Array(TalkCatalogProviderSchema)
});
var TalkCatalogResultSchema = closedObject({
  modes: Type21.Array(TalkModeSchema),
  transports: Type21.Array(TalkTransportSchema),
  brains: Type21.Array(TalkBrainSchema),
  speech: TalkCatalogProviderGroupSchema,
  transcription: TalkCatalogProviderGroupSchema,
  realtime: TalkCatalogProviderGroupSchema
});
var BrowserRealtimeAudioContractSchema = closedObject({
  inputEncoding: Type21.Union([Type21.Literal("pcm16"), Type21.Literal("g711_ulaw")]),
  inputSampleRateHz: Type21.Integer({ minimum: 1 }),
  outputEncoding: Type21.Union([Type21.Literal("pcm16"), Type21.Literal("g711_ulaw")]),
  outputSampleRateHz: Type21.Integer({ minimum: 1 })
});
var TalkSessionCreateResultSchema = closedObject({
  sessionId: NonEmptyString,
  provider: Type21.Optional(Type21.String()),
  mode: TalkModeSchema,
  transport: TalkTransportSchema,
  brain: TalkBrainSchema,
  relaySessionId: Type21.Optional(NonEmptyString),
  transcriptionSessionId: Type21.Optional(NonEmptyString),
  handoffId: Type21.Optional(NonEmptyString),
  roomId: Type21.Optional(NonEmptyString),
  roomUrl: Type21.Optional(NonEmptyString),
  token: Type21.Optional(NonEmptyString),
  audio: Type21.Optional(Type21.Unknown()),
  model: Type21.Optional(Type21.String()),
  voice: Type21.Optional(Type21.String()),
  expiresAt: Type21.Optional(Type21.Number())
});
var TalkSessionTurnResultSchema = closedObject({
  ok: Type21.Boolean(),
  turnId: Type21.Optional(Type21.String()),
  events: Type21.Optional(Type21.Array(TalkEventSchema))
});
var TalkSessionJoinResultSchema = TalkSessionManagedRoomRecordSchema;
var TalkSessionOkResultSchema = closedObject({
  ok: Type21.Boolean()
});
var BrowserRealtimeWebRtcSdpSessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type21.Literal("webrtc"),
  voiceSessionId: NonEmptyString,
  clientSecret: NonEmptyString,
  offerUrl: Type21.Optional(Type21.String()),
  offerHeaders: Type21.Optional(Type21.Record(Type21.String(), Type21.String())),
  model: Type21.Optional(Type21.String()),
  voice: Type21.Optional(Type21.String()),
  expiresAt: Type21.Optional(Type21.Number())
});
var BrowserRealtimeJsonPcmWebSocketSessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type21.Literal("provider-websocket"),
  voiceSessionId: NonEmptyString,
  protocol: NonEmptyString,
  clientSecret: NonEmptyString,
  websocketUrl: NonEmptyString,
  audio: BrowserRealtimeAudioContractSchema,
  initialMessage: Type21.Optional(Type21.Unknown()),
  model: Type21.Optional(Type21.String()),
  voice: Type21.Optional(Type21.String()),
  expiresAt: Type21.Optional(Type21.Number())
});
var BrowserRealtimeGatewayRelaySessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type21.Literal("gateway-relay"),
  // Server-owned: older gateways omit it and clients derive it from relaySessionId.
  voiceSessionId: Type21.Optional(NonEmptyString),
  relaySessionId: NonEmptyString,
  audio: BrowserRealtimeAudioContractSchema,
  model: Type21.Optional(Type21.String()),
  voice: Type21.Optional(Type21.String()),
  expiresAt: Type21.Optional(Type21.Number())
});
var BrowserRealtimeManagedRoomSessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type21.Literal("managed-room"),
  // Server-owned rooms carry no client voice bookkeeping yet.
  voiceSessionId: Type21.Optional(NonEmptyString),
  roomUrl: NonEmptyString,
  token: Type21.Optional(Type21.String()),
  model: Type21.Optional(Type21.String()),
  voice: Type21.Optional(Type21.String()),
  expiresAt: Type21.Optional(Type21.Number())
});
var TalkClientCreateResultSchema = Type21.Union([
  BrowserRealtimeWebRtcSdpSessionSchema,
  BrowserRealtimeJsonPcmWebSocketSessionSchema,
  BrowserRealtimeGatewayRelaySessionSchema,
  BrowserRealtimeManagedRoomSessionSchema
]);
var talkProviderFieldSchemas = {
  apiKey: Type21.Optional(SecretInputSchema)
};
var TalkProviderConfigSchema = Type21.Object(talkProviderFieldSchemas, {
  additionalProperties: true
});
var TalkRealtimeConfigSchema = closedObject({
  provider: Type21.Optional(Type21.String()),
  providers: Type21.Optional(Type21.Record(Type21.String(), TalkProviderConfigSchema)),
  model: Type21.Optional(Type21.String()),
  speakerVoice: Type21.Optional(Type21.String()),
  speakerVoiceId: Type21.Optional(Type21.String()),
  voice: Type21.Optional(Type21.String()),
  instructions: Type21.Optional(Type21.String()),
  mode: Type21.Optional(TalkModeSchema),
  transport: Type21.Optional(TalkTransportSchema),
  vadThreshold: Type21.Optional(Type21.Number({ minimum: 0, maximum: 1 })),
  silenceDurationMs: Type21.Optional(Type21.Integer({ minimum: 1 })),
  prefixPaddingMs: Type21.Optional(Type21.Integer({ minimum: 0 })),
  reasoningEffort: Type21.Optional(Type21.String({ minLength: 1 })),
  brain: Type21.Optional(TalkBrainSchema),
  consultRouting: Type21.Optional(
    Type21.Union([Type21.Literal("provider-direct"), Type21.Literal("force-agent-consult")])
  )
});
var ResolvedTalkConfigSchema = closedObject({
  provider: Type21.String(),
  config: TalkProviderConfigSchema
});
var TalkConfigSchema = closedObject({
  provider: Type21.Optional(Type21.String()),
  providers: Type21.Optional(Type21.Record(Type21.String(), TalkProviderConfigSchema)),
  realtime: Type21.Optional(TalkRealtimeConfigSchema),
  resolved: Type21.Optional(ResolvedTalkConfigSchema),
  consultThinkingLevel: Type21.Optional(Type21.String()),
  consultFastMode: Type21.Optional(Type21.Boolean()),
  speechLocale: Type21.Optional(Type21.String()),
  interruptOnSpeech: Type21.Optional(Type21.Boolean()),
  silenceTimeoutMs: Type21.Optional(Type21.Integer({ minimum: 1 }))
});
var TalkConfigResultSchema = closedObject({
  config: closedObject({
    talk: Type21.Optional(TalkConfigSchema),
    session: Type21.Optional(
      closedObject({
        mainKey: Type21.Optional(Type21.String())
      })
    ),
    ui: Type21.Optional(
      closedObject({
        seamColor: Type21.Optional(Type21.String())
      })
    )
  })
});
var TalkSpeakResultSchema = closedObject({
  audioBase64: NonEmptyString,
  provider: NonEmptyString,
  outputFormat: Type21.Optional(Type21.String()),
  voiceCompatible: Type21.Optional(Type21.Boolean()),
  mimeType: Type21.Optional(Type21.String()),
  fileExtension: Type21.Optional(Type21.String())
});
var TtsSpeakResultSchema = closedObject({
  audioBase64: NonEmptyString,
  provider: NonEmptyString,
  outputFormat: Type21.Optional(Type21.String()),
  mimeType: Type21.Optional(Type21.String()),
  fileExtension: Type21.Optional(Type21.String())
});
var ChannelsStatusParamsSchema = closedObject({
  probe: Type21.Optional(Type21.Boolean()),
  timeoutMs: Type21.Optional(Type21.Integer({ minimum: 0 })),
  channel: Type21.Optional(NonEmptyString)
});
var ChannelAccountSnapshotSchema = Type21.Object(
  {
    accountId: NonEmptyString,
    name: Type21.Optional(Type21.String()),
    enabled: Type21.Optional(Type21.Boolean()),
    configured: Type21.Optional(Type21.Boolean()),
    linked: Type21.Optional(Type21.Boolean()),
    running: Type21.Optional(Type21.Boolean()),
    connected: Type21.Optional(Type21.Boolean()),
    reconnectAttempts: Type21.Optional(Type21.Integer({ minimum: 0 })),
    lastConnectedAt: Type21.Optional(Type21.Integer({ minimum: 0 })),
    lastError: Type21.Optional(Type21.String()),
    healthState: Type21.Optional(Type21.String()),
    lastStartAt: Type21.Optional(Type21.Integer({ minimum: 0 })),
    lastStopAt: Type21.Optional(Type21.Integer({ minimum: 0 })),
    lastInboundAt: Type21.Optional(Type21.Integer({ minimum: 0 })),
    lastOutboundAt: Type21.Optional(Type21.Integer({ minimum: 0 })),
    lastTransportActivityAt: Type21.Optional(Type21.Integer({ minimum: 0 })),
    busy: Type21.Optional(Type21.Boolean()),
    activeRuns: Type21.Optional(Type21.Integer({ minimum: 0 })),
    lastRunActivityAt: Type21.Optional(Type21.Integer({ minimum: 0 })),
    lastProbeAt: Type21.Optional(Type21.Integer({ minimum: 0 })),
    mode: Type21.Optional(Type21.String()),
    dmPolicy: Type21.Optional(Type21.String()),
    allowFrom: Type21.Optional(Type21.Array(Type21.String())),
    tokenSource: Type21.Optional(Type21.String()),
    botTokenSource: Type21.Optional(Type21.String()),
    appTokenSource: Type21.Optional(Type21.String()),
    baseUrl: Type21.Optional(Type21.String()),
    allowUnmentionedGroups: Type21.Optional(Type21.Boolean()),
    cliPath: Type21.Optional(Type21.Union([Type21.String(), Type21.Null()])),
    dbPath: Type21.Optional(Type21.Union([Type21.String(), Type21.Null()])),
    port: Type21.Optional(Type21.Union([Type21.Integer({ minimum: 0 }), Type21.Null()])),
    probe: Type21.Optional(Type21.Unknown()),
    audit: Type21.Optional(Type21.Unknown()),
    application: Type21.Optional(Type21.Unknown())
  },
  { additionalProperties: true }
);
var ChannelUiMetaSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  detailLabel: NonEmptyString,
  systemImage: Type21.Optional(Type21.String())
});
var ChannelEventLoopHealthSchema = closedObject({
  degraded: Type21.Boolean(),
  reasons: Type21.Array(
    Type21.Union([
      Type21.Literal("event_loop_delay"),
      Type21.Literal("event_loop_utilization"),
      Type21.Literal("cpu")
    ])
  ),
  intervalMs: Type21.Integer({ minimum: 0 }),
  delayP99Ms: Type21.Number({ minimum: 0 }),
  delayMaxMs: Type21.Number({ minimum: 0 }),
  utilization: Type21.Number({ minimum: 0 }),
  cpuCoreRatio: Type21.Number({ minimum: 0 })
});
var ChannelsStatusResultSchema = closedObject({
  ts: Type21.Integer({ minimum: 0 }),
  channelOrder: Type21.Array(NonEmptyString),
  channelLabels: Type21.Record(NonEmptyString, NonEmptyString),
  channelDetailLabels: Type21.Optional(Type21.Record(NonEmptyString, NonEmptyString)),
  channelSystemImages: Type21.Optional(Type21.Record(NonEmptyString, NonEmptyString)),
  channelMeta: Type21.Optional(Type21.Array(ChannelUiMetaSchema)),
  channels: Type21.Record(NonEmptyString, Type21.Unknown()),
  channelAccounts: Type21.Record(NonEmptyString, Type21.Array(ChannelAccountSnapshotSchema)),
  channelDefaultAccountId: Type21.Record(NonEmptyString, NonEmptyString),
  eventLoop: Type21.Optional(ChannelEventLoopHealthSchema),
  partial: Type21.Optional(Type21.Boolean()),
  warnings: Type21.Optional(Type21.Array(Type21.String()))
});
var ChannelsLogoutParamsSchema = closedObject({
  channel: NonEmptyString,
  accountId: Type21.Optional(Type21.String())
});
var ChannelsStopParamsSchema = closedObject({
  channel: NonEmptyString,
  accountId: Type21.Optional(Type21.String())
});
var ChannelsStartParamsSchema = closedObject({
  channel: NonEmptyString,
  accountId: Type21.Optional(Type21.String())
});
var WebLoginStartParamsSchema = closedObject({
  force: Type21.Optional(Type21.Boolean()),
  timeoutMs: Type21.Optional(Type21.Integer({ minimum: 0 })),
  verbose: Type21.Optional(Type21.Boolean()),
  accountId: Type21.Optional(Type21.String())
});
var QrDataUrlSchema = Type21.String({
  maxLength: 16384,
  pattern: "^data:image/png;base64,"
});
var WebLoginWaitParamsSchema = closedObject({
  timeoutMs: Type21.Optional(Type21.Integer({ minimum: 0 })),
  accountId: Type21.Optional(Type21.String()),
  currentQrDataUrl: Type21.Optional(QrDataUrlSchema)
});

// packages/gateway-protocol/src/schema/talk-marks.ts
var TalkSessionAcknowledgeMarkParamsSchema = closedObject({
  sessionId: NonEmptyString,
  markName: NonEmptyString
});

// packages/gateway-protocol/src/schema/commands.ts
import { Type as Type22 } from "typebox";
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
var BoundedNonEmptyString = (maxLength) => Type22.String({ minLength: 1, maxLength });
var CommandSourceSchema = Type22.Union([
  Type22.Literal("native"),
  Type22.Literal("skill"),
  Type22.Literal("plugin")
]);
var CommandScopeSchema = Type22.Union([
  Type22.Literal("text"),
  Type22.Literal("native"),
  Type22.Literal("both")
]);
var CommandCategorySchema = Type22.Union([
  Type22.Literal("session"),
  Type22.Literal("options"),
  Type22.Literal("status"),
  Type22.Literal("management"),
  Type22.Literal("media"),
  Type22.Literal("tools"),
  Type22.Literal("docks")
]);
var CommandArgChoiceSchema = closedObject({
  value: Type22.String({ maxLength: COMMAND_CHOICE_VALUE_MAX_LENGTH }),
  label: Type22.String({ maxLength: COMMAND_CHOICE_LABEL_MAX_LENGTH })
});
var CommandArgSchema = closedObject({
  name: BoundedNonEmptyString(COMMAND_ARG_NAME_MAX_LENGTH),
  description: Type22.String({ maxLength: COMMAND_ARG_DESCRIPTION_MAX_LENGTH }),
  type: Type22.Union([Type22.Literal("string"), Type22.Literal("number"), Type22.Literal("boolean")]),
  required: Type22.Optional(Type22.Boolean()),
  choices: Type22.Optional(
    Type22.Array(CommandArgChoiceSchema, { maxItems: COMMAND_ARG_CHOICES_MAX_ITEMS })
  ),
  dynamic: Type22.Optional(Type22.Boolean())
});
var CommandEntrySchema = closedObject({
  name: BoundedNonEmptyString(COMMAND_NAME_MAX_LENGTH),
  nativeName: Type22.Optional(BoundedNonEmptyString(COMMAND_NAME_MAX_LENGTH)),
  textAliases: Type22.Optional(
    Type22.Array(BoundedNonEmptyString(COMMAND_NAME_MAX_LENGTH), {
      maxItems: COMMAND_ALIAS_MAX_ITEMS
    })
  ),
  description: Type22.String({ maxLength: COMMAND_DESCRIPTION_MAX_LENGTH }),
  category: Type22.Optional(CommandCategorySchema),
  source: CommandSourceSchema,
  scope: CommandScopeSchema,
  acceptsArgs: Type22.Boolean(),
  args: Type22.Optional(Type22.Array(CommandArgSchema, { maxItems: COMMAND_ARGS_MAX_ITEMS }))
});
var CommandsListParamsSchema = closedObject({
  agentId: Type22.Optional(NonEmptyString),
  provider: Type22.Optional(NonEmptyString),
  scope: Type22.Optional(CommandScopeSchema),
  includeArgs: Type22.Optional(Type22.Boolean())
});
var CommandsListResultSchema = closedObject({
  commands: Type22.Array(CommandEntrySchema, { maxItems: COMMAND_LIST_MAX_ITEMS })
});

// packages/gateway-protocol/src/schema/config.ts
import { Type as Type23 } from "typebox";
var ConfigSchemaLookupPathString = Type23.String({
  minLength: 1,
  maxLength: 1024,
  pattern: "^[A-Za-z0-9_./\\[\\]\\-*]+$"
});
var ConfigDeliveryContextSchema = closedObject({
  channel: Type23.Optional(Type23.String()),
  to: Type23.Optional(Type23.String()),
  accountId: Type23.Optional(Type23.String()),
  threadId: Type23.Optional(Type23.Union([Type23.String(), Type23.Number()]))
});
var ConfigGetParamsSchema = closedObject({});
var ConfigSetParamsSchema = closedObject({
  raw: NonEmptyString,
  baseHash: Type23.Optional(NonEmptyString)
});
var ConfigApplyLikeParamProperties = {
  raw: NonEmptyString,
  baseHash: Type23.Optional(NonEmptyString),
  sessionKey: Type23.Optional(Type23.String()),
  deliveryContext: Type23.Optional(ConfigDeliveryContextSchema),
  note: Type23.Optional(Type23.String()),
  restartDelayMs: Type23.Optional(Type23.Integer({ minimum: 0 }))
};
var ConfigApplyLikeParamsSchema = closedObject(ConfigApplyLikeParamProperties);
var ConfigApplyParamsSchema = ConfigApplyLikeParamsSchema;
var ConfigPatchParamsSchema = closedObject({
  ...ConfigApplyLikeParamProperties,
  replacePaths: Type23.Optional(Type23.Array(NonEmptyString, { maxItems: 256 }))
});
var ConfigSchemaParamsSchema = closedObject({});
var ConfigSchemaLookupParamsSchema = closedObject({
  path: ConfigSchemaLookupPathString
});
var UpdateStatusParamsSchema = closedObject({});
var UpdateRunParamsSchema = closedObject({
  sessionKey: Type23.Optional(Type23.String()),
  deliveryContext: Type23.Optional(ConfigDeliveryContextSchema),
  note: Type23.Optional(Type23.String()),
  continuationMessage: Type23.Optional(Type23.String()),
  restartDelayMs: Type23.Optional(Type23.Integer({ minimum: 0 })),
  timeoutMs: Type23.Optional(Type23.Integer({ minimum: 1 }))
});
var ConfigUiHintSchema = closedObject({
  label: Type23.Optional(Type23.String()),
  help: Type23.Optional(Type23.String()),
  tags: Type23.Optional(Type23.Array(Type23.String())),
  group: Type23.Optional(Type23.String()),
  order: Type23.Optional(Type23.Integer()),
  advanced: Type23.Optional(Type23.Boolean()),
  sensitive: Type23.Optional(Type23.Boolean()),
  placeholder: Type23.Optional(Type23.String()),
  itemTemplate: Type23.Optional(Type23.Unknown())
});
var ConfigSchemaResponseSchema = closedObject({
  schema: Type23.Unknown(),
  uiHints: Type23.Record(Type23.String(), ConfigUiHintSchema),
  version: NonEmptyString,
  generatedAt: NonEmptyString
});
var ConfigSchemaLookupChildSchema = closedObject({
  key: NonEmptyString,
  path: NonEmptyString,
  type: Type23.Optional(Type23.Union([Type23.String(), Type23.Array(Type23.String())])),
  required: Type23.Boolean(),
  hasChildren: Type23.Boolean(),
  reloadKind: Type23.Optional(
    Type23.Union([Type23.Literal("restart"), Type23.Literal("hot"), Type23.Literal("none")])
  ),
  hint: Type23.Optional(ConfigUiHintSchema),
  hintPath: Type23.Optional(Type23.String())
});
var ConfigSchemaLookupResultSchema = closedObject({
  path: NonEmptyString,
  schema: Type23.Unknown(),
  reloadKind: Type23.Optional(
    Type23.Union([Type23.Literal("restart"), Type23.Literal("hot"), Type23.Literal("none")])
  ),
  hint: Type23.Optional(ConfigUiHintSchema),
  hintPath: Type23.Optional(Type23.String()),
  children: Type23.Array(ConfigSchemaLookupChildSchema)
});

// packages/gateway-protocol/src/schema/openclaw.ts
import { Type as Type25 } from "typebox";

// packages/gateway-protocol/src/schema/wizard.ts
import { Type as Type24 } from "typebox";
var WizardRunStatusSchema = Type24.Union([
  Type24.Literal("running"),
  Type24.Literal("done"),
  Type24.Literal("cancelled"),
  Type24.Literal("error")
]);
var WizardStartParamsSchema = closedObject({
  mode: Type24.Optional(Type24.Union([Type24.Literal("local"), Type24.Literal("remote")])),
  workspace: Type24.Optional(Type24.String()),
  // "setup" (default) runs full onboarding; "channels" runs the guided
  // channel-setup flow (openclaw channels add) over the same step protocol.
  flow: Type24.Optional(Type24.Union([Type24.Literal("setup"), Type24.Literal("channels")])),
  // Preselected channel id for flow "channels" (e.g. "telegram").
  channel: Type24.Optional(NonEmptyString)
});
var WizardAnswerSchema = closedObject({
  stepId: NonEmptyString,
  value: Type24.Optional(Type24.Unknown())
});
var WizardNextParamsSchema = closedObject({
  sessionId: NonEmptyString,
  answer: Type24.Optional(WizardAnswerSchema)
});
var WizardSessionIdParamsSchema = closedObject({
  sessionId: NonEmptyString
});
var WizardCancelParamsSchema = WizardSessionIdParamsSchema;
var WizardStatusParamsSchema = WizardSessionIdParamsSchema;
var WizardStepOptionSchema = closedObject({
  value: Type24.Unknown(),
  label: NonEmptyString,
  hint: Type24.Optional(Type24.String())
});
var WizardDeviceCodeSchema = closedObject({
  code: NonEmptyString,
  expiresInMinutes: Type24.Optional(Type24.Integer({ minimum: 1, maximum: 1440 })),
  message: Type24.Optional(Type24.String())
});
var WizardStepSchema = closedObject({
  id: NonEmptyString,
  type: Type24.Union([
    Type24.Literal("note"),
    Type24.Literal("select"),
    Type24.Literal("text"),
    Type24.Literal("confirm"),
    Type24.Literal("multiselect"),
    Type24.Literal("progress"),
    Type24.Literal("action")
  ]),
  title: Type24.Optional(Type24.String()),
  message: Type24.Optional(Type24.String()),
  format: Type24.Optional(Type24.Union([Type24.Literal("plain")])),
  options: Type24.Optional(Type24.Array(WizardStepOptionSchema)),
  initialValue: Type24.Optional(Type24.Unknown()),
  placeholder: Type24.Optional(Type24.String()),
  sensitive: Type24.Optional(Type24.Boolean()),
  executor: Type24.Optional(Type24.Union([Type24.Literal("gateway"), Type24.Literal("client")])),
  externalUrl: Type24.Optional(Type24.String()),
  deviceCode: Type24.Optional(WizardDeviceCodeSchema)
});
var WizardConfiguredAccountSchema = closedObject({
  channel: NonEmptyString,
  accountId: NonEmptyString
});
var WizardResultFields = {
  done: Type24.Boolean(),
  step: Type24.Optional(WizardStepSchema),
  status: Type24.Optional(WizardRunStatusSchema),
  error: Type24.Optional(Type24.String()),
  // What the flow actually configured; set on the terminal result of
  // wizard.start flow "channels" sessions so clients run channel-specific
  // completion (e.g. WhatsApp QR linking for the right account) from the
  // real outcome rather than the preselection.
  channels: Type24.Optional(Type24.Array(NonEmptyString)),
  accounts: Type24.Optional(Type24.Array(WizardConfiguredAccountSchema))
};
var WizardNextResultSchema = closedObject(WizardResultFields);
var WizardStartResultSchema = closedObject({
  sessionId: NonEmptyString,
  ...WizardResultFields
});
var WizardStatusResultSchema = closedObject({
  status: WizardRunStatusSchema,
  error: Type24.Optional(Type24.String())
});

// packages/gateway-protocol/src/schema/openclaw.ts
var SystemAgentChatParamsSchema = closedObject({
  sessionId: NonEmptyString,
  message: Type25.Optional(Type25.String()),
  /** Seeds a purpose-specific first greeting for a fresh conversation. */
  welcomeVariant: Type25.Optional(
    Type25.Union([Type25.Literal("onboarding"), Type25.Literal("new-agent")])
  ),
  /** Drop any in-flight approval/wizard state and start the session over. */
  reset: Type25.Optional(Type25.Boolean()),
  /** Host-only regular-agent delegation context. Never model-authored. */
  delegation: Type25.Optional(
    closedObject({
      agentId: Type25.Optional(NonEmptyString),
      sessionKey: Type25.Optional(NonEmptyString),
      turnSourceChannel: Type25.Optional(NonEmptyString),
      turnSourceTo: Type25.Optional(NonEmptyString),
      turnSourceAccountId: Type25.Optional(NonEmptyString),
      turnSourceThreadId: Type25.Optional(Type25.Union([Type25.String(), Type25.Number()]))
    })
  )
});
var SystemAgentChatQuestionSchema = closedObject({
  id: NonEmptyString,
  header: NonEmptyString,
  question: NonEmptyString,
  options: Type25.Array(
    closedObject({
      label: NonEmptyString,
      description: Type25.Optional(Type25.String()),
      recommended: Type25.Optional(Type25.Boolean()),
      /** Message text a client sends when this option is chosen; defaults to label. */
      reply: Type25.Optional(NonEmptyString)
    }),
    { minItems: 2, maxItems: 4 }
  ),
  /** Free-text answers are also accepted for this question. */
  isOther: Type25.Optional(Type25.Boolean())
});
var SystemAgentChatResultSchema = closedObject({
  sessionId: NonEmptyString,
  reply: NonEmptyString,
  /** The next reply is a hosted-wizard secret and clients must mask its input/echo. */
  sensitive: Type25.Optional(Type25.Boolean()),
  /** The hosted wizard will consume the next message as its current step answer. */
  wizardInputPending: Type25.Optional(Type25.Boolean()),
  action: Type25.Union([
    Type25.Literal("none"),
    // The user asked to talk to their agent; clients should move to their
    // normal agent chat surface.
    Type25.Literal("open-agent"),
    Type25.Literal("exit")
  ]),
  /** Optional localized-draft intent for an `open-agent` handoff. */
  agentDraft: Type25.Optional(Type25.Literal("hatch")),
  /** Destination agent for a specific `open-agent` handoff. */
  agentId: Type25.Optional(NonEmptyString),
  needsApproval: Type25.Optional(Type25.Boolean()),
  proposalId: Type25.Optional(NonEmptyString),
  question: Type25.Optional(SystemAgentChatQuestionSchema)
});
var SystemAgentChatHistoryParamsSchema = closedObject({
  limit: Type25.Optional(Type25.Integer({ minimum: 1, maximum: 500, default: 100 }))
});
var SystemAgentChatHistoryTurnSchema = closedObject({
  role: Type25.Union([Type25.Literal("user"), Type25.Literal("assistant")]),
  text: Type25.String(),
  at: Type25.Number()
});
var SystemAgentChatHistoryResultSchema = closedObject({
  turns: Type25.Array(SystemAgentChatHistoryTurnSchema)
});
var SystemChangeKindSchema = Type25.Union([
  Type25.Literal("operation"),
  Type25.Literal("config-write"),
  Type25.Literal("external-edit")
]);
var SystemChangeSourceSchema = Type25.Union([
  Type25.Literal("system-agent"),
  Type25.Literal("doctor"),
  Type25.Literal("config-rpc"),
  Type25.Literal("cli"),
  Type25.Literal("plugin-install"),
  Type25.Literal("external"),
  Type25.Literal("unknown")
]);
var SystemChangeEntrySchema = closedObject({
  id: NonEmptyString,
  at: Type25.Number(),
  kind: SystemChangeKindSchema,
  source: SystemChangeSourceSchema,
  summary: Type25.String(),
  changedPaths: Type25.Optional(Type25.Array(Type25.String())),
  invalid: Type25.Optional(Type25.Boolean()),
  opaqueChange: Type25.Optional(Type25.Boolean())
});
var SystemChangesListParamsSchema = closedObject({
  limit: Type25.Optional(Type25.Integer({ minimum: 1, maximum: 200, default: 50 })),
  beforeCursor: Type25.Optional(NonEmptyString)
});
var SystemChangesListResultSchema = closedObject({
  entries: Type25.Array(SystemChangeEntrySchema),
  nextCursor: Type25.Optional(NonEmptyString)
});
var SystemAgentSetupDetectParamsSchema = closedObject({});
var ProviderAutoSetupInferenceKind = Type25.TemplateLiteral("provider-auto:${string}", {
  pattern: "^provider-auto:.+$"
});
var SetupInferenceHttpsUrl = Type25.String({
  minLength: 1,
  maxLength: 2048,
  pattern: "^https://"
});
var SetupInferenceKind = Type25.Union([
  Type25.Literal("existing-model"),
  Type25.Literal("openai-api-key"),
  Type25.Literal("anthropic-api-key"),
  Type25.Literal("claude-cli"),
  Type25.Literal("codex-cli"),
  Type25.Literal("gemini-cli"),
  ProviderAutoSetupInferenceKind
]);
var SetupInferenceStatus = Type25.Union([
  Type25.Literal("ok"),
  Type25.Literal("auth"),
  Type25.Literal("rate_limit"),
  Type25.Literal("billing"),
  Type25.Literal("timeout"),
  Type25.Literal("format"),
  Type25.Literal("unavailable"),
  Type25.Literal("unknown")
]);
var SetupInferenceFailureStatus = Type25.Union([
  Type25.Literal("auth"),
  Type25.Literal("rate_limit"),
  Type25.Literal("billing"),
  Type25.Literal("timeout"),
  Type25.Literal("format"),
  Type25.Literal("unavailable"),
  Type25.Literal("unknown")
]);
var SystemAgentSetupDetectResultSchema = closedObject({
  candidates: Type25.Array(
    closedObject({
      kind: SetupInferenceKind,
      label: NonEmptyString,
      detail: Type25.String(),
      modelRef: NonEmptyString,
      recommended: Type25.Boolean(),
      /** true: verified; false: definitively logged out; absent: unknown. */
      credentials: Type25.Optional(Type25.Boolean()),
      icon: Type25.Optional(SetupInferenceHttpsUrl),
      website: Type25.Optional(SetupInferenceHttpsUrl)
    })
  ),
  unavailableCandidates: Type25.Optional(
    Type25.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString,
        detail: Type25.String(),
        reason: NonEmptyString
      })
    )
  ),
  /** Text-inference key/token methods exposed by the Gateway provider registry. */
  manualProviders: Type25.Array(
    closedObject({
      /** Opaque provider-auth choice sent back during activation. */
      id: NonEmptyString,
      label: NonEmptyString,
      hint: Type25.Optional(Type25.String()),
      icon: Type25.Optional(SetupInferenceHttpsUrl),
      website: Type25.Optional(SetupInferenceHttpsUrl)
    })
  ),
  /** Provider-owned browser and device-code login methods. */
  authOptions: Type25.Optional(
    Type25.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString,
        hint: Type25.Optional(Type25.String()),
        groupLabel: Type25.Optional(Type25.String()),
        icon: Type25.Optional(SetupInferenceHttpsUrl),
        website: Type25.Optional(SetupInferenceHttpsUrl),
        kind: Type25.Union([Type25.Literal("oauth"), Type25.Literal("device-code")]),
        featured: Type25.Boolean()
      })
    )
  ),
  recommendedInstalls: Type25.Optional(
    Type25.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString,
        hint: NonEmptyString,
        website: SetupInferenceHttpsUrl,
        icon: SetupInferenceHttpsUrl
      })
    )
  ),
  workspace: NonEmptyString,
  codexAppServerDetected: Type25.Optional(Type25.Boolean()),
  configuredModel: Type25.Optional(Type25.String()),
  setupComplete: Type25.Boolean()
});
var SystemAgentSetupVerifyParamsSchema = closedObject({});
var SystemAgentSetupVerifyResultSchema = Type25.Union([
  closedObject({
    ok: Type25.Literal(true),
    modelRef: NonEmptyString,
    latencyMs: Type25.Number()
  }),
  closedObject({
    ok: Type25.Literal(false),
    status: SetupInferenceFailureStatus,
    error: NonEmptyString
  })
]);
var SystemAgentSetupActivateParamsSchema = closedObject({
  kind: Type25.Union([
    Type25.Literal("existing-model"),
    Type25.Literal("openai-api-key"),
    Type25.Literal("anthropic-api-key"),
    Type25.Literal("claude-cli"),
    Type25.Literal("codex-cli"),
    Type25.Literal("gemini-cli"),
    ProviderAutoSetupInferenceKind,
    Type25.Literal("api-key")
  ]),
  /** Exact detected model for this route; prevents detect/activate drift. */
  modelRef: Type25.Optional(NonEmptyString),
  /** Manual step only: opaque provider-auth choice returned by detection. */
  authChoice: Type25.Optional(Type25.String()),
  /** Manual step only: the pasted API key or token; masked by clients, never echoed. */
  apiKey: Type25.Optional(Type25.String()),
  workspace: Type25.Optional(Type25.String())
});
var SystemAgentSetupActivateResultSchema = closedObject({
  ok: Type25.Boolean(),
  /** Present on success: the model ref that answered the live test. */
  modelRef: Type25.Optional(Type25.String()),
  latencyMs: Type25.Optional(Type25.Number()),
  /** Human-readable setup summary lines (workspace, model, gateway). */
  lines: Type25.Optional(Type25.Array(Type25.String())),
  /** Present on failure: coarse bucket for client copy + docs links. */
  status: Type25.Optional(SetupInferenceStatus),
  error: Type25.Optional(Type25.String())
});
var SystemAgentSetupAuthStartParamsSchema = closedObject({
  /** Client-generated so cancellation remains possible if the start reply is lost. */
  sessionId: NonEmptyString,
  authChoice: NonEmptyString,
  workspace: Type25.Optional(Type25.String())
});
var SystemAgentSetupAuthStartResultSchema = WizardStartResultSchema;

// packages/gateway-protocol/src/schema/cron.ts
import { Type as Type26 } from "typebox";
function cronAgentTurnPayloadSchema(params) {
  return closedObject({
    kind: Type26.Literal("agentTurn"),
    message: params.message,
    model: Type26.Optional(params.model),
    fallbacks: Type26.Optional(params.fallbacks),
    thinking: Type26.Optional(params.thinking),
    timeoutSeconds: Type26.Optional(Type26.Number({ minimum: 0 })),
    allowUnsafeExternalContent: Type26.Optional(Type26.Boolean()),
    lightContext: Type26.Optional(Type26.Boolean()),
    toolsAllow: Type26.Optional(params.toolsAllow),
    // Server-managed marker for auto-stamped defaults; persisted so CLI cron
    // runs can drop only the cap that was never user-explicit.
    toolsAllowIsDefault: Type26.Optional(Type26.Boolean())
  });
}
function cronCommandPayloadSchema(params) {
  return closedObject({
    kind: Type26.Literal("command"),
    argv: params.argv,
    cwd: Type26.Optional(Type26.String({ minLength: 1 })),
    env: Type26.Optional(Type26.Record(Type26.String({ minLength: 1 }), Type26.String())),
    input: Type26.Optional(Type26.String()),
    timeoutSeconds: Type26.Optional(Type26.Number({ minimum: 0 })),
    noOutputTimeoutSeconds: Type26.Optional(Type26.Number({ minimum: 0 })),
    outputMaxBytes: Type26.Optional(Type26.Integer({ minimum: 1 })),
    toolsAllow: Type26.Optional(params.toolsAllow),
    toolsAllowIsDefault: Type26.Optional(Type26.Boolean())
  });
}
function cronScriptPayloadSchema(params) {
  return closedObject({
    kind: Type26.Literal("script"),
    script: params.script,
    timeoutSeconds: Type26.Optional(Type26.Number({ minimum: 1 })),
    toolBudget: Type26.Optional(Type26.Integer({ minimum: 1 })),
    toolsAllow: Type26.Optional(params.toolsAllow),
    toolsAllowIsDefault: Type26.Optional(Type26.Boolean())
  });
}
var CronSessionTargetSchema = Type26.Union([
  Type26.Literal("main"),
  Type26.Literal("isolated"),
  Type26.Literal("current"),
  Type26.String({ pattern: "^session:.+" })
]);
var CronWakeModeSchema = Type26.Union([Type26.Literal("next-heartbeat"), Type26.Literal("now")]);
function cronRunStatusSchema(options = {}) {
  return Type26.Union([Type26.Literal("ok"), Type26.Literal("error"), Type26.Literal("skipped")], options);
}
var CronRunStatusSchema = cronRunStatusSchema();
var CronConfigRevisionSchema = Type26.String({ minLength: 1, maxLength: 128 });
var DeprecatedCronRunStatusSchema = cronRunStatusSchema({
  deprecated: true,
  description: "Deprecated alias for lastRunStatus."
});
var CronSortDirSchema = Type26.Union([Type26.Literal("asc"), Type26.Literal("desc")]);
var CronJobsEnabledFilterSchema = Type26.Union([
  Type26.Literal("all"),
  Type26.Literal("enabled"),
  Type26.Literal("disabled")
]);
var CronJobsScheduleKindFilterSchema = Type26.Union([
  Type26.Literal("all"),
  Type26.Literal("at"),
  Type26.Literal("every"),
  Type26.Literal("cron"),
  Type26.Literal("on-exit")
]);
var CronJobsLastRunStatusFilterSchema = Type26.Union([
  Type26.Literal("all"),
  Type26.Literal("ok"),
  Type26.Literal("error"),
  Type26.Literal("skipped"),
  Type26.Literal("unknown")
]);
var CronJobsSortBySchema = Type26.Union([
  Type26.Literal("nextRunAtMs"),
  Type26.Literal("updatedAtMs"),
  Type26.Literal("name")
]);
var CronRunsStatusFilterSchema = Type26.Union([
  Type26.Literal("all"),
  Type26.Literal("ok"),
  Type26.Literal("error"),
  Type26.Literal("skipped")
]);
var CronRunsStatusValueSchema = Type26.Union([
  Type26.Literal("ok"),
  Type26.Literal("error"),
  Type26.Literal("skipped")
]);
var CronDeliveryStatusSchema = Type26.Union([
  Type26.Literal("delivered"),
  Type26.Literal("not-delivered"),
  Type26.Literal("unknown"),
  Type26.Literal("not-requested")
]);
var NonBlankString = Type26.String({ minLength: 1, pattern: "\\S" });
var CronDeclarationKeySchema = Type26.String({ minLength: 1, maxLength: 200, pattern: "\\S" });
var CronDisplayNameSchema = Type26.String({ minLength: 1, maxLength: 200, pattern: "\\S" });
var CronOwnerSchema = closedObject({
  agentId: Type26.Optional(NonEmptyString),
  sessionKey: Type26.Optional(NonEmptyString)
});
var CronAnnounceChannelSchema = Type26.Union([Type26.Literal("last"), NonBlankString]);
var CronFailoverReasonSchema = Type26.Union([
  Type26.Literal("auth"),
  Type26.Literal("auth_permanent"),
  Type26.Literal("format"),
  Type26.Literal("rate_limit"),
  Type26.Literal("overloaded"),
  Type26.Literal("billing"),
  Type26.Literal("server_error"),
  Type26.Literal("timeout"),
  Type26.Literal("context_overflow"),
  Type26.Literal("model_not_found"),
  Type26.Literal("session_expired"),
  Type26.Literal("empty_response"),
  Type26.Literal("no_error_details"),
  Type26.Literal("unclassified"),
  Type26.Literal("unknown")
]);
var CronRunDiagnosticSeveritySchema = Type26.Union([
  Type26.Literal("info"),
  Type26.Literal("warn"),
  Type26.Literal("error")
]);
var CronRunDiagnosticSourceSchema = Type26.Union([
  Type26.Literal("cron-preflight"),
  Type26.Literal("cron-setup"),
  Type26.Literal("model-preflight"),
  Type26.Literal("agent-run"),
  Type26.Literal("tool"),
  Type26.Literal("exec"),
  Type26.Literal("delivery")
]);
var CronRunDiagnosticSchema = closedObject({
  ts: Type26.Integer({ minimum: 0 }),
  source: CronRunDiagnosticSourceSchema,
  severity: CronRunDiagnosticSeveritySchema,
  message: Type26.String(),
  toolName: Type26.Optional(Type26.String()),
  exitCode: Type26.Optional(Type26.Union([Type26.Number(), Type26.Null()])),
  truncated: Type26.Optional(Type26.Boolean())
});
var CronRunDiagnosticsSchema = closedObject({
  summary: Type26.Optional(Type26.String()),
  entries: Type26.Array(CronRunDiagnosticSchema)
});
var CronCommonOptionalFields = {
  agentId: Type26.Optional(Type26.Union([NonEmptyString, Type26.Null()])),
  sessionKey: Type26.Optional(Type26.Union([NonEmptyString, Type26.Null()])),
  description: Type26.Optional(Type26.String()),
  enabled: Type26.Optional(Type26.Boolean()),
  deleteAfterRun: Type26.Optional(Type26.Boolean())
};
function cronIdOrJobIdParams(extraFields) {
  return Type26.Union([
    closedObject({
      id: NonEmptyString,
      ...extraFields
    }),
    closedObject({
      jobId: NonEmptyString,
      ...extraFields
    })
  ]);
}
var CronRunLogJobIdSchema = Type26.String({
  minLength: 1,
  // Prevent path traversal via separators in cron.runs id/jobId.
  pattern: "^[^/\\\\]+$"
});
var CronScheduleSchema = Type26.Union([
  closedObject({
    kind: Type26.Literal("at"),
    at: NonEmptyString
  }),
  closedObject({
    kind: Type26.Literal("every"),
    everyMs: Type26.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
    anchorMs: Type26.Optional(Type26.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }))
  }),
  closedObject({
    kind: Type26.Literal("cron"),
    expr: NonEmptyString,
    tz: Type26.Optional(Type26.String()),
    staggerMs: Type26.Optional(Type26.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }))
  }),
  closedObject({
    // Event-driven trigger: fires once when the gateway-owned watcher running
    // `command` exits. Survives per-turn CLI teardown (runs under the gateway
    // ProcessSupervisor, not the turn process tree).
    kind: Type26.Literal("on-exit"),
    command: NonEmptyString,
    cwd: Type26.Optional(NonEmptyString)
  })
]);
var CronTriggerSchema = closedObject({
  script: Type26.String({ minLength: 1, maxLength: 65536 }),
  once: Type26.Optional(Type26.Boolean())
});
var CronPacingSchema = Type26.Object(
  {
    min: Type26.Optional(NonBlankString),
    max: Type26.Optional(NonBlankString)
  },
  {
    additionalProperties: false,
    description: "Dynamic-cadence bounds; at least one of min or max is required"
  }
);
var CronPayloadSchema = Type26.Union([
  closedObject({
    kind: Type26.Literal("systemEvent"),
    text: NonEmptyString,
    toolsAllow: Type26.Optional(Type26.Array(Type26.String())),
    toolsAllowIsDefault: Type26.Optional(Type26.Boolean())
  }),
  cronAgentTurnPayloadSchema({
    message: NonEmptyString,
    model: Type26.String(),
    fallbacks: Type26.Array(Type26.String()),
    toolsAllow: Type26.Array(Type26.String()),
    thinking: Type26.String()
  }),
  cronCommandPayloadSchema({
    argv: Type26.Array(NonEmptyString, { minItems: 1 }),
    toolsAllow: Type26.Array(Type26.String())
  }),
  cronScriptPayloadSchema({
    script: Type26.String({ minLength: 1, maxLength: 65536 }),
    toolsAllow: Type26.Array(Type26.String())
  })
]);
var CronPayloadPatchSchema = Type26.Union([
  closedObject({
    kind: Type26.Literal("systemEvent"),
    text: Type26.Optional(NonEmptyString),
    toolsAllow: Type26.Optional(Type26.Union([Type26.Array(Type26.String()), Type26.Null()])),
    toolsAllowIsDefault: Type26.Optional(Type26.Boolean())
  }),
  cronAgentTurnPayloadSchema({
    message: Type26.Optional(NonEmptyString),
    model: Type26.Union([Type26.String(), Type26.Null()]),
    fallbacks: Type26.Union([Type26.Array(Type26.String()), Type26.Null()]),
    toolsAllow: Type26.Union([Type26.Array(Type26.String()), Type26.Null()]),
    thinking: Type26.Union([Type26.String(), Type26.Null()])
  }),
  cronCommandPayloadSchema({
    argv: Type26.Optional(Type26.Array(NonEmptyString, { minItems: 1 })),
    toolsAllow: Type26.Union([Type26.Array(Type26.String()), Type26.Null()])
  }),
  cronScriptPayloadSchema({
    script: Type26.Optional(Type26.String({ minLength: 1, maxLength: 65536 })),
    toolsAllow: Type26.Union([Type26.Array(Type26.String()), Type26.Null()])
  })
]);
var CronFailureAlertSchema = closedObject({
  after: Type26.Optional(Type26.Integer({ minimum: 1 })),
  channel: Type26.Optional(CronAnnounceChannelSchema),
  to: Type26.Optional(NonBlankString),
  cooldownMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  includeSkipped: Type26.Optional(Type26.Boolean()),
  mode: Type26.Optional(Type26.Union([Type26.Literal("announce"), Type26.Literal("webhook")])),
  accountId: Type26.Optional(NonEmptyString)
});
var CronFailureAlertPatchSchema = closedObject({
  after: Type26.Optional(Type26.Union([Type26.Integer({ minimum: 1 }), Type26.Null()])),
  channel: Type26.Optional(Type26.Union([CronAnnounceChannelSchema, Type26.Null()])),
  to: Type26.Optional(Type26.Union([NonBlankString, Type26.Null()])),
  cooldownMs: Type26.Optional(Type26.Union([Type26.Integer({ minimum: 0 }), Type26.Null()])),
  includeSkipped: Type26.Optional(Type26.Union([Type26.Boolean(), Type26.Null()])),
  mode: Type26.Optional(Type26.Union([Type26.Literal("announce"), Type26.Literal("webhook"), Type26.Null()])),
  accountId: Type26.Optional(Type26.Union([NonEmptyString, Type26.Null()]))
});
var CronFailureDestinationSchema = closedObject({
  channel: Type26.Optional(CronAnnounceChannelSchema),
  to: Type26.Optional(NonBlankString),
  accountId: Type26.Optional(NonEmptyString),
  mode: Type26.Optional(Type26.Union([Type26.Literal("announce"), Type26.Literal("webhook")]))
});
var CronFailureDestinationPatchSchema = closedObject({
  channel: Type26.Optional(Type26.Union([CronAnnounceChannelSchema, Type26.Null()])),
  to: Type26.Optional(Type26.Union([NonBlankString, Type26.Null()])),
  accountId: Type26.Optional(Type26.Union([NonEmptyString, Type26.Null()])),
  mode: Type26.Optional(Type26.Union([Type26.Literal("announce"), Type26.Literal("webhook"), Type26.Null()]))
});
var CronCompletionDestinationSchema = closedObject({
  mode: Type26.Literal("webhook"),
  to: NonBlankString
});
var CronDeliverySharedProperties = {
  channel: Type26.Optional(CronAnnounceChannelSchema),
  threadId: Type26.Optional(Type26.Union([Type26.String(), Type26.Number()])),
  accountId: Type26.Optional(NonEmptyString),
  bestEffort: Type26.Optional(Type26.Boolean()),
  failureDestination: Type26.Optional(CronFailureDestinationSchema)
};
var CronDeliveryPatchSharedProperties = {
  channel: Type26.Optional(Type26.Union([CronAnnounceChannelSchema, Type26.Null()])),
  threadId: Type26.Optional(Type26.Union([Type26.String(), Type26.Number(), Type26.Null()])),
  accountId: Type26.Optional(Type26.Union([NonEmptyString, Type26.Null()])),
  bestEffort: Type26.Optional(Type26.Boolean()),
  failureDestination: Type26.Optional(Type26.Union([CronFailureDestinationPatchSchema, Type26.Null()]))
};
var CronDeliveryNoopSchema = closedObject({
  mode: Type26.Literal("none"),
  ...CronDeliverySharedProperties,
  to: Type26.Optional(NonBlankString)
});
var CronDeliveryAnnounceSchema = closedObject({
  mode: Type26.Literal("announce"),
  ...CronDeliverySharedProperties,
  completionDestination: Type26.Optional(CronCompletionDestinationSchema),
  to: Type26.Optional(NonBlankString)
});
var CronDeliveryWebhookSchema = closedObject({
  mode: Type26.Literal("webhook"),
  ...CronDeliverySharedProperties,
  to: NonBlankString
});
var CronDeliverySchema = Type26.Union([
  CronDeliveryNoopSchema,
  CronDeliveryAnnounceSchema,
  CronDeliveryWebhookSchema
]);
var CronDeliveryPatchSchema = closedObject({
  mode: Type26.Optional(
    Type26.Union([Type26.Literal("none"), Type26.Literal("announce"), Type26.Literal("webhook")])
  ),
  ...CronDeliveryPatchSharedProperties,
  completionDestination: Type26.Optional(Type26.Union([CronCompletionDestinationSchema, Type26.Null()])),
  to: Type26.Optional(Type26.Union([NonBlankString, Type26.Null()]))
});
var CronFailureNotificationDeliverySchema = closedObject({
  delivered: Type26.Optional(Type26.Boolean()),
  status: CronDeliveryStatusSchema,
  error: Type26.Optional(Type26.String())
});
var CronJobStateSchema = closedObject({
  nextRunAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  runningAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  lastRunAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  lastRunStatus: Type26.Optional(CronRunStatusSchema),
  lastStatus: Type26.Optional(DeprecatedCronRunStatusSchema),
  lastError: Type26.Optional(Type26.String()),
  lastDiagnostics: Type26.Optional(CronRunDiagnosticsSchema),
  lastDiagnosticSummary: Type26.Optional(Type26.String()),
  lastErrorReason: Type26.Optional(CronFailoverReasonSchema),
  lastDurationMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  consecutiveErrors: Type26.Optional(Type26.Integer({ minimum: 0 })),
  consecutiveSkipped: Type26.Optional(Type26.Integer({ minimum: 0 })),
  lastDelivered: Type26.Optional(Type26.Boolean()),
  lastDeliveryStatus: Type26.Optional(CronDeliveryStatusSchema),
  lastDeliveryError: Type26.Optional(Type26.String()),
  lastFailureNotificationDelivered: Type26.Optional(Type26.Boolean()),
  lastFailureNotificationDeliveryStatus: Type26.Optional(CronDeliveryStatusSchema),
  lastFailureNotificationDeliveryError: Type26.Optional(Type26.String()),
  lastFailureAlertAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  lastTriggerEvalAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  triggerEvalCount: Type26.Optional(Type26.Integer({ minimum: 0 })),
  lastTriggerFireAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  triggerState: Type26.Optional(Type26.Unknown())
});
var CronJobStatePatchSchema = closedObject({
  nextRunAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  runningAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  lastRunAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  lastRunStatus: Type26.Optional(CronRunStatusSchema),
  lastStatus: Type26.Optional(DeprecatedCronRunStatusSchema),
  lastError: Type26.Optional(Type26.String()),
  lastErrorReason: Type26.Optional(CronFailoverReasonSchema),
  lastDurationMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  consecutiveErrors: Type26.Optional(Type26.Integer({ minimum: 0 })),
  consecutiveSkipped: Type26.Optional(Type26.Integer({ minimum: 0 })),
  lastDelivered: Type26.Optional(Type26.Boolean()),
  lastDeliveryStatus: Type26.Optional(CronDeliveryStatusSchema),
  lastDeliveryError: Type26.Optional(Type26.String()),
  lastFailureNotificationDelivered: Type26.Optional(Type26.Boolean()),
  lastFailureNotificationDeliveryStatus: Type26.Optional(CronDeliveryStatusSchema),
  lastFailureNotificationDeliveryError: Type26.Optional(Type26.String()),
  lastFailureAlertAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  lastTriggerEvalAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  triggerEvalCount: Type26.Optional(Type26.Integer({ minimum: 0 })),
  lastTriggerFireAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  triggerState: Type26.Optional(Type26.Unknown())
});
var CronJobSchema = closedObject({
  id: NonEmptyString,
  declarationKey: Type26.Optional(CronDeclarationKeySchema),
  displayName: Type26.Optional(CronDisplayNameSchema),
  owner: Type26.Optional(CronOwnerSchema),
  agentId: Type26.Optional(NonEmptyString),
  sessionKey: Type26.Optional(NonEmptyString),
  name: NonEmptyString,
  description: Type26.Optional(Type26.String()),
  enabled: Type26.Boolean(),
  deleteAfterRun: Type26.Optional(Type26.Boolean()),
  createdAtMs: Type26.Integer({ minimum: 0 }),
  updatedAtMs: Type26.Integer({ minimum: 0 }),
  /** Opaque Gateway-computed token for the job definition, excluding scheduler state. */
  configRevision: Type26.Optional(CronConfigRevisionSchema),
  schedule: CronScheduleSchema,
  pacing: Type26.Optional(CronPacingSchema),
  trigger: Type26.Optional(CronTriggerSchema),
  sessionTarget: CronSessionTargetSchema,
  wakeMode: CronWakeModeSchema,
  payload: CronPayloadSchema,
  delivery: Type26.Optional(CronDeliverySchema),
  failureAlert: Type26.Optional(Type26.Union([Type26.Literal(false), CronFailureAlertSchema])),
  state: CronJobStateSchema,
  nextRunAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  lastRunAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  lastRunStatus: Type26.Optional(CronRunStatusSchema),
  lastRunError: Type26.Optional(Type26.String()),
  lastDelivered: Type26.Optional(Type26.Boolean()),
  lastDeliveryStatus: Type26.Optional(CronDeliveryStatusSchema),
  lastDeliveryError: Type26.Optional(Type26.String()),
  lastFailureNotificationDelivered: Type26.Optional(Type26.Boolean()),
  lastFailureNotificationDeliveryStatus: Type26.Optional(CronDeliveryStatusSchema),
  lastFailureNotificationDeliveryError: Type26.Optional(Type26.String())
});
var CronListParamsSchema = closedObject({
  includeDisabled: Type26.Optional(Type26.Boolean()),
  limit: Type26.Optional(Type26.Integer({ minimum: 1, maximum: 200 })),
  offset: Type26.Optional(Type26.Integer({ minimum: 0 })),
  query: Type26.Optional(Type26.String()),
  enabled: Type26.Optional(CronJobsEnabledFilterSchema),
  scheduleKind: Type26.Optional(CronJobsScheduleKindFilterSchema),
  lastRunStatus: Type26.Optional(CronJobsLastRunStatusFilterSchema),
  sortBy: Type26.Optional(CronJobsSortBySchema),
  sortDir: Type26.Optional(CronSortDirSchema),
  agentId: Type26.Optional(NonEmptyString),
  compact: Type26.Optional(Type26.Boolean())
});
var CronStatusParamsSchema = closedObject({});
var CronGetParamsSchema = cronIdOrJobIdParams({});
var CronAddParamsSchema = closedObject({
  name: NonEmptyString,
  declarationKey: Type26.Optional(CronDeclarationKeySchema),
  displayName: Type26.Optional(CronDisplayNameSchema),
  owner: Type26.Optional(CronOwnerSchema),
  ...CronCommonOptionalFields,
  schedule: CronScheduleSchema,
  pacing: Type26.Optional(CronPacingSchema),
  trigger: Type26.Optional(CronTriggerSchema),
  sessionTarget: CronSessionTargetSchema,
  wakeMode: CronWakeModeSchema,
  payload: CronPayloadSchema,
  delivery: Type26.Optional(CronDeliverySchema),
  failureAlert: Type26.Optional(Type26.Union([Type26.Literal(false), CronFailureAlertSchema]))
});
var CronDeclarativeAddResultSchema = closedObject({
  created: Type26.Boolean(),
  updated: Type26.Optional(Type26.Boolean()),
  job: CronJobSchema
});
var CronAddResultSchema = Type26.Union([CronJobSchema, CronDeclarativeAddResultSchema]);
var CronJobPatchSchema = closedObject({
  name: Type26.Optional(NonEmptyString),
  displayName: Type26.Optional(Type26.Union([CronDisplayNameSchema, Type26.Null()])),
  ...CronCommonOptionalFields,
  schedule: Type26.Optional(CronScheduleSchema),
  pacing: Type26.Optional(Type26.Union([CronPacingSchema, Type26.Null()])),
  trigger: Type26.Optional(Type26.Union([CronTriggerSchema, Type26.Null()])),
  sessionTarget: Type26.Optional(CronSessionTargetSchema),
  wakeMode: Type26.Optional(CronWakeModeSchema),
  payload: Type26.Optional(CronPayloadPatchSchema),
  delivery: Type26.Optional(CronDeliveryPatchSchema),
  failureAlert: Type26.Optional(
    Type26.Union([Type26.Literal(false), CronFailureAlertPatchSchema, Type26.Null()])
  ),
  state: Type26.Optional(CronJobStatePatchSchema)
});
var CronUpdateParamsSchema = cronIdOrJobIdParams({
  patch: CronJobPatchSchema,
  /** Rejects the patch when the current definition does not match the caller's token. */
  expectedConfigRevision: Type26.Optional(CronConfigRevisionSchema)
});
var CronRemoveParamsSchema = cronIdOrJobIdParams({});
var CronRunParamsSchema = cronIdOrJobIdParams({
  mode: Type26.Optional(Type26.Union([Type26.Literal("due"), Type26.Literal("force")])),
  /** Rejects the mutation if the Gateway restarted after the caller's preflight. */
  expectedProcessInstanceId: Type26.Optional(NonEmptyString)
});
var CronRunsParamsSchema = closedObject({
  agentId: Type26.Optional(NonEmptyString),
  scope: Type26.Optional(Type26.Union([Type26.Literal("job"), Type26.Literal("all")])),
  id: Type26.Optional(CronRunLogJobIdSchema),
  jobId: Type26.Optional(CronRunLogJobIdSchema),
  runId: Type26.Optional(NonEmptyString),
  limit: Type26.Optional(Type26.Integer({ minimum: 1, maximum: 200 })),
  offset: Type26.Optional(Type26.Integer({ minimum: 0 })),
  statuses: Type26.Optional(Type26.Array(CronRunsStatusValueSchema, { minItems: 1, maxItems: 3 })),
  status: Type26.Optional(CronRunsStatusFilterSchema),
  deliveryStatuses: Type26.Optional(
    Type26.Array(CronDeliveryStatusSchema, { minItems: 1, maxItems: 4 })
  ),
  deliveryStatus: Type26.Optional(CronDeliveryStatusSchema),
  query: Type26.Optional(Type26.String()),
  sortDir: Type26.Optional(CronSortDirSchema)
});
var CronRunLogEntrySchema = closedObject({
  ts: Type26.Integer({ minimum: 0 }),
  jobId: NonEmptyString,
  action: Type26.Literal("finished"),
  status: Type26.Optional(CronRunStatusSchema),
  error: Type26.Optional(Type26.String()),
  errorReason: Type26.Optional(CronFailoverReasonSchema),
  summary: Type26.Optional(Type26.String()),
  diagnostics: Type26.Optional(CronRunDiagnosticsSchema),
  delivered: Type26.Optional(Type26.Boolean()),
  deliveryStatus: Type26.Optional(CronDeliveryStatusSchema),
  deliveryError: Type26.Optional(Type26.String()),
  failureNotificationDelivery: Type26.Optional(CronFailureNotificationDeliverySchema),
  sessionId: Type26.Optional(NonEmptyString),
  sessionKey: Type26.Optional(NonEmptyString),
  runId: Type26.Optional(NonEmptyString),
  runAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  durationMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  nextRunAtMs: Type26.Optional(Type26.Integer({ minimum: 0 })),
  triggerFired: Type26.Optional(Type26.Boolean()),
  model: Type26.Optional(Type26.String()),
  provider: Type26.Optional(Type26.String()),
  usage: Type26.Optional(
    closedObject({
      input_tokens: Type26.Optional(Type26.Number()),
      output_tokens: Type26.Optional(Type26.Number()),
      total_tokens: Type26.Optional(Type26.Number()),
      cache_read_tokens: Type26.Optional(Type26.Number()),
      cache_write_tokens: Type26.Optional(Type26.Number())
    })
  ),
  jobName: Type26.Optional(Type26.String())
});

// packages/gateway-protocol/src/schema/error-codes.ts
import { Type as Type27 } from "typebox";
var MissingScopeErrorDetailsSchema = closedObject({
  code: Type27.Literal(GatewayErrorDetailCodes.MISSING_SCOPE),
  missingScope: NonEmptyString,
  requiredScopes: Type27.Array(NonEmptyString, { minItems: 1 })
});
var McpAppViewExpiredErrorDetailsSchema = closedObject({
  code: Type27.Literal(GatewayErrorDetailCodes.MCP_APP_VIEW_EXPIRED)
});
var GatewayErrorDetailsSchema = Type27.Union([
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

// packages/gateway-protocol/src/schema/environments.ts
import { Type as Type28 } from "typebox";
var EnvironmentStatusSchema = Type28.String({
  enum: ["available", "unavailable", "starting", "stopping", "error"]
});
var WorkerEnvironmentStateSchema = Type28.Union([
  Type28.Literal("requested"),
  Type28.Literal("provisioning"),
  Type28.Literal("bootstrapping"),
  Type28.Literal("ready"),
  Type28.Literal("attached"),
  Type28.Literal("idle"),
  Type28.Literal("draining"),
  Type28.Literal("destroying"),
  Type28.Literal("destroyed"),
  Type28.Literal("failed"),
  Type28.Literal("orphaned")
]);
var WorkerTunnelStatusSchema = Type28.Union([
  Type28.Literal("stopped"),
  Type28.Literal("connecting"),
  Type28.Literal("connected"),
  Type28.Literal("reconnecting")
]);
var WorkerEnvironmentMetadataSchema = closedObject({
  providerId: NonEmptyString,
  leaseId: Type28.Optional(NonEmptyString),
  state: WorkerEnvironmentStateSchema,
  ageMs: Type28.Integer({ minimum: 0 }),
  idleMs: Type28.Optional(Type28.Integer({ minimum: 0 })),
  attachedSessionIds: Type28.Array(NonEmptyString),
  tunnelStatus: WorkerTunnelStatusSchema
});
function createEnvironmentSummarySchema() {
  return closedObject({
    id: NonEmptyString,
    type: NonEmptyString,
    label: Type28.Optional(NonEmptyString),
    status: EnvironmentStatusSchema,
    capabilities: Type28.Optional(Type28.Array(NonEmptyString)),
    worker: Type28.Optional(WorkerEnvironmentMetadataSchema)
  });
}
var EnvironmentSummarySchema = createEnvironmentSummarySchema();
var EnvironmentsListParamsSchema = closedObject({});
var WorkerEnvironmentProfileSummarySchema = closedObject({
  id: NonEmptyString,
  providerId: NonEmptyString
});
var EnvironmentsListResultSchema = closedObject({
  environments: Type28.Array(EnvironmentSummarySchema),
  profiles: Type28.Optional(Type28.Array(WorkerEnvironmentProfileSummarySchema))
});
var EnvironmentsStatusParamsSchema = closedObject({ environmentId: NonEmptyString });
var EnvironmentsStatusResultSchema = createEnvironmentSummarySchema();
var EnvironmentsCreateParamsSchema = closedObject({
  profileId: NonEmptyString,
  idempotencyKey: NonEmptyString
});
var EnvironmentsCreateResultSchema = createEnvironmentSummarySchema();
var EnvironmentsDestroyParamsSchema = closedObject({
  environmentId: NonEmptyString,
  force: Type28.Optional(Type28.Boolean())
});
var EnvironmentsDestroyResultSchema = createEnvironmentSummarySchema();

// packages/gateway-protocol/src/schema/exec-approvals.ts
import { Type as Type29 } from "typebox";
var ExecApprovalsAllowlistEntrySchema = closedObject({
  id: Type29.Optional(NonEmptyString),
  pattern: Type29.String(),
  source: Type29.Optional(Type29.Literal("allow-always")),
  commandText: Type29.Optional(Type29.String()),
  argPattern: Type29.Optional(Type29.String()),
  lastUsedAt: Type29.Optional(Type29.Number({ minimum: 0 })),
  lastUsedCommand: Type29.Optional(Type29.String()),
  lastResolvedPath: Type29.Optional(Type29.String())
});
var ExecApprovalsPolicyFields = {
  security: Type29.Optional(Type29.String()),
  ask: Type29.Optional(Type29.String()),
  askFallback: Type29.Optional(Type29.String()),
  autoAllowSkills: Type29.Optional(Type29.Boolean())
};
var ExecSecuritySchema = Type29.Union([
  Type29.Literal("deny"),
  Type29.Literal("allowlist"),
  Type29.Literal("full")
]);
var ExecAskSchema = Type29.Union([
  Type29.Literal("off"),
  Type29.Literal("on-miss"),
  Type29.Literal("always")
]);
var ExecApprovalsResolvedDefaultsSchema = closedObject({
  security: ExecSecuritySchema,
  ask: ExecAskSchema,
  askFallback: ExecSecuritySchema,
  autoAllowSkills: Type29.Boolean()
});
var ExecApprovalsDefaultsSchema = closedObject(ExecApprovalsPolicyFields);
var ExecApprovalsAgentSchema = closedObject({
  ...ExecApprovalsPolicyFields,
  allowlist: Type29.Optional(Type29.Array(ExecApprovalsAllowlistEntrySchema))
});
var ExecApprovalsFileSchema = closedObject({
  version: Type29.Literal(1),
  socket: Type29.Optional(
    closedObject({
      path: Type29.Optional(Type29.String()),
      token: Type29.Optional(Type29.String())
    })
  ),
  defaults: Type29.Optional(ExecApprovalsDefaultsSchema),
  agents: Type29.Optional(Type29.Record(Type29.String(), ExecApprovalsAgentSchema))
});
var ExecApprovalsSnapshotSchema = closedObject({
  path: NonEmptyString,
  exists: Type29.Boolean(),
  hash: NonEmptyString,
  file: ExecApprovalsFileSchema
});
var NativeExecApprovalActionSchema = Type29.Union([
  Type29.Literal("allow"),
  Type29.Literal("deny"),
  Type29.Literal("prompt")
]);
var NativeExecApprovalRuleSchema = closedObject({
  pattern: NonEmptyString,
  action: NativeExecApprovalActionSchema,
  shells: Type29.Optional(Type29.Array(NonEmptyString)),
  description: Type29.Optional(Type29.String()),
  enabled: Type29.Optional(Type29.Boolean())
});
var NativeExecApprovalConstraintsSchema = closedObject({
  baseHashRequired: Type29.Optional(Type29.Boolean()),
  defaultAllowAllowed: Type29.Optional(Type29.Boolean()),
  broadAllowRulesAllowed: Type29.Optional(Type29.Boolean()),
  dangerousAllowRulesAllowed: Type29.Optional(Type29.Boolean())
});
var ExecApprovalsNodeSnapshotSchema = Type29.Object(
  {
    path: Type29.Optional(Type29.String()),
    exists: Type29.Optional(Type29.Boolean()),
    hash: Type29.Optional(Type29.String()),
    file: Type29.Optional(ExecApprovalsFileSchema),
    resolvedDefaults: Type29.Optional(ExecApprovalsResolvedDefaultsSchema),
    enabled: Type29.Optional(Type29.Boolean()),
    baseHash: Type29.Optional(NonEmptyString),
    defaultAction: Type29.Optional(NativeExecApprovalActionSchema),
    rules: Type29.Optional(Type29.Array(NativeExecApprovalRuleSchema)),
    constraints: Type29.Optional(NativeExecApprovalConstraintsSchema),
    message: Type29.Optional(Type29.String())
  },
  {
    additionalProperties: false,
    oneOf: [
      {
        required: ["path", "exists", "hash", "file"],
        not: {
          anyOf: [
            { required: ["enabled"] },
            { required: ["baseHash"] },
            { required: ["defaultAction"] },
            { required: ["rules"] },
            { required: ["constraints"] },
            { required: ["message"] }
          ]
        }
      },
      {
        properties: { enabled: { const: true }, hash: { minLength: 1 } },
        required: ["enabled", "hash", "defaultAction", "rules"],
        not: {
          anyOf: [
            { required: ["path"] },
            { required: ["exists"] },
            { required: ["file"] },
            { required: ["resolvedDefaults"] },
            { required: ["message"] }
          ]
        }
      },
      {
        properties: { enabled: { const: false } },
        required: ["enabled"],
        not: {
          anyOf: [
            { required: ["path"] },
            { required: ["exists"] },
            { required: ["hash"] },
            { required: ["file"] },
            { required: ["resolvedDefaults"] },
            { required: ["baseHash"] },
            { required: ["defaultAction"] },
            { required: ["rules"] },
            { required: ["constraints"] }
          ]
        }
      }
    ]
  }
);
var ExecApprovalsGetParamsSchema = closedObject({});
var ExecApprovalsSetParamsSchema = closedObject({
  file: ExecApprovalsFileSchema,
  baseHash: Type29.Optional(NonEmptyString)
});
var ExecApprovalsNodeGetParamsSchema = closedObject({
  nodeId: NonEmptyString
});
var NativeExecApprovalPolicySchema = closedObject({
  defaultAction: Type29.Optional(NativeExecApprovalActionSchema),
  // Windows treats set as full replacement; omission would silently clear the rule list.
  rules: Type29.Array(NativeExecApprovalRuleSchema)
});
var ExecApprovalsNodeSetParamsSchema = Type29.Object(
  {
    nodeId: NonEmptyString,
    file: Type29.Optional(ExecApprovalsFileSchema),
    native: Type29.Optional(NativeExecApprovalPolicySchema),
    baseHash: Type29.Optional(NonEmptyString)
  },
  {
    additionalProperties: false,
    oneOf: [
      { required: ["file"], not: { required: ["native"] } },
      {
        required: ["native", "baseHash"],
        not: { required: ["file"] }
      }
    ]
  }
);
var ExecApprovalGetParamsSchema = closedObject({
  id: NonEmptyString
});
var ExecApprovalPolicySecuritySchema = Type29.Union([
  Type29.Literal("deny"),
  Type29.Literal("allowlist"),
  Type29.Literal("full")
]);
var ExecApprovalPolicySnapshotSchema = closedObject({
  security: ExecApprovalPolicySecuritySchema,
  ask: Type29.Union([Type29.Literal("off"), Type29.Literal("on-miss"), Type29.Literal("always")]),
  askFallback: ExecApprovalPolicySecuritySchema,
  autoAllowSkills: Type29.Boolean(),
  allowlistRules: Type29.Array(
    closedObject({
      pattern: Type29.String(),
      argPattern: Type29.Optional(Type29.String()),
      source: Type29.Optional(Type29.Literal("allow-always"))
    })
  )
});
var ExecApprovalRequestParamsSchema = closedObject({
  id: Type29.Optional(NonEmptyString),
  command: Type29.Optional(NonEmptyString),
  commandArgv: Type29.Optional(Type29.Array(Type29.String())),
  systemRunPlan: Type29.Optional(
    closedObject({
      argv: Type29.Array(Type29.String()),
      cwd: Type29.Union([Type29.String(), Type29.Null()]),
      commandText: Type29.String(),
      commandPreview: Type29.Optional(Type29.Union([Type29.String(), Type29.Null()])),
      agentId: Type29.Union([Type29.String(), Type29.Null()]),
      sessionKey: Type29.Union([Type29.String(), Type29.Null()]),
      policySnapshot: Type29.Optional(ExecApprovalPolicySnapshotSchema),
      mutableFileOperand: Type29.Optional(
        Type29.Union([
          closedObject({
            argvIndex: Type29.Integer({ minimum: 0 }),
            path: Type29.String(),
            sha256: Type29.String()
          }),
          Type29.Null()
        ])
      )
    })
  ),
  env: Type29.Optional(Type29.Record(NonEmptyString, Type29.String())),
  cwd: Type29.Optional(Type29.Union([Type29.String(), Type29.Null()])),
  nodeId: Type29.Optional(Type29.Union([NonEmptyString, Type29.Null()])),
  host: Type29.Optional(Type29.Union([Type29.String(), Type29.Null()])),
  security: Type29.Optional(Type29.Union([Type29.String(), Type29.Null()])),
  ask: Type29.Optional(Type29.Union([Type29.String(), Type29.Null()])),
  warningText: Type29.Optional(Type29.Union([Type29.String(), Type29.Null()])),
  unavailableDecisions: Type29.Optional(
    Type29.Array(Type29.String({ enum: ["allow-always"] }), {
      minItems: 1,
      maxItems: 1
    })
  ),
  commandSpans: Type29.Optional(
    Type29.Array(
      closedObject({
        startIndex: Type29.Integer({
          minimum: 0,
          description: "Inclusive UTF-16 code unit offset into command."
        }),
        endIndex: Type29.Integer({
          minimum: 1,
          description: "Exclusive UTF-16 code unit offset into command; must be greater than startIndex and no greater than command.length."
        })
      })
    )
  ),
  agentId: Type29.Optional(Type29.Union([Type29.String(), Type29.Null()])),
  resolvedPath: Type29.Optional(Type29.Union([Type29.String(), Type29.Null()])),
  sessionKey: Type29.Optional(Type29.Union([Type29.String(), Type29.Null()])),
  sessionId: Type29.Optional(Type29.Union([Type29.String(), Type29.Null()])),
  runId: Type29.Optional(Type29.Union([Type29.String(), Type29.Null()])),
  toolCallId: Type29.Optional(Type29.Union([Type29.String(), Type29.Null()])),
  turnSourceChannel: Type29.Optional(Type29.Union([Type29.String(), Type29.Null()])),
  turnSourceTo: Type29.Optional(Type29.Union([Type29.String(), Type29.Null()])),
  turnSourceAccountId: Type29.Optional(Type29.Union([Type29.String(), Type29.Null()])),
  turnSourceThreadId: Type29.Optional(Type29.Union([Type29.String(), Type29.Number(), Type29.Null()])),
  approvalReviewerDeviceIds: Type29.Optional(
    Type29.Array(NonEmptyString, {
      description: "Trusted approval-runtime metadata naming operator devices that may review this approval; ordinary Gateway clients may send the field, but the Gateway only binds it for internal approval-runtime requests."
    })
  ),
  requireDeliveryRoute: Type29.Optional(Type29.Boolean()),
  suppressDelivery: Type29.Optional(Type29.Boolean()),
  timeoutMs: Type29.Optional(Type29.Integer({ minimum: 1 })),
  twoPhase: Type29.Optional(Type29.Boolean())
});
var ExecApprovalResolveParamsSchema = closedObject({
  id: NonEmptyString,
  decision: NonEmptyString
});

// packages/gateway-protocol/src/schema/devices.ts
import { Type as Type30 } from "typebox";
var DevicePairListParamsSchema = closedObject({});
var DevicePairApproveParamsSchema = closedObject({ requestId: NonEmptyString });
var DevicePairRejectParamsSchema = closedObject({ requestId: NonEmptyString });
var DevicePairRemoveParamsSchema = closedObject({ deviceId: NonEmptyString });
var DevicePairLabelString = Type30.String({ minLength: 1, maxLength: 64 });
var DevicePairRenameParamsSchema = closedObject({
  deviceId: NonEmptyString,
  label: DevicePairLabelString
});
var DeviceTokenRotateParamsSchema = closedObject({
  deviceId: NonEmptyString,
  role: NonEmptyString,
  scopes: Type30.Optional(Type30.Array(NonEmptyString))
});
var DeviceTokenRevokeParamsSchema = closedObject({
  deviceId: NonEmptyString,
  role: NonEmptyString
});
var DevicePairRequestedEventSchema = closedObject({
  requestId: NonEmptyString,
  deviceId: NonEmptyString,
  publicKey: NonEmptyString,
  displayName: Type30.Optional(NonEmptyString),
  platform: Type30.Optional(NonEmptyString),
  deviceFamily: Type30.Optional(NonEmptyString),
  clientId: Type30.Optional(NonEmptyString),
  clientMode: Type30.Optional(NonEmptyString),
  browserOrigin: Type30.Optional(NonEmptyString),
  role: Type30.Optional(NonEmptyString),
  roles: Type30.Optional(Type30.Array(NonEmptyString)),
  scopes: Type30.Optional(Type30.Array(NonEmptyString)),
  remoteIp: Type30.Optional(NonEmptyString),
  silent: Type30.Optional(Type30.Boolean()),
  isRepair: Type30.Optional(Type30.Boolean()),
  ts: Type30.Integer({ minimum: 0 })
});
var DevicePairResolvedEventSchema = closedObject({
  requestId: NonEmptyString,
  deviceId: NonEmptyString,
  decision: NonEmptyString,
  ts: Type30.Integer({ minimum: 0 })
});
var SetupCodeQrDataUrlSchema = Type30.String({
  maxLength: 16384,
  pattern: "^data:image/png;base64,"
});
var DevicePairSetupCodeParamsSchema = closedObject({
  publicUrl: Type30.Optional(NonEmptyString),
  preferRemoteUrl: Type30.Optional(Type30.Boolean()),
  includeQr: Type30.Optional(Type30.Boolean()),
  bootstrapProfile: Type30.Optional(Type30.String({ enum: ["limited", "node"] }))
});
var DevicePairSetupCodeResultSchema = closedObject({
  setupCode: NonEmptyString,
  qrDataUrl: Type30.Optional(SetupCodeQrDataUrlSchema),
  gatewayUrl: NonEmptyString,
  gatewayUrls: Type30.Optional(
    Type30.Array(NonEmptyString, { minItems: 2, maxItems: 8, uniqueItems: true })
  ),
  auth: Type30.Union([Type30.Literal("token"), Type30.Literal("password")]),
  urlSource: NonEmptyString,
  access: Type30.Optional(
    Type30.Union([Type30.Literal("full"), Type30.Literal("limited"), Type30.Literal("node")])
  ),
  accessDowngraded: Type30.Optional(Type30.Boolean())
});

// packages/gateway-protocol/src/schema/frames.ts
import { Type as Type32 } from "typebox";

// packages/gateway-protocol/src/schema/snapshot.ts
import { Type as Type31 } from "typebox";
var PresenceEntrySchema = closedObject({
  host: Type31.Optional(NonEmptyString),
  ip: Type31.Optional(NonEmptyString),
  version: Type31.Optional(NonEmptyString),
  platform: Type31.Optional(NonEmptyString),
  deviceFamily: Type31.Optional(NonEmptyString),
  modelIdentifier: Type31.Optional(NonEmptyString),
  mode: Type31.Optional(NonEmptyString),
  lastInputSeconds: Type31.Optional(Type31.Integer({ minimum: 0 })),
  reason: Type31.Optional(NonEmptyString),
  tags: Type31.Optional(Type31.Array(NonEmptyString)),
  text: Type31.Optional(Type31.String()),
  ts: Type31.Integer({ minimum: 0 }),
  deviceId: Type31.Optional(NonEmptyString),
  roles: Type31.Optional(Type31.Array(NonEmptyString)),
  scopes: Type31.Optional(Type31.Array(NonEmptyString)),
  instanceId: Type31.Optional(NonEmptyString),
  user: Type31.Optional(
    closedObject({
      /** Opaque identity key: authenticated email today, durable profile id later. Clients group presence by this. */
      id: NonEmptyString,
      email: Type31.Optional(NonEmptyString),
      name: Type31.Optional(NonEmptyString),
      avatarUrl: Type31.Optional(NonEmptyString)
    })
  ),
  /** Session keys this connection is actively subscribed to (watching). Sorted lexicographically for deterministic snapshots. */
  watchedSessions: Type31.Optional(Type31.Array(NonEmptyString))
});
var HealthSessionSummarySchema = closedObject({
  path: Type31.String(),
  count: Type31.Integer({ minimum: 0 }),
  recent: Type31.Array(
    closedObject({
      key: Type31.String(),
      updatedAt: Type31.Union([Type31.Integer({ minimum: 0 }), Type31.Null()]),
      age: Type31.Union([Type31.Integer({ minimum: 0 }), Type31.Null()])
    })
  )
});
var HealthSnapshotSchema = closedObject({
  // Every field is optional because hello snapshots use an empty object until
  // the asynchronous health producer has populated the cache.
  ok: Type31.Optional(Type31.Literal(true)),
  ts: Type31.Optional(Type31.Integer({ minimum: 0 })),
  durationMs: Type31.Optional(Type31.Integer({ minimum: 0 })),
  eventLoop: Type31.Optional(
    closedObject({
      degraded: Type31.Boolean(),
      reasons: Type31.Array(
        Type31.Union([
          Type31.Literal("event_loop_delay"),
          Type31.Literal("event_loop_utilization"),
          Type31.Literal("cpu")
        ])
      ),
      intervalMs: Type31.Number({ minimum: 0 }),
      delayP99Ms: Type31.Number({ minimum: 0 }),
      delayMaxMs: Type31.Number({ minimum: 0 }),
      utilization: Type31.Number({ minimum: 0 }),
      cpuCoreRatio: Type31.Number({ minimum: 0 })
    })
  ),
  plugins: Type31.Optional(
    closedObject({
      loaded: Type31.Array(Type31.String()),
      errors: Type31.Array(
        closedObject({
          id: Type31.String(),
          origin: Type31.String(),
          activated: Type31.Boolean(),
          activationSource: Type31.Optional(Type31.String()),
          activationReason: Type31.Optional(Type31.String()),
          failurePhase: Type31.Optional(Type31.String()),
          error: Type31.String()
        })
      ),
      unavailable: Type31.Optional(
        Type31.Array(
          closedObject({
            id: Type31.String(),
            state: Type31.Literal("configured-unavailable"),
            diagnostic: closedObject({
              kind: Type31.Literal("plugin-verification"),
              reason: Type31.String(),
              detail: Type31.String()
            })
          })
        )
      )
    })
  ),
  contextEngines: Type31.Optional(
    closedObject({
      quarantined: Type31.Array(
        closedObject({
          engineId: Type31.String(),
          owner: Type31.Optional(Type31.String()),
          operation: Type31.String(),
          reason: Type31.String(),
          failedAt: Type31.Integer({ minimum: 0 })
        })
      )
    })
  ),
  deliveryQueues: Type31.Optional(
    closedObject({
      failed: Type31.Array(
        closedObject({
          queueName: Type31.String(),
          count: Type31.Integer({ minimum: 0 }),
          oldestFailedAt: Type31.Optional(Type31.Integer({ minimum: 0 }))
        })
      )
    })
  ),
  modelPricing: Type31.Optional(
    closedObject({
      state: Type31.Union([Type31.Literal("ok"), Type31.Literal("degraded"), Type31.Literal("disabled")]),
      sources: Type31.Array(
        closedObject({
          source: Type31.Union([
            Type31.Literal("openrouter"),
            Type31.Literal("litellm"),
            Type31.Literal("bootstrap"),
            Type31.Literal("refresh")
          ]),
          state: Type31.Union([Type31.Literal("ok"), Type31.Literal("degraded")]),
          lastFailureAt: Type31.Optional(Type31.Integer({ minimum: 0 })),
          detail: Type31.Optional(Type31.String())
        })
      ),
      lastFailureAt: Type31.Optional(Type31.Integer({ minimum: 0 })),
      detail: Type31.Optional(Type31.String())
    })
  ),
  configReload: Type31.Optional(
    closedObject({
      hotReloadStatus: Type31.Union([Type31.Literal("active"), Type31.Literal("disabled")])
    })
  ),
  // Channel plugins own their nested account/probe summaries, so this is the
  // one provider-contributed bag that deliberately remains unknown.
  channels: Type31.Optional(Type31.Record(Type31.String(), Type31.Unknown())),
  channelOrder: Type31.Optional(Type31.Array(Type31.String())),
  channelLabels: Type31.Optional(Type31.Record(Type31.String(), Type31.String())),
  heartbeatSeconds: Type31.Optional(Type31.Integer({ minimum: 0 })),
  defaultAgentId: Type31.Optional(Type31.String()),
  agents: Type31.Optional(
    Type31.Array(
      closedObject({
        agentId: Type31.String(),
        name: Type31.Optional(Type31.String()),
        isDefault: Type31.Boolean(),
        heartbeat: closedObject({
          enabled: Type31.Boolean(),
          every: Type31.String(),
          everyMs: Type31.Union([Type31.Integer({ minimum: 0 }), Type31.Null()]),
          prompt: Type31.String(),
          target: Type31.String(),
          model: Type31.Optional(Type31.String()),
          ackMaxChars: Type31.Integer({ minimum: 0 })
        }),
        sessions: HealthSessionSummarySchema
      })
    )
  ),
  sessions: Type31.Optional(HealthSessionSummarySchema)
});
var SessionDefaultsSchema = closedObject({
  defaultAgentId: NonEmptyString,
  mainKey: NonEmptyString,
  mainSessionKey: NonEmptyString,
  scope: Type31.Optional(NonEmptyString)
});
var StateVersionSchema = closedObject({
  presence: Type31.Integer({ minimum: 0 }),
  health: Type31.Integer({ minimum: 0 })
});
var SnapshotSchema = closedObject({
  presence: Type31.Array(PresenceEntrySchema),
  health: HealthSnapshotSchema,
  stateVersion: StateVersionSchema,
  uptimeMs: Type31.Integer({ minimum: 0 }),
  /** Resolved source-config revision accepted by the active Gateway runtime. */
  appliedConfigHash: Type31.Optional(Type31.Union([NonEmptyString, Type31.Null()])),
  configPath: Type31.Optional(NonEmptyString),
  stateDir: Type31.Optional(NonEmptyString),
  sessionDefaults: Type31.Optional(SessionDefaultsSchema),
  authMode: Type31.Optional(
    Type31.Union([
      Type31.Literal("none"),
      Type31.Literal("token"),
      Type31.Literal("password"),
      Type31.Literal("trusted-proxy")
    ])
  ),
  updateAvailable: Type31.Optional(
    Type31.Object({
      currentVersion: NonEmptyString,
      latestVersion: NonEmptyString,
      channel: NonEmptyString
    })
  )
});

// packages/gateway-protocol/src/schema/frames.ts
var GATEWAY_SERVER_CAPS = {
  BOARD_WIDGET_PUT_CANVAS_DOC: "board-widget-put-canvas-doc",
  CHAT_SEND_ROUTING_CONTRACT: "chat-send-routing-contract",
  SYSTEM_AGENT_SETUP_MODEL_REF: "openclaw-setup-model-ref"
};
var TickEventSchema = closedObject({
  ts: Type32.Integer({ minimum: 0 })
});
var ShutdownEventSchema = closedObject({
  reason: NonEmptyString,
  restartExpectedMs: Type32.Optional(Type32.Integer({ minimum: 0 }))
});
var ConnectParamsSchema = closedObject({
  minProtocol: Type32.Integer({ minimum: 1 }),
  maxProtocol: Type32.Integer({ minimum: 1 }),
  client: closedObject({
    id: GatewayClientIdSchema,
    displayName: Type32.Optional(NonEmptyString),
    version: NonEmptyString,
    platform: NonEmptyString,
    deviceFamily: Type32.Optional(NonEmptyString),
    modelIdentifier: Type32.Optional(NonEmptyString),
    mode: GatewayClientModeSchema,
    instanceId: Type32.Optional(NonEmptyString)
  }),
  caps: Type32.Optional(Type32.Array(NonEmptyString, { default: [] })),
  commands: Type32.Optional(Type32.Array(NonEmptyString)),
  permissions: Type32.Optional(Type32.Record(NonEmptyString, Type32.Boolean())),
  pathEnv: Type32.Optional(Type32.String()),
  role: Type32.Optional(NonEmptyString),
  scopes: Type32.Optional(Type32.Array(NonEmptyString)),
  device: Type32.Optional(
    closedObject({
      id: NonEmptyString,
      publicKey: NonEmptyString,
      signature: NonEmptyString,
      signedAt: Type32.Integer({ minimum: 0 }),
      nonce: NonEmptyString
    })
  ),
  auth: Type32.Optional(
    closedObject({
      token: Type32.Optional(Type32.String()),
      bootstrapToken: Type32.Optional(Type32.String()),
      deviceToken: Type32.Optional(Type32.String()),
      password: Type32.Optional(Type32.String()),
      approvalRuntimeToken: Type32.Optional(Type32.String()),
      agentRuntimeIdentityToken: Type32.Optional(Type32.String())
    })
  ),
  locale: Type32.Optional(Type32.String()),
  userAgent: Type32.Optional(Type32.String())
});
var HelloOkSchema = closedObject({
  type: Type32.Literal("hello-ok"),
  protocol: Type32.Integer({ minimum: 1 }),
  server: closedObject({
    version: NonEmptyString,
    connId: NonEmptyString
  }),
  features: closedObject({
    methods: Type32.Array(NonEmptyString),
    events: Type32.Array(NonEmptyString),
    capabilities: Type32.Optional(Type32.Array(NonEmptyString))
  }),
  snapshot: SnapshotSchema,
  // Additive: plugin-declared Control UI tabs (surface "tab" descriptors).
  controlUiTabs: Type32.Optional(
    Type32.Array(
      closedObject({
        pluginId: NonEmptyString,
        id: NonEmptyString,
        label: NonEmptyString,
        description: Type32.Optional(Type32.String()),
        icon: Type32.Optional(Type32.String()),
        path: Type32.Optional(Type32.String()),
        requiresGatewayAuth: Type32.Optional(Type32.Boolean()),
        group: Type32.Optional(Type32.Union([Type32.Literal("control"), Type32.Literal("agent")])),
        order: Type32.Optional(Type32.Number())
      })
    )
  ),
  pluginSurfaceUrls: Type32.Optional(Type32.Record(NonEmptyString, NonEmptyString)),
  auth: closedObject({
    deviceToken: Type32.Optional(NonEmptyString),
    role: NonEmptyString,
    scopes: Type32.Array(NonEmptyString),
    issuedAtMs: Type32.Optional(Type32.Integer({ minimum: 0 })),
    deviceTokens: Type32.Optional(
      Type32.Array(
        closedObject({
          deviceToken: NonEmptyString,
          role: NonEmptyString,
          scopes: Type32.Array(NonEmptyString),
          issuedAtMs: Type32.Integer({ minimum: 0 })
        })
      )
    )
  }),
  policy: closedObject({
    maxPayload: Type32.Integer({ minimum: 1 }),
    maxBufferedBytes: Type32.Integer({ minimum: 1 }),
    tickIntervalMs: Type32.Integer({ minimum: 1 })
  })
});
var ErrorShapeSchema = closedObject({
  code: NonEmptyString,
  message: NonEmptyString,
  details: Type32.Optional(Type32.Unknown()),
  retryable: Type32.Optional(Type32.Boolean()),
  retryAfterMs: Type32.Optional(Type32.Integer({ minimum: 0 }))
});
var RequestFrameSchema = closedObject({
  type: Type32.Literal("req"),
  id: NonEmptyString,
  method: NonEmptyString,
  params: Type32.Optional(Type32.Unknown())
});
var ResponseFrameSchema = closedObject({
  type: Type32.Literal("res"),
  id: NonEmptyString,
  ok: Type32.Boolean(),
  payload: Type32.Optional(Type32.Unknown()),
  error: Type32.Optional(ErrorShapeSchema)
});
var EventFrameSchema = closedObject({
  type: Type32.Literal("event"),
  event: NonEmptyString,
  payload: Type32.Optional(Type32.Unknown()),
  seq: Type32.Optional(Type32.Integer({ minimum: 0 })),
  stateVersion: Type32.Optional(StateVersionSchema)
});
var GatewayFrameSchema = Type32.Union(
  [RequestFrameSchema, ResponseFrameSchema, EventFrameSchema],
  { discriminator: "type" }
);

// packages/gateway-protocol/src/schema/fs.ts
import { Type as Type33 } from "typebox";
var FsListDirParamsSchema = closedObject({
  /** Absolute directory to list; omitted means the selected host's home directory. */
  path: Type33.Optional(NonEmptyString),
  /** Connected node host to browse; omitted means the Gateway host. */
  nodeId: Type33.Optional(NonEmptyString)
});
var FsDirEntrySchema = closedObject({
  name: NonEmptyString,
  path: NonEmptyString,
  /** Dot-prefixed directories; clients render them dimmed after visible ones. */
  hidden: Type33.Optional(Type33.Boolean())
});
var FsListDirResultSchema = closedObject({
  /** Resolved absolute path that was listed. */
  path: NonEmptyString,
  /** Absent at the filesystem root. */
  parent: Type33.Optional(NonEmptyString),
  /** Selected host's home directory, for the picker's "home" shortcut. */
  home: NonEmptyString,
  entries: Type33.Array(FsDirEntrySchema)
});

// packages/gateway-protocol/src/schema/gateway-suspend.ts
import { Type as Type34 } from "typebox";
var SuspensionTokenSchema = Type34.String({ minLength: 1, maxLength: 128, pattern: "\\S" });
var CountSchema = Type34.Integer({ minimum: 0 });
var GatewaySuspendTaskBlockerSchema = closedObject({
  taskId: Type34.String(),
  status: Type34.Literal("running"),
  runtime: Type34.Union([
    Type34.Literal("subagent"),
    Type34.Literal("acp"),
    Type34.Literal("cli"),
    Type34.Literal("cron")
  ]),
  runId: Type34.Optional(Type34.String()),
  label: Type34.Optional(Type34.String()),
  title: Type34.Optional(Type34.String())
});
var GatewaySuspendBlockerSchema = closedObject({
  kind: Type34.Union([
    Type34.Literal("queue"),
    Type34.Literal("reply"),
    Type34.Literal("embedded-run"),
    Type34.Literal("background-exec"),
    Type34.Literal("cron-run"),
    Type34.Literal("task"),
    Type34.Literal("root-request"),
    Type34.Literal("session-admission"),
    Type34.Literal("session-mutation"),
    Type34.Literal("chat-run"),
    Type34.Literal("queued-turn"),
    Type34.Literal("terminal-persistence"),
    Type34.Literal("terminal-session")
  ]),
  count: CountSchema,
  message: Type34.String(),
  task: Type34.Optional(GatewaySuspendTaskBlockerSchema)
});
var GatewaySuspendPrepareParamsSchema = closedObject({ requestId: SuspensionTokenSchema });
var GatewaySuspendPrepareBusyResultSchema = closedObject({
  status: Type34.Literal("busy"),
  reason: Type34.Union([Type34.Literal("active-work"), Type34.Literal("gateway-draining")]),
  retryAfterMs: CountSchema,
  activeCount: CountSchema,
  blockers: Type34.Array(GatewaySuspendBlockerSchema)
});
var GatewaySuspendPrepareReadyResultSchema = closedObject({
  status: Type34.Literal("ready"),
  suspensionId: SuspensionTokenSchema,
  expiresAtMs: CountSchema,
  activeCount: CountSchema,
  blockers: Type34.Array(GatewaySuspendBlockerSchema)
});
var GatewaySuspendPrepareResultSchema = Type34.Union([
  GatewaySuspendPrepareBusyResultSchema,
  GatewaySuspendPrepareReadyResultSchema
]);
var GatewaySuspendStatusParamsSchema = closedObject({
  suspensionId: SuspensionTokenSchema
});
var GatewaySuspendStatusRunningResultSchema = closedObject({
  status: Type34.Literal("running")
});
var GatewaySuspendStatusReadyResultSchema = closedObject({
  status: Type34.Literal("ready"),
  expiresAtMs: CountSchema
});
var GatewaySuspendStatusResultSchema = Type34.Union([
  GatewaySuspendStatusRunningResultSchema,
  GatewaySuspendStatusReadyResultSchema
]);
var GatewaySuspendResumeParamsSchema = GatewaySuspendStatusParamsSchema;
var GatewaySuspendResumeResultSchema = closedObject({
  ok: Type34.Literal(true),
  status: Type34.Literal("running"),
  resumed: Type34.Boolean()
});

// packages/gateway-protocol/src/schema/logs-chat.ts
import { Type as Type35 } from "typebox";
var LogsTailParamsSchema = closedObject({
  cursor: Type35.Optional(Type35.Integer({ minimum: 0 })),
  limit: Type35.Optional(Type35.Integer({ minimum: 1, maximum: 5e3 })),
  maxBytes: Type35.Optional(Type35.Integer({ minimum: 1, maximum: 1e6 }))
});
var LogsTailResultSchema = closedObject({
  file: NonEmptyString,
  cursor: Type35.Integer({ minimum: 0 }),
  size: Type35.Integer({ minimum: 0 }),
  lines: Type35.Array(Type35.String()),
  truncated: Type35.Optional(Type35.Boolean()),
  reset: Type35.Optional(Type35.Boolean())
});
var ChatHistoryParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type35.Optional(NonEmptyString),
  limit: Type35.Optional(Type35.Integer({ minimum: 1, maximum: 1e3 })),
  offset: Type35.Optional(Type35.Integer({ minimum: 0 })),
  messageId: Type35.Optional(NonEmptyString),
  sessionId: Type35.Optional(NonEmptyString),
  maxChars: Type35.Optional(Type35.Integer({ minimum: 1, maximum: 5e5 }))
});
var ChatMetadataParamsSchema = closedObject({
  agentId: Type35.Optional(NonEmptyString)
});
var ChatToolTitlesParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type35.Optional(NonEmptyString),
  items: Type35.Array(
    closedObject({
      id: Type35.String({ minLength: 1, maxLength: 64 }),
      name: Type35.String({ minLength: 1, maxLength: 200 }),
      input: Type35.String({ minLength: 1, maxLength: 4e3 })
    }),
    { minItems: 1, maxItems: 24 }
  )
});
var ChatToolTitlesResultSchema = closedObject({
  titles: Type35.Record(Type35.String(), Type35.String()),
  disabled: Type35.Optional(Type35.Boolean())
});
var ChatMessageGetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type35.Optional(NonEmptyString),
  messageId: NonEmptyString,
  maxChars: Type35.Optional(Type35.Integer({ minimum: 1, maximum: 2e6 }))
});
var ChatMessageGetResultSchema = closedObject({
  ok: Type35.Boolean(),
  message: Type35.Optional(Type35.Unknown()),
  unavailableReason: Type35.Optional(
    Type35.Union([Type35.Literal("not_found"), Type35.Literal("oversized"), Type35.Literal("not_visible")])
  )
});
var ChatAttachmentsSchema = Type35.Array(Type35.Unknown());
var RunToolBindingsSchema = Type35.Record(
  Type35.String({ minLength: 1, maxLength: 128 }),
  Type35.Unknown(),
  { maxProperties: 16 }
);
var ChatSendParamsSchema = closedObject({
  sessionKey: ChatSendSessionKeyString,
  agentId: Type35.Optional(NonEmptyString),
  sessionId: Type35.Optional(NonEmptyString),
  message: Type35.String(),
  thinking: Type35.Optional(Type35.String()),
  fastMode: Type35.Optional(Type35.Union([Type35.Boolean(), Type35.Literal("auto")])),
  // One-turn override for auto fast-mode cutoff seconds.
  fastAutoOnSeconds: Type35.Optional(Type35.Integer({ minimum: 1 })),
  // One-turn override for active-run queue admission.
  queueMode: Type35.Optional(Type35.String({ enum: ["steer", "followup", "collect", "interrupt"] })),
  deliver: Type35.Optional(Type35.Boolean()),
  originatingChannel: Type35.Optional(Type35.String()),
  originatingTo: Type35.Optional(Type35.String()),
  originatingAccountId: Type35.Optional(Type35.String()),
  originatingThreadId: Type35.Optional(Type35.String()),
  // Transcript id of the message this send replies to; the Gateway hydrates
  // channel-agnostic reply context metadata from session history.
  replyToId: Type35.Optional(NonEmptyString),
  attachments: Type35.Optional(ChatAttachmentsSchema),
  toolBindings: Type35.Optional(RunToolBindingsSchema),
  timeoutMs: Type35.Optional(Type35.Integer({ minimum: 0 })),
  systemInputProvenance: Type35.Optional(InputProvenanceSchema),
  systemProvenanceReceipt: Type35.Optional(Type35.String()),
  suppressCommandInterpretation: Type35.Optional(Type35.Boolean()),
  expectedSessionRoutingContract: Type35.Optional(NonEmptyString),
  idempotencyKey: NonEmptyString
});
var ChatAbortParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type35.Optional(NonEmptyString),
  runId: Type35.Optional(NonEmptyString),
  preserveSideRuns: Type35.Optional(Type35.Boolean())
});
var ChatInjectParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type35.Optional(NonEmptyString),
  message: NonEmptyString,
  label: Type35.Optional(Type35.String({ maxLength: 100 }))
});
var ChatEventBaseSchema = {
  runId: NonEmptyString,
  sessionKey: NonEmptyString,
  agentId: Type35.Optional(NonEmptyString),
  spawnedBy: Type35.Optional(NonEmptyString),
  seq: Type35.Integer({ minimum: 0 })
};
var ChatEventErrorKindSchema = Type35.Union([
  Type35.Literal("refusal"),
  Type35.Literal("timeout"),
  Type35.Literal("rate_limit"),
  Type35.Literal("context_length"),
  Type35.Literal("unknown")
]);
var ChatDeltaEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type35.Literal("delta"),
  message: Type35.Optional(Type35.Unknown()),
  deltaText: Type35.String(),
  replace: Type35.Optional(Type35.Boolean()),
  usage: Type35.Optional(Type35.Unknown())
});
var ChatFinalEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type35.Literal("final"),
  message: Type35.Optional(Type35.Unknown()),
  usage: Type35.Optional(Type35.Unknown()),
  stopReason: Type35.Optional(Type35.String()),
  yielded: Type35.Optional(Type35.Literal(true))
});
var ChatAbortedEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type35.Literal("aborted"),
  message: Type35.Optional(Type35.Unknown()),
  errorMessage: Type35.Optional(Type35.String()),
  stopReason: Type35.Optional(Type35.String())
});
var ChatErrorEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type35.Literal("error"),
  message: Type35.Optional(Type35.Unknown()),
  errorMessage: Type35.Optional(Type35.String()),
  errorKind: Type35.Optional(ChatEventErrorKindSchema),
  usage: Type35.Optional(Type35.Unknown()),
  stopReason: Type35.Optional(Type35.String())
});
var ChatEventSchema = Type35.Union([
  ChatDeltaEventSchema,
  ChatFinalEventSchema,
  ChatAbortedEventSchema,
  ChatErrorEventSchema
]);

// packages/gateway-protocol/src/schema/nodes.ts
import { Type as Type36 } from "typebox";
var NodePluginToolNameSchema = Type36.String({
  minLength: 1,
  maxLength: 64,
  pattern: "^[A-Za-z][A-Za-z0-9_-]{0,63}$"
});
var NodeSkillNameSchema = Type36.String({
  minLength: 1,
  maxLength: 64,
  pattern: "^(?!.*--)[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$"
});
var NodePendingWorkTypeSchema = Type36.String({
  enum: ["status.request", "location.request"]
});
var NodePendingWorkPrioritySchema = Type36.String({
  enum: ["normal", "high"]
});
var NodePresenceAliveReasonSchema = Type36.String({
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
  sentAtMs: Type36.Optional(Type36.Integer({ minimum: 0 })),
  displayName: Type36.Optional(NonEmptyString),
  version: Type36.Optional(NonEmptyString),
  platform: Type36.Optional(NonEmptyString),
  deviceFamily: Type36.Optional(NonEmptyString),
  modelIdentifier: Type36.Optional(NonEmptyString),
  pushTransport: Type36.Optional(NonEmptyString)
});
var NodePresenceActivityPayloadSchema = closedObject({
  idleSeconds: Type36.Integer({ minimum: 0, maximum: 2592e3 }),
  saturated: Type36.Optional(Type36.Boolean())
});
var NodeEventResultSchema = closedObject({
  ok: Type36.Boolean(),
  event: NonEmptyString,
  handled: Type36.Boolean(),
  reason: Type36.Optional(NonEmptyString)
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
  parameters: Type36.Optional(Type36.Record(Type36.String(), Type36.Unknown())),
  command: Type36.Optional(NonEmptyString),
  mcp: Type36.Optional(
    closedObject({
      server: NonEmptyString,
      tool: NonEmptyString
    })
  )
});
var NodePluginToolsUpdateParamsSchema = closedObject({
  tools: Type36.Array(NodePluginToolDescriptorSchema)
});
var NodeSkillDescriptorSchema = closedObject({
  name: NodeSkillNameSchema,
  description: Type36.String({ minLength: 1, maxLength: 1024 }),
  content: Type36.String({ minLength: 1, maxLength: 64 * 1024 })
});
var NodeSkillsUpdateParamsSchema = closedObject({
  skills: Type36.Array(NodeSkillDescriptorSchema, { maxItems: 64 })
});
var NodePendingAckParamsSchema = closedObject({
  ids: Type36.Array(NonEmptyString, { minItems: 1 })
});
var NodeDescribeParamsSchema = closedObject({ nodeId: NonEmptyString });
var NodeInvokeParamsSchema = closedObject({
  nodeId: NonEmptyString,
  command: NonEmptyString,
  params: Type36.Optional(Type36.Unknown()),
  timeoutMs: Type36.Optional(Type36.Integer({ minimum: 0 })),
  idempotencyKey: NonEmptyString,
  // Gateway-only agent ownership metadata. Forwarded beside params, never inside them.
  sessionKey: Type36.Optional(NonEmptyString),
  // Gateway-only approval routing metadata. Node forwarding strips these fields.
  turnSourceChannel: Type36.Optional(Type36.String()),
  turnSourceTo: Type36.Optional(Type36.String()),
  turnSourceAccountId: Type36.Optional(Type36.String()),
  turnSourceThreadId: Type36.Optional(Type36.Union([Type36.String(), Type36.Number()]))
});
var NodeInvokeResultParamsSchema = closedObject({
  id: NonEmptyString,
  nodeId: NonEmptyString,
  ok: Type36.Boolean(),
  payload: Type36.Optional(Type36.Unknown()),
  payloadJSON: Type36.Optional(Type36.String()),
  error: Type36.Optional(
    closedObject({
      code: Type36.Optional(NonEmptyString),
      message: Type36.Optional(NonEmptyString)
    })
  )
});
var NodeInvokeProgressParamsSchema = closedObject({
  invokeId: NonEmptyString,
  nodeId: NonEmptyString,
  seq: Type36.Integer({ minimum: 0 }),
  // Empty chunks are liveness heartbeats for captured stderr or capped stdout.
  chunk: Type36.String({ maxLength: 16 * 1024 })
});
var NodeEventParamsSchema = closedObject({
  event: NonEmptyString,
  payload: Type36.Optional(Type36.Unknown()),
  payloadJSON: Type36.Optional(Type36.String())
});
var NodePendingDrainParamsSchema = closedObject({
  maxItems: Type36.Optional(Type36.Integer({ minimum: 1, maximum: 10 }))
});
var NodePendingDrainItemSchema = closedObject({
  id: NonEmptyString,
  type: NodePendingWorkTypeSchema,
  priority: Type36.String({ enum: ["default", "normal", "high"] }),
  createdAtMs: Type36.Integer({ minimum: 0 }),
  expiresAtMs: Type36.Optional(Type36.Union([Type36.Integer({ minimum: 0 }), Type36.Null()])),
  payload: Type36.Optional(Type36.Record(Type36.String(), Type36.Unknown()))
});
var NodePendingDrainResultSchema = closedObject({
  nodeId: NonEmptyString,
  revision: Type36.Integer({ minimum: 0 }),
  items: Type36.Array(NodePendingDrainItemSchema),
  hasMore: Type36.Boolean()
});
var NodePendingEnqueueParamsSchema = closedObject({
  nodeId: NonEmptyString,
  type: NodePendingWorkTypeSchema,
  priority: Type36.Optional(NodePendingWorkPrioritySchema),
  expiresInMs: Type36.Optional(Type36.Integer({ minimum: 1e3, maximum: 864e5 })),
  wake: Type36.Optional(Type36.Boolean())
});
var NodePendingEnqueueResultSchema = closedObject({
  nodeId: NonEmptyString,
  revision: Type36.Integer({ minimum: 0 }),
  queued: NodePendingDrainItemSchema,
  wakeTriggered: Type36.Boolean()
});
var NodeInvokeRequestEventSchema = closedObject({
  id: NonEmptyString,
  nodeId: NonEmptyString,
  command: NonEmptyString,
  paramsJSON: Type36.Optional(Type36.String()),
  timeoutMs: Type36.Optional(Type36.Integer({ minimum: 0 })),
  idempotencyKey: Type36.Optional(NonEmptyString)
});
var NodeInvokeInputEventSchema = closedObject({
  id: NonEmptyString,
  nodeId: NonEmptyString,
  seq: Type36.Integer({ minimum: 0 }),
  payloadJSON: Type36.String({ maxLength: 16 * 1024 })
});

// packages/gateway-protocol/src/schema/log-migration-protocol-schemas.ts
var LogMigrationProtocolSchemas = {
  LogsTailParams: LogsTailParamsSchema,
  LogsTailResult: LogsTailResultSchema,
  ...MigrationProtocolSchemas
};

// packages/gateway-protocol/src/schema/plugin-approvals.ts
import { Type as Type37 } from "typebox";
var MAX_PLUGIN_APPROVAL_TIMEOUT_MS = 6e5;
var PLUGIN_APPROVAL_TITLE_MAX_LENGTH = 80;
var PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH = 512;
var PluginApprovalRequestParamsSchema = closedObject({
  pluginId: Type37.Optional(NonEmptyString),
  title: Type37.String({ minLength: 1, maxLength: PLUGIN_APPROVAL_TITLE_MAX_LENGTH }),
  description: Type37.String({ minLength: 1, maxLength: PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH }),
  severity: Type37.Optional(Type37.String({ enum: ["info", "warning", "critical"] })),
  toolName: Type37.Optional(Type37.String()),
  toolCallId: Type37.Optional(Type37.String()),
  allowedDecisions: Type37.Optional(
    Type37.Array(Type37.String({ enum: ["allow-once", "allow-always", "deny"] }), {
      minItems: 1,
      maxItems: 3
    })
  ),
  agentId: Type37.Optional(Type37.String()),
  sessionKey: Type37.Optional(Type37.String()),
  approvalReviewerDeviceIds: Type37.Optional(
    Type37.Array(NonEmptyString, {
      description: "Trusted approval-runtime metadata naming operator devices that may review this approval; ordinary Gateway clients may send the field, but the Gateway only binds it for internal approval-runtime requests."
    })
  ),
  turnSourceChannel: Type37.Optional(Type37.String()),
  turnSourceTo: Type37.Optional(Type37.String()),
  turnSourceAccountId: Type37.Optional(Type37.String()),
  turnSourceThreadId: Type37.Optional(Type37.Union([Type37.String(), Type37.Number()])),
  timeoutMs: Type37.Optional(Type37.Integer({ minimum: 1, maximum: MAX_PLUGIN_APPROVAL_TIMEOUT_MS })),
  twoPhase: Type37.Optional(Type37.Boolean())
});
var PluginApprovalResolveParamsSchema = closedObject({
  id: NonEmptyString,
  decision: NonEmptyString
});

// packages/gateway-protocol/src/schema/protocol-schemas-node-invoke.ts
var NodeInvokeProtocolSchemas = {
  NodeInvokeParams: NodeInvokeParamsSchema,
  NodeInvokeInputEvent: NodeInvokeInputEventSchema,
  NodeInvokeProgressParams: NodeInvokeProgressParamsSchema,
  NodeInvokeResultParams: NodeInvokeResultParamsSchema,
  NodeInvokeRequestEvent: NodeInvokeRequestEventSchema
};

// packages/gateway-protocol/src/schema/protocol-schemas-node-presence.ts
var NodePresenceProtocolSchemas = {
  NodePresenceAliveReason: NodePresenceAliveReasonSchema,
  NodePresenceActivityPayload: NodePresenceActivityPayloadSchema
};

// packages/gateway-protocol/src/schema/push.ts
import { Type as Type38 } from "typebox";
var ApnsEnvironmentSchema = Type38.String({ enum: ["sandbox", "production"] });
var PushTestParamsSchema = closedObject({
  nodeId: NonEmptyString,
  title: Type38.Optional(Type38.String()),
  body: Type38.Optional(Type38.String()),
  environment: Type38.Optional(ApnsEnvironmentSchema)
});
var PushTestResultSchema = closedObject({
  ok: Type38.Boolean(),
  status: Type38.Integer(),
  apnsId: Type38.Optional(Type38.String()),
  reason: Type38.Optional(Type38.String()),
  tokenSuffix: Type38.String(),
  topic: Type38.String(),
  environment: ApnsEnvironmentSchema,
  transport: Type38.String({ enum: ["direct", "relay"] })
});
var WebPushKeysSchema = closedObject({
  p256dh: Type38.String({ minLength: 1, maxLength: 512 }),
  auth: Type38.String({ minLength: 1, maxLength: 512 })
});
var WebPushVapidPublicKeyParamsSchema = closedObject({});
var WebPushSubscribeParamsSchema = closedObject({
  endpoint: Type38.String({ minLength: 1, maxLength: 2048, pattern: "^https://" }),
  keys: WebPushKeysSchema
});
var WebPushUnsubscribeParamsSchema = closedObject({
  endpoint: Type38.String({ minLength: 1, maxLength: 2048, pattern: "^https://" })
});
var WebPushTestParamsSchema = closedObject({
  title: Type38.Optional(Type38.String()),
  body: Type38.Optional(Type38.String())
});

// packages/gateway-protocol/src/schema/questions.ts
import { Type as Type39 } from "typebox";
var QuestionIdSchema = Type39.String({ pattern: "^[a-z][a-z0-9_]*$" });
var QuestionHeaderSchema = Type39.String({ maxLength: 12 });
var QuestionOptionSchema = closedObject({
  label: NonEmptyString,
  description: Type39.Optional(Type39.String())
});
var QuestionInputFields = {
  questionId: QuestionIdSchema,
  header: QuestionHeaderSchema,
  question: NonEmptyString,
  options: Type39.Array(QuestionOptionSchema, { maxItems: 4 }),
  multiSelect: Type39.Optional(Type39.Boolean()),
  isOther: Type39.Optional(Type39.Boolean()),
  isSecret: Type39.Optional(Type39.Boolean())
};
var QuestionRequestQuestionSchema = closedObject(QuestionInputFields);
var QuestionFields = {
  ...QuestionInputFields
};
var QuestionSchema = closedObject(QuestionFields);
var QuestionAnswersSchema = closedObject({
  answers: Type39.Record(QuestionIdSchema, Type39.Array(Type39.String()))
});
var QuestionStatusSchema = Type39.Union([
  Type39.Literal("pending"),
  Type39.Literal("answered"),
  Type39.Literal("cancelled"),
  Type39.Literal("expired")
]);
var QuestionRecordSchema = closedObject({
  id: NonEmptyString,
  questions: Type39.Array(QuestionSchema, { minItems: 1, maxItems: 3 }),
  agentId: Type39.Optional(NonEmptyString),
  sessionKey: Type39.Optional(NonEmptyString),
  createdAtMs: Type39.Integer({ minimum: 0 }),
  expiresAtMs: Type39.Integer({ minimum: 0 }),
  status: QuestionStatusSchema,
  answers: Type39.Optional(QuestionAnswersSchema),
  resolvedBy: Type39.Optional(NonEmptyString)
});
var QuestionRequestParamsSchema = closedObject({
  id: Type39.Optional(NonEmptyString),
  questions: Type39.Array(QuestionRequestQuestionSchema, { minItems: 1, maxItems: 3 }),
  agentId: Type39.Optional(NonEmptyString),
  sessionKey: Type39.Optional(NonEmptyString),
  timeoutMs: Type39.Optional(Type39.Integer({ minimum: 1 }))
});
var QuestionRequestResultSchema = closedObject({
  id: NonEmptyString,
  expiresAtMs: Type39.Integer({ minimum: 0 })
});
var QuestionWaitAnswerParamsSchema = closedObject({
  id: NonEmptyString,
  timeoutMs: Type39.Optional(Type39.Integer({ minimum: 1 }))
});
var QuestionWaitAnswerResultSchema = Type39.Union([
  closedObject({ status: Type39.Literal("pending") }),
  closedObject({ status: Type39.Literal("answered"), answers: QuestionAnswersSchema }),
  closedObject({ status: Type39.Literal("cancelled") }),
  closedObject({ status: Type39.Literal("expired") })
]);
var QuestionResolveParamsSchema = Type39.Union([
  closedObject({
    id: NonEmptyString,
    answers: QuestionAnswersSchema,
    resolvedBy: Type39.Optional(NonEmptyString)
  }),
  closedObject({
    id: NonEmptyString,
    cancel: Type39.Literal(true),
    resolvedBy: Type39.Optional(NonEmptyString)
  })
]);
var QuestionResolveResultSchema = Type39.Union([
  closedObject({ status: Type39.Literal("answered"), answers: QuestionAnswersSchema }),
  closedObject({ status: Type39.Literal("cancelled") })
]);
var QuestionGetParamsSchema = closedObject({ id: NonEmptyString });
var QuestionGetResultSchema = closedObject({ question: QuestionRecordSchema });
var QuestionListParamsSchema = closedObject({});
var QuestionListResultSchema = closedObject({
  questions: Type39.Array(QuestionRecordSchema)
});
var QuestionRequestedEventSchema = withSince("2026.7", QuestionRecordSchema);
var QuestionResolvedEventSchema = withSince(
  "2026.7",
  Type39.Union([
    closedObject({
      id: NonEmptyString,
      status: Type39.Literal("answered"),
      answers: QuestionAnswersSchema
    }),
    closedObject({ id: NonEmptyString, status: Type39.Literal("cancelled") }),
    closedObject({ id: NonEmptyString, status: Type39.Literal("expired") })
  ])
);

// packages/gateway-protocol/src/schema/secrets.ts
import { Type as Type40 } from "typebox";
var SecretsReloadParamsSchema = closedObject({});
var SecretsResolveParamsSchema = closedObject({
  commandName: NonEmptyString,
  targetIds: Type40.Array(NonEmptyString),
  allowedPaths: Type40.Optional(Type40.Array(NonEmptyString)),
  forcedActivePaths: Type40.Optional(Type40.Array(NonEmptyString)),
  optionalActivePaths: Type40.Optional(Type40.Array(NonEmptyString)),
  providerOverrides: Type40.Optional(
    closedObject({
      webSearch: Type40.Optional(NonEmptyString),
      webFetch: Type40.Optional(NonEmptyString)
    })
  )
});
var SecretsResolveAssignmentSchema = closedObject({
  path: Type40.Optional(NonEmptyString),
  pathSegments: Type40.Array(NonEmptyString),
  value: Type40.Unknown()
});
var SecretsResolveResultSchema = closedObject({
  ok: Type40.Optional(Type40.Boolean()),
  assignments: Type40.Optional(Type40.Array(SecretsResolveAssignmentSchema)),
  diagnostics: Type40.Optional(Type40.Array(NonEmptyString)),
  inactiveRefPaths: Type40.Optional(Type40.Array(NonEmptyString))
});

// packages/gateway-protocol/src/schema/session-discussion.ts
import { Type as Type41 } from "typebox";
var SessionDiscussionStateSchema = Type41.Union([
  Type41.Literal("none"),
  Type41.Literal("available"),
  Type41.Literal("open")
]);
var SessionDiscussionInfoSchema = closedObject({
  state: SessionDiscussionStateSchema,
  embedUrl: Type41.Optional(Type41.String()),
  openUrl: Type41.Optional(Type41.String())
});
var SessionDiscussionInfoParamsSchema = closedObject({
  sessionKey: NonEmptyString
});
var SessionDiscussionOpenParamsSchema = closedObject({
  sessionKey: NonEmptyString
});
var SessionDiscussionInfoResultSchema = SessionDiscussionInfoSchema;
var SessionDiscussionOpenResultSchema = SessionDiscussionInfoSchema;

// packages/gateway-protocol/src/schema/session-placement.ts
import { Type as Type42 } from "typebox";

// packages/gateway-protocol/src/schema/session-placement-state.ts
function isCloudWorkerPlacementState(state) {
  return state !== void 0 && state !== "local" && state !== "reclaimed";
}

// packages/gateway-protocol/src/schema/session-placement.ts
var SessionPlacementStateSchema = Type42.Union([
  Type42.Literal("local"),
  Type42.Literal("requested"),
  Type42.Literal("provisioning"),
  Type42.Literal("syncing"),
  Type42.Literal("starting"),
  Type42.Literal("active"),
  Type42.Literal("draining"),
  Type42.Literal("reconciling"),
  Type42.Literal("reclaimed"),
  Type42.Literal("failed")
]);
var SessionPlacementTimingProperties = {
  generation: Type42.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  createdAtMs: Type42.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  updatedAtMs: Type42.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  stateChangedAtMs: Type42.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
};
var SessionPlacementOwnerEpochSchema = Type42.Integer({
  minimum: 1,
  maximum: Number.MAX_SAFE_INTEGER
});
var WorkerBundleHashSchema2 = Type42.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var SessionPlacementWorkspaceProperties = {
  workspaceBaseManifestRef: NonEmptyString,
  remoteWorkspaceDir: NonEmptyString
};
var SessionPlacementAckProperties = {
  lastTranscriptAckCursor: Type42.Optional(
    Type42.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
  ),
  lastLiveEventAckCursor: Type42.Optional(
    Type42.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
  )
};
var WorkspaceResultConflictSchema = closedObject({
  paths: Type42.Array(NonEmptyString, { minItems: 1, maxItems: 256 }),
  stagedResultRef: NonEmptyString,
  totalCount: Type42.Optional(Type42.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }))
});
var SessionPlacementConflictProperties = {
  workspaceResultConflict: Type42.Optional(WorkspaceResultConflictSchema)
};
var TerminalSessionPlacementProperties = {
  environmentId: Type42.Optional(NonEmptyString),
  activeOwnerEpoch: Type42.Optional(SessionPlacementOwnerEpochSchema),
  workspaceBaseManifestRef: Type42.Optional(NonEmptyString),
  remoteWorkspaceDir: Type42.Optional(NonEmptyString),
  workerBundleHash: Type42.Optional(WorkerBundleHashSchema2),
  ...SessionPlacementAckProperties,
  ...SessionPlacementConflictProperties
};
function createUnownedSessionPlacementSchema(state) {
  return closedObject({ state: Type42.Literal(state), ...SessionPlacementTimingProperties });
}
function createWorkerOwnedSessionPlacementSchema(state) {
  return closedObject({
    state: Type42.Literal(state),
    ...SessionPlacementTimingProperties,
    environmentId: NonEmptyString,
    activeOwnerEpoch: SessionPlacementOwnerEpochSchema,
    workerBundleHash: WorkerBundleHashSchema2,
    ...SessionPlacementWorkspaceProperties,
    ...SessionPlacementAckProperties,
    ...SessionPlacementConflictProperties
  });
}
var LocalSessionPlacementSchema = createUnownedSessionPlacementSchema("local");
var RequestedSessionPlacementSchema = createUnownedSessionPlacementSchema("requested");
var ProvisioningSessionPlacementSchema = closedObject({
  state: Type42.Literal("provisioning"),
  ...SessionPlacementTimingProperties,
  environmentId: Type42.Optional(NonEmptyString)
});
var SyncingSessionPlacementSchema = closedObject({
  state: Type42.Literal("syncing"),
  ...SessionPlacementTimingProperties,
  environmentId: NonEmptyString,
  workerBundleHash: WorkerBundleHashSchema2
});
var StartingSessionPlacementSchema = closedObject({
  state: Type42.Literal("starting"),
  ...SessionPlacementTimingProperties,
  environmentId: NonEmptyString,
  workerBundleHash: WorkerBundleHashSchema2,
  ...SessionPlacementWorkspaceProperties
});
var ActiveWorkerSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("active");
var DrainingSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("draining");
var ReconcilingSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("reconciling");
var ReclaimedSessionPlacementSchema = closedObject({
  state: Type42.Literal("reclaimed"),
  ...SessionPlacementTimingProperties,
  ...TerminalSessionPlacementProperties
});
var FailedSessionPlacementSchema = closedObject({
  state: Type42.Literal("failed"),
  ...SessionPlacementTimingProperties,
  ...TerminalSessionPlacementProperties,
  recoveryError: NonEmptyString
});
var SessionPlacementSchema = Type42.Union([
  LocalSessionPlacementSchema,
  RequestedSessionPlacementSchema,
  ProvisioningSessionPlacementSchema,
  SyncingSessionPlacementSchema,
  StartingSessionPlacementSchema,
  ActiveWorkerSessionPlacementSchema,
  DrainingSessionPlacementSchema,
  ReconcilingSessionPlacementSchema,
  ReclaimedSessionPlacementSchema,
  FailedSessionPlacementSchema
]);
var SessionsDispatchParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type42.Optional(NonEmptyString),
  profileId: NonEmptyString
});
var SessionsDispatchResultSchema = closedObject({
  ok: Type42.Literal(true),
  key: NonEmptyString,
  sessionId: NonEmptyString,
  placement: ActiveWorkerSessionPlacementSchema
});
var SessionsReclaimParamsSchema = Type42.Object(
  {
    key: NonEmptyString,
    agentId: Type42.Optional(NonEmptyString)
  },
  { additionalProperties: false }
);
var SessionsReclaimResultSchema = Type42.Object(
  {
    ok: Type42.Literal(true),
    key: NonEmptyString,
    sessionId: NonEmptyString,
    placement: ReclaimedSessionPlacementSchema
  },
  { additionalProperties: false }
);
var SessionPlacementProtocolSchemas = {
  SessionPlacementState: SessionPlacementStateSchema,
  LocalSessionPlacement: LocalSessionPlacementSchema,
  RequestedSessionPlacement: RequestedSessionPlacementSchema,
  ProvisioningSessionPlacement: ProvisioningSessionPlacementSchema,
  SyncingSessionPlacement: SyncingSessionPlacementSchema,
  StartingSessionPlacement: StartingSessionPlacementSchema,
  ActiveWorkerSessionPlacement: ActiveWorkerSessionPlacementSchema,
  DrainingSessionPlacement: DrainingSessionPlacementSchema,
  ReconcilingSessionPlacement: ReconcilingSessionPlacementSchema,
  ReclaimedSessionPlacement: ReclaimedSessionPlacementSchema,
  FailedSessionPlacement: FailedSessionPlacementSchema,
  SessionPlacement: SessionPlacementSchema,
  SessionsDispatchParams: SessionsDispatchParamsSchema,
  SessionsDispatchResult: SessionsDispatchResultSchema,
  SessionsReclaimParams: SessionsReclaimParamsSchema,
  SessionsReclaimResult: SessionsReclaimResultSchema
};

// packages/gateway-protocol/src/schema/sessions.ts
import { Type as Type44 } from "typebox";

// packages/gateway-protocol/src/schema/sessions-create.ts
import { Type as Type43 } from "typebox";
var SessionsCreateParamsSchema = closedObject({
  key: Type43.Optional(NonEmptyString),
  agentId: Type43.Optional(NonEmptyString),
  label: Type43.Optional(SessionLabelString),
  model: Type43.Optional(NonEmptyString),
  thinkingLevel: Type43.Optional(NonEmptyString),
  catalogId: Type43.Optional(NonEmptyString),
  parentSessionKey: Type43.Optional(NonEmptyString),
  fork: Type43.Optional(
    Type43.Boolean({ description: "Fork the parent transcript; requires parentSessionKey." })
  ),
  emitCommandHooks: Type43.Optional(Type43.Boolean()),
  succeedsParent: Type43.Optional(
    Type43.Boolean({
      description: "When sessions.create creates a distinct child, whether that child succeeds its parent and emits the parent's terminal session_end. Requires parentSessionKey and emitCommandHooks. False keeps the parent active; omission preserves legacy behavior."
    })
  ),
  task: Type43.Optional(Type43.String()),
  message: Type43.Optional(Type43.String()),
  attachments: Type43.Optional(ChatAttachmentsSchema),
  worktree: Type43.Optional(Type43.Boolean()),
  worktreeBaseRef: Type43.Optional(
    Type43.String({
      minLength: 1,
      description: "Base ref for the new managed worktree branch. Requires worktree=true."
    })
  ),
  worktreeName: Type43.Optional(
    Type43.String({
      pattern: "^[a-z0-9][a-z0-9-]{0,63}$",
      description: "Managed worktree name; becomes branch openclaw/<name>. Requires worktree=true."
    })
  ),
  execNode: Type43.Optional(
    Type43.String({
      minLength: 1,
      description: "Bind session exec to host=node with this node id/name. Requires operator.admin."
    })
  ),
  cwd: Type43.Optional(
    Type43.String({
      minLength: 1,
      description: "Absolute source directory for a managed worktree, or the working directory on execNode. Requires operator.admin."
    })
  )
});

// packages/gateway-protocol/src/schema/sessions.ts
var SessionCompactionCheckpointReasonSchema = Type44.Union([
  Type44.Literal("manual"),
  Type44.Literal("auto-threshold"),
  Type44.Literal("overflow-retry"),
  Type44.Literal("timeout-retry")
]);
var SessionOperationEventSchema = closedObject({
  operationId: NonEmptyString,
  operation: Type44.Literal("compact"),
  phase: Type44.Union([Type44.Literal("start"), Type44.Literal("end")]),
  sessionKey: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString),
  ts: Type44.Integer({ minimum: 0 }),
  completed: Type44.Optional(Type44.Boolean()),
  reason: Type44.Optional(Type44.String())
});
var SessionCompactionTranscriptReferenceSchema = closedObject({
  sessionId: NonEmptyString,
  sessionFile: Type44.Optional(NonEmptyString),
  leafId: Type44.Optional(NonEmptyString),
  entryId: Type44.Optional(NonEmptyString)
});
var SessionCompactionCheckpointSchema = closedObject({
  checkpointId: NonEmptyString,
  sessionKey: NonEmptyString,
  sessionId: NonEmptyString,
  createdAt: Type44.Integer({ minimum: 0 }),
  reason: SessionCompactionCheckpointReasonSchema,
  tokensBefore: Type44.Optional(Type44.Integer({ minimum: 0 })),
  tokensAfter: Type44.Optional(Type44.Integer({ minimum: 0 })),
  summary: Type44.Optional(Type44.String()),
  firstKeptEntryId: Type44.Optional(NonEmptyString),
  preCompaction: SessionCompactionTranscriptReferenceSchema,
  postCompaction: SessionCompactionTranscriptReferenceSchema
});
var SessionFileKindSchema = Type44.Union([Type44.Literal("modified"), Type44.Literal("read")]);
var SessionFileRelevanceSchema = Type44.Union([
  Type44.Literal("modified"),
  Type44.Literal("read"),
  Type44.Literal("mixed")
]);
var SessionFileHashSchema = Type44.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var SessionFileEntrySchema = closedObject({
  path: NonEmptyString,
  workspacePath: Type44.Optional(NonEmptyString),
  name: NonEmptyString,
  kind: SessionFileKindSchema,
  missing: Type44.Boolean(),
  size: Type44.Optional(Type44.Integer({ minimum: 0 })),
  updatedAtMs: Type44.Optional(Type44.Integer({ minimum: 0 })),
  content: Type44.Optional(Type44.String()),
  hash: Type44.Optional(SessionFileHashSchema)
});
var SessionFileBrowserEntrySchema = closedObject({
  path: Type44.String(),
  name: NonEmptyString,
  kind: Type44.Union([Type44.Literal("file"), Type44.Literal("directory")]),
  sessionKind: Type44.Optional(SessionFileRelevanceSchema),
  size: Type44.Optional(Type44.Integer({ minimum: 0 })),
  updatedAtMs: Type44.Optional(Type44.Integer({ minimum: 0 }))
});
var SessionFileBrowserResultSchema = closedObject({
  path: Type44.String(),
  parentPath: Type44.Optional(Type44.String()),
  search: Type44.Optional(Type44.String()),
  entries: Type44.Array(SessionFileBrowserEntrySchema),
  truncated: Type44.Optional(Type44.Boolean())
});
var SessionsFilesListParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString),
  path: Type44.Optional(Type44.String()),
  search: Type44.Optional(Type44.String())
});
var SessionsFilesListResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type44.Optional(NonEmptyString),
  files: Type44.Array(SessionFileEntrySchema),
  browser: Type44.Optional(SessionFileBrowserResultSchema)
});
var SessionsFilesGetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  path: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString)
});
var SessionsFilesGetResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type44.Optional(NonEmptyString),
  file: SessionFileEntrySchema
});
var SessionsFilesSetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  path: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString),
  content: Type44.String(),
  expectedHash: SessionFileHashSchema
});
var SessionsFilesSetResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type44.Optional(NonEmptyString),
  file: SessionFileEntrySchema
});
var SessionsFilesRevealParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString)
});
var SessionsFilesRevealResultSchema = closedObject({
  ok: Type44.Boolean(),
  path: Type44.Optional(NonEmptyString),
  error: Type44.Optional(NonEmptyString)
});
var SessionDiffFileStatusSchema = Type44.Union([
  Type44.Literal("added"),
  Type44.Literal("modified"),
  Type44.Literal("deleted"),
  Type44.Literal("renamed")
]);
var SessionDiffFileSchema = closedObject({
  path: NonEmptyString,
  oldPath: Type44.Optional(NonEmptyString),
  status: SessionDiffFileStatusSchema,
  additions: Type44.Integer({ minimum: 0 }),
  deletions: Type44.Integer({ minimum: 0 }),
  binary: Type44.Optional(Type44.Boolean()),
  untracked: Type44.Optional(Type44.Boolean()),
  /** Per-file unified patch text; absent for binary or oversized files. */
  patch: Type44.Optional(Type44.String()),
  truncated: Type44.Optional(Type44.Boolean())
});
var SessionsDiffParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString)
});
var SessionsDiffResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type44.Optional(NonEmptyString),
  branch: Type44.Optional(NonEmptyString),
  /** Display label of the diff base: the default branch name or "HEAD". */
  baseRef: Type44.Optional(NonEmptyString),
  files: Type44.Array(SessionDiffFileSchema),
  additions: Type44.Integer({ minimum: 0 }),
  deletions: Type44.Integer({ minimum: 0 }),
  truncated: Type44.Optional(Type44.Boolean()),
  unavailableReason: Type44.Optional(
    Type44.Union([Type44.Literal("unknown_session"), Type44.Literal("not_git")])
  )
});
var SessionsListParamsSchema = closedObject({
  /** Maximum rows to return; omitted Gateway RPC calls use a bounded default. */
  limit: Type44.Optional(Type44.Integer({ minimum: 1 })),
  offset: Type44.Optional(Type44.Integer({ minimum: 0 })),
  activeMinutes: Type44.Optional(Type44.Integer({ minimum: 1 })),
  /** Require a real user/channel interaction; excludes synthetic isolated heartbeat rows. */
  requireLastInteraction: Type44.Optional(Type44.Boolean()),
  sortBy: Type44.Optional(Type44.Union([Type44.Literal("updatedAt"), Type44.Literal("lastInteractionAt")])),
  includeGlobal: Type44.Optional(Type44.Boolean()),
  includeUnknown: Type44.Optional(Type44.Boolean()),
  /** Limit agent-scoped rows to agents currently present in config. */
  configuredAgentsOnly: Type44.Optional(Type44.Boolean()),
  /**
   * Read first 8KB of each session transcript to derive title from first user message.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeDerivedTitles: Type44.Optional(Type44.Boolean()),
  /**
   * Read last 16KB of each session transcript to extract most recent message preview.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeLastMessage: Type44.Optional(Type44.Boolean()),
  label: Type44.Optional(SessionLabelString),
  spawnedBy: Type44.Optional(NonEmptyString),
  agentId: Type44.Optional(NonEmptyString),
  search: Type44.Optional(Type44.String()),
  /** True lists archived sessions; false or omitted lists active sessions. */
  archived: Type44.Optional(Type44.Boolean())
});
var SessionsSearchParamsSchema = closedObject({
  agentId: Type44.Optional(NonEmptyString),
  sessionKeys: Type44.Optional(Type44.Array(NonEmptyString, { minItems: 1, maxItems: 200 })),
  query: Type44.String({ minLength: 1, maxLength: 4096 }),
  limit: Type44.Optional(Type44.Integer({ minimum: 1, maximum: 25 }))
});
var SessionsSearchHitSchema = closedObject({
  sessionKey: NonEmptyString,
  sessionId: NonEmptyString,
  messageId: NonEmptyString,
  role: Type44.Union([Type44.Literal("user"), Type44.Literal("assistant")]),
  timestamp: Type44.Integer({ minimum: 0 }),
  snippet: Type44.String(),
  score: Type44.Number()
});
var SessionsSearchResultSchema = closedObject({
  results: Type44.Array(SessionsSearchHitSchema),
  indexing: Type44.Optional(Type44.Boolean()),
  truncated: Type44.Optional(Type44.Boolean())
});
var SessionsCleanupParamsSchema = closedObject({
  agent: Type44.Optional(NonEmptyString),
  allAgents: Type44.Optional(Type44.Boolean()),
  enforce: Type44.Optional(Type44.Boolean()),
  activeKey: Type44.Optional(NonEmptyString),
  fixMissing: Type44.Optional(Type44.Boolean()),
  fixDmScope: Type44.Optional(Type44.Boolean())
});
var SessionsPreviewParamsSchema = closedObject({
  keys: Type44.Array(NonEmptyString, { minItems: 1 }),
  limit: Type44.Optional(Type44.Integer({ minimum: 1 })),
  maxChars: Type44.Optional(Type44.Integer({ minimum: 20 }))
});
var SessionsDescribeParamsSchema = closedObject({
  key: NonEmptyString,
  includeDerivedTitles: Type44.Optional(Type44.Boolean()),
  includeLastMessage: Type44.Optional(Type44.Boolean())
});
var SessionsResolveParamsSchema = closedObject({
  key: Type44.Optional(NonEmptyString),
  sessionId: Type44.Optional(NonEmptyString),
  label: Type44.Optional(SessionLabelString),
  agentId: Type44.Optional(NonEmptyString),
  spawnedBy: Type44.Optional(NonEmptyString),
  includeGlobal: Type44.Optional(Type44.Boolean()),
  includeUnknown: Type44.Optional(Type44.Boolean()),
  /** Return a successful `{ ok: false }` response when the selector does not match a session. */
  allowMissing: Type44.Optional(Type44.Boolean())
});
var SessionWorktreeInfoSchema = closedObject({
  id: NonEmptyString,
  path: NonEmptyString,
  branch: NonEmptyString
});
var SessionsCreateResultSchema = Type44.Object(
  {
    ok: Type44.Literal(true),
    key: NonEmptyString,
    sessionId: Type44.Optional(NonEmptyString),
    entry: Type44.Optional(Type44.Record(Type44.String(), Type44.Unknown())),
    runStarted: Type44.Optional(Type44.Boolean()),
    runError: Type44.Optional(ErrorShapeSchema),
    worktree: Type44.Optional(SessionWorktreeInfoSchema)
  },
  { additionalProperties: true }
);
var SessionsSendParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString),
  message: Type44.String(),
  thinking: Type44.Optional(Type44.String()),
  attachments: Type44.Optional(Type44.Array(Type44.Unknown())),
  timeoutMs: Type44.Optional(Type44.Integer({ minimum: 0 })),
  idempotencyKey: Type44.Optional(NonEmptyString)
});
var SessionsMessagesSubscribeParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString),
  /** Opt in to sanitized durable approval events for this session and its descendants. */
  includeApprovals: Type44.Optional(Type44.Literal(true))
});
var SessionsMessagesUnsubscribeParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString)
});
var SessionsAbortParamsSchema = closedObject({
  key: Type44.Optional(NonEmptyString),
  runId: Type44.Optional(NonEmptyString),
  agentId: Type44.Optional(NonEmptyString)
});
var SessionsPatchParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString),
  label: Type44.Optional(Type44.Union([SessionLabelString, Type44.Null()])),
  /** User-defined organization bucket ("category", not chat-group); null clears it. */
  category: Type44.Optional(Type44.Union([SessionLabelString, Type44.Null()])),
  icon: Type44.Optional(
    Type44.Union([NonEmptyString, Type44.Null()], {
      description: "Sidebar icon: one emoji, name:<id>, or svg:<svg ...>...</svg>."
    })
  ),
  statusNote: Type44.Optional(
    Type44.Union([Type44.String({ maxLength: 120 }), Type44.Null()], {
      description: "Short expiring sidebar status note; null clears it and any declared attention."
    })
  ),
  attention: Type44.Optional(
    Type44.Union([Type44.String({ enum: [...SESSION_AGENT_ATTENTION_ICON_IDS] }), Type44.Null()])
  ),
  ttlMinutes: Type44.Optional(Type44.Integer({ minimum: 1, maximum: 120 })),
  archived: Type44.Optional(Type44.Boolean()),
  pinned: Type44.Optional(Type44.Boolean()),
  unread: Type44.Optional(
    Type44.Boolean({ description: "Set true to mark unread; false records the session as read." })
  ),
  thinkingLevel: Type44.Optional(Type44.Union([NonEmptyString, Type44.Null()])),
  fastMode: Type44.Optional(Type44.Union([Type44.Boolean(), Type44.Literal("auto"), Type44.Null()])),
  verboseLevel: Type44.Optional(Type44.Union([NonEmptyString, Type44.Null()])),
  traceLevel: Type44.Optional(Type44.Union([NonEmptyString, Type44.Null()])),
  reasoningLevel: Type44.Optional(Type44.Union([NonEmptyString, Type44.Null()])),
  responseUsage: Type44.Optional(
    Type44.Union([
      Type44.Literal("off"),
      Type44.Literal("tokens"),
      Type44.Literal("full"),
      // Backward compat with older clients/stores.
      Type44.Literal("on"),
      Type44.Null()
    ])
  ),
  elevatedLevel: Type44.Optional(Type44.Union([NonEmptyString, Type44.Null()])),
  execHost: Type44.Optional(Type44.Union([NonEmptyString, Type44.Null()])),
  execSecurity: Type44.Optional(Type44.Union([NonEmptyString, Type44.Null()])),
  execAsk: Type44.Optional(Type44.Union([NonEmptyString, Type44.Null()])),
  execNode: Type44.Optional(Type44.Union([NonEmptyString, Type44.Null()])),
  model: Type44.Optional(Type44.Union([NonEmptyString, Type44.Null()])),
  spawnedBy: Type44.Optional(Type44.Union([NonEmptyString, Type44.Null()])),
  spawnedWorkspaceDir: Type44.Optional(Type44.Union([NonEmptyString, Type44.Null()])),
  spawnedCwd: Type44.Optional(Type44.Union([NonEmptyString, Type44.Null()])),
  spawnDepth: Type44.Optional(Type44.Union([Type44.Integer({ minimum: 0 }), Type44.Null()])),
  subagentRole: Type44.Optional(
    Type44.Union([Type44.Literal("orchestrator"), Type44.Literal("leaf"), Type44.Null()])
  ),
  subagentControlScope: Type44.Optional(
    Type44.Union([Type44.Literal("children"), Type44.Literal("none"), Type44.Null()])
  ),
  inheritedToolAllow: Type44.Optional(Type44.Union([Type44.Array(NonEmptyString), Type44.Null()])),
  inheritedToolDeny: Type44.Optional(Type44.Union([Type44.Array(NonEmptyString), Type44.Null()])),
  sendPolicy: Type44.Optional(Type44.Union([Type44.Literal("allow"), Type44.Literal("deny"), Type44.Null()])),
  groupActivation: Type44.Optional(
    Type44.Union([Type44.Literal("mention"), Type44.Literal("always"), Type44.Null()])
  )
});
var SessionsPluginPatchParamsSchema = closedObject({
  key: NonEmptyString,
  pluginId: NonEmptyString,
  namespace: NonEmptyString,
  value: Type44.Optional(PluginJsonValueSchema),
  unset: Type44.Optional(Type44.Boolean())
});
var SessionsPluginPatchResultSchema = closedObject({
  ok: Type44.Literal(true),
  key: NonEmptyString,
  value: Type44.Optional(PluginJsonValueSchema)
});
var SessionsResetParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString),
  reason: Type44.Optional(Type44.Union([Type44.Literal("new"), Type44.Literal("reset")]))
});
var SessionsDeleteParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString),
  deleteTranscript: Type44.Optional(Type44.Boolean()),
  // Internal compare-and-delete guard for lifecycle-owned cleanup.
  expectedSessionId: Type44.Optional(NonEmptyString),
  expectedLifecycleRevision: Type44.Optional(NonEmptyString),
  expectedSessionUpdatedAt: Type44.Optional(Type44.Number({ minimum: 0 })),
  // Internal control: when false, still unbind thread bindings but skip hook emission.
  emitLifecycleHooks: Type44.Optional(Type44.Boolean()),
  /**
   * Restricts the delete to already-archived sessions (archive-then-delete).
   * operator.write callers must set this; deletes without it require
   * operator.admin.
   */
  archivedOnly: Type44.Optional(Type44.Boolean())
});
var SessionsGroupsListParamsSchema = closedObject({});
var SessionGroupSchema = closedObject({
  name: SessionLabelString,
  position: Type44.Integer({ minimum: 0 })
});
var SessionsGroupsListResultSchema = closedObject({
  groups: Type44.Array(SessionGroupSchema)
});
var SessionsGroupsPutParamsSchema = closedObject({
  names: Type44.Array(SessionLabelString, { maxItems: 200 })
});
var SessionsGroupsRenameParamsSchema = closedObject({
  name: SessionLabelString,
  to: SessionLabelString
});
var SessionsGroupsDeleteParamsSchema = closedObject({ name: SessionLabelString });
var SessionsGroupsMutationResultSchema = closedObject({
  ok: Type44.Literal(true),
  groups: Type44.Array(SessionGroupSchema),
  updatedSessions: Type44.Optional(Type44.Integer({ minimum: 0 }))
});
var SessionsCompactParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString),
  maxLines: Type44.Optional(Type44.Integer({ minimum: 1 }))
});
var SessionsCompactionListParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString)
});
var SessionsCompactionGetParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString),
  checkpointId: NonEmptyString
});
var SessionsCompactionBranchParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString),
  checkpointId: NonEmptyString
});
var SessionsCompactionRestoreParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString),
  checkpointId: NonEmptyString
});
var SessionsRewindParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString),
  entryId: NonEmptyString
});
var SessionsForkParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString),
  entryId: NonEmptyString
});
var SessionsRewindResultSchema = closedObject({
  editorText: Type44.Optional(Type44.String())
});
var SessionsForkResultSchema = closedObject({
  sessionKey: NonEmptyString,
  editorText: Type44.Optional(Type44.String())
});
var SessionBranchSchema = closedObject({
  leafEntryId: NonEmptyString,
  headline: Type44.String(),
  messageCount: Type44.Integer({ minimum: 0 }),
  updatedAt: Type44.Optional(NonEmptyString),
  active: Type44.Boolean()
});
var SessionsBranchesListParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString)
});
var SessionsBranchesListResultSchema = closedObject({
  branches: Type44.Array(SessionBranchSchema)
});
var SessionsBranchesSwitchParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type44.Optional(NonEmptyString),
  leafEntryId: NonEmptyString
});
var SessionsBranchesSwitchResultSchema = closedObject({});
var SessionsCompactionListResultSchema = closedObject({
  ok: Type44.Literal(true),
  key: NonEmptyString,
  checkpoints: Type44.Array(SessionCompactionCheckpointSchema)
});
var SessionsCompactionGetResultSchema = closedObject({
  ok: Type44.Literal(true),
  key: NonEmptyString,
  checkpoint: SessionCompactionCheckpointSchema
});
var SessionsCompactionBranchResultSchema = closedObject({
  ok: Type44.Literal(true),
  sourceKey: NonEmptyString,
  key: NonEmptyString,
  sessionId: NonEmptyString,
  checkpoint: SessionCompactionCheckpointSchema,
  entry: Type44.Object(
    {
      sessionId: NonEmptyString,
      updatedAt: Type44.Integer({ minimum: 0 })
    },
    { additionalProperties: true }
  )
});
var SessionsCompactionRestoreResultSchema = closedObject({
  ok: Type44.Literal(true),
  key: NonEmptyString,
  sessionId: NonEmptyString,
  checkpoint: SessionCompactionCheckpointSchema,
  entry: Type44.Object(
    {
      sessionId: NonEmptyString,
      updatedAt: Type44.Integer({ minimum: 0 })
    },
    { additionalProperties: true }
  )
});
var SessionsUsageParamsSchema = closedObject({
  /** Specific session key to analyze; if omitted returns sessions for the effective agent. */
  key: Type44.Optional(NonEmptyString),
  /** Agent scope for list-style usage queries. */
  agentId: Type44.Optional(NonEmptyString),
  /** Explicit all-agent scope for list-style usage queries. */
  agentScope: Type44.Optional(Type44.Literal("all")),
  /** Start date for range filter (YYYY-MM-DD). */
  startDate: Type44.Optional(Type44.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
  /** End date for range filter (YYYY-MM-DD). */
  endDate: Type44.Optional(Type44.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
  /** How start/end dates should be interpreted. Defaults to UTC when omitted. */
  mode: Type44.Optional(
    Type44.Union([Type44.Literal("utc"), Type44.Literal("gateway"), Type44.Literal("specific")])
  ),
  /** Preset range for usage queries when explicit start/end dates are omitted. */
  range: Type44.Optional(
    Type44.Union([
      Type44.Literal("7d"),
      Type44.Literal("30d"),
      Type44.Literal("90d"),
      Type44.Literal("1y"),
      Type44.Literal("all")
    ])
  ),
  /** Usage row grouping. `family` rolls up known rotated session ids for a logical key. */
  groupBy: Type44.Optional(Type44.Union([Type44.Literal("instance"), Type44.Literal("family")])),
  /** Backward-compatible alias for requesting family grouping. */
  includeHistorical: Type44.Optional(
    Type44.Boolean({
      deprecated: true,
      description: "Deprecated alias for groupBy: family."
    })
  ),
  /** UTC offset to use when mode is `specific` (for example, UTC-4 or UTC+5:30). */
  utcOffset: Type44.Optional(
    Type44.String({
      pattern: "^UTC[+-]\\d{1,2}(?::[0-5]\\d)?$",
      deprecated: true,
      description: "Deprecated compatibility fallback; use timeZone."
    })
  ),
  /** IANA time zone for `specific`; preferred over `utcOffset`, which remains a compatibility fallback. */
  timeZone: Type44.Optional(NonEmptyString),
  /** Maximum sessions to return (default 50). */
  limit: Type44.Optional(Type44.Integer({ minimum: 1 })),
  /** Include context weight breakdown (systemPromptReport). */
  includeContextWeight: Type44.Optional(Type44.Boolean())
});

// packages/gateway-protocol/src/schema/skill-protocol-schemas.ts
var SkillWorkshopProtocolSchemas = {
  SkillsProposalsListParams: SkillsProposalsListParamsSchema,
  SkillsProposalsListResult: SkillsProposalsListResultSchema,
  SkillsProposalHistoryStatusParams: SkillsProposalHistoryStatusParamsSchema,
  SkillsProposalHistoryScanParams: SkillsProposalHistoryScanParamsSchema,
  SkillsProposalHistoryScanResult: SkillsProposalHistoryScanResultSchema
};

// packages/gateway-protocol/src/schema/system-info.ts
import { Type as Type45 } from "typebox";
var SystemInfoParamsSchema = closedObject({});
var SystemInfoResultSchema = closedObject({
  machineName: Type45.String(),
  hostname: Type45.String(),
  platform: Type45.String(),
  release: Type45.String(),
  arch: Type45.String(),
  osLabel: Type45.String(),
  lanAddress: Type45.Optional(Type45.String()),
  port: Type45.Optional(Type45.Integer()),
  nodeVersion: Type45.String(),
  pid: Type45.Integer(),
  /** Process-start identity for invalidating work that cannot survive a Gateway restart. */
  processInstanceId: Type45.Optional(Type45.String({ minLength: 1 })),
  uptimeMs: Type45.Integer(),
  cpuCount: Type45.Integer(),
  cpuModel: Type45.Optional(Type45.String()),
  loadAverage: Type45.Optional(Type45.Tuple([Type45.Number(), Type45.Number(), Type45.Number()])),
  memoryTotalBytes: Type45.Integer(),
  memoryFreeBytes: Type45.Integer(),
  diskTotalBytes: Type45.Optional(Type45.Integer()),
  diskAvailableBytes: Type45.Optional(Type45.Integer()),
  diskPath: Type45.Optional(Type45.String())
});

// packages/gateway-protocol/src/schema/task-suggestions.ts
import { Type as Type46 } from "typebox";
var TaskIdSchema = Type46.String({ minLength: 1, maxLength: 128 });
var TaskTitleSchema = Type46.String({ minLength: 1, maxLength: 60 });
var TaskPromptSchema = Type46.String({ minLength: 1, maxLength: 32768 });
var TaskTldrSchema = Type46.String({ minLength: 1, maxLength: 1024 });
var TaskCwdSchema = Type46.String({ minLength: 1, maxLength: 4096 });
var TaskSessionKeySchema = Type46.String({ minLength: 1, maxLength: 512 });
var TaskAgentIdSchema = Type46.String({ minLength: 1, maxLength: 128 });
var TaskSuggestionSchema = closedObject({
  id: TaskIdSchema,
  title: TaskTitleSchema,
  prompt: TaskPromptSchema,
  tldr: TaskTldrSchema,
  cwd: TaskCwdSchema,
  sessionKey: TaskSessionKeySchema,
  agentId: Type46.Optional(TaskAgentIdSchema),
  createdAt: Type46.Integer({ minimum: 0 })
});
var TaskSuggestionsListParamsSchema = closedObject({
  sessionKey: Type46.Optional(TaskSessionKeySchema),
  agentId: Type46.Optional(TaskAgentIdSchema)
});
var TaskSuggestionsListResultSchema = closedObject({
  suggestions: Type46.Array(TaskSuggestionSchema)
});
var TaskSuggestionsCreateParamsSchema = closedObject({
  title: TaskTitleSchema,
  prompt: TaskPromptSchema,
  tldr: TaskTldrSchema,
  cwd: TaskCwdSchema,
  sessionKey: TaskSessionKeySchema,
  agentId: Type46.Optional(TaskAgentIdSchema)
});
var TaskSuggestionsCreateResultSchema = closedObject({
  taskId: TaskIdSchema,
  suggestion: TaskSuggestionSchema
});
var TaskSuggestionResolutionSchema = Type46.Union([
  Type46.Literal("dismissed"),
  Type46.Literal("accepted"),
  Type46.Literal("expired")
]);
var TaskSuggestionsAcceptParamsSchema = closedObject({ taskId: TaskIdSchema });
var TaskSuggestionsAcceptResultSchema = closedObject({
  taskId: TaskIdSchema,
  key: TaskSessionKeySchema
});
var TaskSuggestionsDismissParamsSchema = closedObject({
  taskId: TaskIdSchema,
  reason: Type46.Optional(Type46.String({ maxLength: 1024 }))
});
var TaskSuggestionsDismissResultSchema = closedObject({
  taskId: TaskIdSchema,
  dismissed: Type46.Boolean()
});
var TaskSuggestionEventSchema = Type46.Union([
  closedObject({ action: Type46.Literal("created"), suggestion: TaskSuggestionSchema }),
  closedObject({
    action: Type46.Literal("resolved"),
    taskId: TaskIdSchema,
    resolution: TaskSuggestionResolutionSchema
  })
]);

// packages/gateway-protocol/src/schema/tasks.ts
import { Type as Type47 } from "typebox";
var TaskLedgerStatusSchema = Type47.Union([
  Type47.Literal("queued"),
  Type47.Literal("running"),
  Type47.Literal("completed"),
  Type47.Literal("failed"),
  Type47.Literal("cancelled"),
  Type47.Literal("timed_out")
]);
var TimestampSchema = Type47.Union([Type47.String(), Type47.Integer({ minimum: 0 })]);
var TaskSummarySchema = closedObject({
  id: NonEmptyString,
  kind: Type47.Optional(Type47.String()),
  runtime: Type47.Optional(Type47.String()),
  status: TaskLedgerStatusSchema,
  title: Type47.Optional(Type47.String()),
  agentId: Type47.Optional(Type47.String()),
  sessionKey: Type47.Optional(Type47.String()),
  childSessionKey: Type47.Optional(Type47.String()),
  ownerKey: Type47.Optional(Type47.String()),
  runId: Type47.Optional(Type47.String()),
  taskId: Type47.Optional(Type47.String()),
  flowId: Type47.Optional(Type47.String()),
  parentTaskId: Type47.Optional(Type47.String()),
  sourceId: Type47.Optional(Type47.String()),
  createdAt: Type47.Optional(TimestampSchema),
  updatedAt: Type47.Optional(TimestampSchema),
  startedAt: Type47.Optional(TimestampSchema),
  endedAt: Type47.Optional(TimestampSchema),
  toolUseCount: Type47.Optional(Type47.Integer({ minimum: 0 })),
  lastToolName: Type47.Optional(Type47.String()),
  progressSummary: Type47.Optional(Type47.String()),
  terminalSummary: Type47.Optional(Type47.String()),
  error: Type47.Optional(Type47.String()),
  /** Bounded task input. Returned by tasks.get; omitted from list/event summaries. */
  prompt: Type47.Optional(Type47.String())
});
var TasksListParamsSchema = closedObject({
  status: Type47.Optional(Type47.Union([TaskLedgerStatusSchema, Type47.Array(TaskLedgerStatusSchema)])),
  agentId: Type47.Optional(NonEmptyString),
  sessionKey: Type47.Optional(NonEmptyString),
  limit: Type47.Optional(Type47.Integer({ minimum: 1, maximum: 500 })),
  cursor: Type47.Optional(Type47.String())
});
var TasksListResultSchema = closedObject({
  tasks: Type47.Array(TaskSummarySchema),
  nextCursor: Type47.Optional(Type47.String())
});
var TasksGetParamsSchema = closedObject({
  taskId: NonEmptyString
});
var TasksGetResultSchema = closedObject({
  task: TaskSummarySchema
});
var TasksCancelParamsSchema = closedObject({
  taskId: NonEmptyString,
  reason: Type47.Optional(Type47.String())
});
var TasksCancelResultSchema = closedObject({
  found: Type47.Boolean(),
  cancelled: Type47.Boolean(),
  reason: Type47.Optional(Type47.String()),
  task: Type47.Optional(TaskSummarySchema)
});

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

// packages/gateway-protocol/src/schema/worktrees.ts
import { Type as Type48 } from "typebox";
var WorktreeNameSchema = Type48.String({ pattern: "^[a-z0-9][a-z0-9-]{0,63}$" });
var WorktreeRecordSchema = closedObject({
  id: NonEmptyString,
  name: WorktreeNameSchema,
  repoFingerprint: Type48.String({ pattern: "^[a-f0-9]{16}$" }),
  repoRoot: NonEmptyString,
  path: NonEmptyString,
  branch: NonEmptyString,
  baseRef: NonEmptyString,
  ownerKind: Type48.String({ enum: ["manual", "workboard", "session"] }),
  ownerId: Type48.Optional(NonEmptyString),
  snapshotRef: Type48.Optional(NonEmptyString),
  createdAt: Type48.Integer({ minimum: 0 }),
  lastActiveAt: Type48.Integer({ minimum: 0 }),
  removedAt: Type48.Optional(Type48.Integer({ minimum: 0 }))
});
var WorktreesListParamsSchema = closedObject({});
var WorktreesListResultSchema = closedObject({
  worktrees: Type48.Array(WorktreeRecordSchema)
});
var WorktreesCreateParamsSchema = closedObject({
  repoRoot: NonEmptyString,
  name: Type48.Optional(WorktreeNameSchema),
  baseRef: Type48.Optional(NonEmptyString)
});
var WorktreesRemoveParamsSchema = closedObject({
  id: NonEmptyString,
  force: Type48.Optional(Type48.Boolean())
});
var WorktreesRemoveResultSchema = closedObject({
  removed: Type48.Boolean(),
  snapshotRef: Type48.Optional(NonEmptyString),
  /** Why the pre-removal snapshot failed; present only on forced removals that continued without one. */
  snapshotError: Type48.Optional(NonEmptyString)
});
var WorktreesBranchesParamsSchema = closedObject({ repoRoot: NonEmptyString });
var WorktreeBranchSchema = closedObject({
  name: NonEmptyString,
  kind: Type48.Union([Type48.Literal("local"), Type48.Literal("remote")])
});
var WorktreesBranchesResultSchema = closedObject({
  branches: Type48.Array(WorktreeBranchSchema),
  defaultBranch: Type48.Optional(NonEmptyString),
  headBranch: Type48.Optional(NonEmptyString)
});
var WorktreesRestoreParamsSchema = closedObject({ id: NonEmptyString });
var WorktreesGcParamsSchema = closedObject({});
var WorktreesGcResultSchema = closedObject({
  removed: Type48.Array(NonEmptyString),
  orphansDeleted: Type48.Integer({ minimum: 0 }),
  snapshotsPruned: Type48.Integer({ minimum: 0 })
});

// packages/gateway-protocol/src/version.ts
var PROTOCOL_VERSION = 4;
var MIN_CLIENT_PROTOCOL_VERSION = 4;
var MIN_NODE_PROTOCOL_VERSION = 3;
var MIN_PROBE_PROTOCOL_VERSION = 3;

// packages/gateway-protocol/src/schema/protocol-schemas.ts
var ProtocolSchemas = {
  BoardTab: BoardTabSchema,
  BoardWidget: BoardWidgetSchema,
  BoardWidgetDeclared: BoardWidgetDeclaredSchema,
  BoardSnapshot: BoardSnapshotSchema,
  BoardTabCreateOp: BoardTabCreateOpSchema,
  BoardTabUpdateOp: BoardTabUpdateOpSchema,
  BoardTabDeleteOp: BoardTabDeleteOpSchema,
  BoardTabsReorderOp: BoardTabsReorderOpSchema,
  BoardWidgetMoveOp: BoardWidgetMoveOpSchema,
  BoardWidgetResizeOp: BoardWidgetResizeOpSchema,
  BoardWidgetRemoveOp: BoardWidgetRemoveOpSchema,
  BoardOp: BoardOpSchema,
  BoardMcpAppDescriptor: BoardMcpAppDescriptorSchema,
  BoardWidgetHtmlContent: BoardWidgetHtmlContentSchema,
  BoardWidgetMcpAppContent: BoardWidgetMcpAppContentSchema,
  BoardWidgetMcpAppPutContent: BoardWidgetMcpAppPutContentSchema,
  BoardCanvasDocumentSource: BoardCanvasDocumentSourceSchema,
  BoardWidgetContent: BoardWidgetContentSchema,
  BoardWidgetPutContent: BoardWidgetPutContentSchema,
  BoardGetParams: BoardGetParamsSchema,
  BoardUpdateParams: BoardUpdateParamsSchema,
  BoardWidgetPutParams: BoardWidgetPutParamsSchema,
  BoardWidgetGrantParams: BoardWidgetGrantParamsSchema,
  BoardWidgetAppViewParams: BoardWidgetAppViewParamsSchema,
  BoardWidgetAppViewResult: BoardWidgetAppViewResultSchema,
  BoardEventParams: BoardEventParamsSchema,
  BoardPromptAuthorizeParams: BoardPromptAuthorizeParamsSchema,
  BoardDataReadParams: BoardDataReadParamsSchema,
  BoardActionParams: BoardActionParamsSchema,
  BoardChangedEvent: BoardChangedEventSchema,
  BoardFocusTabCommand: BoardFocusTabCommandSchema,
  BoardSetChatDockCommand: BoardSetChatDockCommandSchema,
  BoardCommand: BoardCommandSchema,
  BoardCommandEvent: BoardCommandEventSchema,
  AuthProbeStatus: AuthProbeStatusSchema,
  // Handshake, transport frames, state snapshots, and shared error envelopes.
  ConnectParams: ConnectParamsSchema,
  WorkerAdmissionHandshake: WorkerAdmissionHandshakeSchema,
  HelloOk: HelloOkSchema,
  RequestFrame: RequestFrameSchema,
  ResponseFrame: ResponseFrameSchema,
  EventFrame: EventFrameSchema,
  GatewayFrame: GatewayFrameSchema,
  PresenceEntry: PresenceEntrySchema,
  StateVersion: StateVersionSchema,
  Snapshot: SnapshotSchema,
  ErrorShape: ErrorShapeSchema,
  MissingScopeErrorDetails: MissingScopeErrorDetailsSchema,
  McpAppViewExpiredErrorDetails: McpAppViewExpiredErrorDetailsSchema,
  GatewayErrorDetails: GatewayErrorDetailsSchema,
  GatewaySuspendTaskBlocker: GatewaySuspendTaskBlockerSchema,
  GatewaySuspendBlocker: GatewaySuspendBlockerSchema,
  GatewaySuspendPrepareParams: GatewaySuspendPrepareParamsSchema,
  GatewaySuspendPrepareBusyResult: GatewaySuspendPrepareBusyResultSchema,
  GatewaySuspendPrepareReadyResult: GatewaySuspendPrepareReadyResultSchema,
  GatewaySuspendPrepareResult: GatewaySuspendPrepareResultSchema,
  GatewaySuspendStatusParams: GatewaySuspendStatusParamsSchema,
  GatewaySuspendStatusRunningResult: GatewaySuspendStatusRunningResultSchema,
  GatewaySuspendStatusReadyResult: GatewaySuspendStatusReadyResultSchema,
  GatewaySuspendStatusResult: GatewaySuspendStatusResultSchema,
  GatewaySuspendResumeParams: GatewaySuspendResumeParamsSchema,
  GatewaySuspendResumeResult: GatewaySuspendResumeResultSchema,
  // Environment and agent-facing control RPC payloads.
  EnvironmentStatus: EnvironmentStatusSchema,
  WorkerEnvironmentState: WorkerEnvironmentStateSchema,
  WorkerTunnelStatus: WorkerTunnelStatusSchema,
  WorkerEnvironmentMetadata: WorkerEnvironmentMetadataSchema,
  EnvironmentSummary: EnvironmentSummarySchema,
  EnvironmentsCreateParams: EnvironmentsCreateParamsSchema,
  EnvironmentsCreateResult: EnvironmentsCreateResultSchema,
  EnvironmentsDestroyParams: EnvironmentsDestroyParamsSchema,
  EnvironmentsDestroyResult: EnvironmentsDestroyResultSchema,
  EnvironmentsListParams: EnvironmentsListParamsSchema,
  EnvironmentsListResult: EnvironmentsListResultSchema,
  EnvironmentsStatusParams: EnvironmentsStatusParamsSchema,
  EnvironmentsStatusResult: EnvironmentsStatusResultSchema,
  SystemInfoParams: SystemInfoParamsSchema,
  SystemInfoResult: SystemInfoResultSchema,
  AgentEvent: AgentEventSchema,
  ConversationSendParams: ConversationSendParamsSchema,
  ConversationSendResult: ConversationSendResultSchema,
  ConversationListItem: ConversationListItemSchema,
  ConversationListParams: ConversationListParamsSchema,
  ConversationListResult: ConversationListResultSchema,
  ConversationTurnCancelParams: ConversationTurnCancelParamsSchema,
  ConversationTurnCancelResult: ConversationTurnCancelResultSchema,
  ConversationTurnParams: ConversationTurnParamsSchema,
  ConversationTurnReply: ConversationTurnReplySchema,
  ConversationTurnResult: ConversationTurnResultSchema,
  MessageActionParams: MessageActionParamsSchema,
  SendParams: SendParamsSchema,
  PollParams: PollParamsSchema,
  AgentParams: AgentParamsSchema,
  AgentIdentityParams: AgentIdentityParamsSchema,
  AgentIdentityResult: AgentIdentityResultSchema,
  AgentWaitParams: AgentWaitParamsSchema,
  WakeParams: WakeParamsSchema,
  WorktreeRecord: WorktreeRecordSchema,
  WorktreesListParams: WorktreesListParamsSchema,
  WorktreesListResult: WorktreesListResultSchema,
  WorktreesCreateParams: WorktreesCreateParamsSchema,
  WorktreesRemoveParams: WorktreesRemoveParamsSchema,
  WorktreesRemoveResult: WorktreesRemoveResultSchema,
  WorktreesRestoreParams: WorktreesRestoreParamsSchema,
  WorktreesGcParams: WorktreesGcParamsSchema,
  WorktreesGcResult: WorktreesGcResultSchema,
  WorktreeBranch: WorktreeBranchSchema,
  WorktreesBranchesParams: WorktreesBranchesParamsSchema,
  WorktreesBranchesResult: WorktreesBranchesResultSchema,
  FsDirEntry: FsDirEntrySchema,
  FsListDirParams: FsListDirParamsSchema,
  FsListDirResult: FsListDirResultSchema,
  // Node pairing, invocation, presence, and pending-queue payloads.
  NodePairListParams: NodePairListParamsSchema,
  NodePairApproveParams: NodePairApproveParamsSchema,
  NodePairRejectParams: NodePairRejectParamsSchema,
  NodePairRemoveParams: NodePairRemoveParamsSchema,
  NodeRenameParams: NodeRenameParamsSchema,
  NodeListParams: NodeListParamsSchema,
  NodePluginToolDescriptor: NodePluginToolDescriptorSchema,
  NodePluginToolsUpdateParams: NodePluginToolsUpdateParamsSchema,
  NodeSkillDescriptor: NodeSkillDescriptorSchema,
  NodeSkillsUpdateParams: NodeSkillsUpdateParamsSchema,
  NodePendingAckParams: NodePendingAckParamsSchema,
  NodeDescribeParams: NodeDescribeParamsSchema,
  ...NodeInvokeProtocolSchemas,
  NodeEventParams: NodeEventParamsSchema,
  NodeEventResult: NodeEventResultSchema,
  NodePresenceAlivePayload: NodePresenceAlivePayloadSchema,
  ...NodePresenceProtocolSchemas,
  NodePendingDrainParams: NodePendingDrainParamsSchema,
  NodePendingDrainResult: NodePendingDrainResultSchema,
  NodePendingEnqueueParams: NodePendingEnqueueParamsSchema,
  NodePendingEnqueueResult: NodePendingEnqueueResultSchema,
  // Push and secret-resolution payloads used by mobile/control integrations.
  PushTestParams: PushTestParamsSchema,
  PushTestResult: PushTestResultSchema,
  UiSplitCommand: UiSplitCommandSchema,
  UiClosePaneCommand: UiClosePaneCommandSchema,
  UiFocusCommand: UiFocusCommandSchema,
  UiSidebarCommand: UiSidebarCommandSchema,
  UiPanelCommand: UiPanelCommandSchema,
  UiNavigateCommand: UiNavigateCommandSchema,
  UiCommand: UiCommandSchema,
  UiCommandParams: UiCommandParamsSchema,
  UiCommandResult: UiCommandResultSchema,
  SecretsReloadParams: SecretsReloadParamsSchema,
  SecretsResolveParams: SecretsResolveParamsSchema,
  SecretsResolveAssignment: SecretsResolveAssignmentSchema,
  SecretsResolveResult: SecretsResolveResultSchema,
  // Session lifecycle, message routing, compaction, and usage accounting.
  SessionsListParams: SessionsListParamsSchema,
  SessionCatalogCapabilities: SessionCatalogCapabilitiesSchema,
  SessionCatalogDescriptor: SessionCatalogDescriptorSchema,
  SessionCatalogSession: SessionCatalogSessionSchema,
  SessionCatalogHost: SessionCatalogHostSchema,
  SessionCatalog: SessionCatalogSchema,
  SessionCatalogTranscriptItem: SessionCatalogTranscriptItemSchema,
  SessionsCatalogListParams: SessionsCatalogListParamsSchema,
  SessionsCatalogListResult: SessionsCatalogListResultSchema,
  SessionsCatalogReadParams: SessionsCatalogReadParamsSchema,
  SessionsCatalogReadResult: SessionsCatalogReadResultSchema,
  SessionsCatalogContinueParams: SessionsCatalogContinueParamsSchema,
  SessionsCatalogContinueResult: SessionsCatalogContinueResultSchema,
  SessionsCatalogArchiveParams: SessionsCatalogArchiveParamsSchema,
  SessionsCatalogArchiveResult: SessionsCatalogArchiveResultSchema,
  SessionsCleanupParams: SessionsCleanupParamsSchema,
  SessionsPreviewParams: SessionsPreviewParamsSchema,
  SessionsDescribeParams: SessionsDescribeParamsSchema,
  SessionsResolveParams: SessionsResolveParamsSchema,
  SessionsSearchHit: SessionsSearchHitSchema,
  SessionsSearchParams: SessionsSearchParamsSchema,
  SessionsSearchResult: SessionsSearchResultSchema,
  SessionCompactionCheckpoint: SessionCompactionCheckpointSchema,
  SessionOperationEvent: SessionOperationEventSchema,
  ...SessionPlacementProtocolSchemas,
  SessionDiscussionState: SessionDiscussionStateSchema,
  SessionDiscussionInfo: SessionDiscussionInfoSchema,
  SessionDiscussionInfoParams: SessionDiscussionInfoParamsSchema,
  SessionDiscussionInfoResult: SessionDiscussionInfoResultSchema,
  SessionDiscussionOpenParams: SessionDiscussionOpenParamsSchema,
  SessionDiscussionOpenResult: SessionDiscussionOpenResultSchema,
  SessionsCompactionListParams: SessionsCompactionListParamsSchema,
  SessionsCompactionGetParams: SessionsCompactionGetParamsSchema,
  SessionsCompactionBranchParams: SessionsCompactionBranchParamsSchema,
  SessionsCompactionRestoreParams: SessionsCompactionRestoreParamsSchema,
  SessionsCompactionListResult: SessionsCompactionListResultSchema,
  SessionsCompactionGetResult: SessionsCompactionGetResultSchema,
  SessionsCompactionBranchResult: SessionsCompactionBranchResultSchema,
  SessionsCompactionRestoreResult: SessionsCompactionRestoreResultSchema,
  SessionsRewindParams: SessionsRewindParamsSchema,
  SessionsRewindResult: SessionsRewindResultSchema,
  SessionsForkParams: SessionsForkParamsSchema,
  SessionsForkResult: SessionsForkResultSchema,
  SessionFileBrowserEntry: SessionFileBrowserEntrySchema,
  SessionFileBrowserResult: SessionFileBrowserResultSchema,
  SessionFileKind: SessionFileKindSchema,
  SessionFileEntry: SessionFileEntrySchema,
  SessionFileRelevance: SessionFileRelevanceSchema,
  SessionsFilesListParams: SessionsFilesListParamsSchema,
  SessionsFilesListResult: SessionsFilesListResultSchema,
  SessionsFilesGetParams: SessionsFilesGetParamsSchema,
  SessionsFilesGetResult: SessionsFilesGetResultSchema,
  SessionsFilesRevealParams: SessionsFilesRevealParamsSchema,
  SessionsFilesRevealResult: SessionsFilesRevealResultSchema,
  SessionsFilesSetParams: SessionsFilesSetParamsSchema,
  SessionsFilesSetResult: SessionsFilesSetResultSchema,
  SessionDiffFileStatus: SessionDiffFileStatusSchema,
  SessionDiffFile: SessionDiffFileSchema,
  SessionsDiffParams: SessionsDiffParamsSchema,
  SessionsDiffResult: SessionsDiffResultSchema,
  SessionWorktreeInfo: SessionWorktreeInfoSchema,
  SessionsCreateParams: SessionsCreateParamsSchema,
  SessionsCreateResult: SessionsCreateResultSchema,
  SessionsSendParams: SessionsSendParamsSchema,
  SessionsMessagesSubscribeParams: SessionsMessagesSubscribeParamsSchema,
  SessionsMessagesUnsubscribeParams: SessionsMessagesUnsubscribeParamsSchema,
  SessionsAbortParams: SessionsAbortParamsSchema,
  SessionsPatchParams: SessionsPatchParamsSchema,
  SessionsPluginPatchParams: SessionsPluginPatchParamsSchema,
  SessionsPluginPatchResult: SessionsPluginPatchResultSchema,
  SessionsResetParams: SessionsResetParamsSchema,
  SessionsDeleteParams: SessionsDeleteParamsSchema,
  SessionGroup: SessionGroupSchema,
  SessionsGroupsListParams: SessionsGroupsListParamsSchema,
  SessionsGroupsListResult: SessionsGroupsListResultSchema,
  SessionsGroupsPutParams: SessionsGroupsPutParamsSchema,
  SessionsGroupsRenameParams: SessionsGroupsRenameParamsSchema,
  SessionsGroupsDeleteParams: SessionsGroupsDeleteParamsSchema,
  SessionsGroupsMutationResult: SessionsGroupsMutationResultSchema,
  SessionsCompactParams: SessionsCompactParamsSchema,
  SessionsUsageParams: SessionsUsageParamsSchema,
  // Audit/task ledgers and config/wizard setup payloads.
  AuditActivityAgentRunV1: AuditActivityAgentRunV1Schema,
  AuditActivityToolActionV1: AuditActivityToolActionV1Schema,
  AuditActivityInboundMessageV1: AuditActivityInboundMessageV1Schema,
  AuditActivityOutboundMessageV1: AuditActivityOutboundMessageV1Schema,
  AuditActivityEventV1: AuditActivityEventV1Schema,
  AuditActivityListParams: AuditActivityListParamsSchema,
  AuditActivityListResult: AuditActivityListResultSchema,
  AuditEvent: AuditEventSchema,
  AuditListParams: AuditListParamsSchema,
  AuditListResult: AuditListResultSchema,
  TaskSuggestion: TaskSuggestionSchema,
  TaskSuggestionEvent: TaskSuggestionEventSchema,
  TaskSuggestionResolution: TaskSuggestionResolutionSchema,
  TaskSuggestionsAcceptParams: TaskSuggestionsAcceptParamsSchema,
  TaskSuggestionsAcceptResult: TaskSuggestionsAcceptResultSchema,
  TaskSuggestionsCreateParams: TaskSuggestionsCreateParamsSchema,
  TaskSuggestionsCreateResult: TaskSuggestionsCreateResultSchema,
  TaskSuggestionsDismissParams: TaskSuggestionsDismissParamsSchema,
  TaskSuggestionsDismissResult: TaskSuggestionsDismissResultSchema,
  TaskSuggestionsListParams: TaskSuggestionsListParamsSchema,
  TaskSuggestionsListResult: TaskSuggestionsListResultSchema,
  TaskSummary: TaskSummarySchema,
  TasksListParams: TasksListParamsSchema,
  TasksListResult: TasksListResultSchema,
  TasksGetParams: TasksGetParamsSchema,
  TasksGetResult: TasksGetResultSchema,
  TasksCancelParams: TasksCancelParamsSchema,
  TasksCancelResult: TasksCancelResultSchema,
  ConfigGetParams: ConfigGetParamsSchema,
  ConfigSetParams: ConfigSetParamsSchema,
  ConfigApplyParams: ConfigApplyParamsSchema,
  ConfigPatchParams: ConfigPatchParamsSchema,
  ConfigSchemaParams: ConfigSchemaParamsSchema,
  ConfigSchemaLookupParams: ConfigSchemaLookupParamsSchema,
  ConfigSchemaResponse: ConfigSchemaResponseSchema,
  ConfigSchemaLookupResult: ConfigSchemaLookupResultSchema,
  SystemAgentChatParams: SystemAgentChatParamsSchema,
  SystemAgentChatResult: SystemAgentChatResultSchema,
  SystemAgentChatHistoryParams: SystemAgentChatHistoryParamsSchema,
  SystemAgentChatHistoryTurn: SystemAgentChatHistoryTurnSchema,
  SystemAgentChatHistoryResult: SystemAgentChatHistoryResultSchema,
  SystemChangeEntry: SystemChangeEntrySchema,
  SystemChangeKind: SystemChangeKindSchema,
  SystemChangeSource: SystemChangeSourceSchema,
  SystemChangesListParams: SystemChangesListParamsSchema,
  SystemChangesListResult: SystemChangesListResultSchema,
  SystemAgentSetupDetectParams: SystemAgentSetupDetectParamsSchema,
  SystemAgentSetupDetectResult: SystemAgentSetupDetectResultSchema,
  SystemAgentSetupVerifyParams: SystemAgentSetupVerifyParamsSchema,
  SystemAgentSetupVerifyResult: SystemAgentSetupVerifyResultSchema,
  SystemAgentSetupActivateParams: SystemAgentSetupActivateParamsSchema,
  SystemAgentSetupActivateResult: SystemAgentSetupActivateResultSchema,
  SystemAgentSetupAuthStartParams: SystemAgentSetupAuthStartParamsSchema,
  SystemAgentSetupAuthStartResult: SystemAgentSetupAuthStartResultSchema,
  WizardStartParams: WizardStartParamsSchema,
  WizardNextParams: WizardNextParamsSchema,
  WizardCancelParams: WizardCancelParamsSchema,
  WizardStatusParams: WizardStatusParamsSchema,
  WizardStep: WizardStepSchema,
  WizardNextResult: WizardNextResultSchema,
  WizardStartResult: WizardStartResultSchema,
  WizardStatusResult: WizardStatusResultSchema,
  // Realtime Talk client/session events and channel control payloads.
  TalkModeParams: TalkModeParamsSchema,
  TalkEvent: TalkEventSchema,
  TalkCatalogParams: TalkCatalogParamsSchema,
  TalkCatalogResult: TalkCatalogResultSchema,
  TalkClientCreateParams: TalkClientCreateParamsSchema,
  TalkClientCreateResult: TalkClientCreateResultSchema,
  TalkClientCloseParams: TalkClientCloseParamsSchema,
  TalkClientMutationResult: TalkClientMutationResultSchema,
  TalkClientSteerParams: TalkClientSteerParamsSchema,
  TalkAgentControlResult: TalkAgentControlResultSchema,
  TalkClientToolCallParams: TalkClientToolCallParamsSchema,
  TalkClientToolCallResult: TalkClientToolCallResultSchema,
  TalkClientTranscriptParams: TalkClientTranscriptParamsSchema,
  TalkConfigParams: TalkConfigParamsSchema,
  TalkConfigResult: TalkConfigResultSchema,
  TalkSessionAppendAudioParams: TalkSessionAppendAudioParamsSchema,
  TalkSessionAcknowledgeMarkParams: TalkSessionAcknowledgeMarkParamsSchema,
  TalkSessionCancelOutputParams: TalkSessionCancelOutputParamsSchema,
  TalkSessionCancelTurnParams: TalkSessionCancelTurnParamsSchema,
  TalkSessionCreateParams: TalkSessionCreateParamsSchema,
  TalkSessionCreateResult: TalkSessionCreateResultSchema,
  TalkSessionJoinParams: TalkSessionJoinParamsSchema,
  TalkSessionJoinResult: TalkSessionJoinResultSchema,
  TalkSessionTurnParams: TalkSessionTurnParamsSchema,
  TalkSessionTurnResult: TalkSessionTurnResultSchema,
  TalkSessionSteerParams: TalkSessionSteerParamsSchema,
  TalkSessionSubmitToolResultParams: TalkSessionSubmitToolResultParamsSchema,
  TalkSessionCloseParams: TalkSessionCloseParamsSchema,
  TalkSessionOkResult: TalkSessionOkResultSchema,
  TalkSpeakParams: TalkSpeakParamsSchema,
  TalkSpeakResult: TalkSpeakResultSchema,
  TtsSpeakParams: TtsSpeakParamsSchema,
  TtsSpeakResult: TtsSpeakResultSchema,
  ChannelsStatusParams: ChannelsStatusParamsSchema,
  ChannelsStatusResult: ChannelsStatusResultSchema,
  ChannelsStartParams: ChannelsStartParamsSchema,
  ChannelsStopParams: ChannelsStopParamsSchema,
  ChannelsLogoutParams: ChannelsLogoutParamsSchema,
  WebLoginStartParams: WebLoginStartParamsSchema,
  WebLoginWaitParams: WebLoginWaitParamsSchema,
  // Agent files, artifacts, model catalogs, commands, tools, and skill workshop.
  AgentSummary: AgentSummarySchema,
  AgentsCreateParams: AgentsCreateParamsSchema,
  AgentsCreateResult: AgentsCreateResultSchema,
  AgentsUpdateParams: AgentsUpdateParamsSchema,
  AgentsUpdateResult: AgentsUpdateResultSchema,
  AgentsDeleteParams: AgentsDeleteParamsSchema,
  AgentsDeleteResult: AgentsDeleteResultSchema,
  AgentsFileEntry: AgentsFileEntrySchema,
  AgentsFilesListParams: AgentsFilesListParamsSchema,
  AgentsFilesListResult: AgentsFilesListResultSchema,
  AgentsFilesGetParams: AgentsFilesGetParamsSchema,
  AgentsFilesGetResult: AgentsFilesGetResultSchema,
  AgentsFilesSetParams: AgentsFilesSetParamsSchema,
  AgentsFilesSetResult: AgentsFilesSetResultSchema,
  AgentsWorkspaceEntry: AgentsWorkspaceEntrySchema,
  AgentsWorkspaceFile: AgentsWorkspaceFileSchema,
  AgentsWorkspaceListParams: AgentsWorkspaceListParamsSchema,
  AgentsWorkspaceListResult: AgentsWorkspaceListResultSchema,
  AgentsWorkspaceGetParams: AgentsWorkspaceGetParamsSchema,
  AgentsWorkspaceGetResult: AgentsWorkspaceGetResultSchema,
  ArtifactSummary: ArtifactSummarySchema,
  ArtifactsListParams: ArtifactsListParamsSchema,
  ArtifactsListResult: ArtifactsListResultSchema,
  ArtifactsGetParams: ArtifactsGetParamsSchema,
  ArtifactsGetResult: ArtifactsGetResultSchema,
  ArtifactsDownloadParams: ArtifactsDownloadParamsSchema,
  ArtifactsDownloadResult: ArtifactsDownloadResultSchema,
  AgentsListParams: AgentsListParamsSchema,
  AgentsListResult: AgentsListResultSchema,
  ModelChoice: ModelChoiceSchema,
  ModelsListParams: ModelsListParamsSchema,
  ModelsListResult: ModelsListResultSchema,
  ModelsProbeParams: ModelsProbeParamsSchema,
  ModelsProbeTargetResult: ModelsProbeTargetResultSchema,
  ModelsProbeResult: ModelsProbeResultSchema,
  CommandEntry: CommandEntrySchema,
  CommandsListParams: CommandsListParamsSchema,
  CommandsListResult: CommandsListResultSchema,
  SkillsStatusParams: SkillsStatusParamsSchema,
  ToolsCatalogParams: ToolsCatalogParamsSchema,
  ToolCatalogProfile: ToolCatalogProfileSchema,
  ToolCatalogEntry: ToolCatalogEntrySchema,
  ToolCatalogGroup: ToolCatalogGroupSchema,
  ToolsCatalogResult: ToolsCatalogResultSchema,
  ToolsEffectiveParams: ToolsEffectiveParamsSchema,
  ToolsEffectiveEntry: ToolsEffectiveEntrySchema,
  ToolsEffectiveGroup: ToolsEffectiveGroupSchema,
  ToolsEffectiveNotice: ToolsEffectiveNoticeSchema,
  ToolsEffectiveResult: ToolsEffectiveResultSchema,
  ToolsInvokeParams: ToolsInvokeParamsSchema,
  ToolsInvokeError: ToolsInvokeErrorSchema,
  ToolsInvokeResult: ToolsInvokeResultSchema,
  SkillsBinsParams: SkillsBinsParamsSchema,
  SkillsBinsResult: SkillsBinsResultSchema,
  SkillsSearchParams: SkillsSearchParamsSchema,
  SkillsSearchResult: SkillsSearchResultSchema,
  SkillsDetailParams: SkillsDetailParamsSchema,
  SkillsDetailResult: SkillsDetailResultSchema,
  SkillsCuratorActionParams: SkillsCuratorActionParamsSchema,
  SkillsCuratorActionResult: SkillsCuratorActionResultSchema,
  SkillsCuratorStatusParams: SkillsCuratorStatusParamsSchema,
  SkillsCuratorStatusResult: SkillsCuratorStatusResultSchema,
  ...SkillWorkshopProtocolSchemas,
  SkillsProposalInspectParams: SkillsProposalInspectParamsSchema,
  SkillsProposalInspectResult: SkillsProposalInspectResultSchema,
  SkillsProposalCreateParams: SkillsProposalCreateParamsSchema,
  SkillsProposalUpdateParams: SkillsProposalUpdateParamsSchema,
  SkillsProposalReviseParams: SkillsProposalReviseParamsSchema,
  SkillsProposalRequestRevisionParams: SkillsProposalRequestRevisionParamsSchema,
  SkillsProposalRequestRevisionResult: SkillsProposalRequestRevisionResultSchema,
  SkillsProposalActionParams: SkillsProposalActionParamsSchema,
  SkillsProposalApplyResult: SkillsProposalApplyResultSchema,
  SkillsProposalRecordResult: SkillsProposalRecordResultSchema,
  SkillsSecurityVerdictsParams: SkillsSecurityVerdictsParamsSchema,
  SkillsSecurityVerdictsResult: SkillsSecurityVerdictsResultSchema,
  SkillsSkillCardParams: SkillsSkillCardParamsSchema,
  SkillsSkillCardResult: SkillsSkillCardResultSchema,
  SkillsUploadBeginParams: SkillsUploadBeginParamsSchema,
  SkillsUploadChunkParams: SkillsUploadChunkParamsSchema,
  SkillsUploadCommitParams: SkillsUploadCommitParamsSchema,
  SkillsInstallParams: SkillsInstallParamsSchema,
  SkillsUpdateParams: SkillsUpdateParamsSchema,
  // Scheduler, logs, approval, plugin control, device, chat, and lifecycle events.
  CronJob: CronJobSchema,
  CronListParams: CronListParamsSchema,
  CronStatusParams: CronStatusParamsSchema,
  CronGetParams: CronGetParamsSchema,
  CronAddParams: CronAddParamsSchema,
  CronAddResult: CronAddResultSchema,
  CronDeclarativeAddResult: CronDeclarativeAddResultSchema,
  CronUpdateParams: CronUpdateParamsSchema,
  CronRemoveParams: CronRemoveParamsSchema,
  CronRunParams: CronRunParamsSchema,
  CronRunsParams: CronRunsParamsSchema,
  CronRunLogEntry: CronRunLogEntrySchema,
  ...LogMigrationProtocolSchemas,
  ...TerminalProtocolSchemas,
  ApprovalKind: ApprovalKindSchema,
  ApprovalDecision: ApprovalDecisionSchema,
  ApprovalAllowDecision: ApprovalAllowDecisionSchema,
  ApprovalAllowedReason: ApprovalAllowedReasonSchema,
  ApprovalDeniedReason: ApprovalDeniedReasonSchema,
  ApprovalExpiredReason: ApprovalExpiredReasonSchema,
  ApprovalCancelledReason: ApprovalCancelledReasonSchema,
  PluginApprovalSeverity: PluginApprovalSeveritySchema,
  ExecApprovalPresentation: ExecApprovalPresentationSchema,
  PluginApprovalPresentation: PluginApprovalPresentationSchema,
  SystemAgentApprovalPresentation: SystemAgentApprovalPresentationSchema,
  ApprovalPresentation: ApprovalPresentationSchema,
  PendingApprovalSnapshot: PendingApprovalSnapshotSchema,
  AllowedApprovalSnapshot: AllowedApprovalSnapshotSchema,
  DeniedApprovalSnapshot: DeniedApprovalSnapshotSchema,
  ExpiredApprovalSnapshot: ExpiredApprovalSnapshotSchema,
  CancelledApprovalSnapshot: CancelledApprovalSnapshotSchema,
  ApprovalSnapshot: ApprovalSnapshotSchema,
  ApprovalTerminalReason: ApprovalTerminalReasonSchema,
  TerminalApprovalSnapshot: TerminalApprovalSnapshotSchema,
  ApprovalGetParams: ApprovalGetParamsSchema,
  ApprovalGetResult: ApprovalGetResultSchema,
  ApprovalHistoryParams: ApprovalHistoryParamsSchema,
  ApprovalHistoryResult: ApprovalHistoryResultSchema,
  ApprovalResolveParams: ApprovalResolveParamsSchema,
  ApprovalResolveResult: ApprovalResolveResultSchema,
  PendingSessionApprovalEvent: PendingSessionApprovalEventSchema,
  TerminalSessionApprovalEvent: TerminalSessionApprovalEventSchema,
  SessionApprovalEvent: SessionApprovalEventSchema,
  SessionApprovalReplay: SessionApprovalReplaySchema,
  ExecApprovalsGetParams: ExecApprovalsGetParamsSchema,
  ExecApprovalsSetParams: ExecApprovalsSetParamsSchema,
  ExecApprovalsNodeGetParams: ExecApprovalsNodeGetParamsSchema,
  ExecApprovalsNodeSnapshot: ExecApprovalsNodeSnapshotSchema,
  ExecApprovalsNodeSetParams: ExecApprovalsNodeSetParamsSchema,
  ExecApprovalsSnapshot: ExecApprovalsSnapshotSchema,
  ExecApprovalGetParams: ExecApprovalGetParamsSchema,
  ExecApprovalRequestParams: ExecApprovalRequestParamsSchema,
  ExecApprovalResolveParams: ExecApprovalResolveParamsSchema,
  QuestionOption: QuestionOptionSchema,
  Question: QuestionSchema,
  QuestionRequestQuestion: QuestionRequestQuestionSchema,
  QuestionAnswers: QuestionAnswersSchema,
  QuestionStatus: QuestionStatusSchema,
  QuestionRecord: QuestionRecordSchema,
  QuestionRequestParams: QuestionRequestParamsSchema,
  QuestionRequestResult: QuestionRequestResultSchema,
  QuestionWaitAnswerParams: QuestionWaitAnswerParamsSchema,
  QuestionWaitAnswerResult: QuestionWaitAnswerResultSchema,
  QuestionResolveParams: QuestionResolveParamsSchema,
  QuestionResolveResult: QuestionResolveResultSchema,
  QuestionGetParams: QuestionGetParamsSchema,
  QuestionGetResult: QuestionGetResultSchema,
  QuestionListParams: QuestionListParamsSchema,
  QuestionListResult: QuestionListResultSchema,
  // QuestionRequestedEvent is a TS-only alias of QuestionRecord; registering both
  // names makes native codegen reference a type it never emits.
  QuestionResolvedEvent: QuestionResolvedEventSchema,
  PluginApprovalRequestParams: PluginApprovalRequestParamsSchema,
  PluginApprovalResolveParams: PluginApprovalResolveParamsSchema,
  PluginCatalogClawHubInstall: PluginCatalogClawHubInstallSchema,
  PluginCatalogEntry: PluginCatalogEntrySchema,
  PluginCatalogInstallAction: PluginCatalogInstallActionSchema,
  PluginCatalogOfficialInstall: PluginCatalogOfficialInstallSchema,
  PluginControlUiDescriptor: PluginControlUiDescriptorSchema,
  PluginSearchPackage: PluginSearchPackageSchema,
  PluginSearchResultEntry: PluginSearchResultEntrySchema,
  PluginsInstallParams: PluginsInstallParamsSchema,
  PluginsInstallResult: PluginsInstallResultSchema,
  PluginsListParams: PluginsListParamsSchema,
  PluginsListResult: PluginsListResultSchema,
  PluginsRefreshParams: PluginsRefreshParamsSchema,
  PluginsRefreshResult: PluginsRefreshResultSchema,
  PluginsSearchParams: PluginsSearchParamsSchema,
  PluginsSearchResult: PluginsSearchResultSchema,
  PluginsSessionActionFailureResult: PluginsSessionActionFailureResultSchema,
  PluginsSessionActionParams: PluginsSessionActionParamsSchema,
  PluginsSessionActionResult: PluginsSessionActionResultSchema,
  PluginsSessionActionSuccessResult: PluginsSessionActionSuccessResultSchema,
  PluginsSetEnabledParams: PluginsSetEnabledParamsSchema,
  PluginsSetEnabledResult: PluginsSetEnabledResultSchema,
  PluginsUiDescriptorsParams: PluginsUiDescriptorsParamsSchema,
  PluginsUiDescriptorsResult: PluginsUiDescriptorsResultSchema,
  PluginsUninstallParams: PluginsUninstallParamsSchema,
  PluginsUninstallResult: PluginsUninstallResultSchema,
  DevicePairListParams: DevicePairListParamsSchema,
  DevicePairApproveParams: DevicePairApproveParamsSchema,
  DevicePairRejectParams: DevicePairRejectParamsSchema,
  DevicePairRemoveParams: DevicePairRemoveParamsSchema,
  DevicePairSetupCodeParams: DevicePairSetupCodeParamsSchema,
  DevicePairSetupCodeResult: DevicePairSetupCodeResultSchema,
  DevicePairRenameParams: DevicePairRenameParamsSchema,
  DeviceTokenRotateParams: DeviceTokenRotateParamsSchema,
  DeviceTokenRevokeParams: DeviceTokenRevokeParamsSchema,
  DevicePairRequestedEvent: DevicePairRequestedEventSchema,
  DevicePairResolvedEvent: DevicePairResolvedEventSchema,
  ChatHistoryParams: ChatHistoryParamsSchema,
  ChatMetadataParams: ChatMetadataParamsSchema,
  ChatMessageGetParams: ChatMessageGetParamsSchema,
  ChatMessageGetResult: ChatMessageGetResultSchema,
  ChatToolTitlesParams: ChatToolTitlesParamsSchema,
  ChatToolTitlesResult: ChatToolTitlesResultSchema,
  ChatSendParams: ChatSendParamsSchema,
  ChatAbortParams: ChatAbortParamsSchema,
  ChatInjectParams: ChatInjectParamsSchema,
  ChatDeltaEvent: ChatDeltaEventSchema,
  ChatFinalEvent: ChatFinalEventSchema,
  ChatAbortedEvent: ChatAbortedEventSchema,
  ChatErrorEvent: ChatErrorEventSchema,
  ChatEvent: ChatEventSchema,
  UpdateStatusParams: UpdateStatusParamsSchema,
  UpdateRunParams: UpdateRunParamsSchema,
  TickEvent: TickEventSchema,
  ShutdownEvent: ShutdownEventSchema
};

// packages/gateway-protocol/src/index.ts
var validateCommandsListParams = lazyCompile(CommandsListParamsSchema);
var validateConnectParams = lazyCompile(ConnectParamsSchema);
var validateWorkerAdmissionHandshake = lazyCompile(WorkerAdmissionHandshakeSchema);
var validateWorkerConnectRequestFrame = lazyCompile(WorkerConnectRequestFrameSchema);
var validateWorkerHeartbeatParams = lazyCompile(WorkerHeartbeatParamsSchema);
function checkWorkerProtocolJson(data) {
  const stack = [{ depth: 0, value: data }];
  const seen = /* @__PURE__ */ new WeakSet();
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      break;
    }
    if (current.depth > WORKER_TRANSCRIPT_MAX_JSON_DEPTH) {
      return {
        keyword: "maxDepth",
        params: { limit: WORKER_TRANSCRIPT_MAX_JSON_DEPTH },
        message: `must not exceed JSON nesting depth ${WORKER_TRANSCRIPT_MAX_JSON_DEPTH}`
      };
    }
    if (current.value === null || typeof current.value === "string" || typeof current.value === "boolean") {
      continue;
    }
    if (typeof current.value === "number") {
      if (!Number.isFinite(current.value)) {
        return { keyword: "finite", message: "must contain only finite JSON numbers" };
      }
      continue;
    }
    if (typeof current.value !== "object") {
      return { keyword: "jsonValue", message: "must contain only JSON values" };
    }
    if (seen.has(current.value)) {
      return { keyword: "acyclic", message: "must be an acyclic JSON value" };
    }
    seen.add(current.value);
    const values = Array.isArray(current.value) ? current.value : Object.values(current.value);
    for (const value of values) {
      stack.push({ depth: current.depth + 1, value });
    }
  }
  return void 0;
}
var validateWorkerTranscriptCommitParams = lazyCompile(
  WorkerTranscriptCommitParamsSchema,
  checkWorkerProtocolJson
);
var validateWorkerLiveEventParams = lazyCompile(
  WorkerLiveEventParamsSchema,
  checkWorkerProtocolJson
);
var validateGatewaySuspendPrepareParams = lazyCompile(GatewaySuspendPrepareParamsSchema);
var validateGatewaySuspendStatusParams = lazyCompile(GatewaySuspendStatusParamsSchema);
var validateGatewaySuspendResumeParams = lazyCompile(GatewaySuspendResumeParamsSchema);
var validateRequestFrame = lazyCompile(RequestFrameSchema);
var validateMessageActionParams = lazyCompile(MessageActionParamsSchema);
var validateSendParams = lazyCompile(SendParamsSchema);
var validateConversationListParams = lazyCompile(ConversationListParamsSchema);
var validateConversationSendParams = lazyCompile(ConversationSendParamsSchema);
var validateConversationTurnCancelParams = lazyCompile(ConversationTurnCancelParamsSchema);
var validateConversationTurnParams = lazyCompile(ConversationTurnParamsSchema);
var validatePollParams = lazyCompile(PollParamsSchema);
var validateAgentParams = lazyCompile(AgentParamsSchema);
var validateAuditActivityListParams = lazyCompile(
  AuditActivityListParamsSchema
);
var validateAuditListParams = lazyCompile(AuditListParamsSchema);
var validateUsersListParams = lazyCompile(UsersListParamsSchema);
var validateUsersSelfParams = lazyCompile(UsersSelfParamsSchema);
var validateUsersSelfResult = lazyCompile(UsersSelfResultSchema);
var validateUsersLinkEmailParams = lazyCompile(UsersLinkEmailParamsSchema);
var validateUsersLinkEmailResult = lazyCompile(UsersLinkEmailResultSchema);
var validateUsersSetDisplayNameParams = lazyCompile(UsersSetDisplayNameParamsSchema);
var validateUsersSetDisplayNameResult = lazyCompile(UsersSetDisplayNameResultSchema);
var validateUsersSetAvatarParams = lazyCompile(UsersSetAvatarParamsSchema);
var validateUsersSetAvatarResult = lazyCompile(UsersSetAvatarResultSchema);
var validateAgentIdentityParams = lazyCompile(AgentIdentityParamsSchema);
var validateAgentWaitParams = lazyCompile(AgentWaitParamsSchema);
var validateWakeParams = lazyCompile(WakeParamsSchema);
var validateAgentsListParams = lazyCompile(AgentsListParamsSchema);
var validateWorktreesListParams = lazyCompile(WorktreesListParamsSchema);
var validateBoardGetParams = lazyCompile(BoardGetParamsSchema);
var validateBoardUpdateParams = lazyCompile(BoardUpdateParamsSchema);
var validateBoardWidgetContent = lazyCompile(BoardWidgetContentSchema);
var validateBoardWidgetAppViewParams = lazyCompile(BoardWidgetAppViewParamsSchema);
var validateBoardWidgetPutParams = lazyCompile(BoardWidgetPutParamsSchema);
var validateBoardWidgetGrantParams = lazyCompile(BoardWidgetGrantParamsSchema);
var validateBoardEventParams = lazyCompile(BoardEventParamsSchema);
var validateBoardPromptAuthorizeParams = lazyCompile(BoardPromptAuthorizeParamsSchema);
var validateBoardDataReadParams = lazyCompile(BoardDataReadParamsSchema);
var validateBoardActionParams = lazyCompile(BoardActionParamsSchema);
var validateWorktreesCreateParams = lazyCompile(WorktreesCreateParamsSchema);
var validateWorktreesRemoveParams = lazyCompile(WorktreesRemoveParamsSchema);
var validateWorktreesRestoreParams = lazyCompile(WorktreesRestoreParamsSchema);
var validateWorktreesGcParams = lazyCompile(WorktreesGcParamsSchema);
var validateWorktreesBranchesParams = lazyCompile(WorktreesBranchesParamsSchema);
var validateFsListDirParams = lazyCompile(FsListDirParamsSchema);
var validateFsListDirResult = lazyCompile(FsListDirResultSchema);
var validateAgentsCreateParams = lazyCompile(AgentsCreateParamsSchema);
var validateAgentsUpdateParams = lazyCompile(AgentsUpdateParamsSchema);
var validateAgentsDeleteParams = lazyCompile(AgentsDeleteParamsSchema);
var validateAgentsFilesListParams = lazyCompile(AgentsFilesListParamsSchema);
var validateAgentsFilesGetParams = lazyCompile(AgentsFilesGetParamsSchema);
var validateAgentsFilesSetParams = lazyCompile(AgentsFilesSetParamsSchema);
var validateAgentsWorkspaceListParams = lazyCompile(AgentsWorkspaceListParamsSchema);
var validateAgentsWorkspaceGetParams = lazyCompile(AgentsWorkspaceGetParamsSchema);
var validateArtifactsListParams = lazyCompile(ArtifactsListParamsSchema);
var validateArtifactsGetParams = lazyCompile(ArtifactsGetParamsSchema);
var validateArtifactsDownloadParams = lazyCompile(ArtifactsDownloadParamsSchema);
var validateNodePairListParams = lazyCompile(NodePairListParamsSchema);
var validateNodePairApproveParams = lazyCompile(NodePairApproveParamsSchema);
var validateNodePairRejectParams = lazyCompile(NodePairRejectParamsSchema);
var validateNodePairRemoveParams = lazyCompile(NodePairRemoveParamsSchema);
var validateNodeRenameParams = lazyCompile(NodeRenameParamsSchema);
var validateNodeListParams = lazyCompile(NodeListParamsSchema);
var validateNodePluginToolsUpdateParams = lazyCompile(NodePluginToolsUpdateParamsSchema);
var validateNodeSkillsUpdateParams = lazyCompile(NodeSkillsUpdateParamsSchema);
var validateEnvironmentsCreateParams = lazyCompile(EnvironmentsCreateParamsSchema);
var validateEnvironmentsDestroyParams = lazyCompile(EnvironmentsDestroyParamsSchema);
var validateEnvironmentsListParams = lazyCompile(EnvironmentsListParamsSchema);
var validateEnvironmentsStatusParams = lazyCompile(EnvironmentsStatusParamsSchema);
var validateSystemInfoParams = lazyCompile(SystemInfoParamsSchema);
var validateSystemInfoResult = lazyCompile(SystemInfoResultSchema);
var validateNodePendingAckParams = lazyCompile(NodePendingAckParamsSchema);
var validateNodeDescribeParams = lazyCompile(NodeDescribeParamsSchema);
var validateNodeInvokeParams = lazyCompile(NodeInvokeParamsSchema);
var validateNodeInvokeResultParams = lazyCompile(NodeInvokeResultParamsSchema);
var validateNodeInvokeProgressParams = lazyCompile(NodeInvokeProgressParamsSchema);
var validateNodeEventParams = lazyCompile(NodeEventParamsSchema);
var validateNodePresenceActivityPayload = lazyCompile(NodePresenceActivityPayloadSchema);
var validateNodePendingDrainParams = lazyCompile(NodePendingDrainParamsSchema);
var validateNodePendingEnqueueParams = lazyCompile(NodePendingEnqueueParamsSchema);
var validatePushTestParams = lazyCompile(PushTestParamsSchema);
var validateWebPushVapidPublicKeyParams = lazyCompile(
  WebPushVapidPublicKeyParamsSchema
);
var validateWebPushSubscribeParams = lazyCompile(
  WebPushSubscribeParamsSchema
);
var validateWebPushUnsubscribeParams = lazyCompile(
  WebPushUnsubscribeParamsSchema
);
var validateWebPushTestParams = lazyCompile(WebPushTestParamsSchema);
var validateSecretsResolveParams = lazyCompile(SecretsResolveParamsSchema);
var validateSecretsResolveResult = lazyCompile(SecretsResolveResultSchema);
var validateSessionsListParams = lazyCompile(SessionsListParamsSchema);
var validateSessionsCatalogListParams = lazyCompile(SessionsCatalogListParamsSchema);
var validateSessionsCatalogReadParams = lazyCompile(SessionsCatalogReadParamsSchema);
var validateSessionsCatalogContinueParams = lazyCompile(
  SessionsCatalogContinueParamsSchema
);
var validateSessionsCatalogArchiveParams = lazyCompile(SessionsCatalogArchiveParamsSchema);
var validateSessionsSearchParams = lazyCompile(SessionsSearchParamsSchema);
var validateSessionsCleanupParams = lazyCompile(SessionsCleanupParamsSchema);
var validateSessionsPreviewParams = lazyCompile(SessionsPreviewParamsSchema);
var validateSessionsDescribeParams = lazyCompile(SessionsDescribeParamsSchema);
var validateSessionsResolveParams = lazyCompile(SessionsResolveParamsSchema);
var validateSessionsFilesListParams = lazyCompile(SessionsFilesListParamsSchema);
var validateSessionsFilesGetParams = lazyCompile(SessionsFilesGetParamsSchema);
var validateSessionsFilesSetParams = lazyCompile(SessionsFilesSetParamsSchema);
var validateSessionsFilesRevealParams = lazyCompile(SessionsFilesRevealParamsSchema);
var validateSessionsDiffParams = lazyCompile(SessionsDiffParamsSchema);
var validateSessionsCreateParams = lazyCompile(SessionsCreateParamsSchema);
var validateSessionsSendParams = lazyCompile(SessionsSendParamsSchema);
var validateSessionsDispatchParams = lazyCompile(SessionsDispatchParamsSchema);
var validateSessionsReclaimParams = lazyCompile(SessionsReclaimParamsSchema);
var validateSessionsMessagesSubscribeParams = lazyCompile(
  SessionsMessagesSubscribeParamsSchema
);
var validateSessionsMessagesUnsubscribeParams = lazyCompile(
  SessionsMessagesUnsubscribeParamsSchema
);
var validateSessionsAbortParams = lazyCompile(SessionsAbortParamsSchema);
var validateSessionsPatchParams = lazyCompile(SessionsPatchParamsSchema);
var validateSessionsPluginPatchParams = lazyCompile(SessionsPluginPatchParamsSchema);
var validateSessionsResetParams = lazyCompile(SessionsResetParamsSchema);
var validateSessionsDeleteParams = lazyCompile(SessionsDeleteParamsSchema);
var validateSessionsGroupsListParams = lazyCompile(SessionsGroupsListParamsSchema);
var validateSessionsGroupsPutParams = lazyCompile(SessionsGroupsPutParamsSchema);
var validateSessionsGroupsRenameParams = lazyCompile(SessionsGroupsRenameParamsSchema);
var validateSessionsGroupsDeleteParams = lazyCompile(SessionsGroupsDeleteParamsSchema);
var validateSessionsCompactParams = lazyCompile(SessionsCompactParamsSchema);
var validateSessionsCompactionListParams = lazyCompile(SessionsCompactionListParamsSchema);
var validateSessionsCompactionGetParams = lazyCompile(SessionsCompactionGetParamsSchema);
var validateSessionsCompactionBranchParams = lazyCompile(
  SessionsCompactionBranchParamsSchema
);
var validateSessionsCompactionRestoreParams = lazyCompile(
  SessionsCompactionRestoreParamsSchema
);
var validateSessionsBranchesListParams = lazyCompile(SessionsBranchesListParamsSchema);
var validateSessionsBranchesSwitchParams = lazyCompile(SessionsBranchesSwitchParamsSchema);
var validateSessionsRewindParams = lazyCompile(SessionsRewindParamsSchema);
var validateSessionsForkParams = lazyCompile(SessionsForkParamsSchema);
var validateSessionsUsageParams = lazyCompile(SessionsUsageParamsSchema);
var validateSessionDiscussionInfoParams = lazyCompile(SessionDiscussionInfoParamsSchema);
var validateSessionDiscussionInfoResult = lazyCompile(SessionDiscussionInfoResultSchema);
var validateSessionDiscussionOpenParams = lazyCompile(SessionDiscussionOpenParamsSchema);
var validateSessionDiscussionOpenResult = lazyCompile(SessionDiscussionOpenResultSchema);
var validateTaskSuggestionsListParams = lazyCompile(TaskSuggestionsListParamsSchema);
var validateTaskSuggestionsCreateParams = lazyCompile(TaskSuggestionsCreateParamsSchema);
var validateTaskSuggestionsAcceptParams = lazyCompile(TaskSuggestionsAcceptParamsSchema);
var validateTaskSuggestionsDismissParams = lazyCompile(TaskSuggestionsDismissParamsSchema);
var validateTasksListParams = lazyCompile(TasksListParamsSchema);
var validateTasksGetParams = lazyCompile(TasksGetParamsSchema);
var validateTasksCancelParams = lazyCompile(TasksCancelParamsSchema);
var validateConfigGetParams = lazyCompile(ConfigGetParamsSchema);
var validateConfigSetParams = lazyCompile(ConfigSetParamsSchema);
var validateConfigApplyParams = lazyCompile(ConfigApplyParamsSchema);
var validateConfigPatchParams = lazyCompile(ConfigPatchParamsSchema);
var validateConfigSchemaParams = lazyCompile(ConfigSchemaParamsSchema);
var validateConfigSchemaLookupParams = lazyCompile(ConfigSchemaLookupParamsSchema);
var validateConfigSchemaLookupResult = lazyCompile(ConfigSchemaLookupResultSchema);
var validateSystemAgentChatParams = lazyCompile(SystemAgentChatParamsSchema);
var validateSystemAgentChatHistoryParams = lazyCompile(SystemAgentChatHistoryParamsSchema);
var validateSystemChangesListParams = lazyCompile(SystemChangesListParamsSchema);
var validateSystemAgentSetupDetectParams = lazyCompile(SystemAgentSetupDetectParamsSchema);
var validateSystemAgentSetupVerifyParams = lazyCompile(SystemAgentSetupVerifyParamsSchema);
var validateSystemAgentSetupActivateParams = lazyCompile(
  SystemAgentSetupActivateParamsSchema
);
var validateSystemAgentSetupAuthStartParams = lazyCompile(
  SystemAgentSetupAuthStartParamsSchema
);
var validateWizardStartParams = lazyCompile(WizardStartParamsSchema);
var validateWizardNextParams = lazyCompile(WizardNextParamsSchema);
var validateWizardCancelParams = lazyCompile(WizardCancelParamsSchema);
var validateWizardStatusParams = lazyCompile(WizardStatusParamsSchema);
var validateTalkModeParams = lazyCompile(TalkModeParamsSchema);
var validateTalkCatalogParams = lazyCompile(TalkCatalogParamsSchema);
var validateTalkConfigParams = lazyCompile(TalkConfigParamsSchema);
var validateTalkConfigResult = lazyCompile(TalkConfigResultSchema);
var validateTalkClientCreateParams = lazyCompile(TalkClientCreateParamsSchema);
var validateTalkClientCreateResult = lazyCompile(TalkClientCreateResultSchema);
var validateTalkClientCloseParams = lazyCompile(TalkClientCloseParamsSchema);
var validateTalkClientMutationResult = lazyCompile(TalkClientMutationResultSchema);
var validateTalkClientToolCallParams = lazyCompile(TalkClientToolCallParamsSchema);
var validateTalkClientToolCallResult = lazyCompile(TalkClientToolCallResultSchema);
var validateTalkClientTranscriptParams = lazyCompile(TalkClientTranscriptParamsSchema);
var validateTalkClientSteerParams = lazyCompile(TalkClientSteerParamsSchema);
var validateTalkSessionCreateParams = lazyCompile(TalkSessionCreateParamsSchema);
var validateTalkSessionJoinParams = lazyCompile(TalkSessionJoinParamsSchema);
var validateTalkSessionAppendAudioParams = lazyCompile(TalkSessionAppendAudioParamsSchema);
var validateTalkSessionAcknowledgeMarkParams = lazyCompile(
  TalkSessionAcknowledgeMarkParamsSchema
);
var validateTalkSessionTurnParams = lazyCompile(TalkSessionTurnParamsSchema);
var validateTalkSessionCancelTurnParams = lazyCompile(TalkSessionCancelTurnParamsSchema);
var validateTalkSessionCancelOutputParams = lazyCompile(
  TalkSessionCancelOutputParamsSchema
);
var validateTalkSessionSteerParams = lazyCompile(TalkSessionSteerParamsSchema);
var validateTalkSessionSubmitToolResultParams = lazyCompile(
  TalkSessionSubmitToolResultParamsSchema
);
var validateTalkSessionCloseParams = lazyCompile(TalkSessionCloseParamsSchema);
var validateTalkSpeakParams = lazyCompile(TalkSpeakParamsSchema);
var validateTtsSpeakParams = lazyCompile(TtsSpeakParamsSchema);
var validateChannelsStatusParams = lazyCompile(ChannelsStatusParamsSchema);
var validateChannelsStartParams = lazyCompile(ChannelsStartParamsSchema);
var validateChannelsStopParams = lazyCompile(ChannelsStopParamsSchema);
var validateChannelsLogoutParams = lazyCompile(ChannelsLogoutParamsSchema);
var validateModelsListParams = lazyCompile(ModelsListParamsSchema);
var validateSkillsStatusParams = lazyCompile(SkillsStatusParamsSchema);
var validateToolsCatalogParams = lazyCompile(ToolsCatalogParamsSchema);
var validateToolsEffectiveParams = lazyCompile(ToolsEffectiveParamsSchema);
var validateToolsInvokeParams = lazyCompile(ToolsInvokeParamsSchema);
var validateSkillsBinsParams = lazyCompile(SkillsBinsParamsSchema);
var validateSkillsInstallParams = lazyCompile(SkillsInstallParamsSchema);
var validateSkillsUploadBeginParams = lazyCompile(SkillsUploadBeginParamsSchema);
var validateSkillsUploadChunkParams = lazyCompile(SkillsUploadChunkParamsSchema);
var validateSkillsUploadCommitParams = lazyCompile(SkillsUploadCommitParamsSchema);
var validateSkillsUpdateParams = lazyCompile(SkillsUpdateParamsSchema);
var validateSkillsSearchParams = lazyCompile(SkillsSearchParamsSchema);
var validateSkillsDetailParams = lazyCompile(SkillsDetailParamsSchema);
var validateSkillsCuratorStatusParams = lazyCompile(SkillsCuratorStatusParamsSchema);
var validateSkillsCuratorActionParams = lazyCompile(SkillsCuratorActionParamsSchema);
var validateSkillsProposalsListParams = lazyCompile(SkillsProposalsListParamsSchema);
var validateSkillsProposalInspectParams = lazyCompile(SkillsProposalInspectParamsSchema);
var validateSkillsProposalCreateParams = lazyCompile(SkillsProposalCreateParamsSchema);
var validateSkillsProposalUpdateParams = lazyCompile(SkillsProposalUpdateParamsSchema);
var validateSkillsProposalReviseParams = lazyCompile(SkillsProposalReviseParamsSchema);
var validateSkillsProposalRequestRevisionParams = lazyCompile(
  SkillsProposalRequestRevisionParamsSchema
);
var validateSkillsProposalActionParams = lazyCompile(SkillsProposalActionParamsSchema);
var validateSkillsSecurityVerdictsParams = lazyCompile(SkillsSecurityVerdictsParamsSchema);
var validateSkillsSkillCardParams = lazyCompile(SkillsSkillCardParamsSchema);
var validateCronListParams = lazyCompile(CronListParamsSchema);
var validateCronStatusParams = lazyCompile(CronStatusParamsSchema);
var validateCronGetParams = lazyCompile(CronGetParamsSchema);
var validateCronAddParams = lazyCompile(CronAddParamsSchema);
var validateCronUpdateParams = lazyCompile(CronUpdateParamsSchema);
var validateCronRemoveParams = lazyCompile(CronRemoveParamsSchema);
var validateCronRunParams = lazyCompile(CronRunParamsSchema);
var validateCronRunsParams = lazyCompile(CronRunsParamsSchema);
var validateDevicePairListParams = lazyCompile(DevicePairListParamsSchema);
var validateDevicePairApproveParams = lazyCompile(DevicePairApproveParamsSchema);
var validateDevicePairRejectParams = lazyCompile(DevicePairRejectParamsSchema);
var validateDevicePairRemoveParams = lazyCompile(DevicePairRemoveParamsSchema);
var validateDevicePairSetupCodeParams = lazyCompile(DevicePairSetupCodeParamsSchema);
var validateDevicePairRenameParams = lazyCompile(DevicePairRenameParamsSchema);
var validateDeviceTokenRotateParams = lazyCompile(DeviceTokenRotateParamsSchema);
var validateDeviceTokenRevokeParams = lazyCompile(DeviceTokenRevokeParamsSchema);
var validateApprovalPresentation = lazyCompile(ApprovalPresentationSchema);
var validateApprovalGetParams = lazyCompile(ApprovalGetParamsSchema);
var validateApprovalHistoryParams = lazyCompile(ApprovalHistoryParamsSchema);
var validateApprovalResolveParams = lazyCompile(ApprovalResolveParamsSchema);
var validateExecApprovalsGetParams = lazyCompile(ExecApprovalsGetParamsSchema);
var validateExecApprovalsSetParams = lazyCompile(ExecApprovalsSetParamsSchema);
var validateExecApprovalGetParams = lazyCompile(ExecApprovalGetParamsSchema);
var validateExecApprovalRequestParams = lazyCompile(ExecApprovalRequestParamsSchema);
var validateExecApprovalResolveParams = lazyCompile(ExecApprovalResolveParamsSchema);
var validateQuestionRequestParams = lazyCompile(QuestionRequestParamsSchema);
var validateQuestionWaitAnswerParams = lazyCompile(QuestionWaitAnswerParamsSchema);
var validateQuestionResolveParams = lazyCompile(QuestionResolveParamsSchema);
var validateQuestionGetParams = lazyCompile(QuestionGetParamsSchema);
var validateQuestionListParams = lazyCompile(QuestionListParamsSchema);
var validatePluginApprovalRequestParams = lazyCompile(PluginApprovalRequestParamsSchema);
var validatePluginApprovalResolveParams = lazyCompile(PluginApprovalResolveParamsSchema);
var validatePluginsListParams = lazyCompile(PluginsListParamsSchema);
var validatePluginsRefreshParams = lazyCompile(PluginsRefreshParamsSchema);
var validatePluginsSearchParams = lazyCompile(PluginsSearchParamsSchema);
var validatePluginsInstallParams = lazyCompile(PluginsInstallParamsSchema);
var validatePluginsSetEnabledParams = lazyCompile(PluginsSetEnabledParamsSchema);
var validatePluginsUninstallParams = lazyCompile(PluginsUninstallParamsSchema);
var validatePluginsUiDescriptorsParams = lazyCompile(PluginsUiDescriptorsParamsSchema);
var validatePluginsUiDescriptorsResult = lazyCompile(PluginsUiDescriptorsResultSchema);
var validatePluginsSessionActionParams = lazyCompile(PluginsSessionActionParamsSchema);
var validatePluginsSessionActionResult = lazyCompile(PluginsSessionActionResultSchema);
var validateExecApprovalsNodeGetParams = lazyCompile(ExecApprovalsNodeGetParamsSchema);
var validateExecApprovalsNodeSetParams = lazyCompile(ExecApprovalsNodeSetParamsSchema);
var validateExecApprovalsNodeSnapshot = lazyCompile(ExecApprovalsNodeSnapshotSchema);
var validateLogsTailParams = lazyCompile(LogsTailParamsSchema);
var validateModelsProbeParams = lazyCompile(ModelsProbeParamsSchema);
var validateChatHistoryParams = lazyCompile(ChatHistoryParamsSchema);
var validateChatMetadataParams = lazyCompile(ChatMetadataParamsSchema);
var validateChatMessageGetParams = lazyCompile(ChatMessageGetParamsSchema);
var validateChatToolTitlesParams = lazyCompile(ChatToolTitlesParamsSchema);
var validateChatSendParams = lazyCompile(ChatSendParamsSchema);
var validateChatAbortParams = lazyCompile(ChatAbortParamsSchema);
var validateChatInjectParams = lazyCompile(ChatInjectParamsSchema);
var validateUpdateStatusParams = lazyCompile(UpdateStatusParamsSchema);
var validateUpdateRunParams = lazyCompile(UpdateRunParamsSchema);
var validateUiCommandParams = lazyCompile(UiCommandParamsSchema);
var validateWebLoginStartParams = lazyCompile(WebLoginStartParamsSchema);
var validateWebLoginWaitParams = lazyCompile(WebLoginWaitParamsSchema);
export {
  AgentEventSchema,
  AgentIdentityParamsSchema,
  AgentIdentityResultSchema,
  AgentParamsSchema,
  AgentSummarySchema,
  AgentsCreateParamsSchema,
  AgentsCreateResultSchema,
  AgentsDeleteParamsSchema,
  AgentsDeleteResultSchema,
  AgentsFileEntrySchema,
  AgentsFilesGetParamsSchema,
  AgentsFilesGetResultSchema,
  AgentsFilesListParamsSchema,
  AgentsFilesListResultSchema,
  AgentsFilesSetParamsSchema,
  AgentsFilesSetResultSchema,
  AgentsListParamsSchema,
  AgentsListResultSchema,
  AgentsUpdateParamsSchema,
  AgentsUpdateResultSchema,
  AgentsWorkspaceEntrySchema,
  AgentsWorkspaceFileSchema,
  AgentsWorkspaceGetParamsSchema,
  AgentsWorkspaceGetResultSchema,
  AgentsWorkspaceListParamsSchema,
  AgentsWorkspaceListResultSchema,
  AllowedApprovalSnapshotSchema,
  ApprovalAllowDecisionSchema,
  ApprovalDecisionSchema,
  ApprovalGetParamsSchema,
  ApprovalGetResultSchema,
  ApprovalHistoryParamsSchema,
  ApprovalHistoryResultSchema,
  ApprovalKindSchema,
  ApprovalPresentationSchema,
  ApprovalResolveParamsSchema,
  ApprovalResolveResultSchema,
  ApprovalSnapshotSchema,
  ApprovalTerminalReasonSchema,
  ArtifactSummarySchema,
  ArtifactsDownloadParamsSchema,
  ArtifactsGetParamsSchema,
  ArtifactsListParamsSchema,
  AuditActivityAgentRunV1Schema,
  AuditActivityEventV1Schema,
  AuditActivityInboundMessageV1Schema,
  AuditActivityListParamsSchema,
  AuditActivityListResultSchema,
  AuditActivityOutboundMessageV1Schema,
  AuditActivityToolActionV1Schema,
  AuditEventSchema,
  AuditListParamsSchema,
  AuditListResultSchema,
  AuthProbeStatusSchema,
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
  BoardWidgetSchema,
  CancelledApprovalSnapshotSchema,
  ChannelsLogoutParamsSchema,
  ChannelsStartParamsSchema,
  ChannelsStatusParamsSchema,
  ChannelsStatusResultSchema,
  ChannelsStopParamsSchema,
  ChatEventSchema,
  ChatHistoryParamsSchema,
  ChatInjectParamsSchema,
  ChatMetadataParamsSchema,
  ChatSendParamsSchema,
  ChatToolTitlesParamsSchema,
  ChatToolTitlesResultSchema,
  ClawHubTrustErrorCodes,
  CommandsListParamsSchema,
  CommandsListResultSchema,
  ConfigApplyParamsSchema,
  ConfigGetParamsSchema,
  ConfigPatchParamsSchema,
  ConfigSchemaLookupParamsSchema,
  ConfigSchemaLookupResultSchema,
  ConfigSchemaParamsSchema,
  ConfigSchemaResponseSchema,
  ConfigSetParamsSchema,
  ConnectParamsSchema,
  ConversationListItemSchema,
  ConversationListParamsSchema,
  ConversationListResultSchema,
  ConversationSendParamsSchema,
  ConversationSendResultSchema,
  ConversationTurnCancelParamsSchema,
  ConversationTurnCancelResultSchema,
  ConversationTurnParamsSchema,
  ConversationTurnReplySchema,
  ConversationTurnResultSchema,
  CronAddParamsSchema,
  CronAddResultSchema,
  CronDeclarativeAddResultSchema,
  CronGetParamsSchema,
  CronJobSchema,
  CronListParamsSchema,
  CronRemoveParamsSchema,
  CronRunParamsSchema,
  CronRunsParamsSchema,
  CronStatusParamsSchema,
  CronUpdateParamsSchema,
  DeniedApprovalSnapshotSchema,
  EnvironmentStatusSchema,
  EnvironmentSummarySchema,
  EnvironmentsCreateParamsSchema,
  EnvironmentsCreateResultSchema,
  EnvironmentsDestroyParamsSchema,
  EnvironmentsDestroyResultSchema,
  EnvironmentsListParamsSchema,
  EnvironmentsListResultSchema,
  EnvironmentsStatusParamsSchema,
  EnvironmentsStatusResultSchema,
  ErrorCodes,
  ErrorShapeSchema,
  EventFrameSchema,
  ExecApprovalGetParamsSchema,
  ExecApprovalPresentationSchema,
  ExecApprovalRequestParamsSchema,
  ExecApprovalResolveParamsSchema,
  ExecApprovalsGetParamsSchema,
  ExecApprovalsSetParamsSchema,
  ExpiredApprovalSnapshotSchema,
  FsDirEntrySchema,
  FsListDirParamsSchema,
  FsListDirResultSchema,
  GATEWAY_SERVER_CAPS,
  GatewayErrorDetailCodes,
  GatewayErrorDetailsSchema,
  GatewayFrameSchema,
  GatewaySuspendBlockerSchema,
  GatewaySuspendPrepareBusyResultSchema,
  GatewaySuspendPrepareParamsSchema,
  GatewaySuspendPrepareReadyResultSchema,
  GatewaySuspendPrepareResultSchema,
  GatewaySuspendResumeParamsSchema,
  GatewaySuspendResumeResultSchema,
  GatewaySuspendStatusParamsSchema,
  GatewaySuspendStatusReadyResultSchema,
  GatewaySuspendStatusResultSchema,
  GatewaySuspendStatusRunningResultSchema,
  GatewaySuspendTaskBlockerSchema,
  HelloOkSchema,
  LogsTailParamsSchema,
  LogsTailResultSchema,
  MAX_MEMORY_MIGRATION_ITEMS,
  MIN_CLIENT_PROTOCOL_VERSION,
  MIN_NODE_PROTOCOL_VERSION,
  MIN_PROBE_PROTOCOL_VERSION,
  MessageActionParamsSchema,
  MigrationProtocolSchemas,
  MigrationsMemoryApplyParamsSchema,
  MigrationsMemoryPlanParamsSchema,
  MissingScopeErrorDetailsSchema,
  ModelsListParamsSchema,
  ModelsProbeParamsSchema,
  ModelsProbeResultSchema,
  ModelsProbeTargetResultSchema,
  NodeEventResultSchema,
  NodeInvokeInputEventSchema,
  NodeInvokeParamsSchema,
  NodeInvokeProgressParamsSchema,
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
  NodeSkillDescriptorSchema,
  NodeSkillsUpdateParamsSchema,
  PROTOCOL_VERSION,
  PendingApprovalSnapshotSchema,
  PluginApprovalPresentationSchema,
  PluginApprovalSeveritySchema,
  PluginCatalogEntrySchema,
  PluginCatalogInstallActionSchema,
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
  PluginsSessionActionParamsSchema,
  PluginsSessionActionResultSchema,
  PluginsSetEnabledParamsSchema,
  PluginsSetEnabledResultSchema,
  PluginsUiDescriptorsParamsSchema,
  PluginsUiDescriptorsResultSchema,
  PluginsUninstallParamsSchema,
  PluginsUninstallResultSchema,
  PollParamsSchema,
  PresenceEntrySchema,
  PushTestParamsSchema,
  PushTestResultSchema,
  QuestionAnswersSchema,
  QuestionGetParamsSchema,
  QuestionGetResultSchema,
  QuestionListParamsSchema,
  QuestionListResultSchema,
  QuestionOptionSchema,
  QuestionRecordSchema,
  QuestionRequestParamsSchema,
  QuestionRequestQuestionSchema,
  QuestionRequestResultSchema,
  QuestionRequestedEventSchema,
  QuestionResolveParamsSchema,
  QuestionResolveResultSchema,
  QuestionResolvedEventSchema,
  QuestionSchema,
  QuestionStatusSchema,
  QuestionWaitAnswerParamsSchema,
  QuestionWaitAnswerResultSchema,
  RequestFrameSchema,
  ResponseFrameSchema,
  SESSION_AGENT_ATTENTION_ICON_IDS,
  SendParamsSchema,
  SessionApprovalEventSchema,
  SessionApprovalReplaySchema,
  SessionBranchSchema,
  SessionCatalogCapabilitiesSchema,
  SessionCatalogDescriptorSchema,
  SessionCatalogHostSchema,
  SessionCatalogLocatorSchema,
  SessionCatalogSchema,
  SessionCatalogSessionSchema,
  SessionCatalogTranscriptItemSchema,
  SessionDiffFileSchema,
  SessionDiffFileStatusSchema,
  SessionDiscussionInfoParamsSchema,
  SessionDiscussionInfoResultSchema,
  SessionDiscussionInfoSchema,
  SessionDiscussionOpenParamsSchema,
  SessionDiscussionOpenResultSchema,
  SessionDiscussionStateSchema,
  SessionFileBrowserEntrySchema,
  SessionFileBrowserResultSchema,
  SessionFileEntrySchema,
  SessionFileKindSchema,
  SessionFileRelevanceSchema,
  SessionGroupSchema,
  SessionPlacementSchema,
  SessionPlacementStateSchema,
  SessionWorktreeInfoSchema,
  SessionsAbortParamsSchema,
  SessionsBranchesListParamsSchema,
  SessionsBranchesListResultSchema,
  SessionsBranchesSwitchParamsSchema,
  SessionsBranchesSwitchResultSchema,
  SessionsCatalogArchiveParamsSchema,
  SessionsCatalogArchiveResultSchema,
  SessionsCatalogContinueParamsSchema,
  SessionsCatalogContinueResultSchema,
  SessionsCatalogHostEventSchema,
  SessionsCatalogListParamsSchema,
  SessionsCatalogListResultSchema,
  SessionsCatalogReadParamsSchema,
  SessionsCatalogReadResultSchema,
  SessionsCleanupParamsSchema,
  SessionsCompactParamsSchema,
  SessionsCompactionBranchParamsSchema,
  SessionsCompactionGetParamsSchema,
  SessionsCompactionListParamsSchema,
  SessionsCompactionRestoreParamsSchema,
  SessionsCreateParamsSchema,
  SessionsCreateResultSchema,
  SessionsDeleteParamsSchema,
  SessionsDescribeParamsSchema,
  SessionsDiffParamsSchema,
  SessionsDiffResultSchema,
  SessionsDispatchParamsSchema,
  SessionsDispatchResultSchema,
  SessionsFilesGetParamsSchema,
  SessionsFilesGetResultSchema,
  SessionsFilesListParamsSchema,
  SessionsFilesListResultSchema,
  SessionsFilesRevealParamsSchema,
  SessionsFilesRevealResultSchema,
  SessionsFilesSetParamsSchema,
  SessionsFilesSetResultSchema,
  SessionsForkParamsSchema,
  SessionsForkResultSchema,
  SessionsGroupsDeleteParamsSchema,
  SessionsGroupsListParamsSchema,
  SessionsGroupsListResultSchema,
  SessionsGroupsMutationResultSchema,
  SessionsGroupsPutParamsSchema,
  SessionsGroupsRenameParamsSchema,
  SessionsListParamsSchema,
  SessionsPatchParamsSchema,
  SessionsPluginPatchParamsSchema,
  SessionsPreviewParamsSchema,
  SessionsReclaimParamsSchema,
  SessionsReclaimResultSchema,
  SessionsResetParamsSchema,
  SessionsResolveParamsSchema,
  SessionsRewindParamsSchema,
  SessionsRewindResultSchema,
  SessionsSearchHitSchema,
  SessionsSearchParamsSchema,
  SessionsSearchResultSchema,
  SessionsSendParamsSchema,
  SessionsUsageParamsSchema,
  ShutdownEventSchema,
  SkillsCuratorActionParamsSchema,
  SkillsCuratorActionResultSchema,
  SkillsCuratorStatusParamsSchema,
  SkillsCuratorStatusResultSchema,
  SkillsDetailParamsSchema,
  SkillsDetailResultSchema,
  SkillsInstallParamsSchema,
  SkillsProposalActionParamsSchema,
  SkillsProposalApplyResultSchema,
  SkillsProposalCreateParamsSchema,
  SkillsProposalHistoryScanParamsSchema,
  SkillsProposalHistoryScanResultSchema,
  SkillsProposalHistoryStatusParamsSchema,
  SkillsProposalInspectParamsSchema,
  SkillsProposalInspectResultSchema,
  SkillsProposalRecordResultSchema,
  SkillsProposalRequestRevisionParamsSchema,
  SkillsProposalRequestRevisionResultSchema,
  SkillsProposalReviseParamsSchema,
  SkillsProposalUpdateParamsSchema,
  SkillsProposalsListParamsSchema,
  SkillsProposalsListResultSchema,
  SkillsSearchParamsSchema,
  SkillsSearchResultSchema,
  SkillsSecurityVerdictsParamsSchema,
  SkillsSecurityVerdictsResultSchema,
  SkillsSkillCardParamsSchema,
  SkillsSkillCardResultSchema,
  SkillsStatusParamsSchema,
  SkillsUpdateParamsSchema,
  SkillsUploadBeginParamsSchema,
  SkillsUploadChunkParamsSchema,
  SkillsUploadCommitParamsSchema,
  SnapshotSchema,
  StateVersionSchema,
  SystemAgentChatHistoryParamsSchema,
  SystemAgentChatHistoryResultSchema,
  SystemAgentChatHistoryTurnSchema,
  SystemAgentChatParamsSchema,
  SystemAgentChatQuestionSchema,
  SystemAgentChatResultSchema,
  SystemAgentErrorDetailCodes,
  SystemAgentSetupActivateParamsSchema,
  SystemAgentSetupActivateResultSchema,
  SystemAgentSetupAuthStartParamsSchema,
  SystemAgentSetupAuthStartResultSchema,
  SystemAgentSetupDetectParamsSchema,
  SystemAgentSetupDetectResultSchema,
  SystemAgentSetupVerifyParamsSchema,
  SystemAgentSetupVerifyResultSchema,
  SystemChangeEntrySchema,
  SystemChangeKindSchema,
  SystemChangeSourceSchema,
  SystemChangesListParamsSchema,
  SystemChangesListResultSchema,
  SystemInfoParamsSchema,
  SystemInfoResultSchema,
  TalkAgentControlResultSchema,
  TalkCatalogParamsSchema,
  TalkCatalogResultSchema,
  TalkClientCloseParamsSchema,
  TalkClientCreateParamsSchema,
  TalkClientCreateResultSchema,
  TalkClientMutationResultSchema,
  TalkClientSteerParamsSchema,
  TalkClientToolCallParamsSchema,
  TalkClientToolCallResultSchema,
  TalkClientTranscriptParamsSchema,
  TalkConfigParamsSchema,
  TalkConfigResultSchema,
  TalkEventSchema,
  TalkSessionAcknowledgeMarkParamsSchema,
  TalkSessionAppendAudioParamsSchema,
  TalkSessionCancelOutputParamsSchema,
  TalkSessionCancelTurnParamsSchema,
  TalkSessionCloseParamsSchema,
  TalkSessionCreateParamsSchema,
  TalkSessionCreateResultSchema,
  TalkSessionJoinParamsSchema,
  TalkSessionJoinResultSchema,
  TalkSessionOkResultSchema,
  TalkSessionSteerParamsSchema,
  TalkSessionSubmitToolResultParamsSchema,
  TalkSessionTurnParamsSchema,
  TalkSessionTurnResultSchema,
  TalkSpeakParamsSchema,
  TalkSpeakResultSchema,
  TaskSuggestionEventSchema,
  TaskSuggestionResolutionSchema,
  TaskSuggestionSchema,
  TaskSuggestionsAcceptParamsSchema,
  TaskSuggestionsAcceptResultSchema,
  TaskSuggestionsCreateParamsSchema,
  TaskSuggestionsCreateResultSchema,
  TaskSuggestionsDismissParamsSchema,
  TaskSuggestionsDismissResultSchema,
  TaskSuggestionsListParamsSchema,
  TaskSuggestionsListResultSchema,
  TaskSummarySchema,
  TasksCancelParamsSchema,
  TasksCancelResultSchema,
  TasksGetParamsSchema,
  TasksGetResultSchema,
  TasksListParamsSchema,
  TasksListResultSchema,
  TerminalAckResultSchema,
  TerminalApprovalSnapshotSchema,
  TerminalAttachParamsSchema,
  TerminalAttachResultSchema,
  TerminalCloseParamsSchema,
  TerminalDataEventSchema,
  TerminalEventSchema,
  TerminalExitEventSchema,
  TerminalInputParamsSchema,
  TerminalListResultSchema,
  TerminalOpenParamsSchema,
  TerminalOpenResultSchema,
  TerminalResizeParamsSchema,
  TerminalSessionInfoSchema,
  TerminalTextParamsSchema,
  TerminalTextResultSchema,
  TerminalUploadParamsSchema,
  TerminalUploadResultSchema,
  TickEventSchema,
  ToolsCatalogParamsSchema,
  ToolsEffectiveParamsSchema,
  ToolsInvokeParamsSchema,
  TtsSpeakParamsSchema,
  TtsSpeakResultSchema,
  UiClosePaneCommandSchema,
  UiCommandParamsSchema,
  UiCommandResultSchema,
  UiCommandSchema,
  UiFocusCommandSchema,
  UiNavigateCommandSchema,
  UiPanelCommandSchema,
  UiSidebarCommandSchema,
  UiSplitCommandSchema,
  UpdateRunParamsSchema,
  UpdateStatusParamsSchema,
  UserProfileSchema,
  UsersLinkEmailParamsSchema,
  UsersLinkEmailResultSchema,
  UsersListParamsSchema,
  UsersListResultSchema,
  UsersSelfParamsSchema,
  UsersSelfResultSchema,
  UsersSetAvatarParamsSchema,
  UsersSetAvatarResultSchema,
  UsersSetDisplayNameParamsSchema,
  UsersSetDisplayNameResultSchema,
  WORKER_HEARTBEAT_INTERVAL_MS,
  WORKER_INFERENCE_MAX_CONTEXT_MESSAGES,
  WORKER_INFERENCE_MAX_OUTPUT_TOKENS,
  WORKER_INFERENCE_METHODS,
  WORKER_INFERENCE_PROTOCOL_FEATURE,
  WORKER_LIVE_EVENT_PROTOCOL_FEATURE,
  WORKER_PROTOCOL_FEATURES,
  WORKER_PROTOCOL_MAX_FEATURES,
  WORKER_PROTOCOL_MAX_FEATURE_LENGTH,
  WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH,
  WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH,
  WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES,
  WORKER_PROTOCOL_MAX_METHOD_LENGTH,
  WORKER_PROTOCOL_MAX_PAYLOAD_BYTES,
  WORKER_PROTOCOL_METHODS,
  WORKER_RPC_SET_VERSION,
  WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE,
  WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES,
  WORKER_TRANSCRIPT_MAX_CONTENT_PARTS,
  WORKER_TRANSCRIPT_MAX_JSON_DEPTH,
  WakeParamsSchema,
  WebLoginStartParamsSchema,
  WebLoginWaitParamsSchema,
  WebPushSubscribeParamsSchema,
  WebPushTestParamsSchema,
  WebPushUnsubscribeParamsSchema,
  WebPushVapidPublicKeyParamsSchema,
  WizardCancelParamsSchema,
  WizardNextParamsSchema,
  WizardNextResultSchema,
  WizardStartParamsSchema,
  WizardStartResultSchema,
  WizardStatusParamsSchema,
  WizardStatusResultSchema,
  WizardStepSchema,
  WorkerAdmissionFailureReasonSchema,
  WorkerAdmissionHandshakeSchema,
  WorkerAdmissionResponseFrameSchema,
  WorkerConnectRequestFrameSchema,
  WorkerEnvironmentMetadataSchema,
  WorkerEnvironmentStateSchema,
  WorkerHeartbeatParamsSchema,
  WorkerHeartbeatRequestFrameSchema,
  WorkerHeartbeatResponseFrameSchema,
  WorkerInferenceCancelRequestFrameSchema,
  WorkerInferenceCancelResponseFrameSchema,
  WorkerInferenceModelRefSchema,
  WorkerInferenceOptionsSchema,
  WorkerInferenceStartRequestFrameSchema,
  WorkerInferenceStartResponseFrameSchema,
  WorkerLiveEventErrorDetailsSchema,
  WorkerLiveEventErrorShapeSchema,
  WorkerLiveEventParamsSchema,
  WorkerLiveEventRequestFrameSchema,
  WorkerLiveEventResponseFrameSchema,
  WorkerLiveEventResultSchema,
  WorkerLiveEventSchema,
  WorkerProtocolCloseReasonSchema,
  WorkerTranscriptCommitErrorReasonSchema,
  WorkerTranscriptCommitErrorShapeSchema,
  WorkerTranscriptCommitParamsSchema,
  WorkerTranscriptCommitRequestFrameSchema,
  WorkerTranscriptCommitResponseFrameSchema,
  WorkerTranscriptCommitResultSchema,
  WorkerTranscriptMessageSchema,
  WorkerTunnelStatusSchema,
  WorktreeBranchSchema,
  WorktreeRecordSchema,
  WorktreesBranchesParamsSchema,
  WorktreesBranchesResultSchema,
  WorktreesCreateParamsSchema,
  WorktreesGcParamsSchema,
  WorktreesGcResultSchema,
  WorktreesListParamsSchema,
  WorktreesListResultSchema,
  WorktreesRemoveParamsSchema,
  WorktreesRemoveResultSchema,
  WorktreesRestoreParamsSchema,
  buildClawHubTrustErrorDetails,
  buildMissingScopeErrorDetails,
  buildSystemAgentSessionInvalidatedErrorDetails,
  errorShape,
  formatValidationErrors,
  isClawHubTrustErrorCode,
  isCloudWorkerPlacementState,
  isMcpAppViewExpiredError,
  isWellFormedApprovalId,
  missingScopeErrorShape,
  normalizeSessionIconInput,
  parseSessionIcon,
  readClawHubTrustErrorDetails,
  readMissingScopeError,
  readMissingScopeErrorDetails,
  readSystemAgentSessionInvalidatedErrorDetails,
  validateAgentIdentityParams,
  validateAgentParams,
  validateAgentWaitParams,
  validateAgentsCreateParams,
  validateAgentsDeleteParams,
  validateAgentsFilesGetParams,
  validateAgentsFilesListParams,
  validateAgentsFilesSetParams,
  validateAgentsListParams,
  validateAgentsUpdateParams,
  validateAgentsWorkspaceGetParams,
  validateAgentsWorkspaceListParams,
  validateApprovalGetParams,
  validateApprovalGetResult,
  validateApprovalHistoryParams,
  validateApprovalHistoryResult,
  validateApprovalPresentation,
  validateApprovalResolveParams,
  validateApprovalResolveResult,
  validateArtifactsDownloadParams,
  validateArtifactsGetParams,
  validateArtifactsListParams,
  validateAuditActivityListParams,
  validateAuditListParams,
  validateBoardActionParams,
  validateBoardDataReadParams,
  validateBoardEventParams,
  validateBoardGetParams,
  validateBoardPromptAuthorizeParams,
  validateBoardUpdateParams,
  validateBoardWidgetAppViewParams,
  validateBoardWidgetContent,
  validateBoardWidgetGrantParams,
  validateBoardWidgetPutParams,
  validateChannelsLogoutParams,
  validateChannelsStartParams,
  validateChannelsStatusParams,
  validateChannelsStopParams,
  validateChatAbortParams,
  validateChatHistoryParams,
  validateChatInjectParams,
  validateChatMessageGetParams,
  validateChatMetadataParams,
  validateChatSendParams,
  validateChatToolTitlesParams,
  validateCommandsListParams,
  validateConfigApplyParams,
  validateConfigGetParams,
  validateConfigPatchParams,
  validateConfigSchemaLookupParams,
  validateConfigSchemaLookupResult,
  validateConfigSchemaParams,
  validateConfigSetParams,
  validateConnectParams,
  validateConversationListParams,
  validateConversationSendParams,
  validateConversationTurnCancelParams,
  validateConversationTurnParams,
  validateCronAddParams,
  validateCronGetParams,
  validateCronListParams,
  validateCronRemoveParams,
  validateCronRunParams,
  validateCronRunsParams,
  validateCronStatusParams,
  validateCronUpdateParams,
  validateDevicePairApproveParams,
  validateDevicePairListParams,
  validateDevicePairRejectParams,
  validateDevicePairRemoveParams,
  validateDevicePairRenameParams,
  validateDevicePairSetupCodeParams,
  validateDeviceTokenRevokeParams,
  validateDeviceTokenRotateParams,
  validateEnvironmentsCreateParams,
  validateEnvironmentsDestroyParams,
  validateEnvironmentsListParams,
  validateEnvironmentsStatusParams,
  validateExecApprovalGetParams,
  validateExecApprovalRequestParams,
  validateExecApprovalResolveParams,
  validateExecApprovalsGetParams,
  validateExecApprovalsNodeGetParams,
  validateExecApprovalsNodeSetParams,
  validateExecApprovalsNodeSnapshot,
  validateExecApprovalsSetParams,
  validateFsListDirParams,
  validateFsListDirResult,
  validateGatewaySuspendPrepareParams,
  validateGatewaySuspendResumeParams,
  validateGatewaySuspendStatusParams,
  validateLogsTailParams,
  validateMessageActionParams,
  validateMigrationsMemoryApplyParams,
  validateMigrationsMemoryPlanParams,
  validateModelsListParams,
  validateModelsProbeParams,
  validateNodeDescribeParams,
  validateNodeEventParams,
  validateNodeInvokeParams,
  validateNodeInvokeProgressParams,
  validateNodeInvokeResultParams,
  validateNodeListParams,
  validateNodePairApproveParams,
  validateNodePairListParams,
  validateNodePairRejectParams,
  validateNodePairRemoveParams,
  validateNodePendingAckParams,
  validateNodePendingDrainParams,
  validateNodePendingEnqueueParams,
  validateNodePluginToolsUpdateParams,
  validateNodePresenceActivityPayload,
  validateNodeRenameParams,
  validateNodeSkillsUpdateParams,
  validatePluginApprovalRequestParams,
  validatePluginApprovalResolveParams,
  validatePluginsInstallParams,
  validatePluginsListParams,
  validatePluginsRefreshParams,
  validatePluginsSearchParams,
  validatePluginsSessionActionParams,
  validatePluginsSessionActionResult,
  validatePluginsSetEnabledParams,
  validatePluginsUiDescriptorsParams,
  validatePluginsUiDescriptorsResult,
  validatePluginsUninstallParams,
  validatePollParams,
  validatePushTestParams,
  validateQuestionGetParams,
  validateQuestionListParams,
  validateQuestionRequestParams,
  validateQuestionResolveParams,
  validateQuestionWaitAnswerParams,
  validateRequestFrame,
  validateSecretsResolveParams,
  validateSecretsResolveResult,
  validateSendParams,
  validateSessionDiscussionInfoParams,
  validateSessionDiscussionInfoResult,
  validateSessionDiscussionOpenParams,
  validateSessionDiscussionOpenResult,
  validateSessionsAbortParams,
  validateSessionsBranchesListParams,
  validateSessionsBranchesSwitchParams,
  validateSessionsCatalogArchiveParams,
  validateSessionsCatalogContinueParams,
  validateSessionsCatalogListParams,
  validateSessionsCatalogReadParams,
  validateSessionsCleanupParams,
  validateSessionsCompactParams,
  validateSessionsCompactionBranchParams,
  validateSessionsCompactionGetParams,
  validateSessionsCompactionListParams,
  validateSessionsCompactionRestoreParams,
  validateSessionsCreateParams,
  validateSessionsDeleteParams,
  validateSessionsDescribeParams,
  validateSessionsDiffParams,
  validateSessionsDispatchParams,
  validateSessionsFilesGetParams,
  validateSessionsFilesListParams,
  validateSessionsFilesRevealParams,
  validateSessionsFilesSetParams,
  validateSessionsForkParams,
  validateSessionsGroupsDeleteParams,
  validateSessionsGroupsListParams,
  validateSessionsGroupsPutParams,
  validateSessionsGroupsRenameParams,
  validateSessionsListParams,
  validateSessionsMessagesSubscribeParams,
  validateSessionsMessagesUnsubscribeParams,
  validateSessionsPatchParams,
  validateSessionsPluginPatchParams,
  validateSessionsPreviewParams,
  validateSessionsReclaimParams,
  validateSessionsResetParams,
  validateSessionsResolveParams,
  validateSessionsRewindParams,
  validateSessionsSearchParams,
  validateSessionsSendParams,
  validateSessionsUsageParams,
  validateSkillsBinsParams,
  validateSkillsCuratorActionParams,
  validateSkillsCuratorStatusParams,
  validateSkillsDetailParams,
  validateSkillsInstallParams,
  validateSkillsProposalActionParams,
  validateSkillsProposalCreateParams,
  validateSkillsProposalHistoryScanParams,
  validateSkillsProposalHistoryStatusParams,
  validateSkillsProposalInspectParams,
  validateSkillsProposalRequestRevisionParams,
  validateSkillsProposalReviseParams,
  validateSkillsProposalUpdateParams,
  validateSkillsProposalsListParams,
  validateSkillsSearchParams,
  validateSkillsSecurityVerdictsParams,
  validateSkillsSkillCardParams,
  validateSkillsStatusParams,
  validateSkillsUpdateParams,
  validateSkillsUploadBeginParams,
  validateSkillsUploadChunkParams,
  validateSkillsUploadCommitParams,
  validateSystemAgentChatHistoryParams,
  validateSystemAgentChatParams,
  validateSystemAgentSetupActivateParams,
  validateSystemAgentSetupAuthStartParams,
  validateSystemAgentSetupDetectParams,
  validateSystemAgentSetupVerifyParams,
  validateSystemChangesListParams,
  validateSystemInfoParams,
  validateSystemInfoResult,
  validateTalkCatalogParams,
  validateTalkClientCloseParams,
  validateTalkClientCreateParams,
  validateTalkClientCreateResult,
  validateTalkClientMutationResult,
  validateTalkClientSteerParams,
  validateTalkClientToolCallParams,
  validateTalkClientToolCallResult,
  validateTalkClientTranscriptParams,
  validateTalkConfigParams,
  validateTalkConfigResult,
  validateTalkModeParams,
  validateTalkSessionAcknowledgeMarkParams,
  validateTalkSessionAppendAudioParams,
  validateTalkSessionCancelOutputParams,
  validateTalkSessionCancelTurnParams,
  validateTalkSessionCloseParams,
  validateTalkSessionCreateParams,
  validateTalkSessionJoinParams,
  validateTalkSessionSteerParams,
  validateTalkSessionSubmitToolResultParams,
  validateTalkSessionTurnParams,
  validateTalkSpeakParams,
  validateTaskSuggestionsAcceptParams,
  validateTaskSuggestionsCreateParams,
  validateTaskSuggestionsDismissParams,
  validateTaskSuggestionsListParams,
  validateTasksCancelParams,
  validateTasksGetParams,
  validateTasksListParams,
  validateTerminalAttachParams,
  validateTerminalCloseParams,
  validateTerminalInputParams,
  validateTerminalOpenParams,
  validateTerminalResizeParams,
  validateTerminalTextParams,
  validateTerminalUploadParams,
  validateTerminalUploadResult,
  validateToolsCatalogParams,
  validateToolsEffectiveParams,
  validateToolsInvokeParams,
  validateTtsSpeakParams,
  validateUiCommandParams,
  validateUpdateRunParams,
  validateUpdateStatusParams,
  validateUsersLinkEmailParams,
  validateUsersLinkEmailResult,
  validateUsersListParams,
  validateUsersSelfParams,
  validateUsersSelfResult,
  validateUsersSetAvatarParams,
  validateUsersSetAvatarResult,
  validateUsersSetDisplayNameParams,
  validateUsersSetDisplayNameResult,
  validateWakeParams,
  validateWebLoginStartParams,
  validateWebLoginWaitParams,
  validateWebPushSubscribeParams,
  validateWebPushTestParams,
  validateWebPushUnsubscribeParams,
  validateWebPushVapidPublicKeyParams,
  validateWizardCancelParams,
  validateWizardNextParams,
  validateWizardStartParams,
  validateWizardStatusParams,
  validateWorkerAdmissionHandshake,
  validateWorkerConnectRequestFrame,
  validateWorkerHeartbeatParams,
  validateWorkerInferenceCancelParams,
  validateWorkerInferenceEventFrame,
  validateWorkerInferenceStartParams,
  validateWorkerInferenceTerminalFrame,
  validateWorkerInferenceTerminalOutcome,
  validateWorkerLiveEventParams,
  validateWorkerTranscriptCommitParams,
  validateWorktreesBranchesParams,
  validateWorktreesCreateParams,
  validateWorktreesGcParams,
  validateWorktreesListParams,
  validateWorktreesRemoveParams,
  validateWorktreesRestoreParams
};
