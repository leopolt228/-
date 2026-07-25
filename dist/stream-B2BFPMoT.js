import { h as COPILOT_INTEGRATION_ID, v as buildCopilotIdeHeaders } from "./provider-request-config-DrrUROfX.js";
import { M as applyAnthropicEphemeralCacheControlMarkers, k as streamWithPayloadPatch } from "./provider-stream-shared-BiURRLUJ.js";
import "./provider-auth-Bnib2g6h.js";
import { r as stripCopilotAssistantThinkingMessages } from "./replay-policy-1f-L78bK.js";
import { t as rewriteCopilotResponsePayloadConnectionBoundIds } from "./connection-bound-ids-9PUJyOyi.js";
//#region extensions/github-copilot/stream.ts
function containsCopilotContentType(value, type) {
	if (Array.isArray(value)) return value.some((item) => containsCopilotContentType(item, type));
	if (!value || typeof value !== "object") return false;
	const entry = value;
	return entry.type === type || containsCopilotContentType(entry.content, type);
}
function inferCopilotInitiator(messages) {
	const last = messages[messages.length - 1];
	if (!last) return "user";
	if (last.role === "user" && containsCopilotContentType(last.content, "tool_result")) return "agent";
	return last.role === "user" ? "user" : "agent";
}
function hasCopilotVisionInput(messages) {
	return messages.some((message) => {
		if (message.role === "user" && Array.isArray(message.content)) return message.content.some((item) => containsCopilotContentType(item, "image"));
		if (message.role === "toolResult" && Array.isArray(message.content)) return message.content.some((item) => containsCopilotContentType(item, "image"));
		return false;
	});
}
function buildCopilotDynamicHeaders(params) {
	return {
		...buildCopilotIdeHeaders(),
		"Copilot-Integration-Id": COPILOT_INTEGRATION_ID,
		"Openai-Organization": "github-copilot",
		"x-initiator": inferCopilotInitiator(params.messages),
		...params.hasImages ? { "Copilot-Vision-Request": "true" } : {}
	};
}
function patchOnPayloadResult(result) {
	if (result && typeof result === "object" && "then" in result) return Promise.resolve(result).then((next) => {
		rewriteCopilotResponsePayloadConnectionBoundIds(next);
		return next;
	});
	rewriteCopilotResponsePayloadConnectionBoundIds(result);
	return result;
}
function buildCopilotRequestHeaders(context, headers) {
	return {
		...buildCopilotDynamicHeaders({
			messages: context.messages,
			hasImages: hasCopilotVisionInput(context.messages)
		}),
		...headers
	};
}
function patchCopilotAnthropicPayload(payload) {
	if (Array.isArray(payload.messages)) payload.messages = stripCopilotAssistantThinkingMessages(payload.messages);
	applyAnthropicEphemeralCacheControlMarkers(payload);
}
function wrapCopilotAnthropicStream(baseStreamFn) {
	if (!baseStreamFn) return;
	const underlying = baseStreamFn;
	return (model, context, options) => {
		if (model.provider !== "github-copilot" || model.api !== "anthropic-messages") return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, {
			...options,
			headers: buildCopilotRequestHeaders(context, options?.headers)
		}, patchCopilotAnthropicPayload);
	};
}
function wrapCopilotOpenAIResponsesStream(baseStreamFn) {
	if (!baseStreamFn) return;
	const underlying = baseStreamFn;
	return (model, context, options) => {
		if (model.provider !== "github-copilot" || model.api !== "openai-responses") return underlying(model, context, options);
		const originalOnPayload = options?.onPayload;
		const wrappedOptions = {
			...options,
			headers: buildCopilotRequestHeaders(context, options?.headers),
			onPayload: (payload, payloadModel) => {
				rewriteCopilotResponsePayloadConnectionBoundIds(payload);
				return patchOnPayloadResult(originalOnPayload?.(payload, payloadModel));
			}
		};
		return underlying(model, context, wrappedOptions);
	};
}
function wrapCopilotOpenAICompletionsStream(baseStreamFn) {
	if (!baseStreamFn) return;
	const underlying = baseStreamFn;
	return (model, context, options) => {
		if (model.provider !== "github-copilot" || model.api !== "openai-completions") return underlying(model, context, options);
		return underlying(model, context, {
			...options,
			headers: buildCopilotRequestHeaders(context, options?.headers)
		});
	};
}
function wrapCopilotProviderStream(ctx) {
	return wrapCopilotOpenAICompletionsStream(wrapCopilotOpenAIResponsesStream(wrapCopilotAnthropicStream(ctx.streamFn)));
}
//#endregion
export { wrapCopilotProviderStream as n, wrapCopilotAnthropicStream as t };
