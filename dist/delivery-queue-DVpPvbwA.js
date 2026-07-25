import { C as resolveExpiresAtMsFromDurationMs, S as resolveDateTimestampMs } from "./number-coercion-Crk_c9KW.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { a as generateSecureUuid } from "./secure-random-Ds4AFLgz.js";
import { Q as executeSqliteQuerySync } from "./openclaw-state-db-DkOMT2fb.js";
import { T as normalizeSessionPeerId, k as parseSessionDeliveryRoute } from "./session-key-Drrs61Fd.js";
import { f as runOpenClawAgentWriteTransaction, u as openOpenClawAgentDatabase } from "./openclaw-agent-db-BZ3-lIlN.js";
import { a as resolveSqliteReadScope, f as toDatabaseOptions, r as getSessionKysely } from "./session-accessor.sqlite-scope-pPt31SN9.js";
import { n as stripTargetKindPrefix, r as stripTargetProviderPrefix, t as resolveTargetPrefixedChannel } from "./channel-target-prefix-Btghjzyf.js";
import { a as deleteDeliveryQueueEntry, d as moveDeliveryQueueEntryToFailed, f as reserveDeliveryQueueEntryAttempt, l as loadDeliveryQueueEntries, m as upsertDeliveryQueueEntry, n as commitStagedDeliveryQueueEntryOnce, p as updateDeliveryQueueEntry, r as completeDeliveryQueueEntry, s as failPendingDeliveryQueueEntry, t as commitStagedDeliveryQueueEntry, u as loadDeliveryQueueEntry } from "./delivery-queue-sqlite-yQcey81v.js";
import { i as isOutboundDeliveryError, r as countPhysicalOutboundSends } from "./deliver-types-BGUCRKo2.js";
import { a as getErrnoCode, i as findPlatformMessageRejectedError, n as computeBackoffMs, o as isProvenDeliveryNotSentError, r as createRecoveryReplayPacer, s as releaseRecoveryEntry, t as claimRecoveryEntry } from "./delivery-recovery.shared-BSGS9PhE.js";
import { n as hasTrustedMessageAuditListeners, t as emitTrustedMessageAuditEvent } from "./message-audit-events-jhQCeoBu.js";
import { n as resolveOutboundChannelMessageAdapter } from "./channel-resolution-Bjl-jS8C.js";
import { r as resolveMessageReceiptPrimaryId } from "./receipt-C0uxiauk.js";
import { a as DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME, l as createDeliveryQueueMediaRecoveryLease, o as OUTBOUND_DELIVERY_QUEUE_NAME, r as releaseSpoolArtifacts, s as cancelDeliveryQueueMediaRecoveryLease, t as collectEntrySpoolPaths } from "./delivery-queue-media-spool-BydQWAeP.js";
import crypto from "node:crypto";
//#region src/infra/outbound/deferred-delivery-admission.ts
function resolveDeferredDeliveryAdmission(params) {
	return resolveOutboundChannelMessageAdapter({
		channel: params.channel,
		cfg: params.cfg,
		allowBootstrap: true
	})?.durableFinal?.admitDeferredDelivery?.(params) ?? { status: "allowed" };
}
//#endregion
//#region src/infra/outbound/delivery-commit-hooks.ts
const log = createSubsystemLogger("outbound/deliver");
const outboundDeliveryCommitHooks = /* @__PURE__ */ new WeakMap();
/** Attaches an after-commit hook without changing the delivery result shape. */
function attachOutboundDeliveryCommitHook(result, hook) {
	if (!hook) return result;
	const hooks = outboundDeliveryCommitHooks.get(result) ?? [];
	hooks.push(hook);
	outboundDeliveryCommitHooks.set(result, hooks);
	return result;
}
/** Runs after-commit hooks for delivered results while isolating hook failures. */
async function runOutboundDeliveryCommitHooks(results) {
	for (const result of results) for (const hook of outboundDeliveryCommitHooks.get(result) ?? []) try {
		await hook();
	} catch (err) {
		log.warn("Plugin message adapter after-commit hook failed.", {
			channel: result.channel,
			messageId: result.messageId,
			error: formatErrorMessage(err)
		});
	}
}
/** Type guard for batched outbound delivery results crossing loose boundaries. */
function isOutboundDeliveryResultArray(value) {
	return Array.isArray(value);
}
//#endregion
//#region src/config/sessions/conversation-delivery-store.ts
function resolveDatabaseOptions(scope) {
	return toDatabaseOptions(resolveSqliteReadScope({
		agentId: scope.agentId,
		...scope.env ? { env: scope.env } : {},
		...scope.storePath ? { storePath: scope.storePath } : {}
	}));
}
function normalizeOperationId(value) {
	const operationId = value.trim();
	if (!operationId) throw new Error("Conversation delivery operation id is required");
	return operationId;
}
function hashMessage(message) {
	return crypto.createHash("sha256").update(message).digest("hex");
}
function normalizeStatus(value) {
	switch (value) {
		case "created":
		case "queued":
		case "sent":
		case "suppressed":
		case "rejected":
		case "unknown":
		case "replied": return value;
		default: throw new Error(`Invalid conversation delivery status: ${value}`);
	}
}
function normalizeOperationKind(value) {
	if (value === "send" || value === "turn") return value;
	throw new Error(`Invalid conversation delivery operation kind: ${value}`);
}
function mapRow(row) {
	const reply = row.reply_message_id && row.reply_text !== null && row.reply_timestamp !== null ? {
		messageId: row.reply_message_id,
		...row.reply_to_id ? { replyToId: row.reply_to_id } : {},
		...row.reply_thread_id ? { threadId: row.reply_thread_id } : {},
		text: row.reply_text,
		timestamp: row.reply_timestamp
	} : void 0;
	return {
		operationId: row.operation_id,
		operationKind: normalizeOperationKind(row.operation_kind),
		conversationRef: row.conversation_id,
		channel: row.channel,
		...row.source_session_key ? { sourceSessionKey: row.source_session_key } : {},
		messageHash: row.message_hash,
		status: normalizeStatus(row.status),
		...row.prepared_message_id ? { preparedMessageId: row.prepared_message_id } : {},
		...row.platform_message_id ? { platformMessageId: row.platform_message_id } : {},
		...row.queue_id ? { queueId: row.queue_id } : {},
		...row.rejection_error ? { rejectionError: row.rejection_error } : {},
		...reply ? { reply } : {},
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
var ConversationDeliveryInputError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ConversationDeliveryInputError";
	}
};
function selectOperation(database, operationId) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQuerySync(database.db, db.selectFrom("conversation_deliveries as delivery").innerJoin("conversations as conversation", "conversation.conversation_id", "delivery.conversation_id").selectAll("delivery").select("conversation.channel as channel").where("delivery.operation_id", "=", operationId)).rows[0];
	return row ? mapRow(row) : void 0;
}
/** Reads one durable conversation operation by its stable id. */
function getConversationDeliveryOperation(scope, operationId) {
	return selectOperation(openOpenClawAgentDatabase(resolveDatabaseOptions(scope)), normalizeOperationId(operationId));
}
/** Creates one idempotent delivery operation or returns its authoritative prior state. */
function beginConversationDeliveryOperation(scope, params) {
	const operationId = normalizeOperationId(params.operationId);
	const sourceSessionKey = params.sourceSessionKey?.trim() || void 0;
	const messageHash = hashMessage(params.message);
	return runOpenClawAgentWriteTransaction((database) => {
		const existing = selectOperation(database, operationId);
		if (existing) {
			if (existing.conversationRef !== params.conversationRef || existing.operationKind !== params.operationKind || existing.sourceSessionKey !== sourceSessionKey || existing.messageHash !== messageHash) throw new ConversationDeliveryInputError(`Conversation delivery operation was reused with different input: ${operationId}`);
			return {
				created: false,
				record: existing
			};
		}
		const now = Date.now();
		const db = getSessionKysely(database.db);
		executeSqliteQuerySync(database.db, db.insertInto("conversation_deliveries").values({
			operation_id: operationId,
			operation_kind: params.operationKind,
			conversation_id: params.conversationRef,
			source_session_key: sourceSessionKey ?? null,
			message_hash: messageHash,
			status: "created",
			prepared_message_id: params.preparedMessageId ?? null,
			platform_message_id: null,
			queue_id: null,
			rejection_error: null,
			reply_message_id: null,
			reply_to_id: null,
			reply_thread_id: null,
			reply_text: null,
			reply_timestamp: null,
			created_at: now,
			updated_at: now
		}));
		const record = selectOperation(database, operationId);
		if (!record) throw new Error(`Conversation delivery operation was not persisted: ${operationId}`);
		return {
			created: true,
			record
		};
	}, resolveDatabaseOptions(scope), { operationLabel: "conversation-delivery.begin" });
}
function updateConversationDeliveryOperation(scope, params) {
	const operationId = normalizeOperationId(params.operationId);
	return runOpenClawAgentWriteTransaction((database) => {
		const current = selectOperation(database, operationId);
		if (!current) throw new Error(`Conversation delivery operation not found: ${operationId}`);
		if (!params.allowedFrom.includes(current.status)) return current;
		const db = getSessionKysely(database.db);
		executeSqliteQuerySync(database.db, db.updateTable("conversation_deliveries").set({
			status: params.status,
			...params.queueId !== void 0 ? { queue_id: params.queueId } : {},
			...params.platformMessageId !== void 0 ? { platform_message_id: params.platformMessageId } : {},
			...params.rejectionError !== void 0 ? { rejection_error: params.rejectionError } : {},
			...params.reply ? {
				reply_message_id: params.reply.messageId,
				reply_to_id: params.reply.replyToId ?? null,
				reply_thread_id: params.reply.threadId ?? null,
				reply_text: params.reply.text,
				reply_timestamp: params.reply.timestamp
			} : {},
			updated_at: Date.now()
		}).where("operation_id", "=", operationId));
		const record = selectOperation(database, operationId);
		if (!record) throw new Error(`Conversation delivery operation disappeared: ${operationId}`);
		return record;
	}, resolveDatabaseOptions(scope), { operationLabel: `conversation-delivery.${params.status}` });
}
function markConversationDeliveryQueued(scope, operationId, queueId) {
	return updateConversationDeliveryOperation(scope, {
		operationId,
		status: "queued",
		queueId,
		allowedFrom: ["created"]
	});
}
function markConversationDeliverySent(scope, operationId, platformMessageId) {
	return updateConversationDeliveryOperation(scope, {
		operationId,
		status: "sent",
		...platformMessageId ? { platformMessageId } : {},
		allowedFrom: ["created", "queued"]
	});
}
function markConversationDeliverySuppressed(scope, operationId) {
	return updateConversationDeliveryOperation(scope, {
		operationId,
		status: "suppressed",
		allowedFrom: ["created", "queued"]
	});
}
function markConversationDeliveryRejected(scope, operationId, rejectionError) {
	const normalizedError = rejectionError.trim();
	if (!normalizedError) throw new Error("Conversation delivery rejection error is required");
	return updateConversationDeliveryOperation(scope, {
		operationId,
		status: "rejected",
		rejectionError: normalizedError,
		allowedFrom: ["created", "queued"]
	});
}
function markConversationDeliveryUnknown(scope, operationId) {
	return updateConversationDeliveryOperation(scope, {
		operationId,
		status: "unknown",
		allowedFrom: ["created", "queued"]
	});
}
function markConversationDeliveryReplied(scope, params) {
	return updateConversationDeliveryOperation(scope, {
		operationId: params.operationId,
		status: "replied",
		reply: params.reply,
		allowedFrom: ["queued", "sent"]
	});
}
/** Finds the durable correlated turn associated with an inbound transport reply. */
function findConversationTurnDeliveryByReplyTarget(scope, params) {
	const database = openOpenClawAgentDatabase(resolveDatabaseOptions(scope));
	const db = getSessionKysely(database.db);
	const row = executeSqliteQuerySync(database.db, db.selectFrom("conversation_deliveries as delivery").innerJoin("conversations as conversation", "conversation.conversation_id", "delivery.conversation_id").selectAll("delivery").select("conversation.channel as channel").where("delivery.conversation_id", "=", params.conversationRef).where("delivery.operation_kind", "=", "turn").where((eb) => eb.or([eb("delivery.platform_message_id", "=", params.replyToId), eb("delivery.prepared_message_id", "=", params.replyToId)])).where("delivery.status", "in", [
		"queued",
		"sent",
		"replied"
	]).orderBy("delivery.updated_at", "desc").limit(1)).rows[0];
	return row ? mapRow(row) : void 0;
}
//#endregion
//#region src/infra/outbound/delivery-completion.ts
function scopeForCompletion(completion) {
	return {
		agentId: completion.agentId,
		...completion.storePath ? { storePath: completion.storePath } : {}
	};
}
function readPlatformMessageId(result) {
	return (result.receipt ? resolveMessageReceiptPrimaryId(result.receipt) : void 0) ?? (result.messageId.trim() || void 0);
}
/** Records queue ownership before either the live sender or recovery crosses platform I/O. */
function markDurableDeliveryQueued(completion, queueId) {
	return markConversationDeliveryQueued(scopeForCompletion(completion), completion.operationId, queueId);
}
/** Finalizes owner state from identified platform evidence before queue acknowledgement. */
function completeDurableDelivery(completion, result) {
	return markConversationDeliverySent(scopeForCompletion(completion), completion.operationId, readPlatformMessageId(result));
}
/** Finalizes a policy-suppressed send before its durable intent is acknowledged. */
function suppressDurableDelivery(completion) {
	return markConversationDeliverySuppressed(scopeForCompletion(completion), completion.operationId);
}
/** Finalizes a permanent provider rejection that provably preceded platform I/O. */
function rejectDurableDelivery(completion, error) {
	return markConversationDeliveryRejected(scopeForCompletion(completion), completion.operationId, error);
}
/** Makes a dead-lettered durable send terminal without allowing a blind replay. */
function failDurableDelivery(completion) {
	return markConversationDeliveryUnknown(scopeForCompletion(completion), completion.operationId);
}
//#endregion
//#region src/infra/outbound/delivery-queue-storage.ts
function queuedDeliveryMetadata(entry) {
	return {
		entryKind: "outbound",
		sessionKey: entry.session?.key,
		channel: entry.channel,
		target: entry.to,
		accountId: entry.accountId
	};
}
function createQueuedDelivery(params, id) {
	return {
		id,
		enqueuedAt: Date.now(),
		channel: params.channel,
		to: params.to,
		accountId: params.accountId,
		queuePolicy: params.queuePolicy,
		requireUnknownSendReconciliation: params.requireUnknownSendReconciliation,
		payloads: params.payloads,
		renderedBatchPlan: params.renderedBatchPlan,
		threadId: params.threadId,
		replyToId: params.replyToId,
		replyToMode: params.replyToMode,
		formatting: params.formatting,
		identity: params.identity,
		bestEffort: params.bestEffort,
		gifPlayback: params.gifPlayback,
		forceDocument: params.forceDocument,
		replyPayloadSendingHook: params.replyPayloadSendingHook,
		silent: params.silent,
		mirror: params.mirror,
		session: params.session,
		gatewayClientScopes: params.gatewayClientScopes,
		preparedMessageId: params.preparedMessageId,
		deliveryCompletion: params.deliveryCompletion,
		completionRetention: params.completionRetention,
		maxRetries: params.maxRetries,
		retryCount: 0,
		attemptCount: 0
	};
}
/** Persist a delivery entry before attempting send. Returns the entry ID. */
async function enqueueDelivery(params, stateDir, mediaStageId) {
	const id = generateSecureUuid();
	const entry = createQueuedDelivery(params, id);
	const metadata = queuedDeliveryMetadata(entry);
	if (mediaStageId) {
		if (!commitStagedDeliveryQueueEntry({
			queueName: "outbound",
			entry,
			metadata,
			stagingId: mediaStageId,
			stagingQueueName: "outbound-media-staging",
			stateDir
		})) throw new Error(`Delivery queue media stage expired before enqueue: ${mediaStageId}`);
	} else upsertDeliveryQueueEntry({
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		entry,
		metadata,
		stateDir
	});
	return id;
}
/** Inserts one stable queue id without replacing prior pending or completed ownership. */
async function enqueueDeliveryOnce(params, id, stateDir, mediaStageId) {
	const normalizedId = id.trim();
	if (!normalizedId) throw new Error("Stable delivery queue id is required");
	const entry = createQueuedDelivery(params, normalizedId);
	const metadata = queuedDeliveryMetadata(entry);
	return {
		id: normalizedId,
		created: mediaStageId ? (() => {
			const result = commitStagedDeliveryQueueEntryOnce({
				queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
				entry,
				metadata,
				stagingId: mediaStageId,
				stagingQueueName: DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME,
				stateDir
			});
			if (result === "missing") throw new Error(`Delivery queue media stage expired before enqueue: ${mediaStageId}`);
			return result === "created";
		})() : upsertDeliveryQueueEntry({
			queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
			entry,
			metadata,
			stateDir,
			insertOnly: true
		})
	};
}
/** Spool artifacts a pending row still references; empty once it is gone or unreadable. */
function loadEntrySpoolPaths(id, stateDir) {
	const entry = loadDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir);
	return entry ? collectEntrySpoolPaths(entry.payloads, stateDir) : [];
}
/** Remove a successfully delivered entry, or retain its permanent producer receipt. */
async function ackDelivery(id, stateDir, options) {
	const entry = loadDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir);
	const spoolPaths = entry ? collectEntrySpoolPaths(entry.payloads, stateDir) : [];
	if (entry?.completionRetention === "permanent") completeDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir);
	else deleteDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir);
	if (!options?.retainSpoolArtifacts) await releaseSpoolArtifacts(spoolPaths, stateDir);
}
/** Update a queue entry after a failed delivery attempt. */
async function failDelivery(id, error, stateDir) {
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		retryCount: entry.retryCount + 1,
		lastAttemptAt: Date.now(),
		lastError: error
	}));
}
/** Record a failed attempt whose retry provably cannot duplicate a recipient-visible send. */
async function failDeliveryBeforePlatformSend(id, error, stateDir) {
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		retryCount: entry.retryCount + 1,
		lastAttemptAt: Date.now(),
		lastError: error,
		platformSendStartedAt: void 0,
		recoveryState: void 0
	}));
}
/** Record a failed attempt without losing evidence that platform delivery may have completed. */
async function failDeliveryAfterPlatformSend(id, error, stateDir) {
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		retryCount: entry.retryCount + 1,
		lastAttemptAt: Date.now(),
		lastError: error,
		platformSendStartedAt: entry.platformSendStartedAt ?? Date.now(),
		recoveryState: "unknown_after_send"
	}));
}
/** Reserve one durable delivery call before invoking the provider path. */
async function reserveDeliveryAttempt(id, maxAttempts, stateDir) {
	return reserveDeliveryQueueEntryAttempt({
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		id,
		maxAttempts,
		stateDir
	});
}
function updateQueuedDelivery(id, stateDir, update) {
	updateDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir, (entry) => update(entry));
}
async function markDeliveryPlatformSendAttemptStarted(id, stateDir, route) {
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		platformSendStartedAt: entry.platformSendStartedAt ?? Date.now(),
		...route && "replyToId" in route ? { effectiveReplyToId: route.replyToId ?? null } : {},
		recoveryState: "send_attempt_started"
	}));
}
/** Refresh the attempt timestamp before recipient-visible or finalizing platform I/O. */
async function markDeliveryPlatformSendDispatched(id, stateDir, route) {
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		platformSendStartedAt: Date.now(),
		...route && "replyToId" in route ? { effectiveReplyToId: route.replyToId ?? null } : {},
		recoveryState: "send_attempt_started"
	}));
}
async function markDeliveryPlatformOutcomeUnknown(id, stateDir) {
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		platformSendStartedAt: entry.platformSendStartedAt ?? Date.now(),
		recoveryState: "unknown_after_send"
	}));
}
/** Load a single pending delivery entry by ID from the queue directory. */
async function loadPendingDelivery(id, stateDir) {
	return loadDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir);
}
/** Load all pending delivery entries from the queue. */
async function loadPendingDeliveries(stateDir) {
	return loadDeliveryQueueEntries(OUTBOUND_DELIVERY_QUEUE_NAME, stateDir);
}
/** Move a queue entry out of the pending retry set. */
async function moveToFailed(id, stateDir) {
	const spoolPaths = loadEntrySpoolPaths(id, stateDir);
	moveDeliveryQueueEntryToFailed(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir);
	await releaseSpoolArtifacts(spoolPaths, stateDir);
}
/** Conditionally dead-letter a freshly re-read pending entry without a claimed state. */
async function failPendingDelivery(params, stateDir) {
	const result = failPendingDeliveryQueueEntry({
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		...params,
		stateDir
	});
	if (result.status === "failed") await releaseSpoolArtifacts(collectEntrySpoolPaths(params.entry.payloads, stateDir), stateDir);
	return result;
}
//#endregion
//#region src/infra/outbound/outbound-audit.ts
function outboundQueueAuditSourceId(queueId, payloadIndex) {
	return `message:outbound:queue:${queueId}:payload:${payloadIndex}`;
}
function outcomesByPayload(outcomes) {
	const indexed = /* @__PURE__ */ new Map();
	for (const outcome of outcomes) {
		const history = indexed.get(outcome.index) ?? [];
		history.push(outcome);
		indexed.set(outcome.index, history);
	}
	return indexed;
}
function sentResults(history) {
	return history.findLast((outcome) => outcome.status === "sent")?.results ?? [];
}
function hasUnknownAdapterSideEffect(history) {
	return history.some((outcome) => outcome.status === "suppressed" && outcome.reason === "adapter_returned_no_identity");
}
function completedOutboundAuditTerminals(params) {
	const indexed = outcomesByPayload(params.payloadOutcomes);
	return Array.from({ length: params.payloadCount }, (_, payloadIndex) => {
		const history = indexed.get(payloadIndex) ?? [];
		const latest = history.at(-1);
		if (hasUnknownAdapterSideEffect(history)) return {
			payloadIndex,
			terminal: {
				outcome: "unknown",
				failureStage: "platform_send"
			}
		};
		if (latest?.status === "sent") return {
			payloadIndex,
			terminal: {
				outcome: "sent",
				results: latest.results,
				...latest.deliveryKind ? { deliveryKind: latest.deliveryKind } : {}
			}
		};
		if (latest?.status === "suppressed") {
			if (latest.reason === "adapter_returned_no_identity") return {
				payloadIndex,
				terminal: {
					outcome: "unknown",
					failureStage: "platform_send"
				}
			};
			return {
				payloadIndex,
				terminal: {
					outcome: "suppressed",
					reasonCode: latest.reason
				}
			};
		}
		if (params.payloadCount === 1 && params.results.length > 0) return {
			payloadIndex,
			terminal: {
				outcome: "sent",
				results: params.results
			}
		};
		return {
			payloadIndex,
			terminal: {
				outcome: "suppressed",
				reasonCode: "no_visible_payload"
			}
		};
	});
}
function failedOutboundAuditTerminals(params) {
	const indexed = outcomesByPayload(params.payloadOutcomes);
	return Array.from({ length: params.payloadCount }, (_, payloadIndex) => {
		const history = indexed.get(payloadIndex) ?? [];
		const latest = history.at(-1);
		if (hasUnknownAdapterSideEffect(history)) return {
			payloadIndex,
			terminal: {
				outcome: "unknown",
				failureStage: "platform_send"
			}
		};
		if (latest?.status === "sent") return {
			payloadIndex,
			terminal: {
				outcome: "sent",
				results: latest.results,
				...latest.deliveryKind ? { deliveryKind: latest.deliveryKind } : {}
			}
		};
		if (latest?.status === "suppressed") {
			if (latest.reason === "adapter_returned_no_identity") return {
				payloadIndex,
				terminal: {
					outcome: "unknown",
					failureStage: "platform_send"
				}
			};
			return {
				payloadIndex,
				terminal: {
					outcome: "suppressed",
					reasonCode: latest.reason
				}
			};
		}
		const failedResults = latest?.status === "failed" ? latest.results ?? [] : [];
		const payloadResults = failedResults.length > 0 ? failedResults : sentResults(history);
		const fallbackResults = params.payloadCount === 1 ? params.results : [];
		const results = payloadResults.length > 0 ? payloadResults : fallbackResults;
		return {
			payloadIndex,
			terminal: {
				outcome: "failed",
				failureStage: latest?.status === "failed" ? latest.stage : params.failureStage,
				results,
				sentBeforeError: results.length > 0 || latest?.status === "failed" && latest.sentBeforeError,
				...latest?.status === "failed" && latest.deliveryKind ? { deliveryKind: latest.deliveryKind } : {}
			}
		};
	});
}
function uniformOutboundAuditTerminals(payloadCount, terminal) {
	return Array.from({ length: payloadCount }, (_, payloadIndex) => ({
		payloadIndex,
		terminal
	}));
}
const TARGET_KIND_TO_ROUTE_KINDS = {
	channel: ["channel"],
	conversation: ["channel"],
	thread: ["channel"],
	group: ["group"],
	room: ["group"],
	direct: ["direct", "dm"],
	dm: ["direct", "dm"],
	user: ["direct", "dm"]
};
const TARGET_PREFIX_RE = /^\s*([a-z][a-z0-9_-]*):/i;
function resolveOutboundTargetFacts(context) {
	const channel = context.channel.toLowerCase();
	const aliasChannel = resolveTargetPrefixedChannel(context.to);
	const targetPrefix = TARGET_PREFIX_RE.exec(context.to)?.[1];
	const providerPrefixes = aliasChannel === channel ? [context.channel, targetPrefix ?? context.channel] : [context.channel];
	const withoutProvider = stripTargetProviderPrefix(context.to, ...providerPrefixes);
	const kindPrefix = TARGET_PREFIX_RE.exec(withoutProvider)?.[1]?.toLowerCase();
	const allowedRouteKinds = kindPrefix ? TARGET_KIND_TO_ROUTE_KINDS[kindPrefix] : void 0;
	return {
		conversationId: stripTargetKindPrefix(withoutProvider, Object.keys(TARGET_KIND_TO_ROUTE_KINDS)),
		withoutProvider,
		allowedRouteKinds
	};
}
/** True when a parsed session route provably names this delivery's destination. */
function routeNamesDestination(route, context) {
	if (!route || route.channel !== context.channel.toLowerCase()) return false;
	const { conversationId, withoutProvider, allowedRouteKinds } = resolveOutboundTargetFacts(context);
	if (allowedRouteKinds && !allowedRouteKinds.includes(route.peerKind)) return false;
	return [
		context.to,
		withoutProvider,
		conversationId
	].some((candidate) => {
		const normalized = normalizeSessionPeerId({
			channel: route.channel,
			peerKind: route.peerKind,
			peerId: candidate
		});
		return normalized !== "" && normalized.toLowerCase() === route.peerId.toLowerCase();
	});
}
function resolveConversationKind(context) {
	if (context.session?.conversationKind) return context.session.conversationKind;
	const routeCandidates = [
		context.session?.policyKey,
		context.session?.key,
		context.mirror?.sessionKey
	];
	for (const candidate of routeCandidates) {
		const route = parseSessionDeliveryRoute(candidate);
		if (routeNamesDestination(route, context)) return route.peerKind === "dm" || route.peerKind === "direct" ? "direct" : route.peerKind;
	}
	if (context.session?.conversationType === "group" || context.mirror?.isGroup === true) return "group";
	return "unknown";
}
function firstIdentifier(...values) {
	for (const value of values) {
		const normalized = value?.trim();
		if (normalized && normalized !== "unknown" && normalized !== "suppressed") return normalized;
	}
}
function resolveResultIdentifiers(context, results) {
	const last = results.at(-1);
	const conversationId = firstIdentifier(last?.conversationId, last?.chatId, last?.channelId, last?.roomId, last?.toJid) ?? resolveOutboundTargetFacts(context).conversationId;
	const messageId = firstIdentifier(last?.messageId, last?.receipt?.primaryPlatformMessageId, last?.receipt?.platformMessageIds.at(-1));
	return {
		...conversationId ? { conversationId } : {},
		...messageId ? { messageId } : {}
	};
}
/**
* Emits only after the owning lifecycle has made the delivery terminal.
* Queue retries share one source id, so recovery cannot duplicate the final row.
*/
function emitOutboundAuditTerminal(params) {
	try {
		const { context, terminal } = params;
		const results = terminal.results ?? [];
		const agentId = context.session?.agentId ?? context.mirror?.agentId;
		const identifiers = resolveResultIdentifiers(context, results);
		const sentBeforeError = (terminal.outcome === "failed" || terminal.outcome === "unknown") && terminal.sentBeforeError === true;
		const terminalFields = terminal.outcome === "sent" ? {
			status: "succeeded",
			outcome: "sent",
			...terminal.deliveryKind ? { deliveryKind: terminal.deliveryKind } : {}
		} : terminal.outcome === "suppressed" ? {
			status: "blocked",
			outcome: "suppressed",
			reasonCode: terminal.reasonCode
		} : terminal.outcome === "unknown" ? {
			status: "unknown",
			outcome: "unknown",
			failureStage: terminal.failureStage
		} : {
			status: "failed",
			outcome: "failed",
			errorCode: results.length > 0 || sentBeforeError ? "message_delivery_partial_failure" : "message_delivery_failed",
			failureStage: terminal.failureStage,
			...terminal.deliveryKind ? { deliveryKind: terminal.deliveryKind } : {}
		};
		emitTrustedMessageAuditEvent({
			...params.sourceId ? { sourceId: params.sourceId } : {},
			kind: "message",
			action: "message.outbound.finished",
			occurredAt: Date.now(),
			...terminalFields,
			actorType: agentId ? "agent" : "system",
			actorId: agentId ?? "gateway",
			...agentId ? { agentId } : {},
			...context.replyPayloadSendingHook?.runId ? { runId: context.replyPayloadSendingHook.runId } : {},
			direction: "outbound",
			channel: context.channel,
			conversationKind: resolveConversationKind(context),
			durationMs: Math.max(0, Date.now() - params.startedAt),
			resultCount: countPhysicalOutboundSends(results),
			...context.accountId ? { accountId: context.accountId } : {},
			targetId: context.to,
			...identifiers
		});
	} catch {}
}
/** Emits only after the owning lifecycle has made each logical payload terminal. */
function emitOutboundAuditTerminals(params) {
	if (!hasTrustedMessageAuditListeners()) return;
	let terminals;
	try {
		terminals = typeof params.terminals === "function" ? params.terminals() : params.terminals;
	} catch {
		return;
	}
	for (const indexed of terminals) emitOutboundAuditTerminal({
		context: params.context,
		terminal: indexed.terminal,
		startedAt: params.startedAt,
		payloadIndex: indexed.payloadIndex,
		...params.queueId ? { sourceId: outboundQueueAuditSourceId(params.queueId, indexed.payloadIndex) } : {}
	});
}
//#endregion
//#region src/infra/outbound/delivery-queue-recovery.ts
const DEFAULT_MAX_RETRIES = 5;
const PERMANENT_ERROR_PATTERNS = [
	/no conversation reference found/i,
	/chat not found/i,
	/user not found/i,
	/bot.*not.*member/i,
	/bot was blocked by the user/i,
	/forbidden: bot was kicked/i,
	/chat_id is empty/i,
	/recipient is not a valid/i,
	/outbound not configured for channel/i,
	/ambiguous .* recipient/i,
	/User .* not in room/i
];
const drainInProgress = /* @__PURE__ */ new Map();
const entriesInProgress = /* @__PURE__ */ new Set();
const recoveryReplayPacer = createRecoveryReplayPacer();
function resolveMaxRetries(entry) {
	const configured = entry.maxRetries;
	return typeof configured === "number" && Number.isInteger(configured) && configured > 0 ? configured : DEFAULT_MAX_RETRIES;
}
function resolveAttemptCount(entry) {
	const persisted = entry.attemptCount;
	return Math.max(typeof persisted === "number" && Number.isInteger(persisted) && persisted >= 0 ? persisted : 0, entry.retryCount);
}
function resolveRecoveryDeadlineMs(maxRecoveryMs) {
	const durationMs = typeof maxRecoveryMs === "number" && Number.isFinite(maxRecoveryMs) ? Math.max(0, Math.trunc(maxRecoveryMs)) : 6e4;
	if (durationMs <= 0) return resolveDateTimestampMs(Date.now());
	return resolveExpiresAtMsFromDurationMs(durationMs) ?? resolveDateTimestampMs(Date.now());
}
function createEmptyRecoverySummary() {
	return {
		recovered: 0,
		failed: 0,
		skippedMaxRetries: 0,
		deferredBackoff: 0
	};
}
function emitQueuedAuditTerminals(entry, terminals) {
	emitOutboundAuditTerminals({
		context: entry,
		terminals,
		startedAt: entry.enqueuedAt,
		queueId: entry.id
	});
}
function needsUnknownSendReconciliation(entry) {
	return entry.recoveryState === "send_attempt_started" || entry.recoveryState === "unknown_after_send";
}
function queuedDeadLetterAuditTerminals(entry) {
	if (needsUnknownSendReconciliation(entry)) return uniformOutboundAuditTerminals(entry.payloads.length, {
		outcome: "unknown",
		failureStage: "queue"
	});
	return uniformOutboundAuditTerminals(entry.payloads.length, {
		outcome: "failed",
		failureStage: "queue"
	});
}
function queuedUnknownAuditTerminals(entry) {
	return uniformOutboundAuditTerminals(entry.payloads.length, {
		outcome: "unknown",
		failureStage: "queue"
	});
}
async function withActiveDeliveryClaim(entryId, fn) {
	if (!claimRecoveryEntry(entriesInProgress, entryId)) return { status: "claimed-by-other-owner" };
	try {
		return {
			status: "claimed",
			value: await fn()
		};
	} finally {
		releaseRecoveryEntry(entriesInProgress, entryId);
	}
}
function buildRecoveryDeliverParams(entry, cfg, stateDir) {
	return {
		cfg,
		channel: entry.channel,
		to: entry.to,
		accountId: entry.accountId,
		...entry.queuePolicy !== void 0 ? { queuePolicy: entry.queuePolicy } : {},
		...entry.requireUnknownSendReconciliation === true ? { requireUnknownSendReconciliation: true } : {},
		payloads: entry.payloads,
		renderedBatchPlan: entry.renderedBatchPlan,
		threadId: entry.threadId,
		replyToId: entry.replyToId,
		replyToMode: entry.replyToMode,
		formatting: entry.formatting,
		identity: entry.identity,
		bestEffort: entry.bestEffort,
		gifPlayback: entry.gifPlayback,
		forceDocument: entry.forceDocument,
		replyPayloadSendingHook: entry.replyPayloadSendingHook,
		silent: entry.silent,
		mirror: entry.mirror,
		session: entry.session,
		gatewayClientScopes: entry.gatewayClientScopes,
		preparedMessageId: entry.preparedMessageId,
		deliveryCompletion: entry.deliveryCompletion,
		deliveryQueueId: entry.id,
		deliveryQueueStateDir: stateDir,
		skipQueue: true,
		deferredDeliveryAdmissionPassed: true,
		deferCommitHooks: true
	};
}
async function applyRecoveryDeliveryAdmission(params) {
	const admission = resolveDeferredDeliveryAdmission({
		cfg: params.cfg,
		channel: params.entry.channel,
		to: params.entry.to,
		accountId: params.entry.accountId,
		phase: "recovery"
	});
	if (admission.status === "allowed") return "allowed";
	markDurableDeliveryFailedBestEffort(params.entry, params.log);
	if ((await failPendingDelivery({
		id: params.entry.id,
		expectedStatus: "pending",
		lastError: admission.reason,
		entry: params.entry
	}, params.stateDir)).status === "failed") {
		emitQueuedAuditTerminals(params.entry, () => queuedDeadLetterAuditTerminals(params.entry));
		params.log.warn(`${params.logLabel}: entry ${params.entry.id} permanently rejected before recovery: ${admission.reason}`);
		return "failed";
	}
	params.log.info(`${params.logLabel}: entry ${params.entry.id} changed status before admission failure was persisted`);
	return "not_pending";
}
async function reconcileUnknownQueuedDelivery(opts) {
	const adapter = resolveOutboundChannelMessageAdapter({
		channel: opts.entry.channel,
		cfg: opts.cfg,
		allowBootstrap: true
	});
	if (adapter?.durableFinal?.capabilities?.reconcileUnknownSend !== true) return null;
	const reconcileUnknownSend = adapter?.durableFinal?.reconcileUnknownSend;
	if (!reconcileUnknownSend) return null;
	const { entry } = opts;
	try {
		return await reconcileUnknownSend({
			cfg: opts.cfg,
			queueId: entry.id,
			channel: entry.channel,
			to: entry.to,
			...entry.accountId !== void 0 ? { accountId: entry.accountId } : {},
			enqueuedAt: entry.enqueuedAt,
			retryCount: entry.retryCount,
			...entry.platformSendStartedAt !== void 0 ? { platformSendStartedAt: entry.platformSendStartedAt } : {},
			...entry.effectiveReplyToId !== void 0 ? { effectiveReplyToId: entry.effectiveReplyToId } : {},
			payloads: entry.payloads,
			...entry.renderedBatchPlan ? { renderedBatchPlan: entry.renderedBatchPlan } : {},
			...entry.replyToId !== void 0 ? { replyToId: entry.replyToId } : {},
			...entry.replyToMode !== void 0 ? { replyToMode: entry.replyToMode } : {},
			...entry.threadId !== void 0 ? { threadId: entry.threadId } : {},
			...entry.silent !== void 0 ? { silent: entry.silent } : {}
		});
	} catch (err) {
		const error = formatErrorMessage(err);
		opts.log.warn(`Delivery entry ${opts.entry.id} unknown-send reconciliation failed: ${error}`);
		return {
			status: "unresolved",
			error,
			retryable: true
		};
	}
}
function buildReconciledSentResult(entry, reconciliation) {
	return {
		channel: entry.channel,
		messageId: reconciliation.messageId ?? reconciliation.receipt.primaryPlatformMessageId ?? reconciliation.receipt.platformMessageIds[0] ?? "",
		receipt: reconciliation.receipt
	};
}
function buildReconciledCommitContext(params) {
	const payload = params.entry.payloads[0] ?? {};
	const result = {
		messageId: params.result.messageId,
		receipt: params.result.receipt ?? {
			platformMessageIds: [params.result.messageId].filter(Boolean),
			parts: [],
			sentAt: Date.now()
		}
	};
	const base = {
		cfg: params.cfg,
		to: params.entry.to,
		accountId: params.entry.accountId,
		replyToId: params.entry.effectiveReplyToId !== void 0 ? params.entry.effectiveReplyToId : params.entry.replyToId,
		replyToMode: params.entry.replyToMode,
		threadId: params.entry.threadId,
		silent: params.entry.silent,
		result
	};
	if (payload.presentation !== void 0 || payload.delivery !== void 0 || payload.interactive !== void 0 || payload.channelData !== void 0 && Object.keys(payload.channelData).length > 0) return {
		...base,
		kind: "payload",
		text: payload.text ?? "",
		mediaUrl: payload.mediaUrl,
		payload
	};
	const mediaUrl = payload.mediaUrl ?? payload.mediaUrls?.find((url) => url);
	if (mediaUrl) return {
		...base,
		kind: "media",
		text: payload.text ?? "",
		mediaUrl,
		audioAsVoice: payload.audioAsVoice,
		gifPlayback: params.entry.gifPlayback,
		forceDocument: params.entry.forceDocument
	};
	return {
		...base,
		kind: "text",
		text: payload.text ?? ""
	};
}
async function runReconciledSentCommitHooks(params) {
	const afterCommit = resolveOutboundChannelMessageAdapter({
		channel: params.entry.channel,
		cfg: params.cfg,
		allowBootstrap: true
	})?.send?.lifecycle?.afterCommit;
	if (!afterCommit) return;
	const result = buildReconciledSentResult(params.entry, params.reconciliation);
	try {
		await afterCommit(buildReconciledCommitContext({
			entry: params.entry,
			cfg: params.cfg,
			result
		}));
	} catch (err) {
		params.log.warn(`Delivery entry ${params.entry.id} reconciled sent afterCommit hook failed: ${formatErrorMessage(err)}`);
	}
}
async function moveEntryToFailedWithLogging(entry, log, stateDir) {
	markDurableDeliveryFailedBestEffort(entry, log);
	try {
		await moveToFailed(entry.id, stateDir);
		return true;
	} catch (err) {
		log.error(`Failed to move entry ${entry.id} to failed/: ${String(err)}`);
		return false;
	}
}
function markDurableDeliveryFailedBestEffort(entry, log) {
	if (!entry.deliveryCompletion) return;
	try {
		failDurableDelivery(entry.deliveryCompletion);
	} catch (error) {
		log.warn(`Delivery entry ${entry.id} owner state could not be marked unknown: ${formatErrorMessage(error)}`);
	}
}
async function resolveCompletedOwnerBeforeRecovery(opts) {
	const completion = opts.entry.deliveryCompletion;
	if (!completion) return "continue";
	let operation;
	try {
		operation = markDurableDeliveryQueued(completion, opts.entry.id);
	} catch (error) {
		const errMsg = `delivery owner state unavailable: ${formatErrorMessage(error)}`;
		await failDelivery(opts.entry.id, errMsg, opts.stateDir).catch(() => void 0);
		opts.onFailed?.(opts.entry, errMsg);
		opts.log.warn(`Delivery entry ${opts.entry.id} ${errMsg}`);
		return "failed";
	}
	if (operation.status === "sent" || operation.status === "replied") {
		try {
			await ackDelivery(opts.entry.id, opts.stateDir);
		} catch (error) {
			const errMsg = `failed to ack owner-completed delivery: ${formatErrorMessage(error)}`;
			opts.onFailed?.(opts.entry, errMsg);
			opts.log.warn(`Delivery entry ${opts.entry.id} ${errMsg}`);
			return "failed";
		}
		const messageId = operation.platformMessageId ?? operation.preparedMessageId;
		if (messageId) {
			const result = {
				channel: opts.entry.channel,
				messageId
			};
			await runOutboundDeliveryCommitHooks([result]);
			emitQueuedAuditTerminals(opts.entry, () => completedOutboundAuditTerminals({
				payloadCount: opts.entry.payloads.length,
				results: [result],
				payloadOutcomes: []
			}));
		}
		opts.onRecovered?.(opts.entry);
		return "recovered";
	}
	if (operation.status === "suppressed") {
		try {
			await ackDelivery(opts.entry.id, opts.stateDir);
		} catch (error) {
			const errMsg = `failed to ack owner-suppressed delivery: ${formatErrorMessage(error)}`;
			opts.onFailed?.(opts.entry, errMsg);
			opts.log.warn(`Delivery entry ${opts.entry.id} ${errMsg}`);
			return "failed";
		}
		opts.onRecovered?.(opts.entry);
		return "recovered";
	}
	if (operation.status === "rejected") {
		try {
			await ackDelivery(opts.entry.id, opts.stateDir);
		} catch (error) {
			const errMsg = `failed to ack owner-rejected delivery: ${formatErrorMessage(error)}`;
			opts.onFailed?.(opts.entry, errMsg);
			opts.log.warn(`Delivery entry ${opts.entry.id} ${errMsg}`);
			return "failed";
		}
		emitQueuedAuditTerminals(opts.entry, () => failedOutboundAuditTerminals({
			payloadCount: opts.entry.payloads.length,
			results: [],
			payloadOutcomes: [],
			failureStage: "platform_send"
		}));
		opts.onFailed?.(opts.entry, operation.rejectionError ?? "delivery permanently rejected before platform dispatch");
		return "failed";
	}
	if (operation.status === "unknown") return await moveEntryToFailedWithLogging(opts.entry, opts.log, opts.stateDir) ? "moved-to-failed" : "failed";
	return "continue";
}
function isEntryEligibleForRecoveryRetry(entry, now) {
	const backoff = computeBackoffMs(entry.retryCount + 1);
	if (backoff <= 0) return { eligible: true };
	if (entry.retryCount === 0 && entry.lastAttemptAt === void 0) return { eligible: true };
	const nextEligibleAt = (typeof entry.lastAttemptAt === "number" && Number.isFinite(entry.lastAttemptAt) && entry.lastAttemptAt > 0 ? entry.lastAttemptAt ?? entry.enqueuedAt : entry.enqueuedAt) + backoff;
	if (now >= nextEligibleAt) return { eligible: true };
	return {
		eligible: false,
		remainingBackoffMs: nextEligibleAt - now
	};
}
function isPermanentDeliveryError(error) {
	return PERMANENT_ERROR_PATTERNS.some((re) => re.test(error));
}
async function persistRecoveredPostSendState(opts) {
	try {
		await markDeliveryPlatformOutcomeUnknown(opts.entry.id, opts.stateDir);
		return "marked";
	} catch (markErr) {
		opts.log.warn(`Delivery entry ${opts.entry.id} failed to persist post-send state; falling back to direct ack: ${formatErrorMessage(markErr)}`);
		try {
			await ackDelivery(opts.entry.id, opts.stateDir, { retainSpoolArtifacts: true });
			return "acked";
		} catch (ackErr) {
			const error = `post-send state persistence failed: marker=${formatErrorMessage(markErr)}; ack=${formatErrorMessage(ackErr)}`;
			await failDeliveryAfterPlatformSend(opts.entry.id, error, opts.stateDir);
			return "failed";
		}
	}
}
async function drainQueuedEntry(opts) {
	const { entry } = opts;
	const maxRetries = resolveMaxRetries(entry);
	const attemptBudgetExhausted = resolveAttemptCount(entry) >= maxRetries;
	const ownerState = await resolveCompletedOwnerBeforeRecovery(opts);
	if (ownerState !== "continue") return ownerState;
	if (needsUnknownSendReconciliation(entry)) {
		const reconciliation = await reconcileUnknownQueuedDelivery({
			entry,
			cfg: opts.cfg,
			log: opts.log
		});
		if (reconciliation?.status === "sent") try {
			const result = buildReconciledSentResult(entry, reconciliation);
			if (entry.deliveryCompletion) completeDurableDelivery(entry.deliveryCompletion, result);
			await ackDelivery(entry.id, opts.stateDir);
			await runReconciledSentCommitHooks({
				entry,
				cfg: opts.cfg,
				reconciliation,
				log: opts.log
			});
			emitQueuedAuditTerminals(entry, () => completedOutboundAuditTerminals({
				payloadCount: entry.payloads.length,
				results: [result],
				payloadOutcomes: []
			}));
			opts.onRecovered?.(entry);
			opts.log.info(`Delivery entry ${entry.id} reconciled unknown_after_send as already sent`);
			return "recovered";
		} catch (ackErr) {
			if (getErrnoCode(ackErr) === "ENOENT") return "already-gone";
			const errMsg = `failed to ack reconciled sent delivery: ${formatErrorMessage(ackErr)}`;
			opts.log.warn(`Delivery entry ${entry.id} ${errMsg}`);
			opts.onFailed?.(entry, errMsg);
			try {
				await failDelivery(entry.id, errMsg, opts.stateDir);
				return "failed";
			} catch (failErr) {
				if (getErrnoCode(failErr) === "ENOENT") return "already-gone";
			}
			return "failed";
		}
		if (reconciliation?.status === "not_sent" && entry.recoveryState === "send_attempt_started") opts.log.info(`Delivery entry ${entry.id} reconciled ${entry.recoveryState} as not sent; replaying`);
		else {
			let errMsg = `delivery state is ${entry.recoveryState}; refusing blind replay without adapter reconciliation`;
			if (reconciliation?.status === "not_sent") errMsg = `delivery state is ${entry.recoveryState}; refusing full replay after post-send evidence`;
			else if (reconciliation?.status === "unresolved" && reconciliation.error) errMsg = `delivery state is ${entry.recoveryState} and reconciliation is unresolved: ${reconciliation.error}`;
			opts.log.warn(`Delivery entry ${entry.id} ${errMsg}`);
			opts.onFailed?.(entry, errMsg);
			if (reconciliation?.status === "unresolved" && reconciliation.retryable === true && !attemptBudgetExhausted) {
				try {
					await failDelivery(entry.id, errMsg, opts.stateDir);
					return "failed";
				} catch (failErr) {
					if (getErrnoCode(failErr) === "ENOENT") return "already-gone";
				}
				return "failed";
			}
			try {
				markDurableDeliveryFailedBestEffort(entry, opts.log);
				await moveToFailed(entry.id, opts.stateDir);
				emitQueuedAuditTerminals(entry, () => queuedUnknownAuditTerminals(entry));
				return "moved-to-failed";
			} catch (moveErr) {
				if (getErrnoCode(moveErr) === "ENOENT") return "already-gone";
			}
			return "failed";
		}
	}
	const payloadOutcomes = [];
	let postSendState;
	let deliveredResults = [];
	let commitHooksRun = false;
	const collectResults = (results) => {
		for (const result of results) if (!deliveredResults.includes(result)) deliveredResults.push(result);
	};
	const collectPayloadOutcome = (outcome) => {
		if (!payloadOutcomes.includes(outcome)) payloadOutcomes.push(outcome);
	};
	const runCommitHooksAfterAck = async () => {
		if (postSendState !== "acked" || commitHooksRun || deliveredResults.length === 0) return;
		commitHooksRun = true;
		await runOutboundDeliveryCommitHooks(deliveredResults);
	};
	const reservation = await reserveDeliveryAttempt(entry.id, maxRetries, opts.stateDir);
	if (reservation.status === "exhausted") {
		const errMsg = `delivery retry budget exhausted (${reservation.attemptCount}/${maxRetries})`;
		markDurableDeliveryFailedBestEffort(entry, opts.log);
		try {
			await moveToFailed(entry.id, opts.stateDir);
		} catch (moveErr) {
			if (getErrnoCode(moveErr) === "ENOENT") return "already-gone";
			throw moveErr;
		}
		emitQueuedAuditTerminals(entry, () => queuedDeadLetterAuditTerminals(entry));
		opts.onFailed?.(entry, errMsg);
		return "moved-to-failed";
	}
	const recoverySpoolPaths = collectEntrySpoolPaths(entry.payloads, opts.stateDir);
	let mediaRecoveryLeaseId;
	try {
		mediaRecoveryLeaseId = recoverySpoolPaths.length > 0 ? createDeliveryQueueMediaRecoveryLease(recoverySpoolPaths, opts.stateDir) : void 0;
		const result = await opts.deliver({
			...buildRecoveryDeliverParams(entry, opts.cfg, opts.stateDir),
			onPayloadDeliveryOutcome: collectPayloadOutcome,
			onDeliveryResult: async (deliveryResult) => {
				collectResults([deliveryResult]);
				postSendState ??= await persistRecoveredPostSendState({
					entry,
					log: opts.log,
					stateDir: opts.stateDir
				});
			}
		});
		const results = isOutboundDeliveryResultArray(result) ? result : [];
		if (results.length > 0) {
			deliveredResults = [...results];
			if (entry.deliveryCompletion) completeDurableDelivery(entry.deliveryCompletion, results.at(-1));
		} else if (entry.deliveryCompletion) suppressDurableDelivery(entry.deliveryCompletion);
		const failedOutcomes = payloadOutcomes.filter((outcome) => outcome.status === "failed");
		const failedOutcome = failedOutcomes[0];
		if (failedOutcome) {
			const errMsg = formatErrorMessage(failedOutcome.error);
			opts.onFailed?.(entry, errMsg);
			if (results.length > 0 || failedOutcomes.some((outcome) => outcome.sentBeforeError)) {
				postSendState ??= await persistRecoveredPostSendState({
					entry,
					log: opts.log,
					stateDir: opts.stateDir
				});
				opts.log.warn(`Delivery entry ${entry.id} partially sent before best-effort recovery failed; preserving unknown_after_send`);
				if (postSendState === "acked") {
					await runCommitHooksAfterAck();
					emitQueuedAuditTerminals(entry, () => failedOutboundAuditTerminals({
						payloadCount: entry.payloads.length,
						results: deliveredResults,
						payloadOutcomes,
						failureStage: "platform_send"
					}));
				}
			} else await (failedOutcomes.every((outcome) => isProvenDeliveryNotSentError(outcome.error)) ? failDeliveryBeforePlatformSend : failDelivery)(entry.id, errMsg, opts.stateDir);
			return "failed";
		}
		postSendState ??= results.length > 0 ? await persistRecoveredPostSendState({
			entry,
			log: opts.log,
			stateDir: opts.stateDir
		}) : void 0;
		if (postSendState === "failed") {
			const errMsg = "recovered send completed but queue finalization failed";
			opts.onFailed?.(entry, errMsg);
			opts.log.warn(`Delivery entry ${entry.id} ${errMsg}; preserving unknown_after_send`);
			return "failed";
		}
		if (postSendState !== "acked") try {
			await ackDelivery(entry.id, opts.stateDir);
			postSendState = "acked";
		} catch (ackErr) {
			const ackError = `failed to ack recovered delivery: ${formatErrorMessage(ackErr)}`;
			if (results.length > 0) {
				await failDeliveryAfterPlatformSend(entry.id, ackError, opts.stateDir);
				postSendState = "failed";
			} else await failDelivery(entry.id, ackError, opts.stateDir);
			opts.onFailed?.(entry, ackError);
			opts.log.warn(`Delivery entry ${entry.id} ${ackError}`);
			return "failed";
		}
		await runCommitHooksAfterAck();
		emitQueuedAuditTerminals(entry, () => completedOutboundAuditTerminals({
			payloadCount: entry.payloads.length,
			results,
			payloadOutcomes
		}));
		opts.onRecovered?.(entry);
		return "recovered";
	} catch (err) {
		const errMsg = formatErrorMessage(err);
		opts.onFailed?.(entry, errMsg);
		if (isOutboundDeliveryError(err) && err.results.length > 0) deliveredResults = [...err.results];
		if (deliveredResults.length > 0 || postSendState !== void 0 || isOutboundDeliveryError(err) && err.sentBeforeError) {
			try {
				postSendState ??= await persistRecoveredPostSendState({
					entry,
					log: opts.log,
					stateDir: opts.stateDir
				});
			} catch (persistErr) {
				opts.log.error(`Delivery entry ${entry.id} could not persist post-send evidence: ${formatErrorMessage(persistErr)}`);
			}
			if (postSendState === "acked") {
				await runCommitHooksAfterAck();
				emitQueuedAuditTerminals(entry, () => failedOutboundAuditTerminals({
					payloadCount: entry.payloads.length,
					results: deliveredResults,
					payloadOutcomes,
					failureStage: isOutboundDeliveryError(err) ? err.stage : "platform_send"
				}));
			}
			opts.log.warn(`Delivery entry ${entry.id} partially sent before recovery failed; preserving unknown_after_send`);
			return "failed";
		}
		if (!await loadPendingDelivery(entry.id, opts.stateDir)) {
			emitQueuedAuditTerminals(entry, () => failedOutboundAuditTerminals({
				payloadCount: entry.payloads.length,
				results: deliveredResults,
				payloadOutcomes,
				failureStage: isOutboundDeliveryError(err) ? err.stage : "platform_send"
			}));
			return "failed";
		}
		const permanentPlatformRejection = findPlatformMessageRejectedError(err);
		if (permanentPlatformRejection || isPermanentDeliveryError(errMsg)) try {
			if (permanentPlatformRejection && entry.deliveryCompletion) rejectDurableDelivery(entry.deliveryCompletion, permanentPlatformRejection.message);
			else markDurableDeliveryFailedBestEffort(entry, opts.log);
			await moveToFailed(entry.id, opts.stateDir);
			emitQueuedAuditTerminals(entry, () => failedOutboundAuditTerminals({
				payloadCount: entry.payloads.length,
				results: deliveredResults,
				payloadOutcomes,
				failureStage: "queue"
			}));
			return "moved-to-failed";
		} catch (moveErr) {
			if (getErrnoCode(moveErr) === "ENOENT") return "already-gone";
		}
		else try {
			await (isProvenDeliveryNotSentError(err) ? failDeliveryBeforePlatformSend : failDelivery)(entry.id, errMsg, opts.stateDir);
			return "failed";
		} catch (failErr) {
			if (getErrnoCode(failErr) === "ENOENT") return "already-gone";
		}
		return "failed";
	} finally {
		cancelDeliveryQueueMediaRecoveryLease(mediaRecoveryLeaseId, opts.stateDir);
		if (!await loadPendingDelivery(entry.id, opts.stateDir).catch(() => entry)) await releaseSpoolArtifacts(recoverySpoolPaths, opts.stateDir);
	}
}
async function drainPendingDeliveries(opts) {
	if (drainInProgress.get(opts.drainKey)) {
		opts.log.info(`${opts.logLabel}: already in progress for ${opts.drainKey}, skipping`);
		return;
	}
	drainInProgress.set(opts.drainKey, true);
	try {
		const now = Date.now();
		const deliver = opts.deliver;
		const matchingEntries = (await loadPendingDeliveries(opts.stateDir)).filter((entry) => opts.selectEntry(entry, now).match).toSorted((a, b) => a.enqueuedAt - b.enqueuedAt);
		if (matchingEntries.length === 0) return;
		for (const entry of matchingEntries) {
			if (!claimRecoveryEntry(entriesInProgress, entry.id)) continue;
			try {
				const currentEntry = await loadPendingDelivery(entry.id, opts.stateDir);
				if (!currentEntry) {
					opts.log.info(`${opts.logLabel}: entry ${entry.id} already gone, skipping`);
					continue;
				}
				if (await applyRecoveryDeliveryAdmission({
					entry: currentEntry,
					cfg: opts.cfg,
					log: opts.log,
					stateDir: opts.stateDir,
					logLabel: opts.logLabel
				}) !== "allowed") continue;
				const currentDecision = opts.selectEntry(currentEntry, Date.now());
				if (!currentDecision.match) {
					opts.log.info(`${opts.logLabel}: entry ${currentEntry.id} no longer matches, skipping`);
					continue;
				}
				const maxRetries = resolveMaxRetries(currentEntry);
				if (resolveAttemptCount(currentEntry) >= maxRetries && !needsUnknownSendReconciliation(currentEntry)) {
					try {
						markDurableDeliveryFailedBestEffort(currentEntry, opts.log);
						await moveToFailed(currentEntry.id, opts.stateDir);
					} catch (err) {
						if (getErrnoCode(err) === "ENOENT") {
							opts.log.info(`${opts.logLabel}: entry ${currentEntry.id} already gone, skipping`);
							continue;
						}
						throw err;
					}
					emitQueuedAuditTerminals(currentEntry, () => queuedDeadLetterAuditTerminals(currentEntry));
					opts.log.warn(`${opts.logLabel}: entry ${currentEntry.id} exceeded max retries and was moved to failed/`);
					continue;
				}
				if (!currentDecision.bypassBackoff) {
					const retryEligibility = isEntryEligibleForRecoveryRetry(currentEntry, Date.now());
					if (!retryEligibility.eligible) {
						opts.log.info(`${opts.logLabel}: entry ${currentEntry.id} not ready for retry yet — backoff ${retryEligibility.remainingBackoffMs}ms remaining`);
						continue;
					}
				}
				await recoveryReplayPacer.wait();
				if (await drainQueuedEntry({
					entry: currentEntry,
					cfg: opts.cfg,
					deliver,
					log: opts.log,
					stateDir: opts.stateDir,
					onFailed: (failedEntry, errMsg) => {
						if (isPermanentDeliveryError(errMsg)) {
							opts.log.warn(`${opts.logLabel}: entry ${failedEntry.id} hit permanent error — moving to failed/: ${errMsg}`);
							return;
						}
						opts.log.warn(`${opts.logLabel}: retry failed for entry ${failedEntry.id}: ${errMsg}`);
					}
				}) === "recovered") opts.log.info(`${opts.logLabel}: drained delivery ${currentEntry.id} on ${currentEntry.channel}`);
			} finally {
				releaseRecoveryEntry(entriesInProgress, entry.id);
			}
		}
	} finally {
		drainInProgress.delete(opts.drainKey);
	}
}
/**
* On gateway startup, scan the delivery queue and retry any pending entries.
* Uses exponential backoff and moves entries that exhaust their retry budget to failed/.
*/
async function recoverPendingDeliveries(opts) {
	const pending = await loadPendingDeliveries(opts.stateDir);
	if (pending.length === 0) return createEmptyRecoverySummary();
	pending.sort((a, b) => a.enqueuedAt - b.enqueuedAt);
	opts.log.info(`Found ${pending.length} pending delivery entries — starting recovery`);
	const deadline = resolveRecoveryDeadlineMs(opts.maxRecoveryMs);
	const summary = createEmptyRecoverySummary();
	for (const entry of pending) {
		if (Date.now() >= deadline) {
			opts.log.warn(`Recovery time budget exceeded — remaining entries deferred to next startup`);
			break;
		}
		if (!claimRecoveryEntry(entriesInProgress, entry.id)) {
			opts.log.info(`Recovery skipped for delivery ${entry.id}: already being processed`);
			continue;
		}
		try {
			const currentEntry = await loadPendingDelivery(entry.id, opts.stateDir);
			if (!currentEntry) {
				opts.log.info(`Recovery skipped for delivery ${entry.id}: already gone`);
				continue;
			}
			const admission = await applyRecoveryDeliveryAdmission({
				entry: currentEntry,
				cfg: opts.cfg,
				log: opts.log,
				stateDir: opts.stateDir,
				logLabel: "Recovery"
			});
			if (admission !== "allowed") {
				if (admission === "failed") summary.failed += 1;
				continue;
			}
			const maxRetries = resolveMaxRetries(currentEntry);
			const attemptCount = resolveAttemptCount(currentEntry);
			if (attemptCount >= maxRetries && !needsUnknownSendReconciliation(currentEntry)) {
				opts.log.warn(`Delivery ${currentEntry.id} exceeded max retries (${attemptCount}/${maxRetries}) — moving to failed/`);
				if (await moveEntryToFailedWithLogging(currentEntry, opts.log, opts.stateDir)) emitQueuedAuditTerminals(currentEntry, () => queuedDeadLetterAuditTerminals(currentEntry));
				summary.skippedMaxRetries += 1;
				continue;
			}
			const currentRetryEligibility = isEntryEligibleForRecoveryRetry(currentEntry, Date.now());
			if (!currentRetryEligibility.eligible) {
				summary.deferredBackoff += 1;
				opts.log.info(`Delivery ${currentEntry.id} not ready for retry yet — backoff ${currentRetryEligibility.remainingBackoffMs}ms remaining`);
				continue;
			}
			if (await recoveryReplayPacer.wait(deadline) === "deadline-exceeded") {
				opts.log.warn(`Recovery time budget exceeded — remaining entries deferred to next startup`);
				break;
			}
			if (await drainQueuedEntry({
				entry: currentEntry,
				cfg: opts.cfg,
				deliver: opts.deliver,
				log: opts.log,
				stateDir: opts.stateDir,
				onRecovered: (recoveredEntry) => {
					summary.recovered += 1;
					opts.log.info(`Recovered delivery ${recoveredEntry.id} on ${recoveredEntry.channel}`);
				},
				onFailed: (failedEntry, errMsg) => {
					summary.failed += 1;
					if (isPermanentDeliveryError(errMsg)) {
						opts.log.warn(`Delivery ${failedEntry.id} hit permanent error — moving to failed/: ${errMsg}`);
						return;
					}
					opts.log.warn(`Retry failed for delivery ${failedEntry.id}: ${errMsg}`);
				}
			}) === "moved-to-failed") continue;
		} finally {
			releaseRecoveryEntry(entriesInProgress, entry.id);
		}
	}
	opts.log.info(`Delivery recovery complete: ${summary.recovered} recovered, ${summary.failed} failed, ${summary.skippedMaxRetries} skipped (max retries), ${summary.deferredBackoff} deferred (backoff)`);
	return summary;
}
//#endregion
export { markConversationDeliverySuppressed as A, ConversationDeliveryInputError as C, markConversationDeliveryQueued as D, getConversationDeliveryOperation as E, runOutboundDeliveryCommitHooks as M, resolveDeferredDeliveryAdmission as N, markConversationDeliveryReplied as O, suppressDurableDelivery as S, findConversationTurnDeliveryByReplyTarget as T, markDeliveryPlatformSendAttemptStarted as _, emitOutboundAuditTerminals as a, completeDurableDelivery as b, ackDelivery as c, failDelivery as d, failDeliveryAfterPlatformSend as f, markDeliveryPlatformOutcomeUnknown as g, loadPendingDelivery as h, completedOutboundAuditTerminals as i, attachOutboundDeliveryCommitHook as j, markConversationDeliverySent as k, enqueueDelivery as l, failPendingDelivery as m, recoverPendingDeliveries as n, failedOutboundAuditTerminals as o, failDeliveryBeforePlatformSend as p, withActiveDeliveryClaim as r, uniformOutboundAuditTerminals as s, drainPendingDeliveries as t, enqueueDeliveryOnce as u, markDeliveryPlatformSendDispatched as v, beginConversationDeliveryOperation as w, rejectDurableDelivery as x, reserveDeliveryAttempt as y };
