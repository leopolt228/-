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
function splitAnsiSegments(input) {
  const segments = [];
  let position = 0;
  let index = 0;
  while (index < input.length) {
    const code = input.charCodeAt(index);
    if (code !== 27 && code !== 155 && code !== 157) {
      index += 1;
      continue;
    }
    const osc = matchAnsiOscAt(input, index);
    const csi = osc ? void 0 : scanAnsiCsiAt(input, index);
    const value = osc ?? csi?.value;
    if (!value) {
      index += 1;
      continue;
    }
    if (index > position) {
      segments.push({ kind: "text", value: input.slice(position, index) });
    }
    segments.push({ controls: csi?.controls ?? [], kind: "ansi", value });
    index += value.length;
    position = index;
  }
  if (position < input.length) {
    segments.push({ kind: "text", value: input.slice(position) });
  }
  return segments;
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
function stripAnsiSequences(input) {
  if (typeof input !== "string") {
    throw new TypeError(`Expected a \`string\`, got \`${typeof input}\``);
  }
  if (!hasAnsiIntroducer(input)) {
    return input;
  }
  return stripAnsiInternal(input, { compatibilityGrammar: true });
}
function stripAnsiForStreamChunk(input, options) {
  if (!hasAnsiIntroducer(input)) {
    return input;
  }
  return stripAnsiInternal(input, {
    compatibilityGrammar: options?.compatibilityGrammar === true,
    preserveIncompleteCsi: true
  });
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
function sanitizeForLog(v) {
  const c0Start = String.fromCharCode(0);
  const c0End = String.fromCharCode(31);
  const del = String.fromCharCode(127);
  const c1Start = String.fromCharCode(128);
  const c1End = String.fromCharCode(159);
  const controlCharsRegex = new RegExp(`[${c0Start}-${c0End}${del}${c1Start}-${c1End}]`, "g");
  return stripAnsi(v).replace(controlCharsRegex, "");
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
function truncateToVisibleWidth(input, maxWidth) {
  if (maxWidth <= 0) {
    return "";
  }
  if (visibleWidth(input) <= maxWidth) {
    return input;
  }
  let out = "";
  let used = 0;
  let budgetSpent = false;
  const appendVisible = (segment) => {
    if (budgetSpent) {
      return;
    }
    for (const grapheme of splitGraphemes(segment)) {
      const width = graphemeWidth(grapheme);
      if (used + width > maxWidth) {
        budgetSpent = true;
        return;
      }
      out += grapheme;
      used += width;
    }
  };
  for (const segment of splitAnsiSegments(input)) {
    if (segment.kind === "ansi") {
      const widthControls = segment.controls.filter((control) => graphemeWidth(control) > 0);
      const controlWidth = widthControls.reduce((sum, control) => sum + graphemeWidth(control), 0);
      if (!budgetSpent && used + controlWidth <= maxWidth) {
        out += segment.value;
        used += controlWidth;
      } else if (controlWidth > 0) {
        out += widthControls.reduce(
          (value, control) => value.replaceAll(control, ""),
          segment.value
        );
        budgetSpent = true;
      } else {
        out += segment.value;
      }
    } else {
      appendVisible(segment.value);
    }
  }
  return out;
}

// packages/terminal-core/src/decorative-emoji.ts
var EMOJI_GRAPHEME_PATTERN = /[\p{Extended_Pictographic}\p{Regional_Indicator}\u20e3]/u;
function isKnownEmojiTerminal(env) {
  const termProgram = (env.TERM_PROGRAM ?? "").toLowerCase();
  const term = (env.TERM ?? "").toLowerCase();
  return termProgram.includes("iterm") || termProgram.includes("apple_terminal") || termProgram.includes("ghostty") || termProgram.includes("wezterm") || termProgram.includes("vscode") || term.includes("ghostty") || term.includes("wezterm") || Boolean(env.WT_SESSION);
}
function hasUtf8Locale(env) {
  const locale = [env.LC_ALL, env.LC_CTYPE, env.LANG].find(
    (value) => typeof value === "string" && value.trim().length > 0
  );
  if (!locale) {
    return true;
  }
  return /utf-?8/i.test(locale);
}
function supportsDecorativeEmoji(options = {}) {
  const env = options.env ?? process.env;
  const platform = options.platform ?? process.platform;
  const isTty = options.isTty ?? options.stream?.isTTY ?? process.stdout.isTTY;
  if (!isTty) {
    return false;
  }
  if ((env.TERM ?? "").toLowerCase() === "dumb") {
    return false;
  }
  if (!hasUtf8Locale(env)) {
    return false;
  }
  if (isKnownEmojiTerminal(env)) {
    return true;
  }
  if (platform === "darwin") {
    return true;
  }
  return false;
}
function decorativeEmoji(emoji, options = {}) {
  return supportsDecorativeEmoji(options) ? emoji : "";
}
function decorativePrefix(emoji, text, options = {}) {
  const prefix = decorativeEmoji(emoji, options);
  return prefix ? `${prefix} ${text}` : text;
}
function stripDecorativeEmojiForTerminal(text, options = {}) {
  if (supportsDecorativeEmoji(options)) {
    return text;
  }
  return splitGraphemes(text).filter((grapheme) => !EMOJI_GRAPHEME_PATTERN.test(grapheme)).join("").replace(/\s{2,}/g, " ").trim();
}

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
var colorize = (rich, color, value) => rich ? color(value) : value;

// packages/terminal-core/src/health-style.ts
function styleHealthChannelLine(line, rich) {
  if (!rich) {
    return line;
  }
  const colon = line.indexOf(":");
  if (colon === -1) {
    return line;
  }
  const label = line.slice(0, colon + 1);
  const detail = line.slice(colon + 1).trimStart();
  const normalized = normalizeLowercaseStringOrEmpty(detail);
  const applyPrefix = (prefix, color) => `${label} ${color(detail.slice(0, prefix.length))}${detail.slice(prefix.length)}`;
  if (normalized.startsWith("failed")) {
    return applyPrefix("failed", theme.error);
  }
  if (normalized.startsWith("ok")) {
    return applyPrefix("ok", theme.success);
  }
  if (normalized.startsWith("linked")) {
    return applyPrefix("linked", theme.success);
  }
  if (normalized.startsWith("configured")) {
    return applyPrefix("configured", theme.success);
  }
  if (normalized.startsWith("not linked")) {
    return applyPrefix("not linked", theme.warn);
  }
  if (normalized.startsWith("not configured")) {
    return applyPrefix("not configured", theme.muted);
  }
  if (normalized.startsWith("unknown")) {
    return applyPrefix("unknown", theme.warn);
  }
  return line;
}

// packages/terminal-core/src/terminal-link.ts
function stripTerminalLinkControls(value) {
  let out = "";
  for (const char of value) {
    const code = char.charCodeAt(0);
    const isControl = code >= 0 && code <= 31 || code >= 127 && code <= 159;
    if (!isControl) {
      out += char;
    }
  }
  return out;
}
function formatTerminalLink(label, url, opts) {
  const safeLabel = stripTerminalLinkControls(label);
  const safeUrl = stripTerminalLinkControls(url);
  const allow = opts?.force === true ? true : opts?.force === false ? false : process.stdout.isTTY;
  if (!allow) {
    return opts?.fallback === void 0 ? `${safeLabel} (${safeUrl})` : stripTerminalLinkControls(opts.fallback);
  }
  return `\x1B]8;;${safeUrl}\x07${safeLabel}\x1B]8;;\x07`;
}

// packages/terminal-core/src/links.ts
function resolveDocsRoot() {
  return "https://docs.openclaw.ai";
}
var ABSOLUTE_HTTP_URL_RE = /^https?:\/\//i;
function formatDocsLink(path2, label, opts) {
  const docsRoot = resolveDocsRoot();
  const trimmed = typeof path2 === "string" ? path2.trim() : "";
  const url = trimmed ? ABSOLUTE_HTTP_URL_RE.test(trimmed) ? trimmed : `${docsRoot}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}` : docsRoot;
  return formatTerminalLink(label ?? url, url, {
    fallback: opts?.fallback ?? url,
    force: opts?.force
  });
}

// packages/terminal-core/src/note.ts
import { AsyncLocalStorage } from "node:async_hooks";
import { note as clackNote } from "@clack/prompts";

// packages/terminal-core/src/prompt-style.ts
var stylePromptMessage = (message) => isRich() ? theme.accent(message) : message;
var stylePromptTitle = (title) => title && isRich() ? theme.heading(title) : title;
var stylePromptHint = (hint) => hint && isRich() ? theme.muted(hint) : hint;

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

// packages/terminal-core/src/osc-progress.ts
var OSC_PROGRESS_PREFIX = "\x1B]9;4;";
var OSC_PROGRESS_ST = "\x1B\\";
var OSC_PROGRESS_BEL = "\x07";
var OSC_PROGRESS_C1_ST = "\x9C";
function supportsOscProgress(env, isTty) {
  if (!isTty) {
    return false;
  }
  const termProgram = (env.TERM_PROGRAM ?? "").toLowerCase();
  return termProgram.includes("ghostty") || termProgram.includes("wezterm") || Boolean(env.WT_SESSION);
}
function sanitizeOscProgressLabel(label) {
  return label.replaceAll(OSC_PROGRESS_ST, "").replaceAll(OSC_PROGRESS_BEL, "").replaceAll(OSC_PROGRESS_C1_ST, "").split("\x1B").join("").replaceAll("]", "").trim();
}
function formatOscProgress(state, percent, label) {
  const cleanLabel = sanitizeOscProgressLabel(label);
  if (percent === null) {
    return `${OSC_PROGRESS_PREFIX}${state};;${cleanLabel}${OSC_PROGRESS_ST}`;
  }
  const normalizedPercent = Math.max(0, Math.min(100, Math.round(percent)));
  return `${OSC_PROGRESS_PREFIX}${state};${normalizedPercent};${cleanLabel}${OSC_PROGRESS_ST}`;
}
function createOscProgressController(params) {
  if (!supportsOscProgress(params.env, params.isTty)) {
    return {
      setIndeterminate: () => {
      },
      setPercent: () => {
      },
      clear: () => {
      }
    };
  }
  let lastLabel = "";
  return {
    setIndeterminate: (label) => {
      lastLabel = label;
      params.write(formatOscProgress(3, null, label));
    },
    setPercent: (label, percent) => {
      lastLabel = label;
      params.write(formatOscProgress(1, percent, label));
    },
    clear: () => {
      params.write(formatOscProgress(0, 0, lastLabel));
    }
  };
}

// packages/terminal-core/src/progress-line.ts
var activeStream = null;
function registerActiveProgressLine(stream) {
  if (!stream.isTTY) {
    return;
  }
  activeStream = stream;
}
function clearActiveProgressLine() {
  if (!activeStream?.isTTY) {
    return;
  }
  activeStream.write("\r\x1B[2K");
}
function unregisterActiveProgressLine(stream) {
  if (!activeStream) {
    return;
  }
  if (stream && activeStream !== stream) {
    return;
  }
  activeStream = null;
}

// packages/terminal-core/src/prompt-select-styled.ts
import { select } from "@clack/prompts";

// packages/terminal-core/src/prompt-select-styled-params.ts
var defaultStylers = {
  message: stylePromptMessage,
  hint: stylePromptHint
};
function styleSelectParams(params, stylers = defaultStylers) {
  return {
    ...params,
    message: stylers.message(params.message),
    options: params.options.map((opt) => {
      const hint = "hint" in opt && typeof opt.hint === "string" ? opt.hint : void 0;
      return hint === void 0 ? opt : { ...opt, hint: stylers.hint(hint) };
    })
  };
}

// packages/terminal-core/src/prompt-select-styled.ts
function selectStyled(params) {
  return select(styleSelectParams(params));
}

// packages/terminal-core/src/restore.ts
var RESET_SEQUENCE = "\x1B[0m\x1B[?25h\x1B[?1000l\x1B[?1002l\x1B[?1003l\x1B[?1006l\x1B[?2004l\x1B[<u\x1B[>4;0m";
function reportRestoreFailure(scope, err, reason) {
  const suffix = reason ? ` (${reason})` : "";
  const message = `[terminal] restore ${scope} failed${suffix}: ${String(err)}`;
  try {
    process.stderr.write(`${message}
`);
  } catch (writeErr) {
    console.error(`[terminal] restore reporting failed${suffix}: ${String(writeErr)}`);
  }
}
function restoreTerminalState(reason, options = {}) {
  const resumeStdin = options.resumeStdinIfPaused ?? options.resumeStdin ?? false;
  const resetStream = options.resetStream ?? process.stdout;
  try {
    clearActiveProgressLine();
  } catch (err) {
    reportRestoreFailure("progress line", err, reason);
  }
  const stdin = process.stdin;
  if (stdin.isTTY && typeof stdin.setRawMode === "function") {
    try {
      stdin.setRawMode(false);
    } catch (err) {
      reportRestoreFailure("raw mode", err, reason);
    }
    if (resumeStdin && typeof stdin.isPaused === "function" && stdin.isPaused()) {
      try {
        stdin.resume();
      } catch (err) {
        reportRestoreFailure("stdin resume", err, reason);
      }
    }
  }
  if (resetStream.isTTY) {
    try {
      resetStream.write(RESET_SEQUENCE);
    } catch (err) {
      reportRestoreFailure("terminal reset", err, reason);
    }
  }
}

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

// packages/terminal-core/src/stream-writer.ts
function isBrokenPipeError(err) {
  const code = err?.code;
  return code === "EPIPE" || code === "EIO";
}
function createSafeStreamWriter(options = {}) {
  let closed = false;
  let notified = false;
  const noteBrokenPipe = (err, stream) => {
    if (notified) {
      return;
    }
    notified = true;
    options.onBrokenPipe?.(err, stream);
  };
  const handleError = (err, stream) => {
    if (!isBrokenPipeError(err)) {
      throw err;
    }
    closed = true;
    noteBrokenPipe(err, stream);
    return false;
  };
  const write = (stream, text) => {
    if (closed) {
      return false;
    }
    try {
      options.beforeWrite?.();
    } catch (err) {
      return handleError(err, process.stderr);
    }
    try {
      stream.write(text);
      return !closed;
    } catch (err) {
      return handleError(err, stream);
    }
  };
  const writeLine = (stream, text) => write(stream, `${text}
`);
  return {
    write,
    writeLine,
    reset: () => {
      closed = false;
      notified = false;
    },
    isClosed: () => closed
  };
}

// packages/terminal-core/src/display-string.ts
import os from "node:os";
import path from "node:path";
function normalize(value) {
  const trimmed = value?.trim();
  return trimmed && trimmed !== "undefined" && trimmed !== "null" ? trimmed : void 0;
}
function normalizeSafe(fn) {
  try {
    return normalize(fn());
  } catch {
    return void 0;
  }
}
function resolveTermuxHome(env) {
  const prefix = normalize(env.PREFIX);
  if (!prefix || !normalize(env.ANDROID_DATA)) {
    return void 0;
  }
  if (!/(?:^|\/)com\.termux\/files\/usr\/?$/u.test(prefix.replace(/\\/gu, "/"))) {
    return void 0;
  }
  return path.resolve(prefix, "..", "home");
}
function resolveRawOsHomeDir(env, homedir) {
  return normalize(env.HOME) ?? normalize(env.USERPROFILE) ?? resolveTermuxHome(env) ?? normalizeSafe(homedir);
}
function resolveRawHomeDir(env = process.env, homedir = os.homedir) {
  const explicitHome = normalize(env.OPENCLAW_HOME);
  if (explicitHome) {
    const fallbackHome = resolveRawOsHomeDir(env, homedir);
    return fallbackHome ? explicitHome.replace(/^~(?=$|[\\/])/, fallbackHome) : explicitHome;
  }
  return resolveRawOsHomeDir(env, homedir);
}
function resolveEffectiveHomeDir(env = process.env, homedir = os.homedir) {
  const raw = resolveRawHomeDir(env, homedir);
  return raw ? path.resolve(raw) : void 0;
}
function resolveHomeDisplayPrefix() {
  const home = resolveEffectiveHomeDir();
  if (!home) {
    return void 0;
  }
  const explicitHome = process.env.OPENCLAW_HOME?.trim();
  return explicitHome ? { home, prefix: "$OPENCLAW_HOME" } : { home, prefix: "~" };
}
function replaceHomePath(input, display) {
  let output = "";
  let cursor = 0;
  while (cursor < input.length) {
    const index = input.indexOf(display.home, cursor);
    if (index < 0) {
      return `${output}${input.slice(cursor)}`;
    }
    const before = input[index - 1];
    const homeEnd = index + display.home.length;
    const after = input[homeEnd];
    const startsToken = before === void 0 || /[\s("'`:=[{,]/u.test(before);
    let punctuationEnd = homeEnd;
    while (punctuationEnd < input.length && /[)"'`:,;.\]}]/u.test(input.charAt(punctuationEnd))) {
      punctuationEnd += 1;
    }
    const punctuationEndsToken = punctuationEnd > homeEnd && (punctuationEnd === input.length || /\s/u.test(input.charAt(punctuationEnd)));
    const endsTokenOrContinuesPath = after === void 0 || after === "/" || after === "\\" || punctuationEndsToken;
    if (startsToken && endsTokenOrContinuesPath) {
      output += `${input.slice(cursor, index)}${display.prefix}`;
    } else {
      output += input.slice(cursor, index + display.home.length);
    }
    cursor = index + display.home.length;
  }
  return output;
}
function displayString(input) {
  if (!input) {
    return input;
  }
  const display = resolveHomeDisplayPrefix();
  return display ? replaceHomePath(input, display) : input;
}

// packages/terminal-core/src/table.ts
function resolveDefaultBorder(platform, env) {
  if (platform !== "win32") {
    return "unicode";
  }
  const term = env.TERM ?? "";
  const termProgram = env.TERM_PROGRAM ?? "";
  const isModernTerminal = Boolean(env.WT_SESSION) || term.includes("xterm") || term.includes("cygwin") || term.includes("msys") || termProgram === "vscode";
  return isModernTerminal ? "unicode" : "ascii";
}
function repeat(ch, n) {
  if (n <= 0) {
    return "";
  }
  return ch.repeat(n);
}
function padCell(text, width, align) {
  const content = visibleWidth(text) > width ? truncateToVisibleWidth(text, width) : text;
  const w = visibleWidth(content);
  if (w >= width) {
    return content;
  }
  const pad = width - w;
  if (align === "right") {
    return `${repeat(" ", pad)}${content}`;
  }
  if (align === "center") {
    const left = Math.floor(pad / 2);
    const right = pad - left;
    return `${repeat(" ", left)}${content}${repeat(" ", right)}`;
  }
  return `${content}${repeat(" ", pad)}`;
}
var ESC = "\x1B";
var C1_CSI = "\x9B";
var C1_OSC = "\x9D";
var C1_ST = "\x9C";
var BEL = "\x07";
var SGR_CATEGORY_ORDER = [
  "font",
  "intensity",
  "italic",
  "underline",
  "underlineColor",
  "blink",
  "inverse",
  "conceal",
  "strike",
  "proportional",
  "frame",
  "overline",
  "ideogram",
  "script",
  "foreground",
  "background"
];
var SGR_RESET_CATEGORIES = /* @__PURE__ */ new Map([
  [10, "font"],
  [22, "intensity"],
  [23, "italic"],
  [24, "underline"],
  [25, "blink"],
  [27, "inverse"],
  [28, "conceal"],
  [29, "strike"],
  [39, "foreground"],
  [49, "background"],
  [50, "proportional"],
  [54, "frame"],
  [55, "overline"],
  [59, "underlineColor"],
  [65, "ideogram"],
  [75, "script"]
]);
var SGR_CATEGORY_RESETS = /* @__PURE__ */ new Map([
  ["font", 10],
  ["intensity", 22],
  ["italic", 23],
  ["underline", 24],
  ["blink", 25],
  ["inverse", 27],
  ["conceal", 28],
  ["strike", 29],
  ["foreground", 39],
  ["background", 49],
  ["proportional", 50],
  ["frame", 54],
  ["overline", 55],
  ["underlineColor", 59],
  ["ideogram", 65],
  ["script", 75]
]);
function simpleSgrCategory(param) {
  if (param === 1 || param === 2) {
    return "intensity";
  }
  if (param >= 11 && param <= 19) {
    return "font";
  }
  if (param === 3 || param === 20) {
    return "italic";
  }
  if (param === 4 || param === 21) {
    return "underline";
  }
  if (param === 5 || param === 6) {
    return "blink";
  }
  if (param === 7) {
    return "inverse";
  }
  if (param === 8) {
    return "conceal";
  }
  if (param === 9) {
    return "strike";
  }
  if (param === 26) {
    return "proportional";
  }
  if (param >= 30 && param <= 37 || param >= 90 && param <= 97) {
    return "foreground";
  }
  if (param >= 40 && param <= 47 || param >= 100 && param <= 107) {
    return "background";
  }
  if (param === 51 || param === 52) {
    return "frame";
  }
  if (param === 53) {
    return "overline";
  }
  if (param >= 60 && param <= 64) {
    return "ideogram";
  }
  if (param === 73 || param === 74) {
    return "script";
  }
  return void 0;
}
function extendedSgrCategory(param) {
  if (param === 38) {
    return "foreground";
  }
  if (param === 48) {
    return "background";
  }
  return param === 58 ? "underlineColor" : void 0;
}
function parseSgrSequence(value) {
  let introducer;
  if (value.startsWith(`${ESC}[`) && value.endsWith("m")) {
    introducer = `${ESC}[`;
  } else if (value.startsWith(C1_CSI) && value.endsWith("m")) {
    introducer = C1_CSI;
  } else {
    return void 0;
  }
  const parameters = Array.from(value.slice(introducer.length, -1)).filter((character) => {
    const code = character.charCodeAt(0);
    return code > 31 && code !== 127;
  }).join("");
  const hasOnlySgrParameters = Array.from(parameters).every(
    (character) => character >= "0" && character <= "9" || character === ";" || character === ":"
  );
  if (!hasOnlySgrParameters) {
    return void 0;
  }
  return { introducer, parameters };
}
function sgrSequence(introducer, parameters) {
  return `${introducer}${parameters}m`;
}
function applySgrSequence(active, value) {
  const sequence = parseSgrSequence(value);
  if (!sequence) {
    return;
  }
  const fields = sequence.parameters === "" ? ["0"] : sequence.parameters.split(";");
  for (let index = 0; index < fields.length; index += 1) {
    const field = fields[index] ?? "";
    if (field.includes(":")) {
      const param2 = Number(field.slice(0, field.indexOf(":")));
      const category2 = extendedSgrCategory(param2) ?? simpleSgrCategory(param2);
      if (category2) {
        active.set(category2, sgrSequence(sequence.introducer, field));
      }
      continue;
    }
    const param = field === "" ? 0 : Number(field);
    if (!Number.isInteger(param)) {
      continue;
    }
    if (param === 0) {
      active.clear();
      continue;
    }
    const resetCategory = SGR_RESET_CATEGORIES.get(param);
    if (resetCategory) {
      active.delete(resetCategory);
      continue;
    }
    const extendedCategory = extendedSgrCategory(param);
    if (extendedCategory) {
      const mode = Number(fields[index + 1]);
      const operandCount = mode === 2 ? 3 : mode === 5 ? 1 : void 0;
      const lastOperandIndex = operandCount === void 0 ? -1 : index + 1 + operandCount;
      if (lastOperandIndex < index || lastOperandIndex >= fields.length) {
        break;
      }
      const parameters = fields.slice(index, lastOperandIndex + 1).join(";");
      active.set(extendedCategory, sgrSequence(sequence.introducer, parameters));
      index = lastOperandIndex;
      continue;
    }
    const category = simpleSgrCategory(param);
    if (category) {
      active.set(category, sgrSequence(sequence.introducer, String(param)));
    }
  }
}
function activeSgrAfter(tokens) {
  const active = /* @__PURE__ */ new Map();
  for (const token of tokens) {
    if (token.kind === "ansi") {
      applySgrSequence(active, token.value);
    }
  }
  return SGR_CATEGORY_ORDER.flatMap((category) => {
    const open = active.get(category);
    const parsed = open ? parseSgrSequence(open) : void 0;
    const reset = SGR_CATEGORY_RESETS.get(category);
    return open && parsed && reset !== void 0 ? [{ close: sgrSequence(parsed.introducer, String(reset)), open }] : [];
  });
}
function parseOsc8Sequence(value) {
  let payloadStart;
  if (value.startsWith(`${ESC}]`)) {
    payloadStart = 2;
  } else if (value.startsWith(C1_OSC)) {
    payloadStart = 1;
  } else {
    return void 0;
  }
  let terminatorLength;
  if (value.endsWith(`${ESC}\\`)) {
    terminatorLength = 2;
  } else if (value.endsWith(BEL) || value.endsWith(C1_ST)) {
    terminatorLength = 1;
  } else {
    return void 0;
  }
  const payload = value.slice(payloadStart, -terminatorLength);
  if (!payload.startsWith("8;")) {
    return void 0;
  }
  const uriSeparator = payload.indexOf(";", 2);
  if (uriSeparator < 0) {
    return void 0;
  }
  return {
    params: payload.slice(2, uriSeparator),
    uri: payload.slice(uriSeparator + 1)
  };
}
function activeOsc8After(tokens) {
  let active;
  for (const token of tokens) {
    if (token.kind !== "ansi") {
      continue;
    }
    const link = parseOsc8Sequence(token.value);
    if (link) {
      active = link.uri === "" ? void 0 : link;
    }
  }
  return active;
}
function wrapLine2(text, width) {
  if (width <= 0) {
    return [text];
  }
  const tokens = [];
  for (const segment of splitAnsiSegments(text)) {
    if (segment.kind === "ansi") {
      tokens.push({
        kind: "ansi",
        value: segment.value,
        width: visibleWidth(segment.controls.join(""))
      });
      continue;
    }
    for (const grapheme of splitGraphemes(segment.value)) {
      tokens.push({ kind: "char", value: grapheme });
    }
  }
  if (!tokens.some((token) => token.kind === "char")) {
    return [text];
  }
  const lines = [];
  const isBreakChar = (ch) => ch === " " || ch === "	" || ch === "/" || ch === "-" || ch === "_" || ch === ".";
  const isSpaceChar = (ch) => ch === " " || ch === "	";
  let skipNextLf = false;
  const buf = [];
  let bufVisible = 0;
  let lastBreakIndex = null;
  const bufToString = (slice) => (slice ?? buf).map((t) => t.value).join("");
  const bufVisibleWidth = (slice) => slice.reduce(
    (acc, token) => acc + (token.kind === "char" ? visibleWidth(token.value) : token.width),
    0
  );
  const pushLine = (value) => {
    const cleaned = value.replace(/\s+$/, "");
    if (visibleWidth(cleaned) === 0) {
      return;
    }
    lines.push(cleaned);
  };
  const trimLeadingSpaces = (tokensLocal) => {
    while (true) {
      const firstCharIndexLocal = tokensLocal.findIndex((token) => token.kind === "char");
      if (firstCharIndexLocal < 0) {
        return;
      }
      const firstChar = tokensLocal[firstCharIndexLocal];
      if (!firstChar || !isSpaceChar(firstChar.value)) {
        return;
      }
      tokensLocal.splice(firstCharIndexLocal, 1);
    }
  };
  const flushAt = (breakAt) => {
    if (buf.length === 0) {
      return;
    }
    const left = breakAt == null || breakAt <= 0 ? buf : buf.slice(0, breakAt);
    const activeSgr = activeSgrAfter(left);
    const activeOsc8 = activeOsc8After(left);
    const closeOsc8 = activeOsc8 ? `${ESC}]8;;${BEL}` : "";
    const openOsc8 = activeOsc8 ? `${ESC}]8;${activeOsc8.params};${activeOsc8.uri}${BEL}` : "";
    const closeSgr = activeSgr.map((state) => state.close).join("");
    if (breakAt == null || breakAt <= 0) {
      pushLine(`${bufToString()}${closeOsc8}${closeSgr}`);
      buf.length = 0;
      if (openOsc8) {
        buf.push({ kind: "ansi", value: openOsc8, width: 0 });
      }
      for (const state of activeSgr) {
        buf.push({ kind: "ansi", value: state.open, width: 0 });
      }
      bufVisible = 0;
      lastBreakIndex = null;
      return;
    }
    const rest = buf.slice(breakAt);
    pushLine(`${bufToString(left)}${closeOsc8}${closeSgr}`);
    trimLeadingSpaces(rest);
    if (openOsc8) {
      rest.unshift({ kind: "ansi", value: openOsc8, width: 0 });
    }
    if (activeSgr.length > 0) {
      rest.unshift(
        ...activeSgr.map((state) => ({
          kind: "ansi",
          value: state.open,
          width: 0
        }))
      );
    }
    buf.length = 0;
    buf.push(...rest);
    bufVisible = bufVisibleWidth(buf);
    lastBreakIndex = null;
  };
  const makeRoomFor = (tokenWidth) => {
    if (bufVisible + tokenWidth <= width || bufVisible === 0) {
      return;
    }
    flushAt(lastBreakIndex);
    if (bufVisible + tokenWidth > width && bufVisible > 0) {
      flushAt(null);
    }
  };
  for (const token of tokens) {
    if (token.kind === "ansi") {
      makeRoomFor(token.width);
      buf.push(token);
      bufVisible += token.width;
      continue;
    }
    const ch = token.value;
    if (skipNextLf) {
      skipNextLf = false;
      if (ch === "\n") {
        continue;
      }
    }
    if (ch === "\n" || ch === "\r") {
      flushAt(buf.length);
      if (ch === "\r") {
        skipNextLf = true;
      }
      continue;
    }
    const charWidth = visibleWidth(ch);
    makeRoomFor(charWidth);
    if (bufVisible === 0 && isSpaceChar(ch)) {
      continue;
    }
    buf.push(token);
    bufVisible += charWidth;
    if (isBreakChar(ch)) {
      lastBreakIndex = buf.length;
    }
  }
  flushAt(buf.length);
  return lines.length > 0 ? lines : [""];
}
function normalizeWidth(n) {
  if (n == null) {
    return void 0;
  }
  if (!Number.isFinite(n) || n <= 0) {
    return void 0;
  }
  return Math.floor(n);
}
function getTerminalTableWidth(minWidth = 60, fallbackWidth = 120) {
  return Math.max(minWidth, process.stdout.columns ?? fallbackWidth);
}
function renderTable(opts) {
  const rows = opts.rows.map((row) => {
    const next = {};
    for (const [key, value] of Object.entries(row)) {
      next[key] = displayString(value);
    }
    return next;
  });
  const border = opts.border ?? resolveDefaultBorder(process.platform, process.env);
  if (border === "none") {
    const columns2 = opts.columns;
    const header = columns2.map((c) => c.header).join(" | ");
    const lines2 = [header, ...rows.map((r) => columns2.map((c) => r[c.key] ?? "").join(" | "))];
    return `${lines2.join("\n")}
`;
  }
  const padding = Math.max(0, opts.padding ?? 1);
  const columns = opts.columns;
  const metrics = columns.map((c) => {
    const headerW = visibleWidth(c.header);
    const cellW = Math.max(0, ...rows.map((r) => visibleWidth(r[c.key] ?? "")));
    return { headerW, cellW };
  });
  const widths = columns.map((c, i) => {
    const m = metrics[i];
    const base = Math.max(m?.headerW ?? 0, m?.cellW ?? 0) + padding * 2;
    const capped = c.maxWidth ? Math.min(base, c.maxWidth) : base;
    return Math.max(c.minWidth ?? 3, capped);
  });
  const maxWidth = normalizeWidth(opts.width);
  const sepCount = columns.length + 1;
  const total = widths.reduce((a, b) => a + b, 0) + sepCount;
  const preferredMinWidths = columns.map(
    (c, i) => Math.max(c.minWidth ?? 3, (metrics[i]?.headerW ?? 0) + padding * 2, 3)
  );
  const absoluteMinWidths = columns.map(
    (_c, i) => Math.max((metrics[i]?.headerW ?? 0) + padding * 2, 3)
  );
  if (maxWidth && total > maxWidth) {
    let over = total - maxWidth;
    const flexOrder = columns.map((_c, i) => ({ i, w: widths[i] ?? 0 })).filter(({ i }) => Boolean(columns[i]?.flex)).toSorted((a, b) => b.w - a.w).map((x) => x.i);
    const nonFlexOrder = columns.map((_c, i) => ({ i, w: widths[i] ?? 0 })).filter(({ i }) => !columns[i]?.flex).toSorted((a, b) => b.w - a.w).map((x) => x.i);
    const shrink = (order, minWidths) => {
      while (over > 0) {
        let progressed = false;
        for (const i of order) {
          if ((widths[i] ?? 0) <= (minWidths[i] ?? 0)) {
            continue;
          }
          widths[i] = (widths[i] ?? 0) - 1;
          over -= 1;
          progressed = true;
          if (over <= 0) {
            break;
          }
        }
        if (!progressed) {
          break;
        }
      }
    };
    shrink(flexOrder, preferredMinWidths);
    shrink(flexOrder, absoluteMinWidths);
    shrink(nonFlexOrder, preferredMinWidths);
    shrink(nonFlexOrder, absoluteMinWidths);
  }
  if (maxWidth) {
    const sepCountLocal = columns.length + 1;
    const currentTotal = widths.reduce((a, b) => a + b, 0) + sepCountLocal;
    let extra = maxWidth - currentTotal;
    if (extra > 0) {
      const flexCols = columns.map((c, i) => ({ c, i })).filter(({ c }) => Boolean(c.flex)).map(({ i }) => i);
      if (flexCols.length > 0) {
        const caps = columns.map(
          (c) => typeof c.maxWidth === "number" && c.maxWidth > 0 ? Math.floor(c.maxWidth) : Number.POSITIVE_INFINITY
        );
        while (extra > 0) {
          let progressed = false;
          for (const i of flexCols) {
            if ((widths[i] ?? 0) >= (caps[i] ?? Number.POSITIVE_INFINITY)) {
              continue;
            }
            widths[i] = (widths[i] ?? 0) + 1;
            extra -= 1;
            progressed = true;
            if (extra <= 0) {
              break;
            }
          }
          if (!progressed) {
            break;
          }
        }
      }
    }
  }
  const box = border === "ascii" ? {
    tl: "+",
    tr: "+",
    bl: "+",
    br: "+",
    h: "-",
    v: "|",
    t: "+",
    ml: "+",
    m: "+",
    mr: "+",
    b: "+"
  } : {
    tl: "\u250C",
    tr: "\u2510",
    bl: "\u2514",
    br: "\u2518",
    h: "\u2500",
    v: "\u2502",
    t: "\u252C",
    ml: "\u251C",
    m: "\u253C",
    mr: "\u2524",
    b: "\u2534"
  };
  const hLine = (left, mid, right) => `${left}${widths.map((w) => repeat(box.h, w)).join(mid)}${right}`;
  const contentWidthFor = (i) => {
    const width = widths.at(i);
    if (width === void 0) {
      throw new Error(`expected table column width ${i} to be defined`);
    }
    return Math.max(1, width - padding * 2);
  };
  const padStr = repeat(" ", padding);
  const renderRow = (record, isHeader = false) => {
    const cells = columns.map((c) => isHeader ? c.header : record[c.key] ?? "");
    const wrapped = cells.map((cell, i) => wrapLine2(cell, contentWidthFor(i)));
    const height = Math.max(...wrapped.map((w) => w.length));
    const out = [];
    for (let li = 0; li < height; li += 1) {
      const parts = wrapped.map((lines2, i) => {
        const raw = lines2[li] ?? "";
        const aligned = padCell(raw, contentWidthFor(i), columns[i]?.align ?? "left");
        return `${padStr}${aligned}${padStr}`;
      });
      out.push(`${box.v}${parts.join(box.v)}${box.v}`);
    }
    return out;
  };
  const lines = [];
  lines.push(hLine(box.tl, box.t, box.tr));
  lines.push(...renderRow({}, true));
  lines.push(hLine(box.ml, box.m, box.mr));
  for (const row of rows) {
    lines.push(...renderRow(row, false));
  }
  lines.push(hLine(box.bl, box.b, box.br));
  return `${lines.join("\n")}
`;
}
export {
  LOBSTER_PALETTE,
  clearActiveProgressLine,
  colorize,
  createOscProgressController,
  createSafeStreamWriter,
  decorativeEmoji,
  decorativePrefix,
  formatDocsLink,
  formatTerminalLink,
  getTerminalTableWidth,
  isRich,
  note,
  registerActiveProgressLine,
  renderTable,
  resolveNoteColumns,
  resolveNoteOutputColumns,
  restoreTerminalState,
  sanitizeForLog,
  sanitizeTerminalText,
  selectStyled,
  splitGraphemes,
  stripAnsi,
  stripAnsiForStreamChunk,
  stripAnsiSequences,
  stripDecorativeEmojiForTerminal,
  styleHealthChannelLine,
  stylePromptHint,
  stylePromptMessage,
  stylePromptTitle,
  styleSelectParams,
  supportsDecorativeEmoji,
  supportsOscProgress,
  theme,
  truncateToVisibleWidth,
  unregisterActiveProgressLine,
  visibleWidth,
  withSuppressedNotes,
  wrapNoteMessage
};
