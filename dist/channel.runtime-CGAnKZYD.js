import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { r as formatErrorMessage, t as collectErrorGraphCandidates } from "./errors-DdbcjW1Y.js";
import { _ as resolveRequestClientIp } from "./net-DBokCmJs.js";
import { m as resolveSendableOutboundReplyParts } from "./reply-payload-CPcXnHho.js";
import { a as warnMissingProviderGroupPolicyFallbackOnce, n as resolveAllowlistProviderRuntimeGroupPolicy, r as resolveDefaultGroupPolicy, t as GROUP_POLICY_BLOCKED_LABEL } from "./runtime-group-policy-B5DjRp_T.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./text-utility-runtime-Bs8FhB83.js";
import "./error-runtime-DUxkdoW4.js";
import { h as toInboundMediaFacts, s as recordChannelBotPairLoopAndCheckSuppression } from "./kernel-BM-Mkfv5.js";
import { i as mergePairLoopGuardConfig } from "./pair-loop-guard-runtime-D0pZ_1is.js";
import { n as isDangerousNameMatchingEnabled } from "./dangerous-name-matching-Z6nhxFXz.js";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-BfHPdvRG.js";
import "./approval-gateway-runtime-1ZMkZlTL.js";
import { r as resolveChannelInboundRouteEnvelope } from "./envelope-Jdufx36I.js";
import "./channel-inbound-CsmpMLUZ.js";
import { n as channelIngressRoutes, o as defineStableChannelIngressIdentity, r as createChannelIngressResolver } from "./channel-ingress-runtime-xeTXZKGy.js";
import { d as createChannelIngressMonitor } from "./channel-outbound-D_Kkmr30.js";
import { n as createChannelPairingController } from "./channel-pairing-aeyu-GFl.js";
import { a as createWebhookInFlightLimiter, l as runDetachedWebhookWork, s as readJsonWebhookBodyOrReject } from "./webhook-request-guards-BwB_e49u.js";
import { a as createFixedWindowRateLimiter, r as WEBHOOK_RATE_LIMIT_DEFAULTS } from "./webhook-ingress-0GWTUyGu.js";
import { c as resolveWebhookTargetWithAuthOrReject, d as withResolvedWebhookRequestPipeline, r as registerWebhookTargetWithPluginRoute, s as resolveWebhookPath, t as normalizeWebhookPath } from "./webhook-targets-D0QbJdTx.js";
import { S as releaseGoogleChatApprovalCardBinding, c as downloadGoogleChatMedia, d as updateGoogleChatMessage, f as verifyGoogleChatRequest, g as completeGoogleChatApprovalCardBinding, h as claimGoogleChatApprovalCardBinding, l as probeGoogleChat, s as deleteGoogleChatMessage, t as isGoogleChatGroupSpace, u as sendGoogleChatMessage, v as getGoogleChatApprovalCardBinding, y as readGoogleChatApprovalActionToken } from "./targets--yzBlyzX.js";
import { t as getGoogleChatRuntime } from "./runtime-api-Dnfn1aG8.js";
import { n as googleChatApprovalAuth } from "./approval-auth-CnB6gGyp.js";
import { t as buildGoogleChatGroupPolicyScope } from "./group-policy-05pPZT0A.js";
//#region extensions/googlechat/src/approval-terminal-card.ts
const GOOGLECHAT_APPROVAL_CARD_ID = "openclaw-approval";
const MAX_TEXT_PARAGRAPH_CHARS = 1800;
function escapeGoogleChatText(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function truncateText(text) {
	return text.length <= MAX_TEXT_PARAGRAPH_CHARS ? text : `${truncateUtf16Safe(text, MAX_TEXT_PARAGRAPH_CHARS - 3)}...`;
}
function formatApprovalId(value) {
	return JSON.stringify(value).slice(1, -1);
}
function formatCanonicalOutcome(approval) {
	switch (approval.status) {
		case "allowed": return approval.decision === "allow-always" ? "Allowed always" : "Allowed once";
		case "denied": return "Denied";
		case "expired": return "Expired";
		case "cancelled": return "Cancelled";
	}
	return "Unavailable";
}
function buildSubjectSection(presentation) {
	if (presentation.kind === "exec") return {
		header: "Command",
		widgets: [{ textParagraph: { text: escapeGoogleChatText(truncateText(presentation.commandPreview ?? presentation.commandText)) } }]
	};
	const description = presentation.description.trim();
	return {
		header: "Request",
		widgets: [{ textParagraph: { text: truncateText(`<b>${escapeGoogleChatText(presentation.title)}</b>${description ? `<br>${escapeGoogleChatText(description)}` : ""}`) } }]
	};
}
/** Render the canonical first-answer result without retaining any actionable buttons. */
function buildGoogleChatCanonicalApprovalTerminalCards(result) {
	const { approval } = result;
	const kindLabel = approval.presentation.kind === "plugin" ? "Plugin" : "Exec";
	const detailLines = [
		`<b>Approval ID:</b> ${escapeGoogleChatText(formatApprovalId(approval.id))}`,
		`<b>Status:</b> ${escapeGoogleChatText(approval.status)}`,
		...approval.status === "allowed" || approval.status === "denied" ? [`<b>Decision:</b> ${escapeGoogleChatText(approval.decision)}`] : [],
		`<b>Reason:</b> ${escapeGoogleChatText(approval.reason)}`
	];
	return [{
		cardId: GOOGLECHAT_APPROVAL_CARD_ID,
		card: {
			header: {
				title: `${kindLabel} Approval: ${formatCanonicalOutcome(approval)}`,
				subtitle: result.applied ? "Resolved by this action" : "Already resolved"
			},
			sections: [buildSubjectSection(approval.presentation), {
				header: "Details",
				widgets: [{ textParagraph: { text: truncateText(detailLines.join("<br>")) } }]
			}]
		}
	}];
}
//#endregion
//#region extensions/googlechat/src/approval-card-click.ts
function logIgnored(target, message) {
	target.runtime.log?.(`[${target.account.accountId}] googlechat approval ignored: ${message}`);
}
async function maybeHandleGoogleChatApprovalCardClick(params) {
	if ((params.event.type ?? params.event.eventType) !== "CARD_CLICKED") return false;
	const token = readGoogleChatApprovalActionToken(params.event);
	if (!token) return false;
	const binding = getGoogleChatApprovalCardBinding(token);
	if (!binding) {
		logIgnored(params.target, "unknown or expired card token");
		return true;
	}
	if (binding.accountId !== params.target.account.accountId) {
		logIgnored(params.target, "card token account mismatch");
		return true;
	}
	if (params.event.space?.name !== binding.spaceName) {
		logIgnored(params.target, "card token space mismatch");
		return true;
	}
	if (params.event.message?.name && params.event.message.name !== binding.messageName) {
		logIgnored(params.target, "card token message mismatch");
		return true;
	}
	if (!binding.allowedDecisions.includes(binding.decision)) {
		logIgnored(params.target, "card token decision is no longer allowed");
		return true;
	}
	const actor = params.event.user?.name;
	if (!(googleChatApprovalAuth.authorizeActorAction?.({
		cfg: params.target.config,
		accountId: params.target.account.accountId,
		senderId: actor,
		action: "approve",
		approvalKind: binding.approvalKind
	}))?.authorized) {
		logIgnored(params.target, `unauthorized actor ${actor || "unknown"}`);
		return true;
	}
	const claim = claimGoogleChatApprovalCardBinding(token);
	if (claim.kind === "missing") {
		logIgnored(params.target, "card token already consumed");
		return true;
	}
	if (claim.kind === "in-flight") {
		logIgnored(params.target, "card token resolve already in flight");
		return true;
	}
	const consumed = claim.binding;
	let result;
	try {
		result = await resolveApprovalOverGateway({
			cfg: params.target.config,
			approvalId: consumed.approvalId,
			approvalKind: consumed.approvalKind,
			decision: consumed.decision,
			senderId: actor,
			clientDisplayName: `Google Chat approval (${actor?.trim() || "unknown"})`
		});
		await updateGoogleChatMessage({
			account: params.target.account,
			messageName: consumed.messageName,
			cardsV2: buildGoogleChatCanonicalApprovalTerminalCards(result)
		});
	} catch (error) {
		releaseGoogleChatApprovalCardBinding(token);
		throw error;
	}
	completeGoogleChatApprovalCardBinding(token);
	const outcome = result.applied ? "resolved" : "already resolved";
	const decision = "decision" in result.approval ? result.approval.decision : "none";
	params.target.runtime.log?.(`[${params.target.account.accountId}] googlechat approval ${outcome} id=${consumed.approvalId} status=${result.approval.status} decision=${decision} sender=${actor || "unknown"}`);
	return true;
}
//#endregion
//#region extensions/googlechat/src/monitor-access.ts
function normalizeUserId(raw) {
	const trimmed = normalizeOptionalString(raw) ?? "";
	if (!trimmed) return "";
	return normalizeLowercaseStringOrEmpty(trimmed.replace(/^users\//i, ""));
}
const GOOGLECHAT_EMAIL_KIND = "plugin:googlechat-email";
function normalizeEntryValue(raw) {
	return normalizeLowercaseStringOrEmpty(raw ?? "");
}
function normalizeGoogleChatStableEntry(entry) {
	const withoutProvider = normalizeEntryValue(entry).replace(/^(googlechat|google-chat|gchat):/i, "");
	if (!withoutProvider) return null;
	return withoutProvider.startsWith("users/") ? normalizeUserId(withoutProvider) : withoutProvider;
}
function normalizeGoogleChatEmailEntry(entry) {
	if (normalizeEntryValue(entry).replace(/^(googlechat|google-chat|gchat):/i, "").startsWith("users/")) return null;
	const stable = normalizeGoogleChatStableEntry(entry);
	return stable?.includes("@") ? stable : null;
}
const googleChatIngressIdentity = defineStableChannelIngressIdentity({
	key: "sender-id",
	normalizeEntry: normalizeGoogleChatStableEntry,
	normalizeSubject: normalizeUserId,
	aliases: [{
		key: "email",
		kind: GOOGLECHAT_EMAIL_KIND,
		normalizeEntry: normalizeGoogleChatEmailEntry,
		normalizeSubject: normalizeEntryValue,
		dangerous: true
	}],
	isWildcardEntry: (entry) => normalizeEntryValue(entry) === "*",
	resolveEntryId: ({ entryIndex, fieldKey }) => fieldKey === "stableId" ? `entry-${entryIndex + 1}:user` : `entry-${entryIndex + 1}:${fieldKey}`
});
function resolveGoogleChatGroupConfig(params) {
	const { groupId, groupName, groups } = params;
	const entries = groups ?? {};
	const keys = Object.keys(entries);
	if (keys.length === 0) return {
		entry: void 0,
		allowlistConfigured: false,
		deprecatedNameMatch: false
	};
	const { "*": fallback, ...scopes } = entries;
	const scope = buildGoogleChatGroupPolicyScope({
		tree: {
			defaults: fallback,
			scopes
		},
		groupId
	});
	const entry = scope.matchKey ? entries[scope.matchKey] : void 0;
	const normalizedGroupName = normalizeLowercaseStringOrEmpty(groupName ?? "");
	const deprecatedNameMatch = !entry && Boolean(groupName && keys.some((key) => {
		const trimmed = key.trim();
		if (!trimmed || trimmed === "*" || /^spaces\//i.test(trimmed)) return false;
		return trimmed === groupName || normalizeLowercaseStringOrEmpty(trimmed) === normalizedGroupName;
	}));
	return {
		entry: deprecatedNameMatch ? void 0 : entry ?? fallback,
		allowlistConfigured: true,
		fallback,
		deprecatedNameMatch
	};
}
function extractMentionInfo(annotations, botUser) {
	const mentionAnnotations = annotations.filter((entry) => entry.type === "USER_MENTION");
	const hasAnyMention = mentionAnnotations.length > 0;
	const botTargets = new Set(["users/app", botUser?.trim()].filter(Boolean));
	return {
		hasAnyMention,
		wasMentioned: mentionAnnotations.some((entry) => {
			const userName = entry.userMention?.user?.name;
			if (!userName) return false;
			if (botTargets.has(userName)) return true;
			return normalizeUserId(userName) === "app";
		})
	};
}
const warnedDeprecatedUsersEmailAllowFrom = /* @__PURE__ */ new Set();
const warnedMutableGroupKeys = /* @__PURE__ */ new Set();
function warnDeprecatedUsersEmailEntries(logVerbose, entries) {
	const deprecated = entries.map((v) => normalizeOptionalString(v)).filter((v) => Boolean(v)).filter((v) => /^users\/.+@.+/i.test(v));
	if (deprecated.length === 0) return;
	const key = deprecated.map((v) => normalizeLowercaseStringOrEmpty(v)).toSorted((a, b) => a.localeCompare(b)).join(",");
	if (warnedDeprecatedUsersEmailAllowFrom.has(key)) return;
	warnedDeprecatedUsersEmailAllowFrom.add(key);
	logVerbose(`Deprecated allowFrom entry detected: "users/<email>" is no longer treated as an email allowlist. Use raw email (alice@example.com) or immutable user id (users/<id>). entries=${deprecated.join(", ")}`);
}
function warnMutableGroupKeysConfigured(logVerbose, groups) {
	const mutableKeys = Object.keys(groups ?? {}).map((key) => key.trim()).filter((key) => key && key !== "*" && !/^spaces\//i.test(key));
	if (mutableKeys.length === 0) return;
	const warningKey = mutableKeys.map((key) => normalizeLowercaseStringOrEmpty(key)).toSorted((a, b) => a.localeCompare(b)).join(",");
	if (warnedMutableGroupKeys.has(warningKey)) return;
	warnedMutableGroupKeys.add(warningKey);
	logVerbose(`Deprecated Google Chat group key detected: group routing now requires stable space ids (spaces/<spaceId>). Update channels.googlechat.groups keys: ${mutableKeys.join(", ")}`);
}
async function applyGoogleChatInboundAccessPolicy(params) {
	const { account, config, core, space, message, isGroup, senderId, senderName, senderEmail, rawBody, statusSink, logVerbose } = params;
	const allowNameMatching = isDangerousNameMatchingEnabled(account.config);
	const spaceId = space.name ?? "";
	const pairing = createChannelPairingController({
		core,
		channel: "googlechat",
		accountId: account.accountId
	});
	const defaultGroupPolicy = resolveDefaultGroupPolicy(config);
	const { groupPolicy, providerMissingFallbackApplied } = resolveAllowlistProviderRuntimeGroupPolicy({
		providerConfigPresent: config.channels?.googlechat !== void 0,
		groupPolicy: account.config.groupPolicy,
		defaultGroupPolicy
	});
	warnMissingProviderGroupPolicyFallbackOnce({
		providerMissingFallbackApplied,
		providerKey: "googlechat",
		accountId: account.accountId,
		blockedLabel: GROUP_POLICY_BLOCKED_LABEL.space,
		log: logVerbose
	});
	warnMutableGroupKeysConfigured(logVerbose, account.config.groups ?? void 0);
	const groupConfigResolved = resolveGoogleChatGroupConfig({
		groupId: spaceId,
		groupName: space.displayName ?? null,
		groups: account.config.groups ?? void 0
	});
	const groupEntry = groupConfigResolved.entry;
	const groupUsers = groupEntry?.users ?? account.config.groupAllowFrom ?? [];
	let effectiveWasMentioned;
	const dmPolicy = account.config.dmPolicy ?? "pairing";
	const rawConfigAllowFrom = normalizeStringEntries(account.config.allowFrom);
	const shouldComputeAuth = core.channel.commands.shouldComputeCommandAuthorized(rawBody, config);
	const groupActivation = (() => {
		if (!isGroup) return;
		const requireMention = groupEntry?.requireMention ?? account.config.requireMention ?? true;
		const mentionInfo = extractMentionInfo(message.annotations ?? [], account.config.botUser);
		return {
			requireMention,
			allowTextCommands: core.channel.commands.shouldHandleTextCommands({
				cfg: config,
				surface: "googlechat"
			}),
			hasControlCommand: core.channel.text.hasControlCommand(rawBody, config),
			wasMentioned: mentionInfo.wasMentioned,
			hasAnyMention: mentionInfo.hasAnyMention
		};
	})();
	const command = {
		hasControlCommand: groupActivation?.hasControlCommand ?? shouldComputeAuth,
		groupOwnerAllowFrom: "none"
	};
	const groupAllowFrom = normalizeStringEntries(groupUsers);
	const senderGroupPolicy = groupConfigResolved.allowlistConfigured && groupAllowFrom.length === 0 ? groupPolicy : groupPolicy === "disabled" ? "disabled" : groupAllowFrom.length > 0 ? "allowlist" : "open";
	const route = channelIngressRoutes(isGroup && groupPolicy !== "disabled" && groupEntry?.enabled === false && {
		id: "googlechat:space",
		enabled: false,
		matched: true,
		matchId: "googlechat-space",
		blockReason: "route_disabled"
	}, isGroup && groupPolicy === "allowlist" && groupEntry?.enabled !== false && !groupConfigResolved.allowlistConfigured && {
		id: "googlechat:space",
		allowed: false,
		blockReason: "empty_allowlist"
	}, isGroup && groupPolicy === "allowlist" && groupEntry?.enabled !== false && groupConfigResolved.allowlistConfigured && {
		id: "googlechat:space",
		senderPolicy: "deny-when-empty",
		...groupEntry ? { senderAllowFromSource: "effective-group" } : {},
		allowed: Boolean(groupEntry),
		matchId: "googlechat-space",
		blockReason: groupEntry ? "sender_empty_allowlist" : "route_not_allowlisted"
	});
	const resolvedAccess = await createChannelIngressResolver({
		channelId: "googlechat",
		accountId: account.accountId,
		identity: googleChatIngressIdentity,
		cfg: config,
		readStoreAllowFrom: pairing.readAllowFromStore
	}).message({
		subject: {
			stableId: senderId,
			aliases: { email: senderEmail }
		},
		conversation: {
			kind: isGroup ? "group" : "direct",
			id: spaceId
		},
		route,
		allowFrom: rawConfigAllowFrom,
		groupAllowFrom,
		dmPolicy,
		groupPolicy: senderGroupPolicy,
		policy: {
			groupAllowFromFallbackToAllowFrom: false,
			mutableIdentifierMatching: allowNameMatching ? "enabled" : "disabled",
			...groupActivation ? { activation: {
				requireMention: groupActivation.requireMention,
				allowTextCommands: groupActivation.allowTextCommands
			} } : {}
		},
		...groupActivation == null ? {} : { mentionFacts: {
			canDetectMention: true,
			wasMentioned: groupActivation.wasMentioned,
			hasAnyMention: groupActivation.hasAnyMention,
			implicitMentionKinds: []
		} },
		command
	});
	const senderAccess = resolvedAccess.senderAccess;
	const commandAuthorized = resolvedAccess.commandAccess.requested ? resolvedAccess.commandAccess.authorized : void 0;
	if (isGroup) {
		if (groupConfigResolved.deprecatedNameMatch) {
			logVerbose(`drop group message (deprecated mutable group key matched, space=${spaceId})`);
			return { ok: false };
		}
		const routeBlockReason = resolvedAccess.routeAccess.reason;
		if (routeBlockReason && routeBlockReason !== "sender_empty_allowlist") {
			if (routeBlockReason === "empty_allowlist") logVerbose(`drop group message (groupPolicy=allowlist, no allowlist, space=${spaceId})`);
			else if (routeBlockReason === "route_not_allowlisted") logVerbose(`drop group message (not allowlisted, space=${spaceId})`);
			else if (routeBlockReason === "route_disabled") logVerbose(`drop group message (space disabled, space=${spaceId})`);
			return { ok: false };
		}
		if (senderAccess.effectiveGroupAllowFrom.length > 0 && senderAccess.decision !== "allow") {
			warnDeprecatedUsersEmailEntries(logVerbose, senderAccess.effectiveGroupAllowFrom);
			logVerbose(`drop group message (sender not allowed, ${senderId})`);
			return { ok: false };
		}
	}
	const effectiveAllowFrom = senderAccess.effectiveAllowFrom;
	warnDeprecatedUsersEmailEntries(logVerbose, effectiveAllowFrom);
	if (isGroup && resolvedAccess.activationAccess.ran) {
		effectiveWasMentioned = resolvedAccess.activationAccess.effectiveWasMentioned;
		if (resolvedAccess.activationAccess.shouldSkip) {
			logVerbose(`drop group message (mention required, space=${spaceId})`);
			return { ok: false };
		}
	}
	if (isGroup && senderAccess.decision !== "allow") {
		logVerbose(`drop group message (sender policy blocked, reason=${resolvedAccess.ingress.reasonCode === "route_sender_empty" ? "groupPolicy=allowlist (empty allowlist)" : senderAccess.reasonCode}, space=${spaceId})`);
		return { ok: false };
	}
	if (!isGroup) {
		if (account.config.dm?.enabled === false) {
			logVerbose(`Blocked Google Chat DM from ${senderId} (dmPolicy=disabled)`);
			return { ok: false };
		}
		if (senderAccess.decision !== "allow") {
			if (senderAccess.decision === "pairing") await pairing.issueChallenge({
				senderId,
				senderIdLine: `Your Google Chat user id: ${senderId}`,
				meta: {
					name: senderName || void 0,
					email: senderEmail
				},
				onCreated: () => {
					logVerbose(`googlechat pairing request sender=${senderId}`);
				},
				sendPairingReply: async (text) => {
					await sendGoogleChatMessage({
						account,
						space: spaceId,
						text
					});
					statusSink?.({ lastOutboundAt: Date.now() });
				},
				onReplyError: (err) => {
					logVerbose(`pairing reply failed for ${senderId}: ${String(err)}`);
				}
			});
			else logVerbose(`Blocked unauthorized Google Chat sender ${senderId} (dmPolicy=${dmPolicy})`);
			return { ok: false };
		}
	}
	if (isGroup && core.channel.commands.isControlCommandMessage(rawBody, config) && commandAuthorized !== true) {
		logVerbose(`googlechat: drop control command from ${senderId}`);
		return { ok: false };
	}
	return {
		ok: true,
		commandAuthorized,
		effectiveWasMentioned,
		groupBotLoopProtection: groupEntry?.botLoopProtection,
		groupSystemPrompt: normalizeOptionalString(groupEntry?.systemPrompt)
	};
}
//#endregion
//#region extensions/googlechat/src/monitor-durable.ts
function resolveGoogleChatDurableReplyOptions(params) {
	if (params.infoKind !== "final" || params.hasTypingMessage) return false;
	const threadId = params.payload.replyToId?.trim() || void 0;
	if (!threadId) return {
		to: params.spaceId,
		replyToId: null
	};
	return {
		to: params.spaceId,
		replyToId: threadId,
		threadId
	};
}
//#endregion
//#region extensions/googlechat/src/monitor-event.ts
var GoogleChatEventPayloadError = class extends Error {
	constructor(message = "invalid payload") {
		super(message);
		this.name = "GoogleChatEventPayloadError";
	}
};
function isRecord$2(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function recordParamsToActionParameters(params) {
	if (!params) return;
	const entries = Object.entries(params).filter((entry) => typeof entry[1] === "string").map(([key, value]) => ({
		key,
		value
	}));
	return entries.length > 0 ? entries : void 0;
}
/** Normalize only at authenticated dispatch; durable admission stores the untouched envelope. */
function parseGoogleChatInboundPayload(raw) {
	if (!isRecord$2(raw)) throw new GoogleChatEventPayloadError();
	let eventPayload = raw;
	let addOnBearerToken = "";
	const rawObj = raw;
	if (rawObj.commonEventObject?.hostApp === "CHAT") addOnBearerToken = typeof rawObj.authorizationEventObject?.systemIdToken === "string" ? rawObj.authorizationEventObject.systemIdToken.trim() : "";
	const chat = rawObj.chat;
	const messagePayload = chat?.messagePayload;
	if (rawObj.commonEventObject?.hostApp === "CHAT" && chat && messagePayload) eventPayload = {
		type: "MESSAGE",
		space: messagePayload.space,
		message: messagePayload.message,
		user: chat.user,
		eventTime: chat.eventTime
	};
	else if (rawObj.commonEventObject?.hostApp === "CHAT") {
		const chatPayload = rawObj.chat;
		const buttonClickedPayload = chatPayload?.buttonClickedPayload;
		if (buttonClickedPayload) {
			const invokedFunction = rawObj.commonEventObject.invokedFunction;
			const actionParameters = recordParamsToActionParameters(rawObj.commonEventObject.parameters);
			eventPayload = {
				type: "CARD_CLICKED",
				space: buttonClickedPayload.space,
				message: buttonClickedPayload.message,
				user: buttonClickedPayload.user ?? chatPayload?.user,
				eventTime: chatPayload?.eventTime,
				action: buttonClickedPayload.action ?? {
					...typeof invokedFunction === "string" ? { actionMethodName: invokedFunction } : {},
					...actionParameters ? { parameters: actionParameters } : {}
				},
				commonEventObject: {
					...typeof invokedFunction === "string" ? { invokedFunction } : {},
					parameters: rawObj.commonEventObject.parameters
				}
			};
		}
	}
	const event = eventPayload;
	const eventType = event.type ?? event.eventType;
	if (typeof eventType !== "string" || !isRecord$2(event.space)) throw new GoogleChatEventPayloadError();
	if (eventType === "MESSAGE") {
		if (!isRecord$2(event.message) || !event.space?.name?.trim() || !event.message?.name?.trim()) throw new GoogleChatEventPayloadError();
	} else if (eventType === "CARD_CLICKED" && !isRecord$2(event.user)) throw new GoogleChatEventPayloadError();
	return {
		event,
		addOnBearerToken
	};
}
//#endregion
//#region extensions/googlechat/src/monitor-ingress.ts
const GOOGLECHAT_INGRESS_PAYLOAD_VERSION = 1;
const GOOGLECHAT_INGRESS_POLL_INTERVAL_MS = 500;
const GOOGLECHAT_INGRESS_PRUNE_INTERVAL_MS = 3600 * 1e3;
const GOOGLECHAT_INGRESS_MAX_CONCURRENT_DELIVERIES = 8;
const GOOGLECHAT_INGRESS_COMPLETED_TTL_MS = 720 * 60 * 60 * 1e3;
const GOOGLECHAT_INGRESS_COMPLETED_MAX_ENTRIES = 2e4;
const GOOGLECHAT_INGRESS_FAILED_TTL_MS = 720 * 60 * 60 * 1e3;
const GOOGLECHAT_INGRESS_FAILED_MAX_ENTRIES = 2e4;
var GoogleChatIngressPermanentError = class extends Error {
	constructor(reason, message, options) {
		super(message, options);
		this.reason = reason;
		this.name = "GoogleChatIngressPermanentError";
	}
};
function isRecord$1(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function requiredString(value, field) {
	if (typeof value === "string" && value.trim()) return value.trim();
	throw new GoogleChatIngressPermanentError("invalid-event", `Google Chat MESSAGE event is missing ${field}.`);
}
function inspectGoogleChatIngressEvent(raw) {
	if (!isRecord$1(raw)) throw new GoogleChatIngressPermanentError("invalid-event", "Google Chat webhook envelope must be an object.");
	const commonEventObject = isRecord$1(raw.commonEventObject) ? raw.commonEventObject : null;
	const chat = isRecord$1(raw.chat) ? raw.chat : null;
	const isAddOn = commonEventObject?.hostApp === "CHAT";
	let eventType = raw.type ?? raw.eventType;
	let space = isRecord$1(raw.space) ? raw.space : null;
	let message = isRecord$1(raw.message) ? raw.message : null;
	if (isAddOn) {
		const messagePayload = isRecord$1(chat?.messagePayload) ? chat.messagePayload : null;
		if (!messagePayload) return null;
		eventType = "MESSAGE";
		space = isRecord$1(messagePayload.space) ? messagePayload.space : null;
		message = isRecord$1(messagePayload.message) ? messagePayload.message : null;
	}
	if (eventType !== "MESSAGE") return null;
	const spaceName = requiredString(space?.name, "space.name");
	return {
		eventId: requiredString(message?.name, "message.name"),
		laneKey: `space:${spaceName}`
	};
}
function deserializeGoogleChatIngressEvent(rawEvent, claimedId) {
	let raw;
	try {
		raw = JSON.parse(rawEvent);
	} catch (error) {
		throw new GoogleChatIngressPermanentError("invalid-event", `Google Chat ingress row ${claimedId} contains invalid JSON.`, { cause: error });
	}
	return raw;
}
function normalizeClaimedGoogleChatEvent(raw, claimedId) {
	try {
		const parsed = parseGoogleChatInboundPayload(raw);
		if ((parsed.event.type ?? parsed.event.eventType) !== "MESSAGE") throw new GoogleChatEventPayloadError();
		return parsed.event;
	} catch (error) {
		throw new GoogleChatIngressPermanentError("invalid-event", `Google Chat ingress row ${claimedId} cannot be normalized.`, { cause: error });
	}
}
function resolveGoogleChatIngressNonRetryableFailure(error) {
	for (const candidate of collectErrorGraphCandidates(error, (current) => [current.cause])) {
		if (candidate instanceof GoogleChatIngressPermanentError) return {
			reason: candidate.reason,
			message: candidate.message
		};
		const message = formatErrorMessage(candidate);
		if (/Google Chat API 401\b/.test(message) || /^(?:Missing Google Chat access token|Google Chat (?:credentials|service account)\b|(?:Failed to load|Invalid) Google Chat service account\b)/.test(message)) return {
			reason: "googlechat-auth",
			message
		};
	}
	return null;
}
function createGoogleChatIngressMonitor(options) {
	const serializeForIngress = (rawEvent) => {
		if (!isRecord$1(rawEvent)) throw new GoogleChatIngressPermanentError("invalid-event", "Google Chat webhook envelope must be an object.");
		const durableEvent = { ...rawEvent };
		delete durableEvent.authorizationEventObject;
		const serialized = JSON.stringify(durableEvent);
		if (typeof serialized !== "string") throw new GoogleChatIngressPermanentError("invalid-event", "Google Chat webhook envelope cannot be serialized.");
		return serialized;
	};
	const monitor = createChannelIngressMonitor({
		queue: options.queue ?? (() => getGoogleChatRuntime().state.openChannelIngressQueue({ accountId: options.accountId })),
		inspect: (rawEvent) => inspectGoogleChatIngressEvent(rawEvent),
		payload: {
			storage: "raw-event",
			version: GOOGLECHAT_INGRESS_PAYLOAD_VERSION,
			serialize: serializeForIngress,
			deserialize: (rawEvent, { claim }) => deserializeGoogleChatIngressEvent(rawEvent, claim.id),
			createClaimError: (kind, claim) => new GoogleChatIngressPermanentError("invalid-event", kind === "invalid-version" ? `Google Chat ingress row ${claim.id} has an invalid payload.` : `Google Chat ingress row ${claim.id} has invalid message identity.`)
		},
		deliver: (rawEvent, lifecycle, claim) => options.dispatch(normalizeClaimedGoogleChatEvent(rawEvent, claim.id), lifecycle),
		pollIntervalMs: options.pollIntervalMs ?? GOOGLECHAT_INGRESS_POLL_INTERVAL_MS,
		retention: {
			pruneIntervalMs: GOOGLECHAT_INGRESS_PRUNE_INTERVAL_MS,
			completedTtlMs: GOOGLECHAT_INGRESS_COMPLETED_TTL_MS,
			completedMaxEntries: GOOGLECHAT_INGRESS_COMPLETED_MAX_ENTRIES,
			failedTtlMs: GOOGLECHAT_INGRESS_FAILED_TTL_MS,
			failedMaxEntries: GOOGLECHAT_INGRESS_FAILED_MAX_ENTRIES
		},
		drain: {
			resolveNonRetryableFailure: resolveGoogleChatIngressNonRetryableFailure,
			startLimit: GOOGLECHAT_INGRESS_MAX_CONCURRENT_DELIVERIES,
			...options.adoptionStallTimeoutMs === void 0 ? {} : { adoptionStallTimeoutMs: options.adoptionStallTimeoutMs },
			onLog: (message) => options.runtime.error?.(`googlechat: ${message}`)
		},
		...options.abortSignal ? { abortSignal: options.abortSignal } : {},
		admissionMode: "while-running",
		createStoppedError: () => /* @__PURE__ */ new Error("Google Chat ingress is stopped."),
		onError: (error) => options.runtime.error?.(`googlechat ingress drain failed: ${formatErrorMessage(error)}`)
	});
	return {
		receive: async (rawEvent) => {
			if (!monitor.isRunning()) throw new Error("Google Chat ingress is stopped.");
			let facts;
			try {
				facts = inspectGoogleChatIngressEvent(rawEvent);
			} catch (error) {
				if (error instanceof GoogleChatIngressPermanentError) return {
					kind: "invalid",
					message: error.message
				};
				throw error;
			}
			if (!facts) return { kind: "ignored" };
			await monitor.admit(rawEvent, { facts });
			return { kind: "durable" };
		},
		start: monitor.start,
		stop: monitor.stop,
		waitForIdle: monitor.waitForIdle
	};
}
//#endregion
//#region extensions/googlechat/src/monitor-reply-delivery.ts
async function deliverGoogleChatReply(params) {
	const { payload, account, spaceId, runtime, core, config, statusSink } = params;
	let typingMessage = params.typingMessage;
	const replyThreadName = payload.replyToId?.trim() || void 0;
	const typingMessageThreadName = typingMessage?.thread?.trim() || void 0;
	const reply = resolveSendableOutboundReplyParts(payload);
	const text = reply.text;
	let firstTextChunk = true;
	if (typingMessage && typingMessageThreadName !== replyThreadName) {
		try {
			await deleteGoogleChatMessage({
				account,
				messageName: typingMessage.name
			});
		} catch (err) {
			runtime.error?.(`Google Chat typing cleanup failed: ${String(err)}`);
		}
		typingMessage = void 0;
	}
	if (reply.hasMedia) runtime.error?.("Google Chat outbound attachments require user OAuth and are not supported by this service-account channel; sending text fallback only.");
	if (reply.hasMedia && !reply.hasText) {
		try {
			if (typingMessage) await deleteGoogleChatMessage({
				account,
				messageName: typingMessage.name
			});
		} catch (err) {
			runtime.error?.(`Google Chat typing cleanup failed: ${String(err)}`);
		}
		throw new Error("Google Chat outbound attachments require user OAuth and no text fallback is available.");
	}
	const chunkLimit = account.config.textChunkLimit ?? 4e3;
	const chunkMode = core.channel.text.resolveChunkMode(config, "googlechat", account.accountId);
	const sendTextMessage = async (chunk) => {
		await sendGoogleChatMessage({
			account,
			space: spaceId,
			text: chunk,
			thread: replyThreadName
		});
	};
	const chunks = core.channel.text.chunkMarkdownTextWithMode(text, chunkLimit, chunkMode);
	for (const chunk of chunks) {
		if (!chunk) continue;
		try {
			if (firstTextChunk && typingMessage) await updateGoogleChatMessage({
				account,
				messageName: typingMessage.name,
				text: chunk
			});
			else await sendTextMessage(chunk);
			firstTextChunk = false;
			statusSink?.({ lastOutboundAt: Date.now() });
		} catch (err) {
			runtime.error?.(`Google Chat message send failed: ${String(err)}`);
			if (firstTextChunk && typingMessage) {
				typingMessage = void 0;
				try {
					await sendTextMessage(chunk);
					statusSink?.({ lastOutboundAt: Date.now() });
				} catch (fallbackErr) {
					runtime.error?.(`Google Chat message fallback send failed: ${String(fallbackErr)}`);
				} finally {
					firstTextChunk = false;
				}
			}
		}
	}
}
//#endregion
//#region extensions/googlechat/src/monitor-webhook.ts
function extractBearerToken(header) {
	const authHeader = Array.isArray(header) ? typeof header[0] === "string" ? header[0] : "" : typeof header === "string" ? header : "";
	return normalizeLowercaseStringOrEmpty(authHeader).startsWith("bearer ") ? authHeader.slice(7).trim() : "";
}
const ADD_ON_PREAUTH_MAX_BYTES = 16 * 1024;
const ADD_ON_PREAUTH_TIMEOUT_MS = 3e3;
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function parseGoogleChatInboundPayloadOrReject(raw, res) {
	if (!isRecord(raw)) {
		res.statusCode = 400;
		res.end("invalid payload");
		return null;
	}
	const commonEventObject = isRecord(raw.commonEventObject) ? raw.commonEventObject : null;
	const authorizationEventObject = isRecord(raw.authorizationEventObject) ? raw.authorizationEventObject : null;
	let addOnBearerToken = "";
	if (commonEventObject?.hostApp === "CHAT" && typeof authorizationEventObject?.systemIdToken === "string") addOnBearerToken = authorizationEventObject.systemIdToken.trim();
	return {
		raw,
		addOnBearerToken
	};
}
async function verifyGoogleChatTargetAuth(target, bearer) {
	const verification = await verifyGoogleChatRequest({
		bearer,
		audienceType: target.audienceType,
		audience: target.audience,
		expectedAddOnPrincipal: target.account.config.appPrincipal
	});
	return verification.ok ? { ok: true } : {
		ok: false,
		reason: verification.reason ?? "unknown"
	};
}
function logGoogleChatWebhookAuthRejections(rejections) {
	for (const rejection of rejections) rejection.target.runtime.log?.(`[${rejection.target.account.accountId}] Google Chat webhook auth rejected: ${rejection.reason}`);
}
function logGoogleChatWebhookAuthRejectedForTargets(targets, reason) {
	logGoogleChatWebhookAuthRejections(targets.map((target) => ({
		target,
		reason
	})));
}
async function resolveGoogleChatWebhookTargetWithAuthOrReject(params) {
	const rejections = [];
	let verifiedTargetCount = 0;
	const selectedTarget = await resolveWebhookTargetWithAuthOrReject({
		targets: params.targets,
		res: params.res,
		isMatch: async (target) => {
			const verification = await verifyGoogleChatTargetAuth(target, params.bearer);
			if (verification.ok) {
				verifiedTargetCount += 1;
				return true;
			}
			rejections.push({
				target,
				reason: verification.reason
			});
			return false;
		}
	});
	if (!selectedTarget && verifiedTargetCount === 0) logGoogleChatWebhookAuthRejections(rejections);
	return selectedTarget;
}
function warnAppPrincipalMisconfiguration(params) {
	if (params.audienceType !== "app-url") return;
	const principal = params.appPrincipal?.trim();
	if (!principal) params.log?.(`[${params.accountId}] appPrincipal is missing for audienceType "app-url"; add-on token verification will fail. Set appPrincipal to the numeric OAuth 2.0 client ID (uniqueId, 21 digits), not an email.`);
	else if (principal.includes("@")) params.log?.(`[${params.accountId}] appPrincipal "${principal}" looks like an email address. Set appPrincipal to the numeric OAuth 2.0 client ID (uniqueId, 21 digits), not an email.`);
}
function createGoogleChatWebhookRequestHandler(params) {
	return async (req, res) => {
		const path = normalizeWebhookPath(new URL(req.url ?? "/", "http://localhost").pathname);
		const config = params.webhookTargets.get(path)?.[0]?.config;
		const clientIp = resolveRequestClientIp(req, config?.gateway?.trustedProxies, config?.gateway?.allowRealIpFallback === true) ?? "unknown";
		return await withResolvedWebhookRequestPipeline({
			req,
			res,
			targetsByPath: params.webhookTargets,
			allowMethods: ["POST"],
			requireJsonContentType: true,
			rateLimiter: params.webhookRateLimiter,
			rateLimitKey: `${path}:${clientIp}`,
			inFlightLimiter: params.webhookInFlightLimiter,
			handle: async ({ targets }) => {
				const headerBearer = extractBearerToken(req.headers.authorization);
				let selectedTarget;
				let parsedInbound;
				const readAndParseEvent = async (profile) => {
					const body = await readJsonWebhookBodyOrReject({
						req,
						res,
						profile,
						...profile === "pre-auth" ? {
							maxBytes: ADD_ON_PREAUTH_MAX_BYTES,
							timeoutMs: ADD_ON_PREAUTH_TIMEOUT_MS
						} : {},
						emptyObjectOnEmpty: false,
						invalidJsonMessage: "invalid payload"
					});
					if (!body.ok) return null;
					return parseGoogleChatInboundPayloadOrReject(body.value, res);
				};
				if (headerBearer) {
					selectedTarget = await resolveGoogleChatWebhookTargetWithAuthOrReject({
						targets,
						res,
						bearer: headerBearer
					});
					if (!selectedTarget) return true;
					const parsed = await readAndParseEvent("post-auth");
					if (!parsed) return true;
					parsedInbound = parsed;
				} else {
					const parsed = await readAndParseEvent("pre-auth");
					if (!parsed) return true;
					parsedInbound = parsed;
					if (!parsed.addOnBearerToken) {
						logGoogleChatWebhookAuthRejectedForTargets(targets, "missing token");
						res.statusCode = 401;
						res.end("unauthorized");
						return true;
					}
					selectedTarget = await resolveGoogleChatWebhookTargetWithAuthOrReject({
						targets,
						res,
						bearer: parsed.addOnBearerToken
					});
					if (!selectedTarget) return true;
				}
				if (!selectedTarget || !parsedInbound) {
					res.statusCode = 401;
					res.end("unauthorized");
					return true;
				}
				const dispatchTarget = selectedTarget;
				dispatchTarget.statusSink?.({ lastInboundAt: Date.now() });
				try {
					const admission = await dispatchTarget.ingress.receive(parsedInbound.raw);
					if (admission.kind === "invalid") {
						res.statusCode = 400;
						res.end("invalid payload");
						return true;
					}
					if (admission.kind === "ignored") {
						let event;
						try {
							event = parseGoogleChatInboundPayload(parsedInbound.raw).event;
						} catch {
							res.statusCode = 400;
							res.end("invalid payload");
							return true;
						}
						runDetachedWebhookWork(() => params.processEvent(event, dispatchTarget)).catch((err) => {
							dispatchTarget.runtime.error?.(`[${dispatchTarget.account.accountId}] Google Chat webhook failed: ${String(err)}`);
						});
					}
				} catch (error) {
					dispatchTarget.runtime.error?.(`[${dispatchTarget.account.accountId}] Google Chat durable admission failed: ${String(error)}`);
					res.statusCode = 503;
					res.end("failed to persist event");
					return true;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.end("{}");
				return true;
			}
		});
	};
}
//#endregion
//#region extensions/googlechat/src/monitor-routing.ts
const webhookTargets = /* @__PURE__ */ new Map();
const webhookRateLimiter = createFixedWindowRateLimiter({
	windowMs: WEBHOOK_RATE_LIMIT_DEFAULTS.windowMs,
	maxRequests: WEBHOOK_RATE_LIMIT_DEFAULTS.maxRequests,
	maxTrackedKeys: WEBHOOK_RATE_LIMIT_DEFAULTS.maxTrackedKeys
});
const webhookInFlightLimiter = createWebhookInFlightLimiter();
let processGoogleChatEvent$1 = async () => {};
function setGoogleChatWebhookEventProcessor(processEvent) {
	processGoogleChatEvent$1 = processEvent;
}
const googleChatWebhookRequestHandler = createGoogleChatWebhookRequestHandler({
	webhookTargets,
	webhookRateLimiter,
	webhookInFlightLimiter,
	processEvent: async (event, target) => {
		await processGoogleChatEvent$1(event, target);
	}
});
function registerGoogleChatWebhookTarget(target) {
	return registerWebhookTargetWithPluginRoute({
		targetsByPath: webhookTargets,
		target,
		route: {
			auth: "plugin",
			match: "exact",
			pluginId: "googlechat",
			source: "googlechat-webhook",
			accountId: target.account.accountId,
			log: target.runtime.log,
			handler: async (req, res) => {
				if (!await handleGoogleChatWebhookRequest(req, res) && !res.headersSent) {
					res.statusCode = 404;
					res.setHeader("Content-Type", "text/plain; charset=utf-8");
					res.end("Not Found");
				}
			}
		}
	}).unregister;
}
async function handleGoogleChatWebhookRequest(req, res) {
	return await googleChatWebhookRequestHandler(req, res);
}
//#endregion
//#region extensions/googlechat/src/monitor.ts
setGoogleChatWebhookEventProcessor(processGoogleChatEvent);
function logVerbose(core, runtime, message) {
	if (core.logging.shouldLogVerbose()) runtime.log?.(`[googlechat] ${message}`);
}
function normalizeAudienceType(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "app-url" || normalized === "app_url" || normalized === "app") return "app-url";
	if (normalized === "project-number" || normalized === "project_number" || normalized === "project") return "project-number";
}
function resolveGoogleChatTimestampMs(eventTime) {
	if (!eventTime) return;
	const parsed = Date.parse(eventTime);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function resolveGoogleChatBotLoopProtection(params) {
	if (!params.allowBots || !params.isBotSender || !params.senderId || params.senderId === params.appUserId) return;
	return {
		scopeId: params.accountId,
		conversationId: params.conversationId,
		senderId: params.senderId,
		receiverId: params.appUserId,
		config: params.config,
		defaultsConfig: params.defaultsConfig,
		defaultEnabled: true,
		nowMs: resolveGoogleChatTimestampMs(params.eventTime)
	};
}
function resolveGoogleChatBotLoopProtectionConfig(params) {
	return mergePairLoopGuardConfig(params.accountConfig, params.groupConfig);
}
function shouldSuppressGoogleChatBotLoop(params) {
	if (!params.botLoopProtection) return false;
	if (!recordChannelBotPairLoopAndCheckSuppression(params.botLoopProtection).suppressed) return false;
	logVerbose(params.core, params.runtime, `skip bot-to-bot loop in ${params.botLoopProtection.conversationId}`);
	return true;
}
async function processGoogleChatEvent(event, target, turnAdoptionLifecycle) {
	const eventType = event.type ?? event.eventType;
	if (eventType === "CARD_CLICKED") {
		await maybeHandleGoogleChatApprovalCardClick({
			event,
			target
		});
		return;
	}
	if (eventType !== "MESSAGE") return;
	if (!event.message || !event.space) return;
	await processMessageWithPipeline({
		event,
		account: target.account,
		config: target.config,
		runtime: target.runtime,
		core: target.core,
		statusSink: target.statusSink,
		mediaMaxMb: target.mediaMaxMb,
		turnAdoptionLifecycle
	});
}
/**
* Resolve bot display name with fallback chain:
* 1. Account config name
* 2. Agent name from config
* 3. "OpenClaw" as generic fallback
*/
function resolveBotDisplayName(params) {
	const { accountName, agentId, config } = params;
	if (accountName?.trim()) return accountName.trim();
	const agent = config.agents?.list?.find((a) => a.id === agentId);
	if (agent?.name?.trim()) return agent.name.trim();
	return "OpenClaw";
}
async function processMessageWithPipeline(params) {
	const { event, account, config, runtime, core, statusSink, mediaMaxMb, turnAdoptionLifecycle } = params;
	const space = event.space;
	const message = event.message;
	if (!space || !message) return;
	const spaceId = space.name ?? "";
	if (!spaceId) return;
	const isGroup = isGoogleChatGroupSpace(space);
	const sender = message.sender ?? event.user;
	const senderId = sender?.name ?? "";
	const senderName = sender?.displayName ?? "";
	const senderEmail = sender?.email ?? void 0;
	const isBotSender = sender?.type?.toUpperCase() === "BOT";
	const appUserId = account.config.botUser?.trim() || "users/app";
	const allowBots = account.config.allowBots === true;
	if (!allowBots) {
		if (isBotSender) {
			logVerbose(core, runtime, `skip bot-authored message (${senderId || "unknown"})`);
			return;
		}
		if (senderId === "users/app") {
			logVerbose(core, runtime, "skip app-authored message");
			return;
		}
	}
	const messageText = (message.argumentText ?? message.text ?? "").trim();
	const attachments = message.attachment ?? [];
	const rawBody = messageText;
	if (!rawBody && attachments.length === 0) return;
	const access = await applyGoogleChatInboundAccessPolicy({
		account,
		config,
		core,
		space,
		message,
		isGroup,
		senderId,
		senderName,
		senderEmail,
		rawBody,
		statusSink,
		logVerbose: (messageLocal) => logVerbose(core, runtime, messageLocal)
	});
	if (!access.ok) return;
	const { commandAuthorized, effectiveWasMentioned, groupBotLoopProtection, groupSystemPrompt } = access;
	if (shouldSuppressGoogleChatBotLoop({
		botLoopProtection: resolveGoogleChatBotLoopProtection({
			allowBots,
			isBotSender,
			senderId,
			appUserId,
			accountId: account.accountId,
			conversationId: spaceId,
			config: resolveGoogleChatBotLoopProtectionConfig({
				accountConfig: account.config.botLoopProtection,
				groupConfig: groupBotLoopProtection
			}),
			defaultsConfig: config.channels?.defaults?.botLoopProtection,
			eventTime: event.eventTime
		}),
		core,
		runtime
	})) return;
	const { route, buildEnvelope } = resolveChannelInboundRouteEnvelope({
		cfg: config,
		channel: "googlechat",
		accountId: account.accountId,
		peer: {
			kind: isGroup ? "group" : "direct",
			id: spaceId
		}
	});
	const mediaInputs = attachments.map((attachment) => ({ contentType: attachment.contentType }));
	const first = attachments.at(0);
	if (first) {
		const attachmentData = await downloadAttachment(first, account, mediaMaxMb, core);
		if (attachmentData) mediaInputs[0] = {
			path: attachmentData.path,
			url: attachmentData.path,
			contentType: attachmentData.contentType ?? first.contentType
		};
	}
	const media = toInboundMediaFacts(mediaInputs);
	const fromLabel = isGroup ? space.displayName || `space:${spaceId}` : senderName || `user:${senderId}`;
	const timestampMs = resolveGoogleChatTimestampMs(event.eventTime);
	const body = buildEnvelope({
		channel: "Google Chat",
		from: fromLabel,
		timestamp: timestampMs,
		body: rawBody
	});
	const replyThreadName = isGroup ? message.thread?.name : void 0;
	const ctxPayload = core.channel.inbound.buildContext({
		channel: "googlechat",
		accountId: route.accountId,
		messageId: message.name,
		messageIdFull: message.name,
		timestamp: timestampMs,
		from: `googlechat:${senderId}`,
		sender: {
			id: senderId,
			name: senderName || void 0,
			username: senderEmail,
			isBot: isBotSender || void 0
		},
		conversation: {
			kind: isGroup ? "channel" : "direct",
			id: spaceId,
			label: fromLabel
		},
		route: {
			agentId: route.agentId,
			dmScope: route.dmScope,
			accountId: route.accountId,
			routeSessionKey: route.sessionKey
		},
		reply: {
			to: `googlechat:${spaceId}`,
			originatingTo: `googlechat:${spaceId}`,
			replyToId: replyThreadName,
			replyToIdFull: replyThreadName
		},
		message: {
			body,
			bodyForAgent: rawBody,
			rawBody,
			commandBody: rawBody
		},
		media: media.length > 0 ? media : void 0,
		supplemental: { groupSystemPrompt: isGroup ? groupSystemPrompt : void 0 },
		extra: {
			ChatType: isGroup ? "channel" : "direct",
			WasMentioned: isGroup ? effectiveWasMentioned : void 0,
			CommandAuthorized: commandAuthorized,
			GroupSubject: void 0,
			GroupSpace: isGroup ? space.displayName ?? void 0 : void 0
		}
	});
	let typingIndicator = account.config.typingIndicator ?? "message";
	if (typingIndicator === "reaction") {
		runtime.error?.(`[${account.accountId}] typingIndicator="reaction" requires user OAuth (not supported with service account). Falling back to "message" mode.`);
		typingIndicator = "message";
	}
	let typingMessage;
	const typingMessageThreadName = account.config.replyToMode && account.config.replyToMode !== "off" ? replyThreadName : void 0;
	if (typingIndicator === "message") try {
		const result = await sendGoogleChatMessage({
			account,
			space: spaceId,
			text: `_${resolveBotDisplayName({
				accountName: account.config.name,
				agentId: route.agentId,
				config
			})} is typing..._`,
			thread: typingMessageThreadName
		});
		if (result?.messageName) typingMessage = {
			name: result.messageName,
			thread: typingMessageThreadName
		};
	} catch (err) {
		runtime.error?.(`Failed sending typing message: ${String(err)}`);
	}
	await core.channel.inbound.run({
		channel: "googlechat",
		accountId: route.accountId,
		raw: message,
		...turnAdoptionLifecycle ? { turnAdoptionLifecycle } : {},
		adapter: {
			ingest: () => ({
				id: message.name ?? spaceId,
				timestamp: timestampMs,
				rawText: rawBody,
				textForAgent: rawBody,
				textForCommands: rawBody,
				raw: message
			}),
			resolveTurn: () => ({
				cfg: config,
				channel: "googlechat",
				accountId: route.accountId,
				route: {
					agentId: route.agentId,
					sessionKey: route.sessionKey
				},
				ctxPayload,
				delivery: {
					durable: (payload, info) => resolveGoogleChatDurableReplyOptions({
						payload,
						infoKind: info.kind,
						spaceId,
						hasTypingMessage: Boolean(typingMessage)
					}),
					deliver: async (payload) => {
						await deliverGoogleChatReply({
							payload,
							account,
							spaceId,
							runtime,
							core,
							config,
							statusSink,
							typingMessage
						});
						typingMessage = void 0;
					},
					onDelivered: () => {
						statusSink?.({ lastOutboundAt: Date.now() });
					},
					onError: (err, info) => {
						runtime.error?.(`[${account.accountId}] Google Chat ${info.kind} reply failed: ${String(err)}`);
					}
				},
				replyPipeline: {},
				record: { onRecordError: (err) => {
					runtime.error?.(`googlechat: failed updating session meta: ${String(err)}`);
				} }
			})
		}
	});
}
async function downloadAttachment(attachment, account, mediaMaxMb, core) {
	const resourceName = attachment.attachmentDataRef?.resourceName;
	if (!resourceName) return null;
	const maxBytes = Math.max(1, mediaMaxMb) * 1024 * 1024;
	const downloaded = await downloadGoogleChatMedia({
		account,
		resourceName,
		maxBytes
	});
	const saved = await core.channel.media.saveMediaBuffer(downloaded.buffer, downloaded.contentType ?? attachment.contentType, "inbound", maxBytes, attachment.contentName);
	return {
		path: saved.path,
		contentType: saved.contentType
	};
}
async function monitorGoogleChatProvider(options) {
	const core = getGoogleChatRuntime();
	const webhookPath = resolveWebhookPath({
		webhookPath: options.webhookPath,
		webhookUrl: options.webhookUrl,
		defaultPath: "/googlechat"
	});
	if (!webhookPath) {
		options.runtime.error?.(`[${options.account.accountId}] invalid webhook path`);
		return async () => {};
	}
	const audienceType = normalizeAudienceType(options.account.config.audienceType);
	const audience = options.account.config.audience?.trim();
	const mediaMaxMb = options.account.config.mediaMaxMb ?? 20;
	warnAppPrincipalMisconfiguration({
		accountId: options.account.accountId,
		audienceType,
		appPrincipal: options.account.config.appPrincipal,
		log: options.runtime.log
	});
	const ingress = createGoogleChatIngressMonitor({
		accountId: options.account.accountId,
		runtime: options.runtime,
		abortSignal: options.abortSignal,
		dispatch: async (event, lifecycle) => {
			await processGoogleChatEvent(event, target, lifecycle);
		}
	});
	const target = {
		account: options.account,
		config: options.config,
		runtime: options.runtime,
		core,
		path: webhookPath,
		audienceType,
		audience,
		statusSink: options.statusSink,
		mediaMaxMb,
		ingress
	};
	ingress.start();
	let unregisterTarget;
	try {
		unregisterTarget = registerGoogleChatWebhookTarget(target);
	} catch (error) {
		await ingress.stop();
		throw error;
	}
	return async () => {
		unregisterTarget?.();
		await ingress.stop();
	};
}
async function startGoogleChatMonitor(params) {
	return await monitorGoogleChatProvider(params);
}
function resolveGoogleChatWebhookPath(params) {
	return resolveWebhookPath({
		webhookPath: params.account.config.webhookPath,
		webhookUrl: params.account.config.webhookUrl,
		defaultPath: "/googlechat"
	}) ?? "/googlechat";
}
//#endregion
//#region extensions/googlechat/src/channel.runtime.ts
const googleChatChannelRuntime = {
	probeGoogleChat,
	sendGoogleChatMessage,
	resolveGoogleChatWebhookPath,
	startGoogleChatMonitor
};
//#endregion
export { googleChatChannelRuntime };
