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
function readResponsesReasoningTokens(usage) {
  const reasoningTokens = usage?.output_tokens_details?.reasoning_tokens;
  return typeof reasoningTokens === "number" && Number.isFinite(reasoningTokens) ? reasoningTokens : void 0;
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
export {
  mapResponsesTerminalUsage,
  readResponsesReasoningTokens,
  resolveResponsesTerminalStopReason
};
