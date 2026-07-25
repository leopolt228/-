import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
//#region extensions/discord/subagent-hooks-api.ts
const loadDiscordSubagentHooksModule = createLazyRuntimeModule(() => import("./subagent-hooks-DNjYK8PR.js"));
const loadDiscordSubagentProgressModule = createLazyRuntimeModule(() => import("./subagent-progress-YlgHWQLx.js"));
function registerDiscordSubagentHooks(api) {
	api.on("gateway_start", async () => {
		const { recoverDiscordSubagentProgress } = await loadDiscordSubagentProgressModule();
		await recoverDiscordSubagentProgress(api);
	});
	api.on("subagent_progress", async (event) => {
		const { handleDiscordSubagentProgress } = await loadDiscordSubagentProgressModule();
		await handleDiscordSubagentProgress(api, event);
	});
	api.on("subagent_ended", async (event) => {
		const { handleDiscordSubagentEnded } = await loadDiscordSubagentHooksModule();
		handleDiscordSubagentEnded(event);
	});
	api.on("subagent_delivery_target", async (event) => {
		const { handleDiscordSubagentDeliveryTarget } = await loadDiscordSubagentHooksModule();
		return handleDiscordSubagentDeliveryTarget(event);
	});
}
//#endregion
export { registerDiscordSubagentHooks as t };
