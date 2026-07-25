import { t as sleep } from "./sleep-Ce8zcpEF.js";
import { c as kindFromMime } from "./mime-De36NoRj.js";
import { r as stripInlineDirectiveTagsForDelivery } from "./directive-tags-DnwgHzaK.js";
import { n as resolveOutboundAttachmentFromUrl } from "./outbound-attachment-CvXIbees.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-C0uxiauk.js";
import "./media-runtime-BF28IqU8.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-Dnur9SGp.js";
import "./runtime-env-BDC_axp1.js";
import { t as convertMarkdownTables } from "./tables-DsGSc7Wv.js";
import "./text-chunking-CcRmx-1w.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-BM1zBTeF.js";
import "./markdown-table-runtime-DsKAllpK.js";
import "./channel-outbound-D_Kkmr30.js";
import { t as resolveIMessageChatDbLookupPath } from "./cli-path-DLthOk6m.js";
import { n as hasExclusiveIMessageLocalDatabase, o as resolveIMessageAccount } from "./accounts-CQRrUqge.js";
import { c as rememberIMessageReplyCache, f as chatContextFromIMessageTarget } from "./monitor-reply-cache-D1matHtv.js";
import { t as createIMessageRpcClient } from "./client-CXGFfUWX.js";
import { c as parseIMessageTarget, o as normalizeIMessageHandle, t as formatIMessageChatTarget } from "./targets-B8U82l9l.js";
import { p as registerIMessageApprovalReactionTargetForOutboundMessage, r as appendIMessageApprovalReactionHintForOutboundMessage, s as extractIMessageApprovalPromptBinding } from "./approval-reactions-B8WHau0l.js";
import { a as rememberPersistedIMessageEcho, r as forgetPersistedIMessageEchoKey } from "./persisted-echo-cache-BB9qxaU5.js";
import { i as runIMessageCliJsonCommand, n as resolveAuthorizedIMessageReplyReference, r as extractMarkdownFormatRuns } from "./message-resource-CRy51hkt.js";
import { createRequire } from "node:module";
import { accessSync, constants } from "node:fs";
//#region extensions/imessage/src/send.ts
const require = createRequire(import.meta.url);
const MIN_PENDING_PERSISTED_ECHO_TTL_MS = 6e4;
const PENDING_PERSISTED_ECHO_GRACE_MS = 5e3;
function resolveMessageId(result) {
	if (!result) return null;
	const raw = typeof result.messageId === "string" && result.messageId.trim() || typeof result.message_id === "string" && result.message_id.trim() || typeof result.id === "string" && result.id.trim() || typeof result.guid === "string" && result.guid.trim() || (typeof result.message_id === "number" ? String(result.message_id) : null) || (typeof result.id === "number" ? String(result.id) : null);
	return raw ? raw.trim() : null;
}
function resolveOutboundMessageGuid(result) {
	if (!result) return null;
	const candidates = [
		result.guid,
		result.messageId,
		result.message_id,
		result.id
	];
	for (const value of candidates) {
		if (typeof value !== "string") continue;
		const trimmed = value.trim();
		if (trimmed && !/^\d+$/.test(trimmed)) return trimmed;
	}
	return null;
}
function isNumericMessageRowId(value) {
	return typeof value === "string" && /^\d+$/.test(value.trim());
}
function resolveTargetService(target) {
	if (target.kind !== "handle") return;
	if (target.serviceExplicit || target.service !== "auto") return target.service;
}
function normalizeResolvedMessageGuid(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed && !isNumericMessageRowId(trimmed) ? trimmed : null;
}
function loadNodeSqlite() {
	try {
		return require("node:sqlite");
	} catch {
		return null;
	}
}
function resolveMessageGuidFromChatDb(params) {
	const dbPath = params.dbPath?.trim();
	const messageId = params.messageId.trim();
	if (!dbPath || !isNumericMessageRowId(messageId)) return null;
	const sqlite = loadNodeSqlite();
	if (!sqlite) return null;
	let db = null;
	try {
		db = new sqlite.DatabaseSync(dbPath, { readOnly: true });
		return normalizeResolvedMessageGuid(db.prepare("SELECT guid FROM message WHERE ROWID = ?").get(messageId)?.guid);
	} catch {
		return null;
	} finally {
		try {
			db?.close();
		} catch {}
	}
}
function getStringRowValue(row, key) {
	return normalizeResolvedMessageGuid(row?.[key]);
}
function appleMessageDateLowerBoundMs(sentAfterMs) {
	if (!Number.isFinite(sentAfterMs)) return null;
	return Math.max(0, Math.floor((sentAfterMs - 9783072e5 - 5e3) * 1e6));
}
function resolveLatestSentMessageGuidFromChatDb(params) {
	const dbPath = params.dbPath?.trim();
	if (!dbPath) return null;
	const sqlite = loadNodeSqlite();
	if (!sqlite) return null;
	let db = null;
	try {
		db = new sqlite.DatabaseSync(dbPath, { readOnly: true });
		const targetClauses = [];
		const targetParams = [];
		const lowerBound = appleMessageDateLowerBoundMs(params.sentAfterMs);
		if (params.text) {
			targetClauses.push("m.text = ?");
			targetParams.push(params.text);
		}
		if (lowerBound !== null) {
			targetClauses.push("m.date >= ?");
			targetParams.push(lowerBound);
		}
		if (params.target.kind === "chat_id") {
			targetClauses.push("cmj.chat_id = ?");
			targetParams.push(params.target.chatId);
		} else if (params.target.kind === "chat_guid") {
			targetClauses.push("c.guid = ?");
			targetParams.push(params.target.chatGuid);
		} else if (params.target.kind === "chat_identifier") {
			targetClauses.push("c.chat_identifier = ?");
			targetParams.push(params.target.chatIdentifier);
		} else {
			const normalizedHandle = normalizeIMessageHandle(params.target.to);
			targetClauses.push("(h.id = ? OR h.uncanonicalized_id = ?)");
			targetParams.push(normalizedHandle, params.target.to);
		}
		const selectSql = `
      SELECT m.guid
      FROM message m
      LEFT JOIN chat_message_join cmj ON cmj.message_id = m.ROWID
      LEFT JOIN chat c ON c.ROWID = cmj.chat_id
      LEFT JOIN handle h ON h.ROWID = m.handle_id
      WHERE m.is_from_me = 1
      ${targetClauses.length ? `AND ${targetClauses.join(" AND ")}` : ""}
      ORDER BY m.date DESC, m.ROWID DESC
      LIMIT 10
    `;
		return getStringRowValue(db.prepare(selectSql).all(...targetParams)[0], "guid");
	} catch {
		return null;
	} finally {
		try {
			db?.close();
		} catch {}
	}
}
function canResolveLatestSentMessageGuidFromChatDb(dbPath) {
	const normalizedDbPath = dbPath?.trim();
	if (!normalizedDbPath || !loadNodeSqlite()) return false;
	try {
		accessSync(normalizedDbPath, constants.R_OK);
		return true;
	} catch {
		return false;
	}
}
async function resolveApprovalBindingMessageGuid(params) {
	const immediateGuid = resolveOutboundMessageGuid(params.result);
	if (immediateGuid) return immediateGuid;
	const messageId = params.messageId?.trim();
	if (!messageId || !isNumericMessageRowId(messageId)) return null;
	return normalizeResolvedMessageGuid(await (params.resolveMessageGuidImpl ?? resolveMessageGuidFromChatDb)({
		dbPath: params.dbPath,
		messageId
	}));
}
async function resolveFallbackSentMessageGuid(params) {
	const resolver = params.resolveSentMessageGuidImpl ?? resolveLatestSentMessageGuidFromChatDb;
	if (!params.resolveSentMessageGuidImpl && !canResolveLatestSentMessageGuidFromChatDb(params.dbPath)) return null;
	const deadlineMs = Date.now() + 5e3;
	while (Date.now() <= deadlineMs) {
		const resolved = normalizeResolvedMessageGuid(await resolver({
			dbPath: params.dbPath,
			target: params.target,
			text: params.text,
			sentAfterMs: params.sentAfterMs
		}));
		if (resolved) return resolved;
		if (Date.now() >= deadlineMs) return null;
		await sleep(250);
	}
	return null;
}
function shouldRecoverApprovalPromptGuid(params) {
	return !params.filePath && !params.replyToId && Boolean(params.message.trim()) && Boolean(extractIMessageApprovalPromptBinding(params.message));
}
function canCheckSentMessageAfterRpcTimeout(params) {
	return Boolean(params.resolveSentMessageGuidImpl) || canResolveLatestSentMessageGuidFromChatDb(params.dbPath);
}
function resolveOutboundEchoText(text) {
	return text.trim() || void 0;
}
function resolveOutboundEchoMedia(mediaContentType) {
	if (!mediaContentType) return;
	return {
		contentType: mediaContentType,
		kind: kindFromMime(mediaContentType) ?? "unknown"
	};
}
function createIMessageSendReceipt(params) {
	const messageId = params.messageId.trim();
	const results = messageId && messageId !== "unknown" && messageId !== "ok" ? [{
		channel: "imessage",
		messageId,
		meta: { targetKind: params.target.kind }
	}] : [];
	if (results[0]) {
		if (params.target.kind === "chat_id") results[0].chatId = String(params.target.chatId);
		else if (params.target.kind === "chat_guid") results[0].conversationId = params.target.chatGuid;
		else if (params.target.kind === "chat_identifier") results[0].conversationId = params.target.chatIdentifier;
	}
	const receiptParams = {
		results,
		kind: params.kind
	};
	if (params.replyToId) receiptParams.replyToId = params.replyToId;
	return createMessageReceiptFromOutboundResults(receiptParams);
}
function isConcreteIMessageMessageId(messageId) {
	const trimmed = messageId?.trim();
	return Boolean(trimmed && trimmed !== "unknown" && trimmed !== "ok");
}
function canSynthesizeAttachmentChatHandle(raw) {
	const trimmed = raw.trim();
	return trimmed.includes("@") || trimmed.startsWith("+");
}
function resolveOutboundEchoScope(params) {
	if (params.target.kind === "chat_id") return `${params.accountId}:${formatIMessageChatTarget(params.target.chatId)}`;
	if (params.target.kind === "chat_guid") return `${params.accountId}:chat_guid:${params.target.chatGuid}`;
	if (params.target.kind === "chat_identifier") return `${params.accountId}:chat_identifier:${params.target.chatIdentifier}`;
	return `${params.accountId}:imessage:${params.target.to}`;
}
function resolveIMessageCliFailure(result) {
	if (result.success !== false) return null;
	return typeof result.error === "string" && result.error.trim() ? result.error.trim() : "iMessage action failed";
}
function isIMessageRpcSendTimeout(error) {
	const message = error instanceof Error ? error.message : String(error);
	return /imsg rpc timeout \(send\)/i.test(message);
}
async function runIMessageCliJson(cliPath, dbPath, args, timeoutMs) {
	return await runIMessageCliJsonCommand({
		args,
		cliPath,
		dbPath,
		timeoutMs
	});
}
function stringValue(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function resultService(value) {
	const normalized = stringValue(value)?.toLowerCase();
	return normalized === "imessage" || normalized === "sms" ? normalized : void 0;
}
function resolvePendingPersistedEchoTtlMs(timeoutMs) {
	return Math.max(MIN_PENDING_PERSISTED_ECHO_TTL_MS, Math.max(0, timeoutMs) + PENDING_PERSISTED_ECHO_GRACE_MS);
}
function isAttachmentCommandFallbackError(error) {
	const message = error instanceof Error ? error.message : String(error);
	return /(?:unknown|unrecognized|invalid|unsupported)\s+(?:command|subcommand)|not a recognized command|send-attachment.*(?:not found|unsupported|unavailable)|private api bridge.*unavailable|requires the imsg private api bridge|run imsg launch/iu.test(message);
}
function isThreadedReplyUnsupportedError(error) {
	const message = error instanceof Error ? error.message : String(error);
	return /reply_to requires bridge transport|cannot send threaded repl|threaded repl(?:y|ies)\b.*(?:unsupported|not supported|requires|unavailable)|requires bridge transport/iu.test(message);
}
async function resolveAttachmentChatTarget(params) {
	if (params.target.kind === "chat_guid") return params.target.chatGuid;
	if (params.target.kind === "handle") {
		if (!canSynthesizeAttachmentChatHandle(params.target.to)) return null;
		const normalizedHandle = normalizeIMessageHandle(params.target.to);
		if (!normalizedHandle) return null;
		const service = params.target.service !== "auto" ? params.target.service : params.service;
		if (service === "sms") return `SMS;-;${normalizedHandle}`;
		if (service === "imessage") return `iMessage;-;${normalizedHandle}`;
		return `any;-;${normalizedHandle}`;
	}
	if (params.target.kind !== "chat_id") return null;
	const result = await params.runCliJson([
		"group",
		"--chat-id",
		String(params.target.chatId)
	]);
	return stringValue(result.guid) ?? stringValue(result.chat_guid) ?? null;
}
async function trySendAttachmentForTarget(params) {
	let attachmentChatTarget;
	try {
		attachmentChatTarget = await resolveAttachmentChatTarget({
			target: params.target,
			service: params.service,
			runCliJson: params.runCliJson
		});
	} catch (error) {
		if (isAttachmentCommandFallbackError(error)) return null;
		throw error;
	}
	if (!attachmentChatTarget) return null;
	const echoScope = resolveOutboundEchoScope({
		accountId: params.accountId,
		target: params.target
	});
	let result;
	let pendingEchoKey;
	try {
		if (echoScope) pendingEchoKey = rememberPersistedIMessageEcho({
			scope: echoScope,
			text: params.echoText,
			media: params.echoMedia,
			ttlMs: params.pendingEchoTtlMs,
			pending: true
		});
		result = await params.runCliJson([
			"send-attachment",
			"--chat",
			attachmentChatTarget,
			"--file",
			params.filePath,
			...params.audioAsVoice ? ["--audio"] : [],
			...params.replyToId ? ["--reply-to", params.replyToId] : [],
			"--transport",
			"auto"
		]);
	} catch (error) {
		forgetPersistedIMessageEchoKey(pendingEchoKey);
		if (isAttachmentCommandFallbackError(error)) return null;
		throw error;
	}
	const failure = resolveIMessageCliFailure(result);
	if (failure) {
		const error = new Error(failure);
		forgetPersistedIMessageEchoKey(pendingEchoKey);
		if (isAttachmentCommandFallbackError(error)) return null;
		throw error;
	}
	const resolvedId = resolveMessageId(result);
	const approvalBindingMessageId = await resolveApprovalBindingMessageGuid({
		dbPath: params.dbPath,
		messageId: resolvedId,
		result,
		resolveMessageGuidImpl: params.resolveMessageGuidImpl
	});
	const messageId = resolvedId ?? (result.ok || result.success ? "ok" : "unknown");
	if (echoScope) rememberPersistedIMessageEcho({
		scope: echoScope,
		text: params.echoText,
		media: params.echoMedia,
		messageId: resolvedId ?? void 0
	});
	if (resolvedId) rememberIMessageReplyCache({
		accountId: params.accountId,
		messageId: resolvedId,
		chatGuid: params.target.kind === "chat_guid" ? params.target.chatGuid : params.target.kind === "chat_id" ? attachmentChatTarget : void 0,
		chatIdentifier: params.target.kind === "chat_identifier" || params.target.kind === "handle" ? attachmentChatTarget : void 0,
		chatId: params.target.kind === "chat_id" ? params.target.chatId : void 0,
		timestamp: Date.now(),
		isFromMe: true
	});
	return {
		messageId,
		...approvalBindingMessageId ? { guid: approvalBindingMessageId } : {},
		sentText: "",
		...params.echoText ? { echoText: params.echoText } : {},
		...params.echoMedia ? { echoMedia: params.echoMedia } : {},
		receipt: createIMessageSendReceipt({
			messageId,
			target: params.target,
			kind: params.audioAsVoice ? "voice" : "media",
			...params.replyToId ? { replyToId: params.replyToId } : {}
		})
	};
}
async function sendMessageIMessage(to, text, opts) {
	const cfg = requireRuntimeConfig(opts.config, "iMessage send");
	const account = opts.account ?? resolveIMessageAccount({
		cfg,
		accountId: opts.accountId
	});
	const cliPath = opts.cliPath?.trim() || account.config.cliPath?.trim() || "imsg";
	const dbPath = opts.dbPath?.trim() || account.config.dbPath?.trim();
	const chatDbLookupPath = resolveIMessageChatDbLookupPath({
		cliPath,
		dbPath,
		remoteHost: account.config.remoteHost
	});
	const target = parseIMessageTarget(opts.chatId ? formatIMessageChatTarget(opts.chatId) : to);
	const service = opts.service ?? resolveTargetService(target) ?? account.config.service;
	const sendTransport = account.config.sendTransport ?? "auto";
	const resolvedReplyToId = resolveAuthorizedIMessageReplyReference({
		account,
		target,
		cliPath,
		dbPath,
		hasExclusiveLocalDatabase: hasExclusiveIMessageLocalDatabase({
			cfg,
			account,
			cliPath,
			dbPath
		}),
		service,
		replyToId: opts.replyToId,
		conversationReadOrigin: opts.conversationReadOrigin
	});
	const timeoutMs = opts.timeoutMs ?? account.config.probeTimeoutMs ?? 15e4;
	const pendingEchoTtlMs = resolvePendingPersistedEchoTtlMs(timeoutMs);
	const region = opts.region?.trim() || account.config.region?.trim() || "US";
	const maxBytes = typeof opts.maxBytes === "number" ? opts.maxBytes : typeof account.config.mediaMaxMb === "number" ? account.config.mediaMaxMb * 1024 * 1024 : 16 * 1024 * 1024;
	let message = text && opts.approvalKind ? appendIMessageApprovalReactionHintForOutboundMessage(text) : text;
	let filePath;
	let mediaContentType;
	if (opts.mediaUrl?.trim()) {
		const resolved = await (opts.resolveAttachmentImpl ?? resolveOutboundAttachmentFromUrl)(opts.mediaUrl.trim(), maxBytes, {
			localRoots: opts.mediaLocalRoots,
			readFile: opts.mediaReadFile
		});
		filePath = resolved.path;
		mediaContentType = resolved.contentType ?? void 0;
	}
	if (!message.trim() && !filePath) throw new Error("iMessage send requires text or media");
	if (message.trim()) {
		const tableMode = resolveMarkdownTableMode({
			cfg,
			channel: "imessage",
			accountId: account.accountId
		});
		message = convertMarkdownTables(message, tableMode);
	}
	message = stripInlineDirectiveTagsForDelivery(message).text;
	if (!message.trim() && !filePath) throw new Error("iMessage send requires text or media");
	const formatted = message.trim() ? extractMarkdownFormatRuns(message) : {
		text: message,
		ranges: []
	};
	message = formatted.text;
	if (!message.trim() && !filePath) throw new Error("iMessage send requires text or media");
	const echoText = resolveOutboundEchoText(message);
	const echoMedia = filePath ? resolveOutboundEchoMedia(mediaContentType) : void 0;
	let effectiveReplyToId = resolvedReplyToId;
	const runCliJson = opts.runCliJson ?? ((args) => runIMessageCliJson(cliPath, dbPath, args, timeoutMs));
	if (filePath && (!resolvedReplyToId || opts.audioAsVoice)) {
		const attachmentResult = await trySendAttachmentForTarget({
			accountId: account.accountId,
			dbPath: chatDbLookupPath,
			target,
			service,
			filePath,
			audioAsVoice: opts.audioAsVoice,
			...resolvedReplyToId ? { replyToId: resolvedReplyToId } : {},
			echoMedia,
			pendingEchoTtlMs,
			runCliJson,
			resolveMessageGuidImpl: opts.resolveMessageGuidImpl
		});
		if (attachmentResult) {
			if (!message.trim()) return attachmentResult;
			const captionResult = await sendMessageIMessage(to, text, {
				...opts,
				...opts.client ? { client: opts.client } : {},
				mediaUrl: void 0
			});
			return {
				messageId: isConcreteIMessageMessageId(attachmentResult.messageId) ? attachmentResult.messageId : captionResult.messageId,
				...captionResult.guid ?? attachmentResult.guid ? { guid: captionResult.guid ?? attachmentResult.guid } : {},
				sentText: captionResult.sentText,
				...captionResult.echoText ?? attachmentResult.echoText ? { echoText: captionResult.echoText ?? attachmentResult.echoText } : {},
				...attachmentResult.echoMedia ? { echoMedia: attachmentResult.echoMedia } : {},
				receipt: createMessageReceiptFromOutboundResults({
					results: [{ receipt: attachmentResult.receipt }, { receipt: captionResult.receipt }],
					sentAt: Math.max(attachmentResult.receipt.sentAt, captionResult.receipt.sentAt)
				})
			};
		}
	}
	const params = {
		text: message,
		service: service || "auto",
		region,
		transport: sendTransport
	};
	if (resolvedReplyToId) params.reply_to = resolvedReplyToId;
	if (formatted.ranges.length > 0) params.formatting = formatted.ranges;
	if (filePath) params.file = filePath;
	if (target.kind === "chat_id") params.chat_id = target.chatId;
	else if (target.kind === "chat_guid") params.chat_guid = target.chatGuid;
	else if (target.kind === "chat_identifier") params.chat_identifier = target.chatIdentifier;
	else params.to = target.to;
	const echoScope = resolveOutboundEchoScope({
		accountId: account.accountId,
		target
	});
	const client = opts.client ?? (opts.createClient ? await opts.createClient({
		cliPath,
		dbPath
	}) : await createIMessageRpcClient({
		cliPath,
		dbPath
	}));
	const shouldClose = !opts.client;
	let closedClient = false;
	const stopOwnedClient = async () => {
		if (!shouldClose || closedClient) return;
		closedClient = true;
		await client.stop();
	};
	let result;
	const sendStartedAtMs = Date.now();
	let pendingEchoKey;
	try {
		try {
			if (echoScope) pendingEchoKey = rememberPersistedIMessageEcho({
				scope: echoScope,
				text: echoText,
				media: echoMedia,
				ttlMs: pendingEchoTtlMs,
				pending: true
			});
			result = await client.request("send", params, { timeoutMs });
		} catch (error) {
			if (resolvedReplyToId && isThreadedReplyUnsupportedError(error)) {
				const plainParams = { ...params };
				delete plainParams.reply_to;
				result = await client.request("send", plainParams, { timeoutMs });
				effectiveReplyToId = void 0;
			} else if (filePath || !isIMessageRpcSendTimeout(error)) throw error;
			else if (!shouldRecoverApprovalPromptGuid({
				message,
				filePath,
				replyToId: resolvedReplyToId
			}) || !canCheckSentMessageAfterRpcTimeout({
				dbPath: chatDbLookupPath,
				resolveSentMessageGuidImpl: opts.resolveSentMessageGuidImpl
			})) throw error;
			else {
				const recoveredGuid = await resolveFallbackSentMessageGuid({
					dbPath: chatDbLookupPath,
					target,
					text: message,
					sentAfterMs: sendStartedAtMs,
					resolveSentMessageGuidImpl: opts.resolveSentMessageGuidImpl
				});
				if (recoveredGuid) result = {
					guid: recoveredGuid,
					status: "sent"
				};
				else throw error;
			}
		}
		const resolvedId = resolveMessageId(result);
		const messageId = resolvedId ?? (result?.ok || result?.success || result?.status === "sent" ? "ok" : "unknown");
		let approvalBindingMessageId = await resolveApprovalBindingMessageGuid({
			dbPath: chatDbLookupPath,
			messageId: resolvedId,
			result,
			resolveMessageGuidImpl: opts.resolveMessageGuidImpl
		});
		if (!approvalBindingMessageId && shouldRecoverApprovalPromptGuid({
			message,
			filePath,
			replyToId: effectiveReplyToId
		})) approvalBindingMessageId = await resolveFallbackSentMessageGuid({
			dbPath: chatDbLookupPath,
			target,
			text: message,
			sentAfterMs: sendStartedAtMs,
			resolveSentMessageGuidImpl: opts.resolveSentMessageGuidImpl
		});
		if (echoScope) rememberPersistedIMessageEcho({
			scope: echoScope,
			text: echoText,
			media: echoMedia,
			messageId: resolvedId ?? void 0
		});
		if (resolvedId) {
			const chatContext = chatContextFromIMessageTarget(target, resultService(result.service) ?? service);
			const providerChatGuid = stringValue(result.chat_guid) ?? stringValue(result.chatGuid);
			rememberIMessageReplyCache({
				accountId: account.accountId,
				messageId: resolvedId,
				...chatContext,
				...providerChatGuid ? { chatGuid: providerChatGuid } : {},
				timestamp: Date.now(),
				isFromMe: true
			});
		}
		if (message && approvalBindingMessageId && opts.approvalKind) {
			const handleForKey = target.kind === "handle" ? normalizeIMessageHandle(target.to) : void 0;
			const conversation = {
				...target.kind === "chat_guid" ? { chatGuid: target.chatGuid } : {},
				...target.kind === "chat_identifier" ? { chatIdentifier: target.chatIdentifier } : {},
				...target.kind === "chat_id" ? { chatId: target.chatId } : {},
				...handleForKey ? { handle: handleForKey } : {}
			};
			registerIMessageApprovalReactionTargetForOutboundMessage({
				accountId: account.accountId,
				conversation,
				messageId: approvalBindingMessageId,
				text: message,
				approvalKind: opts.approvalKind
			});
		}
		return {
			messageId,
			...approvalBindingMessageId ? { guid: approvalBindingMessageId } : {},
			sentText: message,
			...echoText ? { echoText } : {},
			...echoMedia ? { echoMedia } : {},
			receipt: createIMessageSendReceipt({
				messageId,
				target,
				kind: filePath ? "media" : "text",
				...effectiveReplyToId ? { replyToId: effectiveReplyToId } : {}
			})
		};
	} catch (error) {
		forgetPersistedIMessageEchoKey(pendingEchoKey);
		throw error;
	} finally {
		await stopOwnedClient();
	}
}
//#endregion
export { sendMessageIMessage as t };
