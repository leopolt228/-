// packages/memory-host-sdk/src/multimodal.ts
var MEMORY_MULTIMODAL_SPECS = {
  image: {
    labelPrefix: "Image file",
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"]
  },
  audio: {
    labelPrefix: "Audio file",
    extensions: [".mp3", ".wav", ".ogg", ".opus", ".m4a", ".m2a", ".aac", ".flac"]
  }
};
var MEMORY_MULTIMODAL_MODALITIES = Object.keys(
  MEMORY_MULTIMODAL_SPECS
);
var DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES = 10 * 1024 * 1024;
function normalizeMemoryMultimodalModalities(raw) {
  if (raw === void 0 || raw.includes("all")) {
    return [...MEMORY_MULTIMODAL_MODALITIES];
  }
  const normalized = /* @__PURE__ */ new Set();
  for (const value of raw) {
    if (value === "image" || value === "audio") {
      normalized.add(value);
    }
  }
  return Array.from(normalized);
}
function normalizeMemoryMultimodalSettings(raw) {
  const enabled = raw.enabled === true;
  const maxFileBytes = typeof raw.maxFileBytes === "number" && Number.isFinite(raw.maxFileBytes) ? Math.max(1, Math.floor(raw.maxFileBytes)) : DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES;
  return {
    enabled,
    modalities: enabled ? normalizeMemoryMultimodalModalities(raw.modalities) : [],
    maxFileBytes
  };
}
function isMemoryMultimodalEnabled(settings) {
  return settings.enabled && settings.modalities.length > 0;
}
export {
  isMemoryMultimodalEnabled,
  normalizeMemoryMultimodalSettings
};
