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
function readConnectErrorDetailCode(details) {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return null;
  }
  const code = details.code;
  return typeof code === "string" && code.trim().length > 0 ? code.trim() : null;
}
function normalizePairingConnectReason(value) {
  const normalized = normalizeOptionalString(value) ?? "";
  return CONNECT_PAIRING_REQUIRED_REASON_VALUES.has(normalized) ? normalized : void 0;
}
function normalizePairingConnectRequestId(value) {
  const normalized = normalizeOptionalString(value);
  return normalized && PAIRING_CONNECT_REQUEST_ID_PATTERN.test(normalized) ? normalized : void 0;
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
export {
  shouldPauseGatewayReconnect
};
