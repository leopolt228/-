import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import "./error-runtime-DUxkdoW4.js";
import { c as runClaimableDedupeClaimLoop, t as createChannelReplayGuard } from "./persistent-dedupe-Ba4tBMMS.js";
import path from "node:path";
//#region extensions/telegram/src/message-dispatch-dedupe.ts
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS = 10080 * 60 * 1e3;
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE = "global";
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX = "telegram.message-dispatch-dedupe";
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID = "telegram-message-dispatch-dedupe";
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_MEMORY_MAX_ENTRIES = 5e4;
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES = 5e4;
var TelegramMessageDispatchReplayForgetError = class extends Error {
	constructor(failures) {
		const count = failures.length;
		super(`telegram message dispatch dedupe rollback failed for ${count} key(s)`, { cause: failures.find((failure) => failure.error !== void 0)?.error });
		this.name = "TelegramMessageDispatchReplayForgetError";
		this.failures = [...failures];
		this.cause = failures.find((failure) => failure.error !== void 0)?.error;
	}
};
function isTelegramMessageDispatchReplayForgetError(error) {
	return error instanceof TelegramMessageDispatchReplayForgetError;
}
function sanitizeFileSegment(value) {
	const trimmed = value.trim();
	if (!trimmed) return "default";
	return trimmed.replace(/[^a-zA-Z0-9_-]/g, "_");
}
function resolveTelegramMessageDispatchLegacyPath(params) {
	return path.join(path.dirname(params.storePath), `${path.basename(params.storePath)}.telegram-message-dispatch-${sanitizeFileSegment(params.namespace)}.json`);
}
function buildTelegramMessageDispatchReplayKey(msg) {
	const chatId = msg.chat?.id;
	const messageId = msg.message_id;
	if (chatId == null || typeof messageId !== "number" || messageId <= 0) return null;
	return JSON.stringify([
		"message",
		String(chatId),
		messageId
	]);
}
function buildTelegramMessageDispatchAccountReplayKey(params) {
	return JSON.stringify([
		"account",
		params.accountId,
		params.key
	]);
}
function buildTelegramMessageDispatchStoredReplayKey(params) {
	const key = buildTelegramMessageDispatchReplayKey(params.msg);
	return key ? buildTelegramMessageDispatchAccountReplayKey({
		accountId: params.accountId,
		key
	}) : null;
}
function createTelegramMessageDispatchReplayGuard(params = {}) {
	return createChannelReplayGuard({
		dedupe: {
			ttlMs: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS,
			memoryMaxSize: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_MEMORY_MAX_ENTRIES,
			pluginId: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID,
			namespacePrefix: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX,
			stateMaxEntries: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES,
			...params.onDiskError ? { onDiskError: params.onDiskError } : {}
		},
		buildReplayKey: (event) => "msg" in event ? buildTelegramMessageDispatchStoredReplayKey(event) : event.keys ?? [],
		namespace: () => TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE
	});
}
async function claimTelegramMessageDispatchReplay(params) {
	return await runClaimableDedupeClaimLoop(() => params.guard.claim({
		accountId: params.accountId,
		msg: params.msg
	}), (_error, rejectionCount) => rejectionCount <= 1);
}
async function commitTelegramMessageDispatchReplay(params) {
	const claims = [...new Set(params.claims ?? [])];
	const committedKeys = [];
	for (const [index, claim] of claims.entries()) {
		let diskError;
		try {
			const recorded = await claim.commit(params.requirePersistent === true ? { onDiskError: (error) => {
				diskError = error;
			} } : void 0);
			if (params.requirePersistent === true && diskError !== void 0) throw diskError instanceof Error ? diskError : new Error(formatErrorMessage(diskError), { cause: diskError });
			if (recorded) committedKeys.push(...claim.keys);
		} catch (error) {
			for (const pendingClaim of claims.slice(index + 1)) pendingClaim.release({ error });
			const failures = [];
			for (const committedKey of committedKeys) try {
				if (!await params.guard.forget({ keys: [committedKey] })) failures.push({ key: committedKey });
			} catch (rollbackError) {
				failures.push({
					key: committedKey,
					error: rollbackError
				});
			}
			let failedKeyCleanupError;
			try {
				await params.guard.forget({ keys: claim.keys }, { onDiskError: (rollbackError) => {
					failedKeyCleanupError = rollbackError;
				} });
			} catch (rollbackError) {
				failedKeyCleanupError = rollbackError;
			}
			if (failedKeyCleanupError !== void 0) failures.push(...claim.keys.map((key) => ({
				key,
				error: failedKeyCleanupError
			})));
			if (failures.length > 0) throw new TelegramMessageDispatchReplayForgetError(failures);
			throw error;
		}
	}
}
function releaseTelegramMessageDispatchReplay(params) {
	for (const claim of new Set(params.claims ?? [])) claim.release({ error: params.error });
}
//#endregion
export { TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS as a, commitTelegramMessageDispatchReplay as c, releaseTelegramMessageDispatchReplay as d, resolveTelegramMessageDispatchLegacyPath as f, TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID as i, createTelegramMessageDispatchReplayGuard as l, TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX as n, buildTelegramMessageDispatchAccountReplayKey as o, TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES as r, claimTelegramMessageDispatchReplay as s, TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE as t, isTelegramMessageDispatchReplayForgetError as u };
