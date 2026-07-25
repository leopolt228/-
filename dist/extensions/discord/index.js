import { t as defineBundledChannelEntry } from "../../channel-entry-contract-BSG1ye8N.js";
import { t as registerDiscordActivities } from "../../activities-api-BfMwnAlH.js";
import { t as registerDiscordSubagentHooks } from "../../subagent-hooks-api-Ds4A82dg.js";
import { t as discordVoiceTranscriptsSourceProvider } from "../../transcripts-source-PVYIDfuT.js";
//#region extensions/discord/index.ts
var discord_default = defineBundledChannelEntry({
	id: "discord",
	name: "Discord",
	description: "Discord channel plugin",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "discordPlugin"
	},
	runtime: {
		specifier: "./runtime-setter-api.js",
		exportName: "setDiscordRuntime"
	},
	accountInspect: {
		specifier: "./account-inspect-api.js",
		exportName: "inspectDiscordReadOnlyAccount"
	},
	registerFull(api) {
		registerDiscordActivities(api);
		registerDiscordSubagentHooks(api);
		api.registerTranscriptSourceProvider(discordVoiceTranscriptsSourceProvider);
	}
});
//#endregion
export { discord_default as default };
