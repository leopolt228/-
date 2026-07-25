import { y as StreamFn } from "./types-Dedz4oTJ.js";
import { dn as ProviderWrapStreamFnContext } from "./plugin-entry-Bj-pdgAt.js";

//#region extensions/github-copilot/stream.d.ts
declare function wrapCopilotAnthropicStream(baseStreamFn: StreamFn | undefined): StreamFn | undefined;
declare function wrapCopilotProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion
export { wrapCopilotProviderStream as n, wrapCopilotAnthropicStream as t };