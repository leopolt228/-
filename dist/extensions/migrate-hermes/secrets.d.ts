import { d as MigrationProviderContext, l as MigrationItem } from "../../plugin-entry-Bj-pdgAt.js";
import { t as PlannedMigrationTargets } from "../../migration-runtime-Zjm6gQiA.js";
import { t as HermesSource } from "../../source-CfveluQT.js";
//#region extensions/migrate-hermes/secrets.d.ts
declare function buildSecretItems(params: {
  config: Record<string, unknown>;
  ctx: MigrationProviderContext;
  source: HermesSource;
  targets: PlannedMigrationTargets;
}): Promise<MigrationItem[]>;
declare function applySecretItem(ctx: MigrationProviderContext, item: MigrationItem, targets: PlannedMigrationTargets): Promise<MigrationItem>;
//#endregion
export { applySecretItem, buildSecretItems };