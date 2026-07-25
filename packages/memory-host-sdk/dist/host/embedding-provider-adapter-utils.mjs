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

// packages/memory-host-sdk/src/host/embedding-provider-adapter-utils.ts
function isMissingEmbeddingApiKeyError(err) {
  return err instanceof Error && err.message.includes("No API key found for provider");
}
function sanitizeEmbeddingCacheHeaders(headers, excludedHeaderNames) {
  const excluded = new Set(
    excludedHeaderNames.map((name) => normalizeLowercaseStringOrEmpty(name))
  );
  return Object.entries(headers).filter(([key]) => !excluded.has(normalizeLowercaseStringOrEmpty(key))).toSorted(([a], [b]) => a.localeCompare(b)).map(([key, value]) => [key, value]);
}
function mapBatchEmbeddingsByIndex(byCustomId, count) {
  const embeddings = [];
  for (let index = 0; index < count; index += 1) {
    embeddings.push(byCustomId.get(String(index)) ?? []);
  }
  return embeddings;
}
export {
  isMissingEmbeddingApiKeyError,
  mapBatchEmbeddingsByIndex,
  sanitizeEmbeddingCacheHeaders
};
