import { c as stripLeadingSilentToken, i as isSilentReplyPayloadText, l as stripSilentToken, n as SILENT_REPLY_TOKEN, o as isSilentReplyText, s as startsWithSilentToken } from "./tokens-DKI4eGAu.js";
import { t as stripInternalMetadataForDisplay } from "./display-text-sanitize-wW1-W6iE.js";
import { i as normalizeReplyPayloadsForDelivery } from "./payloads-BfQIm4rr.js";
import { t as normalizeReplyPayload } from "./normalize-reply-BbsczuCQ.js";
//#region src/auto-reply/reply/pending-final-delivery.ts
/** Normalize raw final payloads into the channel-agnostic sendable set recovery can mark. */
function normalizePendingFinalDeliveryPayloads(payloads) {
	return normalizeReplyPayloadsForDelivery(normalizePendingFinalRecoveryPayloads(payloads));
}
/** Normalize raw final payloads for durable recovery without stripping delivery directives. */
function normalizePendingFinalRecoveryPayloads(payloads) {
	return payloads.flatMap((payload) => {
		const normalized = normalizeReplyPayload(payload, { applyChannelTransforms: false });
		return normalized ? [normalized] : [];
	});
}
/** Build durable recovery text only for payload shapes this marker can replay without loss. */
function buildRecoverablePendingFinalDeliveryText(payloads) {
	const sendablePayloads = [];
	for (const payload of payloads) {
		if (payload.isReasoning === true) continue;
		const deliveryPayloads = normalizeReplyPayloadsForDelivery([payload]);
		if (deliveryPayloads.length === 0) continue;
		if (hasUnsupportedDurableRecoveryShape(payload) || deliveryPayloads.some(hasUnrecoverableNormalizedDeliveryShape)) return;
		sendablePayloads.push(...deliveryPayloads);
	}
	if (sendablePayloads.length > 1 && sendablePayloads.some((payload) => hasDurableMedia(payload) || hasMediaDirectiveText(payload))) return;
	const recoveryPayloads = [];
	for (const payload of sendablePayloads) {
		const textAndMedia = [payload.text, ...collectDurableMediaDirectives(payload).map((mediaUrl) => `MEDIA:${mediaUrl}`)].filter((value) => Boolean(value?.trim())).join("\n");
		if (textAndMedia) recoveryPayloads.push({
			...payload,
			mediaUrl: void 0,
			mediaUrls: void 0,
			text: textAndMedia
		});
	}
	return buildPendingFinalDeliveryText(recoveryPayloads) || void 0;
}
/** Build the restart-recovery text represented by one or more final payloads. */
function buildPendingFinalDeliveryText(payloads) {
	return sanitizePendingFinalDeliveryText(payloads.filter((payload) => payload.isReasoning !== true).map((payload) => payload.text).filter((textLocal) => Boolean(textLocal)).join("\n\n"));
}
const PENDING_FINAL_DELIVERY_CLEAR_PATCH = {
	pendingFinalDelivery: void 0,
	pendingFinalDeliveryText: void 0,
	pendingFinalDeliveryCreatedAt: void 0,
	pendingFinalDeliveryLastAttemptAt: void 0,
	pendingFinalDeliveryAttemptCount: void 0,
	pendingFinalDeliveryLastError: void 0,
	pendingFinalDeliveryContext: void 0,
	pendingFinalDeliveryIntentId: void 0
};
function collectDurableMediaDirectives(payload) {
	if (payload.sensitiveMedia === true) return [];
	const mediaUrls = [...payload.mediaUrls ?? [], ...payload.mediaUrl ? [payload.mediaUrl] : []];
	const seen = /* @__PURE__ */ new Set();
	return mediaUrls.map((mediaUrl) => mediaUrl.trim()).filter((mediaUrl) => {
		if (!mediaUrl || seen.has(mediaUrl)) return false;
		seen.add(mediaUrl);
		return true;
	});
}
function hasUnsupportedDurableRecoveryShape(payload) {
	const hasMedia = hasDurableMedia(payload);
	return payload.sensitiveMedia === true || payload.trustedLocalMedia === true || payload.presentation !== void 0 || payload.interactive !== void 0 || payload.btw !== void 0 || payload.delivery !== void 0 || payload.channelData !== void 0 || payload.location !== void 0 || payload.replyToId !== void 0 || payload.replyToTag !== void 0 || payload.replyToCurrent !== void 0 || payload.audioAsVoice === true || payload.videoAsNote === true || payload.spokenText !== void 0 || payload.ttsSupplement !== void 0 || hasMedia && (payload.isCommentary === true || payload.isStatusNotice === true);
}
function hasDurableMedia(payload) {
	return Boolean(payload.mediaUrl?.trim() || payload.mediaUrls?.some((url) => url.trim()));
}
function hasMediaDirectiveText(payload) {
	return /^\s*MEDIA:/imu.test(payload.text ?? "");
}
function hasUnrecoverableNormalizedDeliveryShape(payload) {
	return payload.replyToCurrent === true || payload.replyToTag === true || payload.replyToId !== void 0 || payload.audioAsVoice === true || payload.videoAsNote === true;
}
/** Sanitizes pending final delivery text before channel-visible output. */
function sanitizePendingFinalDeliveryText(text) {
	let stripped = stripInternalMetadataForDisplay(text).trim();
	if (isSilentReplyPayloadText(stripped, "NO_REPLY")) return "";
	if (stripped && !isSilentReplyText(stripped, "NO_REPLY")) {
		const hasLeadingSilentToken = startsWithSilentToken(stripped, SILENT_REPLY_TOKEN);
		if (hasLeadingSilentToken) stripped = stripLeadingSilentToken(stripped, SILENT_REPLY_TOKEN);
		if (hasLeadingSilentToken || stripped.toLowerCase().includes("NO_REPLY".toLowerCase())) stripped = stripSilentToken(stripped, SILENT_REPLY_TOKEN);
	}
	if (!stripped.trim()) return "";
	return isSilentReplyPayloadText(stripped, "NO_REPLY") ? "" : stripped.trim();
}
//#endregion
export { normalizePendingFinalRecoveryPayloads as a, normalizePendingFinalDeliveryPayloads as i, buildPendingFinalDeliveryText as n, sanitizePendingFinalDeliveryText as o, buildRecoverablePendingFinalDeliveryText as r, PENDING_FINAL_DELIVERY_CLEAR_PATCH as t };
