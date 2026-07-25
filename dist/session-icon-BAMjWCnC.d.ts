//#region packages/gateway-protocol/src/session-icon.d.ts
type SessionIcon = {
  kind: "named";
  name: string;
} | {
  kind: "emoji";
  emoji: string;
} | {
  kind: "svg";
  svg: string;
};
declare const SESSION_AGENT_ATTENTION_ICON_IDS: readonly ["hand", "key", "alert", "flag", "lock", "hourglass"];
type SessionAgentAttentionIconId = (typeof SESSION_AGENT_ATTENTION_ICON_IDS)[number];
type SessionAgentStatus = {
  note: string;
  expiresAt: number;
  attention?: SessionAgentAttentionIconId;
};
type SessionIconNormalizationResult = {
  ok: true;
  value: string;
} | {
  ok: false;
  reason: string;
};
/** Parse a stored session icon form without sanitizing SVG markup. */
declare function parseSessionIcon(value: string): SessionIcon | null;
/** Validate and canonicalize a session icon before it enters durable state. */
declare function normalizeSessionIconInput(value: string): SessionIconNormalizationResult;
//#endregion
export { SessionIconNormalizationResult as a, SessionIcon as i, SessionAgentAttentionIconId as n, normalizeSessionIconInput as o, SessionAgentStatus as r, parseSessionIcon as s, SESSION_AGENT_ATTENTION_ICON_IDS as t };