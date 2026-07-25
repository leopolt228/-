// packages/model-catalog-core/src/configured-model-refs.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
var AGENT_MODEL_CONFIG_KEYS = [
  "model",
  "utilityModel",
  "imageModel",
  "imageGenerationModel",
  "videoGenerationModel",
  "musicGenerationModel",
  "voiceModel",
  "pdfModel"
];
function collectConfiguredModelRefs(config, options = {}) {
  const refs = [];
  const pushModelRef = (path, value) => {
    if (typeof value === "string" && value.trim()) {
      refs.push({ path, value: value.trim() });
    }
  };
  const collectModelConfig = (path, value) => {
    if (typeof value === "string") {
      pushModelRef(path, value);
      return;
    }
    if (!isRecord(value)) {
      return;
    }
    pushModelRef(`${path}.primary`, value.primary);
    if (Array.isArray(value.fallbacks)) {
      for (const [index, entry] of value.fallbacks.entries()) {
        pushModelRef(`${path}.fallbacks.${index}`, entry);
      }
    }
  };
  const collectFromAgent = (path, agent) => {
    if (!isRecord(agent)) {
      return;
    }
    for (const key of AGENT_MODEL_CONFIG_KEYS) {
      collectModelConfig(`${path}.${key}`, agent[key]);
    }
    pushModelRef(
      `${path}.heartbeat.model`,
      isRecord(agent.heartbeat) ? agent.heartbeat.model : void 0
    );
    collectModelConfig(
      `${path}.subagents.model`,
      isRecord(agent.subagents) ? agent.subagents.model : void 0
    );
    if (isRecord(agent.compaction)) {
      pushModelRef(`${path}.compaction.model`, agent.compaction.model);
      pushModelRef(
        `${path}.compaction.memoryFlush.model`,
        isRecord(agent.compaction.memoryFlush) ? agent.compaction.memoryFlush.model : void 0
      );
    }
    if (isRecord(agent.models)) {
      for (const modelRef of Object.keys(agent.models)) {
        pushModelRef(`${path}.models.${modelRef}`, modelRef);
      }
    }
  };
  const root = isRecord(config) ? config : {};
  const agents = isRecord(root.agents) ? root.agents : {};
  collectFromAgent("agents.defaults", agents.defaults);
  if (Array.isArray(agents.list)) {
    for (const [index, entry] of agents.list.entries()) {
      collectFromAgent(`agents.list.${index}`, entry);
    }
  }
  if (options.includeChannelModelOverrides !== false) {
    const channels = isRecord(root.channels) ? root.channels : {};
    const modelByChannel = isRecord(channels.modelByChannel) ? channels.modelByChannel : {};
    for (const [channelId, channelMap] of Object.entries(modelByChannel)) {
      if (!isRecord(channelMap)) {
        continue;
      }
      for (const [targetId, modelRef] of Object.entries(channelMap)) {
        pushModelRef(`channels.modelByChannel.${channelId}.${targetId}`, modelRef);
      }
    }
  }
  const hooks = isRecord(root.hooks) ? root.hooks : {};
  if (Array.isArray(hooks.mappings)) {
    for (const [index, mapping] of hooks.mappings.entries()) {
      pushModelRef(`hooks.mappings.${index}.model`, isRecord(mapping) ? mapping.model : void 0);
    }
  }
  pushModelRef("hooks.gmail.model", isRecord(hooks.gmail) ? hooks.gmail.model : void 0);
  pushModelRef(
    "messages.tts.summaryModel",
    isRecord(root.messages) && isRecord(root.messages.tts) ? root.messages.tts.summaryModel : void 0
  );
  pushModelRef(
    "channels.discord.voice.model",
    isRecord(root.channels) && isRecord(root.channels.discord) && isRecord(root.channels.discord.voice) ? root.channels.discord.voice.model : void 0
  );
  return refs;
}
function collectConfiguredModelRefValues(config, options) {
  return collectConfiguredModelRefs(config, options).map((ref) => ref.value);
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

// packages/model-catalog-core/src/provider-id.ts
function normalizeProviderId(provider) {
  return normalizeLowercaseStringOrEmpty(provider);
}
function normalizeProviderIdForAuth(provider) {
  return normalizeProviderId(provider);
}
function findNormalizedProviderValue(entries, provider) {
  if (!entries) {
    return void 0;
  }
  const providerKey = normalizeProviderId(provider);
  for (const [key, value] of Object.entries(entries)) {
    if (normalizeProviderId(key) === providerKey) {
      return value;
    }
  }
  return void 0;
}
function findNormalizedProviderKey(entries, provider) {
  if (!entries) {
    return void 0;
  }
  const providerKey = normalizeProviderId(provider);
  return Object.keys(entries).find((key) => normalizeProviderId(key) === providerKey);
}

// packages/model-catalog-core/src/model-catalog-refs.ts
function normalizeModelCatalogProviderId(provider) {
  return normalizeLowercaseStringOrEmpty(provider);
}
function buildModelCatalogRef(provider, modelId) {
  return `${normalizeModelCatalogProviderId(provider)}/${modelId}`;
}
function parseProviderModelRef(value) {
  const trimmed = value.trim();
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex <= 0 || slashIndex >= trimmed.length - 1) {
    return null;
  }
  const provider = trimmed.slice(0, slashIndex).trim();
  const model = trimmed.slice(slashIndex + 1).trim();
  return provider && model ? { provider, model } : null;
}
function parseModelCatalogRef(value) {
  const parsed = parseProviderModelRef(value);
  if (!parsed) {
    return null;
  }
  return {
    provider: normalizeModelCatalogProviderId(parsed.provider),
    modelId: parsed.model
  };
}
function buildModelCatalogMergeKey(provider, modelId) {
  return `${normalizeModelCatalogProviderId(provider)}::${normalizeLowercaseStringOrEmpty(modelId)}`;
}

