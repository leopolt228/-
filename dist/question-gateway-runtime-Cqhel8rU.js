import { c as callGateway } from "./call-ChM1o8yU.js";
import { _ as renderMessagePresentationFallbackText } from "./payload-Br8oiJ5V.js";
import { r as registerQuestionChannelDelivery } from "./question-channel-runtime-BHcZkEDl.js";
//#region src/infra/question-gateway-resolver.ts
const QUESTION_RECORD_ID_PATTERN = /^ask_[a-f0-9]{32}$/u;
function readTerminalReason(error) {
	if (!(error instanceof Error) || error.name !== "GatewayClientRequestError") return;
	const details = error.details;
	if (!details || typeof details !== "object" || Array.isArray(details)) return;
	const reason = details.reason;
	if (reason === "QUESTION_ALREADY_TERMINAL") return "already-terminal";
	return reason === "QUESTION_NOT_FOUND" ? "not-found" : void 0;
}
/** Resolves one rendered option value against the gateway-owned question. */
async function resolveQuestionOverGateway(params) {
	if (!QUESTION_RECORD_ID_PATTERN.test(params.questionId)) throw new Error("question resolution requires a valid question record id");
	if (params.optionValue === void 0 && !Number.isInteger(params.optionIndex)) throw new Error("question resolution requires an option value or index");
	if (params.optionValue !== void 0 && !params.optionValue) throw new Error("question resolution requires a non-empty option value");
	const gatewayOptions = {
		config: params.cfg,
		url: params.gatewayUrl,
		scopes: ["operator.questions"],
		clientDisplayName: params.clientDisplayName ?? `Question (${params.senderId?.trim() || "unknown"})`
	};
	let getResult;
	try {
		getResult = await callGateway({
			...gatewayOptions,
			method: "question.get",
			params: { id: params.questionId }
		});
	} catch (error) {
		const reason = readTerminalReason(error);
		if (reason) return {
			status: "already-terminal",
			reason
		};
		throw error;
	}
	const record = getResult.question;
	if (record.status !== "pending") return {
		status: "already-terminal",
		reason: "already-terminal"
	};
	const question = record.questions.length === 1 ? record.questions[0] : void 0;
	if (!question || question.multiSelect || question.isSecret) throw new Error("question button resolution requires one tappable question");
	const optionValue = params.optionValue ?? question.options[params.optionIndex]?.label;
	if (!optionValue) throw new Error("question resolution index does not match a declared option");
	try {
		await callGateway({
			...gatewayOptions,
			method: "question.resolve",
			params: {
				id: params.questionId,
				answers: { answers: { [question.questionId]: [optionValue] } },
				resolvedBy: params.senderId?.trim() || void 0
			}
		});
	} catch (error) {
		const reason = readTerminalReason(error);
		if (reason) return {
			status: "already-terminal",
			reason
		};
		throw error;
	}
	return {
		status: "answered",
		questionId: question.questionId,
		optionValue
	};
}
//#endregion
//#region src/infra/question-reaction-runtime.ts
const QUESTION_REACTION_CHANNEL_DATA_KEY = "openclawQuestionReaction";
const QUESTION_REACTION_EMOJIS = [
	"1️⃣",
	"2️⃣",
	"3️⃣",
	"4️⃣"
];
function readAskUserQuestionId(payload) {
	const askUser = payload.channelData?.askUser;
	if (!askUser || typeof askUser !== "object" || Array.isArray(askUser)) return;
	const questionId = askUser.questionId;
	return typeof questionId === "string" && questionId ? questionId : void 0;
}
function readQuestionReactionBinding(payload) {
	const raw = payload.channelData?.[QUESTION_REACTION_CHANNEL_DATA_KEY];
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;
	const questionId = raw.questionId;
	const optionValues = raw.optionValues;
	return typeof questionId === "string" && questionId.length > 0 && Array.isArray(optionValues) && optionValues.length >= 1 && optionValues.length <= QUESTION_REACTION_EMOJIS.length && optionValues.every((value) => typeof value === "string" && value.length > 0) ? {
		questionId,
		optionValues: [...optionValues]
	} : void 0;
}
function resolveQuestionReactionIndex(reaction) {
	const index = QUESTION_REACTION_EMOJIS.indexOf(reaction);
	return index >= 0 ? index : void 0;
}
function prepareQuestionReactionPayloadForDelivery(params) {
	const questionId = readAskUserQuestionId(params.payload);
	const presentation = params.presentation ?? params.payload.presentation;
	if (!questionId || !presentation) return null;
	const buttonBlocks = presentation.blocks.filter((block) => block.type === "buttons");
	if (buttonBlocks.length !== 1) return null;
	const [buttonBlock] = buttonBlocks;
	if (!buttonBlock || buttonBlock.buttons.length < 1 || buttonBlock.buttons.length > 4) return null;
	const labels = [];
	const optionValues = [];
	for (const button of buttonBlock.buttons) {
		if (button.action?.type !== "question" || button.action.questionId !== questionId || !button.action.optionValue) return null;
		labels.push(button.label);
		optionValues.push(button.action.optionValue);
	}
	const questionBlock = presentation.blocks.find((block) => block.type === "text");
	const prompt = renderMessagePresentationFallbackText({ presentation: {
		...presentation,
		blocks: questionBlock ? [questionBlock] : []
	} });
	const reactionHint = labels.map((label, index) => `${QUESTION_REACTION_EMOJIS[index]} ${label}`).join("\n");
	return {
		...params.payload,
		text: `${prompt}\n\nReact with:\n${reactionHint}`,
		presentation: void 0,
		presentationTextMode: void 0,
		channelData: {
			...params.payload.channelData,
			[QUESTION_REACTION_CHANNEL_DATA_KEY]: {
				questionId,
				optionValues
			}
		}
	};
}
async function resolveQuestionReactionOverGateway(params) {
	return await resolveQuestionOverGateway(params);
}
//#endregion
//#region src/plugin-sdk/question-gateway-runtime.ts
/** Runtime SDK subpath for Gateway-backed ask_user question controls. */
const questionGatewayRuntime = {
	resolveOption: resolveQuestionOverGateway,
	reactionEmojis: QUESTION_REACTION_EMOJIS,
	prepareReactionPayloadForDelivery: prepareQuestionReactionPayloadForDelivery,
	readAskUserQuestionId,
	readReactionBinding: readQuestionReactionBinding,
	resolveReactionIndex: resolveQuestionReactionIndex,
	resolveReaction: resolveQuestionReactionOverGateway,
	registerChannelDelivery: registerQuestionChannelDelivery
};
//#endregion
export { questionGatewayRuntime as t };
