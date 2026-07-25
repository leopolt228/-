// packages/plugin-sdk/src/provider-web-search-config-contract.ts
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function resolvePluginWebSearchConfig(config, pluginId) {
  const pluginConfig = config?.plugins?.entries?.[pluginId]?.config;
  if (!isRecord(pluginConfig)) {
    return void 0;
  }
  return isRecord(pluginConfig.webSearch) ? pluginConfig.webSearch : void 0;
}
var LEGACY_WEB_SEARCH_PROVIDER_CONFIG_KEYS = /* @__PURE__ */ new Set([
  "brave",
  "duckduckgo",
  "exa",
  "firecrawl",
  "gemini",
  "grok",
  "kimi",
  "minimax",
  "ollama",
  "perplexity",
  "searxng",
  "tavily"
]);
function isLegacyWebSearchProviderConfigKey(key) {
  return LEGACY_WEB_SEARCH_PROVIDER_CONFIG_KEYS.has(key);
}
function getTopLevelCredentialValue(searchConfig) {
  return searchConfig?.apiKey;
}
function setTopLevelCredentialValue(searchConfigTarget, value) {
  searchConfigTarget.apiKey = value;
}
function getScopedCredentialValue(searchConfig, key) {
  const scoped = searchConfig?.[key];
  if (!scoped || typeof scoped !== "object" || Array.isArray(scoped)) {
    return void 0;
  }
  return scoped.apiKey;
}
function setScopedCredentialValue(searchConfigTarget, key, value) {
  const scoped = searchConfigTarget[key];
  if (!scoped || typeof scoped !== "object" || Array.isArray(scoped)) {
    searchConfigTarget[key] = { apiKey: value };
    return;
  }
  scoped.apiKey = value;
}
function mergeScopedSearchConfig(searchConfig, key, pluginConfig, options) {
  const next = { ...searchConfig };
  delete next.apiKey;
  if (isLegacyWebSearchProviderConfigKey(key)) {
    delete next[key];
  }
  if (!pluginConfig) {
    return Object.keys(next).length > 0 ? next : void 0;
  }
  Object.defineProperty(next, key, {
    value: { ...pluginConfig },
    enumerable: false,
    configurable: true,
    writable: true
  });
  if (options?.mirrorApiKeyToTopLevel && pluginConfig.apiKey !== void 0) {
    next.apiKey = pluginConfig.apiKey;
  }
  return next;
}
function resolveProviderWebSearchPluginConfig(config, pluginId) {
  return resolvePluginWebSearchConfig(config, pluginId);
}
function ensureObject(target, key) {
  const current = target[key];
  if (current && typeof current === "object" && !Array.isArray(current)) {
    return current;
  }
  const next = {};
  target[key] = next;
  return next;
}
function setProviderWebSearchPluginConfigValue(configTarget, pluginId, key, value) {
  const plugins = ensureObject(configTarget, "plugins");
  const entries = ensureObject(plugins, "entries");
  const entry = ensureObject(entries, pluginId);
  if (entry.enabled === void 0) {
    entry.enabled = true;
  }
  const config = ensureObject(entry, "config");
  const webSearch = ensureObject(config, "webSearch");
  webSearch[key] = value;
}
function createSearchCredentialFields(credential) {
  switch (credential.type) {
    case "scoped":
      return {
        getCredentialValue: (searchConfig) => getScopedCredentialValue(searchConfig, credential.scopeId),
        setCredentialValue: (searchConfigTarget, value) => setScopedCredentialValue(searchConfigTarget, credential.scopeId, value)
      };
    case "top-level":
      return {
        getCredentialValue: getTopLevelCredentialValue,
        setCredentialValue: setTopLevelCredentialValue
      };
    case "none":
      return {
        getCredentialValue: () => void 0,
        setCredentialValue: () => {
        }
      };
  }
  throw new Error("Unsupported web search credential type");
}
function createConfiguredCredentialFields(configuredCredential) {
  if (!configuredCredential) {
    return null;
  }
  const field = configuredCredential.field ?? "apiKey";
  return {
    getConfiguredCredentialValue: (config) => resolveProviderWebSearchPluginConfig(config, configuredCredential.pluginId)?.[field],
    setConfiguredCredentialValue: (configTarget, value) => {
      setProviderWebSearchPluginConfigValue(
        configTarget,
        configuredCredential.pluginId,
        field,
        value
      );
    }
  };
}
function createBaseWebSearchProviderContractFields(options) {
  const configuredCredentialFields = createConfiguredCredentialFields(options.configuredCredential);
  return {
    inactiveSecretPaths: options.inactiveSecretPaths ?? (options.credentialPath ? [options.credentialPath] : []),
    ...createSearchCredentialFields(options.searchCredential),
    ...configuredCredentialFields
  };
}
export {
  createBaseWebSearchProviderContractFields as createWebSearchProviderContractFields,
  getScopedCredentialValue,
  getTopLevelCredentialValue,
  mergeScopedSearchConfig,
  resolveProviderWebSearchPluginConfig,
  setProviderWebSearchPluginConfigValue,
  setScopedCredentialValue,
  setTopLevelCredentialValue
};
