import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
//#region src/agents/tools/web-search-citation-redirect.d.ts
/**
 * Resolve a citation redirect URL to its final destination using a HEAD request.
 * Returns the original URL if resolution fails or times out.
 */
declare function resolveCitationRedirectUrl(url: string): Promise<string>;
//#endregion
//#region src/agents/tools/web-search-provider-common.d.ts
type SearchConfigRecord = (NonNullable<OpenClawConfig["tools"]>["web"] extends infer Web ? Web extends {
  search?: infer Search;
} ? Search : never : never) & Record<string, unknown>;
declare const DEFAULT_SEARCH_COUNT = 5;
declare const MAX_SEARCH_COUNT = 10;
declare function resolveSearchTimeoutSeconds(searchConfig?: SearchConfigRecord): number;
declare function resolveSearchCacheTtlMs(searchConfig?: SearchConfigRecord): number;
declare function resolveSearchCount(value: unknown, fallback: number): number;
declare function readConfiguredSecretString(value: unknown, path: string): string | undefined;
declare function readProviderEnvValue(envVars: string[]): string | undefined;
declare function withTrustedWebSearchEndpoint<T>(params: {
  url: string;
  timeoutSeconds: number;
  init: RequestInit;
  signal?: AbortSignal;
}, run: (response: Response) => Promise<T>): Promise<T>;
declare function withSelfHostedWebSearchEndpoint<T>(params: {
  url: string;
  timeoutSeconds: number;
  init: RequestInit;
  signal?: AbortSignal;
}, run: (response: Response) => Promise<T>): Promise<T>;
declare function postTrustedWebToolsJson<T>(params: {
  url: string;
  timeoutSeconds: number;
  apiKey: string;
  body: Record<string, unknown>;
  errorLabel: string;
  maxErrorBytes?: number;
  extraHeaders?: Record<string, string>;
  signal?: AbortSignal;
}, parseResponse: (response: Response) => Promise<T>): Promise<T>;
declare function throwWebSearchApiError(res: Response, providerLabel: string): Promise<never>;
declare function resolveSiteName(url: string | undefined): string | undefined;
type WebSearchFreshnessProvider = "brave" | "perplexity";
type WebSearchRecencyFreshness = "day" | "week" | "month" | "year";
type ParsedWebSearchFreshness<Provider extends WebSearchFreshnessProvider> = Provider extends "perplexity" ? WebSearchRecencyFreshness : string;
declare const FRESHNESS_TO_RECENCY: Record<string, string>;
declare function isoToPerplexityDate(iso: string): string | undefined;
/** Accepts ISO dates plus Perplexity `M/D/YYYY` dates and returns canonical ISO dates. */
declare function normalizeToIsoDate(value: string): string | undefined;
/** Parses optional date range filters and returns provider-facing validation errors. */
declare function parseIsoDateRange(params: {
  rawDateAfter?: string;
  rawDateBefore?: string;
  invalidDateAfterMessage: string;
  invalidDateBeforeMessage: string;
  invalidDateRangeMessage: string;
  docs?: string;
}): {
  dateAfter?: string;
  dateBefore?: string;
} | {
  error: "invalid_date" | "invalid_date_range";
  message: string;
  docs: string;
};
/** Converts shared freshness names into provider-specific Brave or Perplexity values. */
declare function normalizeFreshness(value: string | undefined, provider: WebSearchFreshnessProvider): string | undefined;
/** Parses freshness/date filters while rejecting combinations providers cannot express safely. */
declare function parseWebSearchTimeFilters<Provider extends WebSearchFreshnessProvider>(params: {
  rawFreshness?: string;
  rawDateAfter?: string;
  rawDateBefore?: string;
  freshnessProvider: Provider;
  invalidFreshnessMessage: string;
  invalidDateAfterMessage: string;
  invalidDateBeforeMessage: string;
  invalidDateRangeMessage: string;
  conflictingTimeFiltersMessage?: string;
  docs?: string;
}): {
  freshness?: ParsedWebSearchFreshness<Provider>;
  dateAfter?: string;
  dateBefore?: string;
} | {
  error: "invalid_freshness" | "invalid_date" | "invalid_date_range" | "conflicting_time_filters";
  message: string;
  docs: string;
};
/** Reads a search cache payload and marks it so provider responses can disclose cache hits. */
declare function readCachedSearchPayload(cacheKey: string): Record<string, unknown> | undefined;
/** Builds a normalized cache key from provider-specific search dimensions. */
declare function buildSearchCacheKey(parts: Array<string | number | boolean | undefined>): string;
/** Stores one provider search payload with its provider-selected TTL. */
declare function writeCachedSearchPayload(cacheKey: string, payload: Record<string, unknown>, ttlMs: number): void;
declare function buildUnsupportedSearchFilterResponse(params: Record<string, unknown>, provider: string, docs?: string): {
  error: string;
  message: string;
  docs: string;
} | undefined;
//#endregion
//#region src/agents/tools/web-search-provider-credentials.d.ts
/**
 * Resolves web-search provider credentials from config values, secret refs, or
 * provider-specific environment variables.
 */
/** Returns the first usable credential for a web-search provider. */
declare function resolveWebSearchProviderCredential(params: {
  credentialValue: unknown;
  path: string;
  envVars: string[];
}): string | undefined;
//#endregion
export { withTrustedWebSearchEndpoint as C, withSelfHostedWebSearchEndpoint as S, resolveCitationRedirectUrl as T, resolveSearchCacheTtlMs as _, SearchConfigRecord as a, resolveSiteName as b, isoToPerplexityDate as c, parseIsoDateRange as d, parseWebSearchTimeFilters as f, readProviderEnvValue as g, readConfiguredSecretString as h, MAX_SEARCH_COUNT as i, normalizeFreshness as l, readCachedSearchPayload as m, DEFAULT_SEARCH_COUNT as n, buildSearchCacheKey as o, postTrustedWebToolsJson as p, FRESHNESS_TO_RECENCY as r, buildUnsupportedSearchFilterResponse as s, resolveWebSearchProviderCredential as t, normalizeToIsoDate as u, resolveSearchCount as v, writeCachedSearchPayload as w, throwWebSearchApiError as x, resolveSearchTimeoutSeconds as y };