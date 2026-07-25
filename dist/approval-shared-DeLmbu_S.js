import { t as matchesApprovalRequestFilters } from "./approval-request-filters-BY3zJEnQ.js";
import { n as isChannelExecApprovalClientEnabledFromConfig } from "./approval-client-helpers-B0SKqEKM.js";
import { a as doesApprovalRequestMatchChannelAccount } from "./exec-approval-session-target-BhYJdl58.js";
import "./approval-native-runtime-Baif6NGb.js";
import { s as resolveDiscordAccount } from "./accounts-sZJTKxVc.js";
import { t as getDiscordExecApprovalApprovers } from "./exec-approvals-DidRQAqR.js";
//#region extensions/discord/src/approval-shared.ts
function shouldHandleDiscordApprovalRequest(params) {
	const config = params.configOverride ?? resolveDiscordAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).config.execApprovals;
	const approvers = getDiscordExecApprovalApprovers({
		cfg: params.cfg,
		accountId: params.accountId,
		configOverride: params.configOverride
	});
	if (!doesApprovalRequestMatchChannelAccount({
		cfg: params.cfg,
		request: params.request,
		channel: "discord",
		accountId: params.accountId
	})) return false;
	if (!isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount: approvers.length
	})) return false;
	return matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: config?.agentFilter,
		sessionFilter: config?.sessionFilter
	});
}
//#endregion
export { shouldHandleDiscordApprovalRequest as t };
