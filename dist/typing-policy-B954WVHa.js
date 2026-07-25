import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { t as applyMergePatch } from "./merge-patch-v6a67_Hq.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-CWirNxxC.js";
import "./registry-DiZXNr5-.js";
import "./message-channel-constants-BlZ7xkRW.js";
import { l as resolveStorePath } from "./paths-BpMRJ7TJ.js";
import { gt as listSessionEntries, yt as loadSessionEntry } from "./session-accessor-Mu3lv_Tl.js";
import "./message-channel-CkiwT4Uh.js";
import { t as formatSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import { c as resolveCommandTurnTargetSessionKey } from "./command-turn-context-DXqYoJ8B.js";
import { r as normalizeCommandBody } from "./commands-registry-normalize-Do42TntE.js";
import { n as resolveSessionKey } from "./session-key-DBDgeX2u.js";
import { a as isModelSelectionLocked, n as MODEL_SELECTION_LOCKED_RESET_MESSAGE, r as ModelSelectionLockedError } from "./model-overrides-BlzAR7Nc.js";
import { i as isFormattedGoalContinuationPrompt } from "./commands-goal-CaX8R908.js";
import "./commands-registry-D0-Z0N5x.js";
import { t as parseSoftResetCommand } from "./commands-reset-mode-CyVYz7U7.js";
import { o as stripMentions, s as stripStructuralPrefixes } from "./mentions-JuM7Ltm-.js";
import { n as hasInboundMedia } from "./inbound-media-5a6CUBEc.js";
import crypto from "node:crypto";
//#region src/auto-reply/reply/reply-config-runtime-mode.ts
const replyConfigRuntimeModes = /* @__PURE__ */ new WeakMap();
function markReplyConfigRuntimeMode(config, runtimeMode) {
	replyConfigRuntimeModes.set(config, runtimeMode);
	return config;
}
function isCompleteReplyConfig(config) {
	return Boolean(config && typeof config === "object" && replyConfigRuntimeModes.has(config));
}
function usesFullReplyRuntime(config) {
	return Boolean(config && typeof config === "object" && replyConfigRuntimeModes.get(config) === "full");
}
//#endregion
//#region src/auto-reply/reply/session-entry-handle.ts
function createReplySessionEntryHandle(params) {
	const entries = params.sessionStore ?? { [params.sessionKey]: params.sessionEntry };
	let currentEntry = params.sessionEntry;
	entries[params.sessionKey] = currentEntry;
	return {
		clearCurrent: () => {
			currentEntry = void 0;
			delete entries[params.sessionKey];
		},
		get: (sessionKey) => entries[sessionKey],
		getCurrent: () => currentEntry,
		patchCurrent: (patch) => {
			if (!currentEntry) return;
			currentEntry = {
				...currentEntry,
				...patch
			};
			entries[params.sessionKey] = currentEntry;
			return currentEntry;
		},
		replaceCurrent: (entry) => {
			currentEntry = entry;
			entries[params.sessionKey] = entry;
		},
		set: (sessionKey, entry) => {
			entries[sessionKey] = entry;
			if (sessionKey === params.sessionKey) currentEntry = entry;
		},
		toCompatSessionStore: () => entries
	};
}
//#endregion
//#region src/auto-reply/reply/get-reply-fast-path.ts
function isSlowReplyTestAllowed(env = process.env) {
	return env.OPENCLAW_ALLOW_SLOW_REPLY_TESTS === "1" || env.OPENCLAW_STRICT_FAST_REPLY_CONFIG === "0";
}
function resolveFastSessionKey(params) {
	const { ctx } = params;
	const nativeCommandTarget = resolveCommandTurnTargetSessionKey(ctx) ?? "";
	if (nativeCommandTarget) return nativeCommandTarget;
	return resolveSessionKey(params.sessionScope, ctx, params.mainKey);
}
function withFullRuntimeReplyConfig(config) {
	return markReplyConfigRuntimeMode(config, "full");
}
function resolveGetReplyConfig(params) {
	const { configOverride } = params;
	if (configOverride == null) return params.getRuntimeConfig();
	if (params.isFastTestEnv && !isCompleteReplyConfig(configOverride) && !isSlowReplyTestAllowed()) throw new Error("Fast reply tests must pass with withFastReplyConfig()/markCompleteReplyConfig(); set OPENCLAW_ALLOW_SLOW_REPLY_TESTS=1 to opt out.");
	if (params.isFastTestEnv && isCompleteReplyConfig(configOverride)) return configOverride;
	if (isCompleteReplyConfig(configOverride)) return configOverride;
	return applyMergePatch(params.getRuntimeConfig(), configOverride);
}
function shouldUseReplyFastTestBootstrap(params) {
	return params.isFastTestEnv && isCompleteReplyConfig(params.configOverride) && !usesFullReplyRuntime(params.configOverride);
}
function shouldUseReplyFastTestRuntime(params) {
	return params.isFastTestEnv && isCompleteReplyConfig(params.cfg) && !usesFullReplyRuntime(params.cfg);
}
function shouldUseReplyFastDirectiveExecution(params) {
	if (!params.isFastTestBootstrap || params.isGroup || params.isHeartbeat || params.resetTriggered) return false;
	return !params.triggerBodyNormalized.includes("/");
}
function buildFastReplyCommandContext(params) {
	const { ctx, cfg, agentId, sessionKey, isGroup, triggerBodyNormalized, commandAuthorized } = params;
	const originatingChannel = normalizeOptionalLowercaseString(ctx.OriginatingChannel);
	const surface = normalizeOptionalLowercaseString(ctx.Surface ?? ctx.Provider) ?? "";
	const channel = originatingChannel ?? normalizeOptionalLowercaseString(ctx.Provider ?? surface) ?? "";
	const from = normalizeOptionalString(ctx.From ?? ctx.SenderId);
	const to = normalizeOptionalString(ctx.To ?? ctx.OriginatingTo);
	return {
		surface,
		channel,
		channelId: normalizeAnyChannelId(channel) ?? normalizeAnyChannelId(surface) ?? void 0,
		accountId: normalizeOptionalString(ctx.AccountId),
		ownerList: [],
		senderIsOwner: false,
		isAuthorizedSender: commandAuthorized,
		senderId: from,
		abortKey: sessionKey ?? from ?? to,
		rawBodyNormalized: triggerBodyNormalized,
		commandBodyNormalized: normalizeCommandBody(isGroup ? stripMentions(triggerBodyNormalized, ctx, cfg, agentId) : triggerBodyNormalized, { botUsername: ctx.BotUsername }),
		from,
		to
	};
}
function shouldHandleFastReplyTextCommands(params) {
	return params.commandSource === "native" || params.cfg.commands?.text !== false;
}
function initFastReplySessionState(params) {
	const { ctx, cfg, agentId, commandAuthorized } = params;
	const sessionScope = cfg.session?.scope ?? "per-sender";
	const sessionKey = resolveFastSessionKey({
		ctx,
		sessionScope,
		mainKey: cfg.session?.mainKey
	});
	const storePath = resolveStorePath(cfg.session?.store, { agentId });
	const sessionStore = Object.fromEntries(listSessionEntries({ storePath }).map(({ sessionKey: entryKey, entry }) => [entryKey, entry]));
	const existingEntry = loadSessionEntry({
		storePath,
		sessionKey
	});
	const commandSource = ctx.BodyForCommands ?? ctx.CommandBody ?? ctx.RawBody ?? ctx.Body ?? "";
	const triggerBodyNormalized = isFormattedGoalContinuationPrompt(commandSource) ? commandSource.trim() : stripStructuralPrefixes(commandSource).trim();
	const normalizedChatType = normalizeChatType(ctx.ChatType);
	const isGroup = normalizedChatType != null && normalizedChatType !== "direct";
	const normalizedResetBody = normalizeCommandBody(isGroup ? stripMentions(triggerBodyNormalized, ctx, cfg, agentId) : triggerBodyNormalized, { botUsername: ctx.BotUsername });
	const softReset = parseSoftResetCommand(normalizedResetBody);
	const resetMatch = normalizedResetBody.match(/^\/(new|reset)(?:\s|$)/i);
	const resetTriggered = Boolean(resetMatch) && !softReset.matched;
	if (resetTriggered && isModelSelectionLocked(existingEntry)) throw new ModelSelectionLockedError(MODEL_SELECTION_LOCKED_RESET_MESSAGE);
	const previousSessionEntry = resetTriggered && existingEntry ? { ...existingEntry } : void 0;
	const sessionId = !resetTriggered && existingEntry ? existingEntry.sessionId : crypto.randomUUID();
	const bodyStripped = resetTriggered ? normalizedResetBody.slice(resetMatch?.[0].length ?? 0).trimStart() : ctx.BodyForAgent ?? ctx.Body ?? "";
	const now = Date.now();
	const sessionFile = !resetTriggered && existingEntry?.sessionFile ? existingEntry.sessionFile : formatSqliteSessionFileMarker({
		agentId,
		sessionId,
		storePath
	});
	const sessionEntry = {
		...!resetTriggered ? existingEntry : void 0,
		sessionId,
		sessionFile,
		updatedAt: now,
		sessionStartedAt: resetTriggered ? now : existingEntry?.sessionStartedAt ?? now,
		lastInteractionAt: now,
		agentStatus: void 0,
		thinkingLevel: resetTriggered ? existingEntry?.thinkingLevel : existingEntry?.thinkingLevel,
		verboseLevel: resetTriggered ? existingEntry?.verboseLevel : existingEntry?.verboseLevel,
		reasoningLevel: resetTriggered ? existingEntry?.reasoningLevel : existingEntry?.reasoningLevel,
		ttsAuto: resetTriggered ? existingEntry?.ttsAuto : existingEntry?.ttsAuto,
		responseUsage: existingEntry?.responseUsage,
		modelOverride: resetTriggered ? existingEntry?.modelOverride : existingEntry?.modelOverride,
		providerOverride: resetTriggered ? existingEntry?.providerOverride : existingEntry?.providerOverride,
		authProfileOverride: resetTriggered ? existingEntry?.authProfileOverride : existingEntry?.authProfileOverride,
		authProfileOverrideSource: resetTriggered ? existingEntry?.authProfileOverrideSource : existingEntry?.authProfileOverrideSource,
		authProfileOverrideCompactionCount: resetTriggered ? existingEntry?.authProfileOverrideCompactionCount : existingEntry?.authProfileOverrideCompactionCount,
		...normalizedChatType ? { chatType: normalizedChatType } : {},
		...normalizeOptionalString(ctx.Provider) ? { channel: normalizeOptionalString(ctx.Provider) } : {},
		...normalizeOptionalString(ctx.GroupSubject) ? { subject: normalizeOptionalString(ctx.GroupSubject) } : {},
		...normalizeOptionalString(ctx.GroupChannel) ? { groupChannel: normalizeOptionalString(ctx.GroupChannel) } : {}
	};
	sessionStore[sessionKey] = sessionEntry;
	const sessionEntryHandle = createReplySessionEntryHandle({
		sessionEntry,
		sessionKey,
		sessionStore
	});
	return {
		sessionCtx: {
			...ctx,
			SessionKey: sessionKey,
			CommandAuthorized: commandAuthorized,
			BodyStripped: bodyStripped,
			...normalizedChatType ? { ChatType: normalizedChatType } : {}
		},
		sessionEntry,
		initialSessionEntry: existingEntry ? { ...existingEntry } : void 0,
		sessionEntryHandle,
		sessionStore,
		sessionKey,
		sessionId,
		isNewSession: resetTriggered || !existingEntry,
		resetTriggered,
		systemSent: false,
		abortedLastRun: false,
		storePath,
		sessionScope,
		groupResolution: void 0,
		isGroup,
		bodyStripped,
		triggerBodyNormalized,
		previousSessionEntry
	};
}
//#endregion
//#region src/auto-reply/reply/stage-remote-inbound-media.ts
/** Shared guard for staging remote inbound media into the local cache. */
const stageSandboxMediaRuntimeLoader = createLazyImportLoader(() => import("./stage-sandbox-media.runtime.js"));
/**
* Stage remote (SCP) inbound media before downstream consumers read the media
* paths off ctx, then mark MediaStaged so the single-stage contract holds for
* later staging sites. Both the dispatch plugin-claim path and get-reply's
* media-understanding path rely on this rewrite to expose the local cache path
* instead of the unreachable remote host path; returns whether staging ran.
*/
async function stageRemoteInboundMediaIfNeeded(params) {
	if (!params.sessionKey || params.ctx.MediaStaged || !normalizeOptionalString(params.ctx.MediaRemoteHost) || !hasInboundMedia(params.ctx)) return false;
	const { stageSandboxMedia } = await stageSandboxMediaRuntimeLoader.load();
	if ((await stageSandboxMedia({
		ctx: params.ctx,
		sessionCtx: params.ctx,
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		remoteMediaMode: params.remoteMediaMode
	})).staged.size === 0) return false;
	params.ctx.MediaStaged = true;
	return true;
}
//#endregion
//#region src/auto-reply/reply/typing-policy.ts
/** Resolves typing policy and suppresses typing for non-user-visible turns. */
function resolveRunTypingPolicy(params) {
	const typingPolicy = params.isHeartbeat ? "heartbeat" : params.originatingChannel === "webchat" ? "internal_webchat" : params.systemEvent ? "system_event" : params.requestedPolicy ?? "auto";
	return {
		typingPolicy,
		suppressTyping: params.suppressTyping === true || typingPolicy === "heartbeat" || typingPolicy === "system_event" || typingPolicy === "internal_webchat"
	};
}
//#endregion
export { resolveGetReplyConfig as a, shouldUseReplyFastTestBootstrap as c, createReplySessionEntryHandle as d, initFastReplySessionState as i, shouldUseReplyFastTestRuntime as l, stageRemoteInboundMediaIfNeeded as n, shouldHandleFastReplyTextCommands as o, buildFastReplyCommandContext as r, shouldUseReplyFastDirectiveExecution as s, resolveRunTypingPolicy as t, withFullRuntimeReplyConfig as u };
