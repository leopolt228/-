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
export {
  formatTerminalLink
};
