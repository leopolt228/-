// packages/terminal-core/src/note.ts
import { AsyncLocalStorage } from "node:async_hooks";
import { note as clackNote } from "@clack/prompts";

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

// packages/terminal-core/src/theme.ts
import chalk, { Chalk } from "chalk";

// packages/terminal-core/src/palette.ts
var LOBSTER_PALETTE = {
  accent: "#FF5A2D",
  accentBright: "#FF7A3D",
  accentDim: "#D14A22",
  info: "#FF8A5B",
  success: "#2FBF71",
  warn: "#FFB020",
  error: "#E23D2D",
  muted: "#8B7F77"
};

// packages/terminal-core/src/theme.ts
var hasForceColor = typeof process.env.FORCE_COLOR === "string" && process.env.FORCE_COLOR.trim().length > 0 && process.env.FORCE_COLOR.trim() !== "0";
var baseChalk = process.env.NO_COLOR && !hasForceColor ? new Chalk({ level: 0 }) : chalk;
var hex = (value) => baseChalk.hex(value);
var theme = {
  accent: hex(LOBSTER_PALETTE.accent),
  accentBright: hex(LOBSTER_PALETTE.accentBright),
  accentDim: hex(LOBSTER_PALETTE.accentDim),
  info: hex(LOBSTER_PALETTE.info),
  success: hex(LOBSTER_PALETTE.success),
  warn: hex(LOBSTER_PALETTE.warn),
  error: hex(LOBSTER_PALETTE.error),
  muted: hex(LOBSTER_PALETTE.muted),
  heading: baseChalk.bold.hex(LOBSTER_PALETTE.accent),
  command: hex(LOBSTER_PALETTE.accentBright),
  option: hex(LOBSTER_PALETTE.warn)
};
var isRich = () => baseChalk.level > 0;

// packages/terminal-core/src/prompt-style.ts
var stylePromptTitle = (title) => title && isRich() ? theme.heading(title) : title;

