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

// packages/media-generation-core/src/string.ts
function uniqueTrimmedStrings(values) {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const value of values) {
    const normalized = normalizeOptionalString(value);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}
export {
  uniqueTrimmedStrings
};
