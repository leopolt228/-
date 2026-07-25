import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { g as sortUniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { s as createPluginIdScopeSet, u as normalizePluginIdScope } from "./current-plugin-metadata-snapshot-BQju0mzJ.js";
import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-DKFjs6ns.js";
import { s as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-DbVdNqi2.js";
import { n as resolveBundledPluginCompatibleLoadValues } from "./activation-context-BBDhGwxg.js";
//#region src/plugins/web-provider-resolution-shared.ts
function comparePluginProvidersAlphabetically(left, right) {
	return left.id.localeCompare(right.id) || left.pluginId.localeCompare(right.pluginId);
}
function sortPluginProviders(providers) {
	return providers.toSorted(comparePluginProvidersAlphabetically);
}
/** Sorts provider candidates for auto-detect while keeping equal priorities deterministic. */
function sortPluginProvidersForAutoDetect(providers) {
	return providers.toSorted((left, right) => {
		const leftOrder = left.autoDetectOrder ?? Number.MAX_SAFE_INTEGER;
		const rightOrder = right.autoDetectOrder ?? Number.MAX_SAFE_INTEGER;
		if (leftOrder !== rightOrder) return leftOrder - rightOrder;
		return comparePluginProvidersAlphabetically(left, right);
	});
}
function pluginManifestDeclaresProviderConfig(record, configKey, contract) {
	if ((record.contracts?.[contract]?.length ?? 0) > 0) return true;
	if (Object.keys(record.configUiHints ?? {}).some((key) => key === configKey || key.startsWith(`${configKey}.`))) return true;
	const properties = record.configSchema?.properties;
	return typeof properties === "object" && properties !== null && configKey in properties;
}
function loadInstalledWebProviderManifestRecords(params) {
	const records = loadManifestMetadataSnapshot({
		config: params.config ?? {},
		workspaceDir: params.workspaceDir,
		env: params.env ?? process.env
	}).plugins;
	const pluginIdSet = createPluginIdScopeSet(params.pluginIds);
	return pluginIdSet ? records.filter((plugin) => pluginIdSet.has(plugin.id)) : records;
}
/** Returns only plugin ids for manifest-declared web provider candidates. */
function resolveManifestDeclaredWebProviderCandidatePluginIds(params) {
	return resolveManifestDeclaredWebProviderCandidates(params).pluginIds;
}
/** Resolves manifest-declared web provider candidates without importing plugin runtime code. */
function resolveManifestDeclaredWebProviderCandidates(params) {
	const scopedPluginIds = normalizePluginIdScope(params.onlyPluginIds);
	if (scopedPluginIds?.length === 0) return { pluginIds: [] };
	const onlyPluginIdSet = createPluginIdScopeSet(scopedPluginIds);
	const manifestRecords = params.manifestRecords ?? loadInstalledWebProviderManifestRecords({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		pluginIds: scopedPluginIds
	});
	const ids = manifestRecords.filter((plugin) => (!params.origin || plugin.origin === params.origin) && (!params.sandboxed || plugin.origin === "bundled" || plugin.trustedOfficialInstall === true) && (!onlyPluginIdSet || onlyPluginIdSet.has(plugin.id)) && pluginManifestDeclaresProviderConfig(plugin, params.configKey, params.contract)).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
	if (ids.length > 0) return {
		pluginIds: ids,
		manifestRecords
	};
	if (params.origin || params.sandboxed || scopedPluginIds !== void 0) return {
		pluginIds: [],
		manifestRecords
	};
	return {
		pluginIds: void 0,
		manifestRecords
	};
}
function resolveBundledWebProviderCompatPluginIds(params) {
	return loadInstalledWebProviderManifestRecords(params).filter((plugin) => plugin.origin === "bundled" && (plugin.contracts?.[params.contract]?.length ?? 0) > 0).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
}
/** Builds bundled-plugin activation config for provider families with legacy enablement defaults. */
function resolveBundledWebProviderResolutionConfig(params) {
	const activation = resolveBundledPluginCompatibleLoadValues({
		rawConfig: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir,
		applyAutoEnable: true,
		compatMode: {
			enablement: "always",
			vitest: params.config !== void 0
		},
		resolveCompatPluginIds: (compatParams) => resolveBundledWebProviderCompatPluginIds({
			contract: params.contract,
			...compatParams
		})
	});
	return {
		config: activation.config,
		activationSourceConfig: activation.activationSourceConfig,
		autoEnabledReasons: activation.autoEnabledReasons
	};
}
/** Adds plugin ids to registry provider records, applies an optional plugin scope, then sorts. */
function mapRegistryProviders(params) {
	const onlyPluginIdSet = createPluginIdScopeSet(normalizePluginIdScope(params.onlyPluginIds));
	return params.sortProviders(params.entries.filter((entry) => !onlyPluginIdSet || onlyPluginIdSet.has(entry.pluginId)).map((entry) => Object.assign({}, entry.provider, { pluginId: entry.pluginId })));
}
//#endregion
//#region src/plugins/web-fetch-providers.shared.ts
function sortWebFetchProviders(providers) {
	return sortPluginProviders(providers);
}
function sortWebFetchProvidersForAutoDetect(providers) {
	return sortPluginProvidersForAutoDetect(providers);
}
function resolveBundledWebFetchResolutionConfig(params) {
	return resolveBundledWebProviderResolutionConfig({
		contract: "webFetchProviders",
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
}
//#endregion
//#region src/plugins/web-provider-public-artifacts.explicit.ts
const WEB_SEARCH_ARTIFACT_CANDIDATES = [
	"web-search-contract-api.js",
	"web-search-provider.js",
	"web-search.js"
];
const WEB_FETCH_ARTIFACT_CANDIDATES = [
	"web-fetch-contract-api.js",
	"web-fetch-provider.js",
	"web-fetch.js"
];
const WEB_FETCH_RUNTIME_ARTIFACT_CANDIDATES = ["web-fetch-provider.js", "web-fetch.js"];
function isStringArray(value) {
	return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function isWebProviderPlugin(value) {
	return isRecord(value) && typeof value.id === "string" && typeof value.label === "string" && typeof value.hint === "string" && isStringArray(value.envVars) && typeof value.placeholder === "string" && typeof value.signupUrl === "string" && typeof value.credentialPath === "string" && typeof value.getCredentialValue === "function" && typeof value.setCredentialValue === "function" && typeof value.createTool === "function";
}
function isWebSearchProviderPlugin(value) {
	return isWebProviderPlugin(value);
}
function isWebFetchProviderPlugin(value) {
	return isWebProviderPlugin(value);
}
function collectProviderFactories(params) {
	const providers = [];
	const errors = [];
	for (const [name, exported] of Object.entries(params.mod).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (typeof exported !== "function" || exported.length !== 0 || !name.startsWith("create") || !name.endsWith(params.suffix)) continue;
		let candidate;
		try {
			candidate = exported();
		} catch (error) {
			errors.push(error);
			continue;
		}
		if (params.isProvider(candidate)) providers.push(candidate);
	}
	return {
		providers,
		errors
	};
}
function unableToInitializeProviderError(params) {
	return new Error(`Unable to initialize web providers for plugin ${params.pluginId}`, { cause: params.errors.length === 1 ? params.errors[0] : new AggregateError(params.errors) });
}
function normalizeExplicitBundledPluginIds(pluginIds) {
	return sortUniqueStrings(pluginIds);
}
function loadBundledProviderEntriesFromDir(params) {
	const mod = loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		dirName: params.dirName,
		artifactCandidates: params.artifactCandidates
	});
	if (!mod) return null;
	const { providers, errors } = collectProviderFactories({
		mod,
		suffix: params.suffix,
		isProvider: params.isProvider
	});
	if (providers.length === 0) {
		if (errors.length > 0) throw unableToInitializeProviderError({
			pluginId: params.pluginId,
			errors
		});
		return null;
	}
	return providers.map((provider) => Object.assign({}, provider, { pluginId: params.pluginId }));
}
function loadBundledWebSearchProviderEntriesFromDir(params) {
	return loadBundledProviderEntriesFromDir({
		dirName: params.dirName,
		pluginId: params.pluginId,
		artifactCandidates: WEB_SEARCH_ARTIFACT_CANDIDATES,
		suffix: "WebSearchProvider",
		isProvider: isWebSearchProviderPlugin
	});
}
function loadBundledWebFetchProviderEntriesFromDir(params) {
	return loadBundledProviderEntriesFromDir({
		dirName: params.dirName,
		pluginId: params.pluginId,
		artifactCandidates: WEB_FETCH_ARTIFACT_CANDIDATES,
		suffix: "WebFetchProvider",
		isProvider: isWebFetchProviderPlugin
	});
}
function loadBundledRuntimeWebFetchProviderEntriesFromDir(params) {
	return loadBundledProviderEntriesFromDir({
		dirName: params.dirName,
		pluginId: params.pluginId,
		artifactCandidates: WEB_FETCH_RUNTIME_ARTIFACT_CANDIDATES,
		suffix: "WebFetchProvider",
		isProvider: isWebFetchProviderPlugin
	});
}
function resolveBundledExplicitWebSearchProvidersFromPublicArtifacts(params) {
	const providers = [];
	for (const pluginId of normalizeExplicitBundledPluginIds(params.onlyPluginIds)) {
		const loadedProviders = loadBundledWebSearchProviderEntriesFromDir({
			dirName: pluginId,
			pluginId
		});
		if (!loadedProviders) return null;
		providers.push(...loadedProviders);
	}
	return providers;
}
function resolveBundledExplicitWebFetchProvidersFromPublicArtifacts(params) {
	const providers = [];
	for (const pluginId of normalizeExplicitBundledPluginIds(params.onlyPluginIds)) {
		const loadedProviders = loadBundledWebFetchProviderEntriesFromDir({
			dirName: pluginId,
			pluginId
		});
		if (!loadedProviders) return null;
		providers.push(...loadedProviders);
	}
	return providers;
}
function resolveBundledExplicitRuntimeWebFetchProvidersFromPublicArtifacts(params) {
	const providers = [];
	for (const pluginId of normalizeExplicitBundledPluginIds(params.onlyPluginIds)) {
		const loadedProviders = loadBundledRuntimeWebFetchProviderEntriesFromDir({
			dirName: pluginId,
			pluginId
		});
		if (!loadedProviders) return null;
		providers.push(...loadedProviders);
	}
	return providers;
}
//#endregion
//#region src/plugins/web-search-providers.shared.ts
function sortWebSearchProviders(providers) {
	return sortPluginProviders(providers);
}
function sortWebSearchProvidersForAutoDetect(providers) {
	return sortPluginProvidersForAutoDetect(providers);
}
function resolveBundledWebSearchResolutionConfig(params) {
	return resolveBundledWebProviderResolutionConfig({
		contract: "webSearchProviders",
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
}
//#endregion
export { loadBundledWebSearchProviderEntriesFromDir as a, resolveBundledExplicitWebSearchProvidersFromPublicArtifacts as c, sortWebFetchProvidersForAutoDetect as d, mapRegistryProviders as f, loadBundledWebFetchProviderEntriesFromDir as i, resolveBundledWebFetchResolutionConfig as l, resolveManifestDeclaredWebProviderCandidates as m, sortWebSearchProviders as n, resolveBundledExplicitRuntimeWebFetchProvidersFromPublicArtifacts as o, resolveManifestDeclaredWebProviderCandidatePluginIds as p, sortWebSearchProvidersForAutoDetect as r, resolveBundledExplicitWebFetchProvidersFromPublicArtifacts as s, resolveBundledWebSearchResolutionConfig as t, sortWebFetchProviders as u };
