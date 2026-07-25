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
function wrapLine(text, width) {
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
    const wrapped = cells.map((cell, i) => wrapLine(cell, contentWidthFor(i)));
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
  getTerminalTableWidth,
  renderTable
};
