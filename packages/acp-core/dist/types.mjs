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

// packages/acp-core/src/types.ts
var ACP_PROVENANCE_MODE_VALUES = ["off", "meta", "meta+receipt"];
function normalizeAcpProvenanceMode(value) {
  const normalized = normalizeOptionalLowercaseString(value);
  if (!normalized) {
    return void 0;
  }
  return ACP_PROVENANCE_MODE_VALUES.includes(normalized) ? normalized : void 0;
}
export {
  normalizeAcpProvenanceMode
};
