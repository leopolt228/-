import "./proxy-env-Blb_nHo9.js";
import "./managed-proxy-undici-BCJBAJza.js";
import "./undici-runtime-CvoyIVwn.js";
import "./ssrf-eKWXIRoD.js";
import "./node-proxy-agent-DQDWFMx0.js";
import "./proxy-fetch-CvClvqkk.js";
import "./fetch-CVRzg47h.js";
//#region src/plugin-sdk/fetch-runtime.ts
/** Apply the trusted-env-proxy guarded fetch preset without exposing raw mode strings to plugins. */
function withTrustedEnvProxyGuardedFetchMode(params) {
	return {
		...params,
		mode: "trusted_env_proxy"
	};
}
//#endregion
export { withTrustedEnvProxyGuardedFetchMode as t };
