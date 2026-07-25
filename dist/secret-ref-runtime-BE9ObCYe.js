import "./types.secrets-BgE_Zq2x.js";
import "./resolve-DhgogJwd.js";
import "./runtime-shared-BL5llIf5.js";
import { u as resolveSecretPlanTargetByPath$1 } from "./target-registry-query-DKaR_5Cb.js";
//#region src/plugin-sdk/secret-ref-runtime.ts
function resolveSecretPlanTargetByPath(params) {
	const resolved = resolveSecretPlanTargetByPath$1(params);
	if (!resolved) return null;
	return {
		targetType: resolved.entry.targetType,
		...resolved.providerId ? { providerId: resolved.providerId } : {},
		...resolved.accountId ? { accountId: resolved.accountId } : {}
	};
}
//#endregion
export { resolveSecretPlanTargetByPath as t };
