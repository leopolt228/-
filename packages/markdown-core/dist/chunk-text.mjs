// packages/normalization-core/src/utf16-slice.ts
function isHighSurrogate(codeUnit) {
  return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
  return codeUnit >= 56320 && codeUnit <= 57343;
}
function avoidTrailingHighSurrogateBreak(text, start, end) {
  if (end <= start || end >= text.length || !isHighSurrogate(text.charCodeAt(end - 1)) || !isLowSurrogate(text.charCodeAt(end))) {
    return end;
  }
  const adjusted = end - 1;
  return adjusted > start ? adjusted : end + 1;
}

// packages/markdown-core/src/chunk-text.ts
function resolveChunkEarlyReturn(text, limit) {
  if (!text) {
    return [];
  }
  if (limit <= 0) {
    return [text];
  }
  if (text.length <= limit) {
    return [text];
  }
  return void 0;
}
function scanParenAwareBreakpoints(text) {
  let lastNewline = -1;
  let lastWhitespace = -1;
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    if (char === "(") {
      depth += 1;
      continue;
    }
    if (char === ")" && depth > 0) {
      depth -= 1;
      continue;
    }
    if (depth !== 0) {
      continue;
    }
    if (char === "\n") {
      lastNewline = i;
    } else if (/\s/.test(char)) {
      lastWhitespace = i;
    }
  }
  return { lastNewline, lastWhitespace };
}
function findPreferredRangeEnd(text, start, end) {
  const slice = text.slice(start, end);
  let paragraphEnd;
  for (const match of slice.matchAll(/\n[\t ]*\n+/g)) {
    if (match.index !== void 0) {
      paragraphEnd = start + match.index + match[0].length;
    }
  }
  if (paragraphEnd !== void 0) {
    return paragraphEnd;
  }
  const newlineIndex = text.lastIndexOf("\n", end - 1);
  if (newlineIndex >= start) {
    return newlineIndex + 1;
  }
  for (let index = end - 1; index > start; index -= 1) {
    if (/\s/.test(text.charAt(index))) {
      return index + 1;
    }
  }
  return void 0;
}
function chunkTextRanges(text, options) {
  if (!text) {
    return [];
  }
  if (options.limit <= 0 || text.length <= options.limit) {
    return [{ start: 0, end: text.length }];
  }
  const ranges = [];
  let start = 0;
  while (start < text.length) {
    const maxEnd = Math.min(text.length, start + options.limit);
    const preferredEnd = options.mode === "preferred" && maxEnd < text.length ? findPreferredRangeEnd(text, start, maxEnd) : void 0;
    const candidateEnd = preferredEnd && preferredEnd > start ? preferredEnd : maxEnd;
    const end = avoidTrailingHighSurrogateBreak(text, start, candidateEnd);
    ranges.push({ start, end });
    start = end;
  }
  return ranges;
}
function chunkText(text, limit) {
  const early = resolveChunkEarlyReturn(text, limit);
  if (early) {
    return early;
  }
  const chunks = [];
  let cursor = 0;
  while (cursor < text.length) {
    if (text.length - cursor <= limit) {
      chunks.push(text.slice(cursor));
      break;
    }
    const windowEnd = Math.min(text.length, cursor + limit);
    const window = text.slice(cursor, windowEnd);
    const { lastNewline, lastWhitespace } = scanParenAwareBreakpoints(window);
    const breakOffset = lastNewline > 0 ? lastNewline : lastWhitespace;
    const end = avoidTrailingHighSurrogateBreak(
      text,
      cursor,
      breakOffset > 0 ? cursor + breakOffset : windowEnd
    );
    chunks.push(text.slice(cursor, end));
    cursor = end;
    while (cursor < text.length && /\s/.test(text[cursor] ?? "")) {
      cursor += 1;
    }
  }
  return chunks;
}
export {
  avoidTrailingHighSurrogateBreak,
  chunkText,
  chunkTextRanges
};
