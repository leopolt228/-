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

// packages/memory-host-sdk/src/host/error-utils.ts
var SECRET_PATTERNS = [
  /\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD)\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g,
  /[?&](?:access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|api[-_]?key|client[-_]?secret|token|key|secret|password|pass|passwd|auth|signature)=([^&\s"'<>]+)/gi,
  /"(?:apiKey|token|secret|password|passwd|accessToken|refreshToken)"\s*:\s*"([^"]+)"/g,
  /--(?:api[-_]?key|hook[-_]?token|token|secret|password|passwd)\s+(["']?)([^\s"']+)\1/g,
  /Authorization\s*[:=]\s*Bearer\s+([A-Za-z0-9._\-+=]+)/g,
  /\bBearer\s+([A-Za-z0-9._\-+=]{18,})\b/g,
  /(^|[\s,;])(?:access_token|refresh_token|api[-_]?key|token|secret|password|passwd)=([^\s&#]+)/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----/g,
  /\b(sk-[A-Za-z0-9_-]{8,})\b/g,
  /\b(ghp_[A-Za-z0-9]{20,})\b/g,
  /\b(github_pat_[A-Za-z0-9_]{20,})\b/g,
  /\b(xox[baprs]-[A-Za-z0-9-]{10,})\b/g,
  /\b(xapp-[A-Za-z0-9-]{10,})\b/g,
  /\b(gsk_[A-Za-z0-9_-]{10,})\b/g,
  /\b(AIza[0-9A-Za-z\-_]{20,})\b/g,
  /\b(pplx-[A-Za-z0-9_-]{10,})\b/g,
  /\b(npm_[A-Za-z0-9]{10,})\b/g,
  /\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b/g,
  /\b(\d{6,}:[A-Za-z0-9_-]{20,})\b/g
];
function maskToken(token) {
  if (token.length < 18) {
    return "***";
  }
  return `${sliceUtf16Safe(token, 0, 6)}...${sliceUtf16Safe(token, -4)}`;
}
function redactPemBlock(block) {
  const lines = block.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    return "***";
  }
  return `${lines[0]}
...redacted...
${lines[lines.length - 1]}`;
}
function redactMatch(match, groups) {
  if (match.includes("PRIVATE KEY-----")) {
    return redactPemBlock(match);
  }
  const token = groups.findLast((value) => typeof value === "string" && value.length > 0) ?? match;
  const masked = maskToken(token);
  if (token === match) {
    return masked;
  }
  const tokenOffset = match.lastIndexOf(token);
  if (tokenOffset < 0) {
    return "***";
  }
  return `${match.slice(0, tokenOffset)}${masked}${match.slice(tokenOffset + token.length)}`;
}
function redactSensitiveText(text) {
  let next = text;
  for (const pattern of SECRET_PATTERNS) {
    next = next.replace(
      pattern,
      (...args) => redactMatch(args[0] ?? "", args.slice(1, -2))
    );
  }
  return next;
}
function formatErrorMessage2(err) {
  return formatErrorMessage(err, { redact: redactSensitiveText });
}

// packages/memory-host-sdk/src/host/batch-error-utils.ts
var BATCH_ERROR_DETAIL_MAX_CHARS = 500;
var BATCH_ERROR_DETAIL_TRUNCATED_SUFFIX = "... [truncated]";
var EMBEDDING_BATCH_UNAVAILABLE_CODE = "embedding_batch_unavailable";
var EmbeddingBatchUnavailableError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.code = EMBEDDING_BATCH_UNAVAILABLE_CODE;
    this.name = "EmbeddingBatchUnavailableError";
  }
};
function isEmbeddingBatchUnavailableError(error) {
  if (!error || typeof error !== "object") {
    return false;
  }
  try {
    return error.code === EMBEDDING_BATCH_UNAVAILABLE_CODE;
  } catch {
    return false;
  }
}
function getResponseErrorMessage(line) {
  const body = line?.response?.body;
  if (typeof body === "string") {
    return body || line?.response?.message || void 0;
  }
  if (!body || typeof body !== "object") {
    return line?.response?.message || void 0;
  }
  return body.error?.message || line?.response?.message || void 0;
}
function extractBatchErrorMessage(lines) {
  const first = lines.find((line) => line.error?.message || getResponseErrorMessage(line));
  return first?.error?.message || getResponseErrorMessage(first);
}
function formatBatchErrorDetail(detail) {
  if (!detail) {
    return void 0;
  }
  const formatted = formatErrorMessage2(detail);
  if (formatted.length <= BATCH_ERROR_DETAIL_MAX_CHARS) {
    return formatted;
  }
  const prefixLength = BATCH_ERROR_DETAIL_MAX_CHARS - BATCH_ERROR_DETAIL_TRUNCATED_SUFFIX.length;
  return `${truncateUtf16Safe(formatted, prefixLength)}${BATCH_ERROR_DETAIL_TRUNCATED_SUFFIX}`;
}
function formatUnavailableBatchError(err) {
  const message = formatBatchErrorDetail(formatErrorMessage2(err));
  return message ? `error file unavailable: ${message}` : void 0;
}
export {
  EmbeddingBatchUnavailableError,
  extractBatchErrorMessage,
  formatBatchErrorDetail,
  formatUnavailableBatchError,
  isEmbeddingBatchUnavailableError
};
