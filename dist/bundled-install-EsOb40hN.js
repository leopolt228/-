import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as validateJsonSchemaValue } from "./schema-validator-fsGhGcGu.js";
import { t as buildNpmResolutionFields } from "./install-source-utils-D71Lc61M.js";
import { n as persistPluginInstall } from "./install-persistence-D09iWvZG.js";
//#region src/cli/npm-resolution.ts
/** Build the npm section of a plugin install record. */
function buildNpmInstallRecordFields(params) {
	return {
		source: "npm",
		spec: params.spec,
		installPath: params.installPath,
		version: params.version,
		...buildNpmResolutionFields(params.resolution)
	};
}
/** CLI adapter for npm install-record pinning with styled warning output. */
function resolvePinnedNpmInstallRecordForCli(rawSpec, pin, installPath, version, resolution, log, warnFormat) {
	const resolvedSpec = resolution?.resolvedSpec;
	const recordSpec = pin && resolvedSpec ? resolvedSpec : rawSpec;
	if (pin) if (resolvedSpec) log(`Pinned npm install record to ${resolvedSpec}.`);
	else log(warnFormat("Could not resolve exact npm version for --pin; storing original npm spec."));
	return buildNpmInstallRecordFields({
		spec: recordSpec,
		installPath,
		version,
		resolution
	});
}
//#endregion
//#region src/plugins/bundled-install.ts
function hasValidBundledPluginConfig(params) {
	if (!params.bundledSource.requiresConfig) return true;
	if (!isRecord(params.existingEntry)) return false;
	const config = params.existingEntry.config;
	if (!isRecord(config)) return false;
	if (!params.bundledSource.configSchema) return Object.keys(config).length > 0;
	return validateJsonSchemaValue({
		schema: params.bundledSource.configSchema,
		cacheKey: `bundled-install:${params.bundledSource.pluginId}`,
		value: config,
		applyDefaults: true
	}).ok;
}
function prepareConfigForDisabledBundledInstall(config, pluginId) {
	const { [pluginId]: _removedEntry, ...nextEntries } = config.plugins?.entries ?? {};
	return {
		...config,
		plugins: {
			...config.plugins,
			entries: nextEntries
		}
	};
}
async function installBundledPluginSource(params) {
	const existingEntry = params.snapshot.config.plugins?.entries?.[params.bundledSource.pluginId];
	const shouldEnable = hasValidBundledPluginConfig({
		bundledSource: params.bundledSource,
		existingEntry
	});
	const configBase = shouldEnable ? params.snapshot.config : prepareConfigForDisabledBundledInstall(params.snapshot.config, params.bundledSource.pluginId);
	const configWarning = shouldEnable ? void 0 : `Installed bundled plugin "${params.bundledSource.pluginId}" without enabling it because it requires configuration first. Configure it, then run \`openclaw plugins enable ${params.bundledSource.pluginId}\`.`;
	const warnings = [params.warning, configWarning].filter((warning) => Boolean(warning));
	await persistPluginInstall({
		snapshot: {
			...params.snapshot,
			config: configBase
		},
		pluginId: params.bundledSource.pluginId,
		install: {
			source: "path",
			spec: params.rawSpec,
			sourcePath: params.bundledSource.localPath,
			installPath: params.bundledSource.localPath
		},
		enable: shouldEnable,
		invalidateRuntimeCache: params.invalidateRuntimeCache,
		...warnings.length > 0 ? { warningMessage: warnings.join("\n") } : {},
		runtime: params.runtime
	});
	return {
		pluginId: params.bundledSource.pluginId,
		warnings
	};
}
//#endregion
export { buildNpmInstallRecordFields as n, resolvePinnedNpmInstallRecordForCli as r, installBundledPluginSource as t };
