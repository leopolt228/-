import { u as resolveEffectivePluginActivationState } from "./config-state-rO7K73Ka.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import { r as normalizePluginsConfigWithRegistry, u as loadPluginRegistrySnapshot } from "./plugin-registry-2gpKUE2T.js";
import { L as isDefaultAgentRuntimeId, z as normalizeOptionalAgentRuntimeId } from "./openai-routing-Cq9SwNpx.js";
import { t as resolveAgentHarnessPolicy } from "./policy-CZpNJ432.js";
import { t as resolveManifestActivationPlan } from "./activation-planner-BUwnYWd4.js";
import { d as resolveOwningPluginIdsForProviderRef, n as resolveBundledProviderCompatPluginIds, t as resolveActivatableProviderOwnerPluginIds } from "./providers--CvgyIAL.js";
import { r as withActivatedPluginIds } from "./activation-context-BBDhGwxg.js";
import { s as pluginInstallPathMatchesRoot } from "./runtime-degraded-state-CbW4-KRp.js";
import { r as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-XZ8Sb-m9.js";
//#region src/agents/harness/runtime-plugin.ts
function dedupePluginIds(values) {
	const seen = /* @__PURE__ */ new Set();
	const result = [];
	for (const value of values) {
		const pluginId = value.trim();
		if (!pluginId || seen.has(pluginId)) continue;
		seen.add(pluginId);
		result.push(pluginId);
	}
	return result;
}
function restrictiveAllowlistOmitsPlugin(config, pluginId) {
	const allow = config?.plugins?.allow ?? [];
	return allow.length > 0 && !allow.includes(pluginId);
}
function resolveSelectedMemoryPluginIds(params) {
	const registry = loadPluginRegistrySnapshot({
		config: params.config,
		workspaceDir: params.workspaceDir
	});
	const plugins = normalizePluginsConfigWithRegistry(params.config?.plugins, registry);
	const memorySlot = plugins.slots.memory;
	if (typeof memorySlot !== "string" || memorySlot.trim().length === 0 || restrictiveAllowlistOmitsPlugin(params.config, memorySlot)) return [];
	const plugin = registry.plugins.find((entry) => entry.pluginId === memorySlot);
	if (!plugin?.startup.memory) return [];
	return resolveEffectivePluginActivationState({
		id: plugin.pluginId,
		origin: plugin.origin,
		config: plugins,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin)
	}).activated ? [plugin.pluginId] : [];
}
/** Resolve manifest owners required by one selected non-core harness runtime. */
function resolveAgentHarnessOwnerPluginIds(params) {
	const harnessPluginIds = resolveManifestActivationPlan({
		trigger: {
			kind: "agentHarness",
			runtime: params.runtime
		},
		config: params.config,
		workspaceDir: params.workspaceDir,
		requireExplicitManifestOwnerTrust: true
	}).entries.map((entry) => entry.pluginId);
	if (harnessPluginIds.length === 0) return [];
	if (params.runtime !== "codex") return harnessPluginIds;
	if (!harnessPluginIds.includes("codex")) return harnessPluginIds;
	if (restrictiveAllowlistOmitsPlugin(params.config, "codex")) return harnessPluginIds;
	const providerOwnerPluginIds = dedupePluginIds(resolveOwningPluginIdsForProviderRef({
		provider: params.provider,
		config: params.config,
		workspaceDir: params.workspaceDir
	}) ?? []);
	if (providerOwnerPluginIds.length === 0) return harnessPluginIds;
	const safeProviderOwnerPluginIds = dedupePluginIds([...resolveBundledProviderCompatPluginIds({
		config: params.config,
		workspaceDir: params.workspaceDir,
		onlyPluginIds: providerOwnerPluginIds
	}), ...resolveActivatableProviderOwnerPluginIds({
		pluginIds: providerOwnerPluginIds,
		config: params.config,
		workspaceDir: params.workspaceDir
	})]);
	return dedupePluginIds([
		"codex",
		...harnessPluginIds,
		...providerOwnerPluginIds.filter((pluginId) => pluginId !== "codex" && safeProviderOwnerPluginIds.includes(pluginId))
	]);
}
/**
* Resolves whether manifest-owned harness code is loadable without importing it.
* Callers must pass the result of a payload check performed for this invocation.
*/
function resolveAgentHarnessRuntimeAvailability(params) {
	const runtime = params.runtime.trim();
	const ownerPluginIds = resolveAgentHarnessOwnerPluginIds({
		...params,
		runtime
	});
	if (ownerPluginIds.length === 0) return {
		status: "unavailable",
		ownerPluginIds,
		reason: "owner-plugin-not-activatable",
		detail: `No enabled plugin owns agent harness "${runtime}".`
	};
	const checkedPluginIds = new Set(params.payloadCheckedPluginIds);
	const unverifiedOwner = ownerPluginIds.find((pluginId) => !params.selectedPluginRootDirs.has(pluginId) || !checkedPluginIds.has(pluginId));
	if (unverifiedOwner) return {
		status: "unavailable",
		ownerPluginIds,
		reason: "owner-plugin-unverified",
		detail: `Agent harness "${runtime}" owner plugin "${unverifiedOwner}" payload was not verified.`
	};
	const failedOwner = params.payloadFailures.find((failure) => {
		if (!ownerPluginIds.includes(failure.pluginId)) return false;
		const selectedRootDir = params.selectedPluginRootDirs.get(failure.pluginId);
		return selectedRootDir ? pluginInstallPathMatchesRoot(failure.installPath, selectedRootDir) : false;
	});
	if (failedOwner) return {
		status: "unavailable",
		ownerPluginIds,
		reason: "owner-plugin-degraded",
		detail: `Agent harness "${runtime}" owner plugin "${failedOwner.pluginId}" is unavailable (${failedOwner.reason}).`
	};
	return {
		status: "available",
		ownerPluginIds
	};
}
function withRuntimePluginIdsAllowed(params) {
	if (params.pluginIds.length === 0) return params.config;
	if (restrictiveAllowlistOmitsPlugin(params.config, params.requiredPluginId)) return params.config;
	const allow = dedupePluginIds([...params.config?.plugins?.allow ?? [], ...params.pluginIds]);
	return {
		...params.config,
		plugins: {
			...params.config?.plugins,
			allow
		}
	};
}
/** Ensures the plugin that owns the selected harness runtime is loaded before harness selection. */
async function ensureSelectedAgentHarnessPlugin(params) {
	const pinnedHarnessId = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
	const runtimeOverride = normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
	const policy = resolveAgentHarnessPolicy({
		provider: params.provider,
		modelId: params.modelId,
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		requestTransportOverrides: params.requestTransportOverrides
	});
	const requestedRuntime = pinnedHarnessId ?? runtimeOverride;
	const runtime = requestedRuntime && !isDefaultAgentRuntimeId(requestedRuntime) ? requestedRuntime : policy.runtime;
	if (isDefaultAgentRuntimeId(runtime) || runtime === "openclaw" || isCliRuntimeAliasForProvider({
		runtime,
		provider: params.provider,
		cfg: params.config
	})) return;
	const { ensurePluginRegistryLoaded } = await import("./runtime-registry-loader-7xx4MjHr.js");
	const pluginIds = resolveAgentHarnessOwnerPluginIds({
		runtime,
		provider: params.provider,
		config: params.config,
		workspaceDir: params.workspaceDir
	});
	if (pluginIds.length === 0) return;
	const memoryPluginIds = resolveSelectedMemoryPluginIds({
		config: params.config,
		workspaceDir: params.workspaceDir
	});
	const scopedPluginIds = dedupePluginIds([...pluginIds, ...memoryPluginIds]);
	const configWithAllowedRuntimePlugins = withRuntimePluginIdsAllowed({
		config: params.config,
		requiredPluginId: runtime,
		pluginIds: scopedPluginIds
	});
	const activatedConfig = withActivatedPluginIds({
		config: configWithAllowedRuntimePlugins,
		pluginIds: scopedPluginIds
	}) ?? configWithAllowedRuntimePlugins;
	ensurePluginRegistryLoaded({
		scope: "all",
		...activatedConfig ? {
			config: activatedConfig,
			activationSourceConfig: activatedConfig
		} : {},
		workspaceDir: params.workspaceDir,
		onlyPluginIds: scopedPluginIds
	});
}
//#endregion
export { resolveAgentHarnessOwnerPluginIds as n, resolveAgentHarnessRuntimeAvailability as r, ensureSelectedAgentHarnessPlugin as t };
