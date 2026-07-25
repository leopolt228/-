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

// packages/agent-core/src/reasoning.ts
var ENABLED_THINKING_LEVELS = /* @__PURE__ */ new Set([
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max"
]);
function isEnabledThinkingLevel(value) {
  return ENABLED_THINKING_LEVELS.has(value);
}
function resolveAgentReasoningOption(model, thinkingLevel) {
  if (thinkingLevel !== "off") {
    return thinkingLevel;
  }
  const offFallback = model.thinkingLevelMap?.off ?? ((model.api === "anthropic-messages" || model.api === "bedrock-converse-stream") && resolveClaudeFable5ModelIdentity(model) ? "low" : void 0);
  if (isEnabledThinkingLevel(offFallback)) {
    return offFallback;
  }
  return model.api === "anthropic-messages" && resolveClaudeSonnet5ModelIdentity(model) ? "off" : void 0;
}
export {
  resolveAgentReasoningOption
};
