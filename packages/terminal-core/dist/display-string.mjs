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
export {
  displayString
};
