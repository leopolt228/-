import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import "./agent-scope-CrBA-6Gx.js";
import { a as resolveAgentDir, s as resolveDefaultAgentDir } from "./agent-scope-config-S7z_Yn4H.js";
import { r as loadPreparedModelCatalogOwnerSnapshot } from "./prepared-model-catalog-CoGiwhz3.js";
import { t as canonicalizeModelCatalogProviderAlias } from "./provider-aliases-D4jY8xbd.js";
//#region src/commands/models/list.provider-catalog.ts
/** Lifecycle-owned provider catalog projection for model-list output. */
const SELF_HOSTED_DISCOVERY_PROVIDER_IDS = /* @__PURE__ */ new Set([
	"lmstudio",
	"ollama",
	"sglang",
	"vllm"
]);
async function loadProviderCatalogSnapshot(params, options = {}) {
	return await loadPreparedModelCatalogOwnerSnapshot({
		config: params.cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		agentDir: params.agentDir,
		...params.metadataSnapshot?.workspaceDir ? { workspaceDir: params.metadataSnapshot.workspaceDir } : {},
		...params.env ? { env: params.env } : {},
		...options.readOnly ? { readOnly: true } : {}
	});
}
function resolveProviderFilter(params, metadataSnapshot) {
	const providerFilter = normalizeProviderId(params.providerFilter ?? "");
	return providerFilter ? normalizeProviderId(canonicalizeModelCatalogProviderAlias(providerFilter, {
		cfg: params.cfg,
		metadataSnapshot
	})) : providerFilter;
}
function resolveProviderCatalogAgentDir(params) {
	return params.agentDir ?? (params.agentId ? resolveAgentDir(params.cfg, params.agentId, params.env) : resolveDefaultAgentDir(params.cfg, params.env));
}
/** Returns true when the prepared generation contains rows for a provider filter. */
async function hasProviderRuntimeCatalogForFilter(params) {
	const owner = await loadProviderCatalogSnapshot({
		...params,
		agentDir: resolveProviderCatalogAgentDir(params)
	});
	const providerFilter = resolveProviderFilter({
		...params,
		agentDir: owner.agentDir
	}, owner.metadataSnapshot);
	return owner.modelCatalog.entries.some((entry) => normalizeProviderId(entry.provider) === providerFilter);
}
/** Returns true when the prepared generation captured static provider-hook rows. */
async function hasProviderStaticCatalogForFilter(params) {
	const resolvedParams = {
		...params,
		agentDir: resolveProviderCatalogAgentDir(params)
	};
	const owner = await loadProviderCatalogSnapshot(resolvedParams, { readOnly: true });
	const providerFilter = resolveProviderFilter(resolvedParams, owner.metadataSnapshot);
	return (owner.modelCatalog.staticEntries ?? []).some((entry) => !providerFilter || normalizeProviderId(entry.provider) === providerFilter);
}
/** Projects provider rows from the committed model catalog without discovery or cache IO. */
async function loadProviderCatalogModelsForList(params) {
	const owner = await loadProviderCatalogSnapshot(params, { readOnly: params.staticOnly === true });
	const providerFilter = resolveProviderFilter(params, owner.metadataSnapshot);
	return (params.staticOnly ? owner.modelCatalog.staticEntries ?? [] : owner.modelCatalog.entries).filter((entry) => {
		const provider = normalizeProviderId(entry.provider);
		if (!providerFilter && SELF_HOSTED_DISCOVERY_PROVIDER_IDS.has(provider)) return false;
		return !providerFilter || provider === providerFilter;
	}).map((entry) => Object.assign({}, entry));
}
//#endregion
export { hasProviderRuntimeCatalogForFilter, hasProviderStaticCatalogForFilter, loadProviderCatalogModelsForList };
