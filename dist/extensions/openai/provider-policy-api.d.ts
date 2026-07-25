import { f as ModelProviderConfig } from "../../types.models-FHGBX8Gn.js";
import { r as ProviderThinkingProfile } from "../../provider-thinking.types-DhIiOz1Q.js";
import { o as ProviderNormalizeModelCatalogIdContext, r as ProviderModelRouteResolution, s as ProviderResolveModelRoutesContext } from "../../provider-model-types-CPluX4eq.js";
import { At as ProviderDefaultThinkingPolicyContext } from "../../plugin-entry-Bj-pdgAt.js";
//#region extensions/openai/provider-policy-api.d.ts
/** Canonical logical id for OpenAI catalog projection. */
declare function normalizeModelCatalogId(params: ProviderNormalizeModelCatalogIdContext): string | null;
/** Resolves every physical row for one logical OpenAI model in provider order. */
declare function resolveModelRoutes(context: ProviderResolveModelRoutesContext): ProviderModelRouteResolution;
declare function normalizeConfig(params: {
  provider: string;
  providerConfig: ModelProviderConfig;
}): ModelProviderConfig;
declare function resolveThinkingProfile(params: ProviderDefaultThinkingPolicyContext): ProviderThinkingProfile | null;
//#endregion
export { normalizeConfig, normalizeModelCatalogId, resolveModelRoutes, resolveThinkingProfile };