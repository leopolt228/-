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
export {
  createOscProgressController,
  supportsOscProgress
};
