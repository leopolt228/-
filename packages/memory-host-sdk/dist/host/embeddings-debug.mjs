// packages/normalization-core/src/string-coerce.ts
function normalizeNullableString(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
function normalizeOptionalString(value) {
  return normalizeNullableString(value) ?? void 0;
}
function normalizeOptionalLowercaseString(value) {
  return normalizeOptionalString(value)?.toLowerCase();
}
function normalizeLowercaseStringOrEmpty(value) {
  return normalizeOptionalLowercaseString(value) ?? "";
}

// packages/memory-host-sdk/src/host/embeddings-debug.ts
var debugEmbeddings = isTruthyEnvValue(process.env.OPENCLAW_DEBUG_MEMORY_EMBEDDINGS);
function debugEmbeddingsLog(message, meta) {
  if (!debugEmbeddings) {
    return;
  }
  const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
  process.stderr.write(`${message}${suffix}
`);
}
function isTruthyEnvValue(value) {
  switch (normalizeLowercaseStringOrEmpty(value)) {
    case "1":
    case "on":
    case "true":
    case "yes":
      return true;
    default:
      return false;
  }
}
export {
  debugEmbeddingsLog
};
