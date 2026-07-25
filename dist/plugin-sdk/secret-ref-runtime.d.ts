import { b as coerceSecretRef, d as SecretInput, h as SecretRef } from "../types.secrets-CNoRpgG4.js";
import { a as createResolverContext, r as applyResolvedAssignments } from "../runtime-shared-CY--Gzyx.js";
import { n as resolveSecretRefValues } from "../resolve-DbpRTyJ1.js";

//#region src/plugin-sdk/secret-ref-runtime.d.ts
type ResolvedSecretPlanTarget = {
  targetType: string;
  providerId?: string;
  accountId?: string;
};
declare function resolveSecretPlanTargetByPath(params: {
  configFile: "openclaw.json" | "auth-profiles.json";
  pathSegments: string[];
}): ResolvedSecretPlanTarget | null;
//#endregion
export { ResolvedSecretPlanTarget, type SecretInput, type SecretRef, applyResolvedAssignments, coerceSecretRef, createResolverContext, resolveSecretPlanTargetByPath, resolveSecretRefValues };