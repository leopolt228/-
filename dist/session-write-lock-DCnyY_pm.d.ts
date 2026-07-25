import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";

//#region src/agents/session-write-lock.d.ts
type SessionWriteLockAcquireTimeoutConfig = OpenClawConfig;
declare function resolveSessionWriteLockAcquireTimeoutMs(_config?: SessionWriteLockAcquireTimeoutConfig, env?: NodeJS.ProcessEnv): number;
declare function resolveSessionWriteLockOptions(config?: SessionWriteLockAcquireTimeoutConfig, params?: {
  env?: NodeJS.ProcessEnv;
  maxHoldMsFallback?: number;
}): {
  timeoutMs: number;
  staleMs: number;
  maxHoldMs: number;
};
declare function acquireSessionWriteLock(params: {
  sessionFile: string;
  timeoutMs?: number;
  staleMs?: number;
  maxHoldMs?: number;
  allowReentrant?: boolean;
  signal?: AbortSignal;
}): Promise<{
  release: () => Promise<void>;
}>;
//#endregion
export { resolveSessionWriteLockOptions as i, acquireSessionWriteLock as n, resolveSessionWriteLockAcquireTimeoutMs as r, SessionWriteLockAcquireTimeoutConfig as t };