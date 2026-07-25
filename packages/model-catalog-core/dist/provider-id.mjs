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

// packages/model-catalog-core/src/provider-id.ts
function normalizeProviderId(provider) {
  return normalizeLowercaseStringOrEmpty(provider);
}
function normalizeProviderIdForAuth(provider) {
  return normalizeProviderId(provider);
}
function findNormalizedProviderValue(entries, provider) {
  if (!entries) {
    return void 0;
  }
  const providerKey = normalizeProviderId(provider);
  for (const [key, value] of Object.entries(entries)) {
    if (normalizeProviderId(key) === providerKey) {
      return value;
    }
  }
  return void 0;
}
function findNormalizedProviderKey(entries, provider) {
  if (!entries) {
    return void 0;
  }
  const providerKey = normalizeProviderId(provider);
  return Object.keys(entries).find((key) => normalizeProviderId(key) === providerKey);
}
export {
  findNormalizedProviderKey,
  findNormalizedProviderValue,
  normalizeLowercaseStringOrEmpty,
  normalizeProviderId,
  normalizeProviderIdForAuth
};
