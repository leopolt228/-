import { i as resolveOpenProviderRuntimeGroupPolicy } from "../../runtime-group-policy-B5DjRp_T.js";
import "../../runtime-group-policy-CXo40VxH.js";
import { a as mergeDiscordAccountConfig, f as resolveDiscordMaxLinesPerMessage, i as listEnabledDiscordAccounts, l as resolveDiscordAccountConfig, o as resolveDefaultDiscordAccountId, r as listDiscordAccountIds, s as resolveDiscordAccount, t as createDiscordActionGate } from "../../accounts-sZJTKxVc.js";
import { a as DISCORD_MODAL_CUSTOM_ID_KEY, c as buildDiscordModalCustomId, d as parseDiscordComponentCustomId, f as parseDiscordComponentCustomIdForInteraction, i as DISCORD_COMPONENT_CUSTOM_ID_KEY, m as parseDiscordModalCustomIdForInteraction, p as parseDiscordModalCustomId, s as buildDiscordComponentCustomId, t as buildDiscordInteractiveComponents } from "../../shared-interactive-BIE-HOsa.js";
import { a as buildDiscordComponentMessageFlags, c as resolveDiscordComponentAttachmentName, i as buildDiscordComponentMessage, n as DiscordFormModal, o as DISCORD_COMPONENT_ATTACHMENT_PREFIX, r as createDiscordFormModal, s as readDiscordComponentSpec, t as formatDiscordComponentEventText } from "../../components-c2rsSkay.js";
import { i as requestDiscord, n as DiscordApiError, r as fetchDiscord } from "../../api-DBqgGgOO.js";
import { n as resolveDiscordChannelId, t as parseDiscordTarget } from "../../target-parsing-BJUDamFJ.js";
import { i as normalizeDiscordOutboundTarget, n as looksLikeDiscordTargetId, r as normalizeDiscordMessagingTarget } from "../../normalize-CG-Mvei1.js";
import { n as resolveDiscordTarget, r as parseDiscordSendTarget } from "../../target-resolver-xYpv55lm.js";
import { t as inspectDiscordAccount } from "../../account-inspect-MzLTocAh.js";
import { i as DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, n as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, r as DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, t as DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS } from "../../timeouts-DB8J_ZTL.js";
import "../../targets-DgL1mmXR.js";
import { i as shouldSuppressLocalDiscordExecApprovalPrompt, n as isDiscordExecApprovalApprover, r as isDiscordExecApprovalClientEnabled, t as getDiscordExecApprovalApprovers } from "../../exec-approvals-DidRQAqR.js";
import { i as resolveDiscordGroupToolPolicy, n as collectDiscordStatusIssues, r as resolveDiscordGroupRequireMention, t as discordPlugin } from "../../channel-BvGIEK3U.js";
import { t as normalizeExplicitDiscordSessionKey } from "../../session-key-normalization-Dr7FmQ_A.js";
import { t as discordSetupPlugin } from "../../channel.setup-VCY9Psre.js";
import { n as handleDiscordSubagentEnded, r as handleDiscordSubagentSpawning, t as handleDiscordSubagentDeliveryTarget } from "../../subagent-hooks-CCNbOLuo.js";
import { t as tryHandleDiscordMessageActionGuildAdmin } from "../../handle-action.guild-admin-CfkiKtis.js";
import { n as listDiscordDirectoryPeersFromConfig, t as listDiscordDirectoryGroupsFromConfig } from "../../directory-config-Bzx3VNpN.js";
import { t as fetchPluralKitMessageInfo } from "../../pluralkit-DI0SBjB9.js";
import { a as resolveDiscordPrivilegedIntentsFromFlags, i as probeDiscord, n as fetchDiscordApplicationSummary, r as parseApplicationIdFromToken, t as fetchDiscordApplicationId } from "../../probe-C0rG91kp.js";
import { t as collectDiscordSecurityAuditFindings } from "../../security-audit-CLoo2mC5.js";
//#region extensions/discord/api.ts
const handleDiscordMessageAction = async (...args) => (await import("../../channel-actions.runtime-Cvjkg3BP.js")).handleDiscordMessageAction(...args);
/**
* @deprecated Shipped `@openclaw/discord/api` compatibility only. Use native
* `AbortSignal.any` after filtering optional signals. Removal with the next
* plugin-SDK major.
*/
function mergeAbortSignals(signals) {
	const activeSignals = signals.filter((signal) => Boolean(signal));
	return activeSignals.length > 1 ? AbortSignal.any(activeSignals) : activeSignals[0];
}
//#endregion
export { DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS, DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, DISCORD_COMPONENT_ATTACHMENT_PREFIX, DISCORD_COMPONENT_CUSTOM_ID_KEY, DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, DISCORD_MODAL_CUSTOM_ID_KEY, DiscordApiError, DiscordFormModal, buildDiscordComponentCustomId, buildDiscordComponentMessage, buildDiscordComponentMessageFlags, buildDiscordInteractiveComponents, buildDiscordModalCustomId, collectDiscordSecurityAuditFindings, collectDiscordStatusIssues, createDiscordActionGate, createDiscordFormModal, discordPlugin, discordSetupPlugin, fetchDiscord, fetchDiscordApplicationId, fetchDiscordApplicationSummary, fetchPluralKitMessageInfo, formatDiscordComponentEventText, getDiscordExecApprovalApprovers, handleDiscordMessageAction, handleDiscordSubagentDeliveryTarget, handleDiscordSubagentEnded, handleDiscordSubagentSpawning, inspectDiscordAccount, isDiscordExecApprovalApprover, isDiscordExecApprovalClientEnabled, listDiscordAccountIds, listDiscordDirectoryGroupsFromConfig, listDiscordDirectoryPeersFromConfig, listEnabledDiscordAccounts, looksLikeDiscordTargetId, mergeAbortSignals, mergeDiscordAccountConfig, normalizeDiscordMessagingTarget, normalizeDiscordOutboundTarget, normalizeExplicitDiscordSessionKey, parseApplicationIdFromToken, parseDiscordComponentCustomId, parseDiscordComponentCustomIdForInteraction as parseDiscordComponentCustomIdForCarbon, parseDiscordComponentCustomIdForInteraction, parseDiscordModalCustomId, parseDiscordModalCustomIdForInteraction as parseDiscordModalCustomIdForCarbon, parseDiscordModalCustomIdForInteraction, parseDiscordSendTarget, parseDiscordTarget, probeDiscord, readDiscordComponentSpec, requestDiscord, resolveDefaultDiscordAccountId, resolveDiscordAccount, resolveDiscordAccountConfig, resolveDiscordChannelId, resolveDiscordComponentAttachmentName, resolveDiscordGroupRequireMention, resolveDiscordGroupToolPolicy, resolveDiscordMaxLinesPerMessage, resolveDiscordPrivilegedIntentsFromFlags, resolveOpenProviderRuntimeGroupPolicy as resolveDiscordRuntimeGroupPolicy, resolveDiscordTarget, shouldSuppressLocalDiscordExecApprovalPrompt, tryHandleDiscordMessageActionGuildAdmin };
