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

// packages/markdown-core/src/assistant-transcript-headers.ts
var TRANSCRIPT_ROLES = [
  "assistant",
  "developer",
  "system",
  "user"
];
function isHorizontalWhitespace(char) {
  return char === " " || char === "	";
}
function isLineTrailingWhitespace(char) {
  return isHorizontalWhitespace(char) || char === "\r";
}
function skipHorizontalWhitespace(text, start, end) {
  let cursor = start;
  while (cursor < end && isHorizontalWhitespace(text[cursor])) {
    cursor += 1;
  }
  return cursor;
}
function matchRoleAt(text, start, end) {
  for (const role of TRANSCRIPT_ROLES) {
    const roleEnd = start + role.length;
    if (roleEnd <= end && text.slice(start, roleEnd).toLowerCase() === role) {
      return { role, end: roleEnd };
    }
  }
  return null;
}
function findDelimitedEnd(params) {
  const searchEnd = Math.min(params.lineEnd, params.contentStart + params.maxContentLength + 1);
  let closeAt = -1;
  for (let index = params.contentStart; index < searchEnd; index += 1) {
    const char = params.text[index];
    if (char === "`") {
      return null;
    }
    if (char === params.close) {
      closeAt = index;
      break;
    }
  }
  if (closeAt === -1) {
    return null;
  }
  const contentLength = closeAt - params.contentStart;
  if (contentLength < params.minContentLength || contentLength > params.maxContentLength) {
    return null;
  }
  return closeAt + 1;
}
function isHeaderBoundary(char) {
  return char === void 0 || isLineTrailingWhitespace(char) || char === ":" || char === "\uFF1A";
}
function matchRoleTimestampHeader(text, start, lineEnd) {
  const role = matchRoleAt(text, start, lineEnd);
  if (!role) {
    return null;
  }
  const bracketStart = skipHorizontalWhitespace(text, role.end, lineEnd);
  if (text[bracketStart] !== "[") {
    return null;
  }
  const headerEnd = findDelimitedEnd({
    text,
    contentStart: bracketStart + 1,
    lineEnd,
    close: "]",
    minContentLength: 1,
    maxContentLength: 160
  });
  if (!headerEnd || !isHeaderBoundary(text[headerEnd])) {
    return null;
  }
  return {
    start,
    end: headerEnd,
    kind: "role_timestamp_bracket",
    role: role.role
  };
}
function matchTimestampRoleHeader(text, start, lineEnd) {
  if (text[start] !== "[") {
    return null;
  }
  const bracketEnd = findDelimitedEnd({
    text,
    contentStart: start + 1,
    lineEnd,
    close: "]",
    minContentLength: 4,
    maxContentLength: 160
  });
  if (!bracketEnd) {
    return null;
  }
  const roleStart = skipHorizontalWhitespace(text, bracketEnd, lineEnd);
  const role = matchRoleAt(text, roleStart, lineEnd);
  if (!role) {
    return null;
  }
  const colonAt = skipHorizontalWhitespace(text, role.end, lineEnd);
  if (text[colonAt] !== ":" && text[colonAt] !== "\uFF1A") {
    return null;
  }
  return {
    start,
    end: colonAt + 1,
    kind: "timestamp_role_colon",
    role: role.role
  };
}
function matchAngleRoleHeader(text, start, lineEnd) {
  if (text[start] !== "<") {
    return null;
  }
  const roleStart = skipHorizontalWhitespace(text, start + 1, lineEnd);
  const role = matchRoleAt(text, roleStart, lineEnd);
  const roleBoundary = role ? text[role.end] : void 0;
  if (!role || roleBoundary !== ">" && !isHorizontalWhitespace(roleBoundary)) {
    return null;
  }
  const headerEnd = findDelimitedEnd({
    text,
    contentStart: role.end,
    lineEnd,
    close: ">",
    minContentLength: 0,
    maxContentLength: 160
  });
  if (!headerEnd || !isHeaderBoundary(text[headerEnd])) {
    return null;
  }
  return {
    start,
    end: headerEnd,
    kind: "angle_role_header",
    role: role.role
  };
}
function rangesOverlap(left, right) {
  return left.start < right.end && left.end > right.start;
}
function findAssistantTranscriptRoleHeaderSpans(text, excludedRanges = []) {
  const spans = [];
  const sortedExcludedRanges = [...excludedRanges].toSorted(
    (left, right) => left.start - right.start || left.end - right.end
  );
  let excludedRangeIndex = 0;
  let lineStart = 0;
  while (lineStart < text.length) {
    const newlineAt = text.indexOf("\n", lineStart);
    const lineEnd = newlineAt === -1 ? text.length : newlineAt;
    const contentStart = skipHorizontalWhitespace(text, lineStart, lineEnd);
    const span = matchTimestampRoleHeader(text, contentStart, lineEnd) ?? matchAngleRoleHeader(text, contentStart, lineEnd) ?? matchRoleTimestampHeader(text, contentStart, lineEnd);
    if (span) {
      for (; ; ) {
        const excludedRange2 = sortedExcludedRanges[excludedRangeIndex];
        if (!excludedRange2 || excludedRange2.end > span.start) {
          break;
        }
        excludedRangeIndex += 1;
      }
      const excludedRange = sortedExcludedRanges[excludedRangeIndex];
      if (!excludedRange || !rangesOverlap(span, excludedRange)) {
        spans.push(span);
      }
    }
    if (newlineAt === -1) {
      break;
    }
    lineStart = newlineAt + 1;
  }
  return spans;
}

