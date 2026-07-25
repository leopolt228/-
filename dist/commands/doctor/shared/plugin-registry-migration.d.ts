import { i as OpenClawConfig } from "../../../types.openclaw-DAPZkTyD.js";
import { r as LoadInstalledPluginIndexParams, t as InstalledPluginIndex } from "../../../installed-plugin-index-types-CX9A5T2q.js";
import { t as InstalledPluginIndexStoreOptions } from "../../../installed-plugin-index-store-path-DHr6siNg.js";
import { t as InstalledPluginIndexStoreInspection } from "../../../installed-plugin-index-store-Choa2pLC.js";

//#region src/commands/doctor/shared/plugin-registry-migration.d.ts
type PluginRegistryInstallMigrationPreflightAction = "skip-existing" | "migrate";
type PluginRegistryInstallMigrationPreflight = {
  /** Migration action selected before reading or writing registry state. */action: PluginRegistryInstallMigrationPreflightAction; /** Persisted plugin index path that migration will inspect or write. */
  filePath: string;
};
type PluginRegistryInstallMigrationResult = {
  status: "skip-existing" | "dry-run";
  migrated: false;
  preflight: PluginRegistryInstallMigrationPreflight;
} | {
  status: "migrated";
  migrated: true;
  preflight: PluginRegistryInstallMigrationPreflight;
  inspection: InstalledPluginIndexStoreInspection;
  current: InstalledPluginIndex;
};
type PluginRegistryInstallMigrationParams = LoadInstalledPluginIndexParams & InstalledPluginIndexStoreOptions & {
  dryRun?: boolean;
  existsSync?: (path: string) => boolean;
  readConfig?: () => Promise<OpenClawConfig> | OpenClawConfig;
};
/** Decide whether plugin install registry migration should run for this environment. */
declare function preflightPluginRegistryInstallMigration(params?: PluginRegistryInstallMigrationParams): PluginRegistryInstallMigrationPreflight;
/** Persist a migrated plugin install registry from legacy config/install records when needed. */
declare function migratePluginRegistryForInstall(params?: PluginRegistryInstallMigrationParams): Promise<PluginRegistryInstallMigrationResult>;
//#endregion
export { PluginRegistryInstallMigrationParams, migratePluginRegistryForInstall, preflightPluginRegistryInstallMigration };