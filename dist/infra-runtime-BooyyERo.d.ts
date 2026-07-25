import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { n as GatewayMessageChannel } from "./message-channel-normalize-IwuTHJHT.js";
//#region src/infra/heartbeat-events.d.ts
type HeartbeatIndicatorType = "ok" | "alert" | "error";
type HeartbeatEventPayload = {
  ts: number;
  status: "sent" | "ok-empty" | "ok-token" | "skipped" | "failed";
  to?: string;
  accountId?: string;
  preview?: string;
  durationMs?: number;
  hasMedia?: boolean;
  reason?: string; /** The channel this heartbeat was sent to. */
  channel?: string; /** Whether the message was silently suppressed (showOk: false). */
  silent?: boolean; /** Indicator type for UI status display. */
  indicatorType?: HeartbeatIndicatorType;
};
declare function resolveIndicatorType(status: HeartbeatEventPayload["status"]): HeartbeatIndicatorType | undefined;
declare function emitHeartbeatEvent(evt: Omit<HeartbeatEventPayload, "ts">): void;
declare function onHeartbeatEvent(listener: (evt: HeartbeatEventPayload) => void): () => void;
declare function getLastHeartbeatEvent(): HeartbeatEventPayload | null;
declare function resetHeartbeatEventsForTest(): void;
//#endregion
//#region src/infra/heartbeat-visibility.d.ts
/** Resolved heartbeat presentation toggles after defaults/channel/account precedence. */
type ResolvedHeartbeatVisibility = {
  /** Whether successful heartbeat content should be sent as visible chat text. */showOk: boolean; /** Whether warning/error heartbeat content should be sent as visible chat text. */
  showAlerts: boolean; /** Whether heartbeat status should emit indicator events for UI surfaces. */
  useIndicator: boolean;
};
/** Resolves heartbeat visibility for a channel, applying account > channel > defaults precedence. */
declare function resolveHeartbeatVisibility(params: {
  cfg: OpenClawConfig;
  channel: GatewayMessageChannel;
  accountId?: string;
}): ResolvedHeartbeatVisibility;
//#endregion
//#region src/plugin-sdk/infra-runtime.d.ts
/** @deprecated Shipped compat only (removed from core in #104546); no core caller. Removal with the next plugin-SDK major. */
type ErrorKind = "refusal" | "timeout" | "rate_limit" | "context_length" | "unknown";
/**
 * @deprecated Shipped compat only; preserves the old substring semantics for
 * external plugins. Core chat classification now maps canonical failover
 * reasons (see gateway resolveChatErrorKindFromError). Removal with the next
 * plugin-SDK major.
 */
declare function detectErrorKind(err: unknown): ErrorKind | undefined;
//#endregion
export { HeartbeatEventPayload as a, getLastHeartbeatEvent as c, resolveIndicatorType as d, resolveHeartbeatVisibility as i, onHeartbeatEvent as l, detectErrorKind as n, HeartbeatIndicatorType as o, ResolvedHeartbeatVisibility as r, emitHeartbeatEvent as s, ErrorKind as t, resetHeartbeatEventsForTest as u };