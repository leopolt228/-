import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { g as ChannelDoctorLegacyConfigRule, m as ChannelDoctorConfigMutation } from "../../types.adapters-Dx2pYKAA.js";
//#region extensions/googlechat/src/doctor-contract.d.ts
declare const legacyConfigRules: ChannelDoctorLegacyConfigRule[];
declare function normalizeCompatibilityConfig({
  cfg
}: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation;
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };