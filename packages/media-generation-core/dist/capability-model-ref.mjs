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
export {
  findCapabilityProviderById,
  resolveCapabilityModelRefForProviders,
  resolveCapabilityProviderModelOnlyRef
};
