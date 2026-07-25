// packages/ai/src/providers/anthropic-thinking-replay.ts
var ANTHROPIC_OMITTED_REASONING_TEXT = "[assistant reasoning omitted]";
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
export {
  ANTHROPIC_OMITTED_REASONING_TEXT,
  findActiveAnthropicToolTurnAssistantIndex
};
