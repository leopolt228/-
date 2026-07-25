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

// packages/memory-host-sdk/src/host/qmd-scope.ts
function isQmdScopeAllowed(scope, sessionKey) {
  if (!scope) {
    return true;
  }
  const parsed = parseQmdSessionScope(sessionKey);
  const channel = parsed.channel;
  const chatType = parsed.chatType;
  const normalizedKey = parsed.normalizedKey ?? "";
  const rawKey = normalizeLowercaseStringOrEmpty(sessionKey ?? "");
  for (const rule of scope.rules ?? []) {
    if (!rule) {
      continue;
    }
    const match = rule.match ?? {};
    if (match.channel && match.channel !== channel) {
      continue;
    }
    if (match.chatType && match.chatType !== chatType) {
      continue;
    }
    const normalizedPrefix = normalizeOptionalLowercaseString(match.keyPrefix) || void 0;
    const rawPrefix = normalizeOptionalLowercaseString(match.rawKeyPrefix) || void 0;
    if (rawPrefix && !rawKey.startsWith(rawPrefix)) {
      continue;
    }
    if (normalizedPrefix) {
      const isLegacyRaw = normalizedPrefix.startsWith("agent:");
      if (isLegacyRaw) {
        if (!rawKey.startsWith(normalizedPrefix)) {
          continue;
        }
      } else if (!normalizedKey.startsWith(normalizedPrefix)) {
        continue;
      }
    }
    return rule.action === "allow";
  }
  const fallback = scope.default ?? "allow";
  return fallback === "allow";
}
function deriveQmdScopeChannel(key) {
  return parseQmdSessionScope(key).channel;
}
function deriveQmdScopeChatType(key) {
  return parseQmdSessionScope(key).chatType;
}
function parseQmdSessionScope(key) {
  const normalized = normalizeQmdSessionKey(key);
  if (!normalized) {
    return {};
  }
  const parts = normalized.split(":").filter(Boolean);
  let chatType;
  if (parts.length >= 2 && (parts[1] === "group" || parts[1] === "channel" || parts[1] === "direct" || parts[1] === "dm")) {
    if (parts.includes("group")) {
      chatType = "group";
    } else if (parts.includes("channel")) {
      chatType = "channel";
    }
    return {
      normalizedKey: normalized,
      channel: normalizeOptionalLowercaseString(parts[0]),
      chatType: chatType ?? "direct"
    };
  }
  if (normalized.includes(":group:")) {
    return { normalizedKey: normalized, chatType: "group" };
  }
  if (normalized.includes(":channel:")) {
    return { normalizedKey: normalized, chatType: "channel" };
  }
  return { normalizedKey: normalized, chatType: "direct" };
}
function normalizeQmdSessionKey(key) {
  if (!key) {
    return void 0;
  }
  const trimmed = key.trim();
  if (!trimmed) {
    return void 0;
  }
  const parsed = parseAgentSessionKey(trimmed);
  const normalized = normalizeLowercaseStringOrEmpty(parsed?.rest ?? trimmed);
  if (normalized.startsWith("subagent:")) {
    return void 0;
  }
  return normalized;
}
function parseAgentSessionKey(sessionKey) {
  const raw = normalizeOptionalLowercaseString(sessionKey);
  if (!raw) {
    return null;
  }
  const parts = raw.split(":").filter(Boolean);
  if (parts.length < 3 || parts[0] !== "agent") {
    return null;
  }
  const rest = parts.slice(2).join(":");
  return rest ? { rest } : null;
}
export {
  deriveQmdScopeChannel,
  deriveQmdScopeChatType,
  isQmdScopeAllowed
};
