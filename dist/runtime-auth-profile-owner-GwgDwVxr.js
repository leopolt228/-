import { r as resolveAuthStorePath } from "./path-resolve-Crj4m2cc.js";
import "./paths-D6nfbNgQ.js";
//#region src/secrets/runtime-auth-profile-owner.ts
/** Stable SecretRef owner identity for one agent-scoped auth profile. */
/** Tuple encoding distinguishes agents and avoids path/profile separator collisions. */
function resolveAuthProfileSecretOwnerId(params) {
	return JSON.stringify([resolveAuthStorePath(params.agentDir), params.profileId]);
}
//#endregion
export { resolveAuthProfileSecretOwnerId as t };
