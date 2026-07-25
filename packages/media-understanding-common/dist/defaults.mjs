// packages/media-understanding-common/src/defaults.ts
var MB = 1024 * 1024;
var DEFAULT_MAX_CHARS = 500;
var DEFAULT_MAX_CHARS_BY_CAPABILITY = {
  image: DEFAULT_MAX_CHARS,
  audio: void 0,
  video: DEFAULT_MAX_CHARS
};
var DEFAULT_MAX_BYTES = {
  image: 10 * MB,
  audio: 20 * MB,
  video: 50 * MB
};
var DEFAULT_TIMEOUT_SECONDS = {
  image: 60,
  audio: 60,
  video: 120
};
var DEFAULT_PROMPT = {
  image: "Describe the image.",
  audio: "Transcribe the audio.",
  video: "Describe the video."
};
var DEFAULT_VIDEO_MAX_BASE64_BYTES = 70 * MB;
var CLI_OUTPUT_MAX_BUFFER = 5 * MB;
var DEFAULT_MEDIA_CONCURRENCY = 2;
var MIN_AUDIO_FILE_BYTES = 1024;
export {
  CLI_OUTPUT_MAX_BUFFER,
  DEFAULT_MAX_BYTES,
  DEFAULT_MAX_CHARS,
  DEFAULT_MAX_CHARS_BY_CAPABILITY,
  DEFAULT_MEDIA_CONCURRENCY,
  DEFAULT_PROMPT,
  DEFAULT_TIMEOUT_SECONDS,
  DEFAULT_VIDEO_MAX_BASE64_BYTES,
  MIN_AUDIO_FILE_BYTES
};
