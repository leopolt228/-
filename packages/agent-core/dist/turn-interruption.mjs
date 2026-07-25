// packages/agent-core/src/turn-interruption.ts
function createFailureMessage(model, error, aborted) {
  return {
    role: "assistant",
    content: [{ type: "text", text: "" }],
    api: model.api,
    provider: model.provider,
    model: model.id,
    stopReason: aborted ? "aborted" : "error",
    errorMessage: error instanceof Error ? error.message : String(error),
    timestamp: Date.now(),
    usage: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 0,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
    }
  };
}
var INTERRUPTED_TURN_GUIDANCE = `<turn_aborted>
The previous turn was interrupted. Any running background processes may still be active. If any tools or commands were aborted, they may have partially executed.
</turn_aborted>`;
function isTurnHandoffAbort(signal) {
  if (!signal?.aborted) {
    return false;
  }
  const reason = signal.reason;
  return typeof reason === "object" && reason !== null && reason.turnHandoff === true;
}
function createInterruptedTurnMessage() {
  return {
    role: "custom",
    customType: "openclaw:turn-aborted",
    content: INTERRUPTED_TURN_GUIDANCE,
    display: false,
    timestamp: Date.now()
  };
}
async function appendInterruptedTurnMessage(messages, emit) {
  const interruption = createInterruptedTurnMessage();
  messages.push(interruption);
  await emit({ type: "message_start", message: interruption });
  await emit({ type: "message_end", message: interruption });
}
function normalizeCoreContextMessages(messages) {
  return messages.map((message) => {
    if (message.role !== "custom" || message.customType !== "openclaw:turn-aborted") {
      return message;
    }
    return {
      role: "user",
      content: typeof message.content === "string" ? [{ type: "text", text: message.content }] : message.content,
      timestamp: message.timestamp
    };
  });
}
export {
  appendInterruptedTurnMessage,
  createFailureMessage,
  createInterruptedTurnMessage,
  isTurnHandoffAbort,
  normalizeCoreContextMessages
};
