import { c as resolveProviderRequestHeaders } from "./provider-request-config-DrrUROfX.js";
import "./provider-http-D2uO-AEP.js";
import "./provider-policy-DagFxEZx.js";
//#region extensions/google/google-api-client-header.ts
function resolveGoogleApiClientHeaders(params) {
	return resolveProviderRequestHeaders({
		provider: "google",
		api: params?.api ?? "google-generative-ai",
		baseUrl: params?.baseUrl ?? "https://generativelanguage.googleapis.com/v1beta",
		capability: params?.capability ?? "other",
		transport: params?.transport ?? "http"
	}) ?? {};
}
//#endregion
export { resolveGoogleApiClientHeaders as t };
