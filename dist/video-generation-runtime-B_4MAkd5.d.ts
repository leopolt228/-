import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { t as SubsystemLogger } from "./subsystem-RmDRaRJV.js";
import { As as GenerateVideoRuntimeResult, ks as GenerateVideoParams } from "./types-Bi5Leigi.js";
import { n as getProviderEnvVars } from "./provider-env-vars-BQGF9x5I.js";
import { c as VideoGenerationProvider } from "./types-0JQgrB_F.js";
import { n as listVideoGenerationProviders, t as getVideoGenerationProvider } from "./provider-registry-Dxvxo_rg.js";

//#region src/video-generation/runtime.d.ts
declare const log: SubsystemLogger;
type VideoGenerationRuntimeDeps = {
  getProvider?: typeof getVideoGenerationProvider;
  listProviders?: typeof listVideoGenerationProviders;
  getProviderEnvVars?: typeof getProviderEnvVars;
  log?: Pick<typeof log, "debug" | "warn">;
};
declare function listRuntimeVideoGenerationProviders(params?: {
  config?: OpenClawConfig;
}, deps?: VideoGenerationRuntimeDeps): VideoGenerationProvider[];
declare function generateVideo(params: GenerateVideoParams, deps?: VideoGenerationRuntimeDeps): Promise<GenerateVideoRuntimeResult>;
//#endregion
export { listRuntimeVideoGenerationProviders as n, generateVideo as t };