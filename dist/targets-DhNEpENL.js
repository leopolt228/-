import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { x as resolveStateDir } from "./paths-CHQRdQZ3.js";
import { $ as executeSqliteQueryTakeFirstSync, Q as executeSqliteQuerySync, et as getNodeSqliteKysely } from "./openclaw-state-db-DkOMT2fb.js";
import "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { E as parseAgentSessionKey } from "./session-key-Drrs61Fd.js";
import { c as resolveDefaultAgentId, n as listAgentIds } from "./agent-scope-config-S7z_Yn4H.js";
import { _ as normalizeConversationPeerId, g as buildConversationRef } from "./openclaw-agent-db-BZ3-lIlN.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import { c as normalizeAccountId, i as mergeDeliveryContext, n as deliveryContextFromSession, o as normalizeDeliveryContext, s as normalizeSessionDeliveryFields, t as deliveryContextFromChannelRoute } from "./delivery-context.shared-D6zu5SGz.js";
import { r as isInternalNonDeliveryChannel } from "./message-channel-constants-BlZ7xkRW.js";
import { l as resolveStorePath, t as resolveAgentsDirFromSessionStorePath } from "./paths-BpMRJ7TJ.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-CkQTY-i9.js";
import { t as resolveConversationLabel } from "./conversation-label-pgUV7Er9.js";
import { a as normalizeChannelId, n as getLoadedChannelPlugin } from "./registry-DqyhCDsQ.js";
import "./plugins-CJcRWm9n.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-DYDkUiW3.js";
import "./message-channel-CkiwT4Uh.js";
import { r as resolveGroupSessionKey, t as buildGroupDisplayName } from "./group-53X92WOi.js";
import { a as resolveSessionEntryCandidates, i as normalizeStoreSessionKey, t as foldedSessionKeyAliasCandidates } from "./store-entry-Z-CrJCro.js";
import { t as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-BgE0IcT5.js";
import { i as normalizeSqliteSessionKey, r as getSessionKysely, t as cloneSessionEntry } from "./session-accessor.sqlite-scope-pPt31SN9.js";
import { n as deleteSessionTranscriptIndexInTransaction } from "./session-transcript-index-CuV_vDJQ.js";
import { n as resolveAgentSessionDirsFromAgentsDirSync } from "./session-dirs-D4v_ujH0.js";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
//#region src/config/sessions/metadata.ts
function isSystemEventProvider(provider) {
	return provider === "heartbeat" || provider === "cron-event" || provider === "exec-event";
}
const mergeOrigin = (existing, next) => {
	if (!existing && !next) return;
	const merged = existing ? { ...existing } : {};
	const nextProvider = next?.provider;
	const nextIsDeliverableChannel = nextProvider != null && nextProvider !== "webchat" && !isInternalNonDeliveryChannel(nextProvider) && !isSystemEventProvider(nextProvider);
	if (existing != null && nextIsDeliverableChannel && (existing.provider != null && nextProvider !== existing.provider || existing.surface != null && next?.surface != null && next.surface !== existing.surface || existing.accountId != null && next?.accountId != null && next.accountId !== existing.accountId)) {
		delete merged.nativeChannelId;
		delete merged.nativeDirectUserId;
		delete merged.accountId;
		delete merged.threadId;
	}
	if (next?.label) merged.label = next.label;
	if (next?.provider) merged.provider = next.provider;
	if (next?.surface) merged.surface = next.surface;
	if (next?.chatType) merged.chatType = next.chatType;
	if (next?.from) merged.from = next.from;
	if (next?.to) merged.to = next.to;
	if (next?.nativeChannelId) merged.nativeChannelId = next.nativeChannelId;
	if (next?.nativeDirectUserId) merged.nativeDirectUserId = next.nativeDirectUserId;
	if (next?.accountId) merged.accountId = next.accountId;
	if (next?.threadId != null && next.threadId !== "") merged.threadId = next.threadId;
	return Object.keys(merged).length > 0 ? merged : void 0;
};
/** Derives session origin metadata from an inbound message context. */
function deriveSessionOrigin(ctx, opts) {
	if (opts?.skipSystemEventOrigin && isSystemEventProvider(ctx.Provider)) return;
	const label = normalizeOptionalString(resolveConversationLabel(ctx));
	const provider = normalizeMessageChannel(typeof ctx.OriginatingChannel === "string" && ctx.OriginatingChannel || ctx.Surface || ctx.Provider);
	const surface = normalizeOptionalLowercaseString(ctx.Surface);
	const chatType = normalizeChatType(ctx.ChatType) ?? void 0;
	const from = normalizeOptionalString(ctx.From);
	const to = normalizeOptionalString(typeof ctx.OriginatingTo === "string" ? ctx.OriginatingTo : ctx.To);
	const nativeChannelId = normalizeOptionalString(ctx.NativeChannelId);
	const nativeDirectUserId = normalizeOptionalString(ctx.NativeDirectUserId);
	const accountId = normalizeOptionalString(ctx.AccountId);
	const threadId = ctx.MessageThreadId ?? void 0;
	const origin = {};
	if (label) origin.label = label;
	if (provider) origin.provider = provider;
	if (surface) origin.surface = surface;
	if (chatType) origin.chatType = chatType;
	if (from) origin.from = from;
	if (to) origin.to = to;
	if (nativeChannelId) origin.nativeChannelId = nativeChannelId;
	if (nativeDirectUserId) origin.nativeDirectUserId = nativeDirectUserId;
	if (accountId) origin.accountId = accountId;
	if (threadId != null && threadId !== "") origin.threadId = threadId;
	return Object.keys(origin).length > 0 ? origin : void 0;
}
function snapshotSessionOrigin(entry) {
	if (!entry?.origin) return;
	return { ...entry.origin };
}
function deriveGroupSessionPatch(params) {
	const resolution = params.groupResolution ?? resolveGroupSessionKey(params.ctx);
	if (!resolution?.channel) return null;
	const channel = resolution.channel;
	const subject = params.ctx.GroupSubject?.trim();
	const space = params.ctx.GroupSpace?.trim();
	const explicitChannel = params.ctx.GroupChannel?.trim();
	const subjectLooksChannel = Boolean(subject?.startsWith("#"));
	const normalizedChannel = subjectLooksChannel && resolution.chatType !== "channel" ? normalizeChannelId(channel) : null;
	const isChannelProvider = Boolean(normalizedChannel && getLoadedChannelPlugin(normalizedChannel)?.capabilities.chatTypes.includes("channel"));
	const nextGroupChannel = explicitChannel ?? (subjectLooksChannel && subject && (resolution.chatType === "channel" || isChannelProvider) ? subject : void 0);
	const nextSubject = nextGroupChannel ? void 0 : subject;
	const patch = {
		chatType: resolution.chatType ?? "group",
		channel,
		groupId: resolution.id
	};
	if (nextSubject) patch.subject = nextSubject;
	if (nextGroupChannel) patch.groupChannel = nextGroupChannel;
	if (space) patch.space = space;
	const displayName = buildGroupDisplayName({
		provider: channel,
		subject: nextSubject ?? params.existing?.subject,
		groupChannel: nextGroupChannel ?? params.existing?.groupChannel,
		space: space ?? params.existing?.space,
		id: resolution.id,
		key: params.sessionKey
	});
	if (displayName) patch.displayName = displayName;
	return patch;
}
function deriveSessionMetaPatch(params) {
	const groupPatch = deriveGroupSessionPatch(params);
	const origin = deriveSessionOrigin(params.ctx, { skipSystemEventOrigin: params.skipSystemEventOrigin });
	if (!groupPatch && !origin) return null;
	const patch = groupPatch ? { ...groupPatch } : {};
	const mergedOrigin = mergeOrigin(params.existing?.origin, origin);
	if (mergedOrigin) patch.origin = mergedOrigin;
	return Object.keys(patch).length > 0 ? patch : null;
}
function removeThreadFromDeliveryContext(context) {
	if (!context || context.threadId == null) return context;
	const next = { ...context };
	delete next.threadId;
	return next;
}
/**
* Derives the last-route/delivery patch for an inbound routing update. Route
* updates must not refresh activity timestamps; idle/daily reset evaluation
* relies on updatedAt from actual session turns (#49515). Shared by the file
* store and the SQLite accessor so both backends apply one routing policy.
*/
function deriveLastRoutePatch(params) {
	const { channel, to, accountId, threadId, ctx, existing } = params;
	const explicitContext = normalizeDeliveryContext(params.deliveryContext);
	const inlineContext = normalizeDeliveryContext({
		channel,
		to,
		accountId,
		threadId
	});
	const routeContext = deliveryContextFromChannelRoute(params.route);
	const mergedInput = mergeDeliveryContext(routeContext, mergeDeliveryContext(explicitContext, inlineContext));
	const explicitDeliveryContext = params.deliveryContext;
	const explicitThreadValue = (explicitDeliveryContext != null && Object.hasOwn(explicitDeliveryContext, "threadId") ? explicitDeliveryContext.threadId : void 0) ?? (threadId != null && threadId !== "" ? threadId : void 0);
	const merged = mergeDeliveryContext(mergedInput, Boolean(routeContext?.channel || routeContext?.to || explicitContext?.channel || explicitContext?.to || inlineContext?.channel || inlineContext?.to) && explicitThreadValue == null ? removeThreadFromDeliveryContext(deliveryContextFromSession(existing)) : deliveryContextFromSession(existing));
	const normalized = normalizeSessionDeliveryFields({
		route: params.route,
		deliveryContext: {
			channel: merged?.channel,
			to: merged?.to,
			accountId: merged?.accountId,
			threadId: merged?.threadId
		}
	});
	const metaPatch = ctx ? deriveSessionMetaPatch({
		ctx,
		sessionKey: params.sessionKey,
		existing,
		groupResolution: params.groupResolution
	}) : null;
	const basePatch = {
		route: normalized.route,
		deliveryContext: normalized.deliveryContext,
		lastChannel: normalized.lastChannel,
		lastTo: normalized.lastTo,
		lastAccountId: normalized.lastAccountId,
		lastThreadId: normalized.lastThreadId
	};
	return metaPatch ? {
		...basePatch,
		...metaPatch
	} : basePatch;
}
//#endregion
//#region src/config/sessions/conversation-identity.ts
function normalizeText(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function normalizeThreadId(value) {
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	return normalizeText(value);
}
function normalizeKind(value) {
	const normalized = normalizeChatType(typeof value === "string" ? value : void 0);
	if (normalized === "channel") return "channel";
	if (normalized === "group") return "group";
	return "direct";
}
function resolvePairedOriginPeerId(params) {
	if (params.kind !== "direct") return;
	const origin = params.entry.origin;
	const originFrom = normalizeText(origin?.from);
	const originTo = normalizeText(origin?.to);
	const originChannel = normalizeText(origin?.provider)?.toLowerCase();
	const deliveryChannel = normalizeText(params.deliveryContext?.channel)?.toLowerCase();
	if (!originFrom || originTo !== params.deliveryTarget || !originChannel || originChannel !== deliveryChannel || normalizeChatType(origin?.chatType) !== params.kind || (normalizeAccountId(origin?.accountId) ?? "default") !== (normalizeAccountId(params.deliveryContext?.accountId) ?? "default") || normalizeThreadId(origin?.threadId) !== normalizeThreadId(params.deliveryContext?.threadId)) return;
	return originFrom;
}
/** Builds one stable transport address from authoritative channel route facts. */
function buildConversationIdentity(params) {
	const channel = normalizeText(params.channel)?.toLowerCase();
	const rawPeerId = normalizeText(params.peerId);
	if (!channel || !rawPeerId) return null;
	const peerId = normalizeConversationPeerId(channel, rawPeerId);
	if (!peerId) return null;
	const deliveryTarget = normalizeText(params.deliveryTarget);
	if (!deliveryTarget) return null;
	const accountId = normalizeAccountId(params.accountId) ?? "default";
	const rawParent = normalizeText(params.parentConversationRef);
	const parentConversationRef = rawParent ? rawParent.startsWith("conv_") ? rawParent : buildConversationRef({
		channel,
		accountId,
		kind: params.kind,
		peerId: normalizeConversationPeerId(channel, rawParent)
	}) : void 0;
	const threadId = normalizeThreadId(params.threadId);
	return {
		conversationRef: buildConversationRef({
			channel,
			accountId,
			kind: params.kind,
			peerId,
			parentConversationRef,
			threadId
		}),
		channel,
		accountId,
		kind: params.kind,
		peerId,
		deliveryTarget,
		...parentConversationRef ? { parentConversationRef } : {},
		...threadId ? { threadId } : {},
		...normalizeText(params.nativeChannelId) ? { nativeChannelId: normalizeText(params.nativeChannelId) } : {},
		...normalizeText(params.nativeDirectUserId) ? { nativeDirectUserId: normalizeText(params.nativeDirectUserId) } : {},
		...normalizeText(params.label) ? { label: normalizeText(params.label) } : {},
		...params.metadata ? { metadata: params.metadata } : {}
	};
}
/** Derives a transport address from the canonical route snapshot persisted on a session. */
function conversationIdentityFromSessionEntry(entry) {
	const deliveryContext = mergeDeliveryContext(normalizeDeliveryContext(entry.deliveryContext), deliveryContextFromSession(entry));
	const kind = normalizeKind(entry.chatType);
	const routeTarget = normalizeText(deliveryContext?.to);
	const deliveryTarget = routeTarget ?? (kind === "direct" ? normalizeText(entry.origin?.from) : void 0);
	const routeOwnsTarget = Boolean(routeTarget);
	const channel = routeOwnsTarget ? deliveryContext?.channel : normalizeText(entry.origin?.provider) ?? normalizeText(entry.channel);
	const pairedOriginPeerId = routeTarget ? resolvePairedOriginPeerId({
		entry,
		deliveryContext,
		deliveryTarget: routeTarget,
		kind
	}) : void 0;
	return buildConversationIdentity({
		channel,
		accountId: routeOwnsTarget ? deliveryContext?.accountId : entry.origin?.accountId,
		kind,
		peerId: pairedOriginPeerId ?? deliveryTarget,
		deliveryTarget,
		threadId: routeOwnsTarget ? deliveryContext?.threadId : entry.origin?.threadId,
		nativeChannelId: entry.origin?.nativeChannelId,
		nativeDirectUserId: entry.origin?.nativeDirectUserId,
		label: entry.displayName ?? entry.label
	});
}
/** Derives the same stable address from live inbound channel facts. */
function conversationIdentityFromMsgContext(params) {
	const route = deriveSessionOrigin(params.ctx);
	const explicitDeliveryContext = normalizeDeliveryContext(params.deliveryContext);
	const deliveryContext = mergeDeliveryContext(explicitDeliveryContext, normalizeDeliveryContext({
		channel: route?.provider,
		to: route?.to,
		accountId: route?.accountId,
		threadId: route?.threadId
	}));
	const groupResolution = params.groupResolution ?? resolveGroupSessionKey(params.ctx);
	const kind = groupResolution?.chatType ?? normalizeKind(params.ctx.ChatType);
	const directIngressTarget = kind === "direct" ? normalizeText(params.ctx.From) : void 0;
	const useDirectIngressTarget = Boolean(directIngressTarget && !explicitDeliveryContext?.to);
	const deliveryTarget = useDirectIngressTarget ? directIngressTarget : normalizeText(deliveryContext?.to) ?? normalizeText(params.ctx.OriginatingTo) ?? normalizeText(params.ctx.To);
	return buildConversationIdentity({
		channel: useDirectIngressTarget ? normalizeText(route?.provider) ?? normalizeText(params.ctx.OriginatingChannel) ?? normalizeText(params.ctx.Provider) : deliveryContext?.channel ?? groupResolution?.channel ?? normalizeText(route?.provider) ?? normalizeText(params.ctx.OriginatingChannel) ?? normalizeText(params.ctx.Provider),
		accountId: useDirectIngressTarget ? route?.accountId ?? params.ctx.AccountId : deliveryContext?.accountId ?? route?.accountId ?? params.ctx.AccountId,
		kind,
		peerId: deliveryTarget,
		deliveryTarget,
		threadId: useDirectIngressTarget ? route?.threadId ?? params.ctx.MessageThreadId : deliveryContext?.threadId ?? params.ctx.MessageThreadId,
		nativeChannelId: params.ctx.NativeChannelId ?? route?.nativeChannelId,
		nativeDirectUserId: params.ctx.NativeDirectUserId ?? route?.nativeDirectUserId,
		label: normalizeText(resolveConversationLabel(params.ctx)) ?? route?.label
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-conversation.ts
/** Shared-main DMs multiplex peers through one context; every other routed session has one primary. */
function prepareSessionConversation(params) {
	const identity = conversationIdentityFromSessionEntry(params.entry);
	if (!identity) return null;
	return {
		identity,
		role: params.sessionScope === "shared-main" && identity.kind === "direct" ? "participant" : "primary"
	};
}
/** Upserts the address before the session row so its primary-conversation FK is always valid. */
function upsertConversationIdentity(database, identity, updatedAt) {
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.insertInto("conversations").values({
		conversation_id: identity.conversationRef,
		channel: identity.channel,
		account_id: identity.accountId,
		kind: identity.kind,
		peer_id: identity.peerId,
		delivery_target: identity.deliveryTarget,
		parent_conversation_id: identity.parentConversationRef ?? null,
		thread_id: identity.threadId ?? null,
		native_channel_id: identity.nativeChannelId ?? null,
		native_direct_user_id: identity.nativeDirectUserId ?? null,
		label: identity.label ?? null,
		metadata_json: identity.metadata ? JSON.stringify(identity.metadata) : null,
		created_at: updatedAt,
		updated_at: updatedAt
	}).onConflict((conflict) => conflict.column("conversation_id").doUpdateSet({
		channel: identity.channel,
		account_id: identity.accountId,
		kind: identity.kind,
		peer_id: identity.peerId,
		delivery_target: identity.deliveryTarget,
		parent_conversation_id: identity.parentConversationRef ?? null,
		thread_id: identity.threadId ?? null,
		native_channel_id: identity.nativeChannelId ?? null,
		native_direct_user_id: identity.nativeDirectUserId ?? null,
		label: identity.label ?? null,
		metadata_json: identity.metadata ? JSON.stringify(identity.metadata) : null,
		updated_at: updatedAt
	})));
}
/** Links one external address to its local context without conflating the two identities. */
function linkSessionConversation(params) {
	const { database, sessionId, conversation, updatedAt } = params;
	const db = getSessionKysely(database.db);
	if (conversation.role === "primary") {
		const stalePrimaryRows = executeSqliteQuerySync(database.db, db.selectFrom("session_conversations").select(["conversation_id", "first_seen_at"]).where("session_id", "=", sessionId).where("role", "=", "primary").where("conversation_id", "!=", conversation.identity.conversationRef)).rows;
		if (stalePrimaryRows.length > 0) {
			executeSqliteQuerySync(database.db, db.insertInto("session_conversations").values(stalePrimaryRows.map((row) => ({
				session_id: sessionId,
				conversation_id: row.conversation_id,
				role: "related",
				first_seen_at: row.first_seen_at,
				last_seen_at: updatedAt
			}))).onConflict((conflict) => conflict.columns([
				"session_id",
				"conversation_id",
				"role"
			]).doUpdateSet({ last_seen_at: updatedAt })));
			executeSqliteQuerySync(database.db, db.deleteFrom("session_conversations").where("session_id", "=", sessionId).where("role", "=", "primary").where("conversation_id", "!=", conversation.identity.conversationRef));
		}
	}
	executeSqliteQuerySync(database.db, db.deleteFrom("session_conversations").where("session_id", "=", sessionId).where("conversation_id", "=", conversation.identity.conversationRef).where("role", "!=", conversation.role));
	executeSqliteQuerySync(database.db, db.insertInto("session_conversations").values({
		session_id: sessionId,
		conversation_id: conversation.identity.conversationRef,
		role: conversation.role,
		first_seen_at: updatedAt,
		last_seen_at: updatedAt
	}).onConflict((conflict) => conflict.columns([
		"session_id",
		"conversation_id",
		"role"
	]).doUpdateSet({ last_seen_at: updatedAt })));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-normalize.ts
function createFallbackSessionEntry(patch) {
	const now = Date.now();
	return {
		sessionId: patch.sessionId ?? randomUUID(),
		updatedAt: patch.updatedAt ?? now,
		...patch
	};
}
function normalizeSqliteText(value) {
	return typeof value === "string" && value.trim() ? value.trim() : null;
}
function normalizeSqliteChatType(value) {
	if (value === "direct" || value === "group" || value === "channel") return value;
	return null;
}
function normalizeSqliteNumber(value) {
	return typeof value === "bigint" ? Number(value) : value;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-provenance.ts
function bindSessionEntryProvenance(entry) {
	const hookSource = entry.hookExternalContentSource;
	return {
		session_entry_provenance: 1,
		acp_owned: entry.acp ? 1 : 0,
		plugin_owner_id: typeof entry.pluginOwnerId === "string" && entry.pluginOwnerId.trim() ? entry.pluginOwnerId.trim() : null,
		hook_external_content_source: hookSource === "gmail" || hookSource === "webhook" ? hookSource : null
	};
}
function resolveSessionEntryProvenanceRow(params) {
	const db = getNodeSqliteKysely(params.database.db);
	const existingRoot = executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("sessions").select([
		"session_entry_provenance",
		"acp_owned",
		"plugin_owner_id",
		"hook_external_content_source"
	]).where("session_id", "=", params.entry.sessionId));
	const hasTranscript = Boolean(executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", params.entry.sessionId).limit(1)));
	if (existingRoot?.session_entry_provenance === 0 && (params.previousEntry?.sessionId === params.entry.sessionId || hasTranscript)) return {
		...params.boundSessionRow,
		session_entry_provenance: 0,
		acp_owned: 0,
		plugin_owner_id: null,
		hook_external_content_source: null
	};
	return existingRoot?.session_entry_provenance === 1 ? {
		...params.boundSessionRow,
		acp_owned: existingRoot.acp_owned === 1 ? 1 : params.boundSessionRow.acp_owned,
		plugin_owner_id: params.boundSessionRow.plugin_owner_id ?? existingRoot.plugin_owner_id,
		hook_external_content_source: params.boundSessionRow.hook_external_content_source ?? existingRoot.hook_external_content_source
	} : params.boundSessionRow;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-status.ts
function normalizeSqliteStatus(value) {
	return value === "running" || value === "done" || value === "failed" || value === "killed" || value === "timeout" ? value : null;
}
function parseSqliteSessionEntryJson(row) {
	try {
		const parsed = JSON.parse(row.entry_json);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function readSqliteSessionEntriesByStatus(database, statuses, sessionKeys) {
	const selectedStatuses = [...new Set(statuses)];
	const selectedSessionKeys = sessionKeys ? [...new Set(sessionKeys)] : void 0;
	if (selectedStatuses.length === 0 || selectedSessionKeys?.length === 0) return [];
	let query = getNodeSqliteKysely(database.db).selectFrom("session_entries").select([
		"session_key",
		"entry_json",
		"session_id",
		"updated_at"
	]).where("status", "in", selectedStatuses);
	if (selectedSessionKeys) query = query.where("session_key", "in", selectedSessionKeys);
	return executeSqliteQuerySync(database.db, query).rows.flatMap((row) => {
		const entry = parseSqliteSessionEntryJson(row);
		return entry ? [{
			entry,
			sessionKey: row.session_key
		}] : [];
	}).toSorted((a, b) => a.sessionKey.localeCompare(b.sessionKey));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-session-row.ts
function normalizeSqliteSessionEntryTimestamp(entry) {
	if (typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt)) return entry;
	const updatedAt = typeof entry.sessionStartedAt === "number" && Number.isFinite(entry.sessionStartedAt) ? entry.sessionStartedAt : Date.now();
	return {
		...entry,
		updatedAt
	};
}
function bindSqliteSessionRoot(params) {
	const updatedAt = Number.isFinite(params.entry.updatedAt) ? params.entry.updatedAt : params.updatedAt;
	return {
		session_id: params.entry.sessionId,
		session_key: params.sessionKey,
		session_scope: resolveSqliteSessionScope(params.entry, params.sessionKey),
		created_at: resolveSqliteSessionCreatedAt(params.entry, updatedAt),
		updated_at: updatedAt,
		...bindSessionEntryProvenance(params.entry),
		started_at: finiteSqliteNumber(params.entry.startedAt),
		ended_at: finiteSqliteNumber(params.entry.endedAt),
		status: normalizeSqliteStatus(params.entry.status),
		chat_type: normalizeSqliteChatType(params.entry.chatType),
		channel: resolveSqliteSessionChannel(params.entry),
		account_id: resolveSqliteSessionAccountId(params.entry),
		primary_conversation_id: null,
		model_provider: normalizeSqliteText(params.entry.modelProvider),
		model: normalizeSqliteText(params.entry.model),
		agent_harness_id: normalizeSqliteText(params.entry.agentHarnessId),
		parent_session_key: normalizeSqliteText(params.entry.parentSessionKey),
		spawned_by: normalizeSqliteText(params.entry.spawnedBy),
		display_name: resolveSqliteSessionDisplayName(params.entry)
	};
}
function resolveSqliteSessionScope(entry, sessionKey) {
	const chatType = normalizeSqliteChatType(entry.chatType);
	const normalizedKey = sessionKey.trim().toLowerCase();
	if (chatType === "direct" && (normalizedKey === "main" || normalizedKey.endsWith(":main"))) return "shared-main";
	if (chatType === "group" || chatType === "channel") return chatType;
	return "conversation";
}
function resolveSqliteSessionCreatedAt(entry, updatedAt) {
	for (const candidate of [
		entry.sessionStartedAt,
		entry.startedAt,
		entry.updatedAt,
		updatedAt
	]) if (typeof candidate === "number" && Number.isFinite(candidate) && candidate >= 0) return candidate;
	return updatedAt;
}
function finiteSqliteNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function resolveSqliteSessionChannel(entry) {
	return normalizeSqliteText(entry.channel) ?? normalizeSqliteText(entry.deliveryContext?.channel) ?? normalizeSqliteText(entry.lastChannel) ?? normalizeSqliteText(entry.origin?.provider);
}
function resolveSqliteSessionAccountId(entry) {
	return normalizeSqliteText(entry.deliveryContext?.accountId) ?? normalizeSqliteText(entry.lastAccountId) ?? normalizeSqliteText(entry.origin?.accountId);
}
function resolveSqliteSessionDisplayName(entry) {
	return normalizeSqliteText(entry.displayName) ?? normalizeSqliteText(entry.label) ?? normalizeSqliteText(entry.subject) ?? normalizeSqliteText(entry.groupId);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-state.ts
function createTranscriptGeneration() {
	return randomUUID().replaceAll("-", "");
}
/** Read the current raw transcript generation inside the caller's transaction. */
function readTranscriptGenerationInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_generations").select("generation").where("session_id", "=", sessionId))?.generation;
}
/** Materialize a generation once; pure appends must preserve an existing token. */
function ensureTranscriptGenerationInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	const generation = createTranscriptGeneration();
	executeSqliteQuerySync(database.db, db.insertInto("session_transcript_generations").values({
		session_id: sessionId,
		generation,
		updated_at: Date.now()
	}).onConflict((conflict) => conflict.column("session_id").doNothing()));
	return readTranscriptGenerationInTransaction(database, sessionId) ?? generation;
}
/** Rotate the watermark in the same transaction as destructive transcript replacement. */
function rotateTranscriptGenerationInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	const generation = createTranscriptGeneration();
	executeSqliteQuerySync(database.db, db.insertInto("session_transcript_generations").values({
		session_id: sessionId,
		generation,
		updated_at: Date.now()
	}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({
		generation,
		updated_at: Date.now()
	})));
	return generation;
}
function ensureTranscriptSessionRoot(database, scope, updatedAt) {
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.insertInto("sessions").values({
		session_id: scope.sessionId,
		session_key: scope.sessionKey,
		session_scope: "conversation",
		created_at: updatedAt,
		updated_at: updatedAt
	}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({
		session_key: scope.sessionKey,
		updated_at: updatedAt
	})));
	writeTranscriptSessionRoute(database, {
		sessionId: scope.sessionId,
		sessionKey: scope.sessionKey,
		updatedAt
	});
}
function writeSessionRoute(database, params) {
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.insertInto("session_routes").values({
		session_key: params.sessionKey,
		session_id: params.sessionId,
		updated_at: params.updatedAt
	}).onConflict((conflict) => conflict.column("session_key").doUpdateSet({
		session_id: params.sessionId,
		updated_at: params.updatedAt
	})));
}
function writeTranscriptSessionRoute(database, params) {
	const db = getSessionKysely(database.db);
	const existing = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_routes").select("session_id").where("session_key", "=", params.sessionKey));
	if (existing && existing.session_id !== params.sessionId) return;
	writeSessionRoute(database, params);
}
function readNextTranscriptSeq(database, sessionId) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select((eb) => eb.fn.max("seq").as("max_seq")).where("session_id", "=", sessionId));
	return (row?.max_seq === null || row?.max_seq === void 0 ? -1 : normalizeSqliteNumber(row.max_seq)) + 1;
}
function normalizeTranscriptMutationAtMs(value) {
	const timestamp = Math.floor(value);
	return Number.isFinite(timestamp) && timestamp >= 0 ? timestamp : void 0;
}
function readTranscriptMutationStateInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("sessions").select(["transcript_observed_at", "transcript_updated_at"]).where("session_id", "=", sessionId));
	return {
		observedAt: row?.transcript_observed_at ?? null,
		updatedAt: row?.transcript_updated_at ?? null
	};
}
function advanceTranscriptMutationAtInTransaction(database, sessionId, value, options = {}) {
	const transcriptUpdatedAt = normalizeTranscriptMutationAtMs(value);
	if (transcriptUpdatedAt === void 0) return;
	const state = readTranscriptMutationStateInTransaction(database, sessionId);
	const next = options.strictly ? Math.max(transcriptUpdatedAt, (state.updatedAt ?? -1) + 1, (state.observedAt ?? -1) + 1) : Math.max(transcriptUpdatedAt, state.updatedAt ?? 0);
	if (state.updatedAt !== null && state.updatedAt >= next) return;
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.updateTable("sessions").set({ transcript_updated_at: next }).where("session_id", "=", sessionId));
}
function touchTranscriptMutationInTransaction(database, sessionId) {
	const now = normalizeTranscriptMutationAtMs(Date.now());
	if (now !== void 0) advanceTranscriptMutationAtInTransaction(database, sessionId, now, { strictly: true });
}
function deleteSqliteTranscriptEventsInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.deleteFrom("transcript_event_identities").where("session_id", "=", sessionId));
	const result = executeSqliteQuerySync(database.db, db.deleteFrom("transcript_events").where("session_id", "=", sessionId));
	deleteSessionTranscriptIndexInTransaction(database.db, sessionId);
	return (result.numAffectedRows ?? 0n) > 0n;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-store.ts