// packages/normalization-core/src/string-coerce.ts
function normalizeNullableString(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
function normalizeOptionalString(value) {
  return normalizeNullableString(value) ?? void 0;
}
function normalizeOptionalLowercaseString(value) {
  return normalizeOptionalString(value)?.toLowerCase();
}
function normalizeLowercaseStringOrEmpty(value) {
  return normalizeOptionalLowercaseString(value) ?? "";
}

// packages/terminal-core/src/note.ts
var MIN_NOTE_COLUMNS = 80;
var URL_PREFIX_RE = /^(https?:\/\/|file:\/\/)/i;
var WINDOWS_DRIVE_RE = /^[a-zA-Z]:[\\/]/;
var FILE_LIKE_RE = /^[a-zA-Z0-9._-]+$/;
var suppressNotesStorage = new AsyncLocalStorage();
function isSuppressedByEnv(value) {
  if (!value) {
    return false;
  }
  const normalized = normalizeLowercaseStringOrEmpty(value);
  if (!normalized) {
    return false;
  }
  return normalized !== "0" && normalized !== "false" && normalized !== "off";
}
function splitLongWord(word, maxLen) {
  if (maxLen <= 0) {
    return [word];
  }
  const parts = [];
  let current = "";
  let currentWidth = 0;
  for (const grapheme of splitGraphemes(word)) {
    const width = visibleWidth(grapheme);
    if (current && currentWidth + width > maxLen) {
      parts.push(current);
      current = "";
      currentWidth = 0;
    }
    current += grapheme;
    currentWidth += width;
  }
  if (current) {
    parts.push(current);
  }
  return parts.length > 0 ? parts : [word];
}
function isCopySensitiveToken(word) {
  if (!word) {
    return false;
  }
  if (URL_PREFIX_RE.test(word)) {
    return true;
  }
  if (word.startsWith("/") || word.startsWith("~/") || word.startsWith("./") || word.startsWith("../")) {
    return true;
  }
  if (WINDOWS_DRIVE_RE.test(word) || word.startsWith("\\\\")) {
    return true;
  }
  if (word.includes("/") || word.includes("\\")) {
    return true;
  }
  return word.includes("_") && FILE_LIKE_RE.test(word);
}
function pushWrappedWordSegments(params) {
  const parts = splitLongWord(params.word, params.available);
  const first = parts.shift() ?? "";
  params.lines.push(params.firstPrefix + first);
  for (const part of parts) {
    params.lines.push(params.continuationPrefix + part);
  }
}
function wrapLine(line, maxWidth) {
  if (line.trim().length === 0) {
    return [line];
  }
  const match = line.match(/^(\s*)([-*\u2022]\s+)?(.*)$/);
  const indent = match?.[1] ?? "";
  const bullet = match?.[2] ?? "";
  const content = match?.[3] ?? "";
  const firstPrefix = `${indent}${bullet}`;
  const nextPrefix = `${indent}${bullet ? " ".repeat(bullet.length) : ""}`;
  const firstWidth = Math.max(10, maxWidth - visibleWidth(firstPrefix));
  const nextWidth = Math.max(10, maxWidth - visibleWidth(nextPrefix));
  const words = content.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  let prefix = firstPrefix;
  let available = firstWidth;
  for (const word of words) {
    if (!current) {
      if (visibleWidth(word) > available) {
        if (isCopySensitiveToken(word)) {
          current = word;
          continue;
        }
        pushWrappedWordSegments({
          word,
          available,
          firstPrefix: prefix,
          continuationPrefix: nextPrefix,
          lines
        });
        prefix = nextPrefix;
        available = nextWidth;
        continue;
      }
      current = word;
      continue;
    }
    const candidate = `${current} ${word}`;
    if (visibleWidth(candidate) <= available) {
      current = candidate;
      continue;
    }
    lines.push(prefix + current);
    prefix = nextPrefix;
    available = nextWidth;
    if (visibleWidth(word) > available) {
      if (isCopySensitiveToken(word)) {
        current = word;
        continue;
      }
      pushWrappedWordSegments({
        word,
        available,
        firstPrefix: prefix,
        continuationPrefix: prefix,
        lines
      });
      current = "";
      continue;
    }
    current = word;
  }
  if (current || words.length === 0) {
    lines.push(prefix + current);
  }
  return lines;
}
function coerceNoteMessage(message) {
  if (typeof message === "string") {
    return message;
  }
  if (message == null) {
    return "";
  }
  if (typeof message === "number" || typeof message === "boolean" || typeof message === "bigint") {
    return String(message);
  }
  if (message instanceof Error) {
    return message.message ? `${message.name}: ${message.message}` : message.name;
  }
  return "";
}
function wrapNoteMessage(message, options = {}) {
  const text = coerceNoteMessage(message);
  const columns = options.columns ?? resolveNoteColumns(process.stdout.columns);
  const maxWidth = options.maxWidth ?? Math.max(40, Math.min(88, columns - 10));
  return text.split("\n").flatMap((line) => wrapLine(line, maxWidth)).join("\n");
}
function resolveNoteColumns(columns) {
  if (!Number.isFinite(columns) || !columns || columns < MIN_NOTE_COLUMNS) {
    return MIN_NOTE_COLUMNS;
  }
  return columns;
}
function resolveNoteOutputColumns(message, columns) {
  const widestLine = message.split("\n").reduce((max, line) => Math.max(max, visibleWidth(line)), 0);
  return Math.max(columns, widestLine + 6);
}
function createNoteOutput(columns) {
  if (process.stdout.columns === columns) {
    return process.stdout;
  }
  const output = Object.create(process.stdout);
  Object.defineProperty(output, "columns", {
    value: columns,
    configurable: true
  });
  output.write = process.stdout.write.bind(process.stdout);
  return output;
}
function note(message, title) {
  if (suppressNotesStorage.getStore() === true || isSuppressedByEnv(process.env.OPENCLAW_SUPPRESS_NOTES)) {
    return;
  }
  const columns = resolveNoteColumns(process.stdout.columns);
  const wrappedMessage = wrapNoteMessage(message, { columns });
  clackNote(wrappedMessage, stylePromptTitle(title), {
    output: createNoteOutput(resolveNoteOutputColumns(wrappedMessage, columns))
  });
}
function withSuppressedNotes(callback) {
  return suppressNotesStorage.run(true, callback);
}
export {
  note,
  resolveNoteColumns,
  resolveNoteOutputColumns,
  withSuppressedNotes,
  wrapNoteMessage
};
