// packages/plugin-sdk/src/browser-config.ts
import path17 from "node:path";
import fs from "node:fs";
import { tmpdir as getOsTmpDir } from "node:os";
import path from "node:path";
import fs9 from "node:fs";
import path16 from "node:path";
import { fileURLToPath as fileURLToPath5 } from "node:url";
import { configureFsSafePython } from "@openclaw/fs-safe/config";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/errors";
import {
  openRootFileSync
} from "@openclaw/fs-safe/advanced";
import fs3 from "node:fs";
import os3 from "node:os";
import path5 from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";
import path2 from "node:path";
import { fileURLToPath } from "node:url";
import { default as default2 } from "node:fs";
import {
  isPathInside
} from "@openclaw/fs-safe/path";
import fs2 from "node:fs";
import os2 from "node:os";
import path4 from "node:path";
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
import path3 from "node:path";
import path7 from "node:path";
import fs4 from "node:fs";
import os4 from "node:os";
import path6 from "node:path";
import {
  safeRealpathSync as safeRealpathSync2
} from "@openclaw/fs-safe/path";
import "@openclaw/fs-safe/advanced";
import { createRequire as createRequire2 } from "node:module";
import path13 from "node:path";
import { pathToFileURL as pathToFileURL4 } from "node:url";
import path8 from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import Module from "node:module";
import path9 from "node:path";
import { pathToFileURL as pathToFileURL2 } from "node:url";
import fs7 from "node:fs";
import Module2 from "node:module";
import path12 from "node:path";
import { fileURLToPath as fileURLToPath4, pathToFileURL as pathToFileURL3 } from "node:url";
import fs6 from "node:fs";
import os5 from "node:os";
import path11 from "node:path";
import { fileURLToPath as fileURLToPath3 } from "node:url";
import "@openclaw/fs-safe/atomic";
import "@openclaw/fs-safe/atomic";
import {
  tryReadJsonSync
} from "@openclaw/fs-safe/json";
import "@openclaw/fs-safe/advanced";
import fs5 from "node:fs";
import path10 from "node:path";
import path15 from "node:path";
import fs8 from "node:fs";
import path14 from "node:path";
import { randomUUID } from "node:crypto";
import fs10 from "node:fs";
import JSON5 from "json5";
import path18 from "node:path";
import { movePathToTrash as movePathToTrash2 } from "@openclaw/fs-safe/advanced";
var POSIX_OPENCLAW_TMP_DIR = "/tmp/openclaw";
function isNodeErrorWithCode(err, code) {
  return typeof err === "object" && err !== null && "code" in err && err.code === code;
}
function resolvePreferredOpenClawTmpDir(options = {}) {
  const accessMode = fs.constants.W_OK | fs.constants.X_OK;
  const accessSync = options.accessSync ?? fs.accessSync;
  const chmodSync = options.chmodSync ?? fs.chmodSync;
  const lstatSync = options.lstatSync ?? fs.lstatSync;
  const mkdirSync = options.mkdirSync ?? fs.mkdirSync;
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
    const joiner = platform === "win32" ? path.win32.join : path.join;
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
    accessSync(path.dirname(preferredDir), accessMode);
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
var hasPythonModeOverride = process.env.FS_SAFE_PYTHON_MODE != null || process.env.OPENCLAW_FS_SAFE_PYTHON_MODE != null;
if (!hasPythonModeOverride) {
  configureFsSafePython({ mode: "off" });
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
function uniqueValues(values) {
  return [...new Set(values)];
}
function uniqueStrings(values) {
  return uniqueValues(values);
}
var CORE_PACKAGE_NAMES = /* @__PURE__ */ new Set(["openclaw"]);
var packageNameCache = /* @__PURE__ */ new Map();
var packageRootsCache = /* @__PURE__ */ new Map();
var argv1CandidateCache = /* @__PURE__ */ new Map();
function parsePackageName(raw) {
  const parsed = JSON.parse(raw);
  return typeof parsed.name === "string" ? parsed.name : null;
}
function readPackageNameSync(dir) {
  const packageJsonPath = path2.join(path2.resolve(dir), "package.json");
  if (packageNameCache.has(packageJsonPath)) {
    return packageNameCache.get(packageJsonPath) ?? null;
  }
  try {
    const name = parsePackageName(default2.readFileSync(packageJsonPath, "utf-8"));
    packageNameCache.set(packageJsonPath, name);
    return name;
  } catch {
    packageNameCache.set(packageJsonPath, null);
    return null;
  }
}
function findPackageRootSync(startDir, maxDepth = 12) {
  for (const current of iterAncestorDirs(startDir, maxDepth)) {
    const name = readPackageNameSync(current);
    if (name && CORE_PACKAGE_NAMES.has(name)) {
      return current;
    }
  }
  return null;
}
function* iterAncestorDirs(startDir, maxDepth) {
  let current = path2.resolve(startDir);
  for (let i = 0; i < maxDepth; i += 1) {
    yield current;
    if (path2.basename(current) === "node_modules") {
      break;
    }
    const parent = path2.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
}
function candidateDirsFromArgv1(argv1) {
  const cacheKey = path2.resolve(argv1);
  const cached = argv1CandidateCache.get(cacheKey);
  if (cached) {
    return [...cached];
  }
  const normalized = path2.resolve(argv1);
  const candidates = [];
  try {
    const resolved = default2.realpathSync(normalized);
    if (resolved !== normalized) {
      candidates.push(path2.dirname(resolved));
    }
  } catch {
  }
  candidates.push(path2.dirname(normalized));
  const parts = normalized.split(path2.sep);
  const binIndex = parts.lastIndexOf(".bin");
  if (binIndex > 0 && parts[binIndex - 1] === "node_modules") {
    const binName = path2.basename(normalized);
    const nodeModulesDir = parts.slice(0, binIndex).join(path2.sep);
    candidates.push(path2.join(nodeModulesDir, binName));
  }
  const deduped = dedupeCandidates(candidates);
  argv1CandidateCache.set(cacheKey, deduped);
  return [...deduped];
}
function resolveOpenClawPackageRootsSync(opts) {
  const candidates = buildCandidates(opts);
  const cacheKey = createPackageRootCacheKey(candidates);
  const cached = packageRootsCache.get(cacheKey);
  if (cached) {
    return [...cached];
  }
  const seen = /* @__PURE__ */ new Set();
  const roots = [];
  for (const candidate of candidates) {
    const found = findPackageRootSync(candidate);
    if (found && !seen.has(found)) {
      seen.add(found);
      roots.push(found);
    }
  }
  packageRootsCache.set(cacheKey, roots);
  return [...roots];
}
function resolveOpenClawPackageRootSync(opts) {
  return resolveOpenClawPackageRootsSync(opts)[0] ?? null;
}
function buildCandidates(opts) {
  const candidates = [];
  if (opts.moduleUrl) {
    try {
      candidates.push(path2.dirname(fileURLToPath(opts.moduleUrl)));
    } catch {
    }
  }
  if (opts.argv1) {
    candidates.push(...candidateDirsFromArgv1(opts.argv1));
  }
  if (opts.cwd) {
    candidates.push(opts.cwd);
  }
  return dedupeCandidates(candidates);
}
function dedupeCandidates(candidates) {
  const seen = /* @__PURE__ */ new Set();
  const deduped = [];
  for (const candidate of candidates) {
    const resolved = path2.resolve(candidate);
    if (seen.has(resolved)) {
      continue;
    }
    seen.add(resolved);
    deduped.push(resolved);
  }
  return deduped;
}
function createPackageRootCacheKey(candidates) {
  return candidates.join("\0");
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
  return path3.resolve(prefix, "..", "home");
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
  return raw ? path3.resolve(raw) : void 0;
}
function resolveRequiredHomeDir(env = process.env, homedir = os.homedir) {
  const resolved = resolveEffectiveHomeDir(env, homedir) ?? tryProcessCwd();
  if (resolved) {
    return path3.resolve(resolved);
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
    return path3.resolve(expanded);
  }
  return path3.resolve(trimmed);
}
function resolveUserPath(input, env = process.env, homedir = os.homedir) {
  if (!input) {
    return "";
  }
  return resolveHomeRelativePath(input, { env, homedir });
}
var MAX_TIMER_TIMEOUT_MS = 2147e6;
var MAX_TIMER_TIMEOUT_SECONDS = Math.floor(MAX_TIMER_TIMEOUT_MS / 1e3);
function resolveIntegerOption(value, fallback, range = {}) {
  const candidate = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  const floored = Math.floor(candidate);
  const minBounded = range.min === void 0 ? floored : Math.max(range.min, floored);
  return range.max === void 0 ? minBounded : Math.min(range.max, minBounded);
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
function resolveConfigDir(env = process.env, homedir = os2.homedir) {
  const override = env.OPENCLAW_STATE_DIR?.trim();
  if (override) {
    return resolveUserPath(override, env, homedir);
  }
  const configPath = env.OPENCLAW_CONFIG_PATH?.trim();
  if (configPath) {
    return path4.dirname(resolveUserPath(configPath, env, homedir));
  }
  const newDir = path4.join(resolveRequiredHomeDir(env, homedir), ".openclaw");
  try {
    const hasNew = fs2.existsSync(newDir);
    if (hasNew) {
      return newDir;
    }
  } catch {
  }
  return newDir;
}
var CONFIG_DIR = resolveConfigDir();
var DISABLED_BUNDLED_PLUGINS_DIR = path5.join(os3.tmpdir(), "openclaw-empty-bundled-plugins");
var TEST_TRUST_BUNDLED_PLUGINS_DIR_ENV = "OPENCLAW_TEST_TRUST_BUNDLED_PLUGINS_DIR";
var bundledPluginsDirCache = /* @__PURE__ */ new Map();
function areBundledPluginsDisabled(env = process.env) {
  const raw = normalizeOptionalLowercaseString(env.OPENCLAW_DISABLE_BUNDLED_PLUGINS);
  return raw === "1" || raw === "true";
}
function resolveDisabledBundledPluginsDir() {
  fs3.mkdirSync(DISABLED_BUNDLED_PLUGINS_DIR, { recursive: true });
  return DISABLED_BUNDLED_PLUGINS_DIR;
}
function isSourceCheckoutRoot(packageRoot) {
  return fs3.existsSync(path5.join(packageRoot, "pnpm-workspace.yaml")) && fs3.existsSync(path5.join(packageRoot, "src")) && fs3.existsSync(path5.join(packageRoot, "extensions"));
}
function isTruthyEnvValue(value) {
  const normalized = value?.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}
function shouldTrustTestBundledPluginsDirOverride(env) {
  const isVitestProcess = Boolean(env.VITEST) || Boolean(process.env.VITEST);
  return isVitestProcess && (isTruthyEnvValue(env[TEST_TRUST_BUNDLED_PLUGINS_DIR_ENV]) || isTruthyEnvValue(process.env[TEST_TRUST_BUNDLED_PLUGINS_DIR_ENV]));
}
function hasUsableBundledPluginTree(pluginsDir) {
  if (!fs3.existsSync(pluginsDir)) {
    return false;
  }
  try {
    return fs3.readdirSync(pluginsDir, { withFileTypes: true }).some((entry) => {
      if (!entry.isDirectory()) {
        return false;
      }
      const pluginDir = path5.join(pluginsDir, entry.name);
      return fs3.existsSync(path5.join(pluginDir, "package.json")) || fs3.existsSync(path5.join(pluginDir, "openclaw.plugin.json"));
    });
  } catch {
    return false;
  }
}
function safeRealpathSync(targetPath) {
  try {
    return fs3.realpathSync.native(targetPath);
  } catch {
    return null;
  }
}
function pathContains(parentDir, childPath) {
  return isPathInside(parentDir, childPath);
}
function trustedBundledPluginRootsForPackageRoot(packageRoot) {
  const roots = [
    path5.join(packageRoot, "dist", "extensions"),
    path5.join(packageRoot, "dist-runtime", "extensions")
  ];
  if (isSourceCheckoutRoot(packageRoot)) {
    roots.push(path5.join(packageRoot, "extensions"));
  }
  return roots;
}
function resolveTrustedExistingOverride(resolvedOverride) {
  const realOverride = safeRealpathSync(resolvedOverride);
  if (!realOverride) {
    return null;
  }
  const modulePackageRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
  const packageRoots = modulePackageRoot ? [modulePackageRoot] : [];
  const trustedRoots = packageRoots.flatMap((packageRoot) => trustedBundledPluginRootsForPackageRoot(packageRoot)).map((trustedRoot) => safeRealpathSync(trustedRoot)).filter((entry) => Boolean(entry));
  if (!trustedRoots.some((trustedRoot) => pathContains(trustedRoot, realOverride))) {
    return null;
  }
  if (!hasUsableBundledPluginTree(realOverride)) {
    return null;
  }
  return realOverride;
}
function overrideResolvesUnderPackageBundledRoot(params) {
  const realOverride = safeRealpathSync(params.resolvedOverride);
  if (!realOverride) {
    return false;
  }
  return trustedBundledPluginRootsForPackageRoot(params.packageRoot).map((trustedRoot) => safeRealpathSync(trustedRoot)).filter((entry) => Boolean(entry)).some((trustedRoot) => pathContains(trustedRoot, realOverride));
}
function resolveBundledDirFromPackageRoot(packageRoot) {
  const sourceExtensionsDir = path5.join(packageRoot, "extensions");
  const builtExtensionsDir = path5.join(packageRoot, "dist", "extensions");
  const sourceCheckout = isSourceCheckoutRoot(packageRoot);
  const hasUsableSourceTree = sourceCheckout && hasUsableBundledPluginTree(sourceExtensionsDir);
  const runtimeExtensionsDir = path5.join(packageRoot, "dist-runtime", "extensions");
  const hasUsableRuntimeTree = sourceCheckout ? hasUsableBundledPluginTree(runtimeExtensionsDir) : fs3.existsSync(runtimeExtensionsDir);
  const hasUsableBuiltTree = sourceCheckout ? hasUsableBundledPluginTree(builtExtensionsDir) : fs3.existsSync(builtExtensionsDir);
  if (sourceCheckout && hasUsableBuiltTree) {
    return builtExtensionsDir;
  }
  if (sourceCheckout && hasUsableRuntimeTree) {
    return runtimeExtensionsDir;
  }
  if (hasUsableRuntimeTree && hasUsableBuiltTree) {
    return runtimeExtensionsDir;
  }
  if (hasUsableBuiltTree) {
    return builtExtensionsDir;
  }
  if (hasUsableSourceTree) {
    return sourceExtensionsDir;
  }
  return void 0;
}
function createBundledPluginsDirCacheKey(env) {
  return JSON.stringify({
    disabled: env.OPENCLAW_DISABLE_BUNDLED_PLUGINS ?? "",
    override: env.OPENCLAW_BUNDLED_PLUGINS_DIR ?? "",
    trustOverride: env[TEST_TRUST_BUNDLED_PLUGINS_DIR_ENV] ?? "",
    processTrustOverride: process.env[TEST_TRUST_BUNDLED_PLUGINS_DIR_ENV] ?? "",
    vitest: env.VITEST ?? "",
    processVitest: process.env.VITEST ?? "",
    nodeEnv: process.env.NODE_ENV ?? "",
    argv1: process.argv[1] ?? "",
    execPath: process.execPath,
    openClawHome: env.OPENCLAW_HOME ?? "",
    home: env.HOME ?? "",
    userProfile: env.USERPROFILE ?? ""
  });
}
function resolveBundledPluginsDirUncached(env) {
  if (areBundledPluginsDisabled(env)) {
    return resolveDisabledBundledPluginsDir();
  }
  const override = env.OPENCLAW_BUNDLED_PLUGINS_DIR?.trim();
  let rejectedExistingOverride = null;
  if (override) {
    const resolvedOverride = resolveUserPath(override, env);
    if (fs3.existsSync(resolvedOverride)) {
      if (shouldTrustTestBundledPluginsDirOverride(env)) {
        return path5.resolve(resolvedOverride);
      }
      const trustedOverride = resolveTrustedExistingOverride(resolvedOverride);
      if (trustedOverride) {
        return trustedOverride;
      }
      rejectedExistingOverride = resolvedOverride;
    }
  }
  try {
    const argvRoot = resolveOpenClawPackageRootSync({ argv1: process.argv[1] });
    const rejectedOverrideUsesArgvRoot = Boolean(
      argvRoot && rejectedExistingOverride && overrideResolvesUnderPackageBundledRoot({
        resolvedOverride: rejectedExistingOverride,
        packageRoot: argvRoot
      })
    );
    const safeArgvRoot = rejectedOverrideUsesArgvRoot ? null : argvRoot;
    const moduleRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
    const packageRoots = uniqueStrings(
      [safeArgvRoot, moduleRoot].filter((entry) => Boolean(entry))
    );
    for (const packageRoot of packageRoots) {
      const bundledDir = resolveBundledDirFromPackageRoot(packageRoot);
      if (bundledDir) {
        return bundledDir;
      }
    }
  } catch {
  }
  try {
    const execDir = path5.dirname(process.execPath);
    const siblingBuilt = path5.join(execDir, "dist", "extensions");
    if (fs3.existsSync(siblingBuilt)) {
      return siblingBuilt;
    }
    const sibling = path5.join(execDir, "extensions");
    if (fs3.existsSync(sibling)) {
      return sibling;
    }
  } catch {
  }
  try {
    let cursor = path5.dirname(fileURLToPath2(import.meta.url));
    for (let i = 0; i < 6; i += 1) {
      const candidate = path5.join(cursor, "extensions");
      if (fs3.existsSync(candidate)) {
        return candidate;
      }
      const parent = path5.dirname(cursor);
      if (parent === cursor) {
        break;
      }
      cursor = parent;
    }
  } catch {
  }
  return void 0;
}
function resolveBundledPluginsDir(env = process.env) {
  const cacheKey = createBundledPluginsDirCacheKey(env);
  if (bundledPluginsDirCache.has(cacheKey)) {
    return bundledPluginsDirCache.get(cacheKey);
  }
  const resolved = resolveBundledPluginsDirUncached(env);
  bundledPluginsDirCache.set(cacheKey, resolved);
  return resolved;
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
  return resolveRequiredHomeDir(process.env, os4.homedir);
}
function envHomedir(env) {
  return () => resolveRequiredHomeDir(env, os4.homedir);
}
function legacyStateDirs(homedir = resolveDefaultHomeDir) {
  return LEGACY_STATE_DIRNAMES.map((dir) => path6.join(homedir(), dir));
}
function newStateDir(homedir = resolveDefaultHomeDir) {
  return path6.join(homedir(), NEW_STATE_DIRNAME);
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
  const hasNew = fs4.existsSync(newDir);
  if (hasNew) {
    return newDir;
  }
  const existingLegacy = legacyDirs.find((dir) => {
    try {
      return fs4.existsSync(dir);
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
  return path6.join(stateDir, CONFIG_FILENAME);
}
function resolveConfigPathCandidate(env = process.env, homedir = envHomedir(env)) {
  if (env.OPENCLAW_TEST_FAST === "1") {
    return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
  }
  const candidates = resolveDefaultConfigCandidates(env, homedir);
  const existing = candidates.find((candidate) => {
    try {
      return fs4.existsSync(candidate);
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
    return path6.join(stateDir, CONFIG_FILENAME);
  }
  const stateOverride = env.OPENCLAW_STATE_DIR?.trim();
  const candidates = [
    path6.join(stateDir, CONFIG_FILENAME),
    ...LEGACY_CONFIG_FILENAMES.map((name) => path6.join(stateDir, name))
  ];
  const existing = candidates.find((candidate) => {
    try {
      return fs4.existsSync(candidate);
    } catch {
      return false;
    }
  });
  if (existing) {
    return existing;
  }
  if (stateOverride) {
    return path6.join(stateDir, CONFIG_FILENAME);
  }
  const defaultStateDir = resolveStateDir(env, homedir);
  if (path6.resolve(stateDir) === path6.resolve(defaultStateDir)) {
    return resolveConfigPathCandidate(env, homedir);
  }
  return path6.join(stateDir, CONFIG_FILENAME);
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
    candidates.push(path6.join(resolved, CONFIG_FILENAME));
    candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path6.join(resolved, name)));
  }
  const defaultDirs = [newStateDir(effectiveHomedir), ...legacyStateDirs(effectiveHomedir)];
  for (const dir of defaultDirs) {
    candidates.push(path6.join(dir, CONFIG_FILENAME));
    candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path6.join(dir, name)));
  }
  return candidates;
}
var NIX_STORE_ROOT = "/nix/store";
function isNixStorePluginRoot(rootDir, realpathCache) {
  const rootRealPath = safeRealpathSync2(rootDir, realpathCache) ?? path7.resolve(rootDir);
  return rootRealPath === NIX_STORE_ROOT || rootRealPath.startsWith(`${NIX_STORE_ROOT}/`);
}
function shouldRejectHardlinkedPluginFiles(params) {
  if (params.origin === "bundled") {
    return false;
  }
  if (resolveIsNixMode(params.env) && isNixStorePluginRoot(params.rootDir, params.realpathCache)) {
    return false;
  }
  return true;
}
function toSafeImportPath(specifier) {
  if (process.platform !== "win32") {
    return specifier;
  }
  if (specifier.startsWith("file://")) {
    return specifier;
  }
  if (path8.win32.isAbsolute(specifier)) {
    return pathToFileURL(specifier, { windows: true }).href;
  }
  return specifier;
}
var nodeRequire = createRequire(import.meta.url);
var moduleWithResolver = Module;
function isJavaScriptModulePath(modulePath) {
  return [".js", ".mjs", ".cjs"].includes(path9.extname(modulePath).toLowerCase());
}
function isMissingTargetModuleError(error, modulePath) {
  if (error.code !== "MODULE_NOT_FOUND" || typeof error.message !== "string") {
    return false;
  }
  const firstLine = error.message.split("\n", 1)[0] ?? "";
  return firstLine.includes(`'${modulePath}'`) || firstLine.includes(`"${modulePath}"`);
}
function isSourceTransformFallbackError(error, modulePath) {
  if (!error || typeof error !== "object") {
    return false;
  }
  const candidate = error;
  const code = candidate.code;
  return code === "ERR_REQUIRE_ESM" || code === "ERR_REQUIRE_ASYNC_MODULE" || isMissingTargetModuleError(candidate, modulePath);
}
function tryNativeRequireJavaScriptModule(modulePath, options = {}) {
  if (process.platform === "win32" && options.allowWindows !== true) {
    return { ok: false };
  }
  if (!isJavaScriptModulePath(modulePath)) {
    return { ok: false };
  }
  try {
    return { ok: true, moduleExport: requireWithOptionalAliases(modulePath, options.aliasMap) };
  } catch (error) {
    const code = error && typeof error === "object" ? error.code : void 0;
    if (isSourceTransformFallbackError(error, modulePath) || options.fallbackOnNativeError || options.fallbackOnMissingDependency === true && (code === "MODULE_NOT_FOUND" || code === "ERR_MODULE_NOT_FOUND")) {
      return { ok: false };
    }
    throw error;
  }
}
function requireWithOptionalAliases(modulePath, aliasMap) {
  return withNativeRequireAliases(aliasMap, () => nodeRequire(modulePath));
}
function withNativeRequireAliases(aliasMap, run) {
  if (!aliasMap || Object.keys(aliasMap).length === 0 || !moduleWithResolver["_resolveFilename"]) {
    return run();
  }
  const originalResolveFilename = moduleWithResolver["_resolveFilename"];
  const esmHooks = moduleWithResolver.registerHooks?.({
    resolve(specifier, context, nextResolve) {
      const aliasTarget = aliasMap[specifier];
      if (aliasTarget) {
        return {
          shortCircuit: true,
          url: pathToFileURL2(aliasTarget).href
        };
      }
      return nextResolve(specifier, context);
    }
  });
  moduleWithResolver["_resolveFilename"] = ((request, parent, isMain, options) => {
    const aliasTarget = aliasMap[request];
    if (aliasTarget) {
      return aliasTarget;
    }
    return originalResolveFilename(request, parent, isMain, options);
  });
  try {
    return run();
  } finally {
    moduleWithResolver["_resolveFilename"] = originalResolveFilename;
    esmHooks?.deregister();
  }
}
var PluginLruCache = class {
  #defaultMaxEntries;
  #maxEntries;
  #entries = /* @__PURE__ */ new Map();
  constructor(defaultMaxEntries) {
    this.#defaultMaxEntries = normalizeMaxEntries(defaultMaxEntries, 1);
    this.#maxEntries = this.#defaultMaxEntries;
  }
  get maxEntries() {
    return this.#maxEntries;
  }
  get size() {
    return this.#entries.size;
  }
  setMaxEntriesForTest(value) {
    this.#maxEntries = typeof value === "number" ? normalizeMaxEntries(value, this.#defaultMaxEntries) : this.#defaultMaxEntries;
    this.#evictOldestEntries();
  }
  clear() {
    this.#entries.clear();
  }
  /** Returns a cached value and refreshes its recency when present. */
  get(cacheKey) {
    const cached = this.getResult(cacheKey);
    return cached.hit ? cached.value : void 0;
  }
  /** Returns a hit/miss result and promotes hits to the newest LRU position. */
  getResult(cacheKey) {
    if (!this.#entries.has(cacheKey)) {
      return { hit: false };
    }
    const cached = this.#entries.get(cacheKey);
    this.#entries.delete(cacheKey);
    this.#entries.set(cacheKey, cached);
    return { hit: true, value: cached };
  }
  /** Stores a value as the newest entry and evicts oldest entries past capacity. */
  set(cacheKey, value) {
    if (this.#entries.has(cacheKey)) {
      this.#entries.delete(cacheKey);
    }
    this.#entries.set(cacheKey, value);
    this.#evictOldestEntries();
  }
  #evictOldestEntries() {
    while (this.#entries.size > this.#maxEntries) {
      const oldestEntry = this.#entries.keys().next();
      if (oldestEntry.done) {
        break;
      }
      this.#entries.delete(oldestEntry.value);
    }
  }
};
function normalizeMaxEntries(value, fallback) {
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return Math.max(1, Math.floor(value));
}
var OPENCLAW_DEV_SOURCE_ROOT_ENV = "OPENCLAW_DEV_SOURCE_ROOT";
function readPackageName(packageJsonPath) {
  try {
    const parsed = JSON.parse(fs5.readFileSync(packageJsonPath, "utf-8"));
    return typeof parsed.name === "string" ? parsed.name : null;
  } catch {
    return null;
  }
}
function resolveOpenClawDevSourceRoot(env = process.env) {
  const rawRoot = env[OPENCLAW_DEV_SOURCE_ROOT_ENV]?.trim();
  if (!rawRoot) {
    return null;
  }
  const resolvedRoot = resolveUserPath(rawRoot, env);
  const realRoot = safeRealpathSync2(resolvedRoot);
  if (!realRoot) {
    return null;
  }
  if (readPackageName(path10.join(realRoot, "package.json")) !== "openclaw") {
    return null;
  }
  if (!fs5.existsSync(path10.join(realRoot, "src"))) {
    return null;
  }
  if (!fs5.existsSync(path10.join(realRoot, "extensions"))) {
    return null;
  }
  return realRoot;
}
var STARTUP_ARGV1 = process.argv[1];
var pluginSdkPackageJsonByRoot = /* @__PURE__ */ new Map();
function sanitizeJitiCachePathSegment(value) {
  const normalized = value.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
  return normalized.length > 0 ? normalized : "unknown";
}
function resolveJitiFsCacheTmpDir() {
  let tmpDir = os5.tmpdir();
  if (process.env.TMPDIR && tmpDir === process.cwd() && !process.env.JITI_RESPECT_TMPDIR_ENV) {
    const originalTmpDir = process.env.TMPDIR;
    delete process.env.TMPDIR;
    try {
      tmpDir = os5.tmpdir();
    } finally {
      process.env.TMPDIR = originalTmpDir;
    }
  }
  return tmpDir;
}
function readJitiBooleanEnv(name, defaultValue) {
  if (!(name in process.env)) {
    return defaultValue;
  }
  try {
    return Boolean(JSON.parse(process.env[name] ?? ""));
  } catch {
    return defaultValue;
  }
}
function shouldUseJitiFsCache() {
  return readJitiBooleanEnv("JITI_FS_CACHE", readJitiBooleanEnv("JITI_CACHE", true));
}
function resolvePluginLoaderJitiNativeModules() {
  try {
    const configured = JSON.parse(process.env.JITI_NATIVE_MODULES ?? "[]");
    const nativeModules = Array.isArray(configured) ? configured.filter((entry) => typeof entry === "string") : [];
    return [.../* @__PURE__ */ new Set([...nativeModules, "openclaw"])];
  } catch {
    return ["openclaw"];
  }
}
function normalizeJitiAliasTargetPath(targetPath) {
  return process.platform === "win32" ? targetPath.replace(/\\/g, "/") : targetPath;
}
function resolveLoaderModulePath(params = {}) {
  return params.modulePath ?? fileURLToPath3(params.moduleUrl ?? import.meta.url);
}
function readPluginSdkPackageJson(packageRoot) {
  const cacheKey = path11.resolve(packageRoot);
  if (pluginSdkPackageJsonByRoot.has(cacheKey)) {
    return pluginSdkPackageJsonByRoot.get(cacheKey) ?? null;
  }
  const parsed = tryReadJsonSync(path11.join(packageRoot, "package.json"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    pluginSdkPackageJsonByRoot.set(cacheKey, null);
    return null;
  }
  pluginSdkPackageJsonByRoot.set(cacheKey, parsed);
  return parsed;
}
function resolveJitiCacheModulePath(params = {}) {
  if (params.modulePath?.startsWith("file://")) {
    try {
      return fileURLToPath3(params.modulePath);
    } catch {
    }
  }
  return resolveLoaderModulePath(params);
}
function resolvePluginLoaderJitiFsCacheDir(params = {}) {
  const modulePath = resolveJitiCacheModulePath(params);
  const packageRoot = resolveLoaderPackageRoot({ ...params, modulePath }) ?? path11.dirname(modulePath);
  const packageJsonPath = path11.join(packageRoot, "package.json");
  const version = sanitizeJitiCachePathSegment(
    readPluginSdkPackageJson(packageRoot)?.version ?? "unknown"
  );
  let installMarker = "no-package-json";
  try {
    const stat = fs6.statSync(packageJsonPath);
    installMarker = `${Math.trunc(stat.mtimeMs)}-${stat.size}`;
  } catch {
  }
  return path11.join(
    resolveJitiFsCacheTmpDir(),
    "jiti",
    "openclaw",
    version,
    sanitizeJitiCachePathSegment(installMarker)
  );
}
function resolvePluginLoaderJitiFsCacheOption(params = {}) {
  return shouldUseJitiFsCache() ? resolvePluginLoaderJitiFsCacheDir(params) : false;
}
function isSafePluginSdkSubpathSegment(subpath) {
  return /^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(subpath);
}
function listPluginSdkSubpathsFromPackageJson(pkg) {
  return Object.keys(pkg.exports ?? {}).filter((key) => key.startsWith("./plugin-sdk/")).map((key) => key.slice("./plugin-sdk/".length)).filter((subpath) => isSafePluginSdkSubpathSegment(subpath)).toSorted();
}
function hasTrustedOpenClawRootIndicator(params) {
  const packageExports = params.packageJson.exports ?? {};
  const hasPluginSdkSubpathExport = Object.keys(packageExports).some(
    (key) => key.startsWith("./plugin-sdk/")
  );
  if (!hasPluginSdkSubpathExport) {
    return false;
  }
  const hasCliEntryExport = Object.hasOwn(packageExports, "./cli-entry");
  const hasOpenClawBin = typeof params.packageJson.bin === "string" && normalizeLowercaseStringOrEmpty(params.packageJson.bin).includes("openclaw") || typeof params.packageJson.bin === "object" && params.packageJson.bin !== null && typeof params.packageJson.bin.openclaw === "string";
  const hasOpenClawEntrypoint = fs6.existsSync(path11.join(params.packageRoot, "openclaw.mjs"));
  return hasCliEntryExport || hasOpenClawBin || hasOpenClawEntrypoint;
}
function readPluginSdkSubpathsFromPackageRoot(packageRoot) {
  const pkg = readPluginSdkPackageJson(packageRoot);
  if (!pkg) {
    return null;
  }
  if (!hasTrustedOpenClawRootIndicator({ packageRoot, packageJson: pkg })) {
    return null;
  }
  const subpaths = listPluginSdkSubpathsFromPackageJson(pkg);
  return subpaths.length > 0 ? subpaths : null;
}
function resolveTrustedOpenClawRootFromArgvHint(params) {
  if (!params.argv1) {
    return null;
  }
  const packageRoot = resolveOpenClawPackageRootSync({
    cwd: params.cwd,
    argv1: params.argv1
  });
  if (!packageRoot) {
    return null;
  }
  const packageJson = readPluginSdkPackageJson(packageRoot);
  if (!packageJson) {
    return null;
  }
  return hasTrustedOpenClawRootIndicator({ packageRoot, packageJson }) ? packageRoot : null;
}
function findNearestPluginSdkPackageRoot(startDir, maxDepth = 12) {
  let cursor = path11.resolve(startDir);
  for (let i = 0; i < maxDepth; i += 1) {
    const subpaths = readPluginSdkSubpathsFromPackageRoot(cursor);
    if (subpaths) {
      return cursor;
    }
    const parent = path11.dirname(cursor);
    if (parent === cursor) {
      break;
    }
    cursor = parent;
  }
  return null;
}
function resolveLoaderPackageRoot(params) {
  const cwd = params.cwd ?? path11.dirname(params.modulePath);
  const fromModulePath = resolveOpenClawPackageRootSync({ cwd });
  if (fromModulePath) {
    return fromModulePath;
  }
  const argv1 = params.argv1 ?? process.argv[1];
  const moduleUrl = params.moduleUrl ?? (params.modulePath ? void 0 : import.meta.url);
  return resolveOpenClawPackageRootSync({
    cwd,
    ...argv1 ? { argv1 } : {},
    ...moduleUrl ? { moduleUrl } : {}
  });
}
function resolveDevSourceRootParam(params) {
  return params.devSourceRoot !== void 0 ? params.devSourceRoot : resolveOpenClawDevSourceRoot(process.env);
}
function resolveLoaderPluginSdkPackageRoot(params) {
  const devSourceRoot = resolveDevSourceRootParam(params);
  if (devSourceRoot) {
    return devSourceRoot;
  }
  const cwd = params.cwd ?? path11.dirname(params.modulePath);
  const fromCwd = resolveOpenClawPackageRootSync({ cwd });
  const fromExplicitHints = resolveTrustedOpenClawRootFromArgvHint({ cwd, argv1: params.argv1 }) ?? (params.moduleUrl ? resolveOpenClawPackageRootSync({
    cwd,
    moduleUrl: params.moduleUrl
  }) : null);
  return fromCwd ?? fromExplicitHints ?? findNearestPluginSdkPackageRoot(path11.dirname(params.modulePath)) ?? (params.cwd ? findNearestPluginSdkPackageRoot(params.cwd) : null) ?? findNearestPluginSdkPackageRoot(process.cwd());
}
function resolvePluginSdkAliasCandidateOrder(params) {
  if (params.pluginSdkResolution === "dist") {
    return ["dist", "src"];
  }
  if (params.pluginSdkResolution === "src") {
    return ["src", "dist"];
  }
  const normalizedModulePath = params.modulePath.replace(/\\/g, "/");
  const isDistRuntime = normalizedModulePath.includes("/dist/");
  return isDistRuntime || params.isProduction ? ["dist", "src"] : ["src", "dist"];
}
var MAX_PLUGIN_LOADER_ALIAS_CACHE_ENTRIES = 512;
var cachedPluginSdkExportedSubpaths = new PluginLruCache(
  MAX_PLUGIN_LOADER_ALIAS_CACHE_ENTRIES
);
var cachedPluginSdkScopedAliasMaps = new PluginLruCache(
  MAX_PLUGIN_LOADER_ALIAS_CACHE_ENTRIES
);
var cachedBundledPluginPublicSurfaceAliasMaps = new PluginLruCache(
  MAX_PLUGIN_LOADER_ALIAS_CACHE_ENTRIES
);
var PLUGIN_SDK_PACKAGE_NAMES = ["openclaw/plugin-sdk", "@openclaw/plugin-sdk"];
var CODEX_NATIVE_TASK_RUNTIME_PLUGIN_SDK_SUBPATH = "codex-native-task-runtime";
var CODEX_MCP_PROJECTION_PLUGIN_SDK_SUBPATH = "codex-mcp-projection";
var OLLAMA_CONFIGURED_LOCAL_ORIGIN_RUNTIME_PLUGIN_SDK_SUBPATH = "ssrf-runtime-internal";
var PRIVATE_QA_ONLY_PLUGIN_SDK_SUBPATHS = /* @__PURE__ */ new Set([
  "agent-runtime-test-contracts",
  "channel-contract-testing",
  "channel-target-testing",
  "channel-test-helpers",
  "plugin-test-api",
  "plugin-test-contracts",
  "plugin-state-test-runtime",
  "plugin-test-runtime",
  "provider-http-test-mocks",
  "provider-test-contracts",
  "qa-channel",
  "qa-channel-protocol",
  "qa-lab",
  "qa-runtime",
  "reply-payload-testing",
  "sqlite-runtime-testing",
  "test-env",
  "test-fixtures",
  "test-live",
  "test-live-auth",
  "test-media-generation",
  "test-media-understanding",
  "test-node-mocks"
]);
var PRIVATE_PLUGIN_SDK_SUBPATH_OWNERS = [
  {
    bundledPluginId: "codex",
    officialInstalledPackageName: "@openclaw/codex",
    allowPrivateQaCli: true,
    subpaths: [
      CODEX_NATIVE_TASK_RUNTIME_PLUGIN_SDK_SUBPATH,
      CODEX_MCP_PROJECTION_PLUGIN_SDK_SUBPATH
    ]
  },
  {
    bundledPluginId: "ollama",
    allowPrivateQaCli: false,
    subpaths: [OLLAMA_CONFIGURED_LOCAL_ORIGIN_RUNTIME_PLUGIN_SDK_SUBPATH]
  },
  {
    bundledPluginId: "browser",
    allowPrivateQaCli: false,
    subpaths: [OLLAMA_CONFIGURED_LOCAL_ORIGIN_RUNTIME_PLUGIN_SDK_SUBPATH]
  }
];
var PLUGIN_SDK_SOURCE_CANDIDATE_EXTENSIONS = [
  ".ts",
  ".mts",
  ".js",
  ".mjs",
  ".cts",
  ".cjs"
];
var BUNDLED_PLUGIN_PUBLIC_SURFACE_SOURCE_PATTERN = /^(?:api|runtime-api|test-api|.+-api)$/u;
var JS_STATIC_RELATIVE_DEPENDENCY_PATTERN = /(?:\bfrom\s*["']|\bimport\s*\(\s*["']|\brequire\s*\(\s*["'])(\.{1,2}\/[^"']+)["']/g;
var WORKSPACE_PACKAGE_ALIAS_ENTRIES = [
  {
    packageName: "@openclaw/gateway-client",
    packageDir: "gateway-client",
    subpath: "",
    srcFile: "index.ts",
    distFile: "index.mjs"
  },
  {
    packageName: "@openclaw/gateway-client",
    packageDir: "gateway-client",
    subpath: "readiness",
    srcFile: "readiness.ts",
    distFile: "readiness.mjs"
  },
  {
    packageName: "@openclaw/gateway-client",
    packageDir: "gateway-client",
    subpath: "timeouts",
    srcFile: "timeouts.ts",
    distFile: "timeouts.mjs"
  },
  {
    packageName: "@openclaw/gateway-protocol",
    packageDir: "gateway-protocol",
    subpath: "",
    srcFile: "index.ts",
    distFile: "index.mjs"
  },
  {
    packageName: "@openclaw/gateway-protocol",
    packageDir: "gateway-protocol",
    subpath: "client-info",
    srcFile: "client-info.ts",
    distFile: "client-info.mjs"
  },
  {
    packageName: "@openclaw/gateway-protocol",
    packageDir: "gateway-protocol",
    subpath: "connect-error-details",
    srcFile: "connect-error-details.ts",
    distFile: "connect-error-details.mjs"
  },
  {
    packageName: "@openclaw/gateway-protocol",
    packageDir: "gateway-protocol",
    subpath: "frame-guards",
    srcFile: "frame-guards.ts",
    distFile: "frame-guards.mjs"
  },
  {
    packageName: "@openclaw/gateway-protocol",
    packageDir: "gateway-protocol",
    subpath: "schema",
    srcFile: "schema.ts",
    distFile: "schema.mjs"
  },
  {
    packageName: "@openclaw/gateway-protocol",
    packageDir: "gateway-protocol",
    subpath: "startup-unavailable",
    srcFile: "startup-unavailable.ts",
    distFile: "startup-unavailable.mjs"
  },
  {
    packageName: "@openclaw/gateway-protocol",
    packageDir: "gateway-protocol",
    subpath: "version",
    srcFile: "version.ts",
    distFile: "version.mjs"
  },
  {
    packageName: "@openclaw/markdown-core",
    packageDir: "markdown-core",
    subpath: "",
    srcFile: "index.ts",
    distFile: "index.mjs"
  },
  {
    packageName: "@openclaw/markdown-core",
    packageDir: "markdown-core",
    subpath: "code-spans",
    srcFile: "code-spans.ts",
    distFile: "code-spans.mjs"
  },
  {
    packageName: "@openclaw/markdown-core",
    packageDir: "markdown-core",
    subpath: "fences",
    srcFile: "fences.ts",
    distFile: "fences.mjs"
  },
  {
    packageName: "@openclaw/markdown-core",
    packageDir: "markdown-core",
    subpath: "frontmatter",
    srcFile: "frontmatter.ts",
    distFile: "frontmatter.mjs"
  },
  {
    packageName: "@openclaw/markdown-core",
    packageDir: "markdown-core",
    subpath: "ir",
    srcFile: "ir.ts",
    distFile: "ir.mjs"
  },
  {
    packageName: "@openclaw/markdown-core",
    packageDir: "markdown-core",
    subpath: "render",
    srcFile: "render.ts",
    distFile: "render.mjs"
  },
  {
    packageName: "@openclaw/markdown-core",
    packageDir: "markdown-core",
    subpath: "render-aware-chunking",
    srcFile: "render-aware-chunking.ts",
    distFile: "render-aware-chunking.mjs"
  },
  {
    packageName: "@openclaw/markdown-core",
    packageDir: "markdown-core",
    subpath: "tables",
    srcFile: "tables.ts",
    distFile: "tables.mjs"
  },
  {
    packageName: "@openclaw/markdown-core",
    packageDir: "markdown-core",
    subpath: "types",
    srcFile: "types.ts",
    distFile: "types.mjs"
  },
  {
    packageName: "@openclaw/media-generation-core",
    packageDir: "media-generation-core",
    subpath: "",
    srcFile: "index.ts",
    distFile: "index.mjs"
  },
  {
    packageName: "@openclaw/media-generation-core",
    packageDir: "media-generation-core",
    subpath: "capability-model-ref",
    srcFile: "capability-model-ref.ts",
    distFile: "capability-model-ref.mjs"
  },
  {
    packageName: "@openclaw/media-generation-core",
    packageDir: "media-generation-core",
    subpath: "catalog",
    srcFile: "catalog.ts",
    distFile: "catalog.mjs"
  },
  {
    packageName: "@openclaw/media-generation-core",
    packageDir: "media-generation-core",
    subpath: "model-ref",
    srcFile: "model-ref.ts",
    distFile: "model-ref.mjs"
  },
  {
    packageName: "@openclaw/media-generation-core",
    packageDir: "media-generation-core",
    subpath: "normalization",
    srcFile: "normalization.ts",
    distFile: "normalization.mjs"
  },
  {
    packageName: "@openclaw/media-core",
    packageDir: "media-core",
    subpath: "",
    srcFile: "index.ts",
    distFile: "index.mjs"
  },
  {
    packageName: "@openclaw/media-core",
    packageDir: "media-core",
    subpath: "base64",
    srcFile: "base64.ts",
    distFile: "base64.mjs"
  },
  {
    packageName: "@openclaw/media-core",
    packageDir: "media-core",
    subpath: "constants",
    srcFile: "constants.ts",
    distFile: "constants.mjs"
  },
  {
    packageName: "@openclaw/media-core",
    packageDir: "media-core",
    subpath: "content-length",
    srcFile: "content-length.ts",
    distFile: "content-length.mjs"
  },
  {
    packageName: "@openclaw/media-core",
    packageDir: "media-core",
    subpath: "file-name",
    srcFile: "file-name.ts",
    distFile: "file-name.mjs"
  },
  {
    packageName: "@openclaw/media-core",
    packageDir: "media-core",
    subpath: "inbound-path-policy",
    srcFile: "inbound-path-policy.ts",
    distFile: "inbound-path-policy.mjs"
  },
  {
    packageName: "@openclaw/media-core",
    packageDir: "media-core",
    subpath: "inline-image-data-url",
    srcFile: "inline-image-data-url.ts",
    distFile: "inline-image-data-url.mjs"
  },
  {
    packageName: "@openclaw/media-core",
    packageDir: "media-core",
    subpath: "media-source-url",
    srcFile: "media-source-url.ts",
    distFile: "media-source-url.mjs"
  },
  {
    packageName: "@openclaw/media-core",
    packageDir: "media-core",
    subpath: "mime",
    srcFile: "mime.ts",
    distFile: "mime.mjs"
  },
  {
    packageName: "@openclaw/media-core",
    packageDir: "media-core",
    subpath: "read-byte-stream-with-limit",
    srcFile: "read-byte-stream-with-limit.ts",
    distFile: "read-byte-stream-with-limit.mjs"
  },
  {
    packageName: "@openclaw/retry",
    packageDir: "retry",
    subpath: "",
    srcFile: "index.ts",
    distFile: "index.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "",
    srcFile: "index.ts",
    distFile: "index.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "ansi",
    srcFile: "ansi.ts",
    distFile: "ansi.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "decorative-emoji",
    srcFile: "decorative-emoji.ts",
    distFile: "decorative-emoji.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "health-style",
    srcFile: "health-style.ts",
    distFile: "health-style.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "links",
    srcFile: "links.ts",
    distFile: "links.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "note",
    srcFile: "note.ts",
    distFile: "note.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "osc-progress",
    srcFile: "osc-progress.ts",
    distFile: "osc-progress.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "palette",
    srcFile: "palette.ts",
    distFile: "palette.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "progress-line",
    srcFile: "progress-line.ts",
    distFile: "progress-line.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "prompt-select-styled",
    srcFile: "prompt-select-styled.ts",
    distFile: "prompt-select-styled.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "prompt-select-styled-params",
    srcFile: "prompt-select-styled-params.ts",
    distFile: "prompt-select-styled-params.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "prompt-style",
    srcFile: "prompt-style.ts",
    distFile: "prompt-style.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "restore",
    srcFile: "restore.ts",
    distFile: "restore.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "safe-text",
    srcFile: "safe-text.ts",
    distFile: "safe-text.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "stream-writer",
    srcFile: "stream-writer.ts",
    distFile: "stream-writer.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "table",
    srcFile: "table.ts",
    distFile: "table.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "terminal-link",
    srcFile: "terminal-link.ts",
    distFile: "terminal-link.mjs"
  },
  {
    packageName: "@openclaw/terminal-core",
    packageDir: "terminal-core",
    subpath: "theme",
    srcFile: "theme.ts",
    distFile: "theme.mjs"
  },
  {
    packageName: "@openclaw/net-policy",
    packageDir: "net-policy",
    subpath: "",
    srcFile: "index.ts",
    distFile: "index.mjs"
  },
  {
    packageName: "@openclaw/net-policy",
    packageDir: "net-policy",
    subpath: "ip",
    srcFile: "ip.ts",
    distFile: "ip.mjs"
  },
  {
    packageName: "@openclaw/net-policy",
    packageDir: "net-policy",
    subpath: "ipv4",
    srcFile: "ipv4.ts",
    distFile: "ipv4.mjs"
  },
  {
    packageName: "@openclaw/net-policy",
    packageDir: "net-policy",
    subpath: "redact-sensitive-url",
    srcFile: "redact-sensitive-url.ts",
    distFile: "redact-sensitive-url.mjs"
  },
  {
    packageName: "@openclaw/net-policy",
    packageDir: "net-policy",
    subpath: "url-protocol",
    srcFile: "url-protocol.ts",
    distFile: "url-protocol.mjs"
  },
  {
    packageName: "@openclaw/net-policy",
    packageDir: "net-policy",
    subpath: "url-userinfo",
    srcFile: "url-userinfo.ts",
    distFile: "url-userinfo.mjs"
  },
  {
    packageName: "@openclaw/model-catalog-core",
    packageDir: "model-catalog-core",
    subpath: "",
    srcFile: "index.ts",
    distFile: "index.mjs"
  },
  {
    packageName: "@openclaw/model-catalog-core",
    packageDir: "model-catalog-core",
    subpath: "configured-model-refs",
    srcFile: "configured-model-refs.ts",
    distFile: "configured-model-refs.mjs"
  },
  {
    packageName: "@openclaw/model-catalog-core",
    packageDir: "model-catalog-core",
    subpath: "model-catalog-refs",
    srcFile: "model-catalog-refs.ts",
    distFile: "model-catalog-refs.mjs"
  },
  {
    packageName: "@openclaw/model-catalog-core",
    packageDir: "model-catalog-core",
    subpath: "model-catalog-normalize",
    srcFile: "model-catalog-normalize.ts",
    distFile: "model-catalog-normalize.mjs"
  },
  {
    packageName: "@openclaw/model-catalog-core",
    packageDir: "model-catalog-core",
    subpath: "model-catalog-types",
    srcFile: "model-catalog-types.ts",
    distFile: "model-catalog-types.mjs"
  },
  {
    packageName: "@openclaw/model-catalog-core",
    packageDir: "model-catalog-core",
    subpath: "provider-id",
    srcFile: "provider-id.ts",
    distFile: "provider-id.mjs"
  },
  {
    packageName: "@openclaw/model-catalog-core",
    packageDir: "model-catalog-core",
    subpath: "provider-model-id-normalization",
    srcFile: "provider-model-id-normalization.ts",
    distFile: "provider-model-id-normalization.mjs"
  },
  {
    packageName: "@openclaw/model-catalog-core",
    packageDir: "model-catalog-core",
    subpath: "provider-model-id-normalize",
    srcFile: "provider-model-id-normalize.ts",
    distFile: "provider-model-id-normalize.mjs"
  }
];
var ROOT_PACKAGED_WORKSPACE_PACKAGE_DIRS = /* @__PURE__ */ new Set([
  "acp-core",
  "media-core",
  "normalization-core",
  "retry",
  "terminal-core"
]);
function normalizePackageExportSubpath(exportKey) {
  if (exportKey === ".") {
    return "";
  }
  if (!exportKey.startsWith("./")) {
    return null;
  }
  const subpath = exportKey.slice(2);
  return subpath && !subpath.includes("..") ? subpath : null;
}
function resolvePackageExportImportPath(value) {
  if (typeof value === "string") {
    return value;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const record = value;
  return typeof record.import === "string" ? record.import : typeof record.default === "string" ? record.default : null;
}
function listRootPackagedWorkspacePackageAliasEntries(params) {
  const distRoot = path11.join(params.packageRoot, "dist", params.packageDir);
  if (!fs6.existsSync(distRoot)) {
    return [];
  }
  const entries = [];
  const visit = (dir, prefix = "") => {
    for (const entry of fs6.readdirSync(dir, { withFileTypes: true })) {
      const relativePath = prefix ? path11.join(prefix, entry.name) : entry.name;
      const fullPath = path11.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath, relativePath);
        continue;
      }
      if (!entry.isFile() || !relativePath.endsWith(".js")) {
        continue;
      }
      const normalizedRelativePath = relativePath.split(path11.sep).join("/");
      const subpath = normalizedRelativePath === "index.js" ? "" : normalizedRelativePath.slice(0, -".js".length);
      if (subpath.includes("..")) {
        continue;
      }
      entries.push({
        packageName: params.packageName,
        packageDir: params.packageDir,
        subpath,
        srcFile: `${subpath || "index"}.ts`,
        distFile: relativePath
      });
    }
  };
  visit(distRoot);
  return entries.toSorted((a, b) => a.subpath.localeCompare(b.subpath));
}
function listWorkspacePackageExportAliasEntries(params) {
  const packageJsonPath = path11.join(
    params.packageRoot,
    "packages",
    params.packageDir,
    "package.json"
  );
  const fallbackPackageRoot = resolveOpenClawPackageRootSync({ cwd: process.cwd() });
  const packageJson = tryReadJsonSync(packageJsonPath) ?? (fallbackPackageRoot ? tryReadJsonSync(
    path11.join(fallbackPackageRoot, "packages", params.packageDir, "package.json")
  ) : null);
  const exports = packageJson?.exports;
  if (!exports || typeof exports !== "object" || Array.isArray(exports)) {
    return listRootPackagedWorkspacePackageAliasEntries(params);
  }
  const entries = [];
  for (const [exportKey, value] of Object.entries(exports)) {
    const subpath = normalizePackageExportSubpath(exportKey);
    const importPath = resolvePackageExportImportPath(value);
    if (subpath === null || !importPath?.startsWith("./dist/") || !importPath.endsWith(".mjs")) {
      continue;
    }
    const distFile = importPath.slice("./dist/".length);
    const srcFile = distFile.replace(/\.mjs$/u, ".ts");
    entries.push({
      packageName: params.packageName,
      packageDir: params.packageDir,
      subpath,
      srcFile,
      distFile
    });
  }
  return entries.length > 0 ? entries.toSorted((a, b) => a.subpath.localeCompare(b.subpath)) : listRootPackagedWorkspacePackageAliasEntries(params);
}
function isUsableDistPluginSdkArtifact(candidate) {
  if (!fs6.existsSync(candidate)) {
    return false;
  }
  switch (normalizeLowercaseStringOrEmpty(path11.extname(candidate))) {
    case ".js":
    case ".mjs":
    case ".cjs":
      break;
    default:
      return true;
  }
  try {
    const source = fs6.readFileSync(candidate, "utf-8");
    for (const match of source.matchAll(JS_STATIC_RELATIVE_DEPENDENCY_PATTERN)) {
      const specifier = match[1];
      if (!specifier || fs6.existsSync(path11.resolve(path11.dirname(candidate), specifier))) {
        continue;
      }
      return false;
    }
  } catch {
    return false;
  }
  return true;
}
function readPrivateLocalOnlyPluginSdkSubpaths(packageRoot) {
  const parsed = tryReadJsonSync(
    path11.join(packageRoot, "scripts", "lib", "plugin-sdk-private-local-only-subpaths.json")
  );
  return [
    .../* @__PURE__ */ new Set([
      CODEX_NATIVE_TASK_RUNTIME_PLUGIN_SDK_SUBPATH,
      CODEX_MCP_PROJECTION_PLUGIN_SDK_SUBPATH,
      OLLAMA_CONFIGURED_LOCAL_ORIGIN_RUNTIME_PLUGIN_SDK_SUBPATH,
      ...Array.isArray(parsed) ? parsed.filter((subpath) => isSafePluginSdkSubpathSegment(subpath)) : []
    ])
  ];
}
function readBundledPluginPackageName(packageJsonPath) {
  const parsed = tryReadJsonSync(packageJsonPath);
  const name = typeof parsed?.name === "string" ? parsed.name.trim() : "";
  return name.startsWith("@openclaw/") ? name : null;
}
function isBundledPluginPublicSurfaceSourceBasename(params) {
  if (params.basename === "test-api") {
    return params.includePrivateQa;
  }
  return BUNDLED_PLUGIN_PUBLIC_SURFACE_SOURCE_PATTERN.test(params.basename);
}
function listBundledPluginPublicSurfaceSourceBasenames(params) {
  try {
    return fs6.readdirSync(params.extensionSourceRoot, { withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => entry.name).flatMap((fileName) => {
      const ext = PLUGIN_SDK_SOURCE_CANDIDATE_EXTENSIONS.find(
        (candidateExt) => fileName.endsWith(candidateExt)
      );
      if (!ext) {
        return [];
      }
      const basename = fileName.slice(0, -ext.length);
      return isBundledPluginPublicSurfaceSourceBasename({
        basename,
        includePrivateQa: params.includePrivateQa
      }) ? [basename] : [];
    }).toSorted();
  } catch {
    return [];
  }
}
function resolveBundledPluginPublicSurfaceAliasTarget(params) {
  for (const kind of params.orderedKinds) {
    if (kind === "dist") {
      const candidate = path11.join(
        params.packageRoot,
        "dist",
        "extensions",
        params.dirName,
        `${params.basename}.js`
      );
      if (fs6.existsSync(candidate)) {
        return candidate;
      }
      continue;
    }
    for (const ext of PLUGIN_SDK_SOURCE_CANDIDATE_EXTENSIONS) {
      const candidate = path11.join(
        params.packageRoot,
        "extensions",
        params.dirName,
        `${params.basename}${ext}`
      );
      if (fs6.existsSync(candidate)) {
        return candidate;
      }
    }
  }
  return null;
}
function resolveBundledPluginPackagePublicSurfaceAliasMap(params) {
  const packageRoot = resolveLoaderPluginSdkPackageRoot(params);
  if (!packageRoot) {
    return {};
  }
  const orderedKinds = resolvePluginSdkAliasCandidateOrder({
    modulePath: params.modulePath,
    isProduction: process.env.NODE_ENV === "production",
    pluginSdkResolution: params.pluginSdkResolution
  });
  const includePrivateQa = shouldIncludePrivateLocalOnlyPluginSdkSubpaths();
  const cacheKey = `${packageRoot}::${orderedKinds.join(",")}::privateQa=${includePrivateQa ? "1" : "0"}`;
  const cached = cachedBundledPluginPublicSurfaceAliasMaps.get(cacheKey);
  if (cached) {
    return cached;
  }
  const extensionsRoot = path11.join(packageRoot, "extensions");
  let extensionDirs;
  try {
    extensionDirs = fs6.readdirSync(extensionsRoot, { withFileTypes: true });
  } catch {
    cachedBundledPluginPublicSurfaceAliasMaps.set(cacheKey, {});
    return {};
  }
  const aliasMap = {};
  for (const entry of extensionDirs) {
    if (!entry.isDirectory()) {
      continue;
    }
    const dirName = entry.name;
    const packageName = readBundledPluginPackageName(
      path11.join(extensionsRoot, dirName, "package.json")
    );
    if (!packageName) {
      continue;
    }
    for (const basename of listBundledPluginPublicSurfaceSourceBasenames({
      extensionSourceRoot: path11.join(extensionsRoot, dirName),
      includePrivateQa
    })) {
      const target = resolveBundledPluginPublicSurfaceAliasTarget({
        packageRoot,
        dirName,
        basename,
        orderedKinds
      });
      if (!target) {
        continue;
      }
      aliasMap[`${packageName}/${basename}.js`] = normalizeJitiAliasTargetPath(target);
    }
  }
  cachedBundledPluginPublicSurfaceAliasMaps.set(cacheKey, aliasMap);
  return aliasMap;
}
function resolveWorkspacePackageAliasMap(params) {
  const packageRoot = resolveLoaderPluginSdkPackageRoot(params);
  if (!packageRoot) {
    return {};
  }
  const orderedKinds = resolvePluginSdkAliasCandidateOrder({
    modulePath: params.modulePath,
    isProduction: process.env.NODE_ENV === "production",
    pluginSdkResolution: params.pluginSdkResolution
  });
  const aliasMap = {};
  const workspacePackageAliasEntries = [
    ...WORKSPACE_PACKAGE_ALIAS_ENTRIES,
    ...["normalization-core", "acp-core"].flatMap(
      (packageDir) => listWorkspacePackageExportAliasEntries({
        packageRoot,
        packageName: `@openclaw/${packageDir}`,
        packageDir
      })
    )
  ];
  for (const entry of workspacePackageAliasEntries) {
    const alias = entry.subpath ? `${entry.packageName}/${entry.subpath}` : entry.packageName;
    for (const kind of orderedKinds) {
      const candidates = kind === "dist" ? [
        ...ROOT_PACKAGED_WORKSPACE_PACKAGE_DIRS.has(entry.packageDir) ? [
          path11.join(
            packageRoot,
            "dist",
            entry.packageDir,
            entry.distFile.replace(/\.mjs$/u, ".js")
          )
        ] : [],
        path11.join(packageRoot, "packages", entry.packageDir, "dist", entry.distFile)
      ] : [path11.join(packageRoot, "packages", entry.packageDir, "src", entry.srcFile)];
      const candidate = candidates.find((candidatePath) => fs6.existsSync(candidatePath));
      if (candidate) {
        aliasMap[alias] = normalizeJitiAliasTargetPath(candidate);
        break;
      }
    }
  }
  return aliasMap;
}
function shouldIncludePrivateLocalOnlyPluginSdkSubpaths() {
  return process.env.OPENCLAW_ENABLE_PRIVATE_QA_CLI === "1";
}
function isBundledPluginModulePath(params) {
  const normalizedModulePath = path11.resolve(params.modulePath);
  const roots = [
    path11.join(params.packageRoot, "extensions", params.pluginId),
    path11.join(params.packageRoot, "dist", "extensions", params.pluginId),
    path11.join(params.packageRoot, "dist-runtime", "extensions", params.pluginId)
  ];
  return roots.some(
    (root2) => normalizedModulePath === root2 || normalizedModulePath.startsWith(`${root2}${path11.sep}`)
  );
}
function isAnyBundledPluginModulePath(params) {
  const normalizedModulePath = path11.resolve(params.modulePath);
  return ["extensions", path11.join("dist", "extensions"), path11.join("dist-runtime", "extensions")].map((segment) => path11.join(params.packageRoot, segment)).some((root2) => normalizedModulePath.startsWith(`${root2}${path11.sep}`));
}
function isOfficialInstalledPluginPackageRoot(params) {
  const [scope, name] = params.packageName.split("/");
  if (!scope || !name) {
    return false;
  }
  const segments = path11.resolve(params.packageRoot).split(path11.sep).filter(Boolean);
  const last = segments.at(-1);
  const packageScope = segments.at(-2);
  const nodeModules = segments.at(-3);
  return last === name && packageScope === scope && nodeModules === "node_modules";
}
function isOfficialInstalledPluginModulePath(params) {
  let cursor = path11.dirname(path11.resolve(params.modulePath));
  for (let depth = 0; depth < 12; depth += 1) {
    const packageJson = tryReadJsonSync(path11.join(cursor, "package.json"));
    if (packageJson) {
      return packageJson.name === params.packageName && isOfficialInstalledPluginPackageRoot({
        packageRoot: cursor,
        packageName: params.packageName
      });
    }
    const parent = path11.dirname(cursor);
    if (parent === cursor) {
      break;
    }
    cursor = parent;
  }
  return false;
}
function isTrustedPrivatePluginSdkOwnerPath(params) {
  if (isBundledPluginModulePath({
    packageRoot: params.packageRoot,
    modulePath: params.modulePath,
    pluginId: params.owner.bundledPluginId
  })) {
    return true;
  }
  return params.owner.officialInstalledPackageName ? isOfficialInstalledPluginModulePath({
    modulePath: params.modulePath,
    packageName: params.owner.officialInstalledPackageName
  }) : false;
}
function findPrivatePluginSdkSubpathOwners(subpath) {
  return PRIVATE_PLUGIN_SDK_SUBPATH_OWNERS.filter((owner) => owner.subpaths.includes(subpath));
}
function listTrustedPrivatePluginSdkOwnerKeys(params) {
  return PRIVATE_PLUGIN_SDK_SUBPATH_OWNERS.filter(
    (owner) => isTrustedPrivatePluginSdkOwnerPath({ ...params, owner })
  ).map((owner) => owner.bundledPluginId);
}
function resolvePrivatePluginSdkOwnerPackageRoot(params) {
  return resolveLoaderPackageRoot({
    modulePath: params.modulePath,
    argv1: params.argv1,
    moduleUrl: params.moduleUrl
  }) ?? params.aliasPackageRoot;
}
function shouldIncludePrivateLocalOnlyPluginSdkSubpath(params) {
  if (PRIVATE_QA_ONLY_PLUGIN_SDK_SUBPATHS.has(params.subpath)) {
    return shouldIncludePrivateLocalOnlyPluginSdkSubpaths();
  }
  const owners = findPrivatePluginSdkSubpathOwners(params.subpath);
  if (owners.length === 0) {
    return isAnyBundledPluginModulePath(params) || shouldIncludePrivateLocalOnlyPluginSdkSubpaths();
  }
  return owners.some(
    (owner) => isTrustedPrivatePluginSdkOwnerPath({ ...params, owner }) || owner.allowPrivateQaCli && shouldIncludePrivateLocalOnlyPluginSdkSubpaths()
  );
}
function hasPluginSdkSubpathArtifact(packageRoot, subpath) {
  const distPath = path11.join(packageRoot, "dist", "plugin-sdk", `${subpath}.js`);
  if (isUsableDistPluginSdkArtifact(distPath)) {
    return true;
  }
  return PLUGIN_SDK_SOURCE_CANDIDATE_EXTENSIONS.some(
    (ext) => fs6.existsSync(path11.join(packageRoot, "src", "plugin-sdk", `${subpath}${ext}`))
  );
}
function listDistPluginSdkArtifactSubpaths(packageRoot) {
  try {
    const distPluginSdkDir = path11.join(packageRoot, "dist", "plugin-sdk");
    return new Set(
      fs6.readdirSync(distPluginSdkDir, { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.endsWith(".js")).map((entry) => entry.name.slice(0, -".js".length)).filter((subpath) => isSafePluginSdkSubpathSegment(subpath))
    );
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function listPrivateLocalOnlyPluginSdkSubpaths(params) {
  return readPrivateLocalOnlyPluginSdkSubpaths(params.packageRoot).filter(
    (subpath) => shouldIncludePrivateLocalOnlyPluginSdkSubpath({
      packageRoot: params.ownerPackageRoot,
      modulePath: params.modulePath,
      subpath
    }) && hasPluginSdkSubpathArtifact(params.packageRoot, subpath)
  );
}
function listPluginSdkExportedSubpaths(params = {}) {
  const modulePath = params.modulePath ?? fileURLToPath3(import.meta.url);
  const packageRoot = resolveLoaderPluginSdkPackageRoot({
    modulePath,
    argv1: params.argv1,
    moduleUrl: params.moduleUrl,
    devSourceRoot: params.devSourceRoot
  });
  if (!packageRoot) {
    return [];
  }
  const ownerPackageRoot = resolvePrivatePluginSdkOwnerPackageRoot({
    modulePath,
    argv1: params.argv1,
    moduleUrl: params.moduleUrl,
    aliasPackageRoot: packageRoot
  });
  const trustedPrivateOwners = listTrustedPrivatePluginSdkOwnerKeys({
    packageRoot: ownerPackageRoot,
    modulePath
  });
  const cacheKey = `${packageRoot}::privateQa=${shouldIncludePrivateLocalOnlyPluginSdkSubpaths() ? "1" : "0"}::privateOwners=${trustedPrivateOwners.join(",")}`;
  const cached = cachedPluginSdkExportedSubpaths.get(cacheKey);
  if (cached) {
    return cached;
  }
  const subpaths = [
    .../* @__PURE__ */ new Set([
      ...readPluginSdkSubpathsFromPackageRoot(packageRoot) ?? [],
      ...listPrivateLocalOnlyPluginSdkSubpaths({ packageRoot, ownerPackageRoot, modulePath })
    ])
  ].toSorted();
  cachedPluginSdkExportedSubpaths.set(cacheKey, subpaths);
  return subpaths;
}
function resolvePluginSdkScopedAliasMap(params = {}) {
  const modulePath = params.modulePath ?? fileURLToPath3(import.meta.url);
  const packageRoot = resolveLoaderPluginSdkPackageRoot({
    modulePath,
    argv1: params.argv1,
    moduleUrl: params.moduleUrl,
    devSourceRoot: params.devSourceRoot
  });
  if (!packageRoot) {
    return {};
  }
  const ownerPackageRoot = resolvePrivatePluginSdkOwnerPackageRoot({
    modulePath,
    argv1: params.argv1,
    moduleUrl: params.moduleUrl,
    aliasPackageRoot: packageRoot
  });
  const orderedKinds = resolvePluginSdkAliasCandidateOrder({
    modulePath,
    isProduction: process.env.NODE_ENV === "production",
    pluginSdkResolution: params.pluginSdkResolution
  });
  const trustedPrivateOwners = listTrustedPrivatePluginSdkOwnerKeys({
    packageRoot: ownerPackageRoot,
    modulePath
  });
  const cacheKey = `${packageRoot}::${orderedKinds.join(",")}::privateQa=${shouldIncludePrivateLocalOnlyPluginSdkSubpaths() ? "1" : "0"}::privateOwners=${trustedPrivateOwners.join(",")}`;
  const cached = cachedPluginSdkScopedAliasMaps.get(cacheKey);
  if (cached) {
    return cached;
  }
  const aliasMap = {};
  const distPluginSdkArtifacts = orderedKinds.includes("dist") ? listDistPluginSdkArtifactSubpaths(packageRoot) : /* @__PURE__ */ new Set();
  for (const subpath of listPluginSdkExportedSubpaths({
    modulePath,
    argv1: params.argv1,
    moduleUrl: params.moduleUrl,
    devSourceRoot: params.devSourceRoot,
    pluginSdkResolution: params.pluginSdkResolution
  })) {
    for (const kind of orderedKinds) {
      if (kind === "dist") {
        if (!distPluginSdkArtifacts.has(subpath)) {
          continue;
        }
        const candidate = path11.join(packageRoot, "dist", "plugin-sdk", `${subpath}.js`);
        if (isUsableDistPluginSdkArtifact(candidate)) {
          for (const packageName of PLUGIN_SDK_PACKAGE_NAMES) {
            aliasMap[`${packageName}/${subpath}`] = candidate;
          }
          break;
        }
        continue;
      }
      for (const ext of PLUGIN_SDK_SOURCE_CANDIDATE_EXTENSIONS) {
        const candidate = path11.join(packageRoot, "src", "plugin-sdk", `${subpath}${ext}`);
        if (!fs6.existsSync(candidate)) {
          continue;
        }
        for (const packageName of PLUGIN_SDK_PACKAGE_NAMES) {
          aliasMap[`${packageName}/${subpath}`] = candidate;
        }
        break;
      }
      if (Object.hasOwn(aliasMap, `openclaw/plugin-sdk/${subpath}`)) {
        break;
      }
    }
  }
  cachedPluginSdkScopedAliasMaps.set(cacheKey, aliasMap);
  return aliasMap;
}
var JITI_NORMALIZED_ALIAS_SYMBOL = /* @__PURE__ */ Symbol.for("pathe:normalizedAlias");
var JITI_ALIAS_ROOT_SENTINELS = /* @__PURE__ */ new Set(["/", "\\", void 0]);
var JITI_CONCRETE_ALIAS_TARGET_PATTERN = /^(?:[A-Za-z]:[/\\]|[/\\])/;
var aliasMapCache = new PluginLruCache(
  MAX_PLUGIN_LOADER_ALIAS_CACHE_ENTRIES
);
var normalizedJitiAliasMapCache = new PluginLruCache(
  MAX_PLUGIN_LOADER_ALIAS_CACHE_ENTRIES
);
var normalizedJitiAliasMapByInput = /* @__PURE__ */ new WeakMap();
var pluginLoaderModuleCacheKeyByAliasMap = /* @__PURE__ */ new WeakMap();
var pluginLoaderModuleConfigCache = new PluginLruCache(MAX_PLUGIN_LOADER_ALIAS_CACHE_ENTRIES);
function hasJitiNormalizedAliasMarker(aliasMap) {
  return Boolean(aliasMap[JITI_NORMALIZED_ALIAS_SYMBOL]);
}
function createJitiAliasContentCacheKey(aliasMap) {
  return Object.entries(aliasMap).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, value]) => `${key}\0${value}`).join("\0");
}
function isConcreteJitiAliasTarget(target) {
  return typeof target === "string" && JITI_CONCRETE_ALIAS_TARGET_PATTERN.test(target);
}
function resolveJitiAliasTarget(aliasKey, aliasKeys, aliasMap) {
  let target = aliasMap[aliasKey];
  const seenTargets = /* @__PURE__ */ new Set();
  const seenAliasKeys = /* @__PURE__ */ new Set();
  while (target && !isConcreteJitiAliasTarget(target) && !seenTargets.has(target)) {
    seenTargets.add(target);
    let nextTarget;
    for (const candidateKey of aliasKeys) {
      if (candidateKey === aliasKey || aliasKey.startsWith(candidateKey) || !target.startsWith(candidateKey) || !JITI_ALIAS_ROOT_SENTINELS.has(target[candidateKey.length])) {
        continue;
      }
      if (seenAliasKeys.has(candidateKey)) {
        return target;
      }
      seenAliasKeys.add(candidateKey);
      nextTarget = aliasMap[candidateKey] + target.slice(candidateKey.length);
      break;
    }
    if (!nextTarget || nextTarget === target) {
      break;
    }
    target = nextTarget;
  }
  return target;
}
function normalizePluginLoaderAliasMapForJiti(aliasMap) {
  if (hasJitiNormalizedAliasMarker(aliasMap)) {
    return aliasMap;
  }
  const cachedByInput = normalizedJitiAliasMapByInput.get(aliasMap);
  if (cachedByInput) {
    return cachedByInput;
  }
  const cacheKey = createJitiAliasContentCacheKey(aliasMap);
  const cached = normalizedJitiAliasMapCache.get(cacheKey);
  if (cached) {
    normalizedJitiAliasMapByInput.set(aliasMap, cached);
    return cached;
  }
  const aliasDepth = /* @__PURE__ */ new Map();
  const getAliasDepth = (key) => {
    const cachedDepth = aliasDepth.get(key);
    if (cachedDepth !== void 0) {
      return cachedDepth;
    }
    const depth = key.split("/").length;
    aliasDepth.set(key, depth);
    return depth;
  };
  const normalizedAliasMap = Object.fromEntries(
    Object.entries(aliasMap).toSorted(
      ([left], [right]) => getAliasDepth(right) - getAliasDepth(left)
    )
  );
  const aliasKeys = Object.keys(normalizedAliasMap);
  for (const aliasKey of aliasKeys) {
    const target = normalizedAliasMap[aliasKey];
    if (!target || isConcreteJitiAliasTarget(target)) {
      continue;
    }
    const resolvedTarget = resolveJitiAliasTarget(aliasKey, aliasKeys, normalizedAliasMap);
    if (resolvedTarget) {
      normalizedAliasMap[aliasKey] = resolvedTarget;
    }
  }
  Object.defineProperty(normalizedAliasMap, JITI_NORMALIZED_ALIAS_SYMBOL, {
    value: true,
    enumerable: false
  });
  normalizedJitiAliasMapCache.set(cacheKey, normalizedAliasMap);
  normalizedJitiAliasMapByInput.set(aliasMap, normalizedAliasMap);
  return normalizedAliasMap;
}
function buildPluginLoaderAliasMapCacheKey(params) {
  const devSourceRoot = resolveDevSourceRootParam(params);
  return [
    params.modulePath,
    params.argv1 ?? "",
    params.moduleUrl ?? "",
    params.pluginSdkResolution,
    process.cwd(),
    devSourceRoot ?? "",
    process.env.NODE_ENV === "production" ? "production" : "non-production",
    shouldIncludePrivateLocalOnlyPluginSdkSubpaths() ? "private-qa" : "public"
  ].join("\0");
}
function buildPluginLoaderModuleConfigCacheKey(params) {
  return [
    buildPluginLoaderAliasMapCacheKey({
      modulePath: params.modulePath,
      argv1: params.argv1,
      moduleUrl: params.moduleUrl,
      pluginSdkResolution: params.pluginSdkResolution ?? "auto",
      devSourceRoot: params.devSourceRoot
    }),
    params.preferBuiltDist === true ? "prefer-built-dist" : "default-dist"
  ].join("\0");
}
function buildPluginLoaderAliasMap(modulePath, argv1 = STARTUP_ARGV1, moduleUrl, pluginSdkResolution = "auto", devSourceRoot) {
  const cacheKey = buildPluginLoaderAliasMapCacheKey({
    modulePath,
    argv1,
    moduleUrl,
    pluginSdkResolution,
    devSourceRoot
  });
  const cached = aliasMapCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const result = {
    ...resolveBundledPluginPackagePublicSurfaceAliasMap({
      modulePath,
      argv1,
      moduleUrl,
      pluginSdkResolution,
      devSourceRoot
    }),
    ...resolveWorkspacePackageAliasMap({
      modulePath,
      argv1,
      moduleUrl,
      pluginSdkResolution,
      devSourceRoot
    }),
    ...Object.fromEntries(
      Object.entries(
        resolvePluginSdkScopedAliasMap({
          modulePath,
          argv1,
          moduleUrl,
          pluginSdkResolution,
          devSourceRoot
        })
      ).map(([key, value]) => [key, normalizeJitiAliasTargetPath(value)])
    )
  };
  aliasMapCache.set(cacheKey, result);
  return result;
}
function buildPluginLoaderJitiOptions(aliasMap, params = {}) {
  const hasAliases = Object.keys(aliasMap).length > 0;
  const jitiAliasMap = hasAliases ? normalizePluginLoaderAliasMapForJiti(aliasMap) : aliasMap;
  return {
    interopDefault: true,
    fsCache: resolvePluginLoaderJitiFsCacheOption(params),
    // Prefer Node's native sync ESM loader for built dist/*.js modules so
    // bundled plugins and plugin-sdk subpaths stay on the canonical module graph.
    tryNative: true,
    // When jiti must transform a plugin entry, keep OpenClaw's own package
    // chunks on the native module graph instead of re-evaluating them in jiti.
    nativeModules: resolvePluginLoaderJitiNativeModules(),
    extensions: [".ts", ".tsx", ".mts", ".cts", ".mtsx", ".ctsx", ".js", ".mjs", ".cjs", ".json"],
    ...hasAliases ? {
      alias: jitiAliasMap
    } : {}
  };
}
function supportsNativeModuleRuntime() {
  const versions = process.versions;
  return typeof versions.bun !== "string";
}
function isBundledPluginDistModulePath(modulePath) {
  return modulePath.replace(/\\/g, "/").includes("/dist/extensions/");
}
function shouldPreferNativeModuleLoad(modulePath) {
  if (!supportsNativeModuleRuntime()) {
    return false;
  }
  switch (normalizeLowercaseStringOrEmpty(path11.extname(modulePath))) {
    case ".js":
    case ".mjs":
    case ".cjs":
    case ".json":
      return true;
    default:
      return false;
  }
}
function resolvePluginLoaderTryNative(modulePath, options) {
  if (isBundledPluginDistModulePath(modulePath)) {
    return shouldPreferNativeModuleLoad(modulePath);
  }
  return shouldPreferNativeModuleLoad(modulePath) || supportsNativeModuleRuntime() && options?.preferBuiltDist === true && modulePath.includes(`${path11.sep}dist${path11.sep}`);
}
function createPluginLoaderModuleCacheKey(params) {
  const aliasMapKey = pluginLoaderModuleCacheKeyByAliasMap.get(params.aliasMap) ?? createJitiAliasContentCacheKey(params.aliasMap);
  pluginLoaderModuleCacheKeyByAliasMap.set(params.aliasMap, aliasMapKey);
  return `${params.tryNative ? "native" : "transform"}\0${aliasMapKey}`;
}
function resolvePluginLoaderModuleConfig(params) {
  const configCacheKey = buildPluginLoaderModuleConfigCacheKey(params);
  const cached = pluginLoaderModuleConfigCache.get(configCacheKey);
  if (cached) {
    return cached;
  }
  const tryNative = resolvePluginLoaderTryNative(
    params.modulePath,
    params.preferBuiltDist ? { preferBuiltDist: true } : {}
  );
  const aliasMap = buildPluginLoaderAliasMap(
    params.modulePath,
    params.argv1,
    params.moduleUrl,
    params.pluginSdkResolution,
    params.devSourceRoot
  );
  const result = {
    tryNative,
    aliasMap,
    cacheKey: createPluginLoaderModuleCacheKey({
      tryNative,
      aliasMap
    })
  };
  pluginLoaderModuleConfigCache.set(configCacheKey, result);
  return result;
}
var moduleWithResolver2 = Module2;
var nodeResolveFilenameProperty = "_resolveFilename";
var INTERNAL_CORE_PACKAGE_ALIASES = [
  {
    packageName: "@openclaw/markdown-core",
    packageDir: "markdown-core",
    subpaths: [
      ["", "index.ts"],
      ["code-spans", "code-spans.ts"],
      ["fences", "fences.ts"],
      ["frontmatter", "frontmatter.ts"],
      ["ir", "ir.ts"],
      ["render", "render.ts"],
      ["render-aware-chunking", "render-aware-chunking.ts"],
      ["tables", "tables.ts"],
      ["types", "types.ts"]
    ]
  },
  {
    // Mirrors packages/ai/package.json exports; dist file names do not follow
    // the src layout (dist/diagnostics.mjs <- src/utils/diagnostics.ts), so the
    // generic export-map derivation cannot be used here.
    packageName: "@openclaw/ai",
    packageDir: "ai",
    subpaths: [
      ["", "index.ts"],
      ["providers", "providers.ts"],
      ["diagnostics", path12.join("utils", "diagnostics.ts")],
      ["event-stream", path12.join("utils", "event-stream.ts")],
      ["types", "types.ts"],
      ["validation", "validation.ts"],
      ["internal/anthropic", path12.join("internal", "anthropic.ts")],
      ["internal/openai", path12.join("internal", "openai.ts")],
      ["internal/retry-after", path12.join("internal", "retry-after.ts")],
      ["internal/runtime", path12.join("internal", "runtime.ts")],
      ["internal/shared", path12.join("internal", "shared.ts")]
    ]
  },
  {
    packageName: "@openclaw/media-core",
    packageDir: "media-core",
    subpaths: [
      ["", "index.ts"],
      ["base64", "base64.ts"],
      ["constants", "constants.ts"],
      ["content-length", "content-length.ts"],
      ["file-name", "file-name.ts"],
      ["inbound-path-policy", "inbound-path-policy.ts"],
      ["inline-image-data-url", "inline-image-data-url.ts"],
      ["media-source-url", "media-source-url.ts"],
      ["mime", "mime.ts"],
      ["read-byte-stream-with-limit", "read-byte-stream-with-limit.ts"]
    ]
  },
  {
    packageName: "@openclaw/llm-core",
    packageDir: "llm-core",
    subpaths: [
      ["", "index.ts"],
      ["diagnostics", path12.join("utils", "diagnostics.ts")],
      ["event-stream", path12.join("utils", "event-stream.ts")],
      ["types", "types.ts"],
      ["validation", "validation.ts"]
    ]
  }
];
var pluginSdkNativeAliases = /* @__PURE__ */ new Map();
var installed = false;
var previousResolveFilename;
function resolveLoaderModulePath2(options) {
  return options.modulePath ?? fileURLToPath4(options.moduleUrl ?? import.meta.url);
}
function normalizePathForBoundary(candidate) {
  try {
    return fs7.realpathSync(candidate);
  } catch {
    return path12.resolve(candidate);
  }
}
function findNearestPackageRoot(modulePath) {
  let cursor = path12.dirname(path12.resolve(modulePath));
  for (let i = 0; i < 12; i += 1) {
    if (fs7.existsSync(path12.join(cursor, "package.json"))) {
      return cursor;
    }
    const parent = path12.dirname(cursor);
    if (parent === cursor) {
      break;
    }
    cursor = parent;
  }
  return path12.dirname(path12.resolve(modulePath));
}
function resolveLoaderPackageRootFromModulePath(modulePath) {
  let cursor = path12.dirname(path12.resolve(modulePath));
  for (let i = 0; i < 12; i += 1) {
    const packageJsonPath = path12.join(cursor, "package.json");
    if (fs7.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs7.readFileSync(packageJsonPath, "utf8"));
        if (packageJson.name === "openclaw" || typeof packageJson.bin === "object" && packageJson.bin !== null && typeof packageJson.bin.openclaw === "string") {
          return cursor;
        }
      } catch {
      }
    }
    const parent = path12.dirname(cursor);
    if (parent === cursor) {
      break;
    }
    cursor = parent;
  }
  return findNearestPackageRoot(modulePath);
}
function isWithinRoot(candidate, root2) {
  const relative = path12.relative(root2, normalizePathForBoundary(candidate));
  return relative === "" || !relative.startsWith("..") && !path12.isAbsolute(relative);
}
function resolveAliasTargetForParent(request, parent) {
  return resolveAliasTargetForParentPath(request, parent?.filename);
}
function resolveAliasTargetForParentUrl(request, parentUrl) {
  if (!parentUrl?.startsWith("file:")) {
    return void 0;
  }
  try {
    return resolveAliasTargetForParentPath(request, fileURLToPath4(parentUrl));
  } catch {
    return void 0;
  }
}
function resolveAliasTargetForParentPath(request, parentFilename) {
  const entries = pluginSdkNativeAliases.get(request);
  if (!entries || !parentFilename) {
    return void 0;
  }
  return entries.find((entry) => isWithinRoot(parentFilename, entry.parentRoot))?.target;
}
function listInternalCorePackageNativeAliases(options) {
  const packageRoot = resolveLoaderPackageRootFromModulePath(resolveLoaderModulePath2(options));
  const parentRoots = ["src", "scripts", "packages", "test"].map((segment) => path12.join(packageRoot, segment)).filter((candidate) => fs7.existsSync(candidate)).map(normalizePathForBoundary);
  if (parentRoots.length === 0) {
    return [];
  }
  const aliases = [];
  const internalCorePackageAliases = [
    ...INTERNAL_CORE_PACKAGE_ALIASES,
    ...["normalization-core", "acp-core"].map((packageDir) => ({
      packageName: `@openclaw/${packageDir}`,
      packageDir,
      subpaths: listWorkspacePackageExportAliasEntries({
        packageRoot,
        packageName: `@openclaw/${packageDir}`,
        packageDir
      }).map((entry) => [entry.subpath, entry.srcFile])
    }))
  ];
  for (const entry of internalCorePackageAliases) {
    for (const [subpath, srcFile] of entry.subpaths) {
      const request = subpath ? `${entry.packageName}/${subpath}` : entry.packageName;
      const target = path12.join(packageRoot, "packages", entry.packageDir, "src", srcFile);
      if (fs7.existsSync(target)) {
        aliases.push({ request, target, parentRoots });
      }
    }
  }
  return aliases;
}
function installResolver() {
  if (installed || !moduleWithResolver2[nodeResolveFilenameProperty]) {
    return;
  }
  previousResolveFilename = moduleWithResolver2[nodeResolveFilenameProperty];
  moduleWithResolver2[nodeResolveFilenameProperty] = ((request, parent, isMain, options) => {
    const aliasTarget = resolveAliasTargetForParent(request, parent);
    if (aliasTarget) {
      return aliasTarget;
    }
    return previousResolveFilename?.(request, parent, isMain, options) ?? request;
  });
  moduleWithResolver2.registerHooks?.({
    resolve(specifier, context, nextResolve) {
      const aliasTarget = resolveAliasTargetForParentUrl(specifier, context.parentURL);
      if (aliasTarget) {
        return {
          shortCircuit: true,
          url: pathToFileURL3(aliasTarget).href
        };
      }
      return nextResolve(specifier, context);
    }
  });
  installed = true;
}
function registerNativeAlias(params) {
  const entries = pluginSdkNativeAliases.get(params.request) ?? [];
  for (const parentRoot of params.parentRoots) {
    const existingIndex = entries.findIndex((entry) => entry.parentRoot === parentRoot);
    if (existingIndex !== -1) {
      entries[existingIndex] = { parentRoot, target: params.target };
      continue;
    }
    entries.push({ parentRoot, target: params.target });
  }
  if (entries.length > 0) {
    pluginSdkNativeAliases.set(params.request, entries);
  }
}
function installOpenClawInternalCorePackageNativeResolver(options = {}) {
  for (const alias of listInternalCorePackageNativeAliases(options)) {
    registerNativeAlias(alias);
  }
  installResolver();
  return [...pluginSdkNativeAliases.keys()].toSorted();
}
var MAX_TRACKED_SOURCE_TRANSFORM_TARGETS = 24;
var requireForJiti = createRequire2(import.meta.url);
var createJitiLoaderFactory;
var pluginModuleLoaderStats = {
  calls: 0,
  nativeHits: 0,
  nativeMisses: 0,
  sourceTransformForced: 0,
  sourceTransformFallbacks: 0,
  sourceTransformTargets: /* @__PURE__ */ new Map()
};
function recordSourceTransformTarget(target) {
  const current = pluginModuleLoaderStats.sourceTransformTargets.get(target) ?? 0;
  pluginModuleLoaderStats.sourceTransformTargets.set(target, current + 1);
  if (pluginModuleLoaderStats.sourceTransformTargets.size <= MAX_TRACKED_SOURCE_TRANSFORM_TARGETS) {
    return;
  }
  let leastUsedTarget;
  let leastUsedCount = Number.POSITIVE_INFINITY;
  for (const [candidate, count] of pluginModuleLoaderStats.sourceTransformTargets) {
    if (count < leastUsedCount) {
      leastUsedTarget = candidate;
      leastUsedCount = count;
    }
  }
  if (leastUsedTarget) {
    pluginModuleLoaderStats.sourceTransformTargets.delete(leastUsedTarget);
  }
}
function loadCreateJitiLoaderFactory() {
  if (createJitiLoaderFactory) {
    return createJitiLoaderFactory;
  }
  const loaded = requireForJiti("jiti");
  if (typeof loaded.createJiti !== "function") {
    throw new Error("jiti module did not export createJiti");
  }
  createJitiLoaderFactory = loaded.createJiti;
  return createJitiLoaderFactory;
}
function toSourceTransformImportPath(specifier) {
  if (process.platform === "win32" && path13.isAbsolute(specifier)) {
    return pathToFileURL4(specifier).href;
  }
  return toSafeImportPath(specifier);
}
function resolveDefaultPluginModuleLoaderConfig(params) {
  return resolvePluginLoaderModuleConfig({
    modulePath: params.modulePath,
    argv1: params.argvEntry ?? process.argv[1],
    moduleUrl: params.importerUrl,
    devSourceRoot: params.devSourceRoot,
    ...params.preferBuiltDist ? { preferBuiltDist: true } : {},
    ...params.pluginSdkResolution ? { pluginSdkResolution: params.pluginSdkResolution } : {}
  });
}
function resolvePluginModuleLoaderCacheEntry(params) {
  const loaderFilename = toSafeImportPath(params.loaderFilename ?? params.modulePath);
  const hasAliasOverride = Boolean(params.aliasMap);
  const hasTryNativeOverride = typeof params.tryNative === "boolean";
  const defaultConfig = hasAliasOverride || hasTryNativeOverride ? resolveDefaultPluginModuleLoaderConfig(params) : null;
  const canReuseDefaultCacheKey = defaultConfig !== null && (!hasAliasOverride || params.aliasMap === defaultConfig.aliasMap) && (!hasTryNativeOverride || params.tryNative === defaultConfig.tryNative);
  const resolved = defaultConfig ? {
    tryNative: params.tryNative ?? defaultConfig.tryNative,
    aliasMap: params.aliasMap ?? defaultConfig.aliasMap,
    cacheKey: canReuseDefaultCacheKey ? defaultConfig.cacheKey : void 0
  } : resolveDefaultPluginModuleLoaderConfig(params);
  const { tryNative, aliasMap } = resolved;
  const moduleConfigCacheKey = resolved.cacheKey ?? createPluginLoaderModuleCacheKey({
    tryNative,
    aliasMap
  });
  const transformOpenClawDependencies = params.transformOpenClawDependencies ?? tryNative;
  const cacheKey = `${moduleConfigCacheKey}\0transform-openclaw=${transformOpenClawDependencies ? "1" : "0"}`;
  const scopedCacheKey = `${loaderFilename}::${params.sharedCacheScopeKey ?? (params.cacheScopeKey ? `${params.cacheScopeKey}::${cacheKey}` : cacheKey)}`;
  return {
    loaderFilename,
    aliasMap,
    tryNative,
    transformOpenClawDependencies,
    cacheKey,
    scopedCacheKey
  };
}
function createLazySourceTransformLoader(params) {
  let loadWithSourceTransform;
  return () => {
    if (loadWithSourceTransform) {
      return loadWithSourceTransform;
    }
    const jitiOptions = buildPluginLoaderJitiOptions(params.aliasMap, {
      modulePath: params.loaderFilename
    });
    const jitiLoader = (params.createLoader ?? loadCreateJitiLoaderFactory())(
      params.loaderFilename,
      {
        ...jitiOptions,
        nativeModules: params.transformOpenClawDependencies ? jitiOptions.nativeModules.filter((moduleName) => moduleName !== "openclaw") : jitiOptions.nativeModules,
        tryNative: false
      }
    );
    loadWithSourceTransform = (target) => jitiLoader(toSourceTransformImportPath(target));
    return loadWithSourceTransform;
  };
}
function createPluginModuleLoader(params) {
  const getLoadWithSourceTransform = createLazySourceTransformLoader({
    ...params
  });
  const loadedTargetExports = /* @__PURE__ */ new Map();
  const loadCachedTarget = (target, load) => {
    if (loadedTargetExports.has(target)) {
      return loadedTargetExports.get(target);
    }
    const loaded = load();
    loadedTargetExports.set(target, loaded);
    return loaded;
  };
  if (!params.tryNative) {
    return (target) => loadCachedTarget(target, () => {
      pluginModuleLoaderStats.calls += 1;
      pluginModuleLoaderStats.sourceTransformForced += 1;
      recordSourceTransformTarget(target);
      return getLoadWithSourceTransform()(target);
    });
  }
  return (target) => loadCachedTarget(target, () => {
    pluginModuleLoaderStats.calls += 1;
    const native = tryNativeRequireJavaScriptModule(target, {
      allowWindows: true,
      aliasMap: params.aliasMap,
      fallbackOnMissingDependency: true,
      fallbackOnNativeError: true
    });
    if (native.ok) {
      pluginModuleLoaderStats.nativeHits += 1;
      return native.moduleExport;
    }
    pluginModuleLoaderStats.nativeMisses += 1;
    pluginModuleLoaderStats.sourceTransformFallbacks += 1;
    recordSourceTransformTarget(target);
    return getLoadWithSourceTransform()(target);
  });
}
function getCachedPluginModuleLoader(params) {
  installOpenClawInternalCorePackageNativeResolver({ moduleUrl: params.importerUrl });
  const cacheEntry = resolvePluginModuleLoaderCacheEntry(params);
  const cached = params.cache.get(cacheEntry.scopedCacheKey);
  if (cached) {
    return cached;
  }
  const loader = createPluginModuleLoader({
    loaderFilename: cacheEntry.loaderFilename,
    aliasMap: cacheEntry.aliasMap,
    tryNative: cacheEntry.tryNative,
    transformOpenClawDependencies: cacheEntry.transformOpenClawDependencies,
    ...params.createLoader ? { createLoader: params.createLoader } : {}
  });
  params.cache.set(cacheEntry.scopedCacheKey, loader);
  return loader;
}
var PUBLIC_SURFACE_SOURCE_EXTENSIONS = [
  ".ts",
  ".mts",
  ".js",
  ".mjs",
  ".cts",
  ".cjs"
];
function normalizeBundledPluginArtifactSubpath(artifactBasename) {
  if (path14.posix.isAbsolute(artifactBasename) || path14.win32.isAbsolute(artifactBasename) || artifactBasename.includes("\\")) {
    throw new Error(`Bundled plugin artifact path must stay plugin-local: ${artifactBasename}`);
  }
  const normalized = artifactBasename.replace(/^\.\//u, "");
  if (!normalized) {
    throw new Error("Bundled plugin artifact path must not be empty");
  }
  const segments = normalized.split("/");
  if (segments.some(
    (segment) => segment.length === 0 || segment === "." || segment === ".." || segment.includes(":")
  )) {
    throw new Error(`Bundled plugin artifact path must stay plugin-local: ${artifactBasename}`);
  }
  return normalized;
}
function normalizeBundledPluginDirName(dirName) {
  const normalized = dirName.trim();
  if (!normalized || normalized === "." || normalized === ".." || normalized.includes("/") || normalized.includes("\\") || normalized.includes(":")) {
    throw new Error(`Bundled plugin dirName must be a single directory: ${dirName}`);
  }
  return normalized;
}
function resolveBundledPluginSourcePublicSurfacePath(params) {
  const artifactBasename = normalizeBundledPluginArtifactSubpath(params.artifactBasename);
  const dirName = normalizeBundledPluginDirName(params.dirName);
  const sourceBaseName = artifactBasename.replace(/\.js$/u, "");
  for (const ext of PUBLIC_SURFACE_SOURCE_EXTENSIONS) {
    const sourceCandidate = path14.resolve(params.sourceRoot, dirName, `${sourceBaseName}${ext}`);
    if (fs8.existsSync(sourceCandidate)) {
      return sourceCandidate;
    }
  }
  return null;
}
function resolvePackageFallbackForBundledDir(params) {
  const normalizedBundledDir = path14.resolve(params.bundledPluginsDir);
  const normalizedRootDir = path14.resolve(params.rootDir);
  const packageBundledDirs = [
    path14.join(normalizedRootDir, "dist", "extensions"),
    path14.join(normalizedRootDir, "dist-runtime", "extensions")
  ];
  if (!packageBundledDirs.includes(normalizedBundledDir)) {
    return null;
  }
  for (const packageBundledDir of packageBundledDirs) {
    if (packageBundledDir === normalizedBundledDir) {
      continue;
    }
    const builtCandidate = path14.join(packageBundledDir, params.dirName, params.artifactBasename);
    if (fs8.existsSync(builtCandidate)) {
      return builtCandidate;
    }
  }
  return resolveBundledPluginSourcePublicSurfacePath({
    sourceRoot: path14.join(normalizedRootDir, "extensions"),
    dirName: params.dirName,
    artifactBasename: params.artifactBasename
  });
}
function sameExistingPath(left, right) {
  try {
    return fs8.realpathSync.native(left) === fs8.realpathSync.native(right);
  } catch {
    return false;
  }
}
function resolveExplicitEnvBundledPluginsDir(env) {
  const envOverride = env.OPENCLAW_BUNDLED_PLUGINS_DIR?.trim();
  if (!envOverride) {
    return void 0;
  }
  const bundledPluginsDir = resolveBundledPluginsDir(env);
  if (!bundledPluginsDir) {
    return void 0;
  }
  const requestedDir = resolveUserPath(envOverride, env);
  return sameExistingPath(requestedDir, bundledPluginsDir) ? bundledPluginsDir : void 0;
}
function resolvePublicSurfaceFromBundledDir(params) {
  const pluginDir = path14.resolve(params.bundledPluginsDir, params.dirName);
  const builtCandidate = path14.join(pluginDir, params.artifactBasename);
  if (fs8.existsSync(builtCandidate)) {
    return builtCandidate;
  }
  const packageLocalBuiltCandidate = path14.join(pluginDir, "dist", params.artifactBasename);
  if (fs8.existsSync(packageLocalBuiltCandidate)) {
    return packageLocalBuiltCandidate;
  }
  return resolveBundledPluginSourcePublicSurfacePath({
    sourceRoot: params.bundledPluginsDir,
    dirName: params.dirName,
    artifactBasename: params.artifactBasename
  }) ?? resolvePackageFallbackForBundledDir({
    rootDir: params.rootDir,
    bundledPluginsDir: params.bundledPluginsDir,
    dirName: params.dirName,
    artifactBasename: params.artifactBasename
  });
}
function resolveBundledPluginPublicSurfacePath(params) {
  const artifactBasename = normalizeBundledPluginArtifactSubpath(params.artifactBasename);
  const dirName = normalizeBundledPluginDirName(params.dirName);
  const env = params.env ?? process.env;
  const explicitBundledPluginsDir = params.bundledPluginsDirMode === "auto" ? resolveExplicitEnvBundledPluginsDir(env) : params.bundledPluginsDir ?? resolveExplicitEnvBundledPluginsDir(env);
  if (explicitBundledPluginsDir) {
    return resolvePublicSurfaceFromBundledDir({
      rootDir: params.rootDir,
      bundledPluginsDir: explicitBundledPluginsDir,
      dirName,
      artifactBasename
    });
  }
  if (areBundledPluginsDisabled(env)) {
    return null;
  }
  const sourceCandidate = resolveBundledPluginSourcePublicSurfacePath({
    sourceRoot: path14.resolve(params.rootDir, "extensions"),
    dirName,
    artifactBasename
  });
  if (sourceCandidate) {
    return sourceCandidate;
  }
  const bundledPluginsDir = params.bundledPluginsDirMode === "auto" ? params.bundledPluginsDir : resolveBundledPluginsDir(env);
  if (bundledPluginsDir) {
    const bundledCandidate = resolvePublicSurfaceFromBundledDir({
      rootDir: params.rootDir,
      bundledPluginsDir,
      dirName,
      artifactBasename
    });
    if (bundledCandidate) {
      return bundledCandidate;
    }
  }
  for (const candidate of [
    path14.resolve(params.rootDir, "dist", "extensions", dirName, artifactBasename),
    path14.resolve(params.rootDir, "dist-runtime", "extensions", dirName, artifactBasename)
  ]) {
    if (fs8.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}
function resolveFacadeBoundaryRoot(params) {
  if (!params.bundledPluginsDir) {
    return params.packageRoot;
  }
  const resolvedBundledPluginsDir = path15.resolve(params.bundledPluginsDir);
  return params.modulePath.startsWith(`${resolvedBundledPluginsDir}${path15.sep}`) ? resolvedBundledPluginsDir : params.packageRoot;
}
function resolveBundledFacadeModuleLocation(params) {
  const env = params.env ?? process.env;
  if (areBundledPluginsDisabled(env)) {
    return null;
  }
  const preferSource = !params.currentModulePath.includes(`${path15.sep}dist${path15.sep}`);
  const packageSourceRoot = path15.resolve(params.packageRoot, "extensions");
  const publicSurfaceParams = {
    rootDir: params.packageRoot,
    env: params.env,
    ...params.bundledPluginsDir ? { bundledPluginsDir: params.bundledPluginsDir } : {},
    dirName: params.dirName,
    artifactBasename: params.artifactBasename
  };
  const modulePath = preferSource ? resolveBundledPluginSourcePublicSurfacePath({
    dirName: params.dirName,
    artifactBasename: params.artifactBasename,
    sourceRoot: params.bundledPluginsDir ?? packageSourceRoot
  }) ?? (params.bundledPluginsDir && !areBundledPluginsDisabled(env) ? resolveBundledPluginSourcePublicSurfacePath({
    dirName: params.dirName,
    artifactBasename: params.artifactBasename,
    sourceRoot: packageSourceRoot
  }) : null) ?? resolveBundledPluginPublicSurfacePath(publicSurfaceParams) : resolveBundledPluginPublicSurfacePath(publicSurfaceParams);
  return modulePath ? {
    modulePath,
    boundaryRoot: resolveFacadeBoundaryRoot({
      modulePath,
      bundledPluginsDir: params.bundledPluginsDir,
      packageRoot: params.packageRoot
    })
  } : null;
}
var CURRENT_MODULE_PATH = fileURLToPath5(import.meta.url);
var moduleLoaders = /* @__PURE__ */ new Map();
var loadedFacadeModules = /* @__PURE__ */ new Map();
var loadedFacadePluginIds = /* @__PURE__ */ new Set();
var facadeLoaderSourceTransformFactory;
var cachedOpenClawPackageRoot;
function getOpenClawPackageRoot() {
  if (cachedOpenClawPackageRoot) {
    return cachedOpenClawPackageRoot;
  }
  cachedOpenClawPackageRoot = resolveLoaderPackageRoot({
    modulePath: fileURLToPath5(import.meta.url),
    moduleUrl: import.meta.url
  }) ?? fileURLToPath5(new URL("../..", import.meta.url));
  return cachedOpenClawPackageRoot;
}
function resolveFacadeModuleLocation(params) {
  const bundledPluginsDir = resolveBundledPluginsDir(params.env ?? process.env);
  return resolveBundledFacadeModuleLocation({
    ...params,
    currentModulePath: CURRENT_MODULE_PATH,
    packageRoot: getOpenClawPackageRoot(),
    bundledPluginsDir
  });
}
function getModuleLoader(modulePath) {
  return getCachedPluginModuleLoader({
    cache: moduleLoaders,
    modulePath,
    importerUrl: import.meta.url,
    preferBuiltDist: true,
    loaderFilename: import.meta.url,
    ...facadeLoaderSourceTransformFactory ? { createLoader: facadeLoaderSourceTransformFactory } : {}
  });
}
function isPathAtOrInside(target, root2) {
  const resolvedRoot = path16.resolve(root2);
  const resolvedTarget = path16.resolve(target);
  return resolvedTarget === resolvedRoot || resolvedTarget.startsWith(resolvedRoot + path16.sep);
}
function resolveFacadeBoundaryOpenParams(boundaryRoot) {
  if (isPathAtOrInside(boundaryRoot, getOpenClawPackageRoot())) {
    return { boundaryLabel: "OpenClaw package root", rejectHardlinks: false };
  }
  const bundledDir = resolveBundledPluginsDir();
  if (bundledDir && isPathAtOrInside(boundaryRoot, bundledDir)) {
    return { boundaryLabel: "bundled plugin directory", rejectHardlinks: false };
  }
  return {
    boundaryLabel: "plugin root",
    rejectHardlinks: shouldRejectHardlinkedPluginFiles({ origin: "global", rootDir: boundaryRoot })
  };
}
function loadFacadeModuleAtLocationSync(params) {
  const location = params.location;
  const cached = loadedFacadeModules.get(location.modulePath);
  if (cached) {
    return cached;
  }
  const opened = openRootFileSync({
    absolutePath: location.modulePath,
    rootPath: location.boundaryRoot,
    ...resolveFacadeBoundaryOpenParams(location.boundaryRoot)
  });
  if (!opened.ok) {
    throw new Error(`Unable to open bundled plugin public surface ${location.modulePath}`, {
      cause: opened.error
    });
  }
  fs9.closeSync(opened.fd);
  const sentinel = {};
  loadedFacadeModules.set(location.modulePath, sentinel);
  let loaded;
  try {
    loaded = params.loadModule?.(location.modulePath) ?? getModuleLoader(location.modulePath)(location.modulePath);
    Object.assign(sentinel, loaded);
    loadedFacadePluginIds.add(
      typeof params.trackedPluginId === "function" ? params.trackedPluginId() : params.trackedPluginId
    );
  } catch (err) {
    loadedFacadeModules.delete(location.modulePath);
    throw err;
  }
  return sentinel;
}
function loadBundledPluginPublicSurfaceModuleSync(params) {
  const location = resolveFacadeModuleLocation(params);
  if (!location) {
    throw new Error(
      `Unable to resolve bundled plugin public surface ${params.dirName}/${params.artifactBasename}`
    );
  }
  return loadFacadeModuleAtLocationSync({
    location,
    trackedPluginId: params.trackedPluginId ?? params.dirName
  });
}
var DEFAULT_OPENCLAW_BROWSER_ENABLED = true;
var DEFAULT_BROWSER_EVALUATE_ENABLED = true;
var DEFAULT_OPENCLAW_BROWSER_COLOR = "#FF4500";
var DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME = "openclaw";
var DEFAULT_BROWSER_DEFAULT_PROFILE_NAME = "openclaw";
var DEFAULT_BROWSER_ACTION_TIMEOUT_MS = 6e4;
var DEFAULT_AI_SNAPSHOT_MAX_CHARS = 8e4;
var DEFAULT_UPLOAD_DIR = path17.join(resolvePreferredOpenClawTmpDir(), "uploads");
var cachedBrowserProfilesSurface;
function loadBrowserProfilesSurface() {
  cachedBrowserProfilesSurface ??= loadBundledPluginPublicSurfaceModuleSync(
    {
      dirName: "browser",
      artifactBasename: "browser-profiles.js"
    }
  );
  return cachedBrowserProfilesSurface;
}
function resolveBrowserConfig(cfg, rootConfig) {
  return loadBrowserProfilesSurface().resolveBrowserConfig(cfg, rootConfig);
}
function resolveProfile(resolved, profileName) {
  return loadBrowserProfilesSurface().resolveProfile(resolved, profileName);
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
function expectDefined(value, context) {
  if (value === null || value === void 0) {
    throw new Error("expected " + context + " to be defined");
  }
  return value;
}
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
var PRIVATE_QA_DIST_RELATIVE_PATH = path18.join("dist", "plugin-sdk", "qa-lab.js");
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
  const path19 = [];
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
    path19.push(arg);
    if (path19.length >= depth) {
      break;
    }
  }
  return path19;
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
    if (!fs10.existsSync(configPath)) {
      return void 0;
    }
    const parsed = JSON5.parse(fs10.readFileSync(configPath, "utf8"));
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
var fullContextToolPayloadRedaction = /* @__PURE__ */ Symbol("full-context-tool-payload-redaction");
var fullContextToolPayloadRedactionState = {
  mark(loggingConfig) {
    return {
      ...loggingConfig,
      [fullContextToolPayloadRedaction]: true
    };
  },
  isMarked(loggingConfig) {
    return Boolean(
      loggingConfig?.[fullContextToolPayloadRedaction]
    );
  }
};
function isFullContextToolPayloadRedaction(loggingConfig) {
  return fullContextToolPayloadRedactionState.isMarked(loggingConfig);
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
function redactToolPayloadText(text) {
  return redactToolPayloadTextWithConfig(text, readLoggingConfig());
}
function redactToolPayloadTextWithConfig(text, loggingConfig) {
  if (!text) {
    return text;
  }
  const exactRedacted = redactRegisteredSecretValues(text, maskToken);
  if (isFullContextToolPayloadRedaction(loggingConfig)) {
    const resolved = resolveRedactOptions(resolveToolPayloadRedaction(loggingConfig));
    return redactText(exactRedacted, resolved.patterns, {
      fullContext: true,
      redactFormBodies: resolved.redactFormBodies,
      redactStructuredAuthHeaders: resolved.redactStructuredAuthHeaders
    });
  }
  return redactSensitiveText2(text, resolveToolPayloadRedaction(loggingConfig));
}
function hasRawExplicitPort(raw) {
  const authority = raw.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split(/[/?#]/, 1)[0] ?? "";
  const hostPort = authority.includes("@") ? authority.slice(authority.lastIndexOf("@") + 1) : authority;
  if (hostPort.startsWith("[")) {
    return /^\[[^\]]+\]:\d+$/.test(hostPort);
  }
  return /:\d+$/.test(hostPort);
}
function parseBrowserHttpUrl(raw, label) {
  const trimmed = raw.trim();
  const parsed = new URL(trimmed);
  const allowed = ["http:", "https:", "ws:", "wss:"];
  if (!allowed.includes(parsed.protocol)) {
    throw new Error(`${label} must be http(s) or ws(s), got: ${parsed.protocol.replace(":", "")}`);
  }
  const isSecure = parsed.protocol === "https:" || parsed.protocol === "wss:";
  const hasExplicitPort = hasRawExplicitPort(trimmed);
  const port = parsed.port ? Number.parseInt(parsed.port, 10) : isSecure ? 443 : 80;
  if (hasExplicitPort && !parsed.port) {
    const defaultPort = isSecure ? 443 : 80;
    if (port !== defaultPort) {
      throw new Error(`${label} has invalid port: ${parsed.port}`);
    }
  }
  if (Number.isNaN(port) || port <= 0 || port > 65535) {
    throw new Error(`${label} has invalid port: ${parsed.port}`);
  }
  const normalized = parsed.toString().replace(/\/$/, "");
  let normalizedWithPort;
  if (hasExplicitPort && !parsed.port) {
    const proto = parsed.protocol + "//";
    const rest = normalized.slice(proto.length);
    const atIdx = rest.indexOf("@");
    const hostStart = atIdx >= 0 ? atIdx + 1 : 0;
    const hostPart = rest.slice(hostStart);
    const hostLen = hostPart.startsWith("[") ? hostPart.indexOf("]") + 1 : (() => {
      const idx = hostPart.search(/[:/]/);
      return idx < 0 ? hostPart.length : idx;
    })();
    const insertAt = hostStart + hostLen;
    normalizedWithPort = proto + rest.slice(0, insertAt) + ":" + port + rest.slice(insertAt);
  } else {
    normalizedWithPort = normalized;
  }
  return {
    parsed,
    port,
    hasExplicitPort,
    normalized,
    normalizedWithPort
  };
}
function redactCdpUrl(cdpUrl) {
  if (typeof cdpUrl !== "string") {
    return cdpUrl;
  }
  const trimmed = cdpUrl.trim();
  if (!trimmed) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    parsed.username = "";
    parsed.password = "";
    return redactToolPayloadText(parsed.toString().replace(/\/$/, ""));
  } catch {
    return redactToolPayloadText(trimmed);
  }
}
var cachedBrowserControlAuthSurface;
function loadBrowserControlAuthSurface() {
  cachedBrowserControlAuthSurface ??= loadBundledPluginPublicSurfaceModuleSync({
    dirName: "browser",
    artifactBasename: "browser-control-auth.js"
  });
  return cachedBrowserControlAuthSurface;
}
function resolveBrowserControlAuth(cfg, env = process.env) {
  return loadBrowserControlAuthSurface().resolveBrowserControlAuth(cfg, env);
}
async function ensureBrowserControlAuth(params) {
  return await loadBrowserControlAuthSurface().ensureBrowserControlAuth(params);
}
export {
  DEFAULT_AI_SNAPSHOT_MAX_CHARS,
  DEFAULT_BROWSER_ACTION_TIMEOUT_MS,
  DEFAULT_BROWSER_DEFAULT_PROFILE_NAME,
  DEFAULT_BROWSER_EVALUATE_ENABLED,
  DEFAULT_OPENCLAW_BROWSER_COLOR,
  DEFAULT_OPENCLAW_BROWSER_ENABLED,
  DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME,
  DEFAULT_UPLOAD_DIR,
  ensureBrowserControlAuth,
  movePathToTrash2 as movePathToTrash,
  parseBrowserHttpUrl,
  redactCdpUrl,
  resolveBrowserConfig,
  resolveBrowserControlAuth,
  resolveProfile
};
