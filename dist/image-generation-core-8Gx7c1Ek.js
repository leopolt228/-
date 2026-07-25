import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import "./subsystem-Dogzi5wG.js";
import "./provider-env-vars-BX8unNjx.js";
import "./failover-error-B8xHNn2y.js";
import "./runtime-shared-Dd4868RT.js";
import "./provider-registry-CfjwgA-Y.js";
import "./provider-model-shared-Dzz3IkWT.js";
//#region src/plugin-sdk/image-generation-core.ts
/** Default OpenAI image model used when image-generation provider config omits one. */
const OPENAI_DEFAULT_IMAGE_MODEL = "gpt-image-2";
const loadImageGenerationCoreAuthRuntime = createLazyRuntimeModule(() => import("./image-generation-core.auth.runtime.js"));
/** Resolve image-generation provider API keys through the lazy auth runtime helper. */
async function resolveApiKeyForProvider(...args) {
	return (await loadImageGenerationCoreAuthRuntime()).resolveApiKeyForProvider(...args);
}
//#endregion
export { resolveApiKeyForProvider as n, OPENAI_DEFAULT_IMAGE_MODEL as t };
