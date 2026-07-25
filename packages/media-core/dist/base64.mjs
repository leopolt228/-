// packages/media-core/src/base64.ts
function estimateBase64DecodedBytes(base64) {
  let effectiveLen = 0;
  for (let i = 0; i < base64.length; i += 1) {
    const code = base64.charCodeAt(i);
    if (code <= 32) {
      continue;
    }
    effectiveLen += 1;
  }
  if (effectiveLen === 0) {
    return 0;
  }
  let padding = 0;
  let end = base64.length - 1;
  while (end >= 0 && base64.charCodeAt(end) <= 32) {
    end -= 1;
  }
  if (end >= 0 && base64[end] === "=") {
    padding = 1;
    end -= 1;
    while (end >= 0 && base64.charCodeAt(end) <= 32) {
      end -= 1;
    }
    if (end >= 0 && base64[end] === "=") {
      padding = 2;
    }
  }
  const estimated = Math.floor(effectiveLen * 3 / 4) - padding;
  return Math.max(0, estimated);
}
var CANONICALIZE_BASE64_CHUNK_SIZE = 8192;
function isBase64DataChar(code) {
  return code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || code === 43 || code === 47;
}
function canonicalizeBase64(base64) {
  const chunks = [];
  let current = "";
  let cleanedLength = 0;
  let padding = 0;
  let sawPadding = false;
  const append = (char) => {
    current += char;
    cleanedLength += 1;
    if (current.length >= CANONICALIZE_BASE64_CHUNK_SIZE) {
      chunks.push(current);
      current = "";
    }
  };
  for (let i = 0; i < base64.length; i += 1) {
    const code = base64.charCodeAt(i);
    if (code <= 32) {
      continue;
    }
    if (code === 61) {
      padding += 1;
      if (padding > 2) {
        return void 0;
      }
      sawPadding = true;
      append("=");
      continue;
    }
    if (sawPadding || !isBase64DataChar(code)) {
      return void 0;
    }
    append(base64[i] ?? "");
  }
  if (cleanedLength === 0) {
    return void 0;
  }
  const remainder = cleanedLength % 4;
  if (remainder !== 0) {
    if (sawPadding || remainder === 1) {
      return void 0;
    }
    current += "=".repeat(4 - remainder);
  }
  if (current) {
    chunks.push(current);
  }
  return chunks.join("");
}
export {
  canonicalizeBase64,
  estimateBase64DecodedBytes
};
