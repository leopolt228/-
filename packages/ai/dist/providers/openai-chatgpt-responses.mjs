var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// packages/normalization-core/src/number-coercion.ts
function asFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
var MAX_TIMER_TIMEOUT_MS = 2147e6;
var MAX_TIMER_TIMEOUT_SECONDS = Math.floor(MAX_TIMER_TIMEOUT_MS / 1e3);
function clampTimerTimeoutMs(valueMs, minMs = 1) {
  const value = asFiniteNumber(valueMs);
  if (value === void 0) {
    return void 0;
  }
  const min = Math.max(1, Math.floor(minMs));
  return Math.min(Math.max(Math.floor(value), min), MAX_TIMER_TIMEOUT_MS);
}
function resolveTimerTimeoutMs(valueMs, fallbackMs, minMs = 1) {
  const value = asFiniteNumber(valueMs) ?? asFiniteNumber(fallbackMs);
  const min = Math.max(0, Math.floor(minMs));
  if (value === void 0) {
    return min;
  }
  return Math.min(Math.max(Math.floor(value), min), MAX_TIMER_TIMEOUT_MS);
}

// packages/ai/src/env-api-keys.ts
var existsSync = null;
var homedir = null;
var join = null;
var dynamicImport = (specifier) => import(specifier);
var NODE_FS_SPECIFIER = "node:fs";
var NODE_OS_SPECIFIER = "node:os";
var NODE_PATH_SPECIFIER = "node:path";
function loadNodeBuiltinModule(specifier) {
  const getBuiltinModule = typeof process !== "undefined" ? process : void 0;
  if (typeof getBuiltinModule?.getBuiltinModule === "function") {
    return getBuiltinModule.getBuiltinModule(specifier);
  }
  if (typeof __require === "function") {
    return __require(specifier);
  }
  return null;
}
function loadNodeHelpersSync() {
  try {
    const fsModule = loadNodeBuiltinModule(NODE_FS_SPECIFIER);
    const osModule = loadNodeBuiltinModule(NODE_OS_SPECIFIER);
    const pathModule = loadNodeBuiltinModule(NODE_PATH_SPECIFIER);
    existsSync ??= fsModule?.existsSync ?? null;
    homedir ??= osModule?.homedir ?? null;
    join ??= pathModule?.join ?? null;
    if (!existsSync || !homedir || !join) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
if (typeof process !== "undefined" && (process.versions?.node || process.versions?.bun)) {
  if (!loadNodeHelpersSync()) {
    void dynamicImport(NODE_FS_SPECIFIER).then((m) => {
      existsSync = m.existsSync;
    });
    void dynamicImport(NODE_OS_SPECIFIER).then((m) => {
      homedir = m.homedir;
    });
    void dynamicImport(NODE_PATH_SPECIFIER).then((m) => {
      join = m.join;
    });
  }
}
var procEnvCache = null;
function getProcessEnv() {
  return typeof process === "undefined" ? void 0 : process.env;
}
function getProcEnv(key) {
  if (typeof process === "undefined" || !process.versions?.bun) {
    return void 0;
  }
  const env = getProcessEnv();
  if (!env) {
    return void 0;
  }
  if (Object.keys(env).length > 0) {
    return void 0;
  }
  if (procEnvCache === null) {
    procEnvCache = /* @__PURE__ */ new Map();
    try {
      const fsModule = loadNodeBuiltinModule(NODE_FS_SPECIFIER);
      if (!fsModule) {
        return void 0;
      }
      const data = fsModule.readFileSync("/proc/self/environ", "utf-8");
      for (const entry of data.split("\0")) {
        const idx = entry.indexOf("=");
        if (idx > 0) {
          procEnvCache.set(entry.slice(0, idx), entry.slice(idx + 1));
        }
      }
    } catch {
    }
  }
  return procEnvCache.get(key);
}
function getEnvValue(key) {
  return (getProcessEnv()?.[key] || getProcEnv(key))?.trim() || void 0;
}
var cachedVertexAdcCredentialsExists = null;
function hasVertexAdcCredentials() {
  if (cachedVertexAdcCredentialsExists === null) {
    if (!existsSync || !homedir || !join) {
      const isNode = typeof process !== "undefined" && (process.versions?.node || process.versions?.bun);
      if (!isNode || !loadNodeHelpersSync()) {
        return false;
      }
    }
    const nodeExistsSync = existsSync;
    const nodeHomedir = homedir;
    const nodeJoin = join;
    if (!nodeExistsSync || !nodeHomedir || !nodeJoin) {
      return false;
    }
    const gacPath = getEnvValue("GOOGLE_APPLICATION_CREDENTIALS");
    if (gacPath) {
      cachedVertexAdcCredentialsExists = nodeExistsSync(gacPath) ? true : null;
    } else {
      cachedVertexAdcCredentialsExists = nodeExistsSync(
        nodeJoin(nodeHomedir(), ".config", "gcloud", "application_default_credentials.json")
      ) ? true : null;
    }
  }
  return cachedVertexAdcCredentialsExists === true;
}
function getApiKeyEnvVars(provider) {
  if (provider === "github-copilot") {
    return ["COPILOT_GITHUB_TOKEN"];
  }
  if (provider === "anthropic") {
    return ["ANTHROPIC_OAUTH_TOKEN", "ANTHROPIC_API_KEY"];
  }
  if (provider === "moonshot") {
    return ["MOONSHOT_API_KEY", "KIMI_API_KEY"];
  }
  if (provider === "kimi" || provider === "kimi-coding") {
    return ["KIMI_API_KEY", "KIMICODE_API_KEY"];
  }
  const envMap = {
    openai: "OPENAI_API_KEY",
    meta: "MODEL_API_KEY",
    "azure-openai-responses": "AZURE_OPENAI_API_KEY",
    deepseek: "DEEPSEEK_API_KEY",
    google: "GEMINI_API_KEY",
    "google-vertex": "GOOGLE_CLOUD_API_KEY",
    groq: "GROQ_API_KEY",
    cerebras: "CEREBRAS_API_KEY",
    xai: "XAI_API_KEY",
    openrouter: "OPENROUTER_API_KEY",
    "vercel-ai-gateway": "AI_GATEWAY_API_KEY",
    zai: "ZAI_API_KEY",
    mistral: "MISTRAL_API_KEY",
    minimax: "MINIMAX_API_KEY",
    "minimax-cn": "MINIMAX_CN_API_KEY",
    moonshotai: "MOONSHOT_API_KEY",
    "moonshotai-cn": "MOONSHOT_API_KEY",
    huggingface: "HF_TOKEN",
    fireworks: "FIREWORKS_API_KEY",
    together: "TOGETHER_API_KEY",
    opencode: "OPENCODE_API_KEY",
    "opencode-go": "OPENCODE_API_KEY",
    "cloudflare-workers-ai": "CLOUDFLARE_API_KEY",
    "cloudflare-ai-gateway": "CLOUDFLARE_API_KEY",
    xiaomi: "XIAOMI_API_KEY",
    "xiaomi-token-plan-cn": "XIAOMI_TOKEN_PLAN_CN_API_KEY",
    "xiaomi-token-plan-ams": "XIAOMI_TOKEN_PLAN_AMS_API_KEY",
    "xiaomi-token-plan-sgp": "XIAOMI_TOKEN_PLAN_SGP_API_KEY"
  };
  const envVar = envMap[provider];
  return envVar ? [envVar] : void 0;
}
function findEnvKeys(provider) {
  const envVars = getApiKeyEnvVars(provider);
  if (!envVars) {
    return void 0;
  }
  const found = envVars.filter((envVar) => Boolean(getEnvValue(envVar)));
  return found.length > 0 ? found : void 0;
}
function getEnvApiKey(provider) {
  const envKeys = findEnvKeys(provider);
  if (envKeys?.[0]) {
    return getEnvValue(envKeys[0]);
  }
  if (provider === "google-vertex") {
    const hasCredentials = hasVertexAdcCredentials();
    const hasProject = Boolean(
      getEnvValue("GOOGLE_CLOUD_PROJECT") || getEnvValue("GCLOUD_PROJECT")
    );
    const hasLocation = Boolean(getEnvValue("GOOGLE_CLOUD_LOCATION"));
    if (hasCredentials && hasProject && hasLocation) {
      return "<authenticated>";
    }
  }
  if (provider === "amazon-bedrock") {
    if (getEnvValue("AWS_PROFILE") || getEnvValue("AWS_ACCESS_KEY_ID") && getEnvValue("AWS_SECRET_ACCESS_KEY") || getEnvValue("AWS_BEARER_TOKEN_BEDROCK") || getEnvValue("AWS_CONTAINER_CREDENTIALS_RELATIVE_URI") || getEnvValue("AWS_CONTAINER_CREDENTIALS_FULL_URI") || getEnvValue("AWS_WEB_IDENTITY_TOKEN_FILE")) {
      return "<authenticated>";
    }
  }
  return void 0;
}

// packages/ai/src/host.ts
var inertAiTransportHost = {
  buildModelFetch: () => void 0,
  resolveSecretSentinel: (value) => value,
  redactSecrets: (value) => value,
  redactToolPayloadText: (text) => text,
  resolveOpenAIStrictToolSetting: (_model, options) => options?.supportsStrictMode ? false : void 0,
  logDebug: () => {
  }
};
var activeAiTransportHost = inertAiTransportHost;
function getAiTransportHost() {
  return activeAiTransportHost;
}
function resolveAiTransportHeaderSentinels(headers) {
  if (!headers) {
    return void 0;
  }
  const host = getAiTransportHost();
  let resolvedHeaders;
  for (const [name, value] of Object.entries(headers)) {
    const resolved = host.resolveSecretSentinel(value);
    if (resolved !== value) {
      resolvedHeaders ??= { ...headers };
      resolvedHeaders[name] = resolved;
    }
  }
  return resolvedHeaders ?? headers;
}

// packages/ai/src/internal/retry-after.ts
var HTTP_DATE_MONTH_INDEX = new Map(
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
    (month, index) => [month, index]
  )
);
var HTTP_DATE_SHORT_WEEKDAY_INDEX = new Map(
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday, index) => [weekday, index])
);
var HTTP_DATE_LONG_WEEKDAY_INDEX = new Map(
  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
    (weekday, index) => [weekday, index]
  )
);
var IMF_FIXDATE_RE = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{2}):(\d{2}):(\d{2}) GMT$/;
var OBSOLETE_RFC850_DATE_RE = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{2}):(\d{2}):(\d{2}) GMT$/;
var OBSOLETE_ASCTIME_DATE_RE = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{2}| \d) (\d{2}):(\d{2}):(\d{2}) (\d{4})$/;
function parseRetryAfterHttpDateMs(value, nowMs = Date.now()) {
  const imfFixdate = IMF_FIXDATE_RE.exec(value);
  if (imfFixdate) {
    return parseHttpDateComponentsMs({
      weekday: HTTP_DATE_SHORT_WEEKDAY_INDEX.get(imfFixdate[1] ?? ""),
      year: Number.parseInt(imfFixdate[4] ?? "", 10),
      month: HTTP_DATE_MONTH_INDEX.get(imfFixdate[3] ?? ""),
      day: Number.parseInt(imfFixdate[2] ?? "", 10),
      hours: Number.parseInt(imfFixdate[5] ?? "", 10),
      minutes: Number.parseInt(imfFixdate[6] ?? "", 10),
      seconds: Number.parseInt(imfFixdate[7] ?? "", 10)
    });
  }
  const rfc850Date = OBSOLETE_RFC850_DATE_RE.exec(value);
  if (rfc850Date) {
    const now = new Date(nowMs);
    if (Number.isNaN(now.getTime())) {
      return void 0;
    }
    const shortYear = Number.parseInt(rfc850Date[4] ?? "", 10);
    const candidateYear = Math.floor(now.getUTCFullYear() / 100) * 100 + shortYear;
    const components = {
      weekday: HTTP_DATE_LONG_WEEKDAY_INDEX.get(rfc850Date[1] ?? ""),
      month: HTTP_DATE_MONTH_INDEX.get(rfc850Date[3] ?? ""),
      day: Number.parseInt(rfc850Date[2] ?? "", 10),
      hours: Number.parseInt(rfc850Date[5] ?? "", 10),
      minutes: Number.parseInt(rfc850Date[6] ?? "", 10),
      seconds: Number.parseInt(rfc850Date[7] ?? "", 10)
    };
    const candidate = parseHttpDateCalendarMs({ year: candidateYear, ...components });
    if (candidate === void 0) {
      return void 0;
    }
    const fiftyYearsFromNow = Date.UTC(
      now.getUTCFullYear() + 50,
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    );
    const resolvedYear = candidate > fiftyYearsFromNow ? candidateYear - 100 : candidateYear;
    return parseHttpDateComponentsMs({ year: resolvedYear, ...components });
  }
  const asctimeDate = OBSOLETE_ASCTIME_DATE_RE.exec(value);
  if (asctimeDate) {
    return parseHttpDateComponentsMs({
      weekday: HTTP_DATE_SHORT_WEEKDAY_INDEX.get(asctimeDate[1] ?? ""),
      year: Number.parseInt(asctimeDate[7] ?? "", 10),
      month: HTTP_DATE_MONTH_INDEX.get(asctimeDate[2] ?? ""),
      day: Number.parseInt((asctimeDate[3] ?? "").trim(), 10),
      hours: Number.parseInt(asctimeDate[4] ?? "", 10),
      minutes: Number.parseInt(asctimeDate[5] ?? "", 10),
      seconds: Number.parseInt(asctimeDate[6] ?? "", 10)
    });
  }
  return void 0;
}
function parseHttpDateComponentsMs(components) {
  const timestamp = parseHttpDateCalendarMs(components);
  if (timestamp === void 0) {
    return void 0;
  }
  const weekdayTimestamp = components.seconds === 60 ? timestamp - 1e3 : timestamp;
  if (new Date(weekdayTimestamp).getUTCDay() !== components.weekday) {
    return void 0;
  }
  return timestamp;
}
function parseHttpDateCalendarMs(components) {
  const { year, month, day, hours, minutes, seconds } = components;
  if (month === void 0 || !Number.isInteger(year) || year < 1900 || !Number.isInteger(day) || day < 1 || day > 31 || !Number.isInteger(hours) || hours < 0 || hours > 23 || !Number.isInteger(minutes) || minutes < 0 || minutes > 59 || !Number.isInteger(seconds) || seconds < 0 || seconds > 60) {
    return void 0;
  }
  const calendarSecond = Math.min(seconds, 59);
  const timestamp = Date.UTC(year, month, day, hours, minutes, calendarSecond);
  const parsedDate = new Date(timestamp);
  if (parsedDate.getUTCFullYear() !== year || parsedDate.getUTCMonth() !== month || parsedDate.getUTCDate() !== day || parsedDate.getUTCHours() !== hours || parsedDate.getUTCMinutes() !== minutes || parsedDate.getUTCSeconds() !== calendarSecond) {
    return void 0;
  }
  return seconds === 60 ? timestamp + 1e3 : timestamp;
}

// packages/ai/src/internal/retry-sleep.ts
function sleepWithAbort(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error("Request was aborted"));
      return;
    }
    const onAbort = () => {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", onAbort);
      reject(new Error("Request was aborted"));
    };
    const timeout = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

// packages/ai/src/session-resources.ts
var sessionResourceCleanups = /* @__PURE__ */ new Set();
function registerSessionResourceCleanup(cleanup) {
  sessionResourceCleanups.add(cleanup);
  return () => {
    sessionResourceCleanups.delete(cleanup);
  };
}

// packages/llm-core/src/utils/diagnostics.ts
function formatThrownValue(value) {
  if (value instanceof Error) {
    return value.message || value.name;
  }
  if (typeof value === "string") {
    return value;
  }
  return String(value);
}
function extractDiagnosticError(error) {
  if (!(error instanceof Error)) {
    return { name: "ThrownValue", message: formatThrownValue(error) };
  }
  const code = error.code;
  return {
    name: error.name || void 0,
    message: error.message || error.name,
    stack: error.stack,
    code: typeof code === "string" || typeof code === "number" ? code : void 0
  };
}
function createAssistantMessageDiagnostic(type, error, details) {
  return { type, timestamp: Date.now(), error: extractDiagnosticError(error), details };
}
function appendAssistantMessageDiagnostic(message, diagnostic) {
  message.diagnostics = [...message.diagnostics ?? [], diagnostic];
}

// packages/llm-core/src/utils/event-stream.ts
var EventStream = class {
  constructor(isComplete, extractResult) {
    this.queue = [];
    this.waiting = [];
    this.done = false;
    this.isComplete = isComplete;
    this.extractResult = extractResult;
    const resolvers = [];
    this.finalResultPromise = new Promise((resolve) => {
      resolvers.push(resolve);
    });
    const resolveFinalResult = resolvers.at(0);
    if (!resolveFinalResult) {
      throw new Error("event stream result promise did not initialize its resolver");
    }
    this.resolveFinalResult = resolveFinalResult;
  }
  push(event) {
    if (this.done) {
      return;
    }
    if (this.isComplete(event)) {
      this.done = true;
      this.resolveFinalResult(this.extractResult(event));
    }
    const waiter = this.waiting.shift();
    if (waiter) {
      waiter({ value: event, done: false });
    } else {
      this.queue.push(event);
    }
  }
  end(result) {
    this.done = true;
    if (result !== void 0) {
      this.resolveFinalResult(result);
    }
    while (this.waiting.length > 0) {
      const waiter = this.waiting.shift();
      if (!waiter) {
        break;
      }
      waiter({ value: void 0, done: true });
    }
  }
  async *[Symbol.asyncIterator]() {
    while (true) {
      if (this.queue.length > 0) {
        for (const event of this.queue.splice(0, 1)) {
          yield event;
        }
      } else if (this.done) {
        return;
      } else {
        const result = await new Promise((resolve) => {
          this.waiting.push(resolve);
        });
        if (result.done) {
          return;
        }
        yield result.value;
      }
    }
  }
  result() {
    return this.finalResultPromise;
  }
};
var AssistantMessageEventStream = class extends EventStream {
  constructor() {
    super(
      (event) => event.type === "done" || event.type === "error",
      (event) => {
        if (event.type === "done") {
          return event.message;
        } else if (event.type === "error") {
          return event.error;
        }
        throw new Error("Unexpected event type for final result");
      }
    );
  }
};

// packages/ai/src/utils/headers.ts
function headersToRecord(headers) {
  const result = {};
  for (const [key, value] of headers.entries()) {
    result[key] = value;
  }
  return result;
}

