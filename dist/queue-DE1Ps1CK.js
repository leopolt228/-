import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { n as resolveGlobalDedupeCache } from "./dedupe-B6TWTYv8.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import { n as channelRouteDedupeKey } from "./channel-route-SmMUmIL9.js";
import { n as getLoadedChannelPlugin } from "./registry-DqyhCDsQ.js";
import "./plugins-CJcRWm9n.js";
import { t as resolveQueueSettings$1 } from "./settings-w2c261hm.js";
import { T as shouldSkipQueueItem, a as getFollowupQueue, d as isFollowupRunAborted, g as applyQueueDropPolicy, i as getExistingFollowupQueue, p as markFollowupRunEnqueued, s as trimSummaryElisionsToCap, u as completeFollowupRunLifecycle, y as countPendingQueueItems } from "./state-CVJHx3xa.js";
import { a as resolveFollowupDeliveryContextKey, i as rememberFollowupDrainCallback, n as createOverflowSummaryRetrySource, o as resolveFollowupReplyAnchor, r as kickFollowupDrainIfIdle } from "./cleanup-l49uocqk.js";
//#region src/auto-reply/reply/queue/enqueue.ts
const RECENT_QUEUE_MESSAGE_IDS = resolveGlobalDedupeCache(Symbol.for("openclaw.recentQueueMessageIds"), {
	ttlMs: 300 * 1e3,
	maxSize: 1e4
});
function followupRouteIdentityKey(run) {
	return JSON.stringify([
		channelRouteDedupeKey({
			channel: run.originatingChannel,
			to: run.originatingTo,
			accountId: run.originatingAccountId,
			threadId: run.originatingThreadId
		}),
		resolveFollowupReplyAnchor(run) ?? "",
		run.originatingReplyToMode ?? "",
		normalizeChatType(run.originatingChatType) ?? ""
	]);
}
function followupMessageRouteIdentityKey(run) {
	return JSON.stringify([channelRouteDedupeKey({
		channel: run.originatingChannel,
		to: run.originatingTo,
		accountId: run.originatingAccountId,
		threadId: run.originatingThreadId
	}), normalizeChatType(run.originatingChatType) ?? ""]);
}
function buildRecentMessageIdKey(run, queueKey) {
	const messageId = normalizeOptionalString(run.messageId);
	if (!messageId) return;
	return JSON.stringify([
		"queue",
		queueKey,
		followupMessageRouteIdentityKey(run),
		messageId
	]);
}
function isRunAlreadyQueued(run, items, allowPromptFallback = false) {
	const messageId = normalizeOptionalString(run.messageId);
	if (messageId) {
		const messageRouteKey = followupMessageRouteIdentityKey(run);
		return items.some((item) => normalizeOptionalString(item.messageId) === messageId && followupMessageRouteIdentityKey(item) === messageRouteKey);
	}
	if (!allowPromptFallback) return false;
	const routeKey = followupRouteIdentityKey(run);
	return items.some((item) => item.prompt === run.prompt && followupRouteIdentityKey(item) === routeKey);
}
function enqueueFollowupRun(key, run, settings, dedupeMode = "message-id", runFollowup, restartIfIdle = true, options = {}) {
	if (isFollowupRunAborted(run)) return false;
	if (options.position === "front") run.protectFromQueueOverflow = true;
	const queue = getFollowupQueue(key, settings);
	const recentMessageIdKey = dedupeMode !== "none" ? buildRecentMessageIdKey(run, key) : void 0;
	if (recentMessageIdKey && RECENT_QUEUE_MESSAGE_IDS.peek(recentMessageIdKey)) return false;
	const dedupe = dedupeMode === "none" ? void 0 : (item, items) => isRunAlreadyQueued(item, items, dedupeMode === "prompt");
	if (shouldSkipQueueItem({
		item: run,
		items: queue.items,
		dedupe
	})) return false;
	const pendingCount = countPendingQueueItems(queue.items, queue.inFlight);
	if (queue.dropPolicy === "new" && queue.cap > 0 && pendingCount >= queue.cap) {
		completeFollowupRunLifecycle(run);
		return false;
	}
	if (!markFollowupRunEnqueued(run)) return false;
	const shouldEnqueue = applyQueueDropPolicy({
		queue,
		inFlight: queue.inFlight,
		summarize: (item) => normalizeOptionalString(item.summaryLine) || item.prompt.trim(),
		onDrop: (dropped) => {
			if (queue.dropPolicy === "summarize") {
				queue.summarySources.push(...dropped);
				return;
			}
			for (const item of dropped) completeFollowupRunLifecycle(item);
		},
		isProtected: (item) => item.protectFromQueueOverflow === true
	});
	if (queue.dropPolicy === "summarize") {
		const overflow = queue.summarySources.length - queue.summaryLines.length;
		if (overflow > 0) {
			const removed = queue.summarySources.splice(0, overflow);
			for (const item of removed) {
				const contextKey = resolveFollowupDeliveryContextKey(item);
				const lastElision = queue.summaryElisions.at(-1);
				if (lastElision?.contextKey === contextKey) {
					const compactSource = createOverflowSummaryRetrySource(item);
					lastElision.count += 1;
					lastElision.sources.push(compactSource);
					lastElision.sourceRefs.set(item, compactSource);
					if (queue.activeSummarySources.has(item)) queue.activeSummarySources.add(compactSource);
				} else {
					const compactSource = createOverflowSummaryRetrySource(item);
					queue.summaryElisions.push({
						contextKey,
						count: 1,
						sources: [compactSource],
						sourceRefs: new WeakMap([[item, compactSource]])
					});
					if (queue.activeSummarySources.has(item)) queue.activeSummarySources.add(compactSource);
				}
				trimSummaryElisionsToCap(queue);
			}
		}
	}
	if (!shouldEnqueue) {
		completeFollowupRunLifecycle(run);
		return false;
	}
	queue.lastEnqueuedAt = Date.now();
	queue.lastRun = run.run;
	run.queueAbortSignal = queue.abortController.signal;
	if (options.position === "front") queue.items.unshift(run);
	else queue.items.push(run);
	if (recentMessageIdKey) RECENT_QUEUE_MESSAGE_IDS.check(recentMessageIdKey);
	if (runFollowup) rememberFollowupDrainCallback(key, runFollowup);
	if (restartIfIdle && !queue.draining) kickFollowupDrainIfIdle(key);
	return true;
}
function getFollowupQueueDepth(key) {
	const queue = getExistingFollowupQueue(key);
	if (!queue) return 0;
	return countPendingQueueItems(queue.items, queue.inFlight);
}
function resetRecentQueuedMessageIdDedupe() {
	RECENT_QUEUE_MESSAGE_IDS.clear();
}
if (process.env.VITEST === "true" || false) globalThis[Symbol.for("openclaw.queueEnqueueTestApi")] = { resetRecentQueuedMessageIdDedupe };
//#endregion
//#region src/auto-reply/reply/queue/settings-runtime.ts
/** Resolves plugin-provided debounce defaults for a channel queue. */
function resolvePluginDebounce(channelKey) {
	if (!channelKey) return;
	const value = getLoadedChannelPlugin(channelKey)?.defaults?.queue?.debounceMs;
	return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : void 0;
}
/** Resolves queue settings with channel plugin defaults layered into core config. */
function resolveQueueSettings(params) {
	const channelKey = normalizeOptionalLowercaseString(params.channel);
	return resolveQueueSettings$1({
		...params,
		pluginDebounceMs: params.pluginDebounceMs ?? resolvePluginDebounce(channelKey)
	});
}
//#endregion
export { enqueueFollowupRun as n, getFollowupQueueDepth as r, resolveQueueSettings as t };
