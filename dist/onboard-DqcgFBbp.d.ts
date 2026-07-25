import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { a as XiaomiTokenPlanRegion } from "./provider-catalog-D957Hb9E.js";

//#region extensions/xiaomi/onboard.d.ts
declare const XIAOMI_DEFAULT_MODEL_REF = "xiaomi/mimo-v2.5";
declare const XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_REF = "xiaomi-token-plan/mimo-v2.5-pro";
declare function applyXiaomiProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
declare function applyXiaomiConfig(cfg: OpenClawConfig): OpenClawConfig;
declare function applyXiaomiTokenPlanConfig(cfg: OpenClawConfig, region: XiaomiTokenPlanRegion): OpenClawConfig;
//#endregion
export { applyXiaomiTokenPlanConfig as a, applyXiaomiProviderConfig as i, XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_REF as n, applyXiaomiConfig as r, XIAOMI_DEFAULT_MODEL_REF as t };