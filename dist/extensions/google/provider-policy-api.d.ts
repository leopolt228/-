import { f as ModelProviderConfig } from "../../types.models-FHGBX8Gn.js";
import { r as ProviderThinkingProfile } from "../../provider-thinking.types-DhIiOz1Q.js";
import { At as ProviderDefaultThinkingPolicyContext } from "../../plugin-entry-Bj-pdgAt.js";
//#region extensions/google/provider-policy-api.d.ts
declare function normalizeConfig(params: {
  provider: string;
  providerConfig: ModelProviderConfig;
}): ModelProviderConfig;
declare function resolveThinkingProfile(context: ProviderDefaultThinkingPolicyContext): ProviderThinkingProfile | undefined;
//#endregion
export { normalizeConfig, resolveThinkingProfile };