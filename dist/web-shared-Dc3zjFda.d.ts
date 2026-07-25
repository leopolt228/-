import { r as GuardedFetchOptions } from "./fetch-guard-BKvfwdRa.js";

//#region src/agents/tools/web-guarded-fetch.d.ts
type WebToolGuardedFetchOptions = Omit<GuardedFetchOptions, "mode" | "proxy" | "dangerouslyAllowEnvProxyWithoutPinnedDns"> & {
  timeoutSeconds?: number;
  useEnvProxy?: boolean;
};
type WebToolEndpointFetchOptions = Omit<WebToolGuardedFetchOptions, "policy" | "useEnvProxy">;
/** Runs a guarded fetch with strict or trusted-env-proxy web tool policy. */
/** Runs a fetch for trusted endpoints, allowing env proxy with pinned-host policy. */
declare function withTrustedWebToolsEndpoint<T>(params: WebToolEndpointFetchOptions, run: (result: {
  response: Response;
  finalUrl: string;
}) => Promise<T>): Promise<T>;
/** Runs a fetch for configured self-hosted endpoints with private-network access allowed. */
declare function withSelfHostedWebToolsEndpoint<T>(params: WebToolEndpointFetchOptions, run: (result: {
  response: Response;
  finalUrl: string;
}) => Promise<T>): Promise<T>;
/** Runs a fetch under strict SSRF protection without env proxy trust. */
declare function withStrictWebToolsEndpoint<T>(params: WebToolEndpointFetchOptions, run: (result: {
  response: Response;
  finalUrl: string;
}) => Promise<T>): Promise<T>;
//#endregion
//#region src/agents/tools/web-shared.d.ts
type CacheEntry<T> = {
  value: T;
  expiresAt: number;
  insertedAt: number;
};
declare const DEFAULT_TIMEOUT_SECONDS = 30;
declare const DEFAULT_CACHE_TTL_MINUTES = 15;
declare function resolveTimeoutSeconds(value: unknown, fallback: number): number;
declare function resolvePositiveTimeoutSeconds(value: unknown, fallback: number): number;
declare function resolveCacheTtlMs(value: unknown, fallbackMinutes: number): number;
declare function normalizeCacheKey(value: string): string;
declare function readCache<T>(cache: Map<string, CacheEntry<T>>, key: string): {
  value: T;
  cached: boolean;
} | null;
declare function writeCache<T>(cache: Map<string, CacheEntry<T>>, key: string, value: T, ttlMs: number): void;
type ReadResponseTextResult = {
  text: string;
  truncated: boolean;
  bytesRead: number;
};
declare function readResponseText(res: Response, options?: {
  maxBytes?: number;
}): Promise<ReadResponseTextResult>;
//#endregion
export { readResponseText as a, resolveTimeoutSeconds as c, withStrictWebToolsEndpoint as d, withTrustedWebToolsEndpoint as f, readCache as i, writeCache as l, DEFAULT_TIMEOUT_SECONDS as n, resolveCacheTtlMs as o, normalizeCacheKey as r, resolvePositiveTimeoutSeconds as s, DEFAULT_CACHE_TTL_MINUTES as t, withSelfHostedWebToolsEndpoint as u };