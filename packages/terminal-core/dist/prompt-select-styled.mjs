// packages/terminal-core/src/prompt-select-styled.ts
import { select } from "@clack/prompts";

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
var stylePromptMessage = (message) => isRich() ? theme.accent(message) : message;
var stylePromptHint = (hint) => hint && isRich() ? theme.muted(hint) : hint;

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
export {
  selectStyled
};
