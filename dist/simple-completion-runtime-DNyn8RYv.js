import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CrBA-6Gx.js";
import { a as resolveAgentDir } from "./agent-scope-config-S7z_Yn4H.js";
import { E as buildProviderModelAuthSourcePlan, T as buildProviderModelAuthDirectSource, g as selectOpenAIModelRouteAuth, h as resolveOpenAIModelRoutes, i as isOpenAIProvider, n as OPENAI_PROVIDER_ID } from "./openai-routing-Cq9SwNpx.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { t as resolveAgentHarnessPolicy } from "./policy-CZpNJ432.js";
import "./defaults-CdX9UGcX.js";
import { l as resolveClaudeSonnet5ModelIdentity } from "./src-BnQDOjpw.js";
import { S as resolveModelRefFromString, i as buildModelAliasIndex } from "./model-selection-shared-CPPxIJAX.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-CV4VBWUf.js";
import { t as protectPreparedProviderRuntimeAuth } from "./provider-secret-egress-BC9ES6v4.js";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-DrrUROfX.js";
import { f as wrapProviderSimpleCompletionStreamFn } from "./provider-hook-runtime-D3TqXLuP.js";
import "./provider-runtime-BE5KxvKF.js";
import { i as ensureAuthProfileStore } from "./store-BTcmQtbp.js";
import { i as prepareProviderRuntimeAuth } from "./provider-runtime.runtime.js";
import { g as getModelRegistryRuntime } from "./sessions-Coo3M9oK.js";
import { a as bindModelLlmRuntime, n as completeSimple, s as getModelLlmRuntime } from "./stream-CKgZbNR4.js";
import "./model-selection-Dx2ArePR.js";
import { r as formatMissingAuthError } from "./model-auth-runtime-shared-BVzqP6NP.js";
import { f as resolveApiKeyForProvider, n as applyLocalNoAuthHeaderOverride, o as getApiKeyForModel, r as applySecretRefHeaderSentinels } from "./model-auth-919iJVmy.js";
import { t as buildAgentRuntimeAuthPlan } from "./auth-DO-YLivZ.js";
import { o as fingerprintResolvedProviderAuth, t as fingerprintAuthProfileCredential } from "./execution-auth-binding-CmucNoqo.js";
import { r as resolveModelAsync } from "./model-CQuJLPwU.js";
import { t as materializePreparedRuntimeModel } from "./materialize-model-YlD3OH5m.js";
import { a as prepareTransportAwareSimpleModel, c as ensureCustomApiRegistered, i as createOpenClawTransportStreamFnForModel, n as buildTransportAwareSimpleStreamFn, o as resolveTransportAwareSimpleApi, t as registerProviderStreamForModel } from "./provider-stream-Db8L3_Bq.js";
import { C as sanitizeGoogleThinkingPayload, k as streamWithPayloadPatch } from "./provider-stream-shared-BiURRLUJ.js";
import { t as createAnthropicVertexStreamFnForModel } from "./anthropic-vertex-stream-CcsVN0mB.js";
import { n as resolveUtilityModelRefForAgent } from "./utility-model-Fw1rnMGN.js";
import { supportsOpenAIReasoningEffort } from "@openclaw/ai/internal/openai";
import { clampThinkingLevel, defaultApiRegistry } from "@openclaw/ai/internal/runtime";
//#region src/agents/simple-completion-scope.ts
const workspaceByResolver = /* @__PURE__ */ new WeakMap();
/** Keep request-local workspace scope without growing the public completion SDK signature. */
function bindSimpleCompletionModelResolverWorkspace(resolver, workspaceDir) {
	const scopedResolver = (provider, modelId, agentDir, cfg, options) => resolver(provider, modelId, agentDir, cfg, options);
	workspaceByResolver.set(scopedResolver, workspaceDir);
	return scopedResolver;
}
function resolveSimpleCompletionModelResolverWorkspace(resolver) {
	return resolver ? workspaceByResolver.get(resolver) : void 0;
}
//#endregion
//#region src/agents/google-simple-completion-stream.ts
/**
* Google simple-completion stream adapter.
*
* This registers a patched Google stream API that keeps the normal Google
* backend but sanitizes unsupported thinking payload options for simple models.
*/
/** Custom API id for the Google simple-completion stream adapter. */
const GOOGLE_SIMPLE_COMPLETION_API = "openclaw-google-generative-ai-simple";
const SOURCE_API = "google-generative-ai";
function resolveGoogleSimpleThinkingLevel(model, reasoning) {
	switch (reasoning) {
		case "adaptive": return reasoning;
		case "off":
		case "minimal":
		case "low":
		case "medium":
		case "high":
		case "max":
		case "xhigh": return clampThinkingLevel(model, reasoning);
		default: return;
	}
}
function buildGoogleSimpleCompletionStreamFn(registry) {
	return (model, context, options) => {
		const googleModel = {
			...model,
			api: SOURCE_API
		};
		const sourceProvider = registry.getApiProvider(SOURCE_API);
		if (!sourceProvider) throw new Error(`No API provider registered for api: ${SOURCE_API}`);
		return streamWithPayloadPatch(sourceProvider.streamSimple, googleModel, context, options, (payload) => {
			sanitizeGoogleThinkingPayload({
				payload,
				modelId: model.id,
				thinkingLevel: resolveGoogleSimpleThinkingLevel(googleModel, options?.reasoning)
			});
		});
	};
}
/** Rewrites Google generative-ai models to the simple-completion adapter when needed. */
function prepareGoogleSimpleCompletionModel(registry, model) {
	if (model.api !== SOURCE_API) return model;
	ensureCustomApiRegistered(registry, GOOGLE_SIMPLE_COMPLETION_API, buildGoogleSimpleCompletionStreamFn(registry));
	return {
		...model,
		api: GOOGLE_SIMPLE_COMPLETION_API
	};
}
//#endregion
//#region src/agents/simple-completion-transport.ts
const PROVIDER_SIMPLE_COMPLETION_API_PREFIX = "openclaw-provider-simple:";
function resolveAnthropicVertexSimpleApi(baseUrl) {
	return `openclaw-anthropic-vertex-simple:${baseUrl?.trim() ? encodeURIComponent(baseUrl.trim()) : "default"}`;
}
function normalizeCodexResponsesBaseUrlForOpenAISdk(baseUrl) {
	const normalized = baseUrl?.trim().replace(/\/+$/u, "") || "https://chatgpt.com/backend-api";
	try {
		const parsed = new URL(normalized);
		const path = parsed.pathname.replace(/\/+$/u, "").toLowerCase();
		if (parsed.hostname.toLowerCase() === "chatgpt.com" && [
			"/backend-api",
			"/backend-api/v1",
			"/backend-api/codex",
			"/backend-api/codex/v1",
			"/backend-api/codex/responses"
		].includes(path)) {
			parsed.pathname = "/backend-api/codex";
			parsed.search = "";
			parsed.hash = "";
			return parsed.toString().replace(/\/$/u, "");
		}
	} catch {}
	if (normalized.endsWith("/codex/responses")) return normalized.slice(0, -10);
	if (normalized.endsWith("/codex")) return normalized;
	return `${normalized}/codex`;
}
function resolveProviderSimpleCompletionApi(model) {
	const parts = [
		model.provider,
		model.id,
		model.api,
		model.baseUrl || "default"
	];
	return `${PROVIDER_SIMPLE_COMPLETION_API_PREFIX}${parts.map((part) => encodeURIComponent(part)).join(":")}`;
}
function applyProviderSimpleCompletionWrapper(registry, model, cfg) {
	if (model.api.startsWith(PROVIDER_SIMPLE_COMPLETION_API_PREFIX)) return model;
	const sourceProvider = registry.getApiProvider(model.api);
	if (!sourceProvider) return model;
	const sourceApi = model.api;
	const sourceStreamFn = (runtimeModel, context, options) => sourceProvider.streamSimple({
		...runtimeModel,
		api: sourceApi
	}, context, options);
	const streamFn = wrapProviderSimpleCompletionStreamFn({
		provider: model.provider,
		config: cfg,
		context: {
			config: cfg,
			provider: model.provider,
			modelId: model.id,
			model,
			streamFn: sourceStreamFn
		}
	});
	if (!streamFn) return model;
	const api = resolveProviderSimpleCompletionApi(model);
	ensureCustomApiRegistered(registry, api, streamFn);
	return {
		...model,
		api
	};
}
function prepareCodexSimpleTransportModel(registry, model, cfg) {
	if (model.provider !== "openai" || model.api !== "openai-chatgpt-responses") return;
	const transportModel = {
		...model,
		baseUrl: normalizeCodexResponsesBaseUrlForOpenAISdk(model.baseUrl)
	};
	const api = resolveTransportAwareSimpleApi(model.api);
	const streamFn = createOpenClawTransportStreamFnForModel(transportModel, { cfg });
	if (!api || !streamFn) return;
	ensureCustomApiRegistered(registry, api, streamFn);
	return {
		...transportModel,
		api
	};
}
function prepareModelForSimpleCompletion(params) {
	const { apiRegistry, model, cfg } = params;
	if (!apiRegistry.getApiProvider(model.api) && registerProviderStreamForModel({
		model,
		cfg,
		apiRegistry
	})) return applyProviderSimpleCompletionWrapper(apiRegistry, model, cfg);
	const codexTransportModel = prepareCodexSimpleTransportModel(apiRegistry, model, cfg);
	if (codexTransportModel) return applyProviderSimpleCompletionWrapper(apiRegistry, codexTransportModel, cfg);
	const transportAwareModel = prepareTransportAwareSimpleModel(model, { cfg });
	if (transportAwareModel !== model) {
		const streamFn = buildTransportAwareSimpleStreamFn(model, { cfg });
		if (streamFn) {
			ensureCustomApiRegistered(apiRegistry, transportAwareModel.api, streamFn);
			return applyProviderSimpleCompletionWrapper(apiRegistry, transportAwareModel, cfg);
		}
	}
	if (model.api === "google-generative-ai") return applyProviderSimpleCompletionWrapper(apiRegistry, prepareGoogleSimpleCompletionModel(apiRegistry, model), cfg);
	if (model.provider === "anthropic-vertex") {
		const api = resolveAnthropicVertexSimpleApi(model.baseUrl);
		ensureCustomApiRegistered(apiRegistry, api, createAnthropicVertexStreamFnForModel(model));
		return applyProviderSimpleCompletionWrapper(apiRegistry, {
			...model,
			api
		}, cfg);
	}
	return applyProviderSimpleCompletionWrapper(apiRegistry, model, cfg);
}
//#endregion
//#region src/agents/simple-completion-runtime.ts
function resolveSimpleCompletionSelectionForAgent(params) {
	const fallbackRef = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const modelRef = params.modelRef?.trim() || (params.useUtilityModel ? resolveUtilityModelRefForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		primaryProvider: fallbackRef.provider
	}) : void 0) || resolveAgentEffectiveModelPrimary(params.cfg, params.agentId);
	const split = modelRef ? splitTrailingAuthProfile(modelRef) : null;
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: fallbackRef.provider || "openai"
	});
	const resolved = split ? resolveModelRefFromString({
		raw: split.model,
		defaultProvider: fallbackRef.provider || "openai",
		aliasIndex
	}) : null;
	const provider = resolved?.ref.provider ?? fallbackRef.provider;
	const modelId = resolved?.ref.model ?? fallbackRef.model;
	if (!provider || !modelId) return null;
	return {
		provider,
		modelId,
		...resolveSimpleCompletionRuntimeProvider({
			cfg: params.cfg,
			agentId: params.agentId,
			provider,
			modelId
		}),
		profileId: split?.profile || void 0,
		agentDir: params.agentDir?.trim() || resolveAgentDir(params.cfg, params.agentId)
	};
}
function resolveSimpleCompletionRuntimeProvider(params) {
	if (!isOpenAIProvider(params.provider)) return {};
	return resolveAgentHarnessPolicy({
		provider: params.provider,
		modelId: params.modelId,
		config: params.cfg,
		agentId: params.agentId
	}).runtime === "codex" ? { runtimeProvider: OPENAI_PROVIDER_ID } : {};
}
async function setRuntimeApiKeyForCompletion(params) {
	const preparedAuth = protectPreparedProviderRuntimeAuth({
		provider: params.model.provider,
		preparedAuth: await prepareProviderRuntimeAuth({
			provider: params.model.provider,
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			env: process.env,
			context: {
				config: params.cfg,
				workspaceDir: params.workspaceDir,
				env: process.env,
				provider: params.model.provider,
				modelId: params.model.id,
				model: params.model,
				apiKey: params.apiKey,
				authMode: params.authMode,
				profileId: params.profileId
			}
		})
	});
	const runtimeApiKey = preparedAuth?.apiKey?.trim() || params.apiKey;
	params.authStorage.setRuntimeApiKey(params.model.provider, runtimeApiKey);
	return {
		apiKey: runtimeApiKey,
		model: applyPreparedRuntimeAuthToModel(params.model, preparedAuth)
	};
}
function hasMissingApiKeyAllowance(params) {
	return Boolean(params.allowMissingApiKeyModes?.includes(params.mode));
}
async function prepareSimpleCompletionModel(params) {
	const workspaceDir = resolveSimpleCompletionModelResolverWorkspace(params.modelResolver);
	const resolved = await (params.modelResolver ?? resolveModelAsync)(params.provider, params.modelId, params.agentDir, params.cfg, {
		...params.agentId ? { agentId: params.agentId } : {},
		...params.allowBundledStaticCatalogFallback !== void 0 ? { allowBundledStaticCatalogFallback: params.allowBundledStaticCatalogFallback } : {},
		...params.skipAgentDiscovery ? { skipAgentDiscovery: true } : {},
		workspaceDir,
		authProfileId: params.profileId,
		preferredProfile: params.preferredProfile
	});
	if (!resolved.model) return { error: resolved.error ?? `Unknown model: ${params.provider}/${params.modelId}` };
	const initialModel = resolved.model;
	let resolvedModel = initialModel;
	const routeResolution = resolveOpenAIModelRoutes({
		provider: initialModel.provider,
		modelId: initialModel.id,
		api: initialModel.api,
		baseUrl: initialModel.baseUrl,
		config: params.cfg,
		env: process.env
	});
	const resolvesAuthBeforePhysicalRoute = routeResolution?.kind === "routes" && routeResolution.routes.length > 1;
	let auth;
	const authStore = params.bindAuthOwner ? ensureAuthProfileStore(params.agentDir, {
		readOnly: true,
		allowKeychainPrompt: false,
		config: params.cfg
	}) : void 0;
	try {
		auth = resolvesAuthBeforePhysicalRoute ? await resolveApiKeyForProvider({
			provider: initialModel.provider,
			cfg: params.cfg,
			agentDir: params.agentDir,
			workspaceDir,
			profileId: params.profileId,
			preferredProfile: params.preferredProfile,
			...authStore ? { store: authStore } : {},
			...params.bindAuthOwner && params.profileId ? { lockedProfile: true } : {},
			modelId: initialModel.id,
			secretSentinels: true
		}) : await getApiKeyForModel({
			model: initialModel,
			cfg: params.cfg,
			agentDir: params.agentDir,
			workspaceDir,
			profileId: params.profileId,
			preferredProfile: params.preferredProfile,
			...authStore ? { store: authStore } : {},
			...params.bindAuthOwner && params.profileId ? { lockedProfile: true } : {},
			secretSentinels: true
		});
		if (routeResolution?.kind === "routes") {
			const routeAuthDecision = selectOpenAIModelRouteAuth({
				resolution: routeResolution,
				sourcePlan: buildProviderModelAuthSourcePlan({
					ownership: {
						reason: "provider-binding",
						source: auth.profileId ? {
							kind: "profile",
							profileId: auth.profileId,
							provider: initialModel.provider,
							mode: auth.mode,
							readiness: "ready",
							cooldown: "clear"
						} : buildProviderModelAuthDirectSource({
							mode: auth.mode,
							availability: true,
							evidence: "runtime"
						})
					},
					profiles: []
				})
			});
			if (routeAuthDecision.kind !== "selected") throw new Error(routeAuthDecision.kind === "rejected" ? routeAuthDecision.message : "OpenAI route selection unexpectedly deferred after auth was resolved.");
			const route = routeAuthDecision.selection.route;
			resolvedModel = await materializePreparedRuntimeModel({
				plan: buildAgentRuntimeAuthPlan({
					provider: initialModel.provider,
					modelId: initialModel.id,
					authProfileProvider: initialModel.provider,
					authProfileMode: auth.mode,
					sessionAuthProfileId: auth.profileId,
					sessionAuthProfileSource: params.profileId ? "user" : "auto",
					modelRoute: {
						provider: initialModel.provider,
						modelId: initialModel.id,
						api: route.api,
						baseUrl: route.baseUrl,
						authRequirement: route.authRequirement,
						requestTransportOverrides: route.requestTransportOverrides,
						runtimePolicy: route.runtimePolicy
					},
					config: params.cfg,
					workspaceDir
				}),
				provider: initialModel.provider,
				modelId: initialModel.id,
				config: params.cfg,
				model: initialModel,
				resolveModel: ({ config, authProfileId, authProfileMode }) => (params.modelResolver ?? resolveModelAsync)(initialModel.provider, initialModel.id, params.agentDir, config, {
					authStorage: resolved.authStorage,
					modelRegistry: resolved.modelRegistry,
					skipAgentDiscovery: true,
					allowBundledStaticCatalogFallback: true,
					preferBundledStaticCatalogTransport: true,
					workspaceDir,
					authProfileId,
					authProfileMode
				})
			}) ?? initialModel;
			if (resolvesAuthBeforePhysicalRoute) auth = await getApiKeyForModel({
				model: resolvedModel,
				cfg: params.cfg,
				agentDir: params.agentDir,
				workspaceDir,
				profileId: auth.profileId,
				preferredProfile: params.preferredProfile,
				...authStore ? { store: authStore } : {},
				...params.bindAuthOwner && params.profileId ? { lockedProfile: true } : {},
				secretSentinels: true
			});
		}
	} catch (err) {
		return { error: `Auth lookup failed for provider "${initialModel.provider}": ${formatErrorMessage(err)}` };
	}
	const rawApiKey = auth.apiKey?.trim();
	if (!rawApiKey && !hasMissingApiKeyAllowance({
		mode: auth.mode,
		allowMissingApiKeyModes: params.allowMissingApiKeyModes
	})) return {
		error: formatMissingAuthError(auth, resolvedModel.provider),
		auth
	};
	let authValue = rawApiKey;
	if (rawApiKey) {
		const runtimeCredential = await setRuntimeApiKeyForCompletion({
			authStorage: resolved.authStorage,
			model: resolvedModel,
			apiKey: rawApiKey,
			authMode: auth.mode,
			cfg: params.cfg,
			workspaceDir: workspaceDir ?? params.agentDir,
			profileId: auth.profileId
		});
		authValue = runtimeCredential.apiKey;
		resolvedModel = runtimeCredential.model;
	}
	const resolvedAuth = {
		...auth,
		apiKey: authValue
	};
	const profileCredential = params.profileId ? authStore?.profiles[params.profileId] : void 0;
	const sourceAuthFingerprint = params.bindAuthOwner ? profileCredential?.type === "oauth" && params.profileId ? fingerprintAuthProfileCredential({
		profileId: params.profileId,
		credential: profileCredential
	}) : fingerprintResolvedProviderAuth(auth) : void 0;
	const modelRuntime = getModelRegistryRuntime(resolved.modelRegistry);
	return {
		model: bindModelLlmRuntime(applySecretRefHeaderSentinels(applyLocalNoAuthHeaderOverride(resolvedModel, resolvedAuth), params.cfg), modelRuntime.llmRuntime),
		auth: resolvedAuth,
		...sourceAuthFingerprint ? { sourceAuthFingerprint } : {}
	};
}
async function prepareSimpleCompletionModelForAgent(params) {
	const selection = resolveSimpleCompletionSelectionForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir,
		modelRef: params.modelRef,
		useUtilityModel: params.useUtilityModel
	});
	if (!selection) return { error: `No model configured for agent ${params.agentId}.` };
	const prepared = await prepareSimpleCompletionModel({
		cfg: params.cfg,
		agentId: params.agentId,
		provider: selection.runtimeProvider ?? selection.provider,
		modelId: selection.modelId,
		agentDir: selection.agentDir,
		profileId: selection.profileId,
		preferredProfile: params.preferredProfile,
		allowMissingApiKeyModes: params.allowMissingApiKeyModes,
		...params.allowBundledStaticCatalogFallback !== void 0 ? { allowBundledStaticCatalogFallback: params.allowBundledStaticCatalogFallback } : {},
		useAsyncModelResolution: params.useAsyncModelResolution,
		skipAgentDiscovery: params.skipAgentDiscovery,
		bindAuthOwner: params.bindAuthOwner,
		modelResolver: params.modelResolver
	});
	if ("error" in prepared) return {
		...prepared,
		selection
	};
	return {
		selection,
		model: prepared.model,
		auth: prepared.auth,
		...prepared.sourceAuthFingerprint ? { sourceAuthFingerprint: prepared.sourceAuthFingerprint } : {}
	};
}
async function completeWithPreparedSimpleCompletionModel(params) {
	const runtime = getModelLlmRuntime(params.model);
	let completionModel = prepareModelForSimpleCompletion({
		apiRegistry: runtime?.registry ?? defaultApiRegistry,
		model: params.model,
		cfg: params.cfg
	});
	if (runtime) completionModel = bindModelLlmRuntime(completionModel, runtime);
	const { reasoning: rawReasoning, ...options } = params.options ?? {};
	const reasoning = normalizeSimpleCompletionReasoning(rawReasoning, completionModel);
	return await completeSimple(completionModel, params.context, {
		...options,
		...reasoning ? { reasoning } : {},
		apiKey: params.auth.apiKey
	});
}
function normalizeSimpleCompletionReasoning(reasoning, model) {
	switch (reasoning) {
		case void 0: return;
		case "off": return resolveClaudeSonnet5ModelIdentity(model) ? "off" : void 0;
		case "adaptive": return "medium";
		case "ultra":
		case "max": return isOpenAIProvider(model.provider) && supportsOpenAIReasoningEffort(model, "max") ? "max" : "xhigh";
		default: return reasoning;
	}
}
//#endregion
export { normalizeCodexResponsesBaseUrlForOpenAISdk as a, resolveSimpleCompletionSelectionForAgent as i, prepareSimpleCompletionModel as n, bindSimpleCompletionModelResolverWorkspace as o, prepareSimpleCompletionModelForAgent as r, completeWithPreparedSimpleCompletionModel as t };