var SqliteSessionMutationConflictError = class extends Error {
	constructor(operationLabel) {
		super(`SQLite session state changed while preparing ${operationLabel}`);
		this.name = "SqliteSessionMutationConflictError";
	}
};
function readSqliteSessionIdentitySnapshot(database, sessionKeys) {
	const snapshot = /* @__PURE__ */ new Map();
	for (const sessionKey of uniqueStrings([...sessionKeys].map((key) => key.trim()))) {
		const row = readExactSessionEntryRow(database, sessionKey);
		if (row) snapshot.set(sessionKey, cloneSessionEntry(row.entry));
	}
	return snapshot;
}
function createSqliteSessionIdentitySnapshot(rows) {
	return new Map(rows.map((row) => [row.sessionKey, cloneSessionEntry(row.entry)]));
}
function readSessionEntryRow(database, sessionKey) {
	const db = getSessionKysely(database.db);
	const lookupKeys = collectSessionEntryLookupKeys(database, sessionKey);
	if (lookupKeys.length === 0) return;
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_entries").selectAll().where("session_key", "in", lookupKeys).orderBy("session_key", "asc")).rows;
	const entries = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const entry = parseSqliteSessionEntryJson(row);
		if (!entry) continue;
		entries.set(row.session_key, {
			entry,
			legacyKeys: [],
			row
		});
	}
	const resolved = resolveSessionEntryCandidates({
		entries: [...entries].map(([candidateKey, value]) => ({
			entry: value.entry,
			sessionKey: candidateKey
		})),
		sessionKey
	});
	if (!resolved.existing) return;
	const selected = entries.get(resolved.existing.sessionKey);
	return selected ? {
		...selected,
		legacyKeys: resolved.legacyKeys
	} : void 0;
}
function readSqliteSessionEntrySelectionSnapshot(database, sessionKey, exact) {
	return {
		selected: exact ? readExactSessionEntryRow(database, sessionKey) : readSessionEntryRow(database, sessionKey),
		selectedRows: collectSessionEntryLookupKeys(database, sessionKey).toSorted().flatMap((candidateKey) => {
			const row = readExactSessionEntryRow(database, candidateKey);
			return row ? [{
				entry: cloneSessionEntry(row.entry),
				sessionKey: candidateKey
			}] : [];
		})
	};
}
function assertSqliteSessionEntrySelectionUnchanged(expected, current, operationLabel) {
	if (!(expected.selected?.row.session_key === current.selected?.row.session_key && sqliteSessionEntriesEqual(expected.selected?.entry, current.selected?.entry)) || !sqliteSessionSnapshotRowsEqual(expected.selectedRows, current.selectedRows)) throw new SqliteSessionMutationConflictError(operationLabel);
}
function collectSessionEntryLookupKeys(database, sessionKey) {
	const trimmedKey = sessionKey.trim();
	if (!trimmedKey) return [];
	const normalizedKey = normalizeStoreSessionKey(trimmedKey);
	const lookupKeys = /* @__PURE__ */ new Set([
		trimmedKey,
		normalizedKey,
		...foldedSessionKeyAliasCandidates(normalizedKey)
	]);
	const db = getSessionKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_entries").select("session_key").orderBy("session_key", "asc")).rows;
	for (const row of rows) if (normalizeStoreSessionKey(row.session_key) === normalizedKey) lookupKeys.add(row.session_key);
	return [...lookupKeys].filter(Boolean);
}
function readExactSessionEntryRow(database, sessionKey) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_entries").selectAll().where("session_key", "=", sessionKey));
	if (!row) return;
	const entry = parseSqliteSessionEntryJson(row);
	return entry ? {
		entry,
		legacyKeys: [],
		row
	} : void 0;
}
function readSqliteSessionEntryStore(database) {
	const db = getSessionKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_entries").select(["session_key", "entry_json"]).orderBy("session_key")).rows;
	const store = {};
	for (const row of rows) {
		const entry = parseSqliteSessionEntryJson(row);
		if (entry) store[row.session_key] = entry;
	}
	return store;
}
function readSqliteSessionEntryCount(database) {
	const db = getSessionKysely(database.db);
	const count = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_entries").select((eb) => eb.fn.countAll().as("entry_count")))?.entry_count;
	return count === void 0 || count === null ? 0 : normalizeSqliteNumber(count);
}
/** Lists persisted session keys without materializing their entry payloads. */
function readSqliteSessionEntryKeys(database) {
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("session_entries").select("session_key").orderBy("session_key", "asc")).rows.map((row) => row.session_key);
}
function resolveSqliteLifecyclePrimaryEntry(database, target) {
	let freshest;
	for (const key of target.storeKeys) {
		const row = readExactSessionEntryRow(database, key.trim());
		if (!row) continue;
		if (!freshest || (row.entry.updatedAt ?? 0) > (freshest.entry.updatedAt ?? 0)) freshest = {
			key,
			entry: row.entry
		};
	}
	return freshest ?? void 0;
}
function readSqliteLifecycleTargetSnapshot(database, target) {
	const normalized = normalizeSqliteLifecycleTarget(target);
	return {
		primary: resolveSqliteLifecyclePrimaryEntry(database, normalized),
		rows: normalized.storeKeys.flatMap((sessionKey) => {
			const row = readExactSessionEntryRow(database, sessionKey);
			return row ? [{
				entry: cloneSessionEntry(row.entry),
				sessionKey
			}] : [];
		})
	};
}
function assertSqliteLifecycleTargetSnapshotUnchanged(expected, current, operationLabel) {
	if (!(expected.primary?.key === current.primary?.key && sqliteSessionEntriesEqual(expected.primary?.entry, current.primary?.entry)) || !sqliteSessionSnapshotRowsEqual(expected.rows, current.rows)) throw new SqliteSessionMutationConflictError(operationLabel);
}
function normalizeSqliteLifecycleTarget(target) {
	const canonicalKey = normalizeSqliteSessionKey(target.canonicalKey);
	return {
		canonicalKey,
		storeKeys: uniqueStrings([canonicalKey, ...target.storeKeys.map(normalizeSqliteSessionKey)])
	};
}
function deleteSqliteSessionEntryRows(database, sessionKey) {
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.deleteFrom("session_routes").where("session_key", "=", sessionKey));
	executeSqliteQuerySync(database.db, db.deleteFrom("session_entries").where("session_key", "=", sessionKey));
}
function deleteSqliteLifecycleTargetRows(database, target) {
	for (const sessionKey of uniqueStrings([target.canonicalKey, ...target.storeKeys])) {
		const trimmed = sessionKey.trim();
		if (trimmed) deleteSqliteSessionEntryRows(database, trimmed);
	}
}
function sqliteSessionEntriesEqual(left, right) {
	if (!left || !right) return left === right;
	return JSON.stringify(left) === JSON.stringify(right);
}
function sqliteSessionSnapshotRowsEqual(left, right) {
	return left.length === right.length && left.every((row, index) => row.sessionKey === right[index]?.sessionKey && sqliteSessionEntriesEqual(row.entry, right[index]?.entry));
}
function sqliteLifecycleTargetMatchesExpectedEntry(database, target, expectedEntry) {
	const current = resolveSqliteLifecyclePrimaryEntry(database, target)?.entry;
	if (!current || !expectedEntry) return current === expectedEntry;
	return sqliteSessionEntriesEqual(current, expectedEntry);
}
function assertSqliteLifecycleTargetUnchanged(database, target, expectedEntry, operation) {
	if (sqliteLifecycleTargetMatchesExpectedEntry(database, target, expectedEntry)) return;
	throw new Error(`SQLite session entry changed before ${operation} lifecycle mutation`);
}
function deleteLegacySessionEntryRows(database, legacyKeys, sessionKey) {
	if (legacyKeys.length === 0) return;
	const db = getSessionKysely(database.db);
	for (const legacyKey of legacyKeys) {
		if (legacyKey === sessionKey) continue;
		executeSqliteQuerySync(database.db, db.deleteFrom("session_routes").where("session_key", "=", legacyKey));
		executeSqliteQuerySync(database.db, db.deleteFrom("session_entries").where("session_key", "=", legacyKey));
	}
}
function writeSessionEntry(database, sessionKey, entry) {
	const db = getSessionKysely(database.db);
	const normalizedEntry = normalizeSqliteSessionEntryTimestamp(entry);
	const updatedAt = normalizedEntry.updatedAt;
	const previousEntry = readExactSessionEntryRow(database, sessionKey)?.entry;
	const transcriptObservedAt = readTranscriptMutationStateInTransaction(database, normalizedEntry.sessionId).updatedAt ?? updatedAt;
	const boundSessionRoot = bindSqliteSessionRoot({
		entry: normalizedEntry,
		sessionKey,
		updatedAt
	});
	const conversation = prepareSessionConversation({
		entry: normalizedEntry,
		sessionScope: boundSessionRoot.session_scope
	});
	if (conversation) upsertConversationIdentity(database, conversation.identity, updatedAt);
	const sessionRow = resolveSessionEntryProvenanceRow({
		boundSessionRow: {
			...boundSessionRoot,
			primary_conversation_id: conversation?.role === "primary" ? conversation.identity.conversationRef : null,
			transcript_observed_at: transcriptObservedAt
		},
		database,
		entry: normalizedEntry,
		previousEntry
	});
	executeSqliteQuerySync(database.db, db.insertInto("sessions").values(sessionRow).onConflict((conflict) => conflict.column("session_id").doUpdateSet({
		session_key: sessionKey,
		session_scope: sessionRow.session_scope,
		transcript_observed_at: transcriptObservedAt,
		session_entry_provenance: sessionRow.session_entry_provenance,
		acp_owned: sessionRow.acp_owned,
		plugin_owner_id: sessionRow.plugin_owner_id,
		hook_external_content_source: sessionRow.hook_external_content_source,
		updated_at: updatedAt,
		started_at: sessionRow.started_at,
		ended_at: sessionRow.ended_at,
		status: sessionRow.status,
		chat_type: sessionRow.chat_type,
		channel: sessionRow.channel,
		account_id: sessionRow.account_id,
		primary_conversation_id: sessionRow.primary_conversation_id,
		model_provider: sessionRow.model_provider,
		model: sessionRow.model,
		agent_harness_id: sessionRow.agent_harness_id,
		parent_session_key: sessionRow.parent_session_key,
		spawned_by: sessionRow.spawned_by,
		display_name: sessionRow.display_name
	})));
	if (conversation) linkSessionConversation({
		database,
		sessionId: sessionRow.session_id,
		conversation,
		updatedAt
	});
	writeSessionRoute(database, {
		sessionId: sessionRow.session_id,
		sessionKey,
		updatedAt
	});
	executeSqliteQuerySync(database.db, db.insertInto("session_entries").values({
		session_key: sessionKey,
		session_id: normalizedEntry.sessionId,
		entry_json: JSON.stringify(normalizedEntry),
		updated_at: updatedAt,
		status: normalizeSqliteStatus(normalizedEntry.status)
	}).onConflict((conflict) => conflict.column("session_key").doUpdateSet({
		session_id: normalizedEntry.sessionId,
		entry_json: JSON.stringify(normalizedEntry),
		updated_at: updatedAt,
		status: normalizeSqliteStatus(normalizedEntry.status)
	})));
}
/** Resolves the parent fork decision using SQLite transcript rows when totals are stale. */
//#endregion
//#region src/config/sessions/targets.ts
const NON_FATAL_DISCOVERY_ERROR_CODES = /* @__PURE__ */ new Set([
	"EACCES",
	"ELOOP",
	"ENOENT",
	"ENOTDIR",
	"EPERM",
	"ESTALE"
]);
function dedupeTargetsByStorePath(targets) {
	const deduped = /* @__PURE__ */ new Map();
	for (const target of targets) if (!deduped.has(target.storePath)) deduped.set(target.storePath, target);
	return [...deduped.values()];
}
function dedupeTargetsBySqliteTarget(targets) {
	const deduped = /* @__PURE__ */ new Map();
	for (const target of targets) {
		const sqlitePath = resolveSqliteTargetFromSessionStorePath(target.storePath, { agentId: target.agentId }).path ?? target.storePath;
		if (!deduped.has(sqlitePath)) deduped.set(sqlitePath, target);
	}
	return [...deduped.values()];
}
function shouldSkipDiscoveryError(err) {
	const code = err?.code;
	return typeof code === "string" && NON_FATAL_DISCOVERY_ERROR_CODES.has(code);
}
function legacySessionStoreHasAgentKey(storePath, agentId) {
	try {
		const parsed = JSON.parse(fs.readFileSync(storePath, "utf8"));
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return false;
		return Object.keys(parsed).some((sessionKey) => {
			const owner = parseAgentSessionKey(sessionKey)?.agentId;
			return owner !== void 0 && normalizeAgentId(owner) === agentId;
		});
	} catch {
		return false;
	}
}
function isWithinRoot(realPath, realRoot) {
	return realPath === realRoot || realPath.startsWith(`${realRoot}${path.sep}`);
}
function shouldSkipDiscoveredAgentDirName(dirName, agentId) {
	return agentId === "main" && normalizeLowercaseStringOrEmpty(dirName) !== "main";
}
function resolveValidatedManagedFilePathSync(params) {
	try {
		const stat = fs.lstatSync(params.filePath);
		if (stat.isSymbolicLink() || !stat.isFile()) return;
		return isWithinRoot(fs.realpathSync.native(params.filePath), params.realAgentsRoot ?? fs.realpathSync.native(params.agentsRoot)) ? params.filePath : void 0;
	} catch (err) {
		if (shouldSkipDiscoveryError(err)) return;
		throw err;
	}
}
/** Lists agent ids whose session stores should be considered configured. */
function listConfiguredSessionStoreAgentIds(cfg) {
	const ids = new Set(listAgentIds(cfg).map((agentId) => normalizeAgentId(agentId)));
	const addAcpAgentId = (agentId) => {
		const raw = agentId?.trim() ?? "";
		if (!raw || raw === "*") return;
		const normalized = normalizeAgentId(raw);
		ids.add(normalized);
	};
	addAcpAgentId(cfg.acp?.defaultAgent);
	for (const agentId of cfg.acp?.allowedAgents ?? []) addAcpAgentId(agentId);
	const configuredAgents = Array.isArray(cfg.agents?.list) ? cfg.agents.list : [];
	for (const agent of configuredAgents) if (agent.runtime?.type === "acp") addAcpAgentId(agent.runtime.acp?.agent ?? agent.id);
	return [...ids];
}
/** Checks whether an agent is configured to own a session store. */
function isConfiguredSessionStoreAgentId(cfg, agentId) {
	const normalizedAgentId = normalizeAgentId(agentId);
	return listConfiguredSessionStoreAgentIds(cfg).includes(normalizedAgentId);
}
/** Whether session.store resolves to a distinct store for each agent. */
function isPerAgentSessionStoreConfig(storeConfig) {
	const normalized = storeConfig?.trim();
	return !normalized || normalized.includes("{agentId}");
}
function resolveValidatedDiscoveredStorePathSync(params) {
	const storePath = path.join(params.sessionsDir, "sessions.json");
	const validatedStorePath = resolveValidatedManagedFilePathSync({
		agentsRoot: params.agentsRoot,
		filePath: storePath,
		realAgentsRoot: params.realAgentsRoot
	});
	if (validatedStorePath) return validatedStorePath;
	const sqlitePath = resolveSqliteTargetFromSessionStorePath(storePath).path;
	if (!sqlitePath) return;
	return resolveValidatedManagedFilePathSync({
		agentsRoot: params.agentsRoot,
		filePath: sqlitePath,
		realAgentsRoot: params.realAgentsRoot
	}) ? storePath : void 0;
}
function resolveValidatedExistingSessionStoreTargetSync(target) {
	const agentsRoot = resolveAgentsDirFromSessionStorePath(target.storePath);
	if (!agentsRoot) {
		const sqlitePath = resolveSqliteTargetFromSessionStorePath(target.storePath, { agentId: target.agentId }).path;
		return fs.existsSync(target.storePath) || Boolean(sqlitePath && fs.existsSync(sqlitePath)) ? target : void 0;
	}
	const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
		sessionsDir: path.dirname(target.storePath),
		agentsRoot
	});
	return validatedStorePath ? {
		...target,
		storePath: validatedStorePath
	} : void 0;
}
function isValidatedRecoveryCandidateSessionsDir(params) {
	const agentDir = path.dirname(params.sessionsDir);
	try {
		const agentStat = fs.lstatSync(agentDir);
		if (agentStat.isSymbolicLink() || !agentStat.isDirectory()) return false;
		if (!isWithinRoot(fs.realpathSync.native(agentDir), params.realAgentsRoot)) return false;
		try {
			const sessionsStat = fs.lstatSync(params.sessionsDir);
			return !sessionsStat.isSymbolicLink() && sessionsStat.isDirectory() && isWithinRoot(fs.realpathSync.native(params.sessionsDir), params.realAgentsRoot);
		} catch (err) {
			return err.code === "ENOENT";
		}
	} catch (err) {
		if (err.code === "ENOENT") return params.allowMissingAgentDir === true;
		if (shouldSkipDiscoveryError(err)) return false;
		throw err;
	}
}
function resolveSessionStoreDiscoveryState(cfg, env) {
	const configuredTargets = resolveSessionStoreTargets(cfg, { allAgents: true }, { env });
	const agentsRoots = /* @__PURE__ */ new Set();
	for (const target of configuredTargets) {
		const agentsDir = resolveAgentsDirFromSessionStorePath(target.storePath);
		if (agentsDir) agentsRoots.add(agentsDir);
	}
	agentsRoots.add(path.join(resolveStateDir(env), "agents"));
	return {
		configuredTargets,
		agentsRoots: [...agentsRoots]
	};
}
function toDiscoveredSessionStoreTarget(sessionsDir, storePath) {
	const dirName = path.basename(path.dirname(sessionsDir));
	const agentId = normalizeAgentId(dirName);
	if (shouldSkipDiscoveredAgentDirName(dirName, agentId)) return;
	return {
		agentId,
		storePath
	};
}
function resolveExplicitSessionStoreTarget(params) {
	const storePath = resolveStorePath(params.store, {
		agentId: params.defaultAgentId,
		env: params.env
	});
	return (resolveAgentsDirFromSessionStorePath(storePath) ? toDiscoveredSessionStoreTarget(path.dirname(storePath), storePath) : void 0) ?? {
		agentId: params.defaultAgentId,
		storePath
	};
}
/** Resolves all configured and discoverable agent session stores synchronously. */
function resolveAllAgentSessionStoreTargetsSync(cfg, params = {}) {
	const { configuredTargets, agentsRoots } = resolveSessionStoreDiscoveryState(cfg, params.env ?? process.env);
	const realAgentsRoots = /* @__PURE__ */ new Map();
	const getRealAgentsRoot = (agentsRoot) => {
		const cached = realAgentsRoots.get(agentsRoot);
		if (cached !== void 0) return cached;
		try {
			const realAgentsRoot = fs.realpathSync.native(agentsRoot);
			realAgentsRoots.set(agentsRoot, realAgentsRoot);
			return realAgentsRoot;
		} catch (err) {
			if (shouldSkipDiscoveryError(err)) return;
			throw err;
		}
	};
	const validatedConfiguredTargets = configuredTargets.flatMap((target) => {
		const agentsRoot = resolveAgentsDirFromSessionStorePath(target.storePath);
		if (!agentsRoot) return [target];
		const realAgentsRoot = getRealAgentsRoot(agentsRoot);
		if (!realAgentsRoot) return [];
		const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
			sessionsDir: path.dirname(target.storePath),
			agentsRoot,
			realAgentsRoot
		});
		return validatedStorePath ? [{
			...target,
			storePath: validatedStorePath
		}] : [];
	});
	const discoveredTargets = agentsRoots.flatMap((agentsDir) => {
		try {
			const realAgentsRoot = getRealAgentsRoot(agentsDir);
			if (!realAgentsRoot) return [];
			return resolveAgentSessionDirsFromAgentsDirSync(agentsDir).flatMap((sessionsDir) => {
				const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
					sessionsDir,
					agentsRoot: agentsDir,
					realAgentsRoot
				});
				const target = validatedStorePath ? toDiscoveredSessionStoreTarget(sessionsDir, validatedStorePath) : void 0;
				return target ? [target] : [];
			});
		} catch (err) {
			if (shouldSkipDiscoveryError(err)) return [];
			throw err;
		}
	});
	return dedupeTargetsBySqliteTarget([...validatedConfiguredTargets, ...discoveredTargets]);
}
/** Resolves only already-existing stores for one configured, retired, or manual agent. */
function resolveExistingAgentSessionStoreTargetsSync(cfg, agentId, params = {}) {
	const env = params.env ?? process.env;
	const requested = normalizeAgentId(agentId);
	const storeConfig = cfg.session?.store;
	if (!isPerAgentSessionStoreConfig(storeConfig)) {
		const fixedTarget = {
			agentId: requested,
			storePath: resolveStorePath(storeConfig, {
				agentId: requested,
				env
			})
		};
		const sqlitePath = resolveSqliteTargetFromSessionStorePath(fixedTarget.storePath, { agentId: requested }).path;
		if (sqlitePath && fs.existsSync(sqlitePath)) try {
			const result = withOpenClawAgentDatabaseReadOnly((database) => readSqliteSessionEntryKeys(database).some((sessionKey) => {
				const parsed = parseAgentSessionKey(sessionKey);
				return !parsed || normalizeAgentId(parsed.agentId) === requested;
			}), {
				agentId: requested,
				env,
				path: sqlitePath
			});
			return result.found && result.value ? [fixedTarget] : [];
		} catch {
			return [];
		}
		return legacySessionStoreHasAgentKey(fixedTarget.storePath, requested) ? [fixedTarget] : [];
	}
	const requestedTarget = {
		agentId: requested,
		storePath: resolveStorePath(storeConfig, {
			agentId: requested,
			env
		})
	};
	const discoveredTargets = resolveAllAgentSessionStoreTargetsSync(cfg, { env }).filter((target) => normalizeAgentId(target.agentId) === requested);
	const validatedRequestedTarget = resolveValidatedExistingSessionStoreTargetSync(requestedTarget);
	return dedupeTargetsBySqliteTarget([...validatedRequestedTarget ? [validatedRequestedTarget] : [], ...discoveredTargets]);
}
/**
* Resolves recovery candidates without requiring either the legacy store or SQLite file.
* Callers must validate the selected artifact before performing filesystem mutations.
*/
function resolveAllAgentSessionStoreCandidateTargetsSync(cfg, params = {}) {
	const { configuredTargets, agentsRoots } = resolveSessionStoreDiscoveryState(cfg, params.env ?? process.env);
	const realAgentsRoots = /* @__PURE__ */ new Map();
	const getRealAgentsRoot = (agentsRoot) => {
		if (realAgentsRoots.has(agentsRoot)) return realAgentsRoots.get(agentsRoot);
		try {
			const realAgentsRoot = fs.realpathSync.native(agentsRoot);
			realAgentsRoots.set(agentsRoot, realAgentsRoot);
			return realAgentsRoot;
		} catch (err) {
			if (shouldSkipDiscoveryError(err)) {
				realAgentsRoots.set(agentsRoot, void 0);
				return;
			}
			throw err;
		}
	};
	const validatedConfiguredTargets = configuredTargets.flatMap((target) => {
		const agentsRoot = resolveAgentsDirFromSessionStorePath(target.storePath);
		if (!agentsRoot) return [target];
		if (!fs.existsSync(agentsRoot)) return [target];
		const realAgentsRoot = getRealAgentsRoot(agentsRoot);
		return realAgentsRoot && isValidatedRecoveryCandidateSessionsDir({
			allowMissingAgentDir: true,
			realAgentsRoot,
			sessionsDir: path.dirname(target.storePath)
		}) ? [target] : [];
	});
	const discoveredTargets = agentsRoots.flatMap((agentsDir) => {
		try {
			const realAgentsRoot = getRealAgentsRoot(agentsDir);
			if (!realAgentsRoot) return [];
			return resolveAgentSessionDirsFromAgentsDirSync(agentsDir).flatMap((sessionsDir) => {
				if (!isValidatedRecoveryCandidateSessionsDir({
					realAgentsRoot,
					sessionsDir
				})) return [];
				const target = toDiscoveredSessionStoreTarget(sessionsDir, path.join(sessionsDir, "sessions.json"));
				return target ? [target] : [];
			});
		} catch (err) {
			if (shouldSkipDiscoveryError(err)) return [];
			throw err;
		}
	});
	return dedupeTargetsBySqliteTarget([...validatedConfiguredTargets, ...discoveredTargets]);
}
/** Resolves session store targets for one agent, including retired/manual stores. */
function resolveAgentSessionStoreTargetsSync(cfg, agentId, params = {}) {
	const env = params.env ?? process.env;
	const requested = normalizeAgentId(agentId);
	const storePaths = /* @__PURE__ */ new Set([resolveStorePath(cfg.session?.store, {
		agentId: requested,
		env
	}), resolveStorePath(void 0, {
		agentId: requested,
		env
	})]);
	const targets = [];
	const realAgentsRoots = /* @__PURE__ */ new Map();
	const getRealAgentsRoot = (agentsRoot) => {
		if (realAgentsRoots.has(agentsRoot)) return realAgentsRoots.get(agentsRoot);
		try {
			const realAgentsRoot = fs.realpathSync.native(agentsRoot);
			realAgentsRoots.set(agentsRoot, realAgentsRoot);
			return realAgentsRoot;
		} catch (err) {
			if (shouldSkipDiscoveryError(err)) {
				realAgentsRoots.set(agentsRoot, void 0);
				return;
			}
			throw err;
		}
	};
	for (const storePath of storePaths) {
		const agentsRoot = resolveAgentsDirFromSessionStorePath(storePath);
		if (!agentsRoot) {
			targets.push({
				agentId: requested,
				storePath
			});
			continue;
		}
		const realAgentsRoot = getRealAgentsRoot(agentsRoot);
		if (!realAgentsRoot) continue;
		const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
			sessionsDir: path.dirname(storePath),
			agentsRoot,
			realAgentsRoot
		});
		if (validatedStorePath) targets.push({
			agentId: requested,
			storePath: validatedStorePath
		});
	}
	const { agentsRoots } = resolveSessionStoreDiscoveryState(cfg, env);
	for (const agentsDir of agentsRoots) try {
		const realAgentsRoot = getRealAgentsRoot(agentsDir);
		if (!realAgentsRoot) continue;
		for (const sessionsDir of resolveAgentSessionDirsFromAgentsDirSync(agentsDir)) {
			const target = toDiscoveredSessionStoreTarget(sessionsDir, path.join(sessionsDir, "sessions.json"));
			if (!target || normalizeAgentId(target.agentId) !== requested) continue;
			const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
				sessionsDir,
				agentsRoot: agentsDir,
				realAgentsRoot
			});
			if (validatedStorePath) targets.push({
				...target,
				storePath: validatedStorePath
			});
		}
	} catch (err) {
		if (shouldSkipDiscoveryError(err)) continue;
		throw err;
	}
	return dedupeTargetsByStorePath(targets);
}
/** Resolves session store targets from explicit CLI-style selection options. */
function resolveSessionStoreTargets(cfg, opts, params = {}) {
	const env = params.env ?? process.env;
	const defaultAgentId = resolveDefaultAgentId(cfg);
	const hasAgent = Boolean(opts.agent?.trim());
	const allAgents = opts.allAgents === true;
	if (hasAgent && allAgents) throw new Error("--agent and --all-agents cannot be used together");
	if (opts.store && (hasAgent || allAgents)) throw new Error("--store cannot be combined with --agent or --all-agents");
	if (opts.store) return [resolveExplicitSessionStoreTarget({
		defaultAgentId,
		env,
		store: opts.store
	})];
	if (allAgents) return dedupeTargetsBySqliteTarget(listConfiguredSessionStoreAgentIds(cfg).map((agentId) => ({
		agentId,
		storePath: resolveStorePath(cfg.session?.store, {
			agentId,
			env
		})
	})));
	if (hasAgent) {
		const knownAgents = listAgentIds(cfg);
		const requested = normalizeAgentId(opts.agent ?? "");
		if (!knownAgents.includes(requested)) throw new Error(`Unknown agent id "${opts.agent}". Use "openclaw agents list" to see configured agents.`);
		return [{
			agentId: requested,
			storePath: resolveStorePath(cfg.session?.store, {
				agentId: requested,
				env
			})
		}];
	}
	return [{
		agentId: defaultAgentId,
		storePath: resolveStorePath(cfg.session?.store, {
			agentId: defaultAgentId,
			env
		})
	}];
}
//#endregion
export { ensureTranscriptGenerationInTransaction as A, upsertConversationIdentity as B, readSqliteSessionEntryStore as C, writeSessionEntry as D, sqliteSessionEntriesEqual as E, touchTranscriptMutationInTransaction as F, deriveSessionOrigin as G, conversationIdentityFromMsgContext as H, parseSqliteSessionEntryJson as I, snapshotSessionOrigin as K, readSqliteSessionEntriesByStatus as L, readNextTranscriptSeq as M, readTranscriptGenerationInTransaction as N, advanceTranscriptMutationAtInTransaction as O, rotateTranscriptGenerationInTransaction as P, createFallbackSessionEntry as R, readSqliteSessionEntrySelectionSnapshot as S, resolveSqliteLifecyclePrimaryEntry as T, deriveLastRoutePatch as U, buildConversationIdentity as V, deriveSessionMetaPatch as W, normalizeSqliteLifecycleTarget as _, resolveAllAgentSessionStoreCandidateTargetsSync as a, readSqliteLifecycleTargetSnapshot as b, resolveSessionStoreTargets as c, assertSqliteSessionEntrySelectionUnchanged as d, collectSessionEntryLookupKeys as f, deleteSqliteSessionEntryRows as g, deleteSqliteLifecycleTargetRows as h, resolveAgentSessionStoreTargetsSync as i, ensureTranscriptSessionRoot as j, deleteSqliteTranscriptEventsInTransaction as k, assertSqliteLifecycleTargetSnapshotUnchanged as l, deleteLegacySessionEntryRows as m, isPerAgentSessionStoreConfig as n, resolveAllAgentSessionStoreTargetsSync as o, createSqliteSessionIdentitySnapshot as p, listConfiguredSessionStoreAgentIds as r, resolveExistingAgentSessionStoreTargetsSync as s, isConfiguredSessionStoreAgentId as t, assertSqliteLifecycleTargetUnchanged as u, readExactSessionEntryRow as v, readSqliteSessionIdentitySnapshot as w, readSqliteSessionEntryCount as x, readSessionEntryRow as y, normalizeSqliteNumber as z };
