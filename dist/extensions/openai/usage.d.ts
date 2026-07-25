import { o as ProviderUsageSnapshot } from "../../provider-usage.types-CSw7pG9h.js";
import { Nt as ProviderFetchUsageSnapshotContext, en as ProviderResolveUsageAuthContext, nn as ProviderResolvedUsageAuth } from "../../plugin-entry-Bj-pdgAt.js";

//#region extensions/openai/usage.d.ts
declare function resolveOpenAIUsageAuth(ctx: ProviderResolveUsageAuthContext): Promise<ProviderResolvedUsageAuth>;
declare function fetchOpenAIUsage(ctx: ProviderFetchUsageSnapshotContext): Promise<ProviderUsageSnapshot>;
//#endregion
export { fetchOpenAIUsage, resolveOpenAIUsageAuth };