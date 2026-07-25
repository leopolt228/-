// packages/media-core/src/base64.ts
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

// packages/media-core/src/inline-image-data-url.ts
var INLINE_IMAGE_DATA_URL_PREFIX = "data:";
var IMAGE_SIGNATURES = [
  {
    mime: "image/png",
    matches: (buffer) => buffer.length >= 8 && buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71 && buffer[4] === 13 && buffer[5] === 10 && buffer[6] === 26 && buffer[7] === 10
  },
  {
    mime: "image/jpeg",
    matches: (buffer) => buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255
  },
  {
    mime: "image/webp",
    matches: (buffer) => buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP"
  },
  {
    mime: "image/gif",
    matches: (buffer) => buffer.length >= 6 && (buffer.subarray(0, 6).toString("ascii") === "GIF87a" || buffer.subarray(0, 6).toString("ascii") === "GIF89a")
  },
  {
    mime: "image/bmp",
    matches: (buffer) => buffer.length >= 2 && buffer[0] === 66 && buffer[1] === 77
  }
];
var HEIC_BRANDS = /* @__PURE__ */ new Set(["heic", "heix", "hevc", "hevx", "heis", "heim", "hevm", "hevs"]);
var HEIF_BRANDS = /* @__PURE__ */ new Set(["mif1", "msf1"]);
var IMAGE_SIGNATURE_PREFIX_BASE64_CHARS = 128;
var INLINE_IMAGE_DATA_URL_MIMES = /* @__PURE__ */ new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
function startsWithDataUrl(value) {
  return value.slice(0, INLINE_IMAGE_DATA_URL_PREFIX.length).toLowerCase() === INLINE_IMAGE_DATA_URL_PREFIX;
}
function sniffIsoBmffImageMime(buffer) {
  if (buffer.length < 12 || buffer.subarray(4, 8).toString("ascii") !== "ftyp") {
    return void 0;
  }
  const brands = [buffer.subarray(8, 12).toString("ascii")];
  for (let offset = 16; offset + 4 <= buffer.length; offset += 4) {
    brands.push(buffer.subarray(offset, offset + 4).toString("ascii"));
  }
  if (brands.some((brand) => HEIC_BRANDS.has(brand))) {
    return "image/heic";
  }
  if (brands.some((brand) => HEIF_BRANDS.has(brand))) {
    return "image/heif";
  }
  return void 0;
}
function sniffInlineImageMime(buffer) {
  return IMAGE_SIGNATURES.find((signature) => signature.matches(buffer))?.mime ?? sniffIsoBmffImageMime(buffer);
}
function isImageMimeType(value) {
  return value.trim().toLowerCase().startsWith("image/");
}
function sanitizeInlineImageBase64(params) {
  if (!isImageMimeType(params.mimeType)) {
    return void 0;
  }
  const canonicalPayload = canonicalizeBase64(params.base64);
  if (!canonicalPayload) {
    return void 0;
  }
  const sniffedMimeType = sniffInlineImageMime(
    Buffer.from(canonicalPayload.slice(0, IMAGE_SIGNATURE_PREFIX_BASE64_CHARS), "base64")
  );
  if (!sniffedMimeType) {
    return void 0;
  }
  return {
    mimeType: sniffedMimeType,
    base64: canonicalPayload
  };
}
function parseInlineImageDataUrl(value) {
  if (!startsWithDataUrl(value)) {
    return { metadata: [], payload: value };
  }
  const commaIndex = value.indexOf(",");
  if (commaIndex < 0) {
    return void 0;
  }
  return {
    metadata: value.slice(INLINE_IMAGE_DATA_URL_PREFIX.length, commaIndex).split(";").map((part) => part.trim()),
    payload: value.slice(commaIndex + 1)
  };
}
function metadataAllowsImageBase64(metadata) {
  const [mimeType, ...options] = metadata;
  return mimeType !== void 0 && isImageMimeType(mimeType) && options.some((part) => part.toLowerCase() === "base64");
}
function sanitizeInlineImageDataUrlWithAllowedMimes(imageUrl, allowedMimes) {
  const parsed = parseInlineImageDataUrl(imageUrl);
  if (!parsed) {
    return void 0;
  }
  if (parsed.metadata.length === 0) {
    return imageUrl;
  }
  if (!metadataAllowsImageBase64(parsed.metadata)) {
    return void 0;
  }
  const [mimeType] = parsed.metadata;
  const sanitized = sanitizeInlineImageBase64({
    mimeType: mimeType ?? "",
    base64: parsed.payload
  });
  if (!sanitized) {
    return void 0;
  }
  if (allowedMimes && !allowedMimes.has(sanitized.mimeType)) {
    return void 0;
  }
  return `data:${sanitized.mimeType};base64,${sanitized.base64}`;
}
function sanitizeInlineImageDataUrlForStorage(imageUrl) {
  return sanitizeInlineImageDataUrlWithAllowedMimes(imageUrl);
}
function sanitizeInlineImageDataUrl(imageUrl) {
  return sanitizeInlineImageDataUrlWithAllowedMimes(imageUrl, INLINE_IMAGE_DATA_URL_MIMES);
}
export {
  INLINE_IMAGE_DATA_URL_PREFIX,
  sanitizeInlineImageBase64,
  sanitizeInlineImageDataUrl,
  sanitizeInlineImageDataUrlForStorage,
  sniffInlineImageMime
};
