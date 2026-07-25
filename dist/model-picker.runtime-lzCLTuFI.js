import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-COWbwBfI.js";
import { n as resolvePluginProviders } from "./providers.runtime-rdUuPAIP.js";
import { i as runProviderPluginAuthMethod } from "./provider-auth-choice-C6-OW3cA.js";
import { t as sortFlowContributionsByLabel } from "./types-CnTXyUgM.js";
import { n as resolveProviderPluginChoice, r as runProviderModelSelectedHook, t as resolveProviderModelPickerEntries } from "./provider-wizard-DtEJ3gK8.js";
//#region src/flows/provider-flow.runtime.ts
function resolveProviderDocsById(params) {
	return new Map(resolvePluginProviders({
		config: params?.config,
		workspaceDir: params?.workspaceDir,
		env: params?.env,
		mode: "setup"
	}).filter((provider) => Boolean(normalizeOptionalString(provider.docsPath))).map((provider) => [provider.id, normalizeOptionalString(provider.docsPath)]));
}
/** Resolves provider model-picker options without exposing contribution metadata. */
function resolveProviderModelPickerFlowEntries(params) {
	return resolveProviderModelPickerFlowContributions(params).map((contribution) => contribution.option);
}
/** Resolves provider model-picker contributions with docs metadata for setup UIs. */
function resolveProviderModelPickerFlowContributions(params) {
	const docsByProvider = resolveProviderDocsById(params ?? {});
	return sortFlowContributionsByLabel(resolveProviderModelPickerEntries(params ?? {}).map((entry) => {
		const providerId = entry.value.startsWith("provider-plugin:") ? expectDefined(entry.value.slice(16).split(":").at(0), "provider id") : entry.value;
		const docsPath = docsByProvider.get(providerId);
		return {
			id: `provider:model-picker:${entry.value}`,
			kind: "provider",
			surface: "model-picker",
			providerId,
			option: {
				value: entry.value,
				label: entry.label,
				...entry.hint ? { hint: entry.hint } : {},
				...docsPath ? { docs: { path: docsPath } } : {}
			},
			source: "runtime"
		};
	}));
}
//#endregion
//#region src/commands/model-picker.runtime.ts
/** Runtime dependency bundle for provider/model picker flows. */
/** Lazy runtime methods consumed by model picker command flows. */
const modelPickerRuntime = {
	resolveProviderModelPickerContributions: resolveProviderModelPickerFlowContributions,
	resolveProviderModelPickerEntries: resolveProviderModelPickerFlowEntries,
	resolveProviderPluginChoice,
	runProviderModelSelectedHook,
	resolvePluginProviders,
	runProviderPluginAuthMethod
};
//#endregion
export { modelPickerRuntime };