// packages/ai/src/utils/oauth/openai-chatgpt-jwt.ts
var OPENAI_CODEX_AUTH_CLAIM = "https://api.openai.com/auth";
function decodeOpenAICodexJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  try {
    const decoded = Buffer.from(parts[1] ?? "", "base64url").toString("utf8");
    const parsed = JSON.parse(decoded);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function resolveOpenAICodexAccountId(token) {
  const accountId = decodeOpenAICodexJwtPayload(token)?.[OPENAI_CODEX_AUTH_CLAIM]?.chatgpt_account_id;
  return typeof accountId === "string" && accountId.length > 0 ? accountId : null;
}

// packages/ai/src/utils/stream-first-event-timeout.ts
function getFirstStreamEventTimeoutMs(options) {
  return options?.firstEventTimeoutMs;
}
function getFirstStreamEventTimeoutHandler(options) {
  return options?.onFirstEventTimeout;
}
function formatOptionalField(name, value) {
  return value ? ` ${name}=${value}` : "";
}
function createFirstStreamEventTimeoutError(context) {
  const stage = context.stage ? `${context.stage} ` : "";
  const details = [
    formatOptionalField("provider", context.provider),
    formatOptionalField("api", context.api),
    formatOptionalField("model", context.model)
  ].join("");
  return new Error(
    `${stage}HTTP stream opened but did not deliver a first SSE event within ${context.timeoutMs}ms after streaming headers (first-event timeout).${details}` + (context.hint ? ` ${context.hint}` : "")
  );
}
function createFirstStreamEventAbortController(parentSignal) {
  const controller = new AbortController();
  const abortFromParent = () => {
    if (!controller.signal.aborted) {
      controller.abort(parentSignal?.reason);
    }
  };
  if (parentSignal?.aborted) {
    abortFromParent();
  } else {
    parentSignal?.addEventListener("abort", abortFromParent, { once: true });
  }
  return {
    signal: controller.signal,
    abort(reason) {
      if (!controller.signal.aborted) {
        controller.abort(reason);
      }
    },
    dispose() {
      parentSignal?.removeEventListener("abort", abortFromParent);
    }
  };
}
function withFirstStreamEventTimeout(stream, context) {
  const timeoutMs = clampTimerTimeoutMs(context.timeoutMs);
  if (timeoutMs === void 0 || context.timeoutMs <= 0) {
    return stream;
  }
  const timeoutContext = { ...context, timeoutMs };
  return {
    async *[Symbol.asyncIterator]() {
      const iterator = stream[Symbol.asyncIterator]();
      let timer;
      let completed = false;
      const clear = () => {
        if (timer) {
          clearTimeout(timer);
          timer = void 0;
        }
      };
      try {
        const first = await new Promise((resolve, reject) => {
          timer = setTimeout(() => {
            const timeoutError = createFirstStreamEventTimeoutError(timeoutContext);
            timeoutContext.onTimeout?.(timeoutError);
            timeoutContext.abort?.(timeoutError);
            reject(timeoutError);
          }, timeoutMs);
          timer.unref?.();
          iterator.next().then(resolve, reject);
        }).finally(clear);
        if (first.done) {
          completed = true;
          return;
        }
        yield first.value;
        for (; ; ) {
          const next = await iterator.next();
          if (next.done) {
            completed = true;
            return;
          }
          yield next.value;
        }
      } finally {
        clear();
        if (!completed) {
          void iterator.return?.().catch(() => void 0);
        }
      }
    }
  };
}

// packages/ai/src/utils/streaming-byte-guard.ts
function createSseByteGuard(reader, opts) {
  if (!Number.isFinite(opts.maxBytes) || opts.maxBytes < 0) {
    throw new RangeError(`maxBytes must be a non-negative finite number: ${opts.maxBytes}`);
  }
  const onOverflow = opts.onOverflow ?? ((params) => new Error(`SSE stream exceeds ${params.maxBytes} bytes (received ${params.size})`));
  let total = 0;
  let overflowedFlag = false;
  let cancelledFlag = false;
  return {
    read: async () => {
      if (overflowedFlag || cancelledFlag) {
        return { done: true, value: void 0 };
      }
      const result = await reader.read();
      if (result.done) {
        return result;
      }
      const chunkLen = result.value?.byteLength ?? 0;
      const next = total + chunkLen;
      if (next > opts.maxBytes) {
        overflowedFlag = true;
        cancelledFlag = true;
        const err = onOverflow({ size: next, maxBytes: opts.maxBytes });
        try {
          await reader.cancel(err);
        } catch {
        }
        throw err;
      }
      total = next;
      return result;
    },
    cancel: async (reason) => {
      if (overflowedFlag) {
        return;
      }
      cancelledFlag = true;
      try {
        await reader.cancel(reason);
      } catch {
      }
    },
    totalBytes: () => total,
    overflowed: () => overflowedFlag,
    cancelled: () => cancelledFlag
  };
}

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

// packages/ai/src/utils/sanitize-unicode.ts
function sanitizeSurrogates(text) {
  return text.replace(
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
    ""
  );
}

// packages/ai/src/utils/system-prompt-cache-boundary.ts
var SYSTEM_PROMPT_CACHE_BOUNDARY = "\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n";
function stripSystemPromptCacheBoundary(text) {
  return text.replaceAll(SYSTEM_PROMPT_CACHE_BOUNDARY, "\n");
}

// packages/ai/src/providers/openai-prompt-cache.ts
var OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH = 64;
function clampOpenAIPromptCacheKey(key) {
  if (key === void 0) {
    return void 0;
  }
  const chars = Array.from(key);
  if (chars.length <= OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH) {
    return key;
  }
  return chars.slice(0, OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH).join("");
}

// packages/normalization-core/src/string-normalization.ts
function normalizeStringEntries(list) {
  return (list ?? []).map((entry) => normalizeOptionalString(String(entry)) ?? "").filter(Boolean);
}
function uniqueValues(values) {
  return [...new Set(values)];
}
function uniqueStrings(values) {
  return uniqueValues(values);
}

// packages/ai/src/providers/openai-reasoning-effort.ts
var GPT_5_REASONING_EFFORTS = ["minimal", "low", "medium", "high"];
var GPT_51_REASONING_EFFORTS = ["none", "low", "medium", "high"];
var GPT_52_REASONING_EFFORTS = ["none", "low", "medium", "high", "xhigh"];
var GPT_56_REASONING_EFFORTS = ["none", "low", "medium", "high", "xhigh", "max"];
var GPT_CODEX_REASONING_EFFORTS = ["low", "medium", "high", "xhigh"];
var GPT_PRO_REASONING_EFFORTS = ["medium", "high", "xhigh"];
var GPT_5_PRO_REASONING_EFFORTS = ["high"];
var GPT_51_CODEX_MAX_REASONING_EFFORTS = ["none", "medium", "high", "xhigh"];
var GPT_51_CODEX_MINI_REASONING_EFFORTS = ["medium"];
var GENERIC_REASONING_EFFORTS = ["low", "medium", "high"];
var CANONICAL_REASONING_EFFORTS = /* @__PURE__ */ new Set([
  "none",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
  "off"
]);
function normalizeModelId(id) {
  return normalizeLowercaseStringOrEmpty(id ?? "").replace(/-\d{4}-\d{2}-\d{2}$/u, "");
}
function normalizeOpenAIReasoningEffort(effort) {
  const trimmed = effort.trim();
  const folded = trimmed.toLowerCase();
  return CANONICAL_REASONING_EFFORTS.has(folded) ? folded : trimmed;
}
function readCompatReasoningEfforts(compat) {
  if (!compat || typeof compat !== "object") {
    return void 0;
  }
  if (compat.supportsReasoningEffort === false) {
    return [];
  }
  const raw = compat.supportedReasoningEfforts;
  if (!Array.isArray(raw)) {
    return void 0;
  }
  const supported = uniqueStrings(
    normalizeStringEntries(raw.filter((value) => typeof value === "string"))
  );
  return supported.length > 0 ? supported : void 0;
}
function isDisabledReasoningEffort(effort) {
  return effort === "none" || effort === "off";
}
function resolveOpenAISupportedReasoningEfforts(model) {
  const compatEfforts = readCompatReasoningEfforts(model.compat);
  if (compatEfforts) {
    return compatEfforts;
  }
  const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
  if (/^gpt-5\.6(?:-|$)/u.test(id)) {
    return GPT_56_REASONING_EFFORTS;
  }
  if (id === "gpt-5.1-codex-mini") {
    return GPT_51_CODEX_MINI_REASONING_EFFORTS;
  }
  if (id === "gpt-5.1-codex-max") {
    return GPT_51_CODEX_MAX_REASONING_EFFORTS;
  }
  if (/^gpt-5(?:\.\d+)?-codex(?:-|$)/u.test(id)) {
    return GPT_CODEX_REASONING_EFFORTS;
  }
  if (id === "gpt-5-pro") {
    return GPT_5_PRO_REASONING_EFFORTS;
  }
  if (/^gpt-5\.[2-9](?:\.\d+)?-pro(?:-|$)/u.test(id)) {
    return GPT_PRO_REASONING_EFFORTS;
  }
  if (/^gpt-5\.[2-9](?:\.\d+)?(?:-|$)/u.test(id)) {
    return GPT_52_REASONING_EFFORTS;
  }
  if (/^gpt-5\.1(?:-|$)/u.test(id)) {
    return GPT_51_REASONING_EFFORTS;
  }
  if (/^gpt-5(?:-|$)/u.test(id)) {
    return GPT_5_REASONING_EFFORTS;
  }
  return GENERIC_REASONING_EFFORTS;
}
function supportsOpenAITemperature(model) {
  const compat = model.compat;
  if (compat && typeof compat === "object") {
    const declared = compat.supportsTemperature;
    if (typeof declared === "boolean") {
      return declared;
    }
  }
  const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
  return !/^gpt-5\.6(?:-|$)/u.test(id);
}
function supportsOpenAIReasoningEffort(model, effort) {
  return resolveOpenAISupportedReasoningEfforts(model).includes(
    normalizeOpenAIReasoningEffort(effort)
  );
}
function resolveOpenAIReasoningEffortForModel(params) {
  const requested = normalizeOpenAIReasoningEffort(params.effort);
  const mapped = params.fallbackMap?.[requested] ?? (params.fallbackMap && CANONICAL_REASONING_EFFORTS.has(requested) ? Object.entries(params.fallbackMap).find(
    ([effort]) => normalizeOpenAIReasoningEffort(effort) === requested
  )?.[1] : void 0);
  const normalized = mapped === void 0 ? requested : mapped.trim();
  const supported = resolveOpenAISupportedReasoningEfforts(params.model);
  if (supported.includes(normalized)) {
    return normalized;
  }
  if (requested === "off" && supported.includes("none")) {
    return "none";
  }
  if (isDisabledReasoningEffort(requested) || isDisabledReasoningEffort(normalized)) {
    return void 0;
  }
  if (requested === "minimal" && supported.includes("low")) {
    return "low";
  }
  if ((requested === "minimal" || requested === "low") && supported.includes("medium")) {
    return "medium";
  }
  if (requested === "xhigh" && supported.includes("high")) {
    return "high";
  }
  if (requested === "max" && supported.includes("xhigh")) {
    return "xhigh";
  }
  return supported.find(
    (effort) => !isDisabledReasoningEffort(normalizeOpenAIReasoningEffort(effort))
  );
}

// packages/ai/src/providers/openai-responses-shared.ts
import { randomUUID } from "node:crypto";

// packages/llm-core/src/model-contracts/anthropic.ts
function normalizeClaudeModelId(modelId) {
  const normalized = modelId?.trim().toLowerCase() ?? "";
  const unprefixed = normalized.startsWith("anthropic/") ? normalized.slice("anthropic/".length) : normalized;
  return unprefixed.replace(/[._\s]+/g, "-");
}
function resolveClaudeModelIdentity(ref) {
  const configuredCanonicalModelId = typeof ref.params?.canonicalModelId === "string" ? ref.params.canonicalModelId : void 0;
  const normalized = normalizeClaudeModelId(configuredCanonicalModelId ?? ref.id);
  const match = /(?:^|[-/])claude-/.exec(normalized);
  return match ? normalized.slice((match.index ?? 0) + (match[0].startsWith("claude-") ? 0 : 1)) : normalized;
}
function resolveClaudeFable5ModelIdentity(ref) {
  const normalized = resolveClaudeModelIdentity(ref);
  const match = /(?:^|-)claude-fable-5(?=$|[^a-z0-9])/.exec(normalized);
  if (!match) {
    return void 0;
  }
  return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
function resolveClaudeMythos5ModelIdentity(ref) {
  const normalized = resolveClaudeModelIdentity(ref);
  const match = /(?:^|-)claude-mythos-5(?=$|[^a-z0-9])/.exec(normalized);
  if (!match) {
    return void 0;
  }
  return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
function requiresClaudeMandatoryAdaptiveThinking(ref) {
  const modelId = resolveClaudeModelIdentity(ref);
  return resolveClaudeFable5ModelIdentity(ref) !== void 0 || resolveClaudeMythos5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(modelId);
}
function resolveClaudeSonnet5ModelIdentity(ref) {
  const normalized = resolveClaudeModelIdentity(ref);
  const match = /(?:^|-)claude-sonnet-5(?=$|[^a-z0-9])/.exec(normalized);
  if (!match) {
    return void 0;
  }
  return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
function supportsClaudeNativeMaxEffort(ref) {
  const modelId = resolveClaudeModelIdentity(ref);
  return /(?:^|-)claude-(?:fable-5|mythos-5|opus-4-(?:6|7|8)|sonnet-(?:5|4-6))(?=$|[^a-z0-9])/.test(
    modelId
  );
}
function supportsClaudeNativeXhighEffort(ref) {
  const modelId = resolveClaudeModelIdentity(ref);
  return /(?:^|-)claude-(?:fable-5|mythos-5|opus-4-(?:7|8)|sonnet-5)(?=$|[^a-z0-9])/.test(modelId);
}
function resolveClaudeNativeThinkingLevelMap(ref) {
  if (ref.thinkingLevelMap !== void 0) {
    return ref.thinkingLevelMap;
  }
  if (!supportsClaudeNativeMaxEffort(ref)) {
    return void 0;
  }
  return {
    xhigh: supportsClaudeNativeXhighEffort(ref) ? "xhigh" : null,
    max: "max"
  };
}

// packages/llm-core/src/validation.ts
import { Compile } from "typebox/compile";
var MAX_JSON_COERCE_LENGTH = 64 * 1024;

// packages/ai/src/model-utils.ts
function calculateCost(model, usage) {
  const cacheWrite1h = Math.min(usage.cacheWrite, Math.max(0, usage.cacheWrite1h ?? 0));
  const cacheWrite5m = usage.cacheWrite - cacheWrite1h;
  usage.cost.input = model.cost.input / 1e6 * usage.input;
  usage.cost.output = model.cost.output / 1e6 * usage.output;
  usage.cost.cacheRead = model.cost.cacheRead / 1e6 * usage.cacheRead;
  usage.cost.cacheWrite = (model.cost.cacheWrite * cacheWrite5m + model.cost.input * 2 * cacheWrite1h) / 1e6;
  usage.cost.total = usage.cost.input + usage.cost.output + usage.cost.cacheRead + usage.cost.cacheWrite;
  return usage.cost;
}
var EXTENDED_THINKING_LEVELS = [
  "off",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max"
];
function resolveThinkingLevelMap(model) {
  return model.api === "anthropic-messages" ? resolveClaudeNativeThinkingLevelMap(model) ?? model.thinkingLevelMap : model.thinkingLevelMap;
}
function getSupportedThinkingLevels(model) {
  const mandatoryAdaptiveContract = model.api === "anthropic-messages" && requiresClaudeMandatoryAdaptiveThinking(model);
  if (!model.reasoning && !mandatoryAdaptiveContract) {
    return ["off"];
  }
  const thinkingLevelMap = resolveThinkingLevelMap(model);
  return EXTENDED_THINKING_LEVELS.filter((level) => {
    const mapped = thinkingLevelMap?.[level];
    if (mapped === null) {
      return false;
    }
    if (level === "xhigh" || level === "max") {
      return mapped !== void 0;
    }
    return true;
  });
}
function clampThinkingLevel(model, level) {
  const availableLevels = getSupportedThinkingLevels(model);
  if (availableLevels.includes(level)) {
    return level;
  }
  const requestedIndex = EXTENDED_THINKING_LEVELS.indexOf(level);
  if (requestedIndex === -1) {
    return availableLevels[0] ?? "off";
  }
  const thinkingLevelMap = resolveThinkingLevelMap(model);
  if ((level === "xhigh" || level === "max") && thinkingLevelMap?.[level] === null) {
    for (const candidate of EXTENDED_THINKING_LEVELS.slice(0, requestedIndex).toReversed()) {
      if (availableLevels.includes(candidate)) {
        return candidate;
      }
    }
  }
  for (const candidate of EXTENDED_THINKING_LEVELS.slice(requestedIndex)) {
    if (availableLevels.includes(candidate)) {
      return candidate;
    }
  }
  for (const candidate of EXTENDED_THINKING_LEVELS.slice(0, requestedIndex).toReversed()) {
    if (availableLevels.includes(candidate)) {
      return candidate;
    }
  }
  return availableLevels[0] ?? "off";
}

// packages/ai/src/utils/hash.ts
function shortHash(str) {
  let h1 = 3735928559;
  let h2 = 1103547991;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return (h2 >>> 0).toString(36) + (h1 >>> 0).toString(36);
}

// packages/ai/src/utils/json-parse.ts
import { parse as partialParse } from "partial-json";
var VALID_JSON_ESCAPES = /* @__PURE__ */ new Set(['"', "\\", "/", "b", "f", "n", "r", "t", "u"]);
var JSON_CONTROL_ESCAPES = /* @__PURE__ */ new Set(["b", "f", "n", "r", "t"]);
function isControlCharacter(char) {
  const codePoint = char.codePointAt(0);
  return codePoint !== void 0 && codePoint >= 0 && codePoint <= 31;
}
function escapeControlCharacter(char) {
  switch (char) {
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    default:
      return `\\u${char.codePointAt(0)?.toString(16).padStart(4, "0") ?? "0000"}`;
  }
}
function repairJson(json) {
  let repaired = "";
  let inString = false;
  let stringValuePrefix = "";
  for (let index = 0; index < json.length; index++) {
    const char = json.charAt(index);
    if (!inString) {
      repaired += char;
      if (char === '"') {
        inString = true;
        stringValuePrefix = "";
      }
      continue;
    }
    if (char === '"') {
      repaired += char;
      inString = false;
      stringValuePrefix = "";
      continue;
    }
    if (char === "\\") {
      const nextChar = json.charAt(index + 1);
      if (!nextChar) {
        repaired += "\\\\";
        continue;
      }
      if (nextChar === "u") {
        const unicodeDigits = json.slice(index + 2, index + 6);
        if (/^[0-9a-fA-F]{4}$/.test(unicodeDigits)) {
          repaired += `\\u${unicodeDigits}`;
          stringValuePrefix += `\\u${unicodeDigits}`;
          index += 5;
          continue;
        }
        repaired += "\\\\";
        stringValuePrefix += "\\";
        continue;
      }
      if (JSON_CONTROL_ESCAPES.has(nextChar) && looksLikeWindowsPathPrefix(stringValuePrefix)) {
        repaired += "\\\\";
        stringValuePrefix += "\\";
        continue;
      }
      if (VALID_JSON_ESCAPES.has(nextChar)) {
        repaired += `\\${nextChar}`;
        stringValuePrefix += nextChar === "\\" ? "\\" : `\\${nextChar}`;
        index += 1;
        continue;
      }
      repaired += "\\\\";
      stringValuePrefix += "\\";
      continue;
    }
    repaired += isControlCharacter(char) ? escapeControlCharacter(char) : char;
    stringValuePrefix += char;
  }
  return repaired;
}
function parseJsonWithRepair(json) {
  return JSON.parse(repairJson(json));
}
function looksLikeWindowsPathPrefix(prefix) {
  const tail = prefix.slice(-160);
  return /(?:^|[^A-Za-z0-9])[A-Za-z]:(?:[\\/][^"\\/:*?<>|\r\n]*)*$/.test(tail);
}
function asStreamingJsonRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function parseStreamingJson(partialJson) {
  if (!partialJson || partialJson.trim() === "") {
    return {};
  }
  try {
    return asStreamingJsonRecord(parseJsonWithRepair(partialJson));
  } catch {
    try {
      return asStreamingJsonRecord(partialParse(partialJson));
    } catch {
      try {
        return asStreamingJsonRecord(partialParse(repairJson(partialJson)));
      } catch {
        return {};
      }
    }
  }
}

// packages/ai/src/providers/openai-responses-stream-compat.ts
var OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE = "output_text";
var AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE = "text";
var AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE = "response.text.delta";
function isResponsesTextContentPartType(type) {
  return type === OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE || type === AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE;
}
function isAzureResponsesTextDeltaEventType(type) {
  return type === AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
}
function isAzureResponsesTextDeltaEvent(event) {
  return isAzureResponsesTextDeltaEventType(event.type) && typeof event.delta === "string";
}
function resolveResponsesMessageSnapshotCollapse(params) {
  const { prior, nextText } = params;
  if (!prior?.text || !nextText || prior.phase !== params.nextPhase) {
    return { kind: "keep" };
  }
  if (nextText.length > prior.text.length && nextText.startsWith(prior.text)) {
    return { kind: "extend", text: nextText };
  }
  return { kind: "keep" };
}

// packages/ai/src/providers/openai-responses-terminal-usage.ts
function readCount(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
function mapResponsesTerminalUsage(usage) {
  if (!usage) {
    return void 0;
  }
  const cacheRead = readCount(usage.input_tokens_details?.cached_tokens);
  const cacheWrite = readCount(usage.input_tokens_details?.cache_write_tokens);
  const input = Math.max(0, readCount(usage.input_tokens) - cacheRead - cacheWrite);
  const output = readCount(usage.output_tokens);
  const bucketTotal = input + output + cacheRead + cacheWrite;
  const totalTokens = Math.max(bucketTotal, readCount(usage.total_tokens));
  return { input, output, cacheRead, cacheWrite, totalTokens };
}
function mapResponsesTerminalStopReason(status) {
  if (!status) {
    return "stop";
  }
  switch (status) {
    case "completed":
      return "stop";
    case "incomplete":
      return "length";
    case "failed":
    case "cancelled":
      return "error";
    // These two are wonky ...
    case "in_progress":
    case "queued":
      return "stop";
    default: {
      const exhaustive = status;
      throw new Error(`Unhandled stop reason: ${String(exhaustive)}`);
    }
  }
}
function resolveResponsesTerminalStopReason(params) {
  if (params.status === "incomplete" && params.incompleteReason === "content_filter") {
    return { stopReason: "error", errorMessage: "Provider incomplete_reason: content_filter" };
  }
  const stopReason = mapResponsesTerminalStopReason(params.status);
  if (stopReason === "stop" && params.hasToolCall) {
    return { stopReason: "toolUse" };
  }
  return { stopReason };
}

// packages/ai/src/providers/openai-responses-tool-call-tracker.ts
function readIdentityValue(value) {
  const identity = typeof value === "string" ? value.trim() : "";
  return identity || void 0;
}
function readOutputIndex(event) {
  return typeof event.output_index === "number" && Number.isInteger(event.output_index) && event.output_index >= 0 ? event.output_index : void 0;
}
function readEventIdentity(event) {
  return { itemId: readIdentityValue(event.item_id) };
}
function readResponsesToolCallItemIdentity(item) {
  return {
    itemId: readIdentityValue(item.id),
    callId: readIdentityValue(item.call_id)
  };
}
function createResponsesToolCallTracker() {
  const indexedCalls = /* @__PURE__ */ new Map();
  const unindexedCalls = /* @__PURE__ */ new Set();
  const identitiesConflict = (state, identity) => Boolean(
    state.itemId && identity.itemId && state.itemId !== identity.itemId || state.callId && identity.callId && state.callId !== identity.callId
  );
  const sharesIdentity = (state, identity) => Boolean(
    state.itemId && identity.itemId && state.itemId === identity.itemId || state.callId && identity.callId && state.callId === identity.callId
  );
  const adoptIdentity = (state, identity) => {
    state.itemId ??= identity.itemId;
    state.callId ??= identity.callId;
    return state;
  };
  const resolveCompatible = (candidates, identity) => {
    const uniqueCandidates = [...new Set(candidates)];
    if (!identity.itemId && !identity.callId) {
      return uniqueCandidates.length === 1 ? uniqueCandidates.at(0) : void 0;
    }
    const compatible = uniqueCandidates.filter((state) => !identitiesConflict(state, identity));
    const matches = compatible.filter((state) => sharesIdentity(state, identity));
    const matched = matches.length === 1 ? matches.at(0) : void 0;
    if (matched) {
      return adoptIdentity(matched, identity);
    }
    const soleCompatible = uniqueCandidates.length === 1 && compatible.length === 1 && matches.length === 0 ? compatible.at(0) : void 0;
    return soleCompatible ? adoptIdentity(soleCompatible, identity) : void 0;
  };
  return {
    register(event, state) {
      const outputIndex = readOutputIndex(event);
      if (outputIndex === void 0) {
        unindexedCalls.add(state);
        return;
      }
      if (indexedCalls.has(outputIndex)) {
        throw new Error(`Responses stream reused active tool-call output index ${outputIndex}`);
      }
      indexedCalls.set(outputIndex, state);
    },
    resolve(event, identity = readEventIdentity(event)) {
      const outputIndex = readOutputIndex(event);
      if (outputIndex !== void 0) {
        const indexed = indexedCalls.get(outputIndex);
        if (indexed) {
          if (indexed.callId && identity.callId && indexed.callId !== identity.callId) {
            return void 0;
          }
          return adoptIdentity(indexed, identity);
        }
        const unindexed = resolveCompatible(unindexedCalls, identity);
        if (unindexed) {
          unindexedCalls.delete(unindexed);
          indexedCalls.set(outputIndex, unindexed);
        }
        return unindexed;
      }
      return resolveCompatible([...indexedCalls.values(), ...unindexedCalls], identity);
    },
    forget(toolCall) {
      for (const [outputIndex, tracked] of indexedCalls) {
        if (tracked === toolCall) {
          indexedCalls.delete(outputIndex);
        }
      }
      unindexedCalls.delete(toolCall);
    },
    markArgumentsUnreliable() {
      for (const toolCall of /* @__PURE__ */ new Set([...indexedCalls.values(), ...unindexedCalls])) {
        toolCall.argumentStreamReliable = false;
      }
    },
    hasActive() {
      return indexedCalls.size > 0 || unindexedCalls.size > 0;
    }
  };
}

// packages/ai/src/providers/openai-responses-tools.ts
import { createHash } from "node:crypto";

// packages/normalization-core/src/record-coerce.ts
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// packages/ai/src/providers/tool-schema-json-projection.ts
import { types as utilTypes } from "node:util";
function isJsonValue(value) {
  if (value === null) {
    return true;
  }
  switch (typeof value) {
    case "boolean":
    case "string":
      return true;
    case "number":
      return Number.isFinite(value);
    case "object":
      if (Array.isArray(value)) {
        return value.every(isJsonValue);
      }
      return Object.values(value).every(isJsonValue);
    default:
      return false;
  }
}
function isJsonObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isNonFiniteNumberValue(value) {
  if (typeof value === "number") {
    return !Number.isFinite(value);
  }
  if (value === null || typeof value !== "object" || !utilTypes.isNumberObject(value)) {
    return false;
  }
  return !Number.isFinite(Number.prototype.valueOf.call(value));
}
function serializeToolInputSchema(value, path) {
  const nonFiniteNumber = {
    path: null
  };
  const paths = /* @__PURE__ */ new WeakMap();
  let isRoot = true;
  let text;
  try {
    text = JSON.stringify(value, function(key, entry) {
      const holderPath = paths.get(this);
      const entryPath = isRoot ? path : holderPath === void 0 ? `${path}.${key}` : Array.isArray(this) ? `${holderPath}[${key}]` : `${holderPath}.${key}`;
      isRoot = false;
      if (nonFiniteNumber.path === null && isNonFiniteNumberValue(entry)) {
        nonFiniteNumber.path = entryPath;
      } else if (entry && typeof entry === "object") {
        paths.set(entry, entryPath);
      }
      return entry;
    });
  } catch {
    return {
      schema: {},
      violations: [`${path} is not JSON-serializable`]
    };
  }
  if (!text) {
    return {
      schema: {},
      violations: [`${path} is not JSON-serializable`]
    };
  }
  if (nonFiniteNumber.path !== null) {
    const violationPath = nonFiniteNumber.path;
    return {
      schema: {},
      violations: [`${violationPath} is not JSON-serializable`]
    };
  }
  const parsed = JSON.parse(text);
  if (!isJsonValue(parsed)) {
    return {
      schema: {},
      violations: [`${path} is not a JSON value`]
    };
  }
  return {
    schema: parsed,
    violations: []
  };
}
var schemaMapKeywords = /* @__PURE__ */ new Set([
  "$defs",
  "definitions",
  "dependencies",
  "dependentSchemas",
  "patternProperties",
  "properties"
]);
function findDynamicSchemaKeywordViolations(schema, path) {
  if (Array.isArray(schema)) {
    return schema.flatMap(
      (entry, index) => findDynamicSchemaKeywordViolations(entry, `${path}[${index}]`)
    );
  }
  if (!isJsonObject(schema)) {
    return [];
  }
  const violations = [];
  for (const key of ["$dynamicRef", "$dynamicAnchor"]) {
    if (key in schema) {
      violations.push(`${path}.${key}`);
    }
  }
  for (const [key, value] of Object.entries(schema)) {
    if (!value || typeof value !== "object") {
      continue;
    }
    if (schemaMapKeywords.has(key) && isJsonObject(value)) {
      for (const [schemaName, childSchema] of Object.entries(value)) {
        violations.push(
          ...findDynamicSchemaKeywordViolations(childSchema, `${path}.${key}.${schemaName}`)
        );
      }
    } else {
      violations.push(...findDynamicSchemaKeywordViolations(value, `${path}.${key}`));
    }
  }
  return violations;
}
function projectRuntimeToolInputSchema(schema, path = "parameters") {
  const projection = serializeToolInputSchema(schema, path);
  const violations = [...projection.violations];
  if (!isJsonObject(projection.schema)) {
    violations.push(`${path} must be a JSON object schema`);
  } else if (projection.schema.type !== void 0 && projection.schema.type !== "object") {
    violations.push(`${path}.type must be "object"`);
  }
  violations.push(...findDynamicSchemaKeywordViolations(projection.schema, path));
  return {
    schema: projection.schema,
    violations
  };
}

// packages/ai/src/providers/openai-tool-projection.ts
function unreadableToolDiagnostic(toolIndex) {
  return {
    toolIndex,
    violations: [`tool[${toolIndex}] is unreadable`]
  };
}
function projectOpenAITools(tools) {
  let inputToolCount;
  try {
    inputToolCount = tools.length;
  } catch {
    return {
      inputToolCount: 0,
      tools: [],
      diagnostics: [unreadableToolDiagnostic(0)]
    };
  }
  const projectedTools = [];
  const diagnostics = [];
  for (let toolIndex = 0; toolIndex < inputToolCount; toolIndex += 1) {
    let tool;
    try {
      const candidate = tools[toolIndex];
      if (!candidate) {
        diagnostics.push(unreadableToolDiagnostic(toolIndex));
        continue;
      }
      tool = candidate;
    } catch {
      diagnostics.push(unreadableToolDiagnostic(toolIndex));
      continue;
    }
    let name;
    try {
      name = tool.name;
    } catch {
      diagnostics.push({
        toolIndex,
        violations: [`tool[${toolIndex}].name is unreadable`]
      });
      continue;
    }
    if (typeof name !== "string" || !name) {
      diagnostics.push({
        toolIndex,
        violations: [`tool[${toolIndex}].name is empty`]
      });
      continue;
    }
    let parameters;
    try {
      parameters = tool.parameters;
    } catch {
      diagnostics.push({
        toolIndex,
        toolName: name,
        violations: [`${name}.parameters is unreadable`]
      });
      continue;
    }
    const schemaProjection = projectRuntimeToolInputSchema(parameters ?? {}, `${name}.parameters`);
    if (!isRecord(schemaProjection.schema) || schemaProjection.violations.length > 0) {
      diagnostics.push({
        toolIndex,
        toolName: name,
        violations: schemaProjection.violations.length > 0 ? schemaProjection.violations : [`${name}.parameters must be a JSON object schema`]
      });
      continue;
    }
    let descriptionValue;
    try {
      descriptionValue = tool.description;
    } catch {
    }
    const description = typeof descriptionValue === "string" ? descriptionValue : void 0;
    projectedTools.push({
      toolIndex,
      name,
      ...description !== void 0 ? { description } : {},
      parameters: schemaProjection.schema
    });
  }
  return {
    inputToolCount,
    tools: projectedTools,
    diagnostics
  };
}

// packages/ai/src/providers/clean-for-gemini.ts
var GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS = /* @__PURE__ */ new Set([
  "patternProperties",
  "additionalProperties",
  "$schema",
  "$id",
  "$ref",
  "$defs",
  "definitions",
  // Non-standard (OpenAPI) keyword; Claude validators reject it.
  "examples",
  // Cloud Code Assist appears to validate tool schemas more strictly/quirkily than
  // draft 2020-12 in practice; these constraints frequently trigger 400s.
  "minLength",
  "maxLength",
  "minimum",
  "maximum",
  "multipleOf",
  "pattern",
  "format",
  "minItems",
  "maxItems",
  "uniqueItems",
  "minProperties",
  "maxProperties",
  // JSON Schema composition keywords not supported by OpenAPI 3.0 subset.
  // `const` is handled separately (converted to enum) in the cleaning loop,
  // but `not` has no safe equivalent and must be stripped.
  "not"
]);
var SCHEMA_META_KEYS = ["description", "title", "default"];
function copySchemaMeta(from, to) {
  for (const key of SCHEMA_META_KEYS) {
    if (key in from && from[key] !== void 0) {
      to[key] = from[key];
    }
  }
}
function stringifyGeminiEnumValue(value) {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "boolean") {
    return String(value);
  }
  return void 0;
}
function cleanGeminiEnumValues(value) {
  if (!Array.isArray(value)) {
    return void 0;
  }
  const values = value.flatMap((entry) => {
    const stringified = stringifyGeminiEnumValue(entry);
    return stringified === void 0 ? [] : [stringified];
  });
  const unique = [...new Set(values)];
  return unique.length > 0 ? unique : void 0;
}
function tryFlattenLiteralAnyOf(variants) {
  if (variants.length === 0) {
    return null;
  }
  const allValues = [];
  let commonType = null;
  for (const variant of variants) {
    if (!variant || typeof variant !== "object") {
      return null;
    }
    const v = variant;
    let literalValue;
    if ("const" in v) {
      literalValue = v.const;
    } else if (Array.isArray(v.enum) && v.enum.length === 1) {
      literalValue = v.enum[0];
    } else {
      return null;
    }
    const variantType = typeof v.type === "string" ? v.type : null;
    if (!variantType) {
      return null;
    }
    if (commonType === null) {
      commonType = variantType;
    } else if (commonType !== variantType) {
      return null;
    }
    allValues.push(literalValue);
  }
  if (commonType && allValues.length > 0) {
    return { type: commonType, enum: allValues };
  }
  return null;
}
function isNullSchema(variant) {
  if (!variant || typeof variant !== "object" || Array.isArray(variant)) {
    return false;
  }
  const record = variant;
  if ("const" in record && record.const === null) {
    return true;
  }
  if (Array.isArray(record.enum) && record.enum.length === 1) {
    return record.enum[0] === null;
  }
  const typeValue = record.type;
  if (typeValue === "null") {
    return true;
  }
  if (Array.isArray(typeValue) && typeValue.length === 1 && typeValue[0] === "null") {
    return true;
  }
  return false;
}
function stripNullVariants(variants) {
  if (variants.length === 0) {
    return { variants, stripped: false };
  }
  const nonNull = variants.filter((variant) => !isNullSchema(variant));
  return {
    variants: nonNull,
    stripped: nonNull.length !== variants.length
  };
}
function extendSchemaDefs(defs, schema) {
  const defsEntry = schema.$defs && typeof schema.$defs === "object" && !Array.isArray(schema.$defs) ? schema.$defs : void 0;
  const legacyDefsEntry = schema.definitions && typeof schema.definitions === "object" && !Array.isArray(schema.definitions) ? schema.definitions : void 0;
  if (!defsEntry && !legacyDefsEntry) {
    return defs;
  }
  const next = defs ? new Map(defs) : /* @__PURE__ */ new Map();
  if (defsEntry) {
    for (const [key, value] of Object.entries(defsEntry)) {
      next.set(key, value);
    }
  }
  if (legacyDefsEntry) {
    for (const [key, value] of Object.entries(legacyDefsEntry)) {
      next.set(key, value);
    }
  }
  return next;
}
function decodeJsonPointerSegment(segment) {
  return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}
function tryResolveLocalRef(ref, defs) {
  if (!defs) {
    return void 0;
  }
  const match = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
  if (!match) {
    return void 0;
  }
  const name = decodeJsonPointerSegment(match[1] ?? "");
  if (!name) {
    return void 0;
  }
  return defs.get(name);
}
function simplifyUnionVariants(params) {
  const { obj, variants } = params;
  const { variants: nonNullVariants, stripped } = stripNullVariants(variants);
  const flattened = tryFlattenLiteralAnyOf(nonNullVariants);
  if (flattened) {
    const result = {
      type: flattened.type,
      enum: flattened.enum
    };
    copySchemaMeta(obj, result);
    return { variants: nonNullVariants, simplified: result };
  }
  if (stripped && nonNullVariants.length === 1) {
    const lone = nonNullVariants[0];
    if (lone && typeof lone === "object" && !Array.isArray(lone)) {
      const result = {
        ...lone
      };
      copySchemaMeta(obj, result);
      return { variants: nonNullVariants, simplified: result };
    }
    return { variants: nonNullVariants, simplified: lone };
  }
  return { variants: stripped ? nonNullVariants : variants };
}
function sanitizeRequiredFields(schema) {
  if (!Array.isArray(schema.required)) {
    return schema;
  }
  if (!schema.properties || typeof schema.properties !== "object" || Array.isArray(schema.properties)) {
    if (schema.type === "object") {
      delete schema.required;
    }
    return schema;
  }
  const properties = schema.properties;
  const required = schema.required.filter(
    (key) => typeof key === "string" && Object.hasOwn(properties, key)
  );
  if (required.length > 0) {
    schema.required = required;
  } else {
    delete schema.required;
  }
  return schema;
}
function cleanSchemaForGeminiWithDefs(schema, defs, refStack) {
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  if (Array.isArray(schema)) {
    return schema.map((item) => cleanSchemaForGeminiWithDefs(item, defs, refStack));
  }
  const obj = schema;
  const nextDefs = extendSchemaDefs(defs, obj);
  const refValue = typeof obj.$ref === "string" ? obj.$ref : void 0;
  if (refValue) {
    if (refStack?.has(refValue)) {
      return {};
    }
    const resolved = tryResolveLocalRef(refValue, nextDefs);
    if (resolved) {
      const nextRefStack = refStack ? new Set(refStack) : /* @__PURE__ */ new Set();
      nextRefStack.add(refValue);
      const cleaned2 = cleanSchemaForGeminiWithDefs(resolved, nextDefs, nextRefStack);
      if (!cleaned2 || typeof cleaned2 !== "object" || Array.isArray(cleaned2)) {
        return cleaned2;
      }
      const result2 = {
        ...cleaned2
      };
      copySchemaMeta(obj, result2);
      return result2;
    }
    const result = {};
    copySchemaMeta(obj, result);
    return result;
  }
  const hasAnyOf = "anyOf" in obj && Array.isArray(obj.anyOf);
  const hasOneOf = "oneOf" in obj && Array.isArray(obj.oneOf);
  let cleanedAnyOf = hasAnyOf ? obj.anyOf.map(
    (variant) => cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack)
  ) : void 0;
  let cleanedOneOf = hasOneOf ? obj.oneOf.map(
    (variant) => cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack)
  ) : void 0;
  if (hasAnyOf) {
    const simplified = simplifyUnionVariants({ obj, variants: cleanedAnyOf ?? [] });
    cleanedAnyOf = simplified.variants;
    if ("simplified" in simplified) {
      return simplified.simplified;
    }
  }
  if (hasOneOf) {
    const simplified = simplifyUnionVariants({ obj, variants: cleanedOneOf ?? [] });
    cleanedOneOf = simplified.variants;
    if ("simplified" in simplified) {
      return simplified.simplified;
    }
  }
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS.has(key)) {
      continue;
    }
    if (key === "const") {
      const enumValues = cleanGeminiEnumValues([value]);
      if (enumValues) {
        cleaned.enum = enumValues;
      }
      continue;
    }
    if (key === "enum") {
      const enumValues = cleanGeminiEnumValues(value);
      if (enumValues) {
        cleaned.enum = enumValues;
      }
      continue;
    }
    if (key === "required" && Array.isArray(value) && value.length === 0) {
      continue;
    }
    if (key === "type" && (hasAnyOf || hasOneOf)) {
      continue;
    }
    if (key === "type" && Array.isArray(value) && value.every((entry) => typeof entry === "string")) {
      const types = value.filter((entry) => entry !== "null");
      cleaned.type = types.length === 1 ? types[0] : types;
      continue;
    }
    if (key === "properties") {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const props = value;
        cleaned[key] = Object.fromEntries(
          Object.entries(props).map(([k, v]) => [
            k,
            cleanSchemaForGeminiWithDefs(v, nextDefs, refStack)
          ])
        );
      } else {
        cleaned[key] = {};
      }
    } else if (key === "items" && value) {
      if (Array.isArray(value)) {
        cleaned[key] = value.map(
          (entry) => cleanSchemaForGeminiWithDefs(entry, nextDefs, refStack)
        );
      } else if (typeof value === "object") {
        cleaned[key] = cleanSchemaForGeminiWithDefs(value, nextDefs, refStack);
      } else {
        cleaned[key] = value;
      }
    } else if (key === "anyOf" && Array.isArray(value)) {
      cleaned[key] = cleanedAnyOf ?? value.map((variant) => cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack));
    } else if (key === "oneOf" && Array.isArray(value)) {
      cleaned[key] = cleanedOneOf ?? value.map((variant) => cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack));
    } else if (key === "allOf" && Array.isArray(value)) {
      cleaned[key] = value.map(
        (variant) => cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack)
      );
    } else {
      cleaned[key] = value;
    }
  }
  if (cleaned.anyOf && Array.isArray(cleaned.anyOf)) {
    const flattened = flattenUnionFallback(cleaned, cleaned.anyOf);
    if (flattened) {
      return sanitizeRequiredFields(flattened);
    }
  }
  if (cleaned.oneOf && Array.isArray(cleaned.oneOf)) {
    const flattened = flattenUnionFallback(cleaned, cleaned.oneOf);
    if (flattened) {
      return sanitizeRequiredFields(flattened);
    }
  }
  return sanitizeRequiredFields(cleaned);
}
function flattenUnionFallback(obj, variants) {
  const objects = variants.filter(
    (v) => Boolean(v) && typeof v === "object"
  );
  if (objects.length === 0) {
    return void 0;
  }
  const types = new Set(objects.map((v) => v.type).filter(Boolean));
  if (objects.length === 1) {
    const merged2 = { ...objects[0] };
    copySchemaMeta(obj, merged2);
    return merged2;
  }
  if (types.size === 1) {
    const merged2 = { type: Array.from(types)[0] };
    copySchemaMeta(obj, merged2);
    return merged2;
  }
  const first = objects[0];
  if (first?.type) {
    const merged2 = { type: first.type };
    copySchemaMeta(obj, merged2);
    return merged2;
  }
  const merged = {};
  copySchemaMeta(obj, merged);
  return merged;
}
function cleanSchemaForGemini(schema) {
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  if (Array.isArray(schema)) {
    return schema.map(cleanSchemaForGemini);
  }
  const defs = extendSchemaDefs(void 0, schema);
  return cleanSchemaForGeminiWithDefs(schema, defs, void 0);
}

