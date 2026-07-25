import { b as extractFoundryEndpoint, h as TOKEN_REFRESH_MARGIN_MS, j as resolveConfiguredModelNameHint, s as CachedTokenEntry, t as ANTHROPIC_MESSAGES_API, u as FOUNDRY_ANTHROPIC_SCOPE, w as isFoundryProviderApi, y as buildFoundryProviderBaseUrl } from "../../shared-CPnD0JO-.js";

//#region extensions/microsoft-foundry/shared-runtime.d.ts
declare function getFoundryTokenCacheKey(params?: {
  scope?: string;
  subscriptionId?: string;
  tenantId?: string;
}): string;
//#endregion
export { ANTHROPIC_MESSAGES_API, type CachedTokenEntry, FOUNDRY_ANTHROPIC_SCOPE, TOKEN_REFRESH_MARGIN_MS, buildFoundryProviderBaseUrl, extractFoundryEndpoint, getFoundryTokenCacheKey, isFoundryProviderApi, resolveConfiguredModelNameHint };