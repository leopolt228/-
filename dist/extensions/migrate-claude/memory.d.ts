import { l as MigrationItem } from "../../plugin-entry-Bj-pdgAt.js";
import { r as ClaudeSource } from "../../source-DXdpyJJu.js";
import { t as PlannedMigrationTargets } from "../../migration-runtime-Zjm6gQiA.js";
//#region extensions/migrate-claude/memory.d.ts
declare function buildMemoryItems(params: {
  source: ClaudeSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
  includeInstructions?: boolean;
}): Promise<MigrationItem[]>;
//#endregion
export { buildMemoryItems };