import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { r as waitForAbortSignal } from "./abort-signal-DEbc_zqk.js";
import { n as createNonExitingRuntime } from "./runtime-ZHfN2VLf.js";
import { a as isRequestBodyLimitError, d as requestBodyErrorToText, s as readRequestBodyWithLimit } from "./http-body-g29H4gTR.js";
import { i as shouldLogVerbose, o as warn, r as logVerbose, t as danger } from "./globals-DBBT7Ru5.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import { r as fetchWithRuntimeDispatcherOrMockedGlobal } from "./runtime-fetch-DldMe-lf.js";
import { n as normalizePluginHttpPath } from "./http-route-overlap--iFT7z_9.js";
import { n as bindIngressLifecycleToReplyOptions, t as DEFAULT_INGRESS_ADOPTION_STALL_MS } from "./ingress-drain-CcUB4x_c.js";
import { d as saveMediaStream } from "./store-NmJjqmad.js";
import { n as sanitizeAssistantVisibleText } from "./assistant-visible-text-CUL_eqJo.js";
import { t as hasControlCommand } from "./command-detection-B3_n5-oK.js";
import { D as formatLocationText, k as toLocationContext, m as resolveSendableOutboundReplyParts } from "./reply-payload-CPcXnHho.js";
import { t as MediaFetchError } from "./fetch-Mq4HGaV9.js";
import { a as resolveInboundLastRouteSessionKey, i as resolveAgentRoute } from "./resolve-route-D7zjVGdF.js";
import { n as firstDefined } from "./allow-from-o-cfFFcK.js";
import { a as warnMissingProviderGroupPolicyFallbackOnce, n as resolveAllowlistProviderRuntimeGroupPolicy, r as resolveDefaultGroupPolicy } from "./runtime-group-policy-B5DjRp_T.js";
import { s as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-CGPe5B6t.js";
import { r as chunkMarkdownText } from "./chunk-B-Yo_muw.js";
import "./runtime-config-snapshot-CbOz4rru.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./text-utility-runtime-Bs8FhB83.js";
import "./security-runtime-B_Vsvs-F.js";
import "./media-runtime-BF28IqU8.js";
import "./runtime-env-BDC_axp1.js";
import "./text-chunking-CcRmx-1w.js";
import { n as buildMentionRegexes, r as matchesMentionPatterns } from "./mentions-JuM7Ltm-.js";
import { t as finalizeInboundContext } from "./inbound-context-DpKaYErg.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./routing-C_9uWiFw.js";
import { r as formatInboundEnvelope } from "./envelope-BfKEFEwi.js";
import { d as buildChannelInboundMediaPayload, f as formatInboundMediaUnavailableText, h as toInboundMediaFacts } from "./kernel-BM-Mkfv5.js";
import "./history-BCX82R6F.js";
import { n as hasFinalChannelTurnDispatch } from "./dispatch-result-DaybJgme.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import { c as upsertChannelPairingRequest, i as readChannelAllowFromStore } from "./pairing-store-BaZlMduS.js";
import "./reply-runtime-lk06zLui.js";
import "./reply-dispatch-runtime-MwqmCEt8.js";
import "./runtime-group-policy-CXo40VxH.js";
import "./media-store-VqLkxSD1.js";
import { n as resolveConfiguredBindingRoute, r as resolveRuntimeConversationBindingRoute, t as ensureConfiguredBindingRouteReady } from "./binding-routing-3b8H2XZ-.js";
import "./conversation-runtime-DoBKzCAM.js";
import { t as resolvePairingIdLabel } from "./pairing-labels-CcWgNb6K.js";
import "./allow-from-DBWoFP8H.js";
import "./command-auth-native-B9Hdab1n.js";
import { c as resolveInboundSessionEnvelopeContext } from "./channel-inbound-CsmpMLUZ.js";
import { a as resolveStableChannelMessageIngress } from "./channel-ingress-runtime-xeTXZKGy.js";
import { d as createChannelIngressMonitor } from "./channel-outbound-D_Kkmr30.js";
import { t as createChannelPairingChallengeIssuer } from "./channel-pairing-aeyu-GFl.js";
import "./runtime-fetch-z-6rH6R_.js";
import { t as createChannelHistoryWindow } from "./reply-history-ByRtpsh-.js";
import { a as createWebhookInFlightLimiter, i as beginWebhookRequestPipelineOrReject, l as runDetachedWebhookWork } from "./webhook-request-guards-BwB_e49u.js";
import "./webhook-ingress-0GWTUyGu.js";
import { a as resolveSingleWebhookTarget, r as registerWebhookTargetWithPluginRoute, t as normalizeWebhookPath } from "./webhook-targets-D0QbJdTx.js";
import { i as resolveLineAccount, r as resolveDefaultLineAccountId } from "./accounts-DE_zW1FA.js";
import { a as resolveLineGroupConfigEntry, n as getLineRuntime, t as buildLineQuickReplyFallbackText } from "./quick-reply-fallback-xgoSKEeu.js";
import { n as buildLineMediaMessage, r as hasLineSpecificMediaOptions } from "./send-receipt-PrfGV1ob.js";
import { o as HTTPFetchError } from "./messagingApiClient-DFqsQGxN.js";
import { D as showLoadingAnimation, S as pushMessagesLine, T as replyMessageLine, c as processLineMessage, f as createLocationMessage, g as getUserDisplayName, k as buildTemplateMessageFromPayload, p as createQuickReplyItems, u as createFlexMessage, x as pushMessageLine } from "./markdown-to-line-BzTbYYIA.js";
import crypto from "node:crypto";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
//#region extensions/line/src/bot-access.ts
function normalizeLineAllowEntry(value) {
	const trimmed = String(value).trim();
	if (!trimmed) return "";
	if (trimmed === "*") return "*";
	return trimmed.replace(/^line:(?:user:)?/i, "");
}
const normalizeAllowFrom = (list) => {
	const entries = (list ?? []).map((value) => normalizeLineAllowEntry(value)).filter(Boolean);
	return {
		entries,
		hasWildcard: entries.includes("*"),
		hasEntries: entries.length > 0
	};
};
//#endregion
//#region extensions/line/src/download.ts
const CONTENT_READY_MAX_ATTEMPTS = 6;
const CONTENT_READY_BASE_DELAY_MS = 500;
const CONTENT_READY_MAX_DELAY_MS = 4e3;
const CONTENT_READY_TIMEOUT_MS = 15e3;
const LINE_CONTENT_BASE_URL = "https://api-data.line.me/v2/bot/message";
var RetryableLineMediaFetchError = class extends MediaFetchError {
	constructor(message, options) {
		super("fetch_failed", message, options);
		this.name = "RetryableLineMediaFetchError";
	}
};
function contentBackoffDelayMs(attempt) {
	return Math.min(CONTENT_READY_BASE_DELAY_MS * 2 ** attempt, CONTENT_READY_MAX_DELAY_MS);
}
function lineContentUrl(messageId) {
	return `${LINE_CONTENT_BASE_URL}/${encodeURIComponent(messageId)}/content`;
}
async function* lineResponseBodyChunks(response, messageId) {
	const body = response.body;
	if (!body) throw new RetryableLineMediaFetchError(`LINE media response for message ${messageId} had no body`);
	const reader = body.getReader();
	let completed = false;
	try {
		while (true) {
			let chunk;
			try {
				chunk = await reader.read();
			} catch (err) {
				throw new RetryableLineMediaFetchError(`LINE media response stream failed for message ${messageId}`, { cause: err });
			}
			if (chunk.done) {
				completed = true;
				return;
			}
			if (chunk.value.byteLength > 0) yield chunk.value;
		}
	} finally {
		if (!completed) await reader.cancel().catch(() => void 0);
		try {
			reader.releaseLock();
		} catch {}
	}
}
async function fetchLineContentWhenReady(messageId, channelAccessToken) {
	const controller = new AbortController();
	const deadline = setTimeout(() => controller.abort(), CONTENT_READY_TIMEOUT_MS);
	deadline.unref();
	try {
		for (let attempt = 0; attempt < CONTENT_READY_MAX_ATTEMPTS; attempt++) {
			const response = await fetchWithRuntimeDispatcherOrMockedGlobal(lineContentUrl(messageId), {
				headers: { Authorization: `Bearer ${channelAccessToken}` },
				redirect: "error",
				signal: controller.signal
			});
			if (response.status === 200) {
				if (!response.body) throw new RetryableLineMediaFetchError(`LINE media response for message ${messageId} had no body`);
				return response;
			}
			await response.body?.cancel().catch(() => void 0);
			if (response.status !== 202) throw new MediaFetchError("http_error", `LINE media download failed for message ${messageId} (HTTP ${response.status})`, { status: response.status });
			if (attempt < CONTENT_READY_MAX_ATTEMPTS - 1) await setTimeout$1(contentBackoffDelayMs(attempt), void 0, { signal: controller.signal });
		}
	} catch (err) {
		if (controller.signal.aborted) throw new RetryableLineMediaFetchError(`LINE media for message ${messageId} did not become ready within ${CONTENT_READY_TIMEOUT_MS / 1e3} seconds`, { cause: err });
		if (err instanceof MediaFetchError) throw err;
		throw new RetryableLineMediaFetchError(`LINE media download failed for message ${messageId}`, { cause: err });
	} finally {
		clearTimeout(deadline);
	}
	throw new MediaFetchError("http_error", `LINE media for message ${messageId} was still preparing (HTTP 202) after ${CONTENT_READY_MAX_ATTEMPTS} attempts`, { status: 202 });
}
function isRetryableLineInboundMediaError(err) {
	if (err instanceof RetryableLineMediaFetchError) return true;
	if (!(err instanceof MediaFetchError)) return false;
	if (err.code === "http_error") return err.status === 202 || err.status === 408 || err.status === 429 || typeof err.status === "number" && err.status >= 500;
	return false;
}
async function downloadLineMedia(messageId, channelAccessToken, maxBytes = 10 * 1024 * 1024, options) {
	const response = await fetchLineContentWhenReady(messageId, channelAccessToken);
	let saved;
	try {
		saved = await saveMediaStream(lineResponseBodyChunks(response, messageId), response.headers.get("content-type") ?? void 0, "inbound", maxBytes, options?.originalFilename);
	} catch (err) {
		await response.body?.cancel().catch(() => void 0);
		throw err;
	}
	logVerbose(`line: persisted media ${messageId} to ${saved.path} (${saved.size} bytes)`);
	return {
		path: saved.path,
		contentType: saved.contentType,
		size: saved.size
	};
}
//#endregion
//#region extensions/line/src/auto-reply-delivery.ts
function toLineDeliveryError(error) {
	return error instanceof Error ? error : new Error("LINE message send failed", { cause: error });
}
function getLineHttpError(error) {
	if (error instanceof HTTPFetchError) return error;
	return error instanceof Error && error.cause instanceof HTTPFetchError ? error.cause : void 0;
}
function markLineVisibleDeliveryError(error) {
	const deliveryError = toLineDeliveryError(error);
	if (Object.isExtensible(deliveryError)) {
		Object.assign(deliveryError, {
			sentBeforeError: true,
			visibleReplySent: true
		});
		return deliveryError;
	}
	const visibleError = new Error("LINE message send failed", { cause: deliveryError });
	Object.assign(visibleError, {
		sentBeforeError: true,
		visibleReplySent: true
	});
	return visibleError;
}
async function deliverLineAutoReply(params) {
	const { payload, lineData, replyToken, accountId, to, textLimit, deps } = params;
	let replyTokenUsed = params.replyTokenUsed;
	let visibleReplySent = false;
	const sendVisible = async (send) => {
		try {
			const result = await send();
			visibleReplySent = true;
			return result;
		} catch (error) {
			if (visibleReplySent) throw markLineVisibleDeliveryError(error);
			throw error;
		}
	};
	const replyVisible = (...args) => sendVisible(() => deps.replyMessageLine(...args));
	const failedPushSegments = /* @__PURE__ */ new WeakMap();
	const pushLineMessages = async (messages, allowFailedBatchTextRecovery, externalTail = []) => {
		if (messages.length === 0) return;
		for (let i = 0; i < messages.length; i += 5) {
			const batch = messages.slice(i, i + 5);
			try {
				await sendVisible(() => deps.pushMessagesLine(to, batch, {
					cfg: params.cfg,
					accountId
				}));
			} catch (error) {
				if (typeof error === "object" && error !== null) failedPushSegments.set(error, {
					allowFailedBatchTextRecovery,
					failedBatch: batch,
					unattemptedTail: [...messages.slice(i + batch.length), ...externalTail]
				});
				throw error;
			}
		}
	};
	const sendLineMessages = async (messages, allowReplyToken) => {
		if (messages.length === 0) return;
		let remaining = messages;
		if (allowReplyToken && replyToken && !replyTokenUsed) {
			const replyBatch = remaining.slice(0, 5);
			try {
				await replyVisible(replyToken, replyBatch, {
					cfg: params.cfg,
					accountId
				});
			} catch (err) {
				deps.onReplyError?.(err);
				await pushLineMessages(replyBatch, getLineHttpError(err)?.status === 400, remaining.slice(replyBatch.length));
			} finally {
				replyTokenUsed = true;
			}
			remaining = remaining.slice(replyBatch.length);
		}
		if (remaining.length > 0) await pushLineMessages(remaining, true);
	};
	const richMessages = [];
	const hasQuickReplies = Boolean(lineData.quickReplies?.length);
	if (lineData.flexMessage) richMessages.push(deps.createFlexMessage(truncateUtf16Safe(lineData.flexMessage.altText, 400), lineData.flexMessage.contents));
	if (lineData.templateMessage) {
		const templateMsg = deps.buildTemplateMessageFromPayload(lineData.templateMessage);
		if (templateMsg) richMessages.push(templateMsg);
	}
	if (lineData.location) richMessages.push(deps.createLocationMessage(lineData.location));
	const visibleText = payload.text ? sanitizeAssistantVisibleText(payload.text) : "";
	const processed = visibleText ? deps.processLineMessage(visibleText) : {
		text: "",
		flexMessages: []
	};
	for (const flexMsg of processed.flexMessages) richMessages.push(deps.createFlexMessage(truncateUtf16Safe(flexMsg.altText, 400), flexMsg.contents));
	const chunks = processed.text ? deps.chunkMarkdownText(processed.text, textLimit) : [];
	const mediaUrls = resolveSendableOutboundReplyParts(payload).mediaUrls;
	const mediaOpts = {
		mediaKind: hasLineSpecificMediaOptions(lineData) ? lineData.mediaKind : "image",
		previewImageUrl: lineData.previewImageUrl,
		durationMs: lineData.durationMs,
		trackingId: lineData.trackingId
	};
	const mediaMessages = [];
	let deliveryError;
	for (const rawUrl of mediaUrls) {
		const url = rawUrl?.trim();
		if (!url) continue;
		try {
			mediaMessages.push(await deps.buildMediaMessage(url, mediaOpts, to));
		} catch (err) {
			deliveryError ??= err;
		}
	}
	const textMessages = chunks.map((text) => ({
		type: "text",
		text
	}));
	const richMediaMessages = [...richMessages, ...mediaMessages];
	if (hasQuickReplies && textMessages.length === 0 && richMediaMessages.length === 0) textMessages.push({
		type: "text",
		text: buildLineQuickReplyFallbackText(lineData.quickReplies)
	});
	if (hasQuickReplies) {
		const targetMessages = textMessages.length > 0 ? textMessages : richMediaMessages;
		const lastIndex = targetMessages.length - 1;
		targetMessages[lastIndex] = {
			...expectDefined(targetMessages[lastIndex], "last LINE auto-reply message"),
			quickReply: deps.createQuickReplyItems(lineData.quickReplies)
		};
	}
	const messages = hasQuickReplies ? [...richMediaMessages, ...textMessages] : [...textMessages, ...richMediaMessages];
	try {
		await sendLineMessages(messages, true);
	} catch (err) {
		deliveryError ??= err;
		const failedSegment = typeof err === "object" && err !== null ? failedPushSegments.get(err) : void 0;
		const httpError = getLineHttpError(err);
		const retryCandidates = failedSegment ? [...failedSegment.allowFailedBatchTextRecovery ? failedSegment.failedBatch : [], ...failedSegment.unattemptedTail] : [];
		const retryTextMessages = retryCandidates.filter((message) => message.type === "text");
		const quickRepliesNeedCarrier = hasQuickReplies && retryCandidates.some((message) => "quickReply" in message);
		const retryMessages = retryTextMessages.length > 0 ? retryTextMessages : quickRepliesNeedCarrier ? [{
			type: "text",
			text: buildLineQuickReplyFallbackText(lineData.quickReplies),
			quickReply: deps.createQuickReplyItems(lineData.quickReplies)
		}] : [];
		if (retryMessages.length > 0 && failedSegment?.failedBatch.some((message) => message.type !== "text") && httpError?.status === 400) try {
			await sendLineMessages(retryMessages, false);
		} catch {}
	}
	if (deliveryError !== void 0) {
		if (!visibleReplySent) throw toLineDeliveryError(deliveryError);
		return {
			status: "partial",
			replyTokenUsed,
			visibleReplySent: true,
			error: markLineVisibleDeliveryError(deliveryError)
		};
	}
	return {
		status: "delivered",
		replyTokenUsed,
		visibleReplySent
	};
}
//#endregion
//#region extensions/line/src/bot-message-context.ts
function getLineSourceInfo(source) {
	if (!source) return {
		userId: void 0,
		groupId: void 0,
		roomId: void 0,
		isGroup: false
	};
	return {
		userId: source.type === "user" ? source.userId : source.type === "group" ? source.userId : source.type === "room" ? source.userId : void 0,
		groupId: source.type === "group" ? source.groupId : void 0,
		roomId: source.type === "room" ? source.roomId : void 0,
		isGroup: source.type === "group" || source.type === "room"
	};
}
function buildPeerId(source) {
	if (!source) return "unknown";
	const groupKey = normalizeOptionalString(source.type === "group" ? source.groupId : void 0) ?? normalizeOptionalString(source.type === "room" ? source.roomId : void 0);
	if (groupKey) return groupKey;
	if (source.type === "user" && source.userId) return source.userId;
	return "unknown";
}
async function resolveLineInboundRoute(params) {
	recordChannelActivity({
		channel: "line",
		accountId: params.account.accountId,
		direction: "inbound"
	});
	const { userId, groupId, roomId, isGroup } = getLineSourceInfo(params.source);
	const peerId = buildPeerId(params.source);
	let route = resolveAgentRoute({
		cfg: params.cfg,
		channel: "line",
		accountId: params.account.accountId,
		peer: {
			kind: isGroup ? "group" : "direct",
			id: peerId
		}
	});
	const configuredRoute = resolveConfiguredBindingRoute({
		cfg: params.cfg,
		route,
		conversation: {
			channel: "line",
			accountId: params.account.accountId,
			conversationId: peerId
		}
	});
	let configuredBinding = configuredRoute.bindingResolution;
	const configuredBindingSessionKey = configuredRoute.boundSessionKey ?? "";
	route = configuredRoute.route;
	const runtimeRoute = resolveRuntimeConversationBindingRoute({
		route,
		conversation: {
			channel: "line",
			accountId: params.account.accountId,
			conversationId: peerId
		}
	});
	route = runtimeRoute.route;
	if (runtimeRoute.bindingRecord) {
		configuredBinding = null;
		logVerbose(runtimeRoute.boundSessionKey ? `line: routed via bound conversation ${peerId} -> ${runtimeRoute.boundSessionKey}` : `line: plugin-bound conversation ${peerId}`);
	}
	if (configuredBinding) {
		const ensured = await ensureConfiguredBindingRouteReady({
			cfg: params.cfg,
			bindingResolution: configuredBinding
		});
		if (!ensured.ok) {
			logVerbose(`line: configured ACP binding unavailable for ${peerId} -> ${configuredBindingSessionKey}: ${ensured.error}`);
			throw new Error(`Configured ACP binding unavailable: ${ensured.error}`);
		}
		logVerbose(`line: using configured ACP binding for ${peerId} -> ${configuredBindingSessionKey}`);
	}
	return {
		userId,
		groupId,
		roomId,
		isGroup,
		peerId,
		route
	};
}
const STICKER_PACKAGES = {
	"1": "Moon & James",
	"2": "Cony & Brown",
	"3": "Brown & Friends",
	"4": "Moon Special",
	"789": "LINE Characters",
	"6136": "Cony's Happy Life",
	"6325": "Brown's Life",
	"6359": "Choco",
	"6362": "Sally",
	"6370": "Edward",
	"11537": "Cony",
	"11538": "Brown",
	"11539": "Moon"
};
function describeStickerKeywords(sticker) {
	const keywords = sticker.keywords;
	if (keywords && keywords.length > 0) return keywords.slice(0, 3).join(", ");
	const stickerText = sticker.text;
	if (stickerText) return stickerText;
	return "";
}
function extractMessageText(message) {
	if (message.type === "text") return message.text;
	if (message.type === "location") {
		const loc = message;
		return formatLocationText({
			latitude: loc.latitude,
			longitude: loc.longitude,
			name: loc.title,
			address: loc.address
		}) ?? "";
	}
	if (message.type === "sticker") {
		const sticker = message;
		const packageName = STICKER_PACKAGES[sticker.packageId] ?? "sticker";
		const keywords = describeStickerKeywords(sticker);
		if (keywords) return `[Sent a ${packageName} sticker: ${keywords}]`;
		return `[Sent a ${packageName} sticker]`;
	}
	return "";
}
function extractNativeMediaKind(message) {
	switch (message.type) {
		case "image": return "image";
		case "video": return "video";
		case "audio": return "audio";
		case "file": return "document";
		default: return;
	}
}
function resolveLineConversationLabel(params) {
	return params.isGroup ? params.groupId ? `group:${params.groupId}` : params.roomId ? `room:${params.roomId}` : "unknown-group" : params.senderLabel;
}
function resolveLineAddresses(params) {
	const fromAddress = params.isGroup ? params.groupId ? `line:group:${params.groupId}` : params.roomId ? `line:room:${params.roomId}` : `line:${params.peerId}` : `line:${params.userId ?? params.peerId}`;
	return {
		fromAddress,
		toAddress: params.isGroup ? fromAddress : `line:${params.userId ?? params.peerId}`,
		originatingTo: params.isGroup ? fromAddress : `line:${params.userId ?? params.peerId}`
	};
}
async function finalizeLineInboundContext(params) {
	const { fromAddress, toAddress, originatingTo } = resolveLineAddresses({
		isGroup: params.source.isGroup,
		groupId: params.source.groupId,
		roomId: params.source.roomId,
		userId: params.source.userId,
		peerId: params.source.peerId
	});
	const senderId = params.source.userId ?? "unknown";
	const senderLabel = params.source.userId ? `user:${params.source.userId}` : "unknown";
	const conversationLabel = resolveLineConversationLabel({
		isGroup: params.source.isGroup,
		groupId: params.source.groupId,
		roomId: params.source.roomId,
		senderLabel
	});
	const { storePath, envelopeOptions, previousTimestamp } = resolveInboundSessionEnvelopeContext({
		cfg: params.cfg,
		agentId: params.route.agentId,
		sessionKey: params.route.sessionKey
	});
	const agentBody = params.agentBody ?? params.rawBody;
	const mediaPayload = buildChannelInboundMediaPayload(toInboundMediaFacts(params.media));
	const body = formatInboundEnvelope({
		channel: "LINE",
		from: conversationLabel,
		timestamp: params.timestamp,
		body: agentBody,
		chatType: params.source.isGroup ? "group" : "direct",
		sender: { id: senderId },
		previousTimestamp,
		envelope: envelopeOptions
	});
	const ctxPayload = finalizeInboundContext({
		Body: body,
		BodyForAgent: agentBody,
		RawBody: params.rawBody,
		CommandBody: params.rawBody,
		From: fromAddress,
		To: toAddress,
		SessionKey: params.route.sessionKey,
		DmScope: params.route.dmScope,
		AccountId: params.route.accountId,
		ChatType: params.source.isGroup ? "group" : "direct",
		ConversationLabel: conversationLabel,
		GroupSubject: params.source.isGroup ? params.source.groupId ?? params.source.roomId : void 0,
		SenderId: senderId,
		Provider: "line",
		Surface: "line",
		MessageSid: params.messageSid,
		Timestamp: params.timestamp,
		...mediaPayload,
		...params.locationContext,
		CommandAuthorized: params.commandAuthorized,
		OriginatingChannel: "line",
		OriginatingTo: originatingTo,
		GroupSystemPrompt: params.source.isGroup ? normalizeOptionalString(resolveLineGroupConfigEntry(params.account.config.groups, {
			groupId: params.source.groupId,
			roomId: params.source.roomId
		})?.systemPrompt) : void 0,
		InboundHistory: params.inboundHistory
	});
	const pinnedMainDmOwner = !params.source.isGroup ? resolvePinnedMainDmOwnerFromAllowlist({
		dmScope: params.cfg.session?.dmScope,
		allowFrom: params.account.config.allowFrom,
		normalizeEntry: (entry) => normalizeAllowFrom([entry]).entries[0]
	}) : null;
	const inboundLastRouteSessionKey = resolveInboundLastRouteSessionKey({
		route: params.route,
		sessionKey: params.route.sessionKey
	});
	if (shouldLogVerbose()) {
		const preview = truncateUtf16Safe(body, 200).replace(/\n/g, "\\n");
		const mediaInfo = params.verboseLog.kind === "inbound" && (params.verboseLog.mediaCount ?? 0) > 1 ? ` mediaCount=${params.verboseLog.mediaCount}` : "";
		logVerbose(`${params.verboseLog.kind === "inbound" ? "line inbound" : "line postback"}: from=${ctxPayload.From} len=${body.length}${mediaInfo} preview="${preview}"`);
	}
	return {
		ctxPayload,
		replyToken: params.event.replyToken,
		turn: {
			storePath,
			record: {
				updateLastRoute: !params.source.isGroup ? {
					sessionKey: inboundLastRouteSessionKey,
					channel: "line",
					to: params.source.userId ?? params.source.peerId,
					accountId: params.route.accountId,
					mainDmOwnerPin: inboundLastRouteSessionKey === params.route.mainSessionKey && pinnedMainDmOwner && params.source.userId ? {
						ownerRecipient: pinnedMainDmOwner,
						senderRecipient: params.source.userId,
						onSkip: ({ ownerRecipient, senderRecipient }) => {
							logVerbose(`line: skip main-session last route for ${senderRecipient} (pinned owner ${ownerRecipient})`);
						}
					} : void 0
				} : void 0,
				onRecordError: (err) => {
					logVerbose(`line: failed updating session meta: ${String(err)}`);
				}
			}
		}
	};
}
async function buildLineMessageContext(params) {
	const { event, allMedia, mediaUnavailable, cfg, account, commandAuthorized, inboundHistory } = params;
	const source = event.source;
	const { userId, groupId, roomId, isGroup, peerId, route } = await resolveLineInboundRoute({
		source,
		cfg,
		account
	});
	const message = event.message;
	const messageId = message.id;
	const timestamp = event.timestamp;
	const textContent = extractMessageText(message);
	const nativeMediaKind = extractNativeMediaKind(message);
	const mediaFacts = allMedia.length > 0 ? allMedia.map((media) => ({
		...media,
		kind: nativeMediaKind
	})) : nativeMediaKind ? [{ kind: nativeMediaKind }] : [];
	const rawBody = textContent;
	const agentBody = mediaUnavailable ? formatInboundMediaUnavailableText({
		body: rawBody,
		notice: "[line attachment unavailable]"
	}) : rawBody;
	if (!agentBody && mediaFacts.length === 0) return null;
	let locationContext;
	if (message.type === "location") {
		const loc = message;
		locationContext = toLocationContext({
			latitude: loc.latitude,
			longitude: loc.longitude,
			name: loc.title,
			address: loc.address
		});
	}
	const finalized = await finalizeLineInboundContext({
		cfg,
		account,
		event,
		route,
		source: {
			userId,
			groupId,
			roomId,
			isGroup,
			peerId
		},
		rawBody,
		agentBody,
		timestamp,
		messageSid: messageId,
		commandAuthorized,
		media: mediaFacts,
		locationContext,
		verboseLog: {
			kind: "inbound",
			mediaCount: allMedia.length
		},
		inboundHistory
	});
	return {
		ctxPayload: finalized.ctxPayload,
		turn: finalized.turn,
		event,
		userId,
		groupId,
		roomId,
		isGroup,
		route,
		replyToken: event.replyToken,
		accountId: account.accountId
	};
}
async function buildLinePostbackContext(params) {
	const { event, cfg, account, commandAuthorized } = params;
	const source = event.source;
	const { userId, groupId, roomId, isGroup, peerId, route } = await resolveLineInboundRoute({
		source,
		cfg,
		account
	});
	const timestamp = event.timestamp;
	const rawData = event.postback?.data?.trim() ?? "";
	if (!rawData) return null;
	let rawBody = rawData;
	if (rawData.includes("line.action=")) {
		const searchParams = new URLSearchParams(rawData);
		const action = searchParams.get("line.action") ?? "";
		const device = searchParams.get("line.device");
		rawBody = device ? `line action ${action} device ${device}` : `line action ${action}`;
	}
	const messageSid = event.replyToken ? `postback:${event.replyToken}` : `postback:${timestamp}`;
	const finalized = await finalizeLineInboundContext({
		cfg,
		account,
		event,
		route,
		source: {
			userId,
			groupId,
			roomId,
			isGroup,
			peerId
		},
		rawBody,
		timestamp,
		messageSid,
		commandAuthorized,
		media: [],
		verboseLog: { kind: "postback" }
	});
	return {
		ctxPayload: finalized.ctxPayload,
		turn: finalized.turn,
		event,
		userId,
		groupId,
		roomId,
		isGroup,
		route,
		replyToken: event.replyToken,
		accountId: account.accountId
	};
}
//#endregion
//#region extensions/line/src/group-history.ts
const reservedEntries = /* @__PURE__ */ new WeakSet();
function reserveLineGroupHistory(historyMap, historyKey, limit) {
	if (!historyMap || !historyKey || limit <= 0) return {
		commit: () => {},
		release: () => {}
	};
	const consumedEntries = (historyMap.get(historyKey) ?? []).filter((entry) => !reservedEntries.has(entry));
	for (const entry of consumedEntries) reservedEntries.add(entry);
	const inboundHistory = createChannelHistoryWindow({ historyMap: /* @__PURE__ */ new Map([[historyKey, consumedEntries]]) }).buildInboundHistory({
		historyKey,
		limit
	});
	let settled = false;
	const settle = () => {
		if (settled) return false;
		settled = true;
		for (const entry of consumedEntries) reservedEntries.delete(entry);
		return true;
	};
	return {
		inboundHistory,
		commit: () => {
			if (!settle() || consumedEntries.length === 0) return;
			const consumed = new Set(consumedEntries);
			const kept = (historyMap.get(historyKey) ?? []).filter((entry) => !consumed.has(entry));
			if (kept.length > 0) historyMap.set(historyKey, kept);
			else historyMap.delete(historyKey);
		},
		release: () => {
			settle();
		}
	};
}
//#endregion
//#region extensions/line/src/bot-handlers.ts
const LINE_DOWNLOADABLE_MESSAGE_TYPES = /* @__PURE__ */ new Set([
	"image",
	"video",
	"audio",
	"file"
]);
function isDownloadableLineMessageType(messageType) {
	return LINE_DOWNLOADABLE_MESSAGE_TYPES.has(messageType);
}
function normalizeLineIngressEntry(value) {
	return normalizeLineAllowEntry(value) || null;
}
function resolveLineGroupConfig(params) {
	return resolveLineGroupConfigEntry(params.config.groups, {
		groupId: params.groupId,
		roomId: params.roomId
	});
}
async function sendLinePairingReply(params) {
	const { senderId, replyToken, context } = params;
	const idLabel = (() => {
		try {
			return resolvePairingIdLabel("line");
		} catch {
			return "lineUserId";
		}
	})();
	await createChannelPairingChallengeIssuer({
		channel: "line",
		accountId: context.account.accountId,
		upsertPairingRequest: async ({ id, meta }) => await upsertChannelPairingRequest({
			channel: "line",
			id,
			accountId: context.account.accountId,
			meta
		})
	})({
		senderId,
		senderIdLine: `Your ${idLabel}: ${senderId}`,
		onCreated: () => {
			logVerbose(`line pairing request sender=${senderId}`);
		},
		sendPairingReply: async (text) => {
			if (replyToken) try {
				await replyMessageLine(replyToken, [{
					type: "text",
					text
				}], {
					cfg: context.cfg,
					accountId: context.account.accountId,
					channelAccessToken: context.account.channelAccessToken
				});
				return;
			} catch (err) {
				logVerbose(`line pairing reply failed for ${senderId}: ${String(err)}`);
			}
			try {
				await pushMessageLine(`line:${senderId}`, text, {
					cfg: context.cfg,
					accountId: context.account.accountId,
					channelAccessToken: context.account.channelAccessToken
				});
			} catch (err) {
				logVerbose(`line pairing reply failed for ${senderId}: ${String(err)}`);
			}
		}
	});
}
async function shouldProcessLineEvent(event, context) {
	const { cfg, account } = context;
	const { userId, groupId, roomId, isGroup } = getLineSourceInfo(event.source);
	const senderId = userId ?? "";
	const groupConfig = resolveLineGroupConfig({
		config: account.config,
		groupId,
		roomId
	});
	const rawText = resolveEventRawText(event);
	const requireMention = isGroup ? groupConfig?.requireMention !== false : false;
	const dmPolicy = account.config.dmPolicy ?? "pairing";
	const { groupPolicy: runtimeGroupPolicy, providerMissingFallbackApplied } = resolveAllowlistProviderRuntimeGroupPolicy({
		providerConfigPresent: cfg.channels?.line !== void 0,
		groupPolicy: account.config.groupPolicy,
		defaultGroupPolicy: resolveDefaultGroupPolicy(cfg)
	});
	const groupPolicy = runtimeGroupPolicy === "disabled" ? "disabled" : groupConfig?.allowFrom !== void 0 ? "allowlist" : runtimeGroupPolicy;
	const groupAllowFrom = normalizeStringEntries(firstDefined(groupConfig?.allowFrom, account.config.groupAllowFrom));
	const mentionFacts = (() => {
		if (!isGroup || event.type !== "message") return {
			canDetectMention: false,
			wasMentioned: false,
			hasAnyMention: false
		};
		const peerId = groupId ?? roomId ?? userId ?? "unknown";
		const { agentId } = resolveAgentRoute({
			cfg,
			channel: "line",
			accountId: account.accountId,
			peer: {
				kind: "group",
				id: peerId
			}
		});
		const mentionRegexes = buildMentionRegexes(cfg, agentId);
		const wasMentionedByNative = isLineBotMentioned(event.message);
		const wasMentionedByPattern = event.message.type === "text" ? matchesMentionPatterns(rawText, mentionRegexes) : false;
		return {
			canDetectMention: event.message.type === "text",
			wasMentioned: wasMentionedByNative || wasMentionedByPattern,
			hasAnyMention: hasAnyLineMention(event.message)
		};
	})();
	const access = await resolveStableChannelMessageIngress({
		channelId: "line",
		accountId: account.accountId,
		identity: {
			key: "line-user-id",
			normalize: normalizeLineIngressEntry,
			sensitivity: "pii",
			entryIdPrefix: "line-entry"
		},
		cfg,
		readStoreAllowFrom: async () => await readChannelAllowFromStore("line", void 0, account.accountId),
		subject: { stableId: senderId },
		conversation: {
			kind: isGroup ? "group" : "direct",
			id: (groupId ?? roomId ?? senderId) || "unknown"
		},
		...isGroup && groupConfig?.enabled === false ? { route: {
			id: "line:group-config",
			enabled: false
		} } : {},
		mentionFacts: isGroup && event.type === "message" ? {
			canDetectMention: mentionFacts.canDetectMention,
			wasMentioned: mentionFacts.wasMentioned,
			hasAnyMention: mentionFacts.hasAnyMention,
			implicitMentionKinds: []
		} : void 0,
		event: { kind: event.type === "postback" ? "postback" : "message" },
		dmPolicy,
		groupPolicy,
		policy: {
			groupAllowFromFallbackToAllowFrom: false,
			activation: {
				requireMention: isGroup && event.type === "message" && requireMention,
				allowTextCommands: true
			}
		},
		allowFrom: normalizeStringEntries(account.config.allowFrom),
		groupAllowFrom,
		command: {
			hasControlCommand: hasControlCommand(rawText, cfg),
			groupOwnerAllowFrom: "none"
		}
	});
	warnMissingProviderGroupPolicyFallbackOnce({
		providerMissingFallbackApplied,
		providerKey: "line",
		accountId: account.accountId,
		log: (message) => logVerbose(message)
	});
	if (access.senderAccess.decision === "allow" && (access.ingress.admission === "dispatch" || access.ingress.admission === "observe" || access.ingress.admission === "skip")) return access;
	if (access.senderAccess.decision === "allow") {
		logVerbose(`Blocked line event (${access.ingress.reasonCode})`);
		return null;
	}
	if (isGroup) {
		if (groupConfig?.enabled === false) {
			logVerbose(`Blocked line group ${groupId ?? roomId ?? "unknown"} (group disabled)`);
			return null;
		}
		if (groupConfig?.allowFrom !== void 0) {
			if (!senderId) {
				logVerbose("Blocked line group message (group allowFrom override, no sender ID)");
				return null;
			}
			if (access.senderAccess.reasonCode !== "group_policy_allowed") {
				logVerbose(`Blocked line group sender ${senderId} (group allowFrom override)`);
				return null;
			}
		}
		if (access.senderAccess.reasonCode === "group_policy_disabled") logVerbose("Blocked line group message (groupPolicy: disabled)");
		else if (!senderId && groupPolicy === "allowlist") logVerbose("Blocked line group message (no sender ID, groupPolicy: allowlist)");
		else if (access.senderAccess.reasonCode === "group_policy_empty_allowlist") logVerbose("Blocked line group message (groupPolicy: allowlist, no groupAllowFrom)");
		else logVerbose(`Blocked line group message from ${senderId} (groupPolicy: allowlist)`);
		return null;
	}
	if (access.senderAccess.reasonCode === "dm_policy_disabled") {
		logVerbose("Blocked line sender (dmPolicy: disabled)");
		return null;
	}
	if (access.senderAccess.decision === "pairing") {
		if (!senderId) {
			logVerbose("Blocked line sender (dmPolicy: pairing, no sender ID)");
			return null;
		}
		await sendLinePairingReply({
			senderId,
			replyToken: "replyToken" in event ? event.replyToken : void 0,
			context
		});
		return null;
	}
	logVerbose(`Blocked line sender ${senderId || "unknown"} (dmPolicy: ${account.config.dmPolicy ?? "pairing"})`);
	return null;
}
function getLineMentionees(message) {
	if (message.type !== "text") return [];
	const mentionees = message.mention?.mentionees;
	return Array.isArray(mentionees) ? mentionees : [];
}
function isLineBotMentioned(message) {
	return getLineMentionees(message).some((m) => m.isSelf === true || m.type === "all");
}
function hasAnyLineMention(message) {
	return getLineMentionees(message).length > 0;
}
function resolveEventRawText(event) {
	if (event.type === "message") {
		const msg = event.message;
		if (msg.type === "text") return msg.text;
		return "";
	}
	if (event.type === "postback") return event.postback?.data?.trim() ?? "";
	return "";
}
async function handleMessageEvent(event, context) {
	const { cfg, account, runtime, mediaMaxBytes, processMessage } = context;
	const message = event.message;
	const decision = await shouldProcessLineEvent(event, context);
	if (!decision) return;
	const { isGroup, groupId, roomId } = getLineSourceInfo(event.source);
	if (isGroup && decision.activationAccess.shouldSkip) {
		const rawText = message.type === "text" ? message.text : "";
		const sourceInfo = getLineSourceInfo(event.source);
		logVerbose(`line: skipping group message (requireMention, not mentioned)`);
		const historyKey = groupId ?? roomId;
		const senderId = sourceInfo.userId ?? "unknown";
		if (historyKey && context.groupHistories) createChannelHistoryWindow({ historyMap: context.groupHistories }).record({
			historyKey,
			limit: context.historyLimit ?? 50,
			entry: {
				sender: `user:${senderId}`,
				body: rawText || `<${message.type}>`,
				timestamp: event.timestamp
			}
		});
		return;
	}
	const groupHistoryKey = isGroup ? groupId ?? roomId : void 0;
	const historyReservation = reserveLineGroupHistory(context.groupHistories, groupHistoryKey, context.historyLimit ?? 50);
	try {
		const allMedia = [];
		let mediaUnavailable = false;
		if (isDownloadableLineMessageType(message.type)) try {
			const originalFilename = message.type === "file" ? normalizeOptionalString(message.fileName) : void 0;
			const media = await downloadLineMedia(message.id, account.channelAccessToken, mediaMaxBytes, { originalFilename });
			allMedia.push({
				path: media.path,
				contentType: media.contentType
			});
		} catch (err) {
			if (isRetryableLineInboundMediaError(err)) throw err;
			mediaUnavailable = true;
			const errMsg = String(err);
			if (errMsg.includes("exceeds") && errMsg.includes("limit")) logVerbose(`line: media exceeds size limit for message ${message.id}`);
			else runtime.error?.(danger(`line: failed to download media: ${errMsg}`));
		}
		const messageContext = await buildLineMessageContext({
			event,
			allMedia,
			mediaUnavailable,
			cfg,
			account,
			commandAuthorized: decision.commandAccess.authorized,
			inboundHistory: historyReservation.inboundHistory
		});
		if (!messageContext) {
			logVerbose("line: skipping empty message");
			return;
		}
		await processMessage(messageContext, context.turnAdoptionLifecycle ? { turnAdoptionLifecycle: context.turnAdoptionLifecycle } : {});
		historyReservation.commit();
	} finally {
		historyReservation.release();
	}
}
async function handleFollowEvent(event, _context) {
	const { userId } = getLineSourceInfo(event.source);
	logVerbose(`line: user ${userId ?? "unknown"} followed`);
}
async function handleUnfollowEvent(event, _context) {
	const { userId } = getLineSourceInfo(event.source);
	logVerbose(`line: user ${userId ?? "unknown"} unfollowed`);
}
async function handleJoinEvent(event, _context) {
	const { groupId, roomId } = getLineSourceInfo(event.source);
	logVerbose(`line: bot joined ${groupId ? `group ${groupId}` : `room ${roomId}`}`);
}
async function handleLeaveEvent(event, _context) {
	const { groupId, roomId } = getLineSourceInfo(event.source);
	logVerbose(`line: bot left ${groupId ? `group ${groupId}` : `room ${roomId}`}`);
}
async function handlePostbackEvent(event, context) {
	const data = event.postback.data;
	logVerbose(`line: received postback: ${data}`);
	const decision = await shouldProcessLineEvent(event, context);
	if (!decision) return;
	const postbackContext = await buildLinePostbackContext({
		event,
		cfg: context.cfg,
		account: context.account,
		commandAuthorized: decision.commandAccess.authorized
	});
	if (!postbackContext) return;
	await context.processMessage(postbackContext, context.turnAdoptionLifecycle ? { turnAdoptionLifecycle: context.turnAdoptionLifecycle } : {});
}
async function handleLineWebhookEvents(events, context) {
	let firstError;
	for (const event of events) try {
		await handleLineWebhookEvent(event, context);
	} catch (err) {
		context.runtime.error?.(danger(`line: event handler failed: ${String(err)}`));
		firstError ??= err;
	}
	if (firstError) throw toLintErrorObject(firstError, "Non-Error thrown");
}
async function handleLineWebhookEvent(event, context) {
	switch (event.type) {
		case "message":
			await handleMessageEvent(event, context);
			break;
		case "follow":
			await handleFollowEvent(event, context);
			break;
		case "unfollow":
			await handleUnfollowEvent(event, context);
			break;
		case "join":
			await handleJoinEvent(event, context);
			break;
		case "leave":
			await handleLeaveEvent(event, context);
			break;
		case "postback":
			await handlePostbackEvent(event, context);
			break;
		default: logVerbose(`line: unhandled event type: ${event.type}`);
	}
}
function toLintErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
//#endregion
//#region extensions/line/src/webhook-spool.ts
const LINE_WEBHOOK_SPOOL_VERSION = 1;
const LINE_WEBHOOK_DRAIN_INTERVAL_MS = 500;
const LINE_WEBHOOK_MAX_CONCURRENT_DELIVERIES = 8;
const LINE_WEBHOOK_DRAIN_SCAN_LIMIT = 100;
const LINE_WEBHOOK_ACTIVE_DELIVERY_STOP_GRACE_MS = 5e3;
const LINE_WEBHOOK_TOMBSTONE_TTL_MS = 720 * 60 * 6e4;
const LINE_WEBHOOK_TOMBSTONE_MAX_ENTRIES = 4096;
var LineWebhookPayloadError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "LineWebhookPayloadError";
	}
};
var LineWebhookTerminalDeliveryError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.reason = "delivery-side-effects-committed";
		this.name = "LineWebhookTerminalDeliveryError";
	}
};
function nonEmptyString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : null;
}
/** Message ids preserve the shipped replay-guard keyspace; other events use LINE's delivery id. */
function eventIdFor(event) {
	if (!event || typeof event !== "object") throw new LineWebhookPayloadError("LINE webhook event must be an object.");
	const candidate = event;
	if (candidate.type === "message") {
		const messageId = nonEmptyString(candidate.message?.id);
		if (messageId) return `message:${messageId}`;
	}
	const webhookEventId = nonEmptyString(candidate.webhookEventId);
	if (webhookEventId) return `event:${webhookEventId}`;
	throw new LineWebhookPayloadError("LINE webhook event is missing a stable delivery id.");
}
function laneKeyFor(event, eventId) {
	if (!event || typeof event !== "object") return eventId;
	const source = event.source;
	if (source?.type === "group") {
		const groupId = nonEmptyString(source.groupId);
		if (groupId) return `group:${groupId}`;
	}
	if (source?.type === "room") {
		const roomId = nonEmptyString(source.roomId);
		if (roomId) return `room:${roomId}`;
	}
	if (source?.type === "user") {
		const userId = nonEmptyString(source.userId);
		if (userId) return `user:${userId}`;
	}
	return eventId;
}
function parseStoredEvent(rawEvent) {
	let event;
	try {
		event = JSON.parse(rawEvent);
	} catch (error) {
		throw new LineWebhookPayloadError("LINE webhook event JSON is invalid.", { cause: error });
	}
	return event;
}
function errorText(error) {
	return error instanceof Error ? error.message : String(error);
}
function isLineAuthenticationFailure(error) {
	if (!error || typeof error !== "object") return false;
	const status = error.status;
	return status === 401 || status === 403;
}
async function waitForActiveDeliveriesBeforeDispose(activeDeliveries) {
	let timeout;
	try {
		return await Promise.race([Promise.allSettled(activeDeliveries).then(() => true), new Promise((resolve) => {
			timeout = setTimeout(() => resolve(false), LINE_WEBHOOK_ACTIVE_DELIVERY_STOP_GRACE_MS);
			timeout.unref?.();
		})]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
function createLineWebhookSpool(options) {
	const queue = options.queue ?? getLineRuntime().state.openChannelIngressQueue({ accountId: options.accountId });
	const activeDeliveries = /* @__PURE__ */ new Set();
	const deferredClaims = /* @__PURE__ */ new Map();
	let acceptsDeferredClaims = true;
	const monitor = createChannelIngressMonitor({
		queue,
		inspect: ({ event }) => {
			const eventId = eventIdFor(event);
			return {
				eventId,
				laneKey: laneKeyFor(event, eventId)
			};
		},
		payload: {
			version: LINE_WEBHOOK_SPOOL_VERSION,
			serialize: ({ event, destination }) => ({
				rawEvent: JSON.stringify(event),
				destination
			}),
			deserialize: ({ rawEvent, destination }) => ({
				event: parseStoredEvent(rawEvent),
				destination
			}),
			encode: ({ version, body }) => ({
				version,
				rawEvent: body.rawEvent,
				destination: body.destination
			}),
			decode: (payload) => {
				if (typeof payload.rawEvent !== "string" || typeof payload.destination !== "string") throw new LineWebhookPayloadError("LINE webhook spool payload is invalid.");
				return {
					version: payload.version,
					body: {
						rawEvent: payload.rawEvent,
						destination: payload.destination
					}
				};
			},
			createClaimError: (kind) => new LineWebhookPayloadError(kind === "invalid-version" ? "LINE webhook spool payload is invalid." : "LINE webhook event identity changed after durable admission.")
		},
		deliver: async ({ event, destination }, lifecycle, claim) => {
			const boundLifecycle = bindIngressLifecycleToReplyOptions(lifecycle).turnAdoptionLifecycle;
			let handedOff = false;
			let resolveDeferredClaim;
			const deferredClaim = new Promise((resolve) => {
				resolveDeferredClaim = resolve;
			});
			let deferredClaimSettled = false;
			const settleDeferredClaim = () => {
				if (deferredClaimSettled) return;
				deferredClaimSettled = true;
				if (deferredClaims.get(claim.id) === deferredClaim) deferredClaims.delete(claim.id);
				resolveDeferredClaim();
			};
			const delivery = options.deliver(event, destination, { turnAdoptionLifecycle: {
				...boundLifecycle,
				onAdopted: async () => {
					handedOff = true;
					try {
						await boundLifecycle.onAdopted();
					} finally {
						settleDeferredClaim();
					}
				},
				onDeferred: () => {
					handedOff = true;
					if (!acceptsDeferredClaims) {
						settleDeferredClaim();
						Promise.resolve().then(() => boundLifecycle.onAbandoned()).catch((error) => {
							options.runtime.error?.(danger(`line: failed to abandon a late webhook delivery: ${errorText(error)}`));
						});
						return;
					}
					if (!deferredClaimSettled) deferredClaims.set(claim.id, deferredClaim);
					boundLifecycle.onDeferred();
				},
				onAbandoned: async () => {
					handedOff = true;
					try {
						await boundLifecycle.onAbandoned();
					} finally {
						settleDeferredClaim();
					}
				}
			} });
			activeDeliveries.add(delivery);
			try {
				await delivery;
			} finally {
				activeDeliveries.delete(delivery);
			}
			if (stopTask && !handedOff) return {
				kind: "failed-retryable",
				error: /* @__PURE__ */ new Error("LINE webhook spool stopped before delivery handoff.")
			};
		},
		pollIntervalMs: LINE_WEBHOOK_DRAIN_INTERVAL_MS,
		retention: {
			pruneIntervalMs: 0,
			completedTtlMs: LINE_WEBHOOK_TOMBSTONE_TTL_MS,
			completedMaxEntries: LINE_WEBHOOK_TOMBSTONE_MAX_ENTRIES,
			failedTtlMs: LINE_WEBHOOK_TOMBSTONE_TTL_MS,
			failedMaxEntries: LINE_WEBHOOK_TOMBSTONE_MAX_ENTRIES
		},
		appendRetryDelaysMs: [0],
		waitForDeliveryIdleBeforeRepump: false,
		waitForDeliveryIdleOnStop: false,
		runPumpTask: runDetachedWebhookWork,
		admissionMode: "durable-after-stop",
		drain: {
			adoptionStallTimeoutMs: DEFAULT_INGRESS_ADOPTION_STALL_MS,
			orderBy: "received",
			scanLimit: LINE_WEBHOOK_DRAIN_SCAN_LIMIT,
			startLimit: LINE_WEBHOOK_MAX_CONCURRENT_DELIVERIES,
			retryPolicy: {
				maxAttempts: 8,
				deadLetterMinAgeMs: 0
			},
			resolveNonRetryableFailure: (error) => {
				if (error instanceof LineWebhookPayloadError) return {
					reason: "invalid-event",
					message: error.message
				};
				if (error instanceof LineWebhookTerminalDeliveryError) return {
					reason: error.reason,
					message: error.message
				};
				if (isLineAuthenticationFailure(error)) return {
					reason: "authentication-failed",
					message: errorText(error)
				};
				return null;
			},
			onLog: (message) => options.runtime.error?.(danger(`line: ${message}`))
		},
		createStoppedError: () => /* @__PURE__ */ new Error("LINE webhook spool is stopped."),
		onError: (error) => options.runtime.error?.(danger(`line: webhook spool drain failed: ${errorText(error)}`))
	});
	let stopTask;
	return {
		accept: async (body) => {
			const events = body.events ?? [];
			if (events.length === 0) return;
			await monitor.admitBatch(events.map((event) => ({
				event,
				destination: body.destination ?? ""
			})), { receivedAt: Date.now() });
		},
		start: () => {
			if (!stopTask) monitor.start();
		},
		stop: () => {
			stopTask ??= (async () => {
				await monitor.pause();
				try {
					const deliveriesSettled = await waitForActiveDeliveriesBeforeDispose(activeDeliveries);
					if (!deliveriesSettled) options.runtime.log(warn(`line: timed out after ${LINE_WEBHOOK_ACTIVE_DELIVERY_STOP_GRACE_MS}ms waiting for active webhook deliveries; releasing drain ownership`));
					while (deferredClaims.size > 0) await Promise.allSettled(deferredClaims.values());
					acceptsDeferredClaims = false;
					if (deliveriesSettled) await monitor.waitForIdle();
				} finally {
					await monitor.stop();
				}
			})();
			return stopTask;
		}
	};
}
//#endregion
//#region extensions/line/src/bot.ts
function createLineBot(opts) {
	const runtime = opts.runtime ?? createNonExitingRuntime();
	const cfg = opts.config ?? getRuntimeConfig();
	const account = resolveLineAccount({
		cfg,
		accountId: opts.accountId
	});
	const mediaMaxBytes = (opts.mediaMaxMb ?? account.config.mediaMaxMb ?? 10) * 1024 * 1024;
	const processMessage = opts.onMessage ?? (async () => {
		logVerbose("line: no message handler configured");
	});
	const groupHistories = /* @__PURE__ */ new Map();
	const spool = createLineWebhookSpool({
		accountId: account.accountId,
		runtime,
		deliver: async (event, _destination, control) => await handleLineWebhookEvents([event], {
			cfg,
			account,
			runtime,
			mediaMaxBytes,
			processMessage,
			...control.turnAdoptionLifecycle ? { turnAdoptionLifecycle: control.turnAdoptionLifecycle } : {},
			groupHistories,
			historyLimit: cfg.messages?.groupChat?.historyLimit ?? 50
		})
	});
	spool.start();
	return {
		handleWebhook: spool.accept,
		account,
		stop: spool.stop
	};
}
//#endregion
//#region extensions/line/src/monitor-durable.ts
function hasLineChannelData(payload) {
	const lineData = payload.channelData?.line;
	return Boolean(lineData && Object.keys(lineData).length > 0);
}
function resolveLineDurableReplyOptions(params) {
	if (params.infoKind !== "final") return false;
	if (params.replyToken && !params.replyTokenUsed) return false;
	if (hasLineChannelData(params.payload)) return false;
	const reply = resolveSendableOutboundReplyParts(params.payload);
	if (reply.hasMedia || !reply.hasText) return false;
	return { to: params.to };
}
//#endregion
//#region extensions/line/src/signature.ts
function validateLineSignature(body, signature, channelSecret) {
	return safeEqualSecret(signature, crypto.createHmac("SHA256", channelSecret).update(body).digest("base64"));
}
//#endregion
//#region extensions/line/src/webhook-utils.ts
function parseLineWebhookBody(rawBody) {
	try {
		return JSON.parse(rawBody);
	} catch {
		return null;
	}
}
//#endregion
//#region extensions/line/src/webhook-node.ts
const LINE_WEBHOOK_MAX_BODY_BYTES = 1024 * 1024;
const LINE_WEBHOOK_PREAUTH_MAX_BODY_BYTES$1 = 64 * 1024;
const LINE_WEBHOOK_PREAUTH_BODY_TIMEOUT_MS$1 = 5e3;
async function readLineWebhookRequestBody(req, maxBytes = LINE_WEBHOOK_MAX_BODY_BYTES, timeoutMs = LINE_WEBHOOK_PREAUTH_BODY_TIMEOUT_MS$1) {
	return await readRequestBodyWithLimit(req, {
		maxBytes,
		timeoutMs
	});
}
function createLineNodeWebhookHandler(params) {
	const maxBodyBytes = params.maxBodyBytes ?? LINE_WEBHOOK_MAX_BODY_BYTES;
	const readBody = params.readBody ?? readLineWebhookRequestBody;
	return async (req, res) => {
		if (req.method === "GET" || req.method === "HEAD") {
			if (req.method === "HEAD") {
				res.statusCode = 204;
				res.end();
				return;
			}
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/plain");
			res.end("OK");
			return;
		}
		if (req.method !== "POST") {
			res.statusCode = 405;
			res.setHeader("Allow", "GET, HEAD, POST");
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify({ error: "Method Not Allowed" }));
			return;
		}
		try {
			const signatureHeader = req.headers["x-line-signature"];
			const signature = typeof signatureHeader === "string" ? signatureHeader.trim() : Array.isArray(signatureHeader) ? (signatureHeader[0] ?? "").trim() : "";
			if (!signature) {
				logVerbose("line: webhook missing X-Line-Signature header");
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify({ error: "Missing X-Line-Signature header" }));
				return;
			}
			const rawBody = await readBody(req, Math.min(maxBodyBytes, LINE_WEBHOOK_PREAUTH_MAX_BODY_BYTES$1), LINE_WEBHOOK_PREAUTH_BODY_TIMEOUT_MS$1);
			if (!validateLineSignature(rawBody, signature, params.channelSecret)) {
				logVerbose("line: webhook signature validation failed");
				res.statusCode = 401;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify({ error: "Invalid signature" }));
				return;
			}
			const body = parseLineWebhookBody(rawBody);
			if (!body) {
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify({ error: "Invalid webhook payload" }));
				return;
			}
			params.onRequestAuthenticated?.();
			if (body.events && body.events.length > 0) {
				logVerbose(`line: received ${body.events.length} webhook events`);
				await params.bot.handleWebhook(body);
			}
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify({ status: "ok" }));
		} catch (err) {
			if (isRequestBodyLimitError(err, "PAYLOAD_TOO_LARGE")) {
				res.statusCode = 413;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify({ error: "Payload too large" }));
				return;
			}
			if (isRequestBodyLimitError(err, "REQUEST_BODY_TIMEOUT")) {
				res.statusCode = 408;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify({ error: requestBodyErrorToText("REQUEST_BODY_TIMEOUT") }));
				return;
			}
			params.runtime.error?.(danger(`line webhook error: ${String(err)}`));
			if (!res.headersSent) {
				res.statusCode = 500;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify({ error: "Internal server error" }));
			}
		}
	};
}
//#endregion
//#region extensions/line/src/monitor.ts
const lineWebhookInFlightLimiter = createWebhookInFlightLimiter();
const LINE_WEBHOOK_PREAUTH_MAX_BODY_BYTES = 64 * 1024;
const LINE_WEBHOOK_PREAUTH_BODY_TIMEOUT_MS = 5e3;
const lineWebhookTargets = /* @__PURE__ */ new Map();
function startLineLoadingKeepalive(params) {
	const intervalMs = params.intervalMs ?? 18e3;
	const loadingSeconds = params.loadingSeconds ?? 20;
	let stopped = false;
	const trigger = () => {
		if (stopped) return;
		showLoadingAnimation(params.userId, {
			cfg: params.cfg,
			accountId: params.accountId,
			loadingSeconds
		}).catch(() => {});
	};
	trigger();
	const timer = setInterval(trigger, intervalMs);
	return () => {
		if (stopped) return;
		stopped = true;
		clearInterval(timer);
	};
}
async function monitorLineProvider(opts) {
	const { channelAccessToken, channelSecret, accountId, config, runtime, abortSignal, webhookPath } = opts;
	const resolvedAccountId = accountId ?? resolveDefaultLineAccountId(config);
	const token = channelAccessToken.trim();
	const secret = channelSecret.trim();
	if (!token) throw new Error("LINE webhook mode requires a non-empty channel access token.");
	if (!secret) throw new Error("LINE webhook mode requires a non-empty channel secret.");
	const bot = createLineBot({
		channelAccessToken: token,
		channelSecret: secret,
		accountId,
		runtime,
		config,
		onMessage: async (ctx, deliveryControl) => {
			if (!ctx) return;
			const { ctxPayload, replyToken, route } = ctx;
			const shouldShowLoading = Boolean(ctx.userId && !ctx.isGroup);
			const displayNamePromise = ctx.userId ? getUserDisplayName(ctx.userId, {
				cfg: config,
				accountId: ctx.accountId
			}) : Promise.resolve(ctxPayload.From);
			const stopLoading = shouldShowLoading ? startLineLoadingKeepalive({
				cfg: config,
				userId: ctx.userId,
				accountId: ctx.accountId
			}) : null;
			logVerbose(`line: received message from ${await displayNamePromise} (${ctxPayload.From})`);
			let replyTokenUsed = false;
			let turnAdopted = false;
			const ingressLifecycle = deliveryControl.turnAdoptionLifecycle;
			try {
				const textLimit = 5e3;
				const turnResult = await getLineRuntime().channel.inbound.run({
					channel: "line",
					accountId: route.accountId,
					raw: ctx,
					turnAdoptionLifecycle: {
						...ingressLifecycle,
						admission: "exclusive",
						onAdopted: async () => {
							await ingressLifecycle?.onAdopted();
							turnAdopted = true;
						}
					},
					adapter: {
						ingest: () => ({
							id: ctxPayload.MessageSid ?? `${ctxPayload.From}:${Date.now()}`,
							rawText: ctxPayload.RawBody ?? ctxPayload.BodyForAgent ?? ""
						}),
						resolveTurn: () => ({
							cfg: config,
							channel: "line",
							accountId: route.accountId,
							route: {
								agentId: route.agentId,
								sessionKey: route.sessionKey
							},
							ctxPayload,
							record: ctx.turn.record,
							replyPipeline: {},
							...ingressLifecycle?.abortSignal ? { replyOptions: { abortSignal: ingressLifecycle.abortSignal } } : {},
							delivery: {
								durable: (payload, info) => resolveLineDurableReplyOptions({
									payload,
									infoKind: info.kind,
									to: ctxPayload.From,
									replyToken,
									replyTokenUsed
								}),
								deliver: async (payload) => {
									const lineData = payload.channelData?.line ?? {};
									if (ctx.userId && !ctx.isGroup) showLoadingAnimation(ctx.userId, {
										cfg: config,
										accountId: ctx.accountId
									}).catch(() => {});
									const deliveryResult = await deliverLineAutoReply({
										payload,
										lineData,
										to: ctxPayload.From,
										replyToken,
										replyTokenUsed,
										accountId: ctx.accountId,
										cfg: config,
										textLimit,
										deps: {
											buildTemplateMessageFromPayload,
											processLineMessage,
											chunkMarkdownText,
											replyMessageLine,
											createQuickReplyItems,
											pushMessagesLine,
											createFlexMessage,
											buildMediaMessage: buildLineMediaMessage,
											createLocationMessage,
											onReplyError: (replyErr) => {
												logVerbose(`line: reply token failed, falling back to push: ${String(replyErr)}`);
											}
										}
									});
									replyTokenUsed = deliveryResult.replyTokenUsed;
									if (deliveryResult.status === "partial") throw deliveryResult.error;
									return { visibleReplySent: deliveryResult.visibleReplySent };
								},
								onError: (err, info) => {
									runtime.error?.(danger(`line ${info.kind} reply failed: ${String(err)}`));
								}
							}
						})
					}
				});
				if (!hasFinalChannelTurnDispatch(turnResult.dispatched ? turnResult.dispatchResult : void 0)) logVerbose(`line: no response generated for message from ${ctxPayload.From}`);
			} catch (err) {
				runtime.error?.(danger(`line: auto-reply failed: ${String(err)}`));
				if (turnAdopted || replyTokenUsed) throw new LineWebhookTerminalDeliveryError("LINE delivery failed after consuming the event reply token.", { cause: err });
				throw err;
			} finally {
				stopLoading?.();
			}
		}
	});
	const normalizedPath = normalizeWebhookPath(normalizePluginHttpPath(webhookPath, "/line/webhook") ?? "/line/webhook");
	const createScopedLineWebhookHandler = (target) => createLineNodeWebhookHandler({
		channelSecret: target.channelSecret,
		bot: target.bot,
		runtime: target.runtime
	});
	const { unregister: unregisterHttp } = registerWebhookTargetWithPluginRoute({
		targetsByPath: lineWebhookTargets,
		target: {
			accountId: resolvedAccountId,
			bot,
			channelSecret: secret,
			path: normalizedPath,
			runtime
		},
		route: {
			auth: "plugin",
			pluginId: "line",
			accountId: resolvedAccountId,
			log: (msg) => logVerbose(msg),
			handler: async (req, res) => {
				const targets = lineWebhookTargets.get(normalizedPath) ?? [];
				const firstTarget = targets[0];
				if (req.method !== "POST") {
					if (!firstTarget) {
						res.statusCode = 404;
						res.end("Not Found");
						return;
					}
					await createScopedLineWebhookHandler(firstTarget)(req, res);
					return;
				}
				const requestLifecycle = beginWebhookRequestPipelineOrReject({
					req,
					res,
					inFlightLimiter: lineWebhookInFlightLimiter,
					inFlightKey: `line:${normalizedPath}`
				});
				if (!requestLifecycle.ok) return;
				try {
					const signatureHeader = req.headers["x-line-signature"];
					const signature = typeof signatureHeader === "string" ? signatureHeader.trim() : Array.isArray(signatureHeader) ? (signatureHeader[0] ?? "").trim() : "";
					if (!signature) {
						logVerbose("line: webhook missing X-Line-Signature header");
						res.statusCode = 400;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ error: "Missing X-Line-Signature header" }));
						return;
					}
					const rawBody = await readLineWebhookRequestBody(req, LINE_WEBHOOK_PREAUTH_MAX_BODY_BYTES, LINE_WEBHOOK_PREAUTH_BODY_TIMEOUT_MS);
					const match = resolveSingleWebhookTarget(targets, (target) => validateLineSignature(rawBody, signature, target.channelSecret));
					if (match.kind === "none") {
						logVerbose("line: webhook signature validation failed");
						res.statusCode = 401;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ error: "Invalid signature" }));
						return;
					}
					if (match.kind === "ambiguous") {
						logVerbose("line: webhook signature matched multiple accounts");
						res.statusCode = 401;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ error: "Ambiguous webhook target" }));
						return;
					}
					const body = parseLineWebhookBody(rawBody);
					if (!body) {
						res.statusCode = 400;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ error: "Invalid webhook payload" }));
						return;
					}
					if (body.events && body.events.length > 0) {
						logVerbose(`line: received ${body.events.length} webhook events`);
						await match.target.bot.handleWebhook(body);
					}
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.end(JSON.stringify({ status: "ok" }));
				} catch (err) {
					if (isRequestBodyLimitError(err, "PAYLOAD_TOO_LARGE")) {
						res.statusCode = 413;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ error: "Payload too large" }));
						return;
					}
					if (isRequestBodyLimitError(err, "REQUEST_BODY_TIMEOUT")) {
						res.statusCode = 408;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ error: requestBodyErrorToText("REQUEST_BODY_TIMEOUT") }));
						return;
					}
					runtime.error?.(danger(`line webhook error: ${String(err)}`));
					if (!res.headersSent) {
						res.statusCode = 500;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ error: "Internal server error" }));
					}
				} finally {
					requestLifecycle.release();
				}
			}
		}
	});
	logVerbose(`line: registered webhook handler at ${normalizedPath}`);
	let stopped = false;
	let stopPromise;
	const stopHandler = () => {
		if (stopPromise) return stopPromise;
		if (stopped) return Promise.resolve();
		stopped = true;
		logVerbose(`line: stopping provider for account ${resolvedAccountId}`);
		unregisterHttp();
		stopPromise = bot.stop();
		return stopPromise;
	};
	const stopOnAbort = () => void stopHandler();
	if (abortSignal?.aborted) await stopHandler();
	else if (abortSignal) {
		abortSignal.addEventListener("abort", stopOnAbort, { once: true });
		await waitForAbortSignal(abortSignal);
		await stopHandler();
	}
	return {
		account: bot.account,
		handleWebhook: bot.handleWebhook,
		stop: async () => {
			await stopHandler();
			abortSignal?.removeEventListener("abort", stopOnAbort);
		}
	};
}
//#endregion
export { validateLineSignature as a, parseLineWebhookBody as i, createLineNodeWebhookHandler as n, downloadLineMedia as o, readLineWebhookRequestBody as r, normalizeAllowFrom as s, monitorLineProvider as t };
