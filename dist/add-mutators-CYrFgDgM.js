import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { t as getChannelPlugin } from "./registry-DqyhCDsQ.js";
import "./plugins-CJcRWm9n.js";
//#region src/commands/channels/add-mutators.ts
/** Apply a display name to a channel account when the plugin supports account naming. */
function applyAccountName(params) {
	const accountId = normalizeAccountId(params.accountId);
	const apply = (params.plugin ?? getChannelPlugin(params.channel))?.setup?.applyAccountName;
	return apply ? apply({
		cfg: params.cfg,
		accountId,
		name: params.name
	}) : params.cfg;
}
/** Delegate account config mutation to the channel plugin setup contract. */
function applyChannelAccountConfig(params) {
	const accountId = normalizeAccountId(params.accountId);
	const apply = (params.plugin ?? getChannelPlugin(params.channel))?.setup?.applyAccountConfig;
	if (!apply) return params.cfg;
	return apply({
		cfg: params.cfg,
		accountId,
		input: params.input
	});
}
//#endregion
export { applyChannelAccountConfig as n, applyAccountName as t };