// packages/model-catalog-core/src/model-catalog-types.ts
var MODEL_CATALOG_APIS = [
  "openai-completions",
  "openai-responses",
  "openai-chatgpt-responses",
  "anthropic-messages",
  "google-generative-ai",
  "google-vertex",
  "github-copilot",
  "bedrock-converse-stream",
  "ollama",
  "azure-openai-responses"
];
var MODEL_CATALOG_THINKING_FORMATS = [
  "openai",
  "openrouter",
  "deepseek",
  "together",
  "qwen",
  "qwen-chat-template",
  "zai"
];
function isModelCatalogThinkingFormat(value) {
  return MODEL_CATALOG_THINKING_FORMATS.includes(value);
}
var MODEL_CATALOG_THINKING_LEVELS = [
  "off",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max"
];

// packages/model-catalog-core/src/model-catalog-normalize.ts
var MODEL_CATALOG_INPUTS = /* @__PURE__ */ new Set(["text", "image", "document"]);
var MODEL_CATALOG_DISCOVERY_MODES = /* @__PURE__ */ new Set(["static", "refreshable", "runtime"]);
var MODEL_CATALOG_STATUSES = /* @__PURE__ */ new Set(["available", "preview", "deprecated", "disabled"]);
var MODEL_CATALOG_API_SET = new Set(MODEL_CATALOG_APIS);
var DEFAULT_MODEL_INPUT = ["text"];
var DEFAULT_MODEL_STATUS = "available";
function isRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isBlockedObjectKey(key) {
  return key === "__proto__" || key === "prototype" || key === "constructor";
}
function normalizeOptionalString2(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : void 0;
}
function normalizeTrimmedStringList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    const normalized = normalizeOptionalString2(entry);
    return normalized ? [normalized] : [];
  });
}
function normalizeOptionalTrimmedStringList(value) {
  const normalized = normalizeTrimmedStringList(value);
  return normalized.length > 0 ? normalized : void 0;
}
function normalizeModelCatalogThinkingLevelMap(value) {
  if (!isRecord2(value)) {
    return void 0;
  }
  const normalized = {};
  for (const level of MODEL_CATALOG_THINKING_LEVELS) {
    const mapped = value[level];
    if (mapped === null) {
      normalized[level] = null;
      continue;
    }
    const normalizedValue = normalizeOptionalString2(mapped);
    if (normalizedValue !== void 0) {
      normalized[level] = normalizedValue;
    }
  }
  return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeSafeRecordKey(value) {
  const key = normalizeOptionalString2(value) ?? "";
  return key && !isBlockedObjectKey(key) ? key : "";
}
function normalizeOwnedProviderSet(providers) {
  const normalized = /* @__PURE__ */ new Set();
  for (const provider of providers) {
    const providerId = normalizeModelCatalogProviderId(provider);
    if (providerId) {
      normalized.add(providerId);
    }
  }
  return normalized;
}
function normalizeStringMap(value) {
  if (!isRecord2(value)) {
    return void 0;
  }
  const normalized = {};
  for (const [rawKey, rawValue] of Object.entries(value)) {
    const key = normalizeSafeRecordKey(rawKey);
    const mapValue = normalizeOptionalString2(rawValue) ?? "";
    if (key && mapValue) {
      normalized[key] = mapValue;
    }
  }
  return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function mergeStringMaps(base, override) {
  if (!base && !override) {
    return void 0;
  }
  return { ...base, ...override };
}
function normalizeModelCatalogApi(value) {
  const api = normalizeOptionalString2(value) ?? "";
  return MODEL_CATALOG_API_SET.has(api) ? api : void 0;
}
function normalizeModelCatalogInputs(value) {
  const inputs = normalizeTrimmedStringList(value).filter(
    (input) => MODEL_CATALOG_INPUTS.has(input)
  );
  return inputs.length > 0 ? inputs : void 0;
}
function normalizeNonNegativeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : void 0;
}
function normalizeFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function normalizeStringOrNumber(value) {
  return normalizeOptionalString2(value) ?? normalizeFiniteNumber(value);
}
function normalizePositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : void 0;
}
function normalizePositiveInteger(value) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function normalizeModelCatalogTieredCost(value) {
  if (!Array.isArray(value)) {
    return void 0;
  }
  const normalized = [];
  for (const entry of value) {
    if (!isRecord2(entry) || !Array.isArray(entry.range)) {
      continue;
    }
    const input = normalizeNonNegativeNumber(entry.input);
    const output = normalizeNonNegativeNumber(entry.output);
    const cacheRead = normalizeNonNegativeNumber(entry.cacheRead);
    const cacheWrite = normalizeNonNegativeNumber(entry.cacheWrite);
    if (input === void 0 || output === void 0 || cacheRead === void 0 || cacheWrite === void 0 || entry.range.length < 1 || entry.range.length > 2) {
      continue;
    }
    const rangeValues = entry.range.map((rangeValue) => normalizeNonNegativeNumber(rangeValue));
    if (rangeValues.some((rangeValue) => rangeValue === void 0)) {
      continue;
    }
    normalized.push({
      input,
      output,
      cacheRead,
      cacheWrite,
      range: rangeValues.length === 1 ? [rangeValues[0]] : [rangeValues[0], rangeValues[1]]
    });
  }
  return normalized.length > 0 ? normalized : void 0;
}
function normalizeModelCatalogCost(value) {
  if (!isRecord2(value)) {
    return void 0;
  }
  const input = normalizeNonNegativeNumber(value.input);
  const output = normalizeNonNegativeNumber(value.output);
  const cacheRead = normalizeNonNegativeNumber(value.cacheRead);
  const cacheWrite = normalizeNonNegativeNumber(value.cacheWrite);
  const tieredPricing = normalizeModelCatalogTieredCost(value.tieredPricing);
  const cost = {
    ...input !== void 0 ? { input } : {},
    ...output !== void 0 ? { output } : {},
    ...cacheRead !== void 0 ? { cacheRead } : {},
    ...cacheWrite !== void 0 ? { cacheWrite } : {},
    ...tieredPricing ? { tieredPricing } : {}
  };
  return Object.keys(cost).length > 0 ? cost : void 0;
}
function normalizeOpenRouterPrice(value) {
  if (!isRecord2(value)) {
    return void 0;
  }
  const maxPrice = {
    ...normalizeStringOrNumber(value.prompt) !== void 0 ? { prompt: normalizeStringOrNumber(value.prompt) } : {},
    ...normalizeStringOrNumber(value.completion) !== void 0 ? { completion: normalizeStringOrNumber(value.completion) } : {},
    ...normalizeStringOrNumber(value.image) !== void 0 ? { image: normalizeStringOrNumber(value.image) } : {},
    ...normalizeStringOrNumber(value.audio) !== void 0 ? { audio: normalizeStringOrNumber(value.audio) } : {},
    ...normalizeStringOrNumber(value.request) !== void 0 ? { request: normalizeStringOrNumber(value.request) } : {}
  };
  return Object.keys(maxPrice).length > 0 ? maxPrice : void 0;
}
function normalizeOpenRouterPercentileCutoffs(value) {
  if (!isRecord2(value)) {
    return void 0;
  }
  const normalized = {
    ...normalizeFiniteNumber(value.p50) !== void 0 ? { p50: normalizeFiniteNumber(value.p50) } : {},
    ...normalizeFiniteNumber(value.p75) !== void 0 ? { p75: normalizeFiniteNumber(value.p75) } : {},
    ...normalizeFiniteNumber(value.p90) !== void 0 ? { p90: normalizeFiniteNumber(value.p90) } : {},
    ...normalizeFiniteNumber(value.p99) !== void 0 ? { p99: normalizeFiniteNumber(value.p99) } : {}
  };
  return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeOpenRouterMetricPreference(value) {
  return normalizeFiniteNumber(value) ?? normalizeOpenRouterPercentileCutoffs(value);
}
function normalizeOpenRouterSort(value) {
  const sort = normalizeOptionalString2(value);
  if (sort) {
    return sort;
  }
  if (!isRecord2(value)) {
    return void 0;
  }
  const by = normalizeOptionalString2(value.by);
  const partition = value.partition === null ? null : normalizeOptionalString2(value.partition) ?? void 0;
  const normalized = {
    ...by ? { by } : {},
    ...partition !== void 0 ? { partition } : {}
  };
  return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeOpenRouterRouting(value) {
  if (!isRecord2(value)) {
    return void 0;
  }
  const routing = {
    ...typeof value.allow_fallbacks === "boolean" ? { allow_fallbacks: value.allow_fallbacks } : {},
    ...typeof value.require_parameters === "boolean" ? { require_parameters: value.require_parameters } : {},
    ...value.data_collection === "deny" || value.data_collection === "allow" ? { data_collection: value.data_collection } : {},
    ...typeof value.zdr === "boolean" ? { zdr: value.zdr } : {},
    ...typeof value.enforce_distillable_text === "boolean" ? { enforce_distillable_text: value.enforce_distillable_text } : {},
    ...normalizeOptionalTrimmedStringList(value.order) ? { order: normalizeOptionalTrimmedStringList(value.order) } : {},
    ...normalizeOptionalTrimmedStringList(value.only) ? { only: normalizeOptionalTrimmedStringList(value.only) } : {},
    ...normalizeOptionalTrimmedStringList(value.ignore) ? { ignore: normalizeOptionalTrimmedStringList(value.ignore) } : {},
    ...normalizeOptionalTrimmedStringList(value.quantizations) ? { quantizations: normalizeOptionalTrimmedStringList(value.quantizations) } : {},
    ...normalizeOpenRouterSort(value.sort) ? { sort: normalizeOpenRouterSort(value.sort) } : {},
    ...normalizeOpenRouterPrice(value.max_price) ? { max_price: normalizeOpenRouterPrice(value.max_price) } : {},
    ...normalizeOpenRouterMetricPreference(value.preferred_min_throughput) !== void 0 ? {
      preferred_min_throughput: normalizeOpenRouterMetricPreference(
        value.preferred_min_throughput
      )
    } : {},
    ...normalizeOpenRouterMetricPreference(value.preferred_max_latency) !== void 0 ? { preferred_max_latency: normalizeOpenRouterMetricPreference(value.preferred_max_latency) } : {}
  };
  return Object.keys(routing).length > 0 ? routing : void 0;
}
function normalizeVercelGatewayRouting(value) {
  if (!isRecord2(value)) {
    return void 0;
  }
  const routing = {
    ...normalizeOptionalTrimmedStringList(value.only) ? { only: normalizeOptionalTrimmedStringList(value.only) } : {},
    ...normalizeOptionalTrimmedStringList(value.order) ? { order: normalizeOptionalTrimmedStringList(value.order) } : {}
  };
  return Object.keys(routing).length > 0 ? routing : void 0;
}
function normalizeModelCatalogCompat(value) {
  if (!isRecord2(value)) {
    return void 0;
  }
  const compat = {};
  const booleanFields = [
    "supportsStore",
    "supportsPromptCacheKey",
    "supportsDeveloperRole",
    "supportsReasoningEffort",
    "supportsTemperature",
    "supportsUsageInStreaming",
    "supportsTools",
    "supportsStrictMode",
    "requiresStringContent",
    "strictMessageKeys",
    "requiresToolResultName",
    "requiresAssistantAfterToolResult",
    "requiresThinkingAsText",
    "requiresReasoningContentOnAssistantMessages",
    "zaiToolStream",
    "sendSessionAffinityHeaders",
    "sendSessionIdHeader",
    "supportsEagerToolInputStreaming",
    "supportsLongCacheRetention",
    "nativeWebSearchTool",
    "requiresMistralToolIds",
    "requiresOpenAiAnthropicToolPayload"
  ];
  for (const field of booleanFields) {
    if (typeof value[field] === "boolean") {
      compat[field] = value[field];
    }
  }
  const stringFields = ["toolSchemaProfile", "toolCallArgumentsEncoding"];
  for (const field of stringFields) {
    const normalized = normalizeOptionalString2(value[field]) ?? "";
    if (normalized) {
      compat[field] = normalized;
    }
  }
  const stringListFields = [
    "visibleReasoningDetailTypes",
    "supportedReasoningEfforts",
    "unsupportedToolSchemaKeywords"
  ];
  for (const field of stringListFields) {
    const normalized = normalizeTrimmedStringList(value[field]);
    if (normalized.length > 0) {
      compat[field] = normalized;
    }
  }
  if (isRecord2(value.reasoningEffortMap)) {
    const reasoningEffortMap = Object.fromEntries(
      Object.entries(value.reasoningEffortMap).flatMap(([rawKey, rawMapped]) => {
        const key = rawKey.trim();
        const mapped = typeof rawMapped === "string" ? rawMapped.trim() : "";
        return key && mapped ? [[key, mapped]] : [];
      })
    );
    if (Object.keys(reasoningEffortMap).length > 0) {
      compat.reasoningEffortMap = reasoningEffortMap;
    }
  }
  const maxTokensField = normalizeOptionalString2(value.maxTokensField) ?? "";
  if (maxTokensField === "max_completion_tokens" || maxTokensField === "max_tokens") {
    compat.maxTokensField = maxTokensField;
  }
  const thinkingFormat = normalizeOptionalString2(value.thinkingFormat) ?? "";
  if (isModelCatalogThinkingFormat(thinkingFormat)) {
    compat.thinkingFormat = thinkingFormat;
  }
  if (value.cacheControlFormat === "anthropic") {
    compat.cacheControlFormat = "anthropic";
  }
  const openRouterRouting = normalizeOpenRouterRouting(value.openRouterRouting);
  if (openRouterRouting) {
    compat.openRouterRouting = openRouterRouting;
  }
  const vercelGatewayRouting = normalizeVercelGatewayRouting(value.vercelGatewayRouting);
  if (vercelGatewayRouting) {
    compat.vercelGatewayRouting = vercelGatewayRouting;
  }
  return Object.keys(compat).length > 0 ? compat : void 0;
}
function normalizeModelCatalogStatus(value) {
  const status = normalizeOptionalString2(value) ?? "";
  return MODEL_CATALOG_STATUSES.has(status) ? status : void 0;
}
function normalizeModelCatalogImageTokenMode(value) {
  const tokenMode = normalizeOptionalString2(value) ?? "";
  if (tokenMode === "tile" || tokenMode === "detail" || tokenMode === "provider") {
    return tokenMode;
  }
  return void 0;
}
function normalizeModelCatalogMediaInput(value) {
  if (!isRecord2(value) || !isRecord2(value.image)) {
    return void 0;
  }
  const maxBytes = normalizePositiveInteger(value.image.maxBytes);
  const maxPixels = normalizePositiveInteger(value.image.maxPixels);
  const maxSidePx = normalizePositiveInteger(value.image.maxSidePx);
  const preferredSidePx = normalizePositiveInteger(value.image.preferredSidePx);
  const tokenMode = normalizeModelCatalogImageTokenMode(value.image.tokenMode);
  const normalizedImage = {
    ...maxBytes !== void 0 ? { maxBytes } : {},
    ...maxPixels !== void 0 ? { maxPixels } : {},
    ...maxSidePx !== void 0 ? { maxSidePx } : {},
    ...preferredSidePx !== void 0 ? { preferredSidePx } : {},
    ...tokenMode ? { tokenMode } : {}
  };
  return Object.keys(normalizedImage).length > 0 ? { image: normalizedImage } : void 0;
}
function normalizeModelCatalogModel(value) {
  if (!isRecord2(value)) {
    return void 0;
  }
  const id = normalizeOptionalString2(value.id) ?? "";
  if (!id) {
    return void 0;
  }
  const name = normalizeOptionalString2(value.name) ?? "";
  const api = normalizeModelCatalogApi(value.api);
  const baseUrl = normalizeOptionalString2(value.baseUrl) ?? "";
  const headers = normalizeStringMap(value.headers);
  const input = normalizeModelCatalogInputs(value.input);
  const reasoning = typeof value.reasoning === "boolean" ? value.reasoning : void 0;
  const contextWindow = normalizePositiveNumber(value.contextWindow);
  const contextTokens = normalizePositiveInteger(value.contextTokens);
  const maxTokens = normalizePositiveNumber(value.maxTokens);
  const thinkingLevelMap = normalizeModelCatalogThinkingLevelMap(value.thinkingLevelMap);
  const cost = normalizeModelCatalogCost(value.cost);
  const compat = normalizeModelCatalogCompat(value.compat);
  const mediaInput = normalizeModelCatalogMediaInput(value.mediaInput);
  const status = normalizeModelCatalogStatus(value.status);
  const statusReason = normalizeOptionalString2(value.statusReason) ?? "";
  const replaces = normalizeTrimmedStringList(value.replaces);
  const replacedBy = normalizeOptionalString2(value.replacedBy) ?? "";
  const tags = normalizeTrimmedStringList(value.tags);
  return {
    id,
    ...name ? { name } : {},
    ...api ? { api } : {},
    ...baseUrl ? { baseUrl } : {},
    ...headers ? { headers } : {},
    ...input ? { input } : {},
    ...reasoning !== void 0 ? { reasoning } : {},
    ...contextWindow !== void 0 ? { contextWindow } : {},
    ...contextTokens !== void 0 ? { contextTokens } : {},
    ...maxTokens !== void 0 ? { maxTokens } : {},
    ...thinkingLevelMap ? { thinkingLevelMap } : {},
    ...cost ? { cost } : {},
    ...compat ? { compat } : {},
    ...mediaInput ? { mediaInput } : {},
    ...status ? { status } : {},
    ...statusReason ? { statusReason } : {},
    ...replaces.length > 0 ? { replaces } : {},
    ...replacedBy ? { replacedBy } : {},
    ...tags.length > 0 ? { tags } : {}
  };
}
function normalizeModelCatalogProvider(value) {
  if (!isRecord2(value)) {
    return void 0;
  }
  const models = Array.isArray(value.models) ? value.models.map((entry) => normalizeModelCatalogModel(entry)).filter((entry) => Boolean(entry)) : [];
  if (models.length === 0) {
    return void 0;
  }
  const baseUrl = normalizeOptionalString2(value.baseUrl) ?? "";
  const api = normalizeModelCatalogApi(value.api);
  const headers = normalizeStringMap(value.headers);
  const defaultUtilityModel = normalizeOptionalString2(value.defaultUtilityModel) ?? "";
  return {
    ...baseUrl ? { baseUrl } : {},
    ...api ? { api } : {},
    ...headers ? { headers } : {},
    ...defaultUtilityModel ? { defaultUtilityModel } : {},
    models
  };
}
function normalizeModelCatalogProviders(value, ownedProviders) {
  if (!isRecord2(value)) {
    return void 0;
  }
  const providers = {};
  for (const [rawProviderId, rawProvider] of Object.entries(value)) {
    const providerId = normalizeModelCatalogProviderId(rawProviderId);
    if (!providerId || !ownedProviders.has(providerId)) {
      continue;
    }
    const provider = normalizeModelCatalogProvider(rawProvider);
    if (provider) {
      providers[providerId] = provider;
    }
  }
  return Object.keys(providers).length > 0 ? providers : void 0;
}
function normalizeModelCatalogAliases(value, ownedProviders) {
  if (!isRecord2(value)) {
    return void 0;
  }
  const aliases = {};
  for (const [rawAlias, rawTarget] of Object.entries(value)) {
    const alias = normalizeModelCatalogProviderId(rawAlias);
    if (!alias || !isRecord2(rawTarget)) {
      continue;
    }
    const provider = normalizeModelCatalogProviderId(
      normalizeOptionalString2(rawTarget.provider) ?? ""
    );
    if (!provider || !ownedProviders.has(provider)) {
      continue;
    }
    const api = normalizeModelCatalogApi(rawTarget.api);
    const baseUrl = normalizeOptionalString2(rawTarget.baseUrl) ?? "";
    aliases[alias] = {
      provider,
      ...api ? { api } : {},
      ...baseUrl ? { baseUrl } : {}
    };
  }
  return Object.keys(aliases).length > 0 ? aliases : void 0;
}
function normalizeModelCatalogSuppressions(value) {
  if (!Array.isArray(value)) {
    return void 0;
  }
  const suppressions = [];
  for (const entry of value) {
    if (!isRecord2(entry)) {
      continue;
    }
    const provider = normalizeModelCatalogProviderId(normalizeOptionalString2(entry.provider) ?? "");
    const model = normalizeOptionalString2(entry.model) ?? "";
    if (!provider || !model) {
      continue;
    }
    const reason = normalizeOptionalString2(entry.reason) ?? "";
    const rawWhen = isRecord2(entry.when) ? entry.when : void 0;
    const baseUrlHosts = normalizeTrimmedStringList(rawWhen?.baseUrlHosts).map(
      (host) => host.toLowerCase()
    );
    const providerConfigApiIn = normalizeTrimmedStringList(rawWhen?.providerConfigApiIn).map(
      (api) => api.toLowerCase()
    );
    const when = baseUrlHosts.length > 0 || providerConfigApiIn.length > 0 ? {
      ...baseUrlHosts.length > 0 ? { baseUrlHosts } : {},
      ...providerConfigApiIn.length > 0 ? { providerConfigApiIn } : {}
    } : void 0;
    suppressions.push({
      provider,
      model,
      ...reason ? { reason } : {},
      ...when ? { when } : {}
    });
  }
  return suppressions.length > 0 ? suppressions : void 0;
}
function normalizeModelCatalogDiscovery(value, ownedProviders) {
  if (!isRecord2(value)) {
    return void 0;
  }
  const discovery = {};
  for (const [rawProviderId, rawMode] of Object.entries(value)) {
    const providerId = normalizeModelCatalogProviderId(rawProviderId);
    const mode = normalizeOptionalString2(rawMode) ?? "";
    if (providerId && ownedProviders.has(providerId) && MODEL_CATALOG_DISCOVERY_MODES.has(mode)) {
      discovery[providerId] = mode;
    }
  }
  return Object.keys(discovery).length > 0 ? discovery : void 0;
}
function normalizeModelCatalog(value, params) {
  if (!isRecord2(value)) {
    return void 0;
  }
  const ownedProviders = normalizeOwnedProviderSet(params.ownedProviders);
  const providers = normalizeModelCatalogProviders(value.providers, ownedProviders);
  const aliases = normalizeModelCatalogAliases(value.aliases, ownedProviders);
  const suppressions = normalizeModelCatalogSuppressions(value.suppressions);
  const discovery = normalizeModelCatalogDiscovery(value.discovery, ownedProviders);
  const runtimeAugment = value.runtimeAugment === true;
  const catalog = {
    ...providers ? { providers } : {},
    ...aliases ? { aliases } : {},
    ...suppressions ? { suppressions } : {},
    ...discovery ? { discovery } : {},
    ...runtimeAugment ? { runtimeAugment } : {}
  };
  return Object.keys(catalog).length > 0 ? catalog : void 0;
}
function normalizeModelCatalogProviderRows(params) {
  const provider = normalizeModelCatalogProviderId(params.provider);
  if (!provider || !Array.isArray(params.providerCatalog.models)) {
    return [];
  }
  const providerApi = normalizeModelCatalogApi(params.providerCatalog.api);
  const providerBaseUrl = normalizeOptionalString2(params.providerCatalog.baseUrl) ?? "";
  const providerHeaders = normalizeStringMap(params.providerCatalog.headers);
  const rows = [];
  for (const model of params.providerCatalog.models) {
    const id = normalizeOptionalString2(model.id) ?? "";
    if (!id) {
      continue;
    }
    const api = normalizeModelCatalogApi(model.api) ?? providerApi;
    const baseUrl = normalizeOptionalString2(model.baseUrl) ?? providerBaseUrl;
    const headers = mergeStringMaps(providerHeaders, normalizeStringMap(model.headers));
    const contextWindow = normalizePositiveNumber(model.contextWindow);
    const contextTokens = normalizePositiveInteger(model.contextTokens);
    const maxTokens = normalizePositiveNumber(model.maxTokens);
    const thinkingLevelMap = normalizeModelCatalogThinkingLevelMap(model.thinkingLevelMap);
    const cost = normalizeModelCatalogCost(model.cost);
    const compat = normalizeModelCatalogCompat(model.compat);
    const mediaInput = normalizeModelCatalogMediaInput(model.mediaInput);
    const statusReason = normalizeOptionalString2(model.statusReason) ?? "";
    const replacedBy = normalizeOptionalString2(model.replacedBy) ?? "";
    const replaces = normalizeOptionalTrimmedStringList(model.replaces);
    const tags = normalizeOptionalTrimmedStringList(model.tags);
    rows.push({
      provider,
      id,
      ref: buildModelCatalogRef(provider, id),
      mergeKey: buildModelCatalogMergeKey(provider, id),
      name: normalizeOptionalString2(model.name) || id,
      source: params.source,
      input: normalizeModelCatalogInputs(model.input) ?? [...DEFAULT_MODEL_INPUT],
      reasoning: typeof model.reasoning === "boolean" ? model.reasoning : false,
      status: normalizeModelCatalogStatus(model.status) ?? DEFAULT_MODEL_STATUS,
      ...api ? { api } : {},
      ...baseUrl ? { baseUrl } : {},
      ...headers ? { headers } : {},
      ...contextWindow !== void 0 ? { contextWindow } : {},
      ...contextTokens !== void 0 ? { contextTokens } : {},
      ...maxTokens !== void 0 ? { maxTokens } : {},
      ...thinkingLevelMap ? { thinkingLevelMap } : {},
      ...cost ? { cost } : {},
      ...compat ? { compat } : {},
      ...mediaInput ? { mediaInput } : {},
      ...statusReason ? { statusReason } : {},
      ...replaces ? { replaces } : {},
      ...replacedBy ? { replacedBy } : {},
      ...tags ? { tags } : {}
    });
  }
  return rows.toSorted((a, b) => a.provider.localeCompare(b.provider) || a.id.localeCompare(b.id));
}

// packages/model-catalog-core/src/provider-model-id-normalize.ts
var ANTIGRAVITY_BARE_PRO_IDS = /* @__PURE__ */ new Set(["gemini-3-pro", "gemini-3.1-pro", "gemini-3-1-pro"]);
var GOOGLE_PROVIDER_PREFIX = "google/";
function normalizeGooglePreviewModelId(id) {
  if (id.startsWith(GOOGLE_PROVIDER_PREFIX)) {
    const modelId = id.slice(GOOGLE_PROVIDER_PREFIX.length);
    const normalizedModelId = normalizeGooglePreviewModelId(modelId);
    return normalizedModelId === modelId ? id : `${GOOGLE_PROVIDER_PREFIX}${normalizedModelId}`;
  }
  if (id === "gemini-3-pro" || id === "gemini-3-pro-preview") {
    return "gemini-3.1-pro-preview";
  }
  if (id === "gemini-3-flash") {
    return "gemini-3-flash-preview";
  }
  if (id === "gemini-3.1-pro") {
    return "gemini-3.1-pro-preview";
  }
  if (id === "gemini-3.1-flash-lite-preview") {
    return "gemini-3.1-flash-lite";
  }
  if (id === "gemini-3.1-flash" || id === "gemini-3.1-flash-preview") {
    return "gemini-3-flash-preview";
  }
  if (id === "gemma-4-26b") {
    return "gemma-4-26b-a4b-it";
  }
  return id;
}
function normalizeTogetherModelId(id) {
  if (id === "moonshotai/Kimi-K2.5") {
    return "moonshotai/Kimi-K2.6";
  }
  return id;
}
function normalizeAntigravityPreviewModelId(id) {
  if (ANTIGRAVITY_BARE_PRO_IDS.has(id)) {
    return `${id}-low`;
  }
  return id;
}

// packages/model-catalog-core/src/provider-model-id-normalization.ts
var currentManifestModelIdNormalizationPolicies;
function collectManifestModelIdNormalizationPolicies(plugins) {
  const policies = /* @__PURE__ */ new Map();
  for (const plugin of plugins) {
    for (const [provider, policy] of Object.entries(plugin.modelIdNormalization?.providers ?? {})) {
      policies.set(normalizeLowercaseStringOrEmpty(provider), policy);
    }
  }
  return policies;
}
function setCurrentManifestModelIdNormalizationRecords(plugins) {
  currentManifestModelIdNormalizationPolicies = plugins ? collectManifestModelIdNormalizationPolicies(plugins) : void 0;
}
function getCurrentManifestModelIdNormalizationPolicies() {
  return currentManifestModelIdNormalizationPolicies;
}
function hasProviderPrefix(modelId) {
  return modelId.includes("/");
}
function formatPrefixedModelId(prefix, modelId) {
  return `${prefix.replace(/\/+$/u, "")}/${modelId.replace(/^\/+/u, "")}`;
}
function stripSelfProviderModelPrefix(provider, model) {
  const prefix = `${normalizeLowercaseStringOrEmpty(provider)}/`;
  const trimmed = model.trim();
  return normalizeLowercaseStringOrEmpty(trimmed).startsWith(prefix) ? trimmed.slice(prefix.length) : model;
}
function normalizeProviderModelIdWithPolicies(params) {
  const policy = params.policies.get(normalizeLowercaseStringOrEmpty(params.provider));
  if (!policy) {
    return void 0;
  }
  let modelId = params.context.modelId.trim();
  if (!modelId) {
    return modelId;
  }
  for (const prefix of policy.stripPrefixes ?? []) {
    const normalizedPrefix = normalizeLowercaseStringOrEmpty(prefix);
    if (normalizedPrefix && normalizeLowercaseStringOrEmpty(modelId).startsWith(normalizedPrefix)) {
      modelId = modelId.slice(normalizedPrefix.length);
      break;
    }
  }
  modelId = policy.aliases?.[normalizeLowercaseStringOrEmpty(modelId)] ?? modelId;
  if (!hasProviderPrefix(modelId)) {
    for (const rule of policy.prefixWhenBareAfterAliasStartsWith ?? []) {
      if (normalizeLowercaseStringOrEmpty(modelId).startsWith(rule.modelPrefix.toLowerCase())) {
        return formatPrefixedModelId(rule.prefix, modelId);
      }
    }
    if (policy.prefixWhenBare) {
      return formatPrefixedModelId(policy.prefixWhenBare, modelId);
    }
  }
  return modelId;
}
function normalizeBuiltInProviderModelId(provider, model) {
  const normalizedProvider = normalizeLowercaseStringOrEmpty(provider);
  if (normalizedProvider === "google" || normalizedProvider === "google-gemini-cli" || normalizedProvider === "google-vertex") {
    return normalizeGooglePreviewModelId(model);
  }
  if (normalizedProvider === "openrouter") {
    const trimmed = model.trim();
    return trimmed && !trimmed.includes("/") ? `openrouter/${trimmed}` : model;
  }
  if (normalizedProvider === "anthropic") {
    const anthropicAliases = {
      "opus-4.8": "claude-opus-4-8",
      opus: "claude-opus-4-8",
      "opus-4.6": "claude-opus-4-6",
      "sonnet-5": "claude-sonnet-5",
      sonnet: "claude-sonnet-5",
      "sonnet-4.6": "claude-sonnet-4-6"
    };
    const anthropicPrefix = "anthropic/";
    const normalizedModel = normalizeLowercaseStringOrEmpty(model);
    const providerModel = normalizedModel.startsWith(anthropicPrefix) ? model.trim().slice(anthropicPrefix.length) : model;
    return anthropicAliases[normalizeLowercaseStringOrEmpty(providerModel)] ?? providerModel;
  }
  if (normalizedProvider === "vercel-ai-gateway") {
    const vercelAliases = {
      "opus-4.6": "claude-opus-4-6",
      "sonnet-5": "claude-sonnet-5",
      sonnet: "claude-sonnet-4-6",
      "sonnet-4.6": "claude-sonnet-4-6"
    };
    const aliased = vercelAliases[normalizeLowercaseStringOrEmpty(model)] ?? model;
    return normalizeLowercaseStringOrEmpty(aliased).startsWith("claude-") ? `anthropic/${aliased}` : aliased;
  }
  if (normalizedProvider === "huggingface") {
    const prefix = "huggingface/";
    return normalizeLowercaseStringOrEmpty(model).startsWith(prefix) ? model.slice(prefix.length) : model;
  }
  if (normalizedProvider === "nvidia") {
    const trimmed = model.trim();
    return trimmed && !trimmed.includes("/") ? `nvidia/${trimmed}` : model;
  }
  if (normalizedProvider === "xai") {
    const xaiAliases = {
      "grok-4.3-latest": "grok-4.3",
      "grok-4.5-latest": "grok-4.5",
      "grok-build-latest": "grok-4.5",
      "grok-4-fast-reasoning": "grok-4-fast",
      "grok-4-1-fast-reasoning": "grok-4-1-fast"
    };
    return xaiAliases[normalizeLowercaseStringOrEmpty(model)] ?? model;
  }
  if (normalizedProvider === "openai") {
    return model;
  }
  if (normalizedProvider === "together") {
    return normalizeTogetherModelId(model);
  }
  return model;
}
function normalizeStaticProviderModelIdWithPolicies(provider, model, policies) {
  const normalizedProvider = normalizeLowercaseStringOrEmpty(provider);
  const manifestModelId = policies ? normalizeProviderModelIdWithPolicies({
    provider: normalizedProvider,
    policies,
    context: {
      modelId: model
    }
  }) ?? model : model;
  return normalizeBuiltInProviderModelId(normalizedProvider, manifestModelId);
}
function normalizeConfiguredProviderCatalogModelId(provider, model, policies = getCurrentManifestModelIdNormalizationPolicies()) {
  const providerModel = normalizeStaticProviderModelIdWithPolicies(provider, model, policies);
  return normalizeConfiguredProviderCatalogModelRef(providerModel);
}
function normalizeConfiguredProviderCatalogModelRef(providerModel) {
  const googlePrefix = "google/";
  if (!providerModel.startsWith(googlePrefix)) {
    const parsed = parseModelCatalogRef(providerModel);
    if (!parsed) {
      return providerModel;
    }
    if (!parsed.modelId.startsWith(googlePrefix)) {
      return providerModel;
    }
    const normalizedModelId2 = normalizeGooglePreviewModelId(parsed.modelId);
    return normalizedModelId2 === parsed.modelId ? providerModel : `${parsed.provider}/${normalizedModelId2}`;
  }
  const modelId = providerModel.slice(googlePrefix.length);
  const normalizedModelId = normalizeGooglePreviewModelId(modelId);
  return normalizedModelId === modelId ? providerModel : `${googlePrefix}${normalizedModelId}`;
}
export {
  AGENT_MODEL_CONFIG_KEYS,
  MODEL_CATALOG_APIS,
  MODEL_CATALOG_THINKING_FORMATS,
  MODEL_CATALOG_THINKING_LEVELS,
  buildModelCatalogMergeKey,
  buildModelCatalogRef,
  collectConfiguredModelRefValues,
  collectConfiguredModelRefs,
  collectManifestModelIdNormalizationPolicies,
  findNormalizedProviderKey,
  findNormalizedProviderValue,
  isModelCatalogThinkingFormat,
  normalizeAntigravityPreviewModelId,
  normalizeBuiltInProviderModelId,
  normalizeConfiguredProviderCatalogModelId,
  normalizeConfiguredProviderCatalogModelRef,
  normalizeGooglePreviewModelId,
  normalizeLowercaseStringOrEmpty,
  normalizeModelCatalog,
  normalizeModelCatalogProviderId,
  normalizeModelCatalogProviderRows,
  normalizeProviderId,
  normalizeProviderIdForAuth,
  normalizeProviderModelIdWithPolicies,
  normalizeStaticProviderModelIdWithPolicies,
  normalizeTogetherModelId,
  parseModelCatalogRef,
  parseProviderModelRef,
  setCurrentManifestModelIdNormalizationRecords,
  stripSelfProviderModelPrefix
};
