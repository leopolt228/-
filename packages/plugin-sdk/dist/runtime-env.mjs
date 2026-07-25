// packages/plugin-sdk/src/runtime-env.ts
import { AsyncLocalStorage } from "node:async_hooks";
import os from "node:os";
import path from "node:path";
import { configureFsSafePython } from "@openclaw/fs-safe/config";
import {
  appendRegularFileSync
} from "@openclaw/fs-safe/advanced";
import fs from "node:fs";
import { tmpdir as getOsTmpDir } from "node:os";
import path2 from "node:path";
import path3 from "node:path";
import fs2 from "node:fs";
import os2 from "node:os";
import path4 from "node:path";
import fs3 from "node:fs";
import JSON5 from "json5";
import { randomUUID } from "node:crypto";
import fs4 from "node:fs";
import os3 from "node:os";
import path5 from "node:path";
import { Logger as TsLogger } from "tslog";
import { Chalk as Chalk2 } from "chalk";
import chalk, { Chalk } from "chalk";
import prettyMilliseconds2 from "pretty-ms";
import "pretty-ms";
import { randomBytes } from "node:crypto";
import { isProxylineDispatcher } from "@openclaw/proxyline/dispatcher-brand";
import { readFileSync } from "node:fs";
import * as net from "node:net";
import { readFileSync as readFileSync2 } from "node:fs";
import { createRequire } from "node:module";
import net2 from "node:net";
import { EventEmitter } from "node:events";
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
function createNonExitingRuntime() {
  return {
    ...createRuntimeIo(),
    exit: (code, _opts) => {
      throw new ExitError(code);
    }
  };
}
var defaultRuntime;
var ExitError;
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
    ExitError = class extends Error {
      constructor(code, message) {
        super(message ?? `exit ${code}`);
        this.code = code;
        this.name = "ExitError";
      }
    };
  }
});
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
var init_boolean_coercion = __esm({
  "packages/normalization-core/src/boolean-coercion.ts"() {
    "use strict";
  }
});
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
var init_error_coercion = __esm({
  "packages/normalization-core/src/error-coercion.ts"() {
    "use strict";
  }
});
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
var init_format = __esm({
  "packages/normalization-core/src/format.ts"() {
    "use strict";
    init_expect();
  }
});
var init_json_coercion = __esm({
  "packages/normalization-core/src/json-coercion.ts"() {
    "use strict";
  }
});
function asFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function resolveTimerTimeoutMs(valueMs, fallbackMs, minMs = 1) {
  const value = asFiniteNumber(valueMs) ?? asFiniteNumber(fallbackMs);
  const min = Math.max(0, Math.floor(minMs));
  if (value === void 0) {
    return min;
  }
  return Math.min(Math.max(Math.floor(value), min), MAX_TIMER_TIMEOUT_MS);
}
function resolveIntegerOption(value, fallback, range = {}) {
  const candidate = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  const floored = Math.floor(candidate);
  const minBounded = range.min === void 0 ? floored : Math.max(range.min, floored);
  return range.max === void 0 ? minBounded : Math.min(range.max, minBounded);
}
var MAX_TIMER_TIMEOUT_MS;
var MAX_TIMER_TIMEOUT_SECONDS;
var init_number_coercion = __esm({
  "packages/normalization-core/src/number-coercion.ts"() {
    "use strict";
    MAX_TIMER_TIMEOUT_MS = 2147e6;
    MAX_TIMER_TIMEOUT_SECONDS = Math.floor(MAX_TIMER_TIMEOUT_MS / 1e3);
  }
});
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
var init_record_coerce = __esm({
  "packages/normalization-core/src/record-coerce.ts"() {
    "use strict";
  }
});
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
var init_string_normalization = __esm({
  "packages/normalization-core/src/string-normalization.ts"() {
    "use strict";
    init_string_coerce();
  }
});
var init_text_decoding = __esm({
  "packages/normalization-core/src/text-decoding.ts"() {
    "use strict";
  }
});
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
var init_diagnostic_event_listener_presence = __esm({
  "src/infra/diagnostic-event-listener-presence.ts"() {
    "use strict";
  }
});
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
var TRACE_ID_RE;
var SPAN_ID_RE;
var TRACE_FLAGS_RE;
var DIAGNOSTIC_TRACE_SCOPE_STATE_KEY;
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
var MAX_ASYNC_DIAGNOSTIC_EVENTS;
var MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN;
var DIAGNOSTIC_EVENTS_STATE_KEY;
var dispatchedTrustedDiagnosticMetadata;
var ASYNC_DIAGNOSTIC_EVENT_TYPES;
var PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES;
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
var init_regular_file = __esm({
  "src/infra/regular-file.ts"() {
    "use strict";
    init_fs_safe_defaults();
  }
});
function isNodeErrorWithCode(err, code) {
  return typeof err === "object" && err !== null && "code" in err && err.code === code;
}
function resolvePreferredOpenClawTmpDir(options = {}) {
  const accessMode = fs.constants.W_OK | fs.constants.X_OK;
  const accessSync = options.accessSync ?? fs.accessSync;
  const chmodSync = options.chmodSync ?? fs.chmodSync;
  const lstatSync = options.lstatSync ?? fs.lstatSync;
  const mkdirSync = options.mkdirSync ?? fs.mkdirSync;
  const warn3 = options.warn ?? ((message) => console.warn(message));
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
        chmodSync(candidatePath, 448);
      } catch (chmodErr) {
        if (isNodeErrorWithCode(chmodErr, "EPERM") || isNodeErrorWithCode(chmodErr, "EACCES") || isNodeErrorWithCode(chmodErr, "ENOENT")) {
          return resolveDirState(candidatePath) === "available";
        }
        throw chmodErr;
      }
      warn3(`[openclaw] tightened permissions on temp dir: ${candidatePath}`);
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
      mkdirSync(fallbackPath, { recursive: true, mode: 448 });
      chmodSync(fallbackPath, 448);
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
    mkdirSync(preferredDir, { recursive: true, mode: 448 });
    chmodSync(preferredDir, 448);
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
var init_runtime_binary = __esm({
  "src/daemon/runtime-binary.ts"() {
    "use strict";
    init_string_coerce();
  }
});
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
var FLAG_TERMINATOR;
var ROOT_BOOLEAN_FLAGS;
var ROOT_VALUE_FLAGS;
var init_cli_root_options = __esm({
  "src/infra/cli-root-options.ts"() {
    "use strict";
    FLAG_TERMINATOR = "--";
    ROOT_BOOLEAN_FLAGS = /* @__PURE__ */ new Set(["--dev", "--no-color"]);
    ROOT_VALUE_FLAGS = /* @__PURE__ */ new Set(["--profile", "--log-level", "--container"]);
  }
});
var init_parse_finite_number = __esm({
  "src/infra/parse-finite-number.ts"() {
    "use strict";
    init_number_coercion();
  }
});
var ANSI_OSC_INTRODUCER_PATTERN;
var ANSI_STRING_TERMINATOR_PATTERN;
var ANSI_OSC_PATTERN;
var ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN;
var ansiOscAtIndexRegex;
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
var ANSI_OSC_SEQUENCE_PATTERN;
var ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX;
var graphemeSegmenter;
var rgiEmojiPattern;
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
var coreCliCommandCatalog;
var CORE_CLI_COMMAND_DESCRIPTORS;
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
var init_openclaw_root_fs_runtime = __esm({
  "src/infra/openclaw-root.fs.runtime.ts"() {
    "use strict";
  }
});
var init_openclaw_root = __esm({
  "src/infra/openclaw-root.ts"() {
    "use strict";
    init_openclaw_root_fs_runtime();
  }
});
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
function filterPrivateQaItems(items, getName) {
  if (isPrivateQaCliEnabled()) {
    return items;
  }
  return items.filter((item) => getName(item) !== "qa");
}
var subCliCommandCatalog;
var SUB_CLI_DESCRIPTORS;
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
function getCommandPathWithRootOptions(argv, depth = 2) {
  return getCommandPathInternal(argv, depth, { skipRootOptions: true });
}
function getCommandPathInternal(argv, depth, opts) {
  const args = argv.slice(2);
  const path6 = [];
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
    path6.push(arg);
    if (path6.length >= depth) {
      break;
    }
  }
  return path6;
}
var ROOT_COMMAND_DESCRIPTORS;
var KNOWN_ROOT_COMMANDS;
var ROOT_COMMANDS_WITH_SUBCOMMANDS;
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
var init_tcp_port = __esm({
  "src/infra/tcp-port.ts"() {
    "use strict";
    init_parse_finite_number();
  }
});
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
var isNixMode;
var LEGACY_STATE_DIRNAMES;
var NEW_STATE_DIRNAME;
var CONFIG_FILENAME;
var LEGACY_CONFIG_FILENAMES;
var STATE_DIR;
var CONFIG_PATH;
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
var LOGGING_STATE_KEY;
var globalStore;
var loggingState;
var init_state = __esm({
  "src/logging/state.ts"() {
    "use strict";
    LOGGING_STATE_KEY = /* @__PURE__ */ Symbol.for("openclaw.loggingState");
    globalStore = globalThis;
    loggingState = globalStore[LOGGING_STATE_KEY] ?? createLoggingState();
    globalStore[LOGGING_STATE_KEY] = loggingState;
  }
});
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
var LOG_PREFIX;
var LOG_SUFFIX;
var init_log_file_shared = __esm({
  "src/logging/log-file-shared.ts"() {
    "use strict";
    LOG_PREFIX = "openclaw";
    LOG_SUFFIX = ".log";
  }
});
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
var HTTP_AUTH_SCHEME_PATTERN;
var HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN;
var HTTP_AUTH_SERIALIZED_TAB_PATTERN;
var HTTP_AUTH_SERIALIZED_INDENT_PATTERN;
var HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN;
var HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN;
var HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN;
var HTTP_AUTH_HEADER_BOUNDARY_PATTERN;
var HTTP_AUTH_SERIALIZED_QUOTE_PATTERN;
var CREDENTIAL_STYLE_HEADER_REDACT_PATTERN;
var STRUCTURED_AUTH_HEADER_RE;
var AUTH_PARAM_NAME_RE;
var AUTH_PARAM_TOKEN_RE;
var AWS_SCOPE_VALUE_RE;
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
var STRUCTURED_AUTH_MARKER_PREFIX;
var SECRET_PATTERNS;
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
var init_meta = __esm({
  "packages/acp-core/src/meta.ts"() {
    "use strict";
    init_string_coerce();
  }
});
var init_normalize_text = __esm({
  "packages/acp-core/src/normalize-text.ts"() {
    "use strict";
    init_string_coerce();
  }
});
function resolveIntegerOption2(value, fallback, params) {
  return resolveIntegerOption(value, fallback, params);
}
var init_numeric_options = __esm({
  "packages/acp-core/src/numeric-options.ts"() {
    "use strict";
    init_number_coercion();
  }
});
var init_record_shared = __esm({
  "packages/acp-core/src/record-shared.ts"() {
    "use strict";
    init_record_coerce();
  }
});
var init_session_interaction_mode = __esm({
  "packages/acp-core/src/session-interaction-mode.ts"() {
    "use strict";
    init_string_coerce();
  }
});
var init_session_lineage_meta = __esm({
  "packages/acp-core/src/session-lineage-meta.ts"() {
    "use strict";
    init_string_coerce();
  }
});
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
var DEFAULT_MAX_SESSIONS;
var DEFAULT_IDLE_TTL_MS;
var defaultAcpSessionStore;
var init_session = __esm({
  "packages/acp-core/src/session.ts"() {
    "use strict";
    init_numeric_options();
    DEFAULT_MAX_SESSIONS = 5e3;
    DEFAULT_IDLE_TTL_MS = 24 * 60 * 60 * 1e3;
    defaultAcpSessionStore = createInMemorySessionStore();
  }
});
var init_types = __esm({
  "packages/acp-core/src/types.ts"() {
    "use strict";
    init_string_coerce();
  }
});
var ACP_ERROR_CODES;
var ACP_ERROR_CODE_SET;
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
var init_error_text = __esm({
  "packages/acp-core/src/runtime/error-text.ts"() {
    "use strict";
    init_errors();
  }
});
var init_session_identity = __esm({
  "packages/acp-core/src/runtime/session-identity.ts"() {
    "use strict";
    init_normalize_text();
  }
});
var init_session_identifiers = __esm({
  "packages/acp-core/src/runtime/session-identifiers.ts"() {
    "use strict";
    init_string_coerce();
    init_normalize_text();
    init_session_identity();
  }
});
var init_types2 = __esm({
  "packages/acp-core/src/runtime/types.ts"() {
    "use strict";
  }
});
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
var SAFE_REGEX_CACHE_MAX;
var safeRegexCache;
var init_safe_regex = __esm({
  "src/security/safe-regex.ts"() {
    "use strict";
    init_src();
    SAFE_REGEX_CACHE_MAX = 256;
    safeRegexCache = /* @__PURE__ */ new Map();
  }
});
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
var REDACT_REGEX_CHUNK_THRESHOLD;
var REDACT_REGEX_CHUNK_SIZE;
var init_redact_bounded = __esm({
  "src/logging/redact-bounded.ts"() {
    "use strict";
    REDACT_REGEX_CHUNK_THRESHOLD = 32768;
    REDACT_REGEX_CHUNK_SIZE = 16384;
  }
});
var init_redact_internal_state = __esm({
  "src/logging/redact-internal-state.ts"() {
    "use strict";
  }
});
var init_redact_internal = __esm({
  "src/logging/redact-internal.ts"() {
    "use strict";
    init_redact_internal_state();
  }
});
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function rebuildProbe() {
  firstChars = new Set([...registeredValues.keys()].map((value) => value.charAt(0)));
  compiledMatcher = void 0;
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
var registeredValues;
var compiledMatcher;
var firstChars;
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
function redactSensitiveFieldValueWithOptions(key, value, options, path6 = [key]) {
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
  if (shouldRedactStructuredAuthorizationCode(normalizedStructuredKey, path6)) {
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
function pathEndsWith(path6, suffix) {
  if (path6.length < suffix.length) {
    return false;
  }
  return suffix.every((part, index) => path6[path6.length - suffix.length + index] === part);
}
function shouldRedactStructuredAuthorizationCode(normalizedKey, path6) {
  if (normalizedKey !== "code") {
    return false;
  }
  const normalizedPath = path6.map((part) => part.toLowerCase());
  if (normalizedPath.length === 1 || pathEndsWith(normalizedPath, ["error", "code"]) || pathEndsWith(normalizedPath, ["nodeerror", "code"]) || pathEndsWith(normalizedPath, ["status", "code"]) || pathEndsWith(normalizedPath, ["details", "code"]) || pathEndsWith(normalizedPath, ["warnings", "code"])) {
    return false;
  }
  return true;
}
function shouldRedactStructuredPrimitiveField(key, path6) {
  const normalizedKey = key.toLowerCase();
  return shouldRedactStructuredAuthorizationCode(normalizedKey, path6) || isSensitiveFieldKey(key);
}
function isPlainRedactableObject(value) {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function redactStructuredSecretValue(key, value, seen, options, path6 = key ? [key] : []) {
  if (typeof value === "string") {
    return redactSensitiveFieldValueWithOptions(key, value, options, path6);
  }
  if (value === null || value === void 0) {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return shouldRedactStructuredPrimitiveField(key, path6) ? "***" : value;
  }
  if (Array.isArray(value)) {
    if (seen.has(value)) {
      return "[Circular]";
    }
    seen.add(value);
    const out = value.map((entry) => redactStructuredSecretValue(key, entry, seen, options, path6));
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
        ...path6,
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
var DEFAULT_REDACT_MODE;
var DEFAULT_REDACT_MIN_LENGTH;
var DEFAULT_REDACT_KEEP_START;
var DEFAULT_REDACT_KEEP_END;
var PAYMENT_CREDENTIAL_ENV_KEYS;
var PAYMENT_CREDENTIAL_QUERY_KEYS;
var AUTH_QUERY_KEYS;
var FORM_BODY_FIRST_PAIR_KEYS;
var STANDALONE_ASSIGNMENT_SECRET_KEYS;
var BODY_SECRET_KEYS;
var FORM_BODY_KEY_INVISIBLE_CHARS;
var FORM_BODY_KEY_OBFUSCATION_RE;
var FORM_BODY_KEY_SEPARATOR_RE;
var FORM_BODY_PERCENT_ESCAPE_RE;
var FORM_BODY_KEY;
var FORM_BODY_VALUE;
var URL_QUERY_VALUE;
var FORM_BODY_PAIR;
var FORM_BODY_RE;
var FORM_BODY_SUBSTRING_RE;
var ENCODED_FORM_PAIR_RE;
var FORM_BODY_CONTEXT_SINGLE_PAIR_RE;
var URL_QUERY_PAIR_RE;
var SECRET_VALUE_TRAILING_DELIMITER_RE;
var SECRET_VALUE_SUFFIX_RE;
var SECRET_VALUE_QUOTE_CHARS;
var FORM_BODY_LINE_BREAK_SPLIT_RE;
var FORM_BODY_LINE_BREAK_SEGMENT_RE;
var PAYMENT_CREDENTIAL_JSON_KEYS;
var STRUCTURED_SECRET_FIELD_RE;
var STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE;
var STRUCTURED_APP_PASSWORD_FIELD_RE;
var APP_SPECIFIC_PASSWORD_RE;
var BENIGN_APP_PASSWORD_WORDS;
var STRUCTURED_SECRET_ENV_FIELD_RE;
var ENV_ASSIGNMENT_REDACT_PATTERN;
var ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN;
var STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN;
var STANDALONE_ASSIGNMENT_REDACT_PATTERN;
var BASE64_SAFE_TOKEN_BOUNDARY;
var IDENTIFIER_SAFE_TOKEN_BOUNDARY;
var TELEGRAM_BOT_TOKEN_REDACT_PATTERN;
var TELEGRAM_TOKEN_REDACT_PATTERN;
var HTTP_AUTH_HEADER_REDACT_PATTERNS;
var AUTHORIZATION_BEARER_REDACT_PATTERN;
var AUTHORIZATION_BASIC_REDACT_PATTERN;
var AUTHORIZATION_BOT_REDACT_PATTERN;
var STANDALONE_BEARER_REDACT_PATTERN;
var SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES;
var CHUNK_UNSAFE_PATTERN_SOURCES;
var shellReferencePreservingPatterns;
var chunkUnsafePatterns;
var DEFAULT_REDACT_PATTERNS;
var defaultResolvedPatterns;
var DEFAULT_REDACT_PREFILTER_SOURCES;
var DEFAULT_REDACT_PREFILTER_RE;
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
var validTimeZoneCache;
var timestampFormatterCache;
var hostTimeZone;
var init_timestamps = __esm({
  "src/logging/timestamps.ts"() {
    "use strict";
    validTimeZoneCache = /* @__PURE__ */ new Map();
    timestampFormatterCache = /* @__PURE__ */ new Map();
  }
});
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
function toPinoLikeLogger(logger, level) {
  const buildChild = (bindings) => toPinoLikeLogger(
    logger.getSubLogger({
      name: bindings ? JSON.stringify(bindings) : void 0,
      minLevel: logger.settings.minLevel
    }),
    level
  );
  return {
    level,
    child: buildChild,
    trace: (...args) => logger.trace(...args),
    debug: (...args) => logger.debug(...args),
    info: (...args) => logger.info(...args),
    warn: (...args) => logger.warn(...args),
    error: (...args) => logger.error(...args),
    fatal: (...args) => logger.fatal(...args)
  };
}
function setLoggerOverride(settings) {
  loggingState.overrideSettings = settings;
  loggingState.cachedLogger = null;
  loggingState.cachedSettings = null;
  loggingState.cachedConsoleSettings = null;
}
function resetLogger() {
  loggingState.cachedLogger = null;
  loggingState.cachedSettings = null;
  loggingState.cachedConsoleSettings = null;
  loggingState.overrideSettings = null;
  loadLoggerConfig = loadLoggerConfigDefault;
  hostnameResolver = defaultHostnameResolver;
  cachedHostname = null;
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
var DEFAULT_LOG_DIR;
var DEFAULT_LOG_FILE;
var MAX_LOG_AGE_MS;
var DEFAULT_MAX_LOG_FILE_BYTES;
var MAX_ROTATED_LOG_FILES;
var MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS;
var MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS;
var loadLoggerConfigDefault;
var loadLoggerConfig;
var MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT;
var MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS;
var MAX_DIAGNOSTIC_LOG_NAME_CHARS;
var MAX_FILE_LOG_MESSAGE_CHARS;
var MAX_FILE_LOG_CONTEXT_VALUE_CHARS;
var DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE;
var defaultHostnameResolver;
var hostnameResolver;
var cachedHostname;
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
var loadConfigFallbackDefault;
var loadConfigFallback;
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
var subsystem_exports = {};
__export(subsystem_exports, {
  createSubsystemLogger: () => createSubsystemLogger,
  createSubsystemRuntime: () => createSubsystemRuntime,
  runtimeForLogger: () => runtimeForLogger,
  stripRedundantSubsystemPrefixForConsole: () => stripRedundantSubsystemPrefixForConsole
});
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
function formatRuntimeArg(arg) {
  if (typeof arg === "string") {
    return arg;
  }
  if (inspectValue) {
    return inspectValue(arg);
  }
  try {
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
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
function runtimeForLogger(logger, exit = defaultRuntime.exit) {
  return {
    log(...args) {
      logger.info(
        args.map((arg) => formatRuntimeArg(arg)).join(" ").trim()
      );
    },
    error(...args) {
      logger.error(
        args.map((arg) => formatRuntimeArg(arg)).join(" ").trim()
      );
    },
    writeStdout(value) {
      logger.info(value);
    },
    writeJson(value, space = 2) {
      logger.info(JSON.stringify(value, null, space > 0 ? space : void 0));
    },
    exit
  };
}
function createSubsystemRuntime(subsystem, exit = defaultRuntime.exit) {
  return runtimeForLogger(createSubsystemLogger(subsystem), exit);
}
var inspectValue;
var SUBSYSTEM_COLORS;
var SUBSYSTEM_COLOR_OVERRIDES;
var SUBSYSTEM_PREFIXES_TO_DROP;
var SUBSYSTEM_MAX_SEGMENTS;
var CHANNEL_SUBSYSTEM_PREFIXES;
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
init_runtime();
init_global_state();
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
init_global_state();
init_logger();
function shouldLogVerbose() {
  return isVerbose() || isFileLogLevelEnabled("debug");
}
function logVerbose(message) {
  if (!shouldLogVerbose()) {
    return;
  }
  try {
    getLogger().debug({ message }, "verbose");
  } catch {
  }
  if (!isVerbose()) {
    return;
  }
  console.log(theme.muted(message));
}
var success = theme.success;
var warn = theme.warn;
var info = theme.info;
var danger = theme.error;
init_number_coercion();
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, resolveTimerTimeoutMs(ms, 0, 0));
  });
}
init_string_coerce();
init_utf16_slice();
function createLazyPromiseLoader(load, options = {}) {
  let promise;
  const createPromise = () => {
    const loaded = Promise.resolve().then(load);
    if (options.cacheRejections !== true) {
      void loaded.catch(() => {
        if (promise === loaded) {
          promise = void 0;
        }
      });
    }
    return loaded;
  };
  return {
    load() {
      promise ??= createPromise();
      return promise;
    },
    peek() {
      return promise;
    },
    clear() {
      promise = void 0;
    }
  };
}
function createLazyPromise(load, options) {
  const loader = createLazyPromiseLoader(load, options);
  return () => loader.load();
}
var loadLog = createLazyPromise(
  () => Promise.resolve().then(() => (init_subsystem(), subsystem_exports)).then(
    ({ createSubsystemLogger: createSubsystemLogger2 }) => createSubsystemLogger2("env")
  ),
  { cacheRejections: true }
);
function isTruthyEnvValue(value) {
  if (typeof value !== "string") {
    return false;
  }
  switch (normalizeLowercaseStringOrEmpty(value)) {
    case "1":
    case "on":
    case "true":
    case "yes":
      return true;
    default:
      return false;
  }
}
init_console();
init_levels();
init_logger();
init_subsystem();
async function waitForAbortSignal(signal) {
  if (!signal || signal.aborted) {
    return;
  }
  await new Promise((resolve) => {
    const onAbort = () => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}
var MAX_TIMER_TIMEOUT_MS2 = 2147e6;
function computeBackoff(policy, attempt) {
  const base = Math.min(policy.maxMs, policy.initialMs * policy.factor ** Math.max(attempt - 1, 0));
  const jitter = base * policy.jitter * Math.random();
  return Math.min(policy.maxMs, Math.round(base + jitter));
}
async function sleepWithAbort(ms, abortSignal, options = {}) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return;
  }
  const delayMs = Math.min(Math.max(Math.floor(ms), 1), MAX_TIMER_TIMEOUT_MS2);
  await new Promise((resolve, reject) => {
    let settled = false;
    let timer = null;
    const cleanup = () => abortSignal?.removeEventListener("abort", onAbort);
    const onAbort = () => {
      if (settled) {
        return;
      }
      settled = true;
      if (timer) {
        clearTimeout(timer);
      }
      timer = null;
      cleanup();
      reject(new Error("aborted", { cause: abortSignal?.reason ?? new Error("aborted") }));
    };
    abortSignal?.addEventListener("abort", onAbort, { once: true });
    if (abortSignal?.aborted) {
      onAbort();
      return;
    }
    timer = setTimeout(() => {
      settled = true;
      cleanup();
      timer = null;
      resolve();
    }, delayMs);
    if (options.ref === false) {
      timer.unref?.();
    }
    if (abortSignal?.aborted) {
      onAbort();
    }
  });
}
var DEFAULT_RETRY_CONFIG = {
  attempts: 3,
  minDelayMs: 300,
  maxDelayMs: 3e4,
  jitter: 0
};
var defaultSleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});
function asFiniteNumber2(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function clampNumber(value, fallback, min, max) {
  const next = asFiniteNumber2(value);
  if (next === void 0) {
    return fallback;
  }
  return Math.min(Math.max(next, min ?? Number.NEGATIVE_INFINITY), max ?? Number.POSITIVE_INFINITY);
}
function resolveAttemptCount(value, fallback) {
  return Math.max(1, Math.round(asFiniteNumber2(value) ?? fallback));
}
function resolveRetryDelayMs(value) {
  const finite = value === Number.POSITIVE_INFINITY ? MAX_TIMER_TIMEOUT_MS2 : asFiniteNumber2(value) ?? 0;
  return Math.min(Math.max(Math.round(finite), 0), MAX_TIMER_TIMEOUT_MS2);
}
function resolveJitterConfig(value, fallback) {
  if (value === "full") {
    return "full";
  }
  const fraction = asFiniteNumber2(value);
  return fraction === void 0 ? fallback : Math.min(Math.max(fraction, 0), 1);
}
function resolveRetryConfig(defaults = DEFAULT_RETRY_CONFIG, overrides) {
  const attempts = resolveAttemptCount(overrides?.attempts, defaults.attempts);
  const minDelayMs = resolveRetryDelayMs(
    clampNumber(overrides?.minDelayMs, defaults.minDelayMs, 0)
  );
  const maxDelayMs = Math.max(
    minDelayMs,
    resolveRetryDelayMs(clampNumber(overrides?.maxDelayMs, defaults.maxDelayMs, 0))
  );
  return {
    attempts,
    minDelayMs,
    maxDelayMs,
    jitter: resolveJitterConfig(overrides?.jitter, defaults.jitter)
  };
}
function applyJitter(delayMs, jitter, mode, random) {
  if (jitter === "full") {
    if (mode === "symmetric") {
      return Math.max(0, Math.round(delayMs * (0.5 + random() * 0.5)));
    }
    return Math.max(0, Math.ceil(delayMs * (1 + random())));
  }
  if (jitter <= 0) {
    return mode === "positive" ? Math.ceil(delayMs) : delayMs;
  }
  const fraction = random();
  const offset = mode === "positive" ? fraction * jitter : (fraction * 2 - 1) * jitter;
  const raw = delayMs * (1 + offset);
  return Math.max(0, mode === "positive" ? Math.ceil(raw) : Math.round(raw));
}
function toRetryError(value, fallbackMessage = "Non-Error thrown") {
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
function createRetryRunner(runtime = {}) {
  const runtimeSleep = runtime.sleep ?? defaultSleep;
  const runtimeRandom = runtime.random ?? Math.random;
  const createFailure = runtime.createFailure ?? ((errors) => toRetryError(errors.at(-1) ?? new Error("Retry failed")));
  return async function retryAsync3(fn, attemptsOrOptions = 3, initialDelayMs = 300) {
    const attemptErrors = [];
    if (typeof attemptsOrOptions === "number") {
      const attempts = resolveAttemptCount(attemptsOrOptions, DEFAULT_RETRY_CONFIG.attempts);
      for (let index = 0; index < attempts; index += 1) {
        try {
          return await fn();
        } catch (err) {
          attemptErrors.push(err);
          if (index === attempts - 1) {
            break;
          }
          await runtimeSleep(resolveRetryDelayMs(initialDelayMs * 2 ** index));
        }
      }
      throw createFailure(attemptErrors);
    }
    const options = attemptsOrOptions;
    const resolved = resolveRetryConfig(DEFAULT_RETRY_CONFIG, options);
    const maxAttempts = resolved.attempts;
    const minDelayMs = resolved.minDelayMs;
    const maxDelayMs = resolved.maxDelayMs > 0 ? resolved.maxDelayMs : Number.POSITIVE_INFINITY;
    const retryAfterMaxDelayMs = options.retryAfterMaxDelayMs === void 0 ? maxDelayMs : Math.max(
      minDelayMs,
      resolveRetryDelayMs(clampNumber(options.retryAfterMaxDelayMs, maxDelayMs, 0))
    );
    const random = options.random ?? runtimeRandom;
    const sleep2 = options.sleep ?? runtimeSleep;
    const shouldRetry = options.shouldRetry ?? (() => true);
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await fn();
      } catch (err) {
        attemptErrors.push(err);
        if (attempt >= maxAttempts || !shouldRetry(err, attempt)) {
          break;
        }
        const context = {
          attempt,
          maxAttempts,
          err,
          label: options.label
        };
        const retryAfterMs = options.retryAfterMs?.(err);
        const hasRetryAfter = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs);
        const configuredDelay = typeof options.delayMs === "function" ? options.delayMs(context) : options.delayMs;
        const resolvedConfiguredDelay = configuredDelay === void 0 ? void 0 : resolveRetryDelayMs(configuredDelay);
        const baseDelay = hasRetryAfter ? Math.max(retryAfterMs, minDelayMs) : resolvedConfiguredDelay === void 0 ? minDelayMs * 2 ** (attempt - 1) : Math.max(resolvedConfiguredDelay, minDelayMs);
        const delayCap = hasRetryAfter ? retryAfterMaxDelayMs : maxDelayMs;
        let delay = Math.min(baseDelay, delayCap);
        const canHonorRetryAfter = hasRetryAfter && (retryAfterMs ?? 0) <= delayCap;
        const wantsPositiveDraw = resolved.jitter === "full" ? !hasRetryAfter || canHonorRetryAfter : canHonorRetryAfter;
        delay = applyJitter(
          delay,
          resolved.jitter,
          wantsPositiveDraw ? "positive" : "symmetric",
          random
        );
        delay = Math.min(Math.max(delay, minDelayMs), delayCap);
        await options.onRetry?.({ ...context, delayMs: delay });
        if (delay > 0) {
          await sleep2(delay);
        }
      }
    }
    throw createFailure(attemptErrors);
  };
}
var retryAsync = createRetryRunner();
function formatDurationSeconds(ms, options = {}) {
  if (!Number.isFinite(ms)) {
    return "unknown";
  }
  const decimals = options.decimals ?? 1;
  const unit = options.unit ?? "s";
  const seconds = Math.max(0, ms) / 1e3;
  const fixed = seconds.toFixed(Math.max(0, decimals));
  const trimmed = fixed.replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
  return unit === "seconds" ? `${trimmed} seconds` : `${trimmed}s`;
}
function formatDurationPrecise(ms, options = {}) {
  if (!Number.isFinite(ms)) {
    return "unknown";
  }
  const roundedMs = Math.max(0, Math.round(ms));
  if (roundedMs < 1e3) {
    return prettyMilliseconds2(roundedMs);
  }
  return formatDurationSeconds(ms, {
    decimals: options.decimals ?? 2,
    unit: options.unit ?? "s"
  });
}
var retryAttemptErrors = /* @__PURE__ */ new WeakMap();
function recordRetryAttemptErrors(error, attemptErrors) {
  retryAttemptErrors.set(error, [...attemptErrors]);
}
function getRetryAttemptErrors(err) {
  return err !== null && (typeof err === "object" || typeof err === "function") ? retryAttemptErrors.get(err) : void 0;
}
function generateSecureFraction() {
  return randomBytes(4).readUInt32BE(0) / 4294967296;
}
function createRetryFailure(rawAttemptErrors) {
  const attemptErrors = rawAttemptErrors.flatMap((err) => getRetryAttemptErrors(err) ?? [err]);
  const failure = toRetryError(
    attemptErrors.at(-1) ?? new Error("Retry failed"),
    "Non-Error thrown"
  );
  if (attemptErrors.length > 1) {
    recordRetryAttemptErrors(failure, attemptErrors);
  }
  return failure;
}
var retryAsync2 = createRetryRunner({
  random: generateSecureFraction,
  createFailure: createRetryFailure
});
init_src();
init_string_coerce();
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
function resolveEnvAllProxyUrl(env) {
  const lowerAllProxy = normalizeProxyEnvValue(env.all_proxy);
  const allProxy = lowerAllProxy !== void 0 ? lowerAllProxy : normalizeProxyEnvValue(env.ALL_PROXY);
  return allProxy ?? void 0;
}
function resolveEnvHttpProxyAgentOptions(env = process.env) {
  const allProxy = resolveEnvAllProxyUrl(env);
  const httpProxy = resolveEnvHttpProxyUrl("http", env) ?? allProxy;
  const httpsProxy = resolveEnvHttpProxyUrl("https", env) ?? httpProxy;
  const options = {
    ...httpProxy ? { httpProxy } : {},
    ...httpsProxy ? { httpsProxy } : {}
  };
  return options.httpProxy || options.httpsProxy ? options : void 0;
}
function hasEnvHttpProxyAgentConfigured(env = process.env) {
  return resolveEnvHttpProxyAgentOptions(env) !== void 0;
}
init_record_coerce();
var activeProxyUrl;
var activeProxyTlsOptions;
function getActiveManagedProxyUrl() {
  return activeProxyUrl;
}
function getActiveManagedProxyTlsOptions() {
  return activeProxyTlsOptions;
}
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
init_record_coerce();
init_src();
init_global_state();
init_logger();
init_subsystem();
init_runtime();
var info2 = theme.info;
var warn2 = theme.warn;
var success2 = theme.success;
var danger2 = theme.error;
function logDebug(message) {
  getLogger().debug(message);
  if (isVerbose()) {
    console.log(theme.muted(message));
  }
}
init_error_coercion();
init_redact();
init_error_coercion();
function formatErrorMessage2(err) {
  return formatErrorMessage(err, { redact: redactSensitiveText2 });
}
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
function buildHttp1EnvHttpProxyAgentOptions(options, timeoutMs) {
  return withHttp1OnlyDispatcherOptions(
    addIpSafeProxyClientFactory(
      addUndiciAgentFactory(addActiveManagedProxyTlsOptions(options) ?? {})
    ),
    timeoutMs,
    { connect: true, proxyTls: true }
  );
}
function loadUndiciRuntimeDeps() {
  return loadUndiciModule(["Agent", "EnvHttpProxyAgent", "ProxyAgent", "fetch"]);
}
function loadUndiciGlobalDispatcherDeps() {
  return loadUndiciModule([
    "Agent",
    "EnvHttpProxyAgent",
    "getGlobalDispatcher",
    "setGlobalDispatcher"
  ]);
}
function createHttp1EnvHttpProxyAgent(options, timeoutMs) {
  const { EnvHttpProxyAgent } = loadUndiciRuntimeDeps();
  return withUndiciErrorDiagnostics(
    new EnvHttpProxyAgent(buildHttp1EnvHttpProxyAgentOptions(options, timeoutMs))
  );
}
var DEFAULT_UNDICI_STREAM_TIMEOUT_MS = 30 * 60 * 1e3;
var HTTP1_ONLY_DISPATCHER_OPTIONS2 = Object.freeze({
  allowH2: false
});
var lastAppliedProxyBootstrapKey = null;
var timedProxylineManagedDispatchers = /* @__PURE__ */ new WeakMap();
function isTimedProxylineManagedDispatcher(dispatcher) {
  return typeof dispatcher === "object" && dispatcher !== null ? timedProxylineManagedDispatchers.has(dispatcher) : false;
}
function resolveDispatcherKind(dispatcher) {
  const ctorName = dispatcher?.constructor?.name;
  if (typeof ctorName !== "string" || ctorName.length === 0) {
    return "unsupported";
  }
  if (ctorName.includes("EnvHttpProxyAgent")) {
    return "env-proxy";
  }
  if (isTimedProxylineManagedDispatcher(dispatcher) || isProxylineDispatcher(dispatcher)) {
    return "proxyline-managed";
  }
  if (ctorName.includes("ProxyAgent")) {
    return "unsupported";
  }
  if (ctorName.includes("Agent")) {
    return "agent";
  }
  return "unsupported";
}
function resolveEnvProxyDispatcherOptions() {
  return {
    ...addActiveManagedProxyTlsOptions(resolveEnvHttpProxyAgentOptions()),
    ...HTTP1_ONLY_DISPATCHER_OPTIONS2
  };
}
function resolveEnvProxyBootstrapKey(options) {
  const entries = Object.entries(options ?? {}).filter(([, value]) => value !== void 0).toSorted(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(entries);
}
function resolveCurrentDispatcherKind(runtime) {
  return resolveCurrentDispatcherInfo(runtime)?.kind ?? null;
}
function resolveCurrentDispatcherInfo(runtime) {
  let dispatcher;
  try {
    dispatcher = runtime.getGlobalDispatcher();
  } catch {
    return null;
  }
  const currentKind = resolveDispatcherKind(dispatcher);
  if (currentKind === "unsupported") {
    return null;
  }
  return {
    kind: currentKind,
    dispatcher
  };
}
function ensureGlobalUndiciEnvProxyDispatcher() {
  const shouldUseEnvProxy = hasEnvHttpProxyAgentConfigured();
  if (!shouldUseEnvProxy) {
    return;
  }
  const runtime = loadUndiciGlobalDispatcherDeps();
  const { setGlobalDispatcher } = runtime;
  const proxyOptions = resolveEnvProxyDispatcherOptions();
  const nextBootstrapKey = resolveEnvProxyBootstrapKey(proxyOptions);
  const currentKind = resolveCurrentDispatcherKind(runtime);
  if (currentKind === null) {
    return;
  }
  if (currentKind === "proxyline-managed") {
    lastAppliedProxyBootstrapKey = nextBootstrapKey;
    return;
  }
  if (currentKind === "env-proxy" && lastAppliedProxyBootstrapKey === null) {
    lastAppliedProxyBootstrapKey = nextBootstrapKey;
    return;
  }
  if (currentKind === "env-proxy" && lastAppliedProxyBootstrapKey === nextBootstrapKey) {
    return;
  }
  try {
    setGlobalDispatcher(createHttp1EnvHttpProxyAgent(proxyOptions));
    lastAppliedProxyBootstrapKey = nextBootstrapKey;
  } catch {
  }
}
init_string_coerce();
init_restore();
var HANDLERS_GLOBAL_KEY = /* @__PURE__ */ Symbol.for("openclaw.unhandledRejection.handlers");
var EXCEPTION_HANDLERS_GLOBAL_KEY = /* @__PURE__ */ Symbol.for("openclaw.uncaughtException.handlers");
var handlers = (() => {
  const g = globalThis;
  const existing = g[HANDLERS_GLOBAL_KEY];
  if (existing instanceof Set) {
    return existing;
  }
  const created = /* @__PURE__ */ new Set();
  g[HANDLERS_GLOBAL_KEY] = created;
  return created;
})();
var exceptionHandlers = (() => {
  const g = globalThis;
  const existing = g[EXCEPTION_HANDLERS_GLOBAL_KEY];
  if (existing instanceof Set) {
    return existing;
  }
  const created = /* @__PURE__ */ new Set();
  g[EXCEPTION_HANDLERS_GLOBAL_KEY] = created;
  return created;
})();
function registerUnhandledRejectionHandler(handler) {
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
}
function registerUncaughtExceptionHandler(handler) {
  exceptionHandlers.add(handler);
  return () => {
    exceptionHandlers.delete(handler);
  };
}
init_subsystem();
export {
  computeBackoff,
  createNonExitingRuntime,
  createSubsystemLogger,
  danger,
  defaultRuntime,
  ensureGlobalUndiciEnvProxyDispatcher,
  formatDurationPrecise,
  formatDurationSeconds,
  getChildLogger,
  info,
  isTruthyEnvValue,
  isVerbose,
  isWSL2Sync,
  logVerbose,
  registerUncaughtExceptionHandler,
  registerUnhandledRejectionHandler,
  resetLogger,
  retryAsync2 as retryAsync,
  setLoggerOverride,
  shouldLogVerbose,
  sleep,
  sleepWithAbort,
  success,
  toPinoLikeLogger,
  waitForAbortSignal,
  warn
};
