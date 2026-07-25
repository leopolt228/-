// packages/acp-core/src/structured-auth-redaction.ts
var HTTP_AUTH_SCHEME_PATTERN = "[A-Za-z0-9!#$%&'*+.^_`|~-]+";
var HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN = String.raw`(?:\[REDACTED\]|[^\s\\"',;&#?<>)}\]]+)`;
var HTTP_AUTH_SERIALIZED_TAB_PATTERN = String.raw`\\{1,64}t`;
var HTTP_AUTH_SERIALIZED_INDENT_PATTERN = String.raw`(?:[ \t]+|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})`;
var HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]*)`;
var HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]+)`;
var HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t\r\n]*|[ \t]*\\{1,64}r\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*)`;
var HTTP_AUTH_HEADER_BOUNDARY_PATTERN = String.raw`(^|[^A-Za-z0-9_-]|\\{1,64}[rn])`;
var HTTP_AUTH_SERIALIZED_QUOTE_PATTERN = String.raw`(?:\\{1,64}["']|["']|)`;
var CREDENTIAL_STYLE_HEADER_REDACT_PATTERN = String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:x-goog-api-key|api-key|apikey|x-api-token|x-access-token)${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
var STRUCTURED_AUTH_HEADER_RE = new RegExp(
  String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:Proxy-)?Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_SCHEME_PATTERN})${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}`,
  "giu"
);
var AUTH_PARAM_NAME_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
var AUTH_PARAM_TOKEN_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
var AWS_SCOPE_VALUE_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~:/-]+/u;
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

// packages/normalization-core/src/error-coercion.ts
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

// packages/acp-core/src/error-format.ts
var STRUCTURED_AUTH_MARKER_PREFIX = ";__openclaw_structured_auth_redacted_";
var SECRET_PATTERNS = [
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
var configuredRedactor;
function createStructuredAuthMarker(value) {
  const usedIds = /* @__PURE__ */ new Set();
  const maxIdDigits = String(value.length).length;
  let cursor = 0;
  for (; ; ) {
    const markerStart = value.indexOf(STRUCTURED_AUTH_MARKER_PREFIX, cursor);
    if (markerStart < 0) {
      break;
    }
    const idStart = markerStart + STRUCTURED_AUTH_MARKER_PREFIX.length;
    let idEnd = idStart;
    while (idEnd - idStart <= maxIdDigits) {
      const char = value[idEnd];
      if (char === void 0 || char < "0" || char > "9") {
        break;
      }
      idEnd += 1;
    }
    if (idEnd > idStart && value[idEnd] === ";" && idEnd - idStart <= maxIdDigits) {
      const id2 = Number(value.slice(idStart, idEnd));
      if (id2 <= value.length) {
        usedIds.add(id2);
      }
    }
    cursor = idStart;
  }
  let id = 0;
  while (usedIds.has(id)) {
    id += 1;
  }
  return `${STRUCTURED_AUTH_MARKER_PREFIX}${id};`;
}
function configureAcpErrorRedactor(redactor) {
  configuredRedactor = redactor;
}
function redactSensitiveText(value) {
  const configured = configuredRedactor ? configuredRedactor(value) : value;
  const structuredAuthMarker = createStructuredAuthMarker(configured);
  let redacted = redactStructuredAuthHeaders(configured, structuredAuthMarker);
  for (const pattern of SECRET_PATTERNS) {
    redacted = redacted.replace(pattern, (match, ...args) => {
      if (match.includes("PRIVATE KEY-----")) {
        return "[REDACTED_PRIVATE_KEY]";
      }
      const groups = args.slice(0, -2);
      const token = groups.findLast((group) => typeof group === "string" && group.length > 0);
      return token ? match.replace(token, "[REDACTED]") : "[REDACTED]";
    });
  }
  return redacted.replaceAll(structuredAuthMarker, "[REDACTED]");
}

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

// packages/acp-core/src/meta.ts
function readMetaValue(meta, keys, normalize) {
  if (!meta) {
    return void 0;
  }
  for (const key of keys) {
    const normalized = normalize(meta[key]);
    if (normalized !== void 0) {
      return normalized;
    }
  }
  return void 0;
}
function readString(meta, keys) {
  return readMetaValue(meta, keys, normalizeOptionalString);
}
function readBool(meta, keys) {
  return readMetaValue(meta, keys, (value) => typeof value === "boolean" ? value : void 0);
}
function readNumber(meta, keys) {
  return readMetaValue(
    meta,
    keys,
    (value) => typeof value === "number" && Number.isFinite(value) ? value : void 0
  );
}
function readNonNegativeInteger(meta, keys) {
  return readMetaValue(
    meta,
    keys,
    (value) => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : void 0
  );
}

// packages/normalization-core/src/number-coercion.ts
var MAX_TIMER_TIMEOUT_MS = 2147e6;
var MAX_TIMER_TIMEOUT_SECONDS = Math.floor(MAX_TIMER_TIMEOUT_MS / 1e3);
function resolveIntegerOption(value, fallback, range = {}) {
  const candidate = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  const floored = Math.floor(candidate);
  const minBounded = range.min === void 0 ? floored : Math.max(range.min, floored);
  return range.max === void 0 ? minBounded : Math.min(range.max, minBounded);
}

// packages/acp-core/src/numeric-options.ts
function resolveIntegerOption2(value, fallback, params) {
  return resolveIntegerOption(value, fallback, params);
}

// packages/normalization-core/src/record-coerce.ts
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function asOptionalRecord(value) {
  return isRecord(value) ? value : void 0;
}

// packages/acp-core/src/session-interaction-mode.ts
function resolveAcpSessionInteractionMode(entry) {
  if (!entry?.acp) {
    return "interactive";
  }
  if (normalizeOptionalString(entry.spawnedBy) || normalizeOptionalString(entry.parentSessionKey)) {
    return "parent-owned-background";
  }
  return "interactive";
}
function isParentOwnedBackgroundAcpSession(entry) {
  return resolveAcpSessionInteractionMode(entry) === "parent-owned-background";
}
function isRequesterParentOfBackgroundAcpSession(entry, requesterSessionKey) {
  if (!isParentOwnedBackgroundAcpSession(entry)) {
    return false;
  }
  const requester = normalizeOptionalString(requesterSessionKey);
  if (!requester) {
    return false;
  }
  const spawnedBy = normalizeOptionalString(entry?.spawnedBy);
  const parentSessionKey = normalizeOptionalString(entry?.parentSessionKey);
  return requester === spawnedBy || requester === parentSessionKey;
}

// packages/acp-core/src/session-lineage-meta.ts
var SUBAGENT_ROLES = ["orchestrator", "leaf"];
var SUBAGENT_CONTROL_SCOPES = ["children", "none"];
function readInteger(value) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    return void 0;
  }
  return value;
}
function readEnum(value, allowed) {
  const normalized = normalizeOptionalString(value);
  return allowed.find((candidate) => candidate === normalized);
}
function toAcpSessionLineageMeta(row) {
  const sessionKey = normalizeOptionalString(row.key) ?? row.key;
  const kind = normalizeOptionalString(row.kind);
  const channel = normalizeOptionalString(row.channel);
  const parentSessionId = normalizeOptionalString(row.parentSessionKey) ?? normalizeOptionalString(row.spawnedBy);
  const spawnedBy = normalizeOptionalString(row.spawnedBy);
  const spawnDepth = readInteger(row.spawnDepth);
  const subagentRole = readEnum(row.subagentRole, SUBAGENT_ROLES);
  const subagentControlScope = readEnum(row.subagentControlScope, SUBAGENT_CONTROL_SCOPES);
  const spawnedWorkspaceDir = normalizeOptionalString(row.spawnedWorkspaceDir);
  const spawnedCwd = normalizeOptionalString(row.spawnedCwd);
  return {
    sessionKey,
    ...kind ? { kind } : {},
    ...channel ? { channel } : {},
    ...parentSessionId ? { parentSessionId } : {},
    ...spawnedBy ? { spawnedBy } : {},
    ...spawnDepth !== void 0 ? { spawnDepth } : {},
    ...subagentRole ? { subagentRole } : {},
    ...subagentControlScope ? { subagentControlScope } : {},
    ...spawnedWorkspaceDir ? { spawnedWorkspaceDir } : {},
    ...spawnedCwd ? { spawnedCwd } : {}
  };
}

// packages/acp-core/src/session.ts
import { randomUUID } from "node:crypto";
var DEFAULT_MAX_SESSIONS = 5e3;
var DEFAULT_IDLE_TTL_MS = 24 * 60 * 60 * 1e3;
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
var defaultAcpSessionStore = createInMemorySessionStore();

// packages/acp-core/src/types.ts
var ACP_PROVENANCE_MODE_VALUES = ["off", "meta", "meta+receipt"];
function normalizeAcpProvenanceMode(value) {
  const normalized = normalizeOptionalLowercaseString(value);
  if (!normalized) {
    return void 0;
  }
  return ACP_PROVENANCE_MODE_VALUES.includes(normalized) ? normalized : void 0;
}

// packages/acp-core/src/runtime/errors.ts
var ACP_ERROR_CODES = [
  "ACP_BACKEND_MISSING",
  "ACP_BACKEND_UNAVAILABLE",
  "ACP_BACKEND_UNSUPPORTED_CONTROL",
  "ACP_DISPATCH_DISABLED",
  "ACP_INVALID_RUNTIME_OPTION",
  "ACP_SESSION_INIT_FAILED",
  "ACP_TURN_FAILED"
];
var ACP_ERROR_CODE_SET = new Set(ACP_ERROR_CODES);
var AcpRuntimeError = class extends Error {
  constructor(code, message, options) {
    super(message);
    this.name = "AcpRuntimeError";
    this.code = code;
    this.detailCode = options?.detailCode;
    this.cause = options?.cause;
  }
};
function getForeignAcpRuntimeError(value) {
  if (!(value instanceof Error)) {
    return null;
  }
  const code = value.code;
  if (typeof code !== "string" || !ACP_ERROR_CODE_SET.has(code)) {
    return null;
  }
  return {
    code,
    message: value.message
  };
}
function readAcpRequestErrorDetails(value) {
  const code = value.code;
  if (typeof code !== "number") {
    return void 0;
  }
  const data = value.data;
  if (!data || typeof data !== "object") {
    return void 0;
  }
  const details = data.details;
  if (details === void 0 || details === null) {
    return void 0;
  }
  const rendered = redactSensitiveText(stringifyNonErrorCause(details)).trim();
  return rendered.length > 0 ? rendered : void 0;
}
function messageWithAcpRequestErrorDetails(error) {
  const details = readAcpRequestErrorDetails(error);
  if (!details || error.message.includes(details)) {
    return error.message;
  }
  return `${error.message}: ${details}`;
}
function isAcpRuntimeError(value) {
  return value instanceof AcpRuntimeError || getForeignAcpRuntimeError(value) !== null;
}
function toAcpRuntimeError(params) {
  if (params.error instanceof AcpRuntimeError) {
    return params.error;
  }
  const foreignAcpRuntimeError = getForeignAcpRuntimeError(params.error);
  if (foreignAcpRuntimeError) {
    return new AcpRuntimeError(foreignAcpRuntimeError.code, foreignAcpRuntimeError.message, {
      cause: params.error
    });
  }
  if (params.error instanceof Error) {
    return new AcpRuntimeError(
      params.fallbackCode,
      messageWithAcpRequestErrorDetails(params.error),
      {
        cause: params.error
      }
    );
  }
  return new AcpRuntimeError(params.fallbackCode, params.fallbackMessage, {
    cause: params.error
  });
}
function formatAcpErrorChain(error) {
  if (!(error instanceof Error)) {
    return redactSensitiveText(String(error));
  }
  const segments = [renderSingleError(error)];
  let current = error.cause;
  let depth = 0;
  while (current !== void 0 && current !== null && depth < 8) {
    if (current instanceof Error) {
      segments.push(renderSingleError(current));
      current = current.cause;
    } else {
      segments.push(stringifyNonErrorCause(current));
      current = void 0;
    }
    depth += 1;
  }
  return redactSensitiveText(segments.join(" <- "));
}
function renderSingleError(error) {
  const codeValue = error.code;
  const codeSuffix = typeof codeValue === "string" || typeof codeValue === "number" ? ` [${codeValue}]` : "";
  return `${error.name}${codeSuffix}: ${error.message}`;
}
async function withAcpRuntimeErrorBoundary(params) {
  try {
    return await params.run();
  } catch (error) {
    throw toAcpRuntimeError({
      error,
      fallbackCode: params.fallbackCode,
      fallbackMessage: params.fallbackMessage
    });
  }
}

// packages/acp-core/src/runtime/error-text.ts
function resolveAcpRuntimeErrorNextStep(error) {
  if (error.code === "ACP_BACKEND_MISSING" || error.code === "ACP_BACKEND_UNAVAILABLE") {
    return "Run `/acp doctor`, install/enable the backend plugin, then retry.";
  }
  if (error.code === "ACP_DISPATCH_DISABLED") {
    return "Enable `acp.dispatch.enabled=true` to allow thread-message ACP turns.";
  }
  if (error.code === "ACP_SESSION_INIT_FAILED") {
    return "If this session is stale, recreate it with `/acp spawn` and rebind the thread.";
  }
  if (error.code === "ACP_INVALID_RUNTIME_OPTION") {
    return "Use `/acp status` to inspect options and pass valid values.";
  }
  if (error.code === "ACP_BACKEND_UNSUPPORTED_CONTROL") {
    return "This backend does not support that control; use a supported command.";
  }
  if (error.code === "ACP_TURN_FAILED") {
    return "Retry, or use `/acp cancel` and send the message again.";
  }
  return void 0;
}
function formatAcpRuntimeErrorText(error) {
  const next = resolveAcpRuntimeErrorNextStep(error);
  if (!next) {
    return `ACP error (${error.code}): ${error.message}`;
  }
  return `ACP error (${error.code}): ${error.message}
