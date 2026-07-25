var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

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
function applyProviderReportedUsageCost(usage, reportedCost) {
  if (typeof reportedCost !== "number" || !Number.isFinite(reportedCost) || reportedCost < 0) {
    return;
  }
  usage.cost.total = reportedCost;
  usage.cost.totalOrigin = "provider-billed";
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
function modelsAreEqual(a, b) {
  if (!a || !b) {
    return false;
  }
  return a.id === b.id && a.provider === b.provider;
}

// packages/ai/src/session-resources.ts
var sessionResourceCleanups = /* @__PURE__ */ new Set();
function registerSessionResourceCleanup(cleanup) {
  sessionResourceCleanups.add(cleanup);
  return () => {
    sessionResourceCleanups.delete(cleanup);
  };
}
function cleanupSessionResources(sessionId) {
  const errors = [];
  for (const cleanup of sessionResourceCleanups) {
    try {
      cleanup(sessionId);
    } catch (error) {
      errors.push(error);
    }
  }
  if (errors.length > 0) {
    throw new AggregateError(errors, "Failed to cleanup session resources");
  }
}

// packages/ai/src/utils/deferred-event-buffer.ts
function createDeferredEventBuffer(sink, onBufferedEvent) {
  let events = [];
  return {
    push(event) {
      events.push(event);
      onBufferedEvent?.();
    },
    flush() {
      for (const event of events) {
        sink.push(event);
      }
      events = [];
    },
    discard() {
      events = [];
    }
  };
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

// packages/ai/src/utils/headers.ts
function headersToRecord(headers) {
  const result = {};
  for (const [key, value] of headers.entries()) {
    result[key] = value;
  }
  return result;
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

// packages/ai/src/utils/llm-request-activity.ts
var requestActivityListeners = /* @__PURE__ */ new WeakMap();
function notifyLlmRequestActivity(signal) {
  if (!signal) {
    return;
  }
  for (const listener of requestActivityListeners.get(signal) ?? []) {
    listener();
  }
}
function onLlmRequestActivity(signal, listener) {
  const listeners = requestActivityListeners.get(signal) ?? /* @__PURE__ */ new Set();
  listeners.add(listener);
  requestActivityListeners.set(signal, listeners);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      requestActivityListeners.delete(signal);
    }
  };
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

// packages/ai/src/utils/overflow.ts
var CONFIGURED_CONTEXT_SIZE_OVERFLOW_RE = /prompt has [\d,]+ tokens?, but the configured context size is [\d,]+ tokens?/i;
function isConfiguredContextSizeOverflowError(errorMessage) {
  return CONFIGURED_CONTEXT_SIZE_OVERFLOW_RE.test(errorMessage);
}
var OVERFLOW_PATTERNS = [
  /prompt is too long/i,
  // Anthropic token overflow
  /request_too_large/i,
  // Anthropic request byte-size overflow (HTTP 413)
  /input is too long for requested model/i,
  // Amazon Bedrock
  /exceeds the context window/i,
  // OpenAI (Completions & Responses API)
  /exceeds (?:the )?(?:model'?s )?maximum context length(?: of [\d,]+ tokens?|\s*\([\d,]+\))/i,
  // OpenAI-compatible proxies (LiteLLM)
  /input token count.*exceeds the maximum/i,
  // Google (Gemini)
  /maximum prompt length is \d+/i,
  // xAI (Grok)
  /reduce the length of the messages/i,
  // Groq
  /maximum context length is \d+ tokens/i,
  // OpenRouter (all backends)
  /exceeds (?:the )?maximum allowed input length of [\d,]+ tokens?/i,
  // OpenRouter/Poolside
  /input \(\d+ tokens\) is longer than the model'?s context length \(\d+ tokens\)/i,
  // Together AI
  /exceeds the limit of \d+/i,
  // GitHub Copilot
  /exceeds the available context size/i,
  // llama.cpp server
  /greater than the context length/i,
  // LM Studio
  /context window exceeds limit/i,
  // MiniMax
  /exceeded model token limit/i,
  // Kimi For Coding
  /tokens? in request more than max tokens? allowed/i,
  // Z.AI / Zhipu GLM error 1210
  /prompt exceeds max(?:imum)? length/i,
  // Z.AI / Zhipu GLM error 1261
  /too large for model with \d+ maximum context length/i,
  // Mistral
  CONFIGURED_CONTEXT_SIZE_OVERFLOW_RE,
  // DS4 server
  /model_context_window_exceeded/i,
  // z.ai non-standard finish_reason surfaced as error text
  /prompt too long; exceeded (?:max )?context length/i,
  // Ollama explicit overflow error
  /context[_ ]length[_ ]exceeded/i,
  // Generic fallback
  /too many tokens/i,
  // Generic fallback
  /token limit exceeded/i,
  // Generic fallback
  /^4(?:00|13)\s*(?:status code)?\s*\(no body\)/i
  // Cerebras: 400/413 with no body
];
var NON_OVERFLOW_PATTERNS = [
  /^(Throttling error|Service unavailable):/i,
  // AWS Bedrock non-overflow errors (human-readable prefixes from formatBedrockError)
  /rate limit/i,
  // Generic rate limiting
  /too many requests/i
  // Generic HTTP 429 style
];
function resolveContextInputTokens(message) {
  if (message.usage.contextUsage?.state === "available") {
    return message.usage.contextUsage.promptTokens;
  }
  if (message.usage.contextUsage?.state === "unavailable") {
    return void 0;
  }
  return message.usage.input + message.usage.cacheRead;
}
function isContextOverflow(message, contextWindow) {
  if (message.stopReason === "error" && message.errorMessage) {
    const errorMessage = message.errorMessage;
    const isNonOverflow = NON_OVERFLOW_PATTERNS.some((p) => p.test(errorMessage));
    if (!isNonOverflow && OVERFLOW_PATTERNS.some((p) => p.test(errorMessage))) {
      return true;
    }
  }
  if (contextWindow && message.stopReason === "stop") {
    const inputTokens = resolveContextInputTokens(message);
    if (inputTokens !== void 0 && inputTokens > contextWindow) {
      return true;
    }
  }
  if (contextWindow && message.stopReason === "length" && message.usage.output === 0) {
    const inputTokens = resolveContextInputTokens(message);
    if (inputTokens !== void 0 && inputTokens >= contextWindow * 0.99) {
      return true;
    }
  }
  return false;
}

// packages/markdown-core/src/fences.ts
function scanFenceSpans(buffer, state) {
  const spans = [];
  const startsAtLineStart = state?.atLineStart ?? true;
  let open = state?.open ? { ...state.open, start: 0 } : void 0;
  let offset = 0;
  while (offset <= buffer.length) {
    const nextNewline = buffer.indexOf("\n", offset);
    const lineEnd = nextNewline === -1 ? buffer.length : nextNewline;
    const line = buffer.slice(offset, lineEnd).replace(/\r$/, "");
    const match = line.match(/^( {0,3})(`{3,}|~{3,})(.*)$/);
    if (match && (offset > 0 || startsAtLineStart)) {
      const [, indent, marker, trailing] = match;
      if (indent === void 0 || marker === void 0 || trailing === void 0) {
        if (nextNewline === -1) {
          break;
        }
        offset = nextNewline + 1;
        continue;
      }
      const markerChar = marker.charAt(0);
      const markerLen = marker.length;
      if (!open) {
        open = {
          start: offset,
          markerChar,
          markerLen,
          openLine: line,
          marker,
          indent
        };
      } else if (open.markerChar === markerChar && markerLen >= open.markerLen && /^[ \t]*$/.test(trailing)) {
        const end = lineEnd;
        spans.push({
          start: open.start,
          end,
          openLine: open.openLine,
          marker: open.marker,
          indent: open.indent
        });
        open = void 0;
      }
    }
    if (nextNewline === -1) {
      break;
    }
    offset = nextNewline + 1;
  }
  if (open) {
    spans.push({
      start: open.start,
      end: buffer.length,
      openLine: open.openLine,
      marker: open.marker,
      indent: open.indent
    });
  }
  const atLineStart = buffer.length === 0 ? startsAtLineStart : buffer.endsWith("\n");
  const nextState = {
    atLineStart,
    ...open ? {
      open: {
        markerChar: open.markerChar,
        markerLen: open.markerLen,
        openLine: open.openLine,
        marker: open.marker,
        indent: open.indent
      }
    } : {}
  };
  return { spans, state: nextState };
}

// packages/markdown-core/src/code-spans.ts
function createInlineCodeState() {
  return { open: false, ticks: 0 };
}
function buildCodeSpanIndex(text, inlineState, fenceState) {
  const { spans: fenceSpans, state: nextFenceState } = scanFenceSpans(text, fenceState);
  const startState = inlineState ? { open: inlineState.open, ticks: inlineState.ticks } : createInlineCodeState();
  const { spans: inlineSpans, state: nextInlineState } = parseInlineCodeSpans(
    text,
    fenceSpans,
    startState
  );
  return {
    inlineState: nextInlineState,
    fenceState: nextFenceState,
    isInside: (index) => isInsideFenceSpan(index, fenceSpans) || isInsideInlineSpan(index, inlineSpans)
  };
}
function parseInlineCodeSpans(text, fenceSpans, initialState) {
  const spans = [];
  let open = initialState.open;
  let ticks = initialState.ticks;
  let openStart = open ? 0 : -1;
  let i = 0;
  while (i < text.length) {
    const fence = findFenceSpanAtInclusive(fenceSpans, i);
    if (fence) {
      i = fence.end;
      continue;
    }
    if (text[i] !== "`") {
      i += 1;
      continue;
    }
    const runStart = i;
    let runLength = 0;
    while (i < text.length && text[i] === "`") {
      runLength += 1;
      i += 1;
    }
    if (!open) {
      open = true;
      ticks = runLength;
      openStart = runStart;
      continue;
    }
    if (runLength === ticks) {
      spans.push([openStart, i]);
      open = false;
      ticks = 0;
      openStart = -1;
    }
  }
  if (open) {
    spans.push([openStart, text.length]);
  }
  return {
    spans,
    state: { open, ticks }
  };
}
function findFenceSpanAtInclusive(spans, index) {
  return spans.find((span) => index >= span.start && index < span.end);
}
function isInsideFenceSpan(index, spans) {
  return spans.some((span) => index >= span.start && index < span.end);
}
function isInsideInlineSpan(index, spans) {
  return spans.some(([start, end]) => index >= start && index < end);
}

// packages/ai/src/utils/reasoning-tag-text-partitioner.ts
var REASONING_TAG_RE = /<\s*(\/?)\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought|reasoning)|antthinking)\b[^<>]*>/gi;
var REASONING_TAG_NAMES = [
  "think",
  "thinking",
  "thought",
  "reasoning",
  "antthinking",
  "antml:think",
  "antml:thinking",
  "antml:thought",
  "antml:reasoning",
  "mm:think",
  "mm:thinking",
  "mm:thought",
  "mm:reasoning"
];
function createReasoningTagTextPartitioner() {
  let buffer = "";
  let reasoningDepth = 0;
  let strictMode = false;
  let emittedVisibleText = false;
  let inlineCodeState = createInlineCodeState();
  let fenceState;
  let hiddenInlineCodeState = createInlineCodeState();
  let hiddenFenceState;
  let recoverableOpenTagText;
  const consume = (final, recoverFullUnclosed) => {
    const output = [];
    const emit = (kind, text) => {
      if (!text) {
        return;
      }
      if (kind === "text" && text.trim().length > 0) {
        emittedVisibleText = true;
      }
      if (kind === "text") {
        const nextCode = buildCodeSpanIndex(text, inlineCodeState, fenceState);
        inlineCodeState = nextCode.inlineState;
        fenceState = nextCode.fenceState;
      } else {
        const nextCode = buildCodeSpanIndex(text, hiddenInlineCodeState, hiddenFenceState);
        hiddenInlineCodeState = nextCode.inlineState;
        hiddenFenceState = nextCode.fenceState;
      }
      const previous = output[output.length - 1];
      if (previous?.kind === kind) {
        previous.text += text;
        return;
      }
      output.push({ kind, text });
    };
    while (buffer) {
      const activeInlineCodeState = reasoningDepth === 0 ? inlineCodeState : hiddenInlineCodeState;
      const activeFenceState = reasoningDepth === 0 ? fenceState : hiddenFenceState;
      const codeSpans = buildCodeSpanIndex(buffer, activeInlineCodeState, activeFenceState);
      const hasUnclosedCode = reasoningDepth === 0 && Boolean(codeSpans.inlineState.open || codeSpans.fenceState.open);
      const hasRawReasoning = hasRawReasoningTag(buffer);
      const tag = findNextReasoningTag(
        buffer,
        (index) => final && hasUnclosedCode && hasRawReasoning ? false : codeSpans.isInside(index)
      );
      if (!tag) {
        if (final) {
          const recoverAsText = reasoningDepth > 0 && recoverFullUnclosed && !hasRawReasoningCloseTag(buffer);
          const recoveredText = recoverAsText && recoverableOpenTagText ? recoverableOpenTagText + buffer : buffer;
          emit(reasoningDepth > 0 && !recoverAsText ? "thinking" : "text", recoveredText);
          buffer = "";
          reasoningDepth = 0;
          recoverableOpenTagText = void 0;
          return output;
        }
        if (reasoningDepth > 0 && recoverFullUnclosed && (!emittedVisibleText || recoverableOpenTagText)) {
          return output;
        }
        if (hasUnclosedCode && hasRawReasoning) {
          const openCodeIndex = inlineCodeState.open || fenceState?.open ? 0 : findOpenCodeContextStart(buffer);
          if (openCodeIndex !== -1) {
            emit("text", buffer.slice(0, openCodeIndex));
            buffer = buffer.slice(openCodeIndex);
            return output;
          }
        }
        const trailingFenceStart = findTrailingFenceFragmentStart(
          buffer,
          activeInlineCodeState,
          activeFenceState
        );
        if (trailingFenceStart !== -1) {
          emit(reasoningDepth > 0 ? "thinking" : "text", buffer.slice(0, trailingFenceStart));
          buffer = buffer.slice(trailingFenceStart);
          return output;
        }
        const keepFrom = reasoningTagPrefixSuffixIndex(
          buffer,
          (index) => codeSpans.isInside(index)
        );
        if (keepFrom === -1) {
          emit(reasoningDepth > 0 ? "thinking" : "text", buffer);
          buffer = "";
          return output;
        }
        if (reasoningDepth === 0 && keepFrom > 0 && buffer.slice(0, keepFrom).trim().length > 0 && isReasoningCloseTagPrefix(buffer.slice(keepFrom))) {
          return output;
        }
        if (keepFrom > 0) {
          emit(reasoningDepth > 0 ? "thinking" : "text", buffer.slice(0, keepFrom));
          buffer = buffer.slice(keepFrom);
        }
        return output;
      }
      const beforeTag = buffer.slice(0, tag.index);
      const afterTag = buffer.slice(tag.index + tag.text.length);
      if (tag.isClose && reasoningDepth === 0) {
        if (recoverFullUnclosed && beforeTag.trim().length > 0 && afterTag.trim().length > 0) {
          emit("text", beforeTag + tag.text);
          buffer = afterTag;
          continue;
        }
        if (beforeTag.trim().length > 0 && afterTag.trim().length === 0 && !final) {
          return output;
        }
        if (beforeTag.trim().length === 0 || afterTag.trim().length === 0) {
          emit("text", beforeTag);
        }
        buffer = afterTag;
        continue;
      }
      emit(reasoningDepth > 0 ? "thinking" : "text", buffer.slice(0, tag.index));
      buffer = afterTag;
      if (tag.isClose) {
        reasoningDepth = Math.max(0, reasoningDepth - 1);
        if (reasoningDepth === 0) {
          recoverableOpenTagText = void 0;
          hiddenInlineCodeState = createInlineCodeState();
          hiddenFenceState = void 0;
        }
      } else {
        if (reasoningDepth === 0) {
          recoverableOpenTagText = recoverFullUnclosed && emittedVisibleText ? tag.text : void 0;
          hiddenInlineCodeState = createInlineCodeState();
          hiddenFenceState = void 0;
        }
        reasoningDepth += 1;
      }
    }
    return output;
  };
  return {
    markStrict() {
      strictMode = true;
    },
    push(chunk) {
      strictMode = true;
      buffer += chunk;
      return consume(false, false);
    },
    pushVisible(chunk) {
      buffer += chunk;
      return consume(false, true);
    },
    flush() {
      return consume(true, !strictMode);
    },
    hasPending() {
      return buffer.length > 0 || reasoningDepth > 0;
    },
    isInsideReasoning() {
      return reasoningDepth > 0;
    }
  };
}
function hasRawReasoningTag(text) {
  REASONING_TAG_RE.lastIndex = 0;
  return REASONING_TAG_RE.test(text);
}
function hasRawReasoningCloseTag(text) {
  REASONING_TAG_RE.lastIndex = 0;
  for (; ; ) {
    const match = REASONING_TAG_RE.exec(text);
    if (!match) {
      return false;
    }
    if (match[1] === "/") {
      return true;
    }
  }
}
function findNextReasoningTag(text, isIndexInsideCode) {
  REASONING_TAG_RE.lastIndex = 0;
  for (; ; ) {
    const match = REASONING_TAG_RE.exec(text);
    if (!match) {
      return null;
    }
    if (!isIndexInsideCode(match.index)) {
      return {
        index: match.index,
        text: match[0],
        isClose: match[1] === "/"
      };
    }
  }
}
function reasoningTagPrefixSuffixIndex(text, isIndexInsideCode) {
  for (let index = text.lastIndexOf("<"); index >= 0; ) {
    if (!isIndexInsideCode(index) && isReasoningTagPrefix(text.slice(index))) {
      return index;
    }
    if (index === 0) {
      break;
    }
    index = text.lastIndexOf("<", index - 1);
  }
  return -1;
}
function isReasoningTagPrefix(text) {
  const name = normalizeReasoningTagPrefixName(text);
  return REASONING_TAG_NAMES.some((tagName) => {
    if (tagName.startsWith(name)) {
      return true;
    }
    if (!name.startsWith(tagName)) {
      return false;
    }
    const rest = name.slice(tagName.length);
    return rest.length === 0 || /^[\s/>]/.test(rest);
  });
}
function isReasoningCloseTagPrefix(text) {
  const normalized = text.replace(/^<\s*/, "<").replace(/^<\s*\//, "</").replace(/^<\/\s*/, "</").toLowerCase();
  return normalized.startsWith("</") && isReasoningTagPrefix(text);
}
function normalizeReasoningTagPrefixName(text) {
  const normalized = text.replace(/^<\s*/, "<").replace(/^<\s*\//, "</").replace(/^<\/\s*/, "</").toLowerCase();
  const rawName = normalized.startsWith("</") ? normalized.slice(2) : normalized.slice(1);
  return rawName.trimStart();
}
function findOpenCodeContextStart(text) {
  const fence = findOpenFenceStart(text);
  const inline = findOpenInlineCodeStart(text);
  if (fence === -1) {
    return inline;
  }
  if (inline === -1) {
    return fence;
  }
  return Math.min(fence, inline);
}
function findOpenInlineCodeStart(text) {
  let openStart = -1;
  let openTicks = 0;
  let index = 0;
  while (index < text.length) {
    if (text.charAt(index) !== "`") {
      index += 1;
      continue;
    }
    const runStart = index;
    let runLength = 0;
    while (index < text.length && text.charAt(index) === "`") {
      runLength += 1;
      index += 1;
    }
    if (openStart === -1) {
      openStart = runStart;
      openTicks = runLength;
    } else if (runLength === openTicks) {
      openStart = -1;
      openTicks = 0;
    }
  }
  return openStart;
}
function findOpenFenceStart(text) {
  const fenceRe = /(^|\n)(```|~~~)[^\n]*(?:\n|$)/g;
  let open = null;
  for (const match of text.matchAll(fenceRe)) {
    const prefix = match.at(1);
    const marker = match.at(2);
    if (prefix === void 0 || marker === void 0) {
      continue;
    }
    const index = (match.index ?? 0) + prefix.length;
    if (open !== null && open.marker === marker) {
      open = null;
    } else if (!open) {
      open = { marker, index };
    }
  }
  return open?.index ?? -1;
}
function findTrailingFenceFragmentStart(text, inlineState, fenceState) {
  if (inlineState.open || fenceState?.open) {
    return -1;
  }
  const lineStart = Math.max(text.lastIndexOf("\n") + 1, 0);
  const line = text.slice(lineStart);
  const match = line.match(/^( {0,3})(`{1,2}|~{1,2})$/);
  return match ? lineStart : -1;
}

// packages/ai/src/utils/sanitize-unicode.ts
function sanitizeSurrogates(text) {
  return text.replace(
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
    ""
  );
}

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
function withFirstStreamEventTimeout(stream2, context) {
  const timeoutMs = clampTimerTimeoutMs(context.timeoutMs);
  if (timeoutMs === void 0 || context.timeoutMs <= 0) {
    return stream2;
  }
  const timeoutContext = { ...context, timeoutMs };
  return {
    async *[Symbol.asyncIterator]() {
      const iterator = stream2[Symbol.asyncIterator]();
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
export {
  applyProviderReportedUsageCost,
  calculateCost,
  clampThinkingLevel,
  cleanupSessionResources,
  clearApiProviders,
  complete,
  completeSimple,
  createDeferredEventBuffer,
  createFirstStreamEventAbortController,
  createFirstStreamEventTimeoutError,
  createReasoningTagTextPartitioner,
  createSseByteGuard,
  decodeOpenAICodexJwtPayload,
  defaultApiRegistry,
  defaultLlmRuntime,
  findEnvKeys,
  getApiProvider,
  getApiProviders,
  getEnvApiKey,
  getFirstStreamEventTimeoutHandler,
  getFirstStreamEventTimeoutMs,
  getSupportedThinkingLevels,
  headersToRecord,
  isConfiguredContextSizeOverflowError,
  isContextOverflow,
  modelsAreEqual,
  notifyLlmRequestActivity,
  onLlmRequestActivity,
  parseJsonWithRepair,
  parseStreamingJson,
  registerSessionResourceCleanup,
  repairJson,
  resolveOpenAICodexAccountId,
  sanitizeSurrogates,
  shortHash,
  stream,
  streamSimple,
  withFirstStreamEventTimeout
};
