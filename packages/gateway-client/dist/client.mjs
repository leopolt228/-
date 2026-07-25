// packages/gateway-client/src/client.ts
import { randomUUID } from "node:crypto";

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
var GATEWAY_CLIENT_NAMES = GATEWAY_CLIENT_IDS;
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

// packages/gateway-protocol/src/connect-error-details.ts
function normalizeOptionalString(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed || void 0;
}
function normalizeArrayBackedTrimmedStringList(value) {
  if (!Array.isArray(value)) {
    return void 0;
  }
  const values = value.map((entry) => normalizeOptionalString(entry)).filter((entry) => Boolean(entry));
  return values.length > 0 ? values : void 0;
}
var ConnectErrorDetailCodes = {
  AUTH_REQUIRED: "AUTH_REQUIRED",
  AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  AUTH_TOKEN_MISSING: "AUTH_TOKEN_MISSING",
  AUTH_TOKEN_MISMATCH: "AUTH_TOKEN_MISMATCH",
  AUTH_TOKEN_NOT_CONFIGURED: "AUTH_TOKEN_NOT_CONFIGURED",
  AUTH_PASSWORD_MISSING: "AUTH_PASSWORD_MISSING",
  // pragma: allowlist secret
  AUTH_PASSWORD_MISMATCH: "AUTH_PASSWORD_MISMATCH",
  // pragma: allowlist secret
  AUTH_PASSWORD_NOT_CONFIGURED: "AUTH_PASSWORD_NOT_CONFIGURED",
  // pragma: allowlist secret
  AUTH_BOOTSTRAP_TOKEN_INVALID: "AUTH_BOOTSTRAP_TOKEN_INVALID",
  AUTH_DEVICE_TOKEN_MISMATCH: "AUTH_DEVICE_TOKEN_MISMATCH",
  AUTH_SCOPE_MISMATCH: "AUTH_SCOPE_MISMATCH",
  AUTH_RATE_LIMITED: "AUTH_RATE_LIMITED",
  AUTH_TAILSCALE_IDENTITY_MISSING: "AUTH_TAILSCALE_IDENTITY_MISSING",
  AUTH_TAILSCALE_PROXY_MISSING: "AUTH_TAILSCALE_PROXY_MISSING",
  AUTH_TAILSCALE_WHOIS_FAILED: "AUTH_TAILSCALE_WHOIS_FAILED",
  AUTH_TAILSCALE_IDENTITY_MISMATCH: "AUTH_TAILSCALE_IDENTITY_MISMATCH",
  CONTROL_UI_ORIGIN_NOT_ALLOWED: "CONTROL_UI_ORIGIN_NOT_ALLOWED",
  PROTOCOL_MISMATCH: "PROTOCOL_MISMATCH",
  CONTROL_UI_DEVICE_IDENTITY_REQUIRED: "CONTROL_UI_DEVICE_IDENTITY_REQUIRED",
  DEVICE_IDENTITY_REQUIRED: "DEVICE_IDENTITY_REQUIRED",
  DEVICE_AUTH_INVALID: "DEVICE_AUTH_INVALID",
  DEVICE_AUTH_DEVICE_ID_MISMATCH: "DEVICE_AUTH_DEVICE_ID_MISMATCH",
  DEVICE_AUTH_SIGNATURE_EXPIRED: "DEVICE_AUTH_SIGNATURE_EXPIRED",
  DEVICE_AUTH_NONCE_REQUIRED: "DEVICE_AUTH_NONCE_REQUIRED",
  DEVICE_AUTH_NONCE_MISMATCH: "DEVICE_AUTH_NONCE_MISMATCH",
  DEVICE_AUTH_SIGNATURE_INVALID: "DEVICE_AUTH_SIGNATURE_INVALID",
  DEVICE_AUTH_PUBLIC_KEY_INVALID: "DEVICE_AUTH_PUBLIC_KEY_INVALID",
  PAIRING_REQUIRED: "PAIRING_REQUIRED",
  CLIENT_VERSION_MISMATCH: "CLIENT_VERSION_MISMATCH"
};
var ConnectPairingRequiredReasons = {
  NOT_PAIRED: "not-paired",
  ROLE_UPGRADE: "role-upgrade",
  SCOPE_UPGRADE: "scope-upgrade",
  METADATA_UPGRADE: "metadata-upgrade"
};
var CONNECT_RECOVERY_NEXT_STEP_VALUES = /* @__PURE__ */ new Set([
  "retry_with_device_token",
  "update_auth_configuration",
  "update_auth_credentials",
  "wait_then_retry",
  "review_auth_configuration"
]);
var CONNECT_PAIRING_REQUIRED_REASON_VALUES = /* @__PURE__ */ new Set([
  "not-paired",
  "role-upgrade",
  "scope-upgrade",
  "metadata-upgrade"
]);
var PAIRING_CONNECT_REQUEST_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
var PAIRING_CONNECT_REASON_METADATA = {
  "not-paired": {
    requirement: "device is not approved yet",
    remediationHint: "Approve this device from the pending pairing requests.",
    recoveryTitle: "Gateway pairing approval required."
  },
  "role-upgrade": {
    requirement: "device is asking for a higher role than currently approved",
    remediationHint: "Review the requested role upgrade, then approve the pending request.",
    recoveryTitle: "Gateway role upgrade approval required."
  },
  "scope-upgrade": {
    requirement: "device is asking for more scopes than currently approved",
    remediationHint: "Review the requested scopes, then approve the pending upgrade.",
    recoveryTitle: "Gateway scope upgrade approval required."
  },
  "metadata-upgrade": {
    requirement: "device identity changed and must be re-approved",
    remediationHint: "Review the refreshed device details, then approve the pending request.",
    recoveryTitle: "Gateway device refresh approval required."
  }
};
var CONNECT_PAIRING_REQUIRED_MESSAGE_BY_REASON = {
  "not-paired": "device pairing required",
  "role-upgrade": "role upgrade pending approval",
  "scope-upgrade": "scope upgrade pending approval",
  "metadata-upgrade": "device metadata change pending approval"
};
function readConnectErrorDetailCode(details) {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return null;
  }
  const code = details.code;
  return typeof code === "string" && code.trim().length > 0 ? code.trim() : null;
}
function readConnectErrorRecoveryAdvice(details) {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return {};
  }
  const raw = details;
  const canRetryWithDeviceToken = typeof raw.canRetryWithDeviceToken === "boolean" ? raw.canRetryWithDeviceToken : void 0;
  const normalizedNextStep = normalizeOptionalString(raw.recommendedNextStep) ?? "";
  const recommendedNextStep = CONNECT_RECOVERY_NEXT_STEP_VALUES.has(
    normalizedNextStep
  ) ? normalizedNextStep : void 0;
  return {
    canRetryWithDeviceToken,
    recommendedNextStep
  };
}
function normalizePairingConnectReason(value) {
  const normalized2 = normalizeOptionalString(value) ?? "";
  return CONNECT_PAIRING_REQUIRED_REASON_VALUES.has(normalized2) ? normalized2 : void 0;
}
function normalizePairingConnectRequestId(value) {
  const normalized2 = normalizeOptionalString(value);
  return normalized2 && PAIRING_CONNECT_REQUEST_ID_PATTERN.test(normalized2) ? normalized2 : void 0;
}
function normalizeStringArray(value) {
  return normalizeArrayBackedTrimmedStringList(value);
}
function createPairingConnectErrorDetails(params) {
  return {
    code: ConnectErrorDetailCodes.PAIRING_REQUIRED,
    ...params.reason ? { reason: params.reason } : {},
    ...params.requestId ? { requestId: params.requestId } : {},
    ...params.remediationHint ? { remediationHint: params.remediationHint } : {},
    ...params.recommendedNextStep ? { recommendedNextStep: params.recommendedNextStep } : {},
    ...params.retryable !== void 0 ? { retryable: params.retryable } : {},
    ...params.pauseReconnect !== void 0 ? { pauseReconnect: params.pauseReconnect } : {},
    ...params.deviceId ? { deviceId: params.deviceId } : {},
    ...params.requestedRole ? { requestedRole: params.requestedRole } : {},
    ...params.requestedScopes ? { requestedScopes: params.requestedScopes } : {},
    ...params.approvedRoles ? { approvedRoles: params.approvedRoles } : {},
    ...params.approvedScopes ? { approvedScopes: params.approvedScopes } : {}
  };
}
function buildPairingConnectRemediationHint(reason) {
  return reason ? PAIRING_CONNECT_REASON_METADATA[reason].remediationHint : "Approve the pending device request before retrying.";
}
function readPairingConnectErrorDetails(details) {
  if (readConnectErrorDetailCode(details) !== ConnectErrorDetailCodes.PAIRING_REQUIRED) {
    return null;
  }
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return null;
  }
  const raw = details;
  const reason = normalizePairingConnectReason(raw.reason);
  const requestId = normalizePairingConnectRequestId(raw.requestId);
  const remediationHint = normalizeOptionalString(raw.remediationHint) ?? buildPairingConnectRemediationHint(reason);
  const normalizedNextStep = normalizeOptionalString(raw.recommendedNextStep) ?? "";
  const recommendedNextStep = CONNECT_RECOVERY_NEXT_STEP_VALUES.has(
    normalizedNextStep
  ) ? normalizedNextStep : void 0;
  const deviceId = normalizeOptionalString(raw.deviceId);
  const requestedRole = normalizeOptionalString(raw.requestedRole);
  const requestedScopes = normalizeStringArray(raw.requestedScopes);
  const approvedRoles = normalizeStringArray(raw.approvedRoles);
  const approvedScopes = normalizeStringArray(raw.approvedScopes);
  return createPairingConnectErrorDetails({
    reason,
    requestId,
    remediationHint,
    recommendedNextStep,
    retryable: typeof raw.retryable === "boolean" ? raw.retryable : void 0,
    pauseReconnect: typeof raw.pauseReconnect === "boolean" ? raw.pauseReconnect : void 0,
    deviceId,
    requestedRole,
    requestedScopes,
    approvedRoles,
    approvedScopes
  });
}
function formatConnectPairingRequiredMessage(details) {
  const pairing = readPairingConnectErrorDetails(details);
  const base = CONNECT_PAIRING_REQUIRED_MESSAGE_BY_REASON[pairing?.reason ?? ConnectPairingRequiredReasons.NOT_PAIRED];
  return pairing?.requestId ? `${base} (requestId: ${pairing.requestId})` : base;
}
function formatConnectErrorMessage(params) {
  if (readConnectErrorDetailCode(params.details) === ConnectErrorDetailCodes.PAIRING_REQUIRED) {
    return formatConnectPairingRequiredMessage(params.details);
  }
  if (readConnectErrorDetailCode(params.details) === ConnectErrorDetailCodes.PROTOCOL_MISMATCH) {
    return formatProtocolMismatchMessage(params.message, params.details);
  }
  return normalizeOptionalString(params.message) ?? "gateway request failed";
}
function formatProtocolMismatchMessage(message, details) {
  const raw = details;
  const clientMin = normalizeProtocolNumber(raw.clientMinProtocol);
  const clientMax = normalizeProtocolNumber(raw.clientMaxProtocol);
  const expected = normalizeProtocolNumber(raw.expectedProtocol);
  const probeMin = normalizeProtocolNumber(raw.minimumProbeProtocol);
  const parts = [];
  if (clientMin !== void 0 && clientMax !== void 0) {
    parts.push(
      clientMin === clientMax ? `Control UI v${clientMin}` : `Control UI v${clientMin}-v${clientMax}`
    );
  }
  if (expected !== void 0) {
    parts.push(`Gateway v${expected}`);
  }
  if (probeMin !== void 0) {
    parts.push(`probe min v${probeMin}`);
  }
  const normalized2 = normalizeOptionalString(message) ?? "protocol mismatch";
  return parts.length > 0 ? `${normalized2}: ${parts.join(", ")}` : normalized2;
}
function normalizeProtocolNumber(value) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}

