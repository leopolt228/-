// packages/plugin-sdk/src/secret-input.ts
import { z as z3 } from "zod";
import fs from "node:fs";
import os2 from "node:os";
import path2 from "node:path";
import { configureFsSafePython } from "@openclaw/fs-safe/config";
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
import { z as z2 } from "zod";
import { z } from "zod";
function expectDefined(value, context) {
  if (value === null || value === void 0) {
    throw new Error("expected " + context + " to be defined");
  }
  return value;
}
var MAX_TIMER_TIMEOUT_MS = 2147e6;
var MAX_TIMER_TIMEOUT_SECONDS = Math.floor(MAX_TIMER_TIMEOUT_MS / 1e3);
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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
var DEFAULT_SECRET_PROVIDER_ALIAS = "default";
var ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
var LEGACY_SECRETREF_ENV_MARKER_PREFIX = "secretref-env:";
var LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX = "__env__:";
var ENV_SECRET_TEMPLATE_RE = /^\$\{([A-Z][A-Z0-9_]{0,127})\}$/;
var ENV_SECRET_SHORTHAND_RE = /^\$([A-Z][A-Z0-9_]{0,127})$/;
function isValidEnvSecretRefId(value) {
  return ENV_SECRET_REF_ID_RE.test(value);
}
function isSecretRef(value) {
  if (!isRecord(value)) {
    return false;
  }
  if (Object.keys(value).length !== 3) {
    return false;
  }
  return (value.source === "env" || value.source === "file" || value.source === "exec") && typeof value.provider === "string" && value.provider.trim().length > 0 && typeof value.id === "string" && value.id.trim().length > 0;
}
function isLegacySecretRefWithoutProvider(value) {
  if (!isRecord(value)) {
    return false;
  }
  return (value.source === "env" || value.source === "file" || value.source === "exec") && typeof value.id === "string" && value.id.trim().length > 0 && value.provider === void 0;
}
function parseEnvTemplateSecretRef(value, provider = DEFAULT_SECRET_PROVIDER_ALIAS) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  const match = ENV_SECRET_TEMPLATE_RE.exec(trimmed) ?? ENV_SECRET_SHORTHAND_RE.exec(trimmed);
  if (!match) {
    return null;
  }
  return {
    source: "env",
    provider: provider.trim() || DEFAULT_SECRET_PROVIDER_ALIAS,
    id: expectDefined(match[1], "types.secrets regex capture 1")
  };
}
function parseLegacySecretRefEnvMarker(value, provider = DEFAULT_SECRET_PROVIDER_ALIAS) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  const prefix = trimmed.startsWith(LEGACY_SECRETREF_ENV_MARKER_PREFIX) ? LEGACY_SECRETREF_ENV_MARKER_PREFIX : trimmed.startsWith(LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX) ? LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX : void 0;
  if (!prefix) {
    return null;
  }
  const id = trimmed.slice(prefix.length);
  if (!ENV_SECRET_REF_ID_RE.test(id)) {
    return null;
  }
  return {
    source: "env",
    provider: provider.trim() || DEFAULT_SECRET_PROVIDER_ALIAS,
    id
  };
}
function coerceSecretRef(value, defaults) {
  if (isSecretRef(value)) {
    return value;
  }
  const legacyEnvMarker = parseLegacySecretRefEnvMarker(value, defaults?.env);
  if (legacyEnvMarker) {
    return legacyEnvMarker;
  }
  if (isLegacySecretRefWithoutProvider(value)) {
    const provider = value.source === "env" ? defaults?.env ?? DEFAULT_SECRET_PROVIDER_ALIAS : value.source === "file" ? defaults?.file ?? DEFAULT_SECRET_PROVIDER_ALIAS : defaults?.exec ?? DEFAULT_SECRET_PROVIDER_ALIAS;
    return {
      source: value.source,
      provider,
      id: value.id
    };
  }
  const envTemplate = parseEnvTemplateSecretRef(value, defaults?.env);
  if (envTemplate) {
    return envTemplate;
  }
  return null;
}
function hasConfiguredSecretInput(value, defaults) {
  if (normalizeSecretInputString(value)) {
    return true;
  }
  return coerceSecretRef(value, defaults) !== null;
}
function normalizeSecretInputString(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
function formatSecretRefLabel(ref) {
  return `${ref.source}:${ref.provider}:${ref.id}`;
}
var UnresolvedSecretInputError = class extends Error {
  constructor(params) {
    super(
      `${params.path}: unresolved SecretRef "${formatSecretRefLabel(params.ref)}". Resolve this command against an active gateway runtime snapshot before reading it.`
    );
    this.name = "UnresolvedSecretInputError";
    this.path = params.path;
    this.ref = params.ref;
  }
};
function createUnresolvedSecretInputError(params) {
  return new UnresolvedSecretInputError(params);
}
function resolveSecretInputString(params) {
  const normalized = normalizeSecretInputString(params.value);
  if (normalized) {
    return {
      status: "available",
      value: normalized,
      ref: null
    };
  }
  const { ref } = resolveSecretInputRef({
    value: params.value,
    refValue: params.refValue,
    defaults: params.defaults
  });
  if (!ref) {
    return {
      status: "missing",
      value: void 0,
      ref: null
    };
  }
  if ((params.mode ?? "strict") === "strict") {
    throw createUnresolvedSecretInputError({ path: params.path, ref });
  }
  return {
    status: "configured_unavailable",
    value: void 0,
    ref
  };
}
function normalizeResolvedSecretInputString(params) {
  const resolved = resolveSecretInputString({
    ...params,
    mode: "strict"
  });
  if (resolved.status === "available") {
    return resolved.value;
  }
  return void 0;
}
function resolveSecretInputRef(params) {
  const explicitRef = coerceSecretRef(params.refValue, params.defaults);
  const inlineRef = explicitRef ? null : coerceSecretRef(params.value, params.defaults);
  return {
    explicitRef,
    inlineRef,
    ref: explicitRef ?? inlineRef
  };
}
var FILE_SECRET_REF_SEGMENT_PATTERN = /^(?:[^~]|~0|~1)*$/;
var SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
var EXEC_SECRET_REF_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$/;
var SINGLE_VALUE_FILE_REF_ID = "value";
function isValidFileSecretRefId(value) {
  if (value === SINGLE_VALUE_FILE_REF_ID) {
    return true;
  }
  if (!value.startsWith("/")) {
    return false;
  }
  return value.slice(1).split("/").every((segment) => FILE_SECRET_REF_SEGMENT_PATTERN.test(segment));
}
function isValidSecretProviderAlias(value) {
  return SECRET_PROVIDER_ALIAS_PATTERN.test(value);
}
function validateExecSecretRefId(value) {
  if (!EXEC_SECRET_REF_ID_PATTERN.test(value)) {
    return { ok: false, reason: "pattern" };
  }
  for (const segment of value.split("/")) {
    if (segment === "." || segment === "..") {
      return { ok: false, reason: "traversal-segment" };
    }
  }
  return { ok: true };
}
function isValidExecSecretRefId(value) {
  return validateExecSecretRefId(value).ok;
}
function isValidSecretRef(ref) {
  if (!isSecretRef(ref)) {
    return false;
  }
  if (!isValidSecretProviderAlias(ref.provider)) {
    return false;
  }
  if (ref.source === "env") {
    return isValidEnvSecretRefId(ref.id);
  }
  if (ref.source === "file") {
    return isValidFileSecretRefId(ref.id);
  }
  return isValidExecSecretRefId(ref.id);
}
function formatExecSecretRefIdValidationMessage() {
  return [
    "Exec secret reference id must match /^[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$/",
    'and must not include "." or ".." path segments',
    '(example: "vault/openai/api-key" or "aws/secret#json_key").'
  ].join(" ");
}
function normalizeSecretInput(value) {
  if (typeof value !== "string") {
    return "";
  }
  const collapsed = value.replace(/[\r\n\u2028\u2029]+/g, "");
  const chars = [];
  for (const char of collapsed) {
    const codePoint = char.codePointAt(0);
    const isControl = typeof codePoint === "number" && (codePoint >= 0 && codePoint <= 31 || codePoint === 127 || codePoint >= 128 && codePoint <= 159);
    if (typeof codePoint === "number" && codePoint <= 255 && !isControl) {
      chars.push(char);
    }
  }
  return chars.join("").trim();
}
var sensitive = z.registry();
function buildSecretInputSchema() {
  return secretInputSchema;
}
var providerSchema = z2.string().regex(
  SECRET_PROVIDER_ALIAS_PATTERN,
  'Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: "default").'
);
var secretInputSchema = z2.union([
  z2.string(),
  z2.discriminatedUnion("source", [
    z2.object({
      source: z2.literal("env"),
      provider: providerSchema,
      id: z2.string().regex(
        ENV_SECRET_REF_ID_RE,
        'Env secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (example: "OPENAI_API_KEY").'
      )
    }).strict(),
    z2.object({
      source: z2.literal("file"),
      provider: providerSchema,
      id: z2.string().refine(
        isValidFileSecretRefId,
        'File secret reference id must be an absolute JSON pointer (example: "/providers/openai/apiKey"), or "value" for singleValue mode.'
      )
    }).strict(),
    z2.object({
      source: z2.literal("exec"),
      provider: providerSchema,
      id: z2.string().refine(isValidExecSecretRefId, formatExecSecretRefIdValidationMessage())
    }).strict()
  ])
]).register(sensitive);
function buildOptionalSecretInputSchema() {
  return buildSecretInputSchema().optional();
}
function buildSecretInputArraySchema() {
  return z3.array(buildSecretInputSchema());
}
export {
  buildOptionalSecretInputSchema,
  buildSecretInputArraySchema,
  buildSecretInputSchema,
  coerceSecretRef,
  hasConfiguredSecretInput,
  isSecretRef,
  isValidSecretRef,
  normalizeResolvedSecretInputString,
  normalizeSecretInput,
  normalizeSecretInputString,
  resolveSecretInputString
};
