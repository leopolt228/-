import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { _ as resolvePinnedHostnameWithPolicy } from "./ssrf-eKWXIRoD.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-C0uxiauk.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./ssrf-runtime-b7ye-Z-7.js";
import "./channel-outbound-D_Kkmr30.js";
//#region extensions/line/src/outbound-media.ts
const LINE_OUTBOUND_MEDIA_SSRF_POLICY = { allowPrivateNetwork: false };
async function validateLineMediaUrl(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error("LINE outbound media URL must be a valid URL");
	}
	if (parsed.protocol !== "https:") throw new Error("LINE outbound media URL must use HTTPS");
	if (url.length > 2e3) throw new Error(`LINE outbound media URL must be 2000 chars or less (got ${url.length})`);
	await resolvePinnedHostnameWithPolicy(parsed.hostname, { policy: LINE_OUTBOUND_MEDIA_SSRF_POLICY });
}
function isHttpsUrl(url) {
	try {
		return new URL(url).protocol === "https:";
	} catch {
		return false;
	}
}
function detectLineMediaKindFromUrl(url) {
	try {
		const pathname = normalizeLowercaseStringOrEmpty(new URL(url).pathname);
		if (/\.(png|jpe?g|gif|webp|bmp|heic|heif|avif)$/i.test(pathname)) return "image";
		if (/\.(mp4|mov|m4v|webm)$/i.test(pathname)) return "video";
		if (/\.(mp3|m4a|aac|wav|ogg|oga)$/i.test(pathname)) return "audio";
	} catch {
		return;
	}
}
async function resolveLineOutboundMedia(mediaUrl, opts = {}) {
	const trimmedUrl = mediaUrl.trim();
	if (isHttpsUrl(trimmedUrl)) {
		await validateLineMediaUrl(trimmedUrl);
		const previewImageUrl = opts.previewImageUrl?.trim();
		if (previewImageUrl) await validateLineMediaUrl(previewImageUrl);
		return {
			mediaUrl: trimmedUrl,
			mediaKind: opts.mediaKind ?? (typeof opts.durationMs === "number" ? "audio" : void 0) ?? (opts.trackingId?.trim() ? "video" : void 0) ?? detectLineMediaKindFromUrl(trimmedUrl) ?? "image",
			...previewImageUrl ? { previewImageUrl } : {},
			...typeof opts.durationMs === "number" ? { durationMs: opts.durationMs } : {},
			...opts.trackingId ? { trackingId: opts.trackingId } : {}
		};
	}
	let parsed;
	try {
		parsed = new URL(trimmedUrl);
	} catch {}
	if (parsed) throw new Error("LINE outbound media URL must use HTTPS");
	throw new Error("LINE outbound media currently requires a public HTTPS URL");
}
function isLineUserTarget(target) {
	const normalized = target.trim().replace(/^line:(group|room|user):/i, "").replace(/^line:/i, "");
	return /^U/i.test(normalized);
}
function hasLineSpecificMediaOptions(lineData) {
	return lineData.mediaKind !== void 0 || Boolean(lineData.previewImageUrl?.trim()) || typeof lineData.durationMs === "number" || Boolean(lineData.trackingId?.trim());
}
function buildLineMediaMessageObject(resolved, opts) {
	switch (resolved.mediaKind) {
		case "video": {
			const previewImageUrl = resolved.previewImageUrl?.trim();
			if (!previewImageUrl) throw new Error("LINE video messages require previewImageUrl to reference an image URL");
			return {
				type: "video",
				originalContentUrl: resolved.mediaUrl,
				previewImageUrl,
				...opts?.allowTrackingId && resolved.trackingId ? { trackingId: resolved.trackingId } : {}
			};
		}
		case "audio": return {
			type: "audio",
			originalContentUrl: resolved.mediaUrl,
			duration: resolved.durationMs ?? 6e4
		};
		default: return {
			type: "image",
			originalContentUrl: resolved.mediaUrl,
			previewImageUrl: resolved.previewImageUrl ?? resolved.mediaUrl
		};
	}
}
async function buildLineMediaMessage(mediaUrl, opts, target) {
	return buildLineMediaMessageObject(await resolveLineOutboundMedia(mediaUrl, opts), { allowTrackingId: isLineUserTarget(target) });
}
//#endregion
//#region extensions/line/src/send-receipt.ts
function createLineSendReceipt(params) {
	const messageId = params.messageId.trim();
	const chatId = params.chatId.trim();
	return createMessageReceiptFromOutboundResults({
		results: messageId ? [{
			channel: "line",
			messageId,
			chatId,
			conversationId: chatId,
			meta: { messageCount: params.messageCount ?? 1 }
		}] : [],
		...chatId ? { threadId: chatId } : {},
		kind: params.kind ?? "unknown"
	});
}
//#endregion
export { validateLineMediaUrl as a, resolveLineOutboundMedia as i, buildLineMediaMessage as n, hasLineSpecificMediaOptions as r, createLineSendReceipt as t };
