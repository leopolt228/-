import { r as resolvePluginConfigObject } from "../../plugin-config-runtime-Dnur9SGp.js";
import { t as definePluginEntry } from "../../plugin-entry-IGDbtR-A.js";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-CnLdlRmT.js";
import { t as buildOpenAIImageGenerationProvider } from "../../image-generation-provider-2fxNTsjK.js";
import { t as openaiMediaUnderstandingProvider } from "../../media-understanding-provider-1MVU7QwD.js";
import { t as openAiMemoryEmbeddingProviderAdapter } from "../../memory-embedding-adapter-G--hcGiS.js";
import { n as buildOpenAIProvider } from "../../openai-provider-S-FQvtwb.js";
import { n as resolveOpenAISystemPromptContribution, t as resolveOpenAIPromptOverlayMode } from "../../prompt-overlay-CEqXWrxr.js";
import { t as buildOpenAIRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-eA_9jEck.js";
import { t as buildOpenAIRealtimeVoiceProvider } from "../../realtime-voice-provider-fE1fou3c.js";
import { t as buildOpenAISpeechProvider } from "../../speech-provider-CoKa7EaY.js";
import { t as buildOpenAIVideoGenerationProvider } from "../../video-generation-provider-CtnvDrE-.js";
//#region extensions/openai/index.ts
var openai_default = definePluginEntry({
	id: "openai",
	name: "OpenAI Provider",
	description: "Bundled OpenAI provider plugins",
	register(api) {
		const openAIToolCompatHooks = buildProviderToolCompatFamilyHooks("openai");
		const buildProviderWithPromptContribution = (provider) => ({
			...provider,
			...openAIToolCompatHooks,
			resolveSystemPromptContribution: (ctx) => {
				const pluginConfig = resolvePluginConfigObject(ctx.config, "openai") ?? (ctx.config ? void 0 : api.pluginConfig);
				return resolveOpenAISystemPromptContribution({
					config: ctx.config,
					legacyPluginConfig: pluginConfig,
					mode: resolveOpenAIPromptOverlayMode(pluginConfig),
					modelProviderId: provider.id,
					modelId: ctx.modelId,
					trigger: ctx.trigger
				});
			}
		});
		api.registerProvider(buildProviderWithPromptContribution(buildOpenAIProvider()));
		api.registerMemoryEmbeddingProvider(openAiMemoryEmbeddingProviderAdapter);
		api.registerImageGenerationProvider(buildOpenAIImageGenerationProvider());
		api.registerRealtimeTranscriptionProvider(buildOpenAIRealtimeTranscriptionProvider());
		api.registerRealtimeVoiceProvider(buildOpenAIRealtimeVoiceProvider());
		api.registerSpeechProvider(buildOpenAISpeechProvider());
		api.registerMediaUnderstandingProvider(openaiMediaUnderstandingProvider);
		api.registerVideoGenerationProvider(buildOpenAIVideoGenerationProvider());
	}
});
//#endregion
export { openai_default as default };
