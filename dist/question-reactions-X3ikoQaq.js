import { t as questionGatewayRuntime } from "./question-gateway-runtime-Cqhel8rU.js";
import { t as resolveIMessageReactionContext } from "./reaction-context-DaNrZqYo.js";
//#region extensions/imessage/src/question-reactions.ts
const TARGET_TTL_MS = 1440 * 60 * 1e3;
const targets = /* @__PURE__ */ new Map();
function storeTarget(key, binding) {
	const existing = targets.get(key);
	if (existing) clearTimeout(existing.cleanupTimer);
	const target = {
		...binding,
		terminal: false,
		expiresAtMs: Date.now() + TARGET_TTL_MS,
		cleanupTimer: setTimeout(() => {
			if (targets.get(key) === target) targets.delete(key);
		}, TARGET_TTL_MS)
	};
	target.cleanupTimer.unref?.();
	targets.set(key, target);
	questionGatewayRuntime.registerChannelDelivery({
		questionId: binding.questionId,
		deliveryId: `imessage-reaction:${key}`,
		finalize: () => {
			target.terminal = true;
		}
	});
}
function normalizeGuid(value) {
	return value.trim().replace(/^p:\d+\//iu, "");
}
function buildKey(accountId, messageGuid) {
	const account = accountId.trim();
	const guid = normalizeGuid(messageGuid);
	return account && guid ? `${account}:${guid}` : null;
}
function reactionCandidates(message, bodyText) {
	const reaction = resolveIMessageReactionContext(message, bodyText);
	if (!reaction) return null;
	const guids = Array.from(new Set([...reaction.targetGuids ?? [], reaction.targetGuid ?? ""].map(normalizeGuid).filter(Boolean)));
	return guids.length > 0 ? {
		action: reaction.action,
		emoji: reaction.emoji,
		guids
	} : null;
}
function registerIMessageQuestionReactionTargetForDeliveredPayload(params) {
	const binding = questionGatewayRuntime.readReactionBinding(params.payload);
	if (params.target.channel !== "imessage" || !binding) return false;
	let registered = false;
	for (const result of params.results) {
		if (result.channel !== "imessage") continue;
		const guid = typeof result.meta?.imessageMessageGuid === "string" ? result.meta.imessageMessageGuid : result.messageId;
		const key = buildKey(params.accountId, guid);
		if (!key || /^\d+$/u.test(normalizeGuid(guid))) continue;
		storeTarget(key, binding);
		registered = true;
	}
	return registered;
}
function hasIMessageQuestionReactionTarget(params) {
	const reaction = reactionCandidates(params.message, params.bodyText);
	if (!reaction || reaction.action !== "added" || questionGatewayRuntime.resolveReactionIndex(reaction.emoji) === void 0) return false;
	return reaction.guids.some((guid) => {
		const key = buildKey(params.accountId, guid);
		return key ? targets.has(key) : false;
	});
}
async function maybeResolveIMessageQuestionReaction(params) {
	const reaction = reactionCandidates(params.message, params.bodyText);
	const optionIndex = reaction ? questionGatewayRuntime.resolveReactionIndex(reaction.emoji) : void 0;
	if (!reaction || reaction.action === "removed" || optionIndex === void 0) return false;
	let target;
	for (const guid of reaction.guids) {
		const key = buildKey(params.accountId, guid);
		target = key ? targets.get(key) : void 0;
		if (target) break;
	}
	if (!target) return false;
	if (target.expiresAtMs <= Date.now() || target.terminal) {
		target.terminal = true;
		params.logDebug?.(`imessage: stale question reaction ignored id=${target.questionId}`);
		return true;
	}
	const optionValue = target.optionValues[optionIndex];
	if (!optionValue) {
		params.logDebug?.(`imessage: out-of-range question reaction ignored id=${target.questionId}`);
		return true;
	}
	try {
		const result = await questionGatewayRuntime.resolveReaction({
			cfg: params.cfg,
			questionId: target.questionId,
			optionValue,
			senderId: params.senderId,
			gatewayUrl: params.gatewayUrl,
			clientDisplayName: `iMessage question (${params.senderId})`
		});
		target.terminal = result?.status === "answered" || result?.status === "already-terminal";
		if (result?.status === "already-terminal") params.logDebug?.(`imessage: stale question reaction ignored id=${target.questionId}`);
	} catch (error) {
		params.logDebug?.(`imessage: question reaction failed id=${target.questionId}: ${String(error)}`);
	}
	return true;
}
function clearIMessageQuestionReactionTargetsForTest() {
	for (const target of targets.values()) clearTimeout(target.cleanupTimer);
	targets.clear();
}
//#endregion
export { registerIMessageQuestionReactionTargetForDeliveredPayload as i, hasIMessageQuestionReactionTarget as n, maybeResolveIMessageQuestionReaction as r, clearIMessageQuestionReactionTargetsForTest as t };
