import { a as resolveDurableWorkerProviderAutoEnabledReasons } from "./worker-provider-registry--meupQ0q.js";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CfiuJbRJ.js";
import { _ as pinActivePluginSessionExtensionRegistry, h as pinActivePluginChannelRegistry } from "./runtime-BapEso0o.js";
import { a as formatPluginVerificationDiagnostic, i as findActiveDegradedPlugin } from "./runtime-degraded-state-CbW4-KRp.js";
import { c as setPluginSubagentOverridePolicies, n as createGatewaySubagentRuntime, s as loadGatewayPlugins, t as createGatewayNodesRuntime } from "./server-plugins-Cct9l_MT.js";
import { t as primeConfiguredBindingRegistry } from "./binding-registry-BHd83N1D.js";
import { n as setGatewayNodesRuntime, r as setGatewaySubagentRuntime } from "./gateway-bindings-mC4XKGVC.js";
import { t as mergeActivationSectionsIntoRuntimeConfig } from "./plugin-activation-runtime-config-CA0YTtbC.js";
//#region src/gateway/server-plugin-bootstrap.ts
function installGatewayPluginRuntimeEnvironment(cfg) {
	setPluginSubagentOverridePolicies(cfg);
	setGatewaySubagentRuntime(createGatewaySubagentRuntime());
	setGatewayNodesRuntime(createGatewayNodesRuntime());
}
function pinGatewayPluginRuntimeRegistries(pluginRegistry) {
	pinActivePluginChannelRegistry(pluginRegistry);
	pinActivePluginSessionExtensionRegistry(pluginRegistry);
}
function logGatewayPluginDiagnostics(params) {
	for (const diag of params.diagnostics) {
		const degradedPlugin = diag.pluginId ? findActiveDegradedPlugin(diag.pluginId) : void 0;
		if (diag.code === "plugin-verification" && degradedPlugin && diag.message === formatPluginVerificationDiagnostic(degradedPlugin.diagnostic)) continue;
		const details = [diag.pluginId ? `plugin=${diag.pluginId}` : null, diag.source ? `source=${diag.source}` : null].filter((entry) => Boolean(entry)).join(", ");
		const message = details ? `[plugins] ${diag.message} (${details})` : `[plugins] ${diag.message}`;
		if (diag.level === "error") params.log.error(message);
		else params.log.info(message);
	}
}
/** Prepares gateway plugin runtime and returns the loaded plugin registry state. */
function prepareGatewayPluginLoad(params) {
	const activationSourceConfig = params.activationSourceConfig ?? params.cfg;
	const autoEnabled = applyPluginAutoEnable({
		config: activationSourceConfig,
		env: process.env,
		...params.pluginLookUpTable?.manifestRegistry ? { manifestRegistry: params.pluginLookUpTable.manifestRegistry } : {},
		discovery: params.pluginLookUpTable?.discovery
	});
	const resolvedConfig = activationSourceConfig === params.cfg ? autoEnabled.config : mergeActivationSectionsIntoRuntimeConfig({
		runtimeConfig: params.cfg,
		activationConfig: autoEnabled.config
	});
	const durableReasons = params.pluginLookUpTable ? resolveDurableWorkerProviderAutoEnabledReasons(params.pluginLookUpTable.manifestRegistry, params.pluginLookUpTable.workerProviderIds) : {};
	const autoEnabledReasons = {
		...autoEnabled.autoEnabledReasons,
		...durableReasons
	};
	installGatewayPluginRuntimeEnvironment(resolvedConfig);
	const loaded = loadGatewayPlugins({
		cfg: resolvedConfig,
		activationSourceConfig,
		autoEnabledReasons,
		workspaceDir: params.workspaceDir,
		log: params.log,
		...params.coreGatewayHandlers !== void 0 && { coreGatewayHandlers: params.coreGatewayHandlers },
		...params.coreGatewayMethodNames !== void 0 && { coreGatewayMethodNames: params.coreGatewayMethodNames },
		...params.hostServices !== void 0 && { hostServices: params.hostServices },
		baseMethods: params.baseMethods,
		pluginIds: params.pluginIds,
		pluginLookUpTable: params.pluginLookUpTable,
		preferSetupRuntimeForChannelPlugins: params.preferSetupRuntimeForChannelPlugins,
		suppressPluginInfoLogs: params.suppressPluginInfoLogs,
		startupTrace: params.startupTrace
	});
	params.beforePrimeRegistry?.(loaded.pluginRegistry);
	primeConfiguredBindingRegistry({ cfg: resolvedConfig });
	if ((params.logDiagnostics ?? true) && loaded.pluginRegistry.diagnostics.length > 0) logGatewayPluginDiagnostics({
		diagnostics: loaded.pluginRegistry.diagnostics,
		log: params.log
	});
	return loaded;
}
/** Loads and pins gateway plugins during normal gateway startup. */
function loadGatewayStartupPlugins(params) {
	return prepareGatewayPluginLoad({
		...params,
		beforePrimeRegistry: pinGatewayPluginRuntimeRegistries
	});
}
/** Reloads deferred gateway plugins while preserving startup bootstrap behavior. */
function reloadDeferredGatewayPlugins(params) {
	return prepareGatewayPluginLoad({
		...params,
		beforePrimeRegistry: pinGatewayPluginRuntimeRegistries
	});
}
//#endregion
export { loadGatewayStartupPlugins, prepareGatewayPluginLoad, reloadDeferredGatewayPlugins };
