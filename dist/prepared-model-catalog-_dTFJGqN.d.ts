import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { n as ModelCatalogSnapshot, t as ModelCatalogEntry } from "./model-catalog.types-cokHDhLz.js";
//#region src/agents/prepared-model-catalog.d.ts
type LoadPreparedModelCatalogParams = {
  agentId?: string;
  agentDir?: string;
  config?: OpenClawConfig;
  readOnly?: boolean;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
};
/** Returns the current published catalog without waiting or starting discovery. */
declare function getPreparedModelCatalogSnapshot(params?: LoadPreparedModelCatalogParams): ModelCatalogSnapshot | undefined;
/** Reads one atomic catalog generation, activating a lifecycle owner when needed. */
declare function loadPreparedModelCatalogSnapshot(params?: LoadPreparedModelCatalogParams): Promise<ModelCatalogSnapshot>;
declare function loadPreparedModelCatalog(params?: LoadPreparedModelCatalogParams): Promise<ModelCatalogEntry[]>;
//#endregion
export { loadPreparedModelCatalogSnapshot as i, getPreparedModelCatalogSnapshot as n, loadPreparedModelCatalog as r, LoadPreparedModelCatalogParams as t };