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

// packages/acp-core/src/session-interaction-mode.ts
function resolveAcpSessionInteractionMode(entry) {
  if (!entry?.acp) {
    return "interactive";
  }
  if (normalizeOptionalString(entry.spawnedBy) || normalizeOptionalString(entry.parentSessionKey)) {
    return "parent-owned-background";
  }
  return "interactive";
}
function isParentOwnedBackgroundAcpSession(entry) {
  return resolveAcpSessionInteractionMode(entry) === "parent-owned-background";
}
function isRequesterParentOfBackgroundAcpSession(entry, requesterSessionKey) {
  if (!isParentOwnedBackgroundAcpSession(entry)) {
    return false;
  }
  const requester = normalizeOptionalString(requesterSessionKey);
  if (!requester) {
    return false;
  }
  const spawnedBy = normalizeOptionalString(entry?.spawnedBy);
  const parentSessionKey = normalizeOptionalString(entry?.parentSessionKey);
  return requester === spawnedBy || requester === parentSessionKey;
}
export {
  isParentOwnedBackgroundAcpSession,
  isRequesterParentOfBackgroundAcpSession
};
