import { c as SessionUpstreamActivity, d as SessionUpstreamProbe, r as SessionCatalogContinueProviderResult } from "../../session-catalog-CJbA4_oS.js";
import { t as ClaudeTranscriptItem } from "../../session-catalog-transcript-xA6TtbpC.js";
//#region extensions/anthropic/session-upstream-activity.d.ts
declare const continueOperations: Map<string, Promise<{
  sessionKey: string;
}>>;
declare function linkContinued(params: {
  sessionKey: string;
  hostId: string;
  threadId: string;
  history?: ClaudeTranscriptItem[];
  listLocalSessions: () => Promise<Array<{
    threadId: string;
    filePath: string;
  }>>;
  readRemote: () => Promise<ClaudeTranscriptItem[]>;
}): Promise<SessionCatalogContinueProviderResult>;
declare function checkClaudeUpstreamActivity(probes: SessionUpstreamProbe[], readRemote?: (probe: SessionUpstreamProbe) => Promise<ClaudeTranscriptItem[]>): Promise<SessionUpstreamActivity[]>;
//#endregion
export { checkClaudeUpstreamActivity, continueOperations, linkContinued };