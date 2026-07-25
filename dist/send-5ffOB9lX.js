import { c as normalizeOptionalString, p as readStringValue, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { _ as resolveSessionAgentId } from "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { A as parseThreadSessionSuffix, E as parseAgentSessionKey, w as normalizeSessionKeyPreservingOpaquePeerIds } from "./session-key-Drrs61Fd.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { a as getRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot, x as selectApplicableRuntimeConfig } from "./runtime-snapshot-BW7iP5ad.js";
import "./operator-scopes-BHrNTqoH.js";
import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import "./message-channel-constants-BlZ7xkRW.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-DYDkUiW3.js";
import "./message-channel-CkiwT4Uh.js";
import { N as resolveMissingAgentHarnessSessionError, w as isAgentHarnessSessionKey } from "./store-DDuGv_UJ.js";
import { u as loadSessionEntry } from "./session-utils-CEU0rCPC.js";
import { s as projectOutboundPayloadPlanForMirror, t as createOutboundPayloadPlan } from "./payloads-BfQIm4rr.js";
import { a as maybeResolveIdLikeTarget } from "./target-resolver-BOFYQsKD.js";
import { t as buildOutboundSessionContext } from "./session-context-Cq_Z7k0n.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-BxhvvT09.js";
import { a as reconcileTerminalSourceReplyDelivery, c as hydrateAttachmentParamsForAction, i as mirrorDeliveredSourceReplyToTranscript, m as resolveAttachmentMediaPolicy, n as cancelTerminalSourceReplyDelivery, o as dispatchChannelMessageAction, t as beginTerminalSourceReplyDelivery } from "./source-reply-mirror-B-2zRtLs.js";
import { It as validateMessageActionParams, mn as validatePollParams, wn as validateSendParams } from "./src-Cy32TawB.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-Bjl-jS8C.js";
import { t as sendDurableMessageBatch } from "./runtime-CzinzbLb.js";
import { n as normalizePollInput } from "./polls-C-v11_tu.js";
import { r as resolveMessageChannelSelection } from "./channel-selection-DA0nSDDM.js";
import { n as ensureOutboundSessionEntry, r as resolveOutboundSessionRoute } from "./outbound-session-D2Im-P4a.js";
import { i as resolveOutboundTarget } from "./targets-B6GGowJc.js";
import { t as extractToolPayload } from "./tool-payload-DV5VuWF_.js";
import { t as createOutboundSendDeps } from "./outbound-send-deps-DpHOvcCe.js";
import { t as formatForLog } from "./ws-log-Bj-6Do--.js";
import "./deps-BlJhVyB4.js";
import { t as resolveGatewayPluginConfig } from "./runtime-plugin-config-MVwwsGVY.js";
import { n as resolveGatewayInflightRequest$1, r as runGatewayInflightWork } from "./inflight-C7tVF6RA.js";
import { t as resolveGatewayConversationReadOrigin } from "./conversation-read-origin-CcxTNkzD.js";
//#region src/gateway/server-methods/send.ts
function resolveTrustedMessageActionToolContext(params) {
	const identity = params.client?.internal?.agentRuntimeIdentity;
	const messageActionContext = identity?.messageActionContext;
	if (!identity || !messageActionContext) return {
		ok: true,
		toolContext: void 0,
		requesterAccountId: void 0,
		requesterSenderId: void 0,
		sessionId: void 0,
		sourceReplyFinal: void 0,
		sourceReplyToolCallId: void 0
	};
	if (Date.now() >= messageActionContext.expiresAtMs) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "message.action agent runtime context has expired")
	};
	const requestSessionKey = normalizeSessionKeyPreservingOpaquePeerIds(params.request.sessionKey);
	const identitySessionKey = normalizeSessionKeyPreservingOpaquePeerIds(identity.sessionKey);
	const identityAgentId = normalizeAgentId(identity.agentId);
	const requestAgentId = normalizeOptionalString(params.request.agentId);
	const sessionAgentId = parseAgentSessionKey(requestSessionKey)?.agentId;
	const requestSessionId = normalizeOptionalString(params.request.sessionId);
	if (!requestSessionKey || requestSessionKey !== identitySessionKey || requestAgentId && normalizeAgentId(requestAgentId) !== identityAgentId || sessionAgentId && normalizeAgentId(sessionAgentId) !== identityAgentId || messageActionContext.sessionId && requestSessionId !== messageActionContext.sessionId) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "message.action agent runtime identity does not match the requested session")
	};
	return {
		ok: true,
		toolContext: messageActionContext.toolContext,
		requesterAccountId: messageActionContext.requesterAccountId,
		requesterSenderId: messageActionContext.requesterSenderId,
		sessionId: messageActionContext.sessionId,
		sourceReplyFinal: messageActionContext.sourceReplyFinal,
		sourceReplyToolCallId: messageActionContext.sourceReplyToolCallId
	};
}
function resolveGatewayInflightRequest(params) {
	const idem = params.idempotencyKey;
	const dedupeKey = params.prefix === "message.action" ? `${params.prefix}:${params.conversationReadOrigin ?? "delegated"}:${idem}` : `${params.prefix}:${idem}`;
	return resolveGatewayInflightRequest$1({
		context: params.context,
		dedupeKey,
		idempotencyKey: idem,
		respond: params.respond
	});
}
async function resolveRequestedChannel(params) {
	const channelInput = readStringValue(params.requestChannel);
	const normalizedChannel = channelInput ? normalizeMessageChannel(channelInput) : void 0;
	if (params.rejectWebchatAsInternalOnly && normalizedChannel === "webchat") return { error: errorShape(ErrorCodes.INVALID_REQUEST, "unsupported channel: webchat (internal-only). Use `chat.send` for WebChat UI messages or choose a deliverable channel.") };
	if (channelInput && !normalizedChannel) return { error: errorShape(ErrorCodes.INVALID_REQUEST, params.unsupportedMessage(channelInput)) };
	const sourceCfg = params.context.getRuntimeConfig();
	const cfg = resolveGatewayPluginConfig({ config: sourceCfg });
	let channel = normalizedChannel;
	if (!channel) try {
		channel = (await resolveMessageChannelSelection({ cfg })).channel;
	} catch (err) {
		return { error: errorShape(ErrorCodes.INVALID_REQUEST, String(err)) };
	}
	return {
		cfg,
		sourceCfg,
		channel
	};
}
async function resolveInternalDeliveryChannel(requestChannel, context) {
	const resolvedChannel = await resolveRequestedChannel({
		requestChannel,
		unsupportedMessage: (input) => `unsupported channel: ${input}`,
		context,
		rejectWebchatAsInternalOnly: true
	});
	if ("error" in resolvedChannel) return {
		kind: "failed",
		result: {
			ok: false,
			error: resolvedChannel.error
		}
	};
	return {
		kind: "ready",
		...resolvedChannel
	};
}
function resolveGatewayOutboundTarget(params) {
	const resolved = resolveOutboundTarget({
		channel: params.channel,
		to: params.to,
		cfg: params.cfg,
		accountId: params.accountId,
		mode: "explicit"
	});
	if (!resolved.ok) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, String(resolved.error))
	};
	return {
		ok: true,
		to: resolved.to
	};
}
function resolveMessageActionRuntimeConfig(params) {
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	if (!runtimeConfig || !runtimeSourceConfig) return params.cfg;
	const selected = selectApplicableRuntimeConfig({
		inputConfig: params.sourceCfg,
		runtimeConfig,
		runtimeSourceConfig
	});
	if (selected === runtimeConfig && selected !== params.cfg) return resolveGatewayPluginConfig({ config: selected });
	return params.cfg;
}
function buildGatewayDeliveryPayload(params) {
	const payload = {
		runId: params.runId,
		messageId: params.result.messageId,
		channel: params.channel
	};
	if ("chatId" in params.result) payload.chatId = params.result.chatId;
	if ("channelId" in params.result) payload.channelId = params.result.channelId;
	if ("toJid" in params.result) payload.toJid = params.result.toJid;
	if ("conversationId" in params.result) payload.conversationId = params.result.conversationId;
	if ("pollId" in params.result) payload.pollId = params.result.pollId;
	return payload;
}
function cacheGatewayDedupeSuccess(params) {
	params.context.dedupe.set(params.dedupeKey, {
		ts: Date.now(),
		ok: true,
		payload: params.payload
	});
}
function cacheGatewayDedupeFailure(params) {
	params.context.dedupe.set(params.dedupeKey, {
		ts: Date.now(),
		ok: false,
		error: params.error
	});
}
function createGatewayInflightSuccess(params) {
	cacheGatewayDedupeSuccess({
		context: params.context,
		dedupeKey: params.dedupeKey,
		payload: params.payload
	});
	return {
		ok: true,
		payload: params.payload,
		meta: { channel: params.channel }
	};
}
function createGatewayDeliveryInflightSuccess(params) {
	return createGatewayInflightSuccess({
		context: params.context,
		dedupeKey: params.dedupeKey,
		payload: buildGatewayDeliveryPayload({
			runId: params.runId,
			channel: params.channel,
			result: params.result
		}),
		channel: params.channel
	});
}
function createGatewayInflightUnavailableFailure(params) {
	const error = errorShape(ErrorCodes.UNAVAILABLE, String(params.err));
	cacheGatewayDedupeFailure({
		context: params.context,
		dedupeKey: params.dedupeKey,
		error
	});
	return {
		ok: false,
		error,
		meta: {
			channel: params.channel,
			error: formatForLog(params.err)
		}
	};
}
async function mirrorDeliveredSourceReplyToTranscriptBestEffort(params) {
	try {
		if (!await mirrorDeliveredSourceReplyToTranscript(params.mirror) && params.mirror.sourceReplyFinal === true) params.context.logGateway?.warn?.("Terminal source reply receipt was not mirrored; restart recovery is fail-closed.", {
			channel: params.mirror.channel,
			sessionKey: params.mirror.sessionKey
		});
	} catch (err) {
		params.context.logGateway?.warn?.("Source reply transcript mirror failed after delivery.", {
			error: formatForLog(err),
			channel: params.mirror.channel,
			sessionKey: params.mirror.sessionKey
		});
	}
}
const sourceReplyTranscriptMirrorQueue = new KeyedAsyncQueue();
function resolveSourceReplyTranscriptMirrorQueueKey(mirror) {
	return mirror.sessionKey?.trim() || "__global__";
}
function scheduleDeliveredSourceReplyTranscriptMirror(params) {
	const queueKey = resolveSourceReplyTranscriptMirrorQueueKey(params.mirror);
	return sourceReplyTranscriptMirrorQueue.enqueue(queueKey, () => mirrorDeliveredSourceReplyToTranscriptBestEffort(params));
}
const sendHandlers = {
	"message.action": async ({ params, respond, context, client }) => {
		const p = params;
		if (!validateMessageActionParams(p)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid message.action params: ${formatValidationErrors(validateMessageActionParams.errors)}`));
			return;
		}
		const request = p;
		const trustedContext = resolveTrustedMessageActionToolContext({
			client,
			request
		});
		if (!trustedContext.ok) {
			respond(false, void 0, trustedContext.error);
			return;
		}
		const conversationReadOrigin = resolveGatewayConversationReadOrigin({
			client,
			requestedOrigin: request.conversationReadOrigin
		});
		const inflight = resolveGatewayInflightRequest({
			context,
			prefix: "message.action",
			idempotencyKey: request.idempotencyKey,
			respond,
			conversationReadOrigin
		});
		if (inflight.kind === "handled") {
			await inflight.done;
			return;
		}
		const { dedupeKey, inflightMap } = inflight;
		await runGatewayInflightWork({
			inflightMap,
			dedupeKey,
			work: (async () => {
				const resolvedChannel = await resolveRequestedChannel({
					requestChannel: request.channel,
					unsupportedMessage: (input) => `unsupported channel: ${input}`,
					context,
					rejectWebchatAsInternalOnly: true
				});
				if ("error" in resolvedChannel) return {
					ok: false,
					error: resolvedChannel.error
				};
				const { cfg: selectedCfg, sourceCfg, channel } = resolvedChannel;
				const cfg = resolveMessageActionRuntimeConfig({
					cfg: selectedCfg,
					sourceCfg
				});
				if (!resolveOutboundChannelPlugin({
					channel,
					cfg
				})?.actions?.handleAction) return {
					ok: false,
					error: errorShape(ErrorCodes.INVALID_REQUEST, `Channel ${channel} does not support action ${request.action}.`)
				};
				try {
					const sessionKey = normalizeOptionalString(request.sessionKey) ?? void 0;
					const agentId = normalizeOptionalString(request.agentId) ?? (sessionKey ? resolveSessionAgentId({
						sessionKey,
						config: cfg
					}) : void 0);
					const accountId = normalizeOptionalString(request.accountId) ?? void 0;
					if (request.action === "send") await hydrateAttachmentParamsForAction({
						cfg,
						channel,
						accountId,
						args: request.params,
						action: "send",
						mediaPolicy: resolveAttachmentMediaPolicy({ mediaLocalRoots: getAgentScopedMediaLocalRoots(cfg, agentId) })
					});
					const sourceReplyMirror = {
						action: request.action,
						channel,
						actionParams: request.params,
						cfg,
						accountId,
						currentAccountId: trustedContext.requesterAccountId,
						sessionKey,
						sessionId: trustedContext.sessionId,
						agentId,
						toolContext: trustedContext.toolContext,
						idempotencyKey: request.idempotencyKey,
						toolCallId: trustedContext.sourceReplyToolCallId,
						...trustedContext.sourceReplyFinal !== void 0 ? { sourceReplyFinal: trustedContext.sourceReplyFinal } : {}
					};
					const terminalDeliveryReceipt = trustedContext.sourceReplyFinal === true ? await beginTerminalSourceReplyDelivery(sourceReplyMirror) : void 0;
					const gatewayClientScopes = client?.connect?.scopes ?? [];
					const handled = await dispatchChannelMessageAction({
						channel,
						action: request.action,
						cfg,
						params: request.params,
						accountId,
						requesterAccountId: trustedContext.requesterAccountId,
						requesterSenderId: trustedContext.requesterSenderId,
						senderIsOwner: gatewayClientScopes.includes("operator.admin") ? request.senderIsOwner === true : false,
						conversationReadOrigin,
						sessionKey,
						sessionId: normalizeOptionalString(request.sessionId) ?? void 0,
						inboundEventKind: request.inboundTurnKind,
						agentId,
						mediaLocalRoots: getAgentScopedMediaLocalRoots(cfg, agentId),
						toolContext: trustedContext.toolContext,
						dryRun: false,
						gatewayClientScopes
					});
					if (!handled) {
						await cancelTerminalSourceReplyDelivery(terminalDeliveryReceipt);
						const error = errorShape(ErrorCodes.INVALID_REQUEST, `Message action ${request.action} not supported for channel ${channel}.`);
						cacheGatewayDedupeFailure({
							context,
							dedupeKey,
							error
						});
						return {
							ok: false,
							error,
							meta: { channel }
						};
					}
					const payload = extractToolPayload(handled);
					try {
						await reconcileTerminalSourceReplyDelivery({
							deliveredPayload: payload,
							mirror: sourceReplyMirror,
							receipt: terminalDeliveryReceipt
						});
					} catch (err) {
						context.logGateway?.warn?.("Terminal source reply receipt reconciliation failed.", {
							error: formatForLog(err),
							channel,
							sessionKey
						});
					}
					await scheduleDeliveredSourceReplyTranscriptMirror({
						context,
						mirror: {
							...sourceReplyMirror,
							deliveredPayload: payload
						}
					});
					return createGatewayInflightSuccess({
						context,
						dedupeKey,
						payload,
						channel
					});
				} catch (err) {
					return createGatewayInflightUnavailableFailure({
						context,
						dedupeKey,
						channel,
						err
					});
				}
			})(),
			respond
		});
	},
	send: async ({ params, respond, context, client }) => {
		const p = params;
		if (!validateSendParams(p)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid send params: ${formatValidationErrors(validateSendParams.errors)}`));
			return;
		}
		const request = p;
		const inflight = resolveGatewayInflightRequest({
			context,
			prefix: "send",
			idempotencyKey: request.idempotencyKey,
			respond
		});
		if (inflight.kind === "handled") {
			await inflight.done;
			return;
		}
		const { idem, dedupeKey, inflightMap } = inflight;
		const to = normalizeOptionalString(request.to) ?? "";
		const message = normalizeOptionalString(request.message) ?? "";
		const mediaUrl = normalizeOptionalString(request.mediaUrl);
		const mediaUrls = Array.isArray(request.mediaUrls) ? request.mediaUrls.map((entry) => normalizeOptionalString(entry)).filter((entry) => Boolean(entry)) : void 0;
		const buffer = readStringValue(request.buffer);
		if (!message && !mediaUrl && (mediaUrls?.length ?? 0) === 0 && !buffer) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid send params: text or media is required"));
			return;
		}
		const accountId = normalizeOptionalString(request.accountId);
		const replyToId = normalizeOptionalString(request.replyToId);
		const threadId = normalizeOptionalString(request.threadId);
		await runGatewayInflightWork({
			inflightMap,
			dedupeKey,
			work: (async () => {
				const resolvedChannel = await resolveInternalDeliveryChannel(request.channel, context);
				if (resolvedChannel.kind !== "ready") return resolvedChannel.result;
				const { cfg, channel } = resolvedChannel;
				const outboundChannel = channel;
				if (!resolveOutboundChannelPlugin({
					channel,
					cfg
				})) return {
					ok: false,
					error: errorShape(ErrorCodes.INVALID_REQUEST, `unsupported channel: ${channel}`)
				};
				try {
					const resolvedTarget = resolveGatewayOutboundTarget({
						channel: outboundChannel,
						to,
						cfg,
						accountId
					});
					if (!resolvedTarget.ok) return {
						ok: false,
						error: resolvedTarget.error,
						meta: { channel }
					};
					const idLikeTarget = await maybeResolveIdLikeTarget({
						cfg,
						channel,
						input: resolvedTarget.to,
						accountId
					});
					const deliveryTarget = idLikeTarget?.to ?? resolvedTarget.to;
					const providedSessionKey = normalizeSessionKeyPreservingOpaquePeerIds(request.sessionKey) || void 0;
					const explicitAgentId = normalizeOptionalString(request.agentId);
					const sessionAgentId = providedSessionKey ? resolveSessionAgentId({
						sessionKey: providedSessionKey,
						config: cfg
					}) : void 0;
					const defaultAgentId = resolveSessionAgentId({ config: cfg });
					const effectiveAgentId = explicitAgentId ?? sessionAgentId ?? defaultAgentId;
					const sendArgs = {
						mediaUrl,
						mediaUrls,
						buffer,
						filename: normalizeOptionalString(request.filename) ?? void 0,
						contentType: normalizeOptionalString(request.contentType) ?? void 0
					};
					await hydrateAttachmentParamsForAction({
						cfg,
						channel,
						accountId,
						args: sendArgs,
						action: "send",
						mediaPolicy: resolveAttachmentMediaPolicy({ mediaLocalRoots: getAgentScopedMediaLocalRoots(cfg, effectiveAgentId) })
					});
					const hydratedMediaUrl = normalizeOptionalString(sendArgs.mediaUrl);
					const hydratedMediaUrls = Array.isArray(sendArgs.mediaUrls) ? sendArgs.mediaUrls.map((entry) => normalizeOptionalString(entry)).filter((entry) => Boolean(entry)) : void 0;
					const outboundDeps = context.deps ? createOutboundSendDeps(context.deps) : void 0;
					const outboundPayloads = [{
						text: message,
						mediaUrl: hydratedMediaUrl,
						mediaUrls: hydratedMediaUrls,
						...request.asVoice === true ? { audioAsVoice: true } : {}
					}];
					const mirrorProjection = projectOutboundPayloadPlanForMirror(createOutboundPayloadPlan(outboundPayloads));
					const mirrorText = mirrorProjection.text;
					const mirrorMediaUrls = mirrorProjection.mediaUrls;
					const derivedRoute = await resolveOutboundSessionRoute({
						cfg,
						channel,
						agentId: effectiveAgentId,
						accountId,
						target: deliveryTarget,
						currentSessionKey: providedSessionKey,
						resolvedTarget: idLikeTarget,
						replyToId,
						threadId
					});
					const providedSessionBaseKey = parseThreadSessionSuffix(providedSessionKey).baseSessionKey ?? providedSessionKey;
					const shouldUseDerivedThreadSessionKey = channel === "slack" && Boolean(providedSessionKey) && Boolean(normalizeOptionalString(derivedRoute?.threadId)) && normalizeOptionalLowercaseString(derivedRoute?.baseSessionKey) === normalizeOptionalLowercaseString(providedSessionBaseKey) && normalizeOptionalLowercaseString(derivedRoute?.sessionKey) !== providedSessionKey;
					const outboundRoute = derivedRoute ? providedSessionKey ? shouldUseDerivedThreadSessionKey ? {
						...derivedRoute,
						baseSessionKey: derivedRoute.baseSessionKey ?? providedSessionKey
					} : {
						...derivedRoute,
						sessionKey: providedSessionKey,
						baseSessionKey: providedSessionKey
					} : derivedRoute : null;
					const outboundSessionKey = outboundRoute?.sessionKey ?? providedSessionKey;
					if (outboundSessionKey && isAgentHarnessSessionKey(outboundSessionKey)) {
						const { canonicalKey, entry } = loadSessionEntry(outboundSessionKey);
						const missingHarnessSessionError = resolveMissingAgentHarnessSessionError(canonicalKey, entry);
						if (missingHarnessSessionError) return {
							ok: false,
							error: errorShape(ErrorCodes.INVALID_REQUEST, missingHarnessSessionError),
							meta: { channel }
						};
					}
					if (outboundRoute) await ensureOutboundSessionEntry({
						cfg,
						channel,
						accountId,
						route: outboundRoute
					});
					const outboundSession = buildOutboundSessionContext({
						cfg,
						agentId: effectiveAgentId,
						sessionKey: outboundSessionKey,
						conversationType: outboundRoute?.chatType
					});
					const send = await sendDurableMessageBatch({
						cfg,
						channel: outboundChannel,
						to: deliveryTarget,
						accountId,
						payloads: outboundPayloads,
						replyToId: replyToId ?? null,
						session: outboundSession,
						gifPlayback: request.gifPlayback,
						forceDocument: request.forceDocument,
						threadId: outboundRoute?.threadId ?? threadId ?? null,
						deps: outboundDeps,
						gatewayClientScopes: client?.connect?.scopes ?? [],
						silent: request.silent,
						formatting: request.parseMode ? { parseMode: request.parseMode } : void 0,
						mirror: outboundSessionKey ? {
							sessionKey: outboundSessionKey,
							agentId: effectiveAgentId,
							text: mirrorText || message,
							mediaUrls: mirrorMediaUrls.length > 0 ? mirrorMediaUrls : void 0,
							idempotencyKey: idem
						} : void 0
					});
					if (send.status === "failed" || send.status === "partial_failed") throw send.error;
					const result = (send.status === "sent" ? send.results : []).at(-1);
					if (!result) throw new Error("No delivery result");
					return createGatewayDeliveryInflightSuccess({
						context,
						dedupeKey,
						runId: idem,
						channel,
						result
					});
				} catch (err) {
					return createGatewayInflightUnavailableFailure({
						context,
						dedupeKey,
						channel,
						err
					});
				}
			})(),
			respond
		});
	},
	poll: async ({ params, respond, context, client }) => {
		const p = params;
		if (!validatePollParams(p)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid poll params: ${formatValidationErrors(validatePollParams.errors)}`));
			return;
		}
		const request = p;
		const inflight = resolveGatewayInflightRequest({
			context,
			prefix: "poll",
			idempotencyKey: request.idempotencyKey,
			respond
		});
		if (inflight.kind === "handled") {
			await inflight.done;
			return;
		}
		const { idem, dedupeKey, inflightMap } = inflight;
		await runGatewayInflightWork({
			inflightMap,
			dedupeKey,
			work: (async () => {
				const resolvedChannel = await resolveRequestedChannel({
					requestChannel: request.channel,
					unsupportedMessage: (input) => `unsupported poll channel: ${input}`,
					context
				});
				if ("error" in resolvedChannel) return {
					ok: false,
					error: resolvedChannel.error
				};
				const { cfg, channel } = resolvedChannel;
				const outbound = resolveOutboundChannelPlugin({
					channel,
					cfg
				})?.outbound;
				if (typeof request.durationSeconds === "number" && outbound?.supportsPollDurationSeconds !== true) return {
					ok: false,
					error: errorShape(ErrorCodes.INVALID_REQUEST, `durationSeconds is not supported for ${channel} polls`)
				};
				if (typeof request.isAnonymous === "boolean" && outbound?.supportsAnonymousPolls !== true) return {
					ok: false,
					error: errorShape(ErrorCodes.INVALID_REQUEST, `isAnonymous is not supported for ${channel} polls`)
				};
				const poll = {
					question: request.question,
					options: request.options,
					maxSelections: request.maxSelections,
					durationSeconds: request.durationSeconds,
					durationHours: request.durationHours
				};
				const threadId = normalizeOptionalString(request.threadId);
				const accountId = normalizeOptionalString(request.accountId);
				try {
					if (!outbound?.sendPoll) return {
						ok: false,
						error: errorShape(ErrorCodes.INVALID_REQUEST, `unsupported poll channel: ${channel}`)
					};
					const resolvedTarget = resolveGatewayOutboundTarget({
						channel,
						to: request.to.trim(),
						cfg,
						accountId
					});
					if (!resolvedTarget.ok) return {
						ok: false,
						error: resolvedTarget.error
					};
					const normalized = outbound.pollMaxOptions ? normalizePollInput(poll, { maxOptions: outbound.pollMaxOptions }) : normalizePollInput(poll);
					const result = await outbound.sendPoll({
						cfg,
						to: resolvedTarget.to,
						poll: normalized,
						accountId,
						threadId,
						silent: request.silent,
						isAnonymous: request.isAnonymous,
						gatewayClientScopes: client?.connect?.scopes ?? []
					});
					const payload = buildGatewayDeliveryPayload({
						runId: idem,
						channel,
						result
					});
					cacheGatewayDedupeSuccess({
						context,
						dedupeKey,
						payload
					});
					return {
						ok: true,
						payload,
						meta: { channel }
					};
				} catch (err) {
					const error = errorShape(ErrorCodes.UNAVAILABLE, String(err));
					cacheGatewayDedupeFailure({
						context,
						dedupeKey,
						error
					});
					return {
						ok: false,
						error,
						meta: {
							channel,
							error: formatForLog(err)
						}
					};
				}
			})(),
			respond
		});
	}
};
//#endregion
export { sendHandlers };
