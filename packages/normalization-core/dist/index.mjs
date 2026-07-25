// packages/normalization-core/src/boolean-coercion.ts
function parseBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value !== "string") {
    return void 0;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") {
    return true;
  }
  if (normalized === "false") {
    return false;
  }
  return void 0;
}

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
function stringifyNonErrorCause(value) {
  if (value === null) {
    return "null";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  try {
    return JSON.stringify(value) ?? Object.prototype.toString.call(value);
  } catch {
    return Object.prototype.toString.call(value);
  }
}

// packages/normalization-core/src/expect.ts
function expectDefined(value, context) {
  if (value === null || value === void 0) {
    throw new Error("expected " + context + " to be defined");
  }
  return value;
}
function first(values) {
  return values.at(0);
}
function last(values) {
  return values.at(-1);
}

// packages/normalization-core/src/format.ts
var BYTE_SIZE_UNITS = ["byte", "kilo", "mega", "giga", "tera"];
var BYTE_SIZE_STYLES = {
  iec: { base: 1024, labels: ["B", "KiB", "MiB", "GiB", "TiB"] },
  "legacy-binary": { base: 1024, labels: ["B", "KB", "MB", "GB", "TB"] }
};
function formatByteSize(bytes, options) {
  const { base, labels } = BYTE_SIZE_STYLES[options.style];
  const maxUnitIndex = BYTE_SIZE_UNITS.indexOf(options.maxUnit);
  let unitIndex = 0;
  let value = bytes;
  while (value >= base && unitIndex < maxUnitIndex) {
    value /= base;
    unitIndex += 1;
  }
  const unit = expectDefined(BYTE_SIZE_UNITS[unitIndex], "byte-size unit");
  const label = expectDefined(labels[unitIndex], "byte-size label");
  const fractionDigits = typeof options.fractionDigits === "function" ? options.fractionDigits(value, unit) : options.fractionDigits;
  if (fractionDigits === null) {
    return `${value}${options.separator}${label}`;
  }
  if (options.floorUnits?.includes(unit)) {
    value = Math.floor(value * 10 ** fractionDigits) / 10 ** fractionDigits;
  }
  return `${value.toFixed(fractionDigits)}${options.separator}${label}`;
}

// packages/normalization-core/src/json-coercion.ts
function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return void 0;
  }
}

