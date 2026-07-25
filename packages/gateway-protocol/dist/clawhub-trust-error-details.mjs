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
export {
  ClawHubTrustErrorCodes,
  buildClawHubTrustErrorDetails,
  isClawHubTrustErrorCode,
  readClawHubTrustErrorDetails
};
