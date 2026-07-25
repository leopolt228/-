import { D as SessionConfig, j as SessionResetConfig } from "./types.base-DucQBSmL.js";
import { r as GroupKeyResolution, u as SessionScope } from "./types-D43pE80v.js";
import { i as MsgContext } from "./templating-CzGprbNA.js";
//#region src/config/sessions/group.d.ts
/**
 * Resolves channel/group chat context into the persisted group session key.
 *
 * Provider-prefixed ids use channel-owned normalization, while legacy plugin resolvers remain a
 * fallback for older channel surfaces that cannot yet express the generic route shape.
 */
declare function resolveGroupSessionKey(ctx: MsgContext): GroupKeyResolution | null;
//#endregion
//#region src/config/sessions/artifacts.d.ts
/** Returns true for archived session artifacts and legacy store backup names. */
declare function isSessionArchiveArtifactName(fileName: string): boolean;
/** Returns true for transcript files counted in usage, including reset/deleted archives. */
declare function isUsageCountedSessionTranscriptFileName(fileName: string): boolean;
/** Extracts the session id from a usage-counted transcript filename. */
declare function parseUsageCountedSessionIdFromFileName(fileName: string): string | null;
//#endregion
//#region src/config/sessions/main-session.d.ts
/** Canonicalizes main-session aliases to the current scoped session key. */
declare function canonicalizeMainSessionAlias(params: {
  cfg?: {
    session?: {
      scope?: SessionScope;
      mainKey?: string;
    };
  };
  agentId: string;
  sessionKey: string;
}): string;
//#endregion
//#region src/config/sessions/reset-policy.d.ts
type SessionResetMode = "none" | "daily" | "idle";
type SessionStaleReason = Exclude<SessionResetMode, "none">;
type SessionResetType = "direct" | "group" | "thread";
type SessionResetPolicy = {
  mode: SessionResetMode;
  atHour: number;
  idleMinutes?: number;
  configured?: boolean;
};
type SessionFreshness = {
  fresh: boolean;
  dailyResetAt?: number;
  idleExpiresAt?: number;
  staleReason?: SessionStaleReason;
};
/** Resolves the effective reset policy for direct, group, or thread sessions. */
declare function resolveSessionResetPolicy(params: {
  sessionCfg?: SessionConfig;
  resetType: SessionResetType;
  resetOverride?: SessionResetConfig;
}): SessionResetPolicy;
/** Evaluates whether a persisted session is still fresh under the resolved reset policy. */
declare function evaluateSessionFreshness(params: {
  updatedAt: number;
  sessionStartedAt?: number;
  lastInteractionAt?: number;
  now: number;
  policy: SessionResetPolicy;
}): SessionFreshness;
//#endregion
//#region src/config/sessions/reset.d.ts
declare function resolveSessionResetType(params: {
  sessionKey?: string | null;
  isGroup?: boolean;
  isThread?: boolean;
}): SessionResetType;
declare function resolveThreadFlag(params: {
  sessionKey?: string | null;
  messageThreadId?: string | number | null;
  threadLabel?: string | null;
  threadStarterBody?: string | null;
  parentSessionKey?: string | null;
}): boolean;
declare function resolveChannelResetConfig(params: {
  sessionCfg?: SessionConfig;
  channel?: string | null;
}): SessionResetConfig | undefined;
//#endregion
export { evaluateSessionFreshness as a, isSessionArchiveArtifactName as c, resolveGroupSessionKey as d, SessionResetMode as i, isUsageCountedSessionTranscriptFileName as l, resolveSessionResetType as n, resolveSessionResetPolicy as o, resolveThreadFlag as r, canonicalizeMainSessionAlias as s, resolveChannelResetConfig as t, parseUsageCountedSessionIdFromFileName as u };