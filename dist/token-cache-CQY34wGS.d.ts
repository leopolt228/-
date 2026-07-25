import { i as PluginStateSyncKeyedStore } from "./plugin-state-store.types-DX2gE09P.js";

//#region extensions/github-copilot/token-cache.d.ts
declare const COPILOT_TOKEN_CACHE_NAMESPACE = "token";
declare const COPILOT_TOKEN_CACHE_MAX_ENTRIES = 8;
type CachedCopilotToken = {
  token: string;
  expiresAt: number;
  updatedAt: number;
  integrationId?: string;
  sourceCredentialFingerprint?: string;
  domain?: string;
};
declare function fingerprintCopilotSourceCredential(githubToken: string): string;
declare function isCopilotTokenUsable(params: {
  cache: CachedCopilotToken;
  domain: string;
  sourceCredentialFingerprint: string;
  now?: number;
}): boolean;
type CopilotTokenCache = {
  path: string;
  load(): CachedCopilotToken | undefined;
  save(value: CachedCopilotToken): void;
};
declare function resolveCopilotTokenCache(params: {
  domain: string;
  sourceCredentialFingerprint: string;
  openCacheStore?: () => PluginStateSyncKeyedStore<CachedCopilotToken>;
  cachePath?: string;
  loadJsonFileImpl?: (path: string) => unknown;
  saveJsonFileImpl?: (path: string, value: CachedCopilotToken) => void;
}): CopilotTokenCache;
//#endregion
export { isCopilotTokenUsable as a, fingerprintCopilotSourceCredential as i, COPILOT_TOKEN_CACHE_NAMESPACE as n, resolveCopilotTokenCache as o, CachedCopilotToken as r, COPILOT_TOKEN_CACHE_MAX_ENTRIES as t };