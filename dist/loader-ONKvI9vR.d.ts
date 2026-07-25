import { i as OpenClawConfig, p as PluginInstallRecord } from "./types.openclaw-DAPZkTyD.js";
import { i as PluginDiscoveryResult, n as PluginManifestRegistry } from "./manifest-registry-C53V9sX9.js";
import { Gn as CreatePluginRuntimeOptions, Yi as PluginLogger } from "./types-Bi5Leigi.js";
import { n as GatewayRequestHandler } from "./types-CzbSjEqY.js";
import { n as PluginRegistry, r as PluginRegistryParams } from "./registry-types-CRap9HPV.js";
import { n as PluginSdkResolutionPreference } from "./sdk-alias-CQ2oE3sj.js";

//#region src/plugins/loader-types.d.ts
/** Inputs shared by runtime, snapshot, and CLI-metadata plugin loading. */
type PluginLoadOptions = {
  config?: OpenClawConfig;
  activationSourceConfig?: OpenClawConfig;
  autoEnabledReasons?: Readonly<Record<string, string[]>>;
  workspaceDir?: string;
  installRecords?: Record<string, PluginInstallRecord>; /** Resolve plugin roots and load paths against an explicit environment. */
  env?: NodeJS.ProcessEnv; /** Apply the config IO env-substitution pass to direct raw-config callers. */
  resolveRawConfigEnvVars?: boolean;
  logger?: PluginLogger;
  coreGatewayHandlers?: Record<string, GatewayRequestHandler>;
  coreGatewayMethodNames?: readonly string[];
  hostServices?: PluginRegistryParams["hostServices"];
  runtimeOptions?: CreatePluginRuntimeOptions;
  startupTrace?: {
    detail: (name: string, metrics: ReadonlyArray<readonly [string, number | string]>) => void;
  };
  pluginSdkResolution?: PluginSdkResolutionPreference;
  cache?: boolean;
  mode?: "full" | "validate";
  onlyPluginIds?: string[];
  includeSetupOnlyChannelPlugins?: boolean;
  forceSetupOnlyChannelPlugins?: boolean;
  requireSetupEntryForSetupOnlyChannelPlugins?: boolean; /** Prefer opted-in channel setup entries for the pre-listen startup surface. */
  preferSetupRuntimeForChannelPlugins?: boolean; /** Load channel runtime entries even when setup entries are available. */
  forceFullRuntimeForChannelPlugins?: boolean; /** Prefer bundled JavaScript artifacts over source TypeScript entrypoints. */
  preferBuiltPluginArtifacts?: boolean;
  toolDiscovery?: boolean;
  activate?: boolean;
  loadModules?: boolean;
  throwOnLoadError?: boolean;
  manifestRegistry?: PluginManifestRegistry;
  discovery?: PluginDiscoveryResult;
};
//#endregion
//#region src/plugins/loader-cache.d.ts
declare function clearPluginRegistryLoadCache(): void;
declare function resolvePluginRegistryLoadCacheKey(options?: PluginLoadOptions): string;
declare function isPluginRegistryLoadInFlight(options?: PluginLoadOptions): boolean;
//#endregion
//#region src/plugins/loader-cli-registry.d.ts
declare function loadOpenClawPluginCliRegistry(options?: PluginLoadOptions): Promise<PluginRegistry>;
//#endregion
//#region src/plugins/loader-runtime-registry.d.ts
declare function resolveRuntimePluginRegistry(options?: PluginLoadOptions): PluginRegistry | undefined;
declare function getRuntimePluginRegistryForLoadOptions(options?: PluginLoadOptions): PluginRegistry | undefined;
/** Return a compatible active registry without triggering a fresh load on cache miss. */
declare function resolveCompatibleRuntimePluginRegistry(options?: PluginLoadOptions): PluginRegistry | undefined;
//#endregion
//#region src/plugins/loader-shared.d.ts
declare function clearActivatedPluginRuntimeState(): void;
//#endregion
//#region src/plugins/loader-runtime-load.d.ts
declare function loadOpenClawPlugins(options?: PluginLoadOptions): PluginRegistry;
//#endregion
export { resolveRuntimePluginRegistry as a, isPluginRegistryLoadInFlight as c, resolveCompatibleRuntimePluginRegistry as i, resolvePluginRegistryLoadCacheKey as l, clearActivatedPluginRuntimeState as n, loadOpenClawPluginCliRegistry as o, getRuntimePluginRegistryForLoadOptions as r, clearPluginRegistryLoadCache as s, loadOpenClawPlugins as t, PluginLoadOptions as u };