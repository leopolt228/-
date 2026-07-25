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

// packages/media-core/src/constants.ts
var MAX_IMAGE_BYTES = 6 * 1024 * 1024;
var MAX_AUDIO_BYTES = 16 * 1024 * 1024;
var MAX_VIDEO_BYTES = 16 * 1024 * 1024;
var MAX_DOCUMENT_BYTES = 100 * 1024 * 1024;
function mediaKindFromMime(mime) {
  if (!mime) {
    return void 0;
  }
  if (mime.startsWith("image/")) {
    return "image";
  }
  if (mime.startsWith("audio/")) {
    return "audio";
  }
  if (mime.startsWith("video/")) {
    return "video";
  }
  if (mime === "application/pdf") {
    return "document";
  }
  if (mime.startsWith("text/")) {
    return "document";
  }
  if (mime.startsWith("application/")) {
    return "document";
  }
  return void 0;
}
function maxBytesForKind(kind) {
  switch (kind) {
    case "image":
      return MAX_IMAGE_BYTES;
    case "audio":
      return MAX_AUDIO_BYTES;
    case "video":
      return MAX_VIDEO_BYTES;
    case "document":
      return MAX_DOCUMENT_BYTES;
    default:
      return MAX_DOCUMENT_BYTES;
  }
}

// packages/media-core/src/content-length.ts
function parseMediaContentLength(raw) {
  if (raw === null) {
    return null;
  }
  const values = raw.split(",").map((value2) => value2.replace(/^[\t ]+|[\t ]+$/g, ""));
  const value = values[0] ?? "";
  if (!/^\d+$/.test(value) || values.some((candidate) => candidate !== value)) {
    throw new Error(`invalid content-length header: ${raw}`);
  }
  const size = Number(value);
  if (!Number.isSafeInteger(size)) {
    throw new Error(`invalid content-length header: ${raw}`);
  }
  return size;
}

// packages/media-core/src/file-name.ts
import path from "node:path";
function basenameFromAnyPath(value) {
  return path.win32.basename(path.posix.basename(value));
}
function extnameFromAnyPath(value) {
  return path.extname(basenameFromAnyPath(value));
}
function nameFromAnyPath(value) {
  const base = basenameFromAnyPath(value);
  const ext = path.extname(base);
  return path.basename(base, ext);
}

