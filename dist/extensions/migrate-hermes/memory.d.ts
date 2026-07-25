import { d as MigrationProviderContext, u as MigrationPlan } from "../../plugin-entry-Bj-pdgAt.js";
import { t as HermesSource } from "../../source-CfveluQT.js";

//#region extensions/migrate-hermes/memory.d.ts
declare function isMemoryOnlyMigration(ctx: MigrationProviderContext): boolean;
declare function buildHermesMemoryPlan(ctx: MigrationProviderContext, source: HermesSource): Promise<MigrationPlan>;
//#endregion
export { buildHermesMemoryPlan, isMemoryOnlyMigration };