import { i as streamSimple } from "./stream-CKgZbNR4.js";
import "./llm-23LMVVXI.js";
import { k as streamWithPayloadPatch } from "./provider-stream-shared-BiURRLUJ.js";
//#region extensions/meta/stream.ts
const META_REASONING_ENCRYPTED_CONTENT_INCLUDE = "reasoning.encrypted_content";
function ensureMetaResponsesReplayFields(payloadObj) {
	const existing = payloadObj.include;
	const include = Array.isArray(existing) ? existing.filter((entry) => typeof entry === "string") : [];
	if (!include.includes(META_REASONING_ENCRYPTED_CONTENT_INCLUDE)) include.push(META_REASONING_ENCRYPTED_CONTENT_INCLUDE);
	payloadObj.include = include;
	payloadObj.store = false;
}
function createMetaResponsesWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
		if (model.provider !== "meta" || model.api !== "openai-responses") return;
		if (!model.reasoning) return;
		ensureMetaResponsesReplayFields(payloadObj);
	});
}
function wrapMetaProviderStream(ctx) {
	if (ctx.provider !== "meta" || ctx.model?.api !== "openai-responses") return;
	return createMetaResponsesWrapper(ctx.streamFn);
}
//#endregion
export { wrapMetaProviderStream as t };
