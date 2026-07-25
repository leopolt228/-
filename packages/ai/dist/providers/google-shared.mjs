// packages/ai/src/providers/google-shared.ts
import {
  FinishReason,
  FunctionCallingConfigMode,
  ThinkingLevel
} from "@google/genai";

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

// packages/ai/src/utils/provider-error.ts
var MAX_ERROR_BODY_LENGTH = 4e3;
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

// packages/normalization-core/src/record-coerce.ts
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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

// packages/ai/src/providers/google-shared.ts
function isThinkingPart(part) {
  return part.thought === true;
}
function retainThoughtSignature(existing, incoming) {
  if (typeof incoming === "string" && incoming.length > 0) {
    return incoming;
  }
  return existing;
}
var base64SignaturePattern = /^[A-Za-z0-9+/]+={0,2}$/;
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
function convertMessages(model, context) {
  const contents = [];
  const normalizeToolCallId = (id) => {
    if (!requiresToolCallId(model.id)) {
      return id;
    }
    return id.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
  };
  const transformedMessages = transformMessages(context.messages, model, normalizeToolCallId);
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
var JSON_SCHEMA_META_DECLARATIONS = /* @__PURE__ */ new Set([
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
function convertTools(tools, useParameters = false) {
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
function mapToolChoice(choice) {
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
  const contents = convertMessages(model, context);
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
    ...context.tools && context.tools.length > 0 && { tools: convertTools(context.tools) }
  };
  if (context.tools && context.tools.length > 0 && options.toolChoice) {
    config.toolConfig = {
      functionCallingConfig: {
        mode: mapToolChoice(options.toolChoice)
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
function mapStopReason(reason) {
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
      params.output.stopReason = mapStopReason(candidate.finishReason);
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
export {
  buildGoogleGenerateContentParams,
  buildGoogleSimpleThinking,
  consumeGoogleGenerateContentStream,
  convertMessages,
  convertTools,
  createGoogleAssistantOutput,
  getDisabledGoogleThinkingConfig,
  runGoogleGenerateContentLifecycle
};
