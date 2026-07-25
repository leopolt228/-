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

// packages/model-catalog-core/src/provider-model-id-normalize.ts
var GOOGLE_PROVIDER_PREFIX = "google/";
function normalizeGooglePreviewModelId(id) {
  if (id.startsWith(GOOGLE_PROVIDER_PREFIX)) {
    const modelId = id.slice(GOOGLE_PROVIDER_PREFIX.length);
    const normalizedModelId = normalizeGooglePreviewModelId(modelId);
    return normalizedModelId === modelId ? id : `${GOOGLE_PROVIDER_PREFIX}${normalizedModelId}`;
  }
  if (id === "gemini-3-pro" || id === "gemini-3-pro-preview") {
    return "gemini-3.1-pro-preview";
  }
  if (id === "gemini-3-flash") {
    return "gemini-3-flash-preview";
  }
  if (id === "gemini-3.1-pro") {
    return "gemini-3.1-pro-preview";
  }
  if (id === "gemini-3.1-flash-lite-preview") {
    return "gemini-3.1-flash-lite";
  }
  if (id === "gemini-3.1-flash" || id === "gemini-3.1-flash-preview") {
    return "gemini-3-flash-preview";
  }
  if (id === "gemma-4-26b") {
    return "gemma-4-26b-a4b-it";
  }
  return id;
}
function normalizeTogetherModelId(id) {
  if (id === "moonshotai/Kimi-K2.5") {
    return "moonshotai/Kimi-K2.6";
  }
  return id;
}

