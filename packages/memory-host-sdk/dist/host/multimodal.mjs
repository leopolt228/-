// packages/normalization-core/src/string-coerce.ts
function normalizeNullableString(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
function normalizeOptionalString(value) {
  return normalizeNullableString(value) ?? void 0;
}
function normalizeOptionalLowercaseString(value) {
  return normalizeOptionalString(value)?.toLowerCase();
}
function normalizeLowercaseStringOrEmpty(value) {
  return normalizeOptionalLowercaseString(value) ?? "";
}

// packages/memory-host-sdk/src/host/multimodal.ts
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
function getMemoryMultimodalExtensions(modality) {
  return MEMORY_MULTIMODAL_SPECS[modality].extensions;
}
function buildMemoryMultimodalLabel(modality, normalizedPath) {
  return `${MEMORY_MULTIMODAL_SPECS[modality].labelPrefix}: ${normalizedPath}`;
}
function buildCaseInsensitiveExtensionGlob(extension) {
  const normalized = normalizeLowercaseStringOrEmpty(extension).replace(/^\./, "");
  if (!normalized) {
    return "*";
  }
  const parts = Array.from(normalized, (char) => `[${char.toLowerCase()}${char.toUpperCase()}]`);
  return `*.${parts.join("")}`;
}
function classifyMemoryMultimodalPath(filePath, settings) {
  if (!isMemoryMultimodalEnabled(settings)) {
    return null;
  }
  const lower = normalizeLowercaseStringOrEmpty(filePath);
  for (const modality of settings.modalities) {
    for (const extension of getMemoryMultimodalExtensions(modality)) {
      if (lower.endsWith(extension)) {
        return modality;
      }
    }
  }
  return null;
}
export {
  buildCaseInsensitiveExtensionGlob,
  buildMemoryMultimodalLabel,
  classifyMemoryMultimodalPath,
  getMemoryMultimodalExtensions,
  isMemoryMultimodalEnabled,
  normalizeMemoryMultimodalSettings
};