// packages/gateway-protocol/src/startup-unavailable.ts
var GATEWAY_STARTUP_UNAVAILABLE_REASON = "startup-sidecars";
var GATEWAY_STARTUP_RETRY_AFTER_MS = 500;
var GATEWAY_STARTUP_RETRY_MIN_MS = 100;
var GATEWAY_STARTUP_RETRY_MAX_MS = 2e3;
function isGatewayStartupUnavailableDetails(details) {
  return typeof details === "object" && details !== null && details.reason === GATEWAY_STARTUP_UNAVAILABLE_REASON;
}
function isRetryableGatewayStartupUnavailableError(error) {
  if (!error || typeof error !== "object") {
    return false;
  }
  const shaped = error;
  const code = shaped.gatewayCode ?? shaped.code;
  return code === "UNAVAILABLE" && shaped.retryable === true && isGatewayStartupUnavailableDetails(shaped.details);
}
function resolveGatewayStartupRetryAfterMs(error) {
  if (!isRetryableGatewayStartupUnavailableError(error)) {
    return null;
  }
  const retryAfterMs = error.retryAfterMs;
  const raw = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs) ? retryAfterMs : GATEWAY_STARTUP_RETRY_AFTER_MS;
  return Math.min(
    Math.max(Math.floor(raw), GATEWAY_STARTUP_RETRY_MIN_MS),
    GATEWAY_STARTUP_RETRY_MAX_MS
  );
}

// packages/gateway-protocol/src/version.ts
var PROTOCOL_VERSION = 4;
var MIN_CLIENT_PROTOCOL_VERSION = 4;

