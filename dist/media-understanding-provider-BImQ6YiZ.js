import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { i as describeImagesWithModelPayloadTransform, n as describeImageWithModelPayloadTransform } from "./image-runtime-CH6U2jRq.js";
import "./media-understanding-DtIAF8ue.js";
import "./string-coerce-runtime-DBMkn-gE.js";
//#region extensions/opencode/media-understanding-provider.ts
function stripOpencodeDisabledResponsesReasoningPayload(payload) {
	if (!isRecord(payload)) return;
	const reasoning = payload.reasoning;
	if (reasoning === "none") {
		delete payload.reasoning;
		return;
	}
	if (!isRecord(reasoning) || reasoning.effort !== "none") return;
	delete payload.reasoning;
}
const stripDisabledResponsesReasoning = (payload) => {
	stripOpencodeDisabledResponsesReasoningPayload(payload);
};
const opencodeMediaUnderstandingProvider = {
	id: "opencode",
	capabilities: ["image"],
	defaultModels: { image: "gpt-5-nano" },
	describeImage: (request) => describeImageWithModelPayloadTransform(request, stripDisabledResponsesReasoning),
	describeImages: (request) => describeImagesWithModelPayloadTransform(request, stripDisabledResponsesReasoning)
};
//#endregion
export { opencodeMediaUnderstandingProvider as t };
