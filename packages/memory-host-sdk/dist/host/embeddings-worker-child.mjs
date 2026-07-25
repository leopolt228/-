// packages/normalization-core/src/expect.ts
function expectDefined(value, context) {
  if (value === null || value === void 0) {
    throw new Error("expected " + context + " to be defined");
  }
  return value;
}

// packages/normalization-core/src/number-coercion.ts
var MAX_TIMER_TIMEOUT_MS = 2147e6;
var MAX_TIMER_TIMEOUT_SECONDS = Math.floor(MAX_TIMER_TIMEOUT_MS / 1e3);

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

// packages/retry/src/index.ts
var MAX_TIMER_TIMEOUT_MS2 = 2147e6;
var DEFAULT_RETRY_CONFIG = {
  attempts: 3,
  minDelayMs: 300,
  maxDelayMs: 3e4,
  jitter: 0
};
var defaultSleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});
function asFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function clampNumber(value, fallback, min, max) {
  const next = asFiniteNumber(value);
  if (next === void 0) {
    return fallback;
  }
  return Math.min(Math.max(next, min ?? Number.NEGATIVE_INFINITY), max ?? Number.POSITIVE_INFINITY);
}
function resolveAttemptCount(value, fallback) {
  return Math.max(1, Math.round(asFiniteNumber(value) ?? fallback));
}
function resolveRetryDelayMs(value) {
  const finite = value === Number.POSITIVE_INFINITY ? MAX_TIMER_TIMEOUT_MS2 : asFiniteNumber(value) ?? 0;
  return Math.min(Math.max(Math.round(finite), 0), MAX_TIMER_TIMEOUT_MS2);
}
function resolveJitterConfig(value, fallback) {
  if (value === "full") {
    return "full";
  }
  const fraction = asFiniteNumber(value);
  return fraction === void 0 ? fallback : Math.min(Math.max(fraction, 0), 1);
}
function resolveRetryConfig(defaults = DEFAULT_RETRY_CONFIG, overrides) {
  const attempts = resolveAttemptCount(overrides?.attempts, defaults.attempts);
  const minDelayMs = resolveRetryDelayMs(
    clampNumber(overrides?.minDelayMs, defaults.minDelayMs, 0)
  );
  const maxDelayMs = Math.max(
    minDelayMs,
    resolveRetryDelayMs(clampNumber(overrides?.maxDelayMs, defaults.maxDelayMs, 0))
  );
  return {
    attempts,
    minDelayMs,
    maxDelayMs,
    jitter: resolveJitterConfig(overrides?.jitter, defaults.jitter)
  };
}
function applyJitter(delayMs, jitter, mode, random) {
  if (jitter === "full") {
    if (mode === "symmetric") {
      return Math.max(0, Math.round(delayMs * (0.5 + random() * 0.5)));
    }
    return Math.max(0, Math.ceil(delayMs * (1 + random())));
  }
  if (jitter <= 0) {
    return mode === "positive" ? Math.ceil(delayMs) : delayMs;
  }
  const fraction = random();
  const offset = mode === "positive" ? fraction * jitter : (fraction * 2 - 1) * jitter;
  const raw = delayMs * (1 + offset);
  return Math.max(0, mode === "positive" ? Math.ceil(raw) : Math.round(raw));
}
function toRetryError(value, fallbackMessage = "Non-Error thrown") {
  if (value instanceof Error) {
    return value;
  }
  if (typeof value === "string") {
    return new Error(value);
  }
  const error = new Error(fallbackMessage, { cause: value });
  if (typeof value === "object" && value !== null || typeof value === "function") {
    Object.assign(error, value);
  }
  return error;
}
function createRetryRunner(runtime = {}) {
  const runtimeSleep = runtime.sleep ?? defaultSleep;
  const runtimeRandom = runtime.random ?? Math.random;
  const createFailure = runtime.createFailure ?? ((errors) => toRetryError(errors.at(-1) ?? new Error("Retry failed")));
  return async function retryAsync2(fn, attemptsOrOptions = 3, initialDelayMs = 300) {
    const attemptErrors = [];
    if (typeof attemptsOrOptions === "number") {
      const attempts = resolveAttemptCount(attemptsOrOptions, DEFAULT_RETRY_CONFIG.attempts);
      for (let index = 0; index < attempts; index += 1) {
        try {
          return await fn();
        } catch (err) {
          attemptErrors.push(err);
          if (index === attempts - 1) {
            break;
          }
          await runtimeSleep(resolveRetryDelayMs(initialDelayMs * 2 ** index));
        }
      }
      throw createFailure(attemptErrors);
    }
    const options = attemptsOrOptions;
    const resolved = resolveRetryConfig(DEFAULT_RETRY_CONFIG, options);
    const maxAttempts = resolved.attempts;
    const minDelayMs = resolved.minDelayMs;
    const maxDelayMs = resolved.maxDelayMs > 0 ? resolved.maxDelayMs : Number.POSITIVE_INFINITY;
    const retryAfterMaxDelayMs = options.retryAfterMaxDelayMs === void 0 ? maxDelayMs : Math.max(
      minDelayMs,
      resolveRetryDelayMs(clampNumber(options.retryAfterMaxDelayMs, maxDelayMs, 0))
    );
    const random = options.random ?? runtimeRandom;
    const sleep = options.sleep ?? runtimeSleep;
    const shouldRetry = options.shouldRetry ?? (() => true);
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await fn();
      } catch (err) {
        attemptErrors.push(err);
        if (attempt >= maxAttempts || !shouldRetry(err, attempt)) {
          break;
        }
        const context = {
          attempt,
          maxAttempts,
          err,
          label: options.label
        };
        const retryAfterMs = options.retryAfterMs?.(err);
        const hasRetryAfter = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs);
        const configuredDelay = typeof options.delayMs === "function" ? options.delayMs(context) : options.delayMs;
        const resolvedConfiguredDelay = configuredDelay === void 0 ? void 0 : resolveRetryDelayMs(configuredDelay);
        const baseDelay = hasRetryAfter ? Math.max(retryAfterMs, minDelayMs) : resolvedConfiguredDelay === void 0 ? minDelayMs * 2 ** (attempt - 1) : Math.max(resolvedConfiguredDelay, minDelayMs);
        const delayCap = hasRetryAfter ? retryAfterMaxDelayMs : maxDelayMs;
        let delay = Math.min(baseDelay, delayCap);
        const canHonorRetryAfter = hasRetryAfter && (retryAfterMs ?? 0) <= delayCap;
        const wantsPositiveDraw = resolved.jitter === "full" ? !hasRetryAfter || canHonorRetryAfter : canHonorRetryAfter;
        delay = applyJitter(
          delay,
          resolved.jitter,
          wantsPositiveDraw ? "positive" : "symmetric",
          random
        );
        delay = Math.min(Math.max(delay, minDelayMs), delayCap);
        await options.onRetry?.({ ...context, delayMs: delay });
        if (delay > 0) {
          await sleep(delay);
        }
      }
    }
    throw createFailure(attemptErrors);
  };
}
var retryAsync = createRetryRunner();