// packages/ai/src/providers/schema-keyword-strip.ts
function stripUnsupportedSchemaKeywords(schema, unsupportedKeywords) {
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  if (Array.isArray(schema)) {
    return schema.map((entry) => stripUnsupportedSchemaKeywords(entry, unsupportedKeywords));
  }
  const obj = schema;
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (unsupportedKeywords.has(key)) {
      continue;
    }
    if (key === "properties" && value && typeof value === "object" && !Array.isArray(value)) {
      cleaned[key] = Object.fromEntries(
        Object.entries(value).map(([childKey, childValue]) => [
          childKey,
          stripUnsupportedSchemaKeywords(childValue, unsupportedKeywords)
        ])
      );
      continue;
    }
    if (key === "items" && value && typeof value === "object") {
      cleaned[key] = Array.isArray(value) ? value.map((entry) => stripUnsupportedSchemaKeywords(entry, unsupportedKeywords)) : stripUnsupportedSchemaKeywords(value, unsupportedKeywords);
      continue;
    }
    if ((key === "anyOf" || key === "oneOf" || key === "allOf") && Array.isArray(value)) {
      cleaned[key] = value.map(
        (entry) => stripUnsupportedSchemaKeywords(entry, unsupportedKeywords)
      );
      continue;
    }
    cleaned[key] = value;
  }
  return cleaned;
}

// packages/ai/src/providers/agent-tools-parameter-schema.ts
function extractToolSchemaModelCompat(modelOrCompat) {
  if (!modelOrCompat || typeof modelOrCompat !== "object") {
    return void 0;
  }
  if ("compat" in modelOrCompat) {
    const compat = modelOrCompat.compat;
    return compat && typeof compat === "object" ? compat : void 0;
  }
  return modelOrCompat;
}
function resolveUnsupportedToolSchemaKeywords(modelOrCompat) {
  const keywords = extractToolSchemaModelCompat(modelOrCompat)?.unsupportedToolSchemaKeywords ?? [];
  return new Set(
    normalizeStringEntries(
      keywords.filter((keyword) => typeof keyword === "string")
    )
  );
}
function shouldOmitEmptyArrayItems(modelOrCompat) {
  return extractToolSchemaModelCompat(modelOrCompat)?.omitEmptyArrayItems === true;
}
var MAX_TOOL_PARAMETER_SCHEMA_CACHE_ENTRIES_PER_SCHEMA = 8;
var toolParameterSchemaCache = /* @__PURE__ */ new WeakMap();
function resolveToolParameterSchemaCacheKey(options) {
  const normalizedProvider = normalizeLowercaseStringOrEmpty(options?.modelProvider);
  const normalizedModelId = normalizeLowercaseStringOrEmpty(options?.modelId);
  const toolSchemaProfile = normalizeLowercaseStringOrEmpty(
    options?.modelCompat?.toolSchemaProfile
  );
  const unsupportedKeywords = Array.from(
    resolveUnsupportedToolSchemaKeywords(options?.modelCompat)
  ).toSorted();
  const omitEmptyArrayItems = shouldOmitEmptyArrayItems(options?.modelCompat);
  return JSON.stringify([
    normalizedProvider,
    normalizedModelId,
    toolSchemaProfile,
    unsupportedKeywords,
    omitEmptyArrayItems
  ]);
}
function getCachedToolParameterSchema(schema, key) {
  return toolParameterSchemaCache.get(schema)?.find((entry) => entry.key === key)?.value;
}
function rememberCachedToolParameterSchema(schema, key, value) {
  const entries = toolParameterSchemaCache.get(schema) ?? [];
  toolParameterSchemaCache.set(
    schema,
    [{ key, value }, ...entries.filter((entry) => entry.key !== key)].slice(
      0,
      MAX_TOOL_PARAMETER_SCHEMA_CACHE_ENTRIES_PER_SCHEMA
    )
  );
  return value;
}
function isGeminiModelId(modelId) {
  return /(?:^|[/:])gemini(?:$|[-/:.])/.test(modelId);
}
function extractEnumValues(schema) {
  if (!schema || typeof schema !== "object") {
    return void 0;
  }
  const record = schema;
  if (Array.isArray(record.enum)) {
    return record.enum;
  }
  if ("const" in record) {
    return [record.const];
  }
  const variants = Array.isArray(record.anyOf) ? record.anyOf : Array.isArray(record.oneOf) ? record.oneOf : null;
  if (variants) {
    const values = variants.flatMap((variant) => {
      const extracted = extractEnumValues(variant);
      return extracted ?? [];
    });
    return values.length > 0 ? values : void 0;
  }
  return void 0;
}
function mergePropertySchemas(existing, incoming) {
  if (!existing) {
    return incoming;
  }
  if (!incoming) {
    return existing;
  }
  const existingEnum = extractEnumValues(existing);
  const incomingEnum = extractEnumValues(incoming);
  if (existingEnum || incomingEnum) {
    const values = uniqueValues([...existingEnum ?? [], ...incomingEnum ?? []]);
    const merged = {};
    for (const source of [existing, incoming]) {
      if (!source || typeof source !== "object") {
        continue;
      }
      const record = source;
      for (const key of ["title", "description", "default"]) {
        if (!(key in merged) && key in record) {
          merged[key] = record[key];
        }
      }
    }
    const types = new Set(values.map((value) => typeof value));
    if (types.size === 1) {
      merged.type = Array.from(types)[0];
    }
    merged.enum = values;
    return merged;
  }
  return existing;
}
function setOwnSchemaProperty(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    enumerable: true,
    configurable: true,
    writable: true
  });
}
function hasTopLevelArrayKeyword(schemaRecord, key) {
  return Array.isArray(schemaRecord[key]);
}
function getFlattenableVariantKey(schemaRecord) {
  if (hasTopLevelArrayKeyword(schemaRecord, "anyOf")) {
    return "anyOf";
  }
  if (hasTopLevelArrayKeyword(schemaRecord, "oneOf")) {
    return "oneOf";
  }
  return null;
}
function getTopLevelConditionalKey(schemaRecord) {
  return getFlattenableVariantKey(schemaRecord) ?? (hasTopLevelArrayKeyword(schemaRecord, "allOf") ? "allOf" : null);
}
function hasTopLevelObjectSchema(schemaRecord, conditionalKey) {
  return schemaRecord.type === "object" && isRecord(schemaRecord.properties) && conditionalKey === null;
}
function isObjectLikeSchemaMissingType(schemaRecord, conditionalKey) {
  return !("type" in schemaRecord) && (isRecord(schemaRecord.properties) || Array.isArray(schemaRecord.required)) && conditionalKey === null;
}
function isTypedObjectSchemaMissingValidProperties(schemaRecord, conditionalKey) {
  return schemaRecord.type === "object" && !isRecord(schemaRecord.properties) && conditionalKey === null;
}
function isTrulyEmptySchema(schemaRecord) {
  return Object.keys(schemaRecord).length === 0;
}
function normalizeArraySchemasMissingItems(schema) {
  if (!isRecord(schema)) {
    return schema;
  }
  let changed = false;
  const nextSchema = { ...schema };
  if (nextSchema.type === "array" && nextSchema.items === void 0) {
    nextSchema.items = {};
    changed = true;
  }
  const normalizeSchemaValue = (key) => {
    if (!(key in nextSchema)) {
      return;
    }
    const value = nextSchema[key];
    if (Array.isArray(value)) {
      const normalized2 = value.map(normalizeArraySchemasMissingItems);
      if (normalized2.some((entry, index) => entry !== value[index])) {
        nextSchema[key] = normalized2;
        changed = true;
      }
      return;
    }
    const normalized = normalizeArraySchemasMissingItems(value);
    if (normalized !== value) {
      nextSchema[key] = normalized;
      changed = true;
    }
  };
  for (const key of [
    "items",
    "contains",
    "additionalProperties",
    "propertyNames",
    "not",
    "if",
    "then",
    "else"
  ]) {
    normalizeSchemaValue(key);
  }
  for (const key of ["anyOf", "oneOf", "allOf", "prefixItems"]) {
    normalizeSchemaValue(key);
  }
  for (const key of [
    "properties",
    "patternProperties",
    "dependentSchemas",
    "$defs",
    "definitions"
  ]) {
    const value = nextSchema[key];
    if (!isRecord(value)) {
      continue;
    }
    let entriesChanged = false;
    const normalizedEntries = Object.entries(value).map(
      ([entryKey, entryValue]) => {
        const normalizedEntryValue = normalizeArraySchemasMissingItems(entryValue);
        if (normalizedEntryValue !== entryValue) {
          entriesChanged = true;
        }
        return [entryKey, normalizedEntryValue];
      }
    );
    if (entriesChanged) {
      nextSchema[key] = Object.fromEntries(normalizedEntries);
      changed = true;
    }
  }
  return changed ? nextSchema : schema;
}
function schemaAllowsArrayType(schema) {
  const type = schema.type;
  return type === "array" || Array.isArray(type) && type.includes("array");
}
var ARRAY_ITEMS_SCHEMA_OBJECT_KEYS = /* @__PURE__ */ new Set([
  "additionalProperties",
  "contains",
  "else",
  "if",
  "items",
  "not",
  "propertyNames",
  "then"
]);
var ARRAY_ITEMS_SCHEMA_ARRAY_KEYS = /* @__PURE__ */ new Set(["allOf", "anyOf", "oneOf", "prefixItems"]);
var ARRAY_ITEMS_SCHEMA_MAP_KEYS = /* @__PURE__ */ new Set([
  "$defs",
  "definitions",
  "dependentSchemas",
  "patternProperties",
  "properties"
]);
function stripEmptyArrayItemsFromArraySchemas(schema) {
  if (Array.isArray(schema)) {
    let changed2 = false;
    const entries2 = schema.map((entry) => {
      const next = stripEmptyArrayItemsFromArraySchemas(entry);
      changed2 ||= next !== entry;
      return next;
    });
    return changed2 ? entries2 : schema;
  }
  if (!isRecord(schema)) {
    return schema;
  }
  let changed = false;
  const entries = Object.entries(schema).flatMap(([key, value]) => {
    if (key === "items" && schemaAllowsArrayType(schema) && isRecord(value) && isTrulyEmptySchema(value)) {
      changed = true;
      return [];
    }
    if (ARRAY_ITEMS_SCHEMA_OBJECT_KEYS.has(key)) {
      const next = stripEmptyArrayItemsFromArraySchemas(value);
      changed ||= next !== value;
      return [[key, next]];
    }
    if (ARRAY_ITEMS_SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(value)) {
      const next = stripEmptyArrayItemsFromArraySchemas(value);
      changed ||= next !== value;
      return [[key, next]];
    }
    if (ARRAY_ITEMS_SCHEMA_MAP_KEYS.has(key) && isRecord(value)) {
      let mapChanged = false;
      const next = Object.fromEntries(
        Object.entries(value).map(([entryKey, entryValue]) => {
          const entryNext = stripEmptyArrayItemsFromArraySchemas(entryValue);
          mapChanged ||= entryNext !== entryValue;
          return [entryKey, entryNext];
        })
      );
      changed ||= mapChanged;
      return [[key, mapChanged ? next : value]];
    }
    return [[key, value]];
  });
  return changed ? Object.fromEntries(entries) : schema;
}
function copySchemaMeta2(from, to) {
  for (const key of ["title", "description", "default"]) {
    if (key in from && from[key] !== void 0) {
      to[key] = from[key];
    }
  }
}
function extendSchemaDefs2(defs, schema) {
  const defsEntry = schema.$defs && typeof schema.$defs === "object" && !Array.isArray(schema.$defs) ? schema.$defs : void 0;
  const legacyDefsEntry = schema.definitions && typeof schema.definitions === "object" && !Array.isArray(schema.definitions) ? schema.definitions : void 0;
  if (!defsEntry && !legacyDefsEntry) {
    return defs;
  }
  const next = defs ? {
    $defs: new Map(defs.$defs),
    definitions: new Map(defs.definitions)
  } : {
    $defs: /* @__PURE__ */ new Map(),
    definitions: /* @__PURE__ */ new Map()
  };
  if (defsEntry) {
    for (const [key, value] of Object.entries(defsEntry)) {
      next.$defs.set(key, value);
    }
  }
  if (legacyDefsEntry) {
    for (const [key, value] of Object.entries(legacyDefsEntry)) {
      next.definitions.set(key, value);
    }
  }
  return next;
}
function decodeJsonPointerSegment2(segment) {
  return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}
