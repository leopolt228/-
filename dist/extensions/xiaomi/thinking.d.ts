import { an as ProviderThinkingProfile } from "../../plugin-entry-Bj-pdgAt.js";

//#region extensions/xiaomi/thinking.d.ts
declare function isMiMoReasoningModelRef(model: {
  provider?: string;
  id?: unknown;
}): boolean;
declare function resolveMiMoThinkingProfile(modelId: string): ProviderThinkingProfile | undefined;
//#endregion
export { isMiMoReasoningModelRef, resolveMiMoThinkingProfile };