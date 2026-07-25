import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-Dw9i7sK6.js";
import { t as ModelCatalogEntry } from "./model-catalog.types-cokHDhLz.js";
//#region src/agents/model-catalog-lookup.d.ts
/** Finds a provider-qualified model entry in a catalog. */
declare function findModelInCatalog(catalog: ModelCatalogEntry[], provider: string, modelId: string): ModelCatalogEntry | undefined;
//#endregion
//#region src/agents/model-catalog.d.ts
declare function loadManifestModelCatalog(params: {
  config: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  fallbackToMetadataScan?: boolean;
  metadataSnapshot?: PluginMetadataSnapshot;
}): ModelCatalogEntry[];
/**
 * Check if a model supports image input based on its catalog entry.
 */
declare function modelSupportsVision(entry: ModelCatalogEntry | undefined): boolean;
//#endregion
export { modelSupportsVision as n, findModelInCatalog as r, loadManifestModelCatalog as t };