function resolveJsonPointerPath(value, segments) {
  let current = value;
  for (const segment of segments) {
    if (!current || typeof current !== "object") {
      return void 0;
    }
    const key = decodeJsonPointerSegment2(segment);
    if (Array.isArray(current)) {
      const index = /^(?:0|[1-9]\d*)$/.test(key) ? Number(key) : -1;
      if (index < 0 || index >= current.length) {
        return void 0;
      }
      current = current[index];
      continue;
    }
    const record = current;
    if (!Object.hasOwn(record, key)) {
      return void 0;
    }
    current = record[key];
  }
  return current;
}
function resolveLocalJsonPointer(rootDocument, ref) {
  if (!ref.startsWith("#/")) {
    return void 0;
  }
  return resolveJsonPointerPath(rootDocument, ref.slice(2).split("/"));
}
var SCHEMA_MAP_KEYS = /* @__PURE__ */ new Set([
  "$defs",
  "definitions",
  "dependentSchemas",
  "patternProperties",
  "properties"
]);
var SCHEMA_OBJECT_KEYS = /* @__PURE__ */ new Set([
  "additionalProperties",
  "contains",
  "else",
  "if",
  "items",
  "not",
  "propertyNames",
  "then"
]);
var SCHEMA_ARRAY_KEYS = /* @__PURE__ */ new Set(["allOf", "anyOf", "items", "oneOf", "prefixItems"]);
var SCHEMA_LITERAL_KEYS = /* @__PURE__ */ new Set(["const", "default", "enum", "examples"]);
function tryResolveLocalRef2(ref, defs, rootDocument) {
  const match = ref.match(/^#\/(\$defs|definitions)\/([^/]+)(?:\/(.*))?$/);
  if (match && defs) {
    const namespace = match[1] === "$defs" ? defs.$defs : defs.definitions;
    const name = decodeJsonPointerSegment2(match[2] ?? "");
    const resolved = name ? namespace.get(name) : void 0;
    if (resolved !== void 0) {
      const remainingPath = match[3] ? match[3].split("/") : [];
      return resolveJsonPointerPath(resolved, remainingPath);
    }
  }
  return resolveLocalJsonPointer(rootDocument, ref);
}
function inlineLocalSchemaRefsWithDefs(schema, defs, refStack, state, rootDocument) {
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  if (Array.isArray(schema)) {
    return schema.map(
      (entry) => inlineLocalSchemaRefsWithDefs(entry, defs, refStack, state, rootDocument)
    );
  }
  const obj = schema;
  const nextDefs = extendSchemaDefs2(defs, obj);
  const refValue = typeof obj.$ref === "string" ? obj.$ref : void 0;
  if (refValue) {
    if (refStack?.has(refValue)) {
      return {};
    }
    const resolved = tryResolveLocalRef2(refValue, nextDefs, rootDocument);
    if (resolved === void 0) {
      if (refValue.startsWith("#/")) {
        state.unresolvedLocalRefs = true;
      }
      return { ...obj };
    }
    const nextRefStack = refStack ? new Set(refStack) : /* @__PURE__ */ new Set();
    nextRefStack.add(refValue);
    const inlined = inlineLocalSchemaRefsWithDefs(
      resolved,
      nextDefs,
      nextRefStack,
      state,
      rootDocument
    );
    if (!inlined || typeof inlined !== "object" || Array.isArray(inlined)) {
      return inlined;
    }
    const result2 = { ...inlined };
    copySchemaMeta2(obj, result2);
    if (obj.nullable === true) {
      result2.nullable = true;
    }
    return result2;
  }
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === "$defs" || key === "definitions" || key === "components") {
      continue;
    }
    if (SCHEMA_LITERAL_KEYS.has(key)) {
      setOwnSchemaProperty(result, key, value);
      continue;
    }
    if (SCHEMA_MAP_KEYS.has(key) && isRecord(value)) {
      setOwnSchemaProperty(
        result,
        key,
        Object.fromEntries(
          Object.entries(value).map(([entryKey, entryValue]) => [
            entryKey,
            inlineLocalSchemaRefsWithDefs(entryValue, nextDefs, refStack, state, rootDocument)
          ])
        )
      );
      continue;
    }
    if (SCHEMA_OBJECT_KEYS.has(key) && isRecord(value)) {
      setOwnSchemaProperty(
        result,
        key,
        inlineLocalSchemaRefsWithDefs(value, nextDefs, refStack, state, rootDocument)
      );
      continue;
    }
    if (SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(value)) {
      setOwnSchemaProperty(
        result,
        key,
        value.map(
          (entry) => inlineLocalSchemaRefsWithDefs(entry, nextDefs, refStack, state, rootDocument)
        )
      );
      continue;
    }
    setOwnSchemaProperty(result, key, value);
  }
  if (state.unresolvedLocalRefs) {
    if ("$defs" in obj) {
      result.$defs = obj.$defs;
    }
    if ("definitions" in obj) {
      result.definitions = obj.definitions;
    }
    if ("components" in obj) {
      result.components = obj.components;
    }
  }
  return result;
}
function inlineLocalToolSchemaRefs(schema) {
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  const defs = extendSchemaDefs2(void 0, schema);
  return inlineLocalSchemaRefsWithDefs(
    schema,
    defs,
    void 0,
    {
      unresolvedLocalRefs: false
    },
    schema
  );
}
var OPENAPI_SCHEMA_ANNOTATION_KEYS = /* @__PURE__ */ new Set([
  "discriminator",
  "externalDocs",
  "readOnly",
  "writeOnly",
  "xml",
  "example"
]);
function appendNullSchemaType(type) {
  if (type === "null") {
    return type;
  }
  if (typeof type === "string") {
    return [type, "null"];
  }
  if (Array.isArray(type)) {
    return type.includes("null") ? type : [...type, "null"];
  }
  return type;
}
function isNullSchemaLike(schema) {
  if (!isRecord(schema)) {
    return false;
  }
  if (schema.type === "null") {
    return true;
  }
  if (Array.isArray(schema.type) && schema.type.includes("null")) {
    return true;
  }
  if ("const" in schema && schema.const === null) {
    return true;
  }
  return Array.isArray(schema.enum) && schema.enum.includes(null);
}
function hasOpenApiComposition(schema) {
  return ["allOf", "anyOf", "oneOf"].some((key) => Array.isArray(schema[key]));
}
function schemaCompositionAlreadyAllowsNull(schema) {
  return Array.isArray(schema.anyOf) && schema.anyOf.some(isNullSchemaLike) || Array.isArray(schema.oneOf) && schema.oneOf.some(isNullSchemaLike);
}
function wrapNullableComposedSchema(schema) {
  if (schemaCompositionAlreadyAllowsNull(schema)) {
    return schema;
  }
  const wrapped = {
    anyOf: [schema, { type: "null" }]
  };
  copySchemaMeta2(schema, wrapped);
  return wrapped;
}
function normalizeOpenApiSchemaKeywords(schema) {
  if (Array.isArray(schema)) {
    let changed2 = false;
    const normalized2 = schema.map((entry) => {
      const next = normalizeOpenApiSchemaKeywords(entry);
      changed2 ||= next !== entry;
      return next;
    });
    return changed2 ? normalized2 : schema;
  }
  if (!isRecord(schema)) {
    return schema;
  }
  let changed = false;
  const nullable = schema.nullable === true;
  const normalized = {};
  for (const [key, value] of Object.entries(schema)) {
    if (key === "nullable" || OPENAPI_SCHEMA_ANNOTATION_KEYS.has(key)) {
      changed = true;
      continue;
    }
    if (SCHEMA_LITERAL_KEYS.has(key)) {
      normalized[key] = value;
      continue;
    }
    if (SCHEMA_MAP_KEYS.has(key) && isRecord(value)) {
      let mapChanged = false;
      const next = Object.fromEntries(
        Object.entries(value).map(([entryKey, entryValue]) => {
          const nextEntry = normalizeOpenApiSchemaKeywords(entryValue);
          mapChanged ||= nextEntry !== entryValue;
          return [entryKey, nextEntry];
        })
      );
      normalized[key] = mapChanged ? next : value;
      changed ||= mapChanged;
      continue;
    }
    if (key === "components") {
      normalized[key] = value;
      continue;
    }
    if (SCHEMA_OBJECT_KEYS.has(key) && isRecord(value)) {
      const next = normalizeOpenApiSchemaKeywords(value);
      normalized[key] = next;
      changed ||= next !== value;
      continue;
    }
    if (SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(value)) {
      const next = value.map(normalizeOpenApiSchemaKeywords);
      normalized[key] = next;
      changed ||= next.some((entry, index) => entry !== value[index]);
      continue;
    }
    normalized[key] = value;
  }
  if (nullable) {
    if (hasOpenApiComposition(normalized)) {
      return wrapNullableComposedSchema(normalized);
    }
    if ("type" in normalized) {
      const nextType = appendNullSchemaType(normalized.type);
      if (nextType !== normalized.type) {
        normalized.type = nextType;
      }
    }
    if (Array.isArray(normalized.enum) && !normalized.enum.includes(null)) {
      normalized.enum = [...normalized.enum, null];
    }
  }
  return changed || nullable ? normalized : schema;
}
function normalizeToolParameterSchemaUncached(schema, options) {
  const inlinedSchema = normalizeOpenApiSchemaKeywords(inlineLocalToolSchemaRefs(schema));
  const schemaRecord = inlinedSchema && typeof inlinedSchema === "object" ? inlinedSchema : void 0;
  if (!schemaRecord) {
    return inlinedSchema;
  }
  const normalizedProvider = normalizeLowercaseStringOrEmpty(options?.modelProvider);
  const normalizedModelId = normalizeLowercaseStringOrEmpty(options?.modelId);
  const normalizedToolSchemaProfile = normalizeLowercaseStringOrEmpty(
    options?.modelCompat?.toolSchemaProfile
  );
  const isGeminiProvider = normalizedProvider.includes("google") || normalizedProvider.includes("gemini") || isGeminiModelId(normalizedModelId) || normalizedToolSchemaProfile === "gemini";
  const isAnthropicProvider = normalizedProvider.includes("anthropic");
  const unsupportedToolSchemaKeywords = resolveUnsupportedToolSchemaKeywords(options?.modelCompat);
  const omitEmptyArrayItems = shouldOmitEmptyArrayItems(options?.modelCompat);
  function applyProviderCleaning(s) {
    const normalizedSchema = normalizeArraySchemasMissingItems(s);
    const arrayItemsCompatibleSchema = omitEmptyArrayItems ? stripEmptyArrayItemsFromArraySchemas(normalizedSchema) : normalizedSchema;
    if (isGeminiProvider && !isAnthropicProvider) {
      const geminiCompatibleSchema = cleanSchemaForGemini(arrayItemsCompatibleSchema);
      return unsupportedToolSchemaKeywords.size > 0 ? stripUnsupportedSchemaKeywords(
        geminiCompatibleSchema,
        unsupportedToolSchemaKeywords
      ) : geminiCompatibleSchema;
    }
    if (unsupportedToolSchemaKeywords.size > 0) {
      return stripUnsupportedSchemaKeywords(
        arrayItemsCompatibleSchema,
        unsupportedToolSchemaKeywords
      );
    }
    return arrayItemsCompatibleSchema;
  }
  const conditionalKey = getTopLevelConditionalKey(schemaRecord);
  const flattenableVariantKey = getFlattenableVariantKey(schemaRecord);
  if (hasTopLevelObjectSchema(schemaRecord, conditionalKey)) {
    return applyProviderCleaning(schemaRecord);
  }
  if (isObjectLikeSchemaMissingType(schemaRecord, conditionalKey)) {
    return applyProviderCleaning({
      ...schemaRecord,
      type: "object",
      properties: isRecord(schemaRecord.properties) ? schemaRecord.properties : {}
    });
  }
  if (isTypedObjectSchemaMissingValidProperties(schemaRecord, conditionalKey)) {
    return applyProviderCleaning({ ...schemaRecord, properties: {} });
  }
  if (!flattenableVariantKey) {
    if (isTrulyEmptySchema(schemaRecord)) {
      return applyProviderCleaning({ type: "object", properties: {} });
    }
    if (conditionalKey === "allOf") {
      return applyProviderCleaning(inlinedSchema);
    }
    return applyProviderCleaning(inlinedSchema);
  }
  const variants = schemaRecord[flattenableVariantKey];
  const mergedProperties = {};
  const requiredCounts = /* @__PURE__ */ new Map();
  let objectVariants = 0;
  for (const entry of variants) {
    if (!entry || typeof entry !== "object") {
      continue;
    }
    const props = entry.properties;
    if (!props || typeof props !== "object") {
      continue;
    }
    objectVariants += 1;
    for (const [key, value] of Object.entries(props)) {
      if (!(key in mergedProperties)) {
        mergedProperties[key] = value;
        continue;
      }
      mergedProperties[key] = mergePropertySchemas(mergedProperties[key], value);
    }
    const required = Array.isArray(entry.required) ? entry.required : [];
    for (const key of required) {
      if (typeof key !== "string") {
        continue;
      }
      requiredCounts.set(key, (requiredCounts.get(key) ?? 0) + 1);
    }
  }
  const baseRequired = Array.isArray(schemaRecord.required) ? schemaRecord.required.filter((key) => typeof key === "string") : void 0;
  const mergedRequired = baseRequired && baseRequired.length > 0 ? baseRequired : objectVariants > 0 ? Array.from(requiredCounts.entries()).filter(([, count]) => count === objectVariants).map(([key]) => key) : void 0;
  const nextSchema = { ...schemaRecord };
  const flattenedSchema = {
    type: "object",
    ...typeof nextSchema.title === "string" ? { title: nextSchema.title } : {},
    ...typeof nextSchema.description === "string" ? { description: nextSchema.description } : {},
    properties: Object.keys(mergedProperties).length > 0 ? mergedProperties : schemaRecord.properties ?? {},
    ...mergedRequired && mergedRequired.length > 0 ? { required: mergedRequired } : {},
    additionalProperties: "additionalProperties" in schemaRecord ? schemaRecord.additionalProperties : true
  };
  return applyProviderCleaning(flattenedSchema);
}
function normalizeToolParameterSchema(schema, options) {
  if (!schema || typeof schema !== "object") {
    return normalizeToolParameterSchemaUncached(schema, options);
  }
  const cacheKey = resolveToolParameterSchemaCacheKey(options);
  const cached = getCachedToolParameterSchema(schema, cacheKey);
  if (cached) {
    return cached;
  }
  return rememberCachedToolParameterSchema(
    schema,
    cacheKey,
    normalizeToolParameterSchemaUncached(schema, options)
  );
}

// packages/ai/src/providers/openai-tool-schema-compat.ts
var OPENAI_STRICT_COMPAT_SCHEMA_MAP_KEYS = /* @__PURE__ */ new Set([
  "$defs",
  "definitions",
  "dependentSchemas",
  // Draft-07 dependencies mix schema values with property-name arrays. The
  // recursive helpers leave scalar array entries untouched.
  "dependencies",
  "patternProperties",
  "properties"
]);
var OPENAI_STRICT_COMPAT_SCHEMA_NESTED_KEYS = /* @__PURE__ */ new Set([
  "additionalItems",
  "additionalProperties",
  "allOf",
  "anyOf",
  "contains",
  "contentSchema",
  "else",
  "if",
  "items",
  "not",
  "oneOf",
  "prefixItems",
  "propertyNames",
  "then",
  "unevaluatedItems",
  "unevaluatedProperties"
]);
function findOpenAIStrictSchemaViolations(schema, path, options) {
  if (Array.isArray(schema)) {
    if (options?.requireObjectRoot) {
      return [`${path}.type`];
    }
    return schema.flatMap(
      (item, index) => findOpenAIStrictSchemaViolations(item, `${path}[${index}]`)
    );
  }
  if (!schema || typeof schema !== "object") {
    return options?.requireObjectRoot ? [`${path}.type`] : [];
  }
  const record = schema;
  const violations = [];
  for (const key of ["anyOf", "oneOf", "allOf"]) {
    if (key in record) {
      violations.push(`${path}.${key}`);
    }
  }
  if (Array.isArray(record.type)) {
    violations.push(`${path}.type`);
  }
  const properties = record.properties && typeof record.properties === "object" && !Array.isArray(record.properties) ? record.properties : void 0;
  if (record.type === "object") {
    if (record.additionalProperties !== false) {
      violations.push(`${path}.additionalProperties`);
    }
    const required = Array.isArray(record.required) ? record.required.filter((entry) => typeof entry === "string") : void 0;
    if (!required) {
      violations.push(`${path}.required`);
    } else if (properties) {
      const requiredSet = new Set(required);
      for (const key of Object.keys(properties)) {
        if (!requiredSet.has(key)) {
          violations.push(`${path}.required.${key}`);
        }
      }
    }
  }
  for (const key of OPENAI_STRICT_COMPAT_SCHEMA_MAP_KEYS) {
    const schemaMap = record[key];
    if (!schemaMap || typeof schemaMap !== "object" || Array.isArray(schemaMap)) {
      continue;
    }
    for (const [entryKey, value] of Object.entries(schemaMap)) {
      violations.push(...findOpenAIStrictSchemaViolations(value, `${path}.${key}.${entryKey}`));
    }
  }
  for (const key of OPENAI_STRICT_COMPAT_SCHEMA_NESTED_KEYS) {
    const value = record[key];
    if (value && typeof value === "object") {
      violations.push(...findOpenAIStrictSchemaViolations(value, `${path}.${key}`));
    }
  }
  return violations;
}

