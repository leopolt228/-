import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { r as PluginDoctorStateMigration } from "../../runtime-doctor-E1eEvGU1.js";
import { g as ChannelDoctorLegacyConfigRule, m as ChannelDoctorConfigMutation } from "../../types.adapters-Dx2pYKAA.js";
//#region extensions/matrix/src/doctor-contract.d.ts
declare const legacyConfigRules: ChannelDoctorLegacyConfigRule[];
declare function normalizeCompatibilityConfig({
  cfg
}: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation;
//#endregion
//#region extensions/matrix/doctor-contract-api.d.ts
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };