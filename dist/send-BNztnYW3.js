import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { v as parseStrictInteger } from "./number-coercion-Crk_c9KW.js";
import { c as redactSensitiveText } from "./redact-DNq_HeDt.js";
import { i as formatUncaughtError, r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-DoJxaJiY.js";
import { r as logVerbose } from "./globals-DBBT7Ru5.js";
import { d as readConfigFileSnapshotForWrite } from "./io-CEgS2K9F.js";
import { r as replaceConfigFile } from "./config-BOMcY2yX.js";
import { c as kindFromMime, s as isGifMedia } from "./mime-De36NoRj.js";
import { t as probeVideoDimensions } from "./media-services-YHqWbhOq.js";
import { s as getImageMetadata } from "./image-ops-BFeNLIan.js";
import { l as resolveCronStorePath, o as loadCronStore, p as saveCronStore } from "./store-CFkN1_TJ.js";
import { D as formatLocationText, O as normalizeOutboundLocation } from "./reply-payload-CPcXnHho.js";
import { n as isSingleUseReplyToMode } from "./reply-reference-CblWzjbF.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-VzbF4ozo.js";
import { n as loadWebMedia } from "./web-media-wl1hy1PL.js";
import { c as resolveTextChunkLimit } from "./chunk-B-Yo_muw.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-C0uxiauk.js";
import { n as normalizePollInput } from "./polls-C-v11_tu.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./error-runtime-DUxkdoW4.js";
import "./logging-core-DZYwpRgj.js";
import { l as isVoiceMessageCompatibleAudio } from "./media-runtime-BF28IqU8.js";
import { r as makeProxyFetch } from "./proxy-fetch-CvClvqkk.js";
import "./number-runtime-C6TGSEc_.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-Dnur9SGp.js";
import "./runtime-env-BDC_axp1.js";
import { a as markdownToIRWithMeta, f as tokenizeHtmlTags, n as renderMarkdownWithMarkers, o as sliceMarkdownIR } from "./tables-DsGSc7Wv.js";
import { n as isAutoLinkedFileRef } from "./auto-linked-file-ref-DIO7giFK.js";
import "./text-chunking-CcRmx-1w.js";
import { m as resolveStorePath } from "./session-store-runtime-yTK-eEl-.js";
import { o as normalizeTelegramApiRoot, r as resolveTelegramTransport } from "./fetch-DcyqsPJI.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import { c as isTelegramMisdirectedRequestError, d as isTelegramServerError, p as tagTelegramNetworkError, r as isSafeToRetrySendError, t as isRecoverableTelegramNetworkError, u as isTelegramRateLimitError } from "./network-errors-DCsO9L1u.js";
import { r as resolveTelegramRequestTimeoutMs } from "./request-timeouts-C2F_8uWi.js";
import { t as resolveTelegramBotUserIdFromToken } from "./token-CH-zaFlM.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-BM1zBTeF.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import "./config-mutation-CzMSFKMG.js";
import "./cron-store-runtime-Dfde9gGH.js";
import "./reply-reference-oyTerJRY.js";
import "./reply-chunking-DDkaiQAg.js";
import "./web-media-DdHgGDGy.js";
import { n as createChannelApiRetryRunner } from "./retry-policy-4afimgeb.js";
import "./ssrf-runtime-b7ye-Z-7.js";
import "./markdown-table-runtime-DsKAllpK.js";
import "./diagnostic-runtime-BpktsaTw.js";
import "./channel-inbound-CsmpMLUZ.js";
import "./channel-outbound-D_Kkmr30.js";
import { t as createChannelHistoryWindow } from "./reply-history-ByRtpsh-.js";
import "./retry-runtime-DSaAoazp.js";
import { o as resolveTelegramAccount } from "./accounts-DspPmbuS.js";
import { a as parseTelegramTarget, n as normalizeTelegramChatId, r as normalizeTelegramLookupTarget } from "./targets-CJIsAOe0.js";
import { A as buildTelegramThreadParams, dt as splitTelegramHtmlChunks, ft as telegramHtmlToPlainTextFallback, g as resolveTelegramMessageCacheScope, gt as normalizeTelegramReplyToMessageId, i as recordSentMessage, j as buildTypingThreadParams, mt as decodeTelegramHtmlEntities, st as markdownToTelegramChunks, u as createTelegramMessageCache, ut as renderTelegramHtmlText } from "./sent-message-cache-HHSaRWZy.js";
import { t as buildInlineKeyboard } from "./inline-keyboard-aDe2_Kii.js";
import * as grammy from "grammy";
import { Bot, Bot as Bot$1, GrammyError, HttpError } from "grammy";
import { sequentialize } from "@grammyjs/runner";
import { apiThrottler } from "@grammyjs/transformer-throttler";
//#region extensions/telegram/src/account-throttler.ts
var GroupFairQueue = class {
	constructor() {
		this.lanes = /* @__PURE__ */ new Map();
		this.laneOrder = [];
		this.nextLaneIndex = 0;
		this.running = false;
	}
	enqueue(laneKey, run) {
		return new Promise((resolve, reject) => {
			const request = {
				run,
				resolve,
				reject
			};
			const existing = this.lanes.get(laneKey);
			if (existing) existing.push(request);
			else {
				this.lanes.set(laneKey, [request]);
				this.laneOrder.push(laneKey);
			}
			this.start();
		});
	}
	start() {
		if (this.running) return;
		this.running = true;
		this.drain();
	}
	async drain() {
		try {
			while (true) {
				const request = this.takeNext();
				if (!request) return;
				try {
					request.resolve(await request.run());
				} catch (err) {
					request.reject(err);
				}
			}
		} finally {
			this.running = false;
			if (this.laneOrder.length > 0) this.start();
		}
	}
	takeNext() {
		for (let remaining = this.laneOrder.length; remaining > 0; remaining -= 1) {
			this.nextLaneIndex %= this.laneOrder.length;
			const laneKey = expectDefined(this.laneOrder[this.nextLaneIndex], "non-empty Telegram throttle lane order");
			const queue = this.lanes.get(laneKey);
			if (!queue || queue.length === 0) {
				this.lanes.delete(laneKey);
				this.laneOrder.splice(this.nextLaneIndex, 1);
				if (this.laneOrder.length === 0) {
					this.nextLaneIndex = 0;
					return;
				}
				continue;
			}
			const request = queue.shift();
			this.nextLaneIndex += 1;
			return request;
		}
	}
};
const TELEGRAM_ACCOUNT_THROTTLERS_KEY = Symbol.for("openclaw.telegram.accountThrottlers");
function getAccountThrottlers() {
	const globalRecord = globalThis;
	const existing = globalRecord[TELEGRAM_ACCOUNT_THROTTLERS_KEY];
	if (existing) return existing;
	const created = /* @__PURE__ */ new Map();
	globalRecord[TELEGRAM_ACCOUNT_THROTTLERS_KEY] = created;
	return created;
}
function readNumericId(value) {
	return parseStrictInteger(value);
}
function readPayload(payload) {
	return payload && typeof payload === "object" ? payload : void 0;
}
function resolveGroupChatKey(payload) {
	const chatId = readNumericId(payload.chat_id);
	return chatId !== void 0 && chatId < 0 ? String(chatId) : void 0;
}
function resolveForumLaneKey(payload) {
	const threadId = readNumericId(payload.message_thread_id);
	if (threadId !== void 0) return `topic:${threadId}`;
	const directTopicId = readNumericId(payload.direct_messages_topic_id);
	if (directTopicId !== void 0) return `direct-topic:${directTopicId}`;
	const messageId = readNumericId(payload.message_id);
	if (messageId !== void 0) return `message:${messageId}`;
	return "main";
}
function createTelegramAccountThrottler(createThrottler = apiThrottler) {
	const baseThrottler = createThrottler();
	const fairQueuesByChat = /* @__PURE__ */ new Map();
	return (prev, method, payload, signal) => {
		const apiPayload = readPayload(payload);
		const groupChatKey = apiPayload ? resolveGroupChatKey(apiPayload) : void 0;
		if (!apiPayload || !groupChatKey) return baseThrottler(prev, method, payload, signal);
		let fairQueue = fairQueuesByChat.get(groupChatKey);
		if (!fairQueue) {
			fairQueue = new GroupFairQueue();
			fairQueuesByChat.set(groupChatKey, fairQueue);
		}
		const laneKey = resolveForumLaneKey(apiPayload);
		return fairQueue.enqueue(laneKey, () => baseThrottler(prev, method, payload, signal));
	};
}
function getOrCreateAccountThrottler(token, createThrottler = apiThrottler) {
	const throttlerByToken = getAccountThrottlers();
	let throttler = throttlerByToken.get(token);
	if (!throttler) {
		throttler = createTelegramAccountThrottler(createThrottler);
		throttlerByToken.set(token, throttler);
	}
	return throttler;
}
//#endregion
//#region extensions/telegram/src/api-logging.ts
const fallbackLogger = createSubsystemLogger("telegram/api");
function resolveTelegramApiLogger(runtime, logger) {
	if (logger) return logger;
	if (runtime?.error) return runtime.error;
	return (message) => fallbackLogger.error(message);
}
async function withTelegramApiErrorLogging({ operation, fn, runtime, logger, shouldLog }) {
	try {
		return await fn();
	} catch (err) {
		if (!shouldLog || shouldLog(err)) {
			const errText = formatErrorMessage(err);
			resolveTelegramApiLogger(runtime, logger)(`telegram ${operation} failed: ${errText}`);
		}
		throw err;
	}
}
//#endregion
//#region extensions/telegram/src/caption.ts
const TELEGRAM_MAX_CAPTION_LENGTH = 1024;
function splitTelegramCaption(text) {
	const trimmed = text?.trim() ?? "";
	if (!trimmed) return {
		caption: void 0,
		followUpText: void 0
	};
	if (trimmed.length > TELEGRAM_MAX_CAPTION_LENGTH) return {
		caption: void 0,
		followUpText: trimmed
	};
	return {
		caption: trimmed,
		followUpText: void 0
	};
}
//#endregion
//#region extensions/telegram/src/client-fetch.ts
function asTelegramClientFetch(fetchImpl) {
	return fetchImpl;
}
function asTelegramCompatFetch(fetchImpl) {
	return fetchImpl;
}
function isTelegramAbortSignalLike(value) {
	return typeof value === "object" && value !== null && "aborted" in value && typeof value.aborted === "boolean" && typeof value.addEventListener === "function" && typeof value.removeEventListener === "function";
}
function readRequestUrl(input) {
	if (typeof input === "string") return input;
	if (input instanceof URL) return input.toString();
	if (input instanceof Request) return input.url;
	return null;
}
function extractTelegramApiMethod(input) {
	const url = readRequestUrl(input);
	if (!url) return null;
	try {
		const segments = new URL(url).pathname.split("/").filter(Boolean);
		return normalizeOptionalLowercaseString(segments.length > 0 ? segments.at(-1) ?? null : null) ?? null;
	} catch {
		return null;
	}
}
const TELEGRAM_TIMEOUT_FALLBACK_METHODS = /* @__PURE__ */ new Set([
	"deletemycommands",
	"deletewebhook",
	"getme",
	"sendchataction",
	"setmycommands",
	"setwebhook"
]);
function shouldRetryTimedOutTelegramControlRequest(method) {
	return method !== null && TELEGRAM_TIMEOUT_FALLBACK_METHODS.has(method);
}
function resolveTelegramClientTimeoutSeconds(params) {
	const { value, minimum } = params;
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	const configured = Math.max(1, Math.floor(value));
	if (typeof minimum !== "number" || !Number.isFinite(minimum)) return configured;
	return Math.max(configured, Math.max(1, Math.floor(minimum)));
}
function resolveTelegramClientTimeoutMinimumSeconds(values) {
	let minimum;
	for (const value of values) {
		if (typeof value !== "number" || !Number.isFinite(value)) continue;
		const normalized = Math.max(1, Math.ceil(value));
		minimum = minimum === void 0 ? normalized : Math.max(minimum, normalized);
	}
	return minimum;
}
function resolveTelegramOutboundClientTimeoutFloorSeconds(timeoutSeconds) {
	const timeoutMs = resolveTelegramRequestTimeoutMs("sendmessage", timeoutSeconds);
	return timeoutMs === void 0 ? void 0 : timeoutMs / 1e3;
}
function createTelegramClientFetch(params) {
	if (!params.fetchImpl && !params.shutdownSignal) return;
	const callFetch = asTelegramCompatFetch(params.fetchImpl ?? asTelegramClientFetch(globalThis.fetch));
	const wrappedFetch = async (input, init) => {
		const method = extractTelegramApiMethod(input);
		const requestTimeoutMs = resolveTelegramRequestTimeoutMs(method, params.timeoutSeconds);
		const shutdownSignal = isTelegramAbortSignalLike(params.shutdownSignal) ? params.shutdownSignal : void 0;
		const requestSignal = isTelegramAbortSignalLike(init?.signal) ? init.signal : void 0;
		const canForceTransportFallback = (reason) => !shutdownSignal?.aborted && !requestSignal?.aborted && params.transport?.forceFallback?.(reason) === true;
		const runFetch = async () => {
			const controller = new AbortController();
			const abortWith = (signal) => controller.abort(signal.reason);
			const onShutdown = () => {
				if (shutdownSignal) abortWith(shutdownSignal);
			};
			let requestTimeout;
			let onRequestAbort;
			let requestTimedOut = false;
			const timeoutError = requestTimeoutMs !== void 0 ? /* @__PURE__ */ new Error(`Telegram ${method} timed out after ${requestTimeoutMs}ms`) : void 0;
			if (shutdownSignal?.aborted) abortWith(shutdownSignal);
			else if (shutdownSignal) shutdownSignal.addEventListener("abort", onShutdown, { once: true });
			if (requestSignal) if (requestSignal.aborted) abortWith(requestSignal);
			else {
				onRequestAbort = () => abortWith(requestSignal);
				requestSignal.addEventListener("abort", onRequestAbort);
			}
			if (requestTimeoutMs && timeoutError) {
				requestTimeout = setTimeout(() => {
					requestTimedOut = true;
					controller.abort(timeoutError);
				}, requestTimeoutMs);
				requestTimeout.unref?.();
			}
			try {
				return await callFetch(input, {
					...init,
					signal: controller.signal
				});
			} catch (err) {
				if (requestTimedOut && timeoutError) throw timeoutError;
				throw err;
			} finally {
				if (requestTimeout) clearTimeout(requestTimeout);
				shutdownSignal?.removeEventListener("abort", onShutdown);
				if (requestSignal && onRequestAbort) requestSignal.removeEventListener("abort", onRequestAbort);
			}
		};
		try {
			const response = await runFetch();
			if (response.status === 421 && canForceTransportFallback("misdirected-request")) return await runFetch();
			return response;
		} catch (err) {
			if (requestTimeoutMs && shouldRetryTimedOutTelegramControlRequest(method) && canForceTransportFallback("request-timeout")) return await runFetch();
			if (isTelegramMisdirectedRequestError(err) && canForceTransportFallback("misdirected-request")) return await runFetch();
			throw err;
		}
	};
	return (input, init) => {
		return Promise.resolve(wrappedFetch(input, init)).catch((err) => {
			try {
				tagTelegramNetworkError(err, {
					method: extractTelegramApiMethod(input),
					url: readRequestUrl(input)
				});
			} catch {}
			throw err;
		});
	};
}
//#endregion
//#region extensions/telegram/src/group-history-window.ts
const TELEGRAM_SELF_SENDER_SUFFIX = " (you)";
function buildTelegramSelfSenderName(configuredName, telegramIdentity) {
	return `${configuredName?.trim() || telegramIdentity?.first_name?.trim() || telegramIdentity?.username?.trim() || "OpenClaw"}${TELEGRAM_SELF_SENDER_SUFFIX}`;
}
function isTelegramSelfSenderName(name) {
	return name?.endsWith(TELEGRAM_SELF_SENDER_SUFFIX) === true;
}
function isTelegramGroupHistorySelfEntry(entry) {
	return isTelegramSelfSenderName(entry.sender);
}
function telegramPromptMessageKey(message) {
	const messageId = message["message_id"];
	const body = message["body"];
	const timestampMs = message["timestamp_ms"];
	if (typeof messageId === "string" && messageId.trim()) return `id:${messageId.trim()}`;
	if (typeof body === "string" && typeof timestampMs === "number") return `text:${timestampMs}:${body.trim()}`;
}
function telegramHistoryEntryKey(entry) {
	if (entry.messageId?.trim()) return `id:${entry.messageId.trim()}`;
	if (entry.timestamp !== void 0) return `text:${entry.timestamp}:${entry.body.trim()}`;
}
function numericMessageId(value) {
	if (!value?.trim()) return;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function isTelegramHistoryEntryAfterAmbientWatermark(entry, watermark) {
	if (!watermark) return true;
	if (entry.timestamp !== void 0 && watermark.timestampMs !== void 0) {
		if (entry.timestamp !== watermark.timestampMs) return entry.timestamp > watermark.timestampMs;
		const entryMessageId = numericMessageId(entry.messageId);
		const watermarkMessageId = numericMessageId(watermark.messageId);
		return entryMessageId !== void 0 && watermarkMessageId !== void 0 && entryMessageId > watermarkMessageId;
	}
	const entryMessageId = numericMessageId(entry.messageId);
	const watermarkMessageId = numericMessageId(watermark.messageId);
	if (entryMessageId !== void 0 && watermarkMessageId !== void 0) return entryMessageId > watermarkMessageId;
	return entry.messageId !== watermark.messageId;
}
function telegramChatWindowPayload(entry) {
	return entry?.payload && typeof entry.payload === "object" && !Array.isArray(entry.payload) ? entry.payload : void 0;
}
function telegramPromptMessages(payload) {
	return Array.isArray(payload?.["messages"]) ? payload["messages"].filter((message) => Boolean(message) && typeof message === "object" && !Array.isArray(message)) : [];
}
function selectTelegramGroupHistoryAfterLastSelf(entries) {
	const lastSelfIndex = entries.findLastIndex(isTelegramGroupHistorySelfEntry);
	return lastSelfIndex === -1 ? [...entries] : entries.slice(lastSelfIndex + 1);
}
function isTelegramChatWindowPromptContext(entry) {
	return entry.source === "telegram" && entry.type === "chat_window";
}
function retainTelegramGroupHistoryPromptContext(params) {
	const entryKeys = new Set(params.entries.flatMap((entry) => {
		const key = telegramHistoryEntryKey(entry);
		return key ? [key] : [];
	}));
	return params.promptContext.flatMap((entry) => {
		if (!isTelegramChatWindowPromptContext(entry)) return [entry];
		if (entryKeys.size === 0) return [];
		const payload = telegramChatWindowPayload(entry);
		const messages = telegramPromptMessages(payload).filter((message) => {
			const key = telegramPromptMessageKey(message);
			return Boolean(key && entryKeys.has(key));
		});
		if (messages.length === 0) return [];
		return [{
			...entry,
			payload: {
				...payload,
				messages
			}
		}];
	});
}
function mergeTelegramGroupHistoryPromptContext(params) {
	if (params.entries.length === 0) return params.promptContext;
	const historyMessages = params.entries.map((entry) => ({
		...entry.messageId ? { message_id: entry.messageId } : {},
		sender: entry.sender,
		...entry.timestamp !== void 0 ? { timestamp_ms: entry.timestamp } : {},
		body: entry.body
	}));
	const chatWindowIndex = params.promptContext.findIndex(isTelegramChatWindowPromptContext);
	const baseEntry = params.promptContext[chatWindowIndex];
	const existingMessages = telegramPromptMessages(telegramChatWindowPayload(baseEntry));
	const messagesByKey = /* @__PURE__ */ new Map();
	for (const message of [...historyMessages, ...existingMessages]) {
		const key = telegramPromptMessageKey(message);
		if (key) messagesByKey.set(key, message);
	}
	const mergedMessages = [...messagesByKey.values()].toSorted((left, right) => {
		return (typeof left["timestamp_ms"] === "number" ? left["timestamp_ms"] : 0) - (typeof right["timestamp_ms"] === "number" ? right["timestamp_ms"] : 0);
	});
	const mergedEntry = {
		label: "Conversation context",
		source: baseEntry?.source ?? "telegram",
		type: "chat_window",
		payload: {
			order: "chronological",
			relation: "selected_for_current_message",
			messages: mergedMessages
		}
	};
	if (!baseEntry) return [...params.promptContext, mergedEntry];
	return params.promptContext.map((entry, index) => index === chatWindowIndex ? mergedEntry : entry);
}
function recordTelegramGroupHistoryEntry(params) {
	if (!params.historyKey) return;
	createChannelHistoryWindow({ historyMap: params.historyMap }).record({
		historyKey: params.historyKey,
		limit: params.limit,
		entry: params.entry
	});
}
//#endregion
//#region extensions/telegram/src/outbound-message-context.ts
const outboundGroupHistoryRecorders = /* @__PURE__ */ new Map();
function registerTelegramOutboundGroupHistoryRecorder(params) {
	outboundGroupHistoryRecorders.set(params.accountId, params.recorder);
	return () => {
		if (outboundGroupHistoryRecorders.get(params.accountId) === params.recorder) outboundGroupHistoryRecorders.delete(params.accountId);
	};
}
function resolveOutboundCacheMessageTimestamp(msg) {
	if (typeof msg.openclaw_prompt_context_timestamp_ms === "number" && Number.isFinite(msg.openclaw_prompt_context_timestamp_ms)) return msg.openclaw_prompt_context_timestamp_ms;
	return typeof msg.date === "number" && Number.isFinite(msg.date) ? msg.date * 1e3 : void 0;
}
function inferTelegramChatType(chatId) {
	return String(chatId).startsWith("-") ? "supergroup" : "private";
}
function buildOutboundCacheMessage(params) {
	const chat = params.message.chat ?? {};
	const text = params.message.text ?? params.message.caption ?? params.text;
	const rawSender = params.message.from;
	const stableSender = params.message.sender_chat ? void 0 : rawSender;
	const selfSenderName = buildTelegramSelfSenderName(params.account.name, params.account.bot ?? stableSender);
	return {
		...params.message,
		message_id: params.messageId,
		...params.promptContextTimestampMs !== void 0 ? { openclaw_prompt_context_timestamp_ms: params.promptContextTimestampMs } : {},
		date: typeof params.message.date === "number" && Number.isFinite(params.message.date) ? params.message.date : Math.floor(Date.now() / 1e3),
		chat: {
			id: chat.id ?? params.chatId,
			type: chat.type ?? inferTelegramChatType(params.chatId),
			...chat.title ? { title: chat.title } : {},
			...chat.username ? { username: chat.username } : {}
		},
		from: {
			id: params.message.sender_chat ? 0 : stableSender?.id ?? params.botUserId ?? 0,
			is_bot: true,
			first_name: selfSenderName,
			...stableSender?.username ? { username: stableSender.username } : {}
		},
		...text ? { text } : {},
		...params.messageThreadId !== void 0 ? { message_thread_id: params.messageThreadId } : {}
	};
}
async function recordOutboundMessageForPromptContext(params) {
	try {
		const cacheMessage = buildOutboundCacheMessage(params);
		await createTelegramMessageCache({ scope: resolveTelegramMessageCacheScope(resolveStorePath(params.cfg.session?.store)) }).record({
			accountId: params.account.accountId,
			chatId: params.chatId,
			msg: cacheMessage,
			...params.botUserId !== void 0 ? { botUserId: params.botUserId } : {},
			...params.promptContextProjection ? { promptContextProjection: params.promptContextProjection } : {},
			...params.messageThreadId !== void 0 ? { threadId: params.messageThreadId } : {}
		});
		const timestamp = resolveOutboundCacheMessageTimestamp(cacheMessage);
		outboundGroupHistoryRecorders.get(params.account.accountId)?.({
			chatId: params.chatId,
			messageId: params.messageId,
			text: params.text ?? cacheMessage.text ?? cacheMessage.caption,
			...params.messageThreadId !== void 0 ? { messageThreadId: params.messageThreadId } : {},
			...timestamp !== void 0 ? { timestamp } : {}
		});
		return true;
	} catch (error) {
		logVerbose(`telegram: failed to record outbound message context: ${String(error)}`);
		return false;
	}
}
//#endregion
//#region extensions/telegram/src/reply-parameters.ts
const QUOTE_PARAM_RE = /\bquote not found\b|\bQUOTE_TEXT_INVALID\b|\bquote text invalid\b/i;
const GrammyErrorCtor = typeof GrammyError === "function" ? GrammyError : void 0;
function resolveTelegramSendThreadSpec(params) {
	const messageThreadId = params.messageThreadId != null ? params.messageThreadId : params.targetMessageThreadId;
	if (messageThreadId == null) return;
	return {
		id: messageThreadId,
		scope: params.chatType === "direct" ? "dm" : "forum"
	};
}
function buildTelegramThreadReplyParams(opts) {
	const params = {};
	const threadParams = buildTelegramThreadParams(opts?.thread);
	if (threadParams) params.message_thread_id = threadParams.message_thread_id;
	const replyToMessageId = normalizeTelegramReplyToMessageId(opts?.replyToMessageId);
	if (replyToMessageId == null) return params;
	const defaultQuoteMessageId = opts?.useReplyIdAsQuoteSource === true ? replyToMessageId : void 0;
	const replyQuoteTextRaw = normalizeTelegramReplyToMessageId(opts?.replyQuoteMessageId ?? defaultQuoteMessageId) === replyToMessageId ? opts?.replyQuoteText : void 0;
	const replyQuoteText = replyQuoteTextRaw?.trim() ? replyQuoteTextRaw : void 0;
	if (!replyQuoteText) {
		params.reply_to_message_id = replyToMessageId;
		params.allow_sending_without_reply = true;
		return params;
	}
	const replyParameters = {
		message_id: replyToMessageId,
		quote: replyQuoteText,
		allow_sending_without_reply: true
	};
	if (typeof opts?.replyQuotePosition === "number" && Number.isFinite(opts.replyQuotePosition)) replyParameters.quote_position = Math.trunc(opts.replyQuotePosition);
	if (Array.isArray(opts?.replyQuoteEntities) && opts.replyQuoteEntities.length > 0) replyParameters.quote_entities = opts.replyQuoteEntities;
	params.reply_parameters = replyParameters;
	return params;
}
function buildTelegramSendParams(opts) {
	const params = { ...buildTelegramThreadReplyParams(opts) };
	if (opts?.silent === true) params.disable_notification = true;
	return params;
}
function getTelegramNativeQuoteReplyMessageId(params) {
	const replyParameters = params?.reply_parameters;
	if (!replyParameters || typeof replyParameters !== "object") return;
	const messageId = replyParameters.message_id;
	return typeof messageId === "number" && Number.isFinite(messageId) ? messageId : void 0;
}
function isTelegramQuoteParamError(err) {
	if (GrammyErrorCtor && err instanceof GrammyErrorCtor) return QUOTE_PARAM_RE.test(err.description);
	return QUOTE_PARAM_RE.test(formatErrorMessage(err));
}
function removeTelegramNativeQuoteParam(params) {
	if (!params) return {};
	const replyMessageId = getTelegramNativeQuoteReplyMessageId(params);
	const { reply_parameters: _ignored, ...rest } = params;
	if (replyMessageId != null) {
		rest.reply_to_message_id = replyMessageId;
		rest.allow_sending_without_reply = true;
	}
	return rest;
}
//#endregion
//#region extensions/telegram/src/retry-after.ts
const TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS = 6e4;
//#endregion
//#region extensions/telegram/src/rich-block-model.ts
function normalizeRichText(value) {
	if (typeof value === "string") return value;
	if (Array.isArray(value)) {
		const flattened = [];
		for (const item of value) {
			const normalized = normalizeRichText(item);
			if (normalized === "") continue;
			if (Array.isArray(normalized)) flattened.push(...normalized);
			else flattened.push(normalized);
		}
		if (flattened.length === 0) return "";
		if (flattened.length === 1) return flattened[0] ?? "";
		return flattened;
	}
	if (value.type === "mathematical_expression" || value.type === "custom_emoji") return value;
	return {
		...value,
		text: normalizeRichText(value.text)
	};
}
function countRichTextChars(text) {
	if (typeof text === "string") return text.length;
	if (Array.isArray(text)) return text.reduce((total, part) => total + countRichTextChars(part), 0);
	if (text.type === "mathematical_expression") return text.expression.length;
	if (text.type === "custom_emoji") return text.alternative_text.length;
	return countRichTextChars(text.text);
}
function countCaptionChars(caption) {
	if (!caption) return 0;
	return countRichTextChars(caption.text) + countRichTextChars(caption.credit ?? "");
}
function countInputRichBlockChars(block) {
	switch (block.type) {
		case "paragraph":
		case "heading":
		case "footer": return countRichTextChars(block.text);
		case "pre": return block.text.length;
		case "mathematical_expression": return block.expression.length;
		case "pullquote": return countRichTextChars(block.text) + countRichTextChars(block.credit ?? "");
		case "blockquote": return block.blocks.reduce((total, item) => total + countInputRichBlockChars(item), 0) + countRichTextChars(block.credit ?? "");
		case "collage":
		case "slideshow": return block.blocks.reduce((total, item) => total + countInputRichBlockChars(item), 0) + countCaptionChars(block.caption);
		case "details": return countRichTextChars(block.summary) + block.blocks.reduce((total, item) => total + countInputRichBlockChars(item), 0);
		case "list": return block.items.reduce((total, item) => total + item.blocks.reduce((inner, child) => inner + countInputRichBlockChars(child), 0), 0);
		case "table": return countRichTextChars(block.caption ?? "") + block.cells.reduce((rowTotal, row) => rowTotal + row.reduce((cellTotal, cell) => cellTotal + countRichTextChars(cell.text ?? ""), 0), 0);
		case "photo":
		case "video":
		case "audio":
		case "animation":
		case "voice_note":
		case "map": return countCaptionChars(block.caption);
		default: return 0;
	}
}
/** Media elements per block, for the wire's 50-media message cap. */
function countInputRichBlockMedia(block) {
	switch (block.type) {
		case "photo":
		case "video":
		case "audio":
		case "animation":
		case "voice_note": return 1;
		case "collage":
		case "slideshow":
		case "blockquote":
		case "details": return block.blocks.reduce((total, item) => total + countInputRichBlockMedia(item), 0);
		case "list": return block.items.reduce((total, item) => total + item.blocks.reduce((inner, child) => inner + countInputRichBlockMedia(child), 0), 0);
		default: return 0;
	}
}
function richTextToPlainString(text) {
	if (typeof text === "string") return text;
	if (Array.isArray(text)) return text.map(richTextToPlainString).join("");
	if (text.type === "mathematical_expression") return text.expression;
	if (text.type === "custom_emoji") return text.alternative_text;
	return richTextToPlainString(text.text);
}
function captionToPlainText(caption) {
	if (!caption) return "";
	const credit = caption.credit ? ` — ${richTextToPlainString(caption.credit)}` : "";
	return `${richTextToPlainString(caption.text)}${credit}`.trim();
}
function inputRichBlocksToPlainText(blocks) {
	const parts = [];
	const push = (value) => {
		if (value) parts.push(value);
	};
	for (const block of blocks) switch (block.type) {
		case "paragraph":
		case "heading":
		case "footer":
			push(richTextToPlainString(block.text));
			break;
		case "pre":
			push(block.text);
			break;
		case "mathematical_expression":
			push(block.expression);
			break;
		case "pullquote":
			push(block.credit ? `${richTextToPlainString(block.text)} — ${richTextToPlainString(block.credit)}` : richTextToPlainString(block.text));
			break;
		case "blockquote":
			push(inputRichBlocksToPlainText(block.blocks));
			if (block.credit) push(`— ${richTextToPlainString(block.credit)}`);
			break;
		case "collage":
		case "slideshow":
			push(inputRichBlocksToPlainText(block.blocks));
			push(captionToPlainText(block.caption));
			break;
		case "details":
			push(richTextToPlainString(block.summary));
			push(inputRichBlocksToPlainText(block.blocks));
			break;
		case "list":
			for (const item of block.items) push(`${item.has_checkbox ? item.is_checked ? "[x] " : "[ ] " : item.value !== void 0 ? `${item.value}. ` : "• "}${inputRichBlocksToPlainText(item.blocks)}`);
			break;
		case "table":
			if (block.caption !== void 0) push(richTextToPlainString(block.caption));
			for (const row of block.cells) push(row.map((cell) => richTextToPlainString(cell.text ?? "")).join(" | "));
			break;
		case "photo":
			push(`${captionToPlainText(block.caption)} ${block.photo.media}`.trim());
			break;
		case "video":
			push(`${captionToPlainText(block.caption)} ${block.video.media}`.trim());
			break;
		case "audio":
			push(`${captionToPlainText(block.caption)} ${block.audio.media}`.trim());
			break;
		case "animation":
			push(`${captionToPlainText(block.caption)} ${block.animation.media}`.trim());
			break;
		case "voice_note":
			push(`${captionToPlainText(block.caption)} ${block.voice_note.media}`.trim());
			break;
		case "map":
			push(`${captionToPlainText(block.caption)} ${block.location.latitude},${block.location.longitude}`.trim());
			break;
		case "divider":
		case "anchor": break;
	}
	return parts.join("\n");
}
function boldRichText(text) {
	return {
		type: "bold",
		text
	};
}
function codeRichText(text) {
	return {
		type: "code",
		text
	};
}
function italicRichText(text) {
	return {
		type: "italic",
		text
	};
}
function paragraphBlock(text) {
	return {
		type: "paragraph",
		text
	};
}
//#endregion
//#region extensions/telegram/src/rich-plain-fallback.ts
const RICH_ENTITY_INVALID_RE = /RICH_MESSAGE_[A-Z_]+_INVALID/i;
const RICH_CONTENT_REQUIRED_RE = /RICH_MESSAGE_CONTENT_REQUIRED/i;
const RICH_STRUCTURE_INVALID_RE = /RICH_MESSAGE_(?:BLOCKS_TOO_MANY|DEPTH_INVALID|TEXT_TOO_LONG|MEDIA_TOO_MANY|TABLE_COLS_TOO_MANY)/i;
const PARSE_ERR_RE = /can't parse entities|parse entities|find end of the entity|can't parse InputRichBlock/i;
function isTelegramRichEntityInvalidError(err) {
	return RICH_ENTITY_INVALID_RE.test(formatErrorMessage(err));
}
function isTelegramHtmlParseError(err) {
	return PARSE_ERR_RE.test(formatErrorMessage(err));
}
function getTelegramPlainFallbackTrigger(err) {
	if (isTelegramRichEntityInvalidError(err)) return "rich-entity-invalid";
	if (RICH_CONTENT_REQUIRED_RE.test(formatErrorMessage(err))) return "rich-content-required";
	if (RICH_STRUCTURE_INVALID_RE.test(formatErrorMessage(err))) return "rich-structure-invalid";
	if (isTelegramHtmlParseError(err)) return "html-parse";
}
function surrogateSafeChunkEnd(text, end, start) {
	const high = text.charCodeAt(end - 1);
	const low = text.charCodeAt(end);
	if (!(end > 0 && high >= 55296 && high <= 56319 && low >= 56320 && low <= 57343)) return end;
	const clamped = end - 1;
	return clamped > start ? clamped : start + 2;
}
function splitTelegramPlainTextChunks(text, limit) {
	if (!text) return [];
	const normalizedLimit = Math.max(1, Math.floor(limit));
	const chunks = [];
	let start = 0;
	while (start < text.length) {
		const end = surrogateSafeChunkEnd(text, start + normalizedLimit, start);
		chunks.push(text.slice(start, end));
		start = end;
	}
	return chunks;
}
function splitTelegramPlainTextFallback(text, chunkCount, limit) {
	if (!text) return [];
	const normalizedLimit = Math.max(1, Math.floor(limit));
	const fixedChunks = splitTelegramPlainTextChunks(text, normalizedLimit);
	if (chunkCount <= 1 || fixedChunks.length >= chunkCount) return fixedChunks;
	const chunks = [];
	let offset = 0;
	for (let index = 0; index < chunkCount; index += 1) {
		const remainingChars = text.length - offset;
		const remainingChunks = chunkCount - index;
		const nextChunkLength = remainingChunks === 1 ? remainingChars : Math.min(normalizedLimit, Math.ceil(remainingChars / remainingChunks));
		const end = surrogateSafeChunkEnd(text, offset + nextChunkLength, offset);
		chunks.push(text.slice(offset, end));
		offset = end;
	}
	return chunks;
}
function buildTelegramPlainFallbackPlan(params) {
	const trigger = getTelegramPlainFallbackTrigger(params.err);
	if (!trigger) return;
	const plainText = params.plainText;
	const limit = params.limit ?? 4e3;
	const chunks = params.chunkCount === void 0 ? splitTelegramPlainTextChunks(plainText, limit) : splitTelegramPlainTextFallback(plainText, params.chunkCount, limit);
	params.warn(`telegram ${params.context} rich-degrade=plain-fallback:${trigger}: ${formatErrorMessage(params.err)}`);
	return {
		plainText,
		chunks
	};
}
function warnTelegramRichBlocksDegradations(params) {
	for (const reason of new Set(params.reasons)) params.warn(`telegram ${params.context} rich-degrade=${reason}`);
}
//#endregion
//#region extensions/telegram/src/rich-block-split.ts
function wrapRichTextFragment(fragment, wrappers) {
	let node = fragment;
	for (let index = wrappers.length - 1; index >= 0; index -= 1) {
		const wrapper = wrappers[index];
		if (!wrapper) continue;
		node = wrapper.type === "url" ? {
			type: "url",
			text: node,
			url: wrapper.url
		} : wrapper.type === "anchor_link" ? {
			type: "anchor_link",
			text: node,
			anchor_name: wrapper.anchor_name
		} : {
			type: wrapper.type,
			text: node
		};
	}
	return node;
}
function splitRichTextByChars(text, limit) {
	const pieces = [];
	let current = [];
	let chars = 0;
	const flush = () => {
		if (current.length > 0) {
			pieces.push(normalizeRichText(current));
			current = [];
			chars = 0;
		}
	};
	const visit = (node, wrappers) => {
		if (typeof node === "string") {
			let offset = 0;
			while (offset < node.length) {
				if (chars >= limit) flush();
				const budget = limit - chars;
				const end = surrogateSafeChunkEnd(node, Math.min(node.length, offset + budget), offset);
				const fragment = node.slice(offset, end);
				current.push(wrapRichTextFragment(fragment, wrappers));
				chars += fragment.length;
				offset = end;
			}
			return;
		}
		if (Array.isArray(node)) {
			for (const child of node) visit(child, wrappers);
			return;
		}
		if (node.type === "mathematical_expression" || node.type === "custom_emoji") {
			const atomicChars = countRichTextChars(node);
			if (chars > 0 && chars + atomicChars > limit) flush();
			current.push(wrapRichTextFragment(node, wrappers));
			chars += atomicChars;
			return;
		}
		const wrapper = node.type === "url" ? {
			type: "url",
			url: node.url
		} : node.type === "anchor_link" ? {
			type: "anchor_link",
			anchor_name: node.anchor_name
		} : { type: node.type };
		visit(node.text, [...wrappers, wrapper]);
	};
	visit(text, []);
	flush();
	return pieces;
}
function splitOversizedRichBlock(block, textLimit) {
	if (countInputRichBlockChars(block) <= textLimit) return [block];
	if (block.type === "pre") {
		const language = block.language;
		return splitTelegramPlainTextChunks(block.text, textLimit).map((piece) => language ? {
			type: "pre",
			text: piece,
			language
		} : {
			type: "pre",
			text: piece
		});
	}
	if (block.type === "paragraph" || block.type === "heading") return splitRichTextByChars(block.text, textLimit).map((piece) => block.type === "heading" ? {
		type: "heading",
		text: piece,
		size: block.size
	} : {
		type: "paragraph",
		text: piece
	});
	if (block.type === "blockquote") {
		const creditChars = countRichTextChars(block.credit ?? "");
		const innerLimit = Math.max(1, textLimit - creditChars);
		const pieces = splitTelegramRichBlocks(block.blocks, { textLimit: innerLimit });
		return pieces.map((inner, index) => index === pieces.length - 1 && block.credit !== void 0 ? {
			type: "blockquote",
			blocks: inner,
			credit: block.credit
		} : {
			type: "blockquote",
			blocks: inner
		});
	}
	if (block.type === "table") {
		if (block.cells.some((row) => row.some((cell) => (cell.rowspan ?? 1) > 1))) return [block];
		const { caption, ...tableRest } = block;
		const pieces = [];
		const pushPiece = (pieceRows) => {
			pieces.push(pieces.length === 0 && caption !== void 0 ? {
				...tableRest,
				cells: pieceRows,
				caption
			} : {
				...tableRest,
				cells: pieceRows
			});
		};
		let rows = [];
		let chars = countRichTextChars(caption ?? "");
		for (const row of block.cells) {
			const rowChars = row.reduce((total, cell) => total + countRichTextChars(cell.text ?? ""), 0);
			if (rows.length > 0 && chars + rowChars > textLimit) {
				pushPiece(rows);
				rows = [];
				chars = 0;
			}
			rows.push(row);
			chars += rowChars;
		}
		if (rows.length > 0) pushPiece(rows);
		return pieces;
	}
	if (block.type === "list") {
		const pieces = [];
		let items = [];
		let chars = 0;
		for (const item of block.items) {
			const itemChars = item.blocks.reduce((total, child) => total + countInputRichBlockChars(child), 0);
			if (items.length > 0 && chars + itemChars > textLimit) {
				pieces.push({
					type: "list",
					items
				});
				items = [];
				chars = 0;
			}
			items.push(item);
			chars += itemChars;
		}
		if (items.length > 0) pieces.push({
			type: "list",
			items
		});
		return pieces;
	}
	return [block];
}
function splitTelegramRichBlocks(blocks, options = {}) {
	const blockLimit = Math.max(1, Math.floor(options.blockLimit ?? 500));
	const textLimit = Math.max(1, Math.floor(options.textLimit ?? 32768));
	if (blocks.length === 0) return [];
	const expanded = blocks.flatMap((block) => splitOversizedRichBlock(block, textLimit));
	const chunks = [];
	let current = [];
	let currentChars = 0;
	const mediaLimit = 50;
	let currentMedia = 0;
	const flush = () => {
		if (current.length > 0) {
			chunks.push(current);
			current = [];
			currentChars = 0;
			currentMedia = 0;
		}
	};
	for (const block of expanded) {
		const chars = countInputRichBlockChars(block);
		const media = countInputRichBlockMedia(block);
		const wouldExceedBlocks = current.length >= blockLimit;
		const wouldExceedChars = current.length > 0 && currentChars + chars > textLimit;
		const wouldExceedMedia = current.length > 0 && currentMedia + media > mediaLimit;
		if (wouldExceedBlocks || wouldExceedChars || wouldExceedMedia) flush();
		current.push(block);
		currentChars += chars;
		currentMedia += media;
	}
	flush();
	return chunks;
}
//#endregion
//#region extensions/telegram/src/rich-blocks-html.ts
const VOID_TAGS = /* @__PURE__ */ new Set([
	"br",
	"hr",
	"img",
	"input",
	"tg-map"
]);
const INLINE_STYLE_TAGS = {
	b: "bold",
	strong: "bold",
	i: "italic",
	em: "italic",
	u: "underline",
	ins: "underline",
	s: "strikethrough",
	del: "strikethrough",
	strike: "strikethrough",
	code: "code",
	"tg-spoiler": "spoiler",
	mark: "marked",
	sub: "subscript",
	sup: "superscript"
};
const HTML_ATTR_RE = /([a-zA-Z][a-zA-Z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
function parseHtmlAttrs(raw) {
	const attrs = /* @__PURE__ */ new Map();
	const inner = raw.replace(/^<\/?[a-zA-Z][a-zA-Z0-9-]*/, "").replace(/\/?>$/, "");
	for (const match of inner.matchAll(HTML_ATTR_RE)) {
		const name = match[1]?.toLowerCase();
		if (name) attrs.set(name, decodeTelegramHtmlEntities(match[2] ?? match[3] ?? match[4] ?? ""));
	}
	return attrs;
}
/** Parse an HTML fragment into a light node tree; unmatched tags stay text. */
function parseHtmlFragment(text) {
	const root = [];
	const stack = [];
	const childrenOf = () => stack.length > 0 ? stack[stack.length - 1].node.children : root;
	let cursor = 0;
	const pushText = (from, to) => {
		if (to > from) childrenOf().push({
			kind: "text",
			text: text.slice(from, to)
		});
	};
	for (const tag of tokenizeHtmlTags(text)) {
		pushText(cursor, tag.start);
		cursor = tag.end;
		if (tag.closing) {
			const openIndex = stack.findLastIndex((entry) => entry.name === tag.name);
			if (openIndex >= 0) {
				for (let depth = openIndex; depth < stack.length; depth += 1) stack[depth].node.closed = depth === openIndex;
				stack.length = openIndex;
			} else childrenOf().push({
				kind: "text",
				text: tag.raw
			});
			continue;
		}
		const selfContained = tag.selfClosing || VOID_TAGS.has(tag.name);
		const element = {
			kind: "element",
			name: tag.name,
			raw: tag.raw,
			children: [],
			closed: selfContained
		};
		childrenOf().push(element);
		if (!selfContained) stack.push({
			name: tag.name,
			node: element
		});
	}
	pushText(cursor, text.length);
	return unwrapUnclosed(root);
}
function unwrapUnclosed(nodes) {
	const result = [];
	for (const node of nodes) {
		if (node.kind === "text") {
			result.push(node);
			continue;
		}
		const children = unwrapUnclosed(node.children);
		if (node.closed) result.push({
			...node,
			children
		});
		else result.push({
			kind: "text",
			text: node.raw
		}, ...children);
	}
	return result;
}
function nodeText(nodes) {
	return nodes.map((node) => node.kind === "text" ? decodeTelegramHtmlEntities(node.text) : nodeText(node.children)).join("");
}
function normalizeIslandText(text) {
	return text.replace(/\s+/g, " ").trim();
}
function serializeHtmlNodes(nodes) {
	return nodes.map((node) => {
		if (node.kind === "text") return node.text;
		return VOID_TAGS.has(node.name) || node.raw.trimEnd().endsWith("/>") ? node.raw : `${node.raw}${serializeHtmlNodes(node.children)}</${node.name}>`;
	}).join("");
}
/** Convert island children into RichText, honoring documented inline tags. */
function htmlNodesToRichText(nodes) {
	const parts = [];
	for (const node of nodes) {
		if (node.kind === "text") {
			const value = decodeTelegramHtmlEntities(node.text.replace(/\s+/g, " "));
			if (value) parts.push(value);
			continue;
		}
		const style = INLINE_STYLE_TAGS[node.name];
		if (style) {
			parts.push({
				type: style,
				text: htmlNodesToRichText(node.children)
			});
			continue;
		}
		if (node.name === "a") {
			const href = parseHtmlAttrs(node.raw).get("href");
			const inner = htmlNodesToRichText(node.children);
			if (href?.startsWith("#")) parts.push({
				type: "anchor_link",
				text: inner,
				anchor_name: href.slice(1)
			});
			else parts.push(href ? {
				type: "url",
				text: inner,
				url: href
			} : inner);
			continue;
		}
		if (node.name === "tg-math") {
			parts.push({
				type: "mathematical_expression",
				expression: nodeText(node.children)
			});
			continue;
		}
		if (node.name === "tg-emoji") {
			const emojiId = parseHtmlAttrs(node.raw).get("emoji-id");
			const alternative = normalizeIslandText(nodeText(node.children));
			if (emojiId && /^\d+$/.test(emojiId) && alternative) {
				parts.push({
					type: "custom_emoji",
					custom_emoji_id: emojiId,
					alternative_text: alternative
				});
				continue;
			}
			parts.push(alternative);
			continue;
		}
		if (node.name === "br") {
			parts.push("\n");
			continue;
		}
		if (node.name === "p" || node.name === "span" || node.name === "div") {
			parts.push(htmlNodesToRichText(node.children));
			continue;
		}
		const selfContained = VOID_TAGS.has(node.name) || node.raw.trimEnd().endsWith("/>");
		parts.push(node.raw, serializeHtmlNodes(node.children));
		if (!selfContained) parts.push(`</${node.name}>`);
	}
	if (parts.length === 0) return "";
	if (parts.length === 1) return parts[0] ?? "";
	return parts;
}
/** Parse inline islands (<sup>, <tg-math>, <tg-emoji>, …) out of a text leaf. */
function parseInlineHtmlIslands(leaf) {
	if (!leaf.includes("<")) return leaf;
	const nodes = parseHtmlFragment(leaf);
	if (!nodes.some((node) => node.kind === "element")) return leaf;
	return htmlNodesToRichText(nodes);
}
//#endregion
//#region extensions/telegram/src/rich-blocks-html-map.ts
const BLOCK_ISLAND_TAGS = /* @__PURE__ */ new Set([
	"details",
	"table",
	"ul",
	"ol",
	"figure",
	"img",
	"video",
	"audio",
	"blockquote",
	"aside",
	"footer",
	"hr",
	"tg-math-block",
	"tg-map",
	"tg-collage",
	"tg-slideshow",
	"a"
]);
const MEDIA_SRC_RE = /^https:\/\//i;
function hasStrayContent(nodes, allowed) {
	return nodes.some((node) => node.kind === "text" ? node.text.trim() !== "" : !allowed.has(node.name));
}
function mediaBlockFromElement(node, caption) {
	const src = parseHtmlAttrs(node.raw).get("src") ?? "";
	const hasBody = node.children.some((child) => child.kind === "text" ? child.text.trim() !== "" : true);
	if (!MEDIA_SRC_RE.test(src) || hasBody) return;
	const withCaption = caption ? { caption } : {};
	const isGif = /\.gif(?:[?#]|$)/i.test(src);
	if (node.name === "img" || node.name === "video") {
		if (isGif) return {
			type: "animation",
			animation: {
				type: "animation",
				media: src
			},
			...withCaption
		};
		return node.name === "img" ? {
			type: "photo",
			photo: {
				type: "photo",
				media: src
			},
			...withCaption
		} : {
			type: "video",
			video: {
				type: "video",
				media: src
			},
			...withCaption
		};
	}
	if (node.name === "audio") {
		if (/\.(?:ogg|opus|oga)(?:[?#]|$)/i.test(src)) return {
			type: "voice_note",
			voice_note: {
				type: "voice_note",
				media: src
			},
			...withCaption
		};
		return {
			type: "audio",
			audio: {
				type: "audio",
				media: src
			},
			...withCaption
		};
	}
}
function countChildren(nodes, name) {
	return nodes.filter((node) => node.kind === "element" && node.name === name).length;
}
function captionFromFigcaption(nodes) {
	const figcaption = nodes.find((node) => node.kind === "element" && node.name === "figcaption");
	if (!figcaption) return;
	const cite = figcaption.children.find((node) => node.kind === "element" && node.name === "cite");
	const text = htmlNodesToRichText(figcaption.children.filter((node) => node !== cite));
	if (text === "" && !cite) return;
	return {
		text,
		...cite ? { credit: htmlNodesToRichText(cite.children) } : {}
	};
}
const FIGURE_CHILDREN = /* @__PURE__ */ new Set([
	"img",
	"video",
	"audio",
	"tg-map",
	"figcaption"
]);
function figureToBlock(node) {
	if (hasStrayContent(node.children, FIGURE_CHILDREN)) return;
	if (node.children.filter((child) => child.kind === "element" && child.name !== "figcaption").length > 1 || countChildren(node.children, "figcaption") > 1) return;
	const media = node.children.find((child) => child.kind === "element" && (child.name === "img" || child.name === "video" || child.name === "audio" || child.name === "tg-map"));
	if (!media) return;
	const caption = captionFromFigcaption(node.children);
	if (media.name === "tg-map") {
		const map = mapToBlock(media);
		if (map?.type === "map" && caption) return {
			...map,
			caption
		};
		return map;
	}
	return mediaBlockFromElement(media, caption);
}
const LIST_CHILDREN = /* @__PURE__ */ new Set(["li"]);
function listToBlock(node) {
	if (hasStrayContent(node.children, LIST_CHILDREN)) return;
	const items = [];
	for (const child of node.children) {
		if (child.kind !== "element" || child.name !== "li") continue;
		const checkbox = child.children.find((grandchild) => grandchild.kind === "element" && grandchild.name === "input" && parseHtmlAttrs(grandchild.raw).get("type") === "checkbox");
		const blocks = htmlNodesToBlocks(child.children.filter((grandchild) => grandchild !== checkbox));
		const item = { blocks: blocks.length > 0 ? blocks : [{
			type: "paragraph",
			text: ""
		}] };
		if (checkbox) {
			item.has_checkbox = true;
			if (parseHtmlAttrs(checkbox.raw).has("checked")) item.is_checked = true;
		}
		items.push(item);
	}
	if (items.length === 0) return;
	return {
		type: "list",
		items: node.name === "ol" ? items.map((item, index) => ({
			...item,
			value: index + 1
		})) : items
	};
}
const CELL_ALIGN_VALUES = /* @__PURE__ */ new Set([
	"left",
	"center",
	"right"
]);
function tableCellFromElement(node, inHeader) {
	const attrs = parseHtmlAttrs(node.raw);
	const text = htmlNodesToRichText(node.children);
	const colspan = Number.parseInt(attrs.get("colspan") ?? "", 10);
	const rowspan = Number.parseInt(attrs.get("rowspan") ?? "", 10);
	const align = attrs.get("align")?.toLowerCase();
	return {
		...text !== "" ? { text } : {},
		...node.name === "th" || inHeader ? { is_header: true } : {},
		...Number.isFinite(colspan) && colspan > 1 ? { colspan } : {},
		...Number.isFinite(rowspan) && rowspan > 1 ? { rowspan } : {},
		...align && CELL_ALIGN_VALUES.has(align) ? { align } : {}
	};
}
const TABLE_COLUMN_LIMIT = 20;
function tableColumnCount(cells) {
	let carryover = [];
	let max = 0;
	for (const row of cells) {
		const carried = carryover.reduce((total, cell) => total + cell.span, 0);
		const own = row.reduce((total, cell) => total + (cell.colspan ?? 1), 0);
		max = Math.max(max, carried + own);
		carryover = [...carryover.map((cell) => ({
			span: cell.span,
			rows: cell.rows - 1
		})).filter((cell) => cell.rows > 0), ...row.filter((cell) => (cell.rowspan ?? 1) > 1).map((cell) => ({
			span: cell.colspan ?? 1,
			rows: (cell.rowspan ?? 1) - 1
		}))];
	}
	return max;
}
const TABLE_CHILDREN = /* @__PURE__ */ new Set([
	"caption",
	"thead",
	"tbody",
	"tfoot",
	"tr"
]);
const TABLE_ROW_CHILDREN = /* @__PURE__ */ new Set(["td", "th"]);
function tableToBlock(node) {
	if (hasStrayContent(node.children, TABLE_CHILDREN)) return;
	const cells = [];
	let caption;
	let stray = false;
	const visitRows = (parent, inHeader) => {
		for (const child of parent.children) {
			if (child.kind !== "element") {
				stray ||= child.text.trim() !== "";
				continue;
			}
			if (child.name === "caption") {
				const text = htmlNodesToRichText(child.children);
				if (text !== "") {
					stray ||= caption !== void 0;
					caption = text;
				}
				continue;
			}
			if (child.name === "thead" || child.name === "tbody" || child.name === "tfoot") {
				visitRows(child, child.name === "thead");
				continue;
			}
			if (child.name === "tr") {
				if (hasStrayContent(child.children, TABLE_ROW_CHILDREN)) {
					stray = true;
					continue;
				}
				const row = child.children.filter((cell) => cell.kind === "element" && (cell.name === "td" || cell.name === "th")).map((cell) => tableCellFromElement(cell, inHeader));
				if (row.length > 0) cells.push(row);
				continue;
			}
			stray = true;
		}
	};
	visitRows(node, false);
	if (stray || cells.length === 0) return;
	if (tableColumnCount(cells) > TABLE_COLUMN_LIMIT) {
		const grid = cells.map((row) => `| ${row.map((cell) => richTextToPlainString(cell.text ?? "")).join(" | ")} |`).join("\n");
		return {
			type: "pre",
			text: caption !== void 0 ? `${richTextToPlainString(caption)}\n${grid}` : grid
		};
	}
	return {
		type: "table",
		cells,
		is_bordered: true,
		is_striped: true,
		...caption !== void 0 ? { caption } : {}
	};
}
function strictNumber(value) {
	if (value === void 0 || !/^-?\d+(?:\.\d+)?$/.test(value.trim())) return;
	return Number.parseFloat(value);
}
function mapToBlock(node) {
	const attrs = parseHtmlAttrs(node.raw);
	const latitude = strictNumber(attrs.get("lat"));
	const longitude = strictNumber(attrs.get("long"));
	if (!(latitude !== void 0 && longitude !== void 0 && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180)) return;
	const zoom = strictNumber(attrs.get("zoom")) ?? NaN;
	return {
		type: "map",
		location: {
			latitude,
			longitude
		},
		zoom: Number.isFinite(zoom) ? Math.min(24, Math.max(0, Math.round(zoom))) : 14,
		width: 800,
		height: 450
	};
}
const COLLAGE_CHILDREN = /* @__PURE__ */ new Set([
	"figure",
	"img",
	"video",
	"audio",
	"figcaption"
]);
function collageToBlock(node) {
	if (hasStrayContent(node.children, COLLAGE_CHILDREN) || countChildren(node.children, "figcaption") > 1) return;
	const blocks = [];
	for (const child of node.children) {
		if (child.kind !== "element" || child.name === "figcaption") continue;
		const media = child.name === "figure" ? figureToBlock(child) : mediaBlockFromElement(child);
		if (!media) return;
		blocks.push(media);
	}
	if (blocks.length === 0) return;
	const caption = captionFromFigcaption(node.children);
	return {
		type: node.name === "tg-slideshow" ? "slideshow" : "collage",
		blocks,
		...caption ? { caption } : {}
	};
}
function richTextIsBlank(text) {
	if (typeof text === "string") return text.trim() === "";
	if (Array.isArray(text)) return text.every(richTextIsBlank);
	if (text.type === "mathematical_expression") return text.expression.trim() === "";
	if (text.type === "custom_emoji") return false;
	return richTextIsBlank(text.text);
}
/** Map island element nodes plus loose text into typed blocks. */
function htmlNodesToBlocks(nodes) {
	const blocks = [];
	let pendingInline = [];
	const flushInline = () => {
		if (pendingInline.length === 0) return;
		const text = htmlNodesToRichText(pendingInline);
		pendingInline = [];
		if (!richTextIsBlank(text)) blocks.push({
			type: "paragraph",
			text
		});
	};
	for (const node of nodes) {
		const block = node.kind === "element" ? elementToBlock(node) : void 0;
		if (block) {
			flushInline();
			blocks.push(block);
			continue;
		}
		if (node.kind === "element" && node.name === "p") {
			flushInline();
			const text = htmlNodesToRichText(node.children);
			if (text !== "") blocks.push({
				type: "paragraph",
				text
			});
			continue;
		}
		pendingInline.push(node);
	}
	flushInline();
	return blocks;
}
function elementToBlock(node) {
	switch (node.name) {
		case "hr": return { type: "divider" };
		case "details": {
			const summary = node.children.find((child) => child.kind === "element" && child.name === "summary");
			const blocks = htmlNodesToBlocks(node.children.filter((child) => child !== summary));
			return {
				type: "details",
				summary: summary ? htmlNodesToRichText(summary.children) : "Details",
				blocks: blocks.length > 0 ? blocks : [{
					type: "paragraph",
					text: ""
				}],
				...parseHtmlAttrs(node.raw).has("open") ? { is_open: true } : {}
			};
		}
		case "ul":
		case "ol": return listToBlock(node);
		case "table": return tableToBlock(node);
		case "figure": return figureToBlock(node);
		case "img":
		case "video":
		case "audio": return mediaBlockFromElement(node);
		case "blockquote": {
			const cite = node.children.find((child) => child.kind === "element" && child.name === "cite");
			const blocks = htmlNodesToBlocks(node.children.filter((child) => child !== cite));
			if (blocks.length === 0) return;
			const credit = cite ? htmlNodesToRichText(cite.children) : "";
			return credit !== "" ? {
				type: "blockquote",
				blocks,
				credit
			} : {
				type: "blockquote",
				blocks
			};
		}
		case "aside": {
			const cite = node.children.find((child) => child.kind === "element" && child.name === "cite");
			const text = htmlNodesToRichText(node.children.filter((child) => child !== cite));
			if (text === "") return;
			return {
				type: "pullquote",
				text,
				...cite ? { credit: htmlNodesToRichText(cite.children) } : {}
			};
		}
		case "footer": {
			const text = htmlNodesToRichText(node.children);
			return text === "" ? void 0 : {
				type: "footer",
				text
			};
		}
		case "tg-math-block": {
			const expression = nodeText(node.children).trim();
			return expression ? {
				type: "mathematical_expression",
				expression
			} : void 0;
		}
		case "tg-map": return mapToBlock(node);
		case "tg-collage":
		case "tg-slideshow": return collageToBlock(node);
		case "a": {
			const attrs = parseHtmlAttrs(node.raw);
			const name = attrs.get("name");
			if (name && !attrs.get("href") && nodeText(node.children).trim() === "") return {
				type: "anchor",
				name
			};
			return;
		}
		default: return;
	}
}
/**
* Find supported block islands inside a text range. Returns non-overlapping
* spans in order; text outside spans stays on the markdown paragraph path.
*/
function findTelegramHtmlIslands(text) {
	if (!text.includes("<")) return [];
	const islands = [];
	const tags = [...tokenizeHtmlTags(text)];
	const openContainers = [];
	let index = 0;
	while (index < tags.length) {
		const tag = tags[index];
		if (!tag) {
			index += 1;
			continue;
		}
		if (!(!tag.closing && BLOCK_ISLAND_TAGS.has(tag.name) && openContainers.length === 0)) {
			if (tag.closing) {
				const openIndex = openContainers.lastIndexOf(tag.name);
				if (openIndex >= 0) openContainers.length = openIndex;
			} else if (!tag.selfClosing && !VOID_TAGS.has(tag.name)) openContainers.push(tag.name);
			index += 1;
			continue;
		}
		let end = tag.end;
		const contentStart = tag.end;
		let contentEnd = tag.end;
		let matched = tag.selfClosing || VOID_TAGS.has(tag.name);
		if (!matched) {
			let depth = 1;
			let codeDepth = 0;
			let scan = index + 1;
			while (scan < tags.length) {
				const candidate = tags[scan];
				if (candidate && (candidate.name === "code" || candidate.name === "pre")) {
					if (candidate.closing) codeDepth = Math.max(0, codeDepth - 1);
					else if (!candidate.selfClosing) codeDepth += 1;
					scan += 1;
					continue;
				}
				if (candidate && candidate.name === tag.name && codeDepth === 0) {
					depth += candidate.closing ? -1 : candidate.selfClosing ? 0 : 1;
					if (depth === 0) {
						end = candidate.end;
						contentEnd = candidate.start;
						matched = true;
						index = scan;
						break;
					}
				}
				scan += 1;
			}
		}
		if (!matched) {
			openContainers.push(tag.name);
			index += 1;
			continue;
		}
		if (tag.name === "a") {
			const attrs = parseHtmlAttrs(tag.raw);
			if (!(attrs.get("name") !== void 0 && attrs.get("href") === void 0 && text.slice(contentStart, contentEnd).trim() === "")) {
				index += 1;
				continue;
			}
		}
		const blocks = htmlNodesToBlocks(parseHtmlFragment(text.slice(tag.start, end)));
		if (blocks.length > 0) islands.push({
			start: tag.start,
			end,
			blocks
		});
		index += 1;
	}
	return islands;
}
//#endregion
//#region extensions/telegram/src/rich-blocks.ts
const TELEGRAM_RICH_TEXT_TABLE_COLUMN_LIMIT = 20;
const INLINE_STYLE_RANK = {
	spoiler: 0,
	bold: 1,
	italic: 2,
	strikethrough: 3,
	code: 4
};
const TELEGRAM_RICH_LINK_HREF_RE = /^(?:https?:\/\/|tg:\/\/|mailto:|tel:)/i;
function isTelegramRichLinkHref(href) {
	return TELEGRAM_RICH_LINK_HREF_RE.test(href);
}
function resolveHeadingSize(style) {
	switch (style) {
		case "heading_1": return 1;
		case "heading_2": return 2;
		case "heading_3": return 3;
		case "heading_4": return 4;
		case "heading_5": return 5;
		case "heading_6": return 6;
		default: return;
	}
}
function isInlineStyle(style) {
	return style === "bold" || style === "italic" || style === "strikethrough" || style === "code" || style === "spoiler";
}
function resolveTelegramLinkAction(link, source, context) {
	const href = link.href.trim();
	if (!href || link.start === link.end) return null;
	const label = source.slice(link.start, link.end);
	if (context.origin === "linkify" && isAutoLinkedFileRef(href, label)) return { kind: "code" };
	if (href.startsWith("#")) return {
		kind: "anchor",
		name: href.slice(1)
	};
	if (!isTelegramRichLinkHref(href)) return null;
	return {
		kind: "url",
		href
	};
}
function collectTelegramLinkActions(ir) {
	const links = [];
	renderMarkdownWithMarkers(ir, {
		styleMarkers: {},
		escapeText: (text) => text,
		buildLink: (link, source, context) => {
			const action = resolveTelegramLinkAction(link, source, context);
			if (action) links.push({
				start: link.start,
				end: link.end,
				action
			});
			return null;
		}
	});
	return links;
}
/**
* Build nested RichText from IR spans over [rangeStart, rangeEnd).
* Spans that partially overlap are split at shared boundaries (IR contract).
*/
function irRangeToRichText(ir, rangeStart, rangeEnd) {
	if (rangeEnd <= rangeStart) return "";
	const slice = sliceMarkdownIR(ir, rangeStart, rangeEnd);
	const text = slice.text;
	if (!text) return "";
	const dominantAnnotationRanges = (slice.annotations ?? []).filter((span) => span.type === "assistant_transcript_role").map((span) => ({
		start: span.start,
		end: span.end
	}));
	const suppressed = (start, end) => dominantAnnotationRanges.some((range) => start < range.end && end > range.start);
	const styleSpans = slice.styles.filter((span) => isInlineStyle(span.style) && !suppressed(span.start, span.end));
	const annotationSpans = (slice.annotations ?? []).filter((span) => span.type === "assistant_transcript_role");
	const links = collectTelegramLinkActions({
		text,
		styles: [],
		links: slice.links.filter((link) => !suppressed(link.start, link.end))
	});
	const boundaries = /* @__PURE__ */ new Set([0, text.length]);
	for (const span of styleSpans) {
		boundaries.add(span.start);
		boundaries.add(span.end);
	}
	for (const span of annotationSpans) {
		boundaries.add(span.start);
		boundaries.add(span.end);
	}
	for (const link of links) {
		boundaries.add(link.start);
		boundaries.add(link.end);
	}
	const points = [...boundaries].toSorted((a, b) => a - b);
	const stack = [];
	const root = [];
	const frameStack = [root];
	const pushNode = (node) => {
		frameStack.at(-1)?.push(node);
	};
	const openStyleNode = (style, end) => {
		const container = [];
		pushNode({
			type: style,
			text: container
		});
		stack.push({
			kind: "style",
			style,
			end
		});
		frameStack.push(container);
	};
	const openAnnotationNode = (end) => {
		const container = [];
		pushNode({
			type: "code",
			text: container
		});
		stack.push({
			kind: "annotation",
			end
		});
		frameStack.push(container);
	};
	const openLinkNode = (target, end) => {
		const container = [];
		pushNode(target.kind === "url" ? {
			type: "url",
			text: container,
			url: target.href
		} : {
			type: "anchor_link",
			text: container,
			anchor_name: target.name
		});
		stack.push({
			kind: "link",
			target,
			end
		});
		frameStack.push(container);
	};
	for (let i = 0; i < points.length - 1; i += 1) {
		const start = points[i] ?? 0;
		const end = points[i + 1] ?? start;
		while (stack.length > 0 && (stack.at(-1)?.end ?? 0) <= start) {
			stack.pop();
			frameStack.pop();
		}
		const opening = [];
		for (const span of annotationSpans) if (span.start === start) opening.push({
			kind: "annotation",
			end: span.end
		});
		for (const link of links) {
			if (link.start !== start) continue;
			if (link.action.kind === "url" || link.action.kind === "anchor") opening.push({
				kind: "link",
				target: link.action,
				end: link.end
			});
			else opening.push({
				kind: "style",
				style: "code",
				end: link.end
			});
		}
		for (const span of styleSpans) if (span.start === start && isInlineStyle(span.style)) opening.push({
			kind: "style",
			style: span.style,
			end: span.end
		});
		opening.sort((left, right) => {
			if (left.end !== right.end) return right.end - left.end;
			return (left.kind === "style" ? INLINE_STYLE_RANK[left.style] ?? 99 : left.kind === "link" ? 50 : 0) - (right.kind === "style" ? INLINE_STYLE_RANK[right.style] ?? 99 : right.kind === "link" ? 50 : 0);
		});
		const inCode = stack.some((entry) => entry.kind === "style" && entry.style === "code") || stack.some((entry) => entry.kind === "annotation");
		for (const item of opening) if (item.kind === "annotation") openAnnotationNode(item.end);
		else if (item.kind === "link") {
			if (!inCode && !stack.some((entry) => entry.kind === "link")) openLinkNode(item.target, item.end);
		} else if (!inCode || item.style === "code") {
			if (!(item.style === "code" && inCode)) openStyleNode(item.style, item.end);
		}
		if (end > start) pushNode(text.slice(start, end));
	}
	while (stack.length > 0) {
		stack.pop();
		frameStack.pop();
	}
	return normalizeRichText(applyInlineHtmlIslands(root));
}
function applyInlineHtmlIslands(node) {
	if (typeof node === "string") return parseInlineHtmlIslands(node);
	if (Array.isArray(node)) return node.map(applyInlineHtmlIslands);
	if (node.type === "code" || node.type === "mathematical_expression" || node.type === "custom_emoji") return node;
	return {
		...node,
		text: applyInlineHtmlIslands(node.text)
	};
}
function pushParagraph(paragraphs, ir, rangeStart, rangeEnd) {
	const raw = ir.text.slice(rangeStart, rangeEnd);
	const leading = raw.length - raw.trimStart().length;
	const trailing = raw.length - raw.trimEnd().length;
	const absStart = rangeStart + leading;
	const absEnd = rangeEnd - trailing;
	if (absEnd <= absStart) return;
	const text = irRangeToRichText(ir, absStart, absEnd);
	if (text !== "") paragraphs.push({
		type: "paragraph",
		text
	});
}
function splitParagraphs(ir, start, end) {
	if (end <= start) return [];
	const text = ir.text.slice(start, end);
	const paragraphs = [];
	const blankLine = /\n[ \t]*\n+/g;
	let last = 0;
	let match;
	while ((match = blankLine.exec(text)) !== null) {
		pushParagraph(paragraphs, ir, start + last, start + match.index);
		last = match.index + match[0].length;
	}
	pushParagraph(paragraphs, ir, start + last, end);
	return paragraphs;
}
function emitGapBlocks(ir, start, end) {
	if (end <= start) return [];
	const codeRanges = ir.styles.filter((span) => (span.style === "code" || span.style === "code_block") && span.end > start && span.start < end);
	const islands = findTelegramHtmlIslands(ir.text.slice(start, end)).filter((island) => !codeRanges.some((range) => start + island.start >= range.start && start + island.start < range.end));
	if (islands.length === 0) return splitParagraphs(ir, start, end);
	const blocks = [];
	let cursor = start;
	for (const island of islands) {
		blocks.push(...splitParagraphs(ir, cursor, start + island.start));
		blocks.push(...island.blocks);
		cursor = start + island.end;
	}
	blocks.push(...splitParagraphs(ir, cursor, end));
	return blocks;
}
function renderAsciiTableGrid(table) {
	const rows = [table.headers, ...table.rows];
	const columnCount = Math.max(...rows.map((row) => row.length), 0);
	const widths = Array.from({ length: columnCount }, () => 3);
	for (const row of rows) for (let index = 0; index < columnCount; index += 1) widths[index] = Math.max(widths[index] ?? 3, row[index]?.length ?? 0);
	const renderRow = (row) => `| ${widths.map((width, index) => (row[index] ?? "").padEnd(width)).join(" | ")} |`;
	const divider = `| ${widths.map((width) => "-".repeat(width)).join(" | ")} |`;
	return [
		renderRow(table.headers),
		divider,
		...table.rows.map(renderRow)
	].join("\n");
}
function cellToRichText(cell) {
	if (!cell?.text) return;
	const rich = irRangeToRichText({
		text: cell.text,
		styles: cell.styles,
		links: cell.links,
		...cell.annotations ? { annotations: cell.annotations } : {}
	}, 0, cell.text.length);
	return rich === "" ? void 0 : rich;
}
function renderTableBlock(table) {
	const columnCount = Math.max(table.headers.length, ...table.rows.map((row) => row.length), 0);
	if (columnCount > TELEGRAM_RICH_TEXT_TABLE_COLUMN_LIMIT) return {
		block: {
			type: "pre",
			text: renderAsciiTableGrid(table)
		},
		degradation: "table-ascii"
	};
	const headerRow = table.headerCells.map((cell, index) => {
		const align = table.aligns?.[index];
		const text = cellToRichText(cell);
		return {
			is_header: true,
			...text !== void 0 ? { text } : {},
			...align ? { align } : {}
		};
	});
	const bodyRows = table.rowCells.map((row) => Array.from({ length: columnCount }, (_value, index) => {
		const align = table.aligns?.[index];
		const text = cellToRichText(row[index]);
		return {
			...text !== void 0 ? { text } : {},
			...align ? { align } : {}
		};
	}));
	return { block: {
		type: "table",
		cells: headerRow.length > 0 ? [headerRow, ...bodyRows] : bodyRows,
		is_bordered: true,
		is_striped: true
	} };
}
function collectStructuralSegments(ir, tables) {
	const segments = [];
	for (const span of ir.styles) {
		if (span.end <= span.start) continue;
		const headingSize = resolveHeadingSize(span.style);
		if (headingSize) {
			segments.push({
				kind: "heading",
				start: span.start,
				end: span.end,
				size: headingSize
			});
			continue;
		}
		if (span.style === "code_block") {
			segments.push({
				kind: "code_block",
				start: span.start,
				end: span.end,
				...span.language ? { language: span.language } : {}
			});
			continue;
		}
		if (span.style === "blockquote") segments.push({
			kind: "blockquote",
			start: span.start,
			end: span.end
		});
	}
	for (const table of tables) {
		const offset = Math.max(0, Math.min(table.placeholderOffset, ir.text.length));
		segments.push({
			kind: "table",
			start: offset,
			end: offset,
			table
		});
	}
	return segments.toSorted((left, right) => left.start - right.start || right.end - left.end);
}
function emitSegments(ir, segments, rangeStart, rangeEnd, degradationReasons) {
	const blocks = [];
	let cursor = rangeStart;
	let index = 0;
	while (index < segments.length) {
		const segment = segments[index];
		if (!segment) break;
		if (segment.start > cursor) blocks.push(...emitGapBlocks(ir, cursor, segment.start));
		let next = index + 1;
		while (next < segments.length && (segments[next]?.start ?? rangeEnd) < segment.end) next += 1;
		const children = segments.slice(index + 1, next);
		switch (segment.kind) {
			case "heading": {
				const text = irRangeToRichText(ir, segment.start, segment.end);
				if (text !== "") blocks.push({
					type: "heading",
					text,
					size: segment.size
				});
				break;
			}
			case "code_block": {
				const text = ir.text.slice(segment.start, segment.end).replace(/\n$/, "");
				blocks.push({
					type: "pre",
					text,
					...segment.language ? { language: segment.language } : {}
				});
				break;
			}
			case "blockquote": {
				const inner = emitSegments(ir, children, segment.start, segment.end, degradationReasons);
				if (inner.length > 0) blocks.push({
					type: "blockquote",
					blocks: inner
				});
				break;
			}
			case "table": {
				const rendered = renderTableBlock(segment.table);
				if (rendered.degradation) degradationReasons.add(rendered.degradation);
				blocks.push(rendered.block);
				break;
			}
		}
		cursor = Math.max(cursor, segment.end);
		index = next;
	}
	if (cursor < rangeEnd) blocks.push(...emitGapBlocks(ir, cursor, rangeEnd));
	return blocks;
}
function markdownToTelegramRichBlocks(markdown, options = {}) {
	const tableMode = options.tableMode ?? "block";
	const { ir, tables } = markdownToIRWithMeta(markdown ?? "", {
		assistantTranscriptRoleHeaders: true,
		linkify: options.skipEntityDetection !== true,
		enableSpoilers: true,
		headingStyle: "rich",
		blockquotePrefix: "",
		tableMode
	});
	const degradationReasons = /* @__PURE__ */ new Set();
	const blocks = emitSegments(ir, collectStructuralSegments(ir, tables), 0, ir.text.length, degradationReasons);
	if (blocks.length === 0 && ir.text.trim()) blocks.push({
		type: "paragraph",
		text: ir.text
	});
	return {
		blocks,
		plainText: inputRichBlocksToPlainText(blocks),
		degradationReasons: [...degradationReasons]
	};
}
//#endregion
//#region extensions/telegram/src/rich-message.ts
const TELEGRAM_RICH_TEXT_LIMIT = 32768;
const TELEGRAM_RICH_BLOCK_LIMIT = 500;
function isEmptyTelegramRichMessage(richMessage) {
	return richMessage.blocks.length === 0;
}
const TELEGRAM_RICH_EMAIL_TOKEN_RE = /[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+/iu;
function shouldSkipTelegramRichEntityDetection(text, options) {
	return options?.skipEntityDetection === true || TELEGRAM_RICH_EMAIL_TOKEN_RE.test(text);
}
function getTelegramRichRawApi(api) {
	const raw = api.raw;
	if (raw) return raw;
	throw new Error("Telegram rich messages require grammY api.raw");
}
function finiteInteger(value) {
	return typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : void 0;
}
function isReplyParameters(value) {
	if (!value || typeof value !== "object") return false;
	return finiteInteger(value.message_id) !== void 0;
}
function toTelegramRichMessageContextParams(params) {
	const richParams = {};
	const messageThreadId = finiteInteger(params?.message_thread_id);
	if (messageThreadId !== void 0) richParams.message_thread_id = messageThreadId;
	if (params?.disable_notification === true) richParams.disable_notification = true;
	if (isReplyParameters(params?.reply_parameters)) {
		richParams.reply_parameters = params.reply_parameters;
		return richParams;
	}
	const replyToMessageId = finiteInteger(params?.reply_to_message_id);
	if (replyToMessageId !== void 0) richParams.reply_parameters = {
		message_id: replyToMessageId,
		allow_sending_without_reply: true
	};
	return richParams;
}
function removeTelegramRichNativeQuoteParam(params) {
	const richParams = toTelegramRichMessageContextParams(params);
	if (!richParams.reply_parameters) return richParams;
	const { quote: _quote, quote_entities: _quoteEntities, quote_parse_mode: _quoteParseMode, quote_position: _quotePosition, ...replyParameters } = richParams.reply_parameters;
	return {
		...richParams,
		reply_parameters: replyParameters
	};
}
function toRichMessage(blocks, plainText, options) {
	return shouldSkipTelegramRichEntityDetection(plainText, options) ? {
		blocks,
		skip_entity_detection: true
	} : { blocks };
}
function buildTelegramRichMarkdownPlan(markdown, options) {
	const skipEntityDetection = shouldSkipTelegramRichEntityDetection(markdown, options);
	const rendered = markdownToTelegramRichBlocks(markdown, {
		tableMode: options?.tableMode,
		skipEntityDetection
	});
	return {
		richMessage: toRichMessage(rendered.blocks, rendered.plainText, {
			...options,
			skipEntityDetection
		}),
		plainText: rendered.plainText,
		degradationReasons: rendered.degradationReasons
	};
}
function buildTelegramRichMarkdown(markdown, options) {
	return buildTelegramRichMarkdownPlan(markdown, options).richMessage;
}
function buildTelegramRichBlocksPlan(blocks, options) {
	const plainText = options?.plainText ?? inputRichBlocksToPlainText(blocks);
	return {
		richMessage: toRichMessage(blocks, plainText, options),
		plainText,
		degradationReasons: []
	};
}
function splitTelegramRichMessageTextChunks(params) {
	const plan = buildTelegramRichMarkdownPlan(params.text, {
		tableMode: params.tableMode,
		skipEntityDetection: params.skipEntityDetection
	});
	const chunkOptions = { skipEntityDetection: plan.richMessage.skip_entity_detection === true };
	const chunked = splitTelegramRichBlocks(plan.richMessage.blocks, {
		blockLimit: TELEGRAM_RICH_BLOCK_LIMIT,
		textLimit: params.textLimit
	}).map((blocks, index) => {
		const plainText = inputRichBlocksToPlainText(blocks);
		return {
			richMessage: toRichMessage(blocks, plainText, chunkOptions),
			plainText,
			degradationReasons: index === 0 ? plan.degradationReasons : []
		};
	});
	if (chunked.length === 0 && params.text.trim()) return [{
		richMessage: toRichMessage([{
			type: "paragraph",
			text: params.text
		}], params.text, chunkOptions),
		plainText: params.text,
		degradationReasons: plan.degradationReasons
	}];
	return chunked;
}
//#endregion
//#region extensions/telegram/src/target-writeback.ts
const writebackLogger = createSubsystemLogger("telegram/target-writeback");
const TELEGRAM_ADMIN_SCOPE = "operator.admin";
function asObjectRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	return value;
}
function normalizeTelegramLookupTargetForMatch(raw) {
	const normalized = normalizeTelegramLookupTarget(raw);
	if (!normalized) return;
	return normalized.startsWith("@") ? normalizeLowercaseStringOrEmpty(normalized) : normalized;
}
function normalizeTelegramTargetForMatch(raw) {
	const parsed = parseTelegramTarget(raw);
	const normalized = normalizeTelegramLookupTargetForMatch(parsed.chatId);
	if (!normalized) return;
	return `${normalized}|${parsed.messageThreadId == null ? "" : String(parsed.messageThreadId)}`;
}
function buildResolvedTelegramTarget(params) {
	const { raw, parsed, resolvedChatId } = params;
	if (parsed.messageThreadId == null) return resolvedChatId;
	return raw.includes(":topic:") ? `${resolvedChatId}:topic:${parsed.messageThreadId}` : `${resolvedChatId}:${parsed.messageThreadId}`;
}
function resolveLegacyRewrite(params) {
	const parsed = parseTelegramTarget(params.raw);
	if (normalizeTelegramChatId(parsed.chatId)) return null;
	const normalized = normalizeTelegramLookupTargetForMatch(parsed.chatId);
	if (!normalized) return null;
	return {
		matchKey: `${normalized}|${parsed.messageThreadId == null ? "" : String(parsed.messageThreadId)}`,
		resolvedTarget: buildResolvedTelegramTarget({
			raw: params.raw,
			parsed,
			resolvedChatId: params.resolvedChatId
		})
	};
}
function rewriteTargetIfMatch(params) {
	if (typeof params.rawValue !== "string" && typeof params.rawValue !== "number") return null;
	const value = normalizeOptionalString(String(params.rawValue)) ?? "";
	if (!value) return null;
	if (normalizeTelegramTargetForMatch(value) !== params.matchKey) return null;
	return params.resolvedTarget;
}
function replaceTelegramDefaultToTargets(params) {
	let changed = false;
	const telegram = asObjectRecord(params.cfg.channels?.telegram);
	if (!telegram) return changed;
	const maybeReplace = (holder, key) => {
		const nextTarget = rewriteTargetIfMatch({
			rawValue: holder[key],
			matchKey: params.matchKey,
			resolvedTarget: params.resolvedTarget
		});
		if (!nextTarget) return;
		holder[key] = nextTarget;
		changed = true;
	};
	maybeReplace(telegram, "defaultTo");
	const accounts = asObjectRecord(telegram.accounts);
	if (!accounts) return changed;
	for (const accountId of Object.keys(accounts)) {
		const account = asObjectRecord(accounts[accountId]);
		if (!account) continue;
		maybeReplace(account, "defaultTo");
	}
	return changed;
}
async function maybePersistResolvedTelegramTarget(params) {
	const raw = params.rawTarget.trim();
	if (!raw) return;
	const rewrite = resolveLegacyRewrite({
		raw,
		resolvedChatId: params.resolvedChatId
	});
	if (!rewrite) return;
	const { matchKey, resolvedTarget } = rewrite;
	const hasGatewayAdminScope = params.gatewayClientScopes?.includes(TELEGRAM_ADMIN_SCOPE) === true;
	const trustedInternalWriteback = params.gatewayClientScopes === void 0 && params.trustedInternalWriteback === true;
	if (!hasGatewayAdminScope && !trustedInternalWriteback) {
		writebackLogger.warn(`skipping Telegram target writeback for ${raw} because gateway caller is missing ${TELEGRAM_ADMIN_SCOPE}`);
		return;
	}
	try {
		const { snapshot, writeOptions } = await readConfigFileSnapshotForWrite();
		const nextConfig = structuredClone(snapshot.config ?? {});
		if (replaceTelegramDefaultToTargets({
			cfg: nextConfig,
			matchKey,
			resolvedTarget
		})) {
			await replaceConfigFile({
				nextConfig,
				snapshot,
				writeOptions,
				afterWrite: { mode: "auto" }
			});
			if (params.verbose) writebackLogger.warn(`resolved Telegram defaultTo target ${raw} -> ${resolvedTarget}`);
		}
	} catch (err) {
		if (params.verbose) writebackLogger.warn(`failed to persist Telegram defaultTo target ${raw}: ${String(err)}`);
	}
	try {
		const storePath = resolveCronStorePath(params.cfg.cron?.store);
		const store = await loadCronStore(storePath);
		let cronChanged = false;
		for (const job of store.jobs) {
			if (job.delivery?.channel !== "telegram") continue;
			const nextTarget = rewriteTargetIfMatch({
				rawValue: job.delivery.to,
				matchKey,
				resolvedTarget
			});
			if (!nextTarget) continue;
			job.delivery.to = nextTarget;
			cronChanged = true;
		}
		if (cronChanged) {
			await saveCronStore(storePath, store);
			if (params.verbose) writebackLogger.warn(`resolved Telegram cron delivery target ${raw} -> ${resolvedTarget}`);
		}
	} catch (err) {
		if (params.verbose) writebackLogger.warn(`failed to persist Telegram cron target ${raw}: ${String(err)}`);
	}
}
//#endregion
//#region extensions/telegram/src/voice.ts
function resolveTelegramVoiceDecision(opts) {
	if (!opts.wantsVoice) return { useVoice: false };
	if (isVoiceMessageCompatibleAudio(opts)) return { useVoice: true };
	return {
		useVoice: false,
		reason: `media is ${opts.contentType ?? "unknown"} (${opts.fileName ?? "unknown"})`
	};
}
function resolveTelegramVoiceSend(opts) {
	const decision = resolveTelegramVoiceDecision(opts);
	if (decision.reason && opts.logFallback) opts.logFallback(`Telegram voice requested but ${decision.reason}; sending as audio file instead.`);
	return { useVoice: decision.useVoice };
}
//#endregion
//#region extensions/telegram/src/send.ts
const InputFileCtor = grammy.InputFile;
const MAX_TELEGRAM_PHOTO_DIMENSION_SUM = 1e4;
const MAX_TELEGRAM_PHOTO_ASPECT_RATIO = 20;
function resolveTelegramMessageIdOrThrow(result, context) {
	if (typeof result?.message_id === "number" && Number.isFinite(result.message_id)) return Math.trunc(result.message_id);
	throw new Error(`Telegram ${context} returned no message_id`);
}
function splitTelegramPlainTextChunksForTests(text, limit) {
	return splitTelegramPlainTextChunks(text, limit);
}
function logTelegramOutboundSendOk(params) {
	const parts = [
		"telegram outbound send ok",
		`accountId=${params.accountId}`,
		`chatId=${params.chatId}`,
		`messageId=${params.messageId}`,
		`operation=${params.operation}`
	];
	if (params.deliveryKind) parts.push(`deliveryKind=${params.deliveryKind}`);
	if (typeof params.messageThreadId === "number") parts.push(`threadId=${params.messageThreadId}`);
	if (typeof params.replyToMessageId === "number") parts.push(`replyToMessageId=${params.replyToMessageId}`);
	if (params.silent === true) parts.push("silent=true");
	if (typeof params.chunkCount === "number") parts.push(`chunkCount=${params.chunkCount}`);
	sendLogger.info(parts.join(" "));
}
function buildTelegramTextSendReceipt(params) {
	if (params.messageIds.length <= 1) return;
	return createMessageReceiptFromOutboundResults({
		results: params.messageIds.map((messageId) => ({
			messageId,
			chatId: params.chatId
		})),
		kind: "text",
		...typeof params.messageThreadId === "number" ? { threadId: String(params.messageThreadId) } : {},
		...typeof params.replyToMessageId === "number" ? { replyToId: String(params.replyToMessageId) } : {}
	});
}
function resolveAcceptedReplyToMessageId(params) {
	if (!params) return;
	if ("reply_to_message_id" in params) return params.reply_to_message_id;
	return params.reply_parameters?.message_id;
}
function toAcceptedThreadScopedParams(params) {
	if (!params) return;
	const scoped = {};
	if (typeof params.message_thread_id === "number" && Number.isFinite(params.message_thread_id)) scoped.message_thread_id = params.message_thread_id;
	if (typeof params.reply_to_message_id === "number" && Number.isFinite(params.reply_to_message_id)) scoped.reply_to_message_id = params.reply_to_message_id;
	const replyParameters = params.reply_parameters;
	if (replyParameters && typeof replyParameters === "object") {
		const messageId = replyParameters.message_id;
		if (typeof messageId === "number" && Number.isFinite(messageId)) scoped.reply_parameters = { message_id: messageId };
	}
	return Object.keys(scoped).length > 0 ? scoped : void 0;
}
const MESSAGE_NOT_MODIFIED_RE = /400:\s*Bad Request:\s*message is not modified|MESSAGE_NOT_MODIFIED/i;
const MESSAGE_HAS_NO_TEXT_RE = /400:\s*Bad Request:\s*there is no text in the message to edit/i;
const MESSAGE_DELETE_NOOP_RE = /message to delete not found|message can't be deleted|MESSAGE_ID_INVALID|MESSAGE_DELETE_FORBIDDEN/i;
const CHAT_NOT_FOUND_RE = /400: Bad Request: chat not found/i;
const sendLogger = createSubsystemLogger("telegram/send");
const diagLogger = createSubsystemLogger("telegram/diagnostic");
const telegramClientOptionsCache = /* @__PURE__ */ new Map();
const MAX_TELEGRAM_CLIENT_OPTIONS_CACHE_SIZE = 64;
function resetTelegramClientOptionsCacheForTests() {
	telegramClientOptionsCache.clear();
}
function createTelegramHttpLogger(cfg) {
	if (!isDiagnosticFlagEnabled("telegram.http", cfg)) return () => {};
	return (label, err) => {
		if (!(err instanceof HttpError)) return;
		const detail = redactSensitiveText(formatUncaughtError(err.error ?? err));
		diagLogger.warn(`telegram http error (${label}): ${detail}`);
	};
}
function shouldUseTelegramClientOptionsCache() {
	return !process.env.VITEST && true;
}
function buildTelegramClientOptionsCacheKey(params) {
	const proxyKey = params.account.config.proxy?.trim() ?? "";
	const autoSelectFamily = params.account.config.network?.autoSelectFamily;
	const autoSelectFamilyKey = typeof autoSelectFamily === "boolean" ? String(autoSelectFamily) : "default";
	const dnsResultOrderKey = params.account.config.network?.dnsResultOrder ?? "default";
	const apiRootKey = params.account.config.apiRoot?.trim() ?? "";
	const timeoutSecondsKey = typeof params.timeoutSeconds === "number" ? String(params.timeoutSeconds) : "default";
	return `${params.account.accountId}::${proxyKey}::${autoSelectFamilyKey}::${dnsResultOrderKey}::${apiRootKey}::${timeoutSecondsKey}`;
}
function closeCachedTelegramClientOptions(entry) {
	entry.retired = true;
	if (entry.activeLeases > 0 || entry.closeStarted) return;
	entry.closeStarted = true;
	entry.transport.close().catch((err) => {
		diagLogger.warn(`telegram client options cache transport close failed: ${redactSensitiveText(formatUncaughtError(err))}`);
	});
}
function leaseCachedTelegramClientOptions(entry) {
	entry.activeLeases += 1;
	let released = false;
	return { release: () => {
		if (released) return;
		released = true;
		entry.activeLeases = Math.max(0, entry.activeLeases - 1);
		if (entry.retired) closeCachedTelegramClientOptions(entry);
	} };
}
function setCachedTelegramClientOptions(cacheKey, entry) {
	telegramClientOptionsCache.set(cacheKey, entry);
	if (telegramClientOptionsCache.size > MAX_TELEGRAM_CLIENT_OPTIONS_CACHE_SIZE) {
		const oldestKey = telegramClientOptionsCache.keys().next().value;
		if (oldestKey !== void 0) {
			const evictedEntry = telegramClientOptionsCache.get(oldestKey);
			telegramClientOptionsCache.delete(oldestKey);
			if (evictedEntry) closeCachedTelegramClientOptions(evictedEntry);
		}
	}
	return {
		clientOptions: entry.clientOptions,
		lease: () => leaseCachedTelegramClientOptions(entry)
	};
}
function resolveTelegramClientOptions(account) {
	const timeoutSeconds = void 0;
	const cacheKey = shouldUseTelegramClientOptionsCache() ? buildTelegramClientOptionsCacheKey({
		account,
		timeoutSeconds
	}) : null;
	if (cacheKey && telegramClientOptionsCache.has(cacheKey)) {
		const entry = telegramClientOptionsCache.get(cacheKey);
		if (entry) return {
			clientOptions: entry.clientOptions,
			lease: () => leaseCachedTelegramClientOptions(entry)
		};
	}
	const proxyUrl = normalizeOptionalString(account.config.proxy);
	const proxyFetch = proxyUrl ? makeProxyFetch(proxyUrl) : void 0;
	const apiRoot = normalizeOptionalString(account.config.apiRoot);
	const normalizedApiRoot = apiRoot ? normalizeTelegramApiRoot(apiRoot) : void 0;
	const transport = resolveTelegramTransport(proxyFetch, { network: account.config.network });
	const fetchImpl = createTelegramClientFetch({
		fetchImpl: asTelegramClientFetch(transport.fetch),
		timeoutSeconds,
		transport
	});
	const clientOptions = fetchImpl || normalizedApiRoot ? {
		...fetchImpl ? { fetch: asTelegramClientFetch(fetchImpl) } : {},
		...normalizedApiRoot ? { apiRoot: normalizedApiRoot } : {}
	} : void 0;
	if (cacheKey) return setCachedTelegramClientOptions(cacheKey, {
		activeLeases: 0,
		clientOptions,
		closeStarted: false,
		retired: false,
		transport
	});
	return { clientOptions };
}
function resolveToken(explicit, params) {
	if (explicit?.trim()) return explicit.trim();
	if (!params.token) throw new Error(`Telegram bot token missing for account "${params.accountId}" (set channels.telegram.accounts.${params.accountId}.botToken/tokenFile or TELEGRAM_BOT_TOKEN for default).`);
	return params.token.trim();
}
async function resolveChatId(to, params) {
	const numericChatId = normalizeTelegramChatId(to);
	if (numericChatId) return numericChatId;
	const lookupTarget = normalizeTelegramLookupTarget(to);
	const getChat = params.api.getChat;
	if (!lookupTarget || typeof getChat !== "function") throw new Error("Telegram recipient must be a numeric chat ID");
	try {
		const chat = await getChat.call(params.api, lookupTarget);
		const resolved = normalizeTelegramChatId(String(chat?.id ?? ""));
		if (!resolved) throw new Error(`resolved chat id is not numeric (${String(chat?.id ?? "")})`);
		if (params.verbose) sendLogger.warn(`telegram recipient ${lookupTarget} resolved to numeric chat id ${resolved}`);
		return resolved;
	} catch (err) {
		const detail = formatErrorMessage(err);
		throw new Error(`Telegram recipient ${lookupTarget} could not be resolved to a numeric chat ID (${detail})`, { cause: err });
	}
}
async function resolveAndPersistChatId(params) {
	const chatId = await resolveChatId(params.lookupTarget, {
		api: params.api,
		verbose: params.verbose
	});
	await maybePersistResolvedTelegramTarget({
		cfg: params.cfg,
		rawTarget: params.persistTarget,
		resolvedChatId: chatId,
		verbose: params.verbose,
		gatewayClientScopes: params.gatewayClientScopes,
		...params.gatewayClientScopes === void 0 ? { trustedInternalWriteback: true } : {}
	});
	return chatId;
}
function normalizeMessageId(raw) {
	if (typeof raw === "number" && Number.isFinite(raw)) return Math.trunc(raw);
	if (typeof raw === "string") {
		const value = raw.trim();
		if (!value) throw new Error("Message id is required for Telegram actions");
		const parsed = parseStrictInteger(value);
		if (parsed !== void 0) return parsed;
	}
	throw new Error("Message id is required for Telegram actions");
}
function isTelegramMessageNotModifiedError(err) {
	return MESSAGE_NOT_MODIFIED_RE.test(formatErrorMessage(err));
}
function isTelegramMessageHasNoTextError(err) {
	return MESSAGE_HAS_NO_TEXT_RE.test(formatErrorMessage(err));
}
function isTelegramMessageDeleteNoopError(err) {
	return MESSAGE_DELETE_NOOP_RE.test(formatErrorMessage(err));
}
async function withTelegramHtmlParseFallback(params) {
	try {
		return await params.requestHtml(params.label);
	} catch (err) {
		if (!isTelegramHtmlParseError(err)) throw err;
		if (params.verbose) sendLogger.warn(`telegram ${params.label} failed with HTML parse error, retrying as plain text: ${formatErrorMessage(err)}`);
		return await params.requestPlain(`${params.label}-plain`);
	}
}
async function withTelegramNativeQuoteFallback(params) {
	try {
		return {
			result: await params.request(params.requestParams, params.label),
			acceptedParams: params.requestParams
		};
	} catch (err) {
		if (getTelegramNativeQuoteReplyMessageId(params.requestParams) == null || !isTelegramQuoteParamError(err)) throw err;
		sendLogger.warn(`telegram ${params.label} native quote rejected, retrying with legacy reply_to_message_id: ${formatErrorMessage(err)}`);
		const acceptedParams = (params.removeNativeQuoteParam ?? removeTelegramNativeQuoteParam)(params.requestParams);
		return {
			result: await params.request(acceptedParams, `${params.label}-legacy-reply`),
			acceptedParams
		};
	}
}
function resolveTelegramApiContext(opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Telegram API context");
	const account = resolveTelegramAccount({
		cfg,
		accountId: opts.accountId
	});
	const token = resolveToken(opts.token, account);
	let api;
	let clientOptionsLease;
	if (opts.api) api = opts.api;
	else {
		const client = resolveTelegramClientOptions(account);
		clientOptionsLease = client.lease?.();
		const bot = new Bot(token, client.clientOptions ? { client: client.clientOptions } : void 0);
		bot.api.config.use(getOrCreateAccountThrottler(token));
		api = bot.api;
	}
	return {
		cfg,
		account,
		api,
		...clientOptionsLease ? { clientOptionsLease } : {}
	};
}
function withTelegramApiContextLease(context, operation) {
	return operation.finally(() => context.clientOptionsLease?.release());
}
function createTelegramRequestWithDiag(params) {
	const request = createChannelApiRetryRunner({
		retry: params.retry,
		verbose: params.verbose,
		...params.retryAfterMaxDelayMs !== void 0 ? { retryAfterMaxDelayMs: params.retryAfterMaxDelayMs } : {},
		...params.shouldRetry ? { shouldRetry: params.shouldRetry } : {},
		...params.strictShouldRetry ? { strictShouldRetry: true } : {}
	});
	const logHttpError = createTelegramHttpLogger(params.cfg);
	return (fn, label, options) => {
		const runRequest = () => request(fn, label);
		return (params.useApiErrorLogging === false ? runRequest() : withTelegramApiErrorLogging({
			operation: label ?? "request",
			fn: runRequest,
			...options?.shouldLog ? { shouldLog: options.shouldLog } : {}
		})).catch((err) => {
			logHttpError(label ?? "request", err);
			throw err;
		});
	};
}
function wrapTelegramChatNotFoundError(err, params) {
	const errorMsg = formatErrorMessage(err);
	if (/403.*(bot.*not.*member|bot.*blocked|bot.*kicked)/i.test(errorMsg)) return new Error([
		`Telegram send failed: bot is not a member of the chat, was blocked, or was kicked (chat_id=${params.chatId}).`,
		`Telegram API said: ${errorMsg}.`,
		"Fix: Add the bot to the channel/group, or ensure it has not been removed/blocked/kicked by the user.",
		`Input was: ${JSON.stringify(params.input)}.`
	].join(" "));
	if (!CHAT_NOT_FOUND_RE.test(errorMsg)) return err;
	return new Error([
		`Telegram send failed: chat not found (chat_id=${params.chatId}).`,
		"Likely: bot not started in DM, bot removed from group/channel, group migrated (new -100… id), or wrong bot token.",
		`Input was: ${JSON.stringify(params.input)}.`
	].join(" "));
}
function createRequestWithChatNotFound(params) {
	return async (fn, label) => params.requestWithDiag(fn, label).catch((err) => {
		throw wrapTelegramChatNotFoundError(err, {
			chatId: params.chatId,
			input: params.input
		});
	});
}
function createTelegramNonIdempotentRequestWithDiag(params) {
	return createTelegramRequestWithDiag({
		cfg: params.cfg,
		account: params.account,
		retry: params.retry,
		verbose: params.verbose,
		useApiErrorLogging: params.useApiErrorLogging,
		retryAfterMaxDelayMs: TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS,
		shouldRetry: (err) => isSafeToRetrySendError(err) || isTelegramRateLimitError(err),
		strictShouldRetry: true
	});
}
async function sendMessageTelegram(to, text, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, sendMessageTelegramWithContext(to, text, opts, context));
}
async function sendMessageTelegramWithContext(to, text, opts, apiContext) {
	const { cfg, account, api } = apiContext;
	const botUserId = resolveTelegramBotUserIdFromToken(opts.token || account.token);
	const target = parseTelegramTarget(to);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: target.chatId,
		persistTarget: to,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const reportDelivery = async (messageId, deliveredChatId, meta) => {
		await opts.onDeliveryResult?.({
			messageId: String(messageId),
			chatId: String(deliveredChatId),
			...meta ? { meta } : {}
		});
	};
	const recordDeliveredPromptContext = async (params, finalPart) => {
		const plan = opts.promptContextProjectionPlan;
		const projection = plan?.cursor.take(plan.finalPart && finalPart);
		const recorded = await recordOutboundMessageForPromptContext({
			cfg,
			account,
			...botUserId !== void 0 ? { botUserId } : {},
			chatId,
			...params,
			promptContextProjection: projection
		});
		if (projection && !recorded) plan?.cursor.invalidate();
	};
	const mediaUrl = opts.mediaUrl?.trim();
	const mediaMaxBytes = opts.maxBytes ?? (typeof account.config.mediaMaxMb === "number" ? account.config.mediaMaxMb : 100) * 1024 * 1024;
	const replyMarkup = buildInlineKeyboard(opts.buttons);
	const threadSpec = resolveTelegramSendThreadSpec({
		targetMessageThreadId: target.messageThreadId,
		messageThreadId: opts.messageThreadId,
		chatType: target.chatType
	});
	const singleUseReplyTo = opts.replyToIdSource === "implicit" && opts.replyToMode !== void 0 && isSingleUseReplyToMode(opts.replyToMode);
	const buildThreadParams = (includeReplyTo) => buildTelegramThreadReplyParams({
		thread: threadSpec,
		...includeReplyTo ? {
			replyToMessageId: opts.replyToMessageId,
			replyQuoteText: opts.quoteText,
			useReplyIdAsQuoteSource: true
		} : {}
	});
	const requestWithChatNotFound = createRequestWithChatNotFound({
		requestWithDiag: createTelegramNonIdempotentRequestWithDiag({
			cfg,
			account,
			retry: opts.retry,
			verbose: opts.verbose
		}),
		chatId,
		input: to
	});
	const textMode = opts.textMode ?? "markdown";
	const useRichMessages = account.config.richMessages === true && textMode !== "html";
	const tableMode = opts.tableMode ?? resolveMarkdownTableMode({
		cfg,
		channel: "telegram",
		accountId: account.accountId,
		supportsBlockTables: useRichMessages
	});
	const renderHtmlText = (value) => renderTelegramHtmlText(value, {
		textMode,
		tableMode
	});
	const linkPreviewOptions = account.config.linkPreview ?? true ? void 0 : { is_disabled: true };
	const sendTelegramTextChunk = async (chunk, params) => {
		const baseParams = params ? { ...params } : {};
		if (linkPreviewOptions) baseParams.link_preview_options = linkPreviewOptions;
		const plainParams = {
			...baseParams,
			...opts.silent === true ? { disable_notification: true } : {}
		};
		const requestSendMessage = (label, messageText, requestParams) => withTelegramNativeQuoteFallback({
			label,
			requestParams,
			request: (effectiveParams, retryLabel) => requestWithChatNotFound(() => Object.keys(effectiveParams).length > 0 ? api.sendMessage(chatId, messageText, effectiveParams) : api.sendMessage(chatId, messageText), retryLabel)
		});
		const requestPlain = (label) => requestSendMessage(label, chunk.plainText, plainParams ?? {});
		const result = !chunk.htmlText ? await requestPlain("message") : await withTelegramHtmlParseFallback({
			label: "message",
			verbose: opts.verbose,
			requestHtml: (label) => requestSendMessage(label, chunk.htmlText ?? chunk.plainText, {
				parse_mode: "HTML",
				...plainParams
			}),
			requestPlain
		});
		return {
			result: result.result,
			acceptedParams: toAcceptedThreadScopedParams(result.acceptedParams)
		};
	};
	const shouldIncludeReplyForChunk = (index, chunkCount, replyToAlreadyUsed) => !replyToAlreadyUsed && (!singleUseReplyTo || chunkCount === 1 && index === 0);
	const buildTextParams = (index, chunkCount, isLastChunk, replyToAlreadyUsed) => {
		const params = buildThreadParams(shouldIncludeReplyForChunk(index, chunkCount, replyToAlreadyUsed));
		return Object.keys(params).length > 0 || isLastChunk && replyMarkup ? {
			...params,
			...isLastChunk && replyMarkup ? { reply_markup: replyMarkup } : {}
		} : void 0;
	};
	const buildRichTextParams = (index, chunkCount, isLastChunk, replyToAlreadyUsed) => {
		const params = toTelegramRichMessageContextParams(buildThreadParams(shouldIncludeReplyForChunk(index, chunkCount, replyToAlreadyUsed)));
		return Object.keys(params).length > 0 || isLastChunk && replyMarkup ? {
			...params,
			...isLastChunk && replyMarkup ? { reply_markup: replyMarkup } : {}
		} : void 0;
	};
	const sendTelegramTextChunks = async (chunks, context, options = {}) => {
		let lastMessageId = "";
		let lastChatId = chatId;
		let lastAcceptedParams;
		let acceptedReplyToMessageId;
		const messageIds = [];
		let sentChunkCount = 0;
		for (let index = 0; index < chunks.length; index += 1) {
			const chunk = chunks[index];
			if (!chunk) continue;
			const { result: res, acceptedParams } = await sendTelegramTextChunk(chunk, buildTextParams(index, chunks.length, index === chunks.length - 1, options.replyToAlreadyUsed === true));
			const messageId = resolveTelegramMessageIdOrThrow(res, context);
			recordSentMessage(chatId, messageId, cfg);
			await reportDelivery(messageId, res?.chat?.id ?? chatId, {
				telegramDeliveredText: chunk.plainText,
				telegramHasInlineKeyboard: index === chunks.length - 1 && Boolean(replyMarkup)
			});
			await recordDeliveredPromptContext({
				message: res,
				messageId,
				text: chunk.plainText,
				...acceptedParams?.message_thread_id !== void 0 ? { messageThreadId: acceptedParams.message_thread_id } : {}
			}, index === chunks.length - 1);
			lastMessageId = String(messageId);
			lastChatId = String(res?.chat?.id ?? chatId);
			lastAcceptedParams = acceptedParams;
			acceptedReplyToMessageId ??= resolveAcceptedReplyToMessageId(acceptedParams);
			messageIds.push(lastMessageId);
			sentChunkCount += 1;
		}
		if (lastMessageId) logTelegramOutboundSendOk({
			accountId: account.accountId,
			chatId: lastChatId,
			messageId: lastMessageId,
			operation: "sendMessage",
			deliveryKind: "text",
			messageThreadId: lastAcceptedParams?.message_thread_id,
			replyToMessageId: opts.replyToMessageId,
			silent: opts.silent,
			chunkCount: sentChunkCount
		});
		const receipt = buildTelegramTextSendReceipt({
			messageIds,
			chatId: lastChatId,
			messageThreadId: lastAcceptedParams?.message_thread_id,
			replyToMessageId: acceptedReplyToMessageId
		});
		return {
			messageId: lastMessageId,
			chatId: lastChatId,
			...receipt ? { receipt } : {}
		};
	};
	const buildChunkedTextPlan = (rawText, context) => {
		if (textMode === "markdown") return markdownToTelegramChunks(rawText, 4e3, { tableMode }).map((chunk) => ({
			htmlText: chunk.html,
			plainText: telegramHtmlToPlainTextFallback(chunk.html)
		}));
		const htmlText = renderHtmlText(rawText);
		const fallbackText = telegramHtmlToPlainTextFallback(htmlText);
		let htmlChunks;
		try {
			htmlChunks = splitTelegramHtmlChunks(htmlText, 4e3);
		} catch (error) {
			logVerbose(`telegram ${context} failed HTML chunk planning, retrying as plain text: ${formatErrorMessage(error)}`);
			return splitTelegramPlainTextChunks(fallbackText, 4e3).map((plainText) => ({ plainText }));
		}
		const fixedPlainTextChunks = splitTelegramPlainTextChunks(fallbackText, 4e3);
		if (fixedPlainTextChunks.length > htmlChunks.length) {
			logVerbose(`telegram ${context} plain-text fallback needs more chunks than HTML; sending plain text`);
			return fixedPlainTextChunks.map((plainText) => ({ plainText }));
		}
		return htmlChunks.map((htmlTextLocal) => ({
			htmlText: htmlTextLocal,
			plainText: telegramHtmlToPlainTextFallback(htmlTextLocal)
		}));
	};
	const sendChunkedText = async (rawText, context, options = {}) => {
		try {
			return useRichMessages ? await sendTelegramRichTextChunks(buildRichTextPlan(rawText), context, options) : await sendTelegramTextChunks(buildChunkedTextPlan(rawText, context), context, options);
		} catch (error) {
			opts.promptContextProjectionPlan?.cursor.invalidate();
			throw error;
		}
	};
	const buildRichTextPlan = (rawText) => {
		return splitTelegramRichMessageTextChunks({
			text: rawText,
			textLimit: Math.min(resolveTextChunkLimit(cfg, "telegram", account.accountId, { fallbackLimit: TELEGRAM_RICH_TEXT_LIMIT }), TELEGRAM_RICH_TEXT_LIMIT),
			tableMode,
			skipEntityDetection: account.config.linkPreview === false
		});
	};
	const sendTelegramRichTextChunks = async (chunks, context, options = {}) => {
		const richRawApi = getTelegramRichRawApi(api);
		let lastMessageId = "";
		let lastChatId = chatId;
		let lastAcceptedParams;
		let acceptedReplyToMessageId;
		const messageIds = [];
		let sentChunkCount = 0;
		for (let index = 0; index < chunks.length; index += 1) {
			const chunk = chunks[index];
			if (!chunk) continue;
			const acceptedParams = buildRichTextParams(index, chunks.length, index === chunks.length - 1, options.replyToAlreadyUsed === true);
			let result;
			let recordedParams;
			if (isEmptyTelegramRichMessage(chunk.richMessage)) {
				sendLogger.warn("telegram richMessage chunk rendered empty; skipping");
				continue;
			}
			try {
				warnTelegramRichBlocksDegradations({
					context: "richMessage",
					reasons: chunk.degradationReasons,
					warn: (message) => sendLogger.warn(message)
				});
				const richResult = await withTelegramNativeQuoteFallback({
					label: "richMessage",
					requestParams: acceptedParams ?? {},
					removeNativeQuoteParam: removeTelegramRichNativeQuoteParam,
					request: (effectiveParams, retryLabel) => requestWithChatNotFound(() => richRawApi.sendRichMessage({
						chat_id: chatId,
						rich_message: chunk.richMessage,
						...effectiveParams,
						...opts.silent === true ? { disable_notification: true } : {}
					}), retryLabel)
				});
				result = richResult.result;
				recordedParams = toTelegramRichMessageContextParams(richResult.acceptedParams);
			} catch (err) {
				const fallbackPlan = buildTelegramPlainFallbackPlan({
					plainText: chunk.plainText,
					err,
					context: "richMessage",
					warn: (message) => sendLogger.warn(message)
				});
				if (!fallbackPlan) throw err;
				const fallbackChunks = fallbackPlan.chunks;
				const fallbackReplyChunkCount = Math.max(chunks.length, fallbackChunks.length);
				for (let fallbackIndex = 0; fallbackIndex < fallbackChunks.length; fallbackIndex += 1) {
					const fallbackText = fallbackChunks[fallbackIndex] ?? "";
					const fallbackReplyIndex = chunks.length === 1 ? fallbackIndex : index;
					const fallbackParams = buildTextParams(fallbackReplyIndex, fallbackReplyChunkCount, index === chunks.length - 1 && fallbackIndex === fallbackChunks.length - 1, options.replyToAlreadyUsed === true);
					const plainResult = await sendTelegramTextChunk({ plainText: fallbackText }, fallbackParams);
					const fallbackMessageId = resolveTelegramMessageIdOrThrow(plainResult.result, context);
					recordSentMessage(chatId, fallbackMessageId, cfg);
					await reportDelivery(fallbackMessageId, plainResult.result?.chat?.id ?? chatId, {
						telegramDeliveredText: fallbackText,
						telegramHasInlineKeyboard: index === chunks.length - 1 && fallbackIndex === fallbackChunks.length - 1 && Boolean(replyMarkup)
					});
					await recordDeliveredPromptContext({
						message: plainResult.result,
						messageId: fallbackMessageId,
						text: fallbackText,
						...plainResult.acceptedParams?.message_thread_id !== void 0 ? { messageThreadId: plainResult.acceptedParams.message_thread_id } : {}
					}, index === chunks.length - 1 && fallbackIndex === fallbackChunks.length - 1);
					lastMessageId = String(fallbackMessageId);
					lastChatId = String(plainResult.result?.chat?.id ?? chatId);
					lastAcceptedParams = plainResult.acceptedParams;
					acceptedReplyToMessageId ??= resolveAcceptedReplyToMessageId(plainResult.acceptedParams);
					messageIds.push(lastMessageId);
					sentChunkCount += 1;
				}
				continue;
			}
			const messageId = resolveTelegramMessageIdOrThrow(result, context);
			recordSentMessage(chatId, messageId, cfg);
			await reportDelivery(messageId, result?.chat?.id ?? chatId, {
				telegramDeliveredText: chunk.plainText,
				telegramHasInlineKeyboard: index === chunks.length - 1 && Boolean(replyMarkup)
			});
			await recordDeliveredPromptContext({
				message: result,
				messageId,
				text: chunk.plainText,
				...recordedParams?.message_thread_id !== void 0 ? { messageThreadId: recordedParams.message_thread_id } : {}
			}, index === chunks.length - 1);
			lastMessageId = String(messageId);
			lastChatId = String(result?.chat?.id ?? chatId);
			lastAcceptedParams = recordedParams;
			acceptedReplyToMessageId ??= resolveAcceptedReplyToMessageId(recordedParams);
			messageIds.push(lastMessageId);
			sentChunkCount += 1;
		}
		if (lastMessageId) logTelegramOutboundSendOk({
			accountId: account.accountId,
			chatId: lastChatId,
			messageId: lastMessageId,
			operation: "sendRichMessage",
			deliveryKind: "text",
			messageThreadId: lastAcceptedParams?.message_thread_id,
			replyToMessageId: opts.replyToMessageId,
			silent: opts.silent,
			chunkCount: sentChunkCount
		});
		const receipt = buildTelegramTextSendReceipt({
			messageIds,
			chatId: lastChatId,
			messageThreadId: lastAcceptedParams?.message_thread_id,
			replyToMessageId: acceptedReplyToMessageId
		});
		return {
			messageId: lastMessageId,
			chatId: lastChatId,
			...receipt ? { receipt } : {}
		};
	};
	async function shouldSendTelegramImageAsPhoto(buffer) {
		try {
			const metadata = await getImageMetadata(buffer);
			const width = metadata?.width;
			const height = metadata?.height;
			if (typeof width !== "number" || typeof height !== "number") {
				sendLogger.warn("Photo dimensions are unavailable. Sending as document instead.");
				return false;
			}
			const shorterSide = Math.min(width, height);
			const longerSide = Math.max(width, height);
			if (!(width + height <= MAX_TELEGRAM_PHOTO_DIMENSION_SUM && shorterSide > 0 && longerSide <= shorterSide * MAX_TELEGRAM_PHOTO_ASPECT_RATIO)) {
				sendLogger.warn(`Photo dimensions (${width}x${height}) are not valid for Telegram photos. Sending as document instead.`);
				return false;
			}
			return true;
		} catch (err) {
			sendLogger.warn(`Failed to validate photo dimensions: ${formatErrorMessage(err)}. Sending as document instead.`);
			return false;
		}
	}
	if (mediaUrl) {
		const media = await loadWebMedia(mediaUrl, buildOutboundMediaLoadOptions({
			maxBytes: mediaMaxBytes,
			mediaLocalRoots: opts.mediaLocalRoots,
			mediaReadFile: opts.mediaReadFile,
			optimizeImages: opts.forceDocument ? false : void 0
		}));
		const kind = kindFromMime(media.contentType ?? void 0);
		const isGif = isGifMedia({
			contentType: media.contentType,
			fileName: media.fileName
		});
		let sendImageAsPhoto = true;
		const deliveryKind = opts.forceDocument === true && (kind === "image" || kind === "video") ? "document" : kind;
		if (opts.asVideoNote === true && deliveryKind !== "video") throw new Error("Telegram video notes require video media.");
		if (deliveryKind === "image" && !isGif) sendImageAsPhoto = await shouldSendTelegramImageAsPhoto(media.buffer);
		const isVideoNote = deliveryKind === "video" && opts.asVideoNote === true;
		const fileName = media.fileName ?? (isGif ? "animation.gif" : inferFilename(kind ?? "document")) ?? "file";
		const file = new InputFileCtor(media.buffer, fileName);
		let caption;
		let followUpText;
		if (isVideoNote) {
			caption = void 0;
			followUpText = text.trim() ? text : void 0;
		} else {
			const split = splitTelegramCaption(text);
			caption = split.caption;
			followUpText = split.followUpText;
		}
		const htmlCaption = caption ? renderHtmlText(caption) : void 0;
		const plainCaption = caption && textMode === "html" ? telegramHtmlToPlainTextFallback(caption) : caption;
		const needsSeparateText = Boolean(followUpText);
		const mediaThreadParams = buildThreadParams(true);
		const mediaUsedReplyTo = resolveAcceptedReplyToMessageId(mediaThreadParams) !== void 0;
		const baseMediaParams = {
			...mediaThreadParams,
			...!needsSeparateText && replyMarkup ? { reply_markup: replyMarkup } : {}
		};
		const videoDimensions = deliveryKind === "video" && !isVideoNote ? await probeVideoDimensions(media.buffer) : void 0;
		const mediaParams = {
			...htmlCaption ? {
				caption: htmlCaption,
				parse_mode: "HTML"
			} : {},
			...baseMediaParams,
			...opts.silent === true ? { disable_notification: true } : {},
			...videoDimensions ? {
				width: videoDimensions.width,
				height: videoDimensions.height
			} : {}
		};
		const plainMediaParams = {
			...plainCaption ? { caption: plainCaption } : {},
			...baseMediaParams,
			...opts.silent === true ? { disable_notification: true } : {},
			...videoDimensions ? {
				width: videoDimensions.width,
				height: videoDimensions.height
			} : {}
		};
		const sendMedia = async (label, sender) => {
			const requestMedia = (requestParams, retryLabel) => withTelegramNativeQuoteFallback({
				label: retryLabel,
				requestParams,
				request: (effectiveParams, effectiveLabel) => requestWithChatNotFound(() => sender(effectiveParams), effectiveLabel)
			});
			if (!htmlCaption || !plainCaption) return await requestMedia(mediaParams, label);
			return await withTelegramHtmlParseFallback({
				label,
				verbose: opts.verbose,
				requestHtml: (retryLabel) => requestMedia(mediaParams, retryLabel),
				requestPlain: (retryLabel) => requestMedia(plainMediaParams, retryLabel)
			});
		};
		const mediaSender = (() => {
			if (isGif && deliveryKind !== "document") return {
				label: "animation",
				sender: (effectiveParams) => api.sendAnimation(chatId, file, effectiveParams)
			};
			if (deliveryKind === "image" && !isGif && sendImageAsPhoto) return {
				label: "photo",
				sender: (effectiveParams) => api.sendPhoto(chatId, file, effectiveParams)
			};
			if (deliveryKind === "video") {
				if (isVideoNote) return {
					label: "video_note",
					sender: (effectiveParams) => api.sendVideoNote(chatId, file, effectiveParams)
				};
				return {
					label: "video",
					sender: (effectiveParams) => api.sendVideo(chatId, file, effectiveParams)
				};
			}
			if (kind === "audio") {
				const { useVoice } = resolveTelegramVoiceSend({
					wantsVoice: opts.asVoice === true,
					contentType: media.contentType,
					fileName,
					logFallback: logVerbose
				});
				if (useVoice) return {
					label: "voice",
					sender: (effectiveParams) => api.sendVoice(chatId, file, effectiveParams)
				};
				return {
					label: "audio",
					sender: (effectiveParams) => api.sendAudio(chatId, file, effectiveParams)
				};
			}
			return {
				label: "document",
				sender: (effectiveParams) => api.sendDocument(chatId, file, opts.forceDocument ? {
					...effectiveParams,
					disable_content_type_detection: true
				} : effectiveParams)
			};
		})();
		let mediaDelivery;
		try {
			mediaDelivery = await sendMedia(mediaSender.label, mediaSender.sender);
		} catch (error) {
			opts.promptContextProjectionPlan?.cursor.invalidate();
			throw error;
		}
		const result = mediaDelivery.result;
		const acceptedMediaParams = toAcceptedThreadScopedParams(mediaDelivery.acceptedParams);
		const mediaMessageId = resolveTelegramMessageIdOrThrow(result, "media send");
		const resolvedChatId = String(result?.chat?.id ?? chatId);
		recordSentMessage(chatId, mediaMessageId, cfg);
		await reportDelivery(mediaMessageId, resolvedChatId, {
			...caption ? { telegramDeliveredText: caption } : {},
			telegramHasInlineKeyboard: !needsSeparateText && Boolean(replyMarkup)
		});
		await recordDeliveredPromptContext({
			message: result,
			messageId: mediaMessageId,
			...caption ? { text: caption } : {},
			...acceptedMediaParams?.message_thread_id !== void 0 ? { messageThreadId: acceptedMediaParams.message_thread_id } : {}
		}, !needsSeparateText);
		logTelegramOutboundSendOk({
			accountId: account.accountId,
			chatId: resolvedChatId,
			messageId: String(mediaMessageId),
			operation: `send${mediaSender.label.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`,
			deliveryKind: mediaSender.label,
			messageThreadId: acceptedMediaParams?.message_thread_id,
			replyToMessageId: opts.replyToMessageId,
			silent: opts.silent
		});
		recordChannelActivity({
			channel: "telegram",
			accountId: account.accountId,
			direction: "outbound"
		});
		if (needsSeparateText && followUpText) return {
			...await sendChunkedText(followUpText, "text follow-up send", { replyToAlreadyUsed: singleUseReplyTo && mediaUsedReplyTo }),
			chatId: resolvedChatId
		};
		return {
			messageId: String(mediaMessageId),
			chatId: resolvedChatId
		};
	}
	if (!text || !text.trim()) throw new Error("Message must be non-empty for Telegram sends");
	const textResult = await sendChunkedText(text, "text send");
	recordChannelActivity({
		channel: "telegram",
		accountId: account.accountId,
		direction: "outbound"
	});
	return textResult;
}
/** Send a standalone location pin or named venue through Telegram's native payload. */
async function sendLocationTelegram(to, input, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, sendLocationTelegramWithContext(to, input, opts, context));
}
async function sendLocationTelegramWithContext(to, input, opts, context) {
	const location = normalizeOutboundLocation(input);
	if (!location) throw new Error("Telegram location is required.");
	const hasName = Boolean(location.name);
	if (hasName !== Boolean(location.address)) throw new Error("Telegram venues require both location.name and location.address.");
	const { cfg, account, api } = context;
	const botUserId = resolveTelegramBotUserIdFromToken(opts.token || account.token);
	const target = parseTelegramTarget(to);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: target.chatId,
		persistTarget: to,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const threadParams = buildTelegramThreadReplyParams({
		thread: resolveTelegramSendThreadSpec({
			targetMessageThreadId: target.messageThreadId,
			messageThreadId: opts.messageThreadId,
			chatType: target.chatType
		}),
		replyToMessageId: opts.replyToMessageId,
		replyQuoteText: opts.quoteText,
		useReplyIdAsQuoteSource: true
	});
	const replyMarkup = buildInlineKeyboard(opts.buttons);
	const commonParams = {
		...threadParams,
		...replyMarkup ? { reply_markup: replyMarkup } : {},
		...opts.silent === true ? { disable_notification: true } : {}
	};
	const requestWithChatNotFound = createRequestWithChatNotFound({
		requestWithDiag: createTelegramNonIdempotentRequestWithDiag({
			cfg,
			account,
			retry: opts.retry,
			verbose: opts.verbose
		}),
		chatId,
		input: to
	});
	const label = hasName ? "venue" : "location";
	const delivery = await withTelegramNativeQuoteFallback({
		label,
		requestParams: commonParams,
		request: (effectiveParams, retryLabel) => requestWithChatNotFound(() => hasName ? api.sendVenue(chatId, location.latitude, location.longitude, location.name ?? "", location.address ?? "", effectiveParams) : api.sendLocation(chatId, location.latitude, location.longitude, {
			...effectiveParams,
			...location.accuracy !== void 0 ? { horizontal_accuracy: location.accuracy } : {}
		}), retryLabel)
	});
	const result = delivery.result;
	const acceptedParams = toAcceptedThreadScopedParams(delivery.acceptedParams);
	const messageId = resolveTelegramMessageIdOrThrow(result, `${label} send`);
	const resolvedChatId = String(result?.chat?.id ?? chatId);
	recordSentMessage(chatId, messageId, cfg);
	await opts.onDeliveryResult?.({
		messageId: String(messageId),
		chatId: resolvedChatId
	});
	const projectionPlan = opts.promptContextProjectionPlan;
	const projection = projectionPlan?.cursor.take(projectionPlan.finalPart);
	const recorded = await recordOutboundMessageForPromptContext({
		cfg,
		account,
		...botUserId !== void 0 ? { botUserId } : {},
		chatId,
		message: result,
		messageId,
		text: formatLocationText(location),
		...acceptedParams?.message_thread_id !== void 0 ? { messageThreadId: acceptedParams.message_thread_id } : {},
		promptContextProjection: projection
	});
	if (projection && !recorded) projectionPlan?.cursor.invalidate();
	logTelegramOutboundSendOk({
		accountId: account.accountId,
		chatId: resolvedChatId,
		messageId: String(messageId),
		operation: hasName ? "sendVenue" : "sendLocation",
		deliveryKind: label,
		messageThreadId: acceptedParams?.message_thread_id,
		replyToMessageId: opts.replyToMessageId,
		silent: opts.silent
	});
	recordChannelActivity({
		channel: "telegram",
		accountId: account.accountId,
		direction: "outbound"
	});
	return {
		messageId: String(messageId),
		chatId: resolvedChatId
	};
}
async function sendTypingTelegram(to, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, sendTypingTelegramWithContext(to, opts, context));
}
async function sendTypingTelegramWithContext(to, opts, context) {
	const { cfg, account, api } = context;
	const target = parseTelegramTarget(to);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: target.chatId,
		persistTarget: to,
		verbose: opts.verbose
	});
	const requestWithDiag = createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose,
		shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "action" })
	});
	const threadParams = buildTypingThreadParams(target.messageThreadId ?? opts.messageThreadId);
	await requestWithDiag(() => api.sendChatAction(chatId, "typing", threadParams), "typing");
	return { ok: true };
}
async function reactMessageTelegram(chatIdInput, messageIdInput, emoji, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, reactMessageTelegramWithContext(chatIdInput, messageIdInput, emoji, opts, context));
}
async function reactMessageTelegramWithContext(chatIdInput, messageIdInput, emoji, opts, context) {
	const { cfg, account, api } = context;
	const rawTarget = String(chatIdInput);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: rawTarget,
		persistTarget: rawTarget,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const messageId = normalizeMessageId(messageIdInput);
	const requestWithDiag = createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose,
		shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "react" })
	});
	const remove = opts.remove === true;
	const trimmedEmoji = emoji.trim();
	const reactions = remove || !trimmedEmoji ? [] : [{
		type: "emoji",
		emoji: trimmedEmoji
	}];
	if (typeof api.setMessageReaction !== "function") throw new Error("Telegram reactions are unavailable in this bot API.");
	try {
		await requestWithDiag(() => api.setMessageReaction(chatId, messageId, reactions), "reaction");
	} catch (err) {
		const msg = formatErrorMessage(err);
		if (/REACTION_INVALID/i.test(msg)) return {
			ok: false,
			warning: `Reaction unavailable: ${trimmedEmoji}`
		};
		throw err;
	}
	return { ok: true };
}
async function deleteMessageTelegram(chatIdInput, messageIdInput, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, deleteMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context));
}
async function deleteMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context) {
	const { cfg, account, api } = context;
	const rawTarget = String(chatIdInput);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: rawTarget,
		persistTarget: rawTarget,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const messageId = normalizeMessageId(messageIdInput);
	const requestWithDiag = createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose,
		shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "delete" })
	});
	try {
		await requestWithDiag(() => api.deleteMessage(chatId, messageId), "deleteMessage", { shouldLog: (err) => !isTelegramMessageDeleteNoopError(err) });
	} catch (err) {
		if (!isTelegramMessageDeleteNoopError(err)) throw err;
		const detail = formatErrorMessage(err);
		logVerbose(`[telegram] Delete skipped for message ${messageId} in chat ${chatId}: ${detail}`);
		return {
			ok: false,
			warning: `Message ${messageId} was not deleted: ${detail}`
		};
	}
	logVerbose(`[telegram] Deleted message ${messageId} from chat ${chatId}`);
	return { ok: true };
}
async function pinMessageTelegram(chatIdInput, messageIdInput, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, pinMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context));
}
async function pinMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context) {
	const { cfg, account, api } = context;
	const rawTarget = String(chatIdInput);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: rawTarget,
		persistTarget: rawTarget,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const messageId = normalizeMessageId(messageIdInput);
	await createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose
	})(() => api.pinChatMessage(chatId, messageId, { disable_notification: opts.notify !== true }), "pinChatMessage");
	logVerbose(`[telegram] Pinned message ${messageId} in chat ${chatId}`);
	return {
		ok: true,
		messageId: String(messageId),
		chatId
	};
}
async function unpinMessageTelegram(chatIdInput, messageIdInput, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, unpinMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context));
}
async function unpinMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context) {
	const { cfg, account, api } = context;
	const rawTarget = String(chatIdInput);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: rawTarget,
		persistTarget: rawTarget,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const messageId = messageIdInput === void 0 ? void 0 : normalizeMessageId(messageIdInput);
	await createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose
	})(() => api.unpinChatMessage(chatId, messageId), "unpinChatMessage");
	logVerbose(`[telegram] Unpinned ${messageId != null ? `message ${messageId}` : "active message"} in chat ${chatId}`);
	return {
		ok: true,
		chatId,
		...messageId != null ? { messageId: String(messageId) } : {}
	};
}
async function editForumTopicTelegram(chatIdInput, messageThreadIdInput, opts) {
	const nameProvided = opts.name !== void 0;
	const trimmedName = opts.name?.trim();
	if (nameProvided && !trimmedName) throw new Error("Telegram forum topic name is required");
	if (trimmedName && trimmedName.length > 128) throw new Error("Telegram forum topic name must be 128 characters or fewer");
	const iconProvided = opts.iconCustomEmojiId !== void 0;
	const trimmedIconCustomEmojiId = opts.iconCustomEmojiId?.trim();
	if (iconProvided && !trimmedIconCustomEmojiId) throw new Error("Telegram forum topic icon custom emoji ID is required");
	if (!trimmedName && !trimmedIconCustomEmojiId) throw new Error("Telegram forum topic update requires a name or iconCustomEmojiId");
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, editForumTopicTelegramWithContext(chatIdInput, messageThreadIdInput, opts, context));
}
async function editForumTopicTelegramWithContext(chatIdInput, messageThreadIdInput, opts, context) {
	const trimmedName = opts.name?.trim();
	const trimmedIconCustomEmojiId = opts.iconCustomEmojiId?.trim();
	const { cfg, account, api } = context;
	const rawTarget = String(chatIdInput);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: parseTelegramTarget(rawTarget).chatId,
		persistTarget: rawTarget,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const messageThreadId = normalizeMessageId(messageThreadIdInput);
	const requestWithDiag = createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose
	});
	const payload = {
		...trimmedName ? { name: trimmedName } : {},
		...trimmedIconCustomEmojiId ? { icon_custom_emoji_id: trimmedIconCustomEmojiId } : {}
	};
	await requestWithDiag(() => api.editForumTopic(chatId, messageThreadId, payload), "editForumTopic");
	logVerbose(`[telegram] Edited forum topic ${messageThreadId} in chat ${chatId}`);
	return {
		ok: true,
		chatId,
		messageThreadId,
		...trimmedName ? { name: trimmedName } : {},
		...trimmedIconCustomEmojiId ? { iconCustomEmojiId: trimmedIconCustomEmojiId } : {}
	};
}
async function renameForumTopicTelegram(chatIdInput, messageThreadIdInput, name, opts) {
	const result = await editForumTopicTelegram(chatIdInput, messageThreadIdInput, {
		...opts,
		name
	});
	return {
		ok: true,
		chatId: result.chatId,
		messageThreadId: result.messageThreadId,
		name: result.name ?? name.trim()
	};
}
async function editMessageReplyMarkupTelegram(chatIdInput, messageIdInput, buttons, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, editMessageReplyMarkupTelegramWithContext(chatIdInput, messageIdInput, buttons, opts, context));
}
async function editMessageReplyMarkupTelegramWithContext(chatIdInput, messageIdInput, buttons, opts, context) {
	const { cfg, account, api } = context;
	const rawTarget = String(chatIdInput);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: rawTarget,
		persistTarget: rawTarget,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const messageId = normalizeMessageId(messageIdInput);
	const requestWithDiag = createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose
	});
	const replyMarkup = buildInlineKeyboard(buttons) ?? { inline_keyboard: [] };
	try {
		await requestWithDiag(() => api.editMessageReplyMarkup(chatId, messageId, { reply_markup: replyMarkup }), "editMessageReplyMarkup", { shouldLog: (err) => !isTelegramMessageNotModifiedError(err) });
	} catch (err) {
		if (!isTelegramMessageNotModifiedError(err)) throw err;
	}
	logVerbose(`[telegram] Edited reply markup for message ${messageId} in chat ${chatId}`);
	return {
		ok: true,
		messageId: String(messageId),
		chatId
	};
}
async function editMessageTelegram(chatIdInput, messageIdInput, text, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, editMessageTelegramWithContext(chatIdInput, messageIdInput, text, opts, context));
}
async function editMessageTelegramWithContext(chatIdInput, messageIdInput, text, opts, context) {
	const { cfg, account, api } = context;
	const rawTarget = String(chatIdInput);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: rawTarget,
		persistTarget: rawTarget,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const messageId = normalizeMessageId(messageIdInput);
	const requestWithDiag = createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose,
		shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "edit" }) || isTelegramServerError(err)
	});
	const requestWithEditShouldLog = (fn, label, shouldLog) => requestWithDiag(fn, label, shouldLog ? { shouldLog } : void 0);
	const textMode = opts.textMode ?? "markdown";
	const useRichMessages = account.config.richMessages === true && textMode !== "html";
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "telegram",
		accountId: account.accountId,
		supportsBlockTables: useRichMessages
	});
	const htmlText = renderTelegramHtmlText(text, {
		textMode,
		tableMode
	});
	const plainText = textMode === "html" ? telegramHtmlToPlainTextFallback(htmlText) : text;
	const richRawApi = useRichMessages ? getTelegramRichRawApi(api) : void 0;
	const richMessagePlan = useRichMessages ? buildTelegramRichMarkdownPlan(text, {
		skipEntityDetection: opts.linkPreview === false,
		tableMode
	}) : void 0;
	const shouldTouchButtons = opts.buttons !== void 0;
	const builtKeyboard = shouldTouchButtons ? buildInlineKeyboard(opts.buttons) : void 0;
	const replyMarkup = shouldTouchButtons ? builtKeyboard ?? { inline_keyboard: [] } : void 0;
	const textEditParams = { parse_mode: "HTML" };
	if (opts.linkPreview === false) textEditParams.link_preview_options = { is_disabled: true };
	if (replyMarkup !== void 0) textEditParams.reply_markup = replyMarkup;
	const plainTextParams = {};
	if (opts.linkPreview === false) plainTextParams.link_preview_options = { is_disabled: true };
	if (replyMarkup !== void 0) plainTextParams.reply_markup = replyMarkup;
	const captionEditParams = {
		caption: htmlText,
		parse_mode: "HTML"
	};
	if (replyMarkup !== void 0) captionEditParams.reply_markup = replyMarkup;
	const plainCaptionParams = { caption: plainText };
	if (replyMarkup !== void 0) plainCaptionParams.reply_markup = replyMarkup;
	const performTextEdit = () => {
		if (richRawApi && richMessagePlan) {
			const richEditParams = replyMarkup === void 0 ? {} : { reply_markup: replyMarkup };
			warnTelegramRichBlocksDegradations({
				context: "editMessage",
				reasons: richMessagePlan.degradationReasons,
				warn: (message) => sendLogger.warn(message)
			});
			return requestWithEditShouldLog(() => richRawApi.editMessageText({
				chat_id: chatId,
				message_id: messageId,
				rich_message: richMessagePlan.richMessage,
				...richEditParams
			}), "editMessage", (err) => !isTelegramMessageNotModifiedError(err)).catch((err) => {
				const fallbackPlan = buildTelegramPlainFallbackPlan({
					plainText: richMessagePlan.plainText,
					err,
					context: "editMessage",
					warn: (message) => sendLogger.warn(message)
				});
				if (!fallbackPlan) throw err;
				return requestWithEditShouldLog(() => Object.keys(plainTextParams).length > 0 ? api.editMessageText(chatId, messageId, fallbackPlan.plainText, plainTextParams) : api.editMessageText(chatId, messageId, fallbackPlan.plainText), "editMessage-plain", (plainErr) => !isTelegramMessageNotModifiedError(plainErr));
			});
		}
		return withTelegramHtmlParseFallback({
			label: "editMessage",
			verbose: opts.verbose,
			requestHtml: (retryLabel) => requestWithEditShouldLog(() => api.editMessageText(chatId, messageId, htmlText, textEditParams), retryLabel, (err) => !isTelegramMessageNotModifiedError(err)),
			requestPlain: (retryLabel) => requestWithEditShouldLog(() => Object.keys(plainTextParams).length > 0 ? api.editMessageText(chatId, messageId, plainText, plainTextParams) : api.editMessageText(chatId, messageId, plainText), retryLabel, (plainErr) => !isTelegramMessageNotModifiedError(plainErr))
		});
	};
	const performCaptionEdit = () => withTelegramHtmlParseFallback({
		label: "editMessageCaption",
		verbose: opts.verbose,
		requestHtml: (retryLabel) => requestWithEditShouldLog(() => api.editMessageCaption(chatId, messageId, captionEditParams), retryLabel, (err) => !isTelegramMessageNotModifiedError(err)),
		requestPlain: (retryLabel) => requestWithEditShouldLog(() => api.editMessageCaption(chatId, messageId, plainCaptionParams), retryLabel, (plainErr) => !isTelegramMessageNotModifiedError(plainErr))
	});
	try {
		const editMode = opts.editMode ?? "text";
		if (editMode === "caption") await performCaptionEdit();
		else try {
			await performTextEdit();
		} catch (err) {
			if (editMode === "auto" && isTelegramMessageHasNoTextError(err)) await performCaptionEdit();
			else throw err;
		}
	} catch (err) {
		if (isTelegramMessageNotModifiedError(err)) {} else throw err;
	}
	logVerbose(`[telegram] Edited message ${messageId} in chat ${chatId}`);
	return {
		ok: true,
		messageId: String(messageId),
		chatId
	};
}
function inferFilename(kind) {
	switch (kind) {
		case "image": return "image.jpg";
		case "video": return "video.mp4";
		case "audio": return "audio.ogg";
		default: return "file.bin";
	}
}
/**
* Send a sticker to a Telegram chat by file_id.
* @param to - Chat ID or username (e.g., "123456789" or "@username")
* @param fileId - Telegram file_id of the sticker to send
* @param opts - Optional configuration
*/
async function sendStickerTelegram(to, fileId, opts) {
	if (!fileId?.trim()) throw new Error("Telegram sticker file_id is required");
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, sendStickerTelegramWithContext(to, fileId, opts, context));
}
async function sendStickerTelegramWithContext(to, fileId, opts, context) {
	const { cfg, account, api } = context;
	const target = parseTelegramTarget(to);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: target.chatId,
		persistTarget: to,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const threadParams = buildTelegramThreadReplyParams({
		thread: resolveTelegramSendThreadSpec({
			targetMessageThreadId: target.messageThreadId,
			messageThreadId: opts.messageThreadId,
			chatType: target.chatType
		}),
		replyToMessageId: opts.replyToMessageId
	});
	const hasThreadParams = Object.keys(threadParams).length > 0;
	const requestWithChatNotFound = createRequestWithChatNotFound({
		requestWithDiag: createTelegramNonIdempotentRequestWithDiag({
			cfg,
			account,
			retry: opts.retry,
			verbose: opts.verbose,
			useApiErrorLogging: false
		}),
		chatId,
		input: to
	});
	const stickerParams = hasThreadParams ? threadParams : void 0;
	const result = await requestWithChatNotFound(() => api.sendSticker(chatId, fileId.trim(), stickerParams), "sticker");
	const messageId = resolveTelegramMessageIdOrThrow(result, "sticker send");
	const resolvedChatId = String(result?.chat?.id ?? chatId);
	recordSentMessage(chatId, messageId, opts.cfg);
	recordChannelActivity({
		channel: "telegram",
		accountId: account.accountId,
		direction: "outbound"
	});
	return {
		messageId: String(messageId),
		chatId: resolvedChatId
	};
}
/**
* Send a poll to a Telegram chat.
* @param to - Chat ID or username (e.g., "123456789" or "@username")
* @param poll - Poll input with question, options, maxSelections, and optional durationHours
* @param opts - Optional configuration
*/
async function sendPollTelegram(to, poll, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, sendPollTelegramWithContext(to, poll, opts, context));
}
async function sendPollTelegramWithContext(to, poll, opts, context) {
	const { cfg, account, api } = context;
	const target = parseTelegramTarget(to);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: target.chatId,
		persistTarget: to,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const normalizedPoll = normalizePollInput(poll, { maxOptions: 12 });
	const threadParams = buildTelegramThreadReplyParams({
		thread: resolveTelegramSendThreadSpec({
			targetMessageThreadId: target.messageThreadId,
			messageThreadId: opts.messageThreadId,
			chatType: target.chatType
		}),
		replyToMessageId: opts.replyToMessageId
	});
	const pollOptions = normalizedPoll.options;
	const requestWithChatNotFound = createRequestWithChatNotFound({
		requestWithDiag: createTelegramNonIdempotentRequestWithDiag({
			cfg,
			account,
			retry: opts.retry,
			verbose: opts.verbose
		}),
		chatId,
		input: to
	});
	const durationSeconds = normalizedPoll.durationSeconds;
	if (durationSeconds === void 0 && normalizedPoll.durationHours !== void 0) throw new Error("Telegram poll durationHours is not supported. Use durationSeconds (5-600) instead.");
	if (durationSeconds !== void 0 && (durationSeconds < 5 || durationSeconds > 600)) throw new Error("Telegram poll durationSeconds must be between 5 and 600");
	const pollParams = {
		allows_multiple_answers: normalizedPoll.maxSelections > 1,
		is_anonymous: opts.isAnonymous ?? true,
		...durationSeconds !== void 0 ? { open_period: durationSeconds } : {},
		...Object.keys(threadParams).length > 0 ? threadParams : {},
		...opts.silent === true ? { disable_notification: true } : {}
	};
	const result = await requestWithChatNotFound(() => api.sendPoll(chatId, normalizedPoll.question, pollOptions, pollParams), "poll");
	const messageId = resolveTelegramMessageIdOrThrow(result, "poll send");
	const resolvedChatId = String(result?.chat?.id ?? chatId);
	const pollId = result?.poll?.id;
	recordSentMessage(chatId, messageId, opts.cfg);
	recordChannelActivity({
		channel: "telegram",
		accountId: account.accountId,
		direction: "outbound"
	});
	return {
		messageId: String(messageId),
		chatId: resolvedChatId,
		pollId
	};
}
/**
* Create a forum topic in a Telegram supergroup.
* Requires the bot to have `can_manage_topics` permission.
*
* @param chatId - Supergroup chat ID
* @param name - Topic name (1-128 characters)
* @param opts - Optional configuration
*/
async function createForumTopicTelegram(chatId, name, opts) {
	if (!name?.trim()) throw new Error("Forum topic name is required");
	if (name.trim().length > 128) throw new Error("Forum topic name must be 128 characters or fewer");
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, createForumTopicTelegramWithContext(chatId, name, opts, context));
}
async function createForumTopicTelegramWithContext(chatId, name, opts, context) {
	const trimmedName = name.trim();
	const { cfg, account, api } = context;
	const normalizedChatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: parseTelegramTarget(chatId).chatId,
		persistTarget: chatId,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const requestWithDiag = createTelegramNonIdempotentRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose
	});
	const extra = {};
	if (opts.iconColor != null) extra.icon_color = opts.iconColor;
	if (opts.iconCustomEmojiId?.trim()) extra.icon_custom_emoji_id = opts.iconCustomEmojiId.trim();
	const hasExtra = Object.keys(extra).length > 0;
	const result = await requestWithDiag(() => api.createForumTopic(normalizedChatId, trimmedName, hasExtra ? extra : void 0), "createForumTopic");
	const topicId = result.message_thread_id;
	recordChannelActivity({
		channel: "telegram",
		accountId: account.accountId,
		direction: "outbound"
	});
	return {
		topicId,
		name: result.name ?? trimmedName,
		chatId: normalizedChatId
	};
}
//#endregion
export { asTelegramClientFetch as $, isTelegramHtmlParseError as A, getTelegramNativeQuoteReplyMessageId as B, isEmptyTelegramRichMessage as C, markdownToTelegramRichBlocks as D, toTelegramRichMessageContextParams as E, inputRichBlocksToPlainText as F, buildTelegramSelfSenderName as G, removeTelegramNativeQuoteParam as H, italicRichText as I, isTelegramSelfSenderName as J, isTelegramChatWindowPromptContext as K, paragraphBlock as L, warnTelegramRichBlocksDegradations as M, boldRichText as N, splitTelegramRichBlocks as O, codeRichText as P, selectTelegramGroupHistoryAfterLastSelf as Q, TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS as R, getTelegramRichRawApi as S, splitTelegramRichMessageTextChunks as T, recordOutboundMessageForPromptContext as U, isTelegramQuoteParamError as V, registerTelegramOutboundGroupHistoryRecorder as W, recordTelegramGroupHistoryEntry as X, mergeTelegramGroupHistoryPromptContext as Y, retainTelegramGroupHistoryPromptContext as Z, resolveTelegramVoiceSend as _, editMessageTelegram as a, withTelegramApiErrorLogging as at, buildTelegramRichMarkdown as b, renameForumTopicTelegram as c, apiThrottler as ct, sendMessageTelegram as d, createTelegramClientFetch as et, sendPollTelegram as f, unpinMessageTelegram as g, splitTelegramPlainTextChunksForTests as h, editMessageReplyMarkupTelegram as i, splitTelegramCaption as it, splitTelegramPlainTextChunks as j, buildTelegramPlainFallbackPlan as k, resetTelegramClientOptionsCacheForTests as l, sequentialize as lt, sendTypingTelegram as m, deleteMessageTelegram as n, resolveTelegramClientTimeoutSeconds as nt, pinMessageTelegram as o, getOrCreateAccountThrottler as ot, sendStickerTelegram as p, isTelegramHistoryEntryAfterAmbientWatermark as q, editForumTopicTelegram as r, resolveTelegramOutboundClientTimeoutFloorSeconds as rt, reactMessageTelegram as s, Bot$1 as st, createForumTopicTelegram as t, resolveTelegramClientTimeoutMinimumSeconds as tt, sendLocationTelegram as u, TELEGRAM_RICH_TEXT_LIMIT as v, removeTelegramRichNativeQuoteParam as w, buildTelegramRichMarkdownPlan as x, buildTelegramRichBlocksPlan as y, buildTelegramSendParams as z };
