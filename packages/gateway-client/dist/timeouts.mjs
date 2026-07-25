// packages/gateway-client/src/timeouts.ts
function parseStrictPositiveInteger(value) {
  const trimmed = value.trim();
  if (!/^\+?\d+$/u.test(trimmed)) {
    return void 0;
  }
  const parsed = Number(trimmed);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : void 0;
}
var MAX_SAFE_TIMEOUT_DELAY_MS = 2147483647;
var DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS = 15e3;
var DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS = 3e4;
var MIN_CONNECT_CHALLENGE_TIMEOUT_MS = 250;
var MAX_CONNECT_CHALLENGE_TIMEOUT_MS = DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS;
function resolveSafeTimeoutDelayMs(delayMs, opts) {
  const rawMinMs = opts?.minMs ?? 1;
  const minMs = Math.min(
    MAX_SAFE_TIMEOUT_DELAY_MS,
    Math.max(0, Number.isFinite(rawMinMs) ? Math.floor(rawMinMs) : 1)
  );
  const candidateMs = Number.isFinite(delayMs) ? Math.floor(delayMs) : minMs;
  return Math.min(MAX_SAFE_TIMEOUT_DELAY_MS, Math.max(minMs, candidateMs));
}
function addSafeTimeoutDelayGraceMs(delayMs, graceMs, opts) {
  if (!Number.isFinite(delayMs) || !Number.isFinite(graceMs)) {
    return resolveSafeTimeoutDelayMs(MAX_SAFE_TIMEOUT_DELAY_MS, opts);
  }
  const withGrace = delayMs + graceMs;
  return resolveSafeTimeoutDelayMs(
    Number.isFinite(withGrace) ? withGrace : MAX_SAFE_TIMEOUT_DELAY_MS,
    opts
  );
}
function resolveFiniteTimeoutDelayMs(delayMs, fallbackMs, opts) {
  const candidateMs = typeof delayMs === "number" && Number.isFinite(delayMs) ? delayMs : fallbackMs;
  return resolveSafeTimeoutDelayMs(candidateMs, opts);
}
function clampConnectChallengeTimeoutMs(timeoutMs, maxTimeoutMs = MAX_CONNECT_CHALLENGE_TIMEOUT_MS) {
  return Math.max(
    MIN_CONNECT_CHALLENGE_TIMEOUT_MS,
    Math.min(Math.max(MIN_CONNECT_CHALLENGE_TIMEOUT_MS, maxTimeoutMs), timeoutMs)
  );
}
function getConnectChallengeTimeoutMsFromEnv(env = process.env) {
  const raw = env.OPENCLAW_CONNECT_CHALLENGE_TIMEOUT_MS;
  if (raw) {
    const parsed = parseStrictPositiveInteger(raw);
    if (parsed !== void 0) {
      return resolveSafeTimeoutDelayMs(parsed);
    }
  }
  return void 0;
}
function normalizePositiveTimeoutMs(timeoutMs) {
  return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? resolveSafeTimeoutDelayMs(timeoutMs) : void 0;
}
function resolveConnectChallengeTimeoutMs(timeoutMs, params) {
  const configuredPreauthTimeoutMs = resolvePreauthHandshakeTimeoutMs({
    env: params?.env,
    configuredTimeoutMs: params?.configuredTimeoutMs
  });
  const maxTimeoutMs = Math.max(DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS, configuredPreauthTimeoutMs);
  if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs)) {
    return clampConnectChallengeTimeoutMs(timeoutMs, maxTimeoutMs);
  }
  const envOverride = getConnectChallengeTimeoutMsFromEnv(params?.env);
  if (envOverride !== void 0) {
    return clampConnectChallengeTimeoutMs(envOverride, Math.max(maxTimeoutMs, envOverride));
  }
  return clampConnectChallengeTimeoutMs(configuredPreauthTimeoutMs, maxTimeoutMs);
}
function resolvePreauthHandshakeTimeoutMs(params) {
  const env = params?.env ?? process.env;
  const configuredTimeout = env.OPENCLAW_HANDSHAKE_TIMEOUT_MS || env.VITEST && env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS;
  if (configuredTimeout) {
    const parsed = parseStrictPositiveInteger(configuredTimeout);
    if (parsed !== void 0) {
      return resolveSafeTimeoutDelayMs(parsed);
    }
  }
  const configured = normalizePositiveTimeoutMs(params?.configuredTimeoutMs);
  if (configured !== void 0) {
    return configured;
  }
  return DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS;
}
export {
  DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS,
  DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS,
  MAX_CONNECT_CHALLENGE_TIMEOUT_MS,
  MAX_SAFE_TIMEOUT_DELAY_MS,
  MIN_CONNECT_CHALLENGE_TIMEOUT_MS,
  addSafeTimeoutDelayGraceMs,
  clampConnectChallengeTimeoutMs,
  getConnectChallengeTimeoutMsFromEnv,
  resolveConnectChallengeTimeoutMs,
  resolveFiniteTimeoutDelayMs,
  resolvePreauthHandshakeTimeoutMs,
  resolveSafeTimeoutDelayMs
};
