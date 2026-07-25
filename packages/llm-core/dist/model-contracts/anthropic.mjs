// packages/llm-core/src/model-contracts/anthropic.ts
function normalizeClaudeModelId(modelId) {
  const normalized = modelId?.trim().toLowerCase() ?? "";
  const unprefixed = normalized.startsWith("anthropic/") ? normalized.slice("anthropic/".length) : normalized;
  return unprefixed.replace(/[._\s]+/g, "-");
}
var CLAUDE_FABLE_5_THINKING_PROFILE = {
  levels: [
    { id: "off" },
    { id: "minimal" },
    { id: "low" },
    { id: "medium" },
    { id: "high" },
    { id: "xhigh" },
    { id: "adaptive" },
    { id: "max" }
  ],
  defaultLevel: "high",
  preserveWhenCatalogReasoningFalse: true
};
var CLAUDE_SONNET_5_THINKING_PROFILE = {
  levels: [
    { id: "off" },
    { id: "minimal" },
    { id: "low" },
    { id: "medium" },
    { id: "high" },
    { id: "xhigh" },
    { id: "adaptive" },
    { id: "max" }
  ],
  defaultLevel: "high"
};
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
export {
  CLAUDE_FABLE_5_THINKING_PROFILE,
  CLAUDE_SONNET_5_THINKING_PROFILE,
  requiresClaudeDefaultSampling,
  requiresClaudeMandatoryAdaptiveThinking,
  resolveClaudeFable5ModelIdentity,
  resolveClaudeModelIdentity,
  resolveClaudeMythos5ModelIdentity,
  resolveClaudeNativeThinkingLevelMap,
  resolveClaudeSonnet5ModelIdentity,
  supportsClaudeAdaptiveThinking,
  supportsClaudeNativeMaxEffort,
  supportsClaudeNativeXhighEffort
};
