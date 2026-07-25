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

// packages/ai/src/utils/sanitize-unicode.ts
function sanitizeSurrogates(text) {
  return text.replace(
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
    ""
  );
}

// packages/ai/src/utils/prompt-cache-stability.ts
function normalizeStructuredPromptSection(text) {
  return sanitizeSurrogates(text).replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "").trim();
}
function normalizePromptCapabilityIds(capabilities) {
  const seen = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const capability of capabilities) {
    const value = normalizeLowercaseStringOrEmpty(normalizeStructuredPromptSection(capability));
    if (!value || seen.has(value)) {
      continue;
    }
    seen.add(value);
    normalized.push(value);
  }
  return normalized.toSorted((left, right) => left.localeCompare(right));
}
export {
  normalizePromptCapabilityIds,
  normalizeStructuredPromptSection
};
