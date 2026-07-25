import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/auto-reply/reply/inbound-media.ts
/** Detects inbound media and audio facts in channel message context. */
function hasNormalizedStringEntry(values) {
	return Array.isArray(values) && values.some((value) => normalizeOptionalString(value));
}
/** Returns true when the context carries current-turn media or sticker data. */
function hasInboundMedia(ctx) {
	return Boolean(ctx.StickerMediaIncluded || ctx.Sticker || normalizeOptionalString(ctx.MediaPath) || normalizeOptionalString(ctx.MediaUrl) || hasNormalizedStringEntry(ctx.MediaPaths) || hasNormalizedStringEntry(ctx.MediaUrls) || Array.isArray(ctx.MediaTypes) && ctx.MediaTypes.length > 0);
}
/** Returns true when current-turn media still needs automatic understanding. */
function hasInboundMediaForUnderstanding(ctx) {
	if (!ctx.SkipStickerMediaUnderstanding) return hasInboundMedia(ctx);
	return [
		ctx.MediaPaths,
		ctx.MediaUrls,
		ctx.MediaTypes
	].some((values) => Array.isArray(values) && values.length > 1);
}
function normalizeMediaType(value) {
	return normalizeOptionalString(value)?.split(";", 1)[0]?.trim().toLowerCase() || void 0;
}
/** Returns true when the current turn carries structured audio media facts. */
function hasInboundAudio(ctx) {
	return [normalizeMediaType(ctx.MediaType), ...Array.isArray(ctx.MediaTypes) ? ctx.MediaTypes.map((type) => normalizeMediaType(type)) : []].filter((type) => Boolean(type)).some((type) => type === "audio" || type.startsWith("audio/"));
}
//#endregion
export { hasInboundMedia as n, hasInboundMediaForUnderstanding as r, hasInboundAudio as t };
