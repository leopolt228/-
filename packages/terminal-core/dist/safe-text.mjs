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
var rgiEmojiPattern = new RegExp("^\\p{RGI_Emoji}$", "v");

// packages/terminal-core/src/safe-text.ts
function sanitizeTerminalText(input) {
  const normalized = stripAnsi(input).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
  let sanitized = "";
  for (const char of normalized) {
    const code = char.charCodeAt(0);
    const isControl = code >= 0 && code <= 31 || code >= 127 && code <= 159;
    if (!isControl) {
      sanitized += char;
    }
  }
  return sanitized;
}
export {
  sanitizeTerminalText
};
