var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// packages/normalization-core/src/boolean-coercion.ts
var init_boolean_coercion = __esm({
  "packages/normalization-core/src/boolean-coercion.ts"() {
    "use strict";
  }
});

// packages/normalization-core/src/error-coercion.ts
function readProperty(value, key) {
  try {
    return value[key];
  } catch {
    return void 0;
  }
}
function formatStatusAndCode(value) {
  if ((typeof value !== "object" || value === null) && typeof value !== "function") {
    return void 0;
  }
  try {
    if (Object.keys(value).some((key) => key !== "status" && key !== "code")) {
      return void 0;
    }
  } catch {
  }
  const statusValue = readProperty(value, "status");
  const codeValue = readProperty(value, "code");
  if (statusValue === void 0 && codeValue === void 0) {
    return void 0;
  }
  const statusText = typeof statusValue === "string" || typeof statusValue === "number" ? String(statusValue) : "unknown";
  const codeText = typeof codeValue === "string" || typeof codeValue === "number" ? String(codeValue) : "unknown";
  return `status=${statusText} code=${codeText}`;
}
function stringifyUnknown(value) {
  if (value === null) {
    return "null";
  }
  if (value === void 0) {
    return "undefined";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") {
    return String(value);
  }
  try {
    const json = JSON.stringify(value);
    if (json !== void 0) {
      return json;
    }
  } catch {
  }
  try {
    return Object.prototype.toString.call(value);
  } catch {
    return "Unknown error";
  }
}
function formatErrorMessage(value, options) {
  let formatted;
  if (value instanceof Error) {
    formatted = value.message || value.name || "Error";
    let cause = readProperty(value, "cause");
    const seen = /* @__PURE__ */ new Set([value]);
    const seenMessages = /* @__PURE__ */ new Set([formatted]);
    const appendCauseMessage = (message) => {
      if (!message || seenMessages.has(message)) {
        return;
      }
      formatted += ` | ${message}`;
      seenMessages.add(message);
    };
    while (cause && !seen.has(cause)) {
      seen.add(cause);
      if (cause instanceof Error) {
        appendCauseMessage(cause.message);
        const code = readProperty(cause, "code");
        if (typeof code === "string" || typeof code === "number") {
          appendCauseMessage(String(code));
        }
        cause = readProperty(cause, "cause");
      } else if (typeof cause === "string") {
        appendCauseMessage(cause);
        break;
      } else {
        appendCauseMessage(formatStatusAndCode(cause));
        break;
      }
    }
  } else {
    formatted = formatStatusAndCode(value) ?? stringifyUnknown(value);
  }
  return options.redact(formatted);
}
function toErrorObject(value, fallbackMessage) {
  if (value instanceof Error) {
    return value;
  }
  if (typeof value === "string") {
    return new Error(value);
  }
  const error = new Error(fallbackMessage, { cause: value });
  if (typeof value === "object" && value !== null || typeof value === "function") {
    Object.assign(error, value);
  }
  return error;
}
var init_error_coercion = __esm({
  "packages/normalization-core/src/error-coercion.ts"() {
    "use strict";
  }
});

// packages/normalization-core/src/expect.ts
function expectDefined(value, context) {
  if (value === null || value === void 0) {
    throw new Error("expected " + context + " to be defined");
  }
  return value;
}
var init_expect = __esm({
  "packages/normalization-core/src/expect.ts"() {
    "use strict";
  }
});

// packages/normalization-core/src/format.ts
var init_format = __esm({
  "packages/normalization-core/src/format.ts"() {
    "use strict";
    init_expect();
  }
});

// packages/normalization-core/src/json-coercion.ts
var init_json_coercion = __esm({
  "packages/normalization-core/src/json-coercion.ts"() {
    "use strict";
  }
});

// packages/normalization-core/src/number-coercion.ts
function normalizeNumericString(value) {
  const trimmed = value.trim();
  return trimmed ? trimmed : void 0;
}
function parseStrictInteger(value) {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) ? value : void 0;
  }
  if (typeof value !== "string") {
    return void 0;
  }
  const normalized = normalizeNumericString(value);
  if (!normalized || !/^[+-]?\d+$/.test(normalized)) {
    return void 0;
  }
  const parsed = Number(normalized);
  return Number.isSafeInteger(parsed) ? parsed : void 0;
}
function resolveIntegerOption(value, fallback, range = {}) {
  const candidate = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  const floored = Math.floor(candidate);
  const minBounded = range.min === void 0 ? floored : Math.max(range.min, floored);
  return range.max === void 0 ? minBounded : Math.min(range.max, minBounded);
}
function resolveNonNegativeIntegerOption(value, fallback) {
  return resolveIntegerOption(value, fallback, { min: 0 });
}
function parseStrictNonNegativeInteger(value) {
  const parsed = parseStrictInteger(value);
  return parsed !== void 0 && parsed >= 0 ? parsed : void 0;
}
var MAX_TIMER_TIMEOUT_MS, MAX_TIMER_TIMEOUT_SECONDS;
var init_number_coercion = __esm({
  "packages/normalization-core/src/number-coercion.ts"() {
    "use strict";
    MAX_TIMER_TIMEOUT_MS = 2147e6;
    MAX_TIMER_TIMEOUT_SECONDS = Math.floor(MAX_TIMER_TIMEOUT_MS / 1e3);
  }
});

// packages/normalization-core/src/record-coerce.ts
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
var init_record_coerce = __esm({
  "packages/normalization-core/src/record-coerce.ts"() {
    "use strict";
  }
});

// packages/normalization-core/src/string-coerce.ts
function normalizeNullableString(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
function normalizeOptionalString(value) {
  return normalizeNullableString(value) ?? void 0;
}
function normalizeOptionalLowercaseString(value) {
  return normalizeOptionalString(value)?.toLowerCase();
}
function normalizeLowercaseStringOrEmpty(value) {
  return normalizeOptionalLowercaseString(value) ?? "";
}
var init_string_coerce = __esm({
  "packages/normalization-core/src/string-coerce.ts"() {
    "use strict";
  }
});

// packages/normalization-core/src/string-normalization.ts
function normalizeStringEntries(list) {
  return (list ?? []).map((entry) => normalizeOptionalString(String(entry)) ?? "").filter(Boolean);
}
function uniqueValues(values) {
  return [...new Set(values)];
}
function uniqueStrings(values) {
  return uniqueValues(values);
}
function normalizeUniqueStringEntries(values) {
  return uniqueStrings(normalizeStringEntries(values ? [...values] : void 0));
}
var init_string_normalization = __esm({
  "packages/normalization-core/src/string-normalization.ts"() {
    "use strict";
    init_string_coerce();
  }
});

// packages/normalization-core/src/text-decoding.ts
function decodeTextPrefix(bytes, options = {}) {
  const decoder = new TextDecoder(options.encoding);
  return decoder.decode(bytes, options.truncated ? { stream: true } : void 0);
}
var init_text_decoding = __esm({
  "packages/normalization-core/src/text-decoding.ts"() {
    "use strict";
  }
});

// packages/normalization-core/src/utf16-slice.ts
function isHighSurrogate(codeUnit) {
  return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
  return codeUnit >= 56320 && codeUnit <= 57343;
}
function sliceUtf16Safe(input, start, end) {
  const len = input.length;
  let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
  let to = end === void 0 ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
  if (to <= from) {
    return "";
  }
  if (from > 0 && from < len) {
    const codeUnit = input.charCodeAt(from);
    if (isLowSurrogate(codeUnit) && isHighSurrogate(input.charCodeAt(from - 1))) {
      from += 1;
    }
  }
  if (to > 0 && to < len) {
    const codeUnit = input.charCodeAt(to - 1);
    if (isHighSurrogate(codeUnit) && isLowSurrogate(input.charCodeAt(to))) {
      to -= 1;
    }
  }
  return input.slice(from, to);
}
function truncateUtf16Safe(input, maxLen) {
  const limit = Math.max(0, Math.floor(maxLen));
  if (input.length <= limit) {
    return input;
  }
  return sliceUtf16Safe(input, 0, limit);
}
var init_utf16_slice = __esm({
  "packages/normalization-core/src/utf16-slice.ts"() {
    "use strict";
  }
});

// packages/normalization-core/src/index.ts
var init_src = __esm({
  "packages/normalization-core/src/index.ts"() {
    "use strict";
    init_boolean_coercion();
    init_error_coercion();
    init_expect();
    init_format();
    init_json_coercion();
    init_number_coercion();
    init_record_coerce();
    init_string_coerce();
    init_string_normalization();
    init_text_decoding();
    init_utf16_slice();
  }
});

// src/global-state.ts
function isVerbose() {
  return globalVerbose;
}
var globalVerbose;
var init_global_state = __esm({
  "src/global-state.ts"() {
    "use strict";
    globalVerbose = false;
  }
});

// src/infra/diagnostic-event-listener-presence.ts
var init_diagnostic_event_listener_presence = __esm({
  "src/infra/diagnostic-event-listener-presence.ts"() {
    "use strict";
  }
});

// src/infra/diagnostic-trace-context.ts
import { AsyncLocalStorage } from "node:async_hooks";
function isNonZeroHex(value) {
  return !/^0+$/.test(value);
}
function createDiagnosticTraceScopeState() {
  return {
    marker: DIAGNOSTIC_TRACE_SCOPE_STATE_KEY,
    storage: new AsyncLocalStorage()
  };
}
function isDiagnosticTraceScopeState(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  return candidate.marker === DIAGNOSTIC_TRACE_SCOPE_STATE_KEY && candidate.storage instanceof AsyncLocalStorage;
}
function getDiagnosticTraceScopeState() {
  const globalRecord = globalThis;
  const existing = globalRecord[DIAGNOSTIC_TRACE_SCOPE_STATE_KEY];
  if (isDiagnosticTraceScopeState(existing)) {
    return existing;
  }
  const state = createDiagnosticTraceScopeState();
  Object.defineProperty(globalThis, DIAGNOSTIC_TRACE_SCOPE_STATE_KEY, {
    configurable: true,
    enumerable: false,
    value: state,
    writable: false
  });
  return state;
}
function isValidDiagnosticTraceId(value) {
  return typeof value === "string" && TRACE_ID_RE.test(value) && isNonZeroHex(value);
}
function isValidDiagnosticSpanId(value) {
  return typeof value === "string" && SPAN_ID_RE.test(value) && isNonZeroHex(value);
}
function isValidDiagnosticTraceFlags(value) {
  return typeof value === "string" && TRACE_FLAGS_RE.test(value);
}
function getActiveDiagnosticTraceContext() {
  return getDiagnosticTraceScopeState().storage.getStore();
}
var TRACE_ID_RE, SPAN_ID_RE, TRACE_FLAGS_RE, DIAGNOSTIC_TRACE_SCOPE_STATE_KEY;
var init_diagnostic_trace_context = __esm({
  "src/infra/diagnostic-trace-context.ts"() {
    "use strict";
    init_src();
    TRACE_ID_RE = /^[0-9a-f]{32}$/;
    SPAN_ID_RE = /^[0-9a-f]{16}$/;
    TRACE_FLAGS_RE = /^[0-9a-f]{2}$/;
    DIAGNOSTIC_TRACE_SCOPE_STATE_KEY = /* @__PURE__ */ Symbol.for("openclaw.diagnosticTraceScope.state.v1");
  }
});

// src/infra/prototype-keys.ts
function isBlockedObjectKey(key) {
  return BLOCKED_OBJECT_KEYS.has(key);
}
var BLOCKED_OBJECT_KEYS;
var init_prototype_keys = __esm({
  "src/infra/prototype-keys.ts"() {
    "use strict";
    BLOCKED_OBJECT_KEYS = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
  }
});

// src/infra/diagnostic-events.ts
function createDiagnosticEventsState() {
  return {
    marker: DIAGNOSTIC_EVENTS_STATE_KEY,
    enabled: true,
    seq: 0,
    listeners: /* @__PURE__ */ new Set(),
    trustedListeners: /* @__PURE__ */ new Set(),
    toolExecutionListeners: /* @__PURE__ */ new Set(),
    toolExecutionSeq: 0,
    dispatchDepth: 0,
    asyncQueue: [],
    asyncDrainScheduled: false,
    asyncDroppedEvents: 0,
    asyncDroppedTrustedEvents: 0,
    asyncDroppedUntrustedEvents: 0,
    asyncDroppedPriorityEvents: 0
  };
}
function isDiagnosticEventsState(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  return candidate.marker === DIAGNOSTIC_EVENTS_STATE_KEY && typeof candidate.enabled === "boolean" && typeof candidate.seq === "number" && candidate.listeners instanceof Set && (candidate.trustedListeners === void 0 || candidate.trustedListeners instanceof Set) && (candidate.toolExecutionListeners === void 0 || candidate.toolExecutionListeners instanceof Set) && typeof candidate.dispatchDepth === "number" && Array.isArray(candidate.asyncQueue) && typeof candidate.asyncDrainScheduled === "boolean";
}
function getDiagnosticEventsState() {
  const globalRecord = globalThis;
  const existing = globalRecord[DIAGNOSTIC_EVENTS_STATE_KEY];
  if (isDiagnosticEventsState(existing)) {
    existing.asyncDroppedEvents ??= 0;
    existing.asyncDroppedTrustedEvents ??= 0;
    existing.asyncDroppedUntrustedEvents ??= 0;
    existing.asyncDroppedPriorityEvents ??= 0;
    existing.trustedListeners ??= /* @__PURE__ */ new Set();
    existing.toolExecutionListeners ??= /* @__PURE__ */ new Set();
    existing.toolExecutionSeq ??= 0;
    return existing;
  }
  const state = createDiagnosticEventsState();
  Object.defineProperty(globalThis, DIAGNOSTIC_EVENTS_STATE_KEY, {
    configurable: true,
    enumerable: false,
    value: state,
    writable: false
  });
  return state;
}
function dispatchDiagnosticEvent(state, enriched, metadata, privateData, options = {}) {
  if (state.dispatchDepth > 100) {
    console.error(
      `[diagnostic-events] recursion guard tripped at depth=${state.dispatchDepth}, dropping type=${enriched.type}`
    );
    return;
  }
  state.dispatchDepth += 1;
  try {
    if (!options.trustedListenersOnly) {
      for (const listener of state.listeners) {
        try {
          listener(
            cloneDiagnosticEventForListener(enriched),
            createDiagnosticMetadataForListener(metadata)
          );
        } catch (err) {
          const errorMessage = err instanceof Error ? err.stack ?? err.message : typeof err === "string" ? err : String(err);
          console.error(
            `[diagnostic-events] listener error type=${enriched.type} seq=${enriched.seq}: ${errorMessage}`
          );
        }
      }
    }
    for (const listener of state.trustedListeners) {
      try {
        listener(
          cloneDiagnosticEventForListener(enriched),
          createDiagnosticMetadataForListener(metadata),
          cloneDiagnosticPrivateDataForListener(privateData)
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.stack ?? err.message : typeof err === "string" ? err : String(err);
        console.error(
          `[diagnostic-events] trusted listener error type=${enriched.type} seq=${enriched.seq}: ${errorMessage}`
        );
      }
    }
  } finally {
    state.dispatchDepth -= 1;
  }
}
function createDiagnosticMetadataForListener(metadata) {
  const listenerMetadata = Object.freeze({ ...metadata });
  if (listenerMetadata.trusted) {
    dispatchedTrustedDiagnosticMetadata.add(listenerMetadata);
  }
  return listenerMetadata;
}
function cloneDiagnosticEventForListener(event) {
  return deepFreezeDiagnosticValue(structuredClone(event));
}
function cloneDiagnosticPrivateDataForListener(privateData) {
  if (!privateData) {
    return Object.freeze({});
  }
  return deepFreezeDiagnosticValue(structuredClone(privateData));
}
function isPriorityAsyncDiagnosticEvent(entry) {
  return entry.metadata.trusted && PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES.has(entry.event.type);
}
function noteAsyncDiagnosticDrop(state, entry) {
  state.asyncDroppedEvents += 1;
  if (entry.metadata.trusted) {
    state.asyncDroppedTrustedEvents += 1;
  } else {
    state.asyncDroppedUntrustedEvents += 1;
  }
  if (isPriorityAsyncDiagnosticEvent(entry)) {
    state.asyncDroppedPriorityEvents += 1;
  }
}
function makeRoomForPriorityAsyncDiagnosticEvent(state) {
  const nonPriorityIndex = state.asyncQueue.findIndex(
    (entry) => !isPriorityAsyncDiagnosticEvent(entry)
  );
  if (nonPriorityIndex >= 0) {
    return state.asyncQueue.splice(nonPriorityIndex, 1)[0];
  }
  return state.asyncQueue.shift();
}
function deepFreezeDiagnosticValue(value, seen = /* @__PURE__ */ new WeakSet()) {
  if (!value || typeof value !== "object") {
    return value;
  }
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (Array.isArray(value)) {
    for (const item of value) {
      deepFreezeDiagnosticValue(item, seen);
    }
    return Object.freeze(value);
  }
  for (const nested of Object.values(value)) {
    deepFreezeDiagnosticValue(nested, seen);
  }
  return Object.freeze(value);
}
function scheduleAsyncDiagnosticDrain(state) {
  if (state.asyncDrainScheduled) {
    return;
  }
  state.asyncDrainScheduled = true;
  setImmediate(() => {
    state.asyncDrainScheduled = false;
    const batch = state.asyncQueue.splice(0, MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN);
    for (const entry of batch) {
      dispatchDiagnosticEvent(state, entry.event, entry.metadata, entry.privateData, {
        trustedListenersOnly: entry.trustedListenersOnly
      });
    }
    if (state.asyncQueue.length > 0) {
      scheduleAsyncDiagnosticDrain(state);
      return;
    }
    dispatchAsyncDiagnosticDropSummary(state);
  });
}
function dispatchAsyncDiagnosticDropSummary(state) {
  if (state.asyncDroppedEvents <= 0) {
    return;
  }
  const droppedEvents = state.asyncDroppedEvents;
  const droppedTrustedEvents = state.asyncDroppedTrustedEvents;
  const droppedUntrustedEvents = state.asyncDroppedUntrustedEvents;
  const droppedPriorityEvents = state.asyncDroppedPriorityEvents;
  state.asyncDroppedEvents = 0;
  state.asyncDroppedTrustedEvents = 0;
  state.asyncDroppedUntrustedEvents = 0;
  state.asyncDroppedPriorityEvents = 0;
  const event = enrichDiagnosticEvent(state, {
    type: "diagnostic.async_queue.dropped",
    droppedEvents,
    ...droppedTrustedEvents > 0 ? { droppedTrustedEvents } : {},
    ...droppedUntrustedEvents > 0 ? { droppedUntrustedEvents } : {},
    ...droppedPriorityEvents > 0 ? { droppedPriorityEvents } : {},
    queueLength: state.asyncQueue.length,
    maxQueueLength: MAX_ASYNC_DIAGNOSTIC_EVENTS,
    drainBatchSize: MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN
  });
  dispatchDiagnosticEvent(state, event, createInternalDiagnosticMetadata(false));
}
function enrichDiagnosticEvent(state, event) {
  const enriched = {};
  for (const [key, value] of Object.entries(event)) {
    if (isBlockedObjectKey(key)) {
      continue;
    }
    enriched[key] = value;
  }
  enriched.trace ??= getActiveDiagnosticTraceContext();
  state.seq += 1;
  enriched.seq = state.seq;
  enriched.ts = Date.now();
  return enriched;
}
function createInternalDiagnosticMetadata(trusted) {
  return { internal: true, trusted };
}
function emitDiagnosticEventWithTrust(event, trusted, options = {}) {
  const state = getDiagnosticEventsState();
  if (trusted && isToolExecutionEventInput(event)) {
    dispatchTrustedToolExecutionEvent(state, event);
  }
  if (!state.enabled) {
    return;
  }
  if (event.type === "security.event" && options.allowSecurityEvent !== true) {
    return;
  }
  const enriched = enrichDiagnosticEvent(state, event);
  const { internal = false, privateData } = options;
  const trustedTraceContext = options.trustedTraceContext === true;
  const metadata = {
    ...internal ? createInternalDiagnosticMetadata(trusted) : { trusted },
    ...trustedTraceContext ? { trustedTraceContext } : {}
  };
  if (ASYNC_DIAGNOSTIC_EVENT_TYPES.has(enriched.type)) {
    if (state.asyncQueue.length >= MAX_ASYNC_DIAGNOSTIC_EVENTS) {
      if (!trusted || !PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES.has(enriched.type)) {
        noteAsyncDiagnosticDrop(state, { event: enriched, metadata, privateData });
        return;
      }
      const droppedEntry = makeRoomForPriorityAsyncDiagnosticEvent(state);
      if (droppedEntry) {
        noteAsyncDiagnosticDrop(state, droppedEntry);
      }
    }
    state.asyncQueue.push({ event: enriched, metadata, privateData });
    scheduleAsyncDiagnosticDrain(state);
    return;
  }
  dispatchDiagnosticEvent(state, enriched, metadata, privateData);
}
function isToolExecutionEventInput(event) {
  return event.type === "tool.execution.started" || event.type === "tool.execution.completed" || event.type === "tool.execution.error" || event.type === "tool.execution.blocked";
}
function dispatchTrustedToolExecutionEvent(state, event) {
  state.toolExecutionSeq += 1;
  let enriched;
  try {
    enriched = deepFreezeDiagnosticValue(
      structuredClone({ ...event, seq: state.toolExecutionSeq, ts: Date.now() })
    );
  } catch (error) {
    console.error(
      `[diagnostic-events] tool execution clone error type=${event.type}: ${String(error)}`
    );
    return;
  }
  for (const listener of state.toolExecutionListeners) {
    try {
      listener(enriched);
    } catch (error) {
      console.error(
        `[diagnostic-events] tool execution listener error type=${enriched.type} seq=${enriched.seq}: ${String(error)}`
      );
    }
  }
}
function emitDiagnosticEvent(event) {
  emitDiagnosticEventWithTrust(event, false);
}
function emitDiagnosticEventWithTrustedTraceContext(event) {
  emitDiagnosticEventWithTrust(event, false, { trustedTraceContext: true });
}
var MAX_ASYNC_DIAGNOSTIC_EVENTS, MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN, DIAGNOSTIC_EVENTS_STATE_KEY, dispatchedTrustedDiagnosticMetadata, ASYNC_DIAGNOSTIC_EVENT_TYPES, PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES;
var init_diagnostic_events = __esm({
  "src/infra/diagnostic-events.ts"() {
    "use strict";
    init_diagnostic_event_listener_presence();
    init_diagnostic_trace_context();
    init_prototype_keys();
    MAX_ASYNC_DIAGNOSTIC_EVENTS = 1e4;
    MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN = 100;
    DIAGNOSTIC_EVENTS_STATE_KEY = /* @__PURE__ */ Symbol.for("openclaw.diagnosticEvents.state.v1");
    dispatchedTrustedDiagnosticMetadata = /* @__PURE__ */ new WeakSet();
    ASYNC_DIAGNOSTIC_EVENT_TYPES = /* @__PURE__ */ new Set([
      "tool.execution.started",
      "tool.execution.completed",
      "tool.execution.error",
      "tool.execution.blocked",
      "skill.used",
      "exec.process.completed",
      "exec.approval.followup_suppressed",
      "message.delivery.started",
      "message.delivery.completed",
      "message.delivery.error",
      "talk.event",
      "model.call.started",
      "model.call.completed",
      "model.call.error",
      "run.progress",
      "run.execution_phase",
      "harness.run.completed",
      "harness.run.error",
      "context.assembled",
      "log.record"
    ]);
    PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES = /* @__PURE__ */ new Set([
      "tool.execution.completed",
      "tool.execution.error",
      "tool.execution.blocked"
    ]);
  }
});

// src/infra/safe-cwd.ts
function tryProcessCwd() {
  try {
    return process.cwd();
  } catch {
    return void 0;
  }
}
var init_safe_cwd = __esm({
  "src/infra/safe-cwd.ts"() {
    "use strict";
  }
});

// src/infra/home-dir.ts
import os from "node:os";
import path from "node:path";
function normalize(value) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") {
    return void 0;
  }
  return trimmed;
}
function normalizeSafe(homedir) {
  try {
    return normalize(homedir());
  } catch {
    return void 0;
  }
}
function resolveTermuxHome(env) {
  const prefix = normalize(env.PREFIX);
  if (!prefix || !normalize(env.ANDROID_DATA)) {
    return void 0;
  }
  if (!/(?:^|\/)com\.termux\/files\/usr\/?$/u.test(prefix.replace(/\\/gu, "/"))) {
    return void 0;
  }
  return path.resolve(prefix, "..", "home");
}
function resolveRawOsHomeDir(env, homedir) {
  return normalize(env.HOME) ?? normalize(env.USERPROFILE) ?? resolveTermuxHome(env) ?? normalizeSafe(homedir);
}
function resolveRawHomeDir(env, homedir) {
  const explicitHome = normalize(env.OPENCLAW_HOME);
  if (!explicitHome) {
    return resolveRawOsHomeDir(env, homedir);
  }
  if (explicitHome === "~" || explicitHome.startsWith("~/") || explicitHome.startsWith("~\\")) {
    const fallbackHome = resolveRawOsHomeDir(env, homedir);
    return fallbackHome ? explicitHome.replace(/^~(?=$|[\\/])/, fallbackHome) : void 0;
  }
  return explicitHome;
}
function resolveEffectiveHomeDir(env = process.env, homedir = os.homedir) {
  const raw = resolveRawHomeDir(env, homedir);
  return raw ? path.resolve(raw) : void 0;
}
function resolveRequiredHomeDir(env = process.env, homedir = os.homedir) {
  const resolved = resolveEffectiveHomeDir(env, homedir) ?? tryProcessCwd();
  if (resolved) {
    return path.resolve(resolved);
  }
  throw new Error(
    "Unable to resolve an OpenClaw home: set OPENCLAW_HOME, HOME, or USERPROFILE, or run from an existing directory."
  );
}
function expandHomePrefix(input, opts) {
  if (!input.startsWith("~")) {
    return input;
  }
  const home = normalize(opts?.home) ?? resolveEffectiveHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir);
  if (!home) {
    return input;
  }
  return input.replace(/^~(?=$|[\\/])/, home);
}
function resolveHomeRelativePath(input, opts) {
  const trimmed = input.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed.startsWith("~")) {
    const expanded = expandHomePrefix(trimmed, {
      home: resolveRequiredHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir),
      env: opts?.env,
      homedir: opts?.homedir
    });
    return path.resolve(expanded);
  }
  return path.resolve(trimmed);
}
var init_home_dir = __esm({
  "src/infra/home-dir.ts"() {
    "use strict";
    init_safe_cwd();
  }
});

// src/infra/fs-safe-defaults.ts
import { configureFsSafePython } from "@openclaw/fs-safe/config";
var hasPythonModeOverride;
var init_fs_safe_defaults = __esm({
  "src/infra/fs-safe-defaults.ts"() {
    "use strict";
    hasPythonModeOverride = process.env.FS_SAFE_PYTHON_MODE != null || process.env.OPENCLAW_FS_SAFE_PYTHON_MODE != null;
    if (!hasPythonModeOverride) {
      configureFsSafePython({ mode: "off" });
    }
  }
});

// src/infra/regular-file.ts
import {
  appendRegularFileSync,
  readRegularFile,
  readRegularFileSync
} from "@openclaw/fs-safe/advanced";
var init_regular_file = __esm({
  "src/infra/regular-file.ts"() {
    "use strict";
    init_fs_safe_defaults();
  }
});

// src/infra/tmp-openclaw-dir.ts
import fs from "node:fs";
import { tmpdir as getOsTmpDir } from "node:os";
import path2 from "node:path";
function isNodeErrorWithCode(err, code) {
  return typeof err === "object" && err !== null && "code" in err && err.code === code;
}
function resolvePreferredOpenClawTmpDir(options = {}) {
  const accessMode = fs.constants.W_OK | fs.constants.X_OK;
  const accessSync = options.accessSync ?? fs.accessSync;
  const chmodSync2 = options.chmodSync ?? fs.chmodSync;
  const lstatSync = options.lstatSync ?? fs.lstatSync;
  const mkdirSync3 = options.mkdirSync ?? fs.mkdirSync;
  const warn2 = options.warn ?? ((message) => console.warn(message));
  const getuid = options.getuid ?? (() => {
    try {
      return typeof process.getuid === "function" ? process.getuid() : void 0;
    } catch {
      return void 0;
    }
  });
  const tmpdir = typeof options.tmpdir === "function" ? options.tmpdir : getOsTmpDir;
  const platform = options.platform ?? process.platform;
  const uid = getuid();
  const isSecureDirForUser = (st) => {
    if (uid === void 0) {
      return true;
    }
    if (typeof st.uid === "number" && st.uid !== uid) {
      return false;
    }
    return typeof st.mode !== "number" || (st.mode & 18) === 0;
  };
  const fallback = () => {
    const suffix = uid === void 0 ? "openclaw" : `openclaw-${uid}`;
    const joiner = platform === "win32" ? path2.win32.join : path2.join;
    return joiner(tmpdir(), suffix);
  };
  const isTrustedTmpDir = (st) => st.isDirectory() && !st.isSymbolicLink() && isSecureDirForUser(st);
  const resolveDirState = (candidatePath) => {
    try {
      const candidate = lstatSync(candidatePath);
      if (!isTrustedTmpDir(candidate)) {
        return "invalid";
      }
      accessSync(candidatePath, accessMode);
      return "available";
    } catch (err) {
      return isNodeErrorWithCode(err, "ENOENT") ? "missing" : "invalid";
    }
  };
  const tryRepairWritableBits = (candidatePath) => {
    try {
      const st = lstatSync(candidatePath);
      if (!st.isDirectory() || st.isSymbolicLink()) {
        return false;
      }
      if (uid !== void 0 && typeof st.uid === "number" && st.uid !== uid) {
        return false;
      }
      if (typeof st.mode !== "number") {
        return false;
      }
      if ((st.mode & 18) === 0) {
        return resolveDirState(candidatePath) === "available";
      }
      try {
        chmodSync2(candidatePath, 448);
      } catch (chmodErr) {
        if (isNodeErrorWithCode(chmodErr, "EPERM") || isNodeErrorWithCode(chmodErr, "EACCES") || isNodeErrorWithCode(chmodErr, "ENOENT")) {
          return resolveDirState(candidatePath) === "available";
        }
        throw chmodErr;
      }
      warn2(`[openclaw] tightened permissions on temp dir: ${candidatePath}`);
      return resolveDirState(candidatePath) === "available";
    } catch {
      return false;
    }
  };
  const ensureTrustedFallbackDir = () => {
    const fallbackPath = fallback();
    const state = resolveDirState(fallbackPath);
    if (state === "available") {
      return fallbackPath;
    }
    if (state === "invalid") {
      if (tryRepairWritableBits(fallbackPath)) {
        return fallbackPath;
      }
      throw new Error(`Unsafe fallback OpenClaw temp dir: ${fallbackPath}`);
    }
    try {
      mkdirSync3(fallbackPath, { recursive: true, mode: 448 });
      chmodSync2(fallbackPath, 448);
    } catch {
      throw new Error(`Unable to create fallback OpenClaw temp dir: ${fallbackPath}`);
    }
    if (resolveDirState(fallbackPath) !== "available" && !tryRepairWritableBits(fallbackPath)) {
      throw new Error(`Unsafe fallback OpenClaw temp dir: ${fallbackPath}`);
    }
    return fallbackPath;
  };
  if (platform === "win32") {
    return ensureTrustedFallbackDir();
  }
  const preferredDir = POSIX_OPENCLAW_TMP_DIR;
  const preferredState = resolveDirState(preferredDir);
  if (preferredState === "available") {
    return preferredDir;
  }
  if (preferredState === "invalid") {
    if (tryRepairWritableBits(preferredDir)) {
      return preferredDir;
    }
    return ensureTrustedFallbackDir();
  }
  try {
    accessSync(path2.dirname(preferredDir), accessMode);
    mkdirSync3(preferredDir, { recursive: true, mode: 448 });
    chmodSync2(preferredDir, 448);
    if (resolveDirState(preferredDir) !== "available" && !tryRepairWritableBits(preferredDir)) {
      return ensureTrustedFallbackDir();
    }
    return preferredDir;
  } catch {
    return ensureTrustedFallbackDir();
  }
}
var POSIX_OPENCLAW_TMP_DIR;
var init_tmp_openclaw_dir = __esm({
  "src/infra/tmp-openclaw-dir.ts"() {
    "use strict";
    POSIX_OPENCLAW_TMP_DIR = "/tmp/openclaw";
  }
});

// src/daemon/runtime-binary.ts
var init_runtime_binary = __esm({
  "src/daemon/runtime-binary.ts"() {
    "use strict";
    init_string_coerce();
  }
});

// src/infra/cli-root-options.ts
function isValueToken(arg) {
  if (!arg || arg === FLAG_TERMINATOR) {
    return false;
  }
  if (!arg.startsWith("-")) {
    return true;
  }
  return /^-\d+(?:\.\d+)?$/.test(arg);
}
function consumeRootOptionToken(args, index) {
  const arg = args[index];
  if (!arg) {
    return 0;
  }
  if (ROOT_BOOLEAN_FLAGS.has(arg)) {
    return 1;
  }
  if (arg.startsWith("--profile=") || arg.startsWith("--log-level=") || arg.startsWith("--container=")) {
    return 1;
  }
  if (ROOT_VALUE_FLAGS.has(arg)) {
    return isValueToken(args[index + 1]) ? 2 : 1;
  }
  return 0;
}
var FLAG_TERMINATOR, ROOT_BOOLEAN_FLAGS, ROOT_VALUE_FLAGS;
var init_cli_root_options = __esm({
  "src/infra/cli-root-options.ts"() {
    "use strict";
    FLAG_TERMINATOR = "--";
    ROOT_BOOLEAN_FLAGS = /* @__PURE__ */ new Set(["--dev", "--no-color"]);
    ROOT_VALUE_FLAGS = /* @__PURE__ */ new Set(["--profile", "--log-level", "--container"]);
  }
});

// src/infra/parse-finite-number.ts
var init_parse_finite_number = __esm({
  "src/infra/parse-finite-number.ts"() {
    "use strict";
    init_number_coercion();
  }
});

// packages/terminal-core/src/ansi-sequences.ts
var ANSI_OSC_INTRODUCER_PATTERN, ANSI_STRING_TERMINATOR_PATTERN, ANSI_OSC_PATTERN, ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN, ansiOscAtIndexRegex;
var init_ansi_sequences = __esm({
  "packages/terminal-core/src/ansi-sequences.ts"() {
    "use strict";
    ANSI_OSC_INTRODUCER_PATTERN = "(?:\\x1b\\]|\\x9d)";
    ANSI_STRING_TERMINATOR_PATTERN = "(?:\\x1b\\\\|\\x07|\\x9c)";
    ANSI_OSC_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[^\\x07\\x1b\\x9c]*${ANSI_STRING_TERMINATOR_PATTERN}`;
    ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN = "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
    ansiOscAtIndexRegex = new RegExp(ANSI_OSC_PATTERN, "y");
  }
});

// packages/terminal-core/src/ansi.ts
var ANSI_OSC_SEQUENCE_PATTERN, ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX, graphemeSegmenter, rgiEmojiPattern;
var init_ansi = __esm({
  "packages/terminal-core/src/ansi.ts"() {
    "use strict";
    init_ansi_sequences();
    ANSI_OSC_SEQUENCE_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[\\s\\S]*?${ANSI_STRING_TERMINATOR_PATTERN}`;
    ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX = new RegExp(
      `${ANSI_OSC_SEQUENCE_PATTERN}|${ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN}`,
      "y"
    );
    graphemeSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
    rgiEmojiPattern = new RegExp("^\\p{RGI_Emoji}$", "v");
  }
});

// src/cli/program/command-descriptor-utils.ts
function getCommandDescriptorNames(descriptors) {
  return descriptors.map((descriptor) => descriptor.name);
}
function getCommandsWithSubcommands(descriptors) {
  return descriptors.filter((descriptor) => descriptor.hasSubcommands).map((descriptor) => descriptor.name);
}
function getParentDefaultHelpCommands(descriptors) {
  return descriptors.filter((descriptor) => descriptor.parentDefaultHelp).map((descriptor) => descriptor.name);
}
function defineCommandDescriptorCatalog(descriptors) {
  return {
    descriptors,
    getDescriptors: () => descriptors,
    getNames: () => getCommandDescriptorNames(descriptors),
    getCommandsWithSubcommands: () => getCommandsWithSubcommands(descriptors),
    getParentDefaultHelpCommands: () => getParentDefaultHelpCommands(descriptors)
  };
}
var init_command_descriptor_utils = __esm({
  "src/cli/program/command-descriptor-utils.ts"() {
    "use strict";
    init_ansi();
  }
});

// src/cli/program/core-command-descriptors.ts
var coreCliCommandCatalog, CORE_CLI_COMMAND_DESCRIPTORS;
var init_core_command_descriptors = __esm({
  "src/cli/program/core-command-descriptors.ts"() {
    "use strict";
    init_command_descriptor_utils();
    coreCliCommandCatalog = defineCommandDescriptorCatalog([
      {
        name: "setup",
        description: "Chat with OpenClaw; onboard when setup is incomplete",
        hasSubcommands: false
      },
      {
        name: "crestodian",
        // hidden alias
        description: "Deprecated: use openclaw setup",
        hasSubcommands: false,
        hidden: true
      },
      {
        name: "onboard",
        description: "Guided setup for auth, models, Gateway, workspace, channels, and skills",
        hasSubcommands: true
      },
      {
        name: "configure",
        description: "Interactive configuration for credentials, channels, gateway, and agent defaults",
        hasSubcommands: false
      },
      {
        name: "config",
        description: "Non-interactive config helpers (get/set/patch/unset/file/schema/validate). Run without subcommand for guided setup.",
        hasSubcommands: true
      },
      {
        name: "backup",
        description: "Create and verify backup archives and SQLite snapshots",
        hasSubcommands: true
      },
      {
        name: "migrate",
        description: "Import state from another agent system",
        hasSubcommands: true
      },
      {
        name: "doctor",
        description: "Health checks + quick fixes for the gateway and channels",
        hasSubcommands: false
      },
      {
        name: "dashboard",
        description: "Open the Control UI with your current token",
        hasSubcommands: false
      },
      {
        name: "reset",
        description: "Reset local config/state (keeps the CLI installed)",
        hasSubcommands: false
      },
      {
        name: "uninstall",
        description: "Uninstall the gateway service + local data (CLI remains)",
        hasSubcommands: false
      },
      {
        name: "message",
        description: "Send, read, and manage messages and channel actions",
        hasSubcommands: true
      },
      {
        name: "mcp",
        description: "Manage OpenClaw mcp.servers config and channel bridge",
        hasSubcommands: true,
        parentDefaultHelp: true
      },
      {
        name: "transcripts",
        description: "Inspect stored transcripts",
        hasSubcommands: true
      },
      {
        name: "agent",
        description: "Run an agent turn via the Gateway (use --local for embedded)",
        hasSubcommands: false
      },
      {
        name: "agents",
        description: "Manage isolated agents (workspaces + auth + routing)",
        hasSubcommands: true
      },
      {
        name: "status",
        description: "Show channel health and recent session recipients",
        hasSubcommands: false
      },
      {
        name: "health",
        description: "Fetch health from the running gateway",
        hasSubcommands: false
      },
      {
        name: "audit",
        description: "Inspect metadata-only run, tool, and message lifecycle records",
        hasSubcommands: false
      },
      {
        name: "sessions",
        description: "List stored conversation sessions",
        hasSubcommands: true
      },
      {
        name: "commitments",
        description: "List and manage inferred follow-up commitments",
        hasSubcommands: true
      },
      {
        name: "tasks",
        description: "Inspect durable background tasks and TaskFlow state",
        hasSubcommands: true
      }
    ]);
    CORE_CLI_COMMAND_DESCRIPTORS = coreCliCommandCatalog.descriptors;
  }
});

// src/infra/openclaw-root.fs.runtime.ts
var init_openclaw_root_fs_runtime = __esm({
  "src/infra/openclaw-root.fs.runtime.ts"() {
    "use strict";
  }
});

// src/infra/openclaw-root.ts
var init_openclaw_root = __esm({
  "src/infra/openclaw-root.ts"() {
    "use strict";
    init_openclaw_root_fs_runtime();
  }
});

// src/cli/program/private-qa-cli.ts
import path3 from "node:path";
function isPrivateQaCliEnabled(env = process.env) {
  return env.OPENCLAW_ENABLE_PRIVATE_QA_CLI === "1";
}
var PRIVATE_QA_DIST_RELATIVE_PATH;
var init_private_qa_cli = __esm({
  "src/cli/program/private-qa-cli.ts"() {
    "use strict";
    init_openclaw_root();
    PRIVATE_QA_DIST_RELATIVE_PATH = path3.join("dist", "plugin-sdk", "qa-lab.js");
  }
});

// src/cli/program/subcli-descriptors.ts
function filterPrivateQaItems(items, getName) {
  if (isPrivateQaCliEnabled()) {
    return items;
  }
  return items.filter((item) => getName(item) !== "qa");
}
var subCliCommandCatalog, SUB_CLI_DESCRIPTORS;
var init_subcli_descriptors = __esm({
  "src/cli/program/subcli-descriptors.ts"() {
    "use strict";
    init_command_descriptor_utils();
    init_private_qa_cli();
    subCliCommandCatalog = defineCommandDescriptorCatalog([
      { name: "acp", description: "Run an ACP bridge backed by the Gateway", hasSubcommands: true },
      {
        name: "gateway",
        description: "Run, inspect, and query the WebSocket Gateway",
        hasSubcommands: true
      },
      {
        name: "daemon",
        description: "Manage the Gateway service (launchd/systemd/schtasks)",
        hasSubcommands: true
      },
      { name: "logs", description: "Tail gateway file logs via RPC", hasSubcommands: false },
      {
        name: "system",
        description: "System tools (events, heartbeat, presence)",
        hasSubcommands: true
      },
      {
        name: "models",
        description: "Model discovery, scanning, and configuration",
        hasSubcommands: true
      },
      {
        name: "promos",
        description: "Discover and claim promotional model offers from ClawHub",
        hasSubcommands: true
      },
      {
        name: "infer",
        description: "Run provider-backed inference commands through a stable CLI surface",
        hasSubcommands: true
      },
      {
        name: "capability",
        description: "Run provider capability commands (fallback alias: infer)",
        hasSubcommands: true
      },
      {
        name: "approvals",
        description: "Manage approval policy and pending requests",
        hasSubcommands: true,
        parentDefaultHelp: true
      },
      {
        name: "exec-approvals",
        description: "Manage exec approvals (alias for approvals)",
        hasSubcommands: true
      },
      {
        name: "exec-policy",
        description: "Show or synchronize requested exec policy with host approvals",
        hasSubcommands: true
      },
      {
        name: "nodes",
        description: "Manage gateway-owned nodes (pairing, status, invoke, and media)",
        hasSubcommands: true
      },
      {
        name: "devices",
        description: "Device pairing and auth tokens",
        hasSubcommands: true,
        parentDefaultHelp: true
      },
      {
        name: "users",
        description: "Manage durable user profiles and email aliases",
        hasSubcommands: true,
        parentDefaultHelp: true
      },
      {
        name: "node",
        description: "Run and manage the headless node host service",
        hasSubcommands: true
      },
      {
        name: "worker",
        description: "Run the restricted cloud worker runtime",
        hasSubcommands: false
      },
      {
        name: "sandbox",
        description: "Manage sandbox containers (Docker-based agent isolation)",
        hasSubcommands: true
      },
      {
        name: "fleet",
        description: "Provision and manage isolated tenant cells (experimental)",
        hasSubcommands: true
      },
      {
        name: "worktrees",
        description: "Create, inspect, restore, and clean up managed worktrees",
        hasSubcommands: true,
        parentDefaultHelp: true
      },
      {
        name: "attach",
        description: "Attach Claude Code to a gateway session with scoped MCP tools",
        hasSubcommands: false
      },
      {
        name: "tui",
        description: "Open a terminal UI connected to the Gateway",
        hasSubcommands: false
      },
      {
        name: "terminal",
        description: "Open a local terminal UI (alias for tui --local)",
        hasSubcommands: false
      },
      {
        name: "chat",
        description: "Open a local terminal UI (alias for tui --local)",
        hasSubcommands: false
      },
      {
        name: "cron",
        description: "Manage cron jobs (via Gateway)",
        hasSubcommands: true,
        parentDefaultHelp: true
      },
      {
        name: "dns",
        description: "DNS helpers for wide-area discovery (Tailscale + CoreDNS)",
        hasSubcommands: true
      },
      {
        name: "docs",
        description: "Search the live OpenClaw docs",
        hasSubcommands: false
      },
      {
        name: "qa",
        description: "Run QA scenarios and launch the private QA debugger UI",
        hasSubcommands: true
      },
      {
        name: "proxy",
        description: "Run the OpenClaw debug proxy and inspect captured traffic",
        hasSubcommands: true
      },
      {
        name: "hooks",
        description: "Manage internal agent hooks",
        hasSubcommands: true
      },
      {
        name: "webhooks",
        description: "Webhook helpers and integrations",
        hasSubcommands: true
      },
      {
        name: "qr",
        description: "Generate a mobile pairing QR code and setup code",
        hasSubcommands: false
      },
      {
        name: "clawbot",
        description: "Legacy clawbot command aliases",
        hasSubcommands: true
      },
      {
        name: "pairing",
        description: "Secure DM pairing (approve inbound requests)",
        hasSubcommands: true
      },
      {
        name: "plugins",
        description: "Manage OpenClaw plugins and extensions",
        hasSubcommands: true,
        parentDefaultHelp: true
      },
      {
        name: "channels",
        description: "Manage connected chat channels and accounts",
        hasSubcommands: true,
        parentDefaultHelp: true
      },
      {
        name: "directory",
        description: "Lookup contact and group IDs (self, peers, groups) for supported chat channels",
        hasSubcommands: true
      },
      {
        name: "security",
        description: "Audit local config and state for common security foot-guns",
        hasSubcommands: true
      },
      {
        name: "secrets",
        description: "Secrets runtime controls",
        hasSubcommands: true
      },
      {
        name: "skills",
        description: "List and inspect available skills",
        hasSubcommands: true
      },
      {
        name: "update",
        description: "Update OpenClaw and inspect update channel status",
        hasSubcommands: true
      },
      {
        name: "completion",
        description: "Generate shell completion script",
        hasSubcommands: false
      }
    ]);
    SUB_CLI_DESCRIPTORS = filterPrivateQaItems(
      subCliCommandCatalog.descriptors,
      (descriptor) => descriptor.name
    );
  }
});

// src/cli/argv.ts
function getCommandPathWithRootOptions(argv, depth = 2) {
  return getCommandPathInternal(argv, depth, { skipRootOptions: true });
}
function getCommandPathInternal(argv, depth, opts) {
  const args = argv.slice(2);
  const path16 = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg) {
      continue;
    }
    if (arg === "--") {
      break;
    }
    if (opts.skipRootOptions) {
      const consumed = consumeRootOptionToken(args, i);
      if (consumed > 0) {
        i += consumed - 1;
        continue;
      }
    }
    if (arg.startsWith("-")) {
      continue;
    }
    path16.push(arg);
    if (path16.length >= depth) {
      break;
    }
  }
  return path16;
}
var ROOT_COMMAND_DESCRIPTORS, KNOWN_ROOT_COMMANDS, ROOT_COMMANDS_WITH_SUBCOMMANDS;
var init_argv = __esm({
  "src/cli/argv.ts"() {
    "use strict";
    init_runtime_binary();
    init_cli_root_options();
    init_parse_finite_number();
    init_core_command_descriptors();
    init_subcli_descriptors();
    ROOT_COMMAND_DESCRIPTORS = [...CORE_CLI_COMMAND_DESCRIPTORS, ...SUB_CLI_DESCRIPTORS];
    KNOWN_ROOT_COMMANDS = new Set(
      ROOT_COMMAND_DESCRIPTORS.map((descriptor) => descriptor.name)
    );
    ROOT_COMMANDS_WITH_SUBCOMMANDS = new Set(
      ROOT_COMMAND_DESCRIPTORS.filter((descriptor) => descriptor.hasSubcommands).map(
        (descriptor) => descriptor.name
      )
    );
  }
});

// src/infra/tcp-port.ts
var init_tcp_port = __esm({
  "src/infra/tcp-port.ts"() {
    "use strict";
    init_parse_finite_number();
  }
});

// src/config/paths.ts
import fs2 from "node:fs";
import os2 from "node:os";
import path4 from "node:path";
function resolveIsNixMode(env = process.env) {
  return env.OPENCLAW_NIX_MODE === "1";
}
function resolveDefaultHomeDir() {
  return resolveRequiredHomeDir(process.env, os2.homedir);
}
function envHomedir(env) {
  return () => resolveRequiredHomeDir(env, os2.homedir);
}
function legacyStateDirs(homedir = resolveDefaultHomeDir) {
  return LEGACY_STATE_DIRNAMES.map((dir) => path4.join(homedir(), dir));
}
function newStateDir(homedir = resolveDefaultHomeDir) {
  return path4.join(homedir(), NEW_STATE_DIRNAME);
}
function resolveStateDir(env = process.env, homedir = envHomedir(env)) {
  const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
  const override = env.OPENCLAW_STATE_DIR?.trim();
  if (override) {
    return resolveUserPath(override, env, effectiveHomedir);
  }
  const newDir = newStateDir(effectiveHomedir);
  if (env.OPENCLAW_TEST_FAST === "1") {
    return newDir;
  }
  const legacyDirs = legacyStateDirs(effectiveHomedir);
  const hasNew = fs2.existsSync(newDir);
  if (hasNew) {
    return newDir;
  }
  const existingLegacy = legacyDirs.find((dir) => {
    try {
      return fs2.existsSync(dir);
    } catch {
      return false;
    }
  });
  if (existingLegacy) {
    return existingLegacy;
  }
  return newDir;
}
function resolveUserPath(input, env = process.env, homedir = envHomedir(env)) {
  return resolveHomeRelativePath(input, { env, homedir });
}
function resolveCanonicalConfigPath(env = process.env, stateDir = resolveStateDir(env, envHomedir(env))) {
  const override = env.OPENCLAW_CONFIG_PATH?.trim();
  if (override) {
    return resolveUserPath(override, env, envHomedir(env));
  }
  return path4.join(stateDir, CONFIG_FILENAME);
}
function resolveConfigPathCandidate(env = process.env, homedir = envHomedir(env)) {
  if (env.OPENCLAW_TEST_FAST === "1") {
    return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
  }
  const candidates = resolveDefaultConfigCandidates(env, homedir);
  const existing = candidates.find((candidate) => {
    try {
      return fs2.existsSync(candidate);
    } catch {
      return false;
    }
  });
  if (existing) {
    return existing;
  }
  return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
}
function resolveConfigPath(env = process.env, stateDir = resolveStateDir(env, envHomedir(env)), homedir = envHomedir(env)) {
  const override = env.OPENCLAW_CONFIG_PATH?.trim();
  if (override) {
    return resolveUserPath(override, env, homedir);
  }
  if (env.OPENCLAW_TEST_FAST === "1") {
    return path4.join(stateDir, CONFIG_FILENAME);
  }
  const stateOverride = env.OPENCLAW_STATE_DIR?.trim();
  const candidates = [
    path4.join(stateDir, CONFIG_FILENAME),
    ...LEGACY_CONFIG_FILENAMES.map((name) => path4.join(stateDir, name))
  ];
  const existing = candidates.find((candidate) => {
    try {
      return fs2.existsSync(candidate);
    } catch {
      return false;
    }
  });
  if (existing) {
    return existing;
  }
  if (stateOverride) {
    return path4.join(stateDir, CONFIG_FILENAME);
  }
  const defaultStateDir = resolveStateDir(env, homedir);
  if (path4.resolve(stateDir) === path4.resolve(defaultStateDir)) {
    return resolveConfigPathCandidate(env, homedir);
  }
  return path4.join(stateDir, CONFIG_FILENAME);
}
function resolveDefaultConfigCandidates(env = process.env, homedir = envHomedir(env)) {
  const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
  const explicit = env.OPENCLAW_CONFIG_PATH?.trim();
  if (explicit) {
    return [resolveUserPath(explicit, env, effectiveHomedir)];
  }
  const candidates = [];
  const openclawStateDir = env.OPENCLAW_STATE_DIR?.trim();
  if (openclawStateDir) {
    const resolved = resolveUserPath(openclawStateDir, env, effectiveHomedir);
    candidates.push(path4.join(resolved, CONFIG_FILENAME));
    candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path4.join(resolved, name)));
  }
  const defaultDirs = [newStateDir(effectiveHomedir), ...legacyStateDirs(effectiveHomedir)];
  for (const dir of defaultDirs) {
    candidates.push(path4.join(dir, CONFIG_FILENAME));
    candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path4.join(dir, name)));
  }
  return candidates;
}
var isNixMode, LEGACY_STATE_DIRNAMES, NEW_STATE_DIRNAME, CONFIG_FILENAME, LEGACY_CONFIG_FILENAMES, STATE_DIR, CONFIG_PATH;
var init_paths = __esm({
  "src/config/paths.ts"() {
    "use strict";
    init_home_dir();
    init_tcp_port();
    isNixMode = resolveIsNixMode();
    LEGACY_STATE_DIRNAMES = [".clawdbot"];
    NEW_STATE_DIRNAME = ".openclaw";
    CONFIG_FILENAME = "openclaw.json";
    LEGACY_CONFIG_FILENAMES = ["clawdbot.json"];
    STATE_DIR = resolveStateDir();
    CONFIG_PATH = resolveConfigPathCandidate();
  }
});

// src/logging/config.ts
import fs3 from "node:fs";
import JSON5 from "json5";
function shouldSkipMutatingLoggingConfigRead(argv = process.argv) {
  const [primary, secondary] = getCommandPathWithRootOptions(argv, 2);
  return primary === "config" && (secondary === "schema" || secondary === "validate");
}
function readLoggingConfig() {
  if (shouldSkipMutatingLoggingConfigRead()) {
    return void 0;
  }
  try {
    const configPath = resolveConfigPath();
    if (cachedLoggingConfig?.path === configPath) {
      return cachedLoggingConfig.logging;
    }
    if (!fs3.existsSync(configPath)) {
      return void 0;
    }
    const parsed = JSON5.parse(fs3.readFileSync(configPath, "utf8"));
    const logging = isRecord(parsed) ? parsed.logging : void 0;
    const resolved = isRecord(logging) ? logging : void 0;
    cachedLoggingConfig = {
      path: configPath,
      logging: resolved
    };
    return resolved;
  } catch {
    return void 0;
  }
}
var cachedLoggingConfig;
var init_config = __esm({
  "src/logging/config.ts"() {
    "use strict";
    init_record_coerce();
    init_argv();
    init_paths();
  }
});

// src/logging/levels.ts
function tryParseLogLevel(level) {
  if (typeof level !== "string") {
    return void 0;
  }
  const candidate = level.trim();
  return ALLOWED_LOG_LEVELS.includes(candidate) ? candidate : void 0;
}
function normalizeLogLevel(level, fallback = "info") {
  return tryParseLogLevel(level) ?? fallback;
}
function levelToMinLevel(level) {
  const map = {
    trace: 1,
    debug: 2,
    info: 3,
    warn: 4,
    error: 5,
    fatal: 6,
    silent: Number.POSITIVE_INFINITY
  };
  return map[level];
}
var ALLOWED_LOG_LEVELS;
var init_levels = __esm({
  "src/logging/levels.ts"() {
    "use strict";
    ALLOWED_LOG_LEVELS = [
      "silent",
      "fatal",
      "error",
      "warn",
      "info",
      "debug",
      "trace"
    ];
  }
});

// src/logging/state.ts
function createLoggingState() {
  return {
    cachedLogger: null,
    cachedSettings: null,
    cachedConsoleSettings: null,
    overrideSettings: null,
    invalidEnvLogLevelValue: null,
    consolePatched: false,
    forceConsoleToStderr: false,
    consoleTimestampPrefix: false,
    consoleSubsystemFilter: null,
    resolvingConsoleSettings: false,
    streamErrorHandlersInstalled: false,
    rawConsole: null
  };
}
var LOGGING_STATE_KEY, globalStore, loggingState;
var init_state = __esm({
  "src/logging/state.ts"() {
    "use strict";
    LOGGING_STATE_KEY = /* @__PURE__ */ Symbol.for("openclaw.loggingState");
    globalStore = globalThis;
    loggingState = globalStore[LOGGING_STATE_KEY] ?? createLoggingState();
    globalStore[LOGGING_STATE_KEY] = loggingState;
  }
});

// src/logging/env-log-level.ts
function resolveEnvLogLevelOverride() {
  const trimmed = normalizeOptionalString(process.env.OPENCLAW_LOG_LEVEL) ?? "";
  if (!trimmed) {
    loggingState.invalidEnvLogLevelValue = null;
    return void 0;
  }
  const parsed = tryParseLogLevel(trimmed);
  if (parsed) {
    loggingState.invalidEnvLogLevelValue = null;
    return parsed;
  }
  if (loggingState.invalidEnvLogLevelValue !== trimmed) {
    loggingState.invalidEnvLogLevelValue = trimmed;
    process.stderr.write(
      `[openclaw] Ignoring invalid OPENCLAW_LOG_LEVEL="${trimmed}" (allowed: ${ALLOWED_LOG_LEVELS.join("|")}).
`
    );
  }
  return void 0;
}
var init_env_log_level = __esm({
  "src/logging/env-log-level.ts"() {
    "use strict";
    init_string_coerce();
    init_levels();
    init_state();
  }
});

// src/logging/log-file-shared.ts
function canUseNodeFs() {
  const getBuiltinModule = process.getBuiltinModule;
  if (typeof getBuiltinModule !== "function") {
    return false;
  }
  try {
    return getBuiltinModule("fs") !== void 0;
  } catch {
    return false;
  }
}
function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
var LOG_PREFIX, LOG_SUFFIX;
var init_log_file_shared = __esm({
  "src/logging/log-file-shared.ts"() {
    "use strict";
    LOG_PREFIX = "openclaw";
    LOG_SUFFIX = ".log";
  }
});

// packages/acp-core/src/structured-auth-redaction.ts
function skipHorizontalWhitespace(value, start) {
  let cursor = start;
  while (value[cursor] === " " || value[cursor] === "	") {
    cursor += 1;
  }
  return cursor;
}
function readSerializedLineEnd(value, start) {
  let cursor = start;
  let slashCount = 0;
  while (slashCount < 64 && value[cursor] === "\\") {
    slashCount += 1;
    cursor += 1;
  }
  if (slashCount === 0) {
    return null;
  }
  if (value[cursor] === "n") {
    return cursor + 1;
  }
  if (value[cursor] !== "r") {
    return null;
  }
  cursor += 1;
  slashCount = 0;
  while (slashCount < 64 && value[cursor] === "\\") {
    slashCount += 1;
    cursor += 1;
  }
  return slashCount > 0 && value[cursor] === "n" ? cursor + 1 : null;
}
function readSerializedTabEnd(value, start) {
  let cursor = start;
  let slashCount = 0;
  while (slashCount < 64 && value[cursor] === "\\") {
    slashCount += 1;
    cursor += 1;
  }
  return slashCount > 0 && value[cursor] === "t" ? cursor + 1 : null;
}
function skipAuthWhitespace(value, start) {
  let cursor = start;
  for (; ; ) {
    cursor = skipHorizontalWhitespace(value, cursor);
    const tabEnd = readSerializedTabEnd(value, cursor);
    if (tabEnd !== null) {
      cursor = tabEnd;
      continue;
    }
    const lineEnd = value[cursor] === "\r" && value[cursor + 1] === "\n" ? cursor + 2 : value[cursor] === "\n" ? cursor + 1 : readSerializedLineEnd(value, cursor);
    if (lineEnd === null || value[lineEnd] !== " " && value[lineEnd] !== "	" && readSerializedTabEnd(value, lineEnd) === null) {
      return cursor;
    }
    cursor = lineEnd;
  }
}
function readAuthParamName(value, start) {
  const match = AUTH_PARAM_NAME_RE.exec(value.slice(start));
  return match ? { name: match[0].toLowerCase(), end: start + match[0].length } : null;
}
function isAuthHeaderStart(value, index) {
  const previous = value[index - 1];
  let serializedLineBoundary = false;
  if (previous === "n" || previous === "r") {
    let slashCursor = index - 2;
    let slashCount2 = 0;
    while (slashCount2 < 64 && value[slashCursor] === "\\") {
      slashCount2 += 1;
      slashCursor -= 1;
    }
    serializedLineBoundary = slashCount2 > 0;
  }
  if (!serializedLineBoundary && previous !== void 0 && /[A-Za-z0-9_-]/u.test(previous)) {
    return false;
  }
  const proxyName = "proxy-authorization";
  const directName = "authorization";
  const candidate = value.slice(index, index + proxyName.length).toLowerCase();
  const name = candidate === proxyName ? proxyName : candidate.startsWith(directName) ? directName : null;
  if (!name) {
    return false;
  }
  let cursor = index + name.length;
  let slashCount = 0;
  while (slashCount < 64 && value[cursor] === "\\") {
    slashCount += 1;
    cursor += 1;
  }
  if (value[cursor] === '"' || value[cursor] === "'") {
    cursor += 1;
  } else if (slashCount > 0) {
    return false;
  }
  cursor = skipHorizontalWhitespace(value, cursor);
  return value[cursor] === ":" || value[cursor] === "=";
}
function findNextAuthParamStart(value, start) {
  let cursor = start;
  for (; ; ) {
    cursor = skipAuthWhitespace(value, cursor);
    if (cursor > start && isAuthHeaderStart(value, cursor)) {
      return null;
    }
    if (cursor >= value.length || value[cursor] === "\r" || value[cursor] === "\n" || value[cursor] === ";") {
      return null;
    }
    if (value[cursor] === ",") {
      cursor += 1;
      continue;
    }
    const param = readAuthParamName(value, cursor);
    if (param) {
      const equals = skipAuthWhitespace(value, param.end);
      if (value[equals] === "=" && value[equals + 1] !== "=") {
        return cursor;
      }
    }
    while (cursor < value.length) {
      const whitespaceEnd = skipAuthWhitespace(value, cursor);
      if (whitespaceEnd > cursor) {
        cursor = whitespaceEnd;
        continue;
      }
      if (cursor > start && isAuthHeaderStart(value, cursor)) {
        return null;
      }
      const char = value[cursor];
      if (char === "\r" || char === "\n" || char === ";") {
        return null;
      }
      cursor += 1;
      if (char === ",") {
        break;
      }
    }
  }
}
function usesAuthParams(scheme) {
  return scheme === "digest" || scheme === "hawk" || scheme.startsWith("aws4-");
}
function findAuthFieldEnd(value, start) {
  let cursor = start;
  while (cursor < value.length) {
    const whitespaceEnd = skipAuthWhitespace(value, cursor);
    if (whitespaceEnd > cursor) {
      cursor = whitespaceEnd;
      continue;
    }
    if (cursor > start && isAuthHeaderStart(value, cursor)) {
      break;
    }
    const char = value[cursor];
    if (char === "\r" || char === "\n" || char === ";" || char === "\\" || char === '"' || char === "'" || char === "}" || char === "]") {
      break;
    }
    cursor += 1;
  }
  return cursor;
}
function readParamValue(value, start, options) {
  let escapedQuoteSlashCount = 0;
  while (value[start + escapedQuoteSlashCount] === "\\") {
    escapedQuoteSlashCount += 1;
  }
  const escapedQuotes = escapedQuoteSlashCount > 0 && value[start + escapedQuoteSlashCount] === '"';
  const quote = value[start] === '"' || value[start] === "'" ? value[start] : void 0;
  if (quote || escapedQuotes) {
    let cursor = start + (escapedQuotes ? escapedQuoteSlashCount + 1 : 1);
    while (cursor < value.length) {
      if (value[cursor] === "\r" || value[cursor] === "\n") {
        const whitespaceEnd = skipAuthWhitespace(value, cursor);
        if (whitespaceEnd === cursor) {
          break;
        }
        cursor = whitespaceEnd;
        continue;
      }
      if (escapedQuotes && value[cursor] === "\\") {
        let slashEnd = cursor + 1;
        while (value[slashEnd] === "\\") {
          slashEnd += 1;
        }
        if (value[slashEnd] === '"') {
          const slashCount = slashEnd - cursor;
          if (slashCount % (2 * (escapedQuoteSlashCount + 1)) === escapedQuoteSlashCount) {
            return slashEnd + 1;
          }
          cursor = slashEnd + 1;
          continue;
        }
        cursor = slashEnd;
        continue;
      }
      if (!escapedQuotes && value[cursor] === "\\" && cursor + 1 < value.length) {
        cursor += 2;
        continue;
      }
      if (!escapedQuotes && value[cursor] === quote) {
        return cursor + 1;
      }
      cursor += 1;
    }
    return cursor > start + 1 ? cursor : null;
  }
  if (options.signedHeaders) {
    const match2 = /^:?[A-Za-z0-9!#$%&'*+.^_`|~-]+(?:;:?[A-Za-z0-9!#$%&'*+.^_`|~-]+)*/u.exec(
      value.slice(start)
    );
    if (!match2) {
      return null;
    }
    const end = start + match2[0].length;
    const next = value[end];
    return next === void 0 || next === "," || next === " " || next === "	" || next === "\r" || next === "\n" ? end : null;
  }
  const match = (options.awsScope ? AWS_SCOPE_VALUE_RE : AUTH_PARAM_TOKEN_RE).exec(
    value.slice(start)
  );
  return match ? start + match[0].length : null;
}
function findStructuredAuthParamRanges(value) {
  const ranges = [];
  for (const header of value.matchAll(STRUCTURED_AUTH_HEADER_RE)) {
    const scheme = (header[2] ?? "").toLowerCase();
    let cursor = (header.index ?? 0) + header[0].length;
    const rangeStart = cursor;
    let rangeEnd = cursor;
    const directParam = readAuthParamName(value, cursor);
    const directEquals = directParam ? skipAuthWhitespace(value, directParam.end) : void 0;
    if (!directParam || directEquals === void 0 || value[directEquals] !== "=" || value[directEquals + 1] === "=") {
      const firstNonWhitespace = skipAuthWhitespace(value, cursor);
      if (value[firstNonWhitespace] !== "," && !usesAuthParams(scheme)) {
        continue;
      }
      const firstParamStart = findNextAuthParamStart(value, cursor);
      if (firstParamStart === null) {
        continue;
      }
      cursor = firstParamStart;
    }
    for (; ; ) {
      const param = readAuthParamName(value, cursor);
      if (!param) {
        break;
      }
      cursor = skipAuthWhitespace(value, param.end);
      if (value[cursor] !== "=") {
        break;
      }
      cursor = skipAuthWhitespace(value, cursor + 1);
      const valueEnd = readParamValue(value, cursor, {
        awsScope: scheme.startsWith("aws4-") && param.name === "credential",
        signedHeaders: param.name === "signedheaders"
      });
      if (valueEnd === null) {
        const nextParamStart2 = findNextAuthParamStart(value, cursor);
        if (nextParamStart2 !== null) {
          cursor = nextParamStart2;
          continue;
        }
        rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, cursor));
        break;
      }
      rangeEnd = valueEnd;
      const separator = skipAuthWhitespace(value, valueEnd);
      if (value[separator] !== ",") {
        if (value[separator] !== void 0 && value[separator] !== "\r" && value[separator] !== "\n" && value[separator] !== ";" && value[separator] !== "\\" && value[separator] !== '"' && value[separator] !== "'" && value[separator] !== "}" && value[separator] !== "]") {
          const nextParamStart2 = findNextAuthParamStart(value, separator);
          if (nextParamStart2 !== null) {
            cursor = nextParamStart2;
            continue;
          }
          rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, separator));
        }
        break;
      }
      const nextParamStart = findNextAuthParamStart(value, separator + 1);
      if (nextParamStart === null) {
        break;
      }
      cursor = nextParamStart;
    }
    if (rangeEnd > rangeStart) {
      ranges.push({ start: rangeStart, end: rangeEnd });
    }
  }
  return ranges;
}
function redactStructuredAuthHeaders(value, replacement) {
  const ranges = findStructuredAuthParamRanges(value);
  if (ranges.length === 0) {
    return value;
  }
  const merged = [];
  for (const range of ranges) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) {
      previous.end = Math.max(previous.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }
  const parts = [];
  let cursor = 0;
  for (const range of merged) {
    parts.push(value.slice(cursor, range.start), replacement);
    cursor = range.end;
  }
  parts.push(value.slice(cursor));
  return parts.join("");
}
var HTTP_AUTH_SCHEME_PATTERN, HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN, HTTP_AUTH_SERIALIZED_TAB_PATTERN, HTTP_AUTH_SERIALIZED_INDENT_PATTERN, HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN, HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN, HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN, HTTP_AUTH_HEADER_BOUNDARY_PATTERN, HTTP_AUTH_SERIALIZED_QUOTE_PATTERN, CREDENTIAL_STYLE_HEADER_REDACT_PATTERN, STRUCTURED_AUTH_HEADER_RE, AUTH_PARAM_NAME_RE, AUTH_PARAM_TOKEN_RE, AWS_SCOPE_VALUE_RE;
var init_structured_auth_redaction = __esm({
  "packages/acp-core/src/structured-auth-redaction.ts"() {
    "use strict";
    HTTP_AUTH_SCHEME_PATTERN = "[A-Za-z0-9!#$%&'*+.^_`|~-]+";
    HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN = String.raw`(?:\[REDACTED\]|[^\s\\"',;&#?<>)}\]]+)`;
    HTTP_AUTH_SERIALIZED_TAB_PATTERN = String.raw`\\{1,64}t`;
    HTTP_AUTH_SERIALIZED_INDENT_PATTERN = String.raw`(?:[ \t]+|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})`;
    HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]*)`;
    HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]+)`;
    HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t\r\n]*|[ \t]*\\{1,64}r\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*)`;
    HTTP_AUTH_HEADER_BOUNDARY_PATTERN = String.raw`(^|[^A-Za-z0-9_-]|\\{1,64}[rn])`;
    HTTP_AUTH_SERIALIZED_QUOTE_PATTERN = String.raw`(?:\\{1,64}["']|["']|)`;
    CREDENTIAL_STYLE_HEADER_REDACT_PATTERN = String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:x-goog-api-key|api-key|apikey|x-api-token|x-access-token)${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
    STRUCTURED_AUTH_HEADER_RE = new RegExp(
      String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:Proxy-)?Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_SCHEME_PATTERN})${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}`,
      "giu"
    );
    AUTH_PARAM_NAME_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
    AUTH_PARAM_TOKEN_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
    AWS_SCOPE_VALUE_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~:/-]+/u;
  }
});

// packages/acp-core/src/error-format.ts
var STRUCTURED_AUTH_MARKER_PREFIX, SECRET_PATTERNS;
var init_error_format = __esm({
  "packages/acp-core/src/error-format.ts"() {
    "use strict";
    init_structured_auth_redaction();
    init_error_coercion();
    STRUCTURED_AUTH_MARKER_PREFIX = ";__openclaw_structured_auth_redacted_";
    SECRET_PATTERNS = [
      /\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN)\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g,
      /\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN)\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g,
      /[?&](?:access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|api[-_]?key|client[-_]?secret|token|key|secret|password|pass|passwd|auth|signature|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)=([^&\s"'<>]+)/gi,
      /"(?:apiKey|token|secret|password|passwd|accessToken|refreshToken|cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token)"\s*:\s*"([^"]+)"/g,
      /(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2/gi,
      /(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2/gi,
      /--(?:api[-_]?key|hook[-_]?token|token|secret|password|passwd|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)\s+(["']?)([^\s"']+)\1/gi,
      new RegExp(
        String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bearer${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
        "gi"
      ),
      new RegExp(
        String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Basic${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
        "gi"
      ),
      new RegExp(
        String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
        "gi"
      ),
      new RegExp(
        String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}${STRUCTURED_AUTH_MARKER_PREFIX})(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
        "gi"
      ),
      new RegExp(
        String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
        "gi"
      ),
      new RegExp(
        String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))(?!${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}${STRUCTURED_AUTH_MARKER_PREFIX})(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
        "gi"
      ),
      new RegExp(CREDENTIAL_STYLE_HEADER_REDACT_PATTERN, "gi"),
      /(?:X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token)\s*[:=]\s*([^\s"',;]+)/gi,
      /\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])/g,
      /(^|[\s,;])(?:access_token|refresh_token|auth[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|token|secret|password|passwd|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)=([^\s&#]+)/gi,
      /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----/g,
      /\b(sk-[A-Za-z0-9_-]{8,})\b/g,
      /(ghp_[A-Za-z0-9]{20,})/g,
      /(github_pat_[A-Za-z0-9_]{20,})/g,
      /(xox[baprs]-[A-Za-z0-9-]{10,})/g,
      /(xapp-[A-Za-z0-9-]{10,})/g,
      /(gsk_[A-Za-z0-9_-]{10,})/g,
      /(AIza[0-9A-Za-z\-_]{20,})/g,
      /(ya29\.[0-9A-Za-z_\-./+=]{10,})/g,
      /(1\/\/0[0-9A-Za-z_\-./+=]{10,})/g,
      /(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})/g,
      /(pplx-[A-Za-z0-9_-]{10,})/g,
      /(npm_[A-Za-z0-9]{10,})/g,
      /(AKID[A-Za-z0-9]{10,})/g,
      /(LTAI[A-Za-z0-9]{10,})/g,
      /(hf_[A-Za-z0-9]{10,})/g,
      /(r8_[A-Za-z0-9]{10,})/g,
      /\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b/g,
      /\b(\d{6,}:[A-Za-z0-9_-]{20,})\b/g
    ];
  }
});

// packages/acp-core/src/meta.ts
var init_meta = __esm({
  "packages/acp-core/src/meta.ts"() {
    "use strict";
    init_string_coerce();
  }
});

// packages/acp-core/src/normalize-text.ts
var init_normalize_text = __esm({
  "packages/acp-core/src/normalize-text.ts"() {
    "use strict";
    init_string_coerce();
  }
});

// packages/acp-core/src/numeric-options.ts
function resolveIntegerOption2(value, fallback, params) {
  return resolveIntegerOption(value, fallback, params);
}
var init_numeric_options = __esm({
  "packages/acp-core/src/numeric-options.ts"() {
    "use strict";
    init_number_coercion();
  }
});

// packages/acp-core/src/record-shared.ts
var init_record_shared = __esm({
  "packages/acp-core/src/record-shared.ts"() {
    "use strict";
    init_record_coerce();
  }
});

// packages/acp-core/src/session-interaction-mode.ts
var init_session_interaction_mode = __esm({
  "packages/acp-core/src/session-interaction-mode.ts"() {
    "use strict";
    init_string_coerce();
  }
});

// packages/acp-core/src/session-lineage-meta.ts
var init_session_lineage_meta = __esm({
  "packages/acp-core/src/session-lineage-meta.ts"() {
    "use strict";
    init_string_coerce();
  }
});

// packages/acp-core/src/session.ts
import { randomUUID } from "node:crypto";
function createInMemorySessionStore(options = {}) {
  const maxSessions = resolveIntegerOption2(options.maxSessions, DEFAULT_MAX_SESSIONS, { min: 1 });
  const idleTtlMs = resolveIntegerOption2(options.idleTtlMs, DEFAULT_IDLE_TTL_MS, { min: 1e3 });
  const now = options.now ?? Date.now;
  const sessions = /* @__PURE__ */ new Map();
  const runIdToSessionId = /* @__PURE__ */ new Map();
  const touchSession = (session, nowMs) => {
    session.lastTouchedAt = nowMs;
  };
  const removeSession = (sessionId) => {
    const session = sessions.get(sessionId);
    if (!session) {
      return false;
    }
    if (session.activeRunId) {
      runIdToSessionId.delete(session.activeRunId);
    }
    session.abortController?.abort();
    sessions.delete(sessionId);
    return true;
  };
  const reapIdleSessions = (nowMs) => {
    const idleBefore = nowMs - idleTtlMs;
    for (const [sessionId, session] of sessions.entries()) {
      if (session.activeRunId || session.abortController) {
        continue;
      }
      if (session.lastTouchedAt > idleBefore) {
        continue;
      }
      removeSession(sessionId);
    }
  };
  const evictOldestIdleSession = () => {
    let oldestSessionId = null;
    let oldestLastTouchedAt = Number.POSITIVE_INFINITY;
    for (const [sessionId, session] of sessions.entries()) {
      if (session.activeRunId || session.abortController) {
        continue;
      }
      if (session.lastTouchedAt >= oldestLastTouchedAt) {
        continue;
      }
      oldestLastTouchedAt = session.lastTouchedAt;
      oldestSessionId = sessionId;
    }
    if (!oldestSessionId) {
      return false;
    }
    return removeSession(oldestSessionId);
  };
  const createSession = (params) => {
    const nowMs = now();
    const sessionId = params.sessionId ?? randomUUID();
    const existingSession = sessions.get(sessionId);
    if (existingSession) {
      existingSession.sessionKey = params.sessionKey;
      if ("ledgerSessionId" in params) {
        existingSession.ledgerSessionId = params.ledgerSessionId;
      }
      existingSession.cwd = params.cwd;
      touchSession(existingSession, nowMs);
      return existingSession;
    }
    reapIdleSessions(nowMs);
    if (sessions.size >= maxSessions && !evictOldestIdleSession()) {
      throw new Error(
        `ACP session limit reached (max ${maxSessions}). Close idle ACP clients and retry.`
      );
    }
    const session = {
      sessionId,
      sessionKey: params.sessionKey,
      ...params.ledgerSessionId ? { ledgerSessionId: params.ledgerSessionId } : {},
      cwd: params.cwd,
      createdAt: nowMs,
      lastTouchedAt: nowMs,
      abortController: null,
      activeRunId: null
    };
    sessions.set(sessionId, session);
    return session;
  };
  const hasSession = (sessionId) => sessions.has(sessionId);
  const getSession = (sessionId) => {
    const session = sessions.get(sessionId);
    if (session) {
      touchSession(session, now());
    }
    return session;
  };
  const getSessionByRunId = (runId) => {
    const sessionId = runIdToSessionId.get(runId);
    if (!sessionId) {
      return void 0;
    }
    const session = sessions.get(sessionId);
    if (session) {
      touchSession(session, now());
    }
    return session;
  };
  const setActiveRun = (sessionId, runId, abortController) => {
    const session = sessions.get(sessionId);
    if (!session) {
      return;
    }
    if (session.activeRunId && session.activeRunId !== runId) {
      runIdToSessionId.delete(session.activeRunId);
    }
    session.activeRunId = runId;
    session.abortController = abortController;
    runIdToSessionId.set(runId, sessionId);
    touchSession(session, now());
  };
  const clearActiveRun = (sessionId) => {
    const session = sessions.get(sessionId);
    if (!session) {
      return;
    }
    if (session.activeRunId) {
      runIdToSessionId.delete(session.activeRunId);
    }
    session.activeRunId = null;
    session.abortController = null;
    touchSession(session, now());
  };
  const cancelActiveRun = (sessionId) => {
    const session = sessions.get(sessionId);
    if (!session?.abortController) {
      return false;
    }
    session.abortController.abort();
    if (session.activeRunId) {
      runIdToSessionId.delete(session.activeRunId);
    }
    session.abortController = null;
    session.activeRunId = null;
    touchSession(session, now());
    return true;
  };
  const deleteSession = (sessionId) => removeSession(sessionId);
  const clearAllSessionsForTest = () => {
    for (const session of sessions.values()) {
      session.abortController?.abort();
    }
    sessions.clear();
    runIdToSessionId.clear();
  };
  return {
    createSession,
    hasSession,
    getSession,
    getSessionByRunId,
    setActiveRun,
    clearActiveRun,
    cancelActiveRun,
    deleteSession,
    clearAllSessionsForTest
  };
}
var DEFAULT_MAX_SESSIONS, DEFAULT_IDLE_TTL_MS, defaultAcpSessionStore;
var init_session = __esm({
  "packages/acp-core/src/session.ts"() {
    "use strict";
    init_numeric_options();
    DEFAULT_MAX_SESSIONS = 5e3;
    DEFAULT_IDLE_TTL_MS = 24 * 60 * 60 * 1e3;
    defaultAcpSessionStore = createInMemorySessionStore();
  }
});

// packages/acp-core/src/types.ts
var init_types = __esm({
  "packages/acp-core/src/types.ts"() {
    "use strict";
    init_string_coerce();
  }
});

// packages/acp-core/src/runtime/errors.ts
var ACP_ERROR_CODES, ACP_ERROR_CODE_SET;
var init_errors = __esm({
  "packages/acp-core/src/runtime/errors.ts"() {
    "use strict";
    init_error_format();
    ACP_ERROR_CODES = [
      "ACP_BACKEND_MISSING",
      "ACP_BACKEND_UNAVAILABLE",
      "ACP_BACKEND_UNSUPPORTED_CONTROL",
      "ACP_DISPATCH_DISABLED",
      "ACP_INVALID_RUNTIME_OPTION",
      "ACP_SESSION_INIT_FAILED",
      "ACP_TURN_FAILED"
    ];
    ACP_ERROR_CODE_SET = new Set(ACP_ERROR_CODES);
  }
});

// packages/acp-core/src/runtime/error-text.ts
var init_error_text = __esm({
  "packages/acp-core/src/runtime/error-text.ts"() {
    "use strict";
    init_errors();
  }
});

// packages/acp-core/src/runtime/session-identity.ts
var init_session_identity = __esm({
  "packages/acp-core/src/runtime/session-identity.ts"() {
    "use strict";
    init_normalize_text();
  }
});

// packages/acp-core/src/runtime/session-identifiers.ts
var init_session_identifiers = __esm({
  "packages/acp-core/src/runtime/session-identifiers.ts"() {
    "use strict";
    init_string_coerce();
    init_normalize_text();
    init_session_identity();
  }
});

// packages/acp-core/src/runtime/types.ts
var init_types2 = __esm({
  "packages/acp-core/src/runtime/types.ts"() {
    "use strict";
  }
});

// packages/acp-core/src/index.ts
var init_src2 = __esm({
  "packages/acp-core/src/index.ts"() {
    "use strict";
    init_error_format();
    init_meta();
    init_normalize_text();
    init_numeric_options();
    init_record_shared();
    init_session_interaction_mode();
    init_session_lineage_meta();
    init_session();
    init_structured_auth_redaction();
    init_types();
    init_error_text();
    init_errors();
    init_session_identifiers();
    init_session_identity();
    init_types2();
  }
});

// src/security/safe-regex.ts
function createParseFrame() {
  return {
    lastToken: null,
    containsRepetition: false,
    hasAlternation: false,
    branchMinLength: 0,
    branchMaxLength: 0,
    altMinLength: null,
    altMaxLength: null
  };
}
function addLength(left, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return Number.POSITIVE_INFINITY;
  }
  return left + right;
}
function multiplyLength(length, factor) {
  if (!Number.isFinite(length)) {
    return factor === 0 ? 0 : Number.POSITIVE_INFINITY;
  }
  return length * factor;
}
function recordAlternative(frame) {
  if (frame.altMinLength === null || frame.altMaxLength === null) {
    frame.altMinLength = frame.branchMinLength;
    frame.altMaxLength = frame.branchMaxLength;
    return;
  }
  frame.altMinLength = Math.min(frame.altMinLength, frame.branchMinLength);
  frame.altMaxLength = Math.max(frame.altMaxLength, frame.branchMaxLength);
}
function readQuantifier(source, index) {
  const ch = source[index];
  const consumed = source[index + 1] === "?" ? 2 : 1;
  if (ch === "*") {
    return { consumed, minRepeat: 0, maxRepeat: null };
  }
  if (ch === "+") {
    return { consumed, minRepeat: 1, maxRepeat: null };
  }
  if (ch === "?") {
    return { consumed, minRepeat: 0, maxRepeat: 1 };
  }
  if (ch !== "{") {
    return null;
  }
  let i = index + 1;
  while (i < source.length && /\d/.test(source.charAt(i))) {
    i += 1;
  }
  if (i === index + 1) {
    return null;
  }
  const minRepeat = Number.parseInt(source.slice(index + 1, i), 10);
  let maxRepeat = minRepeat;
  if (source[i] === ",") {
    i += 1;
    const maxStart = i;
    while (i < source.length && /\d/.test(source.charAt(i))) {
      i += 1;
    }
    maxRepeat = i === maxStart ? null : Number.parseInt(source.slice(maxStart, i), 10);
  }
  if (source[i] !== "}") {
    return null;
  }
  i += 1;
  if (source[i] === "?") {
    i += 1;
  }
  if (maxRepeat !== null && maxRepeat < minRepeat) {
    return null;
  }
  return { consumed: i - index, minRepeat, maxRepeat };
}
function tokenizePattern(source) {
  const tokens = [];
  let inCharClass = false;
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (inCharClass) {
      if (ch === "\\") {
        i += 1;
        continue;
      }
      if (ch === "]") {
        inCharClass = false;
      }
      continue;
    }
    if (ch === "\\") {
      i += 1;
      tokens.push({ kind: "simple-token" });
      continue;
    }
    if (ch === "[") {
      inCharClass = true;
      tokens.push({ kind: "simple-token" });
      continue;
    }
    if (ch === "(") {
      tokens.push({ kind: "group-open" });
      continue;
    }
    if (ch === ")") {
      tokens.push({ kind: "group-close" });
      continue;
    }
    if (ch === "|") {
      tokens.push({ kind: "alternation" });
      continue;
    }
    const quantifier = readQuantifier(source, i);
    if (quantifier) {
      tokens.push({ kind: "quantifier", quantifier });
      i += quantifier.consumed - 1;
      continue;
    }
    tokens.push({ kind: "simple-token" });
  }
  return tokens;
}
function analyzeTokensForNestedRepetition(tokens) {
  const frames = [createParseFrame()];
  const emitToken = (token) => {
    const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
    frame.lastToken = token;
    if (token.containsRepetition) {
      frame.containsRepetition = true;
    }
    frame.branchMinLength = addLength(frame.branchMinLength, token.minLength);
    frame.branchMaxLength = addLength(frame.branchMaxLength, token.maxLength);
  };
  const emitSimpleToken = () => {
    emitToken({
      containsRepetition: false,
      hasAmbiguousAlternation: false,
      minLength: 1,
      maxLength: 1
    });
  };
  for (const token of tokens) {
    if (token.kind === "simple-token") {
      emitSimpleToken();
      continue;
    }
    if (token.kind === "group-open") {
      frames.push(createParseFrame());
      continue;
    }
    if (token.kind === "group-close") {
      if (frames.length > 1) {
        const frame2 = frames.pop();
        if (frame2.hasAlternation) {
          recordAlternative(frame2);
        }
        const groupMinLength = frame2.hasAlternation ? frame2.altMinLength ?? 0 : frame2.branchMinLength;
        const groupMaxLength = frame2.hasAlternation ? frame2.altMaxLength ?? 0 : frame2.branchMaxLength;
        emitToken({
          containsRepetition: frame2.containsRepetition,
          hasAmbiguousAlternation: frame2.hasAlternation && frame2.altMinLength !== null && frame2.altMaxLength !== null && frame2.altMinLength !== frame2.altMaxLength,
          minLength: groupMinLength,
          maxLength: groupMaxLength
        });
      }
      continue;
    }
    if (token.kind === "alternation") {
      const frame2 = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
      frame2.hasAlternation = true;
      recordAlternative(frame2);
      frame2.branchMinLength = 0;
      frame2.branchMaxLength = 0;
      frame2.lastToken = null;
      continue;
    }
    const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
    const previousToken = frame.lastToken;
    if (!previousToken) {
      continue;
    }
    if (previousToken.containsRepetition) {
      return true;
    }
    if (previousToken.hasAmbiguousAlternation && token.quantifier.maxRepeat === null) {
      return true;
    }
    const previousMinLength = previousToken.minLength;
    const previousMaxLength = previousToken.maxLength;
    previousToken.minLength = multiplyLength(previousToken.minLength, token.quantifier.minRepeat);
    previousToken.maxLength = token.quantifier.maxRepeat === null ? Number.POSITIVE_INFINITY : multiplyLength(previousToken.maxLength, token.quantifier.maxRepeat);
    previousToken.containsRepetition = true;
    frame.containsRepetition = true;
    frame.branchMinLength = frame.branchMinLength - previousMinLength + previousToken.minLength;
    const branchMaxBase = Number.isFinite(frame.branchMaxLength) && Number.isFinite(previousMaxLength) ? frame.branchMaxLength - previousMaxLength : Number.POSITIVE_INFINITY;
    frame.branchMaxLength = addLength(branchMaxBase, previousToken.maxLength);
  }
  return false;
}
function hasNestedRepetition(source) {
  return analyzeTokensForNestedRepetition(tokenizePattern(source));
}
function compileSafeRegexDetailed(source, flags = "") {
  const trimmed = source.trim();
  if (!trimmed) {
    return { regex: null, source: trimmed, flags, reason: "empty" };
  }
  const cacheKey = `${flags}::${trimmed}`;
  if (safeRegexCache.has(cacheKey)) {
    return safeRegexCache.get(cacheKey) ?? {
      regex: null,
      source: trimmed,
      flags,
      reason: "invalid-regex"
    };
  }
  let result;
  if (hasNestedRepetition(trimmed)) {
    result = { regex: null, source: trimmed, flags, reason: "unsafe-nested-repetition" };
  } else {
    try {
      result = { regex: new RegExp(trimmed, flags), source: trimmed, flags, reason: null };
    } catch {
      result = { regex: null, source: trimmed, flags, reason: "invalid-regex" };
    }
  }
  safeRegexCache.set(cacheKey, result);
  if (safeRegexCache.size > SAFE_REGEX_CACHE_MAX) {
    const oldestKey = safeRegexCache.keys().next().value;
    if (oldestKey) {
      safeRegexCache.delete(oldestKey);
    }
  }
  return result;
}
var SAFE_REGEX_CACHE_MAX, safeRegexCache;
var init_safe_regex = __esm({
  "src/security/safe-regex.ts"() {
    "use strict";
    init_src();
    SAFE_REGEX_CACHE_MAX = 256;
    safeRegexCache = /* @__PURE__ */ new Map();
  }
});

// src/security/config-regex.ts
function normalizeRejectReason(result) {
  if (result.reason === null || result.reason === "empty") {
    return null;
  }
  return result.reason;
}
function compileConfigRegex(pattern, flags = "") {
  const result = compileSafeRegexDetailed(pattern, flags);
  if (result.reason === "empty") {
    return null;
  }
  return {
    regex: result.regex,
    pattern: result.source,
    flags: result.flags,
    reason: normalizeRejectReason(result)
  };
}
var init_config_regex = __esm({
  "src/security/config-regex.ts"() {
    "use strict";
    init_safe_regex();
  }
});

// src/logging/redact-bounded.ts
function replacePatternBounded(text, pattern, replacer, options) {
  const chunkThreshold = options?.chunkThreshold ?? REDACT_REGEX_CHUNK_THRESHOLD;
  const chunkSize = options?.chunkSize ?? REDACT_REGEX_CHUNK_SIZE;
  if (chunkThreshold <= 0 || chunkSize <= 0 || text.length <= chunkThreshold) {
    return text.replace(pattern, replacer);
  }
  let output = "";
  for (let index = 0; index < text.length; index += chunkSize) {
    output += text.slice(index, index + chunkSize).replace(pattern, replacer);
  }
  return output;
}
var REDACT_REGEX_CHUNK_THRESHOLD, REDACT_REGEX_CHUNK_SIZE;
var init_redact_bounded = __esm({
  "src/logging/redact-bounded.ts"() {
    "use strict";
    REDACT_REGEX_CHUNK_THRESHOLD = 32768;
    REDACT_REGEX_CHUNK_SIZE = 16384;
  }
});

// src/logging/redact-internal-state.ts
var init_redact_internal_state = __esm({
  "src/logging/redact-internal-state.ts"() {
    "use strict";
  }
});

// src/logging/redact-internal.ts
var init_redact_internal = __esm({
  "src/logging/redact-internal.ts"() {
    "use strict";
    init_redact_internal_state();
  }
});

// src/logging/secret-redaction-registry.ts
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function rebuildProbe() {
  firstChars = new Set([...registeredValues.keys()].map((value) => value.charAt(0)));
  compiledMatcher = void 0;
}
function hasRegisteredSecretValuesForRedaction() {
  return registeredValues.size > 0;
}
function redactRegisteredSecretValues(text, mask) {
  if (!text || registeredValues.size === 0) {
    return text;
  }
  let couldMatch = false;
  for (const firstChar of firstChars) {
    if (text.includes(firstChar)) {
      couldMatch = true;
      break;
    }
  }
  if (!couldMatch) {
    return text;
  }
  compiledMatcher ??= new RegExp(
    [...registeredValues.keys()].toSorted((left, right) => right.length - left.length).map(escapeRegExp).join("|"),
    "g"
  );
  return text.replace(compiledMatcher, (value) => mask(value));
}
function resetSecretRedactionRegistryForTest() {
  registeredValues.clear();
  rebuildProbe();
}
var registeredValues, compiledMatcher, firstChars;
var init_secret_redaction_registry = __esm({
  "src/logging/secret-redaction-registry.ts"() {
    "use strict";
    registeredValues = /* @__PURE__ */ new Map();
    firstChars = /* @__PURE__ */ new Set();
    if (process.env.VITEST || process.env.NODE_ENV === "test") {
      globalThis[/* @__PURE__ */ Symbol.for("openclaw.secretRedactionRegistryTestApi")] = { resetSecretRedactionRegistryForTest };
    }
  }
});

// src/logging/redact.ts
function normalizeMode(value) {
  return value === "off" ? "off" : DEFAULT_REDACT_MODE;
}
function parsePattern(raw) {
  let pattern = null;
  if (raw instanceof RegExp) {
    if (raw.flags.includes("g")) {
      pattern = raw;
    } else {
      pattern = new RegExp(raw.source, `${raw.flags}g`);
    }
  } else if (raw.trim()) {
    const match = raw.match(/^\/(.+)\/([gimsuy]*)$/);
    if (match) {
      const flags = expectDefined(match[2], "redact regex capture 2").includes("g") ? match[2] : `${match[2]}g`;
      pattern = compileConfigRegex(expectDefined(match[1], "redact regex capture 1"), flags)?.regex ?? null;
    } else {
      pattern = compileConfigRegex(raw, "gi")?.regex ?? null;
    }
  }
  if (pattern && typeof raw === "string" && SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES.has(raw)) {
    shellReferencePreservingPatterns.add(pattern);
  }
  if (pattern && typeof raw === "string" && (raw.startsWith(BASE64_SAFE_TOKEN_BOUNDARY) || raw.startsWith(IDENTIFIER_SAFE_TOKEN_BOUNDARY) || CHUNK_UNSAFE_PATTERN_SOURCES.has(raw))) {
    chunkUnsafePatterns.add(pattern);
  }
  return pattern;
}
function resolvePatterns(value) {
  if (!value?.length) {
    defaultResolvedPatterns ??= DEFAULT_REDACT_PATTERNS.map(parsePattern).filter(
      (re) => Boolean(re)
    );
    return defaultResolvedPatterns;
  }
  return value.map(parsePattern).filter((re) => Boolean(re));
}
function includesDefaultRedactPatterns(value) {
  if (!value?.length) {
    return true;
  }
  const source = new Set(value.filter((pattern) => typeof pattern === "string"));
  return DEFAULT_REDACT_PATTERNS.every((pattern) => source.has(pattern));
}
function maskToken(token) {
  if (token === "***") {
    return token;
  }
  if (token.length < DEFAULT_REDACT_MIN_LENGTH) {
    return "***";
  }
  const start = sliceUtf16Safe(token, 0, DEFAULT_REDACT_KEEP_START);
  const end = sliceUtf16Safe(token, -DEFAULT_REDACT_KEEP_END);
  return `${start}\u2026${end}`;
}
function splitSecretValueForMask(token) {
  const openingQuote = token[0] ?? "";
  if (SECRET_VALUE_QUOTE_CHARS.has(openingQuote)) {
    const closingQuoteIndex = token.lastIndexOf(openingQuote);
    if (closingQuoteIndex > 0) {
      const suffix = token.slice(closingQuoteIndex + 1);
      if (SECRET_VALUE_SUFFIX_RE.test(suffix)) {
        return {
          maskable: token.slice(1, closingQuoteIndex),
          suffix,
          maskStart: 0,
          maskEnd: closingQuoteIndex + 1
        };
      }
    }
    const tokenWithoutLeadingQuote = token.slice(1);
    const trailingDelimiter2 = tokenWithoutLeadingQuote.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
    const maskable2 = trailingDelimiter2 && trailingDelimiter2.length < tokenWithoutLeadingQuote.length ? tokenWithoutLeadingQuote.slice(0, -trailingDelimiter2.length) : tokenWithoutLeadingQuote;
    return {
      maskable: maskable2,
      suffix: trailingDelimiter2 && trailingDelimiter2.length < tokenWithoutLeadingQuote.length ? trailingDelimiter2 : "",
      maskStart: 0,
      maskEnd: 1 + maskable2.length
    };
  }
  const trailingDelimiter = token.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
  const maskable = trailingDelimiter && trailingDelimiter.length < token.length ? token.slice(0, -trailingDelimiter.length) : token;
  return {
    maskable,
    suffix: maskable === token ? "" : trailingDelimiter,
    maskStart: 0,
    maskEnd: maskable.length
  };
}
function maskSecretValue(token, options) {
  const { maskable, suffix } = splitSecretValueForMask(token);
  return `${options?.hinted ? maskToken(maskable) : "***"}${suffix}`;
}
function normalizeSensitiveKeyName(value) {
  const stripped = value.replace(FORM_BODY_KEY_SEPARATOR_RE, "");
  try {
    return decodeURIComponent(stripped).replace(FORM_BODY_KEY_SEPARATOR_RE, "").toLowerCase().replaceAll("-", "_");
  } catch {
    return stripped.toLowerCase().replaceAll("-", "_");
  }
}
function isSensitiveBodyKey(key) {
  return BODY_SECRET_KEYS.has(normalizeSensitiveKeyName(key));
}
function hasEncodedOrInvisibleFormKey(key) {
  return FORM_BODY_PERCENT_ESCAPE_RE.test(key) || key.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") !== key;
}
function redactFormEncodedPairs(value, options) {
  return value.split("&").map((pair) => {
    const equalsIndex = pair.indexOf("=");
    if (equalsIndex < 0) {
      return pair;
    }
    const key = pair.slice(0, equalsIndex);
    if (options?.onlyEncodedOrInvisibleKeys && !hasEncodedOrInvisibleFormKey(key)) {
      return pair;
    }
    if (!isSensitiveBodyKey(key)) {
      return pair;
    }
    const token = pair.slice(equalsIndex + 1);
    const masked = maskSecretValue(token, { hinted: options?.maskValues === "hinted" });
    return `${key}=${masked}`;
  }).join("&");
}
function redactUrlQueryPairs(text) {
  if (!text || !text.includes("?")) {
    return text;
  }
  return text.replace(URL_QUERY_PAIR_RE, (match, prefix, key, token) => {
    if (!hasEncodedOrInvisibleFormKey(key) || !isSensitiveBodyKey(key)) {
      return match;
    }
    return `${prefix}${key}=${maskSecretValue(token, { hinted: true })}`;
  });
}
function redactEncodedFormPairs(text) {
  if (!text || !text.includes("%") && text.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") === text) {
    return text;
  }
  return text.replace(ENCODED_FORM_PAIR_RE, (match, prefix, key, token) => {
    if (!hasEncodedOrInvisibleFormKey(key) || !isSensitiveBodyKey(key)) {
      return match;
    }
    return `${prefix}${key}=${maskSecretValue(token)}`;
  });
}
function redactFormBodyContextSinglePairs(text) {
  if (!text || !/[=:]/u.test(text)) {
    return text;
  }
  return text.replace(
    FORM_BODY_CONTEXT_SINGLE_PAIR_RE,
    (match, prefix, _quote, key, token, suffix) => {
      if (!isSensitiveBodyKey(key)) {
        return match;
      }
      return `${prefix}${key}=${maskSecretValue(token)}${suffix}`;
    }
  );
}
function redactFormBodyLine(text) {
  if (!text) {
    return text;
  }
  const contextRedacted = redactFormBodyContextSinglePairs(redactEncodedFormPairs(text));
  if (!contextRedacted.includes("&")) {
    return contextRedacted;
  }
  if (FORM_BODY_RE.test(contextRedacted)) {
    return redactFormEncodedPairs(contextRedacted);
  }
  const redacted = contextRedacted.replace(
    FORM_BODY_SUBSTRING_RE,
    (match, prefix, body) => {
      const redactedBody = redactFormEncodedPairs(body);
      return redactedBody === body ? match : `${prefix}${redactedBody}`;
    }
  );
  return redactFormBodyContextSinglePairs(redactEncodedFormPairs(redacted));
}
function redactFormBody(text) {
  if (!text) {
    return text;
  }
  if (FORM_BODY_LINE_BREAK_SPLIT_RE.test(text)) {
    return text.split(FORM_BODY_LINE_BREAK_SPLIT_RE).map(
      (segment) => FORM_BODY_LINE_BREAK_SEGMENT_RE.test(segment) ? segment : redactFormBodyLine(segment)
    ).join("");
  }
  return redactFormBodyLine(text);
}
function redactPemBlock(block) {
  const lines = block.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    return "***";
  }
  return `${lines[0]}
\u2026redacted\u2026
${lines[lines.length - 1]}`;
}
function isShellReferenceToKey(key, value) {
  if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) {
    return false;
  }
  const bare = value.match(/^\$([A-Z_][A-Z0-9_]*)$/);
  if (bare) {
    return bare[1] === key;
  }
  const braced = value.match(/^\$\{([A-Z_][A-Z0-9_]*)(?::[-=?+])?\}$/);
  return braced?.[1] === key;
}
function readEnvAssignmentKey(match) {
  return match.match(/\b([A-Z_][A-Z0-9_]*)\b\s*[=:]/)?.[1];
}
function shouldPreserveShellReferenceMatch(match, token) {
  const key = readEnvAssignmentKey(match);
  return key ? isShellReferenceToKey(key, token) : false;
}
function isEmptyShellParameterExpansionTail(token) {
  return /^[-=?+]\}$/.test(token);
}
function hasBackreferenceToGroup(pattern, groupNumber) {
  return new RegExp(String.raw`\\${groupNumber}(?!\d)`).test(pattern.source);
}
function selectSecretCapture(match, groups) {
  const tokens = groups.map((value, index) => ({ index, value })).filter(({ value }) => typeof value === "string" && value.length > 0);
  const selected = (tokens.length > 1 ? tokens[tokens.length - 1] : tokens[0]) ?? {
    index: -1,
    value: match
  };
  return {
    ...selected,
    captureCount: tokens.length
  };
}
function getIndexedCaptureStart(pattern, input, match, matchOffset, captureIndex) {
  if (matchOffset < 0 || !input) {
    return null;
  }
  try {
    const flags = pattern.flags.includes("d") ? pattern.flags : `${pattern.flags}d`;
    const indexedPattern = new RegExp(pattern.source, flags);
    indexedPattern.lastIndex = matchOffset;
    const indexedMatch = indexedPattern.exec(input);
    const captureIndices = indexedMatch?.indices?.[captureIndex + 1];
    if (!indexedMatch || indexedMatch.index !== matchOffset || indexedMatch[0] !== match) {
      return null;
    }
    if (!captureIndices) {
      return null;
    }
    return captureIndices[0] - matchOffset;
  } catch {
    return null;
  }
}
function getSecretCaptureStart(pattern, input, match, matchOffset, selected) {
  const indexedTokenStart = getIndexedCaptureStart(
    pattern,
    input,
    match,
    matchOffset,
    selected.index
  );
  const preferFirstCapture = selected.captureCount === 1 && selected.index >= 0 && hasBackreferenceToGroup(pattern, selected.index + 1);
  return indexedTokenStart ?? (preferFirstCapture ? match.indexOf(selected.value) : match.lastIndexOf(selected.value));
}
function redactMatch(match, groups, pattern, context) {
  if (match.includes("PRIVATE KEY-----")) {
    return redactPemBlock(match);
  }
  const selected = selectSecretCapture(match, groups);
  const token = selected.value;
  if (splitSecretValueForMask(token).maskable === "***") {
    return match;
  }
  const isShellReferencePattern = shellReferencePreservingPatterns.has(pattern);
  if (isShellReferencePattern && (shouldPreserveShellReferenceMatch(match, token) || isEmptyShellParameterExpansionTail(token))) {
    return match;
  }
  const masked = isShellReferencePattern ? maskToken(token) : maskSecretValue(token, { hinted: true });
  if (token === match) {
    return masked;
  }
  const tokenIndex = getSecretCaptureStart(
    pattern,
    context?.input ?? "",
    match,
    context?.offset ?? -1,
    selected
  );
  if (tokenIndex < 0) {
    return match;
  }
  return `${match.slice(0, tokenIndex)}${masked}${match.slice(tokenIndex + token.length)}`;
}
function redactText(text, patterns, options) {
  let next = text;
  if (options?.redactStructuredAuthHeaders) {
    next = redactStructuredAuthHeaders(next, "***");
  }
  if (options?.redactFormBodies) {
    next = redactUrlQueryPairs(next);
    next = redactFormBody(next);
  }
  for (const pattern of patterns) {
    const replacer = (...args) => {
      const hasNamedGroups = args.length > 0 && typeof args[args.length - 1] === "object" && args[args.length - 1] !== null;
      const inputIndex = hasNamedGroups ? args.length - 2 : args.length - 1;
      const offsetIndex = inputIndex - 1;
      const match = typeof args[0] === "string" ? args[0] : "";
      const groups = args.slice(1, offsetIndex).map((value) => typeof value === "string" ? value : "");
      const offset = typeof args[offsetIndex] === "number" ? args[offsetIndex] : -1;
      const input = typeof args[inputIndex] === "string" ? args[inputIndex] : "";
      return redactMatch(match, groups, pattern, { input, offset });
    };
    next = options?.fullContext || chunkUnsafePatterns.has(pattern) ? next.replace(pattern, replacer) : replacePatternBounded(next, pattern, replacer);
  }
  return next;
}
function couldMatchDefaultRedactPatterns(text) {
  return DEFAULT_REDACT_PREFILTER_RE.test(text);
}
function looksLikeAppSpecificPassword(candidate) {
  return candidate.split("-").every((part) => !BENIGN_APP_PASSWORD_WORDS.has(part.toLowerCase()));
}
function redactAppSpecificPasswords(text) {
  return replacePatternBounded(
    text,
    APP_SPECIFIC_PASSWORD_RE,
    (match, token) => looksLikeAppSpecificPassword(token) ? redactMatch(match, [token], APP_SPECIFIC_PASSWORD_RE) : match
  );
}
function resolveConfigRedaction() {
  const cfg = readLoggingConfig();
  return {
    mode: normalizeMode(cfg?.redactSensitive),
    patterns: cfg?.redactPatterns
  };
}
function resolveRedactOptions(options) {
  const resolved = options ?? resolveConfigRedaction();
  const mode = normalizeMode(resolved.mode);
  if (mode === "off") {
    return {
      mode,
      patterns: [],
      redactFormBodies: false
    };
  }
  const patterns = resolvePatterns(resolved.patterns);
  const includesDefaults = patterns.length > 0 && includesDefaultRedactPatterns(resolved.patterns);
  return {
    mode,
    patterns,
    redactFormBodies: includesDefaults,
    redactStructuredAuthHeaders: includesDefaults
  };
}
function redactSensitiveText2(text, options) {
  if (!text) {
    return text;
  }
  const exactRedacted = redactRegisteredSecretValues(text, maskToken);
  const resolvedOptions = options ?? resolveConfigRedaction();
  if (normalizeMode(resolvedOptions.mode) === "off") {
    return exactRedacted;
  }
  if (!resolvedOptions.patterns?.length && !couldMatchDefaultRedactPatterns(exactRedacted)) {
    return exactRedacted;
  }
  const resolved = resolveRedactOptions(resolvedOptions);
  if (!resolved.patterns.length) {
    return exactRedacted;
  }
  return redactText(exactRedacted, resolved.patterns, {
    redactFormBodies: resolved.redactFormBodies,
    redactStructuredAuthHeaders: resolved.redactStructuredAuthHeaders
  });
}
function resolveToolPayloadRedaction(loggingConfig = readLoggingConfig()) {
  const userPatterns = loggingConfig?.redactPatterns;
  const patterns = userPatterns && userPatterns.length > 0 ? [...userPatterns, ...DEFAULT_REDACT_PATTERNS] : void 0;
  return { mode: "tools", patterns };
}
function isSensitiveFieldKey(key) {
  return STRUCTURED_SECRET_FIELD_RE.test(key) || STRUCTURED_SECRET_ENV_FIELD_RE.test(key);
}
function redactSensitiveFieldValueWithOptions(key, value, options, path16 = [key]) {
  const exactRedacted = redactRegisteredSecretValues(value, maskToken);
  const resolved = resolveRedactOptions(options);
  if (resolved.mode === "off") {
    return exactRedacted;
  }
  const redacted = redactText(exactRedacted, resolved.patterns, {
    redactFormBodies: resolved.redactFormBodies,
    redactStructuredAuthHeaders: resolved.redactStructuredAuthHeaders
  });
  const shouldRedactAppPassword = redacted !== value || STRUCTURED_APP_PASSWORD_FIELD_RE.test(key);
  if (shouldRedactAppPassword) {
    const appRedacted = redactAppSpecificPasswords(redacted);
    if (appRedacted !== value) {
      return appRedacted;
    }
  }
  if (redacted !== value) {
    return redacted;
  }
  const normalizedStructuredKey = key.toLowerCase();
  if (shouldRedactStructuredAuthorizationCode(normalizedStructuredKey, path16)) {
    return maskToken(value);
  }
  if (normalizedStructuredKey === "session" && STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE.test(exactRedacted)) {
    return exactRedacted;
  }
  if (isSensitiveFieldKey(key)) {
    if (isShellReferenceToKey(key, exactRedacted)) {
      return exactRedacted;
    }
    return maskToken(exactRedacted);
  }
  return exactRedacted;
}
function pathEndsWith(path16, suffix) {
  if (path16.length < suffix.length) {
    return false;
  }
  return suffix.every((part, index) => path16[path16.length - suffix.length + index] === part);
}
function shouldRedactStructuredAuthorizationCode(normalizedKey, path16) {
  if (normalizedKey !== "code") {
    return false;
  }
  const normalizedPath = path16.map((part) => part.toLowerCase());
  if (normalizedPath.length === 1 || pathEndsWith(normalizedPath, ["error", "code"]) || pathEndsWith(normalizedPath, ["nodeerror", "code"]) || pathEndsWith(normalizedPath, ["status", "code"]) || pathEndsWith(normalizedPath, ["details", "code"]) || pathEndsWith(normalizedPath, ["warnings", "code"])) {
    return false;
  }
  return true;
}
function shouldRedactStructuredPrimitiveField(key, path16) {
  const normalizedKey = key.toLowerCase();
  return shouldRedactStructuredAuthorizationCode(normalizedKey, path16) || isSensitiveFieldKey(key);
}
function isPlainRedactableObject(value) {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function redactStructuredSecretValue(key, value, seen, options, path16 = key ? [key] : []) {
  if (typeof value === "string") {
    return redactSensitiveFieldValueWithOptions(key, value, options, path16);
  }
  if (value === null || value === void 0) {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return shouldRedactStructuredPrimitiveField(key, path16) ? "***" : value;
  }
  if (Array.isArray(value)) {
    if (seen.has(value)) {
      return "[Circular]";
    }
    seen.add(value);
    const out = value.map((entry) => redactStructuredSecretValue(key, entry, seen, options, path16));
    seen.delete(value);
    return out;
  }
  if (typeof value === "object") {
    if (seen.has(value)) {
      return "[Circular]";
    }
    if (!isPlainRedactableObject(value)) {
      return value;
    }
    seen.add(value);
    const out = {};
    for (const [nestedKey, nestedValue] of Object.entries(value)) {
      out[nestedKey] = redactStructuredSecretValue(nestedKey, nestedValue, seen, options, [
        ...path16,
        nestedKey
      ]);
    }
    seen.delete(value);
    return out;
  }
  return value;
}
function redactSecrets(value) {
  const options = resolveToolPayloadRedaction();
  if (typeof value === "string") {
    return redactSensitiveText2(value, options);
  }
  if (value === null || value === void 0) {
    return value;
  }
  if (typeof value !== "object") {
    return value;
  }
  return redactStructuredSecretValue("", value, /* @__PURE__ */ new WeakSet(), options);
}
var DEFAULT_REDACT_MODE, DEFAULT_REDACT_MIN_LENGTH, DEFAULT_REDACT_KEEP_START, DEFAULT_REDACT_KEEP_END, PAYMENT_CREDENTIAL_ENV_KEYS, PAYMENT_CREDENTIAL_QUERY_KEYS, AUTH_QUERY_KEYS, FORM_BODY_FIRST_PAIR_KEYS, STANDALONE_ASSIGNMENT_SECRET_KEYS, BODY_SECRET_KEYS, FORM_BODY_KEY_INVISIBLE_CHARS, FORM_BODY_KEY_OBFUSCATION_RE, FORM_BODY_KEY_SEPARATOR_RE, FORM_BODY_PERCENT_ESCAPE_RE, FORM_BODY_KEY, FORM_BODY_VALUE, URL_QUERY_VALUE, FORM_BODY_PAIR, FORM_BODY_RE, FORM_BODY_SUBSTRING_RE, ENCODED_FORM_PAIR_RE, FORM_BODY_CONTEXT_SINGLE_PAIR_RE, URL_QUERY_PAIR_RE, SECRET_VALUE_TRAILING_DELIMITER_RE, SECRET_VALUE_SUFFIX_RE, SECRET_VALUE_QUOTE_CHARS, FORM_BODY_LINE_BREAK_SPLIT_RE, FORM_BODY_LINE_BREAK_SEGMENT_RE, PAYMENT_CREDENTIAL_JSON_KEYS, STRUCTURED_SECRET_FIELD_RE, STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE, STRUCTURED_APP_PASSWORD_FIELD_RE, APP_SPECIFIC_PASSWORD_RE, BENIGN_APP_PASSWORD_WORDS, STRUCTURED_SECRET_ENV_FIELD_RE, ENV_ASSIGNMENT_REDACT_PATTERN, ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN, STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN, STANDALONE_ASSIGNMENT_REDACT_PATTERN, BASE64_SAFE_TOKEN_BOUNDARY, IDENTIFIER_SAFE_TOKEN_BOUNDARY, TELEGRAM_BOT_TOKEN_REDACT_PATTERN, TELEGRAM_TOKEN_REDACT_PATTERN, HTTP_AUTH_HEADER_REDACT_PATTERNS, AUTHORIZATION_BEARER_REDACT_PATTERN, AUTHORIZATION_BASIC_REDACT_PATTERN, AUTHORIZATION_BOT_REDACT_PATTERN, STANDALONE_BEARER_REDACT_PATTERN, SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES, CHUNK_UNSAFE_PATTERN_SOURCES, shellReferencePreservingPatterns, chunkUnsafePatterns, DEFAULT_REDACT_PATTERNS, defaultResolvedPatterns, DEFAULT_REDACT_PREFILTER_SOURCES, DEFAULT_REDACT_PREFILTER_RE;
var init_redact = __esm({
  "src/logging/redact.ts"() {
    "use strict";
    init_src2();
    init_src();
    init_utf16_slice();
    init_config_regex();
    init_config();
    init_redact_bounded();
    init_redact_internal();
    init_secret_redaction_registry();
    DEFAULT_REDACT_MODE = "tools";
    DEFAULT_REDACT_MIN_LENGTH = 18;
    DEFAULT_REDACT_KEEP_START = 6;
    DEFAULT_REDACT_KEEP_END = 4;
    PAYMENT_CREDENTIAL_ENV_KEYS = String.raw`CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN`;
    PAYMENT_CREDENTIAL_QUERY_KEYS = String.raw`card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token`;
    AUTH_QUERY_KEYS = String.raw`access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|id[-_]?token|api[-_]?key|apikey|client[-_]?secret|app[-_]?secret|private[-_]?key|credential|authorization|token|key|secret|password|pass|passwd|auth|jwt|session|code|signature|x[-_]?amz[-_]?(?:signature|security[-_]?token)`;
    FORM_BODY_FIRST_PAIR_KEYS = String.raw`${AUTH_QUERY_KEYS}|app[-_]?secret|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
    STANDALONE_ASSIGNMENT_SECRET_KEYS = String.raw`access_token|refresh_token|id_token|auth[-_]?token|hook[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|private[-_]?key|authorization|jwt|token|secret|password|pass|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
    BODY_SECRET_KEYS = /* @__PURE__ */ new Set([
      "access_token",
      "auth_token",
      "hook_token",
      "refresh_token",
      "id_token",
      "token",
      "api_key",
      "apikey",
      "client_secret",
      "app_secret",
      "password",
      "pass",
      "passwd",
      "auth",
      "jwt",
      "session",
      "code",
      "signature",
      "x_amz_signature",
      "x_amz_security_token",
      "secret",
      "credential",
      "private_key",
      "authorization",
      "key",
      "card_number",
      "card_cvc",
      "card_cvv",
      "cvc",
      "cvv",
      "security_code",
      "payment_credential",
      "shared_payment_token"
    ]);
    FORM_BODY_KEY_INVISIBLE_CHARS = String.raw`\p{C}\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\u115F\u1160\u3164\uFFA0`;
    FORM_BODY_KEY_OBFUSCATION_RE = new RegExp(
      String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]`,
      "gu"
    );
    FORM_BODY_KEY_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
    FORM_BODY_PERCENT_ESCAPE_RE = /%[0-9A-Fa-f]{2}/u;
    FORM_BODY_KEY = String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*(?:[A-Za-z_]|%[0-9A-Fa-f]{2})(?:[A-Za-z0-9_.-]|%[0-9A-Fa-f]{2}|[${FORM_BODY_KEY_INVISIBLE_CHARS}+])*`;
    FORM_BODY_VALUE = "[^&\\s<>]*";
    URL_QUERY_VALUE = "[^&#\\s<>]*";
    FORM_BODY_PAIR = String.raw`${FORM_BODY_KEY}=${FORM_BODY_VALUE}`;
    FORM_BODY_RE = new RegExp(String.raw`^${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+$`, "u");
    FORM_BODY_SUBSTRING_RE = new RegExp(
      String.raw`(^|[\s:({\[,="'` + "`" + String.raw`])(${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+)`,
      "gu"
    );
    ENCODED_FORM_PAIR_RE = new RegExp(
      String.raw`(^|[\s:({\[,="'` + "`" + String.raw`&])(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})`,
      "gu"
    );
    FORM_BODY_CONTEXT_SINGLE_PAIR_RE = new RegExp(
      String.raw`(\b(?:body|form(?:[-_\s]?body)?)\s*[:=]\s*(["'\x60]?))(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})(["'\x60]?)`,
      "giu"
    );
    URL_QUERY_PAIR_RE = new RegExp(
      String.raw`([?&])(${FORM_BODY_KEY})=(${URL_QUERY_VALUE})`,
      "gu"
    );
    SECRET_VALUE_TRAILING_DELIMITER_RE = /(["'`,;)}\]]+)$/u;
    SECRET_VALUE_SUFFIX_RE = /^["'`,;)}\]]*$/u;
    SECRET_VALUE_QUOTE_CHARS = /* @__PURE__ */ new Set(['"', "'", "`"]);
    FORM_BODY_LINE_BREAK_SPLIT_RE = /(\r\n|\r|\n)/u;
    FORM_BODY_LINE_BREAK_SEGMENT_RE = /^(?:\r\n|\r|\n)$/u;
    PAYMENT_CREDENTIAL_JSON_KEYS = String.raw`cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token`;
    STRUCTURED_SECRET_FIELD_RE = new RegExp(
      String.raw`^(?:api[-_]?key|apiKey|api[-_]?token|apiToken|bearer[-_]?token|bearerToken|token|secret|password|passwd|credential|authorization|private[-_]?key|privateKey|access[-_]?token|accessToken|refresh[-_]?token|refreshToken|id[-_]?token|idToken|auth[-_]?token|authToken|client[-_]?secret|clientSecret|app[-_]?secret|appSecret|secret[-_]?value|secretValue|raw[-_]?secret|rawSecret|secret[-_]?input|secretInput|key|key[-_]?material|keyMaterial|jwt|session|signature|cookie|set[-_]?cookie|${PAYMENT_CREDENTIAL_QUERY_KEYS}|${PAYMENT_CREDENTIAL_JSON_KEYS})$`,
      "i"
    );
    STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE = /^\$WORKSPACE_DIR\/[A-Za-z0-9._/-]+\.jsonl$/u;
    STRUCTURED_APP_PASSWORD_FIELD_RE = /^(?:apple|icloud|app[-_]?specific[-_]?password|appSpecificPassword|application[-_]?password|text|content|message|error|errorMessage|detail|details|reason)$/i;
    APP_SPECIFIC_PASSWORD_RE = /\b([a-z]{4}-[a-z]{4}-[a-z]{4}-[a-z]{4})\b/g;
    BENIGN_APP_PASSWORD_WORDS = /* @__PURE__ */ new Set([
      "case",
      "claw",
      "demo",
      "file",
      "main",
      "name",
      "open",
      "path",
      "slug",
      "test"
    ]);
    STRUCTURED_SECRET_ENV_FIELD_RE = new RegExp(
      String.raw`^(?:(?:[A-Z0-9]+[_-])+(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD)|API[_-]?KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})$`,
      "i"
    );
    ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g`;
    ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g`;
    STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN = String.raw`(^|[\s,;])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60])((?:(?!\2)[^\r\n])+)\2`;
    STANDALONE_ASSIGNMENT_REDACT_PATTERN = String.raw`(^|[\s,;])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60]?[^\s&#"'\x60<>]+)`;
    BASE64_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9])(?<!;base64,[A-Za-z0-9+/=]*)`;
    IDENTIFIER_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9_])`;
    TELEGRAM_BOT_TOKEN_REDACT_PATTERN = String.raw`\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
    TELEGRAM_TOKEN_REDACT_PATTERN = String.raw`\b(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
    HTTP_AUTH_HEADER_REDACT_PATTERNS = [
      String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
      String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
      String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
      String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
      CREDENTIAL_STYLE_HEADER_REDACT_PATTERN
    ];
    AUTHORIZATION_BEARER_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bearer${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
    AUTHORIZATION_BASIC_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Basic${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
    AUTHORIZATION_BOT_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bot${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
    STANDALONE_BEARER_REDACT_PATTERN = String.raw`\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])`;
    SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES = /* @__PURE__ */ new Set([
      ENV_ASSIGNMENT_REDACT_PATTERN,
      ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
      STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
      STANDALONE_ASSIGNMENT_REDACT_PATTERN
    ]);
    CHUNK_UNSAFE_PATTERN_SOURCES = /* @__PURE__ */ new Set([
      TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
      TELEGRAM_TOKEN_REDACT_PATTERN,
      AUTHORIZATION_BEARER_REDACT_PATTERN,
      AUTHORIZATION_BASIC_REDACT_PATTERN,
      AUTHORIZATION_BOT_REDACT_PATTERN,
      STANDALONE_BEARER_REDACT_PATTERN,
      ...HTTP_AUTH_HEADER_REDACT_PATTERNS
    ]);
    shellReferencePreservingPatterns = /* @__PURE__ */ new WeakSet();
    chunkUnsafePatterns = /* @__PURE__ */ new WeakSet();
    DEFAULT_REDACT_PATTERNS = [
      // ENV-style assignments. Keep this case-sensitive so diagnostics like
      // `Unrecognized key: "llm"` do not lose the actual config key.
      ENV_ASSIGNMENT_REDACT_PATTERN,
      ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
      // URL query parameters. Keep this separate from ENV-style assignments so
      // lower-case URL secrets stay redacted without hiding config-key diagnostics.
      String.raw`/[?&](?:${AUTH_QUERY_KEYS}|${PAYMENT_CREDENTIAL_QUERY_KEYS})=([^&#\s<>]+)/gi`,
      // JSON fields.
      String.raw`"(?:apiKey|api_key|apiToken|api_token|bearerToken|bearer_token|token|secret|password|passwd|credential|authorization|accessToken|access_token|refreshToken|refresh_token|idToken|id_token|authToken|auth_token|clientSecret|client_secret|privateKey|private_key|secret_value|raw_secret|secret_input|key_material|${PAYMENT_CREDENTIAL_JSON_KEYS})"\s*:\s*"([^"]+)"`,
      // HTTP client diagnostics often stringify request config objects using
      // JSON or util.inspect-style fields rather than env/CLI syntax.
      String.raw`(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|id[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret|private[-_]key|credential|authorization|secret[-_]value|raw[-_]secret|secret[-_]input|key[-_]material)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,
      String.raw`(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,
      // CLI flags.
      String.raw`--(?:api[-_]?key|hook[-_]?token|access[-_]?token|refresh[-_]?token|id[-_]?token|token|secret|password|passwd|credential|private[-_]?key|client[-_]?secret|${PAYMENT_CREDENTIAL_QUERY_KEYS})\s+(?!(?:or|and)\b(?=\s+--))(["']?)([^\s"']+)\1`,
      // Authorization headers.
      AUTHORIZATION_BEARER_REDACT_PATTERN,
      AUTHORIZATION_BASIC_REDACT_PATTERN,
      AUTHORIZATION_BOT_REDACT_PATTERN,
      ...HTTP_AUTH_HEADER_REDACT_PATTERNS,
      String.raw`(?:X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token)\s*[:=]\s*([^\s"',;]+)`,
      STANDALONE_BEARER_REDACT_PATTERN,
      // URL userinfo and common connection-string password slots.
      String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`,
      String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`,
      // First pair in form-urlencoded bodies embedded in larger log lines.
      String.raw`(^|[\s,;])(?:${FORM_BODY_FIRST_PAIR_KEYS})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`,
      // Standalone token assignments in CLI or HTTP diagnostics. URL query params
      // are handled above so non-secret params survive and long values stay hinted.
      STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
      STANDALONE_ASSIGNMENT_REDACT_PATTERN,
      // PEM blocks.
      String.raw`-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----`,
      // Common token prefixes.
      String.raw`\b(sk-[A-Za-z0-9_-]{8,})\b`,
      String.raw`(ghp_[A-Za-z0-9]{10,})`,
      String.raw`(github_pat_[A-Za-z0-9_]{10,})`,
      String.raw`(gho_[A-Za-z0-9]{10,})`,
      String.raw`(ghu_[A-Za-z0-9]{10,})`,
      String.raw`(ghs_[A-Za-z0-9]{10,})`,
      String.raw`(ghr_[A-Za-z0-9]{10,})`,
      String.raw`(glpat-[A-Za-z0-9._=\-]{20,})`,
      String.raw`(gloas-[A-Fa-f0-9]{32,})`,
      String.raw`(xox[baprs]-[A-Za-z0-9-]{10,})`,
      String.raw`(xapp-[A-Za-z0-9-]{10,})`,
      String.raw`(https:\/\/hooks\.slack\.com\/(?:services\/T[A-Z0-9]+\/B[A-Z0-9]+|workflows\/T[A-Z0-9]+\/A[A-Z0-9]+\/[0-9]{17,19})\/[A-Za-z0-9]{20,})`,
      String.raw`(https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]{17,20}\/[A-Za-z0-9_-]{60,})`,
      String.raw`discord(?:.|\n|\r){0,40}?\b([A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27})\b`,
      String.raw`(gsk_[A-Za-z0-9_-]{10,})`,
      String.raw`(AIza[0-9A-Za-z\-_]{20,})`,
      String.raw`(ya29\.[0-9A-Za-z_\-./+=]{10,})`,
      String.raw`(1//0[0-9A-Za-z_\-./+=]{10,})`,
      String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
      String.raw`(pplx-[A-Za-z0-9_-]{10,})`,
      String.raw`(fal_[A-Za-z0-9_-]{10,})`,
      String.raw`(fc-[A-Za-z0-9]{10,})`,
      String.raw`(bb_live_[A-Za-z0-9_-]{10,})`,
      // Prefixes made only of standard-base64 characters need a non-base64 left boundary so they
      // do not fire inside unrelated base64 blobs (e.g. data-URL media), corrupting the payload.
      String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(gAAAA[A-Za-z0-9_=-]{20,})`,
      String.raw`(sk_live_[A-Za-z0-9]{10,})`,
      String.raw`(sk_test_[A-Za-z0-9]{10,})`,
      String.raw`(rk_live_[A-Za-z0-9]{10,})`,
      String.raw`(SG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
      String.raw`(npm_[A-Za-z0-9]{10,})`,
      String.raw`(pypi-[A-Za-z0-9_-]{10,})`,
      String.raw`(dop_v1_[A-Za-z0-9]{10,})`,
      String.raw`(doo_v1_[A-Za-z0-9]{10,})`,
      String.raw`(dor_v1_[A-Za-z0-9]{10,})`,
      String.raw`(dp\.(?:ct|pt|sa|scim|audit)\.[A-Za-z0-9]{40,44})`,
      String.raw`(dp\.st\.[A-Za-z0-9]{40,44})`,
      String.raw`(dp\.st\.[a-z0-9_-]{2,35}\.[A-Za-z0-9]{40,44})`,
      String.raw`(dckr_(?:pat|oat)_[A-Za-z0-9_-]{27,32})`,
      String.raw`(bkua_[a-z0-9]{40})`,
      String.raw`(CCIPAT_[A-Za-z0-9]{22}_[A-Fa-f0-9]{40})`,
      String.raw`(sbp_[a-z0-9]{40})`,
      String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(dapi[0-9a-f]{32}(?:-\d)?)`,
      String.raw`(dd[pw]_[A-Za-z0-9]{36})`,
      String.raw`(glsa_[A-Za-z0-9_]{41})`,
      String.raw`(glc_eyJ[A-Za-z0-9+/=]{60,160})`,
      String.raw`(nfp_[A-Za-z0-9_]{36})`,
      String.raw`(CFPAT-[A-Za-z0-9_\-]{40,})`,
      String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,
      String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,
      String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATBB[A-Za-z0-9_=.-]{16,})`,
      String.raw`(BBDC-[A-Za-z0-9+/@_-]{40,50})`,
      String.raw`(HRKU-AA[A-Za-z0-9_-]{20,})`,
      String.raw`(pat-(?:eu|na)1-[A-Za-z0-9]{8}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{12})`,
      String.raw`(apify_api_[A-Za-z0-9\-]{20,})`,
      String.raw`(FlyV1 fm\d+_[A-Za-z0-9+/=,_-]{100,})`,
      String.raw`(fio-u-[A-Za-z0-9_-]{40,})`,
      String.raw`(^|[^A-Za-z0-9_])(am_[A-Za-z0-9_-]{10,})`,
      String.raw`(^|[^A-Za-z0-9_])(sk_[A-Za-z0-9_]{10,})`,
      String.raw`(tvly-[A-Za-z0-9]{10,})`,
      String.raw`(exa_[A-Za-z0-9]{10,})`,
      String.raw`(syt_[A-Za-z0-9]{10,})`,
      String.raw`(retaindb_[A-Za-z0-9]{10,})`,
      String.raw`(hsk-[A-Za-z0-9]{10,})`,
      String.raw`(mem0_[A-Za-z0-9]{10,})`,
      String.raw`(brv_[A-Za-z0-9]{10,})`,
      String.raw`(xai-[A-Za-z0-9]{30,})`,
      String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw-[A-Za-z0-9]{30,})`,
      String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw_[A-Za-z0-9]{30,})`,
      String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fpk_[A-Za-z0-9]{30,})`,
      // Additional access-key and token-style prefixes.
      String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(AKIA[A-Z0-9]{16})`,
      String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ASIA[A-Z0-9]{16})`,
      String.raw`(AKID[A-Za-z0-9]{10,})`,
      String.raw`(LTAI[A-Za-z0-9]{10,})`,
      String.raw`(hf_[A-Za-z0-9]{10,})`,
      String.raw`(api_org_[A-Za-z0-9]{20,})`,
      String.raw`(r8_[A-Za-z0-9]{10,})`,
      // Telegram Bot API URLs embed the token as `/bot<token>/...` (no word-boundary before digits).
      TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
      TELEGRAM_TOKEN_REDACT_PATTERN
    ];
    DEFAULT_REDACT_PREFILTER_SOURCES = [
      // Sensitive key names shared by the env/JSON/query/form/header/assignment families.
      String.raw`KEY|TOKEN|SECRET|PASSWORD|PASSWD|AUTH|COOKIE|SIGNATURE|CREDENTIAL|CARD|CVC|CVV|PAYMENT|PRIVATE KEY`,
      String.raw`security[-_]?code|\bpass=|jwt=|session=|code=`,
      String.raw`\bBearer\s+`,
      // URL userinfo and connection-string password slots (`scheme://user:pass@host`).
      String.raw`:\/\/[^\/\s:@]*:[^\/\s@]+@`,
      // Vendor token prefixes and webhook hosts, ordered like DEFAULT_REDACT_PATTERNS.
      String.raw`sk-|gh[opsur]_|github_pat_|glpat-|gloas-|xox[baprs]-|xapp-|hooks\.slack\.com|discord|gsk_|AIza|ya29\.|1\/\/0|eyJ|pplx-|fal_|fc-|bb_live_|gAAAA|[sr]k_(?:live|test)_|\bSG\.|npm_|pypi-|do[opr]_v1_|dp\.(?:ct|pt|sa|st|scim|audit)\.|dckr_|bkua_|CCIPAT_|sbp_|dapi[0-9a-f]|dd[pw]_|glsa_|nfp_|CFPAT-|ATCTT3|ATATT|ATBB|BBDC-|HRKU-|pat-(?:eu|na)1-|apify_api_|FlyV1|fio-u-|tvly-|exa_|syt_|retaindb_|mem0_|brv_|xai-|fw-|fw_|fpk_`,
      String.raw`(?:^|[^A-Za-z0-9_])(?:am_|sk_)`,
      String.raw`A[KS]IA[A-Z0-9]|AKID|LTAI|hf_|api_org_|r8_`,
      String.raw`\bbot\d{6,}:|\b\d{6,}:[A-Za-z0-9_-]{20,}`,
      // Obfuscated form/URL keys: percent escapes can rewrite any key letter, while plus or
      // invisible splices break the literal key-name triggers above mid-word. After a splice the
      // tail may mix further splices with key characters (e.g. an interior plus a trailing
      // filler), but at least one key character must follow a splice so bare `+=` or line-leading
      // `===` separators do not trip the fast path.
      String.raw`%[0-9A-Fa-f]{2}[A-Za-z0-9_%.-]*=`,
      String.raw`(?:\+|[${FORM_BODY_KEY_INVISIBLE_CHARS}])(?:[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*[A-Za-z0-9_%.-])+[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*=`
    ];
    DEFAULT_REDACT_PREFILTER_RE = new RegExp(
      `(?:${DEFAULT_REDACT_PREFILTER_SOURCES.join("|")})`,
      "iu"
    );
  }
});

// src/logging/timestamps.ts
function isValidTimeZone(tz) {
  const cached = validTimeZoneCache.get(tz);
  if (cached !== void 0) {
    return cached;
  }
  let valid;
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz }).format();
    valid = true;
  } catch {
    valid = false;
  }
  validTimeZoneCache.set(tz, valid);
  return valid;
}
function resolveEffectiveTimeZone(timeZone) {
  const explicit = timeZone ?? process.env.TZ;
  return explicit && isValidTimeZone(explicit) ? explicit : hostTimeZone ??= Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function formatOffset(offsetRaw) {
  return offsetRaw === "GMT" ? "+00:00" : offsetRaw.slice(3);
}
function getTimestampParts(date, timeZone) {
  const effectiveTimeZone = resolveEffectiveTimeZone(timeZone);
  let fmt = timestampFormatterCache.get(effectiveTimeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en", {
      timeZone: effectiveTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      fractionalSecondDigits: 3,
      timeZoneName: "longOffset"
    });
    timestampFormatterCache.set(effectiveTimeZone, fmt);
  }
  const parts = Object.fromEntries(fmt.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
    fractionalSecond: parts.fractionalSecond,
    offset: formatOffset(parts.timeZoneName ?? "GMT")
  };
}
function formatTimestamp(date, options) {
  const style = options?.style ?? "medium";
  const parts = getTimestampParts(date, options?.timeZone);
  switch (style) {
    case "short":
      return `${parts.hour}:${parts.minute}:${parts.second}${parts.offset}`;
    case "medium":
      return `${parts.hour}:${parts.minute}:${parts.second}.${parts.fractionalSecond}${parts.offset}`;
    case "long":
      return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.${parts.fractionalSecond}${parts.offset}`;
  }
  throw new Error("Unsupported timestamp style");
}
var validTimeZoneCache, timestampFormatterCache, hostTimeZone;
var init_timestamps = __esm({
  "src/logging/timestamps.ts"() {
    "use strict";
    validTimeZoneCache = /* @__PURE__ */ new Map();
    timestampFormatterCache = /* @__PURE__ */ new Map();
  }
});

// src/logging/logger.ts
import fs4 from "node:fs";
import os3 from "node:os";
import path5 from "node:path";
import { Logger as TsLogger } from "tslog";
function resolveDefaultLogDir() {
  return canUseNodeFs() ? resolvePreferredOpenClawTmpDir() : POSIX_OPENCLAW_TMP_DIR;
}
function resolveDefaultLogFile(defaultLogDir) {
  return canUseNodeFs() ? path5.join(defaultLogDir, "openclaw.log") : `${POSIX_OPENCLAW_TMP_DIR}/openclaw.log`;
}
function clampDiagnosticLogText(value, maxChars) {
  return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function sanitizeDiagnosticLogText(value, maxChars) {
  return clampDiagnosticLogText(
    redactSensitiveText2(clampDiagnosticLogText(value, maxChars)),
    maxChars
  );
}
function normalizeDiagnosticLogName(value) {
  if (!value || value.trim().startsWith("{")) {
    return void 0;
  }
  const sanitized = sanitizeDiagnosticLogText(value.trim(), MAX_DIAGNOSTIC_LOG_NAME_CHARS);
  return DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(sanitized) ? sanitized : void 0;
}
function assignDiagnosticLogAttribute(attributes, state, key, value) {
  if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) {
    return;
  }
  const normalizedKey = key.trim();
  if (isBlockedObjectKey(normalizedKey)) {
    return;
  }
  if (redactSensitiveText2(normalizedKey) !== normalizedKey) {
    return;
  }
  if (!DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(normalizedKey)) {
    return;
  }
  if (typeof value === "string") {
    attributes[normalizedKey] = sanitizeDiagnosticLogText(
      value,
      MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS
    );
    state.count += 1;
    return;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    attributes[normalizedKey] = value;
    state.count += 1;
    return;
  }
  if (typeof value === "boolean") {
    attributes[normalizedKey] = value;
    state.count += 1;
  }
}
function addDiagnosticLogAttributesFrom(attributes, state, source) {
  if (!source) {
    return;
  }
  for (const key in source) {
    if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) {
      break;
    }
    if (!Object.hasOwn(source, key) || key === "trace") {
      continue;
    }
    assignDiagnosticLogAttribute(attributes, state, key, source[key]);
  }
}
function isPlainLogRecordObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function normalizeTraceContext(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return void 0;
  }
  const candidate = value;
  if (!isValidDiagnosticTraceId(candidate.traceId)) {
    return void 0;
  }
  if (candidate.spanId !== void 0 && !isValidDiagnosticSpanId(candidate.spanId)) {
    return void 0;
  }
  if (candidate.parentSpanId !== void 0 && !isValidDiagnosticSpanId(candidate.parentSpanId)) {
    return void 0;
  }
  if (candidate.traceFlags !== void 0 && !isValidDiagnosticTraceFlags(candidate.traceFlags)) {
    return void 0;
  }
  return {
    traceId: candidate.traceId,
    ...candidate.spanId ? { spanId: candidate.spanId } : {},
    ...candidate.parentSpanId ? { parentSpanId: candidate.parentSpanId } : {},
    ...candidate.traceFlags ? { traceFlags: candidate.traceFlags } : {}
  };
}
function extractTraceContext(value) {
  const direct = normalizeTraceContext(value);
  if (direct) {
    return direct;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return void 0;
  }
  return normalizeTraceContext(value.trace);
}
function getSortedNumericLogArgs(logObj) {
  return Object.entries(logObj).filter(([key]) => /^\d+$/.test(key)).toSorted((a, b) => Number(a[0]) - Number(b[0])).map(([, value]) => value);
}
function clampFileLogText(value, maxChars) {
  return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function normalizeFileLogContextValue(value) {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized ? clampFileLogText(normalized, MAX_FILE_LOG_CONTEXT_VALUE_CHARS) : void 0;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "boolean") {
    return String(value);
  }
  return void 0;
}
function readFirstContextString(sources, keys) {
  for (const source of sources) {
    if (!source) {
      continue;
    }
    for (const key of keys) {
      const value = normalizeFileLogContextValue(source[key]);
      if (value) {
        return value;
      }
    }
  }
  return void 0;
}
function stringifyFileLogMessagePart(value) {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  if (value instanceof Error) {
    return value.message || value.name;
  }
  if (isPlainLogRecordObject(value) && typeof value.message === "string") {
    return value.message;
  }
  if (value === null || value === void 0) {
    return void 0;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return void 0;
  }
}
function buildFileLogMessage(numericArgs) {
  const parts = numericArgs.map(stringifyFileLogMessagePart).filter((part) => Boolean(part && part.trim()));
  if (parts.length === 0) {
    return void 0;
  }
  return clampFileLogText(parts.join(" "), MAX_FILE_LOG_MESSAGE_CHARS);
}
function resolveLogHostname() {
  if (cachedHostname) {
    return cachedHostname;
  }
  const hostname = hostnameResolver().trim();
  if (!hostname) {
    return "unknown";
  }
  cachedHostname = hostname;
  return hostname;
}
function withResolvedLogMetaHostname(meta, hostname) {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    return meta;
  }
  return { ...meta, hostname };
}
function extractLogBindingPrefix(numericArgs) {
  if (typeof numericArgs[0] === "string" && numericArgs[0].length <= MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS && numericArgs[0].trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(numericArgs[0]);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return {
          bindings: parsed,
          args: numericArgs.slice(1)
        };
      }
    } catch {
    }
  }
  return { args: numericArgs };
}
function findLogTraceContext(bindings, numericArgs) {
  const fromBindings = extractTraceContext(bindings);
  if (fromBindings) {
    return fromBindings;
  }
  for (const arg of numericArgs) {
    const fromArg = extractTraceContext(arg);
    if (fromArg) {
      return fromArg;
    }
  }
  return void 0;
}
function resolveLogTraceContext(bindings, numericArgs) {
  const explicitTrace = findLogTraceContext(bindings, numericArgs);
  if (explicitTrace) {
    return { trace: explicitTrace, trustedTraceContext: false };
  }
  const activeTrace = getActiveDiagnosticTraceContext();
  return activeTrace ? { trace: activeTrace, trustedTraceContext: true } : { trustedTraceContext: false };
}
function buildTraceFileLogFields(logObj) {
  const { bindings, args } = extractLogBindingPrefix(getSortedNumericLogArgs(logObj));
  const { trace } = resolveLogTraceContext(bindings, args);
  if (!trace) {
    return void 0;
  }
  return {
    traceId: trace.traceId,
    ...trace.spanId ? { spanId: trace.spanId } : {},
    ...trace.parentSpanId ? { parentSpanId: trace.parentSpanId } : {},
    ...trace.traceFlags ? { traceFlags: trace.traceFlags } : {}
  };
}
function buildStructuredFileLogFields(logObj) {
  const { bindings, args } = extractLogBindingPrefix(getSortedNumericLogArgs(logObj));
  const structuredArg = isPlainLogRecordObject(args[0]) ? args[0] : void 0;
  const sources = [structuredArg, bindings, logObj];
  const messageArgs = structuredArg && typeof structuredArg.message !== "string" ? args.slice(1) : args;
  const message = buildFileLogMessage(messageArgs);
  const agentId = readFirstContextString(sources, ["agent_id", "agentId"]);
  const sessionId = readFirstContextString(sources, ["session_id", "sessionId", "sessionKey"]);
  const channel = readFirstContextString(sources, ["channel", "messageProvider"]);
  return {
    hostname: resolveLogHostname(),
    ...message ? { message } : {},
    ...agentId ? { agent_id: agentId } : {},
    ...sessionId ? { session_id: sessionId } : {},
    ...channel ? { channel } : {}
  };
}
function buildDiagnosticLogRecord(logObj) {
  const meta = logObj["_meta"];
  const { bindings, args: numericArgs } = extractLogBindingPrefix(getSortedNumericLogArgs(logObj));
  const { trace, trustedTraceContext } = resolveLogTraceContext(bindings, numericArgs);
  const structuredArg = numericArgs[0];
  const structuredBindings = isPlainLogRecordObject(structuredArg) ? structuredArg : void 0;
  if (structuredBindings) {
    numericArgs.shift();
  }
  let message = "";
  if (numericArgs.length > 0 && typeof numericArgs[numericArgs.length - 1] === "string") {
    message = sanitizeDiagnosticLogText(
      String(numericArgs.pop()),
      MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS
    );
  } else if (numericArgs.length === 1 && (typeof numericArgs[0] === "number" || typeof numericArgs[0] === "boolean")) {
    message = String(numericArgs[0]);
    numericArgs.length = 0;
  }
  if (!message) {
    message = "log";
  }
  const attributes = /* @__PURE__ */ Object.create(null);
  const attributeState = { count: 0 };
  addDiagnosticLogAttributesFrom(attributes, attributeState, bindings);
  addDiagnosticLogAttributesFrom(attributes, attributeState, structuredBindings);
  const code = {};
  if (meta?.path?.fileLine) {
    const line = Number(meta.path.fileLine);
    if (Number.isFinite(line)) {
      code.line = line;
    }
  }
  if (meta?.path?.method) {
    code.functionName = sanitizeDiagnosticLogText(meta.path.method, MAX_DIAGNOSTIC_LOG_NAME_CHARS);
  }
  const loggerName = normalizeDiagnosticLogName(meta?.name);
  const loggerParents = meta?.parentNames?.map(normalizeDiagnosticLogName).filter((name) => Boolean(name));
  return {
    event: {
      type: "log.record",
      level: meta?.logLevelName ?? "INFO",
      message,
      ...loggerName ? { loggerName } : {},
      ...loggerParents?.length ? { loggerParents } : {},
      ...Object.keys(attributes).length > 0 ? { attributes } : {},
      ...Object.keys(code).length > 0 ? { code } : {},
      ...trace ? { trace } : {}
    },
    trustedTraceContext
  };
}
function isLogRedactionDisabled() {
  return readLoggingConfig()?.redactSensitive === "off";
}
function redactLogRecordForTransport(record) {
  return isLogRedactionDisabled() ? record : redactSecrets(record);
}
function attachDiagnosticEventTransport(logger) {
  logger.attachTransport((logObj) => {
    try {
      const record = buildDiagnosticLogRecord(redactLogRecordForTransport(logObj));
      const emit = record.trustedTraceContext ? emitDiagnosticEventWithTrustedTraceContext : emitDiagnosticEvent;
      emit(record.event);
    } catch {
    }
  });
}
function canUseSilentVitestFileLogFastPath(envLevel) {
  return process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" && !envLevel && !loggingState.overrideSettings;
}
function resolveDefaultActiveLogFile() {
  if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG === "1") {
    return path5.join(
      process.cwd(),
      ".artifacts",
      "test-logs",
      `${LOG_PREFIX}-vitest-${process.pid}-${formatLocalDate(/* @__PURE__ */ new Date())}${LOG_SUFFIX}`
    );
  }
  return defaultRollingPathForToday();
}
function resolveSettings() {
  if (!canUseNodeFs()) {
    return {
      level: "silent",
      file: DEFAULT_LOG_FILE,
      maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES
    };
  }
  const envLevel = resolveEnvLogLevelOverride();
  if (canUseSilentVitestFileLogFastPath(envLevel)) {
    return {
      level: "silent",
      file: defaultRollingPathForToday(),
      maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES
    };
  }
  const cfg = loggingState.overrideSettings ?? loadLoggerConfig();
  const defaultLevel = process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" ? "silent" : "info";
  const fromConfig = normalizeLogLevel(cfg?.level, defaultLevel);
  const level = envLevel ?? fromConfig;
  const file = cfg?.file ?? resolveDefaultActiveLogFile();
  const maxFileBytes = resolveMaxLogFileBytes(cfg?.maxFileBytes);
  return { level, file, maxFileBytes };
}
function settingsChanged(a, b) {
  if (!a) {
    return true;
  }
  return a.level !== b.level || a.file !== b.file || a.maxFileBytes !== b.maxFileBytes;
}
function isFileLogLevelEnabled(level) {
  const settings = loggingState.cachedSettings ?? resolveSettings();
  if (!loggingState.cachedSettings) {
    loggingState.cachedSettings = settings;
  }
  if (level === "silent") {
    return false;
  }
  if (settings.level === "silent") {
    return false;
  }
  return levelToMinLevel(level) >= levelToMinLevel(settings.level);
}
function buildLogger(settings) {
  const logger = new TsLogger({
    name: "openclaw",
    // Custom structured redaction runs at each transport boundary; avoid tslog pre-masking divergent records.
    maskValuesOfKeys: [],
    minLevel: levelToMinLevel(settings.level),
    type: "hidden"
    // no ansi formatting
  });
  if (settings.level === "silent") {
    attachDiagnosticEventTransport(logger);
    return logger;
  }
  const rollingFile = isRollingPath(settings.file);
  let activeFile = resolveActiveLogFile(settings.file);
  fs4.mkdirSync(path5.dirname(activeFile), { recursive: true });
  if (rollingFile) {
    pruneOldRollingLogs(path5.dirname(activeFile));
  }
  let currentFileBytes = getCurrentLogFileBytes(activeFile);
  let warnedAboutRotationFailure = false;
  logger.attachTransport((logObj) => {
    try {
      const nextActiveFile = resolveActiveLogFile(settings.file);
      if (nextActiveFile !== activeFile) {
        activeFile = nextActiveFile;
        fs4.mkdirSync(path5.dirname(activeFile), { recursive: true });
        if (rollingFile) {
          pruneOldRollingLogs(path5.dirname(activeFile));
        }
        currentFileBytes = getCurrentLogFileBytes(activeFile);
      }
      const time = formatTimestamp(logObj.date ?? /* @__PURE__ */ new Date(), { style: "long" });
      const traceFields = buildTraceFileLogFields(logObj);
      const structuredFields = buildStructuredFileLogFields(logObj);
      const record = {
        ...logObj,
        _meta: withResolvedLogMetaHostname(
          logObj["_meta"],
          expectDefined(structuredFields.hostname, "structured log hostname")
        ),
        time,
        ...structuredFields,
        ...traceFields
      };
      const line = redactSensitiveText2(JSON.stringify(redactLogRecordForTransport(record)));
      const payload = `${line}
`;
      const payloadBytes = Buffer.byteLength(payload, "utf8");
      const nextBytes = currentFileBytes + payloadBytes;
      if (currentFileBytes > 0 && nextBytes > settings.maxFileBytes) {
        if (rotateLogFile(activeFile)) {
          currentFileBytes = getCurrentLogFileBytes(activeFile);
          warnedAboutRotationFailure = false;
        } else if (!warnedAboutRotationFailure) {
          warnedAboutRotationFailure = true;
          process.stderr.write(
            `[openclaw] log file rotation failed; continuing writes file=${activeFile} maxFileBytes=${settings.maxFileBytes}
`
          );
        }
      }
      if (appendLogLine(activeFile, payload)) {
        currentFileBytes += payloadBytes;
      }
    } catch {
    }
  });
  attachDiagnosticEventTransport(logger);
  return logger;
}
function resolveMaxLogFileBytes(raw) {
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
    return Math.floor(raw);
  }
  return DEFAULT_MAX_LOG_FILE_BYTES;
}
function getCurrentLogFileBytes(file) {
  try {
    return fs4.statSync(file).size;
  } catch {
    return 0;
  }
}
function appendLogLine(file, line) {
  try {
    appendRegularFileSync({ filePath: file, content: line });
    return true;
  } catch {
    return false;
  }
}
function getLogger() {
  const settings = resolveSettings();
  const cachedLogger = loggingState.cachedLogger;
  const cachedSettings = loggingState.cachedSettings;
  if (!cachedLogger || settingsChanged(cachedSettings, settings)) {
    loggingState.cachedLogger = buildLogger(settings);
    loggingState.cachedSettings = settings;
  }
  return loggingState.cachedLogger;
}
function getChildLogger(bindings, opts) {
  const base = getLogger();
  const minLevel = opts?.level ? levelToMinLevel(opts.level) : base.settings.minLevel;
  const name = bindings ? JSON.stringify(bindings) : void 0;
  return base.getSubLogger({
    name,
    minLevel,
    prefix: bindings ? [name ?? ""] : []
  });
}
function defaultRollingPathForToday() {
  return rollingPathForDate(DEFAULT_LOG_DIR, /* @__PURE__ */ new Date());
}
function rollingPathForDate(dir, date) {
  const today = formatLocalDate(date);
  return path5.join(dir, `${LOG_PREFIX}-${today}${LOG_SUFFIX}`);
}
function resolveActiveLogFile(file) {
  const expandedFile = expandHomePrefix(file);
  if (!isRollingPath(expandedFile)) {
    return expandedFile;
  }
  return rollingPathForDate(path5.dirname(expandedFile), /* @__PURE__ */ new Date());
}
function isRollingPath(file) {
  const base = path5.basename(file);
  return base.startsWith(`${LOG_PREFIX}-`) && base.endsWith(LOG_SUFFIX) && base.length === `${LOG_PREFIX}-YYYY-MM-DD${LOG_SUFFIX}`.length;
}
function pruneOldRollingLogs(dir) {
  try {
    const entries = fs4.readdirSync(dir, { withFileTypes: true });
    const cutoff = Date.now() - MAX_LOG_AGE_MS;
    for (const entry of entries) {
      if (!entry.isFile()) {
        continue;
      }
      if (!entry.name.startsWith(`${LOG_PREFIX}-`) || !entry.name.endsWith(LOG_SUFFIX)) {
        continue;
      }
      const fullPath = path5.join(dir, entry.name);
      try {
        const stat = fs4.statSync(fullPath);
        if (stat.mtimeMs < cutoff) {
          fs4.rmSync(fullPath, { force: true });
        }
      } catch {
      }
    }
  } catch {
  }
}
function rotatedLogPath(file, index) {
  const ext = path5.extname(file);
  const base = file.slice(0, file.length - ext.length);
  return `${base}.${index}${ext}`;
}
function rotateLogFile(file) {
  try {
    fs4.mkdirSync(path5.dirname(file), { recursive: true });
    fs4.rmSync(rotatedLogPath(file, MAX_ROTATED_LOG_FILES), { force: true });
    for (let index = MAX_ROTATED_LOG_FILES - 1; index >= 1; index -= 1) {
      const from = rotatedLogPath(file, index);
      if (!fs4.existsSync(from)) {
        continue;
      }
      fs4.renameSync(from, rotatedLogPath(file, index + 1));
    }
    if (fs4.existsSync(file)) {
      fs4.renameSync(file, rotatedLogPath(file, 1));
    }
    return true;
  } catch {
    return false;
  }
}
var DEFAULT_LOG_DIR, DEFAULT_LOG_FILE, MAX_LOG_AGE_MS, DEFAULT_MAX_LOG_FILE_BYTES, MAX_ROTATED_LOG_FILES, MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS, MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS, loadLoggerConfigDefault, loadLoggerConfig, MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT, MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS, MAX_DIAGNOSTIC_LOG_NAME_CHARS, MAX_FILE_LOG_MESSAGE_CHARS, MAX_FILE_LOG_CONTEXT_VALUE_CHARS, DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE, defaultHostnameResolver, hostnameResolver, cachedHostname;
var init_logger = __esm({
  "src/logging/logger.ts"() {
    "use strict";
    init_src();
    init_utf16_slice();
    init_diagnostic_events();
    init_diagnostic_trace_context();
    init_home_dir();
    init_prototype_keys();
    init_regular_file();
    init_tmp_openclaw_dir();
    init_config();
    init_env_log_level();
    init_levels();
    init_log_file_shared();
    init_redact();
    init_state();
    init_timestamps();
    DEFAULT_LOG_DIR = resolveDefaultLogDir();
    DEFAULT_LOG_FILE = resolveDefaultLogFile(DEFAULT_LOG_DIR);
    MAX_LOG_AGE_MS = 24 * 60 * 60 * 1e3;
    DEFAULT_MAX_LOG_FILE_BYTES = 100 * 1024 * 1024;
    MAX_ROTATED_LOG_FILES = 5;
    MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS = 8 * 1024;
    MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS = 4 * 1024;
    loadLoggerConfigDefault = () => readLoggingConfig();
    loadLoggerConfig = loadLoggerConfigDefault;
    MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT = 32;
    MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS = 2 * 1024;
    MAX_DIAGNOSTIC_LOG_NAME_CHARS = 120;
    MAX_FILE_LOG_MESSAGE_CHARS = 4 * 1024;
    MAX_FILE_LOG_CONTEXT_VALUE_CHARS = 512;
    DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE = /^[A-Za-z0-9_.:-]{1,64}$/u;
    defaultHostnameResolver = () => os3.hostname();
    hostnameResolver = defaultHostnameResolver;
    cachedHostname = null;
  }
});

// packages/terminal-core/src/progress-line.ts
function clearActiveProgressLine() {
  if (!activeStream?.isTTY) {
    return;
  }
  activeStream.write("\r\x1B[2K");
}
var activeStream;
var init_progress_line = __esm({
  "packages/terminal-core/src/progress-line.ts"() {
    "use strict";
    activeStream = null;
  }
});

// packages/terminal-core/src/restore.ts
function reportRestoreFailure(scope, err, reason) {
  const suffix = reason ? ` (${reason})` : "";
  const message = `[terminal] restore ${scope} failed${suffix}: ${String(err)}`;
  try {
    process.stderr.write(`${message}
`);
  } catch (writeErr) {
    console.error(`[terminal] restore reporting failed${suffix}: ${String(writeErr)}`);
  }
}
function restoreTerminalState(reason, options = {}) {
  const resumeStdin = options.resumeStdinIfPaused ?? options.resumeStdin ?? false;
  const resetStream = options.resetStream ?? process.stdout;
  try {
    clearActiveProgressLine();
  } catch (err) {
    reportRestoreFailure("progress line", err, reason);
  }
  const stdin = process.stdin;
  if (stdin.isTTY && typeof stdin.setRawMode === "function") {
    try {
      stdin.setRawMode(false);
    } catch (err) {
      reportRestoreFailure("raw mode", err, reason);
    }
    if (resumeStdin && typeof stdin.isPaused === "function" && stdin.isPaused()) {
      try {
        stdin.resume();
      } catch (err) {
        reportRestoreFailure("stdin resume", err, reason);
      }
    }
  }
  if (resetStream.isTTY) {
    try {
      resetStream.write(RESET_SEQUENCE);
    } catch (err) {
      reportRestoreFailure("terminal reset", err, reason);
    }
  }
}
var RESET_SEQUENCE;
var init_restore = __esm({
  "packages/terminal-core/src/restore.ts"() {
    "use strict";
    init_progress_line();
    RESET_SEQUENCE = "\x1B[0m\x1B[?25h\x1B[?1000l\x1B[?1002l\x1B[?1003l\x1B[?1006l\x1B[?2004l\x1B[<u\x1B[>4;0m";
  }
});

// src/runtime.ts
function shouldEmitRuntimeLog(env = process.env) {
  if (env.VITEST !== "true") {
    return true;
  }
  if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") {
    return true;
  }
  const maybeMockedLog = console.log;
  return typeof maybeMockedLog.mock === "object";
}
function shouldEmitRuntimeStdout(env = process.env) {
  if (env.VITEST !== "true") {
    return true;
  }
  if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") {
    return true;
  }
  const stdout = process.stdout;
  return typeof stdout.write.mock === "object";
}
function isPipeClosedError(err) {
  const code = err?.code;
  return code === "EPIPE" || code === "EIO";
}
function writeStdout(value) {
  if (!shouldEmitRuntimeStdout()) {
    return;
  }
  clearActiveProgressLine();
  const line = value.endsWith("\n") ? value : `${value}
`;
  try {
    process.stdout.write(line);
  } catch (err) {
    if (isPipeClosedError(err)) {
      return;
    }
    throw err;
  }
}
function createRuntimeIo() {
  return {
    log: (...args) => {
      if (!shouldEmitRuntimeLog()) {
        return;
      }
      clearActiveProgressLine();
      console.log(...args);
    },
    error: (...args) => {
      clearActiveProgressLine();
      console.error(...args);
    },
    writeStdout,
    writeJson: (value, space = 2) => {
      writeStdout(JSON.stringify(value, null, space > 0 ? space : void 0));
    }
  };
}
var defaultRuntime;
var init_runtime = __esm({
  "src/runtime.ts"() {
    "use strict";
    init_progress_line();
    init_restore();
    defaultRuntime = {
      ...createRuntimeIo(),
      exit: (code, opts) => {
        restoreTerminalState("runtime exit", {
          resumeStdinIfPaused: false,
          resetStream: opts?.resetStream
        });
        process.exit(code);
        throw new Error("unreachable");
      }
    };
  }
});

// src/logging/console.ts
function normalizeConsoleLevel(level) {
  if (isVerbose()) {
    return "debug";
  }
  if (!level && process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1") {
    return "silent";
  }
  return normalizeLogLevel(level, "info");
}
function normalizeConsoleStyle(style) {
  if (style === "compact" || style === "json" || style === "pretty") {
    return style;
  }
  if (!process.stdout.isTTY) {
    return "compact";
  }
  return "pretty";
}
function resolveConsoleSettings() {
  const envLevel = resolveEnvLogLevelOverride();
  if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1" && !isVerbose() && !envLevel && !loggingState.overrideSettings) {
    return { level: "silent", style: normalizeConsoleStyle(void 0) };
  }
  let cfg = loggingState.overrideSettings ?? readLoggingConfig();
  if (!cfg && !shouldSkipMutatingLoggingConfigRead()) {
    if (loggingState.resolvingConsoleSettings) {
      cfg = void 0;
    } else {
      loggingState.resolvingConsoleSettings = true;
      try {
        cfg = loadConfigFallback();
      } finally {
        loggingState.resolvingConsoleSettings = false;
      }
    }
  }
  const level = envLevel ?? normalizeConsoleLevel(cfg?.consoleLevel);
  const style = normalizeConsoleStyle(cfg?.consoleStyle);
  return { level, style };
}
function consoleSettingsChanged(a, b) {
  if (!a) {
    return true;
  }
  return a.level !== b.level || a.style !== b.style;
}
function getConsoleSettings() {
  const settings = resolveConsoleSettings();
  const cached = loggingState.cachedConsoleSettings;
  if (!cached || consoleSettingsChanged(cached, settings)) {
    loggingState.cachedConsoleSettings = settings;
  }
  return loggingState.cachedConsoleSettings;
}
function normalizeConsoleSubsystem(subsystem) {
  if (typeof subsystem !== "string") {
    return null;
  }
  const normalized = subsystem.trim();
  return normalized.length > 0 ? normalized : null;
}
function shouldLogSubsystemToConsole(subsystem) {
  const filter = loggingState.consoleSubsystemFilter;
  if (!filter || filter.length === 0) {
    return true;
  }
  const normalizedSubsystem = normalizeConsoleSubsystem(subsystem);
  if (!normalizedSubsystem) {
    return false;
  }
  return filter.some(
    (prefix) => normalizedSubsystem === prefix || normalizedSubsystem.startsWith(`${prefix}/`)
  );
}
function formatConsoleTimestamp(style) {
  const now = /* @__PURE__ */ new Date();
  if (style === "pretty") {
    return formatTimestamp(now, { style: "short" }).replace(/[+-]\d{2}:\d{2}$/, "");
  }
  return formatTimestamp(now, { style: "long" });
}
var loadConfigFallbackDefault, loadConfigFallback;
var init_console = __esm({
  "src/logging/console.ts"() {
    "use strict";
    init_ansi();
    init_global_state();
    init_config();
    init_env_log_level();
    init_levels();
    init_logger();
    init_redact();
    init_state();
    init_timestamps();
    loadConfigFallbackDefault = () => void 0;
    loadConfigFallback = loadConfigFallbackDefault;
  }
});

// src/logging/subsystem.ts
import { Chalk as Chalk2 } from "chalk";
function normalizeSubsystemLabel(subsystem) {
  if (typeof subsystem !== "string") {
    return "unknown";
  }
  const normalized = subsystem.trim();
  return normalized.length > 0 ? normalized : "unknown";
}
function shouldLogToConsole(level, settings) {
  if (level === "silent") {
    return false;
  }
  if (settings.level === "silent") {
    return false;
  }
  const current = levelToMinLevel(level);
  const min = levelToMinLevel(settings.level);
  return current >= min;
}
function isRichConsoleEnv() {
  const term = normalizeLowercaseStringOrEmpty(process.env.TERM);
  if (process.env.COLORTERM || process.env.TERM_PROGRAM) {
    return true;
  }
  return term.length > 0 && term !== "dumb";
}
function getColorForConsole() {
  const hasForceColor2 = typeof process.env.FORCE_COLOR === "string" && process.env.FORCE_COLOR.trim().length > 0 && process.env.FORCE_COLOR.trim() !== "0";
  if (hasForceColor2) {
    return new Chalk2({ level: 1 });
  }
  if (process.env.NO_COLOR && !hasForceColor2) {
    return new Chalk2({ level: 0 });
  }
  const hasTty = process.stdout.isTTY || process.stderr.isTTY;
  return hasTty || isRichConsoleEnv() ? new Chalk2({ level: 1 }) : new Chalk2({ level: 0 });
}
function isChannelSubsystemPrefix(value) {
  const normalized = normalizeLowercaseStringOrEmpty(value);
  if (!normalized) {
    return false;
  }
  return CHANNEL_SUBSYSTEM_PREFIXES.has(normalized);
}
function pickSubsystemColor(color, subsystem) {
  const override = SUBSYSTEM_COLOR_OVERRIDES[subsystem];
  if (override) {
    return color[override];
  }
  let hash = 0;
  for (let i = 0; i < subsystem.length; i += 1) {
    hash = hash * 31 + subsystem.charCodeAt(i) | 0;
  }
  const idx = Math.abs(hash) % SUBSYSTEM_COLORS.length;
  const name = expectDefined(SUBSYSTEM_COLORS[idx], "subsystem colors entry at idx");
  return color[name];
}
function formatSubsystemForConsole(subsystem) {
  const parts = subsystem.split("/").filter(Boolean);
  const original = parts.join("/") || subsystem;
  while (parts.length > 0) {
    const first2 = parts.at(0);
    if (first2 === void 0 || !SUBSYSTEM_PREFIXES_TO_DROP.includes(first2)) {
      break;
    }
    parts.shift();
  }
  const first = parts.at(0);
  if (first === void 0) {
    return original;
  }
  if (isChannelSubsystemPrefix(first)) {
    return first;
  }
  if (parts.length > SUBSYSTEM_MAX_SEGMENTS) {
    return parts.slice(-SUBSYSTEM_MAX_SEGMENTS).join("/");
  }
  return parts.join("/");
}
function stripRedundantSubsystemPrefixForConsole(message, displaySubsystem) {
  if (!displaySubsystem) {
    return message;
  }
  if (message.startsWith("[")) {
    const closeIdx = message.indexOf("]");
    if (closeIdx > 1) {
      const bracketTag = message.slice(1, closeIdx);
      if (normalizeLowercaseStringOrEmpty(bracketTag) === normalizeLowercaseStringOrEmpty(displaySubsystem)) {
        let i2 = closeIdx + 1;
        while (message[i2] === " ") {
          i2 += 1;
        }
        return message.slice(i2);
      }
    }
  }
  const prefix = message.slice(0, displaySubsystem.length);
  if (normalizeLowercaseStringOrEmpty(prefix) !== normalizeLowercaseStringOrEmpty(displaySubsystem)) {
    return message;
  }
  const next = message.slice(displaySubsystem.length, displaySubsystem.length + 1);
  if (next !== ":" && next !== " ") {
    return message;
  }
  let i = displaySubsystem.length;
  while (message[i] === " ") {
    i += 1;
  }
  if (message[i] === ":") {
    i += 1;
  }
  while (message[i] === " ") {
    i += 1;
  }
  return message.slice(i);
}
function formatConsoleLine(opts) {
  const displaySubsystem = opts.style === "json" ? opts.subsystem : formatSubsystemForConsole(opts.subsystem);
  if (opts.style === "json") {
    return redactSensitiveText2(
      JSON.stringify({
        time: formatConsoleTimestamp("json"),
        level: opts.level,
        subsystem: displaySubsystem,
        message: opts.message,
        ...opts.meta
      })
    );
  }
  const color = getColorForConsole();
  const prefix = `[${displaySubsystem}]`;
  const prefixColor = pickSubsystemColor(color, displaySubsystem);
  const levelColor = opts.level === "error" || opts.level === "fatal" ? color.red : opts.level === "warn" ? color.yellow : opts.level === "debug" || opts.level === "trace" ? color.gray : color.cyan;
  const redactedMessage = redactSensitiveText2(opts.message);
  const displayMessage = stripRedundantSubsystemPrefixForConsole(redactedMessage, displaySubsystem);
  const time = (() => {
    if (opts.style === "pretty") {
      return color.gray(formatConsoleTimestamp("pretty"));
    }
    if (loggingState.consoleTimestampPrefix) {
      return color.gray(formatConsoleTimestamp(opts.style));
    }
    return "";
  })();
  const prefixToken = prefixColor(prefix);
  const head = [time, prefixToken].filter(Boolean).join(" ");
  return `${head} ${levelColor(displayMessage)}`;
}
function writeConsoleLine(level, line, opts = {}) {
  clearActiveProgressLine();
  const sanitized = process.platform === "win32" && process.env.GITHUB_ACTIONS === "true" ? line.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "?").replace(/[\uD800-\uDFFF]/g, "?") : line;
  const redacted = opts.redacted ? sanitized : redactSensitiveText2(sanitized);
  const sink = loggingState.rawConsole ?? console;
  if (loggingState.forceConsoleToStderr || level === "error" || level === "fatal") {
    (sink.error ?? console.error)(redacted);
  } else if (level === "warn") {
    (sink.warn ?? console.warn)(redacted);
  } else {
    (sink.log ?? console.log)(redacted);
  }
}
function shouldSuppressProbeConsoleLine(params) {
  if (isVerbose()) {
    return false;
  }
  if (params.level === "error" || params.level === "fatal") {
    return false;
  }
  const subsystem = normalizeSubsystemLabel(params.subsystem);
  const message = typeof params.message === "string" ? params.message : "";
  const isProbeSuppressedSubsystem = subsystem === "agent/embedded" || subsystem.startsWith("agent/embedded/") || subsystem === "model-fallback" || subsystem.startsWith("model-fallback/");
  if (!isProbeSuppressedSubsystem) {
    return false;
  }
  const runLikeId = typeof params.meta?.runId === "string" ? params.meta.runId : typeof params.meta?.sessionId === "string" ? params.meta.sessionId : void 0;
  if (runLikeId?.startsWith("probe-")) {
    return true;
  }
  return /(sessionId|runId)=probe-/.test(message);
}
function logToFile(fileLogger, level, message, meta) {
  if (level === "silent") {
    return;
  }
  const safeLevel = level;
  const method = fileLogger[safeLevel];
  if (typeof method !== "function") {
    return;
  }
  if (meta && Object.keys(meta).length > 0) {
    method.call(fileLogger, meta, message);
  } else {
    method.call(fileLogger, message);
  }
}
function createSubsystemLogger(subsystem) {
  const resolvedSubsystem = normalizeSubsystemLabel(subsystem);
  const emitLog = (level, message, meta) => {
    const consoleSettings = getConsoleSettings();
    const consoleEnabled = shouldLogToConsole(level, { level: consoleSettings.level }) && shouldLogSubsystemToConsole(resolvedSubsystem);
    const fileEnabled = isFileLogLevelEnabled(level);
    if (!consoleEnabled && !fileEnabled) {
      return;
    }
    let consoleMessageOverride;
    let fileMeta = meta;
    if (meta && Object.keys(meta).length > 0) {
      const { consoleMessage: consoleMessage2, ...rest } = meta;
      if (typeof consoleMessage2 === "string") {
        consoleMessageOverride = consoleMessage2;
      }
      fileMeta = Object.keys(rest).length > 0 ? rest : void 0;
    }
    if (fileEnabled) {
      logToFile(getChildLogger({ subsystem: resolvedSubsystem }), level, message, fileMeta);
    }
    if (!consoleEnabled) {
      return;
    }
    const consoleMessage = consoleMessageOverride ?? message;
    if (shouldSuppressProbeConsoleLine({
      level,
      subsystem: resolvedSubsystem,
      message: consoleMessage,
      meta: fileMeta
    })) {
      return;
    }
    writeConsoleLine(
      level,
      formatConsoleLine({
        level,
        subsystem: resolvedSubsystem,
        message: consoleSettings.style === "json" ? message : consoleMessage,
        style: consoleSettings.style,
        meta: fileMeta
      }),
      { redacted: true }
    );
  };
  const logger = {
    subsystem: resolvedSubsystem,
    isEnabled(level, target = "any") {
      const isConsoleEnabled = shouldLogToConsole(level, { level: getConsoleSettings().level }) && shouldLogSubsystemToConsole(resolvedSubsystem);
      const isFileEnabled = isFileLogLevelEnabled(level);
      if (target === "console") {
        return isConsoleEnabled;
      }
      if (target === "file") {
        return isFileEnabled;
      }
      return isConsoleEnabled || isFileEnabled;
    },
    trace(message, meta) {
      emitLog("trace", message, meta);
    },
    debug(message, meta) {
      emitLog("debug", message, meta);
    },
    info(message, meta) {
      emitLog("info", message, meta);
    },
    warn(message, meta) {
      emitLog("warn", message, meta);
    },
    error(message, meta) {
      emitLog("error", message, meta);
    },
    fatal(message, meta) {
      emitLog("fatal", message, meta);
    },
    raw(message) {
      if (isFileLogLevelEnabled("info")) {
        logToFile(getChildLogger({ subsystem: resolvedSubsystem }), "info", message, { raw: true });
      }
      if (shouldLogToConsole("info", { level: getConsoleSettings().level }) && shouldLogSubsystemToConsole(resolvedSubsystem)) {
        if (shouldSuppressProbeConsoleLine({
          level: "info",
          subsystem: resolvedSubsystem,
          message
        })) {
          return;
        }
        writeConsoleLine("info", message);
      }
    },
    child(name) {
      return createSubsystemLogger(`${resolvedSubsystem}/${name}`);
    }
  };
  return logger;
}
var inspectValue, SUBSYSTEM_COLORS, SUBSYSTEM_COLOR_OVERRIDES, SUBSYSTEM_PREFIXES_TO_DROP, SUBSYSTEM_MAX_SEGMENTS, CHANNEL_SUBSYSTEM_PREFIXES;
var init_subsystem = __esm({
  "src/logging/subsystem.ts"() {
    "use strict";
    init_src();
    init_string_coerce();
    init_progress_line();
    init_global_state();
    init_runtime();
    init_console();
    init_levels();
    init_logger();
    init_redact();
    init_state();
    inspectValue = (() => {
      const getBuiltinModule = process.getBuiltinModule;
      if (typeof getBuiltinModule !== "function") {
        return null;
      }
      try {
        const utilNamespace = getBuiltinModule("util");
        return typeof utilNamespace.inspect === "function" ? utilNamespace.inspect : null;
      } catch {
        return null;
      }
    })();
    SUBSYSTEM_COLORS = ["cyan", "green", "yellow", "blue", "magenta", "red"];
    SUBSYSTEM_COLOR_OVERRIDES = {
      "gmail-watcher": "blue"
    };
    SUBSYSTEM_PREFIXES_TO_DROP = ["gateway", "channels", "providers"];
    SUBSYSTEM_MAX_SEGMENTS = 2;
    CHANNEL_SUBSYSTEM_PREFIXES = /* @__PURE__ */ new Set([
      "clickclack",
      "discord",
      "feishu",
      "googlechat",
      "imessage",
      "irc",
      "line",
      "matrix",
      "mattermost",
      "msteams",
      "nextcloud-talk",
      "nostr",
      "openclaw-weixin",
      "qqbot",
      "signal",
      "slack",
      "synology-chat",
      "telegram",
      "tlon",
      "twitch",
      "webchat",
      "wecom",
      "whatsapp",
      "yuanbao",
      "zalo",
      "zalouser"
    ]);
  }
});

// src/infra/errors.ts
function formatErrorMessage2(err) {
  return formatErrorMessage(err, { redact: redactSensitiveText2 });
}
var init_errors2 = __esm({
  "src/infra/errors.ts"() {
    "use strict";
    init_error_coercion();
    init_redact();
    init_error_coercion();
  }
});

// src/infra/fetch-headers.ts
function isHeadersLike(value) {
  if (typeof Headers !== "undefined" && value instanceof Headers) {
    return true;
  }
  const candidate = value;
  return typeof candidate.entries === "function" && typeof candidate.get === "function" && typeof candidate[Symbol.iterator] === "function";
}
function normalizeHeadersInitForFetch(headers) {
  if (!headers || typeof headers !== "object" || Array.isArray(headers) || isHeadersLike(headers)) {
    return headers;
  }
  if (Object.getOwnPropertySymbols(headers).length === 0) {
    return headers;
  }
  const normalized = /* @__PURE__ */ Object.create(null);
  const headerRecord = headers;
  for (const key of Object.getOwnPropertyNames(headerRecord)) {
    normalized[key] = String(headerRecord[key]);
  }
  return normalized;
}
function normalizeRequestInitHeadersForFetch(init) {
  if (!init?.headers) {
    return init;
  }
  const headers = normalizeHeadersInitForFetch(init.headers);
  if (headers === init.headers) {
    return init;
  }
  return { ...init, headers };
}
var init_fetch_headers = __esm({
  "src/infra/fetch-headers.ts"() {
    "use strict";
  }
});

// src/proxy-capture/paths.ts
import path6 from "node:path";
function resolveDebugProxyRootDir(env = process.env) {
  return path6.join(resolveStateDir(env), "debug-proxy");
}
function resolveDebugProxyDbPath(env = process.env) {
  return path6.join(resolveDebugProxyRootDir(env), "capture.sqlite");
}
function resolveDebugProxyBlobDir(env = process.env) {
  return path6.join(resolveDebugProxyRootDir(env), "blobs");
}
function resolveDebugProxyCertDir(env = process.env) {
  return path6.join(resolveDebugProxyRootDir(env), "certs");
}
var init_paths2 = __esm({
  "src/proxy-capture/paths.ts"() {
    "use strict";
    init_paths();
  }
});

// src/proxy-capture/env.ts
import { randomUUID as randomUUID2 } from "node:crypto";
import process2 from "node:process";
import { createAmbientNodeProxyAgent } from "@openclaw/proxyline";
function isTruthy(value) {
  return value === "1" || value === "true" || value === "yes" || value === "on";
}
function resolveDebugProxySettings(env = process2.env) {
  const enabled = isTruthy(env[OPENCLAW_DEBUG_PROXY_ENABLED]);
  const explicitSessionId = env[OPENCLAW_DEBUG_PROXY_SESSION_ID]?.trim() || void 0;
  const sessionId = explicitSessionId ?? (cachedImplicitSessionId ??= randomUUID2());
  return {
    enabled,
    required: isTruthy(env[OPENCLAW_DEBUG_PROXY_REQUIRE]),
    proxyUrl: env[OPENCLAW_DEBUG_PROXY_URL]?.trim() || void 0,
    dbPath: resolveDebugProxyDbPath(env),
    blobDir: resolveDebugProxyBlobDir(env),
    certDir: env[OPENCLAW_DEBUG_PROXY_CERT_DIR]?.trim() || resolveDebugProxyCertDir(env),
    sessionId,
    sourceProcess: "openclaw"
  };
}
var OPENCLAW_DEBUG_PROXY_ENABLED, OPENCLAW_DEBUG_PROXY_URL, OPENCLAW_DEBUG_PROXY_CERT_DIR, OPENCLAW_DEBUG_PROXY_SESSION_ID, OPENCLAW_DEBUG_PROXY_REQUIRE, cachedImplicitSessionId;
var init_env = __esm({
  "src/proxy-capture/env.ts"() {
    "use strict";
    init_paths2();
    OPENCLAW_DEBUG_PROXY_ENABLED = "OPENCLAW_DEBUG_PROXY_ENABLED";
    OPENCLAW_DEBUG_PROXY_URL = "OPENCLAW_DEBUG_PROXY_URL";
    OPENCLAW_DEBUG_PROXY_CERT_DIR = "OPENCLAW_DEBUG_PROXY_CERT_DIR";
    OPENCLAW_DEBUG_PROXY_SESSION_ID = "OPENCLAW_DEBUG_PROXY_SESSION_ID";
    OPENCLAW_DEBUG_PROXY_REQUIRE = "OPENCLAW_DEBUG_PROXY_REQUIRE";
  }
});

// src/infra/crypto-digest.ts
import { createHash } from "node:crypto";
function sha256Hex(input) {
  return createHash("sha256").update(input).digest("hex");
}
var init_crypto_digest = __esm({
  "src/infra/crypto-digest.ts"() {
    "use strict";
  }
});

// src/infra/sqlite-runtime-version.ts
function parseSqliteVersion(value) {
  const match = SQLITE_VERSION_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }
  const major = Number.parseInt(match[1] ?? "", 10);
  const minor = Number.parseInt(match[2] ?? "", 10);
  const patch = Number.parseInt(match[3] ?? "", 10);
  if (![major, minor, patch].every(Number.isSafeInteger)) {
    return null;
  }
  return { major, minor, patch };
}
function compareSqliteVersions(left, right) {
  if (left.major !== right.major) {
    return left.major - right.major;
  }
  if (left.minor !== right.minor) {
    return left.minor - right.minor;
  }
  return left.patch - right.patch;
}
function isSqliteWalResetSafeVersion(value) {
  return true;
  const version = parseSqliteVersion(value);
  if (!version) {
    return false;
  }
  if (compareSqliteVersions(version, SQLITE_WAL_RESET_FIXED_VERSION) >= 0) {
    return true;
  }
  return SQLITE_WAL_RESET_BACKPORTS.some(
    (backport) => version.major === backport.major && version.minor === backport.minor && version.patch >= backport.patch
  );
}
var SQLITE_WAL_RESET_FIXED_VERSION, SQLITE_WAL_RESET_BACKPORTS, SQLITE_VERSION_PATTERN;
var init_sqlite_runtime_version = __esm({
  "src/infra/sqlite-runtime-version.ts"() {
    "use strict";
    SQLITE_WAL_RESET_FIXED_VERSION = { major: 3, minor: 51, patch: 3 };
    SQLITE_WAL_RESET_BACKPORTS = [
      { major: 3, minor: 44, patch: 6 },
      { major: 3, minor: 50, patch: 7 }
    ];
    SQLITE_VERSION_PATTERN = /^(\d+)\.(\d+)\.(\d+)$/u;
  }
});

// src/shared/global-singleton.ts
function resolveGlobalSingleton(key, create) {
  const globalStore2 = globalThis;
  if (Object.hasOwn(globalStore2, key)) {
    return globalStore2[key];
  }
  const created = create();
  globalStore2[key] = created;
  return created;
}
var init_global_singleton = __esm({
  "src/shared/global-singleton.ts"() {
    "use strict";
  }
});

// src/infra/warning-filter.ts
function shouldIgnoreWarning(warning) {
  if (warning.code === "DEP0040" && warning.message?.includes("punycode")) {
    return true;
  }
  if (warning.code === "DEP0060" && warning.message?.includes("util._extend")) {
    return true;
  }
  if (warning.name === "ExperimentalWarning" && warning.message?.includes("SQLite is an experimental feature")) {
    return true;
  }
  return false;
}
function normalizeWarningArgs(args) {
  const warningArg = args[0];
  const secondArg = args[1];
  const thirdArg = args[2];
  let name;
  let code;
  let message;
  if (warningArg instanceof Error) {
    name = warningArg.name;
    message = warningArg.message;
    code = warningArg.code;
  } else if (typeof warningArg === "string") {
    message = warningArg;
  }
  if (secondArg && typeof secondArg === "object" && !Array.isArray(secondArg)) {
    const options = secondArg;
    if (typeof options.type === "string") {
      name = options.type;
    }
    if (typeof options.code === "string") {
      code = options.code;
    }
  } else {
    if (typeof secondArg === "string") {
      name = secondArg;
    }
    if (typeof thirdArg === "string") {
      code = thirdArg;
    }
  }
  return { name, code, message };
}
function installProcessWarningFilter() {
  const state = resolveGlobalSingleton(warningFilterKey, () => ({
    installed: false
  }));
  if (state.installed) {
    return;
  }
  const originalEmitWarning = process.emitWarning.bind(process);
  const wrappedEmitWarning = ((...args) => {
    if (shouldIgnoreWarning(normalizeWarningArgs(args))) {
      return;
    }
    if (args[0] instanceof Error && args[1] && typeof args[1] === "object" && !Array.isArray(args[1])) {
      const warning = args[0];
      const emitted = Object.assign(new Error(warning.message), {
        name: warning.name,
        code: warning.code
      });
      process.emit("warning", emitted);
      return;
    }
    Reflect.apply(originalEmitWarning, process, args);
  });
  process.emitWarning = wrappedEmitWarning;
  state.installed = true;
}
var warningFilterKey;
var init_warning_filter = __esm({
  "src/infra/warning-filter.ts"() {
    "use strict";
    init_global_singleton();
    warningFilterKey = /* @__PURE__ */ Symbol.for("openclaw.warning-filter");
  }
});

// src/infra/node-sqlite.ts
import { createRequire as createRequire2 } from "node:module";
function assertSqliteWalResetSafeVersion(version, nodeVersion) {
  if (isSqliteWalResetSafeVersion(version)) {
    return;
  }
  const variables = process.config?.variables;
  const isShared = variables?.node_shared_sqlite === true || variables?.node_shared_sqlite === "true";
  const wording = isShared ? "uses shared system" : "embeds";
  const remediation = isShared ? "Upgrade the system SQLite library to one of those safe versions, or use a Node build embedding a safe version." : "Upgrade to Node 22.22.3+, 24.15.0+, or 25.9.0+ before retrying.";
  throw new Error(
    `OpenClaw requires SQLite 3.51.3+, 3.50.7+ within 3.50.x, or 3.44.6+ within 3.44.x for WAL safety; Node ${nodeVersion} ${wording} SQLite ${version}, which is affected by the upstream WAL-reset database corruption bug. ${remediation}`
  );
}
function assertSafeSqliteRuntime(sqlite) {
  if (validatedSqliteModule === sqlite) {
    return;
  }
  const database = new sqlite.DatabaseSync(":memory:");
  try {
    const row = database.prepare("SELECT sqlite_version() AS version").get();
    const version = typeof row?.version === "string" ? row.version : "unknown";
    assertSqliteWalResetSafeVersion(version, process.versions.node);
    validatedSqliteModule = sqlite;
  } finally {
    database.close();
  }
}
function requireNodeSqlite() {
  installProcessWarningFilter();
  try {
    const sqlite = require2("node:sqlite");
    assertSafeSqliteRuntime(sqlite);
    return sqlite;
  } catch (err) {
    const message = formatErrorMessage2(err);
    throw new Error(`SQLite support is unavailable or unsafe in this Node runtime. ${message}`, {
      cause: err
    });
  }
}
var require2, validatedSqliteModule;
var init_node_sqlite = __esm({
  "src/infra/node-sqlite.ts"() {
    "use strict";
    init_errors2();
    init_sqlite_runtime_version();
    init_warning_filter();
    require2 = createRequire2(import.meta.url);
  }
});

// src/infra/private-mode.ts
import { randomUUID as randomUUID3 } from "node:crypto";
import { chmodSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import path7 from "node:path";
function hasRestrictivePermissions(target) {
  try {
    return (statSync(target).mode & 63) === 0;
  } catch {
    return false;
  }
}
function filesystemRejectsChmod(target) {
  let probePath;
  try {
    const probeDir = statSync(target).isDirectory() ? target : path7.dirname(target);
    probePath = path7.join(probeDir, `.openclaw-chmod-probe-${randomUUID3()}`);
    writeFileSync(probePath, "", { flag: "wx", mode: PRIVATE_PROBE_FILE_MODE });
  } catch {
    return false;
  }
  try {
    chmodSync(probePath, PRIVATE_PROBE_FILE_MODE);
    return false;
  } catch (err) {
    return err.code === "EPERM";
  } finally {
    try {
      unlinkSync(probePath);
    } catch {
    }
  }
}
function canIgnorePrivateChmodError(target, code) {
  if (code && CHMOD_UNSUPPORTED_CODES.has(code)) {
    return true;
  }
  if (code === "EROFS") {
    return hasRestrictivePermissions(target);
  }
  if (code !== "EPERM") {
    return false;
  }
  return hasRestrictivePermissions(target) || filesystemRejectsChmod(target);
}
function applyPrivateModeSync(target, mode) {
  try {
    chmodSync(target, mode);
    return { applied: true };
  } catch (err) {
    if (!canIgnorePrivateChmodError(target, err.code)) {
      throw err;
    }
    return { applied: false, error: err };
  }
}
var CHMOD_UNSUPPORTED_CODES, PRIVATE_PROBE_FILE_MODE;
var init_private_mode = __esm({
  "src/infra/private-mode.ts"() {
    "use strict";
    CHMOD_UNSUPPORTED_CODES = /* @__PURE__ */ new Set(["ENOTSUP", "EOPNOTSUPP", "EINVAL"]);
    PRIVATE_PROBE_FILE_MODE = 384;
  }
});

// src/infra/sqlite-files.ts
function resolveSqliteDatabaseFilePaths(pathname) {
  return SQLITE_DATABASE_FILE_SUFFIXES.map((suffix) => `${pathname}${suffix}`);
}
var SQLITE_DATABASE_FILE_SUFFIXES;
var init_sqlite_files = __esm({
  "src/infra/sqlite-files.ts"() {
    "use strict";
    SQLITE_DATABASE_FILE_SUFFIXES = ["", "-wal", "-shm", "-journal"];
  }
});

// src/infra/sqlite-integrity.ts
function isTerminalSqliteIntegrityError(error) {
  if (error.name !== "SqliteIntegrityError") {
    return false;
  }
  const cause = error.cause;
  if (!cause) {
    return true;
  }
  if (typeof cause.errcode !== "number") {
    return false;
  }
  const primaryCode = cause.errcode & 255;
  return primaryCode === SQLITE_CORRUPT_ERRCODE || primaryCode === SQLITE_NOTADB_ERRCODE;
}
function assertSqliteIntegrity(database, databaseLabel) {
  const integrityCheck = runSqliteCheck(database, databaseLabel, "integrity_check");
  runSqliteForeignKeyCheck(database, databaseLabel);
  return { integrityCheck };
}
function assertSqliteTableIntegrity(database, databaseLabel, tableName) {
  runSqliteCheck(database, `${databaseLabel} table ${tableName}`, "integrity_check", tableName);
}
function runSqliteCheck(database, databaseLabel, pragma, tableName) {
  const argument = tableName ? `('${tableName.replaceAll("'", "''")}')` : "";
  let rows;
  try {
    rows = database.prepare(`PRAGMA ${pragma}${argument};`).all();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw createSqliteIntegrityError(
      `SQLite ${pragma} failed for ${databaseLabel}: ${message}`,
      error
    );
  }
  const results = rows.map((row) => row[pragma] ?? Object.values(row)[0]);
  if (results.length === 1 && results[0] === "ok") {
    return "ok";
  }
  const details = results.map((result) => String(result)).join("; ") || "no result";
  throw createSqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${details}`);
}
function runSqliteForeignKeyCheck(database, databaseLabel) {
  let violationCount = 0;
  const violations = [];
  try {
    const statement = database.prepare("PRAGMA foreign_key_check;");
    statement.setReadBigInts(true);
    for (const violation of statement.iterate()) {
      violationCount += 1;
      retainSortedForeignKeyViolation(violations, violation);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw createSqliteIntegrityError(
      `SQLite foreign_key_check failed for ${databaseLabel}: ${message}`,
      error
    );
  }
  if (violations.length === 0) {
    return;
  }
  const details = violations.map(formatSqliteForeignKeyViolation);
  if (violationCount > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) {
    details.push("additional violations omitted");
  }
  throw createSqliteIntegrityError(
    `SQLite foreign_key_check failed for ${databaseLabel}: ${details.join("; ")}`
  );
}
function createSqliteIntegrityError(message, cause) {
  const error = cause === void 0 ? new Error(message) : new Error(message, { cause });
  error.name = "SqliteIntegrityError";
  return error;
}
function retainSortedForeignKeyViolation(retained, violation) {
  retained.push(violation);
  retained.sort(compareSqliteForeignKeyViolations);
  if (retained.length > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) {
    retained.pop();
  }
}
function compareSqliteForeignKeyViolations(left, right) {
  const tableOrder = Buffer.compare(Buffer.from(left.table), Buffer.from(right.table));
  if (tableOrder !== 0) {
    return tableOrder;
  }
  if (left.rowid === null || right.rowid === null) {
    if (left.rowid !== right.rowid) {
      return left.rowid === null ? -1 : 1;
    }
  } else if (left.rowid !== right.rowid) {
    return left.rowid < right.rowid ? -1 : 1;
  }
  const parentOrder = Buffer.compare(Buffer.from(left.parent), Buffer.from(right.parent));
  if (parentOrder !== 0) {
    return parentOrder;
  }
  if (left.fkid === right.fkid) {
    return 0;
  }
  return left.fkid < right.fkid ? -1 : 1;
}
function formatSqliteForeignKeyViolation(violation) {
  const row = violation.rowid === null ? "row without rowid" : `row ${violation.rowid.toString()}`;
  return `${violation.table} ${row} references ${violation.parent} (foreign key ${violation.fkid.toString()})`;
}
var MAX_REPORTED_FOREIGN_KEY_VIOLATIONS, SQLITE_CORRUPT_ERRCODE, SQLITE_NOTADB_ERRCODE;
var init_sqlite_integrity = __esm({
  "src/infra/sqlite-integrity.ts"() {
    "use strict";
    MAX_REPORTED_FOREIGN_KEY_VIOLATIONS = 5;
    SQLITE_CORRUPT_ERRCODE = 11;
    SQLITE_NOTADB_ERRCODE = 26;
  }
});

// src/infra/sqlite-transaction.ts
function nextSavepointName() {
  nextSavepointId += 1;
  return `openclaw_tx_${nextSavepointId}`;
}
function isPromiseLike(value) {
  return Boolean(value && typeof value.then === "function");
}
function assertSyncTransactionResult(value) {
  if (isPromiseLike(value)) {
    throw new Error(
      "SQLite write transactions must be synchronous; Promise returns are not supported."
    );
  }
}
function sqliteErrorCode(error) {
  const code = error && typeof error === "object" ? error.code : void 0;
  return typeof code === "string" ? code : void 0;
}
function sqliteExtendedResultCode(error) {
  const errcode = error && typeof error === "object" ? error.errcode : void 0;
  return typeof errcode === "number" && Number.isInteger(errcode) ? errcode : void 0;
}
function sqlitePrimaryResultCode(error) {
  const errcode = sqliteExtendedResultCode(error);
  return errcode === void 0 ? void 0 : errcode & SQLITE_PRIMARY_RESULT_CODE_MASK;
}
function isSqliteLockError(error) {
  const code = sqliteErrorCode(error);
  if (code !== void 0 && SQLITE_LOCK_ERROR_CODES.has(code)) {
    return true;
  }
  const primaryCode = sqlitePrimaryResultCode(error);
  return primaryCode === SQLITE_BUSY_RESULT_CODE || primaryCode === SQLITE_LOCKED_RESULT_CODE;
}
function slowBusyWaitThresholdMs(options) {
  if (options?.busyTimeoutMs === void 0) {
    return DEFAULT_SLOW_BUSY_WAIT_MS;
  }
  return Math.min(DEFAULT_SLOW_BUSY_WAIT_MS, Math.max(1, options.busyTimeoutMs));
}
function slowTransactionHoldThresholdMs(options) {
  return options?.slowTransactionHoldMs ?? DEFAULT_SLOW_TRANSACTION_HOLD_MS;
}
function transactionLogger(options) {
  return options?.logger ?? transactionLog;
}
function logSlowTransactionHold(params) {
  if (params.elapsedMs < slowTransactionHoldThresholdMs(params.options)) {
    return;
  }
  transactionLogger(params.options).warn("slow SQLite transaction hold", {
    async: false,
    ...params.options?.databaseLabel ? { database: params.options.databaseLabel } : {},
    elapsedMs: params.elapsedMs,
    ...params.options?.operationLabel ? { operation: params.options.operationLabel } : {},
    pid: process.pid,
    thresholdMs: slowTransactionHoldThresholdMs(params.options)
  });
}
function logSlowTransactionStep(params) {
  if (params.elapsedMs < slowBusyWaitThresholdMs(params.options)) {
    return;
  }
  transactionLogger(params.options).warn("slow SQLite transaction lock wait", {
    async: false,
    ...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
    ...params.options?.databaseLabel ? { database: params.options.databaseLabel } : {},
    elapsedMs: params.elapsedMs,
    ...params.options?.operationLabel ? { operation: params.options.operationLabel } : {},
    pid: process.pid,
    step: params.step
  });
}
function execTimedTransactionStep(params) {
  const startedAt = Date.now();
  try {
    params.db.exec(params.sql);
    const elapsedMs = Date.now() - startedAt;
    logSlowTransactionStep({
      elapsedMs,
      options: params.options,
      step: params.step
    });
    return elapsedMs;
  } catch (error) {
    const elapsedMs = Date.now() - startedAt;
    if (isSqliteLockError(error)) {
      const sqliteErrcode = sqliteExtendedResultCode(error);
      const sqlitePrimaryCode = sqlitePrimaryResultCode(error);
      transactionLogger(params.options).warn("SQLite transaction lock wait failed", {
        async: false,
        ...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
        ...params.options?.databaseLabel ? { database: params.options.databaseLabel } : {},
        code: sqliteErrorCode(error),
        elapsedMs,
        failureKind: "lock-contention",
        ...params.options?.operationLabel ? { operation: params.options.operationLabel } : {},
        pid: process.pid,
        ...sqliteErrcode !== void 0 ? { sqliteErrcode } : {},
        ...sqlitePrimaryCode !== void 0 ? { sqlitePrimaryCode } : {},
        step: params.step
      });
    }
    throw error;
  }
}
function beginTransaction(db, options, mode) {
  execTimedTransactionStep({
    db,
    options,
    sql: mode === "immediate" ? "BEGIN IMMEDIATE" : "BEGIN",
    step: "begin"
  });
}
function commitImmediateTransaction(db, options) {
  execTimedTransactionStep({
    db,
    options,
    sql: "COMMIT",
    step: "commit"
  });
}
function abortImmediateTransaction(db) {
  try {
    db.exec("ROLLBACK");
  } catch {
    try {
      db.close();
    } catch {
    }
  }
}
function getTransactionDepth(db) {
  return transactionDepthByDatabase.get(db) ?? 0;
}
function setTransactionDepth(db, depth) {
  if (depth <= 0) {
    transactionDepthByDatabase.delete(db);
    return;
  }
  transactionDepthByDatabase.set(db, depth);
}
function runSqliteTransactionSync(db, operation, mode, options) {
  const depth = getTransactionDepth(db);
  if (depth > 0) {
    const savepointName = nextSavepointName();
    db.exec(`SAVEPOINT ${savepointName}`);
    setTransactionDepth(db, depth + 1);
    try {
      const result2 = operation();
      assertSyncTransactionResult(result2);
      db.exec(`RELEASE SAVEPOINT ${savepointName}`);
      return result2;
    } catch (error) {
      try {
        db.exec(`ROLLBACK TO SAVEPOINT ${savepointName}`);
      } finally {
        db.exec(`RELEASE SAVEPOINT ${savepointName}`);
      }
      throw error;
    } finally {
      setTransactionDepth(db, depth);
    }
  }
  beginTransaction(db, options, mode);
  setTransactionDepth(db, 1);
  let transactionStillActive = true;
  let result;
  const transactionStartedAt = Date.now();
  try {
    result = operation();
    assertSyncTransactionResult(result);
  } catch (error) {
    try {
      abortImmediateTransaction(db);
      transactionStillActive = false;
    } catch {
    }
    throw error;
  } finally {
    if (!transactionStillActive) {
      setTransactionDepth(db, 0);
    }
  }
  try {
    logSlowTransactionHold({
      elapsedMs: Date.now() - transactionStartedAt,
      options
    });
    commitImmediateTransaction(db, options);
    transactionStillActive = false;
    return result;
  } catch (error) {
    try {
      abortImmediateTransaction(db);
      transactionStillActive = false;
    } catch {
    }
    throw error;
  } finally {
    if (!transactionStillActive) {
      setTransactionDepth(db, 0);
    }
  }
}
function runSqliteImmediateTransactionSync(db, operation, options) {
  return runSqliteTransactionSync(db, operation, "immediate", options);
}
var transactionDepthByDatabase, SQLITE_LOCK_ERROR_CODES, SQLITE_BUSY_RESULT_CODE, SQLITE_LOCKED_RESULT_CODE, SQLITE_PRIMARY_RESULT_CODE_MASK, DEFAULT_SLOW_BUSY_WAIT_MS, DEFAULT_SLOW_TRANSACTION_HOLD_MS, nextSavepointId, transactionLog;
var init_sqlite_transaction = __esm({
  "src/infra/sqlite-transaction.ts"() {
    "use strict";
    init_subsystem();
    transactionDepthByDatabase = /* @__PURE__ */ new WeakMap();
    SQLITE_LOCK_ERROR_CODES = /* @__PURE__ */ new Set(["SQLITE_BUSY", "SQLITE_LOCKED"]);
    SQLITE_BUSY_RESULT_CODE = 5;
    SQLITE_LOCKED_RESULT_CODE = 6;
    SQLITE_PRIMARY_RESULT_CODE_MASK = 255;
    DEFAULT_SLOW_BUSY_WAIT_MS = 1e3;
    DEFAULT_SLOW_TRANSACTION_HOLD_MS = 1e3;
    nextSavepointId = 0;
    transactionLog = createSubsystemLogger("sqlite/transaction");
  }
});

// src/infra/sqlite-strict.ts
function quoteSqliteIdentifier(identifier) {
  return `"${identifier.replaceAll('"', '""')}"`;
}
function readMainTableList(db) {
  return db.prepare("PRAGMA table_list").all().filter(
    (row) => row.schema === "main" && typeof row.name === "string" && !row.name.startsWith("sqlite_")
  );
}
function readTableColumns(db, tableName) {
  return db.prepare(`PRAGMA table_xinfo(${quoteSqliteIdentifier(tableName)})`).all();
}
function readVisibleColumns(db, tableName) {
  return readTableColumns(db, tableName).filter((row) => Number(row.hidden ?? 0) === 0).map((row) => {
    if (typeof row.name !== "string" || row.name.length === 0) {
      throw new Error(`SQLite table ${tableName} has an invalid column name`);
    }
    return row.name;
  });
}
function readTableRowidModel(db, tableName, tableRow) {
  if (Number(tableRow.wr ?? 0) === 1) {
    return { alias: null, storage: "without-rowid" };
  }
  const columns = readTableColumns(db, tableName);
  const primaryKeyColumns = columns.filter((column) => Number(column.pk ?? 0) > 0);
  const primaryKeyIndex = db.prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`).get(tableName);
  const primaryKeyType = primaryKeyColumns[0]?.type;
  if (primaryKeyColumns.length === 1 && typeof primaryKeyType === "string" && primaryKeyType.toUpperCase() === "INTEGER" && !primaryKeyIndex) {
    return { alias: null, storage: "integer-primary-key" };
  }
  const declaredNames = new Set(
    columns.flatMap(
      (column) => typeof column.name === "string" ? [column.name.toLowerCase()] : []
    )
  );
  const alias = SQLITE_ROWID_ALIASES.find((candidate) => !declaredNames.has(candidate)) ?? null;
  if (!alias) {
    throw new Error(
      `SQLite table ${tableName} shadows every rowid alias; its implicit rowids cannot be migrated safely`
    );
  }
  return { alias, storage: "implicit" };
}
function readCanonicalStrictTables(schemaSql) {
  const sqlite = requireNodeSqlite();
  const canonical = new sqlite.DatabaseSync(":memory:");
  try {
    canonical.exec(schemaSql);
    const tables = readMainTableList(canonical).filter((row) => row.type === "table");
    const nonStrict = tables.flatMap(
      (row) => Number(row.strict ?? 0) === 1 || typeof row.name !== "string" ? [] : [row.name]
    );
    if (nonStrict.length > 0) {
      throw new Error(
        `Canonical SQLite schema contains non-STRICT tables: ${nonStrict.toSorted().join(", ")}`
      );
    }
    return tables.map((row) => {
      if (typeof row.name !== "string") {
        throw new Error("Canonical SQLite schema contains an unnamed table");
      }
      const schemaRow = canonical.prepare("SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = ?").get(row.name);
      if (typeof schemaRow?.sql !== "string") {
        throw new Error(`Canonical SQLite table ${row.name} has no CREATE statement`);
      }
      const rowidModel = readTableRowidModel(canonical, row.name, row);
      return {
        columns: readVisibleColumns(canonical, row.name),
        createSql: schemaRow.sql,
        name: row.name,
        rowidAlias: rowidModel.alias,
        rowidStorage: rowidModel.storage,
        usesAutoincrement: /\bAUTOINCREMENT\b/iu.test(schemaRow.sql)
      };
    }).toSorted((left, right) => left.name.localeCompare(right.name));
  } finally {
    canonical.close();
  }
}
function rewriteCreateTableName(createSql, replacementName) {
  const openingParen = createSql.indexOf("(");
  if (openingParen === -1) {
    throw new Error("Canonical SQLite table CREATE statement has no column list");
  }
  return `CREATE TABLE ${quoteSqliteIdentifier(replacementName)} ${createSql.slice(openingParen)}`;
}
function readPreservedSchemaObjects(db, tableNames) {
  return db.prepare(
    "SELECT type, name, tbl_name, sql FROM sqlite_schema WHERE type IN ('index', 'trigger', 'view')"
  ).all().flatMap((row) => {
    if (row.type !== "index" && row.type !== "trigger" && row.type !== "view" || typeof row.name !== "string" || typeof row.tbl_name !== "string" || typeof row.sql !== "string" || row.type === "index" && !tableNames.has(row.tbl_name)) {
      return [];
    }
    return [{ name: row.name, sql: row.sql, type: row.type }];
  }).toSorted((left, right) => {
    const typeOrder = { view: 0, index: 1, trigger: 2 };
    return typeOrder[left.type] - typeOrder[right.type] || left.name.localeCompare(right.name);
  });
}
function readAutoincrementHighWater(db, tableName) {
  const sequenceTable = db.prepare(
    "SELECT 1 AS found FROM sqlite_schema WHERE type = 'table' AND name = 'sqlite_sequence'"
  ).get();
  if (!sequenceTable) {
    return null;
  }
  const row = db.prepare("SELECT CAST(seq AS TEXT) AS seq FROM sqlite_sequence WHERE name = ?").get(tableName);
  if (row === void 0) {
    return null;
  }
  const normalized = typeof row.seq === "string" ? /^(\d+)(?:\.0+)?$/u.exec(row.seq)?.[1] : null;
  if (!normalized) {
    throw new Error(
      `SQLite table ${tableName} has an invalid AUTOINCREMENT high-water mark (${typeof row.seq}: ${String(row.seq)})`
    );
  }
  return normalized;
}
function restoreAutoincrementHighWater(db, tableName, previousHighWater) {
  if (previousHighWater === null) {
    return;
  }
  const currentHighWater = readAutoincrementHighWater(db, tableName);
  const restored = currentHighWater === null || BigInt(previousHighWater) > BigInt(currentHighWater) ? previousHighWater : currentHighWater;
  db.prepare("DELETE FROM sqlite_sequence WHERE name = ?").run(tableName);
  db.prepare("INSERT INTO sqlite_sequence (name, seq) VALUES (?, CAST(? AS INTEGER))").run(
    tableName,
    restored
  );
}
function assertMatchingColumns(tableName, currentColumns, canonicalColumns) {
  const current = new Set(currentColumns);
  const canonical = new Set(canonicalColumns);
  const missing = canonicalColumns.filter((column) => !current.has(column));
  const extra = currentColumns.filter((column) => !canonical.has(column));
  if (missing.length === 0 && extra.length === 0) {
    return;
  }
  const details = [
    missing.length > 0 ? `missing ${missing.join(", ")}` : "",
    extra.length > 0 ? `extra ${extra.join(", ")}` : ""
  ].filter(Boolean).join("; ");
  throw new Error(`SQLite table ${tableName} does not match its canonical columns (${details})`);
}
function readForeignKeysEnabled(db) {
  const row = db.prepare("PRAGMA foreign_keys").get();
  return Number(row?.foreign_keys ?? 0) === 1;
}
function migrateSqliteSchemaToStrictInTransaction(db, schemaSql, options = {}) {
  if (!db.isTransaction) {
    throw new Error("SQLite STRICT schema migration requires an active transaction");
  }
  const canonicalTables = readCanonicalStrictTables(schemaSql);
  db.exec(schemaSql);
  const currentTableRows = new Map(
    readMainTableList(db).filter((row) => row.type === "table" && typeof row.name === "string").map((row) => [row.name, row])
  );
  const tablesToMigrate = canonicalTables.filter(
    (table) => Number(currentTableRows.get(table.name)?.strict ?? 0) !== 1
  );
  if (tablesToMigrate.length === 0) {
    return { migratedTables: [] };
  }
  if (readForeignKeysEnabled(db)) {
    throw new Error("SQLite STRICT schema migration requires foreign_keys=OFF before BEGIN");
  }
  const names = new Set(tablesToMigrate.map((table) => table.name));
  const preservedObjects = readPreservedSchemaObjects(db, names);
  for (const object of preservedObjects) {
    if (object.type === "trigger") {
      db.exec(`DROP TRIGGER ${quoteSqliteIdentifier(object.name)};`);
    }
  }
  for (const object of preservedObjects) {
    if (object.type === "view") {
      db.exec(`DROP VIEW ${quoteSqliteIdentifier(object.name)};`);
    }
  }
  for (const [index, table] of tablesToMigrate.entries()) {
    const migrationTable = `${STRICT_MIGRATION_TABLE_PREFIX}${index}_${table.name}`;
    if (currentTableRows.has(migrationTable)) {
      throw new Error(`SQLite STRICT migration table already exists: ${migrationTable}`);
    }
    const currentColumns = readVisibleColumns(db, table.name);
    assertMatchingColumns(table.name, currentColumns, table.columns);
    const currentTableRow = currentTableRows.get(table.name);
    if (!currentTableRow) {
      throw new Error(`SQLite table ${table.name} disappeared during STRICT migration`);
    }
    const currentRowidModel = readTableRowidModel(db, table.name, currentTableRow);
    if (currentRowidModel.storage !== table.rowidStorage) {
      throw new Error(
        `SQLite table ${table.name} changes rowid storage from ${currentRowidModel.storage} to ${table.rowidStorage}; refusing an identity-changing STRICT migration`
      );
    }
    const previousHighWater = table.usesAutoincrement ? readAutoincrementHighWater(db, table.name) : null;
    db.exec(rewriteCreateTableName(table.createSql, migrationTable));
    const columns = table.columns.map(quoteSqliteIdentifier);
    if (table.rowidAlias) {
      columns.unshift(quoteSqliteIdentifier(table.rowidAlias));
    }
    const copyColumns = columns.join(", ");
    try {
      db.exec(
        `INSERT INTO ${quoteSqliteIdentifier(migrationTable)} (${copyColumns}) SELECT ${copyColumns} FROM ${quoteSqliteIdentifier(table.name)};`
      );
    } catch (error) {
      throw new Error(`Failed migrating SQLite table ${table.name} to STRICT`, { cause: error });
    }
    db.exec(`DROP TABLE ${quoteSqliteIdentifier(table.name)};`);
    db.exec(
      `ALTER TABLE ${quoteSqliteIdentifier(migrationTable)} RENAME TO ${quoteSqliteIdentifier(table.name)};`
    );
    restoreAutoincrementHighWater(db, table.name, previousHighWater);
  }
  db.exec(schemaSql);
  const findObject = db.prepare(
    "SELECT 1 AS found FROM sqlite_schema WHERE type = ? AND name = ? LIMIT 1"
  );
  for (const object of preservedObjects) {
    if (!findObject.get(object.type, object.name)) {
      db.exec(object.sql);
    }
  }
  assertSqliteIntegrity(db, options.databaseLabel ?? "SQLite STRICT schema migration");
  return { migratedTables: tablesToMigrate.map((table) => table.name) };
}
function migrateSqliteSchemaToStrict(db, schemaSql, options = {}) {
  if (db.isTransaction) {
    throw new Error("SQLite STRICT schema migration cannot start inside a transaction");
  }
  const foreignKeysWereEnabled = readForeignKeysEnabled(db);
  if (foreignKeysWereEnabled) {
    db.exec("PRAGMA foreign_keys = OFF;");
  }
  try {
    return runSqliteImmediateTransactionSync(
      db,
      () => migrateSqliteSchemaToStrictInTransaction(db, schemaSql, options),
      {
        busyTimeoutMs: options.busyTimeoutMs ?? DEFAULT_STRICT_MIGRATION_BUSY_TIMEOUT_MS,
        databaseLabel: options.databaseLabel,
        operationLabel: "sqlite.strict-schema-migration"
      }
    );
  } finally {
    if (foreignKeysWereEnabled) {
      db.exec("PRAGMA foreign_keys = ON;");
    }
  }
}
var DEFAULT_STRICT_MIGRATION_BUSY_TIMEOUT_MS, STRICT_MIGRATION_TABLE_PREFIX, SQLITE_ROWID_ALIASES;
var init_sqlite_strict = __esm({
  "src/infra/sqlite-strict.ts"() {
    "use strict";
    init_node_sqlite();
    init_sqlite_integrity();
    init_sqlite_transaction();
    DEFAULT_STRICT_MIGRATION_BUSY_TIMEOUT_MS = 5e3;
    STRICT_MIGRATION_TABLE_PREFIX = "__openclaw_strict_migration_";
    SQLITE_ROWID_ALIASES = ["_rowid_", "rowid", "oid"];
  }
});

// src/shared/number-coercion.ts
var init_number_coercion2 = __esm({
  "src/shared/number-coercion.ts"() {
    "use strict";
    init_number_coercion();
  }
});

// src/infra/sqlite-wal.ts
import fs5 from "node:fs";
import path8 from "node:path";
function configureSqliteBusyTimeout(db, busyTimeoutMs) {
  const normalizedTimeoutMs = normalizeNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
  db.exec(`PRAGMA busy_timeout = ${normalizedTimeoutMs};`);
  return normalizedTimeoutMs;
}
function enableIncrementalAutoVacuumForFreshDatabase(db) {
  const row = db.prepare("PRAGMA page_count").get();
  if (row?.page_count === 0) {
    db.exec("PRAGMA auto_vacuum = INCREMENTAL;");
  }
}
function configureSqlitePreSchemaPragmas(db, options = {}) {
  if (options.busyTimeoutMs !== void 0) {
    configureSqliteBusyTimeout(db, options.busyTimeoutMs);
  }
  enableIncrementalAutoVacuumForFreshDatabase(db);
}
function normalizeNonNegativeInteger(value, label) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative integer`);
  }
  return value;
}
function findExistingVolumePaths(targetPath) {
  let current = path8.resolve(targetPath);
  while (true) {
    let stats;
    try {
      stats = fs5.statSync(current);
    } catch {
      const parent = path8.dirname(current);
      if (parent === current) {
        return null;
      }
      current = parent;
      continue;
    }
    const existingPath = fs5.realpathSync(current);
    return {
      canonicalPath: stats.isDirectory() ? existingPath : path8.dirname(existingPath),
      originalPath: stats.isDirectory() ? current : path8.dirname(current)
    };
  }
}
function decodeMountPath(value) {
  return value.replace(
    /\\([0-7]{3})/g,
    (_match, octal) => String.fromCharCode(Number.parseInt(octal, 8))
  );
}
function parseProcMountInfoEntries(contents) {
  const entries = [];
  for (const line of contents.split("\n")) {
    const separator = line.indexOf(" - ");
    if (separator === -1) {
      continue;
    }
    const fields = line.slice(0, separator).split(" ");
    const suffixFields = line.slice(separator + 3).split(" ");
    const mountPoint = fields[4];
    const fsType = suffixFields[0];
    if (mountPoint && fsType) {
      entries.push({
        mountPoint: decodeMountPath(mountPoint),
        fsType,
        ...suffixFields[1] ? { source: decodeMountPath(suffixFields[1]) } : {}
      });
    }
  }
  return entries;
}
function parseMountCommandEntries(contents) {
  const entries = [];
  for (const line of contents.split("\n")) {
    const linuxMatch = /^(.+) on (.+) type ([^,\s)]+) \(/.exec(line);
    if (linuxMatch) {
      const source = linuxMatch[1];
      const mountPoint = linuxMatch[2];
      const fsType = linuxMatch[3];
      if (source && mountPoint && fsType) {
        entries.push({ source, mountPoint, fsType });
      }
      continue;
    }
    const bsdMatch = /^(.+) on (.+) \(([^,\s)]+)/.exec(line);
    if (bsdMatch) {
      const source = bsdMatch[1];
      const mountPoint = bsdMatch[2];
      const fsType = bsdMatch[3];
      if (source && mountPoint && fsType) {
        entries.push({ source, mountPoint, fsType });
      }
    }
  }
  return entries;
}
function isMountCommandTimeout(error) {
  return error !== null && typeof error === "object" && "code" in error && error.code === "ETIMEDOUT";
}
function readMountEntries() {
  try {
    return {
      ok: true,
      value: parseProcMountInfoEntries(fs5.readFileSync(PROC_MOUNTINFO_PATH, "utf8"))
    };
  } catch {
  }
  try {
    return {
      ok: true,
      value: parseMountCommandEntries(
        String(
          process.getBuiltinModule("node:child_process").execFileSync("mount", [], {
            killSignal: "SIGKILL",
            timeout: MOUNT_COMMAND_TIMEOUT_MS
          })
        )
      )
    };
  } catch (error) {
    return isMountCommandTimeout(error) ? { ok: false, error: "timeout" } : { ok: true, value: [] };
  }
}
function isPathWithinMount(targetPath, mountPoint) {
  const resolvedTarget = path8.resolve(targetPath);
  const resolvedMountPoint = path8.resolve(mountPoint);
  return resolvedTarget === resolvedMountPoint || resolvedMountPoint === path8.parse(resolvedMountPoint).root || resolvedTarget.startsWith(`${resolvedMountPoint}${path8.sep}`);
}
function isSshfsMountSource(source) {
  if (!source) {
    return false;
  }
  const normalized = source.toLowerCase();
  return normalized === "sshfs" || normalized.startsWith("sshfs#") || normalized.startsWith("sshfs@") || /^(?:[^/\s:]+@)?[^/\s:]+:.*/u.test(source);
}
function resolveMountTypeJournalPolicy(entry) {
  const normalized = entry.fsType.toLowerCase();
  if (normalized.startsWith("nfs") || NETWORK_FILESYSTEM_TYPES.has(normalized)) {
    return "rollback";
  }
  if (normalized === "fuse.sshfs") {
    return "unsupported";
  }
  if ((normalized === "macfuse" || normalized === "osxfuse") && isSshfsMountSource(entry.source)) {
    return "unsupported";
  }
  return "wal";
}
function resolveMountEntryJournalPolicy(targetPath, mountEntries) {
  const mountEntry = mountEntries.filter((entry) => isPathWithinMount(targetPath, entry.mountPoint)).toSorted((a, b) => b.mountPoint.length - a.mountPoint.length)[0];
  return mountEntry ? resolveMountTypeJournalPolicy(mountEntry) : "wal";
}
function combineMountEntryJournalPolicies(targetPaths) {
  const mountResult = readMountEntries();
  if (!mountResult.ok) {
    return "rollback";
  }
  const policies = new Set(
    targetPaths.map((targetPath) => resolveMountEntryJournalPolicy(targetPath, mountResult.value))
  );
  if (policies.has("unsupported")) {
    return "unsupported";
  }
  return policies.has("rollback") ? "rollback" : "wal";
}
function isWindowsUncPath(targetPath) {
  return /^\\\\\?\\UNC\\[^\\]+\\[^\\]+/i.test(targetPath) || /^\\\\(?![?.]\\)[^\\]+\\[^\\]+/.test(targetPath);
}
function isWindowsDrivePath(targetPath) {
  return /^[A-Za-z]:[\\/]/.test(targetPath) || /^\\\\\?\\[A-Za-z]:[\\/]/i.test(targetPath);
}
function resolvePathJournalPolicy(targetPath) {
  if (process.platform === "win32") {
    const normalizedTargetPath = path8.win32.normalize(targetPath);
    if (isWindowsUncPath(normalizedTargetPath)) {
      return "rollback";
    }
    if (isWindowsDrivePath(normalizedTargetPath)) {
      try {
        return isWindowsUncPath(path8.win32.normalize(fs5.realpathSync.native(targetPath))) ? "rollback" : "wal";
      } catch {
        return "rollback";
      }
    }
  }
  const checkedPaths = findExistingVolumePaths(targetPath);
  if (!checkedPaths) {
    return "wal";
  }
  const mountLookupPaths = [checkedPaths.originalPath, checkedPaths.canonicalPath];
  if (typeof fs5.statfsSync !== "function") {
    return combineMountEntryJournalPolicies(mountLookupPaths);
  }
  try {
    const filesystemType = fs5.statfsSync(checkedPaths.canonicalPath).type;
    if (filesystemType === LINUX_NFS_SUPER_MAGIC || filesystemType === LINUX_SMB_SUPER_MAGIC || filesystemType === LINUX_CIFS_SUPER_MAGIC || filesystemType === LINUX_SMB2_SUPER_MAGIC) {
      return "rollback";
    }
  } catch {
    return combineMountEntryJournalPolicies(mountLookupPaths);
  }
  return combineMountEntryJournalPolicies(mountLookupPaths);
}
function readJournalModeResult(row) {
  if (!row || typeof row !== "object") {
    return null;
  }
  const record = row;
  const value = record.journal_mode ?? Object.values(record)[0];
  return typeof value === "string" ? value.toLowerCase() : null;
}
function hasInMemoryMainDatabase(db) {
  const rows = db.prepare("PRAGMA database_list;").all();
  const main = rows.find((row) => row.name === "main");
  return main?.file === "";
}
function readCheckpointBusyResult(row) {
  if (!row || typeof row !== "object") {
    return false;
  }
  const record = row;
  const value = record.busy ?? Object.values(record)[0];
  return value === 1 || value === 1n;
}
function requireRollbackJournalMode(db, options) {
  const row = db.prepare("PRAGMA journal_mode = DELETE;").get();
  const journalMode = readJournalModeResult(row);
  if (journalMode !== "delete") {
    const label = options.databaseLabel ?? "sqlite database";
    const location = options.databasePath ? ` at ${options.databasePath}` : "";
    const actual = journalMode ?? "unknown";
    throw new Error(
      `${label}${location} is on a network-backed volume but SQLite kept journal_mode=${actual}; refusing to continue with WAL on network storage.`
    );
  }
}
function enableWalJournalMode(db, retryTimeoutMs, options) {
  const deadline = Date.now() + retryTimeoutMs;
  let restoreBusyTimeout = false;
  try {
    while (true) {
      try {
        db.exec("PRAGMA journal_mode = WAL;");
        const journalMode = readJournalModeResult(db.prepare("PRAGMA journal_mode;").get());
        if (journalMode === "wal") {
          return true;
        }
        if (journalMode === "memory" && hasInMemoryMainDatabase(db)) {
          return false;
        }
        const label = options.databaseLabel ?? "sqlite database";
        const location = options.databasePath ? ` at ${options.databasePath}` : "";
        throw new Error(
          `${label}${location} could not enable WAL; SQLite kept journal_mode=${journalMode ?? "unknown"}.`
        );
      } catch (error) {
        const remainingMs = deadline - Date.now();
        if (!isSqliteLockError(error) || remainingMs <= 0) {
          throw error;
        }
        if (!restoreBusyTimeout) {
          configureSqliteBusyTimeout(db, 0);
          restoreBusyTimeout = true;
        }
        Atomics.wait(
          JOURNAL_MODE_RETRY_SLEEP,
          0,
          0,
          Math.min(JOURNAL_MODE_RETRY_INTERVAL_MS, remainingMs)
        );
      }
    }
  } finally {
    if (restoreBusyTimeout) {
      configureSqliteBusyTimeout(db, retryTimeoutMs);
    }
  }
}
function enableMacosCheckpointFullfsync(db) {
  if (process.platform !== "darwin") {
    return;
  }
  try {
    db.exec("PRAGMA checkpoint_fullfsync = 1;");
  } catch {
  }
}
function refuseUnsupportedFilesystem(options) {
  const label = options.databaseLabel ?? "sqlite database";
  const location = options.databasePath ? ` at ${options.databasePath}` : "";
  throw new Error(
    `${label}${location} is on SSHFS, which cannot safely coordinate SQLite writes across mounts; refusing to open the database.`
  );
}
function configureSqliteWalMaintenance(db, options = {}) {
  const busyTimeoutMs = options.busyTimeoutMs === void 0 ? 0 : configureSqliteBusyTimeout(db, options.busyTimeoutMs);
  const autoCheckpointPages = normalizeNonNegativeInteger(
    options.autoCheckpointPages ?? DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES,
    "autoCheckpointPages"
  );
  const checkpointIntervalMs = normalizeNonNegativeInteger(
    options.checkpointIntervalMs ?? DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS,
    "checkpointIntervalMs"
  );
  const timerIntervalMs = Math.min(checkpointIntervalMs, MAX_TIMER_TIMEOUT_MS);
  const checkpointMode = options.checkpointMode ?? "TRUNCATE";
  const periodicCheckpointMode = options.checkpointMode ?? "PASSIVE";
  const journalPolicy = options.databasePath ? resolvePathJournalPolicy(options.databasePath) : "wal";
  if (journalPolicy === "unsupported") {
    refuseUnsupportedFilesystem(options);
  }
  if (journalPolicy === "rollback") {
    requireRollbackJournalMode(db, options);
    return {
      checkpoint: () => true,
      close: () => true
    };
  }
  if (!enableWalJournalMode(db, busyTimeoutMs, options)) {
    return {
      checkpoint: () => true,
      close: () => true
    };
  }
  enableMacosCheckpointFullfsync(db);
  db.exec(`PRAGMA wal_autocheckpoint = ${autoCheckpointPages};`);
  const runCheckpoint = (mode) => {
    try {
      const row = db.prepare(`PRAGMA wal_checkpoint(${mode});`).get();
      if (readCheckpointBusyResult(row)) {
        const label = options.databaseLabel ?? "sqlite database";
        const error = new Error(`${label} WAL checkpoint ${mode} remained busy`);
        options.onCheckpointError?.(error);
        return false;
      }
      return true;
    } catch (error) {
      options.onCheckpointError?.(error);
      return false;
    }
  };
  const runIncrementalVacuum = () => {
    try {
      db.exec(`PRAGMA incremental_vacuum(${INCREMENTAL_VACUUM_MAX_PAGES_PER_PASS});`);
    } catch (error) {
      options.onCheckpointError?.(error);
    }
  };
  const checkpoint = () => runCheckpoint(checkpointMode);
  let timer = null;
  if (timerIntervalMs > 0) {
    timer = setInterval(() => {
      runCheckpoint(periodicCheckpointMode);
      runIncrementalVacuum();
    }, timerIntervalMs);
    timer.unref?.();
  }
  return {
    checkpoint,
    close: (closeOptions) => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      return runCheckpoint(closeOptions?.checkpointMode ?? checkpointMode);
    }
  };
}
function registerSqliteCacheExitClose(closeAll) {
  const closeOnExit = () => {
    try {
      closeAll();
    } catch {
    }
  };
  process.once("exit", closeOnExit);
  return () => {
    process.removeListener("exit", closeOnExit);
  };
}
function configureSqliteConnectionPragmas(db, options = {}) {
  const { foreignKeys, synchronous, ...walOptions } = options;
  const maintenance = configureSqliteWalMaintenance(db, walOptions);
  if (synchronous) {
    db.exec(`PRAGMA synchronous = ${synchronous};`);
  }
  if (foreignKeys) {
    db.exec("PRAGMA foreign_keys = ON;");
  }
  return maintenance;
}
var DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES, DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS, INCREMENTAL_VACUUM_MAX_PAGES_PER_PASS, LINUX_NFS_SUPER_MAGIC, LINUX_SMB_SUPER_MAGIC, LINUX_CIFS_SUPER_MAGIC, LINUX_SMB2_SUPER_MAGIC, PROC_MOUNTINFO_PATH, MOUNT_COMMAND_TIMEOUT_MS, NETWORK_FILESYSTEM_TYPES, JOURNAL_MODE_RETRY_INTERVAL_MS, JOURNAL_MODE_RETRY_SLEEP;
var init_sqlite_wal = __esm({
  "src/infra/sqlite-wal.ts"() {
    "use strict";
    init_number_coercion2();
    init_sqlite_transaction();
    DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES = 1e3;
    DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS = 30 * 60 * 1e3;
    INCREMENTAL_VACUUM_MAX_PAGES_PER_PASS = 512;
    LINUX_NFS_SUPER_MAGIC = 26985;
    LINUX_SMB_SUPER_MAGIC = 20859;
    LINUX_CIFS_SUPER_MAGIC = 4283649346;
    LINUX_SMB2_SUPER_MAGIC = 4266872130;
    PROC_MOUNTINFO_PATH = "/proc/self/mountinfo";
    MOUNT_COMMAND_TIMEOUT_MS = 1e3;
    NETWORK_FILESYSTEM_TYPES = /* @__PURE__ */ new Set(["cifs", "smbfs", "smb2", "smb3"]);
    JOURNAL_MODE_RETRY_INTERVAL_MS = 10;
    JOURNAL_MODE_RETRY_SLEEP = new Int32Array(new SharedArrayBuffer(4));
  }
});

// src/infra/kysely-sync.ts
import { InsertQueryNode, Kysely as KyselyInstance, SqliteDialect } from "kysely";
function getNodeSqliteKysely(db) {
  const existing = kyselyByDatabase.get(db);
  if (existing) {
    return existing;
  }
  const kysely = new KyselyInstance({
    dialect: compileOnlySqliteDialect
  });
  kyselyByDatabase.set(db, kysely);
  return kysely;
}
function executeCompiledSqliteQuerySync(db, compiledQuery) {
  const statement = db.prepare(compiledQuery.sql);
  const parameters = compiledQuery.parameters;
  if (statement.columns().length > 0) {
    return { rows: statement.all(...parameters) };
  }
  const { changes, lastInsertRowid } = statement.run(...parameters);
  const result = {
    numAffectedRows: BigInt(changes),
    rows: []
  };
  if (InsertQueryNode.is(compiledQuery.query) && changes > 0) {
    return {
      ...result,
      insertId: BigInt(lastInsertRowid)
    };
  }
  return result;
}
function executeSqliteQuerySync(db, query) {
  return executeCompiledSqliteQuerySync(db, query.compile());
}
function executeSqliteQueryTakeFirstSync(db, query) {
  return executeSqliteQuerySync(db, query).rows[0];
}
function clearNodeSqliteKyselyCacheForDatabase(db) {
  kyselyByDatabase.delete(db);
}
var kyselyByDatabase, compileOnlySqliteDialect;
var init_kysely_sync = __esm({
  "src/infra/kysely-sync.ts"() {
    "use strict";
    kyselyByDatabase = /* @__PURE__ */ new WeakMap();
    compileOnlySqliteDialect = new SqliteDialect({
      // The lazy database factory leaves compilation usable while direct execution fails fast.
      database: async () => {
        throw new Error(
          "getNodeSqliteKysely() returns a compile-only Kysely facade; use executeSqliteQuerySync() to execute node:sqlite queries."
        );
      }
    });
  }
});

// src/infra/sqlite-index-schema.ts
function repairCanonicalSqliteUniqueIndexes(db, databaseLabel, indexes) {
  const drifted = indexes.filter((index) => {
    assertSqliteIdentifier(index.name);
    const row = db.prepare("SELECT sql FROM main.sqlite_schema WHERE type = 'index' AND name = ?").get(index.name);
    return typeof row?.sql !== "string" || normalizeCreateIndexSql(row.sql) !== normalizeCreateIndexSql(createIndexSql(index, index.name, false));
  });
  if (drifted.length === 0) {
    return;
  }
  const savepoint = "repair_canonical_unique_indexes";
  let activeIndex;
  db.exec(`SAVEPOINT ${savepoint};`);
  try {
    for (const index of drifted) {
      activeIndex = index;
      const probeName = findUnusedProbeIndexName(db, index.name);
      db.exec(createIndexSql(index, probeName, true));
      db.exec(`DROP INDEX main.${index.name};`);
      db.exec(createIndexSql(index, index.name, true));
      db.exec(`DROP INDEX main.${probeName};`);
    }
    db.exec(`RELEASE SAVEPOINT ${savepoint};`);
  } catch (error) {
    try {
      db.exec(`ROLLBACK TO SAVEPOINT ${savepoint};`);
    } finally {
      db.exec(`RELEASE SAVEPOINT ${savepoint};`);
    }
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `SQLite canonical unique index ${activeIndex?.name ?? "repair"} failed for ${databaseLabel}: ${detail}`,
      { cause: error }
    );
  }
}
function createIndexSql(index, name, qualifyMain) {
  assertSqliteIdentifier(name);
  return `CREATE UNIQUE INDEX ${qualifyMain ? `main.${name}` : name} ${index.definition};`;
}
function findUnusedProbeIndexName(db, canonicalName) {
  const prefix = `openclaw_probe_${canonicalName}`;
  for (let suffix = 0; suffix < 100; suffix += 1) {
    const candidate = suffix === 0 ? prefix : `${prefix}_${suffix}`;
    const row = db.prepare("SELECT 1 AS found FROM main.sqlite_schema WHERE name = ?").get(candidate);
    if (!row) {
      return candidate;
    }
  }
  throw new Error(`could not allocate a probe index name for ${canonicalName}`);
}
function assertSqliteIdentifier(identifier) {
  if (!SQLITE_IDENTIFIER_PATTERN.test(identifier)) {
    throw new Error(`invalid SQLite identifier: ${identifier}`);
  }
}
function normalizeCreateIndexSql(sql) {
  return sql.trim().replace(/;\s*$/u, "").replace(/^CREATE\s+UNIQUE\s+INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?/iu, "CREATE UNIQUE INDEX ").replace(/\s+/gu, " ").trim();
}
var SQLITE_IDENTIFIER_PATTERN;
var init_sqlite_index_schema = __esm({
  "src/infra/sqlite-index-schema.ts"() {
    "use strict";
    SQLITE_IDENTIFIER_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/u;
  }
});

// src/infra/sqlite-terminal-open-latch.ts
import path9 from "node:path";
function createSqliteTerminalOpenLatch(options) {
  const failures = /* @__PURE__ */ new Map();
  return {
    get: (pathname) => failures.get(path9.resolve(pathname)),
    record: (pathname, error) => {
      const resolvedPath = path9.resolve(pathname);
      failures.set(resolvedPath, error);
      options.closeByPath(resolvedPath);
    },
    clear: (pathname) => {
      failures.delete(path9.resolve(pathname));
    },
    clearAll: () => {
      failures.clear();
    }
  };
}
var init_sqlite_terminal_open_latch = __esm({
  "src/infra/sqlite-terminal-open-latch.ts"() {
    "use strict";
  }
});

// src/infra/sqlite-user-version.ts
function readSqliteUserVersion(db) {
  const row = db.prepare("PRAGMA user_version").get();
  return Number(row?.user_version ?? 0);
}
function createNewerSqliteSchemaVersionError(databaseLabel, pathname, schemaVersion, supportedVersion) {
  const error = new Error(
    `${databaseLabel} ${pathname} uses newer schema version ${schemaVersion}; this OpenClaw build supports ${supportedVersion}. Upgrade OpenClaw before opening this database. Do not downgrade OpenClaw or modify the database. To run this older build, use a separate state directory or restore a compatible backup. See https://docs.openclaw.ai/reference/database-schemas.`
  );
  error.name = "SqliteSchemaVersionError";
  return error;
}
var init_sqlite_user_version = __esm({
  "src/infra/sqlite-user-version.ts"() {
    "use strict";
  }
});

// src/cron/execution-error-constants.ts
var CRON_JOB_EXECUTION_TIMEOUT_ERROR;
var init_execution_error_constants = __esm({
  "src/cron/execution-error-constants.ts"() {
    "use strict";
    CRON_JOB_EXECUTION_TIMEOUT_ERROR = "cron: job execution timed out";
  }
});

// src/cron/run-diagnostics-normalize.ts
function normalizeSeverity(value) {
  return value === "info" || value === "warn" || value === "error" ? value : "error";
}
function normalizeSource(value) {
  switch (value) {
    case "cron-preflight":
    case "cron-setup":
    case "model-preflight":
    case "agent-run":
    case "tool":
    case "exec":
    case "delivery":
      return value;
    default:
      return "agent-run";
  }
}
function normalizeTimestamp(value, nowMs) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : nowMs();
}
function normalizeDiagnosticMessage(value, redactText2) {
  if (typeof value !== "string") {
    return {};
  }
  const normalized = normalizeOptionalString(value);
  if (!normalized) {
    return {};
  }
  const redacted = redactText2(normalized);
  if (redacted.length <= MAX_ENTRY_CHARS) {
    return { message: redacted };
  }
  return { message: `${truncateUtf16Safe(redacted, MAX_ENTRY_CHARS - 1)}\u2026`, truncated: true };
}
function trimSummary(value) {
  const normalized = normalizeOptionalString(value);
  if (!normalized) {
    return void 0;
  }
  if (normalized.length <= MAX_SUMMARY_CHARS) {
    return normalized;
  }
  return `${truncateUtf16Safe(normalized, MAX_SUMMARY_CHARS - 1)}\u2026`;
}
function normalizeCronRunDiagnostics(value, opts) {
  if (!value || typeof value !== "object") {
    return void 0;
  }
  const record = value;
  const nowMs = opts?.nowMs ?? Date.now;
  const redactText2 = opts?.redactText ?? ((text) => text);
  const entriesRaw = Array.isArray(record.entries) ? record.entries : [];
  const entries = [];
  for (const item of entriesRaw) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const entry = item;
    const normalized = normalizeDiagnosticMessage(entry.message, redactText2);
    if (!normalized.message) {
      continue;
    }
    entries.push({
      ts: normalizeTimestamp(entry.ts, nowMs),
      source: normalizeSource(entry.source),
      severity: normalizeSeverity(entry.severity),
      message: normalized.message,
      ...typeof entry.toolName === "string" && entry.toolName.trim() ? { toolName: entry.toolName.trim() } : {},
      ...typeof entry.exitCode === "number" && Number.isFinite(entry.exitCode) ? { exitCode: entry.exitCode } : entry.exitCode === null ? { exitCode: null } : {},
      ...entry.truncated === true || normalized.truncated ? { truncated: true } : {}
    });
    if (entries.length > MAX_ENTRIES) {
      entries.shift();
    }
  }
  const summary = trimSummary(
    typeof record.summary === "string" ? redactText2(record.summary) : void 0
  );
  if (entries.length === 0 && !summary) {
    return void 0;
  }
  return { ...summary ? { summary } : {}, entries };
}
var MAX_ENTRIES, MAX_ENTRY_CHARS, MAX_SUMMARY_CHARS;
var init_run_diagnostics_normalize = __esm({
  "src/cron/run-diagnostics-normalize.ts"() {
    "use strict";
    init_string_coerce();
    init_utf16_slice();
    MAX_ENTRIES = 10;
    MAX_ENTRY_CHARS = 1e3;
    MAX_SUMMARY_CHARS = 2e3;
  }
});

// src/cron/task-run-detail.ts
function toJsonValue(value) {
  const serialized = JSON.stringify(value);
  return serialized === void 0 ? void 0 : JSON.parse(serialized);
}
function normalizeCronRunLogErrorReason(value) {
  return typeof value === "string" && CRON_FAILOVER_REASONS.has(value) ? value : void 0;
}
function parseCronRunLogEntryObject(obj, opts) {
  const jobId = normalizeOptionalString(opts?.jobId);
  if (!obj || typeof obj !== "object") {
    return null;
  }
  const entryObj = obj;
  if (entryObj.action !== "finished") {
    return null;
  }
  if (typeof entryObj.jobId !== "string" || entryObj.jobId.trim().length === 0) {
    return null;
  }
  if (typeof entryObj.ts !== "number" || !Number.isFinite(entryObj.ts)) {
    return null;
  }
  if (jobId && entryObj.jobId !== jobId) {
    return null;
  }
  const usage = entryObj.usage && typeof entryObj.usage === "object" ? entryObj.usage : void 0;
  const normalizedError = typeof entryObj.error === "string" ? entryObj.error : void 0;
  const normalizedProvider = typeof entryObj.provider === "string" && entryObj.provider.trim() ? entryObj.provider : void 0;
  const entry = {
    ts: entryObj.ts,
    jobId: entryObj.jobId,
    action: "finished",
    status: entryObj.status,
    error: normalizedError,
    errorReason: normalizeCronRunLogErrorReason(entryObj.errorReason) ?? void 0,
    summary: entryObj.summary,
    runId: typeof entryObj.runId === "string" && entryObj.runId.trim() ? entryObj.runId : void 0,
    diagnostics: normalizeCronRunDiagnostics(entryObj.diagnostics),
    runAtMs: entryObj.runAtMs,
    durationMs: entryObj.durationMs,
    nextRunAtMs: entryObj.nextRunAtMs,
    triggerFired: entryObj.triggerFired === true ? true : void 0,
    model: typeof entryObj.model === "string" && entryObj.model.trim() ? entryObj.model : void 0,
    provider: normalizedProvider,
    usage: usage ? {
      input_tokens: typeof usage.input_tokens === "number" ? usage.input_tokens : void 0,
      output_tokens: typeof usage.output_tokens === "number" ? usage.output_tokens : void 0,
      total_tokens: typeof usage.total_tokens === "number" ? usage.total_tokens : void 0,
      cache_read_tokens: typeof usage.cache_read_tokens === "number" ? usage.cache_read_tokens : void 0,
      cache_write_tokens: typeof usage.cache_write_tokens === "number" ? usage.cache_write_tokens : void 0
    } : void 0
  };
  if (typeof entryObj.delivered === "boolean") {
    entry.delivered = entryObj.delivered;
  }
  if (entryObj.deliveryStatus === "delivered" || entryObj.deliveryStatus === "not-delivered" || entryObj.deliveryStatus === "unknown" || entryObj.deliveryStatus === "not-requested") {
    entry.deliveryStatus = entryObj.deliveryStatus;
  }
  if (typeof entryObj.deliveryError === "string") {
    entry.deliveryError = entryObj.deliveryError;
  }
  if (entryObj.failureNotificationDelivery && typeof entryObj.failureNotificationDelivery === "object") {
    const failureNotificationDelivery = entryObj.failureNotificationDelivery;
    if (failureNotificationDelivery.status === "delivered" || failureNotificationDelivery.status === "not-delivered" || failureNotificationDelivery.status === "unknown" || failureNotificationDelivery.status === "not-requested") {
      entry.failureNotificationDelivery = {
        status: failureNotificationDelivery.status,
        ...typeof failureNotificationDelivery.delivered === "boolean" ? { delivered: failureNotificationDelivery.delivered } : {},
        ...typeof failureNotificationDelivery.error === "string" ? { error: failureNotificationDelivery.error } : {}
      };
    }
  }
  if (entryObj.delivery && typeof entryObj.delivery === "object") {
    entry.delivery = entryObj.delivery;
  }
  if (typeof entryObj.sessionId === "string" && entryObj.sessionId.trim()) {
    entry.sessionId = entryObj.sessionId;
  }
  if (typeof entryObj.sessionKey === "string" && entryObj.sessionKey.trim()) {
    entry.sessionKey = entryObj.sessionKey;
  }
  return entry;
}
function cronRunLogEntryToTaskDetail(entry, options) {
  const detail = toJsonValue({
    kind: CRON_TASK_DETAIL_KIND,
    status: entry.status,
    storeKey: options.storeKey,
    errorReason: entry.errorReason,
    diagnostics: entry.diagnostics,
    delivered: entry.delivered,
    deliveryStatus: entry.deliveryStatus,
    deliveryError: entry.deliveryError,
    failureNotificationDelivery: entry.failureNotificationDelivery,
    delivery: entry.delivery,
    sessionId: entry.sessionId,
    // TaskRecord.runId remains the internal cancellation identity.
    runId: entry.runId,
    runAtMs: entry.runAtMs,
    durationMs: entry.durationMs,
    nextRunAtMs: entry.nextRunAtMs,
    triggerFired: entry.triggerFired,
    triggerStateChanged: options.triggerEval?.fired === true ? options.triggerEval.stateChanged : void 0,
    triggerState: options.triggerEval?.fired === true && options.triggerEval.stateChanged ? options.triggerEval.state : void 0,
    scriptStateChanged: options.scriptResult?.scriptStateChanged === true ? true : void 0,
    scriptState: options.scriptResult?.scriptStateChanged === true ? options.scriptResult.scriptState : void 0,
    model: entry.model,
    provider: entry.provider,
    usage: entry.usage
  });
  return detail ?? { kind: CRON_TASK_DETAIL_KIND };
}
function cronRunStatusToTaskStatus(entry) {
  if (entry.status === "ok" || entry.status === "skipped") {
    return "succeeded";
  }
  return entry.error === CRON_JOB_EXECUTION_TIMEOUT_ERROR ? "timed_out" : "failed";
}
var CRON_TASK_DETAIL_KIND, CRON_FAILOVER_REASONS;
var init_task_run_detail = __esm({
  "src/cron/task-run-detail.ts"() {
    "use strict";
    init_string_coerce();
    init_execution_error_constants();
    init_run_diagnostics_normalize();
    CRON_TASK_DETAIL_KIND = "cron-run";
    CRON_FAILOVER_REASONS = /* @__PURE__ */ new Set([
      "auth",
      "auth_permanent",
      "format",
      "rate_limit",
      "overloaded",
      "billing",
      "server_error",
      "timeout",
      "model_not_found",
      "session_expired",
      "context_overflow",
      "empty_response",
      "no_error_details",
      "unclassified",
      "unknown"
    ]);
  }
});

// src/infra/sqlite-number.ts
function normalizeSqliteNumber(value) {
  if (typeof value === "bigint") {
    if (value > MAX_SAFE_INTEGER_BIGINT || value < -MAX_SAFE_INTEGER_BIGINT) {
      return void 0;
    }
    return Number(value);
  }
  return typeof value === "number" ? value : void 0;
}
var MAX_SAFE_INTEGER_BIGINT;
var init_sqlite_number = __esm({
  "src/infra/sqlite-number.ts"() {
    "use strict";
    MAX_SAFE_INTEGER_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);
  }
});

// src/infra/state-migrations.cron-run-logs.ts
function tableExists(db, name) {
  return Boolean(
    db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1").get(name)
  );
}
function parseDetail(raw) {
  if (!raw) {
    return void 0;
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : void 0;
  } catch {
    return void 0;
  }
}
function collectMirroredTasks(db) {
  const rows = db.prepare(
    `SELECT source_id, ended_at, detail_json
       FROM task_runs
       WHERE runtime = 'cron' AND source_id IS NOT NULL AND detail_json IS NOT NULL`
  ).all();
  const bySource = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const detail = parseDetail(row.detail_json);
    if (!row.source_id || detail?.kind !== "cron-run") {
      continue;
    }
    const identities = bySource.get(row.source_id) ?? [];
    identities.push({
      endedAt: normalizeSqliteNumber(row.ended_at) ?? null,
      ...typeof detail.runId === "string" && detail.runId ? { runId: detail.runId } : {}
    });
    bySource.set(row.source_id, identities);
  }
  return bySource;
}
function hasMirroredIdentity(identities, runId, endedAt) {
  return identities.some(
    (identity) => runId && identity.runId ? identity.runId === runId : identity.endedAt === endedAt
  );
}
function integerToBoolean(value) {
  return value === null || value === void 0 ? void 0 : Number(value) !== 0;
}
function parseLegacyRow(row) {
  let rawEntry;
  try {
    rawEntry = JSON.parse(row.entry_json ?? "");
  } catch {
    return null;
  }
  const parsed = parseCronRunLogEntryObject(rawEntry, { jobId: row.job_id });
  if (!parsed) {
    return null;
  }
  return {
    ...parsed,
    ts: normalizeSqliteNumber(row.ts) ?? parsed.ts,
    jobId: row.job_id,
    status: row.status ?? parsed.status,
    error: row.error ?? parsed.error,
    summary: row.summary ?? parsed.summary,
    delivered: integerToBoolean(row.delivered) ?? parsed.delivered,
    deliveryStatus: row.delivery_status ?? parsed.deliveryStatus,
    deliveryError: row.delivery_error ?? parsed.deliveryError,
    sessionId: row.session_id ?? parsed.sessionId,
    sessionKey: row.session_key ?? parsed.sessionKey,
    runId: row.run_id ?? parsed.runId,
    runAtMs: normalizeSqliteNumber(row.run_at_ms ?? null) ?? parsed.runAtMs,
    durationMs: normalizeSqliteNumber(row.duration_ms ?? null) ?? parsed.durationMs,
    nextRunAtMs: normalizeSqliteNumber(row.next_run_at_ms ?? null) ?? parsed.nextRunAtMs,
    model: row.model ?? parsed.model,
    provider: row.provider ?? parsed.provider
  };
}
function ordinalKey(jobId, ts) {
  return `${jobId}\0${ts}`;
}
function migrateLegacyCronRunLogsToTaskRuns(db) {
  if (!tableExists(db, "cron_run_logs")) {
    return { imported: 0, alreadyMirrored: 0, malformed: 0, skipped: true };
  }
  const mirrored = collectMirroredTasks(db);
  const ordinals = /* @__PURE__ */ new Map();
  const insert = db.prepare(`
    INSERT INTO task_runs (
      task_id, runtime, task_kind, source_id, requester_session_key, owner_key, scope_kind,
      child_session_key, parent_flow_id, parent_task_id, agent_id, requester_agent_id, run_id,
      label, task, status, delivery_status, notify_policy, created_at, started_at, ended_at,
      last_event_at, cleanup_after, error, progress_summary, terminal_summary, terminal_outcome,
      detail_json
    ) VALUES (
      @task_id, 'cron', NULL, @source_id, '', '', 'system', @child_session_key, NULL, NULL,
      NULL, NULL, @run_id, NULL, @task, @status, 'not_applicable', 'silent', @created_at,
      @started_at, @ended_at, @ended_at, NULL, @error, NULL, @terminal_summary,
      @terminal_outcome, @detail_json
    )
  `);
  let imported = 0;
  let alreadyMirrored = 0;
  let malformed = 0;
  let offset = 0;
  while (true) {
    const rows = db.prepare(
      `SELECT * FROM cron_run_logs
         ORDER BY job_id, ts, store_key, seq
         LIMIT ? OFFSET ?`
    ).all(CRON_RUN_LOG_IMPORT_BATCH_SIZE, offset);
    if (rows.length === 0) {
      break;
    }
    offset += rows.length;
    for (const row of rows) {
      const entry = parseLegacyRow(row);
      if (!entry) {
        malformed++;
        continue;
      }
      const key = ordinalKey(entry.jobId, entry.ts);
      const ordinal = (ordinals.get(key) ?? 0) + 1;
      ordinals.set(key, ordinal);
      const identities = mirrored.get(entry.jobId) ?? [];
      if (hasMirroredIdentity(identities, entry.runId, entry.ts)) {
        alreadyMirrored++;
        continue;
      }
      const taskId = `cron-runlog-import:${entry.jobId}:${entry.ts}:${ordinal}`;
      const status = cronRunStatusToTaskStatus(entry);
      insert.run({
        task_id: taskId,
        source_id: entry.jobId,
        child_session_key: entry.sessionKey ?? null,
        run_id: taskId,
        task: entry.jobId,
        status,
        created_at: entry.runAtMs ?? entry.ts,
        started_at: entry.runAtMs ?? null,
        ended_at: entry.ts,
        error: entry.error ?? null,
        terminal_summary: entry.summary ?? null,
        terminal_outcome: status === "succeeded" ? "succeeded" : null,
        detail_json: JSON.stringify(
          cronRunLogEntryToTaskDetail(entry, { storeKey: row.store_key })
        )
      });
      imported++;
    }
  }
  db.exec(`
    DROP INDEX IF EXISTS idx_cron_run_logs_store_ts;
    DROP INDEX IF EXISTS idx_cron_run_logs_job_status;
    DROP INDEX IF EXISTS idx_cron_run_logs_delivery;
    DROP TABLE cron_run_logs;
  `);
  const result = { imported, alreadyMirrored, malformed, skipped: false };
  const now = Date.now();
  db.prepare(
    `INSERT INTO migration_runs (id, started_at, finished_at, status, report_json)
     VALUES (?, ?, ?, 'completed', ?)
     ON CONFLICT(id) DO UPDATE SET
       finished_at = excluded.finished_at,
       status = excluded.status,
       report_json = excluded.report_json`
  ).run(CRON_RUN_LOG_TASK_IMPORT_MIGRATION_ID, now, now, JSON.stringify(result));
  return result;
}
var CRON_RUN_LOG_TASK_IMPORT_MIGRATION_ID, CRON_RUN_LOG_IMPORT_BATCH_SIZE;
var init_state_migrations_cron_run_logs = __esm({
  "src/infra/state-migrations.cron-run-logs.ts"() {
    "use strict";
    init_task_run_detail();
    init_sqlite_number();
    CRON_RUN_LOG_TASK_IMPORT_MIGRATION_ID = "state:cron-run-logs-to-task-runs:v1";
    CRON_RUN_LOG_IMPORT_BATCH_SIZE = 500;
  }
});

// src/version.ts
import { createRequire as createRequire3 } from "node:module";
function readVersionFromJsonCandidates(moduleUrl, candidates, opts = {}) {
  try {
    const require3 = createRequire3(moduleUrl);
    for (const candidate of candidates) {
      try {
        const parsed = require3(candidate);
        const version = normalizeOptionalString(parsed.version);
        if (!version) {
          continue;
        }
        if (opts.requirePackageName && parsed.name !== CORE_PACKAGE_NAME) {
          continue;
        }
        return version;
      } catch {
      }
    }
    return null;
  } catch {
    return null;
  }
}
function firstNonEmpty(...values) {
  for (const value of values) {
    const trimmed = normalizeOptionalString(value);
    if (trimmed && trimmed.toLowerCase() !== "undefined" && trimmed.toLowerCase() !== "null") {
      return trimmed;
    }
  }
  return void 0;
}
function readInjectedVersion() {
  return typeof __OPENCLAW_VERSION__ === "string" ? __OPENCLAW_VERSION__ : void 0;
}
function readVersionFromPackageJsonForModuleUrl(moduleUrl) {
  return readVersionFromJsonCandidates(moduleUrl, PACKAGE_JSON_CANDIDATES, {
    requirePackageName: true
  });
}
function readVersionFromBuildInfoForModuleUrl(moduleUrl) {
  return readVersionFromJsonCandidates(moduleUrl, BUILD_INFO_CANDIDATES);
}
function resolveVersionFromModuleUrl(moduleUrl) {
  return readVersionFromPackageJsonForModuleUrl(moduleUrl) || readVersionFromBuildInfoForModuleUrl(moduleUrl);
}
function resolveBinaryVersion(params) {
  return firstNonEmpty(params.injectedVersion) || resolveVersionFromModuleUrl(params.moduleUrl) || firstNonEmpty(params.bundledVersion) || params.fallback || "0.0.0";
}
var CORE_PACKAGE_NAME, PACKAGE_JSON_CANDIDATES, BUILD_INFO_CANDIDATES, VERSION;
var init_version = __esm({
  "src/version.ts"() {
    "use strict";
    init_string_coerce();
    CORE_PACKAGE_NAME = "openclaw";
    PACKAGE_JSON_CANDIDATES = [
      "../package.json",
      "../../package.json",
      "../../../package.json",
      "./package.json"
    ];
    BUILD_INFO_CANDIDATES = [
      "../build-info.json",
      "../../build-info.json",
      "./build-info.json"
    ];
    VERSION = resolveBinaryVersion({
      moduleUrl: import.meta.url,
      injectedVersion: readInjectedVersion(),
      bundledVersion: process.env.OPENCLAW_BUNDLED_VERSION
    });
  }
});

// src/state/openclaw-state-db.paths.ts
import os4 from "node:os";
import path10 from "node:path";
import { isMainThread, threadId } from "node:worker_threads";
function resolveOpenClawStateRootDir(env) {
  if (env.OPENCLAW_STATE_DIR?.trim()) {
    return resolveStateDir(env);
  }
  if (env.VITEST || env.NODE_ENV === "test") {
    const workerId = parseStrictNonNegativeInteger(
      env.VITEST_WORKER_ID ?? env.VITEST_POOL_ID ?? ""
    );
    const shardSuffix = workerId !== void 0 ? `${process.pid}-${workerId}` : isMainThread ? String(process.pid) : `${process.pid}-${threadId}`;
    return path10.join(os4.tmpdir(), "openclaw-test-state", shardSuffix);
  }
  return resolveStateDir(env);
}
function resolveOpenClawStateSqliteDir(env = process.env) {
  return path10.join(resolveOpenClawStateRootDir(env), "state");
}
function resolveOpenClawStateSqlitePath(env = process.env) {
  return path10.join(resolveOpenClawStateSqliteDir(env), "openclaw.sqlite");
}
var init_openclaw_state_db_paths = __esm({
  "src/state/openclaw-state-db.paths.ts"() {
    "use strict";
    init_paths();
    init_parse_finite_number();
  }
});

// src/state/openclaw-quarantine-store.ts
import { existsSync, mkdirSync } from "node:fs";
import path11 from "node:path";
function resolveQuarantineStorePath(env) {
  return path11.join(resolveOpenClawStateSqliteDir(env), "openclaw-quarantine.sqlite");
}
function readQuarantineSchemaVersion(database, storePath) {
  const row = database.prepare("PRAGMA user_version").get();
  const userVersion = row?.user_version;
  if (typeof userVersion !== "number" || !Number.isInteger(userVersion)) {
    throw new Error(`OpenClaw quarantine store ${storePath} has an invalid schema version.`);
  }
  return userVersion;
}
function readOpenClawDatabaseQuarantine(pathname, options = {}) {
  const storePath = resolveQuarantineStorePath(options.env ?? process.env);
  if (!existsSync(storePath)) {
    return void 0;
  }
  const sqlite = requireNodeSqlite();
  const database = new sqlite.DatabaseSync(storePath);
  try {
    database.exec(`PRAGMA busy_timeout = ${OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS};`);
    const userVersion = readQuarantineSchemaVersion(database, storePath);
    if (userVersion === 0) {
      return void 0;
    }
    if (userVersion !== OPENCLAW_QUARANTINE_SCHEMA_VERSION) {
      throw new Error(
        `OpenClaw quarantine store ${storePath} uses newer schema version ${userVersion}.`
      );
    }
    const row = database.prepare(
      "SELECT kind, reason, quarantined_at FROM quarantined_databases WHERE path = ? LIMIT 1"
    ).get(path11.resolve(pathname));
    if (!row) {
      return void 0;
    }
    if (row.kind !== "agent" && row.kind !== "state" || typeof row.reason !== "string" || typeof row.quarantined_at !== "number" || !Number.isInteger(row.quarantined_at)) {
      throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
    }
    return { kind: row.kind, quarantinedAt: row.quarantined_at, reason: row.reason };
  } finally {
    database.close();
  }
}
var OPENCLAW_QUARANTINE_SCHEMA_VERSION, OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS;
var init_openclaw_quarantine_store = __esm({
  "src/state/openclaw-quarantine-store.ts"() {
    "use strict";
    init_node_sqlite();
    init_private_mode();
    init_version();
    init_openclaw_state_db_paths();
    OPENCLAW_QUARANTINE_SCHEMA_VERSION = 1;
    OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS = 5e3;
  }
});

// src/state/openclaw-state-db-schema-helpers.ts
function tableHasColumn(db, tableName, columnName) {
  const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
  return rows.some((row) => row.name === columnName);
}
function tablePrimaryKeyColumns(db, tableName) {
  const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
  return rows.filter((row) => Number(row.pk ?? 0) > 0 && typeof row.name === "string").toSorted((left, right) => Number(left.pk ?? 0) - Number(right.pk ?? 0)).map((row) => row.name);
}
function tableExists2(db, tableName) {
  const row = db.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
  return row?.ok === 1;
}
function ensureColumn(db, tableName, columnSql) {
  const columnName = columnSql.trim().split(/\s+/, 1)[0];
  if (!columnName || !tableExists2(db, tableName) || tableHasColumn(db, tableName, columnName)) {
    return false;
  }
  db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnSql};`);
  return true;
}
var init_openclaw_state_db_schema_helpers = __esm({
  "src/state/openclaw-state-db-schema-helpers.ts"() {
    "use strict";
  }
});

// src/state/openclaw-state-db-audit-migration.ts
function tableColumnInfo(db, tableName) {
  return db.prepare(`PRAGMA table_info(${tableName})`).all();
}
function tableHasExactColumns(db, tableName, expected) {
  const names = tableColumnInfo(db, tableName).map((column) => column.name);
  return names.length === expected.length && names.every((name, index) => name === expected[index]);
}
function tableHasRequiredColumns(db, tableName, required) {
  const columns = new Map(tableColumnInfo(db, tableName).map((column) => [column.name, column]));
  return required.every((name) => Number(columns.get(name)?.notnull ?? 0) === 1);
}
function tableSql(db, tableName) {
  const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
  return typeof row?.sql === "string" ? row.sql : void 0;
}
function tableHasUniqueColumn(db, tableName, columnName) {
  const indexes = db.prepare(`PRAGMA index_list(${tableName})`).all();
  return indexes.some((index) => {
    if (Number(index.unique ?? 0) !== 1 || typeof index.name !== "string") {
      return false;
    }
    const escaped = index.name.replaceAll("'", "''");
    const columns = db.prepare(`PRAGMA index_info('${escaped}')`).all();
    return columns.length === 1 && columns[0]?.name === columnName;
  });
}
function hasCanonicalAuditEventTable(db, expectedColumns, requiredColumns) {
  const sql = tableSql(db, "audit_events")?.toLowerCase();
  return tableHasExactColumns(db, "audit_events", expectedColumns) && tablePrimaryKeyColumns(db, "audit_events").join(",") === "sequence" && tableHasRequiredColumns(db, "audit_events", requiredColumns) && typeof sql === "string" && /\bsequence\s+integer\s+primary\s+key\s+autoincrement\b/.test(sql) && tableHasUniqueColumn(db, "audit_events", "event_id") && tableHasUniqueColumn(db, "audit_events", "source_id");
}
function hasCanonicalAuditIdentityKeyTable(db) {
  if (!tableExists2(db, "audit_identity_keys")) {
    return false;
  }
  const sql = tableSql(db, "audit_identity_keys")?.toLowerCase();
  return tableHasExactColumns(db, "audit_identity_keys", ["id", "key_id", "key", "created_at"]) && tablePrimaryKeyColumns(db, "audit_identity_keys").join(",") === "id" && tableHasRequiredColumns(db, "audit_identity_keys", ["id", "key_id", "key", "created_at"]) && typeof sql === "string" && /\bcheck\s*\(\s*id\s*=\s*1\s*\)/.test(sql);
}
function hasCanonicalAuditEventsSchema(db) {
  if (!tableExists2(db, "audit_events")) {
    return readSqliteUserVersion(db) < AUDIT_EVENT_STATE_SCHEMA_VERSION && !tableExists2(db, "audit_identity_keys");
  }
  return hasCanonicalAuditEventTable(db, AUDIT_EVENT_V2_COLUMNS, [
    "event_id",
    "source_id",
    "schema_version",
    "source_sequence",
    "occurred_at",
    "kind",
    "action",
    "status",
    "actor_type",
    "actor_id"
  ]) && hasCanonicalAuditIdentityKeyTable(db);
}
function canRepairLegacyAuditEventsSchema(db) {
  if (!tableExists2(db, "audit_events") || tableExists2(db, "audit_events_migration_new") || tableHasColumn(db, "audit_events", "schema_version")) {
    return false;
  }
  const identityTableIsSafe = !tableExists2(db, "audit_identity_keys") || hasCanonicalAuditIdentityKeyTable(db);
  return identityTableIsSafe && hasCanonicalAuditEventTable(db, AUDIT_EVENT_LEGACY_COLUMNS, [
    "event_id",
    "source_id",
    "source_sequence",
    "occurred_at",
    "kind",
    "action",
    "status",
    "actor_type",
    "actor_id",
    "agent_id",
    "run_id"
  ]);
}
var AUDIT_EVENT_STATE_SCHEMA_VERSION, AUDIT_EVENT_LEGACY_COLUMNS, AUDIT_EVENT_V2_COLUMNS;
var init_openclaw_state_db_audit_migration = __esm({
  "src/state/openclaw-state-db-audit-migration.ts"() {
    "use strict";
    init_sqlite_user_version();
    init_openclaw_state_db_schema_helpers();
    AUDIT_EVENT_STATE_SCHEMA_VERSION = 2;
    AUDIT_EVENT_LEGACY_COLUMNS = [
      "sequence",
      "event_id",
      "source_id",
      "source_sequence",
      "occurred_at",
      "kind",
      "action",
      "status",
      "error_code",
      "actor_type",
      "actor_id",
      "agent_id",
      "session_key",
      "session_id",
      "run_id",
      "tool_call_id",
      "tool_name"
    ];
    AUDIT_EVENT_V2_COLUMNS = [
      "sequence",
      "event_id",
      "source_id",
      "schema_version",
      "source_sequence",
      "occurred_at",
      "kind",
      "action",
      "status",
      "error_code",
      "actor_type",
      "actor_id",
      "agent_id",
      "session_key",
      "session_id",
      "run_id",
      "tool_call_id",
      "tool_name",
      "direction",
      "channel",
      "conversation_kind",
      "message_outcome",
      "reason_code",
      "delivery_kind",
      "failure_stage",
      "duration_ms",
      "result_count",
      "account_ref",
      "conversation_ref",
      "message_ref",
      "target_ref"
    ];
  }
});

// src/state/openclaw-state-db-contract.ts
var OPENCLAW_STATE_SCHEMA_VERSION, OPENCLAW_STATE_STRICT_SCHEMA_VERSION, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, OPENCLAW_DATABASE_SCHEMA_DOCS_URL;
var init_openclaw_state_db_contract = __esm({
  "src/state/openclaw-state-db-contract.ts"() {
    "use strict";
    OPENCLAW_STATE_SCHEMA_VERSION = 5;
    OPENCLAW_STATE_STRICT_SCHEMA_VERSION = 3;
    OPENCLAW_SQLITE_BUSY_TIMEOUT_MS = 5e3;
    OPENCLAW_DATABASE_SCHEMA_DOCS_URL = "https://docs.openclaw.ai/reference/database-schemas";
  }
});

// src/infra/sqlite-schema-contract.ts
var init_sqlite_schema_contract = __esm({
  "src/infra/sqlite-schema-contract.ts"() {
    "use strict";
    init_node_sqlite();
  }
});

// src/state/openclaw-state-schema.generated.ts
var OPENCLAW_STATE_SCHEMA_SQL;
var init_openclaw_state_schema_generated = __esm({
  "src/state/openclaw-state-schema.generated.ts"() {
    "use strict";
    OPENCLAW_STATE_SCHEMA_SQL = `CREATE TABLE IF NOT EXISTS auth_profile_stores (
  store_key TEXT NOT NULL PRIMARY KEY,
  store_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS auth_profile_state (
  store_key TEXT NOT NULL PRIMARY KEY,
  state_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS mcp_oauth_stores (
  store_key TEXT NOT NULL PRIMARY KEY,
  format_version INTEGER NOT NULL CHECK (format_version = 1),
  store_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS diagnostic_events (
  scope TEXT NOT NULL,
  event_key TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  sequence INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (scope, event_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_diagnostic_events_scope_sequence
  ON diagnostic_events(scope, sequence, event_key);

CREATE TABLE IF NOT EXISTS skill_usage (
  skill_file TEXT NOT NULL PRIMARY KEY,
  skill_key TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  skill_source TEXT NOT NULL,
  first_used_at_ms INTEGER NOT NULL,
  last_used_at_ms INTEGER NOT NULL,
  use_count INTEGER NOT NULL,
  last_agent_id TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_skill_usage_key
  ON skill_usage(skill_key, skill_file);

CREATE TABLE IF NOT EXISTS skill_lifecycle (
  skill_file TEXT NOT NULL PRIMARY KEY,
  skill_key TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('active', 'stale', 'archived')),
  pinned INTEGER NOT NULL DEFAULT 0,
  state_changed_at_ms INTEGER NOT NULL,
  created_at_ms INTEGER NOT NULL,
  archived_reason TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_skill_lifecycle_key
  ON skill_lifecycle(skill_key, skill_file);

CREATE INDEX IF NOT EXISTS idx_skill_lifecycle_state
  ON skill_lifecycle(state, skill_file);

CREATE TABLE IF NOT EXISTS skill_curator_state (
  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
  last_attempt_at_ms INTEGER NOT NULL,
  last_success_at_ms INTEGER,
  last_error TEXT,
  last_result_json TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS audit_events (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL UNIQUE,
  source_id TEXT NOT NULL UNIQUE,
  schema_version INTEGER NOT NULL DEFAULT 1,
  source_sequence INTEGER NOT NULL,
  occurred_at INTEGER NOT NULL,
  kind TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  error_code TEXT,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  agent_id TEXT,
  session_key TEXT,
  session_id TEXT,
  run_id TEXT,
  tool_call_id TEXT,
  tool_name TEXT,
  direction TEXT,
  channel TEXT,
  conversation_kind TEXT,
  message_outcome TEXT,
  reason_code TEXT,
  delivery_kind TEXT,
  failure_stage TEXT,
  duration_ms INTEGER,
  result_count INTEGER,
  account_ref TEXT,
  conversation_ref TEXT,
  message_ref TEXT,
  target_ref TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_audit_events_time
  ON audit_events(occurred_at DESC, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_agent_sequence
  ON audit_events(agent_id, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_session_sequence
  ON audit_events(session_key, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_run_sequence
  ON audit_events(run_id, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_kind_sequence
  ON audit_events(kind, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_status_sequence
  ON audit_events(status, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_channel_sequence
  ON audit_events(channel, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_direction_sequence
  ON audit_events(direction, sequence DESC);

CREATE TABLE IF NOT EXISTS audit_identity_keys (
  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
  key_id TEXT NOT NULL,
  key BLOB NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS session_state_events (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  dedupe_key TEXT UNIQUE,
  session_key TEXT NOT NULL,
  session_id TEXT,
  agent_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  run_id TEXT,
  occurred_at INTEGER NOT NULL,
  summary TEXT NOT NULL,
  payload_json TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_session_state_events_session_sequence
  ON session_state_events(session_key, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_session_state_events_time
  ON session_state_events(occurred_at DESC, sequence DESC);

CREATE TABLE IF NOT EXISTS session_state_heads (
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  last_sequence INTEGER NOT NULL,
  pruned_max_sequence INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, agent_id)
) STRICT;

-- Notifiable watcher identity is the bare session key, matching the process-local
-- system-event queue it feeds. Provenance distinguishes explicit immediate-wake
-- watches from ambient queue-only group watches. Other bare keys
-- (session.scope="global") are ambiguous across agents and excluded until watcher
-- identity is agent-scoped end-to-end.
CREATE TABLE IF NOT EXISTS session_watch_cursors (
  watcher_session_key TEXT NOT NULL,
  target_session_key TEXT NOT NULL,
  last_seen_sequence INTEGER NOT NULL DEFAULT 0,
  notified_sequence INTEGER NOT NULL DEFAULT 0,
  material_sequence INTEGER NOT NULL DEFAULT 0,
  provenance TEXT NOT NULL DEFAULT 'explicit' CHECK (provenance IN ('explicit', 'ambient-group')),
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (watcher_session_key, target_session_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_session_watch_cursors_target
  ON session_watch_cursors(target_session_key);

CREATE TABLE IF NOT EXISTS session_upstream_links (
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  catalog_id TEXT NOT NULL,
  host_id TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  upstream_kind TEXT NOT NULL,
  upstream_ref_json TEXT,
  last_marker_json TEXT,
  last_scanned_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  -- (session_key, agent_id) composite identity: under session.scope="global" agents
  -- share bare keys; a key-only row would let one agent overwrite another's upstream.
  PRIMARY KEY (session_key, agent_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_session_upstream_links_catalog_id
  ON session_upstream_links(catalog_id);

CREATE TABLE IF NOT EXISTS diagnostic_stability_bundles (
  bundle_key TEXT NOT NULL PRIMARY KEY,
  reason TEXT NOT NULL,
  generated_at TEXT NOT NULL,
  bundle_json TEXT NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_diagnostic_stability_bundles_created
  ON diagnostic_stability_bundles(created_at DESC, bundle_key);

CREATE TABLE IF NOT EXISTS state_leases (
  scope TEXT NOT NULL,
  lease_key TEXT NOT NULL,
  owner TEXT NOT NULL,
  expires_at INTEGER,
  heartbeat_at INTEGER,
  payload_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (scope, lease_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_state_leases_expiry
  ON state_leases(expires_at, scope, lease_key)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_state_leases_owner
  ON state_leases(owner, updated_at DESC);

CREATE TABLE IF NOT EXISTS exec_approvals_config (
  config_key TEXT NOT NULL PRIMARY KEY,
  raw_json TEXT NOT NULL,
  socket_path TEXT,
  has_socket_token INTEGER NOT NULL,
  default_security TEXT,
  default_ask TEXT,
  default_ask_fallback TEXT,
  auto_allow_skills INTEGER,
  agent_count INTEGER NOT NULL,
  allowlist_count INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS operator_approvals (
  approval_id TEXT NOT NULL PRIMARY KEY CHECK (
    length(approval_id) > 0 AND approval_id NOT IN ('.', '..')
  ),
  resolution_ref TEXT NOT NULL CHECK (
    length(resolution_ref) = 43 AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*'
  ),
  kind TEXT NOT NULL CHECK (kind IN ('exec', 'plugin', 'system-agent')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'allowed', 'denied', 'expired', 'cancelled')),
  presentation_json TEXT NOT NULL,
  requested_by_device_id TEXT,
  requested_by_client_id TEXT,
  requested_by_device_token_auth INTEGER NOT NULL DEFAULT 0,
  reviewer_device_ids_json TEXT NOT NULL,
  source_agent_id TEXT,
  source_session_key TEXT,
  source_session_id TEXT,
  source_run_id TEXT,
  source_tool_call_id TEXT,
  source_tool_name TEXT,
  audience_session_keys_json TEXT NOT NULL,
  runtime_epoch TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  decision TEXT CHECK (decision IN ('allow-once', 'allow-always', 'deny')),
  terminal_reason TEXT CHECK (
    terminal_reason IN (
      'user',
      'timeout',
      'malformed-verdict',
      'no-route',
      'run-aborted',
      'gateway-restart',
      'storage-corrupt'
    )
  ),
  resolved_at_ms INTEGER,
  resolver_kind TEXT CHECK (resolver_kind IN ('device', 'channel', 'runtime', 'system')),
  resolver_id TEXT,
  consumed_at_ms INTEGER,
  consumed_by TEXT,
  CHECK (expires_at_ms >= created_at_ms),
  CHECK (updated_at_ms >= created_at_ms),
  CHECK (resolved_at_ms IS NULL OR resolved_at_ms >= created_at_ms),
  CHECK (resolved_at_ms IS NULL OR resolved_at_ms <= updated_at_ms),
  CHECK (consumed_at_ms IS NULL OR consumed_at_ms >= resolved_at_ms),
  CHECK (consumed_at_ms IS NULL OR consumed_at_ms <= updated_at_ms),
  CHECK (requested_by_device_token_auth IN (0, 1)),
  CHECK (
    (
      status = 'pending'
      AND decision IS NULL
      AND terminal_reason IS NULL
      AND resolved_at_ms IS NULL
      AND resolver_kind IS NULL
      AND resolver_id IS NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
    OR (
      status = 'allowed'
      AND decision IN ('allow-once', 'allow-always')
      AND terminal_reason = 'user'
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
    )
    OR (
      status = 'denied'
      AND decision = 'deny'
      AND terminal_reason IN ('user', 'malformed-verdict', 'no-route', 'storage-corrupt')
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
    OR (
      status = 'expired'
      AND decision = 'deny'
      AND terminal_reason = 'timeout'
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
    OR (
      status = 'cancelled'
      AND decision = 'deny'
      AND terminal_reason IN ('run-aborted', 'gateway-restart')
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
  ),
  CHECK (
    (consumed_at_ms IS NULL AND consumed_by IS NULL)
    OR (
      status = 'allowed'
      AND decision = 'allow-once'
      AND consumed_at_ms IS NOT NULL
      AND consumed_by IS NOT NULL
    )
  )
) STRICT;

CREATE INDEX IF NOT EXISTS idx_operator_approvals_status_expiry
  ON operator_approvals(status, expires_at_ms, approval_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref
  ON operator_approvals(resolution_ref);

CREATE INDEX IF NOT EXISTS idx_operator_approvals_source_session_created
  ON operator_approvals(source_session_key, created_at_ms DESC, approval_id);

CREATE INDEX IF NOT EXISTS idx_operator_approvals_resolved
  ON operator_approvals(resolved_at_ms, approval_id)
  WHERE resolved_at_ms IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_operator_approvals_runtime_pending
  ON operator_approvals(runtime_epoch, approval_id)
  WHERE status = 'pending';

CREATE TABLE IF NOT EXISTS schema_meta (
  meta_key TEXT NOT NULL PRIMARY KEY,
  role TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  agent_id TEXT,
  app_version TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS device_pairing_pending (
  request_id TEXT NOT NULL PRIMARY KEY,
  device_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
  display_name TEXT,
  platform TEXT,
  device_family TEXT,
  client_id TEXT,
  client_mode TEXT,
  browser_origin TEXT,
  role TEXT,
  roles_json TEXT,
  scopes_json TEXT,
  remote_ip TEXT,
  silent INTEGER,
  is_repair INTEGER,
  ts INTEGER NOT NULL,
  refreshed_at_ms INTEGER
) STRICT;

CREATE INDEX IF NOT EXISTS idx_device_pairing_pending_device
  ON device_pairing_pending(device_id, ts DESC);

CREATE TABLE IF NOT EXISTS device_pairing_paired (
  device_id TEXT NOT NULL PRIMARY KEY,
  public_key TEXT NOT NULL,
  display_name TEXT,
  operator_label TEXT,
  platform TEXT,
  device_family TEXT,
  client_id TEXT,
  client_mode TEXT,
  browser_origin TEXT,
  role TEXT,
  roles_json TEXT,
  scopes_json TEXT,
  approved_scopes_json TEXT,
  remote_ip TEXT,
  tokens_json TEXT,
  approved_via TEXT,
  node_surface_json TEXT,
  pending_node_surface_json TEXT,
  created_at_ms INTEGER NOT NULL,
  approved_at_ms INTEGER NOT NULL,
  last_seen_at_ms INTEGER,
  last_seen_reason TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_device_pairing_paired_approved
  ON device_pairing_paired(approved_at_ms DESC, device_id);

CREATE TABLE IF NOT EXISTS device_bootstrap_tokens (
  token_key TEXT NOT NULL PRIMARY KEY,
  token TEXT NOT NULL,
  ts INTEGER NOT NULL,
  device_id TEXT,
  public_key TEXT,
  profile_json TEXT,
  redeemed_profile_json TEXT,
  pending_profile_json TEXT,
  issued_at_ms INTEGER NOT NULL,
  last_used_at_ms INTEGER
) STRICT;

CREATE INDEX IF NOT EXISTS idx_device_bootstrap_tokens_ts
  ON device_bootstrap_tokens(ts);

CREATE TABLE IF NOT EXISTS device_identities (
  identity_key TEXT NOT NULL PRIMARY KEY,
  device_id TEXT NOT NULL,
  public_key_pem TEXT NOT NULL,
  private_key_pem TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_device_identities_device
  ON device_identities(device_id, updated_at_ms DESC);

CREATE TABLE IF NOT EXISTS device_auth_tokens (
  device_id TEXT NOT NULL,
  role TEXT NOT NULL,
  token TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (device_id, role)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_device_auth_tokens_updated
  ON device_auth_tokens(updated_at_ms DESC, device_id, role);

CREATE TABLE IF NOT EXISTS android_notification_recent_packages (
  package_name TEXT NOT NULL PRIMARY KEY,
  sort_order INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_android_notification_recent_packages_order
  ON android_notification_recent_packages(sort_order, package_name);

CREATE TABLE IF NOT EXISTS macos_port_guardian_records (
  pid INTEGER NOT NULL PRIMARY KEY,
  port INTEGER NOT NULL,
  command TEXT NOT NULL,
  mode TEXT NOT NULL,
  timestamp REAL NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_macos_port_guardian_records_port
  ON macos_port_guardian_records(port, timestamp DESC);

CREATE TABLE IF NOT EXISTS onboarding_recommendations (
  config_key TEXT NOT NULL PRIMARY KEY,
  inventory_hash TEXT NOT NULL,
  matches_json TEXT NOT NULL,
  offered_at_ms INTEGER NOT NULL,
  accepted_at_ms INTEGER,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS workspace_setup_state (
  workspace_key TEXT NOT NULL PRIMARY KEY,
  workspace_path TEXT NOT NULL,
  version INTEGER NOT NULL,
  bootstrap_seeded_at TEXT,
  setup_completed_at TEXT,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_workspace_setup_state_path
  ON workspace_setup_state(workspace_path);

CREATE TABLE IF NOT EXISTS workspace_path_aliases (
  alias_key TEXT NOT NULL PRIMARY KEY,
  alias_path TEXT NOT NULL,
  workspace_key TEXT NOT NULL,
  workspace_path TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_workspace_path_aliases_workspace
  ON workspace_path_aliases(workspace_key);

CREATE TABLE IF NOT EXISTS workspace_attestations (
  workspace_key TEXT NOT NULL PRIMARY KEY,
  attested_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_workspace_attestations_attested
  ON workspace_attestations(attested_at_ms DESC, workspace_key);

CREATE TABLE IF NOT EXISTS workspace_generated_bootstrap_hashes (
  workspace_key TEXT NOT NULL,
  filename TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  PRIMARY KEY (workspace_key, filename),
  FOREIGN KEY (workspace_key) REFERENCES workspace_attestations(workspace_key) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS native_hook_relay_bridges (
  relay_id TEXT NOT NULL PRIMARY KEY,
  pid INTEGER NOT NULL,
  hostname TEXT NOT NULL,
  port INTEGER NOT NULL,
  token TEXT NOT NULL,
  expires_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_native_hook_relay_bridges_expires
  ON native_hook_relay_bridges(expires_at_ms, relay_id);

CREATE TABLE IF NOT EXISTS model_capability_cache (
  provider_id TEXT NOT NULL,
  model_id TEXT NOT NULL,
  name TEXT NOT NULL,
  input_text INTEGER NOT NULL,
  input_image INTEGER NOT NULL,
  reasoning INTEGER NOT NULL,
  supports_tools INTEGER,
  context_window INTEGER NOT NULL,
  max_tokens INTEGER NOT NULL,
  cost_input REAL NOT NULL,
  cost_output REAL NOT NULL,
  cost_cache_read REAL NOT NULL,
  cost_cache_write REAL NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (provider_id, model_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_model_capability_cache_provider_updated
  ON model_capability_cache(provider_id, updated_at_ms DESC, model_id);

CREATE TABLE IF NOT EXISTS agent_model_catalogs (
  catalog_key TEXT NOT NULL PRIMARY KEY,
  agent_dir TEXT NOT NULL,
  raw_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_model_catalogs_agent_dir
  ON agent_model_catalogs(agent_dir, updated_at DESC);

CREATE TABLE IF NOT EXISTS managed_outgoing_image_records (
  attachment_id TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  agent_id TEXT,
  message_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  retention_class TEXT,
  alt TEXT NOT NULL,
  original_media_root TEXT NOT NULL,
  original_media_id TEXT NOT NULL,
  original_media_subdir TEXT NOT NULL,
  original_content_type TEXT NOT NULL,
  original_width INTEGER,
  original_height INTEGER,
  original_size_bytes INTEGER,
  original_filename TEXT,
  record_json TEXT NOT NULL,
  cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))
) STRICT;

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_session
  ON managed_outgoing_image_records(session_key, created_at DESC, attachment_id);

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_message
  ON managed_outgoing_image_records(session_key, message_id, attachment_id)
  WHERE message_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_session
  ON managed_outgoing_image_records(session_key, agent_id, created_at DESC, attachment_id);

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_message
  ON managed_outgoing_image_records(session_key, agent_id, message_id, attachment_id)
  WHERE message_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS channel_pairing_requests (
  channel_key TEXT NOT NULL,
  account_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  meta_json TEXT,
  PRIMARY KEY (channel_key, account_id, request_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_code
  ON channel_pairing_requests(channel_key, code);

CREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_created
  ON channel_pairing_requests(channel_key, created_at, request_id);

CREATE TABLE IF NOT EXISTS channel_pairing_allow_entries (
  channel_key TEXT NOT NULL,
  account_id TEXT NOT NULL,
  entry TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (channel_key, account_id, entry)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_channel_pairing_allow_account
  ON channel_pairing_allow_entries(channel_key, account_id, sort_order, entry);

CREATE TABLE IF NOT EXISTS web_push_subscriptions (
  endpoint_hash TEXT NOT NULL PRIMARY KEY,
  subscription_id TEXT NOT NULL UNIQUE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_web_push_subscriptions_updated
  ON web_push_subscriptions(updated_at_ms DESC, subscription_id);

CREATE TABLE IF NOT EXISTS web_push_vapid_keys (
  key_id TEXT NOT NULL PRIMARY KEY,
  public_key TEXT NOT NULL,
  private_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS apns_registrations (
  node_id TEXT NOT NULL PRIMARY KEY,
  transport TEXT NOT NULL,
  token TEXT,
  relay_handle TEXT,
  send_grant TEXT,
  installation_id TEXT,
  relay_origin TEXT,
  topic TEXT NOT NULL,
  environment TEXT NOT NULL,
  distribution TEXT,
  token_debug_suffix TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_apns_registrations_updated
  ON apns_registrations(updated_at_ms DESC, node_id);

CREATE TABLE IF NOT EXISTS apns_registration_tombstones (
  node_id TEXT NOT NULL PRIMARY KEY,
  deleted_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS node_host_config (
  config_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  node_id TEXT NOT NULL,
  token TEXT,
  display_name TEXT,
  gateway_host TEXT,
  gateway_port INTEGER,
  gateway_tls INTEGER,
  gateway_tls_fingerprint TEXT,
  gateway_context_path TEXT,
  installed_apps_sharing INTEGER NOT NULL DEFAULT 0,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS voicewake_triggers (
  config_key TEXT NOT NULL,
  position INTEGER NOT NULL,
  trigger TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (config_key, position)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_voicewake_triggers_trigger
  ON voicewake_triggers(config_key, trigger);

CREATE TABLE IF NOT EXISTS voicewake_routing_config (
  config_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  default_target_mode TEXT NOT NULL,
  default_target_agent_id TEXT,
  default_target_session_key TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS voicewake_routing_routes (
  config_key TEXT NOT NULL,
  position INTEGER NOT NULL,
  trigger TEXT NOT NULL,
  target_mode TEXT NOT NULL,
  target_agent_id TEXT,
  target_session_key TEXT,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (config_key, position),
  FOREIGN KEY (config_key) REFERENCES voicewake_routing_config(config_key) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_voicewake_routing_routes_trigger
  ON voicewake_routing_routes(config_key, trigger);

CREATE TABLE IF NOT EXISTS update_check_state (
  state_key TEXT NOT NULL PRIMARY KEY,
  last_checked_at TEXT,
  last_notified_version TEXT,
  last_notified_tag TEXT,
  last_available_version TEXT,
  last_available_tag TEXT,
  auto_install_id TEXT,
  auto_first_seen_version TEXT,
  auto_first_seen_tag TEXT,
  auto_first_seen_at TEXT,
  auto_last_attempt_version TEXT,
  auto_last_attempt_at TEXT,
  auto_last_success_version TEXT,
  auto_last_success_at TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS config_health_entries (
  config_path TEXT NOT NULL PRIMARY KEY,
  last_known_good_json TEXT,
  last_promoted_good_json TEXT,
  last_observed_suspicious_signature TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS clawhub_promotions_feed_state (
  state_key TEXT NOT NULL PRIMARY KEY,
  etag TEXT,
  payload_json TEXT,
  feed_sequence INTEGER,
  last_checked_at_ms INTEGER,
  notified_slugs_json TEXT NOT NULL DEFAULT '[]',
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS clawhub_promotion_claims (
  slug TEXT NOT NULL PRIMARY KEY,
  provider TEXT,
  model_keys_json TEXT NOT NULL,
  ends_at_ms INTEGER NOT NULL,
  claimed_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS installed_plugin_index (
  index_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  host_contract_version TEXT NOT NULL,
  compat_registry_version TEXT NOT NULL,
  migration_version INTEGER NOT NULL,
  policy_hash TEXT NOT NULL,
  generated_at_ms INTEGER NOT NULL,
  refresh_reason TEXT,
  install_records_json TEXT NOT NULL,
  plugins_json TEXT NOT NULL,
  diagnostics_json TEXT NOT NULL,
  warning TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_installed_plugin_index_generated
  ON installed_plugin_index(generated_at_ms DESC, index_key);

CREATE TABLE IF NOT EXISTS official_external_plugin_catalog_snapshots (
  feed_url TEXT NOT NULL PRIMARY KEY,
  body TEXT NOT NULL,
  status INTEGER NOT NULL,
  etag TEXT,
  last_modified TEXT,
  checksum TEXT NOT NULL,
  saved_at TEXT NOT NULL,
  trust_mode TEXT,
  trust_key_id TEXT,
  trust_signature_count INTEGER,
  trust_threshold INTEGER,
  trust_verified_at TEXT,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_official_external_plugin_catalog_snapshots_updated
  ON official_external_plugin_catalog_snapshots(updated_at_ms DESC, feed_url);

CREATE TABLE IF NOT EXISTS gateway_restart_sentinel (
  sentinel_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  ts INTEGER NOT NULL,
  session_key TEXT,
  thread_id TEXT,
  delivery_channel TEXT,
  delivery_to TEXT,
  delivery_account_id TEXT,
  message TEXT,
  continuation_json TEXT,
  doctor_hint TEXT,
  stats_json TEXT,
  payload_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_gateway_restart_sentinel_ts
  ON gateway_restart_sentinel(ts DESC, sentinel_key);

CREATE TABLE IF NOT EXISTS gateway_restart_intent (
  intent_key TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  pid INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  reason TEXT,
  force INTEGER,
  wait_ms INTEGER,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS gateway_restart_handoff (
  handoff_key TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  version INTEGER NOT NULL,
  intent_id TEXT NOT NULL,
  pid INTEGER NOT NULL,
  process_instance_id TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  reason TEXT,
  restart_trace_started_at INTEGER,
  restart_trace_last_at INTEGER,
  source TEXT NOT NULL,
  restart_kind TEXT NOT NULL,
  supervisor_mode TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_gateway_restart_handoff_expiry
  ON gateway_restart_handoff(expires_at, pid);

CREATE TABLE IF NOT EXISTS gateway_boot_lifecycle (
  boot_id TEXT NOT NULL PRIMARY KEY,
  pid INTEGER NOT NULL,
  started_at_ms INTEGER NOT NULL,
  completed_at_ms INTEGER,
  outcome TEXT,
  startup_reason TEXT,
  reason TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_gateway_boot_lifecycle_started
  ON gateway_boot_lifecycle(started_at_ms);

CREATE TABLE IF NOT EXISTS acp_sessions (
  session_key TEXT NOT NULL PRIMARY KEY,
  session_id TEXT,
  backend TEXT NOT NULL,
  agent TEXT NOT NULL,
  runtime_session_name TEXT NOT NULL,
  identity_json TEXT,
  mode TEXT NOT NULL,
  runtime_options_json TEXT,
  cwd TEXT,
  state TEXT NOT NULL,
  last_activity_at INTEGER NOT NULL,
  last_error TEXT,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_acp_sessions_state_activity
  ON acp_sessions(state, last_activity_at DESC, session_key);

CREATE INDEX IF NOT EXISTS idx_acp_sessions_agent_activity
  ON acp_sessions(agent, last_activity_at DESC, session_key);

CREATE TABLE IF NOT EXISTS acp_replay_sessions (
  session_id TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  cwd TEXT NOT NULL,
  complete INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  next_seq INTEGER NOT NULL,
  -- Running estimate of this session's ledger footprint (row overhead plus
  -- all event rows), maintained at insert/trim so budget checks never scan
  -- acp_replay_events (#100622).
  estimated_bytes INTEGER NOT NULL DEFAULT 0
) STRICT;

CREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_key_updated
  ON acp_replay_sessions(session_key, complete, updated_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_updated
  ON acp_replay_sessions(updated_at DESC, session_id);

CREATE TABLE IF NOT EXISTS acp_replay_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  at INTEGER NOT NULL,
  session_key TEXT NOT NULL,
  run_id TEXT,
  update_json TEXT NOT NULL,
  estimated_bytes INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES acp_replay_sessions(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_acp_replay_events_session_seq
  ON acp_replay_events(session_id, seq);

CREATE TABLE IF NOT EXISTS agent_databases (
  agent_id TEXT NOT NULL,
  path TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  size_bytes INTEGER,
  PRIMARY KEY (agent_id, path)
) STRICT;

CREATE TABLE IF NOT EXISTS agent_deletion_journal (
  agent_id TEXT PRIMARY KEY,
  operation_id TEXT NOT NULL DEFAULT '',
  agent_dir TEXT NOT NULL,
  workspace_dir TEXT NOT NULL,
  sessions_dir TEXT NOT NULL,
  database_paths_json TEXT NOT NULL DEFAULT '[]',
  cleanup_paths_json TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL,
  cleanup_completed INTEGER NOT NULL DEFAULT 0,
  delete_files INTEGER NOT NULL DEFAULT 1
) STRICT;

CREATE TABLE IF NOT EXISTS agent_database_leases (
  lease_id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  path TEXT NOT NULL,
  owner_pid INTEGER NOT NULL,
  owner_start_time INTEGER,
  opened_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS plugin_state_entries (
  plugin_id TEXT NOT NULL,
  namespace TEXT NOT NULL,
  entry_key TEXT NOT NULL,
  value_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  PRIMARY KEY (plugin_id, namespace, entry_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_plugin_state_expiry
  ON plugin_state_entries(expires_at)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_plugin_state_listing
  ON plugin_state_entries(plugin_id, namespace, created_at, entry_key);

CREATE TABLE IF NOT EXISTS channel_ingress_events (
  queue_name TEXT NOT NULL,
  event_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  status TEXT NOT NULL,
  lane_key TEXT,
  payload_json TEXT NOT NULL,
  metadata_json TEXT,
  received_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  claim_token TEXT,
  claim_owner TEXT,
  claimed_at INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_error TEXT,
  failed_reason TEXT,
  failed_at INTEGER,
  completed_at INTEGER,
  completed_metadata_json TEXT,
  PRIMARY KEY (queue_name, event_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_channel_ingress_pending
  ON channel_ingress_events(queue_name, status, received_at, event_id);

CREATE INDEX IF NOT EXISTS idx_channel_ingress_claims
  ON channel_ingress_events(queue_name, status, claimed_at);

CREATE INDEX IF NOT EXISTS idx_channel_ingress_lane
  ON channel_ingress_events(queue_name, status, lane_key);

CREATE TABLE IF NOT EXISTS plugin_blob_entries (
  plugin_id TEXT NOT NULL,
  namespace TEXT NOT NULL,
  entry_key TEXT NOT NULL,
  metadata_json TEXT NOT NULL,
  blob BLOB NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  PRIMARY KEY (plugin_id, namespace, entry_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_plugin_blob_expiry
  ON plugin_blob_entries(expires_at)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_plugin_blob_listing
  ON plugin_blob_entries(plugin_id, namespace, created_at, entry_key);

CREATE TABLE IF NOT EXISTS media_blobs (
  subdir TEXT NOT NULL,
  id TEXT NOT NULL,
  content_type TEXT,
  size_bytes INTEGER NOT NULL,
  blob BLOB NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (subdir, id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_media_blobs_created
  ON media_blobs(created_at);

CREATE TABLE IF NOT EXISTS skill_uploads (
  upload_id TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  slug TEXT NOT NULL,
  force INTEGER NOT NULL,
  size_bytes INTEGER NOT NULL,
  sha256 TEXT,
  actual_sha256 TEXT,
  received_bytes INTEGER NOT NULL,
  archive_blob BLOB NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  committed INTEGER NOT NULL,
  committed_at INTEGER,
  idempotency_key_hash TEXT UNIQUE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_skill_uploads_expiry
  ON skill_uploads(expires_at);

CREATE INDEX IF NOT EXISTS idx_skill_uploads_idempotency
  ON skill_uploads(idempotency_key_hash)
  WHERE idempotency_key_hash IS NOT NULL;

CREATE TABLE IF NOT EXISTS skill_upload_chunks (
  upload_id TEXT NOT NULL,
  byte_offset INTEGER NOT NULL CHECK (byte_offset >= 0),
  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),
  chunk_blob BLOB NOT NULL,
  PRIMARY KEY (upload_id, byte_offset),
  FOREIGN KEY (upload_id) REFERENCES skill_uploads(upload_id) ON DELETE CASCADE,
  CHECK (length(chunk_blob) = size_bytes)
) STRICT;

CREATE TABLE IF NOT EXISTS capture_sessions (
  id TEXT NOT NULL PRIMARY KEY,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  mode TEXT NOT NULL,
  source_scope TEXT NOT NULL,
  source_process TEXT NOT NULL,
  proxy_url TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS capture_blobs (
  blob_id TEXT NOT NULL PRIMARY KEY,
  content_type TEXT,
  encoding TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  sha256 TEXT NOT NULL,
  data BLOB NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS capture_events (
  id INTEGER NOT NULL PRIMARY KEY,
  session_id TEXT NOT NULL,
  ts INTEGER NOT NULL,
  source_scope TEXT NOT NULL,
  source_process TEXT NOT NULL,
  protocol TEXT NOT NULL,
  direction TEXT NOT NULL,
  kind TEXT NOT NULL,
  flow_id TEXT NOT NULL,
  method TEXT,
  host TEXT,
  path TEXT,
  status INTEGER,
  close_code INTEGER,
  content_type TEXT,
  headers_json TEXT,
  data_text TEXT,
  data_blob_id TEXT,
  data_sha256 TEXT,
  error_text TEXT,
  meta_json TEXT,
  FOREIGN KEY (session_id) REFERENCES capture_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (data_blob_id) REFERENCES capture_blobs(blob_id) ON DELETE SET NULL
) STRICT;

CREATE INDEX IF NOT EXISTS capture_events_session_ts_idx
  ON capture_events(session_id, ts);

CREATE INDEX IF NOT EXISTS capture_events_flow_idx
  ON capture_events(flow_id, ts);

CREATE TABLE IF NOT EXISTS sandbox_registry_entries (
  registry_kind TEXT NOT NULL,
  container_name TEXT NOT NULL,
  session_key TEXT,
  backend_id TEXT,
  runtime_label TEXT,
  image TEXT,
  created_at_ms INTEGER,
  last_used_at_ms INTEGER,
  config_label_kind TEXT,
  config_hash TEXT,
  cdp_port INTEGER,
  no_vnc_port INTEGER,
  entry_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (registry_kind, container_name)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_sandbox_registry_updated
  ON sandbox_registry_entries(registry_kind, updated_at DESC, container_name);

CREATE INDEX IF NOT EXISTS idx_sandbox_registry_session
  ON sandbox_registry_entries(registry_kind, session_key, last_used_at_ms DESC, container_name)
  WHERE session_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sandbox_registry_last_used
  ON sandbox_registry_entries(registry_kind, last_used_at_ms DESC, container_name)
  WHERE last_used_at_ms IS NOT NULL;

CREATE TABLE IF NOT EXISTS commitments (
  id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT,
  recipient_id TEXT,
  thread_id TEXT,
  sender_id TEXT,
  kind TEXT NOT NULL,
  sensitivity TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  reason TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  dedupe_key TEXT NOT NULL,
  confidence REAL NOT NULL,
  due_earliest_ms INTEGER NOT NULL,
  due_latest_ms INTEGER NOT NULL,
  due_timezone TEXT NOT NULL,
  source_message_id TEXT,
  source_run_id TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  last_attempt_at_ms INTEGER,
  sent_at_ms INTEGER,
  dismissed_at_ms INTEGER,
  snoozed_until_ms INTEGER,
  expired_at_ms INTEGER,
  record_json TEXT NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_commitments_scope_due
  ON commitments(agent_id, session_key, status, due_earliest_ms, due_latest_ms);

CREATE INDEX IF NOT EXISTS idx_commitments_status_due
  ON commitments(status, due_earliest_ms, due_latest_ms);

CREATE INDEX IF NOT EXISTS idx_commitments_scope_dedupe
  ON commitments(agent_id, session_key, channel, dedupe_key, status);

CREATE INDEX IF NOT EXISTS idx_commitments_agent_due
  ON commitments(agent_id, status, due_earliest_ms, due_latest_ms, session_key);

CREATE INDEX IF NOT EXISTS idx_commitments_agent_sent
  ON commitments(agent_id, status, sent_at_ms, session_key);

CREATE TABLE IF NOT EXISTS cron_jobs (
  store_key TEXT NOT NULL,
  job_id TEXT NOT NULL,
  declaration_key TEXT,
  display_name TEXT,
  owner_agent_id TEXT,
  owner_session_key TEXT,
  name TEXT NOT NULL,
  description TEXT,
  enabled INTEGER NOT NULL,
  delete_after_run INTEGER,
  created_at_ms INTEGER NOT NULL,
  agent_id TEXT,
  session_key TEXT,
  schedule_kind TEXT NOT NULL,
  schedule_expr TEXT,
  schedule_tz TEXT,
  every_ms INTEGER,
  anchor_ms INTEGER,
  at TEXT,
  stagger_ms INTEGER,
  session_target TEXT NOT NULL,
  wake_mode TEXT NOT NULL,
  trigger_script TEXT,
  trigger_once INTEGER,
  payload_kind TEXT NOT NULL,
  payload_message TEXT,
  payload_model TEXT,
  payload_fallbacks_json TEXT,
  payload_thinking TEXT,
  payload_timeout_seconds INTEGER,
  payload_allow_unsafe_external_content INTEGER,
  payload_external_content_source_json TEXT,
  payload_light_context INTEGER,
  payload_tools_allow_json TEXT,
  payload_tools_allow_is_default INTEGER,
  delivery_mode TEXT,
  delivery_channel TEXT,
  delivery_to TEXT,
  delivery_thread_id TEXT,
  delivery_thread_id_type TEXT,
  delivery_account_id TEXT,
  delivery_best_effort INTEGER,
  delivery_completion_mode TEXT,
  delivery_completion_to TEXT,
  failure_delivery_mode TEXT,
  failure_delivery_channel TEXT,
  failure_delivery_to TEXT,
  failure_delivery_account_id TEXT,
  failure_alert_disabled INTEGER,
  failure_alert_after INTEGER,
  failure_alert_channel TEXT,
  failure_alert_to TEXT,
  failure_alert_cooldown_ms INTEGER,
  failure_alert_include_skipped INTEGER,
  failure_alert_mode TEXT,
  failure_alert_account_id TEXT,
  next_run_at_ms INTEGER,
  running_at_ms INTEGER,
  last_run_at_ms INTEGER,
  last_run_status TEXT,
  last_error TEXT,
  last_duration_ms INTEGER,
  consecutive_errors INTEGER,
  consecutive_skipped INTEGER,
  schedule_error_count INTEGER,
  last_delivery_status TEXT,
  last_delivery_error TEXT,
  last_delivered INTEGER,
  last_failure_alert_at_ms INTEGER,
  job_json TEXT NOT NULL,
  state_json TEXT NOT NULL DEFAULT '{}',
  runtime_updated_at_ms INTEGER,
  schedule_identity TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (store_key, job_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_cron_jobs_store_updated
  ON cron_jobs(store_key, sort_order ASC, updated_at DESC, job_id);

CREATE INDEX IF NOT EXISTS idx_cron_jobs_store_order
  ON cron_jobs(store_key, sort_order ASC, updated_at ASC, job_id);

CREATE INDEX IF NOT EXISTS idx_cron_jobs_enabled_next_run
  ON cron_jobs(store_key, enabled, next_run_at_ms, job_id)
  WHERE next_run_at_ms IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_cron_jobs_agent_session
  ON cron_jobs(agent_id, session_key, updated_at DESC, job_id)
  WHERE agent_id IS NOT NULL OR session_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS command_log_entries (
  id TEXT NOT NULL PRIMARY KEY,
  timestamp_ms INTEGER NOT NULL,
  action TEXT NOT NULL,
  session_key TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  source TEXT NOT NULL,
  entry_json TEXT NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_command_log_entries_timestamp
  ON command_log_entries(timestamp_ms DESC, id);

CREATE INDEX IF NOT EXISTS idx_command_log_entries_session
  ON command_log_entries(session_key, timestamp_ms DESC, id);

CREATE TABLE IF NOT EXISTS delivery_queue_entries (
  queue_name TEXT NOT NULL,
  id TEXT NOT NULL,
  status TEXT NOT NULL,
  entry_kind TEXT,
  session_key TEXT,
  channel TEXT,
  target TEXT,
  account_id TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_error TEXT,
  recovery_state TEXT,
  platform_send_started_at INTEGER,
  entry_json TEXT NOT NULL,
  enqueued_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  failed_at INTEGER,
  PRIMARY KEY (queue_name, id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_delivery_queue_pending
  ON delivery_queue_entries(queue_name, status, enqueued_at, id);

CREATE INDEX IF NOT EXISTS idx_delivery_queue_failed
  ON delivery_queue_entries(queue_name, status, failed_at, id);

CREATE INDEX IF NOT EXISTS idx_delivery_queue_session
  ON delivery_queue_entries(queue_name, status, session_key, enqueued_at, id)
  WHERE session_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_delivery_queue_target
  ON delivery_queue_entries(queue_name, status, channel, target, enqueued_at, id)
  WHERE channel IS NOT NULL AND target IS NOT NULL;

CREATE TABLE IF NOT EXISTS task_runs (
  task_id TEXT NOT NULL PRIMARY KEY,
  runtime TEXT NOT NULL,
  task_kind TEXT,
  source_id TEXT,
  requester_session_key TEXT,
  owner_key TEXT NOT NULL,
  scope_kind TEXT NOT NULL,
  child_session_key TEXT,
  parent_flow_id TEXT,
  parent_task_id TEXT,
  agent_id TEXT,
  requester_agent_id TEXT,
  run_id TEXT,
  label TEXT,
  task TEXT NOT NULL,
  status TEXT NOT NULL,
  delivery_status TEXT NOT NULL,
  notify_policy TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  started_at INTEGER,
  ended_at INTEGER,
  last_event_at INTEGER,
  cleanup_after INTEGER,
  tool_use_count INTEGER,
  last_tool_name TEXT,
  error TEXT,
  progress_summary TEXT,
  terminal_summary TEXT,
  terminal_outcome TEXT,
  detail_json TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_task_runs_run_id ON task_runs(run_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_status ON task_runs(status);
CREATE INDEX IF NOT EXISTS idx_task_runs_runtime_status ON task_runs(runtime, status);
CREATE INDEX IF NOT EXISTS idx_task_runs_cleanup_after ON task_runs(cleanup_after);
CREATE INDEX IF NOT EXISTS idx_task_runs_last_event_at ON task_runs(last_event_at);
CREATE INDEX IF NOT EXISTS idx_task_runs_owner_key ON task_runs(owner_key);
CREATE INDEX IF NOT EXISTS idx_task_runs_parent_flow_id ON task_runs(parent_flow_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_child_session_key ON task_runs(child_session_key);
CREATE INDEX IF NOT EXISTS idx_task_runs_runtime_source_ended
  ON task_runs(runtime, source_id, ended_at, created_at, task_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_runtime_ended
  ON task_runs(runtime, ended_at, created_at, task_id);

CREATE TABLE IF NOT EXISTS subagent_runs (
  run_id TEXT NOT NULL PRIMARY KEY,
  child_session_key TEXT NOT NULL,
  controller_session_key TEXT,
  requester_session_key TEXT NOT NULL,
  requester_display_key TEXT NOT NULL,
  requester_origin_json TEXT,
  task TEXT NOT NULL,
  task_name TEXT,
  cleanup TEXT NOT NULL,
  label TEXT,
  model TEXT,
  agent_dir TEXT,
  workspace_dir TEXT,
  run_timeout_seconds INTEGER,
  spawn_mode TEXT,
  created_at INTEGER NOT NULL,
  started_at INTEGER,
  session_started_at INTEGER,
  accumulated_runtime_ms INTEGER,
  ended_at INTEGER,
  outcome_json TEXT,
  archive_at_ms INTEGER,
  cleanup_completed_at INTEGER,
  cleanup_handled INTEGER,
  suppress_announce_reason TEXT,
  expects_completion_message INTEGER,
  announce_retry_count INTEGER,
  last_announce_retry_at INTEGER,
  last_announce_delivery_error TEXT,
  ended_reason TEXT,
  pause_reason TEXT,
  wake_on_descendant_settle INTEGER,
  requester_settle_wake_status TEXT,
  requester_settle_wake_attempt_count INTEGER,
  requester_settle_wake_replay_count INTEGER,
  requester_settle_wake_next_attempt_at INTEGER,
  requester_settle_wake_batch_run_ids_json TEXT,
  requester_settle_wake_last_error TEXT,
  requester_settle_wake_retire_after INTEGER,
  frozen_result_text TEXT,
  frozen_result_captured_at INTEGER,
  fallback_frozen_result_text TEXT,
  fallback_frozen_result_captured_at INTEGER,
  ended_hook_emitted_at INTEGER,
  pending_final_delivery INTEGER,
  pending_final_delivery_created_at INTEGER,
  pending_final_delivery_last_attempt_at INTEGER,
  pending_final_delivery_attempt_count INTEGER,
  pending_final_delivery_last_error TEXT,
  pending_final_delivery_payload_json TEXT,
  completion_announced_at INTEGER,
  swarm_group_id TEXT,
  swarm_collector INTEGER,
  swarm_output_schema_json TEXT,
  swarm_completion_status TEXT,
  swarm_structured_json TEXT,
  swarm_schema_error TEXT,
  swarm_usage_json TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}'
) STRICT;

CREATE INDEX IF NOT EXISTS idx_subagent_runs_child_session_key
  ON subagent_runs(child_session_key, created_at DESC, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_requester_session_key
  ON subagent_runs(requester_session_key, created_at DESC, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_controller_session_key
  ON subagent_runs(controller_session_key, created_at DESC, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_archive_at
  ON subagent_runs(archive_at_ms, cleanup_handled, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_ended_cleanup
  ON subagent_runs(ended_at, cleanup_handled, run_id);

CREATE TABLE IF NOT EXISTS current_conversation_bindings (
  binding_key TEXT NOT NULL PRIMARY KEY,
  binding_id TEXT NOT NULL,
  target_agent_id TEXT NOT NULL,
  target_session_id TEXT,
  target_session_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT NOT NULL,
  conversation_kind TEXT NOT NULL,
  parent_conversation_id TEXT,
  conversation_id TEXT NOT NULL,
  target_kind TEXT NOT NULL,
  status TEXT NOT NULL,
  bound_at INTEGER NOT NULL,
  expires_at INTEGER,
  metadata_json TEXT,
  record_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_target
  ON current_conversation_bindings(target_agent_id, target_session_key, updated_at DESC, binding_key);
CREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_conversation
  ON current_conversation_bindings(channel, account_id, conversation_kind, conversation_id);
CREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_expires
  ON current_conversation_bindings(expires_at, binding_key);

CREATE TABLE IF NOT EXISTS plugin_binding_approvals (
  plugin_root TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT NOT NULL,
  plugin_id TEXT NOT NULL,
  plugin_name TEXT,
  approved_at INTEGER NOT NULL,
  PRIMARY KEY (plugin_root, channel, account_id)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_plugin_binding_approvals_plugin
  ON plugin_binding_approvals(plugin_id, approved_at DESC);

CREATE TABLE IF NOT EXISTS tui_last_sessions (
  scope_key TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_tui_last_sessions_session_key
  ON tui_last_sessions(session_key, updated_at DESC, scope_key);

CREATE TABLE IF NOT EXISTS task_delivery_state (
  task_id TEXT NOT NULL PRIMARY KEY,
  requester_origin_json TEXT,
  last_notified_event_at INTEGER,
  FOREIGN KEY (task_id) REFERENCES task_runs(task_id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS flow_runs (
  flow_id TEXT NOT NULL PRIMARY KEY,
  shape TEXT,
  sync_mode TEXT NOT NULL DEFAULT 'managed',
  owner_key TEXT NOT NULL,
  requester_origin_json TEXT,
  controller_id TEXT,
  revision INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  notify_policy TEXT NOT NULL,
  goal TEXT NOT NULL,
  current_step TEXT,
  blocked_task_id TEXT,
  blocked_summary TEXT,
  state_json TEXT,
  wait_json TEXT,
  cancel_requested_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  ended_at INTEGER
) STRICT;

CREATE INDEX IF NOT EXISTS idx_flow_runs_status ON flow_runs(status);
CREATE INDEX IF NOT EXISTS idx_flow_runs_owner_key ON flow_runs(owner_key);
CREATE INDEX IF NOT EXISTS idx_flow_runs_updated_at ON flow_runs(updated_at);

CREATE TABLE IF NOT EXISTS migration_runs (
  id TEXT NOT NULL PRIMARY KEY,
  started_at INTEGER NOT NULL,
  finished_at INTEGER,
  status TEXT NOT NULL,
  report_json TEXT NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_migration_runs_started
  ON migration_runs(started_at DESC, id);

CREATE TABLE IF NOT EXISTS migration_sources (
  source_key TEXT NOT NULL PRIMARY KEY,
  migration_kind TEXT NOT NULL,
  source_path TEXT NOT NULL,
  target_table TEXT NOT NULL,
  source_sha256 TEXT,
  source_size_bytes INTEGER,
  source_record_count INTEGER,
  last_run_id TEXT NOT NULL,
  status TEXT NOT NULL,
  imported_at INTEGER NOT NULL,
  removed_source INTEGER NOT NULL DEFAULT 0,
  report_json TEXT NOT NULL,
  FOREIGN KEY (last_run_id) REFERENCES migration_runs(id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_migration_sources_path
  ON migration_sources(source_path, migration_kind, target_table);

CREATE INDEX IF NOT EXISTS idx_migration_sources_run
  ON migration_sources(last_run_id, source_path);

CREATE TABLE IF NOT EXISTS backup_runs (
  id TEXT NOT NULL PRIMARY KEY,
  created_at INTEGER NOT NULL,
  archive_path TEXT NOT NULL,
  status TEXT NOT NULL,
  manifest_json TEXT NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_backup_runs_created
  ON backup_runs(created_at DESC, id);

CREATE TABLE IF NOT EXISTS worktrees (
  id TEXT NOT NULL PRIMARY KEY,
  repo_fingerprint TEXT NOT NULL,
  repo_root TEXT NOT NULL,
  path TEXT NOT NULL,
  branch TEXT NOT NULL,
  base_ref TEXT NOT NULL,
  owner_kind TEXT NOT NULL CHECK (owner_kind IN ('manual', 'workboard', 'session')),
  owner_id TEXT,
  snapshot_ref TEXT,
  provisioned_paths_json TEXT,
  created_at INTEGER NOT NULL,
  last_active_at INTEGER NOT NULL,
  removed_at INTEGER
) STRICT;

CREATE INDEX IF NOT EXISTS idx_worktrees_repo_fingerprint
  ON worktrees(repo_fingerprint);

CREATE INDEX IF NOT EXISTS idx_worktrees_removed_at
  ON worktrees(removed_at);

CREATE TABLE IF NOT EXISTS worktree_provisioned_file_chunks (
  worktree_id TEXT NOT NULL,
  path TEXT NOT NULL,
  chunk_index INTEGER NOT NULL CHECK (chunk_index >= 0),
  data BLOB NOT NULL,
  PRIMARY KEY (worktree_id, path, chunk_index)
) STRICT;

-- Gateway-owned custom session group catalog (names + display order).
-- Membership stays on each session entry's category field; this table only
-- owns which groups exist and how operator UIs order them.
CREATE TABLE IF NOT EXISTS session_groups (
  name TEXT NOT NULL PRIMARY KEY,
  position INTEGER NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;

-- Gateway-owned durable cloud worker lifecycle. Provider-specific execution
-- stays in plugins; this table records only core reconciliation facts.
CREATE TABLE IF NOT EXISTS worker_environments (
  environment_id TEXT NOT NULL PRIMARY KEY,
  provider_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  profile_snapshot_json TEXT NOT NULL,
  provision_operation_id TEXT NOT NULL UNIQUE,
  lease_id TEXT,
  ssh_host TEXT,
  ssh_port INTEGER CHECK (ssh_port IS NULL OR (ssh_port >= 1 AND ssh_port <= 65535)),
  ssh_user TEXT,
  ssh_host_key TEXT,
  ssh_key_ref_json TEXT,
  state TEXT NOT NULL CHECK (
    state IN (
      'requested',
      'provisioning',
      'bootstrapping',
      'ready',
      'attached',
      'idle',
      'draining',
      'destroying',
      'destroyed',
      'failed',
      'orphaned'
    )
  ),
  bootstrap_bundle_hash TEXT,
  bootstrap_openclaw_version TEXT,
  bootstrap_protocol_features_json TEXT,
  owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0),
  teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed')),
  attached_session_ids_json TEXT NOT NULL DEFAULT '[]',
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  state_changed_at_ms INTEGER NOT NULL,
  idle_since_at_ms INTEGER,
  destroy_requested_at_ms INTEGER,
  last_error TEXT
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_worker_environments_provider_lease
  ON worker_environments(provider_id, lease_id)
  WHERE lease_id IS NOT NULL;

-- Session placement lives in the shared state database so local admission,
-- worker admission, and environment attachment use one durable authority.
CREATE TABLE IF NOT EXISTS worker_session_placements (
  session_id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  state TEXT NOT NULL CHECK (
    state IN (
      'local',
      'requested',
      'provisioning',
      'syncing',
      'starting',
      'active',
      'draining',
      'reconciling',
      'reclaimed',
      'failed'
    )
  ),
  environment_id TEXT,
  transition_generation INTEGER NOT NULL DEFAULT 0 CHECK (transition_generation >= 0),
  active_owner_epoch INTEGER CHECK (active_owner_epoch IS NULL OR active_owner_epoch >= 1),
  workspace_base_manifest_ref TEXT,
  remote_workspace_dir TEXT,
  worker_bundle_hash TEXT,
  last_transcript_ack_cursor INTEGER CHECK (
    last_transcript_ack_cursor IS NULL OR last_transcript_ack_cursor >= 0
  ),
  last_live_event_ack_cursor INTEGER CHECK (
    last_live_event_ack_cursor IS NULL OR last_live_event_ack_cursor >= 0
  ),
  recovery_error TEXT,
  turn_claim_owner TEXT CHECK (turn_claim_owner IN ('local', 'worker')),
  turn_claim_id TEXT,
  turn_claim_run_id TEXT,
  turn_claim_generation INTEGER CHECK (
    turn_claim_generation IS NULL OR turn_claim_generation >= 0
  ),
  turn_claim_owner_epoch INTEGER CHECK (
    turn_claim_owner_epoch IS NULL OR turn_claim_owner_epoch >= 1
  ),
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  state_changed_at_ms INTEGER NOT NULL,
  CHECK (
    (state IN ('local', 'requested')
      AND environment_id IS NULL AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL
      AND worker_bundle_hash IS NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IS 'provisioning'
      AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL
      AND worker_bundle_hash IS NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IS 'syncing'
      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL
      AND worker_bundle_hash IS NOT NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IS 'starting'
      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL
      AND worker_bundle_hash IS NOT NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IN ('active', 'draining', 'reconciling')
      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL
      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL
      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL)
    OR
    (state IS 'reclaimed'
      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL
      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL
      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL
      AND turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL
      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)
    OR
    (state IS 'failed' AND recovery_error IS NOT NULL)
  ),
  CHECK (
    (turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL
      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)
    OR
    (turn_claim_owner IS 'local' AND turn_claim_id IS NOT NULL
      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL
      AND turn_claim_owner_epoch IS NULL)
    OR
    (turn_claim_owner IS 'worker' AND turn_claim_id IS NOT NULL
      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL
      AND turn_claim_owner_epoch IS NOT NULL)
  ),
  CHECK (
    turn_claim_owner IS NULL
    OR
    (turn_claim_owner IS 'local' AND state IN ('local', 'requested', 'failed'))
    OR
    (turn_claim_owner IS 'worker' AND state IN ('active', 'draining')
      AND turn_claim_owner_epoch IS active_owner_epoch)
  )
) STRICT;

CREATE INDEX IF NOT EXISTS idx_worker_session_placements_session_key
  ON worker_session_placements(agent_id, session_key);

CREATE INDEX IF NOT EXISTS idx_worker_session_placements_reconcile
  ON worker_session_placements(updated_at_ms, session_id);

-- A reconciliation journal is written before managed-worktree mutation. The
-- bounded Git base snapshot repairs any subset left by an interrupted apply.
CREATE TABLE IF NOT EXISTS worker_workspace_reconciliations (
  session_id TEXT NOT NULL PRIMARY KEY,
  environment_id TEXT NOT NULL,
  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),
  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),
  base_manifest_ref TEXT NOT NULL,
  current_manifest_ref TEXT NOT NULL,
  plan_json TEXT NOT NULL,
  base_pack BLOB NOT NULL CHECK (length(base_pack) <= 268435456),
  created_at_ms INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE
) STRICT;

-- A completed remote turn is fenced from stale-claim teardown until its
-- workspace result is durably reconciled into the managed worktree.
CREATE TABLE IF NOT EXISTS worker_workspace_pending_results (
  session_id TEXT NOT NULL PRIMARY KEY,
  environment_id TEXT NOT NULL,
  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),
  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),
  claim_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  gateway_instance_id TEXT NOT NULL,
  recovery_requested_at_ms INTEGER,
  workspace_accepted_at_ms INTEGER,
  staged_result_ref TEXT,
  created_at_ms INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE
) STRICT;

-- One active, opaque admission credential per worker environment. Plaintext
-- may be retried until delivery acknowledgement but never enters durable state.
CREATE TABLE IF NOT EXISTS worker_environment_credentials (
  environment_id TEXT NOT NULL PRIMARY KEY,
  credential_hash TEXT NOT NULL UNIQUE,
  bundle_hash TEXT NOT NULL,
  session_id TEXT,
  rpc_set_version INTEGER NOT NULL CHECK (rpc_set_version >= 1),
  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 0),
  expires_at_ms INTEGER NOT NULL CHECK (expires_at_ms >= 0),
  delivered_at_ms INTEGER CHECK (delivered_at_ms >= 0),
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE
) STRICT;

-- One durable sequence cursor per attached session owner epoch. The environment
-- binding prevents independent workers with coincident epochs from sharing replay state.
CREATE TABLE IF NOT EXISTS worker_transcript_commit_heads (
  session_id TEXT NOT NULL,
  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),
  environment_id TEXT NOT NULL,
  next_seq INTEGER NOT NULL CHECK (next_seq >= 1),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),
  PRIMARY KEY (session_id, run_epoch)
) STRICT;

-- Pending rows preserve a claimed request across gateway restarts. Terminal rows
-- cache the exact result returned for deterministic at-least-once replay.
CREATE TABLE IF NOT EXISTS worker_transcript_commits (
  session_id TEXT NOT NULL,
  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),
  seq INTEGER NOT NULL CHECK (seq >= 1),
  request_hash TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),
  result_json TEXT,
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),
  PRIMARY KEY (session_id, run_epoch, seq),
  FOREIGN KEY (session_id, run_epoch)
    REFERENCES worker_transcript_commit_heads(session_id, run_epoch)
    ON DELETE CASCADE,
  CHECK (
    (state = 'pending' AND result_json IS NULL) OR
    (state = 'terminal' AND result_json IS NOT NULL)
  )
) STRICT;

-- Pending rows preserve a claimed inference turn across gateway restarts.
-- Terminal rows cache the exact outcome returned for deterministic replay.
CREATE TABLE IF NOT EXISTS worker_inference_turns (
  session_id TEXT NOT NULL,
  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),
  run_id TEXT NOT NULL,
  turn_id TEXT NOT NULL,
  environment_id TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),
  terminal_json TEXT,
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),
  PRIMARY KEY (session_id, run_epoch, run_id, turn_id),
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE,
  CHECK (
    (state = 'pending' AND terminal_json IS NULL) OR
    (state = 'terminal' AND terminal_json IS NOT NULL)
  )
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_worker_inference_turns_pending_run
  ON worker_inference_turns(session_id, run_epoch, run_id)
  WHERE state = 'pending';

CREATE TABLE IF NOT EXISTS fleet_cells (
  tenant_id TEXT NOT NULL PRIMARY KEY,
  created_at_ms INTEGER NOT NULL,
  image TEXT NOT NULL,
  runtime TEXT NOT NULL,
  host_port INTEGER NOT NULL,
  container_name TEXT NOT NULL,
  data_dir TEXT NOT NULL
) STRICT;
`;
  }
});

// src/state/openclaw-state-db-maintenance.ts
import path12 from "node:path";
function createOpenClawDatabaseVerificationError(kind, pathname, storedError) {
  const error = new Error(
    `OpenClaw ${kind} database ${pathname} is quarantined after integrity verification failed: ${storedError ?? "unknown integrity error"}. Restore the database from a backup or repair it, then run openclaw doctor --fix to clear the quarantine. See ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`
  );
  error.name = "SqliteIntegrityError";
  return error;
}
function assertSupportedSchemaVersion(db, pathname) {
  const userVersion = readSqliteUserVersion(db);
  if (userVersion > OPENCLAW_STATE_SCHEMA_VERSION) {
    throw createNewerSqliteSchemaVersionError(
      "OpenClaw state database",
      pathname,
      userVersion,
      OPENCLAW_STATE_SCHEMA_VERSION
    );
  }
}
function resolveDatabasePath(options = {}) {
  return path12.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
}
var init_openclaw_state_db_maintenance = __esm({
  "src/state/openclaw-state-db-maintenance.ts"() {
    "use strict";
    init_sqlite_schema_contract();
    init_sqlite_user_version();
    init_openclaw_state_db_contract();
    init_openclaw_state_db_paths();
    init_openclaw_state_schema_generated();
  }
});

// src/state/openclaw-state-db-operator-approval-migration.ts
function tableSql2(db) {
  const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'operator_approvals'").get();
  return typeof row?.sql === "string" ? row.sql : void 0;
}
function hasCanonicalOperatorApprovalKinds(db) {
  if (!tableExists2(db, "operator_approvals")) {
    return true;
  }
  return /kind\s+text\s+not\s+null\s+check\s*\(\s*kind\s+in\s*\(\s*'exec'\s*,\s*'plugin'\s*,\s*'system-agent'\s*\)\s*\)/.test(
    tableSql2(db)?.toLowerCase() ?? ""
  );
}
function assertCanonicalOperatorApprovalKinds(db, pathname) {
  if (!hasCanonicalOperatorApprovalKinds(db)) {
    throw new Error(
      `OpenClaw state database ${pathname} has a legacy operator approval schema; run openclaw doctor --fix to migrate it.`
    );
  }
}
function isCanonicalOperatorApprovalKind(value) {
  return value === "exec" || value === "plugin" || value === "system-agent";
}
var init_openclaw_state_db_operator_approval_migration = __esm({
  "src/state/openclaw-state-db-operator-approval-migration.ts"() {
    "use strict";
    init_sqlite_transaction();
    init_openclaw_state_db_schema_helpers();
    init_openclaw_state_schema_generated();
  }
});

// src/infra/map-size.ts
function pruneMapToMaxSize(map, maxSize) {
  if (Number.isNaN(maxSize) || maxSize === Number.POSITIVE_INFINITY) {
    return;
  }
  const limit = Math.max(0, Math.floor(maxSize));
  if (limit <= 0) {
    map.clear();
    return;
  }
  while (map.size > limit) {
    const oldest = map.keys().next();
    if (oldest.done) {
      break;
    }
    map.delete(oldest.value);
  }
}
var init_map_size = __esm({
  "src/infra/map-size.ts"() {
    "use strict";
  }
});

// src/infra/dedupe.ts
function createDedupeCache(options) {
  const ttlMs = resolveNonNegativeIntegerOption(options.ttlMs, 0);
  const maxSize = resolveNonNegativeIntegerOption(options.maxSize, 0);
  const cache = /* @__PURE__ */ new Map();
  const touch = (key, now) => {
    cache.delete(key);
    cache.set(key, now);
  };
  const prune = (now) => {
    const cutoff = ttlMs > 0 ? now - ttlMs : void 0;
    if (cutoff !== void 0) {
      for (const [entryKey, entryTs] of cache) {
        if (entryTs < cutoff) {
          cache.delete(entryKey);
        }
      }
    }
    if (maxSize <= 0) {
      cache.clear();
      return;
    }
    pruneMapToMaxSize(cache, maxSize);
  };
  const hasUnexpired = (key, now, touchOnRead) => {
    const existing = cache.get(key);
    if (existing === void 0) {
      return false;
    }
    if (ttlMs > 0 && now - existing >= ttlMs) {
      cache.delete(key);
      return false;
    }
    if (touchOnRead) {
      touch(key, now);
    }
    return true;
  };
  return {
    check: (key, now = Date.now()) => {
      if (!key) {
        return false;
      }
      if (hasUnexpired(key, now, true)) {
        return true;
      }
      touch(key, now);
      prune(now);
      return false;
    },
    peek: (key, now = Date.now()) => {
      if (!key) {
        return false;
      }
      return hasUnexpired(key, now, false);
    },
    delete: (key) => {
      if (!key) {
        return;
      }
      cache.delete(key);
    },
    clear: () => {
      cache.clear();
    },
    size: () => cache.size
  };
}
var init_dedupe = __esm({
  "src/infra/dedupe.ts"() {
    "use strict";
    init_number_coercion();
    init_global_singleton();
    init_map_size();
  }
});

// src/state/openclaw-state-db-permissions.ts
import { existsSync as existsSync2, mkdirSync as mkdirSync2 } from "node:fs";
import path13 from "node:path";
function bestEffortChmodSync(target, mode) {
  const result = applyPrivateModeSync(target, mode);
  if (result.applied || chmodWarnedTargets.check(target)) {
    return;
  }
  stateDbLog.warn(`skipped permission hardening for ${target}: ${String(result.error)}`);
}
function ensureOpenClawStatePermissions(pathname, env) {
  const dir = path13.dirname(pathname);
  const defaultDir = resolveOpenClawStateSqliteDir(env);
  const isDefaultStateDatabase = path13.resolve(pathname) === path13.resolve(resolveOpenClawStateSqlitePath(env));
  if (isDefaultStateDatabase && dir !== defaultDir) {
    throw new Error(`OpenClaw state database path resolved outside its state dir: ${pathname}`);
  }
  const dirExisted = existsSync2(dir);
  mkdirSync2(dir, { recursive: true, mode: OPENCLAW_STATE_DIR_MODE });
  if (isDefaultStateDatabase || !dirExisted) {
    bestEffortChmodSync(dir, OPENCLAW_STATE_DIR_MODE);
  }
  for (const candidate of resolveSqliteDatabaseFilePaths(pathname)) {
    if (existsSync2(candidate)) {
      bestEffortChmodSync(candidate, OPENCLAW_STATE_FILE_MODE);
    }
  }
}
var OPENCLAW_STATE_DIR_MODE, OPENCLAW_STATE_FILE_MODE, stateDbLog, chmodWarnedTargets;
var init_openclaw_state_db_permissions = __esm({
  "src/state/openclaw-state-db-permissions.ts"() {
    "use strict";
    init_dedupe();
    init_private_mode();
    init_sqlite_files();
    init_subsystem();
    init_openclaw_state_db_paths();
    OPENCLAW_STATE_DIR_MODE = 448;
    OPENCLAW_STATE_FILE_MODE = 384;
    stateDbLog = createSubsystemLogger("state/db");
    chmodWarnedTargets = createDedupeCache({
      ttlMs: 0,
      maxSize: 4096
    });
  }
});

// src/infra/approval-resolution-ref.ts
import { createHash as createHash2 } from "node:crypto";
function buildApprovalResolutionRef(params) {
  return createHash2("sha256").update(params.approvalKind, "utf8").update("\0", "utf8").update(params.approvalId, "utf8").digest("base64url");
}
var init_approval_resolution_ref = __esm({
  "src/infra/approval-resolution-ref.ts"() {
    "use strict";
  }
});

// src/state/openclaw-state-db-legacy-backfills.ts
function ensureOperatorApprovalResolutionRefs(db) {
  if (!tableExists2(db, "operator_approvals")) {
    return;
  }
  runSqliteImmediateTransactionSync(db, () => {
    ensureColumn(db, "operator_approvals", "resolution_ref TEXT");
    const rows = db.prepare("SELECT approval_id, kind, resolution_ref FROM operator_approvals").all();
    const update = db.prepare(
      "UPDATE operator_approvals SET resolution_ref = ? WHERE approval_id = ?"
    );
    for (const row of rows) {
      if (typeof row.approval_id !== "string" || !isCanonicalOperatorApprovalKind(row.kind)) {
        throw new Error("operator approval row cannot be assigned a transport reference");
      }
      const resolutionRef = buildApprovalResolutionRef({
        approvalId: row.approval_id,
        approvalKind: row.kind
      });
      if (row.resolution_ref !== resolutionRef) {
        update.run(resolutionRef, row.approval_id);
      }
    }
    const namespaceConflict = db.prepare(
      `SELECT canonical.approval_id
         FROM operator_approvals AS canonical
         JOIN operator_approvals AS referenced
           ON canonical.approval_id = referenced.resolution_ref
         WHERE canonical.approval_id <> referenced.approval_id
         LIMIT 1`
    ).get();
    if (namespaceConflict) {
      throw new Error("operator approval ids conflict with durable transport references");
    }
    db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref
        ON operator_approvals(resolution_ref);
    `);
  });
}
function repairLegacyTaskAgentAttribution(db) {
  if (!tableExists2(db, "task_runs") || !tableHasColumn(db, "task_runs", "requester_agent_id")) {
    return;
  }
  db.exec(`
    UPDATE task_runs
    SET
      requester_agent_id = CASE
        WHEN owner_key GLOB 'agent:*:*' THEN substr(
          owner_key,
          7,
          instr(substr(owner_key, 7), ':') - 1
        )
        WHEN requester_session_key GLOB 'agent:*:*' THEN substr(
          requester_session_key,
          7,
          instr(substr(requester_session_key, 7), ':') - 1
        )
        WHEN agent_id <> substr(
          child_session_key,
          7,
          instr(substr(child_session_key, 7), ':') - 1
        ) THEN agent_id
        ELSE NULL
      END,
      agent_id = substr(
        child_session_key,
        7,
        instr(substr(child_session_key, 7), ':') - 1
      )
    WHERE requester_agent_id IS NULL
      AND runtime IN ('subagent', 'acp')
      AND child_session_key GLOB 'agent:*:*'
      AND instr(substr(child_session_key, 7), ':') > 1
      AND (
        owner_key GLOB 'agent:*:*'
        OR requester_session_key GLOB 'agent:*:*'
        OR (
          agent_id IS NOT NULL
          AND agent_id <> substr(
            child_session_key,
            7,
            instr(substr(child_session_key, 7), ':') - 1
          )
        )
      );
  `);
}
function repairLegacyTaskDeliveryStatuses(db) {
  if (!tableExists2(db, "task_runs") || !tableHasColumn(db, "task_runs", "delivery_status")) {
    return;
  }
  db.exec(`
    UPDATE task_runs
    SET delivery_status = 'not_applicable'
    WHERE delivery_status = 'not-requested';
  `);
}
function backfillAcpReplayEstimatedBytes(db) {
  if (!tableExists2(db, "acp_replay_events") || !tableHasColumn(db, "acp_replay_events", "estimated_bytes")) {
    return;
  }
  const pendingEvent = db.prepare("SELECT 1 FROM acp_replay_events WHERE estimated_bytes = 0 LIMIT 1").get();
  const pendingSession = db.prepare("SELECT 1 FROM acp_replay_sessions WHERE estimated_bytes = 0 LIMIT 1").get();
  if (!pendingEvent && !pendingSession) {
    return;
  }
  db.exec(`
    UPDATE acp_replay_events
       SET estimated_bytes = length(session_id) + length(session_key) + length(update_json)
             + COALESCE(length(run_id), 0) + 32
     WHERE estimated_bytes = 0;
    UPDATE acp_replay_sessions
       SET estimated_bytes = length(session_id) + length(session_key) + length(cwd) + 32
             + COALESCE((SELECT SUM(e.estimated_bytes) FROM acp_replay_events e
                          WHERE e.session_id = acp_replay_sessions.session_id), 0)
     WHERE estimated_bytes = 0;
  `);
}
function backfillCronRunLogEntryJson(db) {
  if (!tableExists2(db, "cron_run_logs") || !tableHasColumn(db, "cron_run_logs", "entry_json")) {
    return;
  }
  const rows = db.prepare(
    `SELECT store_key, job_id, seq, ts
         FROM cron_run_logs
        WHERE entry_json = '{}'`
  ).all();
  if (rows.length === 0) {
    return;
  }
  const update = db.prepare(
    `UPDATE cron_run_logs
        SET entry_json = ?
      WHERE store_key = ? AND job_id = ? AND seq = ?`
  );
  for (const row of rows) {
    update.run(
      JSON.stringify({ ts: Number(row.ts), jobId: row.job_id, action: "finished" }),
      row.store_key,
      row.job_id,
      row.seq
    );
  }
}
function parseJsonRecord(value) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function textField(record, key) {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : null;
}
function numberField(record, key) {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function recordField(record, key) {
  const value = record[key];
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function jsonField(value) {
  return value === void 0 ? null : JSON.stringify(value);
}
function cronSessionTargetField(record) {
  const value = textField(record, "sessionTarget");
  if (!value) {
    return null;
  }
  return value === "main" || value === "isolated" || value === "current" || value.startsWith("session:") ? value : null;
}
function cronWakeModeField(record) {
  const value = textField(record, "wakeMode");
  return value === "now" || value === "next-heartbeat" ? value : null;
}
function booleanField(record, key) {
  const value = record[key];
  return typeof value === "boolean" ? value ? 1 : 0 : null;
}
function failureDestinationField(record, key) {
  if (!record || !Object.hasOwn(record, key)) {
    return null;
  }
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : "";
}
function migrateLegacyCronDeliveryThreadIds(db) {
  const rows = db.prepare(
    `SELECT store_key, job_id, job_json, delivery_thread_id
         FROM cron_jobs
        WHERE delivery_thread_id_type IS NULL`
  ).all();
  const update = db.prepare(
    `UPDATE cron_jobs
        SET delivery_thread_id = ?, delivery_thread_id_type = ?
      WHERE store_key = ? AND job_id = ? AND delivery_thread_id_type IS NULL`
  );
  for (const row of rows) {
    const job = parseJsonRecord(row.job_json);
    const delivery = job ? recordField(job, "delivery") : null;
    const typed = delivery?.threadId;
    if (row.delivery_thread_id === null) {
      if (typeof typed === "number" && Number.isFinite(typed)) {
        update.run(String(typed), "number", row.store_key, row.job_id);
      }
      continue;
    }
    const type = typeof typed === "number" && Number.isFinite(typed) && String(typed) === row.delivery_thread_id ? "number" : "string";
    update.run(row.delivery_thread_id, type, row.store_key, row.job_id);
  }
}
function backfillCronJobsFromJobJson(db) {
  if (!tableExists2(db, "cron_jobs") || !tableHasColumn(db, "cron_jobs", "job_json") || !tableHasColumn(db, "cron_jobs", "schedule_kind") || !tableHasColumn(db, "cron_jobs", "payload_kind")) {
    return;
  }
  const rows = db.prepare(
    `SELECT store_key, job_id, job_json, updated_at
         FROM cron_jobs
        WHERE schedule_kind = 'manual'
           OR payload_kind = 'message'
           OR name = ''`
  ).all();
  if (rows.length === 0) {
    return;
  }
  const update = db.prepare(
    `UPDATE cron_jobs
        SET name = ?,
            enabled = ?,
            delete_after_run = ?,
            created_at_ms = ?,
            agent_id = ?,
            session_key = ?,
            schedule_kind = ?,
            schedule_expr = ?,
            schedule_tz = ?,
            every_ms = ?,
            anchor_ms = ?,
            at = ?,
            stagger_ms = ?,
            session_target = ?,
            wake_mode = ?,
            payload_kind = ?,
            payload_message = ?,
            payload_model = ?,
            payload_fallbacks_json = ?,
            payload_thinking = ?,
            payload_timeout_seconds = ?,
            payload_allow_unsafe_external_content = ?,
            payload_external_content_source_json = ?,
            payload_light_context = ?,
            payload_tools_allow_json = ?,
            delivery_mode = ?,
            delivery_channel = ?,
            delivery_to = ?,
            delivery_thread_id = ?,
            delivery_account_id = ?,
            delivery_best_effort = ?,
            delivery_completion_mode = ?,
            delivery_completion_to = ?,
            failure_delivery_mode = ?,
            failure_delivery_channel = ?,
            failure_delivery_to = ?,
            failure_delivery_account_id = ?,
            failure_alert_disabled = ?,
            failure_alert_after = ?,
            failure_alert_channel = ?,
            failure_alert_to = ?,
            failure_alert_cooldown_ms = ?,
            failure_alert_include_skipped = ?,
            failure_alert_mode = ?,
            failure_alert_account_id = ?,
            runtime_updated_at_ms = ?
      WHERE store_key = ?
        AND job_id = ?`
  );
  for (const row of rows) {
    const job = parseJsonRecord(row.job_json);
    if (!job) {
      continue;
    }
    const schedule = recordField(job, "schedule");
    const payload = recordField(job, "payload");
    const scheduleKind = textField(schedule ?? {}, "kind");
    const payloadKind = textField(payload ?? {}, "kind");
    const isAt = scheduleKind === "at" && textField(schedule ?? {}, "at");
    const isEvery = scheduleKind === "every" && numberField(schedule ?? {}, "everyMs") != null;
    const isCron = scheduleKind === "cron" && textField(schedule ?? {}, "expr");
    const isSystemEvent = payloadKind === "systemEvent" && textField(payload ?? {}, "text");
    const isAgentTurn = payloadKind === "agentTurn" && textField(payload ?? {}, "message");
    if (!schedule || !payload || !isAt && !isEvery && !isCron || !isSystemEvent && !isAgentTurn) {
      continue;
    }
    const fallbackTime = Number(row.updated_at) || 0;
    const delivery = recordField(job, "delivery");
    const completionDestination = delivery ? recordField(delivery, "completionDestination") : null;
    const failureDestination = delivery ? recordField(delivery, "failureDestination") : null;
    const failureAlertValue = job.failureAlert;
    const failureAlert = failureAlertValue && typeof failureAlertValue === "object" && !Array.isArray(failureAlertValue) ? failureAlertValue : null;
    update.run(
      textField(job, "name") ?? row.job_id,
      job.enabled === false ? 0 : 1,
      booleanField(job, "deleteAfterRun"),
      numberField(job, "createdAtMs") ?? fallbackTime,
      textField(job, "agentId"),
      textField(job, "sessionKey"),
      scheduleKind,
      isCron ? textField(schedule, "expr") : null,
      isCron ? textField(schedule, "tz") : null,
      isEvery ? numberField(schedule, "everyMs") : null,
      isEvery ? numberField(schedule, "anchorMs") : null,
      isAt ? textField(schedule, "at") : null,
      isCron ? numberField(schedule, "staggerMs") : null,
      cronSessionTargetField(job) ?? (payloadKind === "agentTurn" ? "isolated" : "main"),
      cronWakeModeField(job) ?? "now",
      payloadKind,
      isSystemEvent ? textField(payload, "text") : textField(payload, "message"),
      isAgentTurn ? textField(payload, "model") : null,
      isAgentTurn ? jsonField(payload.fallbacks) : null,
      isAgentTurn ? textField(payload, "thinking") : null,
      isAgentTurn ? numberField(payload, "timeoutSeconds") : null,
      isAgentTurn && typeof payload.allowUnsafeExternalContent === "boolean" ? payload.allowUnsafeExternalContent ? 1 : 0 : null,
      isAgentTurn ? jsonField(payload.externalContentSource) : null,
      isAgentTurn && typeof payload.lightContext === "boolean" ? payload.lightContext ? 1 : 0 : null,
      isAgentTurn ? jsonField(payload.toolsAllow) : null,
      delivery ? textField(delivery, "mode") : null,
      delivery ? textField(delivery, "channel") : null,
      delivery ? textField(delivery, "to") : null,
      delivery ? textField(delivery, "threadId") : null,
      delivery ? textField(delivery, "accountId") : null,
      delivery && typeof delivery.bestEffort === "boolean" ? delivery.bestEffort ? 1 : 0 : null,
      completionDestination ? textField(completionDestination, "mode") : null,
      completionDestination ? textField(completionDestination, "to") : null,
      failureDestinationField(failureDestination, "mode"),
      failureDestinationField(failureDestination, "channel"),
      failureDestinationField(failureDestination, "to"),
      failureDestinationField(failureDestination, "accountId"),
      failureAlertValue === false ? 1 : failureAlert ? 0 : null,
      failureAlert ? numberField(failureAlert, "after") : null,
      failureAlert ? textField(failureAlert, "channel") : null,
      failureAlert ? textField(failureAlert, "to") : null,
      failureAlert ? numberField(failureAlert, "cooldownMs") : null,
      failureAlert && typeof failureAlert.includeSkipped === "boolean" ? failureAlert.includeSkipped ? 1 : 0 : null,
      failureAlert ? textField(failureAlert, "mode") : null,
      failureAlert ? textField(failureAlert, "accountId") : null,
      numberField(job, "updatedAtMs") ?? fallbackTime,
      row.store_key,
      row.job_id
    );
  }
}
function metadataStringField(record, key) {
  return textField(record, key);
}
function backfillDeliveryQueueEntriesFromEntryJson(db) {
  if (!tableExists2(db, "delivery_queue_entries") || !tableHasColumn(db, "delivery_queue_entries", "entry_json") || !tableHasColumn(db, "delivery_queue_entries", "retry_count")) {
    return;
  }
  const rows = db.prepare(
    `SELECT queue_name, id, entry_json
         FROM delivery_queue_entries
        WHERE status <> 'completed'
          AND (retry_count = 0
            OR last_attempt_at IS NULL
            OR last_error IS NULL
            OR recovery_state IS NULL
            OR platform_send_started_at IS NULL
            OR entry_kind IS NULL
            OR session_key IS NULL
            OR channel IS NULL
            OR target IS NULL
            OR account_id IS NULL)`
  ).all();
  if (rows.length === 0) {
    return;
  }
  const update = db.prepare(
    `UPDATE delivery_queue_entries
        SET entry_kind = COALESCE(?, entry_kind),
            session_key = COALESCE(?, session_key),
            channel = COALESCE(?, channel),
            target = COALESCE(?, target),
            account_id = COALESCE(?, account_id),
            retry_count = ?,
            last_attempt_at = COALESCE(?, last_attempt_at),
            last_error = COALESCE(?, last_error),
            recovery_state = COALESCE(?, recovery_state),
            platform_send_started_at = COALESCE(?, platform_send_started_at)
      WHERE queue_name = ?
        AND id = ?`
  );
  for (const row of rows) {
    const entry = parseJsonRecord(row.entry_json);
    if (!entry) {
      continue;
    }
    const session = recordField(entry, "session");
    const route = recordField(entry, "route");
    const deliveryContext = recordField(entry, "deliveryContext");
    update.run(
      metadataStringField(entry, "kind"),
      metadataStringField(entry, "sessionKey") ?? (session ? metadataStringField(session, "key") : null),
      metadataStringField(entry, "channel") ?? (route ? metadataStringField(route, "channel") : null) ?? (deliveryContext ? metadataStringField(deliveryContext, "channel") : null),
      metadataStringField(entry, "to") ?? (route ? metadataStringField(route, "to") : null) ?? (deliveryContext ? metadataStringField(deliveryContext, "to") : null),
      metadataStringField(entry, "accountId") ?? (route ? metadataStringField(route, "accountId") : null) ?? (deliveryContext ? metadataStringField(deliveryContext, "accountId") : null),
      numberField(entry, "retryCount") ?? 0,
      numberField(entry, "lastAttemptAt"),
      metadataStringField(entry, "lastError"),
      metadataStringField(entry, "recoveryState"),
      numberField(entry, "platformSendStartedAt"),
      row.queue_name,
      row.id
    );
  }
}
var init_openclaw_state_db_legacy_backfills = __esm({
  "src/state/openclaw-state-db-legacy-backfills.ts"() {
    "use strict";
    init_approval_resolution_ref();
    init_sqlite_transaction();
    init_openclaw_state_db_operator_approval_migration();
    init_openclaw_state_db_schema_helpers();
  }
});

// src/state/openclaw-state-db-schema-additive.ts
import path14 from "node:path";
function resolveLegacyManagedImageRoot(recordJson) {
  if (typeof recordJson !== "string") {
    return null;
  }
  let record;
  try {
    record = JSON.parse(recordJson);
  } catch {
    return null;
  }
  if (!isRecord(record) || !isRecord(record.original)) {
    return null;
  }
  const mediaRoot = record.original.mediaRoot;
  if (typeof mediaRoot === "string" && mediaRoot.trim()) {
    return path14.resolve(mediaRoot);
  }
  const originalPath = record.original.path;
  if (typeof originalPath !== "string" || !originalPath.trim()) {
    return null;
  }
  const resolvedOriginalPath = path14.resolve(originalPath);
  return path14.dirname(path14.dirname(path14.dirname(resolvedOriginalPath)));
}
function backfillLegacyManagedImageRoots(db) {
  const rows = db.prepare("SELECT attachment_id, record_json FROM managed_outgoing_image_records").all();
  const updateRoot = db.prepare(
    "UPDATE managed_outgoing_image_records SET original_media_root = ? WHERE attachment_id = ?"
  );
  const deleteRecord = db.prepare(
    "DELETE FROM managed_outgoing_image_records WHERE attachment_id = ?"
  );
  for (const row of rows) {
    const mediaRoot = resolveLegacyManagedImageRoot(row.record_json);
    if (mediaRoot) {
      updateRoot.run(mediaRoot, row.attachment_id);
    } else {
      deleteRecord.run(row.attachment_id);
    }
  }
}
function ensureAdditiveStateColumns(db) {
  const addedDiagnosticEventSequence = ensureColumn(
    db,
    "diagnostic_events",
    "sequence INTEGER NOT NULL DEFAULT 0"
  );
  if (addedDiagnosticEventSequence) {
    db.exec(`
      WITH ranked AS (
        SELECT
          rowid AS event_rowid,
          ROW_NUMBER() OVER (
            PARTITION BY scope
            ORDER BY created_at ASC, rowid ASC
          ) AS sequence
        FROM diagnostic_events
      )
      UPDATE diagnostic_events
      SET sequence = (
        SELECT ranked.sequence
        FROM ranked
        WHERE ranked.event_rowid = diagnostic_events.rowid
      );
    `);
  }
  db.exec("DROP INDEX IF EXISTS idx_diagnostic_events_scope_created;");
  ensureColumn(db, "worktrees", "provisioned_paths_json TEXT");
  ensureColumn(db, "node_host_config", "gateway_context_path TEXT");
  ensureColumn(db, "node_host_config", "installed_apps_sharing INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "apns_registrations", "relay_origin TEXT");
  ensureColumn(db, "device_pairing_pending", "refreshed_at_ms INTEGER");
  ensureColumn(db, "device_pairing_pending", "browser_origin TEXT");
  ensureColumn(db, "device_pairing_paired", "approved_via TEXT");
  ensureColumn(db, "device_pairing_paired", "browser_origin TEXT");
  ensureColumn(db, "device_pairing_paired", "operator_label TEXT");
  ensureColumn(db, "device_pairing_paired", "node_surface_json TEXT");
  ensureColumn(db, "device_pairing_paired", "pending_node_surface_json TEXT");
  ensureColumn(db, "cron_run_logs", "status TEXT");
  ensureColumn(db, "cron_run_logs", "error TEXT");
  ensureColumn(db, "cron_run_logs", "summary TEXT");
  ensureColumn(db, "cron_run_logs", "diagnostics_summary TEXT");
  ensureColumn(db, "cron_run_logs", "delivery_status TEXT");
  ensureColumn(db, "cron_run_logs", "delivery_error TEXT");
  ensureColumn(db, "cron_run_logs", "delivered INTEGER");
  ensureColumn(db, "cron_run_logs", "session_id TEXT");
  ensureColumn(db, "cron_run_logs", "session_key TEXT");
  ensureColumn(db, "cron_run_logs", "run_id TEXT");
  ensureColumn(db, "cron_run_logs", "run_at_ms INTEGER");
  ensureColumn(db, "cron_run_logs", "duration_ms INTEGER");
  ensureColumn(db, "cron_run_logs", "next_run_at_ms INTEGER");
  ensureColumn(db, "cron_run_logs", "model TEXT");
  ensureColumn(db, "cron_run_logs", "provider TEXT");
  ensureColumn(db, "cron_run_logs", "total_tokens INTEGER");
  ensureColumn(db, "cron_run_logs", "entry_json TEXT NOT NULL DEFAULT '{}'");
  ensureColumn(db, "cron_run_logs", "created_at INTEGER NOT NULL DEFAULT 0");
  backfillCronRunLogEntryJson(db);
  ensureColumn(db, "acp_replay_events", "estimated_bytes INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "acp_replay_sessions", "estimated_bytes INTEGER NOT NULL DEFAULT 0");
  backfillAcpReplayEstimatedBytes(db);
  ensureColumn(db, "cron_jobs", "description TEXT");
  ensureColumn(db, "cron_jobs", "declaration_key TEXT");
  ensureColumn(db, "cron_jobs", "display_name TEXT");
  ensureColumn(db, "cron_jobs", "owner_agent_id TEXT");
  ensureColumn(db, "cron_jobs", "owner_session_key TEXT");
  ensureColumn(db, "cron_jobs", "name TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "cron_jobs", "enabled INTEGER NOT NULL DEFAULT 1");
  ensureColumn(db, "cron_jobs", "delete_after_run INTEGER");
  ensureColumn(db, "cron_jobs", "created_at_ms INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "cron_jobs", "agent_id TEXT");
  ensureColumn(db, "cron_jobs", "session_key TEXT");
  ensureColumn(db, "cron_jobs", "schedule_kind TEXT NOT NULL DEFAULT 'manual'");
  ensureColumn(db, "cron_jobs", "schedule_expr TEXT");
  ensureColumn(db, "cron_jobs", "schedule_tz TEXT");
  ensureColumn(db, "cron_jobs", "every_ms INTEGER");
  ensureColumn(db, "cron_jobs", "anchor_ms INTEGER");
  ensureColumn(db, "cron_jobs", "at TEXT");
  ensureColumn(db, "cron_jobs", "stagger_ms INTEGER");
  ensureColumn(db, "cron_jobs", "session_target TEXT NOT NULL DEFAULT 'main'");
  ensureColumn(db, "cron_jobs", "wake_mode TEXT NOT NULL DEFAULT 'auto'");
  ensureColumn(db, "cron_jobs", "trigger_script TEXT");
  ensureColumn(db, "cron_jobs", "trigger_once INTEGER");
  ensureColumn(db, "cron_jobs", "payload_kind TEXT NOT NULL DEFAULT 'message'");
  ensureColumn(db, "cron_jobs", "payload_message TEXT");
  ensureColumn(db, "cron_jobs", "payload_model TEXT");
  ensureColumn(db, "cron_jobs", "payload_fallbacks_json TEXT");
  ensureColumn(db, "cron_jobs", "payload_thinking TEXT");
  ensureColumn(db, "cron_jobs", "payload_timeout_seconds INTEGER");
  ensureColumn(db, "cron_jobs", "payload_allow_unsafe_external_content INTEGER");
  ensureColumn(db, "cron_jobs", "payload_external_content_source_json TEXT");
  ensureColumn(db, "cron_jobs", "payload_light_context INTEGER");
  ensureColumn(db, "cron_jobs", "payload_tools_allow_json TEXT");
  ensureColumn(db, "cron_jobs", "payload_tools_allow_is_default INTEGER");
  ensureColumn(db, "cron_jobs", "delivery_mode TEXT");
  ensureColumn(db, "cron_jobs", "delivery_channel TEXT");
  ensureColumn(db, "cron_jobs", "delivery_to TEXT");
  ensureColumn(db, "cron_jobs", "delivery_thread_id TEXT");
  ensureColumn(db, "cron_jobs", "delivery_account_id TEXT");
  ensureColumn(db, "cron_jobs", "delivery_best_effort INTEGER");
  ensureColumn(db, "cron_jobs", "delivery_completion_mode TEXT");
  ensureColumn(db, "cron_jobs", "delivery_completion_to TEXT");
  ensureColumn(db, "cron_jobs", "failure_delivery_mode TEXT");
  ensureColumn(db, "cron_jobs", "failure_delivery_channel TEXT");
  ensureColumn(db, "cron_jobs", "failure_delivery_to TEXT");
  ensureColumn(db, "cron_jobs", "failure_delivery_account_id TEXT");
  ensureColumn(db, "cron_jobs", "failure_alert_disabled INTEGER");
  ensureColumn(db, "cron_jobs", "failure_alert_after INTEGER");
  ensureColumn(db, "cron_jobs", "failure_alert_channel TEXT");
  ensureColumn(db, "cron_jobs", "failure_alert_to TEXT");
  ensureColumn(db, "cron_jobs", "failure_alert_cooldown_ms INTEGER");
  ensureColumn(db, "cron_jobs", "failure_alert_include_skipped INTEGER");
  ensureColumn(db, "cron_jobs", "failure_alert_mode TEXT");
  ensureColumn(db, "cron_jobs", "failure_alert_account_id TEXT");
  ensureColumn(db, "cron_jobs", "next_run_at_ms INTEGER");
  ensureColumn(db, "cron_jobs", "running_at_ms INTEGER");
  ensureColumn(db, "cron_jobs", "last_run_at_ms INTEGER");
  ensureColumn(db, "cron_jobs", "last_run_status TEXT");
  ensureColumn(db, "cron_jobs", "last_error TEXT");
  ensureColumn(db, "cron_jobs", "last_duration_ms INTEGER");
  ensureColumn(db, "cron_jobs", "consecutive_errors INTEGER");
  ensureColumn(db, "cron_jobs", "consecutive_skipped INTEGER");
  ensureColumn(db, "cron_jobs", "schedule_error_count INTEGER");
  ensureColumn(db, "cron_jobs", "last_delivery_status TEXT");
  ensureColumn(db, "cron_jobs", "last_delivery_error TEXT");
  ensureColumn(db, "cron_jobs", "last_delivered INTEGER");
  ensureColumn(db, "cron_jobs", "last_failure_alert_at_ms INTEGER");
  ensureColumn(db, "cron_jobs", "state_json TEXT NOT NULL DEFAULT '{}'");
  ensureColumn(db, "cron_jobs", "runtime_updated_at_ms INTEGER");
  ensureColumn(db, "cron_jobs", "schedule_identity TEXT");
  ensureColumn(db, "cron_jobs", "sort_order INTEGER NOT NULL DEFAULT 0");
  backfillCronJobsFromJobJson(db);
  const addedDeliveryThreadIdType = ensureColumn(db, "cron_jobs", "delivery_thread_id_type TEXT");
  if (addedDeliveryThreadIdType) {
    migrateLegacyCronDeliveryThreadIds(db);
  }
  ensureColumn(db, "sandbox_registry_entries", "session_key TEXT");
  ensureColumn(db, "sandbox_registry_entries", "backend_id TEXT");
  ensureColumn(db, "sandbox_registry_entries", "runtime_label TEXT");
  ensureColumn(db, "sandbox_registry_entries", "image TEXT");
  ensureColumn(db, "sandbox_registry_entries", "created_at_ms INTEGER");
  ensureColumn(db, "sandbox_registry_entries", "last_used_at_ms INTEGER");
  ensureColumn(db, "sandbox_registry_entries", "config_label_kind TEXT");
  ensureColumn(db, "sandbox_registry_entries", "config_hash TEXT");
  ensureColumn(db, "sandbox_registry_entries", "cdp_port INTEGER");
  ensureColumn(db, "sandbox_registry_entries", "no_vnc_port INTEGER");
  ensureColumn(db, "delivery_queue_entries", "entry_kind TEXT");
  ensureColumn(db, "delivery_queue_entries", "session_key TEXT");
  ensureColumn(db, "delivery_queue_entries", "channel TEXT");
  ensureColumn(db, "delivery_queue_entries", "target TEXT");
  ensureColumn(db, "delivery_queue_entries", "account_id TEXT");
  ensureColumn(db, "delivery_queue_entries", "retry_count INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "delivery_queue_entries", "last_attempt_at INTEGER");
  ensureColumn(db, "delivery_queue_entries", "last_error TEXT");
  ensureColumn(db, "delivery_queue_entries", "recovery_state TEXT");
  ensureColumn(db, "delivery_queue_entries", "platform_send_started_at INTEGER");
  backfillDeliveryQueueEntriesFromEntryJson(db);
  ensureColumn(db, "commitments", "account_id TEXT");
  ensureColumn(db, "commitments", "recipient_id TEXT");
  ensureColumn(db, "commitments", "thread_id TEXT");
  ensureColumn(db, "commitments", "sender_id TEXT");
  ensureColumn(db, "commitments", "kind TEXT NOT NULL DEFAULT 'followup'");
  ensureColumn(db, "commitments", "sensitivity TEXT NOT NULL DEFAULT 'normal'");
  ensureColumn(db, "commitments", "source TEXT NOT NULL DEFAULT 'unknown'");
  ensureColumn(db, "commitments", "reason TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "commitments", "suggested_text TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "commitments", "dedupe_key TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "commitments", "confidence REAL NOT NULL DEFAULT 0");
  ensureColumn(db, "commitments", "due_timezone TEXT NOT NULL DEFAULT 'UTC'");
  ensureColumn(db, "commitments", "source_message_id TEXT");
  ensureColumn(db, "commitments", "source_run_id TEXT");
  ensureColumn(db, "commitments", "created_at_ms INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "commitments", "attempts INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "commitments", "last_attempt_at_ms INTEGER");
  ensureColumn(db, "commitments", "sent_at_ms INTEGER");
  ensureColumn(db, "commitments", "dismissed_at_ms INTEGER");
  ensureColumn(db, "commitments", "snoozed_until_ms INTEGER");
  ensureColumn(db, "commitments", "expired_at_ms INTEGER");
  const addedOriginalMediaRoot = ensureColumn(
    db,
    "managed_outgoing_image_records",
    "original_media_root TEXT NOT NULL DEFAULT ''"
  );
  if (addedOriginalMediaRoot) {
    backfillLegacyManagedImageRoots(db);
  }
  ensureColumn(db, "managed_outgoing_image_records", "agent_id TEXT");
  ensureColumn(
    db,
    "managed_outgoing_image_records",
    "cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))"
  );
  ensureColumn(db, "current_conversation_bindings", "target_agent_id TEXT NOT NULL DEFAULT 'main'");
  ensureColumn(db, "current_conversation_bindings", "target_session_id TEXT");
  ensureColumn(
    db,
    "current_conversation_bindings",
    "conversation_kind TEXT NOT NULL DEFAULT 'channel'"
  );
  ensureColumn(db, "device_bootstrap_tokens", "pending_profile_json TEXT");
  ensureColumn(db, "gateway_restart_handoff", "restart_trace_started_at INTEGER");
  ensureColumn(db, "gateway_restart_handoff", "restart_trace_last_at INTEGER");
  ensureColumn(db, "gateway_restart_intent", "reason TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "delivery_channel TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "delivery_to TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "delivery_account_id TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "message TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "continuation_json TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "doctor_hint TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "stats_json TEXT");
  ensureColumn(db, "gateway_boot_lifecycle", "startup_reason TEXT");
  ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_mode TEXT");
  ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_key_id TEXT");
  ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_signature_count INTEGER");
  ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_threshold INTEGER");
  ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_verified_at TEXT");
  const addedTaskRequesterAgentId = ensureColumn(db, "task_runs", "requester_agent_id TEXT");
  if (addedTaskRequesterAgentId) {
    repairLegacyTaskAgentAttribution(db);
  }
  repairLegacyTaskDeliveryStatuses(db);
  ensureColumn(db, "task_runs", "tool_use_count INTEGER");
  ensureColumn(db, "task_runs", "last_tool_name TEXT");
  ensureColumn(db, "task_runs", "detail_json TEXT");
  ensureColumn(db, "subagent_runs", "task_name TEXT");
  ensureColumn(db, "subagent_runs", "requester_settle_wake_status TEXT");
  ensureColumn(db, "subagent_runs", "requester_settle_wake_attempt_count INTEGER");
  ensureColumn(db, "subagent_runs", "requester_settle_wake_replay_count INTEGER");
  ensureColumn(db, "subagent_runs", "requester_settle_wake_next_attempt_at INTEGER");
  ensureColumn(db, "subagent_runs", "requester_settle_wake_batch_run_ids_json TEXT");
  ensureColumn(db, "subagent_runs", "requester_settle_wake_last_error TEXT");
  ensureColumn(db, "subagent_runs", "requester_settle_wake_retire_after INTEGER");
  ensureColumn(db, "subagent_runs", "swarm_group_id TEXT");
  ensureColumn(db, "subagent_runs", "swarm_collector INTEGER");
  ensureColumn(db, "subagent_runs", "swarm_output_schema_json TEXT");
  ensureColumn(db, "subagent_runs", "swarm_completion_status TEXT");
  ensureColumn(db, "subagent_runs", "swarm_structured_json TEXT");
  ensureColumn(db, "subagent_runs", "swarm_schema_error TEXT");
  ensureColumn(db, "subagent_runs", "swarm_usage_json TEXT");
  ensureColumn(db, "worker_environments", "bootstrap_bundle_hash TEXT");
  ensureColumn(db, "worker_environments", "bootstrap_openclaw_version TEXT");
  ensureColumn(db, "worker_environments", "bootstrap_protocol_features_json TEXT");
  ensureColumn(
    db,
    "worker_environments",
    "owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0)"
  );
  ensureColumn(db, "worker_environments", "ssh_host_key TEXT");
  ensureColumn(db, "worker_workspace_pending_results", "staged_result_ref TEXT");
  ensureColumn(
    db,
    "worker_environments",
    "teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed'))"
  );
  ensureOperatorApprovalResolutionRefs(db);
}
var init_openclaw_state_db_schema_additive = __esm({
  "src/state/openclaw-state-db-schema-additive.ts"() {
    "use strict";
    init_record_coerce();
    init_openclaw_state_db_legacy_backfills();
    init_openclaw_state_db_schema_helpers();
  }
});

// src/state/session-watch-cursor-provenance.ts
var SESSION_WATCH_PROVENANCE_EXPLICIT, SESSION_WATCH_PROVENANCE_AMBIENT_GROUP;
var init_session_watch_cursor_provenance = __esm({
  "src/state/session-watch-cursor-provenance.ts"() {
    "use strict";
    SESSION_WATCH_PROVENANCE_EXPLICIT = "explicit";
    SESSION_WATCH_PROVENANCE_AMBIENT_GROUP = "ambient-group";
  }
});

// src/state/openclaw-state-db-session-watch-migration.ts
function getSessionWatchCursorKysely(db) {
  return getNodeSqliteKysely(db);
}
function decodeLegacyAmbientWatchMarkerKey(markerKey) {
  const encoded = markerKey.slice(LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX.length);
  if (!encoded || encoded.length % 2 !== 0 || !/^[0-9a-f]+$/.test(encoded)) {
    return void 0;
  }
  return Buffer.from(encoded, "hex").toString("utf8");
}
function migrateSessionWatchCursorProvenance(db) {
  if (!tableExists2(db, "session_watch_cursors")) {
    return { addedColumn: false, migratedAmbientWatches: 0, removedLegacySentinels: 0 };
  }
  const addedColumn = ensureColumn(
    db,
    "session_watch_cursors",
    SESSION_WATCH_PROVENANCE_COLUMN_SQL
  );
  const kysely = getSessionWatchCursorKysely(db);
  const legacyMarkers = executeSqliteQuerySync(
    db,
    kysely.selectFrom("session_watch_cursors").select(["watcher_session_key", "target_session_key", "updated_at"]).where("watcher_session_key", "like", `${LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX}%`)
  ).rows;
  let migratedAmbientWatches = 0;
  for (const marker of legacyMarkers) {
    const watcherSessionKey = decodeLegacyAmbientWatchMarkerKey(marker.watcher_session_key);
    if (watcherSessionKey) {
      const watch = executeSqliteQueryTakeFirstSync(
        db,
        kysely.selectFrom("session_watch_cursors").select("updated_at").where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", marker.target_session_key)
      );
      if (watch) {
        const promoted = executeSqliteQuerySync(
          db,
          kysely.updateTable("session_watch_cursors").set({
            provenance: SESSION_WATCH_PROVENANCE_AMBIENT_GROUP,
            updated_at: Math.max(watch.updated_at, marker.updated_at)
          }).where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", marker.target_session_key)
        );
        migratedAmbientWatches += Number(promoted.numAffectedRows ?? 0n);
      }
    }
    executeSqliteQuerySync(
      db,
      kysely.deleteFrom("session_watch_cursors").where("watcher_session_key", "=", marker.watcher_session_key).where("target_session_key", "=", marker.target_session_key)
    );
  }
  return {
    addedColumn,
    migratedAmbientWatches,
    removedLegacySentinels: legacyMarkers.length
  };
}
var LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX, SESSION_WATCH_PROVENANCE_COLUMN_SQL;
var init_openclaw_state_db_session_watch_migration = __esm({
  "src/state/openclaw-state-db-session-watch-migration.ts"() {
    "use strict";
    init_kysely_sync();
    init_openclaw_state_db_schema_helpers();
    init_session_watch_cursor_provenance();
    LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX = "ambient-group-watch:";
    SESSION_WATCH_PROVENANCE_COLUMN_SQL = `provenance TEXT NOT NULL DEFAULT '${SESSION_WATCH_PROVENANCE_EXPLICIT}' CHECK (provenance IN ('${SESSION_WATCH_PROVENANCE_EXPLICIT}', '${SESSION_WATCH_PROVENANCE_AMBIENT_GROUP}'))`;
  }
});

// src/state/openclaw-state-db-schema-repair.ts
function dropLegacyStateTables(db) {
  const transientHistoryTable = ["database", "verifications"].join("_");
  db.exec(`DROP TABLE IF EXISTS ${transientHistoryTable};`);
  db.exec("DROP TABLE IF EXISTS node_pairing_pending; DROP TABLE IF EXISTS node_pairing_paired;");
}
function hasCanonicalAgentDatabasesPrimaryKey(db) {
  if (!tableExists2(db, "agent_databases")) {
    return true;
  }
  const primaryKey = tablePrimaryKeyColumns(db, "agent_databases");
  return primaryKey.length === 2 && primaryKey[0] === "agent_id" && primaryKey[1] === "path";
}
function repairLegacyGatewayRestartHandoffsForStrictMigration(db) {
  if (!tableExists2(db, "gateway_restart_handoff")) {
    return;
  }
  db.prepare("DELETE FROM gateway_restart_handoff WHERE expires_at <= ?").run(Date.now());
  db.exec(`
    UPDATE gateway_restart_handoff
    SET
      restart_trace_started_at = CASE
        WHEN typeof(restart_trace_started_at) = 'real'
          THEN CAST(restart_trace_started_at AS INTEGER)
        ELSE restart_trace_started_at
      END,
      restart_trace_last_at = CASE
        WHEN typeof(restart_trace_last_at) = 'real'
          THEN CAST(restart_trace_last_at AS INTEGER)
        ELSE restart_trace_last_at
      END
    WHERE typeof(restart_trace_started_at) = 'real'
       OR typeof(restart_trace_last_at) = 'real';
  `);
}
function assertCanonicalStateSchemaShape(db, pathname) {
  assertCanonicalOperatorApprovalKinds(db, pathname);
  if (!hasCanonicalAgentDatabasesPrimaryKey(db)) {
    throw new Error(
      `OpenClaw state database ${pathname} has a legacy agent database registry schema; run openclaw doctor --fix to migrate it.`
    );
  }
  if (!hasCanonicalAuditEventsSchema(db)) {
    if (canRepairLegacyAuditEventsSchema(db)) {
      throw new Error(
        `OpenClaw state database ${pathname} has a legacy audit event schema; run openclaw doctor --fix to migrate it.`
      );
    }
    throw new Error(
      `OpenClaw state database ${pathname} has a noncanonical audit event schema that cannot be repaired automatically; restore the canonical audit_events shape before retrying.`
    );
  }
}
var init_openclaw_state_db_schema_repair = __esm({
  "src/state/openclaw-state-db-schema-repair.ts"() {
    "use strict";
    init_node_sqlite();
    init_sqlite_user_version();
    init_openclaw_state_db_audit_migration();
    init_openclaw_state_db_contract();
    init_openclaw_state_db_maintenance();
    init_openclaw_state_db_operator_approval_migration();
    init_openclaw_state_db_schema_helpers();
    init_openclaw_state_db_session_watch_migration();
  }
});

// src/state/openclaw-state-db-startup-checkpoint.ts
var init_openclaw_state_db_startup_checkpoint = __esm({
  "src/state/openclaw-state-db-startup-checkpoint.ts"() {
    "use strict";
    init_node_sqlite();
    init_sqlite_integrity();
    init_sqlite_transaction();
    init_openclaw_state_db_contract();
    init_openclaw_state_db_maintenance();
    init_openclaw_state_db_permissions();
    init_openclaw_state_db_schema_helpers();
  }
});

// src/state/openclaw-state-db.ts
function recordOpenClawStateDatabaseOpenFailure(pathname, error) {
  terminalOpenLatch.record(pathname, error);
}
function ensureSchema(db, pathname) {
  const now = Date.now();
  const kysely = getNodeSqliteKysely(db);
  db.exec("PRAGMA foreign_keys = OFF;");
  try {
    runSqliteImmediateTransactionSync(
      db,
      () => {
        assertSupportedSchemaVersion(db, pathname);
        const previousVersion = readSqliteUserVersion(db);
        dropLegacyStateTables(db);
        ensureAdditiveStateColumns(db);
        migrateSessionWatchCursorProvenance(db);
        assertCanonicalStateSchemaShape(db, pathname);
        db.exec(OPENCLAW_STATE_SCHEMA_SQL);
        migrateLegacyCronRunLogsToTaskRuns(db);
        if (previousVersion < OPENCLAW_STATE_STRICT_SCHEMA_VERSION) {
          repairLegacyGatewayRestartHandoffsForStrictMigration(db);
          migrateSqliteSchemaToStrictInTransaction(db, OPENCLAW_STATE_SCHEMA_SQL, {
            databaseLabel: pathname
          });
        }
        repairCanonicalSqliteUniqueIndexes(db, pathname, OPENCLAW_STATE_CANONICAL_UNIQUE_INDEXES);
        db.exec(`PRAGMA user_version = ${OPENCLAW_STATE_SCHEMA_VERSION};`);
        executeSqliteQuerySync(
          db,
          kysely.insertInto("schema_meta").values({
            meta_key: "primary",
            role: "global",
            schema_version: OPENCLAW_STATE_SCHEMA_VERSION,
            agent_id: null,
            app_version: VERSION,
            created_at: now,
            updated_at: now
          }).onConflict(
            (conflict) => conflict.column("meta_key").doUpdateSet({
              role: "global",
              schema_version: OPENCLAW_STATE_SCHEMA_VERSION,
              agent_id: null,
              app_version: VERSION,
              updated_at: now
            })
          )
        );
      },
      {
        busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
        databaseLabel: pathname,
        operationLabel: "state.schema.ensure"
      }
    );
  } finally {
    db.exec("PRAGMA foreign_keys = ON;");
  }
}
function assertStateDatabaseIntegrityBeforeMutation(database, pathname) {
  database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
  const userVersion = readSqliteUserVersion(database);
  const hasApplicationSchema = database.prepare("SELECT 1 FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' LIMIT 1").get();
  if (userVersion === 0 && hasApplicationSchema || userVersion > 0 && userVersion < OPENCLAW_STATE_SCHEMA_VERSION) {
    stateDbLog2.info("state database schema migration pending; verifying integrity first", {
      fromVersion: userVersion,
      path: pathname,
      toVersion: OPENCLAW_STATE_SCHEMA_VERSION
    });
    assertSqliteIntegrity(database, pathname);
    return;
  }
  if (tableExists2(database, "schema_meta")) {
    assertSqliteTableIntegrity(database, pathname, "schema_meta");
  }
}
function openOpenClawStateDatabase(options = {}) {
  const env = options.env ?? process.env;
  const pathname = resolveDatabasePath(options);
  const terminalFailure = terminalOpenLatch.get(pathname);
  if (terminalFailure) {
    throw terminalFailure;
  }
  const cached = cachedDatabases.get(pathname);
  if (cached?.db.isOpen) {
    return cached;
  }
  if (cached) {
    cached.walMaintenance.close();
    clearNodeSqliteKyselyCacheForDatabase(cached.db);
    cachedDatabases.delete(pathname);
  }
  let quarantineFailure;
  try {
    const quarantine = readOpenClawDatabaseQuarantine(pathname, { env });
    if (quarantine) {
      quarantineFailure = createOpenClawDatabaseVerificationError(
        "state",
        pathname,
        quarantine.reason
      );
    }
  } catch {
  }
  if (quarantineFailure) {
    throw quarantineFailure;
  }
  ensureOpenClawStatePermissions(pathname, env);
  const sqlite = requireNodeSqlite();
  const db = new sqlite.DatabaseSync(pathname);
  const walMaintenance = (() => {
    let maintenance;
    try {
      db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
      assertSupportedSchemaVersion(db, pathname);
      assertStateDatabaseIntegrityBeforeMutation(db, pathname);
      configureSqlitePreSchemaPragmas(db, {
        busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS
      });
      maintenance = configureSqliteConnectionPragmas(db, {
        busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
        databaseLabel: "openclaw-state",
        databasePath: pathname,
        foreignKeys: true,
        synchronous: "NORMAL"
      });
      ensureSchema(db, pathname);
      return maintenance;
    } catch (err) {
      maintenance?.close();
      db.close();
      if (err instanceof Error && (err.name === "SqliteSchemaVersionError" || isTerminalSqliteIntegrityError(err))) {
        recordOpenClawStateDatabaseOpenFailure(pathname, err);
      }
      throw err;
    }
  })();
  ensureOpenClawStatePermissions(pathname, env);
  const database = { db, path: pathname, walMaintenance };
  cachedDatabases.set(pathname, database);
  terminalOpenLatch.clear(pathname);
  return database;
}
var OPENCLAW_STATE_CANONICAL_UNIQUE_INDEXES, cachedDatabases, terminalOpenLatch, stateDbLog2;
var init_openclaw_state_db = __esm({
  "src/state/openclaw-state-db.ts"() {
    "use strict";
    init_kysely_sync();
    init_node_sqlite();
    init_sqlite_index_schema();
    init_sqlite_integrity();
    init_sqlite_strict();
    init_sqlite_terminal_open_latch();
    init_sqlite_transaction();
    init_sqlite_user_version();
    init_sqlite_wal();
    init_state_migrations_cron_run_logs();
    init_subsystem();
    init_version();
    init_openclaw_quarantine_store();
    init_openclaw_state_db_audit_migration();
    init_openclaw_state_db_contract();
    init_openclaw_state_db_maintenance();
    init_openclaw_state_db_operator_approval_migration();
    init_openclaw_state_db_permissions();
    init_openclaw_state_db_schema_additive();
    init_openclaw_state_db_schema_helpers();
    init_openclaw_state_db_schema_repair();
    init_openclaw_state_db_session_watch_migration();
    init_openclaw_state_schema_generated();
    init_openclaw_state_db_maintenance();
    init_openclaw_state_db_permissions();
    init_openclaw_state_db_schema_repair();
    init_openclaw_state_db_startup_checkpoint();
    OPENCLAW_STATE_CANONICAL_UNIQUE_INDEXES = [
      {
        name: "idx_operator_approvals_resolution_ref",
        definition: "ON operator_approvals(resolution_ref)"
      },
      {
        name: "idx_worker_environments_provider_lease",
        definition: `
      ON worker_environments(provider_id, lease_id)
      WHERE lease_id IS NOT NULL
    `
      }
    ];
    cachedDatabases = /* @__PURE__ */ new Map();
    terminalOpenLatch = createSqliteTerminalOpenLatch({
      closeByPath: (pathname) => {
        const cached = cachedDatabases.get(pathname);
        if (!cached) {
          return;
        }
        cached.walMaintenance.close();
        clearNodeSqliteKyselyCacheForDatabase(cached.db);
        if (cached.db.isOpen) {
          cached.db.close();
        }
        cachedDatabases.delete(pathname);
      }
    });
    stateDbLog2 = createSubsystemLogger("state/db");
  }
});

// src/proxy-capture/store.sqlite.ts
import fs6 from "node:fs";
import path15 from "node:path";
import { StringDecoder } from "node:string_decoder";
import { gunzipSync, gzipSync } from "node:zlib";
function isInMemoryDatabasePath(dbPath) {
  if (dbPath === ":memory:") {
    return true;
  }
  if (!dbPath.startsWith("file:")) {
    return false;
  }
  const fragmentIndex = dbPath.indexOf("#");
  const uriWithoutFragment = fragmentIndex === -1 ? dbPath : dbPath.slice(0, fragmentIndex);
  const queryIndex = uriWithoutFragment.indexOf("?");
  const uriPath = queryIndex === -1 ? uriWithoutFragment : uriWithoutFragment.slice(0, queryIndex);
  try {
    if (decodeURIComponent(uriPath.slice("file:".length)) === ":memory:") {
      return true;
    }
  } catch {
  }
  return queryIndex !== -1 && new URLSearchParams(uriWithoutFragment.slice(queryIndex + 1)).get("mode") === "memory";
}
function hardenLegacyDatabaseFiles(dbPath) {
  for (const candidate of resolveSqliteDatabaseFilePaths(dbPath)) {
    if (fs6.existsSync(candidate)) {
      applyPrivateModeSync(candidate, DEBUG_PROXY_CAPTURE_FILE_MODE);
    }
  }
}
function openPathBasedDebugProxyCaptureStore(dbPath, blobDir) {
  const fileBackedPath = isInMemoryDatabasePath(dbPath) ? void 0 : dbPath;
  if (fileBackedPath) {
    fs6.mkdirSync(path15.dirname(fileBackedPath), {
      recursive: true,
      mode: DEBUG_PROXY_CAPTURE_DIR_MODE
    });
    if (!fs6.existsSync(fileBackedPath)) {
      fs6.closeSync(fs6.openSync(fileBackedPath, "a", DEBUG_PROXY_CAPTURE_FILE_MODE));
    }
  }
  const { DatabaseSync } = requireNodeSqlite();
  const db = new DatabaseSync(dbPath);
  let walMaintenance;
  try {
    if (fileBackedPath) {
      applyPrivateModeSync(fileBackedPath, DEBUG_PROXY_CAPTURE_FILE_MODE);
    }
    walMaintenance = configureSqliteConnectionPragmas(db, {
      busyTimeoutMs: 5e3,
      databaseLabel: "debug-proxy-capture-sdk",
      ...fileBackedPath ? { databasePath: fileBackedPath } : {},
      foreignKeys: true
    });
    const versionRow = db.prepare("PRAGMA user_version").get();
    const schemaVersion = Number(versionRow?.user_version ?? 0);
    if (schemaVersion > DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION) {
      throw new Error(
        `Legacy debug proxy capture database uses newer schema version ${schemaVersion}; this build supports ${DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION}`
      );
    }
    db.exec(DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_SQL);
    if (schemaVersion < DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION) {
      migrateSqliteSchemaToStrict(db, DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_SQL, {
        databaseLabel: fileBackedPath ?? dbPath
      });
      db.exec(`PRAGMA user_version = ${DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION};`);
    }
    if (fileBackedPath) {
      hardenLegacyDatabaseFiles(fileBackedPath);
    }
    return {
      db,
      pathBased: {
        blobDir,
        walMaintenance
      }
    };
  } catch (err) {
    walMaintenance?.close();
    db.close();
    throw err;
  }
}
function serializeJson(value) {
  return value == null ? null : JSON.stringify(value);
}
function parseMetaJson(metaJson) {
  if (typeof metaJson !== "string" || metaJson.trim().length === 0) {
    return null;
  }
  try {
    const parsed = JSON.parse(metaJson);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
function sortObservedCounts(counts) {
  return [...counts.entries()].map(([value, count]) => ({ value, count })).toSorted((left, right) => right.count - left.count || left.value.localeCompare(right.value));
}
function resolveDebugProxyCaptureStoreKey(optionsOrDbPath, legacyBlobDir) {
  return typeof optionsOrDbPath === "string" ? `legacy:${optionsOrDbPath}:${legacyBlobDir ?? ""}` : `shared:${openOpenClawStateDatabase({ env: optionsOrDbPath.env }).path}`;
}
function getDebugProxyCaptureStoreImpl(optionsOrDbPath = {}, legacyBlobDir) {
  const key = resolveDebugProxyCaptureStoreKey(optionsOrDbPath, legacyBlobDir);
  const cached = cachedStores.get(key);
  if (cached && !cached.store.isClosed) {
    return cached.store;
  }
  const store = new DebugProxyCaptureStoreImpl(optionsOrDbPath, legacyBlobDir);
  cachedStores.set(key, { store, leases: 0 });
  unregisterExitClose ??= registerSqliteCacheExitClose(closeDebugProxyCaptureStore);
  return store;
}
function getDebugProxyCaptureStore(optionsOrDbPath = {}, legacyBlobDir) {
  return getDebugProxyCaptureStoreImpl(optionsOrDbPath, legacyBlobDir);
}
function closeDebugProxyCaptureStore() {
  unregisterExitClose?.();
  unregisterExitClose = null;
  for (const cached of cachedStores.values()) {
    cached.store.close();
  }
  cachedStores.clear();
}
function persistEventPayload(store, params) {
  if (params.data == null) {
    return {};
  }
  const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data);
  const previewLimit = params.previewLimit ?? 8192;
  const blob = store.persistPayload(buffer, params.contentType);
  return {
    dataText: new StringDecoder("utf8").write(buffer.subarray(0, previewLimit)),
    dataBlobId: blob.blobId,
    dataSha256: blob.sha256
  };
}
function safeJsonString(value) {
  const raw = serializeJson(value);
  return raw ?? void 0;
}
var DEBUG_PROXY_CAPTURE_DIR_MODE, DEBUG_PROXY_CAPTURE_FILE_MODE, DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION, DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_SQL, DebugProxyCaptureStoreImpl, cachedStores, unregisterExitClose;
var init_store_sqlite = __esm({
  "src/proxy-capture/store.sqlite.ts"() {
    "use strict";
    init_string_coerce();
    init_string_normalization();
    init_crypto_digest();
    init_node_sqlite();
    init_private_mode();
    init_sqlite_files();
    init_sqlite_strict();
    init_sqlite_transaction();
    init_sqlite_wal();
    init_openclaw_state_db();
    DEBUG_PROXY_CAPTURE_DIR_MODE = 448;
    DEBUG_PROXY_CAPTURE_FILE_MODE = 384;
    DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION = 1;
    DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS capture_sessions (
    id TEXT PRIMARY KEY,
    started_at INTEGER NOT NULL,
    ended_at INTEGER,
    mode TEXT NOT NULL,
    source_scope TEXT NOT NULL,
    source_process TEXT NOT NULL,
    proxy_url TEXT,
    db_path TEXT NOT NULL,
    blob_dir TEXT NOT NULL
  ) STRICT;
  CREATE TABLE IF NOT EXISTS capture_events (
    id INTEGER PRIMARY KEY,
    session_id TEXT NOT NULL,
    ts INTEGER NOT NULL,
    source_scope TEXT NOT NULL,
    source_process TEXT NOT NULL,
    protocol TEXT NOT NULL,
    direction TEXT NOT NULL,
    kind TEXT NOT NULL,
    flow_id TEXT NOT NULL,
    method TEXT,
    host TEXT,
    path TEXT,
    status INTEGER,
    close_code INTEGER,
    content_type TEXT,
    headers_json TEXT,
    data_text TEXT,
    data_blob_id TEXT,
    data_sha256 TEXT,
    error_text TEXT,
    meta_json TEXT
  ) STRICT;
  CREATE INDEX IF NOT EXISTS capture_events_session_ts_idx ON capture_events(session_id, ts);
  CREATE INDEX IF NOT EXISTS capture_events_flow_idx ON capture_events(flow_id, ts);
`;
    DebugProxyCaptureStoreImpl = class {
      constructor(optionsOrDbPath = {}, legacyBlobDir) {
        this.closed = false;
        if (typeof optionsOrDbPath === "string") {
          if (!legacyBlobDir) {
            throw new TypeError("legacy debug proxy capture store requires a blob directory");
          }
          const opened = openPathBasedDebugProxyCaptureStore(optionsOrDbPath, legacyBlobDir);
          this.db = opened.db;
          this.dbPath = optionsOrDbPath;
          this.blobDir = legacyBlobDir;
          this.pathBased = opened.pathBased;
          return;
        }
        const database = openOpenClawStateDatabase({ env: optionsOrDbPath.env });
        this.db = database.db;
        this.dbPath = database.path;
        this.blobDir = database.path;
      }
      close() {
        if (this.closed) {
          return;
        }
        if (this.pathBased) {
          this.pathBased.walMaintenance.close();
          this.db.close();
        }
        this.closed = true;
      }
      get isClosed() {
        return this.closed || !this.db.isOpen;
      }
      upsertSession(session) {
        if (this.pathBased) {
          this.db.prepare(
            `INSERT INTO capture_sessions (
            id, started_at, ended_at, mode, source_scope, source_process, proxy_url, db_path, blob_dir
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            ended_at=excluded.ended_at,
            proxy_url=excluded.proxy_url,
            source_process=excluded.source_process`
          ).run(
            session.id,
            session.startedAt,
            session.endedAt ?? null,
            session.mode,
            session.sourceScope,
            session.sourceProcess,
            session.proxyUrl ?? null,
            session.dbPath ?? this.dbPath,
            session.blobDir ?? this.pathBased.blobDir
          );
          return;
        }
        this.db.prepare(
          `INSERT INTO capture_sessions (
          id, started_at, ended_at, mode, source_scope, source_process, proxy_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          started_at=MIN(capture_sessions.started_at, excluded.started_at),
          ended_at=excluded.ended_at,
          mode=CASE
            WHEN capture_sessions.mode = 'implicit' THEN excluded.mode
            ELSE capture_sessions.mode
          END,
          proxy_url=excluded.proxy_url,
          source_process=excluded.source_process`
        ).run(
          session.id,
          session.startedAt,
          session.endedAt ?? null,
          session.mode,
          session.sourceScope,
          session.sourceProcess,
          session.proxyUrl ?? null
        );
      }
      endSession(sessionId, endedAt = Date.now()) {
        this.db.prepare(`UPDATE capture_sessions SET ended_at = ? WHERE id = ?`).run(endedAt, sessionId);
      }
      persistPayload(data, contentType) {
        const sha256 = sha256Hex(data);
        const blobId = sha256.slice(0, 24);
        if (this.pathBased) {
          fs6.mkdirSync(this.pathBased.blobDir, {
            recursive: true,
            mode: DEBUG_PROXY_CAPTURE_DIR_MODE
          });
          const outputPath = path15.join(this.pathBased.blobDir, `${blobId}.bin.gz`);
          if (!fs6.existsSync(outputPath)) {
            fs6.writeFileSync(outputPath, gzipSync(data), {
              mode: DEBUG_PROXY_CAPTURE_FILE_MODE
            });
          }
          applyPrivateModeSync(outputPath, DEBUG_PROXY_CAPTURE_FILE_MODE);
          return {
            blobId,
            path: outputPath,
            encoding: "gzip",
            sizeBytes: data.byteLength,
            sha256,
            ...contentType ? { contentType } : {}
          };
        }
        this.db.prepare(
          `INSERT OR IGNORE INTO capture_blobs (
          blob_id, content_type, encoding, size_bytes, sha256, data, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).run(
          blobId,
          contentType ?? null,
          "gzip",
          data.byteLength,
          sha256,
          gzipSync(data),
          Date.now()
        );
        return {
          blobId,
          encoding: "gzip",
          sizeBytes: data.byteLength,
          sha256,
          ...contentType ? { contentType } : {}
        };
      }
      recordEvent(event) {
        if (this.pathBased) {
          this.insertEvent(event, event.dataBlobId ?? null);
          return;
        }
        runSqliteImmediateTransactionSync(this.db, () => {
          this.db.prepare(
            `INSERT OR IGNORE INTO capture_sessions (
            id, started_at, mode, source_scope, source_process
          ) VALUES (?, ?, 'implicit', ?, ?)`
          ).run(event.sessionId, event.ts, event.sourceScope, event.sourceProcess);
          const dataBlobId = event.dataBlobId && this.db.prepare(`SELECT 1 FROM capture_blobs WHERE blob_id = ?`).get(event.dataBlobId) ? event.dataBlobId : null;
          this.insertEvent(event, dataBlobId);
        });
      }
      insertEvent(event, dataBlobId) {
        this.db.prepare(
          `INSERT INTO capture_events (
          session_id, ts, source_scope, source_process, protocol, direction, kind, flow_id,
          method, host, path, status, close_code, content_type, headers_json,
          data_text, data_blob_id, data_sha256, error_text, meta_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(
          event.sessionId,
          event.ts,
          event.sourceScope,
          event.sourceProcess,
          event.protocol,
          event.direction,
          event.kind,
          event.flowId,
          event.method ?? null,
          event.host ?? null,
          event.path ?? null,
          event.status ?? null,
          event.closeCode ?? null,
          event.contentType ?? null,
          event.headersJson ?? null,
          event.dataText ?? null,
          dataBlobId,
          event.dataSha256 ?? null,
          event.errorText ?? null,
          event.metaJson ?? null
        );
      }
      listSessions(limit = 50) {
        return this.db.prepare(
          `SELECT
           s.id,
           s.started_at AS startedAt,
           s.ended_at AS endedAt,
           s.mode,
           s.source_process AS sourceProcess,
           s.proxy_url AS proxyUrl,
           COUNT(e.id) AS eventCount
         FROM capture_sessions s
         LEFT JOIN capture_events e ON e.session_id = s.id
         GROUP BY s.id
         ORDER BY s.started_at DESC
         LIMIT ?`
        ).all(limit);
      }
      getSessionEvents(sessionId, limit = 500) {
        return this.db.prepare(
          `SELECT
           id, session_id AS sessionId, ts, source_scope AS sourceScope, source_process AS sourceProcess,
           protocol, direction, kind, flow_id AS flowId, method, host, path, status, close_code AS closeCode,
           content_type AS contentType, headers_json AS headersJson, data_text AS dataText,
           data_blob_id AS dataBlobId, data_sha256 AS dataSha256, error_text AS errorText, meta_json AS metaJson
         FROM capture_events
         WHERE session_id = ?
         ORDER BY ts DESC, id DESC
         LIMIT ?`
        ).all(sessionId, limit);
      }
      summarizeSessionCoverage(sessionId) {
        const rows = this.db.prepare(
          `SELECT host, meta_json AS metaJson
         FROM capture_events
         WHERE session_id = ?`
        ).all(sessionId);
        const providers = /* @__PURE__ */ new Map();
        const apis = /* @__PURE__ */ new Map();
        const models = /* @__PURE__ */ new Map();
        const hosts = /* @__PURE__ */ new Map();
        const localPeers = /* @__PURE__ */ new Map();
        let unlabeledEventCount = 0;
        for (const row of rows) {
          const meta = parseMetaJson(row.metaJson);
          const provider = normalizeNullableString(meta?.provider);
          const api = normalizeNullableString(meta?.api);
          const model = normalizeNullableString(meta?.model);
          const host = normalizeNullableString(row.host);
          if (!provider && !api && !model) {
            unlabeledEventCount += 1;
          }
          if (provider) {
            providers.set(provider, (providers.get(provider) ?? 0) + 1);
          }
          if (api) {
            apis.set(api, (apis.get(api) ?? 0) + 1);
          }
          if (model) {
            models.set(model, (models.get(model) ?? 0) + 1);
          }
          if (host) {
            hosts.set(host, (hosts.get(host) ?? 0) + 1);
            if (host === "127.0.0.1:11434" || host.startsWith("127.0.0.1:") || host.startsWith("localhost:")) {
              localPeers.set(host, (localPeers.get(host) ?? 0) + 1);
            }
          }
        }
        return {
          sessionId,
          totalEvents: rows.length,
          unlabeledEventCount,
          providers: sortObservedCounts(providers),
          apis: sortObservedCounts(apis),
          models: sortObservedCounts(models),
          hosts: sortObservedCounts(hosts),
          localPeers: sortObservedCounts(localPeers)
        };
      }
      readBlob(blobId) {
        if (this.pathBased) {
          const legacyRow = this.db.prepare(`SELECT data_blob_id AS blobId FROM capture_events WHERE data_blob_id = ? LIMIT 1`).get(blobId);
          if (!legacyRow?.blobId) {
            return null;
          }
          const blobPath = path15.join(this.pathBased.blobDir, `${legacyRow.blobId}.bin.gz`);
          return fs6.existsSync(blobPath) ? gunzipSync(fs6.readFileSync(blobPath)).toString("utf8") : null;
        }
        const row = this.db.prepare(`SELECT encoding, data FROM capture_blobs WHERE blob_id = ?`).get(blobId);
        if (row?.data) {
          const data = Buffer.from(row.data);
          return (row.encoding === "gzip" ? gunzipSync(data) : data).toString("utf8");
        }
        return null;
      }
      queryPreset(preset, sessionId) {
        const sessionWhere = sessionId ? "AND session_id = ?" : "";
        const args = sessionId ? [sessionId] : [];
        switch (preset) {
          // Presets are intentionally SQL-only summaries so the CLI can query large
          // capture sessions without loading every event into memory.
          case "double-sends":
            return this.db.prepare(
              `SELECT host, path, method, COUNT(*) AS duplicateCount
             FROM capture_events
             WHERE kind = 'request' ${sessionWhere}
             GROUP BY host, path, method, data_sha256
             HAVING COUNT(*) > 1
             ORDER BY duplicateCount DESC, host ASC`
            ).all(...args);
          case "retry-storms":
            return this.db.prepare(
              `SELECT host, path, COUNT(*) AS errorCount
             FROM capture_events
             WHERE kind = 'response' AND status >= 429 ${sessionWhere}
             GROUP BY host, path
             HAVING COUNT(*) > 1
             ORDER BY errorCount DESC, host ASC`
            ).all(...args);
          case "cache-busting":
            return this.db.prepare(
              `SELECT host, path, COUNT(*) AS variantCount
             FROM capture_events
             WHERE kind = 'request'
               AND (path LIKE '%?%' OR headers_json LIKE '%cache-control%' OR headers_json LIKE '%pragma%')
               ${sessionWhere}
             GROUP BY host, path
             ORDER BY variantCount DESC, host ASC`
            ).all(...args);
          case "ws-duplicate-frames":
            return this.db.prepare(
              `SELECT host, path, COUNT(*) AS duplicateFrames
             FROM capture_events
             WHERE kind = 'ws-frame' AND direction = 'outbound' ${sessionWhere}
             GROUP BY host, path, data_sha256
             HAVING COUNT(*) > 1
             ORDER BY duplicateFrames DESC, host ASC`
            ).all(...args);
          case "missing-ack":
            return this.db.prepare(
              `SELECT flow_id AS flowId, host, path, COUNT(*) AS outboundFrames
             FROM capture_events
             WHERE kind = 'ws-frame' AND direction = 'outbound' ${sessionWhere}
               AND flow_id NOT IN (
                 SELECT flow_id FROM capture_events
                 WHERE kind = 'ws-frame' AND direction = 'inbound' ${sessionId ? "AND session_id = ?" : ""}
               )
             GROUP BY flow_id, host, path
             ORDER BY outboundFrames DESC`
            ).all(...sessionId ? [sessionId, sessionId] : []);
          case "error-bursts":
            return this.db.prepare(
              `SELECT host, path, COUNT(*) AS errorCount
             FROM capture_events
             WHERE kind = 'error' ${sessionWhere}
             GROUP BY host, path
             ORDER BY errorCount DESC, host ASC`
            ).all(...args);
          default:
            return [];
        }
      }
      purgeAll() {
        if (this.pathBased) {
          const sessionCount = this.db.prepare(`SELECT COUNT(*) AS count FROM capture_sessions`).get().count ?? 0;
          const eventCount = this.db.prepare(`SELECT COUNT(*) AS count FROM capture_events`).get().count ?? 0;
          this.db.exec(`DELETE FROM capture_events; DELETE FROM capture_sessions;`);
          let blobs = 0;
          if (fs6.existsSync(this.pathBased.blobDir)) {
            for (const entry of fs6.readdirSync(this.pathBased.blobDir)) {
              fs6.rmSync(path15.join(this.pathBased.blobDir, entry), { force: true });
              blobs += 1;
            }
          }
          return { sessions: sessionCount, events: eventCount, blobs };
        }
        return runSqliteImmediateTransactionSync(this.db, () => {
          const sessionCount = this.db.prepare(`SELECT COUNT(*) AS count FROM capture_sessions`).get().count ?? 0;
          const eventCount = this.db.prepare(`SELECT COUNT(*) AS count FROM capture_events`).get().count ?? 0;
          const blobCount = this.db.prepare(`SELECT COUNT(*) AS count FROM capture_blobs`).get().count ?? 0;
          this.db.exec(
            `DELETE FROM capture_events; DELETE FROM capture_sessions; DELETE FROM capture_blobs;`
          );
          return { sessions: sessionCount, events: eventCount, blobs: blobCount };
        });
      }
      deleteSessions(sessionIds) {
        const uniqueSessionIds = normalizeUniqueStringEntries(sessionIds);
        if (uniqueSessionIds.length === 0) {
          return { sessions: 0, events: 0, blobs: 0 };
        }
        if (this.pathBased) {
          return this.deletePathBasedSessions(uniqueSessionIds);
        }
        return runSqliteImmediateTransactionSync(this.db, () => {
          const placeholders = uniqueSessionIds.map(() => "?").join(", ");
          const blobRows = this.db.prepare(
            `SELECT DISTINCT data_blob_id AS blobId
           FROM capture_events
           WHERE session_id IN (${placeholders})
             AND data_blob_id IS NOT NULL`
          ).all(...uniqueSessionIds);
          const eventCount = this.db.prepare(
            `SELECT COUNT(*) AS count
               FROM capture_events
               WHERE session_id IN (${placeholders})`
          ).get(...uniqueSessionIds).count ?? 0;
          const sessionCount = this.db.prepare(
            `SELECT COUNT(*) AS count
               FROM capture_sessions
               WHERE id IN (${placeholders})`
          ).get(...uniqueSessionIds).count ?? 0;
          this.db.prepare(`DELETE FROM capture_events WHERE session_id IN (${placeholders})`).run(...uniqueSessionIds);
          this.db.prepare(`DELETE FROM capture_sessions WHERE id IN (${placeholders})`).run(...uniqueSessionIds);
          const candidateBlobIds = blobRows.map((row) => row.blobId?.trim()).filter((blobId) => Boolean(blobId));
          const remainingBlobRefs = (
            // Shared blobs are deleted only when no surviving event references them.
            candidateBlobIds.length > 0 ? new Set(
              this.db.prepare(
                `SELECT DISTINCT data_blob_id AS blobId
                     FROM capture_events
                     WHERE data_blob_id IN (${candidateBlobIds.map(() => "?").join(", ")})
                       AND data_blob_id IS NOT NULL`
              ).all(...candidateBlobIds).map((row) => row.blobId?.trim()).filter((blobId) => Boolean(blobId))
            ) : /* @__PURE__ */ new Set()
          );
          let blobs = 0;
          const deleteBlob = this.db.prepare(`DELETE FROM capture_blobs WHERE blob_id = ?`);
          for (const blobId of candidateBlobIds) {
            if (remainingBlobRefs.has(blobId)) {
              continue;
            }
            const result = deleteBlob.run(blobId);
            if (Number(result.changes) > 0) {
              blobs += 1;
            }
          }
          return { sessions: sessionCount, events: eventCount, blobs };
        });
      }
      deletePathBasedSessions(sessionIds) {
        const pathBased = this.pathBased;
        if (!pathBased) {
          throw new Error("path-based debug proxy capture store is unavailable");
        }
        const placeholders = sessionIds.map(() => "?").join(", ");
        const blobRows = this.db.prepare(
          `SELECT DISTINCT data_blob_id AS blobId
         FROM capture_events
         WHERE session_id IN (${placeholders})
           AND data_blob_id IS NOT NULL`
        ).all(...sessionIds);
        const eventCount = this.db.prepare(
          `SELECT COUNT(*) AS count
             FROM capture_events
             WHERE session_id IN (${placeholders})`
        ).get(...sessionIds).count ?? 0;
        const sessionCount = this.db.prepare(
          `SELECT COUNT(*) AS count
             FROM capture_sessions
             WHERE id IN (${placeholders})`
        ).get(...sessionIds).count ?? 0;
        this.db.prepare(`DELETE FROM capture_events WHERE session_id IN (${placeholders})`).run(...sessionIds);
        this.db.prepare(`DELETE FROM capture_sessions WHERE id IN (${placeholders})`).run(...sessionIds);
        const candidateBlobIds = blobRows.map((row) => row.blobId?.trim()).filter((blobId) => Boolean(blobId));
        const remainingBlobRefs = candidateBlobIds.length > 0 ? new Set(
          this.db.prepare(
            `SELECT DISTINCT data_blob_id AS blobId
                   FROM capture_events
                   WHERE data_blob_id IN (${candidateBlobIds.map(() => "?").join(", ")})
                     AND data_blob_id IS NOT NULL`
          ).all(...candidateBlobIds).map((row) => row.blobId?.trim()).filter((blobId) => Boolean(blobId))
        ) : /* @__PURE__ */ new Set();
        let blobs = 0;
        for (const blobId of candidateBlobIds) {
          if (remainingBlobRefs.has(blobId)) {
            continue;
          }
          const blobPath = path15.join(pathBased.blobDir, `${blobId}.bin.gz`);
          if (fs6.existsSync(blobPath)) {
            fs6.rmSync(blobPath, { force: true });
            blobs += 1;
          }
        }
        return { sessions: sessionCount, events: eventCount, blobs };
      }
    };
    cachedStores = /* @__PURE__ */ new Map();
    unregisterExitClose = null;
  }
});

// src/proxy-capture/runtime.ts
var runtime_exports = {};
__export(runtime_exports, {
  captureHttpExchange: () => captureHttpExchange,
  captureWsEvent: () => captureWsEvent,
  finalizeDebugProxyCapture: () => finalizeDebugProxyCapture,
  initializeDebugProxyCapture: () => initializeDebugProxyCapture,
  isDebugProxyGlobalFetchPatchInstalled: () => isDebugProxyGlobalFetchPatchInstalled
});
import { isUtf8 } from "node:buffer";
import { randomUUID as randomUUID4 } from "node:crypto";
import { URL as URL2 } from "node:url";
async function readCapturedResponseBodyBounded(response, maxBytes) {
  const clone = response.clone();
  const body = clone.body;
  if (!body || typeof body.getReader !== "function") {
    return clone instanceof Response && clone.body === null ? { status: "captured", buffer: Buffer.alloc(0) } : { status: "unavailable" };
  }
  const reader = body.getReader();
  const chunks = [];
  let total = 0;
  let truncated = false;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (!value?.length) {
        continue;
      }
      if (total + value.length > maxBytes) {
        truncated = true;
        break;
      }
      chunks.push(Buffer.from(value));
      total += value.length;
    }
  } finally {
    if (truncated) {
      void reader.cancel().catch(() => void 0);
    }
    try {
      reader.releaseLock();
    } catch {
    }
  }
  return truncated ? { status: "too-large" } : { status: "captured", buffer: Buffer.concat(chunks, total) };
}
function parseDeclaredCaptureContentLength(raw) {
  if (raw === null || raw === void 0) {
    return void 0;
  }
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) {
    return void 0;
  }
  return BigInt(trimmed);
}
function resolveRuntimeDeps(deps = {}) {
  return {
    getStore: deps.getStore ?? getDebugProxyCaptureStore,
    closeStore: deps.closeStore ?? closeDebugProxyCaptureStore,
    persistEventPayload: deps.persistEventPayload ?? ((store, payload) => persistEventPayload(store, payload)),
    safeJsonString: deps.safeJsonString ?? safeJsonString,
    fetchTarget: deps.fetchTarget ?? globalThis
  };
}
function protocolFromUrl(rawUrl) {
  try {
    const url = new URL2(rawUrl);
    switch (url.protocol) {
      case "https:":
        return "https";
      case "wss:":
        return "wss";
      case "ws:":
        return "ws";
      default:
        return "http";
    }
  } catch {
    return "http";
  }
}
function resolveUrlString(input) {
  if (input instanceof URL2) {
    return input.toString();
  }
  if (typeof input === "string") {
    return input;
  }
  if (typeof Request !== "undefined" && input instanceof Request) {
    return input.url;
  }
  return null;
}
function isSensitiveCaptureHeaderName(name) {
  const normalized = name.trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  if (SENSITIVE_CAPTURE_HEADER_NAMES.has(normalized)) {
    return true;
  }
  return SENSITIVE_CAPTURE_HEADER_NAME_FRAGMENTS.some((fragment) => normalized.includes(fragment));
}
function redactedCaptureHeaders(headers) {
  if (!headers) {
    return void 0;
  }
  const entries = headers instanceof Headers ? Array.from(headers.entries()) : Object.entries(headers);
  const redacted = {};
  for (const [name, value] of entries) {
    redacted[name] = isSensitiveCaptureHeaderName(name) ? REDACTED_CAPTURE_HEADER_VALUE : redactRegisteredSecretValues(value, () => REDACTED_CAPTURE_HEADER_VALUE);
  }
  return redacted;
}
function redactCaptureUrl(rawUrl) {
  let url;
  try {
    url = new URL2(rawUrl);
  } catch {
    return "https://redacted.invalid/%5BREDACTED%5D";
  }
  const redactComponent = (value) => redactRegisteredSecretValues(value, () => REDACTED_CAPTURE_HEADER_VALUE);
  const decodeComponent = (value) => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };
  if (redactComponent(url.hostname) !== url.hostname) {
    url.hostname = "redacted.invalid";
  }
  for (const key of ["username", "password"]) {
    const decoded = decodeComponent(url[key]);
    const redacted = redactComponent(decoded);
    if (redacted !== decoded) {
      url[key] = redacted;
    }
  }
  url.pathname = url.pathname.split("/").map((segment) => {
    try {
      const decoded = decodeURIComponent(segment);
      const redacted = redactComponent(decoded);
      return redacted === decoded ? segment : encodeURIComponent(redacted);
    } catch {
      return segment;
    }
  }).join("/");
  const searchParams = new URLSearchParams();
  let searchChanged = false;
  for (const [name, value] of url.searchParams.entries()) {
    const redactedName = redactComponent(name);
    const redactedValue = redactComponent(value);
    searchParams.append(redactedName, redactedValue);
    if (redactedName !== name || redactedValue !== value) {
      searchChanged = true;
    }
  }
  if (searchChanged) {
    url.search = searchParams.toString();
  }
  const decodedHash = decodeComponent(url.hash.slice(1));
  const redactedHash = redactComponent(decodedHash);
  if (redactedHash !== decodedHash) {
    url.hash = redactedHash;
  }
  const serialized = url.toString();
  return redactComponent(serialized) === serialized ? serialized : `${url.protocol}//redacted.invalid/%5BREDACTED%5D`;
}
function redactCaptureText(value) {
  return redactRegisteredSecretValues(value, () => REDACTED_CAPTURE_HEADER_VALUE);
}
function redactCapturePayload(value) {
  if (typeof value === "string") {
    return redactCaptureText(value);
  }
  if (!Buffer.isBuffer(value)) {
    return value ?? null;
  }
  if (!isUtf8(value)) {
    return hasRegisteredSecretValuesForRedaction() ? REDACTED_CAPTURE_BINARY_PAYLOAD : value;
  }
  const text = value.toString("utf8");
  const redacted = redactCaptureText(text);
  return redacted === text ? value : Buffer.from(redacted, "utf8");
}
function redactedCaptureJson(value, stringify = safeJsonString) {
  const serialized = stringify(value);
  return serialized === void 0 ? void 0 : redactCaptureText(serialized);
}
function createHttpCaptureEventBase(params) {
  return {
    sessionId: params.settings.sessionId,
    ts: Date.now(),
    sourceScope: "openclaw",
    sourceProcess: params.settings.sourceProcess,
    protocol: params.transport ?? protocolFromUrl(params.rawUrl),
    direction: params.direction,
    kind: params.kind,
    flowId: params.flowId,
    method: params.method,
    host: params.url.host,
    path: `${params.url.pathname}${params.url.search}`
  };
}
function installDebugProxyGlobalFetchPatch(settings, deps = {}) {
  const runtime = resolveRuntimeDeps(deps);
  const fetchTarget = runtime.fetchTarget;
  if (typeof fetchTarget.fetch !== "function") {
    return;
  }
  if (fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY]) {
    return;
  }
  const fetchImpl = fetchTarget.fetch;
  const originalFetch = fetchImpl.bind(fetchTarget);
  fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY] = { originalFetch };
  const patchedFetch = async (input, init) => {
    const url = resolveUrlString(input);
    const normalizedInit = normalizeRequestInitHeadersForFetch(init);
    try {
      const response = await originalFetch(input, normalizedInit);
      if (url && /^https?:/i.test(url)) {
        captureHttpExchange(
          {
            url,
            method: (typeof Request !== "undefined" && input instanceof Request ? input.method : void 0) ?? normalizedInit?.method ?? "GET",
            requestHeaders: (typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0) ?? normalizedInit?.headers,
            requestBody: (typeof Request !== "undefined" && input instanceof Request ? input.body : void 0) ?? normalizedInit?.body ?? null,
            response,
            transport: "http",
            meta: {
              captureOrigin: "global-fetch",
              source: settings.sourceProcess
            }
          },
          settings,
          deps
        );
      }
      return response;
    } catch (error) {
      if (url && /^https?:/i.test(url)) {
        const store = runtime.getStore();
        const captureUrl = redactCaptureUrl(url);
        const parsed = new URL2(captureUrl);
        store.recordEvent({
          sessionId: settings.sessionId,
          ts: Date.now(),
          sourceScope: "openclaw",
          sourceProcess: settings.sourceProcess,
          protocol: protocolFromUrl(captureUrl),
          direction: "local",
          kind: "error",
          flowId: randomUUID4(),
          method: (typeof Request !== "undefined" && input instanceof Request ? input.method : void 0) ?? normalizedInit?.method ?? "GET",
          host: parsed.host,
          path: `${parsed.pathname}${parsed.search}`,
          errorText: redactCaptureText(error instanceof Error ? error.message : String(error)),
          metaJson: redactedCaptureJson({ captureOrigin: "global-fetch" }, runtime.safeJsonString)
        });
      }
      throw error;
    }
  };
  const mockState = fetchImpl.mock;
  if (typeof mockState === "object" && mockState !== null) {
    patchedFetch.mock = mockState;
  }
  fetchTarget.fetch = patchedFetch;
}
function uninstallDebugProxyGlobalFetchPatch(deps = {}) {
  const fetchTarget = resolveRuntimeDeps(deps).fetchTarget;
  const state = fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY];
  if (!state) {
    return;
  }
  fetchTarget.fetch = state.originalFetch;
  delete fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY];
}
function isDebugProxyGlobalFetchPatchInstalled() {
  return Boolean(globalThis[DEBUG_PROXY_FETCH_PATCH_KEY]);
}
function initializeDebugProxyCapture(mode, resolved, deps = {}) {
  const settings = resolved ?? resolveDebugProxySettings();
  if (!settings.enabled) {
    return;
  }
  resolveRuntimeDeps(deps).getStore().upsertSession({
    id: settings.sessionId,
    startedAt: Date.now(),
    mode,
    sourceScope: "openclaw",
    sourceProcess: settings.sourceProcess,
    proxyUrl: settings.proxyUrl
  });
  installDebugProxyGlobalFetchPatch(settings, deps);
}
function finalizeDebugProxyCapture(resolved, deps = {}) {
  const settings = resolved ?? resolveDebugProxySettings();
  if (!settings.enabled) {
    return;
  }
  const runtime = resolveRuntimeDeps(deps);
  runtime.getStore().endSession(settings.sessionId);
  uninstallDebugProxyGlobalFetchPatch(deps);
  runtime.closeStore();
}
function captureHttpExchange(params, resolved, deps = {}) {
  const settings = resolved ?? resolveDebugProxySettings();
  if (!settings.enabled) {
    return;
  }
  const runtime = resolveRuntimeDeps(deps);
  const store = runtime.getStore();
  const flowId = params.flowId ?? randomUUID4();
  const captureUrl = redactCaptureUrl(params.url);
  const url = new URL2(captureUrl);
  const requestBody = typeof params.requestBody === "string" || Buffer.isBuffer(params.requestBody) ? params.requestBody : null;
  const rawRequestContentType = params.requestHeaders instanceof Headers ? params.requestHeaders.get("content-type") ?? void 0 : params.requestHeaders?.["content-type"];
  const requestContentType = rawRequestContentType === void 0 ? void 0 : redactCaptureText(rawRequestContentType);
  const rawResponseContentType = typeof params.response.headers?.get === "function" ? params.response.headers.get("content-type") ?? void 0 : void 0;
  const responseContentType = rawResponseContentType === void 0 ? void 0 : redactCaptureText(rawResponseContentType);
  const requestPayload = runtime.persistEventPayload(store, {
    data: redactCapturePayload(requestBody),
    contentType: requestContentType
  });
  store.recordEvent({
    ...createHttpCaptureEventBase({
      settings,
      rawUrl: captureUrl,
      url,
      transport: params.transport,
      direction: "outbound",
      kind: "request",
      flowId,
      method: params.method
    }),
    contentType: requestContentType,
    headersJson: runtime.safeJsonString(redactedCaptureHeaders(params.requestHeaders)),
    metaJson: redactedCaptureJson(params.meta, runtime.safeJsonString),
    ...requestPayload
  });
  const recordResponseMetadataOnly = (bodyCapture) => {
    store.recordEvent({
      ...createHttpCaptureEventBase({
        settings,
        rawUrl: captureUrl,
        url,
        transport: params.transport,
        direction: "inbound",
        kind: "response",
        flowId,
        method: params.method
      }),
      status: params.response.status,
      contentType: responseContentType,
      headersJson: params.response.headers && typeof params.response.headers.entries === "function" ? runtime.safeJsonString(redactedCaptureHeaders(params.response.headers)) : void 0,
      metaJson: redactedCaptureJson({ ...params.meta, bodyCapture }, runtime.safeJsonString)
    });
  };
  if (typeof params.response.clone !== "function") {
    recordResponseMetadataOnly("unavailable");
    return;
  }
  const declaredLength = parseDeclaredCaptureContentLength(
    typeof params.response.headers?.get === "function" ? params.response.headers.get("content-length") : void 0
  );
  if (declaredLength !== void 0 && declaredLength > BigInt(MAX_CAPTURED_RESPONSE_BODY_BYTES)) {
    recordResponseMetadataOnly("too-large");
    return;
  }
  void readCapturedResponseBodyBounded(params.response, MAX_CAPTURED_RESPONSE_BODY_BYTES).then((result) => {
    if (result.status !== "captured") {
      recordResponseMetadataOnly(result.status);
      return;
    }
    const responsePayload = runtime.persistEventPayload(store, {
      data: redactCapturePayload(result.buffer),
      contentType: responseContentType
    });
    store.recordEvent({
      ...createHttpCaptureEventBase({
        settings,
        rawUrl: captureUrl,
        url,
        transport: params.transport,
        direction: "inbound",
        kind: "response",
        flowId,
        method: params.method
      }),
      status: params.response.status,
      contentType: responseContentType,
      headersJson: runtime.safeJsonString(redactedCaptureHeaders(params.response.headers)),
      metaJson: redactedCaptureJson(params.meta, runtime.safeJsonString),
      ...responsePayload
    });
  }).catch((error) => {
    store.recordEvent({
      ...createHttpCaptureEventBase({
        settings,
        rawUrl: captureUrl,
        url,
        transport: params.transport,
        direction: "local",
        kind: "error",
        flowId,
        method: params.method
      }),
      errorText: redactCaptureText(error instanceof Error ? error.message : String(error))
    });
  });
}
function captureWsEvent(params, resolved, deps = {}) {
  const settings = resolved ?? resolveDebugProxySettings();
  if (!settings.enabled) {
    return;
  }
  const runtime = resolveRuntimeDeps(deps);
  const store = runtime.getStore();
  const captureUrl = redactCaptureUrl(params.url);
  const url = new URL2(captureUrl);
  const payload = runtime.persistEventPayload(store, {
    data: redactCapturePayload(params.payload),
    contentType: "application/json"
  });
  store.recordEvent({
    sessionId: settings.sessionId,
    ts: Date.now(),
    sourceScope: "openclaw",
    sourceProcess: settings.sourceProcess,
    protocol: protocolFromUrl(captureUrl),
    direction: params.direction,
    kind: params.kind,
    flowId: params.flowId,
    host: url.host,
    path: `${url.pathname}${url.search}`,
    closeCode: params.closeCode,
    errorText: params.errorText === void 0 ? void 0 : redactCaptureText(params.errorText),
    metaJson: redactedCaptureJson(params.meta, runtime.safeJsonString),
    ...payload
  });
}
var DEBUG_PROXY_FETCH_PATCH_KEY, REDACTED_CAPTURE_HEADER_VALUE, REDACTED_CAPTURE_BINARY_PAYLOAD, MAX_CAPTURED_RESPONSE_BODY_BYTES, SENSITIVE_CAPTURE_HEADER_NAMES, SENSITIVE_CAPTURE_HEADER_NAME_FRAGMENTS;
var init_runtime2 = __esm({
  "src/proxy-capture/runtime.ts"() {
    "use strict";
    init_fetch_headers();
    init_secret_redaction_registry();
    init_env();
    init_store_sqlite();
    DEBUG_PROXY_FETCH_PATCH_KEY = /* @__PURE__ */ Symbol.for("openclaw.debugProxy.fetchPatch");
    REDACTED_CAPTURE_HEADER_VALUE = "[REDACTED]";
    REDACTED_CAPTURE_BINARY_PAYLOAD = Buffer.from("[REDACTED BINARY PAYLOAD]", "utf8");
    MAX_CAPTURED_RESPONSE_BODY_BYTES = 16 * 1024 * 1024;
    SENSITIVE_CAPTURE_HEADER_NAMES = /* @__PURE__ */ new Set([
      "authorization",
      "proxy-authorization",
      "cookie",
      "set-cookie",
      "x-api-key",
      "api-key",
      "apikey",
      "x-auth-token",
      "auth-token",
      "x-access-token",
      "access-token"
    ]);
    SENSITIVE_CAPTURE_HEADER_NAME_FRAGMENTS = [
      "api-key",
      "apikey",
      "token",
      "secret",
      "password",
      "credential",
      "session"
    ];
  }
});

// packages/memory-host-sdk/src/host/batch-utils.ts
function normalizeBatchBaseUrl(client) {
  return client.baseUrl?.replace(/\/$/, "") ?? "";
}
function buildBatchHeaders(client, params) {
  const headers = client.headers ? { ...client.headers } : {};
  if (params.json) {
    if (!headers["Content-Type"] && !headers["content-type"]) {
      headers["Content-Type"] = "application/json";
    }
  } else {
    delete headers["Content-Type"];
    delete headers["content-type"];
  }
  return headers;
}
var jsonlEncoder = new TextEncoder();

// packages/memory-host-sdk/src/host/hash.ts
import crypto from "node:crypto";
function hashText(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

// src/logger.ts
init_src();

// packages/terminal-core/src/theme.ts
import chalk, { Chalk } from "chalk";

// packages/terminal-core/src/palette.ts
var LOBSTER_PALETTE = {
  accent: "#FF5A2D",
  accentBright: "#FF7A3D",
  accentDim: "#D14A22",
  info: "#FF8A5B",
  success: "#2FBF71",
  warn: "#FFB020",
  error: "#E23D2D",
  muted: "#8B7F77"
};

// packages/terminal-core/src/theme.ts
var hasForceColor = typeof process.env.FORCE_COLOR === "string" && process.env.FORCE_COLOR.trim().length > 0 && process.env.FORCE_COLOR.trim() !== "0";
var baseChalk = process.env.NO_COLOR && !hasForceColor ? new Chalk({ level: 0 }) : chalk;
var hex = (value) => baseChalk.hex(value);
var theme = {
  accent: hex(LOBSTER_PALETTE.accent),
  accentBright: hex(LOBSTER_PALETTE.accentBright),
  accentDim: hex(LOBSTER_PALETTE.accentDim),
  info: hex(LOBSTER_PALETTE.info),
  success: hex(LOBSTER_PALETTE.success),
  warn: hex(LOBSTER_PALETTE.warn),
  error: hex(LOBSTER_PALETTE.error),
  muted: hex(LOBSTER_PALETTE.muted),
  heading: baseChalk.bold.hex(LOBSTER_PALETTE.accent),
  command: hex(LOBSTER_PALETTE.accentBright),
  option: hex(LOBSTER_PALETTE.warn)
};

// src/logger.ts
init_global_state();
init_logger();
init_subsystem();
init_runtime();
var subsystemPrefixRe = /^([a-z][a-z0-9-]{1,20}):\s+(.*)$/i;
function splitSubsystem(message) {
  const match = message.match(subsystemPrefixRe);
  if (!match) {
    return null;
  }
  const subsystem = match.at(1);
  const rest = match.at(2);
  if (subsystem === void 0 || rest === void 0) {
    return null;
  }
  return { subsystem, rest };
}
function logWithSubsystem(params) {
  const parsed = params.runtime === defaultRuntime ? splitSubsystem(params.message) : null;
  if (parsed) {
    const method = expectDefined(
      createSubsystemLogger(parsed.subsystem)[params.subsystemMethod],
      "subsystem logger method"
    );
    method(parsed.rest);
    return;
  }
  params.runtime[params.runtimeMethod](params.runtimeFormatter(params.message));
  getLogger()[params.loggerMethod](params.message);
}
var info = theme.info;
var warn = theme.warn;
var success = theme.success;
var danger = theme.error;
function logWarn(message, runtime = defaultRuntime) {
  logWithSubsystem({
    message,
    runtime,
    runtimeMethod: "log",
    runtimeFormatter: warn,
    loggerMethod: "warn",
    subsystemMethod: "warn"
  });
}
function logDebug(message) {
  getLogger().debug(message);
  if (isVerbose()) {
    console.log(theme.muted(message));
  }
}

// packages/net-policy/src/redact-sensitive-url.ts
function normalizeLowercaseStringOrEmpty2(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
var SENSITIVE_URL_QUERY_PARAM_NAMES = /* @__PURE__ */ new Set([
  "token",
  "key",
  "api_key",
  "apikey",
  "secret",
  "access_token",
  "auth_token",
  "password",
  "pass",
  "passwd",
  "auth",
  "jwt",
  "session",
  "id_token",
  "code",
  "client_secret",
  "app_secret",
  "hook_token",
  "refresh_token",
  "signature",
  "x_amz_signature",
  "x_amz_security_token",
  "private_key",
  "credential",
  "authorization"
]);
var URL_QUERY_NAME_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
var TELEGRAM_BOT_TOKEN_PATH_RE = /\/bot\d{6,}(?::|%3[aA])[A-Za-z0-9_-]{20,}(?=\/|$)/giu;
var MAX_NESTED_URL_REDACTION_DEPTH = 8;
var URL_SCHEME_RE = /(?:^|[^a-z\d+.-])[a-z][a-z\d+.-]{0,31}:/iu;
var SPECIAL_SCHEME_AUTHORITY_RE = /\b(?:https?|wss?|ftp):[\\/]{0,2}[^\\/?#\s]*/giu;
var SPECIAL_SCHEME_SPILLED_USERINFO_RE = /\b(?:https?|wss?|ftp):[\\/]{0,2}[^\s]*@[^\\/?#\s]*/giu;
var PROTOCOL_RELATIVE_AUTHORITY_RE = /[\\/]{2,}[^\\/?#\s]*/gu;
function redactSensitiveUrlPath(value) {
  return value.replace(TELEGRAM_BOT_TOKEN_PATH_RE, "/bot***");
}
function normalizeUrlQueryParamName(name) {
  let current = name.replace(URL_QUERY_NAME_SEPARATOR_RE, "");
  for (let depth = 0; depth <= MAX_NESTED_URL_REDACTION_DEPTH; depth += 1) {
    let decoded;
    try {
      decoded = decodeURIComponent(current).replace(URL_QUERY_NAME_SEPARATOR_RE, "");
    } catch {
      return {
        value: normalizeLowercaseStringOrEmpty2(current).replaceAll("-", "_"),
        unresolvedEncoding: current.includes("%")
      };
    }
    if (decoded === current) {
      return {
        value: normalizeLowercaseStringOrEmpty2(current).replaceAll("-", "_"),
        unresolvedEncoding: false
      };
    }
    current = decoded;
  }
  return {
    value: normalizeLowercaseStringOrEmpty2(current).replaceAll("-", "_"),
    unresolvedEncoding: current.includes("%")
  };
}
function looksLikeNestedUrlValue(value) {
  if (URL_SCHEME_RE.test(value)) {
    return true;
  }
  const forwardAuthorityIndex = value.indexOf("//");
  const backwardAuthorityIndex = value.indexOf("\\\\");
  const authorityIndex = forwardAuthorityIndex < 0 ? backwardAuthorityIndex : backwardAuthorityIndex < 0 ? forwardAuthorityIndex : Math.min(forwardAuthorityIndex, backwardAuthorityIndex);
  if (authorityIndex >= 0 && value.includes("@", authorityIndex + 2)) {
    return true;
  }
  const queryIndex = value.search(/[?&]/u);
  if (queryIndex >= 0 && value.includes("=", queryIndex + 1)) {
    return true;
  }
  const fragmentIndex = value.indexOf("#");
  if (fragmentIndex >= 0 && value.includes("=", fragmentIndex + 1)) {
    return true;
  }
  return /%[\da-f]{2}/iu.test(value);
}
function isSensitiveUrlQueryParamName(name) {
  const normalized = normalizeUrlQueryParamName(name);
  return normalized.unresolvedEncoding || SENSITIVE_URL_QUERY_PARAM_NAMES.has(normalized.value);
}
function redactDirectSensitiveUrl(value) {
  try {
    const parsed = new URL(value);
    let mutated = false;
    const redactedPath = redactSensitiveUrlPath(parsed.pathname);
    if (redactedPath !== parsed.pathname) {
      parsed.pathname = redactedPath;
      mutated = true;
    }
    if (parsed.username || parsed.password) {
      parsed.username = parsed.username ? "***" : "";
      parsed.password = parsed.password ? "***" : "";
      mutated = true;
    }
    for (const key of Array.from(parsed.searchParams.keys())) {
      if (isSensitiveUrlQueryParamName(key)) {
        parsed.searchParams.set(key, "***");
        mutated = true;
      }
    }
    return mutated ? parsed.toString() : value;
  } catch {
    return value;
  }
}
function redactQueryString(value, depth) {
  const params = new URLSearchParams(value);
  const entries = Array.from(params.entries());
  const redactedEntries = [];
  const seenSensitiveKeys = /* @__PURE__ */ new Set();
  let mutated = false;
  for (const [key, entryValue] of entries) {
    if (isSensitiveUrlQueryParamName(key)) {
      mutated = true;
      if (!seenSensitiveKeys.has(key)) {
        seenSensitiveKeys.add(key);
        redactedEntries.push([key, "***"]);
      }
      continue;
    }
    const redactedKey = redactNestedUrlValue(key, depth + 1);
    const redactedValue = redactNestedUrlValue(entryValue, depth + 1);
    if (redactedKey !== key || redactedValue !== entryValue) {
      mutated = true;
    }
    redactedEntries.push([redactedKey, redactedValue]);
  }
  if (!mutated) {
    return value;
  }
  const redactedParams = new URLSearchParams();
  for (const [key, entryValue] of redactedEntries) {
    redactedParams.append(key, entryValue);
  }
  return redactedParams.toString();
}
function redactUrlLikeFallback(value) {
  const redactedFallback = redactEmbeddedUrlUserInfo(value).replace(
    /([?&])([^=&]+)=([^&]*)/g,
    (match, prefix, key) => isSensitiveUrlQueryParamName(key) ? `${prefix}${key}=***` : match
  );
  return redactSensitiveUrlPath(redactedFallback);
}
function redactAuthorityUserInfo(candidate, authorityStart) {
  const authority = candidate.slice(authorityStart);
  const userInfoEnd = authority.lastIndexOf("@");
  if (userInfoEnd < 0) {
    return candidate;
  }
  return `${candidate.slice(0, authorityStart)}***:***@${authority.slice(userInfoEnd + 1)}`;
}
function redactEmbeddedUrlUserInfo(value) {
  return value.replace(SPECIAL_SCHEME_AUTHORITY_RE, (candidate) => {
    let authorityStart = candidate.indexOf(":") + 1;
    while (authorityStart < candidate.length && (candidate[authorityStart] === "/" || candidate[authorityStart] === "\\")) {
      authorityStart += 1;
    }
    return redactAuthorityUserInfo(candidate, authorityStart);
  }).replace(SPECIAL_SCHEME_SPILLED_USERINFO_RE, (candidate) => {
    let authorityStart = candidate.indexOf(":") + 1;
    while (authorityStart < candidate.length && (candidate[authorityStart] === "/" || candidate[authorityStart] === "\\")) {
      authorityStart += 1;
    }
    const userInfoEnd = candidate.lastIndexOf("@");
    const firstReservedDelimiter = candidate.slice(authorityStart).search(/[\\/?#]/u);
    if (userInfoEnd < 0 || firstReservedDelimiter < 0) {
      return candidate;
    }
    const absoluteReservedDelimiter = authorityStart + firstReservedDelimiter;
    if (absoluteReservedDelimiter >= userInfoEnd) {
      return candidate;
    }
    const credentialSeparator = candidate.indexOf(":", authorityStart);
    if (credentialSeparator < 0 || credentialSeparator > absoluteReservedDelimiter) {
      return candidate;
    }
    const authorityPrefix = candidate.slice(authorityStart, absoluteReservedDelimiter);
    const possiblePort = candidate.slice(credentialSeparator + 1, absoluteReservedDelimiter);
    if (/^\d+$/u.test(possiblePort) || /^\[[^\]]+\](?::\d+)?$/u.test(authorityPrefix)) {
      return candidate;
    }
    return `${candidate.slice(0, authorityStart)}***:***@${candidate.slice(userInfoEnd + 1)}`;
  }).replace(PROTOCOL_RELATIVE_AUTHORITY_RE, (candidate) => {
    let authorityStart = 0;
    while (authorityStart < candidate.length && (candidate[authorityStart] === "/" || candidate[authorityStart] === "\\")) {
      authorityStart += 1;
    }
    return redactAuthorityUserInfo(candidate, authorityStart);
  });
}
function hasUnresolvedEmbeddedUrlUserInfo(value) {
  for (const match of value.matchAll(/(?:\b(?:https?|wss?|ftp):[\\/]{0,2}|[\\/]{2,})/giu)) {
    const remainder = value.slice((match.index ?? 0) + match[0].length);
    const userInfoEnd = remainder.search(/(?<!\*\*\*:\*\*\*)@/u);
    const authorityEnd = remainder.search(/[\\/?#]/u);
    const pathBeforeAt = remainder.slice(authorityEnd + 1, userInfoEnd);
    if (userInfoEnd >= 0 && (authorityEnd < 0 || userInfoEnd <= authorityEnd || remainder[authorityEnd] === "/" && (pathBeforeAt.includes(":") || /^[^/?#\s]+\.[^/?#\s]+(?:[/?#]|$)/u.test(remainder.slice(userInfoEnd + 1))))) {
      return true;
    }
  }
  return false;
}
function redactRelativeUrlFragment(value, depth) {
  const fragmentIndex = value.indexOf("#");
  if (fragmentIndex < 0) {
    return value;
  }
  const fragment = value.slice(fragmentIndex + 1);
  const redactedFragment = redactFragment(fragment, depth + 1);
  return redactedFragment === fragment ? value : `${value.slice(0, fragmentIndex + 1)}${redactedFragment}`;
}
function redactFragment(value, depth) {
  if (!value) {
    return value;
  }
  if (depth > MAX_NESTED_URL_REDACTION_DEPTH && looksLikeNestedUrlValue(value)) {
    return "***";
  }
  const wholeUrl = redactSensitiveUrlAtDepth(value, depth);
  if (wholeUrl.parsedWholeUrl) {
    return redactUrlLikeFallback(wholeUrl.value);
  }
  const candidate = value;
  const firstQueryDelimiter = candidate.search(/[?&]/u);
  const firstEquals = candidate.indexOf("=");
  if (firstEquals >= 0 && (firstQueryDelimiter < 0 || firstEquals < firstQueryDelimiter)) {
    return redactQueryString(candidate, depth);
  }
  const hashRouterQueryIndex = candidate.indexOf("?");
  if (hashRouterQueryIndex >= 0) {
    const query = candidate.slice(hashRouterQueryIndex + 1);
    const redactedQuery = redactQueryString(query, depth);
    const prefix = candidate.slice(0, hashRouterQueryIndex + 1);
    const redactedPrefix = redactEncodedUrlLikeString(redactUrlLikeFallback(prefix), depth + 1);
    return `${redactedPrefix}${redactedQuery}`;
  }
  const fallback = redactUrlLikeFallback(candidate);
  if (!looksLikeNestedUrlValue(fallback)) {
    return fallback;
  }
  let decoded;
  try {
    decoded = decodeURIComponent(fallback);
  } catch {
    return "***";
  }
  if (decoded === fallback) {
    return fallback;
  }
  const redactedDecoded = redactFragment(decoded, depth + 1);
  return redactedDecoded === decoded ? fallback : encodeURIComponent(redactedDecoded);
}
function redactEncodedNestedUrlPath(value, depth) {
  if (!looksLikeNestedUrlValue(value)) {
    return value;
  }
  if (depth > MAX_NESTED_URL_REDACTION_DEPTH) {
    return "***";
  }
  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return "***";
  }
  if (decoded === value) {
    return value;
  }
  const direct = redactSensitiveUrlLikeStringAtDepth(decoded, depth);
  if (direct.value !== decoded || hasUnresolvedEmbeddedUrlUserInfo(decoded)) {
    return direct.value !== decoded ? direct.value : "***";
  }
  if (direct.parsedWholeUrl) {
    return value;
  }
  const nested = redactEncodedNestedUrlPath(decoded, depth + 1);
  return nested === decoded ? value : nested;
}
function redactSensitiveUrlAtDepth(value, depth) {
  try {
    const directRedaction = redactDirectSensitiveUrl(value);
    const parsed = new URL(directRedaction);
    if (depth > MAX_NESTED_URL_REDACTION_DEPTH) {
      return { value: "***", parsedWholeUrl: true };
    }
    let mutated = directRedaction !== value;
    const redactedNestedPath = redactEmbeddedUrlUserInfo(
      redactEncodedNestedUrlPath(parsed.pathname, depth + 1)
    );
    if (redactedNestedPath !== parsed.pathname) {
      const originalPath = parsed.pathname;
      parsed.pathname = redactedNestedPath;
      if (parsed.pathname === originalPath) {
        return { value: directRedaction, parsedWholeUrl: false };
      }
      mutated = true;
    }
    const redactedQuery = redactQueryString(parsed.search.slice(1), depth);
    if (redactedQuery !== parsed.search.slice(1)) {
      parsed.search = redactedQuery;
      mutated = true;
    }
    const fragment = parsed.hash.slice(1);
    const redactedHash = redactFragment(fragment, depth + 1);
    if (redactedHash !== fragment) {
      parsed.hash = redactedHash;
      mutated = true;
    }
    return { value: mutated ? parsed.toString() : value, parsedWholeUrl: true };
  } catch {
    return { value, parsedWholeUrl: false };
  }
}
function redactSensitiveUrlLikeStringAtDepth(value, depth) {
  const redactedUrl = redactSensitiveUrlAtDepth(value, depth);
  if (redactedUrl.parsedWholeUrl) {
    return redactedUrl;
  }
  const redactedFallback = redactUrlLikeFallback(redactedUrl.value);
  const redactedRelativeFragment = redactRelativeUrlFragment(redactedFallback, depth);
  return {
    value: redactEncodedUrlLikeString(redactedRelativeFragment, depth + 1),
    parsedWholeUrl: false
  };
}
function redactEncodedUrlLikeString(value, depth) {
  if (!looksLikeNestedUrlValue(value)) {
    return value;
  }
  if (depth > MAX_NESTED_URL_REDACTION_DEPTH) {
    return "***";
  }
  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return "***";
  }
  if (decoded === value) {
    return value;
  }
  const redactedDecoded = redactSensitiveUrlLikeStringAtDepth(decoded, depth + 1);
  if (redactedDecoded.value !== decoded || redactedDecoded.parsedWholeUrl) {
    return redactedDecoded.value === decoded ? value : redactedDecoded.value;
  }
  return hasUnresolvedEmbeddedUrlUserInfo(decoded) ? "***" : value;
}
function redactNestedUrlValue(value, depth) {
  if (!looksLikeNestedUrlValue(value)) {
    return value;
  }
  if (depth > MAX_NESTED_URL_REDACTION_DEPTH) {
    return "***";
  }
  const direct = redactSensitiveUrlLikeStringAtDepth(value, depth);
  if (direct.value !== value) {
    return direct.value;
  }
  if (hasUnresolvedEmbeddedUrlUserInfo(value)) {
    return "***";
  }
  if (direct.parsedWholeUrl) {
    return value;
  }
  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return "***";
  }
  if (decoded === value || !looksLikeNestedUrlValue(decoded)) {
    return value;
  }
  const redactedDecoded = redactNestedUrlValue(decoded, depth + 1);
  return redactedDecoded === decoded ? value : encodeURIComponent(redactedDecoded);
}
function redactSensitiveUrlLikeString(value) {
  return redactSensitiveUrlLikeStringAtDepth(value, 0).value;
}

// src/utils/fetch-timeout.ts
init_utf16_slice();
init_subsystem();

// packages/gateway-client/src/timeouts.ts
var MAX_SAFE_TIMEOUT_DELAY_MS = 2147483647;
function resolveSafeTimeoutDelayMs(delayMs, opts) {
  const rawMinMs = opts?.minMs ?? 1;
  const minMs = Math.min(
    MAX_SAFE_TIMEOUT_DELAY_MS,
    Math.max(0, Number.isFinite(rawMinMs) ? Math.floor(rawMinMs) : 1)
  );
  const candidateMs = Number.isFinite(delayMs) ? Math.floor(delayMs) : minMs;
  return Math.min(MAX_SAFE_TIMEOUT_DELAY_MS, Math.max(minMs, candidateMs));
}

// src/utils/fetch-timeout.ts
var log = createSubsystemLogger("fetch-timeout");
var LOG_URL_MAX_CHARS = 500;
var URL_SECRET_SUFFIX_PATTERN = /[?#]/;
function sanitizeTimeoutLogUrl(rawUrl) {
  const trimmed = rawUrl?.trim();
  if (!trimmed) {
    return void 0;
  }
  try {
    const parsed = new URL(trimmed);
    parsed.username = "";
    parsed.password = "";
    parsed.search = "";
    parsed.hash = "";
    const value = redactSensitiveUrlLikeString(parsed.toString());
    return value.length > LOG_URL_MAX_CHARS ? `${truncateUtf16Safe(value, LOG_URL_MAX_CHARS)}...` : value;
  } catch {
    const withoutQueryOrHash = trimmed.split(URL_SECRET_SUFFIX_PATTERN, 1)[0] ?? "";
    const cleaned = redactSensitiveUrlLikeString(
      withoutQueryOrHash.replace(/[\r\n\u2028\u2029]+/g, " ").replace(/\p{Cc}+/gu, " ").replace(/\s+/g, " ").trim()
    );
    if (!cleaned) {
      return void 0;
    }
    return cleaned.length > LOG_URL_MAX_CHARS ? `${truncateUtf16Safe(cleaned, LOG_URL_MAX_CHARS)}...` : cleaned;
  }
}
function abortDueToTimeout(controller, timeoutMs, startedAtMs, operation, url, combinedSignal) {
  if (combinedSignal?.aborted ?? controller.signal.aborted) {
    return;
  }
  const sanitizedUrl = sanitizeTimeoutLogUrl(url);
  const elapsedMs = Math.max(0, Date.now() - startedAtMs);
  const delayMs = Math.max(0, elapsedMs - timeoutMs);
  const eventLoopDelayHint = delayMs >= Math.max(1e3, timeoutMs * 0.5) ? `timer delayed ${delayMs}ms, likely event-loop starvation` : null;
  const consoleMessage = [
    `fetch timeout after ${timeoutMs}ms`,
    `(elapsed ${elapsedMs}ms)`,
    eventLoopDelayHint,
    operation ? `operation=${operation}` : null,
    sanitizedUrl ? `url=${sanitizedUrl}` : null
  ].filter((part) => Boolean(part)).join(" ");
  log.warn("fetch timeout reached; aborting operation", {
    timeoutMs,
    elapsedMs,
    ...eventLoopDelayHint ? { timerDelayMs: delayMs, eventLoopDelayHint } : {},
    consoleMessage,
    ...operation ? { operation } : {},
    ...sanitizedUrl ? { url: sanitizedUrl } : {}
  });
  const error = new Error("request timed out");
  error.name = "TimeoutError";
  controller.abort(error);
}
function buildTimeoutAbortSignal(params) {
  const { timeoutMs, signal: parentSignal } = params;
  if (!timeoutMs && !parentSignal) {
    return { signal: void 0, cleanup: () => {
    }, refresh: () => {
    } };
  }
  if (!timeoutMs) {
    return { signal: parentSignal, cleanup: () => {
    }, refresh: () => {
    } };
  }
  const controller = new AbortController();
  const signal = parentSignal ? AbortSignal.any([parentSignal, controller.signal]) : controller.signal;
  const normalizedTimeoutMs = resolveSafeTimeoutDelayMs(timeoutMs);
  let active = true;
  let timeoutId;
  const scheduleTimeout = () => {
    timeoutId = setTimeout(
      abortDueToTimeout,
      normalizedTimeoutMs,
      controller,
      normalizedTimeoutMs,
      Date.now(),
      params.operation,
      params.url,
      signal
    );
  };
  scheduleTimeout();
  return {
    signal,
    refresh: () => {
      if (!active || signal.aborted) {
        return;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      scheduleTimeout();
    },
    cleanup: () => {
      active = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };
}

// src/infra/abort-signal.ts
function createAbortError(message, options) {
  const error = new Error(message, options);
  error.name = "AbortError";
  return error;
}

// src/infra/net/fetch-guard.ts
init_errors2();
init_fetch_headers();

// packages/net-policy/src/ip.ts
import ipaddr from "ipaddr.js";
function normalizeOptionalString2(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed || void 0;
}
function expectIpv6Hextets(parts) {
  const [a, b, c, d, e, f, g, h] = parts;
  if (a === void 0 || b === void 0 || c === void 0 || d === void 0 || e === void 0 || f === void 0 || g === void 0 || h === void 0) {
    throw new Error("expected IPv6 address to expose 8 hextets");
  }
  return [a, b, c, d, e, f, g, h];
}
var BLOCKED_IPV4_SPECIAL_USE_RANGES = /* @__PURE__ */ new Set([
  "unspecified",
  "broadcast",
  "multicast",
  "linkLocal",
  "loopback",
  "carrierGradeNat",
  "private",
  "reserved"
]);
var BLOCKED_IPV6_SPECIAL_USE_RANGES = /* @__PURE__ */ new Set([
  "unspecified",
  "loopback",
  "linkLocal",
  "uniqueLocal",
  "multicast",
  "reserved",
  "benchmarking",
  "discard",
  "orchid2"
]);
var RFC2544_BENCHMARK_PREFIX = [ipaddr.IPv4.parse("198.18.0.0"), 15];
var CLOUD_METADATA_IP_ADDRESSES = /* @__PURE__ */ new Set(["100.100.100.200", "fd00:ec2::254"]);
function stripIpv6Brackets(value) {
  if (value.startsWith("[") && value.endsWith("]")) {
    return value.slice(1, -1);
  }
  return value;
}
function isNumericIpv4LiteralPart(value) {
  return /^[0-9]+$/.test(value) || /^0x[0-9a-f]+$/i.test(value);
}
function isIpv4Address(address) {
  return address.kind() === "ipv4";
}
function isIpv6Address(address) {
  return address.kind() === "ipv6";
}
function normalizeIpv4MappedAddress(address) {
  if (!isIpv6Address(address)) {
    return address;
  }
  if (!address.isIPv4MappedAddress()) {
    return address;
  }
  return address.toIPv4Address();
}
function normalizeIpParseInput(raw) {
  const trimmed = normalizeOptionalString2(raw);
  if (!trimmed) {
    return void 0;
  }
  return stripIpv6Brackets(trimmed);
}
function parseCanonicalIpAddress(raw) {
  const normalized = normalizeIpParseInput(raw);
  if (!normalized) {
    return void 0;
  }
  const isCanonical = ipaddr.IPv4.isValidFourPartDecimal(normalized) || ipaddr.IPv6.isValid(normalized);
  return isCanonical ? ipaddr.parse(normalized) : void 0;
}
function parseLooseIpAddress(raw) {
  const normalized = normalizeIpParseInput(raw);
  if (!normalized) {
    return void 0;
  }
  return ipaddr.isValid(normalized) ? ipaddr.parse(normalized) : void 0;
}
function isCanonicalDottedDecimalIPv4(raw) {
  const normalized = normalizeIpParseInput(raw);
  return normalized !== void 0 && ipaddr.IPv4.isValidFourPartDecimal(normalized);
}
function isLegacyIpv4Literal(raw) {
  const trimmed = normalizeOptionalString2(raw);
  if (!trimmed) {
    return false;
  }
  const normalized = stripIpv6Brackets(trimmed);
  if (!normalized || normalized.includes(":")) {
    return false;
  }
  if (isCanonicalDottedDecimalIPv4(normalized)) {
    return false;
  }
  const parts = normalized.split(".");
  if (parts.length === 0 || parts.length > 4) {
    return false;
  }
  if (parts.some((part) => part.length === 0)) {
    return false;
  }
  if (!parts.every((part) => isNumericIpv4LiteralPart(part))) {
    return false;
  }
  return true;
}
function isLoopbackIpAddress(raw) {
  const parsed = parseCanonicalIpAddress(raw);
  if (!parsed) {
    return false;
  }
  const normalized = normalizeIpv4MappedAddress(parsed);
  return normalized.range() === "loopback";
}
function isLinkLocalIpAddress(raw) {
  const parsed = parseLooseIpAddress(raw);
  if (!parsed) {
    return false;
  }
  const normalized = normalizeIpv4MappedAddress(parsed);
  if (isIpv4Address(normalized)) {
    return normalized.range() === "linkLocal";
  }
  const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(normalized);
  if (embeddedIpv4?.range() === "linkLocal") {
    return true;
  }
  return normalized.range() === "linkLocal";
}
function isCloudMetadataIpAddress(raw) {
  const parsed = parseLooseIpAddress(raw);
  if (!parsed) {
    return false;
  }
  const normalized = normalizeIpv4MappedAddress(parsed);
  if (isIpv6Address(normalized)) {
    const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(normalized);
    if (embeddedIpv4 && CLOUD_METADATA_IP_ADDRESSES.has(embeddedIpv4.toString())) {
      return true;
    }
  }
  return CLOUD_METADATA_IP_ADDRESSES.has(normalized.toString());
}
function isBlockedSpecialUseIpv6Address(address, options = {}) {
  const range = address.range();
  if (range === "uniqueLocal" && options.allowUniqueLocalRange === true) {
    return false;
  }
  if (BLOCKED_IPV6_SPECIAL_USE_RANGES.has(range)) {
    return true;
  }
  const [firstPart] = expectIpv6Hextets(address.parts);
  return (firstPart & 65472) === 65216;
}
function isBlockedSpecialUseIpv4Address(address, options = {}) {
  const inRfc2544BenchmarkRange = address.match(RFC2544_BENCHMARK_PREFIX);
  if (inRfc2544BenchmarkRange && options.allowRfc2544BenchmarkRange === true) {
    return false;
  }
  return BLOCKED_IPV4_SPECIAL_USE_RANGES.has(address.range()) || inRfc2544BenchmarkRange;
}
function decodeIpv4FromHextets(high, low) {
  const octets = [
    high >>> 8 & 255,
    high & 255,
    low >>> 8 & 255,
    low & 255
  ];
  return ipaddr.IPv4.parse(octets.join("."));
}
function extractEmbeddedIpv4FromIpv6(address) {
  const parts = expectIpv6Hextets(address.parts);
  switch (address.range()) {
    case "ipv4Mapped":
      return address.toIPv4Address();
    case "rfc6145":
    case "rfc6052":
      return decodeIpv4FromHextets(parts[6], parts[7]);
    case "6to4":
      return decodeIpv4FromHextets(parts[1], parts[2]);
    case "teredo":
      return decodeIpv4FromHextets(parts[6] ^ 65535, parts[7] ^ 65535);
    default:
      break;
  }
  const isIpv4Compatible = parts[0] === 0 && parts[1] === 0 && parts[2] === 0 && parts[3] === 0 && parts[4] === 0 && parts[5] === 0;
  const isIsatap = (parts[4] & 64767) === 0 && parts[5] === 24318;
  if (isIpv4Compatible || isIsatap) {
    return decodeIpv4FromHextets(parts[6], parts[7]);
  }
  return void 0;
}

// src/infra/net/proxy/active-proxy-state.ts
var activeProxyUrl;
var activeProxyLoopbackMode;
var activeProxyTlsOptions;
function parseActiveManagedProxyLoopbackMode(value) {
  if (value === "gateway-only" || value === "proxy" || value === "block") {
    return value;
  }
  return void 0;
}
function readInheritedActiveManagedProxyLoopbackMode() {
  if (process.env["OPENCLAW_PROXY_ACTIVE"] !== "1") {
    return void 0;
  }
  return parseActiveManagedProxyLoopbackMode(process.env["OPENCLAW_PROXY_LOOPBACK_MODE"]) ?? "gateway-only";
}
function getActiveManagedProxyLoopbackMode() {
  return activeProxyLoopbackMode ?? readInheritedActiveManagedProxyLoopbackMode();
}
function getActiveManagedProxyUrl() {
  return activeProxyUrl;
}
function getActiveManagedProxyTlsOptions() {
  return activeProxyTlsOptions;
}

// src/infra/net/ssrf.ts
import { lookup as dnsLookupCb } from "node:dns";
import { lookup as dnsLookup } from "node:dns/promises";
init_src();
init_string_normalization();

// src/infra/net/hostname.ts
init_string_coerce();
function normalizeHostname(hostname) {
  const normalized = normalizeLowercaseStringOrEmpty(hostname).replace(/\.+$/, "");
  if (normalized.startsWith("[") && normalized.endsWith("]")) {
    return normalized.slice(1, -1);
  }
  return normalized;
}

// src/infra/net/undici-dispatcher-options.ts
init_record_coerce();
import { createRequire } from "node:module";
import net2 from "node:net";

// src/infra/net/proxy/managed-proxy-undici.ts
init_record_coerce();

// src/infra/net/proxy-env.ts
init_src();

// src/utils/string-readers.ts
init_string_coerce();

// src/infra/net/proxy-env.ts
function normalizeProxyEnvValue(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
function resolveEnvHttpProxyUrl(protocol, env = process.env) {
  const lowerHttpProxy = normalizeProxyEnvValue(env.http_proxy);
  const lowerHttpsProxy = normalizeProxyEnvValue(env.https_proxy);
  const httpProxy = lowerHttpProxy !== void 0 ? lowerHttpProxy : normalizeProxyEnvValue(env.HTTP_PROXY);
  const httpsProxy = lowerHttpsProxy !== void 0 ? lowerHttpsProxy : normalizeProxyEnvValue(env.HTTPS_PROXY);
  if (protocol === "https") {
    return httpsProxy ?? httpProxy ?? void 0;
  }
  return httpProxy ?? void 0;
}
function hasEnvHttpProxyConfigured(protocol = "https", env = process.env) {
  return resolveEnvHttpProxyUrl(protocol, env) !== void 0;
}
function shouldUseEnvHttpProxyForUrl(targetUrl, env = process.env) {
  let protocol;
  try {
    const parsed = new URL(targetUrl);
    if (parsed.protocol === "http:") {
      protocol = "http";
    } else if (parsed.protocol === "https:") {
      protocol = "https";
    } else {
      return false;
    }
  } catch {
    return false;
  }
  return hasEnvHttpProxyConfigured(protocol, env) && !matchesNoProxy(targetUrl, env);
}
function matchesNoProxy(targetUrl, env = process.env) {
  const raw = env.no_proxy ?? env.NO_PROXY ?? "";
  if (!raw) {
    return false;
  }
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return false;
  }
  const targetHost = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (!targetHost) {
    return false;
  }
  if (raw === "*") {
    return true;
  }
  const targetPort = parsed.port !== "" ? parsed.port : parsed.protocol === "https:" ? "443" : parsed.protocol === "http:" ? "80" : "";
  for (const rawEntry of raw.split(/[,\s]/)) {
    const entry = rawEntry.trim().toLowerCase();
    if (!entry) {
      continue;
    }
    let entryHost;
    let entryPort;
    if (entry.startsWith("[")) {
      const m = entry.match(/^\[([^\]]+)\](?::(\d+))?$/);
      if (!m) {
        continue;
      }
      entryHost = expectDefined(m[1], "m capture group 1");
      entryPort = m[2];
    } else {
      const firstColonIdx = entry.indexOf(":");
      const lastColonIdx = entry.lastIndexOf(":");
      if (firstColonIdx > -1 && firstColonIdx === lastColonIdx && /^\d+$/.test(entry.slice(lastColonIdx + 1))) {
        entryHost = entry.slice(0, lastColonIdx);
        entryPort = entry.slice(lastColonIdx + 1);
      } else {
        entryHost = entry;
      }
    }
    if (entryPort && entryPort !== targetPort) {
      continue;
    }
    const normalizedEntry = entryHost.replace(/^\*\./, "").replace(/^\./, "");
    if (!normalizedEntry || normalizedEntry === "*") {
      continue;
    }
    if (matchesIpv4NoProxyPattern(targetHost, normalizedEntry)) {
      return true;
    }
    if (targetHost === normalizedEntry) {
      return true;
    }
    if (targetHost.endsWith("." + normalizedEntry)) {
      return true;
    }
  }
  return false;
}
function parseIpv4Address(host) {
  const parts = host.split(".");
  if (parts.length !== 4) {
    return void 0;
  }
  let value = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) {
      return void 0;
    }
    const octet = Number(part);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) {
      return void 0;
    }
    value = value << 8 | octet;
  }
  return value >>> 0;
}
function matchesIpv4NoProxyPattern(targetHost, entryHost) {
  const target = parseIpv4Address(targetHost);
  if (target === void 0) {
    return false;
  }
  const cidrMatch = entryHost.match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/);
  if (cidrMatch) {
    const network = parseIpv4Address(expectDefined(cidrMatch[1], "cidr match capture group 1"));
    const prefixLength = Number(cidrMatch[2]);
    if (network === void 0 || prefixLength < 0 || prefixLength > 32) {
      return false;
    }
    const mask = prefixLength === 0 ? 0 : 4294967295 << 32 - prefixLength >>> 0;
    return (target & mask) === (network & mask);
  }
  if (!entryHost.includes("*")) {
    return false;
  }
  const targetParts = targetHost.split(".");
  const patternParts = entryHost.split(".");
  if (patternParts.length > 4 || patternParts.length === 0) {
    return false;
  }
  for (const [index, part] of patternParts.entries()) {
    if (part === "*") {
      if (index === patternParts.length - 1) {
        return true;
      }
      continue;
    }
    if (!/^\d{1,3}$/.test(part) || Number(part) !== Number(targetParts[index])) {
      return false;
    }
  }
  return patternParts.length === targetParts.length;
}

// src/infra/net/proxy/proxy-tls.ts
import { readFileSync } from "node:fs";
function normalizeOptionalPath(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : void 0;
}
function formatReadError(err) {
  return err instanceof Error ? err.message : String(err);
}
function isHttpsProxyUrl(value) {
  if (!value) {
    return false;
  }
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
function resolveManagedProxyCaFile(params) {
  return normalizeOptionalPath(params.caFileOverride) ?? normalizeOptionalPath(params.config?.tls?.caFile);
}
function resolveManagedProxyCaFileForUrl(params) {
  if (!isHttpsProxyUrl(params.proxyUrl)) {
    return void 0;
  }
  return resolveManagedProxyCaFile({
    config: params.config,
    caFileOverride: params.caFileOverride
  });
}
function loadManagedProxyTlsOptionsSync(caFile) {
  if (!caFile) {
    return void 0;
  }
  try {
    return { ca: readFileSync(caFile, "utf8") };
  } catch (err) {
    throw new Error(`proxy CA file could not be read (${caFile}): ${formatReadError(err)}`, {
      cause: err
    });
  }
}

// src/infra/net/proxy/active-managed-proxy-tls.ts
var MANAGED_PROXY_ENV_PREFIX = ["OPENCLAW", "PROXY"].join("_");
var MANAGED_PROXY_ACTIVE_ENV_KEY = `${MANAGED_PROXY_ENV_PREFIX}_ACTIVE`;
var MANAGED_PROXY_CA_FILE_ENV_KEY = `${MANAGED_PROXY_ENV_PREFIX}_CA_FILE`;
function normalizeProxyUrl(value) {
  if (!value) {
    return void 0;
  }
  try {
    return new URL(value).href;
  } catch {
    return void 0;
  }
}
function resolveManagedProxyUrl(env = process.env) {
  const activeProxyUrl2 = getActiveManagedProxyUrl();
  if (activeProxyUrl2) {
    return activeProxyUrl2.href;
  }
  if (env[MANAGED_PROXY_ACTIVE_ENV_KEY] !== "1") {
    return void 0;
  }
  return normalizeProxyUrl(resolveEnvHttpProxyUrl("https", env));
}
function resolveActiveManagedProxyTlsOptions(params) {
  const env = params?.env ?? process.env;
  const managedProxyUrl = resolveManagedProxyUrl(env);
  const targetProxyUrl = normalizeProxyUrl(
    params?.proxyUrl ?? resolveEnvHttpProxyUrl("https", env)
  );
  if (!managedProxyUrl || targetProxyUrl !== managedProxyUrl) {
    return void 0;
  }
  const activeProxyTls = getActiveManagedProxyTlsOptions();
  if (activeProxyTls) {
    return activeProxyTls;
  }
  const proxyCaFile = resolveManagedProxyCaFileForUrl({
    proxyUrl: managedProxyUrl,
    caFileOverride: env[MANAGED_PROXY_CA_FILE_ENV_KEY]
  });
  try {
    return loadManagedProxyTlsOptionsSync(proxyCaFile);
  } catch {
    return void 0;
  }
}

// src/infra/net/proxy/managed-proxy-undici.ts
function readProxyTlsRecord(options) {
  if (!options || !("proxyTls" in options)) {
    return void 0;
  }
  return isRecord(options.proxyTls) ? options.proxyTls : void 0;
}
function readProxyUrlFromOptions(options) {
  if (!options) {
    return void 0;
  }
  if ("uri" in options) {
    const uri = Reflect.get(options, "uri");
    return uri instanceof URL ? uri.href : typeof uri === "string" ? uri : void 0;
  }
  if ("httpsProxy" in options || "httpProxy" in options) {
    const httpsProxy = Reflect.get(options, "httpsProxy");
    const httpProxy = Reflect.get(options, "httpProxy");
    return typeof httpsProxy === "string" ? httpsProxy : typeof httpProxy === "string" ? httpProxy : void 0;
  }
  return void 0;
}
function addActiveManagedProxyTlsOptions(options, params) {
  const proxyTls = resolveActiveManagedProxyTlsOptions({
    proxyUrl: readProxyUrlFromOptions(options),
    env: params?.env
  });
  if (!proxyTls) {
    return options;
  }
  const existingProxyTls = readProxyTlsRecord(options);
  return {
    ...options,
    proxyTls: {
      ...proxyTls,
      ...existingProxyTls
    }
  };
}

// src/infra/net/undici-error-diagnostics.ts
import { EventEmitter } from "node:events";
init_errors2();
var observedDispatcherValues = /* @__PURE__ */ new WeakSet();
function logUndiciDispatcherError(error) {
  logDebug(`undici: internal dispatcher error: ${formatErrorMessage2(error)}`);
}
function observeDispatcherValue(value) {
  if (typeof value !== "object" && typeof value !== "function" || value === null) {
    return;
  }
  if (observedDispatcherValues.has(value)) {
    return;
  }
  observedDispatcherValues.add(value);
  if (value instanceof EventEmitter) {
    EventEmitter.prototype.on.call(value, "error", logUndiciDispatcherError);
    EventEmitter.prototype.on.call(value, "connect", (_origin, targets) => {
      observeDispatcherValue(targets);
    });
    for (const key of Reflect.ownKeys(value)) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (descriptor && "value" in descriptor) {
        observeDispatcherValue(descriptor.value);
      }
    }
    return;
  }
  if (Array.isArray(value) || value instanceof Set) {
    for (const entry of value) {
      observeDispatcherValue(entry);
    }
    return;
  }
  if (value instanceof Map) {
    for (const entry of value.values()) {
      observeDispatcherValue(entry);
    }
  }
}
function withUndiciErrorDiagnostics(dispatcher) {
  observeDispatcherValue(dispatcher);
  return dispatcher;
}

// src/infra/net/undici-family-policy.ts
import * as net from "node:net";

// src/infra/wsl.ts
import { readFileSync as readFileSync2 } from "node:fs";
init_string_coerce();
function isWSLEnv(env = process.env) {
  if (env.WSL_INTEROP || env.WSL_DISTRO_NAME || env.WSLENV) {
    return true;
  }
  return false;
}
function isWSLSync() {
  if (process.platform !== "linux") {
    return false;
  }
  if (isWSLEnv()) {
    return true;
  }
  try {
    const release = normalizeLowercaseStringOrEmpty(readFileSync2("/proc/version", "utf8"));
    return release.includes("microsoft") || release.includes("wsl");
  } catch {
    return false;
  }
}
function isWSL2Sync() {
  if (!isWSLSync()) {
    return false;
  }
  try {
    const version = normalizeLowercaseStringOrEmpty(readFileSync2("/proc/version", "utf8"));
    return version.includes("wsl2") || version.includes("microsoft-standard");
  } catch {
    return false;
  }
}

// src/infra/net/undici-family-policy.ts
var AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS = 300;
function resolveUndiciAutoSelectFamily() {
  if (typeof net.getDefaultAutoSelectFamily !== "function") {
    return void 0;
  }
  try {
    const systemDefault = net.getDefaultAutoSelectFamily();
    if (systemDefault && isWSL2Sync()) {
      return false;
    }
    return systemDefault;
  } catch {
    return void 0;
  }
}
function createUndiciAutoSelectFamilyConnectOptions(autoSelectFamily) {
  if (autoSelectFamily === void 0) {
    return void 0;
  }
  return {
    autoSelectFamily,
    autoSelectFamilyAttemptTimeout: AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS
  };
}
function resolveUndiciAutoSelectFamilyConnectOptions() {
  return createUndiciAutoSelectFamilyConnectOptions(resolveUndiciAutoSelectFamily());
}

// src/infra/net/undici-dispatcher-options.ts
var TEST_UNDICI_RUNTIME_DEPS_KEY = "__OPENCLAW_TEST_UNDICI_RUNTIME_DEPS__";
var requireUndici = createRequire(import.meta.url);
var HTTP1_ONLY_DISPATCHER_OPTIONS = Object.freeze({
  allowH2: false
});
function loadUndiciModule(requiredExports) {
  const override = globalThis[TEST_UNDICI_RUNTIME_DEPS_KEY];
  if (isRecord(override) && requiredExports.every((key) => typeof override[key] === "function")) {
    return override;
  }
  return requireUndici("undici");
}
function stripIpServernameFromConnectOptions(options) {
  if (!isRecord(options) || typeof options.servername !== "string") {
    return options;
  }
  const servername = options.servername.replace(/^\[|\]$/g, "");
  if (net2.isIP(servername) === 0) {
    return options;
  }
  const next = { ...options };
  delete next.servername;
  return next;
}
function stripIpServernameFromConnect(connect) {
  if (typeof connect !== "function") {
    return connect;
  }
  return (options, callback) => connect(stripIpServernameFromConnectOptions(options), callback);
}
function createIpSafeProxyClientFactory() {
  return (origin, options) => {
    const clientOptions = isRecord(options) ? { ...options, connect: stripIpServernameFromConnect(options.connect) } : options;
    return createUndiciPool(origin, clientOptions);
  };
}
function createUndiciClient(origin, options) {
  const { Client } = loadUndiciModule(["Client"]);
  return withUndiciErrorDiagnostics(
    new Client(origin, options)
  );
}
function createUndiciPool(origin, options) {
  const { Pool } = loadUndiciModule(["Pool"]);
  const poolOptions = isRecord(options) ? options : {};
  return withUndiciErrorDiagnostics(
    new Pool(origin, {
      ...poolOptions,
      factory: createUndiciClient
    })
  );
}
function createUndiciOriginDispatcher(origin, options) {
  return isRecord(options) && options.connections === 1 ? createUndiciClient(origin, options) : createUndiciPool(origin, options);
}
function addUndiciAgentFactory(options) {
  if ("factory" in options) {
    return options;
  }
  return {
    ...options,
    factory: createUndiciOriginDispatcher
  };
}
function addIpSafeProxyClientFactory(options) {
  if ("clientFactory" in options) {
    return options;
  }
  return {
    ...options,
    clientFactory: createIpSafeProxyClientFactory()
  };
}
function applyMissingConnectOptions(connect, defaults) {
  for (const [key, value] of Object.entries(defaults)) {
    if (!(key in connect)) {
      connect[key] = value;
    }
  }
}
function withHttp1OnlyDispatcherOptions(options, timeoutMs, applyTo) {
  const base = {};
  if (options) {
    Object.assign(base, options);
  }
  Object.assign(base, HTTP1_ONLY_DISPATCHER_OPTIONS);
  const baseRecord = base;
  const targets = applyTo ?? { connect: true };
  const autoSelectConnect = resolveUndiciAutoSelectFamilyConnectOptions();
  if (autoSelectConnect && targets.connect && typeof baseRecord.connect !== "function") {
    const connect = isRecord(baseRecord.connect) ? baseRecord.connect : {};
    applyMissingConnectOptions(connect, autoSelectConnect);
    baseRecord.connect = connect;
  }
  if (autoSelectConnect && targets.proxyTls) {
    const proxyTls = isRecord(baseRecord.proxyTls) ? baseRecord.proxyTls : {};
    applyMissingConnectOptions(proxyTls, autoSelectConnect);
    baseRecord.proxyTls = proxyTls;
  }
  if (timeoutMs !== void 0 && Number.isFinite(timeoutMs) && timeoutMs > 0) {
    const normalizedTimeoutMs = Math.floor(timeoutMs);
    baseRecord.bodyTimeout = normalizedTimeoutMs;
    baseRecord.headersTimeout = normalizedTimeoutMs;
    if (targets.connect && typeof baseRecord.connect !== "function") {
      baseRecord.connect = {
        ...isRecord(baseRecord.connect) ? baseRecord.connect : {},
        timeout: normalizedTimeoutMs
      };
    }
    if (targets.proxyTls) {
      baseRecord.proxyTls = {
        ...isRecord(baseRecord.proxyTls) ? baseRecord.proxyTls : {},
        timeout: normalizedTimeoutMs
      };
    }
  }
  return base;
}
function buildHttp1AgentOptions(options, timeoutMs) {
  return addUndiciAgentFactory(withHttp1OnlyDispatcherOptions(options, timeoutMs));
}
function buildHttp1EnvHttpProxyAgentOptions(options, timeoutMs) {
  return withHttp1OnlyDispatcherOptions(
    addIpSafeProxyClientFactory(
      addUndiciAgentFactory(addActiveManagedProxyTlsOptions(options) ?? {})
    ),
    timeoutMs,
    { connect: true, proxyTls: true }
  );
}
function buildHttp1ProxyAgentOptions(options, timeoutMs) {
  const normalized = typeof options === "string" || options instanceof URL ? { uri: options.toString() } : { ...options };
  return withHttp1OnlyDispatcherOptions(
    addIpSafeProxyClientFactory(
      addUndiciAgentFactory(addActiveManagedProxyTlsOptions(normalized))
    ),
    timeoutMs,
    { proxyTls: true }
  );
}

// src/infra/net/undici-runtime.ts
function loadUndiciRuntimeDeps() {
  return loadUndiciModule(["Agent", "EnvHttpProxyAgent", "ProxyAgent", "fetch"]);
}
function createHttp1Agent(options, timeoutMs) {
  const { Agent } = loadUndiciRuntimeDeps();
  return withUndiciErrorDiagnostics(new Agent(buildHttp1AgentOptions(options, timeoutMs)));
}
function createHttp1EnvHttpProxyAgent(options, timeoutMs) {
  const { EnvHttpProxyAgent } = loadUndiciRuntimeDeps();
  return withUndiciErrorDiagnostics(
    new EnvHttpProxyAgent(buildHttp1EnvHttpProxyAgentOptions(options, timeoutMs))
  );
}
function createHttp1ProxyAgent(options, timeoutMs) {
  const { ProxyAgent } = loadUndiciRuntimeDeps();
  return withUndiciErrorDiagnostics(
    new ProxyAgent(buildHttp1ProxyAgentOptions(options, timeoutMs))
  );
}

// src/infra/net/ssrf.ts
var DISPATCHER_CLOSE_TIMEOUT_MS = 100;
var SsrFBlockedError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "SsrFBlockedError";
  }
};
function normalizePolicyHostnames(values) {
  return normalizeUniqueStringEntries(values?.map((value) => normalizeHostname(value)));
}
function normalizeSsrFPolicyOrigin(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return void 0;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return void 0;
    }
    parsed.hostname = parsed.hostname.replace(/\.+$/, "");
    return parsed.origin.toLowerCase();
  } catch {
    return void 0;
  }
}
function normalizeSsrFPolicyOrigins(values) {
  if (!values || values.length === 0) {
    return [];
  }
  return Array.from(
    new Set(
      values.map((value) => normalizeSsrFPolicyOrigin(value)).filter((value) => Boolean(value))
    )
  ).toSorted();
}
var BLOCKED_HOSTNAMES = /* @__PURE__ */ new Set([
  "localhost",
  "localhost.localdomain",
  "metadata.google.internal"
]);
function normalizeHostnameSet(values) {
  return new Set(normalizePolicyHostnames(values));
}
function normalizeHostnameAllowlist(values) {
  return normalizePolicyHostnames(values).filter((value) => value !== "*" && value !== "*.");
}
function isPrivateNetworkAllowedByPolicy(policy) {
  return policy?.dangerouslyAllowPrivateNetwork === true || policy?.allowPrivateNetwork === true;
}
function shouldSkipPrivateNetworkChecks(hostname, policy) {
  return isPrivateNetworkAllowedByPolicy(policy) || normalizeHostnameSet(policy?.allowedHostnames).has(hostname);
}
function resolveSsrFPolicyForUrl(url, policy) {
  if (!policy?.allowedOrigins?.length) {
    return policy;
  }
  const requestOrigin = normalizeSsrFPolicyOrigin(url.toString());
  if (!requestOrigin || !normalizeSsrFPolicyOrigins(policy.allowedOrigins).includes(requestOrigin)) {
    return policy;
  }
  return {
    ...policy,
    allowedHostnames: Array.from(
      /* @__PURE__ */ new Set([...policy.allowedHostnames ?? [], normalizeHostname(url.hostname)])
    )
  };
}
function resolveIpv4SpecialUseBlockOptions(policy) {
  return {
    allowRfc2544BenchmarkRange: policy?.allowRfc2544BenchmarkRange === true
  };
}
function resolveIpv6SpecialUseBlockOptions(policy) {
  return {
    allowUniqueLocalRange: policy?.allowIpv6UniqueLocalRange === true
  };
}
function isHostnameAllowedByPattern(hostname, pattern) {
  if (pattern.startsWith("*.")) {
    const suffix = pattern.slice(2);
    if (!suffix || hostname === suffix) {
      return false;
    }
    return hostname.endsWith(`.${suffix}`);
  }
  return hostname === pattern;
}
function matchesHostnameAllowlist(hostname, allowlist) {
  if (allowlist.length === 0) {
    return true;
  }
  return allowlist.some((pattern) => isHostnameAllowedByPattern(hostname, pattern));
}
function looksLikeUnsupportedIpv4Literal(address) {
  const parts = address.split(".");
  if (parts.length === 0 || parts.length > 4) {
    return false;
  }
  if (parts.some((part) => part.length === 0)) {
    return true;
  }
  return parts.every((part) => /^[0-9]+$/.test(part) || /^0x/i.test(part));
}
function isPrivateIpAddress(address, policy) {
  const normalized = normalizeHostname(address);
  if (!normalized) {
    return false;
  }
  const blockOptions = resolveIpv4SpecialUseBlockOptions(policy);
  const ipv6BlockOptions = resolveIpv6SpecialUseBlockOptions(policy);
  const strictIp = parseCanonicalIpAddress(normalized);
  if (strictIp) {
    if (isIpv4Address(strictIp)) {
      return isBlockedSpecialUseIpv4Address(strictIp, blockOptions);
    }
    if (isBlockedSpecialUseIpv6Address(strictIp, ipv6BlockOptions)) {
      return true;
    }
    const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(strictIp);
    if (embeddedIpv4) {
      return isBlockedSpecialUseIpv4Address(embeddedIpv4, blockOptions);
    }
    return false;
  }
  if (normalized.includes(":") && !parseLooseIpAddress(normalized)) {
    return true;
  }
  if (!isCanonicalDottedDecimalIPv4(normalized) && isLegacyIpv4Literal(normalized)) {
    return true;
  }
  if (looksLikeUnsupportedIpv4Literal(normalized)) {
    return true;
  }
  return false;
}
function isBlockedHostnameNormalized(normalized) {
  if (BLOCKED_HOSTNAMES.has(normalized)) {
    return true;
  }
  return normalized.endsWith(".localhost") || normalized.endsWith(".local") || normalized.endsWith(".internal");
}
function isBlockedHostnameOrIp(hostname, policy) {
  const normalized = normalizeHostname(hostname);
  if (!normalized) {
    return false;
  }
  return isBlockedHostnameNormalized(normalized) || isPrivateIpAddress(normalized, policy);
}
var BLOCKED_HOST_OR_IP_MESSAGE = "Blocked hostname or private/internal/special-use IP address";
var BLOCKED_RESOLVED_IP_MESSAGE = "Blocked: resolves to private/internal/special-use IP address";
function assertAllowedHostOrIpOrThrow(hostnameOrIp, policy) {
  if (isBlockedHostnameOrIp(hostnameOrIp, policy)) {
    throw new SsrFBlockedError(BLOCKED_HOST_OR_IP_MESSAGE);
  }
}
function resolveHostnamePolicyChecks(hostname, policy) {
  const normalized = normalizeHostname(hostname);
  if (!normalized) {
    throw new Error("Invalid hostname");
  }
  const hostnameAllowlist = normalizeHostnameAllowlist(policy?.hostnameAllowlist);
  const skipPrivateNetworkChecks = shouldSkipPrivateNetworkChecks(normalized, policy);
  if (!matchesHostnameAllowlist(normalized, hostnameAllowlist)) {
    throw new SsrFBlockedError(`Blocked hostname (not in allowlist): ${hostname}`);
  }
  if (!skipPrivateNetworkChecks) {
    assertAllowedHostOrIpOrThrow(normalized, policy);
  }
  return { normalized, skipPrivateNetworkChecks };
}
function assertAllowedResolvedAddressesOrThrow(results, policy) {
  for (const entry of results) {
    if (isBlockedHostnameOrIp(entry.address, policy)) {
      throw new SsrFBlockedError(BLOCKED_RESOLVED_IP_MESSAGE);
    }
  }
}
function isLoopbackIpAddressIncludingEmbeddedIpv4(address) {
  if (isLoopbackIpAddress(address)) {
    return true;
  }
  const parsed = parseCanonicalIpAddress(address);
  if (!parsed || isIpv4Address(parsed)) {
    return false;
  }
  const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(parsed);
  return embeddedIpv4?.range() === "loopback";
}
function isUnspecifiedIpAddressIncludingEmbeddedIpv4(address) {
  const parsed = parseCanonicalIpAddress(address);
  if (!parsed) {
    return false;
  }
  if (isIpv4Address(parsed)) {
    return parsed.range() === "unspecified";
  }
  if (parsed.range() === "unspecified") {
    return true;
  }
  if (parsed.range() === "loopback") {
    return false;
  }
  return extractEmbeddedIpv4FromIpv6(parsed)?.range() === "unspecified";
}
function isExplicitLoopbackHostname(hostname) {
  return hostname === "localhost" || hostname === "localhost.localdomain" || hostname.endsWith(".localhost") || isLoopbackIpAddressIncludingEmbeddedIpv4(hostname);
}
function assertAllowedTrustedHostnameResolvedAddressesOrThrow(results, hostname) {
  const isLoopbackAllowed = isExplicitLoopbackHostname(hostname);
  for (const entry of results) {
    if (isUnspecifiedIpAddressIncludingEmbeddedIpv4(entry.address) || !isLoopbackAllowed && isLoopbackIpAddressIncludingEmbeddedIpv4(entry.address) || isLinkLocalIpAddress(entry.address) || isCloudMetadataIpAddress(entry.address)) {
      throw new SsrFBlockedError(BLOCKED_RESOLVED_IP_MESSAGE);
    }
  }
}
function normalizeLookupResults(results) {
  if (Array.isArray(results)) {
    return results;
  }
  return [results];
}
function createPinnedLookup(params) {
  const normalizedHost = normalizeHostname(params.hostname);
  if (params.addresses.length === 0) {
    throw new Error(`Pinned lookup requires at least one address for ${params.hostname}`);
  }
  const fallback = params.fallback ?? dnsLookupCb;
  const fallbackLookup = fallback;
  const fallbackWithOptions = fallback;
  const records = params.addresses.map((address) => ({
    address,
    family: address.includes(":") ? 6 : 4
  }));
  const ipv4Records = records.filter((entry) => entry.family === 4);
  const automaticRecords = ipv4Records.length > 0 ? ipv4Records : records;
  let index = 0;
  return ((host, options, callback) => {
    const cb = typeof options === "function" ? options : callback;
    if (!cb) {
      return;
    }
    const normalized = normalizeHostname(host);
    if (!normalized || normalized !== normalizedHost) {
      if (typeof options === "function" || options === void 0) {
        return fallbackLookup(host, cb);
      }
      return fallbackWithOptions(host, options, cb);
    }
    const opts = typeof options === "object" && options !== null ? options : {};
    const requestedFamily = typeof options === "number" ? options : typeof opts.family === "number" ? opts.family : 0;
    const candidates = requestedFamily === 4 || requestedFamily === 6 ? records.filter((entry) => entry.family === requestedFamily) : automaticRecords;
    const usable = candidates.length > 0 ? candidates : automaticRecords;
    if (opts.all) {
      cb(null, usable);
      return;
    }
    const chosen = expectDefined(
      usable[index % usable.length],
      "usable entry at index % usable.length"
    );
    index += 1;
    cb(null, chosen.address, chosen.family);
  });
}
function dedupeAndPreferIpv4(results) {
  const seen = /* @__PURE__ */ new Set();
  const ipv4 = [];
  const otherFamilies = [];
  for (const entry of results) {
    if (seen.has(entry.address)) {
      continue;
    }
    seen.add(entry.address);
    if (entry.family === 4) {
      ipv4.push(entry.address);
      continue;
    }
    otherFamilies.push(entry.address);
  }
  return [...ipv4, ...otherFamilies];
}
async function resolvePinnedHostnameWithPolicy(hostname, params = {}) {
  const { normalized, skipPrivateNetworkChecks } = resolveHostnamePolicyChecks(
    hostname,
    params.policy
  );
  const lookupFn = params.lookupFn ?? dnsLookup;
  const results = normalizeLookupResults(
    await lookupFn(normalized, { all: true })
  );
  if (results.length === 0) {
    throw new Error(`Unable to resolve hostname: ${hostname}`);
  }
  if (!skipPrivateNetworkChecks) {
    assertAllowedResolvedAddressesOrThrow(results, params.policy);
  } else if (!isPrivateNetworkAllowedByPolicy(params.policy)) {
    assertAllowedTrustedHostnameResolvedAddressesOrThrow(results, normalized);
  }
  const addresses = dedupeAndPreferIpv4(results);
  if (addresses.length === 0) {
    throw new Error(`Unable to resolve hostname: ${hostname}`);
  }
  return {
    hostname: normalized,
    addresses,
    lookup: createPinnedLookup({ hostname: normalized, addresses })
  };
}
function assertHostnameAllowedWithPolicy(hostname, policy) {
  return resolveHostnamePolicyChecks(hostname, policy).normalized;
}
function withPinnedLookup(lookup, connect) {
  return connect ? { ...connect, lookup } : { lookup };
}
function resolvePinnedDispatcherLookup(pinned, override, policy) {
  if (!override) {
    return pinned.lookup;
  }
  const normalizedOverrideHost = normalizeHostname(override.hostname);
  if (!normalizedOverrideHost || normalizedOverrideHost !== pinned.hostname) {
    throw new Error(
      `Pinned dispatcher override hostname mismatch: expected ${pinned.hostname}, got ${override.hostname}`
    );
  }
  const records = override.addresses.map((address) => ({
    address,
    family: address.includes(":") ? 6 : 4
  }));
  if (!shouldSkipPrivateNetworkChecks(pinned.hostname, policy)) {
    assertAllowedResolvedAddressesOrThrow(records, policy);
  } else if (!isPrivateNetworkAllowedByPolicy(policy)) {
    assertAllowedTrustedHostnameResolvedAddressesOrThrow(records, pinned.hostname);
  }
  return createPinnedLookup({
    hostname: pinned.hostname,
    addresses: [...override.addresses],
    fallback: pinned.lookup
  });
}
function createPinnedDispatcher(pinned, policy, ssrfPolicy, timeoutMs) {
  const lookup = resolvePinnedDispatcherLookup(pinned, policy?.pinnedHostname, ssrfPolicy);
  if (!policy || policy.mode === "direct") {
    return createHttp1Agent({ connect: withPinnedLookup(lookup, policy?.connect) }, timeoutMs);
  }
  if (policy.mode === "env-proxy") {
    return createHttp1EnvHttpProxyAgent(
      {
        connect: withPinnedLookup(lookup, policy.connect),
        ...policy.proxyTls ? { proxyTls: { ...policy.proxyTls } } : {}
      },
      timeoutMs
    );
  }
  const proxyUrl = policy.proxyUrl.trim();
  const requestTls = withPinnedLookup(lookup, policy.proxyTls);
  if (!requestTls) {
    return createHttp1ProxyAgent({ uri: proxyUrl }, timeoutMs);
  }
  return createHttp1ProxyAgent(
    {
      uri: proxyUrl,
      // `PinnedDispatcherPolicy.proxyTls` historically carried target-hop
      // transport hints for explicit proxies. Translate that to undici's
      // `requestTls` so HTTPS proxy tunnels keep the pinned DNS lookup.
      requestTls
    },
    timeoutMs
  );
}
function destroyDispatcher(candidate) {
  try {
    candidate.destroy?.();
  } catch {
  }
}
async function waitForDispatcherClose(candidate) {
  const close = candidate.close;
  if (typeof close !== "function") {
    destroyDispatcher(candidate);
    return;
  }
  let timeout;
  try {
    await Promise.race([
      Promise.resolve(close.call(candidate)),
      new Promise((resolve) => {
        timeout = setTimeout(() => {
          timeout = void 0;
          destroyDispatcher(candidate);
          resolve();
        }, DISPATCHER_CLOSE_TIMEOUT_MS);
        timeout.unref?.();
      })
    ]);
  } catch (err) {
    destroyDispatcher(candidate);
    throw err;
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}
async function closeDispatcher(dispatcher) {
  if (!dispatcher) {
    return;
  }
  const candidate = dispatcher;
  try {
    await waitForDispatcherClose(candidate);
  } catch {
  }
}

// src/infra/net/configured-local-origin-bypass.ts
function resolveHttpOrigin(value) {
  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return void 0;
    }
    parsed.hostname = parsed.hostname.replace(/\.+$/, "");
    return parsed.origin.toLowerCase();
  } catch {
    return void 0;
  }
}
function isLoopbackManagedProxyBypassHost(hostname) {
  const normalized = hostname.trim().toLowerCase().replace(/\.+$/, "").replace(/^\[(.*)\]$/, "$1");
  return normalized === "localhost" || isLoopbackIpAddress(normalized);
}
function isExactConfiguredLocalOriginBypass(params) {
  if (params.managedProxyBypass?.kind !== "configured-local-origin") {
    return false;
  }
  const baseOrigin = resolveHttpOrigin(params.managedProxyBypass.baseUrl);
  if (!baseOrigin) {
    return false;
  }
  let baseHostname;
  try {
    baseHostname = new URL(params.managedProxyBypass.baseUrl.trim()).hostname;
  } catch {
    return false;
  }
  if (!isLoopbackManagedProxyBypassHost(baseHostname)) {
    return false;
  }
  return resolveHttpOrigin(params.url.toString()) === baseOrigin;
}
function isPinnedLoopbackTarget(addresses) {
  return addresses.length > 0 && addresses.every((address) => isLoopbackIpAddress(address));
}
function shouldResolveConfiguredLocalOriginManagedProxyBypass(params) {
  return isExactConfiguredLocalOriginBypass(params);
}
function shouldUseConfiguredLocalOriginManagedProxyBypass(params) {
  if (!isExactConfiguredLocalOriginBypass(params)) {
    return false;
  }
  const loopbackMode = getActiveManagedProxyLoopbackMode();
  if (loopbackMode === "proxy") {
    return false;
  }
  if (loopbackMode === "block" && isLoopbackManagedProxyBypassHost(params.url.hostname)) {
    throw new SsrFBlockedError(
      "proxy: configured local provider loopback connections are blocked by proxy.loopbackMode"
    );
  }
  return isPinnedLoopbackTarget(params.resolvedAddresses);
}

// src/infra/net/redirect-headers.ts
init_string_coerce();
init_fetch_headers();
var CROSS_ORIGIN_REDIRECT_SAFE_HEADERS = /* @__PURE__ */ new Set([
  "accept",
  "accept-encoding",
  "accept-language",
  "cache-control",
  "content-language",
  "content-type",
  "if-match",
  "if-modified-since",
  "if-none-match",
  "if-unmodified-since",
  "pragma",
  "range",
  "user-agent"
]);
function retainSafeHeadersForCrossOriginRedirect(headers) {
  if (!headers) {
    return headers;
  }
  const incoming = new Headers(normalizeHeadersInitForFetch(headers));
  const safeHeaders = {};
  for (const [key, value] of incoming.entries()) {
    if (CROSS_ORIGIN_REDIRECT_SAFE_HEADERS.has(normalizeLowercaseStringOrEmpty(key))) {
      safeHeaders[key] = value;
    }
  }
  return safeHeaders;
}

// src/infra/net/runtime-fetch.ts
init_fetch_headers();

// src/infra/net/form-data.ts
function isFormDataLike(value) {
  return typeof value === "object" && value !== null && typeof value.entries === "function" && value[Symbol.toStringTag] === "FormData";
}

// src/infra/net/runtime-fetch.ts
function normalizeRuntimeFormData(body, RuntimeFormData) {
  if (!isFormDataLike(body) || typeof RuntimeFormData !== "function") {
    return body;
  }
  if (body instanceof RuntimeFormData) {
    return body;
  }
  const next = new RuntimeFormData();
  for (const [key, value] of body.entries()) {
    const namedValue = value;
    const fileName = typeof namedValue.name === "string" && namedValue.name.trim() ? namedValue.name : void 0;
    if (fileName) {
      next.append(key, value, fileName);
    } else {
      next.append(key, value);
    }
  }
  return next;
}
function normalizeRuntimeRequestInit(init, RuntimeFormData) {
  if (!init) {
    return init;
  }
  const normalizedHeaders = normalizeHeadersInitForFetch(init.headers);
  const initWithNormalizedHeaders = normalizedHeaders === init.headers ? init : { ...init, headers: normalizedHeaders };
  if (!init.body) {
    return initWithNormalizedHeaders;
  }
  const body = normalizeRuntimeFormData(init.body, RuntimeFormData);
  if (body === init.body) {
    return initWithNormalizedHeaders;
  }
  const headers = new Headers(normalizedHeaders);
  headers.delete("content-length");
  headers.delete("content-type");
  return {
    ...initWithNormalizedHeaders,
    headers,
    body
  };
}
function isMockedFetch(fetchImpl) {
  if (typeof fetchImpl !== "function") {
    return false;
  }
  return typeof fetchImpl.mock === "object";
}
async function fetchWithRuntimeDispatcher(input, init) {
  return await fetchWithPreparedRuntimeDispatcher(loadUndiciRuntimeDeps(), input, init);
}
function fetchWithPreparedRuntimeDispatcher(runtimeDeps, input, init) {
  const runtimeFetch = runtimeDeps.fetch;
  return runtimeFetch(input, normalizeRuntimeRequestInit(init, runtimeDeps.FormData));
}

// src/infra/net/undici-global-dispatcher.ts
import { isProxylineDispatcher } from "@openclaw/proxyline/dispatcher-brand";
var DEFAULT_UNDICI_STREAM_TIMEOUT_MS = 30 * 60 * 1e3;
var HTTP1_ONLY_DISPATCHER_OPTIONS2 = Object.freeze({
  allowH2: false
});
var globalUndiciStreamTimeoutMs;

// src/infra/net/fetch-guard.ts
function resolveDispatcherTimeoutMs(fromParams) {
  if (fromParams !== void 0) {
    return fromParams;
  }
  if (globalUndiciStreamTimeoutMs !== void 0) {
    return globalUndiciStreamTimeoutMs;
  }
  return void 0;
}
var GUARDED_FETCH_MODE = {
  STRICT: "strict",
  TRUSTED_ENV_PROXY: "trusted_env_proxy",
  TRUSTED_EXPLICIT_PROXY: "trusted_explicit_proxy"
};
var DEFAULT_MAX_REDIRECTS = 3;
var OPENCLAW_DEBUG_PROXY_ENABLED2 = "OPENCLAW_DEBUG_PROXY_ENABLED";
async function runAbortablePreflight(run, signal) {
  if (!signal) {
    return await run();
  }
  if (signal.aborted) {
    throw signal.reason ?? createAbortError("Guarded fetch aborted during network preflight");
  }
  return await new Promise((resolve, reject) => {
    let settled = false;
    const settle = (complete) => {
      if (settled) {
        return;
      }
      settled = true;
      signal.removeEventListener("abort", onAbort);
      complete();
    };
    const onAbort = () => settle(
      () => reject(
        toErrorObject(
          signal.reason ?? createAbortError("Guarded fetch aborted during network preflight"),
          "Guarded fetch aborted during network preflight"
        )
      )
    );
    signal.addEventListener("abort", onAbort, { once: true });
    if (signal.aborted) {
      onAbort();
      return;
    }
    void run().then(
      (value) => settle(() => resolve(value)),
      (error) => settle(() => reject(toErrorObject(error, "Network preflight failed")))
    );
  });
}
function getRedirectVisitKey(url, init) {
  return `${init?.method?.toUpperCase() ?? "GET"} ${url}`;
}
function isTruthyEnvValue(value) {
  return value === "1" || value === "true" || value === "yes" || value === "on";
}
function resolveGuardedFetchMode(params) {
  if (params.mode) {
    return params.mode;
  }
  if (params.proxy === "env" && params.dangerouslyAllowEnvProxyWithoutPinnedDns === true) {
    return GUARDED_FETCH_MODE.TRUSTED_ENV_PROXY;
  }
  return GUARDED_FETCH_MODE.STRICT;
}
function isManagedProxyActive() {
  return process.env["OPENCLAW_PROXY_ACTIVE"] === "1";
}
function assertExplicitProxySupportsPinnedDns(url, dispatcherPolicy, pinDns) {
  if (pinDns !== false && dispatcherPolicy?.mode === "explicit-proxy" && url.protocol !== "https:") {
    throw new Error(
      "Explicit proxy SSRF pinning requires HTTPS targets; plain HTTP targets are not supported"
    );
  }
}
function createPolicyDispatcherWithoutPinnedDns(dispatcherPolicy, timeoutMs) {
  if (!dispatcherPolicy) {
    return null;
  }
  if (dispatcherPolicy.mode === "direct") {
    return createHttp1Agent(
      dispatcherPolicy.connect ? { connect: { ...dispatcherPolicy.connect } } : void 0,
      timeoutMs
    );
  }
  if (dispatcherPolicy.mode === "env-proxy") {
    return createHttp1EnvHttpProxyAgent(
      {
        ...dispatcherPolicy.connect ? { connect: { ...dispatcherPolicy.connect } } : {},
        ...dispatcherPolicy.proxyTls ? { proxyTls: { ...dispatcherPolicy.proxyTls } } : {}
      },
      timeoutMs
    );
  }
  const proxyUrl = dispatcherPolicy.proxyUrl.trim();
  if (dispatcherPolicy.proxyTls) {
    return createHttp1ProxyAgent(
      { uri: proxyUrl, requestTls: { ...dispatcherPolicy.proxyTls } },
      timeoutMs
    );
  }
  return createHttp1ProxyAgent({ uri: proxyUrl }, timeoutMs);
}
async function assertExplicitProxyAllowed(dispatcherPolicy, lookupFn, policy, signal) {
  if (!dispatcherPolicy || dispatcherPolicy.mode !== "explicit-proxy") {
    return;
  }
  let parsedProxyUrl;
  try {
    parsedProxyUrl = new URL(dispatcherPolicy.proxyUrl);
  } catch {
    throw new Error("Invalid explicit proxy URL");
  }
  if (!["http:", "https:"].includes(parsedProxyUrl.protocol)) {
    throw new Error("Explicit proxy URL must use http or https");
  }
  const proxyPolicy = policy || dispatcherPolicy.allowPrivateProxy === true ? {
    ...policy,
    // The proxy hostname is operator-configured, not user input. Target-scoped
    // allowlists must not reject a configured proxy host before the request
    // target gets checked against that same allowlist below.
    hostnameAllowlist: void 0,
    ...dispatcherPolicy.allowPrivateProxy === true ? { allowPrivateNetwork: true } : {}
  } : void 0;
  await runAbortablePreflight(
    async () => await resolvePinnedHostnameWithPolicy(parsedProxyUrl.hostname, {
      lookupFn,
      policy: proxyPolicy
    }),
    signal
  );
}
function isRedirectStatus(status) {
  return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
function isAmbientGlobalFetch(params) {
  return typeof params.fetchImpl === "function" && typeof params.globalFetch === "function" && params.fetchImpl === params.globalFetch;
}
async function captureGuardedFetchExchange(params) {
  if (params.capture === false || !isTruthyEnvValue(process.env[OPENCLAW_DEBUG_PROXY_ENABLED2])) {
    return;
  }
  const { captureHttpExchange: captureHttpExchange2, isDebugProxyGlobalFetchPatchInstalled: isDebugProxyGlobalFetchPatchInstalled2 } = await Promise.resolve().then(() => (init_runtime2(), runtime_exports));
  if (params.capturedByGlobalFetchPatch && isDebugProxyGlobalFetchPatchInstalled2()) {
    return;
  }
  captureHttpExchange2({
    url: params.url,
    method: params.method,
    requestHeaders: params.requestHeaders,
    requestBody: params.requestBody,
    response: params.response,
    transport: params.transport,
    flowId: params.capture?.flowId,
    meta: {
      captureOrigin: "guarded-fetch",
      ...params.auditContext ? { auditContext: params.auditContext } : {},
      ...params.capture?.meta
    }
  });
}
function retainSafeHeadersForCrossOriginRedirect2(init) {
  if (!init?.headers) {
    return init;
  }
  return { ...init, headers: retainSafeHeadersForCrossOriginRedirect(init.headers) };
}
function resolveRetainedAuthorizationForRedirect(params) {
  const init = params.init;
  if (!init?.headers || !params.hostnameAllowlist?.length) {
    return void 0;
  }
  if (params.nextUrl.protocol !== "https:") {
    return void 0;
  }
  if (!params.hostnameAllowlist.includes("*") && !matchesHostnameAllowlist(params.nextUrl.hostname, params.hostnameAllowlist)) {
    return void 0;
  }
  const normalizedInit = normalizeRequestInitHeadersForFetch(init);
  if (!normalizedInit?.headers) {
    return void 0;
  }
  return new Headers(normalizedInit.headers).get("authorization") ?? void 0;
}
function restoreRedirectAuthorization(params) {
  if (!params.authorization) {
    return params.init;
  }
  const headers = new Headers(params.init?.headers);
  headers.set("Authorization", params.authorization);
  return { ...params.init, headers };
}
function dropBodyHeaders(headers) {
  if (!headers) {
    return headers;
  }
  const nextHeaders = new Headers(normalizeHeadersInitForFetch(headers));
  nextHeaders.delete("content-encoding");
  nextHeaders.delete("content-language");
  nextHeaders.delete("content-length");
  nextHeaders.delete("content-location");
  nextHeaders.delete("content-type");
  nextHeaders.delete("transfer-encoding");
  return nextHeaders;
}
function rewriteRedirectInitForMethod(params) {
  const { init, status } = params;
  if (!init) {
    return init;
  }
  const currentMethod = init.method?.toUpperCase() ?? "GET";
  const shouldForceGet = status === 303 ? currentMethod !== "GET" && currentMethod !== "HEAD" : (status === 301 || status === 302) && currentMethod === "POST";
  if (!shouldForceGet) {
    return init;
  }
  return {
    ...init,
    method: "GET",
    body: void 0,
    headers: dropBodyHeaders(init.headers)
  };
}
function rewriteRedirectInitForCrossOrigin(params) {
  const { init, allowUnsafeReplay } = params;
  if (!init || allowUnsafeReplay) {
    return init;
  }
  const currentMethod = init.method?.toUpperCase() ?? "GET";
  if (currentMethod === "GET" || currentMethod === "HEAD") {
    return init;
  }
  return {
    ...init,
    body: void 0,
    headers: dropBodyHeaders(init.headers)
  };
}
async function fetchWithSsrFGuard(params) {
  const { managedProxyBypass: _ignoredManagedProxyBypass, ...publicParams } = params;
  return await fetchWithSsrFGuardInternal(publicParams);
}
async function fetchWithSsrFGuardInternal(params) {
  const defaultFetch = params.fetchImpl ?? globalThis.fetch;
  if (!defaultFetch) {
    throw new Error("fetch is not available");
  }
  const isUsingMockedFetch = isMockedFetch(defaultFetch);
  const maxRedirects = typeof params.maxRedirects === "number" && Number.isFinite(params.maxRedirects) ? Math.max(0, Math.floor(params.maxRedirects)) : DEFAULT_MAX_REDIRECTS;
  const mode = resolveGuardedFetchMode(params);
  const { signal, cleanup, refresh } = buildTimeoutAbortSignal({
    timeoutMs: params.timeoutMs,
    signal: params.signal,
    operation: "fetchWithSsrFGuard",
    url: params.url
  });
  let released = false;
  const release = async (dispatcher) => {
    if (released) {
      return;
    }
    released = true;
    cleanup();
    await closeDispatcher(dispatcher ?? void 0);
  };
  let currentUrl = params.url;
  let currentInit = normalizeRequestInitHeadersForFetch(
    params.init ? { ...params.init } : void 0
  );
  const visited = /* @__PURE__ */ new Set([getRedirectVisitKey(currentUrl, currentInit)]);
  let redirectCount = 0;
  while (true) {
    let parsedUrl;
    try {
      parsedUrl = new URL(currentUrl);
    } catch {
      await release();
      throw new Error("Invalid URL: must be http or https");
    }
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      await release();
      throw new Error("Invalid URL: must be http or https");
    }
    if (params.requireHttps === true && parsedUrl.protocol !== "https:") {
      await release();
      throw new Error("URL must use https");
    }
    let dispatcher = null;
    const policyForUrl = resolveSsrFPolicyForUrl(parsedUrl, params.policy);
    const dispatcherPolicy = params.resolveDispatcherPolicy?.(parsedUrl) ?? params.dispatcherPolicy;
    const resolvePinnedHostname = async () => await runAbortablePreflight(
      async () => await resolvePinnedHostnameWithPolicy(parsedUrl.hostname, {
        lookupFn: params.lookupFn,
        policy: policyForUrl
      }),
      signal
    );
    try {
      const usesTrustedExplicitProxyMode = mode === GUARDED_FETCH_MODE.TRUSTED_EXPLICIT_PROXY && dispatcherPolicy?.mode === "explicit-proxy";
      assertExplicitProxySupportsPinnedDns(
        parsedUrl,
        dispatcherPolicy,
        usesTrustedExplicitProxyMode ? false : params.pinDns
      );
      await assertExplicitProxyAllowed(dispatcherPolicy, params.lookupFn, params.policy, signal);
      const isStrictManagedProxyActive = mode === GUARDED_FETCH_MODE.STRICT && isManagedProxyActive();
      const shouldCheckManagedProxyBypass = isStrictManagedProxyActive && shouldResolveConfiguredLocalOriginManagedProxyBypass({
        url: parsedUrl,
        managedProxyBypass: params.managedProxyBypass
      });
      const canUseManagedProxy = isStrictManagedProxyActive && (shouldUseEnvHttpProxyForUrl(parsedUrl.toString()) || shouldCheckManagedProxyBypass);
      const canUseTrustedEnvProxy = (mode === GUARDED_FETCH_MODE.TRUSTED_ENV_PROXY || params.useEnvProxyForEligibleUrls === true && !canUseManagedProxy) && !dispatcherPolicy && shouldUseEnvHttpProxyForUrl(parsedUrl.toString());
      const canUseMockedFetchWithoutDns = isUsingMockedFetch && params.lookupFn === void 0 && !canUseTrustedEnvProxy && !canUseManagedProxy && !usesTrustedExplicitProxyMode && params.pinDns !== false;
      const timeoutMs = resolveDispatcherTimeoutMs(params.timeoutMs);
      if (canUseTrustedEnvProxy || canUseManagedProxy || params.pinDns === false) {
        assertHostnameAllowedWithPolicy(parsedUrl.hostname, policyForUrl);
      }
      if (canUseTrustedEnvProxy) {
        dispatcher = createHttp1EnvHttpProxyAgent(void 0, timeoutMs);
      } else if (canUseManagedProxy) {
        if (shouldCheckManagedProxyBypass) {
          const pinned = await resolvePinnedHostname();
          dispatcher = shouldUseConfiguredLocalOriginManagedProxyBypass({
            url: parsedUrl,
            managedProxyBypass: params.managedProxyBypass,
            resolvedAddresses: pinned.addresses
          }) ? createPinnedDispatcher(pinned, dispatcherPolicy, policyForUrl, timeoutMs) : createHttp1EnvHttpProxyAgent(void 0, timeoutMs);
        } else {
          dispatcher = createHttp1EnvHttpProxyAgent(void 0, timeoutMs);
        }
      } else if (usesTrustedExplicitProxyMode) {
        assertHostnameAllowedWithPolicy(parsedUrl.hostname, policyForUrl);
        dispatcher = createPolicyDispatcherWithoutPinnedDns(dispatcherPolicy, timeoutMs);
      } else if (canUseMockedFetchWithoutDns) {
        assertHostnameAllowedWithPolicy(parsedUrl.hostname, policyForUrl);
      } else if (params.pinDns === false) {
        await resolvePinnedHostname();
        dispatcher = createPolicyDispatcherWithoutPinnedDns(dispatcherPolicy, timeoutMs);
      } else {
        const pinned = await resolvePinnedHostname();
        dispatcher = createPinnedDispatcher(pinned, dispatcherPolicy, policyForUrl, timeoutMs);
      }
      const init = {
        ...currentInit ? { ...currentInit } : {},
        redirect: "manual",
        ...dispatcher ? { dispatcher } : {},
        ...signal ? { signal } : {}
      };
      const supportsDispatcherInit = params.fetchImpl !== void 0 && !isAmbientGlobalFetch({
        fetchImpl: params.fetchImpl,
        globalFetch: globalThis.fetch
      }) || isUsingMockedFetch;
      const shouldUseRuntimeFetch = Boolean(dispatcher) && !supportsDispatcherInit;
      const response = shouldUseRuntimeFetch ? await fetchWithRuntimeDispatcher(parsedUrl.toString(), init) : await defaultFetch(parsedUrl.toString(), init);
      const capturedByGlobalFetchPatch = !shouldUseRuntimeFetch && isAmbientGlobalFetch({
        fetchImpl: defaultFetch,
        globalFetch: globalThis.fetch
      });
      await captureGuardedFetchExchange({
        url: parsedUrl.toString(),
        method: currentInit?.method ?? "GET",
        requestHeaders: currentInit?.headers,
        requestBody: currentInit?.body ?? null,
        response,
        transport: "http",
        capture: params.capture,
        auditContext: params.auditContext,
        capturedByGlobalFetchPatch
      });
      if (isRedirectStatus(response.status)) {
        const location = response.headers.get("location");
        if (!location) {
          await release(dispatcher);
          throw new Error(`Redirect missing location header (${response.status})`);
        }
        redirectCount += 1;
        if (redirectCount > maxRedirects) {
          await release(dispatcher);
          throw new Error(`Too many redirects (limit: ${maxRedirects})`);
        }
        const nextParsedUrl = new URL(location, parsedUrl);
        const nextUrl = nextParsedUrl.toString();
        const retainedAuthorization = resolveRetainedAuthorizationForRedirect({
          init: currentInit,
          nextUrl: nextParsedUrl,
          hostnameAllowlist: params.retainAuthorizationRedirectHostnameAllowlist
        });
        currentInit = rewriteRedirectInitForMethod({ init: currentInit, status: response.status });
        if (nextParsedUrl.origin !== parsedUrl.origin) {
          currentInit = rewriteRedirectInitForCrossOrigin({
            init: currentInit,
            allowUnsafeReplay: params.allowCrossOriginUnsafeRedirectReplay === true
          });
          currentInit = retainSafeHeadersForCrossOriginRedirect2(currentInit);
          currentInit = restoreRedirectAuthorization({
            init: currentInit,
            authorization: retainedAuthorization
          });
        }
        const nextVisitKey = getRedirectVisitKey(nextUrl, currentInit);
        if (visited.has(nextVisitKey)) {
          await release(dispatcher);
          throw new Error("Redirect loop detected");
        }
        visited.add(nextVisitKey);
        void response.body?.cancel().catch(() => void 0);
        await closeDispatcher(dispatcher);
        currentUrl = nextUrl;
        continue;
      }
      return {
        response,
        finalUrl: currentUrl,
        release: async () => release(dispatcher),
        refreshTimeout: refresh
      };
    } catch (err) {
      if (err instanceof SsrFBlockedError) {
        const context = params.auditContext ?? "url-fetch";
        logWarn(
          `security: blocked URL fetch (${context}) targetOrigin=${parsedUrl.origin} reason=${err.message}`
        );
      }
      await release(dispatcher);
      throw err;
    }
  }
}

// packages/memory-host-sdk/src/host/remote-http.ts
var MEMORY_REMOTE_TRUSTED_ENV_PROXY_MODE = "trusted_env_proxy";
async function withRemoteHttpResponse(params) {
  const guardedFetch = params.fetchWithSsrFGuardImpl ?? fetchWithSsrFGuard;
  const shouldUseEnvProxy = params.shouldUseEnvHttpProxyForUrlImpl ?? shouldUseEnvHttpProxyForUrl;
  const { response, release } = await guardedFetch({
    url: params.url,
    fetchImpl: params.fetchImpl,
    init: params.init,
    signal: params.signal,
    policy: params.ssrfPolicy,
    auditContext: params.auditContext ?? "memory-remote",
    ...shouldUseEnvProxy(params.url) ? { mode: MEMORY_REMOTE_TRUSTED_ENV_PROXY_MODE } : {}
  });
  try {
    return await params.onResponse(response);
  } finally {
    await release();
  }
}

// packages/memory-host-sdk/src/host/response-snippet.ts
init_src();
init_utf16_slice();
var DEFAULT_ERROR_BODY_MAX_BYTES = 8 * 1024;
var DEFAULT_ERROR_BODY_MAX_CHARS = 1e3;
var DEFAULT_JSON_BODY_MAX_BYTES = 64 * 1024 * 1024;
var TRUNCATED_SUFFIX = "... [truncated]";
async function readMemoryHostResponseTextSnippet(res, options = {}) {
  const maxBytes = options.maxBytes ?? DEFAULT_ERROR_BODY_MAX_BYTES;
  const maxChars = options.maxChars ?? DEFAULT_ERROR_BODY_MAX_CHARS;
  const prefix = await readResponsePrefix(res, maxBytes, options.signal);
  if (prefix.length === 0) {
    return "";
  }
  const text = decodeTextPrefix(joinChunks(prefix.bytes, prefix.length), {
    truncated: prefix.truncated
  });
  const collapsed = text.replace(/\s+/g, " ").trim();
  if (!collapsed) {
    return "";
  }
  if (prefix.truncated || collapsed.length > maxChars) {
    return `${truncateUtf16Safe(collapsed, maxChars)}${TRUNCATED_SUFFIX}`;
  }
  return collapsed;
}
async function readResponseJsonWithLimit(res, options) {
  const maxBytes = options.maxBytes ?? DEFAULT_JSON_BODY_MAX_BYTES;
  const contentLength = parseContentLength(res.headers.get("content-length"), options.errorPrefix);
  if (typeof contentLength === "number" && contentLength > maxBytes) {
    await cancelResponseBody(res);
    throw responseTooLarge(options.errorPrefix, contentLength, maxBytes);
  }
  const text = await readResponseTextWithLimit(res, maxBytes, options.errorPrefix, options.signal);
  try {
    return JSON.parse(text);
  } catch (cause) {
    throw new Error(`${options.errorPrefix}: malformed JSON response`, { cause });
  }
}
function toAbortError(signal, fallbackMessage) {
  return signal.reason instanceof Error ? signal.reason : new Error(fallbackMessage);
}
async function readChunkWithAbort(reader, signal, fallbackMessage) {
  if (!signal) {
    return await reader.read();
  }
  if (signal.aborted) {
    await reader.cancel().catch(() => void 0);
    throw toAbortError(signal, fallbackMessage);
  }
  let removeAbortListener;
  const abortPromise = new Promise((_resolve, reject) => {
    const onAbort = () => {
      void reader.cancel().catch(() => void 0);
      reject(toAbortError(signal, fallbackMessage));
    };
    signal.addEventListener("abort", onAbort, { once: true });
    removeAbortListener = () => signal.removeEventListener("abort", onAbort);
  });
  try {
    return await Promise.race([reader.read(), abortPromise]);
  } finally {
    removeAbortListener?.();
  }
}
async function readResponsePrefix(res, maxBytes, signal) {
  const body = res.body;
  if (!body || typeof body.getReader !== "function") {
    return { bytes: [], length: 0, truncated: false };
  }
  const reader = body.getReader();
  const chunks = [];
  let length = 0;
  let truncated = false;
  try {
    while (true) {
      const { done, value } = await readChunkWithAbort(
        reader,
        signal,
        "Response snippet body read aborted"
      );
      if (done) {
        break;
      }
      if (!value?.length) {
        continue;
      }
      const remaining = maxBytes - length;
      if (value.length >= remaining) {
        if (remaining > 0) {
          chunks.push(value.subarray(0, remaining));
          length += remaining;
        }
        truncated = true;
        await reader.cancel().catch(() => void 0);
        break;
      }
      chunks.push(value);
      length += value.length;
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
    }
  }
  return { bytes: chunks, length, truncated };
}
async function readResponseTextWithLimit(res, maxBytes, errorPrefix, signal) {
  const body = res.body;
  if (!body || typeof body.getReader !== "function") {
    return "";
  }
  const reader = body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await readChunkWithAbort(
        reader,
        signal,
        `${errorPrefix}: response body read aborted`
      );
      if (done) {
        break;
      }
      if (!value?.length) {
        continue;
      }
      const nextLength = length + value.length;
      if (nextLength > maxBytes) {
        await reader.cancel().catch(() => void 0);
        throw responseTooLarge(errorPrefix, nextLength, maxBytes);
      }
      chunks.push(value);
      length = nextLength;
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
    }
  }
  return new TextDecoder().decode(joinChunks(chunks, length));
}
async function cancelResponseBody(res) {
  const body = res.body;
  if (!body || typeof body.cancel !== "function") {
    return;
  }
  await body.cancel().catch(() => void 0);
}
function parseContentLength(raw, errorPrefix) {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return void 0;
  }
  if (!/^\d+$/.test(trimmed)) {
    throw new Error(`${errorPrefix}: invalid content-length header: ${raw}`);
  }
  const value = Number(trimmed);
  if (!Number.isSafeInteger(value)) {
    throw new Error(`${errorPrefix}: invalid content-length header: ${raw}`);
  }
  return value;
}
function responseTooLarge(errorPrefix, size, maxBytes) {
  return new Error(responseTooLargeMessage(errorPrefix, size, maxBytes));
}
function responseTooLargeMessage(errorPrefix, size, maxBytes) {
  return `${errorPrefix}: response body too large: ${size} bytes (limit: ${maxBytes} bytes)`;
}
function joinChunks(chunks, length) {
  if (chunks.length === 1 && chunks[0]?.length === length) {
    return chunks[0];
  }
  const joined = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    joined.set(chunk, offset);
    offset += chunk.length;
  }
  return joined;
}

// packages/memory-host-sdk/src/host/batch-upload.ts
async function uploadBatchJsonlFile(params) {
  const baseUrl = normalizeBatchBaseUrl(params.client);
  const jsonl = params.requests.map((request) => JSON.stringify(request)).join("\n");
  const form = new FormData();
  form.append("purpose", "batch");
  form.append(
    "file",
    new Blob([jsonl], { type: "application/jsonl" }),
    `memory-embeddings.${hashText(String(Date.now()))}.jsonl`
  );
  const filePayload = await withRemoteHttpResponse({
    url: `${baseUrl}/files`,
    ssrfPolicy: params.client.ssrfPolicy,
    fetchImpl: params.client.fetchImpl,
    signal: params.signal,
    init: {
      method: "POST",
      headers: buildBatchHeaders(params.client, { json: false }),
      body: form
    },
    onResponse: async (fileRes) => {
      if (!fileRes.ok) {
        const text = await readMemoryHostResponseTextSnippet(fileRes, { signal: params.signal });
        throw new Error(`${params.errorPrefix}: ${fileRes.status} ${text}`);
      }
      return await readResponseJsonWithLimit(fileRes, {
        errorPrefix: params.errorPrefix,
        maxBytes: params.maxResponseBytes,
        signal: params.signal
      });
    }
  });
  if (!filePayload.id) {
    throw new Error(`${params.errorPrefix}: missing file id`);
  }
  return filePayload.id;
}
export {
  uploadBatchJsonlFile
};
