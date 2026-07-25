import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, p as readStringValue, t as hasNonEmptyString } from "./string-coerce-DW4mBlAt.js";
import { a as isThinkingLikeBlock, n as extractToolResultId, r as extractToolResultIds, t as extractToolCallsFromAssistant } from "./tool-call-id-Y7Lz_-rX.js";
import { n as normalizeAllowedToolNames, t as isAllowedToolCallName } from "./tool-call-shared-BoRDqDVC.js";
//#region src/agents/session-transcript-repair.ts
/**
* Transcript repair helpers for tool-call replay.
*
* Normalizes raw tool-call blocks and synthesizes missing tool results without rewriting trusted local payloads.
*/
const RAW_TOOL_CALL_BLOCK_TYPES = /* @__PURE__ */ new Set([
	"toolCall",
	"toolUse",
	"functionCall",
	"tool_call",
	"tool_use",
	"function_call"
]);
function isRawToolCallBlock(block) {
	if (!block || typeof block !== "object") return false;
	const type = block.type;
	return typeof type === "string" && RAW_TOOL_CALL_BLOCK_TYPES.has(type);
}
function hasToolCallInput(block) {
	const hasInput = "input" in block ? block.input !== void 0 && block.input !== null : false;
	const hasArguments = "arguments" in block ? block.arguments !== void 0 && block.arguments !== null : false;
	return hasInput || hasArguments;
}
function hasToolCallId(block) {
	return hasNonEmptyString(block.id) || hasNonEmptyString(block.call_id) || hasNonEmptyString(block.toolCallId) || hasNonEmptyString(block.toolUseId) || hasNonEmptyString(block.tool_call_id) || hasNonEmptyString(block.tool_use_id);
}
function hasPartialJson(block) {
	return typeof block.partialJson === "string";
}
function isCompleteJsonObject(value) {
	try {
		const parsed = JSON.parse(value);
		return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed);
	} catch {
		return false;
	}
}
function isFinalizedOpenAIResponsesToolCall(message, block) {
	if (message.role !== "assistant" || !("stopReason" in message) || message.stopReason !== "toolUse" || !hasPartialJson(block) || typeof block.id !== "string" || "input" in block || !block.arguments || typeof block.arguments !== "object" || Array.isArray(block.arguments) || !isCompleteJsonObject(block.partialJson) && (block.partialJson.trim() !== "" || Object.keys(block.arguments).length > 0)) return false;
	const separator = block.id.indexOf("|");
	return separator > 0 && separator < block.id.length - 1;
}
function sanitizeToolCallBlock(block) {
	const rawName = readStringValue(block.name);
	const trimmedName = rawName?.trim();
	const hasTrimmedName = typeof trimmedName === "string" && trimmedName.length > 0;
	const normalizedName = hasTrimmedName ? trimmedName : void 0;
	const nameChanged = hasTrimmedName && rawName !== trimmedName;
	if (!nameChanged) return block;
	const next = { ...block };
	if (nameChanged && normalizedName) next.name = normalizedName;
	return next;
}
function countRawToolCallBlocks(content) {
	let count = 0;
	for (const block of content) if (isRawToolCallBlock(block)) count += 1;
	return count;
}
function isReplaySafeThinkingAssistantTurn(content, allowedToolNames) {
	let sawToolCall = false;
	const seenToolCallIds = /* @__PURE__ */ new Set();
	for (const block of content) {
		if (!isRawToolCallBlock(block)) continue;
		sawToolCall = true;
		const toolCallId = typeof block.id === "string" ? block.id.trim() : "";
		if (!hasToolCallInput(block) || hasPartialJson(block) || !toolCallId || seenToolCallIds.has(toolCallId) || !isAllowedToolCallName(block.name, allowedToolNames)) return false;
		seenToolCallIds.add(toolCallId);
		if (sanitizeToolCallBlock(block) !== block) return false;
	}
	return sawToolCall;
}
function hasSessionsSpawnAttachmentToolCall(content) {
	for (const block of content) {
		if (!isRawToolCallBlock(block) || block.name !== "sessions_spawn") continue;
		const input = block.input;
		if (!input || typeof input !== "object") continue;
		const attachments = input.attachments;
		if (Array.isArray(attachments) && attachments.length > 0) return true;
	}
	return false;
}
const DEFAULT_MISSING_TOOL_RESULT_TEXT = "[openclaw] missing tool result in session history; inserted synthetic error result for transcript repair.";
const SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY = "openclawSyntheticMissingToolResult";
function makeMissingToolResult(params) {
	return {
		role: "toolResult",
		toolCallId: params.toolCallId,
		toolName: params.toolName ?? "unknown",
		content: [{
			type: "text",
			text: params.text ?? DEFAULT_MISSING_TOOL_RESULT_TEXT
		}],
		details: { [SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY]: true },
		isError: true,
		timestamp: Date.now()
	};
}
function isSyntheticMissingToolResult(msg) {
	if (!msg.isError) return false;
	const details = msg.details;
	if (details && typeof details === "object" && details[SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY] === true) return true;
	const content = msg.content;
	if (!Array.isArray(content)) return false;
	return content.some((block) => typeof block === "object" && block !== null && block.type === "text" && block.text === DEFAULT_MISSING_TOOL_RESULT_TEXT);
}
function normalizeToolResultName(message, fallbackName) {
	const rawToolName = message.toolName;
	const normalizedToolName = normalizeOptionalString(rawToolName);
	if (normalizedToolName) {
		if (rawToolName === normalizedToolName) return message;
		return {
			...message,
			toolName: normalizedToolName
		};
	}
	const normalizedFallback = normalizeOptionalString(fallbackName);
	if (normalizedFallback) return {
		...message,
		toolName: normalizedFallback
	};
	if (typeof rawToolName === "string") return {
		...message,
		toolName: "unknown"
	};
	return message;
}
function normalizeLegacyToolResultId(message, toolCalls) {
	if (extractToolResultId(message) || toolCalls.length !== 1) return message;
	const [toolCall] = toolCalls;
	if (!toolCall) return message;
	const toolResultName = normalizeOptionalString(message.toolName);
	const toolCallName = normalizeOptionalString(toolCall.name);
	if (toolResultName && toolCallName && toolResultName !== toolCallName) return message;
	return {
		...message,
		toolCallId: toolCall.id,
		isError: true
	};
}
function stripToolResultDetails(messages) {
	let touched = false;
	const out = [];
	for (const msg of messages) {
		if (!msg || typeof msg !== "object" || msg.role !== "toolResult") {
			out.push(msg);
			continue;
		}
		if (!("details" in msg)) {
			out.push(msg);
			continue;
		}
		const sanitized = { ...msg };
		delete sanitized.details;
		touched = true;
		out.push(sanitized);
	}
	return touched ? out : messages;
}
function collectFollowingToolResults(messages, index) {
	const ids = /* @__PURE__ */ new Set();
	const assistant = messages[index];
	const currentToolCalls = assistant && typeof assistant === "object" && assistant.role === "assistant" ? extractToolCallsFromAssistant(assistant) : [];
	let sawNonToolResult = false;
	let displaced = false;
	for (let nextIndex = index + 1; nextIndex < messages.length; nextIndex += 1) {
		const message = messages[nextIndex];
		if (!message || typeof message !== "object") {
			sawNonToolResult = true;
			continue;
		}
		if (message.role === "assistant" && assistantHasToolCalls(message)) break;
		if (message.role === "toolResult") {
			const resultIds = extractToolResultIds(normalizeLegacyToolResultId(message, currentToolCalls));
			for (const id of resultIds) ids.add(id);
			displaced ||= resultIds.length > 0 && sawNonToolResult;
			continue;
		}
		sawNonToolResult = true;
	}
	return {
		ids,
		displaced
	};
}
function repairToolCallInputs(messages, options) {
	let droppedToolCalls = 0;
	let droppedAssistantMessages = 0;
	let changed = false;
	const out = [];
	const allowedToolNames = normalizeAllowedToolNames(options?.allowedToolNames);
	const allowProviderOwnedThinkingReplay = options?.allowProviderOwnedThinkingReplay === true;
	const preservedThinkingToolCallIds = /* @__PURE__ */ new Set();
	const priorToolCallIds = /* @__PURE__ */ new Set();
	for (const [index, msg] of messages.entries()) {
		if (!msg || typeof msg !== "object") {
			changed = true;
			continue;
		}
		if (msg.role !== "assistant" || !Array.isArray(msg.content)) {
			out.push(msg);
			continue;
		}
		if (allowProviderOwnedThinkingReplay && msg.content.some((block) => isThinkingLikeBlock(block)) && countRawToolCallBlocks(msg.content) > 0) {
			const replaySafeToolCalls = extractToolCallsFromAssistant(msg);
			const followingToolResults = collectFollowingToolResults(messages, index);
			if (isReplaySafeThinkingAssistantTurn(msg.content, allowedToolNames) && replaySafeToolCalls.every((toolCall) => !preservedThinkingToolCallIds.has(toolCall.id) && (!hasSessionsSpawnAttachmentToolCall(msg.content) || followingToolResults.ids.has(toolCall.id)) && (!followingToolResults.displaced || !priorToolCallIds.has(toolCall.id)))) {
				for (const toolCall of replaySafeToolCalls) {
					preservedThinkingToolCallIds.add(toolCall.id);
					priorToolCallIds.add(toolCall.id);
				}
				changed ||= followingToolResults.displaced;
				out.push(msg);
			} else {
				droppedToolCalls += countRawToolCallBlocks(msg.content);
				droppedAssistantMessages += 1;
				changed = true;
			}
			continue;
		}
		const nextContent = [];
		let droppedInMessage = 0;
		let messageChanged = false;
		for (const block of msg.content) {
			if (isRawToolCallBlock(block)) {
				if (!hasToolCallInput(block) || !hasToolCallId(block) || !isAllowedToolCallName(block.name, allowedToolNames)) {
					droppedToolCalls += 1;
					droppedInMessage += 1;
					changed = true;
					messageChanged = true;
					continue;
				}
			}
			let workBlock = block;
			if (isRawToolCallBlock(block) && hasPartialJson(block)) {
				if (!isFinalizedOpenAIResponsesToolCall(msg, block)) {
					droppedToolCalls += 1;
					droppedInMessage += 1;
					changed = true;
					messageChanged = true;
					continue;
				}
				const stripped = { ...block };
				delete stripped.partialJson;
				workBlock = stripped;
				changed = true;
				messageChanged = true;
			}
			if (isRawToolCallBlock(workBlock)) {
				if (RAW_TOOL_CALL_BLOCK_TYPES.has(workBlock.type ?? "")) {
					if (normalizeLowercaseStringOrEmpty(typeof workBlock.name === "string" ? workBlock.name.trim() : void 0) === "sessions_spawn") {
						const sanitized = sanitizeToolCallBlock(workBlock);
						if (sanitized !== workBlock) {
							changed = true;
							messageChanged = true;
						}
						nextContent.push(sanitized);
					} else if (typeof workBlock.name === "string") {
						const rawName = workBlock.name;
						const trimmedName = rawName.trim();
						if (rawName !== trimmedName && trimmedName) {
							const renamed = {
								...workBlock,
								name: trimmedName
							};
							nextContent.push(renamed);
							changed = true;
							messageChanged = true;
						} else nextContent.push(workBlock);
					} else nextContent.push(workBlock);
					continue;
				}
			}
			nextContent.push(workBlock);
		}
		if (droppedInMessage > 0) {
			if (nextContent.length === 0) {
				droppedAssistantMessages += 1;
				changed = true;
				continue;
			}
			const nextMessage = {
				...msg,
				content: nextContent
			};
			for (const toolCall of extractToolCallsFromAssistant(nextMessage)) priorToolCallIds.add(toolCall.id);
			out.push(nextMessage);
			continue;
		}
		if (messageChanged) {
			const nextMessage = {
				...msg,
				content: nextContent
			};
			for (const toolCall of extractToolCallsFromAssistant(nextMessage)) priorToolCallIds.add(toolCall.id);
			out.push(nextMessage);
			continue;
		}
		for (const toolCall of extractToolCallsFromAssistant(msg)) priorToolCallIds.add(toolCall.id);
		out.push(msg);
	}
	return {
		messages: changed ? out : messages,
		droppedToolCalls,
		droppedAssistantMessages
	};
}
function sanitizeToolCallInputs(messages, options) {
	return repairToolCallInputs(messages, options).messages;
}
function sanitizeToolUseResultPairing(messages, options) {
	return repairToolUseResultPairing(messages, options).messages;
}
function shouldDropErroredAssistantResults(options) {
	return options?.erroredAssistantResultPolicy === "drop";
}
function assistantHasToolCalls(message) {
	if (!message || typeof message !== "object" || message.role !== "assistant") return false;
	return extractToolCallsFromAssistant(message).length > 0;
}
function buildToolUseFrames(messages, onDuplicate) {
	const frameStartIndexes = [];
	for (const [index, message] of messages.entries()) if (message && typeof message === "object" && assistantHasToolCalls(message)) frameStartIndexes.push(index);
	return frameStartIndexes.map((startIndex, frameIndex) => {
		const assistant = messages[startIndex];
		const toolCalls = extractToolCallsFromAssistant(assistant);
		const occurrences = [];
		const occurrencesById = /* @__PURE__ */ new Map();
		for (const toolCall of toolCalls) {
			const occurrence = {
				id: toolCall.id,
				name: toolCall.name
			};
			occurrences.push(occurrence);
			const sameIdGroup = occurrencesById.get(toolCall.id);
			if (sameIdGroup) sameIdGroup.occurrences.push(occurrence);
			else occurrencesById.set(toolCall.id, {
				occurrences: [occurrence],
				nextUnfilledIndex: 0,
				syntheticOccurrences: [],
				nextSyntheticIndex: 0
			});
		}
		const endIndex = frameStartIndexes[frameIndex + 1] ?? messages.length;
		const remainder = [];
		const unclaimedResults = [];
		for (let index = startIndex + 1; index < endIndex; index += 1) {
			const message = messages[index];
			if (!message || typeof message !== "object") continue;
			if (message.role !== "toolResult") {
				remainder.push(message);
				continue;
			}
			const legacyNormalized = normalizeLegacyToolResultId(message, toolCalls);
			const id = extractToolResultId(legacyNormalized);
			const sameIdGroup = id ? occurrencesById.get(id) : void 0;
			if (!id || !sameIdGroup) {
				unclaimedResults.push({
					result: legacyNormalized,
					id: id ?? void 0
				});
				continue;
			}
			const unfilledOccurrence = sameIdGroup.occurrences[sameIdGroup.nextUnfilledIndex];
			if (unfilledOccurrence) {
				unfilledOccurrence.result = normalizeToolResultName(legacyNormalized, unfilledOccurrence.name);
				sameIdGroup.nextUnfilledIndex += 1;
				if (isSyntheticMissingToolResult(unfilledOccurrence.result)) sameIdGroup.syntheticOccurrences.push(unfilledOccurrence);
				continue;
			}
			onDuplicate();
			if (!isSyntheticMissingToolResult(legacyNormalized)) {
				const replaceableOccurrence = sameIdGroup.syntheticOccurrences[sameIdGroup.nextSyntheticIndex];
				if (replaceableOccurrence) {
					sameIdGroup.nextSyntheticIndex += 1;
					replaceableOccurrence.result = normalizeToolResultName(legacyNormalized, replaceableOccurrence.name);
				}
			}
		}
		const stopReason = assistant.stopReason;
		return {
			startIndex,
			endIndex,
			assistant,
			remainder,
			unclaimedResults,
			occurrences,
			failed: stopReason === "error" || stopReason === "aborted"
		};
	});
}
function repairToolUseResultPairing(messages, options) {
	const added = [];
	let droppedDuplicateCount = 0;
	let droppedOrphanCount = 0;
	const frames = buildToolUseFrames(messages, () => {
		droppedDuplicateCount += 1;
	});
	const unresolvedById = /* @__PURE__ */ new Map();
	for (const frame of frames) {
		for (const occurrence of frame.occurrences) if (!occurrence.result || isSyntheticMissingToolResult(occurrence.result)) {
			const unresolved = unresolvedById.get(occurrence.id);
			if (unresolved) unresolved.push(occurrence);
			else unresolvedById.set(occurrence.id, [occurrence]);
		}
		for (const record of frame.unclaimedResults) {
			if (!record.id) {
				droppedOrphanCount += 1;
				continue;
			}
			const candidates = (unresolvedById.get(record.id) ?? []).filter((candidate) => !candidate.result || isSyntheticMissingToolResult(candidate.result) && !isSyntheticMissingToolResult(record.result));
			if (candidates.length !== 1) {
				droppedOrphanCount += 1;
				continue;
			}
			const [candidate] = candidates;
			if (!candidate) {
				droppedOrphanCount += 1;
				continue;
			}
			if (candidate.result) droppedDuplicateCount += 1;
			candidate.result = normalizeToolResultName(record.result, candidate.name);
		}
	}
	const out = [];
	let cursor = 0;
	const pushUnframedRange = (endIndex) => {
		for (; cursor < endIndex; cursor += 1) {
			const message = messages[cursor];
			if (!message || typeof message !== "object") continue;
			if (message.role === "toolResult") {
				droppedOrphanCount += 1;
				continue;
			}
			out.push(message);
		}
	};
	for (const frame of frames) {
		pushUnframedRange(frame.startIndex);
		cursor = frame.endIndex;
		if (!(frame.failed && shouldDropErroredAssistantResults(options))) {
			out.push(frame.assistant);
			for (const occurrence of frame.occurrences) {
				if (occurrence.result) {
					out.push(occurrence.result);
					continue;
				}
				if (frame.failed) continue;
				const missing = makeMissingToolResult({
					toolCallId: occurrence.id,
					toolName: occurrence.name,
					text: options?.missingToolResultText
				});
				occurrence.result = missing;
				added.push(missing);
				out.push(missing);
			}
		}
		out.push(...frame.remainder);
	}
	pushUnframedRange(messages.length);
	const changed = out.length !== messages.length || out.some((message, index) => message !== messages[index]);
	return {
		messages: changed ? out : messages,
		added,
		droppedDuplicateCount,
		droppedOrphanCount,
		moved: changed
	};
}
//#endregion
export { stripToolResultDetails as a, sanitizeToolUseResultPairing as i, repairToolUseResultPairing as n, sanitizeToolCallInputs as r, makeMissingToolResult as t };
