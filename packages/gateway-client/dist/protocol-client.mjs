// packages/gateway-protocol/src/frame-guards.ts
function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}
function isNonNegativeInteger(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
function isGatewayErrorShape(value) {
  if (!isRecord(value)) {
    return false;
  }
  if (!isNonEmptyString(value.code) || !isNonEmptyString(value.message)) {
    return false;
  }
  if (value.retryable !== void 0 && typeof value.retryable !== "boolean") {
    return false;
  }
  return value.retryAfterMs === void 0 || isNonNegativeInteger(value.retryAfterMs);
}
function isGatewayEventFrame(value) {
  if (!isRecord(value) || value.type !== "event" || !isNonEmptyString(value.event)) {
    return false;
  }
  return value.seq === void 0 || isNonNegativeInteger(value.seq);
}
function isGatewayResponseFrame(value) {
  if (!isRecord(value) || value.type !== "res" || !isNonEmptyString(value.id) || typeof value.ok !== "boolean") {
    return false;
  }
  return value.error === void 0 || isGatewayErrorShape(value.error);
}

// packages/retry/src/index.ts
var MAX_TIMER_TIMEOUT_MS = 2147e6;
function computeBackoff(policy, attempt) {
  const base = Math.min(policy.maxMs, policy.initialMs * policy.factor ** Math.max(attempt - 1, 0));
  const jitter = base * policy.jitter * Math.random();
  return Math.min(policy.maxMs, Math.round(base + jitter));
}
async function sleepWithAbort(ms, abortSignal, options = {}) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return;
  }
  const delayMs = Math.min(Math.max(Math.floor(ms), 1), MAX_TIMER_TIMEOUT_MS);
  await new Promise((resolve, reject) => {
    let settled = false;
    let timer = null;
    const cleanup = () => abortSignal?.removeEventListener("abort", onAbort);
    const onAbort = () => {
      if (settled) {
        return;
      }
      settled = true;
      if (timer) {
        clearTimeout(timer);
      }
      timer = null;
      cleanup();
      reject(new Error("aborted", { cause: abortSignal?.reason ?? new Error("aborted") }));
    };
    abortSignal?.addEventListener("abort", onAbort, { once: true });
    if (abortSignal?.aborted) {
      onAbort();
      return;
    }
    timer = setTimeout(() => {
      settled = true;
      cleanup();
      timer = null;
      resolve();
    }, delayMs);
    if (options.ref === false) {
      timer.unref?.();
    }
    if (abortSignal?.aborted) {
      onAbort();
    }
  });
}
var RetrySupervisor = class {
  constructor(policy, maxAttempts = Number.POSITIVE_INFINITY) {
    this.policy = policy;
    this.maxAttempts = maxAttempts;
    this.attempts = 0;
    this.initialMs = policy.initialMs;
  }
  reset(initialMs = this.policy.initialMs) {
    this.cancel();
    this.attempts = 0;
    this.initialMs = initialMs;
    this.nextDelayOverrideMs = void 0;
  }
  cancel(reason = new Error("retry cancelled")) {
    this.pendingAbort?.abort(reason);
    this.pendingAbort = void 0;
  }
  next(abortSignal) {
    const override = this.nextDelayOverrideMs;
    this.nextDelayOverrideMs = void 0;
    if (override === void 0 && ++this.attempts > Math.ceil(this.maxAttempts)) {
      return void 0;
    }
    const attempt = Math.max(this.attempts, 1);
    const delayMs = override ?? computeBackoff({ ...this.policy, initialMs: this.initialMs }, attempt);
    this.cancel();
    const pendingAbort = new AbortController();
    this.pendingAbort = pendingAbort;
    return {
      attempt,
      delayMs,
      signal: abortSignal ? AbortSignal.any([pendingAbort.signal, abortSignal]) : pendingAbort.signal
    };
  }
};
var DEFAULT_RETRY_CONFIG = {
  attempts: 3,
  minDelayMs: 300,
  maxDelayMs: 3e4,
  jitter: 0
};
var defaultSleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});
function asFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function clampNumber(value, fallback, min, max) {
  const next = asFiniteNumber(value);
  if (next === void 0) {
    return fallback;
  }
  return Math.min(Math.max(next, min ?? Number.NEGATIVE_INFINITY), max ?? Number.POSITIVE_INFINITY);
}
function resolveAttemptCount(value, fallback) {
  return Math.max(1, Math.round(asFiniteNumber(value) ?? fallback));
}
function resolveRetryDelayMs(value) {
  const finite = value === Number.POSITIVE_INFINITY ? MAX_TIMER_TIMEOUT_MS : asFiniteNumber(value) ?? 0;
  return Math.min(Math.max(Math.round(finite), 0), MAX_TIMER_TIMEOUT_MS);
}
function resolveJitterConfig(value, fallback) {
  if (value === "full") {
    return "full";
  }
  const fraction = asFiniteNumber(value);
  return fraction === void 0 ? fallback : Math.min(Math.max(fraction, 0), 1);
}
function resolveRetryConfig(defaults = DEFAULT_RETRY_CONFIG, overrides) {
  const attempts = resolveAttemptCount(overrides?.attempts, defaults.attempts);
  const minDelayMs = resolveRetryDelayMs(
    clampNumber(overrides?.minDelayMs, defaults.minDelayMs, 0)
  );
  const maxDelayMs = Math.max(
    minDelayMs,
    resolveRetryDelayMs(clampNumber(overrides?.maxDelayMs, defaults.maxDelayMs, 0))
  );
  return {
    attempts,
    minDelayMs,
    maxDelayMs,
    jitter: resolveJitterConfig(overrides?.jitter, defaults.jitter)
  };
}
function applyJitter(delayMs, jitter, mode, random) {
  if (jitter === "full") {
    if (mode === "symmetric") {
      return Math.max(0, Math.round(delayMs * (0.5 + random() * 0.5)));
    }
    return Math.max(0, Math.ceil(delayMs * (1 + random())));
  }
  if (jitter <= 0) {
    return mode === "positive" ? Math.ceil(delayMs) : delayMs;
  }
  const fraction = random();
  const offset = mode === "positive" ? fraction * jitter : (fraction * 2 - 1) * jitter;
  const raw = delayMs * (1 + offset);
  return Math.max(0, mode === "positive" ? Math.ceil(raw) : Math.round(raw));
}
function toRetryError(value, fallbackMessage = "Non-Error thrown") {
  if (value instanceof Error) {
    return value;
  }
  if (typeof value === "string") {
    return new Error(value);
  }
  const error = new Error(fallbackMessage, { cause: value });
  if (typeof value === "object" && value !== null || typeof value === "function") {
    Object.assign(error, value);
  }
  return error;
}
function createRetryRunner(runtime = {}) {
  const runtimeSleep = runtime.sleep ?? defaultSleep;
  const runtimeRandom = runtime.random ?? Math.random;
  const createFailure = runtime.createFailure ?? ((errors) => toRetryError(errors.at(-1) ?? new Error("Retry failed")));
  return async function retryAsync2(fn, attemptsOrOptions = 3, initialDelayMs = 300) {
    const attemptErrors = [];
    if (typeof attemptsOrOptions === "number") {
      const attempts = resolveAttemptCount(attemptsOrOptions, DEFAULT_RETRY_CONFIG.attempts);
      for (let index = 0; index < attempts; index += 1) {
        try {
          return await fn();
        } catch (err) {
          attemptErrors.push(err);
          if (index === attempts - 1) {
            break;
          }
          await runtimeSleep(resolveRetryDelayMs(initialDelayMs * 2 ** index));
        }
      }
      throw createFailure(attemptErrors);
    }
    const options = attemptsOrOptions;
    const resolved = resolveRetryConfig(DEFAULT_RETRY_CONFIG, options);
    const maxAttempts = resolved.attempts;
    const minDelayMs = resolved.minDelayMs;
    const maxDelayMs = resolved.maxDelayMs > 0 ? resolved.maxDelayMs : Number.POSITIVE_INFINITY;
    const retryAfterMaxDelayMs = options.retryAfterMaxDelayMs === void 0 ? maxDelayMs : Math.max(
      minDelayMs,
      resolveRetryDelayMs(clampNumber(options.retryAfterMaxDelayMs, maxDelayMs, 0))
    );
    const random = options.random ?? runtimeRandom;
    const sleep = options.sleep ?? runtimeSleep;
    const shouldRetry = options.shouldRetry ?? (() => true);
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await fn();
      } catch (err) {
        attemptErrors.push(err);
        if (attempt >= maxAttempts || !shouldRetry(err, attempt)) {
          break;
        }
        const context = {
          attempt,
          maxAttempts,
          err,
          label: options.label
        };
        const retryAfterMs = options.retryAfterMs?.(err);
        const hasRetryAfter = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs);
        const configuredDelay = typeof options.delayMs === "function" ? options.delayMs(context) : options.delayMs;
        const resolvedConfiguredDelay = configuredDelay === void 0 ? void 0 : resolveRetryDelayMs(configuredDelay);
        const baseDelay = hasRetryAfter ? Math.max(retryAfterMs, minDelayMs) : resolvedConfiguredDelay === void 0 ? minDelayMs * 2 ** (attempt - 1) : Math.max(resolvedConfiguredDelay, minDelayMs);
        const delayCap = hasRetryAfter ? retryAfterMaxDelayMs : maxDelayMs;
        let delay = Math.min(baseDelay, delayCap);
        const canHonorRetryAfter = hasRetryAfter && (retryAfterMs ?? 0) <= delayCap;
        const wantsPositiveDraw = resolved.jitter === "full" ? !hasRetryAfter || canHonorRetryAfter : canHonorRetryAfter;
        delay = applyJitter(
          delay,
          resolved.jitter,
          wantsPositiveDraw ? "positive" : "symmetric",
          random
        );
        delay = Math.min(Math.max(delay, minDelayMs), delayCap);
        await options.onRetry?.({ ...context, delayMs: delay });
        if (delay > 0) {
          await sleep(delay);
        }
      }
    }
    throw createFailure(attemptErrors);
  };
}
var retryAsync = createRetryRunner();

