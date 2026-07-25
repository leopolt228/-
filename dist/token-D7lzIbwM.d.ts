import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { i as PluginStateSyncKeyedStore } from "./plugin-state-store.types-DX2gE09P.js";
import { r as CachedCopilotToken } from "./token-cache-CQY34wGS.js";

//#region extensions/github-copilot/token.d.ts
declare const DEFAULT_COPILOT_API_BASE_URL = "https://api.individual.githubcopilot.com";
/** Bind provider-scoped SQLite state when the bundled plugin registers. */
declare function configureCopilotTokenCacheStore(openCacheStore: () => PluginStateSyncKeyedStore<CachedCopilotToken>): void;
declare function resolveCopilotApiToken(params: {
  githubToken: string;
  env?: NodeJS.ProcessEnv;
  fetchImpl?: typeof fetch;
  cachePath?: string;
  loadJsonFileImpl?: (path: string) => unknown;
  saveJsonFileImpl?: (path: string, value: CachedCopilotToken) => void;
  openCacheStore?: () => PluginStateSyncKeyedStore<CachedCopilotToken>;
  githubDomain?: string;
  config?: OpenClawConfig;
}): Promise<{
  token: string;
  expiresAt: number;
  source: string;
  baseUrl: string;
}>;
//#endregion
export { configureCopilotTokenCacheStore as n, resolveCopilotApiToken as r, DEFAULT_COPILOT_API_BASE_URL as t };