// packages/model-catalog-core/src/provider-model-id-normalization.ts
var currentManifestModelIdNormalizationPolicies;
function collectManifestModelIdNormalizationPolicies(plugins) {
  const policies = /* @__PURE__ */ new Map();
  for (const plugin of plugins) {
    for (const [provider, policy] of Object.entries(plugin.modelIdNormalization?.providers ?? {})) {
      policies.set(normalizeLowercaseStringOrEmpty(provider), policy);
    }
  }
  return policies;
}
function setCurrentManifestModelIdNormalizationRecords(plugins) {
  currentManifestModelIdNormalizationPolicies = plugins ? collectManifestModelIdNormalizationPolicies(plugins) : void 0;
}
function getCurrentManifestModelIdNormalizationPolicies() {
  return currentManifestModelIdNormalizationPolicies;
}
function hasProviderPrefix(modelId) {
  return modelId.includes("/");
}
function formatPrefixedModelId(prefix, modelId) {
  return `${prefix.replace(/\/+$/u, "")}/${modelId.replace(/^\/+/u, "")}`;
}
function stripSelfProviderModelPrefix(provider, model) {
  const prefix = `${normalizeLowercaseStringOrEmpty(provider)}/`;
  const trimmed = model.trim();
  return normalizeLowercaseStringOrEmpty(trimmed).startsWith(prefix) ? trimmed.slice(prefix.length) : model;
}
function normalizeProviderModelIdWithPolicies(params) {
  const policy = params.policies.get(normalizeLowercaseStringOrEmpty(params.provider));
  if (!policy) {
    return void 0;
  }
  let modelId = params.context.modelId.trim();
  if (!modelId) {
    return modelId;
  }
  for (const prefix of policy.stripPrefixes ?? []) {
    const normalizedPrefix = normalizeLowercaseStringOrEmpty(prefix);
    if (normalizedPrefix && normalizeLowercaseStringOrEmpty(modelId).startsWith(normalizedPrefix)) {
      modelId = modelId.slice(normalizedPrefix.length);
      break;
    }
  }
  modelId = policy.aliases?.[normalizeLowercaseStringOrEmpty(modelId)] ?? modelId;
  if (!hasProviderPrefix(modelId)) {
    for (const rule of policy.prefixWhenBareAfterAliasStartsWith ?? []) {
      if (normalizeLowercaseStringOrEmpty(modelId).startsWith(rule.modelPrefix.toLowerCase())) {
        return formatPrefixedModelId(rule.prefix, modelId);
      }
    }
    if (policy.prefixWhenBare) {
      return formatPrefixedModelId(policy.prefixWhenBare, modelId);
    }
  }
  return modelId;
}
function normalizeBuiltInProviderModelId(provider, model) {
  const normalizedProvider = normalizeLowercaseStringOrEmpty(provider);
  if (normalizedProvider === "google" || normalizedProvider === "google-gemini-cli" || normalizedProvider === "google-vertex") {
    return normalizeGooglePreviewModelId(model);
  }
  if (normalizedProvider === "openrouter") {
    const trimmed = model.trim();
    return trimmed && !trimmed.includes("/") ? `openrouter/${trimmed}` : model;
  }
  if (normalizedProvider === "anthropic") {
    const anthropicAliases = {
      "opus-4.8": "claude-opus-4-8",
      opus: "claude-opus-4-8",
      "opus-4.6": "claude-opus-4-6",
      "sonnet-5": "claude-sonnet-5",
      sonnet: "claude-sonnet-5",
      "sonnet-4.6": "claude-sonnet-4-6"
    };
    const anthropicPrefix = "anthropic/";
    const normalizedModel = normalizeLowercaseStringOrEmpty(model);
    const providerModel = normalizedModel.startsWith(anthropicPrefix) ? model.trim().slice(anthropicPrefix.length) : model;
    return anthropicAliases[normalizeLowercaseStringOrEmpty(providerModel)] ?? providerModel;
  }
  if (normalizedProvider === "vercel-ai-gateway") {
    const vercelAliases = {
      "opus-4.6": "claude-opus-4-6",
      "sonnet-5": "claude-sonnet-5",
      sonnet: "claude-sonnet-4-6",
      "sonnet-4.6": "claude-sonnet-4-6"
    };
    const aliased = vercelAliases[normalizeLowercaseStringOrEmpty(model)] ?? model;
    return normalizeLowercaseStringOrEmpty(aliased).startsWith("claude-") ? `anthropic/${aliased}` : aliased;
  }
  if (normalizedProvider === "huggingface") {
    const prefix = "huggingface/";
    return normalizeLowercaseStringOrEmpty(model).startsWith(prefix) ? model.slice(prefix.length) : model;
  }
  if (normalizedProvider === "nvidia") {
    const trimmed = model.trim();
    return trimmed && !trimmed.includes("/") ? `nvidia/${trimmed}` : model;
  }
  if (normalizedProvider === "xai") {
    const xaiAliases = {
      "grok-4.3-latest": "grok-4.3",
      "grok-4.5-latest": "grok-4.5",
      "grok-build-latest": "grok-4.5",
      "grok-4-fast-reasoning": "grok-4-fast",
      "grok-4-1-fast-reasoning": "grok-4-1-fast"
    };
    return xaiAliases[normalizeLowercaseStringOrEmpty(model)] ?? model;
  }
  if (normalizedProvider === "openai") {
    return model;
  }
  if (normalizedProvider === "together") {
    return normalizeTogetherModelId(model);
  }
  return model;
}
function normalizeStaticProviderModelIdWithPolicies(provider, model, policies) {
  const normalizedProvider = normalizeLowercaseStringOrEmpty(provider);
  const manifestModelId = policies ? normalizeProviderModelIdWithPolicies({
    provider: normalizedProvider,
    policies,
    context: {
      modelId: model
    }
  }) ?? model : model;
  return normalizeBuiltInProviderModelId(normalizedProvider, manifestModelId);
}
function normalizeConfiguredProviderCatalogModelId(provider, model, policies = getCurrentManifestModelIdNormalizationPolicies()) {
  const providerModel = normalizeStaticProviderModelIdWithPolicies(provider, model, policies);
  return normalizeConfiguredProviderCatalogModelRef(providerModel);
}
function normalizeConfiguredProviderCatalogModelRef(providerModel) {
  const googlePrefix = "google/";
  if (!providerModel.startsWith(googlePrefix)) {
    const parsed = parseModelCatalogRef(providerModel);
    if (!parsed) {
      return providerModel;
    }
    if (!parsed.modelId.startsWith(googlePrefix)) {
      return providerModel;
    }
    const normalizedModelId2 = normalizeGooglePreviewModelId(parsed.modelId);
    return normalizedModelId2 === parsed.modelId ? providerModel : `${parsed.provider}/${normalizedModelId2}`;
  }
  const modelId = providerModel.slice(googlePrefix.length);
  const normalizedModelId = normalizeGooglePreviewModelId(modelId);
  return normalizedModelId === modelId ? providerModel : `${googlePrefix}${normalizedModelId}`;
}
export {
  collectManifestModelIdNormalizationPolicies,
  normalizeBuiltInProviderModelId,
  normalizeConfiguredProviderCatalogModelId,
  normalizeConfiguredProviderCatalogModelRef,
  normalizeProviderModelIdWithPolicies,
  normalizeStaticProviderModelIdWithPolicies,
  setCurrentManifestModelIdNormalizationRecords,
  stripSelfProviderModelPrefix
};
