import { t as DEFAULT_ACCOUNT_ID } from "../../account-id-C7N4Rwku.js";
import { a as buildChannelConfigSchema } from "../../config-schema-DGcmKABe.js";
import { p as formatTrimmedAllowFromEntries } from "../../channel-config-helpers-BFvX3ldW.js";
import { i as resolveChannelMediaMaxBytes } from "../../media-runtime-BF28IqU8.js";
import { t as chunkTextForOutbound } from "../../text-chunking-CcRmx-1w.js";
import { c as getChatChannelMeta } from "../../core-Bo6nGN10.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../../pairing-message-DNhqI-OE.js";
import { c as collectStatusIssuesFromLastError, r as buildComputedAccountStatusSnapshot } from "../../status-helpers-jGB19KP8.js";
import "../../channel-status-CDSjOGL5.js";
import { n as IMessageConfigSchema } from "../../zod-schema.providers-core-DGRVpr_u.js";
import { o as resolveIMessageAccount } from "../../accounts-CQRrUqge.js";
import { n as resolveIMessageGroupToolPolicy, r as imessageMessageActions, t as resolveIMessageGroupRequireMention } from "../../group-policy-DtEpV7lc.js";
import { r as setIMessageRuntime } from "../../runtime-D2WDA3RL.js";
import { o as probeIMessage } from "../../sanitize-outbound-3VTQEqXF.js";
import { n as normalizeIMessageMessagingTarget, t as looksLikeIMessageTargetId } from "../../normalize-C1AFiHzw.js";
import "../../config-api-DeZqi4DZ.js";
import { t as monitorIMessageProvider } from "../../monitor-vQ7aVpAB.js";
import { t as sendMessageIMessage } from "../../send-VJ9oXK7X.js";
//#region extensions/imessage/src/config-accessors.ts
function resolveIMessageConfigAllowFrom(params) {
	return (resolveIMessageAccount(params).config.allowFrom ?? []).map((entry) => String(entry));
}
function resolveIMessageConfigDefaultTo(params) {
	const defaultTo = resolveIMessageAccount(params).config.defaultTo;
	if (defaultTo == null) return;
	return defaultTo.trim() || void 0;
}
//#endregion
export { DEFAULT_ACCOUNT_ID, IMessageConfigSchema, PAIRING_APPROVED_MESSAGE, buildChannelConfigSchema, buildComputedAccountStatusSnapshot, chunkTextForOutbound, collectStatusIssuesFromLastError, formatTrimmedAllowFromEntries, getChatChannelMeta, imessageMessageActions, looksLikeIMessageTargetId, monitorIMessageProvider, normalizeIMessageMessagingTarget, probeIMessage, resolveChannelMediaMaxBytes, resolveIMessageConfigAllowFrom, resolveIMessageConfigDefaultTo, resolveIMessageGroupRequireMention, resolveIMessageGroupToolPolicy, sendMessageIMessage, setIMessageRuntime };
