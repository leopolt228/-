// packages/memory-host-sdk/src/host/embedding-model-limits.ts
var DEFAULT_EMBEDDING_MAX_INPUT_TOKENS = 8192;
var DEFAULT_LOCAL_EMBEDDING_MAX_INPUT_TOKENS = 2048;
function resolveEmbeddingMaxInputTokens(provider) {
  if (typeof provider.maxInputTokens === "number") {
    return provider.maxInputTokens;
  }
  if (provider.id === "local") {
    return DEFAULT_LOCAL_EMBEDDING_MAX_INPUT_TOKENS;
  }
  return DEFAULT_EMBEDDING_MAX_INPUT_TOKENS;
}
export {
  resolveEmbeddingMaxInputTokens
};
