import { t as CLI_DEFAULT_OPERATOR_SCOPES } from "./method-scopes-DN3UnWnt.js";
import { s as WRITE_SCOPE } from "./operator-scopes-BHrNTqoH.js";
import { c as getHeader, h as resolveTrustedHttpOperatorScopes } from "./http-auth-utils-uJaojXOz.js";
//#region src/gateway/server/plugin-route-runtime-scopes.ts
/** Resolves the scopes a plugin route receives after gateway HTTP authentication. */
function resolvePluginRouteRuntimeOperatorScopes(req, requestAuth, surface = "write-default") {
	if (surface === "trusted-operator") {
		if (!requestAuth.trustDeclaredOperatorScopes) return [...CLI_DEFAULT_OPERATOR_SCOPES];
		return resolveTrustedHttpOperatorScopes(req, requestAuth);
	}
	if (requestAuth.authMethod !== "trusted-proxy") return [WRITE_SCOPE];
	if (getHeader(req, "x-openclaw-scopes") === void 0) return [WRITE_SCOPE];
	return resolveTrustedHttpOperatorScopes(req, requestAuth);
}
//#endregion
export { resolvePluginRouteRuntimeOperatorScopes as t };
