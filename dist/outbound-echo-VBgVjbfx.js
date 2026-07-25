import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { C as resolveExpiresAtMsFromDurationMs, m as isFutureDateTimestampMs } from "./number-coercion-Crk_c9KW.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
//#region src/channels/message/outbound-echo-state.ts
const OUTBOUND_MESSAGE_IDENTITIES_KEY = Symbol.for("openclaw.outboundMessageIdentities");
function resolveState() {
	const globalStore = globalThis;
	const existing = globalStore[OUTBOUND_MESSAGE_IDENTITIES_KEY];
	if (existing instanceof Map) return existing;
	const created = /* @__PURE__ */ new Map();
	globalStore[OUTBOUND_MESSAGE_IDENTITIES_KEY] = created;
	return created;
}
const outboundMessageIdentities = resolveState();
//#endregion
//#region src/channels/message/outbound-echo.ts
const OUTBOUND_ECHO_WINDOW_MS = 3e4;
const OUTBOUND_MESSAGE_IDENTITY_MAX_ENTRIES = 1e4;
function resolveIdentityKeys(identity) {
	const channel = normalizeLowercaseStringOrEmpty(identity.channel);
	const conversationId = identity.conversationId.trim();
	if (!channel || !conversationId) return [];
	const scope = [
		channel,
		normalizeAccountId(identity.accountId),
		conversationId
	];
	const keys = [];
	const messageId = identity.messageId?.trim();
	if (messageId) keys.push(JSON.stringify([
		...scope,
		"message",
		messageId
	]));
	const sourceId = identity.sourceId?.trim();
	if (sourceId) keys.push(JSON.stringify([
		...scope,
		"source",
		sourceId
	]));
	return keys;
}
function pruneExpiredEntries(nowMs) {
	for (const [key, expiresAt] of outboundMessageIdentities) {
		if (isFutureDateTimestampMs(expiresAt, { nowMs })) return;
		outboundMessageIdentities.delete(key);
	}
}
/** Records a platform message id emitted by a channel's own outbound send path. */
function recordOutboundMessageIdentity(identity) {
	const keys = resolveIdentityKeys(identity);
	if (keys.length === 0) return;
	const nowMs = Date.now();
	const expiresAt = resolveExpiresAtMsFromDurationMs(OUTBOUND_ECHO_WINDOW_MS, { nowMs });
	if (expiresAt === void 0) {
		for (const key of keys) outboundMessageIdentities.delete(key);
		return;
	}
	pruneExpiredEntries(nowMs);
	for (const key of keys) {
		outboundMessageIdentities.delete(key);
		while (outboundMessageIdentities.size >= OUTBOUND_MESSAGE_IDENTITY_MAX_ENTRIES) {
			const oldest = outboundMessageIdentities.keys().next();
			if (oldest.done) break;
			outboundMessageIdentities.delete(oldest.value);
		}
		outboundMessageIdentities.set(key, expiresAt);
	}
}
/** Returns whether an inbound platform message matches a recently emitted outbound id. */
function isRecentOutboundMessageIdentity(identity) {
	for (const key of resolveIdentityKeys(identity)) {
		const expiresAt = outboundMessageIdentities.get(key);
		if (expiresAt === void 0) continue;
		if (!isFutureDateTimestampMs(expiresAt)) {
			outboundMessageIdentities.delete(key);
			continue;
		}
		return true;
	}
	return false;
}
//#endregion
export { recordOutboundMessageIdentity as n, isRecentOutboundMessageIdentity as t };
