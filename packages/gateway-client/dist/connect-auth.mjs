// packages/gateway-protocol/src/connect-error-details.ts
function normalizeOptionalString(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed || void 0;
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
export {
  buildGatewayConnectAuth,
  resolveGatewayConnectScopes,
  selectGatewayConnectAuth,
  shouldRetryGatewayWithDeviceToken
};
