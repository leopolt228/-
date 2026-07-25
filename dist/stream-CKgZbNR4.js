import "./ai-transport-host-CpSAJnEP.js";
import { defaultApiRegistry, defaultLlmRuntime } from "@openclaw/ai/internal/runtime";
import { registerBuiltInApiProviders } from "@openclaw/ai/providers";
//#region src/llm/model-runtime-binding.ts
const MODEL_LLM_RUNTIME = Symbol("openclaw.modelLlmRuntime");
const streamLlmRuntimes = /* @__PURE__ */ new WeakMap();
/** Carries the prepared lifecycle runtime without changing the serialized model shape. */
function bindModelLlmRuntime(model, runtime) {
	const bound = { ...model };
	Object.defineProperty(bound, MODEL_LLM_RUNTIME, {
		value: runtime,
		enumerable: false
	});
	return bound;
}
function getModelLlmRuntime(model) {
	return model[MODEL_LLM_RUNTIME];
}
/** Associates a prepared stream entry point with the runtime that owns it. */
function bindStreamLlmRuntime(streamFn, runtime) {
	streamLlmRuntimes.set(streamFn, runtime);
}
function getStreamLlmRuntime(streamFn) {
	return streamFn ? streamLlmRuntimes.get(streamFn) : void 0;
}
//#endregion
//#region src/llm/stream.ts
registerBuiltInApiProviders(defaultApiRegistry);
function resolveRuntime(model) {
	return getModelLlmRuntime(model) ?? defaultLlmRuntime;
}
function stream(model, context, options) {
	return resolveRuntime(model).stream(model, context, options);
}
function complete(model, context, options) {
	return resolveRuntime(model).complete(model, context, options);
}
function streamSimple(model, context, options) {
	return resolveRuntime(model).streamSimple(model, context, options);
}
function completeSimple(model, context, options) {
	return resolveRuntime(model).completeSimple(model, context, options);
}
//#endregion
export { bindModelLlmRuntime as a, getStreamLlmRuntime as c, streamSimple as i, completeSimple as n, bindStreamLlmRuntime as o, stream as r, getModelLlmRuntime as s, complete as t };
