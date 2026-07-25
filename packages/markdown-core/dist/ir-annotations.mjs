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
export {
  annotateAssistantTranscriptRoleMessageBoundary,
  appendAssistantTranscriptRoleImage,
  appendAssistantTranscriptRoleText
};
