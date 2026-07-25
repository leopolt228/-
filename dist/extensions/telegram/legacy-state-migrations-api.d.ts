import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { L as ChannelLegacyStateMigrationPlan } from "../../types.core-Di2R8WTy.js";
//#region extensions/telegram/src/state-migrations.d.ts
declare function detectTelegramLegacyStateMigrations(params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  stateDir?: string;
}): Promise<ChannelLegacyStateMigrationPlan[]>;
//#endregion
export { detectTelegramLegacyStateMigrations };