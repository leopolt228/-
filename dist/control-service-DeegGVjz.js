import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import { a as resolveProfile, r as resolveBrowserConfig } from "./config-BP-Yt4hA.js";
import "./config-Dal53Qjv.js";
import { t as ensureBrowserControlAuth } from "./control-auth-CaegG-eA.js";
import "./bounded-utf8-tail-LZgvn9vd.js";
import { a as getExtensionRelayModule, o as loadBrowserConfigForRuntimeRefresh } from "./server-context-Cb2rq3u2.js";
import { a as stopBrowserControlRuntime, i as getBrowserControlState, o as withBrowserControlStart, r as ensureBrowserControlRuntime, t as isDefaultBrowserPluginEnabled } from "./plugin-enabled-CWHgPaX8.js";
//#region extensions/browser/src/control-service.ts
/**
* Browser control service lifecycle for plugin-managed, in-process operation.
*/
const logService = createSubsystemLogger("browser").child("service");
async function startBrowserControlServiceUnlocked() {
	const current = getBrowserControlState();
	if (current) return current;
	const cfg = getRuntimeConfig();
	const browserCfg = loadBrowserConfigForRuntimeRefresh();
	if (!isDefaultBrowserPluginEnabled(browserCfg)) return null;
	let resolved = resolveBrowserConfig(browserCfg.browser, browserCfg);
	if (!resolved.enabled) return null;
	try {
		if ((await ensureBrowserControlAuth({ cfg })).generatedToken) logService.info("No browser auth configured; generated gateway.auth.token automatically.");
	} catch (err) {
		logService.warn(`failed to auto-configure browser auth: ${String(err)}`);
	}
	const hasExtensionProfiles = Object.values(resolved.profiles).some((profile) => profile.driver === "extension");
	if (hasExtensionProfiles) {
		const { ensureExtensionRelayToken } = await import("./relay-auth-CsfbCeHt.js");
		ensureExtensionRelayToken();
		const refreshed = loadBrowserConfigForRuntimeRefresh();
		resolved = resolveBrowserConfig(refreshed.browser, refreshed);
	}
	const state = await ensureBrowserControlRuntime({
		server: null,
		port: resolved.controlPort,
		resolved,
		owner: "service",
		onWarn: (message) => logService.warn(message)
	});
	if (hasExtensionProfiles) {
		const { startConfiguredExtensionRelays } = await getExtensionRelayModule();
		await startConfiguredExtensionRelays(state, (name) => resolveProfile(resolved, name), (message) => logService.warn(message));
	}
	logService.info(`Browser control service ready (profiles=${Object.keys(resolved.profiles).length})`);
	return state;
}
/** Starts Browser control without binding the HTTP server when config enables it. */
async function startBrowserControlServiceFromConfig() {
	return await withBrowserControlStart(startBrowserControlServiceUnlocked);
}
/** Stops the in-process Browser control service runtime. */
async function stopBrowserControlService() {
	await stopBrowserControlRuntime({
		requestedBy: "service",
		onWarn: (message) => logService.warn(message)
	});
}
//#endregion
export { stopBrowserControlService as n, startBrowserControlServiceFromConfig as t };
