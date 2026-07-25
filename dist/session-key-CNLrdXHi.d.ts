import { u as SessionScope } from "./types-D43pE80v.js";
import { i as MsgContext } from "./templating-CzGprbNA.js";

//#region src/config/sessions/session-key.d.ts
/**
 * Derives the raw session bucket from message context before agent/main-key normalization.
 *
 * Direct chats use sender identity, groups use channel-owned group keys, and global scope bypasses
 * sender routing entirely.
 */
declare function deriveSessionKey(scope: SessionScope, ctx: MsgContext): string;
/**
 * Resolves the persisted session-store key for an inbound message.
 *
 * Explicit session keys pass through the compatibility normalizer, direct chats collapse to the
 * agent's canonical main bucket, and group/channel sessions stay isolated under the same agent.
 */
declare function resolveSessionKey(scope: SessionScope, ctx: MsgContext, mainKey?: string, agentId?: string): string;
//#endregion
export { resolveSessionKey as n, deriveSessionKey as t };