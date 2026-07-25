import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-Dw9i7sK6.js";
import { n as ModelCatalogSnapshot } from "./model-catalog.types-cokHDhLz.js";
import { l as ModelRegistry, u as AuthStorage } from "./index-DTRqLAuB.js";

//#region src/agents/prepared-model-runtime.owner.d.ts
type PreparedModelRuntimeSnapshot = Readonly<{
  agentId?: string;
  agentDir: string;
  inheritedAuthDir?: string;
  workspaceDir?: string;
  config: OpenClawConfig;
  metadataSnapshot: PluginMetadataSnapshot;
  modelCatalog: ModelCatalogSnapshot;
  createStores: () => PreparedModelRuntimeStores;
}>;
type PreparedModelRuntimeStores = {
  authStorage: AuthStorage;
  modelRegistry: ModelRegistry;
};
//#endregion
export { PreparedModelRuntimeSnapshot as t };