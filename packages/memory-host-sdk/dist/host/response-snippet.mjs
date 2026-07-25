// packages/normalization-core/src/number-coercion.ts
var MAX_TIMER_TIMEOUT_MS = 2147e6;
var MAX_TIMER_TIMEOUT_SECONDS = Math.floor(MAX_TIMER_TIMEOUT_MS / 1e3);

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

// packages/memory-host-sdk/src/host/response-snippet.ts
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
export {
  readMemoryHostResponseTextSnippet,
  readResponseJsonWithLimit
};
