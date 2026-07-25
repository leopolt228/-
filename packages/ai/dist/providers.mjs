var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// packages/llm-core/src/utils/event-stream.ts
var EventStream, AssistantMessageEventStream;
var init_event_stream = __esm({
  "packages/llm-core/src/utils/event-stream.ts"() {
    "use strict";
    EventStream = class {
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
    AssistantMessageEventStream = class extends EventStream {
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
  }
});

// packages/ai/src/utils/event-stream.ts
var init_event_stream2 = __esm({
  "packages/ai/src/utils/event-stream.ts"() {
    "use strict";
    init_event_stream();
  }
});

// packages/ai/src/env-api-keys.ts
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
var existsSync, homedir, join, dynamicImport, NODE_FS_SPECIFIER, NODE_OS_SPECIFIER, NODE_PATH_SPECIFIER, procEnvCache, cachedVertexAdcCredentialsExists;
var init_env_api_keys = __esm({
  "packages/ai/src/env-api-keys.ts"() {
    "use strict";
    existsSync = null;
    homedir = null;
    join = null;
    dynamicImport = (specifier) => import(specifier);
    NODE_FS_SPECIFIER = "node:fs";
    NODE_OS_SPECIFIER = "node:os";
    NODE_PATH_SPECIFIER = "node:path";
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
    procEnvCache = null;
    cachedVertexAdcCredentialsExists = null;
  }
});

// packages/ai/src/host.ts
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
var inertAiTransportHost, activeAiTransportHost;
var init_host = __esm({
  "packages/ai/src/host.ts"() {
    "use strict";
    inertAiTransportHost = {
      buildModelFetch: () => void 0,
      resolveSecretSentinel: (value) => value,
      redactSecrets: (value) => value,
      redactToolPayloadText: (text) => text,
      resolveOpenAIStrictToolSetting: (_model, options) => options?.supportsStrictMode ? false : void 0,
      logDebug: () => {
      }
    };
    activeAiTransportHost = inertAiTransportHost;
  }
});

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
var init_anthropic = __esm({
  "packages/llm-core/src/model-contracts/anthropic.ts"() {
    "use strict";
  }
});

// packages/llm-core/src/types.ts
var init_types = __esm({
  "packages/llm-core/src/types.ts"() {
    "use strict";
  }
});

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
var init_diagnostics = __esm({
  "packages/llm-core/src/utils/diagnostics.ts"() {
    "use strict";
  }
});

// packages/llm-core/src/validation.ts
import { Compile } from "typebox/compile";
var MAX_JSON_COERCE_LENGTH;
var init_validation = __esm({
  "packages/llm-core/src/validation.ts"() {
    "use strict";
    MAX_JSON_COERCE_LENGTH = 64 * 1024;
  }
});

// packages/llm-core/src/index.ts
var init_src = __esm({
  "packages/llm-core/src/index.ts"() {
    "use strict";
    init_anthropic();
    init_types();
    init_diagnostics();
    init_event_stream();
    init_validation();
  }
});

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
var EXTENDED_THINKING_LEVELS;
var init_model_utils = __esm({
  "packages/ai/src/model-utils.ts"() {
    "use strict";
    init_src();
    EXTENDED_THINKING_LEVELS = [
      "off",
      "minimal",
      "low",
      "medium",
      "high",
      "xhigh",
      "max"
    ];
  }
});

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
var init_deferred_event_buffer = __esm({
  "packages/ai/src/utils/deferred-event-buffer.ts"() {
    "use strict";
  }
});

// packages/ai/src/utils/headers.ts
function headersToRecord(headers) {
  const result = {};
  for (const [key, value] of headers.entries()) {
    result[key] = value;
  }
  return result;
}
var init_headers = __esm({
  "packages/ai/src/utils/headers.ts"() {
    "use strict";
  }
});

// packages/ai/src/utils/json-parse.ts
import { parse as partialParse } from "partial-json";
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
var VALID_JSON_ESCAPES, JSON_CONTROL_ESCAPES;
var init_json_parse = __esm({
  "packages/ai/src/utils/json-parse.ts"() {
    "use strict";
    VALID_JSON_ESCAPES = /* @__PURE__ */ new Set(['"', "\\", "/", "b", "f", "n", "r", "t", "u"]);
    JSON_CONTROL_ESCAPES = /* @__PURE__ */ new Set(["b", "f", "n", "r", "t"]);
  }
});

// packages/ai/src/utils/llm-request-activity.ts
function notifyLlmRequestActivity(signal) {
  if (!signal) {
    return;
  }
  for (const listener of requestActivityListeners.get(signal) ?? []) {
    listener();
  }
}
var requestActivityListeners;
var init_llm_request_activity = __esm({
  "packages/ai/src/utils/llm-request-activity.ts"() {
    "use strict";
    requestActivityListeners = /* @__PURE__ */ new WeakMap();
  }
});

// packages/ai/src/utils/sanitize-unicode.ts
function sanitizeSurrogates(text) {
  return text.replace(
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
    ""
  );
}
var init_sanitize_unicode = __esm({
  "packages/ai/src/utils/sanitize-unicode.ts"() {
    "use strict";
  }
});

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
var init_string_coerce = __esm({
  "packages/normalization-core/src/string-coerce.ts"() {
    "use strict";
  }
});

// packages/ai/src/utils/prompt-cache-stability.ts
var init_prompt_cache_stability = __esm({
  "packages/ai/src/utils/prompt-cache-stability.ts"() {
    "use strict";
    init_string_coerce();
    init_sanitize_unicode();
  }
});

// packages/ai/src/utils/system-prompt-cache-boundary.ts
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
var SYSTEM_PROMPT_CACHE_BOUNDARY;
var init_system_prompt_cache_boundary = __esm({
  "packages/ai/src/utils/system-prompt-cache-boundary.ts"() {
    "use strict";
    init_prompt_cache_stability();
    SYSTEM_PROMPT_CACHE_BOUNDARY = "\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n";
  }
});

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
var init_anthropic_auth_headers = __esm({
  "packages/ai/src/providers/anthropic-auth-headers.ts"() {
    "use strict";
  }
});

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
var init_anthropic_model_contract = __esm({
  "packages/ai/src/providers/anthropic-model-contract.ts"() {
    "use strict";
    init_src();
    init_string_coerce();
    init_src();
  }
});

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
var init_anthropic_refusal = __esm({
  "packages/ai/src/providers/anthropic-refusal.ts"() {
    "use strict";
  }
});

// packages/ai/src/providers/anthropic-server-fallback.ts
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
var ANTHROPIC_SERVER_SIDE_FALLBACK_BETA, CLAUDE_FABLE_5_FALLBACK_MODEL, CLAUDE_FABLE_5_FALLBACK_MODEL_COST;
var init_anthropic_server_fallback = __esm({
  "packages/ai/src/providers/anthropic-server-fallback.ts"() {
    "use strict";
    ANTHROPIC_SERVER_SIDE_FALLBACK_BETA = "server-side-fallback-2026-06-01";
    CLAUDE_FABLE_5_FALLBACK_MODEL = "claude-opus-4-8";
    CLAUDE_FABLE_5_FALLBACK_MODEL_COST = {
      input: 5,
      output: 25,
      cacheRead: 0.5,
      cacheWrite: 6.25
    };
  }
});

// packages/ai/src/providers/anthropic-thinking-replay.ts
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
var ANTHROPIC_OMITTED_REASONING_TEXT;
var init_anthropic_thinking_replay = __esm({
  "packages/ai/src/providers/anthropic-thinking-replay.ts"() {
    "use strict";
    ANTHROPIC_OMITTED_REASONING_TEXT = "[assistant reasoning omitted]";
  }
});

// packages/normalization-core/src/record-coerce.ts
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
var init_record_coerce = __esm({
  "packages/normalization-core/src/record-coerce.ts"() {
    "use strict";
  }
});

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
var schemaMapKeywords;
var init_tool_schema_json_projection = __esm({
  "packages/ai/src/providers/tool-schema-json-projection.ts"() {
    "use strict";
    schemaMapKeywords = /* @__PURE__ */ new Set([
      "$defs",
      "definitions",
      "dependencies",
      "dependentSchemas",
      "patternProperties",
      "properties"
    ]);
  }
});

// packages/ai/src/providers/anthropic-tool-projection.ts
function isProviderSupportedViolation(violation) {
  return violation.endsWith(".$dynamicRef") || violation.endsWith(".$dynamicAnchor");
}
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
var schemaValueKeywords, schemaArrayKeywords, schemaMapKeywords2;
var init_anthropic_tool_projection = __esm({
  "packages/ai/src/providers/anthropic-tool-projection.ts"() {
    "use strict";
    init_record_coerce();
    init_tool_schema_json_projection();
    schemaValueKeywords = /* @__PURE__ */ new Set([
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
    schemaArrayKeywords = /* @__PURE__ */ new Set(["allOf", "anyOf", "oneOf", "prefixItems"]);
    schemaMapKeywords2 = /* @__PURE__ */ new Set([
      "$defs",
      "definitions",
      "dependencies",
      "dependentSchemas",
      "patternProperties",
      "properties"
    ]);
  }
});

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
var init_anthropic_usage = __esm({
  "packages/ai/src/providers/anthropic-usage.ts"() {
    "use strict";
  }
});

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
var init_cache_retention = __esm({
  "packages/ai/src/providers/cache-retention.ts"() {
    "use strict";
  }
});

// packages/ai/src/providers/cloudflare.ts
function isCloudflareProvider(provider) {
  return provider === "cloudflare-workers-ai" || provider === "cloudflare-ai-gateway";
}
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
var init_cloudflare = __esm({
  "packages/ai/src/providers/cloudflare.ts"() {
    "use strict";
  }
});

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
var init_github_copilot_headers = __esm({
  "packages/ai/src/providers/github-copilot-headers.ts"() {
    "use strict";
  }
});

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
var init_simple_options = __esm({
  "packages/ai/src/providers/simple-options.ts"() {
    "use strict";
  }
});

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
var init_utf16_slice = __esm({
  "packages/normalization-core/src/utf16-slice.ts"() {
    "use strict";
  }
});

// packages/ai/src/providers/tool-result-text.ts
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
var PROVIDER_TOOL_RESULT_MAX_CHARS, IMAGE_TOOL_RESULT_TYPES, AUDIO_TOOL_RESULT_TYPES, MEDIA_ONLY_TOOL_RESULT_TYPES, INLINE_DATA_URI_PATTERN, MIME_KEY_CANDIDATES, TEXTUAL_MIME_PATTERN, OPAQUE_OR_BINARY_FIELD_RE;
var init_tool_result_text = __esm({
  "packages/ai/src/providers/tool-result-text.ts"() {
    "use strict";
    init_record_coerce();
    init_utf16_slice();
    init_host();
    init_sanitize_unicode();
    PROVIDER_TOOL_RESULT_MAX_CHARS = 8e3;
    IMAGE_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set(["image", "image_url", "input_image"]);
    AUDIO_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set(["audio", "input_audio", "output_audio"]);
    MEDIA_ONLY_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set([
      ...IMAGE_TOOL_RESULT_TYPES,
      ...AUDIO_TOOL_RESULT_TYPES
    ]);
    INLINE_DATA_URI_PATTERN = /(^|[^A-Za-z0-9_])data:([a-z][a-z0-9.+-]*\/[a-z0-9.+-]+(?:;[a-z0-9.+-]+=[^,;"'\s]+|;base64)*,[^\s"'<>)]+)/gi;
    MIME_KEY_CANDIDATES = [
      "mimeType",
      "mime_type",
      "mediaType",
      "media_type",
      "contentType",
      "content_type"
    ];
    TEXTUAL_MIME_PATTERN = /^(?:text\/|application\/(?:json|ld\+json|x-ndjson|xml|javascript|x-www-form-urlencoded)|[^/]+\/[^+]+\+(?:json|xml)$)/i;
    OPAQUE_OR_BINARY_FIELD_RE = /^(?:blob|buffer|bytes|encrypted_content|encrypted_stdout)$/i;
  }
});

// packages/ai/src/providers/transform-messages.ts
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
var NON_VISION_USER_IMAGE_PLACEHOLDER, NON_VISION_TOOL_IMAGE_PLACEHOLDER;
var init_transform_messages = __esm({
  "packages/ai/src/providers/transform-messages.ts"() {
    "use strict";
    init_anthropic_model_contract();
    init_tool_result_text();
    NON_VISION_USER_IMAGE_PLACEHOLDER = "(image omitted: model does not support images)";
    NON_VISION_TOOL_IMAGE_PLACEHOLDER = "(tool image omitted: model does not support images)";
  }
});

// packages/ai/src/providers/anthropic.ts
var anthropic_exports = {};
__export(anthropic_exports, {
  streamAnthropic: () => streamAnthropic,
  streamSimpleAnthropic: () => streamSimpleAnthropic
});
import Anthropic from "@anthropic-ai/sdk";
import { Stream } from "@anthropic-ai/sdk/core/streaming.js";
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
  const fetch2 = getAiTransportHost().buildModelFetch(model, void 0, fetchOptions);
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
      fetch: fetch2
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
      fetch: fetch2
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
      fetch: fetch2
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
      fetch: fetch2
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
    fetch: fetch2
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
var ANTHROPIC_CACHE_CONTROL_LIMIT, EMPTY_ERROR_TOOL_RESULT_TEXT, claudeCodeVersion, claudeCodeBillingSystemBlock, claudeCodeTools, ccToolLookup, toClaudeCodeName, FINE_GRAINED_TOOL_STREAMING_BETA, INTERLEAVED_THINKING_BETA, ANTHROPIC_MIN_THINKING_BUDGET_TOKENS, ANTHROPIC_MESSAGE_EVENTS, streamAnthropic, streamSimpleAnthropic;
var init_anthropic2 = __esm({
  "packages/ai/src/providers/anthropic.ts"() {
    "use strict";
    init_env_api_keys();
    init_host();
    init_model_utils();
    init_deferred_event_buffer();
    init_event_stream2();
    init_headers();
    init_json_parse();
    init_llm_request_activity();
    init_sanitize_unicode();
    init_system_prompt_cache_boundary();
    init_anthropic_auth_headers();
    init_anthropic_model_contract();
    init_anthropic_refusal();
    init_anthropic_server_fallback();
    init_anthropic_thinking_replay();
    init_anthropic_tool_projection();
    init_anthropic_usage();
    init_cache_retention();
    init_cloudflare();
    init_github_copilot_headers();
    init_simple_options();
    init_tool_result_text();
    init_transform_messages();
    ANTHROPIC_CACHE_CONTROL_LIMIT = 4;
    EMPTY_ERROR_TOOL_RESULT_TEXT = "[tool error with no output]";
    claudeCodeVersion = "2.1.75";
    claudeCodeBillingSystemBlock = `x-anthropic-billing-header: cc_version=${claudeCodeVersion}; cc_entrypoint=sdk-cli;`;
    claudeCodeTools = [
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
    ccToolLookup = new Map(claudeCodeTools.map((t) => [t.toLowerCase(), t]));
    toClaudeCodeName = (name) => ccToolLookup.get(name.toLowerCase()) ?? name;
    FINE_GRAINED_TOOL_STREAMING_BETA = "fine-grained-tool-streaming-2025-05-14";
    INTERLEAVED_THINKING_BETA = "interleaved-thinking-2025-05-14";
    ANTHROPIC_MIN_THINKING_BUDGET_TOKENS = 1024;
    ANTHROPIC_MESSAGE_EVENTS = /* @__PURE__ */ new Set([
      "message_start",
      "message_delta",
      "message_stop",
      "content_block_start",
      "content_block_delta",
      "content_block_stop"
    ]);
    streamAnthropic = (model, context, options) => {
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
    streamSimpleAnthropic = (model, context, options) => {
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
  }
});

// packages/ai/src/utils/provider-error.ts
function stringify(value) {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}
function readStatus(error) {
  for (const value of [
    error.status,
    error.statusCode,
    error.response?.status,
    error.response?.statusCode
  ]) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return void 0;
}
function readBody(error) {
  for (const value of [error.body, error.error, error.response?.body, error.response?.data]) {
    if (value === void 0 || value === null) {
      continue;
    }
    if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) {
      continue;
    }
    const body = (typeof value === "string" ? value : stringify(value)).trim();
    if (body.length > 0) {
      return body.length <= MAX_ERROR_BODY_LENGTH ? body : `${body.slice(0, MAX_ERROR_BODY_LENGTH)}... [truncated]`;
    }
  }
  return void 0;
}
function formatProviderError(error) {
  if (!(error instanceof Error)) {
    return stringify(error);
  }
  const httpError = error;
  const status = readStatus(httpError);
  const body = readBody(httpError);
  if (status === void 0 || body === void 0 || error.message.includes(body)) {
    return error.message;
  }
  return `${status}: ${body}`;
}
var MAX_ERROR_BODY_LENGTH;
var init_provider_error = __esm({
  "packages/ai/src/utils/provider-error.ts"() {
    "use strict";
    MAX_ERROR_BODY_LENGTH = 4e3;
  }
});

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
var init_fences = __esm({
  "packages/markdown-core/src/fences.ts"() {
    "use strict";
  }
});

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
var init_code_spans = __esm({
  "packages/markdown-core/src/code-spans.ts"() {
    "use strict";
    init_fences();
  }
});

// packages/ai/src/utils/reasoning-tag-text-partitioner.ts
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
var REASONING_TAG_RE, REASONING_TAG_NAMES;
var init_reasoning_tag_text_partitioner = __esm({
  "packages/ai/src/utils/reasoning-tag-text-partitioner.ts"() {
    "use strict";
    init_code_spans();
    REASONING_TAG_RE = /<\s*(\/?)\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought|reasoning)|antthinking)\b[^<>]*>/gi;
    REASONING_TAG_NAMES = [
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
  }
});

// packages/normalization-core/src/number-coercion.ts
function asFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
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
var MAX_TIMER_TIMEOUT_MS, MAX_TIMER_TIMEOUT_SECONDS;
var init_number_coercion = __esm({
  "packages/normalization-core/src/number-coercion.ts"() {
    "use strict";
    MAX_TIMER_TIMEOUT_MS = 2147e6;
    MAX_TIMER_TIMEOUT_SECONDS = Math.floor(MAX_TIMER_TIMEOUT_MS / 1e3);
  }
});

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
var init_stream_first_event_timeout = __esm({
  "packages/ai/src/utils/stream-first-event-timeout.ts"() {
    "use strict";
    init_number_coercion();
  }
});

// packages/ai/src/providers/openai-prompt-cache.ts
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
var OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH;
var init_openai_prompt_cache = __esm({
  "packages/ai/src/providers/openai-prompt-cache.ts"() {
    "use strict";
    OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH = 64;
  }
});

// packages/ai/src/providers/openai-stop-reason.ts
function mapOpenAIStopReason(reason, options) {
  if (reason === null) {
    return { stopReason: "stop" };
  }
  switch (reason) {
    case "stop":
    case "end":
      return { stopReason: "stop" };
    case "length":
      return { stopReason: "length" };
    case "function_call":
    case "tool_calls":
      return { stopReason: "toolUse" };
    case "tool_call":
      if (options?.allowSingularToolCall) {
        return { stopReason: "toolUse" };
      }
      break;
    case "content_filter":
      return { stopReason: "error", errorMessage: "Provider finish_reason: content_filter" };
    case "network_error":
      return { stopReason: "error", errorMessage: "Provider finish_reason: network_error" };
  }
  return {
    stopReason: "error",
    errorMessage: `Provider finish_reason: ${reason}`
  };
}
var init_openai_stop_reason = __esm({
  "packages/ai/src/providers/openai-stop-reason.ts"() {
    "use strict";
  }
});

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
function requireProjectedFunction(name, projection, choiceLabel) {
  if (!projection.tools.some((tool) => tool.name === name)) {
    throw new Error(`${choiceLabel} requested unavailable tool "${name}" after schema conversion`);
  }
}
function reconcileOpenAICompletionsToolChoice(choice, projection) {
  if (choice === "auto") {
    return projection.tools.length > 0 ? choice : void 0;
  }
  if (choice === "required") {
    if (projection.tools.length === 0) {
      throw new Error(
        "OpenAI Chat Completions tool_choice requires a tool, but no tools survived schema conversion"
      );
    }
    return choice;
  }
  if (choice === "none" || !isRecord(choice)) {
    return choice;
  }
  const choiceType = choice.type;
  if (choiceType === "custom") {
    throw new Error(
      "OpenAI Chat Completions custom tool_choice is unsupported because this adapter emits function tools only"
    );
  }
  if (choiceType === "function") {
    const functionChoice = choice.function;
    if (!isRecord(functionChoice)) {
      return choice;
    }
    const functionName = functionChoice.name;
    if (typeof functionName !== "string") {
      return choice;
    }
    requireProjectedFunction(functionName, projection, "OpenAI Chat Completions tool_choice");
    return { type: "function", function: { name: functionName } };
  }
  if (choiceType !== "allowed_tools") {
    return choice;
  }
  const allowedConfig = choice.allowed_tools;
  if (!isRecord(allowedConfig)) {
    return choice;
  }
  const mode = allowedConfig.mode;
  const tools = allowedConfig.tools;
  if (mode !== "auto" && mode !== "required" || !Array.isArray(tools)) {
    return choice;
  }
  const normalizedAllowedTools = [];
  for (const tool of tools) {
    if (!isRecord(tool) || tool.type !== "function") {
      continue;
    }
    const functionChoice = tool.function;
    const functionName = isRecord(functionChoice) ? functionChoice.name : void 0;
    if (typeof functionName === "string" && projection.tools.some((projectedTool) => projectedTool.name === functionName)) {
      normalizedAllowedTools.push({
        type: "function",
        function: { name: functionName }
      });
    }
  }
  if (normalizedAllowedTools.length === 0) {
    if (mode === "auto") {
      return "none";
    }
    throw new Error(
      "OpenAI Chat Completions tool_choice requires a tool, but no allowed tools survived schema conversion"
    );
  }
  return {
    type: "allowed_tools",
    allowed_tools: {
      mode,
      tools: normalizedAllowedTools
    }
  };
}
var init_openai_tool_projection = __esm({
  "packages/ai/src/providers/openai-tool-projection.ts"() {
    "use strict";
    init_record_coerce();
    init_tool_schema_json_projection();
  }
});

// packages/ai/src/providers/openai-completions.ts
var openai_completions_exports = {};
__export(openai_completions_exports, {
  convertMessages: () => convertMessages2,
  streamOpenAICompletions: () => streamOpenAICompletions,
  streamSimpleOpenAICompletions: () => streamSimpleOpenAICompletions
});
import OpenAI from "openai";
function hasToolHistory(messages) {
  for (const msg of messages) {
    if (msg.role === "toolResult") {
      return true;
    }
    if (msg.role === "assistant") {
      if (Array.isArray(msg.content) && msg.content.some((block) => block.type === "toolCall")) {
        return true;
      }
    }
  }
  return false;
}
function isTextContentBlock(block) {
  return block.type === "text";
}
function isThinkingContentBlock(block) {
  return block.type === "thinking";
}
function isToolCallBlock(block) {
  return block.type === "toolCall";
}
function sanitizeToolResultText(text, fallback) {
  const sanitized = sanitizeSurrogates(text);
  return sanitized.trim().length > 0 ? sanitized : fallback;
}
function isEncryptedReasoningDetail(detail) {
  if (typeof detail !== "object" || detail === null) {
    return false;
  }
  const candidate = detail;
  return candidate.type === "reasoning.encrypted" && typeof candidate.id === "string" && candidate.id.length > 0 && typeof candidate.data === "string" && candidate.data.length > 0;
}
function createClient2(model, context, apiKey, optionsHeaders, sessionId, compat = getCompat(model)) {
  if (!apiKey) {
    throw new Error(`No API key for provider: ${model.provider}`);
  }
  const headers = { ...model.headers };
  if (model.provider === "github-copilot") {
    const hasImages = hasCopilotVisionInput(context.messages);
    const copilotHeaders = buildCopilotDynamicHeaders({
      messages: context.messages,
      hasImages
    });
    Object.assign(headers, copilotHeaders);
  }
  if (sessionId && compat.sendSessionAffinityHeaders) {
    if (compat.sessionAffinityFormat === "openrouter") {
      headers["x-session-id"] = sessionId;
    } else {
      headers.session_id = sessionId;
      headers["x-client-request-id"] = sessionId;
      headers["x-session-affinity"] = sessionId;
    }
  }
  if (optionsHeaders) {
    Object.assign(headers, optionsHeaders);
  }
  const defaultHeaders = model.provider === "cloudflare-ai-gateway" ? {
    ...headers,
    Authorization: headers.Authorization ?? null,
    "cf-aig-authorization": `Bearer ${apiKey}`
  } : headers;
  return new OpenAI({
    apiKey,
    baseURL: isCloudflareProvider(model.provider) ? resolveCloudflareBaseUrl(model) : model.baseUrl,
    dangerouslyAllowBrowser: true,
    defaultHeaders,
    // OpenAI supports custom fetch, so sentinels stay opaque until guarded egress.
    fetch: getAiTransportHost().buildModelFetch(model)
  });
}
function buildParams2(model, context, options, compat = getCompat(model), cacheRetention = resolveCacheRetention(options?.cacheRetention)) {
  const cacheControl = getCompatCacheControl(compat, cacheRetention);
  const cacheOptOutIndexes = /* @__PURE__ */ new Set();
  const messages = convertMessages2(model, context, compat, {
    cacheOptOutIndexes,
    preserveSystemPromptCacheBoundary: cacheControl !== void 0
  });
  const supportsPromptCacheKey = model.baseUrl.includes("api.openai.com") || compat.supportsPromptCacheKey;
  const promptCacheKey = supportsPromptCacheKey && cacheRetention !== "none" ? clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId) : void 0;
  const params = {
    model: model.id,
    messages,
    stream: true,
    prompt_cache_key: promptCacheKey,
    prompt_cache_retention: supportsPromptCacheKey && cacheRetention === "long" && compat.supportsLongCacheRetention ? "24h" : void 0
  };
  if (compat.supportsUsageInStreaming) {
    params.stream_options = { include_usage: true };
  }
  if (compat.supportsStore) {
    params.store = false;
  }
  if (options?.maxTokens) {
    const maxTokens = clampOpenAICompletionsMaxTokens(model, options.maxTokens);
    if (compat.maxTokensField === "max_tokens") {
      params.max_tokens = maxTokens;
    } else {
      params.max_completion_tokens = maxTokens;
    }
  }
  if (options?.temperature !== void 0) {
    params.temperature = options.temperature;
  }
  if (options?.stop !== void 0 && options.stop.length > 0) {
    params.stop = options.stop;
  }
  let toolProjection;
  if (context.tools) {
    const converted = convertTools2(context.tools, compat);
    toolProjection = converted.projection;
    if (converted.tools.length > 0) {
      params.tools = converted.tools;
    } else if (hasToolHistory(context.messages)) {
      params.tools = [];
    }
    if (compat.zaiToolStream && converted.tools.length > 0) {
      params.tool_stream = true;
    }
  } else if (hasToolHistory(context.messages)) {
    params.tools = [];
  }
  if (cacheControl) {
    applyAnthropicCacheControl(messages, params.tools, cacheControl, cacheOptOutIndexes);
  }
  if (options?.toolChoice) {
    const toolChoice = reconcileOpenAICompletionsToolChoice(
      options.toolChoice,
      toolProjection ?? projectOpenAITools([])
    );
    if (toolChoice !== void 0) {
      params.tool_choice = toolChoice;
    }
  }
  if (compat.thinkingFormat === "zai" && model.reasoning) {
    params.thinking = options?.reasoningEffort ? { type: "enabled", clear_thinking: false } : { type: "disabled" };
  } else if (compat.thinkingFormat === "qwen" && model.reasoning) {
    params.enable_thinking = Boolean(options?.reasoningEffort);
  } else if (compat.thinkingFormat === "qwen-chat-template" && model.reasoning) {
    params.chat_template_kwargs = {
      enable_thinking: Boolean(options?.reasoningEffort),
      preserve_thinking: true
    };
  } else if (compat.thinkingFormat === "deepseek" && model.reasoning) {
    params.thinking = { type: options?.reasoningEffort ? "enabled" : "disabled" };
    if (options?.reasoningEffort && compat.supportsReasoningEffort) {
      params.reasoning_effort = model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
    }
  } else if (compat.thinkingFormat === "openrouter" && model.reasoning) {
    const openRouterParams = params;
    if (options?.reasoningEffort) {
      openRouterParams.reasoning = {
        effort: model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort
      };
    } else if (model.thinkingLevelMap?.off !== null) {
      openRouterParams.reasoning = { effort: model.thinkingLevelMap?.off ?? "none" };
    }
  } else if (compat.thinkingFormat === "together" && model.reasoning) {
    const togetherParams = params;
    togetherParams.reasoning = { enabled: Boolean(options?.reasoningEffort) };
    if (options?.reasoningEffort && compat.supportsReasoningEffort) {
      togetherParams.reasoning_effort = model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
    }
  } else if (options?.reasoningEffort && model.reasoning && compat.supportsReasoningEffort) {
    params.reasoning_effort = model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
  } else if (!options?.reasoningEffort && model.reasoning && compat.supportsReasoningEffort) {
    const offValue = model.thinkingLevelMap?.off;
    if (typeof offValue === "string") {
      params.reasoning_effort = offValue;
    }
  }
  if (model.compat?.openRouterRouting) {
    params.provider = model.compat.openRouterRouting;
  }
  if (model.baseUrl.includes("ai-gateway.vercel.sh") && model.compat?.vercelGatewayRouting) {
    const routing = model.compat.vercelGatewayRouting;
    if (routing.only || routing.order) {
      const gatewayOptions = {};
      if (routing.only) {
        gatewayOptions.only = routing.only;
      }
      if (routing.order) {
        gatewayOptions.order = routing.order;
      }
      params.providerOptions = { gateway: gatewayOptions };
    }
  }
  return params;
}
function clampOpenAICompletionsMaxTokens(model, requestedMaxTokens) {
  const modelMaxTokens = typeof model.maxTokens === "number" && Number.isFinite(model.maxTokens) && model.maxTokens > 0 ? Math.floor(model.maxTokens) : void 0;
  return modelMaxTokens === void 0 || requestedMaxTokens <= modelMaxTokens ? requestedMaxTokens : modelMaxTokens;
}
function getCompatCacheControl(compat, cacheRetention) {
  if (compat.cacheControlFormat !== "anthropic" || cacheRetention === "none") {
    return void 0;
  }
  const ttl = cacheRetention === "long" && compat.supportsLongCacheRetention ? "1h" : void 0;
  return { type: "ephemeral", ...ttl ? { ttl } : {} };
}
function applyAnthropicCacheControl(messages, tools, cacheControl, cacheOptOutIndexes) {
  addCacheControlToSystemPrompt(messages, cacheControl);
  addCacheControlToLastTool(tools, cacheControl);
  addCacheControlToLastConversationMessage(messages, cacheControl, cacheOptOutIndexes);
}
function addCacheControlToSystemPrompt(messages, cacheControl) {
  for (const message of messages) {
    if (message.role === "system" || message.role === "developer") {
      addCacheControlToInstructionMessage(message, cacheControl);
      return;
    }
  }
}
function addCacheControlToLastConversationMessage(messages, cacheControl, cacheOptOutIndexes) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (!message || cacheOptOutIndexes.has(i)) {
      continue;
    }
    if (message.role === "user" || message.role === "assistant") {
      if (addCacheControlToMessage(message, cacheControl)) {
        return;
      }
    }
  }
}
function addCacheControlToLastTool(tools, cacheControl) {
  if (!tools || tools.length === 0) {
    return;
  }
  const lastTool = tools.at(-1);
  if (!lastTool) {
    return;
  }
  lastTool.cache_control = cacheControl;
}
function addCacheControlToInstructionMessage(message, cacheControl) {
  return addCacheControlToTextContent(message, cacheControl);
}
function addCacheControlToMessage(message, cacheControl) {
  if (message.role === "user" || message.role === "assistant") {
    return addCacheControlToTextContent(message, cacheControl);
  }
  return false;
}
function addCacheControlToTextContent(message, cacheControl) {
  const content = message.content;
  if (typeof content === "string") {
    if (content.length === 0) {
      return false;
    }
    message.content = buildCacheControlledTextParts(content, cacheControl);
    return true;
  }
  if (!Array.isArray(content)) {
    return false;
  }
  for (let i = content.length - 1; i >= 0; i--) {
    const part = content[i];
    if (part?.type === "text") {
      const text = part.text;
      content.splice(i, 1, ...buildCacheControlledTextParts(text, cacheControl));
      return true;
    }
  }
  return false;
}
function buildCacheControlledTextParts(text, cacheControl) {
  const split = splitSystemPromptCacheBoundary(text);
  if (!split) {
    return [{ type: "text", text, cache_control: cacheControl }];
  }
  const parts = [];
  if (split.stablePrefix) {
    parts.push({
      type: "text",
      text: split.stablePrefix,
      cache_control: cacheControl
    });
  }
  if (split.dynamicSuffix) {
    parts.push({ type: "text", text: split.dynamicSuffix });
  }
  return parts.length > 0 ? parts : [{ type: "text", text: "" }];
}
function convertMessages2(model, context, compat, options = {}) {
  const params = [];
  const normalizeToolCallId2 = (id) => {
    if (id.includes("|")) {
      const callId = id.slice(0, id.indexOf("|"));
      return callId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
    }
    if (model.provider === "openai") {
      return id.length > 40 ? id.slice(0, 40) : id;
    }
    return id;
  };
  const transformedMessages = transformMessages(
    context.messages,
    model,
    (id) => normalizeToolCallId2(id)
  );
  if (context.systemPrompt) {
    const useDeveloperRole = model.reasoning && compat.supportsDeveloperRole;
    const role = useDeveloperRole ? "developer" : "system";
    const systemPrompt = options.preserveSystemPromptCacheBoundary ? context.systemPrompt : stripSystemPromptCacheBoundary(context.systemPrompt);
    params.push({
      role,
      content: sanitizeSurrogates(systemPrompt)
    });
  }
  let lastRole = null;
  for (let i = 0; i < transformedMessages.length; i++) {
    const msg = transformedMessages[i];
    if (!msg) {
      continue;
    }
    if (compat.requiresAssistantAfterToolResult && lastRole === "toolResult" && msg.role === "user") {
      params.push({
        role: "assistant",
        content: "I have processed the tool results."
      });
    }
    if (msg.role === "user") {
      const isRuntimeContextCarrier = msg.runtimeContextCarrier === true;
      if (typeof msg.content === "string") {
        const userParam = {
          role: "user",
          content: sanitizeSurrogates(msg.content)
        };
        if (isRuntimeContextCarrier) {
          options.cacheOptOutIndexes?.add(params.length);
        }
        params.push(userParam);
      } else {
        const content = msg.content.map(
          (item) => {
            if (item.type === "text") {
              return {
                type: "text",
                text: sanitizeSurrogates(item.text)
              };
            }
            return {
              type: "image_url",
              image_url: {
                url: `data:${item.mimeType};base64,${item.data}`
              }
            };
          }
        );
        if (content.length === 0) {
          continue;
        }
        const userParam = {
          role: "user",
          content
        };
        if (isRuntimeContextCarrier) {
          options.cacheOptOutIndexes?.add(params.length);
        }
        params.push(userParam);
      }
    } else if (msg.role === "assistant") {
      const assistantMsg = {
        role: "assistant",
        content: compat.requiresAssistantAfterToolResult ? "" : null
      };
      const assistantTextParts = msg.content.filter(isTextContentBlock).filter((block) => block.text.trim().length > 0).map(
        (block) => ({
          type: "text",
          text: sanitizeSurrogates(block.text)
        })
      );
      const assistantText = assistantTextParts.map((part) => part.text).join("");
      const nonEmptyThinkingBlocks = msg.content.filter(isThinkingContentBlock).filter((block) => block.thinking.trim().length > 0);
      if (nonEmptyThinkingBlocks.length > 0) {
        if (compat.requiresThinkingAsText) {
          const thinkingText = nonEmptyThinkingBlocks.map((block) => sanitizeSurrogates(block.thinking)).join("\n\n");
          assistantMsg.content = [{ type: "text", text: thinkingText }, ...assistantTextParts];
        } else {
          if (assistantText.length > 0) {
            assistantMsg.content = assistantText;
          }
          let signature = nonEmptyThinkingBlocks.at(0)?.thinkingSignature;
          if (model.provider === "opencode-go" && signature === "reasoning") {
            signature = "reasoning_content";
          }
          if (signature && signature.length > 0) {
            assistantMsg[signature] = nonEmptyThinkingBlocks.map((block) => block.thinking).join("\n");
          }
        }
      } else if (assistantText.length > 0) {
        assistantMsg.content = assistantText;
      }
      const toolCalls = msg.content.filter(isToolCallBlock);
      if (toolCalls.length > 0) {
        assistantMsg.tool_calls = toolCalls.map((tc) => ({
          id: tc.id,
          type: "function",
          function: {
            name: tc.name,
            arguments: JSON.stringify(tc.arguments)
          }
        }));
        const reasoningDetails = toolCalls.flatMap((tc) => {
          const signature = tc.thoughtSignature;
          if (!signature) {
            return [];
          }
          try {
            const parsed = JSON.parse(signature);
            return parsed ? [parsed] : [];
          } catch {
            return [];
          }
        });
        if (reasoningDetails.length > 0) {
          assistantMsg.reasoning_details = reasoningDetails;
        }
      }
      if (compat.requiresReasoningContentOnAssistantMessages && model.reasoning && assistantMsg.reasoning_content === void 0) {
        assistantMsg.reasoning_content = "";
      }
      const content = assistantMsg.content;
      const hasContent = content !== null && content !== void 0 && (typeof content === "string" ? content.length > 0 : content.length > 0);
      if (!hasContent && !assistantMsg.tool_calls) {
        continue;
      }
      params.push(assistantMsg);
    } else if (msg.role === "toolResult") {
      const imageBlocks = [];
      let j = i;
      while (j < transformedMessages.length) {
        const toolMsg = transformedMessages.at(j);
        if (toolMsg?.role !== "toolResult") {
          break;
        }
        const textResult = extractToolResultText(toolMsg.content);
        const mediaPlaceholder = describeToolResultMediaPlaceholder(toolMsg.content);
        const hasImages = toolMsg.content.some(isImageWithMediaPayload);
        const content = sanitizeToolResultText(
          textResult,
          mediaPlaceholder ?? EMPTY_TOOL_RESULT_TEXT
        );
        const toolResultMsg = {
          role: "tool",
          content,
          tool_call_id: toolMsg.toolCallId
        };
        if (compat.requiresToolResultName && toolMsg.toolName) {
          toolResultMsg.name = toolMsg.toolName;
        }
        params.push(toolResultMsg);
        if (hasImages && model.input.includes("image")) {
          for (const block of toolMsg.content) {
            if (isImageWithMediaPayload(block)) {
              imageBlocks.push({
                type: "image_url",
                image_url: {
                  url: `data:${block.mimeType};base64,${block.data}`
                }
              });
            }
          }
        }
        j += 1;
      }
      i = j - 1;
      if (imageBlocks.length > 0) {
        if (compat.requiresAssistantAfterToolResult) {
          params.push({
            role: "assistant",
            content: "I have processed the tool results."
          });
        }
        params.push({
          role: "user",
          content: [
            {
              type: "text",
              text: "Attached image(s) from tool result:"
            },
            ...imageBlocks
          ]
        });
        lastRole = "user";
      } else {
        lastRole = "toolResult";
      }
      continue;
    }
    lastRole = msg.role;
  }
  return params;
}
function convertTools2(tools, compat) {
  const projection = projectOpenAITools(tools);
  return {
    projection,
    tools: projection.tools.map((tool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
        // Only include strict if provider supports it. Some reject unknown fields.
        ...compat.supportsStrictMode && { strict: false }
      }
    }))
  };
}
function parseChunkUsage(rawUsage, model) {
  const promptTokens = rawUsage.prompt_tokens || 0;
  const cacheReadTokens = rawUsage.prompt_tokens_details?.cached_tokens ?? rawUsage.prompt_cache_hit_tokens ?? 0;
  const cacheWriteTokens = rawUsage.prompt_tokens_details?.cache_write_tokens || 0;
  const input = Math.max(0, promptTokens - cacheReadTokens - cacheWriteTokens);
  const outputTokens = rawUsage.completion_tokens || 0;
  const usage = {
    input,
    output: outputTokens,
    cacheRead: cacheReadTokens,
    cacheWrite: cacheWriteTokens,
    totalTokens: input + outputTokens + cacheReadTokens + cacheWriteTokens,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
  };
  calculateCost(model, usage);
  applyProviderReportedUsageCost(usage, rawUsage.cost);
  return usage;
}
function detectCompat(model) {
  const provider = model.provider;
  const baseUrl = model.baseUrl;
  const isZai = provider === "zai" || baseUrl.includes("api.z.ai");
  const isTogether = provider === "together" || baseUrl.includes("api.together.ai") || baseUrl.includes("api.together.xyz");
  const isMoonshot = provider === "moonshotai" || provider === "moonshotai-cn" || baseUrl.includes("api.moonshot.");
  const isCloudflareWorkersAI = provider === "cloudflare-workers-ai" || baseUrl.includes("api.cloudflare.com");
  const isCloudflareAiGateway = provider === "cloudflare-ai-gateway" || baseUrl.includes("gateway.ai.cloudflare.com");
  const isOpenRouter = provider === "openrouter" || baseUrl.includes("openrouter.ai");
  const isNonStandard = provider === "cerebras" || baseUrl.includes("cerebras.ai") || provider === "xai" || baseUrl.includes("api.x.ai") || isTogether || baseUrl.includes("chutes.ai") || baseUrl.includes("deepseek.com") || isZai || isMoonshot || provider === "opencode" || baseUrl.includes("opencode.ai") || isCloudflareWorkersAI || isCloudflareAiGateway;
  const useMaxTokens = baseUrl.includes("chutes.ai") || isMoonshot || isCloudflareAiGateway || isTogether || isZai;
  const isGrok = provider === "xai" || baseUrl.includes("api.x.ai");
  const isDeepSeek = provider === "deepseek" || baseUrl.includes("deepseek.com");
  const isXiaomi = provider === "xiaomi" || baseUrl.includes("xiaomimimo.com");
  const supportsOpenRouterDeveloperRole = isOpenRouter && (model.id.startsWith("anthropic/") || model.id.startsWith("openai/"));
  const usesOpenRouterSessionAffinity = isOpenRouter || model.compat?.thinkingFormat === "openrouter" || model.compat?.openRouterRouting !== void 0;
  const cacheControlFormat = provider === "openrouter" && model.id.startsWith("anthropic/") ? "anthropic" : void 0;
  return {
    supportsStore: !isNonStandard,
    supportsDeveloperRole: supportsOpenRouterDeveloperRole || !isNonStandard && !isOpenRouter,
    supportsReasoningEffort: !isGrok && !isZai && !isMoonshot && !isTogether && !isCloudflareAiGateway,
    supportsUsageInStreaming: true,
    maxTokensField: useMaxTokens ? "max_tokens" : "max_completion_tokens",
    requiresToolResultName: false,
    requiresAssistantAfterToolResult: false,
    requiresThinkingAsText: false,
    requiresReasoningContentOnAssistantMessages: isDeepSeek || isXiaomi,
    thinkingFormat: isDeepSeek ? "deepseek" : isXiaomi ? "deepseek" : isZai ? "zai" : isTogether ? "together" : isOpenRouter ? "openrouter" : "openai",
    openRouterRouting: {},
    vercelGatewayRouting: {},
    zaiToolStream: false,
    supportsStrictMode: !isMoonshot && !isTogether && !isCloudflareAiGateway,
    cacheControlFormat,
    sendSessionAffinityHeaders: false,
    sessionAffinityFormat: usesOpenRouterSessionAffinity ? "openrouter" : "openai",
    supportsPromptCacheKey: false,
    supportsLongCacheRetention: !(isTogether || isCloudflareWorkersAI || isCloudflareAiGateway)
  };
}
function getCompat(model) {
  const detected = detectCompat(model);
  if (!model.compat) {
    return detected;
  }
  return {
    supportsStore: model.compat.supportsStore ?? detected.supportsStore,
    supportsDeveloperRole: model.compat.supportsDeveloperRole ?? detected.supportsDeveloperRole,
    supportsReasoningEffort: model.compat.supportsReasoningEffort ?? detected.supportsReasoningEffort,
    supportsUsageInStreaming: model.compat.supportsUsageInStreaming ?? detected.supportsUsageInStreaming,
    maxTokensField: model.compat.maxTokensField ?? detected.maxTokensField,
    requiresToolResultName: model.compat.requiresToolResultName ?? detected.requiresToolResultName,
    requiresAssistantAfterToolResult: model.compat.requiresAssistantAfterToolResult ?? detected.requiresAssistantAfterToolResult,
    requiresThinkingAsText: model.compat.requiresThinkingAsText ?? detected.requiresThinkingAsText,
    requiresReasoningContentOnAssistantMessages: model.compat.requiresReasoningContentOnAssistantMessages ?? detected.requiresReasoningContentOnAssistantMessages,
    thinkingFormat: model.compat.thinkingFormat ?? detected.thinkingFormat,
    openRouterRouting: model.compat.openRouterRouting ?? {},
    vercelGatewayRouting: model.compat.vercelGatewayRouting ?? detected.vercelGatewayRouting,
    zaiToolStream: model.compat.zaiToolStream ?? detected.zaiToolStream,
    supportsStrictMode: model.compat.supportsStrictMode ?? detected.supportsStrictMode,
    cacheControlFormat: model.compat.cacheControlFormat ?? detected.cacheControlFormat,
    sendSessionAffinityHeaders: model.compat.sendSessionAffinityHeaders ?? detected.sendSessionAffinityHeaders,
    sessionAffinityFormat: detected.sessionAffinityFormat,
    supportsPromptCacheKey: model.compat.supportsPromptCacheKey ?? detected.supportsPromptCacheKey,
    supportsLongCacheRetention: model.compat.supportsLongCacheRetention ?? detected.supportsLongCacheRetention
  };
}
var EMPTY_TOOL_RESULT_TEXT, streamOpenAICompletions, streamSimpleOpenAICompletions;
var init_openai_completions = __esm({
  "packages/ai/src/providers/openai-completions.ts"() {
    "use strict";
    init_env_api_keys();
    init_host();
    init_model_utils();
    init_event_stream2();
    init_headers();
    init_json_parse();
    init_provider_error();
    init_reasoning_tag_text_partitioner();
    init_sanitize_unicode();
    init_stream_first_event_timeout();
    init_system_prompt_cache_boundary();
    init_cache_retention();
    init_cloudflare();
    init_github_copilot_headers();
    init_openai_prompt_cache();
    init_openai_stop_reason();
    init_openai_tool_projection();
    init_simple_options();
    init_tool_result_text();
    init_transform_messages();
    EMPTY_TOOL_RESULT_TEXT = "(no output)";
    streamOpenAICompletions = (model, context, options) => {
      const stream = new AssistantMessageEventStream();
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
        let firstEventAbort;
        try {
          const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
          const compat = getCompat(model);
          const cacheRetention = resolveCacheRetention(options?.cacheRetention);
          const cacheSessionId = cacheRetention === "none" ? void 0 : options?.sessionId;
          const client = createClient2(model, context, apiKey, options?.headers, cacheSessionId, compat);
          let params = buildParams2(model, context, options, compat, cacheRetention);
          const nextParams = await options?.onPayload?.(params, model);
          if (nextParams !== void 0) {
            params = nextParams;
          }
          firstEventAbort = createFirstStreamEventAbortController(options?.signal);
          const requestOptions = {
            signal: firstEventAbort.signal,
            ...options?.timeoutMs !== void 0 ? { timeout: options.timeoutMs } : {},
            maxRetries: options?.maxRetries ?? 0
          };
          const { data: openaiStream, response } = await client.chat.completions.create(
            params,
            requestOptions
          ).withResponse();
          await options?.onResponse?.(
            { status: response.status, headers: headersToRecord(response.headers) },
            model
          );
          stream.push({ type: "start", partial: output });
          let textBlock = null;
          let thinkingBlock = null;
          let hasFinishReason = false;
          const toolCallBlocksByIndex = /* @__PURE__ */ new Map();
          const toolCallBlocksById = /* @__PURE__ */ new Map();
          const toolCallBlocksByFirstId = /* @__PURE__ */ new Map();
          const pendingReasoningDetailsByToolCallId = /* @__PURE__ */ new Map();
          const blocks = output.content;
          const finishedBlocks = /* @__PURE__ */ new Set();
          const contentIndices = /* @__PURE__ */ new WeakMap();
          const appendBlock = (block) => {
            contentIndices.set(block, blocks.length);
            blocks.push(block);
          };
          const getContentIndex = (block) => contentIndices.get(block) ?? -1;
          const rememberFirstToolCallById = (id, block) => {
            if (toolCallBlocksByFirstId.has(id)) {
              return;
            }
            toolCallBlocksByFirstId.set(id, block);
            const pendingDetail = pendingReasoningDetailsByToolCallId.get(id);
            if (pendingDetail) {
              block.thoughtSignature = pendingDetail;
              pendingReasoningDetailsByToolCallId.delete(id);
            }
          };
          const finishBlock = (block) => {
            const contentIndex = getContentIndex(block);
            if (contentIndex === -1 || finishedBlocks.has(block)) {
              return;
            }
            finishedBlocks.add(block);
            if (block.type === "text") {
              stream.push({
                type: "text_end",
                contentIndex,
                content: block.text,
                partial: output
              });
            } else if (block.type === "thinking") {
              stream.push({
                type: "thinking_end",
                contentIndex,
                content: block.thinking,
                partial: output
              });
            } else if (block.type === "toolCall") {
              delete block.partialArgs;
              delete block.streamIndex;
              stream.push({
                type: "toolcall_end",
                contentIndex,
                toolCall: block,
                partial: output
              });
            }
          };
          const ensureTextBlock = () => {
            if (!textBlock) {
              textBlock = { type: "text", text: "" };
              appendBlock(textBlock);
              stream.push({
                type: "text_start",
                contentIndex: getContentIndex(textBlock),
                partial: output
              });
            }
            return textBlock;
          };
          const ensureThinkingBlock = (thinkingSignature) => {
            if (!thinkingBlock) {
              thinkingBlock = {
                type: "thinking",
                thinking: "",
                thinkingSignature
              };
              appendBlock(thinkingBlock);
              stream.push({
                type: "thinking_start",
                contentIndex: getContentIndex(thinkingBlock),
                partial: output
              });
            }
            return thinkingBlock;
          };
          const sealNativeReasoningBeforeText = () => {
            if (thinkingBlock && !reasoningTagTextPartitioner.isInsideReasoning()) {
              finishBlock(thinkingBlock);
              thinkingBlock = null;
            }
          };
          const appendTextDelta = (delta) => {
            sealNativeReasoningBeforeText();
            const block = ensureTextBlock();
            block.text += delta;
            stream.push({
              type: "text_delta",
              contentIndex: getContentIndex(block),
              delta,
              partial: output
            });
          };
          const appendThinkingDelta = (thinkingSignature, delta) => {
            const block = ensureThinkingBlock(thinkingSignature);
            block.thinking += delta;
            stream.push({
              type: "thinking_delta",
              contentIndex: getContentIndex(block),
              delta,
              partial: output
            });
          };
          const ensureToolCallBlock = (toolCall) => {
            const streamIndex = typeof toolCall.index === "number" ? toolCall.index : void 0;
            let block = streamIndex !== void 0 ? toolCallBlocksByIndex.get(streamIndex) : void 0;
            if (!block && toolCall.id) {
              block = toolCallBlocksById.get(toolCall.id);
            }
            if (!block) {
              block = {
                type: "toolCall",
                id: toolCall.id || "",
                name: toolCall.function?.name || "",
                arguments: {},
                partialArgs: "",
                streamIndex
              };
              if (streamIndex !== void 0) {
                toolCallBlocksByIndex.set(streamIndex, block);
              }
              if (toolCall.id) {
                toolCallBlocksById.set(toolCall.id, block);
                rememberFirstToolCallById(toolCall.id, block);
              }
              appendBlock(block);
              stream.push({
                type: "toolcall_start",
                contentIndex: getContentIndex(block),
                partial: output
              });
            }
            if (streamIndex !== void 0 && block.streamIndex === void 0) {
              block.streamIndex = streamIndex;
              toolCallBlocksByIndex.set(streamIndex, block);
            }
            if (toolCall.id) {
              toolCallBlocksById.set(toolCall.id, block);
            }
            return block;
          };
          const reasoningTagTextPartitioner = createReasoningTagTextPartitioner();
          const appendPartitionedContent = (text, hasMirroredReasoning) => {
            const routedDeltas = hasMirroredReasoning ? reasoningTagTextPartitioner.push(text) : reasoningTagTextPartitioner.pushVisible(text);
            for (const delta of routedDeltas) {
              if (delta.kind === "text") {
                appendTextDelta(delta.text);
              }
            }
          };
          const flushPartitionedContent = () => {
            for (const delta of reasoningTagTextPartitioner.flush()) {
              if (delta.kind === "text") {
                appendTextDelta(delta.text);
              }
            }
          };
          const guardedOpenaiStream = withFirstStreamEventTimeout(openaiStream, {
            provider: model.provider,
            api: model.api,
            model: model.id,
            timeoutMs: getFirstStreamEventTimeoutMs(options) ?? 0,
            stage: "completions",
            abort: firstEventAbort.abort,
            onTimeout: getFirstStreamEventTimeoutHandler(options),
            hint: "The provider may be stalled while parsing the tool payload; retry with a smaller tool surface or enable OPENCLAW_DEBUG_MODEL_PAYLOAD=tools to inspect exposed tools."
          });
          for await (const chunk of guardedOpenaiStream) {
            if (!chunk || typeof chunk !== "object") {
              continue;
            }
            output.responseId ||= chunk.id;
            if (typeof chunk.model === "string" && chunk.model.length > 0 && chunk.model !== model.id) {
              output.responseModel ||= chunk.model;
            }
            if (chunk.usage) {
              output.usage = parseChunkUsage(chunk.usage, model);
            }
            const choice = Array.isArray(chunk.choices) ? chunk.choices[0] : void 0;
            if (!choice) {
              continue;
            }
            const choiceUsage = choice.usage;
            if (!chunk.usage && choiceUsage) {
              output.usage = parseChunkUsage(choiceUsage, model);
            }
            if (choice.finish_reason) {
              const finishReasonResult = mapOpenAIStopReason(choice.finish_reason);
              output.stopReason = finishReasonResult.stopReason;
              if (finishReasonResult.errorMessage) {
                output.errorMessage = finishReasonResult.errorMessage;
              }
              hasFinishReason = true;
            }
            const choiceDelta = choice.delta ?? choice.message;
            if (choiceDelta) {
              const reasoningFields = ["reasoning_content", "reasoning", "reasoning_text"];
              const deltaFields = choiceDelta;
              const shouldEmitReasoning = Boolean(model.reasoning && options?.reasoningEffort);
              let foundReasoningField = null;
              for (const field of reasoningFields) {
                const value = deltaFields[field];
                if (typeof value === "string" && value.length > 0) {
                  foundReasoningField = field;
                  break;
                }
              }
              if (foundReasoningField) {
                reasoningTagTextPartitioner.markStrict();
              }
              if (shouldEmitReasoning && foundReasoningField) {
                const delta = deltaFields[foundReasoningField];
                if (typeof delta === "string" && delta.length > 0) {
                  const thinkingSignature = model.provider === "opencode-go" && foundReasoningField === "reasoning" ? "reasoning_content" : foundReasoningField;
                  appendThinkingDelta(thinkingSignature, delta);
                }
              }
              if (choiceDelta.content !== null && choiceDelta.content !== void 0 && choiceDelta.content.length > 0) {
                appendPartitionedContent(choiceDelta.content, Boolean(foundReasoningField));
              }
              const refusalText = typeof choiceDelta.refusal === "string" ? choiceDelta.refusal : "";
              if (refusalText.length > 0) {
                appendPartitionedContent(refusalText, Boolean(foundReasoningField));
              }
              if (choiceDelta.tool_calls) {
                flushPartitionedContent();
                sealNativeReasoningBeforeText();
                for (const toolCall of choiceDelta.tool_calls) {
                  const block = ensureToolCallBlock(toolCall);
                  if (!block.id && toolCall.id) {
                    block.id = toolCall.id;
                    toolCallBlocksById.set(toolCall.id, block);
                    rememberFirstToolCallById(toolCall.id, block);
                  }
                  if (!block.name && toolCall.function?.name) {
                    block.name = toolCall.function.name;
                  }
                  let delta = "";
                  if (toolCall.function?.arguments) {
                    delta = toolCall.function.arguments;
                    block.partialArgs = (block.partialArgs ?? "") + toolCall.function.arguments;
                    block.arguments = parseStreamingJson(block.partialArgs);
                  }
                  stream.push({
                    type: "toolcall_delta",
                    contentIndex: getContentIndex(block),
                    delta,
                    partial: output
                  });
                }
              }
              const reasoningDetails = choiceDelta.reasoning_details;
              if (Array.isArray(reasoningDetails)) {
                for (const detail of reasoningDetails) {
                  if (isEncryptedReasoningDetail(detail)) {
                    const serializedDetail = JSON.stringify(detail);
                    const matchingToolCall = toolCallBlocksByFirstId.get(detail.id);
                    if (matchingToolCall) {
                      matchingToolCall.thoughtSignature = serializedDetail;
                    } else {
                      pendingReasoningDetailsByToolCallId.set(detail.id, serializedDetail);
                    }
                  }
                }
              }
            }
          }
          flushPartitionedContent();
          for (const block of blocks) {
            finishBlock(block);
          }
          if (options?.signal?.aborted) {
            throw new Error("Request was aborted");
          }
          if (output.stopReason === "aborted") {
            throw new Error("Request was aborted");
          }
          if (output.stopReason === "error") {
            throw new Error(output.errorMessage || "Provider returned an error stop reason");
          }
          if (!hasFinishReason) {
            throw new Error("Stream ended without finish_reason");
          }
          const hasToolCalls = output.content.some((block) => block.type === "toolCall");
          const hasVisibleText = output.content.some(
            (block) => block.type === "text" && block.text.trim().length > 0
          );
          if (output.stopReason === "toolUse" && !hasToolCalls) {
            output.stopReason = "stop";
          }
          if (output.stopReason === "stop" && hasToolCalls && !hasVisibleText) {
            output.stopReason = "toolUse";
          }
          if (hasToolCalls && output.stopReason !== "toolUse") {
            output.content = output.content.filter((block) => block.type !== "toolCall");
          }
          stream.push({ type: "done", reason: output.stopReason, message: output });
          stream.end();
        } catch (error) {
          for (const block of output.content) {
            delete block.index;
            delete block.partialArgs;
            delete block.streamIndex;
          }
          output.stopReason = options?.signal?.aborted ? "aborted" : "error";
          output.errorMessage = formatProviderError(error);
          const rawMetadata = error?.error?.metadata?.raw;
          if (rawMetadata && !output.errorMessage.includes(rawMetadata)) {
            output.errorMessage += `
${rawMetadata}`;
          }
          stream.push({ type: "error", reason: output.stopReason, error: output });
          stream.end();
        } finally {
          firstEventAbort?.dispose();
        }
      })();
      return stream;
    };
    streamSimpleOpenAICompletions = (model, context, options) => {
      const apiKey = options?.apiKey || getEnvApiKey(model.provider);
      if (!apiKey) {
        throw new Error(`No API key for provider: ${model.provider}`);
      }
      const base = buildBaseOptions(model, options, apiKey);
      const clampedReasoning = options?.reasoning ? clampThinkingLevel(model, options.reasoning) : void 0;
      const reasoningEffort = clampedReasoning === "off" ? void 0 : clampedReasoning === "max" ? "xhigh" : clampedReasoning;
      const toolChoice = options?.toolChoice;
      return streamOpenAICompletions(model, context, {
        ...base,
        reasoningEffort,
        toolChoice
      });
    };
  }
});

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
var init_hash = __esm({
  "packages/ai/src/utils/hash.ts"() {
    "use strict";
  }
});

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
var init_streaming_byte_guard = __esm({
  "packages/ai/src/utils/streaming-byte-guard.ts"() {
    "use strict";
  }
});

// packages/ai/src/providers/mistral.ts
var mistral_exports = {};
__export(mistral_exports, {
  createBoundedMistralFetcher: () => createBoundedMistralFetcher,
  streamMistral: () => streamMistral,
  streamSimpleMistral: () => streamSimpleMistral
});
import { randomUUID } from "node:crypto";
import { HTTPClient, Mistral } from "@mistralai/mistralai";
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
var MISTRAL_TOOL_CALL_ID_LENGTH, MAX_MISTRAL_ERROR_BODY_CHARS, MISTRAL_STREAM_BODY_MAX_BYTES, streamMistral, streamSimpleMistral;
var init_mistral = __esm({
  "packages/ai/src/providers/mistral.ts"() {
    "use strict";
    init_utf16_slice();
    init_env_api_keys();
    init_host();
    init_model_utils();
    init_event_stream2();
    init_hash();
    init_json_parse();
    init_sanitize_unicode();
    init_streaming_byte_guard();
    init_system_prompt_cache_boundary();
    init_simple_options();
    init_tool_result_text();
    init_transform_messages();
    MISTRAL_TOOL_CALL_ID_LENGTH = 9;
    MAX_MISTRAL_ERROR_BODY_CHARS = 4e3;
    MISTRAL_STREAM_BODY_MAX_BYTES = 16 * 1024 * 1024;
    streamMistral = (model, context, options) => {
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
    streamSimpleMistral = (model, context, options) => {
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
  }
});

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
var init_string_normalization = __esm({
  "packages/normalization-core/src/string-normalization.ts"() {
    "use strict";
    init_string_coerce();
  }
});

// packages/ai/src/providers/openai-reasoning-effort.ts
function normalizeModelId2(id) {
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
  const id = normalizeModelId2(typeof model.id === "string" ? model.id : void 0);
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
  const id = normalizeModelId2(typeof model.id === "string" ? model.id : void 0);
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
var GPT_5_REASONING_EFFORTS, GPT_51_REASONING_EFFORTS, GPT_52_REASONING_EFFORTS, GPT_56_REASONING_EFFORTS, GPT_CODEX_REASONING_EFFORTS, GPT_PRO_REASONING_EFFORTS, GPT_5_PRO_REASONING_EFFORTS, GPT_51_CODEX_MAX_REASONING_EFFORTS, GPT_51_CODEX_MINI_REASONING_EFFORTS, GENERIC_REASONING_EFFORTS, CANONICAL_REASONING_EFFORTS;
var init_openai_reasoning_effort = __esm({
  "packages/ai/src/providers/openai-reasoning-effort.ts"() {
    "use strict";
    init_string_coerce();
    init_string_normalization();
    GPT_5_REASONING_EFFORTS = ["minimal", "low", "medium", "high"];
    GPT_51_REASONING_EFFORTS = ["none", "low", "medium", "high"];
    GPT_52_REASONING_EFFORTS = ["none", "low", "medium", "high", "xhigh"];
    GPT_56_REASONING_EFFORTS = ["none", "low", "medium", "high", "xhigh", "max"];
    GPT_CODEX_REASONING_EFFORTS = ["low", "medium", "high", "xhigh"];
    GPT_PRO_REASONING_EFFORTS = ["medium", "high", "xhigh"];
    GPT_5_PRO_REASONING_EFFORTS = ["high"];
    GPT_51_CODEX_MAX_REASONING_EFFORTS = ["none", "medium", "high", "xhigh"];
    GPT_51_CODEX_MINI_REASONING_EFFORTS = ["medium"];
    GENERIC_REASONING_EFFORTS = ["low", "medium", "high"];
    CANONICAL_REASONING_EFFORTS = /* @__PURE__ */ new Set([
      "none",
      "minimal",
      "low",
      "medium",
      "high",
      "xhigh",
      "max",
      "off"
    ]);
  }
});

// packages/ai/src/providers/openai-responses-stream-compat.ts
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
var OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE, AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE, AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
var init_openai_responses_stream_compat = __esm({
  "packages/ai/src/providers/openai-responses-stream-compat.ts"() {
    "use strict";
    OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE = "output_text";
    AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE = "text";
    AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE = "response.text.delta";
  }
});

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
var init_openai_responses_terminal_usage = __esm({
  "packages/ai/src/providers/openai-responses-terminal-usage.ts"() {
    "use strict";
  }
});

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
var init_openai_responses_tool_call_tracker = __esm({
  "packages/ai/src/providers/openai-responses-tool-call-tracker.ts"() {
    "use strict";
  }
});

// packages/ai/src/providers/clean-for-gemini.ts
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
var GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS, SCHEMA_META_KEYS;
var init_clean_for_gemini = __esm({
  "packages/ai/src/providers/clean-for-gemini.ts"() {
    "use strict";
    GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS = /* @__PURE__ */ new Set([
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
    SCHEMA_META_KEYS = ["description", "title", "default"];
  }
});

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
var init_schema_keyword_strip = __esm({
  "packages/ai/src/providers/schema-keyword-strip.ts"() {
    "use strict";
  }
});

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
var MAX_TOOL_PARAMETER_SCHEMA_CACHE_ENTRIES_PER_SCHEMA, toolParameterSchemaCache, ARRAY_ITEMS_SCHEMA_OBJECT_KEYS, ARRAY_ITEMS_SCHEMA_ARRAY_KEYS, ARRAY_ITEMS_SCHEMA_MAP_KEYS, SCHEMA_MAP_KEYS, SCHEMA_OBJECT_KEYS, SCHEMA_ARRAY_KEYS, SCHEMA_LITERAL_KEYS, OPENAPI_SCHEMA_ANNOTATION_KEYS;
var init_agent_tools_parameter_schema = __esm({
  "packages/ai/src/providers/agent-tools-parameter-schema.ts"() {
    "use strict";
    init_record_coerce();
    init_string_coerce();
    init_string_normalization();
    init_clean_for_gemini();
    init_schema_keyword_strip();
    MAX_TOOL_PARAMETER_SCHEMA_CACHE_ENTRIES_PER_SCHEMA = 8;
    toolParameterSchemaCache = /* @__PURE__ */ new WeakMap();
    ARRAY_ITEMS_SCHEMA_OBJECT_KEYS = /* @__PURE__ */ new Set([
      "additionalProperties",
      "contains",
      "else",
      "if",
      "items",
      "not",
      "propertyNames",
      "then"
    ]);
    ARRAY_ITEMS_SCHEMA_ARRAY_KEYS = /* @__PURE__ */ new Set(["allOf", "anyOf", "oneOf", "prefixItems"]);
    ARRAY_ITEMS_SCHEMA_MAP_KEYS = /* @__PURE__ */ new Set([
      "$defs",
      "definitions",
      "dependentSchemas",
      "patternProperties",
      "properties"
    ]);
    SCHEMA_MAP_KEYS = /* @__PURE__ */ new Set([
      "$defs",
      "definitions",
      "dependentSchemas",
      "patternProperties",
      "properties"
    ]);
    SCHEMA_OBJECT_KEYS = /* @__PURE__ */ new Set([
      "additionalProperties",
      "contains",
      "else",
      "if",
      "items",
      "not",
      "propertyNames",
      "then"
    ]);
    SCHEMA_ARRAY_KEYS = /* @__PURE__ */ new Set(["allOf", "anyOf", "items", "oneOf", "prefixItems"]);
    SCHEMA_LITERAL_KEYS = /* @__PURE__ */ new Set(["const", "default", "enum", "examples"]);
    OPENAPI_SCHEMA_ANNOTATION_KEYS = /* @__PURE__ */ new Set([
      "discriminator",
      "externalDocs",
      "readOnly",
      "writeOnly",
      "xml",
      "example"
    ]);
  }
});

// packages/ai/src/providers/openai-tool-schema-compat.ts
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
var OPENAI_STRICT_COMPAT_SCHEMA_MAP_KEYS, OPENAI_STRICT_COMPAT_SCHEMA_NESTED_KEYS;
var init_openai_tool_schema_compat = __esm({
  "packages/ai/src/providers/openai-tool-schema-compat.ts"() {
    "use strict";
    OPENAI_STRICT_COMPAT_SCHEMA_MAP_KEYS = /* @__PURE__ */ new Set([
      "$defs",
      "definitions",
      "dependentSchemas",
      // Draft-07 dependencies mix schema values with property-name arrays. The
      // recursive helpers leave scalar array entries untouched.
      "dependencies",
      "patternProperties",
      "properties"
    ]);
    OPENAI_STRICT_COMPAT_SCHEMA_NESTED_KEYS = /* @__PURE__ */ new Set([
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
  }
});

// packages/ai/src/providers/openai-tool-schema.ts
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
var MAX_STRICT_SCHEMA_CACHE_ENTRIES_PER_SCHEMA, strictOpenAISchemaCache;
var init_openai_tool_schema = __esm({
  "packages/ai/src/providers/openai-tool-schema.ts"() {
    "use strict";
    init_agent_tools_parameter_schema();
    init_openai_tool_schema_compat();
    init_openai_tool_schema_compat();
    MAX_STRICT_SCHEMA_CACHE_ENTRIES_PER_SCHEMA = 8;
    strictOpenAISchemaCache = /* @__PURE__ */ new WeakMap();
  }
});

// packages/ai/src/providers/openai-responses-tools.ts
import { createHash } from "node:crypto";
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
var LOG_SUBSYSTEM, MAX_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS, loggedStrictToolDowngradeDiagnosticKeys;
var init_openai_responses_tools = __esm({
  "packages/ai/src/providers/openai-responses-tools.ts"() {
    "use strict";
    init_host();
    init_openai_tool_projection();
    init_openai_tool_schema();
    LOG_SUBSYSTEM = "llm/openai-responses";
    MAX_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS = 64;
    loggedStrictToolDowngradeDiagnosticKeys = /* @__PURE__ */ new Set();
  }
});

// packages/ai/src/providers/openai-responses-shared.ts
import { randomUUID as randomUUID2 } from "node:crypto";
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
  const generatedCallId = `call_${randomUUID2().replaceAll("-", "").slice(0, 24)}`;
  return resolvedItemId ? `${generatedCallId}|${resolvedItemId}` : generatedCallId;
}
function sanitizeToolResultText2(text, fallback) {
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
  const normalizeToolCallId2 = (id, targetModel, source) => {
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
  const transformedMessages = transformMessages(context.messages, model, normalizeToolCallId2);
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
        output = sanitizeToolResultText2(textResult, mediaPlaceholder ?? EMPTY_TOOL_RESULT_TEXT2);
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
function createResponsesAssistantOutput(model, api = model.api) {
  return {
    role: "assistant",
    content: [],
    api,
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
function applyCommonResponsesParams(params, model, context, options, config) {
  if (options?.maxTokens) {
    params.max_output_tokens = Math.max(options.maxTokens, 16);
  }
  if (options?.temperature !== void 0 && supportsOpenAITemperature(model)) {
    params.temperature = options.temperature;
  }
  if (context.tools) {
    const converted = convertResponsesToolPayload(context.tools, { model });
    if (converted.tools.length > 0) {
      params.tools = converted.tools;
    }
  }
  if (!model.reasoning) {
    return;
  }
  if (options?.reasoningEffort || options?.reasoningSummary) {
    const effort = options?.reasoningEffort ? model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort : "medium";
    params.reasoning = {
      effort,
      summary: options?.reasoningSummary || "auto"
    };
    params.include = ["reasoning.encrypted_content"];
  } else if ((config?.setDefaultReasoningOff ?? true) && model.thinkingLevelMap?.off !== null) {
    params.reasoning = {
      effort: model.thinkingLevelMap?.off ?? "none"
    };
  }
}
function buildResponsesRequestOptions(options) {
  return {
    ...options?.signal ? { signal: options.signal } : {},
    ...options?.timeoutMs !== void 0 ? { timeout: options.timeoutMs } : {},
    maxRetries: options?.maxRetries ?? 0
  };
}
function cleanStreamingScratchBuffers(output) {
  for (const block of output.content) {
    delete block.index;
    delete block.partialJson;
  }
}
async function runResponsesStreamLifecycle(params) {
  const { stream, model, output, options } = params;
  let firstEventAbort;
  try {
    const client = params.createClient();
    let requestParams = params.buildParams();
    const nextParams = await options?.onPayload?.(requestParams, model);
    if (nextParams !== void 0) {
      requestParams = nextParams;
    }
    firstEventAbort = createFirstStreamEventAbortController(options?.signal);
    const { data: openaiStream, response } = await client.responses.create(requestParams, {
      ...buildResponsesRequestOptions(options),
      signal: firstEventAbort.signal
    }).withResponse();
    await options?.onResponse?.(
      { status: response.status, headers: headersToRecord(response.headers) },
      model
    );
    stream.push({ type: "start", partial: output });
    const firstEventTimeoutMs = getFirstStreamEventTimeoutMs(options);
    const onFirstEventTimeout = getFirstStreamEventTimeoutHandler(options);
    const processStreamOptions = params.processStreamOptions || firstEventTimeoutMs !== void 0 || onFirstEventTimeout !== void 0 ? {
      ...params.processStreamOptions,
      firstEventTimeoutMs: params.processStreamOptions?.firstEventTimeoutMs ?? firstEventTimeoutMs,
      abortFirstEventStream: params.processStreamOptions?.abortFirstEventStream ?? firstEventAbort.abort,
      onFirstEventTimeout: params.processStreamOptions?.onFirstEventTimeout ?? onFirstEventTimeout
    } : void 0;
    await processResponsesStream(openaiStream, output, stream, model, processStreamOptions);
    if (options?.signal?.aborted) {
      throw new Error("Request was aborted");
    }
    if (output.stopReason === "aborted" || output.stopReason === "error") {
      throw new Error(output.errorMessage ?? "An unknown error occurred");
    }
    stream.push({ type: "done", reason: output.stopReason, message: output });
    stream.end();
  } catch (error) {
    cleanStreamingScratchBuffers(output);
    output.stopReason = options?.signal?.aborted ? "aborted" : "error";
    output.errorMessage = params.formatError(error);
    stream.push({ type: "error", reason: output.stopReason, error: output });
    stream.end();
  } finally {
    firstEventAbort?.dispose();
  }
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
var EMPTY_TOOL_RESULT_TEXT2;
var init_openai_responses_shared = __esm({
  "packages/ai/src/providers/openai-responses-shared.ts"() {
    "use strict";
    init_model_utils();
    init_hash();
    init_headers();
    init_json_parse();
    init_sanitize_unicode();
    init_stream_first_event_timeout();
    init_system_prompt_cache_boundary();
    init_openai_reasoning_effort();
    init_openai_responses_stream_compat();
    init_openai_responses_terminal_usage();
    init_openai_responses_tool_call_tracker();
    init_openai_responses_tools();
    init_tool_result_text();
    init_transform_messages();
    EMPTY_TOOL_RESULT_TEXT2 = "(no output)";
  }
});

// packages/ai/src/providers/openai-responses.ts
var openai_responses_exports = {};
__export(openai_responses_exports, {
  streamOpenAIResponses: () => streamOpenAIResponses,
  streamSimpleOpenAIResponses: () => streamSimpleOpenAIResponses
});
import OpenAI2 from "openai";
function getCompat2(model) {
  return {
    sendSessionIdHeader: model.compat?.sendSessionIdHeader ?? true,
    supportsLongCacheRetention: model.compat?.supportsLongCacheRetention ?? true
  };
}
function getPromptCacheRetention(compat, cacheRetention) {
  return cacheRetention === "long" && compat.supportsLongCacheRetention ? "24h" : void 0;
}
function formatOpenAIResponsesError(error) {
  if (error instanceof Error) {
    const status = error.status;
    const statusCode = typeof status === "number" ? status : void 0;
    if (statusCode !== void 0) {
      return `OpenAI API error (${statusCode}): ${error.message}`;
    }
    return error.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}
function createClient3(model, context, apiKey, optionsHeaders, sessionId) {
  if (!apiKey) {
    throw new Error(`No API key for provider: ${model.provider}`);
  }
  const compat = getCompat2(model);
  const headers = { ...model.headers };
  if (model.provider === "github-copilot") {
    const hasImages = hasCopilotVisionInput(context.messages);
    const copilotHeaders = buildCopilotDynamicHeaders({
      messages: context.messages,
      hasImages
    });
    Object.assign(headers, copilotHeaders);
  }
  if (sessionId) {
    if (compat.sendSessionIdHeader) {
      headers.session_id = sessionId;
    }
    headers["x-client-request-id"] = sessionId;
  }
  if (optionsHeaders) {
    Object.assign(headers, optionsHeaders);
  }
  const defaultHeaders = model.provider === "cloudflare-ai-gateway" ? {
    ...headers,
    Authorization: headers.Authorization ?? null,
    "cf-aig-authorization": `Bearer ${apiKey}`
  } : headers;
  return new OpenAI2({
    apiKey,
    baseURL: isCloudflareProvider(model.provider) ? resolveCloudflareBaseUrl(model) : model.baseUrl,
    dangerouslyAllowBrowser: true,
    defaultHeaders,
    // OpenAI supports custom fetch, so sentinels stay opaque until guarded egress.
    fetch: getAiTransportHost().buildModelFetch(model)
  });
}
function buildParams3(model, context, options) {
  const messages = convertResponsesMessages(model, context, OPENAI_TOOL_CALL_PROVIDERS, {
    replayResponsesItemIds: options?.replayResponsesItemIds ?? false
  });
  const cacheRetention = resolveCacheRetention(options?.cacheRetention);
  const compat = getCompat2(model);
  const params = {
    model: model.id,
    input: messages,
    stream: true,
    prompt_cache_key: cacheRetention === "none" ? void 0 : clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId),
    prompt_cache_retention: getPromptCacheRetention(compat, cacheRetention),
    store: false
  };
  if (options?.maxTokens) {
    params.max_output_tokens = options?.maxTokens;
  }
  if (options?.temperature !== void 0 && supportsOpenAITemperature(model)) {
    params.temperature = options?.temperature;
  }
  if (options?.serviceTier !== void 0) {
    params.service_tier = options.serviceTier;
  }
  applyCommonResponsesParams(params, model, context, options, {
    setDefaultReasoningOff: model.provider !== "github-copilot"
  });
  return params;
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
var OPENAI_TOOL_CALL_PROVIDERS, streamOpenAIResponses, streamSimpleOpenAIResponses;
var init_openai_responses = __esm({
  "packages/ai/src/providers/openai-responses.ts"() {
    "use strict";
    init_env_api_keys();
    init_host();
    init_event_stream2();
    init_cache_retention();
    init_cloudflare();
    init_github_copilot_headers();
    init_openai_prompt_cache();
    init_openai_reasoning_effort();
    init_openai_responses_shared();
    init_simple_options();
    OPENAI_TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set(["openai", "opencode"]);
    streamOpenAIResponses = (model, context, options) => {
      const stream = new AssistantMessageEventStream();
      const output = createResponsesAssistantOutput(model);
      void runResponsesStreamLifecycle({
        stream,
        model,
        output,
        options,
        createClient: () => {
          const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
          const cacheRetention = resolveCacheRetention(options?.cacheRetention);
          const cacheSessionId = cacheRetention === "none" ? void 0 : options?.sessionId;
          return createClient3(model, context, apiKey, options?.headers, cacheSessionId);
        },
        buildParams: () => buildParams3(model, context, options),
        processStreamOptions: {
          serviceTier: options?.serviceTier,
          applyServiceTierPricing: (usage, serviceTier) => applyServiceTierPricing(usage, serviceTier, model)
        },
        formatError: formatOpenAIResponsesError
      });
      return stream;
    };
    streamSimpleOpenAIResponses = (model, context, options) => {
      const apiKey = options?.apiKey || getEnvApiKey(model.provider);
      if (!apiKey) {
        throw new Error(`No API key for provider: ${model.provider}`);
      }
      const base = buildBaseOptions(model, options, apiKey);
      return streamOpenAIResponses(model, context, {
        ...base,
        reasoningEffort: resolveResponsesReasoningEffort(model, options?.reasoning),
        replayResponsesItemIds: options?.replayResponsesItemIds
      });
    };
  }
});

// packages/ai/src/providers/azure-deployment-map.ts
function parseAzureDeploymentNameMap(value) {
  const map = /* @__PURE__ */ new Map();
  if (!value) {
    return map;
  }
  for (const entry of value.split(",")) {
    const trimmed = entry.trim();
    if (!trimmed) {
      continue;
    }
    const separator = trimmed.indexOf("=");
    if (separator <= 0) {
      continue;
    }
    const modelId = trimmed.slice(0, separator).trim();
    const deploymentName = trimmed.slice(separator + 1).trim();
    if (!modelId || !deploymentName) {
      continue;
    }
    map.set(modelId, deploymentName);
  }
  return map;
}
function getDeploymentLookup(source) {
  const cached = cachedDeploymentLookup;
  if (cached && cached.source === source) {
    return cached;
  }
  const exact = parseAzureDeploymentNameMap(source);
  const folded = /* @__PURE__ */ new Map();
  for (const [modelId, deploymentName] of exact) {
    folded.set(modelId.toLowerCase(), deploymentName);
  }
  cachedDeploymentLookup = { source, exact, folded };
  return cachedDeploymentLookup;
}
function resolveAzureDeploymentNameFromMap(params) {
  const { exact, folded } = getDeploymentLookup(params.deploymentMap);
  return exact.get(params.modelId) ?? folded.get(params.modelId.toLowerCase()) ?? params.modelId;
}
var cachedDeploymentLookup;
var init_azure_deployment_map = __esm({
  "packages/ai/src/providers/azure-deployment-map.ts"() {
    "use strict";
  }
});

// packages/ai/src/providers/azure-openai-responses-client-compat.ts
function isTraditionalAzureOpenAIHost(hostname) {
  return hostname.endsWith(".openai.azure.com") || hostname.endsWith(".cognitiveservices.azure.com");
}
function isOpenAICompatibleAzureResponsesBaseUrl(baseUrl) {
  let url;
  try {
    url = new URL(baseUrl);
  } catch {
    return false;
  }
  if (isTraditionalAzureOpenAIHost(url.hostname)) {
    return false;
  }
  const hostname = url.hostname.toLowerCase();
  const isFoundryHost = hostname.endsWith(".services.ai.azure.com") || hostname.endsWith(".api.cognitive.microsoft.com");
  if (!isFoundryHost) {
    return false;
  }
  const normalizedPath = url.pathname.replace(/\/+$/, "");
  return normalizedPath === "/openai/v1" || normalizedPath.endsWith("/openai/v1");
}
var init_azure_openai_responses_client_compat = __esm({
  "packages/ai/src/providers/azure-openai-responses-client-compat.ts"() {
    "use strict";
  }
});

// packages/ai/src/providers/azure-openai-responses.ts
var azure_openai_responses_exports = {};
__export(azure_openai_responses_exports, {
  streamAzureOpenAIResponses: () => streamAzureOpenAIResponses,
  streamSimpleAzureOpenAIResponses: () => streamSimpleAzureOpenAIResponses,
  testing: () => testing
});
import OpenAI3, { AzureOpenAI } from "openai";
function resolveDeploymentName(model, options) {
  if (options?.azureDeploymentName) {
    return options.azureDeploymentName;
  }
  return resolveAzureDeploymentNameFromMap({
    modelId: model.id,
    deploymentMap: process.env.AZURE_OPENAI_DEPLOYMENT_NAME_MAP
  });
}
function formatAzureOpenAIError(error) {
  if (error instanceof Error) {
    const status = error.status;
    const statusCode = typeof status === "number" ? status : void 0;
    if (statusCode !== void 0) {
      return `Azure OpenAI API error (${statusCode}): ${error.message}`;
    }
    return error.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}
function normalizeAzureBaseUrl(baseUrl) {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  let url;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error(`Invalid Azure OpenAI base URL: ${baseUrl}`);
  }
  const isAzureHost = url.hostname.endsWith(".openai.azure.com") || url.hostname.endsWith(".cognitiveservices.azure.com");
  const normalizedPath = url.pathname.replace(/\/+$/, "");
  if (isAzureHost && (normalizedPath === "" || normalizedPath === "/" || normalizedPath === "/openai")) {
    url.pathname = "/openai/v1";
    url.search = "";
  }
  return url.toString().replace(/\/+$/, "");
}
function buildDefaultBaseUrl(resourceName) {
  return `https://${resourceName}.openai.azure.com/openai/v1`;
}
function resolveAzureConfig(model, options) {
  const apiVersion = options?.azureApiVersion || process.env.AZURE_OPENAI_API_VERSION || DEFAULT_AZURE_API_VERSION;
  const baseUrl = options?.azureBaseUrl?.trim() || process.env.AZURE_OPENAI_BASE_URL?.trim() || void 0;
  const resourceName = options?.azureResourceName || process.env.AZURE_OPENAI_RESOURCE_NAME;
  let resolvedBaseUrl = baseUrl;
  if (!resolvedBaseUrl && resourceName) {
    resolvedBaseUrl = buildDefaultBaseUrl(resourceName);
  }
  if (!resolvedBaseUrl && model.baseUrl) {
    resolvedBaseUrl = model.baseUrl;
  }
  if (!resolvedBaseUrl) {
    throw new Error(
      "Azure OpenAI base URL is required. Set AZURE_OPENAI_BASE_URL or AZURE_OPENAI_RESOURCE_NAME, or pass azureBaseUrl, azureResourceName, or model.baseUrl."
    );
  }
  return {
    baseUrl: normalizeAzureBaseUrl(resolvedBaseUrl),
    apiVersion
  };
}
function createClient4(model, apiKeyInput, options) {
  const apiKey = apiKeyInput.trim();
  if (!apiKey) {
    throw new Error(
      "Azure OpenAI API key is required. Set AZURE_OPENAI_API_KEY environment variable or pass it as an argument."
    );
  }
  const headers = { ...model.headers };
  if (options?.headers) {
    Object.assign(headers, options.headers);
  }
  const { baseUrl, apiVersion } = resolveAzureConfig(model, options);
  const guardedFetch = getAiTransportHost().buildModelFetch({ ...model, baseUrl });
  if (isOpenAICompatibleAzureResponsesBaseUrl(baseUrl)) {
    return new OpenAI3({
      apiKey,
      dangerouslyAllowBrowser: true,
      defaultHeaders: headers,
      baseURL: baseUrl,
      fetch: guardedFetch
    });
  }
  return new AzureOpenAI({
    apiKey,
    apiVersion,
    dangerouslyAllowBrowser: true,
    defaultHeaders: headers,
    baseURL: baseUrl,
    fetch: guardedFetch
  });
}
function buildParams4(model, context, options, deploymentName) {
  const messages = convertResponsesMessages(model, context, AZURE_TOOL_CALL_PROVIDERS);
  const params = {
    model: deploymentName,
    input: messages,
    stream: true,
    prompt_cache_key: options?.cacheRetention === "none" ? void 0 : clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId),
    store: false
  };
  applyCommonResponsesParams(params, model, context, options);
  return params;
}
var DEFAULT_AZURE_API_VERSION, AZURE_TOOL_CALL_PROVIDERS, streamAzureOpenAIResponses, streamSimpleAzureOpenAIResponses, testing;
var init_azure_openai_responses = __esm({
  "packages/ai/src/providers/azure-openai-responses.ts"() {
    "use strict";
    init_env_api_keys();
    init_host();
    init_event_stream2();
    init_azure_deployment_map();
    init_azure_openai_responses_client_compat();
    init_openai_prompt_cache();
    init_openai_responses_shared();
    init_simple_options();
    DEFAULT_AZURE_API_VERSION = "v1";
    AZURE_TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set(["openai", "opencode", "azure-openai-responses"]);
    streamAzureOpenAIResponses = (model, context, options) => {
      const stream = new AssistantMessageEventStream();
      const output = createResponsesAssistantOutput(model, "azure-openai-responses");
      void runResponsesStreamLifecycle({
        stream,
        model,
        output,
        options,
        createClient: () => {
          const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
          return createClient4(model, apiKey, options);
        },
        buildParams: () => buildParams4(model, context, options, resolveDeploymentName(model, options)),
        formatError: formatAzureOpenAIError
      });
      return stream;
    };
    streamSimpleAzureOpenAIResponses = (model, context, options) => {
      const apiKey = options?.apiKey || getEnvApiKey(model.provider);
      if (!apiKey) {
        throw new Error(`No API key for provider: ${model.provider}`);
      }
      const base = buildBaseOptions(model, options, apiKey);
      const reasoningEffort = resolveResponsesReasoningEffort(model, options?.reasoning);
      return streamAzureOpenAIResponses(model, context, {
        ...base,
        reasoningEffort: reasoningEffort === "max" ? "xhigh" : reasoningEffort
      });
    };
    testing = {
      isOpenAICompatibleAzureResponsesBaseUrl,
      normalizeAzureBaseUrl,
      resolveAzureConfig
    };
  }
});

// packages/ai/src/internal/retry-after.ts
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
var HTTP_DATE_MONTH_INDEX, HTTP_DATE_SHORT_WEEKDAY_INDEX, HTTP_DATE_LONG_WEEKDAY_INDEX, IMF_FIXDATE_RE, OBSOLETE_RFC850_DATE_RE, OBSOLETE_ASCTIME_DATE_RE;
var init_retry_after = __esm({
  "packages/ai/src/internal/retry-after.ts"() {
    "use strict";
    HTTP_DATE_MONTH_INDEX = new Map(
      ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
        (month, index) => [month, index]
      )
    );
    HTTP_DATE_SHORT_WEEKDAY_INDEX = new Map(
      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday, index) => [weekday, index])
    );
    HTTP_DATE_LONG_WEEKDAY_INDEX = new Map(
      ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
        (weekday, index) => [weekday, index]
      )
    );
    IMF_FIXDATE_RE = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{2}):(\d{2}):(\d{2}) GMT$/;
    OBSOLETE_RFC850_DATE_RE = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{2}):(\d{2}):(\d{2}) GMT$/;
    OBSOLETE_ASCTIME_DATE_RE = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{2}| \d) (\d{2}):(\d{2}):(\d{2}) (\d{4})$/;
  }
});

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
var init_retry_sleep = __esm({
  "packages/ai/src/internal/retry-sleep.ts"() {
    "use strict";
  }
});

// packages/ai/src/session-resources.ts
function registerSessionResourceCleanup(cleanup) {
  sessionResourceCleanups.add(cleanup);
  return () => {
    sessionResourceCleanups.delete(cleanup);
  };
}
var sessionResourceCleanups;
var init_session_resources = __esm({
  "packages/ai/src/session-resources.ts"() {
    "use strict";
    sessionResourceCleanups = /* @__PURE__ */ new Set();
  }
});

// packages/ai/src/utils/diagnostics.ts
var init_diagnostics2 = __esm({
  "packages/ai/src/utils/diagnostics.ts"() {
    "use strict";
    init_diagnostics();
  }
});

// packages/ai/src/utils/oauth/openai-chatgpt-jwt.ts
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
var OPENAI_CODEX_AUTH_CLAIM;
var init_openai_chatgpt_jwt = __esm({
  "packages/ai/src/utils/oauth/openai-chatgpt-jwt.ts"() {
    "use strict";
    OPENAI_CODEX_AUTH_CLAIM = "https://api.openai.com/auth";
  }
});

// packages/ai/src/providers/openai-chatgpt-responses.ts
var openai_chatgpt_responses_exports = {};
__export(openai_chatgpt_responses_exports, {
  closeOpenAICodexWebSocketSessions: () => closeOpenAICodexWebSocketSessions,
  extractOpenAICodexAccountId: () => extractOpenAICodexAccountId,
  parseSSEForTest: () => parseSSEForTest,
  resetOpenAICodexWebSocketStateForTest: () => resetOpenAICodexWebSocketStateForTest,
  streamOpenAICodexResponses: () => streamOpenAICodexResponses,
  streamSimpleOpenAICodexResponses: () => streamSimpleOpenAICodexResponses
});
function loadNodeOs() {
  if (typeof process === "undefined" || !(process.versions?.node || process.versions?.bun)) {
    return null;
  }
  return process.getBuiltinModule?.("node:os") ?? null;
}
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
function getServiceTierCostMultiplier2(model, serviceTier) {
  switch (serviceTier) {
    case "flex":
      return 0.5;
    case "priority":
      return model.id === "gpt-5.5" ? 2.5 : 2;
    default:
      return 1;
  }
}
function applyServiceTierPricing2(usage, serviceTier, model) {
  const multiplier = getServiceTierCostMultiplier2(model, serviceTier);
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
    applyServiceTierPricing: (usage, serviceTier) => applyServiceTierPricing2(usage, serviceTier, model)
  });
}
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
        applyServiceTierPricing: (usage, serviceTier) => applyServiceTierPricing2(usage, serviceTier, model)
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
var dynamicImport2, os, DEFAULT_CODEX_BASE_URL, DEFAULT_MAX_RETRIES, BASE_DELAY_MS, REQUEST_COMPRESSION_ZSTD_LEVEL, CODEX_TOOL_CALL_PROVIDERS, WEBSOCKET_MESSAGE_TOO_BIG_CLOSE_CODE, WEBSOCKET_CONNECTION_LIMIT_REACHED_CODE, OPENAI_CHATGPT_RESPONSES_ERROR_BODY_MAX_BYTES, OPENAI_CHATGPT_RESPONSES_SUCCESS_BODY_MAX_BYTES, CODEX_RESPONSE_STATUSES, streamOpenAICodexResponses, streamSimpleOpenAICodexResponses, CodexApiError, CodexProtocolError, parseSSEForTest, OPENAI_BETA_RESPONSES_WEBSOCKETS, SESSION_WEBSOCKET_CACHE_TTL_MS, SESSION_WEBSOCKET_MAX_AGE_MS, websocketSessionCache, websocketSseFallbackSessions, cachedWebsocket, WebSocketCloseError;
var init_openai_chatgpt_responses = __esm({
  "packages/ai/src/providers/openai-chatgpt-responses.ts"() {
    "use strict";
    init_number_coercion();
    init_env_api_keys();
    init_host();
    init_retry_after();
    init_retry_sleep();
    init_session_resources();
    init_diagnostics2();
    init_event_stream2();
    init_headers();
    init_openai_chatgpt_jwt();
    init_stream_first_event_timeout();
    init_streaming_byte_guard();
    init_system_prompt_cache_boundary();
    init_openai_prompt_cache();
    init_openai_reasoning_effort();
    init_openai_responses_shared();
    init_simple_options();
    dynamicImport2 = (specifier) => import(specifier);
    os = loadNodeOs();
    DEFAULT_CODEX_BASE_URL = "https://chatgpt.com/backend-api";
    DEFAULT_MAX_RETRIES = 3;
    BASE_DELAY_MS = 1e3;
    REQUEST_COMPRESSION_ZSTD_LEVEL = 3;
    CODEX_TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set(["openai", "opencode"]);
    WEBSOCKET_MESSAGE_TOO_BIG_CLOSE_CODE = 1009;
    WEBSOCKET_CONNECTION_LIMIT_REACHED_CODE = "websocket_connection_limit_reached";
    OPENAI_CHATGPT_RESPONSES_ERROR_BODY_MAX_BYTES = 16 * 1024;
    OPENAI_CHATGPT_RESPONSES_SUCCESS_BODY_MAX_BYTES = 16 * 1024 * 1024;
    CODEX_RESPONSE_STATUSES = /* @__PURE__ */ new Set([
      "completed",
      "incomplete",
      "failed",
      "cancelled",
      "queued",
      "in_progress"
    ]);
    streamOpenAICodexResponses = (model, context, options) => {
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
    streamSimpleOpenAICodexResponses = (model, context, options) => {
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
    CodexApiError = class extends Error {
      constructor(message, options) {
        super(message);
        this.name = "CodexApiError";
        this.code = options?.code;
        this.payload = options?.payload;
        this.cause = options?.cause;
      }
    };
    CodexProtocolError = class extends Error {
      constructor(message, options) {
        super(message);
        this.name = "CodexProtocolError";
        this.payload = options?.payload;
        this.cause = options?.cause;
      }
    };
    parseSSEForTest = parseSSE;
    OPENAI_BETA_RESPONSES_WEBSOCKETS = "responses_websockets=2026-02-06";
    SESSION_WEBSOCKET_CACHE_TTL_MS = 5 * 60 * 1e3;
    SESSION_WEBSOCKET_MAX_AGE_MS = 55 * 60 * 1e3;
    websocketSessionCache = /* @__PURE__ */ new Map();
    websocketSseFallbackSessions = /* @__PURE__ */ new Set();
    cachedWebsocket = null;
    registerSessionResourceCleanup(closeOpenAICodexWebSocketSessions);
    WebSocketCloseError = class extends Error {
      constructor(message, options) {
        super(message);
        this.name = "WebSocketCloseError";
        this.code = options?.code;
        this.reason = options?.reason;
        this.wasClean = options?.wasClean;
      }
    };
  }
});

// packages/ai/src/providers/google-shared.ts
import {
  FinishReason,
  FunctionCallingConfigMode,
  ThinkingLevel
} from "@google/genai";
function isThinkingPart(part) {
  return part.thought === true;
}
function retainThoughtSignature(existing, incoming) {
  if (typeof incoming === "string" && incoming.length > 0) {
    return incoming;
  }
  return existing;
}
function isValidThoughtSignature(signature) {
  if (!signature) {
    return false;
  }
  if (signature.length % 4 !== 0) {
    return false;
  }
  return base64SignaturePattern.test(signature);
}
function resolveThoughtSignature(isSameProviderAndModel, signature) {
  return isSameProviderAndModel && isValidThoughtSignature(signature) ? signature : void 0;
}
function requiresToolCallId(modelId) {
  return modelId.startsWith("claude-") || modelId.startsWith("gpt-oss-");
}
function getGeminiMajorVersion(modelId) {
  const match = modelId.toLowerCase().match(/(?:^|\/)gemini(?:-live)?-(\d+)/);
  if (!match) {
    return void 0;
  }
  const majorVersion = match.at(1);
  return majorVersion === void 0 ? void 0 : Number.parseInt(majorVersion, 10);
}
function supportsMultimodalFunctionResponse(modelId) {
  const geminiMajorVersion = getGeminiMajorVersion(modelId);
  if (geminiMajorVersion !== void 0) {
    return geminiMajorVersion >= 3;
  }
  return true;
}
function convertMessages3(model, context) {
  const contents = [];
  const normalizeToolCallId2 = (id) => {
    if (!requiresToolCallId(model.id)) {
      return id;
    }
    return id.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
  };
  const transformedMessages = transformMessages(context.messages, model, normalizeToolCallId2);
  const pendingToolResultImageTurns = [];
  let activeToolResultParts;
  const flushToolResultRun = () => {
    contents.push(...pendingToolResultImageTurns);
    pendingToolResultImageTurns.length = 0;
    activeToolResultParts = void 0;
  };
  for (const msg of transformedMessages) {
    if (msg.role !== "toolResult") {
      flushToolResultRun();
    }
    if (msg.role === "user") {
      if (typeof msg.content === "string") {
        contents.push({
          role: "user",
          parts: [{ text: sanitizeSurrogates(msg.content) }]
        });
      } else {
        const parts = msg.content.map((item) => {
          if (item.type === "text") {
            return { text: sanitizeSurrogates(item.text) };
          }
          return {
            inlineData: {
              mimeType: item.mimeType,
              data: item.data
            }
          };
        });
        if (parts.length === 0) {
          continue;
        }
        contents.push({
          role: "user",
          parts
        });
      }
    } else if (msg.role === "assistant") {
      const parts = [];
      const isSameProviderAndModel = msg.provider === model.provider && msg.model === model.id;
      for (const block of msg.content) {
        if (block.type === "text") {
          if (!block.text || block.text.trim() === "") {
            continue;
          }
          const thoughtSignature = resolveThoughtSignature(
            isSameProviderAndModel,
            block.textSignature
          );
          parts.push({
            text: sanitizeSurrogates(block.text),
            ...thoughtSignature && { thoughtSignature }
          });
        } else if (block.type === "thinking") {
          if (!block.thinking || block.thinking.trim() === "") {
            continue;
          }
          if (isSameProviderAndModel) {
            const thoughtSignature = resolveThoughtSignature(
              isSameProviderAndModel,
              block.thinkingSignature
            );
            parts.push({
              thought: true,
              text: sanitizeSurrogates(block.thinking),
              ...thoughtSignature && { thoughtSignature }
            });
          } else {
            parts.push({
              text: sanitizeSurrogates(block.thinking)
            });
          }
        } else if (block.type === "toolCall") {
          const thoughtSignature = resolveThoughtSignature(
            isSameProviderAndModel,
            block.thoughtSignature
          );
          const part = {
            functionCall: {
              name: block.name,
              args: block.arguments ?? {},
              ...requiresToolCallId(model.id) ? { id: block.id } : {}
            },
            ...thoughtSignature && { thoughtSignature }
          };
          parts.push(part);
        }
      }
      if (parts.length === 0) {
        continue;
      }
      contents.push({
        role: "model",
        parts
      });
    } else if (msg.role === "toolResult") {
      const textResult = extractToolResultText(msg.content);
      const imageContent = model.input.includes("image") ? msg.content.filter(isImageWithMediaPayload) : [];
      const hasText = textResult.length > 0;
      const hasImages = imageContent.length > 0;
      const mediaPlaceholder = describeToolResultMediaPlaceholder(msg.content);
      const modelSupportsMultimodalFunctionResponse = supportsMultimodalFunctionResponse(model.id);
      const responseValue = hasText ? sanitizeSurrogates(textResult) : mediaPlaceholder ?? "";
      const imageParts = imageContent.map((imageBlock) => ({
        inlineData: {
          mimeType: imageBlock.mimeType,
          data: imageBlock.data
        }
      }));
      const includeId = requiresToolCallId(model.id);
      const functionResponsePart = {
        functionResponse: {
          name: msg.toolName,
          response: msg.isError ? { error: responseValue } : { output: responseValue },
          ...hasImages && modelSupportsMultimodalFunctionResponse && { parts: imageParts },
          ...includeId ? { id: msg.toolCallId } : {}
        }
      };
      if (activeToolResultParts) {
        activeToolResultParts.push(functionResponsePart);
      } else {
        activeToolResultParts = [functionResponsePart];
        contents.push({
          role: "user",
          parts: activeToolResultParts
        });
      }
      if (hasImages && !modelSupportsMultimodalFunctionResponse) {
        pendingToolResultImageTurns.push({
          role: "user",
          parts: [{ text: "Tool result image:" }, ...imageParts]
        });
      }
    }
  }
  flushToolResultRun();
  return contents;
}
function sanitizeForOpenApi(schema) {
  if (typeof schema !== "object" || schema === null || Array.isArray(schema)) {
    return schema;
  }
  const result = {};
  for (const [key, value] of Object.entries(schema)) {
    if (JSON_SCHEMA_META_DECLARATIONS.has(key)) {
      continue;
    }
    result[key] = sanitizeForOpenApi(value);
  }
  return result;
}
function convertTools3(tools, useParameters = false) {
  if (tools.length === 0) {
    return void 0;
  }
  return [
    {
      functionDeclarations: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        ...useParameters ? { parameters: sanitizeForOpenApi(tool.parameters) } : { parametersJsonSchema: tool.parameters }
      }))
    }
  ];
}
function mapToolChoice2(choice) {
  switch (choice) {
    case "auto":
      return FunctionCallingConfigMode.AUTO;
    case "none":
      return FunctionCallingConfigMode.NONE;
    case "any":
      return FunctionCallingConfigMode.ANY;
    default:
      return FunctionCallingConfigMode.AUTO;
  }
}
function createGoogleAssistantOutput(model, api = model.api) {
  return {
    role: "assistant",
    content: [],
    api,
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
async function runGoogleGenerateContentLifecycle(params) {
  const { stream, model, output, options } = params;
  try {
    const client = params.createClient();
    let requestParams = params.buildParams();
    const nextParams = await options?.onPayload?.(requestParams, model);
    if (nextParams !== void 0) {
      requestParams = nextParams;
    }
    const googleStream = await client.models.generateContentStream(requestParams);
    await consumeGoogleGenerateContentStream({
      chunks: googleStream,
      model,
      output,
      stream,
      signal: options?.signal,
      nextToolCallId: params.nextToolCallId
    });
  } catch (error) {
    for (const block of output.content) {
      if ("index" in block) {
        delete block.index;
      }
    }
    output.stopReason = options?.signal?.aborted ? "aborted" : "error";
    output.errorMessage = formatProviderError(error);
    stream.push({ type: "error", reason: output.stopReason, error: output });
    stream.end();
  }
}
function buildGoogleGenerateContentParams(model, context, options = {}, configHooks) {
  const contents = convertMessages3(model, context);
  const generationConfig = {};
  if (options.temperature !== void 0) {
    generationConfig.temperature = options.temperature;
  }
  if (options.maxTokens !== void 0) {
    generationConfig.maxOutputTokens = options.maxTokens;
  }
  if (options.stop !== void 0 && options.stop.length > 0) {
    generationConfig.stopSequences = options.stop;
  }
  const config = {
    ...Object.keys(generationConfig).length > 0 && generationConfig,
    ...context.systemPrompt && {
      systemInstruction: sanitizeSurrogates(stripSystemPromptCacheBoundary(context.systemPrompt))
    },
    ...context.tools && context.tools.length > 0 && { tools: convertTools3(context.tools) }
  };
  if (context.tools && context.tools.length > 0 && options.toolChoice) {
    config.toolConfig = {
      functionCallingConfig: {
        mode: mapToolChoice2(options.toolChoice)
      }
    };
  } else {
    config.toolConfig = void 0;
  }
  if (options.thinking?.enabled && model.reasoning) {
    const thinkingConfig = { includeThoughts: true };
    if (options.thinking.level !== void 0) {
      thinkingConfig.thinkingLevel = ThinkingLevel[options.thinking.level];
    } else if (options.thinking.budgetTokens !== void 0) {
      thinkingConfig.thinkingBudget = options.thinking.budgetTokens;
    }
    config.thinkingConfig = thinkingConfig;
  } else if (model.reasoning && options.thinking && !options.thinking.enabled) {
    config.thinkingConfig = configHooks?.getDisabledThinkingConfig ? configHooks.getDisabledThinkingConfig(model) : getDisabledGoogleThinkingConfig(model);
  }
  if (options.signal) {
    if (options.signal.aborted) {
      throw new Error("Request aborted");
    }
    config.abortSignal = options.signal;
  }
  return {
    model: model.id,
    contents,
    config
  };
}
function buildGoogleSimpleThinking(model, options, config) {
  if (!options?.reasoning || options.reasoning === "off") {
    return { enabled: false };
  }
  const clampedReasoning = clampThinkingLevel(model, options.reasoning);
  if (clampedReasoning === "off") {
    return { enabled: false };
  }
  const effort = clampedReasoning === "max" ? "high" : clampedReasoning;
  if (isGemini3ProModel(model) || isGemini3FlashModel(model) || config?.includeGemma4ThinkingLevel && isGemma4Model(model)) {
    return {
      enabled: true,
      level: getGoogleThinkingLevel(effort, model, {
        includeGemma4: config?.includeGemma4ThinkingLevel
      })
    };
  }
  return {
    enabled: true,
    budgetTokens: getGoogleBudget(model, effort, options.thinkingBudgets, {
      useFlashLiteBudgets: config?.useFlashLiteBudgets
    })
  };
}
function getDisabledGoogleThinkingConfig(model, config) {
  if (isGemini3ProModel(model)) {
    return { thinkingLevel: ThinkingLevel.LOW };
  }
  if (isGemini3FlashModel(model)) {
    return { thinkingLevel: ThinkingLevel.MINIMAL };
  }
  if (config?.includeGemma4 && isGemma4Model(model)) {
    return { thinkingLevel: ThinkingLevel.MINIMAL };
  }
  return { thinkingBudget: 0 };
}
function isGemma4Model(model) {
  return /gemma-?4/.test(model.id.toLowerCase());
}
function isGemini3ProModel(model) {
  return /gemini-3(?:\.\d+)?-pro/.test(model.id.toLowerCase());
}
function isGemini3FlashModel(model) {
  return /gemini-3(?:\.\d+)?-flash/.test(model.id.toLowerCase());
}
function getGoogleThinkingLevel(effort, model, config) {
  if (isGemini3ProModel(model)) {
    switch (effort) {
      case "minimal":
      case "low":
        return ThinkingLevel.LOW;
      case "medium":
      case "high":
        return ThinkingLevel.HIGH;
    }
  }
  if (config?.includeGemma4 && isGemma4Model(model)) {
    switch (effort) {
      case "minimal":
      case "low":
        return ThinkingLevel.MINIMAL;
      case "medium":
      case "high":
        return ThinkingLevel.HIGH;
    }
  }
  switch (effort) {
    case "minimal":
      return ThinkingLevel.MINIMAL;
    case "low":
      return ThinkingLevel.LOW;
    case "medium":
      return ThinkingLevel.MEDIUM;
    case "high":
      return ThinkingLevel.HIGH;
  }
  return ThinkingLevel.HIGH;
}
function getGoogleBudget(model, effort, customBudgets, config) {
  if (customBudgets?.[effort] !== void 0) {
    return customBudgets[effort];
  }
  if (model.id.includes("2.5-pro")) {
    const budgets = {
      minimal: 128,
      low: 2048,
      medium: 8192,
      high: 32768
    };
    return budgets[effort];
  }
  if (config?.useFlashLiteBudgets && model.id.includes("2.5-flash-lite")) {
    const budgets = {
      minimal: 512,
      low: 2048,
      medium: 8192,
      high: 24576
    };
    return budgets[effort];
  }
  if (model.id.includes("2.5-flash")) {
    const budgets = {
      minimal: 128,
      low: 2048,
      medium: 8192,
      high: 24576
    };
    return budgets[effort];
  }
  return -1;
}
function mapStopReason2(reason) {
  switch (reason) {
    case FinishReason.STOP:
      return "stop";
    case FinishReason.MAX_TOKENS:
      return "length";
    case FinishReason.BLOCKLIST:
    case FinishReason.PROHIBITED_CONTENT:
    case FinishReason.SPII:
    case FinishReason.SAFETY:
    case FinishReason.IMAGE_SAFETY:
    case FinishReason.IMAGE_PROHIBITED_CONTENT:
    case FinishReason.IMAGE_RECITATION:
    case FinishReason.IMAGE_OTHER:
    case FinishReason.RECITATION:
    case FinishReason.FINISH_REASON_UNSPECIFIED:
    case FinishReason.OTHER:
    case FinishReason.LANGUAGE:
    case FinishReason.MALFORMED_FUNCTION_CALL:
    case FinishReason.UNEXPECTED_TOOL_CALL:
    case FinishReason.NO_IMAGE:
      return "error";
    default: {
      const exhaustive = reason;
      throw new Error(`Unhandled stop reason: ${String(exhaustive)}`);
    }
  }
}
async function consumeGoogleGenerateContentStream(params) {
  params.stream.push({ type: "start", partial: params.output });
  let currentBlock = null;
  const blocks = params.output.content;
  const toolCallIds = /* @__PURE__ */ new Set();
  for (const block of blocks) {
    if (block.type === "toolCall") {
      toolCallIds.add(block.id);
    }
  }
  const blockIndex = () => blocks.length - 1;
  const endCurrentBlock = () => {
    if (!currentBlock) {
      return;
    }
    if (currentBlock.type === "text") {
      params.stream.push({
        type: "text_end",
        contentIndex: blockIndex(),
        content: currentBlock.text,
        partial: params.output
      });
    } else {
      params.stream.push({
        type: "thinking_end",
        contentIndex: blockIndex(),
        content: currentBlock.thinking,
        partial: params.output
      });
    }
    currentBlock = null;
  };
  for await (const chunk of params.chunks) {
    params.output.responseId ||= chunk.responseId;
    const candidate = chunk.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.text !== void 0) {
          const isThinking = isThinkingPart(part);
          if (!currentBlock || isThinking && currentBlock.type !== "thinking" || !isThinking && currentBlock.type !== "text") {
            endCurrentBlock();
            if (isThinking) {
              currentBlock = { type: "thinking", thinking: "", thinkingSignature: void 0 };
              params.output.content.push(currentBlock);
              params.stream.push({
                type: "thinking_start",
                contentIndex: blockIndex(),
                partial: params.output
              });
            } else {
              currentBlock = { type: "text", text: "" };
              params.output.content.push(currentBlock);
              params.stream.push({
                type: "text_start",
                contentIndex: blockIndex(),
                partial: params.output
              });
            }
          }
          if (currentBlock.type === "thinking") {
            currentBlock.thinking += part.text;
            currentBlock.thinkingSignature = retainThoughtSignature(
              currentBlock.thinkingSignature,
              part.thoughtSignature
            );
            params.stream.push({
              type: "thinking_delta",
              contentIndex: blockIndex(),
              delta: part.text,
              partial: params.output
            });
          } else {
            currentBlock.text += part.text;
            currentBlock.textSignature = retainThoughtSignature(
              currentBlock.textSignature,
              part.thoughtSignature
            );
            params.stream.push({
              type: "text_delta",
              contentIndex: blockIndex(),
              delta: part.text,
              partial: params.output
            });
          }
        }
        if (part.functionCall) {
          endCurrentBlock();
          const providedId = part.functionCall.id;
          const needsNewId = !providedId || toolCallIds.has(providedId);
          const toolCall = {
            type: "toolCall",
            id: needsNewId ? params.nextToolCallId(part.functionCall.name) : providedId,
            name: part.functionCall.name || "",
            arguments: part.functionCall.args ?? {},
            ...part.thoughtSignature && { thoughtSignature: part.thoughtSignature }
          };
          params.output.content.push(toolCall);
          toolCallIds.add(toolCall.id);
          params.stream.push({
            type: "toolcall_start",
            contentIndex: blockIndex(),
            partial: params.output
          });
          params.stream.push({
            type: "toolcall_delta",
            contentIndex: blockIndex(),
            delta: JSON.stringify(toolCall.arguments),
            partial: params.output
          });
          params.stream.push({
            type: "toolcall_end",
            contentIndex: blockIndex(),
            toolCall,
            partial: params.output
          });
        }
      }
    }
    if (candidate?.finishReason) {
      params.output.stopReason = mapStopReason2(candidate.finishReason);
      if (params.output.stopReason === "stop" && params.output.content.some((block) => block.type === "toolCall")) {
        params.output.stopReason = "toolUse";
      }
    }
    if (chunk.usageMetadata) {
      params.output.usage = {
        input: (chunk.usageMetadata.promptTokenCount || 0) - (chunk.usageMetadata.cachedContentTokenCount || 0),
        output: (chunk.usageMetadata.candidatesTokenCount || 0) + (chunk.usageMetadata.thoughtsTokenCount || 0),
        cacheRead: chunk.usageMetadata.cachedContentTokenCount || 0,
        cacheWrite: 0,
        totalTokens: chunk.usageMetadata.totalTokenCount || 0,
        cost: {
          input: 0,
          output: 0,
          cacheRead: 0,
          cacheWrite: 0,
          total: 0
        }
      };
      calculateCost(params.model, params.output.usage);
    }
  }
  endCurrentBlock();
  if (params.signal?.aborted) {
    throw new Error("Request was aborted");
  }
  if (params.output.stopReason === "aborted" || params.output.stopReason === "error") {
    throw new Error("An unknown error occurred");
  }
  params.stream.push({
    type: "done",
    reason: params.output.stopReason,
    message: params.output
  });
  params.stream.end();
}
var base64SignaturePattern, JSON_SCHEMA_META_DECLARATIONS;
var init_google_shared = __esm({
  "packages/ai/src/providers/google-shared.ts"() {
    "use strict";
    init_model_utils();
    init_provider_error();
    init_sanitize_unicode();
    init_system_prompt_cache_boundary();
    init_tool_result_text();
    init_transform_messages();
    base64SignaturePattern = /^[A-Za-z0-9+/]+={0,2}$/;
    JSON_SCHEMA_META_DECLARATIONS = /* @__PURE__ */ new Set([
      "$schema",
      "$id",
      "$anchor",
      "$dynamicAnchor",
      "$vocabulary",
      "$comment",
      "$defs",
      "definitions"
      // pre-draft-2019-09 equivalent of $defs
    ]);
  }
});

// packages/ai/src/providers/google.ts
var google_exports = {};
__export(google_exports, {
  streamGoogle: () => streamGoogle,
  streamSimpleGoogle: () => streamSimpleGoogle
});
import { GoogleGenAI } from "@google/genai";
function createClient5(model, apiKey, optionsHeaders) {
  const httpOptions = {};
  if (model.baseUrl) {
    httpOptions.baseUrl = model.baseUrl;
    httpOptions.apiVersion = "";
  }
  if (model.headers || optionsHeaders) {
    httpOptions.headers = resolveAiTransportHeaderSentinels({
      ...model.headers,
      ...optionsHeaders
    });
  }
  const resolvedApiKey = apiKey ? getAiTransportHost().resolveSecretSentinel(apiKey) : void 0;
  return new GoogleGenAI({
    apiKey: resolvedApiKey,
    httpOptions: Object.keys(httpOptions).length > 0 ? httpOptions : void 0
  });
}
function buildParams5(model, context, options = {}) {
  return buildGoogleGenerateContentParams(model, context, options, {
    getDisabledThinkingConfig: (modelLocal) => getDisabledGoogleThinkingConfig(modelLocal, { includeGemma4: true })
  });
}
var toolCallCounter, streamGoogle, streamSimpleGoogle;
var init_google = __esm({
  "packages/ai/src/providers/google.ts"() {
    "use strict";
    init_env_api_keys();
    init_host();
    init_event_stream2();
    init_google_shared();
    init_simple_options();
    toolCallCounter = 0;
    streamGoogle = (model, context, options) => {
      const stream = new AssistantMessageEventStream();
      const output = createGoogleAssistantOutput(model, "google-generative-ai");
      void runGoogleGenerateContentLifecycle({
        stream,
        model,
        output,
        options,
        createClient: () => {
          const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
          return createClient5(model, apiKey, options?.headers);
        },
        buildParams: () => buildParams5(model, context, options),
        nextToolCallId: (name) => `${name}_${Date.now()}_${++toolCallCounter}`
      });
      return stream;
    };
    streamSimpleGoogle = (model, context, options) => {
      const apiKey = options?.apiKey || getEnvApiKey(model.provider);
      if (!apiKey) {
        throw new Error(`No API key for provider: ${model.provider}`);
      }
      const base = buildBaseOptions(model, options, apiKey);
      return streamGoogle(model, context, {
        ...base,
        thinking: buildGoogleSimpleThinking(model, options, {
          includeGemma4ThinkingLevel: true,
          useFlashLiteBudgets: true
        })
      });
    };
  }
});

// packages/ai/src/providers/google-vertex.ts
var google_vertex_exports = {};
__export(google_vertex_exports, {
  streamGoogleVertex: () => streamGoogleVertex,
  streamSimpleGoogleVertex: () => streamSimpleGoogleVertex
});
import {
  GoogleGenAI as GoogleGenAI2,
  ResourceScope
} from "@google/genai";
function createClient6(model, project, location, optionsHeaders) {
  return new GoogleGenAI2({
    vertexai: true,
    project,
    location,
    apiVersion: API_VERSION,
    httpOptions: buildHttpOptions(model, optionsHeaders)
  });
}
function createClientWithApiKey(model, apiKey, optionsHeaders) {
  const resolvedApiKey = getAiTransportHost().resolveSecretSentinel(apiKey);
  return new GoogleGenAI2({
    vertexai: true,
    apiKey: resolvedApiKey,
    apiVersion: API_VERSION,
    httpOptions: buildHttpOptions(model, optionsHeaders)
  });
}
function buildHttpOptions(model, optionsHeaders) {
  const httpOptions = {};
  const baseUrl = resolveCustomBaseUrl(model.baseUrl);
  if (baseUrl) {
    httpOptions.baseUrl = baseUrl;
    httpOptions.baseUrlResourceScope = ResourceScope.COLLECTION;
    if (baseUrlIncludesApiVersion(baseUrl)) {
      httpOptions.apiVersion = "";
    }
  }
  if (model.headers || optionsHeaders) {
    httpOptions.headers = resolveAiTransportHeaderSentinels({
      ...model.headers,
      ...optionsHeaders
    });
  }
  return Object.keys(httpOptions).length > 0 ? httpOptions : void 0;
}
function resolveCustomBaseUrl(baseUrl) {
  const trimmed = baseUrl.trim();
  if (!trimmed || trimmed.includes("{location}")) {
    return void 0;
  }
  return trimmed;
}
function baseUrlIncludesApiVersion(baseUrl) {
  try {
    const url = new URL(baseUrl);
    return url.pathname.split("/").some((part) => /^v\d+(?:beta\d*)?$/.test(part));
  } catch {
    return /(?:^|\/)v\d+(?:beta\d*)?(?:\/|$)/.test(baseUrl);
  }
}
function resolveApiKey(options) {
  const apiKey = options?.apiKey?.trim() || process.env.GOOGLE_CLOUD_API_KEY?.trim();
  if (!apiKey || apiKey === GCP_VERTEX_CREDENTIALS_MARKER || isPlaceholderApiKey(apiKey)) {
    return void 0;
  }
  return apiKey;
}
function isPlaceholderApiKey(apiKey) {
  return /^<[^>]+>$/.test(apiKey);
}
function resolveProject(options) {
  const project = options?.project || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
  if (!project) {
    throw new Error(
      "Vertex AI requires a project ID. Set GOOGLE_CLOUD_PROJECT/GCLOUD_PROJECT or pass project in options."
    );
  }
  return project;
}
function resolveLocation(options) {
  const location = options?.location || process.env.GOOGLE_CLOUD_LOCATION;
  if (!location) {
    throw new Error(
      "Vertex AI requires a location. Set GOOGLE_CLOUD_LOCATION or pass location in options."
    );
  }
  return location;
}
function buildParams6(model, context, options = {}) {
  return buildGoogleGenerateContentParams(model, context, options);
}
var API_VERSION, GCP_VERTEX_CREDENTIALS_MARKER, toolCallCounter2, streamGoogleVertex, streamSimpleGoogleVertex;
var init_google_vertex = __esm({
  "packages/ai/src/providers/google-vertex.ts"() {
    "use strict";
    init_host();
    init_event_stream2();
    init_google_shared();
    init_simple_options();
    API_VERSION = "v1";
    GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
    toolCallCounter2 = 0;
    streamGoogleVertex = (model, context, options) => {
      const stream = new AssistantMessageEventStream();
      const output = createGoogleAssistantOutput(model, "google-vertex");
      void runGoogleGenerateContentLifecycle({
        stream,
        model,
        output,
        options,
        createClient: () => {
          const apiKey = resolveApiKey(options);
          return apiKey ? createClientWithApiKey(model, apiKey, options?.headers) : createClient6(model, resolveProject(options), resolveLocation(options), options?.headers);
        },
        buildParams: () => buildParams6(model, context, options),
        nextToolCallId: (name) => `${name}_${Date.now()}_${++toolCallCounter2}`
      });
      return stream;
    };
    streamSimpleGoogleVertex = (model, context, options) => {
      const base = buildBaseOptions(model, options, void 0);
      return streamGoogleVertex(model, context, {
        ...base,
        thinking: buildGoogleSimpleThinking(model, options)
      });
    };
  }
});

// packages/ai/src/providers/register-builtins.ts
init_event_stream2();
var BUILT_IN_API_PROVIDER_SOURCE_ID = "core:built-in";
function forwardStream(target, source) {
  void (async () => {
    for await (const event of source) {
      target.push(event);
    }
    target.end();
  })();
}
function createLazyLoadErrorMessage(model, error) {
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
    stopReason: "error",
    errorMessage: error instanceof Error ? error.message : String(error),
    timestamp: Date.now()
  };
}
function createLazyStream(load, select) {
  return (model, context, options) => {
    const outer = new AssistantMessageEventStream();
    load().then((streams) => forwardStream(outer, select(streams)(model, context, options))).catch((error) => {
      const message = createLazyLoadErrorMessage(model, error);
      outer.push({ type: "error", reason: "error", error: message });
      outer.end(message);
    });
    return outer;
  };
}
function createLazyRegistration(api, importModule, select) {
  let streamsPromise;
  const load = () => streamsPromise ??= importModule().then(select);
  const stream = createLazyStream(load, (streams) => streams.stream);
  const streamSimple = createLazyStream(
    load,
    (streams) => streams.streamSimple
  );
  return (registry) => {
    registry.registerApiProvider({ api, stream, streamSimple }, BUILT_IN_API_PROVIDER_SOURCE_ID);
  };
}
var registerBuiltIns = [
  // Registration is transport-free; each lazy adapter owns its fetch or construction unwrap.
  createLazyRegistration(
    "anthropic-messages",
    () => Promise.resolve().then(() => (init_anthropic2(), anthropic_exports)),
    (module) => ({ stream: module.streamAnthropic, streamSimple: module.streamSimpleAnthropic })
  ),
  createLazyRegistration(
    "openai-completions",
    () => Promise.resolve().then(() => (init_openai_completions(), openai_completions_exports)),
    (module) => ({
      stream: module.streamOpenAICompletions,
      streamSimple: module.streamSimpleOpenAICompletions
    })
  ),
  createLazyRegistration(
    "mistral-conversations",
    () => Promise.resolve().then(() => (init_mistral(), mistral_exports)),
    (module) => ({ stream: module.streamMistral, streamSimple: module.streamSimpleMistral })
  ),
  createLazyRegistration(
    "openai-responses",
    () => Promise.resolve().then(() => (init_openai_responses(), openai_responses_exports)),
    (module) => ({
      stream: module.streamOpenAIResponses,
      streamSimple: module.streamSimpleOpenAIResponses
    })
  ),
  createLazyRegistration(
    "azure-openai-responses",
    () => Promise.resolve().then(() => (init_azure_openai_responses(), azure_openai_responses_exports)),
    (module) => ({
      stream: module.streamAzureOpenAIResponses,
      streamSimple: module.streamSimpleAzureOpenAIResponses
    })
  ),
  createLazyRegistration(
    "openai-chatgpt-responses",
    () => Promise.resolve().then(() => (init_openai_chatgpt_responses(), openai_chatgpt_responses_exports)),
    (module) => ({
      stream: module.streamOpenAICodexResponses,
      streamSimple: module.streamSimpleOpenAICodexResponses
    })
  ),
  createLazyRegistration(
    "google-generative-ai",
    () => Promise.resolve().then(() => (init_google(), google_exports)),
    (module) => ({ stream: module.streamGoogle, streamSimple: module.streamSimpleGoogle })
  ),
  createLazyRegistration(
    "google-vertex",
    () => Promise.resolve().then(() => (init_google_vertex(), google_vertex_exports)),
    (module) => ({
      stream: module.streamGoogleVertex,
      streamSimple: module.streamSimpleGoogleVertex
    })
  )
];
function registerBuiltInApiProviders(registry) {
  for (const register of registerBuiltIns) {
    register(registry);
  }
}
function resetApiProviders(registry) {
  registry.unregisterApiProviders(BUILT_IN_API_PROVIDER_SOURCE_ID);
  registerBuiltInApiProviders(registry);
}
export {
  BUILT_IN_API_PROVIDER_SOURCE_ID,
  registerBuiltInApiProviders,
  resetApiProviders
};
