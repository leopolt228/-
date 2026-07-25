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

// packages/acp-core/src/meta.ts
function readMetaValue(meta, keys, normalize) {
  if (!meta) {
    return void 0;
  }
  for (const key of keys) {
    const normalized = normalize(meta[key]);
    if (normalized !== void 0) {
      return normalized;
    }
  }
  return void 0;
}
function readString(meta, keys) {
  return readMetaValue(meta, keys, normalizeOptionalString);
}
function readBool(meta, keys) {
  return readMetaValue(meta, keys, (value) => typeof value === "boolean" ? value : void 0);
}
function readNumber(meta, keys) {
  return readMetaValue(
    meta,
    keys,
    (value) => typeof value === "number" && Number.isFinite(value) ? value : void 0
  );
}
function readNonNegativeInteger(meta, keys) {
  return readMetaValue(
    meta,
    keys,
    (value) => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : void 0
  );
}
export {
  readBool,
  readNonNegativeInteger,
  readNumber,
  readString
};
