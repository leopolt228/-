import { t as requireRuntimeConfig } from "./plugin-config-runtime-Dnur9SGp.js";
import { $ as createOwnMessageReaction, et as deleteOwnMessageReaction, gt as sendChannelTyping, lt as getChannelMessage, tt as listMessageReactionUsers } from "./discord-BO4_MvbK.js";
import { m as resolveDiscordRest, u as createDiscordClient } from "./send.permissions-BhFjVFcq.js";
import { i as formatReactionEmoji, r as buildReactionIdentifier, s as normalizeReactionEmoji } from "./send.shared-p57jtR08.js";
//#region extensions/discord/src/send.typing.ts
async function sendTypingDiscord(channelId, opts) {
	await sendChannelTyping(resolveDiscordRest(opts), channelId);
	return {
		ok: true,
		channelId
	};
}
//#endregion
//#region extensions/discord/src/send.reactions.ts
function createDiscordReactionRuntimeClient(opts) {
	return createDiscordClient(opts);
}
function resolveDiscordReactionClient(opts) {
	if (!opts.cfg) throw new Error("Discord reactions requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const cfg = requireRuntimeConfig(opts.cfg, "Discord reactions");
	return createDiscordClient({
		...opts,
		cfg
	});
}
function isDiscordReactionRuntimeContext(opts) {
	return Boolean(opts.rest && opts.cfg && opts.accountId);
}
async function reactMessageDiscord(channelId, messageId, emoji, opts) {
	const { rest, request } = isDiscordReactionRuntimeContext(opts) ? createDiscordReactionRuntimeClient(opts) : resolveDiscordReactionClient(opts);
	const encoded = normalizeReactionEmoji(emoji);
	await request(() => createOwnMessageReaction(rest, channelId, messageId, encoded), "react");
	return { ok: true };
}
async function removeReactionDiscord(channelId, messageId, emoji, opts) {
	const { rest } = isDiscordReactionRuntimeContext(opts) ? createDiscordReactionRuntimeClient(opts) : resolveDiscordReactionClient(opts);
	await deleteOwnMessageReaction(rest, channelId, messageId, normalizeReactionEmoji(emoji));
	return { ok: true };
}
async function removeOwnReactionsDiscord(channelId, messageId, opts) {
	const { rest } = isDiscordReactionRuntimeContext(opts) ? createDiscordReactionRuntimeClient(opts) : resolveDiscordReactionClient(opts);
	const message = await getChannelMessage(rest, channelId, messageId);
	const identifiers = /* @__PURE__ */ new Set();
	for (const reaction of message.reactions ?? []) {
		const identifier = buildReactionIdentifier(reaction.emoji);
		if (identifier) identifiers.add(identifier);
	}
	if (identifiers.size === 0) return {
		ok: true,
		removed: []
	};
	const removed = Array.from(identifiers);
	await Promise.all(removed.map((identifier) => deleteOwnMessageReaction(rest, channelId, messageId, normalizeReactionEmoji(identifier))));
	return {
		ok: true,
		removed
	};
}
async function fetchReactionsDiscord(channelId, messageId, opts) {
	const { rest } = isDiscordReactionRuntimeContext(opts) ? createDiscordReactionRuntimeClient(opts) : resolveDiscordReactionClient(opts);
	const reactions = (await getChannelMessage(rest, channelId, messageId)).reactions ?? [];
	if (reactions.length === 0) return [];
	const limit = typeof opts.limit === "number" && Number.isFinite(opts.limit) ? Math.min(Math.max(Math.floor(opts.limit), 1), 100) : 100;
	const summaries = [];
	for (const reaction of reactions) {
		const identifier = buildReactionIdentifier(reaction.emoji);
		if (!identifier) continue;
		const users = await listMessageReactionUsers(rest, channelId, messageId, encodeURIComponent(identifier), { limit });
		summaries.push({
			emoji: {
				id: reaction.emoji.id ?? null,
				name: reaction.emoji.name ?? null,
				raw: formatReactionEmoji(reaction.emoji)
			},
			count: reaction.count,
			users: users.map((user) => ({
				id: user.id,
				username: user.username,
				tag: user.username && user.discriminator ? `${user.username}#${user.discriminator}` : user.username
			}))
		});
	}
	return summaries;
}
//#endregion
export { sendTypingDiscord as a, removeReactionDiscord as i, reactMessageDiscord as n, removeOwnReactionsDiscord as r, fetchReactionsDiscord as t };
