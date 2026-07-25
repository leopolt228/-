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
export {
  applyProviderReportedUsageCost,
  calculateCost,
  clampThinkingLevel,
  getSupportedThinkingLevels,
  modelsAreEqual
};
