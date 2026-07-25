import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { t as LegacyConfigRule } from "../../legacy.shared-CFJyEGh7.js";
import { m as ChannelDoctorConfigMutation } from "../../types.adapters-Dx2pYKAA.js";
//#region extensions/tlon/src/doctor-contract.d.ts
declare const legacyConfigRules: LegacyConfigRule[];
declare const normalizeCompatibilityConfig: (params: {
  cfg: OpenClawConfig;
}) => ChannelDoctorConfigMutation;
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };