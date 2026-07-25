// packages/ai/src/api-registry.ts
function wrapStream(api, stream) {
  return (model, context, options) => {
    if (model.api !== api) {
      throw new Error(`Mismatched api: ${model.api} expected ${api}`);
    }
    return stream(model, context, options);
  };
}
function wrapStreamSimple(api, streamSimple) {
  return (model, context, options) => {
    if (model.api !== api) {
      throw new Error(`Mismatched api: ${model.api} expected ${api}`);
    }
    return streamSimple(model, context, options);
  };
}
function createApiRegistry() {
  const providers = /* @__PURE__ */ new Map();
  function registerApiProvider(provider, sourceId) {
    providers.set(provider.api, {
      provider: {
        api: provider.api,
        stream: wrapStream(provider.api, provider.stream),
        streamSimple: wrapStreamSimple(provider.api, provider.streamSimple)
      },
      sourceId
    });
  }
  function getApiProvider(api) {
    return providers.get(api)?.provider;
  }
  function getApiProviders() {
    return Array.from(providers.values(), (entry) => entry.provider);
  }
  function unregisterApiProviders(sourceId) {
    for (const [api, entry] of providers.entries()) {
      if (entry.sourceId === sourceId) {
        providers.delete(api);
      }
    }
  }
  return {
    registerApiProvider,
    getApiProvider,
    getApiProviders,
    unregisterApiProviders,
    clearApiProviders: () => providers.clear()
  };
}
export {
  createApiRegistry
};
