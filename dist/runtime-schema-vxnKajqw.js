import "./agent-scope-CrBA-6Gx.js";
import { c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir } from "./agent-scope-config-S7z_Yn4H.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-xuKL7EBL.js";
import { L as collectChannelSchemaMetadata, R as collectPluginSchemaMetadata, l as readConfigFileSnapshot, r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import "./config-BOMcY2yX.js";
import { t as buildConfigSchema } from "./schema-B0qGh61E.js";
//#region src/config/runtime-schema.ts
function loadManifestRegistry(config, env) {
	const workspaceDir = resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
	return resolvePluginMetadataSnapshot({
		config,
		env: env ?? process.env,
		workspaceDir,
		allowWorkspaceScopedCurrent: true
	}).manifestRegistry;
}
/** Builds the config schema from the active runtime config and plugin metadata. */
function loadGatewayRuntimeConfigSchema() {
	const registry = loadManifestRegistry(getRuntimeConfig());
	return buildConfigSchema({
		plugins: collectPluginSchemaMetadata(registry),
		channels: collectChannelSchemaMetadata(registry)
	});
}
async function readBestEffortRuntimeConfigSchema() {
	const snapshot = await readConfigFileSnapshot();
	const registry = loadManifestRegistry(snapshot.valid ? snapshot.config : { plugins: { enabled: true } });
	return buildConfigSchema({
		plugins: snapshot.valid ? collectPluginSchemaMetadata(registry) : [],
		channels: collectChannelSchemaMetadata(registry)
	});
}
//#endregion
export { readBestEffortRuntimeConfigSchema as n, loadGatewayRuntimeConfigSchema as t };
