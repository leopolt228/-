import { r as ensureGlobalUndiciEnvProxyDispatcher } from "./undici-global-dispatcher-CyLdv3rm.js";
import "./runtime-env-BDC_axp1.js";
import { n as refreshOpenAICodexToken$1 } from "./openai-chatgpt-oauth-flow.runtime.js";
import { t as createOpenAICodexProviderRuntime } from "./openai-chatgpt-provider-runtime.factory-CxIfx7zN.js";
//#region extensions/openai/openai-chatgpt-provider.runtime.ts
const runtime = createOpenAICodexProviderRuntime({
	ensureGlobalUndiciEnvProxyDispatcher,
	refreshOpenAICodexToken: refreshOpenAICodexToken$1
});
async function refreshOpenAICodexToken(...args) {
	return await runtime.refreshOpenAICodexToken(...args);
}
//#endregion
export { refreshOpenAICodexToken as t };
