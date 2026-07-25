import { a as ProviderPlugin } from "./types-Bi5Leigi.js";
//#region extensions/openai/openai-provider.d.ts
declare function buildOpenAIProvider(): ProviderPlugin;
/** @deprecated Use buildOpenAIProvider; OpenAI Codex is now an OpenAI auth/transport mode. */
declare function buildOpenAICodexProviderPlugin(): ProviderPlugin;
//#endregion
export { buildOpenAIProvider as n, buildOpenAICodexProviderPlugin as t };