// packages/net-policy/src/ip.ts
import ipaddr from "ipaddr.js";
function normalizeOptionalString2(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed || void 0;
}
function normalizeLowercaseStringOrEmpty(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
var RFC2544_BENCHMARK_PREFIX = [ipaddr.IPv4.parse("198.18.0.0"), 15];
function stripIpv6Brackets(value) {
  if (value.startsWith("[") && value.endsWith("]")) {
    return value.slice(1, -1);
  }
  return value;
}
function isIpv6Address(address) {
  return address.kind() === "ipv6";
}
function normalizeIpv4MappedAddress(address) {
  if (!isIpv6Address(address)) {
    return address;
  }
  if (!address.isIPv4MappedAddress()) {
    return address;
  }
  return address.toIPv4Address();
}
function normalizeIpParseInput(raw) {
  const trimmed = normalizeOptionalString2(raw);
  if (!trimmed) {
    return void 0;
  }
  return stripIpv6Brackets(trimmed);
}
function parseCanonicalIpAddress(raw) {
  const normalized2 = normalizeIpParseInput(raw);
  if (!normalized2) {
    return void 0;
  }
  const isCanonical = ipaddr.IPv4.isValidFourPartDecimal(normalized2) || ipaddr.IPv6.isValid(normalized2);
  return isCanonical ? ipaddr.parse(normalized2) : void 0;
}
function normalizeIpAddress(raw) {
  const parsed = parseCanonicalIpAddress(raw);
  if (!parsed) {
    return void 0;
  }
  const normalized2 = normalizeIpv4MappedAddress(parsed);
  return normalizeLowercaseStringOrEmpty(normalized2.toString());
}
function isLoopbackIpAddress(raw) {
  const parsed = parseCanonicalIpAddress(raw);
  if (!parsed) {
    return false;
  }
  const normalized2 = normalizeIpv4MappedAddress(parsed);
  return normalized2.range() === "loopback";
}

// packages/gateway-client/src/client.ts
import { WebSocket } from "ws";

// packages/gateway-client/src/client-address-utils.ts
function normalizeLowercaseStringOrEmpty2(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function isSensitiveUrlQueryParamName(key) {
  return /(?:token|password|secret|key|auth|credential)/iu.test(key);
}
function normalizeFingerprint(fingerprint) {
  return (fingerprint ?? "").replaceAll(":", "").trim().toLowerCase();
}
function parseHostForAddressChecks(host) {
  if (!host) {
    return null;
  }
  const normalizedHost = host.toLowerCase().trim();
  const canonicalHost = normalizedHost.replace(/\.+$/, "");
  if (canonicalHost === "localhost") {
    return { isLocalhost: true, unbracketedHost: canonicalHost };
  }
  return {
    isLocalhost: false,
    // URL.hostname canonicalizes IPv6 with brackets in some call sites. Strip
    // them before net.isIP so address checks do not fall back to hostname rules.
    unbracketedHost: normalizedHost.startsWith("[") && normalizedHost.endsWith("]") ? normalizedHost.slice(1, -1) : normalizedHost
  };
}
function parseGatewayIpAddress(host) {
  const normalized2 = normalizeIpAddress(host);
  return normalized2 ? parseCanonicalIpAddress(normalized2) : void 0;
}

// packages/gateway-client/src/connect-auth.ts
function normalized(value) {
  return typeof value === "string" ? value.trim() || void 0 : void 0;
}
function selectGatewayConnectAuth(params) {
  const authToken = normalized(params.token);
  const bootstrapToken = normalized(params.bootstrapToken);
  const explicitDeviceToken = normalized(params.deviceToken);
  const authPassword = normalized(params.password);
  const storedToken = normalized(params.storedToken);
  const stored = { storedToken, storedScopes: params.storedScopes };
  if (params.preferBootstrapToken && bootstrapToken) {
    return { authBootstrapToken: bootstrapToken, authPassword, ...stored };
  }
  const useRetryToken = params.pendingDeviceTokenRetry === true && !explicitDeviceToken && Boolean(authToken && storedToken && params.trustedDeviceTokenRetry);
  const resolvedDeviceToken = explicitDeviceToken ?? (useRetryToken || !(authToken || authPassword) && (!bootstrapToken || storedToken) ? storedToken : void 0);
  const usingStoredDeviceToken = Boolean(resolvedDeviceToken && !explicitDeviceToken && storedToken) && resolvedDeviceToken === storedToken;
  const selectedToken = authToken ?? resolvedDeviceToken;
  const authBootstrapToken = !authToken && !resolvedDeviceToken && !authPassword ? bootstrapToken : void 0;
  return {
    authToken: selectedToken,
    authBootstrapToken,
    authDeviceToken: useRetryToken ? storedToken : void 0,
    authPassword,
    authApprovalRuntimeToken: normalized(params.approvalRuntimeToken),
    authAgentRuntimeIdentityToken: normalized(params.agentRuntimeIdentityToken),
    signatureToken: selectedToken ?? authBootstrapToken,
    resolvedDeviceToken,
    usingStoredDeviceToken,
    ...stored
  };
}
function buildGatewayConnectAuth(selected) {
  const auth = {
    token: selected.authToken,
    bootstrapToken: selected.authBootstrapToken,
    deviceToken: selected.authDeviceToken ?? selected.resolvedDeviceToken,
    password: selected.authPassword,
    approvalRuntimeToken: selected.authApprovalRuntimeToken,
    agentRuntimeIdentityToken: selected.authAgentRuntimeIdentityToken
  };
  return Object.values(auth).some(Boolean) ? auth : void 0;
}
function resolveGatewayConnectScopes(params) {
  return params.requestedScopes ?? (params.usingStoredDeviceToken && params.storedScopes?.length ? params.storedScopes : [...params.defaultScopes]);
}
function shouldRetryGatewayWithDeviceToken(params) {
  if (params.retryBudgetUsed || params.currentDeviceToken || !params.explicitToken || !params.storedToken || !params.trustedEndpoint) {
    return false;
  }
  const advice = readConnectErrorRecoveryAdvice(params.errorDetails);
  return params.canRetryWithDeviceTokenHint === true || advice.canRetryWithDeviceToken === true || advice.recommendedNextStep === "retry_with_device_token" || readConnectErrorDetailCode(params.errorDetails) === ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH;
}

// packages/gateway-client/src/device-auth.ts
function normalizeDeviceMetadataForAuth(value) {
  if (typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.replace(/[A-Z]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 32));
}
function buildDeviceAuthPayloadV3(params) {
  const scopes = params.scopes.join(",");
  const token = params.token ?? "";
  const platform = normalizeDeviceMetadataForAuth(params.platform);
  const deviceFamily = normalizeDeviceMetadataForAuth(params.deviceFamily);
  return [
    "v3",
    params.deviceId,
    params.clientId,
    params.clientMode,
    params.role,
    scopes,
    String(params.signedAtMs),
    token,
    params.nonce,
    platform,
    deviceFamily
  ].join("|");
}

// packages/gateway-protocol/src/frame-guards.ts
function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}
function isNonNegativeInteger(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
function isGatewayErrorShape(value) {
  if (!isRecord(value)) {
    return false;
  }
  if (!isNonEmptyString(value.code) || !isNonEmptyString(value.message)) {
    return false;
  }
  if (value.retryable !== void 0 && typeof value.retryable !== "boolean") {
    return false;
  }
  return value.retryAfterMs === void 0 || isNonNegativeInteger(value.retryAfterMs);
}
function isGatewayEventFrame(value) {
  if (!isRecord(value) || value.type !== "event" || !isNonEmptyString(value.event)) {
    return false;
  }
  return value.seq === void 0 || isNonNegativeInteger(value.seq);
}
function isGatewayResponseFrame(value) {
  if (!isRecord(value) || value.type !== "res" || !isNonEmptyString(value.id) || typeof value.ok !== "boolean") {
    return false;
  }
  return value.error === void 0 || isGatewayErrorShape(value.error);
}

// packages/retry/src/index.ts
var MAX_TIMER_TIMEOUT_MS = 2147e6;
function computeBackoff(policy, attempt) {
  const base = Math.min(policy.maxMs, policy.initialMs * policy.factor ** Math.max(attempt - 1, 0));
  const jitter = base * policy.jitter * Math.random();
  return Math.min(policy.maxMs, Math.round(base + jitter));
}
async function sleepWithAbort(ms, abortSignal, options = {}) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return;
  }
  const delayMs = Math.min(Math.max(Math.floor(ms), 1), MAX_TIMER_TIMEOUT_MS);
  await new Promise((resolve, reject) => {
    let settled = false;
    let timer = null;
    const cleanup = () => abortSignal?.removeEventListener("abort", onAbort);
    const onAbort = () => {
      if (settled) {
        return;
      }
      settled = true;
      if (timer) {
        clearTimeout(timer);
      }
      timer = null;
      cleanup();
      reject(new Error("aborted", { cause: abortSignal?.reason ?? new Error("aborted") }));
    };
    abortSignal?.addEventListener("abort", onAbort, { once: true });
    if (abortSignal?.aborted) {
      onAbort();
      return;
    }
    timer = setTimeout(() => {
      settled = true;
      cleanup();
      timer = null;
      resolve();
    }, delayMs);
    if (options.ref === false) {
      timer.unref?.();
    }
    if (abortSignal?.aborted) {
      onAbort();
    }
  });
}
var RetrySupervisor = class {
  constructor(policy, maxAttempts = Number.POSITIVE_INFINITY) {
    this.policy = policy;
    this.maxAttempts = maxAttempts;
    this.attempts = 0;
    this.initialMs = policy.initialMs;
  }
  reset(initialMs = this.policy.initialMs) {
    this.cancel();
    this.attempts = 0;
    this.initialMs = initialMs;
    this.nextDelayOverrideMs = void 0;
  }
  cancel(reason = new Error("retry cancelled")) {
    this.pendingAbort?.abort(reason);
    this.pendingAbort = void 0;
  }
  next(abortSignal) {
    const override = this.nextDelayOverrideMs;
    this.nextDelayOverrideMs = void 0;
    if (override === void 0 && ++this.attempts > Math.ceil(this.maxAttempts)) {
      return void 0;
    }
    const attempt = Math.max(this.attempts, 1);
    const delayMs = override ?? computeBackoff({ ...this.policy, initialMs: this.initialMs }, attempt);
    this.cancel();
    const pendingAbort = new AbortController();
    this.pendingAbort = pendingAbort;
    return {
      attempt,
      delayMs,
      signal: abortSignal ? AbortSignal.any([pendingAbort.signal, abortSignal]) : pendingAbort.signal
    };
  }
};
var DEFAULT_RETRY_CONFIG = {
  attempts: 3,
  minDelayMs: 300,
  maxDelayMs: 3e4,
  jitter: 0
};
var defaultSleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});
function asFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function clampNumber(value, fallback, min, max) {
  const next = asFiniteNumber(value);
  if (next === void 0) {
    return fallback;
  }
  return Math.min(Math.max(next, min ?? Number.NEGATIVE_INFINITY), max ?? Number.POSITIVE_INFINITY);
}
function resolveAttemptCount(value, fallback) {
  return Math.max(1, Math.round(asFiniteNumber(value) ?? fallback));
}
function resolveRetryDelayMs(value) {
  const finite = value === Number.POSITIVE_INFINITY ? MAX_TIMER_TIMEOUT_MS : asFiniteNumber(value) ?? 0;
  return Math.min(Math.max(Math.round(finite), 0), MAX_TIMER_TIMEOUT_MS);
}
function resolveJitterConfig(value, fallback) {
  if (value === "full") {
    return "full";
  }
  const fraction = asFiniteNumber(value);
  return fraction === void 0 ? fallback : Math.min(Math.max(fraction, 0), 1);
}
function resolveRetryConfig(defaults = DEFAULT_RETRY_CONFIG, overrides) {
  const attempts = resolveAttemptCount(overrides?.attempts, defaults.attempts);
  const minDelayMs = resolveRetryDelayMs(
    clampNumber(overrides?.minDelayMs, defaults.minDelayMs, 0)
  );
  const maxDelayMs = Math.max(
    minDelayMs,
    resolveRetryDelayMs(clampNumber(overrides?.maxDelayMs, defaults.maxDelayMs, 0))
  );
  return {
    attempts,
    minDelayMs,
    maxDelayMs,
    jitter: resolveJitterConfig(overrides?.jitter, defaults.jitter)
  };
}
function applyJitter(delayMs, jitter, mode, random) {
  if (jitter === "full") {
    if (mode === "symmetric") {
      return Math.max(0, Math.round(delayMs * (0.5 + random() * 0.5)));
    }
    return Math.max(0, Math.ceil(delayMs * (1 + random())));
  }
  if (jitter <= 0) {
    return mode === "positive" ? Math.ceil(delayMs) : delayMs;
  }
  const fraction = random();
  const offset = mode === "positive" ? fraction * jitter : (fraction * 2 - 1) * jitter;
  const raw = delayMs * (1 + offset);
  return Math.max(0, mode === "positive" ? Math.ceil(raw) : Math.round(raw));
}
function toRetryError(value, fallbackMessage = "Non-Error thrown") {
  if (value instanceof Error) {
    return value;
  }
  if (typeof value === "string") {
    return new Error(value);
  }
  const error = new Error(fallbackMessage, { cause: value });
  if (typeof value === "object" && value !== null || typeof value === "function") {
    Object.assign(error, value);
  }
  return error;
}
function createRetryRunner(runtime = {}) {
  const runtimeSleep = runtime.sleep ?? defaultSleep;
  const runtimeRandom = runtime.random ?? Math.random;
  const createFailure = runtime.createFailure ?? ((errors) => toRetryError(errors.at(-1) ?? new Error("Retry failed")));
  return async function retryAsync2(fn, attemptsOrOptions = 3, initialDelayMs = 300) {
    const attemptErrors = [];
    if (typeof attemptsOrOptions === "number") {
      const attempts = resolveAttemptCount(attemptsOrOptions, DEFAULT_RETRY_CONFIG.attempts);
      for (let index = 0; index < attempts; index += 1) {
        try {
          return await fn();
        } catch (err) {
          attemptErrors.push(err);
          if (index === attempts - 1) {
            break;
          }
          await runtimeSleep(resolveRetryDelayMs(initialDelayMs * 2 ** index));
        }
      }
      throw createFailure(attemptErrors);
    }
    const options = attemptsOrOptions;
    const resolved = resolveRetryConfig(DEFAULT_RETRY_CONFIG, options);
    const maxAttempts = resolved.attempts;
    const minDelayMs = resolved.minDelayMs;
    const maxDelayMs = resolved.maxDelayMs > 0 ? resolved.maxDelayMs : Number.POSITIVE_INFINITY;
    const retryAfterMaxDelayMs = options.retryAfterMaxDelayMs === void 0 ? maxDelayMs : Math.max(
      minDelayMs,
      resolveRetryDelayMs(clampNumber(options.retryAfterMaxDelayMs, maxDelayMs, 0))
    );
    const random = options.random ?? runtimeRandom;
    const sleep = options.sleep ?? runtimeSleep;
    const shouldRetry = options.shouldRetry ?? (() => true);
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await fn();
      } catch (err) {
        attemptErrors.push(err);
        if (attempt >= maxAttempts || !shouldRetry(err, attempt)) {
          break;
        }
        const context = {
          attempt,
          maxAttempts,
          err,
          label: options.label
        };
        const retryAfterMs = options.retryAfterMs?.(err);
        const hasRetryAfter = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs);
        const configuredDelay = typeof options.delayMs === "function" ? options.delayMs(context) : options.delayMs;
        const resolvedConfiguredDelay = configuredDelay === void 0 ? void 0 : resolveRetryDelayMs(configuredDelay);
        const baseDelay = hasRetryAfter ? Math.max(retryAfterMs, minDelayMs) : resolvedConfiguredDelay === void 0 ? minDelayMs * 2 ** (attempt - 1) : Math.max(resolvedConfiguredDelay, minDelayMs);
        const delayCap = hasRetryAfter ? retryAfterMaxDelayMs : maxDelayMs;
        let delay = Math.min(baseDelay, delayCap);
        const canHonorRetryAfter = hasRetryAfter && (retryAfterMs ?? 0) <= delayCap;
        const wantsPositiveDraw = resolved.jitter === "full" ? !hasRetryAfter || canHonorRetryAfter : canHonorRetryAfter;
        delay = applyJitter(
          delay,
          resolved.jitter,
          wantsPositiveDraw ? "positive" : "symmetric",
          random
        );
        delay = Math.min(Math.max(delay, minDelayMs), delayCap);
        await options.onRetry?.({ ...context, delayMs: delay });
        if (delay > 0) {
          await sleep(delay);
        }
      }
    }
    throw createFailure(attemptErrors);
  };
}
var retryAsync = createRetryRunner();

