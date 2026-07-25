import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { g as OpenClawPluginApi } from "../../plugin-entry-Bj-pdgAt.js";
import { T as ConversationRecallContext, it as ResolvedActiveRecallPluginConfig, x as ActiveRecallResult } from "../../types-BDJia9Pj.js";

//#region extensions/active-memory/recall.d.ts
declare function maybeResolveActiveRecall(params: {
  api: OpenClawPluginApi;
  runtimeConfig: OpenClawConfig;
  config: ResolvedActiveRecallPluginConfig;
  agentId: string;
  sessionKey?: string;
  sessionId?: string;
  messageProvider?: string;
  channelId?: string;
  query: string;
  searchQuery: string;
  currentModelProviderId?: string;
  currentModelId?: string;
  conversationRecall?: ConversationRecallContext;
  abortSignal?: AbortSignal;
}): Promise<ActiveRecallResult>;
//#endregion
export { maybeResolveActiveRecall };