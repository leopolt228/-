// packages/ai/src/providers/openai-responses-tool-call-tracker.ts
function readIdentityValue(value) {
  const identity = typeof value === "string" ? value.trim() : "";
  return identity || void 0;
}
function readOutputIndex(event) {
  return typeof event.output_index === "number" && Number.isInteger(event.output_index) && event.output_index >= 0 ? event.output_index : void 0;
}
function readEventIdentity(event) {
  return { itemId: readIdentityValue(event.item_id) };
}
function readResponsesToolCallItemIdentity(item) {
  return {
    itemId: readIdentityValue(item.id),
    callId: readIdentityValue(item.call_id)
  };
}
function createResponsesToolCallTracker() {
  const indexedCalls = /* @__PURE__ */ new Map();
  const unindexedCalls = /* @__PURE__ */ new Set();
  const identitiesConflict = (state, identity) => Boolean(
    state.itemId && identity.itemId && state.itemId !== identity.itemId || state.callId && identity.callId && state.callId !== identity.callId
  );
  const sharesIdentity = (state, identity) => Boolean(
    state.itemId && identity.itemId && state.itemId === identity.itemId || state.callId && identity.callId && state.callId === identity.callId
  );
  const adoptIdentity = (state, identity) => {
    state.itemId ??= identity.itemId;
    state.callId ??= identity.callId;
    return state;
  };
  const resolveCompatible = (candidates, identity) => {
    const uniqueCandidates = [...new Set(candidates)];
    if (!identity.itemId && !identity.callId) {
      return uniqueCandidates.length === 1 ? uniqueCandidates.at(0) : void 0;
    }
    const compatible = uniqueCandidates.filter((state) => !identitiesConflict(state, identity));
    const matches = compatible.filter((state) => sharesIdentity(state, identity));
    const matched = matches.length === 1 ? matches.at(0) : void 0;
    if (matched) {
      return adoptIdentity(matched, identity);
    }
    const soleCompatible = uniqueCandidates.length === 1 && compatible.length === 1 && matches.length === 0 ? compatible.at(0) : void 0;
    return soleCompatible ? adoptIdentity(soleCompatible, identity) : void 0;
  };
  return {
    register(event, state) {
      const outputIndex = readOutputIndex(event);
      if (outputIndex === void 0) {
        unindexedCalls.add(state);
        return;
      }
      if (indexedCalls.has(outputIndex)) {
        throw new Error(`Responses stream reused active tool-call output index ${outputIndex}`);
      }
      indexedCalls.set(outputIndex, state);
    },
    resolve(event, identity = readEventIdentity(event)) {
      const outputIndex = readOutputIndex(event);
      if (outputIndex !== void 0) {
        const indexed = indexedCalls.get(outputIndex);
        if (indexed) {
          if (indexed.callId && identity.callId && indexed.callId !== identity.callId) {
            return void 0;
          }
          return adoptIdentity(indexed, identity);
        }
        const unindexed = resolveCompatible(unindexedCalls, identity);
        if (unindexed) {
          unindexedCalls.delete(unindexed);
          indexedCalls.set(outputIndex, unindexed);
        }
        return unindexed;
      }
      return resolveCompatible([...indexedCalls.values(), ...unindexedCalls], identity);
    },
    forget(toolCall) {
      for (const [outputIndex, tracked] of indexedCalls) {
        if (tracked === toolCall) {
          indexedCalls.delete(outputIndex);
        }
      }
      unindexedCalls.delete(toolCall);
    },
    markArgumentsUnreliable() {
      for (const toolCall of /* @__PURE__ */ new Set([...indexedCalls.values(), ...unindexedCalls])) {
        toolCall.argumentStreamReliable = false;
      }
    },
    hasActive() {
      return indexedCalls.size > 0 || unindexedCalls.size > 0;
    }
  };
}
export {
  createResponsesToolCallTracker,
  readResponsesToolCallItemIdentity
};
