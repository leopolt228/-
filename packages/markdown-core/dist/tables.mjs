// packages/markdown-core/src/ir.ts
import MarkdownIt from "markdown-it";
import markdownItCjkFriendly from "markdown-it-cjk-friendly";

// packages/terminal-core/src/ansi-sequences.ts
var ANSI_OSC_INTRODUCER_PATTERN = "(?:\\x1b\\]|\\x9d)";
var ANSI_STRING_TERMINATOR_PATTERN = "(?:\\x1b\\\\|\\x07|\\x9c)";
var ANSI_OSC_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[^\\x07\\x1b\\x9c]*${ANSI_STRING_TERMINATOR_PATTERN}`;
var ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN = "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
var ansiOscAtIndexRegex = new RegExp(ANSI_OSC_PATTERN, "y");
function matchAnsiOscAt(input, index) {
  ansiOscAtIndexRegex.lastIndex = index;
  return ansiOscAtIndexRegex.exec(input)?.[0];
}
function csiIntroducerLength(input, index) {
  const code = input.charCodeAt(index);
  if (code === 155) {
    return 1;
  }
  return code === 27 && input.charCodeAt(index + 1) === 91 ? 2 : 0;
}
function scanAnsiCsiAt(input, index) {
  const introducerLength = csiIntroducerLength(input, index);
  if (introducerLength === 0) {
    return void 0;
  }
  let cursor = index + introducerLength;
  const controls = [];
  let ended = false;
  while (cursor < input.length) {
    const code = input.charCodeAt(cursor);
    if (code === 24 || code === 26) {
      cursor += 1;
      ended = true;
      break;
    }
    if (code === 27 || code === 155) {
      ended = true;
      break;
    }
    if (code <= 31 || code === 127) {
      controls.push(input.charAt(cursor));
      cursor += 1;
      continue;
    }
    if (code >= 32 && code <= 63) {
      cursor += 1;
      continue;
    }
    if (code >= 64 && code <= 126) {
      cursor += 1;
    }
    ended = true;
    break;
  }
  return { controls, ended, value: input.slice(index, cursor) };
}

// packages/terminal-core/src/ansi.ts
var ANSI_OSC_SEQUENCE_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[\\s\\S]*?${ANSI_STRING_TERMINATOR_PATTERN}`;
var ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX = new RegExp(
  `${ANSI_OSC_SEQUENCE_PATTERN}|${ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN}`,
  "y"
);
var graphemeSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function hasAnsiIntroducer(input) {
  return input.includes("\x1B") || input.includes("\x9B") || input.includes("\x9D");
}
function stripAnsiInternal(input, options) {
  const output = [];
  let copyStart = 0;
  let index = 0;
  while (index < input.length) {
    const introducerCode = input.charCodeAt(index);
    if (introducerCode !== 27 && introducerCode !== 155 && introducerCode !== 157) {
      index += 1;
      continue;
    }
    const osc = matchAnsiOscAt(input, index);
    if (osc) {
      output.push(input.slice(copyStart, index));
      index += osc.length;
      copyStart = index;
      continue;
    }
    const csi = scanAnsiCsiAt(input, index);
    if (!csi) {
      ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.lastIndex = index;
      const compatibilityMatch2 = options.compatibilityGrammar ? ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.exec(input) : null;
      if (compatibilityMatch2) {
        output.push(input.slice(copyStart, index));
        index += compatibilityMatch2[0].length;
        copyStart = index;
        continue;
      }
      index += 1;
      continue;
    }
    ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.lastIndex = index;
    const compatibilityMatch = options.compatibilityGrammar ? ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.exec(input) : null;
    if (!csi.ended && options.preserveIncompleteCsi) {
      break;
    }
    let cursor = index + csi.value.length;
    const canonicalLength = csi.value.length;
    if (csi.controls.length === 0 && compatibilityMatch && compatibilityMatch[0].length > canonicalLength) {
      cursor = index + compatibilityMatch[0].length;
    }
    output.push(input.slice(copyStart, index), ...csi.controls);
    index = cursor;
    copyStart = cursor;
  }
  output.push(input.slice(copyStart));
  return output.join("");
}
function stripAnsi(input) {
  if (!hasAnsiIntroducer(input)) {
    return input;
  }
  return stripAnsiInternal(input, { compatibilityGrammar: false });
}
function splitGraphemes(input) {
  if (!input) {
    return [];
  }
  if (!graphemeSegmenter) {
    return Array.from(input);
  }
  try {
    return Array.from(graphemeSegmenter.segment(input), (segment) => segment.segment);
  } catch {
    return Array.from(input);
  }
}
function isZeroWidthCodePoint(codePoint) {
  return codePoint <= 31 && codePoint !== 9 || codePoint >= 127 && codePoint <= 159 || codePoint >= 768 && codePoint <= 879 || codePoint >= 6832 && codePoint <= 6911 || codePoint >= 7616 && codePoint <= 7679 || codePoint >= 8400 && codePoint <= 8447 || codePoint >= 65056 && codePoint <= 65071 || codePoint >= 65024 && codePoint <= 65039 || codePoint === 8205;
}
function isFullWidthCodePoint(codePoint) {
  if (codePoint < 4352) {
    return false;
  }
  return codePoint <= 4447 || codePoint === 9001 || codePoint === 9002 || codePoint >= 11904 && codePoint <= 12871 && codePoint !== 12351 || codePoint >= 12880 && codePoint <= 19903 || codePoint >= 19968 && codePoint <= 42182 || codePoint >= 43360 && codePoint <= 43388 || codePoint >= 44032 && codePoint <= 55203 || codePoint >= 63744 && codePoint <= 64255 || codePoint >= 65040 && codePoint <= 65049 || codePoint >= 65072 && codePoint <= 65131 || codePoint >= 65281 && codePoint <= 65376 || codePoint >= 65504 && codePoint <= 65510 || codePoint >= 110576 && codePoint <= 110579 || codePoint >= 110581 && codePoint <= 110587 || codePoint >= 110589 && codePoint <= 110590 || codePoint >= 110592 && codePoint <= 111359 || codePoint >= 127488 && codePoint <= 127569 || codePoint >= 131072 && codePoint <= 262141;
}
var rgiEmojiPattern = new RegExp("^\\p{RGI_Emoji}$", "v");
var emojiPresentationPattern = /\p{Emoji_Presentation}/u;
var regionalIndicatorPattern = /\p{Regional_Indicator}/u;
var unqualifiedKeycapPattern = /^[#*0-9]\u20E3$/u;
var extendedPictographicPattern = /\p{Extended_Pictographic}/gu;
function isWideEmojiGrapheme(grapheme) {
  const isRgiEmoji = rgiEmojiPattern.test(grapheme);
  if (regionalIndicatorPattern.test(grapheme)) {
    return isRgiEmoji;
  }
  if (emojiPresentationPattern.test(grapheme) || isRgiEmoji || unqualifiedKeycapPattern.test(grapheme)) {
    return true;
  }
  return grapheme.includes("\u200D") && (grapheme.match(extendedPictographicPattern)?.length ?? 0) >= 2;
}
function graphemeWidth(grapheme) {
  if (!grapheme) {
    return 0;
  }
  if (isWideEmojiGrapheme(grapheme)) {
    return 2;
  }
  let sawPrintable = false;
  for (const char of grapheme) {
    const codePoint = char.codePointAt(0);
    if (codePoint == null) {
      continue;
    }
    if (isZeroWidthCodePoint(codePoint)) {
      continue;
    }
    if (isFullWidthCodePoint(codePoint)) {
      return 2;
    }
    sawPrintable = true;
  }
  return sawPrintable ? 1 : 0;
}
function visibleWidth(input) {
  return splitGraphemes(stripAnsi(input)).reduce(
    (sum, grapheme) => sum + graphemeWidth(grapheme),
    0
  );
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

// packages/markdown-core/src/html-tags.ts
import { HTML_TAG_RE } from "markdown-it/lib/common/html_re.mjs";
function htmlTagName(rawTag, closing) {
  let end = closing ? 2 : 1;
  while (end < rawTag.length) {
    const code = rawTag.charCodeAt(end);
    const isAsciiLetter = code >= 65 && code <= 90 || code >= 97 && code <= 122;
    const isDigit = code >= 48 && code <= 57;
    if (!isAsciiLetter && !isDigit && code !== 45) {
      break;
    }
    end += 1;
  }
  return rawTag.slice(closing ? 2 : 1, end).toLowerCase();
}
function* tokenizeHtmlTags(html) {
  let cursor = 0;
  while (cursor < html.length) {
    const start = html.indexOf("<", cursor);
    if (start < 0) {
      return;
    }
    const match = HTML_TAG_RE.exec(html.slice(start));
    if (!match) {
      cursor = start + 1;
      continue;
    }
    const raw = match[0];
    const closing = raw.startsWith("</");
    const end = start + raw.length;
    const name = htmlTagName(raw, closing);
    if (!name) {
      cursor = end;
      continue;
    }
    yield {
      raw,
      start,
      end,
      name,
      closing,
      selfClosing: !closing && raw.trimEnd().endsWith("/>")
    };
    cursor = end;
  }
}

// packages/markdown-core/src/assistant-transcript.ts
var ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE = "assistant_transcript_role_text";
var RAW_CODE_CONTAINER_TAGS = /* @__PURE__ */ new Set(["code", "pre", "script", "style", "textarea"]);
function findRawCodeContainerRanges(text) {
  const ranges = [];
  const openTags = [];
  let rangeStart = -1;
  for (const tag of tokenizeHtmlTags(text)) {
    if (!RAW_CODE_CONTAINER_TAGS.has(tag.name)) {
      continue;
    }
    if (tag.closing) {
      const openIndex = openTags.lastIndexOf(tag.name);
      if (openIndex !== -1) {
        openTags.splice(openIndex);
        if (openTags.length === 0 && rangeStart !== -1) {
          ranges.push({ start: rangeStart, end: tag.end });
          rangeStart = -1;
        }
      }
    } else if (!tag.selfClosing) {
      if (openTags.length === 0) {
        rangeStart = tag.start;
      }
      openTags.push(tag.name);
    }
  }
  if (openTags.length > 0 && rangeStart !== -1) {
    ranges.push({ start: rangeStart, end: text.length });
  }
  return ranges;
}
function visibleTokenProjection(token, options) {
  if (token.type === "softbreak" || token.type === "hardbreak") {
    return { text: "\n", excludedRanges: [] };
  }
  if (token.type === "html_inline" && options.isStructuralHtmlInline?.(token) === true) {
    return null;
  }
  if (token.type === "text" || token.type === "html_inline") {
    return { text: token.content, excludedRanges: [] };
  }
  if (token.type === "code_inline") {
    return { text: token.content, excludedRanges: [{ start: 0, end: token.content.length }] };
  }
  if (token.type === "image") {
    return token.children && token.children.length > 0 ? visibleTokensProjection(token.children, options) : { text: token.content, excludedRanges: [] };
  }
  return null;
}
function visibleTokensProjection(tokens, options) {
  let text = "";
  const excludedRanges = [];
  for (const token of tokens) {
    const projection = visibleTokenProjection(token, options);
    if (!projection) {
      continue;
    }
    const offset = text.length;
    text += projection.text;
    for (const range of projection.excludedRanges) {
      excludedRanges.push({ start: offset + range.start, end: offset + range.end });
    }
  }
  excludedRanges.push(...findRawCodeContainerRanges(text));
  return { text, excludedRanges };
}
function cloneToken(TokenType, source, content, type = source.type) {
  const token = new TokenType(
    type,
    type === ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE ? "" : source.tag,
    0
  );
  Object.assign(token, source);
  token.type = type;
  token.content = content;
  token.children = null;
  return token;
}
function annotatedToken(TokenType, source, content, span) {
  const token = cloneToken(TokenType, source, content, ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE);
  token.meta = {
    ...source.meta && typeof source.meta === "object" ? source.meta : {},
    assistantTranscriptRoleHeader: {
      kind: span.kind,
      role: span.role
    }
  };
  return token;
}
function splitVisibleToken(params) {
  const { token, visibleStart } = params;
  const visibleEnd = visibleStart + token.content.length;
  const firstSpan = params.spans[params.spanStartIndex];
  if (!firstSpan || firstSpan.start >= visibleEnd) {
    return [token];
  }
  const result = [];
  let localCursor = 0;
  for (let spanIndex = params.spanStartIndex; spanIndex < params.spans.length; spanIndex += 1) {
    const span = params.spans[spanIndex];
    if (!span || span.start >= visibleEnd) {
      break;
    }
    if (span.end <= visibleStart) {
      continue;
    }
    const overlapStart = Math.max(span.start, visibleStart) - visibleStart;
    const overlapEnd = Math.min(span.end, visibleEnd) - visibleStart;
    if (overlapStart > localCursor) {
      result.push(
        cloneToken(params.TokenType, token, token.content.slice(localCursor, overlapStart))
      );
    }
    if (overlapEnd > overlapStart) {
      result.push(
        annotatedToken(
          params.TokenType,
          token,
          token.content.slice(overlapStart, overlapEnd),
          span
        )
      );
    }
    localCursor = overlapEnd;
  }
  if (localCursor < token.content.length) {
    result.push(cloneToken(params.TokenType, token, token.content.slice(localCursor)));
  }
  return result;
}
function annotateInlineChildren(TokenType, children, preserveLinks, options) {
  const projection = visibleTokensProjection(children, options);
  const spans = findAssistantTranscriptRoleHeaderSpans(projection.text, projection.excludedRanges);
  if (spans.length === 0) {
    return children;
  }
  const result = [];
  let visibleCursor = 0;
  let spanCursor = 0;
  for (const token of children) {
    const tokenProjection = visibleTokenProjection(token, options);
    if (!tokenProjection) {
      result.push(token);
      continue;
    }
    const content = tokenProjection.text;
    for (; ; ) {
      const span = spans[spanCursor];
      if (!span || span.end > visibleCursor) {
        break;
      }
      spanCursor += 1;
    }
    if (token.type === "text" || token.type === "html_inline") {
      result.push(
        ...splitVisibleToken({
          TokenType,
          token,
          visibleStart: visibleCursor,
          spanStartIndex: spanCursor,
          spans
        })
      );
    } else if (token.type === "image") {
      const visibleEnd = visibleCursor + content.length;
      const imageSpans = [];
      for (let spanIndex = spanCursor; spanIndex < spans.length; spanIndex += 1) {
        const span = spans[spanIndex];
        if (!span || span.start >= visibleEnd) {
          break;
        }
        if (span.end <= visibleCursor) {
          continue;
        }
        imageSpans.push({
          ...span,
          start: Math.max(span.start, visibleCursor) - visibleCursor,
          end: Math.min(span.end, visibleEnd) - visibleCursor
        });
      }
      if (imageSpans.length > 0) {
        token.meta = {
          ...token.meta && typeof token.meta === "object" ? token.meta : {},
          assistantTranscriptRoleImage: { text: content, spans: imageSpans }
        };
      }
      result.push(token);
    } else {
      result.push(token);
    }
    visibleCursor += content.length;
  }
  return preserveLinks ? result : removeLinksContainingAssistantTranscriptRoles(result);
}
function removeLinksContainingAssistantTranscriptRoles(tokens) {
  const openLinks = [];
  const suppressedLinks = /* @__PURE__ */ new Set();
  for (const token of tokens) {
    if (token.type === "link_open") {
      openLinks.push({ token, containsRole: false });
      continue;
    }
    const imageMeta = token.meta?.assistantTranscriptRoleImage;
    if (token.type === ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE || imageMeta?.spans.length) {
      for (const link of openLinks) {
        link.containsRole = true;
      }
      continue;
    }
    if (token.type !== "link_close") {
      continue;
    }
    const openLink = openLinks.pop();
    if (!openLink?.containsRole) {
      continue;
    }
    suppressedLinks.add(openLink.token);
    suppressedLinks.add(token);
  }
  const result = [];
  for (const token of tokens) {
    if (suppressedLinks.has(token)) {
      continue;
    }
    const previous = result.at(-1);
    if (previous?.type === ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE && token.type === ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE) {
      previous.content += token.content;
      continue;
    }
    result.push(token);
  }
  return result;
}
function annotateHtmlBlock(TokenType, token) {
  const spans = findAssistantTranscriptRoleHeaderSpans(
    token.content,
    findRawCodeContainerRanges(token.content)
  );
  if (spans.length === 0) {
    return [token];
  }
  return splitVisibleToken({ TokenType, token, visibleStart: 0, spanStartIndex: 0, spans });
}
function markdownItAssistantTranscriptRoles(md, options = {}) {
  md.core.ruler.after("text_join", "assistant_transcript_roles", (state) => {
    if (state.env?.assistantTranscriptRoleHeaders !== true) {
      return;
    }
    const tokens = [];
    const preserveLinks = state.env?.assistantTranscriptRolePreserveLinks === true;
    for (const token of state.tokens) {
      if (token.type === "inline" && token.children) {
        token.children = annotateInlineChildren(
          state.Token,
          token.children,
          preserveLinks,
          options
        );
        tokens.push(token);
        continue;
      }
      if (token.type === "html_block") {
        tokens.push(...annotateHtmlBlock(state.Token, token));
        continue;
      }
      tokens.push(token);
    }
    state.tokens = tokens;
  });
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
function clampStyleSpans(spans, maxLength) {
  const clamped = [];
  for (const span of spans) {
    const start = Math.max(0, Math.min(span.start, maxLength));
    const end = Math.max(start, Math.min(span.end, maxLength));
    if (end > start) {
      clamped.push(createStyleSpan({ start, end, style: span.style, language: span.language }));
    }
  }
  return clamped;
}
function clampLinkSpans(spans, maxLength) {
  const clamped = [];
  for (const span of spans) {
    const start = Math.max(0, Math.min(span.start, maxLength));
    const end = Math.max(start, Math.min(span.end, maxLength));
    if (end > start) {
      clamped.push(copyMarkdownLinkSpan(span, { start, end }));
    }
  }
  return clamped;
}
function clampAnnotationSpans(spans, maxLength) {
  const clamped = [];
  for (const span of spans) {
    const start = Math.max(0, Math.min(span.start, maxLength));
    const end = Math.max(start, Math.min(span.end, maxLength));
    if (end > start) {
      clamped.push({ ...span, start, end });
    }
  }
  return clamped;
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
function appendAssistantTranscriptRoleText(target, value, meta) {
  if (!value) {
    return;
  }
  const start = target.text.length;
  target.text += value;
  target.annotations.push({
    start,
    end: target.text.length,
    type: "assistant_transcript_role",
    kind: meta.kind,
    role: meta.role
  });
}
function appendAssistantTranscriptRoleImage(target, meta) {
  if (!meta.text) {
    return;
  }
  const offset = target.text.length;
  target.text += meta.text;
  for (const span of meta.spans) {
    target.annotations.push({
      ...span,
      start: offset + span.start,
      end: offset + span.end,
      type: "assistant_transcript_role"
    });
  }
}

// packages/markdown-core/src/ir-source-spacing.ts
function computeNextMappedBlockStarts(tokens) {
  const nextStarts = [];
  let nextStart;
  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    nextStarts[index] = nextStart;
    const currentStart = tokens[index]?.map?.[0];
    if (currentStart !== void 0) {
      nextStart = currentStart;
    }
  }
  return nextStarts;
}
function sourceBlockNewlineCount(preserveSourceBlockSpacing, nextBlockStart, blockLineEnd) {
  if (!preserveSourceBlockSpacing || blockLineEnd === void 0) {
    return void 0;
  }
  return nextBlockStart === void 0 ? 0 : Math.max(1, nextBlockStart - blockLineEnd + 1);
}

// packages/markdown-core/src/ir.ts
var OPEN_MARKDOWN_HTML_TAG_PATTERN = /<\/?[a-zA-Z][a-zA-Z0-9-]*\b[^<>]*$/;
function appendHeadingSeparator(state, nextBlockStart) {
  const newlineCount = sourceBlockNewlineCount(
    state.preserveSourceBlockSpacing,
    nextBlockStart,
    state.headingLineEnd
  );
  if (newlineCount === void 0) {
    appendParagraphSeparator(state);
    return;
  }
  if (newlineCount > 0) {
    state.text += "\n".repeat(newlineCount);
  }
  state.headingLineEnd = void 0;
}
function createMarkdownIt(options) {
  const md = new MarkdownIt({
    html: false,
    linkify: options.linkify ?? true,
    breaks: false,
    typographer: false
  });
  md.use(markdownItCjkFriendly);
  md.use(markdownItAssistantTranscriptRoles);
  if (options.enableSpoilers) {
    md.core.ruler.before("assistant_transcript_roles", "markdown_core_spoilers", (state) => {
      applySpoilerTokens(state.tokens);
    });
  }
  md.enable("strikethrough");
  if (options.tableMode && options.tableMode !== "off") {
    md.enable("table");
  } else {
    md.disable("table");
  }
  if (options.autolink === false) {
    md.disable("autolink");
  }
  return md;
}
function getAttr(token, name) {
  if (token.attrGet) {
    return token.attrGet(name);
  }
  if (token.attrs) {
    for (const [key, value] of token.attrs) {
      if (key === name) {
        return value;
      }
    }
  }
  return null;
}
function markdownTableAlignmentFromToken(token) {
  const value = getAttr(token, "style") ?? "";
  if (/text-align\s*:\s*left/i.test(value)) {
    return "left";
  }
  if (/text-align\s*:\s*center/i.test(value)) {
    return "center";
  }
  if (/text-align\s*:\s*right/i.test(value)) {
    return "right";
  }
  return void 0;
}
function createTextToken(base, content) {
  return { ...base, type: "text", content, children: void 0 };
}
function applySpoilerTokens(tokens) {
  for (const token of tokens) {
    if (token.children && token.children.length > 0) {
      token.children = injectSpoilersIntoInline(token.children);
    }
  }
}
function injectSpoilersIntoInline(tokens) {
  let totalDelims = 0;
  for (const token of tokens) {
    if (token.type !== "text") {
      continue;
    }
    const content = token.content ?? "";
    let i = 0;
    while (i < content.length) {
      const next = content.indexOf("||", i);
      if (next === -1) {
        break;
      }
      totalDelims += 1;
      i = next + 2;
    }
  }
  if (totalDelims < 2) {
    return tokens;
  }
  const usableDelims = totalDelims - totalDelims % 2;
  const result = [];
  const state = { spoilerOpen: false };
  let consumedDelims = 0;
  for (const token of tokens) {
    if (token.type !== "text") {
      result.push(token);
      continue;
    }
    const content = token.content ?? "";
    if (!content.includes("||")) {
      result.push(token);
      continue;
    }
    let index = 0;
    while (index < content.length) {
      const next = content.indexOf("||", index);
      if (next === -1) {
        if (index < content.length) {
          result.push(createTextToken(token, content.slice(index)));
        }
        break;
      }
      if (consumedDelims >= usableDelims) {
        result.push(createTextToken(token, content.slice(index)));
        break;
      }
      if (next > index) {
        result.push(createTextToken(token, content.slice(index, next)));
      }
      consumedDelims += 1;
      state.spoilerOpen = !state.spoilerOpen;
      result.push({
        type: state.spoilerOpen ? "spoiler_open" : "spoiler_close"
      });
      index = next + 2;
    }
  }
  return result;
}
function initRenderTarget() {
  return {
    text: "",
    styles: [],
    openStyles: [],
    links: [],
    linkStack: [],
    annotations: []
  };
}
function resolveRenderTarget(state) {
  return state.table?.currentCell ?? state;
}
function appendText(state, value) {
  if (!value) {
    return;
  }
  const target = resolveRenderTarget(state);
  target.text += value;
}
function openStyle(state, style) {
  const target = resolveRenderTarget(state);
  target.openStyles.push({ style, start: target.text.length });
}
function closeStyle(state, style, options) {
  const target = resolveRenderTarget(state);
  for (let i = target.openStyles.length - 1; i >= 0; i -= 1) {
    const open = target.openStyles.at(i);
    if (open?.style === style) {
      const start = open.start;
      target.openStyles.splice(i, 1);
      const end = options?.trimTrailingParagraphSeparator && target.text.endsWith("\n\n") ? target.text.length - 2 : target.text.length;
      if (end > start) {
        target.styles.push({ start, end, style });
      }
      return;
    }
  }
}
function appendParagraphSeparator(state, token) {
  if (state.table) {
    return;
  }
  if (state.env.listStack.length > 0) {
    const currentList = state.env.listStack[state.env.listStack.length - 1];
    const directListParagraphLevel = (currentList?.openLevel ?? 0) + 2;
    if (token?.type !== "paragraph_close" || token.hidden || token.level !== directListParagraphLevel) {
      return;
    }
  }
  state.text += "\n\n";
}
function appendTopLevelListSeparator(state) {
  const trailingNewlines = state.text.match(/\n*$/)?.[0].length ?? 0;
  if (trailingNewlines < 2) {
    state.text += "\n";
  }
}
function appendNestedListSeparator(state) {
  if (!state.text.endsWith("\n")) {
    state.text += "\n";
  }
}
function appendListPrefix(state) {
  const stack = state.env.listStack;
  const top = stack[stack.length - 1];
  if (!top) {
    return;
  }
  top.index += 1;
  const indent = "  ".repeat(Math.max(0, stack.length - 1));
  const prefix = top.type === "ordered" ? `${top.index}. ` : "\u2022 ";
  state.text += `${indent}${prefix}`;
}
function renderInlineCode(state, content) {
  if (!content) {
    return;
  }
  const target = resolveRenderTarget(state);
  const start = target.text.length;
  target.text += content;
  target.styles.push({ start, end: start + content.length, style: "code" });
}
function resolveFenceLanguage(info) {
  const language = info?.trim().split(/\s+/, 1)[0]?.trim();
  return language || void 0;
}
function renderCodeBlock(state, content, info, sourceNewlineCount) {
  let code = content ?? "";
  if (!code.endsWith("\n")) {
    code = `${code}
`;
  }
  const target = resolveRenderTarget(state);
  const start = target.text.length;
  target.text += code;
  target.styles.push(
    createStyleSpan({
      start,
      end: start + code.length,
      style: "code_block",
      language: resolveFenceLanguage(info)
    })
  );
  if (state.env.listStack.length === 0) {
    const extraNewlines = sourceNewlineCount === void 0 ? 1 : Math.max(0, sourceNewlineCount - 1);
    target.text += "\n".repeat(extraNewlines);
  }
}
function handleLinkClose(state) {
  const target = resolveRenderTarget(state);
  const link = target.linkStack.pop();
  if (!link?.href) {
    return;
  }
  const href = link.href.trim();
  if (!href) {
    return;
  }
  const start = link.labelStart;
  const end = target.text.length;
  const span = createMarkdownLinkSpan({ start, end, href }, { autoLinked: link.autoLinked });
  target.links.push(span);
}
function headingStyleFromToken(token) {
  switch (token.tag) {
    case "h1":
      return "heading_1";
    case "h2":
      return "heading_2";
    case "h3":
      return "heading_3";
    case "h4":
      return "heading_4";
    case "h5":
      return "heading_5";
    case "h6":
      return "heading_6";
    default:
      return null;
  }
}
function isInsideMarkdownHtmlTag(text) {
  const openTagStart = text.lastIndexOf("<");
  if (openTagStart === -1) {
    return false;
  }
  return text.lastIndexOf(">") < openTagStart && OPEN_MARKDOWN_HTML_TAG_PATTERN.test(text.slice(openTagStart));
}
function initTableState() {
  return {
    headers: [],
    rows: [],
    aligns: [],
    currentRow: [],
    currentCell: null,
    inHeader: false
  };
}
function finishTableCell(cell) {
  closeRemainingStyles(cell);
  return {
    text: cell.text,
    styles: cell.styles,
    links: cell.links,
    ...cell.annotations.length > 0 ? { annotations: cell.annotations } : {}
  };
}
function trimCell(cell) {
  const text = cell.text;
  let start = 0;
  let end = text.length;
  while (start < end && /\s/.test(text[start] ?? "")) {
    start += 1;
  }
  while (end > start && /\s/.test(text[end - 1] ?? "")) {
    end -= 1;
  }
  if (start === 0 && end === text.length) {
    return cell;
  }
  const trimmedText = text.slice(start, end);
  const trimmedLength = trimmedText.length;
  const trimmedStyles = [];
  for (const span of cell.styles) {
    const sliceStart = Math.max(0, span.start - start);
    const sliceEnd = Math.min(trimmedLength, span.end - start);
    if (sliceEnd > sliceStart) {
      trimmedStyles.push({ start: sliceStart, end: sliceEnd, style: span.style });
    }
  }
  const trimmedLinks = [];
  for (const span of cell.links) {
    const sliceStart = Math.max(0, span.start - start);
    const sliceEnd = Math.min(trimmedLength, span.end - start);
    if (sliceEnd > sliceStart) {
      trimmedLinks.push(copyMarkdownLinkSpan(span, { start: sliceStart, end: sliceEnd }));
    }
  }
  const trimmedAnnotations = sliceAnnotationSpans(cell.annotations ?? [], start, end);
  return {
    text: trimmedText,
    styles: trimmedStyles,
    links: trimmedLinks,
    ...trimmedAnnotations.length > 0 ? { annotations: trimmedAnnotations } : {}
  };
}
function appendCell(state, cell) {
  if (!cell.text) {
    return;
  }
  const start = state.text.length;
  state.text += cell.text;
  for (const span of cell.styles) {
    state.styles.push({
      start: start + span.start,
      end: start + span.end,
      style: span.style
    });
  }
  for (const link of cell.links) {
    state.links.push(
      copyMarkdownLinkSpan(link, {
        start: start + link.start,
        end: start + link.end
      })
    );
  }
  for (const annotation of cell.annotations ?? []) {
    state.annotations.push({
      ...annotation,
      start: start + annotation.start,
      end: start + annotation.end
    });
  }
}
function appendCellTextOnly(state, cell) {
  if (!cell.text) {
    return;
  }
  state.text += cell.text;
}
function collectTableBlock(state) {
  if (!state.table) {
    return;
  }
  const headerCells = state.table.headers.map(trimCell);
  const rowCells = state.table.rows.map((row) => row.map(trimCell));
  const table = {
    headers: headerCells.map((cell) => cell.text),
    rows: rowCells.map((row) => row.map((cell) => cell.text)),
    headerCells,
    rowCells,
    placeholderOffset: state.text.length,
    ...state.table.aligns.some(Boolean) ? { aligns: [...state.table.aligns] } : {}
  };
  state.collectedTables.push(table);
}
function appendTableBulletValue(state, params) {
  const { header, value, columnIndex, includeColumnFallback } = params;
  if (!value?.text) {
    return;
  }
  state.text += "\u2022 ";
  if (header?.text) {
    appendCell(state, header);
    state.text += ": ";
  } else if (includeColumnFallback) {
    state.text += `Column ${columnIndex}: `;
  }
  appendCell(state, value);
  state.text += "\n";
}
function renderTableAsBullets(state) {
  if (!state.table) {
    return;
  }
  const headers = state.table.headers.map(trimCell);
  const rows = state.table.rows.map((row) => row.map(trimCell));
  if (headers.length === 0 && rows.length === 0) {
    return;
  }
  const useFirstColAsLabel = headers.length > 1 && rows.length > 0;
  if (useFirstColAsLabel) {
    for (const row of rows) {
      if (row.length === 0) {
        continue;
      }
      const rowLabel = row[0];
      if (rowLabel?.text) {
        const labelStart = state.text.length;
        appendCell(state, rowLabel);
        const labelEnd = state.text.length;
        if (labelEnd > labelStart) {
          state.styles.push({ start: labelStart, end: labelEnd, style: "bold" });
        }
        state.text += "\n";
      }
      for (let i = 1; i < row.length; i++) {
        appendTableBulletValue(state, {
          header: headers[i],
          value: row[i],
          columnIndex: i,
          includeColumnFallback: true
        });
      }
      state.text += "\n";
    }
  } else {
    for (const row of rows) {
      for (let i = 0; i < row.length; i++) {
        appendTableBulletValue(state, {
          header: headers[i],
          value: row[i],
          columnIndex: i,
          includeColumnFallback: false
        });
      }
      state.text += "\n";
    }
  }
}
function renderTableAsCode(state) {
  if (!state.table) {
    return;
  }
  const headers = state.table.headers.map(trimCell);
  const rows = state.table.rows.map((row) => row.map(trimCell));
  const columnCount = Math.max(headers.length, ...rows.map((row) => row.length));
  if (columnCount === 0) {
    return;
  }
  const widths = Array.from({ length: columnCount }, () => 0);
  const updateWidths = (cells) => {
    for (const [i, currentWidth] of widths.entries()) {
      const cell = cells[i];
      const width = visibleWidth(cell?.text ?? "");
      if (currentWidth < width) {
        widths[i] = width;
      }
    }
  };
  updateWidths(headers);
  for (const row of rows) {
    updateWidths(row);
  }
  const codeStart = state.text.length;
  const appendRow = (cells) => {
    state.text += "|";
    for (const [i, width] of widths.entries()) {
      state.text += " ";
      const cell = cells[i];
      if (cell) {
        appendCellTextOnly(state, cell);
      }
      const pad = width - visibleWidth(cell?.text ?? "");
      if (pad > 0) {
        state.text += " ".repeat(pad);
      }
      state.text += " |";
    }
    state.text += "\n";
  };
  const appendDivider = () => {
    state.text += "|";
    for (const width of widths) {
      const dashCount = Math.max(3, width);
      state.text += ` ${"-".repeat(dashCount)} |`;
    }
    state.text += "\n";
  };
  appendRow(headers);
  appendDivider();
  for (const row of rows) {
    appendRow(row);
  }
  const codeEnd = state.text.length;
  if (codeEnd > codeStart) {
    state.styles.push({ start: codeStart, end: codeEnd, style: "code_block" });
  }
  if (state.env.listStack.length === 0) {
    state.text += "\n";
  }
}
function renderTokens(tokens, state) {
  const nextMappedBlockStarts = computeNextMappedBlockStarts(tokens);
  for (const [tokenIndex, token] of tokens.entries()) {
    switch (token.type) {
      case "inline":
        if (token.children) {
          renderTokens(token.children, state);
        }
        break;
      case "text":
        appendText(state, token.content ?? "");
        break;
      case ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE: {
        const meta = token.meta?.assistantTranscriptRoleHeader;
        if (meta) {
          appendAssistantTranscriptRoleText(resolveRenderTarget(state), token.content ?? "", meta);
        } else {
          appendText(state, token.content ?? "");
        }
        break;
      }
      case "em_open":
        openStyle(state, "italic");
        break;
      case "em_close":
        closeStyle(state, "italic");
        break;
      case "strong_open":
        openStyle(state, "bold");
        break;
      case "strong_close":
        closeStyle(state, "bold");
        break;
      case "s_open":
        openStyle(state, "strikethrough");
        break;
      case "s_close":
        closeStyle(state, "strikethrough");
        break;
      case "code_inline":
        renderInlineCode(state, token.content ?? "");
        break;
      case "spoiler_open":
        if (state.enableSpoilers) {
          openStyle(state, "spoiler");
        }
        break;
      case "spoiler_close":
        if (state.enableSpoilers) {
          closeStyle(state, "spoiler");
        }
        break;
      case "link_open": {
        const target = resolveRenderTarget(state);
        const href = isInsideMarkdownHtmlTag(target.text) ? "" : getAttr(token, "href") ?? "";
        target.linkStack.push({
          href,
          labelStart: target.text.length,
          autoLinked: token.markup === "linkify"
        });
        break;
      }
      case "link_close":
        handleLinkClose(state);
        break;
      case "image": {
        const meta = token.meta?.assistantTranscriptRoleImage;
        if (meta) {
          appendAssistantTranscriptRoleImage(resolveRenderTarget(state), meta);
        } else {
          appendText(state, token.content ?? "");
        }
        break;
      }
      case "softbreak":
      case "hardbreak":
        appendText(state, "\n");
        break;
      case "paragraph_close":
        appendParagraphSeparator(state, token);
        break;
      case "heading_open":
        state.headingLineEnd = token.map?.[1];
        if (state.headingStyle === "bold") {
          openStyle(state, "bold");
        } else if (state.headingStyle === "rich") {
          const style = headingStyleFromToken(token);
          if (style) {
            openStyle(state, style);
          }
        }
        break;
      case "heading_close":
        if (state.headingStyle === "bold") {
          closeStyle(state, "bold");
        } else if (state.headingStyle === "rich") {
          const style = headingStyleFromToken(token);
          if (style) {
            closeStyle(state, style);
          }
        }
        appendHeadingSeparator(state, nextMappedBlockStarts[tokenIndex]);
        break;
      case "blockquote_open":
        if (state.blockquotePrefix) {
          state.text += state.blockquotePrefix;
        }
        openStyle(state, "blockquote");
        break;
      case "blockquote_close":
        closeStyle(state, "blockquote", { trimTrailingParagraphSeparator: true });
        break;
      case "bullet_list_open":
        if (state.env.listStack.length > 0) {
          appendNestedListSeparator(state);
        }
        state.env.listStack.push({ type: "bullet", index: 0, openLevel: token.level ?? 0 });
        break;
      case "bullet_list_close":
        state.env.listStack.pop();
        if (state.env.listStack.length === 0) {
          appendTopLevelListSeparator(state);
        }
        break;
      case "ordered_list_open": {
        if (state.env.listStack.length > 0) {
          appendNestedListSeparator(state);
        }
        const start = Number(getAttr(token, "start") ?? "1");
        state.env.listStack.push({
          type: "ordered",
          index: start - 1,
          openLevel: token.level ?? 0
        });
        break;
      }
      case "ordered_list_close":
        state.env.listStack.pop();
        if (state.env.listStack.length === 0) {
          appendTopLevelListSeparator(state);
        }
        break;
      case "list_item_open":
        appendListPrefix(state);
        break;
      case "list_item_close":
        if (!state.text.endsWith("\n")) {
          state.text += "\n";
        }
        break;
      case "code_block":
      case "fence":
        renderCodeBlock(
          state,
          token.content ?? "",
          token.info,
          sourceBlockNewlineCount(
            state.preserveSourceBlockSpacing,
            nextMappedBlockStarts[tokenIndex],
            token.map?.[1]
          )
        );
        break;
      case "html_block":
      case "html_inline":
        appendText(state, token.content ?? "");
        break;
      // Table handling
      case "table_open":
        if (state.tableMode !== "off") {
          state.table = initTableState();
          state.hasTables = true;
        }
        break;
      case "table_close":
        if (state.table) {
          if (state.tableMode === "bullets") {
            renderTableAsBullets(state);
          } else if (state.tableMode === "code") {
            renderTableAsCode(state);
          } else if (state.tableMode === "block") {
            collectTableBlock(state);
          }
        }
        state.table = null;
        break;
      case "thead_open":
        if (state.table) {
          state.table.inHeader = true;
        }
        break;
      case "thead_close":
        if (state.table) {
          state.table.inHeader = false;
        }
        break;
      case "tbody_open":
      case "tbody_close":
        break;
      case "tr_open":
        if (state.table) {
          state.table.currentRow = [];
        }
        break;
      case "tr_close":
        if (state.table) {
          if (state.table.inHeader) {
            state.table.headers = state.table.currentRow;
          } else {
            state.table.rows.push(state.table.currentRow);
          }
          state.table.currentRow = [];
        }
        break;
      case "th_open":
      case "td_open":
        if (state.table) {
          state.table.currentCell = initRenderTarget();
          if (token.type === "th_open" && state.table.inHeader) {
            state.table.aligns[state.table.currentRow.length] = markdownTableAlignmentFromToken(token);
          }
        }
        break;
      case "th_close":
      case "td_close":
        if (state.table?.currentCell) {
          state.table.currentRow.push(finishTableCell(state.table.currentCell));
          state.table.currentCell = null;
        }
        break;
      case "hr":
        if (state.horizontalRuleText) {
          state.text += `${state.horizontalRuleText}

`;
        }
        break;
      default:
        if (token.children) {
          renderTokens(token.children, state);
        }
        break;
    }
  }
}
function closeRemainingStyles(target) {
  for (const open of target.openStyles.toReversed()) {
    const end = target.text.length;
    if (end > open.start) {
      target.styles.push({
        start: open.start,
        end,
        style: open.style
      });
    }
  }
  target.openStyles = [];
}
function markdownToIRWithMeta(markdown, options = {}) {
  const env = {
    listStack: [],
    assistantTranscriptRoleHeaders: options.assistantTranscriptRoleHeaders === true,
    assistantTranscriptRolePreserveLinks: options.assistantTranscriptRoleHeaders === true
  };
  const md = createMarkdownIt(options);
  const tokens = md.parse(markdown ?? "", env);
  const tableMode = options.tableMode ?? "off";
  const state = {
    text: "",
    styles: [],
    openStyles: [],
    links: [],
    linkStack: [],
    annotations: [],
    env,
    headingStyle: options.headingStyle ?? "none",
    blockquotePrefix: options.blockquotePrefix ?? "",
    enableSpoilers: options.enableSpoilers ?? false,
    tableMode,
    table: null,
    hasTables: false,
    collectedTables: [],
    horizontalRuleText: options.horizontalRuleText ?? "\u2500\u2500\u2500",
    preserveSourceBlockSpacing: options.preserveSourceBlockSpacing ?? false,
    headingLineEnd: void 0
  };
  renderTokens(tokens, state);
  closeRemainingStyles(state);
  const trimmedText = state.text.trimEnd();
  const trimmedLength = trimmedText.length;
  let codeBlockEnd = 0;
  for (const span of state.styles) {
    if (span.style !== "code_block") {
      continue;
    }
    if (span.end > codeBlockEnd) {
      codeBlockEnd = span.end;
    }
  }
  const finalLength = Math.max(trimmedLength, codeBlockEnd);
  const finalText = finalLength === state.text.length ? state.text : state.text.slice(0, finalLength);
  const annotations = mergeAnnotationSpans(clampAnnotationSpans(state.annotations, finalLength));
  return {
    ir: {
      text: finalText,
      styles: mergeStyleSpans(clampStyleSpans(state.styles, finalLength)),
      links: clampLinkSpans(state.links, finalLength),
      ...annotations.length > 0 ? { annotations } : {}
    },
    hasTables: state.hasTables,
    tables: state.collectedTables.map(
      (table) => Object.assign({}, table, {
        placeholderOffset: Math.min(table.placeholderOffset, finalLength)
      })
    )
  };
}

// packages/markdown-core/src/render.ts
function getMarkdownLinkOrigin(link) {
  return isAutoLinkedMarkdownLink(link) ? "linkify" : "authored";
}
var STYLE_ORDER = [
  "blockquote",
  "code_block",
  "code",
  "heading_1",
  "heading_2",
  "heading_3",
  "heading_4",
  "heading_5",
  "heading_6",
  "bold",
  "italic",
  "strikethrough",
  "spoiler"
];
var STYLE_RANK = new Map(
  STYLE_ORDER.map((style, index) => [style, index])
);
var STRUCTURAL_STYLES = /* @__PURE__ */ new Set([
  "blockquote",
  "heading_1",
  "heading_2",
  "heading_3",
  "heading_4",
  "heading_5",
  "heading_6"
]);
function sortStyleSpans(spans) {
  return [...spans].toSorted((a, b) => {
    if (a.start !== b.start) {
      return a.start - b.start;
    }
    if (a.end !== b.end) {
      return b.end - a.end;
    }
    return (STYLE_RANK.get(a.style) ?? 0) - (STYLE_RANK.get(b.style) ?? 0);
  });
}
function mergeRanges(ranges) {
  const merged = [];
  for (const range of [...ranges].toSorted((a, b) => a.start - b.start || a.end - b.end)) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) {
      previous.end = Math.max(previous.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }
  return merged;
}
function firstOverlappingRangeIndex(ranges, start) {
  let low = 0;
  let high = ranges.length;
  while (low < high) {
    const middle = low + Math.floor((high - low) / 2);
    const range = ranges[middle];
    if (range && range.end <= start) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }
  return low;
}
function subtractRanges(span, ranges) {
  const firstOverlap = firstOverlappingRangeIndex(ranges, span.start);
  const firstRange = ranges[firstOverlap];
  if (!firstRange || firstRange.start >= span.end) {
    return [span];
  }
  const pieces = [];
  let cursor = span.start;
  for (let index = firstOverlap; index < ranges.length; index += 1) {
    const range = ranges[index];
    if (!range || range.start >= span.end) {
      break;
    }
    const rangeStart = Math.max(span.start, range.start);
    const rangeEnd = Math.min(span.end, range.end);
    if (rangeStart > cursor) {
      pieces.push({ ...span, start: cursor, end: rangeStart });
    }
    cursor = Math.max(cursor, rangeEnd);
  }
  if (cursor < span.end) {
    pieces.push({ ...span, start: cursor, end: span.end });
  }
  return pieces;
}
function splitAtBoundaries(span, boundaries) {
  let low = 0;
  let high = boundaries.length;
  while (low < high) {
    const middle = low + Math.floor((high - low) / 2);
    if ((boundaries[middle] ?? Number.POSITIVE_INFINITY) <= span.start) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }
  if ((boundaries[low] ?? Number.POSITIVE_INFINITY) >= span.end) {
    return [span];
  }
  const pieces = [];
  let cursor = span.start;
  for (let index = low; index < boundaries.length; index += 1) {
    const boundary = boundaries[index];
    if (boundary === void 0 || boundary >= span.end) {
      break;
    }
    pieces.push({ ...span, start: cursor, end: boundary });
    cursor = boundary;
  }
  pieces.push({ ...span, start: cursor, end: span.end });
  return pieces;
}
function sortAnnotationSpans(spans) {
  return [...spans].toSorted((a, b) => a.start - b.start || b.end - a.end);
}
function renderMarkdownWithMarkers(ir, options) {
  const text = ir.text ?? "";
  if (!text) {
    return "";
  }
  const styleMarkers = options.styleMarkers;
  const annotationMarkers = options.annotationMarkers ?? {};
  const annotated = sortAnnotationSpans(
    (ir.annotations ?? []).filter((span) => Boolean(annotationMarkers[span.type]))
  );
  const dominantAnnotations = annotated.filter(
    (span) => annotationMarkers[span.type]?.suppressNestedFormatting === true
  );
  const dominantAnnotationRanges = mergeRanges(dominantAnnotations);
  const annotationBoundaries = [
    ...new Set(annotated.flatMap((span) => [span.start, span.end]))
  ].toSorted((a, b) => a - b);
  const styled = sortStyleSpans(
    ir.styles.filter((span) => Boolean(styleMarkers[span.style])).flatMap((span) => {
      if (STRUCTURAL_STYLES.has(span.style)) {
        return [span];
      }
      return subtractRanges(span, dominantAnnotationRanges).flatMap(
        (piece) => splitAtBoundaries(piece, annotationBoundaries)
      );
    })
  );
  const boundaries = /* @__PURE__ */ new Set();
  boundaries.add(0);
  boundaries.add(text.length);
  const startsAt = /* @__PURE__ */ new Map();
  for (const span of styled) {
    if (span.start === span.end) {
      continue;
    }
    boundaries.add(span.start);
    boundaries.add(span.end);
    const bucket = startsAt.get(span.start);
    if (bucket) {
      bucket.push(span);
    } else {
      startsAt.set(span.start, [span]);
    }
  }
  for (const spans of startsAt.values()) {
    spans.sort((a, b) => {
      if (a.end !== b.end) {
        return b.end - a.end;
      }
      return (STYLE_RANK.get(a.style) ?? 0) - (STYLE_RANK.get(b.style) ?? 0);
    });
  }
  const annotationStarts = /* @__PURE__ */ new Map();
  for (const span of annotated) {
    if (span.start === span.end) {
      continue;
    }
    boundaries.add(span.start);
    boundaries.add(span.end);
    const bucket = annotationStarts.get(span.start);
    if (bucket) {
      bucket.push(span);
    } else {
      annotationStarts.set(span.start, [span]);
    }
  }
  const linkStarts = /* @__PURE__ */ new Map();
  if (options.buildLink) {
    const links = ir.links.flatMap(
      (span) => subtractRanges(span, dominantAnnotationRanges).flatMap((piece) => splitAtBoundaries(piece, annotationBoundaries)).map(
        (piece) => copyMarkdownLinkSpan(span, {
          start: piece.start,
          end: piece.end,
          href: piece.href
        })
      )
    );
    for (const link of links) {
      if (link.start === link.end) {
        continue;
      }
      const rendered = options.buildLink(link, text, { origin: getMarkdownLinkOrigin(link) });
      if (!rendered) {
        continue;
      }
      boundaries.add(rendered.start);
      boundaries.add(rendered.end);
      const openBucket = linkStarts.get(rendered.start);
      if (openBucket) {
        openBucket.push(rendered);
      } else {
        linkStarts.set(rendered.start, [rendered]);
      }
    }
  }
  const points = [...boundaries].toSorted((a, b) => a - b);
  const stack = [];
  let out = "";
  for (const [i, pos] of points.entries()) {
    while (stack.length && stack[stack.length - 1]?.end === pos) {
      const item = stack.pop();
      if (item) {
        out += item.close;
      }
    }
    const openingItems = [];
    const openingAnnotations = annotationStarts.get(pos);
    if (openingAnnotations) {
      for (const [index, span] of openingAnnotations.entries()) {
        const marker = annotationMarkers[span.type];
        if (!marker) {
          continue;
        }
        openingItems.push({
          end: span.end,
          open: typeof marker.open === "function" ? marker.open(span) : marker.open,
          close: marker.close,
          kind: "annotation",
          index
        });
      }
    }
    const openingLinks = linkStarts.get(pos);
    if (openingLinks && openingLinks.length > 0) {
      for (const [index, link] of openingLinks.entries()) {
        openingItems.push({
          end: link.end,
          open: link.open,
          close: link.close,
          kind: "link",
          index
        });
      }
    }
    const openingStyles = startsAt.get(pos);
    if (openingStyles) {
      for (const [index, span] of openingStyles.entries()) {
        const marker = styleMarkers[span.style];
        if (!marker) {
          continue;
        }
        openingItems.push({
          end: span.end,
          open: typeof marker.open === "function" ? marker.open(span) : marker.open,
          close: marker.close,
          kind: "style",
          style: span.style,
          index
        });
      }
    }
    if (openingItems.length > 0) {
      openingItems.sort((a, b) => {
        if (a.end !== b.end) {
          return b.end - a.end;
        }
        const aStructural = a.kind === "style" && STRUCTURAL_STYLES.has(a.style);
        const bStructural = b.kind === "style" && STRUCTURAL_STYLES.has(b.style);
        if (aStructural !== bStructural || a.kind !== b.kind) {
          const kindRank = { annotation: 0, link: 1, style: 2 };
          const aRank = aStructural ? -1 : kindRank[a.kind];
          const bRank = bStructural ? -1 : kindRank[b.kind];
          return aRank - bRank;
        }
        if (a.kind === "style" && b.kind === "style") {
          return (STYLE_RANK.get(a.style) ?? 0) - (STYLE_RANK.get(b.style) ?? 0);
        }
        return a.index - b.index;
      });
      for (const item of openingItems) {
        out += item.open;
        stack.push({ close: item.close, end: item.end });
      }
    }
    const next = points.at(i + 1);
    if (next === void 0) {
      break;
    }
    if (next > pos) {
      out += options.escapeText(text.slice(pos, next));
    }
  }
  return out;
}

// packages/markdown-core/src/tables.ts
var MARKDOWN_STYLE_MARKERS = {
  bold: { open: "**", close: "**" },
  italic: { open: "_", close: "_" },
  strikethrough: { open: "~~", close: "~~" },
  code: { open: "`", close: "`" },
  code_block: { open: "```\n", close: "```" }
};
function convertMarkdownTables(markdown, mode) {
  if (!markdown || mode === "off") {
    return markdown;
  }
  const effectiveMode = mode === "block" ? "code" : mode;
  const { ir, hasTables } = markdownToIRWithMeta(markdown, {
    linkify: false,
    autolink: false,
    headingStyle: "none",
    blockquotePrefix: "",
    tableMode: effectiveMode
  });
  if (!hasTables) {
    return markdown;
  }
  return renderMarkdownWithMarkers(ir, {
    styleMarkers: MARKDOWN_STYLE_MARKERS,
    escapeText: (text) => text,
    buildLink: (link, text) => {
      const href = link.href.trim();
      if (!href) {
        return null;
      }
      const label = text.slice(link.start, link.end);
      if (!label) {
        return null;
      }
      return { start: link.start, end: link.end, open: "[", close: `](${href})` };
    }
  });
}
export {
  convertMarkdownTables
};
