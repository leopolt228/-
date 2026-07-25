import { r as createLegacyPrivateNetworkDoctorContract } from "./ssrf-policy-BcGHIF9t.js";
import "./ssrf-runtime-b7ye-Z-7.js";
//#region extensions/tlon/src/doctor-contract.ts
const contract = createLegacyPrivateNetworkDoctorContract({ channelKey: "tlon" });
const legacyConfigRules = contract.legacyConfigRules;
const normalizeCompatibilityConfig = contract.normalizeCompatibilityConfig;
//#endregion
export { normalizeCompatibilityConfig as n, legacyConfigRules as t };
