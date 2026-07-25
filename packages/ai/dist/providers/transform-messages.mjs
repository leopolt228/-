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
function resolveClaudeSonnet5ModelIdentity(ref) {
  const normalized = resolveClaudeModelIdentity(ref);
  const match = /(?:^|-)claude-sonnet-5(?=$|[^a-z0-9])/.exec(normalized);
  if (!match) {
    return void 0;
  }
  return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}

// packages/llm-core/src/validation.ts
import { Compile } from "typebox/compile";
var MAX_JSON_COERCE_LENGTH = 64 * 1024;

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

// packages/normalization-core/src/record-coerce.ts
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// packages/ai/src/providers/tool-result-text.ts
var IMAGE_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set(["image", "image_url", "input_image"]);
var AUDIO_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set(["audio", "input_audio", "output_audio"]);
var MEDIA_ONLY_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set([
  ...IMAGE_TOOL_RESULT_TYPES,
  ...AUDIO_TOOL_RESULT_TYPES
]);
function hasMediaPayload(block) {
  return isRecord(block) && typeof block.data === "string" && block.data.trim().length > 0;
}
function isImageWithMediaPayload(block) {
  return isRecord(block) && block.type === "image" && hasMediaPayload(block);
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
export {
  transformMessages
};
