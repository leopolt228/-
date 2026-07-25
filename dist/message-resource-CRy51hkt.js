import { r as runCommandWithTimeout } from "./exec-Cb0CNQNz.js";
import { i as createActionGate } from "./common-C39GdgQ7.js";
import "./process-runtime-rVoFPrSl.js";
import "./channel-actions-CkrqGkMr.js";
import { n as resolveLocalIMessageChatDbPath } from "./cli-path-DLthOk6m.js";
import { f as chatContextFromIMessageTarget, l as resolveIMessageCachedResourceBinding, p as isIMessageEmailChatIdentifier, u as resolveIMessageMessageId } from "./monitor-reply-cache-D1matHtv.js";
import { createRequire } from "node:module";
//#region extensions/imessage/src/cli-output.ts
const IMESSAGE_CLI_STDOUT_MAX_BYTES = 8 * 1024 * 1024;
const IMESSAGE_CLI_STDERR_TAIL_BYTES = 64 * 1024;
function parseLastJsonObject(stdout) {
	const last = stdout.split(/\r?\n/u).findLast((line) => line.trim().length > 0)?.trim();
	if (!last) return null;
	try {
		const value = JSON.parse(last);
		return value && typeof value === "object" && !Array.isArray(value) ? value : null;
	} catch {
		return null;
	}
}
async function runIMessageCliJsonCommand(params) {
	const dbPath = params.dbPath?.trim();
	const result = await runCommandWithTimeout([
		params.cliPath,
		...params.args,
		...dbPath ? ["--db", dbPath] : [],
		"--json"
	], {
		killProcessTree: true,
		maxOutputBytes: {
			stdout: IMESSAGE_CLI_STDOUT_MAX_BYTES,
			stderr: IMESSAGE_CLI_STDERR_TAIL_BYTES
		},
		outputCapture: {
			stdout: "head",
			stderr: "tail"
		},
		terminateOnOutputLimit: { stdout: true },
		timeoutMs: params.timeoutMs
	});
	if (result.termination === "timeout") throw new Error(`iMessage action timed out after ${params.timeoutMs}ms`);
	if (result.outputLimitExceeded || result.stdoutTruncatedBytes) throw new Error(`imsg stdout exceeded ${IMESSAGE_CLI_STDOUT_MAX_BYTES} bytes`);
	const parsed = parseLastJsonObject(result.stdout);
	if (result.code !== 0) {
		const detail = typeof parsed?.error === "string" && parsed.error.trim() || result.stderr.trim() || result.stdout.trim() || `imsg exited with code ${result.code}`;
		throw new Error(detail);
	}
	if (!parsed) throw new Error(`imsg returned non-JSON output: ${result.stdout.trim() || result.stderr.trim()}`);
	if (parsed.success === false) {
		const detail = typeof parsed.error === "string" && parsed.error.trim() ? parsed.error.trim() : "iMessage action failed";
		throw new Error(detail);
	}
	return parsed;
}
//#endregion
//#region extensions/imessage/src/markdown-format.ts
const MARKERS = [
	{
		marker: "***",
		styles: ["bold", "italic"],
		requireWordBoundary: false
	},
	{
		marker: "___",
		styles: ["underline", "italic"],
		requireWordBoundary: true
	},
	{
		marker: "~~",
		styles: ["strikethrough"],
		requireWordBoundary: false
	},
	{
		marker: "**",
		styles: ["bold"],
		requireWordBoundary: false
	},
	{
		marker: "__",
		styles: ["underline"],
		requireWordBoundary: true
	},
	{
		marker: "*",
		styles: ["italic"],
		requireWordBoundary: false
	},
	{
		marker: "_",
		styles: ["italic"],
		requireWordBoundary: true
	}
];
function tryConsumeMarker(input, i, m) {
	if (!input.startsWith(m.marker, i)) return null;
	if (m.marker.length === 1 && input[i + 1] === m.marker) return null;
	if (m.marker.length === 2 && input[i + 2] === m.marker[0]) return null;
	const isAtBoundary = (ch) => ch === void 0 || /\s/.test(ch);
	if (m.requireWordBoundary && i > 0 && !isAtBoundary(input[i - 1])) return null;
	const startInner = i + m.marker.length;
	const close = input.indexOf(m.marker, startInner);
	if (close === -1 || close === startInner) return null;
	if (m.requireWordBoundary && !isAtBoundary(input[close + m.marker.length])) return null;
	const inner = input.slice(startInner, close);
	if (!inner.trim()) return null;
	return {
		close,
		inner
	};
}
function parseInternal(input, baseOffset, sink) {
	let out = "";
	let i = 0;
	while (i < input.length) {
		let consumed = false;
		for (const m of MARKERS) {
			const hit = tryConsumeMarker(input, i, m);
			if (!hit) continue;
			const innerOffset = baseOffset + out.length;
			const innerStripped = parseInternal(hit.inner, innerOffset, sink);
			for (const style of m.styles) sink.push({
				start: innerOffset,
				length: innerStripped.length,
				styles: [style]
			});
			out += innerStripped;
			i = hit.close + m.marker.length;
			consumed = true;
			break;
		}
		if (!consumed) {
			out += input[i];
			i += 1;
		}
	}
	return out;
}
function extractMarkdownFormatRuns(input) {
	const ranges = [];
	return {
		text: parseInternal(input, 0, ranges),
		ranges
	};
}
//#endregion
//#region extensions/imessage/src/message-resource-db.ts
const require = createRequire(import.meta.url);
function normalizeIMessageMessageGuidForLookup(messageId) {
	const trimmed = messageId.trim();
	const slash = trimmed.lastIndexOf("/");
	return slash >= 0 && slash + 1 < trimmed.length ? trimmed.slice(slash + 1) : trimmed;
}
function chatGuidCandidates(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return [];
	const ordered = [trimmed];
	const parts = trimmed.split(";");
	const service = parts[0]?.toLowerCase();
	const kind = parts[1];
	const identifier = parts[2];
	if (parts.length === 3 && (kind === "+" || kind === "-") && identifier) {
		if (service === "any") ordered.push(`iMessage;${kind};${identifier}`, `SMS;${kind};${identifier}`);
		else if (service === "imessage") ordered.push(`iMessage;${kind};${identifier}`, `any;${kind};${identifier}`);
		else if (service === "sms") ordered.push(`SMS;${kind};${identifier}`, `any;${kind};${identifier}`);
	}
	return [...new Set(ordered)];
}
function chatIdentifierCandidates(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return [];
	const parts = trimmed.split(";");
	const service = parts[0]?.toLowerCase();
	const hasKnownPrefix = service === "imessage" || service === "sms" || service === "any";
	const hasKnownKind = parts[1] === "+" || parts[1] === "-";
	const bareIdentifier = parts.length === 3 && hasKnownPrefix && hasKnownKind ? parts[2] : void 0;
	return [.../* @__PURE__ */ new Set([trimmed, ...bareIdentifier ? [bareIdentifier] : []])];
}
function isKnownChatGuid(raw) {
	const parts = raw?.trim().split(";");
	if (!parts || parts.length !== 3 || parts[1] !== "+" && parts[1] !== "-" || !parts[2]) return false;
	const service = parts[0]?.toLowerCase();
	return service === "imessage" || service === "sms" || service === "any";
}
function matchesChatCandidate(stored, candidate) {
	if (stored === candidate) return true;
	return isIMessageEmailChatIdentifier(stored) && isIMessageEmailChatIdentifier(candidate) && stored.toLowerCase() === candidate.toLowerCase();
}
function matchesAnyChatCandidate(stored, candidates) {
	if (typeof stored !== "string") return false;
	return candidates.some((candidate) => matchesChatCandidate(stored, candidate));
}
function loadNodeSqlite() {
	try {
		return require("node:sqlite");
	} catch {
		return null;
	}
}
function checkIMessageResourceBinding(params) {
	const dbPath = resolveLocalIMessageChatDbPath(params);
	const sqlite = loadNodeSqlite();
	if (!dbPath || !sqlite) return "unavailable";
	const messageGuid = normalizeIMessageMessageGuidForLookup(params.messageId);
	if (!messageGuid) return "mismatch";
	const expectedChatGuids = chatGuidCandidates(params.chatContext.chatGuid);
	const expectedChatIdentifiers = chatIdentifierCandidates(params.chatContext.chatIdentifier);
	const identifierChatGuids = isKnownChatGuid(params.chatContext.chatIdentifier) ? chatGuidCandidates(params.chatContext.chatIdentifier) : [];
	const chatId = params.chatContext.chatId;
	const hasChatId = typeof chatId === "number" && Number.isSafeInteger(chatId) && chatId > 0;
	if (!hasChatId && expectedChatGuids.length === 0 && expectedChatIdentifiers.length === 0 && identifierChatGuids.length === 0) return "unavailable";
	let db;
	try {
		db = new sqlite.DatabaseSync(dbPath, { readOnly: true });
		return db.prepare(`SELECT cmj.chat_id AS chatId,
                c.guid AS chatGuid,
                c.chat_identifier AS chatIdentifier
         FROM message m
         JOIN chat_message_join cmj ON cmj.message_id = m.ROWID
         JOIN chat c ON c.ROWID = cmj.chat_id
         WHERE m.guid = ?`).all(messageGuid).some((row) => (!hasChatId || row.chatId === chatId) && (expectedChatGuids.length === 0 || matchesAnyChatCandidate(row.chatGuid, expectedChatGuids)) && (expectedChatIdentifiers.length === 0 || matchesAnyChatCandidate(row.chatIdentifier, expectedChatIdentifiers)) && (identifierChatGuids.length === 0 || matchesAnyChatCandidate(row.chatGuid, identifierChatGuids))) ? "match" : "mismatch";
	} catch {
		return "unavailable";
	} finally {
		try {
			db?.close();
		} catch {}
	}
}
//#endregion
//#region extensions/imessage/src/message-resource.ts
const MAX_REPLY_TO_ID_LENGTH = 256;
function sanitizeReplyToId(rawReplyToId) {
	const trimmed = rawReplyToId?.trim();
	if (!trimmed) return;
	let sanitized = "";
	for (const ch of trimmed) {
		const code = ch.charCodeAt(0);
		if (code >= 0 && code <= 31 || code === 127 || ch === "[" || ch === "]") continue;
		sanitized += ch;
	}
	return sanitized.trim().slice(0, MAX_REPLY_TO_ID_LENGTH) || void 0;
}
function resolveAuthorizedIMessageReplyReference(params) {
	if (!createActionGate(params.account.config.actions)("reply")) return;
	const rawReplyToId = sanitizeReplyToId(params.replyToId);
	if (!rawReplyToId) return;
	const chatContext = chatContextFromIMessageTarget(params.target, params.service);
	const messageId = resolveIMessageMessageId(rawReplyToId, {
		requireKnownShortId: true,
		chatContext
	});
	authorizeIMessageResourceReference({
		accountId: params.account.accountId,
		chatContext,
		cliPath: params.cliPath,
		dbPath: params.dbPath,
		hasExclusiveLocalDatabase: params.hasExclusiveLocalDatabase,
		remoteHost: params.account.config.remoteHost,
		messageId,
		conversationReadOrigin: params.conversationReadOrigin
	});
	return messageId;
}
function authorizeIMessageResourceReference(params) {
	const cacheContext = {
		...params.chatContext,
		accountId: params.accountId
	};
	let cacheBinding = resolveIMessageCachedResourceBinding(params.messageId, cacheContext);
	const normalizedMessageId = normalizeIMessageMessageGuidForLookup(params.messageId);
	if (cacheBinding === "unknown" && normalizedMessageId !== params.messageId.trim()) cacheBinding = resolveIMessageCachedResourceBinding(normalizedMessageId, cacheContext);
	if (cacheBinding === "match") return;
	if (cacheBinding === "mismatch") throw new Error("iMessage message reference belongs to a different account or conversation.");
	const providerBinding = params.hasExclusiveLocalDatabase ? checkIMessageResourceBinding(params) : "unavailable";
	if (providerBinding === "match") return;
	if (providerBinding === "mismatch") throw new Error("iMessage message reference does not belong to the selected conversation.");
	if (params.conversationReadOrigin === "direct-operator") return;
	throw new Error("Delegated iMessage message references require a current same-account conversation binding when the Messages database is unavailable.");
}
//#endregion
export { runIMessageCliJsonCommand as i, resolveAuthorizedIMessageReplyReference as n, extractMarkdownFormatRuns as r, authorizeIMessageResourceReference as t };
