import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { t as SubsystemLogger } from "./subsystem-RmDRaRJV.js";
import { Ms as GenerateImageRuntimeResult, js as GenerateImageParams } from "./types-Bi5Leigi.js";
import { n as getProviderEnvVars } from "./provider-env-vars-BQGF9x5I.js";
import { l as ImageGenerationProvider } from "./types-OnH18OJG.js";
import { n as listImageGenerationProviders, t as getImageGenerationProvider } from "./provider-registry-CDO4z3Jg.js";

//#region src/image-generation/runtime.d.ts
declare const log: SubsystemLogger;
/** Dependency seam used by image-generation runtime tests and plugin host callers. */
type ImageGenerationRuntimeDeps = {
  getProvider?: typeof getImageGenerationProvider;
  listProviders?: typeof listImageGenerationProviders;
  getProviderEnvVars?: typeof getProviderEnvVars;
  log?: Pick<typeof log, "warn">;
};
/** Lists image-generation providers visible for the current config. */
declare function listRuntimeImageGenerationProviders(params?: {
  config?: OpenClawConfig;
}, deps?: ImageGenerationRuntimeDeps): ImageGenerationProvider[];
declare function generateImage(params: GenerateImageParams, deps?: ImageGenerationRuntimeDeps): Promise<GenerateImageRuntimeResult>;
//#endregion
export { listRuntimeImageGenerationProviders as n, generateImage as t };