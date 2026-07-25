import { t as mergeDeep } from "./deep-merge-C9bNFIT3.js";
import "./plugin-config-runtime-Dnur9SGp.js";
import { a as defineChannelAliasMigration, o as asObjectRecord } from "./runtime-doctor-NsZSUIhr.js";
import { isDeepStrictEqual } from "node:util";
//#region extensions/googlechat/src/doctor-contract.ts
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "googlechat",
	streaming: {
		defaultMode: "partial",
		deliveryOnly: true
	},
	dm: {
		root: true,
		accounts: true
	}
});
function hasLegacyGoogleChatStreamMode(value) {
	return asObjectRecord(value)?.streamMode !== void 0;
}
function hasRetiredReactions(value) {
	return Object.hasOwn(asObjectRecord(asObjectRecord(value)?.actions) ?? {}, "reactions");
}
function hasLegacyGoogleChatGroupAllowAlias(value) {
	const groups = asObjectRecord(asObjectRecord(value)?.groups);
	if (!groups) return false;
	return Object.values(groups).some((group) => Object.hasOwn(asObjectRecord(group) ?? {}, "allow"));
}
function hasLegacyAccountAliases(value, match) {
	const accounts = asObjectRecord(value);
	if (!accounts) return false;
	return Object.values(accounts).some((account) => match(account));
}
function normalizeGoogleChatGroups(params) {
	let changed = false;
	const nextGroups = { ...params.groups };
	for (const [groupId, groupValue] of Object.entries(params.groups)) {
		const group = asObjectRecord(groupValue);
		if (!group || !Object.hasOwn(group, "allow")) continue;
		const nextGroup = { ...group };
		if (nextGroup.enabled === void 0) {
			nextGroup.enabled = group.allow;
			params.changes.push(`Moved ${params.pathPrefix}.${groupId}.allow → ${params.pathPrefix}.${groupId}.enabled.`);
		} else params.changes.push(`Removed ${params.pathPrefix}.${groupId}.allow (${params.pathPrefix}.${groupId}.enabled already set).`);
		delete nextGroup.allow;
		nextGroups[groupId] = nextGroup;
		changed = true;
	}
	return {
		groups: nextGroups,
		changed
	};
}
function normalizeGoogleChatEntry(params) {
	let updated = params.entry;
	let changed = false;
	if (updated.streamMode !== void 0) {
		updated = { ...updated };
		delete updated.streamMode;
		params.changes.push(`Removed ${params.pathPrefix}.streamMode (legacy key no longer used).`);
		changed = true;
	}
	if (hasRetiredReactions(updated)) {
		const actions = { ...asObjectRecord(updated.actions) };
		delete actions.reactions;
		updated = { ...updated };
		if (Object.keys(actions).length > 0) updated.actions = actions;
		else delete updated.actions;
		params.changes.push(`Removed ${params.pathPrefix}.actions.reactions (Google Chat does not support reactions).`);
		changed = true;
	}
	const groups = asObjectRecord(updated.groups);
	if (groups) {
		const normalized = normalizeGoogleChatGroups({
			groups,
			pathPrefix: `${params.pathPrefix}.groups`,
			changes: params.changes
		});
		if (normalized.changed) {
			updated = {
				...updated,
				groups: normalized.groups
			};
			changed = true;
		}
	}
	return {
		entry: updated,
		changed
	};
}
const legacyConfigRules = [
	{
		path: ["channels", "googlechat"],
		message: "channels.googlechat.actions.reactions is retired and ignored. Run \"openclaw doctor --fix\".",
		match: hasRetiredReactions
	},
	{
		path: [
			"channels",
			"googlechat",
			"accounts"
		],
		message: "channels.googlechat.accounts.<id>.actions.reactions is retired and ignored. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountAliases(value, hasRetiredReactions)
	},
	{
		path: ["channels", "googlechat"],
		message: "channels.googlechat.streamMode is legacy and no longer used; it is removed on load.",
		match: hasLegacyGoogleChatStreamMode
	},
	{
		path: [
			"channels",
			"googlechat",
			"accounts"
		],
		message: "channels.googlechat.accounts.<id>.streamMode is legacy and no longer used; it is removed on load.",
		match: (value) => hasLegacyAccountAliases(value, hasLegacyGoogleChatStreamMode)
	},
	{
		path: ["channels", "googlechat"],
		message: "channels.googlechat.groups.<id>.allow is legacy; use channels.googlechat.groups.<id>.enabled instead. Run \"openclaw doctor --fix\".",
		match: hasLegacyGoogleChatGroupAllowAlias
	},
	{
		path: [
			"channels",
			"googlechat",
			"accounts"
		],
		message: "channels.googlechat.accounts.<id>.groups.<id>.allow is legacy; use channels.googlechat.accounts.<id>.groups.<id>.enabled instead. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountAliases(value, hasLegacyGoogleChatGroupAllowAlias)
	},
	...streamingAliasMigration.legacyConfigRules
];
function normalizeRetiredGoogleChatKeys(cfg) {
	const rawEntry = asObjectRecord(cfg.channels?.googlechat);
	if (!rawEntry) return {
		config: cfg,
		changes: []
	};
	const changes = [];
	let updated = rawEntry;
	let changed;
	const root = normalizeGoogleChatEntry({
		entry: updated,
		pathPrefix: "channels.googlechat",
		changes
	});
	updated = root.entry;
	changed = root.changed;
	const accounts = asObjectRecord(updated.accounts);
	if (accounts) {
		let accountsChanged = false;
		const nextAccounts = { ...accounts };
		for (const [accountId, accountValue] of Object.entries(accounts)) {
			const account = asObjectRecord(accountValue);
			if (!account) continue;
			const normalized = normalizeGoogleChatEntry({
				entry: account,
				pathPrefix: `channels.googlechat.accounts.${accountId}`,
				changes
			});
			if (!normalized.changed) continue;
			nextAccounts[accountId] = normalized.entry;
			accountsChanged = true;
		}
		if (accountsChanged) {
			updated = {
				...updated,
				accounts: nextAccounts
			};
			changed = true;
		}
	}
	if (!changed) return {
		config: cfg,
		changes: []
	};
	return {
		config: {
			...cfg,
			channels: {
				...cfg.channels,
				googlechat: updated
			}
		},
		changes
	};
}
function materializeMigratedAccountStreaming(params) {
	const channels = params.cfg.channels;
	const entry = asObjectRecord(channels?.googlechat);
	const accounts = asObjectRecord(entry?.accounts);
	if (!entry || !accounts) return params.cfg;
	const rootStreaming = asObjectRecord(entry.streaming);
	const defaultKey = Object.hasOwn(accounts, "default") ? "default" : Object.keys(accounts).find((key) => key.trim().toLowerCase() === "default");
	let accountsChanged = false;
	const nextAccounts = { ...accounts };
	const accountIds = Object.keys(accounts).toSorted((left, right) => left === defaultKey ? -1 : right === defaultKey ? 1 : left.localeCompare(right));
	for (const accountId of accountIds) {
		if (asObjectRecord(params.accountsBefore?.[accountId])?.streaming !== void 0) continue;
		const account = asObjectRecord(nextAccounts[accountId]);
		const created = asObjectRecord(account?.streaming);
		if (!account || !created) continue;
		const defaultStreaming = defaultKey ? asObjectRecord(asObjectRecord(nextAccounts[defaultKey])?.streaming) : null;
		const inherited = accountId === defaultKey ? rootStreaming : defaultStreaming ?? rootStreaming;
		if (!inherited) continue;
		const materialized = asObjectRecord(mergeDeep(inherited, created));
		if (!materialized || isDeepStrictEqual(materialized, created)) continue;
		nextAccounts[accountId] = {
			...account,
			streaming: materialized
		};
		accountsChanged = true;
		const sourcePath = accountId !== defaultKey && defaultKey && defaultStreaming ? `channels.googlechat.accounts.${defaultKey}.streaming` : "channels.googlechat.streaming";
		params.changes.push(`Copied ${sourcePath} into channels.googlechat.accounts.${accountId}.streaming to keep inherited settings while migrating flat streaming keys.`);
	}
	if (!accountsChanged) return params.cfg;
	return {
		...params.cfg,
		channels: {
			...channels,
			googlechat: {
				...entry,
				accounts: nextAccounts
			}
		}
	};
}
function normalizeCompatibilityConfig({ cfg }) {
	const retired = normalizeRetiredGoogleChatKeys(cfg);
	const accountsBefore = asObjectRecord(asObjectRecord(retired.config.channels?.googlechat)?.accounts);
	const aliases = streamingAliasMigration.normalizeChannelConfig({
		cfg: retired.config,
		changes: retired.changes
	});
	return {
		config: materializeMigratedAccountStreaming({
			cfg: aliases.config,
			accountsBefore,
			changes: aliases.changes
		}),
		changes: aliases.changes
	};
}
//#endregion
export { normalizeCompatibilityConfig as n, legacyConfigRules as t };
