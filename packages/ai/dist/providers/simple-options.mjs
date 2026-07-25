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
export {
  adjustMaxTokensForThinking,
  buildBaseOptions,
  clampMaxTokensToModel,
  clampReasoning
};
