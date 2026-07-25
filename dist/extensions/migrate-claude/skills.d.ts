import { l as MigrationItem } from "../../plugin-entry-Bj-pdgAt.js";
import { r as ClaudeSource } from "../../source-DXdpyJJu.js";
import { t as PlannedMigrationTargets } from "../../migration-runtime-Zjm6gQiA.js";
//#region extensions/migrate-claude/skills.d.ts
declare function buildSkillItems(params: {
  source: ClaudeSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
}): Promise<MigrationItem[]>;
declare function applyGeneratedSkillItem(item: MigrationItem, opts?: {
  overwrite?: boolean;
}): Promise<MigrationItem>;
//#endregion
export { applyGeneratedSkillItem, buildSkillItems };