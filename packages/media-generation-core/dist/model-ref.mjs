// packages/model-catalog-core/src/model-catalog-refs.ts
function parseProviderModelRef(value) {
  const trimmed = value.trim();
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex <= 0 || slashIndex >= trimmed.length - 1) {
    return null;
  }
  const provider = trimmed.slice(0, slashIndex).trim();
  const model = trimmed.slice(slashIndex + 1).trim();
  return provider && model ? { provider, model } : null;
}

// packages/media-generation-core/src/model-ref.ts
function parseGenerationModelRef(raw) {
  return raw === void 0 ? null : parseProviderModelRef(raw);
}
export {
  parseGenerationModelRef
};
