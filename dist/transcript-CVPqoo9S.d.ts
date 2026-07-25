//#region src/config/sessions/transcript.d.ts
type SessionTranscriptAppendResult = {
  ok: true;
  sessionFile: string;
  messageId: string;
} | {
  ok: false;
  reason: string;
  code?: "blocked" | "session-rebound";
};
type SessionTranscriptUpdateMode = "inline" | "file-only" | "none";
type SessionTranscriptDeliveryMirror = {
  kind: "channel-final";
  sourceMessageId?: string;
} | {
  kind: "channel-final-suppressed";
  reason: "stale-foreground";
  sourceMessageId?: string;
};
type AssistantTranscriptText = {
  id?: string;
  text: string;
  timestamp?: number;
};
type SessionRecentConversationText = {
  id?: string;
  role: "user" | "assistant";
  text: string;
  timestamp?: number;
  sourceChannel?: string;
};
type ReadRecentSessionConversationTextOptions = {
  beforeTimestampMs?: number;
  limit?: number;
  minTimestampMs?: number;
  role?: "user" | "assistant";
  preferUpstreamUserText?: boolean;
};
type ReadRecentSessionConversationTextParams = ReadRecentSessionConversationTextOptions & {
  agentId?: string;
  sessionKey: string;
  storePath?: string;
};
type LatestAssistantTranscriptText = AssistantTranscriptText;
declare function readRecentUserAssistantTextForSession(params: ReadRecentSessionConversationTextParams): Promise<SessionRecentConversationText[]>;
//#endregion
export { SessionTranscriptUpdateMode as a, SessionTranscriptDeliveryMirror as i, SessionRecentConversationText as n, readRecentUserAssistantTextForSession as o, SessionTranscriptAppendResult as r, LatestAssistantTranscriptText as t };