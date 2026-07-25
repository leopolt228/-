//#region src/gateway/server-chat-state.ts
let chatRunOrderingSequence = 0;
function nextChatRunOrderingSequence() {
	chatRunOrderingSequence += 1;
	return chatRunOrderingSequence;
}
/** Stamp a chat run registration with the process-local ordering metadata used for abort freshness checks. */
function createChatRunEntry(entry) {
	return {
		...entry,
		registeredAtMs: Date.now(),
		registeredSequence: nextChatRunOrderingSequence()
	};
}
/** Create an abort marker ordered against chat run registrations, using a shared monotonic sequence. */
function createChatAbortMarker(now = Date.now()) {
	return {
		abortedAtMs: now,
		sequence: nextChatRunOrderingSequence()
	};
}
/** Return the wall-clock timestamp used by maintenance TTL pruning for both legacy and structured markers. */
function chatAbortMarkerTimestampMs(marker) {
	return typeof marker === "number" ? marker : marker.abortedAtMs;
}
/**
* Return whether an abort marker should suppress events for the given chat run registration.
* Structured markers compare the monotonic sequence first so same-millisecond aborts stay ordered;
* legacy numeric markers fall back to timestamp comparison, and a missing entry preserves old suppress-on-presence behavior.
*/
function isChatAbortMarkerCurrent(marker, entry) {
	if (marker === void 0) return false;
	if (!entry) return true;
	if (typeof marker !== "number" && typeof entry.registeredSequence === "number") return marker.sequence >= entry.registeredSequence;
	if (typeof entry.registeredAtMs !== "number") return true;
	return (typeof marker === "number" ? marker : marker.abortedAtMs) >= entry.registeredAtMs;
}
/** Create the FIFO registry that maps session IDs to active chat runs. */
function createChatRunRegistry() {
	const chatRunSessions = /* @__PURE__ */ new Map();
	const add = (sessionId, entry) => {
		const registeredEntry = createChatRunEntry(entry);
		const queue = chatRunSessions.get(sessionId);
		if (queue) queue.push(registeredEntry);
		else chatRunSessions.set(sessionId, [registeredEntry]);
	};
	const peek = (sessionId) => chatRunSessions.get(sessionId)?.[0];
	const shift = (sessionId) => {
		const queue = chatRunSessions.get(sessionId);
		if (!queue || queue.length === 0) return;
		const entry = queue.shift();
		if (!queue.length) chatRunSessions.delete(sessionId);
		return entry;
	};
	const remove = (sessionId, clientRunId, sessionKey) => {
		const queue = chatRunSessions.get(sessionId);
		if (!queue || queue.length === 0) return;
		const idx = queue.findIndex((entry) => entry.clientRunId === clientRunId && (sessionKey ? entry.sessionKey === sessionKey : true));
		if (idx < 0) return;
		const [entry] = queue.splice(idx, 1);
		if (!queue.length) chatRunSessions.delete(sessionId);
		return entry;
	};
	const clear = () => {
		chatRunSessions.clear();
	};
	return {
		add,
		peek,
		shift,
		remove,
		clear
	};
}
/** Create all mutable chat-run maps used by Gateway runtime state. */
function createChatRunState() {
	const registry = createChatRunRegistry();
	const rawBuffers = /* @__PURE__ */ new Map();
	const buffers = /* @__PURE__ */ new Map();
	const planSnapshots = /* @__PURE__ */ new Map();
	const bufferUpdatedAt = /* @__PURE__ */ new Map();
	const deltaSentAt = /* @__PURE__ */ new Map();
	const deltaLastBroadcastLen = /* @__PURE__ */ new Map();
	const deltaLastBroadcastText = /* @__PURE__ */ new Map();
	const agentDeltaSentAt = /* @__PURE__ */ new Map();
	const bufferedAgentEvents = /* @__PURE__ */ new Map();
	const abortedRuns = /* @__PURE__ */ new Map();
	const clearRun = (runId) => {
		rawBuffers.delete(runId);
		buffers.delete(runId);
		planSnapshots.delete(runId);
		bufferUpdatedAt.delete(runId);
		deltaSentAt.delete(runId);
		deltaLastBroadcastLen.delete(runId);
		deltaLastBroadcastText.delete(runId);
		for (const key of [
			runId,
			`${runId}:assistant`,
			`${runId}:thinking`
		]) {
			agentDeltaSentAt.delete(key);
			bufferedAgentEvents.delete(key);
		}
	};
	const clear = () => {
		registry.clear();
		rawBuffers.clear();
		buffers.clear();
		planSnapshots.clear();
		bufferUpdatedAt.clear();
		deltaSentAt.clear();
		deltaLastBroadcastLen.clear();
		deltaLastBroadcastText.clear();
		agentDeltaSentAt.clear();
		bufferedAgentEvents.clear();
		abortedRuns.clear();
	};
	return {
		registry,
		rawBuffers,
		buffers,
		planSnapshots,
		bufferUpdatedAt,
		deltaSentAt,
		deltaLastBroadcastLen,
		deltaLastBroadcastText,
		agentDeltaSentAt,
		bufferedAgentEvents,
		abortedRuns,
		clearRun,
		clear
	};
}
const TOOL_EVENT_RECIPIENT_TTL_MS = 600 * 1e3;
const TOOL_EVENT_RECIPIENT_FINAL_GRACE_MS = 30 * 1e3;
/** Create the broad sessions.changed subscriber registry. */
function createSessionEventSubscriberRegistry() {
	const connIds = /* @__PURE__ */ new Set();
	const empty = /* @__PURE__ */ new Set();
	return {
		subscribe: (connId) => {
			const normalized = connId.trim();
			if (!normalized) return;
			connIds.add(normalized);
		},
		unsubscribe: (connId) => {
			const normalized = connId.trim();
			if (!normalized) return;
			connIds.delete(normalized);
		},
		getAll: () => connIds.size > 0 ? connIds : empty,
		clear: () => {
			connIds.clear();
		}
	};
}
/** Create the per-session message subscriber registry. */
function createSessionMessageSubscriberRegistry() {
	const sessionToConnIds = /* @__PURE__ */ new Map();
	const connToSessionKeys = /* @__PURE__ */ new Map();
	const connToSessionRecency = /* @__PURE__ */ new Map();
	const provisionalSubscriptions = /* @__PURE__ */ new Map();
	const approvalSessionToConnIds = /* @__PURE__ */ new Map();
	const connToApprovalSessionKeys = /* @__PURE__ */ new Map();
	const empty = /* @__PURE__ */ new Set();
	let subscriptionSequence = 0;
	const normalize = (value) => value.trim();
	const rebuildConnectionSessionKeys = (connId) => {
		const recency = connToSessionRecency.get(connId);
		if (!recency || recency.size === 0) {
			connToSessionKeys.delete(connId);
			return;
		}
		connToSessionKeys.set(connId, new Set([...recency.entries()].toSorted(([, a], [, b]) => a - b).map(([key]) => key)));
	};
	const setMessageSubscription = (connId, sessionKey, subscribed) => {
		const connIds = sessionToConnIds.get(sessionKey);
		if (subscribed) {
			const nextConnIds = connIds ?? /* @__PURE__ */ new Set();
			nextConnIds.add(connId);
			sessionToConnIds.set(sessionKey, nextConnIds);
			return;
		}
		connIds?.delete(connId);
		if (connIds?.size === 0) sessionToConnIds.delete(sessionKey);
	};
	const setApprovalSubscription = (connId, sessionKey, subscribed) => {
		const connIds = approvalSessionToConnIds.get(sessionKey);
		const sessionKeys = connToApprovalSessionKeys.get(connId);
		if (subscribed) {
			const nextConnIds = connIds ?? /* @__PURE__ */ new Set();
			nextConnIds.add(connId);
			approvalSessionToConnIds.set(sessionKey, nextConnIds);
			const nextSessionKeys = sessionKeys ?? /* @__PURE__ */ new Set();
			nextSessionKeys.add(sessionKey);
			connToApprovalSessionKeys.set(connId, nextSessionKeys);
			return;
		}
		connIds?.delete(connId);
		if (connIds?.size === 0) approvalSessionToConnIds.delete(sessionKey);
		sessionKeys?.delete(sessionKey);
		if (sessionKeys?.size === 0) connToApprovalSessionKeys.delete(connId);
	};
	return {
		subscribe: (connId, sessionKey, opts) => {
			const normalizedConnId = normalize(connId);
			const normalizedSessionKey = normalize(sessionKey);
			if (!normalizedConnId || !normalizedSessionKey) return;
			const hadApprovals = approvalSessionToConnIds.get(normalizedSessionKey)?.has(normalizedConnId) ?? false;
			const recency = connToSessionRecency.get(normalizedConnId) ?? /* @__PURE__ */ new Map();
			const previousRecency = recency.get(normalizedSessionKey);
			const states = provisionalSubscriptions.get(normalizedConnId) ?? /* @__PURE__ */ new Map();
			const state = states.get(normalizedSessionKey) ?? {
				base: previousRecency,
				baseApprovals: hadApprovals,
				active: true,
				inflight: 0,
				lastSuccess: void 0,
				lastSuccessApprovals: void 0
			};
			state.inflight += 1;
			states.set(normalizedSessionKey, state);
			provisionalSubscriptions.set(normalizedConnId, states);
			subscriptionSequence += 1;
			const provisionalRecency = subscriptionSequence;
			setMessageSubscription(normalizedConnId, normalizedSessionKey, true);
			recency.set(normalizedSessionKey, provisionalRecency);
			connToSessionRecency.set(normalizedConnId, recency);
			rebuildConnectionSessionKeys(normalizedConnId);
			setApprovalSubscription(normalizedConnId, normalizedSessionKey, opts?.includeApprovals === true);
			let settled = false;
			const settle = (succeeded) => {
				if (settled || !state.active) return;
				settled = true;
				if (succeeded) {
					if (provisionalRecency >= (state.lastSuccess ?? -Infinity)) {
						state.lastSuccess = provisionalRecency;
						state.lastSuccessApprovals = opts?.includeApprovals === true;
					}
				}
				state.inflight -= 1;
				if (state.inflight > 0) return;
				const committedRecency = state.lastSuccess ?? state.base;
				if (committedRecency === void 0) {
					recency.delete(normalizedSessionKey);
					setMessageSubscription(normalizedConnId, normalizedSessionKey, false);
					setApprovalSubscription(normalizedConnId, normalizedSessionKey, false);
				} else {
					recency.set(normalizedSessionKey, committedRecency);
					setMessageSubscription(normalizedConnId, normalizedSessionKey, true);
					setApprovalSubscription(normalizedConnId, normalizedSessionKey, state.lastSuccessApprovals ?? state.baseApprovals);
				}
				if (recency.size === 0) connToSessionRecency.delete(normalizedConnId);
				rebuildConnectionSessionKeys(normalizedConnId);
				states.delete(normalizedSessionKey);
				if (states.size === 0) provisionalSubscriptions.delete(normalizedConnId);
			};
			const rollback = (() => settle(false));
			rollback.commit = () => settle(true);
			if (!opts?.provisional) {
				rollback.commit();
				return;
			}
			return rollback;
		},
		unsubscribe: (connId, sessionKey) => {
			const normalizedConnId = normalize(connId);
			const normalizedSessionKey = normalize(sessionKey);
			if (!normalizedConnId || !normalizedSessionKey) return;
			const states = provisionalSubscriptions.get(normalizedConnId);
			const state = states?.get(normalizedSessionKey);
			if (state) {
				state.active = false;
				states?.delete(normalizedSessionKey);
				if (states?.size === 0) provisionalSubscriptions.delete(normalizedConnId);
			}
			const connIds = sessionToConnIds.get(normalizedSessionKey);
			if (connIds) {
				connIds.delete(normalizedConnId);
				if (connIds.size === 0) sessionToConnIds.delete(normalizedSessionKey);
			}
			const recency = connToSessionRecency.get(normalizedConnId);
			if (recency) {
				recency.delete(normalizedSessionKey);
				if (recency.size === 0) connToSessionRecency.delete(normalizedConnId);
				rebuildConnectionSessionKeys(normalizedConnId);
			}
			const approvalConnIds = approvalSessionToConnIds.get(normalizedSessionKey);
			if (approvalConnIds) {
				approvalConnIds.delete(normalizedConnId);
				if (approvalConnIds.size === 0) approvalSessionToConnIds.delete(normalizedSessionKey);
			}
			const approvalSessionKeys = connToApprovalSessionKeys.get(normalizedConnId);
			if (approvalSessionKeys) {
				approvalSessionKeys.delete(normalizedSessionKey);
				if (approvalSessionKeys.size === 0) connToApprovalSessionKeys.delete(normalizedConnId);
			}
		},
		unsubscribeAll: (connId) => {
			const normalizedConnId = normalize(connId);
			if (!normalizedConnId) return;
			const states = provisionalSubscriptions.get(normalizedConnId);
			for (const state of states?.values() ?? []) state.active = false;
			provisionalSubscriptions.delete(normalizedConnId);
			const sessionKeys = connToSessionKeys.get(normalizedConnId);
			if (!sessionKeys) return;
			for (const sessionKey of sessionKeys) {
				const connIds = sessionToConnIds.get(sessionKey);
				if (!connIds) continue;
				connIds.delete(normalizedConnId);
				if (connIds.size === 0) sessionToConnIds.delete(sessionKey);
			}
			connToSessionKeys.delete(normalizedConnId);
			connToSessionRecency.delete(normalizedConnId);
			const approvalSessionKeys = connToApprovalSessionKeys.get(normalizedConnId);
			for (const sessionKey of approvalSessionKeys ?? []) {
				const connIds = approvalSessionToConnIds.get(sessionKey);
				connIds?.delete(normalizedConnId);
				if (connIds?.size === 0) approvalSessionToConnIds.delete(sessionKey);
			}
			connToApprovalSessionKeys.delete(normalizedConnId);
		},
		get: (sessionKey) => {
			const normalizedSessionKey = normalize(sessionKey);
			if (!normalizedSessionKey) return empty;
			return sessionToConnIds.get(normalizedSessionKey) ?? empty;
		},
		getForConnection: (connId) => {
			const normalizedConnId = normalize(connId);
			if (!normalizedConnId) return empty;
			return connToSessionKeys.get(normalizedConnId) ?? empty;
		},
		getApprovals: (sessionKey) => {
			const normalizedSessionKey = normalize(sessionKey);
			if (!normalizedSessionKey) return empty;
			return approvalSessionToConnIds.get(normalizedSessionKey) ?? empty;
		},
		clear: () => {
			sessionToConnIds.clear();
			connToSessionKeys.clear();
			connToSessionRecency.clear();
			for (const states of provisionalSubscriptions.values()) for (const state of states.values()) state.active = false;
			provisionalSubscriptions.clear();
			approvalSessionToConnIds.clear();
			connToApprovalSessionKeys.clear();
		}
	};
}
/** Create the run-id recipient registry used for streaming tool events. */
function createToolEventRecipientRegistry() {
	const recipients = /* @__PURE__ */ new Map();
	const prune = () => {
		if (recipients.size === 0) return;
		const now = Date.now();
		for (const [runId, entry] of recipients) if (now >= (entry.finalizedAt ? entry.finalizedAt + TOOL_EVENT_RECIPIENT_FINAL_GRACE_MS : entry.updatedAt + TOOL_EVENT_RECIPIENT_TTL_MS)) recipients.delete(runId);
	};
	const add = (runId, connId) => {
		if (!runId || !connId) return;
		const now = Date.now();
		const existing = recipients.get(runId);
		if (existing) {
			existing.connIds.add(connId);
			existing.updatedAt = now;
		} else recipients.set(runId, {
			connIds: /* @__PURE__ */ new Set([connId]),
			updatedAt: now
		});
		prune();
	};
	const get = (runId) => {
		const entry = recipients.get(runId);
		if (!entry) return;
		entry.updatedAt = Date.now();
		prune();
		return entry.connIds;
	};
	const markFinal = (runId) => {
		const entry = recipients.get(runId);
		if (!entry) return;
		entry.finalizedAt = Date.now();
		prune();
	};
	return {
		add,
		get,
		markFinal
	};
}
//#endregion
export { createChatRunState as a, createToolEventRecipientRegistry as c, createChatRunRegistry as i, isChatAbortMarkerCurrent as l, createChatAbortMarker as n, createSessionEventSubscriberRegistry as o, createChatRunEntry as r, createSessionMessageSubscriberRegistry as s, chatAbortMarkerTimestampMs as t };