// packages/normalization-core/src/number-coercion.ts
function asFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function asFiniteNumberInRange(value, range) {
  const number = asFiniteNumber(value);
  if (number === void 0) {
    return void 0;
  }
  if (range.min !== void 0) {
    if (range.minExclusive ? number <= range.min : number < range.min) {
      return void 0;
    }
  }
  if (range.max !== void 0) {
    if (range.maxExclusive ? number >= range.max : number > range.max) {
      return void 0;
    }
  }
  return number;
}
function asSafeIntegerInRange(value, range) {
  if (typeof value !== "number" || !Number.isSafeInteger(value)) {
    return void 0;
  }
  if (range.min !== void 0 && value < range.min) {
    return void 0;
  }
  if (range.max !== void 0 && value > range.max) {
    return void 0;
  }
  return value;
}
function normalizeNumericString(value) {
  const trimmed = value.trim();
  return trimmed ? trimmed : void 0;
}
function parseFiniteNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : void 0;
  }
  return parseStrictFiniteNumber(value);
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
function parseStrictFiniteNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : void 0;
  }
  if (typeof value !== "string") {
    return void 0;
  }
  const normalized = normalizeNumericString(value);
  if (!normalized || !/^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d+)?$/i.test(normalized)) {
    return void 0;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function asPositiveSafeInteger(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
var MAX_TIMER_TIMEOUT_MS = 2147e6;
var MAX_TIMER_TIMEOUT_SECONDS = Math.floor(MAX_TIMER_TIMEOUT_MS / 1e3);
var MAX_DATE_TIMESTAMP_MS = 864e13;
var UNIX_EPOCH_ISO_STRING = "1970-01-01T00:00:00.000Z";
function asDateTimestampMs(value) {
  return asFiniteNumberInRange(value, {
    min: -MAX_DATE_TIMESTAMP_MS,
    max: MAX_DATE_TIMESTAMP_MS
  });
}
function isFutureDateTimestampMs(value, opts = {}) {
  const timestampMs = asDateTimestampMs(value);
  const nowMs = asDateTimestampMs(opts.nowMs ?? Date.now());
  return timestampMs !== void 0 && nowMs !== void 0 && timestampMs > nowMs;
}
function timestampMsToIsoString(value) {
  const timestampMs = asDateTimestampMs(value);
  return timestampMs === void 0 ? void 0 : new Date(timestampMs).toISOString();
}
function resolveDateTimestampMs(value, fallbackValue = Date.now()) {
  return asDateTimestampMs(value) ?? asDateTimestampMs(fallbackValue) ?? 0;
}
function resolveTimestampMsToIsoString(value, fallbackValue = Date.now()) {
  return timestampMsToIsoString(value) ?? timestampMsToIsoString(fallbackValue) ?? UNIX_EPOCH_ISO_STRING;
}
function timestampMsToIsoFileStamp(value, fallbackValue = Date.now()) {
  return resolveTimestampMsToIsoString(value, fallbackValue).replaceAll(":", "-");
}
function clampTimerTimeoutMs(valueMs, minMs = 1) {
  const value = asFiniteNumber(valueMs);
  if (value === void 0) {
    return void 0;
  }
  const min = Math.max(1, Math.floor(minMs));
  return Math.min(Math.max(Math.floor(value), min), MAX_TIMER_TIMEOUT_MS);
}
function clampPositiveTimerTimeoutMs(valueMs) {
  const value = asFiniteNumber(valueMs);
  if (value === void 0 || value <= 0) {
    return void 0;
  }
  return clampTimerTimeoutMs(value);
}
function resolvePositiveTimerTimeoutMs(valueMs, fallbackMs) {
  return clampPositiveTimerTimeoutMs(valueMs) ?? resolveTimerTimeoutMs(fallbackMs, 1);
}
function resolveTimerTimeoutMs(valueMs, fallbackMs, minMs = 1) {
  const value = asFiniteNumber(valueMs) ?? asFiniteNumber(fallbackMs);
  const min = Math.max(0, Math.floor(minMs));
  if (value === void 0) {
    return min;
  }
  return Math.min(Math.max(Math.floor(value), min), MAX_TIMER_TIMEOUT_MS);
}
function addTimerTimeoutGraceMs(timeoutMs, graceMs = 5e3) {
  const timeout = asFiniteNumber(timeoutMs);
  const grace = asFiniteNumber(graceMs);
  if (timeout === void 0 || grace === void 0) {
    return void 0;
  }
  const withGrace = timeout + grace;
  return Number.isFinite(withGrace) ? clampTimerTimeoutMs(withGrace) : MAX_TIMER_TIMEOUT_MS;
}
function finiteSecondsToTimerSafeMilliseconds(value, opts = {}) {
  const seconds = asFiniteNumber(value);
  if (seconds === void 0 || seconds <= 0) {
    return void 0;
  }
  const boundedSeconds = opts.floorSeconds ? Math.floor(seconds) : seconds;
  if (boundedSeconds >= MAX_TIMER_TIMEOUT_SECONDS) {
    return MAX_TIMER_TIMEOUT_MS;
  }
  const milliseconds = Math.floor(boundedSeconds * 1e3);
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
    return void 0;
  }
  return Math.min(milliseconds, MAX_TIMER_TIMEOUT_MS);
}
function resolveIntegerOption(value, fallback, range = {}) {
  const candidate = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  const floored = Math.floor(candidate);
  const minBounded = range.min === void 0 ? floored : Math.max(range.min, floored);
  return range.max === void 0 ? minBounded : Math.min(range.max, minBounded);
}
function resolveOptionalIntegerOption(value, range = {}) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return void 0;
  }
  return resolveIntegerOption(value, value, range);
}
function resolveNonNegativeIntegerOption(value, fallback) {
  return resolveIntegerOption(value, fallback, { min: 0 });
}
function parseStrictPositiveInteger(value) {
  const parsed = parseStrictInteger(value);
  return parsed !== void 0 && parsed > 0 ? parsed : void 0;
}
function parseStrictNonNegativeInteger(value) {
  const parsed = parseStrictInteger(value);
  return parsed !== void 0 && parsed >= 0 ? parsed : void 0;
}
function positiveSecondsToSafeMilliseconds(value) {
  const seconds = parseStrictPositiveInteger(value);
  if (seconds === void 0) {
    return void 0;
  }
  const milliseconds = seconds * 1e3;
  return Number.isSafeInteger(milliseconds) ? milliseconds : void 0;
}
function nonNegativeSecondsToSafeMilliseconds(value) {
  const seconds = parseStrictNonNegativeInteger(value);
  if (seconds === void 0) {
    return void 0;
  }
  const milliseconds = seconds * 1e3;
  return Number.isSafeInteger(milliseconds) ? milliseconds : void 0;
}
function resolveExpiresAtMsFromDurationMs(value, opts = {}) {
  const durationMs = asPositiveSafeInteger(value);
  if (durationMs === void 0) {
    return void 0;
  }
  const nowMs = asDateTimestampMs(opts.nowMs ?? Date.now());
  const bufferMs = asFiniteNumber(opts.bufferMs ?? 0);
  if (nowMs === void 0 || bufferMs === void 0) {
    return void 0;
  }
  const expiresAt = nowMs + durationMs - bufferMs;
  if (!Number.isSafeInteger(expiresAt) || timestampMsToIsoString(expiresAt) === void 0) {
    return void 0;
  }
  const minRemainingMs = opts.minRemainingMs;
  if (minRemainingMs === void 0) {
    return expiresAt;
  }
  const minExpiresAt = nowMs + minRemainingMs;
  if (!Number.isSafeInteger(minExpiresAt) || timestampMsToIsoString(minExpiresAt) === void 0) {
    return expiresAt;
  }
  return Math.max(expiresAt, minExpiresAt);
}
function resolveExpiresAtMsFromDurationSeconds(value, opts = {}) {
  const durationMs = positiveSecondsToSafeMilliseconds(value);
  return durationMs === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(durationMs, opts);
}
function resolveExpiresAtMsFromEpochSeconds(value, opts = {}) {
  const epochMs = typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.trunc(value) * 1e3 : positiveSecondsToSafeMilliseconds(value);
  if (epochMs === void 0) {
    return void 0;
  }
  const expiresAt = epochMs - (opts.bufferMs ?? 0);
  if (!Number.isSafeInteger(expiresAt)) {
    return void 0;
  }
  if (timestampMsToIsoString(expiresAt) === void 0) {
    return void 0;
  }
  const maxMs = opts.maxMs;
  return maxMs === void 0 || expiresAt <= maxMs ? expiresAt : void 0;
}
function resolveExpiresAtMsFromDurationOrEpoch(value, opts = {}) {
  const parsed = parseStrictPositiveInteger(value);
  if (parsed === void 0) {
    return void 0;
  }
  const relativeSecondsThreshold = opts.relativeSecondsThreshold ?? 1e9;
  if (parsed < relativeSecondsThreshold) {
    return resolveExpiresAtMsFromDurationSeconds(parsed, { nowMs: opts.nowMs });
  }
  const absoluteMillisecondsThreshold = opts.absoluteMillisecondsThreshold ?? 1e12;
  if (parsed < absoluteMillisecondsThreshold) {
    return resolveExpiresAtMsFromEpochSeconds(parsed);
  }
  return asDateTimestampMs(parsed);
}

