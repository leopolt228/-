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
export {
  readAnthropicCacheWriteUsage,
  readAnthropicPromptUsageSnapshot,
  readAnthropicUsageTokenCount,
  readLastAnthropicIterationUsage
};
