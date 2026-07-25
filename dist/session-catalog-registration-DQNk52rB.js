import { r as registerClaudeSessionCatalog } from "./session-catalog-9B1_uNMR.js";
import { t as createClaudeSessionNodeHostCommands } from "./session-catalog-node-commands-BiR2X19T.js";
//#region extensions/anthropic/session-catalog-registration.ts
function isClaudeSessionCatalogEnabled(pluginConfig) {
	if (!pluginConfig || typeof pluginConfig !== "object") return true;
	const sessionCatalog = pluginConfig.sessionCatalog;
	return !(sessionCatalog && typeof sessionCatalog === "object" && sessionCatalog.enabled === false);
}
function registerClaudeSessionDiscovery(api) {
	if (!isClaudeSessionCatalogEnabled(api.pluginConfig)) return;
	registerClaudeSessionCatalog(api);
	for (const command of createClaudeSessionNodeHostCommands()) api.registerNodeHostCommand(command);
}
//#endregion
export { registerClaudeSessionDiscovery as t };
