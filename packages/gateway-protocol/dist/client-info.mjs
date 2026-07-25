// packages/gateway-protocol/src/client-info.ts
function normalizeOptionalLowercaseString(raw) {
  if (typeof raw !== "string") {
    return void 0;
  }
  const normalized = raw.trim().toLowerCase();
  return normalized || void 0;
}
var GATEWAY_CLIENT_IDS = {
  WEBCHAT_UI: "webchat-ui",
  CONTROL_UI: "openclaw-control-ui",
  BROWSER_COPILOT: "openclaw-browser-copilot",
  TUI: "openclaw-tui",
  WEBCHAT: "webchat",
  CLI: "cli",
  GATEWAY_CLIENT: "gateway-client",
  MACOS_APP: "openclaw-macos",
  // Native Linux UI uses the same trusted-client admission class as the macOS app.
  LINUX_APP: "openclaw-linux",
  IOS_APP: "openclaw-ios",
  WATCHOS_APP: "openclaw-watchos",
  ANDROID_APP: "openclaw-android",
  NODE_HOST: "node-host",
  WORKER: "openclaw-worker",
  TEST: "test",
  FINGERPRINT: "fingerprint",
  PROBE: "openclaw-probe"
};
var GATEWAY_CLIENT_NAMES = GATEWAY_CLIENT_IDS;
var GATEWAY_CLIENT_MODES = {
  WEBCHAT: "webchat",
  CLI: "cli",
  UI: "ui",
  BACKEND: "backend",
  NODE: "node",
  WORKER: "worker",
  PROBE: "probe",
  TEST: "test"
};
var GATEWAY_CLIENT_CAPS = {
  APPROVALS: "approvals",
  EXEC_APPROVALS: "exec-approvals",
  INLINE_WIDGETS: "inline-widgets",
  RUN_TOOL_BINDINGS: "run-tool-bindings",
  SESSION_SCOPED_EVENTS: "session-scoped-events",
  PLUGIN_APPROVALS: "plugin-approvals",
  TASK_SUGGESTIONS: "task-suggestions",
  TERMINAL_OFFSET_SEQ: "terminal-offset-seq",
  TOOL_EVENTS: "tool-events",
  UI_COMMANDS: "ui-commands"
};
var GATEWAY_CLIENT_ID_SET = new Set(Object.values(GATEWAY_CLIENT_IDS));
var GATEWAY_CLIENT_MODE_SET = new Set(Object.values(GATEWAY_CLIENT_MODES));
function normalizeGatewayClientId(raw) {
  const normalized = normalizeOptionalLowercaseString(raw);
  if (!normalized) {
    return void 0;
  }
  return GATEWAY_CLIENT_ID_SET.has(normalized) ? normalized : void 0;
}
function normalizeGatewayClientName(raw) {
  return normalizeGatewayClientId(raw);
}
function normalizeGatewayClientMode(raw) {
  const normalized = normalizeOptionalLowercaseString(raw);
  if (!normalized) {
    return void 0;
  }
  return GATEWAY_CLIENT_MODE_SET.has(normalized) ? normalized : void 0;
}
function hasGatewayClientCap(caps, cap) {
  if (!Array.isArray(caps)) {
    return false;
  }
  return caps.includes(cap);
}
export {
  GATEWAY_CLIENT_CAPS,
  GATEWAY_CLIENT_IDS,
  GATEWAY_CLIENT_MODES,
  GATEWAY_CLIENT_NAMES,
  hasGatewayClientCap,
  normalizeGatewayClientId,
  normalizeGatewayClientMode,
  normalizeGatewayClientName
};