// packages/memory-host-sdk/src/host/embedding-defaults.ts
var DEFAULT_LOCAL_MODEL = "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";

// packages/memory-host-sdk/src/host/embedding-vectors.ts
function sanitizeAndNormalizeEmbedding(vec) {
  const sanitized = vec.map((value) => Number.isFinite(value) ? value : 0);
  const magnitude = Math.sqrt(sanitized.reduce((sum, value) => sum + value * value, 0));
  if (magnitude < 1e-10) {
    return sanitized;
  }
  return sanitized.map((value) => value / magnitude);
}

// packages/memory-host-sdk/src/host/local-embedding-runtime-facts.ts
var LOCAL_EMBEDDING_RUNTIME_FACTS = /* @__PURE__ */ Symbol.for("openclaw.localEmbeddingRuntimeFacts");
function attachLocalEmbeddingRuntimeFacts(target, getFacts) {
  Object.defineProperty(target, LOCAL_EMBEDDING_RUNTIME_FACTS, {
    configurable: false,
    enumerable: false,
    value: getFacts,
    writable: false
  });
}
function getLocalEmbeddingRuntimeFacts(target) {
  if (!target) {
    return void 0;
  }
  const getFacts = Reflect.get(target, LOCAL_EMBEDDING_RUNTIME_FACTS);
  return typeof getFacts === "function" ? getFacts() : void 0;
}

// packages/memory-host-sdk/src/host/node-llama.ts
var NODE_LLAMA_CPP_MODULE = "node-llama-cpp";
async function importNodeLlamaCpp(moduleSpecifier = NODE_LLAMA_CPP_MODULE) {
  return import(moduleSpecifier);
}

