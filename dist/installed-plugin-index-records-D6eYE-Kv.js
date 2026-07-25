import { s as parseRegistryNpmSpec } from "./npm-registry-spec-CqBTTiC9.js";
import { s as resolveInstalledPluginIndexStorePath } from "./installed-plugin-index-record-reader-DjVucfOz.js";
import { a as refreshPersistedInstalledPluginIndex } from "./installed-plugin-index-store-CQB8uMnP.js";
import { t as buildNpmResolutionFields } from "./install-source-utils-D71Lc61M.js";
//#region src/plugins/installs.ts
/** Builds install record fields from resolved npm package metadata. */
function buildNpmResolutionInstallFields(resolution) {
	return buildNpmResolutionFields(resolution);
}
function isExactRegistryNpmSpec(spec) {
	return (spec ? parseRegistryNpmSpec(spec) : null)?.selectorKind === "exact-version";
}
function resolveNpmInstallRecordSpec(params) {
	const resolvedSpec = params.resolution?.resolvedSpec;
	if (!params.pinResolvedRegistrySpec || !isExactRegistryNpmSpec(resolvedSpec)) return params.requestedSpec;
	return resolvedSpec;
}
/** Replaces a plugin install record with the authoritative completed install. */
function recordPluginInstall(cfg, update) {
	const { pluginId, ...record } = update;
	const nextRecord = {
		...record,
		installedAt: record.installedAt ?? (/* @__PURE__ */ new Date()).toISOString()
	};
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			installs: {
				...cfg.plugins?.installs,
				[pluginId]: nextRecord
			}
		}
	};
}
//#endregion
//#region src/plugins/installed-plugin-index-records.ts
/** Config path for legacy plugin install records kept for migration/doctor flows. */
const PLUGIN_INSTALLS_CONFIG_PATH = ["plugins", "installs"];
/** Resolves the installed plugin index record store path. */
function resolveInstalledPluginIndexRecordsStorePath(options = {}) {
	return resolveInstalledPluginIndexStorePath(options);
}
/** Refreshes persisted installed plugin index records asynchronously. */
async function writePersistedInstalledPluginIndexInstallRecords(records, options = {}) {
	await refreshPersistedInstalledPluginIndex({
		...options,
		reason: "source-changed",
		installRecords: records
	});
	return resolveInstalledPluginIndexRecordsStorePath(options);
}
/** Returns config with plugin install records attached at the canonical config path. */
function withPluginInstallRecords(config, records) {
	return {
		...config,
		plugins: {
			...config.plugins,
			installs: records
		}
	};
}
/** Returns config with legacy plugin install records removed. */
function withoutPluginInstallRecords(config, options = {}) {
	if (!config.plugins?.installs) return config;
	const { installs: _installs, ...plugins } = config.plugins;
	if (Object.keys(plugins).length === 0) {
		if (options.preserveEmptyPlugins) return {
			...config,
			plugins: {}
		};
		const { plugins: _plugins, ...rest } = config;
		return rest;
	}
	return {
		...config,
		plugins
	};
}
/** Applies one install update to an in-memory install record map. */
function recordPluginInstallInRecords(records, update) {
	return recordPluginInstall({ plugins: { installs: records } }, update).plugins?.installs ?? {};
}
/** Removes one plugin install record from an in-memory record map. */
function removePluginInstallRecordFromRecords(records, pluginId) {
	const { [pluginId]: _removed, ...rest } = records;
	return rest;
}
//#endregion
export { withPluginInstallRecords as a, buildNpmResolutionInstallFields as c, resolveInstalledPluginIndexRecordsStorePath as i, recordPluginInstall as l, recordPluginInstallInRecords as n, withoutPluginInstallRecords as o, removePluginInstallRecordFromRecords as r, writePersistedInstalledPluginIndexInstallRecords as s, PLUGIN_INSTALLS_CONFIG_PATH as t, resolveNpmInstallRecordSpec as u };
