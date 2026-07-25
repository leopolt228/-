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
  const candidate2 = (payloadEnd, activeParameterOpenEnd) => ({
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
    candidate: candidate2(payloadEnd, activeParameterOpenEnd),
    completeEnd: syntax === "tool-bracket" ? lastParameterEnd : void 0
  });
  const complete = (payloadEnd, end = payloadEnd) => ({
    kind: "complete",
    ...candidate2(payloadEnd),
    end
  });
  while (true) {
    const markerStart = skipWhitespace(text, cursor);
    if (markerStart === text.length) {
      return syntax === "tool-bracket" && lastParameterEnd !== void 0 ? complete(lastParameterEnd) : { kind: "prefix", candidate: candidate2(text.length) };
    }
    if (startsWithAsciiMarkerIgnoreCase(text, markerStart, FUNCTION_CLOSE)) {
      return syntax !== "function" && parameters.length === 0 ? { kind: "invalid", at: markerStart, candidate: candidate2(markerStart) } : complete(markerStart, markerStart + FUNCTION_CLOSE.length);
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
        return { kind: "invalid", at: markerStart, candidate: candidate2(markerStart) };
      }
      if (nameEnd === text.length) {
        return prefix(markerStart);
      }
      if (nameEnd === nameStart || text[nameEnd] !== ">") {
        return { kind: "invalid", at: markerStart, candidate: candidate2(markerStart) };
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
    return { kind: "invalid", at: markerStart, candidate: candidate2(markerStart) };
  }
}

