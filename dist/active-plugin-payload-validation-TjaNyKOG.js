import { i as resolveTrustedSourceLinkedOfficialNpmSpec, r as resolveTrustedSourceLinkedOfficialClawHubSpec } from "./official-external-install-records-D9zTV9de.js";
import { c as normalizePluginsConfig, l as resolveEffectiveEnableState } from "./config-state-rO7K73Ka.js";
import { r as runPluginPayloadSmokeCheck } from "./plugin-payload-validation-BZDClrOg.js";
//#region src/cli/update-cli/active-plugin-payload-validation.ts
/** Runs the static payload check without repair, installs, or network access. */
async function runActivePluginPayloadSmokeCheck(params) {
	return await runPluginPayloadSmokeCheck({
		records: filterRecordsToActive({
			cfg: params.cfg,
			records: params.records
		}),
		env: params.env
	});
}
/** Selects the installed records covered by update/startup payload verification. */
function filterRecordsToActive(params) {
	const normalizedPluginConfig = normalizePluginsConfig(params.cfg.plugins);
	const filtered = {};
	for (const [pluginId, record] of Object.entries(params.records)) {
		if (!record || typeof record !== "object") continue;
		if (resolveEffectiveEnableState({
			id: pluginId,
			origin: "global",
			config: normalizedPluginConfig,
			rootConfig: params.cfg
		}).enabled) {
			filtered[pluginId] = record;
			continue;
		}
		const officialNpm = resolveTrustedSourceLinkedOfficialNpmSpec({
			pluginId,
			record
		});
		const officialClawHub = resolveTrustedSourceLinkedOfficialClawHubSpec({
			pluginId,
			record
		});
		if (officialNpm || officialClawHub) filtered[pluginId] = record;
	}
	return filtered;
}
//#endregion
export { runActivePluginPayloadSmokeCheck as n, filterRecordsToActive as t };