// packages/gateway-client/src/protocol-client.ts
var GatewayProtocolRequestError = class extends Error {
  constructor(error) {
    super(error.message ?? "request failed");
    this.name = "GatewayProtocolRequestError";
    this.code = error.code ?? "UNAVAILABLE";
    this.gatewayCode = this.code;
    this.details = error.details;
    this.retryable = error.retryable === true;
    this.retryAfterMs = error.retryAfterMs;
  }
};
var GatewayProtocolClient = class {
  constructor(opts) {
    this.opts = opts;
    this.socket = null;
    this.pending = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Set();
    this.stopped = true;
    this.generation = 0;
    this.lastSeq = null;
    this.connectNonce = null;
    this.connectSent = false;
    this.connectRequestSent = false;
    this.handshakeTimer = null;
    this.socketOpened = false;
    this.helloReceived = false;
    this.connectTiming = null;
    this.reconnectSupervisor = new RetrySupervisor({
      initialMs: opts.reconnect.initialMs,
      maxMs: opts.reconnect.maxMs,
      factor: opts.reconnect.multiplier,
      jitter: 0
    });
  }
  get connected() {
    return this.socket?.isOpen() ?? false;
  }
  get hasPendingRequests() {
    return this.pending.size > 0;
  }
  get connecting() {
    return this.connectSent && !this.helloReceived;
  }
  get hasUnboundedPendingRequests() {
    return [...this.pending.values()].some((pending) => pending.unbounded);
  }
  start() {
    this.stopped = false;
    this.reconnectSupervisor.cancel();
    this.connect();
  }
  stop() {
    this.stopped = true;
    this.clearHandshakeTimer();
    this.reconnectSupervisor.reset();
    const socket = this.socket;
    if (socket && this.opts.notifyStoppedClose) {
      this.stoppedSocket = { socket, context: this.closeContext() };
    }
    this.socket = null;
    this.connectFailure = void 0;
    this.connectTiming = null;
    this.flushRequests(new Error("gateway client stopped"));
    socket?.close();
  }
  request(method, params, options) {
    const socket = this.socket;
    if (!socket?.isOpen()) {
      return Promise.reject(new Error("gateway not connected"));
    }
    if (typeof method !== "string" || method.length === 0) {
      return Promise.reject(new Error("invalid request frame: method must be a non-empty string"));
    }
    const id = this.opts.createRequestId();
    const timeoutMs = options?.timeoutMs === null ? void 0 : options?.timeoutMs ?? this.opts.requestTimeoutMs;
    return new Promise((resolve, reject) => {
      let timeout;
      const pending = {
        resolve: (value) => resolve(value),
        reject,
        expectFinal: options?.expectFinal === true,
        acceptedNotified: false,
        onAccepted: options?.onAccepted,
        unbounded: timeoutMs === void 0,
        method,
        startedAtMs: this.nowMs()
      };
      const onAbort = () => {
        this.pending.delete(id);
        if (timeout) {
          clearTimeout(timeout);
        }
        this.finishRequestTiming(id, pending, false, "CLIENT_ABORTED");
        reject(
          this.opts.createRequestAbortError?.(method) ?? new Error(`gateway request aborted for ${method}`)
        );
      };
      const cleanup = () => {
        if (timeout) {
          clearTimeout(timeout);
        }
        options?.signal?.removeEventListener("abort", onAbort);
      };
      if (options?.signal?.aborted) {
        reject(
          this.opts.createRequestAbortError?.(method) ?? new Error(`gateway request aborted for ${method}`)
        );
        return;
      }
      pending.cleanup = cleanup;
      if (timeoutMs !== void 0 && timeoutMs >= 0) {
        timeout = setTimeout(() => {
          this.pending.delete(id);
          options?.signal?.removeEventListener("abort", onAbort);
          this.finishRequestTiming(id, pending, false, "CLIENT_TIMEOUT");
          reject(
            this.opts.createRequestTimeoutError?.(method, timeoutMs) ?? new Error(`gateway request timed out after ${timeoutMs}ms: ${method}`)
          );
        }, timeoutMs);
        timeout.unref?.();
      }
      options?.signal?.addEventListener("abort", onAbort, { once: true });
      this.pending.set(id, pending);
      try {
        socket.send(JSON.stringify({ type: "req", id, method, params }));
        this.invoke("sent", () => options?.onSent?.());
      } catch (error) {
        this.pending.delete(id);
        cleanup();
        this.finishRequestTiming(id, pending, false, "CLIENT_SEND_ERROR");
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }
  addEventListener(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  closeSocket(code, reason) {
    this.socket?.close(code, reason);
  }
  resetReconnectBackoff(initialMs) {
    this.reconnectSupervisor.reset(initialMs);
  }
  recordTiming(phase, generation, plan, detail) {
    const now = this.nowMs();
    const state = this.connectTiming;
    if (!state || state.generation !== generation) {
      return;
    }
    state.hasChallenge ||= phase === "challenge";
    state.usedFallback ||= phase === "fallback";
    this.invoke(
      "connect timing",
      () => this.opts.onTiming?.({
        phase,
        generation,
        durationMs: Math.max(0, now - state.startedAtMs),
        phaseDurationMs: Math.max(0, now - state.lastAtMs),
        hasChallenge: state.hasChallenge,
        usedFallback: state.usedFallback,
        plan,
        detail
      })
    );
    state.lastAtMs = now;
    if (phase === "hello" || phase === "failed") {
      this.connectTiming = null;
    }
  }
  connect() {
    if (this.stopped) {
      return;
    }
    const generation = this.generation + 1;
    this.connectNonce = null;
    this.connectSent = false;
    this.connectRequestSent = false;
    this.socketOpened = false;
    this.helloReceived = false;
    this.connectFailure = void 0;
    let socket;
    try {
      socket = this.opts.createSocket({
        open: () => this.handleOpen(socket, generation),
        message: (data) => this.handleMessage(socket, generation, data),
        close: (code, reason) => this.handleClose(socket, generation, code, reason),
        error: (error) => this.handleSocketError(socket, generation, error)
      });
    } catch (error) {
      const normalized2 = error instanceof Error ? error : new Error(String(error));
      this.opts.onSocketFactoryError?.(normalized2);
      this.opts.onConnectError?.(normalized2);
      if (this.opts.rethrowSocketFactoryError?.(normalized2)) {
        throw normalized2;
      }
      return;
    }
    this.generation = generation;
    this.socket = socket;
    const now = this.nowMs();
    this.connectTiming = {
      generation,
      startedAtMs: now,
      lastAtMs: now,
      hasChallenge: false,
      usedFallback: false
    };
  }
  handleOpen(socket, generation) {
    if (!this.isActive(socket, generation)) {
      return;
    }
    this.socketOpened = true;
    this.recordTiming("socket-open", generation);
    if (this.connectNonce) {
      this.sendConnect(socket, generation);
      return;
    }
    this.armHandshakeTimer(socket, generation);
  }
  armHandshakeTimer(socket, generation) {
    this.clearHandshakeTimer();
    const armedAt = Date.now();
    this.handshakeTimer = setTimeout(() => {
      this.handshakeTimer = null;
      if (!this.isActive(socket, generation) || this.connectSent || !socket.isOpen()) {
        return;
      }
      if (this.opts.handshake.mode === "fallback") {
        this.recordTiming("fallback", generation);
        this.sendConnect(socket, generation);
        return;
      }
      const elapsedMs = Date.now() - armedAt;
      const error = new Error(
        this.opts.handshake.timeoutMessage?.(elapsedMs) ?? `gateway connect challenge timeout after ${elapsedMs}ms`
      );
      this.opts.onConnectError?.(error);
      socket.close(1008, "connect challenge timeout");
    }, this.opts.handshake.timeoutMs);
    this.handshakeTimer.unref?.();
  }
  sendConnect(socket, generation) {
    if (!this.isActive(socket, generation) || !socket.isOpen() || this.connectSent) {
      return;
    }
    this.connectSent = true;
    this.clearHandshakeTimer();
    let planOrPromise;
    try {
      planOrPromise = this.opts.buildConnectPlan({
        nonce: this.connectNonce,
        generation
      });
    } catch (error) {
      this.handleConnectPlanError(socket, generation, error);
      return;
    }
    if (planOrPromise instanceof Promise) {
      void planOrPromise.then((plan) => this.sendConnectPlan(socket, generation, plan)).catch((error) => this.handleConnectPlanError(socket, generation, error));
      return;
    }
    this.sendConnectPlan(socket, generation, planOrPromise);
  }
  handleConnectPlanError(socket, generation, error) {
    if (!this.isActive(socket, generation)) {
      return;
    }
    const normalized2 = error instanceof Error ? error : new Error(String(error));
    const outcome = this.opts.onConnectPlanError?.(normalized2) ?? {
      closeCode: 1008,
      closeReason: "connect failed"
    };
    this.opts.onConnectError?.(outcome.error ?? normalized2);
    if (outcome.stop) {
      this.stopped = true;
    }
    socket.close(outcome.closeCode, outcome.closeReason);
  }
  sendConnectPlan(socket, generation, plan) {
    if (!this.isActive(socket, generation) || !socket.isOpen()) {
      return;
    }
    const context = { generation, nonce: this.connectNonce, plan };
    this.recordTiming("connect-plan-ready", generation, plan);
    this.recordTiming("request-sent", generation, plan);
    this.connectRequestSent = true;
    void this.request("connect", this.opts.buildConnectParams(plan)).then((hello) => {
      if (!this.isActive(socket, generation)) {
        return;
      }
      this.helloReceived = true;
      this.connectFailure = void 0;
      this.reconnectSupervisor.reset();
      this.recordTiming("hello", generation, plan);
      this.opts.onConnectHello?.(hello, context);
      this.invoke("hello", () => this.opts.onHello?.(hello));
    }).catch((error) => {
      if (!this.isActive(socket, generation)) {
        return;
      }
      const requestError = error instanceof GatewayProtocolRequestError ? error : new GatewayProtocolRequestError({ message: String(error) });
      const outcome = this.opts.onConnectFailure?.(requestError, context) ?? {
        closeCode: 1008,
        closeReason: "connect failed"
      };
      this.connectFailure = {
        error: requestError,
        reconnectDelayMs: outcome.reconnectDelayMs
      };
      if (outcome.stop) {
        this.stopped = true;
      }
      socket.close(outcome.closeCode, outcome.closeReason);
    });
  }
  handleMessage(socket, generation, raw) {
    if (!this.isActive(socket, generation)) {
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      this.opts.onParseError?.(error);
      return;
    }
    if (isGatewayEventFrame(parsed)) {
      this.opts.onActivity?.();
      if (parsed.event === "connect.challenge") {
        const payload = parsed.payload;
        const nonce = typeof payload?.nonce === "string" ? payload.nonce.trim() : "";
        if (!nonce) {
          if (this.opts.handshake.mode === "require-challenge") {
            const error = new Error("gateway connect challenge missing nonce");
            this.opts.onConnectError?.(error);
            socket.close(1008, "connect challenge missing nonce");
          }
          return;
        }
        this.connectNonce = nonce;
        this.recordTiming("challenge", generation);
        this.sendConnect(socket, generation);
        return;
      }
      const seq = typeof parsed.seq === "number" ? parsed.seq : null;
      if (seq !== null) {
        if (this.lastSeq !== null && seq > this.lastSeq + 1) {
          const expected = this.lastSeq + 1;
          this.invoke("gap", () => this.opts.onGap?.({ expected, received: seq }));
        }
        this.lastSeq = seq;
      }
      this.invoke("event", () => this.opts.onEvent?.(parsed));
      for (const listener of this.listeners) {
        this.invoke("event listener", () => listener(parsed));
      }
      return;
    }
    if (!isGatewayResponseFrame(parsed)) {
      return;
    }
    this.opts.onActivity?.();
    this.handleResponse(parsed);
  }
  handleResponse(frame) {
    const pending = this.pending.get(frame.id);
    if (!pending) {
      return;
    }
    const status = frame.payload?.status;
    if (pending.expectFinal && status === "accepted") {
      if (!pending.acceptedNotified) {
        pending.acceptedNotified = true;
        this.invoke("accepted", () => pending.onAccepted?.(frame.payload));
      }
      return;
    }
    this.pending.delete(frame.id);
    pending.cleanup?.();
    if (frame.ok) {
      this.finishRequestTiming(frame.id, pending, true);
      pending.resolve(frame.payload);
      return;
    }
    this.finishRequestTiming(frame.id, pending, false, frame.error?.code);
    pending.reject(
      this.opts.createRequestError?.(frame.error ?? {}) ?? new GatewayProtocolRequestError(frame.error ?? {})
    );
  }
  handleClose(socket, generation, code, reason) {
    if (this.socket !== socket) {
      if (this.stoppedSocket?.socket === socket) {
        const context2 = { ...this.stoppedSocket.context, code, reason };
        this.stoppedSocket = void 0;
        this.invoke("close", () => this.opts.onClose?.(context2, { retry: false, notify: true }));
      }
      return;
    }
    this.socket = null;
    this.clearHandshakeTimer();
    const context = {
      ...this.closeContext(),
      code,
      reason,
      generation
    };
    this.connectFailure = void 0;
    const decision = this.opts.resolveClose(context);
    this.flushRequests(
      decision.pendingError ?? context.connectFailure?.error ?? new Error(`gateway closed (${code}): ${reason}`)
    );
    this.invoke("close", () => this.opts.onClose?.(context, decision));
    if (decision.retry && !this.stopped) {
      this.scheduleReconnect(decision.reconnectDelayMs ?? context.connectFailure?.reconnectDelayMs);
    }
  }
  handleSocketError(socket, generation, error) {
    if (!this.isActive(socket, generation) || this.connectSent) {
      return;
    }
    this.opts.onConnectError?.(error);
  }
  flushRequests(error) {
    for (const [id, pending] of this.pending) {
      this.finishRequestTiming(id, pending, false, "CLIENT_CLOSED");
      pending.cleanup?.();
      pending.reject(error);
    }
    this.pending.clear();
  }
  finishRequestTiming(id, pending, ok, errorCode) {
    const endedAtMs = this.nowMs();
    this.invoke(
      "request timing",
      () => this.opts.onRequestTiming?.({
        id,
        method: pending.method,
        ok,
        durationMs: Math.max(0, endedAtMs - pending.startedAtMs),
        startedAtMs: pending.startedAtMs,
        endedAtMs,
        errorCode
      })
    );
  }
  scheduleReconnect(overrideMs) {
    if (overrideMs !== void 0) {
      this.reconnectSupervisor.nextDelayOverrideMs = overrideMs;
    }
    const retry = this.reconnectSupervisor.next();
    if (!retry) {
      return;
    }
    void sleepWithAbort(retry.delayMs, retry.signal).then(
      () => this.connect(),
      () => {
      }
    );
  }
  closeContext() {
    return {
      generation: this.generation,
      socketOpened: this.socketOpened,
      helloReceived: this.helloReceived,
      connectRequestSent: this.connectRequestSent,
      connectFailure: this.connectFailure
    };
  }
  isActive(socket, generation) {
    return !this.stopped && this.socket === socket && this.generation === generation;
  }
  nowMs() {
    return this.opts.nowMs?.() ?? Date.now();
  }
  clearHandshakeTimer() {
    if (this.handshakeTimer) {
      clearTimeout(this.handshakeTimer);
      this.handshakeTimer = null;
    }
  }
  invoke(label, callback) {
    try {
      callback();
    } catch (error) {
      this.opts.onCallbackError?.(label, error);
    }
  }
};

// packages/gateway-client/src/reconnect-policy.ts
var NON_RECOVERABLE_AUTH_ERRORS = /* @__PURE__ */ new Set([
  ConnectErrorDetailCodes.AUTH_TOKEN_MISSING,
  ConnectErrorDetailCodes.AUTH_BOOTSTRAP_TOKEN_INVALID,
  ConnectErrorDetailCodes.AUTH_PASSWORD_MISSING,
  ConnectErrorDetailCodes.AUTH_PASSWORD_MISMATCH,
  ConnectErrorDetailCodes.AUTH_RATE_LIMITED,
  ConnectErrorDetailCodes.AUTH_DEVICE_TOKEN_MISMATCH,
  ConnectErrorDetailCodes.AUTH_SCOPE_MISMATCH,
  ConnectErrorDetailCodes.PAIRING_REQUIRED,
  ConnectErrorDetailCodes.CONTROL_UI_DEVICE_IDENTITY_REQUIRED,
  ConnectErrorDetailCodes.DEVICE_IDENTITY_REQUIRED
]);
function shouldPauseGatewayReconnect(params) {
  const code = readConnectErrorDetailCode(params.details);
  if (!code) {
    return false;
  }
  const pairing = readPairingConnectErrorDetails(params.details);
  if (code === ConnectErrorDetailCodes.PAIRING_REQUIRED && (pairing?.pauseReconnect === false || pairing?.recommendedNextStep === "wait_then_retry")) {
    return false;
  }
  if (code === ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH) {
    return params.tokenMismatchIsTerminal === true && !params.deviceTokenRetryPending;
  }
  return NON_RECOVERABLE_AUTH_ERRORS.has(code) || params.protocolMismatchIsTerminal === true && code === ConnectErrorDetailCodes.PROTOCOL_MISMATCH || params.clientVersionMismatchIsTerminal === true && code === ConnectErrorDetailCodes.CLIENT_VERSION_MISMATCH;
}

// packages/gateway-client/src/timeouts.ts
function parseStrictPositiveInteger(value) {
  const trimmed = value.trim();
  if (!/^\+?\d+$/u.test(trimmed)) {
    return void 0;
  }
  const parsed = Number(trimmed);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : void 0;
}
var MAX_SAFE_TIMEOUT_DELAY_MS = 2147483647;
var DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS = 15e3;
var DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS = 3e4;
var MIN_CONNECT_CHALLENGE_TIMEOUT_MS = 250;
var MAX_CONNECT_CHALLENGE_TIMEOUT_MS = DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS;
function resolveSafeTimeoutDelayMs(delayMs, opts) {
  const rawMinMs = opts?.minMs ?? 1;
  const minMs = Math.min(
    MAX_SAFE_TIMEOUT_DELAY_MS,
    Math.max(0, Number.isFinite(rawMinMs) ? Math.floor(rawMinMs) : 1)
  );
  const candidateMs = Number.isFinite(delayMs) ? Math.floor(delayMs) : minMs;
  return Math.min(MAX_SAFE_TIMEOUT_DELAY_MS, Math.max(minMs, candidateMs));
}
function clampConnectChallengeTimeoutMs(timeoutMs, maxTimeoutMs = MAX_CONNECT_CHALLENGE_TIMEOUT_MS) {
  return Math.max(
    MIN_CONNECT_CHALLENGE_TIMEOUT_MS,
    Math.min(Math.max(MIN_CONNECT_CHALLENGE_TIMEOUT_MS, maxTimeoutMs), timeoutMs)
  );
}
function getConnectChallengeTimeoutMsFromEnv(env = process.env) {
  const raw = env.OPENCLAW_CONNECT_CHALLENGE_TIMEOUT_MS;
  if (raw) {
    const parsed = parseStrictPositiveInteger(raw);
    if (parsed !== void 0) {
      return resolveSafeTimeoutDelayMs(parsed);
    }
  }
  return void 0;
}
function normalizePositiveTimeoutMs(timeoutMs) {
  return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? resolveSafeTimeoutDelayMs(timeoutMs) : void 0;
}
function resolveConnectChallengeTimeoutMs(timeoutMs, params) {
  const configuredPreauthTimeoutMs = resolvePreauthHandshakeTimeoutMs({
    env: params?.env,
    configuredTimeoutMs: params?.configuredTimeoutMs
  });
  const maxTimeoutMs = Math.max(DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS, configuredPreauthTimeoutMs);
  if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs)) {
    return clampConnectChallengeTimeoutMs(timeoutMs, maxTimeoutMs);
  }
  const envOverride = getConnectChallengeTimeoutMsFromEnv(params?.env);
  if (envOverride !== void 0) {
    return clampConnectChallengeTimeoutMs(envOverride, Math.max(maxTimeoutMs, envOverride));
  }
  return clampConnectChallengeTimeoutMs(configuredPreauthTimeoutMs, maxTimeoutMs);
}
function resolvePreauthHandshakeTimeoutMs(params) {
  const env = params?.env ?? process.env;
  const configuredTimeout = env.OPENCLAW_HANDSHAKE_TIMEOUT_MS || env.VITEST && env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS;
  if (configuredTimeout) {
    const parsed = parseStrictPositiveInteger(configuredTimeout);
    if (parsed !== void 0) {
      return resolveSafeTimeoutDelayMs(parsed);
    }
  }
  const configured = normalizePositiveTimeoutMs(params?.configuredTimeoutMs);
  if (configured !== void 0) {
    return configured;
  }
  return DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS;
}

// packages/gateway-client/src/websocket-data.ts
import { Buffer } from "node:buffer";
function rawDataToString(data) {
  if (Array.isArray(data)) {
    return Buffer.concat(data).toString("utf8");
  }
  return data instanceof ArrayBuffer ? Buffer.from(data).toString("utf8") : data.toString("utf8");
}

// packages/gateway-client/src/client.ts
var DEFAULT_HOST_DEPS = {
  loadOrCreateDeviceIdentity: () => void 0,
  signDevicePayload: () => {
    throw new Error("GatewayClient device signature dependency is not configured");
  },
  publicKeyRawBase64UrlFromPem: () => {
    throw new Error("GatewayClient public key dependency is not configured");
  },
  loadDeviceAuthToken: () => null,
  storeDeviceAuthToken: () => {
  },
  clearDeviceAuthToken: () => {
  },
  beforeConnect: () => {
  },
  registerGatewayLoopbackBypass: () => void 0,
  logDebug: () => {
  },
  logError: () => {
  },
  redactForLog: (message) => message,
  normalizeTlsFingerprint: normalizeFingerprint
};
function resolveHostDeps(overrides) {
  return Object.fromEntries(
    Object.entries(DEFAULT_HOST_DEPS).map(([key, fallback]) => [
      key,
      overrides?.[key] ?? fallback
    ])
  );
}
var PRIVATE_OR_LOOPBACK_IPV4_RANGES = /* @__PURE__ */ new Set([
  "loopback",
  "private",
  "linkLocal",
  "carrierGradeNat"
]);
var PRIVATE_OR_LOOPBACK_IPV6_RANGES = /* @__PURE__ */ new Set([
  "loopback",
  "linkLocal",
  "uniqueLocal",
  "deprecatedSiteLocal"
]);
function isPrivateOrLoopbackIpAddress(address) {
  const ranges = address.kind() === "ipv4" ? PRIVATE_OR_LOOPBACK_IPV4_RANGES : PRIVATE_OR_LOOPBACK_IPV6_RANGES;
  return ranges.has(address.range());
}
function isLoopbackHost(host) {
  const parsed = parseHostForAddressChecks(host);
  if (!parsed) {
    return false;
  }
  if (parsed.isLocalhost) {
    return true;
  }
  return isLoopbackIpAddress(parsed.unbracketedHost);
}
function isPrivateOrLoopbackHost(host) {
  const parsed = parseHostForAddressChecks(host);
  if (!parsed) {
    return false;
  }
  if (parsed.isLocalhost) {
    return true;
  }
  const address = parseGatewayIpAddress(parsed.unbracketedHost);
  if (!address) {
    return false;
  }
  return isPrivateOrLoopbackIpAddress(address);
}
function isTrustedPlaintextWebSocketHost(hostname) {
  if (isPrivateOrLoopbackHost(hostname)) {
    return true;
  }
  const normalized2 = hostname.toLowerCase().trim().replace(/\.+$/, "");
  return normalized2.endsWith(".local") || normalized2.endsWith(".ts.net");
}
function isSecureWebSocketUrl(rawUrl, options) {
  try {
    const url = new URL(rawUrl);
    const protocol = url.protocol === "https:" ? "wss:" : url.protocol === "http:" ? "ws:" : url.protocol;
    if (protocol === "wss:") {
      return true;
    }
    if (protocol !== "ws:") {
      return false;
    }
    if (isLoopbackHost(url.hostname) || isTrustedPlaintextWebSocketHost(url.hostname)) {
      return true;
    }
    if (options?.allowPrivateWs === true) {
      const hostForIpCheck = url.hostname.startsWith("[") && url.hostname.endsWith("]") ? url.hostname.slice(1, -1) : url.hostname;
      return isPrivateOrLoopbackHost(url.hostname) || parseGatewayIpAddress(hostForIpCheck) === void 0;
    }
    return false;
  } catch {
    return false;
  }
}
var DEFAULT_GATEWAY_CLIENT_URL = "ws://127.0.0.1:18789";
var DEFAULT_CLIENT_VERSION = "0.0.0";
var GatewayClientRequestError = class extends GatewayProtocolRequestError {
  constructor(error) {
    super({
      ...error,
      message: formatConnectErrorMessage({ message: error.message, details: error.details })
    });
    this.name = "GatewayClientRequestError";
  }
};
var GatewayClientTransientPreHelloCloseError = class extends Error {
  constructor() {
    super("gateway transient pre-hello clean close");
    this.name = "GatewayClientTransientPreHelloCloseError";
  }
};
var GatewayClientTransportPolicyError = class extends Error {
};
var GATEWAY_CONNECT_ASSEMBLY_ERROR = /* @__PURE__ */ Symbol("gateway.connectAssemblyError");
function markGatewayConnectAssemblyError(error) {
  Object.defineProperty(error, GATEWAY_CONNECT_ASSEMBLY_ERROR, {
    configurable: true,
    value: true
  });
  return error;
}
function isGatewayConnectAssemblyError(value) {
  return value instanceof Error && value[GATEWAY_CONNECT_ASSEMBLY_ERROR] === true;
}
function isGatewayClientStoppedError(err) {
  const message = err instanceof Error ? err.message : String(err);
  return message === "gateway client stopped" || message === "Error: gateway client stopped";
}
function formatGatewayClientErrorForLog(err) {
  const redactedUrlLikeString = String(err).replace(/\/\/([^@/?#\s]+)@/g, "//***:***@").replace(/(Authorization:\s*Bearer\s+)[^\s]+/giu, "$1***").replace(
    /([?&])([^=&\s]+)=([^&#\s"'<>)]*)/g,
    (match, prefix, key) => isSensitiveUrlQueryParamName(key) ? `${prefix}${key}=***` : match
  );
  return redactedUrlLikeString;
}
var FORCE_STOP_TERMINATE_GRACE_MS = 250;
var STOP_AND_WAIT_TIMEOUT_MS = 1e3;
var MAX_SUPPRESSED_TRANSIENT_PRE_HELLO_CLEAN_CLOSES = 1;
var GatewayClient = class {
  constructor(opts) {
    this.ws = null;
    this.stopped = false;
    this.pendingDeviceTokenRetry = false;
    this.deviceTokenRetryBudgetUsed = false;
    this.approvalRuntimeTokenCompatibilityDisabled = false;
    this.approvalRuntimeTokenRetryBudgetUsed = false;
    // Track last tick to detect silent stalls.
    this.lastTick = null;
    this.tickIntervalMs = 3e4;
    this.tickTimer = null;
    this.pendingStop = null;
    this.transportValidated = false;
    this.suppressedTransientPreHelloCleanCloses = 0;
    this.deps = resolveHostDeps(opts.hostDeps);
    this.opts = {
      ...opts,
      deviceIdentity: opts.deviceIdentity === null ? void 0 : opts.deviceIdentity ?? this.deps.loadOrCreateDeviceIdentity()
    };
    this.requestTimeoutMs = typeof opts.requestTimeoutMs === "number" && Number.isFinite(opts.requestTimeoutMs) ? resolveSafeTimeoutDelayMs(opts.requestTimeoutMs, { minMs: 0 }) : DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS;
    const connectChallengeTimeoutMs = resolveConnectChallengeTimeoutMs(
      this.opts.connectChallengeTimeoutMs,
      {
        env: this.opts.env,
        configuredTimeoutMs: this.opts.preauthHandshakeTimeoutMs
      }
    );
    this.protocol = new GatewayProtocolClient({
      createSocket: (handlers) => this.createSocket(handlers),
      createRequestId: randomUUID,
      createRequestError: (error) => new GatewayClientRequestError(error),
      createRequestTimeoutError: (method) => new Error(`gateway request timeout for ${method}`),
      createRequestAbortError: createGatewayRequestAbortError,
      buildConnectPlan: ({ nonce }) => {
        if (!nonce) {
          throw new Error("gateway connect challenge missing nonce");
        }
        return this.assembleConnectParams({ role: this.opts.role ?? "operator", nonce });
      },
      buildConnectParams: (assembled) => assembled.params,
      onConnectPlanError: (error) => {
        this.stopped = true;
        const marked = markGatewayConnectAssemblyError(error);
        const msg = `gateway connect failed: ${formatGatewayClientErrorForLog(error)}`;
        if (this.opts.mode === GATEWAY_CLIENT_MODES.PROBE || isGatewayClientStoppedError(error)) {
          this.logDebug(msg);
        } else {
          this.logError(msg);
        }
        return { closeCode: 1008, closeReason: "connect failed", stop: true, error: marked };
      },
      onConnectHello: (hello, context) => this.handleConnectHello(hello, context.plan),
      onHello: (hello) => this.opts.onHelloOk?.(hello),
      onConnectFailure: (error, context) => this.handleConnectRequestFailure(error, context.plan),
      resolveClose: (context) => this.resolveClose(context),
      onClose: (context, decision) => {
        if (this.tickTimer) {
          clearInterval(this.tickTimer);
          this.tickTimer = null;
        }
        if (decision.notify) {
          this.opts.onClose?.(context.code, context.reason, this.closeInfo(context));
        }
      },
      notifyStoppedClose: true,
      onConnectError: (error) => this.notifyConnectError(error),
      onParseError: (error) => this.logDebug(`gateway client parse error: ${formatGatewayClientErrorForLog(error)}`),
      onEvent: (event) => this.opts.onEvent?.(event),
      onGap: (info) => this.opts.onGap?.(info),
      onActivity: () => {
        this.lastTick = Date.now();
      },
      onCallbackError: (label, error) => this.logDebug(
        `gateway client ${label === "hello" ? "hello-ok" : label === "gap" ? "event" : label} handler error: ${formatGatewayClientErrorForLog(error)}`
      ),
      handshake: {
        mode: "require-challenge",
        timeoutMs: connectChallengeTimeoutMs,
        timeoutMessage: (elapsedMs) => `gateway connect challenge timeout (waited ${elapsedMs}ms, limit ${connectChallengeTimeoutMs}ms)`
      },
      reconnect: { initialMs: 1e3, multiplier: 2, maxMs: 3e4 },
      requestTimeoutMs: this.requestTimeoutMs,
      rethrowSocketFactoryError: (error) => error instanceof GatewayClientTransportPolicyError
    });
  }
  getConnectionMetadata() {
    return {
      clientName: this.opts.clientName,
      hasDeviceIdentity: Boolean(this.opts.deviceIdentity),
      mode: this.opts.mode,
      preauthHandshakeTimeoutMs: this.opts.preauthHandshakeTimeoutMs
    };
  }
  updateNodeManifest(manifest) {
    this.opts = {
      ...this.opts,
      caps: [...manifest.caps],
      commands: [...manifest.commands]
    };
    if (!this.stopped) {
      this.protocol.closeSocket(1012, "node manifest changed");
    }
  }
  start() {
    if (this.stopped) {
      return;
    }
    this.protocol.start();
  }
  createSocket(handlers) {
    const url = this.opts.url ?? DEFAULT_GATEWAY_CLIENT_URL;
    if (this.opts.tlsFingerprint && !url.startsWith("wss://")) {
      throw new Error("gateway tls fingerprint requires wss:// gateway url");
    }
    const allowPrivateWs = (this.opts.env ?? process.env).OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1";
    if (!isSecureWebSocketUrl(url, { allowPrivateWs })) {
      let displayHost = url;
      try {
        displayHost = new URL(url).hostname || url;
      } catch {
      }
      throw new Error(
        `SECURITY ERROR: Cannot connect to "${displayHost}" over plaintext ws://. Both credentials and chat data would be exposed to network interception. Use wss:// for remote URLs. Safe defaults: keep gateway.bind=loopback and connect via SSH tunnel (ssh -N -L 18789:127.0.0.1:18789 user@gateway-host), or use Tailscale Serve/Funnel. ` + (allowPrivateWs ? "" : "Break-glass (trusted private networks only): set OPENCLAW_ALLOW_INSECURE_PRIVATE_WS=1. ") + "Run `openclaw doctor --fix` for guidance."
      );
    }
    this.deps.beforeConnect();
    const handshakeTimeoutMs = resolvePreauthHandshakeTimeoutMs({
      env: this.opts.env,
      configuredTimeoutMs: this.opts.preauthHandshakeTimeoutMs
    });
    const wsOptions = {
      maxPayload: 25 * 1024 * 1024,
      handshakeTimeout: handshakeTimeoutMs,
      ...this.opts.origin ? { origin: this.opts.origin } : {}
    };
    if (url.startsWith("wss://") && this.opts.tlsFingerprint) {
      wsOptions.rejectUnauthorized = false;
      wsOptions.checkServerIdentity = (_hostValue, cert) => {
        const fingerprintValue = typeof cert === "object" && cert && "fingerprint256" in cert ? cert.fingerprint256 ?? "" : "";
        const fingerprint = this.deps.normalizeTlsFingerprint(
          typeof fingerprintValue === "string" ? fingerprintValue : ""
        );
        const expected = this.deps.normalizeTlsFingerprint(this.opts.tlsFingerprint ?? "");
        if (!expected) {
          return void 0;
        }
        if (!fingerprint) {
          return new Error("Missing server TLS fingerprint");
        }
        if (fingerprint !== expected) {
          return new Error("Server TLS fingerprint mismatch");
        }
        return void 0;
      };
    }
    let ws;
    let unregisterGatewayLoopbackBypass;
    try {
      unregisterGatewayLoopbackBypass = this.deps.registerGatewayLoopbackBypass(url);
    } catch (error) {
      throw new GatewayClientTransportPolicyError(
        error instanceof Error ? error.message : String(error)
      );
    }
    try {
      ws = new WebSocket(url, wsOptions);
      ws.binaryType = "nodebuffer";
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    } finally {
      unregisterGatewayLoopbackBypass?.();
    }
    this.ws = ws;
    this.transportValidated = false;
    ws.on("open", () => {
      handlers.open();
      if (url.startsWith("wss://") && this.opts.tlsFingerprint) {
        const tlsError = this.validateTlsFingerprint();
        if (tlsError) {
          handlers.error(tlsError);
          ws.close(1008, tlsError.message);
          return;
        }
      }
      this.transportValidated = true;
    });
    ws.on("message", (data) => handlers.message(rawDataToString(data)));
    ws.on("close", (code, reason) => {
      const reasonText = reason.toString();
      if (this.ws === ws) {
        this.ws = null;
      }
      this.resolvePendingStop(ws);
      handlers.close(code, reasonText);
    });
    ws.on("error", (err) => {
      this.logDebug(`gateway client error: ${formatGatewayClientErrorForLog(err)}`);
      handlers.error(err instanceof Error ? err : new Error(String(err)));
    });
    return {
      isOpen: () => ws.readyState === WebSocket.OPEN,
      send: (data) => ws.send(data),
      close: (code, reason) => ws.close(code, reason)
    };
  }
  stop() {
    void this.beginStop();
  }
  async stopAndWait(opts) {
    const stopPromise = this.beginStop();
    if (!stopPromise) {
      return;
    }
    const timeoutMs = opts?.timeoutMs === void 0 ? STOP_AND_WAIT_TIMEOUT_MS : resolveSafeTimeoutDelayMs(opts.timeoutMs);
    let timeout = null;
    try {
      await Promise.race([
        stopPromise,
        new Promise((_, reject) => {
          timeout = setTimeout(() => {
            reject(new Error(`gateway client stop timed out after ${timeoutMs}ms`));
          }, timeoutMs);
          timeout.unref?.();
        })
      ]);
    } finally {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }
  beginStop() {
    this.stopped = true;
    this.pendingDeviceTokenRetry = false;
    this.deviceTokenRetryBudgetUsed = false;
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
      this.tickTimer = null;
    }
    if (this.pendingStop) {
      return this.pendingStop.promise;
    }
    const ws = this.ws;
    this.ws = null;
    if (ws) {
      const pendingStop = this.createPendingStop(ws);
      const forceTerminateTimer = setTimeout(() => {
        try {
          ws.terminate();
        } finally {
          this.resolvePendingStop(ws);
        }
      }, FORCE_STOP_TERMINATE_GRACE_MS);
      forceTerminateTimer.unref?.();
      pendingStop.terminateTimer = forceTerminateTimer;
      if (this.protocol.connecting) {
        const error = new Error("gateway client stopped");
        this.notifyConnectError(error);
        this.logDebug(`gateway connect failed: ${formatGatewayClientErrorForLog(error)}`);
      }
      this.protocol.stop();
      return pendingStop.promise;
    }
    this.protocol.stop();
    return null;
  }
  createPendingStop(ws) {
    if (this.pendingStop?.ws === ws) {
      return this.pendingStop;
    }
    let resolve = () => {
    };
    const promise = new Promise((done) => {
      resolve = done;
    });
    this.pendingStop = { ws, promise, resolve };
    return this.pendingStop;
  }
  resolvePendingStop(ws) {
    if (this.pendingStop?.ws !== ws) {
      return;
    }
    const { resolve, terminateTimer } = this.pendingStop;
    if (terminateTimer) {
      clearTimeout(terminateTimer);
    }
    this.pendingStop = null;
    resolve();
  }
  logDebug(message) {
    this.deps.logDebug(this.deps.redactForLog(message));
  }
  logError(message) {
    this.deps.logError(this.deps.redactForLog(message));
  }
  assembleConnectParams(params) {
    const { role, nonce } = params;
    const selectedAuth = this.selectConnectAuth(role);
    const {
      authDeviceToken,
      authApprovalRuntimeToken,
      authAgentRuntimeIdentityToken,
      signatureToken,
      resolvedDeviceToken,
      storedToken,
      storedScopes,
      usingStoredDeviceToken
    } = selectedAuth;
    if (this.pendingDeviceTokenRetry && authDeviceToken) {
      this.pendingDeviceTokenRetry = false;
    }
    const auth = buildGatewayConnectAuth(selectedAuth);
    const signedAtMs = Date.now();
    const scopes = resolveGatewayConnectScopes({
      requestedScopes: this.opts.scopes,
      usingStoredDeviceToken,
      storedScopes,
      defaultScopes: ["operator.admin"]
    });
    const platform = this.opts.platform ?? process.platform;
    return {
      params: {
        minProtocol: this.opts.minProtocol ?? MIN_CLIENT_PROTOCOL_VERSION,
        maxProtocol: this.opts.maxProtocol ?? PROTOCOL_VERSION,
        client: {
          id: this.opts.clientName ?? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
          displayName: this.opts.clientDisplayName,
          version: this.opts.clientVersion ?? DEFAULT_CLIENT_VERSION,
          platform,
          deviceFamily: this.opts.deviceFamily,
          mode: this.opts.mode ?? GATEWAY_CLIENT_MODES.BACKEND,
          instanceId: this.opts.instanceId
        },
        caps: Array.isArray(this.opts.caps) ? this.opts.caps : [],
        commands: Array.isArray(this.opts.commands) ? this.opts.commands : void 0,
        permissions: this.opts.permissions && typeof this.opts.permissions === "object" ? this.opts.permissions : void 0,
        pathEnv: this.opts.pathEnv,
        auth,
        role,
        scopes,
        device: this.buildDeviceConnectParams({
          nonce,
          role,
          scopes,
          signatureToken,
          signedAtMs,
          platform
        })
      },
      authApprovalRuntimeToken,
      authAgentRuntimeIdentityToken,
      resolvedDeviceToken,
      storedToken,
      usingStoredDeviceToken
    };
  }
  buildDeviceConnectParams(params) {
    if (!this.opts.deviceIdentity) {
      return void 0;
    }
    const { nonce, role, scopes, signatureToken, signedAtMs, platform } = params;
    const payload = buildDeviceAuthPayloadV3({
      deviceId: this.opts.deviceIdentity.deviceId,
      clientId: this.opts.clientName ?? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
      clientMode: this.opts.mode ?? GATEWAY_CLIENT_MODES.BACKEND,
      role,
      scopes,
      signedAtMs,
      token: signatureToken ?? null,
      nonce,
      platform,
      deviceFamily: this.opts.deviceFamily
    });
    const signature = this.deps.signDevicePayload(this.opts.deviceIdentity.privateKeyPem, payload);
    return {
      id: this.opts.deviceIdentity.deviceId,
      publicKey: this.deps.publicKeyRawBase64UrlFromPem(this.opts.deviceIdentity.publicKeyPem),
      signature,
      signedAt: signedAtMs,
      nonce
    };
  }
  handleConnectHello(helloOk, assembled) {
    this.pendingDeviceTokenRetry = false;
    this.deviceTokenRetryBudgetUsed = false;
    this.suppressedTransientPreHelloCleanCloses = 0;
    const role = this.opts.role ?? "operator";
    const authInfo = helloOk.auth;
    if (authInfo?.deviceToken && this.opts.deviceIdentity) {
      this.deps.storeDeviceAuthToken({
        deviceId: this.opts.deviceIdentity.deviceId,
        role: authInfo.role ?? role,
        token: authInfo.deviceToken,
        scopes: authInfo.scopes ?? [],
        env: this.opts.env
      });
    }
    this.tickIntervalMs = typeof helloOk.policy?.tickIntervalMs === "number" ? helloOk.policy.tickIntervalMs : 3e4;
    this.lastTick = Date.now();
    this.startTickWatch();
    void assembled;
  }
  handleConnectRequestFailure(error, assembled) {
    const role = this.opts.role ?? "operator";
    const shouldRetryWithDeviceToken = shouldRetryGatewayWithDeviceToken({
      retryBudgetUsed: this.deviceTokenRetryBudgetUsed,
      currentDeviceToken: assembled.resolvedDeviceToken,
      explicitToken: this.opts.token?.trim() || void 0,
      storedToken: assembled.storedToken,
      trustedEndpoint: this.isTrustedDeviceRetryEndpoint(),
      errorDetails: error instanceof GatewayClientRequestError ? error.details : void 0
    });
    if (this.opts.deviceIdentity && assembled.usingStoredDeviceToken && error instanceof GatewayClientRequestError && readConnectErrorDetailCode(error.details) === ConnectErrorDetailCodes.AUTH_DEVICE_TOKEN_MISMATCH) {
      const deviceId = this.opts.deviceIdentity.deviceId;
      try {
        this.deps.clearDeviceAuthToken({ deviceId, role, env: this.opts.env });
        this.logDebug(`cleared stale device-auth token for device ${deviceId}`);
      } catch (clearError) {
        this.logDebug(
          `failed clearing stale device-auth token for device ${deviceId}: ${String(clearError)}`
        );
      }
    }
    if (shouldRetryWithDeviceToken) {
      this.pendingDeviceTokenRetry = true;
      this.deviceTokenRetryBudgetUsed = true;
      this.protocol.resetReconnectBackoff(250);
    }
    const startupRetryAfterMs = resolveGatewayStartupRetryAfterMs(error);
    if (startupRetryAfterMs !== null) {
      this.logDebug(`gateway connect failed: ${formatGatewayClientErrorForLog(error)}`);
      return {
        closeCode: 1013,
        closeReason: "gateway starting",
        reconnectDelayMs: startupRetryAfterMs
      };
    }
    if (this.shouldFailClosedForUnsupportedAgentRuntimeIdentity({
      error,
      authAgentRuntimeIdentityToken: assembled.authAgentRuntimeIdentityToken
    })) {
      const unsupportedIdentityError = new Error(
        "gateway rejected required agent runtime identity auth field; refusing to retry without it"
      );
      this.stopped = true;
      this.notifyConnectError(unsupportedIdentityError);
      this.logError(`gateway connect failed: ${unsupportedIdentityError.message}`);
      return { closeCode: 1008, closeReason: "connect failed", stop: true };
    }
    if (this.shouldRetryWithoutApprovalRuntimeToken({
      error,
      authApprovalRuntimeToken: assembled.authApprovalRuntimeToken
    })) {
      this.approvalRuntimeTokenCompatibilityDisabled = true;
      this.approvalRuntimeTokenRetryBudgetUsed = true;
      this.protocol.resetReconnectBackoff(250);
      this.logDebug("gateway rejected approval runtime auth field; retrying without it");
      return { closeCode: 1008, closeReason: "connect retry" };
    }
    this.notifyConnectError(error);
    const message = `gateway connect failed: ${formatGatewayClientErrorForLog(error)}`;
    if (this.opts.mode === GATEWAY_CLIENT_MODES.PROBE || isGatewayClientStoppedError(error)) {
      this.logDebug(message);
    } else {
      this.logError(message);
    }
    return {
      closeCode: 1008,
      closeReason: "connect failed"
    };
  }
  resolveClose(context) {
    const info = this.closeInfo(context);
    const detailCode = context.connectFailure?.error instanceof GatewayClientRequestError ? readConnectErrorDetailCode(context.connectFailure.error.details) : null;
    const details = context.connectFailure?.error instanceof GatewayClientRequestError ? context.connectFailure.error.details : void 0;
    if (context.code === 1013 && context.connectFailure?.reconnectDelayMs !== void 0) {
      return {
        retry: true,
        notify: false,
        reconnectDelayMs: context.connectFailure.reconnectDelayMs
      };
    }
    if (info.transientPreHelloCleanClose && this.suppressedTransientPreHelloCleanCloses < MAX_SUPPRESSED_TRANSIENT_PRE_HELLO_CLEAN_CLOSES) {
      this.suppressedTransientPreHelloCleanCloses += 1;
      return {
        retry: true,
        notify: true,
        pendingError: new GatewayClientTransientPreHelloCloseError()
      };
    }
    if (info.transientPreHelloCleanClose || context.connectRequestSent && !context.helloReceived && !context.connectFailure) {
      const error = new Error(`gateway closed (${context.code}): ${context.reason}`);
      this.notifyConnectError(error);
      this.logError(`gateway connect failed: ${formatGatewayClientErrorForLog(error)}`);
    }
    this.clearStaleDeviceTokenForClose(context.code, context.reason);
    if (shouldPauseGatewayReconnect({
      details,
      deviceTokenRetryPending: this.pendingDeviceTokenRetry,
      tokenMismatchIsTerminal: true,
      clientVersionMismatchIsTerminal: true
    })) {
      this.notifyReconnectPaused({ code: context.code, reason: context.reason, detailCode });
      return { retry: false, notify: true };
    }
    return {
      retry: true,
      notify: true,
      reconnectDelayMs: context.connectFailure?.reconnectDelayMs
    };
  }
  closeInfo(context) {
    return {
      phase: context.helloReceived ? "post-hello" : "pre-hello",
      socketOpened: context.socketOpened,
      transportValidated: this.transportValidated,
      transientPreHelloCleanClose: !context.helloReceived && context.code === 1e3 && context.reason === ""
    };
  }
  clearStaleDeviceTokenForClose(code, reason) {
    if (code !== 1008 || !normalizeLowercaseStringOrEmpty2(reason).includes("device token mismatch") || this.opts.token || this.opts.password || !this.opts.deviceIdentity) {
      return;
    }
    const deviceId = this.opts.deviceIdentity.deviceId;
    const role = this.opts.role ?? "operator";
    try {
      this.deps.clearDeviceAuthToken({ deviceId, role, env: this.opts.env });
      this.logDebug(`cleared stale device-auth token for device ${deviceId}`);
    } catch (error) {
      this.logDebug(
        `failed clearing stale device-auth token for device ${deviceId}: ${String(error)}`
      );
    }
  }
  notifyConnectError(error) {
    try {
      this.opts.onConnectError?.(error);
    } catch (err) {
      this.logDebug(
        `gateway client connect error handler error: ${formatGatewayClientErrorForLog(err)}`
      );
    }
  }
  notifyReconnectPaused(info) {
    try {
      this.opts.onReconnectPaused?.(info);
    } catch (err) {
      this.logDebug(
        `gateway client reconnect paused handler error: ${formatGatewayClientErrorForLog(err)}`
      );
    }
  }
  shouldRetryWithoutApprovalRuntimeToken(params) {
    if (this.approvalRuntimeTokenRetryBudgetUsed) {
      return false;
    }
    if (!params.authApprovalRuntimeToken) {
      return false;
    }
    if (!(params.error instanceof GatewayClientRequestError)) {
      return false;
    }
    if (params.error.gatewayCode !== "INVALID_REQUEST") {
      return false;
    }
    const message = normalizeLowercaseStringOrEmpty2(params.error.message);
    return message.includes("invalid connect params") && message.includes("approvalruntimetoken");
  }
  shouldFailClosedForUnsupportedAgentRuntimeIdentity(params) {
    if (!params.authAgentRuntimeIdentityToken) {
      return false;
    }
    if (!(params.error instanceof GatewayClientRequestError)) {
      return false;
    }
    if (params.error.gatewayCode !== "INVALID_REQUEST") {
      return false;
    }
    const message = normalizeLowercaseStringOrEmpty2(params.error.message);
    return message.includes("invalid connect params") && message.includes("agentruntimeidentitytoken");
  }
  isTrustedDeviceRetryEndpoint() {
    const rawUrl = this.opts.url ?? "ws://127.0.0.1:18789";
    try {
      const parsed = new URL(rawUrl);
      const protocol = parsed.protocol === "https:" ? "wss:" : parsed.protocol === "http:" ? "ws:" : parsed.protocol;
      if (isLoopbackHost(parsed.hostname)) {
        return true;
      }
      return protocol === "wss:" && Boolean(this.opts.tlsFingerprint?.trim());
    } catch {
      return false;
    }
  }
  selectConnectAuth(role) {
    const storedAuth = this.opts.deviceIdentity ? this.deps.loadDeviceAuthToken({
      deviceId: this.opts.deviceIdentity.deviceId,
      role,
      env: this.opts.env
    }) : null;
    return selectGatewayConnectAuth({
      token: this.opts.token,
      bootstrapToken: this.opts.bootstrapToken,
      deviceToken: this.opts.deviceToken,
      password: this.opts.password,
      approvalRuntimeToken: this.approvalRuntimeTokenCompatibilityDisabled ? void 0 : this.opts.approvalRuntimeToken,
      agentRuntimeIdentityToken: this.opts.agentRuntimeIdentityToken,
      storedToken: storedAuth?.token,
      storedScopes: storedAuth?.scopes,
      pendingDeviceTokenRetry: this.pendingDeviceTokenRetry,
      trustedDeviceTokenRetry: this.isTrustedDeviceRetryEndpoint()
    });
  }
  startTickWatch() {
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
    }
    const rawMinInterval = this.opts.tickWatchMinIntervalMs;
    const minInterval = typeof rawMinInterval === "number" && Number.isFinite(rawMinInterval) ? Math.max(1, Math.min(3e4, rawMinInterval)) : 1e3;
    const interval = resolveSafeTimeoutDelayMs(Math.max(this.tickIntervalMs, minInterval));
    this.tickTimer = setInterval(() => {
      if (this.stopped) {
        return;
      }
      if (!this.lastTick) {
        return;
      }
      const allPendingRequestsHaveTimeouts = this.protocol.hasPendingRequests && !this.protocol.hasUnboundedPendingRequests;
      if (allPendingRequestsHaveTimeouts) {
        return;
      }
      const gap = Date.now() - this.lastTick;
      const rawTimeoutMs = this.opts.tickWatchTimeoutMs;
      const timeoutMs = typeof rawTimeoutMs === "number" && Number.isFinite(rawTimeoutMs) ? Math.max(1, rawTimeoutMs) : this.tickIntervalMs * 2;
      if (gap > timeoutMs) {
        this.protocol.closeSocket(4e3, "tick timeout");
      }
    }, interval);
  }
  validateTlsFingerprint() {
    if (!this.opts.tlsFingerprint || !this.ws) {
      return null;
    }
    const expected = this.deps.normalizeTlsFingerprint(this.opts.tlsFingerprint);
    if (!expected) {
      return new Error("gateway tls fingerprint missing");
    }
    const socket = this.ws["_socket"];
    if (!socket || typeof socket.getPeerCertificate !== "function") {
      return new Error("gateway tls fingerprint unavailable");
    }
    const cert = socket.getPeerCertificate();
    const fingerprint = this.deps.normalizeTlsFingerprint(cert?.fingerprint256 ?? "");
    if (!fingerprint) {
      return new Error("gateway tls fingerprint unavailable");
    }
    if (fingerprint !== expected) {
      return new Error("gateway tls fingerprint mismatch");
    }
    return null;
  }
  async request(method, params, opts) {
    const expectFinal = opts?.expectFinal === true;
    const timeoutMs = opts?.timeoutMs === null ? null : typeof opts?.timeoutMs === "number" && Number.isFinite(opts.timeoutMs) ? resolveSafeTimeoutDelayMs(opts.timeoutMs, { minMs: 0 }) : expectFinal ? null : this.requestTimeoutMs;
    return this.protocol.request(method, params, {
      expectFinal,
      timeoutMs,
      signal: opts?.signal,
      onSent: opts?.onSent,
      onAccepted: opts?.onAccepted
    });
  }
};
function createGatewayRequestAbortError(method) {
  const err = new Error(`gateway request aborted for ${method}`);
  err.name = "AbortError";
  return err;
}
export {
  GatewayClient,
  GatewayClientRequestError,
  isGatewayConnectAssemblyError
};