// packages/normalization-core/src/record-coerce.ts
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function asRecord(value) {
  return typeof value === "object" && value !== null ? value : {};
}
function readStringField(record, key) {
  const value = record?.[key];
  return typeof value === "string" ? value : void 0;
}
function asOptionalRecord(value) {
  return isRecord(value) ? value : void 0;
}
function asNullableRecord(value) {
  return isRecord(value) ? value : null;
}
function asOptionalObjectRecord(value) {
  return value && typeof value === "object" ? value : void 0;
}
function asNullableObjectRecord(value) {
  return value && typeof value === "object" ? value : null;
}

// packages/normalization-core/src/string-coerce.ts
function readStringValue(value) {
  return typeof value === "string" ? value : void 0;
}
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
function normalizeStringifiedOptionalString(value) {
  if (typeof value === "string") {
    return normalizeOptionalString(value);
  }
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return normalizeOptionalString(String(value));
  }
  return void 0;
}
function normalizeStringifiedEntries(values) {
  return (values ?? []).map((entry) => normalizeStringifiedOptionalString(entry)).filter((entry) => Boolean(entry));
}
function normalizeOptionalLowercaseString(value) {
  return normalizeOptionalString(value)?.toLowerCase();
}
function normalizeLowercaseStringOrEmpty(value) {
  return normalizeOptionalLowercaseString(value) ?? "";
}
function normalizeFastMode(raw) {
  if (typeof raw === "boolean") {
    return raw;
  }
  if (!raw) {
    return void 0;
  }
  const key = normalizeLowercaseStringOrEmpty(raw);
  if (["off", "false", "no", "0", "disable", "disabled", "normal"].includes(key)) {
    return false;
  }
  if (["on", "true", "yes", "1", "enable", "enabled", "fast"].includes(key)) {
    return true;
  }
  if (["auto", "automatic"].includes(key)) {
    return "auto";
  }
  return void 0;
}
function lowercasePreservingWhitespace(value) {
  return value.toLowerCase();
}
function localeLowercasePreservingWhitespace(value) {
  return value.toLocaleLowerCase();
}
function resolvePrimaryStringValue(value) {
  if (typeof value === "string") {
    return normalizeOptionalString(value);
  }
  if (!value || typeof value !== "object") {
    return void 0;
  }
  return normalizeOptionalString(value.primary);
}
function normalizeOptionalThreadValue(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.trunc(value) : void 0;
  }
  return normalizeOptionalString(value);
}
function normalizeOptionalStringifiedId(value) {
  const normalized = normalizeOptionalThreadValue(value);
  return normalized == null ? void 0 : String(normalized);
}
function hasNonEmptyString(value) {
  return normalizeOptionalString(value) !== void 0;
}

