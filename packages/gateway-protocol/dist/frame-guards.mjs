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
export {
  isGatewayEventFrame,
  isGatewayResponseFrame
};
