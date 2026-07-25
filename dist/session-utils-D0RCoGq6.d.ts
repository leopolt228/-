import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { a as RestartRecoveryRun } from "./types-D43pE80v.js";
import { DatabaseSync } from "node:sqlite";

//#region src/agents/main-session-restart-recovery.d.ts
declare function markRestartAbortedMainSessions(params: {
  cfg?: OpenClawConfig;
  additionalCfgs?: Iterable<OpenClawConfig | undefined>;
  stateDir?: string;
  sessionKeys?: Iterable<string>;
  sessionIds?: Iterable<string>;
  activeRuns?: Iterable<RestartRecoveryRun & {
    sessionKey: string;
    sessionId: string;
    observedAt?: number;
  }>;
  isActiveRun?: (run: RestartRecoveryRun & {
    sessionKey: string;
    sessionId: string;
    observedAt?: number;
  }) => boolean;
  reason?: string;
}): Promise<{
  marked: number;
  skipped: number;
}>;
//#endregion
//#region src/infra/restart-sentinel-store.d.ts
type RestartSentinelLog = {
  stdoutTail?: string | null;
  stderrTail?: string | null;
  exitCode?: number | null;
};
type RestartSentinelStep = {
  name: string;
  command: string;
  cwd?: string | null;
  durationMs?: number | null;
  log?: RestartSentinelLog | null;
};
type RestartSentinelStats = {
  mode?: string;
  root?: string;
  requiresRestart?: boolean;
  handoffId?: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  steps?: RestartSentinelStep[];
  reason?: string | null;
  durationMs?: number | null;
};
type RestartSentinelContinuation = {
  kind: "systemEvent";
  text: string;
} | {
  kind: "agentTurn";
  message: string;
};
type RestartSentinelPayload = {
  kind: "config-apply" | "config-auto-recovery" | "config-patch" | "update" | "restart";
  status: "ok" | "error" | "skipped";
  ts: number;
  sessionKey?: string;
  deliveryContext?: {
    channel?: string;
    to?: string;
    accountId?: string;
  };
  threadId?: string;
  message?: string | null;
  continuation?: RestartSentinelContinuation | null;
  doctorHint?: string | null;
  stats?: RestartSentinelStats | null;
};
type RestartSentinelEnvelope = {
  version: 1;
  payload: RestartSentinelPayload;
};
type RestartSentinel = RestartSentinelEnvelope & {
  /** Optimistic-concurrency revision backed by gateway_restart_sentinel.updated_at_ms. */revision: number;
};
//#endregion
//#region src/infra/restart-sentinel.d.ts
declare function markUpdateRestartSentinelFailure(reason: string, env?: NodeJS.ProcessEnv): Promise<RestartSentinel | null>;
//#endregion
//#region src/infra/heartbeat-runner.d.ts
type HeartbeatRunner = {
  stop: () => void;
  updateConfig: (cfg: OpenClawConfig) => void;
};
//#endregion
//#region src/plugins/services.d.ts
type PluginServicesHandle = {
  stop: () => Promise<void>;
};
//#endregion
//#region src/gateway/server-startup-post-attach.d.ts
type Awaitable<T> = T | Promise<T>;
type GatewayPostReadySidecarHandle = {
  stop: () => Awaitable<void>;
};
//#endregion
export { markRestartAbortedMainSessions as a, markUpdateRestartSentinelFailure as i, PluginServicesHandle as n, HeartbeatRunner as r, GatewayPostReadySidecarHandle as t };