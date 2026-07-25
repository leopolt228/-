// packages/normalization-core/src/string-coerce.ts
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

// packages/acp-core/src/runtime/session-identity.ts
function normalizeIdentityState(value) {
  if (value !== "pending" && value !== "resolved") {
    return void 0;
  }
  return value;
}
function normalizeIdentitySource(value) {
  if (value !== "ensure" && value !== "status" && value !== "event") {
    return void 0;
  }
  return value;
}
function normalizeIdentity(identity) {
  if (!identity) {
    return void 0;
  }
  const state = normalizeIdentityState(identity.state);
  const source = normalizeIdentitySource(identity.source);
  const acpxRecordId = normalizeOptionalString(identity.acpxRecordId);
  const acpxSessionId = normalizeOptionalString(identity.acpxSessionId);
  const agentSessionId = normalizeOptionalString(identity.agentSessionId);
  const lastUpdatedAt = typeof identity.lastUpdatedAt === "number" && Number.isFinite(identity.lastUpdatedAt) ? identity.lastUpdatedAt : void 0;
  const hasAnyId = Boolean(acpxRecordId || acpxSessionId || agentSessionId);
  if (!state && !source && !hasAnyId && lastUpdatedAt === void 0) {
    return void 0;
  }
  const resolved = Boolean(acpxSessionId || agentSessionId);
  const normalizedState = state ?? (resolved ? "resolved" : "pending");
  return {
    state: normalizedState,
    ...acpxRecordId ? { acpxRecordId } : {},
    ...acpxSessionId ? { acpxSessionId } : {},
    ...agentSessionId ? { agentSessionId } : {},
    source: source ?? "status",
    lastUpdatedAt: lastUpdatedAt ?? Date.now()
  };
}
function resolveSessionIdentityFromMeta(meta) {
  if (!meta) {
    return void 0;
  }
  return normalizeIdentity(meta.identity);
}
function isSessionIdentityPending(identity) {
  if (!identity) {
    return true;
  }
  return identity.state === "pending";
}

// packages/acp-core/src/runtime/session-identifiers.ts
var ACP_SESSION_IDENTITY_RENDERER_VERSION = "v1";
var ACP_AGENT_RESUME_HINT_BY_KEY = /* @__PURE__ */ new Map([
  [
    "codex",
    ({ agentSessionId }) => `resume in Codex CLI: \`codex resume ${agentSessionId}\` (continues this conversation).`
  ],
  [
    "openai",
    ({ agentSessionId }) => `resume in Codex CLI: \`codex resume ${agentSessionId}\` (continues this conversation).`
  ],
  [
    "codex-cli",
    ({ agentSessionId }) => `resume in Codex CLI: \`codex resume ${agentSessionId}\` (continues this conversation).`
  ],
  [
    "kimi",
    ({ agentSessionId }) => `resume in Kimi CLI: \`kimi resume ${agentSessionId}\` (continues this conversation).`
  ],
  [
    "moonshot-kimi",
    ({ agentSessionId }) => `resume in Kimi CLI: \`kimi resume ${agentSessionId}\` (continues this conversation).`
  ]
]);
function normalizeAgentHintKey(value) {
  const normalized = normalizeOptionalString(value);
  if (!normalized) {
    return void 0;
  }
  return normalizeLowercaseStringOrEmpty(normalized).replace(/[\s_]+/g, "-");
}
function resolveAcpAgentResumeHintLine(params) {
  const agentSessionId = normalizeOptionalString(params.agentSessionId);
  const agentKey = normalizeAgentHintKey(params.agentId);
  if (!agentSessionId || !agentKey) {
    return void 0;
  }
  const resolver = ACP_AGENT_RESUME_HINT_BY_KEY.get(agentKey);
  return resolver ? resolver({ agentSessionId }) : void 0;
}
function resolveAcpSessionIdentifierLinesFromIdentity(params) {
  const backend = normalizeOptionalString(params.backend) ?? "backend";
  const mode = params.mode ?? "status";
  const identity = params.identity;
  const agentSessionId = normalizeOptionalString(identity?.agentSessionId);
  const acpxSessionId = normalizeOptionalString(identity?.acpxSessionId);
  const acpxRecordId = normalizeOptionalString(identity?.acpxRecordId);
  const hasIdentifier = Boolean(agentSessionId || acpxSessionId || acpxRecordId);
  if (isSessionIdentityPending(identity) && hasIdentifier) {
    if (mode === "status") {
      return ["session ids: pending (available after the first reply)"];
    }
    return [];
  }
  const lines = [];
  if (agentSessionId) {
    lines.push(`agent session id: ${agentSessionId}`);
  }
  if (acpxSessionId) {
    lines.push(`${backend} session id: ${acpxSessionId}`);
  }
  if (acpxRecordId) {
    lines.push(`${backend} record id: ${acpxRecordId}`);
  }
  return lines;
}
function resolveAcpSessionCwd(meta) {
  const runtimeCwd = normalizeOptionalString(meta?.runtimeOptions?.cwd);
  if (runtimeCwd) {
    return runtimeCwd;
  }
  return normalizeOptionalString(meta?.cwd);
}
function resolveAcpThreadSessionDetailLines(params) {
  const meta = params.meta;
  const identity = resolveSessionIdentityFromMeta(meta);
  const backend = normalizeOptionalString(meta?.backend) ?? "backend";
  const lines = resolveAcpSessionIdentifierLinesFromIdentity({
    backend,
    identity,
    mode: "thread"
  });
  if (lines.length === 0) {
    return lines;
  }
  const hint = resolveAcpAgentResumeHintLine({
    agentId: meta?.agent,
    agentSessionId: identity?.agentSessionId
  });
  if (hint) {
    lines.push(hint);
  }
  return lines;
}
export {
  ACP_SESSION_IDENTITY_RENDERER_VERSION,
  resolveAcpSessionCwd,
  resolveAcpSessionIdentifierLinesFromIdentity,
  resolveAcpThreadSessionDetailLines
};
