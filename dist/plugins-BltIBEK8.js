import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { t as buildGatewayReloadPlan } from "./config-reload-plan-C7YQQ1O9.js";
import { t as resolveGatewayReloadSettings } from "./config-reload-settings-ClCwjkB3.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { Hm as buildClawHubTrustErrorDetails, Um as isClawHubTrustErrorCode, an as validatePluginsListParams, in as validatePluginsInstallParams, on as validatePluginsRefreshParams, pn as validatePluginsUninstallParams, sn as validatePluginsSearchParams, un as validatePluginsSetEnabledParams } from "./src-Cy32TawB.js";
import { t as searchInstallablePluginPackages } from "./catalog-search-C40npXhY.js";
import { a as listManagedPlugins, c as setManagedPluginEnabled, i as installManagedPlugin, l as uninstallManagedPlugin, r as formatManagedPluginLifecycleError, t as ManagedPluginLifecycleError } from "./management-service-WQX5Pr_W.js";
import { t as assertValidParams } from "./validation-5fLHFuIF.js";
//#region src/gateway/server-methods/plugins.ts
function pluginPolicyRestartRequired(params) {
	const plan = buildGatewayReloadPlan([...params.changedPaths]);
	const mode = resolveGatewayReloadSettings(params.config).mode;
	return plan.restartGateway || mode === "off" || mode === "restart";
}
/** Gateway handlers for plugin inventory, ClawHub search, install, and policy state. */
const pluginsHandlers = {
	"plugins.refresh": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validatePluginsRefreshParams, "plugins.refresh", respond)) return;
		context.notifyPluginMetadataChanged();
		respond(true, { ok: true }, void 0);
	},
	"plugins.list": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validatePluginsListParams, "plugins.list", respond)) return;
		try {
			respond(true, await listManagedPlugins({ config: context.getRuntimeConfig() }), void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatManagedPluginLifecycleError(error)));
		}
	},
	"plugins.search": async ({ params, respond }) => {
		if (!assertValidParams(params, validatePluginsSearchParams, "plugins.search", respond)) return;
		try {
			respond(true, { results: (await searchInstallablePluginPackages({
				query: params.query,
				limit: params.limit
			})).flatMap((entry) => {
				if (entry.package.family !== "code-plugin" && entry.package.family !== "bundle-plugin") return [];
				const downloads = entry.package.stats?.downloads;
				return [{
					score: entry.score,
					package: {
						name: entry.package.name,
						displayName: entry.package.displayName,
						family: entry.package.family,
						channel: entry.package.channel,
						isOfficial: entry.package.isOfficial,
						...entry.package.summary ? { summary: entry.package.summary } : {},
						...entry.package.latestVersion ? { latestVersion: entry.package.latestVersion } : {},
						...entry.package.runtimeId ? { runtimeId: entry.package.runtimeId } : {},
						...typeof downloads === "number" && Number.isFinite(downloads) && downloads >= 0 ? { downloads } : {},
						...entry.package.verificationTier ? { verificationTier: entry.package.verificationTier } : {}
					}
				}];
			}) }, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatManagedPluginLifecycleError(error)));
		}
	},
	"plugins.install": async ({ params, respond }) => {
		if (!assertValidParams(params, validatePluginsInstallParams, "plugins.install", respond)) return;
		try {
			const result = await installManagedPlugin({ request: params });
			respond(true, {
				ok: true,
				plugin: result.plugin,
				restartRequired: true,
				...result.warnings ? { warnings: result.warnings } : {}
			}, void 0);
		} catch (error) {
			const lifecycleError = error instanceof ManagedPluginLifecycleError ? error : void 0;
			const trustCode = lifecycleError?.code && isClawHubTrustErrorCode(lifecycleError.code) ? lifecycleError.code : void 0;
			const details = lifecycleError ? buildClawHubTrustErrorDetails({
				...trustCode ? { code: trustCode } : {},
				...lifecycleError.version ? { version: lifecycleError.version } : {},
				...lifecycleError.warning ? { warning: lifecycleError.warning } : {}
			}) : void 0;
			respond(false, void 0, errorShape(lifecycleError?.kind === "invalid-request" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatManagedPluginLifecycleError(error), details ? { details } : void 0));
		}
	},
	"plugins.uninstall": async ({ params, respond }) => {
		if (!assertValidParams(params, validatePluginsUninstallParams, "plugins.uninstall", respond)) return;
		try {
			const result = await uninstallManagedPlugin({ pluginId: params.pluginId });
			respond(true, {
				ok: true,
				pluginId: result.pluginId,
				restartRequired: true,
				removed: result.removed,
				...result.warnings ? { warnings: result.warnings } : {}
			}, void 0);
		} catch (error) {
			respond(false, void 0, errorShape((error instanceof ManagedPluginLifecycleError ? error : void 0)?.kind === "invalid-request" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatManagedPluginLifecycleError(error)));
		}
	},
	"plugins.setEnabled": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validatePluginsSetEnabledParams, "plugins.setEnabled", respond)) return;
		try {
			const result = await setManagedPluginEnabled({
				pluginId: params.pluginId,
				enabled: params.enabled
			});
			respond(true, {
				ok: true,
				plugin: result.plugin,
				restartRequired: pluginPolicyRestartRequired({
					config: context.getRuntimeConfig(),
					changedPaths: result.changedPaths
				}),
				...result.warnings ? { warnings: result.warnings } : {}
			}, void 0);
		} catch (error) {
			respond(false, void 0, errorShape((error instanceof ManagedPluginLifecycleError ? error : void 0)?.kind === "invalid-request" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatManagedPluginLifecycleError(error)));
		}
	}
};
//#endregion
export { pluginsHandlers };
