// packages/gateway-client/src/timeouts.ts
var MAX_SAFE_TIMEOUT_DELAY_MS = 2147483647;
function resolveSafeTimeoutDelayMs(delayMs, opts) {
  const rawMinMs = opts?.minMs ?? 1;
  const minMs = Math.min(
    MAX_SAFE_TIMEOUT_DELAY_MS,
    Math.max(0, Number.isFinite(rawMinMs) ? Math.floor(rawMinMs) : 1)
  );
  const candidateMs = Number.isFinite(delayMs) ? Math.floor(delayMs) : minMs;
  return Math.min(MAX_SAFE_TIMEOUT_DELAY_MS, Math.max(minMs, candidateMs));
}
function resolveFiniteTimeoutDelayMs(delayMs, fallbackMs, opts) {
  const candidateMs = typeof delayMs === "number" && Number.isFinite(delayMs) ? delayMs : fallbackMs;
  return resolveSafeTimeoutDelayMs(candidateMs, opts);
}

// packages/gateway-client/src/event-loop-ready.ts
var DEFAULT_MAX_WAIT_MS = 1e4;
var DEFAULT_INTERVAL_MS = 1;
var DEFAULT_DRIFT_THRESHOLD_MS = 200;
var DEFAULT_CONSECUTIVE_READY_CHECKS = 2;
function resolvePositiveInteger(value, fallback) {
  return Number.isFinite(value) && value !== void 0 ? Math.max(1, Math.floor(value)) : fallback;
}
async function waitForEventLoopReady(options = {}) {
  const maxWaitMs = resolveFiniteTimeoutDelayMs(options.maxWaitMs, DEFAULT_MAX_WAIT_MS, {
    minMs: 0
  });
  const intervalMs = resolveFiniteTimeoutDelayMs(options.intervalMs, DEFAULT_INTERVAL_MS);
  const driftThresholdMs = resolvePositiveInteger(
    options.driftThresholdMs,
    DEFAULT_DRIFT_THRESHOLD_MS
  );
  const consecutiveReadyChecks = resolvePositiveInteger(
    options.consecutiveReadyChecks,
    DEFAULT_CONSECUTIVE_READY_CHECKS
  );
  const signal = options.signal;
  const startedAt = Date.now();
  let readyChecks = 0;
  let checks = 0;
  let maxDriftMs = 0;
  return await new Promise((resolve) => {
    let settled = false;
    let timer = null;
    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
    const finish = (ready, aborted = false) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimer();
      signal?.removeEventListener("abort", onAbort);
      resolve({
        ready,
        elapsedMs: Math.max(0, Date.now() - startedAt),
        maxDriftMs,
        checks,
        aborted
      });
    };
    const onAbort = () => {
      finish(false, true);
    };
    if (signal?.aborted) {
      finish(false, true);
      return;
    }
    signal?.addEventListener("abort", onAbort, { once: true });
    const scheduleNext = () => {
      if (signal?.aborted) {
        finish(false, true);
        return;
      }
      const elapsedMs = Math.max(0, Date.now() - startedAt);
      const remainingMs = maxWaitMs - elapsedMs;
      if (remainingMs <= 0) {
        finish(false);
        return;
      }
      const delayMs = Math.min(intervalMs, remainingMs);
      const scheduledAt = Date.now();
      timer = setTimeout(() => {
        timer = null;
        checks += 1;
        const driftMs = Math.max(0, Date.now() - scheduledAt - delayMs);
        maxDriftMs = Math.max(maxDriftMs, driftMs);
        if (driftMs > driftThresholdMs) {
          readyChecks = 0;
        } else {
          readyChecks += 1;
        }
        if (readyChecks >= consecutiveReadyChecks) {
          finish(true);
          return;
        }
        scheduleNext();
      }, delayMs);
    };
    scheduleNext();
  });
}
export {
  waitForEventLoopReady
};
