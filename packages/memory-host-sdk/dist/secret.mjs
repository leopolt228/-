// packages/memory-host-sdk/src/secret.ts
var DEFAULT_SECRET_PROVIDER_ALIAS = "default";
var ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
var LEGACY_SECRETREF_ENV_MARKER_PREFIX = "secretref-env:";
var ENV_SECRET_TEMPLATE_RE = /^\$\{([A-Z][A-Z0-9_]{0,127})\}$/;
var SECRET_REF_SOURCES = /* @__PURE__ */ new Set(["env", "file", "exec"]);
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function normalizeSecretInputString(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
function hasSecretRefSource(value) {
  return typeof value === "string" && SECRET_REF_SOURCES.has(value);
}
function hasNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function isSecretRef(value) {
  if (!isRecord(value)) {
    return false;
  }
  const keys = Object.keys(value);
  return keys.length === 3 && hasSecretRefSource(value.source) && hasNonEmptyString(value.provider) && hasNonEmptyString(value.id);
}
function isLegacySecretRefWithoutProvider(value) {
  if (!isRecord(value)) {
    return false;
  }
  return hasSecretRefSource(value.source) && hasNonEmptyString(value.id) && value.provider === void 0;
}
function parseEnvTemplateSecretRef(value) {
  if (typeof value !== "string") {
    return null;
  }
  const match = ENV_SECRET_TEMPLATE_RE.exec(value.trim());
  if (!match) {
    return null;
  }
  return {
    source: "env",
    provider: DEFAULT_SECRET_PROVIDER_ALIAS,
    id: match[1] ?? ""
  };
}
function parseLegacySecretRefEnvMarker(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed.startsWith(LEGACY_SECRETREF_ENV_MARKER_PREFIX)) {
    return null;
  }
  const id = trimmed.slice(LEGACY_SECRETREF_ENV_MARKER_PREFIX.length);
  if (!ENV_SECRET_REF_ID_RE.test(id)) {
    return null;
  }
  return {
    source: "env",
    provider: DEFAULT_SECRET_PROVIDER_ALIAS,
    id
  };
}
function coerceSecretRef(value) {
  if (isSecretRef(value)) {
    return value;
  }
  if (isLegacySecretRefWithoutProvider(value)) {
    return {
      source: value.source,
      provider: DEFAULT_SECRET_PROVIDER_ALIAS,
      id: value.id
    };
  }
  return parseEnvTemplateSecretRef(value) ?? parseLegacySecretRefEnvMarker(value);
}
function hasConfiguredMemorySecretInputValue(value) {
  if (normalizeSecretInputString(value)) {
    return true;
  }
  return coerceSecretRef(value) !== null;
}
function formatSecretRefLabel(ref) {
  return `${ref.source}:${ref.provider}:${ref.id}`;
}
function createUnresolvedSecretInputError(params) {
  return new Error(
    `${params.path}: unresolved SecretRef "${formatSecretRefLabel(params.ref)}". Resolve this command against an active gateway runtime snapshot before reading it.`
  );
}
function resolveMemorySecretInputRef(value) {
  return coerceSecretRef(value);
}
function normalizeResolvedMemorySecretInputString(params) {
  const normalized = normalizeSecretInputString(params.value);
  if (normalized) {
    return normalized;
  }
  const ref = resolveMemorySecretInputRef(params.value);
  if (!ref) {
    return void 0;
  }
  throw createUnresolvedSecretInputError({ path: params.path, ref });
}
function normalizeEnvSecretInputString(value) {
  return normalizeSecretInputString(value);
}
function hasConfiguredMemorySecretInput(value) {
  return hasConfiguredMemorySecretInputValue(value);
}
function resolveMemorySecretInputString(params) {
  const ref = resolveMemorySecretInputRef(params.value);
  if (ref?.source === "env") {
    const envValue = normalizeEnvSecretInputString(process.env[ref.id]);
    if (envValue) {
      return envValue;
    }
  }
  return normalizeResolvedMemorySecretInputString({
    value: params.value,
    path: params.path
  });
}
export {
  hasConfiguredMemorySecretInput,
  resolveMemorySecretInputString
};
