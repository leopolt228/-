// packages/ai/src/utils/provider-error.ts
var MAX_ERROR_BODY_LENGTH = 4e3;
function stringify(value) {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}
function readStatus(error) {
  for (const value of [
    error.status,
    error.statusCode,
    error.response?.status,
    error.response?.statusCode
  ]) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return void 0;
}
function readBody(error) {
  for (const value of [error.body, error.error, error.response?.body, error.response?.data]) {
    if (value === void 0 || value === null) {
      continue;
    }
    if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) {
      continue;
    }
    const body = (typeof value === "string" ? value : stringify(value)).trim();
    if (body.length > 0) {
      return body.length <= MAX_ERROR_BODY_LENGTH ? body : `${body.slice(0, MAX_ERROR_BODY_LENGTH)}... [truncated]`;
    }
  }
  return void 0;
}
function formatProviderError(error) {
  if (!(error instanceof Error)) {
    return stringify(error);
  }
  const httpError = error;
  const status = readStatus(httpError);
  const body = readBody(httpError);
  if (status === void 0 || body === void 0 || error.message.includes(body)) {
    return error.message;
  }
  return `${status}: ${body}`;
}
export {
  formatProviderError
};
