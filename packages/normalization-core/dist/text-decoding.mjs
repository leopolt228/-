// packages/normalization-core/src/text-decoding.ts
function decodeTextPrefix(bytes, options = {}) {
  const decoder = new TextDecoder(options.encoding);
  return decoder.decode(bytes, options.truncated ? { stream: true } : void 0);
}
export {
  decodeTextPrefix
};