// packages/media-core/src/inbound-path-policy.ts
import path2 from "node:path";
var WILDCARD_SEGMENT = "*";
var WINDOWS_DRIVE_ABS_RE = /^[A-Za-z]:\//;
var WINDOWS_DRIVE_ROOT_RE = /^[A-Za-z]:$/;
function normalizePosixAbsolutePath(value) {
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes("\0")) {
    return void 0;
  }
  const normalized = path2.posix.normalize(trimmed.replaceAll("\\", "/"));
  const isAbsolute = normalized.startsWith("/") || WINDOWS_DRIVE_ABS_RE.test(normalized);
  if (!isAbsolute || normalized === "/") {
    return void 0;
  }
  const withoutTrailingSlash = normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
  if (WINDOWS_DRIVE_ROOT_RE.test(withoutTrailingSlash)) {
    return void 0;
  }
  return WINDOWS_DRIVE_ABS_RE.test(withoutTrailingSlash) ? withoutTrailingSlash.toLowerCase() : withoutTrailingSlash;
}
function splitPathSegments(value) {
  return value.split("/").filter(Boolean);
}
function matchesRootPattern(params) {
  const candidateSegments = splitPathSegments(params.candidatePath);
  const rootSegments = splitPathSegments(params.rootPattern);
  if (candidateSegments.length < rootSegments.length) {
    return false;
  }
  for (let idx = 0; idx < rootSegments.length; idx += 1) {
    const expected = rootSegments[idx];
    const actual = candidateSegments[idx];
    if (expected === WILDCARD_SEGMENT) {
      continue;
    }
    if (expected !== actual) {
      return false;
    }
  }
  return true;
}
function isValidInboundPathRootPattern(value) {
  const normalized = normalizePosixAbsolutePath(value);
  if (!normalized) {
    return false;
  }
  const segments = splitPathSegments(normalized);
  if (segments.length === 0) {
    return false;
  }
  return segments.every((segment) => segment === WILDCARD_SEGMENT || !segment.includes("*"));
}
function normalizeInboundPathRoots(roots) {
  const normalized = [];
  const seen = /* @__PURE__ */ new Set();
  for (const root of roots ?? []) {
    if (typeof root !== "string") {
      continue;
    }
    if (!isValidInboundPathRootPattern(root)) {
      continue;
    }
    const candidate = normalizePosixAbsolutePath(root);
    if (!candidate || seen.has(candidate)) {
      continue;
    }
    seen.add(candidate);
    normalized.push(candidate);
  }
  return normalized;
}
function mergeInboundPathRoots(...rootsLists) {
  const merged = [];
  const seen = /* @__PURE__ */ new Set();
  for (const roots of rootsLists) {
    const normalized = normalizeInboundPathRoots(roots);
    for (const root of normalized) {
      if (seen.has(root)) {
        continue;
      }
      seen.add(root);
      merged.push(root);
    }
  }
  return merged;
}
function isInboundPathAllowed(params) {
  const candidatePath = normalizePosixAbsolutePath(params.filePath);
  if (!candidatePath) {
    return false;
  }
  const roots = normalizeInboundPathRoots(params.roots);
  const effectiveRoots = roots.length > 0 ? roots : normalizeInboundPathRoots(params.fallbackRoots ?? void 0);
  if (effectiveRoots.length === 0) {
    return false;
  }
  return effectiveRoots.some((rootPattern) => matchesRootPattern({ candidatePath, rootPattern }));
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

// packages/media-core/src/media-source-url.ts
var HTTP_URL_RE = /^https?:\/\//i;
var MXC_URL_RE = /^mxc:\/\//i;
var BUFFER_URL_RE = /^buffer:\/\//i;
function isPassThroughRemoteMediaSource(value) {
  const normalized = value?.trim() ?? "";
  return Boolean(normalized) && (HTTP_URL_RE.test(normalized) || MXC_URL_RE.test(normalized) || BUFFER_URL_RE.test(normalized));
}

// packages/media-core/src/mime.ts
import path3 from "node:path";
var FILE_TYPE_SNIFF_MAX_BYTES = 1024 * 1024;
var EXT_BY_MIME = {
  "image/heic": ".heic",
  "image/heif": ".heif",
  "image/bmp": ".bmp",
  "image/jpg": ".jpg",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/svg+xml": ".svg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "audio/ogg": ".ogg",
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "audio/wav": ".wav",
  "audio/wave": ".wav",
  "audio/x-wav": ".wav",
  "audio/flac": ".flac",
  "audio/aac": ".aac",
  "audio/opus": ".opus",
  "audio/webm": ".webm",
  "audio/x-m4a": ".m4a",
  "audio/m4a": ".m4a",
  "audio/mp4": ".m4a",
  "audio/x-caf": ".caf",
  "video/x-msvideo": ".avi",
  "video/mp4": ".mp4",
  "video/x-matroska": ".mkv",
  "video/webm": ".webm",
  "video/x-flv": ".flv",
  "video/x-ms-wmv": ".wmv",
  "video/quicktime": ".mov",
  "application/pdf": ".pdf",
  "application/json": ".json",
  "application/yaml": ".yaml",
  "application/zip": ".zip",
  "application/gzip": ".gz",
  "application/x-tar": ".tar",
  "application/x-7z-compressed": ".7z",
  "application/vnd.rar": ".rar",
  "application/msword": ".doc",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.ms-powerpoint": ".ppt",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
  "text/csv": ".csv",
  "text/plain": ".txt",
  "text/markdown": ".md",
  "text/html": ".html",
  "text/xml": ".xml",
  "text/css": ".css",
  "application/xml": ".xml"
};
function buildMimeByExt() {
  const byExt = {};
  for (const [mime, ext] of Object.entries(EXT_BY_MIME)) {
    byExt[ext] ??= mime;
  }
  return byExt;
}
var MIME_BY_EXT = {
  ...buildMimeByExt(),
  // Canonical extension mappings for common MIME aliases
  ".jpg": "image/jpeg",
  ".m2a": "audio/mpeg",
  ".mp3": "audio/mpeg",
  ".oga": "audio/ogg",
  ".wav": "audio/wav",
  ".webm": "video/webm",
  // Additional extension aliases
  ".jpeg": "image/jpeg",
  ".js": "text/javascript",
  ".log": "text/plain",
  ".htm": "text/html",
  ".xml": "text/xml",
  ".yml": "application/yaml"
};
var AMBIGUOUS_VIDEO_MIME_BY_AUDIO_MIME = {
  "audio/mp4": "video/mp4",
  "audio/x-m4a": "video/mp4",
  "audio/m4a": "video/mp4",
  "audio/webm": "video/webm"
};
var ZIP_CONTAINER_MIMES = /* @__PURE__ */ new Set([
  "application/java-archive",
  "application/vnd.android.package-archive",
  "application/vnd.apple.keynote",
  "application/vnd.apple.numbers",
  "application/vnd.apple.pages",
  "application/vnd.google-earth.kmz",
  "application/vnd.ms-excel.sheet.macroenabled.12",
  "application/vnd.ms-excel.template.macroenabled.12",
  "application/vnd.ms-powerpoint.presentation.macroenabled.12",
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
  "application/vnd.ms-powerpoint.template.macroenabled.12",
  "application/vnd.ms-visio.drawing",
  "application/vnd.ms-visio.drawing.macroenabled.12",
  "application/vnd.ms-visio.stencil",
  "application/vnd.ms-visio.stencil.macroenabled.12",
  "application/vnd.ms-visio.template",
  "application/vnd.ms-visio.template.macroenabled.12",
  "application/vnd.ms-word.document.macroenabled.12",
  "application/vnd.ms-word.template.macroenabled.12",
  "application/vnd.oasis.opendocument.graphics",
  "application/vnd.oasis.opendocument.graphics-template",
  "application/vnd.oasis.opendocument.presentation",
  "application/vnd.oasis.opendocument.presentation-template",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.spreadsheet-template",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.text-template",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  "application/vnd.openxmlformats-officedocument.presentationml.template",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  "application/x-xpinstall",
  "model/3mf"
]);
function isZipContainerMime(mime) {
  return mime.endsWith("+zip") || ZIP_CONTAINER_MIMES.has(mime);
}
function normalizeMimeType(mime) {
  if (!mime) {
    return void 0;
  }
  const cleaned = mime.split(";")[0]?.trim().toLowerCase();
  if (cleaned === "image/apng") {
    return "image/png";
  }
  return cleaned || void 0;
}
function sliceMimeSniffBuffer(buffer) {
  if (buffer.byteLength <= FILE_TYPE_SNIFF_MAX_BYTES) {
    return buffer;
  }
  return buffer.subarray(0, FILE_TYPE_SNIFF_MAX_BYTES);
}
async function sniffMime(buffer) {
  if (!buffer) {
    return void 0;
  }
  try {
    const { fileTypeFromBuffer } = await import("file-type");
    const type = await fileTypeFromBuffer(sliceMimeSniffBuffer(buffer));
    if (type?.mime) {
      return normalizeMimeType(type.mime);
    }
  } catch {
  }
  return buffer.toString("ascii", 0, 4) === "caff" ? "audio/x-caf" : void 0;
}
function getFileExtension(filePath) {
  if (!filePath) {
    return void 0;
  }
  try {
    if (/^https?:\/\//i.test(filePath)) {
      const url = new URL(filePath);
      let filename = url.pathname.slice(url.pathname.lastIndexOf("/") + 1);
      try {
        const decodable = filename.replace(/%2f/gi, "%252F").replace(/%5c/gi, "%255C");
        filename = decodeURIComponent(decodable);
      } catch {
      }
      return path3.posix.extname(filename).toLowerCase() || void 0;
    }
  } catch {
  }
  const ext = extnameFromAnyPath(filePath).toLowerCase();
  return ext || void 0;
}
function mimeTypeFromFilePath(filePath) {
  const ext = getFileExtension(filePath);
  if (!ext) {
    return void 0;
  }
  return MIME_BY_EXT[ext];
}
function isAudioFileName(fileName) {
  return mediaKindFromMime(mimeTypeFromFilePath(fileName)) === "audio";
}
async function detectMime(opts) {
  const extMime = MIME_BY_EXT[getFileExtension(opts.filePath) ?? ""];
  const mimeHints = [opts.headerMime, ...opts.additionalMimeHints ?? []].map((mime) => normalizeMimeType(mime)).filter((mime) => Boolean(mime));
  const headerMime = mimeHints[0];
  const sniffed = await sniffMime(opts.buffer);
  const sniffedGenericContainer = sniffed === "application/octet-stream" || sniffed === "application/zip";
  const specificExtMime = extMime && extMime !== sniffed && !extMime.startsWith("image/") ? extMime : void 0;
  const genericContainerMime = sniffed === "application/zip" ? [extMime, ...mimeHints].find((mime) => mime && isZipContainerMime(mime)) : sniffed === "application/octet-stream" ? specificExtMime ?? mimeHints.find((mime) => mime !== "application/octet-stream") : void 0;
  const inferred = sniffedGenericContainer ? genericContainerMime ?? sniffed : sniffed ?? extMime;
  const audioContainerHint = mimeHints.find((mime) => AMBIGUOUS_VIDEO_MIME_BY_AUDIO_MIME[mime] === inferred) ?? (extMime && AMBIGUOUS_VIDEO_MIME_BY_AUDIO_MIME[extMime] === inferred ? extMime : void 0);
  if (audioContainerHint) {
    return audioContainerHint;
  }
  return inferred ?? headerMime;
}
function extensionForMime(mime) {
  const normalized = normalizeMimeType(mime);
  if (!normalized) {
    return void 0;
  }
  return EXT_BY_MIME[normalized];
}
function isGifMedia(opts) {
  if (normalizeMimeType(opts.contentType) === "image/gif") {
    return true;
  }
  const ext = getFileExtension(opts.fileName);
  return ext === ".gif";
}
function imageMimeFromFormat(format) {
  if (!format) {
    return void 0;
  }
  switch (format.toLowerCase()) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "heic":
      return "image/heic";
    case "heif":
      return "image/heif";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return void 0;
  }
}
function kindFromMime(mime) {
  return mediaKindFromMime(normalizeMimeType(mime));
}

