import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { o as hasOwnProperty } from "./runtime-shared-BL5llIf5.js";
import { i as createChannelSecretTargetRegistryEntries, l as normalizeSecretStringValue, o as getChannelSurface, s as hasConfiguredSecretInputValue, t as collectConditionalChannelFieldAssignments } from "./channel-secret-basic-runtime-CSR-dj-5.js";
import "./channel-secret-basic-runtime-BpNC3FYU.js";
//#region extensions/feishu/src/secret-contract.ts
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
	channelKey: "feishu",
	account: [
		"appSecret",
		"encryptKey",
		"verificationToken"
	],
	channel: [
		"appSecret",
		"encryptKey",
		"verificationToken"
	]
});
function collectRuntimeConfigAssignments(params) {
	const resolved = getChannelSurface(params.config, "feishu");
	if (!resolved) return;
	const { channel: feishu, surface } = resolved;
	if (surface.channelEnabled && hasConfiguredSecretInputValue(feishu.appId, params.defaults) && hasConfiguredSecretInputValue(feishu.appSecret, params.defaults) && surface.hasExplicitAccounts && !surface.accounts.some(({ accountId }) => normalizeAccountId(accountId) === "default")) surface.accounts.push({
		accountId: "default",
		account: {},
		enabled: true
	});
	collectConditionalChannelFieldAssignments({
		channelKey: "feishu",
		field: "appSecret",
		channel: feishu,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActiveWithoutAccounts: surface.channelEnabled,
		topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, "appSecret"),
		accountActive: ({ enabled }) => enabled,
		topInactiveReason: "no enabled account inherits this top-level Feishu appSecret.",
		accountInactiveReason: "Feishu account is disabled."
	});
	const baseConnectionMode = normalizeSecretStringValue(feishu.connectionMode) === "webhook" ? "webhook" : "websocket";
	const resolveAccountMode = (account) => hasOwnProperty(account, "connectionMode") ? normalizeSecretStringValue(account.connectionMode) : baseConnectionMode;
	collectConditionalChannelFieldAssignments({
		channelKey: "feishu",
		field: "encryptKey",
		channel: feishu,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActiveWithoutAccounts: baseConnectionMode === "webhook",
		topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, "encryptKey") && resolveAccountMode(account) === "webhook",
		accountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === "webhook",
		topInactiveReason: "no enabled Feishu webhook-mode surface inherits this top-level encryptKey.",
		accountInactiveReason: "Feishu account is disabled or not running in webhook mode."
	});
	collectConditionalChannelFieldAssignments({
		channelKey: "feishu",
		field: "verificationToken",
		channel: feishu,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActiveWithoutAccounts: baseConnectionMode === "webhook",
		topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, "verificationToken") && resolveAccountMode(account) === "webhook",
		accountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === "webhook",
		topInactiveReason: "no enabled Feishu webhook-mode surface inherits this top-level verificationToken.",
		accountInactiveReason: "Feishu account is disabled or not running in webhook mode."
	});
}
const channelSecrets = {
	secretTargetRegistryEntries,
	collectRuntimeConfigAssignments
};
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };
