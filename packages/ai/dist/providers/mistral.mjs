var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// packages/ai/src/providers/mistral.ts
import { randomUUID } from "node:crypto";
import { HTTPClient, Mistral } from "@mistralai/mistralai";

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

// packages/ai/src/utils/sanitize-unicode.ts
function sanitizeSurrogates(text) {
  return text.replace(
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
    ""
  );
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

// packages/ai/src/utils/system-prompt-cache-boundary.ts
var SYSTEM_PROMPT_CACHE_BOUNDARY = "\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n";
function stripSystemPromptCacheBoundary(text) {
  return text.replaceAll(SYSTEM_PROMPT_CACHE_BOUNDARY, "\n");
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
function clampMaxTokensToModel(model, requestedMaxTokens) {
  return requestedMaxTokens === void 0 ? void 0 : Math.max(1, Math.min(requestedMaxTokens, model.maxTokens));
}

// packages/normalization-core/src/record-coerce.ts
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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
function normalizeModelId(modelId) {
  const normalized = normalizeLowercaseStringOrEmpty(modelId);
  const unprefixed = normalized.startsWith("anthropic/") ? normalized.slice("anthropic/".length) : normalized;
  return unprefixed.replace(/[._\s]+/g, "-");
}
function normalizeApi(api) {
  const normalized = normalizeLowercaseStringOrEmpty(api);
  return normalized === "openclaw-anthropic-messages-transport" ? "anthropic-messages" : normalized;
}
function hasConcreteResponseModel(ref) {
  const responseModelId = normalizeModelId(ref.responseModelId);
  return responseModelId.length > 0 && responseModelId !== normalizeModelId(ref.modelId);
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
  const sameRoute = normalizeLowercaseStringOrEmpty(params.source.provider) === normalizeLowercaseStringOrEmpty(params.target.provider) && sourceApi === targetApi && normalizeModelId(params.source.modelId) === normalizeModelId(params.target.modelId);
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

// packages/ai/src/providers/mistral.ts
var MISTRAL_TOOL_CALL_ID_LENGTH = 9;
var MAX_MISTRAL_ERROR_BODY_CHARS = 4e3;
var MISTRAL_STREAM_BODY_MAX_BYTES = 16 * 1024 * 1024;
function createBoundedMistralFetcher(maxBytes = MISTRAL_STREAM_BODY_MAX_BYTES, upstreamFetch = fetch) {
  return async (input, init) => {
    const response = init == null ? await upstreamFetch(input) : await upstreamFetch(input, init);
    if (!response.body || typeof response.body.getReader !== "function") {
      return response;
    }
    const reader = response.body.getReader();
    const guard = createSseByteGuard(reader, {
      maxBytes,
      onOverflow: ({ size, maxBytes: cap }) => new Error(`mistral: stream body exceeds ${cap} bytes (got ${size})`)
    });
    const guardedStream = new ReadableStream({
      async pull(controller) {
        const { done, value } = await guard.read();
        if (done) {
          controller.close();
          return;
        }
        controller.enqueue(value);
      },
      async cancel(reason) {
        await guard.cancel(reason);
      }
    });
    return new Response(guardedStream, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  };
}
var streamMistral = (model, context, options) => {
  const stream = new AssistantMessageEventStream();
  void (async () => {
    const output = createOutput(model);
    try {
      const apiKey = options?.apiKey || getEnvApiKey(model.provider);
      if (!apiKey) {
        throw new Error(`No API key for provider: ${model.provider}`);
      }
      const mistral = new Mistral({
        apiKey,
        serverURL: model.baseUrl,
        // Bound the streamed Mistral response body at 16 MiB so a hostile or
        // malfunctioning endpoint cannot exhaust memory. The fetcher is
        // injected via the SDK's `HTTPClient` (see
        // `@mistralai/mistralai/lib/sdks.ts` `ClientSDK` constructor: when
        // `httpClient` is passed, `ClientSDK.#httpClient` is set from it and
        // every `chat.stream` / `complete` call routes through
        // `HTTPClient.request` → `this.fetcher(req)`).
        // Mistral accepts HTTPClient.fetcher, so compose guarded egress with the byte cap.
        httpClient: new HTTPClient({
          fetcher: createBoundedMistralFetcher(
            MISTRAL_STREAM_BODY_MAX_BYTES,
            getAiTransportHost().buildModelFetch(model) ?? fetch
          )
        })
      });
      const normalizeMistralToolCallId = createMistralToolCallIdNormalizer();
      const transformedMessages = transformMessages(
        context.messages,
        model,
        (id) => normalizeMistralToolCallId(id)
      );
      let payload = buildChatPayload(model, context, transformedMessages, options);
      const nextPayload = await options?.onPayload?.(payload, model);
      if (nextPayload !== void 0) {
        payload = nextPayload;
      }
      const headers = { ...model.headers, ...options?.headers };
      if (resolveMistralPromptCacheKey(options) && options?.sessionId) {
        headers["x-affinity"] ||= options.sessionId;
      }
      const mistralStream = await mistral.chat.stream(payload, {
        headers,
        signal: options?.signal
      });
      stream.push({ type: "start", partial: output });
      await consumeChatStream(model, output, stream, mistralStream);
      if (options?.signal?.aborted) {
        throw new Error("Request was aborted");
      }
      if (output.stopReason === "aborted" || output.stopReason === "error") {
        throw new Error("An unknown error occurred");
      }
      stream.push({ type: "done", reason: output.stopReason, message: output });
      stream.end();
    } catch (error) {
      for (const block of output.content) {
        delete block.partialArgs;
      }
      output.stopReason = options?.signal?.aborted ? "aborted" : "error";
      output.errorMessage = formatMistralError(error);
      stream.push({ type: "error", reason: output.stopReason, error: output });
      stream.end();
    }
  })();
  return stream;
};
var streamSimpleMistral = (model, context, options) => {
  const apiKey = options?.apiKey || getEnvApiKey(model.provider);
  if (!apiKey) {
    throw new Error(`No API key for provider: ${model.provider}`);
  }
  const base = {
    ...buildBaseOptions(model, options, apiKey),
    maxTokens: clampMaxTokensToModel(model, options?.maxTokens)
  };
  const clampedReasoning = options?.reasoning ? clampThinkingLevel(model, options.reasoning) : void 0;
  const reasoning = clampedReasoning === "off" ? void 0 : clampedReasoning;
  const shouldUseReasoning = model.reasoning && reasoning !== void 0;
  return streamMistral(model, context, {
    ...base,
    promptMode: shouldUseReasoning && usesPromptModeReasoning(model) ? "reasoning" : void 0,
    reasoningEffort: shouldUseReasoning && usesReasoningEffort(model) ? mapReasoningEffort(model, reasoning) : void 0
  });
};
function createOutput(model) {
  return {
    role: "assistant",
    content: [],
    api: model.api,
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
}
function createMistralToolCallIdNormalizer() {
  const idMap = /* @__PURE__ */ new Map();
  const reverseMap = /* @__PURE__ */ new Map();
  return (id) => {
    const existing = idMap.get(id);
    if (existing) {
      return existing;
    }
    let attempt = 0;
    while (true) {
      const candidate = deriveMistralToolCallId(id, attempt);
      const owner = reverseMap.get(candidate);
      if (!owner || owner === id) {
        idMap.set(id, candidate);
        reverseMap.set(candidate, id);
        return candidate;
      }
      attempt++;
    }
  };
}
function deriveMistralToolCallId(id, attempt) {
  const normalized = id.replace(/[^a-zA-Z0-9]/g, "");
  if (attempt === 0 && normalized.length === MISTRAL_TOOL_CALL_ID_LENGTH) {
    return normalized;
  }
  const seedBase = normalized || id;
  const seed = attempt === 0 ? seedBase : `${seedBase}:${attempt}`;
  return shortHash(seed).replace(/[^a-zA-Z0-9]/g, "").padEnd(MISTRAL_TOOL_CALL_ID_LENGTH, "0").slice(0, MISTRAL_TOOL_CALL_ID_LENGTH);
}
function formatMistralError(error) {
  if (error instanceof Error) {
    const sdkError = error;
    const statusCode = typeof sdkError.statusCode === "number" ? sdkError.statusCode : void 0;
    const bodyText = typeof sdkError.body === "string" ? sdkError.body.trim() : void 0;
    if (statusCode !== void 0 && bodyText) {
      return `Mistral API error (${statusCode}): ${truncateErrorText(bodyText, MAX_MISTRAL_ERROR_BODY_CHARS)}`;
    }
    if (statusCode !== void 0) {
      return `Mistral API error (${statusCode}): ${error.message}`;
    }
    return error.message;
  }
  return safeJsonStringify(error);
}
function truncateErrorText(text, maxChars) {
  if (text.length <= maxChars) {
    return text;
  }
  const truncated = truncateUtf16Safe(text, maxChars);
  return `${truncated}... [truncated ${text.length - truncated.length} chars]`;
}
function safeJsonStringify(value) {
  try {
    const serialized = JSON.stringify(value);
    return serialized === void 0 ? String(value) : serialized;
  } catch {
    return String(value);
  }
}
function buildChatPayload(model, context, messages, options) {
  const payload = {
    model: model.id,
    stream: true,
    messages: toChatMessages(messages, model.input.includes("image"))
  };
  let convertedToolNames;
  if (context.tools?.length) {
    const tools = toFunctionTools(context.tools);
    convertedToolNames = new Set(tools.map((tool) => tool.function.name));
    if (tools.length > 0) {
      payload.tools = tools;
    }
  }
  if (options?.temperature !== void 0) {
    payload.temperature = options.temperature;
  }
  if (options?.maxTokens !== void 0) {
    payload.maxTokens = options.maxTokens;
  }
  if (options?.stop !== void 0 && options.stop.length > 0) {
    payload.stop = options.stop;
  }
  if (options?.toolChoice) {
    const toolChoice = mapToolChoice(options.toolChoice, convertedToolNames);
    if (toolChoice) {
      payload.toolChoice = toolChoice;
    }
  }
  if (options?.promptMode) {
    payload.promptMode = options.promptMode;
  }
  if (options?.reasoningEffort) {
    payload.reasoningEffort = options.reasoningEffort;
  }
  const promptCacheKey = resolveMistralPromptCacheKey(options);
  if (promptCacheKey) {
    payload.promptCacheKey = promptCacheKey;
  }
  if (context.systemPrompt) {
    payload.messages.unshift({
      role: "system",
      content: sanitizeSurrogates(stripSystemPromptCacheBoundary(context.systemPrompt))
    });
  }
  return payload;
}
function resolveMistralPromptCacheKey(options) {
  if (options?.cacheRetention === "none") {
    return void 0;
  }
  return options?.promptCacheKey?.trim() || options?.sessionId?.trim() || void 0;
}
function readMistralCachedPromptTokens(usage, promptTokens) {
  const record = usage;
  const rawCachedTokens = record.promptTokensDetails?.cachedTokens ?? record.prompt_tokens_details?.cached_tokens ?? record.cachedTokens ?? record.cached_tokens;
  const cachedTokens = typeof rawCachedTokens === "number" && Number.isFinite(rawCachedTokens) ? rawCachedTokens : 0;
  return Math.min(promptTokens, Math.max(0, cachedTokens));
}
async function consumeChatStream(model, output, stream, mistralStream) {
  let currentBlock = null;
  const blocks = output.content;
  const blockIndex = () => blocks.length - 1;
  const toolBlockIdentities = /* @__PURE__ */ new Map();
  const normalizeMissingToolCallId = createMistralToolCallIdNormalizer();
  const missingToolCallIdScope = randomUUID();
  const createMissingToolCallId = (contentIndex) => normalizeMissingToolCallId(`${missingToolCallIdScope}:toolcall:${contentIndex}`);
  const findIdentityCandidates = (matches, excludedContentIndexes) => {
    const candidates = /* @__PURE__ */ new Set();
    for (const [contentIndex, identity] of toolBlockIdentities) {
      if (!excludedContentIndexes?.has(contentIndex) && matches(identity)) {
        candidates.add(contentIndex);
      }
    }
    return candidates;
  };
  const intersectCandidates = (left, right) => new Set([...left].filter((contentIndex) => right.has(contentIndex)));
  const requireSingleCandidate = (candidates) => {
    if (candidates.size > 1) {
      throw new Error(
        "Mistral streamed tool-call continuation is ambiguous; refusing to merge arguments"
      );
    }
    return candidates.values().next().value;
  };
  const requireExistingCandidate = (candidates) => {
    const candidate = requireSingleCandidate(candidates);
    if (candidate === void 0) {
      throw new Error(
        "Mistral streamed tool-call identities conflict; refusing to merge arguments"
      );
    }
    return candidate;
  };
  const resolveToolBlockIndex = (params) => {
    const explicitId = params.explicitId;
    const functionName = params.functionName;
    const toolCallIndex = params.index;
    const idCandidates = explicitId ? findIdentityCandidates(
      (identity) => identity.explicitIds.has(explicitId),
      params.usedContentIndexes
    ) : /* @__PURE__ */ new Set();
    const nameCandidates = functionName ? findIdentityCandidates(
      (identity) => identity.functionNames.has(functionName),
      params.usedContentIndexes
    ) : /* @__PURE__ */ new Set();
    const indexCandidates = toolCallIndex === void 0 ? /* @__PURE__ */ new Set() : findIdentityCandidates(
      (identity) => identity.indexes.has(toolCallIndex),
      params.usedContentIndexes
    );
    if (idCandidates.size > 0) {
      let candidates = idCandidates;
      if (nameCandidates.size > 0) {
        candidates = intersectCandidates(candidates, nameCandidates);
      }
      return requireExistingCandidate(candidates);
    }
    if (nameCandidates.size > 0) {
      const idCompatibleCandidates = new Set(
        [...nameCandidates].filter((contentIndex) => {
          const identity = toolBlockIdentities.get(contentIndex);
          if (!identity) {
            return false;
          }
          return !explicitId || identity.explicitIds.size === 0;
        })
      );
      if (idCompatibleCandidates.size <= 1 && (toolCallIndex === void 0 || toolCallIndex === 0)) {
        return requireSingleCandidate(idCompatibleCandidates);
      }
      const indexCompatibleCandidates = new Set(
        [...idCompatibleCandidates].filter((contentIndex) => {
          const identity = toolBlockIdentities.get(contentIndex);
          if (!identity) {
            return false;
          }
          return toolCallIndex === void 0 || identity.indexes.size === 0 || identity.indexes.has(toolCallIndex);
        })
      );
      if (indexCompatibleCandidates.size === 0) {
        return void 0;
      }
      return requireSingleCandidate(indexCompatibleCandidates);
    }
    if (functionName) {
      const namelessCandidates = new Set(
        [...indexCandidates].filter((contentIndex) => {
          const identity = toolBlockIdentities.get(contentIndex);
          return identity?.functionNames.size === 0 && (!explicitId || identity.explicitIds.size === 0);
        })
      );
      return requireSingleCandidate(namelessCandidates);
    }
    if (explicitId) {
      const idlessCandidates = new Set(
        [...indexCandidates].filter(
          (contentIndex) => toolBlockIdentities.get(contentIndex)?.explicitIds.size === 0
        )
      );
      return requireSingleCandidate(idlessCandidates);
    }
    return requireSingleCandidate(indexCandidates);
  };
  const finishCurrentBlock = (block) => {
    if (!block) {
      return;
    }
    if (block.type === "text") {
      stream.push({
        type: "text_end",
        contentIndex: blockIndex(),
        content: block.text,
        partial: output
      });
      return;
    }
    if (block.type === "thinking") {
      stream.push({
        type: "thinking_end",
        contentIndex: blockIndex(),
        content: block.thinking,
        partial: output
      });
    }
  };
  for await (const event of mistralStream) {
    const chunk = event.data;
    output.responseId ||= chunk.id;
    if (chunk.usage) {
      const promptTokens = chunk.usage.promptTokens || 0;
      const cachedPromptTokens = readMistralCachedPromptTokens(chunk.usage, promptTokens);
      output.usage.input = Math.max(0, promptTokens - cachedPromptTokens);
      output.usage.output = chunk.usage.completionTokens || 0;
      output.usage.cacheRead = cachedPromptTokens;
      output.usage.cacheWrite = 0;
      output.usage.totalTokens = chunk.usage.totalTokens || output.usage.input + output.usage.output + output.usage.cacheRead;
      calculateCost(model, output.usage);
    }
    const choice = chunk.choices[0];
    if (!choice) {
      continue;
    }
    if (choice.finishReason) {
      output.stopReason = mapChatStopReason(choice.finishReason);
    }
    const delta = choice.delta;
    if (delta.content !== null && delta.content !== void 0) {
      const contentItems = typeof delta.content === "string" ? [delta.content] : delta.content;
      for (const item of contentItems) {
        if (typeof item === "string") {
          const textDelta = sanitizeSurrogates(item);
          if (!currentBlock || currentBlock.type !== "text") {
            finishCurrentBlock(currentBlock);
            currentBlock = { type: "text", text: "" };
            output.content.push(currentBlock);
            stream.push({ type: "text_start", contentIndex: blockIndex(), partial: output });
          }
          currentBlock.text += textDelta;
          stream.push({
            type: "text_delta",
            contentIndex: blockIndex(),
            delta: textDelta,
            partial: output
          });
          continue;
        }
        if (item.type === "thinking") {
          const deltaText = item.thinking.map((part) => "text" in part ? part.text : "").filter((text) => text.length > 0).join("");
          const thinkingDelta = sanitizeSurrogates(deltaText);
          if (!thinkingDelta) {
            continue;
          }
          if (!currentBlock || currentBlock.type !== "thinking") {
            finishCurrentBlock(currentBlock);
            currentBlock = { type: "thinking", thinking: "" };
            output.content.push(currentBlock);
            stream.push({ type: "thinking_start", contentIndex: blockIndex(), partial: output });
          }
          currentBlock.thinking += thinkingDelta;
          stream.push({
            type: "thinking_delta",
            contentIndex: blockIndex(),
            delta: thinkingDelta,
            partial: output
          });
          continue;
        }
        if (item.type === "text") {
          const textDelta = sanitizeSurrogates(item.text);
          if (!currentBlock || currentBlock.type !== "text") {
            finishCurrentBlock(currentBlock);
            currentBlock = { type: "text", text: "" };
            output.content.push(currentBlock);
            stream.push({ type: "text_start", contentIndex: blockIndex(), partial: output });
          }
          currentBlock.text += textDelta;
          stream.push({
            type: "text_delta",
            contentIndex: blockIndex(),
            delta: textDelta,
            partial: output
          });
        }
      }
    }
    const toolCalls = delta.toolCalls || [];
    const usedToolBlockIndexes = /* @__PURE__ */ new Set();
    for (const toolCall of toolCalls) {
      if (currentBlock) {
        finishCurrentBlock(currentBlock);
        currentBlock = null;
      }
      const toolCallIndex = typeof toolCall.index === "number" && Number.isInteger(toolCall.index) ? toolCall.index : void 0;
      const providedCallId = toolCall.id && toolCall.id !== "null" ? toolCall.id : void 0;
      const functionName = toolCall.function.name.trim() || void 0;
      const existingIndex = resolveToolBlockIndex({
        explicitId: providedCallId,
        functionName,
        index: toolCallIndex,
        usedContentIndexes: usedToolBlockIndexes
      });
      let block;
      if (existingIndex !== void 0) {
        const existing = output.content[existingIndex];
        if (existing?.type === "toolCall") {
          block = existing;
        }
      }
      if (!block) {
        const contentIndex2 = output.content.length;
        block = {
          type: "toolCall",
          id: providedCallId ?? createMissingToolCallId(contentIndex2),
          name: functionName ?? "",
          arguments: {},
          partialArgs: ""
        };
        output.content.push(block);
        toolBlockIdentities.set(contentIndex2, {
          explicitIds: new Set(providedCallId ? [providedCallId] : []),
          functionNames: new Set(functionName ? [functionName] : []),
          indexes: new Set(toolCallIndex === void 0 ? [] : [toolCallIndex])
        });
        stream.push({
          type: "toolcall_start",
          contentIndex: contentIndex2,
          partial: output
        });
      }
      const contentIndex = output.content.indexOf(block);
      const identity = toolBlockIdentities.get(contentIndex);
      if (!identity) {
        throw new Error("Mistral streamed tool-call identity is missing");
      }
      usedToolBlockIndexes.add(contentIndex);
      if (providedCallId) {
        block.id = providedCallId;
        identity.explicitIds.add(providedCallId);
      }
      if (functionName) {
        if (identity.functionNames.size > 0 && !identity.functionNames.has(functionName)) {
          throw new Error(
            "Mistral streamed tool-call continuation changed function name; refusing to merge arguments"
          );
        }
        block.name = functionName;
        identity.functionNames.add(functionName);
      }
      if (toolCallIndex !== void 0) {
        identity.indexes.add(toolCallIndex);
      }
      const argsDelta = typeof toolCall.function.arguments === "string" ? toolCall.function.arguments : JSON.stringify(toolCall.function.arguments || {});
      block.partialArgs = (block.partialArgs || "") + argsDelta;
      block.arguments = parseStreamingJson(block.partialArgs);
      stream.push({
        type: "toolcall_delta",
        contentIndex,
        delta: argsDelta,
        partial: output
      });
    }
  }
  finishCurrentBlock(currentBlock);
  for (const index of toolBlockIdentities.keys()) {
    const block = output.content.at(index);
    if (block?.type !== "toolCall") {
      continue;
    }
    const toolBlock = block;
    delete toolBlock.partialArgs;
    stream.push({
      type: "toolcall_end",
      contentIndex: index,
      toolCall: toolBlock,
      partial: output
    });
  }
}
function toFunctionTools(tools) {
  return tools.flatMap((tool) => {
    try {
      return {
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: stripSymbolKeys(tool.parameters),
          strict: false
        }
      };
    } catch {
      return [];
    }
  });
}
function stripSymbolKeys(value) {
  if (Array.isArray(value)) {
    return value.map((item) => stripSymbolKeys(item));
  }
  if (value && typeof value === "object") {
    const result = {};
    for (const [key, entry] of Object.entries(value)) {
      result[key] = stripSymbolKeys(entry);
    }
    return result;
  }
  return value;
}
function toChatMessages(messages, supportsImages) {
  const result = [];
  for (const msg of messages) {
    if (msg.role === "user") {
      if (typeof msg.content === "string") {
        result.push({ role: "user", content: sanitizeSurrogates(msg.content) });
        continue;
      }
      const hadImages = msg.content.some((item) => item.type === "image");
      const content = msg.content.filter((item) => item.type === "text" || supportsImages).map((item) => {
        if (item.type === "text") {
          return { type: "text", text: sanitizeSurrogates(item.text) };
        }
        return { type: "image_url", imageUrl: `data:${item.mimeType};base64,${item.data}` };
      });
      if (content.length > 0) {
        result.push({ role: "user", content });
        continue;
      }
      if (hadImages && !supportsImages) {
        result.push({ role: "user", content: "(image omitted: model does not support images)" });
      }
      continue;
    }
    if (msg.role === "assistant") {
      const contentParts = [];
      const toolCalls = [];
      for (const block of msg.content) {
        if (block.type === "text") {
          if (block.text.trim().length > 0) {
            contentParts.push({ type: "text", text: sanitizeSurrogates(block.text) });
          }
          continue;
        }
        if (block.type === "thinking") {
          if (block.thinking.trim().length > 0) {
            contentParts.push({
              type: "thinking",
              thinking: [{ type: "text", text: sanitizeSurrogates(block.thinking) }]
            });
          }
          continue;
        }
        toolCalls.push({
          id: block.id,
          type: "function",
          function: { name: block.name, arguments: JSON.stringify(block.arguments || {}) }
        });
      }
      const assistantMessage = { role: "assistant" };
      if (contentParts.length > 0) {
        assistantMessage.content = contentParts;
      }
      if (toolCalls.length > 0) {
        assistantMessage.toolCalls = toolCalls;
      }
      if (contentParts.length > 0 || toolCalls.length > 0) {
        result.push(assistantMessage);
      }
      continue;
    }
    const toolContent = [];
    const textResult = extractToolResultText(msg.content);
    const mediaPlaceholder = describeToolResultMediaPlaceholder(msg.content);
    const hasImages = msg.content.some(isImageWithMediaPayload);
    const toolText = buildToolResultText(
      textResult,
      mediaPlaceholder,
      hasImages,
      supportsImages,
      msg.isError
    );
    toolContent.push({ type: "text", text: toolText });
    for (const part of msg.content) {
      if (!supportsImages) {
        continue;
      }
      if (!isImageWithMediaPayload(part)) {
        continue;
      }
      toolContent.push({
        type: "image_url",
        imageUrl: `data:${part.mimeType};base64,${part.data}`
      });
    }
    result.push({
      role: "tool",
      toolCallId: msg.toolCallId,
      name: msg.toolName,
      content: toolContent
    });
  }
  return result;
}
function buildToolResultText(text, mediaPlaceholder, hasImages, supportsImages, isError) {
  const trimmed = text.trim();
  const errorPrefix = isError ? "[tool error] " : "";
  if (trimmed.length > 0) {
    const imageSuffix = hasImages && !supportsImages ? "\n[tool image omitted: model does not support images]" : "";
    return `${errorPrefix}${trimmed}${imageSuffix}`;
  }
  if (mediaPlaceholder) {
    if (!hasImages || supportsImages) {
      return `${errorPrefix}${mediaPlaceholder}`;
    }
    const omitted = mediaPlaceholder === "(see attached media)" ? "(media omitted: model does not support images)" : "(image omitted: model does not support images)";
    return `${errorPrefix}${omitted}`;
  }
  return isError ? "[tool error] (no tool output)" : "(no tool output)";
}
function usesReasoningEffort(model) {
  return model.id === "mistral-small-2603" || model.id === "mistral-small-latest" || model.id === "mistral-medium-3-5";
}
function usesPromptModeReasoning(model) {
  return model.reasoning && !usesReasoningEffort(model);
}
function mapReasoningEffort(model, level) {
  return model.thinkingLevelMap?.[level] ?? "high";
}
function mapToolChoice(choice, convertedToolNames) {
  if (!choice) {
    return void 0;
  }
  if (convertedToolNames && convertedToolNames.size === 0) {
    if (choice === "none" || choice === "auto") {
      return choice === "none" ? "none" : void 0;
    }
    throw new Error("Mistral tool_choice requires a tool, but no tools survived schema conversion");
  }
  if (choice === "auto" || choice === "none" || choice === "any" || choice === "required") {
    return choice;
  }
  const toolName = choice.function.name;
  if (convertedToolNames && !convertedToolNames.has(toolName)) {
    throw new Error(
      `Mistral tool_choice requested unavailable tool "${toolName}" after schema conversion`
    );
  }
  return {
    type: "function",
    function: { name: toolName }
  };
}
function mapChatStopReason(reason) {
  if (reason === null) {
    return "stop";
  }
  switch (reason) {
    case "stop":
      return "stop";
    case "length":
    case "model_length":
      return "length";
    case "tool_calls":
      return "toolUse";
    case "error":
      return "error";
    default:
      return "stop";
  }
}
export {
  createBoundedMistralFetcher,
  streamMistral,
  streamSimpleMistral
};
