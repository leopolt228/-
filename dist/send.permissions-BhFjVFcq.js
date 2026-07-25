import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { y as parseStrictNonNegativeInteger } from "./number-coercion-Crk_c9KW.js";
import { n as extractErrorCode, r as formatErrorMessage, s as readErrorName, t as collectErrorGraphCandidates } from "./errors-DdbcjW1Y.js";
import { a as resolveRetryConfig } from "./src-DKBD8PDy.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { t as danger } from "./globals-DBBT7Ru5.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./error-runtime-DUxkdoW4.js";
import { r as makeProxyFetch } from "./proxy-fetch-CvClvqkk.js";
import "./number-runtime-C6TGSEc_.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-Dnur9SGp.js";
import "./runtime-env-BDC_axp1.js";
import "./fetch-runtime-BhlTsHq7.js";
import "./routing-C_9uWiFw.js";
import { n as createChannelApiRetryRunner } from "./retry-policy-4afimgeb.js";
import "./retry-runtime-DSaAoazp.js";
import { t as normalizeDiscordToken } from "./token-CZOLYdJL.js";
import { a as mergeDiscordAccountConfig, s as resolveDiscordAccount } from "./accounts-sZJTKxVc.js";
import { Bt as ChannelType, Et as getGuildMember, Q as getCurrentUser, Tt as getGuild, Yt as PermissionFlagsBits, ct as getChannel, g as RateLimitError, m as RequestClient, ut as getThreadMember } from "./discord-BO4_MvbK.js";
//#region extensions/discord/src/proxy-fetch.ts
function resolveDiscordProxyUrl(account, cfg) {
	const accountProxy = account.config.proxy?.trim();
	if (accountProxy) return accountProxy;
	const channelProxy = cfg?.channels?.discord?.proxy;
	if (typeof channelProxy !== "string") return;
	return channelProxy.trim() || void 0;
}
function resolveDiscordProxyFetchByUrl(proxyUrl, runtime) {
	return withValidatedDiscordProxy(proxyUrl, runtime, (proxy) => makeProxyFetch(proxy));
}
function resolveDiscordProxyFetchForAccount(account, cfg, runtime) {
	return resolveDiscordProxyFetchByUrl(resolveDiscordProxyUrl(account, cfg), runtime);
}
function withValidatedDiscordProxy(proxyUrl, runtime, createValue) {
	const proxy = proxyUrl?.trim();
	if (!proxy) return;
	try {
		validateDiscordProxyUrl(proxy);
		return createValue(proxy);
	} catch (err) {
		runtime?.error?.(danger(`discord: invalid rest proxy: ${String(err)}`));
		return;
	}
}
function validateDiscordProxyUrl(proxyUrl) {
	let parsed;
	try {
		parsed = new URL(proxyUrl);
	} catch {
		throw new Error("Proxy URL must be a valid http or https URL");
	}
	if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Proxy URL must use http or https");
	if (!parsed.hostname) throw new Error("Proxy URL must include a host");
	return proxyUrl;
}
//#endregion
//#region extensions/discord/src/monitor/gateway-registry.ts
/**
* Module-level registry of active Discord GatewayPlugin instances.
* Bridges the gap between agent tool handlers (which only have REST access)
* and the gateway WebSocket (needed for operations like updatePresence).
* Follows the same pattern as presence-cache.ts.
*/
const gatewayRegistry = /* @__PURE__ */ new Map();
const DEFAULT_ACCOUNT_KEY = "\0__default__";
function resolveAccountKey(accountId) {
	return accountId ?? DEFAULT_ACCOUNT_KEY;
}
/** Register a GatewayPlugin instance for an account. */
function registerGateway(accountId, gateway) {
	gatewayRegistry.set(resolveAccountKey(accountId), gateway);
}
/** Unregister a GatewayPlugin instance for an account. */
function unregisterGateway(accountId) {
	gatewayRegistry.delete(resolveAccountKey(accountId));
}
/** Get the GatewayPlugin for an account. Returns undefined if not registered. */
function getGateway(accountId) {
	return gatewayRegistry.get(resolveAccountKey(accountId));
}
/** Clear all registered gateways (for testing). */
function clearGateways() {
	gatewayRegistry.clear();
}
//#endregion
//#region extensions/discord/src/proxy-request-client.ts
const DISCORD_REST_TIMEOUT_MS = 15e3;
function createDiscordRequestClient(token, options) {
	if (!options?.fetch) return new RequestClient(token, options);
	return new RequestClient(token, {
		runtimeProfile: "persistent",
		maxQueueSize: 1e3,
		timeout: DISCORD_REST_TIMEOUT_MS,
		...options,
		fetch: options.fetch
	});
}
//#endregion
//#region extensions/discord/src/retry.ts
const DISCORD_RETRY_DEFAULTS = {
	attempts: 3,
	minDelayMs: 500,
	maxDelayMs: 3e4,
	jitter: .1
};
const DISCORD_GATEWAY_RECONNECT_EXTRA_ATTEMPTS = 2;
const DISCORD_RETRYABLE_STATUS_CODES = /* @__PURE__ */ new Set([408, 429]);
const DISCORD_RETRYABLE_ERROR_CODES = /* @__PURE__ */ new Set([
	"EAI_AGAIN",
	"ECONNREFUSED",
	"ECONNRESET",
	"ENETUNREACH",
	"ENOTFOUND",
	"EPIPE",
	"ETIMEDOUT",
	"UND_ERR_BODY_TIMEOUT",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_HEADERS_TIMEOUT",
	"UND_ERR_SOCKET"
]);
const DISCORD_TRANSIENT_MESSAGE_RE = /\b(?:bad gateway|fetch failed|network error|networkerror|service unavailable|socket hang up|temporarily unavailable|timed out|timeout)\b|connection (?:closed|reset|refused)/i;
const DISCORD_PRECONNECT_ERROR_CODES = /* @__PURE__ */ new Set([
	"EAI_AGAIN",
	"ECONNREFUSED",
	"ENETUNREACH",
	"ENOTFOUND",
	"UND_ERR_CONNECT_TIMEOUT"
]);
function readDiscordErrorStatus(err) {
	if (!err || typeof err !== "object") return;
	return parseStrictNonNegativeInteger("status" in err && err.status !== void 0 ? err.status : "statusCode" in err && err.statusCode !== void 0 ? err.statusCode : void 0);
}
function isRetryableDiscordTransientError(err) {
	if (err instanceof RateLimitError) return true;
	for (const candidate of collectErrorGraphCandidates(err, (current) => [current.cause, current.error])) {
		const status = readDiscordErrorStatus(candidate);
		if (status !== void 0 && (DISCORD_RETRYABLE_STATUS_CODES.has(status) || status >= 500)) return true;
		const code = extractErrorCode(candidate);
		if (code && DISCORD_RETRYABLE_ERROR_CODES.has(code.toUpperCase())) return true;
		if (readErrorName(candidate) === "AbortError") return true;
		if ((candidate instanceof Error || candidate !== null && typeof candidate === "object") && DISCORD_TRANSIENT_MESSAGE_RE.test(formatErrorMessage(candidate))) return true;
	}
	return false;
}
function isRetryableDiscordPreConnectError(err) {
	if (err instanceof RateLimitError) return true;
	for (const candidate of collectErrorGraphCandidates(err, (current) => [current.cause, current.error])) {
		if (readDiscordErrorStatus(candidate) === 429) return true;
		const code = extractErrorCode(candidate);
		if (code && DISCORD_PRECONNECT_ERROR_CODES.has(code.toUpperCase())) return true;
	}
	return false;
}
function resolveDiscordRetryPredicate(safety) {
	return safety === "non-idempotent-create" ? isRetryableDiscordPreConnectError : isRetryableDiscordTransientError;
}
function isRetryableDiscordGatewayTransportError(err) {
	if (!isRetryableDiscordTransientError(err) || err instanceof RateLimitError) return false;
	return !collectErrorGraphCandidates(err, (current) => [current.cause, current.error]).some((candidate) => readDiscordErrorStatus(candidate) !== void 0);
}
function createDiscordRetryRunner(params) {
	const retryConfig = resolveRetryConfig(DISCORD_RETRY_DEFAULTS, params.retry);
	const attempts = retryConfig.attempts > 1 ? retryConfig.attempts + DISCORD_GATEWAY_RECONNECT_EXTRA_ATTEMPTS : retryConfig.attempts;
	return (fn, label, options) => {
		const isRetryable = resolveDiscordRetryPredicate(options?.safety ?? "idempotent");
		let observedGatewayDisconnect = false;
		const runRequest = async () => {
			observedGatewayDisconnect ||= params.isGatewayDisconnected?.() === true;
			try {
				return await fn();
			} catch (err) {
				observedGatewayDisconnect ||= params.isGatewayDisconnected?.() === true;
				throw err;
			}
		};
		return createChannelApiRetryRunner({
			retry: {
				...retryConfig,
				attempts
			},
			shouldRetry: (err, attempt) => isRetryable(err) && (attempt < retryConfig.attempts || observedGatewayDisconnect && isRetryableDiscordGatewayTransportError(err)),
			strictShouldRetry: true,
			retryAfterMs: (err) => err instanceof RateLimitError ? err.retryAfter * 1e3 : void 0,
			verbose: params.verbose
		})(runRequest, label);
	};
}
//#endregion
//#region extensions/discord/src/client.ts
function createDiscordRuntimeAccountContext(params) {
	return {
		cfg: params.cfg,
		accountId: normalizeAccountId(params.accountId)
	};
}
function resolveDiscordClientAccountContext(opts, runtime) {
	const resolvedCfg = requireRuntimeConfig(opts.cfg, "Discord client");
	const account = resolveAccountWithoutToken({
		cfg: resolvedCfg,
		accountId: opts.accountId
	});
	return {
		cfg: resolvedCfg,
		account,
		proxyFetch: resolveDiscordProxyFetchForAccount(account, resolvedCfg, runtime)
	};
}
function resolveToken(params) {
	const fallback = normalizeDiscordToken(params.fallbackToken, "channels.discord.token");
	if (!fallback) {
		if (params.account.tokenStatus === "configured_unavailable") throw new Error(`Discord bot token configured for account "${params.accountId}" is unavailable; resolve SecretRefs against the active runtime snapshot before using this account.`);
		throw new Error(`Discord bot token missing for account "${params.accountId}" (set discord.accounts.${params.accountId}.token or DISCORD_BOT_TOKEN for default).`);
	}
	return fallback;
}
function resolveRest(token, account, cfg, rest, proxyFetch, signal, timeoutMs) {
	if (rest) return rest;
	const resolvedProxyFetch = proxyFetch ?? resolveDiscordProxyFetchForAccount(account, cfg);
	return createDiscordRequestClient(token, {
		...resolvedProxyFetch ? { fetch: resolvedProxyFetch } : {},
		...signal ? { signal } : {},
		...timeoutMs !== void 0 ? { timeout: timeoutMs } : {}
	});
}
function resolveAccountWithoutToken(params) {
	const accountId = normalizeAccountId(params.accountId);
	const merged = mergeDiscordAccountConfig(params.cfg, accountId);
	const baseEnabled = params.cfg.channels?.discord?.enabled !== false;
	const accountEnabled = merged.enabled !== false;
	return {
		accountId,
		enabled: baseEnabled && accountEnabled,
		name: normalizeOptionalString(merged.name),
		token: "",
		tokenSource: "none",
		tokenStatus: "missing",
		config: merged
	};
}
function createDiscordRestClient(opts) {
	const explicitToken = normalizeDiscordToken(opts.token, "channels.discord.token");
	const proxyContext = resolveDiscordClientAccountContext(opts);
	const resolvedCfg = proxyContext.cfg;
	const account = explicitToken ? proxyContext.account : resolveDiscordAccount({
		cfg: resolvedCfg,
		accountId: opts.accountId
	});
	const token = explicitToken ?? resolveToken({
		account,
		accountId: account.accountId,
		fallbackToken: account.token
	});
	return {
		token,
		rest: resolveRest(token, account, resolvedCfg, opts.rest, proxyContext.proxyFetch, opts.signal, opts.timeoutMs),
		account
	};
}
function createDiscordClient(opts) {
	const { token, rest, account } = createDiscordRestClient(opts);
	return {
		token,
		rest,
		request: createDiscordRetryRunner({
			retry: opts.retry,
			verbose: opts.verbose,
			isGatewayDisconnected: () => {
				const gateway = getGateway(account.accountId);
				return gateway !== void 0 && !gateway.isConnected;
			}
		})
	};
}
function resolveDiscordRest(opts) {
	return createDiscordRestClient(opts).rest;
}
//#endregion
//#region extensions/discord/src/send.permissions.ts
const PERMISSION_ENTRIES = Object.entries(PermissionFlagsBits).filter(([, value]) => typeof value === "bigint");
const ALL_PERMISSIONS = PERMISSION_ENTRIES.reduce((acc, [, value]) => acc | value, 0n);
const ADMINISTRATOR_BIT = PermissionFlagsBits.Administrator;
function addPermissionBits(base, add) {
	if (!add) return base;
	return base | BigInt(add);
}
function removePermissionBits(base, deny) {
	if (!deny) return base;
	return base & ~BigInt(deny);
}
function bitfieldToPermissions(bitfield) {
	return PERMISSION_ENTRIES.filter(([, value]) => (bitfield & value) === value).map(([name]) => name).toSorted();
}
function hasAdministrator(bitfield) {
	return (bitfield & ADMINISTRATOR_BIT) === ADMINISTRATOR_BIT;
}
function hasPermissionBit(bitfield, permission) {
	return (bitfield & permission) === permission;
}
function isThreadChannelType(channelType) {
	return channelType === ChannelType.GuildNewsThread || channelType === ChannelType.GuildPublicThread || channelType === ChannelType.GuildPrivateThread;
}
async function fetchBotUserId(rest) {
	const me = await getCurrentUser(rest);
	if (!me?.id) throw new Error("Failed to resolve bot user id");
	return me.id;
}
function resolveMemberGuildPermissionBits(params) {
	const rolesByIdLocal = new Map((params.guild.roles ?? []).map((role) => [role.id, role]));
	const everyoneRole = rolesByIdLocal.get(params.guild.id);
	let permissions = 0n;
	if (everyoneRole?.permissions) permissions = addPermissionBits(permissions, everyoneRole.permissions);
	for (const roleId of params.member.roles ?? []) {
		const role = rolesByIdLocal.get(roleId);
		if (role?.permissions) permissions = addPermissionBits(permissions, role.permissions);
	}
	return permissions;
}
function rolesById(guild) {
	return new Map((guild.roles ?? []).map((role) => [role.id, role]));
}
function rolePosition(role) {
	return typeof role?.position === "number" ? role.position : -1;
}
function highestMemberRolePosition(guild, member) {
	const roles = rolesById(guild);
	return Math.max(...(member.roles ?? []).map((roleId) => rolePosition(roles.get(roleId))), 0);
}
function resolveMemberChannelPermissionBits(params) {
	let permissions = resolveMemberGuildPermissionBits({
		guild: params.guild,
		member: params.member
	});
	if (hasAdministrator(permissions)) return ALL_PERMISSIONS;
	const overwrites = "permission_overwrites" in params.channel ? params.channel.permission_overwrites ?? [] : [];
	for (const overwrite of overwrites) if (overwrite.id === params.guildId) {
		permissions = removePermissionBits(permissions, overwrite.deny ?? "0");
		permissions = addPermissionBits(permissions, overwrite.allow ?? "0");
	}
	let roleDeny = 0n;
	let roleAllow = 0n;
	for (const overwrite of overwrites) if (params.member.roles?.includes(overwrite.id)) {
		roleDeny = addPermissionBits(roleDeny, overwrite.deny ?? "0");
		roleAllow = addPermissionBits(roleAllow, overwrite.allow ?? "0");
	}
	permissions = permissions & ~roleDeny;
	permissions = permissions | roleAllow;
	for (const overwrite of overwrites) if (overwrite.id === params.userId) {
		permissions = removePermissionBits(permissions, overwrite.deny ?? "0");
		permissions = addPermissionBits(permissions, overwrite.allow ?? "0");
	}
	return permissions;
}
async function resolveChannelPermissionSubject(rest, channel) {
	const channelType = "type" in channel ? channel.type : void 0;
	const parentId = "parent_id" in channel ? channel.parent_id : void 0;
	if (isThreadChannelType(channelType) && parentId) return await getChannel(rest, parentId);
	return channel;
}
/**
* Fetch guild-level permissions for a user. This does not include channel-specific overwrites.
*/
async function fetchMemberGuildPermissionsDiscord(guildId, userId, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		const [guild, member] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, userId)]);
		if (guild.owner_id === userId) return ALL_PERMISSIONS;
		return resolveMemberGuildPermissionBits({
			guild,
			member
		});
	} catch {
		return null;
	}
}
async function canViewDiscordGuildChannel(guildId, channelId, userId, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		const channel = await getChannel(rest, channelId);
		const permissionChannel = await resolveChannelPermissionSubject(rest, channel);
		if (("guild_id" in permissionChannel ? permissionChannel.guild_id : void 0) !== guildId) return false;
		const [guild, member] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, userId)]);
		if (guild.owner_id === userId) return true;
		const permissions = resolveMemberChannelPermissionBits({
			guildId,
			userId,
			guild,
			member,
			channel: permissionChannel
		});
		if (!hasPermissionBit(permissions, PermissionFlagsBits.ViewChannel)) return false;
		if ("type" in channel && channel.type === ChannelType.GuildPrivateThread) {
			if (hasPermissionBit(permissions, PermissionFlagsBits.ManageThreads)) return true;
			await getThreadMember(rest, channel.id, userId);
		}
		return true;
	} catch {
		return false;
	}
}
/**
* Returns true when the user has ADMINISTRATOR or any required permission bit
* after applying channel/category overwrites.
*/
async function hasAnyChannelPermissionDiscord(guildId, channelId, userId, requiredPermissions, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		const permissionChannel = await resolveChannelPermissionSubject(rest, await getChannel(rest, channelId));
		if (("guild_id" in permissionChannel ? permissionChannel.guild_id : void 0) !== guildId) return false;
		const [guild, member] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, userId)]);
		if (guild.owner_id === userId) return true;
		const permissions = resolveMemberChannelPermissionBits({
			guildId,
			userId,
			guild,
			member,
			channel: permissionChannel
		});
		return requiredPermissions.some((permission) => hasPermissionBit(permissions, permission));
	} catch {
		return false;
	}
}
async function canManageGuildMemberRoleDiscord(guildId, senderUserId, targetUserId, roleId, opts, requirements) {
	const rest = resolveDiscordRest(opts);
	try {
		const [guild, senderMember, targetMember] = await Promise.all([
			getGuild(rest, guildId),
			getGuildMember(rest, guildId, senderUserId),
			getGuildMember(rest, guildId, targetUserId)
		]);
		if (guild.owner_id === senderUserId) return true;
		if (guild.owner_id === targetUserId) return false;
		const targetRole = rolesById(guild).get(roleId);
		const targetRolePosition = rolePosition(targetRole);
		if (targetRolePosition < 0) return false;
		const senderPermissions = resolveMemberGuildPermissionBits({
			guild,
			member: senderMember
		});
		if (requirements?.assignablePermissionCeiling && !hasAdministrator(senderPermissions) && (BigInt(targetRole?.permissions ?? "0") & ~senderPermissions) !== 0n) return false;
		const senderHighestRolePosition = highestMemberRolePosition(guild, senderMember);
		if (senderHighestRolePosition <= targetRolePosition) return false;
		return senderHighestRolePosition > highestMemberRolePosition(guild, targetMember);
	} catch {
		return false;
	}
}
async function canManageGuildRoleDiscord(guildId, senderUserId, roleId, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		const [guild, senderMember] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, senderUserId)]);
		const targetRole = rolesById(guild).get(roleId);
		if (!targetRole) return null;
		if (guild.owner_id === senderUserId) return true;
		return highestMemberRolePosition(guild, senderMember) > rolePosition(targetRole);
	} catch {
		return false;
	}
}
/**
* Returns true when the user has ADMINISTRATOR or required permission bits
* matching the provided predicate.
*/
async function hasGuildPermissionsDiscord(guildId, userId, requiredPermissions, check, opts) {
	const permissions = await fetchMemberGuildPermissionsDiscord(guildId, userId, opts);
	if (permissions === null) return false;
	if (hasAdministrator(permissions)) return true;
	return check(permissions, requiredPermissions);
}
/**
* Returns true when the user has ADMINISTRATOR or any required permission bit.
*/
async function hasAnyGuildPermissionDiscord(guildId, userId, requiredPermissions, opts) {
	return await hasGuildPermissionsDiscord(guildId, userId, requiredPermissions, (permissions, required) => required.some((permission) => hasPermissionBit(permissions, permission)), opts);
}
/**
* Returns true when the user has ADMINISTRATOR or all required permission bits.
*/
async function hasAllGuildPermissionsDiscord(guildId, userId, requiredPermissions, opts) {
	return await hasGuildPermissionsDiscord(guildId, userId, requiredPermissions, (permissions, required) => required.every((permission) => hasPermissionBit(permissions, permission)), opts);
}
async function fetchChannelPermissionsDiscord(channelId, opts) {
	opts.signal?.throwIfAborted();
	const rest = resolveDiscordRest(opts);
	const channel = await getChannel(rest, channelId);
	opts.signal?.throwIfAborted();
	const channelType = "type" in channel ? channel.type : void 0;
	const guildId = "guild_id" in channel ? channel.guild_id : void 0;
	if (!guildId) return {
		channelId,
		permissions: [],
		raw: "0",
		isDm: true,
		channelType
	};
	const botId = await fetchBotUserId(rest);
	opts.signal?.throwIfAborted();
	const [guild, member] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, botId)]);
	opts.signal?.throwIfAborted();
	const permissions = resolveMemberChannelPermissionBits({
		guildId,
		userId: botId,
		guild,
		member,
		channel
	});
	return {
		channelId,
		guildId,
		permissions: bitfieldToPermissions(permissions),
		raw: permissions.toString(),
		isDm: false,
		channelType
	};
}
//#endregion
export { withValidatedDiscordProxy as S, getGateway as _, fetchMemberGuildPermissionsDiscord as a, resolveDiscordProxyFetchForAccount as b, hasAnyGuildPermissionDiscord as c, createDiscordRestClient as d, createDiscordRuntimeAccountContext as f, clearGateways as g, DISCORD_REST_TIMEOUT_MS as h, fetchChannelPermissionsDiscord as i, isThreadChannelType as l, resolveDiscordRest as m, canManageGuildRoleDiscord as n, hasAllGuildPermissionsDiscord as o, resolveDiscordClientAccountContext as p, canViewDiscordGuildChannel as r, hasAnyChannelPermissionDiscord as s, canManageGuildMemberRoleDiscord as t, createDiscordClient as u, registerGateway as v, validateDiscordProxyUrl as x, unregisterGateway as y };
