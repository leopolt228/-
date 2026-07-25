import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { i as resolveAllowlistMatchByCandidates, t as compileAllowlist } from "./allowlist-match-Cg15MVcF.js";
import { t as ToolAuthorizationError } from "./common-C39GdgQ7.js";
import { i as resolveOpenProviderRuntimeGroupPolicy, r as resolveDefaultGroupPolicy } from "./runtime-group-policy-B5DjRp_T.js";
import { i as chunkMarkdownTextWithMode } from "./chunk-B-Yo_muw.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-C0uxiauk.js";
import { c as resolveMergedAccountConfig } from "./account-helpers-BAtt8fRD.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./reply-chunking-DDkaiQAg.js";
import "./runtime-group-policy-CXo40VxH.js";
import "./account-resolution-DWTS6EOM.js";
import "./allow-from-DBWoFP8H.js";
import "./channel-actions-CkrqGkMr.js";
import { o as defineStableChannelIngressIdentity, r as createChannelIngressResolver } from "./channel-ingress-runtime-xeTXZKGy.js";
import "./channel-outbound-D_Kkmr30.js";
import { f as resolveScopeToolsPolicy, u as resolveScopeKeyCaseInsensitive } from "./channel-policy-DtbLL_f5.js";
import { p as isRecord$1 } from "./accounts-CuzXFu13.js";
import { r as normalizeFeishuTarget, t as detectIdType } from "./targets-BLFgry8p.js";
import { a as markdownSpace, i as markdownLineEndingOrSpace, n as factorySpace, r as markdownLineEnding, t as fromMarkdown } from "./lib-vv6_0VBO.js";
//#region extensions/feishu/src/card-interaction.ts
const FEISHU_CARD_INTERACTION_VERSION = "ocf1";
function isInteractionKind(value) {
	return value === "button" || value === "quick" || value === "meta";
}
function isMetadataValue(value) {
	return value === null || value === void 0 || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function createFeishuCardInteractionEnvelope(envelope) {
	return {
		oc: FEISHU_CARD_INTERACTION_VERSION,
		...envelope
	};
}
function buildFeishuCardActionTextFallback(event) {
	const actionValue = event.action.value;
	if (isRecord$1(actionValue)) {
		if (typeof actionValue.text === "string") return actionValue.text;
		if (typeof actionValue.command === "string") return actionValue.command;
		return JSON.stringify(actionValue);
	}
	return String(actionValue);
}
function decodeFeishuCardAction(params) {
	const { event, now = Date.now() } = params;
	const actionValue = event.action.value;
	if (!isRecord$1(actionValue) || actionValue.oc !== "ocf1") return {
		kind: "legacy",
		text: buildFeishuCardActionTextFallback(event)
	};
	if (!isInteractionKind(actionValue.k) || typeof actionValue.a !== "string" || !actionValue.a) return {
		kind: "invalid",
		reason: "malformed"
	};
	if (actionValue.q !== void 0 && typeof actionValue.q !== "string") return {
		kind: "invalid",
		reason: "malformed"
	};
	if (actionValue.m !== void 0) {
		if (!isRecord$1(actionValue.m)) return {
			kind: "invalid",
			reason: "malformed"
		};
		for (const value of Object.values(actionValue.m)) if (!isMetadataValue(value)) return {
			kind: "invalid",
			reason: "malformed"
		};
	}
	if (actionValue.c !== void 0) {
		if (!isRecord$1(actionValue.c)) return {
			kind: "invalid",
			reason: "malformed"
		};
		if (actionValue.c.u !== void 0 && typeof actionValue.c.u !== "string") return {
			kind: "invalid",
			reason: "malformed"
		};
		if (actionValue.c.h !== void 0 && typeof actionValue.c.h !== "string") return {
			kind: "invalid",
			reason: "malformed"
		};
		if (actionValue.c.s !== void 0 && typeof actionValue.c.s !== "string") return {
			kind: "invalid",
			reason: "malformed"
		};
		if (actionValue.c.e !== void 0 && !Number.isFinite(actionValue.c.e)) return {
			kind: "invalid",
			reason: "malformed"
		};
		if (actionValue.c.t !== void 0 && actionValue.c.t !== "p2p" && actionValue.c.t !== "group") return {
			kind: "invalid",
			reason: "malformed"
		};
		if (typeof actionValue.c.e === "number" && actionValue.c.e < now) return {
			kind: "invalid",
			reason: "stale"
		};
		const expectedUser = actionValue.c.u?.trim();
		if (expectedUser && expectedUser !== (event.operator.open_id ?? "").trim()) return {
			kind: "invalid",
			reason: "wrong_user"
		};
		const expectedChat = actionValue.c.h?.trim();
		if (expectedChat && expectedChat !== (event.context.chat_id ?? "").trim()) return {
			kind: "invalid",
			reason: "wrong_conversation"
		};
	}
	return {
		kind: "structured",
		envelope: actionValue
	};
}
//#endregion
//#region extensions/feishu/src/chat-type.ts
function normalizeFeishuChatType(value) {
	if (value === "group" || value === "topic_group") return "group";
	if (value === "p2p") return "p2p";
}
function normalizeFeishuChatMode(value) {
	if (value === "group" || value === "topic" || value === "topic_group") return "group";
	return value === "p2p" ? "p2p" : void 0;
}
function resolveFeishuChatType(chat) {
	return normalizeFeishuChatMode(chat.chat_mode) ?? normalizeFeishuChatType(chat.chat_type);
}
//#endregion
//#region extensions/feishu/src/policy.ts
const FEISHU_PROVIDER_PREFIX_RE = /^(feishu|lark):/i;
const FEISHU_TYPED_PREFIX_RE = /^(chat|group|channel|user|dm|open_id):/i;
const FEISHU_ID_KIND = "plugin:feishu-id";
const feishuIngressIdentity = defineStableChannelIngressIdentity({
	key: "feishu-id",
	kind: FEISHU_ID_KIND,
	normalize: normalizeFeishuAllowEntry,
	sensitivity: "pii",
	aliases: [{
		key: "feishu-alt-id",
		kind: FEISHU_ID_KIND,
		normalizeEntry: () => null,
		normalizeSubject: normalizeFeishuAllowEntry,
		sensitivity: "pii"
	}],
	isWildcardEntry: (entry) => normalizeFeishuAllowEntry(entry) === "*",
	resolveEntryId: ({ entryIndex }) => `feishu-entry-${entryIndex + 1}`
});
function normalizeFeishuAllowEntry(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return "";
	if (trimmed === "*") return "*";
	let withoutProviderPrefix = trimmed;
	while (FEISHU_PROVIDER_PREFIX_RE.test(withoutProviderPrefix)) withoutProviderPrefix = withoutProviderPrefix.replace(FEISHU_PROVIDER_PREFIX_RE, "").trim();
	if (withoutProviderPrefix === "*") return "*";
	const lowered = normalizeOptionalLowercaseString(withoutProviderPrefix) ?? "";
	if (!lowered) return "";
	const prefixed = lowered.match(FEISHU_TYPED_PREFIX_RE);
	if (prefixed?.[1]) {
		const kind = [
			"chat",
			"group",
			"channel"
		].includes(prefixed[1]) ? "chat" : "user";
		const value = withoutProviderPrefix.slice(prefixed[0].length).trim();
		return value === "*" ? "*" : value ? `${kind}:${value}` : "";
	}
	const detectedType = detectIdType(withoutProviderPrefix);
	if (detectedType === "chat_id") return `chat:${withoutProviderPrefix}`;
	if (detectedType === "open_id" || detectedType === "user_id") return `user:${withoutProviderPrefix}`;
	return "";
}
function normalizeFeishuDmPolicy(policy) {
	return policy === "open" || policy === "pairing" || policy === "allowlist" || policy === "disabled" ? policy : "pairing";
}
function normalizeFeishuGroupPolicy(policy) {
	return policy === "allowall" ? "open" : policy;
}
function createFeishuIngressSubject(params) {
	const ids = [params.primaryId, ...params.alternateIds ?? []].map((value) => value?.trim()).filter((value) => Boolean(value));
	return {
		stableId: ids[0],
		aliases: { "feishu-alt-id": ids[1] }
	};
}
function createFeishuIngressResolver(params) {
	return createChannelIngressResolver({
		channelId: "feishu",
		accountId: normalizeAccountId(params.accountId) ?? "default",
		identity: feishuIngressIdentity,
		cfg: params.cfg,
		...params.readAllowFromStore ? { readStoreAllowFrom: params.readAllowFromStore } : {}
	});
}
async function resolveFeishuDmIngressAccess(params) {
	return await createFeishuIngressResolver({
		cfg: params.cfg,
		accountId: params.accountId,
		readAllowFromStore: params.readAllowFromStore
	}).message({
		subject: createFeishuIngressSubject({
			primaryId: params.senderOpenId,
			alternateIds: [params.senderUserId]
		}),
		conversation: {
			kind: "direct",
			id: params.conversationId
		},
		event: { mayPair: params.mayPair },
		dmPolicy: normalizeFeishuDmPolicy(params.dmPolicy),
		groupPolicy: "disabled",
		allowFrom: params.allowFrom ?? [],
		...params.command ? { command: params.command } : {}
	});
}
async function resolveFeishuGroupConversationIngressAccess(params) {
	const groupPolicy = normalizeFeishuGroupPolicy(params.groupPolicy);
	const groupAllowFrom = groupPolicy === "allowlist" && params.groupExplicitlyConfigured ? [...params.groupAllowFrom ?? [], params.chatId] : params.groupAllowFrom ?? [];
	return await createFeishuIngressResolver({
		cfg: params.cfg,
		accountId: params.accountId
	}).message({
		subject: createFeishuIngressSubject({ primaryId: params.chatId }),
		conversation: {
			kind: "group",
			id: params.chatId
		},
		dmPolicy: "disabled",
		groupPolicy,
		groupAllowFrom
	});
}
async function resolveFeishuGroupSenderActivationIngressAccess(params) {
	const groupAllowFrom = params.allowFrom ?? [];
	return await createFeishuIngressResolver({
		cfg: params.cfg,
		accountId: params.accountId
	}).message({
		subject: createFeishuIngressSubject({
			primaryId: params.senderOpenId,
			alternateIds: [params.senderUserId]
		}),
		conversation: {
			kind: "group",
			id: params.chatId
		},
		dmPolicy: "disabled",
		groupPolicy: groupAllowFrom.length > 0 ? "allowlist" : "open",
		groupAllowFrom,
		mentionFacts: {
			canDetectMention: true,
			wasMentioned: params.mentionedBot
		},
		policy: { activation: {
			requireMention: params.requireMention,
			allowTextCommands: false
		} },
		...params.command ? { command: params.command } : {}
	});
}
function resolveFeishuGroupConfig(params) {
	const groups = params.cfg?.groups ?? {};
	const wildcard = groups["*"];
	const groupId = params.groupId?.trim();
	if (!groupId) return;
	const direct = groups[groupId];
	if (direct) return direct;
	const lowered = normalizeOptionalLowercaseString(groupId) ?? "";
	const matchKey = Object.keys(groups).find((key) => normalizeOptionalLowercaseString(key) === lowered);
	if (matchKey) return groups[matchKey];
	return wildcard;
}
function hasExplicitFeishuGroupConfig(params) {
	const groups = params.cfg?.groups ?? {};
	const groupId = params.groupId?.trim();
	if (!groupId) return false;
	if (Object.hasOwn(groups, groupId) && groupId !== "*") return true;
	const lowered = normalizeOptionalLowercaseString(groupId) ?? "";
	return Object.keys(groups).some((key) => key !== "*" && normalizeOptionalLowercaseString(key) === lowered);
}
function resolveFeishuGroupToolPolicy(params) {
	const cfg = params.cfg.channels?.feishu;
	if (!cfg) return;
	const groups = cfg.groups ?? {};
	const tree = { scopes: Object.fromEntries(Object.entries(groups).map(([key, entry]) => [key, { tools: entry?.tools }])) };
	const groupId = params.groupId?.trim();
	const matchedKey = resolveScopeKeyCaseInsensitive(tree, groupId);
	const scopeKey = groupId && !matchedKey && Object.hasOwn(tree.scopes, "*") ? "*" : matchedKey;
	return resolveScopeToolsPolicy({
		tree,
		path: scopeKey ? [scopeKey] : []
	});
}
function resolveFeishuReplyPolicy(params) {
	if (params.isDirectMessage) return { requireMention: false };
	const feishuCfg = params.cfg.channels?.feishu;
	const resolvedCfg = resolveMergedAccountConfig({
		channelConfig: feishuCfg,
		accounts: feishuCfg?.accounts,
		accountId: normalizeAccountId(params.accountId),
		normalizeAccountId,
		omitKeys: ["defaultAccount"]
	});
	const groupRequireMention = resolveFeishuGroupConfig({
		cfg: resolvedCfg,
		groupId: params.groupId
	})?.requireMention;
	return { requireMention: typeof groupRequireMention === "boolean" ? groupRequireMention : typeof resolvedCfg.requireMention === "boolean" ? resolvedCfg.requireMention : params.groupPolicy !== "open" };
}
//#endregion
//#region extensions/feishu/src/read-policy.ts
function isActionContext(ctx) {
	return "toolContext" in ctx;
}
function normalizeChatId(raw) {
	if (!raw) return "";
	return normalizeFeishuTarget(raw) ?? raw.trim();
}
function normalizeFeishuAllowlist(entries) {
	return (entries ?? []).map((entry) => normalizeFeishuAllowEntry(String(entry))).filter(Boolean);
}
function readContextFields(ctx) {
	if (isActionContext(ctx)) return {
		accountId: normalizeOptionalString(ctx.accountId),
		currentChannelId: normalizeOptionalString(ctx.toolContext?.currentChannelId),
		currentProvider: normalizeOptionalString(ctx.toolContext?.currentChannelProvider),
		requesterAccountId: normalizeOptionalString(ctx.requesterAccountId),
		requesterSenderId: normalizeOptionalString(ctx.requesterSenderId),
		directOperator: ctx.conversationReadOrigin === "direct-operator"
	};
	return {
		accountId: normalizeOptionalString(ctx.agentAccountId),
		currentChannelId: normalizeOptionalString(ctx.nativeChannelId),
		currentProvider: normalizeOptionalString(ctx.messageChannel ?? ctx.deliveryContext?.channel),
		requesterAccountId: normalizeOptionalString(ctx.deliveryContext?.accountId),
		requesterSenderId: normalizeOptionalString(ctx.requesterSenderId),
		directOperator: ctx.conversationReadOrigin === "direct-operator"
	};
}
function isCurrentChat(params) {
	const context = readContextFields(params.ctx);
	return context.currentProvider?.toLowerCase() === "feishu" && context.requesterAccountId === params.account.accountId && (context.accountId ?? params.account.accountId) === params.account.accountId && normalizeChatId(context.currentChannelId) === normalizeChatId(params.chatId);
}
function resolveFeishuReadGroupPolicy(cfg, account) {
	return resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: cfg.channels?.feishu !== void 0,
		groupPolicy: account.config.groupPolicy,
		defaultGroupPolicy: resolveDefaultGroupPolicy(cfg)
	}).groupPolicy;
}
function isFeishuGroupReadAllowed(cfg, account, chatId, current) {
	const policy = resolveFeishuReadGroupPolicy(cfg, account);
	if (policy === "disabled") return false;
	if (resolveFeishuGroupConfig({
		cfg: account.config,
		groupId: chatId
	})?.enabled === false) return false;
	if (current) return true;
	if (policy === "open") return true;
	const explicitlyConfigured = hasExplicitFeishuGroupConfig({
		cfg: account.config,
		groupId: chatId
	});
	const normalizedChatId = normalizeFeishuAllowEntry(chatId);
	return explicitlyConfigured || resolveAllowlistMatchByCandidates({
		allowList: normalizeFeishuAllowlist(account.config.groupAllowFrom),
		candidates: [{
			value: normalizedChatId,
			source: "id"
		}]
	}).allowed;
}
function isFeishuGroupReadEnabled(cfg, account, chatId) {
	if (resolveFeishuReadGroupPolicy(cfg, account) === "disabled") return false;
	return resolveFeishuGroupConfig({
		cfg: account.config,
		groupId: chatId
	})?.enabled !== false;
}
function isDmUniversallyAllowed(account) {
	return compileAllowlist(normalizeFeishuAllowlist(account.config.allowFrom)).wildcard;
}
function assertFeishuChatReadAllowed(params) {
	const authorization = resolveFeishuChatReadPreliminaryAuthorization(params);
	if (authorization.decision !== "allow") throw new ToolAuthorizationError("Feishu read target is not allowed.");
	return authorization.chatId;
}
function resolveFeishuChatReadPreliminaryAuthorization(params) {
	const chatId = normalizeChatId(params.chatId);
	const resolvedChatType = normalizeFeishuChatType(params.chatType);
	const knownGroup = resolvedChatType === "group" || params.chatType === void 0 && hasExplicitFeishuGroupConfig({
		cfg: params.account.config,
		groupId: chatId
	});
	const knownDm = resolvedChatType === "p2p";
	const current = isCurrentChat({
		account: params.account,
		chatId,
		ctx: params.ctx
	});
	const directOperator = readContextFields(params.ctx).directOperator;
	const groupAllowed = directOperator ? isFeishuGroupReadEnabled(params.cfg, params.account, chatId) : isFeishuGroupReadAllowed(params.cfg, params.account, chatId, current);
	const dmAllowed = directOperator || current || isDmUniversallyAllowed(params.account);
	if (knownGroup) return {
		chatId,
		decision: groupAllowed ? "allow" : "deny"
	};
	if (knownDm) return {
		chatId,
		decision: dmAllowed ? "allow" : "deny"
	};
	if (groupAllowed === dmAllowed) return {
		chatId,
		decision: groupAllowed ? "allow" : "deny"
	};
	return {
		chatId,
		decision: "needs-metadata"
	};
}
function authorizeFeishuChatMemberRead(params) {
	const chatId = assertFeishuChatReadAllowed(params);
	const chatType = normalizeFeishuChatType(params.chatType);
	if (chatType === "group") return {
		kind: "group",
		chatId
	};
	if (chatType !== "p2p") throw new ToolAuthorizationError("Feishu chat member reads require a known chat type.");
	if (!isCurrentChat({
		account: params.account,
		chatId,
		ctx: params.ctx
	})) throw new ToolAuthorizationError("Feishu direct-chat member reads require the current conversation.");
	const requesterSenderId = normalizeChatId(readContextFields(params.ctx).requesterSenderId);
	if (!requesterSenderId) throw new ToolAuthorizationError("Feishu direct-chat member identity is unavailable.");
	const requesterSenderIdType = detectIdType(requesterSenderId);
	if (requesterSenderIdType !== "open_id" && requesterSenderIdType !== "user_id") throw new ToolAuthorizationError("Feishu direct-chat member identity type is unavailable.");
	if (params.memberIdType && params.memberIdType !== requesterSenderIdType) throw new ToolAuthorizationError("Feishu direct-chat member identifier type must match the current sender.");
	if (params.memberId && normalizeChatId(params.memberId) !== requesterSenderId) throw new ToolAuthorizationError("Feishu direct-chat member reads are limited to the current sender.");
	return {
		kind: "direct",
		chatId,
		memberId: requesterSenderId,
		memberIdType: requesterSenderIdType
	};
}
function canEnumerateAllFeishuGroups(cfg, account) {
	const policy = resolveFeishuReadGroupPolicy(cfg, account);
	return policy === "open" || policy === "allowlist" && compileAllowlist(normalizeFeishuAllowlist(account.config.groupAllowFrom)).wildcard;
}
function canEnumerateAllFeishuPeers(account) {
	return isDmUniversallyAllowed(account);
}
//#endregion
//#region node_modules/mdast-util-gfm-table/lib/index.js
/**
* @typedef {import('mdast').InlineCode} InlineCode
* @typedef {import('mdast').Table} Table
* @typedef {import('mdast').TableCell} TableCell
* @typedef {import('mdast').TableRow} TableRow
*
* @typedef {import('markdown-table').Options} MarkdownTableOptions
*
* @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
* @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
* @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
*
* @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
* @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
* @typedef {import('mdast-util-to-markdown').State} State
* @typedef {import('mdast-util-to-markdown').Info} Info
*/
/**
* @typedef Options
*   Configuration.
* @property {boolean | null | undefined} [tableCellPadding=true]
*   Whether to add a space of padding between delimiters and cells (default:
*   `true`).
* @property {boolean | null | undefined} [tablePipeAlign=true]
*   Whether to align the delimiters (default: `true`).
* @property {MarkdownTableOptions['stringLength'] | null | undefined} [stringLength]
*   Function to detect the length of table cell content, used when aligning
*   the delimiters between cells (optional).
*/
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM tables in
* markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown` to enable GFM tables.
*/
function gfmTableFromMarkdown() {
	return {
		enter: {
			table: enterTable,
			tableData: enterCell,
			tableHeader: enterCell,
			tableRow: enterRow
		},
		exit: {
			codeText: exitCodeText,
			table: exitTable,
			tableData: exit,
			tableHeader: exit,
			tableRow: exit
		}
	};
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterTable(token) {
	const align = token._align;
	this.enter({
		type: "table",
		align: align.map(function(d) {
			return d === "none" ? null : d;
		}),
		children: []
	}, token);
	this.data.inTable = true;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitTable(token) {
	this.exit(token);
	this.data.inTable = void 0;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterRow(token) {
	this.enter({
		type: "tableRow",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exit(token) {
	this.exit(token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterCell(token) {
	this.enter({
		type: "tableCell",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitCodeText(token) {
	let value = this.resume();
	if (this.data.inTable) value = value.replace(/\\([\\|])/g, replace);
	const node = this.stack[this.stack.length - 1];
	node.type;
	node.value = value;
	this.exit(token);
}
/**
* @param {string} $0
* @param {string} $1
* @returns {string}
*/
function replace($0, $1) {
	return $1 === "|" ? $1 : $0;
}
//#endregion
//#region node_modules/micromark-extension-gfm-table/lib/edit-map.js
/**
* @import {Event} from 'micromark-util-types'
*/
/**
* @typedef {[number, number, Array<Event>]} Change
* @typedef {[number, number, number]} Jump
*/
/**
* Tracks a bunch of edits.
*/
var EditMap = class {
	/**
	* Create a new edit map.
	*/
	constructor() {
		/**
		* Record of changes.
		*
		* @type {Array<Change>}
		*/
		this.map = [];
	}
	/**
	* Create an edit: a remove and/or add at a certain place.
	*
	* @param {number} index
	* @param {number} remove
	* @param {Array<Event>} add
	* @returns {undefined}
	*/
	add(index, remove, add) {
		addImplementation(this, index, remove, add);
	}
	/**
	* Done, change the events.
	*
	* @param {Array<Event>} events
	* @returns {undefined}
	*/
	consume(events) {
		this.map.sort(function(a, b) {
			return a[0] - b[0];
		});
		/* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
		if (this.map.length === 0) return;
		let index = this.map.length;
		/** @type {Array<Array<Event>>} */
		const vecs = [];
		while (index > 0) {
			index -= 1;
			vecs.push(events.slice(this.map[index][0] + this.map[index][1]), this.map[index][2]);
			events.length = this.map[index][0];
		}
		vecs.push(events.slice());
		events.length = 0;
		let slice = vecs.pop();
		while (slice) {
			for (const element of slice) events.push(element);
			slice = vecs.pop();
		}
		this.map.length = 0;
	}
};
/**
* Create an edit.
*
* @param {EditMap} editMap
* @param {number} at
* @param {number} remove
* @param {Array<Event>} add
* @returns {undefined}
*/
function addImplementation(editMap, at, remove, add) {
	let index = 0;
	/* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
	if (remove === 0 && add.length === 0) return;
	while (index < editMap.map.length) {
		if (editMap.map[index][0] === at) {
			editMap.map[index][1] += remove;
			editMap.map[index][2].push(...add);
			return;
		}
		index += 1;
	}
	editMap.map.push([
		at,
		remove,
		add
	]);
}
//#endregion
//#region node_modules/micromark-extension-gfm-table/lib/infer.js
/**
* @import {Event} from 'micromark-util-types'
*/
/**
* @typedef {'center' | 'left' | 'none' | 'right'} Align
*/
/**
* Figure out the alignment of a GFM table.
*
* @param {Readonly<Array<Event>>} events
*   List of events.
* @param {number} index
*   Table enter event.
* @returns {Array<Align>}
*   List of aligns.
*/
function gfmTableAlign(events, index) {
	let inDelimiterRow = false;
	/** @type {Array<Align>} */
	const align = [];
	while (index < events.length) {
		const event = events[index];
		if (inDelimiterRow) {
			if (event[0] === "enter") {
				if (event[1].type === "tableContent") align.push(events[index + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
			} else if (event[1].type === "tableContent") {
				if (events[index - 1][1].type === "tableDelimiterMarker") {
					const alignIndex = align.length - 1;
					align[alignIndex] = align[alignIndex] === "left" ? "center" : "right";
				}
			} else if (event[1].type === "tableDelimiterRow") break;
		} else if (event[0] === "enter" && event[1].type === "tableDelimiterRow") inDelimiterRow = true;
		index += 1;
	}
	return align;
}
//#endregion
//#region node_modules/micromark-extension-gfm-table/lib/syntax.js
/**
* @import {Event, Extension, Point, Resolver, State, Token, TokenizeContext, Tokenizer} from 'micromark-util-types'
*/
/**
* @typedef {[number, number, number, number]} Range
*   Cell info.
*
* @typedef {0 | 1 | 2 | 3} RowKind
*   Where we are: `1` for head row, `2` for delimiter row, `3` for body row.
*/
/**
* Create an HTML extension for `micromark` to support GitHub tables syntax.
*
* @returns {Extension}
*   Extension for `micromark` that can be passed in `extensions` to enable GFM
*   table syntax.
*/
function gfmTable() {
	return { flow: { null: {
		name: "table",
		tokenize: tokenizeTable,
		resolveAll: resolveTable
	} } };
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeTable(effects, ok, nok) {
	const self = this;
	let size = 0;
	let sizeB = 0;
	/** @type {boolean | undefined} */
	let seen;
	return start;
	/**
	* Start of a GFM table.
	*
	* If there is a valid table row or table head before, then we try to parse
	* another row.
	* Otherwise, we try to parse a head.
	*
	* ```markdown
	* > | | a |
	*     ^
	*   | | - |
	* > | | b |
	*     ^
	* ```
	* @type {State}
	*/
	function start(code) {
		let index = self.events.length - 1;
		while (index > -1) {
			const type = self.events[index][1].type;
			if (type === "lineEnding" || type === "linePrefix") index--;
			else break;
		}
		const tail = index > -1 ? self.events[index][1].type : null;
		const next = tail === "tableHead" || tail === "tableRow" ? bodyRowStart : headRowBefore;
		if (next === bodyRowStart && self.parser.lazy[self.now().line]) return nok(code);
		return next(code);
	}
	/**
	* Before table head row.
	*
	* ```markdown
	* > | | a |
	*     ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowBefore(code) {
		effects.enter("tableHead");
		effects.enter("tableRow");
		return headRowStart(code);
	}
	/**
	* Before table head row, after whitespace.
	*
	* ```markdown
	* > | | a |
	*     ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowStart(code) {
		if (code === 124) return headRowBreak(code);
		seen = true;
		sizeB += 1;
		return headRowBreak(code);
	}
	/**
	* At break in table head row.
	*
	* ```markdown
	* > | | a |
	*     ^
	*       ^
	*         ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowBreak(code) {
		if (code === null) return nok(code);
		if (markdownLineEnding(code)) {
			if (sizeB > 1) {
				sizeB = 0;
				self.interrupt = true;
				effects.exit("tableRow");
				effects.enter("lineEnding");
				effects.consume(code);
				effects.exit("lineEnding");
				return headDelimiterStart;
			}
			return nok(code);
		}
		if (markdownSpace(code)) return factorySpace(effects, headRowBreak, "whitespace")(code);
		sizeB += 1;
		if (seen) {
			seen = false;
			size += 1;
		}
		if (code === 124) {
			effects.enter("tableCellDivider");
			effects.consume(code);
			effects.exit("tableCellDivider");
			seen = true;
			return headRowBreak;
		}
		effects.enter("data");
		return headRowData(code);
	}
	/**
	* In table head row data.
	*
	* ```markdown
	* > | | a |
	*       ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowData(code) {
		if (code === null || code === 124 || markdownLineEndingOrSpace(code)) {
			effects.exit("data");
			return headRowBreak(code);
		}
		effects.consume(code);
		return code === 92 ? headRowEscape : headRowData;
	}
	/**
	* In table head row escape.
	*
	* ```markdown
	* > | | a\-b |
	*         ^
	*   | | ---- |
	*   | | c    |
	* ```
	*
	* @type {State}
	*/
	function headRowEscape(code) {
		if (code === 92 || code === 124) {
			effects.consume(code);
			return headRowData;
		}
		return headRowData(code);
	}
	/**
	* Before delimiter row.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*     ^
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headDelimiterStart(code) {
		self.interrupt = false;
		if (self.parser.lazy[self.now().line]) return nok(code);
		effects.enter("tableDelimiterRow");
		seen = false;
		if (markdownSpace(code)) return factorySpace(effects, headDelimiterBefore, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code);
		return headDelimiterBefore(code);
	}
	/**
	* Before delimiter row, after optional whitespace.
	*
	* Reused when a `|` is found later, to parse another cell.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*     ^
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headDelimiterBefore(code) {
		if (code === 45 || code === 58) return headDelimiterValueBefore(code);
		if (code === 124) {
			seen = true;
			effects.enter("tableCellDivider");
			effects.consume(code);
			effects.exit("tableCellDivider");
			return headDelimiterCellBefore;
		}
		return headDelimiterNok(code);
	}
	/**
	* After `|`, before delimiter cell.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*      ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterCellBefore(code) {
		if (markdownSpace(code)) return factorySpace(effects, headDelimiterValueBefore, "whitespace")(code);
		return headDelimiterValueBefore(code);
	}
	/**
	* Before delimiter cell value.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterValueBefore(code) {
		if (code === 58) {
			sizeB += 1;
			seen = true;
			effects.enter("tableDelimiterMarker");
			effects.consume(code);
			effects.exit("tableDelimiterMarker");
			return headDelimiterLeftAlignmentAfter;
		}
		if (code === 45) {
			sizeB += 1;
			return headDelimiterLeftAlignmentAfter(code);
		}
		if (code === null || markdownLineEnding(code)) return headDelimiterCellAfter(code);
		return headDelimiterNok(code);
	}
	/**
	* After delimiter cell left alignment marker.
	*
	* ```markdown
	*   | | a  |
	* > | | :- |
	*        ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterLeftAlignmentAfter(code) {
		if (code === 45) {
			effects.enter("tableDelimiterFiller");
			return headDelimiterFiller(code);
		}
		return headDelimiterNok(code);
	}
	/**
	* In delimiter cell filler.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterFiller(code) {
		if (code === 45) {
			effects.consume(code);
			return headDelimiterFiller;
		}
		if (code === 58) {
			seen = true;
			effects.exit("tableDelimiterFiller");
			effects.enter("tableDelimiterMarker");
			effects.consume(code);
			effects.exit("tableDelimiterMarker");
			return headDelimiterRightAlignmentAfter;
		}
		effects.exit("tableDelimiterFiller");
		return headDelimiterRightAlignmentAfter(code);
	}
	/**
	* After delimiter cell right alignment marker.
	*
	* ```markdown
	*   | |  a |
	* > | | -: |
	*         ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterRightAlignmentAfter(code) {
		if (markdownSpace(code)) return factorySpace(effects, headDelimiterCellAfter, "whitespace")(code);
		return headDelimiterCellAfter(code);
	}
	/**
	* After delimiter cell.
	*
	* ```markdown
	*   | |  a |
	* > | | -: |
	*          ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterCellAfter(code) {
		if (code === 124) return headDelimiterBefore(code);
		if (code === null || markdownLineEnding(code)) {
			if (!seen || size !== sizeB) return headDelimiterNok(code);
			effects.exit("tableDelimiterRow");
			effects.exit("tableHead");
			return ok(code);
		}
		return headDelimiterNok(code);
	}
	/**
	* In delimiter row, at a disallowed byte.
	*
	* ```markdown
	*   | | a |
	* > | | x |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterNok(code) {
		return nok(code);
	}
	/**
	* Before table body row.
	*
	* ```markdown
	*   | | a |
	*   | | - |
	* > | | b |
	*     ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowStart(code) {
		effects.enter("tableRow");
		return bodyRowBreak(code);
	}
	/**
	* At break in table body row.
	*
	* ```markdown
	*   | | a |
	*   | | - |
	* > | | b |
	*     ^
	*       ^
	*         ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowBreak(code) {
		if (code === 124) {
			effects.enter("tableCellDivider");
			effects.consume(code);
			effects.exit("tableCellDivider");
			return bodyRowBreak;
		}
		if (code === null || markdownLineEnding(code)) {
			effects.exit("tableRow");
			return ok(code);
		}
		if (markdownSpace(code)) return factorySpace(effects, bodyRowBreak, "whitespace")(code);
		effects.enter("data");
		return bodyRowData(code);
	}
	/**
	* In table body row data.
	*
	* ```markdown
	*   | | a |
	*   | | - |
	* > | | b |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowData(code) {
		if (code === null || code === 124 || markdownLineEndingOrSpace(code)) {
			effects.exit("data");
			return bodyRowBreak(code);
		}
		effects.consume(code);
		return code === 92 ? bodyRowEscape : bodyRowData;
	}
	/**
	* In table body row escape.
	*
	* ```markdown
	*   | | a    |
	*   | | ---- |
	* > | | b\-c |
	*         ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowEscape(code) {
		if (code === 92 || code === 124) {
			effects.consume(code);
			return bodyRowData;
		}
		return bodyRowData(code);
	}
}
/** @type {Resolver} */
function resolveTable(events, context) {
	let index = -1;
	let inFirstCellAwaitingPipe = true;
	/** @type {RowKind} */
	let rowKind = 0;
	/** @type {Range} */
	let lastCell = [
		0,
		0,
		0,
		0
	];
	/** @type {Range} */
	let cell = [
		0,
		0,
		0,
		0
	];
	let afterHeadAwaitingFirstBodyRow = false;
	let lastTableEnd = 0;
	/** @type {Token | undefined} */
	let currentTable;
	/** @type {Token | undefined} */
	let currentBody;
	/** @type {Token | undefined} */
	let currentCell;
	const map = new EditMap();
	while (++index < events.length) {
		const event = events[index];
		const token = event[1];
		if (event[0] === "enter") {
			if (token.type === "tableHead") {
				afterHeadAwaitingFirstBodyRow = false;
				if (lastTableEnd !== 0) {
					flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
					currentBody = void 0;
					lastTableEnd = 0;
				}
				currentTable = {
					type: "table",
					start: Object.assign({}, token.start),
					end: Object.assign({}, token.end)
				};
				map.add(index, 0, [[
					"enter",
					currentTable,
					context
				]]);
			} else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
				inFirstCellAwaitingPipe = true;
				currentCell = void 0;
				lastCell = [
					0,
					0,
					0,
					0
				];
				cell = [
					0,
					index + 1,
					0,
					0
				];
				if (afterHeadAwaitingFirstBodyRow) {
					afterHeadAwaitingFirstBodyRow = false;
					currentBody = {
						type: "tableBody",
						start: Object.assign({}, token.start),
						end: Object.assign({}, token.end)
					};
					map.add(index, 0, [[
						"enter",
						currentBody,
						context
					]]);
				}
				rowKind = token.type === "tableDelimiterRow" ? 2 : currentBody ? 3 : 1;
			} else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) {
				inFirstCellAwaitingPipe = false;
				if (cell[2] === 0) {
					if (lastCell[1] !== 0) {
						cell[0] = cell[1];
						currentCell = flushCell(map, context, lastCell, rowKind, void 0, currentCell);
						lastCell = [
							0,
							0,
							0,
							0
						];
					}
					cell[2] = index;
				}
			} else if (token.type === "tableCellDivider") if (inFirstCellAwaitingPipe) inFirstCellAwaitingPipe = false;
			else {
				if (lastCell[1] !== 0) {
					cell[0] = cell[1];
					currentCell = flushCell(map, context, lastCell, rowKind, void 0, currentCell);
				}
				lastCell = cell;
				cell = [
					lastCell[1],
					index,
					0,
					0
				];
			}
		} else if (token.type === "tableHead") {
			afterHeadAwaitingFirstBodyRow = true;
			lastTableEnd = index;
		} else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
			lastTableEnd = index;
			if (lastCell[1] !== 0) {
				cell[0] = cell[1];
				currentCell = flushCell(map, context, lastCell, rowKind, index, currentCell);
			} else if (cell[1] !== 0) currentCell = flushCell(map, context, cell, rowKind, index, currentCell);
			rowKind = 0;
		} else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) cell[3] = index;
	}
	if (lastTableEnd !== 0) flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
	map.consume(context.events);
	index = -1;
	while (++index < context.events.length) {
		const event = context.events[index];
		if (event[0] === "enter" && event[1].type === "table") event[1]._align = gfmTableAlign(context.events, index);
	}
	return events;
}
/**
* Generate a cell.
*
* @param {EditMap} map
* @param {Readonly<TokenizeContext>} context
* @param {Readonly<Range>} range
* @param {RowKind} rowKind
* @param {number | undefined} rowEnd
* @param {Token | undefined} previousCell
* @returns {Token | undefined}
*/
function flushCell(map, context, range, rowKind, rowEnd, previousCell) {
	const groupName = rowKind === 1 ? "tableHeader" : rowKind === 2 ? "tableDelimiter" : "tableData";
	const valueName = "tableContent";
	if (range[0] !== 0) {
		previousCell.end = Object.assign({}, getPoint(context.events, range[0]));
		map.add(range[0], 0, [[
			"exit",
			previousCell,
			context
		]]);
	}
	const now = getPoint(context.events, range[1]);
	previousCell = {
		type: groupName,
		start: Object.assign({}, now),
		end: Object.assign({}, now)
	};
	map.add(range[1], 0, [[
		"enter",
		previousCell,
		context
	]]);
	if (range[2] !== 0) {
		const relatedStart = getPoint(context.events, range[2]);
		const relatedEnd = getPoint(context.events, range[3]);
		/** @type {Token} */
		const valueToken = {
			type: valueName,
			start: Object.assign({}, relatedStart),
			end: Object.assign({}, relatedEnd)
		};
		map.add(range[2], 0, [[
			"enter",
			valueToken,
			context
		]]);
		if (rowKind !== 2) {
			const start = context.events[range[2]];
			const end = context.events[range[3]];
			start[1].end = Object.assign({}, end[1].end);
			start[1].type = "chunkText";
			start[1].contentType = "text";
			if (range[3] > range[2] + 1) {
				const a = range[2] + 1;
				const b = range[3] - range[2] - 1;
				map.add(a, b, []);
			}
		}
		map.add(range[3] + 1, 0, [[
			"exit",
			valueToken,
			context
		]]);
	}
	if (rowEnd !== void 0) {
		previousCell.end = Object.assign({}, getPoint(context.events, rowEnd));
		map.add(rowEnd, 0, [[
			"exit",
			previousCell,
			context
		]]);
		previousCell = void 0;
	}
	return previousCell;
}
/**
* Generate table end (and table body end).
*
* @param {Readonly<EditMap>} map
* @param {Readonly<TokenizeContext>} context
* @param {number} index
* @param {Token} table
* @param {Token | undefined} tableBody
*/
function flushTableEnd(map, context, index, table, tableBody) {
	/** @type {Array<Event>} */
	const exits = [];
	const related = getPoint(context.events, index);
	if (tableBody) {
		tableBody.end = Object.assign({}, related);
		exits.push([
			"exit",
			tableBody,
			context
		]);
	}
	table.end = Object.assign({}, related);
	exits.push([
		"exit",
		table,
		context
	]);
	map.add(index + 1, 0, exits);
}
/**
* @param {Readonly<Array<Event>>} events
* @param {number} index
* @returns {Readonly<Point>}
*/
function getPoint(events, index) {
	const event = events[index];
	const side = event[0] === "enter" ? "start" : "end";
	return event[1][side];
}
//#endregion
//#region extensions/feishu/src/markdown.ts
const FEISHU_POST_MAX_BYTES = 30 * 1024;
/** One parser contract for Feishu message and document Markdown decisions. */
function parseFeishuMarkdown(text) {
	return fromMarkdown(text, {
		extensions: [gfmTable()],
		mdastExtensions: [gfmTableFromMarkdown()]
	});
}
function buildFeishuPostMentionElements(mentions) {
	if (!mentions?.length) return [];
	const elements = [];
	for (const mention of mentions) {
		const userId = mention.openId.trim();
		if (!userId) continue;
		const userName = mention.name.trim();
		elements.push({
			tag: "at",
			user_id: userId,
			...userName ? { user_name: userName } : {}
		});
	}
	return elements;
}
function buildFeishuPostMessageContent(params) {
	const content = [...buildFeishuPostMentionElements(params.mentions), {
		tag: "md",
		text: params.messageText
	}];
	return JSON.stringify({ zh_cn: { content: [content] } });
}
function assertFeishuPostWithinEnvelope(content, label) {
	if (Buffer.byteLength(content, "utf8") > FEISHU_POST_MAX_BYTES) throw new Error(`${label} exceeds the 30 KB rich-post API limit`);
}
function collectSoftBreakOffsets(text) {
	const root = parseFeishuMarkdown(text);
	const offsets = [];
	const pending = [root];
	while (pending.length > 0) {
		const node = pending.pop();
		if (!node) continue;
		if (node.children) pending.push(...node.children);
		if (node.type !== "text") continue;
		const start = node.position?.start.offset;
		const end = node.position?.end.offset;
		if (start === void 0 || end === void 0) continue;
		for (let offset = start; offset < end; offset += 1) {
			const char = text[offset];
			if (char === "\n") {
				if (text[offset - 1] !== "\r") offsets.push(offset);
				continue;
			}
			if (char === "\r") {
				offsets.push(offset);
				if (text[offset + 1] === "\n") offset += 1;
			}
		}
	}
	return offsets.toSorted((left, right) => left - right);
}
/**
* Materialize CommonMark soft breaks for Feishu post `md` rendering.
*
* The parser identifies only soft breaks, then upgrades them to CommonMark
* hard breaks. Structural line endings and code, HTML, definitions, setext
* headings, and existing hard breaks retain their source bytes.
*/
function materializeFeishuPostMarkdownSoftBreaks(text) {
	if (!text.includes("\n") && !text.includes("\r")) return text;
	const softBreakOffsets = collectSoftBreakOffsets(text);
	if (softBreakOffsets.length === 0) return text;
	const parts = [];
	let cursor = 0;
	for (const offset of softBreakOffsets) {
		const lineEnding = text[offset] === "\r" ? text[offset + 1] === "\n" ? "\r\n" : "\r" : "\n";
		parts.push(text.slice(cursor, offset), "  ", lineEnding);
		cursor = offset + lineEnding.length;
	}
	parts.push(text.slice(cursor));
	return parts.join("");
}
function chunkFeishuMarkdownWithMode(text, limit, mode) {
	return chunkMarkdownTextWithMode(text, limit, mode);
}
/** Keep every platform chunk independently valid Markdown, including fences. */
function chunkFeishuMarkdown(text, limit) {
	return chunkFeishuMarkdownWithMode(text, limit, "length");
}
function postContentBytes(messageText, mentions) {
	return Buffer.byteLength(buildFeishuPostMessageContent({
		messageText,
		mentions
	}), "utf8");
}
/**
* Honor both configured character chunking and Feishu's serialized post envelope.
* Markdown wrappers and first-chunk mentions count toward the byte budget.
*/
function chunkFeishuPostMarkdown(params) {
	const { text, firstChunkMentions, chunkMentions } = params;
	if (!text) return [];
	const requestedLimit = Number.isFinite(params.limit) && params.limit > 0 ? Math.floor(params.limit) : text.length;
	const initialChunks = params.initialChunks ?? chunkFeishuMarkdownWithMode(text, requestedLimit, params.mode ?? "length");
	const output = [];
	const resolveMentions = (isFirst) => {
		const mentions = [...chunkMentions ?? [], ...isFirst ? firstChunkMentions ?? [] : []];
		return mentions.length > 0 ? mentions : void 0;
	};
	for (const initialChunk of initialChunks) {
		if (postContentBytes(initialChunk, resolveMentions(output.length === 0)) <= FEISHU_POST_MAX_BYTES) {
			output.push(initialChunk);
			continue;
		}
		let adaptiveLimit = Math.max(1, Math.min(requestedLimit, initialChunk.length));
		while (true) {
			const chunks = chunkFeishuMarkdownWithMode(initialChunk, adaptiveLimit, params.mode ?? "length");
			let largestContentBytes = 0;
			let oversizedChunk;
			let oversizedMentions;
			for (const [index, chunk] of chunks.entries()) {
				const mentionsForChunk = resolveMentions(output.length === 0 && index === 0);
				const contentBytes = postContentBytes(chunk, mentionsForChunk);
				largestContentBytes = Math.max(largestContentBytes, contentBytes);
				if (contentBytes > FEISHU_POST_MAX_BYTES && oversizedChunk === void 0) {
					oversizedChunk = chunk;
					oversizedMentions = mentionsForChunk;
				}
			}
			if (oversizedChunk === void 0) {
				output.push(...chunks);
				break;
			}
			if (adaptiveLimit === 1) {
				assertFeishuPostWithinEnvelope(buildFeishuPostMessageContent({
					messageText: oversizedChunk,
					mentions: oversizedMentions
				}), "Feishu post chunk");
				return [...output, ...chunks];
			}
			adaptiveLimit = Math.max(1, Math.min(adaptiveLimit - 1, Math.floor(adaptiveLimit * FEISHU_POST_MAX_BYTES / largestContentBytes) - 1));
		}
	}
	return output;
}
//#endregion
//#region extensions/feishu/src/native-card.ts
const FEISHU_CARD_TEMPLATES = /* @__PURE__ */ new Set([
	"blue",
	"green",
	"red",
	"orange",
	"purple",
	"indigo",
	"wathet",
	"turquoise",
	"yellow",
	"grey",
	"carmine",
	"violet",
	"lime"
]);
function resolveFeishuCardTemplate(template) {
	const normalized = normalizeOptionalLowercaseString(template);
	if (!normalized || !FEISHU_CARD_TEMPLATES.has(normalized)) return;
	return normalized;
}
function escapeFeishuCardMarkdownText(text) {
	return text.replace(/[&<>]/g, (char) => {
		switch (char) {
			case "&": return "&amp;";
			case "<": return "&lt;";
			case ">": return "&gt;";
			default: return char;
		}
	});
}
function escapeFeishuCardPlainText(text) {
	return escapeFeishuCardMarkdownText(text).replace(/([\\`*_{}[\]()#+\-!|>~])/g, "\\$1");
}
function resolveSafeFeishuButtonUrl(url) {
	const trimmed = typeof url === "string" ? url.trim() : "";
	if (!trimmed) return;
	try {
		const parsed = new URL(trimmed);
		return parsed.protocol === "https:" || parsed.protocol === "http:" ? trimmed : void 0;
	} catch {
		return;
	}
}
function sanitizeNativeFeishuButtonBehavior(behavior) {
	if (!isRecord(behavior)) return;
	if (behavior.type === "open_url") {
		const safeUrl = resolveSafeFeishuButtonUrl(behavior.default_url) ?? resolveSafeFeishuButtonUrl(behavior.url);
		return safeUrl ? {
			type: "open_url",
			default_url: safeUrl
		} : void 0;
	}
	if (behavior.type === "callback" && isRecord(behavior.value) && behavior.value.oc === "ocf1") return {
		type: "callback",
		value: behavior.value
	};
}
function sanitizeNativeFeishuCardButton(button) {
	if (!isRecord(button)) return;
	const text = isRecord(button.text) && typeof button.text.content === "string" ? button.text.content : void 0;
	if (!text?.trim()) return;
	const style = button.type === "danger" ? "danger" : button.type === "primary" || button.type === "success" ? "primary" : void 0;
	const behaviors = Array.isArray(button.behaviors) ? button.behaviors.map((behavior) => sanitizeNativeFeishuButtonBehavior(behavior)).filter((behavior) => Boolean(behavior)) : [];
	const rootSafeUrl = resolveSafeFeishuButtonUrl(button.url);
	if (rootSafeUrl) behaviors.push({
		type: "open_url",
		default_url: rootSafeUrl
	});
	if (isRecord(button.value) && button.value.oc === "ocf1") behaviors.push({
		type: "callback",
		value: button.value
	});
	if (behaviors.length === 0) return;
	return {
		tag: "button",
		text: {
			tag: "plain_text",
			content: text
		},
		type: style === "danger" ? "danger" : style === "primary" ? "primary" : "default",
		behaviors
	};
}
function sanitizeNativeFeishuCardElements(element) {
	if (!isRecord(element) || typeof element.tag !== "string") return [];
	if (element.tag === "hr") return [{ tag: "hr" }];
	if (element.tag === "markdown" && typeof element.content === "string") return [{
		tag: "markdown",
		content: escapeFeishuCardMarkdownText(element.content)
	}];
	if (element.tag === "div" && isRecord(element.text)) {
		const text = element.text;
		if (text.tag === "lark_md" && typeof text.content === "string") return [{
			tag: "markdown",
			content: escapeFeishuCardMarkdownText(text.content)
		}];
		if (text.tag === "plain_text" && typeof text.content === "string") return [{
			tag: "markdown",
			content: escapeFeishuCardPlainText(text.content)
		}];
		return [];
	}
	if (element.tag === "button") {
		const button = sanitizeNativeFeishuCardButton(element);
		return button ? [button] : [];
	}
	if (element.tag === "action" && Array.isArray(element.actions)) return element.actions.map((action) => sanitizeNativeFeishuCardButton(action)).filter((action) => Boolean(action));
	return [];
}
function sanitizeNativeFeishuCard(card) {
	const normalizedCard = card.type === "interactive" && isRecord(card.card) ? card.card : card;
	const body = isRecord(normalizedCard.body) ? normalizedCard.body : void 0;
	const elements = (Array.isArray(body?.elements) ? body.elements : Array.isArray(normalizedCard.elements) ? normalizedCard.elements : []).flatMap((element) => sanitizeNativeFeishuCardElements(element)).filter((element) => Boolean(element));
	if (elements.length === 0) return;
	const header = isRecord(normalizedCard.header) ? normalizedCard.header : void 0;
	const title = isRecord(header?.title) && typeof header.title.content === "string" ? header.title.content : void 0;
	return {
		schema: "2.0",
		config: { width_mode: "fill" },
		...title?.trim() ? { header: {
			title: {
				tag: "plain_text",
				content: title
			},
			template: resolveFeishuCardTemplate(typeof header?.template === "string" ? header.template : void 0) ?? "blue"
		} } : {},
		body: { elements }
	};
}
function readNativeFeishuCardJson(text, options) {
	let trimmed = text?.trim();
	const responsePrefix = options?.responsePrefix;
	if (trimmed && responsePrefix && trimmed.startsWith(responsePrefix)) {
		const suffix = trimmed.slice(responsePrefix.length);
		if (/^\s+\{/.test(suffix)) trimmed = suffix.trimStart();
	}
	if (!trimmed?.startsWith("{") || !trimmed.endsWith("}")) return;
	try {
		const parsed = JSON.parse(trimmed);
		return isRecord(parsed) ? sanitizeNativeFeishuCard(parsed) : void 0;
	} catch {
		return;
	}
}
//#endregion
//#region extensions/feishu/src/send-result.ts
function resolveFeishuReceiptKind(msgType) {
	switch (msgType) {
		case "audio": return "voice";
		case "image":
		case "media":
		case "file": return "media";
		case "interactive": return "card";
		case "post":
		case "text": return "text";
		default: return "unknown";
	}
}
function createFeishuSendReceipt(params) {
	const messageId = params.messageId?.trim();
	const chatId = params.chatId.trim();
	return createMessageReceiptFromOutboundResults({
		results: messageId ? [{
			channel: "feishu",
			messageId,
			chatId,
			conversationId: chatId
		}] : [],
		...chatId ? { threadId: chatId } : {},
		kind: params.kind ?? "unknown"
	});
}
function assertFeishuMessageApiSuccess(response, errorPrefix) {
	if (response.code !== 0) throw new Error(`${errorPrefix}: ${response.msg || `code ${response.code}`}`);
}
function toFeishuSendResult(response, chatId, kind) {
	const messageId = response.data?.message_id ?? "unknown";
	return {
		messageId,
		chatId,
		receipt: createFeishuSendReceipt({
			messageId,
			chatId,
			kind
		})
	};
}
//#endregion
export { resolveFeishuChatType as A, resolveFeishuDmIngressAccess as C, resolveFeishuGroupToolPolicy as D, resolveFeishuGroupSenderActivationIngressAccess as E, buildFeishuCardActionTextFallback as M, createFeishuCardInteractionEnvelope as N, resolveFeishuReplyPolicy as O, decodeFeishuCardAction as P, normalizeFeishuAllowEntry as S, resolveFeishuGroupConversationIngressAccess as T, canEnumerateAllFeishuPeers as _, readNativeFeishuCardJson as a, resolveFeishuChatReadPreliminaryAuthorization as b, assertFeishuPostWithinEnvelope as c, chunkFeishuPostMarkdown as d, materializeFeishuPostMarkdownSoftBreaks as f, canEnumerateAllFeishuGroups as g, authorizeFeishuChatMemberRead as h, toFeishuSendResult as i, FEISHU_CARD_INTERACTION_VERSION as j, normalizeFeishuChatType as k, buildFeishuPostMessageContent as l, assertFeishuChatReadAllowed as m, createFeishuSendReceipt as n, resolveFeishuCardTemplate as o, parseFeishuMarkdown as p, resolveFeishuReceiptKind as r, sanitizeNativeFeishuCard as s, assertFeishuMessageApiSuccess as t, chunkFeishuMarkdown as u, isFeishuGroupReadAllowed as v, resolveFeishuGroupConfig as w, hasExplicitFeishuGroupConfig as x, isFeishuGroupReadEnabled as y };
