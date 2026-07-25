// packages/media-core/src/media-source-url.ts
var HTTP_URL_RE = /^https?:\/\//i;
var MXC_URL_RE = /^mxc:\/\//i;
var BUFFER_URL_RE = /^buffer:\/\//i;
function isPassThroughRemoteMediaSource(value) {
  const normalized = value?.trim() ?? "";
  return Boolean(normalized) && (HTTP_URL_RE.test(normalized) || MXC_URL_RE.test(normalized) || BUFFER_URL_RE.test(normalized));
}
export {
  isPassThroughRemoteMediaSource
};