// packages/memory-host-sdk/src/host/embeddings.ts
function copyEmbeddingVector(vector, maxLength) {
  const length = Math.min(maxLength ?? vector.length, vector.length);
  const values = [];
  for (let index = 0; index < length; index += 1) {
    values.push(expectDefined(vector[index], `embedding value ${index}`));
  }
  return values;
}
async function disposeResources(resources) {
  let firstError;
  for (const resource of resources) {
    try {
      await resource?.dispose?.();
    } catch (err) {
      firstError ??= err;
    }
  }
  if (firstError) {
    throw toRetryError(firstError);
  }
}
async function readLlamaRuntimeFacts(llama) {
  const facts = {
    engine: "llama.cpp",
    state: "failed",
    backend: llama.gpu || "cpu",
    buildType: llama.buildType,
    offload: {
      supported: llama.supportsGpuOffloading
    }
  };
  try {
    facts.deviceNames = await llama.getGpuDeviceNames();
  } catch {
  }
  try {
    const memory = await llama.getVramState();
    facts.memory = {
      totalBytes: memory.total,
      usedBytes: memory.used,
      freeBytes: memory.free,
      unifiedBytes: memory.unifiedSize,
      observedAtMs: Date.now()
    };
  } catch {
  }
  return facts;
}
function formatRuntimeLoadError(err) {
  return err instanceof Error ? err.message : String(err);
}
async function createLocalEmbeddingProviderInProcess(options) {
  const modelPath = normalizeOptionalString(options.local?.modelPath) || DEFAULT_LOCAL_MODEL;
  const modelCacheDir = normalizeOptionalString(options.local?.modelCacheDir);
  const nodeLlamaCppImportUrl = normalizeOptionalString(
    options.local?.nodeLlamaCppImportUrl
  );
  const contextSize = options.local?.contextSize ?? 4096;
  const { getLlama, resolveModelFile, LlamaLogLevel } = await importNodeLlamaCpp(nodeLlamaCppImportUrl);
  let llama = null;
  let embeddingModel = null;
  let embeddingContext = null;
  let initPromise = null;
  let initAbortController = null;
  let closePromise = null;
  let runtimeFacts;
  let closed = false;
  const throwIfClosed = () => {
    if (closed) {
      throw new Error("Local embedding provider has been closed");
    }
  };
  const disposeAndThrowIfClosed = async (resource) => {
    if (!closed) {
      return resource;
    }
    await disposeResources([resource]);
    throwIfClosed();
    return resource;
  };
  const ensureContext = async () => {
    throwIfClosed();
    if (embeddingContext) {
      return embeddingContext;
    }
    if (initPromise) {
      return initPromise;
    }
    initPromise = (async () => {
      const abortController = new AbortController();
      initAbortController = abortController;
      try {
        if (!llama) {
          const nextLlama = await getLlama({
            logLevel: LlamaLogLevel.error
          });
          llama = await disposeAndThrowIfClosed(nextLlama);
          runtimeFacts = {
            ...await readLlamaRuntimeFacts(llama),
            context: { requestedSize: contextSize }
          };
        }
        if (!embeddingModel) {
          const resolved = await resolveModelFile(modelPath, {
            ...modelCacheDir ? { directory: modelCacheDir } : {},
            signal: abortController.signal
          });
          throwIfClosed();
          const nextModel = await llama.loadModel({
            modelPath: resolved,
            loadSignal: abortController.signal,
            ...typeof contextSize === "number" ? {
              gpuLayers: {
                fitContext: {
                  contextSize,
                  embeddingContext: true
                }
              }
            } : {}
          });
          embeddingModel = await disposeAndThrowIfClosed(nextModel);
          runtimeFacts = {
            ...runtimeFacts,
            engine: "llama.cpp",
            state: "failed",
            offload: {
              supported: llama.supportsGpuOffloading,
              offloadedLayers: embeddingModel.gpuLayers,
              totalLayers: embeddingModel.fileInsights.totalLayers
            }
          };
        }
        if (!embeddingContext) {
          const nextContext = await embeddingModel.createEmbeddingContext({
            contextSize,
            createSignal: abortController.signal
          });
          embeddingContext = await disposeAndThrowIfClosed(nextContext);
          const refreshedRuntimeFacts = await readLlamaRuntimeFacts(llama);
          runtimeFacts = {
            ...runtimeFacts,
            ...refreshedRuntimeFacts,
            engine: "llama.cpp",
            state: "ready",
            offload: {
              supported: llama.supportsGpuOffloading,
              offloadedLayers: embeddingModel.gpuLayers,
              totalLayers: embeddingModel.fileInsights.totalLayers
            },
            context: { requestedSize: contextSize },
            loadError: void 0
          };
        }
        return embeddingContext;
      } catch (err) {
        runtimeFacts = {
          ...runtimeFacts,
          engine: "llama.cpp",
          state: "failed",
          context: { requestedSize: contextSize },
          loadError: formatRuntimeLoadError(err)
        };
        initPromise = null;
        throw err;
      } finally {
        if (initAbortController === abortController) {
          initAbortController = null;
        }
      }
    })();
    return initPromise;
  };
  const outputDimensionality = typeof options.outputDimensionality === "number" ? options.outputDimensionality : void 0;
  const normalize = (vector) => sanitizeAndNormalizeEmbedding(copyEmbeddingVector(vector, outputDimensionality));
  const provider2 = {
    id: "local",
    model: modelPath,
    embedQuery: async (text, optionsValue) => {
      throwIfClosed();
      optionsValue?.signal?.throwIfAborted();
      const ctx = await ensureContext();
      throwIfClosed();
      optionsValue?.signal?.throwIfAborted();
      const embedding = await ctx.getEmbeddingFor(text);
      return normalize(embedding.vector);
    },
    embedBatch: async (texts, optionsLocal) => {
      throwIfClosed();
      optionsLocal?.signal?.throwIfAborted();
      const ctx = await ensureContext();
      throwIfClosed();
      optionsLocal?.signal?.throwIfAborted();
      const embeddings = [];
      for (const text of texts) {
        throwIfClosed();
        optionsLocal?.signal?.throwIfAborted();
        const embedding = await ctx.getEmbeddingFor(text);
        embeddings.push(normalize(embedding.vector));
      }
      return embeddings;
    },
    close: async () => {
      if (closePromise) {
        return closePromise;
      }
      closed = true;
      initAbortController?.abort();
      initAbortController = null;
      closePromise = (async () => {
        const context = embeddingContext;
        const model = embeddingModel;
        const runtime = llama;
        embeddingContext = null;
        embeddingModel = null;
        llama = null;
        initPromise = null;
        await disposeResources([context, model, runtime]);
      })();
      return closePromise;
    }
  };
  attachLocalEmbeddingRuntimeFacts(provider2, () => runtimeFacts);
  return provider2;
}

