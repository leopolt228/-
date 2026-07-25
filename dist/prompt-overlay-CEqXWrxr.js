import { a as isGpt5ModelId, c as resolveGpt5PromptOverlayMode, l as resolveGpt5SystemPromptContribution } from "./gpt5-prompt-overlay-ClFTAwM7.js";
import "./provider-model-shared-Dzz3IkWT.js";
//#region extensions/openai/prompt-overlay.ts
const OPENAI_PROVIDER_IDS = /* @__PURE__ */ new Set(["openai"]);
function resolveOpenAIPromptOverlayMode(pluginConfig) {
	return resolveGpt5PromptOverlayMode(void 0, pluginConfig);
}
function shouldApplyOpenAIPromptOverlay(params) {
	return OPENAI_PROVIDER_IDS.has(params.modelProviderId ?? "") && isGpt5ModelId(params.modelId);
}
function resolveOpenAISystemPromptContribution(params) {
	return resolveGpt5SystemPromptContribution({
		config: params.config,
		legacyPluginConfig: params.mode === void 0 ? params.legacyPluginConfig : { personality: params.mode },
		modelId: params.modelId,
		trigger: params.trigger,
		enabled: shouldApplyOpenAIPromptOverlay({
			modelProviderId: params.modelProviderId,
			modelId: params.modelId
		})
	});
}
//#endregion
export { resolveOpenAISystemPromptContribution as n, resolveOpenAIPromptOverlayMode as t };
