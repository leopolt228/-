import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { C as resolveExpiresAtMsFromDurationMs, P as timestampMsToIsoString, _ as parseStrictFiniteNumber } from "./number-coercion-Crk_c9KW.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { r as writeExternalFileWithinRoot } from "./fs-safe-Dy0g6QwA.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
import { t as tempWorkspace } from "./private-temp-workspace-HLulDJ5y.js";
import { g as readResponseTextLimited, m as readProviderJsonResponse } from "./provider-http-errors-DrOMjuGn.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-C7JzO8vD.js";
import { a as maxBytesForKind } from "./constants-Mf57IYS0.js";
import { r as extensionForMime } from "./mime-De36NoRj.js";
import { c as MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS, i as parseFfprobeCodecAndSampleRate, o as runFfmpeg, s as runFfprobe } from "./media-services-YHqWbhOq.js";
import { r as loadWebMediaRaw } from "./web-media-wl1hy1PL.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./text-utility-runtime-Bs8FhB83.js";
import "./security-runtime-B_Vsvs-F.js";
import "./error-runtime-DUxkdoW4.js";
import { a as unlinkIfExists } from "./media-runtime-BF28IqU8.js";
import "./temp-path-Dc-DA026.js";
import "./number-runtime-C6TGSEc_.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-Dnur9SGp.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import { n as recordOutboundMessageIdentity } from "./outbound-echo-VBgVjbfx.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import "./web-media-DdHgGDGy.js";
import "./ssrf-runtime-b7ye-Z-7.js";
import "./channel-outbound-D_Kkmr30.js";
import "./provider-http-D2uO-AEP.js";
import { s as resolveDiscordAccount } from "./accounts-sZJTKxVc.js";
import { At as listGuildEmojis, Bt as ChannelType, Ct as createGuildSticker, Dt as getGuildVoiceState, Et as getGuildMember, Ft as removeGuildMember, It as removeGuildMemberRole, Lt as timeoutGuildMember, Mt as listGuildScheduledEvents, Nt as moveGuildChannels, Ot as listGuildActiveThreads, Pt as putChannelPermission, St as createGuildScheduledEvent, Tt as getGuild, _ as isUnknownDiscordVoiceStateError, _t as unpinChannelMessage, at as deleteChannelMessage, b as readRetryAfter, bt as createGuildChannel, ct as getChannel, dt as listChannelArchivedThreads, ft as listChannelMessages, g as RateLimitError, h as DiscordError, ht as searchGuildMessages, it as deleteChannel, jt as listGuildRoles, kt as listGuildChannels, lt as getChannelMessage, mt as pinChannelMessage, nt as createChannelMessage, ot as editChannel, pt as listChannelPins, rt as createThread, st as editChannelMessage, v as readDiscordCode, vt as addGuildMemberRole, wt as deleteChannelPermission, xt as createGuildEmoji, y as readDiscordMessage, yt as createGuildBan } from "./discord-BO4_MvbK.js";
import { m as resolveDiscordRest, p as resolveDiscordClientAccountContext, u as createDiscordClient } from "./send.permissions-BhFjVFcq.js";
import { C as DISCORD_MAX_STICKER_BYTES, S as DISCORD_MAX_EVENT_COVER_BYTES, T as parseAndResolveChannelRecipient, g as createDiscordMessageNonce, l as resolveChannelId, o as normalizeEmojiName, t as buildDiscordSendError, x as DISCORD_MAX_EMOJI_BYTES } from "./send.shared-p57jtR08.js";
import { r as rewriteDiscordKnownMentions } from "./mentions-CyC0iUI8.js";
import { n as createDiscordSendResult } from "./send.receipt-jI3nGdpn.js";
import "./send.outbound-CJThfrn0.js";
import { n as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS } from "./timeouts-DB8J_ZTL.js";
import "./send.reactions-ArbA4fU1.js";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/discord/src/send.channels.ts
async function createChannelDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const body = { name: payload.name };
	if (payload.type !== void 0) body.type = payload.type;
	if (payload.parentId) body.parent_id = payload.parentId;
	if (payload.topic) body.topic = payload.topic;
	if (payload.position !== void 0) body.position = payload.position;
	if (payload.nsfw !== void 0) body.nsfw = payload.nsfw;
	return await createGuildChannel(rest, payload.guildId, { body });
}
async function editChannelDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const body = {};
	if (payload.name !== void 0) body.name = payload.name;
	if (payload.topic !== void 0) body.topic = payload.topic;
	if (payload.position !== void 0) body.position = payload.position;
	if (payload.parentId !== void 0) body.parent_id = payload.parentId;
	if (payload.nsfw !== void 0) body.nsfw = payload.nsfw;
	if (payload.rateLimitPerUser !== void 0) body.rate_limit_per_user = payload.rateLimitPerUser;
	if (payload.archived !== void 0) body.archived = payload.archived;
	if (payload.locked !== void 0) body.locked = payload.locked;
	if (payload.autoArchiveDuration !== void 0) body.auto_archive_duration = payload.autoArchiveDuration;
	if (payload.availableTags !== void 0) body.available_tags = payload.availableTags.map((t) => ({
		...t.id !== void 0 && { id: t.id },
		name: t.name,
		...t.moderated !== void 0 && { moderated: t.moderated },
		...t.emoji_id !== void 0 && { emoji_id: t.emoji_id },
		...t.emoji_name !== void 0 && { emoji_name: t.emoji_name }
	}));
	return await editChannel(rest, payload.channelId, { body });
}
async function deleteChannelDiscord(channelId, opts) {
	await deleteChannel(resolveDiscordRest(opts), channelId);
	return {
		ok: true,
		channelId
	};
}
async function moveChannelDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const body = [{
		id: payload.channelId,
		...payload.parentId !== void 0 && { parent_id: payload.parentId },
		...payload.position !== void 0 && { position: payload.position }
	}];
	await moveGuildChannels(rest, payload.guildId, { body });
	return { ok: true };
}
async function setChannelPermissionDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const body = { type: payload.targetType };
	if (payload.allow !== void 0) body.allow = payload.allow;
	if (payload.deny !== void 0) body.deny = payload.deny;
	await putChannelPermission(rest, payload.channelId, payload.targetId, { body });
	return { ok: true };
}
async function removeChannelPermissionDiscord(channelId, targetId, opts) {
	await deleteChannelPermission(resolveDiscordRest(opts), channelId, targetId);
	return { ok: true };
}
//#endregion
//#region extensions/discord/src/send.emojis-stickers.ts
async function listGuildEmojisDiscord(guildId, opts) {
	return await listGuildEmojis(resolveDiscordRest(opts), guildId);
}
async function uploadEmojiDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const media = await loadWebMediaRaw(payload.mediaUrl, DISCORD_MAX_EMOJI_BYTES);
	const contentType = normalizeOptionalLowercaseString(media.contentType);
	if (!contentType || ![
		"image/png",
		"image/jpeg",
		"image/jpg",
		"image/gif"
	].includes(contentType)) throw new Error("Discord emoji uploads require a PNG, JPG, or GIF image");
	const image = `data:${contentType};base64,${media.buffer.toString("base64")}`;
	const roleIds = normalizeStringEntries(payload.roleIds ?? []);
	return await createGuildEmoji(rest, payload.guildId, { body: {
		name: normalizeEmojiName(payload.name, "Emoji name"),
		image,
		roles: roleIds.length ? roleIds : void 0
	} });
}
async function uploadStickerDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const media = await loadWebMediaRaw(payload.mediaUrl, DISCORD_MAX_STICKER_BYTES);
	const contentType = normalizeOptionalLowercaseString(media.contentType);
	if (!contentType || ![
		"image/png",
		"image/apng",
		"application/json"
	].includes(contentType)) throw new Error("Discord sticker uploads require a PNG, APNG, or Lottie JSON file");
	return await createGuildSticker(rest, payload.guildId, {
		multipartStyle: "form",
		body: {
			name: normalizeEmojiName(payload.name, "Sticker name"),
			description: normalizeEmojiName(payload.description, "Sticker description"),
			tags: normalizeEmojiName(payload.tags, "Sticker tags"),
			files: [{
				data: media.buffer,
				fieldName: "file",
				name: media.fileName ?? "sticker",
				contentType
			}]
		}
	});
}
//#endregion
//#region extensions/discord/src/send.guild.ts
async function fetchMemberInfoDiscord(guildId, userId, opts) {
	return await getGuildMember(resolveDiscordRest(opts), guildId, userId);
}
async function fetchRoleInfoDiscord(guildId, opts) {
	return await listGuildRoles(resolveDiscordRest(opts), guildId);
}
async function addRoleDiscord(payload, opts) {
	await addGuildMemberRole(resolveDiscordRest(opts), payload.guildId, payload.userId, payload.roleId);
	return { ok: true };
}
async function removeRoleDiscord(payload, opts) {
	await removeGuildMemberRole(resolveDiscordRest(opts), payload.guildId, payload.userId, payload.roleId);
	return { ok: true };
}
async function fetchChannelInfoDiscord(channelId, opts) {
	return await getChannel(resolveDiscordRest(opts), channelId);
}
async function fetchGuildInfoDiscord(guildId, opts) {
	return await getGuild(resolveDiscordRest(opts), guildId);
}
async function listGuildChannelsDiscord(guildId, opts) {
	return await listGuildChannels(resolveDiscordRest(opts), guildId);
}
async function fetchVoiceStatusDiscord(guildId, userId, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		return await getGuildVoiceState(rest, guildId, userId);
	} catch (err) {
		if (!isUnknownDiscordVoiceStateError(err)) throw err;
		return {
			guild_id: guildId,
			user_id: userId,
			channel_id: null,
			connected: false,
			absent: true,
			reason: "unknown_voice_state"
		};
	}
}
async function listScheduledEventsDiscord(guildId, opts) {
	return await listGuildScheduledEvents(resolveDiscordRest(opts), guildId);
}
const ALLOWED_EVENT_COVER_TYPES = /* @__PURE__ */ new Set([
	"image/png",
	"image/jpeg",
	"image/jpg",
	"image/gif"
]);
async function resolveEventCoverImage(imageUrl, opts) {
	const media = await loadWebMediaRaw(imageUrl, DISCORD_MAX_EVENT_COVER_BYTES, { localRoots: opts?.localRoots });
	const contentType = normalizeOptionalLowercaseString(media.contentType);
	if (!contentType || !ALLOWED_EVENT_COVER_TYPES.has(contentType)) throw new Error(`Discord event cover images must be PNG, JPG, or GIF (got ${contentType ?? "unknown"})`);
	return `data:${contentType};base64,${media.buffer.toString("base64")}`;
}
async function createScheduledEventDiscord(guildId, payload, opts) {
	return await createGuildScheduledEvent(resolveDiscordRest(opts), guildId, payload);
}
async function timeoutMemberDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	let until = payload.until;
	if (!until && payload.durationMinutes) {
		until = timestampMsToIsoString(resolveExpiresAtMsFromDurationMs(payload.durationMinutes * 60 * 1e3));
		if (!until) throw new Error("Discord timeout duration is outside the supported Date range");
	}
	return await timeoutGuildMember(rest, payload.guildId, payload.userId, {
		body: { communication_disabled_until: until ?? null },
		headers: payload.reason ? { "X-Audit-Log-Reason": encodeURIComponent(payload.reason) } : void 0
	});
}
async function kickMemberDiscord(payload, opts) {
	await removeGuildMember(resolveDiscordRest(opts), payload.guildId, payload.userId, { headers: payload.reason ? { "X-Audit-Log-Reason": encodeURIComponent(payload.reason) } : void 0 });
	return { ok: true };
}
async function banMemberDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const deleteMessageDays = typeof payload.deleteMessageDays === "number" && Number.isFinite(payload.deleteMessageDays) ? Math.min(Math.max(Math.floor(payload.deleteMessageDays), 0), 7) : void 0;
	await createGuildBan(rest, payload.guildId, payload.userId, {
		body: deleteMessageDays !== void 0 ? { delete_message_days: deleteMessageDays } : void 0,
		headers: payload.reason ? { "X-Audit-Log-Reason": encodeURIComponent(payload.reason) } : void 0
	});
	return { ok: true };
}
//#endregion
//#region extensions/discord/src/send.messages.ts
function formatDiscordThreadInitialMessageError(error) {
	return error instanceof Error ? error.message : String(error);
}
function assertDiscordResponseArray(value, label) {
	if (!Array.isArray(value)) throw new Error(`Unexpected Discord response for ${label}: expected array.`);
	return value;
}
function assertDiscordResponseObject(value, label) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`Unexpected Discord response for ${label}: expected object.`);
	return value;
}
function resolveDefaultThreadAutoArchiveDuration(channel) {
	if (!channel || !("default_auto_archive_duration" in channel)) return;
	return channel.default_auto_archive_duration;
}
var DiscordThreadInitialMessageError = class extends Error {
	constructor(thread, error) {
		const initialMessageError = formatDiscordThreadInitialMessageError(error);
		super(`Discord thread was created, but sending the initial message failed: ${initialMessageError}`);
		this.name = "DiscordThreadInitialMessageError";
		this.initialMessageError = initialMessageError;
		this.thread = thread;
	}
};
async function readMessagesDiscord(channelId, query, opts) {
	const messageQuery = query ?? {};
	const rest = resolveDiscordRest(opts);
	const limit = typeof messageQuery.limit === "number" && Number.isFinite(messageQuery.limit) ? Math.min(Math.max(Math.floor(messageQuery.limit), 1), 100) : void 0;
	const params = {};
	if (limit) params.limit = limit;
	if (messageQuery.before) params.before = messageQuery.before;
	if (messageQuery.after) params.after = messageQuery.after;
	if (messageQuery.around) params.around = messageQuery.around;
	return assertDiscordResponseArray(await listChannelMessages(rest, channelId, params), "message read");
}
async function fetchMessageDiscord(channelId, messageId, opts) {
	return await getChannelMessage(resolveDiscordRest(opts), channelId, messageId);
}
async function editMessageDiscord(channelId, messageId, payload, opts) {
	return await editChannelMessage(resolveDiscordRest(opts), channelId, messageId, { body: {
		content: payload.content,
		...payload.flags !== void 0 ? { flags: payload.flags } : {}
	} });
}
async function deleteMessageDiscord(channelId, messageId, opts) {
	await deleteChannelMessage(resolveDiscordRest(opts), channelId, messageId);
	return { ok: true };
}
async function pinMessageDiscord(channelId, messageId, opts) {
	await pinChannelMessage(resolveDiscordRest(opts), channelId, messageId);
	return { ok: true };
}
async function unpinMessageDiscord(channelId, messageId, opts) {
	await unpinChannelMessage(resolveDiscordRest(opts), channelId, messageId);
	return { ok: true };
}
async function listPinsDiscord(channelId, opts) {
	return await listChannelPins(resolveDiscordRest(opts), channelId);
}
async function createThreadDiscord(channelId, payload, opts) {
	const rest = resolveDiscordRest(opts);
	const body = { name: payload.name };
	if (!payload.messageId && payload.type !== void 0) body.type = payload.type;
	let channel;
	if (!payload.messageId) try {
		channel = await getChannel(rest, channelId);
	} catch {}
	const archiveDuration = payload.autoArchiveMinutes ?? resolveDefaultThreadAutoArchiveDuration(channel);
	if (archiveDuration !== void 0) body.auto_archive_duration = archiveDuration;
	const isForumLike = channel?.type === ChannelType.GuildForum || channel?.type === ChannelType.GuildMedia;
	if (isForumLike) {
		body.message = { content: payload.content?.trim() ? payload.content : payload.name };
		if (payload.appliedTags?.length) body.applied_tags = payload.appliedTags;
	}
	if (!payload.messageId && !isForumLike && body.type === void 0) body.type = ChannelType.PublicThread;
	const thread = await createThread(rest, channelId, { body }, payload.messageId);
	if (!isForumLike && payload.content?.trim() && "id" in thread) try {
		await createChannelMessage(rest, thread.id, { body: { content: payload.content } });
	} catch (error) {
		throw new DiscordThreadInitialMessageError(thread, error);
	}
	return thread;
}
async function listThreadsDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	if (payload.includeArchived) {
		if (!payload.channelId) throw new Error("channelId required to list archived threads");
		const params = {};
		if (payload.before) params.before = payload.before;
		if (payload.limit) params.limit = payload.limit;
		return await listChannelArchivedThreads(rest, payload.channelId, params);
	}
	return await listGuildActiveThreads(rest, payload.guildId);
}
async function searchMessagesDiscord(query, opts) {
	const rest = resolveDiscordRest(opts);
	const params = new URLSearchParams();
	params.set("content", query.content);
	if (query.channelIds?.length) for (const channelId of query.channelIds) params.append("channel_id", channelId);
	if (query.authorIds?.length) for (const authorId of query.authorIds) params.append("author_id", authorId);
	if (query.limit) {
		const limit = Math.min(Math.max(Math.floor(query.limit), 1), 25);
		params.set("limit", String(limit));
	}
	return assertDiscordResponseObject(await searchGuildMessages(rest, query.guildId, params), "message search");
}
//#endregion
//#region extensions/discord/src/send.webhook.ts
const DISCORD_WEBHOOK_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
function resolveWebhookExecutionUrl(params) {
	const baseUrl = new URL(`https://discord.com/api/v10/webhooks/${encodeURIComponent(params.webhookId)}/${encodeURIComponent(params.webhookToken)}`);
	baseUrl.searchParams.set("wait", params.wait === false ? "false" : "true");
	if (params.threadId !== void 0 && params.threadId !== null && params.threadId !== "") baseUrl.searchParams.set("thread_id", String(params.threadId));
	return baseUrl.toString();
}
function coerceWebhookErrorBody(raw) {
	if (!raw) return;
	try {
		return JSON.parse(raw);
	} catch {
		return { message: truncateUtf16Safe(raw, 200) };
	}
}
async function throwWebhookResponseError(response) {
	const parsed = coerceWebhookErrorBody(await readResponseTextLimited(response, DISCORD_WEBHOOK_ERROR_BODY_LIMIT_BYTES).catch(() => ""));
	if (response.status === 429) throw new RateLimitError(response, {
		message: readDiscordMessage(parsed, "Rate limited"),
		retry_after: readRetryAfter(parsed, response, 1),
		code: readDiscordCode(parsed),
		global: parsed && typeof parsed === "object" && "global" in parsed ? Boolean(parsed.global) : false
	});
	throw new DiscordError(response, parsed);
}
async function sendWebhookMessageDiscord(text, opts) {
	const webhookId = normalizeOptionalString(opts.webhookId) ?? "";
	const webhookToken = normalizeOptionalString(opts.webhookToken) ?? "";
	if (!webhookId || !webhookToken) throw new Error("Discord webhook id/token are required");
	const replyTo = normalizeOptionalString(opts.replyTo) ?? "";
	const messageReference = replyTo ? {
		message_id: replyTo,
		fail_if_not_exists: false
	} : void 0;
	const { account, proxyFetch } = resolveDiscordClientAccountContext({
		cfg: opts.cfg,
		accountId: opts.accountId
	});
	const rewrittenText = rewriteDiscordKnownMentions(text, {
		accountId: account.accountId,
		mentionAliases: account.config.mentionAliases
	});
	const threadConversationId = opts.threadId == null ? "" : String(opts.threadId).trim();
	if (threadConversationId) recordOutboundMessageIdentity({
		channel: "discord",
		accountId: account.accountId,
		conversationId: threadConversationId,
		sourceId: webhookId
	});
	const response = await (proxyFetch ?? fetch)(resolveWebhookExecutionUrl({
		webhookId,
		webhookToken,
		threadId: opts.threadId,
		wait: opts.wait
	}), {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			content: rewrittenText,
			username: normalizeOptionalString(opts.username),
			avatar_url: normalizeOptionalString(opts.avatarUrl),
			...messageReference ? { message_reference: messageReference } : {}
		})
	});
	if (!response.ok) await throwWebhookResponseError(response);
	const payload = response.status === 204 ? {} : await readProviderJsonResponse(response, "Discord webhook send").catch(() => ({}));
	try {
		recordChannelActivity({
			channel: "discord",
			accountId: account.accountId,
			direction: "outbound"
		});
	} catch {}
	const result = createDiscordSendResult({
		result: payload,
		fallbackChannelId: opts.threadId ? String(opts.threadId) : "",
		kind: "text",
		...opts.threadId != null ? { threadId: opts.threadId } : {},
		...replyTo ? { replyToId: replyTo } : {}
	});
	const resultConversationId = result.channelId.trim();
	if (result.messageId !== "unknown" && resultConversationId) recordOutboundMessageIdentity({
		channel: "discord",
		accountId: account.accountId,
		conversationId: resultConversationId,
		messageId: result.messageId,
		sourceId: webhookId
	});
	return result;
}
//#endregion
//#region extensions/discord/src/voice-message.ts
/**
* Discord Voice Message Support
*
* Implements sending voice messages via Discord's API.
* Voice messages require:
* - OGG/Opus format audio
* - Waveform data (base64 encoded, up to 256 samples, 0-255 values)
* - Duration in seconds
* - Message flag 8192 (IS_VOICE_MESSAGE)
* - No other content (text, embeds, etc.)
*/
const DISCORD_VOICE_MESSAGE_FLAG = 8192;
const WAVEFORM_SAMPLES = 256;
const DISCORD_OPUS_SAMPLE_RATE_HZ = 48e3;
const DISCORD_VOICE_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
const DISCORD_VOICE_UPLOAD_SSRF_POLICY = {
	allowRfc2544BenchmarkRange: true,
	allowIpv6UniqueLocalRange: true
};
async function runFfmpegToOutput(params) {
	const rootDir = path.dirname(params.outputPath);
	await fs.mkdir(rootDir, { recursive: true });
	await writeExternalFileWithinRoot({
		rootDir,
		path: path.basename(params.outputPath),
		write: async (tempPath) => {
			await runFfmpeg(params.buildArgs(tempPath));
		}
	});
}
function createRateLimitError(response, body, request) {
	return new RateLimitError(response, body, request ?? new Request("https://discord.com/api/v10/channels/voice/messages", { method: "POST" }));
}
/**
* Get audio duration using ffprobe
*/
async function getAudioDuration(filePath) {
	try {
		const duration = parseStrictFiniteNumber(await runFfprobe([
			"-v",
			"error",
			"-show_entries",
			"format=duration",
			"-of",
			"csv=p=0",
			filePath
		]));
		if (duration === void 0) throw new Error("Could not parse duration");
		return Math.round(duration * 100) / 100;
	} catch (err) {
		const errMessage = formatErrorMessage(err);
		throw new Error(`Failed to get audio duration: ${errMessage}`, { cause: err });
	}
}
/**
* Generate waveform data from audio file using ffmpeg
* Returns base64 encoded byte array of amplitude samples (0-255)
*/
async function generateWaveform(filePath) {
	try {
		return await generateWaveformFromPcm(filePath);
	} catch {
		return generatePlaceholderWaveform();
	}
}
/**
* Generate waveform by extracting raw PCM data and sampling amplitudes
*/
async function generateWaveformFromPcm(filePath) {
	const tempDir = resolvePreferredOpenClawTmpDir();
	const tempPcm = path.join(tempDir, `waveform-${crypto.randomUUID()}.raw`);
	try {
		await runFfmpegToOutput({
			outputPath: tempPcm,
			buildArgs: (outputPath) => [
				"-y",
				"-i",
				filePath,
				"-vn",
				"-sn",
				"-dn",
				"-t",
				String(MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS),
				"-f",
				"s16le",
				"-acodec",
				"pcm_s16le",
				"-ac",
				"1",
				"-ar",
				"8000",
				outputPath
			]
		});
		const pcmData = await fs.readFile(tempPcm);
		const samples = new Int16Array(pcmData.buffer, pcmData.byteOffset, pcmData.byteLength / 2);
		const step = Math.max(1, Math.floor(samples.length / WAVEFORM_SAMPLES));
		const waveform = [];
		for (let i = 0; i < WAVEFORM_SAMPLES && i * step < samples.length; i++) {
			let sum = 0;
			let count = 0;
			for (let j = 0; j < step && i * step + j < samples.length; j++) {
				sum += Math.abs(expectDefined(samples.at(i * step + j), "bounded PCM waveform sample"));
				count++;
			}
			const avg = count > 0 ? sum / count : 0;
			const normalized = Math.min(255, Math.round(avg / 32767 * 255));
			waveform.push(normalized);
		}
		while (waveform.length < WAVEFORM_SAMPLES) waveform.push(0);
		return Buffer.from(waveform).toString("base64");
	} finally {
		await unlinkIfExists(tempPcm);
	}
}
/**
* Generate a placeholder waveform (for when audio processing fails)
*/
function generatePlaceholderWaveform() {
	const waveform = [];
	for (let i = 0; i < WAVEFORM_SAMPLES; i++) {
		const value = Math.round(128 + 64 * Math.sin(i / WAVEFORM_SAMPLES * Math.PI * 8));
		waveform.push(Math.min(255, Math.max(0, value)));
	}
	return Buffer.from(waveform).toString("base64");
}
/**
* Convert audio file to OGG/Opus format if needed
* Returns path to the OGG file (may be same as input if already OGG/Opus)
*/
async function ensureOggOpus(filePath) {
	const trimmed = filePath.trim();
	if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) throw new Error(`Voice message conversion requires a local file path; received a URL/protocol source: ${trimmed}`);
	if (normalizeLowercaseStringOrEmpty(path.extname(filePath)) === ".ogg") try {
		const { codec, sampleRateHz } = parseFfprobeCodecAndSampleRate(await runFfprobe([
			"-v",
			"error",
			"-select_streams",
			"a:0",
			"-show_entries",
			"stream=codec_name,sample_rate",
			"-of",
			"csv=p=0",
			filePath
		]));
		if (codec === "opus" && sampleRateHz === DISCORD_OPUS_SAMPLE_RATE_HZ) return {
			path: filePath,
			cleanup: false
		};
	} catch {}
	const tempDir = resolvePreferredOpenClawTmpDir();
	const outputPath = path.join(tempDir, `voice-${crypto.randomUUID()}.ogg`);
	await runFfmpegToOutput({
		outputPath,
		buildArgs: (tempPath) => [
			"-y",
			"-i",
			filePath,
			"-vn",
			"-sn",
			"-dn",
			"-t",
			String(MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS),
			"-ar",
			String(DISCORD_OPUS_SAMPLE_RATE_HZ),
			"-c:a",
			"libopus",
			"-b:a",
			"64k",
			"-f",
			"ogg",
			tempPath
		]
	});
	return {
		path: outputPath,
		cleanup: true
	};
}
/**
* Get voice message metadata (duration and waveform)
*/
async function getVoiceMessageMetadata(filePath) {
	const [durationSecs, waveform] = await Promise.all([getAudioDuration(filePath), generateWaveform(filePath)]);
	return {
		durationSecs,
		waveform
	};
}
function coerceDiscordErrorBody(raw) {
	if (!raw) return;
	try {
		return JSON.parse(raw);
	} catch {
		return { message: truncateUtf16Safe(raw, 200) };
	}
}
async function createVoiceRequestError(response, fallbackMessage) {
	const parsed = coerceDiscordErrorBody(await readResponseTextLimited(response, DISCORD_VOICE_ERROR_BODY_LIMIT_BYTES).catch(() => ""));
	if (response.status === 429) throw createRateLimitError(response, {
		message: readDiscordMessage(parsed, "You are being rate limited."),
		retry_after: readRetryAfter(parsed, response, 1),
		global: parsed && typeof parsed === "object" && "global" in parsed ? Boolean(parsed.global) : false
	});
	return new DiscordError(response, parsed ?? { message: fallbackMessage });
}
async function requestVoiceUploadUrl(params) {
	const { response: res, release } = await fetchWithSsrFGuard({
		url: `${params.rest.options?.baseUrl ?? "https://discord.com/api"}/channels/${params.channelId}/attachments`,
		init: {
			method: "POST",
			headers: {
				Authorization: `Bot ${params.botToken}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ files: [{
				filename: params.filename,
				file_size: params.fileSize,
				id: "0"
			}] })
		},
		timeoutMs: params.rest.options.timeout,
		policy: DISCORD_VOICE_UPLOAD_SSRF_POLICY,
		auditContext: "discord.voice.upload-url"
	});
	try {
		if (!res.ok) throw await createVoiceRequestError(res, "Upload URL request failed");
		return await readProviderJsonResponse(res, "discord.voice.upload-url");
	} finally {
		await release();
	}
}
async function uploadVoiceAttachment(params) {
	const { response: uploadResponse, release } = await fetchWithSsrFGuard({
		url: params.uploadUrl,
		init: {
			method: "PUT",
			headers: { "Content-Type": "audio/ogg" },
			body: new Uint8Array(params.audioBuffer)
		},
		timeoutMs: DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS,
		policy: DISCORD_VOICE_UPLOAD_SSRF_POLICY,
		auditContext: "discord.voice.attachment-upload"
	});
	try {
		if (!uploadResponse.ok) throw await createVoiceRequestError(uploadResponse, "Failed to upload voice message");
	} finally {
		await release();
	}
}
/**
* Send a voice message to Discord
*
* This follows Discord's voice message protocol:
* 1. Request upload URL from Discord
* 2. Upload the OGG file to the provided URL
* 3. Send the message with flag 8192 and attachment metadata
*/
async function sendDiscordVoiceMessage(rest, channelId, audioBuffer, metadata, replyTo, request, silent, token) {
	const filename = "voice-message.ogg";
	const fileSize = audioBuffer.byteLength;
	const botToken = token;
	if (!botToken) throw new Error("Discord bot token is required for voice message upload");
	const { upload_filename } = await request(async () => {
		const uploadUrlResponse = await requestVoiceUploadUrl({
			rest,
			channelId,
			botToken,
			filename,
			fileSize
		});
		if (!uploadUrlResponse.attachments?.[0]) throw new Error("Failed to get upload URL for voice message");
		const attachment = uploadUrlResponse.attachments[0];
		await uploadVoiceAttachment({
			uploadUrl: attachment.upload_url,
			audioBuffer
		});
		return attachment;
	}, "voice-upload");
	const messagePayload = {
		flags: silent ? 12288 : DISCORD_VOICE_MESSAGE_FLAG,
		nonce: createDiscordMessageNonce(),
		enforce_nonce: true,
		attachments: [{
			id: "0",
			filename,
			uploaded_filename: upload_filename,
			duration_secs: metadata.durationSecs,
			waveform: metadata.waveform
		}]
	};
	if (replyTo) messagePayload.message_reference = {
		message_id: replyTo,
		fail_if_not_exists: false
	};
	return await request(() => rest.post(`/channels/${channelId}/messages`, { body: messagePayload }), "voice-message", { safety: "nonce-protected-create" });
}
//#endregion
//#region extensions/discord/src/send.voice.ts
function toDiscordSendResult(result, fallbackChannelId, reply) {
	return createDiscordSendResult({
		result,
		fallbackChannelId,
		kind: "voice",
		reply
	});
}
async function materializeVoiceMessageInput(mediaUrl) {
	const media = await loadWebMediaRaw(mediaUrl, maxBytesForKind("audio"));
	const extFromName = media.fileName ? path.extname(media.fileName) : "";
	const extFromMime = media.contentType ? extensionForMime(media.contentType) : "";
	const ext = extFromName || extFromMime || ".bin";
	const workspace = await tempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "voice-src-"
	});
	return {
		filePath: await workspace.write(`input${ext}`, media.buffer),
		cleanup: async () => await workspace.cleanup()
	};
}
/**
* Send a voice message to Discord.
*
* Voice messages are a special Discord feature that displays audio with a waveform
* visualization. They require OGG/Opus format and cannot include text content.
*
* @param to - Recipient (user ID for DM or channel ID)
* @param audioPath - Path to local audio file (will be converted to OGG/Opus if needed)
* @param opts - Send options
*/
async function sendVoiceMessageDiscord(to, audioPath, opts) {
	const { filePath: localInputPath, cleanup: cleanupLocalInput } = await materializeVoiceMessageInput(audioPath);
	let oggPath = null;
	let oggCleanup = false;
	let token;
	let rest;
	let channelId;
	const cfg = requireRuntimeConfig(opts.cfg, "Discord voice send");
	try {
		const accountInfo = resolveDiscordAccount({
			cfg,
			accountId: opts.accountId
		});
		const client = createDiscordClient({
			...opts,
			cfg
		});
		token = client.token;
		rest = client.rest;
		const request = client.request;
		const recipient = await parseAndResolveChannelRecipient(to, cfg, opts.accountId);
		channelId = (await resolveChannelId(rest, recipient, request)).channelId;
		const ogg = await ensureOggOpus(localInputPath);
		oggPath = ogg.path;
		oggCleanup = ogg.cleanup;
		const metadata = await getVoiceMessageMetadata(oggPath);
		const audioBuffer = await fs.readFile(oggPath);
		const result = await sendDiscordVoiceMessage(rest, channelId, audioBuffer, metadata, opts.reply?.messageId, request, opts.silent, token);
		recordChannelActivity({
			channel: "discord",
			accountId: accountInfo.accountId,
			direction: "outbound"
		});
		return toDiscordSendResult(result, channelId, opts.reply);
	} catch (err) {
		if (channelId && rest && token) throw await buildDiscordSendError(err, {
			channelId,
			cfg,
			rest,
			token,
			hasMedia: true
		});
		throw err;
	} finally {
		await unlinkIfExists(oggCleanup ? oggPath : null);
		await cleanupLocalInput();
	}
}
//#endregion
export { uploadStickerDiscord as A, listGuildChannelsDiscord as C, timeoutMemberDiscord as D, resolveEventCoverImage as E, removeChannelPermissionDiscord as F, setChannelPermissionDiscord as I, deleteChannelDiscord as M, editChannelDiscord as N, listGuildEmojisDiscord as O, moveChannelDiscord as P, kickMemberDiscord as S, removeRoleDiscord as T, fetchChannelInfoDiscord as _, deleteMessageDiscord as a, fetchRoleInfoDiscord as b, listPinsDiscord as c, readMessagesDiscord as d, searchMessagesDiscord as f, createScheduledEventDiscord as g, banMemberDiscord as h, createThreadDiscord as i, createChannelDiscord as j, uploadEmojiDiscord as k, listThreadsDiscord as l, addRoleDiscord as m, sendWebhookMessageDiscord as n, editMessageDiscord as o, unpinMessageDiscord as p, DiscordThreadInitialMessageError as r, fetchMessageDiscord as s, sendVoiceMessageDiscord as t, pinMessageDiscord as u, fetchGuildInfoDiscord as v, listScheduledEventsDiscord as w, fetchVoiceStatusDiscord as x, fetchMemberInfoDiscord as y };
