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

// packages/model-catalog-core/src/model-catalog-refs.ts
function normalizeModelCatalogProviderId(provider) {
  return normalizeLowercaseStringOrEmpty(provider);
}
function buildModelCatalogRef(provider, modelId) {
  return `${normalizeModelCatalogProviderId(provider)}/${modelId}`;
}
function parseProviderModelRef(value) {
  const trimmed = value.trim();
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex <= 0 || slashIndex >= trimmed.length - 1) {
    return null;
  }
  const provider = trimmed.slice(0, slashIndex).trim();
  const model = trimmed.slice(slashIndex + 1).trim();
  return provider && model ? { provider, model } : null;
}
function parseModelCatalogRef(value) {
  const parsed = parseProviderModelRef(value);
  if (!parsed) {
    return null;
  }
  return {
    provider: normalizeModelCatalogProviderId(parsed.provider),
    modelId: parsed.model
  };
}
function buildModelCatalogMergeKey(provider, modelId) {
  return `${normalizeModelCatalogProviderId(provider)}::${normalizeLowercaseStringOrEmpty(modelId)}`;
}
export {
  buildModelCatalogMergeKey,
  buildModelCatalogRef,
  normalizeModelCatalogProviderId,
  parseModelCatalogRef,
  parseProviderModelRef
};
