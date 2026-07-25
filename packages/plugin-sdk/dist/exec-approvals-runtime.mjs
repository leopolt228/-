// packages/plugin-sdk/src/exec-approvals-runtime.ts
import fs6 from "node:fs";
import path9 from "node:path";
import { configureFsSafePython } from "@openclaw/fs-safe/config";
import "@openclaw/fs-safe/path";
import fs from "node:fs";
import os2 from "node:os";
import path2 from "node:path";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/root";
import "@openclaw/fs-safe/errors";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/path";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/root";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/secure-file";
import "@openclaw/fs-safe/walk";
import "@openclaw/fs-safe/advanced";
import os from "node:os";
import path from "node:path";
import { SqliteDialect } from "kysely";
import { Chalk } from "chalk";
import fs3 from "node:fs";
import JSON5 from "json5";
import path3 from "node:path";
import fs2 from "node:fs";
import os3 from "node:os";
import path4 from "node:path";
import fs5 from "node:fs";
import os4 from "node:os";
import path6 from "node:path";
import { Logger as TsLogger } from "tslog";
import { AsyncLocalStorage } from "node:async_hooks";
import {
  appendRegularFileSync as appendRegularFileSync2
} from "@openclaw/fs-safe/advanced";
import fs4 from "node:fs";
import { tmpdir as getOsTmpDir } from "node:os";
import path5 from "node:path";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import path7 from "node:path";
import { createRequire as createRequire2 } from "node:module";
import childProcess from "node:child_process";
import fsSync from "node:fs";
import { createHash } from "node:crypto";
import path8 from "node:path";
import { createRequire as createRequire3 } from "node:module";
import "web-tree-sitter";
import "@openclaw/fs-safe/file-lock";
import {
  assertNoSymlinkParentsSync
} from "@openclaw/fs-safe/advanced";
function readStringValue(value) {
  return typeof value === "string" ? value : void 0;
}
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
var BLOCKED_OBJECT_KEYS = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
function isBlockedObjectKey(key) {
  return BLOCKED_OBJECT_KEYS.has(key);
}
var DEFAULT_AGENT_ID = "main";
function resolveGlobalSingleton(key, create) {
  const globalStore2 = globalThis;
  if (Object.hasOwn(globalStore2, key)) {
    return globalStore2[key];
  }
  const created = create();
  globalStore2[key] = created;
  return created;
}
function resolveGlobalMap(key) {
  return resolveGlobalSingleton(key, () => /* @__PURE__ */ new Map());
}
var hasPythonModeOverride = process.env.FS_SAFE_PYTHON_MODE != null || process.env.OPENCLAW_FS_SAFE_PYTHON_MODE != null;
if (!hasPythonModeOverride) {
  configureFsSafePython({ mode: "off" });
}
function tryProcessCwd() {
  try {
    return process.cwd();
  } catch {
    return void 0;
  }
}
function normalize(value) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") {
    return void 0;
  }
  return trimmed;
}
function normalizeSafe(homedir) {
  try {
    return normalize(homedir());
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
function resolveRawHomeDir(env, homedir) {
  const explicitHome = normalize(env.OPENCLAW_HOME);
  if (!explicitHome) {
    return resolveRawOsHomeDir(env, homedir);
  }
  if (explicitHome === "~" || explicitHome.startsWith("~/") || explicitHome.startsWith("~\\")) {
    const fallbackHome = resolveRawOsHomeDir(env, homedir);
    return fallbackHome ? explicitHome.replace(/^~(?=$|[\\/])/, fallbackHome) : void 0;
  }
  return explicitHome;
}
function resolveEffectiveHomeDir(env = process.env, homedir = os.homedir) {
  const raw = resolveRawHomeDir(env, homedir);
  return raw ? path.resolve(raw) : void 0;
}
function resolveRequiredHomeDir(env = process.env, homedir = os.homedir) {
  const resolved = resolveEffectiveHomeDir(env, homedir) ?? tryProcessCwd();
  if (resolved) {
    return path.resolve(resolved);
  }
  throw new Error(
    "Unable to resolve an OpenClaw home: set OPENCLAW_HOME, HOME, or USERPROFILE, or run from an existing directory."
  );
}
function expandHomePrefix(input, opts) {
  if (!input.startsWith("~")) {
    return input;
  }
  const home = normalize(opts?.home) ?? resolveEffectiveHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir);
  if (!home) {
    return input;
  }
  return input.replace(/^~(?=$|[\\/])/, home);
}
function resolveHomeRelativePath(input, opts) {
  const trimmed = input.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed.startsWith("~")) {
    const expanded = expandHomePrefix(trimmed, {
      home: resolveRequiredHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir),
      env: opts?.env,
      homedir: opts?.homedir
    });
    return path.resolve(expanded);
  }
  return path.resolve(trimmed);
}
function resolveUserPath(input, env = process.env, homedir = os.homedir) {
  if (!input) {
    return "";
  }
  return resolveHomeRelativePath(input, { env, homedir });
}
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) && Object.prototype.toString.call(value) === "[object Object]";
}
var MAX_TIMER_TIMEOUT_MS = 2147e6;
var MAX_TIMER_TIMEOUT_SECONDS = Math.floor(MAX_TIMER_TIMEOUT_MS / 1e3);
function resolveIntegerOption(value, fallback, range = {}) {
  const candidate = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  const floored = Math.floor(candidate);
  const minBounded = range.min === void 0 ? floored : Math.max(range.min, floored);
  return range.max === void 0 ? minBounded : Math.min(range.max, minBounded);
}
function resolveNonNegativeIntegerOption(value, fallback) {
  return resolveIntegerOption(value, fallback, { min: 0 });
}
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isHighSurrogate(codeUnit) {
  return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
  return codeUnit >= 56320 && codeUnit <= 57343;
}
function sliceUtf16Safe(input, start, end) {
  const len = input.length;
  let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
  let to = end === void 0 ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
  if (to <= from) {
    return "";
  }
  if (from > 0 && from < len) {
    const codeUnit = input.charCodeAt(from);
    if (isLowSurrogate(codeUnit) && isHighSurrogate(input.charCodeAt(from - 1))) {
      from += 1;
    }
  }
  if (to > 0 && to < len) {
    const codeUnit = input.charCodeAt(to - 1);
    if (isHighSurrogate(codeUnit) && isLowSurrogate(input.charCodeAt(to))) {
      to -= 1;
    }
  }
  return input.slice(from, to);
}
function truncateUtf16Safe(input, maxLen) {
  const limit = Math.max(0, Math.floor(maxLen));
  if (input.length <= limit) {
    return input;
  }
  return sliceUtf16Safe(input, 0, limit);
}
function resolveConfigDir(env = process.env, homedir = os2.homedir) {
  const override = env.OPENCLAW_STATE_DIR?.trim();
  if (override) {
    return resolveUserPath(override, env, homedir);
  }
  const configPath = env.OPENCLAW_CONFIG_PATH?.trim();
  if (configPath) {
    return path2.dirname(resolveUserPath(configPath, env, homedir));
  }
  const newDir = path2.join(resolveRequiredHomeDir(env, homedir), ".openclaw");
  try {
    const hasNew = fs.existsSync(newDir);
    if (hasNew) {
      return newDir;
    }
  } catch {
  }
  return newDir;
}
var CONFIG_DIR = resolveConfigDir();
var kyselyByDatabase = /* @__PURE__ */ new WeakMap();
var compileOnlySqliteDialect = new SqliteDialect({
  // The lazy database factory leaves compilation usable while direct execution fails fast.
  database: async () => {
    throw new Error(
      "getNodeSqliteKysely() returns a compile-only Kysely facade; use executeSqliteQuerySync() to execute node:sqlite queries."
    );
  }
});
function clearNodeSqliteKyselyCacheForDatabase(db) {
  kyselyByDatabase.delete(db);
}
function expectDefined(value, context) {
  if (value === null || value === void 0) {
    throw new Error("expected " + context + " to be defined");
  }
  return value;
}
var activeStream = null;
function clearActiveProgressLine() {
  if (!activeStream?.isTTY) {
    return;
  }
  activeStream.write("\r\x1B[2K");
}
var globalVerbose = false;
function isVerbose() {
  return globalVerbose;
}
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
function shouldEmitRuntimeLog(env = process.env) {
  if (env.VITEST !== "true") {
    return true;
  }
  if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") {
    return true;
  }
  const maybeMockedLog = console.log;
  return typeof maybeMockedLog.mock === "object";
}
function shouldEmitRuntimeStdout(env = process.env) {
  if (env.VITEST !== "true") {
    return true;
  }
  if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") {
    return true;
  }
  const stdout = process.stdout;
  return typeof stdout.write.mock === "object";
}
function isPipeClosedError(err) {
  const code = err?.code;
  return code === "EPIPE" || code === "EIO";
}
function writeStdout(value) {
  if (!shouldEmitRuntimeStdout()) {
    return;
  }
  clearActiveProgressLine();
  const line = value.endsWith("\n") ? value : `${value}
`;
  try {
    process.stdout.write(line);
  } catch (err) {
    if (isPipeClosedError(err)) {
      return;
    }
    throw err;
  }
}
function createRuntimeIo() {
  return {
    log: (...args) => {
      if (!shouldEmitRuntimeLog()) {
        return;
      }
      clearActiveProgressLine();
      console.log(...args);
    },
    error: (...args) => {
      clearActiveProgressLine();
      console.error(...args);
    },
    writeStdout,
    writeJson: (value, space = 2) => {
      writeStdout(JSON.stringify(value, null, space > 0 ? space : void 0));
    }
  };
}
var defaultRuntime = {
  ...createRuntimeIo(),
  exit: (code, opts) => {
    restoreTerminalState("runtime exit", {
      resumeStdinIfPaused: false,
      resetStream: opts?.resetStream
    });
    process.exit(code);
    throw new Error("unreachable");
  }
};
var ANSI_OSC_INTRODUCER_PATTERN = "(?:\\x1b\\]|\\x9d)";
var ANSI_STRING_TERMINATOR_PATTERN = "(?:\\x1b\\\\|\\x07|\\x9c)";
var ANSI_OSC_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[^\\x07\\x1b\\x9c]*${ANSI_STRING_TERMINATOR_PATTERN}`;
var ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN = "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
var ansiOscAtIndexRegex = new RegExp(ANSI_OSC_PATTERN, "y");
var ANSI_OSC_SEQUENCE_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[\\s\\S]*?${ANSI_STRING_TERMINATOR_PATTERN}`;
var ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX = new RegExp(
  `${ANSI_OSC_SEQUENCE_PATTERN}|${ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN}`,
  "y"
);
var graphemeSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
var rgiEmojiPattern = new RegExp("^\\p{RGI_Emoji}$", "v");
var FLAG_TERMINATOR = "--";
var ROOT_BOOLEAN_FLAGS = /* @__PURE__ */ new Set(["--dev", "--no-color"]);
var ROOT_VALUE_FLAGS = /* @__PURE__ */ new Set(["--profile", "--log-level", "--container"]);
function isValueToken(arg) {
  if (!arg || arg === FLAG_TERMINATOR) {
    return false;
  }
  if (!arg.startsWith("-")) {
    return true;
  }
  return /^-\d+(?:\.\d+)?$/.test(arg);
}
function consumeRootOptionToken(args, index) {
  const arg = args[index];
  if (!arg) {
    return 0;
  }
  if (ROOT_BOOLEAN_FLAGS.has(arg)) {
    return 1;
  }
  if (arg.startsWith("--profile=") || arg.startsWith("--log-level=") || arg.startsWith("--container=")) {
    return 1;
  }
  if (ROOT_VALUE_FLAGS.has(arg)) {
    return isValueToken(args[index + 1]) ? 2 : 1;
  }
  return 0;
}
function getCommandDescriptorNames(descriptors) {
  return descriptors.map((descriptor) => descriptor.name);
}
function getCommandsWithSubcommands(descriptors) {
  return descriptors.filter((descriptor) => descriptor.hasSubcommands).map((descriptor) => descriptor.name);
}
function getParentDefaultHelpCommands(descriptors) {
  return descriptors.filter((descriptor) => descriptor.parentDefaultHelp).map((descriptor) => descriptor.name);
}
function defineCommandDescriptorCatalog(descriptors) {
  return {
    descriptors,
    getDescriptors: () => descriptors,
    getNames: () => getCommandDescriptorNames(descriptors),
    getCommandsWithSubcommands: () => getCommandsWithSubcommands(descriptors),
    getParentDefaultHelpCommands: () => getParentDefaultHelpCommands(descriptors)
  };
}
var coreCliCommandCatalog = defineCommandDescriptorCatalog([
  {
    name: "setup",
    description: "Chat with OpenClaw; onboard when setup is incomplete",
    hasSubcommands: false
  },
  {
    name: "crestodian",
    // hidden alias
    description: "Deprecated: use openclaw setup",
    hasSubcommands: false,
    hidden: true
  },
  {
    name: "onboard",
    description: "Guided setup for auth, models, Gateway, workspace, channels, and skills",
    hasSubcommands: true
  },
  {
    name: "configure",
    description: "Interactive configuration for credentials, channels, gateway, and agent defaults",
    hasSubcommands: false
  },
  {
    name: "config",
    description: "Non-interactive config helpers (get/set/patch/unset/file/schema/validate). Run without subcommand for guided setup.",
    hasSubcommands: true
  },
  {
    name: "backup",
    description: "Create and verify backup archives and SQLite snapshots",
    hasSubcommands: true
  },
  {
    name: "migrate",
    description: "Import state from another agent system",
    hasSubcommands: true
  },
  {
    name: "doctor",
    description: "Health checks + quick fixes for the gateway and channels",
    hasSubcommands: false
  },
  {
    name: "dashboard",
    description: "Open the Control UI with your current token",
    hasSubcommands: false
  },
  {
    name: "reset",
    description: "Reset local config/state (keeps the CLI installed)",
    hasSubcommands: false
  },
  {
    name: "uninstall",
    description: "Uninstall the gateway service + local data (CLI remains)",
    hasSubcommands: false
  },
  {
    name: "message",
    description: "Send, read, and manage messages and channel actions",
    hasSubcommands: true
  },
  {
    name: "mcp",
    description: "Manage OpenClaw mcp.servers config and channel bridge",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "transcripts",
    description: "Inspect stored transcripts",
    hasSubcommands: true
  },
  {
    name: "agent",
    description: "Run an agent turn via the Gateway (use --local for embedded)",
    hasSubcommands: false
  },
  {
    name: "agents",
    description: "Manage isolated agents (workspaces + auth + routing)",
    hasSubcommands: true
  },
  {
    name: "status",
    description: "Show channel health and recent session recipients",
    hasSubcommands: false
  },
  {
    name: "health",
    description: "Fetch health from the running gateway",
    hasSubcommands: false
  },
  {
    name: "audit",
    description: "Inspect metadata-only run, tool, and message lifecycle records",
    hasSubcommands: false
  },
  {
    name: "sessions",
    description: "List stored conversation sessions",
    hasSubcommands: true
  },
  {
    name: "commitments",
    description: "List and manage inferred follow-up commitments",
    hasSubcommands: true
  },
  {
    name: "tasks",
    description: "Inspect durable background tasks and TaskFlow state",
    hasSubcommands: true
  }
]);
var CORE_CLI_COMMAND_DESCRIPTORS = coreCliCommandCatalog.descriptors;
var PRIVATE_QA_DIST_RELATIVE_PATH = path3.join("dist", "plugin-sdk", "qa-lab.js");
function isPrivateQaCliEnabled(env = process.env) {
  return env.OPENCLAW_ENABLE_PRIVATE_QA_CLI === "1";
}
var subCliCommandCatalog = defineCommandDescriptorCatalog([
  { name: "acp", description: "Run an ACP bridge backed by the Gateway", hasSubcommands: true },
  {
    name: "gateway",
    description: "Run, inspect, and query the WebSocket Gateway",
    hasSubcommands: true
  },
  {
    name: "daemon",
    description: "Manage the Gateway service (launchd/systemd/schtasks)",
    hasSubcommands: true
  },
  { name: "logs", description: "Tail gateway file logs via RPC", hasSubcommands: false },
  {
    name: "system",
    description: "System tools (events, heartbeat, presence)",
    hasSubcommands: true
  },
  {
    name: "models",
    description: "Model discovery, scanning, and configuration",
    hasSubcommands: true
  },
  {
    name: "promos",
    description: "Discover and claim promotional model offers from ClawHub",
    hasSubcommands: true
  },
  {
    name: "infer",
    description: "Run provider-backed inference commands through a stable CLI surface",
    hasSubcommands: true
  },
  {
    name: "capability",
    description: "Run provider capability commands (fallback alias: infer)",
    hasSubcommands: true
  },
  {
    name: "approvals",
    description: "Manage approval policy and pending requests",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "exec-approvals",
    description: "Manage exec approvals (alias for approvals)",
    hasSubcommands: true
  },
  {
    name: "exec-policy",
    description: "Show or synchronize requested exec policy with host approvals",
    hasSubcommands: true
  },
  {
    name: "nodes",
    description: "Manage gateway-owned nodes (pairing, status, invoke, and media)",
    hasSubcommands: true
  },
  {
    name: "devices",
    description: "Device pairing and auth tokens",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "users",
    description: "Manage durable user profiles and email aliases",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "node",
    description: "Run and manage the headless node host service",
    hasSubcommands: true
  },
  {
    name: "worker",
    description: "Run the restricted cloud worker runtime",
    hasSubcommands: false
  },
  {
    name: "sandbox",
    description: "Manage sandbox containers (Docker-based agent isolation)",
    hasSubcommands: true
  },
  {
    name: "fleet",
    description: "Provision and manage isolated tenant cells (experimental)",
    hasSubcommands: true
  },
  {
    name: "worktrees",
    description: "Create, inspect, restore, and clean up managed worktrees",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "attach",
    description: "Attach Claude Code to a gateway session with scoped MCP tools",
    hasSubcommands: false
  },
  {
    name: "tui",
    description: "Open a terminal UI connected to the Gateway",
    hasSubcommands: false
  },
  {
    name: "terminal",
    description: "Open a local terminal UI (alias for tui --local)",
    hasSubcommands: false
  },
  {
    name: "chat",
    description: "Open a local terminal UI (alias for tui --local)",
    hasSubcommands: false
  },
  {
    name: "cron",
    description: "Manage cron jobs (via Gateway)",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "dns",
    description: "DNS helpers for wide-area discovery (Tailscale + CoreDNS)",
    hasSubcommands: true
  },
  {
    name: "docs",
    description: "Search the live OpenClaw docs",
    hasSubcommands: false
  },
  {
    name: "qa",
    description: "Run QA scenarios and launch the private QA debugger UI",
    hasSubcommands: true
  },
  {
    name: "proxy",
    description: "Run the OpenClaw debug proxy and inspect captured traffic",
    hasSubcommands: true
  },
  {
    name: "hooks",
    description: "Manage internal agent hooks",
    hasSubcommands: true
  },
  {
    name: "webhooks",
    description: "Webhook helpers and integrations",
    hasSubcommands: true
  },
  {
    name: "qr",
    description: "Generate a mobile pairing QR code and setup code",
    hasSubcommands: false
  },
  {
    name: "clawbot",
    description: "Legacy clawbot command aliases",
    hasSubcommands: true
  },
  {
    name: "pairing",
    description: "Secure DM pairing (approve inbound requests)",
    hasSubcommands: true
  },
  {
    name: "plugins",
    description: "Manage OpenClaw plugins and extensions",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "channels",
    description: "Manage connected chat channels and accounts",
    hasSubcommands: true,
    parentDefaultHelp: true
  },
  {
    name: "directory",
    description: "Lookup contact and group IDs (self, peers, groups) for supported chat channels",
    hasSubcommands: true
  },
  {
    name: "security",
    description: "Audit local config and state for common security foot-guns",
    hasSubcommands: true
  },
  {
    name: "secrets",
    description: "Secrets runtime controls",
    hasSubcommands: true
  },
  {
    name: "skills",
    description: "List and inspect available skills",
    hasSubcommands: true
  },
  {
    name: "update",
    description: "Update OpenClaw and inspect update channel status",
    hasSubcommands: true
  },
  {
    name: "completion",
    description: "Generate shell completion script",
    hasSubcommands: false
  }
]);
function filterPrivateQaItems(items, getName) {
  if (isPrivateQaCliEnabled()) {
    return items;
  }
  return items.filter((item) => getName(item) !== "qa");
}
var SUB_CLI_DESCRIPTORS = filterPrivateQaItems(
  subCliCommandCatalog.descriptors,
  (descriptor) => descriptor.name
);
var ROOT_COMMAND_DESCRIPTORS = [...CORE_CLI_COMMAND_DESCRIPTORS, ...SUB_CLI_DESCRIPTORS];
var KNOWN_ROOT_COMMANDS = new Set(
  ROOT_COMMAND_DESCRIPTORS.map((descriptor) => descriptor.name)
);
var ROOT_COMMANDS_WITH_SUBCOMMANDS = new Set(
  ROOT_COMMAND_DESCRIPTORS.filter((descriptor) => descriptor.hasSubcommands).map(
    (descriptor) => descriptor.name
  )
);
function getCommandPathWithRootOptions(argv, depth = 2) {
  return getCommandPathInternal(argv, depth, { skipRootOptions: true });
}
function getCommandPathInternal(argv, depth, opts) {
  const args = argv.slice(2);
  const path10 = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg) {
      continue;
    }
    if (arg === "--") {
      break;
    }
    if (opts.skipRootOptions) {
      const consumed = consumeRootOptionToken(args, i);
      if (consumed > 0) {
        i += consumed - 1;
        continue;
      }
    }
    if (arg.startsWith("-")) {
      continue;
    }
    path10.push(arg);
    if (path10.length >= depth) {
      break;
    }
  }
  return path10;
}
function resolveIsNixMode(env = process.env) {
  return env.OPENCLAW_NIX_MODE === "1";
}
var isNixMode = resolveIsNixMode();
var LEGACY_STATE_DIRNAMES = [".clawdbot"];
var NEW_STATE_DIRNAME = ".openclaw";
var CONFIG_FILENAME = "openclaw.json";
var LEGACY_CONFIG_FILENAMES = ["clawdbot.json"];
function resolveDefaultHomeDir() {
  return resolveRequiredHomeDir(process.env, os3.homedir);
}
function envHomedir(env) {
  return () => resolveRequiredHomeDir(env, os3.homedir);
}
function legacyStateDirs(homedir = resolveDefaultHomeDir) {
  return LEGACY_STATE_DIRNAMES.map((dir) => path4.join(homedir(), dir));
}
function newStateDir(homedir = resolveDefaultHomeDir) {
  return path4.join(homedir(), NEW_STATE_DIRNAME);
}
function resolveStateDir(env = process.env, homedir = envHomedir(env)) {
  const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
  const override = env.OPENCLAW_STATE_DIR?.trim();
  if (override) {
    return resolveUserPath2(override, env, effectiveHomedir);
  }
  const newDir = newStateDir(effectiveHomedir);
  if (env.OPENCLAW_TEST_FAST === "1") {
    return newDir;
  }
  const legacyDirs = legacyStateDirs(effectiveHomedir);
  const hasNew = fs2.existsSync(newDir);
  if (hasNew) {
    return newDir;
  }
  const existingLegacy = legacyDirs.find((dir) => {
    try {
      return fs2.existsSync(dir);
    } catch {
      return false;
    }
  });
  if (existingLegacy) {
    return existingLegacy;
  }
  return newDir;
}
function resolveUserPath2(input, env = process.env, homedir = envHomedir(env)) {
  return resolveHomeRelativePath(input, { env, homedir });
}
var STATE_DIR = resolveStateDir();
function resolveCanonicalConfigPath(env = process.env, stateDir = resolveStateDir(env, envHomedir(env))) {
  const override = env.OPENCLAW_CONFIG_PATH?.trim();
  if (override) {
    return resolveUserPath2(override, env, envHomedir(env));
  }
  return path4.join(stateDir, CONFIG_FILENAME);
}
function resolveConfigPathCandidate(env = process.env, homedir = envHomedir(env)) {
  if (env.OPENCLAW_TEST_FAST === "1") {
    return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
  }
  const candidates = resolveDefaultConfigCandidates(env, homedir);
  const existing = candidates.find((candidate) => {
    try {
      return fs2.existsSync(candidate);
    } catch {
      return false;
    }
  });
  if (existing) {
    return existing;
  }
  return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
}
function resolveConfigPath(env = process.env, stateDir = resolveStateDir(env, envHomedir(env)), homedir = envHomedir(env)) {
  const override = env.OPENCLAW_CONFIG_PATH?.trim();
  if (override) {
    return resolveUserPath2(override, env, homedir);
  }
  if (env.OPENCLAW_TEST_FAST === "1") {
    return path4.join(stateDir, CONFIG_FILENAME);
  }
  const stateOverride = env.OPENCLAW_STATE_DIR?.trim();
  const candidates = [
    path4.join(stateDir, CONFIG_FILENAME),
    ...LEGACY_CONFIG_FILENAMES.map((name) => path4.join(stateDir, name))
  ];
  const existing = candidates.find((candidate) => {
    try {
      return fs2.existsSync(candidate);
    } catch {
      return false;
    }
  });
  if (existing) {
    return existing;
  }
  if (stateOverride) {
    return path4.join(stateDir, CONFIG_FILENAME);
  }
  const defaultStateDir = resolveStateDir(env, homedir);
  if (path4.resolve(stateDir) === path4.resolve(defaultStateDir)) {
    return resolveConfigPathCandidate(env, homedir);
  }
  return path4.join(stateDir, CONFIG_FILENAME);
}
var CONFIG_PATH = resolveConfigPathCandidate();
function resolveDefaultConfigCandidates(env = process.env, homedir = envHomedir(env)) {
  const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
  const explicit = env.OPENCLAW_CONFIG_PATH?.trim();
  if (explicit) {
    return [resolveUserPath2(explicit, env, effectiveHomedir)];
  }
  const candidates = [];
  const openclawStateDir = env.OPENCLAW_STATE_DIR?.trim();
  if (openclawStateDir) {
    const resolved = resolveUserPath2(openclawStateDir, env, effectiveHomedir);
    candidates.push(path4.join(resolved, CONFIG_FILENAME));
    candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path4.join(resolved, name)));
  }
  const defaultDirs = [newStateDir(effectiveHomedir), ...legacyStateDirs(effectiveHomedir)];
  for (const dir of defaultDirs) {
    candidates.push(path4.join(dir, CONFIG_FILENAME));
    candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path4.join(dir, name)));
  }
  return candidates;
}
var cachedLoggingConfig;
function shouldSkipMutatingLoggingConfigRead(argv = process.argv) {
  const [primary, secondary] = getCommandPathWithRootOptions(argv, 2);
  return primary === "config" && (secondary === "schema" || secondary === "validate");
}
function readLoggingConfig() {
  if (shouldSkipMutatingLoggingConfigRead()) {
    return void 0;
  }
  try {
    const configPath = resolveConfigPath();
    if (cachedLoggingConfig?.path === configPath) {
      return cachedLoggingConfig.logging;
    }
    if (!fs3.existsSync(configPath)) {
      return void 0;
    }
    const parsed = JSON5.parse(fs3.readFileSync(configPath, "utf8"));
    const logging = isRecord(parsed) ? parsed.logging : void 0;
    const resolved = isRecord(logging) ? logging : void 0;
    cachedLoggingConfig = {
      path: configPath,
      logging: resolved
    };
    return resolved;
  } catch {
    return void 0;
  }
}
var ALLOWED_LOG_LEVELS = [
  "silent",
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace"
];
function tryParseLogLevel(level) {
  if (typeof level !== "string") {
    return void 0;
  }
  const candidate = level.trim();
  return ALLOWED_LOG_LEVELS.includes(candidate) ? candidate : void 0;
}
function normalizeLogLevel(level, fallback = "info") {
  return tryParseLogLevel(level) ?? fallback;
}
function levelToMinLevel(level) {
  const map = {
    trace: 1,
    debug: 2,
    info: 3,
    warn: 4,
    error: 5,
    fatal: 6,
    silent: Number.POSITIVE_INFINITY
  };
  return map[level];
}
var LOGGING_STATE_KEY = /* @__PURE__ */ Symbol.for("openclaw.loggingState");
function createLoggingState() {
  return {
    cachedLogger: null,
    cachedSettings: null,
    cachedConsoleSettings: null,
    overrideSettings: null,
    invalidEnvLogLevelValue: null,
    consolePatched: false,
    forceConsoleToStderr: false,
    consoleTimestampPrefix: false,
    consoleSubsystemFilter: null,
    resolvingConsoleSettings: false,
    streamErrorHandlersInstalled: false,
    rawConsole: null
  };
}
var globalStore = globalThis;
var loggingState = globalStore[LOGGING_STATE_KEY] ?? createLoggingState();
globalStore[LOGGING_STATE_KEY] = loggingState;
function resolveEnvLogLevelOverride() {
  const trimmed = normalizeOptionalString(process.env.OPENCLAW_LOG_LEVEL) ?? "";
  if (!trimmed) {
    loggingState.invalidEnvLogLevelValue = null;
    return void 0;
  }
  const parsed = tryParseLogLevel(trimmed);
  if (parsed) {
    loggingState.invalidEnvLogLevelValue = null;
    return parsed;
  }
  if (loggingState.invalidEnvLogLevelValue !== trimmed) {
    loggingState.invalidEnvLogLevelValue = trimmed;
    process.stderr.write(
      `[openclaw] Ignoring invalid OPENCLAW_LOG_LEVEL="${trimmed}" (allowed: ${ALLOWED_LOG_LEVELS.join("|")}).
`
    );
  }
  return void 0;
}
var TRACE_ID_RE = /^[0-9a-f]{32}$/;
var SPAN_ID_RE = /^[0-9a-f]{16}$/;
var TRACE_FLAGS_RE = /^[0-9a-f]{2}$/;
var DIAGNOSTIC_TRACE_SCOPE_STATE_KEY = /* @__PURE__ */ Symbol.for("openclaw.diagnosticTraceScope.state.v1");
function isNonZeroHex(value) {
  return !/^0+$/.test(value);
}
function createDiagnosticTraceScopeState() {
  return {
    marker: DIAGNOSTIC_TRACE_SCOPE_STATE_KEY,
    storage: new AsyncLocalStorage()
  };
}
function isDiagnosticTraceScopeState(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  return candidate.marker === DIAGNOSTIC_TRACE_SCOPE_STATE_KEY && candidate.storage instanceof AsyncLocalStorage;
}
function getDiagnosticTraceScopeState() {
  const globalRecord = globalThis;
  const existing = globalRecord[DIAGNOSTIC_TRACE_SCOPE_STATE_KEY];
  if (isDiagnosticTraceScopeState(existing)) {
    return existing;
  }
  const state = createDiagnosticTraceScopeState();
  Object.defineProperty(globalThis, DIAGNOSTIC_TRACE_SCOPE_STATE_KEY, {
    configurable: true,
    enumerable: false,
    value: state,
    writable: false
  });
  return state;
}
function isValidDiagnosticTraceId(value) {
  return typeof value === "string" && TRACE_ID_RE.test(value) && isNonZeroHex(value);
}
function isValidDiagnosticSpanId(value) {
  return typeof value === "string" && SPAN_ID_RE.test(value) && isNonZeroHex(value);
}
function isValidDiagnosticTraceFlags(value) {
  return typeof value === "string" && TRACE_FLAGS_RE.test(value);
}
function getActiveDiagnosticTraceContext() {
  return getDiagnosticTraceScopeState().storage.getStore();
}
var MAX_ASYNC_DIAGNOSTIC_EVENTS = 1e4;
var MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN = 100;
var DIAGNOSTIC_EVENTS_STATE_KEY = /* @__PURE__ */ Symbol.for("openclaw.diagnosticEvents.state.v1");
var dispatchedTrustedDiagnosticMetadata = /* @__PURE__ */ new WeakSet();
var ASYNC_DIAGNOSTIC_EVENT_TYPES = /* @__PURE__ */ new Set([
  "tool.execution.started",
  "tool.execution.completed",
  "tool.execution.error",
  "tool.execution.blocked",
  "skill.used",
  "exec.process.completed",
  "exec.approval.followup_suppressed",
  "message.delivery.started",
  "message.delivery.completed",
  "message.delivery.error",
  "talk.event",
  "model.call.started",
  "model.call.completed",
  "model.call.error",
  "run.progress",
  "run.execution_phase",
  "harness.run.completed",
  "harness.run.error",
  "context.assembled",
  "log.record"
]);
var PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES = /* @__PURE__ */ new Set([
  "tool.execution.completed",
  "tool.execution.error",
  "tool.execution.blocked"
]);
function createDiagnosticEventsState() {
  return {
    marker: DIAGNOSTIC_EVENTS_STATE_KEY,
    enabled: true,
    seq: 0,
    listeners: /* @__PURE__ */ new Set(),
    trustedListeners: /* @__PURE__ */ new Set(),
    toolExecutionListeners: /* @__PURE__ */ new Set(),
    toolExecutionSeq: 0,
    dispatchDepth: 0,
    asyncQueue: [],
    asyncDrainScheduled: false,
    asyncDroppedEvents: 0,
    asyncDroppedTrustedEvents: 0,
    asyncDroppedUntrustedEvents: 0,
    asyncDroppedPriorityEvents: 0
  };
}
function isDiagnosticEventsState(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  return candidate.marker === DIAGNOSTIC_EVENTS_STATE_KEY && typeof candidate.enabled === "boolean" && typeof candidate.seq === "number" && candidate.listeners instanceof Set && (candidate.trustedListeners === void 0 || candidate.trustedListeners instanceof Set) && (candidate.toolExecutionListeners === void 0 || candidate.toolExecutionListeners instanceof Set) && typeof candidate.dispatchDepth === "number" && Array.isArray(candidate.asyncQueue) && typeof candidate.asyncDrainScheduled === "boolean";
}
function getDiagnosticEventsState() {
  const globalRecord = globalThis;
  const existing = globalRecord[DIAGNOSTIC_EVENTS_STATE_KEY];
  if (isDiagnosticEventsState(existing)) {
    existing.asyncDroppedEvents ??= 0;
    existing.asyncDroppedTrustedEvents ??= 0;
    existing.asyncDroppedUntrustedEvents ??= 0;
    existing.asyncDroppedPriorityEvents ??= 0;
    existing.trustedListeners ??= /* @__PURE__ */ new Set();
    existing.toolExecutionListeners ??= /* @__PURE__ */ new Set();
    existing.toolExecutionSeq ??= 0;
    return existing;
  }
  const state = createDiagnosticEventsState();
  Object.defineProperty(globalThis, DIAGNOSTIC_EVENTS_STATE_KEY, {
    configurable: true,
    enumerable: false,
    value: state,
    writable: false
  });
  return state;
}
function dispatchDiagnosticEvent(state, enriched, metadata, privateData, options = {}) {
  if (state.dispatchDepth > 100) {
    console.error(
      `[diagnostic-events] recursion guard tripped at depth=${state.dispatchDepth}, dropping type=${enriched.type}`
    );
    return;
  }
  state.dispatchDepth += 1;
  try {
    if (!options.trustedListenersOnly) {
      for (const listener of state.listeners) {
        try {
          listener(
            cloneDiagnosticEventForListener(enriched),
            createDiagnosticMetadataForListener(metadata)
          );
        } catch (err) {
          const errorMessage = err instanceof Error ? err.stack ?? err.message : typeof err === "string" ? err : String(err);
          console.error(
            `[diagnostic-events] listener error type=${enriched.type} seq=${enriched.seq}: ${errorMessage}`
          );
        }
      }
    }
    for (const listener of state.trustedListeners) {
      try {
        listener(
          cloneDiagnosticEventForListener(enriched),
          createDiagnosticMetadataForListener(metadata),
          cloneDiagnosticPrivateDataForListener(privateData)
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.stack ?? err.message : typeof err === "string" ? err : String(err);
        console.error(
          `[diagnostic-events] trusted listener error type=${enriched.type} seq=${enriched.seq}: ${errorMessage}`
        );
      }
    }
  } finally {
    state.dispatchDepth -= 1;
  }
}
function createDiagnosticMetadataForListener(metadata) {
  const listenerMetadata = Object.freeze({ ...metadata });
  if (listenerMetadata.trusted) {
    dispatchedTrustedDiagnosticMetadata.add(listenerMetadata);
  }
  return listenerMetadata;
}
function cloneDiagnosticEventForListener(event) {
  return deepFreezeDiagnosticValue(structuredClone(event));
}
function cloneDiagnosticPrivateDataForListener(privateData) {
  if (!privateData) {
    return Object.freeze({});
  }
  return deepFreezeDiagnosticValue(structuredClone(privateData));
}
function isPriorityAsyncDiagnosticEvent(entry) {
  return entry.metadata.trusted && PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES.has(entry.event.type);
}
function noteAsyncDiagnosticDrop(state, entry) {
  state.asyncDroppedEvents += 1;
  if (entry.metadata.trusted) {
    state.asyncDroppedTrustedEvents += 1;
  } else {
    state.asyncDroppedUntrustedEvents += 1;
  }
  if (isPriorityAsyncDiagnosticEvent(entry)) {
    state.asyncDroppedPriorityEvents += 1;
  }
}
function makeRoomForPriorityAsyncDiagnosticEvent(state) {
  const nonPriorityIndex = state.asyncQueue.findIndex(
    (entry) => !isPriorityAsyncDiagnosticEvent(entry)
  );
  if (nonPriorityIndex >= 0) {
    return state.asyncQueue.splice(nonPriorityIndex, 1)[0];
  }
  return state.asyncQueue.shift();
}
function deepFreezeDiagnosticValue(value, seen = /* @__PURE__ */ new WeakSet()) {
  if (!value || typeof value !== "object") {
    return value;
  }
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (Array.isArray(value)) {
    for (const item of value) {
      deepFreezeDiagnosticValue(item, seen);
    }
    return Object.freeze(value);
  }
  for (const nested of Object.values(value)) {
    deepFreezeDiagnosticValue(nested, seen);
  }
  return Object.freeze(value);
}
function scheduleAsyncDiagnosticDrain(state) {
  if (state.asyncDrainScheduled) {
    return;
  }
  state.asyncDrainScheduled = true;
  setImmediate(() => {
    state.asyncDrainScheduled = false;
    const batch = state.asyncQueue.splice(0, MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN);
    for (const entry of batch) {
      dispatchDiagnosticEvent(state, entry.event, entry.metadata, entry.privateData, {
        trustedListenersOnly: entry.trustedListenersOnly
      });
    }
    if (state.asyncQueue.length > 0) {
      scheduleAsyncDiagnosticDrain(state);
      return;
    }
    dispatchAsyncDiagnosticDropSummary(state);
  });
}
function dispatchAsyncDiagnosticDropSummary(state) {
  if (state.asyncDroppedEvents <= 0) {
    return;
  }
  const droppedEvents = state.asyncDroppedEvents;
  const droppedTrustedEvents = state.asyncDroppedTrustedEvents;
  const droppedUntrustedEvents = state.asyncDroppedUntrustedEvents;
  const droppedPriorityEvents = state.asyncDroppedPriorityEvents;
  state.asyncDroppedEvents = 0;
  state.asyncDroppedTrustedEvents = 0;
  state.asyncDroppedUntrustedEvents = 0;
  state.asyncDroppedPriorityEvents = 0;
  const event = enrichDiagnosticEvent(state, {
    type: "diagnostic.async_queue.dropped",
    droppedEvents,
    ...droppedTrustedEvents > 0 ? { droppedTrustedEvents } : {},
    ...droppedUntrustedEvents > 0 ? { droppedUntrustedEvents } : {},
    ...droppedPriorityEvents > 0 ? { droppedPriorityEvents } : {},
    queueLength: state.asyncQueue.length,
    maxQueueLength: MAX_ASYNC_DIAGNOSTIC_EVENTS,
    drainBatchSize: MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN
  });
  dispatchDiagnosticEvent(state, event, createInternalDiagnosticMetadata(false));
}
function enrichDiagnosticEvent(state, event) {
  const enriched = {};
  for (const [key, value] of Object.entries(event)) {
    if (isBlockedObjectKey(key)) {
      continue;
    }
    enriched[key] = value;
  }
  enriched.trace ??= getActiveDiagnosticTraceContext();
  state.seq += 1;
  enriched.seq = state.seq;
  enriched.ts = Date.now();
  return enriched;
}
function createInternalDiagnosticMetadata(trusted) {
  return { internal: true, trusted };
}
function emitDiagnosticEventWithTrust(event, trusted, options = {}) {
  const state = getDiagnosticEventsState();
  if (trusted && isToolExecutionEventInput(event)) {
    dispatchTrustedToolExecutionEvent(state, event);
  }
  if (!state.enabled) {
    return;
  }
  if (event.type === "security.event" && options.allowSecurityEvent !== true) {
    return;
  }
  const enriched = enrichDiagnosticEvent(state, event);
  const { internal = false, privateData } = options;
  const trustedTraceContext = options.trustedTraceContext === true;
  const metadata = {
    ...internal ? createInternalDiagnosticMetadata(trusted) : { trusted },
    ...trustedTraceContext ? { trustedTraceContext } : {}
  };
  if (ASYNC_DIAGNOSTIC_EVENT_TYPES.has(enriched.type)) {
    if (state.asyncQueue.length >= MAX_ASYNC_DIAGNOSTIC_EVENTS) {
      if (!trusted || !PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES.has(enriched.type)) {
        noteAsyncDiagnosticDrop(state, { event: enriched, metadata, privateData });
        return;
      }
      const droppedEntry = makeRoomForPriorityAsyncDiagnosticEvent(state);
      if (droppedEntry) {
        noteAsyncDiagnosticDrop(state, droppedEntry);
      }
    }
    state.asyncQueue.push({ event: enriched, metadata, privateData });
    scheduleAsyncDiagnosticDrain(state);
    return;
  }
  dispatchDiagnosticEvent(state, enriched, metadata, privateData);
}
function isToolExecutionEventInput(event) {
  return event.type === "tool.execution.started" || event.type === "tool.execution.completed" || event.type === "tool.execution.error" || event.type === "tool.execution.blocked";
}
function dispatchTrustedToolExecutionEvent(state, event) {
  state.toolExecutionSeq += 1;
  let enriched;
  try {
    enriched = deepFreezeDiagnosticValue(
      structuredClone({ ...event, seq: state.toolExecutionSeq, ts: Date.now() })
    );
  } catch (error) {
    console.error(
      `[diagnostic-events] tool execution clone error type=${event.type}: ${String(error)}`
    );
    return;
  }
  for (const listener of state.toolExecutionListeners) {
    try {
      listener(enriched);
    } catch (error) {
      console.error(
        `[diagnostic-events] tool execution listener error type=${enriched.type} seq=${enriched.seq}: ${String(error)}`
      );
    }
  }
}
function emitDiagnosticEvent(event) {
  emitDiagnosticEventWithTrust(event, false);
}
function emitDiagnosticEventWithTrustedTraceContext(event) {
  emitDiagnosticEventWithTrust(event, false, { trustedTraceContext: true });
}
var POSIX_OPENCLAW_TMP_DIR = "/tmp/openclaw";
function isNodeErrorWithCode(err, code) {
  return typeof err === "object" && err !== null && "code" in err && err.code === code;
}
function resolvePreferredOpenClawTmpDir(options = {}) {
  const accessMode = fs4.constants.W_OK | fs4.constants.X_OK;
  const accessSync = options.accessSync ?? fs4.accessSync;
  const chmodSync = options.chmodSync ?? fs4.chmodSync;
  const lstatSync = options.lstatSync ?? fs4.lstatSync;
  const mkdirSync = options.mkdirSync ?? fs4.mkdirSync;
  const warn = options.warn ?? ((message) => console.warn(message));
  const getuid = options.getuid ?? (() => {
    try {
      return typeof process.getuid === "function" ? process.getuid() : void 0;
    } catch {
      return void 0;
    }
  });
  const tmpdir = typeof options.tmpdir === "function" ? options.tmpdir : getOsTmpDir;
  const platform = options.platform ?? process.platform;
  const uid = getuid();
  const isSecureDirForUser = (st) => {
    if (uid === void 0) {
      return true;
    }
    if (typeof st.uid === "number" && st.uid !== uid) {
      return false;
    }
    return typeof st.mode !== "number" || (st.mode & 18) === 0;
  };
  const fallback = () => {
    const suffix = uid === void 0 ? "openclaw" : `openclaw-${uid}`;
    const joiner = platform === "win32" ? path5.win32.join : path5.join;
    return joiner(tmpdir(), suffix);
  };
  const isTrustedTmpDir = (st) => st.isDirectory() && !st.isSymbolicLink() && isSecureDirForUser(st);
  const resolveDirState = (candidatePath) => {
    try {
      const candidate = lstatSync(candidatePath);
      if (!isTrustedTmpDir(candidate)) {
        return "invalid";
      }
      accessSync(candidatePath, accessMode);
      return "available";
    } catch (err) {
      return isNodeErrorWithCode(err, "ENOENT") ? "missing" : "invalid";
    }
  };
  const tryRepairWritableBits = (candidatePath) => {
    try {
      const st = lstatSync(candidatePath);
      if (!st.isDirectory() || st.isSymbolicLink()) {
        return false;
      }
      if (uid !== void 0 && typeof st.uid === "number" && st.uid !== uid) {
        return false;
      }
      if (typeof st.mode !== "number") {
        return false;
      }
      if ((st.mode & 18) === 0) {
        return resolveDirState(candidatePath) === "available";
      }
      try {
        chmodSync(candidatePath, 448);
      } catch (chmodErr) {
        if (isNodeErrorWithCode(chmodErr, "EPERM") || isNodeErrorWithCode(chmodErr, "EACCES") || isNodeErrorWithCode(chmodErr, "ENOENT")) {
          return resolveDirState(candidatePath) === "available";
        }
        throw chmodErr;
      }
      warn(`[openclaw] tightened permissions on temp dir: ${candidatePath}`);
      return resolveDirState(candidatePath) === "available";
    } catch {
      return false;
    }
  };
  const ensureTrustedFallbackDir = () => {
    const fallbackPath = fallback();
    const state = resolveDirState(fallbackPath);
    if (state === "available") {
      return fallbackPath;
    }
    if (state === "invalid") {
      if (tryRepairWritableBits(fallbackPath)) {
        return fallbackPath;
      }
      throw new Error(`Unsafe fallback OpenClaw temp dir: ${fallbackPath}`);
    }
    try {
      mkdirSync(fallbackPath, { recursive: true, mode: 448 });
      chmodSync(fallbackPath, 448);
    } catch {
      throw new Error(`Unable to create fallback OpenClaw temp dir: ${fallbackPath}`);
    }
    if (resolveDirState(fallbackPath) !== "available" && !tryRepairWritableBits(fallbackPath)) {
      throw new Error(`Unsafe fallback OpenClaw temp dir: ${fallbackPath}`);
    }
    return fallbackPath;
  };
  if (platform === "win32") {
    return ensureTrustedFallbackDir();
  }
  const preferredDir = POSIX_OPENCLAW_TMP_DIR;
  const preferredState = resolveDirState(preferredDir);
  if (preferredState === "available") {
    return preferredDir;
  }
  if (preferredState === "invalid") {
    if (tryRepairWritableBits(preferredDir)) {
      return preferredDir;
    }
    return ensureTrustedFallbackDir();
  }
  try {
    accessSync(path5.dirname(preferredDir), accessMode);
    mkdirSync(preferredDir, { recursive: true, mode: 448 });
    chmodSync(preferredDir, 448);
    if (resolveDirState(preferredDir) !== "available" && !tryRepairWritableBits(preferredDir)) {
      return ensureTrustedFallbackDir();
    }
    return preferredDir;
  } catch {
    return ensureTrustedFallbackDir();
  }
}
var LOG_PREFIX = "openclaw";
var LOG_SUFFIX = ".log";
function canUseNodeFs() {
  const getBuiltinModule = process.getBuiltinModule;
  if (typeof getBuiltinModule !== "function") {
    return false;
  }
  try {
    return getBuiltinModule("fs") !== void 0;
  } catch {
    return false;
  }
}
function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
var HTTP_AUTH_SCHEME_PATTERN = "[A-Za-z0-9!#$%&'*+.^_`|~-]+";
var HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN = String.raw`(?:\[REDACTED\]|[^\s\\"',;&#?<>)}\]]+)`;
var HTTP_AUTH_SERIALIZED_TAB_PATTERN = String.raw`\\{1,64}t`;
var HTTP_AUTH_SERIALIZED_INDENT_PATTERN = String.raw`(?:[ \t]+|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})`;
var HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]*)`;
var HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]+)`;
var HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t\r\n]*|[ \t]*\\{1,64}r\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*)`;
var HTTP_AUTH_HEADER_BOUNDARY_PATTERN = String.raw`(^|[^A-Za-z0-9_-]|\\{1,64}[rn])`;
var HTTP_AUTH_SERIALIZED_QUOTE_PATTERN = String.raw`(?:\\{1,64}["']|["']|)`;
var CREDENTIAL_STYLE_HEADER_REDACT_PATTERN = String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:x-goog-api-key|api-key|apikey|x-api-token|x-access-token)${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
var STRUCTURED_AUTH_HEADER_RE = new RegExp(
  String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:Proxy-)?Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_SCHEME_PATTERN})${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}`,
  "giu"
);
var AUTH_PARAM_NAME_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
var AUTH_PARAM_TOKEN_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
var AWS_SCOPE_VALUE_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~:/-]+/u;
function skipHorizontalWhitespace(value, start) {
  let cursor = start;
  while (value[cursor] === " " || value[cursor] === "	") {
    cursor += 1;
  }
  return cursor;
}
function readSerializedLineEnd(value, start) {
  let cursor = start;
  let slashCount = 0;
  while (slashCount < 64 && value[cursor] === "\\") {
    slashCount += 1;
    cursor += 1;
  }
  if (slashCount === 0) {
    return null;
  }
  if (value[cursor] === "n") {
    return cursor + 1;
  }
  if (value[cursor] !== "r") {
    return null;
  }
  cursor += 1;
  slashCount = 0;
  while (slashCount < 64 && value[cursor] === "\\") {
    slashCount += 1;
    cursor += 1;
  }
  return slashCount > 0 && value[cursor] === "n" ? cursor + 1 : null;
}
function readSerializedTabEnd(value, start) {
  let cursor = start;
  let slashCount = 0;
  while (slashCount < 64 && value[cursor] === "\\") {
    slashCount += 1;
    cursor += 1;
  }
  return slashCount > 0 && value[cursor] === "t" ? cursor + 1 : null;
}
function skipAuthWhitespace(value, start) {
  let cursor = start;
  for (; ; ) {
    cursor = skipHorizontalWhitespace(value, cursor);
    const tabEnd = readSerializedTabEnd(value, cursor);
    if (tabEnd !== null) {
      cursor = tabEnd;
      continue;
    }
    const lineEnd = value[cursor] === "\r" && value[cursor + 1] === "\n" ? cursor + 2 : value[cursor] === "\n" ? cursor + 1 : readSerializedLineEnd(value, cursor);
    if (lineEnd === null || value[lineEnd] !== " " && value[lineEnd] !== "	" && readSerializedTabEnd(value, lineEnd) === null) {
      return cursor;
    }
    cursor = lineEnd;
  }
}
function readAuthParamName(value, start) {
  const match = AUTH_PARAM_NAME_RE.exec(value.slice(start));
  return match ? { name: match[0].toLowerCase(), end: start + match[0].length } : null;
}
function isAuthHeaderStart(value, index) {
  const previous = value[index - 1];
  let serializedLineBoundary = false;
  if (previous === "n" || previous === "r") {
    let slashCursor = index - 2;
    let slashCount2 = 0;
    while (slashCount2 < 64 && value[slashCursor] === "\\") {
      slashCount2 += 1;
      slashCursor -= 1;
    }
    serializedLineBoundary = slashCount2 > 0;
  }
  if (!serializedLineBoundary && previous !== void 0 && /[A-Za-z0-9_-]/u.test(previous)) {
    return false;
  }
  const proxyName = "proxy-authorization";
  const directName = "authorization";
  const candidate = value.slice(index, index + proxyName.length).toLowerCase();
  const name = candidate === proxyName ? proxyName : candidate.startsWith(directName) ? directName : null;
  if (!name) {
    return false;
  }
  let cursor = index + name.length;
  let slashCount = 0;
  while (slashCount < 64 && value[cursor] === "\\") {
    slashCount += 1;
    cursor += 1;
  }
  if (value[cursor] === '"' || value[cursor] === "'") {
    cursor += 1;
  } else if (slashCount > 0) {
    return false;
  }
  cursor = skipHorizontalWhitespace(value, cursor);
  return value[cursor] === ":" || value[cursor] === "=";
}
function findNextAuthParamStart(value, start) {
  let cursor = start;
  for (; ; ) {
    cursor = skipAuthWhitespace(value, cursor);
    if (cursor > start && isAuthHeaderStart(value, cursor)) {
      return null;
    }
    if (cursor >= value.length || value[cursor] === "\r" || value[cursor] === "\n" || value[cursor] === ";") {
      return null;
    }
    if (value[cursor] === ",") {
      cursor += 1;
      continue;
    }
    const param = readAuthParamName(value, cursor);
    if (param) {
      const equals = skipAuthWhitespace(value, param.end);
      if (value[equals] === "=" && value[equals + 1] !== "=") {
        return cursor;
      }
    }
    while (cursor < value.length) {
      const whitespaceEnd = skipAuthWhitespace(value, cursor);
      if (whitespaceEnd > cursor) {
        cursor = whitespaceEnd;
        continue;
      }
      if (cursor > start && isAuthHeaderStart(value, cursor)) {
        return null;
      }
      const char = value[cursor];
      if (char === "\r" || char === "\n" || char === ";") {
        return null;
      }
      cursor += 1;
      if (char === ",") {
        break;
      }
    }
  }
}
function usesAuthParams(scheme) {
  return scheme === "digest" || scheme === "hawk" || scheme.startsWith("aws4-");
}
function findAuthFieldEnd(value, start) {
  let cursor = start;
  while (cursor < value.length) {
    const whitespaceEnd = skipAuthWhitespace(value, cursor);
    if (whitespaceEnd > cursor) {
      cursor = whitespaceEnd;
      continue;
    }
    if (cursor > start && isAuthHeaderStart(value, cursor)) {
      break;
    }
    const char = value[cursor];
    if (char === "\r" || char === "\n" || char === ";" || char === "\\" || char === '"' || char === "'" || char === "}" || char === "]") {
      break;
    }
    cursor += 1;
  }
  return cursor;
}
function readParamValue(value, start, options) {
  let escapedQuoteSlashCount = 0;
  while (value[start + escapedQuoteSlashCount] === "\\") {
    escapedQuoteSlashCount += 1;
  }
  const escapedQuotes = escapedQuoteSlashCount > 0 && value[start + escapedQuoteSlashCount] === '"';
  const quote = value[start] === '"' || value[start] === "'" ? value[start] : void 0;
  if (quote || escapedQuotes) {
    let cursor = start + (escapedQuotes ? escapedQuoteSlashCount + 1 : 1);
    while (cursor < value.length) {
      if (value[cursor] === "\r" || value[cursor] === "\n") {
        const whitespaceEnd = skipAuthWhitespace(value, cursor);
        if (whitespaceEnd === cursor) {
          break;
        }
        cursor = whitespaceEnd;
        continue;
      }
      if (escapedQuotes && value[cursor] === "\\") {
        let slashEnd = cursor + 1;
        while (value[slashEnd] === "\\") {
          slashEnd += 1;
        }
        if (value[slashEnd] === '"') {
          const slashCount = slashEnd - cursor;
          if (slashCount % (2 * (escapedQuoteSlashCount + 1)) === escapedQuoteSlashCount) {
            return slashEnd + 1;
          }
          cursor = slashEnd + 1;
          continue;
        }
        cursor = slashEnd;
        continue;
      }
      if (!escapedQuotes && value[cursor] === "\\" && cursor + 1 < value.length) {
        cursor += 2;
        continue;
      }
      if (!escapedQuotes && value[cursor] === quote) {
        return cursor + 1;
      }
      cursor += 1;
    }
    return cursor > start + 1 ? cursor : null;
  }
  if (options.signedHeaders) {
    const match2 = /^:?[A-Za-z0-9!#$%&'*+.^_`|~-]+(?:;:?[A-Za-z0-9!#$%&'*+.^_`|~-]+)*/u.exec(
      value.slice(start)
    );
    if (!match2) {
      return null;
    }
    const end = start + match2[0].length;
    const next = value[end];
    return next === void 0 || next === "," || next === " " || next === "	" || next === "\r" || next === "\n" ? end : null;
  }
  const match = (options.awsScope ? AWS_SCOPE_VALUE_RE : AUTH_PARAM_TOKEN_RE).exec(
    value.slice(start)
  );
  return match ? start + match[0].length : null;
}
function findStructuredAuthParamRanges(value) {
  const ranges = [];
  for (const header of value.matchAll(STRUCTURED_AUTH_HEADER_RE)) {
    const scheme = (header[2] ?? "").toLowerCase();
    let cursor = (header.index ?? 0) + header[0].length;
    const rangeStart = cursor;
    let rangeEnd = cursor;
    const directParam = readAuthParamName(value, cursor);
    const directEquals = directParam ? skipAuthWhitespace(value, directParam.end) : void 0;
    if (!directParam || directEquals === void 0 || value[directEquals] !== "=" || value[directEquals + 1] === "=") {
      const firstNonWhitespace = skipAuthWhitespace(value, cursor);
      if (value[firstNonWhitespace] !== "," && !usesAuthParams(scheme)) {
        continue;
      }
      const firstParamStart = findNextAuthParamStart(value, cursor);
      if (firstParamStart === null) {
        continue;
      }
      cursor = firstParamStart;
    }
    for (; ; ) {
      const param = readAuthParamName(value, cursor);
      if (!param) {
        break;
      }
      cursor = skipAuthWhitespace(value, param.end);
      if (value[cursor] !== "=") {
        break;
      }
      cursor = skipAuthWhitespace(value, cursor + 1);
      const valueEnd = readParamValue(value, cursor, {
        awsScope: scheme.startsWith("aws4-") && param.name === "credential",
        signedHeaders: param.name === "signedheaders"
      });
      if (valueEnd === null) {
        const nextParamStart2 = findNextAuthParamStart(value, cursor);
        if (nextParamStart2 !== null) {
          cursor = nextParamStart2;
          continue;
        }
        rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, cursor));
        break;
      }
      rangeEnd = valueEnd;
      const separator = skipAuthWhitespace(value, valueEnd);
      if (value[separator] !== ",") {
        if (value[separator] !== void 0 && value[separator] !== "\r" && value[separator] !== "\n" && value[separator] !== ";" && value[separator] !== "\\" && value[separator] !== '"' && value[separator] !== "'" && value[separator] !== "}" && value[separator] !== "]") {
          const nextParamStart2 = findNextAuthParamStart(value, separator);
          if (nextParamStart2 !== null) {
            cursor = nextParamStart2;
            continue;
          }
          rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, separator));
        }
        break;
      }
      const nextParamStart = findNextAuthParamStart(value, separator + 1);
      if (nextParamStart === null) {
        break;
      }
      cursor = nextParamStart;
    }
    if (rangeEnd > rangeStart) {
      ranges.push({ start: rangeStart, end: rangeEnd });
    }
  }
  return ranges;
}
function redactStructuredAuthHeaders(value, replacement) {
  const ranges = findStructuredAuthParamRanges(value);
  if (ranges.length === 0) {
    return value;
  }
  const merged = [];
  for (const range of ranges) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) {
      previous.end = Math.max(previous.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }
  const parts = [];
  let cursor = 0;
  for (const range of merged) {
    parts.push(value.slice(cursor, range.start), replacement);
    cursor = range.end;
  }
  parts.push(value.slice(cursor));
  return parts.join("");
}
var STRUCTURED_AUTH_MARKER_PREFIX = ";__openclaw_structured_auth_redacted_";
var SECRET_PATTERNS = [
  /\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN)\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g,
  /\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN)\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g,
  /[?&](?:access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|api[-_]?key|client[-_]?secret|token|key|secret|password|pass|passwd|auth|signature|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)=([^&\s"'<>]+)/gi,
  /"(?:apiKey|token|secret|password|passwd|accessToken|refreshToken|cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token)"\s*:\s*"([^"]+)"/g,
  /(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2/gi,
  /(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2/gi,
  /--(?:api[-_]?key|hook[-_]?token|token|secret|password|passwd|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)\s+(["']?)([^\s"']+)\1/gi,
  new RegExp(
    String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bearer${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
    "gi"
  ),
  new RegExp(
    String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Basic${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
    "gi"
  ),
  new RegExp(
    String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
    "gi"
  ),
  new RegExp(
    String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}${STRUCTURED_AUTH_MARKER_PREFIX})(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
    "gi"
  ),
  new RegExp(
    String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
    "gi"
  ),
  new RegExp(
    String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))(?!${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}${STRUCTURED_AUTH_MARKER_PREFIX})(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
    "gi"
  ),
  new RegExp(CREDENTIAL_STYLE_HEADER_REDACT_PATTERN, "gi"),
  /(?:X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token)\s*[:=]\s*([^\s"',;]+)/gi,
  /\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])/g,
  /(^|[\s,;])(?:access_token|refresh_token|auth[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|token|secret|password|passwd|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)=([^\s&#]+)/gi,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----/g,
  /\b(sk-[A-Za-z0-9_-]{8,})\b/g,
  /(ghp_[A-Za-z0-9]{20,})/g,
  /(github_pat_[A-Za-z0-9_]{20,})/g,
  /(xox[baprs]-[A-Za-z0-9-]{10,})/g,
  /(xapp-[A-Za-z0-9-]{10,})/g,
  /(gsk_[A-Za-z0-9_-]{10,})/g,
  /(AIza[0-9A-Za-z\-_]{20,})/g,
  /(ya29\.[0-9A-Za-z_\-./+=]{10,})/g,
  /(1\/\/0[0-9A-Za-z_\-./+=]{10,})/g,
  /(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})/g,
  /(pplx-[A-Za-z0-9_-]{10,})/g,
  /(npm_[A-Za-z0-9]{10,})/g,
  /(AKID[A-Za-z0-9]{10,})/g,
  /(LTAI[A-Za-z0-9]{10,})/g,
  /(hf_[A-Za-z0-9]{10,})/g,
  /(r8_[A-Za-z0-9]{10,})/g,
  /\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b/g,
  /\b(\d{6,}:[A-Za-z0-9_-]{20,})\b/g
];
function resolveIntegerOption2(value, fallback, params) {
  return resolveIntegerOption(value, fallback, params);
}
var DEFAULT_MAX_SESSIONS = 5e3;
var DEFAULT_IDLE_TTL_MS = 24 * 60 * 60 * 1e3;
function createInMemorySessionStore(options = {}) {
  const maxSessions = resolveIntegerOption2(options.maxSessions, DEFAULT_MAX_SESSIONS, { min: 1 });
  const idleTtlMs = resolveIntegerOption2(options.idleTtlMs, DEFAULT_IDLE_TTL_MS, { min: 1e3 });
  const now = options.now ?? Date.now;
  const sessions = /* @__PURE__ */ new Map();
  const runIdToSessionId = /* @__PURE__ */ new Map();
  const touchSession = (session, nowMs) => {
    session.lastTouchedAt = nowMs;
  };
  const removeSession = (sessionId) => {
    const session = sessions.get(sessionId);
    if (!session) {
      return false;
    }
    if (session.activeRunId) {
      runIdToSessionId.delete(session.activeRunId);
    }
    session.abortController?.abort();
    sessions.delete(sessionId);
    return true;
  };
  const reapIdleSessions = (nowMs) => {
    const idleBefore = nowMs - idleTtlMs;
    for (const [sessionId, session] of sessions.entries()) {
      if (session.activeRunId || session.abortController) {
        continue;
      }
      if (session.lastTouchedAt > idleBefore) {
        continue;
      }
      removeSession(sessionId);
    }
  };
  const evictOldestIdleSession = () => {
    let oldestSessionId = null;
    let oldestLastTouchedAt = Number.POSITIVE_INFINITY;
    for (const [sessionId, session] of sessions.entries()) {
      if (session.activeRunId || session.abortController) {
        continue;
      }
      if (session.lastTouchedAt >= oldestLastTouchedAt) {
        continue;
      }
      oldestLastTouchedAt = session.lastTouchedAt;
      oldestSessionId = sessionId;
    }
    if (!oldestSessionId) {
      return false;
    }
    return removeSession(oldestSessionId);
  };
  const createSession = (params) => {
    const nowMs = now();
    const sessionId = params.sessionId ?? randomUUID();
    const existingSession = sessions.get(sessionId);
    if (existingSession) {
      existingSession.sessionKey = params.sessionKey;
      if ("ledgerSessionId" in params) {
        existingSession.ledgerSessionId = params.ledgerSessionId;
      }
      existingSession.cwd = params.cwd;
      touchSession(existingSession, nowMs);
      return existingSession;
    }
    reapIdleSessions(nowMs);
    if (sessions.size >= maxSessions && !evictOldestIdleSession()) {
      throw new Error(
        `ACP session limit reached (max ${maxSessions}). Close idle ACP clients and retry.`
      );
    }
    const session = {
      sessionId,
      sessionKey: params.sessionKey,
      ...params.ledgerSessionId ? { ledgerSessionId: params.ledgerSessionId } : {},
      cwd: params.cwd,
      createdAt: nowMs,
      lastTouchedAt: nowMs,
      abortController: null,
      activeRunId: null
    };
    sessions.set(sessionId, session);
    return session;
  };
  const hasSession = (sessionId) => sessions.has(sessionId);
  const getSession = (sessionId) => {
    const session = sessions.get(sessionId);
    if (session) {
      touchSession(session, now());
    }
    return session;
  };
  const getSessionByRunId = (runId) => {
    const sessionId = runIdToSessionId.get(runId);
    if (!sessionId) {
      return void 0;
    }
    const session = sessions.get(sessionId);
    if (session) {
      touchSession(session, now());
    }
    return session;
  };
  const setActiveRun = (sessionId, runId, abortController) => {
    const session = sessions.get(sessionId);
    if (!session) {
      return;
    }
    if (session.activeRunId && session.activeRunId !== runId) {
      runIdToSessionId.delete(session.activeRunId);
    }
    session.activeRunId = runId;
    session.abortController = abortController;
    runIdToSessionId.set(runId, sessionId);
    touchSession(session, now());
  };
  const clearActiveRun = (sessionId) => {
    const session = sessions.get(sessionId);
    if (!session) {
      return;
    }
    if (session.activeRunId) {
      runIdToSessionId.delete(session.activeRunId);
    }
    session.activeRunId = null;
    session.abortController = null;
    touchSession(session, now());
  };
  const cancelActiveRun = (sessionId) => {
    const session = sessions.get(sessionId);
    if (!session?.abortController) {
      return false;
    }
    session.abortController.abort();
    if (session.activeRunId) {
      runIdToSessionId.delete(session.activeRunId);
    }
    session.abortController = null;
    session.activeRunId = null;
    touchSession(session, now());
    return true;
  };
  const deleteSession = (sessionId) => removeSession(sessionId);
  const clearAllSessionsForTest = () => {
    for (const session of sessions.values()) {
      session.abortController?.abort();
    }
    sessions.clear();
    runIdToSessionId.clear();
  };
  return {
    createSession,
    hasSession,
    getSession,
    getSessionByRunId,
    setActiveRun,
    clearActiveRun,
    cancelActiveRun,
    deleteSession,
    clearAllSessionsForTest
  };
}
var defaultAcpSessionStore = createInMemorySessionStore();
var ACP_ERROR_CODES = [
  "ACP_BACKEND_MISSING",
  "ACP_BACKEND_UNAVAILABLE",
  "ACP_BACKEND_UNSUPPORTED_CONTROL",
  "ACP_DISPATCH_DISABLED",
  "ACP_INVALID_RUNTIME_OPTION",
  "ACP_SESSION_INIT_FAILED",
  "ACP_TURN_FAILED"
];
var ACP_ERROR_CODE_SET = new Set(ACP_ERROR_CODES);
var SAFE_REGEX_CACHE_MAX = 256;
var safeRegexCache = /* @__PURE__ */ new Map();
function createParseFrame() {
  return {
    lastToken: null,
    containsRepetition: false,
    hasAlternation: false,
    branchMinLength: 0,
    branchMaxLength: 0,
    altMinLength: null,
    altMaxLength: null
  };
}
function addLength(left, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return Number.POSITIVE_INFINITY;
  }
  return left + right;
}
function multiplyLength(length, factor) {
  if (!Number.isFinite(length)) {
    return factor === 0 ? 0 : Number.POSITIVE_INFINITY;
  }
  return length * factor;
}
function recordAlternative(frame) {
  if (frame.altMinLength === null || frame.altMaxLength === null) {
    frame.altMinLength = frame.branchMinLength;
    frame.altMaxLength = frame.branchMaxLength;
    return;
  }
  frame.altMinLength = Math.min(frame.altMinLength, frame.branchMinLength);
  frame.altMaxLength = Math.max(frame.altMaxLength, frame.branchMaxLength);
}
function readQuantifier(source, index) {
  const ch = source[index];
  const consumed = source[index + 1] === "?" ? 2 : 1;
  if (ch === "*") {
    return { consumed, minRepeat: 0, maxRepeat: null };
  }
  if (ch === "+") {
    return { consumed, minRepeat: 1, maxRepeat: null };
  }
  if (ch === "?") {
    return { consumed, minRepeat: 0, maxRepeat: 1 };
  }
  if (ch !== "{") {
    return null;
  }
  let i = index + 1;
  while (i < source.length && /\d/.test(source.charAt(i))) {
    i += 1;
  }
  if (i === index + 1) {
    return null;
  }
  const minRepeat = Number.parseInt(source.slice(index + 1, i), 10);
  let maxRepeat = minRepeat;
  if (source[i] === ",") {
    i += 1;
    const maxStart = i;
    while (i < source.length && /\d/.test(source.charAt(i))) {
      i += 1;
    }
    maxRepeat = i === maxStart ? null : Number.parseInt(source.slice(maxStart, i), 10);
  }
  if (source[i] !== "}") {
    return null;
  }
  i += 1;
  if (source[i] === "?") {
    i += 1;
  }
  if (maxRepeat !== null && maxRepeat < minRepeat) {
    return null;
  }
  return { consumed: i - index, minRepeat, maxRepeat };
}
function tokenizePattern(source) {
  const tokens = [];
  let inCharClass = false;
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (inCharClass) {
      if (ch === "\\") {
        i += 1;
        continue;
      }
      if (ch === "]") {
        inCharClass = false;
      }
      continue;
    }
    if (ch === "\\") {
      i += 1;
      tokens.push({ kind: "simple-token" });
      continue;
    }
    if (ch === "[") {
      inCharClass = true;
      tokens.push({ kind: "simple-token" });
      continue;
    }
    if (ch === "(") {
      tokens.push({ kind: "group-open" });
      continue;
    }
    if (ch === ")") {
      tokens.push({ kind: "group-close" });
      continue;
    }
    if (ch === "|") {
      tokens.push({ kind: "alternation" });
      continue;
    }
    const quantifier = readQuantifier(source, i);
    if (quantifier) {
      tokens.push({ kind: "quantifier", quantifier });
      i += quantifier.consumed - 1;
      continue;
    }
    tokens.push({ kind: "simple-token" });
  }
  return tokens;
}
function analyzeTokensForNestedRepetition(tokens) {
  const frames = [createParseFrame()];
  const emitToken = (token) => {
    const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
    frame.lastToken = token;
    if (token.containsRepetition) {
      frame.containsRepetition = true;
    }
    frame.branchMinLength = addLength(frame.branchMinLength, token.minLength);
    frame.branchMaxLength = addLength(frame.branchMaxLength, token.maxLength);
  };
  const emitSimpleToken = () => {
    emitToken({
      containsRepetition: false,
      hasAmbiguousAlternation: false,
      minLength: 1,
      maxLength: 1
    });
  };
  for (const token of tokens) {
    if (token.kind === "simple-token") {
      emitSimpleToken();
      continue;
    }
    if (token.kind === "group-open") {
      frames.push(createParseFrame());
      continue;
    }
    if (token.kind === "group-close") {
      if (frames.length > 1) {
        const frame2 = frames.pop();
        if (frame2.hasAlternation) {
          recordAlternative(frame2);
        }
        const groupMinLength = frame2.hasAlternation ? frame2.altMinLength ?? 0 : frame2.branchMinLength;
        const groupMaxLength = frame2.hasAlternation ? frame2.altMaxLength ?? 0 : frame2.branchMaxLength;
        emitToken({
          containsRepetition: frame2.containsRepetition,
          hasAmbiguousAlternation: frame2.hasAlternation && frame2.altMinLength !== null && frame2.altMaxLength !== null && frame2.altMinLength !== frame2.altMaxLength,
          minLength: groupMinLength,
          maxLength: groupMaxLength
        });
      }
      continue;
    }
    if (token.kind === "alternation") {
      const frame2 = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
      frame2.hasAlternation = true;
      recordAlternative(frame2);
      frame2.branchMinLength = 0;
      frame2.branchMaxLength = 0;
      frame2.lastToken = null;
      continue;
    }
    const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
    const previousToken = frame.lastToken;
    if (!previousToken) {
      continue;
    }
    if (previousToken.containsRepetition) {
      return true;
    }
    if (previousToken.hasAmbiguousAlternation && token.quantifier.maxRepeat === null) {
      return true;
    }
    const previousMinLength = previousToken.minLength;
    const previousMaxLength = previousToken.maxLength;
    previousToken.minLength = multiplyLength(previousToken.minLength, token.quantifier.minRepeat);
    previousToken.maxLength = token.quantifier.maxRepeat === null ? Number.POSITIVE_INFINITY : multiplyLength(previousToken.maxLength, token.quantifier.maxRepeat);
    previousToken.containsRepetition = true;
    frame.containsRepetition = true;
    frame.branchMinLength = frame.branchMinLength - previousMinLength + previousToken.minLength;
    const branchMaxBase = Number.isFinite(frame.branchMaxLength) && Number.isFinite(previousMaxLength) ? frame.branchMaxLength - previousMaxLength : Number.POSITIVE_INFINITY;
    frame.branchMaxLength = addLength(branchMaxBase, previousToken.maxLength);
  }
  return false;
}
function hasNestedRepetition(source) {
  return analyzeTokensForNestedRepetition(tokenizePattern(source));
}
function compileSafeRegexDetailed(source, flags = "") {
  const trimmed = source.trim();
  if (!trimmed) {
    return { regex: null, source: trimmed, flags, reason: "empty" };
  }
  const cacheKey = `${flags}::${trimmed}`;
  if (safeRegexCache.has(cacheKey)) {
    return safeRegexCache.get(cacheKey) ?? {
      regex: null,
      source: trimmed,
      flags,
      reason: "invalid-regex"
    };
  }
  let result;
  if (hasNestedRepetition(trimmed)) {
    result = { regex: null, source: trimmed, flags, reason: "unsafe-nested-repetition" };
  } else {
    try {
      result = { regex: new RegExp(trimmed, flags), source: trimmed, flags, reason: null };
    } catch {
      result = { regex: null, source: trimmed, flags, reason: "invalid-regex" };
    }
  }
  safeRegexCache.set(cacheKey, result);
  if (safeRegexCache.size > SAFE_REGEX_CACHE_MAX) {
    const oldestKey = safeRegexCache.keys().next().value;
    if (oldestKey) {
      safeRegexCache.delete(oldestKey);
    }
  }
  return result;
}
function normalizeRejectReason(result) {
  if (result.reason === null || result.reason === "empty") {
    return null;
  }
  return result.reason;
}
function compileConfigRegex(pattern, flags = "") {
  const result = compileSafeRegexDetailed(pattern, flags);
  if (result.reason === "empty") {
    return null;
  }
  return {
    regex: result.regex,
    pattern: result.source,
    flags: result.flags,
    reason: normalizeRejectReason(result)
  };
}
var REDACT_REGEX_CHUNK_THRESHOLD = 32768;
var REDACT_REGEX_CHUNK_SIZE = 16384;
function replacePatternBounded(text, pattern, replacer, options) {
  const chunkThreshold = options?.chunkThreshold ?? REDACT_REGEX_CHUNK_THRESHOLD;
  const chunkSize = options?.chunkSize ?? REDACT_REGEX_CHUNK_SIZE;
  if (chunkThreshold <= 0 || chunkSize <= 0 || text.length <= chunkThreshold) {
    return text.replace(pattern, replacer);
  }
  let output = "";
  for (let index = 0; index < text.length; index += chunkSize) {
    output += text.slice(index, index + chunkSize).replace(pattern, replacer);
  }
  return output;
}
var registeredValues = /* @__PURE__ */ new Map();
var compiledMatcher;
var firstChars = /* @__PURE__ */ new Set();
function escapeRegExp2(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function rebuildProbe() {
  firstChars = new Set([...registeredValues.keys()].map((value) => value.charAt(0)));
  compiledMatcher = void 0;
}
function redactRegisteredSecretValues(text, mask) {
  if (!text || registeredValues.size === 0) {
    return text;
  }
  let couldMatch = false;
  for (const firstChar of firstChars) {
    if (text.includes(firstChar)) {
      couldMatch = true;
      break;
    }
  }
  if (!couldMatch) {
    return text;
  }
  compiledMatcher ??= new RegExp(
    [...registeredValues.keys()].toSorted((left, right) => right.length - left.length).map(escapeRegExp2).join("|"),
    "g"
  );
  return text.replace(compiledMatcher, (value) => mask(value));
}
function resetSecretRedactionRegistryForTest() {
  registeredValues.clear();
  rebuildProbe();
}
if (process.env.VITEST || process.env.NODE_ENV === "test") {
  globalThis[/* @__PURE__ */ Symbol.for("openclaw.secretRedactionRegistryTestApi")] = { resetSecretRedactionRegistryForTest };
}
var DEFAULT_REDACT_MODE = "tools";
var DEFAULT_REDACT_MIN_LENGTH = 18;
var DEFAULT_REDACT_KEEP_START = 6;
var DEFAULT_REDACT_KEEP_END = 4;
var PAYMENT_CREDENTIAL_ENV_KEYS = String.raw`CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN`;
var PAYMENT_CREDENTIAL_QUERY_KEYS = String.raw`card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token`;
var AUTH_QUERY_KEYS = String.raw`access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|id[-_]?token|api[-_]?key|apikey|client[-_]?secret|app[-_]?secret|private[-_]?key|credential|authorization|token|key|secret|password|pass|passwd|auth|jwt|session|code|signature|x[-_]?amz[-_]?(?:signature|security[-_]?token)`;
var FORM_BODY_FIRST_PAIR_KEYS = String.raw`${AUTH_QUERY_KEYS}|app[-_]?secret|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
var STANDALONE_ASSIGNMENT_SECRET_KEYS = String.raw`access_token|refresh_token|id_token|auth[-_]?token|hook[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|private[-_]?key|authorization|jwt|token|secret|password|pass|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
var BODY_SECRET_KEYS = /* @__PURE__ */ new Set([
  "access_token",
  "auth_token",
  "hook_token",
  "refresh_token",
  "id_token",
  "token",
  "api_key",
  "apikey",
  "client_secret",
  "app_secret",
  "password",
  "pass",
  "passwd",
  "auth",
  "jwt",
  "session",
  "code",
  "signature",
  "x_amz_signature",
  "x_amz_security_token",
  "secret",
  "credential",
  "private_key",
  "authorization",
  "key",
  "card_number",
  "card_cvc",
  "card_cvv",
  "cvc",
  "cvv",
  "security_code",
  "payment_credential",
  "shared_payment_token"
]);
var FORM_BODY_KEY_INVISIBLE_CHARS = String.raw`\p{C}\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\u115F\u1160\u3164\uFFA0`;
var FORM_BODY_KEY_OBFUSCATION_RE = new RegExp(
  String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]`,
  "gu"
);
var FORM_BODY_KEY_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
var FORM_BODY_PERCENT_ESCAPE_RE = /%[0-9A-Fa-f]{2}/u;
var FORM_BODY_KEY = String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*(?:[A-Za-z_]|%[0-9A-Fa-f]{2})(?:[A-Za-z0-9_.-]|%[0-9A-Fa-f]{2}|[${FORM_BODY_KEY_INVISIBLE_CHARS}+])*`;
var FORM_BODY_VALUE = "[^&\\s<>]*";
var URL_QUERY_VALUE = "[^&#\\s<>]*";
var FORM_BODY_PAIR = String.raw`${FORM_BODY_KEY}=${FORM_BODY_VALUE}`;
var FORM_BODY_RE = new RegExp(String.raw`^${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+$`, "u");
var FORM_BODY_SUBSTRING_RE = new RegExp(
  String.raw`(^|[\s:({\[,="'` + "`" + String.raw`])(${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+)`,
  "gu"
);
var ENCODED_FORM_PAIR_RE = new RegExp(
  String.raw`(^|[\s:({\[,="'` + "`" + String.raw`&])(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})`,
  "gu"
);
var FORM_BODY_CONTEXT_SINGLE_PAIR_RE = new RegExp(
  String.raw`(\b(?:body|form(?:[-_\s]?body)?)\s*[:=]\s*(["'\x60]?))(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})(["'\x60]?)`,
  "giu"
);
var URL_QUERY_PAIR_RE = new RegExp(
  String.raw`([?&])(${FORM_BODY_KEY})=(${URL_QUERY_VALUE})`,
  "gu"
);
var SECRET_VALUE_TRAILING_DELIMITER_RE = /(["'`,;)}\]]+)$/u;
var SECRET_VALUE_SUFFIX_RE = /^["'`,;)}\]]*$/u;
var SECRET_VALUE_QUOTE_CHARS = /* @__PURE__ */ new Set(['"', "'", "`"]);
var FORM_BODY_LINE_BREAK_SPLIT_RE = /(\r\n|\r|\n)/u;
var FORM_BODY_LINE_BREAK_SEGMENT_RE = /^(?:\r\n|\r|\n)$/u;
var PAYMENT_CREDENTIAL_JSON_KEYS = String.raw`cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token`;
var STRUCTURED_SECRET_FIELD_RE = new RegExp(
  String.raw`^(?:api[-_]?key|apiKey|api[-_]?token|apiToken|bearer[-_]?token|bearerToken|token|secret|password|passwd|credential|authorization|private[-_]?key|privateKey|access[-_]?token|accessToken|refresh[-_]?token|refreshToken|id[-_]?token|idToken|auth[-_]?token|authToken|client[-_]?secret|clientSecret|app[-_]?secret|appSecret|secret[-_]?value|secretValue|raw[-_]?secret|rawSecret|secret[-_]?input|secretInput|key|key[-_]?material|keyMaterial|jwt|session|signature|cookie|set[-_]?cookie|${PAYMENT_CREDENTIAL_QUERY_KEYS}|${PAYMENT_CREDENTIAL_JSON_KEYS})$`,
  "i"
);
var STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE = /^\$WORKSPACE_DIR\/[A-Za-z0-9._/-]+\.jsonl$/u;
var STRUCTURED_APP_PASSWORD_FIELD_RE = /^(?:apple|icloud|app[-_]?specific[-_]?password|appSpecificPassword|application[-_]?password|text|content|message|error|errorMessage|detail|details|reason)$/i;
var APP_SPECIFIC_PASSWORD_RE = /\b([a-z]{4}-[a-z]{4}-[a-z]{4}-[a-z]{4})\b/g;
var BENIGN_APP_PASSWORD_WORDS = /* @__PURE__ */ new Set([
  "case",
  "claw",
  "demo",
  "file",
  "main",
  "name",
  "open",
  "path",
  "slug",
  "test"
]);
var STRUCTURED_SECRET_ENV_FIELD_RE = new RegExp(
  String.raw`^(?:(?:[A-Z0-9]+[_-])+(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD)|API[_-]?KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})$`,
  "i"
);
var ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g`;
var ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g`;
var STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN = String.raw`(^|[\s,;])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60])((?:(?!\2)[^\r\n])+)\2`;
var STANDALONE_ASSIGNMENT_REDACT_PATTERN = String.raw`(^|[\s,;])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60]?[^\s&#"'\x60<>]+)`;
var BASE64_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9])(?<!;base64,[A-Za-z0-9+/=]*)`;
var IDENTIFIER_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9_])`;
var TELEGRAM_BOT_TOKEN_REDACT_PATTERN = String.raw`\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
var TELEGRAM_TOKEN_REDACT_PATTERN = String.raw`\b(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
var HTTP_AUTH_HEADER_REDACT_PATTERNS = [
  String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
  String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
  String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
  String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
  CREDENTIAL_STYLE_HEADER_REDACT_PATTERN
];
var AUTHORIZATION_BEARER_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bearer${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
var AUTHORIZATION_BASIC_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Basic${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
var AUTHORIZATION_BOT_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bot${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
var STANDALONE_BEARER_REDACT_PATTERN = String.raw`\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])`;
var SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES = /* @__PURE__ */ new Set([
  ENV_ASSIGNMENT_REDACT_PATTERN,
  ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
  STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
  STANDALONE_ASSIGNMENT_REDACT_PATTERN
]);
var CHUNK_UNSAFE_PATTERN_SOURCES = /* @__PURE__ */ new Set([
  TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
  TELEGRAM_TOKEN_REDACT_PATTERN,
  AUTHORIZATION_BEARER_REDACT_PATTERN,
  AUTHORIZATION_BASIC_REDACT_PATTERN,
  AUTHORIZATION_BOT_REDACT_PATTERN,
  STANDALONE_BEARER_REDACT_PATTERN,
  ...HTTP_AUTH_HEADER_REDACT_PATTERNS
]);
var shellReferencePreservingPatterns = /* @__PURE__ */ new WeakSet();
var chunkUnsafePatterns = /* @__PURE__ */ new WeakSet();
var DEFAULT_REDACT_PATTERNS = [
  // ENV-style assignments. Keep this case-sensitive so diagnostics like
  // `Unrecognized key: "llm"` do not lose the actual config key.
  ENV_ASSIGNMENT_REDACT_PATTERN,
  ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
  // URL query parameters. Keep this separate from ENV-style assignments so
  // lower-case URL secrets stay redacted without hiding config-key diagnostics.
  String.raw`/[?&](?:${AUTH_QUERY_KEYS}|${PAYMENT_CREDENTIAL_QUERY_KEYS})=([^&#\s<>]+)/gi`,
  // JSON fields.
  String.raw`"(?:apiKey|api_key|apiToken|api_token|bearerToken|bearer_token|token|secret|password|passwd|credential|authorization|accessToken|access_token|refreshToken|refresh_token|idToken|id_token|authToken|auth_token|clientSecret|client_secret|privateKey|private_key|secret_value|raw_secret|secret_input|key_material|${PAYMENT_CREDENTIAL_JSON_KEYS})"\s*:\s*"([^"]+)"`,
  // HTTP client diagnostics often stringify request config objects using
  // JSON or util.inspect-style fields rather than env/CLI syntax.
  String.raw`(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|id[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret|private[-_]key|credential|authorization|secret[-_]value|raw[-_]secret|secret[-_]input|key[-_]material)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,
  String.raw`(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,
  // CLI flags.
  String.raw`--(?:api[-_]?key|hook[-_]?token|access[-_]?token|refresh[-_]?token|id[-_]?token|token|secret|password|passwd|credential|private[-_]?key|client[-_]?secret|${PAYMENT_CREDENTIAL_QUERY_KEYS})\s+(?!(?:or|and)\b(?=\s+--))(["']?)([^\s"']+)\1`,
  // Authorization headers.
  AUTHORIZATION_BEARER_REDACT_PATTERN,
  AUTHORIZATION_BASIC_REDACT_PATTERN,
  AUTHORIZATION_BOT_REDACT_PATTERN,
  ...HTTP_AUTH_HEADER_REDACT_PATTERNS,
  String.raw`(?:X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token)\s*[:=]\s*([^\s"',;]+)`,
  STANDALONE_BEARER_REDACT_PATTERN,
  // URL userinfo and common connection-string password slots.
  String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`,
  String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`,
  // First pair in form-urlencoded bodies embedded in larger log lines.
  String.raw`(^|[\s,;])(?:${FORM_BODY_FIRST_PAIR_KEYS})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`,
  // Standalone token assignments in CLI or HTTP diagnostics. URL query params
  // are handled above so non-secret params survive and long values stay hinted.
  STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
  STANDALONE_ASSIGNMENT_REDACT_PATTERN,
  // PEM blocks.
  String.raw`-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----`,
  // Common token prefixes.
  String.raw`\b(sk-[A-Za-z0-9_-]{8,})\b`,
  String.raw`(ghp_[A-Za-z0-9]{10,})`,
  String.raw`(github_pat_[A-Za-z0-9_]{10,})`,
  String.raw`(gho_[A-Za-z0-9]{10,})`,
  String.raw`(ghu_[A-Za-z0-9]{10,})`,
  String.raw`(ghs_[A-Za-z0-9]{10,})`,
  String.raw`(ghr_[A-Za-z0-9]{10,})`,
  String.raw`(glpat-[A-Za-z0-9._=\-]{20,})`,
  String.raw`(gloas-[A-Fa-f0-9]{32,})`,
  String.raw`(xox[baprs]-[A-Za-z0-9-]{10,})`,
  String.raw`(xapp-[A-Za-z0-9-]{10,})`,
  String.raw`(https:\/\/hooks\.slack\.com\/(?:services\/T[A-Z0-9]+\/B[A-Z0-9]+|workflows\/T[A-Z0-9]+\/A[A-Z0-9]+\/[0-9]{17,19})\/[A-Za-z0-9]{20,})`,
  String.raw`(https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]{17,20}\/[A-Za-z0-9_-]{60,})`,
  String.raw`discord(?:.|\n|\r){0,40}?\b([A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27})\b`,
  String.raw`(gsk_[A-Za-z0-9_-]{10,})`,
  String.raw`(AIza[0-9A-Za-z\-_]{20,})`,
  String.raw`(ya29\.[0-9A-Za-z_\-./+=]{10,})`,
  String.raw`(1//0[0-9A-Za-z_\-./+=]{10,})`,
  String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
  String.raw`(pplx-[A-Za-z0-9_-]{10,})`,
  String.raw`(fal_[A-Za-z0-9_-]{10,})`,
  String.raw`(fc-[A-Za-z0-9]{10,})`,
  String.raw`(bb_live_[A-Za-z0-9_-]{10,})`,
  // Prefixes made only of standard-base64 characters need a non-base64 left boundary so they
  // do not fire inside unrelated base64 blobs (e.g. data-URL media), corrupting the payload.
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(gAAAA[A-Za-z0-9_=-]{20,})`,
  String.raw`(sk_live_[A-Za-z0-9]{10,})`,
  String.raw`(sk_test_[A-Za-z0-9]{10,})`,
  String.raw`(rk_live_[A-Za-z0-9]{10,})`,
  String.raw`(SG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
  String.raw`(npm_[A-Za-z0-9]{10,})`,
  String.raw`(pypi-[A-Za-z0-9_-]{10,})`,
  String.raw`(dop_v1_[A-Za-z0-9]{10,})`,
  String.raw`(doo_v1_[A-Za-z0-9]{10,})`,
  String.raw`(dor_v1_[A-Za-z0-9]{10,})`,
  String.raw`(dp\.(?:ct|pt|sa|scim|audit)\.[A-Za-z0-9]{40,44})`,
  String.raw`(dp\.st\.[A-Za-z0-9]{40,44})`,
  String.raw`(dp\.st\.[a-z0-9_-]{2,35}\.[A-Za-z0-9]{40,44})`,
  String.raw`(dckr_(?:pat|oat)_[A-Za-z0-9_-]{27,32})`,
  String.raw`(bkua_[a-z0-9]{40})`,
  String.raw`(CCIPAT_[A-Za-z0-9]{22}_[A-Fa-f0-9]{40})`,
  String.raw`(sbp_[a-z0-9]{40})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(dapi[0-9a-f]{32}(?:-\d)?)`,
  String.raw`(dd[pw]_[A-Za-z0-9]{36})`,
  String.raw`(glsa_[A-Za-z0-9_]{41})`,
  String.raw`(glc_eyJ[A-Za-z0-9+/=]{60,160})`,
  String.raw`(nfp_[A-Za-z0-9_]{36})`,
  String.raw`(CFPAT-[A-Za-z0-9_\-]{40,})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATBB[A-Za-z0-9_=.-]{16,})`,
  String.raw`(BBDC-[A-Za-z0-9+/@_-]{40,50})`,
  String.raw`(HRKU-AA[A-Za-z0-9_-]{20,})`,
  String.raw`(pat-(?:eu|na)1-[A-Za-z0-9]{8}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{12})`,
  String.raw`(apify_api_[A-Za-z0-9\-]{20,})`,
  String.raw`(FlyV1 fm\d+_[A-Za-z0-9+/=,_-]{100,})`,
  String.raw`(fio-u-[A-Za-z0-9_-]{40,})`,
  String.raw`(^|[^A-Za-z0-9_])(am_[A-Za-z0-9_-]{10,})`,
  String.raw`(^|[^A-Za-z0-9_])(sk_[A-Za-z0-9_]{10,})`,
  String.raw`(tvly-[A-Za-z0-9]{10,})`,
  String.raw`(exa_[A-Za-z0-9]{10,})`,
  String.raw`(syt_[A-Za-z0-9]{10,})`,
  String.raw`(retaindb_[A-Za-z0-9]{10,})`,
  String.raw`(hsk-[A-Za-z0-9]{10,})`,
  String.raw`(mem0_[A-Za-z0-9]{10,})`,
  String.raw`(brv_[A-Za-z0-9]{10,})`,
  String.raw`(xai-[A-Za-z0-9]{30,})`,
  String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw-[A-Za-z0-9]{30,})`,
  String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw_[A-Za-z0-9]{30,})`,
  String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fpk_[A-Za-z0-9]{30,})`,
  // Additional access-key and token-style prefixes.
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(AKIA[A-Z0-9]{16})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ASIA[A-Z0-9]{16})`,
  String.raw`(AKID[A-Za-z0-9]{10,})`,
  String.raw`(LTAI[A-Za-z0-9]{10,})`,
  String.raw`(hf_[A-Za-z0-9]{10,})`,
  String.raw`(api_org_[A-Za-z0-9]{20,})`,
  String.raw`(r8_[A-Za-z0-9]{10,})`,
  // Telegram Bot API URLs embed the token as `/bot<token>/...` (no word-boundary before digits).
  TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
  TELEGRAM_TOKEN_REDACT_PATTERN
];
var defaultResolvedPatterns;
var DEFAULT_REDACT_PREFILTER_SOURCES = [
  // Sensitive key names shared by the env/JSON/query/form/header/assignment families.
  String.raw`KEY|TOKEN|SECRET|PASSWORD|PASSWD|AUTH|COOKIE|SIGNATURE|CREDENTIAL|CARD|CVC|CVV|PAYMENT|PRIVATE KEY`,
  String.raw`security[-_]?code|\bpass=|jwt=|session=|code=`,
  String.raw`\bBearer\s+`,
  // URL userinfo and connection-string password slots (`scheme://user:pass@host`).
  String.raw`:\/\/[^\/\s:@]*:[^\/\s@]+@`,
  // Vendor token prefixes and webhook hosts, ordered like DEFAULT_REDACT_PATTERNS.
  String.raw`sk-|gh[opsur]_|github_pat_|glpat-|gloas-|xox[baprs]-|xapp-|hooks\.slack\.com|discord|gsk_|AIza|ya29\.|1\/\/0|eyJ|pplx-|fal_|fc-|bb_live_|gAAAA|[sr]k_(?:live|test)_|\bSG\.|npm_|pypi-|do[opr]_v1_|dp\.(?:ct|pt|sa|st|scim|audit)\.|dckr_|bkua_|CCIPAT_|sbp_|dapi[0-9a-f]|dd[pw]_|glsa_|nfp_|CFPAT-|ATCTT3|ATATT|ATBB|BBDC-|HRKU-|pat-(?:eu|na)1-|apify_api_|FlyV1|fio-u-|tvly-|exa_|syt_|retaindb_|mem0_|brv_|xai-|fw-|fw_|fpk_`,
  String.raw`(?:^|[^A-Za-z0-9_])(?:am_|sk_)`,
  String.raw`A[KS]IA[A-Z0-9]|AKID|LTAI|hf_|api_org_|r8_`,
  String.raw`\bbot\d{6,}:|\b\d{6,}:[A-Za-z0-9_-]{20,}`,
  // Obfuscated form/URL keys: percent escapes can rewrite any key letter, while plus or
  // invisible splices break the literal key-name triggers above mid-word. After a splice the
  // tail may mix further splices with key characters (e.g. an interior plus a trailing
  // filler), but at least one key character must follow a splice so bare `+=` or line-leading
  // `===` separators do not trip the fast path.
  String.raw`%[0-9A-Fa-f]{2}[A-Za-z0-9_%.-]*=`,
  String.raw`(?:\+|[${FORM_BODY_KEY_INVISIBLE_CHARS}])(?:[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*[A-Za-z0-9_%.-])+[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*=`
];
var DEFAULT_REDACT_PREFILTER_RE = new RegExp(
  `(?:${DEFAULT_REDACT_PREFILTER_SOURCES.join("|")})`,
  "iu"
);
function normalizeMode(value) {
  return value === "off" ? "off" : DEFAULT_REDACT_MODE;
}
function parsePattern(raw) {
  let pattern = null;
  if (raw instanceof RegExp) {
    if (raw.flags.includes("g")) {
      pattern = raw;
    } else {
      pattern = new RegExp(raw.source, `${raw.flags}g`);
    }
  } else if (raw.trim()) {
    const match = raw.match(/^\/(.+)\/([gimsuy]*)$/);
    if (match) {
      const flags = expectDefined(match[2], "redact regex capture 2").includes("g") ? match[2] : `${match[2]}g`;
      pattern = compileConfigRegex(expectDefined(match[1], "redact regex capture 1"), flags)?.regex ?? null;
    } else {
      pattern = compileConfigRegex(raw, "gi")?.regex ?? null;
    }
  }
  if (pattern && typeof raw === "string" && SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES.has(raw)) {
    shellReferencePreservingPatterns.add(pattern);
  }
  if (pattern && typeof raw === "string" && (raw.startsWith(BASE64_SAFE_TOKEN_BOUNDARY) || raw.startsWith(IDENTIFIER_SAFE_TOKEN_BOUNDARY) || CHUNK_UNSAFE_PATTERN_SOURCES.has(raw))) {
    chunkUnsafePatterns.add(pattern);
  }
  return pattern;
}
function resolvePatterns(value) {
  if (!value?.length) {
    defaultResolvedPatterns ??= DEFAULT_REDACT_PATTERNS.map(parsePattern).filter(
      (re) => Boolean(re)
    );
    return defaultResolvedPatterns;
  }
  return value.map(parsePattern).filter((re) => Boolean(re));
}
function includesDefaultRedactPatterns(value) {
  if (!value?.length) {
    return true;
  }
  const source = new Set(value.filter((pattern) => typeof pattern === "string"));
  return DEFAULT_REDACT_PATTERNS.every((pattern) => source.has(pattern));
}
function maskToken(token) {
  if (token === "***") {
    return token;
  }
  if (token.length < DEFAULT_REDACT_MIN_LENGTH) {
    return "***";
  }
  const start = sliceUtf16Safe(token, 0, DEFAULT_REDACT_KEEP_START);
  const end = sliceUtf16Safe(token, -DEFAULT_REDACT_KEEP_END);
  return `${start}\u2026${end}`;
}
function splitSecretValueForMask(token) {
  const openingQuote = token[0] ?? "";
  if (SECRET_VALUE_QUOTE_CHARS.has(openingQuote)) {
    const closingQuoteIndex = token.lastIndexOf(openingQuote);
    if (closingQuoteIndex > 0) {
      const suffix = token.slice(closingQuoteIndex + 1);
      if (SECRET_VALUE_SUFFIX_RE.test(suffix)) {
        return {
          maskable: token.slice(1, closingQuoteIndex),
          suffix,
          maskStart: 0,
          maskEnd: closingQuoteIndex + 1
        };
      }
    }
    const tokenWithoutLeadingQuote = token.slice(1);
    const trailingDelimiter2 = tokenWithoutLeadingQuote.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
    const maskable2 = trailingDelimiter2 && trailingDelimiter2.length < tokenWithoutLeadingQuote.length ? tokenWithoutLeadingQuote.slice(0, -trailingDelimiter2.length) : tokenWithoutLeadingQuote;
    return {
      maskable: maskable2,
      suffix: trailingDelimiter2 && trailingDelimiter2.length < tokenWithoutLeadingQuote.length ? trailingDelimiter2 : "",
      maskStart: 0,
      maskEnd: 1 + maskable2.length
    };
  }
  const trailingDelimiter = token.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
  const maskable = trailingDelimiter && trailingDelimiter.length < token.length ? token.slice(0, -trailingDelimiter.length) : token;
  return {
    maskable,
    suffix: maskable === token ? "" : trailingDelimiter,
    maskStart: 0,
    maskEnd: maskable.length
  };
}
function maskSecretValue(token, options) {
  const { maskable, suffix } = splitSecretValueForMask(token);
  return `${options?.hinted ? maskToken(maskable) : "***"}${suffix}`;
}
function normalizeSensitiveKeyName(value) {
  const stripped = value.replace(FORM_BODY_KEY_SEPARATOR_RE, "");
  try {
    return decodeURIComponent(stripped).replace(FORM_BODY_KEY_SEPARATOR_RE, "").toLowerCase().replaceAll("-", "_");
  } catch {
    return stripped.toLowerCase().replaceAll("-", "_");
  }
}
function isSensitiveBodyKey(key) {
  return BODY_SECRET_KEYS.has(normalizeSensitiveKeyName(key));
}
function hasEncodedOrInvisibleFormKey(key) {
  return FORM_BODY_PERCENT_ESCAPE_RE.test(key) || key.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") !== key;
}
function redactFormEncodedPairs(value, options) {
  return value.split("&").map((pair) => {
    const equalsIndex = pair.indexOf("=");
    if (equalsIndex < 0) {
      return pair;
    }
    const key = pair.slice(0, equalsIndex);
    if (options?.onlyEncodedOrInvisibleKeys && !hasEncodedOrInvisibleFormKey(key)) {
      return pair;
    }
    if (!isSensitiveBodyKey(key)) {
      return pair;
    }
    const token = pair.slice(equalsIndex + 1);
    const masked = maskSecretValue(token, { hinted: options?.maskValues === "hinted" });
    return `${key}=${masked}`;
  }).join("&");
}
function redactUrlQueryPairs(text) {
  if (!text || !text.includes("?")) {
    return text;
  }
  return text.replace(URL_QUERY_PAIR_RE, (match, prefix, key, token) => {
    if (!hasEncodedOrInvisibleFormKey(key) || !isSensitiveBodyKey(key)) {
      return match;
    }
    return `${prefix}${key}=${maskSecretValue(token, { hinted: true })}`;
  });
}
function redactEncodedFormPairs(text) {
  if (!text || !text.includes("%") && text.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") === text) {
    return text;
  }
  return text.replace(ENCODED_FORM_PAIR_RE, (match, prefix, key, token) => {
    if (!hasEncodedOrInvisibleFormKey(key) || !isSensitiveBodyKey(key)) {
      return match;
    }
    return `${prefix}${key}=${maskSecretValue(token)}`;
  });
}
function redactFormBodyContextSinglePairs(text) {
  if (!text || !/[=:]/u.test(text)) {
    return text;
  }
  return text.replace(
    FORM_BODY_CONTEXT_SINGLE_PAIR_RE,
    (match, prefix, _quote, key, token, suffix) => {
      if (!isSensitiveBodyKey(key)) {
        return match;
      }
      return `${prefix}${key}=${maskSecretValue(token)}${suffix}`;
    }
  );
}
function redactFormBodyLine(text) {
  if (!text) {
    return text;
  }
  const contextRedacted = redactFormBodyContextSinglePairs(redactEncodedFormPairs(text));
  if (!contextRedacted.includes("&")) {
    return contextRedacted;
  }
  if (FORM_BODY_RE.test(contextRedacted)) {
    return redactFormEncodedPairs(contextRedacted);
  }
  const redacted = contextRedacted.replace(
    FORM_BODY_SUBSTRING_RE,
    (match, prefix, body) => {
      const redactedBody = redactFormEncodedPairs(body);
      return redactedBody === body ? match : `${prefix}${redactedBody}`;
    }
  );
  return redactFormBodyContextSinglePairs(redactEncodedFormPairs(redacted));
}
function redactFormBody(text) {
  if (!text) {
    return text;
  }
  if (FORM_BODY_LINE_BREAK_SPLIT_RE.test(text)) {
    return text.split(FORM_BODY_LINE_BREAK_SPLIT_RE).map(
      (segment) => FORM_BODY_LINE_BREAK_SEGMENT_RE.test(segment) ? segment : redactFormBodyLine(segment)
    ).join("");
  }
  return redactFormBodyLine(text);
}
function redactPemBlock(block) {
  const lines = block.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    return "***";
  }
  return `${lines[0]}
\u2026redacted\u2026
${lines[lines.length - 1]}`;
}
function isShellReferenceToKey(key, value) {
  if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) {
    return false;
  }
  const bare = value.match(/^\$([A-Z_][A-Z0-9_]*)$/);
  if (bare) {
    return bare[1] === key;
  }
  const braced = value.match(/^\$\{([A-Z_][A-Z0-9_]*)(?::[-=?+])?\}$/);
  return braced?.[1] === key;
}
function readEnvAssignmentKey(match) {
  return match.match(/\b([A-Z_][A-Z0-9_]*)\b\s*[=:]/)?.[1];
}
function shouldPreserveShellReferenceMatch(match, token) {
  const key = readEnvAssignmentKey(match);
  return key ? isShellReferenceToKey(key, token) : false;
}
function isEmptyShellParameterExpansionTail(token) {
  return /^[-=?+]\}$/.test(token);
}
function hasBackreferenceToGroup(pattern, groupNumber) {
  return new RegExp(String.raw`\\${groupNumber}(?!\d)`).test(pattern.source);
}
function selectSecretCapture(match, groups) {
  const tokens = groups.map((value, index) => ({ index, value })).filter(({ value }) => typeof value === "string" && value.length > 0);
  const selected = (tokens.length > 1 ? tokens[tokens.length - 1] : tokens[0]) ?? {
    index: -1,
    value: match
  };
  return {
    ...selected,
    captureCount: tokens.length
  };
}
function getIndexedCaptureStart(pattern, input, match, matchOffset, captureIndex) {
  if (matchOffset < 0 || !input) {
    return null;
  }
  try {
    const flags = pattern.flags.includes("d") ? pattern.flags : `${pattern.flags}d`;
    const indexedPattern = new RegExp(pattern.source, flags);
    indexedPattern.lastIndex = matchOffset;
    const indexedMatch = indexedPattern.exec(input);
    const captureIndices = indexedMatch?.indices?.[captureIndex + 1];
    if (!indexedMatch || indexedMatch.index !== matchOffset || indexedMatch[0] !== match) {
      return null;
    }
    if (!captureIndices) {
      return null;
    }
    return captureIndices[0] - matchOffset;
  } catch {
    return null;
  }
}
function getSecretCaptureStart(pattern, input, match, matchOffset, selected) {
  const indexedTokenStart = getIndexedCaptureStart(
    pattern,
    input,
    match,
    matchOffset,
    selected.index
  );
  const preferFirstCapture = selected.captureCount === 1 && selected.index >= 0 && hasBackreferenceToGroup(pattern, selected.index + 1);
  return indexedTokenStart ?? (preferFirstCapture ? match.indexOf(selected.value) : match.lastIndexOf(selected.value));
}
function redactMatch(match, groups, pattern, context) {
  if (match.includes("PRIVATE KEY-----")) {
    return redactPemBlock(match);
  }
  const selected = selectSecretCapture(match, groups);
  const token = selected.value;
  if (splitSecretValueForMask(token).maskable === "***") {
    return match;
  }
  const isShellReferencePattern = shellReferencePreservingPatterns.has(pattern);
  if (isShellReferencePattern && (shouldPreserveShellReferenceMatch(match, token) || isEmptyShellParameterExpansionTail(token))) {
    return match;
  }
  const masked = isShellReferencePattern ? maskToken(token) : maskSecretValue(token, { hinted: true });
  if (token === match) {
    return masked;
  }
  const tokenIndex = getSecretCaptureStart(
    pattern,
    context?.input ?? "",
    match,
    context?.offset ?? -1,
    selected
  );
  if (tokenIndex < 0) {
    return match;
  }
  return `${match.slice(0, tokenIndex)}${masked}${match.slice(tokenIndex + token.length)}`;
}
function redactText(text, patterns, options) {
  let next = text;
  if (options?.redactStructuredAuthHeaders) {
    next = redactStructuredAuthHeaders(next, "***");
  }
  if (options?.redactFormBodies) {
    next = redactUrlQueryPairs(next);
    next = redactFormBody(next);
  }
  for (const pattern of patterns) {
    const replacer = (...args) => {
      const hasNamedGroups = args.length > 0 && typeof args[args.length - 1] === "object" && args[args.length - 1] !== null;
      const inputIndex = hasNamedGroups ? args.length - 2 : args.length - 1;
      const offsetIndex = inputIndex - 1;
      const match = typeof args[0] === "string" ? args[0] : "";
      const groups = args.slice(1, offsetIndex).map((value) => typeof value === "string" ? value : "");
      const offset = typeof args[offsetIndex] === "number" ? args[offsetIndex] : -1;
      const input = typeof args[inputIndex] === "string" ? args[inputIndex] : "";
      return redactMatch(match, groups, pattern, { input, offset });
    };
    next = options?.fullContext || chunkUnsafePatterns.has(pattern) ? next.replace(pattern, replacer) : replacePatternBounded(next, pattern, replacer);
  }
  return next;
}
function couldMatchDefaultRedactPatterns(text) {
  return DEFAULT_REDACT_PREFILTER_RE.test(text);
}
function looksLikeAppSpecificPassword(candidate) {
  return candidate.split("-").every((part) => !BENIGN_APP_PASSWORD_WORDS.has(part.toLowerCase()));
}
function redactAppSpecificPasswords(text) {
  return replacePatternBounded(
    text,
    APP_SPECIFIC_PASSWORD_RE,
    (match, token) => looksLikeAppSpecificPassword(token) ? redactMatch(match, [token], APP_SPECIFIC_PASSWORD_RE) : match
  );
}
function resolveConfigRedaction() {
  const cfg = readLoggingConfig();
  return {
    mode: normalizeMode(cfg?.redactSensitive),
    patterns: cfg?.redactPatterns
  };
}
function resolveRedactOptions(options) {
  const resolved = options ?? resolveConfigRedaction();
  const mode = normalizeMode(resolved.mode);
  if (mode === "off") {
    return {
      mode,
      patterns: [],
      redactFormBodies: false
    };
  }
  const patterns = resolvePatterns(resolved.patterns);
  const includesDefaults = patterns.length > 0 && includesDefaultRedactPatterns(resolved.patterns);
  return {
    mode,
    patterns,
    redactFormBodies: includesDefaults,
    redactStructuredAuthHeaders: includesDefaults
  };
}
function redactSensitiveText2(text, options) {
  if (!text) {
    return text;
  }
  const exactRedacted = redactRegisteredSecretValues(text, maskToken);
  const resolvedOptions = options ?? resolveConfigRedaction();
  if (normalizeMode(resolvedOptions.mode) === "off") {
    return exactRedacted;
  }
  if (!resolvedOptions.patterns?.length && !couldMatchDefaultRedactPatterns(exactRedacted)) {
    return exactRedacted;
  }
  const resolved = resolveRedactOptions(resolvedOptions);
  if (!resolved.patterns.length) {
    return exactRedacted;
  }
  return redactText(exactRedacted, resolved.patterns, {
    redactFormBodies: resolved.redactFormBodies,
    redactStructuredAuthHeaders: resolved.redactStructuredAuthHeaders
  });
}
function resolveToolPayloadRedaction(loggingConfig = readLoggingConfig()) {
  const userPatterns = loggingConfig?.redactPatterns;
  const patterns = userPatterns && userPatterns.length > 0 ? [...userPatterns, ...DEFAULT_REDACT_PATTERNS] : void 0;
  return { mode: "tools", patterns };
}
function isSensitiveFieldKey(key) {
  return STRUCTURED_SECRET_FIELD_RE.test(key) || STRUCTURED_SECRET_ENV_FIELD_RE.test(key);
}
function redactSensitiveFieldValueWithOptions(key, value, options, path10 = [key]) {
  const exactRedacted = redactRegisteredSecretValues(value, maskToken);
  const resolved = resolveRedactOptions(options);
  if (resolved.mode === "off") {
    return exactRedacted;
  }
  const redacted = redactText(exactRedacted, resolved.patterns, {
    redactFormBodies: resolved.redactFormBodies,
    redactStructuredAuthHeaders: resolved.redactStructuredAuthHeaders
  });
  const shouldRedactAppPassword = redacted !== value || STRUCTURED_APP_PASSWORD_FIELD_RE.test(key);
  if (shouldRedactAppPassword) {
    const appRedacted = redactAppSpecificPasswords(redacted);
    if (appRedacted !== value) {
      return appRedacted;
    }
  }
  if (redacted !== value) {
    return redacted;
  }
  const normalizedStructuredKey = key.toLowerCase();
  if (shouldRedactStructuredAuthorizationCode(normalizedStructuredKey, path10)) {
    return maskToken(value);
  }
  if (normalizedStructuredKey === "session" && STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE.test(exactRedacted)) {
    return exactRedacted;
  }
  if (isSensitiveFieldKey(key)) {
    if (isShellReferenceToKey(key, exactRedacted)) {
      return exactRedacted;
    }
    return maskToken(exactRedacted);
  }
  return exactRedacted;
}
function pathEndsWith(path10, suffix) {
  if (path10.length < suffix.length) {
    return false;
  }
  return suffix.every((part, index) => path10[path10.length - suffix.length + index] === part);
}
function shouldRedactStructuredAuthorizationCode(normalizedKey, path10) {
  if (normalizedKey !== "code") {
    return false;
  }
  const normalizedPath = path10.map((part) => part.toLowerCase());
  if (normalizedPath.length === 1 || pathEndsWith(normalizedPath, ["error", "code"]) || pathEndsWith(normalizedPath, ["nodeerror", "code"]) || pathEndsWith(normalizedPath, ["status", "code"]) || pathEndsWith(normalizedPath, ["details", "code"]) || pathEndsWith(normalizedPath, ["warnings", "code"])) {
    return false;
  }
  return true;
}
function shouldRedactStructuredPrimitiveField(key, path10) {
  const normalizedKey = key.toLowerCase();
  return shouldRedactStructuredAuthorizationCode(normalizedKey, path10) || isSensitiveFieldKey(key);
}
function isPlainRedactableObject(value) {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function redactStructuredSecretValue(key, value, seen, options, path10 = key ? [key] : []) {
  if (typeof value === "string") {
    return redactSensitiveFieldValueWithOptions(key, value, options, path10);
  }
  if (value === null || value === void 0) {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return shouldRedactStructuredPrimitiveField(key, path10) ? "***" : value;
  }
  if (Array.isArray(value)) {
    if (seen.has(value)) {
      return "[Circular]";
    }
    seen.add(value);
    const out = value.map((entry) => redactStructuredSecretValue(key, entry, seen, options, path10));
    seen.delete(value);
    return out;
  }
  if (typeof value === "object") {
    if (seen.has(value)) {
      return "[Circular]";
    }
    if (!isPlainRedactableObject(value)) {
      return value;
    }
    seen.add(value);
    const out = {};
    for (const [nestedKey, nestedValue] of Object.entries(value)) {
      out[nestedKey] = redactStructuredSecretValue(nestedKey, nestedValue, seen, options, [
        ...path10,
        nestedKey
      ]);
    }
    seen.delete(value);
    return out;
  }
  return value;
}
function redactSecrets(value) {
  const options = resolveToolPayloadRedaction();
  if (typeof value === "string") {
    return redactSensitiveText2(value, options);
  }
  if (value === null || value === void 0) {
    return value;
  }
  if (typeof value !== "object") {
    return value;
  }
  return redactStructuredSecretValue("", value, /* @__PURE__ */ new WeakSet(), options);
}
var validTimeZoneCache = /* @__PURE__ */ new Map();
var timestampFormatterCache = /* @__PURE__ */ new Map();
var hostTimeZone;
function isValidTimeZone(tz) {
  const cached = validTimeZoneCache.get(tz);
  if (cached !== void 0) {
    return cached;
  }
  let valid;
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz }).format();
    valid = true;
  } catch {
    valid = false;
  }
  validTimeZoneCache.set(tz, valid);
  return valid;
}
function resolveEffectiveTimeZone(timeZone) {
  const explicit = timeZone ?? process.env.TZ;
  return explicit && isValidTimeZone(explicit) ? explicit : hostTimeZone ??= Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function formatOffset(offsetRaw) {
  return offsetRaw === "GMT" ? "+00:00" : offsetRaw.slice(3);
}
function getTimestampParts(date, timeZone) {
  const effectiveTimeZone = resolveEffectiveTimeZone(timeZone);
  let fmt = timestampFormatterCache.get(effectiveTimeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en", {
      timeZone: effectiveTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      fractionalSecondDigits: 3,
      timeZoneName: "longOffset"
    });
    timestampFormatterCache.set(effectiveTimeZone, fmt);
  }
  const parts = Object.fromEntries(fmt.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
    fractionalSecond: parts.fractionalSecond,
    offset: formatOffset(parts.timeZoneName ?? "GMT")
  };
}
function formatTimestamp(date, options) {
  const style = options?.style ?? "medium";
  const parts = getTimestampParts(date, options?.timeZone);
  switch (style) {
    case "short":
      return `${parts.hour}:${parts.minute}:${parts.second}${parts.offset}`;
    case "medium":
      return `${parts.hour}:${parts.minute}:${parts.second}.${parts.fractionalSecond}${parts.offset}`;
    case "long":
      return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.${parts.fractionalSecond}${parts.offset}`;
  }
  throw new Error("Unsupported timestamp style");
}
function resolveDefaultLogDir() {
  return canUseNodeFs() ? resolvePreferredOpenClawTmpDir() : POSIX_OPENCLAW_TMP_DIR;
}
function resolveDefaultLogFile(defaultLogDir) {
  return canUseNodeFs() ? path6.join(defaultLogDir, "openclaw.log") : `${POSIX_OPENCLAW_TMP_DIR}/openclaw.log`;
}
var DEFAULT_LOG_DIR = resolveDefaultLogDir();
var DEFAULT_LOG_FILE = resolveDefaultLogFile(DEFAULT_LOG_DIR);
var MAX_LOG_AGE_MS = 24 * 60 * 60 * 1e3;
var DEFAULT_MAX_LOG_FILE_BYTES = 100 * 1024 * 1024;
var MAX_ROTATED_LOG_FILES = 5;
var MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS = 8 * 1024;
var MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS = 4 * 1024;
var loadLoggerConfigDefault = () => readLoggingConfig();
var loadLoggerConfig = loadLoggerConfigDefault;
var MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT = 32;
var MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS = 2 * 1024;
var MAX_DIAGNOSTIC_LOG_NAME_CHARS = 120;
var MAX_FILE_LOG_MESSAGE_CHARS = 4 * 1024;
var MAX_FILE_LOG_CONTEXT_VALUE_CHARS = 512;
var DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE = /^[A-Za-z0-9_.:-]{1,64}$/u;
var defaultHostnameResolver = () => os4.hostname();
var hostnameResolver = defaultHostnameResolver;
var cachedHostname = null;
function clampDiagnosticLogText(value, maxChars) {
  return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function sanitizeDiagnosticLogText(value, maxChars) {
  return clampDiagnosticLogText(
    redactSensitiveText2(clampDiagnosticLogText(value, maxChars)),
    maxChars
  );
}
function normalizeDiagnosticLogName(value) {
  if (!value || value.trim().startsWith("{")) {
    return void 0;
  }
  const sanitized = sanitizeDiagnosticLogText(value.trim(), MAX_DIAGNOSTIC_LOG_NAME_CHARS);
  return DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(sanitized) ? sanitized : void 0;
}
function assignDiagnosticLogAttribute(attributes, state, key, value) {
  if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) {
    return;
  }
  const normalizedKey = key.trim();
  if (isBlockedObjectKey(normalizedKey)) {
    return;
  }
  if (redactSensitiveText2(normalizedKey) !== normalizedKey) {
    return;
  }
  if (!DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(normalizedKey)) {
    return;
  }
  if (typeof value === "string") {
    attributes[normalizedKey] = sanitizeDiagnosticLogText(
      value,
      MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS
    );
    state.count += 1;
    return;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    attributes[normalizedKey] = value;
    state.count += 1;
    return;
  }
  if (typeof value === "boolean") {
    attributes[normalizedKey] = value;
    state.count += 1;
  }
}
function addDiagnosticLogAttributesFrom(attributes, state, source) {
  if (!source) {
    return;
  }
  for (const key in source) {
    if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) {
      break;
    }
    if (!Object.hasOwn(source, key) || key === "trace") {
      continue;
    }
    assignDiagnosticLogAttribute(attributes, state, key, source[key]);
  }
}
function isPlainLogRecordObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function normalizeTraceContext(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return void 0;
  }
  const candidate = value;
  if (!isValidDiagnosticTraceId(candidate.traceId)) {
    return void 0;
  }
  if (candidate.spanId !== void 0 && !isValidDiagnosticSpanId(candidate.spanId)) {
    return void 0;
  }
  if (candidate.parentSpanId !== void 0 && !isValidDiagnosticSpanId(candidate.parentSpanId)) {
    return void 0;
  }
  if (candidate.traceFlags !== void 0 && !isValidDiagnosticTraceFlags(candidate.traceFlags)) {
    return void 0;
  }
  return {
    traceId: candidate.traceId,
    ...candidate.spanId ? { spanId: candidate.spanId } : {},
    ...candidate.parentSpanId ? { parentSpanId: candidate.parentSpanId } : {},
    ...candidate.traceFlags ? { traceFlags: candidate.traceFlags } : {}
  };
}
function extractTraceContext(value) {
  const direct = normalizeTraceContext(value);
  if (direct) {
    return direct;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return void 0;
  }
  return normalizeTraceContext(value.trace);
}
function getSortedNumericLogArgs(logObj) {
  return Object.entries(logObj).filter(([key]) => /^\d+$/.test(key)).toSorted((a, b) => Number(a[0]) - Number(b[0])).map(([, value]) => value);
}
function clampFileLogText(value, maxChars) {
  return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function normalizeFileLogContextValue(value) {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized ? clampFileLogText(normalized, MAX_FILE_LOG_CONTEXT_VALUE_CHARS) : void 0;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "boolean") {
    return String(value);
  }
  return void 0;
}
function readFirstContextString(sources, keys) {
  for (const source of sources) {
    if (!source) {
      continue;
    }
    for (const key of keys) {
      const value = normalizeFileLogContextValue(source[key]);
      if (value) {
        return value;
      }
    }
  }
  return void 0;
}
function stringifyFileLogMessagePart(value) {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  if (value instanceof Error) {
    return value.message || value.name;
  }
  if (isPlainLogRecordObject(value) && typeof value.message === "string") {
    return value.message;
  }
  if (value === null || value === void 0) {
    return void 0;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return void 0;
  }
}
function buildFileLogMessage(numericArgs) {
  const parts = numericArgs.map(stringifyFileLogMessagePart).filter((part) => Boolean(part && part.trim()));
  if (parts.length === 0) {
    return void 0;
  }
  return clampFileLogText(parts.join(" "), MAX_FILE_LOG_MESSAGE_CHARS);
}
function resolveLogHostname() {
  if (cachedHostname) {
    return cachedHostname;
  }
  const hostname = hostnameResolver().trim();
  if (!hostname) {
    return "unknown";
  }
  cachedHostname = hostname;
  return hostname;
}
function withResolvedLogMetaHostname(meta, hostname) {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    return meta;
  }
  return { ...meta, hostname };
}
function extractLogBindingPrefix(numericArgs) {
  if (typeof numericArgs[0] === "string" && numericArgs[0].length <= MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS && numericArgs[0].trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(numericArgs[0]);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return {
          bindings: parsed,
          args: numericArgs.slice(1)
        };
      }
    } catch {
    }
  }
  return { args: numericArgs };
}
function findLogTraceContext(bindings, numericArgs) {
  const fromBindings = extractTraceContext(bindings);
  if (fromBindings) {
    return fromBindings;
  }
  for (const arg of numericArgs) {
    const fromArg = extractTraceContext(arg);
    if (fromArg) {
      return fromArg;
    }
  }
  return void 0;
}
function resolveLogTraceContext(bindings, numericArgs) {
  const explicitTrace = findLogTraceContext(bindings, numericArgs);
  if (explicitTrace) {
    return { trace: explicitTrace, trustedTraceContext: false };
  }
  const activeTrace = getActiveDiagnosticTraceContext();
  return activeTrace ? { trace: activeTrace, trustedTraceContext: true } : { trustedTraceContext: false };
}
function buildTraceFileLogFields(logObj) {
  const { bindings, args } = extractLogBindingPrefix(getSortedNumericLogArgs(logObj));
  const { trace } = resolveLogTraceContext(bindings, args);
  if (!trace) {
    return void 0;
  }
  return {
    traceId: trace.traceId,
    ...trace.spanId ? { spanId: trace.spanId } : {},
    ...trace.parentSpanId ? { parentSpanId: trace.parentSpanId } : {},
    ...trace.traceFlags ? { traceFlags: trace.traceFlags } : {}
  };
}
function buildStructuredFileLogFields(logObj) {
  const { bindings, args } = extractLogBindingPrefix(getSortedNumericLogArgs(logObj));
  const structuredArg = isPlainLogRecordObject(args[0]) ? args[0] : void 0;
  const sources = [structuredArg, bindings, logObj];
  const messageArgs = structuredArg && typeof structuredArg.message !== "string" ? args.slice(1) : args;
  const message = buildFileLogMessage(messageArgs);
  const agentId = readFirstContextString(sources, ["agent_id", "agentId"]);
  const sessionId = readFirstContextString(sources, ["session_id", "sessionId", "sessionKey"]);
  const channel = readFirstContextString(sources, ["channel", "messageProvider"]);
  return {
    hostname: resolveLogHostname(),
    ...message ? { message } : {},
    ...agentId ? { agent_id: agentId } : {},
    ...sessionId ? { session_id: sessionId } : {},
    ...channel ? { channel } : {}
  };
}
function buildDiagnosticLogRecord(logObj) {
  const meta = logObj["_meta"];
  const { bindings, args: numericArgs } = extractLogBindingPrefix(getSortedNumericLogArgs(logObj));
  const { trace, trustedTraceContext } = resolveLogTraceContext(bindings, numericArgs);
  const structuredArg = numericArgs[0];
  const structuredBindings = isPlainLogRecordObject(structuredArg) ? structuredArg : void 0;
  if (structuredBindings) {
    numericArgs.shift();
  }
  let message = "";
  if (numericArgs.length > 0 && typeof numericArgs[numericArgs.length - 1] === "string") {
    message = sanitizeDiagnosticLogText(
      String(numericArgs.pop()),
      MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS
    );
  } else if (numericArgs.length === 1 && (typeof numericArgs[0] === "number" || typeof numericArgs[0] === "boolean")) {
    message = String(numericArgs[0]);
    numericArgs.length = 0;
  }
  if (!message) {
    message = "log";
  }
  const attributes = /* @__PURE__ */ Object.create(null);
  const attributeState = { count: 0 };
  addDiagnosticLogAttributesFrom(attributes, attributeState, bindings);
  addDiagnosticLogAttributesFrom(attributes, attributeState, structuredBindings);
  const code = {};
  if (meta?.path?.fileLine) {
    const line = Number(meta.path.fileLine);
    if (Number.isFinite(line)) {
      code.line = line;
    }
  }
  if (meta?.path?.method) {
    code.functionName = sanitizeDiagnosticLogText(meta.path.method, MAX_DIAGNOSTIC_LOG_NAME_CHARS);
  }
  const loggerName = normalizeDiagnosticLogName(meta?.name);
  const loggerParents = meta?.parentNames?.map(normalizeDiagnosticLogName).filter((name) => Boolean(name));
  return {
    event: {
      type: "log.record",
      level: meta?.logLevelName ?? "INFO",
      message,
      ...loggerName ? { loggerName } : {},
      ...loggerParents?.length ? { loggerParents } : {},
      ...Object.keys(attributes).length > 0 ? { attributes } : {},
      ...Object.keys(code).length > 0 ? { code } : {},
      ...trace ? { trace } : {}
    },
    trustedTraceContext
  };
}
function isLogRedactionDisabled() {
  return readLoggingConfig()?.redactSensitive === "off";
}
function redactLogRecordForTransport(record) {
  return isLogRedactionDisabled() ? record : redactSecrets(record);
}
function attachDiagnosticEventTransport(logger) {
  logger.attachTransport((logObj) => {
    try {
      const record = buildDiagnosticLogRecord(redactLogRecordForTransport(logObj));
      const emit = record.trustedTraceContext ? emitDiagnosticEventWithTrustedTraceContext : emitDiagnosticEvent;
      emit(record.event);
    } catch {
    }
  });
}
function canUseSilentVitestFileLogFastPath(envLevel) {
  return process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" && !envLevel && !loggingState.overrideSettings;
}
function resolveDefaultActiveLogFile() {
  if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG === "1") {
    return path6.join(
      process.cwd(),
      ".artifacts",
      "test-logs",
      `${LOG_PREFIX}-vitest-${process.pid}-${formatLocalDate(/* @__PURE__ */ new Date())}${LOG_SUFFIX}`
    );
  }
  return defaultRollingPathForToday();
}
function resolveSettings() {
  if (!canUseNodeFs()) {
    return {
      level: "silent",
      file: DEFAULT_LOG_FILE,
      maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES
    };
  }
  const envLevel = resolveEnvLogLevelOverride();
  if (canUseSilentVitestFileLogFastPath(envLevel)) {
    return {
      level: "silent",
      file: defaultRollingPathForToday(),
      maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES
    };
  }
  const cfg = loggingState.overrideSettings ?? loadLoggerConfig();
  const defaultLevel = process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" ? "silent" : "info";
  const fromConfig = normalizeLogLevel(cfg?.level, defaultLevel);
  const level = envLevel ?? fromConfig;
  const file = cfg?.file ?? resolveDefaultActiveLogFile();
  const maxFileBytes = resolveMaxLogFileBytes(cfg?.maxFileBytes);
  return { level, file, maxFileBytes };
}
function settingsChanged(a, b) {
  if (!a) {
    return true;
  }
  return a.level !== b.level || a.file !== b.file || a.maxFileBytes !== b.maxFileBytes;
}
function isFileLogLevelEnabled(level) {
  const settings = loggingState.cachedSettings ?? resolveSettings();
  if (!loggingState.cachedSettings) {
    loggingState.cachedSettings = settings;
  }
  if (level === "silent") {
    return false;
  }
  if (settings.level === "silent") {
    return false;
  }
  return levelToMinLevel(level) >= levelToMinLevel(settings.level);
}
function buildLogger(settings) {
  const logger = new TsLogger({
    name: "openclaw",
    // Custom structured redaction runs at each transport boundary; avoid tslog pre-masking divergent records.
    maskValuesOfKeys: [],
    minLevel: levelToMinLevel(settings.level),
    type: "hidden"
    // no ansi formatting
  });
  if (settings.level === "silent") {
    attachDiagnosticEventTransport(logger);
    return logger;
  }
  const rollingFile = isRollingPath(settings.file);
  let activeFile = resolveActiveLogFile(settings.file);
  fs5.mkdirSync(path6.dirname(activeFile), { recursive: true });
  if (rollingFile) {
    pruneOldRollingLogs(path6.dirname(activeFile));
  }
  let currentFileBytes = getCurrentLogFileBytes(activeFile);
  let warnedAboutRotationFailure = false;
  logger.attachTransport((logObj) => {
    try {
      const nextActiveFile = resolveActiveLogFile(settings.file);
      if (nextActiveFile !== activeFile) {
        activeFile = nextActiveFile;
        fs5.mkdirSync(path6.dirname(activeFile), { recursive: true });
        if (rollingFile) {
          pruneOldRollingLogs(path6.dirname(activeFile));
        }
        currentFileBytes = getCurrentLogFileBytes(activeFile);
      }
      const time = formatTimestamp(logObj.date ?? /* @__PURE__ */ new Date(), { style: "long" });
      const traceFields = buildTraceFileLogFields(logObj);
      const structuredFields = buildStructuredFileLogFields(logObj);
      const record = {
        ...logObj,
        _meta: withResolvedLogMetaHostname(
          logObj["_meta"],
          expectDefined(structuredFields.hostname, "structured log hostname")
        ),
        time,
        ...structuredFields,
        ...traceFields
      };
      const line = redactSensitiveText2(JSON.stringify(redactLogRecordForTransport(record)));
      const payload = `${line}
`;
      const payloadBytes = Buffer.byteLength(payload, "utf8");
      const nextBytes = currentFileBytes + payloadBytes;
      if (currentFileBytes > 0 && nextBytes > settings.maxFileBytes) {
        if (rotateLogFile(activeFile)) {
          currentFileBytes = getCurrentLogFileBytes(activeFile);
          warnedAboutRotationFailure = false;
        } else if (!warnedAboutRotationFailure) {
          warnedAboutRotationFailure = true;
          process.stderr.write(
            `[openclaw] log file rotation failed; continuing writes file=${activeFile} maxFileBytes=${settings.maxFileBytes}
`
          );
        }
      }
      if (appendLogLine(activeFile, payload)) {
        currentFileBytes += payloadBytes;
      }
    } catch {
    }
  });
  attachDiagnosticEventTransport(logger);
  return logger;
}
function resolveMaxLogFileBytes(raw) {
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
    return Math.floor(raw);
  }
  return DEFAULT_MAX_LOG_FILE_BYTES;
}
function getCurrentLogFileBytes(file) {
  try {
    return fs5.statSync(file).size;
  } catch {
    return 0;
  }
}
function appendLogLine(file, line) {
  try {
    appendRegularFileSync2({ filePath: file, content: line });
    return true;
  } catch {
    return false;
  }
}
function getLogger() {
  const settings = resolveSettings();
  const cachedLogger = loggingState.cachedLogger;
  const cachedSettings = loggingState.cachedSettings;
  if (!cachedLogger || settingsChanged(cachedSettings, settings)) {
    loggingState.cachedLogger = buildLogger(settings);
    loggingState.cachedSettings = settings;
  }
  return loggingState.cachedLogger;
}
function getChildLogger(bindings, opts) {
  const base = getLogger();
  const minLevel = opts?.level ? levelToMinLevel(opts.level) : base.settings.minLevel;
  const name = bindings ? JSON.stringify(bindings) : void 0;
  return base.getSubLogger({
    name,
    minLevel,
    prefix: bindings ? [name ?? ""] : []
  });
}
function defaultRollingPathForToday() {
  return rollingPathForDate(DEFAULT_LOG_DIR, /* @__PURE__ */ new Date());
}
function rollingPathForDate(dir, date) {
  const today = formatLocalDate(date);
  return path6.join(dir, `${LOG_PREFIX}-${today}${LOG_SUFFIX}`);
}
function resolveActiveLogFile(file) {
  const expandedFile = expandHomePrefix(file);
  if (!isRollingPath(expandedFile)) {
    return expandedFile;
  }
  return rollingPathForDate(path6.dirname(expandedFile), /* @__PURE__ */ new Date());
}
function isRollingPath(file) {
  const base = path6.basename(file);
  return base.startsWith(`${LOG_PREFIX}-`) && base.endsWith(LOG_SUFFIX) && base.length === `${LOG_PREFIX}-YYYY-MM-DD${LOG_SUFFIX}`.length;
}
function pruneOldRollingLogs(dir) {
  try {
    const entries = fs5.readdirSync(dir, { withFileTypes: true });
    const cutoff = Date.now() - MAX_LOG_AGE_MS;
    for (const entry of entries) {
      if (!entry.isFile()) {
        continue;
      }
      if (!entry.name.startsWith(`${LOG_PREFIX}-`) || !entry.name.endsWith(LOG_SUFFIX)) {
        continue;
      }
      const fullPath = path6.join(dir, entry.name);
      try {
        const stat = fs5.statSync(fullPath);
        if (stat.mtimeMs < cutoff) {
          fs5.rmSync(fullPath, { force: true });
        }
      } catch {
      }
    }
  } catch {
  }
}
function rotatedLogPath(file, index) {
  const ext = path6.extname(file);
  const base = file.slice(0, file.length - ext.length);
  return `${base}.${index}${ext}`;
}
function rotateLogFile(file) {
  try {
    fs5.mkdirSync(path6.dirname(file), { recursive: true });
    fs5.rmSync(rotatedLogPath(file, MAX_ROTATED_LOG_FILES), { force: true });
    for (let index = MAX_ROTATED_LOG_FILES - 1; index >= 1; index -= 1) {
      const from = rotatedLogPath(file, index);
      if (!fs5.existsSync(from)) {
        continue;
      }
      fs5.renameSync(from, rotatedLogPath(file, index + 1));
    }
    if (fs5.existsSync(file)) {
      fs5.renameSync(file, rotatedLogPath(file, 1));
    }
    return true;
  } catch {
    return false;
  }
}
var loadConfigFallbackDefault = () => void 0;
var loadConfigFallback = loadConfigFallbackDefault;
function normalizeConsoleLevel(level) {
  if (isVerbose()) {
    return "debug";
  }
  if (!level && process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1") {
    return "silent";
  }
  return normalizeLogLevel(level, "info");
}
function normalizeConsoleStyle(style) {
  if (style === "compact" || style === "json" || style === "pretty") {
    return style;
  }
  if (!process.stdout.isTTY) {
    return "compact";
  }
  return "pretty";
}
function resolveConsoleSettings() {
  const envLevel = resolveEnvLogLevelOverride();
  if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1" && !isVerbose() && !envLevel && !loggingState.overrideSettings) {
    return { level: "silent", style: normalizeConsoleStyle(void 0) };
  }
  let cfg = loggingState.overrideSettings ?? readLoggingConfig();
  if (!cfg && !shouldSkipMutatingLoggingConfigRead()) {
    if (loggingState.resolvingConsoleSettings) {
      cfg = void 0;
    } else {
      loggingState.resolvingConsoleSettings = true;
      try {
        cfg = loadConfigFallback();
      } finally {
        loggingState.resolvingConsoleSettings = false;
      }
    }
  }
  const level = envLevel ?? normalizeConsoleLevel(cfg?.consoleLevel);
  const style = normalizeConsoleStyle(cfg?.consoleStyle);
  return { level, style };
}
function consoleSettingsChanged(a, b) {
  if (!a) {
    return true;
  }
  return a.level !== b.level || a.style !== b.style;
}
function getConsoleSettings() {
  const settings = resolveConsoleSettings();
  const cached = loggingState.cachedConsoleSettings;
  if (!cached || consoleSettingsChanged(cached, settings)) {
    loggingState.cachedConsoleSettings = settings;
  }
  return loggingState.cachedConsoleSettings;
}
function normalizeConsoleSubsystem(subsystem) {
  if (typeof subsystem !== "string") {
    return null;
  }
  const normalized = subsystem.trim();
  return normalized.length > 0 ? normalized : null;
}
function shouldLogSubsystemToConsole(subsystem) {
  const filter = loggingState.consoleSubsystemFilter;
  if (!filter || filter.length === 0) {
    return true;
  }
  const normalizedSubsystem = normalizeConsoleSubsystem(subsystem);
  if (!normalizedSubsystem) {
    return false;
  }
  return filter.some(
    (prefix) => normalizedSubsystem === prefix || normalizedSubsystem.startsWith(`${prefix}/`)
  );
}
function formatConsoleTimestamp(style) {
  const now = /* @__PURE__ */ new Date();
  if (style === "pretty") {
    return formatTimestamp(now, { style: "short" }).replace(/[+-]\d{2}:\d{2}$/, "");
  }
  return formatTimestamp(now, { style: "long" });
}
function normalizeSubsystemLabel(subsystem) {
  if (typeof subsystem !== "string") {
    return "unknown";
  }
  const normalized = subsystem.trim();
  return normalized.length > 0 ? normalized : "unknown";
}
function shouldLogToConsole(level, settings) {
  if (level === "silent") {
    return false;
  }
  if (settings.level === "silent") {
    return false;
  }
  const current = levelToMinLevel(level);
  const min = levelToMinLevel(settings.level);
  return current >= min;
}
var inspectValue = (() => {
  const getBuiltinModule = process.getBuiltinModule;
  if (typeof getBuiltinModule !== "function") {
    return null;
  }
  try {
    const utilNamespace = getBuiltinModule("util");
    return typeof utilNamespace.inspect === "function" ? utilNamespace.inspect : null;
  } catch {
    return null;
  }
})();
function isRichConsoleEnv() {
  const term = normalizeLowercaseStringOrEmpty(process.env.TERM);
  if (process.env.COLORTERM || process.env.TERM_PROGRAM) {
    return true;
  }
  return term.length > 0 && term !== "dumb";
}
function getColorForConsole() {
  const hasForceColor = typeof process.env.FORCE_COLOR === "string" && process.env.FORCE_COLOR.trim().length > 0 && process.env.FORCE_COLOR.trim() !== "0";
  if (hasForceColor) {
    return new Chalk({ level: 1 });
  }
  if (process.env.NO_COLOR && !hasForceColor) {
    return new Chalk({ level: 0 });
  }
  const hasTty = process.stdout.isTTY || process.stderr.isTTY;
  return hasTty || isRichConsoleEnv() ? new Chalk({ level: 1 }) : new Chalk({ level: 0 });
}
var SUBSYSTEM_COLORS = ["cyan", "green", "yellow", "blue", "magenta", "red"];
var SUBSYSTEM_COLOR_OVERRIDES = {
  "gmail-watcher": "blue"
};
var SUBSYSTEM_PREFIXES_TO_DROP = ["gateway", "channels", "providers"];
var SUBSYSTEM_MAX_SEGMENTS = 2;
var CHANNEL_SUBSYSTEM_PREFIXES = /* @__PURE__ */ new Set([
  "clickclack",
  "discord",
  "feishu",
  "googlechat",
  "imessage",
  "irc",
  "line",
  "matrix",
  "mattermost",
  "msteams",
  "nextcloud-talk",
  "nostr",
  "openclaw-weixin",
  "qqbot",
  "signal",
  "slack",
  "synology-chat",
  "telegram",
  "tlon",
  "twitch",
  "webchat",
  "wecom",
  "whatsapp",
  "yuanbao",
  "zalo",
  "zalouser"
]);
function isChannelSubsystemPrefix(value) {
  const normalized = normalizeLowercaseStringOrEmpty(value);
  if (!normalized) {
    return false;
  }
  return CHANNEL_SUBSYSTEM_PREFIXES.has(normalized);
}
function pickSubsystemColor(color, subsystem) {
  const override = SUBSYSTEM_COLOR_OVERRIDES[subsystem];
  if (override) {
    return color[override];
  }
  let hash = 0;
  for (let i = 0; i < subsystem.length; i += 1) {
    hash = hash * 31 + subsystem.charCodeAt(i) | 0;
  }
  const idx = Math.abs(hash) % SUBSYSTEM_COLORS.length;
  const name = expectDefined(SUBSYSTEM_COLORS[idx], "subsystem colors entry at idx");
  return color[name];
}
function formatSubsystemForConsole(subsystem) {
  const parts = subsystem.split("/").filter(Boolean);
  const original = parts.join("/") || subsystem;
  while (parts.length > 0) {
    const first2 = parts.at(0);
    if (first2 === void 0 || !SUBSYSTEM_PREFIXES_TO_DROP.includes(first2)) {
      break;
    }
    parts.shift();
  }
  const first = parts.at(0);
  if (first === void 0) {
    return original;
  }
  if (isChannelSubsystemPrefix(first)) {
    return first;
  }
  if (parts.length > SUBSYSTEM_MAX_SEGMENTS) {
    return parts.slice(-SUBSYSTEM_MAX_SEGMENTS).join("/");
  }
  return parts.join("/");
}
function stripRedundantSubsystemPrefixForConsole(message, displaySubsystem) {
  if (!displaySubsystem) {
    return message;
  }
  if (message.startsWith("[")) {
    const closeIdx = message.indexOf("]");
    if (closeIdx > 1) {
      const bracketTag = message.slice(1, closeIdx);
      if (normalizeLowercaseStringOrEmpty(bracketTag) === normalizeLowercaseStringOrEmpty(displaySubsystem)) {
        let i2 = closeIdx + 1;
        while (message[i2] === " ") {
          i2 += 1;
        }
        return message.slice(i2);
      }
    }
  }
  const prefix = message.slice(0, displaySubsystem.length);
  if (normalizeLowercaseStringOrEmpty(prefix) !== normalizeLowercaseStringOrEmpty(displaySubsystem)) {
    return message;
  }
  const next = message.slice(displaySubsystem.length, displaySubsystem.length + 1);
  if (next !== ":" && next !== " ") {
    return message;
  }
  let i = displaySubsystem.length;
  while (message[i] === " ") {
    i += 1;
  }
  if (message[i] === ":") {
    i += 1;
  }
  while (message[i] === " ") {
    i += 1;
  }
  return message.slice(i);
}
function formatConsoleLine(opts) {
  const displaySubsystem = opts.style === "json" ? opts.subsystem : formatSubsystemForConsole(opts.subsystem);
  if (opts.style === "json") {
    return redactSensitiveText2(
      JSON.stringify({
        time: formatConsoleTimestamp("json"),
        level: opts.level,
        subsystem: displaySubsystem,
        message: opts.message,
        ...opts.meta
      })
    );
  }
  const color = getColorForConsole();
  const prefix = `[${displaySubsystem}]`;
  const prefixColor = pickSubsystemColor(color, displaySubsystem);
  const levelColor = opts.level === "error" || opts.level === "fatal" ? color.red : opts.level === "warn" ? color.yellow : opts.level === "debug" || opts.level === "trace" ? color.gray : color.cyan;
  const redactedMessage = redactSensitiveText2(opts.message);
  const displayMessage = stripRedundantSubsystemPrefixForConsole(redactedMessage, displaySubsystem);
  const time = (() => {
    if (opts.style === "pretty") {
      return color.gray(formatConsoleTimestamp("pretty"));
    }
    if (loggingState.consoleTimestampPrefix) {
      return color.gray(formatConsoleTimestamp(opts.style));
    }
    return "";
  })();
  const prefixToken = prefixColor(prefix);
  const head = [time, prefixToken].filter(Boolean).join(" ");
  return `${head} ${levelColor(displayMessage)}`;
}
function writeConsoleLine(level, line, opts = {}) {
  clearActiveProgressLine();
  const sanitized = process.platform === "win32" && process.env.GITHUB_ACTIONS === "true" ? line.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "?").replace(/[\uD800-\uDFFF]/g, "?") : line;
  const redacted = opts.redacted ? sanitized : redactSensitiveText2(sanitized);
  const sink = loggingState.rawConsole ?? console;
  if (loggingState.forceConsoleToStderr || level === "error" || level === "fatal") {
    (sink.error ?? console.error)(redacted);
  } else if (level === "warn") {
    (sink.warn ?? console.warn)(redacted);
  } else {
    (sink.log ?? console.log)(redacted);
  }
}
function shouldSuppressProbeConsoleLine(params) {
  if (isVerbose()) {
    return false;
  }
  if (params.level === "error" || params.level === "fatal") {
    return false;
  }
  const subsystem = normalizeSubsystemLabel(params.subsystem);
  const message = typeof params.message === "string" ? params.message : "";
  const isProbeSuppressedSubsystem = subsystem === "agent/embedded" || subsystem.startsWith("agent/embedded/") || subsystem === "model-fallback" || subsystem.startsWith("model-fallback/");
  if (!isProbeSuppressedSubsystem) {
    return false;
  }
  const runLikeId = typeof params.meta?.runId === "string" ? params.meta.runId : typeof params.meta?.sessionId === "string" ? params.meta.sessionId : void 0;
  if (runLikeId?.startsWith("probe-")) {
    return true;
  }
  return /(sessionId|runId)=probe-/.test(message);
}
function logToFile(fileLogger, level, message, meta) {
  if (level === "silent") {
    return;
  }
  const safeLevel = level;
  const method = fileLogger[safeLevel];
  if (typeof method !== "function") {
    return;
  }
  if (meta && Object.keys(meta).length > 0) {
    method.call(fileLogger, meta, message);
  } else {
    method.call(fileLogger, message);
  }
}
function createSubsystemLogger(subsystem) {
  const resolvedSubsystem = normalizeSubsystemLabel(subsystem);
  const emitLog = (level, message, meta) => {
    const consoleSettings = getConsoleSettings();
    const consoleEnabled = shouldLogToConsole(level, { level: consoleSettings.level }) && shouldLogSubsystemToConsole(resolvedSubsystem);
    const fileEnabled = isFileLogLevelEnabled(level);
    if (!consoleEnabled && !fileEnabled) {
      return;
    }
    let consoleMessageOverride;
    let fileMeta = meta;
    if (meta && Object.keys(meta).length > 0) {
      const { consoleMessage: consoleMessage2, ...rest } = meta;
      if (typeof consoleMessage2 === "string") {
        consoleMessageOverride = consoleMessage2;
      }
      fileMeta = Object.keys(rest).length > 0 ? rest : void 0;
    }
    if (fileEnabled) {
      logToFile(getChildLogger({ subsystem: resolvedSubsystem }), level, message, fileMeta);
    }
    if (!consoleEnabled) {
      return;
    }
    const consoleMessage = consoleMessageOverride ?? message;
    if (shouldSuppressProbeConsoleLine({
      level,
      subsystem: resolvedSubsystem,
      message: consoleMessage,
      meta: fileMeta
    })) {
      return;
    }
    writeConsoleLine(
      level,
      formatConsoleLine({
        level,
        subsystem: resolvedSubsystem,
        message: consoleSettings.style === "json" ? message : consoleMessage,
        style: consoleSettings.style,
        meta: fileMeta
      }),
      { redacted: true }
    );
  };
  const logger = {
    subsystem: resolvedSubsystem,
    isEnabled(level, target = "any") {
      const isConsoleEnabled = shouldLogToConsole(level, { level: getConsoleSettings().level }) && shouldLogSubsystemToConsole(resolvedSubsystem);
      const isFileEnabled = isFileLogLevelEnabled(level);
      if (target === "console") {
        return isConsoleEnabled;
      }
      if (target === "file") {
        return isFileEnabled;
      }
      return isConsoleEnabled || isFileEnabled;
    },
    trace(message, meta) {
      emitLog("trace", message, meta);
    },
    debug(message, meta) {
      emitLog("debug", message, meta);
    },
    info(message, meta) {
      emitLog("info", message, meta);
    },
    warn(message, meta) {
      emitLog("warn", message, meta);
    },
    error(message, meta) {
      emitLog("error", message, meta);
    },
    fatal(message, meta) {
      emitLog("fatal", message, meta);
    },
    raw(message) {
      if (isFileLogLevelEnabled("info")) {
        logToFile(getChildLogger({ subsystem: resolvedSubsystem }), "info", message, { raw: true });
      }
      if (shouldLogToConsole("info", { level: getConsoleSettings().level }) && shouldLogSubsystemToConsole(resolvedSubsystem)) {
        if (shouldSuppressProbeConsoleLine({
          level: "info",
          subsystem: resolvedSubsystem,
          message
        })) {
          return;
        }
        writeConsoleLine("info", message);
      }
    },
    child(name) {
      return createSubsystemLogger(`${resolvedSubsystem}/${name}`);
    }
  };
  return logger;
}
var transactionLog = createSubsystemLogger("sqlite/transaction");
var require2 = createRequire(import.meta.url);
function createSqliteTerminalOpenLatch(options) {
  const failures = /* @__PURE__ */ new Map();
  return {
    get: (pathname) => failures.get(path7.resolve(pathname)),
    record: (pathname, error) => {
      const resolvedPath = path7.resolve(pathname);
      failures.set(resolvedPath, error);
      options.closeByPath(resolvedPath);
    },
    clear: (pathname) => {
      failures.delete(path7.resolve(pathname));
    },
    clearAll: () => {
      failures.clear();
    }
  };
}
var DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS = 30 * 60 * 1e3;
var JOURNAL_MODE_RETRY_SLEEP = new Int32Array(new SharedArrayBuffer(4));
var MAX_SAFE_INTEGER_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);
var CORE_PACKAGE_NAME = "openclaw";
var PACKAGE_JSON_CANDIDATES = [
  "../package.json",
  "../../package.json",
  "../../../package.json",
  "./package.json"
];
var BUILD_INFO_CANDIDATES = [
  "../build-info.json",
  "../../build-info.json",
  "./build-info.json"
];
function readVersionFromJsonCandidates(moduleUrl, candidates, opts = {}) {
  try {
    const require4 = createRequire2(moduleUrl);
    for (const candidate of candidates) {
      try {
        const parsed = require4(candidate);
        const version = normalizeOptionalString(parsed.version);
        if (!version) {
          continue;
        }
        if (opts.requirePackageName && parsed.name !== CORE_PACKAGE_NAME) {
          continue;
        }
        return version;
      } catch {
      }
    }
    return null;
  } catch {
    return null;
  }
}
function firstNonEmpty(...values) {
  for (const value of values) {
    const trimmed = normalizeOptionalString(value);
    if (trimmed && trimmed.toLowerCase() !== "undefined" && trimmed.toLowerCase() !== "null") {
      return trimmed;
    }
  }
  return void 0;
}
function readInjectedVersion() {
  return typeof __OPENCLAW_VERSION__ === "string" ? __OPENCLAW_VERSION__ : void 0;
}
function readVersionFromPackageJsonForModuleUrl(moduleUrl) {
  return readVersionFromJsonCandidates(moduleUrl, PACKAGE_JSON_CANDIDATES, {
    requirePackageName: true
  });
}
function readVersionFromBuildInfoForModuleUrl(moduleUrl) {
  return readVersionFromJsonCandidates(moduleUrl, BUILD_INFO_CANDIDATES);
}
function resolveVersionFromModuleUrl(moduleUrl) {
  return readVersionFromPackageJsonForModuleUrl(moduleUrl) || readVersionFromBuildInfoForModuleUrl(moduleUrl);
}
function resolveBinaryVersion(params) {
  return firstNonEmpty(params.injectedVersion) || resolveVersionFromModuleUrl(params.moduleUrl) || firstNonEmpty(params.bundledVersion) || params.fallback || "0.0.0";
}
var VERSION = resolveBinaryVersion({
  moduleUrl: import.meta.url,
  injectedVersion: readInjectedVersion(),
  bundledVersion: process.env.OPENCLAW_BUNDLED_VERSION
});
function pruneMapToMaxSize(map, maxSize) {
  if (Number.isNaN(maxSize) || maxSize === Number.POSITIVE_INFINITY) {
    return;
  }
  const limit = Math.max(0, Math.floor(maxSize));
  if (limit <= 0) {
    map.clear();
    return;
  }
  while (map.size > limit) {
    const oldest = map.keys().next();
    if (oldest.done) {
      break;
    }
    map.delete(oldest.value);
  }
}
function createDedupeCache(options) {
  const ttlMs = resolveNonNegativeIntegerOption(options.ttlMs, 0);
  const maxSize = resolveNonNegativeIntegerOption(options.maxSize, 0);
  const cache = /* @__PURE__ */ new Map();
  const touch = (key, now) => {
    cache.delete(key);
    cache.set(key, now);
  };
  const prune = (now) => {
    const cutoff = ttlMs > 0 ? now - ttlMs : void 0;
    if (cutoff !== void 0) {
      for (const [entryKey, entryTs] of cache) {
        if (entryTs < cutoff) {
          cache.delete(entryKey);
        }
      }
    }
    if (maxSize <= 0) {
      cache.clear();
      return;
    }
    pruneMapToMaxSize(cache, maxSize);
  };
  const hasUnexpired = (key, now, touchOnRead) => {
    const existing = cache.get(key);
    if (existing === void 0) {
      return false;
    }
    if (ttlMs > 0 && now - existing >= ttlMs) {
      cache.delete(key);
      return false;
    }
    if (touchOnRead) {
      touch(key, now);
    }
    return true;
  };
  return {
    check: (key, now = Date.now()) => {
      if (!key) {
        return false;
      }
      if (hasUnexpired(key, now, true)) {
        return true;
      }
      touch(key, now);
      prune(now);
      return false;
    },
    peek: (key, now = Date.now()) => {
      if (!key) {
        return false;
      }
      return hasUnexpired(key, now, false);
    },
    delete: (key) => {
      if (!key) {
        return;
      }
      cache.delete(key);
    },
    clear: () => {
      cache.clear();
    },
    size: () => cache.size
  };
}
var stateDbLog = createSubsystemLogger("state/db");
var chmodWarnedTargets = createDedupeCache({
  ttlMs: 0,
  maxSize: 4096
});
var SESSION_WATCH_PROVENANCE_EXPLICIT = "explicit";
var SESSION_WATCH_PROVENANCE_AMBIENT_GROUP = "ambient-group";
var SESSION_WATCH_PROVENANCE_COLUMN_SQL = `provenance TEXT NOT NULL DEFAULT '${SESSION_WATCH_PROVENANCE_EXPLICIT}' CHECK (provenance IN ('${SESSION_WATCH_PROVENANCE_EXPLICIT}', '${SESSION_WATCH_PROVENANCE_AMBIENT_GROUP}'))`;
var cachedDatabases = /* @__PURE__ */ new Map();
var terminalOpenLatch = createSqliteTerminalOpenLatch({
  closeByPath: (pathname) => {
    const cached = cachedDatabases.get(pathname);
    if (!cached) {
      return;
    }
    cached.walMaintenance.close();
    clearNodeSqliteKyselyCacheForDatabase(cached.db);
    if (cached.db.isOpen) {
      cached.db.close();
    }
    cachedDatabases.delete(pathname);
  }
});
var stateDbLog2 = createSubsystemLogger("state/db");
var AGENT_LIFECYCLE_KEY = /* @__PURE__ */ Symbol.for("openclaw.agentLifecycle");
var agentLifecycle = resolveGlobalMap(AGENT_LIFECYCLE_KEY);
var DARWIN_PS_TIMEOUT_MS = 1e3;
function isValidPid(pid) {
  return Number.isInteger(pid) && pid > 0;
}
function isZombieProcess(pid) {
  if (process.platform !== "linux") {
    return false;
  }
  try {
    const status = fsSync.readFileSync(`/proc/${pid}/status`, "utf8");
    const stateMatch = status.match(/^State:\s+(\S)/m);
    return stateMatch?.[1] === "Z";
  } catch {
    return false;
  }
}
function isPidDefinitelyDead(pid) {
  if (!isValidPid(pid)) {
    return true;
  }
  try {
    process.kill(pid, 0);
  } catch (err) {
    return err.code === "ESRCH";
  }
  return isZombieProcess(pid);
}
function getDarwinProcessStartTime(pid) {
  try {
    const startedAt = childProcess.execFileSync("/bin/ps", ["-o", "lstart=", "-p", String(pid)], {
      encoding: "utf8",
      env: { ...process.env, LC_ALL: "C", TZ: "UTC" },
      stdio: ["ignore", "pipe", "ignore"],
      timeout: DARWIN_PS_TIMEOUT_MS
    }).trim();
    const startedAtMs = Date.parse(`${startedAt} UTC`);
    return Number.isFinite(startedAtMs) ? Math.floor(startedAtMs / 1e3) : null;
  } catch {
    return null;
  }
}
function getProcessStartTime(pid) {
  if (!isValidPid(pid)) {
    return null;
  }
  if (process.platform !== "linux") {
    return null;
  }
  try {
    const stat = fsSync.readFileSync(`/proc/${pid}/stat`, "utf8");
    const commEndIndex = stat.lastIndexOf(")");
    if (commEndIndex < 0) {
      return null;
    }
    const afterComm = stat.slice(commEndIndex + 1).trimStart();
    const fields = afterComm.split(/\s+/);
    const starttime = Number(fields[19]);
    return Number.isInteger(starttime) && starttime >= 0 ? starttime : null;
  } catch {
    return null;
  }
}
function getFileLockProcessStartTime(pid) {
  if (!isValidPid(pid)) {
    return null;
  }
  return process.platform === "darwin" ? getDarwinProcessStartTime(pid) : getProcessStartTime(pid);
}
function sha256Hex(input) {
  return createHash("sha256").update(input).digest("hex");
}
var utf8Encoder = new TextEncoder();
var WINDOWS_EXECUTABLE_SUFFIXES = [".exe", ".cmd", ".bat", ".com"];
function stripWindowsExecutableSuffix(value) {
  for (const suffix of WINDOWS_EXECUTABLE_SUFFIXES) {
    if (value.endsWith(suffix)) {
      return value.slice(0, -suffix.length);
    }
  }
  return value;
}
function basenameLower(token) {
  const win = path8.win32.basename(token);
  const posix = path8.posix.basename(token);
  const base = win.length < posix.length ? win : posix;
  return normalizeLowercaseStringOrEmpty(base);
}
function normalizeExecutableToken(token) {
  return stripWindowsExecutableSuffix(basenameLower(token));
}
var DOUBLE_QUOTE_ESCAPES = /* @__PURE__ */ new Set(["\\", '"', "$", "`", "\n", "\r"]);
function isDoubleQuoteEscape(next) {
  return Boolean(next && DOUBLE_QUOTE_ESCAPES.has(next));
}
function splitShellArgs(raw) {
  const tokens = [];
  let buf = "";
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  const pushToken = () => {
    if (buf.length > 0) {
      tokens.push(buf);
      buf = "";
    }
  };
  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw.charAt(i);
    if (escaped) {
      buf += ch;
      escaped = false;
      continue;
    }
    if (!inSingle && !inDouble && ch === "\\") {
      escaped = true;
      continue;
    }
    if (inSingle) {
      if (ch === "'") {
        inSingle = false;
      } else {
        buf += ch;
      }
      continue;
    }
    if (inDouble) {
      const next = raw[i + 1];
      if (ch === "\\" && isDoubleQuoteEscape(next)) {
        buf += next;
        i += 1;
        continue;
      }
      if (ch === '"') {
        inDouble = false;
      } else {
        buf += ch;
      }
      continue;
    }
    if (ch === "'") {
      inSingle = true;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      continue;
    }
    if (ch === "#" && buf.length === 0) {
      break;
    }
    if (/\s/.test(ch)) {
      pushToken();
      continue;
    }
    buf += ch;
  }
  if (escaped || inSingle || inDouble) {
    return null;
  }
  pushToken();
  return tokens;
}
function parseInlineOptionToken(token) {
  const separatorIndex = token.indexOf("=");
  if (separatorIndex < 0) {
    return { name: token, hasInlineValue: false };
  }
  return {
    name: token.slice(0, separatorIndex),
    hasInlineValue: true,
    inlineValue: token.slice(separatorIndex + 1)
  };
}
var MAX_ENV_SPLIT_PAYLOAD_DEPTH = 32;
var ENV_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
  "-C",
  "-P",
  "-S",
  "-s",
  "-u",
  "--argv0",
  "--block-signal",
  "--chdir",
  "--default-signal",
  "--ignore-signal",
  "--split-string",
  "--unset"
]);
var ENV_SPLIT_STRING_OPTIONS = /* @__PURE__ */ new Set(["-S", "-s", "--split-string"]);
var ENV_STANDALONE_OPTIONS = /* @__PURE__ */ new Set(["-0", "-i", "--ignore-environment", "--null"]);
function isEnvAssignmentToken(token) {
  return /^[A-Za-z_][A-Za-z0-9_]*=.*$/u.test(token);
}
function parseCarrierOptionToken(token, standaloneOptions, optionsWithValue, nonExecutingOptions = /* @__PURE__ */ new Set()) {
  if (token.startsWith("--")) {
    const option = parseInlineOptionToken(token);
    const name = option.name;
    if (standaloneOptions.has(name) || optionsWithValue.has(name) || nonExecutingOptions.has(name)) {
      const parsedOption = {
        name,
        hasInlineValue: option.hasInlineValue
      };
      if (option.hasInlineValue) {
        parsedOption.inlineValue = option.inlineValue;
      }
      return [parsedOption];
    }
    return null;
  }
  if (!/^-[A-Za-z0-9]/u.test(token)) {
    return null;
  }
  const options = [];
  for (let index = 1; index < token.length; index += 1) {
    const name = `-${token[index] ?? ""}`;
    if (optionsWithValue.has(name)) {
      options.push({
        name,
        hasInlineValue: index < token.length - 1,
        inlineValue: index < token.length - 1 ? token.slice(index + 1) : void 0
      });
      return options;
    }
    if (standaloneOptions.has(name) || nonExecutingOptions.has(name)) {
      options.push({ name, hasInlineValue: false });
      continue;
    }
    return null;
  }
  return options.length > 0 ? options : null;
}
function knownCarrierOptionConsumesNextValue(options, optionsWithValue, nonExecutingOptions = /* @__PURE__ */ new Set()) {
  let consumesNextValue = false;
  for (const option of options) {
    if (nonExecutingOptions.has(option.name)) {
      return null;
    }
    if (optionsWithValue.has(option.name)) {
      consumesNextValue = !option.hasInlineValue;
    }
  }
  return consumesNextValue;
}
function findParsedCarrierOption(options, names) {
  return options.find((option) => names.has(option.name));
}
function resolveEnvSplitPayload(payload, trailingArgv, depth) {
  const innerArgv = splitShellArgs(payload);
  if (!innerArgv || innerArgv.length === 0) {
    return null;
  }
  const carriedArgv = [...innerArgv, ...trailingArgv];
  return resolveEnvCarriedArgv(["env", ...carriedArgv], depth + 1) ?? carriedArgv;
}
function parseEnvInvocationPrelude(argv, depth = 0) {
  if (depth > MAX_ENV_SPLIT_PAYLOAD_DEPTH || normalizeExecutableToken(argv[0] ?? "") !== "env") {
    return null;
  }
  let usesModifiers = false;
  const assignmentKeys = [];
  for (let index = 1; index < argv.length; index += 1) {
    const token = argv[index] ?? "";
    if (!token) {
      return null;
    }
    if (isEnvAssignmentToken(token)) {
      usesModifiers = true;
      const delimiter = token.indexOf("=");
      if (delimiter > 0) {
        assignmentKeys.push(token.slice(0, delimiter));
      }
      continue;
    }
    if (token === "--" || token === "-") {
      return index + 1 < argv.length ? { assignmentKeys, commandIndex: index + 1, usesModifiers } : null;
    }
    if (token.startsWith("-")) {
      const option = parseCarrierOptionToken(token, ENV_STANDALONE_OPTIONS, ENV_OPTIONS_WITH_VALUE);
      if (!option) {
        return null;
      }
      usesModifiers = true;
      const splitStringOption = findParsedCarrierOption(option, ENV_SPLIT_STRING_OPTIONS);
      if (splitStringOption) {
        const payloadIndex = splitStringOption.inlineValue === void 0 ? index + 1 : index;
        const payload = splitStringOption.inlineValue ?? argv[payloadIndex];
        const trailingIndex = payloadIndex + 1;
        const splitArgv = typeof payload === "string" ? resolveEnvSplitPayload(payload, argv.slice(trailingIndex), depth) : null;
        return splitArgv ? {
          assignmentKeys,
          commandIndex: trailingIndex,
          splitArgv,
          usesModifiers
        } : null;
      }
      const consumeNextValue = knownCarrierOptionConsumesNextValue(option, ENV_OPTIONS_WITH_VALUE);
      if (consumeNextValue) {
        index += 1;
      }
      continue;
    }
    return { assignmentKeys, commandIndex: index, usesModifiers };
  }
  return null;
}
function envInvocationUsesModifiers(argv) {
  const parsed = parseEnvInvocationPrelude(argv);
  return parsed?.usesModifiers ?? normalizeExecutableToken(argv[0] ?? "") === "env";
}
function unwrapEnvInvocation(argv) {
  const parsed = parseEnvInvocationPrelude(argv);
  return parsed ? parsed.splitArgv ?? argv.slice(parsed.commandIndex) : null;
}
function resolveEnvCarriedArgv(argv, depth = 0) {
  const parsed = parseEnvInvocationPrelude(argv, depth);
  return parsed ? parsed.splitArgv ?? argv.slice(parsed.commandIndex) : null;
}
var NICE_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["-n", "--adjustment", "--priority"]);
var CAFFEINATE_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["-t", "-w"]);
var STDBUF_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["-i", "--input", "-o", "--output", "-e", "--error"]);
var FLOCK_SHORT_FLAG_OPTIONS = /* @__PURE__ */ new Set(["-e", "-F", "-n", "-o", "-s", "-x"]);
var FLOCK_LONG_FLAG_OPTIONS = /* @__PURE__ */ new Set([
  "--close",
  "--exclusive",
  "--nb",
  "--no-fork",
  "--nonblock",
  "--shared",
  "--verbose"
]);
var FLOCK_SHORT_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["-E", "-w"]);
var FLOCK_LONG_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["--conflict-exit-code", "--timeout", "--wait"]);
var TIME_FLAG_OPTIONS = /* @__PURE__ */ new Set([
  "-a",
  "--append",
  "-h",
  "--help",
  "-l",
  "-p",
  "-q",
  "--quiet",
  "-v",
  "--verbose",
  "-V",
  "--version"
]);
var TIME_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["-f", "--format", "-o", "--output"]);
var BSD_SCRIPT_FLAG_OPTIONS = /* @__PURE__ */ new Set(["-a", "-d", "-k", "-p", "-q", "-r"]);
var BSD_SCRIPT_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["-F", "-t"]);
var SANDBOX_EXEC_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["-f", "-p", "-d"]);
var TIMEOUT_FLAG_OPTIONS = /* @__PURE__ */ new Set(["--foreground", "--preserve-status", "-v", "--verbose"]);
var TIMEOUT_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["-k", "--kill-after", "-s", "--signal"]);
var XCRUN_FLAG_OPTIONS = /* @__PURE__ */ new Set([
  "-k",
  "--kill-cache",
  "-l",
  "--log",
  "-n",
  "--no-cache",
  "-r",
  "--run",
  "-v",
  "--verbose"
]);
function isArchSelectorToken(token) {
  return /^-[A-Za-z0-9_]+$/.test(token);
}
function isKnownArchSelectorToken(token) {
  return token === "-arm64" || token === "-arm64e" || token === "-i386" || token === "-x86_64" || token === "-x86_64h";
}
function isKnownArchNameToken(token) {
  return isKnownArchSelectorToken(`-${token}`);
}
function scanWrapperInvocation(argv, params) {
  let idx = 1;
  let expectsOptionValue = false;
  while (idx < argv.length) {
    const token = argv[idx]?.trim() ?? "";
    if (!token) {
      idx += 1;
      continue;
    }
    if (expectsOptionValue) {
      expectsOptionValue = false;
      idx += 1;
      continue;
    }
    if (params.separators?.has(token)) {
      idx += 1;
      break;
    }
    const directive = params.onToken(token, normalizeLowercaseStringOrEmpty(token));
    if (directive === "stop") {
      break;
    }
    if (directive === "invalid") {
      return null;
    }
    if (directive === "consume-next") {
      expectsOptionValue = true;
    }
    idx += 1;
  }
  if (expectsOptionValue) {
    return null;
  }
  const commandIndex = params.adjustCommandIndex ? params.adjustCommandIndex(idx, argv) : idx;
  if (commandIndex === null || commandIndex >= argv.length) {
    return null;
  }
  return argv.slice(commandIndex);
}
function unwrapDashOptionInvocation(argv, params) {
  return scanWrapperInvocation(argv, {
    separators: /* @__PURE__ */ new Set(["--"]),
    onToken: (token, lower) => {
      if (!token.startsWith("-") || token === "-") {
        return "stop";
      }
      const { name: flag } = parseInlineOptionToken(lower);
      return params.onFlag(flag, lower);
    },
    adjustCommandIndex: params.adjustCommandIndex
  });
}
function unwrapNiceInvocation(argv) {
  return unwrapDashOptionInvocation(argv, {
    onFlag: (flag, lower) => {
      if (/^-\d+$/.test(lower)) {
        return "continue";
      }
      if (NICE_OPTIONS_WITH_VALUE.has(flag)) {
        return lower.includes("=") || lower !== flag ? "continue" : "consume-next";
      }
      if (lower.startsWith("-n") && lower.length > 2) {
        return "continue";
      }
      return "invalid";
    }
  });
}
function unwrapCaffeinateInvocation(argv) {
  return unwrapDashOptionInvocation(argv, {
    onFlag: (flag, lower) => {
      if (flag === "-d" || flag === "-i" || flag === "-m" || flag === "-s" || flag === "-u") {
        return "continue";
      }
      if (CAFFEINATE_OPTIONS_WITH_VALUE.has(flag)) {
        return lower !== flag || lower.includes("=") ? "continue" : "consume-next";
      }
      return "invalid";
    }
  });
}
function unwrapNohupInvocation(argv) {
  return scanWrapperInvocation(argv, {
    separators: /* @__PURE__ */ new Set(["--"]),
    onToken: (token, lower) => {
      if (!token.startsWith("-") || token === "-") {
        return "stop";
      }
      return lower === "--help" || lower === "--version" ? "continue" : "invalid";
    }
  });
}
function unwrapSandboxExecInvocation(argv) {
  return unwrapDashOptionInvocation(argv, {
    onFlag: (flag, lower) => {
      if (SANDBOX_EXEC_OPTIONS_WITH_VALUE.has(flag)) {
        return lower !== flag || lower.includes("=") ? "continue" : "consume-next";
      }
      return "invalid";
    }
  });
}
function unwrapStdbufInvocation(argv) {
  return unwrapDashOptionInvocation(argv, {
    onFlag: (flag, lower) => {
      if (!STDBUF_OPTIONS_WITH_VALUE.has(flag)) {
        return "invalid";
      }
      return lower.includes("=") ? "continue" : "consume-next";
    }
  });
}
function unwrapTimeInvocation(argv) {
  return unwrapDashOptionInvocation(argv, {
    onFlag: (flag, lower) => {
      if (TIME_FLAG_OPTIONS.has(flag)) {
        return "continue";
      }
      if (TIME_OPTIONS_WITH_VALUE.has(flag)) {
        return lower.includes("=") ? "continue" : "consume-next";
      }
      return "invalid";
    }
  });
}
function isFlockShortFlagCluster(token) {
  return /^-[eFnsxo]+$/.test(token);
}
function unwrapFlockInvocation(argv) {
  return scanWrapperInvocation(argv, {
    separators: /* @__PURE__ */ new Set(["--"]),
    onToken: (token, lower) => {
      if (!token.startsWith("-") || token === "-") {
        return "stop";
      }
      const parsedToken = parseInlineOptionToken(token);
      const lowerFlag = parseInlineOptionToken(lower).name;
      if (FLOCK_LONG_FLAG_OPTIONS.has(lowerFlag)) {
        return "continue";
      }
      if (FLOCK_LONG_OPTIONS_WITH_VALUE.has(lowerFlag)) {
        return parsedToken.hasInlineValue ? "continue" : "consume-next";
      }
      if (isFlockShortFlagCluster(token)) {
        return "continue";
      }
      if (FLOCK_SHORT_FLAG_OPTIONS.has(parsedToken.name)) {
        return "continue";
      }
      if (FLOCK_SHORT_OPTIONS_WITH_VALUE.has(parsedToken.name)) {
        return parsedToken.hasInlineValue || token !== parsedToken.name ? "continue" : "consume-next";
      }
      return "invalid";
    },
    adjustCommandIndex: (commandIndex, currentArgv) => {
      const wrappedCommandIndex = commandIndex + 1;
      const wrappedCommand = currentArgv[wrappedCommandIndex]?.trim() ?? "";
      return wrappedCommand && (!wrappedCommand.startsWith("-") || wrappedCommand === "-") ? wrappedCommandIndex : null;
    }
  });
}
function timeInvocationWritesOutputFile(argv) {
  let expectsOptionValue = false;
  for (let idx = 1; idx < argv.length; idx += 1) {
    const token = argv[idx]?.trim() ?? "";
    if (!token) {
      continue;
    }
    if (expectsOptionValue) {
      expectsOptionValue = false;
      continue;
    }
    if (token === "--") {
      return false;
    }
    if (!token.startsWith("-") || token === "-") {
      return false;
    }
    const lower = normalizeLowercaseStringOrEmpty(token);
    const { name: flag } = parseInlineOptionToken(lower);
    if (flag === "-o" || flag === "--output") {
      return true;
    }
    if (TIME_OPTIONS_WITH_VALUE.has(flag) && !lower.includes("=")) {
      expectsOptionValue = true;
    }
  }
  return false;
}
function supportsScriptPositionalCommand(platform = process.platform) {
  return platform === "darwin" || platform === "freebsd";
}
function unwrapScriptInvocation(argv, platform = process.platform) {
  if (!supportsScriptPositionalCommand(platform)) {
    return null;
  }
  return scanWrapperInvocation(argv, {
    separators: /* @__PURE__ */ new Set(["--"]),
    onToken: (token, lower) => {
      if (!lower.startsWith("-") || lower === "-") {
        return "stop";
      }
      const { name: flag } = parseInlineOptionToken(token);
      if (BSD_SCRIPT_OPTIONS_WITH_VALUE.has(flag)) {
        return token.includes("=") ? "continue" : "consume-next";
      }
      if (BSD_SCRIPT_FLAG_OPTIONS.has(flag)) {
        return "continue";
      }
      return "invalid";
    },
    adjustCommandIndex: (commandIndex, currentArgv) => {
      let sawTranscript = false;
      for (let idx = commandIndex; idx < currentArgv.length; idx += 1) {
        const token = currentArgv[idx]?.trim() ?? "";
        if (!token) {
          continue;
        }
        if (!sawTranscript) {
          sawTranscript = true;
          continue;
        }
        return idx;
      }
      return null;
    }
  });
}
function unwrapTimeoutInvocation(argv) {
  return unwrapDashOptionInvocation(argv, {
    onFlag: (flag, lower) => {
      if (TIMEOUT_FLAG_OPTIONS.has(flag)) {
        return "continue";
      }
      if (TIMEOUT_OPTIONS_WITH_VALUE.has(flag)) {
        return lower.includes("=") ? "continue" : "consume-next";
      }
      return "invalid";
    },
    adjustCommandIndex: (commandIndex, currentArgv) => {
      const wrappedCommandIndex = commandIndex + 1;
      return wrappedCommandIndex < currentArgv.length ? wrappedCommandIndex : null;
    }
  });
}
function unwrapArchInvocation(argv) {
  let expectsArchName = false;
  return scanWrapperInvocation(argv, {
    onToken: (token, lower) => {
      if (expectsArchName) {
        expectsArchName = false;
        return isKnownArchNameToken(lower) ? "continue" : "invalid";
      }
      if (!token.startsWith("-") || token === "-") {
        return "stop";
      }
      if (lower === "-32" || lower === "-64") {
        return "continue";
      }
      if (lower === "-arch") {
        expectsArchName = true;
        return "continue";
      }
      if (lower === "-c" || lower === "-d" || lower === "-e" || lower === "-h") {
        return "invalid";
      }
      return isArchSelectorToken(token) && isKnownArchSelectorToken(lower) ? "continue" : "invalid";
    }
  });
}
function supportsArchDispatchWrapper(platform = process.platform) {
  return platform === "darwin";
}
function supportsXcrunDispatchWrapper(platform = process.platform) {
  return platform === "darwin";
}
function unwrapXcrunInvocation(argv) {
  return scanWrapperInvocation(argv, {
    onToken: (token, lower) => {
      if (!token.startsWith("-") || token === "-") {
        return "stop";
      }
      if (XCRUN_FLAG_OPTIONS.has(lower)) {
        return "continue";
      }
      return "invalid";
    }
  });
}
var DISPATCH_WRAPPER_SPECS = [
  {
    name: "arch",
    unwrap: (argv, platform) => supportsArchDispatchWrapper(platform) ? unwrapArchInvocation(argv) : null,
    transparentUsage: (_argv, platform) => supportsArchDispatchWrapper(platform)
  },
  { name: "caffeinate", unwrap: unwrapCaffeinateInvocation, transparentUsage: true },
  { name: "chrt" },
  { name: "doas" },
  {
    name: "env",
    unwrap: unwrapEnvInvocation,
    transparentUsage: (argv) => !envInvocationUsesModifiers(argv)
  },
  { name: "flock", unwrap: unwrapFlockInvocation, transparentUsage: true },
  { name: "ionice" },
  { name: "nice", unwrap: unwrapNiceInvocation, transparentUsage: true },
  { name: "nohup", unwrap: unwrapNohupInvocation, transparentUsage: true },
  { name: "sandbox-exec", unwrap: unwrapSandboxExecInvocation, transparentUsage: true },
  { name: "script", unwrap: unwrapScriptInvocation, transparentUsage: false },
  { name: "setsid" },
  { name: "stdbuf", unwrap: unwrapStdbufInvocation, transparentUsage: true },
  { name: "sudo" },
  { name: "taskset" },
  {
    name: "time",
    unwrap: unwrapTimeInvocation,
    transparentUsage: (argv) => !timeInvocationWritesOutputFile(argv)
  },
  { name: "timeout", unwrap: unwrapTimeoutInvocation, transparentUsage: true },
  {
    name: "xcrun",
    unwrap: (argv, platform) => supportsXcrunDispatchWrapper(platform) ? unwrapXcrunInvocation(argv) : null,
    transparentUsage: (_argv, platform) => supportsXcrunDispatchWrapper(platform)
  }
];
var DISPATCH_WRAPPER_SPEC_BY_NAME = new Map(
  DISPATCH_WRAPPER_SPECS.map((spec) => [spec.name, spec])
);
function expandPowerShellSwitchPrefixForms(match, smallestMatch) {
  const forms = [];
  for (let length = smallestMatch.length; length <= match.length; length += 1) {
    const prefix = match.slice(0, length);
    forms.push(`-${prefix}`, `--${prefix}`, `/${prefix}`);
  }
  return forms;
}
function expandPowerShellSwitchForms(names) {
  return names.flatMap((name) => {
    const normalized = normalizeLowercaseStringOrEmpty(name);
    return [`-${normalized}`, `--${normalized}`, `/${normalized}`];
  });
}
var POWERSHELL_COMMAND_FLAGS = [
  ...expandPowerShellSwitchPrefixForms("command", "c"),
  ...expandPowerShellSwitchPrefixForms("commandwithargs", "cwa"),
  ...expandPowerShellSwitchForms(["cwa"])
];
var POWERSHELL_FILE_FLAGS = expandPowerShellSwitchPrefixForms("file", "f");
var POWERSHELL_INLINE_FILE_FLAGS = new Set(POWERSHELL_FILE_FLAGS);
var POWERSHELL_INLINE_COMMAND_FLAGS = /* @__PURE__ */ new Set([
  ...POWERSHELL_COMMAND_FLAGS,
  ...POWERSHELL_FILE_FLAGS,
  ...expandPowerShellSwitchPrefixForms("encodedcommand", "e"),
  ...expandPowerShellSwitchPrefixForms("ec", "e")
]);
var POWERSHELL_INLINE_REST_COMMAND_FLAGS = new Set(POWERSHELL_COMMAND_FLAGS);
var POWERSHELL_OPTIONS_WITH_SEPARATE_VALUES = /* @__PURE__ */ new Set([
  ...expandPowerShellSwitchPrefixForms("configurationfile", "conf"),
  ...expandPowerShellSwitchPrefixForms("configurationname", "config"),
  ...expandPowerShellSwitchPrefixForms("custompipename", "cus"),
  ...expandPowerShellSwitchPrefixForms("encodedarguments", "encodeda"),
  ...expandPowerShellSwitchPrefixForms("executionpolicy", "ex"),
  ...expandPowerShellSwitchPrefixForms("inputformat", "inp"),
  ...expandPowerShellSwitchPrefixForms("outputformat", "o"),
  ...expandPowerShellSwitchPrefixForms("psconsolefile", "pscf"),
  ...expandPowerShellSwitchPrefixForms("settingsfile", "settings"),
  ...expandPowerShellSwitchPrefixForms("token", "to"),
  ...expandPowerShellSwitchPrefixForms("utctimestamp", "utc"),
  ...expandPowerShellSwitchPrefixForms("version", "v"),
  ...expandPowerShellSwitchPrefixForms("windowstyle", "w"),
  ...expandPowerShellSwitchPrefixForms("workingdirectory", "w"),
  ...expandPowerShellSwitchForms(["ea", "ep", "if", "of", "wd"])
]);
var POSIX_SHELL_WRAPPER_NAMES = ["ash", "bash", "dash", "fish", "ksh", "sh", "zsh"];
var WINDOWS_CMD_WRAPPER_NAMES = ["cmd"];
var POWERSHELL_WRAPPER_NAMES = ["powershell", "pwsh"];
var SHELL_MULTIPLEXER_WRAPPER_NAMES = ["busybox", "toybox"];
function withWindowsExeAliases(names) {
  const expanded = /* @__PURE__ */ new Set();
  for (const name of names) {
    expanded.add(name);
    expanded.add(`${name}.exe`);
  }
  return Array.from(expanded);
}
var POSIX_SHELL_WRAPPERS = new Set(POSIX_SHELL_WRAPPER_NAMES);
var POWERSHELL_WRAPPERS = new Set(withWindowsExeAliases(POWERSHELL_WRAPPER_NAMES));
var POSIX_SHELL_WRAPPER_CANONICAL = new Set(POSIX_SHELL_WRAPPER_NAMES);
var WINDOWS_CMD_WRAPPER_CANONICAL = new Set(WINDOWS_CMD_WRAPPER_NAMES);
var POWERSHELL_WRAPPER_CANONICAL = new Set(POWERSHELL_WRAPPER_NAMES);
var SHELL_MULTIPLEXER_WRAPPER_CANONICAL = new Set(SHELL_MULTIPLEXER_WRAPPER_NAMES);
var SHELL_WRAPPER_CANONICAL = /* @__PURE__ */ new Set([
  ...POSIX_SHELL_WRAPPER_NAMES,
  ...WINDOWS_CMD_WRAPPER_NAMES,
  ...POWERSHELL_WRAPPER_NAMES
]);
var LOGIN_STARTUP_SHELL_WRAPPER_CANONICAL = new Set(POSIX_SHELL_WRAPPER_NAMES);
var FLAG_INTERPRETER_INLINE_EVAL_SPECS = [
  {
    names: ["python", "python2", "python3", "pypy", "pypy3"],
    exactFlags: /* @__PURE__ */ new Set(["-c"]),
    shortClusterFlags: [
      {
        label: "-c",
        flag: "c",
        prefixChars: /* @__PURE__ */ new Set([
          "B",
          "E",
          "I",
          "O",
          "P",
          "R",
          "S",
          "b",
          "d",
          "i",
          "q",
          "s",
          "u",
          "v",
          "x"
        ])
      }
    ]
  },
  {
    names: ["node", "nodejs", "bun", "deno"],
    exactFlags: /* @__PURE__ */ new Set(["-e", "--eval", "-p", "--print"])
  },
  {
    names: ["awk", "gawk", "mawk", "nawk"],
    exactFlags: /* @__PURE__ */ new Set(["-e", "--source"]),
    prefixFlags: [{ label: "--source", prefix: "--source=" }]
  },
  {
    names: ["ruby"],
    exactFlags: /* @__PURE__ */ new Set(["-e"]),
    shortClusterFlags: [
      {
        label: "-e",
        flag: "e",
        prefixChars: /* @__PURE__ */ new Set(["S", "U", "W", "a", "c", "d", "l", "n", "p", "s", "v", "w"]),
        allowNumericRecordSeparator: true,
        numericValuePrefixChars: /* @__PURE__ */ new Set(["W"])
      }
    ]
  },
  {
    names: ["perl"],
    exactFlags: /* @__PURE__ */ new Set(["-e", "-E"]),
    shortClusterFlags: [
      {
        label: "-e",
        flag: "e",
        prefixChars: /* @__PURE__ */ new Set([
          "S",
          "T",
          "W",
          "X",
          "U",
          "V",
          "a",
          "c",
          "d",
          "f",
          "l",
          "n",
          "p",
          "s",
          "t",
          "u",
          "w"
        ]),
        allowNumericRecordSeparator: true,
        numericValuePrefixChars: /* @__PURE__ */ new Set(["l"])
      },
      {
        label: "-e",
        flag: "E",
        prefixChars: /* @__PURE__ */ new Set([
          "S",
          "T",
          "W",
          "X",
          "U",
          "V",
          "a",
          "c",
          "d",
          "f",
          "l",
          "n",
          "p",
          "s",
          "t",
          "u",
          "w"
        ]),
        allowNumericRecordSeparator: true,
        numericValuePrefixChars: /* @__PURE__ */ new Set(["l"])
      }
    ]
  },
  {
    names: ["php"],
    exactFlags: /* @__PURE__ */ new Set(["-r"]),
    rawExactFlags: /* @__PURE__ */ new Map([
      ["-B", "-B"],
      ["-E", "-E"],
      ["-R", "-R"]
    ])
  },
  { names: ["r", "rscript"], exactFlags: /* @__PURE__ */ new Set(["-e"]) },
  { names: ["lua"], exactFlags: /* @__PURE__ */ new Set(["-e"]) },
  { names: ["osascript"], exactFlags: /* @__PURE__ */ new Set(["-e"]) },
  {
    names: ["find"],
    exactFlags: /* @__PURE__ */ new Set(["-exec", "-execdir", "-ok", "-okdir"]),
    scanPastDoubleDash: true
  },
  {
    names: ["make", "gmake"],
    exactFlags: /* @__PURE__ */ new Set(["-f", "--file", "--makefile", "--eval"]),
    rawExactFlags: /* @__PURE__ */ new Map([["-E", "-E"]]),
    rawPrefixFlags: [{ label: "-E", prefix: "-E" }],
    prefixFlags: [
      { label: "-f", prefix: "-f" },
      { label: "--file", prefix: "--file=" },
      { label: "--makefile", prefix: "--makefile=" },
      { label: "--eval", prefix: "--eval=" }
    ]
  },
  {
    names: ["sed", "gsed"],
    exactFlags: /* @__PURE__ */ new Set(),
    rawExactFlags: /* @__PURE__ */ new Map([["-e", "-e"]]),
    rawPrefixFlags: [{ label: "-e", prefix: "-e" }]
  }
];
var POSITIONAL_INTERPRETER_INLINE_EVAL_SPECS = [
  {
    names: ["awk", "gawk", "mawk", "nawk"],
    fileFlags: /* @__PURE__ */ new Set(["-f", "--file"]),
    fileFlagPrefixes: ["-f", "--file="],
    exactValueFlags: /* @__PURE__ */ new Set([
      "-f",
      "--file",
      "-F",
      "--field-separator",
      "-v",
      "--assign",
      "-i",
      "--include",
      "-l",
      "--load",
      "-W"
    ]),
    prefixValueFlags: ["-F", "--field-separator=", "-v", "--assign=", "--include=", "--load="],
    flag: "<program>"
  },
  {
    names: ["xargs"],
    exactValueFlags: /* @__PURE__ */ new Set([
      "-a",
      "--arg-file",
      "-d",
      "--delimiter",
      "-E",
      "-I",
      "-L",
      "--max-lines",
      "-n",
      "--max-args",
      "-P",
      "--max-procs",
      "-s",
      "--max-chars"
    ]),
    exactOptionalValueFlags: /* @__PURE__ */ new Set(["--eof", "--replace"]),
    prefixValueFlags: [
      "-a",
      "--arg-file=",
      "-d",
      "--delimiter=",
      "-E",
      "--eof=",
      "-I",
      "--replace=",
      "-i",
      "-L",
      "--max-lines=",
      "-l",
      "-n",
      "--max-args=",
      "-P",
      "--max-procs=",
      "-s",
      "--max-chars="
    ],
    flag: "<command>"
  },
  {
    names: ["sed", "gsed"],
    fileFlags: /* @__PURE__ */ new Set(["-f", "--file"]),
    fileFlagPrefixes: ["-f", "--file="],
    exactValueFlags: /* @__PURE__ */ new Set(["-f", "--file", "-l", "--line-length"]),
    exactOptionalValueFlags: /* @__PURE__ */ new Set(["-i", "--in-place"]),
    prefixValueFlags: ["-f", "--file=", "--in-place=", "--line-length="],
    flag: "<program>"
  }
];
var INTERPRETER_ALLOWLIST_NAMES = new Set(
  FLAG_INTERPRETER_INLINE_EVAL_SPECS.flatMap((entry) => entry.names).concat(
    POSITIONAL_INTERPRETER_INLINE_EVAL_SPECS.flatMap((entry) => entry.names)
  )
);
var require3 = createRequire3(import.meta.url);
var MAX_COMMAND_EXPLANATION_SOURCE_CHARS = 128 * 1024;
var PARSEABLE_SHELL_WRAPPERS = new Set(POSIX_SHELL_WRAPPERS);
var POSIX_SHELL_NAMES = new Set(POSIX_SHELL_WRAPPERS);
var NO_FLAGS = /* @__PURE__ */ new Set();
var toFlagSet = (flags) => {
  if (!flags || flags.length === 0) {
    return NO_FLAGS;
  }
  return new Set(flags);
};
function collectKnownLongFlags(allowedValueFlags, deniedFlags, allowedBooleanFlags = NO_FLAGS) {
  const known = /* @__PURE__ */ new Set();
  for (const flag of allowedValueFlags) {
    if (flag.startsWith("--")) {
      known.add(flag);
    }
  }
  for (const flag of allowedBooleanFlags) {
    if (flag.startsWith("--")) {
      known.add(flag);
    }
  }
  for (const flag of deniedFlags) {
    if (flag.startsWith("--")) {
      known.add(flag);
    }
  }
  return Array.from(known);
}
function buildLongFlagPrefixMap(knownLongFlags) {
  const prefixMap = /* @__PURE__ */ new Map();
  for (const flag of knownLongFlags) {
    if (!flag.startsWith("--") || flag.length <= 2) {
      continue;
    }
    for (let length = 3; length <= flag.length; length += 1) {
      const prefix = flag.slice(0, length);
      const existing = prefixMap.get(prefix);
      if (existing === void 0) {
        prefixMap.set(prefix, flag);
        continue;
      }
      if (existing !== flag) {
        prefixMap.set(prefix, null);
      }
    }
  }
  return prefixMap;
}
function compileSafeBinProfile(fixture) {
  const allowedValueFlags = toFlagSet(fixture.allowedValueFlags);
  const allowedBooleanFlags = toFlagSet(fixture.allowedBooleanFlags);
  const deniedFlags = toFlagSet(fixture.deniedFlags);
  const knownLongFlags = collectKnownLongFlags(allowedValueFlags, deniedFlags, allowedBooleanFlags);
  return {
    minPositional: fixture.minPositional,
    maxPositional: fixture.maxPositional,
    allowedValueFlags,
    allowedBooleanFlags,
    deniedFlags,
    knownLongFlags,
    knownLongFlagsSet: new Set(knownLongFlags),
    longFlagPrefixMap: buildLongFlagPrefixMap(knownLongFlags)
  };
}
function compileSafeBinProfiles(fixtures) {
  return Object.fromEntries(
    Object.entries(fixtures).map(([name, fixture]) => [name, compileSafeBinProfile(fixture)])
  );
}
var SAFE_BIN_PROFILE_FIXTURES = {
  jq: {
    maxPositional: 1,
    allowedValueFlags: ["--arg", "--argjson", "--argstr"],
    deniedFlags: [
      "--argfile",
      "--rawfile",
      "--slurpfile",
      "--from-file",
      "--library-path",
      "-L",
      "-f"
    ]
  },
  grep: {
    // Keep grep stdin-only: pattern must come from -e/--regexp.
    // Allowing one positional is ambiguous because -e consumes the pattern and
    // frees the positional slot for a filename.
    maxPositional: 0,
    allowedValueFlags: [
      "--regexp",
      "--max-count",
      "--after-context",
      "--before-context",
      "--context",
      "--devices",
      "--binary-files",
      "--exclude",
      "--include",
      "--label",
      "-e",
      "-m",
      "-A",
      "-B",
      "-C",
      "-D"
    ],
    deniedFlags: [
      "--file",
      "--exclude-from",
      "--dereference-recursive",
      "--directories",
      "--recursive",
      "-f",
      "-d",
      "-r",
      "-R"
    ]
  },
  cut: {
    maxPositional: 0,
    allowedValueFlags: [
      "--bytes",
      "--characters",
      "--fields",
      "--delimiter",
      "--output-delimiter",
      "-b",
      "-c",
      "-f",
      "-d"
    ],
    allowedBooleanFlags: [
      "--complement",
      "--only-delimited",
      "--zero-terminated",
      "-n",
      "-s",
      "-z"
    ]
  },
  sort: {
    maxPositional: 0,
    allowedValueFlags: [
      "--key",
      "--field-separator",
      "--buffer-size",
      "--parallel",
      "--batch-size",
      "-k",
      "-t",
      "-S"
    ],
    // --compress-program can invoke an external executable and breaks stdin-only guarantees.
    // --random-source/--temporary-directory/-T are filesystem-dependent and not stdin-only.
    deniedFlags: [
      "--compress-program",
      "--files0-from",
      "--output",
      "--random-source",
      "--temporary-directory",
      "-T",
      "-o"
    ]
  },
  uniq: {
    maxPositional: 0,
    allowedValueFlags: [
      "--skip-fields",
      "--skip-chars",
      "--check-chars",
      "--group",
      "-f",
      "-s",
      "-w"
    ],
    allowedBooleanFlags: [
      "--count",
      "--repeated",
      "--unique",
      "--ignore-case",
      "--zero-terminated",
      "-c",
      "-d",
      "-u",
      "-i",
      "-z"
    ]
  },
  head: {
    maxPositional: 0,
    allowedValueFlags: ["--lines", "--bytes", "-n", "-c"],
    allowedBooleanFlags: [
      "--quiet",
      "--silent",
      "--verbose",
      "--zero-terminated",
      "-q",
      "-v",
      "-z"
    ]
  },
  tail: {
    maxPositional: 0,
    allowedValueFlags: [
      "--lines",
      "--bytes",
      "--sleep-interval",
      "--max-unchanged-stats",
      "--pid",
      "-n",
      "-c"
    ],
    allowedBooleanFlags: [
      "--quiet",
      "--silent",
      "--verbose",
      "--zero-terminated",
      "-q",
      "-v",
      "-z"
    ],
    // Follow/retry modes are unbounded and do not belong in auto-approved safe-bin use.
    deniedFlags: ["--follow", "--retry", "-F", "-f"]
  },
  tr: {
    minPositional: 1,
    maxPositional: 2,
    allowedBooleanFlags: [
      "--complement",
      "--delete",
      "--squeeze-repeats",
      "--truncate-set1",
      "-C",
      "-c",
      "-d",
      "-s",
      "-t"
    ]
  },
  wc: {
    maxPositional: 0,
    allowedBooleanFlags: [
      "--bytes",
      "--chars",
      "--lines",
      "--max-line-length",
      "--words",
      "-L",
      "-c",
      "-l",
      "-m",
      "-w"
    ],
    deniedFlags: ["--files0-from"]
  }
};
var SAFE_BIN_PROFILES = compileSafeBinProfiles(SAFE_BIN_PROFILE_FIXTURES);
var ALWAYS_DENY_SAFE_BIN_SEMANTICS = () => false;
var UNSAFE_SAFE_BIN_WARNINGS = {
  awk: "awk-family interpreters can execute commands, access ENVIRON, and write files, so prefer explicit allowlist entries or approval-gated runs instead of safeBins.",
  jq: "jq can read environment data and load jq code from modules or startup files, so prefer explicit allowlist entries or approval-gated runs instead of safeBins.",
  sed: "sed scripts can execute commands and write files, so prefer explicit allowlist entries or approval-gated runs instead of safeBins."
};
var SAFE_BIN_SEMANTIC_RULES = {
  jq: {
    validate: ALWAYS_DENY_SAFE_BIN_SEMANTICS,
    configWarning: UNSAFE_SAFE_BIN_WARNINGS.jq
  },
  awk: {
    validate: ALWAYS_DENY_SAFE_BIN_SEMANTICS,
    configWarning: UNSAFE_SAFE_BIN_WARNINGS.awk
  },
  gawk: {
    validate: ALWAYS_DENY_SAFE_BIN_SEMANTICS,
    configWarning: UNSAFE_SAFE_BIN_WARNINGS.awk
  },
  mawk: {
    validate: ALWAYS_DENY_SAFE_BIN_SEMANTICS,
    configWarning: UNSAFE_SAFE_BIN_WARNINGS.awk
  },
  nawk: {
    validate: ALWAYS_DENY_SAFE_BIN_SEMANTICS,
    configWarning: UNSAFE_SAFE_BIN_WARNINGS.awk
  },
  sed: {
    validate: ALWAYS_DENY_SAFE_BIN_SEMANTICS,
    configWarning: UNSAFE_SAFE_BIN_WARNINGS.sed
  },
  gsed: {
    validate: ALWAYS_DENY_SAFE_BIN_SEMANTICS,
    configWarning: UNSAFE_SAFE_BIN_WARNINGS.sed
  }
};
function readLockFileOwnerPayload(payload) {
  if (!payload) {
    return null;
  }
  return {
    pid: typeof payload.pid === "number" && Number.isInteger(payload.pid) && payload.pid > 0 ? payload.pid : void 0,
    createdAt: typeof payload.createdAt === "string" ? payload.createdAt : void 0,
    starttime: typeof payload.starttime === "number" && Number.isInteger(payload.starttime) && payload.starttime >= 0 ? payload.starttime : void 0
  };
}
function isLockOwnerDefinitelyStale(params) {
  const payload = readLockFileOwnerPayload(params.payload);
  if (payload?.pid) {
    if (payload.starttime !== void 0) {
      const currentStarttime = (params.getProcessStartTime ?? getFileLockProcessStartTime)(
        payload.pid
      );
      const normalizedStored = process.platform === "darwin" && payload.starttime > 1e10 ? Math.floor(payload.starttime / 1e6) : payload.starttime;
      if (currentStarttime !== null && currentStarttime !== normalizedStored) {
        return true;
      }
    }
    return (params.isPidDefinitelyDead ?? isPidDefinitelyDead)(payload.pid);
  }
  return false;
}
var JSONL_SOCKET_MAX_LINE_BYTES = 16 * 1024 * 1024;
var toStringOrUndefined = readStringValue;
var DEFAULT_SECURITY = "full";
var DEFAULT_ASK = "off";
var DEFAULT_EXEC_APPROVAL_ASK_FALLBACK = "deny";
var DEFAULT_AUTO_ALLOW_SKILLS = false;
var DEFAULT_EXEC_APPROVALS_STATE_DIR = "~/.openclaw";
var EXEC_APPROVALS_FILE = "exec-approvals.json";
var EXEC_APPROVALS_SOCKET = "exec-approvals.sock";
var EXEC_APPROVALS_LOCK_QUEUE = resolveGlobalMap(
  /* @__PURE__ */ Symbol.for("openclaw.execApprovalsLockQueue")
);
var execApprovalsProcessStartTime;
function getExecApprovalsProcessStartTime() {
  if (execApprovalsProcessStartTime === void 0) {
    execApprovalsProcessStartTime = getFileLockProcessStartTime(process.pid);
  }
  return execApprovalsProcessStartTime;
}
var EXEC_APPROVALS_SYNC_LOCK_RETRIES = 10;
var EXEC_APPROVALS_SYNC_LOCK_RETRY_MS = 20;
function hashExecApprovalsRaw(raw) {
  return raw === null ? `missing:${sha256Hex("")}` : sha256Hex(raw);
}
function isExecApprovalsTargetMissing(filePath) {
  try {
    fs6.lstatSync(filePath);
    return false;
  } catch (err) {
    if (err.code === "ENOENT") {
      return true;
    }
    throw err;
  }
}
function isExecApprovalsLockMissing(filePath) {
  try {
    const dir = fs6.realpathSync(path9.dirname(filePath));
    return isExecApprovalsTargetMissing(`${path9.join(dir, path9.basename(filePath))}.lock`);
  } catch (err) {
    if (err.code === "ENOENT") {
      return true;
    }
    throw err;
  }
}
function resolveExecApprovalsStateDir(env = process.env) {
  const override = env.OPENCLAW_STATE_DIR?.trim();
  if (override) {
    const resolved = resolveHomeRelativePath(override, { env });
    return {
      path: resolved,
      displayPath: resolved
    };
  }
  return {
    path: expandHomePrefix(DEFAULT_EXEC_APPROVALS_STATE_DIR, { env }),
    displayPath: DEFAULT_EXEC_APPROVALS_STATE_DIR
  };
}
function resolveExecApprovalsPath() {
  return path9.join(resolveExecApprovalsStateDir().path, EXEC_APPROVALS_FILE);
}
function resolveExecApprovalsSocketPath() {
  return path9.join(resolveExecApprovalsStateDir().path, EXEC_APPROVALS_SOCKET);
}
function createFailClosedExecApprovalsFallback() {
  return normalizeExecApprovals({
    version: 1,
    defaults: {
      security: "deny",
      ask: "off",
      askFallback: "deny",
      autoAllowSkills: false
    },
    agents: {}
  });
}
function hasValidExecApprovalPolicyFields(value) {
  if (!isPlainObject(value)) {
    return false;
  }
  return (value.security === void 0 || isExecSecurity(value.security)) && (value.ask === void 0 || isExecAsk(value.ask)) && (value.askFallback === void 0 || isExecSecurity(value.askFallback)) && (value.autoAllowSkills === void 0 || typeof value.autoAllowSkills === "boolean");
}
function isValidPersistedExecAllowlistEntry(value) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (!isPlainObject(value) || typeof value.pattern !== "string" || !value.pattern.trim()) {
    return false;
  }
  return (value.id === void 0 || typeof value.id === "string") && (value.source === void 0 || typeof value.source === "string") && (value.commandText === void 0 || typeof value.commandText === "string") && (value.argPattern === void 0 || typeof value.argPattern === "string") && (value.lastUsedAt === void 0 || typeof value.lastUsedAt === "number" && Number.isFinite(value.lastUsedAt)) && (value.lastUsedCommand === void 0 || typeof value.lastUsedCommand === "string") && (value.lastResolvedPath === void 0 || typeof value.lastResolvedPath === "string");
}
function isValidPersistedExecApprovals(value) {
  if (!isPlainObject(value) || value.version !== 1) {
    return false;
  }
  if (value.socket !== void 0) {
    if (!isPlainObject(value.socket) || value.socket.path !== void 0 && typeof value.socket.path !== "string" || value.socket.token !== void 0 && typeof value.socket.token !== "string") {
      return false;
    }
  }
  if (value.defaults !== void 0 && !hasValidExecApprovalPolicyFields(value.defaults)) {
    return false;
  }
  if (value.agents !== void 0) {
    if (!isPlainObject(value.agents)) {
      return false;
    }
    for (const agent of Object.values(value.agents)) {
      if (!hasValidExecApprovalPolicyFields(agent) || agent.allowlist !== void 0 && (!Array.isArray(agent.allowlist) || !agent.allowlist.every(isValidPersistedExecAllowlistEntry))) {
        return false;
      }
    }
  }
  return true;
}
function parsePersistedExecApprovals(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (isValidPersistedExecApprovals(parsed)) {
      return normalizeExecApprovals(parsed);
    }
  } catch {
  }
  return createFailClosedExecApprovalsFallback();
}
function normalizeAllowlistPattern(value) {
  const trimmed = normalizeOptionalString(value) ?? "";
  return trimmed ? normalizeLowercaseStringOrEmpty(trimmed) : null;
}
function mergeLegacyAgent(current, legacy) {
  const allowlist = [];
  const seen = /* @__PURE__ */ new Set();
  const pushEntry = (entry) => {
    const patternKey = normalizeAllowlistPattern(entry.pattern);
    if (!patternKey) {
      return;
    }
    const key = `${patternKey}\0${entry.argPattern?.trim() ?? ""}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    allowlist.push(entry);
  };
  for (const entry of current.allowlist ?? []) {
    pushEntry(entry);
  }
  for (const entry of legacy.allowlist ?? []) {
    pushEntry(entry);
  }
  return {
    security: current.security ?? legacy.security,
    ask: current.ask ?? legacy.ask,
    askFallback: current.askFallback ?? legacy.askFallback,
    autoAllowSkills: current.autoAllowSkills ?? legacy.autoAllowSkills,
    allowlist: allowlist.length > 0 ? allowlist : void 0
  };
}
function ensureDir(filePath) {
  const dir = path9.dirname(filePath);
  assertNoExecApprovalsSymlinkParents(dir, resolveRequiredHomeDir());
  fs6.mkdirSync(dir, { recursive: true });
  const dirStat = fs6.lstatSync(dir);
  if (!dirStat.isDirectory() || dirStat.isSymbolicLink()) {
    throw new Error(`Refusing to use unsafe exec approvals directory: ${dir}`);
  }
  try {
    fs6.chmodSync(dir, 448);
  } catch (err) {
    if (process.platform !== "win32") {
      throw err;
    }
  }
  return dir;
}
function resolveCanonicalExecApprovalsTarget(filePath) {
  const dir = ensureDir(filePath);
  return path9.join(fs6.realpathSync(dir), path9.basename(filePath));
}
function assertNoExecApprovalsSymlinkParents(targetPath, trustedRoot) {
  try {
    assertNoSymlinkParentsSync({
      rootDir: trustedRoot,
      targetPath,
      allowOutsideRoot: true,
      messagePrefix: "Refusing to traverse symlink in exec approvals path"
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new UnsafeExecApprovalsPathError(message, { cause: err });
  }
}
var UnsafeExecApprovalsPathError = class extends Error {
};
function assertSafeExecApprovalsStat(filePath, stat) {
  if (stat.isSymbolicLink()) {
    throw new UnsafeExecApprovalsPathError(
      `Refusing to write exec approvals via symlink: ${filePath}`
    );
  }
  if (!stat.isFile()) {
    throw new UnsafeExecApprovalsPathError(
      `Refusing to use non-file exec approvals path: ${filePath}`
    );
  }
}
function sameFilesystemEntry(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}
function readExecApprovalsRawState(filePath) {
  assertNoExecApprovalsSymlinkParents(path9.dirname(filePath), resolveRequiredHomeDir());
  let before;
  try {
    before = fs6.lstatSync(filePath);
  } catch (err) {
    if (err.code === "ENOENT") {
      return { exists: false, raw: null };
    }
    throw err;
  }
  assertSafeExecApprovalsStat(filePath, before);
  const noFollowFlag = fs6.constants.O_NOFOLLOW ?? 0;
  let fd;
  try {
    fd = fs6.openSync(filePath, fs6.constants.O_RDONLY | noFollowFlag);
  } catch (err) {
    const code = err.code;
    if (code === "ENOENT") {
      throw new UnsafeExecApprovalsPathError(
        `Refusing to read changed exec approvals path: ${filePath}`,
        { cause: err }
      );
    }
    if (code === "ELOOP") {
      throw new UnsafeExecApprovalsPathError(
        `Refusing to write exec approvals via symlink: ${filePath}`,
        { cause: err }
      );
    }
    throw err;
  }
  try {
    const opened = fs6.fstatSync(fd);
    if (!opened.isFile() || !sameFilesystemEntry(before, opened)) {
      throw new UnsafeExecApprovalsPathError(
        `Refusing to read changed exec approvals path: ${filePath}`
      );
    }
    const raw = fs6.readFileSync(fd, "utf8");
    let after;
    try {
      after = fs6.lstatSync(filePath);
    } catch (err) {
      throw new UnsafeExecApprovalsPathError(
        `Refusing to read changed exec approvals path: ${filePath}`,
        { cause: err }
      );
    }
    assertSafeExecApprovalsStat(filePath, after);
    if (!sameFilesystemEntry(opened, after)) {
      throw new UnsafeExecApprovalsPathError(
        `Refusing to read changed exec approvals path: ${filePath}`
      );
    }
    return { exists: true, raw };
  } finally {
    fs6.closeSync(fd);
  }
}
function readExecApprovalsSnapshotFromPath(filePath) {
  const state = readExecApprovalsRawState(filePath);
  if (!state.exists) {
    return {
      path: filePath,
      exists: false,
      raw: null,
      file: normalizeExecApprovals({ version: 1, agents: {} }),
      hash: hashExecApprovalsRaw(null)
    };
  }
  return {
    path: filePath,
    exists: true,
    raw: state.raw,
    file: parsePersistedExecApprovals(state.raw),
    hash: hashExecApprovalsRaw(state.raw)
  };
}
function coerceAllowlistEntries(allowlist) {
  if (!Array.isArray(allowlist) || allowlist.length === 0) {
    return Array.isArray(allowlist) ? allowlist : void 0;
  }
  let changed = false;
  const result = [];
  for (const item of allowlist) {
    if (typeof item === "string") {
      const trimmed = item.trim();
      if (trimmed) {
        result.push({ pattern: trimmed });
        changed = true;
      } else {
        changed = true;
      }
    } else if (item && typeof item === "object" && !Array.isArray(item)) {
      const pattern = item.pattern;
      if (typeof pattern === "string" && pattern.trim().length > 0) {
        result.push(item);
      } else {
        changed = true;
      }
    } else {
      changed = true;
    }
  }
  return changed ? result.length > 0 ? result : void 0 : allowlist;
}
function ensureAllowlistIds(allowlist) {
  if (!Array.isArray(allowlist) || allowlist.length === 0) {
    return allowlist;
  }
  let changed = false;
  const next = allowlist.map((entry) => {
    if (entry.id) {
      return entry;
    }
    changed = true;
    return { ...entry, id: crypto.randomUUID() };
  });
  return changed ? next : allowlist;
}
function stripAllowlistCommandText(allowlist) {
  if (!Array.isArray(allowlist) || allowlist.length === 0) {
    return allowlist;
  }
  let changed = false;
  const next = allowlist.map((entry) => {
    if (typeof entry.commandText !== "string") {
      return entry;
    }
    changed = true;
    const { commandText: _commandText, ...rest } = entry;
    return rest;
  });
  return changed ? next : allowlist;
}
function sanitizeExecApprovalPolicy(policy) {
  const security = toStringOrUndefined(policy?.security)?.trim();
  const ask = toStringOrUndefined(policy?.ask)?.trim();
  const askFallback = toStringOrUndefined(policy?.askFallback)?.trim();
  return {
    security: security === "deny" || security === "allowlist" || security === "full" ? security : void 0,
    ask: ask === "off" || ask === "on-miss" || ask === "always" ? ask : void 0,
    askFallback: askFallback === "deny" || askFallback === "allowlist" || askFallback === "full" ? askFallback : void 0,
    autoAllowSkills: policy?.autoAllowSkills
  };
}
function normalizeExecApprovals(file) {
  const socketPath = file.socket?.path?.trim();
  const token = file.socket?.token?.trim();
  const agents = { ...file.agents };
  const legacyDefault = agents.default;
  if (legacyDefault) {
    const main = agents[DEFAULT_AGENT_ID];
    agents[DEFAULT_AGENT_ID] = main ? mergeLegacyAgent(main, legacyDefault) : legacyDefault;
    delete agents.default;
  }
  for (const [key, agent] of Object.entries(agents)) {
    const coerced = coerceAllowlistEntries(agent.allowlist);
    const withIds = ensureAllowlistIds(coerced);
    const allowlist = stripAllowlistCommandText(withIds);
    const sanitizedPolicy = sanitizeExecApprovalPolicy(agent);
    const agentChanged = allowlist !== agent.allowlist || sanitizedPolicy.security !== agent.security || sanitizedPolicy.ask !== agent.ask || sanitizedPolicy.askFallback !== agent.askFallback;
    if (agentChanged) {
      agents[key] = {
        ...agent,
        allowlist,
        security: sanitizedPolicy.security,
        ask: sanitizedPolicy.ask,
        askFallback: sanitizedPolicy.askFallback
      };
    }
  }
  const sanitizedDefaults = sanitizeExecApprovalPolicy(file.defaults);
  const normalized = {
    version: 1,
    socket: {
      path: socketPath && socketPath.length > 0 ? socketPath : void 0,
      token: token && token.length > 0 ? token : void 0
    },
    defaults: {
      ...sanitizedDefaults
    },
    agents
  };
  return normalized;
}
function loadExecApprovalsUnlocked() {
  const filePath = resolveExecApprovalsPath();
  try {
    return readExecApprovalsSnapshotFromPath(filePath).file;
  } catch {
    return createFailClosedExecApprovalsFallback();
  }
}
function loadExecApprovals() {
  try {
    return withExecApprovalsReadLockSync(resolveExecApprovalsPath(), loadExecApprovalsUnlocked);
  } catch {
    return createFailClosedExecApprovalsFallback();
  }
}
function readLockPayload(raw) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function readExecApprovalsLockState(lockPath) {
  try {
    const payload = readLockPayload(fs6.readFileSync(lockPath, "utf8"));
    const ownerPid = typeof payload?.pid === "number" && Number.isInteger(payload.pid) && payload.pid > 0 ? payload.pid : null;
    return {
      ownerPid,
      definitelyStale: isLockOwnerDefinitelyStale({ payload })
    };
  } catch {
    return { ownerPid: null, definitelyStale: false };
  }
}
function sleepExecApprovalsSyncLockRetry() {
  try {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, EXEC_APPROVALS_SYNC_LOCK_RETRY_MS);
  } catch {
    const deadline = Date.now() + EXEC_APPROVALS_SYNC_LOCK_RETRY_MS;
    while (Date.now() < deadline) {
    }
  }
}
function removeOwnedExecApprovalsLock(lock, options) {
  try {
    const current = fs6.lstatSync(lock.lockPath);
    if (current.dev === lock.device && current.ino === lock.inode && (!options.requirePayloadMatch || fs6.readFileSync(lock.lockPath, "utf8") === lock.raw)) {
      fs6.rmSync(lock.lockPath, { force: true });
    }
  } catch {
  }
}
function acquireExecApprovalsLockSync(filePath) {
  const normalizedTarget = resolveCanonicalExecApprovalsTarget(filePath);
  const lockPath = `${normalizedTarget}.lock`;
  const payload = {
    pid: process.pid,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    nonce: crypto.randomUUID()
  };
  const starttime = getExecApprovalsProcessStartTime();
  if (starttime !== null) {
    payload.starttime = starttime;
  }
  const raw = `${JSON.stringify(payload, null, 2)}
`;
  for (let attempt = 0; attempt <= EXEC_APPROVALS_SYNC_LOCK_RETRIES; attempt += 1) {
    let descriptor;
    try {
      descriptor = fs6.openSync(lockPath, "wx", 384);
    } catch (err) {
      if (err.code !== "EEXIST") {
        throw err;
      }
      const state = readExecApprovalsLockState(lockPath);
      if (state.definitelyStale) {
        throw Object.assign(new Error(`Exec approvals lock has a stale owner: ${lockPath}`), {
          code: "file_lock_stale",
          lockPath
        });
      }
      if (state.ownerPid !== null && state.ownerPid !== process.pid && attempt < EXEC_APPROVALS_SYNC_LOCK_RETRIES) {
        sleepExecApprovalsSyncLockRetry();
        continue;
      }
      throw Object.assign(new Error(`Exec approvals are locked: ${lockPath}`), {
        code: "file_lock_timeout",
        lockPath
      });
    }
    let stat;
    try {
      stat = fs6.fstatSync(descriptor);
    } catch (err) {
      fs6.closeSync(descriptor);
      throw err;
    }
    const lock = {
      descriptor,
      lockPath,
      device: stat.dev,
      inode: stat.ino,
      raw
    };
    try {
      fs6.writeFileSync(descriptor, raw, "utf8");
      return lock;
    } catch (err) {
      fs6.closeSync(descriptor);
      removeOwnedExecApprovalsLock(lock, { requirePayloadMatch: false });
      throw err;
    }
  }
  throw new Error(`Failed to acquire exec approvals lock: ${lockPath}`);
}
function withExecApprovalsLockSync(fn) {
  const lock = acquireExecApprovalsLockSync(resolveExecApprovalsPath());
  try {
    return fn();
  } finally {
    fs6.closeSync(lock.descriptor);
    removeOwnedExecApprovalsLock(lock, { requirePayloadMatch: true });
  }
}
function withExecApprovalsReadLockSync(filePath, fn) {
  if (!isExecApprovalsTargetMissing(filePath) || !isExecApprovalsLockMissing(filePath)) {
    return withExecApprovalsLockSync(fn);
  }
  const result = fn();
  return isExecApprovalsLockMissing(filePath) && isExecApprovalsTargetMissing(filePath) ? result : withExecApprovalsLockSync(fn);
}
function isExecSecurity(value) {
  return value === "allowlist" || value === "full" || value === "deny";
}
function isExecAsk(value) {
  return value === "always" || value === "off" || value === "on-miss";
}
function normalizeSecurity(value, fallback) {
  return isExecSecurity(value) ? value : fallback;
}
function normalizeAsk(value, fallback) {
  return isExecAsk(value) ? value : fallback;
}
function resolveDefaultSecurityField(params) {
  const defaultValue = params.defaults[params.field];
  if (isExecSecurity(defaultValue)) {
    return {
      value: defaultValue,
      source: `defaults.${params.field}`
    };
  }
  return {
    value: params.fallback,
    source: null
  };
}
function resolveDefaultAskField(params) {
  if (isExecAsk(params.defaults.ask)) {
    return {
      value: params.defaults.ask,
      source: "defaults.ask"
    };
  }
  return {
    value: params.fallback,
    source: null
  };
}
function resolveAgentSecurityField(params) {
  const fallbackField = resolveDefaultSecurityField({
    field: params.field,
    defaults: params.defaults,
    fallback: params.fallback
  });
  const rawAgentValue = params.rawAgent[params.field];
  if (rawAgentValue != null) {
    if (isExecSecurity(params.agent[params.field])) {
      return {
        value: params.agent[params.field],
        source: `agents.${params.agentKey}.${params.field}`
      };
    }
    return fallbackField;
  }
  const rawWildcardValue = params.rawWildcard[params.field];
  if (rawWildcardValue != null) {
    if (isExecSecurity(params.wildcard[params.field])) {
      return {
        value: params.wildcard[params.field],
        source: `agents.*.${params.field}`
      };
    }
    return fallbackField;
  }
  return fallbackField;
}
function resolveAgentAskField(params) {
  const fallbackField = resolveDefaultAskField({
    defaults: params.defaults,
    fallback: params.fallback
  });
  if (params.rawAgent.ask != null) {
    if (isExecAsk(params.agent.ask)) {
      return {
        value: params.agent.ask,
        source: `agents.${params.agentKey}.ask`
      };
    }
    return fallbackField;
  }
  if (params.rawWildcard.ask != null) {
    if (isExecAsk(params.wildcard.ask)) {
      return {
        value: params.wildcard.ask,
        source: "agents.*.ask"
      };
    }
    return fallbackField;
  }
  return fallbackField;
}
function resolveExecApprovalsFromFile(params) {
  const rawFile = params.file;
  const file = normalizeExecApprovals(params.file);
  const defaults = file.defaults ?? {};
  const agentKey = params.agentId ?? DEFAULT_AGENT_ID;
  const agent = file.agents?.[agentKey] ?? {};
  const wildcard = file.agents?.["*"] ?? {};
  const rawAgent = rawFile.agents?.[agentKey] ?? {};
  const rawWildcard = rawFile.agents?.["*"] ?? {};
  const fallbackSecurity = params.overrides?.security ?? DEFAULT_SECURITY;
  const fallbackAsk = params.overrides?.ask ?? DEFAULT_ASK;
  const fallbackAskFallback = params.overrides?.askFallback ?? DEFAULT_EXEC_APPROVAL_ASK_FALLBACK;
  const fallbackAutoAllowSkills = params.overrides?.autoAllowSkills ?? DEFAULT_AUTO_ALLOW_SKILLS;
  const resolvedDefaults = {
    security: normalizeSecurity(defaults.security, fallbackSecurity),
    ask: normalizeAsk(defaults.ask, fallbackAsk),
    askFallback: normalizeSecurity(
      defaults.askFallback ?? fallbackAskFallback,
      fallbackAskFallback
    ),
    autoAllowSkills: defaults.autoAllowSkills ?? fallbackAutoAllowSkills
  };
  const resolvedAgentSecurity = resolveAgentSecurityField({
    field: "security",
    defaults,
    agent,
    rawAgent,
    wildcard,
    rawWildcard,
    agentKey,
    fallback: resolvedDefaults.security
  });
  const resolvedAgentAsk = resolveAgentAskField({
    defaults,
    agent,
    rawAgent,
    wildcard,
    rawWildcard,
    agentKey,
    fallback: resolvedDefaults.ask
  });
  const resolvedAgentAskFallback = resolveAgentSecurityField({
    field: "askFallback",
    defaults,
    agent,
    rawAgent,
    wildcard,
    rawWildcard,
    agentKey,
    fallback: resolvedDefaults.askFallback
  });
  const resolvedAgent = {
    security: resolvedAgentSecurity.value,
    ask: resolvedAgentAsk.value,
    askFallback: resolvedAgentAskFallback.value,
    autoAllowSkills: agent.autoAllowSkills ?? wildcard.autoAllowSkills ?? resolvedDefaults.autoAllowSkills
  };
  const allowlist = [
    ...Array.isArray(wildcard.allowlist) ? wildcard.allowlist : [],
    ...Array.isArray(agent.allowlist) ? agent.allowlist : []
  ];
  return {
    path: params.path ?? resolveExecApprovalsPath(),
    socketPath: expandHomePrefix(
      params.socketPath ?? file.socket?.path ?? resolveExecApprovalsSocketPath()
    ),
    token: params.token ?? file.socket?.token ?? "",
    defaults: resolvedDefaults,
    agent: resolvedAgent,
    agentSources: {
      security: resolvedAgentSecurity.source,
      ask: resolvedAgentAsk.source,
      askFallback: resolvedAgentAskFallback.source
    },
    allowlist,
    file
  };
}
var OPTIONAL_EXEC_APPROVAL_DECISIONS = [
  "allow-always"
];
var OPTIONAL_EXEC_APPROVAL_DECISION_SET = new Set(
  OPTIONAL_EXEC_APPROVAL_DECISIONS
);
export {
  loadExecApprovals,
  resolveExecApprovalsFromFile
};
