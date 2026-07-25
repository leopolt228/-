import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-B-Fc-m0I.js";
import { n as sanitizeAssistantVisibleText } from "./assistant-visible-text-CUL_eqJo.js";
import { r as missingTargetError } from "./target-errors-CZ0A80hz.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-C0uxiauk.js";
import { t as adaptScopedAccountAccessor } from "./channel-config-helpers-BFvX3ldW.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import { t as sanitizeForPlainText } from "./sanitize-text-BCxyPW9Z.js";
import { t as chunkTextForOutbound } from "./text-chunking-CcRmx-1w.js";
import { t as PAIRING_APPROVED_MESSAGE } from "./pairing-message-DNhqI-OE.js";
import { m as defineChannelMessageAdapter } from "./channel-outbound-D_Kkmr30.js";
import { C as composeAccountWarningCollectors, E as createAllowlistProviderOpenWarningCollector } from "./channel-policy-DtbLL_f5.js";
import { f as listResolvedDirectoryGroupEntriesFromMapKeys, p as listResolvedDirectoryUserEntriesFromAllowFrom } from "./directory-config-helpers-6PdjajJm.js";
import { n as createChannelDirectoryAdapter } from "./directory-runtime-D-aYlyzl.js";
import { i as resolveGoogleChatAccount } from "./accounts-DrnoHLFa.js";
import { C as shouldSuppressGoogleChatManualExecApprovalFollowupPayload, i as normalizeGoogleChatTarget, o as resolveGoogleChatOutboundSpace, r as isGoogleChatUserTarget } from "./targets--yzBlyzX.js";
import "./runtime-api-Dnfn1aG8.js";
import { r as formatGoogleChatAllowFromEntry } from "./channel-base-BSS7HUHo.js";
import { n as resolveGoogleChatGroupRequireMention } from "./group-policy-05pPZT0A.js";
//#region extensions/googlechat/src/channel.adapters.ts
const loadGoogleChatChannelRuntime = createLazyRuntimeNamedExport(() => import("./channel.runtime-CGAnKZYD.js"), "googleChatChannelRuntime");
function createGoogleChatSendReceipt(params) {
	const messageId = params.messageId?.trim();
	return createMessageReceiptFromOutboundResults({
		results: messageId ? [{
			channel: "googlechat",
			messageId,
			chatId: params.chatId,
			conversationId: params.chatId
		}] : [],
		threadId: params.chatId,
		kind: params.kind
	});
}
const collectGoogleChatSecurityWarnings = composeAccountWarningCollectors(createAllowlistProviderOpenWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.googlechat !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	buildOpenWarning: {
		surface: "Google Chat spaces",
		openBehavior: "allows any space to trigger (mention-gated)",
		remediation: "Set channels.googlechat.groupPolicy=\"allowlist\" and configure channels.googlechat.groups"
	}
}), (account) => account.config.dmPolicy === "open" && "- Google Chat DMs are open to anyone. Set channels.googlechat.dmPolicy=\"pairing\" or \"allowlist\".");
const googlechatGroupsAdapter = { resolveRequireMention: resolveGoogleChatGroupRequireMention };
const googlechatDirectoryAdapter = createChannelDirectoryAdapter({
	listPeers: async (params) => listResolvedDirectoryUserEntriesFromAllowFrom({
		...params,
		resolveAccount: adaptScopedAccountAccessor(resolveGoogleChatAccount),
		resolveAllowFrom: (account) => account.config.allowFrom,
		normalizeId: (entry) => normalizeGoogleChatTarget(entry) ?? entry
	}),
	listGroups: async (params) => listResolvedDirectoryGroupEntriesFromMapKeys({
		...params,
		resolveAccount: adaptScopedAccountAccessor(resolveGoogleChatAccount),
		resolveGroups: (account) => account.config.groups
	})
});
const googlechatSecurityAdapter = {
	dm: {
		channelKey: "googlechat",
		resolvePolicy: (account) => account.config.dmPolicy,
		resolveAllowFrom: (account) => account.config.allowFrom,
		allowFromPathSuffix: "",
		normalizeEntry: (raw) => formatGoogleChatAllowFromEntry(raw)
	},
	collectWarnings: collectGoogleChatSecurityWarnings
};
const googlechatThreadingAdapter = {
	scopedAccountReplyToMode: {
		resolveAccount: (cfg, accountId) => resolveGoogleChatAccount({
			cfg,
			accountId
		}),
		resolveReplyToMode: (account, _chatType) => account.config.replyToMode,
		fallback: "off"
	},
	buildToolContext: ({ cfg, accountId, context, hasRepliedRef }) => {
		const currentChannelId = normalizeGoogleChatTarget(context.To);
		const replyToId = normalizeOptionalString(context.ReplyToIdFull) ?? normalizeOptionalString(context.ReplyToId);
		return {
			currentChannelId,
			currentMessageId: replyToId,
			currentThreadTs: replyToId,
			replyToMode: resolveGoogleChatAccount({
				cfg,
				accountId
			}).config.replyToMode,
			hasRepliedRef
		};
	}
};
const googlechatPairingTextAdapter = {
	idLabel: "googlechatUserId",
	message: PAIRING_APPROVED_MESSAGE,
	normalizeAllowEntry: (entry) => formatGoogleChatAllowFromEntry(entry),
	notify: async ({ cfg, id, message, accountId }) => {
		const account = resolveGoogleChatAccount({
			cfg,
			accountId
		});
		if (account.credentialSource === "none" || account.tokenStatus === "configured_unavailable") return;
		const user = normalizeGoogleChatTarget(id) ?? id;
		const space = await resolveGoogleChatOutboundSpace({
			account,
			target: isGoogleChatUserTarget(user) ? user : `users/${user}`
		});
		const { sendGoogleChatMessage } = await loadGoogleChatChannelRuntime();
		await sendGoogleChatMessage({
			account,
			space,
			text: message
		});
	}
};
const googlechatOutboundAdapter = {
	base: {
		deliveryMode: "direct",
		chunker: chunkTextForOutbound,
		chunkerMode: "markdown",
		textChunkLimit: 4e3,
		sanitizeText: ({ text }) => sanitizeForPlainText(sanitizeAssistantVisibleText(text)),
		normalizePayload: ({ payload }) => shouldSuppressGoogleChatManualExecApprovalFollowupPayload(payload) ? null : payload,
		resolveTarget: ({ to }) => {
			const trimmed = normalizeOptionalString(to) ?? "";
			if (trimmed) {
				const normalized = normalizeGoogleChatTarget(trimmed);
				if (!normalized) return {
					ok: false,
					error: missingTargetError("Google Chat", "<spaces/{space}|users/{user}>")
				};
				return {
					ok: true,
					to: normalized
				};
			}
			return {
				ok: false,
				error: missingTargetError("Google Chat", "<spaces/{space}|users/{user}>")
			};
		}
	},
	attachedResults: {
		channel: "googlechat",
		sendText: async ({ cfg, to, text, accountId, replyToId, threadId }) => {
			const account = resolveGoogleChatAccount({
				cfg,
				accountId
			});
			const space = await resolveGoogleChatOutboundSpace({
				account,
				target: to
			});
			const thread = typeof threadId === "number" ? String(threadId) : threadId ?? replyToId ?? void 0;
			const { sendGoogleChatMessage } = await loadGoogleChatChannelRuntime();
			const messageId = (await sendGoogleChatMessage({
				account,
				space,
				text,
				thread
			}))?.messageName ?? "";
			return {
				messageId,
				chatId: space,
				receipt: createGoogleChatSendReceipt({
					messageId,
					chatId: space,
					kind: "text"
				})
			};
		}
	}
};
const googlechatMessageAdapter = defineChannelMessageAdapter({
	id: "googlechat",
	durableFinal: { capabilities: {
		text: true,
		thread: true,
		messageSendingHooks: true
	} },
	send: { text: googlechatOutboundAdapter.attachedResults.sendText }
});
//#endregion
export { googlechatPairingTextAdapter as a, googlechatOutboundAdapter as i, googlechatGroupsAdapter as n, googlechatSecurityAdapter as o, googlechatMessageAdapter as r, googlechatThreadingAdapter as s, googlechatDirectoryAdapter as t };
