import { n as isDiscordAccountEnabledForRuntime, r as listDiscordAccountIds, s as resolveDiscordAccount } from "./accounts-sZJTKxVc.js";
import { b as resolveDiscordProxyFetchForAccount } from "./send.permissions-BhFjVFcq.js";
//#region extensions/discord/src/activities/config.ts
function readNonEmpty(value) {
	return value?.trim() || void 0;
}
function resolveDiscordActivitiesConfig(account, env = process.env) {
	if (!account.activities) return {
		enabled: false,
		reason: "not-configured"
	};
	const clientSecret = readNonEmpty(account.activities.clientSecret) ?? readNonEmpty(env.DISCORD_CLIENT_SECRET);
	if (!clientSecret) return {
		enabled: false,
		reason: "missing-client-secret"
	};
	const applicationId = readNonEmpty(account.activities.applicationId);
	return {
		enabled: true,
		clientSecret,
		...applicationId ? { applicationId } : {}
	};
}
//#endregion
//#region extensions/discord/src/activities/runtime.ts
var DiscordActivitiesRuntime = class {
	constructor(store, startupConfig, getCurrentConfig, env = process.env) {
		this.store = store;
		this.startupConfig = startupConfig;
		this.getCurrentConfig = getCurrentConfig;
		this.env = env;
		this.learnedApplicationIds = /* @__PURE__ */ new Map();
	}
	currentConfig() {
		return this.getCurrentConfig?.() ?? this.startupConfig;
	}
	registerApplicationId(accountId, applicationId) {
		const trimmed = applicationId.trim();
		if (trimmed) this.learnedApplicationIds.set(accountId, trimmed);
	}
	resolveAccount(accountId, cfg = this.currentConfig()) {
		const account = resolveDiscordAccount({
			cfg,
			accountId
		});
		if (!isDiscordAccountEnabledForRuntime(account, cfg)) return null;
		const activities = resolveDiscordActivitiesConfig(account.config, this.env);
		if (!activities.enabled) return null;
		const applicationId = activities.applicationId ?? this.learnedApplicationIds.get(account.accountId) ?? account.config.applicationId?.trim();
		if (!applicationId) return null;
		const { clientSecret } = activities;
		const bot = account.token.trim();
		return {
			accountId: account.accountId,
			applicationId,
			botAuth: bot,
			clientSecret,
			proxyFetch: resolveDiscordProxyFetchForAccount(account, cfg)
		};
	}
	resolveHttpAccount(applicationId) {
		const cfg = this.currentConfig();
		const accounts = listDiscordAccountIds(cfg).map((accountId) => this.resolveAccount(accountId, cfg)).filter((account) => account !== null);
		if (applicationId) return accounts.find((account) => account.applicationId === applicationId) ?? null;
		return accounts.length === 1 ? accounts[0] ?? null : null;
	}
	isAccountEnabled(accountId, cfg = this.currentConfig()) {
		const account = resolveDiscordAccount({
			cfg,
			accountId
		});
		return isDiscordAccountEnabledForRuntime(account, cfg) && resolveDiscordActivitiesConfig(account.config, this.env).enabled;
	}
};
let activeRuntime;
function setDiscordActivitiesRuntime(runtime) {
	activeRuntime = runtime;
}
function getDiscordActivitiesRuntime() {
	return activeRuntime;
}
//#endregion
export { resolveDiscordActivitiesConfig as i, getDiscordActivitiesRuntime as n, setDiscordActivitiesRuntime as r, DiscordActivitiesRuntime as t };