// packages/markdown-core/src/ir-spans.ts
var autoLinkedMarkdownLinks = /* @__PURE__ */ new WeakSet();
function createMarkdownLinkSpan(span, options = {}) {
  const created = { ...span };
  if (options.autoLinked) {
    autoLinkedMarkdownLinks.add(created);
  }
  return created;
}
function copyMarkdownLinkSpan(span, overrides = {}) {
  return createMarkdownLinkSpan(
    { ...span, ...overrides },
    { autoLinked: autoLinkedMarkdownLinks.has(span) }
  );
}
function isAutoLinkedMarkdownLink(span) {
  return autoLinkedMarkdownLinks.has(span);
}
function createStyleSpan(params) {
  const span = {
    start: params.start,
    end: params.end,
    style: params.style
  };
  if (params.language) {
    span.language = params.language;
  }
  return span;
}
function mergeAnnotationSpans(spans) {
  const sorted = [...spans].toSorted((a, b) => a.start - b.start || a.end - b.end);
  const merged = [];
  for (const span of sorted) {
    const previous = merged.at(-1);
    if (previous && previous.end === span.start && previous.type === span.type && previous.kind === span.kind && previous.role === span.role) {
      previous.end = span.end;
      continue;
    }
    merged.push({ ...span });
  }
  return merged;
}
function mergeStyleSpans(spans) {
  const sorted = [...spans].toSorted((a, b) => {
    if (a.start !== b.start) {
      return a.start - b.start;
    }
    if (a.end !== b.end) {
      return a.end - b.end;
    }
    return a.style.localeCompare(b.style);
  });
  const merged = [];
  for (const span of sorted) {
    const previous = merged.at(-1);
    if (previous && previous.style === span.style && previous.language === span.language && // Blockquotes are containers; merging adjacent blocks leaks styling across paragraphs.
    (span.start < previous.end || span.start === previous.end && span.style !== "blockquote")) {
      previous.end = Math.max(previous.end, span.end);
      continue;
    }
    merged.push({ ...span });
  }
  return merged;
}
function resolveSliceBounds(span, start, end) {
  const sliceStart = Math.max(span.start, start);
  const sliceEnd = Math.min(span.end, end);
  return sliceEnd > sliceStart ? { start: sliceStart, end: sliceEnd } : null;
}
function sliceStyleSpans(spans, start, end) {
  const sliced = [];
  for (const span of spans) {
    const bounds = resolveSliceBounds(span, start, end);
    if (bounds) {
      sliced.push(
        createStyleSpan({
          start: bounds.start - start,
          end: bounds.end - start,
          style: span.style,
          language: span.language
        })
      );
    }
  }
  return mergeStyleSpans(sliced);
}
function sliceLinkSpans(spans, start, end) {
  const sliced = [];
  for (const span of spans) {
    const bounds = resolveSliceBounds(span, start, end);
    if (bounds) {
      sliced.push(
        copyMarkdownLinkSpan(span, {
          start: bounds.start - start,
          end: bounds.end - start
        })
      );
    }
  }
  return sliced;
}
function sliceAnnotationSpans(spans, start, end) {
  const sliced = [];
  for (const span of spans) {
    const bounds = resolveSliceBounds(span, start, end);
    if (bounds) {
      sliced.push({
        ...span,
        start: bounds.start - start,
        end: bounds.end - start
      });
    }
  }
  return mergeAnnotationSpans(sliced);
}

// packages/markdown-core/src/ir-annotations.ts
function rangesOverlap2(left, right) {
  return left.start < right.end && left.end > right.start;
}
function annotateAssistantTranscriptRoleMessageBoundary(ir) {
  const firstLineEnd = ir.text.indexOf("\n");
  const boundaryText = firstLineEnd === -1 ? ir.text : ir.text.slice(0, firstLineEnd);
  const excludedRanges = ir.styles.filter((span) => span.style === "code" || span.style === "code_block").filter((span) => span.start < boundaryText.length).map(({ start, end }) => ({ start, end: Math.min(end, boundaryText.length) }));
  const boundarySpan = findAssistantTranscriptRoleHeaderSpans(boundaryText, excludedRanges)[0];
  if (!boundarySpan || (ir.annotations ?? []).some((span) => rangesOverlap2(span, boundarySpan))) {
    return ir;
  }
  const annotation = {
    ...boundarySpan,
    type: "assistant_transcript_role"
  };
  return {
    ...ir,
    // A role-looking link must not remain clickable after its label becomes a
    // message-leading transcript header.
    links: ir.links.filter((link) => !rangesOverlap2(link, annotation)),
    annotations: mergeAnnotationSpans([...ir.annotations ?? [], annotation])
  };
}

// packages/markdown-core/src/ir.ts
import MarkdownIt from "markdown-it";
import markdownItCjkFriendly from "markdown-it-cjk-friendly";

// packages/terminal-core/src/ansi-sequences.ts
var ANSI_OSC_INTRODUCER_PATTERN = "(?:\\x1b\\]|\\x9d)";
var ANSI_STRING_TERMINATOR_PATTERN = "(?:\\x1b\\\\|\\x07|\\x9c)";
var ANSI_OSC_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[^\\x07\\x1b\\x9c]*${ANSI_STRING_TERMINATOR_PATTERN}`;
var ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN = "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
var ansiOscAtIndexRegex = new RegExp(ANSI_OSC_PATTERN, "y");

// packages/terminal-core/src/ansi.ts
var ANSI_OSC_SEQUENCE_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[\\s\\S]*?${ANSI_STRING_TERMINATOR_PATTERN}`;
var ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX = new RegExp(
  `${ANSI_OSC_SEQUENCE_PATTERN}|${ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN}`,
  "y"
);
var graphemeSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
var rgiEmojiPattern = new RegExp("^\\p{RGI_Emoji}$", "v");

// packages/markdown-core/src/html-tags.ts
import { HTML_TAG_RE } from "markdown-it/lib/common/html_re.mjs";

// packages/markdown-core/src/ir.ts
function sliceMarkdownIR(ir, start, end) {
  const annotations = sliceAnnotationSpans(ir.annotations ?? [], start, end);
  return {
    text: ir.text.slice(start, end),
    styles: sliceStyleSpans(ir.styles, start, end),
    links: sliceLinkSpans(ir.links, start, end),
    ...annotations.length > 0 ? { annotations } : {}
  };
}

