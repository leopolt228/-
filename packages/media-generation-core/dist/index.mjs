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

// packages/media-generation-core/src/capability-model-ref.ts
function normalizeProviderForMatch(value, normalizeProviderId) {
  const normalized = normalizeOptionalString(value);
  return normalized && normalizeProviderId ? normalizeProviderId(normalized) : normalized;
}
function findCapabilityProviderById(params) {
  const selectedProvider = normalizeProviderForMatch(params.providerId, params.normalizeProviderId);
  if (!selectedProvider) {
    return void 0;
  }
  return params.providers.find((provider) => {
    const providerId = normalizeProviderForMatch(provider.id, params.normalizeProviderId);
    return providerId === selectedProvider || (provider.aliases ?? []).some(
      (alias) => normalizeProviderForMatch(alias, params.normalizeProviderId) === selectedProvider
    );
  });
}
function resolveCapabilityProviderModelOnlyRef(params) {
  const model = normalizeOptionalString(params.raw);
  if (!model) {
    return null;
  }
  const provider = params.providers.find((candidate) => {
    const models = [candidate.defaultModel, ...candidate.models ?? []];
    return models.some((entry) => normalizeOptionalString(entry) === model);
  });
  return provider ? { provider: provider.id, model } : null;
}
function resolveCapabilityModelRefForProviders(params) {
  const raw = normalizeOptionalString(params.raw);
  if (!raw) {
    return null;
  }
  const parsed = params.parseModelRef(raw);
  if (parsed && findCapabilityProviderById({
    providers: params.providers,
    providerId: parsed.provider,
    normalizeProviderId: params.normalizeProviderId
  })) {
    return parsed;
  }
  return resolveCapabilityProviderModelOnlyRef({ providers: params.providers, raw }) ?? parsed;
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

// packages/model-catalog-core/src/model-catalog-refs.ts
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

// packages/media-generation-core/src/model-ref.ts
function parseGenerationModelRef(raw) {
  return raw === void 0 ? null : parseProviderModelRef(raw);
}

// packages/media-generation-core/src/normalization.ts
function hasMediaNormalizationEntry(entry) {
  return Boolean(
    entry && (entry.requested !== void 0 || entry.applied !== void 0 || entry.derivedFrom !== void 0 || (entry.supportedValues?.length ?? 0) > 0)
  );
}
export {
  findCapabilityProviderById,
  hasMediaNormalizationEntry,
  listMediaGenerationProviderModels,
  parseGenerationModelRef,
  resolveCapabilityModelRefForProviders,
  resolveCapabilityProviderModelOnlyRef,
  synthesizeMediaGenerationCatalogEntries
};
