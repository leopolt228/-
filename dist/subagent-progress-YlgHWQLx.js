import { l as normalizeOptionalStringifiedId, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import { i as DEFAULT_EMOJIS } from "./channel-feedback-DUquyVcz.js";
import { s as resolveDiscordAccount } from "./accounts-sZJTKxVc.js";
import { a as sendTypingDiscord, i as removeReactionDiscord, n as reactMessageDiscord } from "./send.reactions-ArbA4fU1.js";
//#region extensions/discord/src/subagent-progress-config.ts
const RUNNING_EMOJIS = [
	"1️⃣",
	"2️⃣",
	"3️⃣",
	"4️⃣",
	"5️⃣",
	"6️⃣",
	"7️⃣",
	"8️⃣",
	"9️⃣",
	"🔟"
];
function channelIdFromTarget(target) {
	const trimmed = target?.trim();
	if (!trimmed) return;
	if (trimmed.startsWith("channel:")) return trimmed.slice(8).trim() || void 0;
	return /^\d+$/u.test(trimmed) ? trimmed : void 0;
}
function resolveDiscordProgressTarget(requester) {
	if (normalizeOptionalLowercaseString(requester?.channel) !== "discord") return;
	const channelId = normalizeOptionalStringifiedId(requester?.channelId) ?? channelIdFromTarget(requester?.to);
	const messageId = normalizeOptionalStringifiedId(requester?.messageId);
	if (!channelId || !messageId) return;
	return {
		channelId,
		messageId
	};
}
function reservedReactionEmojis(config, ackReaction) {
	const reserved = new Set(Object.values(DEFAULT_EMOJIS));
	for (const emoji of Object.values(config.messages?.statusReactions?.emojis ?? {})) if (emoji?.trim()) reserved.add(emoji.trim());
	for (const emoji of [config.messages?.ackReaction, ackReaction]) if (emoji?.trim()) reserved.add(emoji.trim());
	for (const agent of config.agents?.list ?? []) {
		const emoji = agent.identity?.emoji?.trim();
		if (emoji) reserved.add(emoji);
	}
	return reserved;
}
function reactionsAreAvailable(config, ackReaction) {
	const reserved = reservedReactionEmojis(config, ackReaction);
	return !RUNNING_EMOJIS.some((emoji) => reserved.has(emoji)) && !reserved.has("🔴");
}
//#endregion
//#region extensions/discord/src/subagent-progress-state.ts
const PROGRESS_STORE_TTL_MS = 10080 * 6e4;
const MAX_TRACKED_RUNS = 4096;
const TERMINAL_TOMBSTONE_TTL_MS = 60 * 6e4;
function persistedTerminalOutcome(persisted) {
	return persisted?.status === "cleanup" ? persisted.outcome : void 0;
}
let progressStores = /* @__PURE__ */ new WeakMap();
const trackerQueues = /* @__PURE__ */ new Map();
const terminalRuns = /* @__PURE__ */ new Map();
function markRunTerminal(runId, outcome) {
	const now = Date.now();
	for (const [trackedRunId, terminal] of terminalRuns) if (terminal.expiresAt <= now) terminalRuns.delete(trackedRunId);
	terminalRuns.set(runId, {
		expiresAt: now + TERMINAL_TOMBSTONE_TTL_MS,
		outcome
	});
	if (terminalRuns.size > 4096) {
		const oldest = terminalRuns.keys().next().value;
		if (oldest) terminalRuns.delete(oldest);
	}
}
function terminalOutcome(runId) {
	const terminal = terminalRuns.get(runId);
	if (!terminal) return;
	if (terminal.expiresAt <= Date.now()) {
		terminalRuns.delete(runId);
		return;
	}
	return terminal.outcome;
}
function logFailure(api, action, error) {
	const message = error instanceof Error ? error.message : String(error);
	api.logger.debug?.(`discord subagent progress ${action} failed: ${message}`);
}
function getProgressStore(api) {
	const cached = progressStores.get(api);
	if (cached !== void 0) return cached ?? void 0;
	if (!api.runtime?.state) {
		progressStores.set(api, null);
		return;
	}
	try {
		const store = api.runtime.state.openKeyedStore({
			namespace: "subagent-progress",
			maxEntries: MAX_TRACKED_RUNS,
			overflowPolicy: "reject-new",
			defaultTtlMs: PROGRESS_STORE_TTL_MS
		});
		progressStores.set(api, store);
		return store;
	} catch (error) {
		logFailure(api, "state store open", error);
		return;
	}
}
function persistedProgressRunFromTracker(tracker) {
	return {
		key: `${tracker.accountId}:${tracker.channelId}:${tracker.messageId}`,
		accountId: tracker.accountId,
		channelId: tracker.channelId,
		messageId: tracker.messageId,
		status: "active",
		...tracker.runningEmoji ? { runningEmoji: tracker.runningEmoji } : {}
	};
}
async function persistProgressRun(api, runId, tracker) {
	const store = getProgressStore(api);
	if (!store) return "error";
	const value = persistedProgressRunFromTracker(tracker);
	try {
		if (await store.registerIfAbsent(runId, value)) return "persisted";
		const existing = await store.lookup(runId);
		if (!existing) return "error";
		if (existing.status === "cleanup") return "terminal";
		return existing.key === value.key ? "persisted" : "conflict";
	} catch (error) {
		logFailure(api, "state store write", error);
		return "error";
	}
}
async function markProgressRunForCleanup(api, runId, persisted, outcome) {
	try {
		await getProgressStore(api)?.register(runId, {
			...persisted,
			status: "cleanup",
			outcome
		});
		return true;
	} catch (error) {
		logFailure(api, "state store cleanup mark", error);
		return false;
	}
}
async function lookupProgressRun(api, runId) {
	const store = getProgressStore(api);
	if (!store) return { status: "error" };
	try {
		const value = await store.lookup(runId);
		return value ? {
			status: "found",
			value
		} : { status: "missing" };
	} catch (error) {
		logFailure(api, "state store read", error);
		return { status: "error" };
	}
}
async function consumeProgressRun(api, runId) {
	try {
		return await getProgressStore(api)?.consume(runId);
	} catch (error) {
		logFailure(api, "state store consume", error);
		return;
	}
}
async function listProgressStateForKey(api, key) {
	const store = getProgressStore(api);
	if (!store) return { ok: false };
	try {
		const matching = (await store.entries()).filter((entry) => entry.value.key === key);
		const cleanupRuns = matching.flatMap((entry) => entry.value.status === "cleanup" ? [{
			runId: entry.key,
			value: entry.value
		}] : []);
		return {
			ok: true,
			activeRunIds: matching.filter((entry) => entry.value.status === "active").map((entry) => entry.key),
			cleanupRuns,
			ownedEmojis: Array.from(new Set(matching.flatMap((entry) => entry.value.runningEmoji ?? [])))
		};
	} catch (error) {
		logFailure(api, "state store list", error);
		return { ok: false };
	}
}
async function runQueued(key, task) {
	const current = (trackerQueues.get(key) ?? Promise.resolve()).catch(() => void 0).then(task);
	trackerQueues.set(key, current);
	try {
		await current;
	} finally {
		if (trackerQueues.get(key) === current) trackerQueues.delete(key);
	}
}
function resetDiscordSubagentProgressStateForTest() {
	trackerQueues.clear();
	terminalRuns.clear();
	progressStores = /* @__PURE__ */ new WeakMap();
}
//#endregion
//#region extensions/discord/src/subagent-progress.ts
const TYPING_INTERVAL_MS = 8500;
const TYPING_TTL_MS = 60 * 6e4;
const TERMINAL_LOOKUP_RETRY_MS = 1e3;
const TERMINAL_RETRY_MAX_DELAY_MS = 60 * 6e4;
const TERMINAL_RETRY_MAX_ATTEMPTS = 12;
const STARTUP_RETRY_MAX_ATTEMPTS = 12;
const trackers = /* @__PURE__ */ new Map();
const trackerKeyByRunId = /* @__PURE__ */ new Map();
const terminalRetryTimers = /* @__PURE__ */ new Map();
const terminalRetryExpiresAt = /* @__PURE__ */ new Map();
const terminalRetryAttempts = /* @__PURE__ */ new Map();
const startupRecoveryRetries = /* @__PURE__ */ new Map();
function clearTerminalRetry(runId) {
	const timer = terminalRetryTimers.get(runId);
	if (timer) clearTimeout(timer);
	terminalRetryTimers.delete(runId);
	terminalRetryExpiresAt.delete(runId);
	terminalRetryAttempts.delete(runId);
}
function cancelTerminalRetryTimer(runId) {
	const timer = terminalRetryTimers.get(runId);
	if (timer) clearTimeout(timer);
	terminalRetryTimers.delete(runId);
}
async function setReaction(api, tracker, emoji) {
	try {
		return (await reactMessageDiscord(tracker.channelId, tracker.messageId, emoji, {
			cfg: api.config,
			accountId: tracker.accountId
		})).ok;
	} catch (error) {
		logFailure(api, "reaction add", error);
		return false;
	}
}
async function clearReaction(api, tracker, emoji) {
	if (!emoji) return true;
	try {
		return (await removeReactionDiscord(tracker.channelId, tracker.messageId, emoji, {
			cfg: api.config,
			accountId: tracker.accountId
		})).ok;
	} catch (error) {
		logFailure(api, "reaction remove", error);
		return false;
	}
}
async function clearRunningReactions(api, tracker, emojis) {
	return (await Promise.all(emojis.map((emoji) => clearReaction(api, tracker, emoji)))).every(Boolean);
}
async function persistTrackerRunningEmoji(api, tracker) {
	const store = getProgressStore(api);
	if (!store) return false;
	try {
		await Promise.all(Array.from(tracker.persistedRunIds, (runId) => store.register(runId, persistedProgressRunFromTracker(tracker))));
		return true;
	} catch (error) {
		logFailure(api, "reaction ownership write", error);
		return false;
	}
}
async function updateRunningReaction(api, tracker) {
	if (!tracker.reactionsEnabled) return true;
	const nextEmoji = tracker.activeRunIds.size > 0 ? RUNNING_EMOJIS[Math.min(tracker.activeRunIds.size, RUNNING_EMOJIS.length) - 1] : void 0;
	if (nextEmoji === tracker.runningEmoji) {
		if (!nextEmoji || tracker.runningEmojiConfirmed) return true;
		if (!await persistTrackerRunningEmoji(api, tracker)) return false;
		tracker.runningEmojiConfirmed = await setReaction(api, tracker, nextEmoji);
		return tracker.runningEmojiConfirmed;
	}
	if (!await clearReaction(api, tracker, tracker.runningEmoji)) return false;
	tracker.runningEmoji = void 0;
	tracker.runningEmojiConfirmed = false;
	if (nextEmoji) {
		tracker.runningEmoji = nextEmoji;
		if (!await persistTrackerRunningEmoji(api, tracker)) {
			tracker.runningEmoji = void 0;
			return false;
		}
		tracker.runningEmojiConfirmed = await setReaction(api, tracker, nextEmoji);
		return tracker.runningEmojiConfirmed;
	}
	await persistTrackerRunningEmoji(api, tracker);
	return true;
}
async function disableTrackerReactionsOnCollision(api, tracker, ackReaction) {
	if (!tracker.reactionsEnabled || reactionsAreAvailable(api.config, ackReaction)) return true;
	const reserved = reservedReactionEmojis(api.config, ackReaction);
	if (tracker.runningEmoji && !reserved.has(tracker.runningEmoji)) {
		if (!await clearReaction(api, tracker, tracker.runningEmoji)) {
			tracker.reactionsEnabled = false;
			return false;
		}
	}
	tracker.runningEmoji = void 0;
	tracker.runningEmojiConfirmed = false;
	tracker.reactionsEnabled = false;
	await persistTrackerRunningEmoji(api, tracker);
	return true;
}
async function sendTyping(api, tracker) {
	try {
		await sendTypingDiscord(tracker.channelId, {
			cfg: api.config,
			accountId: tracker.accountId
		});
	} catch (error) {
		logFailure(api, "typing", error);
	}
}
function startTyping(api, tracker) {
	tracker.typingExpiresAt = Date.now() + TYPING_TTL_MS;
	sendTyping(api, tracker);
	if (tracker.typingTimer) return;
	tracker.typingTimer = setInterval(() => {
		if (tracker.activeRunIds.size === 0 || Date.now() >= tracker.typingExpiresAt) {
			stopTyping(tracker);
			return;
		}
		sendTyping(api, tracker);
	}, TYPING_INTERVAL_MS);
	tracker.typingTimer.unref?.();
}
function stopTyping(tracker) {
	if (tracker.typingTimer) {
		clearInterval(tracker.typingTimer);
		tracker.typingTimer = void 0;
	}
}
async function handleStarted(api, event) {
	const runId = event.runId.trim();
	const target = resolveDiscordProgressTarget(event.requester);
	if (!runId || !target || terminalOutcome(runId)) return;
	const account = resolveDiscordAccount({
		cfg: api.config,
		accountId: event.requester?.accountId
	});
	const key = `${account.accountId}:${target.channelId}:${target.messageId}`;
	if (!account.enabled || account.config.subagentProgress !== true) {
		await runQueued(key, async () => {
			const tracker = trackers.get(key);
			if (!tracker) return;
			stopTyping(tracker);
			tracker.reactionsEnabled = false;
			if (!account.enabled || !tracker.runningEmoji) return;
			if (!reservedReactionEmojis(api.config, account.config.ackReaction).has(tracker.runningEmoji) && await clearReaction(api, tracker, tracker.runningEmoji)) {
				tracker.runningEmoji = void 0;
				tracker.runningEmojiConfirmed = false;
				await persistTrackerRunningEmoji(api, tracker);
			}
		});
		return;
	}
	await runQueued(key, async () => {
		let tracker = trackers.get(key);
		let restoredCurrentRunWasTerminal = false;
		if (!tracker) {
			const reactionsEnabled = reactionsAreAvailable(api.config, account.config.ackReaction);
			const restored = await listProgressStateForKey(api, key);
			if (!restored.ok) return;
			restoredCurrentRunWasTerminal = restored.cleanupRuns.some((cleanup) => cleanup.runId === runId);
			tracker = {
				accountId: account.accountId,
				channelId: target.channelId,
				messageId: target.messageId,
				activeRunIds: new Set(restored.activeRunIds),
				persistedRunIds: new Set(restored.activeRunIds),
				runningEmojiConfirmed: false,
				reactionsEnabled,
				typingExpiresAt: 0
			};
			if (restored.activeRunIds.length > 0 || restored.cleanupRuns.length > 0) {
				const reserved = reservedReactionEmojis(api.config, account.config.ackReaction);
				const cleanupEmojis = restored.ownedEmojis.filter((emoji) => !reserved.has(emoji));
				const countsCleared = await clearRunningReactions(api, tracker, cleanupEmojis);
				const failurePresented = restored.cleanupRuns.filter((cleanup) => cleanup.value.outcome !== "ok").length === 0 || !reactionsEnabled || countsCleared && await setReaction(api, tracker, "🔴");
				if (countsCleared && failurePresented) {
					for (const cleanup of restored.cleanupRuns) markRunTerminal(cleanup.runId, cleanup.value.outcome);
					await Promise.all(restored.cleanupRuns.map((cleanup) => consumeProgressRun(api, cleanup.runId)));
				} else {
					tracker.reactionsEnabled = false;
					for (const cleanup of restored.cleanupRuns) scheduleTerminalLookupRetry(api, {
						phase: "ended",
						runId: cleanup.runId,
						outcome: cleanup.value.outcome
					}, cleanup.value);
				}
			}
			trackers.set(key, tracker);
		}
		if (!await disableTrackerReactionsOnCollision(api, tracker, account.config.ackReaction)) return;
		if (restoredCurrentRunWasTerminal) {
			if (tracker.activeRunIds.size > 0) {
				await updateRunningReaction(api, tracker);
				startTyping(api, tracker);
			} else trackers.delete(key);
			return;
		}
		if (tracker.activeRunIds.has(runId)) {
			trackerKeyByRunId.set(runId, key);
			await updateRunningReaction(api, tracker);
			startTyping(api, tracker);
			return;
		}
		let persistResult = "error";
		if (tracker.reactionsEnabled) {
			persistResult = await persistProgressRun(api, runId, tracker);
			if (persistResult === "terminal") {
				markRunTerminal(runId, "unknown");
				return;
			}
			if (persistResult === "conflict") {
				api.logger.debug?.(`discord subagent progress ignored conflicting run id: ${runId}`);
				return;
			}
			if (persistResult === "error") {
				await clearReaction(api, tracker, tracker.runningEmoji);
				tracker.runningEmoji = void 0;
				tracker.runningEmojiConfirmed = false;
				tracker.reactionsEnabled = false;
			}
		}
		tracker.activeRunIds.add(runId);
		trackerKeyByRunId.set(runId, key);
		if (persistResult === "persisted") tracker.persistedRunIds.add(runId);
		const endedOutcome = terminalOutcome(runId);
		if (endedOutcome) {
			const owned = persistedProgressRunFromTracker(tracker);
			await markProgressRunForCleanup(api, runId, owned, endedOutcome);
			if (endedOutcome === "ok" || !tracker.reactionsEnabled || await setReaction(api, tracker, "🔴")) await consumeProgressRun(api, runId);
			else scheduleTerminalLookupRetry(api, {
				phase: "ended",
				runId,
				outcome: endedOutcome,
				requester: event.requester
			}, {
				...owned,
				status: "cleanup",
				outcome: endedOutcome
			});
			tracker.activeRunIds.delete(runId);
			tracker.persistedRunIds.delete(runId);
			trackerKeyByRunId.delete(runId);
			await updateRunningReaction(api, tracker);
			if (tracker.activeRunIds.size === 0) {
				stopTyping(tracker);
				trackers.delete(key);
			}
			return;
		}
		await updateRunningReaction(api, tracker);
		startTyping(api, tracker);
	});
}
async function reconcilePersistedTracker(api, persisted, outcome, endingRunId) {
	const store = getProgressStore(api);
	let activeRunIds = [];
	if (store) try {
		activeRunIds = (await store.entries()).filter((entry) => entry.key !== endingRunId && entry.value.key === persisted.key && entry.value.status === "active").map((entry) => entry.key);
	} catch (error) {
		logFailure(api, "state store list", error);
		return { ok: false };
	}
	const tracker = {
		accountId: persisted.accountId,
		channelId: persisted.channelId,
		messageId: persisted.messageId,
		activeRunIds: new Set(activeRunIds),
		persistedRunIds: new Set(activeRunIds),
		runningEmojiConfirmed: false,
		reactionsEnabled: true,
		typingExpiresAt: 0
	};
	const account = resolveDiscordAccount({
		cfg: api.config,
		accountId: persisted.accountId
	});
	const typingEnabled = account.enabled && account.config.subagentProgress === true;
	const reserved = reservedReactionEmojis(api.config, account.config.ackReaction);
	const cleanupEmojis = persisted.runningEmoji && !reserved.has(persisted.runningEmoji) ? [persisted.runningEmoji] : [];
	const reactionsEnabled = typingEnabled && reactionsAreAvailable(api.config, account.config.ackReaction);
	const reactionsCleared = account.enabled && await clearRunningReactions(api, tracker, cleanupEmojis);
	const nextEmoji = RUNNING_EMOJIS[Math.min(activeRunIds.length, RUNNING_EMOJIS.length) - 1];
	let countPresented = true;
	if (reactionsEnabled && reactionsCleared && nextEmoji) {
		tracker.runningEmoji = nextEmoji;
		countPresented = await persistTrackerRunningEmoji(api, tracker) && await setReaction(api, tracker, nextEmoji);
		tracker.runningEmojiConfirmed = countPresented;
	}
	const outcomePresented = outcome === "ok" || !reactionsEnabled || reactionsCleared && countPresented && await setReaction(api, tracker, "🔴");
	if (!reactionsCleared || !countPresented || !outcomePresented) return { ok: false };
	return {
		ok: true,
		activeRunIds,
		reactionsEnabled,
		typingEnabled,
		...reactionsEnabled && nextEmoji ? { runningEmoji: nextEmoji } : {}
	};
}
function scheduleTerminalLookupRetry(api, event, owned) {
	const runId = event.runId.trim();
	if (!runId || terminalRetryTimers.has(runId)) return;
	if (!owned) {
		const target = resolveDiscordProgressTarget(event.requester);
		const account = resolveDiscordAccount({
			cfg: api.config,
			accountId: event.requester?.accountId
		});
		if (!target || !account.enabled || account.config.subagentProgress !== true) return;
	}
	if (terminalRetryTimers.size >= 4096) return;
	const expiresAt = terminalRetryExpiresAt.get(runId) ?? Date.now() + 6048e5;
	const attempts = terminalRetryAttempts.get(runId) ?? 0;
	if (expiresAt <= Date.now() || attempts >= TERMINAL_RETRY_MAX_ATTEMPTS) {
		clearTerminalRetry(runId);
		return;
	}
	terminalRetryExpiresAt.set(runId, expiresAt);
	terminalRetryAttempts.set(runId, attempts + 1);
	const retryDelayMs = Math.min(TERMINAL_LOOKUP_RETRY_MS * 2 ** Math.min(attempts, 12), TERMINAL_RETRY_MAX_DELAY_MS);
	const timer = setTimeout(() => {
		terminalRetryTimers.delete(runId);
		handleEnded(api, event, owned);
	}, retryDelayMs);
	timer.unref?.();
	terminalRetryTimers.set(runId, timer);
}
async function handleEnded(api, event, persistedHint) {
	const runId = event.runId.trim();
	if (!runId) return;
	markRunTerminal(runId, event.outcome);
	const lookup = await lookupProgressRun(api, runId);
	const persisted = lookup.status === "found" ? lookup.value : persistedHint;
	const key = trackerKeyByRunId.get(runId) ?? persisted?.key;
	if (!key) {
		if (lookup.status === "error") scheduleTerminalLookupRetry(api, event);
		else clearTerminalRetry(runId);
		return;
	}
	cancelTerminalRetryTimer(runId);
	await runQueued(key, async () => {
		const tracker = trackers.get(key);
		const currentLookup = await lookupProgressRun(api, runId);
		const currentPersisted = currentLookup.status === "found" ? currentLookup.value : currentLookup.status === "error" ? persistedHint ?? persisted : persistedHint ?? (tracker ? void 0 : persisted);
		const outcome = persistedTerminalOutcome(currentPersisted) ?? persistedTerminalOutcome(persisted) ?? event.outcome;
		const retryEvent = outcome === event.outcome ? event : {
			...event,
			outcome
		};
		trackerKeyByRunId.delete(runId);
		const owned = tracker?.persistedRunIds.has(runId) && currentPersisted?.status !== "cleanup" ? persistedProgressRunFromTracker(tracker) : currentPersisted;
		const cleanupMarked = owned ? owned.status === "cleanup" || await markProgressRunForCleanup(api, runId, owned, outcome) : true;
		if (tracker) {
			const currentAccount = resolveDiscordAccount({
				cfg: api.config,
				accountId: tracker.accountId
			});
			if (!currentAccount.enabled || currentAccount.config.subagentProgress !== true) {
				tracker.reactionsEnabled = false;
				stopTyping(tracker);
			} else await disableTrackerReactionsOnCollision(api, tracker, currentAccount.config.ackReaction);
		}
		if (!tracker) {
			const reconciliation = owned ? await reconcilePersistedTracker(api, owned, outcome, runId) : { ok: false };
			if (reconciliation.ok && owned) {
				if (!await consumeProgressRun(api, runId)) scheduleTerminalLookupRetry(api, retryEvent, owned);
				else clearTerminalRetry(runId);
				if (reconciliation.typingEnabled && reconciliation.activeRunIds.length > 0) {
					const restoredTracker = {
						accountId: owned.accountId,
						channelId: owned.channelId,
						messageId: owned.messageId,
						activeRunIds: new Set(reconciliation.activeRunIds),
						persistedRunIds: new Set(reconciliation.activeRunIds),
						runningEmojiConfirmed: Boolean(reconciliation.runningEmoji),
						reactionsEnabled: reconciliation.reactionsEnabled,
						...reconciliation.runningEmoji ? { runningEmoji: reconciliation.runningEmoji } : {},
						typingExpiresAt: 0
					};
					trackers.set(key, restoredTracker);
					for (const activeRunId of reconciliation.activeRunIds) trackerKeyByRunId.set(activeRunId, key);
					startTyping(api, restoredTracker);
				}
			} else if (owned) scheduleTerminalLookupRetry(api, retryEvent, owned);
			return;
		}
		tracker.activeRunIds.delete(runId);
		tracker.persistedRunIds.delete(runId);
		const countReconciled = tracker.reactionsEnabled ? await updateRunningReaction(api, tracker) : owned ? (await reconcilePersistedTracker(api, owned, outcome, runId)).ok : true;
		const outcomePresented = outcome === "ok" || !tracker.reactionsEnabled || countReconciled && await setReaction(api, tracker, "🔴");
		if (countReconciled && outcomePresented && owned) {
			const consumed = await consumeProgressRun(api, runId);
			if (!consumed) scheduleTerminalLookupRetry(api, retryEvent, owned);
			else clearTerminalRetry(runId);
			if (!consumed && !cleanupMarked) await markProgressRunForCleanup(api, runId, owned, outcome);
		} else if (owned) scheduleTerminalLookupRetry(api, retryEvent, owned);
		if (tracker.activeRunIds.size === 0) {
			stopTyping(tracker);
			trackers.delete(key);
		}
	});
}
async function handleDiscordSubagentProgressImpl(api, event) {
	if (event.phase === "started") {
		await handleStarted(api, event);
		return;
	}
	await handleEnded(api, event);
}
function clearStartupRecoveryRetry(api) {
	const retry = startupRecoveryRetries.get(api);
	if (retry?.timer) clearTimeout(retry.timer);
	startupRecoveryRetries.delete(api);
}
function scheduleStartupRecoveryRetry(api) {
	const retry = startupRecoveryRetries.get(api) ?? { attempts: 0 };
	if (retry.timer || retry.attempts >= STARTUP_RETRY_MAX_ATTEMPTS) return;
	const delayMs = Math.min(TERMINAL_LOOKUP_RETRY_MS * 2 ** retry.attempts, TERMINAL_RETRY_MAX_DELAY_MS);
	retry.attempts += 1;
	retry.timer = setTimeout(() => {
		retry.timer = void 0;
		recoverDiscordSubagentProgress(api);
	}, delayMs);
	retry.timer.unref?.();
	startupRecoveryRetries.set(api, retry);
}
async function recoverDiscordSubagentProgress(api) {
	const store = getProgressStore(api);
	if (!store) {
		if (api.runtime?.state) scheduleStartupRecoveryRetry(api);
		return;
	}
	let persistedRuns;
	try {
		persistedRuns = await store.entries();
	} catch (error) {
		logFailure(api, "startup recovery list", error);
		scheduleStartupRecoveryRetry(api);
		return;
	}
	clearStartupRecoveryRetry(api);
	for (const entry of persistedRuns) await handleEnded(api, {
		phase: "ended",
		runId: entry.key,
		outcome: persistedTerminalOutcome(entry.value) ?? "unknown"
	}, entry.value);
}
function resetDiscordSubagentProgressForTest() {
	for (const tracker of trackers.values()) stopTyping(tracker);
	trackers.clear();
	trackerKeyByRunId.clear();
	for (const timer of terminalRetryTimers.values()) clearTimeout(timer);
	terminalRetryTimers.clear();
	terminalRetryExpiresAt.clear();
	terminalRetryAttempts.clear();
	for (const retry of startupRecoveryRetries.values()) if (retry.timer) clearTimeout(retry.timer);
	startupRecoveryRetries.clear();
	resetDiscordSubagentProgressStateForTest();
}
const handleDiscordSubagentProgress = Object.assign(handleDiscordSubagentProgressImpl, { resetForTest: resetDiscordSubagentProgressForTest });
//#endregion
export { handleDiscordSubagentProgress, recoverDiscordSubagentProgress };
