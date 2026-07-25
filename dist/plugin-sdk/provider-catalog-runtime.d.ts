import { n as PluginManifestRegistry } from "../manifest-registry-C53V9sX9.js";
import { n as PluginMetadataSnapshot } from "../plugin-metadata-snapshot.types-Dw9i7sK6.js";
import { nc as augmentModelCatalogWithProviderPlugins } from "../types-Bi5Leigi.js";
import { u as PluginLoadOptions } from "../loader-ONKvI9vR.js";
import { n as resolvePluginProviders, t as isPluginProvidersLoadInFlight } from "../providers.runtime-DsVUhydb.js";
import { n as PluginRegistrySnapshot } from "../plugin-registry-BXr_VHkJ.js";

//#region src/plugins/providers.d.ts
type ProviderManifestLoadParams = {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
  registry?: PluginRegistrySnapshot;
  manifestRegistry?: PluginManifestRegistry;
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "manifestRegistry"> & Partial<Pick<PluginMetadataSnapshot, "owners" | "byPluginId">>;
};
declare function resolveOwningPluginIdsForProvider(params: {
  provider: string;
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
  manifestRegistry?: PluginManifestRegistry;
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "owners" | "manifestRegistry" | "byPluginId">;
}): string[] | undefined;
declare function resolveCatalogHookProviderPluginIds(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
  metadataSnapshot?: ProviderManifestLoadParams["metadataSnapshot"];
}): string[];
//#endregion
export { augmentModelCatalogWithProviderPlugins, isPluginProvidersLoadInFlight, resolveCatalogHookProviderPluginIds, resolveOwningPluginIdsForProvider, resolvePluginProviders };