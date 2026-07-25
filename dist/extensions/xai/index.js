import { r as createLazyRuntimeModule } from "../../lazy-runtime-B-Fc-m0I.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
import { f as defaultToolStreamExtraParams } from "../../provider-stream-shared-BiURRLUJ.js";
import { a as buildProviderReplayFamilyHooks } from "../../provider-model-shared-Dzz3IkWT.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-Cxa0r8-X.js";
import "../../provider-web-search-CyddQoxo.js";
import { t as normalizeXaiModelId } from "../../model-id-C3Tkp5Dy.js";
import { t as isXaiProviderId } from "../../provider-id-B9ITcNPA.js";
import { n as buildLiveXaiProvider, r as buildXaiProvider, t as buildLiveXaiOAuthProvider } from "../../provider-catalog-CKBRMH8w.js";
import { n as applyXaiConfig, t as XAI_DEFAULT_MODEL_REF } from "../../onboard-DE6v7BpP.js";
import { t as buildXaiImageGenerationProvider } from "../../image-generation-provider-_GzASiLz.js";
import { t as applyXaiRuntimeModelCompat } from "../../runtime-model-compat-CnYkfZlW.js";
import { n as resolveXaiForwardCompatModel, t as isModernXaiModel } from "../../provider-models-Byq5Y4j_.js";
import { n as resolveXaiTransport } from "../../api-Cbv5cjcs.js";
import { n as createCodeExecutionToolDefinition, t as buildMissingCodeExecutionApiKeyPayload } from "../../code-execution-tool-shared-CeAkKo1Y.js";
import { t as resolveThinkingProfile } from "../../provider-policy-api-MGPBKxa-.js";
import { t as buildXaiRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-DUIRn0Hs.js";
import { t as buildXaiRealtimeVoiceProvider } from "../../realtime-voice-provider-NnB0NG1l.js";
import { t as buildXaiSpeechProvider } from "../../speech-provider-BKax-9aQ.js";
import { n as resolveFallbackXaiAuth, t as isXaiToolEnabled } from "../../tool-auth-shared-Ny7TRVp9.js";
import { n as readPluginCodeExecutionConfig, r as resolveCodeExecutionEnabled } from "../../code-execution-config-DljwG_FH.js";
import { t as resolveEffectiveXSearchConfig } from "../../x-search-config-CmYxGsFn.js";
import { t as wrapXaiProviderStream } from "../../stream-D8QVpa4n.js";
import { t as buildXaiMediaUnderstandingProvider } from "../../stt-DmoVwZAS.js";
import { t as buildXaiVideoGenerationProvider } from "../../video-generation-provider-DKUABiVa.js";
import { t as createXaiWebSearchProvider } from "../../web-search-DSlD0d9v.js";
import { n as buildMissingXSearchApiKeyPayload, r as createXSearchToolDefinition } from "../../x-search-tool-shared-Diktx6ye.js";
import { n as createXaiOAuthAuthMethod, r as refreshXaiOAuthCredential, t as createXaiDeviceCodeAuthMethod } from "../../xai-oauth-yQ61LgJp.js";
//#region extensions/xai/index.ts
const PROVIDER_ID = "xai";
const XAI_CREDIT_OR_SPENDING_LIMIT_RE = /\b(?:used all available credits|monthly spending limit|purchase more credits|raise your spending limit)\b/i;
const XAI_RATE_LIMIT_RE = /\b(?:rate limit exceeded|too many requests)\b/i;
const loadCodeExecutionModule = createLazyRuntimeModule(() => import("./code-execution.js"));
const loadXSearchModule = createLazyRuntimeModule(() => import("./x-search.js"));
function classifyXaiFailoverReason(errorMessage) {
	if (XAI_CREDIT_OR_SPENDING_LIMIT_RE.test(errorMessage)) return "billing";
	if (XAI_RATE_LIMIT_RE.test(errorMessage)) return "rate_limit";
}
function hasResolvableXaiApiKey(config, auth) {
	return isXaiToolEnabled({
		sourceConfig: config,
		auth
	});
}
function isCodeExecutionEnabled(config, auth) {
	return resolveCodeExecutionEnabled({
		sourceConfig: config,
		runtimeConfig: config,
		config: readPluginCodeExecutionConfig(config),
		auth
	});
}
function isXSearchEnabled(config, auth) {
	if ((config && typeof config === "object" ? resolveEffectiveXSearchConfig(config) : void 0)?.enabled === false) return false;
	return hasResolvableXaiApiKey(config, auth);
}
function shouldExposeXaiBilledTool(params) {
	const activeProvider = params.activeProvider?.trim();
	if (!activeProvider || params.enabled === false) return false;
	return isXaiProviderId(activeProvider) || params.enabled === true;
}
function createLazyCodeExecutionTool(ctx) {
	const effectiveConfig = ctx.runtimeConfig ?? ctx.config;
	const codeExecutionConfig = readPluginCodeExecutionConfig(effectiveConfig);
	if (!shouldExposeXaiBilledTool({
		activeProvider: ctx.activeModel?.provider,
		enabled: codeExecutionConfig?.enabled
	})) return null;
	if (!isCodeExecutionEnabled(effectiveConfig, ctx)) return null;
	return createCodeExecutionToolDefinition(async (toolCallId, args) => {
		const { createCodeExecutionTool } = await loadCodeExecutionModule();
		const tool = createCodeExecutionTool({
			config: ctx.config,
			runtimeConfig: ctx.runtimeConfig ?? null,
			auth: ctx
		});
		if (!tool) return jsonResult(buildMissingCodeExecutionApiKeyPayload());
		return await tool.execute(toolCallId, args);
	});
}
function createLazyXSearchTool(ctx) {
	const effectiveConfig = ctx.runtimeConfig ?? ctx.config;
	const xSearchConfig = resolveEffectiveXSearchConfig(effectiveConfig);
	if (!shouldExposeXaiBilledTool({
		activeProvider: ctx.activeModel?.provider,
		enabled: xSearchConfig?.enabled
	})) return null;
	if (!isXSearchEnabled(effectiveConfig, ctx)) return null;
	return createXSearchToolDefinition(async (toolCallId, args) => {
		const { createXSearchTool } = await loadXSearchModule();
		const tool = createXSearchTool({
			config: ctx.config,
			runtimeConfig: ctx.runtimeConfig ?? null,
			auth: ctx
		});
		if (!tool) return jsonResult(buildMissingXSearchApiKeyPayload());
		return await tool.execute(toolCallId, args);
	});
}
var xai_default = defineSingleProviderPluginEntry({
	id: "xai",
	name: "xAI Plugin",
	description: "Bundled xAI plugin",
	provider: {
		label: "xAI",
		aliases: ["x-ai"],
		docsPath: "/providers/xai",
		auth: [{
			methodId: "api-key",
			label: "xAI API key",
			hint: "API key",
			optionKey: "xaiApiKey",
			flagName: "--xai-api-key",
			envVar: "XAI_API_KEY",
			promptMessage: "Enter xAI API key",
			defaultModel: XAI_DEFAULT_MODEL_REF,
			applyConfig: (cfg) => applyXaiConfig(cfg),
			wizard: { groupLabel: "xAI (Grok)" }
		}],
		extraAuth: [createXaiOAuthAuthMethod(), createXaiDeviceCodeAuthMethod()],
		catalog: {
			order: "simple",
			run: async (ctx) => {
				const auth = ctx.resolveProviderAuth(PROVIDER_ID);
				try {
					const { resolveApiKeyForProvider } = await import("../../plugin-sdk/provider-auth-runtime.js");
					const runtimeAuth = await resolveApiKeyForProvider({
						provider: PROVIDER_ID,
						cfg: ctx.config,
						...ctx.agentDir ? { agentDir: ctx.agentDir } : {},
						...ctx.workspaceDir ? { workspaceDir: ctx.workspaceDir } : {},
						...auth.profileId ? {
							profileId: auth.profileId,
							lockedProfile: true
						} : {}
					});
					if (runtimeAuth?.mode === "oauth" && runtimeAuth.apiKey) return { provider: await buildLiveXaiOAuthProvider({ discoveryApiKey: runtimeAuth.apiKey }) };
				} catch {
					if (auth.mode === "oauth") {}
				}
				if (auth.apiKey) return { provider: await buildLiveXaiProvider({
					apiKey: auth.apiKey,
					discoveryApiKey: auth.discoveryApiKey
				}) };
				const apiKey = ctx.resolveProviderApiKey(PROVIDER_ID);
				if (!apiKey.apiKey) return null;
				return { provider: await buildLiveXaiProvider({
					apiKey: apiKey.apiKey,
					discoveryApiKey: apiKey.discoveryApiKey
				}) };
			},
			staticRun: async () => ({ provider: buildXaiProvider() })
		},
		...buildProviderReplayFamilyHooks({ family: "openai-compatible" }),
		prepareExtraParams: (ctx) => defaultToolStreamExtraParams(ctx.extraParams),
		wrapStreamFn: wrapXaiProviderStream,
		resolveSyntheticAuth: ({ config }) => {
			const fallbackAuth = resolveFallbackXaiAuth(config);
			if (!fallbackAuth) return;
			return {
				apiKey: fallbackAuth.apiKey,
				source: fallbackAuth.source,
				mode: "api-key"
			};
		},
		normalizeResolvedModel: ({ model }) => applyXaiRuntimeModelCompat(model),
		normalizeTransport: ({ provider, api, baseUrl }) => resolveXaiTransport({
			provider,
			api,
			baseUrl
		}),
		normalizeModelId: ({ modelId }) => normalizeXaiModelId(modelId),
		resolveDynamicModel: (ctx) => resolveXaiForwardCompatModel({
			providerId: PROVIDER_ID,
			ctx
		}),
		refreshOAuth: refreshXaiOAuthCredential,
		resolveThinkingProfile,
		isModernModelRef: ({ modelId }) => isModernXaiModel(modelId),
		classifyFailoverReason: ({ errorMessage }) => classifyXaiFailoverReason(errorMessage)
	},
	register(api) {
		api.registerWebSearchProvider(createXaiWebSearchProvider());
		api.registerMediaUnderstandingProvider(buildXaiMediaUnderstandingProvider());
		api.registerVideoGenerationProvider(buildXaiVideoGenerationProvider());
		api.registerImageGenerationProvider(buildXaiImageGenerationProvider());
		api.registerSpeechProvider(buildXaiSpeechProvider());
		api.registerRealtimeTranscriptionProvider(buildXaiRealtimeTranscriptionProvider());
		api.registerRealtimeVoiceProvider(buildXaiRealtimeVoiceProvider());
		api.registerTool((ctx) => createLazyCodeExecutionTool(ctx), { name: "code_execution" });
		api.registerTool((ctx) => createLazyXSearchTool(ctx), { name: "x_search" });
	}
});
//#endregion
export { xai_default as default };
