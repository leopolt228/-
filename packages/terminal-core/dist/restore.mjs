// packages/terminal-core/src/progress-line.ts
var activeStream = null;
function clearActiveProgressLine() {
  if (!activeStream?.isTTY) {
    return;
  }
  activeStream.write("\r\x1B[2K");
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
export {
  restoreTerminalState
};
