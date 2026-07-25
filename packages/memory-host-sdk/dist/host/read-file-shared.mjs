// packages/normalization-core/src/utf16-slice.ts
function isHighSurrogate(codeUnit) {
  return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
  return codeUnit >= 56320 && codeUnit <= 57343;
}
function sliceUtf16Safe(input, start, end) {
  const len = input.length;
  let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
  let to = end === void 0 ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
  if (to <= from) {
    return "";
  }
  if (from > 0 && from < len) {
    const codeUnit = input.charCodeAt(from);
    if (isLowSurrogate(codeUnit) && isHighSurrogate(input.charCodeAt(from - 1))) {
      from += 1;
    }
  }
  if (to > 0 && to < len) {
    const codeUnit = input.charCodeAt(to - 1);
    if (isHighSurrogate(codeUnit) && isLowSurrogate(input.charCodeAt(to))) {
      to -= 1;
    }
  }
  return input.slice(from, to);
}
function truncateUtf16Safe(input, maxLen) {
  const limit = Math.max(0, Math.floor(maxLen));
  if (input.length <= limit) {
    return input;
  }
  return sliceUtf16Safe(input, 0, limit);
}

// packages/memory-host-sdk/src/host/read-file-shared.ts
var DEFAULT_MEMORY_READ_LINES = 120;
var DEFAULT_MEMORY_READ_MAX_CHARS = 12e3;
function buildContinuationNotice(params) {
  const base = typeof params.nextFrom === "number" ? `[More content available. Use from=${params.nextFrom} to continue.]` : "[More content available. Requested excerpt exceeded the default maxChars budget.]";
  const fallback = params.suggestReadFallback ? " If you need the full raw line, use read on the source file." : "";
  return `

${base.slice(0, -1)}${fallback}]`;
}
function fitLinesToCharBudget(params) {
  const { lines, maxChars } = params;
  if (lines.length === 0) {
    return { text: "", includedLines: 0, hardTruncatedSingleLine: false };
  }
  let includedLines = lines.length;
  let text = lines.join("\n");
  while (includedLines > 1 && text.length > maxChars) {
    includedLines -= 1;
    text = lines.slice(0, includedLines).join("\n");
  }
  if (text.length <= maxChars) {
    return { text, includedLines, hardTruncatedSingleLine: false };
  }
  return {
    text: truncateUtf16Safe(text, maxChars),
    includedLines: 1,
    hardTruncatedSingleLine: true
  };
}
function normalizePositiveInteger(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(1, Math.floor(value)) : fallback;
}
function buildMemoryReadResultFromSlice(params) {
  const start = normalizePositiveInteger(params.startLine, 1);
  const fitted = fitLinesToCharBudget({
    lines: params.selectedLines,
    maxChars: normalizePositiveInteger(params.maxChars, DEFAULT_MEMORY_READ_MAX_CHARS)
  });
  const moreSourceLinesRemain = params.moreSourceLinesRemain ?? false;
  const charCapTruncated = fitted.hardTruncatedSingleLine || fitted.includedLines < params.selectedLines.length;
  const nextFrom = !fitted.hardTruncatedSingleLine && (moreSourceLinesRemain || fitted.includedLines < params.selectedLines.length) ? start + fitted.includedLines : void 0;
  const truncated = charCapTruncated || moreSourceLinesRemain;
  const text = truncated && (fitted.text || fitted.hardTruncatedSingleLine) ? `${fitted.text}${buildContinuationNotice({
    nextFrom,
    suggestReadFallback: fitted.hardTruncatedSingleLine && params.suggestReadFallback
  })}` : fitted.text;
  return {
    text,
    path: params.relPath,
    from: start,
    lines: fitted.includedLines,
    ...truncated ? { truncated: true } : {},
    ...typeof nextFrom === "number" ? { nextFrom } : {}
  };
}
function buildMemoryReadResult(params) {
  const fileLines = params.content.split("\n");
  const start = normalizePositiveInteger(params.from, 1);
  const requestedCount = normalizePositiveInteger(
    params.lines ?? params.defaultLines,
    DEFAULT_MEMORY_READ_LINES
  );
  const selectedLines = fileLines.slice(start - 1, start - 1 + requestedCount);
  const moreSourceLinesRemain = start - 1 + selectedLines.length < fileLines.length;
  return buildMemoryReadResultFromSlice({
    selectedLines,
    relPath: params.relPath,
    startLine: start,
    moreSourceLinesRemain,
    maxChars: params.maxChars,
    suggestReadFallback: params.suggestReadFallback
  });
}
export {
  DEFAULT_MEMORY_READ_LINES,
  DEFAULT_MEMORY_READ_MAX_CHARS,
  buildMemoryReadResult,
  buildMemoryReadResultFromSlice
};
