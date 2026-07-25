import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { qc as ProviderRuntimeModel } from "../../types-Bi5Leigi.js";
import { Ot as ProviderCatalogContext, Qt as ProviderResolveDynamicModelContext, Vt as ProviderPrepareDynamicModelContext, kt as ProviderCatalogResult } from "../../plugin-entry-Bj-pdgAt.js";
//#region extensions/github-copilot/dynamic-models.d.ts
declare function createGithubCopilotDynamicModelHooks(params: {
  discoveryEnabled(config?: OpenClawConfig): boolean;
}): {
  prepareDynamicModel: (ctx: ProviderPrepareDynamicModelContext) => Promise<void>;
  resolveDynamicModel: (ctx: ProviderResolveDynamicModelContext) => ProviderRuntimeModel | undefined;
  runCatalog: (ctx: ProviderCatalogContext) => Promise<ProviderCatalogResult>;
  preferRuntimeResolvedModel: ({
    config
  }: {
    config?: OpenClawConfig;
  }) => boolean;
};
//#endregion
export { createGithubCopilotDynamicModelHooks };