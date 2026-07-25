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

// packages/ai/src/utils/system-prompt-cache-boundary.ts
var SYSTEM_PROMPT_CACHE_BOUNDARY = "\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n";
function stripSystemPromptCacheBoundary(text) {
  return text.replaceAll(SYSTEM_PROMPT_CACHE_BOUNDARY, "\n");
}
function ensureSystemPromptCacheBoundary(systemPrompt) {
  if (systemPrompt.trim().length === 0) {
    return systemPrompt;
  }
  return systemPrompt.includes(SYSTEM_PROMPT_CACHE_BOUNDARY) ? systemPrompt : `${systemPrompt}${SYSTEM_PROMPT_CACHE_BOUNDARY}`;
}
function splitSystemPromptCacheBoundary(text) {
  const boundaryIndex = text.indexOf(SYSTEM_PROMPT_CACHE_BOUNDARY);
  if (boundaryIndex === -1) {
    return void 0;
  }
  return {
    stablePrefix: text.slice(0, boundaryIndex).trimEnd(),
    dynamicSuffix: text.slice(boundaryIndex + SYSTEM_PROMPT_CACHE_BOUNDARY.length).trimStart()
  };
}
function prependSystemPromptAdditionAfterCacheBoundary(params) {
  const systemPromptAddition = typeof params.systemPromptAddition === "string" ? normalizeStructuredPromptSection(params.systemPromptAddition) : "";
  if (!systemPromptAddition) {
    return params.systemPrompt;
  }
  if (params.systemPrompt.trim().length === 0) {
    return systemPromptAddition;
  }
  const split = splitSystemPromptCacheBoundary(params.systemPrompt);
  if (!split) {
    return `${systemPromptAddition}

${params.systemPrompt}`;
  }
  const dynamicSuffix = split.dynamicSuffix ? normalizeStructuredPromptSection(split.dynamicSuffix) : "";
  if (!dynamicSuffix) {
    return `${split.stablePrefix}${SYSTEM_PROMPT_CACHE_BOUNDARY}${systemPromptAddition}`;
  }
  return `${split.stablePrefix}${SYSTEM_PROMPT_CACHE_BOUNDARY}${systemPromptAddition}

${dynamicSuffix}`;
}
export {
  SYSTEM_PROMPT_CACHE_BOUNDARY,
  ensureSystemPromptCacheBoundary,
  prependSystemPromptAdditionAfterCacheBoundary,
  splitSystemPromptCacheBoundary,
  stripSystemPromptCacheBoundary
};
