import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import { t as createChannelApprovalAuth } from "./approval-auth-helpers-BtEiGp-a.js";
import { i as resolveGoogleChatAccount } from "./accounts-DrnoHLFa.js";
import { i as normalizeGoogleChatTarget, r as isGoogleChatUserTarget } from "./targets--yzBlyzX.js";
//#region extensions/googlechat/src/approval-auth.ts
function normalizeGoogleChatApproverId(value) {
	const normalized = normalizeGoogleChatTarget(String(value));
	if (!normalized || !isGoogleChatUserTarget(normalized)) return;
	const suffix = normalizeLowercaseStringOrEmpty(normalized.slice(6));
	if (!suffix || suffix.includes("@")) return;
	return `users/${suffix}`;
}
const googleChatApproval = createChannelApprovalAuth({
	channelLabel: "Google Chat",
	resolveInputs: ({ cfg, accountId }) => {
		const account = resolveGoogleChatAccount({
			cfg,
			accountId
		}).config;
		return {
			allowFrom: account.allowFrom,
			defaultTo: account.defaultTo
		};
	},
	normalizeApprover: normalizeGoogleChatApproverId
});
const getGoogleChatApprovalApprovers = googleChatApproval.resolveApprovers;
const googleChatApprovalAuth = googleChatApproval.approvalAuth;
//#endregion
export { googleChatApprovalAuth as n, normalizeGoogleChatApproverId as r, getGoogleChatApprovalApprovers as t };
