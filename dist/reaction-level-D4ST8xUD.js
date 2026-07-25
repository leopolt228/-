import { t as resolveReactionLevel } from "./reaction-level-VzekD6C8.js";
import "./status-helpers-jGB19KP8.js";
import { t as inspectTelegramAccount } from "./account-inspect-C4-91gaP.js";
//#region extensions/telegram/src/reaction-level.ts
/**
* Resolve the effective reaction level and its implications.
*/
function resolveTelegramReactionLevel(params) {
	return resolveReactionLevel({
		value: inspectTelegramAccount({
			cfg: params.cfg,
			accountId: params.accountId
		}).config.reactionLevel,
		defaultLevel: "minimal",
		invalidFallback: "ack"
	});
}
//#endregion
export { resolveTelegramReactionLevel as t };