// packages/ai/src/providers/openai-tool-schema.ts
var MAX_STRICT_SCHEMA_CACHE_ENTRIES_PER_SCHEMA = 8;
var strictOpenAISchemaCache = /* @__PURE__ */ new WeakMap();
function resolveToolSchemaModelCompat(compat) {
  if (!compat) {
    return void 0;
  }
  const unsupportedToolSchemaKeywords = Array.isArray(compat.unsupportedToolSchemaKeywords) ? compat.unsupportedToolSchemaKeywords.filter(
    (keyword) => typeof keyword === "string"
  ) : [];
  if (unsupportedToolSchemaKeywords.length === 0 && compat.omitEmptyArrayItems !== true) {
    return void 0;
  }
  return {
    ...unsupportedToolSchemaKeywords.length > 0 ? { unsupportedToolSchemaKeywords } : {},
    ...compat.omitEmptyArrayItems === true ? { omitEmptyArrayItems: true } : {}
  };
}
function resolveStrictOpenAISchemaCacheKey(modelCompat) {
  const compat = resolveToolSchemaModelCompat(modelCompat);
  return JSON.stringify([
    [...compat?.unsupportedToolSchemaKeywords ?? []].toSorted(),
    shouldOmitEmptyArrayItems(compat)
  ]);
}
function readCachedStrictOpenAISchema(schema, key) {
  return strictOpenAISchemaCache.get(schema)?.find((entry) => entry.key === key)?.value;
}
function rememberStrictOpenAISchema(schema, key, value) {
  const entries = strictOpenAISchemaCache.get(schema) ?? [];
  strictOpenAISchemaCache.set(
    schema,
    [{ key, value }, ...entries.filter((entry) => entry.key !== key)].slice(
      0,
      MAX_STRICT_SCHEMA_CACHE_ENTRIES_PER_SCHEMA
    )
  );
  return value;
}
function normalizeStrictOpenAIJsonSchema(schema, modelCompat) {
  const schemaInput = schema ?? {};
  if (!schemaInput || typeof schemaInput !== "object") {
    return normalizeStrictOpenAIJsonSchemaRecursive(
      normalizeToolParameterSchema(schemaInput, {
        modelCompat: resolveToolSchemaModelCompat(modelCompat)
      }),
      0
    );
  }
  const cacheKey = resolveStrictOpenAISchemaCacheKey(modelCompat);
  const cached = readCachedStrictOpenAISchema(schemaInput, cacheKey);
  if (cached !== void 0) {
    return cached;
  }
  return rememberStrictOpenAISchema(
    schemaInput,
    cacheKey,
    // Cache by input object and compatibility key so repeated inventory generation preserves object
    // identity without mixing schemas normalized for different provider limitations.
    normalizeStrictOpenAIJsonSchemaRecursive(
      normalizeToolParameterSchema(schemaInput, {
        modelCompat: resolveToolSchemaModelCompat(modelCompat)
      }),
      0
    )
  );
}
function normalizeStrictOpenAIJsonSchemaRecursive(schema, depth) {
  if (Array.isArray(schema)) {
    let changed2 = false;
    const normalized2 = schema.map((entry) => {
      const next = normalizeStrictOpenAIJsonSchemaRecursive(entry, depth);
      changed2 ||= next !== entry;
      return next;
    });
    return changed2 ? normalized2 : schema;
  }
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  const record = schema;
  let changed = false;
  const normalized = {};
  for (const [key, value] of Object.entries(record)) {
    const next = normalizeStrictOpenAIJsonSchemaRecursive(
      value,
      key === "properties" ? depth : depth + 1
    );
    normalized[key] = next;
    changed ||= next !== value;
  }
  if (normalized.type === "object") {
    const properties = normalized.properties && typeof normalized.properties === "object" && !Array.isArray(normalized.properties) ? normalized.properties : void 0;
    if (properties && Object.keys(properties).length === 0 && !Array.isArray(normalized.required)) {
      normalized.required = [];
      changed = true;
    }
    if (depth === 0 && !("additionalProperties" in normalized)) {
      normalized.additionalProperties = false;
      changed = true;
    }
  }
  return changed ? normalized : schema;
}
function normalizeOpenAIStrictToolParameters(schema, strict, modelCompat) {
  const toolSchemaCompat = resolveToolSchemaModelCompat(modelCompat);
  if (!strict) {
    return normalizeToolParameterSchema(schema ?? {}, { modelCompat: toolSchemaCompat });
  }
  return normalizeStrictOpenAIJsonSchema(schema, toolSchemaCompat);
}
function isStrictOpenAIJsonSchemaCompatible(schema) {
  return isStrictOpenAIJsonSchemaCompatibleRecursive(normalizeStrictOpenAIJsonSchema(schema));
}
function findOpenAIStrictToolProjectionDiagnostics(projection) {
  return [
    ...projection.diagnostics.map((diagnostic) => ({
      toolIndex: diagnostic.toolIndex,
      ...diagnostic.toolName ? { toolName: diagnostic.toolName } : {},
      violations: [...diagnostic.violations]
    })),
    ...projection.tools.flatMap((tool) => {
      const violations = findOpenAIStrictSchemaViolations(
        normalizeStrictOpenAIJsonSchema(tool.parameters),
        `${tool.name}.parameters`
      );
      return violations.length > 0 ? [{ toolIndex: tool.toolIndex, toolName: tool.name, violations }] : [];
    })
  ];
}
function isStrictOpenAIJsonSchemaCompatibleRecursive(schema) {
  if (Array.isArray(schema)) {
    return schema.every((entry) => isStrictOpenAIJsonSchemaCompatibleRecursive(entry));
  }
  if (!schema || typeof schema !== "object") {
    return true;
  }
  const record = schema;
  if ("anyOf" in record || "oneOf" in record || "allOf" in record) {
    return false;
  }
  if (Array.isArray(record.type)) {
    return false;
  }
  if (record.type === "object" && record.additionalProperties !== false) {
    return false;
  }
  if (record.type === "object") {
    const properties = record.properties && typeof record.properties === "object" && !Array.isArray(record.properties) ? record.properties : {};
    const required = Array.isArray(record.required) ? record.required.filter((entry) => typeof entry === "string") : void 0;
    if (!required) {
      return false;
    }
    const requiredSet = new Set(required);
    if (Object.keys(properties).some((key) => !requiredSet.has(key))) {
      return false;
    }
  }
  return Object.entries(record).every(([key, entry]) => {
    if (key === "properties" && entry && typeof entry === "object" && !Array.isArray(entry)) {
      return Object.values(entry).every(
        (value) => isStrictOpenAIJsonSchemaCompatibleRecursive(value)
      );
    }
    return isStrictOpenAIJsonSchemaCompatibleRecursive(entry);
  });
}
function resolveOpenAIProjectedToolsStrictToolFlag(projection, strict) {
  if (strict !== true) {
    return strict === false ? false : void 0;
  }
  return projection.tools.every((tool) => isStrictOpenAIJsonSchemaCompatible(tool.parameters));
}

// packages/ai/src/providers/openai-responses-tools.ts
var LOG_SUBSYSTEM = "llm/openai-responses";
var MAX_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS = 64;
var loggedStrictToolDowngradeDiagnosticKeys = /* @__PURE__ */ new Set();
function convertResponsesToolPayload(tools, options) {
  const projection = projectOpenAITools(tools);
  const strictSetting = resolveResponsesStrictToolSetting(options);
  const strict = resolveResponsesStrictToolFlag(projection, strictSetting, options?.model);
  const convertedTools = sortResponsesToolsByName(projection.tools).map((tool) => {
    const result = {
      type: "function",
      name: tool.name,
      description: tool.description,
      parameters: normalizeOpenAIStrictToolParameters(
        tool.parameters,
        strict === true,
        options?.model?.compat
      )
    };
    if (strict !== void 0) {
      result.strict = strict;
    }
    return result;
  });
  return { projection, tools: convertedTools };
}
function resolveResponsesStrictToolSetting(options) {
  if (options?.strict !== void 0) {
    return options.strict;
  }
  if (options?.model) {
    return getAiTransportHost().resolveOpenAIStrictToolSetting(options.model, {
      transport: "stream",
      supportsStrictMode: options.supportsStrictMode
    });
  }
  return false;
}
function resolveResponsesStrictToolFlag(projection, strictSetting, model) {
  const strict = resolveOpenAIProjectedToolsStrictToolFlag(projection, strictSetting);
  if (strictSetting === true && strict === false && model) {
    getAiTransportHost().logDebug(LOG_SUBSYSTEM, () => {
      const diagnostics = findOpenAIStrictToolProjectionDiagnostics(projection);
      if (!shouldLogStrictToolDowngradeDiagnostic(diagnostics, model)) {
        return null;
      }
      const sample = diagnostics.slice(0, 5).map((entry) => ({
        tool: entry.toolName ?? `tool[${entry.toolIndex}]`,
        violations: entry.violations.slice(0, 8)
      }));
      return {
        message: `OpenAI responses tool schema strict mode downgraded to strict=false for ${model.provider ?? "unknown"}/${model.id ?? "unknown"} because ${diagnostics.length} tool schema(s) are not strict-compatible`,
        data: {
          provider: model.provider,
          model: model.id,
          incompatibleToolCount: diagnostics.length,
          sample
        }
      };
    });
  }
  return strict;
}
function shouldLogStrictToolDowngradeDiagnostic(diagnostics, model) {
  const key = createHash("sha256").update(
    JSON.stringify({
      provider: model.provider,
      model: model.id,
      diagnostics: diagnostics.map((entry) => ({
        toolIndex: entry.toolIndex,
        toolName: entry.toolName ?? null,
        violations: entry.violations
      }))
    })
  ).digest("hex");
  if (loggedStrictToolDowngradeDiagnosticKeys.has(key)) {
    return false;
  }
  if (loggedStrictToolDowngradeDiagnosticKeys.size >= MAX_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS) {
    loggedStrictToolDowngradeDiagnosticKeys.clear();
  }
  loggedStrictToolDowngradeDiagnosticKeys.add(key);
  return true;
}
function compareToolText(left, right) {
  const leftText = left ?? "";
  const rightText = right ?? "";
  if (leftText < rightText) {
    return -1;
  }
  if (leftText > rightText) {
    return 1;
  }
  return 0;
}
function sortResponsesToolsByName(tools) {
  return tools.toSorted(
    (left, right) => compareToolText(left.name, right.name) || compareToolText(left.description, right.description)
  );
}

// packages/normalization-core/src/utf16-slice.ts
function isHighSurrogate(codeUnit) {
  return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
  return codeUnit >= 56320 && codeUnit <= 57343;
}
function sliceUtf16Safe(input, start, end) {
  const len = input.length;
  let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
  let to = end === void 0 ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
  if (to <= from) {
    return "";
  }
  if (from > 0 && from < len) {
    const codeUnit = input.charCodeAt(from);
    if (isLowSurrogate(codeUnit) && isHighSurrogate(input.charCodeAt(from - 1))) {
      from += 1;
    }
  }
  if (to > 0 && to < len) {
    const codeUnit = input.charCodeAt(to - 1);
    if (isHighSurrogate(codeUnit) && isLowSurrogate(input.charCodeAt(to))) {
      to -= 1;
    }
  }
  return input.slice(from, to);
}
function truncateUtf16Safe(input, maxLen) {
  const limit = Math.max(0, Math.floor(maxLen));
  if (input.length <= limit) {
    return input;
  }
  return sliceUtf16Safe(input, 0, limit);
}

