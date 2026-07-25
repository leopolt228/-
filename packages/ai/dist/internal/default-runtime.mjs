// packages/ai/src/api-registry.ts
function wrapStream(api, stream2) {
  return (model, context, options) => {
    if (model.api !== api) {
      throw new Error(`Mismatched api: ${model.api} expected ${api}`);
    }
    return stream2(model, context, options);
  };
}
function wrapStreamSimple(api, streamSimple2) {
  return (model, context, options) => {
    if (model.api !== api) {
      throw new Error(`Mismatched api: ${model.api} expected ${api}`);
    }
    return streamSimple2(model, context, options);
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
  function getApiProvider2(api) {
    return providers.get(api)?.provider;
  }
  function getApiProviders2() {
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
    getApiProvider: getApiProvider2,
    getApiProviders: getApiProviders2,
    unregisterApiProviders,
    clearApiProviders: () => providers.clear()
  };
}

// packages/ai/src/stream.ts
function createLlmRuntime(registry = createApiRegistry()) {
  function resolveApiProvider(api) {
    const provider = registry.getApiProvider(api);
    if (!provider) {
      throw new Error(`No API provider registered for api: ${api}`);
    }
    return provider;
  }
  function stream2(model, context, options) {
    return resolveApiProvider(model.api).stream(model, context, options);
  }
  async function complete2(model, context, options) {
    return stream2(model, context, options).result();
  }
  function streamSimple2(model, context, options) {
    return resolveApiProvider(model.api).streamSimple(model, context, options);
  }
  async function completeSimple2(model, context, options) {
    return streamSimple2(model, context, options).result();
  }
  return { registry, stream: stream2, complete: complete2, streamSimple: streamSimple2, completeSimple: completeSimple2 };
}

// packages/ai/src/internal/default-runtime.ts
var DEFAULT_RUNTIME_KEY = /* @__PURE__ */ Symbol.for("openclaw.ai.defaultRuntime");
function resolveDefaultRuntime() {
  const globalStore = globalThis;
  if (Object.hasOwn(globalStore, DEFAULT_RUNTIME_KEY)) {
    return globalStore[DEFAULT_RUNTIME_KEY];
  }
  const registry = createApiRegistry();
  const runtime = createLlmRuntime(registry);
  const state = { registry, runtime };
  globalStore[DEFAULT_RUNTIME_KEY] = state;
  return state;
}
var defaultRuntime = resolveDefaultRuntime();
var defaultApiRegistry = defaultRuntime.registry;
var defaultLlmRuntime = defaultRuntime.runtime;
var { getApiProvider, getApiProviders } = defaultApiRegistry;
function clearApiProviders() {
  defaultApiRegistry.clearApiProviders();
}
var { stream, complete, streamSimple, completeSimple } = defaultLlmRuntime;
export {
  clearApiProviders,
  complete,
  completeSimple,
  defaultApiRegistry,
  defaultLlmRuntime,
  getApiProvider,
  getApiProviders,
  stream,
  streamSimple
};
