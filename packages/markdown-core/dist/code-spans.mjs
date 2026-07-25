// packages/markdown-core/src/fences.ts
function scanFenceSpans(buffer, state) {
  const spans = [];
  const startsAtLineStart = state?.atLineStart ?? true;
  let open = state?.open ? { ...state.open, start: 0 } : void 0;
  let offset = 0;
  while (offset <= buffer.length) {
    const nextNewline = buffer.indexOf("\n", offset);
    const lineEnd = nextNewline === -1 ? buffer.length : nextNewline;
    const line = buffer.slice(offset, lineEnd).replace(/\r$/, "");
    const match = line.match(/^( {0,3})(`{3,}|~{3,})(.*)$/);
    if (match && (offset > 0 || startsAtLineStart)) {
      const [, indent, marker, trailing] = match;
      if (indent === void 0 || marker === void 0 || trailing === void 0) {
        if (nextNewline === -1) {
          break;
        }
        offset = nextNewline + 1;
        continue;
      }
      const markerChar = marker.charAt(0);
      const markerLen = marker.length;
      if (!open) {
        open = {
          start: offset,
          markerChar,
          markerLen,
          openLine: line,
          marker,
          indent
        };
      } else if (open.markerChar === markerChar && markerLen >= open.markerLen && /^[ \t]*$/.test(trailing)) {
        const end = lineEnd;
        spans.push({
          start: open.start,
          end,
          openLine: open.openLine,
          marker: open.marker,
          indent: open.indent
        });
        open = void 0;
      }
    }
    if (nextNewline === -1) {
      break;
    }
    offset = nextNewline + 1;
  }
  if (open) {
    spans.push({
      start: open.start,
      end: buffer.length,
      openLine: open.openLine,
      marker: open.marker,
      indent: open.indent
    });
  }
  const atLineStart = buffer.length === 0 ? startsAtLineStart : buffer.endsWith("\n");
  const nextState = {
    atLineStart,
    ...open ? {
      open: {
        markerChar: open.markerChar,
        markerLen: open.markerLen,
        openLine: open.openLine,
        marker: open.marker,
        indent: open.indent
      }
    } : {}
  };
  return { spans, state: nextState };
}

// packages/markdown-core/src/code-spans.ts
function createInlineCodeState() {
  return { open: false, ticks: 0 };
}
function buildCodeSpanIndex(text, inlineState, fenceState) {
  const { spans: fenceSpans, state: nextFenceState } = scanFenceSpans(text, fenceState);
  const startState = inlineState ? { open: inlineState.open, ticks: inlineState.ticks } : createInlineCodeState();
  const { spans: inlineSpans, state: nextInlineState } = parseInlineCodeSpans(
    text,
    fenceSpans,
    startState
  );
  return {
    inlineState: nextInlineState,
    fenceState: nextFenceState,
    isInside: (index) => isInsideFenceSpan(index, fenceSpans) || isInsideInlineSpan(index, inlineSpans)
  };
}
function parseInlineCodeSpans(text, fenceSpans, initialState) {
  const spans = [];
  let open = initialState.open;
  let ticks = initialState.ticks;
  let openStart = open ? 0 : -1;
  let i = 0;
  while (i < text.length) {
    const fence = findFenceSpanAtInclusive(fenceSpans, i);
    if (fence) {
      i = fence.end;
      continue;
    }
    if (text[i] !== "`") {
      i += 1;
      continue;
    }
    const runStart = i;
    let runLength = 0;
    while (i < text.length && text[i] === "`") {
      runLength += 1;
      i += 1;
    }
    if (!open) {
      open = true;
      ticks = runLength;
      openStart = runStart;
      continue;
    }
    if (runLength === ticks) {
      spans.push([openStart, i]);
      open = false;
      ticks = 0;
      openStart = -1;
    }
  }
  if (open) {
    spans.push([openStart, text.length]);
  }
  return {
    spans,
    state: { open, ticks }
  };
}
function findFenceSpanAtInclusive(spans, index) {
  return spans.find((span) => index >= span.start && index < span.end);
}
function isInsideFenceSpan(index, spans) {
  return spans.some((span) => index >= span.start && index < span.end);
}
function isInsideInlineSpan(index, spans) {
  return spans.some(([start, end]) => index >= start && index < end);
}
export {
  buildCodeSpanIndex,
  createInlineCodeState
};
