import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { p as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-Crk_c9KW.js";
import { t as modelKey } from "./model-key-BaNhQShd.js";
import "./agent-scope-CrBA-6Gx.js";
import { s as resolveDefaultAgentDir } from "./agent-scope-config-S7z_Yn4H.js";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime, r as canonicalizeOpenAIModelId } from "./openai-routing-Cq9SwNpx.js";
import { t as resolveAgentHarnessPolicy } from "./policy-CZpNJ432.js";
import "./defaults-CdX9UGcX.js";
import { r as normalizeStaticProviderModelId } from "./model-ref-shared-BlCyhiC_.js";
import { n as findNormalizedProviderValue, o as normalizeProviderId } from "./model-selection-normalize-D7Dhjaxs.js";
import { n as attachModelProviderRequestTransport, s as resolveProviderRequestConfig, u as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-DrrUROfX.js";
import { I as runProviderDynamicModel, g as normalizeProviderResolvedModelWithPlugin, r as applyProviderResolvedTransportWithPlugin, s as buildProviderUnknownModelHintWithPlugin, v as normalizeProviderTransportWithPlugin, y as prepareProviderDynamicModel, z as shouldPreferProviderRuntimeResolvedModel } from "./provider-runtime-BE5KxvKF.js";
import { i as ensureAuthProfileStore } from "./store-BTcmQtbp.js";
import { a as normalizeModelCompat } from "./provider-model-compat-0eNk_A0D.js";
import { i as resolveAuthProfileOrder } from "./order-FUfwr_5s.js";
import { a as loadPreparedModelRuntimeSnapshot, i as getPreparedModelRuntimeSnapshot } from "./prepared-model-runtime-CrzRpeq_.js";
import { D as resolveModelWorkspaceDir, h as ModelRegistry, y as AuthStorage } from "./sessions-Coo3M9oK.js";
import { t as attachModelProviderLocalService } from "./provider-local-service-BuXibLi1.js";
import "./model-selection-Dx2ArePR.js";
import { a as resolveBundledProviderStaticCatalogModel, c as buildInlineProviderModels, d as sanitizeModelHeaders, l as normalizeResolvedTransportApi, o as resolveBundledStaticCatalogModel, s as resolveManifestModelCatalogProviderAliasMetadata, u as resolveProviderModelInput } from "./model.static-catalog-CkdQf8Mx.js";
import "./auth-profiles-D9OcwMed.js";
import { a as shouldUnconditionallySuppress, n as buildSuppressedBuiltInModelError, r as shouldSuppressBuiltInModel } from "./model-suppression-h3gy_GVA.js";
//#region src/agents/embedded-agent-runner/model.compat.ts
function mergeModelMediaInput(base, override) {
	if (!base) return override;
	if (!override) return base;
	return {
		...base,
		...override,
		image: base.image || override.image ? {
			...base.image,
			...override.image
		} : void 0
	};
}
function resolveConfiguredFallbackReasoning(params) {
	return resolveConfiguredModelReasoning(params) ?? false;
}
function resolveConfiguredModelReasoning(params) {
	if (params.reasoning !== void 0) return params.reasoning;
	return isVllmQwenThinkingCompat(params) ? true : void 0;
}
function resolveMergedConfiguredModelReasoning(params) {
	if (params.configuredReasoning !== void 0) return params.configuredReasoning;
	if (isVllmQwenThinkingCompat({
		provider: params.provider,
		compat: params.configuredCompat
	})) return true;
	return resolveConfiguredModelReasoning({
		provider: params.provider,
		compat: params.resolvedCompat,
		reasoning: params.discoveredReasoning
	}) ?? false;
}
function isVllmQwenThinkingCompat(params) {
	const thinkingFormat = readCompatThinkingFormat(params.compat);
	return normalizeProviderId(params.provider) === "vllm" && (thinkingFormat === "qwen" || thinkingFormat === "qwen-chat-template");
}
function readCompatThinkingFormat(compat) {
	if (!compat || typeof compat !== "object" || Array.isArray(compat)) return;
	const thinkingFormat = compat.thinkingFormat;
	return typeof thinkingFormat === "string" ? thinkingFormat : void 0;
}
function mergeModelCompat(base, override) {
	if (!base) return override;
	if (!override) return base;
	return {
		...base,
		...override
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/model.provider-normalization.ts
/**
* Applies provider compatibility normalization to a resolved model record.
*/
function normalizeResolvedProviderModel(params) {
	return normalizeModelCompat(params.model);
}
//#endregion
//#region src/agents/embedded-agent-runner/model.ts
/**
* Resolves embedded-agent provider/model selections from config, registry, and catalogs.
*/
const TARGET_PROVIDER_RUNTIME_HOOKS = {
	buildProviderUnknownModelHintWithPlugin,
	prepareProviderDynamicModel,
	runProviderDynamicModel,
	shouldPreferProviderRuntimeResolvedModel,
	normalizeProviderResolvedModelWithPlugin,
	applyProviderResolvedTransportWithPlugin: () => void 0,
	normalizeProviderTransportWithPlugin: () => void 0
};
const DEFAULT_PROVIDER_RUNTIME_HOOKS = {
	...TARGET_PROVIDER_RUNTIME_HOOKS,
	applyProviderResolvedTransportWithPlugin,
	normalizeProviderTransportWithPlugin
};
const STATIC_PROVIDER_RUNTIME_HOOKS = {
	applyProviderResolvedTransportWithPlugin: () => void 0,
	buildProviderUnknownModelHintWithPlugin: () => void 0,
	prepareProviderDynamicModel: async () => {},
	runProviderDynamicModel: () => void 0,
	normalizeProviderResolvedModelWithPlugin: () => void 0,
	normalizeProviderTransportWithPlugin: () => void 0
};
const SKIP_AGENT_DISCOVERY_PROVIDER_RUNTIME_HOOKS = { ...TARGET_PROVIDER_RUNTIME_HOOKS };
/** Creates isolated model/auth stores for harnesses that own model discovery themselves. */
function createEmptyAgentDiscoveryStores() {
	const authStorage = typeof AuthStorage.inMemory === "function" ? AuthStorage.inMemory({}) : AuthStorage.create();
	return {
		authStorage,
		modelRegistry: typeof ModelRegistry.inMemory === "function" ? ModelRegistry.inMemory(authStorage) : ModelRegistry.create(authStorage)
	};
}
function resolveRuntimeHooks(params) {
	if (params?.skipProviderRuntimeHooks) return STATIC_PROVIDER_RUNTIME_HOOKS;
	if (params?.runtimeHooks) return params.runtimeHooks;
	if (params?.skipAgentDiscovery) return SKIP_AGENT_DISCOVERY_PROVIDER_RUNTIME_HOOKS;
	return DEFAULT_PROVIDER_RUNTIME_HOOKS;
}
function resolvePreparedAgentSnapshot(resolvedAgentDir, cfg, explicitWorkspaceDir, derivedWorkspaceDir, agentId) {
	const base = {
		...agentId ? { agentId } : {},
		agentDir: resolvedAgentDir,
		config: cfg ?? {},
		inheritedAuthDir: resolveDefaultAgentDir(cfg ?? {})
	};
	const published = getPreparedModelRuntimeSnapshot({
		...base,
		...explicitWorkspaceDir ? { workspaceDir: explicitWorkspaceDir } : {}
	});
	if (published || explicitWorkspaceDir || !derivedWorkspaceDir) return published;
	return getPreparedModelRuntimeSnapshot({
		...base,
		workspaceDir: derivedWorkspaceDir
	});
}
function canonicalizeLegacyResolvedModel(params) {
	const canonicalModelId = canonicalizeOpenAIModelId(params.provider, params.model.id);
	if (canonicalModelId === params.model.id) return params.model;
	return {
		...params.model,
		id: canonicalModelId,
		name: canonicalizeOpenAIModelId(params.provider, params.model.name) === canonicalModelId ? canonicalModelId : params.model.name
	};
}
function applyResolvedTransportFallback(params) {
	const normalized = params.runtimeHooks.normalizeProviderTransportWithPlugin({
		provider: params.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		modelId: params.model.id,
		context: {
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			provider: params.provider,
			modelId: params.model.id,
			api: params.model.api,
			baseUrl: params.model.baseUrl
		}
	});
	if (!normalized) return;
	const nextApi = normalizeResolvedTransportApi(normalized.api) ?? params.model.api;
	const nextBaseUrl = normalized.baseUrl ?? params.model.baseUrl;
	if (nextApi === params.model.api && nextBaseUrl === params.model.baseUrl) return;
	return {
		...params.model,
		api: nextApi,
		baseUrl: nextBaseUrl
	};
}
function normalizeResolvedModel(params) {
	const normalizeModelCost = (cost) => {
		if (!cost || typeof cost !== "object" || Array.isArray(cost)) return {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		};
		const record = cost;
		const input = typeof record.input === "number" && Number.isFinite(record.input) ? record.input : 0;
		const output = typeof record.output === "number" && Number.isFinite(record.output) ? record.output : 0;
		const cacheRead = typeof record.cacheRead === "number" && Number.isFinite(record.cacheRead) ? record.cacheRead : 0;
		const cacheWrite = typeof record.cacheWrite === "number" && Number.isFinite(record.cacheWrite) ? record.cacheWrite : 0;
		if (input === record.input && output === record.output && cacheRead === record.cacheRead && cacheWrite === record.cacheWrite) return record;
		return {
			...cost,
			input,
			output,
			cacheRead,
			cacheWrite
		};
	};
	const normalizedInputModel = {
		...params.model,
		input: resolveProviderModelInput({
			provider: params.provider,
			modelId: params.model.id,
			modelName: params.model.name,
			input: params.model.input
		}),
		cost: normalizeModelCost(params.model.cost)
	};
	const runtimeHooks = params.runtimeHooks ?? DEFAULT_PROVIDER_RUNTIME_HOOKS;
	const pluginNormalized = runtimeHooks.normalizeProviderResolvedModelWithPlugin({
		provider: params.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		context: {
			config: params.cfg,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			provider: params.provider,
			modelId: normalizedInputModel.id,
			model: normalizedInputModel
		}
	});
	const fallbackTransportNormalized = runtimeHooks.applyProviderResolvedTransportWithPlugin?.({
		provider: params.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		context: {
			config: params.cfg,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			provider: params.provider,
			modelId: normalizedInputModel.id,
			model: pluginNormalized ?? normalizedInputModel
		}
	}) ?? applyResolvedTransportFallback({
		provider: params.provider,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		runtimeHooks,
		model: pluginNormalized ?? normalizedInputModel
	});
	return canonicalizeLegacyResolvedModel({
		provider: params.provider,
		model: normalizeResolvedProviderModel({
			provider: params.provider,
			model: fallbackTransportNormalized ?? pluginNormalized ?? normalizedInputModel
		})
	});
}
function resolveProviderTransport(params) {
	const normalized = (params.runtimeHooks ?? DEFAULT_PROVIDER_RUNTIME_HOOKS).normalizeProviderTransportWithPlugin({
		provider: params.provider,
		...params.modelId ? { modelId: params.modelId } : {},
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		context: {
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			provider: params.provider,
			...params.modelId ? { modelId: params.modelId } : {},
			api: params.api,
			baseUrl: params.baseUrl
		}
	});
	return {
		api: normalizeResolvedTransportApi(normalized?.api ?? params.api),
		baseUrl: normalized?.baseUrl ?? params.baseUrl
	};
}
function resolveConfiguredProviderDefaultApi(params) {
	const { providerConfig } = params;
	const explicit = normalizeResolvedTransportApi(providerConfig?.api);
	if (explicit) return explicit;
	const providerConfiguredBaseUrl = normalizeTransportBaseUrl(providerConfig?.baseUrl);
	if (!providerConfiguredBaseUrl) return;
	return resolveProviderTransport({
		provider: params.provider,
		api: void 0,
		baseUrl: providerConfiguredBaseUrl,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		runtimeHooks: params.runtimeHooks
	}).api ?? "openai-completions";
}
function normalizeTransportBaseUrl(baseUrl) {
	if (typeof baseUrl !== "string") return;
	const trimmed = baseUrl.trim();
	return trimmed ? trimmed : void 0;
}
function resolveProviderRequestTimeoutMs(timeoutSeconds) {
	return finiteSecondsToTimerSafeMilliseconds(timeoutSeconds, { floorSeconds: true });
}
function matchesProviderScopedModelId(params) {
	const { candidateId, provider, modelId } = params;
	if (candidateId === modelId) return true;
	const slashIndex = candidateId?.indexOf("/") ?? -1;
	if (!candidateId || slashIndex <= 0) return false;
	const candidateProvider = candidateId.slice(0, slashIndex);
	return candidateId.slice(slashIndex + 1) === modelId && normalizeProviderId(candidateProvider) === normalizeProviderId(provider);
}
function findInlineModelMatch(params) {
	const matchesModelId = (entry) => matchesProviderScopedModelId({
		candidateId: entry.id,
		provider: entry.provider,
		modelId: params.modelId
	});
	const inlineModels = buildInlineProviderModels(params.providers);
	const exact = inlineModels.find((entry) => entry.provider === params.provider && matchesModelId(entry));
	if (exact) return exact;
	const normalizedProvider = normalizeProviderId(params.provider);
	return inlineModels.find((entry) => normalizeProviderId(entry.provider) === normalizedProvider && matchesModelId(entry));
}
function resolveConfiguredProviderConfig(cfg, provider) {
	const configuredProviders = cfg?.models?.providers;
	if (!configuredProviders) return;
	const exactProviderConfig = configuredProviders[provider];
	if (exactProviderConfig) return exactProviderConfig;
	return findNormalizedProviderValue(configuredProviders, provider);
}
function isModelsAddMetadataModel(params) {
	return params.model?.metadataSource === "models-add";
}
function findConfiguredProviderModel(providerConfig, provider, modelId) {
	return providerConfig?.models?.find((candidate) => matchesProviderScopedModelId({
		candidateId: candidate.id,
		provider,
		modelId
	}));
}
function mergeStaticCatalogInlineModel(staticCatalogModel, inlineModel) {
	if (!staticCatalogModel) return inlineModel;
	const compat = mergeModelCompat(staticCatalogModel.compat, inlineModel.compat);
	const mediaInput = mergeModelMediaInput(staticCatalogModel.mediaInput, inlineModel.mediaInput);
	const params = mergeModelParams(readModelParams(staticCatalogModel.params), readModelParams(inlineModel.params));
	return {
		...staticCatalogModel,
		...inlineModel,
		api: inlineModel.api ?? staticCatalogModel.api,
		baseUrl: normalizeTransportBaseUrl(inlineModel.baseUrl) ?? normalizeTransportBaseUrl(staticCatalogModel.baseUrl),
		headers: inlineModel.headers ?? staticCatalogModel.headers,
		...compat ? { compat } : {},
		...mediaInput ? { mediaInput } : {},
		...params ? { params } : {}
	};
}
function hasConfiguredFallbackSurface(params) {
	if (params.modelId.startsWith("mock-")) return true;
	if (params.configuredModel) return true;
	const baseUrl = params.providerConfig?.baseUrl?.trim();
	return Boolean(baseUrl);
}
function readModelParams(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	return value;
}
function mergeModelParams(...entries) {
	const merged = Object.assign({}, ...entries.filter(Boolean));
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function findConfiguredAgentModelParams(params) {
	const configuredModels = params.cfg?.agents?.defaults?.models;
	if (!configuredModels) return;
	const directKeys = [modelKey(params.provider, params.modelId), `${params.provider}/${params.modelId}`];
	for (const key of directKeys) {
		const direct = readModelParams(configuredModels[key]?.params);
		if (direct) return direct;
	}
	const normalizedProvider = normalizeProviderId(params.provider);
	const normalizedModelId = normalizeStaticProviderModelId(normalizedProvider, params.modelId).trim().toLowerCase();
	for (const [rawKey, entry] of Object.entries(configuredModels)) {
		const slashIndex = rawKey.indexOf("/");
		if (slashIndex <= 0) continue;
		const candidateProvider = rawKey.slice(0, slashIndex);
		const candidateModelId = rawKey.slice(slashIndex + 1);
		if (normalizeProviderId(candidateProvider) === normalizedProvider && normalizeStaticProviderModelId(normalizedProvider, candidateModelId).trim().toLowerCase() === normalizedModelId) return readModelParams(entry.params);
	}
}
function mergeConfiguredRuntimeModelParams(params) {
	return mergeModelParams(readModelParams(params.discoveredParams), readModelParams(params.providerParams), findConfiguredAgentModelParams({
		cfg: params.cfg,
		provider: params.provider,
		modelId: params.modelId
	}), readModelParams(params.configuredParams));
}
function markDiscoveredMaxTokensSource(model) {
	if (model.maxTokens === void 0 || model.maxTokensSource !== void 0) return model;
	return {
		...model,
		maxTokensSource: "discovered"
	};
}
function applyConfiguredProviderOverrides(params) {
	const { providerConfig, modelId } = params;
	const discoveredModel = markDiscoveredMaxTokensSource(params.discoveredModel);
	const manifestAliasTransport = params.manifestAlias.transport;
	const requestTimeoutMs = resolveProviderRequestTimeoutMs(providerConfig?.timeoutSeconds);
	const defaultModelParams = findConfiguredAgentModelParams({
		cfg: params.cfg,
		provider: params.provider,
		modelId
	});
	if (!providerConfig) {
		const resolvedParams = mergeModelParams(readModelParams(discoveredModel.params), defaultModelParams);
		const discoveredHeaders = sanitizeModelHeaders(discoveredModel.headers, { stripSecretRefMarkers: true });
		const aliasTransport = manifestAliasTransport ? resolveProviderTransport({
			provider: params.provider,
			modelId,
			api: manifestAliasTransport.api ?? discoveredModel.api,
			baseUrl: normalizeTransportBaseUrl(manifestAliasTransport.baseUrl) ?? discoveredModel.baseUrl,
			cfg: params.cfg,
			workspaceDir: params.workspaceDir,
			runtimeHooks: params.runtimeHooks
		}) : void 0;
		const requestConfig = resolveProviderRequestConfig({
			provider: params.provider,
			api: aliasTransport?.api ?? discoveredModel.api,
			baseUrl: aliasTransport?.baseUrl ?? discoveredModel.baseUrl,
			discoveredHeaders,
			capability: "llm",
			transport: "stream"
		});
		return {
			...discoveredModel,
			...manifestAliasTransport ? {
				provider: params.provider,
				api: requestConfig.api ?? discoveredModel.api,
				baseUrl: requestConfig.baseUrl ?? discoveredModel.baseUrl
			} : {},
			...resolvedParams ? { params: resolvedParams } : {},
			headers: requestConfig.headers
		};
	}
	const configuredModel = findConfiguredProviderModel(providerConfig, params.provider, modelId) ?? (discoveredModel.id !== modelId ? findConfiguredProviderModel(providerConfig, params.provider, discoveredModel.id) : void 0);
	const configuredStaticCatalogModel = configuredModel ? resolveBundledStaticCatalogModel({
		provider: params.provider,
		modelId,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		includeRuntimeDiscovery: true
	}) : void 0;
	const metadataOverrideModel = params.preferDiscoveredModelMetadata && isModelsAddMetadataModel({ model: configuredModel }) ? void 0 : configuredModel;
	const discoveredHeaders = sanitizeModelHeaders(discoveredModel.headers, { stripSecretRefMarkers: true });
	const providerHeaders = sanitizeModelHeaders(providerConfig.headers, { stripSecretRefMarkers: true });
	const providerRequest = sanitizeConfiguredModelProviderRequest(providerConfig.request);
	const configuredHeaders = sanitizeModelHeaders(configuredModel?.headers, { stripSecretRefMarkers: true });
	const providerParams = readModelParams(providerConfig.params);
	const passthroughRequestConfig = resolveProviderRequestConfig({
		provider: params.provider,
		api: discoveredModel.api,
		baseUrl: discoveredModel.baseUrl,
		discoveredHeaders,
		providerHeaders,
		modelHeaders: configuredHeaders,
		authHeader: providerConfig.authHeader,
		request: providerRequest,
		capability: "llm",
		transport: "stream"
	});
	if (!configuredModel && !providerConfig.baseUrl && !providerConfig.api && providerConfig.contextWindow === void 0 && providerConfig.contextTokens === void 0 && providerConfig.maxTokens === void 0 && requestTimeoutMs === void 0 && !providerHeaders && !providerRequest && !providerParams && !providerConfig.localService && !manifestAliasTransport) {
		const resolvedParams = mergeModelParams(readModelParams(discoveredModel.params), defaultModelParams);
		return {
			...discoveredModel,
			...resolvedParams ? { params: resolvedParams } : {},
			...requestTimeoutMs !== void 0 ? { requestTimeoutMs } : {},
			headers: passthroughRequestConfig.headers,
			...providerConfig.authHeader !== void 0 ? { authHeader: providerConfig.authHeader } : {}
		};
	}
	const resolvedParams = mergeModelParams(readModelParams(configuredStaticCatalogModel?.params), readModelParams(discoveredModel.params), providerParams, defaultModelParams, readModelParams(configuredModel?.params));
	const normalizedInput = resolveProviderModelInput({
		provider: params.provider,
		modelId,
		modelName: metadataOverrideModel?.name ?? discoveredModel.name,
		input: metadataOverrideModel?.input,
		fallbackInput: discoveredModel.input
	});
	const providerDefaultApi = resolveConfiguredProviderDefaultApi({
		provider: params.provider,
		providerConfig,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		runtimeHooks: params.runtimeHooks
	});
	const metadataOverrideBaseUrl = normalizeTransportBaseUrl(metadataOverrideModel?.baseUrl);
	const providerConfiguredBaseUrl = normalizeTransportBaseUrl(providerConfig.baseUrl);
	const discoveredBaseUrl = normalizeTransportBaseUrl(discoveredModel.baseUrl);
	const configuredStaticCatalogBaseUrl = normalizeTransportBaseUrl(configuredStaticCatalogModel?.baseUrl);
	const manifestAliasBaseUrl = normalizeTransportBaseUrl(manifestAliasTransport?.baseUrl);
	const preferDiscoveredTransport = params.preferDiscoveredTransport && !manifestAliasTransport;
	const resolvedTransportApi = preferDiscoveredTransport ? discoveredModel.api ?? metadataOverrideModel?.api ?? providerConfig.api ?? configuredStaticCatalogModel?.api ?? providerDefaultApi : metadataOverrideModel?.api ?? providerConfig.api ?? manifestAliasTransport?.api ?? discoveredModel.api ?? configuredStaticCatalogModel?.api ?? providerDefaultApi;
	const resolvedTransportBaseUrl = preferDiscoveredTransport ? discoveredBaseUrl ?? metadataOverrideBaseUrl ?? providerConfiguredBaseUrl ?? configuredStaticCatalogBaseUrl : metadataOverrideBaseUrl ?? providerConfiguredBaseUrl ?? manifestAliasBaseUrl ?? discoveredBaseUrl ?? configuredStaticCatalogBaseUrl;
	const resolvedTransport = resolveProviderTransport({
		provider: params.provider,
		modelId: discoveredModel.id,
		api: resolvedTransportApi,
		baseUrl: resolvedTransportBaseUrl,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		runtimeHooks: params.runtimeHooks
	});
	const resolvedContextWindow = metadataOverrideModel?.contextWindow ?? providerConfig.contextWindow;
	const configuredMaxTokens = metadataOverrideModel?.maxTokens ?? providerConfig.maxTokens;
	const resolvedMaxTokens = configuredMaxTokens ?? discoveredModel.maxTokens;
	const normalizedResolvedMaxTokens = typeof resolvedMaxTokens === "number" && Number.isFinite(resolvedMaxTokens) ? typeof resolvedContextWindow === "number" && Number.isFinite(resolvedContextWindow) ? Math.min(resolvedMaxTokens, resolvedContextWindow) : resolvedMaxTokens : void 0;
	const resolvedCompat = mergeModelCompat(mergeModelCompat(configuredStaticCatalogModel?.compat, discoveredModel.compat), metadataOverrideModel?.compat);
	const resolvedReasoning = resolveMergedConfiguredModelReasoning({
		provider: params.provider,
		configuredCompat: metadataOverrideModel?.compat,
		resolvedCompat,
		configuredReasoning: metadataOverrideModel?.reasoning,
		discoveredReasoning: discoveredModel.reasoning
	});
	const requestConfig = resolveProviderRequestConfig({
		provider: params.provider,
		api: resolvedTransport.api ?? normalizeResolvedTransportApi(configuredStaticCatalogModel?.api) ?? normalizeResolvedTransportApi(discoveredModel.api) ?? providerDefaultApi ?? "openai-responses",
		baseUrl: resolvedTransport.baseUrl ?? configuredStaticCatalogModel?.baseUrl ?? discoveredModel.baseUrl,
		discoveredHeaders,
		providerHeaders,
		modelHeaders: configuredHeaders,
		authHeader: providerConfig.authHeader,
		request: providerRequest,
		capability: "llm",
		transport: "stream"
	});
	return attachModelProviderLocalService(attachModelProviderRequestTransport({
		...discoveredModel,
		provider: params.provider,
		api: requestConfig.api ?? "openai-responses",
		baseUrl: requestConfig.baseUrl ?? discoveredModel.baseUrl,
		reasoning: resolvedReasoning,
		input: normalizedInput,
		cost: metadataOverrideModel?.cost ?? discoveredModel.cost,
		contextWindow: resolvedContextWindow ?? discoveredModel.contextWindow,
		contextTokens: metadataOverrideModel?.contextTokens ?? providerConfig.contextTokens ?? discoveredModel.contextTokens,
		...normalizedResolvedMaxTokens !== void 0 ? {
			maxTokens: normalizedResolvedMaxTokens,
			maxTokensSource: configuredMaxTokens !== void 0 ? "configured" : discoveredModel.maxTokensSource ?? "discovered"
		} : {},
		...resolvedParams ? { params: resolvedParams } : {},
		...requestTimeoutMs !== void 0 ? { requestTimeoutMs } : {},
		headers: requestConfig.headers,
		...providerConfig.authHeader !== void 0 ? { authHeader: providerConfig.authHeader } : {},
		compat: resolvedCompat,
		mediaInput: mergeModelMediaInput(mergeModelMediaInput(configuredStaticCatalogModel?.mediaInput, discoveredModel.mediaInput), metadataOverrideModel?.mediaInput)
	}, providerRequest), providerConfig.localService);
}
function shouldSuppressInlineConfiguredModel(params) {
	if (shouldUnconditionallySuppress({
		provider: params.provider,
		id: params.modelId,
		...params.cfg ? { config: params.cfg } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	})) return true;
	if (normalizeProviderId(params.provider) !== "openai" || normalizeLowercaseStringOrEmpty(params.modelId) !== "gpt-5.3-codex-spark") return false;
	return shouldSuppressBuiltInModel({
		provider: params.provider,
		id: params.modelId,
		...params.cfg ? { config: params.cfg } : {},
		...params.baseUrl ? { baseUrl: params.baseUrl } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
}
function resolveExplicitModelWithRegistry(params) {
	const { provider, modelId, modelRegistry, cfg, agentDir, workspaceDir, runtimeHooks } = params;
	const providerConfig = resolveConfiguredProviderConfig(cfg, provider);
	const requestTimeoutMs = resolveProviderRequestTimeoutMs(providerConfig?.timeoutSeconds);
	const inlineMatch = findInlineModelMatch({
		providers: cfg?.models?.providers ?? {},
		provider,
		modelId
	});
	if (inlineMatch?.api) {
		if (shouldSuppressInlineConfiguredModel({
			provider,
			modelId,
			cfg,
			workspaceDir,
			baseUrl: resolveProviderTransport({
				provider,
				modelId,
				api: inlineMatch.api,
				baseUrl: inlineMatch.baseUrl ?? providerConfig?.baseUrl,
				cfg,
				workspaceDir,
				runtimeHooks
			}).baseUrl
		})) return { kind: "suppressed" };
		return {
			kind: "resolved",
			source: "configured",
			model: normalizeResolvedModel({
				provider,
				cfg,
				agentDir,
				workspaceDir,
				model: applyConfiguredProviderOverrides({
					provider,
					discoveredModel: mergeStaticCatalogInlineModel(resolveBundledStaticCatalogModel({
						provider,
						modelId,
						cfg,
						workspaceDir,
						includeRuntimeDiscovery: true
					}), inlineMatch),
					providerConfig,
					modelId,
					cfg,
					manifestAlias: params.manifestAlias,
					runtimeHooks,
					workspaceDir,
					preferDiscoveredTransport: true
				}),
				runtimeHooks
			})
		};
	}
	if (shouldUnconditionallySuppress({
		provider,
		id: modelId,
		...cfg ? { config: cfg } : {},
		...workspaceDir ? { workspaceDir } : {}
	})) return { kind: "suppressed" };
	const model = modelRegistry.find(provider, modelId);
	if (model) {
		const configuredBaseUrl = typeof providerConfig?.baseUrl === "string" ? providerConfig.baseUrl : void 0;
		const discoveredBaseUrl = typeof model.baseUrl === "string" ? model.baseUrl : void 0;
		const effectiveBaseUrl = configuredBaseUrl ?? discoveredBaseUrl;
		if (shouldSuppressBuiltInModel({
			provider,
			id: modelId,
			...cfg ? { config: cfg } : {},
			...effectiveBaseUrl ? { baseUrl: effectiveBaseUrl } : {},
			...workspaceDir ? { workspaceDir } : {}
		})) return { kind: "suppressed" };
		return {
			kind: "resolved",
			source: "registry",
			dropOnRuntimeMiss: normalizeProviderId(provider) === "openai" && modelId.trim().toLowerCase() === "gpt-5.3-codex-spark" && !effectiveBaseUrl,
			model: normalizeResolvedModel({
				provider,
				cfg,
				agentDir,
				workspaceDir,
				model: applyConfiguredProviderOverrides({
					provider,
					discoveredModel: model,
					providerConfig,
					modelId,
					cfg,
					manifestAlias: params.manifestAlias,
					runtimeHooks,
					workspaceDir
				}),
				runtimeHooks
			})
		};
	}
	const fallbackInlineMatch = findInlineModelMatch({
		providers: cfg?.models?.providers ?? {},
		provider,
		modelId
	});
	if (fallbackInlineMatch?.api) {
		const resolvedParams = mergeConfiguredRuntimeModelParams({
			cfg,
			provider,
			modelId,
			providerParams: providerConfig?.params,
			configuredParams: fallbackInlineMatch.params
		});
		return {
			kind: "resolved",
			source: "configured",
			model: normalizeResolvedModel({
				provider,
				cfg,
				agentDir,
				workspaceDir,
				model: {
					...fallbackInlineMatch,
					...fallbackInlineMatch.maxTokens !== void 0 ? { maxTokensSource: "configured" } : {},
					reasoning: resolveConfiguredModelReasoning({
						provider,
						compat: fallbackInlineMatch.compat,
						reasoning: fallbackInlineMatch.reasoning
					}),
					...resolvedParams ? { params: resolvedParams } : {},
					...requestTimeoutMs !== void 0 ? { requestTimeoutMs } : {}
				},
				runtimeHooks
			})
		};
	}
	if (fallbackInlineMatch) return;
	if (shouldSuppressBuiltInModel({
		provider,
		id: modelId,
		...cfg ? { config: cfg } : {},
		...providerConfig?.baseUrl ? { baseUrl: providerConfig.baseUrl } : {},
		...workspaceDir ? { workspaceDir } : {}
	})) return { kind: "suppressed" };
}
function resolveDynamicModelAuthProfile(params) {
	const explicitProfileId = params.authProfileId?.trim() || void 0;
	const store = ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false });
	if (explicitProfileId) {
		const credential = store.profiles[explicitProfileId];
		const configuredMode = params.cfg?.auth?.profiles?.[explicitProfileId]?.mode;
		return {
			authProfileId: explicitProfileId,
			...params.authProfileMode || credential?.type || configuredMode ? { authProfileMode: params.authProfileMode ?? credential?.type ?? configuredMode } : {}
		};
	}
	if (params.authProfileMode) return { authProfileMode: params.authProfileMode };
	const profileId = [...new Set(listOpenAIAuthProfileProvidersForAgentRuntime({
		provider: params.provider,
		config: params.cfg
	}).flatMap((provider) => resolveAuthProfileOrder({
		cfg: params.cfg,
		store,
		provider,
		preferredProfile: params.preferredProfile,
		forModel: params.modelId
	})))][0];
	if (!profileId) return {};
	const credential = store.profiles[profileId];
	const configuredMode = params.cfg?.auth?.profiles?.[profileId]?.mode;
	return {
		authProfileId: profileId,
		...credential?.type || configuredMode ? { authProfileMode: credential?.type ?? configuredMode } : {}
	};
}
function resolvePluginDynamicModelWithRegistry(params) {
	const { provider, modelId, modelRegistry, cfg, agentDir, workspaceDir } = params;
	const runtimeHooks = params.runtimeHooks ?? DEFAULT_PROVIDER_RUNTIME_HOOKS;
	const providerConfig = resolveConfiguredProviderConfig(cfg, provider);
	const agentHarnessPolicy = resolveAgentHarnessPolicy({
		provider,
		modelId,
		config: cfg
	});
	const inferredAgentRuntimeId = agentHarnessPolicy.runtimeSource !== "implicit" || cfg?.plugins?.entries?.codex?.enabled === true ? agentHarnessPolicy.runtime : void 0;
	const agentRuntimeId = params.agentRuntimeId ?? inferredAgentRuntimeId;
	const authProfile = resolveDynamicModelAuthProfile({
		provider,
		modelId,
		cfg,
		agentDir,
		authProfileId: params.authProfileId,
		authProfileMode: params.authProfileMode,
		preferredProfile: params.preferredProfile
	});
	const preferDiscoveredModelMetadata = shouldCompareProviderRuntimeResolvedModel({
		provider,
		modelId,
		cfg,
		agentDir,
		workspaceDir,
		runtimeHooks
	});
	const pluginDynamicModel = runtimeHooks.runProviderDynamicModel({
		provider,
		config: cfg,
		workspaceDir,
		context: {
			config: cfg,
			agentDir,
			workspaceDir,
			...agentRuntimeId ? { agentRuntimeId } : {},
			provider,
			modelId,
			modelRegistry,
			providerConfig,
			...authProfile
		}
	});
	if (!pluginDynamicModel) return;
	return normalizeResolvedModel({
		provider,
		cfg,
		agentDir,
		workspaceDir,
		model: applyConfiguredProviderOverrides({
			provider,
			discoveredModel: pluginDynamicModel,
			providerConfig,
			modelId,
			cfg,
			manifestAlias: params.manifestAlias,
			runtimeHooks,
			workspaceDir,
			preferDiscoveredModelMetadata
		}),
		runtimeHooks
	});
}
function resolveRuntimePreferredSuppressedModel(params) {
	const runtimeHooks = params.runtimeHooks ?? DEFAULT_PROVIDER_RUNTIME_HOOKS;
	if (!shouldCompareProviderRuntimeResolvedModel({
		provider: params.provider,
		modelId: params.modelId,
		cfg: params.cfg,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		runtimeHooks
	})) return;
	return resolvePluginDynamicModelWithRegistry({
		...params,
		runtimeHooks
	});
}
function shouldDropRuntimePreferredExplicitMiss(params) {
	return params.explicitModel.kind === "resolved" && params.explicitModel.source === "registry" && params.explicitModel.dropOnRuntimeMiss;
}
function resolveConfiguredFallbackModel(params) {
	const { provider, modelId, cfg, agentDir, workspaceDir, runtimeHooks } = params;
	const providerConfig = resolveConfiguredProviderConfig(cfg, provider);
	const requestTimeoutMs = resolveProviderRequestTimeoutMs(providerConfig?.timeoutSeconds);
	const configuredModel = findConfiguredProviderModel(providerConfig, provider, modelId);
	if (!hasConfiguredFallbackSurface({
		providerConfig,
		configuredModel,
		modelId
	})) return;
	const staticCatalogModel = resolveBundledStaticCatalogModel({
		provider,
		modelId,
		cfg,
		workspaceDir,
		includeRuntimeDiscovery: true
	});
	const metadataModel = configuredModel ?? staticCatalogModel;
	const fallbackCompat = mergeModelCompat(staticCatalogModel?.compat, configuredModel?.compat);
	const fallbackMediaInput = mergeModelMediaInput(staticCatalogModel?.mediaInput, configuredModel?.mediaInput);
	const providerHeaders = sanitizeModelHeaders(providerConfig?.headers, { stripSecretRefMarkers: true });
	const providerRequest = sanitizeConfiguredModelProviderRequest(providerConfig?.request);
	const staticCatalogHeaders = sanitizeModelHeaders(staticCatalogModel?.headers, { stripSecretRefMarkers: true });
	const modelHeaders = sanitizeModelHeaders(configuredModel?.headers, { stripSecretRefMarkers: true });
	const resolvedParams = mergeConfiguredRuntimeModelParams({
		cfg,
		provider,
		modelId,
		discoveredParams: staticCatalogModel?.params,
		providerParams: providerConfig?.params,
		configuredParams: configuredModel?.params
	});
	const providerConfiguredApi = normalizeResolvedTransportApi(providerConfig?.api);
	const configuredModelBaseUrl = normalizeTransportBaseUrl(configuredModel?.baseUrl);
	const providerConfiguredBaseUrl = normalizeTransportBaseUrl(providerConfig?.baseUrl);
	const manifestAliasTransport = params.manifestAlias.transport;
	const manifestAliasBaseUrl = normalizeTransportBaseUrl(manifestAliasTransport?.baseUrl);
	const staticCatalogBaseUrl = normalizeTransportBaseUrl(staticCatalogModel?.baseUrl);
	const fallbackTransport = resolveProviderTransport({
		provider,
		modelId,
		api: normalizeResolvedTransportApi(configuredModel?.api) ?? providerConfiguredApi ?? manifestAliasTransport?.api ?? normalizeResolvedTransportApi(staticCatalogModel?.api) ?? resolveConfiguredProviderDefaultApi({
			provider,
			providerConfig,
			cfg,
			workspaceDir,
			runtimeHooks
		}) ?? "openai-responses",
		baseUrl: configuredModelBaseUrl ?? providerConfiguredBaseUrl ?? manifestAliasBaseUrl ?? staticCatalogBaseUrl,
		cfg,
		workspaceDir,
		runtimeHooks
	});
	if (configuredModel && shouldSuppressInlineConfiguredModel({
		provider,
		modelId,
		cfg,
		workspaceDir,
		baseUrl: fallbackTransport.baseUrl
	})) return;
	const requestConfig = resolveProviderRequestConfig({
		provider,
		api: fallbackTransport.api ?? "openai-responses",
		baseUrl: fallbackTransport.baseUrl,
		discoveredHeaders: staticCatalogHeaders,
		providerHeaders,
		modelHeaders,
		authHeader: providerConfig?.authHeader,
		request: providerRequest,
		capability: "llm",
		transport: "stream"
	});
	const fallbackReasoning = resolveConfiguredFallbackReasoning({
		provider,
		compat: fallbackCompat,
		reasoning: metadataModel?.reasoning
	});
	const configuredFallbackMaxTokens = configuredModel?.maxTokens ?? providerConfig?.maxTokens ?? providerConfig?.models?.[0]?.maxTokens;
	const resolvedFallbackMaxTokens = configuredFallbackMaxTokens ?? staticCatalogModel?.maxTokens;
	return normalizeResolvedModel({
		provider,
		cfg,
		agentDir,
		workspaceDir,
		model: attachModelProviderLocalService(attachModelProviderRequestTransport({
			id: modelId,
			name: metadataModel?.name ?? modelId,
			api: requestConfig.api ?? "openai-responses",
			provider,
			baseUrl: requestConfig.baseUrl,
			reasoning: fallbackReasoning,
			input: resolveProviderModelInput({
				provider,
				modelId,
				modelName: metadataModel?.name ?? modelId,
				input: metadataModel?.input
			}),
			...configuredModel?.thinkingLevelMap !== void 0 ? { thinkingLevelMap: configuredModel.thinkingLevelMap } : {},
			cost: metadataModel?.cost ?? {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: configuredModel?.contextWindow ?? providerConfig?.contextWindow ?? providerConfig?.models?.[0]?.contextWindow ?? staticCatalogModel?.contextWindow ?? 2e5,
			contextTokens: configuredModel?.contextTokens ?? providerConfig?.contextTokens ?? providerConfig?.models?.[0]?.contextTokens ?? staticCatalogModel?.contextTokens,
			...resolvedFallbackMaxTokens !== void 0 ? {
				maxTokens: resolvedFallbackMaxTokens,
				maxTokensSource: configuredFallbackMaxTokens !== void 0 ? "configured" : "discovered"
			} : {},
			...resolvedParams ? { params: resolvedParams } : {},
			...requestTimeoutMs !== void 0 ? { requestTimeoutMs } : {},
			headers: requestConfig.headers,
			...providerConfig?.authHeader !== void 0 ? { authHeader: providerConfig.authHeader } : {},
			compat: fallbackCompat,
			mediaInput: fallbackMediaInput
		}, providerRequest), providerConfig?.localService),
		runtimeHooks
	});
}
function shouldCompareProviderRuntimeResolvedModel(params) {
	return params.runtimeHooks.shouldPreferProviderRuntimeResolvedModel?.({
		provider: params.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		context: {
			provider: params.provider,
			modelId: params.modelId,
			config: params.cfg,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		}
	}) ?? false;
}
function normalizeProviderModelRef(params) {
	const manifestAlias = resolveManifestModelCatalogProviderAliasMetadata({
		provider: params.provider,
		modelId: params.modelId,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir
	});
	return {
		provider: manifestAlias.provider,
		model: normalizeStaticProviderModelId(normalizeProviderId(manifestAlias.provider), params.modelId),
		manifestAlias
	};
}
function resolveModelWithPreparedRegistry(params) {
	if (params.manifestAlias.ambiguous) return;
	const runtimeHooks = params.runtimeHooks ?? DEFAULT_PROVIDER_RUNTIME_HOOKS;
	const explicitModel = resolveExplicitModelWithRegistry(params);
	if (explicitModel?.kind === "suppressed") return resolveRuntimePreferredSuppressedModel(params);
	if (explicitModel?.kind === "resolved") {
		if (!shouldCompareProviderRuntimeResolvedModel({
			provider: params.provider,
			modelId: params.modelId,
			cfg: params.cfg,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			runtimeHooks
		})) return explicitModel.model;
		return resolvePluginDynamicModelWithRegistry(params) ?? (shouldDropRuntimePreferredExplicitMiss({
			provider: params.provider,
			modelId: params.modelId,
			explicitModel
		}) ? void 0 : explicitModel.model);
	}
	const pluginDynamicModel = resolvePluginDynamicModelWithRegistry(params);
	if (pluginDynamicModel) return pluginDynamicModel;
	return params.skipConfiguredFallback ? void 0 : resolveConfiguredFallbackModel(params);
}
function resolveModelWithRegistry(params) {
	const workspaceDir = params.workspaceDir ?? params.cfg?.agents?.defaults?.workspace;
	const normalizedRef = normalizeProviderModelRef({
		...params,
		workspaceDir
	});
	return resolveModelWithPreparedRegistry({
		...params,
		provider: normalizedRef.provider,
		modelId: normalizedRef.model,
		manifestAlias: normalizedRef.manifestAlias,
		...workspaceDir !== void 0 ? { workspaceDir } : {}
	});
}
function resolveModel(provider, modelId, agentDir, cfg, options) {
	const resolvedAgentDir = agentDir ?? resolveDefaultAgentDir(cfg ?? {});
	const derivedWorkspaceDir = resolveModelWorkspaceDir(cfg, options?.workspaceDir);
	const preparedSnapshot = !options?.authStorage || !options?.modelRegistry ? resolvePreparedAgentSnapshot(resolvedAgentDir, cfg, options?.workspaceDir, derivedWorkspaceDir, options?.agentId) : void 0;
	if ((!options?.authStorage || !options?.modelRegistry) && !preparedSnapshot) throw new Error(`prepared model runtime is not published for synchronous model resolution (${resolvedAgentDir}); use resolveModelAsync before lifecycle publication`);
	const workspaceDir = options?.workspaceDir ?? preparedSnapshot?.workspaceDir ?? derivedWorkspaceDir;
	const normalizedRef = normalizeProviderModelRef({
		provider,
		modelId,
		cfg,
		workspaceDir
	});
	const preparedStores = preparedSnapshot?.createStores();
	const authStorage = options?.authStorage ?? preparedStores.authStorage;
	const modelRegistry = options?.modelRegistry ?? (options?.authStorage ? preparedStores.modelRegistry.fork(authStorage) : preparedStores.modelRegistry);
	const runtimeHooks = resolveRuntimeHooks(options);
	const model = resolveModelWithPreparedRegistry({
		provider: normalizedRef.provider,
		modelId: normalizedRef.model,
		modelRegistry,
		cfg,
		agentDir: resolvedAgentDir,
		manifestAlias: normalizedRef.manifestAlias,
		workspaceDir,
		authProfileId: options?.authProfileId,
		authProfileMode: options?.authProfileMode,
		preferredProfile: options?.preferredProfile,
		runtimeHooks
	});
	if (model) return {
		model,
		authStorage,
		modelRegistry
	};
	return {
		error: buildUnknownModelError({
			provider: normalizedRef.provider,
			modelId: normalizedRef.model,
			cfg,
			agentDir: resolvedAgentDir,
			workspaceDir,
			runtimeHooks
		}),
		authStorage,
		modelRegistry
	};
}
async function resolveModelAsync(provider, modelId, agentDir, cfg, options) {
	const resolvedAgentDir = agentDir ?? resolveDefaultAgentDir(cfg ?? {});
	const derivedWorkspaceDir = resolveModelWorkspaceDir(cfg, options?.workspaceDir);
	const emptyDiscoveryStores = options?.skipAgentDiscovery && (!options.authStorage || !options.modelRegistry) ? createEmptyAgentDiscoveryStores() : void 0;
	const preparedSnapshot = (!emptyDiscoveryStores && (!options?.authStorage || !options?.modelRegistry) ? resolvePreparedAgentSnapshot(resolvedAgentDir, cfg, options?.workspaceDir, derivedWorkspaceDir, options?.agentId) : void 0) ?? (!emptyDiscoveryStores && (!options?.authStorage || !options?.modelRegistry) ? await loadPreparedModelRuntimeSnapshot({
		...options?.agentId ? { agentId: options.agentId } : {},
		agentDir: resolvedAgentDir,
		config: cfg ?? {},
		inheritedAuthDir: resolveDefaultAgentDir(cfg ?? {}),
		...derivedWorkspaceDir ? { workspaceDir: derivedWorkspaceDir } : {}
	}) : void 0);
	const workspaceDir = options?.workspaceDir ?? preparedSnapshot?.workspaceDir ?? derivedWorkspaceDir;
	const normalizedRef = normalizeProviderModelRef({
		provider,
		modelId,
		cfg,
		workspaceDir
	});
	const preparedStores = preparedSnapshot?.createStores();
	const fallbackStores = emptyDiscoveryStores ?? preparedStores ?? createEmptyAgentDiscoveryStores();
	const authStorage = options?.authStorage ?? fallbackStores.authStorage;
	const modelRegistry = options?.modelRegistry ?? (options?.authStorage ? fallbackStores.modelRegistry.fork(authStorage) : fallbackStores.modelRegistry);
	const runtimeHooks = resolveRuntimeHooks(options);
	if (normalizedRef.manifestAlias.ambiguous) return {
		error: buildUnknownModelError({
			provider: normalizedRef.provider,
			modelId: normalizedRef.model,
			cfg,
			agentDir: resolvedAgentDir,
			workspaceDir,
			runtimeHooks
		}),
		authStorage,
		modelRegistry
	};
	const explicitModel = resolveExplicitModelWithRegistry({
		provider: normalizedRef.provider,
		modelId: normalizedRef.model,
		modelRegistry,
		cfg,
		agentDir: resolvedAgentDir,
		manifestAlias: normalizedRef.manifestAlias,
		workspaceDir,
		runtimeHooks
	});
	if (explicitModel?.kind === "suppressed") {
		const suppressedRuntimeModel = resolveRuntimePreferredSuppressedModel({
			provider: normalizedRef.provider,
			modelId: normalizedRef.model,
			modelRegistry,
			cfg,
			agentDir: resolvedAgentDir,
			...options?.agentRuntimeId ? { agentRuntimeId: options.agentRuntimeId } : {},
			manifestAlias: normalizedRef.manifestAlias,
			workspaceDir,
			authProfileId: options?.authProfileId,
			authProfileMode: options?.authProfileMode,
			preferredProfile: options?.preferredProfile,
			runtimeHooks
		});
		if (suppressedRuntimeModel) return {
			model: suppressedRuntimeModel,
			authStorage,
			modelRegistry
		};
		return {
			error: buildUnknownModelError({
				provider: normalizedRef.provider,
				modelId: normalizedRef.model,
				cfg,
				agentDir: resolvedAgentDir,
				workspaceDir,
				runtimeHooks
			}),
			authStorage,
			modelRegistry
		};
	}
	const providerConfig = resolveConfiguredProviderConfig(cfg, normalizedRef.provider);
	const authProfile = resolveDynamicModelAuthProfile({
		provider: normalizedRef.provider,
		modelId: normalizedRef.model,
		cfg,
		agentDir: resolvedAgentDir,
		authProfileId: options?.authProfileId,
		authProfileMode: options?.authProfileMode,
		preferredProfile: options?.preferredProfile
	});
	let staticCatalogLookup;
	const resolveStaticCatalogModel = async () => {
		if (!options?.allowBundledStaticCatalogFallback) return;
		staticCatalogLookup ??= (async () => {
			const manifestModel = resolveBundledStaticCatalogModel({
				provider: normalizedRef.provider,
				modelId: normalizedRef.model,
				cfg,
				workspaceDir
			});
			if (manifestModel) return manifestModel;
			return await resolveBundledProviderStaticCatalogModel({
				provider: normalizedRef.provider,
				modelId: normalizedRef.model,
				cfg,
				workspaceDir
			});
		})();
		return await staticCatalogLookup;
	};
	const resolveStaticCatalogFallbackModel = async () => {
		const catalogModel = await resolveStaticCatalogModel();
		if (!catalogModel) return;
		const overriddenStaticCatalogModel = applyConfiguredProviderOverrides({
			provider: normalizedRef.provider,
			discoveredModel: catalogModel,
			providerConfig,
			modelId: normalizedRef.model,
			cfg,
			manifestAlias: normalizedRef.manifestAlias,
			runtimeHooks,
			workspaceDir,
			preferDiscoveredModelMetadata: true,
			preferDiscoveredTransport: options?.preferBundledStaticCatalogTransport
		});
		return normalizeResolvedModel({
			provider: normalizedRef.provider,
			cfg,
			agentDir: resolvedAgentDir,
			workspaceDir,
			model: overriddenStaticCatalogModel,
			runtimeHooks
		});
	};
	const resolveDynamicAttempt = async () => {
		await runtimeHooks.prepareProviderDynamicModel({
			provider: normalizedRef.provider,
			config: cfg,
			workspaceDir,
			context: {
				config: cfg,
				agentDir: resolvedAgentDir,
				...options?.agentRuntimeId ? { agentRuntimeId: options.agentRuntimeId } : {},
				workspaceDir,
				provider: normalizedRef.provider,
				modelId: normalizedRef.model,
				modelRegistry,
				providerConfig,
				...authProfile
			}
		});
		return resolveModelWithPreparedRegistry({
			provider: normalizedRef.provider,
			modelId: normalizedRef.model,
			modelRegistry,
			cfg,
			agentDir: resolvedAgentDir,
			...options?.agentRuntimeId ? { agentRuntimeId: options.agentRuntimeId } : {},
			manifestAlias: normalizedRef.manifestAlias,
			workspaceDir,
			authProfileId: options?.authProfileId,
			authProfileMode: options?.authProfileMode,
			preferredProfile: options?.preferredProfile,
			runtimeHooks,
			...options?.allowBundledStaticCatalogFallback ? { skipConfiguredFallback: true } : {}
		});
	};
	const providerRuntimeMetadataShouldWin = shouldCompareProviderRuntimeResolvedModel({
		provider: normalizedRef.provider,
		modelId: normalizedRef.model,
		cfg,
		agentDir: resolvedAgentDir,
		workspaceDir,
		runtimeHooks
	});
	let model = explicitModel?.kind === "resolved" && !providerRuntimeMetadataShouldWin ? explicitModel.model : void 0;
	model ??= await resolveDynamicAttempt();
	if (!model && !explicitModel && options?.retryTransientProviderRuntimeMiss) model = await resolveDynamicAttempt();
	if (!model && !explicitModel && options?.allowBundledStaticCatalogFallback) model = await resolveStaticCatalogFallbackModel();
	if (!model && !explicitModel && options?.allowBundledStaticCatalogFallback) model = resolveConfiguredFallbackModel({
		provider: normalizedRef.provider,
		modelId: normalizedRef.model,
		cfg,
		agentDir: resolvedAgentDir,
		manifestAlias: normalizedRef.manifestAlias,
		workspaceDir,
		runtimeHooks
	});
	if (model && options?.allowBundledStaticCatalogFallback) {
		const staticMediaInput = (await resolveStaticCatalogModel())?.mediaInput;
		const resolvedMediaInput = model.mediaInput;
		const mediaInput = mergeModelMediaInput(staticMediaInput, resolvedMediaInput);
		if (mediaInput) model = {
			...model,
			mediaInput
		};
	}
	if (model) return {
		model,
		authStorage,
		modelRegistry
	};
	return {
		error: buildUnknownModelError({
			provider: normalizedRef.provider,
			modelId: normalizedRef.model,
			cfg,
			agentDir: resolvedAgentDir,
			workspaceDir,
			runtimeHooks
		}),
		authStorage,
		modelRegistry
	};
}
/**
* Build a more helpful error when the model is not found.
*
* Some provider plugins only become available after setup/auth has registered
* them. When users point `agents.defaults.model.primary` at one of those
* providers before setup, the raw `Unknown model` error is too vague. Provider
* plugins can append a targeted recovery hint here.
*
* See: https://github.com/openclaw/openclaw/issues/17328
*/
function buildUnknownModelError(params) {
	const suppressed = buildSuppressedBuiltInModelError({
		provider: params.provider,
		id: params.modelId,
		...params.cfg ? { config: params.cfg } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	if (suppressed) return suppressed;
	const base = `Unknown model: ${params.provider}/${params.modelId}`;
	const registrationHint = buildMissingProviderModelRegistrationHint({
		provider: params.provider,
		modelId: params.modelId,
		cfg: params.cfg
	});
	if (registrationHint) return `${base}. ${registrationHint}`;
	const hint = (params.runtimeHooks ?? DEFAULT_PROVIDER_RUNTIME_HOOKS).buildProviderUnknownModelHintWithPlugin({
		provider: params.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: process.env,
		context: {
			config: params.cfg,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			env: process.env,
			provider: params.provider,
			modelId: params.modelId
		}
	});
	return hint ? `${base}. ${hint}` : base;
}
function buildMissingProviderModelRegistrationHint(params) {
	if (normalizeProviderId(params.provider) === "openai-codex") return `"openai-codex" is a legacy provider ID. Run \`openclaw doctor --fix\` to migrate legacy model and provider config to the current OpenAI format. If the provider has no authenticated profile, run \`openclaw models status\` to check provider auth and re-authenticate if needed. See https://docs.openclaw.ai/concepts/model-providers.`;
	const configuredModels = params.cfg?.agents?.defaults?.models;
	if (!configuredModels) return;
	const agentModelKey = modelKey(params.provider, params.modelId);
	const configuredEntry = configuredModels[agentModelKey] ?? configuredModels[`${params.provider}/${params.modelId}`];
	if (!configuredEntry) return;
	const agentRuntimeId = configuredEntry.agentRuntime?.id;
	if (agentRuntimeId) return `Found agents.defaults.models["${agentModelKey}"] bound to the "${agentRuntimeId}" agent runtime. Models served by an agent runtime come from that runtime and its linked account, not from models.providers["${params.provider}"].models[] — registering it there will not make it usable. Confirm "${params.modelId}" is still offered by the "${agentRuntimeId}" runtime and switch agents.defaults.model.primary to a currently available model (run \`openclaw models list --provider ${params.provider}\` to list them). See https://docs.openclaw.ai/concepts/model-providers.`;
	const providerConfig = findNormalizedProviderValue(params.cfg?.models?.providers, params.provider);
	if ((Array.isArray(providerConfig?.models) ? providerConfig.models : []).some((entry) => {
		if (!entry || typeof entry !== "object" || !("id" in entry)) return false;
		const id = entry.id;
		return typeof id === "string" && id === params.modelId;
	})) return;
	return `Found agents.defaults.models["${agentModelKey}"], but no matching models.providers["${params.provider}"].models[] entry. Add { "id": "${params.modelId}", "name": "${params.modelId}" } to models.providers["${params.provider}"].models[] to register this provider model. For custom or proxy providers, also set api and baseUrl so requests route to the intended endpoint. See https://docs.openclaw.ai/concepts/model-providers.`;
}
//#endregion
export { resolveModelWithRegistry as i, resolveModel as n, resolveModelAsync as r, createEmptyAgentDiscoveryStores as t };
