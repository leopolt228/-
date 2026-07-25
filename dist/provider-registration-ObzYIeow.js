import { t as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-CLvbHQd1.js";
import "./provider-auth-api-key-BQ2VVO36.js";
import { n as normalizeGoogleModelId } from "./model-id-CAmKILzd.js";
import { l as isGoogleVertexBaseUrl, r as resolveGoogleGenerativeAiTransport, t as normalizeGoogleProviderConfig } from "./provider-policy-DagFxEZx.js";
import { t as GOOGLE_GEMINI_PROVIDER_HOOKS } from "./provider-hooks-DOJ2-75r.js";
import { n as resolveGoogleGeminiForwardCompatModel, t as isModernGoogleModel } from "./provider-models-Bi0_aJuT.js";
import { n as applyGoogleGeminiModelDefault, t as GOOGLE_GEMINI_DEFAULT_MODEL } from "./onboard-mKRfw6Ag.js";
import { n as buildGoogleVertexStaticCatalogProvider, t as buildGoogleStaticCatalogProvider } from "./provider-catalog-C8tQt0Jl.js";
import { r as resolveGoogleVertexConfigApiKey } from "./vertex-adc-CqpQnkCT.js";
import { n as createGoogleGenerativeAiTransportStreamFn, r as createGoogleVertexTransportStreamFn } from "./transport-stream-D-KC2lP4.js";
//#region extensions/google/provider-registration.ts
function resolveGoogleReasoningOutputMode(ctx) {
	if (ctx.provider === "google" || ctx.provider === "google-vertex") {
		const api = ctx.model?.api ?? ctx.modelApi;
		if (!api || api === "google-generative-ai" || api === "google-vertex") return "native";
	}
	return "tagged";
}
function buildGoogleProvider() {
	return {
		id: "google",
		label: "Google AI Studio",
		docsPath: "/providers/models",
		hookAliases: ["google-antigravity", "google-vertex"],
		envVars: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
		auth: [createProviderApiKeyAuthMethod({
			providerId: "google",
			methodId: "api-key",
			label: "Google Gemini API key",
			hint: "Free API key from aistudio.google.com/apikey",
			optionKey: "geminiApiKey",
			flagName: "--gemini-api-key",
			envVar: "GEMINI_API_KEY",
			promptMessage: "Enter Gemini API key",
			defaultModel: GOOGLE_GEMINI_DEFAULT_MODEL,
			expectedProviders: ["google"],
			applyConfig: (cfg) => applyGoogleGeminiModelDefault(cfg).next,
			wizard: {
				choiceId: "gemini-api-key",
				choiceLabel: "Google Gemini API key",
				groupId: "google",
				groupLabel: "Google",
				groupHint: "Gemini API key + OAuth"
			}
		})],
		normalizeTransport: ({ provider, api, baseUrl }) => resolveGoogleGenerativeAiTransport({
			provider,
			api,
			baseUrl
		}),
		normalizeConfig: ({ provider, providerConfig }) => normalizeGoogleProviderConfig(provider, providerConfig),
		resolveConfigApiKey: ({ provider, env }) => provider === "google-vertex" ? resolveGoogleVertexConfigApiKey(env) : void 0,
		staticCatalog: {
			order: "simple",
			run: async () => ({ providers: {
				google: buildGoogleStaticCatalogProvider(),
				"google-vertex": buildGoogleVertexStaticCatalogProvider()
			} })
		},
		normalizeModelId: ({ modelId }) => normalizeGoogleModelId(modelId),
		resolveDynamicModel: (ctx) => resolveGoogleGeminiForwardCompatModel({
			providerId: ctx.provider,
			ctx
		}),
		createStreamFn: ({ model }) => {
			if (model.api === "google-vertex" || model.api === "google-generative-ai" && (model.provider === "google-vertex" || isGoogleVertexBaseUrl(model.baseUrl))) return createGoogleVertexTransportStreamFn();
			if (model.api === "google-generative-ai") return createGoogleGenerativeAiTransportStreamFn();
		},
		...GOOGLE_GEMINI_PROVIDER_HOOKS,
		resolveReasoningOutputMode: resolveGoogleReasoningOutputMode,
		isModernModelRef: ({ modelId }) => isModernGoogleModel(modelId)
	};
}
function registerGoogleProvider(api) {
	api.registerProvider(buildGoogleProvider());
}
//#endregion
export { registerGoogleProvider as n, buildGoogleProvider as t };
