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
export {
  clampAnnotationSpans,
  clampLinkSpans,
  clampStyleSpans,
  copyMarkdownLinkSpan,
  createMarkdownLinkSpan,
  createStyleSpan,
  isAutoLinkedMarkdownLink,
  mergeAnnotationSpans,
  mergeStyleSpans,
  sliceAnnotationSpans,
  sliceLinkSpans,
  sliceStyleSpans
};