// packages/tool-call-repair/src/payload.ts
var DEFAULT_MAX_PLAIN_TEXT_TOOL_PAYLOAD_BYTES = 256e3;
var MAX_PLAIN_TEXT_TOOL_NAME_CHARS = 120;
var HARMONY_CHANNELS = ["commentary", "analysis", "final"];
function isLiteralPrefixAt(text, start, literal) {
  const available = text.length - start;
  return start >= 0 && available < literal.length && literal.startsWith(text.slice(start));
}
function scanToolNameEnd(text, start) {
  let end = start;
  while (isPlainTextToolNameChar(text[end])) {
    if (end - start === MAX_PLAIN_TEXT_TOOL_NAME_CHARS) {
      return null;
    }
    end += 1;
  }
  return end;
}
function candidate(syntax, name, nameComplete, payload, json) {
  return { syntax, name, nameComplete, ...payload ? { payload } : {}, ...json ? { json } : {} };
}
function scanBracketOpening(text, start, structuralLineBreaks) {
  let cursor = start + 1;
  let syntax = "named-bracket";
  if (text.startsWith("tool:", cursor)) {
    syntax = "tool-bracket";
    cursor += "tool:".length;
  } else if (isLiteralPrefixAt(text, cursor, "tool:")) {
    return { kind: "prefix" };
  }
  const nameStart = cursor;
  const nameEnd = scanToolNameEnd(text, nameStart);
  if (nameEnd === null) {
    return { kind: "invalid", at: nameStart + MAX_PLAIN_TEXT_TOOL_NAME_CHARS };
  }
  const name = { start: nameStart, end: nameEnd };
  cursor = nameEnd;
  if (cursor === text.length) {
    return {
      kind: "prefix",
      ...nameStart === nameEnd ? {} : { candidate: candidate(syntax, name, false) }
    };
  }
  if (nameStart === nameEnd || text[cursor] !== "]") {
    return { kind: "invalid", at: cursor };
  }
  cursor += 1;
  const value = candidate(syntax, name, true);
  if (syntax === "named-bracket") {
    const horizontalEnd = skipHorizontalWhitespace(text, cursor);
    if (horizontalEnd === text.length) {
      return { kind: "prefix", candidate: value };
    }
    const afterLineBreak = consumeStructuralLineBreakAfterHorizontalWhitespace(
      text,
      cursor,
      structuralLineBreaks
    );
    if (afterLineBreak === null) {
      return { kind: "invalid", at: horizontalEnd, candidate: value };
    }
    cursor = afterLineBreak;
  }
  return { kind: "complete", cursor, value };
}
function scanHarmonyOpening(text, start) {
  let cursor = start;
  if (text.startsWith(HARMONY_CHANNEL_MARKER, cursor)) {
    cursor += HARMONY_CHANNEL_MARKER.length;
  } else if (isLiteralPrefixAt(text, cursor, HARMONY_CHANNEL_MARKER)) {
    return { kind: "prefix" };
  } else if (text[cursor] === "<") {
    return { kind: "invalid", at: cursor };
  }
  const channel = HARMONY_CHANNELS.find((value2) => text.startsWith(value2, cursor));
  if (!channel) {
    return HARMONY_CHANNELS.some((value2) => isLiteralPrefixAt(text, cursor, value2)) ? { kind: "prefix" } : { kind: "invalid", at: cursor };
  }
  cursor += channel.length;
  if (cursor === text.length) {
    return { kind: "prefix" };
  }
  if (text[cursor] !== " " && text[cursor] !== "	") {
    return { kind: "invalid", at: cursor };
  }
  cursor = skipHorizontalWhitespace(text, cursor);
  if (!text.startsWith("to=", cursor)) {
    return isLiteralPrefixAt(text, cursor, "to=") ? { kind: "prefix" } : { kind: "invalid", at: cursor };
  }
  cursor += "to=".length;
  const nameStart = cursor;
  const nameEnd = scanToolNameEnd(text, nameStart);
  if (nameEnd === null) {
    return { kind: "invalid", at: nameStart + MAX_PLAIN_TEXT_TOOL_NAME_CHARS };
  }
  const name = { start: nameStart, end: nameEnd };
  cursor = nameEnd;
  if (cursor === text.length) {
    return {
      kind: "prefix",
      ...nameStart === nameEnd ? {} : { candidate: candidate("harmony", name, false) }
    };
  }
  if (nameStart === nameEnd || text[cursor] !== " " && text[cursor] !== "	") {
    return { kind: "invalid", at: cursor };
  }
  cursor = skipHorizontalWhitespace(text, cursor);
  const value = candidate("harmony", name, true);
  if (!text.startsWith("code", cursor)) {
    return isLiteralPrefixAt(text, cursor, "code") ? { kind: "prefix", candidate: value } : { kind: "invalid", at: cursor, candidate: value };
  }
  cursor = skipWhitespace(text, cursor + "code".length);
  if (text.startsWith(HARMONY_MESSAGE_MARKER, cursor)) {
    cursor = skipWhitespace(text, cursor + HARMONY_MESSAGE_MARKER.length);
  } else if (isLiteralPrefixAt(text, cursor, HARMONY_MESSAGE_MARKER)) {
    return { kind: "prefix", candidate: value };
  } else if (text[cursor] === "<") {
    return { kind: "invalid", at: cursor, candidate: value };
  }
  return { kind: "complete", cursor, value };
}
function scanJsonObject(text, start) {
  let depth = 0;
  let escaped = false;
  let inString = false;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') {
      inString = true;
    } else if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return {
          kind: "complete",
          end: index + 1,
          state: { depth, escaped, inString }
        };
      }
    }
  }
  return { kind: "prefix", end: text.length, state: { depth, escaped, inString } };
}
function scanPlainTextJsonToolCall(text, start = 0, structuralLineBreaks) {
  const opening = text[start] === "[" ? scanBracketOpening(text, start, structuralLineBreaks) : scanHarmonyOpening(text, start);
  if (opening.kind !== "complete") {
    return opening;
  }
  const value = opening.value;
  const payloadStart = skipWhitespace(text, opening.cursor);
  if (payloadStart === text.length) {
    return { kind: "prefix", candidate: value };
  }
  if (text[payloadStart] !== "{") {
    return { kind: "invalid", at: payloadStart, candidate: value };
  }
  const json = scanJsonObject(text, payloadStart);
  const payload = { start: payloadStart, end: json.end };
  if (json.kind === "prefix") {
    return {
      kind: "prefix",
      candidate: candidate(value.syntax, value.name, true, payload, json.state)
    };
  }
  const closingCandidate = candidate(value.syntax, value.name, true, payload, json.state);
  if (value.syntax !== "named-bracket") {
    const markerStart = skipWhitespace(text, json.end);
    const name2 = text.slice(value.name.start, value.name.end);
    const closings2 = [HARMONY_CALL_MARKER, END_TOOL_REQUEST, `[/${name2}]`];
    for (const closing of closings2) {
      if (text.startsWith(closing, markerStart)) {
        return {
          ...value,
          kind: "complete",
          payload,
          end: markerStart + closing.length
        };
      }
      if (markerStart < text.length && isLiteralPrefixAt(text, markerStart, closing)) {
        return { kind: "prefix", candidate: closingCandidate };
      }
    }
    return {
      ...value,
      kind: "complete",
      payload,
      end: json.end
    };
  }
  const closingStart = skipWhitespace(text, json.end);
  if (closingStart === text.length) {
    return { kind: "prefix", candidate: closingCandidate };
  }
  const name = text.slice(value.name.start, value.name.end);
  const closings = [END_TOOL_REQUEST, `[/${name}]`];
  for (const closing of closings) {
    if (text.startsWith(closing, closingStart)) {
      return {
        ...value,
        payload,
        kind: "complete",
        end: closingStart + closing.length
      };
    }
    if (isLiteralPrefixAt(text, closingStart, closing)) {
      return { kind: "prefix", candidate: closingCandidate };
    }
  }
  return { kind: "invalid", at: closingStart, candidate: closingCandidate };
}
function scanPlainTextToolCall(text, start = 0, options) {
  const xmlish = scanXmlishToolCall(text, start, options?.structuralLineBreaks);
  const json = scanPlainTextJsonToolCall(text, start, options?.structuralLineBreaks);
  const maxPayloadBytes = options?.maxPayloadBytes ?? DEFAULT_MAX_PLAIN_TEXT_TOOL_PAYLOAD_BYTES;
  const allowed = (scan) => {
    const value = scan.kind === "complete" ? scan : scan.candidate;
    if (!value) {
      return { accepted: scan.kind === "prefix" };
    }
    const name = text.slice(value.name.start, value.name.end);
    const matches = value.nameComplete ? options?.matcher?.hasExactName(name) ?? true : options?.matcher?.hasNamePrefix(name) ?? true;
    return matches ? { accepted: true, value, ...value.payload ? { payload: value.payload } : {} } : { accepted: false };
  };
  const xml = allowed(xmlish);
  const jsonValue = allowed(json);
  const branches = {
    json,
    matches: { json: jsonValue.accepted, xmlish: xml.accepted },
    xmlish
  };
  const overCap = (payload) => Boolean(
    payload && utf8ByteLengthWithinLimit(text, payload.start, payload.end, maxPayloadBytes) === null
  );
  const xmlOverCap = overCap(xml.payload);
  const jsonOverCap = overCap(jsonValue.payload);
  if (xml.accepted && xmlish.kind === "complete") {
    return {
      ...branches,
      end: xmlish.end,
      kind: "complete",
      next: xmlish.end,
      overCap: xmlOverCap,
      payloadStart: xmlish.payload.start
    };
  }
  if (jsonValue.accepted && json.kind === "complete") {
    if (jsonOverCap || parseJsonArguments(text, json.payload)) {
      return {
        ...branches,
        end: json.end,
        kind: "complete",
        next: json.end,
        overCap: jsonOverCap,
        payloadStart: json.payload.start
      };
    }
    return {
      ...branches,
      at: json.end,
      kind: "invalid",
      next: json.end,
      overCap: false,
      payloadStart: json.payload.start
    };
  }
  if (xml.accepted && xmlish.kind === "invalid" && xmlOverCap && xml.payload) {
    return {
      ...branches,
      at: xmlish.at,
      kind: "invalid",
      next: xmlish.at,
      overCap: true,
      payloadStart: xml.payload.start
    };
  }
  if (jsonValue.accepted && json.kind === "invalid" && jsonOverCap && jsonValue.payload) {
    return {
      ...branches,
      at: json.at,
      kind: "invalid",
      next: json.at,
      overCap: true,
      payloadStart: jsonValue.payload.start
    };
  }
  const xmlPrefix = xml.accepted && xmlish.kind === "prefix";
  const jsonPrefix = jsonValue.accepted && json.kind === "prefix";
  if (xmlPrefix || jsonPrefix) {
    const payload = xmlPrefix ? xml.payload : jsonValue.payload;
    return {
      ...branches,
      ...xmlish.kind === "prefix" && xmlish.completeEnd !== void 0 ? { completeEnd: xmlish.completeEnd } : {},
      kind: "prefix",
      next: text.length,
      overCap: overCap(payload),
      ...payload ? { payloadStart: payload.start } : {}
    };
  }
  let next = start + 1;
  if (xml.accepted) {
    next = Math.max(next, xmlish.kind === "invalid" ? xmlish.at : text.length);
  }
  if (jsonValue.accepted) {
    next = Math.max(
      next,
      json.kind === "complete" ? json.end : json.kind === "invalid" ? json.at : text.length
    );
  }
  return { ...branches, at: next, kind: "invalid", next, overCap: false };
}
function parsePlainTextToolCallBlockAt(text, start, options, structuralLineBreaks) {
  const scan = scanPlainTextJsonToolCall(text, start, structuralLineBreaks);
  if (scan.kind !== "complete") {
    return null;
  }
  const name = text.slice(scan.name.start, scan.name.end);
  if (options?.allowedToolNames && !options.allowedToolNames.has(name)) {
    return null;
  }
  const maxPayloadBytes = options?.maxPayloadBytes ?? DEFAULT_MAX_PLAIN_TEXT_TOOL_PAYLOAD_BYTES;
  if (utf8ByteLengthWithinLimit(text, scan.payload.start, scan.payload.end, maxPayloadBytes) === null) {
    return null;
  }
  const argumentsValue = parseJsonArguments(text, scan.payload);
  if (!argumentsValue) {
    return null;
  }
  return {
    arguments: argumentsValue,
    end: scan.end,
    name,
    raw: text.slice(start, scan.end),
    start
  };
}
function parseJsonArguments(text, payload) {
  let value;
  try {
    value = JSON.parse(text.slice(payload.start, payload.end));
  } catch {
    return null;
  }
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function extractXmlishParameterValue(text, start, end, structuralLineBreaks) {
  let value = text.slice(start, end);
  if (consumeLineBreak(text, skipHorizontalWhitespace(text, start)) === null) {
    const boundary = consumeStructuralLineBreakAfterHorizontalWhitespace(
      text,
      start,
      structuralLineBreaks
    );
    if (boundary !== null) {
      const offset = boundary - start;
      value = `${value.slice(0, offset)}
${value.slice(offset)}`;
    }
  }
  const payloadStart = consumeLineBreak(value, 0);
  if (payloadStart === null) {
    return value;
  }
  return value.slice(payloadStart).replace(/(?:\r\n|[\r\n])$/u, "");
}
function parseXmlishPlainTextToolCallBlockAt(text, start, options, structuralLineBreaks) {
  const scan = scanXmlishToolCall(text, start, structuralLineBreaks);
  if (scan.kind !== "complete") {
    return null;
  }
  const name = text.slice(scan.name.start, scan.name.end);
  if (options?.allowedToolNames && !options.allowedToolNames.has(name)) {
    return null;
  }
  const maxPayloadBytes = options?.maxPayloadBytes ?? DEFAULT_MAX_PLAIN_TEXT_TOOL_PAYLOAD_BYTES;
  if (utf8ByteLengthWithinLimit(text, scan.payload.start, scan.payload.end, maxPayloadBytes) === null) {
    return null;
  }
  const args = Object.fromEntries(
    scan.parameters.map((parameter) => [
      text.slice(parameter.name.start, parameter.name.end),
      extractXmlishParameterValue(
        text,
        parameter.value.start,
        parameter.value.end,
        structuralLineBreaks
      )
    ])
  );
  return {
    arguments: args,
    end: scan.end,
    name,
    raw: text.slice(start, scan.end),
    start
  };
}
function parsePlainTextToolCallBlockAtAnySyntax(text, start, options, structuralLineBreaks) {
  return parsePlainTextToolCallBlockAt(text, start, options, structuralLineBreaks) ?? parseXmlishPlainTextToolCallBlockAt(text, start, options, structuralLineBreaks);
}
function normalizeParseOptions(options) {
  return options ? {
    ...options,
    allowedToolNames: options.allowedToolNames ? new Set(options.allowedToolNames) : void 0
  } : void 0;
}
function parseStandalonePlainTextToolCallBlocks(text, options, structuralLineBreaks) {
  const blocks = [];
  const normalizedOptions = normalizeParseOptions(options);
  let cursor = skipWhitespace(text, 0);
  while (cursor < text.length) {
    const block = parsePlainTextToolCallBlockAtAnySyntax(
      text,
      cursor,
      normalizedOptions,
      structuralLineBreaks
    );
    if (!block) {
      return null;
    }
    blocks.push(block);
    cursor = skipWhitespace(text, block.end);
  }
  return blocks.length > 0 ? blocks : null;
}
function stripPlainTextToolCallBlocks(text) {
  if (!text || !/\[(?:tool:)?[A-Za-z0-9_-]+\]/.test(text) && !/(?:^|[\r\n])[^\S\r\n]*(?:<\|channel\|>)?(?:commentary|analysis|final)[ \t]+to=/.test(
    text
  ) && !/(?:^|[\r\n])[^\S\r\n]*<function=/i.test(text)) {
    return text;
  }
  let result = "";
  let cursor = 0;
  let index = 0;
  while (index < text.length) {
    const lineStart = index === 0 || text[index - 1] === "\n" || text[index - 1] === "\r";
    if (!lineStart) {
      index += 1;
      continue;
    }
    const blockStart = skipLineIndentation(text, index);
    const scan = scanPlainTextToolCall(text, blockStart);
    if (scan.kind === "prefix" && scan.completeEnd === void 0) {
      return result + text.slice(cursor);
    }
    if (scan.kind === "invalid") {
      index = Math.max(index + 1, scan.next);
      continue;
    }
    let blockEnd = scan.kind === "complete" ? scan.end : scan.completeEnd;
    if (blockEnd === void 0) {
      return result + text.slice(cursor);
    }
    result += text.slice(cursor, index);
    while (true) {
      const adjacentStart = skipLineIndentation(text, blockEnd);
      const adjacent = scanPlainTextToolCall(text, adjacentStart);
      const adjacentEnd = adjacent.kind === "complete" ? adjacent.end : adjacent.kind === "prefix" ? adjacent.completeEnd : void 0;
      if (adjacentEnd === void 0 || adjacentEnd <= blockEnd) {
        break;
      }
      blockEnd = adjacentEnd;
    }
    const lineBreakStart = skipLineIndentation(text, blockEnd);
    cursor = lineBreakStart === text.length ? lineBreakStart : consumeLineBreak(text, lineBreakStart) ?? blockEnd;
    index = cursor;
  }
  result += text.slice(cursor);
  return result;
}
export {
  parseStandalonePlainTextToolCallBlocks,
  scanPlainTextJsonToolCall,
  scanPlainTextToolCall,
  stripPlainTextToolCallBlocks
};
