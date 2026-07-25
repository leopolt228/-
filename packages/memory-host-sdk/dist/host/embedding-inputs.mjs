// packages/memory-host-sdk/src/host/embedding-inputs.ts
function buildTextEmbeddingInput(text) {
  return { text };
}
function hasNonTextEmbeddingParts(input) {
  if (!input?.parts?.length) {
    return false;
  }
  return input.parts.some((part) => part.type === "inline-data");
}
export {
  buildTextEmbeddingInput,
  hasNonTextEmbeddingParts
};
