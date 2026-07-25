import { E as normalizeOutboundReplyPayload } from "./reply-payload-CPcXnHho.js";
import { i as dispatchReplyFromConfig, s as withReplyDispatcher } from "./dispatch-DbeuLGKb.js";
import { a as runChannelInboundEvent$1, c as deliverInboundReplyWithMessageSendContext, l as isDurableInboundReplyDeliveryHandled, n as dispatchChannelInboundReply$1, o as runPreparedInboundReply$1, r as dispatchChannelInboundTurn$1, u as throwIfDurableInboundReplyDeliveryFailed } from "./kernel-BM-Mkfv5.js";
//#region src/channels/message/inbound-reply-dispatch.ts
/**
* Shared inbound reply dispatch helpers for channel message adapters.
*/
/** Run an already prepared inbound reply through shared session-record + dispatch ordering. */
async function runPreparedInboundReply(params) {
	return await runPreparedInboundReply$1(params);
}
/** @deprecated Use `runPreparedInboundReply`. */
async function runPreparedInboundReplyTurn(params) {
	return await runPreparedInboundReply(params);
}
async function runChannelInboundEvent(params) {
	return await runChannelInboundEvent$1(params);
}
/** @deprecated Use `runChannelInboundEvent`. */
async function runInboundReplyTurn(params) {
	return await runChannelInboundEvent(params);
}
async function dispatchChannelInboundReply(params) {
	return await dispatchChannelInboundReply$1(params);
}
async function dispatchChannelInboundTurn(params) {
	return await dispatchChannelInboundTurn$1(params);
}
/** Run `dispatchReplyFromConfig` with a dispatcher that always gets its settled callback. */
async function dispatchReplyFromConfigWithSettledDispatcher(params) {
	return await withReplyDispatcher({
		dispatcher: params.dispatcher,
		onSettled: params.onSettled,
		run: () => dispatchReplyFromConfig({
			ctx: params.ctxPayload,
			cfg: params.cfg,
			dispatcher: params.dispatcher,
			replyOptions: params.replyOptions,
			configOverride: params.configOverride
		})
	});
}
/** Assemble the common inbound reply dispatch dependencies for a resolved route. */
function buildInboundReplyDispatchBase(params) {
	return {
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		agentId: params.route.agentId,
		routeSessionKey: params.route.sessionKey,
		storePath: params.storePath,
		ctxPayload: params.ctxPayload,
		recordInboundSession: params.core.channel.session.recordInboundSession,
		dispatchReplyWithBufferedBlockDispatcher: params.core.channel.reply.dispatchReplyWithBufferedBlockDispatcher
	};
}
/**
* Resolve the shared dispatch base and immediately record + dispatch one inbound reply turn.
*
* @deprecated Compatibility reply-dispatch bridge. New channel plugins should
* expose a `message` adapter via `defineChannelMessageAdapter(...)` and route
* sends through `deliverInboundReplyWithMessageSendContext(...)` or
* `sendDurableMessageBatch(...)`.
*/
async function dispatchInboundReplyWithBase(params) {
	await recordInboundSessionAndDispatchReply({
		...buildInboundReplyDispatchBase(params),
		deliver: params.deliver,
		durable: params.durable,
		onRecordError: params.onRecordError,
		onDispatchError: params.onDispatchError,
		replyOptions: params.replyOptions
	});
}
/**
* Record the inbound session first, then dispatch the reply using normalized outbound delivery.
*
* @deprecated Compatibility reply-dispatch bridge. New channel plugins should
* expose a `message` adapter via `defineChannelMessageAdapter(...)` and route
* sends through `deliverInboundReplyWithMessageSendContext(...)` or
* `sendDurableMessageBatch(...)`.
*/
async function recordInboundSessionAndDispatchReply(params) {
	await dispatchChannelInboundReply$1({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		agentId: params.agentId,
		routeSessionKey: params.routeSessionKey,
		storePath: params.storePath,
		ctxPayload: params.ctxPayload,
		recordInboundSession: params.recordInboundSession,
		dispatchReplyWithBufferedBlockDispatcher: params.dispatchReplyWithBufferedBlockDispatcher,
		delivery: {
			preparePayload: (payload) => payload && typeof payload === "object" ? normalizeOutboundReplyPayload(payload) : {},
			deliver: async (payload, info) => {
				if (params.durable) {
					const durable = await deliverInboundReplyWithMessageSendContext({
						cfg: params.cfg,
						channel: params.channel,
						accountId: params.accountId,
						agentId: params.agentId,
						ctxPayload: params.ctxPayload,
						payload,
						info,
						...params.durable
					});
					throwIfDurableInboundReplyDeliveryFailed(durable);
					if (isDurableInboundReplyDeliveryHandled(durable)) return durable.delivery;
				}
				return await params.deliver(payload);
			},
			onError: params.onDispatchError
		},
		replyPipeline: {},
		replyOptions: params.replyOptions,
		record: { onRecordError: params.onRecordError }
	});
}
//#endregion
export { dispatchReplyFromConfigWithSettledDispatcher as a, runInboundReplyTurn as c, dispatchInboundReplyWithBase as i, runPreparedInboundReply as l, dispatchChannelInboundReply as n, recordInboundSessionAndDispatchReply as o, dispatchChannelInboundTurn as r, runChannelInboundEvent as s, buildInboundReplyDispatchBase as t, runPreparedInboundReplyTurn as u };
