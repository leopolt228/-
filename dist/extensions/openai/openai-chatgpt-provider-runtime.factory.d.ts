import { c as ensureGlobalUndiciEnvProxyDispatcher } from "../../wsl-DTG0LfAO.js";
import { n as refreshOpenAICodexToken } from "../../openai-chatgpt-oauth-flow.runtime-7xrMkIGg.js";

//#region extensions/openai/openai-chatgpt-provider-runtime.factory.d.ts
type OpenAICodexProviderRuntimeDeps = {
  ensureGlobalUndiciEnvProxyDispatcher: typeof ensureGlobalUndiciEnvProxyDispatcher;
  refreshOpenAICodexToken: typeof refreshOpenAICodexToken;
};
declare function createOpenAICodexProviderRuntime(deps: OpenAICodexProviderRuntimeDeps): {
  refreshOpenAICodexToken: typeof refreshOpenAICodexToken;
};
//#endregion
export { createOpenAICodexProviderRuntime };