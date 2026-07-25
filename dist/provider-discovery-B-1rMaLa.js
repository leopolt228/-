import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { o as normalizeProviderId } from "./model-selection-normalize-D7Dhjaxs.js";
import { u as copyProviderCatalogResultProjection } from "./registry-BSBtFA2q.js";
import "./model-selection-Dx2ArePR.js";
//#region src/plugins/provider-discovery.ts
/** Control-plane provider discovery helpers that keep runtime imports lazy until catalog hooks run. */
const DISCOVERY_ORDER = [
	"simple",
	"profile",
	"paired",
	"late"
];
const DANGEROUS_PROVIDER_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"prototype",
	"constructor"
]);
const providerRuntimeLoader = createLazyImportLoader(() => import("./plugins/provider-discovery.runtime.js"));
function loadProviderRuntime() {
	return providerRuntimeLoader.load();
}
function resolveProviderCatalogHook(provider) {
	return provider.catalog;
}
function resolveProviderCatalogOrderHook(provider) {
	return resolveProviderCatalogHook(provider) ?? provider.staticCatalog;
}
function createProviderConfigRecord() {
	return Object.create(null);
}
function isSafeProviderConfigKey(value) {
	return value !== "" && !DANGEROUS_PROVIDER_KEYS.has(value);
}
/** Loads provider runtime discovery and filters to providers that can produce catalog order entries. */
async function resolveRuntimePluginDiscoveryProviders(params) {
	return (await loadProviderRuntime()).resolvePluginDiscoveryProvidersRuntime(params).filter((provider) => resolveProviderCatalogOrderHook(provider));
}
/** Groups plugin providers into stable discovery phases for catalog probing. */
function groupPluginDiscoveryProvidersByOrder(providers) {
	const grouped = {
		simple: [],
		profile: [],
		paired: [],
		late: []
	};
	for (const provider of providers) grouped[resolveProviderCatalogOrderHook(provider)?.order ?? "late"].push(provider);
	for (const order of DISCOVERY_ORDER) grouped[order].sort((a, b) => a.label.localeCompare(b.label));
	return grouped;
}
/** Normalizes a plugin discovery response into safe provider-config keys. */
function normalizePluginDiscoveryResult(params) {
	const result = params.result;
	if (!result) return {};
	const projection = copyProviderCatalogResultProjection(result);
	if (projection.kind === "provider") {
		const normalized = createProviderConfigRecord();
		for (const providerId of [
			params.provider.id,
			...params.provider.aliases ?? [],
			...params.provider.hookAliases ?? []
		]) {
			const normalizedKey = normalizeProviderId(providerId);
			if (!isSafeProviderConfigKey(normalizedKey)) continue;
			normalized[normalizedKey] = projection.provider;
		}
		return normalized;
	}
	const normalized = createProviderConfigRecord();
	if (projection.kind !== "providers") return normalized;
	for (const [key, value] of projection.providers) {
		const normalizedKey = normalizeProviderId(key);
		if (!isSafeProviderConfigKey(normalizedKey) || !value) continue;
		normalized[normalizedKey] = value;
	}
	return normalized;
}
function runProviderCatalog(params) {
	return resolveProviderCatalogHook(params.provider)?.run({
		config: params.config,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		env: params.env,
		resolveProviderApiKey: params.resolveProviderApiKey,
		resolveProviderAuth: params.resolveProviderAuth
	});
}
function runProviderStaticCatalog(params) {
	return params.provider.staticCatalog?.run({
		config: {},
		env: {},
		resolveProviderApiKey: () => ({ apiKey: void 0 }),
		resolveProviderAuth: () => ({
			apiKey: void 0,
			mode: "none",
			source: "none"
		})
	});
}
//#endregion
export { runProviderStaticCatalog as a, runProviderCatalog as i, normalizePluginDiscoveryResult as n, resolveRuntimePluginDiscoveryProviders as r, groupPluginDiscoveryProvidersByOrder as t };