// packages/markdown-core/src/render-aware-chunking.ts
function resolveIntegerOption(value, fallback, opts) {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(opts.min, Math.trunc(value));
}
function prepareChunkForMessageBoundary(options, chunk) {
  return options.assistantTranscriptRoleMessageBoundaries === true ? annotateAssistantTranscriptRoleMessageBoundary(chunk) : chunk;
}
function renderMarkdownIRChunksWithinLimit(options) {
  if (!options.ir.text) {
    return [];
  }
  if (options.limit === Number.POSITIVE_INFINITY) {
    const source = prepareChunkForMessageBoundary(options, options.ir);
    return [{ source, rendered: options.renderChunk(source) }];
  }
  const normalizedLimit = resolveIntegerOption(options.limit, 1, { min: 1 });
  const renderResolver = {
    measureRendered: options.measureRendered,
    renderChunk: (chunk) => options.renderChunk(prepareChunkForMessageBoundary(options, chunk))
  };
  const pending = splitMarkdownIRPreserveWhitespace(options.ir, normalizedLimit).toReversed();
  const finalized = [];
  while (pending.length > 0) {
    const chunk = pending.pop();
    if (!chunk) {
      continue;
    }
    const rendered = renderResolver.renderChunk(chunk);
    if (renderResolver.measureRendered(rendered) <= normalizedLimit || chunk.text.length <= 1) {
      finalized.push(chunk);
      continue;
    }
    const split = splitMarkdownIRByRenderedLimit(chunk, normalizedLimit, renderResolver);
    if (split.length <= 1) {
      finalized.push(chunk);
      continue;
    }
    for (let index = split.length - 1; index >= 0; index -= 1) {
      const next = split[index];
      if (next) {
        pending.push(next);
      }
    }
  }
  return coalesceWhitespaceOnlyMarkdownIRChunks(finalized, normalizedLimit, renderResolver).map(
    (chunk) => {
      const source = prepareChunkForMessageBoundary(options, chunk);
      return { source, rendered: options.renderChunk(source) };
    }
  );
}
function splitMarkdownIRByRenderedLimit(chunk, renderedLimit, options) {
  const currentTextLength = chunk.text.length;
  if (currentTextLength <= 1) {
    return [chunk];
  }
  const splitLimit = findLargestChunkTextLengthWithinRenderedLimit(chunk, renderedLimit, options);
  if (splitLimit <= 0) {
    return [chunk];
  }
  const split = splitMarkdownIRPreserveWhitespace(chunk, splitLimit);
  const firstChunk = split[0];
  if (firstChunk && options.measureRendered(options.renderChunk(firstChunk)) <= renderedLimit) {
    return split;
  }
  return [
    sliceMarkdownIR(chunk, 0, splitLimit),
    sliceMarkdownIR(chunk, splitLimit, currentTextLength)
  ];
}
function findLargestChunkTextLengthWithinRenderedLimit(chunk, renderedLimit, options) {
  const currentTextLength = chunk.text.length;
  if (currentTextLength <= 1) {
    return currentTextLength;
  }
  for (let candidateLength = currentTextLength - 1; candidateLength >= 1; candidateLength -= 1) {
    const safeCandidateLength = avoidTrailingHighSurrogateBreak(chunk.text, 0, candidateLength);
    const candidate = sliceMarkdownIR(chunk, 0, safeCandidateLength);
    const rendered = options.renderChunk(candidate);
    if (options.measureRendered(rendered) <= renderedLimit) {
      return safeCandidateLength;
    }
  }
  return 0;
}
function findMarkdownIRPreservedSplitIndex(text, start, limit) {
  const maxEnd = Math.min(text.length, start + limit);
  if (maxEnd >= text.length) {
    return text.length;
  }
  let lastOutsideParenNewlineBreak = -1;
  let lastOutsideParenWhitespaceBreak = -1;
  let lastOutsideParenWhitespaceRunStart = -1;
  let lastAnyNewlineBreak = -1;
  let lastAnyWhitespaceBreak = -1;
  let lastAnyWhitespaceRunStart = -1;
  let parenDepth = 0;
  let sawNonWhitespace = false;
  for (let index = start; index < maxEnd; index += 1) {
    const char = text.charAt(index);
    if (char === "(") {
      sawNonWhitespace = true;
      parenDepth += 1;
      continue;
    }
    if (char === ")" && parenDepth > 0) {
      sawNonWhitespace = true;
      parenDepth -= 1;
      continue;
    }
    if (!/\s/.test(char)) {
      sawNonWhitespace = true;
      continue;
    }
    if (!sawNonWhitespace) {
      continue;
    }
    if (char === "\n") {
      lastAnyNewlineBreak = index + 1;
      if (parenDepth === 0) {
        lastOutsideParenNewlineBreak = index + 1;
      }
      continue;
    }
    const whitespaceRunStart = index === start || !/\s/.test(text[index - 1] ?? "") ? index : lastAnyWhitespaceRunStart;
    lastAnyWhitespaceBreak = index + 1;
    lastAnyWhitespaceRunStart = whitespaceRunStart;
    if (parenDepth === 0) {
      lastOutsideParenWhitespaceBreak = index + 1;
      lastOutsideParenWhitespaceRunStart = whitespaceRunStart;
    }
  }
  const resolveWhitespaceBreak = (breakIndex, runStart) => {
    if (breakIndex <= start) {
      return breakIndex;
    }
    if (runStart <= start) {
      return breakIndex;
    }
    return /\s/.test(text[breakIndex] ?? "") ? runStart : breakIndex;
  };
  if (lastOutsideParenNewlineBreak > start) {
    return lastOutsideParenNewlineBreak;
  }
  if (lastOutsideParenWhitespaceBreak > start) {
    return resolveWhitespaceBreak(
      lastOutsideParenWhitespaceBreak,
      lastOutsideParenWhitespaceRunStart
    );
  }
  if (lastAnyNewlineBreak > start) {
    return lastAnyNewlineBreak;
  }
  if (lastAnyWhitespaceBreak > start) {
    return resolveWhitespaceBreak(lastAnyWhitespaceBreak, lastAnyWhitespaceRunStart);
  }
  return avoidTrailingHighSurrogateBreak(text, start, maxEnd);
}
function splitMarkdownIRPreserveWhitespace(ir, limit) {
  if (!ir.text) {
    return [];
  }
  const normalizedLimit = resolveIntegerOption(limit, 1, { min: 1 });
  if (normalizedLimit <= 0 || ir.text.length <= normalizedLimit) {
    return [ir];
  }
  const chunks = [];
  let cursor = 0;
  while (cursor < ir.text.length) {
    const end = findMarkdownIRPreservedSplitIndex(ir.text, cursor, normalizedLimit);
    chunks.push(sliceMarkdownIR(ir, cursor, end));
    cursor = end;
  }
  return chunks;
}
function mergeAdjacentStyleSpans(styles) {
  const merged = [];
  for (const span of styles) {
    const last = merged.at(-1);
    if (last && last.style === span.style && last.language === span.language && span.start <= last.end) {
      last.end = Math.max(last.end, span.end);
      continue;
    }
    merged.push({ ...span });
  }
  return merged;
}
function mergeAdjacentLinkSpans(links) {
  const merged = [];
  for (const link of links) {
    const last = merged.at(-1);
    if (last && last.href === link.href && isAutoLinkedMarkdownLink(last) === isAutoLinkedMarkdownLink(link) && link.start <= last.end) {
      last.end = Math.max(last.end, link.end);
      continue;
    }
    merged.push(copyMarkdownLinkSpan(link));
  }
  return merged;
}
function mergeMarkdownIRChunks(left, right) {
  const offset = left.text.length;
  const shiftedAnnotations = [];
  for (const annotation of right.annotations ?? []) {
    shiftedAnnotations.push({
      ...annotation,
      start: annotation.start + offset,
      end: annotation.end + offset
    });
  }
  const shiftedStyles = [];
  for (const span of right.styles) {
    shiftedStyles.push({
      ...span,
      start: span.start + offset,
      end: span.end + offset
    });
  }
  const shiftedLinks = [];
  for (const link of right.links) {
    shiftedLinks.push(
      copyMarkdownLinkSpan(link, {
        start: link.start + offset,
        end: link.end + offset
      })
    );
  }
  const annotations = mergeAnnotationSpans([...left.annotations ?? [], ...shiftedAnnotations]);
  return {
    text: left.text + right.text,
    styles: mergeAdjacentStyleSpans([...left.styles, ...shiftedStyles]),
    links: mergeAdjacentLinkSpans([...left.links, ...shiftedLinks]),
    ...annotations.length > 0 ? { annotations } : {}
  };
}
function coalesceWhitespaceOnlyMarkdownIRChunks(chunks, renderedLimit, options) {
  const coalesced = [];
  let index = 0;
  while (index < chunks.length) {
    const chunk = chunks[index];
    if (!chunk) {
      index += 1;
      continue;
    }
    if (chunk.text.trim().length > 0) {
      coalesced.push(chunk);
      index += 1;
      continue;
    }
    const prev = coalesced.at(-1);
    const next = chunks[index + 1];
    const chunkLength = chunk.text.length;
    const canMerge = (candidate) => options.measureRendered(options.renderChunk(candidate)) <= renderedLimit;
    if (prev) {
      const mergedPrev = mergeMarkdownIRChunks(prev, chunk);
      if (canMerge(mergedPrev)) {
        coalesced[coalesced.length - 1] = mergedPrev;
        index += 1;
        continue;
      }
    }
    if (next) {
      const mergedNext = mergeMarkdownIRChunks(chunk, next);
      if (canMerge(mergedNext)) {
        chunks[index + 1] = mergedNext;
        index += 1;
        continue;
      }
    }
    if (prev && next) {
      for (let prefixLength = chunkLength - 1; prefixLength >= 1; prefixLength -= 1) {
        const prefix = sliceMarkdownIR(chunk, 0, prefixLength);
        const suffix = sliceMarkdownIR(chunk, prefixLength, chunkLength);
        const mergedPrev = mergeMarkdownIRChunks(prev, prefix);
        const mergedNext = mergeMarkdownIRChunks(suffix, next);
        if (canMerge(mergedPrev) && canMerge(mergedNext)) {
          coalesced[coalesced.length - 1] = mergedPrev;
          chunks[index + 1] = mergedNext;
          break;
        }
      }
    }
    index += 1;
  }
  return coalesced;
}
export {
  renderMarkdownIRChunksWithinLimit
};
