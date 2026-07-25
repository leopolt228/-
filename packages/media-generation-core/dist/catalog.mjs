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

// packages/media-generation-core/src/string.ts
function uniqueTrimmedStrings(values) {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const value of values) {
    const normalized = normalizeOptionalString(value);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}

// packages/media-generation-core/src/catalog.ts
function uniqueModels(provider) {
  return uniqueTrimmedStrings([provider.defaultModel, ...provider.models ?? []]);
}
function synthesizeMediaGenerationCatalogEntries(params) {
  const defaultModel = uniqueTrimmedStrings([params.provider.defaultModel])[0];
  return uniqueModels(params.provider).map((model) => {
    const modelCatalogEntry = params.provider.catalogByModel?.[model];
    const entry = {
      kind: params.kind,
      provider: params.provider.id,
      model,
      source: "static",
      capabilities: modelCatalogEntry?.capabilities ?? params.provider.capabilities
    };
    if (params.provider.label) {
      entry.label = params.provider.label;
    }
    if (model === defaultModel) {
      entry.default = true;
    }
    const modes = modelCatalogEntry?.modes ?? params.modes;
    if (modes) {
      entry.modes = modes;
    }
    return entry;
  });
}
function listMediaGenerationProviderModels(provider) {
  return uniqueModels(provider);
}
export {
  listMediaGenerationProviderModels,
  synthesizeMediaGenerationCatalogEntries
};
