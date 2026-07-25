// packages/memory-host-sdk/src/host/embeddings-worker.ts
import { fork } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

// packages/memory-host-sdk/src/host/embedding-defaults.ts
var DEFAULT_LOCAL_MODEL = "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";

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
export {
  createLocalEmbeddingWorkerProvider
};