// packages/ai/src/providers/tool-result-text.ts
var PROVIDER_TOOL_RESULT_MAX_CHARS = 8e3;
var IMAGE_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set(["image", "image_url", "input_image"]);
var AUDIO_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set(["audio", "input_audio", "output_audio"]);
var MEDIA_ONLY_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set([
  ...IMAGE_TOOL_RESULT_TYPES,
  ...AUDIO_TOOL_RESULT_TYPES
]);
var INLINE_DATA_URI_PATTERN = /(^|[^A-Za-z0-9_])data:([a-z][a-z0-9.+-]*\/[a-z0-9.+-]+(?:;[a-z0-9.+-]+=[^,;"'\s]+|;base64)*,[^\s"'<>)]+)/gi;
var MIME_KEY_CANDIDATES = [
  "mimeType",
  "mime_type",
  "mediaType",
  "media_type",
  "contentType",
  "content_type"
];
var TEXTUAL_MIME_PATTERN = /^(?:text\/|application\/(?:json|ld\+json|x-ndjson|xml|javascript|x-www-form-urlencoded)|[^/]+\/[^+]+\+(?:json|xml)$)/i;
var OPAQUE_OR_BINARY_FIELD_RE = /^(?:blob|buffer|bytes|encrypted_content|encrypted_stdout)$/i;
function readMimeType(value) {
  if (!isRecord(value)) {
    return void 0;
  }
  for (const key of MIME_KEY_CANDIDATES) {
    const mimeType = value[key];
    if (typeof mimeType === "string" && mimeType.trim().length > 0) {
      return mimeType;
    }
  }
  return void 0;
}
function isBinaryMimeType(mimeType) {
  const normalized = mimeType.split(";", 1)[0]?.trim().toLowerCase();
  return normalized ? !TEXTUAL_MIME_PATTERN.test(normalized) : false;
}
function describeOmittedValue(value, label) {
  const length = typeof value === "string" ? value.length : JSON.stringify(value)?.length;
  return length ? `[${label} omitted: ${length} chars]` : `[${label} omitted]`;
}
function redactInlineDataUris(value) {
  return value.replace(
    INLINE_DATA_URI_PATTERN,
    (_match, prefix, uri) => `${prefix}[inline data URI: ${uri.length} chars]`
  );
}
function redactStructuredTextValue(value) {
  const host = getAiTransportHost();
  const redacted = host.redactToolPayloadText(value);
  const trimmed = redacted.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return redacted;
  }
  try {
    const redactedWrapper = host.redactSecrets({ structuredTextValue: JSON.parse(redacted) });
    return JSON.stringify(redactedWrapper.structuredTextValue);
  } catch {
    return redacted;
  }
}
function stringifyStructuredBlock(block) {
  const seen = /* @__PURE__ */ new WeakSet();
  try {
    const redactedWrapper = getAiTransportHost().redactSecrets({ structuredToolResult: block });
    const redactedBlock = redactedWrapper.structuredToolResult;
    const serialized = JSON.stringify(
      redactedBlock,
      function structuredToolResultReplacer(key, value) {
        if (OPAQUE_OR_BINARY_FIELD_RE.test(key)) {
          return `[omitted ${key}]`;
        }
        if (key === "data") {
          const mimeType = readMimeType(this);
          if (mimeType && isBinaryMimeType(mimeType)) {
            return describeOmittedValue(value, "binary data");
          }
        }
        if (typeof value === "bigint") {
          return value.toString();
        }
        if (typeof value === "string") {
          return redactInlineDataUris(redactStructuredTextValue(value));
        }
        if (typeof value === "function" || typeof value === "symbol" || value === void 0) {
          return void 0;
        }
        if (!value || typeof value !== "object") {
          return value;
        }
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
        return value;
      }
    );
    if (!serialized || serialized === "{}") {
      return void 0;
    }
    return serialized;
  } catch {
    return void 0;
  }
}
function truncateProviderToolText(text) {
  if (text.length <= PROVIDER_TOOL_RESULT_MAX_CHARS) {
    return text;
  }
  return `${truncateUtf16Safe(text, PROVIDER_TOOL_RESULT_MAX_CHARS)}
\u2026(truncated)\u2026`;
}
function hasMediaPayload(block) {
  return isRecord(block) && typeof block.data === "string" && block.data.trim().length > 0;
}
function isImageWithMediaPayload(block) {
  return isRecord(block) && block.type === "image" && hasMediaPayload(block);
}
function describeToolResultMediaPlaceholder(blocks) {
  let hasImage = false;
  let hasAudio = false;
  for (const block of blocks) {
    if (!hasMediaPayload(block)) {
      continue;
    }
    const record = block;
    const type = typeof record.type === "string" ? record.type : void 0;
    const mimeType = readMimeType(record);
    if (type && IMAGE_TOOL_RESULT_TYPES.has(type) || mimeType?.toLowerCase().startsWith("image/")) {
      hasImage = true;
    }
    if (type && AUDIO_TOOL_RESULT_TYPES.has(type) || mimeType?.toLowerCase().startsWith("audio/")) {
      hasAudio = true;
    }
  }
  if (hasImage && hasAudio) {
    return "(see attached media)";
  }
  if (hasAudio) {
    return "(see attached audio)";
  }
  if (hasImage) {
    return "(see attached image)";
  }
  return void 0;
}
function extractToolResultBlockText(block) {
  if (!block || typeof block !== "object") {
    return void 0;
  }
  const record = block;
  if (typeof record.type === "string" && MEDIA_ONLY_TOOL_RESULT_TYPES.has(record.type)) {
    return void 0;
  }
  if (record.type === "text") {
    const text = typeof record.text === "string" ? record.text : "";
    return text ? sanitizeSurrogates(text) : void 0;
  }
  const structured = stringifyStructuredBlock(record);
  return structured ? sanitizeSurrogates(truncateProviderToolText(structured)) : void 0;
}
function extractToolResultText(blocks) {
  const explicitTexts = [];
  const structuredTexts = [];
  for (const block of blocks) {
    const text = extractToolResultBlockText(block);
    if (!text) {
      continue;
    }
    const record = block;
    if (record.type === "text") {
      explicitTexts.push(text);
    } else {
      structuredTexts.push(text);
    }
  }
  if (explicitTexts.length > 0) {
    return sanitizeSurrogates(explicitTexts.join("\n"));
  }
  return sanitizeSurrogates(truncateProviderToolText(structuredTexts.join("\n")));
}

// packages/ai/src/providers/anthropic-model-contract.ts
function normalizeModelId2(modelId) {
  const normalized = normalizeLowercaseStringOrEmpty(modelId);
  const unprefixed = normalized.startsWith("anthropic/") ? normalized.slice("anthropic/".length) : normalized;
  return unprefixed.replace(/[._\s]+/g, "-");
}
function normalizeApi(api) {
  const normalized = normalizeLowercaseStringOrEmpty(api);
  return normalized === "openclaw-anthropic-messages-transport" ? "anthropic-messages" : normalized;
}
function hasConcreteResponseModel(ref) {
  const responseModelId = normalizeModelId2(ref.responseModelId);
  return responseModelId.length > 0 && responseModelId !== normalizeModelId2(ref.modelId);
}
function resolveReplayModelBoundIdentity(ref) {
  if (normalizeApi(ref.api) !== "anthropic-messages") {
    return void 0;
  }
  const modelRef = hasConcreteResponseModel(ref) ? { id: ref.responseModelId } : { id: ref.modelId, params: ref.modelParams };
  const fableIdentity = resolveClaudeFable5ModelIdentity(modelRef);
  if (fableIdentity) {
    return `fable:${fableIdentity}`;
  }
  const mythosIdentity = resolveClaudeMythos5ModelIdentity(modelRef);
  if (mythosIdentity) {
    return `mythos:${mythosIdentity}`;
  }
  const sonnetIdentity = resolveClaudeSonnet5ModelIdentity(modelRef);
  return sonnetIdentity ? `sonnet:${sonnetIdentity}` : void 0;
}
function resolveModelBoundThinkingReplayMode(params) {
  const sourceApi = normalizeApi(params.source.api);
  const targetApi = normalizeApi(params.target.api);
  const sourceIdentity = resolveReplayModelBoundIdentity(params.source);
  const targetIdentity = resolveReplayModelBoundIdentity(params.target);
  const sameRoute = normalizeLowercaseStringOrEmpty(params.source.provider) === normalizeLowercaseStringOrEmpty(params.target.provider) && sourceApi === targetApi && normalizeModelId2(params.source.modelId) === normalizeModelId2(params.target.modelId);
  if (!sourceIdentity && !targetIdentity) {
    return "default";
  }
  if (!sourceIdentity && !hasConcreteResponseModel(params.source) && targetIdentity && sameRoute) {
    return "preserve";
  }
  const sameModel = sourceApi === targetApi && sourceIdentity === targetIdentity;
  return sameModel ? "preserve" : "drop";
}

// packages/ai/src/providers/transform-messages.ts
var NON_VISION_USER_IMAGE_PLACEHOLDER = "(image omitted: model does not support images)";
var NON_VISION_TOOL_IMAGE_PLACEHOLDER = "(tool image omitted: model does not support images)";
function replaceImagesWithPlaceholder(content, placeholder) {
  const result = [];
  let previousWasPlaceholder = false;
  for (const block of content) {
    if (block.type === "image") {
      if (!isImageWithMediaPayload(block)) {
        continue;
      }
      if (!previousWasPlaceholder) {
        result.push({ type: "text", text: placeholder });
      }
      previousWasPlaceholder = true;
      continue;
    }
    result.push(block);
    previousWasPlaceholder = block.text === placeholder;
  }
  return result;
}
function downgradeUnsupportedImages(messages, model) {
  if (model.input.includes("image")) {
    return messages;
  }
  return messages.map((msg) => {
    if (msg.role === "user" && Array.isArray(msg.content)) {
      return {
        ...msg,
        content: replaceImagesWithPlaceholder(msg.content, NON_VISION_USER_IMAGE_PLACEHOLDER)
      };
    }
    if (msg.role === "toolResult") {
      return {
        ...msg,
        content: replaceImagesWithPlaceholder(msg.content, NON_VISION_TOOL_IMAGE_PLACEHOLDER)
      };
    }
    return msg;
  });
}
function transformMessages(messages, model, normalizeToolCallId) {
  const toolCallIdMap = /* @__PURE__ */ new Map();
  const normalizedMessages = messages.map(
    (msg) => msg.content == null ? { ...msg, content: [] } : msg
  );
  const imageAwareMessages = downgradeUnsupportedImages(normalizedMessages, model);
  const transformed = imageAwareMessages.map((msg) => {
    if (msg.role === "user") {
      return msg;
    }
    if (msg.role === "toolResult") {
      const normalizedId = toolCallIdMap.get(msg.toolCallId);
      if (normalizedId && normalizedId !== msg.toolCallId) {
        return Object.assign({}, msg, { toolCallId: normalizedId });
      }
      return msg;
    }
    if (msg.role === "assistant") {
      const assistantMsg = msg;
      const modelBoundThinkingReplayMode = resolveModelBoundThinkingReplayMode({
        source: {
          provider: assistantMsg.provider,
          api: assistantMsg.api,
          modelId: assistantMsg.model,
          responseModelId: assistantMsg.responseModel
        },
        target: {
          provider: model.provider,
          api: model.api,
          modelId: model.id,
          modelParams: model.params
        }
      });
      const isSameModel = modelBoundThinkingReplayMode === "preserve" || assistantMsg.provider === model.provider && assistantMsg.api === model.api && assistantMsg.model === model.id;
      const contentBlocks = typeof assistantMsg.content === "string" ? [{ type: "text", text: assistantMsg.content }] : assistantMsg.content;
      const transformedContent = contentBlocks.flatMap((block) => {
        if (block.type === "thinking") {
          if (modelBoundThinkingReplayMode === "drop") {
            return [];
          }
          if (block.redacted) {
            return isSameModel ? block : [];
          }
          if (isSameModel && block.thinkingSignature) {
            return block;
          }
          if (!block.thinking || block.thinking.trim() === "") {
            return [];
          }
          if (isSameModel) {
            return block;
          }
          return {
            type: "text",
            text: block.thinking
          };
        }
        if (block.type === "text") {
          if (isSameModel) {
            return block;
          }
          return {
            type: "text",
            text: block.text
          };
        }
        if (block.type === "toolCall") {
          const toolCall = block;
          let normalizedToolCall = toolCall;
          if (!isSameModel && toolCall.thoughtSignature) {
            normalizedToolCall = Object.assign({}, toolCall);
            delete normalizedToolCall.thoughtSignature;
          }
          if (!isSameModel && normalizeToolCallId) {
            const normalizedId = normalizeToolCallId(toolCall.id, model, assistantMsg);
            if (normalizedId !== toolCall.id) {
              toolCallIdMap.set(toolCall.id, normalizedId);
              normalizedToolCall = Object.assign({}, normalizedToolCall, { id: normalizedId });
            }
          }
          return normalizedToolCall;
        }
        return block;
      });
      return Object.assign({}, assistantMsg, { content: transformedContent });
    }
    return msg;
  });
  const result = [];
  let pendingToolCalls = [];
  let existingToolResultIds = /* @__PURE__ */ new Set();
  const insertSyntheticToolResults = () => {
    if (pendingToolCalls.length > 0) {
      for (const tc of pendingToolCalls) {
        if (!existingToolResultIds.has(tc.id)) {
          result.push({
            role: "toolResult",
            toolCallId: tc.id,
            toolName: tc.name,
            content: [{ type: "text", text: "No result provided" }],
            isError: true,
            timestamp: Date.now()
          });
        }
      }
      pendingToolCalls = [];
      existingToolResultIds = /* @__PURE__ */ new Set();
    }
  };
  for (const msg of transformed) {
    if (msg.role === "assistant") {
      insertSyntheticToolResults();
      const assistantMsg = msg;
      if (assistantMsg.stopReason === "error" || assistantMsg.stopReason === "aborted") {
        continue;
      }
      const toolCalls = assistantMsg.content.filter((b) => b.type === "toolCall");
      if (toolCalls.length > 0) {
        pendingToolCalls = toolCalls;
        existingToolResultIds = /* @__PURE__ */ new Set();
      }
      result.push(msg);
    } else if (msg.role === "toolResult") {
      existingToolResultIds.add(msg.toolCallId);
      result.push(msg);
    } else if (msg.role === "user") {
      insertSyntheticToolResults();
      result.push(msg);
    } else {
      result.push(msg);
    }
  }
  insertSyntheticToolResults();
  return result;
}

// packages/ai/src/providers/openai-responses-shared.ts
var EMPTY_TOOL_RESULT_TEXT = "(no output)";
function splitResponsesToolCallId(id) {
  const separatorIndex = id.indexOf("|");
  return separatorIndex === -1 ? [id, void 0] : [id.slice(0, separatorIndex), id.slice(separatorIndex + 1)];
}
function resolveResponsesToolCallId(item, fallbackId) {
  const callId = typeof item.call_id === "string" ? item.call_id.trim() : "";
  const itemId = typeof item.id === "string" ? item.id.trim() : "";
  const [fallbackCallId, fallbackItemId = ""] = splitResponsesToolCallId(fallbackId ?? "");
  const resolvedCallId = callId || fallbackCallId;
  const resolvedItemId = itemId || fallbackItemId;
  if (resolvedCallId) {
    return resolvedItemId ? `${resolvedCallId}|${resolvedItemId}` : resolvedCallId;
  }
  const generatedCallId = `call_${randomUUID().replaceAll("-", "").slice(0, 24)}`;
  return resolvedItemId ? `${generatedCallId}|${resolvedItemId}` : generatedCallId;
}
function sanitizeToolResultText(text, fallback) {
  const sanitized = sanitizeSurrogates(text);
  return sanitized.trim().length > 0 ? sanitized : fallback;
}
function normalizeResponsesReasoningReplayItem(params) {
  const next = { ...params.item };
  if (!Array.isArray(next.summary)) {
    next.summary = [];
  }
  if (!params.replayResponsesItemIds) {
    delete next.id;
  }
  return next;
}
function encodeTextSignatureV1(id, phase) {
  const payload = { v: 1, id };
  if (phase) {
    payload.phase = phase;
  }
  return JSON.stringify(payload);
}
function parseTextSignature(signature) {
  if (!signature) {
    return void 0;
  }
  if (signature.startsWith("{")) {
    try {
      const parsed = JSON.parse(signature);
      if (parsed.v === 1) {
        const id = typeof parsed.id === "string" ? parsed.id : void 0;
        const phase = parsed.phase === "commentary" || parsed.phase === "final_answer" ? parsed.phase : void 0;
        if (id !== void 0 || phase !== void 0) {
          return { id, phase };
        }
        return void 0;
      }
    } catch {
    }
  }
  return { id: signature };
}
function resolveReplayableResponsesMessageId(params) {
  if (!params.textSignatureId) {
    return params.fallbackOrdinal === 0 ? params.fallbackId : `${params.fallbackId}_${params.fallbackOrdinal}`;
  }
  return params.previousReplayItemWasReasoning ? params.textSignatureId : void 0;
}
function isResponsesReasoningEffort(effort) {
  return effort === "minimal" || effort === "low" || effort === "medium" || effort === "high" || effort === "xhigh" || effort === "max";
}
function convertResponsesMessages(model, context, allowedToolCallProviders, options) {
  const messages = [];
  const shouldReplayResponsesItemIds = options?.replayResponsesItemIds ?? true;
  const normalizeIdPart = (part) => {
    const sanitized = part.replace(/[^a-zA-Z0-9_-]/g, "_");
    const normalized = sanitized.length > 64 ? sanitized.slice(0, 64) : sanitized;
    return normalized.replace(/_+$/, "");
  };
  const buildForeignResponsesItemId = (itemId) => {
    const normalized = `fc_${shortHash(itemId)}`;
    return normalized.length > 64 ? normalized.slice(0, 64) : normalized;
  };
  const normalizeToolCallId = (id, targetModel, source) => {
    void targetModel;
    if (!allowedToolCallProviders.has(model.provider)) {
      return normalizeIdPart(id);
    }
    if (!id.includes("|")) {
      return normalizeIdPart(id);
    }
    const [callId, itemId = ""] = splitResponsesToolCallId(id);
    const normalizedCallId = normalizeIdPart(callId);
    const isForeignToolCall = source.provider !== model.provider || source.api !== model.api;
    let normalizedItemId = isForeignToolCall ? buildForeignResponsesItemId(itemId) : normalizeIdPart(itemId);
    if (!normalizedItemId.startsWith("fc_")) {
      normalizedItemId = normalizeIdPart(`fc_${normalizedItemId}`);
    }
    return `${normalizedCallId}|${normalizedItemId}`;
  };
  const transformedMessages = transformMessages(context.messages, model, normalizeToolCallId);
  const includeSystemPrompt = options?.includeSystemPrompt ?? true;
  if (includeSystemPrompt && context.systemPrompt) {
    const compat = model.compat;
    const role = model.reasoning && compat?.supportsDeveloperRole !== false ? "developer" : "system";
    messages.push({
      type: "message",
      role,
      content: [
        {
          type: "input_text",
          text: sanitizeSurrogates(stripSystemPromptCacheBoundary(context.systemPrompt))
        }
      ]
    });
  }
  let msgIndex = 0;
  for (const msg of transformedMessages) {
    if (msg.role === "user") {
      if (typeof msg.content === "string") {
        messages.push({
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: sanitizeSurrogates(msg.content) }]
        });
      } else {
        const content = msg.content.map((item) => {
          if (item.type === "text") {
            return {
              type: "input_text",
              text: sanitizeSurrogates(item.text)
            };
          }
          return {
            type: "input_image",
            detail: "auto",
            image_url: `data:${item.mimeType};base64,${item.data}`
          };
        });
        if (content.length === 0) {
          continue;
        }
        messages.push({
          type: "message",
          role: "user",
          content
        });
      }
    } else if (msg.role === "assistant") {
      const output = [];
      let textFallbackOrdinal = 0;
      const assistantMsg = msg;
      let previousReplayItemWasReasoning = false;
      const isDifferentModel = assistantMsg.model !== model.id && assistantMsg.provider === model.provider && assistantMsg.api === model.api;
      for (const block of msg.content) {
        if (block.type === "thinking") {
          if (block.thinkingSignature) {
            const reasoningItem = normalizeResponsesReasoningReplayItem({
              item: JSON.parse(block.thinkingSignature),
              replayResponsesItemIds: shouldReplayResponsesItemIds
            });
            output.push(reasoningItem);
            previousReplayItemWasReasoning = true;
          }
        } else if (block.type === "text") {
          const textBlock = block;
          const parsedSignature = parseTextSignature(textBlock.textSignature);
          let msgId = shouldReplayResponsesItemIds ? resolveReplayableResponsesMessageId({
            textSignatureId: parsedSignature?.id,
            fallbackId: `msg_${msgIndex}`,
            fallbackOrdinal: textFallbackOrdinal,
            previousReplayItemWasReasoning
          }) : void 0;
          if (!parsedSignature?.id) {
            textFallbackOrdinal += 1;
          }
          if (msgId && msgId.length > 64) {
            msgId = `msg_${shortHash(msgId)}`;
          }
          const messageItem = {
            type: "message",
            role: "assistant",
            content: [
              { type: "output_text", text: sanitizeSurrogates(textBlock.text), annotations: [] }
            ],
            status: "completed",
            ...msgId ? { id: msgId } : {},
            phase: parsedSignature?.phase
          };
          output.push(messageItem);
          previousReplayItemWasReasoning = false;
        } else if (block.type === "toolCall") {
          const toolCall = block;
          const [callId, itemIdRaw] = splitResponsesToolCallId(toolCall.id);
          let itemId = shouldReplayResponsesItemIds ? itemIdRaw : void 0;
          if (shouldReplayResponsesItemIds && isDifferentModel && itemId?.startsWith("fc_")) {
            itemId = void 0;
          }
          output.push({
            type: "function_call",
            ...itemId ? { id: itemId } : {},
            call_id: callId,
            name: toolCall.name,
            arguments: JSON.stringify(toolCall.arguments)
          });
          previousReplayItemWasReasoning = false;
        }
      }
      if (output.length === 0) {
        continue;
      }
      messages.push(...output);
    } else if (msg.role === "toolResult") {
      const textResult = extractToolResultText(msg.content);
      const sanitizedTextResult = sanitizeSurrogates(textResult);
      const hasImages = msg.content.some(isImageWithMediaPayload);
      const mediaPlaceholder = describeToolResultMediaPlaceholder(msg.content);
      const hasText = sanitizedTextResult.trim().length > 0;
      const [callId] = splitResponsesToolCallId(msg.toolCallId);
      let output;
      if (hasImages && model.input.includes("image")) {
        const contentParts = [];
        if (hasText) {
          contentParts.push({
            type: "input_text",
            text: sanitizedTextResult
          });
        } else if (mediaPlaceholder === "(see attached media)") {
          contentParts.push({
            type: "input_text",
            text: mediaPlaceholder
          });
        }
        for (const block of msg.content) {
          if (isImageWithMediaPayload(block)) {
            contentParts.push({
              type: "input_image",
              detail: "auto",
              image_url: `data:${block.mimeType};base64,${block.data}`
            });
          }
        }
        output = contentParts;
      } else {
        output = sanitizeToolResultText(textResult, mediaPlaceholder ?? EMPTY_TOOL_RESULT_TEXT);
      }
      messages.push({
        type: "function_call_output",
        call_id: callId,
        output
      });
    }
    msgIndex++;
  }
  return messages;
}
function resolveResponsesReasoningEffort(model, reasoning) {
  const clampedReasoning = reasoning ? clampThinkingLevel(model, reasoning) : void 0;
  if (!clampedReasoning || clampedReasoning === "off") {
    return void 0;
  }
  if (clampedReasoning === "max") {
    return supportsOpenAIReasoningEffort(model, "max") ? "max" : "xhigh";
  }
  if (clampedReasoning === "minimal" && model.provider === "openai" && supportsOpenAIReasoningEffort(model, "max")) {
    const effort = resolveOpenAIReasoningEffortForModel({ model, effort: "minimal" });
    return isResponsesReasoningEffort(effort) ? effort : void 0;
  }
  return clampedReasoning;
}
async function processResponsesStream(openaiStream, output, stream, model, options) {
  const streamingToolCalls = createResponsesToolCallTracker();
  const outputSlots = /* @__PURE__ */ new Map();
  const reasoningBlocksById = /* @__PURE__ */ new Map();
  let unindexedOutputSlot;
  let terminalResponseEvent;
  let lastTextBlock = null;
  const blocks = output.content;
  const blockIndex = () => blocks.length - 1;
  const readOutputIndex2 = (event) => {
    const outputIndex = event.output_index;
    return typeof outputIndex === "number" && Number.isInteger(outputIndex) && outputIndex >= 0 ? outputIndex : void 0;
  };
  const registerOutputSlot = (event, slot) => {
    const outputIndex = readOutputIndex2(event);
    if (outputIndex === void 0) {
      if (unindexedOutputSlot) {
        throw new Error("Responses stream added overlapping unindexed output items");
      }
      unindexedOutputSlot = slot;
      return;
    }
    if (outputSlots.has(outputIndex)) {
      throw new Error(`Responses stream reused active output index ${outputIndex}`);
    }
    outputSlots.set(outputIndex, slot);
  };
  const resolveOutputSlot = (event, type) => {
    const outputIndex = readOutputIndex2(event);
    let slot = outputIndex === void 0 ? unindexedOutputSlot : outputSlots.get(outputIndex);
    if (outputIndex === void 0 && !slot) {
      const matchingSlots = [...outputSlots.values()].filter(
        (candidate) => candidate.type === type
      );
      slot = matchingSlots.length === 1 ? matchingSlots[0] : void 0;
    }
    return slot?.type === type ? slot : void 0;
  };
  const forgetOutputSlot = (event, slot) => {
    const outputIndex = readOutputIndex2(event);
    if (outputIndex === void 0) {
      if (unindexedOutputSlot === slot) {
        unindexedOutputSlot = void 0;
      } else {
        for (const [indexedOutput, indexedSlot] of outputSlots) {
          if (indexedSlot === slot) {
            outputSlots.delete(indexedOutput);
          }
        }
      }
      return;
    }
    if (outputSlots.get(outputIndex) === slot) {
      outputSlots.delete(outputIndex);
    }
  };
  const forgetToolCallOutputSlot = (toolCall) => {
    for (const [outputIndex, slot] of outputSlots) {
      if (slot.type === "toolCall" && slot.toolCall === toolCall) {
        outputSlots.delete(outputIndex);
      }
    }
  };
  const readIdentityValue2 = (value) => {
    const identity = typeof value === "string" ? value.trim() : "";
    return identity || void 0;
  };
  const resolveCompletedToolCallName = (toolCall, value) => {
    const streamedName = readIdentityValue2(toolCall?.block.name);
    const completedName = readIdentityValue2(value);
    if (streamedName && completedName && streamedName !== completedName) {
      throw new Error(
        `Responses stream changed tool-call function name from ${streamedName} to ${completedName}`
      );
    }
    const name = completedName ?? streamedName;
    if (!name) {
      throw new Error("Responses stream completed tool call without a function name");
    }
    return name;
  };
  const createOutputSlot = (event, item) => {
    if (item.type === "reasoning") {
      const block = { type: "thinking", thinking: "" };
      const slot = {
        type: "thinking",
        item,
        block,
        contentIndex: blocks.length
      };
      blocks.push(block);
      registerOutputSlot(event, slot);
      stream.push({ type: "thinking_start", contentIndex: slot.contentIndex, partial: output });
      return slot;
    }
    if (item.type === "message") {
      const messageItem = item;
      const collapseCandidate = lastTextBlock;
      const block = collapseCandidate ? null : {
        type: "text",
        text: "",
        ...messageItem.phase ? { textSignature: encodeTextSignatureV1(messageItem.id, messageItem.phase) } : {}
      };
      const slot = {
        type: "text",
        item: messageItem,
        block,
        contentIndex: block ? blocks.length : void 0,
        pendingText: collapseCandidate ? "" : null,
        collapseCandidate
      };
      if (block) {
        blocks.push(block);
      }
      registerOutputSlot(event, slot);
      if (slot.contentIndex !== void 0) {
        stream.push({ type: "text_start", contentIndex: slot.contentIndex, partial: output });
      }
      return slot;
    }
    return void 0;
  };
  const resolveOutputItemSlot = (event, item) => {
    if (item.type === "reasoning") {
      return resolveOutputSlot(event, "thinking");
    }
    if (item.type === "message") {
      return resolveOutputSlot(event, "text");
    }
    const outputIndex = readOutputIndex2(event);
    return outputIndex === void 0 ? void 0 : outputSlots.get(outputIndex);
  };
  const getOrCreateOutputSlot = (event, item) => {
    return resolveOutputItemSlot(event, item) ?? createOutputSlot(event, item);
  };
  const materializeDeferredTextSlot = (slot) => {
    if (slot.block || slot.pendingText === null) {
      return;
    }
    const text = slot.pendingText;
    slot.block = {
      type: "text",
      text,
      ...slot.item.phase ? { textSignature: encodeTextSignatureV1(slot.item.id, slot.item.phase) } : {}
    };
    blocks.push(slot.block);
    slot.contentIndex = blockIndex();
    stream.push({ type: "text_start", contentIndex: slot.contentIndex, partial: output });
    if (text) {
      stream.push({
        type: "text_delta",
        contentIndex: slot.contentIndex,
        delta: text,
        partial: output
      });
    }
    if (lastTextBlock === slot.collapseCandidate) {
      lastTextBlock = null;
    }
    slot.pendingText = null;
    slot.collapseCandidate = null;
  };
  const materializeDeferredTextSlots = (except) => {
    for (const slot of outputSlots.values()) {
      if (slot !== except && slot.type === "text") {
        materializeDeferredTextSlot(slot);
      }
    }
    if (unindexedOutputSlot !== except && unindexedOutputSlot?.type === "text") {
      materializeDeferredTextSlot(unindexedOutputSlot);
    }
  };
  const appendPendingMessageDelta = (slot, delta) => {
    slot.pendingText = `${slot.pendingText ?? ""}${delta}`;
    const priorText = slot.collapseCandidate?.block.text ?? "";
    if (priorText.startsWith(slot.pendingText) || slot.pendingText.startsWith(priorText)) {
      return;
    }
    materializeDeferredTextSlot(slot);
  };
  const backfillReasoningSignatures = (responseOutput) => {
    for (const item of responseOutput) {
      if (item.type !== "reasoning" || !item.encrypted_content) {
        continue;
      }
      const block = reasoningBlocksById.get(item.id);
      if (!block?.thinkingSignature) {
        continue;
      }
      const storedItem = JSON.parse(block.thinkingSignature);
      if (storedItem.encrypted_content) {
        continue;
      }
      block.thinkingSignature = JSON.stringify({
        ...storedItem,
        encrypted_content: item.encrypted_content
      });
    }
  };
  const finalizeResponse = (response) => {
    terminalResponseEvent = "finalized";
    backfillReasoningSignatures(response.output ?? []);
    if (response.id) {
      output.responseId = response.id;
    }
    const mappedUsage = mapResponsesTerminalUsage(response.usage);
    if (mappedUsage) {
      output.usage = {
        ...mappedUsage,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
      };
    }
    calculateCost(model, output.usage);
    if (options?.applyServiceTierPricing) {
      const serviceTier = options.resolveServiceTier ? options.resolveServiceTier(response.service_tier, options.serviceTier) : response.service_tier ?? options.serviceTier;
      options.applyServiceTierPricing(output.usage, serviceTier);
    }
    const terminal = resolveResponsesTerminalStopReason({
      status: response.status,
      incompleteReason: response.incomplete_details?.reason,
      hasToolCall: output.content.some((block) => block.type === "toolCall")
    });
    output.stopReason = terminal.stopReason;
    if (terminal.errorMessage) {
      output.errorMessage = terminal.errorMessage;
    }
  };
  const guardedStream = withFirstStreamEventTimeout(openaiStream, {
    provider: model.provider,
    api: model.api,
    model: model.id,
    timeoutMs: options?.firstEventTimeoutMs ?? 0,
    stage: "responses",
    abort: options?.abortFirstEventStream,
    onTimeout: options?.onFirstEventTimeout,
    hint: "The provider may be stalled while parsing the tool payload; retry with a smaller tool surface or enable OPENCLAW_DEBUG_MODEL_PAYLOAD=tools to inspect exposed tools."
  });
  for await (const event of guardedStream) {
    if (event.type === "response.created") {
      output.responseId = event.response.id;
    } else if (event.type === "response.output_item.added") {
      materializeDeferredTextSlots();
      const item = event.item;
      if (item.type !== "message") {
        lastTextBlock = null;
      }
      if (item.type === "reasoning" || item.type === "message") {
        createOutputSlot(event, item);
      } else if (item.type === "function_call") {
        const toolCallBlock = {
          type: "toolCall",
          id: resolveResponsesToolCallId(item),
          name: readIdentityValue2(item.name) ?? "",
          arguments: {},
          partialJson: item.arguments || ""
        };
        const contentIndex = output.content.length;
        const toolCallState = {
          block: toolCallBlock,
          contentIndex,
          argumentStreamReliable: true,
          ...readResponsesToolCallItemIdentity(item)
        };
        streamingToolCalls.register(event, toolCallState);
        if (readOutputIndex2(event) !== void 0) {
          registerOutputSlot(event, { type: "toolCall", toolCall: toolCallState });
        }
        output.content.push(toolCallBlock);
        stream.push({ type: "toolcall_start", contentIndex, partial: output });
      }
    } else if (event.type === "response.reasoning_summary_part.added") {
      const slot = resolveOutputSlot(event, "thinking");
      if (!slot) {
        continue;
      }
      slot.item.summary = slot.item.summary || [];
      slot.item.summary.push(event.part);
    } else if (event.type === "response.reasoning_summary_text.delta") {
      const slot = resolveOutputSlot(event, "thinking");
      if (!slot) {
        continue;
      }
      slot.item.summary = slot.item.summary || [];
      const lastPart = slot.item.summary[slot.item.summary.length - 1];
      if (!lastPart) {
        continue;
      }
      slot.block.thinking += event.delta;
      lastPart.text += event.delta;
      stream.push({
        type: "thinking_delta",
        contentIndex: slot.contentIndex,
        delta: event.delta,
        partial: output
      });
    } else if (event.type === "response.reasoning_summary_part.done") {
      const slot = resolveOutputSlot(event, "thinking");
      if (!slot) {
        continue;
      }
      slot.item.summary = slot.item.summary || [];
      const lastPart = slot.item.summary[slot.item.summary.length - 1];
      if (!lastPart) {
        continue;
      }
      slot.block.thinking += "\n\n";
      lastPart.text += "\n\n";
      stream.push({
        type: "thinking_delta",
        contentIndex: slot.contentIndex,
        delta: "\n\n",
        partial: output
      });
    } else if (event.type === "response.reasoning_text.delta") {
      const slot = resolveOutputSlot(event, "thinking");
      if (!slot) {
        continue;
      }
      slot.block.thinking += event.delta;
      stream.push({
        type: "thinking_delta",
        contentIndex: slot.contentIndex,
        delta: event.delta,
        partial: output
      });
    } else if (event.type === "response.content_part.added") {
      const slot = resolveOutputSlot(event, "text");
      if (!slot) {
        continue;
      }
      slot.item.content = slot.item.content || [];
      if (event.part.type === OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE || event.part.type === AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE || event.part.type === "refusal") {
        slot.item.content.push(event.part);
      }
    } else if (event.type === "response.output_text.delta") {
      const slot = resolveOutputSlot(event, "text");
      if (!slot?.item.content || slot.item.content.length === 0) {
        continue;
      }
      const lastPart = slot.item.content[slot.item.content.length - 1];
      if (!isResponsesTextContentPartType(lastPart?.type)) {
        continue;
      }
      lastPart.text += event.delta;
      if (slot.pendingText !== null) {
        appendPendingMessageDelta(slot, event.delta);
      } else if (slot.block && slot.contentIndex !== void 0) {
        slot.block.text += event.delta;
        stream.push({
          type: "text_delta",
          contentIndex: slot.contentIndex,
          delta: event.delta,
          partial: output
        });
      }
    } else if (isAzureResponsesTextDeltaEvent(event)) {
      const slot = resolveOutputSlot(event, "text");
      if (!slot) {
        continue;
      }
      slot.item.content = slot.item.content || [];
      let lastPart = slot.item.content[slot.item.content.length - 1];
      if (lastPart?.type !== "text") {
        lastPart = { type: "text", text: "" };
        slot.item.content.push(lastPart);
      }
      lastPart.text += event.delta;
      if (slot.pendingText !== null) {
        appendPendingMessageDelta(slot, event.delta);
      } else if (slot.block && slot.contentIndex !== void 0) {
        slot.block.text += event.delta;
        stream.push({
          type: "text_delta",
          contentIndex: slot.contentIndex,
          delta: event.delta,
          partial: output
        });
      }
    } else if (event.type === "response.refusal.delta") {
      const slot = resolveOutputSlot(event, "text");
      if (!slot?.item.content || slot.item.content.length === 0) {
        continue;
      }
      const lastPart = slot.item.content[slot.item.content.length - 1];
      if (lastPart?.type !== "refusal") {
        continue;
      }
      lastPart.refusal += event.delta;
      if (slot.pendingText !== null) {
        appendPendingMessageDelta(slot, event.delta);
      } else if (slot.block && slot.contentIndex !== void 0) {
        slot.block.text += event.delta;
        stream.push({
          type: "text_delta",
          contentIndex: slot.contentIndex,
          delta: event.delta,
          partial: output
        });
      }
    } else if (event.type === "response.function_call_arguments.delta") {
      const toolCall = streamingToolCalls.resolve(event);
      if (toolCall) {
        toolCall.block.partialJson += event.delta;
        toolCall.block.arguments = parseStreamingJson(toolCall.block.partialJson);
        stream.push({
          type: "toolcall_delta",
          contentIndex: toolCall.contentIndex,
          delta: event.delta,
          partial: output
        });
      } else if (streamingToolCalls.hasActive()) {
        streamingToolCalls.markArgumentsUnreliable();
      }
    } else if (event.type === "response.function_call_arguments.done") {
      const toolCall = streamingToolCalls.resolve(event);
      if (toolCall) {
        const previousPartialJson = toolCall.block.partialJson;
        const doneArguments = typeof event.arguments === "string" ? event.arguments : void 0;
        if (doneArguments !== void 0 && (doneArguments.length > 0 || previousPartialJson === "")) {
          toolCall.block.partialJson = doneArguments;
          toolCall.block.arguments = parseStreamingJson(toolCall.block.partialJson);
          toolCall.argumentStreamReliable = true;
        }
        if (doneArguments?.startsWith(previousPartialJson)) {
          const delta = doneArguments.slice(previousPartialJson.length);
          if (delta.length > 0) {
            stream.push({
              type: "toolcall_delta",
              contentIndex: toolCall.contentIndex,
              delta,
              partial: output
            });
          }
        }
      } else if (streamingToolCalls.hasActive()) {
        streamingToolCalls.markArgumentsUnreliable();
      }
    } else if (event.type === "response.output_item.done") {
      const item = event.item;
      if (item.type !== "message") {
        lastTextBlock = null;
      }
      const existingOutputSlot = resolveOutputItemSlot(event, item);
      materializeDeferredTextSlots(existingOutputSlot);
      const outputSlot = existingOutputSlot ?? getOrCreateOutputSlot(event, item);
      if (item.type === "reasoning" && outputSlot?.type === "thinking") {
        const summaryText = item.summary?.map((s) => s.text).join("\n\n") || "";
        const contentText = item.content?.map((c) => c.text).join("\n\n") || "";
        outputSlot.block.thinking = summaryText || contentText || outputSlot.block.thinking;
        outputSlot.block.thinkingSignature = JSON.stringify(item);
        if (typeof item.id === "string") {
          reasoningBlocksById.set(item.id, outputSlot.block);
        }
        stream.push({
          type: "thinking_end",
          contentIndex: outputSlot.contentIndex,
          content: outputSlot.block.thinking,
          partial: output
        });
        forgetOutputSlot(event, outputSlot);
      } else if (item.type === "message" && outputSlot?.type === "text" && (outputSlot.block || outputSlot.pendingText !== null)) {
        const streamedText = outputSlot.pendingText ?? outputSlot.block?.text ?? "";
        const finalText = item.content == null ? streamedText : item.content.map((c) => c.type === "output_text" || c.type === "text" ? c.text : c.refusal).join("");
        const phase = item.phase ?? void 0;
        const collapse = outputSlot.pendingText !== null ? resolveResponsesMessageSnapshotCollapse({
          prior: outputSlot.collapseCandidate && {
            text: outputSlot.collapseCandidate.block.text,
            phase: outputSlot.collapseCandidate.phase
          },
          nextText: finalText,
          nextPhase: phase
        }) : { kind: "keep" };
        outputSlot.pendingText = null;
        if (collapse.kind === "extend" && outputSlot.collapseCandidate) {
          outputSlot.collapseCandidate.block.text = collapse.text;
          outputSlot.collapseCandidate.block.textSignature = encodeTextSignatureV1(item.id, phase);
          stream.push({
            type: "text_end",
            contentIndex: outputSlot.collapseCandidate.index,
            content: collapse.text,
            partial: output
          });
          lastTextBlock = outputSlot.collapseCandidate;
        } else {
          if (!outputSlot.block) {
            outputSlot.block = {
              type: "text",
              text: "",
              ...phase ? { textSignature: encodeTextSignatureV1(item.id, phase) } : {}
            };
            blocks.push(outputSlot.block);
            outputSlot.contentIndex = blockIndex();
            stream.push({
              type: "text_start",
              contentIndex: outputSlot.contentIndex,
              partial: output
            });
          }
          outputSlot.block.text = finalText;
          outputSlot.block.textSignature = encodeTextSignatureV1(item.id, phase);
          const contentIndex = outputSlot.contentIndex;
          if (contentIndex === void 0) {
            throw new Error("Responses stream finalized text without a content index");
          }
          lastTextBlock = { block: outputSlot.block, index: contentIndex, phase };
          stream.push({
            type: "text_end",
            contentIndex,
            content: outputSlot.block.text,
            partial: output
          });
        }
        forgetOutputSlot(event, outputSlot);
      } else if (item.type === "function_call") {
        const streamingToolCall = streamingToolCalls.resolve(
          event,
          readResponsesToolCallItemIdentity(item)
        );
        if (!streamingToolCall && streamingToolCalls.hasActive()) {
          continue;
        }
        const completedName = resolveCompletedToolCallName(streamingToolCall, item.name);
        const streamedArguments = streamingToolCall?.block.partialJson ?? "";
        const completedArguments = typeof item.arguments === "string" ? item.arguments : void 0;
        if (streamingToolCall && !streamingToolCall.argumentStreamReliable && !completedArguments) {
          continue;
        }
        const finalArguments = completedArguments !== void 0 && (completedArguments.length > 0 || !streamedArguments) ? completedArguments : streamedArguments || "{}";
        const args = parseStreamingJson(finalArguments);
        let toolCall;
        let contentIndex;
        if (streamingToolCall) {
          const block = streamingToolCall.block;
          block.id = resolveResponsesToolCallId(item, block.id);
          block.name = completedName;
          block.arguments = args;
          delete block.partialJson;
          toolCall = block;
          contentIndex = streamingToolCall.contentIndex;
        } else {
          toolCall = {
            type: "toolCall",
            id: resolveResponsesToolCallId(item),
            name: completedName,
            arguments: args
          };
          blocks.push(toolCall);
          contentIndex = blockIndex();
          stream.push({ type: "toolcall_start", contentIndex, partial: output });
        }
        if (streamingToolCall) {
          streamingToolCalls.forget(streamingToolCall);
          forgetToolCallOutputSlot(streamingToolCall);
        }
        stream.push({
          type: "toolcall_end",
          contentIndex,
          toolCall,
          partial: output
        });
      }
    } else if (event.type === "response.completed" || event.type === "response.incomplete") {
      if (streamingToolCalls.hasActive()) {
        throw new Error("Responses stream completed with unresolved tool calls");
      }
      finalizeResponse(event.response);
    } else if (event.type === "error") {
      throw new Error(
        event.message ? `Error Code ${event.code}: ${event.message}` : "Unknown error"
      );
    } else if (event.type === "response.failed") {
      const error = event.response?.error;
      const details = event.response?.incomplete_details;
      output.responseId = event.response.id;
      output.stopReason = "error";
      output.errorMessage = error ? `${error.code || "unknown"}: ${error.message || "no message"}` : details?.reason ? `incomplete: ${details.reason}` : "Unknown error (no error details in response)";
      terminalResponseEvent = "failed";
      break;
    }
  }
  if (terminalResponseEvent === "failed") {
    return;
  }
  if (streamingToolCalls.hasActive()) {
    throw new Error("Responses stream ended with unresolved tool calls");
  }
  if (!terminalResponseEvent) {
    throw new Error("OpenAI Responses stream ended before a terminal response event");
  }
}