// packages/media-core/src/read-byte-stream-with-limit.ts
function normalizeByteChunk(chunk) {
  if (Buffer.isBuffer(chunk)) {
    return chunk;
  }
  if (typeof chunk === "string") {
    return Buffer.from(chunk);
  }
  if (chunk instanceof ArrayBuffer) {
    return Buffer.from(chunk);
  }
  if (ArrayBuffer.isView(chunk)) {
    return Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
  }
  throw new TypeError(`Unsupported byte stream chunk: ${typeof chunk}`);
}
function destroyReadableOnOverflow(stream, err) {
  const readable = stream;
  if (typeof readable.destroy === "function") {
    try {
      readable.destroy();
    } catch {
    }
    return;
  }
  if (typeof readable.cancel === "function") {
    try {
      void Promise.resolve(readable.cancel(err)).catch(() => void 0);
    } catch {
    }
  }
}
async function readByteStreamWithLimit(stream, opts) {
  const { maxBytes } = opts;
  if (!Number.isFinite(maxBytes) || maxBytes < 0) {
    throw new RangeError(`maxBytes must be a non-negative finite number: ${maxBytes}`);
  }
  const onOverflow = opts.onOverflow ?? ((params) => new Error(`Content too large: ${params.size} bytes (limit: ${params.maxBytes} bytes)`));
  const chunks = [];
  let total = 0;
  for await (const chunk of stream) {
    const buffer = normalizeByteChunk(chunk);
    if (buffer.byteLength === 0) {
      continue;
    }
    const nextTotal = total + buffer.byteLength;
    if (nextTotal > maxBytes) {
      const err = onOverflow({ size: nextTotal, maxBytes });
      destroyReadableOnOverflow(stream, err);
      throw err;
    }
    chunks.push(buffer);
    total = nextTotal;
  }
  return Buffer.concat(chunks, total);
}
export {
  FILE_TYPE_SNIFF_MAX_BYTES,
  INLINE_IMAGE_DATA_URL_PREFIX,
  MAX_AUDIO_BYTES,
  MAX_DOCUMENT_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  basenameFromAnyPath,
  canonicalizeBase64,
  detectMime,
  estimateBase64DecodedBytes,
  extensionForMime,
  extnameFromAnyPath,
  getFileExtension,
  imageMimeFromFormat,
  isAudioFileName,
  isGifMedia,
  isInboundPathAllowed,
  isPassThroughRemoteMediaSource,
  isValidInboundPathRootPattern,
  kindFromMime,
  maxBytesForKind,
  mediaKindFromMime,
  mergeInboundPathRoots,
  mimeTypeFromFilePath,
  nameFromAnyPath,
  normalizeInboundPathRoots,
  normalizeMimeType,
  parseMediaContentLength,
  readByteStreamWithLimit,
  sanitizeInlineImageBase64,
  sanitizeInlineImageDataUrl,
  sanitizeInlineImageDataUrlForStorage,
  sliceMimeSniffBuffer,
  sniffInlineImageMime
};
