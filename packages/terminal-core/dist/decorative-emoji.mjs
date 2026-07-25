// packages/terminal-core/src/ansi-sequences.ts
var ANSI_OSC_INTRODUCER_PATTERN = "(?:\\x1b\\]|\\x9d)";
var ANSI_STRING_TERMINATOR_PATTERN = "(?:\\x1b\\\\|\\x07|\\x9c)";
var ANSI_OSC_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[^\\x07\\x1b\\x9c]*${ANSI_STRING_TERMINATOR_PATTERN}`;
var ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN = "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
var ansiOscAtIndexRegex = new RegExp(ANSI_OSC_PATTERN, "y");

// packages/terminal-core/src/ansi.ts
var ANSI_OSC_SEQUENCE_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[\\s\\S]*?${ANSI_STRING_TERMINATOR_PATTERN}`;
var ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX = new RegExp(
  `${ANSI_OSC_SEQUENCE_PATTERN}|${ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN}`,
  "y"
);
var graphemeSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
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
var rgiEmojiPattern = new RegExp("^\\p{RGI_Emoji}$", "v");

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
export {
  decorativeEmoji,
  decorativePrefix,
  stripDecorativeEmojiForTerminal,
  supportsDecorativeEmoji
};
