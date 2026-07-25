import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, u as normalizeOptionalThreadValue } from "./string-coerce-DW4mBlAt.js";
import { a as channelRouteTargetsShareConversation } from "./channel-route-SmMUmIL9.js";
import { n as deliveryContextFromSession } from "./delivery-context.shared-D6zu5SGz.js";
import { n as normalizeMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-core-CjtbH3es.js";
import { t as resolveTargetPrefixedChannel } from "./channel-target-prefix-Btghjzyf.js";
import { t as resolveExplicitDeliveryTargetCompat } from "./target-parsing-loaded-DnWRrY22.js";
//#region src/infra/outbound/targets-session.ts
function resolveParsedRouteTarget(params) {
	const channel = normalizeLowercaseStringOrEmpty(params.channel);
	const rawTo = normalizeOptionalString(params.rawTarget);
	if (!channel || !rawTo) return null;
	const parsed = resolveExplicitDeliveryTargetCompat({
		channel,
		rawTarget: rawTo,
		fallbackThreadId: params.fallbackThreadId
	});
	const threadId = normalizeOptionalThreadValue(parsed?.threadId ?? params.fallbackThreadId);
	return {
		channel,
		rawTo,
		to: parsed?.to ?? rawTo,
		...threadId != null ? { threadId } : {},
		chatType: parsed?.chatType
	};
}
/**
* Resolves the effective outbound target for a session-scoped delivery request.
*/
function resolveSessionDeliveryTarget(params) {
	const context = deliveryContextFromSession(params.entry);
	const sessionLastChannel = context?.channel && isDeliverableMessageChannel(context.channel) ? context.channel : void 0;
	const parsedSessionTarget = sessionLastChannel ? resolveParsedRouteTarget({
		channel: sessionLastChannel,
		rawTarget: context?.to,
		fallbackThreadId: context?.threadId
	}) : null;
	const hasTurnSourceChannel = params.turnSourceChannel != null;
	const parsedTurnSourceTarget = hasTurnSourceChannel && params.turnSourceChannel ? resolveParsedRouteTarget({
		channel: params.turnSourceChannel,
		rawTarget: params.turnSourceTo,
		fallbackThreadId: params.turnSourceThreadId
	}) : null;
	const hasTurnSourceThreadId = parsedTurnSourceTarget?.threadId != null;
	const lastChannel = hasTurnSourceChannel ? params.turnSourceChannel : sessionLastChannel;
	const lastTo = hasTurnSourceChannel ? parsedTurnSourceTarget?.to ?? params.turnSourceTo : parsedSessionTarget?.to ?? context?.to;
	const lastAccountId = hasTurnSourceChannel ? params.turnSourceAccountId : context?.accountId;
	const turnToMatchesSession = !params.turnSourceTo || !context?.to || params.turnSourceChannel === sessionLastChannel && channelRouteTargetsShareConversation({
		left: parsedTurnSourceTarget,
		right: parsedSessionTarget
	});
	const lastThreadId = hasTurnSourceThreadId ? parsedTurnSourceTarget?.threadId : hasTurnSourceChannel && (params.turnSourceChannel !== sessionLastChannel || !turnToMatchesSession) ? void 0 : parsedSessionTarget?.threadId;
	const rawRequested = params.requestedChannel ?? "last";
	const requested = rawRequested === "last" ? "last" : normalizeMessageChannel(rawRequested);
	const requestedChannel = requested === "last" ? "last" : requested && isDeliverableMessageChannel(requested) ? requested : void 0;
	const rawExplicitTo = typeof params.explicitTo === "string" && params.explicitTo.trim() ? params.explicitTo.trim() : void 0;
	const explicitPrefixedChannel = requestedChannel === "last" ? resolveTargetPrefixedChannel(rawExplicitTo) : void 0;
	let channel = explicitPrefixedChannel && isDeliverableMessageChannel(explicitPrefixedChannel) ? explicitPrefixedChannel : requestedChannel === "last" ? lastChannel : requestedChannel;
	if (!channel && params.fallbackChannel && isDeliverableMessageChannel(params.fallbackChannel)) channel = params.fallbackChannel;
	const parsedExplicitTarget = channel && rawExplicitTo ? resolveExplicitDeliveryTargetCompat({
		channel,
		rawTarget: rawExplicitTo,
		fallbackThreadId: params.explicitThreadId
	}) : null;
	const explicitTo = parsedExplicitTarget?.to ?? rawExplicitTo;
	const explicitThreadId = normalizeOptionalThreadValue(parsedExplicitTarget?.threadId ?? params.explicitThreadId);
	const explicitThreadIdSource = explicitThreadId != null ? "explicit" : void 0;
	let to = explicitTo;
	if (!to && lastTo) {
		if (channel && channel === lastChannel) to = lastTo;
		else if (params.allowMismatchedLastTo) to = lastTo;
	}
	const mode = params.mode ?? (explicitTo ? "explicit" : "implicit");
	const accountId = channel && channel === lastChannel ? lastAccountId : void 0;
	const threadId = channel && channel === lastChannel ? mode === "heartbeat" ? hasTurnSourceThreadId ? params.turnSourceThreadId : void 0 : lastThreadId : void 0;
	return {
		channel,
		to,
		accountId,
		threadId: explicitThreadId ?? threadId,
		threadIdSource: explicitThreadIdSource ?? (threadId != null ? hasTurnSourceThreadId ? "turn-source" : "session" : void 0),
		mode,
		lastChannel,
		lastTo,
		lastAccountId,
		lastThreadId
	};
}
//#endregion
export { resolveSessionDeliveryTarget as t };
