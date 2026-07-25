import { y as StreamFn } from "./types-Dedz4oTJ.js";
import { dn as ProviderWrapStreamFnContext } from "./plugin-entry-Bj-pdgAt.js";
import { t as VllmQwenThinkingFormat } from "./thinking-policy-CHA-Xf8n.js";

//#region extensions/vllm/stream.d.ts
type VllmThinkingLevel = ProviderWrapStreamFnContext["thinkingLevel"];
declare function createVllmQwenThinkingWrapper(params: {
  baseStreamFn: StreamFn | undefined;
  format: VllmQwenThinkingFormat;
  thinkingLevel: VllmThinkingLevel;
}): StreamFn;
declare function wrapVllmProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion
export { wrapVllmProviderStream as n, createVllmQwenThinkingWrapper as t };