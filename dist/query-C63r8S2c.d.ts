import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { b as ActiveRecallRecentTurn, it as ResolvedActiveRecallPluginConfig } from "./types-BDJia9Pj.js";

//#region extensions/active-memory/query.d.ts
declare function buildQuery(params: {
  latestUserMessage: string;
  recentTurns?: ActiveRecallRecentTurn[];
  config: ResolvedActiveRecallPluginConfig;
}): string;
declare function buildSearchQuery(params: {
  latestUserMessage: string;
  recentTurns?: ActiveRecallRecentTurn[];
}): string;
declare function extractTextContentParts(content: unknown): string[];
declare function extractTextContent(content: unknown): string;
declare function extractRecentTurns(messages: unknown[]): ActiveRecallRecentTurn[];
declare function getModelRef(runtimeConfig: OpenClawConfig, agentId: string, config: ResolvedActiveRecallPluginConfig, ctx?: {
  modelProviderId?: string;
  modelId?: string;
}): {
  provider: string;
  model: string;
} | undefined;
//#endregion
export { extractTextContentParts as a, extractTextContent as i, buildSearchQuery as n, getModelRef as o, extractRecentTurns as r, buildQuery as t };