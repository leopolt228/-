// packages/media-understanding-common/src/defaults.ts
var MB = 1024 * 1024;
var DEFAULT_MAX_BYTES = {
  image: 10 * MB,
  audio: 20 * MB,
  video: 50 * MB
};
var DEFAULT_VIDEO_MAX_BASE64_BYTES = 70 * MB;
var CLI_OUTPUT_MAX_BUFFER = 5 * MB;

// packages/media-understanding-common/src/video.ts
function estimateBase64Size(bytes) {
  return Math.ceil(bytes / 3) * 4;
}
function resolveVideoMaxBase64Bytes(maxBytes) {
  const expanded = estimateBase64Size(maxBytes);
  return Math.min(expanded, DEFAULT_VIDEO_MAX_BASE64_BYTES);
}
export {
  estimateBase64Size,
  resolveVideoMaxBase64Bytes
};
