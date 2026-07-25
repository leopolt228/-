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
export {
  styleHealthChannelLine
};
