import { o as ProviderUsageSnapshot } from "../../provider-usage.types-CSw7pG9h.js";
import { Nt as ProviderFetchUsageSnapshotContext, en as ProviderResolveUsageAuthContext, nn as ProviderResolvedUsageAuth } from "../../plugin-entry-Bj-pdgAt.js";

//#region extensions/anthropic/usage.d.ts
declare function resolveAnthropicUsageAuth(ctx: ProviderResolveUsageAuthContext): Promise<ProviderResolvedUsageAuth>;
declare function fetchAnthropicUsage(ctx: ProviderFetchUsageSnapshotContext): Promise<ProviderUsageSnapshot>;
//#endregion
export { fetchAnthropicUsage, resolveAnthropicUsageAuth };