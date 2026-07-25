import { S as resolveMessagePresentationButtonAction, c as isMessagePresentationInteractiveBlock, d as normalizeLegacyInteractiveReply, f as normalizeMessagePresentation, h as reduceLegacyInteractiveReply } from "./payload-Br8oiJ5V.js";
import { g as parseExecApprovalCommandText } from "./exec-approval-reply-DHhrBmrX.js";
import "./approval-reply-runtime-Du3DhcMI.js";
import { a as buildTelegramApprovalCallbackData, l as rewriteTelegramApprovalDecisionAlias, n as buildTelegramOpaqueCallbackData, s as hasTelegramApprovalCallbackPrefix, t as buildTelegramNativeCommandCallbackData, u as sanitizeTelegramCallbackData } from "./native-command-callback-data-CXJqZx00.js";
//#region extensions/telegram/src/question-callback-data.ts
const TELEGRAM_QUESTION_CALLBACK_PREFIX = "tgq1:";
const TELEGRAM_CALLBACK_DATA_MAX_BYTES = 64;
const QUESTION_RECORD_ID_PATTERN = /^ask_[a-f0-9]{32}$/u;
function hasTelegramQuestionCallbackPrefix(data) {
	return data?.startsWith(TELEGRAM_QUESTION_CALLBACK_PREFIX) === true;
}
function buildTelegramQuestionCallbackData(callback) {
	if (!QUESTION_RECORD_ID_PATTERN.test(callback.questionId) || !Number.isInteger(callback.optionIndex) || callback.optionIndex < 0 || callback.optionIndex > 3) return;
	const data = `${TELEGRAM_QUESTION_CALLBACK_PREFIX}${callback.questionId}:${callback.optionIndex}`;
	return Buffer.byteLength(data, "utf8") <= TELEGRAM_CALLBACK_DATA_MAX_BYTES ? data : void 0;
}
function parseTelegramQuestionCallbackData(data) {
	if (!hasTelegramQuestionCallbackPrefix(data) || !data || Buffer.byteLength(data, "utf8") > TELEGRAM_CALLBACK_DATA_MAX_BYTES) return null;
	const match = /^tgq1:(ask_[a-f0-9]{32}):([0-3])$/u.exec(data);
	return match?.[1] && match[2] ? {
		questionId: match[1],
		optionIndex: Number(match[2])
	} : null;
}
//#endregion
//#region extensions/telegram/src/button-types.ts
const TELEGRAM_INTERACTIVE_ROW_SIZE = 3;
function toTelegramButtonStyle(style) {
	return style === "danger" || style === "success" || style === "primary" ? style : void 0;
}
function toTelegramInlineButton(button, optionIndex, options) {
	const style = toTelegramButtonStyle(button.style);
	const action = resolveMessagePresentationButtonAction(button);
	if (!action) return;
	if (action.type === "url") return {
		text: button.label,
		url: action.url,
		style
	};
	if (action.type === "web-app") return options?.allowWebAppButtons === true && action.url ? {
		text: button.label,
		web_app: { url: action.url },
		style
	} : void 0;
	if (action.type === "approval") {
		const callbackData = buildTelegramApprovalCallbackData(action);
		return callbackData ? {
			text: button.label,
			callback_data: callbackData,
			style
		} : void 0;
	}
	if (action.type === "question") {
		const callbackData = buildTelegramQuestionCallbackData({
			questionId: action.questionId,
			optionIndex
		});
		return callbackData ? {
			text: button.label,
			callback_data: callbackData,
			style
		} : void 0;
	}
	if (action.type === "command") {
		const command = rewriteTelegramApprovalDecisionAlias(action.command.trim());
		const callbackData = (command ? sanitizeTelegramCallbackData(buildTelegramNativeCommandCallbackData(command)) : void 0) ?? (parseExecApprovalCommandText(command) ? sanitizeTelegramCallbackData(command) : void 0);
		return callbackData ? {
			text: button.label,
			callback_data: callbackData,
			style
		} : void 0;
	}
	const normalizedCallbackValue = action.value.trim();
	const callbackData = sanitizeTelegramCallbackData(Boolean(button.action) || hasTelegramApprovalCallbackPrefix(normalizedCallbackValue) || hasTelegramQuestionCallbackPrefix(normalizedCallbackValue) ? buildTelegramOpaqueCallbackData(action.value) : action.value);
	return callbackData ? {
		text: button.label,
		callback_data: callbackData,
		style
	} : void 0;
}
function chunkInteractiveButtons(buttons, rows, options) {
	for (let i = 0; i < buttons.length; i += TELEGRAM_INTERACTIVE_ROW_SIZE) {
		const row = buttons.slice(i, i + TELEGRAM_INTERACTIVE_ROW_SIZE).map((button, offset) => toTelegramInlineButton(button, i + offset, options)).filter((button) => Boolean(button));
		if (row.length > 0) rows.push(row);
	}
}
/**
* @deprecated Use buildTelegramPresentationButtons with MessagePresentation.
*/
function buildTelegramInteractiveButtons(interactive, options) {
	const rows = reduceLegacyInteractiveReply(interactive, [], (state, block) => {
		if (block.type === "buttons") {
			chunkInteractiveButtons(block.buttons, state, options);
			return state;
		}
		if (block.type === "select") chunkInteractiveButtons(block.options.map((option) => ({
			label: option.label,
			action: option.action,
			value: option.value
		})), state);
		return state;
	});
	return rows.length > 0 ? rows : void 0;
}
/** Convert portable presentation controls to Telegram inline keyboard rows. */
function buildTelegramPresentationButtons(presentation, options) {
	const rows = [];
	for (const block of presentation?.blocks ?? []) {
		if (!isMessagePresentationInteractiveBlock(block)) continue;
		if (block.type === "buttons") {
			chunkInteractiveButtons(block.buttons, rows, options);
			continue;
		}
		chunkInteractiveButtons(block.options.map((option) => ({
			label: option.label,
			action: option.action,
			value: option.value
		})), rows);
	}
	return rows.length > 0 ? rows : void 0;
}
/** Resolve Telegram inline buttons, preserving explicit and legacy button precedence. */
function resolveTelegramInlineButtons(params, options) {
	return params.buttons ?? buildTelegramInteractiveButtons(normalizeLegacyInteractiveReply(params.interactive), options) ?? buildTelegramPresentationButtons(normalizeMessagePresentation(params.presentation), options);
}
//#endregion
export { parseTelegramQuestionCallbackData as i, resolveTelegramInlineButtons as n, hasTelegramQuestionCallbackPrefix as r, buildTelegramPresentationButtons as t };
