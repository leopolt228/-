// packages/normalization-core/src/record-coerce.ts
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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

// packages/ai/src/host.ts
var inertAiTransportHost = {
  buildModelFetch: () => void 0,
  resolveSecretSentinel: (value) => value,
  redactSecrets: (value) => value,
  redactToolPayloadText: (text) => text,
  resolveOpenAIStrictToolSetting: (_model, options) => options?.supportsStrictMode ? false : void 0,
  logDebug: () => {
  }
};
var activeAiTransportHost = inertAiTransportHost;
function getAiTransportHost() {
  return activeAiTransportHost;
}

// packages/ai/src/utils/sanitize-unicode.ts
function sanitizeSurrogates(text) {
  return text.replace(
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
    ""
  );
}

// packages/ai/src/providers/tool-result-text.ts
var PROVIDER_TOOL_RESULT_MAX_CHARS = 8e3;
var IMAGE_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set(["image", "image_url", "input_image"]);
var AUDIO_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set(["audio", "input_audio", "output_audio"]);
var MEDIA_ONLY_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set([
  ...IMAGE_TOOL_RESULT_TYPES,
  ...AUDIO_TOOL_RESULT_TYPES
]);
var INLINE_DATA_URI_PATTERN = /(^|[^A-Za-z0-9_])data:([a-z][a-z0-9.+-]*\/[a-z0-9.+-]+(?:;[a-z0-9.+-]+=[^,;"'\s]+|;base64)*,[^\s"'<>)]+)/gi;
var MIME_KEY_CANDIDATES = [
  "mimeType",
  "mime_type",
  "mediaType",
  "media_type",
  "contentType",
  "content_type"
];
var TEXTUAL_MIME_PATTERN = /^(?:text\/|application\/(?:json|ld\+json|x-ndjson|xml|javascript|x-www-form-urlencoded)|[^/]+\/[^+]+\+(?:json|xml)$)/i;
var OPAQUE_OR_BINARY_FIELD_RE = /^(?:blob|buffer|bytes|encrypted_content|encrypted_stdout)$/i;
function readMimeType(value) {
  if (!isRecord(value)) {
    return void 0;
  }
  for (const key of MIME_KEY_CANDIDATES) {
    const mimeType = value[key];
    if (typeof mimeType === "string" && mimeType.trim().length > 0) {
      return mimeType;
    }
  }
  return void 0;
}
function isBinaryMimeType(mimeType) {
  const normalized = mimeType.split(";", 1)[0]?.trim().toLowerCase();
  return normalized ? !TEXTUAL_MIME_PATTERN.test(normalized) : false;
}
function describeOmittedValue(value, label) {
  const length = typeof value === "string" ? value.length : JSON.stringify(value)?.length;
  return length ? `[${label} omitted: ${length} chars]` : `[${label} omitted]`;
}
function redactInlineDataUris(value) {
  return value.replace(
    INLINE_DATA_URI_PATTERN,
    (_match, prefix, uri) => `${prefix}[inline data URI: ${uri.length} chars]`
  );
}
function redactStructuredTextValue(value) {
  const host = getAiTransportHost();
  const redacted = host.redactToolPayloadText(value);
  const trimmed = redacted.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return redacted;
  }
  try {
    const redactedWrapper = host.redactSecrets({ structuredTextValue: JSON.parse(redacted) });
    return JSON.stringify(redactedWrapper.structuredTextValue);
  } catch {
    return redacted;
  }
}
function stringifyStructuredBlock(block) {
  const seen = /* @__PURE__ */ new WeakSet();
  try {
    const redactedWrapper = getAiTransportHost().redactSecrets({ structuredToolResult: block });
    const redactedBlock = redactedWrapper.structuredToolResult;
    const serialized = JSON.stringify(
      redactedBlock,
      function structuredToolResultReplacer(key, value) {
        if (OPAQUE_OR_BINARY_FIELD_RE.test(key)) {
          return `[omitted ${key}]`;
        }
        if (key === "data") {
          const mimeType = readMimeType(this);
          if (mimeType && isBinaryMimeType(mimeType)) {
            return describeOmittedValue(value, "binary data");
          }
        }
        if (typeof value === "bigint") {
          return value.toString();
        }
        if (typeof value === "string") {
          return redactInlineDataUris(redactStructuredTextValue(value));
        }
        if (typeof value === "function" || typeof value === "symbol" || value === void 0) {
          return void 0;
        }
        if (!value || typeof value !== "object") {
          return value;
        }
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
        return value;
      }
    );
    if (!serialized || serialized === "{}") {
      return void 0;
    }
    return serialized;
  } catch {
    return void 0;
  }
}
function truncateProviderToolText(text) {
  if (text.length <= PROVIDER_TOOL_RESULT_MAX_CHARS) {
    return text;
  }
  return `${truncateUtf16Safe(text, PROVIDER_TOOL_RESULT_MAX_CHARS)}
\u2026(truncated)\u2026`;
}
function hasMediaPayload(block) {
  return isRecord(block) && typeof block.data === "string" && block.data.trim().length > 0;
}
function isImageWithMediaPayload(block) {
  return isRecord(block) && block.type === "image" && hasMediaPayload(block);
}
function describeToolResultMediaPlaceholder(blocks) {
  let hasImage = false;
  let hasAudio = false;
  for (const block of blocks) {
    if (!hasMediaPayload(block)) {
      continue;
    }
    const record = block;
    const type = typeof record.type === "string" ? record.type : void 0;
    const mimeType = readMimeType(record);
    if (type && IMAGE_TOOL_RESULT_TYPES.has(type) || mimeType?.toLowerCase().startsWith("image/")) {
      hasImage = true;
    }
    if (type && AUDIO_TOOL_RESULT_TYPES.has(type) || mimeType?.toLowerCase().startsWith("audio/")) {
      hasAudio = true;
    }
  }
  if (hasImage && hasAudio) {
    return "(see attached media)";
  }
  if (hasAudio) {
    return "(see attached audio)";
  }
  if (hasImage) {
    return "(see attached image)";
  }
  return void 0;
}
function extractToolResultBlockText(block) {
  if (!block || typeof block !== "object") {
    return void 0;
  }
  const record = block;
  if (typeof record.type === "string" && MEDIA_ONLY_TOOL_RESULT_TYPES.has(record.type)) {
    return void 0;
  }
  if (record.type === "text") {
    const text = typeof record.text === "string" ? record.text : "";
    return text ? sanitizeSurrogates(text) : void 0;
  }
  const structured = stringifyStructuredBlock(record);
  return structured ? sanitizeSurrogates(truncateProviderToolText(structured)) : void 0;
}
function extractToolResultText(blocks) {
  const explicitTexts = [];
  const structuredTexts = [];
  for (const block of blocks) {
    const text = extractToolResultBlockText(block);
    if (!text) {
      continue;
    }
    const record = block;
    if (record.type === "text") {
      explicitTexts.push(text);
    } else {
      structuredTexts.push(text);
    }
  }
  if (explicitTexts.length > 0) {
    return sanitizeSurrogates(explicitTexts.join("\n"));
  }
  return sanitizeSurrogates(truncateProviderToolText(structuredTexts.join("\n")));
}
export {
  describeToolResultMediaPlaceholder,
  extractToolResultBlockText,
  extractToolResultText,
  hasMediaPayload,
  isImageWithMediaPayload
};
