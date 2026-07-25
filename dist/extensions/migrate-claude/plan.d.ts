import { d as MigrationProviderContext, u as MigrationPlan } from "../../plugin-entry-Bj-pdgAt.js";

//#region extensions/migrate-claude/plan.d.ts
declare function buildClaudePlan(ctx: MigrationProviderContext): Promise<MigrationPlan>;
//#endregion
export { buildClaudePlan };