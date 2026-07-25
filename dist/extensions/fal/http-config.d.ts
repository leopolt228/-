import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { a as AuthProfileStore } from "../../types-BYLj8dvi.js";
import { _ as ProviderRequestCapability } from "../../provider-request-config-Dx-hegjO.js";
import { h as resolveProviderHttpRequestConfig } from "../../provider-http-BkmiNZiS.js";
//#region extensions/fal/http-config.d.ts
type FalAuthenticatedRequest = {
  cfg?: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
};
declare function resolveFalHttpRequestConfig(params: {
  req: FalAuthenticatedRequest;
  baseUrl?: string;
  capability: ProviderRequestCapability;
}): Promise<ReturnType<typeof resolveProviderHttpRequestConfig>>;
//#endregion
export { resolveFalHttpRequestConfig };