// packages/gateway-client/src/protocol-client.ts
var GatewayProtocolRequestError = class extends Error {
  constructor(error) {
    super(error.message ?? "request failed");
    this.name = "GatewayProtocolRequestError";
    this.code = error.code ?? "UNAVAILABLE";
    this.gatewayCode = this.code;
    this.details = error.details;
    this.retryable = error.retryable === true;
    this.retryAfterMs = error.retryAfterMs;
  }
};
var GatewayProtocolClient = class {
  constructor(opts) {
    this.opts = opts;
    this.socket = null;
    this.pending = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Set();
    this.stopped = true;
    this.generation = 0;
    this.lastSeq = null;
    this.connectNonce = null;
    this.connectSent = false;
    this.connectRequestSent = false;
    this.handshakeTimer = null;
    this.socketOpened = false;
    this.helloReceived = false;
    this.connectTiming = null;
    this.reconnectSupervisor = new RetrySupervisor({
      initialMs: opts.reconnect.initialMs,
      maxMs: opts.reconnect.maxMs,
      factor: opts.reconnect.multiplier,
      jitter: 0
    });
  }
  get connected() {
    return this.socket?.isOpen() ?? false;
  }
  get hasPendingRequests() {
    return this.pending.size > 0;
  }
  get connecting() {
    return this.connectSent && !this.helloReceived;
  }
  get hasUnboundedPendingRequests() {
    return [...this.pending.values()].some((pending) => pending.unbounded);
  }
  start() {
    this.stopped = false;
    this.reconnectSupervisor.cancel();
    this.connect();
  }
  stop() {
    this.stopped = true;
    this.clearHandshakeTimer();
    this.reconnectSupervisor.reset();
    const socket = this.socket;
    if (socket && this.opts.notifyStoppedClose) {
      this.stoppedSocket = { socket, context: this.closeContext() };
    }
    this.socket = null;
    this.connectFailure = void 0;
    this.connectTiming = null;
    this.flushRequests(new Error("gateway client stopped"));
    socket?.close();
  }
  request(method, params, options) {
    const socket = this.socket;
    if (!socket?.isOpen()) {
      return Promise.reject(new Error("gateway not connected"));
    }
    if (typeof method !== "string" || method.length === 0) {
      return Promise.reject(new Error("invalid request frame: method must be a non-empty string"));
    }
    const id = this.opts.createRequestId();
    const timeoutMs = options?.timeoutMs === null ? void 0 : options?.timeoutMs ?? this.opts.requestTimeoutMs;
    return new Promise((resolve, reject) => {
      let timeout;
      const pending = {
        resolve: (value) => resolve(value),
        reject,
        expectFinal: options?.expectFinal === true,
        acceptedNotified: false,
        onAccepted: options?.onAccepted,
        unbounded: timeoutMs === void 0,
        method,
        startedAtMs: this.nowMs()
      };
      const onAbort = () => {
        this.pending.delete(id);
        if (timeout) {
          clearTimeout(timeout);
        }
        this.finishRequestTiming(id, pending, false, "CLIENT_ABORTED");
        reject(
          this.opts.createRequestAbortError?.(method) ?? new Error(`gateway request aborted for ${method}`)
        );
      };
      const cleanup = () => {
        if (timeout) {
          clearTimeout(timeout);
        }
        options?.signal?.removeEventListener("abort", onAbort);
      };
      if (options?.signal?.aborted) {
        reject(
          this.opts.createRequestAbortError?.(method) ?? new Error(`gateway request aborted for ${method}`)
        );
        return;
      }
      pending.cleanup = cleanup;
      if (timeoutMs !== void 0 && timeoutMs >= 0) {
        timeout = setTimeout(() => {
          this.pending.delete(id);
          options?.signal?.removeEventListener("abort", onAbort);
          this.finishRequestTiming(id, pending, false, "CLIENT_TIMEOUT");
          reject(
            this.opts.createRequestTimeoutError?.(method, timeoutMs) ?? new Error(`gateway request timed out after ${timeoutMs}ms: ${method}`)
          );
        }, timeoutMs);
        timeout.unref?.();
      }
      options?.signal?.addEventListener("abort", onAbort, { once: true });
      this.pending.set(id, pending);
      try {
        socket.send(JSON.stringify({ type: "req", id, method, params }));
        this.invoke("sent", () => options?.onSent?.());
      } catch (error) {
        this.pending.delete(id);
        cleanup();
        this.finishRequestTiming(id, pending, false, "CLIENT_SEND_ERROR");
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }
  addEventListener(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  closeSocket(code, reason) {
    this.socket?.close(code, reason);
  }
  resetReconnectBackoff(initialMs) {
    this.reconnectSupervisor.reset(initialMs);
  }
  recordTiming(phase, generation, plan, detail) {
    const now = this.nowMs();
    const state = this.connectTiming;
    if (!state || state.generation !== generation) {
      return;
    }
    state.hasChallenge ||= phase === "challenge";
    state.usedFallback ||= phase === "fallback";
    this.invoke(
      "connect timing",
      () => this.opts.onTiming?.({
        phase,
        generation,
        durationMs: Math.max(0, now - state.startedAtMs),
        phaseDurationMs: Math.max(0, now - state.lastAtMs),
        hasChallenge: state.hasChallenge,
        usedFallback: state.usedFallback,
        plan,
        detail
      })
    );
    state.lastAtMs = now;
    if (phase === "hello" || phase === "failed") {
      this.connectTiming = null;
    }
  }
  connect() {
    if (this.stopped) {
      return;
    }
    const generation = this.generation + 1;
    this.connectNonce = null;
    this.connectSent = false;
    this.connectRequestSent = false;
    this.socketOpened = false;
    this.helloReceived = false;
    this.connectFailure = void 0;
    let socket;
    try {
      socket = this.opts.createSocket({
        open: () => this.handleOpen(socket, generation),
        message: (data) => this.handleMessage(socket, generation, data),
        close: (code, reason) => this.handleClose(socket, generation, code, reason),
        error: (error) => this.handleSocketError(socket, generation, error)
      });
    } catch (error) {
      const normalized = error instanceof Error ? error : new Error(String(error));
      this.opts.onSocketFactoryError?.(normalized);
      this.opts.onConnectError?.(normalized);
      if (this.opts.rethrowSocketFactoryError?.(normalized)) {
        throw normalized;
      }
      return;
    }
    this.generation = generation;
    this.socket = socket;
    const now = this.nowMs();
    this.connectTiming = {
      generation,
      startedAtMs: now,
      lastAtMs: now,
      hasChallenge: false,
      usedFallback: false
    };
  }
  handleOpen(socket, generation) {
    if (!this.isActive(socket, generation)) {
      return;
    }
    this.socketOpened = true;
    this.recordTiming("socket-open", generation);
    if (this.connectNonce) {
      this.sendConnect(socket, generation);
      return;
    }
    this.armHandshakeTimer(socket, generation);
  }
  armHandshakeTimer(socket, generation) {
    this.clearHandshakeTimer();
    const armedAt = Date.now();
    this.handshakeTimer = setTimeout(() => {
      this.handshakeTimer = null;
      if (!this.isActive(socket, generation) || this.connectSent || !socket.isOpen()) {
        return;
      }
      if (this.opts.handshake.mode === "fallback") {
        this.recordTiming("fallback", generation);
        this.sendConnect(socket, generation);
        return;
      }
      const elapsedMs = Date.now() - armedAt;
      const error = new Error(
        this.opts.handshake.timeoutMessage?.(elapsedMs) ?? `gateway connect challenge timeout after ${elapsedMs}ms`
      );
      this.opts.onConnectError?.(error);
      socket.close(1008, "connect challenge timeout");
    }, this.opts.handshake.timeoutMs);
    this.handshakeTimer.unref?.();
  }
  sendConnect(socket, generation) {
    if (!this.isActive(socket, generation) || !socket.isOpen() || this.connectSent) {
      return;
    }
    this.connectSent = true;
    this.clearHandshakeTimer();
    let planOrPromise;
    try {
      planOrPromise = this.opts.buildConnectPlan({
        nonce: this.connectNonce,
        generation
      });
    } catch (error) {
      this.handleConnectPlanError(socket, generation, error);
      return;
    }
    if (planOrPromise instanceof Promise) {
      void planOrPromise.then((plan) => this.sendConnectPlan(socket, generation, plan)).catch((error) => this.handleConnectPlanError(socket, generation, error));
      return;
    }
    this.sendConnectPlan(socket, generation, planOrPromise);
  }
  handleConnectPlanError(socket, generation, error) {
    if (!this.isActive(socket, generation)) {
      return;
    }
    const normalized = error instanceof Error ? error : new Error(String(error));
    const outcome = this.opts.onConnectPlanError?.(normalized) ?? {
      closeCode: 1008,
      closeReason: "connect failed"
    };
    this.opts.onConnectError?.(outcome.error ?? normalized);
    if (outcome.stop) {
      this.stopped = true;
    }
    socket.close(outcome.closeCode, outcome.closeReason);
  }
  sendConnectPlan(socket, generation, plan) {
    if (!this.isActive(socket, generation) || !socket.isOpen()) {
      return;
    }
    const context = { generation, nonce: this.connectNonce, plan };
    this.recordTiming("connect-plan-ready", generation, plan);
    this.recordTiming("request-sent", generation, plan);
    this.connectRequestSent = true;
    void this.request("connect", this.opts.buildConnectParams(plan)).then((hello) => {
      if (!this.isActive(socket, generation)) {
        return;
      }
      this.helloReceived = true;
      this.connectFailure = void 0;
      this.reconnectSupervisor.reset();
      this.recordTiming("hello", generation, plan);
      this.opts.onConnectHello?.(hello, context);
      this.invoke("hello", () => this.opts.onHello?.(hello));
    }).catch((error) => {
      if (!this.isActive(socket, generation)) {
        return;
      }
      const requestError = error instanceof GatewayProtocolRequestError ? error : new GatewayProtocolRequestError({ message: String(error) });
      const outcome = this.opts.onConnectFailure?.(requestError, context) ?? {
        closeCode: 1008,
        closeReason: "connect failed"
      };
      this.connectFailure = {
        error: requestError,
        reconnectDelayMs: outcome.reconnectDelayMs
      };
      if (outcome.stop) {
        this.stopped = true;
      }
      socket.close(outcome.closeCode, outcome.closeReason);
    });
  }
  handleMessage(socket, generation, raw) {
    if (!this.isActive(socket, generation)) {
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      this.opts.onParseError?.(error);
      return;
    }
    if (isGatewayEventFrame(parsed)) {
      this.opts.onActivity?.();
      if (parsed.event === "connect.challenge") {
        const payload = parsed.payload;
        const nonce = typeof payload?.nonce === "string" ? payload.nonce.trim() : "";
        if (!nonce) {
          if (this.opts.handshake.mode === "require-challenge") {
            const error = new Error("gateway connect challenge missing nonce");
            this.opts.onConnectError?.(error);
            socket.close(1008, "connect challenge missing nonce");
          }
          return;
        }
        this.connectNonce = nonce;
        this.recordTiming("challenge", generation);
        this.sendConnect(socket, generation);
        return;
      }
      const seq = typeof parsed.seq === "number" ? parsed.seq : null;
      if (seq !== null) {
        if (this.lastSeq !== null && seq > this.lastSeq + 1) {
          const expected = this.lastSeq + 1;
          this.invoke("gap", () => this.opts.onGap?.({ expected, received: seq }));
        }
        this.lastSeq = seq;
      }
      this.invoke("event", () => this.opts.onEvent?.(parsed));
      for (const listener of this.listeners) {
        this.invoke("event listener", () => listener(parsed));
      }
      return;
    }
    if (!isGatewayResponseFrame(parsed)) {
      return;
    }
    this.opts.onActivity?.();
    this.handleResponse(parsed);
  }
  handleResponse(frame) {
    const pending = this.pending.get(frame.id);
    if (!pending) {
      return;
    }
    const status = frame.payload?.status;
    if (pending.expectFinal && status === "accepted") {
      if (!pending.acceptedNotified) {
        pending.acceptedNotified = true;
        this.invoke("accepted", () => pending.onAccepted?.(frame.payload));
      }
      return;
    }
    this.pending.delete(frame.id);
    pending.cleanup?.();
    if (frame.ok) {
      this.finishRequestTiming(frame.id, pending, true);
      pending.resolve(frame.payload);
      return;
    }
    this.finishRequestTiming(frame.id, pending, false, frame.error?.code);
    pending.reject(
      this.opts.createRequestError?.(frame.error ?? {}) ?? new GatewayProtocolRequestError(frame.error ?? {})
    );
  }
  handleClose(socket, generation, code, reason) {
    if (this.socket !== socket) {
      if (this.stoppedSocket?.socket === socket) {
        const context2 = { ...this.stoppedSocket.context, code, reason };
        this.stoppedSocket = void 0;
        this.invoke("close", () => this.opts.onClose?.(context2, { retry: false, notify: true }));
      }
      return;
    }
    this.socket = null;
    this.clearHandshakeTimer();
    const context = {
      ...this.closeContext(),
      code,
      reason,
      generation
    };
    this.connectFailure = void 0;
    const decision = this.opts.resolveClose(context);
    this.flushRequests(
      decision.pendingError ?? context.connectFailure?.error ?? new Error(`gateway closed (${code}): ${reason}`)
    );
    this.invoke("close", () => this.opts.onClose?.(context, decision));
    if (decision.retry && !this.stopped) {
      this.scheduleReconnect(decision.reconnectDelayMs ?? context.connectFailure?.reconnectDelayMs);
    }
  }
  handleSocketError(socket, generation, error) {
    if (!this.isActive(socket, generation) || this.connectSent) {
      return;
    }
    this.opts.onConnectError?.(error);
  }
  flushRequests(error) {
    for (const [id, pending] of this.pending) {
      this.finishRequestTiming(id, pending, false, "CLIENT_CLOSED");
      pending.cleanup?.();
      pending.reject(error);
    }
    this.pending.clear();
  }
  finishRequestTiming(id, pending, ok, errorCode) {
    const endedAtMs = this.nowMs();
    this.invoke(
      "request timing",
      () => this.opts.onRequestTiming?.({
        id,
        method: pending.method,
        ok,
        durationMs: Math.max(0, endedAtMs - pending.startedAtMs),
        startedAtMs: pending.startedAtMs,
        endedAtMs,
        errorCode
      })
    );
  }
  scheduleReconnect(overrideMs) {
    if (overrideMs !== void 0) {
      this.reconnectSupervisor.nextDelayOverrideMs = overrideMs;
    }
    const retry = this.reconnectSupervisor.next();
    if (!retry) {
      return;
    }
    void sleepWithAbort(retry.delayMs, retry.signal).then(
      () => this.connect(),
      () => {
      }
    );
  }
  closeContext() {
    return {
      generation: this.generation,
      socketOpened: this.socketOpened,
      helloReceived: this.helloReceived,
      connectRequestSent: this.connectRequestSent,
      connectFailure: this.connectFailure
    };
  }
  isActive(socket, generation) {
    return !this.stopped && this.socket === socket && this.generation === generation;
  }
  nowMs() {
    return this.opts.nowMs?.() ?? Date.now();
  }
  clearHandshakeTimer() {
    if (this.handshakeTimer) {
      clearTimeout(this.handshakeTimer);
      this.handshakeTimer = null;
    }
  }
  invoke(label, callback) {
    try {
      callback();
    } catch (error) {
      this.opts.onCallbackError?.(label, error);
    }
  }
};
export {
  GatewayProtocolClient,
  GatewayProtocolRequestError
};
