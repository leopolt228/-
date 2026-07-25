import { a as ProviderPlugin } from "../../types-Bi5Leigi.js";
//#region extensions/anthropic/provider-discovery.d.ts
declare function resolveClaudeCliSyntheticAuth(): {
  apiKey: string;
  source: string;
  mode: "oauth";
  expiresAt: number;
} | {
  apiKey: string;
  source: string;
  mode: "token";
  expiresAt: number;
} | {
  apiKey: string;
  source: string;
  mode: "api-key";
  expiresAt?: undefined;
} | undefined;
declare const anthropicProviderDiscovery: ProviderPlugin;
//#endregion
export { anthropicProviderDiscovery as default, resolveClaudeCliSyntheticAuth };