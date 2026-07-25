import { s as AgentMessage } from "../../types-Dedz4oTJ.js";
import { rn as ProviderSanitizeReplayHistoryContext } from "../../plugin-entry-Bj-pdgAt.js";

//#region extensions/github-copilot/replay-policy.d.ts
declare function stripCopilotAssistantThinkingMessages<T>(messages: T[]): T[];
declare function buildGithubCopilotReplayPolicy(modelId?: string): {
  dropThinkingBlocks: boolean;
} | {
  dropThinkingBlocks?: undefined;
};
declare function sanitizeGithubCopilotReplayHistory(ctx: ProviderSanitizeReplayHistoryContext): AgentMessage[];
//#endregion
export { buildGithubCopilotReplayPolicy, sanitizeGithubCopilotReplayHistory, stripCopilotAssistantThinkingMessages };