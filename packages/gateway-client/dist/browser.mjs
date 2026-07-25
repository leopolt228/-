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
function buildDeviceAuthPayload(params) {
  const scopes = params.scopes.join(",");
  const token = params.token ?? "";
  return [
    "v2",
    params.deviceId,
    params.clientId,
    params.clientMode,
    params.role,
    scopes,
    String(params.signedAtMs),
    token,
    params.nonce
  ].join("|");
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
function resolveAuthConnectErrorDetailCode(reason) {
  switch (reason) {
    case "token_missing":
      return ConnectErrorDetailCodes.AUTH_TOKEN_MISSING;
    case "token_mismatch":
      return ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH;
    case "token_missing_config":
      return ConnectErrorDetailCodes.AUTH_TOKEN_NOT_CONFIGURED;
    case "password_missing":
      return ConnectErrorDetailCodes.AUTH_PASSWORD_MISSING;
    case "password_mismatch":
      return ConnectErrorDetailCodes.AUTH_PASSWORD_MISMATCH;
    case "password_missing_config":
      return ConnectErrorDetailCodes.AUTH_PASSWORD_NOT_CONFIGURED;
    case "bootstrap_token_invalid":
      return ConnectErrorDetailCodes.AUTH_BOOTSTRAP_TOKEN_INVALID;
    case "tailscale_user_missing":
      return ConnectErrorDetailCodes.AUTH_TAILSCALE_IDENTITY_MISSING;
    case "tailscale_proxy_missing":
      return ConnectErrorDetailCodes.AUTH_TAILSCALE_PROXY_MISSING;
    case "tailscale_whois_failed":
      return ConnectErrorDetailCodes.AUTH_TAILSCALE_WHOIS_FAILED;
    case "tailscale_user_mismatch":
      return ConnectErrorDetailCodes.AUTH_TAILSCALE_IDENTITY_MISMATCH;
    case "rate_limited":
      return ConnectErrorDetailCodes.AUTH_RATE_LIMITED;
    case "device_token_mismatch":
      return ConnectErrorDetailCodes.AUTH_DEVICE_TOKEN_MISMATCH;
    case "scope_mismatch":
      return ConnectErrorDetailCodes.AUTH_SCOPE_MISMATCH;
    case void 0:
      return ConnectErrorDetailCodes.AUTH_REQUIRED;
    default:
      return ConnectErrorDetailCodes.AUTH_UNAUTHORIZED;
  }
}
function resolveDeviceAuthConnectErrorDetailCode(reason) {
  switch (reason) {
    case "device-id-mismatch":
      return ConnectErrorDetailCodes.DEVICE_AUTH_DEVICE_ID_MISMATCH;
    case "device-signature-stale":
      return ConnectErrorDetailCodes.DEVICE_AUTH_SIGNATURE_EXPIRED;
    case "device-nonce-missing":
      return ConnectErrorDetailCodes.DEVICE_AUTH_NONCE_REQUIRED;
    case "device-nonce-mismatch":
      return ConnectErrorDetailCodes.DEVICE_AUTH_NONCE_MISMATCH;
    case "device-signature":
      return ConnectErrorDetailCodes.DEVICE_AUTH_SIGNATURE_INVALID;
    case "device-public-key":
      return ConnectErrorDetailCodes.DEVICE_AUTH_PUBLIC_KEY_INVALID;
    default:
      return ConnectErrorDetailCodes.DEVICE_AUTH_INVALID;
  }
}
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
function describePairingConnectRequirement(reason) {
  return reason ? PAIRING_CONNECT_REASON_METADATA[reason].requirement : "device approval is required";
}
function buildPairingConnectErrorMessage(reason) {
  return reason ? `pairing required: ${describePairingConnectRequirement(reason)}` : "pairing required";
}
function buildPairingConnectRemediationHint(reason) {
  return reason ? PAIRING_CONNECT_REASON_METADATA[reason].remediationHint : "Approve the pending device request before retrying.";
}
function buildPairingConnectRecoveryTitle(reason) {
  return reason ? PAIRING_CONNECT_REASON_METADATA[reason].recoveryTitle : "Gateway pairing approval required.";
}
function buildPairingConnectErrorDetails(params) {
  const requestId = normalizePairingConnectRequestId(params.requestId);
  const remediationHint = normalizeOptionalString(params.remediationHint) ?? buildPairingConnectRemediationHint(params.reason);
  const deviceId = normalizeOptionalString(params.deviceId);
  const requestedRole = normalizeOptionalString(params.requestedRole);
  const requestedScopes = normalizeStringArray(params.requestedScopes);
  const approvedRoles = normalizeStringArray(params.approvedRoles);
  const approvedScopes = normalizeStringArray(params.approvedScopes);
  return createPairingConnectErrorDetails({
    reason: params.reason,
    requestId,
    remediationHint,
    recommendedNextStep: params.recommendedNextStep,
    retryable: params.retryable,
    pauseReconnect: params.pauseReconnect,
    deviceId,
    requestedRole,
    requestedScopes,
    approvedRoles,
    approvedScopes
  });
}
function buildPairingConnectCloseReason(params) {
  const requestId = normalizePairingConnectRequestId(params.requestId);
  const message = buildPairingConnectErrorMessage(params.reason);
  return requestId ? `${message} (requestId: ${requestId})` : message;
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
function readConnectPairingRequiredMessage(message) {
  const normalizedMessage = normalizeOptionalString(message);
  if (!normalizedMessage) {
    return null;
  }
  const normalized2 = normalizedMessage.trim().toLowerCase();
  let reason;
  for (const [candidate, prefix] of Object.entries(
    CONNECT_PAIRING_REQUIRED_MESSAGE_BY_REASON
  )) {
    if (normalized2.includes(prefix)) {
      reason = candidate;
      break;
    }
  }
  if (!reason && normalized2.includes("pairing required")) {
    reason = ConnectPairingRequiredReasons.NOT_PAIRED;
  }
  if (!reason) {
    return null;
  }
  const requestId = normalizePairingConnectRequestId(
    normalizedMessage.match(/\(requestId:\s*([^\s)]+)\)/i)?.[1]
  );
  return {
    ...requestId ? { requestId } : {},
    reason
  };
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

// packages/gateway-client/src/browser-device-auth.ts
var GatewayBrowserDeviceAuthLifecycle = class {
  constructor(deps) {
    this.deps = deps;
  }
  async buildPlan(params) {
    const identity = await this.deps.loadIdentity();
    const stored = identity ? await this.deps.tokenStore.load({
      clientId: params.client.id,
      deviceId: identity.deviceId,
      role: params.role
    }) : null;
    const storedValue = stored?.token;
    const selectedAuth = selectGatewayConnectAuth({
      token: params.token,
      bootstrapToken: params.bootstrapToken,
      password: params.password,
      storedToken: storedValue,
      storedScopes: stored?.scopes,
      pendingDeviceTokenRetry: params.pendingDeviceTokenRetry,
      trustedDeviceTokenRetry: params.trustedDeviceTokenRetry,
      preferBootstrapToken: params.preferBootstrapToken
    });
    const { usingStoredDeviceToken } = selectedAuth;
    const scopes = resolveGatewayConnectScopes({
      requestedScopes: selectedAuth.authBootstrapToken ? params.bootstrapScopes ? [...params.bootstrapScopes] : void 0 : void 0,
      usingStoredDeviceToken,
      storedScopes: selectedAuth.storedScopes,
      defaultScopes: params.defaultScopes
    });
    if (!identity) {
      return {
        clientId: params.client.id,
        role: params.role,
        identity,
        selectedAuth,
        scopes,
        auth: buildGatewayConnectAuth(selectedAuth)
      };
    }
    const signedAtMs = this.deps.nowMs?.() ?? Date.now();
    const nonce = params.nonce ?? "";
    const { authBootstrapToken: primary, signatureToken: signed } = selectedAuth;
    let token = null;
    if (primary) {
      token = primary;
    } else if (signed) {
      token = signed;
    }
    const payload = buildDeviceAuthPayloadV3({
      deviceId: identity.deviceId,
      clientId: params.client.id,
      clientMode: params.client.mode,
      role: params.role,
      scopes,
      signedAtMs,
      token,
      nonce,
      platform: params.client.platform,
      deviceFamily: params.client.deviceFamily
    });
    return {
      clientId: params.client.id,
      role: params.role,
      identity,
      selectedAuth,
      scopes,
      auth: buildGatewayConnectAuth(selectedAuth),
      device: {
        id: identity.deviceId,
        publicKey: identity.publicKey,
        signature: await identity.sign(payload),
        signedAt: signedAtMs,
        nonce
      }
    };
  }
  async acceptHello(hello, plan) {
    const token = hello.auth?.deviceToken?.trim();
    if (!token || !plan.identity) {
      return;
    }
    await this.deps.tokenStore.store({
      clientId: plan.clientId,
      deviceId: plan.identity.deviceId,
      role: hello.auth?.role ?? plan.role,
      token,
      scopes: hello.auth?.scopes ?? []
    });
  }
  async clearStoredToken(plan) {
    if (!plan.identity) {
      return;
    }
    await this.deps.tokenStore.clear({
      clientId: plan.clientId,
      deviceId: plan.identity.deviceId,
      role: plan.role
    });
  }
};

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
var DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS = 15e3;

// packages/gateway-protocol/src/client-info.ts
function normalizeOptionalLowercaseString(raw) {
  if (typeof raw !== "string") {
    return void 0;
  }
  const normalized2 = raw.trim().toLowerCase();
  return normalized2 || void 0;
}
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
var GATEWAY_CLIENT_CAPS = {
  APPROVALS: "approvals",
  EXEC_APPROVALS: "exec-approvals",
  INLINE_WIDGETS: "inline-widgets",
  RUN_TOOL_BINDINGS: "run-tool-bindings",
  SESSION_SCOPED_EVENTS: "session-scoped-events",
  PLUGIN_APPROVALS: "plugin-approvals",
  TASK_SUGGESTIONS: "task-suggestions",
  TERMINAL_OFFSET_SEQ: "terminal-offset-seq",
  TOOL_EVENTS: "tool-events",
  UI_COMMANDS: "ui-commands"
};
var GATEWAY_CLIENT_ID_SET = new Set(Object.values(GATEWAY_CLIENT_IDS));
var GATEWAY_CLIENT_MODE_SET = new Set(Object.values(GATEWAY_CLIENT_MODES));
function normalizeGatewayClientId(raw) {
  const normalized2 = normalizeOptionalLowercaseString(raw);
  if (!normalized2) {
    return void 0;
  }
  return GATEWAY_CLIENT_ID_SET.has(normalized2) ? normalized2 : void 0;
}
function normalizeGatewayClientName(raw) {
  return normalizeGatewayClientId(raw);
}
function normalizeGatewayClientMode(raw) {
  const normalized2 = normalizeOptionalLowercaseString(raw);
  if (!normalized2) {
    return void 0;
  }
  return GATEWAY_CLIENT_MODE_SET.has(normalized2) ? normalized2 : void 0;
}
function hasGatewayClientCap(caps, cap) {
  if (!Array.isArray(caps)) {
    return false;
  }
  return caps.includes(cap);
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

// packages/gateway-protocol/src/startup-unavailable.ts
var GATEWAY_STARTUP_UNAVAILABLE_REASON = "startup-sidecars";
var GATEWAY_STARTUP_PENDING_CLOSE_CAUSE = "startup-sidecars-pending";
var GATEWAY_STARTUP_CLOSE_CODE = 1013;
var GATEWAY_STARTUP_CLOSE_REASON = "gateway starting";
var GATEWAY_STARTUP_RETRY_AFTER_MS = 500;
var GATEWAY_STARTUP_RETRY_MIN_MS = 100;
var GATEWAY_STARTUP_RETRY_MAX_MS = 2e3;
function gatewayStartupUnavailableDetails() {
  return { reason: GATEWAY_STARTUP_UNAVAILABLE_REASON };
}
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
var MIN_NODE_PROTOCOL_VERSION = 3;
var MIN_PROBE_PROTOCOL_VERSION = 3;
export {
  ConnectErrorDetailCodes,
  DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS,
  ErrorCodes,
  GATEWAY_CLIENT_CAPS,
  GATEWAY_CLIENT_IDS,
  GATEWAY_CLIENT_MODES,
  GATEWAY_CLIENT_NAMES,
  GATEWAY_STARTUP_CLOSE_CODE,
  GATEWAY_STARTUP_CLOSE_REASON,
  GATEWAY_STARTUP_PENDING_CLOSE_CAUSE,
  GATEWAY_STARTUP_RETRY_AFTER_MS,
  GATEWAY_STARTUP_UNAVAILABLE_REASON,
  GatewayBrowserDeviceAuthLifecycle,
  GatewayErrorDetailCodes,
  GatewayProtocolClient,
  GatewayProtocolRequestError,
  MIN_CLIENT_PROTOCOL_VERSION,
  MIN_NODE_PROTOCOL_VERSION,
  MIN_PROBE_PROTOCOL_VERSION,
  PROTOCOL_VERSION,
  buildDeviceAuthPayload,
  buildDeviceAuthPayloadV3,
  buildGatewayConnectAuth,
  buildPairingConnectCloseReason,
  buildPairingConnectErrorDetails,
  buildPairingConnectErrorMessage,
  buildPairingConnectRecoveryTitle,
  describePairingConnectRequirement,
  formatConnectErrorMessage,
  formatConnectPairingRequiredMessage,
  gatewayStartupUnavailableDetails,
  hasGatewayClientCap,
  isMcpAppViewExpiredError,
  isRetryableGatewayStartupUnavailableError,
  normalizeDeviceMetadataForAuth,
  normalizeGatewayClientId,
  normalizeGatewayClientMode,
  normalizeGatewayClientName,
  normalizePairingConnectRequestId,
  readConnectErrorDetailCode,
  readConnectErrorRecoveryAdvice,
  readConnectPairingRequiredMessage,
  readMissingScopeError,
  readMissingScopeErrorDetails,
  readPairingConnectErrorDetails,
  resolveAuthConnectErrorDetailCode,
  resolveDeviceAuthConnectErrorDetailCode,
  resolveGatewayConnectScopes,
  resolveGatewayStartupRetryAfterMs,
  selectGatewayConnectAuth,
  shouldPauseGatewayReconnect,
  shouldRetryGatewayWithDeviceToken
};
