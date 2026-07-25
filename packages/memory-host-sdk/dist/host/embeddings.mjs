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

// packages/memory-host-sdk/src/host/embeddings-worker.ts
import { fork } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// packages/memory-host-sdk/src/host/embedding-worker-errors.ts
var LOCAL_EMBEDDING_WORKER_ERROR_CODES = {
  exited: "LOCAL_EMBEDDING_WORKER_EXITED",
  processError: "LOCAL_EMBEDDING_WORKER_PROCESS_ERROR",
  ipcError: "LOCAL_EMBEDDING_WORKER_IPC_ERROR"
};
function createLocalEmbeddingWorkerFailureError(params) {
  return Object.assign(new Error(params.message), {
    code: params.code,
    reason: params.reason,
    ...params.exitCode !== void 0 ? { exitCode: params.exitCode } : {},
    ...params.signal !== void 0 ? { signal: params.signal } : {},
    ...params.cause !== void 0 ? { cause: params.cause } : {}
  });
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

// packages/memory-host-sdk/src/host/embeddings-worker.ts
function resolveDefaultWorkerScriptPath() {
  const currentPath = fileURLToPath(import.meta.url);
  const extension = path.extname(currentPath);
  const currentName = path.basename(currentPath);
  const sibling = extension === ".ts" ? "embeddings-worker-child.ts" : currentName.startsWith("embeddings-worker.") ? "embeddings-worker-child.js" : "memory-core-local-embedding-worker.js";
  return path.join(path.dirname(currentPath), sibling);
}
function serializeLocalEmbeddingOptions(options, runtimeOptions) {
  return {
    config: {},
    provider: "local",
    model: options.model,
    fallback: "none",
    outputDimensionality: options.outputDimensionality,
    local: {
      ...options.local,
      ...runtimeOptions?.nodeLlamaCppImportUrl ? { nodeLlamaCppImportUrl: runtimeOptions.nodeLlamaCppImportUrl } : {}
    }
  };
}
function createWorkerExitError(code, signal) {
  const detail = signal ? `signal ${signal}` : `exit code ${code ?? "unknown"}`;
  return createLocalEmbeddingWorkerFailureError({
    message: `Local embedding worker exited unexpectedly (${detail})`,
    code: LOCAL_EMBEDDING_WORKER_ERROR_CODES.exited,
    reason: signal ? "signal" : "exit",
    exitCode: code,
    signal
  });
}
function createWorkerResponseError(error) {
  if (typeof error.error === "object" && error.error) {
    const message = error.error.message || "Local embedding worker failed";
    const workerError = new Error(message);
    if (error.error.code) {
      workerError.code = error.error.code;
    }
    return workerError;
  }
  return new Error(error.error || "Local embedding worker failed");
}
var WORKER_UNSAFE_EXEC_ARGV_FLAGS = /* @__PURE__ */ new Set(["--inspect", "--inspect-brk"]);
var WORKER_UNSAFE_EXEC_ARGV_FLAGS_WITH_VALUE = /* @__PURE__ */ new Set([
  "--eval",
  "-e",
  "--print",
  "-p",
  "--input-type",
  "--inspect-port"
]);
var WORKER_UNSAFE_EXEC_ARGV_OPTION_PREFIXES = [
  "--eval=",
  "--print=",
  "--input-type=",
  "--inspect=",
  "--inspect-brk=",
  "--inspect-port="
];
var WORKER_CLOSE_GRACE_MS = 250;
function resolveWorkerExecArgv() {
  const args = [];
  let skipNext = false;
  for (const arg of process.execArgv) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    if (WORKER_UNSAFE_EXEC_ARGV_FLAGS.has(arg)) {
      continue;
    }
    if (WORKER_UNSAFE_EXEC_ARGV_FLAGS_WITH_VALUE.has(arg)) {
      skipNext = true;
      continue;
    }
    if (WORKER_UNSAFE_EXEC_ARGV_OPTION_PREFIXES.some((prefix) => arg.startsWith(prefix))) {
      continue;
    }
    args.push(arg);
  }
  return args;
}
var LocalEmbeddingWorkerClient = class {
  constructor(scriptPath) {
    this.scriptPath = scriptPath;
    this.child = null;
    this.nextRequestId = 1;
    this.pending = /* @__PURE__ */ new Map();
  }
  /** Start or reuse the child worker and initialize its provider. */
  async initialize(options) {
    await this.send({ type: "initialize", options });
  }
  /** Request one query embedding from the child worker. */
  async embedQuery(options, text, callOptions) {
    const result = await this.send({ type: "embedQuery", options, text }, callOptions);
    return Array.isArray(result) ? result : [];
  }
  /** Request a batch of embeddings from the child worker. */
  async embedBatch(options, texts, callOptions) {
    const result = await this.send({ type: "embedBatch", options, texts }, callOptions);
    return Array.isArray(result) ? result : [];
  }
  getRuntimeFacts() {
    return this.lastRuntimeFacts;
  }
  /** Ask the child to close gracefully, then force shutdown after a short grace period. */
  async close() {
    const child = this.child;
    if (!child) {
      return;
    }
    let timeout;
    const closeRequest = this.send({ type: "close" }).then(() => "closed");
    const closeTimeout = new Promise((resolve) => {
      timeout = setTimeout(() => resolve("timeout"), WORKER_CLOSE_GRACE_MS);
      timeout.unref?.();
    });
    try {
      const result = await Promise.race([closeRequest, closeTimeout]);
      if (result === "timeout") {
        closeRequest.catch(() => {
        });
      }
    } finally {
      if (timeout) {
        clearTimeout(timeout);
      }
      this.shutdownChild();
    }
  }
  /** Ensure the child process exists and has lifecycle failure handlers installed. */
  ensureChild() {
    if (this.child?.connected) {
      return this.child;
    }
    const child = fork(this.scriptPath, [], {
      execArgv: resolveWorkerExecArgv(),
      serialization: "json",
      stdio: ["ignore", "ignore", "ignore", "ipc"]
    });
    child.on("message", (message) => this.handleMessage(message));
    child.on("exit", (code, signal) => {
      if (this.child === child) {
        this.child = null;
      }
      this.rejectPending(createWorkerExitError(code, signal));
    });
    child.on("error", (err) => {
      if (this.child === child) {
        this.child = null;
      }
      this.rejectPending(
        createLocalEmbeddingWorkerFailureError({
          message: `Local embedding worker process failed: ${err.message}`,
          code: LOCAL_EMBEDDING_WORKER_ERROR_CODES.processError,
          reason: "process-error",
          cause: err
        })
      );
    });
    this.child = child;
    return child;
  }
  /** Send one request over IPC and bind its abort signal to child shutdown. */
  async send(request, options) {
    options?.signal?.throwIfAborted();
    const child = this.ensureChild();
    const id = this.nextRequestId++;
    const payload = { ...request, id };
    return await new Promise((resolve, reject) => {
      const pending = { resolve, reject };
      if (options?.signal) {
        const abort = () => {
          this.pending.delete(id);
          this.shutdownChild();
          reject(
            toLintErrorObject(
              options.signal?.reason ?? new Error("Local embedding request aborted"),
              "Non-Error rejection"
            )
          );
        };
        options.signal.addEventListener("abort", abort, { once: true });
        pending.abort = () => options.signal?.removeEventListener("abort", abort);
      }
      this.pending.set(id, pending);
      child.send(payload, (err) => {
        if (err) {
          this.pending.delete(id);
          pending.abort?.();
          reject(
            createLocalEmbeddingWorkerFailureError({
              message: `Local embedding worker IPC failed: ${err.message}`,
              code: LOCAL_EMBEDDING_WORKER_ERROR_CODES.ipcError,
              reason: "ipc",
              cause: err
            })
          );
        }
      });
    });
  }
  /** Route one worker response to the matching pending request. */
  handleMessage(message) {
    const response = message;
    if (typeof response.id !== "number") {
      return;
    }
    if (response.runtimeFacts) {
      this.lastRuntimeFacts = response.runtimeFacts;
    }
    const pending = this.pending.get(response.id);
    if (!pending) {
      return;
    }
    this.pending.delete(response.id);
    pending.abort?.();
    if (response.ok) {
      pending.resolve(response.value);
      return;
    }
    pending.reject(
      createWorkerResponseError(response)
    );
  }
  /** Disconnect and kill the current child process if it is still alive. */
  shutdownChild() {
    const child = this.child;
    this.child = null;
    if (!child) {
      return;
    }
    this.rejectPending(
      createLocalEmbeddingWorkerFailureError({
        message: "Local embedding worker exited unexpectedly (shutdown)",
        code: LOCAL_EMBEDDING_WORKER_ERROR_CODES.exited,
        reason: "exit"
      })
    );
    if (child.connected) {
      child.disconnect();
    }
    if (!child.killed) {
      child.kill();
    }
  }
  /** Reject all pending requests after child process failure. */
  rejectPending(err) {
    const pending = [...this.pending.values()];
    this.pending.clear();
    for (const entry of pending) {
      entry.abort?.();
      entry.reject(err);
    }
  }
};
async function createLocalEmbeddingWorkerProvider(options, runtimeOptions) {
  const modelPath = normalizeOptionalString(options.local?.modelPath) || DEFAULT_LOCAL_MODEL;
  const workerOptions = serializeLocalEmbeddingOptions(options, runtimeOptions);
  const client = new LocalEmbeddingWorkerClient(
    runtimeOptions?.workerScriptPath ?? resolveDefaultWorkerScriptPath()
  );
  try {
    await client.initialize(workerOptions);
  } catch (err) {
    await client.close().catch(() => {
    });
    throw err;
  }
  let closed = false;
  const throwIfClosed = () => {
    if (closed) {
      throw new Error("Local embedding provider has been closed");
    }
  };
  const provider = {
    id: "local",
    model: modelPath,
    embedQuery: async (text, callOptions) => {
      throwIfClosed();
      return await client.embedQuery(workerOptions, text, callOptions);
    },
    embedBatch: async (texts, callOptions) => {
      throwIfClosed();
      return await client.embedBatch(workerOptions, texts, callOptions);
    },
    close: async () => {
      if (closed) {
        return;
      }
      closed = true;
      await client.close();
    }
  };
  attachLocalEmbeddingRuntimeFacts(provider, () => client.getRuntimeFacts());
  return provider;
}
function toLintErrorObject(value, fallbackMessage) {
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
async function createLocalEmbeddingProvider(options, runtimeOptions) {
  return await createLocalEmbeddingWorkerProvider(options, runtimeOptions);
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
  const provider = {
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
  attachLocalEmbeddingRuntimeFacts(provider, () => runtimeFacts);
  return provider;
}
export {
  DEFAULT_LOCAL_MODEL,
  createLocalEmbeddingProvider,
  createLocalEmbeddingProviderInProcess
};
