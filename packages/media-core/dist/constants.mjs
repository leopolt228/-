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
export {
  MAX_AUDIO_BYTES,
  MAX_DOCUMENT_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  maxBytesForKind,
  mediaKindFromMime
};
