var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// packages/ai/src/providers/anthropic.ts
import Anthropic from "@anthropic-ai/sdk";
import { Stream } from "@anthropic-ai/sdk/core/streaming.js";

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
function supportsClaudeAdaptiveThinking(ref) {
  const modelId = resolveClaudeModelIdentity(ref);
  return /(?:^|-)claude-(?:fable-5|mythos-(?:5|preview)|opus-4-(?:6|7|8)|sonnet-(?:5|4-6))(?=$|[^a-z0-9])/.test(
    modelId
  );
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
function requiresClaudeDefaultSampling(ref) {
  const modelId = resolveClaudeModelIdentity(ref);
  return supportsClaudeNativeXhighEffort(ref) || /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(modelId);
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

// packages/ai/src/utils/sanitize-unicode.ts
function sanitizeSurrogates(text) {
  return text.replace(
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
    ""
  );
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
function splitSystemPromptCacheBoundary(text) {
  const boundaryIndex = text.indexOf(SYSTEM_PROMPT_CACHE_BOUNDARY);
  if (boundaryIndex === -1) {
    return void 0;
  }
  return {
    stablePrefix: text.slice(0, boundaryIndex).trimEnd(),
    dynamicSuffix: text.slice(boundaryIndex + SYSTEM_PROMPT_CACHE_BOUNDARY.length).trimStart()
  };
}

// packages/ai/src/providers/anthropic-auth-headers.ts
function usesFoundryBearerAuth(model) {
  return model.provider === "microsoft-foundry" && (model.authHeader === true || hasBearerAuthorizationHeader(model.headers));
}
function hasBearerAuthorizationHeader(headers) {
  if (!headers) {
    return false;
  }
  return Object.entries(headers).some(
    ([key, value]) => key.toLowerCase() === "authorization" && /^bearer\s+\S+/i.test(value.trim())
  );
}
function omitFoundryBearerCredentialHeaders(headers) {
  if (!headers) {
    return void 0;
  }
  const next = {};
  for (const [key, value] of Object.entries(headers)) {
    const lower = key.toLowerCase();
    if (lower === "authorization" || lower === "x-api-key" || lower === "api-key") {
      continue;
    }
    next[key] = value;
  }
  return Object.keys(next).length > 0 ? next : void 0;
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
function usesClaudeFable5MessagesContract(model) {
  return normalizeApi(model.api) === "anthropic-messages" && resolveClaudeFable5ModelIdentity(model) !== void 0;
}
function usesClaudeStreamingRefusalContract(model) {
  if (normalizeApi(model.api) !== "anthropic-messages") {
    return false;
  }
  return resolveClaudeFable5ModelIdentity(model) !== void 0 || resolveClaudeMythos5ModelIdentity(model) !== void 0 || resolveClaudeSonnet5ModelIdentity(model) !== void 0;
}
function requiresClaudeAdaptiveThinking(model) {
  if (normalizeApi(model.api) !== "anthropic-messages") {
    return false;
  }
  return requiresClaudeMandatoryAdaptiveThinking(model);
}
function defaultsClaudeAdaptiveThinking(model) {
  return requiresClaudeAdaptiveThinking(model) || normalizeApi(model.api) === "anthropic-messages" && resolveClaudeSonnet5ModelIdentity(model) !== void 0;
}
function prepareClaudeSonnet5RequestContext(model, context) {
  if (!resolveClaudeSonnet5ModelIdentity(model)) {
    return context;
  }
  let end = context.messages.length;
  while (end > 0) {
    const message = context.messages[end - 1];
    if (message?.role !== "assistant" || Array.isArray(message.content) && message.content.some((block) => block.type === "toolCall")) {
      break;
    }
    end -= 1;
  }
  return end === context.messages.length ? context : { ...context, messages: context.messages.slice(0, end) };
}
function applyClaudeRequestContract(params, model) {
  if (normalizeApi(model.api) !== "anthropic-messages") {
    return;
  }
  const sonnet5 = resolveClaudeSonnet5ModelIdentity(model) !== void 0;
  if (!requiresClaudeDefaultSampling(model) && !sonnet5) {
    return;
  }
  delete params.temperature;
  delete params.top_p;
  delete params.top_k;
  if (sonnet5) {
    delete params.service_tier;
  }
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

// packages/ai/src/providers/anthropic-refusal.ts
function readNullableString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
function readAnthropicRefusalDetails(value) {
  if (!value || typeof value !== "object") {
    return { category: null, explanation: null };
  }
  const details = value;
  return {
    category: readNullableString(details.category),
    explanation: readNullableString(details.explanation)
  };
}
function formatAnthropicRefusalMessage(details) {
  const category = details.category ? ` (category: ${details.category})` : "";
  const explanation = details.explanation ? `: ${details.explanation}` : ".";
  return `Anthropic refusal${category}${explanation}`;
}
function applyAnthropicRefusal(output, stopDetails, provider) {
  const details = readAnthropicRefusalDetails(stopDetails);
  output.stopReason = "error";
  output.errorMessage = formatAnthropicRefusalMessage(details);
  output.diagnostics = [
    ...output.diagnostics ?? [],
    {
      type: "provider_refusal",
      timestamp: Date.now(),
      details: {
        provider,
        category: details.category,
        explanation: details.explanation
      }
    }
  ];
}

// packages/ai/src/providers/anthropic-server-fallback.ts
var ANTHROPIC_SERVER_SIDE_FALLBACK_BETA = "server-side-fallback-2026-06-01";
var CLAUDE_FABLE_5_FALLBACK_MODEL = "claude-opus-4-8";
var CLAUDE_FABLE_5_FALLBACK_MODEL_COST = {
  input: 5,
  output: 25,
  cacheRead: 0.5,
  cacheWrite: 6.25
};
function buildAnthropicServerSideFallbacks() {
  return [{ model: CLAUDE_FABLE_5_FALLBACK_MODEL }];
}
function readBoundaryModel(value) {
  if (!value || typeof value !== "object") {
    return null;
  }
  const model = value.model;
  return typeof model === "string" && model.trim() ? model : null;
}
function readAnthropicFallbackBoundary(block) {
  if (!block || typeof block !== "object") {
    return null;
  }
  const record = block;
  if (record.type !== "fallback") {
    return null;
  }
  return {
    fromModel: readBoundaryModel(record.from),
    toModel: readBoundaryModel(record.to)
  };
}
function applyAnthropicFallbackBoundary(params) {
  const { output, boundary } = params;
  const survivors = output.content.filter((block) => block.type === "text");
  for (const survivor of survivors) {
    delete survivor.textSignature;
  }
  output.content.splice(0, output.content.length, ...survivors);
  if (boundary.toModel) {
    output.responseModel = boundary.toModel;
  }
  output.diagnostics = [
    ...output.diagnostics ?? [],
    {
      type: "provider_fallback",
      timestamp: Date.now(),
      details: {
        provider: params.provider,
        fromModel: boundary.fromModel,
        toModel: boundary.toModel
      }
    }
  ];
}

// packages/ai/src/providers/anthropic-thinking-replay.ts
var ANTHROPIC_OMITTED_REASONING_TEXT = "[assistant reasoning omitted]";
function asReplayMessage(value) {
  return value && typeof value === "object" ? value : void 0;
}
function findActiveAnthropicToolTurnAssistantIndex(messages) {
  const toolResultIds = /* @__PURE__ */ new Set();
  let index = messages.length - 1;
  while (index >= 0) {
    const message = asReplayMessage(messages[index]);
    if (message?.role !== "toolResult") {
      break;
    }
    if (typeof message.toolCallId === "string") {
      toolResultIds.add(message.toolCallId);
    }
    index -= 1;
  }
  if (toolResultIds.size === 0) {
    return -1;
  }
  const assistant = asReplayMessage(messages[index]);
  if (assistant?.role !== "assistant" || !Array.isArray(assistant.content)) {
    return -1;
  }
  const toolCallIds = /* @__PURE__ */ new Set();
  for (const block of assistant.content) {
    if (!block || typeof block !== "object") {
      continue;
    }
    const record = block;
    if ((record.type === "toolCall" || record.type === "tool_use" || record.type === "function_call") && typeof record.id === "string") {
      toolCallIds.add(record.id);
    }
  }
  return [...toolResultIds].every((toolCallId) => toolCallIds.has(toolCallId)) ? index : -1;
}

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

// packages/ai/src/providers/anthropic-tool-projection.ts
function isProviderSupportedViolation(violation) {
  return violation.endsWith(".$dynamicRef") || violation.endsWith(".$dynamicAnchor");
}
var schemaValueKeywords = /* @__PURE__ */ new Set([
  "additionalProperties",
  "contains",
  "contentSchema",
  "else",
  "if",
  "items",
  "not",
  "propertyNames",
  "then",
  "unevaluatedItems",
  "unevaluatedProperties"
]);
var schemaArrayKeywords = /* @__PURE__ */ new Set(["allOf", "anyOf", "oneOf", "prefixItems"]);
var schemaMapKeywords2 = /* @__PURE__ */ new Set([
  "$defs",
  "definitions",
  "dependencies",
  "dependentSchemas",
  "patternProperties",
  "properties"
]);
function normalizeAnthropicJsonSchema(schema) {
  if (!isRecord(schema)) {
    return schema;
  }
  let changed = false;
  const normalized = { ...schema };
  for (const [key, value] of Object.entries(schema)) {
    if (schemaValueKeywords.has(key) && !Array.isArray(value)) {
      const next = normalizeAnthropicJsonSchema(value);
      normalized[key] = next;
      changed ||= next !== value;
      continue;
    }
    if (schemaArrayKeywords.has(key) && Array.isArray(value)) {
      const next = value.map(normalizeAnthropicJsonSchema);
      normalized[key] = next;
      changed ||= next.some((entry, index) => entry !== value[index]);
      continue;
    }
    if (schemaMapKeywords2.has(key) && isRecord(value)) {
      const next = Object.fromEntries(
        Object.entries(value).map(([entryKey, entryValue]) => [
          entryKey,
          normalizeAnthropicJsonSchema(entryValue)
        ])
      );
      normalized[key] = next;
      changed ||= Object.entries(value).some(
        ([entryKey, entryValue]) => next[entryKey] !== entryValue
      );
    }
  }
  if (Array.isArray(schema.items)) {
    normalized.prefixItems = schema.items.map(normalizeAnthropicJsonSchema);
    const additionalItems = schema.additionalItems;
    if (typeof additionalItems === "boolean" || isRecord(additionalItems)) {
      normalized.items = normalizeAnthropicJsonSchema(additionalItems);
    } else {
      delete normalized.items;
    }
    delete normalized.additionalItems;
    changed = true;
  }
  return changed ? normalized : schema;
}
function projectAnthropicTools(tools, toWireName) {
  const projectedTools = [];
  const unavailableOriginalNames = /* @__PURE__ */ new Set();
  for (const tool of tools) {
    let projectedTool;
    let originalName;
    try {
      const name = tool.name;
      originalName = name;
      if (!name) {
        continue;
      }
      const schemaProjection = projectRuntimeToolInputSchema(tool.parameters, `${name}.parameters`);
      if (!isRecord(schemaProjection.schema) || schemaProjection.violations.some((violation) => !isProviderSupportedViolation(violation))) {
        unavailableOriginalNames.add(name);
        continue;
      }
      const anthropicSchema = normalizeAnthropicJsonSchema(schemaProjection.schema);
      if (!isRecord(anthropicSchema)) {
        unavailableOriginalNames.add(name);
        continue;
      }
      const properties = anthropicSchema.properties;
      const required = anthropicSchema.required;
      if (properties !== void 0 && properties !== null && !isRecord(properties) || required !== void 0 && required !== null && (!Array.isArray(required) || required.some((entry) => typeof entry !== "string"))) {
        unavailableOriginalNames.add(name);
        continue;
      }
      let description;
      try {
        description = typeof tool.description === "string" ? tool.description : void 0;
      } catch {
      }
      const wireName = toWireName(name);
      projectedTool = {
        originalName: name,
        wireName,
        ...description ? { description } : {},
        inputSchema: {
          type: "object",
          properties: properties ?? {},
          required: required ?? []
        }
      };
    } catch {
      if (originalName) {
        unavailableOriginalNames.add(originalName);
      }
      continue;
    }
    const conflictingTool = projectedTools.find(
      (entry) => entry.wireName === projectedTool.wireName
    );
    if (conflictingTool && conflictingTool.originalName !== projectedTool.originalName) {
      throw new Error(
        `Anthropic tool names "${conflictingTool.originalName}" and "${projectedTool.originalName}" both map to "${projectedTool.wireName}"`
      );
    }
    projectedTools.push(projectedTool);
  }
  return {
    inputToolCount: tools.length,
    unavailableOriginalNames,
    tools: projectedTools
  };
}
function reconcileAnthropicToolChoice(choice, projection) {
  if (projection.inputToolCount === 0) {
    return choice;
  }
  if (choice.type === "tool") {
    const requestedName = choice.name;
    const originalMatch = projection.tools.find((tool) => tool.originalName === requestedName);
    if (originalMatch) {
      return { ...choice, name: originalMatch.wireName };
    }
    if (projection.unavailableOriginalNames.has(requestedName)) {
      throw new Error(
        `Anthropic tool_choice requested unavailable tool "${requestedName}" after schema conversion`
      );
    }
    const matchedTool = projection.tools.find((tool) => tool.wireName === requestedName);
    if (!matchedTool) {
      throw new Error(
        `Anthropic tool_choice requested unavailable tool "${requestedName}" after schema conversion`
      );
    }
    return { ...choice, name: matchedTool.wireName };
  }
  if (projection.tools.length === 0) {
    if (choice.type === "auto") {
      return void 0;
    }
    if (choice.type === "any") {
      throw new Error(
        "Anthropic tool_choice requires a tool, but no tools survived schema conversion"
      );
    }
  }
  return choice;
}
function resolveOriginalAnthropicToolName(name, projection) {
  return projection?.tools.find((tool) => tool.wireName === name)?.originalName ?? name;
}

// packages/ai/src/providers/anthropic-usage.ts
function readAnthropicUsageTokenCount(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : void 0;
}
function readAnthropicCacheWriteUsage(usage) {
  if (!usage.cache_creation || typeof usage.cache_creation !== "object") {
    return {};
  }
  const cacheCreation = usage.cache_creation;
  const cacheWrite5m = readAnthropicUsageTokenCount(cacheCreation.ephemeral_5m_input_tokens);
  const cacheWrite1h = readAnthropicUsageTokenCount(cacheCreation.ephemeral_1h_input_tokens);
  return {
    ...cacheWrite5m !== void 0 ? { cacheWrite5m } : {},
    ...cacheWrite1h !== void 0 ? { cacheWrite1h } : {}
  };
}
function readAnthropicPromptUsageSnapshot(usage) {
  const input = readAnthropicUsageTokenCount(usage.input_tokens);
  const cacheRead = usage.cache_read_input_tokens == null ? 0 : readAnthropicUsageTokenCount(usage.cache_read_input_tokens);
  const cacheWrite = usage.cache_creation_input_tokens == null ? 0 : readAnthropicUsageTokenCount(usage.cache_creation_input_tokens);
  if (input === void 0 || cacheRead === void 0 || cacheWrite === void 0) {
    return void 0;
  }
  return { input, cacheRead, cacheWrite };
}
function readLastAnthropicIterationUsage(usage) {
  if (usage.iterations == null) {
    return { state: "absent" };
  }
  if (!Array.isArray(usage.iterations) || usage.iterations.length === 0) {
    return { state: "invalid" };
  }
  const iteration = usage.iterations.at(-1);
  if (!iteration || typeof iteration !== "object" || Array.isArray(iteration)) {
    return { state: "invalid" };
  }
  const record = iteration;
  const input = readAnthropicUsageTokenCount(record.input_tokens);
  const cacheRead = readAnthropicUsageTokenCount(record.cache_read_input_tokens);
  const cacheWrite = readAnthropicUsageTokenCount(record.cache_creation_input_tokens);
  const outputTokens = readAnthropicUsageTokenCount(record.output_tokens);
  if (input === void 0 || cacheRead === void 0 || cacheWrite === void 0 || outputTokens === void 0) {
    return { state: "invalid" };
  }
  const contextPromptTokens = input + cacheRead + cacheWrite;
  return {
    state: "valid",
    usage: {
      contextPromptTokens,
      totalTokens: contextPromptTokens + outputTokens
    }
  };
}

// packages/ai/src/providers/cache-retention.ts
function resolveCacheRetention(cacheRetention) {
  if (cacheRetention) {
    return cacheRetention;
  }
  if (typeof process !== "undefined" && process.env.OPENCLAW_CACHE_RETENTION === "long") {
    return "long";
  }
  return "short";
}

// packages/ai/src/providers/cloudflare.ts
function resolveCloudflareBaseUrl(model) {
  const url = model.baseUrl;
  if (!url.includes("{")) {
    return url;
  }
  const baseUrl = url.replace(/\{([A-Z_][A-Z0-9_]*)\}/g, (_match, name) => {
    const value = process.env[name];
    if (!value) {
      throw new Error(`${name} is required for provider ${model.provider} but is not set.`);
    }
    return value;
  });
  return baseUrl;
}

// packages/ai/src/providers/github-copilot-headers.ts
function inferCopilotInitiator(messages) {
  const last = messages[messages.length - 1];
  return last && last.role !== "user" ? "agent" : "user";
}
function hasCopilotVisionInput(messages) {
  return messages.some((msg) => {
    if (msg.role === "user" && Array.isArray(msg.content)) {
      return msg.content.some((c) => c.type === "image");
    }
    if (msg.role === "toolResult" && Array.isArray(msg.content)) {
      return msg.content.some((c) => c.type === "image");
    }
    return false;
  });
}
function buildCopilotDynamicHeaders(params) {
  const headers = {
    "X-Initiator": inferCopilotInitiator(params.messages),
    "Openai-Intent": "conversation-edits"
  };
  if (params.hasImages) {
    headers["Copilot-Vision-Request"] = "true";
  }
  return headers;
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
function clampReasoning(effort) {
  return effort === "xhigh" ? "high" : effort;
}
function adjustMaxTokensForThinking(baseMaxTokens, modelMaxTokens, reasoningLevel, customBudgets) {
  const defaultBudgets = {
    minimal: 1024,
    low: 2048,
    medium: 8192,
    high: 16384,
    max: 32768
  };
  const budgets = { ...defaultBudgets, ...customBudgets };
  const minOutputTokens = 1024;
  const level = clampReasoning(reasoningLevel);
  let thinkingBudget = budgets[level];
  const maxTokens = baseMaxTokens === void 0 ? modelMaxTokens : Math.min(baseMaxTokens + thinkingBudget, modelMaxTokens);
  if (maxTokens <= thinkingBudget) {
    thinkingBudget = Math.max(0, maxTokens - minOutputTokens);
  }
  return { maxTokens, thinkingBudget };
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
function transformMessages(messages, model, normalizeToolCallId2) {
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
          if (!isSameModel && normalizeToolCallId2) {
            const normalizedId = normalizeToolCallId2(toolCall.id, model, assistantMsg);
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

// packages/ai/src/providers/anthropic.ts
var ANTHROPIC_CACHE_CONTROL_LIMIT = 4;
var EMPTY_ERROR_TOOL_RESULT_TEXT = "[tool error with no output]";
function getCacheControl(model, cacheRetention) {
  const retention = resolveCacheRetention(cacheRetention);
  if (retention === "none") {
    return { retention };
  }
  const ttl = retention === "long" && getAnthropicCompat(model).supportsLongCacheRetention ? "1h" : void 0;
  return {
    retention,
    cacheControl: { type: "ephemeral", ...ttl && { ttl } }
  };
}
var claudeCodeVersion = "2.1.75";
var claudeCodeBillingSystemBlock = `x-anthropic-billing-header: cc_version=${claudeCodeVersion}; cc_entrypoint=sdk-cli;`;
var claudeCodeTools = [
  "Read",
  "Write",
  "Edit",
  "Bash",
  "Grep",
  "Glob",
  "AskUserQuestion",
  "EnterPlanMode",
  "ExitPlanMode",
  "KillShell",
  "NotebookEdit",
  "Skill",
  "Task",
  "TaskOutput",
  "TodoWrite",
  "WebFetch",
  "WebSearch"
];
var ccToolLookup = new Map(claudeCodeTools.map((t) => [t.toLowerCase(), t]));
var toClaudeCodeName = (name) => ccToolLookup.get(name.toLowerCase()) ?? name;
function convertContentBlocks(content, isError) {
  const text = extractToolResultText(content);
  const mediaPlaceholder = describeToolResultMediaPlaceholder(content);
  const hasImages = content.some(isImageWithMediaPayload);
  if (!hasImages) {
    const sanitized = sanitizeSurrogates(text);
    return sanitized.trim().length > 0 ? sanitized : mediaPlaceholder ?? (isError ? EMPTY_ERROR_TOOL_RESULT_TEXT : "");
  }
  const blocks = [];
  let hasTextBlock = false;
  for (const block of content) {
    if (!block || typeof block !== "object") {
      continue;
    }
    const record = block;
    const blockText = extractToolResultBlockText(block);
    if (blockText) {
      blocks.push({ type: "text", text: sanitizeSurrogates(blockText) });
      hasTextBlock = true;
    }
    if (!isImageWithMediaPayload(record)) {
      continue;
    }
    blocks.push({
      type: "image",
      source: {
        type: "base64",
        media_type: typeof record.mimeType === "string" ? record.mimeType : "image/jpeg",
        data: record.data
      }
    });
  }
  if (!hasTextBlock) {
    blocks.unshift({ type: "text", text: mediaPlaceholder ?? "(see attached image)" });
  }
  return blocks;
}
var FINE_GRAINED_TOOL_STREAMING_BETA = "fine-grained-tool-streaming-2025-05-14";
var INTERLEAVED_THINKING_BETA = "interleaved-thinking-2025-05-14";
var ANTHROPIC_MIN_THINKING_BUDGET_TOKENS = 1024;
function getAnthropicCompat(model) {
  const isFireworks = model.provider === "fireworks";
  const isCloudflareAiGatewayAnthropic = model.provider === "cloudflare-ai-gateway" && model.baseUrl.includes("anthropic");
  return {
    supportsEagerToolInputStreaming: model.compat?.supportsEagerToolInputStreaming ?? !isFireworks,
    supportsLongCacheRetention: model.compat?.supportsLongCacheRetention ?? !isFireworks,
    sendSessionAffinityHeaders: model.compat?.sendSessionAffinityHeaders ?? (isFireworks || isCloudflareAiGatewayAnthropic),
    supportsCacheControlOnTools: model.compat?.supportsCacheControlOnTools ?? !isFireworks,
    allowEmptySignature: model.compat?.allowEmptySignature ?? false
  };
}
function mergeHeaders(...headerSources) {
  const merged = {};
  for (const headers of headerSources) {
    if (headers) {
      Object.assign(merged, headers);
    }
  }
  return merged;
}
var ANTHROPIC_MESSAGE_EVENTS = /* @__PURE__ */ new Set([
  "message_start",
  "message_delta",
  "message_stop",
  "content_block_start",
  "content_block_delta",
  "content_block_stop"
]);
async function* iterateAnthropicEvents(response, requireMessageStop = false) {
  if (!response.body) {
    throw new Error("Attempted to iterate over an Anthropic response with no body");
  }
  let sawMessageStart = false;
  let sawMessageEnd = false;
  for await (const sse of Stream.rawEvents(response)) {
    if (sse.event === "error") {
      throw new Error(sse.data);
    }
    if (!ANTHROPIC_MESSAGE_EVENTS.has(sse.event ?? "")) {
      continue;
    }
    try {
      const event = parseJsonWithRepair(sse.data);
      if (event.type === "message_start") {
        sawMessageStart = true;
      } else if (event.type === "message_stop") {
        sawMessageEnd = true;
      }
      yield event;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Could not parse Anthropic SSE event ${sse.event}: ${message}; data=${sse.data}; raw=${sse.raw.join("\\n")}`,
        { cause: error }
      );
    }
  }
  if ((sawMessageStart || requireMessageStop) && !sawMessageEnd) {
    throw new Error("Anthropic stream ended before message_stop");
  }
}
var streamAnthropic = (model, context, options) => {
  const stream = new AssistantMessageEventStream();
  const requestContext = prepareClaudeSonnet5RequestContext(model, context);
  const requestOptions = normalizeAnthropicThinkingOptions(model, options);
  void (async () => {
    const output = {
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
    const refusalBuffer = usesClaudeStreamingRefusalContract(model) ? createDeferredEventBuffer(
      stream,
      () => notifyLlmRequestActivity(requestOptions?.signal)
    ) : void 0;
    const eventSink = refusalBuffer ?? stream;
    let costModel = model;
    let messageStartPromptUsage;
    try {
      let client;
      let isOAuth;
      let serverSideFallback = false;
      if (requestOptions?.client) {
        client = requestOptions.client;
        isOAuth = false;
      } else {
        const apiKey = requestOptions?.apiKey ?? getEnvApiKey(model.provider) ?? "";
        let copilotDynamicHeaders;
        if (model.provider === "github-copilot") {
          const hasImages = hasCopilotVisionInput(requestContext.messages);
          copilotDynamicHeaders = buildCopilotDynamicHeaders({
            messages: requestContext.messages,
            hasImages
          });
        }
        const cacheRetention = requestOptions?.cacheRetention ?? resolveCacheRetention();
        const cacheSessionId = cacheRetention === "none" ? void 0 : requestOptions?.sessionId;
        const created = createClient(
          model,
          apiKey,
          requestOptions?.thinkingEnabled === true,
          requestOptions?.interleavedThinking ?? true,
          shouldUseFineGrainedToolStreamingBeta(model, requestContext),
          requestOptions?.headers,
          copilotDynamicHeaders,
          cacheSessionId
        );
        client = created.client;
        isOAuth = created.isOAuthToken;
        serverSideFallback = created.serverSideFallback;
      }
      const builtParams = buildParams(
        model,
        requestContext,
        isOAuth,
        requestOptions,
        serverSideFallback
      );
      let params = builtParams.params;
      const toolProjection = builtParams.toolProjection;
      const nextParams = await requestOptions?.onPayload?.(params, model);
      if (nextParams !== void 0) {
        params = nextParams;
      }
      applyClaudeRequestContract(params, model);
      const sdkRequestOptions = {
        ...requestOptions?.signal ? { signal: requestOptions.signal } : {},
        ...requestOptions?.timeoutMs !== void 0 ? { timeout: requestOptions.timeoutMs } : {},
        maxRetries: requestOptions?.maxRetries ?? 0
      };
      const response = await client.messages.create({ ...params, stream: true }, sdkRequestOptions).asResponse();
      await requestOptions?.onResponse?.(
        { status: response.status, headers: headersToRecord(response.headers) },
        model
      );
      const blocks = output.content;
      const blockIndexes = /* @__PURE__ */ new Map();
      for await (const event of iterateAnthropicEvents(response, refusalBuffer !== void 0)) {
        if (event.type === "message_start") {
          output.responseId = event.message.id;
          output.responseModel = event.message.model;
          const promptUsage = readAnthropicPromptUsageSnapshot(event.message.usage);
          const messageStartPromptTokens = promptUsage ? promptUsage.input + promptUsage.cacheRead + promptUsage.cacheWrite : 0;
          messageStartPromptUsage = messageStartPromptTokens > 0 ? promptUsage : void 0;
          const inputTokens = readAnthropicUsageTokenCount(event.message.usage.input_tokens);
          if (inputTokens !== void 0) {
            output.usage.input = inputTokens;
          }
          const outputTokens = readAnthropicUsageTokenCount(event.message.usage.output_tokens);
          if (outputTokens !== void 0) {
            output.usage.output = outputTokens;
          }
          const cacheReadTokens = event.message.usage.cache_read_input_tokens == null ? 0 : readAnthropicUsageTokenCount(event.message.usage.cache_read_input_tokens);
          if (cacheReadTokens !== void 0) {
            output.usage.cacheRead = cacheReadTokens;
          }
          const cacheWriteTokens = event.message.usage.cache_creation_input_tokens == null ? 0 : readAnthropicUsageTokenCount(event.message.usage.cache_creation_input_tokens);
          if (cacheWriteTokens !== void 0) {
            output.usage.cacheWrite = cacheWriteTokens;
          }
          const cacheWriteUsage = readAnthropicCacheWriteUsage(event.message.usage);
          if (cacheWriteUsage.cacheWrite1h !== void 0) {
            output.usage.cacheWrite1h = cacheWriteUsage.cacheWrite1h;
          }
          output.usage.totalTokens = output.usage.input + output.usage.output + output.usage.cacheRead + output.usage.cacheWrite;
          if (messageStartPromptUsage && outputTokens !== void 0) {
            output.usage.contextUsage = {
              state: "available",
              promptTokens: messageStartPromptTokens,
              totalTokens: messageStartPromptTokens + output.usage.output
            };
          }
          calculateCost(costModel, output.usage);
          eventSink.push({ type: "start", partial: output });
        } else if (event.type === "content_block_start") {
          const fallbackBoundary = refusalBuffer ? readAnthropicFallbackBoundary(event.content_block) : null;
          if (fallbackBoundary) {
            refusalBuffer?.discard();
            blockIndexes.clear();
            applyAnthropicFallbackBoundary({
              output,
              boundary: fallbackBoundary,
              provider: model.provider
            });
            costModel = { ...model, cost: CLAUDE_FABLE_5_FALLBACK_MODEL_COST };
            calculateCost(costModel, output.usage);
            eventSink.push({ type: "start", partial: output });
            for (const [i, block] of blocks.entries()) {
              if (block.type !== "text") {
                continue;
              }
              delete block.index;
              eventSink.push({ type: "text_start", contentIndex: i, partial: output });
              if (block.text) {
                eventSink.push({
                  type: "text_delta",
                  contentIndex: i,
                  delta: block.text,
                  partial: output
                });
              }
              eventSink.push({
                type: "text_end",
                contentIndex: i,
                content: block.text,
                partial: output
              });
            }
          } else if (event.content_block.type === "text") {
            const block = {
              type: "text",
              text: "",
              index: event.index
            };
            output.content.push(block);
            blockIndexes.set(event.index, output.content.length - 1);
            eventSink.push({
              type: "text_start",
              contentIndex: output.content.length - 1,
              partial: output
            });
          } else if (event.content_block.type === "thinking") {
            const block = {
              type: "thinking",
              thinking: "",
              thinkingSignature: "",
              index: event.index
            };
            output.content.push(block);
            blockIndexes.set(event.index, output.content.length - 1);
            eventSink.push({
              type: "thinking_start",
              contentIndex: output.content.length - 1,
              partial: output
            });
          } else if (event.content_block.type === "redacted_thinking") {
            const block = {
              type: "thinking",
              thinking: "[Reasoning redacted]",
              thinkingSignature: event.content_block.data,
              redacted: true,
              index: event.index
            };
            output.content.push(block);
            blockIndexes.set(event.index, output.content.length - 1);
            eventSink.push({
              type: "thinking_start",
              contentIndex: output.content.length - 1,
              partial: output
            });
          } else if (event.content_block.type === "tool_use") {
            const block = {
              type: "toolCall",
              id: event.content_block.id,
              name: isOAuth ? resolveOriginalAnthropicToolName(event.content_block.name, toolProjection) : event.content_block.name,
              arguments: event.content_block.input ?? {},
              partialJson: "",
              index: event.index
            };
            output.content.push(block);
            blockIndexes.set(event.index, output.content.length - 1);
            eventSink.push({
              type: "toolcall_start",
              contentIndex: output.content.length - 1,
              partial: output
            });
          }
        } else if (event.type === "content_block_delta") {
          if (event.delta.type === "text_delta") {
            const index = blockIndexes.get(event.index);
            const block = index === void 0 ? void 0 : blocks[index];
            if (index !== void 0 && block?.type === "text") {
              block.text += event.delta.text;
              eventSink.push({
                type: "text_delta",
                contentIndex: index,
                delta: event.delta.text,
                partial: output
              });
            }
          } else if (event.delta.type === "thinking_delta") {
            const index = blockIndexes.get(event.index);
            const block = index === void 0 ? void 0 : blocks[index];
            if (index !== void 0 && block?.type === "thinking") {
              block.thinking += event.delta.thinking;
              eventSink.push({
                type: "thinking_delta",
                contentIndex: index,
                delta: event.delta.thinking,
                partial: output
              });
            }
          } else if (event.delta.type === "input_json_delta") {
            const index = blockIndexes.get(event.index);
            const block = index === void 0 ? void 0 : blocks[index];
            if (index !== void 0 && block?.type === "toolCall") {
              block.partialJson += event.delta.partial_json;
              block.arguments = parseStreamingJson(block.partialJson);
              eventSink.push({
                type: "toolcall_delta",
                contentIndex: index,
                delta: event.delta.partial_json,
                partial: output
              });
            }
          } else if (event.delta.type === "signature_delta") {
            const index = blockIndexes.get(event.index);
            const block = index === void 0 ? void 0 : blocks[index];
            if (index !== void 0 && block?.type === "thinking") {
              block.thinkingSignature = block.thinkingSignature || "";
              block.thinkingSignature += event.delta.signature;
            }
          }
        } else if (event.type === "content_block_stop") {
          const index = blockIndexes.get(event.index);
          const block = index === void 0 ? void 0 : blocks[index];
          if (index !== void 0 && block) {
            blockIndexes.delete(event.index);
            delete block.index;
            if (block.type === "text") {
              eventSink.push({
                type: "text_end",
                contentIndex: index,
                content: block.text,
                partial: output
              });
            } else if (block.type === "thinking") {
              eventSink.push({
                type: "thinking_end",
                contentIndex: index,
                content: block.thinking,
                partial: output
              });
            } else if (block.type === "toolCall") {
              block.arguments = parseStreamingJson(block.partialJson);
              delete block.partialJson;
              eventSink.push({
                type: "toolcall_end",
                contentIndex: index,
                toolCall: block,
                partial: output
              });
            }
          }
        } else if (event.type === "message_delta") {
          if (event.delta.stop_reason) {
            if (event.delta.stop_reason === "refusal") {
              applyAnthropicRefusal(output, event.delta.stop_details, model.provider);
            } else {
              output.stopReason = mapStopReason(event.delta.stop_reason);
            }
          }
          if (event.usage) {
            const inputTokens = readAnthropicUsageTokenCount(event.usage.input_tokens);
            if (inputTokens !== void 0) {
              output.usage.input = inputTokens;
            }
            const outputTokens = readAnthropicUsageTokenCount(event.usage.output_tokens);
            if (outputTokens !== void 0) {
              output.usage.output = outputTokens;
            }
            const cacheReadTokens = readAnthropicUsageTokenCount(
              event.usage.cache_read_input_tokens
            );
            if (cacheReadTokens !== void 0) {
              output.usage.cacheRead = cacheReadTokens;
            }
            const cacheWriteTokens = readAnthropicUsageTokenCount(
              event.usage.cache_creation_input_tokens
            );
            if (cacheWriteTokens !== void 0) {
              output.usage.cacheWrite = cacheWriteTokens;
            }
            const cacheWriteUsage = readAnthropicCacheWriteUsage(event.usage);
            if (cacheWriteUsage.cacheWrite1h !== void 0) {
              output.usage.cacheWrite1h = cacheWriteUsage.cacheWrite1h;
            }
            output.usage.totalTokens = output.usage.input + output.usage.output + output.usage.cacheRead + output.usage.cacheWrite;
            const iterationUsage = readLastAnthropicIterationUsage(event.usage);
            if (iterationUsage.state === "valid") {
              output.usage.contextUsage = {
                state: "available",
                promptTokens: iterationUsage.usage.contextPromptTokens,
                totalTokens: iterationUsage.usage.totalTokens
              };
            } else if (iterationUsage.state === "invalid") {
              output.usage.contextUsage = { state: "unavailable" };
            } else if (outputTokens !== void 0 && (messageStartPromptUsage !== void 0 || inputTokens !== void 0 && cacheReadTokens !== void 0 && cacheWriteTokens !== void 0)) {
              const promptTokens = output.usage.input + output.usage.cacheRead + output.usage.cacheWrite;
              output.usage.contextUsage = {
                state: "available",
                promptTokens,
                totalTokens: promptTokens + output.usage.output
              };
            } else {
              output.usage.contextUsage = { state: "unavailable" };
            }
          }
          calculateCost(costModel, output.usage);
        }
      }
      if (requestOptions?.signal?.aborted) {
        throw new Error("Request was aborted");
      }
      if (output.stopReason === "aborted" || output.stopReason === "error") {
        throw new Error(output.errorMessage ?? "An unknown error occurred");
      }
      refusalBuffer?.flush();
      stream.push({ type: "done", reason: output.stopReason, message: output });
      stream.end();
    } catch (error) {
      for (const block of output.content) {
        delete block.index;
        delete block.partialJson;
      }
      if (refusalBuffer) {
        refusalBuffer.discard();
        output.content = [];
      }
      output.stopReason = requestOptions?.signal?.aborted ? "aborted" : "error";
      output.errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      stream.push({ type: "error", reason: output.stopReason, error: output });
      stream.end();
    }
  })();
  return stream;
};
function normalizeAnthropicToolChoice(thinkingEnabled, toolChoice) {
  if (thinkingEnabled && (toolChoice === "any" || typeof toolChoice === "object" && toolChoice.type === "tool")) {
    return { type: "auto" };
  }
  return typeof toolChoice === "string" ? { type: toolChoice } : toolChoice;
}
function supportsAdaptiveThinking(model) {
  return supportsClaudeAdaptiveThinking(model);
}
function normalizeAnthropicThinkingOptions(model, options) {
  if (options?.thinkingEnabled !== true || supportsAdaptiveThinking(model)) {
    return options;
  }
  const budgetTokens = options.thinkingBudgetTokens ?? ANTHROPIC_MIN_THINKING_BUDGET_TOKENS;
  const maxTokens = options.maxTokens ?? model.maxTokens;
  if (budgetTokens >= ANTHROPIC_MIN_THINKING_BUDGET_TOKENS && budgetTokens < maxTokens) {
    return options;
  }
  return { ...options, thinkingEnabled: false, thinkingBudgetTokens: void 0 };
}
function supportsNativeXhighEffort(model) {
  return supportsClaudeNativeXhighEffort(model);
}
function mapThinkingLevelToEffort(model, level) {
  const requestedLevel = level;
  const hasCanonicalAlias = typeof model.params?.canonicalModelId === "string";
  const thinkingLevelMap = resolveClaudeNativeThinkingLevelMap(model);
  const clampModel = {
    ...model,
    ...hasCanonicalAlias ? { reasoning: true } : {},
    ...thinkingLevelMap ? { thinkingLevelMap } : {}
  };
  const clampedLevel = requestedLevel ? clampThinkingLevel(clampModel, requestedLevel) : requestedLevel;
  const mapped = clampedLevel ? thinkingLevelMap?.[clampedLevel] : void 0;
  if (typeof mapped === "string") {
    return mapped;
  }
  switch (clampedLevel) {
    case "off":
    case "minimal":
    case "low":
      return "low";
    case "medium":
      return "medium";
    case "high":
      return "high";
    case "xhigh":
      return supportsNativeXhighEffort(model) ? "xhigh" : "high";
    case "max":
      return supportsClaudeNativeMaxEffort(model) ? "max" : "high";
    default:
      return "high";
  }
}
var streamSimpleAnthropic = (model, context, options) => {
  const apiKey = options?.apiKey || getEnvApiKey(model.provider);
  if (!apiKey) {
    throw new Error(`No API key for provider: ${model.provider}`);
  }
  const base = {
    ...buildBaseOptions(model, options, apiKey),
    maxTokens: clampMaxTokensToModel(model, options?.maxTokens ?? model.maxTokens),
    toolChoice: options?.toolChoice
  };
  const mandatoryAdaptiveThinking = requiresClaudeAdaptiveThinking(model);
  if (options?.reasoning === "off" && !mandatoryAdaptiveThinking) {
    return streamAnthropic(model, context, {
      ...base,
      thinkingEnabled: false
    });
  }
  const reasoning = options?.reasoning === "off" ? mandatoryAdaptiveThinking ? "low" : "high" : options?.reasoning;
  if (resolveClaudeSonnet5ModelIdentity(model)) {
    return streamAnthropic(model, context, {
      ...base,
      thinkingEnabled: true,
      effort: mapThinkingLevelToEffort(model, reasoning ?? "high")
    });
  }
  if (!reasoning) {
    return streamAnthropic(model, context, {
      ...base,
      thinkingEnabled: mandatoryAdaptiveThinking,
      ...mandatoryAdaptiveThinking ? { effort: "high" } : {}
    });
  }
  if (supportsAdaptiveThinking(model)) {
    const effort = mapThinkingLevelToEffort(model, reasoning);
    return streamAnthropic(model, context, {
      ...base,
      thinkingEnabled: true,
      effort
    });
  }
  const adjusted = adjustMaxTokensForThinking(
    base.maxTokens,
    model.maxTokens,
    reasoning,
    options?.thinkingBudgets
  );
  const thinkingEnabled = adjusted.thinkingBudget >= ANTHROPIC_MIN_THINKING_BUDGET_TOKENS;
  const maxTokens = thinkingEnabled ? adjusted.maxTokens : clampMaxTokensToModel(model, options?.maxTokens ?? model.maxTokens);
  return streamAnthropic(model, context, {
    ...base,
    maxTokens,
    thinkingEnabled,
    thinkingBudgetTokens: thinkingEnabled ? adjusted.thinkingBudget : void 0
  });
};
function isOAuthToken(apiKey) {
  return getAiTransportHost().resolveSecretSentinel(apiKey).includes("sk-ant-oat");
}
function isAnthropicPublicEndpoint(baseUrl) {
  if (!baseUrl) {
    return true;
  }
  try {
    return new URL(baseUrl).hostname.toLowerCase() === "api.anthropic.com";
  } catch {
    return false;
  }
}
function supportsAnthropicServerSideFallback(model) {
  if (!usesClaudeFable5MessagesContract(model) || model.provider !== "anthropic") {
    return false;
  }
  return isAnthropicPublicEndpoint(model.baseUrl);
}
function createClient(model, apiKey, thinkingEnabled, interleavedThinking, useFineGrainedToolStreamingBeta, optionsHeaders, dynamicHeaders, sessionId) {
  const needsInterleavedBeta = interleavedThinking && !supportsAdaptiveThinking(model);
  const betaFeatures = [];
  if (useFineGrainedToolStreamingBeta) {
    betaFeatures.push(FINE_GRAINED_TOOL_STREAMING_BETA);
  }
  if (needsInterleavedBeta) {
    betaFeatures.push(INTERLEAVED_THINKING_BETA);
  }
  const fetchOptions = /^kimi(?:-|$)/.test(model.provider) && thinkingEnabled ? { sanitizeSse: false } : void 0;
  const fetch = getAiTransportHost().buildModelFetch(model, void 0, fetchOptions);
  if (model.provider === "cloudflare-ai-gateway") {
    const client2 = new Anthropic({
      apiKey,
      authToken: null,
      baseURL: resolveCloudflareBaseUrl(model),
      dangerouslyAllowBrowser: true,
      defaultHeaders: mergeHeaders(
        {
          accept: "application/json",
          "anthropic-dangerous-direct-browser-access": "true",
          Authorization: null,
          ...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
        },
        model.headers,
        optionsHeaders
      ),
      fetch
    });
    return { client: client2, isOAuthToken: false, serverSideFallback: false };
  }
  if (model.provider === "github-copilot") {
    const client2 = new Anthropic({
      apiKey: null,
      authToken: apiKey,
      baseURL: model.baseUrl,
      dangerouslyAllowBrowser: true,
      defaultHeaders: mergeHeaders(
        {
          accept: "application/json",
          "anthropic-dangerous-direct-browser-access": "true",
          ...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
        },
        model.headers,
        dynamicHeaders,
        optionsHeaders
      ),
      fetch
    });
    return { client: client2, isOAuthToken: false, serverSideFallback: false };
  }
  if (usesFoundryBearerAuth({
    ...model,
    headers: resolveAiTransportHeaderSentinels(model.headers)
  })) {
    const client2 = new Anthropic({
      apiKey: null,
      authToken: apiKey,
      baseURL: model.baseUrl,
      dangerouslyAllowBrowser: true,
      defaultHeaders: mergeHeaders(
        {
          accept: "application/json",
          "anthropic-dangerous-direct-browser-access": "true",
          ...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
        },
        omitFoundryBearerCredentialHeaders(model.headers),
        dynamicHeaders,
        optionsHeaders
      ),
      fetch
    });
    return { client: client2, isOAuthToken: false, serverSideFallback: false };
  }
  if (isOAuthToken(apiKey)) {
    const client2 = new Anthropic({
      apiKey: null,
      authToken: apiKey,
      baseURL: model.baseUrl,
      dangerouslyAllowBrowser: true,
      defaultHeaders: mergeHeaders(
        {
          accept: "application/json",
          "anthropic-dangerous-direct-browser-access": "true",
          "anthropic-beta": ["claude-code-20250219", "oauth-2025-04-20", ...betaFeatures].join(","),
          "user-agent": `claude-cli/${claudeCodeVersion}`,
          "x-app": "cli"
        },
        model.headers,
        optionsHeaders
      ),
      fetch
    });
    return { client: client2, isOAuthToken: true, serverSideFallback: false };
  }
  const serverSideFallback = supportsAnthropicServerSideFallback(model);
  if (serverSideFallback) {
    betaFeatures.push(ANTHROPIC_SERVER_SIDE_FALLBACK_BETA);
  }
  const sessionAffinityHeaders = sessionId && getAnthropicCompat(model).sendSessionAffinityHeaders ? { "x-session-affinity": sessionId } : {};
  const client = new Anthropic({
    apiKey,
    authToken: null,
    baseURL: model.baseUrl,
    dangerouslyAllowBrowser: true,
    defaultHeaders: mergeHeaders(
      {
        accept: "application/json",
        "anthropic-dangerous-direct-browser-access": "true",
        ...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
      },
      sessionAffinityHeaders,
      model.headers,
      optionsHeaders
    ),
    fetch
  });
  return { client, isOAuthToken: false, serverSideFallback };
}
function buildParams(model, context, isOAuthTokenResult, options, serverSideFallback = false) {
  const mandatoryAdaptiveThinking = requiresClaudeAdaptiveThinking(model);
  const replayThinkingEnabled = mandatoryAdaptiveThinking || options?.thinkingEnabled === true;
  const { cacheControl } = getCacheControl(model, options?.cacheRetention);
  const system = buildAnthropicSystemBlocks(context.systemPrompt, isOAuthTokenResult, cacheControl);
  const compat = getAnthropicCompat(model);
  const convertedTools = context.tools ? convertTools(
    context.tools,
    isOAuthTokenResult,
    compat.supportsEagerToolInputStreaming,
    compat.supportsCacheControlOnTools ? cacheControl : void 0
  ) : void 0;
  const tools = convertedTools?.tools;
  const toolProjection = convertedTools?.projection;
  const systemCacheControlCount = countNativeCacheControlMarkers(system);
  const toolCacheControlCount = countNativeCacheControlMarkers(tools);
  const messageCacheControlLimit = Math.max(
    0,
    ANTHROPIC_CACHE_CONTROL_LIMIT - systemCacheControlCount - toolCacheControlCount
  );
  const params = {
    model: model.id,
    messages: convertMessages(
      context.messages,
      model,
      isOAuthTokenResult,
      cacheControl,
      messageCacheControlLimit,
      replayThinkingEnabled,
      compat.allowEmptySignature
    ),
    max_tokens: options?.maxTokens ?? model.maxTokens,
    stream: true
  };
  if (system) {
    params.system = system;
  }
  if (serverSideFallback) {
    params.fallbacks = buildAnthropicServerSideFallbacks();
  }
  if (options?.temperature !== void 0 && !options?.thinkingEnabled && !supportsNativeXhighEffort(model)) {
    params.temperature = options.temperature;
  }
  if (options?.stop !== void 0 && options.stop.length > 0) {
    params.stop_sequences = options.stop;
  }
  if (tools && tools.length > 0) {
    params.tools = tools;
  }
  if (mandatoryAdaptiveThinking || model.reasoning || supportsAdaptiveThinking(model)) {
    if (mandatoryAdaptiveThinking || options?.thinkingEnabled) {
      const display = options?.thinkingDisplay ?? "summarized";
      if (supportsAdaptiveThinking(model)) {
        params.thinking = { type: "adaptive", display };
        const effort = options?.effort ?? (mandatoryAdaptiveThinking ? "high" : void 0);
        if (effort) {
          params.output_config = effort === "xhigh" ? { effort } : { effort };
        }
      } else {
        params.thinking = {
          type: "enabled",
          budget_tokens: options?.thinkingBudgetTokens ?? ANTHROPIC_MIN_THINKING_BUDGET_TOKENS,
          display
        };
      }
    } else if (options?.thinkingEnabled === false) {
      params.thinking = { type: "disabled" };
    }
  }
  if (options?.metadata) {
    const userId = options.metadata.user_id;
    if (typeof userId === "string") {
      params.metadata = { user_id: userId };
    }
  }
  if (options?.toolChoice) {
    const normalizedToolChoice = normalizeAnthropicToolChoice(
      replayThinkingEnabled,
      options.toolChoice
    );
    const projectedToolChoice = toolProjection ? reconcileAnthropicToolChoice(normalizedToolChoice, toolProjection) : normalizedToolChoice;
    if (projectedToolChoice) {
      params.tool_choice = projectedToolChoice;
    }
  }
  return { params, toolProjection };
}
function normalizeToolCallId(id) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
}
function convertMessages(messages, model, isOAuthTokenValue, cacheControl, messageCacheControlLimit = 4, replayThinkingEnabled = true, allowEmptySignature = false) {
  const params = [];
  const cacheBreakpointOptOutParamIndexes = /* @__PURE__ */ new Set();
  const transformedMessages = transformMessages(messages, model, normalizeToolCallId);
  const activeToolTurnAssistantIndex = replayThinkingEnabled ? -1 : findActiveAnthropicToolTurnAssistantIndex(transformedMessages);
  for (let i = 0; i < transformedMessages.length; i++) {
    const msg = transformedMessages[i];
    if (!msg) {
      continue;
    }
    if (msg.role === "user") {
      const isRuntimeContextCarrier = msg.runtimeContextCarrier === true;
      if (typeof msg.content === "string") {
        if (msg.content.trim().length > 0) {
          if (isRuntimeContextCarrier) {
            cacheBreakpointOptOutParamIndexes.add(params.length);
          }
          params.push({
            role: "user",
            content: sanitizeSurrogates(msg.content)
          });
        }
      } else {
        const blocks = msg.content.map((item) => {
          if (item.type === "text") {
            return {
              type: "text",
              text: sanitizeSurrogates(item.text)
            };
          }
          return {
            type: "image",
            source: {
              type: "base64",
              media_type: item.mimeType,
              data: item.data
            }
          };
        });
        const filteredBlocks = blocks.filter((b) => {
          if (b.type === "text") {
            return b.text.trim().length > 0;
          }
          return true;
        });
        if (filteredBlocks.length === 0) {
          continue;
        }
        if (isRuntimeContextCarrier) {
          cacheBreakpointOptOutParamIndexes.add(params.length);
        }
        params.push({
          role: "user",
          content: filteredBlocks
        });
      }
    } else if (msg.role === "assistant") {
      const blocks = [];
      let omittedThinking = false;
      for (const block of msg.content) {
        if (block.type === "text") {
          if (block.text.trim().length === 0) {
            continue;
          }
          blocks.push({
            type: "text",
            text: sanitizeSurrogates(block.text)
          });
        } else if (block.type === "thinking") {
          if (!replayThinkingEnabled && i !== activeToolTurnAssistantIndex) {
            omittedThinking = true;
            continue;
          }
          if (block.redacted) {
            if (!block.thinkingSignature) {
              throw new Error("redacted thinking block is missing its opaque signature");
            }
            blocks.push({
              type: "redacted_thinking",
              data: block.thinkingSignature
            });
            continue;
          }
          const thinkingSignature = block.thinkingSignature?.trim();
          const hasNativeThinkingSignature = Boolean(thinkingSignature) && thinkingSignature !== "reasoning_content";
          if (block.thinking.trim().length === 0 && !hasNativeThinkingSignature) {
            continue;
          }
          if (!thinkingSignature && !allowEmptySignature) {
            blocks.push({
              type: "text",
              text: sanitizeSurrogates(block.thinking)
            });
          } else {
            if (thinkingSignature === "reasoning_content") {
              continue;
            }
            blocks.push({
              type: "thinking",
              thinking: block.thinking,
              signature: thinkingSignature ?? ""
            });
          }
        } else if (block.type === "toolCall") {
          blocks.push({
            type: "tool_use",
            id: block.id,
            name: isOAuthTokenValue ? toClaudeCodeName(block.name) : block.name,
            input: block.arguments ?? {}
          });
        }
      }
      if (blocks.length === 0 && omittedThinking) {
        blocks.push({ type: "text", text: ANTHROPIC_OMITTED_REASONING_TEXT });
      }
      if (blocks.length === 0) {
        continue;
      }
      params.push({
        role: "assistant",
        content: blocks
      });
    } else if (msg.role === "toolResult") {
      const toolResults = [];
      toolResults.push({
        type: "tool_result",
        tool_use_id: msg.toolCallId,
        content: convertContentBlocks(msg.content, msg.isError),
        is_error: msg.isError
      });
      let j = i + 1;
      while (j < transformedMessages.length) {
        const nextMsg = transformedMessages.at(j);
        if (nextMsg?.role !== "toolResult") {
          break;
        }
        toolResults.push({
          type: "tool_result",
          tool_use_id: nextMsg.toolCallId,
          content: convertContentBlocks(nextMsg.content, nextMsg.isError),
          is_error: nextMsg.isError
        });
        j++;
      }
      i = j - 1;
      params.push({
        role: "user",
        content: toolResults
      });
    }
  }
  if (cacheControl && params.length > 0 && messageCacheControlLimit > 0) {
    let fallbackToolResult;
    for (let i = params.length - 1; i >= 0; i--) {
      const message = params[i];
      if (!message || message.role !== "user" || cacheBreakpointOptOutParamIndexes.has(i)) {
        continue;
      }
      if (Array.isArray(message.content)) {
        for (let j = message.content.length - 1; j >= 0; j--) {
          const block = message.content[j];
          if (!block) {
            continue;
          }
          if (block.type === "text" || block.type === "image") {
            if (fallbackToolResult && messageCacheControlLimit === 1) {
              applyContentBlockCacheControl(fallbackToolResult, cacheControl);
              return params;
            }
            applyContentBlockCacheControl(block, cacheControl);
            if (fallbackToolResult && messageCacheControlLimit > 1) {
              applyContentBlockCacheControl(fallbackToolResult, cacheControl);
            }
            return params;
          }
          if (block.type === "tool_result" && fallbackToolResult === void 0) {
            fallbackToolResult = block;
          }
        }
        continue;
      }
      if (typeof message.content === "string") {
        if (fallbackToolResult && messageCacheControlLimit === 1) {
          applyContentBlockCacheControl(fallbackToolResult, cacheControl);
          return params;
        }
        message.content = [
          {
            type: "text",
            text: message.content,
            cache_control: cacheControl
          }
        ];
        if (fallbackToolResult && messageCacheControlLimit > 1) {
          applyContentBlockCacheControl(fallbackToolResult, cacheControl);
        }
        return params;
      }
    }
    if (fallbackToolResult) {
      applyContentBlockCacheControl(fallbackToolResult, cacheControl);
    }
  }
  return params;
}
function applyContentBlockCacheControl(block, cacheControl) {
  block.cache_control = cacheControl;
}
function buildAnthropicSystemBlocks(systemPrompt, isOAuthTokenResult, cacheControl) {
  const blocks = [];
  if (isOAuthTokenResult) {
    blocks.push({
      type: "text",
      text: claudeCodeBillingSystemBlock
    });
    blocks.push({
      type: "text",
      text: "You are Claude Code, Anthropic's official CLI for Claude.",
      ...cacheControl ? { cache_control: cacheControl } : {}
    });
  }
  if (systemPrompt) {
    blocks.push(...buildSystemPromptBlocks(systemPrompt, cacheControl));
  }
  return blocks.length > 0 ? blocks : void 0;
}
function buildSystemPromptBlocks(systemPrompt, cacheControl) {
  if (!cacheControl) {
    return [
      { type: "text", text: sanitizeSurrogates(stripSystemPromptCacheBoundary(systemPrompt)) }
    ];
  }
  const split = splitSystemPromptCacheBoundary(systemPrompt);
  if (!split) {
    return [
      {
        type: "text",
        text: sanitizeSurrogates(systemPrompt),
        cache_control: cacheControl
      }
    ];
  }
  const blocks = [];
  if (split.stablePrefix) {
    blocks.push({
      type: "text",
      text: sanitizeSurrogates(split.stablePrefix),
      cache_control: cacheControl
    });
  }
  if (split.dynamicSuffix) {
    blocks.push({ type: "text", text: sanitizeSurrogates(split.dynamicSuffix) });
  }
  return blocks.length > 0 ? blocks : [{ type: "text", text: "" }];
}
function countNativeCacheControlMarkers(blocks) {
  if (!Array.isArray(blocks)) {
    return 0;
  }
  let count = 0;
  for (const block of blocks) {
    if (block && typeof block === "object" && "cache_control" in block) {
      count += 1;
    }
  }
  return count;
}
function shouldUseFineGrainedToolStreamingBeta(model, context) {
  return Boolean(context.tools?.length) && !getAnthropicCompat(model).supportsEagerToolInputStreaming;
}
function convertTools(tools, isOAuthTokenLocal, supportsEagerToolInputStreaming, cacheControl) {
  const projection = projectAnthropicTools(
    tools,
    (name) => isOAuthTokenLocal ? toClaudeCodeName(name) : name
  );
  const convertedTools = [];
  for (const [index, tool] of projection.tools.entries()) {
    const convertedTool = {
      name: tool.wireName,
      description: tool.description,
      input_schema: tool.inputSchema
    };
    if (supportsEagerToolInputStreaming) {
      convertedTool.eager_input_streaming = true;
    }
    if (cacheControl && index === projection.tools.length - 1) {
      convertedTool.cache_control = cacheControl;
    }
    convertedTools.push(convertedTool);
  }
  return {
    projection,
    tools: convertedTools
  };
}
function mapStopReason(reason) {
  switch (reason) {
    case "end_turn":
      return "stop";
    case "max_tokens":
      return "length";
    case "tool_use":
      return "toolUse";
    case "refusal":
      return "error";
    case "pause_turn":
      return "stop";
    case "stop_sequence":
      return "stop";
    // We don't supply stop sequences, so this should never happen
    case "sensitive":
      return "error";
    default:
      throw new Error(`Unhandled stop reason: ${reason}`);
  }
}
export {
  ANTHROPIC_OMITTED_REASONING_TEXT,
  ANTHROPIC_SERVER_SIDE_FALLBACK_BETA,
  CLAUDE_FABLE_5_FALLBACK_MODEL,
  CLAUDE_FABLE_5_FALLBACK_MODEL_COST,
  applyAnthropicFallbackBoundary,
  applyAnthropicRefusal,
  applyClaudeRequestContract,
  buildAnthropicServerSideFallbacks,
  defaultsClaudeAdaptiveThinking,
  findActiveAnthropicToolTurnAssistantIndex,
  omitFoundryBearerCredentialHeaders,
  prepareClaudeSonnet5RequestContext,
  projectAnthropicTools,
  readAnthropicCacheWriteUsage,
  readAnthropicFallbackBoundary,
  readAnthropicPromptUsageSnapshot,
  readAnthropicUsageTokenCount,
  readLastAnthropicIterationUsage,
  reconcileAnthropicToolChoice,
  requiresClaudeAdaptiveThinking,
  requiresClaudeDefaultSampling,
  requiresClaudeMandatoryAdaptiveThinking,
  resolveClaudeFable5ModelIdentity,
  resolveClaudeModelIdentity,
  resolveClaudeMythos5ModelIdentity,
  resolveClaudeNativeThinkingLevelMap,
  resolveClaudeSonnet5ModelIdentity,
  resolveModelBoundThinkingReplayMode,
  resolveOriginalAnthropicToolName,
  streamAnthropic,
  streamSimpleAnthropic,
  supportsClaudeAdaptiveThinking,
  supportsClaudeNativeMaxEffort,
  supportsClaudeNativeXhighEffort,
  usesClaudeFable5MessagesContract,
  usesClaudeStreamingRefusalContract,
  usesFoundryBearerAuth
};
