// packages/gateway-protocol/src/session-icon.ts
var SESSION_AGENT_ATTENTION_ICON_IDS = [
  "hand",
  "key",
  "alert",
  "flag",
  "lock",
  "hourglass"
];
var NAMED_ICON_RE = /^[a-z0-9-]{1,32}$/;
var EXTENDED_PICTOGRAPHIC_RE = /\p{Extended_Pictographic}/u;
var SVG_PREFIX = "svg:";
var SVG_MAX_BYTES = 4096;
var graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
var SVG_ELEMENTS = /* @__PURE__ */ new Set([
  "svg",
  "g",
  "path",
  "circle",
  "ellipse",
  "rect",
  "line",
  "polyline",
  "polygon",
  "title"
]);
var SVG_ATTRIBUTES = /* @__PURE__ */ new Set([
  "viewBox",
  "xmlns",
  "d",
  "fill",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "x",
  "y",
  "x1",
  "y1",
  "x2",
  "y2",
  "width",
  "height",
  "points",
  "opacity",
  "fill-rule",
  "transform"
]);
var SVG_PAINT_RE = /^(?:none|currentColor|#[0-9a-fA-F]{3,4}|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{8})$/;
var SVG_NUMBER_SOURCE = "[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][-+]?\\d+)?";
var SVG_NUMBER_RE = new RegExp(`^${SVG_NUMBER_SOURCE}$`);
var SVG_TRANSFORM_RE = new RegExp(`^([a-z]+)\\s*\\(([^)]*)\\)`);
var SVG_SUSPICIOUS_VALUE_RE = /(?:javascript|url\s*\(|data:|expression)/i;
var XML_ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'"
};
function parseXmlEntities(value) {
  let result = "";
  let offset = 0;
  while (offset < value.length) {
    const ampersand = value.indexOf("&", offset);
    if (ampersand < 0) {
      return result + value.slice(offset);
    }
    result += value.slice(offset, ampersand);
    const semicolon = value.indexOf(";", ampersand + 1);
    if (semicolon < 0) {
      return null;
    }
    const entity = value.slice(ampersand, semicolon + 1);
    const decoded = XML_ENTITIES[entity];
    if (decoded === void 0) {
      return null;
    }
    result += decoded;
    offset = semicolon + 1;
  }
  return result;
}
function escapeXmlText(value) {
  return value.replace(/[&<>]/g, (character) => {
    if (character === "&") {
      return "&amp;";
    }
    return character === "<" ? "&lt;" : "&gt;";
  });
}
function escapeXmlAttribute(value) {
  return escapeXmlText(value).replace(/"/g, "&quot;");
}
function parseTransformNumbers(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }
  const parts = trimmed.split(/[\s,]+/);
  if (parts.some((part) => !SVG_NUMBER_RE.test(part))) {
    return null;
  }
  return parts.length;
}
function isValidTransform(value) {
  let remaining = value.trim();
  while (remaining) {
    const match = SVG_TRANSFORM_RE.exec(remaining);
    if (!match) {
      return false;
    }
    const name = match[1];
    const count = parseTransformNumbers(match[2] ?? "");
    const validCount = name === "translate" || name === "scale" ? count === 1 || count === 2 : name === "rotate" ? count === 1 || count === 3 : name === "matrix" ? count === 6 : false;
    if (!validCount) {
      return false;
    }
    remaining = remaining.slice(match[0].length).trimStart();
    if (remaining.startsWith(",")) {
      remaining = remaining.slice(1).trimStart();
    }
  }
  return true;
}
function isNameCharacter(character) {
  return /[A-Za-z0-9-]/.test(character);
}
function sanitizeSvg(svg) {
  let offset = 0;
  let rootSeen = false;
  let rootClosed = false;
  const stack = [];
  const output = [];
  const skipWhitespace = () => {
    while (offset < svg.length && /\s/.test(svg[offset] ?? "")) {
      offset += 1;
    }
  };
  const readName = () => {
    const start = offset;
    while (offset < svg.length && isNameCharacter(svg[offset] ?? "")) {
      offset += 1;
    }
    return svg.slice(start, offset);
  };
  while (offset < svg.length) {
    if (svg[offset] !== "<") {
      const nextTag = svg.indexOf("<", offset);
      const end = nextTag < 0 ? svg.length : nextTag;
      const rawText = svg.slice(offset, end);
      const text = parseXmlEntities(rawText);
      if (text === null || stack.length === 0 || rootClosed) {
        if (rawText.trim()) {
          return null;
        }
      } else if (text.trim()) {
        if (stack.at(-1) !== "title") {
          return null;
        }
        output.push(escapeXmlText(text));
      }
      offset = end;
      continue;
    }
    offset += 1;
    if (svg[offset] === "/") {
      offset += 1;
      const name2 = readName();
      skipWhitespace();
      if (!name2 || svg[offset] !== ">" || stack.at(-1) !== name2) {
        return null;
      }
      offset += 1;
      stack.pop();
      output.push(`</${name2}>`);
      if (stack.length === 0) {
        rootClosed = true;
      }
      continue;
    }
    const name = readName();
    if (!SVG_ELEMENTS.has(name) || rootClosed || stack.at(-1) === "title") {
      return null;
    }
    if (stack.length === 0) {
      if (rootSeen || name !== "svg") {
        return null;
      }
      rootSeen = true;
    } else if (name === "svg") {
      return null;
    }
    const attributes = [];
    const attributeNames = /* @__PURE__ */ new Set();
    let selfClosing = false;
    let tagClosed = false;
    while (offset < svg.length) {
      skipWhitespace();
      if (svg.startsWith("/>", offset)) {
        selfClosing = true;
        tagClosed = true;
        offset += 2;
        break;
      }
      if (svg[offset] === ">") {
        tagClosed = true;
        offset += 1;
        break;
      }
      const attributeName = readName();
      if (!SVG_ATTRIBUTES.has(attributeName) || attributeNames.has(attributeName) || attributeName.toLowerCase().startsWith("on")) {
        return null;
      }
      attributeNames.add(attributeName);
      skipWhitespace();
      if (svg[offset] !== "=") {
        return null;
      }
      offset += 1;
      skipWhitespace();
      const quote = svg[offset];
      if (quote !== '"' && quote !== "'") {
        return null;
      }
      offset += 1;
      const valueStart = offset;
      while (offset < svg.length && svg[offset] !== quote) {
        if (svg[offset] === "<") {
          return null;
        }
        offset += 1;
      }
      if (svg[offset] !== quote) {
        return null;
      }
      const rawValue = svg.slice(valueStart, offset);
      offset += 1;
      const value = parseXmlEntities(rawValue);
      if (value === null || SVG_SUSPICIOUS_VALUE_RE.test(value)) {
        return null;
      }
      const isRoot = stack.length === 0 && name === "svg";
      if (attributeName === "xmlns" && (!isRoot || value !== "http://www.w3.org/2000/svg") || (attributeName === "fill" || attributeName === "stroke") && !SVG_PAINT_RE.test(value) || attributeName === "transform" && !isValidTransform(value)) {
        return null;
      }
      attributes.push({ name: attributeName, value });
    }
    if (!tagClosed || name === "svg" && selfClosing) {
      return null;
    }
    const serializedAttributes = attributes.map((attribute) => ` ${attribute.name}="${escapeXmlAttribute(attribute.value)}"`).join("");
    output.push(`<${name}${serializedAttributes}${selfClosing ? "/>" : ">"}`);
    if (!selfClosing) {
      stack.push(name);
    }
  }
  return rootSeen && rootClosed && stack.length === 0 ? output.join("") : null;
}
function isEmoji(value) {
  return value.length <= 16 && EXTENDED_PICTOGRAPHIC_RE.test(value) && Array.from(graphemeSegmenter.segment(value)).length === 1;
}
function parseSessionIcon(value) {
  if (value.startsWith("name:")) {
    const name = value.slice("name:".length);
    return NAMED_ICON_RE.test(name) ? { kind: "named", name } : null;
  }
  if (value.startsWith(SVG_PREFIX)) {
    const svg = value.slice(SVG_PREFIX.length);
    return /^<svg(?:\s|>)/.test(svg) && svg.endsWith("</svg>") ? { kind: "svg", svg } : null;
  }
  return isEmoji(value) ? { kind: "emoji", emoji: value } : null;
}
function normalizeSessionIconInput(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: false, reason: "session icon is empty" };
  }
  if (trimmed.startsWith(SVG_PREFIX)) {
    if (new TextEncoder().encode(trimmed).byteLength > SVG_MAX_BYTES) {
      return { ok: false, reason: `session SVG icon exceeds ${SVG_MAX_BYTES} bytes` };
    }
    const parsed2 = parseSessionIcon(trimmed);
    if (!parsed2 || parsed2.kind !== "svg") {
      return { ok: false, reason: "invalid session SVG icon shape" };
    }
    const sanitized = sanitizeSvg(parsed2.svg);
    if (!sanitized) {
      return { ok: false, reason: "session SVG icon contains disallowed markup" };
    }
    const canonical = `${SVG_PREFIX}${sanitized}`;
    if (new TextEncoder().encode(canonical).byteLength > SVG_MAX_BYTES) {
      return { ok: false, reason: `session SVG icon exceeds ${SVG_MAX_BYTES} bytes` };
    }
    return { ok: true, value: canonical };
  }
  const parsed = parseSessionIcon(trimmed);
  if (!parsed) {
    return { ok: false, reason: "session icon must be one emoji, name:<id>, or svg:<svg>" };
  }
  return { ok: true, value: trimmed };
}
export {
  SESSION_AGENT_ATTENTION_ICON_IDS,
  normalizeSessionIconInput,
  parseSessionIcon
};