next: ${next}`;
}
function toAcpRuntimeErrorText(params) {
  return formatAcpRuntimeErrorText(
    toAcpRuntimeError({
      error: params.error,
      fallbackCode: params.fallbackCode,
      fallbackMessage: params.fallbackMessage
    })
  );
}

// packages/acp-core/src/runtime/session-identity.ts
function normalizeIdentityState(value) {
  if (value !== "pending" && value !== "resolved") {
    return void 0;
  }
  return value;
}
function normalizeIdentitySource(value) {
  if (value !== "ensure" && value !== "status" && value !== "event") {
    return void 0;
  }
  return value;
}
function normalizeIdentity(identity) {
  if (!identity) {
    return void 0;
  }
  const state = normalizeIdentityState(identity.state);
  const source = normalizeIdentitySource(identity.source);
  const acpxRecordId = normalizeOptionalString(identity.acpxRecordId);
  const acpxSessionId = normalizeOptionalString(identity.acpxSessionId);
  const agentSessionId = normalizeOptionalString(identity.agentSessionId);
  const lastUpdatedAt = typeof identity.lastUpdatedAt === "number" && Number.isFinite(identity.lastUpdatedAt) ? identity.lastUpdatedAt : void 0;
  const hasAnyId = Boolean(acpxRecordId || acpxSessionId || agentSessionId);
  if (!state && !source && !hasAnyId && lastUpdatedAt === void 0) {
    return void 0;
  }
  const resolved = Boolean(acpxSessionId || agentSessionId);
  const normalizedState = state ?? (resolved ? "resolved" : "pending");
  return {
    state: normalizedState,
    ...acpxRecordId ? { acpxRecordId } : {},
    ...acpxSessionId ? { acpxSessionId } : {},
    ...agentSessionId ? { agentSessionId } : {},
    source: source ?? "status",
    lastUpdatedAt: lastUpdatedAt ?? Date.now()
  };
}
function readIdentityIdsFromHandle(handle) {
  return {
    acpxRecordId: normalizeOptionalString(handle.acpxRecordId),
    acpxSessionId: normalizeOptionalString(handle.backendSessionId),
    agentSessionId: normalizeOptionalString(handle.agentSessionId)
  };
}
function buildSessionIdentity(params) {
  const { acpxRecordId, acpxSessionId, agentSessionId } = params.ids;
  if (!acpxRecordId && !acpxSessionId && !agentSessionId) {
    return void 0;
  }
  return {
    state: params.state,
    ...acpxRecordId ? { acpxRecordId } : {},
    ...acpxSessionId ? { acpxSessionId } : {},
    ...agentSessionId ? { agentSessionId } : {},
    source: params.source,
    lastUpdatedAt: params.now
  };
}
function resolveSessionIdentityFromMeta(meta) {
  if (!meta) {
    return void 0;
  }
  return normalizeIdentity(meta.identity);
}
function identityHasStableSessionId(identity) {
  return Boolean(identity?.acpxSessionId || identity?.agentSessionId);
}
function resolveRuntimeResumeSessionId(identity) {
  if (!identity) {
    return void 0;
  }
  return normalizeOptionalString(identity.agentSessionId) ?? normalizeOptionalString(identity.acpxSessionId);
}
function isSessionIdentityPending(identity) {
  if (!identity) {
    return true;
  }
  return identity.state === "pending";
}
function identityEquals(left, right) {
  const a = normalizeIdentity(left);
  const b = normalizeIdentity(right);
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.state === b.state && a.acpxRecordId === b.acpxRecordId && a.acpxSessionId === b.acpxSessionId && a.agentSessionId === b.agentSessionId && a.source === b.source;
}
function mergeSessionIdentity(params) {
  const current = normalizeIdentity(params.current);
  const incoming = normalizeIdentity(params.incoming);
  if (!current) {
    if (!incoming) {
      return void 0;
    }
    return { ...incoming, lastUpdatedAt: params.now };
  }
  if (!incoming) {
    return current;
  }
  const currentResolved = current.state === "resolved";
  const incomingResolved = incoming.state === "resolved";
  const allowIncomingValue = !currentResolved || incomingResolved;
  const nextRecordId = allowIncomingValue && incoming.acpxRecordId ? incoming.acpxRecordId : current.acpxRecordId;
  const nextAcpxSessionId = allowIncomingValue && incoming.acpxSessionId ? incoming.acpxSessionId : current.acpxSessionId;
  const nextAgentSessionId = allowIncomingValue && incoming.agentSessionId ? incoming.agentSessionId : current.agentSessionId;
  const nextResolved = Boolean(nextAcpxSessionId || nextAgentSessionId);
  const nextState = nextResolved ? "resolved" : currentResolved ? "resolved" : incoming.state;
  const nextSource = allowIncomingValue ? incoming.source : current.source;
  const next = {
    state: nextState,
    ...nextRecordId ? { acpxRecordId: nextRecordId } : {},
    ...nextAcpxSessionId ? { acpxSessionId: nextAcpxSessionId } : {},
    ...nextAgentSessionId ? { agentSessionId: nextAgentSessionId } : {},
    source: nextSource,
    lastUpdatedAt: params.now
  };
  return next;
}
function createIdentityFromEnsure(params) {
  return buildSessionIdentity({
    ids: readIdentityIdsFromHandle(params.handle),
    state: "pending",
    source: "ensure",
    now: params.now
  });
}
function createIdentityFromHandleEvent(params) {
  const ids = readIdentityIdsFromHandle(params.handle);
  return buildSessionIdentity({
    ids,
    state: ids.agentSessionId ? "resolved" : "pending",
    source: "event",
    now: params.now
  });
}
function createIdentityFromStatus(params) {
  if (!params.status) {
    return void 0;
  }
  const details = params.status.details;
  const acpxRecordId = normalizeOptionalString(params.status.acpxRecordId) ?? normalizeOptionalString(details?.acpxRecordId);
  const acpxSessionId = normalizeOptionalString(params.status.backendSessionId) ?? normalizeOptionalString(details?.backendSessionId) ?? normalizeOptionalString(details?.acpxSessionId);
  const agentSessionId = normalizeOptionalString(params.status.agentSessionId) ?? normalizeOptionalString(details?.agentSessionId);
  if (!acpxRecordId && !acpxSessionId && !agentSessionId) {
    return void 0;
  }
  const resolved = Boolean(acpxSessionId || agentSessionId);
  return {
    state: resolved ? "resolved" : "pending",
    ...acpxRecordId ? { acpxRecordId } : {},
    ...acpxSessionId ? { acpxSessionId } : {},
    ...agentSessionId ? { agentSessionId } : {},
    source: "status",
    lastUpdatedAt: params.now
  };
}
function resolveRuntimeHandleIdentifiersFromIdentity(identity) {
  if (!identity) {
    return {};
  }
  return {
    ...identity.acpxSessionId ? { backendSessionId: identity.acpxSessionId } : {},
    ...identity.agentSessionId ? { agentSessionId: identity.agentSessionId } : {}
  };
}

// packages/acp-core/src/runtime/session-identifiers.ts
var ACP_SESSION_IDENTITY_RENDERER_VERSION = "v1";
var ACP_AGENT_RESUME_HINT_BY_KEY = /* @__PURE__ */ new Map([
  [
    "codex",
    ({ agentSessionId }) => `resume in Codex CLI: \`codex resume ${agentSessionId}\` (continues this conversation).`
  ],
  [
    "openai",
    ({ agentSessionId }) => `resume in Codex CLI: \`codex resume ${agentSessionId}\` (continues this conversation).`
  ],
  [
    "codex-cli",
    ({ agentSessionId }) => `resume in Codex CLI: \`codex resume ${agentSessionId}\` (continues this conversation).`
  ],
  [
    "kimi",
    ({ agentSessionId }) => `resume in Kimi CLI: \`kimi resume ${agentSessionId}\` (continues this conversation).`
  ],
  [
    "moonshot-kimi",
    ({ agentSessionId }) => `resume in Kimi CLI: \`kimi resume ${agentSessionId}\` (continues this conversation).`
  ]
]);
function normalizeAgentHintKey(value) {
  const normalized = normalizeOptionalString(value);
  if (!normalized) {
    return void 0;
  }
  return normalizeLowercaseStringOrEmpty(normalized).replace(/[\s_]+/g, "-");
}
function resolveAcpAgentResumeHintLine(params) {
  const agentSessionId = normalizeOptionalString(params.agentSessionId);
  const agentKey = normalizeAgentHintKey(params.agentId);
  if (!agentSessionId || !agentKey) {
    return void 0;
  }
  const resolver = ACP_AGENT_RESUME_HINT_BY_KEY.get(agentKey);
  return resolver ? resolver({ agentSessionId }) : void 0;
}
function resolveAcpSessionIdentifierLinesFromIdentity(params) {
  const backend = normalizeOptionalString(params.backend) ?? "backend";
  const mode = params.mode ?? "status";
  const identity = params.identity;
  const agentSessionId = normalizeOptionalString(identity?.agentSessionId);
  const acpxSessionId = normalizeOptionalString(identity?.acpxSessionId);
  const acpxRecordId = normalizeOptionalString(identity?.acpxRecordId);
  const hasIdentifier = Boolean(agentSessionId || acpxSessionId || acpxRecordId);
  if (isSessionIdentityPending(identity) && hasIdentifier) {
    if (mode === "status") {
      return ["session ids: pending (available after the first reply)"];
    }
    return [];
  }
  const lines = [];
  if (agentSessionId) {
    lines.push(`agent session id: ${agentSessionId}`);
  }
  if (acpxSessionId) {
    lines.push(`${backend} session id: ${acpxSessionId}`);
  }
  if (acpxRecordId) {
    lines.push(`${backend} record id: ${acpxRecordId}`);
  }
  return lines;
}
function resolveAcpSessionCwd(meta) {
  const runtimeCwd = normalizeOptionalString(meta?.runtimeOptions?.cwd);
  if (runtimeCwd) {
    return runtimeCwd;
  }
  return normalizeOptionalString(meta?.cwd);
}
function resolveAcpThreadSessionDetailLines(params) {
  const meta = params.meta;
  const identity = resolveSessionIdentityFromMeta(meta);
  const backend = normalizeOptionalString(meta?.backend) ?? "backend";
  const lines = resolveAcpSessionIdentifierLinesFromIdentity({
    backend,
    identity,
    mode: "thread"
  });
  if (lines.length === 0) {
    return lines;
  }
  const hint = resolveAcpAgentResumeHintLine({
    agentId: meta?.agent,
    agentSessionId: identity?.agentSessionId
  });
  if (hint) {
    lines.push(hint);
  }
  return lines;
}
export {
  ACP_ERROR_CODES,
  ACP_SESSION_IDENTITY_RENDERER_VERSION,
  AcpRuntimeError,
  CREDENTIAL_STYLE_HEADER_REDACT_PATTERN,
  HTTP_AUTH_HEADER_BOUNDARY_PATTERN,
  HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN,
  HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN,
  HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN,
  HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN,
  HTTP_AUTH_SCHEME_PATTERN,
  HTTP_AUTH_SERIALIZED_QUOTE_PATTERN,
  asOptionalRecord as asRecord,
  configureAcpErrorRedactor,
  createIdentityFromEnsure,
  createIdentityFromHandleEvent,
  createIdentityFromStatus,
  createInMemorySessionStore,
  defaultAcpSessionStore,
  findStructuredAuthParamRanges,
  formatAcpErrorChain,
  formatAcpRuntimeErrorText,
  identityEquals,
  identityHasStableSessionId,
  isAcpRuntimeError,
  isParentOwnedBackgroundAcpSession,
  isRequesterParentOfBackgroundAcpSession,
  isSessionIdentityPending,
  mergeSessionIdentity,
  normalizeAcpProvenanceMode,
  normalizeOptionalString as normalizeText,
  readBool,
  readNonNegativeInteger,
  readNumber,
  readString,
  redactSensitiveText,
  redactStructuredAuthHeaders,
  resolveAcpSessionCwd,
  resolveAcpSessionIdentifierLinesFromIdentity,
  resolveAcpThreadSessionDetailLines,
  resolveIntegerOption2 as resolveIntegerOption,
  resolveRuntimeHandleIdentifiersFromIdentity,
  resolveRuntimeResumeSessionId,
  resolveSessionIdentityFromMeta,
  stringifyNonErrorCause,
  toAcpRuntimeError,
  toAcpRuntimeErrorText,
  toAcpSessionLineageMeta,
  withAcpRuntimeErrorBoundary
};
