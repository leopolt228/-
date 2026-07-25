import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { t as quoteCliArg } from "./quote-cli-arg-BriMa9wW.js";
import { t as countFailedChannelIngressQueueEntries } from "./ingress-queue-CRq_mALB.js";
import { t as note } from "./note-AoV1Tth-.js";
//#region src/commands/doctor-channel-ingress.ts
/** Mention channel accounts with retained ingress failures and their recovery command. */
function noteChannelIngressDeadLetters(options = {}) {
	const failed = countFailedChannelIngressQueueEntries(options.stateDir);
	if (failed.length === 0) return;
	const lines = failed.map((entry) => `- ${entry.channelId}/${entry.accountId}: ${entry.count} dead-lettered ingress event${entry.count === 1 ? "" : "s"}.`);
	const first = failed[0];
	if (first) lines.push(`- Inspect with ${formatCliCommand([
		"openclaw",
		"channels",
		"dead-letters",
		"list",
		"--channel",
		first.channelId,
		"--account",
		first.accountId
	].map(quoteCliArg).join(" "))}.`);
	(options.noteFn ?? note)(lines.join("\n"), "Channel ingress");
}
//#endregion
export { noteChannelIngressDeadLetters };
