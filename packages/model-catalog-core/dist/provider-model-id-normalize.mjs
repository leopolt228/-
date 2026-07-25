// packages/model-catalog-core/src/provider-model-id-normalize.ts
var ANTIGRAVITY_BARE_PRO_IDS = /* @__PURE__ */ new Set(["gemini-3-pro", "gemini-3.1-pro", "gemini-3-1-pro"]);
var GOOGLE_PROVIDER_PREFIX = "google/";
function normalizeGooglePreviewModelId(id) {
  if (id.startsWith(GOOGLE_PROVIDER_PREFIX)) {
    const modelId = id.slice(GOOGLE_PROVIDER_PREFIX.length);
    const normalizedModelId = normalizeGooglePreviewModelId(modelId);
    return normalizedModelId === modelId ? id : `${GOOGLE_PROVIDER_PREFIX}${normalizedModelId}`;
  }
  if (id === "gemini-3-pro" || id === "gemini-3-pro-preview") {
    return "gemini-3.1-pro-preview";
  }
  if (id === "gemini-3-flash") {
    return "gemini-3-flash-preview";
  }
  if (id === "gemini-3.1-pro") {
    return "gemini-3.1-pro-preview";
  }
  if (id === "gemini-3.1-flash-lite-preview") {
    return "gemini-3.1-flash-lite";
  }
  if (id === "gemini-3.1-flash" || id === "gemini-3.1-flash-preview") {
    return "gemini-3-flash-preview";
  }
  if (id === "gemma-4-26b") {
    return "gemma-4-26b-a4b-it";
  }
  return id;
}
function normalizeTogetherModelId(id) {
  if (id === "moonshotai/Kimi-K2.5") {
    return "moonshotai/Kimi-K2.6";
  }
  return id;
}
function normalizeAntigravityPreviewModelId(id) {
  if (ANTIGRAVITY_BARE_PRO_IDS.has(id)) {
    return `${id}-low`;
  }
  return id;
}
export {
  normalizeAntigravityPreviewModelId,
  normalizeGooglePreviewModelId,
  normalizeTogetherModelId
};
