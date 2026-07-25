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
export {
  clearActiveProgressLine,
  registerActiveProgressLine,
  unregisterActiveProgressLine
};
