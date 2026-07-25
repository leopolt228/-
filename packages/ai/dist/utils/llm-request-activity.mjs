// packages/ai/src/utils/llm-request-activity.ts
var requestActivityListeners = /* @__PURE__ */ new WeakMap();
function notifyLlmRequestActivity(signal) {
  if (!signal) {
    return;
  }
  for (const listener of requestActivityListeners.get(signal) ?? []) {
    listener();
  }
}
function onLlmRequestActivity(signal, listener) {
  const listeners = requestActivityListeners.get(signal) ?? /* @__PURE__ */ new Set();
  listeners.add(listener);
  requestActivityListeners.set(signal, listeners);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      requestActivityListeners.delete(signal);
    }
  };
}
export {
  notifyLlmRequestActivity,
  onLlmRequestActivity
};
