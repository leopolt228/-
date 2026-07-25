import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import "./agent-scope-CrBA-6Gx.js";
import { r as resolveAgentConfig } from "./agent-scope-config-S7z_Yn4H.js";
import { l as resolveStorePath } from "./paths-BpMRJ7TJ.js";
import { S as appendTranscriptEvent, yt as loadSessionEntry } from "./session-accessor-Mu3lv_Tl.js";
import { r as readSessionUpdatedAt } from "./store-DDuGv_UJ.js";
import { r as isControlCommandMessage } from "./command-detection-B3_n5-oK.js";
import "./sessions-Uqhj6EXw.js";
import { d as normalizeOutboundReplyPayload } from "./reply-payload-CPcXnHho.js";
import "./mentions-JuM7Ltm-.js";
import { a as resolveEnvelopeFormatOptions } from "./envelope-BfKEFEwi.js";
import { n as resolveInboundDebounceMs, t as createInboundDebouncer } from "./inbound-debounce-dfuwHUlR.js";
import { r as dispatchChannelInboundTurn } from "./kernel-BM-Mkfv5.js";
import { r as filterChannelInboundSupplementalContext, t as buildChannelInboundEventContext } from "./context-CGmpW7gY.js";
import { t as createChannelReplyPipeline } from "./reply-pipeline-CxG32UxG.js";
import "./inbound-reply-dispatch-DsI2X5Zm.js";
import { a as resolveInboundRouteEnvelopeBuilderWithRuntime, r as resolveChannelInboundRouteEnvelope, t as createChannelInboundEnvelopeBuilder } from "./envelope-Jdufx36I.js";
import "./direct-dm-access-DnXcjsnB.js";
import "./direct-dm-guard-policy-Bc2LGoLC.js";
//#region src/channels/direct-dm.ts
function buildDirectDmContext(params, route, body) {
	const accountId = route.accountId ?? params.accountId;
	return buildChannelInboundEventContext({
		channel: params.channel,
		accountId,
		provider: params.provider,
		surface: params.surface,
		messageId: params.messageId,
		messageIdFull: params.messageId,
		timestamp: params.timestamp,
		from: params.senderAddress,
		sender: {
			id: params.senderId,
			name: params.conversationLabel
		},
		conversation: {
			kind: "direct",
			id: params.peer.id,
			label: params.conversationLabel
		},
		route: {
			agentId: route.agentId,
			accountId: route.accountId,
			routeSessionKey: route.sessionKey,
			dispatchSessionKey: route.sessionKey
		},
		reply: {
			to: params.recipientAddress,
			originatingTo: params.originatingTo ?? params.recipientAddress
		},
		message: {
			body,
			bodyForAgent: params.bodyForAgent ?? params.rawBody,
			rawBody: params.rawBody,
			commandBody: params.commandBody ?? params.rawBody
		},
		access: { commands: { authorized: params.commandAuthorized === true } },
		extra: {
			NativeDirectUserId: params.peer.id,
			OriginatingChannel: params.originatingChannel ?? params.channel,
			...params.extraContext
		}
	});
}
async function dispatchInboundDirectDm(params) {
	const { route, buildEnvelope } = resolveChannelInboundRouteEnvelope({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		peer: params.peer
	});
	const ctxPayload = buildDirectDmContext(params, route, buildEnvelope({
		channel: params.channelLabel,
		from: params.conversationLabel,
		body: params.rawBody,
		timestamp: params.timestamp
	}));
	await dispatchChannelInboundTurn(buildDirectDmTurnPlan(params, route, ctxPayload));
	return {
		route,
		ctxPayload
	};
}
function buildDirectDmTurnPlan(params, route, ctxPayload) {
	const { onModelSelected, ...replyPipeline } = createChannelReplyPipeline({
		cfg: params.cfg,
		agentId: route.agentId,
		channel: params.channel,
		accountId: route.accountId ?? params.accountId
	});
	return {
		cfg: params.cfg,
		channel: params.channel,
		accountId: route.accountId ?? params.accountId,
		route: {
			agentId: route.agentId,
			sessionKey: route.sessionKey
		},
		ctxPayload,
		record: { onRecordError: params.onRecordError },
		delivery: {
			deliver: async (payload) => await params.deliver(normalizeOutboundReplyPayload(payload)),
			onError: params.onDispatchError
		},
		replyPipeline,
		replyOptions: {
			onModelSelected,
			...params.turnAdoptionLifecycle ? { turnAdoptionLifecycle: params.turnAdoptionLifecycle } : {}
		}
	};
}
async function dispatchInboundDirectDmWithRuntime(params) {
	const { route, buildEnvelope } = resolveInboundRouteEnvelopeBuilderWithRuntime({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		peer: params.peer,
		runtime: params.runtime.channel,
		sessionStore: params.cfg.session?.store
	});
	const { storePath, body } = buildEnvelope({
		channel: params.channelLabel,
		from: params.conversationLabel,
		body: params.rawBody,
		timestamp: params.timestamp
	});
	const ctxPayload = params.runtime.channel.reply.finalizeInboundContext({
		Body: body,
		BodyForAgent: params.bodyForAgent ?? params.rawBody,
		RawBody: params.rawBody,
		CommandBody: params.commandBody ?? params.rawBody,
		From: params.senderAddress,
		To: params.recipientAddress,
		SessionKey: route.sessionKey,
		AccountId: route.accountId ?? params.accountId,
		ChatType: "direct",
		ConversationLabel: params.conversationLabel,
		SenderId: params.senderId,
		Provider: params.provider ?? params.channel,
		Surface: params.surface ?? params.channel,
		MessageSid: params.messageId,
		MessageSidFull: params.messageId,
		Timestamp: params.timestamp,
		CommandAuthorized: params.commandAuthorized,
		...params.inboundAccessAuthorized === true ? { InboundAccessAuthorized: true } : {},
		OriginatingChannel: params.originatingChannel ?? params.channel,
		OriginatingTo: params.originatingTo ?? params.recipientAddress,
		NativeDirectUserId: params.peer.id,
		...params.extraContext
	});
	const plan = buildDirectDmTurnPlan(params, route, ctxPayload);
	await params.runtime.channel.inbound.run({
		channel: params.channel,
		accountId: route.accountId ?? params.accountId,
		raw: ctxPayload,
		adapter: {
			ingest: () => ({
				id: params.messageId,
				timestamp: params.timestamp,
				rawText: params.rawBody,
				textForAgent: params.bodyForAgent,
				textForCommands: params.commandBody,
				raw: ctxPayload
			}),
			resolveTurn: () => plan
		}
	});
	return {
		route,
		storePath,
		ctxPayload
	};
}
//#endregion
//#region src/channels/inbound-debounce-policy.ts
/**
* Channel inbound debounce policy.
*
* Decides when text events can be delayed/merged before agent dispatch.
*/
/** Returns true when an inbound text event is safe to debounce before dispatch. */
function shouldDebounceTextInbound(params) {
	if (params.allowDebounce === false) return false;
	if (params.hasMedia) return false;
	const text = normalizeOptionalString(params.text) ?? "";
	if (!text) return false;
	return !isControlCommandMessage(text, params.cfg, params.commandOptions);
}
/** Creates a channel-scoped inbound debouncer using config/default debounce timing. */
function createChannelInboundDebouncer(params) {
	const debounceMs = resolveInboundDebounceMs({
		cfg: params.cfg,
		channel: params.channel,
		overrideMs: params.debounceMsOverride
	});
	const { cfg: _cfg, channel: _channel, debounceMsOverride: _override, ...rest } = params;
	return {
		debounceMs,
		debouncer: createInboundDebouncer({
			debounceMs,
			...rest
		})
	};
}
//#endregion
//#region src/channels/session-envelope.ts
/** Resolves envelope options and previous timestamp for one inbound channel session. */
function resolveInboundSessionEnvelopeContext(params) {
	const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
	return {
		storePath,
		envelopeOptions: resolveEnvelopeFormatOptions(params.cfg),
		previousTimestamp: readSessionUpdatedAt({
			storePath,
			sessionKey: params.sessionKey
		})
	};
}
//#endregion
//#region src/channels/inbound-event/classification.ts
/**
* Channel inbound event classifier.
*
* Decides whether group/channel activity should wake the agent or remain a passive room event.
*/
/**
* Classifies an inbound channel event as an actionable request or passive room event.
*/
function classifyChannelInboundEvent(params) {
	if (params.unmentionedGroupPolicy !== "room_event") return "user_request";
	if (params.conversation.kind !== "group" && params.conversation.kind !== "channel") return "user_request";
	if (params.wasMentioned === true || params.hasControlCommand === true || params.hasAbortRequest === true || params.commandSource === "native") return "user_request";
	return "room_event";
}
/**
* Resolves the configured policy for unmentioned group/channel inbound events.
*/
function resolveUnmentionedGroupInboundPolicy(params) {
	const agentGroupChat = params.agentId ? resolveAgentConfig(params.cfg, params.agentId)?.groupChat : void 0;
	if (agentGroupChat && Object.hasOwn(agentGroupChat, "unmentionedInbound")) return agentGroupChat.unmentionedInbound ?? "user_request";
	return params.cfg.messages?.groupChat?.unmentionedInbound ?? "user_request";
}
//#endregion
//#region src/channels/feedback-reflection.ts
const DEFAULT_CHANNEL_FEEDBACK_REFLECTION_COOLDOWN_MS = 3e5;
const MAX_RESPONSE_CHARS = 500;
const MAX_COOLDOWN_ENTRIES = 500;
const lastReflectionBySession = /* @__PURE__ */ new Map();
async function recordChannelFeedbackEvent(params) {
	const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
	const entry = loadSessionEntry({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath
	});
	if (!entry?.sessionId) return false;
	await appendTranscriptEvent({
		agentId: params.agentId,
		sessionId: entry.sessionId,
		sessionKey: params.sessionKey,
		storePath
	}, params.event);
	return true;
}
function buildReflectionPrompt(params) {
	const response = params.thumbedDownResponse;
	const truncated = response && response.length > MAX_RESPONSE_CHARS ? `${truncateUtf16Safe(response, MAX_RESPONSE_CHARS)}...` : response;
	return [
		"A user indicated your previous response wasn't helpful.",
		truncated ? `\nYour response was:\n> ${truncated}` : void 0,
		params.userComment ? `\nUser's comment: "${params.userComment}"` : void 0,
		"\nBriefly reflect: what could you improve? Consider tone, length, accuracy, relevance, and specificity. Reply with one JSON object only: {\"learning\":\"...\",\"followUp\":false,\"userMessage\":\"\"}. Keep learning to 1-2 sentences. Set followUp only when the user needs a direct reply."
	].filter(Boolean).join("\n");
}
function parseReflectionResponse(text) {
	const trimmed = text.trim();
	const candidates = [trimmed, ...trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.slice(1, 2) ?? []];
	for (const candidate of candidates) try {
		const value = JSON.parse(candidate.trim());
		const learning = typeof value.learning === "string" ? value.learning.trim() : "";
		if (!learning) continue;
		return {
			learning,
			followUp: value.followUp === true || typeof value.followUp === "string" && ["true", "yes"].includes(value.followUp.trim().toLowerCase()),
			userMessage: (typeof value.userMessage === "string" ? value.userMessage.trim() : "") || void 0
		};
	} catch {}
	return trimmed ? {
		learning: trimmed,
		followUp: false
	} : null;
}
async function runChannelFeedbackReflection(params) {
	const cooldownMs = params.cooldownMs ?? 3e5;
	if (Date.now() - (lastReflectionBySession.get(params.sessionKey) ?? Number.NEGATIVE_INFINITY) < cooldownMs) return { status: "cooldown" };
	const prompt = buildReflectionPrompt(params);
	const timestamp = Date.now();
	const body = createChannelInboundEnvelopeBuilder({
		cfg: params.cfg,
		route: {
			agentId: params.agentId,
			sessionKey: params.sessionKey
		}
	})({
		channel: params.channelLabel,
		from: "system",
		body: prompt,
		timestamp
	});
	const target = `conversation:${params.conversationId}`;
	const ctxPayload = buildChannelInboundEventContext({
		channel: params.channel,
		accountId: params.accountId,
		messageId: `feedback-reflection:${timestamp}`,
		timestamp,
		from: `${params.channel}:system:${params.conversationId}`,
		sender: {
			id: "system",
			name: "system"
		},
		conversation: {
			kind: params.conversationKind,
			id: params.conversationId
		},
		route: {
			agentId: params.agentId,
			accountId: params.accountId,
			routeSessionKey: params.sessionKey,
			dispatchSessionKey: params.sessionKey
		},
		reply: {
			to: target,
			originatingTo: target
		},
		message: {
			body,
			bodyForAgent: prompt,
			rawBody: prompt,
			commandBody: prompt
		},
		access: { commands: { authorized: false } }
	});
	const responses = [];
	await dispatchChannelInboundTurn({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		route: {
			agentId: params.agentId,
			sessionKey: params.sessionKey
		},
		ctxPayload,
		record: { onRecordError: params.onRecordError },
		delivery: {
			deliver: async (payload) => {
				if (payload.text) responses.push(payload.text);
				return { visibleReplySent: false };
			},
			onError: (error) => params.onDispatchError?.(error)
		},
		replyPipeline: {}
	});
	const response = responses.join("\n");
	const parsed = parseReflectionResponse(response);
	if (!parsed) return { status: "empty" };
	lastReflectionBySession.set(params.sessionKey, Date.now());
	if (lastReflectionBySession.size > MAX_COOLDOWN_ENTRIES) {
		for (const [key, time] of lastReflectionBySession) if (Date.now() - time >= cooldownMs) lastReflectionBySession.delete(key);
	}
	return {
		status: "complete",
		learning: parsed.learning,
		storePath: resolveStorePath(params.cfg.session?.store, { agentId: params.agentId }),
		followUp: parsed.followUp,
		userMessage: parsed.userMessage,
		responseLength: response.trim().length
	};
}
//#endregion
//#region src/plugin-sdk/channel-inbound.ts
/**
* Builds inbound-event context for callers still passing `inboundTurnKind`.
*
* @deprecated Use `buildChannelInboundEventContext`.
*/
function buildChannelTurnContext(params) {
	const inboundEventKind = params.message.inboundEventKind ?? params.message.inboundTurnKind;
	const ctx = buildChannelInboundEventContext({
		...params,
		message: {
			...params.message,
			...inboundEventKind ? { inboundEventKind } : {}
		}
	});
	return {
		...ctx,
		InboundTurnKind: ctx.InboundEventKind
	};
}
/**
* Deprecated supplemental-context filter alias retained for channel SDK compatibility.
*
* @deprecated Use `filterChannelInboundSupplementalContext`.
*/
const filterChannelTurnSupplementalContext = filterChannelInboundSupplementalContext;
//#endregion
export { runChannelFeedbackReflection as a, resolveInboundSessionEnvelopeContext as c, dispatchInboundDirectDm as d, dispatchInboundDirectDmWithRuntime as f, recordChannelFeedbackEvent as i, createChannelInboundDebouncer as l, filterChannelTurnSupplementalContext as n, classifyChannelInboundEvent as o, DEFAULT_CHANNEL_FEEDBACK_REFLECTION_COOLDOWN_MS as r, resolveUnmentionedGroupInboundPolicy as s, buildChannelTurnContext as t, shouldDebounceTextInbound as u };
