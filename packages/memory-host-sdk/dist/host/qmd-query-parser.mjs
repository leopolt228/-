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

// packages/memory-host-sdk/src/host/qmd-query-parser.ts
function parseQmdQueryJson(stdout, stderr) {
  const trimmedStdout = stdout.trim();
  const trimmedStderr = stderr.trim();
  const stdoutIsMarker = trimmedStdout.length > 0 && isQmdNoResultsOutput(trimmedStdout);
  const stderrIsMarker = trimmedStderr.length > 0 && isQmdNoResultsOutput(trimmedStderr);
  if (stdoutIsMarker || !trimmedStdout && stderrIsMarker) {
    return [];
  }
  if (!trimmedStdout) {
    const context = trimmedStderr ? ` (stderr: ${summarizeQmdStderr(trimmedStderr)})` : "";
    const message = `stdout empty${context}`;
    warnQmdQueryParseError(message);
    throw new Error(`qmd query returned invalid JSON: ${message}`);
  }
  try {
    const parsed = parseQmdQueryResultArray(trimmedStdout);
    if (parsed !== null) {
      return parsed;
    }
    const noisyPayload = extractFirstJsonArray(trimmedStdout);
    if (!noisyPayload) {
      throw new Error("qmd query JSON response was not an array");
    }
    const fallback = parseQmdQueryResultArray(noisyPayload);
    if (fallback !== null) {
      return fallback;
    }
    throw new Error("qmd query JSON response was not an array");
  } catch (err) {
    const message = formatErrorMessage2(err);
    warnQmdQueryParseError(message);
    throw new Error(`qmd query returned invalid JSON: ${message}`, { cause: err });
  }
}
function warnQmdQueryParseError(message) {
  if (process.env.VITEST || process.env.NODE_ENV === "test") {
    return;
  }
  process.stderr.write(`qmd query returned invalid JSON: ${message}
`);
}
function isQmdNoResultsOutput(raw) {
  const lines = raw.split(/\r?\n/).map((line) => normalizeLowercaseStringOrEmpty(line).replace(/\s+/g, " ")).filter((line) => line.length > 0);
  return lines.some((line) => isQmdNoResultsLine(line));
}
function isQmdNoResultsLine(line) {
  if (line === "no results found" || line === "no results found.") {
    return true;
  }
  return /^(?:\[[^\]]+\]\s*)?(?:(?:warn(?:ing)?|info|error|qmd)\s*:\s*)+no results found\.?$/.test(
    line
  );
}
function summarizeQmdStderr(raw) {
  return raw.length <= 120 ? raw : `${truncateUtf16Safe(raw, 117)}...`;
}
function parseQmdQueryResultArray(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }
    return parsed.map((item) => {
      if (typeof item !== "object" || item === null) {
        return item;
      }
      const record = item;
      const docid = typeof record.docid === "string" ? record.docid : void 0;
      const score = typeof record.score === "number" && Number.isFinite(record.score) ? record.score : void 0;
      const collection = typeof record.collection === "string" ? record.collection : void 0;
      const file = typeof record.file === "string" ? record.file : void 0;
      const snippet = typeof record.snippet === "string" ? record.snippet : void 0;
      const body = typeof record.body === "string" ? record.body : void 0;
      return {
        docid,
        score,
        collection,
        file,
        snippet,
        body,
        startLine: parseQmdLineNumber(record.start_line ?? record.startLine),
        endLine: parseQmdLineNumber(record.end_line ?? record.endLine)
      };
    });
  } catch {
    return null;
  }
}
function parseQmdLineNumber(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
function extractFirstJsonArray(raw) {
  const start = raw.indexOf("[");
  if (start < 0) {
    return null;
  }
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < raw.length; i += 1) {
    const char = raw[i];
    if (char === void 0) {
      break;
    }
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        return raw.slice(start, i + 1);
      }
    }
  }
  return null;
}
export {
  parseQmdQueryJson
};
