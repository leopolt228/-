// packages/memory-host-sdk/src/host/embedding-input-limits.ts
function estimateUtf8Bytes(text) {
  if (!text) {
    return 0;
  }
  return Buffer.byteLength(text, "utf8");
}
function splitTextToUtf8ByteLimit(text, maxUtf8Bytes) {
  if (maxUtf8Bytes <= 0) {
    return [text];
  }
  if (estimateUtf8Bytes(text) <= maxUtf8Bytes) {
    return [text];
  }
  const parts = [];
  let cursor = 0;
  while (cursor < text.length) {
    let low = cursor + 1;
    let high = Math.min(text.length, cursor + maxUtf8Bytes);
    let best = cursor;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const bytes = estimateUtf8Bytes(text.slice(cursor, mid));
      if (bytes <= maxUtf8Bytes) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    if (best <= cursor) {
      best = Math.min(text.length, cursor + 1);
    }
    if (best < text.length && best > cursor && text.charCodeAt(best - 1) >= 55296 && text.charCodeAt(best - 1) <= 56319 && text.charCodeAt(best) >= 56320 && text.charCodeAt(best) <= 57343) {
      best -= 1;
    }
    const part = text.slice(cursor, best);
    if (!part) {
      break;
    }
    parts.push(part);
    cursor = best;
  }
  return parts;
}

// packages/memory-host-sdk/src/host/embedding-inputs.ts
function hasNonTextEmbeddingParts(input) {
  if (!input?.parts?.length) {
    return false;
  }
  return input.parts.some((part) => part.type === "inline-data");
}

// packages/memory-host-sdk/src/host/embedding-model-limits.ts
var DEFAULT_EMBEDDING_MAX_INPUT_TOKENS = 8192;
var DEFAULT_LOCAL_EMBEDDING_MAX_INPUT_TOKENS = 2048;
function resolveEmbeddingMaxInputTokens(provider) {
  if (typeof provider.maxInputTokens === "number") {
    return provider.maxInputTokens;
  }
  if (provider.id === "local") {
    return DEFAULT_LOCAL_EMBEDDING_MAX_INPUT_TOKENS;
  }
  return DEFAULT_EMBEDDING_MAX_INPUT_TOKENS;
}

// packages/memory-host-sdk/src/host/hash.ts
import crypto from "node:crypto";
function hashText(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

// packages/memory-host-sdk/src/host/embedding-chunk-limits.ts
function enforceEmbeddingMaxInputTokens(provider, chunks, hardMaxInputTokens) {
  const providerMaxInputTokens = resolveEmbeddingMaxInputTokens(provider);
  const maxInputTokens = typeof hardMaxInputTokens === "number" && hardMaxInputTokens > 0 ? Math.min(providerMaxInputTokens, hardMaxInputTokens) : providerMaxInputTokens;
  const out = [];
  for (const chunk of chunks) {
    if (hasNonTextEmbeddingParts(chunk.embeddingInput)) {
      out.push(chunk);
      continue;
    }
    if (estimateUtf8Bytes(chunk.text) <= maxInputTokens) {
      out.push(chunk);
      continue;
    }
    for (const text of splitTextToUtf8ByteLimit(chunk.text, maxInputTokens)) {
      out.push({
        startLine: chunk.startLine,
        endLine: chunk.endLine,
        text,
        hash: hashText(text),
        embeddingInput: { text }
      });
    }
  }
  return out;
}
export {
  enforceEmbeddingMaxInputTokens
};