// packages/ai/src/providers/simple-options.ts
function buildBaseOptions(model, options, apiKey) {
  void model;
  const firstEventOptions = options;
  return {
    temperature: options?.temperature,
    maxTokens: options?.maxTokens,
    stop: options?.stop,
    signal: options?.signal,
    apiKey: apiKey || options?.apiKey,
    transport: options?.transport,
    cacheRetention: options?.cacheRetention,
    sessionId: options?.sessionId,
    promptCacheKey: options?.promptCacheKey,
    headers: options?.headers,
    onPayload: options?.onPayload,
    onResponse: options?.onResponse,
    timeoutMs: options?.timeoutMs,
    firstEventTimeoutMs: firstEventOptions?.firstEventTimeoutMs,
    onFirstEventTimeout: firstEventOptions?.onFirstEventTimeout,
    maxRetries: options?.maxRetries,
    maxRetryDelayMs: options?.maxRetryDelayMs,
    metadata: options?.metadata
  };
}

// packages/ai/src/providers/openai-chatgpt-responses.ts
var dynamicImport2 = (specifier) => import(specifier);
function loadNodeOs() {
  if (typeof process === "undefined" || !(process.versions?.node || process.versions?.bun)) {
    return null;
  }
  return process.getBuiltinModule?.("node:os") ?? null;
}
var os = loadNodeOs();
var DEFAULT_CODEX_BASE_URL = "https://chatgpt.com/backend-api";
var DEFAULT_MAX_RETRIES = 3;
var BASE_DELAY_MS = 1e3;
var REQUEST_COMPRESSION_ZSTD_LEVEL = 3;
var CODEX_TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set(["openai", "opencode"]);
var WEBSOCKET_MESSAGE_TOO_BIG_CLOSE_CODE = 1009;
var WEBSOCKET_CONNECTION_LIMIT_REACHED_CODE = "websocket_connection_limit_reached";
var OPENAI_CHATGPT_RESPONSES_ERROR_BODY_MAX_BYTES = 16 * 1024;
var OPENAI_CHATGPT_RESPONSES_SUCCESS_BODY_MAX_BYTES = 16 * 1024 * 1024;
var CODEX_RESPONSE_STATUSES = /* @__PURE__ */ new Set([
  "completed",
  "incomplete",
  "failed",
  "cancelled",
  "queued",
  "in_progress"
]);
function isRetryableError(status, errorText) {
  if (status === 429 || status === 500 || status === 502 || status === 503 || status === 504) {
    return true;
  }
  return /rate.?limit|overloaded|service.?unavailable|upstream.?connect|connection.?refused/i.test(
    errorText
  );
}
function resolveHttpRetryDelayMs(response, attempt) {
  const fallbackMs = BASE_DELAY_MS * 2 ** attempt;
  const retryAfterMs = response.headers.get("retry-after-ms");
  if (retryAfterMs) {
    const trimmed2 = retryAfterMs.trim();
    const millis = Number(trimmed2);
    if (/^\d+(?:\.\d+)?$/.test(trimmed2) && Number.isFinite(millis)) {
      return clampTimerTimeoutMs(millis, 0) ?? fallbackMs;
    }
  }
  const retryAfter = response.headers.get("retry-after");
  if (!retryAfter) {
    return fallbackMs;
  }
  const trimmed = retryAfter.trim();
  const seconds = Number(trimmed);
  if (/^\d+$/.test(trimmed) && Number.isFinite(seconds)) {
    return clampTimerTimeoutMs(seconds * 1e3, 0) ?? fallbackMs;
  }
  const retryAt = parseRetryAfterHttpDateMs(trimmed);
  return retryAt === void 0 ? fallbackMs : clampTimerTimeoutMs(retryAt - Date.now(), 0) ?? fallbackMs;
}
function resolveRequestTimeoutMs(options) {
  const timeoutMs = options?.timeoutMs;
  return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? resolveTimerTimeoutMs(timeoutMs, 1) : void 0;
}
function buildRequestSignal(baseSignal, timeoutMs) {
  if (timeoutMs === void 0) {
    return baseSignal;
  }
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  if (!baseSignal) {
    return timeoutSignal;
  }
  return AbortSignal.any([baseSignal, timeoutSignal]);
}
function isRequestTimeoutError(error, callerSignal, requestSignal, timeoutMs) {
  if (timeoutMs === void 0 || callerSignal?.aborted || !requestSignal?.aborted) {
    return false;
  }
  if (!(error instanceof Error)) {
    return false;
  }
  return error.name === "AbortError" || error.name === "TimeoutError" || error.message === "Request was aborted";
}
function formatRequestTimeoutError(timeoutMs, cause) {
  return new Error(`Request timed out after ${timeoutMs}ms`, {
    cause: cause instanceof Error ? cause : void 0
  });
}
function compressRequestBodyZstd(bodyJson) {
  if (typeof process === "undefined" || !(process.versions?.node || process.versions?.bun)) {
    return null;
  }
  const zlib = process.getBuiltinModule?.("node:zlib");
  if (!zlib || typeof zlib.zstdCompressSync !== "function") {
    return null;
  }
  try {
    const compressed = zlib.zstdCompressSync(bodyJson, {
      params: {
        [zlib.constants.ZSTD_c_compressionLevel]: REQUEST_COMPRESSION_ZSTD_LEVEL
      }
    });
    return Uint8Array.from(compressed);
  } catch {
    return null;
  }
}
var streamOpenAICodexResponses = (model, context, options) => {
  const stream = new AssistantMessageEventStream();
  void (async () => {
    let requestTimeoutMs;
    let requestTimeoutSignal;
    let activeSignal;
    let firstEventAbort;
    const output = {
      role: "assistant",
      content: [],
      api: "openai-chatgpt-responses",
      provider: model.provider,
      model: model.id,
      usage: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        totalTokens: 0,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
      },
      stopReason: "stop",
      timestamp: Date.now()
    };
    try {
      const unresolvedApiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
      if (!unresolvedApiKey) {
        throw new Error(`No API key for provider: ${model.provider}`);
      }
      const apiKey = getAiTransportHost().resolveSecretSentinel(unresolvedApiKey);
      const modelHeaders = resolveAiTransportHeaderSentinels(model.headers);
      const optionHeaders = resolveAiTransportHeaderSentinels(options?.headers);
      const accountId = extractOpenAICodexAccountId(apiKey);
      let body = buildRequestBody(model, context, options);
      const nextBody = await options?.onPayload?.(body, model);
      if (nextBody !== void 0) {
        body = nextBody;
      }
      const sessionId = clampOpenAIPromptCacheKey(options?.sessionId);
      const websocketRequestId = sessionId || createCodexRequestId();
      const sseHeaders = buildSSEHeaders(modelHeaders, optionHeaders, accountId, apiKey, sessionId);
      const websocketHeaders = buildWebSocketHeaders(
        modelHeaders,
        optionHeaders,
        accountId,
        apiKey,
        websocketRequestId
      );
      const bodyJson = JSON.stringify(body);
      requestTimeoutMs = resolveRequestTimeoutMs(options);
      requestTimeoutSignal = buildRequestSignal(options?.signal, requestTimeoutMs);
      firstEventAbort = createFirstStreamEventAbortController(requestTimeoutSignal);
      activeSignal = firstEventAbort.signal;
      const requestOptions = activeSignal === options?.signal ? options : { ...options, signal: activeSignal };
      const transport = options?.transport || "auto";
      const websocketDisabledForSession = transport === "auto" && isWebSocketSseFallbackActive(options?.sessionId);
      if (transport !== "sse" && !websocketDisabledForSession) {
        let websocketStarted = false;
        let retriedWebSocketConnectionLimit = false;
        while (true) {
          websocketStarted = false;
          try {
            await processWebSocketStream(
              resolveCodexWebSocketUrl(model.baseUrl),
              body,
              websocketHeaders,
              output,
              stream,
              model,
              () => {
                websocketStarted = true;
              },
              requestOptions,
              firstEventAbort.abort
            );
            if (activeSignal?.aborted) {
              throw new Error("Request was aborted");
            }
            stream.push({
              type: "done",
              reason: output.stopReason,
              message: output
            });
            stream.end();
            return;
          } catch (error) {
            const aborted = activeSignal?.aborted;
            const connectionLimitBeforeStart = !websocketStarted && isWebSocketConnectionLimitReachedError(error);
            if (!aborted && connectionLimitBeforeStart && !retriedWebSocketConnectionLimit) {
              retriedWebSocketConnectionLimit = true;
              continue;
            }
            if (aborted || isCodexNonTransportError(error) && !connectionLimitBeforeStart) {
              throw error;
            }
            appendAssistantMessageDiagnostic(
              output,
              createAssistantMessageDiagnostic("provider_transport_failure", error, {
                configuredTransport: transport,
                fallbackTransport: transport === "auto" && !websocketStarted ? "sse" : void 0,
                eventsEmitted: websocketStarted,
                phase: websocketStarted ? "after_message_stream_start" : "before_message_stream_start",
                requestBytes: new TextEncoder().encode(bodyJson).byteLength
              })
            );
            if (transport === "auto" && options?.sessionId) {
              websocketSseFallbackSessions.add(options.sessionId);
            }
            if (websocketStarted || transport !== "auto") {
              throw error;
            }
            break;
          }
        }
      }
      const canCompressSseBody = model.provider === "openai" && !sseHeaders.has("content-encoding");
      const compressedBody = canCompressSseBody ? compressRequestBodyZstd(bodyJson) : null;
      if (compressedBody) {
        sseHeaders.set("content-encoding", "zstd");
      }
      const sseBody = compressedBody ?? bodyJson;
      let response;
      let lastError;
      const maxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        if (activeSignal?.aborted) {
          throw new Error("Request was aborted");
        }
        let attemptResponse;
        let errorText;
        try {
          attemptResponse = await fetch(resolveCodexUrl(model.baseUrl), {
            method: "POST",
            headers: sseHeaders,
            body: sseBody,
            signal: activeSignal
          });
          response = attemptResponse;
          await options?.onResponse?.(
            { status: attemptResponse.status, headers: headersToRecord(attemptResponse.headers) },
            model
          );
          if (attemptResponse.ok) {
            break;
          }
          errorText = await readChatGptResponsesErrorTextLimited(attemptResponse);
        } catch (error) {
          if (error instanceof Error) {
            if (isRequestTimeoutError(
              error,
              options?.signal,
              requestTimeoutSignal,
              requestTimeoutMs
            ) && requestTimeoutMs !== void 0) {
              throw formatRequestTimeoutError(requestTimeoutMs, error);
            }
            if (error.name === "AbortError" || error.message === "Request was aborted") {
              throw new Error("Request was aborted", { cause: error });
            }
            if (error.name === "TimeoutError" && requestTimeoutMs !== void 0) {
              throw new Error(`Request timed out after ${requestTimeoutMs}ms`, { cause: error });
            }
          }
          lastError = error instanceof Error ? error : new Error(String(error));
          if (attempt < maxRetries && !lastError.message.includes("usage limit")) {
            const delayMs = BASE_DELAY_MS * 2 ** attempt;
            await sleepWithAbort(delayMs, activeSignal);
            continue;
          }
          throw lastError;
        }
        if (attempt < maxRetries && isRetryableError(attemptResponse.status, errorText)) {
          await sleepWithAbort(resolveHttpRetryDelayMs(attemptResponse, attempt), activeSignal);
          continue;
        }
        const info = parseErrorResponseText(
          errorText,
          attemptResponse.status,
          attemptResponse.statusText
        );
        throw new Error(info.friendlyMessage || info.message);
      }
      if (!response?.ok) {
        throw lastError ?? new Error("Failed after retries");
      }
      if (!response.body) {
        throw new Error("No response body");
      }
      stream.push({ type: "start", partial: output });
      await processStream(response, output, stream, model, options, firstEventAbort.abort);
      if (activeSignal?.aborted) {
        throw new Error("Request was aborted");
      }
      stream.push({
        type: "done",
        reason: output.stopReason,
        message: output
      });
      stream.end();
    } catch (error) {
      const normalizedError = isRequestTimeoutError(error, options?.signal, requestTimeoutSignal, requestTimeoutMs) && requestTimeoutMs !== void 0 ? formatRequestTimeoutError(requestTimeoutMs, error) : error;
      for (const block of output.content) {
        delete block.partialJson;
      }
      output.stopReason = options?.signal?.aborted ? "aborted" : "error";
      output.errorMessage = normalizedError instanceof Error ? normalizedError.message : String(normalizedError);
      stream.push({ type: "error", reason: output.stopReason, error: output });
      stream.end();
    } finally {
      firstEventAbort?.dispose();
    }
  })();
  return stream;
};
var streamSimpleOpenAICodexResponses = (model, context, options) => {
  const apiKey = options?.apiKey || getEnvApiKey(model.provider);
  if (!apiKey) {
    throw new Error(`No API key for provider: ${model.provider}`);
  }
  const base = buildBaseOptions(model, options, apiKey);
  return streamOpenAICodexResponses(model, context, {
    ...base,
    reasoningEffort: resolveResponsesReasoningEffort(model, options?.reasoning)
  });
};
function buildRequestBody(model, context, options) {
  const messages = convertResponsesMessages(model, context, CODEX_TOOL_CALL_PROVIDERS, {
    includeSystemPrompt: false,
    replayResponsesItemIds: false
  });
  const body = {
    model: model.id,
    store: false,
    stream: true,
    instructions: stripSystemPromptCacheBoundary(context.systemPrompt ?? "") || "You are a helpful assistant.",
    input: messages,
    text: { verbosity: options?.textVerbosity || "low" },
    include: ["reasoning.encrypted_content"],
    prompt_cache_key: options?.cacheRetention === "none" ? void 0 : clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId),
    tool_choice: "auto",
    parallel_tool_calls: true
  };
  if (options?.temperature !== void 0 && supportsOpenAITemperature(model)) {
    body.temperature = options.temperature;
  }
  if (options?.serviceTier !== void 0) {
    body.service_tier = options.serviceTier;
  }
  if (context.tools) {
    const converted = convertResponsesToolPayload(context.tools, { strict: null });
    if (converted.projection.inputToolCount > 0 || converted.projection.diagnostics.length > 0) {
      body.tools = converted.tools;
      if (body.tools.length === 0) {
        delete body.tools;
        delete body.tool_choice;
        delete body.parallel_tool_calls;
      }
    }
  }
  if (options?.reasoningEffort !== void 0) {
    const effort = options.reasoningEffort === "none" ? model.thinkingLevelMap?.off ?? "none" : model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
    if (effort !== null) {
      body.reasoning = {
        effort,
        summary: options.reasoningSummary ?? "auto"
      };
    }
  }
  return body;
}
function getServiceTierCostMultiplier(model, serviceTier) {
  switch (serviceTier) {
    case "flex":
      return 0.5;
    case "priority":
      return model.id === "gpt-5.5" ? 2.5 : 2;
    default:
      return 1;
  }
}
function applyServiceTierPricing(usage, serviceTier, model) {
  const multiplier = getServiceTierCostMultiplier(model, serviceTier);
  if (multiplier === 1) {
    return;
  }
  usage.cost.input *= multiplier;
  usage.cost.output *= multiplier;
  usage.cost.cacheRead *= multiplier;
  usage.cost.cacheWrite *= multiplier;
  usage.cost.total = usage.cost.input + usage.cost.output + usage.cost.cacheRead + usage.cost.cacheWrite;
}
function resolveCodexServiceTier(responseServiceTier, requestServiceTier) {
  if (responseServiceTier === "default" && (requestServiceTier === "flex" || requestServiceTier === "priority")) {
    return requestServiceTier;
  }
  return responseServiceTier ?? requestServiceTier;
}
function resolveCodexUrl(baseUrl) {
  const raw = baseUrl && baseUrl.trim().length > 0 ? baseUrl : DEFAULT_CODEX_BASE_URL;
  const normalized = raw.replace(/\/+$/, "");
  if (normalized.endsWith("/codex/responses")) {
    return normalized;
  }
  if (normalized.endsWith("/codex")) {
    return `${normalized}/responses`;
  }
  return `${normalized}/codex/responses`;
}
function resolveCodexWebSocketUrl(baseUrl) {
  const url = new URL(resolveCodexUrl(baseUrl));
  if (url.protocol === "https:") {
    url.protocol = "wss:";
  }
  if (url.protocol === "http:") {
    url.protocol = "ws:";
  }
  return url.toString();
}
async function processStream(response, output, stream, model, options, abortFirstEventStream) {
  await processResponsesStream(mapCodexEvents(parseSSE(response)), output, stream, model, {
    serviceTier: options?.serviceTier,
    firstEventTimeoutMs: getFirstStreamEventTimeoutMs(options),
    abortFirstEventStream,
    onFirstEventTimeout: getFirstStreamEventTimeoutHandler(options),
    resolveServiceTier: resolveCodexServiceTier,
    applyServiceTierPricing: (usage, serviceTier) => applyServiceTierPricing(usage, serviceTier, model)
  });
}
var CodexApiError = class extends Error {
  constructor(message, options) {
    super(message);
    this.name = "CodexApiError";
    this.code = options?.code;
    this.payload = options?.payload;
    this.cause = options?.cause;
  }
};
var CodexProtocolError = class extends Error {
  constructor(message, options) {
    super(message);
    this.name = "CodexProtocolError";
    this.payload = options?.payload;
    this.cause = options?.cause;
  }
};
function isCodexNonTransportError(error) {
  return error instanceof CodexApiError || error instanceof CodexProtocolError;
}
function isWebSocketConnectionLimitReachedError(error) {
  return error instanceof CodexApiError && error.code === WEBSOCKET_CONNECTION_LIMIT_REACHED_CODE;
}
function extractCodexEventError(event) {
  const nested = event.error && typeof event.error === "object" ? event.error : void 0;
  return {
    code: typeof event.code === "string" ? event.code : typeof nested?.code === "string" ? nested.code : void 0,
    message: typeof event.message === "string" ? event.message : typeof nested?.message === "string" ? nested.message : void 0
  };
}
async function* mapCodexEvents(events) {
  for await (const event of events) {
    const type = typeof event.type === "string" ? event.type : void 0;
    if (!type) {
      continue;
    }
    if (type === "error") {
      const { code, message } = extractCodexEventError(event);
      throw new CodexApiError(`Codex error: ${message || code || JSON.stringify(event)}`, {
        code,
        payload: event
      });
    }
    if (type === "response.failed") {
      const response = event.response;
      const code = response?.error?.code;
      const message = response?.error?.message;
      throw new CodexApiError(message || "Codex response failed", { code, payload: event });
    }
    if (type === "response.done" || type === "response.completed" || type === "response.incomplete") {
      const response = event.response;
      const normalizedResponse = response ? { ...response, status: normalizeCodexStatus(response.status) } : response;
      yield {
        ...event,
        type: "response.completed",
        response: normalizedResponse
      };
      return;
    }
    yield event;
  }
}
function normalizeCodexStatus(status) {
  if (typeof status !== "string") {
    return void 0;
  }
  return CODEX_RESPONSE_STATUSES.has(status) ? status : void 0;
}
async function* parseSSE(response) {
  if (!response.body) {
    return;
  }
  const reader = response.body.getReader();
  const guard = createSseByteGuard(reader, {
    maxBytes: OPENAI_CHATGPT_RESPONSES_SUCCESS_BODY_MAX_BYTES,
    onOverflow: ({ size, maxBytes }) => new Error(
      `OpenAI ChatGPT Responses success body exceeded ${maxBytes} bytes (received ${size})`
    )
  });
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await guard.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      let idx = buffer.indexOf("\n\n");
      while (idx !== -1) {
        const chunk = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const dataLines = chunk.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trim());
        if (dataLines.length > 0) {
          const data = dataLines.join("\n").trim();
          if (data && data !== "[DONE]") {
            try {
              yield JSON.parse(data);
            } catch (cause) {
              throw new CodexProtocolError(`Invalid Codex SSE JSON: ${formatThrownValue(cause)}`, {
                cause,
                payload: data
              });
            }
          }
        }
        idx = buffer.indexOf("\n\n");
      }
    }
  } finally {
    try {
      await guard.cancel();
    } catch {
    }
    try {
      reader.releaseLock();
    } catch {
    }
  }
}
var parseSSEForTest = parseSSE;
var OPENAI_BETA_RESPONSES_WEBSOCKETS = "responses_websockets=2026-02-06";
var SESSION_WEBSOCKET_CACHE_TTL_MS = 5 * 60 * 1e3;
var SESSION_WEBSOCKET_MAX_AGE_MS = 55 * 60 * 1e3;
var websocketSessionCache = /* @__PURE__ */ new Map();
var websocketSseFallbackSessions = /* @__PURE__ */ new Set();
var cachedWebsocket = null;
function resetOpenAICodexWebSocketStateForTest() {
  cachedWebsocket = null;
  websocketSseFallbackSessions.clear();
}
function closeOpenAICodexWebSocketSessions(sessionId) {
  const closeEntry = (entry) => {
    if (entry.idleTimer) {
      clearTimeout(entry.idleTimer);
    }
    closeWebSocketSilently(entry.socket, 1e3, "debug_close");
  };
  if (sessionId) {
    const entry = websocketSessionCache.get(sessionId);
    if (entry) {
      closeEntry(entry);
    }
    websocketSessionCache.delete(sessionId);
    return;
  }
  for (const entry of websocketSessionCache.values()) {
    closeEntry(entry);
  }
  websocketSessionCache.clear();
}
registerSessionResourceCleanup(closeOpenAICodexWebSocketSessions);
function isWebSocketSseFallbackActive(sessionId) {
  return sessionId ? websocketSseFallbackSessions.has(sessionId) : false;
}
async function getWebSocketConstructor() {
  if (cachedWebsocket) {
    return cachedWebsocket;
  }
  if (process?.versions?.bun && (process.env.HTTP_PROXY || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.https_proxy)) {
    const m = await dynamicImport2("proxy-from-env");
    const getProxyForUrl = m.getProxyForUrl;
    cachedWebsocket = class extends WebSocket {
      constructor(url, options) {
        let opts;
        if (Array.isArray(options) || typeof options === "string") {
          opts = { protocols: options };
        } else {
          opts = { ...options };
        }
        const proxy = getProxyForUrl(
          url.toString().replace(/^wss:/, "https:").replace(/^ws:/, "http:")
        );
        super(url, { ...opts, ...proxy ? { proxy } : {} });
      }
    };
    return cachedWebsocket;
  }
  const ctor = globalThis.WebSocket;
  if (typeof ctor !== "function") {
    return null;
  }
  return ctor;
}
var WebSocketCloseError = class extends Error {
  constructor(message, options) {
    super(message);
    this.name = "WebSocketCloseError";
    this.code = options?.code;
    this.reason = options?.reason;
    this.wasClean = options?.wasClean;
  }
};
function getWebSocketReadyState(socket) {
  const readyState = socket.readyState;
  return typeof readyState === "number" ? readyState : void 0;
}
function isWebSocketReusable(socket) {
  const readyState = getWebSocketReadyState(socket);
  return readyState === void 0 || readyState === 1;
}
function isWebSocketSessionExpired(entry) {
  return Date.now() - entry.createdAt >= SESSION_WEBSOCKET_MAX_AGE_MS;
}
function closeWebSocketSilently(socket, code = 1e3, reason = "done") {
  try {
    socket.close(code, reason);
  } catch {
  }
}
function scheduleSessionWebSocketExpiry(sessionId, entry) {
  if (entry.idleTimer) {
    clearTimeout(entry.idleTimer);
  }
  entry.idleTimer = setTimeout(() => {
    if (entry.busy) {
      return;
    }
    closeWebSocketSilently(entry.socket, 1e3, "idle_timeout");
    websocketSessionCache.delete(sessionId);
  }, SESSION_WEBSOCKET_CACHE_TTL_MS);
}
async function connectWebSocket(url, headers, signal) {
  const WebSocketCtor = await getWebSocketConstructor();
  if (!WebSocketCtor) {
    throw new Error("WebSocket transport is not available in this runtime");
  }
  const wsHeaders = headersToRecord(headers);
  delete wsHeaders["OpenAI-Beta"];
  return new Promise((resolve, reject) => {
    let settled = false;
    let socket;
    try {
      socket = new WebSocketCtor(url, { headers: wsHeaders });
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
      return;
    }
    const onOpen = () => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      resolve(socket);
    };
    const onError = (event) => {
      const error = extractWebSocketError(event);
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      reject(error);
    };
    const onClose = (event) => {
      const error = extractWebSocketCloseError(event);
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      reject(error);
    };
    const onAbort = () => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      socket.close(1e3, "aborted");
      reject(new Error("Request was aborted"));
    };
    const cleanup = () => {
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("error", onError);
      socket.removeEventListener("close", onClose);
      signal?.removeEventListener("abort", onAbort);
    };
    if (signal?.aborted) {
      onAbort();
      return;
    }
    socket.addEventListener("open", onOpen);
    socket.addEventListener("error", onError);
    socket.addEventListener("close", onClose);
    signal?.addEventListener("abort", onAbort);
  });
}
async function acquireWebSocket(url, headers, sessionId, signal) {
  if (!sessionId) {
    const socket2 = await connectWebSocket(url, headers, signal);
    return {
      socket: socket2,
      release: ({ keep } = {}) => {
        if (keep === false) {
          closeWebSocketSilently(socket2);
          return;
        }
        closeWebSocketSilently(socket2);
      }
    };
  }
  const cached = websocketSessionCache.get(sessionId);
  if (cached) {
    if (cached.idleTimer) {
      clearTimeout(cached.idleTimer);
      cached.idleTimer = void 0;
    }
    if (!cached.busy && isWebSocketSessionExpired(cached)) {
      closeWebSocketSilently(cached.socket, 1e3, "connection_age_limit");
      websocketSessionCache.delete(sessionId);
    } else if (!cached.busy && isWebSocketReusable(cached.socket)) {
      cached.busy = true;
      return {
        socket: cached.socket,
        entry: cached,
        release: ({ keep } = {}) => {
          if (!keep || !isWebSocketReusable(cached.socket)) {
            closeWebSocketSilently(cached.socket);
            websocketSessionCache.delete(sessionId);
            return;
          }
          cached.busy = false;
          scheduleSessionWebSocketExpiry(sessionId, cached);
        }
      };
    }
    if (cached.busy) {
      const socket2 = await connectWebSocket(url, headers, signal);
      return {
        socket: socket2,
        release: () => {
          closeWebSocketSilently(socket2);
        }
      };
    }
    if (!isWebSocketReusable(cached.socket)) {
      closeWebSocketSilently(cached.socket);
      websocketSessionCache.delete(sessionId);
    }
  }
  const socket = await connectWebSocket(url, headers, signal);
  const entry = { socket, busy: true, createdAt: Date.now() };
  websocketSessionCache.set(sessionId, entry);
  return {
    socket,
    entry,
    release: ({ keep } = {}) => {
      if (!keep || !isWebSocketReusable(entry.socket)) {
        closeWebSocketSilently(entry.socket);
        if (entry.idleTimer) {
          clearTimeout(entry.idleTimer);
        }
        if (websocketSessionCache.get(sessionId) === entry) {
          websocketSessionCache.delete(sessionId);
        }
        return;
      }
      entry.busy = false;
      scheduleSessionWebSocketExpiry(sessionId, entry);
    }
  };
}
function extractWebSocketError(event) {
  if (event && typeof event === "object") {
    const message = "message" in event ? event.message : void 0;
    if (typeof message === "string" && message.length > 0) {
      return new Error(message);
    }
    const nestedError = "error" in event ? event.error : void 0;
    if (nestedError instanceof Error && nestedError.message.length > 0) {
      return nestedError;
    }
    if (nestedError && typeof nestedError === "object" && "message" in nestedError) {
      const nestedMessage = nestedError.message;
      if (typeof nestedMessage === "string" && nestedMessage.length > 0) {
        return new Error(nestedMessage);
      }
    }
  }
  return new Error("WebSocket error");
}
function extractWebSocketCloseError(event) {
  if (event && typeof event === "object") {
    const code = "code" in event ? event.code : void 0;
    const reason = "reason" in event ? event.reason : void 0;
    const wasClean = "wasClean" in event ? event.wasClean : void 0;
    const codeText = typeof code === "number" ? ` ${code}` : "";
    let reasonText = typeof reason === "string" && reason.length > 0 ? ` ${reason}` : "";
    if (!reasonText && code === WEBSOCKET_MESSAGE_TOO_BIG_CLOSE_CODE) {
      reasonText = " message too big";
    }
    return new WebSocketCloseError(`WebSocket closed${codeText}${reasonText}`.trim(), {
      code: typeof code === "number" ? code : void 0,
      reason: typeof reason === "string" && reason.length > 0 ? reason : void 0,
      wasClean: typeof wasClean === "boolean" ? wasClean : void 0
    });
  }
  return new Error("WebSocket closed");
}
async function decodeWebSocketData(data) {
  if (typeof data === "string") {
    return data;
  }
  if (data instanceof ArrayBuffer) {
    return new TextDecoder().decode(new Uint8Array(data));
  }
  if (ArrayBuffer.isView(data)) {
    const view = data;
    return new TextDecoder().decode(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
  }
  if (data && typeof data === "object" && "arrayBuffer" in data) {
    const blobLike = data;
    const arrayBuffer = await blobLike.arrayBuffer();
    return new TextDecoder().decode(new Uint8Array(arrayBuffer));
  }
  return null;
}
async function* parseWebSocket(socket, signal) {
  const queue = [];
  let pending = null;
  let done = false;
  let failed = null;
  let sawCompletion = false;
  const wake = () => {
    if (!pending) {
      return;
    }
    const resolve = pending;
    pending = null;
    resolve();
  };
  const onMessage = (event) => {
    void (async () => {
      let text = null;
      try {
        if (!event || typeof event !== "object" || !("data" in event)) {
          return;
        }
        text = await decodeWebSocketData(event.data);
        if (!text) {
          return;
        }
        const parsed = JSON.parse(text);
        const type = typeof parsed.type === "string" ? parsed.type : "";
        if (type === "response.completed" || type === "response.done" || type === "response.incomplete") {
          sawCompletion = true;
          done = true;
        }
        queue.push(parsed);
        wake();
      } catch (cause) {
        failed = new CodexProtocolError(
          `Invalid Codex WebSocket JSON: ${formatThrownValue(cause)}`,
          {
            cause,
            payload: text
          }
        );
        done = true;
        wake();
      }
    })();
  };
  const onError = (event) => {
    failed = extractWebSocketError(event);
    done = true;
    wake();
  };
  const onClose = (event) => {
    if (sawCompletion) {
      done = true;
      wake();
      return;
    }
    if (!failed) {
      failed = extractWebSocketCloseError(event);
    }
    done = true;
    wake();
  };
  const onAbort = () => {
    failed = new Error("Request was aborted");
    done = true;
    wake();
  };
  socket.addEventListener("message", onMessage);
  socket.addEventListener("error", onError);
  socket.addEventListener("close", onClose);
  signal?.addEventListener("abort", onAbort);
  try {
    while (true) {
      if (signal?.aborted) {
        throw new Error("Request was aborted");
      }
      const next = queue.shift();
      if (next !== void 0) {
        yield next;
        continue;
      }
      if (done) {
        break;
      }
      await new Promise((resolve) => {
        pending = resolve;
      });
    }
    if (failed) {
      throw toLintErrorObject(failed, "Non-Error thrown");
    }
    if (!sawCompletion) {
      throw new Error("WebSocket stream closed before response.completed");
    }
  } finally {
    socket.removeEventListener("message", onMessage);
    socket.removeEventListener("error", onError);
    socket.removeEventListener("close", onClose);
    signal?.removeEventListener("abort", onAbort);
  }
}
function requestBodyWithoutInput(body) {
  const { input: _input, previous_response_id: _previousResponseId, ...rest } = body;
  return rest;
}
function responseInputsEqual(a, b) {
  return JSON.stringify(a ?? []) === JSON.stringify(b ?? []);
}
function requestBodiesMatchExceptInput(a, b) {
  return JSON.stringify(requestBodyWithoutInput(a)) === JSON.stringify(requestBodyWithoutInput(b));
}
function getCachedWebSocketInputDelta(body, continuation) {
  if (!requestBodiesMatchExceptInput(body, continuation.lastRequestBody)) {
    return void 0;
  }
  const currentInput = body.input ?? [];
  const baseline = [
    ...continuation.lastRequestBody.input ?? [],
    ...continuation.lastResponseItems
  ];
  if (currentInput.length < baseline.length) {
    return void 0;
  }
  const prefix = currentInput.slice(0, baseline.length);
  if (!responseInputsEqual(prefix, baseline)) {
    return void 0;
  }
  return currentInput.slice(baseline.length);
}
function buildCachedWebSocketRequestBody(entry, body) {
  const continuation = entry.continuation;
  if (!continuation) {
    return body;
  }
  const delta = getCachedWebSocketInputDelta(body, continuation);
  if (!delta || !continuation.lastResponseId) {
    entry.continuation = void 0;
    return body;
  }
  return {
    ...body,
    previous_response_id: continuation.lastResponseId,
    input: delta
  };
}
async function* startWebSocketOutputOnFirstEvent(events, output, stream, onStart) {
  let started = false;
  for await (const event of events) {
    if (!started) {
      started = true;
      onStart();
      stream.push({ type: "start", partial: output });
    }
    yield event;
  }
}
async function processWebSocketStream(url, body, headers, output, stream, model, onStart, options, abortFirstEventStream) {
  const { socket, entry, release } = await acquireWebSocket(
    url,
    headers,
    options?.sessionId,
    options?.signal
  );
  let keepConnection = true;
  const useCachedContext = options?.transport === "websocket-cached" || options?.transport === "auto";
  const fullBody = body;
  const requestBody = useCachedContext && entry ? buildCachedWebSocketRequestBody(entry, fullBody) : fullBody;
  try {
    if (options?.signal?.aborted) {
      throw new Error("Request was aborted");
    }
    socket.send(JSON.stringify({ type: "response.create", ...requestBody }));
    await processResponsesStream(
      startWebSocketOutputOnFirstEvent(
        mapCodexEvents(parseWebSocket(socket, options?.signal)),
        output,
        stream,
        onStart
      ),
      output,
      stream,
      model,
      {
        serviceTier: options?.serviceTier,
        firstEventTimeoutMs: getFirstStreamEventTimeoutMs(options),
        abortFirstEventStream,
        onFirstEventTimeout: getFirstStreamEventTimeoutHandler(options),
        resolveServiceTier: resolveCodexServiceTier,
        applyServiceTierPricing: (usage, serviceTier) => applyServiceTierPricing(usage, serviceTier, model)
      }
    );
    if (options?.signal?.aborted) {
      keepConnection = false;
    } else if (useCachedContext && entry && output.responseId) {
      const responseItems = convertResponsesMessages(
        model,
        { messages: [output] },
        CODEX_TOOL_CALL_PROVIDERS,
        {
          includeSystemPrompt: false,
          replayResponsesItemIds: false
        }
      ).filter((item) => item.type !== "function_call_output");
      entry.continuation = {
        lastRequestBody: fullBody,
        lastResponseId: output.responseId,
        lastResponseItems: responseItems
      };
    }
  } catch (error) {
    if (entry) {
      entry.continuation = void 0;
    }
    keepConnection = false;
    throw error;
  } finally {
    release({ keep: keepConnection });
  }
}
async function readChatGptResponsesErrorTextLimited(response) {
  const reader = response.body?.getReader();
  if (!reader) {
    return "";
  }
  const decoder = new TextDecoder();
  let total = 0;
  let text = "";
  let reachedLimit = false;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      if (!value || value.byteLength === 0) {
        continue;
      }
      const remaining = OPENAI_CHATGPT_RESPONSES_ERROR_BODY_MAX_BYTES - total;
      if (remaining <= 0) {
        reachedLimit = true;
        break;
      }
      const chunk = value.byteLength > remaining ? value.subarray(0, remaining) : value;
      total += chunk.byteLength;
      text += decoder.decode(chunk, { stream: true });
      if (total >= OPENAI_CHATGPT_RESPONSES_ERROR_BODY_MAX_BYTES) {
        reachedLimit = true;
        break;
      }
    }
    if (!reachedLimit) {
      text += decoder.decode();
    }
  } finally {
    if (reachedLimit) {
      await reader.cancel().catch(() => {
      });
    }
    try {
      reader.releaseLock();
    } catch {
    }
  }
  return text;
}
function parseErrorResponseText(raw, status, statusText) {
  let message = raw || statusText || "Request failed";
  let friendlyMessage;
  try {
    const parsed = JSON.parse(raw);
    const err = parsed?.error;
    if (err) {
      const code = err.code || err.type || "";
      if (/usage_limit_reached|usage_not_included|rate_limit_exceeded/i.test(code) || status === 429) {
        const plan = err.plan_type ? ` (${err.plan_type.toLowerCase()} plan)` : "";
        const mins = err.resets_at ? Math.max(0, Math.round((err.resets_at * 1e3 - Date.now()) / 6e4)) : void 0;
        const when = mins !== void 0 ? ` Try again in ~${mins} min.` : "";
        friendlyMessage = `You have hit your ChatGPT usage limit${plan}.${when}`.trim();
      }
      message = err.message || friendlyMessage || message;
    }
  } catch {
  }
  return { message, friendlyMessage };
}
function extractOpenAICodexAccountId(token) {
  const accountId = resolveOpenAICodexAccountId(token);
  if (accountId) {
    return accountId;
  }
  throw new Error("Failed to extract accountId from token");
}
function createCodexRequestId() {
  const crypto = globalThis.crypto;
  if (typeof crypto?.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto?.getRandomValues === "function") {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    const suffix = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return `codex_${suffix}`;
  }
  throw new Error("Secure random request id generation is unavailable");
}
function buildBaseCodexHeaders(initHeaders, additionalHeaders, accountId, token) {
  const headers = new Headers(initHeaders);
  for (const [key, value] of Object.entries(additionalHeaders || {})) {
    headers.set(key, value);
  }
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("chatgpt-account-id", accountId);
  headers.set("originator", "openclaw");
  const userAgent = os ? `openclaw (${os.platform()} ${os.release()}; ${os.arch()})` : "openclaw (browser)";
  headers.set("User-Agent", userAgent);
  return headers;
}
function buildSSEHeaders(initHeaders, additionalHeaders, accountId, token, sessionId) {
  const headers = buildBaseCodexHeaders(initHeaders, additionalHeaders, accountId, token);
  headers.set("OpenAI-Beta", "responses=experimental");
  headers.set("accept", "text/event-stream");
  headers.set("content-type", "application/json");
  if (sessionId) {
    headers.set("session_id", sessionId);
    headers.set("x-client-request-id", sessionId);
  }
  return headers;
}
function buildWebSocketHeaders(initHeaders, additionalHeaders, accountId, token, requestId) {
  const headers = buildBaseCodexHeaders(initHeaders, additionalHeaders, accountId, token);
  headers.delete("accept");
  headers.delete("content-type");
  headers.delete("OpenAI-Beta");
  headers.delete("openai-beta");
  headers.set("OpenAI-Beta", OPENAI_BETA_RESPONSES_WEBSOCKETS);
  headers.set("x-client-request-id", requestId);
  headers.set("session_id", requestId);
  return headers;
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
  closeOpenAICodexWebSocketSessions,
  extractOpenAICodexAccountId,
  parseSSEForTest,
  resetOpenAICodexWebSocketStateForTest,
  streamOpenAICodexResponses,
  streamSimpleOpenAICodexResponses
};
