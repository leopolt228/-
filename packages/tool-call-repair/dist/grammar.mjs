// packages/tool-call-repair/src/grammar.ts
var END_TOOL_REQUEST = "[END_TOOL_REQUEST]";
var HARMONY_CHANNEL_MARKER = "<|channel|>";
var HARMONY_MESSAGE_MARKER = "<|message|>";
var HARMONY_CALL_MARKER = "<|call|>";
function isPlainTextToolNameChar(char) {
  return Boolean(char && /[A-Za-z0-9_-]/.test(char));
}
function isXmlishNameChar(char) {
  return Boolean(char && /[A-Za-z0-9_.:-]/.test(char));
}
function skipHorizontalWhitespace(text, start) {
  let index = start;
  while (index < text.length && (text[index] === " " || text[index] === "	")) {
    index += 1;
  }
  return index;
}
function skipLineIndentation(text, start) {
  let index = start;
  while (index < text.length && /[^\S\r\n]/u.test(text[index] ?? "")) {
    index += 1;
  }
  return index;
}
function skipWhitespace(text, start) {
  let index = start;
  while (index < text.length && /\s/.test(text[index] ?? "")) {
    index += 1;
  }
  return index;
}
function consumeLineBreak(text, start) {
  if (text[start] === "\r") {
    return text[start + 1] === "\n" ? start + 2 : start + 1;
  }
  if (text[start] === "\n") {
    return start + 1;
  }
  return null;
}
function consumeStructuralLineBreakAfterHorizontalWhitespace(text, start, options) {
  const right = skipHorizontalWhitespace(text, start);
  const actual = consumeLineBreak(text, right);
  if (actual !== null) {
    return actual;
  }
  for (let offset = start; offset <= right; offset += 1) {
    if (options?.lineBreakOffsets.has(offset)) {
      options.usedLineBreakOffsets?.add(offset);
      return offset;
    }
  }
  return null;
}
var utf8Encoder = new TextEncoder();
function utf8ByteLengthWithinLimit(text, start, end, maxBytes) {
  if (end - start > maxBytes) {
    return null;
  }
  const byteLength = utf8Encoder.encode(text.slice(start, end)).byteLength;
  return byteLength <= maxBytes ? byteLength : null;
}
var FUNCTION_OPEN = "<function=";
var FUNCTION_CLOSE = "</function>";
var PARAMETER_OPEN = "<parameter=";
var PARAMETER_CLOSE = "</parameter>";
function startsWithAsciiMarkerIgnoreCase(text, cursor, marker) {
  return text.slice(cursor, cursor + marker.length).toLowerCase() === marker;
}
function isAsciiMarkerPrefixIgnoreCase(text, cursor, marker) {
  const rest = text.slice(cursor, cursor + marker.length).toLowerCase();
  return rest.length < marker.length && marker.startsWith(rest);
}
function indexOfAsciiMarkerIgnoreCase(text, marker, start) {
  for (let cursor = text.indexOf("<", start); cursor !== -1; cursor = text.indexOf("<", cursor + 1)) {
    if (startsWithAsciiMarkerIgnoreCase(text, cursor, marker)) {
      return cursor;
    }
  }
  return -1;
}
function scanXmlishToolCall(text, start = 0, structuralLineBreaks) {
  let cursor = start;
  let syntax;
  let name;
  if (text[cursor] === "<") {
    if (!startsWithAsciiMarkerIgnoreCase(text, cursor, FUNCTION_OPEN) && !isAsciiMarkerPrefixIgnoreCase(text, cursor, FUNCTION_OPEN)) {
      return { kind: "invalid", at: start };
    }
    if (text.length - cursor < FUNCTION_OPEN.length) {
      return { kind: "prefix" };
    }
    cursor += FUNCTION_OPEN.length;
    const nameStart = cursor;
    while (isXmlishNameChar(text[cursor]) && cursor - nameStart < 121) {
      cursor += 1;
    }
    name = { start: nameStart, end: cursor };
    syntax = "function";
    if (cursor - nameStart > 120) {
      return { kind: "invalid", at: cursor };
    }
    if (cursor === text.length) {
      return { kind: "prefix", candidate: { syntax, name, nameComplete: false, parameters: [] } };
    }
    if (cursor === nameStart || text[cursor] !== ">") {
      return { kind: "invalid", at: cursor };
    }
    cursor += 1;
  } else if (text[cursor] === "[") {
    cursor += 1;
    const firstNameStart = cursor;
    while (isPlainTextToolNameChar(text[cursor]) && cursor - firstNameStart < 121) {
      cursor += 1;
    }
    if (cursor - firstNameStart > 120) {
      return { kind: "invalid", at: cursor };
    }
    const firstName = text.slice(firstNameStart, cursor);
    if (cursor === text.length && "tool".startsWith(firstName)) {
      return { kind: "prefix" };
    }
    syntax = "named-bracket";
    name = { start: firstNameStart, end: cursor };
    if (text[cursor] === ":" && firstName === "tool") {
      syntax = "tool-bracket";
      cursor += 1;
      const nameStart = cursor;
      while (isPlainTextToolNameChar(text[cursor]) && cursor - nameStart < 121) {
        cursor += 1;
      }
      name = { start: nameStart, end: cursor };
      if (cursor - nameStart > 120) {
        return { kind: "invalid", at: cursor };
      }
    }
    if (cursor === text.length) {
      return { kind: "prefix", candidate: { syntax, name, nameComplete: false, parameters: [] } };
    }
    if (name.start === name.end || text[cursor] !== "]") {
      return { kind: "invalid", at: cursor };
    }
    cursor += 1;
    if (syntax === "named-bracket") {
      if (cursor === text.length) {
        return { kind: "prefix", candidate: { syntax, name, nameComplete: true, parameters: [] } };
      }
      const afterLineBreak = consumeStructuralLineBreakAfterHorizontalWhitespace(
        text,
        cursor,
        structuralLineBreaks
      );
      if (afterLineBreak === null) {
        return { kind: "invalid", at: cursor };
      }
      cursor = afterLineBreak;
    }
  } else {
    return { kind: "invalid", at: start };
  }
  const bodyStart = cursor;
  const parameters = [];
  const candidate = (payloadEnd, activeParameterOpenEnd) => ({
    syntax,
    name,
    nameComplete: true,
    parameters,
    payload: { start: bodyStart, end: payloadEnd },
    ...activeParameterOpenEnd === void 0 ? {} : { activeParameterOpenEnd }
  });
  let lastParameterEnd;
  const prefix = (payloadEnd, activeParameterOpenEnd) => ({
    kind: "prefix",
    candidate: candidate(payloadEnd, activeParameterOpenEnd),
    completeEnd: syntax === "tool-bracket" ? lastParameterEnd : void 0
  });
  const complete = (payloadEnd, end = payloadEnd) => ({
    kind: "complete",
    ...candidate(payloadEnd),
    end
  });
  while (true) {
    const markerStart = skipWhitespace(text, cursor);
    if (markerStart === text.length) {
      return syntax === "tool-bracket" && lastParameterEnd !== void 0 ? complete(lastParameterEnd) : { kind: "prefix", candidate: candidate(text.length) };
    }
    if (startsWithAsciiMarkerIgnoreCase(text, markerStart, FUNCTION_CLOSE)) {
      return syntax !== "function" && parameters.length === 0 ? { kind: "invalid", at: markerStart, candidate: candidate(markerStart) } : complete(markerStart, markerStart + FUNCTION_CLOSE.length);
    }
    if (isAsciiMarkerPrefixIgnoreCase(text, markerStart, FUNCTION_CLOSE)) {
      return prefix(markerStart);
    }
    if (startsWithAsciiMarkerIgnoreCase(text, markerStart, PARAMETER_OPEN)) {
      const nameStart = markerStart + PARAMETER_OPEN.length;
      let nameEnd = nameStart;
      while (isXmlishNameChar(text[nameEnd]) && nameEnd - nameStart < 121) {
        nameEnd += 1;
      }
      if (nameEnd - nameStart > 120) {
        return { kind: "invalid", at: markerStart, candidate: candidate(markerStart) };
      }
      if (nameEnd === text.length) {
        return prefix(markerStart);
      }
      if (nameEnd === nameStart || text[nameEnd] !== ">") {
        return { kind: "invalid", at: markerStart, candidate: candidate(markerStart) };
      }
      const valueStart = nameEnd + 1;
      const closeStart = indexOfAsciiMarkerIgnoreCase(text, PARAMETER_CLOSE, valueStart);
      if (closeStart === -1) {
        return prefix(text.length, valueStart);
      }
      const end = closeStart + PARAMETER_CLOSE.length;
      parameters.push({
        name: { start: nameStart, end: nameEnd },
        value: { start: valueStart, end: closeStart }
      });
      cursor = end;
      lastParameterEnd = end;
      continue;
    }
    if (isAsciiMarkerPrefixIgnoreCase(text, markerStart, PARAMETER_OPEN)) {
      return prefix(markerStart);
    }
    if (syntax === "tool-bracket" && lastParameterEnd !== void 0) {
      return complete(lastParameterEnd);
    }
    return { kind: "invalid", at: markerStart, candidate: candidate(markerStart) };
  }
}
export {
  END_TOOL_REQUEST,
  HARMONY_CALL_MARKER,
  HARMONY_CHANNEL_MARKER,
  HARMONY_MESSAGE_MARKER,
  consumeLineBreak,
  consumeStructuralLineBreakAfterHorizontalWhitespace,
  indexOfAsciiMarkerIgnoreCase,
  isAsciiMarkerPrefixIgnoreCase,
  isPlainTextToolNameChar,
  isXmlishNameChar,
  scanXmlishToolCall,
  skipHorizontalWhitespace,
  skipLineIndentation,
  skipWhitespace,
  startsWithAsciiMarkerIgnoreCase,
  utf8ByteLengthWithinLimit
};