// packages/normalization-core/src/string-normalization.ts
function normalizeStringEntries(list) {
  return (list ?? []).map((entry) => normalizeOptionalString(String(entry)) ?? "").filter(Boolean);
}
function normalizeStringEntriesLower(list) {
  return normalizeStringEntries(list).map((entry) => normalizeOptionalLowercaseString(entry) ?? "");
}
function uniqueValues(values) {
  return [...new Set(values)];
}
function uniqueStrings(values) {
  return uniqueValues(values);
}
function sortUniqueStrings(values) {
  return uniqueStrings(values).toSorted(
    (left, right) => left < right ? -1 : left > right ? 1 : 0
  );
}
function normalizeUniqueStringEntries(values) {
  return uniqueStrings(normalizeStringEntries(values ? [...values] : void 0));
}
function normalizeUniqueStringEntriesLower(values) {
  return uniqueStrings(
    normalizeStringEntriesLower(values ? [...values] : void 0).filter(Boolean)
  );
}
function normalizeSortedUniqueStringEntries(values) {
  return sortUniqueStrings(normalizeUniqueStringEntries(values));
}
function normalizeTrimmedStringList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    const normalized = normalizeOptionalString(entry);
    return normalized ? [normalized] : [];
  });
}
function normalizeUniqueTrimmedStringList(value) {
  return uniqueStrings(normalizeTrimmedStringList(value));
}
function normalizeSortedUniqueTrimmedStringList(value) {
  return sortUniqueStrings(normalizeTrimmedStringList(value));
}
function normalizeOptionalTrimmedStringList(value) {
  const normalized = normalizeTrimmedStringList(value);
  return normalized.length > 0 ? normalized : void 0;
}
function normalizeArrayBackedTrimmedStringList(value) {
  if (!Array.isArray(value)) {
    return void 0;
  }
  return normalizeTrimmedStringList(value);
}
function normalizeSingleOrTrimmedStringList(value) {
  if (Array.isArray(value)) {
    return normalizeTrimmedStringList(value);
  }
  const normalized = normalizeOptionalString(value);
  return normalized ? [normalized] : [];
}
function normalizeUniqueSingleOrTrimmedStringList(value) {
  return uniqueStrings(normalizeSingleOrTrimmedStringList(value));
}
function normalizeCsvOrLooseStringList(value) {
  if (Array.isArray(value)) {
    return normalizeStringEntries(value);
  }
  if (typeof value === "string") {
    return value.split(",").map((entry) => entry.trim()).filter(Boolean);
  }
  return [];
}
function normalizeSlugInput(raw) {
  return (normalizeOptionalLowercaseString(raw) ?? "").normalize("NFC");
}
function normalizeHyphenSlug(raw) {
  const trimmed = normalizeSlugInput(raw);
  if (!trimmed) {
    return "";
  }
  const dashed = trimmed.replace(/\s+/g, "-");
  const cleaned = dashed.replace(/[^\p{L}\p{M}\p{N}#@._+-]+/gu, "-");
  return cleaned.replace(/-{2,}/g, "-").replace(/^[-.]+|[-.]+$/g, "");
}
function normalizeAtHashSlug(raw) {
  const trimmed = normalizeSlugInput(raw);
  if (!trimmed) {
    return "";
  }
  const withoutPrefix = trimmed.replace(/^[@#]+/, "");
  const dashed = withoutPrefix.replace(/[\s_]+/g, "-");
  const cleaned = dashed.replace(/[^\p{L}\p{M}\p{N}-]+/gu, "-");
  return cleaned.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
}

// packages/normalization-core/src/text-decoding.ts
function decodeTextPrefix(bytes, options = {}) {
  const decoder = new TextDecoder(options.encoding);
  return decoder.decode(bytes, options.truncated ? { stream: true } : void 0);
}

// packages/normalization-core/src/utf16-slice.ts
function isHighSurrogate(codeUnit) {
  return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
  return codeUnit >= 56320 && codeUnit <= 57343;
}
function avoidTrailingHighSurrogateBreak(text, start, end) {
  if (end <= start || end >= text.length || !isHighSurrogate(text.charCodeAt(end - 1)) || !isLowSurrogate(text.charCodeAt(end))) {
    return end;
  }
  const adjusted = end - 1;
  return adjusted > start ? adjusted : end + 1;
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
export {
  MAX_DATE_TIMESTAMP_MS,
  MAX_TIMER_TIMEOUT_MS,
  MAX_TIMER_TIMEOUT_SECONDS,
  UNIX_EPOCH_ISO_STRING,
  addTimerTimeoutGraceMs,
  asDateTimestampMs,
  asFiniteNumber,
  asFiniteNumberInRange,
  asNullableObjectRecord,
  asNullableRecord,
  asOptionalObjectRecord,
  asOptionalRecord,
  asPositiveSafeInteger,
  asRecord,
  asSafeIntegerInRange,
  avoidTrailingHighSurrogateBreak,
  clampPositiveTimerTimeoutMs,
  clampTimerTimeoutMs,
  decodeTextPrefix,
  expectDefined,
  finiteSecondsToTimerSafeMilliseconds,
  first,
  formatByteSize,
  formatErrorMessage,
  hasNonEmptyString,
  isFutureDateTimestampMs,
  isRecord,
  last,
  localeLowercasePreservingWhitespace,
  lowercasePreservingWhitespace,
  nonNegativeSecondsToSafeMilliseconds,
  normalizeArrayBackedTrimmedStringList,
  normalizeAtHashSlug,
  normalizeCsvOrLooseStringList,
  normalizeFastMode,
  normalizeHyphenSlug,
  normalizeLowercaseStringOrEmpty,
  normalizeNullableString,
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
  normalizeOptionalStringifiedId,
  normalizeOptionalThreadValue,
  normalizeOptionalTrimmedStringList,
  normalizeSingleOrTrimmedStringList,
  normalizeSortedUniqueStringEntries,
  normalizeSortedUniqueTrimmedStringList,
  normalizeStringEntries,
  normalizeStringEntriesLower,
  normalizeStringifiedEntries,
  normalizeStringifiedOptionalString,
  normalizeTrimmedStringList,
  normalizeUniqueSingleOrTrimmedStringList,
  normalizeUniqueStringEntries,
  normalizeUniqueStringEntriesLower,
  normalizeUniqueTrimmedStringList,
  parseBoolean,
  parseFiniteNumber,
  parseStrictFiniteNumber,
  parseStrictInteger,
  parseStrictNonNegativeInteger,
  parseStrictPositiveInteger,
  positiveSecondsToSafeMilliseconds,
  readStringField,
  readStringValue,
  resolveDateTimestampMs,
  resolveExpiresAtMsFromDurationMs,
  resolveExpiresAtMsFromDurationOrEpoch,
  resolveExpiresAtMsFromDurationSeconds,
  resolveExpiresAtMsFromEpochSeconds,
  resolveIntegerOption,
  resolveNonNegativeIntegerOption,
  resolveOptionalIntegerOption,
  resolvePositiveTimerTimeoutMs,
  resolvePrimaryStringValue,
  resolveTimerTimeoutMs,
  resolveTimestampMsToIsoString,
  safeParseJson,
  sliceUtf16Safe,
  sortUniqueStrings,
  stringifyNonErrorCause,
  timestampMsToIsoFileStamp,
  timestampMsToIsoString,
  toErrorObject,
  truncateUtf16Safe,
  uniqueStrings,
  uniqueValues
};
