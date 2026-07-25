import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { t as modelKey } from "./model-key-BaNhQShd.js";
import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BQju0mzJ.js";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-DoJxaJiY.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-xuKL7EBL.js";
import { t as planManifestModelCatalogRows } from "./manifest-planner-DSmSdykb.js";
import { a as resolveClaudeFable5ModelIdentity } from "./src-BnQDOjpw.js";
import { T as modelSupportsInput, c as hasConfiguredProviderModelRows, r as buildConfiguredModelCatalog } from "./model-selection-shared-CPPxIJAX.js";
import { n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-DbVdNqi2.js";
import { n as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-BlCyhiC_.js";
import { t as augmentModelCatalogWithProviderPlugins } from "./provider-runtime.runtime.js";
//#region src/agents/model-catalog.ts
/**
* Loads bundled, manifest, and discovered model catalog entries.
*/
const log = createSubsystemLogger("model-catalog");
let hasLoggedModelCatalogError = false;
let manifestModelCatalogCache = /* @__PURE__ */ new WeakMap();
const modelSuppressionLoader = createLazyImportLoader(() => import("./model-suppression.runtime.js"));
const providerApiKeyResolverLoader = createLazyImportLoader(() => import("./models-config.providers.secrets-CI6j1pca.js"));
function loadModelSuppression() {
	return modelSuppressionLoader.load();
}
function loadProviderApiKeyResolver() {
	return providerApiKeyResolverLoader.load();
}
function resetModelCatalogBuilderCacheForTest() {
	manifestModelCatalogCache = /* @__PURE__ */ new WeakMap();
	hasLoggedModelCatalogError = false;
}
/** Canonicalizes a provider alias against the metadata captured with a prepared catalog. */
function canonicalizePreparedModelCatalogProvider(provider, metadataSnapshot) {
	const normalizedProvider = normalizeProviderId(provider);
	for (const plugin of metadataSnapshot.manifestRegistry.plugins) for (const [alias, target] of Object.entries(plugin.modelCatalog?.aliases ?? {})) if (normalizeProviderId(alias) === normalizedProvider) {
		const canonicalProvider = normalizeProviderId(target.provider);
		if (canonicalProvider) return canonicalProvider;
	}
	return normalizedProvider;
}
function catalogEntryDedupeKey(provider, id) {
	return normalizeLowercaseStringOrEmpty(modelKey(normalizeProviderId(provider), id));
}
function mergeCatalogCompat(base, override) {
	if (!base) return override;
	if (!override) return base;
	return {
		...base,
		...override
	};
}
function mergeCatalogParams(base, override) {
	if (!base) return override;
	if (!override) return base;
	return {
		...base,
		...override
	};
}
function normalizeCatalogRouteBaseUrl(value) {
	if (!value) return;
	try {
		const url = new URL(value);
		url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
		return url.toString();
	} catch {
		return value.replace(/\/+$/u, "");
	}
}
function catalogRouteChanges(base, overlay) {
	if (overlay.api === void 0 && overlay.baseUrl === void 0) return false;
	return overlay.api !== void 0 && base.api !== void 0 && overlay.api !== base.api || overlay.baseUrl !== void 0 && base.baseUrl !== void 0 && normalizeCatalogRouteBaseUrl(overlay.baseUrl) !== normalizeCatalogRouteBaseUrl(base.baseUrl);
}
function clearRouteBoundCatalogMetadata(entry) {
	const { contextWindow: _contextWindow, contextTokens: _contextTokens, reasoning: _reasoning, input: _input, params: _params, compat: _compat, mediaInput: _mediaInput, ...routeNeutral } = entry;
	return routeNeutral;
}
function overlayCatalogMetadata(base, overlay, options) {
	const routeChanged = catalogRouteChanges(base, overlay);
	const routeBase = routeChanged ? clearRouteBoundCatalogMetadata(base) : base;
	const params = mergeCatalogParams(routeBase.params, overlay.params);
	return {
		...routeBase,
		...routeChanged && !options?.preserveBaseName ? { name: overlay.name } : {},
		...overlay.api !== void 0 ? { api: overlay.api } : {},
		...overlay.baseUrl !== void 0 ? { baseUrl: overlay.baseUrl } : {},
		...overlay.contextWindow !== void 0 ? { contextWindow: overlay.contextWindow } : {},
		...overlay.contextTokens !== void 0 ? { contextTokens: overlay.contextTokens } : {},
		...overlay.reasoning !== void 0 ? { reasoning: overlay.reasoning } : {},
		...overlay.input !== void 0 ? { input: overlay.input } : {},
		...params ? { params } : {},
		...overlay.mediaInput !== void 0 ? { mediaInput: overlay.mediaInput } : {},
		compat: mergeCatalogCompat(routeBase.compat, overlay.compat)
	};
}
function normalizeCatalogEntryContract(entry) {
	if (entry.api === "anthropic-messages" && resolveClaudeFable5ModelIdentity({
		id: entry.id,
		params: entry.params
	})) return {
		...entry,
		reasoning: true
	};
	return entry;
}
function mergeCatalogEntries(models, entries, options) {
	const indexByKey = new Map(models.map((entry, index) => [catalogEntryDedupeKey(entry.provider, entry.id), index]));
	for (const entry of entries) {
		const key = catalogEntryDedupeKey(entry.provider, entry.id);
		const existingIndex = indexByKey.get(key);
		if (existingIndex === void 0) {
			models.push(entry);
			indexByKey.set(key, models.length - 1);
			continue;
		}
		const existing = models.at(existingIndex);
		if (existing) models[existingIndex] = overlayCatalogMetadata(existing, entry, options);
	}
}
function catalogRouteVariantKey(entry) {
	return [
		catalogEntryDedupeKey(entry.provider, entry.id),
		entry.api ?? "",
		normalizeCatalogRouteBaseUrl(entry.baseUrl) ?? ""
	].join("\0");
}
function createModelCatalogRouteVariantCollector() {
	return {
		entries: [],
		indexByKey: /* @__PURE__ */ new Map()
	};
}
function mergeCatalogRouteVariants(collector, entries) {
	for (const entry of entries) {
		const key = catalogRouteVariantKey(entry);
		const existingIndex = collector.indexByKey.get(key);
		if (existingIndex === void 0) {
			collector.entries.push(entry);
			collector.indexByKey.set(key, collector.entries.length - 1);
			continue;
		}
		const existingEntry = collector.entries[existingIndex];
		if (existingEntry === void 0) continue;
		collector.entries[existingIndex] = overlayCatalogMetadata(existingEntry, entry);
	}
}
function createModelCatalogSnapshot(entries, routeVariants) {
	return {
		entries: sortModelCatalogEntries(entries),
		routeVariants: sortModelCatalogEntries(routeVariants.entries)
	};
}
function loadManifestModelCatalog(params) {
	const resolvedSnapshot = params.metadataSnapshot ?? (params.fallbackToMetadataScan === false ? getCurrentPluginMetadataSnapshot({
		config: params.config,
		env: params.env,
		...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
		...params.workspaceDir === void 0 ? { allowWorkspaceScopedSnapshot: true } : {}
	}) : resolvePluginMetadataSnapshot({
		config: params.config,
		...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
		env: params.env ?? process.env,
		allowWorkspaceScopedCurrent: params.workspaceDir === void 0
	}));
	if (!resolvedSnapshot) return [];
	const cached = manifestModelCatalogCache.get(params.config);
	if (cached?.snapshot === resolvedSnapshot) return cached.rows;
	const rows = planManifestModelCatalogRows({ registry: { plugins: resolvedSnapshot.plugins.filter((plugin) => plugin.modelCatalog && isManifestPluginAvailableForControlPlane({
		snapshot: resolvedSnapshot,
		plugin,
		config: params.config
	})) } }).rows.map((row) => {
		const entry = {
			id: row.id,
			name: row.name,
			provider: row.provider,
			api: row.api
		};
		if (row.baseUrl) entry.baseUrl = row.baseUrl;
		const contextWindow = row.contextWindow ?? row.contextTokens;
		if (contextWindow) entry.contextWindow = contextWindow;
		if (row.contextTokens) entry.contextTokens = row.contextTokens;
		if (typeof row.reasoning === "boolean") entry.reasoning = row.reasoning;
		if (row.input?.length) entry.input = [...row.input];
		if (row.compat) entry.compat = row.compat;
		return entry;
	});
	manifestModelCatalogCache.set(params.config, {
		snapshot: resolvedSnapshot,
		rows
	});
	return rows;
}
function sortModelCatalogEntries(entries) {
	return entries.map(normalizeCatalogEntryContract).toSorted((a, b) => {
		const p = a.provider.localeCompare(b.provider);
		if (p !== 0) return p;
		return a.name.localeCompare(b.name);
	});
}
/** Builds the catalog once for a lifecycle generation. No request-time discovery or cache IO. */
async function buildPreparedModelCatalogSnapshot(params) {
	const models = [];
	const routeVariants = createModelCatalogRouteVariantCollector();
	const cfg = params.config;
	const env = params.env ?? process.env;
	const timingEnabled = isDiagnosticFlagEnabled("ingress.timing", cfg);
	const startMs = timingEnabled ? Date.now() : 0;
	const logStage = (stage, extra) => {
		if (!timingEnabled) return;
		const suffix = extra ? ` ${extra}` : "";
		log.info(`model-catalog stage=${stage} elapsedMs=${Date.now() - startMs}${suffix}`);
	};
	try {
		const workspaceDir = params.workspaceDir;
		const manifestMetadataSnapshot = params.metadataSnapshot;
		let manifestPlugins;
		const getManifestPlugins = () => {
			manifestPlugins ??= manifestMetadataSnapshot.plugins;
			return manifestPlugins;
		};
		const { buildShouldSuppressBuiltInModel } = await loadModelSuppression();
		logStage("catalog-deps-ready");
		const entries = params.modelRegistry.getAll();
		logStage("registry-read", `entries=${entries.length}`);
		const shouldSuppressBuiltInModel = buildShouldSuppressBuiltInModel({ config: cfg });
		logStage("suppress-resolver-ready");
		for (const entry of entries) {
			const rawId = normalizeOptionalString(entry?.id) ?? "";
			if (!rawId) continue;
			const provider = normalizeOptionalString(entry?.provider) ?? "";
			if (!provider) continue;
			const id = normalizeConfiguredProviderCatalogModelId(provider, rawId, { manifestPlugins: getManifestPlugins() });
			const baseUrl = normalizeOptionalString(entry?.baseUrl);
			if (shouldSuppressBuiltInModel({
				provider,
				id,
				baseUrl
			})) continue;
			const name = normalizeOptionalString(entry?.name ?? id) || id;
			const contextWindow = typeof entry?.contextWindow === "number" && entry.contextWindow > 0 ? entry.contextWindow : void 0;
			const contextTokens = typeof entry?.contextTokens === "number" && entry.contextTokens > 0 ? entry.contextTokens : void 0;
			const reasoning = typeof entry?.reasoning === "boolean" ? entry.reasoning : void 0;
			const api = typeof entry?.api === "string" ? entry.api : void 0;
			const input = Array.isArray(entry?.input) ? entry.input : void 0;
			const modelParams = entry?.params && typeof entry.params === "object" ? entry.params : void 0;
			const compat = entry?.compat && typeof entry.compat === "object" ? entry.compat : void 0;
			const model = {
				id,
				name,
				provider,
				...api ? { api } : {},
				...baseUrl ? { baseUrl } : {},
				contextWindow,
				...contextTokens !== void 0 ? { contextTokens } : {},
				reasoning,
				input,
				...modelParams ? { params: modelParams } : {},
				compat
			};
			models.push(model);
			mergeCatalogRouteVariants(routeVariants, [model]);
		}
		const manifestModels = loadManifestModelCatalog({
			config: cfg,
			env,
			metadataSnapshot: manifestMetadataSnapshot
		});
		mergeCatalogRouteVariants(routeVariants, manifestModels);
		mergeCatalogEntries(models, manifestModels);
		logStage("manifest-models-merged", `entries=${models.length}`);
		const configuredModels = buildConfiguredModelCatalog({
			cfg,
			manifestPlugins: hasConfiguredProviderModelRows(cfg) ? getManifestPlugins() : void 0
		});
		let augmentEntries;
		if (configuredModels.length > 0) {
			const entriesForAugment = [...models];
			mergeCatalogEntries(entriesForAugment, configuredModels, { preserveBaseName: true });
			augmentEntries = entriesForAugment;
		}
		logStage("configured-models-prepared", `entries=${models.length}`);
		if (!params.readOnly) {
			const { createProviderApiKeyResolverFromPreparedCredentials } = await loadProviderApiKeyResolver();
			const resolveProviderApiKeyForProvider = createProviderApiKeyResolverFromPreparedCredentials(env, params.authCredentials, cfg);
			const resolveProviderApiKey = (providerId) => providerId?.trim() ? resolveProviderApiKeyForProvider(providerId) : {
				apiKey: void 0,
				discoveryApiKey: void 0
			};
			const supplemental = await augmentModelCatalogWithProviderPlugins({
				config: cfg,
				workspaceDir,
				env,
				metadataSnapshot: manifestMetadataSnapshot,
				context: {
					config: cfg,
					agentDir: params.agentDir,
					workspaceDir,
					env,
					resolveProviderApiKey,
					entries: augmentEntries ?? [...models]
				}
			});
			if (supplemental.length > 0) {
				const normalizedSupplemental = [];
				for (const entry of supplemental) normalizedSupplemental.push({
					...entry,
					id: normalizeConfiguredProviderCatalogModelId(entry.provider, entry.id, { manifestPlugins: getManifestPlugins() })
				});
				mergeCatalogRouteVariants(routeVariants, normalizedSupplemental);
				mergeCatalogEntries(models, normalizedSupplemental);
			}
		}
		logStage("plugin-models-merged", `entries=${models.length}`);
		if (configuredModels.length > 0) {
			mergeCatalogRouteVariants(routeVariants, configuredModels);
			mergeCatalogEntries(models, configuredModels, { preserveBaseName: true });
		}
		logStage("configured-models-finalized", `entries=${models.length}`);
		const snapshot = createModelCatalogSnapshot(models, routeVariants);
		logStage("complete", `entries=${snapshot.entries.length}`);
		return snapshot;
	} catch (error) {
		if (!hasLoggedModelCatalogError) {
			hasLoggedModelCatalogError = true;
			log.warn(`Failed to load model catalog: ${String(error)}`);
		}
		throw error;
	}
}
/**
* Check if a model supports image input based on its catalog entry.
*/
function modelSupportsVision(entry) {
	return modelSupportsInput(entry, "image");
}
/**
* Check if a model supports native document/PDF input based on its catalog entry.
*/
function modelSupportsDocument(entry) {
	return modelSupportsInput(entry, "document");
}
//#endregion
export { modelSupportsVision as a, modelSupportsDocument as i, canonicalizePreparedModelCatalogProvider as n, resetModelCatalogBuilderCacheForTest as o, loadManifestModelCatalog as r, buildPreparedModelCatalogSnapshot as t };
