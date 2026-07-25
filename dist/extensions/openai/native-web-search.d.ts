import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { y as StreamFn } from "../../types-Dedz4oTJ.js";
//#region extensions/openai/native-web-search.d.ts
declare function createOpenAINativeWebSearchWrapper(baseStreamFn: StreamFn | undefined, params: {
  config?: OpenClawConfig;
  agentId?: string;
  nativeWebSearchAllowedByToolPolicy?: boolean;
}): StreamFn;
//#endregion
export { createOpenAINativeWebSearchWrapper };