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
export {
  ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE,
  markdownItAssistantTranscriptRoles
};