// packages/memory-host-sdk/src/host/embeddings-worker-child.ts
var provider = null;
var providerOptionsKey = null;
var requestQueue = Promise.resolve();
function send(message) {
  if (typeof process.send === "function") {
    process.send(message);
  }
}
async function getProvider(options) {
  const key = JSON.stringify(options);
  if (provider && providerOptionsKey === key) {
    return provider;
  }
  await provider?.close?.();
  provider = await createLocalEmbeddingProviderInProcess(options);
  providerOptionsKey = key;
  return provider;
}
async function closeProvider() {
  const current = provider;
  provider = null;
  providerOptionsKey = null;
  await current?.close?.();
}
function serializeError(err) {
  if (!(err instanceof Error)) {
    return { message: String(err) };
  }
  const code = err.code;
  return {
    message: err.message,
    ...typeof code === "string" ? { code } : {}
  };
}
async function handleRequest(request) {
  if (request.type === "close") {
    await closeProvider();
    send({ id: request.id, ok: true });
    return;
  }
  const currentProvider = await getProvider(request.options);
  if (request.type === "initialize") {
    send({
      id: request.id,
      ok: true,
      runtimeFacts: getLocalEmbeddingRuntimeFacts(currentProvider)
    });
    return;
  }
  if (request.type === "embedQuery") {
    const value2 = await currentProvider.embedQuery(request.text);
    send({
      id: request.id,
      ok: true,
      value: value2,
      runtimeFacts: getLocalEmbeddingRuntimeFacts(currentProvider)
    });
    return;
  }
  const value = await currentProvider.embedBatch(request.texts);
  send({
    id: request.id,
    ok: true,
    value,
    runtimeFacts: getLocalEmbeddingRuntimeFacts(currentProvider)
  });
}
process.on("message", (message) => {
  const request = message;
  requestQueue = requestQueue.then(async () => {
    try {
      await handleRequest(request);
    } catch (err) {
      send({
        id: request.id,
        ok: false,
        error: serializeError(err),
        runtimeFacts: getLocalEmbeddingRuntimeFacts(provider)
      });
    }
  });
});
process.once("disconnect", () => {
  void closeProvider().finally(() => {
    process.exit(0);
  });
});
