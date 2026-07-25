import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe$1 } from "./utf16-slice-lH-m0h6-.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { C as resolveExpiresAtMsFromDurationMs, P as timestampMsToIsoString, b as parseStrictPositiveInteger, d as clampPositiveTimerTimeoutMs, m as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-Crk_c9KW.js";
import { _ as uniqueStrings, l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { x as resolveStateDir } from "./paths-CHQRdQZ3.js";
import { i as formatUncaughtError, r as formatErrorMessage, s as readErrorName, t as collectErrorGraphCandidates } from "./errors-DdbcjW1Y.js";
import { a as root } from "./secure-temp-dir-D6Ou0J-U.js";
import { n as createNonExitingRuntime } from "./runtime-ZHfN2VLf.js";
import { r as getChildLogger } from "./logger-Dy4xN1lg.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { n as computeBackoff, s as sleepWithAbort } from "./src-DKBD8PDy.js";
import { t as createDedupeCache } from "./dedupe-B6TWTYv8.js";
import { p as resolveThreadSessionKeys } from "./session-key-Drrs61Fd.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, r as resolveAgentConfig } from "./agent-scope-config-S7z_Yn4H.js";
import { i as shouldLogVerbose, o as warn, r as logVerbose, t as danger } from "./globals-DBBT7Ru5.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import { w as findModelInCatalog } from "./model-selection-shared-CPPxIJAX.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-CV4VBWUf.js";
import { t as mutateConfigFile } from "./config-BOMcY2yX.js";
import { u as fireAndForgetHook } from "./hook-runner-global-C6QB2pJa.js";
import { c as isReplyPayloadNonTerminalToolErrorWarning, o as getReplyPayloadTtsSupplement, r as buildTtsSupplementMediaPayload, s as isFastModeAutoProgressPayload } from "./reply-payload-BtIUrr9c.js";
import { c as kindFromMime } from "./mime-De36NoRj.js";
import { t as formatSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import { m as triggerInternalHook, n as createInternalHookEvent } from "./internal-hooks-X7hqWd1k.js";
import { t as DEFAULT_INGRESS_ADOPTION_STALL_MS } from "./ingress-drain-CcUB4x_c.js";
import { a as modelSupportsVision } from "./model-catalog-Be-bQQxa.js";
import { l as saveMediaBuffer } from "./store-NmJjqmad.js";
import { n as resolveThinkingDefaultWithRuntimeCatalog } from "./model-thinking-default-Bn7kjmzP.js";
import { n as loadPreparedModelCatalog } from "./prepared-model-catalog-CoGiwhz3.js";
import { f as stripReasoningTagsFromText, g as isInsideCode, h as findCodeRegions } from "./assistant-visible-text-CUL_eqJo.js";
import { h as resolvePluginConversationBindingApproval, o as buildPluginBindingResolvedText, p as parsePluginBindingApprovalCustomId } from "./conversation-binding-DxvXOS3H.js";
import { i as formatFastModeCurrentStatus } from "./fast-mode-CFWkImo-.js";
import { n as listChatCommands } from "./commands-registry-list-CHppW2aU.js";
import { n as maybeResolveTextAlias, r as normalizeCommandBody } from "./commands-registry-normalize-Do42TntE.js";
import { n as isAbortRequestText } from "./abort-primitives-DNTxgxrx.js";
import { t as hasControlCommand } from "./command-detection-B3_n5-oK.js";
import { i as readRecentUserAssistantTextForSession } from "./transcript-vdi-rYV7.js";
import { r as stripInlineDirectiveTagsForDelivery } from "./directive-tags-DnwgHzaK.js";
import { t as resolveFastModeState } from "./fast-mode-DLmTLUz8.js";
import { r as resolveEffectiveAgentRuntime } from "./thinking-runtime-g8O2MT43.js";
import { D as formatLocationText, k as toLocationContext, m as resolveSendableOutboundReplyParts, s as hasOutboundReplyContent } from "./reply-payload-CPcXnHho.js";
import { n as isSingleUseReplyToMode } from "./reply-reference-CblWzjbF.js";
import { f as normalizeMessagePresentation } from "./payload-Br8oiJ5V.js";
import { a as projectOutboundPayloadPlanForDelivery, t as createOutboundPayloadPlan } from "./payloads-BfQIm4rr.js";
import { t as resolveChannelGroupPolicy } from "./group-policy-BdSJjJjj.js";
import { A as resolveTranscriptBackedChannelFinalText, E as resolveChannelStreamingPreviewToolProgress, N as resolveChannelStreamingBlockEnabled, d as isChannelProgressDraftWorkToolName, i as buildChannelProgressDraftLineForEntry, j as selectLongerFinalText, p as isPotentialTruncatedFinal, r as buildChannelProgressDraftLine } from "./streaming-CeN4qI3u.js";
import { i as saveRemoteMedia, t as MediaFetchError } from "./fetch-Mq4HGaV9.js";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-BxhvvT09.js";
import { c as formatReasoningMessage } from "./embedded-agent-utils-qZ6fWrY1.js";
import { i as resolveAgentRoute, n as deriveLastRoutePolicy } from "./resolve-route-D7zjVGdF.js";
import { n as firstDefined } from "./allow-from-o-cfFFcK.js";
import { t as resolveAckReaction } from "./identity-DV846zOa.js";
import { t as deriveDurableFinalDeliveryRequirements } from "./capabilities-tytC94t4.js";
import { c as resolveTextChunkLimit, s as resolveChunkMode } from "./chunk-B-Yo_muw.js";
import { i as toInternalMessageReceivedContext } from "./message-hook-mappers-BYVkVTQj.js";
import { n as createPreviewMessageReceipt } from "./live-wIeQu-vG.js";
import { h as resolveChannelConfigWrites } from "./channel-config-helpers-BFvX3ldW.js";
import { i as applyModelOverrideToSessionEntry, r as ModelSelectionLockedError } from "./model-overrides-BlzAR7Nc.js";
import { c as resolveThreadBindingMaxAgeMsForChannel, o as resolveThreadBindingIdleTimeoutMsForChannel, u as resolveThreadBindingSpawnPolicy } from "./thread-bindings-policy-KHvvPdbA.js";
import "./runtime-config-snapshot-CbOz4rru.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./text-utility-runtime-Bs8FhB83.js";
import "./security-runtime-B_Vsvs-F.js";
import { t as evaluateSupplementalContextVisibility } from "./context-visibility-C5CaKMWO.js";
import { t as isApprovalNotFoundError } from "./approval-errors-BEB18t3G.js";
import "./error-runtime-DUxkdoW4.js";
import "./media-runtime-BF28IqU8.js";
import "./number-runtime-C6TGSEc_.js";
import "./runtime-env-BDC_axp1.js";
import "./text-chunking-CcRmx-1w.js";
import { n as resolveAmbientTranscriptWatermarkKey } from "./ambient-transcript-watermark-CalzDYx2.js";
import { _ as updateSessionStoreEntry, c as readAmbientTranscriptWatermark, i as listSessionEntries, m as resolveStorePath, r as getSessionEntry, s as patchSessionEntry } from "./session-store-runtime-yTK-eEl-.js";
import { n as resolveStoredModelOverride } from "./stored-model-override-B4pkQ1Fw.js";
import { c as parseCommandArgs, i as formatCommandArgMenuTitle, n as buildCommandTextFromArgs, o as listNativeCommandSpecs, r as findCommandByNativeName, s as listNativeCommandSpecsForConfig, u as resolveCommandArgMenu } from "./commands-registry-D0-Z0N5x.js";
import { i as matchesMentionWithExplicit, n as buildMentionRegexes, t as CURRENT_MESSAGE_MARKER } from "./mentions-JuM7Ltm-.js";
import { i as shouldRetryTelegramTransportFallback, o as normalizeTelegramApiRoot, r as resolveTelegramTransport, t as resolveTelegramApiBase } from "./fetch-DcyqsPJI.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import { a as isTelegramEditTargetMissingError, d as isTelegramServerError, f as readTelegramRetryAfterMs, o as isTelegramMessageHasNoTextError, t as isRecoverableTelegramNetworkError, u as isTelegramRateLimitError } from "./network-errors-DCsO9L1u.js";
import "./routing-C_9uWiFw.js";
import { r as getPluginCommandSpecs } from "./command-specs-CahWltQc.js";
import { a as resolveEnvelopeFormatOptions, r as formatInboundEnvelope } from "./envelope-BfKEFEwi.js";
import { n as resolveInboundDebounceMs, t as createInboundDebouncer } from "./inbound-debounce-dfuwHUlR.js";
import { i as shouldAckReaction, n as removeAckReactionAfterReply } from "./ack-reactions-fQW_6F_f.js";
import { p as formatMediaPlaceholderText } from "./kernel-BM-Mkfv5.js";
import { n as implicitMentionKindWhen, r as resolveInboundMentionDecision } from "./mention-gating-Cqy7URJJ.js";
import "./history-BCX82R6F.js";
import { t as createChannelReplyPipeline } from "./reply-pipeline-CxG32UxG.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-BM1zBTeF.js";
import { c as upsertChannelPairingRequest, i as readChannelAllowFromStore } from "./pairing-store-BaZlMduS.js";
import { g as parseExecApprovalCommandText } from "./exec-approval-reply-DHhrBmrX.js";
import "./approval-reply-runtime-Du3DhcMI.js";
import { t as questionGatewayRuntime } from "./question-gateway-runtime-Cqhel8rU.js";
import { t as resolveChannelContextVisibilityMode } from "./context-visibility-BVlvSMUZ.js";
import { n as resolveNativeCommandsEnabled, r as resolveNativeSkillsEnabled, t as isNativeCommandsExplicitlyDisabled } from "./commands-I8ZNoVIP.js";
import "./config-mutation-CzMSFKMG.js";
import { t as normalizeGroupActivation } from "./group-activation-MKTJBUwi.js";
import { t as listSkillCommandsForAgents } from "./chat-commands-DGIUwBOP.js";
import { n as createChannelProgressDraftCompositor } from "./progress-draft-compositor-BtUZIejX.js";
import { n as isBtwRequestText } from "./btw-command-C6g5atyM.js";
import { t as generateConversationLabel } from "./conversation-label-generator-4dbPuiIQ.js";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./reply-dispatch-runtime-MwqmCEt8.js";
import "./reply-reference-oyTerJRY.js";
import "./reply-chunking-DDkaiQAg.js";
import { s as runChannelInboundEvent } from "./inbound-reply-dispatch-DsI2X5Zm.js";
import "./dedupe-runtime-CSIeCB_o.js";
import "./file-access-runtime-B5sSJz87.js";
import "./model-session-runtime-D0SfESOP.js";
import "./ssrf-runtime-b7ye-Z-7.js";
import "./conversation-runtime-DoBKzCAM.js";
import "./agent-runtime-Bt1w9GKE.js";
import { n as dispatchPluginInteractiveHandler, r as createInteractiveConversationBindingHelpers } from "./plugin-runtime-DqhxcL6L.js";
import "./hook-runtime-D2eOmUqA.js";
import "./markdown-table-runtime-DsKAllpK.js";
import { t as resolveNativeCommandSessionTargets } from "./native-command-session-targets-8iIUPPYo.js";
import { n as formatModelsAvailableHeader } from "./commands-models-Bh4BJhd9.js";
import "./command-auth-native-B9Hdab1n.js";
import "./command-primitives-runtime-D7UIRf-v.js";
import { n as buildCommandsMessagePaginated } from "./command-status-builders-CAzh-jlU.js";
import "./command-status-BH0o8HGi.js";
import "./command-detection-ClFc6L1g.js";
import "./command-surface-CzMOrLej.js";
import { n as logInboundDrop, r as logTypingFailure, t as logAckFailure } from "./logging-gUWPKC5g.js";
import { a as DEFAULT_TIMING, i as DEFAULT_EMOJIS } from "./channel-feedback-DUquyVcz.js";
import { o as classifyChannelInboundEvent, s as resolveUnmentionedGroupInboundPolicy, u as shouldDebounceTextInbound } from "./channel-inbound-CsmpMLUZ.js";
import "./channel-inbound-debounce-D5Qo7u9d.js";
import "./channel-mention-gating-DdBjatLp.js";
import { o as defineStableChannelIngressIdentity, r as createChannelIngressResolver } from "./channel-ingress-runtime-xeTXZKGy.js";
import { a as createMessageReceiveContext, d as createChannelIngressMonitor, i as resolveChannelDraftStreamingChunking } from "./channel-outbound-D_Kkmr30.js";
import { t as createChannelPairingChallengeIssuer } from "./channel-pairing-aeyu-GFl.js";
import { d as resolveScopeRequireMention, s as buildChannelGroupsScopeTree } from "./channel-policy-DtbLL_f5.js";
import { i as readLatestAssistantTextByIdentity, t as appendAssistantMirrorMessageByIdentity } from "./session-transcript-runtime-DE6luY3W.js";
import { t as createChannelHistoryWindow } from "./reply-history-ByRtpsh-.js";
import "./models-provider-runtime-Dx6dJ2XD.js";
import "./skill-commands-runtime-BfaMUhmF.js";
import "./native-command-config-runtime-CYbrAUJG.js";
import { t as codexChannelLoginRuntime } from "./provider-auth-login-flow-runtime-Dg8yGzVB.js";
import "./state-paths-C3W_AJaz.js";
import { a as normalizeDmAllowFromWithStore, i as normalizeAllowFrom, n as resolveTelegramDmAllow, o as resolveTelegramEffectiveDmPolicy, r as isSenderAllowed, t as expandTelegramAllowFromWithAccessGroups } from "./access-groups-Dzcwa6se.js";
import { t as mergeTelegramAccountConfig } from "./account-config-CVk-uzTG.js";
import { a as resolveDefaultTelegramAccountId, o as resolveTelegramAccount, s as resolveTelegramMediaRuntimeOptions } from "./accounts-DspPmbuS.js";
import { o as resolveTelegramTargetChatType } from "./targets-CJIsAOe0.js";
import { d as shouldSuppressLocalTelegramExecApprovalPrompt, n as isTelegramExecApprovalApprover, r as isTelegramExecApprovalAuthorizedSender } from "./exec-approvals-BvF9biXN.js";
import { $ as hasBotMentionInText, A as buildTelegramThreadParams, B as resolveTelegramForumThreadId, C as TelegramPairingStoreReadError, D as buildTelegramInboundOriginTarget, E as buildTelegramGroupPeerId, G as resolveTelegramThreadSpec, H as resolveTelegramMessageForumFlagHint, I as resolveTelegramBotHasTopicsEnabled, J as buildSenderLabel, K as shouldUseTelegramDmThreadSession, L as resolveTelegramCommandAuthorization, M as describeReplyTarget, N as extractTelegramForumFlag, O as buildTelegramParentPeer, P as isTelegramCommandsAllowFromConfigured, Q as hasBotMention, S as withTelegramPromptContextSource, T as buildTelegramGroupFrom, U as resolveTelegramReplyId, V as resolveTelegramGroupAllowFromContext, W as resolveTelegramStreamMode, X as extractTelegramLocation, Y as buildSenderName, Z as getTelegramTextParts, at as resolveTelegramRichMessageText, b as resolveTelegramPromptContextDeliverySignature, c as buildTelegramConversationContext, f as isTelegramMessageFromCurrentBot, g as resolveTelegramMessageCacheScope, i as recordSentMessage, it as resolveTelegramRichMessagePlaceholder, j as buildTypingThreadParams, k as buildTelegramRoutingTarget, l as buildTelegramReplyChain, nt as renderTelegramTextEntities, p as isTelegramSessionBoundaryCommandText, q as withResolvedTelegramForumFlag, rt as resolveTelegramPrimaryMedia, tt as normalizeForwardedContext, u as createTelegramMessageCache, ut as renderTelegramHtmlText, v as createTelegramPromptContextProjectionSequence, w as buildGroupLabel, y as resolveCompleteTelegramPromptContextProjectionIds, z as resolveTelegramForumFlag } from "./sent-message-cache-HHSaRWZy.js";
import { n as getTelegramRuntime } from "./runtime-D4cq5Nic2.js";
import { t as normalizeTelegramStateAccountId } from "./state-account-id-CdS1ON70.js";
import { r as resolveTelegramInlineButtonsScope } from "./inline-buttons-D4tzsJPb.js";
import { n as resolveTelegramConversationRoute, t as resolveTelegramConversationBaseSessionKey } from "./conversation-route-jRqxDcMa.js";
import { c as parseTelegramApprovalCallbackData, i as parseTelegramOpaqueCallbackData, r as parseTelegramNativeCommandCallbackData, s as hasTelegramApprovalCallbackPrefix, t as buildTelegramNativeCommandCallbackData } from "./native-command-callback-data-CXJqZx00.js";
import { i as parseTelegramQuestionCallbackData, n as resolveTelegramInlineButtons, r as hasTelegramQuestionCallbackPrefix } from "./button-types-CbpRfC2w.js";
import { t as buildInlineKeyboard } from "./inline-keyboard-aDe2_Kii.js";
import { n as canonicalizeTelegramPresentationPayload } from "./interactive-fallback-CSElPTDT.js";
import { t as loadTelegramSendModule } from "./send-runtime-DAcrPLhu.js";
import { t as TELEGRAM_TEXT_CHUNK_LIMIT } from "./outbound-adapter-BNInDLk0.js";
import { d as buildModelsKeyboard, g as resolveModelSelection, h as parseModelCallbackData, m as getModelsPageSize, o as buildTelegramModelsMenuButtons, p as calculateTotalPages, t as buildCommandsPaginationKeyboard } from "./command-ui-D3hb3Iiu.js";
import { i as resolveTelegramCustomCommands, r as normalizeTelegramCommandName, t as TELEGRAM_COMMAND_NAME_PATTERN } from "./command-config-9TpWlinO.js";
import { c as commitTelegramMessageDispatchReplay, d as releaseTelegramMessageDispatchReplay, l as createTelegramMessageDispatchReplayGuard, s as claimTelegramMessageDispatchReplay, u as isTelegramMessageDispatchReplayForgetError } from "./message-dispatch-dedupe-Ct1tnQtw.js";
import { n as getTopicName, o as resolveTopicNameCacheScope, p as getCachedSticker, s as updateTopicName, u as cacheSticker } from "./topic-name-cache-DjS2iNJA.js";
import { r as createTelegramThreadBindingManager } from "./thread-bindings-Bklh_JXM.js";
import { t as describeStickerImage } from "./sticker-cache-BsRTXE_J.js";
import { n as evaluateTelegramGroupPolicyAccess, t as evaluateTelegramGroupBaseAccess } from "./group-access-CTK7eBwg.js";
import { $ as asTelegramClientFetch, D as markdownToTelegramRichBlocks, G as buildTelegramSelfSenderName, I as italicRichText, J as isTelegramSelfSenderName, K as isTelegramChatWindowPromptContext, L as paragraphBlock, N as boldRichText, P as codeRichText, Q as selectTelegramGroupHistoryAfterLastSelf, U as recordOutboundMessageForPromptContext, W as registerTelegramOutboundGroupHistoryRecorder, X as recordTelegramGroupHistoryEntry, Y as mergeTelegramGroupHistoryPromptContext, Z as retainTelegramGroupHistoryPromptContext, a as editMessageTelegram, at as withTelegramApiErrorLogging, b as buildTelegramRichMarkdown, ct as apiThrottler, et as createTelegramClientFetch, lt as sequentialize, nt as resolveTelegramClientTimeoutSeconds, ot as getOrCreateAccountThrottler, q as isTelegramHistoryEntryAfterAmbientWatermark, rt as resolveTelegramOutboundClientTimeoutFloorSeconds, st as Bot$1, tt as resolveTelegramClientTimeoutMinimumSeconds, v as TELEGRAM_RICH_TEXT_LIMIT, y as buildTelegramRichBlocksPlan } from "./send-BNztnYW3.js";
import { t as beginTelegramInboundEventDeliveryCorrelation } from "./inbound-event-delivery-CwIBmfGc.js";
import { n as buildTelegramInvalidApprovalTerminalText, r as buildTelegramLegacyApprovalTerminalText, t as buildTelegramCanonicalApprovalTerminalText } from "./approval-terminal-DbZpYdpu.js";
import { a as buildCappedTelegramMenuCommands, i as createTelegramDraftStream, n as resolveTelegramApproval, o as buildPluginTelegramMenuCommands, r as resolveTelegramLegacyApproval, s as syncTelegramMenuCommands, t as defaultTelegramBotDeps } from "./bot-deps-DWQ0P9h2.js";
import { n as emitInternalMessageSentHook, t as deliverReplies } from "./delivery-SuATEjxO.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
import os from "node:os";
import { AsyncLocalStorage } from "node:async_hooks";
import { GrammyError } from "grammy";
//#region extensions/telegram/src/bot-handlers.authorization-groups.runtime.ts
function shouldSkipTelegramGroupMessage(params, runtime) {
	const { isGroup, chatId, chatTitle, resolvedThreadId, senderId, senderUsername, effectiveGroupAllow, hasGroupAllowOverride, groupConfig, topicConfig, cfg, telegramCfg } = params;
	const baseAccess = evaluateTelegramGroupBaseAccess({
		isGroup,
		groupConfig,
		topicConfig,
		hasGroupAllowOverride,
		effectiveGroupAllow,
		senderId,
		senderUsername,
		enforceAllowOverride: true,
		requireSenderForAllowOverride: true
	});
	if (!baseAccess.allowed) {
		if (baseAccess.reason === "group-disabled") {
			logVerbose(`Blocked telegram group ${chatId} (group disabled)`);
			return true;
		}
		if (baseAccess.reason === "topic-disabled") {
			logVerbose(`Blocked telegram topic ${chatId} (${resolvedThreadId ?? "unknown"}) (topic disabled)`);
			return true;
		}
		logVerbose(`Blocked telegram group sender ${senderId || "unknown"} (group allowFrom override)`);
		return true;
	}
	if (!isGroup) return false;
	const policyAccess = evaluateTelegramGroupPolicyAccess({
		isGroup,
		chatId,
		cfg,
		telegramCfg,
		topicConfig,
		groupConfig,
		effectiveGroupAllow,
		senderId,
		senderUsername,
		resolveGroupPolicy: runtime.resolveGroupPolicy,
		enforcePolicy: true,
		useTopicAndGroupOverrides: true,
		enforceAllowlistAuthorization: true,
		allowEmptyAllowlistEntries: false,
		requireSenderForAllowlistAuthorization: true,
		checkChatAllowlist: true
	});
	if (policyAccess.allowed) return false;
	if (policyAccess.reason === "group-policy-disabled") {
		logVerbose("Blocked telegram group message (groupPolicy: disabled)");
		return true;
	}
	if (policyAccess.reason === "group-policy-allowlist-no-sender") {
		logVerbose("Blocked telegram group message (no sender ID, groupPolicy: allowlist)");
		return true;
	}
	if (policyAccess.reason === "group-policy-allowlist-empty") {
		logVerbose("Blocked telegram group message (groupPolicy: allowlist, no group allowlist entries)");
		return true;
	}
	if (policyAccess.reason === "group-policy-allowlist-unauthorized") {
		logVerbose(`Blocked telegram group message from ${senderId} (groupPolicy: allowlist)`);
		return true;
	}
	runtime.logger.info({
		chatId,
		title: chatTitle,
		reason: "not-allowed"
	}, "skipping group message");
	return true;
}
//#endregion
//#region extensions/telegram/src/forum-service-message.ts
/** Telegram forum-topic service-message fields (Bot API). */
const TELEGRAM_FORUM_SERVICE_FIELDS = [
	"forum_topic_created",
	"forum_topic_edited",
	"forum_topic_closed",
	"forum_topic_reopened",
	"general_forum_topic_hidden",
	"general_forum_topic_unhidden"
];
/**
* Returns `true` when the message is a Telegram forum service message (e.g.
* "Topic created"). These auto-generated messages carry one of the
* `forum_topic_*` / `general_forum_topic_*` fields and should not count as
* regular bot replies for implicit-mention purposes.
*/
function isTelegramForumServiceMessage(msg) {
	if (!msg || typeof msg !== "object") return false;
	const messageRecord = msg;
	return TELEGRAM_FORUM_SERVICE_FIELDS.some((field) => field in messageRecord && messageRecord[field] != null);
}
//#endregion
//#region extensions/telegram/src/ingress.ts
const TELEGRAM_CHANNEL_ID = "telegram";
const telegramIngressIdentity = defineStableChannelIngressIdentity({
	key: "telegram-user-id",
	normalize: (value) => {
		const normalized = normalizeAllowFrom([value]);
		return normalized.entries[0] ?? (normalized.hasWildcard ? "*" : null);
	},
	sensitivity: "pii"
});
function createTelegramIngressSubject(senderId) {
	return { stableId: senderId };
}
function createTelegramIngressResolver(params) {
	return createChannelIngressResolver({
		channelId: TELEGRAM_CHANNEL_ID,
		accountId: params.accountId ?? "default",
		identity: telegramIngressIdentity,
		cfg: params.cfg
	});
}
function telegramAllowEntries(allow) {
	return [...allow.hasWildcard ? ["*"] : [], ...allow.entries];
}
function telegramConversation(params) {
	return {
		kind: params.isGroup ? "group" : "direct",
		id: String(params.chatId),
		...params.resolvedThreadId != null ? { threadId: String(params.resolvedThreadId) } : {}
	};
}
async function resolveTelegramCommandIngressAuthorization(params) {
	const commandOwner = [...params.isGroup && params.includeDmAllowForGroupCommands === false ? [] : telegramAllowEntries(params.effectiveDmAllow), ...params.ownerAccess.senderIsOwner ? [params.senderId || "*"] : params.ownerAccess.ownerList];
	return (await createTelegramIngressResolver({
		accountId: params.accountId,
		cfg: params.cfg
	}).command({
		subject: createTelegramIngressSubject(params.senderId),
		conversation: telegramConversation(params),
		event: { kind: params.eventKind ?? "native-command" },
		dmPolicy: params.dmPolicy,
		groupPolicy: "allowlist",
		allowFrom: commandOwner,
		groupAllowFrom: params.isGroup ? telegramAllowEntries(params.effectiveGroupAllow) : [],
		command: {
			allowTextCommands: params.allowTextCommands ?? false,
			hasControlCommand: params.hasControlCommand ?? false,
			modeWhenAccessGroupsOff: params.modeWhenAccessGroupsOff ?? "configured"
		}
	})).commandAccess;
}
async function resolveTelegramEventIngressAuthorization(params) {
	return (await createTelegramIngressResolver({ accountId: params.accountId }).event({
		subject: createTelegramIngressSubject(params.senderId),
		conversation: telegramConversation(params),
		event: {
			kind: params.eventKind,
			authMode: "inbound"
		},
		dmPolicy: params.dmPolicy,
		groupPolicy: params.enforceGroupAuthorization ? "allowlist" : "open",
		allowFrom: telegramAllowEntries(params.effectiveDmAllow),
		groupAllowFrom: params.enforceGroupAuthorization ? telegramAllowEntries(params.effectiveGroupAllow) : []
	})).ingress;
}
//#endregion
//#region extensions/telegram/src/bot-message-context.body.ts
const loadStickerVisionRuntime = createLazyRuntimeModule(() => import("./sticker-vision.runtime.js"));
const loadMediaUnderstandingRuntime = createLazyRuntimeModule(() => import("./media-understanding.runtime.js"));
function formatAudioTranscriptForAgent(transcript) {
	return `[Audio transcript (machine-generated, untrusted)]: ${JSON.stringify(transcript)}`;
}
function resolveTelegramMentionFacts(params) {
	let mentionSource;
	if (params.explicitlyMentionedBot) mentionSource = "explicit_bot";
	else if (params.computedWasMentioned) mentionSource = "mention_pattern";
	else if (params.implicitMentionKinds && params.implicitMentionKinds.length > 0) mentionSource = "implicit_thread";
	else if (params.shouldBypassMention) mentionSource = "command_bypass";
	return {
		canDetectMention: params.canDetectMention,
		wasMentioned: params.effectiveWasMentioned,
		explicitlyMentionedBot: params.explicitlyMentionedBot,
		mentionSource,
		implicitMentionKinds: params.implicitMentionKinds,
		effectiveWasMentioned: params.effectiveWasMentioned,
		requireMention: params.requireMention
	};
}
async function resolveStickerVisionSupport$1(params) {
	try {
		const { resolveStickerVisionSupportRuntime } = await loadStickerVisionRuntime();
		return await resolveStickerVisionSupportRuntime(params);
	} catch {
		return false;
	}
}
async function resolveTelegramInboundBody(params) {
	const { cfg, primaryCtx, msg, allMedia, isGroup, chatId, accountId, senderId, senderUsername, sessionKey, resolvedThreadId, replyThreadId, originatingTo: providedOriginatingTo, routeAgentId, effectiveGroupAllow, effectiveDmAllow, groupConfig, topicConfig, providerMentionPatterns, requireMention, options, groupHistories, historyLimit, logger } = params;
	const botUsername = normalizeOptionalLowercaseString(primaryCtx.me?.username);
	const mentionRegexes = buildMentionRegexes(cfg, routeAgentId, {
		provider: "telegram",
		conversationId: isGroup ? buildTelegramGroupPeerId(chatId, resolvedThreadId) : String(chatId),
		providerPolicy: providerMentionPatterns
	});
	const messageTextParts = getTelegramTextParts(msg);
	const allowForCommands = isGroup ? effectiveGroupAllow : effectiveDmAllow;
	const useAccessGroups = cfg.commands?.useAccessGroups !== false;
	const hasControlCommandInMessage = hasControlCommand(messageTextParts.text, cfg, { botUsername });
	const commandGate = await resolveTelegramCommandIngressAuthorization({
		accountId: accountId ?? "default",
		cfg,
		dmPolicy: "pairing",
		isGroup,
		chatId,
		resolvedThreadId,
		senderId,
		effectiveDmAllow,
		effectiveGroupAllow,
		ownerAccess: {
			ownerList: [],
			senderIsOwner: false
		},
		eventKind: "message",
		allowTextCommands: true,
		hasControlCommand: hasControlCommandInMessage,
		modeWhenAccessGroupsOff: "allow",
		includeDmAllowForGroupCommands: false
	});
	const commandAuthorized = commandGate.authorized;
	const historyKey = isGroup ? buildTelegramGroupPeerId(chatId, resolvedThreadId) : void 0;
	const originatingTo = providedOriginatingTo ?? buildTelegramInboundOriginTarget(chatId);
	const primaryMedia = resolveTelegramPrimaryMedia(msg);
	const nativeMediaFacts = allMedia.length > 0 ? allMedia : primaryMedia ? [{ kind: primaryMedia.kind }] : [];
	const cachedStickerDescription = allMedia[0]?.stickerMetadata?.cachedDescription;
	const stickerSupportsVision = msg.sticker && allMedia.some((media) => media.kind === "sticker" && media.path) ? await resolveStickerVisionSupport$1({
		cfg,
		agentId: routeAgentId
	}) : false;
	const stickerCacheHit = Boolean(cachedStickerDescription) && !stickerSupportsVision;
	let formattedStickerDescription;
	if (stickerCacheHit) {
		const emoji = allMedia[0]?.stickerMetadata?.emoji;
		const setName = allMedia[0]?.stickerMetadata?.setName;
		const stickerContext = [emoji, setName ? `from "${setName}"` : null].filter(Boolean).join(" ");
		formattedStickerDescription = `[Sticker${stickerContext ? ` ${stickerContext}` : ""}] ${cachedStickerDescription}`;
	}
	const locationData = extractTelegramLocation(msg);
	const locationText = locationData ? formatLocationText(locationData) : void 0;
	const rawText = renderTelegramTextEntities(messageTextParts.text, messageTextParts.entities).trim();
	const richText = resolveTelegramRichMessageText(msg);
	const hasUserText = Boolean(rawText || locationText);
	let rawBody = [rawText, locationText].filter(Boolean).join("\n").trim();
	if (!rawBody) rawBody = richText ?? resolveTelegramRichMessagePlaceholder(msg) ?? "";
	if (!rawBody && nativeMediaFacts.length === 0) return null;
	let bodyText = rawBody;
	if (formattedStickerDescription) bodyText = [formattedStickerDescription, rawBody].filter(Boolean).join("\n");
	const isAudioMedia = (media) => media.kind === "audio" || media.contentType?.startsWith("audio/") === true;
	const hasAudio = nativeMediaFacts.some(isAudioMedia);
	const materializedMedia = allMedia.filter((media) => Boolean(media.path));
	const materializedAudioIndex = allMedia.findIndex((media) => Boolean(media.path) && isAudioMedia(media));
	const disableAudioPreflight = (topicConfig?.disableAudioPreflight ?? groupConfig?.disableAudioPreflight) === true;
	const senderAllowedForAudioPreflight = !useAccessGroups || !allowForCommands.hasEntries || commandAuthorized;
	let preflightTranscript;
	if (hasAudio && materializedAudioIndex >= 0 && !hasUserText && (!isGroup || requireMention && mentionRegexes.length > 0 && !disableAudioPreflight && senderAllowedForAudioPreflight)) try {
		const { transcribeFirstAudio } = await loadMediaUnderstandingRuntime();
		preflightTranscript = await transcribeFirstAudio({
			ctx: {
				Provider: "telegram",
				Surface: "telegram",
				OriginatingChannel: "telegram",
				OriginatingTo: originatingTo,
				AccountId: accountId,
				MessageThreadId: replyThreadId,
				MediaPaths: materializedMedia.length > 0 ? materializedMedia.map((media) => media.path) : void 0,
				MediaTypes: materializedMedia.length > 0 ? materializedMedia.map((media) => media.contentType ?? media.kind) : void 0
			},
			cfg,
			agentDir: void 0
		});
	} catch (err) {
		logVerbose(`telegram: audio preflight transcription failed: ${String(err)}`);
	}
	const audioTranscribedMediaIndex = preflightTranscript === void 0 ? void 0 : materializedAudioIndex;
	if (hasAudio && !rawBody && preflightTranscript) bodyText = formatAudioTranscriptForAgent(preflightTranscript);
	const historyBody = rawBody || formattedStickerDescription || formatMediaPlaceholderText(nativeMediaFacts);
	const hasAnyMention = messageTextParts.entities.some((ent) => ent.type === "mention");
	const explicitlyMentioned = botUsername ? hasBotMention(msg, botUsername) || (richText ? hasBotMentionInText(richText, botUsername) : false) : false;
	const computedWasMentioned = matchesMentionWithExplicit({
		text: messageTextParts.text || richText || "",
		mentionRegexes,
		explicit: {
			hasAnyMention,
			isExplicitlyMentioned: explicitlyMentioned,
			canResolveExplicit: Boolean(botUsername)
		},
		transcript: preflightTranscript
	});
	const wasMentioned = options?.forceWasMentioned === true ? true : computedWasMentioned;
	if (isGroup && commandGate.shouldBlockControlCommand) {
		logInboundDrop({
			log: logVerbose,
			channel: "telegram",
			reason: "control command (unauthorized)",
			target: senderId ?? "unknown"
		});
		return null;
	}
	const botId = primaryCtx.me?.id;
	const replyFromId = msg.reply_to_message?.from?.id;
	const replyToBotMessage = botId != null && replyFromId === botId;
	const isReplyToServiceMessage = replyToBotMessage && isTelegramForumServiceMessage(msg.reply_to_message);
	const implicitMentionKinds = implicitMentionKindWhen("reply_to_bot", replyToBotMessage && !isReplyToServiceMessage);
	const canDetectMention = Boolean(botUsername) || mentionRegexes.length > 0;
	const mentionDecision = resolveInboundMentionDecision({
		facts: {
			canDetectMention,
			wasMentioned,
			hasAnyMention,
			implicitMentionKinds: isGroup ? implicitMentionKinds : []
		},
		policy: {
			isGroup,
			requireMention: Boolean(requireMention),
			allowTextCommands: true,
			hasControlCommand: hasControlCommandInMessage,
			commandAuthorized
		}
	});
	const effectiveWasMentioned = mentionDecision.effectiveWasMentioned;
	const commandSource = options?.commandSource ?? (commandAuthorized && hasControlCommandInMessage ? "text" : void 0);
	const inboundEventKind = classifyChannelInboundEvent({
		conversation: { kind: isGroup ? "group" : "direct" },
		unmentionedGroupPolicy: resolveUnmentionedGroupInboundPolicy({
			cfg,
			agentId: routeAgentId
		}),
		wasMentioned: effectiveWasMentioned,
		hasControlCommand: hasControlCommandInMessage,
		hasAbortRequest: isAbortRequestText(rawBody, { botUsername }),
		commandSource
	});
	if (isGroup && requireMention && canDetectMention && mentionDecision.shouldSkip) {
		logger.info({
			chatId,
			reason: "no-mention"
		}, "skipping group message");
		recordTelegramGroupHistoryEntry({
			historyMap: groupHistories,
			historyKey,
			limit: historyLimit,
			entry: {
				sender: buildSenderLabel(msg, senderId || chatId),
				body: historyBody,
				timestamp: msg.date ? msg.date * 1e3 : void 0,
				messageId: typeof msg.message_id === "number" ? String(msg.message_id) : void 0
			}
		});
		const telegramGroupPolicy = resolveChannelGroupPolicy({
			cfg,
			channel: "telegram",
			groupId: String(chatId),
			accountId
		});
		if ((topicConfig?.ingest ?? telegramGroupPolicy.groupConfig?.ingest ?? telegramGroupPolicy.defaultConfig?.ingest) === true && sessionKey) fireAndForgetHook(triggerInternalHook(createInternalHookEvent("message", "received", sessionKey, toInternalMessageReceivedContext({
			from: `telegram:group:${historyKey ?? chatId}`,
			to: originatingTo,
			content: rawBody,
			timestamp: msg.date ? msg.date * 1e3 : void 0,
			channelId: "telegram",
			accountId,
			conversationId: originatingTo,
			messageId: typeof msg.message_id === "number" ? String(msg.message_id) : void 0,
			senderId: senderId || void 0,
			senderName: buildSenderName(msg),
			senderUsername: senderUsername || void 0,
			provider: "telegram",
			surface: "telegram",
			threadId: resolvedThreadId,
			originatingChannel: "telegram",
			originatingTo,
			isGroup: true,
			groupId: `telegram:${chatId}`
		}))), "telegram: mention-skip message hook failed");
		return null;
	}
	return {
		bodyText,
		rawBody,
		historyKey,
		commandAuthorized,
		effectiveWasMentioned,
		inboundEventKind,
		mentionFacts: resolveTelegramMentionFacts({
			canDetectMention,
			effectiveWasMentioned,
			explicitlyMentionedBot: explicitlyMentioned,
			computedWasMentioned,
			implicitMentionKinds,
			requireMention: Boolean(requireMention),
			shouldBypassMention: mentionDecision.shouldBypassMention
		}),
		canDetectMention,
		shouldBypassMention: mentionDecision.shouldBypassMention,
		hasControlCommand: hasControlCommandInMessage,
		...audioTranscribedMediaIndex !== void 0 && audioTranscribedMediaIndex >= 0 ? { audioTranscribedMediaIndex } : {},
		stickerCacheHit,
		locationData: locationData ?? void 0
	};
}
//#endregion
//#region extensions/telegram/src/prompt-media-path.ts
function toInboundMediaPath(id) {
	if (!id || id === "." || id === ".." || id.includes("/") || id.includes("\\") || id.includes("\0")) return;
	return `media://inbound/${encodeURIComponent(id)}`;
}
function decodeInboundMediaId(id) {
	try {
		return decodeURIComponent(id);
	} catch {
		return;
	}
}
function resolveTelegramPromptMediaPath(mediaPath) {
	const canonicalMatch = /^media:\/\/inbound\/([^/\\]+)$/i.exec(mediaPath);
	if (canonicalMatch?.[1]) {
		const id = decodeInboundMediaId(canonicalMatch[1]);
		return id ? toInboundMediaPath(id) : void 0;
	}
	const normalized = mediaPath.replace(/\\/g, "/");
	if (!normalized.includes("/media/inbound/")) return;
	return toInboundMediaPath(path.posix.basename(normalized));
}
//#endregion
//#region extensions/telegram/src/group-config-helpers.ts
function resolveTelegramScopedGroupConfig(telegramCfg, chatId, messageThreadId) {
	const resolveTopicConfig = (scopedConfig) => {
		if (!scopedConfig || messageThreadId == null) return;
		const defaultConfig = scopedConfig.topics?.["*"];
		const exactConfig = scopedConfig.topics?.[String(messageThreadId)];
		if (defaultConfig && exactConfig) return {
			...defaultConfig,
			...exactConfig
		};
		return exactConfig ?? defaultConfig;
	};
	const chatIdStr = String(chatId);
	const scopedConfigs = chatIdStr.startsWith("-") ? telegramCfg.groups : telegramCfg.direct;
	const tree = { scopes: scopedConfigs ?? {} };
	const groupKey = Object.hasOwn(tree.scopes, chatIdStr) ? chatIdStr : Object.hasOwn(tree.scopes, "*") ? "*" : void 0;
	const matchKey = (groupKey ? [groupKey] : [])[0];
	const groupConfig = matchKey ? scopedConfigs?.[matchKey] : void 0;
	return {
		groupConfig,
		topicConfig: resolveTopicConfig(groupConfig)
	};
}
function resolveTelegramGroupPromptSettings(params) {
	const skillFilter = firstDefined(params.topicConfig?.skills, params.groupConfig?.skills);
	const systemPromptParts = [params.groupConfig?.systemPrompt?.trim() || null, params.topicConfig?.systemPrompt?.trim() || null].filter((entry) => Boolean(entry));
	return {
		skillFilter,
		groupSystemPrompt: systemPromptParts.length > 0 ? systemPromptParts.join("\n\n") : void 0
	};
}
//#endregion
//#region extensions/telegram/src/bot-message-context.session.ts
const sessionRuntimeMethods = [
	"buildChannelInboundEventContext",
	"readAmbientTranscriptWatermark",
	"readSessionUpdatedAt",
	"recordInboundSession",
	"resolveAmbientTranscriptWatermarkKey",
	"resolveInboundLastRouteSessionKey",
	"resolvePinnedMainDmOwnerFromAllowlist",
	"resolveStorePath"
];
function hasCompleteSessionRuntime(runtime) {
	return Boolean(runtime && sessionRuntimeMethods.every((method) => typeof runtime[method] === "function"));
}
async function loadTelegramMessageContextSessionRuntime(runtime) {
	if (hasCompleteSessionRuntime(runtime)) return runtime;
	return {
		...await import("./bot-message-context.session.runtime.js"),
		...runtime
	};
}
async function resolveTelegramMessageContextStorePath(params) {
	return (await loadTelegramMessageContextSessionRuntime(params.sessionRuntime)).resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
}
function replyTargetToChainEntry(replyTarget) {
	return {
		...replyTarget.id ? { messageId: replyTarget.id } : {},
		sender: replyTarget.sender,
		...replyTarget.senderId ? { senderId: replyTarget.senderId } : {},
		...replyTarget.senderUsername ? { senderUsername: replyTarget.senderUsername } : {},
		...replyTarget.body ? { body: replyTarget.body } : {},
		...replyTarget.mediaType ? {
			mediaKind: replyTarget.mediaType,
			mediaType: replyTarget.mediaType
		} : {},
		...replyTarget.kind === "quote" ? { isQuote: true } : {},
		...replyTarget.forwardedFrom?.from ? { forwardedFrom: replyTarget.forwardedFrom.from } : {},
		...replyTarget.forwardedFrom?.fromId ? { forwardedFromId: replyTarget.forwardedFrom.fromId } : {},
		...replyTarget.forwardedFrom?.fromUsername ? { forwardedFromUsername: replyTarget.forwardedFrom.fromUsername } : {},
		...replyTarget.forwardedFrom?.date ? { forwardedDate: replyTarget.forwardedFrom.date * 1e3 } : {}
	};
}
function stripReplyChainForwarded(entry) {
	const { forwardedFrom: _forwardedFrom, forwardedFromId: _forwardedFromId, forwardedFromUsername: _forwardedFromUsername, forwardedDate: _forwardedDate, ...withoutForwarded } = entry;
	return withoutForwarded;
}
function formatTelegramForwardedMessageBody(params) {
	const forwardedAt = timestampMsToIsoString(params.forwardedDate);
	return [params.forwardedFrom ? `[Forwarded from ${params.forwardedFrom}${forwardedAt ? ` at ${forwardedAt}` : ""}]` : void 0, params.body].filter(Boolean).join("\n");
}
function formatReplyChainEntry(entry, index) {
	const mediaPath = entry.mediaPath ? resolveTelegramPromptMediaPath(entry.mediaPath) : void 0;
	const labels = [
		`${index + 1}. ${entry.sender ?? "unknown sender"}`,
		entry.messageId ? `id:${entry.messageId}` : void 0,
		entry.replyToId ? `reply_to:${entry.replyToId}` : void 0,
		entry.timestamp ? timestampMsToIsoString(entry.timestamp) : void 0
	].filter(Boolean);
	const bodyLines = [
		formatTelegramForwardedMessageBody({
			body: entry.isQuote && entry.body ? `"${entry.body}"` : entry.body ?? "",
			forwardedFrom: entry.forwardedFrom,
			forwardedDate: entry.forwardedDate
		}),
		entry.mediaKind || entry.mediaType ? formatMediaPlaceholderText([entry.mediaKind ? { kind: entry.mediaKind } : isTelegramMediaKind(entry.mediaType ?? "") ? { kind: entry.mediaType } : { contentType: entry.mediaType }]) : void 0,
		mediaPath ? `[media_path:${mediaPath}]` : void 0,
		entry.mediaRef ? `[media_ref:${entry.mediaRef}]` : void 0
	].filter(Boolean);
	return `[${labels.join(" ")}]\n${bodyLines.join("\n")}`;
}
const TELEGRAM_MEDIA_KINDS = /* @__PURE__ */ new Set([
	"audio",
	"document",
	"image",
	"sticker",
	"video"
]);
function isTelegramMediaKind(value) {
	return TELEGRAM_MEDIA_KINDS.has(value);
}
async function buildTelegramInboundContextPayload(params) {
	const { cfg, primaryCtx, msg, allMedia, replyMedia, replyChain, promptContext, isGroup, isForum, chatId, senderId, senderUsername, resolvedThreadId, dmThreadId, threadSpec, route, rawBody, bodyText, historyKey, historyLimit, groupHistories, groupConfig, topicConfig, effectiveWasMentioned, inboundEventKind, groupRequireMention, mentionFacts, hasControlCommand, stickerCacheHit, audioTranscribedMediaIndex, commandAuthorized, locationData, options, dmAllowFrom, effectiveGroupAllow, topicName, sessionRuntime: sessionRuntimeOverride } = params;
	const replyTarget = describeReplyTarget(msg);
	const hasMultiMessageDebounceBatch = (options?.inboundDebounceMessages?.length ?? 0) > 1;
	const forwardOrigin = hasMultiMessageDebounceBatch ? null : normalizeForwardedContext(msg);
	const contextVisibilityMode = resolveChannelContextVisibilityMode({
		cfg,
		channel: "telegram",
		accountId: route.accountId
	});
	const shouldIncludeGroupSupplementalContext = (paramsLocal) => {
		if (!isGroup) return true;
		const senderAllowed = effectiveGroupAllow?.hasEntries ? isSenderAllowed({
			allow: effectiveGroupAllow,
			senderId: paramsLocal.senderId,
			senderUsername: paramsLocal.senderUsername
		}) : true;
		return evaluateSupplementalContextVisibility({
			mode: contextVisibilityMode,
			kind: paramsLocal.kind,
			senderAllowed
		}).include;
	};
	const includeReplyTarget = replyTarget ? shouldIncludeGroupSupplementalContext({
		kind: "quote",
		senderId: replyTarget.senderId,
		senderUsername: replyTarget.senderUsername
	}) : false;
	const includeForwardOrigin = forwardOrigin ? shouldIncludeGroupSupplementalContext({
		kind: "forwarded",
		senderId: forwardOrigin.fromId,
		senderUsername: forwardOrigin.fromUsername
	}) : false;
	const visibleReplyForwardedFrom = includeReplyTarget && replyTarget?.forwardedFrom ? shouldIncludeGroupSupplementalContext({
		kind: "forwarded",
		senderId: replyTarget.forwardedFrom.fromId,
		senderUsername: replyTarget.forwardedFrom.fromUsername
	}) ? replyTarget.forwardedFrom : void 0 : void 0;
	const visibleReplyTarget = includeReplyTarget && replyTarget ? {
		...replyTarget,
		forwardedFrom: visibleReplyForwardedFrom
	} : null;
	const visibleReplyTargetEntry = visibleReplyTarget ? replyTargetToChainEntry(visibleReplyTarget) : void 0;
	const visibleReplyChain = (replyChain.length > 0 ? replyChain : visibleReplyTargetEntry ? [visibleReplyTargetEntry] : []).flatMap((entry) => {
		const selectedReplyEntry = entry.messageId === visibleReplyTargetEntry?.messageId ? visibleReplyTargetEntry : void 0;
		const visibleEntry = {
			...entry,
			...selectedReplyEntry,
			sender: entry.sender,
			senderId: entry.senderId,
			senderUsername: entry.senderUsername
		};
		if (!shouldIncludeGroupSupplementalContext({
			kind: "quote",
			senderId: visibleEntry.senderId,
			senderUsername: visibleEntry.senderUsername
		})) return [];
		return [visibleEntry.forwardedFrom && shouldIncludeGroupSupplementalContext({
			kind: "forwarded",
			senderId: visibleEntry.forwardedFromId,
			senderUsername: visibleEntry.forwardedFromUsername
		}) ? visibleEntry : stripReplyChainForwarded(visibleEntry)];
	});
	const visibleForwardOrigin = includeForwardOrigin ? forwardOrigin : null;
	const inboundDebounceBodySegments = hasMultiMessageDebounceBatch ? options?.inboundDebounceMessages?.flatMap((debouncedMessage) => {
		const debouncedMedia = resolveTelegramPrimaryMedia(debouncedMessage);
		const segmentBody = getTelegramTextParts(debouncedMessage).text || formatMediaPlaceholderText(debouncedMedia ? [{ kind: debouncedMedia.kind }] : []);
		if (!segmentBody) return [];
		const debouncedForwardOrigin = normalizeForwardedContext(debouncedMessage);
		const visibleDebouncedForwardOrigin = debouncedForwardOrigin && shouldIncludeGroupSupplementalContext({
			kind: "forwarded",
			senderId: debouncedForwardOrigin.fromId,
			senderUsername: debouncedForwardOrigin.fromUsername
		}) ? debouncedForwardOrigin : null;
		return [formatTelegramForwardedMessageBody({
			body: segmentBody,
			forwardedFrom: visibleDebouncedForwardOrigin?.from,
			forwardedDate: visibleDebouncedForwardOrigin?.date ? visibleDebouncedForwardOrigin.date * 1e3 : void 0
		})];
	}) : void 0;
	const visibleBodyText = inboundDebounceBodySegments?.length ? inboundDebounceBodySegments.join("\n") : formatTelegramForwardedMessageBody({
		body: bodyText,
		forwardedFrom: visibleForwardOrigin?.from,
		forwardedDate: visibleForwardOrigin?.date ? visibleForwardOrigin.date * 1e3 : void 0
	});
	const replySuffix = visibleReplyChain.length > 0 ? `\n\n[Reply chain - nearest first]\n${visibleReplyChain.map(formatReplyChainEntry).join("\n")}\n[/Reply chain]` : "";
	const groupLabel = isGroup ? buildGroupLabel(msg, chatId, resolvedThreadId) : void 0;
	const senderName = buildSenderName(msg);
	const conversationLabel = isGroup ? groupLabel ?? `group:${chatId}` : buildSenderLabel(msg, senderId || chatId);
	const sessionRuntime = await loadTelegramMessageContextSessionRuntime(sessionRuntimeOverride);
	const storePath = await resolveTelegramMessageContextStorePath({
		cfg,
		agentId: route.agentId,
		sessionRuntime: sessionRuntimeOverride
	});
	const envelopeOptions = resolveEnvelopeFormatOptions(cfg);
	const previousTimestamp = sessionRuntime.readSessionUpdatedAt({
		storePath,
		sessionKey: route.sessionKey
	});
	const ambientTranscriptWatermarkKey = isGroup && historyKey ? sessionRuntime.resolveAmbientTranscriptWatermarkKey({
		channel: "telegram",
		accountId: route.accountId,
		conversationId: String(chatId),
		...resolvedThreadId !== void 0 ? { threadId: resolvedThreadId } : {}
	}) : void 0;
	const ambientTranscriptWatermark = ambientTranscriptWatermarkKey ? sessionRuntime.readAmbientTranscriptWatermark({
		storePath,
		sessionKey: route.sessionKey,
		key: ambientTranscriptWatermarkKey
	}) : void 0;
	const baseVisiblePromptContext = !isGroup && previousTimestamp !== void 0 && dmThreadId == null && visibleReplyChain.length === 0 && !visibleReplyTarget ? promptContext.filter((entry) => !isTelegramChatWindowPromptContext(entry)) : promptContext;
	const body = formatInboundEnvelope({
		channel: "Telegram",
		from: conversationLabel,
		timestamp: msg.date ? msg.date * 1e3 : void 0,
		body: `${visibleBodyText}${replySuffix}`,
		chatType: isGroup ? "group" : "direct",
		sender: {
			name: senderName,
			username: senderUsername || void 0,
			id: senderId || void 0
		},
		previousTimestamp,
		envelope: envelopeOptions
	});
	const hasGroupHistoryContext = isGroup;
	const commandBody = normalizeCommandBody(rawBody, { botUsername: normalizeOptionalLowercaseString(primaryCtx.me?.username) });
	const commandSource = options?.commandSource ?? (commandAuthorized && hasControlCommand ? "text" : void 0);
	const conversationKind = isGroup ? "group" : "direct";
	let watermarkedGroupHistoryEntries;
	let groupHistoryPromptEntries = [];
	if (hasGroupHistoryContext && historyKey && historyLimit > 0) {
		const bufferedHistoryCount = groupHistories.get(historyKey)?.length ?? 0;
		const fullGroupHistoryEntries = (createChannelHistoryWindow({ historyMap: groupHistories }).buildInboundHistory({
			historyKey,
			limit: bufferedHistoryCount
		}) ?? []).filter((entry) => isTelegramHistoryEntryAfterAmbientWatermark(entry, ambientTranscriptWatermark)).slice(-historyLimit);
		watermarkedGroupHistoryEntries = selectTelegramGroupHistoryAfterLastSelf(fullGroupHistoryEntries).slice(-historyLimit);
		groupHistoryPromptEntries = inboundEventKind === "room_event" ? fullGroupHistoryEntries : watermarkedGroupHistoryEntries;
	}
	const visiblePromptContext = mergeTelegramGroupHistoryPromptContext({
		promptContext: baseVisiblePromptContext,
		entries: groupHistoryPromptEntries
	});
	const { skillFilter, groupSystemPrompt } = resolveTelegramGroupPromptSettings({
		groupConfig,
		topicConfig
	});
	const replyHead = visibleReplyChain[0];
	const toInboundMedia = (media, index) => ({
		...media.path ? {
			path: media.path,
			url: media.path
		} : {},
		contentType: media.contentType,
		kind: media.kind,
		transcribed: index !== void 0 && audioTranscribedMediaIndex === index
	});
	const currentMediaFacts = allMedia.map(toInboundMedia);
	const toReplyChainMediaFact = (entry) => entry.mediaPath || entry.mediaKind || entry.mediaType ? {
		...entry.mediaPath ? {
			path: entry.mediaPath,
			url: entry.mediaPath
		} : {},
		...entry.mediaKind ? { kind: entry.mediaKind } : {},
		...entry.mediaType ? isTelegramMediaKind(entry.mediaType) ? entry.mediaKind ? {} : { kind: entry.mediaType } : { contentType: entry.mediaType } : {}
	} : void 0;
	const replyMediaFacts = visibleReplyChain.length > 0 ? visibleReplyChain.flatMap((entry) => {
		const media = toReplyChainMediaFact(entry);
		return media ? [media] : [];
	}) : visibleReplyTarget ? replyMedia.length > 0 ? replyMedia.map((media) => toInboundMedia(media)) : visibleReplyTarget.mediaType ? [{ kind: visibleReplyTarget.mediaType }] : [] : [];
	const replyTargetMedia = (replyHead ? toReplyChainMediaFact(replyHead) : void 0) ?? (visibleReplyTarget?.mediaType ? { kind: visibleReplyTarget.mediaType } : void 0);
	const replyBody = replyHead?.body ?? visibleReplyTarget?.body ?? (replyTargetMedia ? formatMediaPlaceholderText([replyTargetMedia]) : void 0);
	const telegramFrom = isGroup ? buildTelegramGroupFrom(chatId, resolvedThreadId) : `telegram:${chatId}`;
	const telegramTo = buildTelegramInboundOriginTarget(chatId, threadSpec);
	const locationContext = locationData ? toLocationContext(locationData) : void 0;
	const inboundHistory = hasGroupHistoryContext && historyKey && historyLimit > 0 ? groupHistoryPromptEntries.length > 0 ? groupHistoryPromptEntries : void 0 : void 0;
	const ctxPayload = await sessionRuntime.buildChannelInboundEventContext({
		channel: "telegram",
		resolveSupplementalMedia: true,
		accountId: route.accountId,
		messageId: options?.messageIdOverride ?? String(msg.message_id),
		timestamp: msg.date ? msg.date * 1e3 : void 0,
		from: telegramFrom,
		sender: {
			...senderId ? { id: senderId } : {},
			name: senderName,
			username: senderUsername || void 0,
			isBot: msg.from?.is_bot
		},
		conversation: {
			kind: conversationKind,
			id: String(chatId),
			label: conversationLabel,
			threadId: threadSpec.id != null ? String(threadSpec.id) : void 0
		},
		route: {
			agentId: route.agentId,
			dmScope: route.dmScope,
			accountId: route.accountId,
			routeSessionKey: route.sessionKey,
			mainSessionKey: route.mainSessionKey
		},
		reply: {
			to: telegramTo,
			replyToId: replyHead?.messageId ?? visibleReplyTarget?.id,
			messageThreadId: threadSpec.id
		},
		message: {
			inboundEventKind,
			body,
			rawBody,
			bodyForAgent: hasMultiMessageDebounceBatch ? visibleBodyText : bodyText,
			commandBody,
			inboundHistory,
			sourceModality: msg.voice ? "voice" : void 0
		},
		access: {
			commands: { authorized: commandAuthorized },
			mentions: mentionFacts
		},
		command: commandSource === "native" ? {
			kind: "native",
			authorized: commandAuthorized,
			body: commandBody
		} : commandSource === "text" ? {
			kind: "text-slash",
			authorized: commandAuthorized,
			body: commandBody
		} : void 0,
		media: currentMediaFacts,
		supplemental: {
			quote: replyHead || visibleReplyTarget ? {
				id: replyHead?.messageId ?? visibleReplyTarget?.id,
				body: replyBody,
				sender: replyHead?.sender ?? visibleReplyTarget?.sender,
				senderAllowed: true,
				isQuote: replyHead?.isQuote ?? (visibleReplyTarget?.kind === "quote" ? true : void 0),
				media: replyMediaFacts
			} : void 0,
			forwarded: visibleForwardOrigin ? {
				from: visibleForwardOrigin.from,
				fromType: visibleForwardOrigin.fromType,
				fromId: visibleForwardOrigin.fromId,
				date: visibleForwardOrigin.date ? visibleForwardOrigin.date * 1e3 : void 0,
				senderAllowed: true
			} : void 0,
			groupSystemPrompt: isGroup || !isGroup && groupConfig ? groupSystemPrompt : void 0,
			untrustedContext: visiblePromptContext.length > 0 ? visiblePromptContext : void 0
		},
		contextVisibility: contextVisibilityMode,
		extra: {
			BotUsername: primaryCtx.me?.username ?? void 0,
			AmbientTranscriptWatermarkKey: ambientTranscriptWatermarkKey,
			AmbientTranscriptBody: options?.ambientTranscriptBody,
			AmbientTranscriptMessageId: ambientTranscriptWatermarkKey ? options?.messageIdOverride ?? String(msg.message_id) : void 0,
			AmbientTranscriptTimestampMs: ambientTranscriptWatermarkKey ? msg.date ? msg.date * 1e3 : void 0 : void 0,
			AmbientTranscriptPreviousMessageId: ambientTranscriptWatermark?.messageId,
			AmbientTranscriptPreviousTimestampMs: ambientTranscriptWatermark?.timestampMs,
			GroupSubject: isGroup ? msg.chat.title ?? void 0 : void 0,
			GroupRequireMention: isGroup ? groupRequireMention : void 0,
			ReplyChain: visibleReplyChain.length > 0 ? visibleReplyChain : void 0,
			ReplyToIsExternal: visibleReplyTarget?.source === "external_reply" ? true : void 0,
			ReplyToQuoteText: visibleReplyTarget?.quoteText,
			ReplyToQuotePosition: visibleReplyTarget?.quotePosition,
			ReplyToQuoteEntities: visibleReplyTarget?.quoteEntities,
			ReplyToQuoteSourceText: visibleReplyTarget?.quoteSourceText,
			ReplyToQuoteSourceEntities: visibleReplyTarget?.quoteSourceEntities,
			ReplyToForwardedFrom: visibleReplyTarget?.forwardedFrom?.from,
			ReplyToForwardedFromType: visibleReplyTarget?.forwardedFrom?.fromType,
			ReplyToForwardedFromId: visibleReplyTarget?.forwardedFrom?.fromId,
			ReplyToForwardedFromUsername: visibleReplyTarget?.forwardedFrom?.fromUsername,
			ReplyToForwardedFromTitle: visibleReplyTarget?.forwardedFrom?.fromTitle,
			ReplyToForwardedDate: visibleReplyTarget?.forwardedFrom?.date ? visibleReplyTarget.forwardedFrom.date * 1e3 : void 0,
			ForwardedFromUsername: visibleForwardOrigin?.fromUsername,
			ForwardedFromTitle: visibleForwardOrigin?.fromTitle,
			ForwardedFromSignature: visibleForwardOrigin?.fromSignature,
			ForwardedFromChatType: visibleForwardOrigin?.fromChatType,
			ForwardedFromMessageId: visibleForwardOrigin?.fromMessageId,
			WasMentioned: isGroup ? effectiveWasMentioned : void 0,
			Sticker: allMedia[0]?.stickerMetadata,
			StickerMediaIncluded: allMedia[0]?.stickerMetadata ? currentMediaFacts.length > 0 : void 0,
			SkipStickerMediaUnderstanding: stickerCacheHit ? true : void 0,
			...locationContext,
			IsForum: isForum,
			TopicName: isForum && topicName ? topicName : void 0
		}
	});
	if (isGroup && historyKey) recordTelegramGroupHistoryEntry({
		historyMap: groupHistories,
		historyKey,
		limit: historyLimit,
		entry: {
			sender: buildSenderLabel(msg, senderId || chatId),
			body: rawBody || (stickerCacheHit ? bodyText : void 0) || formatMediaPlaceholderText(currentMediaFacts),
			timestamp: msg.date ? msg.date * 1e3 : void 0,
			messageId: typeof msg.message_id === "number" ? String(msg.message_id) : void 0
		}
	});
	const pinnedMainDmOwner = !isGroup ? sessionRuntime.resolvePinnedMainDmOwnerFromAllowlist({
		dmScope: cfg.session?.dmScope,
		allowFrom: dmAllowFrom,
		normalizeEntry: (entry) => normalizeAllowFrom([entry]).entries[0]
	}) : null;
	const updateLastRouteSessionKey = sessionRuntime.resolveInboundLastRouteSessionKey({
		route,
		sessionKey: route.sessionKey
	});
	const shouldPersistGroupLastRouteThread = isGroup && route.matchedBy !== "binding.channel";
	const updateLastRouteThreadId = isGroup ? shouldPersistGroupLastRouteThread && resolvedThreadId != null ? String(resolvedThreadId) : void 0 : dmThreadId != null ? String(dmThreadId) : void 0;
	const updateLastRoute = !isGroup || updateLastRouteThreadId != null ? {
		sessionKey: updateLastRouteSessionKey,
		channel: "telegram",
		to: isGroup && updateLastRouteThreadId != null ? `telegram:${chatId}:topic:${updateLastRouteThreadId}` : `telegram:${chatId}`,
		accountId: route.accountId,
		threadId: updateLastRouteThreadId,
		mainDmOwnerPin: !isGroup && updateLastRouteSessionKey === route.mainSessionKey && pinnedMainDmOwner && senderId ? {
			ownerRecipient: pinnedMainDmOwner,
			senderRecipient: senderId,
			onSkip: (skipParams) => {
				logVerbose(`telegram: skip main-session last route for ${skipParams.senderRecipient} (pinned owner ${skipParams.ownerRecipient})`);
			}
		} : void 0
	} : void 0;
	if (visibleReplyTarget && shouldLogVerbose()) {
		const preview = truncateUtf16Safe$1((visibleReplyTarget.body ?? "").replace(/\s+/g, " "), 120);
		logVerbose(`telegram reply-context: replyToId=${visibleReplyTarget.id} replyToSender=${visibleReplyTarget.sender} replyToBody="${preview}"`);
	}
	if (visibleForwardOrigin && shouldLogVerbose()) logVerbose(`telegram forward-context: forwardedFrom="${visibleForwardOrigin.from}" type=${visibleForwardOrigin.fromType}`);
	if (shouldLogVerbose()) {
		const preview = truncateUtf16Safe$1(body, 200).replace(/\n/g, "\\n");
		const mediaInfo = allMedia.length > 1 ? ` mediaCount=${allMedia.length}` : "";
		const topicInfo = resolvedThreadId != null ? ` topic=${resolvedThreadId}` : "";
		logVerbose(`telegram inbound: chatId=${chatId} from=${ctxPayload.From} len=${body.length}${mediaInfo}${topicInfo} preview="${preview}"`);
	}
	return {
		ctxPayload,
		skillFilter,
		turn: {
			storePath,
			recordInboundSession: sessionRuntime.recordInboundSession,
			record: {
				updateLastRoute,
				onRecordError: (err) => {
					logVerbose(`telegram: failed updating session meta: ${String(err)}`);
				}
			}
		}
	};
}
//#endregion
//#region extensions/telegram/src/dm-access.ts
function resolveTelegramSenderIdentity(msg, chatId) {
	const from = msg.from;
	const userId = from?.id != null ? String(from.id) : null;
	return {
		username: from?.username ?? "",
		userId,
		candidateId: userId ?? String(chatId),
		firstName: from?.first_name,
		lastName: from?.last_name
	};
}
async function decideTelegramDmAccess(params) {
	return (await createTelegramIngressResolver({ accountId: params.accountId }).message({
		subject: createTelegramIngressSubject(params.sender.candidateId),
		conversation: {
			kind: "direct",
			id: params.sender.candidateId
		},
		dmPolicy: params.dmPolicy,
		groupPolicy: "disabled",
		allowFrom: telegramAllowEntries(params.effectiveDmAllow)
	})).ingress;
}
async function isTelegramDmAccessAllowed(params) {
	if (params.dmPolicy === "disabled") return false;
	const sender = resolveTelegramSenderIdentity(params.msg, params.chatId);
	return (await decideTelegramDmAccess({
		accountId: params.accountId,
		dmPolicy: params.dmPolicy,
		sender,
		effectiveDmAllow: params.effectiveDmAllow
	})).decision === "allow";
}
async function enforceTelegramDmAccess(params) {
	const { isGroup, dmPolicy, msg, chatId, effectiveDmAllow, accountId, bot, logger, upsertPairingRequest } = params;
	if (isGroup) return true;
	if (dmPolicy === "disabled") return false;
	const sender = resolveTelegramSenderIdentity(msg, chatId);
	const access = await decideTelegramDmAccess({
		accountId,
		dmPolicy,
		sender,
		effectiveDmAllow
	});
	if (access.decision === "allow") return true;
	if (dmPolicy === "open") {
		logVerbose(`Blocked unauthorized telegram sender ${sender.candidateId} (dmPolicy=open)`);
		return false;
	}
	if (access.decision === "pairing") {
		try {
			const telegramUserId = sender.userId ?? sender.candidateId;
			await createChannelPairingChallengeIssuer({
				channel: "telegram",
				accountId,
				upsertPairingRequest: async ({ id, meta }) => await (upsertPairingRequest ?? upsertChannelPairingRequest)({
					channel: "telegram",
					id,
					accountId,
					meta
				})
			})({
				senderId: telegramUserId,
				senderIdLine: `Your Telegram user id: ${telegramUserId}`,
				meta: {
					username: sender.username || void 0,
					firstName: sender.firstName,
					lastName: sender.lastName
				},
				onCreated: () => {
					logger.info({
						chatId: String(chatId),
						senderUserId: sender.userId ?? void 0,
						username: sender.username || void 0,
						firstName: sender.firstName,
						lastName: sender.lastName
					}, "telegram pairing request");
				},
				sendPairingReply: async (text) => {
					const html = renderTelegramHtmlText(text);
					await withTelegramApiErrorLogging({
						operation: "sendMessage",
						fn: () => bot.api.sendMessage(chatId, html, { parse_mode: "HTML" })
					});
				},
				onReplyError: (err) => {
					logVerbose(`telegram pairing reply failed for chat ${chatId}: ${String(err)}`);
				}
			});
		} catch (err) {
			logVerbose(`telegram pairing reply failed for chat ${chatId}: ${String(err)}`);
		}
		return false;
	}
	logVerbose(`Blocked unauthorized telegram sender ${sender.candidateId} (dmPolicy=${dmPolicy})`);
	return false;
}
//#endregion
//#region extensions/telegram/src/status-reaction-variants.ts
const TELEGRAM_GENERIC_REACTION_FALLBACKS = [
	"👍",
	"👀",
	"🔥"
];
const TELEGRAM_SUPPORTED_REACTION_EMOJIS = /* @__PURE__ */ new Set([
	"❤",
	"👍",
	"👎",
	"🔥",
	"🥰",
	"👏",
	"😁",
	"🤔",
	"🤯",
	"😱",
	"🤬",
	"😢",
	"🎉",
	"🤩",
	"🤮",
	"💩",
	"🙏",
	"👌",
	"🕊",
	"🤡",
	"🥱",
	"🥴",
	"😍",
	"🐳",
	"❤‍🔥",
	"🌚",
	"🌭",
	"💯",
	"🤣",
	"⚡",
	"🍌",
	"🏆",
	"💔",
	"🤨",
	"😐",
	"🍓",
	"🍾",
	"💋",
	"🖕",
	"😈",
	"😴",
	"😭",
	"🤓",
	"👻",
	"👨‍💻",
	"👀",
	"🎃",
	"🙈",
	"😇",
	"😨",
	"🤝",
	"✍",
	"🤗",
	"🫡",
	"🎅",
	"🎄",
	"☃",
	"💅",
	"🤪",
	"🗿",
	"🆒",
	"💘",
	"🙉",
	"🦄",
	"😘",
	"💊",
	"🙊",
	"😎",
	"👾",
	"🤷‍♂",
	"🤷",
	"🤷‍♀",
	"😡"
]);
const TELEGRAM_STATUS_REACTION_VARIANTS = {
	queued: [
		"👀",
		"👍",
		"🔥"
	],
	thinking: [
		"🤔",
		"🤓",
		"👀"
	],
	tool: [
		"🔥",
		"⚡",
		"👍"
	],
	coding: [
		"👨‍💻",
		"🔥",
		"⚡"
	],
	web: [
		"⚡",
		"🔥",
		"👍"
	],
	deploy: [
		"🔥",
		"⚡",
		"👍"
	],
	build: [
		"🔥",
		"👨‍💻",
		"⚡"
	],
	concierge: [
		"👀",
		"🔥",
		"⚡"
	],
	done: [
		"👍",
		"🎉",
		"💯"
	],
	error: [
		"😱",
		"😨",
		"🤯"
	],
	stallSoft: [
		"🥱",
		"😴",
		"🤔"
	],
	stallHard: [
		"😨",
		"😱",
		"⚡"
	],
	compacting: [
		"✍",
		"🤔",
		"🤯"
	]
};
const STATUS_REACTION_EMOJI_KEYS = [
	"queued",
	"thinking",
	"tool",
	"coding",
	"web",
	"deploy",
	"build",
	"concierge",
	"done",
	"error",
	"stallSoft",
	"stallHard",
	"compacting"
];
function toUniqueNonEmpty(values) {
	return uniqueStrings(normalizeStringEntries(values));
}
function resolveTelegramStatusReactionEmojis(params) {
	const { overrides } = params;
	const queuedFallback = normalizeOptionalString(params.initialEmoji) ?? DEFAULT_EMOJIS.queued;
	return {
		queued: normalizeOptionalString(overrides?.queued) ?? queuedFallback,
		thinking: normalizeOptionalString(overrides?.thinking) ?? DEFAULT_EMOJIS.thinking,
		tool: normalizeOptionalString(overrides?.tool) ?? DEFAULT_EMOJIS.tool,
		coding: normalizeOptionalString(overrides?.coding) ?? DEFAULT_EMOJIS.coding,
		web: normalizeOptionalString(overrides?.web) ?? DEFAULT_EMOJIS.web,
		deploy: normalizeOptionalString(overrides?.deploy) ?? DEFAULT_EMOJIS.deploy,
		build: normalizeOptionalString(overrides?.build) ?? DEFAULT_EMOJIS.build,
		concierge: normalizeOptionalString(overrides?.concierge) ?? DEFAULT_EMOJIS.concierge,
		done: normalizeOptionalString(overrides?.done) ?? DEFAULT_EMOJIS.done,
		error: normalizeOptionalString(overrides?.error) ?? DEFAULT_EMOJIS.error,
		stallSoft: normalizeOptionalString(overrides?.stallSoft) ?? DEFAULT_EMOJIS.stallSoft,
		stallHard: normalizeOptionalString(overrides?.stallHard) ?? DEFAULT_EMOJIS.stallHard,
		compacting: normalizeOptionalString(overrides?.compacting) ?? DEFAULT_EMOJIS.compacting
	};
}
function buildTelegramStatusReactionVariants(emojis) {
	const variantsByRequested = /* @__PURE__ */ new Map();
	for (const key of STATUS_REACTION_EMOJI_KEYS) {
		const requested = normalizeOptionalString(emojis[key]);
		if (!requested) continue;
		const candidates = toUniqueNonEmpty([requested, ...TELEGRAM_STATUS_REACTION_VARIANTS[key] ?? []]);
		variantsByRequested.set(requested, candidates);
	}
	return variantsByRequested;
}
function isTelegramSupportedReactionEmoji(emoji) {
	return TELEGRAM_SUPPORTED_REACTION_EMOJIS.has(emoji);
}
function extractTelegramAllowedEmojiReactions(chat) {
	if (!chat) return;
	const availableReactions = chat.available_reactions;
	if (availableReactions === void 0) return;
	if (availableReactions == null) return null;
	if (!Array.isArray(availableReactions)) return /* @__PURE__ */ new Set();
	const allowed = /* @__PURE__ */ new Set();
	for (const reaction of availableReactions) {
		if (reaction.type !== "emoji") continue;
		const emoji = reaction.emoji.trim();
		if (emoji && isTelegramSupportedReactionEmoji(emoji)) allowed.add(emoji);
	}
	return allowed;
}
async function resolveTelegramAllowedEmojiReactions(params) {
	const fromMessage = extractTelegramAllowedEmojiReactions(params.chat);
	if (fromMessage !== void 0) return fromMessage;
	if (params.getChat) try {
		const fromLookup = extractTelegramAllowedEmojiReactions(await params.getChat(params.chatId));
		if (fromLookup !== void 0) return fromLookup;
	} catch {
		return null;
	}
	return null;
}
function resolveTelegramReactionVariant(params) {
	const requestedEmoji = normalizeOptionalString(params.requestedEmoji);
	if (!requestedEmoji) return;
	const variants = toUniqueNonEmpty([...params.variantsByRequestedEmoji.get(requestedEmoji) ?? [requestedEmoji], ...TELEGRAM_GENERIC_REACTION_FALLBACKS]);
	for (const candidate of variants) {
		if (!isTelegramSupportedReactionEmoji(candidate)) continue;
		if (params.allowedEmojiReactions == null || params.allowedEmojiReactions.has(candidate)) return candidate;
	}
}
//#endregion
//#region extensions/telegram/src/bot-message-context.ts
const loadTelegramMessageContextRuntime = createLazyRuntimeModule(() => import("./bot-message-context.runtime.js"));
const buildTelegramMessageContext = async ({ primaryCtx, allMedia, replyMedia = [], replyChain = [], promptContext = [], storeAllowFrom, options, bot, cfg, account, historyLimit, groupHistories, dmPolicy, allowFrom, groupAllowFrom, ackReactionScope, logger, resolveGroupActivation, resolveGroupRequireMention, resolveTelegramGroupConfig, runtime, sessionRuntime, upsertPairingRequest, sendChatActionHandler }) => {
	const msg = primaryCtx.message;
	const chatId = msg.chat.id;
	const isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
	const senderId = msg.from?.id ? String(msg.from.id) : "";
	const messageThreadId = msg.message_thread_id;
	const reactionApi = typeof bot.api.setMessageReaction === "function" ? bot.api.setMessageReaction.bind(bot.api) : null;
	const getChatApi = typeof bot.api.getChat === "function" ? bot.api.getChat.bind(bot.api) : void 0;
	const isForum = await resolveTelegramForumFlag({
		chatId,
		chatType: msg.chat.type,
		isGroup,
		isForum: extractTelegramForumFlag(msg.chat),
		isTopicMessage: msg.is_topic_message,
		getChat: getChatApi
	});
	const threadSpec = resolveTelegramThreadSpec({
		isGroup,
		isForum,
		messageThreadId
	});
	const resolvedThreadId = threadSpec.scope === "forum" ? threadSpec.id : void 0;
	const replyThreadId = threadSpec.id;
	const dmThreadId = threadSpec.scope === "dm" ? threadSpec.id : void 0;
	let topicName;
	if (isForum && resolvedThreadId != null) {
		const topicNameCacheScope = resolveTopicNameCacheScope(await resolveTelegramMessageContextStorePath({
			cfg,
			agentId: account.accountId,
			sessionRuntime
		}));
		const ftCreated = msg.forum_topic_created;
		const ftEdited = msg.forum_topic_edited;
		const ftClosed = msg.forum_topic_closed;
		const ftReopened = msg.forum_topic_reopened;
		const topicPatch = ftCreated?.name ? {
			name: ftCreated.name,
			iconColor: ftCreated.icon_color,
			iconCustomEmojiId: ftCreated.icon_custom_emoji_id,
			closed: false
		} : ftEdited?.name ? {
			name: ftEdited.name,
			iconCustomEmojiId: ftEdited.icon_custom_emoji_id
		} : ftClosed ? { closed: true } : ftReopened ? { closed: false } : void 0;
		if (topicPatch) await updateTopicName(chatId, resolvedThreadId, topicPatch, topicNameCacheScope);
		topicName = await getTopicName(chatId, resolvedThreadId, topicNameCacheScope);
		if (!topicName) {
			const replyFtCreated = msg.reply_to_message?.forum_topic_created;
			if (replyFtCreated?.name) {
				await updateTopicName(chatId, resolvedThreadId, {
					name: replyFtCreated.name,
					iconColor: replyFtCreated.icon_color,
					iconCustomEmojiId: replyFtCreated.icon_custom_emoji_id
				}, topicNameCacheScope);
				topicName = replyFtCreated.name;
			}
		}
	}
	const { groupConfig, topicConfig } = resolveTelegramGroupConfig(chatId, resolvedThreadId ?? dmThreadId, cfg);
	const directConfig = !isGroup ? groupConfig : void 0;
	const telegramGroupConfig = isGroup ? groupConfig : void 0;
	const effectiveDmPolicy = resolveTelegramEffectiveDmPolicy({
		isGroup,
		groupConfig,
		dmPolicy
	});
	const conversationRoute = resolveTelegramConversationRoute({
		cfg,
		accountId: account.accountId,
		chatId,
		isGroup,
		resolvedThreadId,
		replyThreadId,
		senderId,
		topicAgentId: topicConfig?.agentId
	});
	const { bindingMode } = conversationRoute;
	let { route } = conversationRoute;
	const requiresExplicitAccountBinding = (candidate) => normalizeAccountId(candidate.accountId) !== normalizeAccountId(resolveDefaultTelegramAccountId(cfg)) && candidate.matchedBy === "default";
	const isNamedAccountFallback = requiresExplicitAccountBinding(route);
	const hasExplicitTopicRoute = isGroup && Boolean(topicConfig?.agentId?.trim());
	if (isNamedAccountFallback && isGroup && !hasExplicitTopicRoute) {
		logInboundDrop({
			log: logVerbose,
			channel: "telegram",
			reason: "non-default account requires explicit binding",
			target: route.accountId
		});
		return null;
	}
	const groupAllowOverride = firstDefined(topicConfig?.allowFrom, groupConfig?.allowFrom);
	const dmAllow = await resolveTelegramDmAllow({
		cfg,
		groupAllowOverride,
		allowFrom,
		accountId: account.accountId,
		senderId,
		storeAllowFrom,
		dmPolicy: effectiveDmPolicy
	});
	const effectiveGroupAllow = normalizeAllowFrom(await expandTelegramAllowFromWithAccessGroups({
		cfg,
		allowFrom: groupAllowOverride ?? groupAllowFrom,
		accountId: account.accountId,
		senderId
	}));
	const hasGroupAllowOverride = groupAllowOverride !== void 0;
	const senderUsername = msg.from?.username ?? "";
	const baseAccess = evaluateTelegramGroupBaseAccess({
		isGroup,
		groupConfig,
		topicConfig,
		hasGroupAllowOverride,
		effectiveGroupAllow,
		senderId,
		senderUsername,
		enforceAllowOverride: true,
		requireSenderForAllowOverride: false
	});
	if (!baseAccess.allowed) {
		if (baseAccess.reason === "group-disabled") {
			logVerbose(`Blocked telegram group ${chatId} (group disabled)`);
			return null;
		}
		if (baseAccess.reason === "topic-disabled") {
			logVerbose(`Blocked telegram topic ${chatId} (${resolvedThreadId ?? "unknown"}) (topic disabled)`);
			return null;
		}
		logVerbose(isGroup ? `Blocked telegram group sender ${senderId || "unknown"} (group allowFrom override)` : `Blocked telegram DM sender ${senderId || "unknown"} (DM allowFrom override)`);
		return null;
	}
	const requireTopic = directConfig?.requireTopic;
	if (!isGroup && requireTopic === true && dmThreadId == null) {
		logVerbose(`Blocked telegram DM ${chatId}: requireTopic=true but no topic present`);
		return null;
	}
	const sendTyping = async () => {
		await withTelegramApiErrorLogging({
			operation: "sendChatAction",
			fn: () => sendChatActionHandler.sendChatAction(chatId, "typing", buildTypingThreadParams(replyThreadId))
		});
	};
	const sendRecordVoice = async () => {
		try {
			await withTelegramApiErrorLogging({
				operation: "sendChatAction",
				fn: () => sendChatActionHandler.sendChatAction(chatId, "record_voice", buildTypingThreadParams(replyThreadId))
			});
		} catch (err) {
			logVerbose(`telegram record_voice cue failed for chat ${chatId}: ${String(err)}`);
		}
	};
	if (!await enforceTelegramDmAccess({
		isGroup,
		dmPolicy: effectiveDmPolicy,
		msg,
		chatId,
		effectiveDmAllow: dmAllow.effectiveAllow,
		accountId: account.accountId,
		bot,
		logger,
		upsertPairingRequest
	})) return null;
	let initialTypingCueSent = false;
	const ensureConfiguredBindingReady = async () => {
		if (bindingMode.kind !== "configured") return true;
		const ensured = await (runtime?.ensureConfiguredBindingRouteReady ?? (await loadTelegramMessageContextRuntime()).ensureConfiguredBindingRouteReady)({
			cfg,
			bindingResolution: bindingMode.binding
		});
		if (ensured.ok) {
			logVerbose(`telegram: using configured ACP binding for ${bindingMode.binding.record.conversation.conversationId} -> ${bindingMode.sessionKey}`);
			return true;
		}
		logVerbose(`telegram: configured ACP binding unavailable for ${bindingMode.binding.record.conversation.conversationId}: ${ensured.error}`);
		logInboundDrop({
			log: logVerbose,
			channel: "telegram",
			reason: "configured ACP binding unavailable",
			target: bindingMode.binding.record.conversation.conversationId
		});
		return false;
	};
	const baseSessionKey = resolveTelegramConversationBaseSessionKey({
		cfg,
		route,
		chatId,
		isGroup,
		senderId
	});
	const sessionKey = (shouldUseTelegramDmThreadSession({
		dmThreadId,
		botHasTopicsEnabled: resolveTelegramBotHasTopicsEnabled(primaryCtx.me)
	}) && dmThreadId != null ? resolveThreadSessionKeys({
		baseSessionKey,
		threadId: `${chatId}:${dmThreadId}`
	}) : null)?.sessionKey ?? baseSessionKey;
	route = {
		...route,
		sessionKey,
		lastRoutePolicy: deriveLastRoutePolicy({
			sessionKey,
			mainSessionKey: route.mainSessionKey
		})
	};
	const activationOverride = resolveGroupActivation({
		chatId,
		messageThreadId: resolvedThreadId,
		sessionKey,
		agentId: route.agentId,
		cfg
	});
	const baseRequireMention = resolveGroupRequireMention(chatId, cfg);
	const groupRequireMention = firstDefined(topicConfig?.requireMention, activationOverride, telegramGroupConfig?.requireMention, baseRequireMention);
	const requireMention = isGroup && bindingMode.kind === "plugin-owned-runtime" ? false : groupRequireMention;
	(runtime?.recordChannelActivity ?? (await loadTelegramMessageContextRuntime()).recordChannelActivity)({
		channel: "telegram",
		accountId: account.accountId,
		direction: "inbound"
	});
	const originatingTo = buildTelegramInboundOriginTarget(chatId, threadSpec);
	const bodyResult = await resolveTelegramInboundBody({
		cfg,
		primaryCtx,
		msg,
		allMedia,
		isGroup,
		chatId,
		accountId: account.accountId,
		senderId,
		senderUsername,
		resolvedThreadId,
		replyThreadId,
		originatingTo,
		routeAgentId: route.agentId,
		sessionKey,
		effectiveGroupAllow,
		effectiveDmAllow: dmAllow.effectiveAllow,
		groupConfig,
		topicConfig,
		providerMentionPatterns: cfg.channels?.telegram?.accounts?.[account.accountId]?.mentionPatterns,
		requireMention: Boolean(requireMention),
		options,
		groupHistories,
		historyLimit,
		logger
	});
	if (!bodyResult) return null;
	if (!await ensureConfiguredBindingReady()) return null;
	if (bodyResult.inboundEventKind !== "room_event") {
		initialTypingCueSent = true;
		sendTyping().catch((err) => {
			logVerbose(`telegram early typing cue failed for chat ${chatId}: ${String(err)}`);
		});
	}
	const { ctxPayload, skillFilter, turn } = await buildTelegramInboundContextPayload({
		cfg,
		primaryCtx,
		msg,
		allMedia,
		replyMedia,
		replyChain,
		promptContext,
		isGroup,
		isForum,
		chatId,
		senderId,
		senderUsername,
		resolvedThreadId,
		dmThreadId,
		threadSpec,
		route,
		rawBody: bodyResult.rawBody,
		bodyText: bodyResult.bodyText,
		historyKey: bodyResult.historyKey ?? "",
		historyLimit,
		groupHistories,
		groupConfig,
		topicConfig,
		effectiveWasMentioned: bodyResult.effectiveWasMentioned,
		inboundEventKind: bodyResult.inboundEventKind,
		groupRequireMention: Boolean(groupRequireMention),
		mentionFacts: bodyResult.mentionFacts,
		hasControlCommand: bodyResult.hasControlCommand,
		stickerCacheHit: bodyResult.stickerCacheHit,
		...bodyResult.audioTranscribedMediaIndex !== void 0 ? { audioTranscribedMediaIndex: bodyResult.audioTranscribedMediaIndex } : {},
		locationData: bodyResult.locationData,
		options,
		dmAllowFrom: dmAllow.allowFrom,
		effectiveGroupAllow,
		commandAuthorized: bodyResult.commandAuthorized,
		topicName,
		sessionRuntime
	});
	const canShowStatusReaction = !(ctxPayload.InboundEventKind === "room_event");
	const ackReaction = resolveAckReaction(cfg, route.agentId, {
		channel: "telegram",
		accountId: account.accountId
	});
	const ackReactionEmoji = ackReaction && isTelegramSupportedReactionEmoji(ackReaction) ? ackReaction : void 0;
	const removeAckAfterReply = cfg.messages?.removeAckAfterReply ?? false;
	const shouldSendAckReaction = Boolean(ackReaction && shouldAckReaction({
		scope: ackReactionScope,
		inboundEventKind: ctxPayload.InboundEventKind,
		isDirect: !isGroup,
		isGroup,
		isMentionableGroup: isGroup,
		requireMention: Boolean(requireMention),
		canDetectMention: bodyResult.canDetectMention,
		effectiveWasMentioned: bodyResult.effectiveWasMentioned,
		shouldBypassMention: bodyResult.shouldBypassMention
	}));
	const statusReactionsConfig = cfg.messages?.statusReactions;
	const statusReactionsEnabled = canShowStatusReaction && statusReactionsConfig?.enabled === true && Boolean(reactionApi) && shouldSendAckReaction;
	const resolvedStatusReactionEmojis = statusReactionsEnabled ? resolveTelegramStatusReactionEmojis({
		initialEmoji: ackReaction,
		overrides: statusReactionsConfig?.emojis
	}) : null;
	const statusReactionVariantsByEmoji = resolvedStatusReactionEmojis ? buildTelegramStatusReactionVariants(resolvedStatusReactionEmojis) : /* @__PURE__ */ new Map();
	let allowedStatusReactionEmojisPromise = null;
	const createStatusReactionController = statusReactionsEnabled && resolvedStatusReactionEmojis && msg.message_id ? runtime?.createStatusReactionController ?? (await loadTelegramMessageContextRuntime()).createStatusReactionController : null;
	const statusReactionController = createStatusReactionController ? createStatusReactionController({
		enabled: true,
		adapter: { setReaction: async (emoji) => {
			if (reactionApi) {
				if (!allowedStatusReactionEmojisPromise) allowedStatusReactionEmojisPromise = resolveTelegramAllowedEmojiReactions({
					chat: msg.chat,
					chatId,
					getChat: getChatApi ?? void 0
				}).catch((err) => {
					logVerbose(`telegram status-reaction available_reactions lookup failed for chat ${chatId}: ${String(err)}`);
					return null;
				});
				const allowedStatusReactionEmojis = await allowedStatusReactionEmojisPromise;
				const resolvedEmoji = resolveTelegramReactionVariant({
					requestedEmoji: emoji,
					variantsByRequestedEmoji: statusReactionVariantsByEmoji,
					allowedEmojiReactions: allowedStatusReactionEmojis
				});
				if (!resolvedEmoji) return;
				await reactionApi(chatId, msg.message_id, [{
					type: "emoji",
					emoji: resolvedEmoji
				}]);
			}
		} },
		initialEmoji: ackReaction,
		emojis: resolvedStatusReactionEmojis ?? void 0,
		onError: (err) => {
			logVerbose(`telegram status-reaction error for chat ${chatId}: ${String(err)}`);
		}
	}) : null;
	const ackReactionPromise = statusReactionController ? shouldSendAckReaction ? Promise.resolve(statusReactionController.setQueued()).then(() => true, () => false) : null : shouldSendAckReaction && msg.message_id && reactionApi && ackReactionEmoji ? withTelegramApiErrorLogging({
		operation: "setMessageReaction",
		fn: () => reactionApi(chatId, msg.message_id, [{
			type: "emoji",
			emoji: ackReactionEmoji
		}])
	}).then(() => true, (err) => {
		logVerbose(`telegram react failed for chat ${chatId}: ${String(err)}`);
		return false;
	}) : null;
	return {
		cfg,
		ctxPayload,
		turn,
		primaryCtx,
		msg,
		chatId,
		isGroup,
		groupConfig,
		topicConfig,
		resolvedThreadId,
		threadSpec,
		replyThreadId,
		isForum,
		historyKey: bodyResult.historyKey ?? "",
		historyLimit,
		groupHistories,
		route,
		skillFilter,
		sendTyping,
		sendRecordVoice,
		sendChatActionHandler,
		initialTypingCueSent,
		ackReactionPromise,
		reactionApi,
		removeAckAfterReply,
		statusReactionController,
		accountId: account.accountId
	};
};
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-context.ts
const TELEGRAM_GENERAL_TOPIC_ID = 1;
function normalizeTelegramThreadId(value) {
	return parseStrictPositiveInteger(value);
}
function resolveTelegramForumThreadScopeFromSessionKey(sessionKey) {
	if (typeof sessionKey !== "string") return;
	const match = /:telegram:group:(-?\d+):topic:(\d+)(?::|$)/.exec(sessionKey);
	const threadId = normalizeTelegramThreadId(match?.[2]);
	if (!match?.[1] || threadId == null) return;
	return {
		chatId: match[1],
		threadId
	};
}
function resolveDispatchTelegramThreadSpec(params) {
	if (params.threadSpec.scope !== "forum" || params.threadSpec.id != null && params.threadSpec.id !== TELEGRAM_GENERAL_TOPIC_ID) return params.threadSpec;
	const scopedThread = resolveTelegramForumThreadScopeFromSessionKey(params.ctxPayload.SessionKey);
	const scopedThreadId = scopedThread?.chatId === String(params.chatId) ? scopedThread.threadId : void 0;
	const payloadThreadId = normalizeTelegramThreadId(params.ctxPayload.MessageThreadId) ?? normalizeTelegramThreadId(params.ctxPayload.TransportThreadId);
	const recoveredThreadId = scopedThreadId ?? payloadThreadId;
	return recoveredThreadId == null || recoveredThreadId === params.threadSpec.id ? params.threadSpec : {
		...params.threadSpec,
		id: recoveredThreadId
	};
}
function normalizeDispatchTelegramThreadPayload(params) {
	if (params.threadSpec.scope !== "forum" || params.threadSpec.id == null) return params.context;
	const messageThreadId = normalizeTelegramThreadId(params.context.ctxPayload.MessageThreadId);
	const transportThreadId = normalizeTelegramThreadId(params.context.ctxPayload.TransportThreadId);
	if (messageThreadId === params.threadSpec.id && transportThreadId === params.threadSpec.id) return params.context;
	return {
		...params.context,
		ctxPayload: {
			...params.context.ctxPayload,
			MessageThreadId: params.threadSpec.id,
			TransportThreadId: params.threadSpec.id
		}
	};
}
function extractCurrentTelegramBody(body) {
	if (!body) return "";
	const markerIndex = body.lastIndexOf(CURRENT_MESSAGE_MARKER);
	if (markerIndex === -1) return body;
	return body.slice(markerIndex + CURRENT_MESSAGE_MARKER.length).trimStart();
}
function buildRecoveredTelegramChatActionSender(params) {
	return async () => {
		try {
			await withTelegramApiErrorLogging({
				operation: "sendChatAction",
				fn: () => params.context.sendChatActionHandler.sendChatAction(params.context.chatId, params.action, buildTypingThreadParams(params.threadId))
			});
		} catch (err) {
			if (params.action !== "record_voice") throw err;
			logVerbose(`telegram record_voice cue failed for chat ${params.context.chatId}: ${String(err)}`);
		}
	};
}
function migrateRecoveredTelegramGroupHistory(params) {
	const originalHistoryKey = params.context.historyKey;
	const recoveredHistoryKey = params.recoveredHistoryKey;
	if (!params.context.isGroup || !originalHistoryKey || !recoveredHistoryKey || originalHistoryKey === recoveredHistoryKey || params.context.historyLimit <= 0) return;
	const originalEntries = params.context.groupHistories.get(originalHistoryKey);
	if (!originalEntries?.length) return;
	const messageId = params.context.ctxPayload.MessageSid;
	const rawBody = params.context.ctxPayload.RawBody;
	const entryIndex = originalEntries.findLastIndex((entry) => {
		if (messageId && entry.messageId === messageId) return true;
		return !messageId && typeof rawBody === "string" && entry.body === rawBody;
	});
	if (entryIndex === -1) return;
	const [entry] = originalEntries.splice(entryIndex, 1);
	if (!entry) return;
	createChannelHistoryWindow({ historyMap: params.context.groupHistories }).record({
		historyKey: recoveredHistoryKey,
		limit: params.context.historyLimit,
		entry
	});
}
function resolveDispatchTelegramContext(params) {
	const threadSpec = resolveDispatchTelegramThreadSpec({
		chatId: params.context.chatId,
		ctxPayload: params.context.ctxPayload,
		threadSpec: params.context.threadSpec
	});
	if (threadSpec === params.context.threadSpec || threadSpec.scope !== "forum") return normalizeDispatchTelegramThreadPayload({
		context: params.context,
		threadSpec
	});
	const recoveredRoutingTarget = buildTelegramInboundOriginTarget(params.context.chatId, threadSpec);
	const recoveredFrom = params.context.isGroup ? buildTelegramGroupFrom(params.context.chatId, threadSpec.id) : params.context.ctxPayload.From;
	const recoveredUpdateLastRoute = params.context.turn.record.updateLastRoute && threadSpec.id != null ? {
		...params.context.turn.record.updateLastRoute,
		to: `telegram:${params.context.chatId}:topic:${threadSpec.id}`,
		threadId: String(threadSpec.id)
	} : params.context.turn.record.updateLastRoute;
	const recoveredHistoryKey = params.context.isGroup ? buildTelegramGroupPeerId(params.context.chatId, threadSpec.id) : params.context.historyKey;
	const recoveredHistoryEntries = recoveredHistoryKey && params.context.historyLimit > 0 ? (params.context.groupHistories.get(recoveredHistoryKey) ?? []).filter((entry) => isTelegramHistoryEntryAfterAmbientWatermark(entry, params.context.ctxPayload.AmbientTranscriptPreviousMessageId ? {
		messageId: params.context.ctxPayload.AmbientTranscriptPreviousMessageId,
		...params.context.ctxPayload.AmbientTranscriptPreviousTimestampMs !== void 0 ? { timestampMs: params.context.ctxPayload.AmbientTranscriptPreviousTimestampMs } : {}
	} : void 0)).slice(-params.context.historyLimit) : [];
	const recoveredWatermarkedHistoryEntries = selectTelegramGroupHistoryAfterLastSelf(recoveredHistoryEntries).slice(-params.context.historyLimit);
	const recoveredPromptHistoryEntries = params.context.isGroup && recoveredHistoryKey && params.context.historyLimit > 0 ? params.context.ctxPayload.InboundEventKind === "room_event" ? recoveredHistoryEntries : recoveredWatermarkedHistoryEntries : [];
	const recoveredInboundHistory = params.context.isGroup && recoveredHistoryKey && params.context.historyLimit > 0 ? recoveredPromptHistoryEntries.length > 0 ? recoveredPromptHistoryEntries : void 0 : params.context.ctxPayload.InboundHistory;
	const recoveredBodyForAgent = extractCurrentTelegramBody(params.context.ctxPayload.BodyForAgent ?? params.context.ctxPayload.Body);
	const recoveredPromptContextBase = retainTelegramGroupHistoryPromptContext({
		promptContext: params.context.ctxPayload.UntrustedStructuredContext ?? [],
		entries: recoveredPromptHistoryEntries
	});
	const recoveredPromptContext = recoveredPromptHistoryEntries.length > 0 ? mergeTelegramGroupHistoryPromptContext({
		promptContext: recoveredPromptContextBase ?? [],
		entries: recoveredPromptHistoryEntries
	}) : recoveredPromptContextBase?.length ? recoveredPromptContextBase : void 0;
	const recoveredSendTyping = buildRecoveredTelegramChatActionSender({
		context: params.context,
		threadId: threadSpec.id,
		action: "typing"
	});
	const recoveredSendRecordVoice = buildRecoveredTelegramChatActionSender({
		context: params.context,
		threadId: threadSpec.id,
		action: "record_voice"
	});
	migrateRecoveredTelegramGroupHistory({
		context: params.context,
		recoveredHistoryKey
	});
	return {
		...params.context,
		historyKey: recoveredHistoryKey,
		threadSpec,
		resolvedThreadId: threadSpec.id,
		replyThreadId: threadSpec.id,
		sendTyping: recoveredSendTyping,
		sendRecordVoice: recoveredSendRecordVoice,
		turn: {
			...params.context.turn,
			record: {
				...params.context.turn.record,
				updateLastRoute: recoveredUpdateLastRoute
			}
		},
		ctxPayload: threadSpec.id == null ? params.context.ctxPayload : {
			...params.context.ctxPayload,
			Body: recoveredBodyForAgent,
			BodyForAgent: recoveredBodyForAgent,
			From: recoveredFrom,
			InboundHistory: recoveredInboundHistory,
			MessageThreadId: threadSpec.id,
			OriginatingTo: recoveredRoutingTarget,
			To: recoveredRoutingTarget,
			TransportThreadId: threadSpec.id,
			UntrustedStructuredContext: recoveredPromptContext
		}
	};
}
//#endregion
//#region extensions/telegram/src/agent-config.ts
const DEFAULT_AGENT_ID = "main";
function normalizeAgentId(value) {
	return (value ?? "").trim().toLowerCase() || DEFAULT_AGENT_ID;
}
function resolveTelegramConfigReasoningDefault(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	return cfg.agents?.list?.find((entry) => normalizeAgentId(entry?.id) === id)?.reasoningDefault ?? cfg.agents?.defaults?.reasoningDefault ?? "off";
}
//#endregion
//#region extensions/telegram/src/auto-topic-label-config.ts
const AUTO_TOPIC_LABEL_DEFAULT_PROMPT = "Generate a very short topic label (2-4 words, max 25 chars) for a chat conversation based on the user's first message below. No emoji. Use the same language as the message. Be concise and descriptive. Return ONLY the topic name, nothing else.";
function resolveAutoTopicLabelConfig(directConfig, accountConfig) {
	const config = directConfig ?? accountConfig;
	if (config === void 0 || config === true) return {
		enabled: true,
		prompt: AUTO_TOPIC_LABEL_DEFAULT_PROMPT
	};
	if (config === false || config.enabled === false) return null;
	return {
		enabled: true,
		prompt: config.prompt?.trim() || AUTO_TOPIC_LABEL_DEFAULT_PROMPT
	};
}
//#endregion
//#region extensions/telegram/src/auto-topic-label.ts
async function generateTelegramTopicLabel(params) {
	return await generateConversationLabel({
		...params,
		maxLength: 128
	});
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-session.ts
function createFreshTelegramSessionEntryLoader(params) {
	const entriesByPathAndKey = /* @__PURE__ */ new Map();
	const load = ((agentId, sessionKey) => {
		const storePath = params.telegramDeps.resolveStorePath(params.cfg.session?.store, { agentId });
		const cacheKey = `${storePath}\0${sessionKey}`;
		if (entriesByPathAndKey.has(cacheKey)) return {
			storePath,
			entry: entriesByPathAndKey.get(cacheKey)
		};
		const entry = (params.telegramDeps.getSessionEntry ?? getSessionEntry)({
			storePath,
			sessionKey,
			readConsistency: "latest"
		});
		entriesByPathAndKey.set(cacheKey, entry);
		return {
			storePath,
			entry
		};
	});
	load.clear = () => entriesByPathAndKey.clear();
	return load;
}
function resolveTelegramReasoningLevel(params) {
	const configDefault = resolveTelegramConfigReasoningDefault(params.cfg, params.agentId);
	if (!params.sessionKey) return configDefault;
	try {
		const { entry } = params.loadFreshSessionEntry(params.agentId, params.sessionKey);
		const level = entry?.reasoningLevel;
		return level === "on" || level === "stream" || level === "off" ? level : configDefault;
	} catch {
		return "off";
	}
}
function resolveTelegramMirroredTranscriptText(payload) {
	const mediaUrls = payload.mediaUrls?.filter((url) => url.trim()) ?? [];
	if (mediaUrls.length > 0) return mediaUrls.map((url) => {
		const pathname = url.split("#")[0]?.split("?")[0] ?? url;
		const base = path.basename(pathname);
		return base && base !== "." && base !== "/" ? base : "media";
	}).join(", ");
	return payload.text?.trim() || null;
}
function resolveTelegramScopedTranscriptSession(params) {
	const { entry, storePath } = params.loadFreshSessionEntry(params.agentId, params.sessionKey);
	const sessionId = entry?.sessionId?.trim();
	return sessionId ? {
		sessionId,
		storePath
	} : void 0;
}
async function mirrorTelegramAssistantReplyToTranscript(params) {
	const text = resolveTelegramMirroredTranscriptText(params.payload);
	if (!text) return;
	const session = resolveTelegramScopedTranscriptSession({
		agentId: params.route.agentId,
		loadFreshSessionEntry: params.loadFreshSessionEntry,
		sessionKey: params.sessionKey
	});
	if (!session) return;
	const appended = await appendAssistantMirrorMessageByIdentity({
		agentId: params.route.agentId,
		config: params.cfg,
		idempotencyKey: params.idempotencyKey,
		deliveryMirror: {
			kind: "channel-final",
			sourceMessageId: params.idempotencyKey
		},
		sessionId: session.sessionId,
		sessionKey: params.sessionKey,
		storePath: session.storePath,
		text
	});
	if (!appended.ok && appended.code !== "session-rebound") logVerbose(`telegram transcript mirror append failed: ${appended.reason}`);
}
function createCurrentTurnTranscriptFinalResolver(params) {
	return async () => {
		if (!params.sessionKey) return;
		try {
			const { entry, storePath } = params.loadFreshSessionEntry(params.agentId, params.sessionKey);
			if (!entry?.sessionId) return;
			const latest = await readLatestAssistantTextByIdentity({
				agentId: params.agentId,
				sessionId: entry.sessionId,
				sessionKey: params.sessionKey,
				storePath
			});
			if (!latest?.timestamp || latest.timestamp < params.dispatchStartedAt) return;
			return {
				...latest.id ? { messageId: latest.id } : {},
				text: latest.text
			};
		} catch (err) {
			logVerbose(`telegram transcript final candidate lookup failed: ${formatErrorMessage(err)}`);
			return;
		}
	};
}
//#endregion
//#region extensions/telegram/src/lane-delivery-text-deliverer.ts
function result(kind, delivery) {
	if (kind === "preview-finalized") {
		const finalized = delivery;
		return {
			kind,
			delivery: {
				...finalized,
				receipt: finalized.receipt ?? createPreviewMessageReceipt({ id: finalized.messageId })
			}
		};
	}
	return { kind };
}
function createLaneTextDeliverer(params) {
	const textOnlyPayload = (payload) => {
		const { mediaUrl: _mediaUrl, mediaUrls: _mediaUrls, audioAsVoice: _audioAsVoice, spokenText: _spokenText, ...rest } = payload;
		return rest;
	};
	const mediaChannelData = (channelData, options) => {
		if (!options?.stripButtons) return channelData;
		const telegramData = channelData?.telegram;
		if (!telegramData || typeof telegramData !== "object" || Array.isArray(telegramData)) return channelData;
		const { buttons: _buttons, ...telegramRest } = telegramData;
		if (_buttons === void 0) return channelData;
		const next = { ...channelData };
		if (Object.keys(telegramRest).length > 0) next.telegram = telegramRest;
		else delete next.telegram;
		return Object.keys(next).length > 0 ? next : void 0;
	};
	const withMediaChannelData = (payload, options) => {
		const channelData = mediaChannelData(payload.channelData, options);
		if (channelData === payload.channelData) return payload;
		if (channelData) return {
			...payload,
			channelData
		};
		const { channelData: _channelData, ...rest } = payload;
		return rest;
	};
	const withFallbackTelegramButtons = (payload, buttons) => {
		if (!buttons) return payload;
		const channelData = payload.channelData ?? {};
		const telegramData = channelData.telegram;
		if (telegramData && typeof telegramData === "object" && !Array.isArray(telegramData) && "buttons" in telegramData) return payload;
		const telegramRest = telegramData && typeof telegramData === "object" && !Array.isArray(telegramData) ? telegramData : {};
		return {
			...payload,
			channelData: {
				...channelData,
				telegram: {
					...telegramRest,
					buttons
				}
			}
		};
	};
	const mediaOnlyPayload = (payload, text, options) => {
		if (getReplyPayloadTtsSupplement(payload)) return withFallbackTelegramButtons(withMediaChannelData(buildTtsSupplementMediaPayload(params.applyTextToPayload(payload, text)), options), options?.fallbackButtons);
		if (payload.audioAsVoice === true) {
			const { text: _text, presentation: _presentation, interactive: _interactive, btw: _btw, spokenText: _spokenText, ...voicePayload } = params.applyTextToPayload(payload, text);
			return withFallbackTelegramButtons(withMediaChannelData({
				...voicePayload,
				spokenText: text
			}, options), options?.fallbackButtons);
		}
		const { text: _text, presentation: _presentation, interactive: _interactive, btw: _btw, ...rest } = payload;
		return withFallbackTelegramButtons(withMediaChannelData(rest, options), options?.fallbackButtons);
	};
	const clearUnfinalizedStream = async (lane) => {
		if (!lane.stream || lane.finalized) return;
		await params.clearDraftLane(lane);
		lane.lastPartialText = "";
		lane.hasStreamedMessage = false;
	};
	const discardUnmaterializedStream = async (lane) => {
		const stream = lane.stream;
		if (stream) {
			await stream.discard?.();
			stream.forceNewMessage();
		}
		lane.lastPartialText = "";
		lane.hasStreamedMessage = false;
		lane.finalized = false;
	};
	const rotateFinalizedStream = (lane) => {
		if (!lane.stream || !lane.finalized) return;
		lane.stream.forceNewMessage();
		lane.lastPartialText = "";
		lane.hasStreamedMessage = false;
		lane.finalized = false;
	};
	const recordRetainedPromptContextPages = async (lane, sequence) => {
		for (const page of lane.retainedPromptContextPages.splice(0)) await sequence.accept(page);
	};
	const streamText = async (laneName, lane, text, payload, useFinalTextRecovery, finalizePreview, buttons, promptContextSequence, followedByDurablePayload = false) => {
		const stream = lane.stream;
		if (!stream || text.length === 0 || payload.isError) return;
		rotateFinalizedStream(lane);
		const finalText = text.trimEnd();
		const candidateTexts = [stream.lastDeliveredText?.(), lane.lastPartialText];
		if (useFinalTextRecovery && isPotentialTruncatedFinal(finalText)) {
			const resolvedFullCandidate = await params.resolveFinalTextCandidate?.({
				finalText: text,
				laneName
			});
			if (resolvedFullCandidate) candidateTexts.push(resolvedFullCandidate);
		}
		const previewText = useFinalTextRecovery && isPotentialTruncatedFinal(finalText) ? selectLongerFinalText({
			finalText,
			candidateTexts
		}) ?? finalText : finalText;
		lane.lastPartialText = previewText;
		lane.hasStreamedMessage = true;
		lane.finalized = false;
		if (stream.lastDeliveredText?.() !== previewText) stream.update(previewText);
		if (finalizePreview) await params.stopDraftLane(lane);
		else await params.flushDraftLane(lane);
		const messageId = stream.messageId();
		if (typeof messageId !== "number") {
			if (finalizePreview && stream.sendMayHaveLanded?.()) {
				await recordRetainedPromptContextPages(lane, promptContextSequence);
				await promptContextSequence.fail();
				lane.finalized = true;
				params.markDelivered();
				return result("preview-retained");
			}
			if (!finalizePreview) await discardUnmaterializedStream(lane);
			return;
		}
		if (finalizePreview && stream.lastDeliveredText?.() !== previewText) {
			if (!lane.retainedPromptContextPages.length || !stream.remainingFinalContent?.()?.text.trimEnd()) promptContextSequence.invalidate();
			return;
		}
		params.markDelivered();
		const activeSnapshot = finalizePreview || buttons ? stream.currentMessageSnapshot?.() : void 0;
		let buttonsAttached = false;
		if (buttons && activeSnapshot) try {
			await params.editStreamMessage({
				laneName,
				messageId,
				text: activeSnapshot.sourceText,
				...activeSnapshot.sourceTextMode ? { textMode: activeSnapshot.sourceTextMode } : {},
				buttons
			});
			buttonsAttached = true;
		} catch (err) {
			params.log(`telegram: ${laneName} stream button edit failed: ${String(err)}`);
		}
		if (!finalizePreview) return result("preview-updated");
		if (!activeSnapshot) {
			promptContextSequence.invalidate();
			return;
		}
		lane.finalized = true;
		await recordRetainedPromptContextPages(lane, promptContextSequence);
		await promptContextSequence.accept({
			messageId,
			text: activeSnapshot.text
		});
		if (!followedByDurablePayload) await promptContextSequence.finish();
		return result("preview-finalized", {
			content: previewText,
			messageId,
			buttonsAttached
		});
	};
	return async ({ laneName, text, payload, infoKind, buttons, finalizePreview: requestedFinalizePreview, durable: requestedDurable, allowStream = true, promptContextSequence: suppliedPromptContextSequence }) => {
		const lane = params.lanes[laneName];
		const promptContextSequence = suppliedPromptContextSequence ?? params.createPromptContextSequence();
		const reply = resolveSendableOutboundReplyParts(payload, { text });
		const isDurableFinal = infoKind === "final";
		const finalizePreview = requestedFinalizePreview ?? isDurableFinal;
		const durable = requestedDurable ?? isDurableFinal;
		const streamed = allowStream && !reply.hasMedia ? await streamText(laneName, lane, text, payload, isDurableFinal, finalizePreview, buttons, promptContextSequence) : void 0;
		if (streamed) return streamed;
		if (finalizePreview && reply.hasMedia && lane.stream && lane.hasStreamedMessage && !lane.finalized && text.trim().length > 0) {
			const finalizedPreview = await streamText(laneName, lane, text, textOnlyPayload(payload), isDurableFinal, true, buttons, promptContextSequence, true);
			if (finalizedPreview) {
				const stripButtons = finalizedPreview.kind === "preview-finalized" && finalizedPreview.delivery.buttonsAttached === true;
				const mediaText = finalizedPreview.kind === "preview-finalized" ? finalizedPreview.delivery.content : text;
				await params.sendPayload(mediaOnlyPayload(payload, mediaText, {
					stripButtons,
					fallbackButtons: stripButtons ? void 0 : buttons
				}), {
					afterAcceptedDraft: true,
					durable,
					promptContextSequence
				});
				return finalizedPreview;
			}
		}
		const retainedFinalContent = finalizePreview && lane.retainedPromptContextPages.length > 0 ? lane.stream?.remainingFinalContent?.() : void 0;
		const afterAcceptedDraft = retainedFinalContent !== void 0 || lane.stream?.hasConsumedReplyTarget?.() === true;
		if (finalizePreview) {
			await recordRetainedPromptContextPages(lane, promptContextSequence);
			await clearUnfinalizedStream(lane);
		}
		const delivered = await params.sendPayload(params.applyTextToPayload(payload, retainedFinalContent?.sourceText ?? text), {
			afterAcceptedDraft,
			durable,
			promptContextSequence,
			...retainedFinalContent?.sourceTextMode === "html" ? { textMode: "html" } : {}
		});
		if (delivered && finalizePreview) lane.finalized = true;
		return delivered ? result("sent") : result("skipped");
	};
}
//#endregion
//#region extensions/telegram/src/lane-delivery-state.ts
function createLaneDeliveryStateTracker() {
	const state = {
		delivered: false,
		skippedNonSilent: 0,
		failedNonSilent: 0
	};
	return {
		markDelivered: () => {
			state.delivered = true;
		},
		markNonSilentSkip: () => {
			state.skippedNonSilent += 1;
		},
		markNonSilentFailure: () => {
			state.failedNonSilent += 1;
		},
		snapshot: () => ({ ...state })
	};
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-delivery.ts
function createTelegramDeliveryController(params) {
	const { context } = params;
	const sessionKey = context.ctxPayload.SessionKey;
	const deliveryState = createLaneDeliveryStateTracker();
	const resolveCurrentTurnTranscriptFinal = createCurrentTurnTranscriptFinalResolver({
		agentId: context.route.agentId,
		dispatchStartedAt: params.dispatchStartedAt,
		loadFreshSessionEntry: params.loadFreshSessionEntry,
		sessionKey
	});
	let transcriptMirrorSequence = 0;
	const transcriptMirrorTurnId = `${context.chatId}:${context.ctxPayload.MessageSid ?? context.msg.message_id ?? params.dispatchStartedAt}`;
	const implicitQuoteReplyTargetId = context.ctxPayload.ReplyToIsQuote && !context.msg.reply_to_message?.from?.is_bot && params.replyQuoteMessageId != null ? String(params.replyQuoteMessageId) : void 0;
	const currentMessageIdForQuoteReply = implicitQuoteReplyTargetId && context.ctxPayload.MessageSid ? context.ctxPayload.MessageSid : void 0;
	const projectPayloadForDelivery = (payload) => projectOutboundPayloadPlanForDelivery(createOutboundPayloadPlan([payload], {
		cfg: params.cfg,
		sessionKey,
		surface: "telegram"
	}))[0];
	const promptContextDeliverySignature = (payload) => {
		const projected = projectPayloadForDelivery(payload);
		return projected ? resolveTelegramPromptContextDeliverySignature(projected) : void 0;
	};
	const resolvePromptContextSource = (final, ...payloads) => {
		const finalSignature = final ? promptContextDeliverySignature({ text: final.text }) : void 0;
		if (!final?.messageId || !finalSignature) return;
		return payloads.some((payload) => promptContextDeliverySignature(payload) === finalSignature) ? { transcriptMessageId: final.messageId } : void 0;
	};
	const recordPromptContextMessage = (record) => (params.telegramDeps.recordOutboundMessageForPromptContext ?? recordOutboundMessageForPromptContext)({
		cfg: params.cfg,
		account: {
			accountId: context.route.accountId,
			...params.telegramCfg.name !== void 0 ? { name: params.telegramCfg.name } : {},
			...context.primaryCtx.me ? { bot: context.primaryCtx.me } : {}
		},
		...context.primaryCtx.me?.id !== void 0 ? { botUserId: context.primaryCtx.me.id } : {},
		chatId: String(context.chatId),
		message: record.message ?? { message_id: record.messageId },
		messageId: record.messageId,
		...record.text ? { text: record.text } : {},
		...record.projection ? { promptContextProjection: record.projection } : {},
		...params.threadSpec.id !== void 0 ? { messageThreadId: params.threadSpec.id } : {}
	});
	const createPromptContextSequence = (source) => createTelegramPromptContextProjectionSequence({
		...source ? { source } : {},
		record: recordPromptContextMessage
	});
	const transcriptMirror = sessionKey ? async (payload) => {
		const idempotencyKey = `telegram-final:${sessionKey}:${transcriptMirrorTurnId}:${transcriptMirrorSequence++}`;
		await mirrorTelegramAssistantReplyToTranscript({
			cfg: params.cfg,
			idempotencyKey,
			loadFreshSessionEntry: params.loadFreshSessionEntry,
			route: context.route,
			sessionKey,
			payload
		});
	} : void 0;
	const deliveryBaseOptions = {
		chatId: String(context.chatId),
		accountId: context.route.accountId,
		sessionKeyForInternalHooks: sessionKey,
		mirrorIsGroup: context.isGroup,
		mirrorGroupId: context.isGroup ? String(context.chatId) : void 0,
		token: params.opts.token,
		runtime: params.runtime,
		bot: params.bot,
		mediaLocalRoots: params.mediaLocalRoots,
		mediaMaxBytes: (params.opts.mediaMaxMb ?? params.telegramCfg.mediaMaxMb ?? 100) * 1024 * 1024,
		replyToMode: params.replyToMode,
		textLimit: params.textLimit,
		thread: params.threadSpec,
		tableMode: params.tableMode,
		chunkMode: params.chunkMode,
		richMessages: params.telegramCfg.richMessages,
		linkPreview: params.telegramCfg.linkPreview,
		replyQuoteMessageId: params.replyQuoteMessageId,
		replyQuoteText: params.replyQuoteText,
		replyQuotePosition: params.replyQuotePosition,
		replyQuoteEntities: params.replyQuoteEntities,
		replyQuoteByMessageId: params.replyQuoteByMessageId,
		transcriptMirror
	};
	const applyTextToPayload = (payload, text) => payload.text === text ? payload : {
		...payload,
		text
	};
	const applyQuoteReplyTarget = (payload) => {
		if (!implicitQuoteReplyTargetId || !currentMessageIdForQuoteReply || payload.replyToId !== currentMessageIdForQuoteReply || payload.replyToTag || payload.replyToCurrent) return payload;
		return {
			...payload,
			replyToId: implicitQuoteReplyTargetId
		};
	};
	const usesNativeTelegramQuote = (payload) => params.replyQuoteText != null || payload.replyToId != null && params.replyQuoteByMessageId[payload.replyToId] != null;
	const sendPayload = async (payload, options) => {
		if (params.isDispatchSuperseded()) {
			await options?.promptContextSequence?.fail();
			return false;
		}
		const targetedPayload = applyQuoteReplyTarget(payload);
		const finalReplyTargetId = resolveTelegramReplyId(targetedPayload.replyToId);
		const targetsDifferentMessage = finalReplyTargetId != null && finalReplyTargetId !== params.draftReplyToMessageId;
		const consumedSingleUseReply = options?.afterAcceptedDraft === true && isSingleUseReplyToMode(params.replyToMode) && !targetsDifferentMessage;
		const deliverablePayload = consumedSingleUseReply ? (({ replyToId: _, replyToTag: _tag, replyToCurrent: _current, ...rest }) => rest)(targetedPayload) : targetedPayload;
		const effectiveReplyToMode = consumedSingleUseReply ? "off" : params.replyToMode;
		const projectionSequence = options?.promptContextSequence ?? createPromptContextSequence(options?.durable ? resolvePromptContextSource(await resolveCurrentTurnTranscriptFinal(), deliverablePayload) : void 0);
		const effectivePayload = withTelegramPromptContextSource(deliverablePayload, projectionSequence.source);
		const silent = options?.silent ?? (params.telegramCfg.silentErrorReplies === true && payload.isError === true);
		const durableDelivery = params.telegramDeps.deliverInboundReplyWithMessageSendContext;
		if (options?.durable && durableDelivery && projectionSequence.isFresh()) {
			const durable = await durableDelivery({
				cfg: params.cfg,
				channel: "telegram",
				to: String(context.chatId),
				accountId: context.route.accountId,
				agentId: context.route.agentId,
				ctxPayload: context.ctxPayload,
				payload: effectivePayload,
				info: { kind: "final" },
				replyToMode: effectiveReplyToMode,
				threadId: params.threadSpec.id,
				formatting: {
					textLimit: params.textLimit,
					tableMode: params.tableMode,
					chunkMode: params.chunkMode,
					...options?.textMode === "html" ? { parseMode: "HTML" } : {}
				},
				silent,
				requiredCapabilities: deriveDurableFinalDeliveryRequirements({
					payload: effectivePayload,
					replyToId: effectivePayload.replyToId,
					threadId: params.threadSpec.id,
					silent,
					payloadTransport: true,
					extraCapabilities: { nativeQuote: !consumedSingleUseReply && usesNativeTelegramQuote(effectivePayload) }
				})
			});
			if (durable.status === "failed") {
				await projectionSequence.fail();
				throw durable.error;
			}
			if (durable.status === "handled_visible") {
				deliveryState.markDelivered();
				return true;
			}
			if (durable.status === "handled_no_send") {
				await projectionSequence.fail();
				return false;
			}
		}
		try {
			if (!(await (params.telegramDeps.deliverReplies ?? deliverReplies)({
				...deliveryBaseOptions,
				replyToMode: effectiveReplyToMode,
				transcriptMirror: options?.durable && options?.mirrorTranscript !== false ? transcriptMirror : void 0,
				replies: [effectivePayload],
				onVoiceRecording: context.sendRecordVoice,
				silent,
				mediaLoader: params.telegramDeps.loadWebMedia,
				promptContextSequence: projectionSequence,
				...options?.textMode ? { textMode: options.textMode } : {}
			})).delivered) {
				await projectionSequence.fail();
				return false;
			}
			await projectionSequence.finish();
			deliveryState.markDelivered();
			return true;
		} catch (error) {
			await projectionSequence.fail();
			throw error;
		}
	};
	const emitPreviewFinalizedHook = async (result) => {
		if (params.isDispatchSuperseded() || result.kind !== "preview-finalized") return;
		(params.telegramDeps.emitInternalMessageSentHook ?? emitInternalMessageSentHook)({
			sessionKeyForInternalHooks: sessionKey,
			chatId: String(context.chatId),
			accountId: context.route.accountId,
			content: result.delivery.content,
			success: true,
			messageId: result.delivery.messageId,
			isGroup: context.isGroup,
			groupId: context.isGroup ? String(context.chatId) : void 0
		});
		if (transcriptMirror && result.delivery.content) transcriptMirror({ text: result.delivery.content }).catch((err) => {
			logVerbose(`telegram preview-finalized transcriptMirror failed: ${formatErrorMessage(err)}`);
		});
	};
	const deliverLaneText = createLaneTextDeliverer({
		lanes: params.draft.lanes,
		applyTextToPayload,
		sendPayload,
		flushDraftLane: params.draft.flushLane,
		stopDraftLane: async (lane) => await lane.stream?.stop(),
		clearDraftLane: async (lane) => await lane.stream?.clear(),
		editStreamMessage: async ({ messageId, text, textMode, buttons }) => {
			if (!params.isDispatchSuperseded()) await (params.telegramDeps.editMessageTelegram ?? editMessageTelegram)(context.chatId, messageId, text, {
				api: params.bot.api,
				cfg: params.cfg,
				accountId: context.route.accountId,
				linkPreview: params.telegramCfg.linkPreview,
				textMode,
				buttons
			});
		},
		createPromptContextSequence,
		resolveFinalTextCandidate: async () => (await resolveCurrentTurnTranscriptFinal())?.text,
		log: logVerbose,
		markDelivered: deliveryState.markDelivered
	});
	const materializeAnswerLaneBeforeRotation = async () => {
		const block = params.draft.activeAnswerBlockDelivery();
		const lane = params.draft.answerLane;
		if (!block || !lane.stream || !lane.hasStreamedMessage || lane.finalized || params.draft.isAnswerToolProgressOnly()) return;
		const text = lane.lastPartialText || params.draft.lastAnswerPartialText() || block.text;
		if (!text?.trim()) return;
		const result = await deliverLaneText({
			laneName: "answer",
			text,
			payload: block.payload,
			infoKind: "block",
			buttons: block.buttons,
			finalizePreview: true,
			durable: false
		});
		params.draft.setActiveAnswerBlockDelivery();
		await emitPreviewFinalizedHook(result);
	};
	params.draft.setMaterializeBeforeRotation(materializeAnswerLaneBeforeRotation);
	const postCosmeticSummaryBar = async (line) => {
		try {
			await sendPayload({ text: line }, {
				durable: true,
				mirrorTranscript: false
			});
		} catch (err) {
			logVerbose(`telegram: collapse summary bar send failed: ${formatErrorMessage(err)}`);
		}
	};
	const deliverProgressCollapseSummary = async () => {
		const line = params.progress.resolveCollapseSummaryLine();
		if (line) await postCosmeticSummaryBar(line);
	};
	const deliverProgressModeFinalAnswer = async (payload, text, promptContextSequence) => {
		const afterAcceptedDraft = params.draft.answerLane.stream?.hasConsumedReplyTarget?.() === true;
		if (payload.isError === true) {
			params.progress.setSummaryDelivered();
			await params.progress.teardownWindow();
			if (!await sendPayload(applyTextToPayload(payload, text), {
				afterAcceptedDraft,
				durable: true,
				promptContextSequence
			})) return { kind: "skipped" };
			params.draft.answerLane.finalized = true;
			params.progress.markFinalDelivered();
			return { kind: "sent" };
		}
		const barLine = params.progress.resolveCollapseSummaryLine();
		const delivered = await sendPayload(applyTextToPayload(payload, text), {
			afterAcceptedDraft,
			durable: true,
			promptContextSequence
		});
		if (barLine) {
			await params.progress.applyCollapseSummary(barLine, postCosmeticSummaryBar);
			params.progress.resetAnswerLaneAfterCollapse();
		} else await params.progress.teardownWindow();
		if (!delivered) return { kind: "skipped" };
		params.draft.answerLane.finalized = true;
		params.progress.markFinalDelivered();
		return { kind: "sent" };
	};
	const deliverFinalAnswerText = async (answerPayload, text, buttons) => {
		const transcriptFinal = await resolveCurrentTurnTranscriptFinal();
		const finalText = await resolveTranscriptBackedChannelFinalText({
			finalText: text,
			resolveCandidateText: async () => transcriptFinal?.text
		});
		const source = resolvePromptContextSource(transcriptFinal, answerPayload, applyTextToPayload(answerPayload, finalText));
		const promptContextSequence = createPromptContextSequence(source);
		const isFollowUp = params.progress.finalAnswerDelivered();
		let result;
		if (!isFollowUp && params.streamMode === "progress") result = await deliverProgressModeFinalAnswer(answerPayload, finalText, promptContextSequence);
		else {
			if (isFollowUp) await params.draft.prepareAnswerLaneForText();
			else if (!await params.draft.rotateAnswerLaneAfterToolProgress()) await params.draft.rotateAnswerLaneAfterQueuedBlocksSettle();
			result = await deliverLaneText({
				laneName: "answer",
				text: finalText,
				payload: answerPayload,
				infoKind: "final",
				buttons,
				allowStream: !usesNativeTelegramQuote(answerPayload),
				promptContextSequence
			});
			if (!isFollowUp && result.kind !== "skipped") params.progress.markFinalDelivered();
		}
		if (result.kind === "preview-finalized") await emitPreviewFinalizedHook(result);
		return result;
	};
	const finalizePendingAnswerBlockDraft = async (final) => {
		const block = params.draft.activeAnswerBlockDelivery();
		if (!block || final.queuedFinal || final.dispatchError || params.isDispatchSuperseded() || params.draft.answerLane.finalized) return;
		const content = block.text.trimEnd();
		if (!content) return;
		params.progress.markFinalStarted();
		await deliverFinalAnswerText(block.payload, content, block.buttons);
		params.draft.setActiveAnswerBlockDelivery();
	};
	return {
		applyTextToPayload,
		createPromptContextSequence,
		deliverFallback: async (replies, silent) => await (params.telegramDeps.deliverReplies ?? deliverReplies)({
			replies,
			...deliveryBaseOptions,
			silent,
			mediaLoader: params.telegramDeps.loadWebMedia
		}),
		deliverFinalAnswerText,
		deliverLaneText,
		deliverProgressCollapseSummary,
		emitPreviewFinalizedHook,
		finalizePendingAnswerBlockDraft,
		markDelivered: deliveryState.markDelivered,
		markNonSilentFailure: deliveryState.markNonSilentFailure,
		markNonSilentSkip: deliveryState.markNonSilentSkip,
		normalizeDeliveryPayload: (payload) => {
			const keepReasoningLane = payload.isReasoning === true && params.draft.durableReasoningPayloadsEnabled;
			const payloadForPlan = keepReasoningLane ? { ...payload } : payload;
			if (keepReasoningLane) delete payloadForPlan.isReasoning;
			const normalized = projectPayloadForDelivery(payloadForPlan);
			return normalized ? canonicalizeTelegramPresentationPayload(normalized, { allowWebAppButtons: resolveTelegramTargetChatType(String(context.chatId)) === "direct" }) : void 0;
		},
		sendPayload,
		snapshot: deliveryState.snapshot
	};
}
//#endregion
//#region extensions/telegram/src/draft-chunking.ts
function resolveTelegramDraftStreamingChunking(cfg, accountId) {
	return resolveChannelDraftStreamingChunking(cfg, "telegram", accountId, { fallbackLimit: TELEGRAM_TEXT_CHUNK_LIMIT });
}
//#endregion
//#region extensions/telegram/src/reasoning-lane-coordinator.ts
const REASONING_MESSAGE_RE = /^🧠\s+_/u;
const CORE_THINKING_HEADER_RE = /^Thinking\.{0,3}\s*\n+/u;
const LEGACY_REASONING_MESSAGE_PREFIX = "Reasoning:\n";
function markReasoningMessage(formatted) {
	return formatted.replace(CORE_THINKING_HEADER_RE, "").replace(/^_/u, "🧠 _");
}
const REASONING_TAG_PREFIXES = [
	"<think",
	"<thinking",
	"<thought",
	"<antthinking",
	"<mm:think",
	"</think",
	"</thinking",
	"</thought",
	"</antthinking",
	"</mm:think"
];
const THINKING_TAG_RE = /<\s*(\/?)\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought)|antthinking)\b[^<>]*>/gi;
function extractThinkingFromTaggedStreamOutsideCode(text) {
	if (!text) return "";
	const codeRegions = findCodeRegions(text);
	let result = "";
	let lastIndex = 0;
	let inThinking = false;
	THINKING_TAG_RE.lastIndex = 0;
	for (const match of text.matchAll(THINKING_TAG_RE)) {
		const idx = match.index ?? 0;
		if (isInsideCode(idx, codeRegions)) continue;
		if (inThinking) result += text.slice(lastIndex, idx);
		inThinking = !(match[1] === "/");
		lastIndex = idx + match[0].length;
	}
	if (inThinking) result += text.slice(lastIndex);
	return result.trim();
}
function isPartialReasoningTagPrefix(text) {
	const trimmed = normalizeLowercaseStringOrEmpty(text.trimStart());
	if (!trimmed.startsWith("<")) return false;
	if (trimmed.includes(">")) return false;
	return REASONING_TAG_PREFIXES.some((prefix) => prefix.startsWith(trimmed));
}
function splitTelegramReasoningText(text, isReasoning) {
	if (typeof text !== "string") return {};
	if (isReasoning !== true) return { answerText: text };
	const trimmed = text.trim();
	if (isPartialReasoningTagPrefix(trimmed)) return {};
	if (REASONING_MESSAGE_RE.test(trimmed)) return { reasoningText: trimmed };
	if (CORE_THINKING_HEADER_RE.test(trimmed)) return { reasoningText: markReasoningMessage(trimmed) };
	if (trimmed.startsWith(LEGACY_REASONING_MESSAGE_PREFIX) && trimmed.length > 11) return { reasoningText: trimmed };
	const taggedReasoning = extractThinkingFromTaggedStreamOutsideCode(text);
	const strippedAnswer = stripReasoningTagsFromText(text, {
		mode: "strict",
		trim: "both"
	});
	return { reasoningText: markReasoningMessage(formatReasoningMessage(taggedReasoning || strippedAnswer || text)) };
}
function createTelegramReasoningStepState() {
	let reasoningStatus = "none";
	let bufferedFinalAnswer;
	const noteReasoningHint = () => {
		if (reasoningStatus === "none") reasoningStatus = "hinted";
	};
	const noteReasoningDelivered = () => {
		reasoningStatus = "delivered";
	};
	const shouldBufferFinalAnswer = () => {
		return reasoningStatus === "hinted" && !bufferedFinalAnswer;
	};
	const bufferFinalAnswer = (value) => {
		bufferedFinalAnswer = value;
	};
	const takeBufferedFinalAnswer = (currentGeneration) => {
		if (currentGeneration !== void 0 && bufferedFinalAnswer?.bufferedGeneration !== void 0 && bufferedFinalAnswer.bufferedGeneration !== currentGeneration) return;
		const value = bufferedFinalAnswer;
		bufferedFinalAnswer = void 0;
		return value;
	};
	const resetForNextStep = () => {
		reasoningStatus = "none";
		bufferedFinalAnswer = void 0;
	};
	return {
		noteReasoningHint,
		noteReasoningDelivered,
		shouldBufferFinalAnswer,
		bufferFinalAnswer,
		takeBufferedFinalAnswer,
		resetForNextStep
	};
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-draft.ts
const DRAFT_MIN_INITIAL_CHARS = 30;
function resolveDraftPartialText(previous, update) {
	const nextText = update.replace || update.isReasoningSnapshot || update.delta === void 0 ? update.text : `${previous}${update.delta}`;
	return nextText === previous ? void 0 : nextText;
}
function createTelegramDraftController(params) {
	const streamDeliveryEnabled = !params.isRoomEvent && params.streamMode !== "off";
	const accountBlockStreamingEnabled = resolveChannelStreamingBlockEnabled(params.telegramCfg) ?? params.cfg.agents?.defaults?.blockStreamingDefault === "on";
	const canStreamAnswerDraft = streamDeliveryEnabled && !params.hasTelegramQuoteReply && !accountBlockStreamingEnabled && !params.forceBlockStreamingForReasoning;
	const streamReasoningDraft = params.resolvedReasoningLevel === "stream";
	const streamReasoningInProgressDraft = streamReasoningDraft && params.streamMode === "progress" && canStreamAnswerDraft;
	const canStreamReasoningDraft = !params.isRoomEvent && streamReasoningDraft && !streamReasoningInProgressDraft;
	const draftMaxChars = params.streamMode === "block" ? Math.min(resolveTelegramDraftStreamingChunking(params.cfg, params.accountId).maxChars, params.textLimit) : Math.min(params.textLimit, params.telegramCfg.richMessages === true ? TELEGRAM_RICH_TEXT_LIMIT : TELEGRAM_TEXT_CHUNK_LIMIT);
	const renderStreamText = (text) => params.telegramCfg.richMessages === true ? {
		text,
		richMessage: buildTelegramRichMarkdown(text, {
			tableMode: params.tableMode,
			skipEntityDetection: params.telegramCfg.linkPreview === false
		})
	} : {
		text: renderTelegramHtmlText(text, { tableMode: params.tableMode }),
		parseMode: "HTML",
		markdownSource: {
			text,
			tableMode: params.tableMode
		}
	};
	const createDraftLane = (laneName, enabled) => {
		return {
			stream: enabled ? (params.telegramDeps.createTelegramDraftStream ?? createTelegramDraftStream)({
				api: params.bot.api,
				chatId: params.chatId,
				maxChars: draftMaxChars,
				thread: params.threadSpec,
				replyToMessageId: params.draftReplyToMessageId,
				replyToMode: params.replyToMode,
				richMessages: params.telegramCfg.richMessages,
				minInitialChars: params.streamMode === "progress" ? 0 : DRAFT_MIN_INITIAL_CHARS,
				renderText: renderStreamText,
				onRetainedPage: (page) => {
					lanes[laneName].retainedPromptContextPages.push({
						messageId: page.messageId,
						text: page.textSnapshot
					});
				},
				log: logVerbose,
				warn: logVerbose
			}) : void 0,
			lastPartialText: "",
			hasStreamedMessage: false,
			finalized: false,
			retainedPromptContextPages: []
		};
	};
	const lanes = {
		answer: createDraftLane("answer", canStreamAnswerDraft),
		reasoning: createDraftLane("reasoning", canStreamReasoningDraft)
	};
	const answerLane = lanes.answer;
	const reasoningLane = lanes.reasoning;
	let lastAnswerPartialText = "";
	let activeAnswerDraftIsToolProgressOnly = false;
	let activeAnswerBlockAssistantMessageIndex;
	let activeAnswerBlockDelivery;
	let materializeAnswerLaneBeforeRotation;
	const queuedAnswerBlockRotations = [];
	let queuedAnswerBlockAssistantMessageIndex;
	let pendingAnswerBlockAssistantMessageIndex;
	let rotateAnswerLaneWhenQueuedBlocksSettle = false;
	let eventQueue = Promise.resolve();
	let resetProgress = () => {};
	let suppressProgress = () => {};
	let noteReasoningHint = () => {};
	let noteReasoningDelivered = () => {};
	const resetAnswerToolProgressDraft = () => {
		activeAnswerDraftIsToolProgressOnly = false;
	};
	const resetLaneState = (lane) => {
		lane.lastPartialText = "";
		if (lane === answerLane) lastAnswerPartialText = "";
		lane.hasStreamedMessage = false;
		lane.finalized = false;
		lane.retainedPromptContextPages = [];
		if (lane === answerLane) {
			resetAnswerToolProgressDraft();
			pendingAnswerBlockAssistantMessageIndex = void 0;
			activeAnswerBlockDelivery = void 0;
		}
	};
	const repositionLaneForNewMessage = (lane) => {
		lane.stream?.rotateToNewMessageDeferringDelete();
		resetLaneState(lane);
	};
	const rotateLaneForNewMessage = async (lane) => {
		if (!lane.hasStreamedMessage && typeof lane.stream?.messageId() !== "number") {
			resetLaneState(lane);
			return;
		}
		await lane.stream?.stop();
		lane.stream?.forceNewMessage();
		resetLaneState(lane);
	};
	const rotateAnswerLaneForNewMessage = async () => {
		await materializeAnswerLaneBeforeRotation?.();
		await rotateLaneForNewMessage(answerLane);
	};
	const rotateAnswerLaneAfterToolProgress = async () => {
		if (!activeAnswerDraftIsToolProgressOnly) return false;
		repositionLaneForNewMessage(answerLane);
		suppressProgress();
		rotateAnswerLaneWhenQueuedBlocksSettle = false;
		return true;
	};
	const rotateAnswerLaneAfterQueuedBlocksSettle = async () => {
		if (!rotateAnswerLaneWhenQueuedBlocksSettle || queuedAnswerBlockRotations.length > 0) return false;
		rotateAnswerLaneWhenQueuedBlocksSettle = false;
		if (!answerLane.hasStreamedMessage || activeAnswerDraftIsToolProgressOnly) return false;
		await rotateAnswerLaneForNewMessage();
		return true;
	};
	const prepareAnswerLaneForText = async () => {
		if (params.streamMode === "progress") return false;
		if (await rotateAnswerLaneAfterToolProgress()) return true;
		if (await rotateAnswerLaneAfterQueuedBlocksSettle()) return true;
		if (!answerLane.finalized) return false;
		answerLane.stream?.forceNewMessage();
		resetLaneState(answerLane);
		rotateAnswerLaneWhenQueuedBlocksSettle = false;
		return true;
	};
	const prepareAnswerLaneForToolProgress = async () => {
		if (answerLane.finalized) {
			answerLane.stream?.forceNewMessage();
			resetLaneState(answerLane);
		}
		if (activeAnswerDraftIsToolProgressOnly) return;
		if (params.streamMode !== "progress" && answerLane.hasStreamedMessage) await rotateAnswerLaneForNewMessage();
		activeAnswerDraftIsToolProgressOnly = true;
	};
	const splitTextIntoLaneSegments = (update, isReasoning) => {
		const split = splitTelegramReasoningText(update.text, isReasoning);
		const splitSegments = [];
		const useDelta = !update.replace && update.isReasoningSnapshot !== true && update.delta !== void 0;
		const suppressReasoning = params.resolvedReasoningLevel === "off";
		if (split.reasoningText && !suppressReasoning) splitSegments.push({
			lane: "reasoning",
			text: split.reasoningText
		});
		if (split.answerText) splitSegments.push({
			lane: "answer",
			text: split.answerText
		});
		return {
			segments: splitSegments.map((segment) => ({
				lane: segment.lane,
				update: {
					text: segment.text,
					...!useDelta || splitSegments.length !== 1 ? {} : { delta: update.delta },
					...update.replace ? { replace: true } : {},
					...update.isReasoningSnapshot ? { isReasoningSnapshot: true } : {}
				}
			})),
			suppressedReasoningOnly: Boolean(split.reasoningText) && suppressReasoning && !split.answerText
		};
	};
	const updateDraftFromPartial = (lane, update) => {
		if (!lane.stream || !update.text) return;
		const nextText = resolveDraftPartialText(lane === answerLane ? lastAnswerPartialText : lane.lastPartialText, update);
		if (!nextText || lane === answerLane && params.streamMode === "progress") return;
		if (lane === answerLane) {
			resetAnswerToolProgressDraft();
			suppressProgress();
			lastAnswerPartialText = nextText;
		}
		lane.hasStreamedMessage = true;
		lane.finalized = false;
		lane.lastPartialText = nextText;
		lane.stream.update(nextText);
	};
	const ingestDraftLaneSegments = async (update, isReasoning) => {
		const split = splitTextIntoLaneSegments(update, isReasoning);
		for (const segment of split.segments) {
			if (segment.lane === "answer") await prepareAnswerLaneForText();
			if (segment.lane === "reasoning") {
				noteReasoningHint();
				noteReasoningDelivered();
			}
			updateDraftFromPartial(lanes[segment.lane], segment.update);
		}
	};
	const enqueueEvent = (task) => {
		eventQueue = eventQueue.then(async () => {
			if (!params.isDispatchSuperseded()) await task();
		}).catch((err) => {
			logVerbose(`telegram: draft lane callback failed: ${String(err)}`);
		});
		return eventQueue;
	};
	const recomputeQueuedAnswerBlockRotations = () => {
		let previous = activeAnswerBlockAssistantMessageIndex ?? pendingAnswerBlockAssistantMessageIndex;
		queuedAnswerBlockAssistantMessageIndex = void 0;
		for (const entry of queuedAnswerBlockRotations) {
			if (entry.assistantMessageIndex === void 0) continue;
			entry.shouldRotateBeforeDelivery = previous !== void 0 && entry.assistantMessageIndex !== previous;
			previous = entry.assistantMessageIndex;
			queuedAnswerBlockAssistantMessageIndex = entry.assistantMessageIndex;
		}
	};
	const rotationMatches = (entry, payload, assistantMessageIndex) => assistantMessageIndex !== void 0 && entry.assistantMessageIndex !== void 0 ? assistantMessageIndex === entry.assistantMessageIndex : entry.text !== void 0 && payload.text !== void 0 && entry.text === payload.text;
	const prepareQueuedAnswerBlock = async (payload, blockContext) => {
		if (!splitTextIntoLaneSegments({ text: payload.text }, payload.isReasoning).segments.some((segment) => segment.lane === "answer")) return;
		resetProgress();
		const assistantMessageIndex = blockContext?.assistantMessageIndex;
		if (assistantMessageIndex === void 0) {
			queuedAnswerBlockRotations.push({
				text: payload.text,
				shouldRotateBeforeDelivery: false
			});
			return;
		}
		const previous = queuedAnswerBlockAssistantMessageIndex ?? activeAnswerBlockAssistantMessageIndex ?? pendingAnswerBlockAssistantMessageIndex;
		queuedAnswerBlockRotations.push({
			assistantMessageIndex,
			text: payload.text,
			shouldRotateBeforeDelivery: previous !== void 0 && assistantMessageIndex !== previous
		});
		queuedAnswerBlockAssistantMessageIndex = assistantMessageIndex;
	};
	const takeQueuedAnswerBlockRotation = (payload, index) => {
		if (queuedAnswerBlockRotations.length === 0) return false;
		const matchIndex = queuedAnswerBlockRotations.findIndex((entry) => rotationMatches(entry, payload, index));
		const matched = queuedAnswerBlockRotations.splice(0, Math.max(matchIndex, 0) + 1).at(-1);
		if (matched?.assistantMessageIndex !== void 0) {
			activeAnswerBlockAssistantMessageIndex = matched.assistantMessageIndex;
			pendingAnswerBlockAssistantMessageIndex = void 0;
		}
		recomputeQueuedAnswerBlockRotations();
		return matched?.shouldRotateBeforeDelivery ?? false;
	};
	const dropQueuedAnswerBlockRotation = (payload, index) => {
		let matchIndex = queuedAnswerBlockRotations.findIndex((entry) => rotationMatches(entry, payload, index));
		if (matchIndex < 0 && index === void 0) matchIndex = queuedAnswerBlockRotations.findIndex((entry) => entry.assistantMessageIndex === void 0);
		if (matchIndex < 0) return;
		const [matched] = queuedAnswerBlockRotations.splice(matchIndex, 1);
		if (matchIndex === 0 && matched?.assistantMessageIndex !== void 0 && rotateAnswerLaneWhenQueuedBlocksSettle && activeAnswerBlockAssistantMessageIndex === void 0 && answerLane.hasStreamedMessage) pendingAnswerBlockAssistantMessageIndex = matched.assistantMessageIndex;
		recomputeQueuedAnswerBlockRotations();
	};
	const resolvedBlockStreamingEnabled = resolveChannelStreamingBlockEnabled(params.telegramCfg);
	return {
		answerLane,
		reasoningLane,
		lanes,
		canPushAnswerDraft: () => Boolean(answerLane.stream),
		cleanup: async (superseded) => {
			for (const lane of [answerLane, reasoningLane]) {
				const stream = lane.stream;
				if (!stream) continue;
				if (superseded) await (typeof stream.discard === "function" ? stream.discard() : stream.stop());
				else if (lane.finalized) await stream.stop();
				else await stream.clear();
			}
		},
		disableBlockStreaming: !streamDeliveryEnabled ? true : params.forceBlockStreamingForReasoning ? false : typeof resolvedBlockStreamingEnabled === "boolean" ? !resolvedBlockStreamingEnabled : canStreamAnswerDraft ? true : void 0,
		durableReasoningPayloadsEnabled: params.resolvedReasoningLevel === "on" || Boolean(reasoningLane.stream),
		enqueueEvent,
		ingestDraftLaneSegments,
		isAnswerToolProgressOnly: () => activeAnswerDraftIsToolProgressOnly,
		isQueuedAnswerBlock: (payload, index) => queuedAnswerBlockRotations.some((entry) => rotationMatches(entry, payload, index)),
		lastAnswerPartialText: () => lastAnswerPartialText,
		prepareAnswerLaneForText,
		prepareAnswerLaneForToolProgress,
		prepareQueuedAnswerBlock,
		dropQueuedAnswerBlockRotation,
		takeQueuedAnswerBlockRotation,
		renderStreamText,
		repositionLaneForNewMessage,
		resetAnswerToolProgressDraft,
		resetLaneState,
		rotateAnswerLaneAfterQueuedBlocksSettle,
		rotateAnswerLaneAfterToolProgress,
		rotateAnswerLaneForNewMessage,
		rotateLaneForNewMessage,
		setActiveAnswerBlockDelivery: (delivery) => {
			activeAnswerBlockDelivery = delivery;
		},
		activeAnswerBlockDelivery: () => activeAnswerBlockDelivery,
		setMaterializeBeforeRotation: (materialize) => {
			materializeAnswerLaneBeforeRotation = materialize;
		},
		setProgressLifecycle: (lifecycle) => {
			resetProgress = lifecycle.reset;
			suppressProgress = lifecycle.suppress;
		},
		setReasoningStepCallbacks: (callbacks) => {
			noteReasoningHint = callbacks.noteHint;
			noteReasoningDelivered = callbacks.noteDelivered;
		},
		setRotateWhenQueuedBlocksSettle: (value) => {
			rotateAnswerLaneWhenQueuedBlocksSettle = value;
		},
		splitTextIntoLaneSegments,
		streamDeliveryEnabled,
		streamReasoningInProgressDraft,
		waitForEvents: async () => await eventQueue,
		flushLane: async (lane) => await lane.stream?.flush()
	};
}
//#endregion
//#region extensions/telegram/src/truncate.ts
const TELEGRAM_PROGRESS_MAX_CHARS = 300;
/**
* Clips Telegram progress text to at most {@link TELEGRAM_PROGRESS_MAX_CHARS} UTF-16 code units,
* slicing on a code-point boundary so a surrogate pair straddling the limit is
* dropped whole rather than leaving a lone high surrogate in the payload.
*/
function clipTelegramProgressText(text) {
	if (text.length <= TELEGRAM_PROGRESS_MAX_CHARS) return text;
	return `${sliceUtf16Safe(text, 0, TELEGRAM_PROGRESS_MAX_CHARS - 1).trimEnd()}…`;
}
//#endregion
//#region extensions/telegram/src/progress-draft-preview.ts
function sanitizeProgressMarkdownText(text) {
	return text.replaceAll("`", "'");
}
function formatProgressAsMarkdownCode(text) {
	return `\`${sanitizeProgressMarkdownText(clipTelegramProgressText(text))}\``;
}
function formatTelegramProgressLine(text) {
	const trimmed = text.trim();
	return trimmed.startsWith("_") && trimmed.endsWith("_") ? trimmed : formatProgressAsMarkdownCode(text);
}
function escapeTelegramProgressHtml(text) {
	return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function renderTelegramProgressStringLine(text) {
	const trimmed = text.trim();
	const italic = trimmed.match(/^(\S+ )?_(.*)_$/u);
	return renderTelegramHtmlText(italic ? `${italic[1] ?? ""}_${clipTelegramProgressText(italic[2] ?? "")}_` : clipTelegramProgressText(trimmed));
}
function renderTelegramProgressText(text) {
	return text.split(/\r?\n/u).map(renderTelegramProgressStringLine).filter(Boolean).join("<br>");
}
function renderTelegramProgressLine(line) {
	if (typeof line === "string") return renderTelegramProgressText(line);
	if (!line.icon && (!line.label || line.label === "Commentary")) return renderTelegramProgressText(line.text);
	const label = [line.icon, line.label].filter(Boolean).join(" ");
	const parts = [`<b>${escapeTelegramProgressHtml(label)}</b>`];
	const detail = line.detail && line.detail !== line.label ? line.detail : void 0;
	if (detail) parts.push(`<code>${escapeTelegramProgressHtml(clipTelegramProgressText(detail))}</code>`);
	else {
		const text = line.text.trim();
		if (text && text !== label) parts.push(`<code>${escapeTelegramProgressHtml(clipTelegramProgressText(text))}</code>`);
	}
	if (line.status && line.status !== "completed" && line.status !== line.detail) parts.push(`<i>${escapeTelegramProgressHtml(line.status)}</i>`);
	return parts.join(" ");
}
function joinRichText(parts, separator) {
	if (parts.length === 0) return "";
	if (parts.length === 1) return parts[0] ?? "";
	const result = [];
	for (const [index, part] of parts.entries()) {
		if (index > 0) result.push(separator);
		result.push(part);
	}
	return result;
}
function markdownLineToRichText(text) {
	const trimmed = text.trim();
	const italic = trimmed.match(/^(\S+ )?_(.*)_$/u);
	const clipped = italic ? `${italic[1] ?? ""}_${clipTelegramProgressText(italic[2] ?? "")}_` : clipTelegramProgressText(trimmed);
	const { blocks } = markdownToTelegramRichBlocks(clipped, { skipEntityDetection: true });
	const first = blocks[0];
	if (first?.type === "paragraph") return first.text;
	return clipped;
}
function progressTextToRichText(text) {
	const parts = text.split(/\r?\n/u).map(markdownLineToRichText).filter((part) => part !== "");
	return parts.length ? joinRichText(parts, "\n") : void 0;
}
function progressLineToRichText(line) {
	if (typeof line === "string") return progressTextToRichText(line);
	if (!line.icon && (!line.label || line.label === "Commentary")) return progressTextToRichText(line.text);
	const label = [line.icon, line.label].filter(Boolean).join(" ");
	const parts = [boldRichText(label)];
	const detail = line.detail && line.detail !== line.label ? line.detail : void 0;
	if (detail) parts.push(codeRichText(clipTelegramProgressText(detail)));
	else {
		const text = line.text.trim();
		if (text && text !== label) parts.push(codeRichText(clipTelegramProgressText(text)));
	}
	if (line.status && line.status !== "completed" && line.status !== line.detail) parts.push(italicRichText(line.status));
	return joinRichText(parts, " ");
}
function buildProgressRichBlocks(parts) {
	return [paragraphBlock(joinRichText(parts, "\n"))];
}
function isStatusHeadlineWorkLine(line) {
	if (typeof line === "string") return false;
	return !line.id?.startsWith("reasoning:") && !line.id?.startsWith("commentary:");
}
function renderTelegramProgressDraftPreview(text, lines, richMessages, statusHeadlineActive = false) {
	const trimmed = text.trimEnd();
	if (statusHeadlineActive) {
		const statusLines = trimmed.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
		const workLines = lines.filter(isStatusHeadlineWorkLine);
		const renderedLines = workLines.map(renderTelegramProgressLine).filter(Boolean);
		if (!richMessages) return {
			text: [...statusLines.length > 1 ? [`<b>${escapeTelegramProgressHtml(statusLines[0] ?? "")}</b>`, ...statusLines.slice(1).map(renderTelegramProgressStringLine)] : statusLines.map(renderTelegramProgressStringLine), ...renderedLines].join("<br>"),
			parseMode: "HTML"
		};
		const richStatusParts = statusLines.length > 1 ? [boldRichText(statusLines[0] ?? ""), ...statusLines.slice(1).map(markdownLineToRichText)] : statusLines.map(markdownLineToRichText);
		const richLineParts = workLines.map(progressLineToRichText).filter((part) => part !== void 0);
		const plainLineTexts = workLines.map((line) => line.text).map((line) => line.trim()).filter(Boolean);
		const plainText = [...statusLines, ...plainLineTexts].join("\n");
		return {
			text: plainText,
			richMessage: buildTelegramRichBlocksPlan(buildProgressRichBlocks([...richStatusParts, ...richLineParts]), {
				skipEntityDetection: true,
				plainText
			}).richMessage
		};
	}
	const renderedLines = lines.map(renderTelegramProgressLine).filter(Boolean);
	const textLines = trimmed.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
	const heading = textLines.length > renderedLines.length ? textLines[0] : void 0;
	if (!richMessages) return {
		text: (heading ? [`<b>${escapeTelegramProgressHtml(heading)}</b>`, ...renderedLines] : renderedLines).join("<br>"),
		parseMode: "HTML"
	};
	const richLineParts = lines.map(progressLineToRichText).filter((part) => part !== void 0);
	return {
		text: trimmed,
		richMessage: buildTelegramRichBlocksPlan(buildProgressRichBlocks(heading ? [boldRichText(heading), ...richLineParts] : richLineParts), {
			skipEntityDetection: true,
			plainText: trimmed
		}).richMessage
	};
}
//#endregion
//#region extensions/telegram/src/progress-summary.ts
function createTelegramProgressSummaryTracker() {
	let reasoningSteps = 0;
	let commentaryNotes = 0;
	let toolCalls = 0;
	let reasoningBurstOpen = false;
	let commentaryBurstOpen = false;
	let openCommentaryItemId;
	let openCommentaryText = "";
	const closeReasoningBurst = () => {
		if (reasoningBurstOpen) {
			reasoningBurstOpen = false;
			reasoningSteps += 1;
		}
	};
	const closeCommentaryBurst = () => {
		if (commentaryBurstOpen) {
			commentaryBurstOpen = false;
			openCommentaryItemId = void 0;
			openCommentaryText = "";
			commentaryNotes += 1;
		}
	};
	return {
		noteReasoningActivity() {
			reasoningBurstOpen = true;
		},
		closeReasoningBurst,
		noteToolCall() {
			closeReasoningBurst();
			closeCommentaryBurst();
			toolCalls += 1;
		},
		noteCommentary(itemId, text) {
			const trimmed = text?.trim();
			if (!trimmed) return;
			const id = itemId?.trim() || void 0;
			if (commentaryBurstOpen) {
				if (openCommentaryItemId ? id === openCommentaryItemId : !id && (trimmed === openCommentaryText || trimmed.startsWith(openCommentaryText) || openCommentaryText.startsWith(trimmed))) {
					openCommentaryText = trimmed;
					return;
				}
				closeCommentaryBurst();
			}
			commentaryBurstOpen = true;
			openCommentaryItemId = id;
			openCommentaryText = trimmed;
		},
		closeCommentaryBurst,
		counts() {
			closeReasoningBurst();
			closeCommentaryBurst();
			return {
				reasoningSteps,
				commentaryNotes,
				toolCalls
			};
		},
		hasActivity() {
			return reasoningBurstOpen || commentaryBurstOpen || reasoningSteps > 0 || commentaryNotes > 0 || toolCalls > 0;
		}
	};
}
function formatTelegramProgressSummaryLine(counters, elapsedMs) {
	const { reasoningSteps, commentaryNotes, toolCalls } = counters;
	if (reasoningSteps <= 0 && commentaryNotes <= 0 && toolCalls <= 0) return;
	const seconds = Math.max(1, Math.round(elapsedMs / 1e3));
	return [
		...reasoningSteps > 0 ? [`🧠 ${reasoningSteps} thought${reasoningSteps === 1 ? "" : "s"}`] : [],
		...commentaryNotes > 0 ? [`💬 ${commentaryNotes} note${commentaryNotes === 1 ? "" : "s"}`] : [],
		...toolCalls > 0 ? [`🛠️ ${toolCalls} tool call${toolCalls === 1 ? "" : "s"}`] : [],
		`⏱️ ${seconds}s`
	].join(" · ");
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-progress.ts
function buildTelegramThinkingProgressLine(progressTokens) {
	const label = `Thinking… (~${Math.round(progressTokens)} tokens)`;
	return {
		id: "reasoning:token-progress",
		kind: "item",
		icon: "🧠",
		label,
		text: `🧠 ${label}`,
		prefix: false
	};
}
function buildTelegramTextToolProgressLine(text) {
	return {
		kind: "item",
		label: "",
		text,
		prefix: false
	};
}
function createTelegramProgressController(params) {
	const { answerLane } = params.draft;
	const summaryStartedAt = Date.now();
	const summary = createTelegramProgressSummaryTracker();
	let summaryDelivered = false;
	let draftEverRendered = false;
	let finalAnswerDeliveryStarted = false;
	let finalAnswerDelivered = false;
	let sawProgressFinal = false;
	let verboseProgressActive = () => false;
	const compositor = createChannelProgressDraftCompositor({
		entry: params.telegramCfg,
		mode: params.streamMode,
		active: Boolean(answerLane.stream),
		seed: `${params.accountId}:${params.chatId}:${params.threadId ?? ""}`,
		formatLine: (text) => compositor.hasStatusHeadline || compositor.hasPlanProgress ? text : formatTelegramProgressLine(text),
		reasoningGate: params.streamReasoningInProgressDraft,
		reasoningLinePrefix: "🧠 ",
		commentaryLinePrefix: "💬 ",
		commentaryItalics: false,
		updateOnLineChange: true,
		update: async (streamText, options) => {
			draftEverRendered = true;
			await params.draft.prepareAnswerLaneForToolProgress();
			answerLane.lastPartialText = streamText;
			answerLane.hasStreamedMessage = true;
			answerLane.finalized = false;
			answerLane.stream?.updatePreview(renderTelegramProgressDraftPreview(streamText, options?.lines ?? [], params.telegramCfg.richMessages === true, compositor.hasStatusHeadline || compositor.hasPlanProgress));
			if (options?.flush) await answerLane.stream?.flush();
		}
	});
	params.draft.setProgressLifecycle({
		reset: () => compositor.reset(),
		suppress: () => compositor.suppress()
	});
	const canPushToolProgress = () => Boolean(answerLane.stream && !verboseProgressActive() && !answerLane.finalized && !finalAnswerDeliveryStarted && !finalAnswerDelivered);
	const pushToolProgress = async (line, options) => {
		if (!canPushToolProgress()) return false;
		return await compositor.pushToolProgress(typeof line === "string" ? buildTelegramTextToolProgressLine(line) : line, options);
	};
	const pushReasoningProgress = async (payload) => {
		if (params.streamReasoningInProgressDraft && payload.text) summary.noteReasoningActivity();
		return await compositor.pushReasoningProgress(payload.text, { snapshot: payload.isReasoningSnapshot === true });
	};
	const pushThinkingTokenProgress = async (progressTokens) => {
		const rendered = await pushToolProgress(buildTelegramThinkingProgressLine(progressTokens), { startImmediately: true });
		if (rendered) summary.noteReasoningActivity();
		return rendered;
	};
	const markFinalStarted = () => {
		finalAnswerDeliveryStarted = true;
		compositor.markFinalReplyStarted();
	};
	const markFinalDelivered = () => {
		finalAnswerDelivered = true;
		sawProgressFinal = true;
		compositor.markFinalReplyDelivered();
	};
	const resolveCollapseSummaryLine = () => {
		if (summaryDelivered) return;
		summaryDelivered = true;
		if (!draftEverRendered) return;
		return formatTelegramProgressSummaryLine(summary.counts(), Date.now() - summaryStartedAt) || void 0;
	};
	const applyCollapseSummary = async (line, postCosmeticSummary) => {
		if (typeof await answerLane.stream?.finalizeToPreview(params.draft.renderStreamText(line)) !== "number") await postCosmeticSummary(line);
	};
	const resetAnswerLaneAfterCollapse = () => {
		if (params.draft.isAnswerToolProgressOnly()) {
			params.draft.resetAnswerToolProgressDraft();
			compositor.suppress();
			params.draft.setRotateWhenQueuedBlocksSettle(false);
		}
		answerLane.stream?.forceNewMessage();
		params.draft.resetLaneState(answerLane);
	};
	const teardownWindow = async () => {
		if (params.draft.isAnswerToolProgressOnly()) {
			await params.draft.rotateAnswerLaneAfterToolProgress();
			return;
		}
		await answerLane.stream?.clear();
		params.draft.resetLaneState(answerLane);
	};
	const handleToolStart = async (payload) => {
		const toolName = payload.name?.trim();
		if (payload.phase === "start") if (canPushToolProgress() && resolveChannelStreamingPreviewToolProgress(params.telegramCfg) && isChannelProgressDraftWorkToolName(toolName)) summary.noteToolCall();
		else {
			summary.closeReasoningBurst();
			summary.closeCommentaryBurst();
		}
		const progressPromise = pushToolProgress(buildChannelProgressDraftLineForEntry(params.telegramCfg, {
			event: "tool",
			itemId: payload.itemId,
			toolCallId: payload.toolCallId,
			name: toolName,
			phase: payload.phase,
			args: payload.args
		}, payload.detailMode ? { detailMode: payload.detailMode } : void 0), {
			toolName,
			startImmediately: true
		});
		if (params.statusReactionController && toolName) await params.statusReactionController.setTool(toolName);
		await progressPromise;
	};
	const handleItemEvent = async (payload) => {
		if (payload.kind === "preamble") {
			if (verboseProgressActive()) return;
			if (params.streamMode === "progress") await compositor.pushPreambleHeadline(payload.progressText, { itemId: payload.itemId });
			if (params.streamMode === "progress" && compositor.commentaryProgressEnabled) {
				if (await compositor.pushCommentaryProgress(payload.progressText, { itemId: payload.itemId })) summary.noteCommentary(payload.itemId, payload.progressText);
			}
			return;
		}
		await pushToolProgress(buildChannelProgressDraftLineForEntry(params.telegramCfg, {
			event: "item",
			itemId: payload.itemId,
			toolCallId: payload.toolCallId,
			itemKind: payload.kind,
			title: payload.title,
			name: payload.name,
			phase: payload.phase,
			status: payload.status,
			summary: payload.summary,
			progressText: payload.progressText,
			meta: payload.meta
		}));
	};
	const handlePlanUpdate = async (payload) => {
		if (payload.phase === "update" && canPushToolProgress()) await compositor.pushPlanProgress(payload.steps, { explanation: payload.explanation });
	};
	const handleApprovalEvent = async (payload) => {
		if (payload.phase === "requested") await pushToolProgress(buildChannelProgressDraftLine({
			event: "approval",
			phase: payload.phase,
			title: payload.title,
			command: payload.command,
			reason: payload.reason,
			message: payload.message
		}));
	};
	const handleCommandOutput = async (payload) => {
		if (payload.phase === "end") await pushToolProgress(buildChannelProgressDraftLineForEntry(params.telegramCfg, {
			event: "command-output",
			itemId: payload.itemId,
			toolCallId: payload.toolCallId,
			phase: payload.phase,
			title: payload.title,
			name: payload.name,
			status: payload.status,
			exitCode: payload.exitCode
		}));
	};
	const handlePatchSummary = async (payload) => {
		if (payload.phase === "end") await pushToolProgress(buildChannelProgressDraftLine({
			event: "patch",
			itemId: payload.itemId,
			toolCallId: payload.toolCallId,
			phase: payload.phase,
			title: payload.title,
			name: payload.name,
			added: payload.added,
			modified: payload.modified,
			deleted: payload.deleted,
			summary: payload.summary
		}));
	};
	return {
		applyCollapseSummary,
		canPushToolProgress,
		cancel: () => compositor.cancel(),
		closeReasoningBurst: () => summary.closeReasoningBurst(),
		commentaryProgressEnabled: compositor.commentaryProgressEnabled,
		finalAnswerDelivered: () => finalAnswerDelivered,
		finalAnswerDeliveryStarted: () => finalAnswerDeliveryStarted,
		handleApprovalEvent,
		handleCommandOutput,
		handleItemEvent,
		handlePatchSummary,
		handlePlanUpdate,
		handleToolStart,
		markFinalDelivered,
		markFinalStarted,
		markSawFinal: () => {
			sawProgressFinal = true;
		},
		progressPreambleEnabled: params.streamMode === "progress" && answerLane.stream ? true : void 0,
		pushReasoningProgress,
		pushThinkingTokenProgress,
		pushToolProgress,
		reset: () => compositor.reset(),
		resetAnswerLaneAfterCollapse,
		resolveCollapseSummaryLine,
		sawProgressFinal: () => sawProgressFinal,
		setFinalAnswerDelivered: (value) => {
			finalAnswerDelivered = value;
		},
		setSummaryDelivered: () => {
			summaryDelivered = true;
		},
		setVerboseProgressActive: (isActive) => {
			verboseProgressActive = isActive;
		},
		suppress: () => compositor.suppress(),
		teardownWindow,
		verboseProgressActive: () => verboseProgressActive()
	};
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch.media-dedup.ts
function deduplicateBlockSentMedia(payload, sentBlockMediaUrls) {
	if (!payload.mediaUrls?.length || sentBlockMediaUrls.size === 0) return payload;
	const remainingMedia = payload.mediaUrls.filter((url) => !sentBlockMediaUrls.has(url));
	if (remainingMedia.length === payload.mediaUrls.length) return payload;
	if (remainingMedia.length === 0 && !payload.text) return;
	return {
		...payload,
		mediaUrls: remainingMedia,
		mediaUrl: remainingMedia.length === 0 ? void 0 : payload.mediaUrl
	};
}
//#endregion
//#region extensions/telegram/src/error-policy.ts
const errorCooldownStore = /* @__PURE__ */ new Map();
const DEFAULT_ERROR_COOLDOWN_MS = 144e5;
function pruneExpiredCooldowns(messageStore, now) {
	for (const [message, expiresAt] of messageStore) if (!isFutureDateTimestampMs(expiresAt, { nowMs: now })) messageStore.delete(message);
}
function resolveTelegramErrorPolicy(params) {
	const configs = [
		params.accountConfig,
		params.groupConfig,
		params.topicConfig
	];
	let policy = "always";
	for (const config of configs) if (config?.errorPolicy) policy = config.errorPolicy;
	return {
		policy,
		cooldownMs: DEFAULT_ERROR_COOLDOWN_MS
	};
}
function buildTelegramErrorScopeKey(params) {
	const threadId = params.threadId == null ? "main" : String(params.threadId);
	return `${params.accountId}:${String(params.chatId)}:${threadId}`;
}
function shouldSuppressTelegramError(params) {
	const { scopeKey, cooldownMs, errorMessage } = params;
	const now = asDateTimestampMs(Date.now());
	const messageKey = errorMessage ?? "";
	const scopeStore = errorCooldownStore.get(scopeKey);
	if (now === void 0) {
		errorCooldownStore.delete(scopeKey);
		return false;
	}
	if (scopeStore) {
		pruneExpiredCooldowns(scopeStore, now);
		if (scopeStore.size === 0) errorCooldownStore.delete(scopeKey);
	}
	if (errorCooldownStore.size > 100) for (const [scope, messageStore] of errorCooldownStore) {
		pruneExpiredCooldowns(messageStore, now);
		if (messageStore.size === 0) errorCooldownStore.delete(scope);
	}
	const expiresAt = scopeStore?.get(messageKey);
	if (isFutureDateTimestampMs(expiresAt, { nowMs: now })) return true;
	const nextExpiresAt = resolveExpiresAtMsFromDurationMs(cooldownMs, { nowMs: now });
	if (nextExpiresAt === void 0) {
		scopeStore?.delete(messageKey);
		return false;
	}
	const nextScopeStore = scopeStore ?? /* @__PURE__ */ new Map();
	nextScopeStore.set(messageKey, nextExpiresAt);
	errorCooldownStore.set(scopeKey, nextScopeStore);
	return false;
}
function isSilentErrorPolicy(policy) {
	return policy === "silent";
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-reply.ts
function resolvePayloadTelegramInlineButtons(payload) {
	const telegramData = payload.channelData?.telegram;
	return resolveTelegramInlineButtons({
		buttons: telegramData?.buttons,
		presentation: normalizeMessagePresentation(payload.presentation),
		interactive: payload.interactive
	});
}
function hasExecApprovalPayload(payload) {
	return payload.channelData?.execApproval !== void 0;
}
function createTelegramReplyDelivery(params) {
	const reasoningStepState = createTelegramReasoningStepState();
	const sentBlockMediaUrls = /* @__PURE__ */ new Set();
	params.draft.setReasoningStepCallbacks({
		noteHint: () => reasoningStepState.noteReasoningHint(),
		noteDelivered: () => reasoningStepState.noteReasoningDelivered()
	});
	const flushBufferedFinalAnswer = async () => {
		const buffered = reasoningStepState.takeBufferedFinalAnswer(params.fence.generation());
		if (!buffered) return;
		await params.delivery.deliverFinalAnswerText(buffered.payload, buffered.text, resolvePayloadTelegramInlineButtons(buffered.payload));
		reasoningStepState.resetForNextStep();
	};
	const trackBlockMedia = (delivered, kind, payload) => {
		if (delivered && kind === "block" && payload.mediaUrls?.length) for (const url of payload.mediaUrls) sentBlockMediaUrls.add(url);
	};
	const deliver = async (payload, info) => {
		if (params.fence.isSuperseded()) return;
		const normalizedPayload = params.delivery.normalizeDeliveryPayload(payload);
		if (!normalizedPayload) return;
		const deduped = info.kind === "final" ? deduplicateBlockSentMedia(normalizedPayload, sentBlockMediaUrls) : normalizedPayload;
		if (!deduped) return;
		const effectivePayload = deduped;
		if (shouldSuppressLocalTelegramExecApprovalPrompt({
			cfg: params.cfg,
			accountId: params.context.route.accountId,
			payload: effectivePayload
		})) {
			params.state.queuedFinal = true;
			return;
		}
		const telegramButtons = resolvePayloadTelegramInlineButtons(effectivePayload);
		const lanePayload = info.kind === "block" && typeof payload.text === "string" && typeof effectivePayload.text === "string" && payload.text !== effectivePayload.text && payload.text.trimEnd() === effectivePayload.text && !effectivePayload.mediaUrl && !effectivePayload.mediaUrls?.length ? {
			...effectivePayload,
			text: payload.text
		} : effectivePayload;
		const split = params.draft.splitTextIntoLaneSegments({ text: lanePayload.text }, payload.isReasoning);
		const segments = split.segments;
		const reply = resolveSendableOutboundReplyParts(effectivePayload);
		if (info.kind === "final" && (reply.text.length > 0 || reply.hasMedia)) params.progress.markFinalStarted();
		if (info.kind === "final") await params.draft.enqueueEvent(async () => {});
		const isToolPayloadAfterFinal = info.kind === "tool" && (params.progress.finalAnswerDeliveryStarted() || params.progress.finalAnswerDelivered());
		const isNonTerminalWarningAfterDeliveredFinal = isReplyPayloadNonTerminalToolErrorWarning(payload) && params.progress.finalAnswerDelivered();
		if ((isToolPayloadAfterFinal || isNonTerminalWarningAfterDeliveredFinal) && !reply.hasMedia && !hasExecApprovalPayload(effectivePayload)) return;
		if (payload.isError === true) params.state.hadErrorReplyFailureOrSkip = true;
		let blockDelivered = false;
		const hasAnswerSegment = segments.some((segment) => segment.lane === "answer");
		if (info.kind === "block" && !hasAnswerSegment) params.draft.dropQueuedAnswerBlockRotation(effectivePayload, info.assistantMessageIndex);
		for (const segment of segments) {
			if (segment.lane === "answer" && info.kind === "final" && reasoningStepState.shouldBufferFinalAnswer()) {
				reasoningStepState.bufferFinalAnswer({
					payload: effectivePayload,
					text: segment.update.text,
					bufferedGeneration: params.fence.generation()
				});
				continue;
			}
			if (segment.lane === "reasoning") reasoningStepState.noteReasoningHint();
			if (segment.lane === "answer" && info.kind === "tool") {
				if (params.progress.verboseProgressActive()) {
					if (await params.delivery.sendPayload(params.delivery.applyTextToPayload(effectivePayload, segment.update.text))) blockDelivered = true;
					continue;
				}
				const canRepresentAsTransientProgress = !reply.hasMedia && telegramButtons === void 0 && !hasExecApprovalPayload(effectivePayload);
				const isFastModeProgressPayload = isFastModeAutoProgressPayload(effectivePayload);
				if (params.streamMode === "progress") {
					if (canRepresentAsTransientProgress && params.draft.answerLane.stream && !isFastModeProgressPayload) continue;
					if ((canRepresentAsTransientProgress || isFastModeProgressPayload) && await params.progress.pushToolProgress(segment.update.text, { startImmediately: true })) {
						blockDelivered = true;
						continue;
					}
				}
				await params.draft.prepareAnswerLaneForToolProgress();
			}
			const ownedByQueuedRotation = params.draft.isQueuedAnswerBlock(lanePayload, info.assistantMessageIndex);
			const skipTextOnlyBlock = params.streamMode === "partial" && info.kind === "block" && segment.lane === "answer" && !reply.hasMedia && !hasExecApprovalPayload(effectivePayload) && telegramButtons === void 0 && params.draft.answerLane.hasStreamedMessage && !params.draft.isAnswerToolProgressOnly() && !ownedByQueuedRotation && segment.update.text.trimEnd() === params.draft.answerLane.lastPartialText.trimEnd();
			const suppressProgressAnswerBlock = params.streamMode === "progress" && info.kind === "block" && segment.lane === "answer" && !reply.hasMedia && !hasExecApprovalPayload(effectivePayload) && telegramButtons === void 0;
			if (skipTextOnlyBlock || suppressProgressAnswerBlock) {
				params.draft.setActiveAnswerBlockDelivery({
					payload: effectivePayload,
					text: segment.update.text,
					buttons: telegramButtons
				});
				params.draft.resetAnswerToolProgressDraft();
				params.progress.reset();
				blockDelivered = true;
				continue;
			}
			if (segment.lane === "answer" && info.kind === "block") {
				const prepared = await params.draft.prepareAnswerLaneForText();
				const shouldRotate = params.draft.takeQueuedAnswerBlockRotation(lanePayload, info.assistantMessageIndex);
				if (params.streamMode !== "progress" && shouldRotate && !prepared) {
					await params.draft.rotateAnswerLaneForNewMessage();
					params.draft.setRotateWhenQueuedBlocksSettle(false);
				}
				params.draft.resetAnswerToolProgressDraft();
				params.progress.reset();
			}
			const result = segment.lane === "answer" && info.kind === "final" ? await params.delivery.deliverFinalAnswerText(effectivePayload, segment.update.text, telegramButtons) : await params.delivery.deliverLaneText({
				laneName: segment.lane,
				text: segment.update.text,
				payload: lanePayload,
				infoKind: info.kind,
				buttons: telegramButtons
			});
			if (segment.lane === "answer" && info.kind !== "final" && result.kind === "preview-finalized") await params.delivery.emitPreviewFinalizedHook(result);
			if (segment.lane === "answer" && info.kind === "block" && result.kind === "preview-updated") params.draft.setActiveAnswerBlockDelivery({
				payload: lanePayload,
				text: segment.update.text,
				buttons: telegramButtons
			});
			blockDelivered ||= result.kind !== "skipped";
			if (segment.lane === "reasoning") {
				if (result.kind !== "skipped") {
					reasoningStepState.noteReasoningDelivered();
					await flushBufferedFinalAnswer();
				}
			} else if (info.kind === "final") reasoningStepState.resetForNextStep();
		}
		if (segments.length > 0) {
			trackBlockMedia(blockDelivered, info.kind, effectivePayload);
			return;
		}
		if (split.suppressedReasoningOnly) {
			let delivered = false;
			if (reply.hasMedia) {
				if (info.kind === "final") {
					await params.draft.rotateAnswerLaneAfterToolProgress();
					await params.draft.answerLane.stream?.stop();
					await params.draft.reasoningLane.stream?.stop();
					reasoningStepState.resetForNextStep();
				}
				const payloadWithoutReasoning = typeof effectivePayload.text === "string" ? {
					...effectivePayload,
					text: ""
				} : effectivePayload;
				delivered = await params.delivery.sendPayload(payloadWithoutReasoning, { durable: info.kind === "final" });
			}
			if (info.kind === "final" && delivered) params.progress.markFinalDelivered();
			if (info.kind === "final") await flushBufferedFinalAnswer();
			trackBlockMedia(delivered, info.kind, effectivePayload);
			return;
		}
		if (info.kind === "final") {
			await params.draft.rotateAnswerLaneAfterToolProgress();
			await params.draft.answerLane.stream?.stop();
			await params.draft.reasoningLane.stream?.stop();
			reasoningStepState.resetForNextStep();
		}
		if (!reply.hasMedia && reply.text.length === 0) {
			if (info.kind === "final") await flushBufferedFinalAnswer();
			return;
		}
		const delivered = await params.delivery.sendPayload(effectivePayload, { durable: info.kind === "final" });
		if (info.kind === "final" && delivered) params.progress.markFinalDelivered();
		if (info.kind === "final") await flushBufferedFinalAnswer();
		trackBlockMedia(delivered, info.kind, effectivePayload);
	};
	const onSkip = (payload, info) => {
		if (info.kind === "block") params.draft.enqueueEvent(async () => {
			params.draft.dropQueuedAnswerBlockRotation(payload, info.assistantMessageIndex);
		});
		if (payload.isError === true) params.state.hadErrorReplyFailureOrSkip = true;
		if (info.reason !== "silent") params.delivery.markNonSilentSkip();
	};
	const onError = (err, info) => {
		const errorPolicy = resolveTelegramErrorPolicy({
			accountConfig: params.telegramCfg,
			groupConfig: params.context.groupConfig,
			topicConfig: params.context.topicConfig
		});
		if (isSilentErrorPolicy(errorPolicy.policy)) return;
		if (errorPolicy.policy === "once" && shouldSuppressTelegramError({
			scopeKey: buildTelegramErrorScopeKey({
				accountId: params.context.route.accountId,
				chatId: params.context.chatId,
				threadId: params.context.threadSpec.id
			}),
			cooldownMs: errorPolicy.cooldownMs,
			errorMessage: String(err)
		})) return;
		params.delivery.markNonSilentFailure();
		params.runtime.error?.(danger(`telegram ${info.kind} reply failed: ${String(err)}`));
	};
	return {
		deliver,
		onBeforeDeliverCancelled: (payload, info) => {
			if (info.kind === "block") return params.draft.enqueueEvent(async () => {
				params.draft.dropQueuedAnswerBlockRotation(payload, info.assistantMessageIndex);
			});
		},
		onError,
		onSkip,
		reasoningStepState
	};
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-status.ts
function createTelegramDispatchStatus(params) {
	const { context } = params;
	const controller = context.ctxPayload.InboundEventKind === "room_event" ? null : context.statusReactionController;
	const timing = DEFAULT_TIMING;
	const clear = async () => {
		if (!context.msg.message_id || !context.reactionApi) return;
		await context.reactionApi(context.chatId, context.msg.message_id, []);
	};
	const finalize = async (final) => {
		if (!controller) return;
		if (final.outcome === "done") {
			await controller.setDone();
			if (context.removeAckAfterReply) {
				await sleepWithAbort(timing.doneHoldMs);
				await clear();
			} else await controller.restoreInitial();
			return;
		}
		await controller.setError();
		if (final.hasFinalResponse) {
			if (context.removeAckAfterReply) {
				await sleepWithAbort(timing.errorHoldMs);
				await clear();
			} else await controller.restoreInitial();
			return;
		}
		if (context.removeAckAfterReply) await sleepWithAbort(timing.errorHoldMs);
		await controller.restoreInitial();
	};
	const removeAck = () => {
		removeAckReactionAfterReply({
			removeAfterReply: context.removeAckAfterReply,
			ackReactionPromise: context.ackReactionPromise,
			ackReactionValue: context.ackReactionPromise ? "ack" : null,
			remove: () => (context.reactionApi?.(context.chatId, context.msg.message_id ?? 0, []) ?? Promise.resolve()).then(() => {}),
			onError: (err) => {
				if (!context.msg.message_id) return;
				logAckFailure({
					log: logVerbose,
					channel: "telegram",
					target: `${context.chatId}/${context.msg.message_id}`,
					error: err
				});
			}
		});
	};
	const finalizeInBackground = (final, label) => {
		finalize(final).catch((err) => {
			logVerbose(`telegram: status reaction ${label} failed: ${String(err)}`);
		});
	};
	return {
		controller,
		finalizeInBackground,
		removeAck
	};
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-turn.ts
const TELEGRAM_MAX_CONSECUTIVE_TYPING_FAILURES = 5;
async function runTelegramDispatchTurn(params) {
	const { context } = params;
	const isRoomEvent = context.ctxPayload.InboundEventKind === "room_event";
	const beginDeliveryCorrelation = () => beginTelegramInboundEventDeliveryCorrelation(context.ctxPayload.SessionKey, {
		outboundTo: context.historyKey || String(context.chatId),
		outboundAccountId: context.route.accountId,
		markInboundEventDelivered: params.delivery.markDelivered
	}, { inboundEventKind: context.ctxPayload.InboundEventKind });
	const endDeliveryCorrelation = beginDeliveryCorrelation();
	let splitReasoningOnNextStream = false;
	try {
		const { onModelSelected, ...replyPipeline } = (params.telegramDeps.createChannelMessageReplyPipeline ?? createChannelReplyPipeline)({
			cfg: params.cfg,
			agentId: context.route.agentId,
			channel: "telegram",
			accountId: context.route.accountId,
			typing: {
				start: context.sendTyping,
				maxConsecutiveFailures: TELEGRAM_MAX_CONSECUTIVE_TYPING_FAILURES,
				onStartError: (err) => {
					logTypingFailure({
						log: logVerbose,
						channel: "telegram",
						target: String(context.chatId),
						error: err
					});
				}
			}
		});
		const handleDeliveryError = async (err, info) => {
			await Promise.resolve(params.reply.onError(err, info)).catch((callbackError) => {
				logVerbose(`telegram reply error callback failed: ${String(callbackError)}`);
			});
		};
		const turnResult = await runChannelInboundEvent({
			channel: "telegram",
			accountId: context.route.accountId,
			raw: context,
			adapter: {
				ingest: () => ({
					id: context.ctxPayload.MessageSid ?? `${context.chatId}:${Date.now()}`,
					timestamp: typeof context.ctxPayload.Timestamp === "number" ? context.ctxPayload.Timestamp : void 0,
					rawText: context.ctxPayload.RawBody ?? "",
					textForAgent: context.ctxPayload.BodyForAgent,
					textForCommands: context.ctxPayload.CommandBody,
					raw: context
				}),
				resolveTurn: () => ({
					cfg: params.cfg,
					channel: "telegram",
					accountId: context.route.accountId,
					route: {
						agentId: context.route.agentId,
						sessionKey: context.route.sessionKey
					},
					ctxPayload: context.ctxPayload,
					record: context.turn.record,
					delivery: {
						deliver: async (payload, info) => await params.reply.deliver(payload, info),
						onError: handleDeliveryError
					},
					dispatcherOptions: {
						...replyPipeline,
						beforeDeliver: async (payload) => payload,
						onBeforeDeliverCancelled: params.reply.onBeforeDeliverCancelled,
						onSkip: params.reply.onSkip
					},
					replyOptions: {
						skillFilter: context.skillFilter,
						disableBlockStreaming: params.draft.disableBlockStreaming,
						abortSignal: params.turnAdoptionLifecycle?.abortSignal,
						turnAdoptionLifecycle: params.turnAdoptionLifecycle ? {
							admission: params.turnAdoptionLifecycle.admission ?? "exclusive",
							onAdopted: params.turnAdoptionLifecycle.onAdopted,
							onDeferred: params.turnAdoptionLifecycle.onDeferred,
							onAbandoned: params.turnAdoptionLifecycle.onAbandoned,
							abortSignal: params.turnAdoptionLifecycle.abortSignal
						} : void 0,
						sourceReplyDeliveryMode: isRoomEvent ? "message_tool_only" : void 0,
						queuedDeliveryCorrelations: isRoomEvent ? [{ begin: beginDeliveryCorrelation }] : void 0,
						suppressTyping: isRoomEvent,
						onPartialReply: params.draft.answerLane.stream || params.draft.reasoningLane.stream ? (payload) => params.draft.enqueueEvent(async () => {
							await params.draft.ingestDraftLaneSegments(payload);
						}) : void 0,
						onBlockReplyQueued: params.draft.answerLane.stream ? (payload, blockContext) => params.draft.enqueueEvent(async () => {
							await params.draft.prepareQueuedAnswerBlock(payload, blockContext);
						}) : void 0,
						onReasoningStream: params.draft.reasoningLane.stream ? (payload) => params.draft.enqueueEvent(async () => {
							if (splitReasoningOnNextStream) {
								params.draft.repositionLaneForNewMessage(params.draft.reasoningLane);
								splitReasoningOnNextStream = false;
							}
							await params.draft.ingestDraftLaneSegments(payload, true);
						}) : params.draft.streamReasoningInProgressDraft ? (payload) => params.draft.enqueueEvent(async () => {
							await params.progress.pushReasoningProgress(payload);
						}) : void 0,
						onReasoningProgress: params.draft.answerLane.stream ? (payload) => params.draft.enqueueEvent(async () => {
							await params.progress.pushThinkingTokenProgress(payload.progressTokens);
						}) : void 0,
						onAssistantMessageStart: params.draft.answerLane.stream ? () => params.draft.enqueueEvent(async () => {
							params.reply.reasoningStepState.resetForNextStep();
							params.progress.setFinalAnswerDelivered(false);
							if (params.streamMode !== "progress") params.progress.reset();
							if (params.draft.answerLane.finalized) {
								await params.draft.rotateLaneForNewMessage(params.draft.answerLane);
								params.draft.setRotateWhenQueuedBlocksSettle(false);
							} else if (params.draft.answerLane.hasStreamedMessage && !params.draft.isAnswerToolProgressOnly()) params.draft.setRotateWhenQueuedBlocksSettle(true);
						}) : void 0,
						onReasoningEnd: params.draft.reasoningLane.stream ? () => params.draft.enqueueEvent(async () => {
							params.progress.closeReasoningBurst();
							splitReasoningOnNextStream = params.draft.reasoningLane.hasStreamedMessage;
							params.progress.reset();
						}) : () => params.progress.closeReasoningBurst(),
						suppressDefaultToolProgressMessages: !params.draft.streamDeliveryEnabled || Boolean(params.draft.answerLane.stream),
						forceToolResultProgress: params.streamMode === "progress" && resolveChannelStreamingPreviewToolProgress(params.telegramCfg),
						allowProgressCallbacksWhenSourceDeliverySuppressed: !isRoomEvent && Boolean(params.draft.answerLane.stream),
						onVerboseProgressVisibility: (isActive) => {
							params.progress.setVerboseProgressActive(isActive);
						},
						commentaryProgressEnabled: params.streamMode === "progress" ? params.progress.commentaryProgressEnabled : void 0,
						progressPreambleEnabled: params.progress.progressPreambleEnabled,
						reasoningPayloadsEnabled: params.draft.durableReasoningPayloadsEnabled,
						onToolStart: params.progress.handleToolStart,
						onItemEvent: params.progress.handleItemEvent,
						onPlanUpdate: params.progress.handlePlanUpdate,
						onApprovalEvent: params.progress.handleApprovalEvent,
						onToolResult: async (payload) => {
							const text = payload.text?.trim();
							if (!text) return;
							if (!await params.progress.pushToolProgress(text, { startImmediately: true }) && isFastModeAutoProgressPayload(payload) && !params.progress.canPushToolProgress()) await params.delivery.sendPayload(payload);
						},
						onCommandOutput: params.progress.handleCommandOutput,
						onPatchSummary: params.progress.handlePatchSummary,
						onCompactionStart: params.statusReactionController ? async () => {
							await params.statusReactionController?.setCompacting();
						} : void 0,
						onCompactionEnd: params.statusReactionController ? async () => {
							params.statusReactionController?.cancelPending();
							await params.statusReactionController?.setThinking();
						} : void 0,
						onModelSelected
					}
				})
			}
		});
		if (!turnResult.dispatched) return false;
		params.state.queuedFinal = turnResult.dispatchResult.queuedFinal;
		if ((turnResult.dispatchResult.counts?.final ?? 0) > 0) params.progress.markSawFinal();
		params.state.suppressSilentReplyFallback = turnResult.dispatchResult.sourceReplyDeliveryMode === "message_tool_only";
		return true;
	} finally {
		endDeliveryCorrelation();
	}
}
//#endregion
//#region extensions/telegram/src/bot/native-quote.ts
const TELEGRAM_NATIVE_QUOTE_MAX_LENGTH = 1024;
function truncateUtf16Safe(value, maxLength) {
	if (value.length <= maxLength) return value;
	let end = Math.max(0, Math.trunc(maxLength));
	const lastCodeUnit = value.charCodeAt(end - 1);
	if (lastCodeUnit >= 55296 && lastCodeUnit <= 56319) end -= 1;
	return value.slice(0, end);
}
function sliceTelegramEntitiesForQuote(entities, quoteLength) {
	if (!entities?.length || quoteLength <= 0) return;
	const sliced = [];
	for (const entity of entities) {
		const offset = Number.isFinite(entity.offset) ? Math.trunc(entity.offset) : 0;
		const length = Number.isFinite(entity.length) ? Math.trunc(entity.length) : 0;
		const start = Math.max(0, offset);
		const end = Math.min(quoteLength, offset + length);
		if (end <= start) continue;
		sliced.push({
			...entity,
			offset: start,
			length: end - start
		});
	}
	return sliced.length > 0 ? sliced : void 0;
}
function buildTelegramNativeQuoteCandidate(params) {
	const source = params.text;
	if (!source?.trim()) return;
	const text = truncateUtf16Safe(source, params.maxLength ?? TELEGRAM_NATIVE_QUOTE_MAX_LENGTH);
	if (!text.trim()) return;
	const candidate = {
		text,
		position: 0
	};
	const entities = sliceTelegramEntitiesForQuote(params.entities, text.length);
	if (entities) candidate.entities = entities;
	return candidate;
}
function addTelegramNativeQuoteCandidate(target, messageId, candidate) {
	if (messageId == null || !candidate) return;
	const key = String(messageId).trim();
	if (!key || target[key]) return;
	target[key] = candidate;
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch.ts
const EMPTY_RESPONSE_FALLBACK$1 = "No response generated. Please try again.";
const silentReplyDispatchLogger = createSubsystemLogger("telegram/silent-reply-dispatch");
async function resolveStickerVisionSupport(cfg, agentId) {
	try {
		const catalog = await loadPreparedModelCatalog({
			config: cfg,
			agentId,
			agentDir: resolveAgentDir(cfg, agentId),
			readOnly: true
		});
		const defaultModel = resolveDefaultModelForAgent({
			cfg,
			agentId
		});
		const entry = findModelInCatalog(catalog, defaultModel.provider, defaultModel.model);
		return entry ? modelSupportsVision(entry) : false;
	} catch {
		return false;
	}
}
function includeStickerDescription(params) {
	if (!params.body) return params.formattedDescription;
	if (!params.body.trim()) return params.formattedDescription;
	if (params.body.includes(params.formattedDescription)) return params.body;
	return `${params.formattedDescription}\n${params.body}`;
}
function resolveTelegramQuoteContext(params) {
	const { context, replyToMode } = params;
	const rawReplyQuoteText = context.ctxPayload.ReplyToIsQuote && typeof context.ctxPayload.ReplyToQuoteText === "string" ? context.ctxPayload.ReplyToQuoteText : void 0;
	const replyQuoteText = context.ctxPayload.ReplyToIsQuote ? rawReplyQuoteText?.trim() ? rawReplyQuoteText : context.ctxPayload.ReplyToBody?.trim() || void 0 : void 0;
	const replyQuoteMessageId = replyQuoteText && !context.ctxPayload.ReplyToIsExternal ? resolveTelegramReplyId(context.ctxPayload.ReplyToId) : void 0;
	const replyQuoteTargetsBotMessage = context.msg.reply_to_message?.from?.is_bot === true;
	const replyQuoteByMessageId = {};
	if (replyToMode !== "off") {
		if (replyQuoteText && replyQuoteMessageId != null) addTelegramNativeQuoteCandidate(replyQuoteByMessageId, replyQuoteMessageId, {
			text: replyQuoteText,
			...typeof context.ctxPayload.ReplyToQuotePosition === "number" ? { position: context.ctxPayload.ReplyToQuotePosition } : {},
			...Array.isArray(context.ctxPayload.ReplyToQuoteEntities) ? { entities: context.ctxPayload.ReplyToQuoteEntities } : {}
		});
		addTelegramNativeQuoteCandidate(replyQuoteByMessageId, context.ctxPayload.MessageSid ?? context.msg.message_id, buildTelegramNativeQuoteCandidate(getTelegramTextParts(context.msg)));
		if (!context.ctxPayload.ReplyToIsExternal && typeof context.ctxPayload.ReplyToQuoteSourceText === "string") addTelegramNativeQuoteCandidate(replyQuoteByMessageId, context.ctxPayload.ReplyToId, buildTelegramNativeQuoteCandidate({
			text: context.ctxPayload.ReplyToQuoteSourceText,
			entities: Array.isArray(context.ctxPayload.ReplyToQuoteSourceEntities) ? context.ctxPayload.ReplyToQuoteSourceEntities : void 0
		}));
	}
	return {
		draftReplyToMessageId: replyToMode !== "off" && typeof context.msg.message_id === "number" ? replyQuoteTargetsBotMessage ? context.msg.message_id : replyQuoteMessageId ?? context.msg.message_id : void 0,
		hasTelegramQuoteReply: replyToMode !== "off" && replyQuoteText != null,
		replyQuoteByMessageId,
		replyQuoteEntities: Array.isArray(context.ctxPayload.ReplyToQuoteEntities) ? context.ctxPayload.ReplyToQuoteEntities : void 0,
		replyQuoteMessageId,
		replyQuotePosition: typeof context.ctxPayload.ReplyToQuotePosition === "number" ? context.ctxPayload.ReplyToQuotePosition : void 0,
		replyQuoteText
	};
}
async function prepareTelegramSticker(params) {
	const { context } = params;
	const sticker = context.ctxPayload.Sticker;
	if (!sticker?.fileId || !sticker.fileUniqueId || !context.ctxPayload.MediaPath) return;
	const agentDir = resolveAgentDir(params.cfg, context.route.agentId);
	const stickerSupportsVision = await resolveStickerVisionSupport(params.cfg, context.route.agentId);
	const description = sticker.cachedDescription || await describeStickerImage({
		imagePath: context.ctxPayload.MediaPath,
		cfg: params.cfg,
		agentDir,
		agentId: context.route.agentId
	});
	if (!description) return;
	const stickerContext = [sticker.emoji, sticker.setName ? `from "${sticker.setName}"` : null].filter(Boolean).join(" ");
	const formattedDescription = `[Sticker${stickerContext ? ` ${stickerContext}` : ""}] ${description}`;
	sticker.cachedDescription = description;
	if (!stickerSupportsVision) {
		const isCaptionlessSticker = !context.ctxPayload.RawBody?.trim() && context.ctxPayload.StickerMediaIncluded === true;
		context.ctxPayload.Body = includeStickerDescription({
			body: context.ctxPayload.Body,
			formattedDescription
		});
		context.ctxPayload.BodyForAgent = isCaptionlessSticker && !context.ctxPayload.BodyForAgent?.trim() ? formattedDescription : includeStickerDescription({
			body: context.ctxPayload.BodyForAgent,
			formattedDescription
		});
		context.ctxPayload.SkipStickerMediaUnderstanding = true;
	}
	cacheSticker({
		fileId: sticker.fileId,
		fileUniqueId: sticker.fileUniqueId,
		emoji: sticker.emoji,
		setName: sticker.setName,
		description,
		cachedAt: (/* @__PURE__ */ new Date()).toISOString(),
		receivedFrom: context.ctxPayload.From
	});
	logVerbose(`telegram: cached sticker description for ${sticker.fileUniqueId}`);
}
function scheduleDmTopicLabel(params) {
	const { context } = params;
	if (!(!context.isGroup && context.threadSpec.scope === "dm" && context.threadSpec.id != null) || !params.isFirstTurnInSession) return;
	const userMessage = truncateUtf16Safe$1(context.ctxPayload.RawBody ?? context.ctxPayload.Body ?? "", 500);
	if (!userMessage.trim()) return;
	const autoTopicConfig = resolveAutoTopicLabelConfig(context.groupConfig && "autoTopicLabel" in context.groupConfig ? context.groupConfig.autoTopicLabel : void 0, params.telegramCfg.autoTopicLabel);
	if (!autoTopicConfig) return;
	const topicThreadId = context.threadSpec.id;
	(async () => {
		try {
			const label = await generateTelegramTopicLabel({
				userMessage,
				prompt: autoTopicConfig.prompt,
				cfg: params.cfg,
				agentId: context.route.agentId,
				agentDir: resolveAgentDir(params.cfg, context.route.agentId)
			});
			if (!label) {
				logVerbose("auto-topic-label: LLM returned empty label");
				return;
			}
			logVerbose(`auto-topic-label: generated label (len=${label.length})`);
			await params.bot.api.editForumTopic(context.chatId, topicThreadId, { name: label });
			logVerbose(`auto-topic-label: renamed topic ${context.chatId}/${topicThreadId}`);
		} catch (err) {
			logVerbose(`auto-topic-label: failed: ${String(err)}`);
		}
	})();
}
const dispatchTelegramMessage = async ({ context, bot, cfg, runtime, replyToMode, streamMode, textLimit, telegramCfg, telegramDeps: injectedTelegramDeps, opts, retryDispatchErrors = false, suppressFailureFallback = false, turnAdoptionLifecycle }) => {
	const dispatchStartedAt = Date.now();
	const dispatchContext = resolveDispatchTelegramContext({ context });
	const telegramDeps = injectedTelegramDeps ?? (await import("./bot-deps-D6d-A9VZ.js")).defaultTelegramBotDeps;
	const loadFreshSessionEntry = createFreshTelegramSessionEntryLoader({
		cfg,
		telegramDeps
	});
	const isRoomEvent = dispatchContext.ctxPayload.InboundEventKind === "room_event";
	const status = createTelegramDispatchStatus({
		cfg,
		context: dispatchContext
	});
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "telegram",
		accountId: dispatchContext.route.accountId,
		supportsBlockTables: telegramCfg.richMessages === true
	});
	const resolvedReasoningLevel = resolveTelegramReasoningLevel({
		cfg,
		sessionKey: dispatchContext.ctxPayload.SessionKey,
		agentId: dispatchContext.route.agentId,
		loadFreshSessionEntry
	});
	const forceBlockStreamingForReasoning = resolvedReasoningLevel === "on" && streamMode !== "progress";
	const quote = resolveTelegramQuoteContext({
		context: dispatchContext,
		replyToMode
	});
	const isDispatchSuperseded = () => turnAdoptionLifecycle?.abortSignal?.aborted === true;
	const dispatchGeneration = 0;
	const draft = createTelegramDraftController({
		accountId: dispatchContext.route.accountId,
		bot,
		cfg,
		chatId: dispatchContext.chatId,
		draftReplyToMessageId: quote.draftReplyToMessageId,
		forceBlockStreamingForReasoning,
		hasTelegramQuoteReply: quote.hasTelegramQuoteReply,
		isDispatchSuperseded,
		isRoomEvent,
		replyToMode,
		resolvedReasoningLevel,
		streamMode,
		tableMode,
		telegramCfg,
		telegramDeps,
		textLimit,
		threadSpec: dispatchContext.threadSpec
	});
	const progress = createTelegramProgressController({
		accountId: dispatchContext.route.accountId,
		chatId: dispatchContext.chatId,
		draft,
		statusReactionController: status.controller,
		streamMode,
		streamReasoningInProgressDraft: draft.streamReasoningInProgressDraft,
		telegramCfg,
		threadId: dispatchContext.threadSpec.id
	});
	const delivery = createTelegramDeliveryController({
		bot,
		cfg,
		chunkMode: resolveChunkMode(cfg, "telegram", dispatchContext.route.accountId),
		context: dispatchContext,
		dispatchStartedAt,
		draft,
		draftReplyToMessageId: quote.draftReplyToMessageId,
		isDispatchSuperseded,
		loadFreshSessionEntry,
		mediaLocalRoots: getAgentScopedMediaLocalRoots(cfg, dispatchContext.route.agentId),
		opts,
		progress,
		replyQuoteByMessageId: quote.replyQuoteByMessageId,
		replyQuoteEntities: quote.replyQuoteEntities,
		replyQuoteMessageId: quote.replyQuoteMessageId,
		replyQuotePosition: quote.replyQuotePosition,
		replyQuoteText: quote.replyQuoteText,
		replyToMode,
		runtime,
		streamMode,
		tableMode,
		telegramCfg,
		telegramDeps,
		textLimit,
		threadSpec: dispatchContext.threadSpec
	});
	const state = {
		queuedFinal: false,
		suppressSilentReplyFallback: false,
		hadErrorReplyFailureOrSkip: false
	};
	const reply = createTelegramReplyDelivery({
		cfg,
		context: dispatchContext,
		delivery,
		draft,
		fence: {
			generation: () => dispatchGeneration,
			isSuperseded: isDispatchSuperseded
		},
		progress,
		runtime,
		state,
		streamMode,
		telegramCfg
	});
	let isFirstTurnInSession = false;
	let dispatchWasSuperseded;
	let turnDispatched;
	const isDmTopic = !dispatchContext.isGroup && dispatchContext.threadSpec.scope === "dm" && dispatchContext.threadSpec.id != null;
	try {
		await prepareTelegramSticker({
			cfg,
			context: dispatchContext
		});
		if (isDmTopic) try {
			const sessionKey = dispatchContext.ctxPayload.SessionKey;
			if (sessionKey) isFirstTurnInSession = !loadFreshSessionEntry(dispatchContext.route.agentId, sessionKey).entry?.systemSent;
			else logVerbose("auto-topic-label: SessionKey is absent, skipping first-turn detection");
		} catch (err) {
			logVerbose(`auto-topic-label: session store error: ${String(err)}`);
		}
		loadFreshSessionEntry.clear();
		if (status.controller && !isRoomEvent) status.controller.setThinking();
		try {
			turnDispatched = await runTelegramDispatchTurn({
				cfg,
				context: dispatchContext,
				delivery,
				draft,
				turnAdoptionLifecycle,
				isSuperseded: isDispatchSuperseded,
				progress,
				reply,
				state,
				statusReactionController: status.controller,
				streamMode,
				telegramCfg,
				telegramDeps
			});
		} catch (err) {
			state.dispatchError = err;
			runtime.error?.(danger(`telegram dispatch failed: ${String(err)}`));
		} finally {
			progress.cancel();
			await draft.waitForEvents();
			try {
				await delivery.finalizePendingAnswerBlockDraft(state);
			} catch (err) {
				state.dispatchError ??= err;
				runtime.error?.(danger(`telegram terminal block delivery failed: ${String(err)}`));
			}
			await draft.cleanup(isDispatchSuperseded());
			if (streamMode === "progress" && progress.sawProgressFinal() && !state.dispatchError && !state.hadErrorReplyFailureOrSkip && !isDispatchSuperseded()) await delivery.deliverProgressCollapseSummary();
		}
	} finally {
		dispatchWasSuperseded = isDispatchSuperseded();
	}
	if (turnDispatched === false) return { kind: "completed" };
	if (dispatchWasSuperseded) {
		if (status.controller) status.finalizeInBackground({
			outcome: "done",
			hasFinalResponse: true
		}, "finalize");
		else status.removeAck();
		return { kind: "completed" };
	}
	const deliverySummary = delivery.snapshot();
	let sentFallback = false;
	if (!isRoomEvent && !suppressFailureFallback && !progress.finalAnswerDelivered() && (state.dispatchError || deliverySummary.skippedNonSilent > 0 || deliverySummary.failedNonSilent > 0)) {
		const fallbackText = state.dispatchError ? "Something went wrong while processing your request. Please try again." : EMPTY_RESPONSE_FALLBACK$1;
		sentFallback = (await delivery.deliverFallback([{ text: fallbackText }], telegramCfg.silentErrorReplies === true && (state.dispatchError != null || state.hadErrorReplyFailureOrSkip))).delivered;
	}
	if (!sentFallback && !state.dispatchError && !deliverySummary.delivered && !state.suppressSilentReplyFallback && !state.queuedFinal && dispatchContext.isGroup) {
		const policySessionKey = dispatchContext.ctxPayload.CommandSource === "native" ? dispatchContext.ctxPayload.CommandTargetSessionKey ?? dispatchContext.ctxPayload.SessionKey : dispatchContext.ctxPayload.SessionKey;
		const silentReplyFallback = projectOutboundPayloadPlanForDelivery(createOutboundPayloadPlan([{ text: "NO_REPLY" }], {
			cfg,
			sessionKey: policySessionKey,
			surface: "telegram"
		}));
		if (silentReplyFallback.length > 0) sentFallback = (await delivery.deliverFallback(silentReplyFallback, false)).delivered;
		silentReplyDispatchLogger.debug("telegram turn ended without visible final response", {
			hasSessionKey: Boolean(policySessionKey),
			hasChatId: dispatchContext.chatId != null,
			queuedFinal: state.queuedFinal,
			sentFallback
		});
	}
	const hasFinalResponse = progress.finalAnswerDelivered() || sentFallback || state.suppressSilentReplyFallback || state.queuedFinal;
	const hasVisibleResponse = deliverySummary.delivered || sentFallback || state.suppressSilentReplyFallback || state.queuedFinal;
	const deliveryFailureWithoutFinalResponse = !progress.finalAnswerDelivered() && (deliverySummary.skippedNonSilent > 0 || deliverySummary.failedNonSilent > 0);
	const retryableDispatchFailure = state.dispatchError ?? (deliveryFailureWithoutFinalResponse ? /* @__PURE__ */ new Error(`Telegram reply delivery failed without a final response (failed=${deliverySummary.failedNonSilent}, skipped=${deliverySummary.skippedNonSilent})`) : null);
	if (status.controller && !hasVisibleResponse) status.finalizeInBackground({
		outcome: "error",
		hasFinalResponse: false
	}, "error finalize");
	const shouldReturnRetryableDispatchFailure = retryDispatchErrors && (state.dispatchError != null && !hasFinalResponse || state.dispatchError == null && deliveryFailureWithoutFinalResponse && !hasVisibleResponse);
	if (retryableDispatchFailure && shouldReturnRetryableDispatchFailure) return {
		kind: "failed-retryable",
		error: retryableDispatchFailure
	};
	if (!hasVisibleResponse) return { kind: "completed" };
	scheduleDmTopicLabel({
		bot,
		cfg,
		context: dispatchContext,
		isFirstTurnInSession,
		telegramCfg
	});
	if (status.controller) status.finalizeInBackground({
		outcome: !progress.finalAnswerDelivered() && (state.dispatchError != null || sentFallback) ? "error" : "done",
		hasFinalResponse: true
	}, "finalize");
	else status.removeAck();
	return { kind: "completed" };
};
//#endregion
//#region extensions/telegram/src/bot-processing-outcome.ts
const telegramUpdateProcessingFrames = new AsyncLocalStorage();
const telegramSpooledReplayFrames = new AsyncLocalStorage();
const telegramSpooledReplayUpdates = /* @__PURE__ */ new WeakSet();
var TelegramSpooledReplayProcessingError = class extends Error {
	constructor(cause) {
		super(`telegram spooled update processing failed: ${String(cause)}`);
		this.name = "TelegramSpooledReplayProcessingError";
		this.cause = cause;
	}
};
async function runWithTelegramUpdateProcessingFrame(fn) {
	const frame = {};
	const value = await telegramUpdateProcessingFrames.run(frame, fn);
	return frame.result ? {
		value,
		result: frame.result
	} : { value };
}
function recordTelegramMessageProcessingResult(result) {
	const frame = telegramUpdateProcessingFrames.getStore();
	if (!frame) return;
	if (result.kind === "failed-retryable") {
		frame.result = result;
		return;
	}
	if (!frame.result || frame.result.kind === "skipped") frame.result = result;
}
function createTelegramSpooledReplayParticipant(key) {
	const abortController = new AbortController();
	let settled = false;
	let settlementHeld = false;
	let pendingSettlement;
	let resolveTask = () => {};
	const task = new Promise((resolve) => {
		resolveTask = resolve;
	});
	const settleNow = (result) => {
		if (settled) return;
		settled = true;
		if (result.kind !== "completed") abortController.abort(result.kind === "failed-retryable" ? result.error : result.kind);
		resolveTask(result);
	};
	return {
		key,
		abortSignal: abortController.signal,
		task,
		beginSettlementHold: () => {
			if (settled || settlementHeld) return;
			settlementHeld = true;
			telegramSpooledReplayFrames.getStore()?.lifecycle?.onAdoptionFinalizing?.();
			let released = false;
			return { release: (mode) => {
				if (released) return;
				released = true;
				settlementHeld = false;
				const pending = pendingSettlement;
				pendingSettlement = void 0;
				if (mode === "replay-pending" && pending) settleNow(pending);
			} };
		},
		settle: (result) => {
			if (settled) return;
			if (settlementHeld) {
				pendingSettlement ??= result;
				return;
			}
			settleNow(result);
		}
	};
}
function createTelegramSpooledReplayDeferredParticipant(key) {
	const frame = telegramSpooledReplayFrames.getStore();
	if (!frame) return null;
	const participant = createTelegramSpooledReplayParticipant(key);
	frame.deferredWork = participant;
	return participant;
}
function getTelegramSpooledReplayDeferredParticipant() {
	return telegramSpooledReplayFrames.getStore()?.deferredWork;
}
async function runWithTelegramSpooledReplayUpdate(update, fn, lifecycle) {
	const frame = lifecycle ? { lifecycle } : {};
	telegramSpooledReplayUpdates.add(update);
	try {
		const value = await telegramSpooledReplayFrames.run(frame, fn);
		return frame.deferredWork ? {
			value,
			deferredWork: frame.deferredWork
		} : { value };
	} finally {
		telegramSpooledReplayUpdates.delete(update);
	}
}
/** Drain lifecycle for the active spooled-replay ALS frame, if any. */
function getTelegramSpooledReplayLifecycle() {
	return telegramSpooledReplayFrames.getStore()?.lifecycle;
}
function isTelegramSpooledReplayUpdate(update) {
	return telegramSpooledReplayFrames.getStore() !== void 0 || typeof update === "object" && update !== null && telegramSpooledReplayUpdates.has(update);
}
//#endregion
//#region extensions/telegram/src/sequential-key.ts
const TELEGRAM_READ_ONLY_STATUS_COMMAND_KEYS = /* @__PURE__ */ new Set([
	"commands",
	"context",
	"help",
	"status",
	"tasks",
	"tools",
	"whoami"
]);
const TELEGRAM_ACTIVE_RUN_CONTROL_COMMAND_KEYS = /* @__PURE__ */ new Set(["queue", "steer"]);
function isTelegramReadOnlyControlLaneText(params) {
	const alias = maybeResolveTextAlias(normalizeCommandBody(params.rawText?.trim() ?? "", params.botUsername ? { botUsername: params.botUsername } : void 0));
	if (!alias) return false;
	const command = listChatCommands().find((entry) => entry.textAliases.some((candidate) => candidate.trim().toLowerCase() === alias));
	return command?.category === "status" && TELEGRAM_READ_ONLY_STATUS_COMMAND_KEYS.has(command.key);
}
function isTelegramTargetedStopCommand(rawText, botUsername) {
	const trimmed = rawText?.trim();
	if (!trimmed) return false;
	const match = trimmed.match(/^\/stop@([A-Za-z0-9_]+)(?:$|\s|[.!?…,，。;；:：'"’”)\]}])/iu);
	if (!match) return false;
	const normalizedBotUsername = botUsername?.trim().toLowerCase();
	if (!normalizedBotUsername) return true;
	return match[1]?.toLowerCase() === normalizedBotUsername;
}
function resolveTelegramCommandAliasForControlLane(rawText, botUsername) {
	const trimmed = rawText?.trim();
	if (!trimmed?.startsWith("/")) return;
	const targetedMatch = trimmed.match(/^\/([A-Za-z0-9_-]+)(?:@([A-Za-z0-9_]+))?(?:$|\s|[.!?…,，。;；:：'"’”)\]}])/iu);
	const targetBotUsername = targetedMatch?.[2]?.trim().toLowerCase();
	const normalizedBotUsername = botUsername?.trim().toLowerCase();
	if (targetBotUsername && normalizedBotUsername && targetBotUsername !== normalizedBotUsername) return;
	if (targetBotUsername && !normalizedBotUsername) {
		const commandAlias = `/${targetedMatch?.[1]?.toLowerCase() ?? ""}`;
		return commandAlias === "/" ? void 0 : commandAlias;
	}
	return maybeResolveTextAlias(normalizeCommandBody(trimmed, botUsername ? { botUsername } : void 0)) ?? void 0;
}
function isTelegramActiveRunControlLaneText(params) {
	const alias = resolveTelegramCommandAliasForControlLane(params.rawText, params.botUsername);
	if (!alias) return false;
	const command = listChatCommands().find((entry) => entry.textAliases.some((candidate) => candidate.trim().toLowerCase() === alias));
	return command ? TELEGRAM_ACTIVE_RUN_CONTROL_COMMAND_KEYS.has(command.key) : false;
}
function isTelegramControlLaneText(params) {
	if (isAbortRequestText(params.rawText, params.botUsername ? { botUsername: params.botUsername } : void 0)) return true;
	if (isTelegramTargetedStopCommand(params.rawText, params.botUsername)) return true;
	if (isTelegramActiveRunControlLaneText(params)) return true;
	return isTelegramReadOnlyControlLaneText(params);
}
function getTelegramSequentialKey(ctx) {
	const reaction = ctx.update?.message_reaction;
	if (reaction?.chat?.id) return `telegram:${reaction.chat.id}`;
	const msg = ctx.message ?? ctx.channelPost ?? ctx.editedMessage ?? ctx.editedChannelPost ?? ctx.update?.message ?? ctx.update?.edited_message ?? ctx.update?.channel_post ?? ctx.update?.edited_channel_post ?? ctx.update?.callback_query?.message;
	const chatId = msg?.chat?.id ?? ctx.chat?.id;
	const rawText = msg?.text ?? msg?.caption;
	const botUsername = ctx.me?.username;
	if (isTelegramControlLaneText({
		rawText,
		botUsername
	})) {
		if (typeof chatId === "number") return `telegram:${chatId}:control`;
		return "telegram:control";
	}
	if (isBtwRequestText(rawText, botUsername ? { botUsername } : void 0)) {
		const messageId = msg?.message_id;
		if (typeof chatId === "number" && typeof messageId === "number") return `telegram:${chatId}:btw:${messageId}`;
		if (typeof chatId === "number") return `telegram:${chatId}:btw`;
		return "telegram:btw";
	}
	const callbackData = ctx.update?.callback_query?.data;
	if (parseTelegramQuestionCallbackData(callbackData)) {
		if (typeof chatId === "number") return `telegram:${chatId}:question`;
		return "telegram:question";
	}
	if (callbackData && parseExecApprovalCommandText(callbackData) !== null) {
		if (typeof chatId === "number") return `telegram:${chatId}:approval`;
		return "telegram:approval";
	}
	const isGroup = msg?.chat?.type === "group" || msg?.chat?.type === "supergroup";
	const messageThreadId = msg?.message_thread_id;
	const isForum = resolveTelegramMessageForumFlagHint({
		chatType: msg?.chat?.type,
		isForum: msg?.chat?.is_forum,
		isTopicMessage: msg?.is_topic_message
	});
	const threadId = isGroup ? resolveTelegramForumThreadId({
		isForum,
		messageThreadId
	}) : messageThreadId;
	if (typeof chatId === "number") return threadId != null ? `telegram:${chatId}:topic:${threadId}` : `telegram:${chatId}`;
	return "telegram:unknown";
}
//#endregion
//#region extensions/telegram/src/telegram-ingress-spool.payload.ts
var TelegramIngressPayloadError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "TelegramIngressPayloadError";
	}
};
//#endregion
//#region extensions/telegram/src/telegram-ingress-spool.ts
const TELEGRAM_INGRESS_SPOOL_PREFIX = "ingress-spool-";
const TELEGRAM_SPOOLED_UPDATE_FAILED_TTL_MS = 720 * 60 * 60 * 1e3;
const TELEGRAM_SPOOLED_UPDATE_FAILED_MAX_ENTRIES = 1e3;
const TELEGRAM_SPOOLED_UPDATE_COMPLETED_TTL_MS = 720 * 60 * 60 * 1e3;
const TELEGRAM_SPOOLED_UPDATE_COMPLETED_MAX_ENTRIES = 1e3;
const TELEGRAM_SPOOLED_COMPLETION_RETRY_POLICY = {
	initialMs: 250,
	maxMs: 5e3,
	factor: 2,
	jitter: .2
};
function isValidUpdateId(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function resolveTelegramIngressSpoolDir(params) {
	const stateDir = resolveStateDir(params.env, os.homedir);
	return path.join(stateDir, "telegram", `${TELEGRAM_INGRESS_SPOOL_PREFIX}${normalizeTelegramStateAccountId(params.accountId)}`);
}
function resolveTelegramUpdateId$1(update) {
	if (!update || typeof update !== "object") return null;
	const value = update.update_id;
	return isValidUpdateId(value) ? value : null;
}
function telegramQueueEventId(updateId) {
	return String(updateId).padStart(16, "0");
}
function resolveQueueParts(spoolDir) {
	const basename = path.basename(spoolDir);
	return {
		accountId: normalizeTelegramStateAccountId(basename.startsWith(TELEGRAM_INGRESS_SPOOL_PREFIX) ? basename.slice(14) : basename),
		stateDir: basename.startsWith(TELEGRAM_INGRESS_SPOOL_PREFIX) && path.basename(path.dirname(spoolDir)) === "telegram" ? path.dirname(path.dirname(spoolDir)) : spoolDir
	};
}
/** Open the account-scoped durable ingress queue for this spool directory. */
function openTelegramIngressQueue(spoolDir) {
	const parts = resolveQueueParts(spoolDir);
	return getTelegramRuntime().state.openChannelIngressQueue({
		accountId: parts.accountId,
		stateDir: parts.stateDir
	});
}
function telegramSpooledUpdateLaneKey(update, botInfo) {
	return getTelegramSequentialKey({
		update,
		...botInfo ? { me: botInfo } : {}
	});
}
/**
* Durable-before-ack accept path: commit the update to the ingress queue.
* Polling advances offset only after this returns; webhook returns 200 only after.
*/
async function writeTelegramSpooledUpdate(params) {
	const updateId = resolveTelegramUpdateId$1(params.update);
	if (updateId === null) throw new Error("Telegram update missing numeric update_id.");
	const receivedAt = params.now ?? Date.now();
	await openTelegramIngressQueue(params.spoolDir).enqueue(telegramQueueEventId(updateId), {
		version: 1,
		updateId,
		receivedAt,
		update: params.update
	}, {
		receivedAt,
		laneKey: params.laneKey ?? telegramSpooledUpdateLaneKey(params.update)
	});
	return updateId;
}
/** Backoff for irrevocable-adoption completion retries (bot-message only). */
function resolveSpooledUpdatePersistenceRetryDelayMs(attempt) {
	return computeBackoff(TELEGRAM_SPOOLED_COMPLETION_RETRY_POLICY, attempt);
}
//#endregion
//#region extensions/telegram/src/bot-message.ts
const telegramInboundLog = createSubsystemLogger("gateway/channels/telegram").child("inbound");
function formatTelegramInboundLogLine(params) {
	const kindLabel = params.mediaType ? `, ${params.mediaType}` : "";
	return `Inbound message ${params.from} -> ${params.to} (${params.chatType}${kindLabel}, ${params.body.length} chars)`;
}
function resolveTelegramMessageTurnSettings(params) {
	const allowFrom = params.opts.allowFrom ?? params.telegramCfg.allowFrom;
	const telegramTextLimit = params.telegramCfg.richMessages === true ? TELEGRAM_RICH_TEXT_LIMIT : TELEGRAM_TEXT_CHUNK_LIMIT;
	return {
		ackReactionScope: params.cfg.messages?.ackReactionScope ?? "group-mentions",
		allowFrom,
		dmPolicy: params.telegramCfg.dmPolicy ?? "pairing",
		groupAllowFrom: params.opts.groupAllowFrom ?? params.telegramCfg.groupAllowFrom ?? params.telegramCfg.allowFrom ?? allowFrom,
		historyLimit: Math.max(0, params.telegramCfg.historyLimit ?? params.cfg.messages?.groupChat?.historyLimit ?? 50),
		replyToMode: params.opts.replyToMode ?? params.telegramCfg.replyToMode ?? "off",
		streamMode: resolveTelegramStreamMode(params.telegramCfg),
		textLimit: Math.min(resolveTextChunkLimit(params.cfg, "telegram", params.accountId, { fallbackLimit: telegramTextLimit }), telegramTextLimit)
	};
}
const createTelegramMessageProcessor = (deps) => {
	const { bot, account, groupHistories, logger, resolveGroupActivation, resolveGroupRequireMention, resolveTelegramGroupConfig, sendChatActionHandler, runtime, telegramDeps, opts } = deps;
	const sessionRuntime = {
		...telegramDeps.buildChannelInboundEventContext ? { buildChannelInboundEventContext: telegramDeps.buildChannelInboundEventContext } : {},
		...telegramDeps.readSessionUpdatedAt ? { readSessionUpdatedAt: telegramDeps.readSessionUpdatedAt } : {},
		...telegramDeps.readAmbientTranscriptWatermark ? { readAmbientTranscriptWatermark: telegramDeps.readAmbientTranscriptWatermark } : {},
		...telegramDeps.recordInboundSession ? { recordInboundSession: telegramDeps.recordInboundSession } : {},
		...telegramDeps.resolveAmbientTranscriptWatermarkKey ? { resolveAmbientTranscriptWatermarkKey: telegramDeps.resolveAmbientTranscriptWatermarkKey } : {},
		...telegramDeps.resolveInboundLastRouteSessionKey ? { resolveInboundLastRouteSessionKey: telegramDeps.resolveInboundLastRouteSessionKey } : {},
		...telegramDeps.resolvePinnedMainDmOwnerFromAllowlist ? { resolvePinnedMainDmOwnerFromAllowlist: telegramDeps.resolvePinnedMainDmOwnerFromAllowlist } : {},
		resolveStorePath: telegramDeps.resolveStorePath
	};
	const contextRuntime = telegramDeps.recordChannelActivity ? { recordChannelActivity: telegramDeps.recordChannelActivity } : void 0;
	return async (primaryCtx, allMedia, storeAllowFrom, turnContext, options, replyMedia, replyChain, promptContext) => {
		const turnCfg = turnContext.cfg;
		const turnTelegramCfg = turnContext.telegramCfg;
		const turnSettings = resolveTelegramMessageTurnSettings({
			accountId: account.accountId,
			cfg: turnCfg,
			telegramCfg: turnTelegramCfg,
			opts
		});
		const ingressReceivedAtMs = typeof options?.receivedAtMs === "number" && Number.isFinite(options.receivedAtMs) ? options.receivedAtMs : void 0;
		const ingressDebugEnabled = shouldLogVerbose() || process.env.OPENCLAW_DEBUG_TELEGRAM_INGRESS === "1";
		const ingressContextStartMs = ingressReceivedAtMs ? Date.now() : void 0;
		const recordCurrentUpdateProcessingResult = (result) => {
			if (options?.spooledReplay === true) return;
			recordTelegramMessageProcessingResult(result);
		};
		const context = await buildTelegramMessageContext({
			primaryCtx,
			allMedia,
			replyMedia,
			replyChain,
			promptContext,
			storeAllowFrom,
			options,
			bot,
			cfg: turnCfg,
			account,
			historyLimit: turnSettings.historyLimit,
			groupHistories,
			dmPolicy: turnSettings.dmPolicy,
			allowFrom: turnSettings.allowFrom,
			groupAllowFrom: turnSettings.groupAllowFrom,
			ackReactionScope: turnSettings.ackReactionScope,
			logger,
			resolveGroupActivation,
			resolveGroupRequireMention,
			resolveTelegramGroupConfig,
			sendChatActionHandler,
			runtime: contextRuntime,
			sessionRuntime,
			upsertPairingRequest: telegramDeps.upsertChannelPairingRequest
		});
		if (!context) {
			if (ingressDebugEnabled && ingressReceivedAtMs && ingressContextStartMs) logVerbose(`telegram ingress: chatId=${primaryCtx.message.chat.id} dropped after ${Date.now() - ingressReceivedAtMs}ms` + (options?.ingressBuffer ? ` buffer=${options.ingressBuffer}` : ""));
			const result = { kind: "skipped" };
			recordCurrentUpdateProcessingResult(result);
			return result;
		}
		if (ingressDebugEnabled && ingressReceivedAtMs && ingressContextStartMs) logVerbose(`telegram ingress: chatId=${context.chatId} contextReadyMs=${Date.now() - ingressReceivedAtMs} preDispatchMs=${Date.now() - ingressContextStartMs}` + (options?.ingressBuffer ? ` buffer=${options.ingressBuffer}` : ""));
		if (context.ctxPayload.InboundEventKind !== "room_event" && context.initialTypingCueSent !== true) context.sendTyping().catch((err) => {
			logVerbose(`telegram early typing cue failed for chat ${context.chatId}: ${String(err)}`);
		});
		telegramInboundLog.info(formatTelegramInboundLogLine({
			from: context.ctxPayload.From,
			to: context.primaryCtx.me?.username ? `@${context.primaryCtx.me.username}` : context.ctxPayload.To,
			chatType: context.ctxPayload.ChatType,
			body: context.ctxPayload.RawBody,
			mediaType: allMedia[0]?.contentType ?? allMedia[0]?.kind
		}));
		const spooledReplay = options?.spooledReplay === true || isTelegramSpooledReplayUpdate(primaryCtx.update);
		if (!spooledReplay) await turnContext.onDispatchStart?.();
		const runTelegramDispatch = async (params) => {
			try {
				const dispatchResult = await dispatchTelegramMessage({
					context,
					bot,
					cfg: context.cfg,
					runtime,
					replyToMode: turnSettings.replyToMode,
					streamMode: turnSettings.streamMode,
					textLimit: turnSettings.textLimit,
					telegramCfg: turnTelegramCfg,
					telegramDeps,
					opts,
					retryDispatchErrors: spooledReplay,
					suppressFailureFallback: spooledReplay,
					turnAdoptionLifecycle: params.turnAdoptionLifecycle
				});
				if (dispatchResult?.kind === "failed-retryable") {
					const result = {
						kind: "failed-retryable",
						error: dispatchResult.error
					};
					recordCurrentUpdateProcessingResult(result);
					return result;
				}
				if (ingressDebugEnabled && ingressReceivedAtMs) logVerbose(`telegram ingress: chatId=${context.chatId} dispatchCompleteMs=${Date.now() - ingressReceivedAtMs}` + (options?.ingressBuffer ? ` buffer=${options.ingressBuffer}` : ""));
				const result = { kind: "completed" };
				recordCurrentUpdateProcessingResult(result);
				return result;
			} catch (err) {
				runtime.error?.(danger(`telegram message processing failed: ${String(err)}`));
				if (!spooledReplay) try {
					await bot.api.sendMessage(context.chatId, "Something went wrong while processing your request. Please try again.", buildTelegramThreadParams(context.threadSpec));
				} catch {}
				const result = {
					kind: "failed-retryable",
					error: err
				};
				recordCurrentUpdateProcessingResult(result);
				return result;
			}
		};
		if (spooledReplay) {
			const participant = turnContext.spooledReplayParticipant ?? (options?.isolateSpooledReplaySettlement ? void 0 : getTelegramSpooledReplayDeferredParticipant()) ?? (options?.isolateSpooledReplaySettlement ? void 0 : createTelegramSpooledReplayDeferredParticipant(`agent-turn:${context.chatId}:${context.ctxPayload.MessageSid ?? Date.now()}`)) ?? createTelegramSpooledReplayParticipant(`agent-turn:${context.chatId}:${context.ctxPayload.MessageSid ?? Date.now()}`);
			let adopted = false;
			let adoptionAttempted = false;
			let adoptionFinalizationError;
			let deferred = false;
			let settledResult;
			let settlement;
			const settle = async (result, phase) => {
				if (settledResult) return settledResult;
				if (settlement) return await settlement;
				settlement = (async () => {
					let finalized;
					try {
						finalized = turnContext.finalizeSpooledReplayResult ? await turnContext.finalizeSpooledReplayResult(result, phase) : result;
					} catch (error) {
						finalized = {
							kind: "failed-retryable",
							error
						};
					}
					if (phase === "adopted" && finalized.kind !== "completed") return finalized;
					if (phase === "adopted" && finalized.kind === "completed") adopted = true;
					settledResult = finalized;
					participant.settle(finalized);
					return finalized;
				})();
				try {
					return await settlement;
				} finally {
					if (!settledResult) settlement = void 0;
				}
			};
			const run = async () => {
				const drainLifecycle = getTelegramSpooledReplayLifecycle();
				const turnAbortSignal = (() => {
					const extras = [turnContext.spooledReplayAbortSignal, drainLifecycle?.abortSignal].filter((signal) => signal !== void 0);
					if (extras.length === 0) return participant.abortSignal;
					return AbortSignal.any([participant.abortSignal, ...extras]);
				})();
				const result = await runTelegramDispatch({ turnAdoptionLifecycle: {
					admission: "exclusive",
					abortSignal: turnAbortSignal,
					onAdopted: async () => {
						if (adopted) return;
						adoptionAttempted = true;
						const adoptedResult = await settle({ kind: "completed" }, "adopted");
						if (adoptedResult.kind !== "completed") {
							adoptionFinalizationError = adoptedResult.kind === "failed-retryable" ? adoptedResult.error : /* @__PURE__ */ new Error("telegram spooled turn adoption was not completed");
							throw adoptedResult.kind === "failed-retryable" ? adoptedResult.error : /* @__PURE__ */ new Error("telegram spooled turn adoption was not completed");
						}
						await drainLifecycle?.onAdopted();
					},
					onDeferred: () => {
						deferred = true;
						drainLifecycle?.onDeferred();
					},
					onAbandoned: () => {
						if (!adopted) settle({ kind: "skipped" }, "terminal");
						drainLifecycle?.onAbandoned();
					}
				} });
				if (adopted) return { kind: "completed" };
				if (settledResult) return settledResult;
				if (adoptionAttempted && !deferred && result.kind === "completed") {
					runtime.error?.(danger(`telegram spooled turn adoption finalization failed after active steer commit: ${String(adoptionFinalizationError)}`));
					let retryError = adoptionFinalizationError;
					let retryAttempt = 0;
					while (!turnAbortSignal.aborted) {
						retryAttempt += 1;
						try {
							const completed = await turnContext.completeSpooledReplayAfterIrrevocableAdoption?.(retryError) ?? { kind: "completed" };
							if (completed.kind === "completed") {
								adopted = true;
								settledResult = completed;
								participant.settle(completed);
								return completed;
							}
							retryError = completed.kind === "failed-retryable" ? completed.error : /* @__PURE__ */ new Error("telegram spooled turn adoption was not completed");
						} catch (error) {
							retryError = error;
						}
						const delayMs = resolveSpooledUpdatePersistenceRetryDelayMs(retryAttempt);
						runtime.error?.(danger(`telegram spooled turn durable replay protection retry ${retryAttempt} failed after active steer commit; retrying in ${delayMs}ms: ${String(retryError)}`));
						try {
							await sleepWithAbort(delayMs, turnAbortSignal);
						} catch {
							break;
						}
					}
					if (turnAbortSignal.aborted && !participant.abortSignal.aborted) {
						const abortResult = turnAbortSignal.reason === "skipped" ? { kind: "skipped" } : {
							kind: "failed-retryable",
							error: turnAbortSignal.reason ?? /* @__PURE__ */ new Error("telegram spooled replay owner cancelled")
						};
						participant.settle(abortResult);
					}
					return await participant.task;
				}
				if (deferred) return await participant.task;
				return await settle(result, "terminal");
			};
			run();
			return await participant.task;
		}
		return await runTelegramDispatch({});
	};
};
//#endregion
//#region extensions/telegram/src/bot-handlers.authorization.runtime.ts
function createTelegramHandlerAuthorizationRuntime({ accountId, bot, opts, logger, telegramDeps, resolveGroupPolicy, resolveTelegramGroupConfig }) {
	const shouldSkipGroupMessage = (params) => shouldSkipTelegramGroupMessage(params, {
		logger,
		resolveGroupPolicy
	});
	const TELEGRAM_EVENT_AUTH_RULES = {
		reaction: {
			enforceDirectAuthorization: true,
			enforceGroupAllowlistAuthorization: false,
			deniedDmReason: "reaction unauthorized by dm policy/allowlist",
			deniedGroupReason: "reaction unauthorized by group allowlist"
		},
		"callback-scope": {
			enforceDirectAuthorization: false,
			enforceGroupAllowlistAuthorization: false,
			deniedDmReason: "callback unauthorized by inlineButtonsScope",
			deniedGroupReason: "callback unauthorized by inlineButtonsScope"
		},
		"callback-allowlist": {
			enforceDirectAuthorization: true,
			enforceGroupAllowlistAuthorization: false,
			deniedDmReason: "callback unauthorized by inlineButtonsScope allowlist",
			deniedGroupReason: "callback unauthorized by inlineButtonsScope allowlist"
		},
		"callback-runtime-allowlist": {
			enforceDirectAuthorization: true,
			enforceGroupAllowlistAuthorization: true,
			deniedDmReason: "runtime callback unauthorized by allowlist",
			deniedGroupReason: "runtime callback unauthorized by group allowlist"
		}
	};
	const resolveTelegramEventAuthorizationContext = async (params) => {
		const authorizationCfg = params.cfg;
		const authorizationTelegramCfg = resolveTelegramAccount({
			cfg: authorizationCfg,
			accountId
		}).config;
		const authorizationSettings = resolveTelegramMessageTurnSettings({
			accountId,
			cfg: authorizationCfg,
			telegramCfg: authorizationTelegramCfg,
			opts
		});
		const groupAllowContext = await resolveTelegramGroupAllowFromContext({
			cfg: authorizationCfg,
			chatId: params.chatId,
			accountId,
			dmPolicy: authorizationSettings.dmPolicy,
			allowFrom: authorizationSettings.allowFrom,
			senderId: params.senderId,
			isGroup: params.isGroup,
			isForum: params.isForum,
			messageThreadId: params.messageThreadId,
			groupAllowFrom: authorizationSettings.groupAllowFrom,
			readChannelAllowFromStore: telegramDeps.readChannelAllowFromStore,
			resolveTelegramGroupConfig
		});
		const effectiveDmPolicy = resolveTelegramEffectiveDmPolicy({
			isGroup: params.isGroup,
			groupConfig: groupAllowContext.groupConfig,
			dmPolicy: authorizationSettings.dmPolicy
		});
		return {
			cfg: authorizationCfg,
			allowFrom: authorizationSettings.allowFrom,
			telegramCfg: authorizationTelegramCfg,
			dmPolicy: effectiveDmPolicy,
			...groupAllowContext
		};
	};
	const authorizeTelegramEventSender = async (params) => {
		const { chatId, chatTitle, isGroup, senderId, senderUsername, mode, context } = params;
		const { dmPolicy, resolvedThreadId, storeAllowFrom, groupConfig, topicConfig, groupAllowOverride, effectiveGroupAllow, hasGroupAllowOverride, cfg: authorizationCfg, telegramCfg: authorizationTelegramCfg, allowFrom: authorizationAllowFrom } = context;
		const { enforceDirectAuthorization, enforceGroupAllowlistAuthorization, deniedDmReason, deniedGroupReason } = TELEGRAM_EVENT_AUTH_RULES[mode];
		if (shouldSkipGroupMessage({
			isGroup,
			chatId,
			chatTitle,
			resolvedThreadId,
			senderId,
			senderUsername,
			effectiveGroupAllow,
			hasGroupAllowOverride,
			groupConfig,
			topicConfig,
			cfg: authorizationCfg,
			telegramCfg: authorizationTelegramCfg
		})) return false;
		if (!isGroup && enforceDirectAuthorization) {
			const eventAccess = await resolveTelegramEventIngressAuthorization({
				accountId,
				dmPolicy,
				isGroup,
				chatId,
				resolvedThreadId,
				senderId,
				effectiveDmAllow: normalizeDmAllowFromWithStore({
					allowFrom: await expandTelegramAllowFromWithAccessGroups({
						cfg: authorizationCfg,
						allowFrom: groupAllowOverride ?? authorizationAllowFrom,
						accountId,
						senderId
					}),
					storeAllowFrom,
					dmPolicy
				}),
				effectiveGroupAllow,
				enforceGroupAuthorization: false,
				eventKind: mode === "reaction" ? "reaction" : "button"
			});
			if (eventAccess.decision !== "allow") {
				if (eventAccess.reasonCode === "dm_policy_disabled") {
					logVerbose(`Blocked telegram direct event from ${senderId || "unknown"} (${deniedDmReason})`);
					return false;
				}
				logVerbose(`Blocked telegram direct sender ${senderId || "unknown"} (${deniedDmReason})`);
				return false;
			}
		}
		if (isGroup && enforceGroupAllowlistAuthorization) {
			if ((await resolveTelegramEventIngressAuthorization({
				accountId,
				dmPolicy,
				isGroup,
				chatId,
				resolvedThreadId,
				senderId,
				effectiveDmAllow: normalizeDmAllowFromWithStore({
					allowFrom: [],
					dmPolicy
				}),
				effectiveGroupAllow,
				enforceGroupAuthorization: true,
				eventKind: mode === "reaction" ? "reaction" : "button"
			})).decision !== "allow") {
				logVerbose(`Blocked telegram group sender ${senderId || "unknown"} (${deniedGroupReason})`);
				return false;
			}
		}
		return true;
	};
	const isTelegramModelCallbackAuthorized = async (params) => {
		const { chatId, isGroup, senderId, senderUsername, context } = params;
		const cfgLocal = context.cfg;
		const dmAllowFrom = context.groupAllowOverride ?? context.allowFrom;
		if (isTelegramCommandsAllowFromConfigured(cfgLocal)) return resolveTelegramCommandAuthorization({
			cfg: cfgLocal,
			accountId,
			chatId,
			isGroup,
			resolvedThreadId: context.resolvedThreadId,
			senderId,
			senderUsername
		}).isAuthorizedSender;
		const dmAllow = normalizeDmAllowFromWithStore({
			allowFrom: await expandTelegramAllowFromWithAccessGroups({
				cfg: cfgLocal,
				allowFrom: dmAllowFrom,
				accountId,
				senderId
			}),
			storeAllowFrom: isGroup ? [] : context.storeAllowFrom,
			dmPolicy: context.dmPolicy
		});
		return (await resolveTelegramCommandIngressAuthorization({
			accountId,
			cfg: cfgLocal,
			dmPolicy: context.dmPolicy,
			isGroup,
			chatId,
			resolvedThreadId: context.resolvedThreadId,
			senderId,
			effectiveDmAllow: dmAllow,
			effectiveGroupAllow: context.effectiveGroupAllow,
			ownerAccess: {
				ownerList: [],
				senderIsOwner: false
			},
			eventKind: "button"
		})).authorized;
	};
	const authorizeInboundMessage = async (params) => {
		const authorizationCfg = telegramDeps.getRuntimeConfig();
		const context = await resolveTelegramEventAuthorizationContext({
			cfg: authorizationCfg,
			chatId: params.chatId,
			isGroup: params.isGroup,
			isForum: params.isForum,
			senderId: params.senderId,
			messageThreadId: params.messageThreadId
		});
		const { dmPolicy, resolvedThreadId, dmThreadId, storeAllowFrom, groupConfig, topicConfig, groupAllowOverride, effectiveGroupAllow, hasGroupAllowOverride, telegramCfg: authorizationTelegramCfg, allowFrom: authorizationAllowFrom } = context;
		const effectiveDmAllow = normalizeDmAllowFromWithStore({
			allowFrom: await expandTelegramAllowFromWithAccessGroups({
				cfg: authorizationCfg,
				allowFrom: groupAllowOverride ?? authorizationAllowFrom,
				accountId,
				senderId: params.senderId
			}),
			storeAllowFrom,
			dmPolicy
		});
		if (params.requireConfiguredGroup && (!groupConfig || groupConfig.enabled === false)) {
			logVerbose(`Blocked telegram channel ${params.chatId} (channel disabled)`);
			return { allowed: false };
		}
		if (shouldSkipGroupMessage({
			isGroup: params.isGroup,
			chatId: params.chatId,
			chatTitle: params.msg.chat.title,
			resolvedThreadId,
			senderId: params.senderId,
			senderUsername: params.senderUsername,
			effectiveGroupAllow,
			hasGroupAllowOverride,
			groupConfig,
			topicConfig,
			cfg: authorizationCfg,
			telegramCfg: authorizationTelegramCfg
		})) return { allowed: false };
		if (!params.isGroup) {
			if ((groupConfig && "requireTopic" in groupConfig ? groupConfig.requireTopic : void 0) === true && dmThreadId == null) {
				logVerbose(`Blocked telegram DM ${params.chatId}: requireTopic=true but no topic present`);
				return { allowed: false };
			}
			if (!(params.dmAccess === "challenge" ? await enforceTelegramDmAccess({
				isGroup: params.isGroup,
				dmPolicy,
				msg: params.msg,
				chatId: params.chatId,
				effectiveDmAllow,
				accountId,
				bot,
				logger,
				upsertPairingRequest: telegramDeps.upsertChannelPairingRequest
			}) : await isTelegramDmAccessAllowed({
				dmPolicy,
				msg: params.msg,
				chatId: params.chatId,
				effectiveDmAllow,
				accountId
			}))) return { allowed: false };
		}
		return {
			allowed: true,
			context,
			effectiveDmAllow
		};
	};
	return {
		resolveTelegramEventAuthorizationContext,
		authorizeTelegramEventSender,
		isTelegramModelCallbackAuthorized,
		authorizeInboundMessage
	};
}
//#endregion
//#region extensions/telegram/src/bot-handlers.callback-actions.runtime.ts
function createTelegramCallbackMessageActions(params) {
	const { bot, callbackMessage, isGroup, isForum } = params;
	const callbackBusinessParams = callbackMessage.business_connection_id !== void 0 ? { business_connection_id: callbackMessage.business_connection_id } : void 0;
	const withCallbackBusinessParams = (value) => callbackBusinessParams ? {
		...callbackBusinessParams,
		...value
	} : value;
	const editCallbackMessage = async (text, editParams) => {
		return await bot.api.editMessageText(callbackMessage.chat.id, callbackMessage.message_id, text, editParams ? withCallbackBusinessParams(editParams) : callbackBusinessParams);
	};
	const clearCallbackButtons = async () => {
		return await bot.api.editMessageReplyMarkup(callbackMessage.chat.id, callbackMessage.message_id, withCallbackBusinessParams({ reply_markup: { inline_keyboard: [] } }));
	};
	const editCallbackButtons = async (buttons) => {
		return await bot.api.editMessageReplyMarkup(callbackMessage.chat.id, callbackMessage.message_id, withCallbackBusinessParams({ reply_markup: buildInlineKeyboard(buttons) ?? { inline_keyboard: [] } }));
	};
	const deleteCallbackMessage = async () => {
		return await bot.api.deleteMessage(callbackMessage.chat.id, callbackMessage.message_id);
	};
	const replyToCallbackChat = async (text, replyParams) => {
		const threadParams = buildTelegramThreadParams(resolveTelegramThreadSpec({
			isGroup,
			isForum,
			messageThreadId: callbackMessage.message_thread_id
		}));
		const topicParams = {
			...callbackBusinessParams,
			...threadParams,
			...callbackMessage.direct_messages_topic?.topic_id != null ? { direct_messages_topic_id: callbackMessage.direct_messages_topic.topic_id } : {}
		};
		const mergedParams = Object.keys(topicParams).length > 0 || replyParams ? {
			...topicParams,
			...replyParams
		} : replyParams;
		return await bot.api.sendMessage(callbackMessage.chat.id, text, mergedParams);
	};
	return {
		editCallbackMessage,
		clearCallbackButtons,
		editCallbackButtons,
		deleteCallbackMessage,
		replyToCallbackChat
	};
}
//#endregion
//#region extensions/telegram/src/bot-handlers.callback-errors.runtime.ts
var TelegramRetryableCallbackError = class extends Error {
	constructor(cause) {
		super(String(cause));
		this.cause = cause;
		this.name = "TelegramRetryableCallbackError";
	}
};
const isPermanentTelegramCallbackEditError = (err) => isTelegramEditTargetMissingError(err) || isTelegramMessageHasNoTextError(err);
function isApprovalAlreadyResolvedError(error) {
	if (!(error instanceof Error)) return false;
	const record = error;
	const reason = record.details?.reason;
	return record.gatewayCode === "APPROVAL_ALREADY_RESOLVED" || record.gatewayCode === "INVALID_REQUEST" && reason === "APPROVAL_ALREADY_RESOLVED" || /approval already resolved/i.test(error.message);
}
//#endregion
//#region extensions/telegram/src/bot-handlers.callback-approvals.runtime.ts
function createTelegramCallbackApprovalRuntime(params) {
	const { accountId, telegramDeps, runtimeCfg, senderId, actions } = params;
	const { clearCallbackButtons, editCallbackMessage, replyToCallbackChat } = actions;
	const resolveApprovalAuthorizations = () => {
		const pluginApprovalAuthorizedSender = isTelegramExecApprovalApprover({
			cfg: runtimeCfg,
			accountId,
			senderId
		});
		return {
			execApprovalAuthorizedSender: isTelegramExecApprovalAuthorizedSender({
				cfg: runtimeCfg,
				accountId,
				senderId
			}),
			pluginApprovalAuthorizedSender
		};
	};
	const clearTerminalApprovalButtons = async () => {
		try {
			await clearCallbackButtons();
		} catch (editErr) {
			const errStr = String(editErr);
			if (errStr.includes("message is not modified") || errStr.includes("there is no text in the message to edit")) return;
			logVerbose(`telegram: failed to clear approval callback buttons: ${errStr}`);
		}
	};
	const terminalizeApprovalMessage = async (text) => {
		try {
			await editCallbackMessage(text, { reply_markup: { inline_keyboard: [] } });
			return;
		} catch (editErr) {
			const errStr = String(editErr);
			const alreadyTerminal = errStr.includes("message is not modified");
			if (!alreadyTerminal) logVerbose(`telegram: failed to render terminal approval receipt: ${errStr}`);
			await clearTerminalApprovalButtons();
			if (alreadyTerminal) return;
		}
		try {
			await replyToCallbackChat(text);
		} catch (sendErr) {
			logVerbose(`telegram: failed to send terminal approval receipt: ${String(sendErr)}`);
		}
	};
	const resolveCanonicalApproval = async (approvalCallback) => await (telegramDeps.resolveApproval ?? resolveTelegramApproval)({
		cfg: runtimeCfg,
		approvalId: approvalCallback.approvalId,
		approvalKind: approvalCallback.approvalKind,
		decision: approvalCallback.decision,
		senderId
	});
	const terminalizeCanonicalApproval = async (approvalCallback, result) => await terminalizeApprovalMessage(buildTelegramCanonicalApprovalTerminalText({
		result,
		fallbackApprovalId: approvalCallback.approvalId
	}));
	const handleCanonical = async (approvalCallback) => {
		const { execApprovalAuthorizedSender, pluginApprovalAuthorizedSender } = resolveApprovalAuthorizations();
		if (!(approvalCallback.approvalKind === "plugin" ? pluginApprovalAuthorizedSender : execApprovalAuthorizedSender || pluginApprovalAuthorizedSender)) {
			logVerbose(`Blocked telegram approval callback from ${senderId || "unknown"} (not authorized)`);
			return;
		}
		try {
			const result = await resolveCanonicalApproval(approvalCallback);
			if (!result.applied) logVerbose(`telegram: approval callback already resolved ${approvalCallback.approvalId} status=${result.approval.status}`);
			await terminalizeCanonicalApproval(approvalCallback, result);
		} catch (resolveErr) {
			logVerbose(`telegram: failed to resolve approval callback ${approvalCallback.approvalId}: ${String(resolveErr)}`);
			if (isApprovalNotFoundError(resolveErr) || isApprovalAlreadyResolvedError(resolveErr)) {
				await terminalizeApprovalMessage(buildTelegramLegacyApprovalTerminalText({
					approvalId: approvalCallback.approvalId,
					outcome: "no-longer-pending"
				}));
				return;
			}
			throw new TelegramRetryableCallbackError(resolveErr);
		}
	};
	const handleMalformedReserved = async () => {
		const { execApprovalAuthorizedSender, pluginApprovalAuthorizedSender } = resolveApprovalAuthorizations();
		if (!execApprovalAuthorizedSender && !pluginApprovalAuthorizedSender) {
			logVerbose(`Blocked malformed telegram approval callback from ${senderId || "unknown"} (not authorized)`);
			return;
		}
		logVerbose(`telegram: consumed malformed reserved approval callback from ${senderId}`);
		await terminalizeApprovalMessage(buildTelegramInvalidApprovalTerminalText());
	};
	const handleLegacy = async (approvalCallback) => {
		const { execApprovalAuthorizedSender, pluginApprovalAuthorizedSender } = resolveApprovalAuthorizations();
		const approvalKinds = [];
		if (execApprovalAuthorizedSender || pluginApprovalAuthorizedSender) approvalKinds.push("exec");
		if (pluginApprovalAuthorizedSender) approvalKinds.push("plugin");
		if (approvalKinds.length === 0) {
			logVerbose(`Blocked telegram approval callback from ${senderId || "unknown"} (not authorized)`);
			return;
		}
		const resolveLegacy = telegramDeps.resolveLegacyApproval ?? resolveTelegramLegacyApproval;
		for (const approvalKind of approvalKinds) {
			const canonicalCallback = {
				type: "approval",
				approvalId: approvalCallback.approvalId,
				approvalKind,
				decision: approvalCallback.decision
			};
			try {
				await resolveLegacy({
					cfg: runtimeCfg,
					approvalId: approvalCallback.approvalId,
					approvalKind,
					decision: approvalCallback.decision,
					senderId
				});
				await terminalizeApprovalMessage(buildTelegramLegacyApprovalTerminalText({
					approvalId: approvalCallback.approvalId,
					decision: approvalCallback.decision,
					outcome: "resolved-here"
				}));
				return;
			} catch (resolveErr) {
				if (isApprovalNotFoundError(resolveErr)) continue;
				if (isApprovalAlreadyResolvedError(resolveErr)) {
					try {
						const result = await resolveCanonicalApproval(canonicalCallback);
						await terminalizeCanonicalApproval(canonicalCallback, result);
					} catch (canonicalError) {
						if (!isApprovalNotFoundError(canonicalError) && !isApprovalAlreadyResolvedError(canonicalError)) throw new TelegramRetryableCallbackError(canonicalError);
						logVerbose(`telegram: canonical approval lookup failed after stale legacy callback ${approvalCallback.approvalId}: ${String(canonicalError)}`);
						await terminalizeApprovalMessage(buildTelegramLegacyApprovalTerminalText({
							approvalId: approvalCallback.approvalId,
							outcome: "no-longer-pending"
						}));
					}
					return;
				}
				logVerbose(`telegram: failed to resolve approval callback ${approvalCallback.approvalId}: ${String(resolveErr)}`);
				throw new TelegramRetryableCallbackError(resolveErr);
			}
		}
		logVerbose(`telegram: approval callback not found ${approvalCallback.approvalId}`);
		if (!pluginApprovalAuthorizedSender) return;
		await terminalizeApprovalMessage(buildTelegramLegacyApprovalTerminalText({
			approvalId: approvalCallback.approvalId,
			outcome: "no-longer-pending"
		}));
	};
	return {
		handleCanonical,
		handleMalformedReserved,
		handleLegacy
	};
}
//#endregion
//#region extensions/telegram/src/interactive-dispatch.ts
async function dispatchTelegramPluginInteractiveHandler(params) {
	return await dispatchPluginInteractiveHandler({
		channel: "telegram",
		data: params.data,
		dedupeId: params.callbackId,
		onMatched: params.onMatched,
		afterInvoke: params.afterInvoke,
		invoke: ({ registration, namespace, payload }) => {
			const { callbackMessage, ...handlerContext } = params.ctx;
			return registration.handler({
				...handlerContext,
				channel: "telegram",
				callback: {
					data: params.data,
					namespace,
					payload,
					messageId: callbackMessage.messageId,
					chatId: callbackMessage.chatId,
					messageText: callbackMessage.messageText
				},
				respond: params.respond,
				...createInteractiveConversationBindingHelpers({
					registration,
					senderId: handlerContext.senderId,
					conversation: {
						channel: "telegram",
						accountId: handlerContext.accountId,
						conversationId: handlerContext.conversationId,
						parentConversationId: handlerContext.parentConversationId,
						threadId: handlerContext.threadId
					}
				})
			});
		}
	});
}
//#endregion
//#region extensions/telegram/src/bot-handlers.callback-interactions.runtime.ts
const MULTI_SELECT_PREFIX = "OC_MULTI|";
const MULTI_SELECT_TOGGLE_PREFIX = `${MULTI_SELECT_PREFIX}toggle|`;
const SELECT_PREFIX = "OC_SELECT|";
const SELECTED_PREFIX = "✅ ";
const TELEGRAM_PLUGIN_CALLBACK_SUBMIT_RETRY_DELAYS_MS = [
	250,
	1e3,
	2500
];
const REPLY_SESSION_INIT_CONFLICT_MESSAGE_RE = /reply session initialization conflicted for \S+/u;
const parseTelegramManagedSelectCallback = (data) => {
	if (data.startsWith(MULTI_SELECT_TOGGLE_PREFIX)) return {
		type: "multi-toggle",
		value: data.slice(MULTI_SELECT_TOGGLE_PREFIX.length)
	};
	if (data === `${MULTI_SELECT_PREFIX}clear`) return { type: "multi-clear" };
	if (data === `${MULTI_SELECT_PREFIX}submit`) return { type: "multi-submit" };
	if (data.startsWith(SELECT_PREFIX)) return {
		type: "select",
		value: data.slice(10)
	};
};
const cloneInlineKeyboardButtons = (message) => {
	const rows = message.reply_markup?.inline_keyboard;
	if (!Array.isArray(rows)) return [];
	return rows.map((row) => Array.isArray(row) ? row.map((button) => {
		const candidate = button;
		if (typeof candidate.text !== "string" || typeof candidate.callback_data !== "string") return null;
		const style = candidate.style === "danger" || candidate.style === "success" || candidate.style === "primary" ? candidate.style : void 0;
		return {
			text: candidate.text,
			callback_data: candidate.callback_data,
			...style ? { style } : {}
		};
	}).filter((button) => button !== null) : []).filter((row) => row.length > 0);
};
const stripMultiSelectPrefix = (text) => text.replace(/^✅\s*/, "");
const isSelectedMultiButton = (button) => /^✅\s*/.test(button.text);
const isMultiToggleButton = (button) => button.callback_data.startsWith(MULTI_SELECT_TOGGLE_PREFIX);
const resolveMultiSelectedValues = (buttons) => buttons.flatMap((row) => row.flatMap((button) => {
	if (!isMultiToggleButton(button) || !isSelectedMultiButton(button)) return [];
	return [button.callback_data.slice(MULTI_SELECT_TOGGLE_PREFIX.length)];
}));
const updateMultiSelectKeyboard = (message, action, value = "") => cloneInlineKeyboardButtons(message).map((row) => row.map((button) => {
	if (!isMultiToggleButton(button)) return button;
	const buttonValue = button.callback_data.slice(MULTI_SELECT_TOGGLE_PREFIX.length);
	const baseText = stripMultiSelectPrefix(button.text);
	const selected = action === "clear" ? false : buttonValue === value ? !isSelectedMultiButton(button) : isSelectedMultiButton(button);
	return {
		...button,
		text: selected ? `${SELECTED_PREFIX}${baseText}` : baseText
	};
}));
const resolvePluginCallbackSubmitText = (submitText) => {
	if (typeof submitText !== "string") return;
	const trimmed = submitText.trim();
	return trimmed ? trimmed : void 0;
};
const isReplySessionInitConflictError = (err) => REPLY_SESSION_INIT_CONFLICT_MESSAGE_RE.test(String(err instanceof Error ? err.message : err));
const isReplySessionInitConflictResult = (result) => result.kind === "failed-retryable" && isReplySessionInitConflictError(result.error);
async function handleTelegramInteractiveCallback(params) {
	const { accountId, callback, ctx, callbackMessage, data, pluginCallbackData, callbackConversationId, callbackThreadId, senderId, senderUsername, isGroup, isForum, storeAllowFrom, actions, messageRuntime, authorizeCallback } = params;
	const { buildSyntheticTextMessage, buildSyntheticContext, buildFailedProcessingResult, processMessageWithReplyChain } = messageRuntime;
	const { clearCallbackButtons, editCallbackButtons, editCallbackMessage, deleteCallbackMessage, replyToCallbackChat } = actions;
	const buildSynthetic = (text) => {
		const message = buildSyntheticTextMessage({
			base: withResolvedTelegramForumFlag(callbackMessage, isForum),
			from: callback.from,
			text
		});
		return {
			ctx: buildSyntheticContext(ctx, message),
			message
		};
	};
	const processSubmitText = async (text) => {
		const synthetic = buildSynthetic(text);
		const participant = isTelegramSpooledReplayUpdate(synthetic.ctx.update) ? getTelegramSpooledReplayDeferredParticipant() ?? createTelegramSpooledReplayDeferredParticipant(`plugin-callback-submit:${callback.id}`) ?? void 0 : void 0;
		const settle = (result) => {
			participant?.settle(result);
			return result.kind;
		};
		for (let attempt = 0;; attempt++) try {
			const result = await processMessageWithReplyChain({
				ctx: synthetic.ctx,
				msg: synthetic.message,
				allMedia: [],
				storeAllowFrom,
				options: {
					spooledReplay: true,
					isolateSpooledReplaySettlement: true,
					forceWasMentioned: true,
					messageIdOverride: callback.id
				},
				spooledReplayAbortSignal: participant?.abortSignal
			});
			if (result.kind === "completed" || result.kind === "skipped") {
				settle(result);
				return result.kind;
			}
			const retryDelayMs = TELEGRAM_PLUGIN_CALLBACK_SUBMIT_RETRY_DELAYS_MS[attempt];
			if (!isReplySessionInitConflictResult(result) || retryDelayMs === void 0) throw new TelegramRetryableCallbackError(result.error);
			logVerbose(`telegram plugin callback submitText hit active reply session; retrying in ${retryDelayMs}ms`);
			await sleepWithAbort(retryDelayMs, participant?.abortSignal);
		} catch (err) {
			const retryDelayMs = TELEGRAM_PLUGIN_CALLBACK_SUBMIT_RETRY_DELAYS_MS[attempt];
			if (!isReplySessionInitConflictError(err) || retryDelayMs === void 0) {
				settle(buildFailedProcessingResult(err));
				throw err;
			}
			logVerbose(`telegram plugin callback submitText hit active reply session; retrying in ${retryDelayMs}ms`);
			await sleepWithAbort(retryDelayMs, participant?.abortSignal);
		}
	};
	const pluginBindingApproval = parsePluginBindingApprovalCustomId(data);
	if (pluginBindingApproval) {
		let resolved;
		try {
			resolved = await resolvePluginConversationBindingApproval({
				approvalId: pluginBindingApproval.approvalId,
				decision: pluginBindingApproval.decision,
				senderId: senderId || void 0
			});
		} catch (err) {
			throw new TelegramRetryableCallbackError(err);
		}
		await clearCallbackButtons();
		await replyToCallbackChat(buildPluginBindingResolvedText(resolved));
		return true;
	}
	if ((await dispatchTelegramPluginInteractiveHandler({
		data: pluginCallbackData,
		callbackId: callback.id,
		ctx: {
			accountId,
			callbackId: callback.id,
			conversationId: callbackConversationId,
			parentConversationId: callbackThreadId != null ? String(callbackMessage.chat.id) : void 0,
			senderId: senderId || void 0,
			senderUsername: senderUsername || void 0,
			threadId: callbackThreadId,
			isGroup,
			isForum,
			auth: { isAuthorizedSender: await authorizeCallback() },
			callbackMessage: {
				messageId: callbackMessage.message_id,
				chatId: String(callbackMessage.chat.id),
				messageText: callbackMessage.text ?? callbackMessage.caption
			}
		},
		respond: {
			reply: async ({ text, buttons }) => {
				await replyToCallbackChat(text, buttons ? { reply_markup: buildInlineKeyboard(buttons) } : void 0);
			},
			editMessage: async ({ text, buttons }) => {
				await editCallbackMessage(text, buttons ? { reply_markup: buildInlineKeyboard(buttons) } : void 0);
			},
			editButtons: async ({ buttons }) => {
				await editCallbackButtons(buttons);
			},
			clearButtons: async () => {
				await clearCallbackButtons();
			},
			deleteMessage: async () => {
				await deleteCallbackMessage();
			}
		},
		afterInvoke: async (result) => {
			if (result?.handled === false) return;
			const submitText = resolvePluginCallbackSubmitText(result?.submitText);
			if (!submitText || await processSubmitText(submitText) === "skipped") return;
			await clearCallbackButtons().catch((err) => {
				logVerbose(`telegram plugin callback button cleanup skipped: ${String(err)}`);
			});
		}
	})).handled) return true;
	const managedSelectCallback = parseTelegramManagedSelectCallback(data);
	if (!managedSelectCallback) return false;
	if (managedSelectCallback.type === "multi-toggle" || managedSelectCallback.type === "multi-clear") {
		const buttons = updateMultiSelectKeyboard(callbackMessage, managedSelectCallback.type === "multi-clear" ? "clear" : "toggle", managedSelectCallback.type === "multi-toggle" ? managedSelectCallback.value : "");
		if (buttons.length > 0) try {
			await editCallbackButtons(buttons);
		} catch (editErr) {
			if (!String(editErr).includes("message is not modified")) throw new TelegramRetryableCallbackError(editErr);
		}
		return true;
	}
	let text;
	if (managedSelectCallback.type === "multi-submit") {
		const selected = resolveMultiSelectedValues(cloneInlineKeyboardButtons(callbackMessage));
		text = `Multi-select submitted: ${selected.length > 0 ? selected.join(", ") : "none"}`;
	} else {
		try {
			await clearCallbackButtons();
		} catch (editErr) {
			const errStr = String(editErr);
			if (!errStr.includes("message is not modified") && !errStr.includes("there is no text in the message to edit")) throw new TelegramRetryableCallbackError(editErr);
		}
		text = `Single-select submitted: ${managedSelectCallback.value}`;
	}
	const synthetic = buildSynthetic(text);
	await processMessageWithReplyChain({
		ctx: synthetic.ctx,
		msg: synthetic.message,
		allMedia: [],
		storeAllowFrom,
		options: {
			forceWasMentioned: true,
			messageIdOverride: callback.id
		}
	});
	return true;
}
//#endregion
//#region extensions/telegram/src/bot-handlers.callback-model.runtime.ts
async function handleTelegramModelCallback(params) {
	const { data, ctx, chatId, isGroup, isForum, messageThreadId, resolvedThreadId, senderId, runtimeCfg, telegramDeps, actions, messageRuntime, authorizeCallback } = params;
	const { editCallbackMessage, deleteCallbackMessage, replyToCallbackChat } = actions;
	const paginationMatch = data.match(/^commands_page_(\d+|noop)(?::(.+))?$/);
	if (paginationMatch) {
		const pageValue = paginationMatch[1];
		if (pageValue === "noop") return true;
		const page = parseStrictPositiveInteger(pageValue);
		if (page === void 0) return true;
		const agentId = paginationMatch[2]?.trim() || resolveDefaultAgentId(runtimeCfg);
		let result;
		try {
			result = buildCommandsMessagePaginated(runtimeCfg, telegramDeps.listSkillCommandsForAgents({
				cfg: runtimeCfg,
				agentIds: [agentId]
			}), {
				page,
				forcePaginatedList: true,
				surface: "telegram"
			});
		} catch (err) {
			throw new TelegramRetryableCallbackError(err);
		}
		const keyboard = result.totalPages > 1 ? buildInlineKeyboard(buildCommandsPaginationKeyboard(result.currentPage, result.totalPages, agentId)) : void 0;
		try {
			await editCallbackMessage(result.text, keyboard ? { reply_markup: keyboard } : void 0);
		} catch (editErr) {
			if (!String(editErr).includes("message is not modified")) throw new TelegramRetryableCallbackError(editErr);
		}
		return true;
	}
	const modelCallback = parseModelCallbackData(data);
	if (!modelCallback) return false;
	if (!await authorizeCallback()) {
		logVerbose(`Blocked telegram model callback from ${senderId || "unknown"} (not authorized for /models)`);
		return true;
	}
	let sessionState;
	let modelData;
	try {
		sessionState = messageRuntime.resolveTelegramSessionState({
			chatId,
			isGroup,
			isForum,
			messageThreadId,
			resolvedThreadId,
			botHasTopicsEnabled: resolveTelegramBotHasTopicsEnabled(ctx.me),
			senderId,
			runtimeCfg
		});
		modelData = await telegramDeps.buildModelsProviderData(runtimeCfg, sessionState.agentId);
	} catch (err) {
		throw new TelegramRetryableCallbackError(err);
	}
	const { byProvider, providers, modelNames, resolvedDefault: activeResolvedDefault } = modelData;
	const editMessageWithButtons = async (text, buttons, extra) => {
		const keyboard = buildInlineKeyboard(buttons);
		const editParams = keyboard ? {
			reply_markup: keyboard,
			...extra
		} : extra;
		try {
			await editCallbackMessage(text, editParams);
		} catch (editErr) {
			const errStr = String(editErr);
			if (errStr.includes("no text in the message")) {
				try {
					await deleteCallbackMessage();
				} catch {}
				await replyToCallbackChat(text, keyboard ? {
					reply_markup: keyboard,
					...extra
				} : extra);
			} else if (!errStr.includes("message is not modified")) throw editErr;
		}
	};
	if (modelCallback.type === "providers" || modelCallback.type === "back") {
		if (providers.length === 0) {
			try {
				await editMessageWithButtons("No providers available.", []);
			} catch (err) {
				throw new TelegramRetryableCallbackError(err);
			}
			return true;
		}
		const providerInfos = providers.map((provider) => ({
			id: provider,
			count: byProvider.get(provider)?.size ?? 0
		}));
		try {
			await editMessageWithButtons("Select a provider:", buildTelegramModelsMenuButtons({ providers: providerInfos }));
		} catch (err) {
			throw new TelegramRetryableCallbackError(err);
		}
		return true;
	}
	if (modelCallback.type === "list") {
		const { provider, page } = modelCallback;
		const modelSet = byProvider.get(provider);
		if (!modelSet || modelSet.size === 0) {
			const providerInfos = providers.map((providerId) => ({
				id: providerId,
				count: byProvider.get(providerId)?.size ?? 0
			}));
			try {
				await editMessageWithButtons(`Unknown provider: ${provider}\n\nSelect a provider:`, buildTelegramModelsMenuButtons({ providers: providerInfos }));
			} catch (err) {
				throw new TelegramRetryableCallbackError(err);
			}
			return true;
		}
		const models = [...modelSet].toSorted((left, right) => left.localeCompare(right));
		const pageSize = getModelsPageSize();
		const totalPages = calculateTotalPages(models.length, pageSize);
		const safePage = Math.max(1, Math.min(page, totalPages));
		const buttons = buildModelsKeyboard({
			provider,
			models,
			currentModel: sessionState.model || `${activeResolvedDefault.provider}/${activeResolvedDefault.model}`,
			currentPage: safePage,
			totalPages,
			pageSize,
			modelNames
		});
		const text = formatModelsAvailableHeader({
			provider,
			total: models.length,
			cfg: runtimeCfg,
			agentDir: resolveAgentDir(runtimeCfg, sessionState.agentId),
			sessionEntry: sessionState.sessionEntry
		});
		try {
			await editMessageWithButtons(text, buttons);
		} catch (err) {
			throw new TelegramRetryableCallbackError(err);
		}
		return true;
	}
	if (modelCallback.type !== "select") return true;
	const selection = resolveModelSelection({
		callback: modelCallback,
		providers,
		byProvider
	});
	if (selection.kind !== "resolved") {
		const providerInfos = providers.map((provider) => ({
			id: provider,
			count: byProvider.get(provider)?.size ?? 0
		}));
		try {
			await editMessageWithButtons(`Could not resolve model "${selection.model}".\n\nSelect a provider:`, buildTelegramModelsMenuButtons({ providers: providerInfos }));
		} catch (err) {
			throw new TelegramRetryableCallbackError(err);
		}
		return true;
	}
	if (!byProvider.get(selection.provider)?.has(selection.model)) {
		try {
			await editMessageWithButtons(`❌ Model "${selection.provider}/${selection.model}" is not allowed.`, []);
		} catch (err) {
			throw new TelegramRetryableCallbackError(err);
		}
		return true;
	}
	try {
		const storePath = telegramDeps.resolveStorePath(runtimeCfg.session?.store, { agentId: sessionState.agentId });
		const resolvedDefault = resolveDefaultModelForAgent({
			cfg: runtimeCfg,
			agentId: sessionState.agentId
		});
		const isDefaultSelection = selection.provider === resolvedDefault.provider && selection.model === resolvedDefault.model;
		try {
			await patchSessionEntry({
				storePath,
				sessionKey: sessionState.sessionKey,
				fallbackEntry: {
					sessionId: randomUUID(),
					updatedAt: Date.now()
				},
				replaceEntry: true,
				update: (entry) => {
					applyModelOverrideToSessionEntry({
						entry,
						selection: {
							provider: selection.provider,
							model: selection.model,
							isDefault: isDefaultSelection
						}
					});
					return entry;
				}
			});
		} catch (err) {
			if (err instanceof ModelSelectionLockedError) {
				try {
					await editMessageWithButtons(`❌ ${err.message}`, []);
				} catch (editErr) {
					throw new TelegramRetryableCallbackError(editErr);
				}
				return true;
			}
			throw new TelegramRetryableCallbackError(err);
		}
		const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		await editMessageWithButtons(`✅ Model ${isDefaultSelection ? "reset to default" : `changed to <b>${escapeHtml(selection.provider)}/${escapeHtml(selection.model)}</b>`}\n\n${isDefaultSelection ? "Session selection cleared. Runtime unchanged. New replies use the agent's configured default." : `Session-only model selection. Runtime unchanged. Use /model ${escapeHtml(selection.provider)}/${escapeHtml(selection.model)} --runtime &lt;runtime&gt; to switch harnesses. The agent default in openclaw.json is unchanged; /reset or a new session may return to that default.`}`, [], { parse_mode: "HTML" });
	} catch (err) {
		if (err instanceof TelegramRetryableCallbackError) throw err;
		await editMessageWithButtons(`❌ Failed to change model: ${String(err)}`, []);
	}
	return true;
}
//#endregion
//#region extensions/telegram/src/bot-handlers.callback-questions.runtime.ts
async function handleTelegramQuestionCallback(params) {
	let result;
	try {
		result = await (params.resolveQuestion ?? questionGatewayRuntime.resolveOption)({
			cfg: params.cfg,
			questionId: params.callback.questionId,
			optionIndex: params.callback.optionIndex,
			senderId: params.senderId,
			clientDisplayName: "Telegram question"
		});
	} catch (error) {
		await params.feedback("Could not submit this answer.", false).catch(() => {});
		throw error;
	}
	await params.feedback(result.status === "answered" ? "Answer submitted." : "This question was already answered.", true).catch(() => {});
}
//#endregion
//#region extensions/telegram/src/bot-native-command-deps.runtime.ts
const defaultTelegramNativeCommandDeps = {
	get getRuntimeConfig() {
		return getRuntimeConfig;
	},
	get readChannelAllowFromStore() {
		return readChannelAllowFromStore;
	},
	get dispatchReplyWithBufferedBlockDispatcher() {
		return dispatchReplyWithBufferedBlockDispatcher;
	},
	get listSkillCommandsForAgents() {
		return listSkillCommandsForAgents;
	},
	get syncTelegramMenuCommands() {
		return syncTelegramMenuCommands;
	},
	get getPluginCommandSpecs() {
		return getPluginCommandSpecs;
	},
	async runModelsAuthLoginFlow(opts) {
		const { runModelsAuthLoginFlow } = await import("./plugin-sdk/provider-auth-login-flow-runtime.js");
		return await runModelsAuthLoginFlow(opts);
	},
	async editMessageTelegram(...args) {
		const { editMessageTelegram } = await loadTelegramSendModule();
		return await editMessageTelegram(...args);
	}
};
//#endregion
//#region extensions/telegram/src/bot-native-commands.ts
const EMPTY_RESPONSE_FALLBACK = "No response generated. Please try again.";
const activeTelegramCodexLoginFlows = /* @__PURE__ */ new Map();
function resolveTelegramCodexLoginProviderInput(commandArgs) {
	const providerValue = commandArgs?.values?.provider;
	return typeof providerValue === "string" && providerValue.trim() ? providerValue : commandArgs?.raw ?? "codex";
}
function buildTelegramCodexLoginFlowKey(params) {
	const threadKey = params.threadSpec.id == null ? params.threadSpec.scope : `${params.threadSpec.scope}:${params.threadSpec.id}`;
	return [
		"telegram",
		params.accountId,
		String(params.chatId),
		threadKey,
		params.agentId,
		params.provider
	].join(":");
}
function buildTelegramCommandMenuModelContext(params) {
	return {
		provider: params.provider,
		model: params.model,
		...params.thinkingLevel ? { thinkingLevel: params.thinkingLevel } : {},
		...params.fastMode !== void 0 ? { fastMode: params.fastMode } : {}
	};
}
const loadTelegramNativeCommandDeliveryRuntime = createLazyRuntimeModule(() => import("./bot-native-commands.delivery.runtime.js"));
const loadTelegramNativeCommandRuntime = createLazyRuntimeModule(() => import("./bot-native-commands.runtime.js"));
function resolveTelegramCommandSessionFile(params) {
	const sqliteMarker = formatSqliteSessionFileMarker({
		agentId: params.agentId,
		sessionId: params.sessionId,
		storePath: params.storePath
	});
	const explicitSessionFile = params.sessionFile?.trim();
	if (explicitSessionFile === sqliteMarker) return explicitSessionFile;
	return sqliteMarker;
}
function resolveTelegramProgressPlaceholder(command) {
	const text = command.nativeProgressMessages?.telegram?.trim() ?? command.nativeProgressMessages?.default?.trim();
	return text ? text : null;
}
async function resolveTelegramCommandTranscriptContext(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return {};
	try {
		const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
		const entry = getSessionEntry({
			agentId: params.agentId,
			sessionKey,
			storePath
		});
		const sessionId = entry?.sessionId?.trim() || randomUUID();
		const sessionFile = resolveTelegramCommandSessionFile({
			agentId: params.agentId,
			sessionFile: entry?.sessionFile,
			sessionId,
			storePath
		});
		const authProfileId = normalizeOptionalString(entry?.authProfileOverride);
		return {
			sessionId,
			sessionFile,
			...authProfileId ? { authProfileId } : {}
		};
	} catch {
		return {};
	}
}
function resolveTelegramCommandMenuModelContext(params) {
	if (!params.sessionKey.trim()) return {};
	try {
		const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
		const defaultModel = resolveDefaultModelForAgent({
			cfg: params.cfg,
			agentId: params.agentId
		});
		const entry = getSessionEntry({
			storePath,
			sessionKey: params.sessionKey
		});
		const thinkingLevel = normalizeOptionalString(entry?.thinkingLevel);
		const fastMode = entry?.fastMode;
		let context;
		if (entry?.modelOverrideSource === "auto" && normalizeOptionalString(entry.modelOverride)) context = buildTelegramCommandMenuModelContext({
			provider: defaultModel.provider,
			model: defaultModel.model,
			...thinkingLevel ? { thinkingLevel } : {},
			...fastMode !== void 0 ? { fastMode } : {}
		});
		else {
			const override = resolveStoredModelOverride({
				sessionEntry: entry,
				loadSessionEntry: (sessionKey) => getSessionEntry({
					storePath,
					sessionKey
				}),
				sessionKey: params.sessionKey,
				defaultProvider: defaultModel.provider
			});
			if (override?.model) context = buildTelegramCommandMenuModelContext({
				provider: override.provider || defaultModel.provider,
				model: override.model,
				...thinkingLevel ? { thinkingLevel } : {},
				...fastMode !== void 0 ? { fastMode } : {}
			});
			else {
				const provider = normalizeOptionalString(entry?.providerOverride) ?? normalizeOptionalString(entry?.modelProvider);
				const model = normalizeOptionalString(entry?.modelOverride) ?? normalizeOptionalString(entry?.model);
				context = {
					...provider ? { provider } : {},
					...model ? { model } : {},
					...thinkingLevel ? { thinkingLevel } : {},
					...fastMode !== void 0 ? { fastMode } : {}
				};
			}
		}
		return {
			...context,
			agentRuntime: resolveEffectiveAgentRuntime({
				cfg: params.cfg,
				provider: context.provider ?? defaultModel.provider,
				modelId: context.model ?? defaultModel.model,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				sessionEntry: entry
			})
		};
	} catch {
		return {};
	}
}
function resolveTelegramFastCommandModelContext(params) {
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const fallback = () => ({
		provider: defaultModel.provider,
		model: defaultModel.model
	});
	if (!params.sessionKey.trim()) return fallback();
	try {
		const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
		const entry = getSessionEntry({
			storePath,
			sessionKey: params.sessionKey
		});
		if (entry?.modelOverrideSource === "auto" && normalizeOptionalString(entry.modelOverride)) return fallback();
		const override = resolveStoredModelOverride({
			sessionEntry: entry,
			loadSessionEntry: (sessionKey) => getSessionEntry({
				storePath,
				sessionKey
			}),
			sessionKey: params.sessionKey,
			defaultProvider: defaultModel.provider
		});
		return {
			provider: override?.provider ?? defaultModel.provider,
			model: override?.model ?? defaultModel.model
		};
	} catch {
		return fallback();
	}
}
function resolveTelegramFastCommandState(params) {
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const fallback = () => resolveFastModeState({
		cfg: params.cfg,
		provider: defaultModel.provider,
		model: defaultModel.model,
		agentId: params.agentId
	});
	if (!params.sessionKey.trim()) return fallback();
	try {
		const entry = getSessionEntry({
			storePath: resolveStorePath(params.cfg.session?.store, { agentId: params.agentId }),
			sessionKey: params.sessionKey
		});
		const modelContext = resolveTelegramFastCommandModelContext(params);
		return resolveFastModeState({
			cfg: params.cfg,
			provider: modelContext.provider ?? defaultModel.provider,
			model: modelContext.model ?? defaultModel.model,
			agentId: params.agentId,
			sessionEntry: entry?.fastMode !== void 0 ? { fastMode: entry.fastMode } : void 0
		});
	} catch {
		return fallback();
	}
}
async function resolveTelegramThinkMenuCurrentLevel(params) {
	const explicit = normalizeOptionalString(params.thinkingLevel);
	if (explicit) return explicit;
	const agentThinkingDefault = normalizeOptionalString(resolveAgentConfig(params.cfg, params.agentId)?.thinkingDefault);
	if (agentThinkingDefault) return agentThinkingDefault;
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	return await resolveThinkingDefaultWithRuntimeCatalog({
		cfg: params.cfg,
		provider: params.provider ?? defaultModel.provider,
		model: params.model ?? defaultModel.model,
		agentRuntime: params.agentRuntime,
		loadRuntimeCatalog: async () => params.catalog
	});
}
function formatTelegramCommandArgMenuTitle(params) {
	const title = formatCommandArgMenuTitle({
		command: params.command,
		menu: params.menu
	});
	if (params.command.key === "think" && params.currentThinkingLevel) return `Current thinking level: ${params.currentThinkingLevel}.\n${title}`;
	if (params.command.key === "fast" && params.currentFastModeStatus) {
		const options = params.menu.choices.map((choice) => choice.label.trim()).filter(Boolean).join(", ");
		return options ? `${params.currentFastModeStatus}\nOptions: ${options}.` : params.currentFastModeStatus;
	}
	return title;
}
function resolveTelegramFastMenuCurrentStatus(params) {
	return formatFastModeCurrentStatus({
		mode: params.state.mode,
		source: params.state.source,
		fastAutoOnSeconds: params.state.fastAutoOnSeconds
	});
}
function resolveTelegramNativeReplyChannelData(result) {
	return result.channelData?.telegram;
}
function normalizeTelegramNativeReplyPayload(result) {
	return result && typeof result === "object" ? result : {};
}
function isSuppressedTelegramNativeReplyPayload(result) {
	return result.suppressReply === true;
}
function hasTelegramNativeReplyReaction(result) {
	const reactionEmoji = resolveTelegramNativeReplyChannelData(result)?.reaction?.emoji;
	return typeof reactionEmoji === "string" && reactionEmoji.trim().length > 0;
}
function hasRenderableTelegramNativeReplyPayload(result) {
	const { channelData: _channelData, ...portableContent } = result;
	if (hasOutboundReplyContent(portableContent, { trimText: true })) return true;
	const telegramData = resolveTelegramNativeReplyChannelData(result);
	return Boolean(buildInlineKeyboard(telegramData?.buttons) || hasTelegramNativeReplyReaction(result));
}
function isEditableTelegramProgressResult(result) {
	const telegramData = resolveTelegramNativeReplyChannelData(result);
	return Boolean(typeof result.text === "string" && result.text.trim() && !result.mediaUrl && (!result.mediaUrls || result.mediaUrls.length === 0) && !result.presentation && !result.interactive && !result.btw && !hasTelegramNativeReplyReaction(result) && telegramData?.pin !== true);
}
async function cleanupTelegramProgressPlaceholder(params) {
	const progressMessageId = params.progressMessageId;
	if (progressMessageId == null) return;
	try {
		await withTelegramApiErrorLogging({
			operation: "deleteMessage",
			runtime: params.runtime,
			fn: () => params.bot.api.deleteMessage(params.chatId, progressMessageId)
		});
	} catch {}
}
async function resolveTelegramNativeCommandThreadContext(params) {
	const { msg, bot } = params;
	const chatId = msg.chat.id;
	const isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
	const messageThreadId = msg.message_thread_id;
	const getChat = typeof bot.api.getChat === "function" ? bot.api.getChat.bind(bot.api) : void 0;
	const isForum = await resolveTelegramForumFlag({
		chatId,
		chatType: msg.chat.type,
		isGroup,
		isForum: extractTelegramForumFlag(msg.chat),
		isTopicMessage: msg.is_topic_message,
		getChat
	});
	const threadSpec = resolveTelegramThreadSpec({
		isGroup,
		isForum,
		messageThreadId
	});
	return {
		chatId,
		isGroup,
		isForum,
		messageThreadId,
		threadSpec,
		threadParams: buildTelegramThreadParams(threadSpec)
	};
}
function resolveTelegramNativeCommandDisableBlockStreaming(telegramCfg) {
	const blockStreamingEnabled = resolveChannelStreamingBlockEnabled(telegramCfg);
	return typeof blockStreamingEnabled === "boolean" ? !blockStreamingEnabled : void 0;
}
async function resolveTelegramCommandAuth(params) {
	const { msg, bot, cfg, accountId, telegramCfg, readChannelAllowFromStore, allowFrom, groupAllowFrom, resolveGroupPolicy, resolveTelegramGroupConfig, requireAuth } = params;
	const { chatId, isGroup, isForum, messageThreadId, threadParams } = await resolveTelegramNativeCommandThreadContext({
		msg,
		bot
	});
	const senderId = msg.from?.id ? String(msg.from.id) : "";
	const senderUsername = msg.from?.username ?? "";
	const commandsAllowFromConfigured = isTelegramCommandsAllowFromConfigured(cfg);
	const preContextCommandsAllowFromAccess = commandsAllowFromConfigured ? resolveTelegramCommandAuthorization({
		cfg,
		accountId,
		chatId,
		isGroup,
		senderId,
		senderUsername
	}) : null;
	const { resolvedThreadId, dmThreadId, storeAllowFrom, groupConfig, topicConfig, groupAllowOverride, effectiveGroupAllow, hasGroupAllowOverride } = await resolveTelegramGroupAllowFromContext({
		cfg,
		chatId,
		accountId,
		dmPolicy: telegramCfg.dmPolicy,
		allowFrom,
		senderId,
		isGroup,
		isForum,
		messageThreadId,
		groupAllowFrom,
		skipPairingStoreRead: Boolean(preContextCommandsAllowFromAccess?.isAuthorizedSender),
		readChannelAllowFromStore,
		resolveTelegramGroupConfig
	});
	const effectiveDmPolicy = resolveTelegramEffectiveDmPolicy({
		isGroup,
		groupConfig,
		dmPolicy: telegramCfg.dmPolicy
	});
	const requireTopic = !isGroup && groupConfig && "requireTopic" in groupConfig ? groupConfig.requireTopic : void 0;
	if (!isGroup && requireTopic === true && dmThreadId == null) {
		logVerbose(`Blocked telegram command in DM ${chatId}: requireTopic=true but no topic present`);
		return null;
	}
	const dmAllowFrom = groupAllowOverride ?? allowFrom;
	const commandsAllowFromAccess = commandsAllowFromConfigured ? resolveTelegramCommandAuthorization({
		cfg,
		accountId,
		chatId,
		isGroup,
		resolvedThreadId,
		senderId,
		senderUsername
	}) : null;
	const ownerAccess = resolveTelegramCommandAuthorization({
		cfg,
		accountId,
		chatId,
		isGroup,
		resolvedThreadId,
		senderId,
		senderUsername
	});
	const sendAuthMessage = async (text) => {
		await withTelegramApiErrorLogging({
			operation: "sendMessage",
			fn: () => bot.api.sendMessage(chatId, text, threadParams ?? {})
		});
		return null;
	};
	const rejectNotAuthorized = async () => {
		return await sendAuthMessage("You are not authorized to use this command.");
	};
	const baseAccess = evaluateTelegramGroupBaseAccess({
		isGroup,
		groupConfig,
		topicConfig,
		hasGroupAllowOverride,
		effectiveGroupAllow,
		senderId,
		senderUsername,
		enforceAllowOverride: requireAuth,
		requireSenderForAllowOverride: true
	});
	if (!baseAccess.allowed) {
		if (baseAccess.reason === "group-disabled") return await sendAuthMessage("This group is disabled.");
		if (baseAccess.reason === "topic-disabled") return await sendAuthMessage("This topic is disabled.");
		return await rejectNotAuthorized();
	}
	const policyAccess = evaluateTelegramGroupPolicyAccess({
		isGroup,
		chatId,
		cfg,
		telegramCfg,
		topicConfig,
		groupConfig,
		effectiveGroupAllow,
		senderId,
		senderUsername,
		resolveGroupPolicy,
		enforcePolicy: cfg.commands?.useAccessGroups !== false,
		useTopicAndGroupOverrides: false,
		enforceAllowlistAuthorization: requireAuth && !commandsAllowFromConfigured,
		allowEmptyAllowlistEntries: true,
		requireSenderForAllowlistAuthorization: true,
		checkChatAllowlist: cfg.commands?.useAccessGroups !== false
	});
	if (!policyAccess.allowed) {
		if (policyAccess.reason === "group-policy-disabled") return await sendAuthMessage("Telegram group commands are disabled.");
		if (policyAccess.reason === "group-policy-allowlist-no-sender" || policyAccess.reason === "group-policy-allowlist-unauthorized") return await rejectNotAuthorized();
		if (policyAccess.reason === "group-chat-not-allowed") return await sendAuthMessage("This group is not allowed.");
	}
	const dmAllow = normalizeDmAllowFromWithStore({
		allowFrom: await expandTelegramAllowFromWithAccessGroups({
			cfg,
			allowFrom: dmAllowFrom,
			accountId,
			senderId
		}),
		storeAllowFrom: isGroup ? [] : storeAllowFrom,
		dmPolicy: effectiveDmPolicy
	});
	const commandAuthorized = commandsAllowFromConfigured ? Boolean(commandsAllowFromAccess?.isAuthorizedSender) : (await resolveTelegramCommandIngressAuthorization({
		accountId,
		cfg,
		dmPolicy: effectiveDmPolicy,
		isGroup,
		chatId,
		resolvedThreadId,
		senderId,
		effectiveDmAllow: dmAllow,
		effectiveGroupAllow,
		ownerAccess,
		eventKind: "native-command"
	})).authorized;
	if (requireAuth && !commandAuthorized) return await rejectNotAuthorized();
	return {
		chatId,
		isGroup,
		isForum,
		resolvedThreadId,
		senderId,
		senderUsername,
		groupConfig,
		topicConfig,
		commandAuthorized,
		senderIsOwner: ownerAccess.senderIsOwner
	};
}
const registerTelegramNativeCommands = ({ bot, cfg, runtime, accountId, telegramCfg, mediaMaxBytes, nativeEnabled, nativeSkillsEnabled, nativeDisabledExplicit, resolveGroupPolicy, resolveTelegramGroupConfig, shouldSkipUpdate, telegramDeps = defaultTelegramNativeCommandDeps, opts }) => {
	const boundRoute = nativeEnabled && nativeSkillsEnabled ? resolveAgentRoute({
		cfg,
		channel: "telegram",
		accountId
	}) : null;
	if (nativeEnabled && nativeSkillsEnabled && !boundRoute) runtime.log?.("nativeSkillsEnabled is true but no agent route is bound for this Telegram account; skill commands will not appear in the native menu.");
	const skillCommands = nativeEnabled && nativeSkillsEnabled && boundRoute ? telegramDeps.listSkillCommandsForAgents({
		cfg,
		agentIds: [boundRoute.agentId]
	}) : [];
	const pluginCommandSpecs = (telegramDeps.getPluginCommandSpecs ?? defaultTelegramNativeCommandDeps.getPluginCommandSpecs)?.("telegram", { config: cfg }) ?? [];
	const resolveTelegramMenuCommandCatalog = (activeSkillCommands, reservedSkillCommands = activeSkillCommands) => {
		const nativeCommands = nativeEnabled ? listNativeCommandSpecsForConfig(cfg, {
			skillCommands: activeSkillCommands,
			provider: "telegram"
		}) : [];
		const reservedCommands = new Set(listNativeCommandSpecs().map((command) => normalizeTelegramCommandName(command.name)));
		for (const command of reservedSkillCommands) reservedCommands.add(normalizeLowercaseStringOrEmpty(command.name));
		const customResolution = resolveTelegramCustomCommands({
			commands: telegramCfg.customCommands,
			reservedCommands
		});
		for (const issue of customResolution.issues) runtime.error?.(danger(issue.message));
		const customCommands = customResolution.commands;
		const existingCommands = new Set([...nativeCommands.map((command) => normalizeTelegramCommandName(command.name)), ...customCommands.map((command) => command.command)].map((command) => normalizeLowercaseStringOrEmpty(command)));
		for (const command of reservedSkillCommands) existingCommands.add(normalizeTelegramCommandName(command.name));
		const pluginCatalog = buildPluginTelegramMenuCommands({
			specs: pluginCommandSpecs,
			existingCommands
		});
		for (const issue of pluginCatalog.issues) runtime.error?.(danger(issue));
		return {
			nativeCommands,
			customCommands,
			pluginCatalog,
			...buildCappedTelegramMenuCommands({ allCommands: [
				...nativeCommands.map((command) => {
					const normalized = normalizeTelegramCommandName(command.name);
					if (!TELEGRAM_COMMAND_NAME_PATTERN.test(normalized)) {
						runtime.error?.(danger(`Native command "${command.name}" is invalid for Telegram (resolved to "${normalized}"). Skipping.`));
						return null;
					}
					const menuCommand = {
						command: normalized,
						description: command.description
					};
					if (command.isAlias) menuCommand.isAlias = true;
					if (command.descriptionLocalizations) menuCommand.descriptionLocalizations = command.descriptionLocalizations;
					return menuCommand;
				}).filter((cmd) => cmd !== null),
				...nativeEnabled ? pluginCatalog.commands : [],
				...customCommands
			] })
		};
	};
	const fullCommandCatalog = resolveTelegramMenuCommandCatalog(skillCommands);
	let menuCommandCatalog = fullCommandCatalog;
	if (nativeEnabled && nativeSkillsEnabled && skillCommands.length > 0 && fullCommandCatalog.overflowCount > 0) {
		const initialCommandCount = fullCommandCatalog.totalCommands;
		menuCommandCatalog = resolveTelegramMenuCommandCatalog([], skillCommands);
		runtime.log?.(`${initialCommandCount} commands exceed the ${fullCommandCatalog.maxCommands}-command Telegram limit; removing per-skill commands and keeping /skill.`);
	}
	const { nativeCommands, pluginCatalog } = fullCommandCatalog;
	const loadFreshRuntimeConfig = () => telegramDeps.getRuntimeConfig();
	const resolveFreshTelegramConfig = (runtimeCfg) => resolveTelegramAccount({
		cfg: runtimeCfg,
		accountId
	}).config;
	const { commandsToRegister, totalCommands, maxCommands, overflowCount, maxTotalChars, descriptionTrimmed, textBudgetDropCount } = menuCommandCatalog;
	if (overflowCount > 0) runtime.log?.(`Telegram limits bots to ${maxCommands} commands. ${totalCommands} configured; registering first ${maxCommands}. Use channels.telegram.commands.native: false to disable, or reduce plugin/skill/custom commands.`);
	if (descriptionTrimmed) runtime.log?.(`Telegram menu text exceeded the conservative ${maxTotalChars}-character payload budget; shortening descriptions to keep ${commandsToRegister.length} commands visible.`);
	if (textBudgetDropCount > 0) runtime.log?.(`Telegram menu text still exceeded the conservative ${maxTotalChars}-character payload budget after shortening descriptions; registering first ${commandsToRegister.length} commands.`);
	(telegramDeps.syncTelegramMenuCommands ?? syncTelegramMenuCommands)({
		bot,
		runtime,
		commandsToRegister,
		accountId,
		botIdentity: opts.token
	});
	const resolveCommandRuntimeContext = async (params) => {
		const { msg, runtimeCfg, isGroup, isForum, resolvedThreadId, senderId, topicAgentId } = params;
		const chatId = msg.chat.id;
		const messageThreadId = msg.message_thread_id;
		const threadSpec = resolveTelegramThreadSpec({
			isGroup,
			isForum,
			messageThreadId: resolvedThreadId ?? messageThreadId
		});
		const { route, bindingMode } = resolveTelegramConversationRoute({
			cfg: runtimeCfg,
			accountId,
			chatId,
			isGroup,
			resolvedThreadId,
			replyThreadId: threadSpec.id,
			senderId,
			topicAgentId
		});
		const nativeCommandRuntime = await loadTelegramNativeCommandRuntime();
		if (bindingMode.kind === "configured") {
			const ensured = await nativeCommandRuntime.ensureConfiguredBindingRouteReady({
				cfg: runtimeCfg,
				bindingResolution: bindingMode.binding
			});
			if (!ensured.ok) {
				logVerbose(`telegram native command: configured ACP binding unavailable for topic ${bindingMode.binding.record.conversation.conversationId}: ${ensured.error}`);
				await withTelegramApiErrorLogging({
					operation: "sendMessage",
					runtime,
					fn: () => bot.api.sendMessage(chatId, "Configured ACP binding is unavailable right now. Please try again.", buildTelegramThreadParams(threadSpec) ?? {})
				});
				return null;
			}
		}
		return {
			chatId,
			threadSpec,
			route,
			mediaLocalRoots: nativeCommandRuntime.getAgentScopedMediaLocalRoots(runtimeCfg, route.agentId),
			tableMode: resolveMarkdownTableMode({
				cfg: runtimeCfg,
				channel: "telegram",
				accountId: route.accountId,
				supportsBlockTables: true
			}),
			chunkMode: nativeCommandRuntime.resolveChunkMode(runtimeCfg, "telegram", route.accountId)
		};
	};
	const buildCommandDeliveryBaseOptions = (params) => ({
		cfg: params.cfg,
		chatId: String(params.chatId),
		accountId: params.accountId,
		sessionKeyForInternalHooks: params.sessionKeyForInternalHooks,
		policySessionKey: params.policySessionKey,
		mirrorIsGroup: params.mirrorIsGroup,
		mirrorGroupId: params.mirrorGroupId,
		token: opts.token,
		runtime,
		bot,
		mediaLocalRoots: params.mediaLocalRoots,
		mediaMaxBytes,
		replyToMode: params.replyToMode,
		textLimit: params.textLimit,
		thread: params.threadSpec,
		tableMode: params.tableMode,
		chunkMode: params.chunkMode,
		linkPreview: params.linkPreview,
		richMessages: params.richMessages
	});
	const resolveCommandTargetSessionKey = (params) => {
		const baseSessionKey = resolveTelegramConversationBaseSessionKey({
			cfg: params.runtimeCfg,
			route: params.route,
			chatId: params.chatId,
			isGroup: params.isGroup,
			senderId: params.senderId
		});
		const dmThreadId = params.threadSpec.scope === "dm" ? params.threadSpec.id : void 0;
		return (shouldUseTelegramDmThreadSession({
			dmThreadId,
			botHasTopicsEnabled: params.botHasTopicsEnabled
		}) && dmThreadId != null ? params.resolveThreadSessionKeys({
			baseSessionKey,
			threadId: `${params.chatId}:${dmThreadId}`
		}) : null)?.sessionKey ?? baseSessionKey;
	};
	if (commandsToRegister.length > 0 || pluginCatalog.commands.length > 0) {
		for (const command of nativeCommands) {
			const normalizedCommandName = normalizeTelegramCommandName(command.name);
			bot.command(normalizedCommandName, async (ctx) => {
				const msg = ctx.message;
				if (!msg) return;
				if (shouldSkipUpdate(ctx)) return;
				const runtimeCfg = loadFreshRuntimeConfig();
				const runtimeTelegramCfg = resolveFreshTelegramConfig(runtimeCfg);
				const turnSettings = resolveTelegramMessageTurnSettings({
					accountId,
					cfg: runtimeCfg,
					telegramCfg: runtimeTelegramCfg,
					opts
				});
				const auth = await resolveTelegramCommandAuth({
					msg,
					bot,
					cfg: runtimeCfg,
					accountId,
					telegramCfg: runtimeTelegramCfg,
					readChannelAllowFromStore: telegramDeps.readChannelAllowFromStore,
					allowFrom: turnSettings.allowFrom,
					groupAllowFrom: turnSettings.groupAllowFrom,
					resolveGroupPolicy,
					resolveTelegramGroupConfig,
					requireAuth: true
				});
				if (!auth) return;
				const { chatId, isGroup, isForum, resolvedThreadId, senderId, senderUsername, groupConfig, topicConfig, commandAuthorized, senderIsOwner } = auth;
				const runtimeContext = await resolveCommandRuntimeContext({
					msg,
					runtimeCfg,
					isGroup,
					isForum,
					resolvedThreadId,
					senderId,
					topicAgentId: topicConfig?.agentId
				});
				if (!runtimeContext) return;
				const { threadSpec, route, mediaLocalRoots, tableMode, chunkMode } = runtimeContext;
				const threadParams = buildTelegramThreadParams(threadSpec) ?? {};
				const originatingTo = buildTelegramRoutingTarget(chatId, threadSpec);
				const commandDefinition = findCommandByNativeName(command.name, "telegram");
				const rawText = ctx.match?.trim() ?? "";
				const commandArgs = commandDefinition ? parseCommandArgs(commandDefinition, rawText) : rawText ? { raw: rawText } : void 0;
				const prompt = commandDefinition ? buildCommandTextFromArgs(commandDefinition, commandArgs) : rawText ? `/${command.name} ${rawText}` : `/${command.name}`;
				if (commandDefinition?.key === "login") {
					const sendLoginMessage = async (text) => {
						await withTelegramApiErrorLogging({
							operation: "sendMessage",
							runtime,
							fn: () => bot.api.sendMessage(chatId, text, threadParams)
						});
					};
					if (!senderIsOwner || !codexChannelLoginRuntime.hasConfiguredCommandOwnerAllowlist(runtimeCfg)) {
						await sendLoginMessage("Only a configured OpenClaw owner can start Codex login from Telegram.");
						return;
					}
					if (isGroup) {
						await sendLoginMessage("For safety, Codex login codes are only sent in a private chat with this bot. DM this bot `/login codex` to pair Codex.");
						return;
					}
					const loginProvider = codexChannelLoginRuntime.resolveProvider(resolveTelegramCodexLoginProviderInput(commandArgs));
					if (!loginProvider) {
						await sendLoginMessage("Unsupported login provider. Use `/login codex`.");
						return;
					}
					const flowKey = buildTelegramCodexLoginFlowKey({
						accountId: route.accountId,
						chatId,
						threadSpec,
						agentId: route.agentId,
						provider: loginProvider
					});
					const reservation = codexChannelLoginRuntime.reserveFlow({
						flows: activeTelegramCodexLoginFlows,
						flowKey
					});
					if (reservation.status === "active") {
						await sendLoginMessage("A Codex login code is already active for this Telegram chat. Complete it, or wait for it to expire before requesting a new one.");
						return;
					}
					try {
						const loginFlow = telegramDeps.runModelsAuthLoginFlow ?? defaultTelegramNativeCommandDeps.runModelsAuthLoginFlow;
						if (!loginFlow) throw new Error("Codex login flow is unavailable.");
						const nativeCommandRuntime = await loadTelegramNativeCommandRuntime();
						const targetSessionKey = resolveCommandTargetSessionKey({
							runtimeCfg,
							route,
							chatId,
							isGroup,
							senderId,
							threadSpec,
							botHasTopicsEnabled: resolveTelegramBotHasTopicsEnabled(ctx.me),
							resolveThreadSessionKeys: nativeCommandRuntime.resolveThreadSessionKeys
						});
						const targetSessionEntry = nativeCommandRuntime.getSessionEntry({
							agentId: route.agentId,
							sessionKey: targetSessionKey
						});
						const nextProfileId = (await codexChannelLoginRuntime.runDeviceLoginFlow({
							runLoginFlow: loginFlow,
							provider: loginProvider,
							agentId: route.agentId,
							config: runtimeCfg,
							runtime,
							sendMessage: sendLoginMessage,
							unsupportedPromptMessage: "Telegram /login supports only fixed Codex device-code auth."
						})).profiles.find((profile) => profile.provider === loginProvider)?.profileId;
						if (!nextProfileId) {
							await sendLoginMessage("Codex login completed, but this Telegram session could not switch to the newly authenticated profile. Retry `/login codex`, or select the profile manually.");
							return;
						}
						const needsSessionUpdate = targetSessionEntry && (targetSessionEntry.authProfileOverride !== nextProfileId || targetSessionEntry.authProfileOverrideSource !== "user" || targetSessionEntry.authProfileOverrideCompactionCount !== void 0);
						if (targetSessionEntry) try {
							const storePath = resolveStorePath(runtimeCfg.session?.store, { agentId: route.agentId });
							let snapshotMatched = false;
							const persisted = await updateSessionStoreEntry({
								sessionKey: targetSessionKey,
								storePath,
								requireWriteSuccess: true,
								skipMaintenance: true,
								update: (entry) => {
									if (entry.sessionId !== targetSessionEntry.sessionId || entry.authProfileOverride !== targetSessionEntry.authProfileOverride || entry.authProfileOverrideSource !== targetSessionEntry.authProfileOverrideSource || entry.authProfileOverrideCompactionCount !== targetSessionEntry.authProfileOverrideCompactionCount) return null;
									snapshotMatched = true;
									return needsSessionUpdate ? {
										authProfileOverride: nextProfileId,
										authProfileOverrideSource: "user",
										authProfileOverrideCompactionCount: void 0
									} : null;
								}
							});
							if (!snapshotMatched || !persisted || persisted.authProfileOverride !== nextProfileId || persisted.authProfileOverrideSource !== "user" || persisted.authProfileOverrideCompactionCount !== void 0) {
								await sendLoginMessage("Codex login completed, but this Telegram session could not switch to the newly authenticated profile. Retry `/login codex`, or select the profile manually.");
								return;
							}
						} catch (error) {
							runtime.error?.(danger(`telegram /login codex completed but failed to update session auth profile: ${String(error)}`));
							await sendLoginMessage("Codex login completed, but this Telegram session could not switch to the newly authenticated profile. Retry `/login codex`, or select the profile manually.");
							return;
						}
						await sendLoginMessage("Codex login complete. Try your request again now.");
					} catch {
						runtime.error?.(danger("telegram /login codex failed"));
						await sendLoginMessage("Codex login did not complete. Send `/login codex` to request a new code.");
					} finally {
						codexChannelLoginRuntime.releaseFlow({
							flows: activeTelegramCodexLoginFlows,
							flowKey,
							record: reservation.record
						});
					}
					return;
				}
				let cachedTargetSessionKey;
				let cachedNativeCommandRuntime;
				const resolveNativeCommandRuntime = async () => {
					cachedNativeCommandRuntime ??= await loadTelegramNativeCommandRuntime();
					return cachedNativeCommandRuntime;
				};
				const resolveTargetSessionKey = async () => {
					if (cachedTargetSessionKey) return cachedTargetSessionKey;
					cachedTargetSessionKey = resolveCommandTargetSessionKey({
						runtimeCfg,
						route,
						chatId,
						isGroup,
						senderId,
						threadSpec,
						botHasTopicsEnabled: resolveTelegramBotHasTopicsEnabled(ctx.me),
						resolveThreadSessionKeys: (await resolveNativeCommandRuntime()).resolveThreadSessionKeys
					});
					return cachedTargetSessionKey;
				};
				const menuNeedsModelContext = commandDefinition?.argsMenu && !(commandArgs?.raw && !commandArgs.values) && commandDefinition.args?.some((arg) => typeof arg.choices === "function" && commandArgs?.values?.[arg.name] == null);
				const targetSessionKeyForMenu = commandDefinition && menuNeedsModelContext ? await resolveTargetSessionKey() : "";
				const fastCommandState = commandDefinition?.key === "fast" && menuNeedsModelContext ? resolveTelegramFastCommandState({
					cfg: runtimeCfg,
					agentId: route.agentId,
					sessionKey: targetSessionKeyForMenu
				}) : void 0;
				const fastMenuModelContext = commandDefinition?.key === "fast" && menuNeedsModelContext ? resolveTelegramFastCommandModelContext({
					cfg: runtimeCfg,
					agentId: route.agentId,
					sessionKey: targetSessionKeyForMenu
				}) : void 0;
				const menuModelContext = commandDefinition && menuNeedsModelContext ? fastMenuModelContext ?? resolveTelegramCommandMenuModelContext({
					cfg: runtimeCfg,
					agentId: route.agentId,
					sessionKey: targetSessionKeyForMenu
				}) : {};
				const menuModelCatalog = commandDefinition?.key === "think" && menuNeedsModelContext ? await loadPreparedModelCatalog({
					config: runtimeCfg,
					agentId: route.agentId,
					agentDir: resolveAgentDir(runtimeCfg, route.agentId),
					readOnly: true
				}) : void 0;
				const menu = commandDefinition ? resolveCommandArgMenu({
					command: commandDefinition,
					args: commandArgs,
					cfg: runtimeCfg,
					...menuModelContext,
					...menuModelCatalog?.length ? { catalog: menuModelCatalog } : {}
				}) : null;
				if (menu && commandDefinition) {
					const title = formatTelegramCommandArgMenuTitle({
						command: commandDefinition,
						menu,
						currentThinkingLevel: commandDefinition.key === "think" ? await resolveTelegramThinkMenuCurrentLevel({
							cfg: runtimeCfg,
							agentId: route.agentId,
							...menuModelContext,
							catalog: menuModelCatalog ?? []
						}) : void 0,
						currentFastModeStatus: commandDefinition.key === "fast" ? resolveTelegramFastMenuCurrentStatus({ state: fastCommandState ?? resolveTelegramFastCommandState({
							cfg: runtimeCfg,
							agentId: route.agentId,
							sessionKey: targetSessionKeyForMenu
						}) }) : void 0
					});
					const rows = [];
					for (let i = 0; i < menu.choices.length; i += 2) {
						const slice = menu.choices.slice(i, i + 2);
						rows.push(slice.map((choice) => {
							const args = { values: { [menu.arg.name]: choice.value } };
							return {
								text: choice.label,
								callback_data: buildTelegramNativeCommandCallbackData(buildCommandTextFromArgs(commandDefinition, args))
							};
						}));
					}
					const replyMarkup = buildInlineKeyboard(rows);
					await withTelegramApiErrorLogging({
						operation: "sendMessage",
						runtime,
						fn: () => bot.api.sendMessage(chatId, title, {
							...replyMarkup ? { reply_markup: replyMarkup } : {},
							...threadParams
						})
					});
					return;
				}
				const nativeCommandRuntime = await resolveNativeCommandRuntime();
				const sessionKey = await resolveTargetSessionKey();
				const { skillFilter, groupSystemPrompt } = resolveTelegramGroupPromptSettings({
					groupConfig,
					topicConfig
				});
				const { sessionKey: commandSessionKey, commandTargetSessionKey } = resolveNativeCommandSessionTargets({
					agentId: route.agentId,
					sessionPrefix: "telegram:slash",
					userId: String(senderId || chatId),
					targetSessionKey: sessionKey
				});
				const deliveryBaseOptions = buildCommandDeliveryBaseOptions({
					cfg: runtimeCfg,
					chatId,
					accountId: route.accountId,
					sessionKeyForInternalHooks: commandSessionKey,
					policySessionKey: commandTargetSessionKey,
					mirrorIsGroup: isGroup,
					mirrorGroupId: isGroup ? String(chatId) : void 0,
					mediaLocalRoots,
					threadSpec,
					tableMode,
					chunkMode,
					replyToMode: turnSettings.replyToMode,
					textLimit: turnSettings.textLimit,
					linkPreview: runtimeTelegramCfg.linkPreview,
					richMessages: runtimeTelegramCfg.richMessages
				});
				let topicName;
				if (isForum && resolvedThreadId != null) try {
					topicName = await getTopicName(chatId, resolvedThreadId, resolveTopicNameCacheScope(resolveStorePath(runtimeCfg.session?.store, { agentId: route.accountId })));
				} catch {}
				const conversationLabel = isGroup ? msg.chat.title ? `${msg.chat.title} id:${chatId}` : `group:${chatId}` : buildSenderName(msg) ?? String(senderId || chatId);
				const ctxPayload = nativeCommandRuntime.finalizeInboundContext({
					Body: prompt,
					BodyForAgent: prompt,
					RawBody: prompt,
					CommandBody: prompt,
					CommandArgs: commandArgs,
					From: isGroup ? buildTelegramGroupFrom(chatId, resolvedThreadId) : `telegram:${chatId}`,
					To: `slash:${senderId || chatId}`,
					ChatType: isGroup ? "group" : "direct",
					ConversationLabel: conversationLabel,
					GroupSubject: isGroup ? msg.chat.title ?? void 0 : void 0,
					GroupSystemPrompt: isGroup || !isGroup && groupConfig ? groupSystemPrompt : void 0,
					SenderName: buildSenderName(msg),
					SenderId: senderId || void 0,
					SenderUsername: senderUsername || void 0,
					Surface: "telegram",
					Provider: "telegram",
					MessageSid: String(msg.message_id),
					Timestamp: msg.date ? msg.date * 1e3 : void 0,
					WasMentioned: true,
					CommandAuthorized: commandAuthorized,
					CommandTurn: {
						kind: "native",
						source: "native",
						authorized: commandAuthorized,
						body: prompt
					},
					CommandSource: "native",
					SessionKey: commandSessionKey,
					AccountId: route.accountId,
					CommandTargetSessionKey: commandTargetSessionKey,
					MessageThreadId: threadSpec.id,
					IsForum: isForum,
					TopicName: isForum && topicName ? topicName : void 0,
					OriginatingChannel: "telegram",
					OriginatingTo: originatingTo
				});
				await nativeCommandRuntime.recordInboundSessionMetaSafe({
					cfg: runtimeCfg,
					agentId: route.agentId,
					sessionKey: commandTargetSessionKey,
					ctx: ctxPayload,
					onError: (err) => runtime.error?.(danger(`telegram slash: failed updating session meta: ${String(err)}`))
				});
				const disableBlockStreaming = resolveTelegramNativeCommandDisableBlockStreaming(runtimeTelegramCfg);
				const deliveryState = {
					delivered: false,
					skippedNonSilent: 0
				};
				const { createChannelMessageReplyPipeline, deliverReplies } = await loadTelegramNativeCommandDeliveryRuntime();
				const { onModelSelected, ...replyPipeline } = createChannelMessageReplyPipeline({
					cfg: runtimeCfg,
					agentId: route.agentId,
					channel: "telegram",
					accountId: route.accountId
				});
				await telegramDeps.dispatchReplyWithBufferedBlockDispatcher({
					ctx: ctxPayload,
					cfg: runtimeCfg,
					dispatcherOptions: {
						...replyPipeline,
						beforeDeliver: async (payload) => payload,
						deliver: async (payload, _info) => {
							if (shouldSuppressLocalTelegramExecApprovalPrompt({
								cfg: runtimeCfg,
								accountId: route.accountId,
								payload
							})) {
								deliveryState.delivered = true;
								return;
							}
							if ((await deliverReplies({
								replies: [payload.replyToId ? payload : {
									...payload,
									replyToId: String(msg.message_id)
								}],
								...deliveryBaseOptions,
								silent: runtimeTelegramCfg.silentErrorReplies === true && payload.isError === true
							})).delivered) deliveryState.delivered = true;
						},
						onSkip: (_payload, info) => {
							if (info.reason !== "silent") deliveryState.skippedNonSilent += 1;
						},
						onError: (err, info) => {
							runtime.error?.(danger(`telegram slash ${info.kind} reply failed: ${String(err)}`));
						}
					},
					replyOptions: {
						skillFilter,
						disableBlockStreaming,
						onModelSelected
					}
				});
				if (!deliveryState.delivered && deliveryState.skippedNonSilent > 0) await deliverReplies({
					replies: [{ text: EMPTY_RESPONSE_FALLBACK }],
					...deliveryBaseOptions
				});
			});
		}
		for (const pluginCommand of pluginCatalog.commands) bot.command(pluginCommand.command, async (ctx) => {
			const msg = ctx.message;
			if (!msg) return;
			if (shouldSkipUpdate(ctx)) return;
			const chatId = msg.chat.id;
			const runtimeCfg = loadFreshRuntimeConfig();
			const runtimeTelegramCfg = resolveFreshTelegramConfig(runtimeCfg);
			const turnSettings = resolveTelegramMessageTurnSettings({
				accountId,
				cfg: runtimeCfg,
				telegramCfg: runtimeTelegramCfg,
				opts
			});
			const { threadParams } = await resolveTelegramNativeCommandThreadContext({
				msg,
				bot
			});
			const rawText = ctx.match?.trim() ?? "";
			const commandBody = `/${pluginCommand.command}${rawText ? ` ${rawText}` : ""}`;
			const nativeCommandRuntime = await loadTelegramNativeCommandRuntime();
			const match = nativeCommandRuntime.matchPluginCommand(commandBody);
			if (!match) {
				await withTelegramApiErrorLogging({
					operation: "sendMessage",
					runtime,
					fn: () => bot.api.sendMessage(chatId, "Command not found.", threadParams ?? {})
				});
				return;
			}
			const auth = await resolveTelegramCommandAuth({
				msg,
				bot,
				cfg: runtimeCfg,
				accountId,
				telegramCfg: runtimeTelegramCfg,
				readChannelAllowFromStore: telegramDeps.readChannelAllowFromStore,
				allowFrom: turnSettings.allowFrom,
				groupAllowFrom: turnSettings.groupAllowFrom,
				resolveGroupPolicy,
				resolveTelegramGroupConfig,
				requireAuth: match.command.requireAuth !== false
			});
			if (!auth) return;
			const { senderId, commandAuthorized, senderIsOwner, isGroup, isForum, resolvedThreadId } = auth;
			const runtimeContext = await resolveCommandRuntimeContext({
				msg,
				runtimeCfg,
				isGroup,
				isForum,
				resolvedThreadId,
				senderId,
				topicAgentId: auth.topicConfig?.agentId
			});
			if (!runtimeContext) return;
			const { threadSpec, route, mediaLocalRoots, tableMode, chunkMode } = runtimeContext;
			const targetSessionKey = resolveCommandTargetSessionKey({
				runtimeCfg,
				route,
				chatId,
				isGroup,
				senderId,
				threadSpec,
				botHasTopicsEnabled: resolveTelegramBotHasTopicsEnabled(ctx.me),
				resolveThreadSessionKeys: nativeCommandRuntime.resolveThreadSessionKeys
			});
			const targetSessionEntry = nativeCommandRuntime.getSessionEntry({
				agentId: route.agentId,
				sessionKey: targetSessionKey
			});
			const deliveryBaseOptions = buildCommandDeliveryBaseOptions({
				cfg: runtimeCfg,
				chatId,
				accountId: route.accountId,
				sessionKeyForInternalHooks: targetSessionKey,
				policySessionKey: targetSessionKey,
				mirrorIsGroup: isGroup,
				mirrorGroupId: isGroup ? String(chatId) : void 0,
				mediaLocalRoots,
				threadSpec,
				tableMode,
				chunkMode,
				replyToMode: turnSettings.replyToMode,
				textLimit: turnSettings.textLimit,
				linkPreview: runtimeTelegramCfg.linkPreview,
				richMessages: runtimeTelegramCfg.richMessages
			});
			const from = isGroup ? buildTelegramGroupFrom(chatId, threadSpec.id) : `telegram:${chatId}`;
			const to = `telegram:${chatId}`;
			const { deliverReplies, emitTelegramMessageSentHooks } = await loadTelegramNativeCommandDeliveryRuntime();
			let progressMessageId;
			const progressPlaceholder = resolveTelegramProgressPlaceholder(match.command);
			if (progressPlaceholder) try {
				const maybeMessageId = (await withTelegramApiErrorLogging({
					operation: "sendMessage",
					runtime,
					fn: () => bot.api.sendMessage(chatId, progressPlaceholder, buildTelegramThreadParams(threadSpec))
				}))?.message_id;
				if (typeof maybeMessageId === "number") progressMessageId = maybeMessageId;
			} catch {}
			const transcriptContext = await resolveTelegramCommandTranscriptContext({
				cfg: runtimeCfg,
				agentId: route.agentId,
				sessionKey: targetSessionKey,
				threadId: threadSpec.id
			});
			const result = normalizeTelegramNativeReplyPayload(await nativeCommandRuntime.executePluginCommand({
				command: match.command,
				args: match.args,
				senderId,
				channel: "telegram",
				isAuthorizedSender: commandAuthorized,
				senderIsOwner,
				agentId: route.agentId,
				sessionKey: targetSessionKey,
				sessionId: transcriptContext.sessionId,
				sessionFile: transcriptContext.sessionFile,
				authProfileId: transcriptContext.authProfileId ?? targetSessionEntry?.authProfileOverride,
				commandBody,
				config: runtimeCfg,
				from,
				to,
				accountId,
				messageThreadId: threadSpec.id
			}));
			if (shouldSuppressLocalTelegramExecApprovalPrompt({
				cfg: runtimeCfg,
				accountId: route.accountId,
				payload: result
			}) || isSuppressedTelegramNativeReplyPayload(result)) {
				await cleanupTelegramProgressPlaceholder({
					bot,
					chatId,
					progressMessageId,
					runtime
				});
				return;
			}
			const hasReaction = hasTelegramNativeReplyReaction(result);
			const deliverableResult = hasRenderableTelegramNativeReplyPayload(result) ? hasReaction && !normalizeOptionalString(result.replyToId) ? {
				...result,
				replyToId: String(msg.message_id)
			} : result : { text: EMPTY_RESPONSE_FALLBACK };
			const progressResultText = typeof deliverableResult.text === "string" && deliverableResult.text.trim().length > 0 ? deliverableResult.text : null;
			const telegramResultData = resolveTelegramNativeReplyChannelData(deliverableResult);
			if (progressMessageId != null && telegramDeps.editMessageTelegram && progressResultText && isEditableTelegramProgressResult(deliverableResult)) try {
				await telegramDeps.editMessageTelegram(chatId, progressMessageId, progressResultText, {
					cfg: runtimeCfg,
					accountId: route.accountId,
					textMode: "markdown",
					linkPreview: runtimeTelegramCfg.linkPreview,
					buttons: telegramResultData?.buttons
				});
				recordSentMessage(chatId, progressMessageId, runtimeCfg);
				emitTelegramMessageSentHooks({
					sessionKeyForInternalHooks: targetSessionKey,
					chatId: String(chatId),
					accountId: route.accountId,
					content: progressResultText,
					success: true,
					messageId: progressMessageId,
					isGroup,
					groupId: isGroup ? String(chatId) : void 0
				});
				return;
			} catch {}
			await cleanupTelegramProgressPlaceholder({
				bot,
				chatId,
				progressMessageId,
				runtime
			});
			await deliverReplies({
				replies: [deliverableResult],
				...deliveryBaseOptions,
				...hasReaction ? { replyToMode: "all" } : {},
				silent: runtimeTelegramCfg.silentErrorReplies === true && deliverableResult.isError === true
			});
		});
	} else if (nativeDisabledExplicit) {
		withTelegramApiErrorLogging({
			operation: "setMyCommands",
			runtime,
			fn: () => bot.api.setMyCommands([])
		}).catch(() => {});
		withTelegramApiErrorLogging({
			operation: "setMyCommands(all_group_chats)",
			runtime,
			fn: () => bot.api.setMyCommands([], { scope: { type: "all_group_chats" } })
		}).catch(() => {});
	}
};
//#endregion
//#region extensions/telegram/src/callback-query-answer-state.ts
const TELEGRAM_CALLBACK_QUERY_ANSWER_PROMISE = Symbol.for("openclaw.telegram.callbackQueryAnswerPromise");
function setTelegramCallbackQueryAnswerPromise(ctx, promise) {
	Object.defineProperty(ctx, TELEGRAM_CALLBACK_QUERY_ANSWER_PROMISE, {
		configurable: true,
		value: promise
	});
}
function getTelegramCallbackQueryAnswerPromise(ctx) {
	const promise = ctx[TELEGRAM_CALLBACK_QUERY_ANSWER_PROMISE];
	return promise instanceof Promise ? promise : void 0;
}
//#endregion
//#region extensions/telegram/src/bot-handlers.callback.runtime.ts
function registerTelegramCallbackQueryHandler({ accountId, bot, runtime, telegramDeps, shouldSkipUpdate }, messageRuntime, authorizationRuntime) {
	const { buildSyntheticTextMessage, buildSyntheticContext, processMessageWithReplyChain } = messageRuntime;
	const { resolveTelegramEventAuthorizationContext, authorizeTelegramEventSender, isTelegramModelCallbackAuthorized } = authorizationRuntime;
	const getChat = bot.api.getChat.bind(bot.api);
	bot.on("callback_query", async (ctx) => {
		const callback = ctx.callbackQuery;
		if (!callback) return;
		let callbackAnswered = false;
		const answerCallbackQuery = async (text) => {
			await withTelegramApiErrorLogging({
				operation: "answerCallbackQuery",
				runtime,
				fn: () => text ? bot.api.answerCallbackQuery(callback.id, { text }) : bot.api.answerCallbackQuery(callback.id)
			}).catch(() => {});
			callbackAnswered = true;
		};
		if (shouldSkipUpdate(ctx)) {
			const earlyAnswerPromise = getTelegramCallbackQueryAnswerPromise(ctx);
			if (earlyAnswerPromise) await earlyAnswerPromise.catch(async () => await answerCallbackQuery());
			else await answerCallbackQuery();
			return;
		}
		const data = (callback.data ?? "").trim();
		const typedQuestionCallback = parseTelegramQuestionCallbackData(data);
		const earlyAnswerPromise = getTelegramCallbackQueryAnswerPromise(ctx);
		if (earlyAnswerPromise) try {
			await earlyAnswerPromise;
			callbackAnswered = true;
		} catch {
			await answerCallbackQuery();
		}
		else await answerCallbackQuery();
		try {
			const callbackMessage = callback.message;
			if (!data || !callbackMessage) return;
			const chatId = callbackMessage.chat.id;
			const isGroup = callbackMessage.chat.type === "group" || callbackMessage.chat.type === "supergroup";
			const nativeCallbackCommand = parseTelegramNativeCommandCallbackData(data);
			const opaqueCallbackData = parseTelegramOpaqueCallbackData(data);
			const genericCallbackText = data.startsWith("/") ? data : `callback_data: ${data}`;
			const callbackCommandText = nativeCallbackCommand ?? (opaqueCallbackData ? "" : genericCallbackText);
			const hasReservedApprovalPrefix = hasTelegramApprovalCallbackPrefix(data);
			const hasReservedQuestionPrefix = hasTelegramQuestionCallbackPrefix(data);
			const typedApprovalCallback = parseTelegramApprovalCallbackData(data);
			const legacyApprovalCallback = parseExecApprovalCommandText(nativeCallbackCommand ?? (opaqueCallbackData ? "" : data));
			const isRuntimeControlCallback = hasReservedApprovalPrefix || legacyApprovalCallback !== null || hasReservedQuestionPrefix;
			const authorizationCfg = telegramDeps.getRuntimeConfig();
			const inlineButtonsScope = resolveTelegramInlineButtonsScope({
				cfg: authorizationCfg,
				accountId
			});
			if (!isRuntimeControlCallback) {
				if (inlineButtonsScope === "off" || inlineButtonsScope === "dm" && isGroup || inlineButtonsScope === "group" && !isGroup) return;
			}
			const messageThreadId = callbackMessage.message_thread_id;
			const isForum = await resolveTelegramForumFlag({
				chatId,
				chatType: callbackMessage.chat.type,
				isGroup,
				isForum: callbackMessage.chat.is_forum,
				isTopicMessage: callbackMessage.is_topic_message,
				getChat
			});
			const senderId = callback.from?.id ? String(callback.from.id) : "";
			const senderUsername = callback.from?.username ?? "";
			const eventAuthContext = await resolveTelegramEventAuthorizationContext({
				cfg: authorizationCfg,
				chatId,
				isGroup,
				isForum,
				senderId,
				messageThreadId
			});
			const { resolvedThreadId, dmThreadId, storeAllowFrom, groupConfig } = eventAuthContext;
			const requireTopic = groupConfig?.requireTopic;
			if (!isGroup && requireTopic === true && dmThreadId == null) {
				logVerbose(`Blocked telegram callback in DM ${chatId}: requireTopic=true but no topic present`);
				return;
			}
			const authorizationMode = hasReservedQuestionPrefix ? "callback-runtime-allowlist" : !isGroup || !isRuntimeControlCallback && inlineButtonsScope === "allowlist" ? "callback-allowlist" : "callback-scope";
			if (!await authorizeTelegramEventSender({
				chatId,
				chatTitle: callbackMessage.chat.title,
				isGroup,
				senderId,
				senderUsername,
				mode: authorizationMode,
				context: eventAuthContext
			})) return;
			const callbackThreadId = resolvedThreadId ?? dmThreadId;
			const callbackConversationId = callbackThreadId != null ? `${chatId}:topic:${callbackThreadId}` : String(chatId);
			const runtimeCfg = telegramDeps.getRuntimeConfig();
			const actions = createTelegramCallbackMessageActions({
				bot,
				callbackMessage,
				isGroup,
				isForum
			});
			const approvalRuntime = createTelegramCallbackApprovalRuntime({
				accountId,
				telegramDeps,
				runtimeCfg,
				senderId,
				actions
			});
			const authorizeCallback = async () => await isTelegramModelCallbackAuthorized({
				chatId,
				isGroup,
				senderId,
				senderUsername,
				context: eventAuthContext
			});
			if (typedApprovalCallback) {
				await approvalRuntime.handleCanonical(typedApprovalCallback);
				return;
			}
			if (typedQuestionCallback) {
				await handleTelegramQuestionCallback({
					callback: typedQuestionCallback,
					cfg: runtimeCfg,
					senderId,
					feedback: async (text, terminal) => {
						if (terminal) await actions.clearCallbackButtons().catch(() => {});
						await actions.replyToCallbackChat(text);
					}
				});
				return;
			}
			if (hasReservedQuestionPrefix) return;
			if (hasReservedApprovalPrefix) {
				await approvalRuntime.handleMalformedReserved();
				return;
			}
			if (await handleTelegramInteractiveCallback({
				accountId,
				callback,
				ctx,
				callbackMessage,
				data,
				pluginCallbackData: opaqueCallbackData ?? data,
				callbackConversationId,
				callbackThreadId,
				senderId,
				senderUsername,
				isGroup,
				isForum,
				storeAllowFrom,
				actions,
				messageRuntime,
				authorizeCallback
			})) return;
			if (legacyApprovalCallback) {
				await approvalRuntime.handleLegacy(legacyApprovalCallback);
				return;
			}
			if (opaqueCallbackData) return;
			if (await handleTelegramModelCallback({
				data,
				ctx,
				chatId,
				isGroup,
				isForum,
				messageThreadId,
				resolvedThreadId,
				senderId,
				runtimeCfg,
				telegramDeps,
				actions,
				messageRuntime,
				authorizeCallback
			})) return;
			const syntheticMessage = buildSyntheticTextMessage({
				base: withResolvedTelegramForumFlag(callbackMessage, isForum),
				from: callback.from,
				text: callbackCommandText
			});
			const syntheticCtx = buildSyntheticContext(ctx, syntheticMessage);
			await processMessageWithReplyChain({
				ctx: syntheticCtx,
				msg: syntheticMessage,
				allMedia: [],
				storeAllowFrom,
				options: {
					...nativeCallbackCommand ? { commandSource: "native" } : {},
					forceWasMentioned: true,
					messageIdOverride: callback.id
				}
			});
		} catch (err) {
			if (err instanceof TelegramRetryableCallbackError) {
				if (isPermanentTelegramCallbackEditError(err.cause)) {
					logVerbose(`telegram: swallowing permanent callback edit error: ${String(err.cause)}`);
					return;
				}
				runtime.error?.(danger(`callback handler failed: ${String(err)}`));
				throw err.cause;
			}
			runtime.error?.(danger(`callback handler failed: ${String(err)}`));
			if (isTelegramSpooledReplayUpdate(ctx.update)) recordTelegramMessageProcessingResult({
				kind: "failed-retryable",
				error: err
			});
		} finally {
			if (typedQuestionCallback && !callbackAnswered) await answerCallbackQuery();
		}
	});
}
//#endregion
//#region extensions/telegram/src/bot-handlers.debounce-key.ts
function buildTelegramInboundDebounceKey(params) {
	return `telegram:${params.accountId?.trim() || "default"}:${params.conversationKey}:${params.senderId}:${params.debounceLane}`;
}
function buildTelegramInboundDebounceConversationKey(params) {
	return params.threadId != null ? `${params.chatId}:topic:${params.threadId}` : String(params.chatId);
}
//#endregion
//#region extensions/telegram/src/bot-handlers.inbound-debounce.runtime.ts
function createTelegramInboundDebounceRuntime({ cfg, bot, runtime }, messageRuntime) {
	const { promptContextBoundaryOptions, latestPromptContextMinTimestampMs, latestPromptContextAmbientWatermark, mergeDispatchDedupeClaims, releaseDispatchDedupeClaims, buildFailedProcessingResult, settleSpooledReplayParticipants, spooledReplayOptions, buildSyntheticTextMessage, buildSyntheticContext, formatTelegramAmbientTranscriptBody, processMessageWithReplyChain } = messageRuntime;
	const debounceMs = resolveInboundDebounceMs({
		cfg,
		channel: "telegram"
	});
	const FORWARD_BURST_DEBOUNCE_MS = 80;
	const resolveTelegramDebounceEntryMs = (entry) => entry.debounceLane === "forward" ? FORWARD_BURST_DEBOUNCE_MS : debounceMs;
	const shouldDebounceTelegramEntry = (entry) => {
		const hasDebounceableText = shouldDebounceTextInbound({
			text: getTelegramTextParts(entry.msg).text,
			cfg,
			commandOptions: { botUsername: entry.botUsername }
		});
		if (entry.debounceLane === "forward") return hasDebounceableText || entry.allMedia.length > 0;
		return hasDebounceableText && entry.allMedia.length === 0;
	};
	const resolveTelegramDebounceLane = (msg) => {
		const forwardMeta = msg;
		return forwardMeta.forward_origin ?? forwardMeta.forward_from ?? forwardMeta.forward_from_chat ?? forwardMeta.forward_sender_name ?? forwardMeta.forward_date ? "forward" : "default";
	};
	return {
		inboundDebouncer: createInboundDebouncer({
			debounceMs,
			serializeImmediate: true,
			resolveDebounceMs: resolveTelegramDebounceEntryMs,
			buildKey: (entry) => entry.debounceKey,
			shouldDebounce: shouldDebounceTelegramEntry,
			onFlush: async (entries) => {
				const participants = entries.map((entry) => entry.spooledReplayParticipant).filter((participant) => participant !== void 0);
				const last = entries.at(-1);
				if (!last) return;
				try {
					if (entries.length === 1) {
						const result = await processMessageWithReplyChain({
							ctx: last.ctx,
							msg: last.msg,
							allMedia: last.allMedia,
							storeAllowFrom: last.storeAllowFrom,
							options: {
								receivedAtMs: last.receivedAtMs,
								ingressBuffer: "inbound-debounce",
								...promptContextBoundaryOptions(last.promptContextMinTimestampMs, last.promptContextAmbientWatermark),
								...spooledReplayOptions(participants)
							},
							dispatchDedupeClaims: last.dispatchDedupeClaims,
							spooledReplayParticipants: participants
						});
						settleSpooledReplayParticipants(participants, result);
						return;
					}
					const combinedText = entries.map((entry) => getTelegramTextParts(entry.msg).text).filter(Boolean).join("\n");
					const combinedMedia = entries.flatMap((entry) => entry.allMedia);
					if (!combinedText.trim() && combinedMedia.length === 0) {
						releaseDispatchDedupeClaims(mergeDispatchDedupeClaims(...entries.map((entry) => entry.dispatchDedupeClaims)));
						settleSpooledReplayParticipants(participants, { kind: "skipped" });
						return;
					}
					const first = expectDefined(entries.at(0), "multi-entry Telegram debounce batch");
					const syntheticMessage = {
						...buildSyntheticTextMessage({
							base: first.msg,
							text: combinedText,
							date: last.msg.date ?? first.msg.date
						}),
						forward_origin: void 0
					};
					const result = await processMessageWithReplyChain({
						ctx: buildSyntheticContext(first.ctx, syntheticMessage),
						msg: syntheticMessage,
						allMedia: combinedMedia,
						storeAllowFrom: first.storeAllowFrom,
						options: {
							...last.msg.message_id ? { messageIdOverride: String(last.msg.message_id) } : {},
							ambientTranscriptBody: formatTelegramAmbientTranscriptBody(entries.map((entry) => entry.msg)),
							receivedAtMs: first.receivedAtMs,
							ingressBuffer: "inbound-debounce",
							inboundDebounceMessages: entries.map((entry) => entry.msg),
							...promptContextBoundaryOptions(latestPromptContextMinTimestampMs(...entries.map((entry) => entry.promptContextMinTimestampMs)), latestPromptContextAmbientWatermark(...entries.map((entry) => entry.promptContextAmbientWatermark))),
							...spooledReplayOptions(participants)
						},
						dispatchDedupeClaims: mergeDispatchDedupeClaims(...entries.map((entry) => entry.dispatchDedupeClaims)),
						spooledReplayParticipants: participants
					});
					settleSpooledReplayParticipants(participants, result);
				} catch (error) {
					settleSpooledReplayParticipants(participants, buildFailedProcessingResult(error));
					throw error;
				}
			},
			onError: (error, items) => {
				const participants = items.map((item) => item.spooledReplayParticipant).filter((participant) => participant !== void 0);
				settleSpooledReplayParticipants(participants, buildFailedProcessingResult(error));
				runtime.error?.(danger(`telegram debounce flush failed: ${String(error)}`));
				if (participants.length > 0) return;
				const chatId = items[0]?.msg.chat.id;
				if (chatId != null) {
					const threadId = items[0]?.msg.message_thread_id;
					bot.api.sendMessage(chatId, "Something went wrong while processing your message. Please try again.", threadId != null ? { message_thread_id: threadId } : void 0).catch((sendError) => {
						logVerbose(`telegram: error fallback send failed: ${String(sendError)}`);
					});
				}
			},
			onCancel: (items) => {
				releaseDispatchDedupeClaims(mergeDispatchDedupeClaims(...items.map((item) => item.dispatchDedupeClaims)));
				settleSpooledReplayParticipants(items.map((item) => item.spooledReplayParticipant).filter((participant) => participant !== void 0), { kind: "skipped" });
			}
		}),
		resolveTelegramDebounceEntryMs,
		shouldDebounceTelegramEntry,
		resolveTelegramDebounceLane
	};
}
//#endregion
//#region extensions/telegram/src/bot-handlers.media.ts
const TELEGRAM_BOT_API_FILE_DOWNLOAD_LIMIT_MB = 20;
var TelegramBotApiFileTooLargeError = class extends MediaFetchError {
	constructor(cause) {
		super("max_bytes", `Telegram Bot API cannot download files larger than ${TELEGRAM_BOT_API_FILE_DOWNLOAD_LIMIT_MB} MB`, {
			cause,
			status: 400
		});
		this.limitMb = TELEGRAM_BOT_API_FILE_DOWNLOAD_LIMIT_MB;
		this.name = "TelegramBotApiFileTooLargeError";
	}
};
function isMediaSizeLimitError(err) {
	if (err instanceof TelegramBotApiFileTooLargeError) return true;
	const errMsg = String(err);
	return errMsg.includes("exceeds") && errMsg.includes("MB limit");
}
function isRecoverableMediaGroupError(err) {
	return err instanceof MediaFetchError || isMediaSizeLimitError(err);
}
function isAbortError(err) {
	if (!err || typeof err !== "object") return false;
	if ("name" in err && err.name === "AbortError") return true;
	return "message" in err && err.message === "This operation was aborted";
}
function isDurablyRetryableInboundMediaError(err) {
	if (!(err instanceof MediaFetchError)) return false;
	if (err.code === "http_error") return typeof err.status === "number" && (err.status === 408 || err.status === 429 || err.status >= 500);
	if (err.code !== "fetch_failed") return false;
	return isAbortError(err) || isAbortError(err.cause) || isRecoverableTelegramNetworkError(err, { context: "polling" });
}
function hasInboundMedia(msg) {
	return Boolean(msg.media_group_id) || Array.isArray(msg.photo) && msg.photo.length > 0 || Boolean(msg.video ?? msg.video_note ?? msg.document ?? msg.audio ?? msg.voice ?? msg.sticker);
}
function resolveInboundMediaFileId(msg) {
	return msg.sticker?.file_id ?? msg.photo?.[msg.photo.length - 1]?.file_id ?? msg.video?.file_id ?? msg.video_note?.file_id ?? msg.document?.file_id ?? msg.audio?.file_id ?? msg.voice?.file_id;
}
//#endregion
//#region extensions/telegram/src/bot-updates.ts
const RECENT_TELEGRAM_UPDATE_TTL_MS = 5 * 6e4;
const RECENT_TELEGRAM_UPDATE_MAX = 2e3;
const resolveTelegramUpdateId = (ctx) => ctx.update?.update_id ?? ctx.update_id;
const buildTelegramUpdateKey = (ctx) => {
	const updateId = resolveTelegramUpdateId(ctx);
	if (typeof updateId === "number") return `update:${updateId}`;
	const callbackId = ctx.callbackQuery?.id;
	if (callbackId) return `callback:${callbackId}`;
	const editedMsg = ctx.editedMessage ?? ctx.editedChannelPost ?? ctx.update?.edited_message ?? ctx.update?.edited_channel_post;
	const editedChatId = editedMsg?.chat?.id;
	const editedMessageId = editedMsg?.message_id;
	if (editedChatId !== void 0 && typeof editedMessageId === "number") return `edited-message:${editedChatId}:${editedMessageId}`;
	const msg = ctx.message ?? ctx.channelPost ?? ctx.update?.message ?? ctx.update?.channel_post ?? ctx.callbackQuery?.message;
	const chatId = msg?.chat?.id;
	const messageId = msg?.message_id;
	if (chatId !== void 0 && typeof messageId === "number") return `message:${chatId}:${messageId}`;
};
const createTelegramUpdateDedupe = () => createDedupeCache({
	ttlMs: RECENT_TELEGRAM_UPDATE_TTL_MS,
	maxSize: RECENT_TELEGRAM_UPDATE_MAX
});
//#endregion
//#region extensions/telegram/src/bot/delivery.resolve-media.ts
const FILE_TOO_BIG_RE = /file is too big/i;
const TELEGRAM_GET_FILE_RETRY_DEADLINE_MS = 20 * 6e4;
const TELEGRAM_GET_FILE_RETRY_ATTEMPTS = 3;
const GrammyErrorCtor = typeof GrammyError === "function" ? GrammyError : void 0;
function buildTelegramMediaSsrfPolicy(apiRoot, dangerouslyAllowPrivateNetwork) {
	const hostnames = ["api.telegram.org"];
	let allowedHostnames;
	if (apiRoot) try {
		const customHost = new URL(apiRoot).hostname;
		if (customHost && !hostnames.includes(customHost)) {
			hostnames.push(customHost);
			allowedHostnames = [customHost];
		}
	} catch (err) {
		logVerbose(`telegram: invalid apiRoot URL "${apiRoot}": ${String(err)}`);
	}
	return {
		hostnameAllowlist: hostnames,
		...allowedHostnames ? { allowedHostnames } : {},
		...dangerouslyAllowPrivateNetwork ? { allowPrivateNetwork: true } : {},
		allowRfc2544BenchmarkRange: true
	};
}
/**
* Returns true if the error is Telegram's "file is too big" error.
* This happens when trying to download files >20MB via the Bot API.
* Unlike network errors, this is a permanent error and should not be retried.
*/
function isFileTooBigError(err) {
	if (GrammyErrorCtor && err instanceof GrammyErrorCtor) return FILE_TOO_BIG_RE.test(err.description);
	return FILE_TOO_BIG_RE.test(formatErrorMessage(err));
}
/**
* Returns true if the error is a transient network error that should be retried.
* Returns false for permanent errors like "file is too big" (400 Bad Request).
*/
function isRetryableGetFileError(err) {
	if (isFileTooBigError(err)) return false;
	return true;
}
function resolveMediaMetadata(msg) {
	return {
		fileRef: msg.photo?.[msg.photo.length - 1] ?? msg.video ?? msg.video_note ?? msg.document ?? msg.audio ?? msg.voice,
		fileName: msg.document?.file_name ?? msg.audio?.file_name ?? msg.video?.file_name ?? msg.animation?.file_name,
		mimeType: msg.audio?.mime_type ?? msg.voice?.mime_type ?? msg.video?.mime_type ?? msg.document?.mime_type ?? msg.animation?.mime_type
	};
}
async function resolveTelegramFileWithRetry(ctx, abortSignal) {
	const deadline = new AbortController();
	const deadlineTimer = setTimeout(() => deadline.abort(/* @__PURE__ */ new Error("Telegram getFile retry deadline exceeded")), TELEGRAM_GET_FILE_RETRY_DEADLINE_MS);
	deadlineTimer.unref?.();
	const signal = abortSignal ? AbortSignal.any([abortSignal, deadline.signal]) : deadline.signal;
	const getFileSignal = signal;
	try {
		for (let attempt = 1;; attempt += 1) try {
			return await ctx.getFile(getFileSignal);
		} catch (err) {
			if (attempt >= TELEGRAM_GET_FILE_RETRY_ATTEMPTS || !isRetryableGetFileError(err)) throw err;
			logVerbose(`telegram: getFile retry ${attempt}/${TELEGRAM_GET_FILE_RETRY_ATTEMPTS}`);
			try {
				await sleepWithAbort(readTelegramRetryAfterMs(err) ?? 1e3 * 2 ** (attempt - 1), signal);
			} catch {
				throw err;
			}
		}
	} catch (err) {
		if (isFileTooBigError(err)) throw new TelegramBotApiFileTooLargeError(err);
		const status = GrammyErrorCtor && err instanceof GrammyErrorCtor ? err.error_code : void 0;
		throw new MediaFetchError(status ? "http_error" : "fetch_failed", `Telegram getFile failed after retries: ${formatErrorMessage(err)}`, {
			cause: err,
			status
		});
	} finally {
		clearTimeout(deadlineTimer);
	}
}
function resolveRequiredTelegramTransport(transport) {
	if (transport) return transport;
	const resolvedFetch = globalThis.fetch;
	if (!resolvedFetch) throw new Error("fetch is not available; set channels.telegram.proxy in config");
	return {
		fetch: resolvedFetch,
		sourceFetch: resolvedFetch,
		close: async () => {}
	};
}
/** Default idle timeout for Telegram media downloads (30 seconds). */
const TELEGRAM_DOWNLOAD_IDLE_TIMEOUT_MS = 3e4;
/** Maximum wait for Telegram media response headers (120 seconds). */
const TELEGRAM_DOWNLOAD_RESPONSE_HEADER_TIMEOUT_MS = 12e4;
function usesTrustedTelegramExplicitProxy(transport) {
	return transport.dispatcherAttempts?.some((attempt) => attempt.dispatcherPolicy?.mode === "explicit-proxy") ?? false;
}
function resolveTrustedLocalTelegramRoot(filePath, trustedLocalFileRoots) {
	if (!path.isAbsolute(filePath)) return null;
	for (const rootDir of trustedLocalFileRoots ?? []) {
		const relativePath = path.relative(rootDir, filePath);
		if (relativePath === "" || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) continue;
		return {
			rootDir,
			relativePath
		};
	}
	return null;
}
const TELEGRAM_BOT_API_CONTAINER_DATA_ROOT = "/var/lib/telegram-bot-api";
function normalizeTrustedTelegramRelativeFilePath(filePath) {
	const normalized = filePath.replace(/\\/g, "/").replace(/^\/+/, "");
	if (!normalized || normalized.includes("\0")) return null;
	if (normalized.split("/").some((part) => !part || part === "." || part === "..")) return null;
	return normalized;
}
function resolveTelegramBotApiContainerRelativePaths(filePath, token) {
	if (!path.isAbsolute(filePath)) return [];
	const normalized = filePath.replace(/\\/g, "/");
	const prefix = `${TELEGRAM_BOT_API_CONTAINER_DATA_ROOT}/`;
	if (!normalized.startsWith(prefix)) return [];
	const relativePath = normalizeTrustedTelegramRelativeFilePath(normalized.slice(prefix.length));
	if (!relativePath) return [];
	const candidates = [relativePath];
	for (const tokenDirectory of [token, token.replaceAll(":", "~")]) {
		const tokenPrefix = `${tokenDirectory}/`;
		if (tokenDirectory && relativePath.startsWith(tokenPrefix)) candidates.push(relativePath.slice(tokenPrefix.length));
	}
	return [...new Set(candidates)];
}
function isTrustedLocalTelegramFileMissing(error) {
	return error instanceof Error && "code" in error && (error.code === "not-found" || error.code === "ENOENT" || error.code === "ENOTDIR");
}
async function downloadAndSaveTelegramFile(params) {
	const trustedLocalFile = resolveTrustedLocalTelegramRoot(params.filePath, params.trustedLocalFileRoots);
	if (trustedLocalFile) {
		let localFile;
		try {
			localFile = await (await root(trustedLocalFile.rootDir)).read(trustedLocalFile.relativePath, { maxBytes: params.maxBytes });
		} catch (err) {
			throw new MediaFetchError("fetch_failed", `Failed to read local Telegram Bot API media from ${params.filePath}: ${formatErrorMessage(err)}`, { cause: err });
		}
		return await saveMediaBuffer(localFile.buffer, params.mimeType, "inbound", params.maxBytes, params.telegramFileName ?? path.basename(localFile.realPath));
	}
	const containerRelativePaths = resolveTelegramBotApiContainerRelativePaths(params.filePath, params.token);
	for (const rootDir of params.trustedLocalFileRoots ?? []) for (const relativePath of containerRelativePaths) {
		let localFile;
		try {
			localFile = await (await root(rootDir)).read(relativePath, { maxBytes: params.maxBytes });
		} catch (err) {
			if (isTrustedLocalTelegramFileMissing(err)) continue;
			throw new MediaFetchError("fetch_failed", `Failed to read mapped local Telegram Bot API media: ${formatErrorMessage(err)}`, { cause: err });
		}
		return await saveMediaBuffer(localFile.buffer, params.mimeType, "inbound", params.maxBytes, params.telegramFileName ?? path.basename(localFile.realPath));
	}
	if (path.isAbsolute(params.filePath)) throw new MediaFetchError("fetch_failed", `Telegram Bot API returned absolute file path ${params.filePath} outside trustedLocalFileRoots`);
	const transport = resolveRequiredTelegramTransport(params.transport);
	return await saveRemoteMedia({
		url: `${resolveTelegramApiBase(params.apiRoot)}/file/bot${params.token}/${params.filePath}`,
		fetchImpl: transport.sourceFetch,
		dispatcherAttempts: transport.dispatcherAttempts,
		trustExplicitProxyDns: usesTrustedTelegramExplicitProxy(transport),
		shouldRetryFetchError: shouldRetryTelegramTransportFallback,
		...params.abortSignal ? { requestInit: { signal: params.abortSignal } } : {},
		filePathHint: params.filePath,
		maxBytes: params.maxBytes,
		responseHeaderTimeoutMs: TELEGRAM_DOWNLOAD_RESPONSE_HEADER_TIMEOUT_MS,
		readIdleTimeoutMs: TELEGRAM_DOWNLOAD_IDLE_TIMEOUT_MS,
		ssrfPolicy: buildTelegramMediaSsrfPolicy(params.apiRoot, params.dangerouslyAllowPrivateNetwork),
		fallbackContentType: params.mimeType,
		originalFilename: params.telegramFileName
	});
}
async function resolveStickerMedia(params) {
	const { msg, ctx, maxBytes, token, transport, abortSignal } = params;
	if (!msg.sticker) return;
	const sticker = msg.sticker;
	if (sticker.is_animated || sticker.is_video) {
		logVerbose("telegram: skipping animated/video sticker (only static stickers supported)");
		return null;
	}
	if (!sticker.file_id) return null;
	const file = await resolveTelegramFileWithRetry(ctx, abortSignal);
	if (!file.file_path) throw new Error("Telegram getFile returned no file_path for sticker");
	const saved = await downloadAndSaveTelegramFile({
		filePath: file.file_path,
		token,
		transport,
		maxBytes,
		apiRoot: params.apiRoot,
		trustedLocalFileRoots: params.trustedLocalFileRoots,
		dangerouslyAllowPrivateNetwork: params.dangerouslyAllowPrivateNetwork,
		abortSignal
	});
	const cached = sticker.file_unique_id ? getCachedSticker(sticker.file_unique_id) : null;
	if (cached) {
		logVerbose(`telegram: sticker cache hit for ${sticker.file_unique_id}`);
		const fileId = sticker.file_id ?? cached.fileId;
		const emoji = sticker.emoji ?? cached.emoji;
		const setName = sticker.set_name ?? cached.setName;
		if (fileId !== cached.fileId || emoji !== cached.emoji || setName !== cached.setName) cacheSticker({
			...cached,
			fileId,
			emoji,
			setName
		});
		return {
			path: saved.path,
			contentType: saved.contentType,
			kind: "sticker",
			stickerMetadata: {
				emoji,
				setName,
				fileId,
				fileUniqueId: sticker.file_unique_id,
				cachedDescription: cached.description
			}
		};
	}
	return {
		path: saved.path,
		contentType: saved.contentType,
		kind: "sticker",
		stickerMetadata: {
			emoji: sticker.emoji ?? void 0,
			setName: sticker.set_name ?? void 0,
			fileId: sticker.file_id,
			fileUniqueId: sticker.file_unique_id
		}
	};
}
async function resolveMedia(params) {
	const { ctx, maxBytes, token, transport, apiRoot, trustedLocalFileRoots, dangerouslyAllowPrivateNetwork, abortSignal } = params;
	const msg = ctx.message;
	const stickerResolved = await resolveStickerMedia({
		msg,
		ctx,
		maxBytes,
		token,
		transport,
		apiRoot,
		trustedLocalFileRoots,
		dangerouslyAllowPrivateNetwork,
		abortSignal
	});
	if (stickerResolved !== void 0) return stickerResolved;
	const metadata = resolveMediaMetadata(msg);
	if (!metadata.fileRef?.file_id) return null;
	const file = await resolveTelegramFileWithRetry(ctx, abortSignal);
	if (!file.file_path) throw new Error("Telegram getFile returned no file_path");
	const saved = await downloadAndSaveTelegramFile({
		filePath: file.file_path,
		token,
		transport,
		maxBytes,
		telegramFileName: metadata.fileName,
		mimeType: metadata.mimeType,
		apiRoot,
		trustedLocalFileRoots,
		dangerouslyAllowPrivateNetwork,
		abortSignal
	});
	const nativeKind = resolveTelegramPrimaryMedia(msg)?.kind ?? "document";
	const kind = nativeKind === "sticker" ? nativeKind : saved.contentType?.startsWith("audio/") ? "audio" : nativeKind;
	return {
		path: saved.path,
		contentType: saved.contentType,
		kind
	};
}
//#endregion
//#region extensions/telegram/src/bot-handlers.inbound-media-group.runtime.ts
function createTelegramInboundMediaGroupRuntime(params, messageRuntime) {
	const { accountId, bot, opts, runtime, mediaMaxBytes, logger, resolveGroupActivation, resolveGroupRequireMention } = params;
	const { mediaRuntimeWithAbort, promptContextBoundaryOptions, latestPromptContextMinTimestampMs, latestPromptContextAmbientWatermark, mergeDispatchDedupeClaims, releaseDispatchDedupeClaims, buildFailedProcessingResult, settleSpooledReplayParticipants, createSpooledReplayParticipantForBufferedWork, spooledReplayOptions, resolveTelegramSessionState, processMessageWithReplyChain } = messageRuntime;
	const timeoutMs = typeof opts.testTimings?.mediaGroupFlushMs === "number" && Number.isFinite(opts.testTimings.mediaGroupFlushMs) ? Math.max(10, Math.floor(opts.testTimings.mediaGroupFlushMs)) : 500;
	const buffer = /* @__PURE__ */ new Map();
	const queue = new KeyedAsyncQueue();
	const shouldSkipMediaDownloadForUnaddressedMentionGroup = async (authorization) => {
		const { ctx, msg, chatId, isGroup, isForum, resolvedThreadId, dmThreadId, senderId } = authorization;
		const textParts = getTelegramTextParts(msg);
		const documentMime = msg.document?.mime_type?.split(";")[0]?.trim().toLowerCase();
		const mayNeedDownload = !textParts.text.trim() && Boolean(msg.audio ?? msg.voice ?? documentMime?.startsWith("audio/"));
		if (!isGroup || mayNeedDownload) return false;
		const sessionState = resolveTelegramSessionState({
			chatId,
			isGroup,
			isForum,
			resolvedThreadId,
			messageThreadId: resolvedThreadId ?? dmThreadId,
			senderId,
			runtimeCfg: authorization.authorizationCfg
		});
		const activationOverride = resolveGroupActivation({
			chatId,
			messageThreadId: resolvedThreadId,
			sessionKey: sessionState.sessionKey,
			agentId: sessionState.agentId,
			cfg: authorization.authorizationCfg
		});
		if (!firstDefined(authorization.topicConfig?.requireMention, activationOverride, authorization.groupConfig?.requireMention, resolveGroupRequireMention(chatId, authorization.authorizationCfg))) return false;
		const botUsername = ctx.me?.username?.trim().toLowerCase();
		const mentionRegexes = buildMentionRegexes(authorization.authorizationCfg, sessionState.agentId);
		const hasAnyMention = textParts.entities.some((entity) => entity.type === "mention");
		const explicitlyMentioned = botUsername ? hasBotMention(msg, botUsername) : false;
		const wasMentioned = matchesMentionWithExplicit({
			text: textParts.text,
			mentionRegexes,
			explicit: {
				hasAnyMention,
				isExplicitlyMentioned: explicitlyMentioned,
				canResolveExplicit: Boolean(botUsername)
			}
		});
		const implicitMentionKinds = implicitMentionKindWhen("reply_to_bot", ctx.me?.id != null && msg.reply_to_message?.from?.id === ctx.me.id && !isTelegramForumServiceMessage(msg.reply_to_message));
		const hasControlCommandInMessage = hasControlCommand(textParts.text, authorization.authorizationCfg, { botUsername });
		const commandGate = await resolveTelegramCommandIngressAuthorization({
			accountId,
			cfg: authorization.authorizationCfg,
			dmPolicy: "pairing",
			isGroup,
			chatId,
			resolvedThreadId,
			senderId,
			effectiveDmAllow: authorization.effectiveDmAllow,
			effectiveGroupAllow: authorization.effectiveGroupAllow,
			ownerAccess: {
				ownerList: [],
				senderIsOwner: false
			},
			eventKind: "message",
			allowTextCommands: true,
			hasControlCommand: hasControlCommandInMessage,
			modeWhenAccessGroupsOff: "allow",
			includeDmAllowForGroupCommands: false
		});
		if (resolveInboundMentionDecision({
			facts: {
				canDetectMention: Boolean(botUsername) || mentionRegexes.length > 0,
				wasMentioned,
				hasAnyMention,
				implicitMentionKinds
			},
			policy: {
				isGroup,
				requireMention: true,
				allowTextCommands: true,
				hasControlCommand: hasControlCommandInMessage,
				commandAuthorized: commandGate.authorized
			}
		}).shouldSkip) {
			logger.info({
				chatId,
				reason: "no-mention"
			}, "skipping group media before download");
			return true;
		}
		return false;
	};
	const processMediaGroup = async (entry) => {
		try {
			entry.messages.sort((a, b) => a.msg.message_id - b.msg.message_id);
			const primary = entry.messages.find((item) => item.msg.caption || item.msg.text) ?? entry.messages[0];
			if (!primary) {
				releaseDispatchDedupeClaims(entry.dispatchDedupeClaims);
				settleSpooledReplayParticipants(entry.spooledReplayParticipants, { kind: "skipped" });
				return;
			}
			if (await shouldSkipMediaDownloadForUnaddressedMentionGroup({
				...entry,
				...primary
			})) {
				releaseDispatchDedupeClaims(entry.dispatchDedupeClaims);
				settleSpooledReplayParticipants(entry.spooledReplayParticipants, { kind: "skipped" });
				return;
			}
			const allMedia = [];
			const selection = /* @__PURE__ */ new Map();
			let materializedCount = 0;
			let skippedCount = 0;
			for (const { ctx, msg } of entry.messages) {
				const sourceMessageId = String(msg.message_id);
				const nativeKind = resolveTelegramPrimaryMedia(msg)?.kind ?? "document";
				let media;
				try {
					media = await resolveMedia({
						ctx,
						maxBytes: mediaMaxBytes,
						...mediaRuntimeWithAbort
					});
				} catch (error) {
					if (mediaRuntimeWithAbort.abortSignal?.aborted && entry.spooledReplayParticipants.length) throw error;
					if (!isRecoverableMediaGroupError(error)) throw error;
					runtime.log?.(warn(`media group: skipping photo that failed to fetch: ${String(error)}`));
					allMedia.push({
						kind: nativeKind,
						sourceMessageId
					});
					selection.set(sourceMessageId, "exclude");
					skippedCount++;
					continue;
				}
				if (media) {
					allMedia.push({
						path: media.path,
						contentType: media.contentType,
						kind: media.kind,
						stickerMetadata: media.stickerMetadata,
						sourceMessageId
					});
					materializedCount++;
					selection.set(sourceMessageId, "include");
				} else {
					allMedia.push({
						kind: nativeKind,
						sourceMessageId
					});
					selection.set(sourceMessageId, "exclude");
					skippedCount++;
				}
			}
			if (skippedCount > 0) {
				const verb = skippedCount === 1 ? "was" : "were";
				await withTelegramApiErrorLogging({
					operation: "sendMessage",
					runtime,
					fn: () => bot.api.sendMessage(primary.msg.chat.id, `⚠️ Received ${materializedCount} of ${entry.messages.length} images — ${skippedCount} could not be fetched and ${verb} skipped.`, { reply_parameters: {
						message_id: primary.msg.message_id,
						allow_sending_without_reply: true
					} })
				}).catch(() => {});
			}
			const result = await processMessageWithReplyChain({
				ctx: primary.ctx,
				msg: primary.msg,
				allMedia,
				promptContextMessageSelection: selection,
				storeAllowFrom: entry.storeAllowFrom,
				options: {
					...promptContextBoundaryOptions(entry.promptContextMinTimestampMs, entry.promptContextAmbientWatermark),
					...spooledReplayOptions(entry.spooledReplayParticipants)
				},
				dispatchDedupeClaims: entry.dispatchDedupeClaims,
				spooledReplayParticipants: entry.spooledReplayParticipants
			});
			settleSpooledReplayParticipants(entry.spooledReplayParticipants, result);
		} catch (error) {
			releaseDispatchDedupeClaims(entry.dispatchDedupeClaims, error);
			settleSpooledReplayParticipants(entry.spooledReplayParticipants, buildFailedProcessingResult(error));
			runtime.error?.(danger(`media group handler failed: ${String(error)}`));
		}
	};
	const queueEntry = (key, entry) => void queue.enqueue(key, async () => {
		await processMediaGroup(entry).catch(() => void 0);
	});
	const handleMediaGroup = (input) => {
		const mediaGroupId = input.msg.media_group_id;
		if (!mediaGroupId) return false;
		const threadId = input.resolvedThreadId ?? input.dmThreadId;
		const key = `media:${input.chatId}:${threadId ?? "main"}:${mediaGroupId}`;
		const existing = buffer.get(key);
		const participant = createSpooledReplayParticipantForBufferedWork(`media-group:${key}:${input.msg.message_id}`);
		if (existing) {
			if (participant) existing.spooledReplayParticipants.push(participant);
			clearTimeout(existing.timer);
			existing.messages.push({
				msg: input.msg,
				ctx: input.ctx
			});
			existing.promptContextMinTimestampMs = latestPromptContextMinTimestampMs(existing.promptContextMinTimestampMs, input.promptContextMinTimestampMs);
			existing.promptContextAmbientWatermark = latestPromptContextAmbientWatermark(existing.promptContextAmbientWatermark, input.promptContextAmbientWatermark);
			existing.dispatchDedupeClaims = mergeDispatchDedupeClaims(existing.dispatchDedupeClaims, input.dispatchDedupeClaims);
			existing.timer = setTimeout(() => {
				buffer.delete(key);
				queueEntry(key, existing);
			}, timeoutMs);
			return true;
		}
		const entry = {
			...input,
			messages: [{
				msg: input.msg,
				ctx: input.ctx
			}],
			spooledReplayParticipants: participant ? [participant] : [],
			...promptContextBoundaryOptions(input.promptContextMinTimestampMs, input.promptContextAmbientWatermark),
			timer: setTimeout(() => {
				buffer.delete(key);
				queueEntry(key, entry);
			}, timeoutMs)
		};
		buffer.set(key, entry);
		return true;
	};
	return {
		handleMediaGroup,
		shouldSkipMediaDownloadForUnaddressedMentionGroup
	};
}
//#endregion
//#region extensions/telegram/src/bot-handlers.inbound-text.runtime.ts
function createTelegramInboundTextRuntime({ opts, runtime }, messageRuntime) {
	const { promptContextBoundaryOptions, latestPromptContextMinTimestampMs, latestPromptContextAmbientWatermark, mergeDispatchDedupeClaims, releaseDispatchDedupeClaims, buildFailedProcessingResult, settleSpooledReplayParticipants, createSpooledReplayParticipantForBufferedWork, spooledReplayOptions, buildSyntheticTextMessage, buildSyntheticContext, formatTelegramAmbientTranscriptBody, processMessageWithReplyChain } = messageRuntime;
	const maxGapMs = typeof opts.testTimings?.textFragmentGapMs === "number" && Number.isFinite(opts.testTimings.textFragmentGapMs) ? Math.max(10, Math.floor(opts.testTimings.textFragmentGapMs)) : 1500;
	const buffer = /* @__PURE__ */ new Map();
	const queue = new KeyedAsyncQueue();
	const flush = async (entry) => {
		try {
			entry.messages.sort((a, b) => a.msg.message_id - b.msg.message_id);
			const first = entry.messages[0];
			const last = entry.messages.at(-1);
			if (!first || !last) {
				releaseDispatchDedupeClaims(entry.dispatchDedupeClaims);
				settleSpooledReplayParticipants(entry.spooledReplayParticipants, { kind: "skipped" });
				return;
			}
			const combinedText = entry.messages.map((message) => message.msg.text ?? "").join("");
			if (!combinedText.trim()) {
				releaseDispatchDedupeClaims(entry.dispatchDedupeClaims);
				settleSpooledReplayParticipants(entry.spooledReplayParticipants, { kind: "skipped" });
				return;
			}
			const syntheticMessage = buildSyntheticTextMessage({
				base: first.msg,
				text: combinedText,
				date: last.msg.date ?? first.msg.date
			});
			const result = await processMessageWithReplyChain({
				ctx: buildSyntheticContext(first.ctx, syntheticMessage),
				msg: syntheticMessage,
				allMedia: [],
				storeAllowFrom: entry.storeAllowFrom,
				options: {
					messageIdOverride: String(last.msg.message_id),
					ambientTranscriptBody: formatTelegramAmbientTranscriptBody(entry.messages.map((message) => message.msg)),
					receivedAtMs: first.receivedAtMs,
					ingressBuffer: "text-fragment",
					...promptContextBoundaryOptions(entry.promptContextMinTimestampMs, entry.promptContextAmbientWatermark),
					...spooledReplayOptions(entry.spooledReplayParticipants)
				},
				dispatchDedupeClaims: entry.dispatchDedupeClaims,
				spooledReplayParticipants: entry.spooledReplayParticipants
			});
			settleSpooledReplayParticipants(entry.spooledReplayParticipants, result);
		} catch (error) {
			releaseDispatchDedupeClaims(entry.dispatchDedupeClaims, error);
			settleSpooledReplayParticipants(entry.spooledReplayParticipants, buildFailedProcessingResult(error));
			runtime.error?.(danger(`text fragment handler failed: ${String(error)}`));
		}
	};
	const queueFlush = async (entry) => {
		await queue.enqueue(entry.key, async () => {
			await flush(entry).catch(() => void 0);
		});
	};
	const runFlush = async (entry) => {
		buffer.delete(entry.key);
		await queueFlush(entry);
	};
	const scheduleFlush = (entry) => {
		clearTimeout(entry.timer);
		entry.timer = setTimeout(() => void runFlush(entry), maxGapMs);
	};
	const handleTextFragment = async (params) => {
		const text = typeof params.msg.text === "string" ? params.msg.text : void 0;
		const isCommandLike = (text ?? "").trim().startsWith("/");
		const senderId = params.msg.from?.id != null ? String(params.msg.from.id) : "unknown";
		const threadId = params.resolvedThreadId ?? params.dmThreadId;
		const key = `text:${params.chatId}:${threadId ?? "main"}:${senderId}`;
		if (text && !isCommandLike && !params.isAbortControlMessage) {
			const nowMs = Date.now();
			const existing = buffer.get(key);
			if (existing) {
				const last = existing.messages.at(-1);
				const idGap = last ? params.msg.message_id - last.msg.message_id : Infinity;
				const timeGapMs = nowMs - (last?.receivedAtMs ?? nowMs);
				const canAppend = idGap > 0 && idGap <= 1 && timeGapMs >= 0 && timeGapMs <= maxGapMs;
				const nextTotalChars = existing.messages.reduce((sum, message) => sum + (message.msg.text?.length ?? 0), 0) + text.length;
				if (canAppend && existing.messages.length < 12 && nextTotalChars <= 5e4) {
					const participant = createSpooledReplayParticipantForBufferedWork(`text-fragment:${key}:${params.msg.message_id}`);
					if (participant) existing.spooledReplayParticipants.push(participant);
					existing.messages.push({
						msg: params.msg,
						ctx: params.ctx,
						receivedAtMs: nowMs
					});
					existing.promptContextMinTimestampMs = latestPromptContextMinTimestampMs(existing.promptContextMinTimestampMs, params.promptContextMinTimestampMs);
					existing.promptContextAmbientWatermark = latestPromptContextAmbientWatermark(existing.promptContextAmbientWatermark, params.promptContextAmbientWatermark);
					existing.dispatchDedupeClaims = mergeDispatchDedupeClaims(existing.dispatchDedupeClaims, params.dispatchDedupeClaims);
					scheduleFlush(existing);
					return true;
				}
				clearTimeout(existing.timer);
				buffer.delete(key);
				await queueFlush(existing);
			}
			if (text.length >= 4e3) {
				const participant = createSpooledReplayParticipantForBufferedWork(`text-fragment:${key}:${params.msg.message_id}`);
				const entry = {
					key,
					storeAllowFrom: params.storeAllowFrom,
					messages: [{
						msg: params.msg,
						ctx: params.ctx,
						receivedAtMs: nowMs
					}],
					dispatchDedupeClaims: params.dispatchDedupeClaims,
					spooledReplayParticipants: participant ? [participant] : [],
					...promptContextBoundaryOptions(params.promptContextMinTimestampMs, params.promptContextAmbientWatermark),
					timer: setTimeout(() => {}, maxGapMs)
				};
				buffer.set(key, entry);
				scheduleFlush(entry);
				return true;
			}
		} else if (text && params.isAbortControlMessage && await params.isAuthorizedAbortControlMessage()) {
			const existing = buffer.get(key);
			if (existing) {
				clearTimeout(existing.timer);
				buffer.delete(key);
				releaseDispatchDedupeClaims(existing.dispatchDedupeClaims);
				settleSpooledReplayParticipants(existing.spooledReplayParticipants, { kind: "skipped" });
			}
		}
		return false;
	};
	return { handleTextFragment };
}
//#endregion
//#region extensions/telegram/src/bot-handlers.inbound.runtime.ts
function createTelegramHandlerInboundRuntime({ cfg, accountId, bot, opts, runtime, mediaMaxBytes, logger, resolveGroupActivation, resolveGroupRequireMention }, messageRuntime) {
	const { mediaRuntimeWithAbort, promptContextBoundaryOptions, releaseDispatchDedupeClaims, createSpooledReplayParticipantForBufferedWork } = messageRuntime;
	const { inboundDebouncer, resolveTelegramDebounceEntryMs, shouldDebounceTelegramEntry, resolveTelegramDebounceLane } = createTelegramInboundDebounceRuntime({
		cfg,
		bot,
		runtime
	}, messageRuntime);
	const { handleMediaGroup, shouldSkipMediaDownloadForUnaddressedMentionGroup } = createTelegramInboundMediaGroupRuntime({
		accountId,
		bot,
		opts,
		runtime,
		mediaMaxBytes,
		logger,
		resolveGroupActivation,
		resolveGroupRequireMention
	}, messageRuntime);
	const { handleTextFragment } = createTelegramInboundTextRuntime({
		opts,
		runtime
	}, messageRuntime);
	const processInboundMessage = async (params) => {
		const { authorizationCfg, ctx, msg, chatId, isGroup, isForum, resolvedThreadId, dmThreadId, dmPolicy, storeAllowFrom, senderId, effectiveGroupAllow, effectiveDmAllow, groupConfig, topicConfig, sendOversizeWarning, oversizeLogMessage, promptContextMinTimestampMs, promptContextAmbientWatermark, dispatchDedupeClaims } = params;
		const messageText = getTelegramTextParts(msg).text;
		const botUsername = ctx.me?.username;
		const isAbortControlMessage = isAbortRequestText(messageText, { botUsername });
		let abortControlAuthorized;
		const isAuthorizedAbortControlMessage = () => {
			if (!isAbortControlMessage || !senderId) return Promise.resolve(false);
			abortControlAuthorized ??= resolveTelegramCommandIngressAuthorization({
				accountId,
				cfg: authorizationCfg,
				dmPolicy,
				isGroup,
				chatId,
				resolvedThreadId,
				senderId,
				effectiveDmAllow,
				effectiveGroupAllow,
				ownerAccess: {
					ownerList: [],
					senderIsOwner: false
				},
				eventKind: "message",
				allowTextCommands: true,
				hasControlCommand: true,
				modeWhenAccessGroupsOff: "allow",
				includeDmAllowForGroupCommands: false
			}).then((gate) => gate.authorized);
			return abortControlAuthorized;
		};
		if (await handleTextFragment({
			ctx,
			msg,
			chatId,
			resolvedThreadId,
			dmThreadId,
			storeAllowFrom,
			isAbortControlMessage,
			isAuthorizedAbortControlMessage,
			promptContextMinTimestampMs,
			promptContextAmbientWatermark,
			dispatchDedupeClaims
		})) return;
		if (handleMediaGroup({
			authorizationCfg,
			ctx,
			msg,
			chatId,
			isGroup,
			isForum,
			resolvedThreadId,
			dmThreadId,
			storeAllowFrom,
			senderId,
			effectiveGroupAllow,
			effectiveDmAllow,
			groupConfig,
			topicConfig,
			promptContextMinTimestampMs,
			promptContextAmbientWatermark,
			dispatchDedupeClaims
		})) return;
		if (await shouldSkipMediaDownloadForUnaddressedMentionGroup({
			authorizationCfg,
			ctx,
			msg,
			chatId,
			isGroup,
			isForum,
			resolvedThreadId,
			dmThreadId,
			senderId,
			effectiveGroupAllow,
			effectiveDmAllow,
			groupConfig,
			topicConfig
		})) {
			releaseDispatchDedupeClaims(dispatchDedupeClaims);
			return;
		}
		const nativeMedia = resolveTelegramPrimaryMedia(msg);
		let media = null;
		try {
			media = await resolveMedia({
				ctx,
				maxBytes: mediaMaxBytes,
				...mediaRuntimeWithAbort
			});
		} catch (mediaErr) {
			const replayingSpooledUpdate = isTelegramSpooledReplayUpdate(ctx.update);
			if (mediaRuntimeWithAbort.abortSignal?.aborted && isDurablyRetryableInboundMediaError(mediaErr)) {
				recordTelegramMessageProcessingResult({
					kind: "failed-retryable",
					error: mediaErr
				});
				releaseDispatchDedupeClaims(dispatchDedupeClaims, mediaErr);
				return;
			}
			if (isMediaSizeLimitError(mediaErr)) {
				if (sendOversizeWarning) {
					const limitMb = mediaErr instanceof TelegramBotApiFileTooLargeError ? Math.min(mediaErr.limitMb, Math.round(mediaMaxBytes / (1024 * 1024))) : Math.round(mediaMaxBytes / (1024 * 1024));
					await withTelegramApiErrorLogging({
						operation: "sendMessage",
						runtime,
						fn: () => bot.api.sendMessage(chatId, `⚠️ File too large. Maximum size is ${limitMb}MB.`, { reply_parameters: {
							message_id: msg.message_id,
							allow_sending_without_reply: true
						} })
					}).catch(() => {});
				}
				logger.warn({
					chatId,
					error: String(mediaErr)
				}, oversizeLogMessage);
			} else {
				logger.warn({
					chatId,
					error: String(mediaErr)
				}, "media fetch failed");
				if (isDurablyRetryableInboundMediaError(mediaErr) && replayingSpooledUpdate) {
					recordTelegramMessageProcessingResult({
						kind: "failed-retryable",
						error: mediaErr
					});
					releaseDispatchDedupeClaims(dispatchDedupeClaims, mediaErr);
					return;
				}
				await withTelegramApiErrorLogging({
					operation: "sendMessage",
					runtime,
					fn: () => bot.api.sendMessage(chatId, "⚠️ Failed to download media. Please try again.", { reply_parameters: {
						message_id: msg.message_id,
						allow_sending_without_reply: true
					} })
				}).catch(() => {});
			}
		}
		const allMedia = nativeMedia ? [media ? {
			path: media.path,
			contentType: media.contentType,
			kind: media.kind,
			stickerMetadata: media.stickerMetadata
		} : { kind: nativeMedia.kind }] : [];
		const conversationKey = buildTelegramInboundDebounceConversationKey({
			chatId,
			threadId: resolvedThreadId ?? dmThreadId
		});
		const debounceLane = resolveTelegramDebounceLane(msg);
		const debounceKey = senderId ? buildTelegramInboundDebounceKey({
			accountId,
			conversationKey,
			senderId,
			debounceLane
		}) : null;
		if (senderId && await isAuthorizedAbortControlMessage()) for (const lane of ["default", "forward"]) inboundDebouncer.cancelKey(buildTelegramInboundDebounceKey({
			accountId,
			conversationKey,
			senderId,
			debounceLane: lane
		}));
		const debounceEntry = {
			ctx,
			msg,
			allMedia,
			storeAllowFrom,
			receivedAtMs: Date.now(),
			debounceKey: isAbortControlMessage ? null : debounceKey,
			debounceLane,
			botUsername,
			...promptContextBoundaryOptions(promptContextMinTimestampMs, promptContextAmbientWatermark),
			dispatchDedupeClaims
		};
		if (debounceEntry.debounceKey && resolveTelegramDebounceEntryMs(debounceEntry) > 0 && shouldDebounceTelegramEntry(debounceEntry)) debounceEntry.spooledReplayParticipant = createSpooledReplayParticipantForBufferedWork(`inbound-debounce:${debounceEntry.debounceKey}`);
		await inboundDebouncer.enqueue(debounceEntry);
	};
	return { processInboundMessage };
}
//#endregion
//#region extensions/telegram/src/bot-handlers.message-events.runtime.ts
function registerTelegramMessageHandlers({ bot, opts, runtime, shouldSkipUpdate }, messageRuntime, authorizationRuntime, inboundRuntime) {
	const { normalizePromptContextMinTimestampMs, promptContextBoundaryOptions, releaseDispatchDedupeClaims, claimMessageDispatchDedupe, buildSyntheticContext, resolveTelegramSessionState, resolvePromptContextAmbientWatermark, recordMessageForReplyChain } = messageRuntime;
	const { authorizeInboundMessage } = authorizationRuntime;
	const { processInboundMessage } = inboundRuntime;
	const getChat = bot.api.getChat.bind(bot.api);
	const normalizeChannelPostMessage = (post) => {
		const chatId = post.chat.id;
		const syntheticFrom = post.sender_chat ? {
			id: post.sender_chat.id,
			is_bot: true,
			first_name: post.sender_chat.title || "Channel",
			username: post.sender_chat.username
		} : {
			id: chatId,
			is_bot: true,
			first_name: post.chat.title || "Channel",
			username: post.chat.username
		};
		return {
			...post,
			from: post.from ?? syntheticFrom,
			chat: {
				...post.chat,
				type: "supergroup"
			}
		};
	};
	const recordEditedMessageForReplyChain = async (params) => {
		if (shouldSkipUpdate(params.ctxForDedupe)) return;
		const msg = params.msg;
		const isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
		const isForum = await resolveTelegramForumFlag({
			chatId: msg.chat.id,
			chatType: msg.chat.type,
			isGroup,
			isForum: msg.chat.is_forum,
			isTopicMessage: msg.is_topic_message,
			getChat
		});
		const normalizedMsg = withResolvedTelegramForumFlag(msg, isForum);
		const gate = await authorizeInboundMessage({
			msg: normalizedMsg,
			chatId: normalizedMsg.chat.id,
			isGroup,
			isForum,
			messageThreadId: normalizedMsg.message_thread_id,
			senderId: normalizedMsg.from?.id != null ? String(normalizedMsg.from.id) : "",
			senderUsername: normalizedMsg.from?.username ?? "",
			requireConfiguredGroup: params.requireConfiguredGroup,
			dmAccess: "silent"
		});
		if (!gate.allowed) return;
		const { resolvedThreadId, dmThreadId } = gate.context;
		await recordMessageForReplyChain(normalizedMsg, resolvedThreadId ?? dmThreadId, params.botUserId);
	};
	const handleInboundMessageLike = async (event) => {
		let dispatchDedupeClaims = [];
		try {
			if (shouldSkipUpdate(event.ctxForDedupe)) return;
			const gate = await authorizeInboundMessage({
				msg: event.msg,
				chatId: event.chatId,
				isGroup: event.isGroup,
				isForum: event.isForum,
				messageThreadId: event.messageThreadId,
				senderId: event.senderId,
				senderUsername: event.senderUsername,
				requireConfiguredGroup: event.requireConfiguredGroup,
				dmAccess: "challenge"
			});
			if (!gate.allowed) return;
			const { effectiveDmAllow } = gate;
			const { dmPolicy, resolvedThreadId, dmThreadId, storeAllowFrom, groupConfig, topicConfig, effectiveGroupAllow } = gate.context;
			const sessionState = resolveTelegramSessionState({
				chatId: event.chatId,
				isGroup: event.isGroup,
				isForum: event.isForum,
				messageThreadId: event.messageThreadId,
				resolvedThreadId,
				botHasTopicsEnabled: resolveTelegramBotHasTopicsEnabled(event.ctx.me),
				senderId: event.senderId,
				runtimeCfg: gate.context.cfg
			});
			const promptContextMinTimestampMs = normalizePromptContextMinTimestampMs(sessionState.sessionEntry?.sessionStartedAt);
			const promptContextAmbientWatermark = resolvePromptContextAmbientWatermark({
				chatId: event.chatId,
				isGroup: event.isGroup,
				resolvedThreadId,
				sessionKey: sessionState.sessionKey,
				storePath: sessionState.storePath
			});
			const dispatchDedupe = await claimMessageDispatchDedupe(event.msg);
			if (!dispatchDedupe.process) return;
			dispatchDedupeClaims = dispatchDedupe.claims;
			await recordMessageForReplyChain(event.msg, resolvedThreadId ?? dmThreadId, event.ctx.me?.id ?? opts.botInfo?.id);
			await processInboundMessage({
				authorizationCfg: gate.context.cfg,
				ctx: event.ctx,
				msg: event.msg,
				chatId: event.chatId,
				isGroup: event.isGroup,
				isForum: event.isForum,
				resolvedThreadId,
				dmThreadId,
				dmPolicy,
				storeAllowFrom,
				senderId: event.senderId,
				effectiveGroupAllow,
				effectiveDmAllow,
				groupConfig: event.isGroup ? groupConfig : void 0,
				topicConfig,
				sendOversizeWarning: event.sendOversizeWarning,
				oversizeLogMessage: event.oversizeLogMessage,
				dispatchDedupeClaims,
				...promptContextBoundaryOptions(promptContextMinTimestampMs, promptContextAmbientWatermark)
			});
		} catch (err) {
			releaseDispatchDedupeClaims(dispatchDedupeClaims, err);
			runtime.error?.(danger(`${event.errorMessage}: ${String(err)}`));
			const spooledReplay = isTelegramSpooledReplayUpdate(event.ctx.update);
			if (err instanceof TelegramPairingStoreReadError || spooledReplay) {
				recordTelegramMessageProcessingResult({
					kind: "failed-retryable",
					error: err
				});
				if (spooledReplay) return;
				await withTelegramApiErrorLogging({
					operation: "sendMessage",
					runtime,
					fn: () => bot.api.sendMessage(event.chatId, "⚠️ Couldn't process this message, please try again in a moment.", { reply_parameters: {
						message_id: event.msg.message_id,
						allow_sending_without_reply: true
					} })
				}).catch(() => {});
			}
		}
	};
	bot.on("message", async (ctx) => {
		const msg = ctx.message;
		if (!msg) return;
		const isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
		const isForum = await resolveTelegramForumFlag({
			chatId: msg.chat.id,
			chatType: msg.chat.type,
			isGroup,
			isForum: msg.chat.is_forum,
			isTopicMessage: msg.is_topic_message,
			getChat
		});
		const normalizedMsg = withResolvedTelegramForumFlag(msg, isForum);
		if (normalizedMsg.from?.id != null && normalizedMsg.from.id === ctx.me?.id) return;
		await handleInboundMessageLike({
			ctxForDedupe: ctx,
			ctx: buildSyntheticContext(ctx, normalizedMsg),
			msg: normalizedMsg,
			chatId: normalizedMsg.chat.id,
			isGroup,
			isForum,
			messageThreadId: normalizedMsg.message_thread_id,
			senderId: normalizedMsg.from?.id != null ? String(normalizedMsg.from.id) : "",
			senderUsername: normalizedMsg.from?.username ?? "",
			requireConfiguredGroup: false,
			sendOversizeWarning: true,
			oversizeLogMessage: "media exceeds size limit",
			errorMessage: "handler failed"
		});
	});
	bot.on("edited_message", async (ctx) => {
		const msg = ctx.editedMessage;
		if (!msg) return;
		await recordEditedMessageForReplyChain({
			ctxForDedupe: ctx,
			msg,
			requireConfiguredGroup: false,
			botUserId: ctx.me?.id ?? opts.botInfo?.id
		});
	});
	bot.on("channel_post", async (ctx) => {
		const post = ctx.channelPost;
		if (!post) return;
		const chatId = post.chat.id;
		const syntheticMsg = normalizeChannelPostMessage(post);
		await handleInboundMessageLike({
			ctxForDedupe: ctx,
			ctx: buildSyntheticContext(ctx, syntheticMsg),
			msg: syntheticMsg,
			chatId,
			isGroup: true,
			isForum: false,
			senderId: post.sender_chat?.id != null ? String(post.sender_chat.id) : post.from?.id != null ? String(post.from.id) : "",
			senderUsername: post.sender_chat?.username ?? post.from?.username ?? "",
			requireConfiguredGroup: true,
			sendOversizeWarning: false,
			oversizeLogMessage: "channel post media exceeds size limit",
			errorMessage: "channel_post handler failed"
		});
	});
	bot.on("edited_channel_post", async (ctx) => {
		const post = ctx.editedChannelPost;
		if (!post) return;
		await recordEditedMessageForReplyChain({
			ctxForDedupe: ctx,
			msg: normalizeChannelPostMessage(post),
			requireConfiguredGroup: true,
			botUserId: ctx.me?.id ?? opts.botInfo?.id
		});
	});
}
//#endregion
//#region extensions/telegram/src/session-transcript-context.ts
async function buildTelegramSessionTranscriptPromptEntries(params) {
	return (await readRecentUserAssistantTextForSession(params)).map((entry) => {
		const sender = entry.role === "assistant" ? "OpenClaw" : "User";
		const message = {
			...entry.id ? { message_id: `session:${entry.id}` } : {},
			sender: entry.sourceChannel ? `${sender} (${entry.sourceChannel})` : sender,
			...entry.timestamp !== void 0 ? { timestamp_ms: entry.timestamp } : {},
			body: entry.text,
			...entry.sourceChannel ? { source_channel: entry.sourceChannel } : {}
		};
		return entry.id ? {
			role: entry.role,
			transcriptMessageId: entry.id,
			message
		} : {
			role: entry.role,
			message
		};
	});
}
//#endregion
//#region extensions/telegram/src/bot-handlers.message-context.runtime.ts
function hasLegacyPromptContextTimestamp(node, botUserId) {
	if (node.promptContextProjectionMarker) return false;
	const timestamp = node.sourceMessage.openclaw_prompt_context_timestamp_ms;
	if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) return false;
	return isTelegramMessageFromCurrentBot(node.sourceMessage, botUserId) || node.sourceMessage.from?.id === 0 && node.sourceMessage.from.is_bot;
}
function resolvePromptContextTextDedupeKey(message) {
	if (typeof message.body !== "string") return;
	const visibleBody = stripInlineDirectiveTagsForDelivery(message.body).text.trim();
	if (!visibleBody) return;
	if (typeof message.timestamp_ms !== "number" || !Number.isFinite(message.timestamp_ms)) return;
	return `${message.timestamp_ms}:${visibleBody}`;
}
function createTelegramMessageContextRuntime({ cfg, accountId, opts, telegramCfg, telegramDeps }, { resolveTelegramSessionState }) {
	const messageCache = createTelegramMessageCache({ scope: resolveTelegramMessageCacheScope(telegramDeps.resolveStorePath(cfg.session?.store)) });
	const resolvePromptSender = (node, ctx) => {
		const botInfo = ctx.me ?? opts.botInfo;
		if (botInfo?.id != null && (node.senderId === String(botInfo.id) || node.sourceMessage.sender_business_bot?.id === botInfo.id)) return buildTelegramSelfSenderName(telegramCfg.name, botInfo);
		if (node.senderId === "0" && node.sourceMessage.from?.is_bot === true) return node.sender;
		return isTelegramSelfSenderName(node.sender) ? `${node.sender} (Telegram sender)` : node.sender;
	};
	const recordMessageForReplyChain = (msg, threadId, botUserId) => messageCache.record({
		accountId,
		chatId: msg.chat.id,
		msg,
		...botUserId !== void 0 ? { botUserId } : {},
		...threadId != null ? { threadId } : {}
	});
	const buildReplyChainForMessage = (msg) => buildTelegramReplyChain({
		cache: messageCache,
		accountId,
		chatId: msg.chat.id,
		msg
	});
	const toReplyChainEntry = (node, ctx, media) => {
		const { sourceMessage: _sourceMessage, promptContextProjectionMarker: _promptContextProjectionMarker, ...entry } = node;
		const projectedEntry = {
			...entry,
			sender: resolvePromptSender(node, ctx)
		};
		if (!media?.path) return projectedEntry;
		const { mediaRef: _mediaRef, ...entryWithoutProviderMediaRef } = projectedEntry;
		return {
			...entryWithoutProviderMediaRef,
			mediaPath: media.path,
			mediaKind: media.kind,
			...media.contentType ? { mediaType: media.contentType } : {}
		};
	};
	const toPromptContextMessage = (node, ctx, flags, media) => ({
		message_id: node.messageId,
		thread_id: node.threadId,
		sender: resolvePromptSender(node, ctx),
		sender_id: node.senderId,
		sender_username: node.senderUsername,
		timestamp_ms: node.timestamp,
		body: node.body,
		media_type: media?.contentType ?? media?.kind ?? node.mediaType,
		media_path: media?.path,
		media_ref: media?.path ? void 0 : node.mediaRef,
		reply_to_id: node.replyToId,
		is_reply_target: flags?.replyTarget === true ? true : void 0
	});
	const buildPromptContextForMessage = async (ctx, msg, replyChainNodes, runtimeCfg, runtimeTelegramCfg, options, mediaByMessageId, selectedMessageIds) => {
		const currentBotUserId = ctx.me?.id ?? opts.botInfo?.id;
		const isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
		const groupHistoryLimit = Math.max(0, runtimeTelegramCfg.historyLimit ?? runtimeCfg.messages?.groupChat?.historyLimit ?? 50);
		const messageId = typeof msg.message_id === "number" ? String(msg.message_id) : void 0;
		const currentNode = await messageCache.get({
			accountId,
			chatId: msg.chat.id,
			messageId
		});
		const threadId = currentNode?.threadId ? Number(currentNode.threadId) : void 0;
		const sessionBeforeTimestampMs = options?.receivedAtMs ?? (msg.date ? msg.date * 1e3 : void 0);
		const isSessionBoundaryMessage = isTelegramSessionBoundaryCommandText(getTelegramTextParts(msg).text);
		const sessionPromptEntries = isGroup || isSessionBoundaryMessage ? [] : await buildTelegramSessionTranscriptPromptEntries({
			...resolveTelegramSessionState({
				chatId: msg.chat.id,
				isGroup: false,
				isForum: false,
				messageThreadId: msg.message_thread_id,
				botHasTopicsEnabled: resolveTelegramBotHasTopicsEnabled(ctx.me),
				senderId: msg.from?.id,
				runtimeCfg
			}),
			limit: 10,
			...sessionBeforeTimestampMs !== void 0 ? { beforeTimestampMs: sessionBeforeTimestampMs } : {},
			...options?.promptContextMinTimestampMs !== void 0 ? { minTimestampMs: options.promptContextMinTimestampMs } : {}
		});
		const conversationContext = isGroup && groupHistoryLimit <= 0 ? [] : await buildTelegramConversationContext({
			cache: messageCache,
			messageId,
			accountId,
			chatId: msg.chat.id,
			...Number.isFinite(threadId) ? { threadId } : {},
			replyChainNodes,
			recentLimit: isGroup ? groupHistoryLimit : 10,
			replyTargetWindowSize: 2,
			...options?.promptContextMinTimestampMs !== void 0 ? { minTimestampMs: options.promptContextMinTimestampMs } : {},
			...isGroup && options?.promptContextAmbientWatermark !== void 0 ? { includeNode: (node, flags) => flags?.replyTarget === true || isTelegramHistoryEntryAfterAmbientWatermark(node, options.promptContextAmbientWatermark) } : {}
		});
		const conversationContextById = new Map(conversationContext.flatMap((entry) => entry.node.messageId ? [[entry.node.messageId, entry]] : []));
		for (const [selectedMessageId, selection] of selectedMessageIds ?? []) {
			if (selection === "exclude") {
				conversationContextById.delete(selectedMessageId);
				continue;
			}
			if (selectedMessageId === messageId || conversationContextById.has(selectedMessageId)) continue;
			const node = await messageCache.get({
				accountId,
				chatId: msg.chat.id,
				messageId: selectedMessageId
			});
			if (node?.messageId) conversationContextById.set(node.messageId, { node });
		}
		const cacheEntries = Array.from(conversationContextById.values()).map((entry) => ({
			node: entry.node,
			message: toPromptContextMessage(entry.node, ctx, { replyTarget: entry.isReplyTarget }, entry.node.messageId ? mediaByMessageId?.get(entry.node.messageId) : void 0)
		}));
		const cacheMessages = cacheEntries.map((entry) => entry.message);
		const inboundTextKeys = /* @__PURE__ */ new Set();
		const legacyOutboundTextKeys = /* @__PURE__ */ new Set();
		for (const entry of cacheEntries) {
			const key = resolvePromptContextTextDedupeKey(entry.message);
			if (key === void 0) continue;
			if (hasLegacyPromptContextTimestamp(entry.node, currentBotUserId)) legacyOutboundTextKeys.add(key);
			else if (!isTelegramMessageFromCurrentBot(entry.node.sourceMessage, currentBotUserId)) inboundTextKeys.add(key);
		}
		const completeProjectionIds = resolveCompleteTelegramPromptContextProjectionIds(cacheEntries.map((entry) => entry.node.promptContextProjectionMarker));
		const sessionOnlyMessages = sessionPromptEntries.flatMap((entry) => {
			if (entry.role === "assistant") {
				if (entry.transcriptMessageId && completeProjectionIds.has(entry.transcriptMessageId)) return [];
				const key = resolvePromptContextTextDedupeKey(entry.message);
				return key !== void 0 && legacyOutboundTextKeys.has(key) ? [] : [entry.message];
			}
			const key = resolvePromptContextTextDedupeKey(entry.message);
			return key !== void 0 && inboundTextKeys.has(key) ? [] : [entry.message];
		});
		const promptMessages = [...sessionOnlyMessages, ...cacheMessages].toSorted((left, right) => (left.timestamp_ms ?? 0) - (right.timestamp_ms ?? 0));
		return promptMessages.length > 0 ? [{
			label: "Conversation context",
			source: sessionOnlyMessages.length > 0 ? "session" : "telegram",
			type: "chat_window",
			payload: {
				order: "chronological",
				relation: "selected_for_current_message",
				messages: promptMessages
			}
		}] : [];
	};
	return {
		recordMessageForReplyChain,
		buildReplyChainForMessage,
		toReplyChainEntry,
		buildPromptContextForMessage
	};
}
//#endregion
//#region extensions/telegram/src/bot-handlers.message-lifecycle.runtime.ts
function createTelegramMessageLifecycleRuntime({ accountId, runtime }) {
	const replayGuard = createTelegramMessageDispatchReplayGuard({ onDiskError: (error) => {
		runtime.error?.(danger(`[telegram] message dispatch dedupe store failed: ${String(error)}`));
	} });
	const normalizePromptContextMinTimestampMs = (timestampMs) => typeof timestampMs === "number" && Number.isFinite(timestampMs) ? timestampMs : void 0;
	const promptContextBoundaryOptions = (timestampMs, ambientWatermark) => {
		const promptContextMinTimestampMs = normalizePromptContextMinTimestampMs(timestampMs);
		return {
			...promptContextMinTimestampMs === void 0 ? {} : { promptContextMinTimestampMs },
			...ambientWatermark === void 0 ? {} : { promptContextAmbientWatermark: ambientWatermark }
		};
	};
	const latestPromptContextMinTimestampMs = (...timestamps) => {
		let latest;
		for (const timestampMs of timestamps) {
			const normalized = normalizePromptContextMinTimestampMs(timestampMs);
			if (normalized !== void 0) latest = latest === void 0 ? normalized : Math.max(latest, normalized);
		}
		return latest;
	};
	const latestPromptContextAmbientWatermark = (...watermarks) => watermarks.findLast((watermark) => watermark !== void 0);
	const mergeDispatchDedupeClaims = (...groups) => [...new Set(groups.flatMap((group) => group ?? []))];
	const releaseDispatchDedupeClaims = (claims, error) => {
		releaseTelegramMessageDispatchReplay({
			claims,
			error
		});
	};
	const commitDispatchDedupeClaims = async (claims, options = {}) => {
		await commitTelegramMessageDispatchReplay({
			guard: replayGuard,
			claims,
			...options
		});
	};
	const buildFailedProcessingResult = (error) => ({
		kind: "failed-retryable",
		error
	});
	const settleSpooledReplayParticipants = (participants, result) => {
		for (const participant of new Set(participants)) participant.settle(result);
	};
	const beginSpooledReplaySettlementHolds = (participants) => {
		const holds = [];
		for (const participant of new Set(participants)) {
			const hold = participant.beginSettlementHold();
			if (!hold) {
				for (const acquired of holds) acquired.release("replay-pending");
				const reason = participant.abortSignal.reason;
				throw reason instanceof Error ? reason : /* @__PURE__ */ new Error(`telegram spooled replay participant ${participant.key} settled before durable adoption`);
			}
			holds.push(hold);
		}
		return (mode) => {
			for (const hold of holds) hold.release(mode);
		};
	};
	const createSpooledReplayParticipantForBufferedWork = (key) => createTelegramSpooledReplayDeferredParticipant(key) ?? void 0;
	const spooledReplayOptions = (participants) => participants.length > 0 ? { spooledReplay: true } : {};
	const claimMessageDispatchDedupe = async (msg) => {
		const claim = await claimTelegramMessageDispatchReplay({
			guard: replayGuard,
			accountId,
			msg
		});
		if (claim.kind === "duplicate") {
			logVerbose(`telegram dispatch dedupe: skipped message ${msg.chat.id}:${msg.message_id}`);
			return { process: false };
		}
		return {
			process: true,
			claims: claim.kind === "claimed" ? [claim.handle] : []
		};
	};
	const buildSyntheticTextMessage = (params) => ({
		...params.base,
		...params.from ? { from: params.from } : {},
		text: params.text,
		caption: void 0,
		caption_entities: void 0,
		entities: void 0,
		...params.date != null ? { date: params.date } : {}
	});
	const buildSyntheticContext = (ctx, message) => ({
		message,
		me: ctx.me,
		getFile: ctx.getFile.bind(ctx)
	});
	const formatTelegramAmbientTranscriptBody = (messages) => {
		const lines = messages.map((msg) => {
			const text = getTelegramTextParts(msg).text.trim();
			const media = resolveTelegramPrimaryMedia(msg);
			const body = text || formatMediaPlaceholderText(media ? [{ kind: media.kind }] : [{}]);
			const prefix = [msg.message_id ? `#${msg.message_id}` : void 0, buildSenderName(msg)].filter(Boolean).join(" ");
			return prefix ? `${prefix}: ${body}` : body;
		});
		return lines.length > 0 ? lines.join("\n") : void 0;
	};
	return {
		normalizePromptContextMinTimestampMs,
		promptContextBoundaryOptions,
		latestPromptContextMinTimestampMs,
		latestPromptContextAmbientWatermark,
		mergeDispatchDedupeClaims,
		releaseDispatchDedupeClaims,
		commitDispatchDedupeClaims,
		buildFailedProcessingResult,
		settleSpooledReplayParticipants,
		beginSpooledReplaySettlementHolds,
		createSpooledReplayParticipantForBufferedWork,
		spooledReplayOptions,
		claimMessageDispatchDedupe,
		buildSyntheticTextMessage,
		buildSyntheticContext,
		formatTelegramAmbientTranscriptBody
	};
}
//#endregion
//#region extensions/telegram/src/bot-handlers.message-session.runtime.ts
function createTelegramMessageSessionRuntime({ accountId, resolveTelegramGroupConfig, telegramDeps }) {
	const resolveTelegramSessionState = (params) => {
		const resolvedThreadId = params.resolvedThreadId ?? resolveTelegramForumThreadId({
			isForum: params.isForum,
			messageThreadId: params.messageThreadId
		});
		const dmThreadId = !params.isGroup ? params.messageThreadId : void 0;
		const topicThreadId = resolvedThreadId ?? dmThreadId;
		const { topicConfig } = resolveTelegramGroupConfig(params.chatId, topicThreadId, params.runtimeCfg);
		const { route } = resolveTelegramConversationRoute({
			cfg: params.runtimeCfg,
			accountId,
			chatId: params.chatId,
			isGroup: params.isGroup,
			resolvedThreadId,
			replyThreadId: topicThreadId,
			senderId: params.senderId,
			topicAgentId: topicConfig?.agentId
		});
		const baseSessionKey = resolveTelegramConversationBaseSessionKey({
			cfg: params.runtimeCfg,
			route,
			chatId: params.chatId,
			isGroup: params.isGroup,
			senderId: params.senderId
		});
		const sessionKey = (shouldUseTelegramDmThreadSession({
			dmThreadId,
			botHasTopicsEnabled: params.botHasTopicsEnabled
		}) && dmThreadId != null ? resolveThreadSessionKeys({
			baseSessionKey,
			threadId: `${params.chatId}:${dmThreadId}`
		}) : null)?.sessionKey ?? baseSessionKey;
		const storePath = telegramDeps.resolveStorePath(params.runtimeCfg.session?.store, { agentId: route.agentId });
		const entry = (telegramDeps.getSessionEntry ?? getSessionEntry)({
			storePath,
			sessionKey
		});
		const storedOverride = resolveStoredModelOverride({
			sessionEntry: entry,
			sessionStore: Object.fromEntries((telegramDeps.listSessionEntries ?? listSessionEntries)({ storePath }).map(({ sessionKey: key, entry: value }) => [key, value])),
			sessionKey,
			defaultProvider: resolveDefaultModelForAgent({
				cfg: params.runtimeCfg,
				agentId: route.agentId
			}).provider
		});
		if (storedOverride) return {
			agentId: route.agentId,
			sessionEntry: entry,
			sessionKey,
			storePath,
			model: storedOverride.provider ? `${storedOverride.provider}/${storedOverride.model}` : storedOverride.model
		};
		const provider = entry?.modelProvider?.trim();
		const model = entry?.model?.trim();
		if (provider && model) return {
			agentId: route.agentId,
			sessionEntry: entry,
			sessionKey,
			storePath,
			model: `${provider}/${model}`
		};
		const modelCfg = params.runtimeCfg.agents?.defaults?.model;
		return {
			agentId: route.agentId,
			sessionEntry: entry,
			sessionKey,
			storePath,
			model: typeof modelCfg === "string" ? modelCfg : modelCfg?.primary
		};
	};
	const resolvePromptContextAmbientWatermark = (params) => {
		if (!params.isGroup) return;
		const key = (telegramDeps.resolveAmbientTranscriptWatermarkKey ?? resolveAmbientTranscriptWatermarkKey)({
			channel: "telegram",
			accountId,
			conversationId: String(params.chatId),
			...params.resolvedThreadId !== void 0 ? { threadId: params.resolvedThreadId } : {}
		});
		return (telegramDeps.readAmbientTranscriptWatermark ?? readAmbientTranscriptWatermark)({
			storePath: params.storePath,
			sessionKey: params.sessionKey,
			key
		});
	};
	return {
		resolveTelegramSessionState,
		resolvePromptContextAmbientWatermark
	};
}
//#endregion
//#region extensions/telegram/src/bot-handlers.message.runtime.ts
function createTelegramHandlerMessageRuntime({ cfg, accountId, bot, opts, telegramTransport, runtime, mediaMaxBytes, telegramCfg, resolveTelegramGroupConfig, processMessage, logger, telegramDeps }) {
	const { token } = opts;
	const mediaRuntimeOptions = resolveTelegramMediaRuntimeOptions({
		cfg,
		accountId,
		token,
		transport: telegramTransport
	});
	const mediaAbortSignal = opts.mediaAbortSignal && opts.fetchAbortSignal ? AbortSignal.any([opts.mediaAbortSignal, opts.fetchAbortSignal]) : opts.mediaAbortSignal ?? opts.fetchAbortSignal;
	const mediaRuntimeWithAbort = {
		...mediaRuntimeOptions,
		abortSignal: mediaAbortSignal
	};
	const sessionRuntime = createTelegramMessageSessionRuntime({
		accountId,
		resolveTelegramGroupConfig,
		telegramDeps
	});
	const { resolveTelegramSessionState, resolvePromptContextAmbientWatermark } = sessionRuntime;
	const { recordMessageForReplyChain, buildReplyChainForMessage, toReplyChainEntry, buildPromptContextForMessage } = createTelegramMessageContextRuntime({
		cfg,
		accountId,
		opts,
		telegramCfg,
		telegramDeps
	}, sessionRuntime);
	const { normalizePromptContextMinTimestampMs, promptContextBoundaryOptions, latestPromptContextMinTimestampMs, latestPromptContextAmbientWatermark, mergeDispatchDedupeClaims, releaseDispatchDedupeClaims, commitDispatchDedupeClaims, buildFailedProcessingResult, settleSpooledReplayParticipants, beginSpooledReplaySettlementHolds, createSpooledReplayParticipantForBufferedWork, spooledReplayOptions, claimMessageDispatchDedupe, buildSyntheticTextMessage, buildSyntheticContext, formatTelegramAmbientTranscriptBody } = createTelegramMessageLifecycleRuntime({
		accountId,
		runtime
	});
	const resolveReplyMediaForChain = async (ctx, chain, shouldHydrateMedia, durableMediaReplay) => {
		const replyMedia = [];
		const replyChain = [];
		for (const [index, node] of chain.entries()) {
			let mediaRef;
			const replyFileId = resolveInboundMediaFileId(node.sourceMessage);
			if (replyFileId && hasInboundMedia(node.sourceMessage) && await shouldHydrateMedia(node, index)) try {
				const media = await resolveMedia({
					ctx: {
						message: node.sourceMessage,
						me: ctx.me,
						getFile: async (signal) => await bot.api.getFile(replyFileId, signal)
					},
					maxBytes: mediaMaxBytes,
					...mediaRuntimeWithAbort
				});
				mediaRef = media ? {
					path: media.path,
					kind: media.kind,
					...media.contentType ? { contentType: media.contentType } : {},
					...media.stickerMetadata ? { stickerMetadata: media.stickerMetadata } : {}
				} : void 0;
			} catch (err) {
				if (mediaRuntimeWithAbort.abortSignal?.aborted && durableMediaReplay) {
					recordTelegramMessageProcessingResult({
						kind: "failed-retryable",
						error: err
					});
					throw err;
				}
				logger.warn({
					chatId: ctx.message.chat.id,
					error: String(err)
				}, "reply media fetch failed");
			}
			if (mediaRef) replyMedia.push(mediaRef);
			replyChain.push(toReplyChainEntry(node, ctx, mediaRef));
		}
		return {
			replyMedia,
			replyChain
		};
	};
	const processMessageWithReplyChain = async (params) => {
		let dispatchDedupeCommitted = false;
		let spooledReplayFinalResult;
		let spooledReplayFinalization;
		const durableMediaReplay = isTelegramSpooledReplayUpdate(params.ctx.update) || Boolean(params.spooledReplayParticipants?.length);
		const spooledReplay = params.options?.spooledReplay === true || durableMediaReplay;
		const explicitParticipants = params.spooledReplayParticipants ?? [];
		const frameParticipant = spooledReplay && explicitParticipants.length === 0 && params.options?.isolateSpooledReplaySettlement !== true ? getTelegramSpooledReplayDeferredParticipant() ?? createTelegramSpooledReplayDeferredParticipant(`message:${params.msg.chat.id}:${params.msg.message_id}`) ?? void 0 : void 0;
		const ingressSpooledReplayParticipants = [...explicitParticipants, ...frameParticipant ? [frameParticipant] : []];
		const processingParticipant = explicitParticipants.length > 0 ? createTelegramSpooledReplayParticipant(`message-processing:${params.msg.chat.id}:${params.msg.message_id}`) : frameParticipant;
		if (processingParticipant && explicitParticipants.length > 0) for (const participant of explicitParticipants) participant.task.then((result) => {
			processingParticipant.settle(result);
		});
		const spooledReplayParticipants = [.../* @__PURE__ */ new Set([...ingressSpooledReplayParticipants, ...processingParticipant ? [processingParticipant] : []])];
		const finalizeSpooledReplayResult = async (result) => {
			if (spooledReplayFinalResult) return spooledReplayFinalResult;
			if (spooledReplayFinalization) return await spooledReplayFinalization;
			const finalization = (async () => {
				const finalized = result;
				if (result.kind === "completed") {
					const releaseSettlementHolds = beginSpooledReplaySettlementHolds(ingressSpooledReplayParticipants);
					try {
						await commitDispatchDedupeClaims(params.dispatchDedupeClaims ?? [], { requirePersistent: true });
					} catch (error) {
						releaseSettlementHolds("replay-pending");
						throw error;
					}
					releaseSettlementHolds("discard-pending");
					dispatchDedupeCommitted = true;
				} else releaseDispatchDedupeClaims(params.dispatchDedupeClaims ?? [], result.kind === "failed-retryable" ? result.error : void 0);
				spooledReplayFinalResult = finalized;
				settleSpooledReplayParticipants(spooledReplayParticipants, finalized);
				return finalized;
			})();
			spooledReplayFinalization = finalization;
			try {
				return await finalization;
			} finally {
				if (!spooledReplayFinalResult && spooledReplayFinalization === finalization) spooledReplayFinalization = void 0;
			}
		};
		try {
			const runtimeCfg = telegramDeps.getRuntimeConfig();
			const runtimeTelegramCfg = resolveTelegramAccount({
				cfg: runtimeCfg,
				accountId
			}).config;
			const replyChainNodes = await buildReplyChainForMessage(params.msg);
			const isGroupConversation = params.msg.chat.type === "group" || params.msg.chat.type === "supergroup";
			const scopedThreadId = resolveTelegramForumThreadId({
				isForum: params.msg.chat.type === "supergroup" && Boolean(params.msg.chat.is_forum || params.msg.is_topic_message),
				messageThreadId: params.msg.message_thread_id
			});
			const { groupConfig, topicConfig } = resolveTelegramScopedGroupConfig(runtimeTelegramCfg, params.msg.chat.id, scopedThreadId);
			const configuredGroupAllowFrom = firstDefined(topicConfig?.allowFrom, groupConfig?.allowFrom) ?? opts.groupAllowFrom ?? runtimeTelegramCfg.groupAllowFrom ?? runtimeTelegramCfg.allowFrom ?? opts.allowFrom;
			const contextVisibilityMode = resolveChannelContextVisibilityMode({
				cfg: runtimeCfg,
				channel: "telegram",
				accountId
			});
			const shouldHydrateReplyMedia = async (node, index) => {
				if (!isGroupConversation) return true;
				const effectiveAllow = normalizeAllowFrom(await expandTelegramAllowFromWithAccessGroups({
					cfg: runtimeCfg,
					allowFrom: configuredGroupAllowFrom,
					accountId,
					senderId: node.senderId
				}));
				const senderAllowed = effectiveAllow.hasEntries ? isSenderAllowed({
					allow: effectiveAllow,
					senderId: node.senderId,
					senderUsername: node.senderUsername
				}) : true;
				return evaluateSupplementalContextVisibility({
					mode: contextVisibilityMode,
					kind: index === 0 ? "quote" : "thread",
					senderAllowed
				}).include;
			};
			const { replyMedia, replyChain } = await resolveReplyMediaForChain(params.ctx, replyChainNodes, shouldHydrateReplyMedia, durableMediaReplay);
			const promptContextMediaByMessageId = /* @__PURE__ */ new Map();
			const currentMessageId = typeof params.msg.message_id === "number" ? String(params.msg.message_id) : void 0;
			for (const [index, media] of params.allMedia.entries()) {
				const messageId = media.sourceMessageId ?? (index === 0 ? currentMessageId : void 0);
				const promptMediaPath = media.path ? resolveTelegramPromptMediaPath(media.path) : void 0;
				if (messageId && promptMediaPath) promptContextMediaByMessageId.set(messageId, {
					...media,
					path: promptMediaPath
				});
			}
			for (const entry of replyChain) {
				const promptMediaPath = entry.mediaPath ? resolveTelegramPromptMediaPath(entry.mediaPath) : void 0;
				if (entry.messageId && entry.mediaPath && promptMediaPath) promptContextMediaByMessageId.set(entry.messageId, {
					path: promptMediaPath,
					kind: entry.mediaKind ?? kindFromMime(entry.mediaType) ?? "document",
					...entry.mediaType ? { contentType: entry.mediaType } : {}
				});
			}
			const promptContext = await buildPromptContextForMessage(params.ctx, params.msg, replyChainNodes, runtimeCfg, runtimeTelegramCfg, params.options, promptContextMediaByMessageId, params.promptContextMessageSelection);
			const result = await processMessage(params.ctx, params.allMedia, params.storeAllowFrom, {
				cfg: runtimeCfg,
				telegramCfg: runtimeTelegramCfg,
				onDispatchStart: async () => {
					await commitDispatchDedupeClaims(params.dispatchDedupeClaims ?? []);
					dispatchDedupeCommitted = true;
				},
				spooledReplayAbortSignal: params.spooledReplayAbortSignal,
				spooledReplayParticipant: processingParticipant,
				finalizeSpooledReplayResult: async (processingResult) => await finalizeSpooledReplayResult(processingResult),
				completeSpooledReplayAfterIrrevocableAdoption: async () => {
					return await finalizeSpooledReplayResult({ kind: "completed" });
				}
			}, params.options, replyMedia, replyChain, promptContext);
			if (spooledReplay) return await finalizeSpooledReplayResult(result);
			if (result.kind === "completed" && !dispatchDedupeCommitted) await commitDispatchDedupeClaims(params.dispatchDedupeClaims ?? []);
			else if (result.kind !== "completed" && !dispatchDedupeCommitted) releaseDispatchDedupeClaims(params.dispatchDedupeClaims ?? []);
			return result;
		} catch (err) {
			if (spooledReplay) return await finalizeSpooledReplayResult(buildFailedProcessingResult(err));
			if (!dispatchDedupeCommitted) releaseDispatchDedupeClaims(params.dispatchDedupeClaims ?? [], err);
			throw err;
		}
	};
	return {
		mediaRuntimeWithAbort,
		normalizePromptContextMinTimestampMs,
		promptContextBoundaryOptions,
		latestPromptContextMinTimestampMs,
		latestPromptContextAmbientWatermark,
		mergeDispatchDedupeClaims,
		releaseDispatchDedupeClaims,
		buildFailedProcessingResult,
		settleSpooledReplayParticipants,
		createSpooledReplayParticipantForBufferedWork,
		spooledReplayOptions,
		claimMessageDispatchDedupe,
		buildSyntheticTextMessage,
		buildSyntheticContext,
		formatTelegramAmbientTranscriptBody,
		resolveTelegramSessionState,
		resolvePromptContextAmbientWatermark,
		recordMessageForReplyChain,
		processMessageWithReplyChain
	};
}
//#endregion
//#region extensions/telegram/src/group-migration.ts
function resolveAccountGroups(cfg, accountId) {
	if (!accountId) return {};
	const normalized = normalizeAccountId(accountId);
	const accounts = cfg.channels?.telegram?.accounts;
	if (!accounts || typeof accounts !== "object") return {};
	const exact = accounts[normalized];
	if (exact?.groups) return { groups: exact.groups };
	const matchKey = Object.keys(accounts).find((key) => normalizeLowercaseStringOrEmpty(key) === normalizeLowercaseStringOrEmpty(normalized));
	return { groups: matchKey ? accounts[matchKey]?.groups : void 0 };
}
function migrateTelegramGroupsInPlace(groups, oldChatId, newChatId) {
	if (!groups) return {
		migrated: false,
		skippedExisting: false
	};
	if (oldChatId === newChatId) return {
		migrated: false,
		skippedExisting: false
	};
	if (!Object.hasOwn(groups, oldChatId)) return {
		migrated: false,
		skippedExisting: false
	};
	if (Object.hasOwn(groups, newChatId)) return {
		migrated: false,
		skippedExisting: true
	};
	groups[newChatId] = expectDefined(groups[oldChatId], "owned Telegram group config key");
	delete groups[oldChatId];
	return {
		migrated: true,
		skippedExisting: false
	};
}
function migrateTelegramGroupConfig(params) {
	const scopes = [];
	let migrated = false;
	let skippedExisting = false;
	const migrationTargets = [{
		scope: "account",
		groups: resolveAccountGroups(params.cfg, params.accountId).groups
	}, {
		scope: "global",
		groups: params.cfg.channels?.telegram?.groups
	}];
	for (const target of migrationTargets) {
		const result = migrateTelegramGroupsInPlace(target.groups, params.oldChatId, params.newChatId);
		if (result.migrated) {
			migrated = true;
			scopes.push(target.scope);
		}
		if (result.skippedExisting) skippedExisting = true;
	}
	return {
		migrated,
		skippedExisting,
		scopes
	};
}
//#endregion
//#region extensions/telegram/src/bot-handlers.migration.runtime.ts
function registerTelegramMigrationHandler({ cfg, accountId, bot, runtime, telegramDeps, shouldSkipUpdate }) {
	bot.on("message:migrate_to_chat_id", async (ctx) => {
		try {
			const msg = ctx.message;
			if (!msg?.migrate_to_chat_id) return;
			if (shouldSkipUpdate(ctx)) return;
			const oldChatId = String(msg.chat.id);
			const newChatId = String(msg.migrate_to_chat_id);
			const chatTitle = msg.chat.title ?? "Unknown";
			runtime.log?.(warn(`[telegram] Group migrated: "${chatTitle}" ${oldChatId} → ${newChatId}`));
			if (!resolveChannelConfigWrites({
				cfg,
				channelId: "telegram",
				accountId
			})) {
				runtime.log?.(warn("[telegram] Config writes disabled; skipping group config migration."));
				return;
			}
			const migration = migrateTelegramGroupConfig({
				cfg: telegramDeps.getRuntimeConfig(),
				accountId,
				oldChatId,
				newChatId
			});
			if (migration.migrated) {
				runtime.log?.(warn(`[telegram] Migrating group config from ${oldChatId} to ${newChatId}`));
				migrateTelegramGroupConfig({
					cfg,
					accountId,
					oldChatId,
					newChatId
				});
				await mutateConfigFile({
					afterWrite: { mode: "auto" },
					mutate: (draft) => {
						migrateTelegramGroupConfig({
							cfg: draft,
							accountId,
							oldChatId,
							newChatId
						});
					}
				});
				runtime.log?.(warn(`[telegram] Group config migrated and saved successfully`));
			} else if (migration.skippedExisting) runtime.log?.(warn(`[telegram] Group config already exists for ${newChatId}; leaving ${oldChatId} unchanged`));
			else runtime.log?.(warn(`[telegram] No config found for old group ID ${oldChatId}, migration logged only`));
		} catch (err) {
			runtime.error?.(danger(`[telegram] Group migration handler failed: ${String(err)}`));
			throw err;
		}
	});
}
//#endregion
//#region extensions/telegram/src/bot-handlers.reaction.runtime.ts
function registerTelegramReactionHandler({ accountId, bot, runtime, telegramDeps, shouldSkipUpdate }, authorizationRuntime) {
	const { resolveTelegramEventAuthorizationContext, authorizeTelegramEventSender } = authorizationRuntime;
	bot.on("message_reaction", async (ctx) => {
		try {
			const reaction = ctx.messageReaction;
			if (!reaction) return;
			if (shouldSkipUpdate(ctx)) return;
			const chatId = reaction.chat.id;
			const messageId = reaction.message_id;
			const user = reaction.user;
			const senderId = user?.id != null ? String(user.id) : "";
			const senderUsername = user?.username ?? "";
			const isGroup = reaction.chat.type === "group" || reaction.chat.type === "supergroup";
			const isForum = reaction.chat.is_forum === true;
			const authorizationCfg = telegramDeps.getRuntimeConfig();
			const reactionMode = resolveTelegramAccount({
				cfg: authorizationCfg,
				accountId
			}).config.reactionNotifications ?? "own";
			if (reactionMode === "off") return;
			if (user?.is_bot) return;
			if (reactionMode === "own" && !telegramDeps.wasSentByBot(chatId, messageId, authorizationCfg)) {
				logVerbose(`telegram: skipped reaction on msg ${messageId} in chat ${chatId} (own mode, not sent by bot)`);
				return;
			}
			const eventAuthContext = await resolveTelegramEventAuthorizationContext({
				cfg: authorizationCfg,
				chatId,
				isGroup,
				isForum,
				senderId
			});
			if (!await authorizeTelegramEventSender({
				chatId,
				chatTitle: reaction.chat.title,
				isGroup,
				senderId,
				senderUsername,
				mode: "reaction",
				context: eventAuthContext
			})) return;
			if (!isGroup) {
				if (eventAuthContext.groupConfig?.requireTopic === true) {
					logVerbose(`Blocked telegram reaction in DM ${chatId}: requireTopic=true but topic unknown for reactions`);
					return;
				}
			}
			const oldEmojis = new Set(reaction.old_reaction.filter((r) => r.type === "emoji").map((r) => r.emoji));
			const addedReactions = reaction.new_reaction.filter((r) => r.type === "emoji").filter((r) => !oldEmojis.has(r.emoji));
			if (addedReactions.length === 0) return;
			const senderName = user ? [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.username : void 0;
			const senderUsernameLabel = user?.username ? `@${user.username}` : void 0;
			let senderLabel = senderName;
			if (senderName && senderUsernameLabel) senderLabel = `${senderName} (${senderUsernameLabel})`;
			else if (!senderName && senderUsernameLabel) senderLabel = senderUsernameLabel;
			if (!senderLabel && user?.id) senderLabel = `id:${user.id}`;
			senderLabel = senderLabel || "unknown";
			const resolvedThreadId = isForum ? resolveTelegramForumThreadId({
				isForum,
				messageThreadId: void 0
			}) : void 0;
			const peerId = isGroup ? buildTelegramGroupPeerId(chatId, resolvedThreadId) : String(chatId);
			const parentPeer = buildTelegramParentPeer({
				isGroup,
				resolvedThreadId,
				chatId
			});
			const sessionKey = resolveAgentRoute({
				cfg: eventAuthContext.cfg,
				channel: "telegram",
				accountId,
				peer: {
					kind: isGroup ? "group" : "direct",
					id: peerId
				},
				parentPeer
			}).sessionKey;
			for (const r of addedReactions) {
				const emoji = r.emoji;
				const text = `Telegram reaction added: ${emoji} by ${senderLabel} on msg ${messageId}`;
				telegramDeps.enqueueSystemEvent(text, {
					sessionKey,
					contextKey: `telegram:reaction:add:${chatId}:${messageId}:${user?.id ?? "anon"}:${emoji}`
				});
				logVerbose(`telegram: reaction event enqueued: ${text}`);
			}
		} catch (err) {
			runtime.error?.(danger(`telegram reaction handler failed: ${String(err)}`));
			throw err;
		}
	});
}
//#endregion
//#region extensions/telegram/src/bot-handlers.runtime.ts
const registerTelegramHandlers = (params) => {
	const messageRuntime = createTelegramHandlerMessageRuntime(params);
	const authorizationRuntime = createTelegramHandlerAuthorizationRuntime(params);
	const inboundRuntime = createTelegramHandlerInboundRuntime(params, messageRuntime);
	registerTelegramReactionHandler(params, authorizationRuntime);
	registerTelegramCallbackQueryHandler(params, messageRuntime, authorizationRuntime);
	registerTelegramMigrationHandler(params);
	registerTelegramMessageHandlers(params, messageRuntime, authorizationRuntime, inboundRuntime);
};
//#endregion
//#region extensions/telegram/src/bot-update-tracker.ts
function sortedIds(ids) {
	return [...ids].toSorted((a, b) => a - b);
}
const ACCEPTED_UPDATE_ID_RETENTION = 1e4;
function createTelegramUpdateTracker(options = {}) {
	const initialUpdateId = typeof options.initialUpdateId === "number" ? options.initialUpdateId : null;
	const persistenceFloorUpdateId = typeof options.persistenceFloorUpdateId === "number" ? options.persistenceFloorUpdateId : initialUpdateId;
	const ackPolicy = options.ackPolicy ?? "after_receive_record";
	const recentUpdates = createTelegramUpdateDedupe();
	const pendingUpdateKeys = /* @__PURE__ */ new Set();
	const activeHandledUpdateKeys = /* @__PURE__ */ new Map();
	const pendingUpdateIds = /* @__PURE__ */ new Set();
	const failedUpdateIds = /* @__PURE__ */ new Set();
	const acceptedUpdateIds = /* @__PURE__ */ new Set();
	let highestAcceptedUpdateId = initialUpdateId;
	let highestPersistedAcceptedUpdateId = persistenceFloorUpdateId;
	let highestPersistenceRequestedUpdateId = persistenceFloorUpdateId;
	let highestCompletedUpdateId = persistenceFloorUpdateId;
	let persistInFlight = false;
	let persistTargetUpdateId = null;
	const skip = (key) => {
		options.onSkip?.(key);
	};
	const pruneAcceptedUpdateIds = () => {
		if (highestAcceptedUpdateId === null && highestPersistedAcceptedUpdateId === null) return;
		const windowFloor = highestAcceptedUpdateId === null ? Number.NEGATIVE_INFINITY : highestAcceptedUpdateId - ACCEPTED_UPDATE_ID_RETENTION;
		const persistedFloor = highestPersistedAcceptedUpdateId === null ? Number.NEGATIVE_INFINITY : highestPersistedAcceptedUpdateId;
		const pruneAtOrBelow = Math.max(persistedFloor, windowFloor);
		for (const id of acceptedUpdateIds) {
			if (id > pruneAtOrBelow) continue;
			if (pendingUpdateIds.has(id) || failedUpdateIds.has(id)) continue;
			acceptedUpdateIds.delete(id);
		}
	};
	const drainPersistQueue = async () => {
		const persist = options.onAcceptedUpdateId;
		if (persistInFlight || typeof persist !== "function") return;
		persistInFlight = true;
		try {
			while (persistTargetUpdateId !== null) {
				const updateId = persistTargetUpdateId;
				persistTargetUpdateId = null;
				try {
					await persist(updateId);
					if (highestPersistedAcceptedUpdateId === null || updateId > highestPersistedAcceptedUpdateId) {
						highestPersistedAcceptedUpdateId = updateId;
						pruneAcceptedUpdateIds();
					}
				} catch (err) {
					options.onPersistError?.(err);
				}
			}
		} finally {
			persistInFlight = false;
		}
	};
	const requestPersistAcceptedUpdateId = (updateId) => {
		if (typeof options.onAcceptedUpdateId !== "function") return;
		if (highestPersistenceRequestedUpdateId !== null && updateId <= highestPersistenceRequestedUpdateId) return;
		highestPersistenceRequestedUpdateId = updateId;
		persistTargetUpdateId = updateId;
		drainPersistQueue().catch((err) => {
			options.onPersistError?.(err);
		});
	};
	const acceptUpdateId = (updateId) => {
		acceptedUpdateIds.add(updateId);
		if (highestAcceptedUpdateId === null || updateId > highestAcceptedUpdateId) highestAcceptedUpdateId = updateId;
		pruneAcceptedUpdateIds();
	};
	function resolveSafeCompletedUpdateId() {
		if (highestCompletedUpdateId === null) return null;
		let safeCompletedUpdateId = highestCompletedUpdateId;
		for (const updateId of pendingUpdateIds) {
			if (persistenceFloorUpdateId !== null && updateId <= persistenceFloorUpdateId) continue;
			if (updateId <= safeCompletedUpdateId) safeCompletedUpdateId = updateId - 1;
		}
		for (const updateId of failedUpdateIds) {
			if (persistenceFloorUpdateId !== null && updateId <= persistenceFloorUpdateId) continue;
			if (updateId <= safeCompletedUpdateId) safeCompletedUpdateId = updateId - 1;
		}
		return safeCompletedUpdateId;
	}
	const persistUpdateIdAfterAck = async (updateId) => {
		const persistUpdateId = ackPolicy === "after_agent_dispatch" ? resolveSafeCompletedUpdateId() : updateId;
		if (persistUpdateId !== null) requestPersistAcceptedUpdateId(persistUpdateId);
	};
	const ackUpdateAfterStage = (receiveContext, stage) => {
		if (!receiveContext?.shouldAckAfter(stage)) return;
		receiveContext.ack().catch((err) => {
			options.onPersistError?.(err);
		});
	};
	const beginUpdate = (ctx) => {
		const updateId = resolveTelegramUpdateId(ctx);
		const updateKey = buildTelegramUpdateKey(ctx);
		if (typeof updateId === "number") {
			if (failedUpdateIds.has(updateId)) failedUpdateIds.delete(updateId);
			else if (initialUpdateId !== null && updateId <= initialUpdateId) {
				skip(`update:${updateId}`);
				return {
					accepted: false,
					reason: "accepted-watermark"
				};
			} else if (acceptedUpdateIds.has(updateId)) {
				skip(`update:${updateId}`);
				return {
					accepted: false,
					reason: "accepted-watermark"
				};
			}
		}
		if (updateKey) {
			if (pendingUpdateKeys.has(updateKey) || recentUpdates.peek(updateKey)) {
				skip(updateKey);
				return {
					accepted: false,
					reason: "semantic-dedupe"
				};
			}
			pendingUpdateKeys.add(updateKey);
			activeHandledUpdateKeys.set(updateKey, false);
		}
		let receiveContext;
		if (typeof updateId === "number") {
			pendingUpdateIds.add(updateId);
			acceptUpdateId(updateId);
			receiveContext = createMessageReceiveContext({
				id: updateKey ?? `telegram:update:${updateId}`,
				channel: "telegram",
				message: ctx,
				ackPolicy,
				onAck: () => persistUpdateIdAfterAck(updateId)
			});
			ackUpdateAfterStage(receiveContext, "receive_record");
		}
		return {
			accepted: true,
			update: {
				...updateKey ? { key: updateKey } : {},
				...typeof updateId === "number" ? { updateId } : {},
				...receiveContext ? { receiveContext } : {}
			}
		};
	};
	const finishUpdate = (update, finish) => {
		if (update.key) {
			activeHandledUpdateKeys.delete(update.key);
			if (finish.completed) recentUpdates.check(update.key);
			pendingUpdateKeys.delete(update.key);
		}
		if (typeof update.updateId === "number") {
			pendingUpdateIds.delete(update.updateId);
			if (finish.completed) {
				failedUpdateIds.delete(update.updateId);
				if (highestCompletedUpdateId === null || update.updateId > highestCompletedUpdateId) highestCompletedUpdateId = update.updateId;
				ackUpdateAfterStage(update.receiveContext, "agent_dispatch");
			} else {
				failedUpdateIds.add(update.updateId);
				update.receiveContext?.nack(/* @__PURE__ */ new Error("Telegram update handler did not complete")).catch((err) => {
					options.onPersistError?.(err);
				});
			}
			pruneAcceptedUpdateIds();
		}
	};
	const shouldSkipHandlerDispatch = (ctx) => {
		const updateId = resolveTelegramUpdateId(ctx);
		if (typeof updateId === "number" && initialUpdateId !== null && updateId <= initialUpdateId) return true;
		const key = buildTelegramUpdateKey(ctx);
		if (!key) return false;
		const handled = activeHandledUpdateKeys.get(key);
		if (handled != null) {
			if (handled) {
				skip(key);
				return true;
			}
			activeHandledUpdateKeys.set(key, true);
			return false;
		}
		const skipped = recentUpdates.check(key);
		if (skipped) skip(key);
		return skipped;
	};
	const getState = () => ({
		highestAcceptedUpdateId,
		highestPersistedAcceptedUpdateId,
		highestCompletedUpdateId,
		safeCompletedUpdateId: resolveSafeCompletedUpdateId(),
		pendingUpdateIds: sortedIds(pendingUpdateIds),
		failedUpdateIds: sortedIds(failedUpdateIds)
	});
	return {
		beginUpdate,
		finishUpdate,
		getState,
		shouldSkipHandlerDispatch
	};
}
//#endregion
//#region extensions/telegram/src/raw-update-log.ts
const MAX_RAW_UPDATE_STRING = 500;
const MAX_RAW_UPDATE_ARRAY = 20;
const MAX_RAW_UPDATE_CHARS = 8e3;
const REDACTED_TELEGRAM_FIELD = "[redacted]";
const TELEGRAM_RAW_UPDATE_ALWAYS_REDACT_KEYS = /* @__PURE__ */ new Set([
	"added_to_attachment_menu",
	"author_signature",
	"caption",
	"chat_instance",
	"data",
	"email",
	"bio",
	"description",
	"explanation",
	"file_id",
	"file_unique_id",
	"first_name",
	"invite_link",
	"is_premium",
	"language_code",
	"latitude",
	"last_name",
	"longitude",
	"name",
	"phone_number",
	"question",
	"query",
	"text",
	"title",
	"url",
	"username",
	"vcard"
]);
const TELEGRAM_RAW_UPDATE_ALLOWED_ID_KEYS = /* @__PURE__ */ new Set(["message_id", "update_id"]);
const TELEGRAM_RAW_UPDATE_ID_REDACT_KEYS = /* @__PURE__ */ new Set([
	"chat_id",
	"custom_emoji_id",
	"inline_message_id",
	"migrate_from_chat_id",
	"migrate_to_chat_id",
	"option_ids",
	"poll_id",
	"sender_chat_id",
	"user_id",
	"user_chat_id"
]);
function shouldRedactTelegramRawUpdateValue(key, parentKey) {
	if (!key) return false;
	if (TELEGRAM_RAW_UPDATE_ALWAYS_REDACT_KEYS.has(key)) return true;
	if (TELEGRAM_RAW_UPDATE_ALLOWED_ID_KEYS.has(key)) return false;
	if (TELEGRAM_RAW_UPDATE_ID_REDACT_KEYS.has(key)) return true;
	if (key === "id" || key.endsWith("_id") || key.endsWith("_ids")) return parentKey !== void 0;
	return false;
}
function isTelegramUserObject(value) {
	return typeof value.id === "number" && typeof value.is_bot === "boolean" && typeof value.first_name === "string";
}
function formatTelegramRawUpdateForLog(update) {
	const seen = /* @__PURE__ */ new WeakSet();
	const transform = (value, key = "", parentKey) => {
		if (shouldRedactTelegramRawUpdateValue(key, parentKey)) return REDACTED_TELEGRAM_FIELD;
		if (typeof value === "string") return value.length > MAX_RAW_UPDATE_STRING ? `${truncateUtf16Safe$1(value, MAX_RAW_UPDATE_STRING)}...` : value;
		if (Array.isArray(value)) {
			const items = value.slice(0, MAX_RAW_UPDATE_ARRAY).map((item) => transform(item, key, key));
			if (value.length > MAX_RAW_UPDATE_ARRAY) items.push(`...(${value.length - MAX_RAW_UPDATE_ARRAY} more)`);
			return items;
		}
		if (value && typeof value === "object") {
			if (seen.has(value)) return "[Circular]";
			seen.add(value);
			const record = value;
			if (isTelegramUserObject(record)) return REDACTED_TELEGRAM_FIELD;
			const redacted = {};
			for (const [entryKey, entryValue] of Object.entries(record)) redacted[entryKey] = transform(entryValue, entryKey, key);
			return redacted;
		}
		return value;
	};
	const raw = JSON.stringify(transform(update ?? null));
	return raw.length > MAX_RAW_UPDATE_CHARS ? `${truncateUtf16Safe$1(raw, MAX_RAW_UPDATE_CHARS)}...` : raw;
}
//#endregion
//#region extensions/telegram/src/sendchataction-401-backoff.ts
const BACKOFF_POLICY = {
	initialMs: 1e3,
	maxMs: 3e5,
	factor: 2,
	jitter: .1
};
function is401Error(error) {
	if (!error) return false;
	if (typeof error === "object" && error !== null && "error_code" in error && typeof error.error_code === "number") return error.error_code === 401;
	return normalizeLowercaseStringOrEmpty(error instanceof Error ? error.message : JSON.stringify(error)).includes("unauthorized");
}
var TelegramSendChatActionTransientCooldownError = class extends Error {
	constructor(remainingMs) {
		super(`sendChatAction transient cooldown active for ${Math.ceil(remainingMs)}ms`);
		this.name = "TelegramSendChatActionTransientCooldownError";
	}
};
function isTransientSendChatActionError(error) {
	return isTelegramRateLimitError(error) || isTelegramServerError(error) || isRecoverableTelegramNetworkError(error, { context: "action" });
}
function resolveTransientCooldownMs(error, attempt) {
	const retryAfterMs = readTelegramRetryAfterMs(error);
	if (retryAfterMs !== void 0 && retryAfterMs > 0) return retryAfterMs;
	return computeBackoff(BACKOFF_POLICY, attempt);
}
/**
* Creates a GLOBAL (per-account) handler for sendChatAction that tracks 401 and
* transient errors across all message contexts. This prevents the infinite loop
* that caused Telegram to delete bots (issue #27092).
*
* When a 401 occurs, exponential backoff is applied (1s → 2s → 4s → ... → 5min).
* After maxConsecutive401 failures (default 10), all sendChatAction calls are
* suspended until reset() is called.
*/
function createTelegramSendChatActionHandler({ sendChatActionFn, logger, maxConsecutive401 = 10, minIntervalMs = 0, now = () => Date.now() }) {
	let consecutive401Failures = 0;
	let consecutiveTransientFailures = 0;
	let suspended = false;
	let transientCooldownUntilMs = 0;
	const blockedUntilByKey = /* @__PURE__ */ new Map();
	const clearTransientCooldown = () => {
		consecutiveTransientFailures = 0;
		transientCooldownUntilMs = 0;
	};
	const reset = () => {
		consecutive401Failures = 0;
		clearTransientCooldown();
		suspended = false;
		blockedUntilByKey.clear();
	};
	const sendChatAction = async (chatId, action, threadParams) => {
		if (suspended) return;
		const attemptedAt = now();
		const remainingTransientCooldownMs = transientCooldownUntilMs - attemptedAt;
		if (remainingTransientCooldownMs > 0) throw new TelegramSendChatActionTransientCooldownError(remainingTransientCooldownMs);
		const key = minIntervalMs > 0 ? `${String(chatId)}:${action}` : void 0;
		if (key) {
			const blockedUntil = blockedUntilByKey.get(key);
			if (blockedUntil !== void 0 && attemptedAt < blockedUntil) return;
			blockedUntilByKey.set(key, Number.POSITIVE_INFINITY);
		}
		if (consecutive401Failures > 0) {
			const backoffMs = computeBackoff(BACKOFF_POLICY, consecutive401Failures);
			logger(`sendChatAction backoff: waiting ${backoffMs}ms before retry (failure ${consecutive401Failures}/${maxConsecutive401})`);
			await sleepWithAbort(backoffMs);
		}
		try {
			await sendChatActionFn(chatId, action, threadParams);
			if (consecutive401Failures > 0) {
				logger(`sendChatAction recovered after ${consecutive401Failures} consecutive 401 failures`);
				consecutive401Failures = 0;
			}
			clearTransientCooldown();
		} catch (error) {
			if (is401Error(error)) {
				clearTransientCooldown();
				consecutive401Failures++;
				if (consecutive401Failures >= maxConsecutive401) {
					suspended = true;
					logger(`CRITICAL: sendChatAction suspended after ${consecutive401Failures} consecutive 401 errors. Bot token is likely invalid. Telegram may DELETE the bot if requests continue. Replace the token and restart: openclaw channels restart telegram`);
				} else logger(`sendChatAction 401 error (${consecutive401Failures}/${maxConsecutive401}). Retrying with exponential backoff.`);
			} else if (isTransientSendChatActionError(error)) {
				consecutiveTransientFailures++;
				const cooldownMs = resolveTransientCooldownMs(error, consecutiveTransientFailures);
				const cooldownStartedAt = now();
				const coalescingUntilMs = key ? attemptedAt + minIntervalMs : 0;
				transientCooldownUntilMs = Math.max(cooldownStartedAt + cooldownMs, coalescingUntilMs);
				const effectiveCooldownMs = Math.max(0, transientCooldownUntilMs - cooldownStartedAt);
				logger(`sendChatAction transient error (${consecutiveTransientFailures}). Cooling down ${effectiveCooldownMs}ms before retry.`);
			} else clearTransientCooldown();
			throw error;
		} finally {
			if (key) blockedUntilByKey.set(key, attemptedAt + minIntervalMs);
		}
	};
	return {
		sendChatAction,
		isSuspended: () => suspended,
		reset
	};
}
//#endregion
//#region extensions/telegram/src/bot-core.ts
const DEFAULT_TELEGRAM_BOT_RUNTIME = {
	Bot: Bot$1,
	sequentialize,
	apiThrottler
};
const TELEGRAM_TYPING_COALESCE_MS = 4e3;
function createTelegramBotCore(opts) {
	const botRuntime = DEFAULT_TELEGRAM_BOT_RUNTIME;
	const runtime = opts.runtime ?? createNonExitingRuntime();
	const telegramDeps = opts.telegramDeps;
	const cfg = opts.config ?? telegramDeps.getRuntimeConfig();
	const account = resolveTelegramAccount({
		cfg,
		accountId: opts.accountId
	});
	const threadBindingManager = resolveThreadBindingSpawnPolicy({
		cfg,
		channel: "telegram",
		accountId: account.accountId,
		kind: "subagent"
	}).enabled ? createTelegramThreadBindingManager({
		cfg,
		accountId: account.accountId,
		idleTimeoutMs: resolveThreadBindingIdleTimeoutMsForChannel({
			cfg,
			channel: "telegram",
			accountId: account.accountId
		}),
		maxAgeMs: resolveThreadBindingMaxAgeMsForChannel({
			cfg,
			channel: "telegram",
			accountId: account.accountId
		})
	}) : null;
	const telegramCfg = account.config;
	const telegramTransport = opts.telegramTransport ?? resolveTelegramTransport(opts.proxyFetch, { network: telegramCfg.network });
	const finalFetch = createTelegramClientFetch({
		fetchImpl: asTelegramClientFetch(telegramTransport.fetch),
		shutdownSignal: opts.fetchAbortSignal,
		transport: telegramTransport
	});
	const timeoutSeconds = resolveTelegramClientTimeoutSeconds({
		value: void 0,
		minimum: resolveTelegramClientTimeoutMinimumSeconds([opts.minimumClientTimeoutSeconds, resolveTelegramOutboundClientTimeoutFloorSeconds(void 0)])
	});
	const apiRoot = normalizeOptionalString(telegramCfg.apiRoot);
	const normalizedApiRoot = apiRoot ? normalizeTelegramApiRoot(apiRoot) : void 0;
	const client = finalFetch || timeoutSeconds || normalizedApiRoot ? {
		...finalFetch ? { fetch: asTelegramClientFetch(finalFetch) } : {},
		...timeoutSeconds ? { timeoutSeconds } : {},
		...normalizedApiRoot ? { apiRoot: normalizedApiRoot } : {}
	} : void 0;
	const botConfig = client || opts.botInfo ? {
		...client ? { client } : {},
		...opts.botInfo ? { botInfo: opts.botInfo } : {}
	} : void 0;
	const bot = new botRuntime.Bot(opts.token, botConfig);
	bot.api.config.use(getOrCreateAccountThrottler(opts.token, botRuntime.apiThrottler));
	bot.catch((err) => {
		runtime.error?.(danger(`telegram bot error: ${formatUncaughtError(err)}`));
	});
	const initialUpdateId = typeof opts.updateOffset?.lastUpdateId === "number" ? opts.updateOffset.lastUpdateId : null;
	const logSkippedUpdate = (key) => {
		if (shouldLogVerbose()) logVerbose(`telegram dedupe: skipped ${key}`);
	};
	const updateTracker = createTelegramUpdateTracker({
		initialUpdateId,
		persistenceFloorUpdateId: typeof opts.updateOffset?.persistenceFloorUpdateId === "number" ? opts.updateOffset.persistenceFloorUpdateId : initialUpdateId,
		ackPolicy: "after_agent_dispatch",
		...typeof opts.updateOffset?.onUpdateId === "function" ? { onAcceptedUpdateId: opts.updateOffset.onUpdateId } : {},
		onPersistError: (err) => {
			runtime.error?.(`telegram: failed to persist update watermark: ${formatErrorMessage(err)}`);
		},
		onSkip: logSkippedUpdate
	});
	const shouldSkipUpdate = (ctx) => updateTracker.shouldSkipHandlerDispatch(ctx);
	bot.use(async (ctx, next) => {
		const begin = updateTracker.beginUpdate(ctx);
		if (!begin.accepted) return;
		try {
			const { result } = await runWithTelegramUpdateProcessingFrame(async () => {
				await next();
			});
			const deferredWork = getTelegramSpooledReplayDeferredParticipant();
			if (deferredWork) {
				deferredWork.task.then((deferredResult) => {
					updateTracker.finishUpdate(begin.update, { completed: deferredResult.kind !== "failed-retryable" });
				}).catch(() => {
					updateTracker.finishUpdate(begin.update, { completed: false });
				});
				return;
			}
			if (result?.kind === "failed-retryable") {
				if (isTelegramSpooledReplayUpdate(ctx.update)) throw new TelegramSpooledReplayProcessingError(result.error);
				updateTracker.finishUpdate(begin.update, { completed: true });
				return;
			}
			updateTracker.finishUpdate(begin.update, { completed: true });
		} catch (error) {
			updateTracker.finishUpdate(begin.update, { completed: false });
			throw error;
		}
	});
	bot.use(async (ctx, next) => {
		const callback = ctx.callbackQuery;
		if (callback) {
			const answerPromise = bot.api.answerCallbackQuery(callback.id);
			setTelegramCallbackQueryAnswerPromise(ctx, answerPromise);
			answerPromise.catch(() => {});
		}
		await next();
	});
	bot.use(botRuntime.sequentialize(getTelegramSequentialKey));
	const rawUpdateLogger = createSubsystemLogger("gateway/channels/telegram/raw-update");
	bot.use(async (ctx, next) => {
		if (shouldLogVerbose()) try {
			rawUpdateLogger.debug(`telegram update: ${formatTelegramRawUpdateForLog(ctx.update)}`);
		} catch (err) {
			rawUpdateLogger.debug(`telegram update log failed: ${String(err)}`);
		}
		await next();
	});
	const { historyLimit } = resolveTelegramMessageTurnSettings({
		accountId: account.accountId,
		cfg,
		telegramCfg,
		opts
	});
	const groupHistories = /* @__PURE__ */ new Map();
	const botHistorySender = buildTelegramSelfSenderName(account.name, opts.botInfo);
	const unregisterOutboundGroupHistoryRecorder = registerTelegramOutboundGroupHistoryRecorder({
		accountId: account.accountId,
		recorder: (record) => {
			if (!String(record.chatId).startsWith("-")) return;
			recordTelegramGroupHistoryEntry({
				historyMap: groupHistories,
				historyKey: buildTelegramGroupPeerId(record.chatId, record.messageThreadId),
				limit: historyLimit,
				entry: {
					sender: botHistorySender,
					body: record.text?.trim() || "<media>",
					timestamp: record.timestamp,
					messageId: String(record.messageId)
				}
			});
		}
	});
	const nativeEnabled = resolveNativeCommandsEnabled({
		providerId: "telegram",
		providerSetting: telegramCfg.commands?.native,
		globalSetting: cfg.commands?.native
	});
	const nativeSkillsEnabled = resolveNativeSkillsEnabled({
		providerId: "telegram",
		providerSetting: telegramCfg.commands?.nativeSkills,
		globalSetting: cfg.commands?.nativeSkills
	});
	const nativeDisabledExplicit = isNativeCommandsExplicitlyDisabled({
		providerSetting: telegramCfg.commands?.native,
		globalSetting: cfg.commands?.native
	});
	const mediaMaxBytes = (opts.mediaMaxMb ?? telegramCfg.mediaMaxMb ?? 100) * 1024 * 1024;
	const logger = getChildLogger({ module: "telegram-auto-reply" });
	const resolveGroupPolicy = (chatId, turnCfg) => resolveChannelGroupPolicy({
		cfg: turnCfg,
		channel: "telegram",
		accountId: account.accountId,
		groupId: String(chatId)
	});
	const resolveGroupActivation = (params) => {
		const agentId = params.agentId ?? resolveDefaultAgentId(params.cfg);
		const sessionKey = params.sessionKey ?? `agent:${agentId}:telegram:group:${buildTelegramGroupPeerId(params.chatId, params.messageThreadId)}`;
		const storePath = telegramDeps.resolveStorePath(params.cfg.session?.store, { agentId });
		try {
			const getSessionEntry = telegramDeps.getSessionEntry;
			if (!getSessionEntry) return;
			const storedActivation = getSessionEntry({
				storePath,
				sessionKey
			})?.groupActivation;
			const activation = storedActivation === "mention" || storedActivation === "always" ? normalizeGroupActivation(storedActivation) : void 0;
			if (activation === "always") return false;
			if (activation === "mention") return true;
		} catch (err) {
			logVerbose(`Failed to load session for activation check: ${String(err)}`);
		}
	};
	const resolveGroupRequireMention = (chatId, turnCfg) => resolveScopeRequireMention({
		tree: buildChannelGroupsScopeTree(turnCfg, "telegram", account.accountId),
		path: [String(chatId)],
		requireMentionOverride: opts.requireMention,
		overrideOrder: "after-config"
	});
	const resolveTelegramGroupConfig = (chatId, messageThreadId, turnCfg) => {
		const turnTelegramCfg = resolveTelegramAccount({
			cfg: turnCfg,
			accountId: account.accountId
		}).config;
		return resolveTelegramScopedGroupConfig(turnTelegramCfg, chatId, messageThreadId);
	};
	const processMessage = createTelegramMessageProcessor({
		bot,
		account,
		groupHistories,
		logger,
		resolveGroupActivation,
		resolveGroupRequireMention,
		resolveTelegramGroupConfig,
		sendChatActionHandler: createTelegramSendChatActionHandler({
			sendChatActionFn: (chatId, action, threadParams) => bot.api.sendChatAction(chatId, action, threadParams),
			logger: (message) => logVerbose(`telegram: ${message}`),
			minIntervalMs: TELEGRAM_TYPING_COALESCE_MS
		}),
		runtime,
		opts,
		telegramDeps
	});
	registerTelegramNativeCommands({
		bot,
		cfg,
		runtime,
		accountId: account.accountId,
		telegramCfg,
		mediaMaxBytes,
		nativeEnabled,
		nativeSkillsEnabled,
		nativeDisabledExplicit,
		resolveGroupPolicy,
		resolveTelegramGroupConfig,
		shouldSkipUpdate,
		opts,
		telegramDeps
	});
	registerTelegramHandlers({
		cfg,
		accountId: account.accountId,
		bot,
		opts,
		telegramTransport,
		runtime,
		mediaMaxBytes,
		telegramCfg,
		resolveGroupPolicy,
		resolveGroupActivation,
		resolveGroupRequireMention,
		resolveTelegramGroupConfig,
		shouldSkipUpdate,
		processMessage,
		logger,
		telegramDeps
	});
	const originalStop = bot.stop.bind(bot);
	bot.stop = ((...args) => {
		threadBindingManager?.stop();
		unregisterOutboundGroupHistoryRecorder();
		return originalStop(...args);
	});
	return bot;
}
//#endregion
//#region extensions/telegram/src/bot.ts
function createTelegramBot(opts) {
	return createTelegramBotCore({
		...opts,
		telegramDeps: opts.telegramDeps ?? defaultTelegramBotDeps
	});
}
//#endregion
//#region extensions/telegram/src/telegram-ingress-non-retryable.ts
const MISSING_AGENT_HARNESS_ERROR_NAME = "MissingAgentHarnessError";
const MISSING_AGENT_HARNESS_MESSAGE_RE = /Requested agent harness "[^"]+" is not registered\./u;
/** Channel-owned non-retryable predicate for the core ingress drain. */
function resolveTelegramIngressNonRetryableFailure(err) {
	for (const candidate of collectErrorGraphCandidates(err, (current) => [current.cause, current.error])) {
		const message = formatErrorMessage(candidate);
		if (candidate instanceof TelegramIngressPayloadError) return {
			reason: "invalid-event",
			message
		};
		if (isTelegramMessageDispatchReplayForgetError(candidate)) return {
			reason: "dispatch-dedupe-rollback-failed",
			message
		};
		if (readErrorName(candidate) === MISSING_AGENT_HARNESS_ERROR_NAME || MISSING_AGENT_HARNESS_MESSAGE_RE.test(message)) return {
			reason: "missing-agent-harness",
			message
		};
	}
	return null;
}
//#endregion
//#region extensions/telegram/src/telegram-ingress-supersede-auth.ts
function extractUpdateSenderFacts(update) {
	if (!update || typeof update !== "object") return null;
	const root = update;
	let message;
	for (const key of [
		"message",
		"edited_message",
		"channel_post",
		"edited_channel_post"
	]) {
		const candidate = root[key];
		if (candidate && typeof candidate === "object") {
			message = candidate;
			break;
		}
	}
	if (!message) {
		const callback = root.callback_query;
		if (callback && typeof callback === "object") {
			const cb = callback;
			const from = cb.from;
			const msg = cb.message;
			if (from && typeof from === "object" && msg && typeof msg === "object") {
				const chat = msg.chat;
				const fromObj = from;
				if (typeof chat?.id === "number" && typeof fromObj.id === "number") {
					const chatType = typeof chat.type === "string" ? chat.type : "private";
					return {
						senderId: String(fromObj.id),
						...typeof fromObj.username === "string" ? { senderUsername: fromObj.username } : {},
						chatId: chat.id,
						chatType,
						isGroup: chatType !== "private",
						...typeof chat.is_forum === "boolean" ? { isForum: chat.is_forum } : {},
						...typeof msg.is_topic_message === "boolean" ? { isTopicMessage: msg.is_topic_message } : {},
						...typeof msg.message_thread_id === "number" ? { messageThreadId: msg.message_thread_id } : {}
					};
				}
			}
		}
		return null;
	}
	const chat = message.chat;
	const from = message.from;
	if (typeof chat?.id !== "number" || typeof from?.id !== "number") return null;
	const chatType = typeof chat.type === "string" ? chat.type : "private";
	return {
		senderId: String(from.id),
		...typeof from.username === "string" ? { senderUsername: from.username } : {},
		chatId: chat.id,
		chatType,
		isGroup: chatType !== "private",
		...typeof chat.is_forum === "boolean" ? { isForum: chat.is_forum } : {},
		...typeof message.is_topic_message === "boolean" ? { isTopicMessage: message.is_topic_message } : {},
		...typeof message.message_thread_id === "number" ? { messageThreadId: message.message_thread_id } : {}
	};
}
/** Ambient room_event-shaped updates (no user text body) stay supersedable. */
function isTelegramAmbientSpooledUpdate(update) {
	if (!update || typeof update !== "object") return false;
	const root = update;
	return root.message_reaction != null || root.message_reaction_count != null || root.chat_member != null || root.my_chat_member != null || root.chat_join_request != null || root.chat_boost != null || root.removed_chat_boost != null;
}
/**
* Whether the raw update's sender is command-authorized.
* Reuses resolveTelegramGroupAllowFromContext — same group/topic allowFrom
* overrides and access-group expansion as normal message ingress.
*/
async function isTelegramSpooledUpdateSenderAuthorized(update, auth) {
	const facts = extractUpdateSenderFacts(update);
	if (!facts) return false;
	const accountCfg = mergeTelegramAccountConfig(auth.cfg, auth.accountId);
	const dmPolicy = accountCfg.dmPolicy ?? "pairing";
	const allowFrom = accountCfg.allowFrom;
	const groupAllowFrom = accountCfg.groupAllowFrom ?? accountCfg.allowFrom;
	const isForum = resolveTelegramMessageForumFlagHint({
		chatType: facts.chatType,
		isForum: facts.isForum,
		isTopicMessage: facts.isTopicMessage
	}) ?? false;
	const { resolvedThreadId, storeAllowFrom, groupAllowOverride, effectiveGroupAllow } = await resolveTelegramGroupAllowFromContext({
		cfg: auth.cfg,
		chatId: facts.chatId,
		accountId: auth.accountId,
		dmPolicy,
		allowFrom,
		senderId: facts.senderId,
		isGroup: facts.isGroup,
		isForum,
		messageThreadId: facts.messageThreadId,
		groupAllowFrom,
		resolveTelegramGroupConfig: (chatId, messageThreadId, cfg) => {
			return resolveTelegramScopedGroupConfig(mergeTelegramAccountConfig(cfg, auth.accountId), chatId, messageThreadId);
		}
	});
	const dmAllow = await resolveTelegramDmAllow({
		cfg: auth.cfg,
		groupAllowOverride,
		allowFrom,
		accountId: auth.accountId,
		senderId: facts.senderId,
		storeAllowFrom: facts.isGroup ? [] : storeAllowFrom,
		dmPolicy
	});
	const ownerAccess = resolveTelegramCommandAuthorization({
		cfg: auth.cfg,
		accountId: auth.accountId,
		chatId: facts.chatId,
		isGroup: facts.isGroup,
		...resolvedThreadId !== void 0 ? { resolvedThreadId } : {},
		senderId: facts.senderId,
		...facts.senderUsername !== void 0 ? { senderUsername: facts.senderUsername } : {}
	});
	return (await resolveTelegramCommandIngressAuthorization({
		accountId: auth.accountId,
		cfg: auth.cfg,
		dmPolicy,
		isGroup: facts.isGroup,
		chatId: facts.chatId,
		...resolvedThreadId !== void 0 ? { resolvedThreadId } : {},
		senderId: facts.senderId,
		effectiveDmAllow: dmAllow.effectiveAllow,
		effectiveGroupAllow,
		ownerAccess,
		eventKind: "message",
		allowTextCommands: true,
		hasControlCommand: true,
		modeWhenAccessGroupsOff: "allow",
		includeDmAllowForGroupCommands: false
	})).authorized;
}
//#endregion
//#region extensions/telegram/src/telegram-ingress-supersede.ts
function isRecognizedTelegramTextCommand(rawText, botUsername) {
	return maybeResolveTextAlias(normalizeCommandBody(rawText, botUsername ? { botUsername } : void 0)) != null;
}
/**
* Whether a bot_command entity (or slash token) targets this bot.
* Same target rule as normalizeCommandBody: untargeted commands match any bot;
* @OtherBot is ignored when our identity is known.
*/
function isTelegramCommandTargetedAtBot(commandText, botUsername) {
	const trimmed = commandText.trim();
	if (!trimmed.startsWith("/")) return false;
	const normalized = normalizeCommandBody(trimmed, botUsername ? { botUsername } : void 0).trim();
	if (!normalized.startsWith("/")) return false;
	if (!/^\/[^\s@]+@/u.test(normalized)) return true;
	return !botUsername?.trim();
}
/** True when the update carries a bot_command entity addressed to this bot. */
function updateHasBotCommandEntityForBot(update, botUsername) {
	if (!update || typeof update !== "object") return false;
	const root = update;
	for (const key of [
		"message",
		"edited_message",
		"channel_post",
		"edited_channel_post"
	]) {
		const msg = root[key];
		if (!msg || typeof msg !== "object") continue;
		const message = msg;
		const body = typeof message.text === "string" ? message.text : typeof message.caption === "string" ? message.caption : "";
		for (const entities of [message.entities, message.caption_entities]) {
			if (!Array.isArray(entities)) continue;
			for (const entity of entities) {
				if (!entity || typeof entity !== "object") continue;
				const ent = entity;
				if (ent.type !== "bot_command") continue;
				if (typeof ent.offset !== "number" || typeof ent.length !== "number") continue;
				if (isTelegramCommandTargetedAtBot(body.slice(ent.offset, ent.offset + ent.length), botUsername)) return true;
			}
		}
	}
	return false;
}
function extractUpdateText(update) {
	if (!update || typeof update !== "object") return "";
	const root = update;
	for (const key of [
		"message",
		"edited_message",
		"channel_post",
		"edited_channel_post"
	]) {
		const msg = root[key];
		if (msg && typeof msg === "object") {
			const text = msg.text;
			if (typeof text === "string") return text;
			const caption = msg.caption;
			if (typeof caption === "string") return caption;
		}
	}
	const callback = root.callback_query;
	if (callback && typeof callback === "object") {
		const data = callback.data;
		if (typeof data === "string") return data;
	}
	return "";
}
/**
* Drain-level supersede predicate over raw spooled payloads.
* Authorization is resolved from the new event's numeric sender via the same
* ingress command gate as the old fence (CommandAuthorized).
*/
function createShouldSupersedeTelegramSpooledPending(auth) {
	return async (newEvent, pendingEvent) => {
		const pendingUpdate = pendingEvent.payload.update;
		const newUpdate = newEvent.payload.update;
		if (isTelegramAmbientSpooledUpdate(pendingUpdate) && !isTelegramAmbientSpooledUpdate(newUpdate)) return await isTelegramSpooledUpdateSenderAuthorized(newUpdate, auth);
		const text = extractUpdateText(newUpdate);
		if (!text) return false;
		const commandOptions = auth.botUsername ? { botUsername: auth.botUsername } : void 0;
		if (isBtwRequestText(text, commandOptions) || isTelegramReadOnlyControlLaneText({
			rawText: text,
			...auth.botUsername ? { botUsername: auth.botUsername } : {}
		})) return false;
		const isAbort = isAbortRequestText(text, commandOptions);
		const isCommand = isRecognizedTelegramTextCommand(text, auth.botUsername) || updateHasBotCommandEntityForBot(newUpdate, auth.botUsername);
		if (!isAbort && !isCommand) return false;
		return await isTelegramSpooledUpdateSenderAuthorized(newUpdate, auth);
	};
}
//#endregion
//#region extensions/telegram/src/telegram-ingress-drain.ts
const TELEGRAM_SPOOLED_HANDLER_TIMEOUT_ENV = "OPENCLAW_TELEGRAM_SPOOLED_HANDLER_TIMEOUT_MS";
const TELEGRAM_SPOOLED_DRAIN_START_LIMIT = 100;
const TELEGRAM_SPOOLED_DRAIN_SCAN_LIMIT = TELEGRAM_SPOOLED_DRAIN_START_LIMIT * 10;
const TELEGRAM_SPOOLED_DRAIN_POLL_INTERVAL_MS = 500;
const TELEGRAM_SPOOLED_DRAIN_PRUNE_INTERVAL_MS = 3600 * 1e3;
function resolveTelegramAdoptionStallTimeoutMs(params) {
	const candidates = [params.configured, Number(params.env?.[TELEGRAM_SPOOLED_HANDLER_TIMEOUT_ENV])];
	for (const candidate of candidates) {
		const timeoutMs = clampPositiveTimerTimeoutMs(candidate);
		if (timeoutMs !== void 0) return timeoutMs;
	}
	return DEFAULT_INGRESS_ADOPTION_STALL_MS;
}
function telegramSpooledLaneKey(update, botInfo) {
	return getTelegramSequentialKey({
		update,
		...botInfo ? { me: botInfo } : {}
	});
}
function inspectTelegramSpooledUpdate(update, botInfo) {
	const updateId = resolveTelegramUpdateId$1(update);
	if (updateId === null) throw new TelegramIngressPayloadError("Telegram spooled update is missing numeric update_id.");
	return {
		eventId: telegramQueueEventId(updateId),
		laneKey: telegramSpooledLaneKey(update, botInfo)
	};
}
/**
* Shared polling/webhook monitor over Telegram's channel-owned durable spool.
*
* The transports keep durable admission because offset advancement and webhook
* acknowledgement depend on that exact boundary; requestDrain() bridges the
* committed spool append into the shared pump.
*/
function createTelegramIngressMonitor(params) {
	return createChannelIngressMonitor({
		queue: params.queue,
		inspect: (update) => inspectTelegramSpooledUpdate(update, params.botInfo),
		payload: {
			version: 1,
			serialize: (update, { receivedAt }) => {
				const updateId = resolveTelegramUpdateId$1(update);
				if (updateId === null) throw new TelegramIngressPayloadError("Telegram spooled update is missing numeric update_id.");
				return {
					version: 1,
					updateId,
					receivedAt,
					update
				};
			},
			deserialize: (payload) => payload.update,
			encode: ({ body }) => body,
			decode: (payload) => ({
				version: payload.version,
				body: payload
			}),
			createClaimError: (kind, claim) => new TelegramIngressPayloadError(kind === "invalid-version" ? `Telegram ingress row ${claim.id} has an unsupported payload version.` : `Telegram ingress row ${claim.id} changed update identity.`)
		},
		deliver: async (update, lifecycle) => {
			try {
				const result = await runWithTelegramSpooledReplayUpdate(update, async () => await params.dispatch(update, lifecycle), lifecycle);
				const outcome = result.value;
				if (outcome && typeof outcome === "object" && "kind" in outcome) {
					if (outcome.kind === "failed-retryable") return {
						kind: "failed-retryable",
						error: outcome.error
					};
					if (outcome.kind === "completed" || outcome.kind === "skipped") {
						await lifecycle.onAdopted();
						return { kind: "completed" };
					}
				}
				const participant = result.deferredWork;
				if (participant) {
					const terminal = await new Promise((resolve, reject) => {
						const abortError = () => lifecycle.abortSignal.reason instanceof Error ? lifecycle.abortSignal.reason : /* @__PURE__ */ new Error("ingress-aborted");
						if (lifecycle.abortSignal.aborted) {
							reject(abortError());
							return;
						}
						const onAbort = () => reject(abortError());
						lifecycle.abortSignal.addEventListener("abort", onAbort, { once: true });
						participant.task.then((value) => {
							lifecycle.abortSignal.removeEventListener("abort", onAbort);
							resolve(value);
						}, (error) => {
							lifecycle.abortSignal.removeEventListener("abort", onAbort);
							reject(error instanceof Error ? error : new Error(String(error)));
						});
					}).then((value) => value, (error) => {
						if (lifecycle.abortSignal.aborted) return { kind: "skipped" };
						throw error;
					});
					if (terminal.kind === "failed-retryable") return {
						kind: "failed-retryable",
						error: terminal.error
					};
					if (lifecycle.abortSignal.aborted) return {
						kind: "failed-retryable",
						error: lifecycle.abortSignal.reason instanceof Error ? lifecycle.abortSignal.reason : /* @__PURE__ */ new Error("ingress-aborted")
					};
				}
				await lifecycle.onAdopted();
				return { kind: "completed" };
			} catch (error) {
				return {
					kind: "failed-retryable",
					error
				};
			}
		},
		pollIntervalMs: params.pollIntervalMs ?? TELEGRAM_SPOOLED_DRAIN_POLL_INTERVAL_MS,
		retention: {
			pruneIntervalMs: TELEGRAM_SPOOLED_DRAIN_PRUNE_INTERVAL_MS,
			completedTtlMs: TELEGRAM_SPOOLED_UPDATE_COMPLETED_TTL_MS,
			completedMaxEntries: TELEGRAM_SPOOLED_UPDATE_COMPLETED_MAX_ENTRIES,
			failedTtlMs: TELEGRAM_SPOOLED_UPDATE_FAILED_TTL_MS,
			failedMaxEntries: TELEGRAM_SPOOLED_UPDATE_FAILED_MAX_ENTRIES
		},
		drain: {
			adoptionStallTimeoutMs: params.adoptionStallTimeoutMs ?? 3e5,
			orderBy: "id",
			scanLimit: TELEGRAM_SPOOLED_DRAIN_SCAN_LIMIT,
			startLimit: TELEGRAM_SPOOLED_DRAIN_START_LIMIT,
			resolveNonRetryableFailure: resolveTelegramIngressNonRetryableFailure,
			shouldSupersedePending: createShouldSupersedeTelegramSpooledPending({
				cfg: params.cfg,
				accountId: params.accountId,
				...params.botInfo?.username ? { botUsername: params.botInfo.username } : {}
			}),
			deriveLaneKey: (record) => telegramSpooledLaneKey(record.payload.update, params.botInfo),
			...params.onLog ? { onLog: params.onLog } : {}
		},
		...params.abortSignal ? { abortSignal: params.abortSignal } : {},
		admissionMode: "while-running",
		createStoppedError: () => /* @__PURE__ */ new Error("Telegram ingress monitor is stopped."),
		...params.onError ? { onError: params.onError } : {}
	});
}
//#endregion
//#region extensions/telegram/src/telegram-ingress-drain-factory.ts
/**
* One monitor for polling + webhook: channel-owned append, shared claim →
* dispatch with turnAdoptionLifecycle → complete at adoption.
*/
function createTelegramTransportIngressMonitor(params) {
	const queue = openTelegramIngressQueue(params.spoolDir);
	const adoptionStallTimeoutMs = resolveTelegramAdoptionStallTimeoutMs({
		configured: params.adoptionStallTimeoutMs,
		env: process.env
	});
	return createTelegramIngressMonitor({
		queue,
		cfg: params.cfg,
		accountId: params.accountId,
		botInfo: params.botInfo,
		adoptionStallTimeoutMs,
		...params.pollIntervalMs === void 0 ? {} : { pollIntervalMs: params.pollIntervalMs },
		...params.onLog ? { onLog: params.onLog } : {},
		...params.onError ? { onError: params.onError } : {},
		...params.abortSignal ? { abortSignal: params.abortSignal } : {},
		dispatch: async (update, lifecycle) => {
			if (params.dispatchUpdate) return await params.dispatchUpdate(update, lifecycle);
			await params.bot.handleUpdate(update);
		}
	});
}
//#endregion
export { telegramSpooledUpdateLaneKey as a, resolveTelegramIngressSpoolDir as i, resolveTelegramAdoptionStallTimeoutMs as n, writeTelegramSpooledUpdate as o, createTelegramBot as r, getTelegramSequentialKey as s, createTelegramTransportIngressMonitor as t };
