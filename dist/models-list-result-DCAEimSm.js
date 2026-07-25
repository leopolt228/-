import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CrBA-6Gx.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-h9TzWSvp.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir } from "./agent-scope-config-S7z_Yn4H.js";
import { d as loadPluginRegistrySnapshotWithMetadata } from "./plugin-registry-2gpKUE2T.js";
import { p as openAIModelCatalogRoutePolicy } from "./openai-routing-Cq9SwNpx.js";
import { t as resolveAgentHarnessPolicy } from "./policy-CZpNJ432.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-DqR_mVNH.js";
import { c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-BW7iP5ad.js";
import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import "./config-BOMcY2yX.js";
import { f as loadAuthProfileStoreWithoutExternalProfiles } from "./store-BTcmQtbp.js";
import "./auth-profiles-D9OcwMed.js";
import { u as hasSyntheticLocalProviderAuthConfig } from "./model-auth-919iJVmy.js";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-r2n6di99.js";
import "./workspace-GYctLxSN.js";
import { r as resolveManifestProviderAuthChoices } from "./provider-auth-choices-BqQ_qaxJ.js";
import { a as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-XZ8Sb-m9.js";
import { n as createModelVisibilityPolicy, t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-D6Ef-vpo.js";
import { n as loadPreparedModelCatalogSnapshotForBrowse, t as buildProviderConfigModelCatalogForBrowse } from "./model-catalog-browse-BzralRiP.js";
import { n as projectModelCatalogEntryForRoute, r as resolveConfiguredModelCatalogOverrides, t as findModelCatalogRouteDonor } from "./model-catalog-route-BPW4i2iG.js";
import { n as resolveLogicalVisibleModelCatalog, t as resolveLogicalModelCatalogEntryState } from "./model-catalog-visibility-DRMw4iWV.js";
//#region src/gateway/server-methods/models-list-result.ts
let loggedSlowModelsListCatalog = false;
function resolveModelsListView(params) {
	const view = params.view;
	return view === "configured" || view === "provider-config" || view === "all" ? view : "default";
}
function resolvePositiveSafeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
function buildPublicModelProjection(entry) {
	const contextWindow = resolvePositiveSafeInteger(entry.contextWindow);
	return {
		id: entry.id,
		name: entry.name,
		provider: entry.provider,
		...entry.alias ? { alias: entry.alias } : {},
		...contextWindow ? { contextWindow } : {},
		...typeof entry.reasoning === "boolean" ? { reasoning: entry.reasoning } : {}
	};
}
function resolveModelChoiceAgentRuntime(params) {
	const harnessPolicy = resolveAgentHarnessPolicy({
		provider: params.entry.provider,
		modelId: params.entry.id,
		modelApi: params.entry.api,
		modelBaseUrl: params.entry.baseUrl,
		config: params.cfg,
		agentId: params.agentId
	});
	if (harnessPolicy.runtime === "auto") return;
	return {
		id: harnessPolicy.runtime,
		source: harnessPolicy.runtimeSource ?? "implicit"
	};
}
function listEnabledSyntheticAuthProviderRefs(params) {
	const result = loadPluginRegistrySnapshotWithMetadata({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: process.env
	});
	if (result.source !== "persisted" && result.source !== "provided") return [];
	return result.snapshot.plugins.filter((plugin) => plugin.enabled).flatMap((plugin) => plugin.syntheticAuthRefs ?? []);
}
function createModelsListAuthResolver(params) {
	const agentDir = resolveAgentDir(params.cfg, params.agentId);
	const authStore = loadAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: false });
	return createModelAuthAvailabilityResolver({
		cfg: params.cfg,
		authStore,
		agentDir,
		workspaceDir: params.workspaceDir,
		env: process.env,
		skipSetupProviderFallback: true,
		syntheticAuthProviderRefs: listEnabledSyntheticAuthProviderRefs(params),
		externalCliProviderIds: params.includeOpenAIExternalProfiles ? ["openai"] : [],
		routeResolverFactory: params.routeResolverFactory
	});
}
function resolveLegacyEntryAvailability(params) {
	if (params.primaryAvailability === true) return true;
	let available = params.primaryAvailability;
	const runtimeProvider = resolveCliRuntimeExecutionProvider({
		provider: params.entry.provider,
		cfg: params.cfg,
		agentId: params.agentId,
		modelId: params.entry.id
	});
	if (runtimeProvider && normalizeProviderId(runtimeProvider) !== normalizeProviderId(params.entry.provider)) {
		const runtimeAvailable = params.authResolver.resolveProviderAuthAvailability(runtimeProvider);
		if (runtimeAvailable === true) return true;
		if (available === false && runtimeAvailable === void 0) available = void 0;
	}
	return available;
}
function createModelsListEntryEvaluator(params) {
	const pending = /* @__PURE__ */ new Map();
	return (entry, routeVariants = [entry]) => {
		const identity = openAIModelCatalogRoutePolicy.resolveIdentity(entry);
		const cacheKey = resolveGatewayModelCatalogRouteKey(entry);
		const cached = pending.get(cacheKey);
		if (cached) return cached;
		const next = Promise.resolve().then(() => {
			const evaluation = params.authResolver.evaluateModelAuth(entry.provider, {
				modelId: identity?.id ?? entry.id,
				...params.preferredProfileId ? { preferredProfileId: params.preferredProfileId } : {},
				...params.lockedProfileId ? { lockedProfileId: params.lockedProfileId } : {},
				observedRoutes: routeVariants.map((variant) => ({
					api: variant.api,
					baseUrl: variant.baseUrl
				}))
			});
			return evaluation.routeResolution === null && normalizeProviderId(entry.provider) !== "openai" ? {
				...evaluation,
				availability: resolveLegacyEntryAvailability({
					authResolver: params.authResolver,
					entry,
					primaryAvailability: evaluation.availability,
					cfg: params.cfg,
					agentId: params.agentId
				})
			} : evaluation;
		});
		pending.set(cacheKey, next);
		return next;
	};
}
function resolveGatewayModelCatalogRouteKey(entry) {
	return openAIModelCatalogRoutePolicy.resolveIdentity(entry)?.key ?? `${normalizeProviderId(entry.provider)}/${entry.id}`;
}
function resolveProviderConfigInventoryEntries(params) {
	const canonicalByKey = /* @__PURE__ */ new Map();
	for (const entry of params.canonicalEntries) {
		const key = resolveGatewayModelCatalogRouteKey(entry);
		if (!canonicalByKey.has(key)) canonicalByKey.set(key, entry);
	}
	const seen = /* @__PURE__ */ new Set();
	const inventory = [];
	for (const authoredEntry of params.authoredEntries) {
		const key = resolveGatewayModelCatalogRouteKey(authoredEntry);
		if (seen.has(key)) continue;
		seen.add(key);
		inventory.push(canonicalByKey.get(key) ?? authoredEntry);
	}
	return inventory;
}
/** Builds one per-agent, snapshot-scoped route projection for Gateway thinking metadata. */
function createGatewayAgentModelCatalogProjector(params) {
	const defaultModel = resolveAgentEffectiveModelPrimary(params.cfg, params.agentId);
	const visibilityPolicy = createModelVisibilityPolicy({
		cfg: params.cfg,
		catalog: params.snapshot.entries,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel,
		agentId: params.agentId,
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION
	});
	const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.agentId) ?? resolveDefaultAgentWorkspaceDir();
	const projectionCatalog = params.snapshot.routeVariants.length > 0 ? params.snapshot.routeVariants : params.snapshot.entries;
	const routeVariantsByKey = /* @__PURE__ */ new Map();
	for (const entry of projectionCatalog) {
		const key = resolveGatewayModelCatalogRouteKey(entry);
		const variants = routeVariantsByKey.get(key) ?? [];
		variants.push(entry);
		routeVariantsByKey.set(key, variants);
	}
	const resolveRouteVariants = (entry) => routeVariantsByKey.get(resolveGatewayModelCatalogRouteKey(entry)) ?? [entry];
	const logicalEntries = [];
	const logicalEntryKeys = /* @__PURE__ */ new Set();
	for (const entry of params.snapshot.entries) {
		const key = resolveGatewayModelCatalogRouteKey(entry);
		if (!logicalEntryKeys.has(key)) {
			logicalEntryKeys.add(key);
			logicalEntries.push(entry);
		}
	}
	const authResolver = createModelsListAuthResolver({
		cfg: params.cfg,
		agentId: params.agentId,
		includeOpenAIExternalProfiles: projectionCatalog.some((entry) => normalizeProviderId(entry.provider) === "openai") || [...visibilityPolicy.configuredKeys].some((key) => key.startsWith("openai/")),
		workspaceDir,
		routeResolverFactory: params.routeResolverFactory
	});
	const evaluateEntry = createModelsListEntryEvaluator({
		cfg: params.cfg,
		agentId: params.agentId,
		authResolver,
		...params.preferredProfileId ? { preferredProfileId: params.preferredProfileId } : {},
		...params.lockedProfileId ? { lockedProfileId: params.lockedProfileId } : {}
	});
	let projectedCatalog;
	return {
		evaluateEntry,
		projectCatalog: () => projectedCatalog ??= Promise.all(logicalEntries.map(async (entry) => {
			const routeVariants = resolveRouteVariants(entry);
			const state = resolveLogicalModelCatalogEntryState({
				entry,
				evaluation: await evaluateEntry(entry, routeVariants),
				routePolicy: openAIModelCatalogRoutePolicy
			});
			const overrides = resolveConfiguredModelCatalogOverrides({
				cfg: params.cfg,
				entry,
				policy: openAIModelCatalogRoutePolicy
			});
			const projected = projectModelCatalogEntryForRoute({
				entry,
				projection: state.routeProjection,
				catalog: routeVariants,
				...overrides ? { overrides } : {}
			});
			if (state.routeProjection.kind !== "selected") return projected;
			const donor = findModelCatalogRouteDonor({
				entry,
				route: state.routeProjection.route,
				policy: openAIModelCatalogRoutePolicy,
				catalog: routeVariants
			});
			if (donor && Object.hasOwn(donor, "compat")) projected.compat = donor.compat;
			if (donor && Object.hasOwn(donor, "params")) projected.params = donor.params;
			return projected;
		}))
	};
}
async function buildPublicModelsListEntries(params) {
	return await Promise.all(params.catalog.map(async (entry) => {
		const evaluation = await params.evaluateEntry(entry);
		const publicEntry = buildPublicModelProjection(entry);
		const syntheticLocalAvailable = evaluation.availability === void 0 && evaluation.routeResolution === null && normalizeProviderId(entry.provider) !== "openai" && hasSyntheticLocalProviderAuthConfig({
			cfg: params.cfg,
			provider: entry.provider
		});
		const available = evaluation.availability ?? (syntheticLocalAvailable ? true : void 0);
		const capabilityProvider = params.apiKeyCapabilities?.resolveProvider(entry.provider);
		const agentRuntime = resolveModelChoiceAgentRuntime({
			cfg: params.cfg,
			agentId: params.agentId,
			entry
		});
		return {
			...publicEntry,
			...agentRuntime ? { agentRuntime } : {},
			...capabilityProvider && params.apiKeyCapabilities?.providers.has(capabilityProvider) ? { apiKeySupported: params.apiKeyCapabilities.providers.get(capabilityProvider) === true } : {},
			...params.includeInput && entry.input?.length ? { input: entry.input } : {},
			...params.preserveUnknownAvailability && available === void 0 ? {} : { available: available ?? false }
		};
	}));
}
function apiKeyProviderCapabilities(params) {
	const capabilities = /* @__PURE__ */ new Map();
	const resolveProvider = (provider) => resolveProviderIdForAuth(provider, {
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: process.env,
		includeUntrustedWorkspacePlugins: false
	});
	for (const choice of resolveManifestProviderAuthChoices({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: process.env,
		includeUntrustedWorkspacePlugins: false
	})) {
		const provider = resolveProvider(choice.providerId);
		capabilities.set(provider, capabilities.get(provider) === true || choice.methodId === "api-key");
	}
	return {
		providers: capabilities,
		resolveProvider
	};
}
async function buildModelsListResult(params) {
	const cfg = params.context.getRuntimeConfig();
	const agentId = params.agentId ?? resolveDefaultAgentId(cfg);
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId) ?? resolveDefaultAgentWorkspaceDir();
	const view = resolveModelsListView(params.params);
	const snapshot = await loadPreparedModelCatalogSnapshotForBrowse({
		cfg,
		view,
		loadCatalog: async (loadParams) => {
			const readOnlyLoad = loadParams.readOnly ?? true;
			if (params.preloadedCatalog?.agentId === agentId && readOnlyLoad) return params.preloadedCatalog.snapshot;
			return await params.context.loadGatewayModelCatalogSnapshot({
				...loadParams,
				agentId,
				agentDir: resolveAgentDir(cfg, agentId)
			});
		},
		onTimeout: (timeoutMs) => {
			if (loggedSlowModelsListCatalog) return;
			loggedSlowModelsListCatalog = true;
			params.context.logGateway.debug(`models.list continuing without model catalog after ${timeoutMs}ms`);
		}
	});
	const catalog = snapshot.entries;
	const routeVariants = snapshot.routeVariants;
	const capableProviders = params.params.includeProviderCapabilities === true ? apiKeyProviderCapabilities({
		cfg,
		workspaceDir
	}) : void 0;
	if (view === "provider-config") {
		const inventoryProjector = createGatewayAgentModelCatalogProjector({
			cfg,
			agentId,
			snapshot: {
				entries: resolveProviderConfigInventoryEntries({
					authoredEntries: buildProviderConfigModelCatalogForBrowse({
						cfg: getRuntimeConfigSourceSnapshot() ?? cfg,
						workspaceDir
					}),
					canonicalEntries: catalog
				}),
				routeVariants
			},
			...params.routeResolverFactory ? { routeResolverFactory: params.routeResolverFactory } : {}
		});
		return { models: await buildPublicModelsListEntries({
			catalog: await inventoryProjector.projectCatalog(),
			cfg,
			agentId,
			evaluateEntry: inventoryProjector.evaluateEntry,
			includeInput: true,
			preserveUnknownAvailability: true,
			...capableProviders ? { apiKeyCapabilities: capableProviders } : {}
		}) };
	}
	const defaultModel = resolveAgentEffectiveModelPrimary(cfg, agentId);
	const visibilityPolicy = createModelVisibilityPolicy({
		cfg,
		catalog,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel,
		agentId,
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION
	});
	const evaluateEntry = params.catalogProjector?.evaluateEntry ?? createModelsListEntryEvaluator({
		cfg,
		agentId,
		authResolver: createModelsListAuthResolver({
			cfg,
			agentId,
			includeOpenAIExternalProfiles: catalog.some((entry) => normalizeProviderId(entry.provider) === "openai") || [...visibilityPolicy.configuredKeys].some((key) => key.startsWith("openai/")),
			workspaceDir,
			routeResolverFactory: params.routeResolverFactory
		})
	});
	return { models: await buildPublicModelsListEntries({
		catalog: await resolveLogicalVisibleModelCatalog({
			cfg,
			catalog,
			defaultProvider: DEFAULT_PROVIDER,
			defaultModel,
			agentId,
			workspaceDir,
			view,
			policy: visibilityPolicy,
			routePolicy: openAIModelCatalogRoutePolicy,
			routeVariants,
			evaluateEntry: async (entry, variants) => {
				const evaluation = await evaluateEntry(entry, variants);
				const syntheticLocal = !(evaluation.routeResolution !== null) && normalizeProviderId(entry.provider) !== "openai" && evaluation.availability === void 0 && evaluation.evidence === "synthetic";
				return resolveLogicalModelCatalogEntryState({
					entry,
					evaluation,
					authBacked: evaluation.availability === true || syntheticLocal,
					routePolicy: openAIModelCatalogRoutePolicy
				});
			}
		}),
		cfg,
		agentId,
		evaluateEntry,
		...capableProviders ? { apiKeyCapabilities: capableProviders } : {}
	}) };
}
//#endregion
export { createGatewayAgentModelCatalogProjector as n, buildModelsListResult as t };
