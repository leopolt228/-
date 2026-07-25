// packages/media-core/src/mime.ts
import path2 from "node:path";

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

// packages/media-core/src/file-name.ts
import path from "node:path";
function basenameFromAnyPath(value) {
  return path.win32.basename(path.posix.basename(value));
}
function extnameFromAnyPath(value) {
  return path.extname(basenameFromAnyPath(value));
}

// packages/media-core/src/mime.ts
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
      return path2.posix.extname(filename).toLowerCase() || void 0;
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
export {
  FILE_TYPE_SNIFF_MAX_BYTES,
  detectMime,
  extensionForMime,
  getFileExtension,
  imageMimeFromFormat,
  isAudioFileName,
  isGifMedia,
  kindFromMime,
  mimeTypeFromFilePath,
  normalizeMimeType,
  sliceMimeSniffBuffer
};
