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
export {
  GATEWAY_STARTUP_CLOSE_CODE,
  GATEWAY_STARTUP_CLOSE_REASON,
  GATEWAY_STARTUP_PENDING_CLOSE_CAUSE,
  GATEWAY_STARTUP_RETRY_AFTER_MS,
  GATEWAY_STARTUP_UNAVAILABLE_REASON,
  gatewayStartupUnavailableDetails,
  isRetryableGatewayStartupUnavailableError,
  resolveGatewayStartupRetryAfterMs
};
