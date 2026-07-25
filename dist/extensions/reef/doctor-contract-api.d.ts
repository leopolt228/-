import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { r as PluginDoctorStateMigration } from "../../runtime-doctor-E1eEvGU1.js";
import { g as ChannelDoctorLegacyConfigRule } from "../../types.adapters-Dx2pYKAA.js";
//#region extensions/reef/doctor-contract-api.d.ts
declare const legacyConfigRules: ChannelDoctorLegacyConfigRule[];
declare function normalizeCompatibilityConfig({
  cfg
}: {
  cfg: OpenClawConfig;
}): {
  config: OpenClawConfig;
  changes: string[];
};
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };