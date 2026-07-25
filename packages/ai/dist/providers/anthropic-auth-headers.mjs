// packages/ai/src/providers/anthropic-auth-headers.ts
function usesFoundryBearerAuth(model) {
  return model.provider === "microsoft-foundry" && (model.authHeader === true || hasBearerAuthorizationHeader(model.headers));
}
function hasBearerAuthorizationHeader(headers) {
  if (!headers) {
    return false;
  }
  return Object.entries(headers).some(
    ([key, value]) => key.toLowerCase() === "authorization" && /^bearer\s+\S+/i.test(value.trim())
  );
}
function omitFoundryBearerCredentialHeaders(headers) {
  if (!headers) {
    return void 0;
  }
  const next = {};
  for (const [key, value] of Object.entries(headers)) {
    const lower = key.toLowerCase();
    if (lower === "authorization" || lower === "x-api-key" || lower === "api-key") {
      continue;
    }
    next[key] = value;
  }
  return Object.keys(next).length > 0 ? next : void 0;
}
export {
  omitFoundryBearerCredentialHeaders,
  usesFoundryBearerAuth
};
