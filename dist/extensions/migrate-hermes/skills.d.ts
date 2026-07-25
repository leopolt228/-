import { l as MigrationItem } from "../../plugin-entry-Bj-pdgAt.js";
import { t as PlannedMigrationTargets } from "../../migration-runtime-Zjm6gQiA.js";
import { t as HermesSource } from "../../source-CfveluQT.js";
//#region extensions/migrate-hermes/skills.d.ts
declare function buildSkillItems(params: {
  source: HermesSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
}): Promise<MigrationItem[]>;
//#endregion
export { buildSkillItems };