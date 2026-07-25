import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { _ as resolveSessionAgentId } from "./agent-scope-CrBA-6Gx.js";
import { m as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-CLw1UuhK.js";
import { p as stringifyRouteThreadId } from "./channel-route-SmMUmIL9.js";
import { i as mergeDeliveryContext, n as deliveryContextFromSession } from "./delivery-context.shared-D6zu5SGz.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-BlZ7xkRW.js";
import { a as normalizeChannelId, t as getChannelPlugin } from "./registry-DqyhCDsQ.js";
import "./plugins-CJcRWm9n.js";
import "./message-channel-CkiwT4Uh.js";
import { f as getRestartRecoveryTerminalDeliveryEvidence, h as hasRestartRecoveryTerminalRun, lt as parseSessionThreadInfo } from "./store-DDuGv_UJ.js";
import { o as requestHeartbeat } from "./heartbeat-wake-CH_r-5du.js";
import { a as enqueueSystemEvent } from "./system-events-BNfyhKS3.js";
import { n as resolveDurableCompletionDeliveryMode } from "./completion-delivery-policy-CWIhZg-Q.js";
import "./sessions-Uqhj6EXw.js";
import { t as resolveMainSessionKeyFromConfig } from "./main-session.runtime.js";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-vdi-rYV7.js";
import { u as loadSessionEntry } from "./session-utils-CEU0rCPC.js";
import { o as normalizeMediaReferenceForComparison } from "./reply-payloads-dedupe-BaOfB_9H.js";
import { i as finalizeUpdateRestartSentinelRunningVersion, l as readRestartSentinel, o as formatRestartSentinelMessage, r as clearRestartSentinelIfRevision, u as summarizeRestartSentinel } from "./restart-sentinel-C6N0OP2Z.js";
import { t as buildOutboundSessionContext } from "./session-context-Cq_Z7k0n.js";
import { a as getAgentCommandDeliveryFailure, c as hasCommittedOutboundDeliveryEvidence, g as hasVisibleAgentPayload, n as collectAutomaticDeliveredMediaUrls, o as getGatewayAgentResult, r as collectDeliveredMediaUrls, t as collectAmbiguousAutomaticMediaUrls, u as hasCompleteAutomaticMediaDeliveryOutcomeEvidence } from "./delivery-evidence-DV3bbMhs.js";
import { r as dispatchGatewayMethodInProcess } from "./server-plugins-Cct9l_MT.js";
import { m as formatGeneratedMediaDeliveryRetryForPrompt } from "./subagent-announce-origin-DHldKZbu.js";
import { a as SessionDeliveryRetryChargedError, c as deferSessionDelivery, d as failSessionDelivery, h as markSessionDeliverySettlement, i as SessionDeliveryDeferredError, m as markSessionDeliveryAttemptStarted, n as recoverPendingSessionDeliveries, o as SessionDeliverySafeRetryError, p as loadPendingSessionDelivery, r as SessionDeliveryDeadLetteredError, s as advanceSessionDeliveryAgentRun, t as drainPendingSessionDeliveries, u as enqueueSessionDelivery } from "./session-delivery-queue-C4JZF_kR.js";
import { i as findPlatformMessageRejectedError, o as isProvenDeliveryNotSentError } from "./delivery-recovery.shared-BSGS9PhE.js";
import { t as removeCronRunContinuationSessionIfIdle } from "./cron-run-continuation-cleanup-CQsZgw8_.js";
import { n as deliverOutboundPayloadsInternal } from "./deliver-Cui1uOGS.js";
import { c as ackDelivery, d as failDelivery, f as failDeliveryAfterPlatformSend, h as loadPendingDelivery, m as failPendingDelivery, p as failDeliveryBeforePlatformSend, r as withActiveDeliveryClaim, t as drainPendingDeliveries, u as enqueueDeliveryOnce, y as reserveDeliveryAttempt } from "./delivery-queue-DVpPvbwA.js";
import { t as sendDurableMessageBatch } from "./runtime-CzinzbLb.js";
import { i as resolveOutboundTarget } from "./targets-B6GGowJc.js";
import { t as finalizeInboundContext } from "./inbound-context-DpKaYErg.js";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./provider-dispatcher-DTnCRsl7.js";
import { t as dispatchAssembledChannelTurn } from "./kernel-BM-Mkfv5.js";
import { t as recordInboundSession } from "./session-yxeGbX83.js";
import "./get-reply-run-queue-B0s_Ucm8.js";
import { t as runStartupTasks } from "./startup-tasks-D6ofdb0B.js";
import { a as isPendingControlPlaneUpdateRestartSentinel } from "./update-control-plane-sentinel-ByRELXRQ.js";
//#region src/gateway/server-restart-sentinel-agent-delivery.ts
const log$2 = createSubsystemLogger("gateway/restart-sentinel");
const AGENT_DELIVERY_OWNERSHIP_RETRY_MS = 1e3;
function sessionDeliveryStateDirArgs$1(stateDir) {
	return stateDir === void 0 ? [] : [stateDir];
}
async function deadLetterSessionDelivery(entry, reason, stateDir) {
	await markSessionDeliverySettlement(entry, "moved-to-failed", ...sessionDeliveryStateDirArgs$1(stateDir));
	log$2.warn("queued session delivery requires durable dead-letter settlement", { queueId: entry.id });
	throw new SessionDeliveryDeadLetteredError(reason);
}
function hasQueuedVisiblePayload(payload) {
	if (payload && typeof payload === "object" && !Array.isArray(payload)) {
		const visible = payload.visible;
		if (typeof visible === "boolean") return visible;
	}
	return hasVisibleAgentPayload({ payloads: [payload] }, {
		includeErrorPayloads: false,
		includeReasoningPayloads: false
	});
}
function hasQueuedVisibleAgentPayload(result) {
	return Array.isArray(result.payloads) && result.payloads.some(hasQueuedVisiblePayload);
}
function hasUnexpectedRecoverySideEffects(result) {
	return result.restartUnsafeSideEffectsDetected === true || result.messagingToolAggregateEvidenceUnaccounted === true || result.messagingToolSentTargetsTruncated === true || result.didSendDeterministicApprovalPrompt === true || hasCommittedOutboundDeliveryEvidence(result);
}
function resolveQueuedAgentRunId(entry) {
	const base = entry.idempotencyKey ?? entry.messageId;
	return entry.agentRunAttempt ? `${base}:attempt:${entry.agentRunAttempt}` : base;
}
function collectVisiblePayloadMediaUrls(result) {
	const urls = /* @__PURE__ */ new Set();
	const payloads = Array.isArray(result.payloads) ? result.payloads : [];
	for (const payload of payloads) {
		if (!hasQueuedVisiblePayload(payload)) continue;
		for (const url of collectDeliveredMediaUrls({ payloads: [payload] })) urls.add(url);
	}
	return Array.from(urls);
}
function collectQueuedDeliveredMediaUrls(params) {
	if (params.route.channel === "webchat") return collectVisiblePayloadMediaUrls(params.result);
	return collectAutomaticDeliveredMediaUrls(params.result);
}
function hasAutomaticVisibleSendEvidence(result) {
	if (result.deliveryStatus?.status === "sent" || result.deliveryStatus?.status === "suppressed") return hasQueuedVisibleAgentPayload(result);
	const payloads = Array.isArray(result.payloads) ? result.payloads : [];
	return (Array.isArray(result.deliveryStatus?.payloadOutcomes) ? result.deliveryStatus.payloadOutcomes : []).some((outcome) => {
		if (!outcome || typeof outcome !== "object" || Array.isArray(outcome)) return false;
		const record = outcome;
		if (record.status !== "sent" && record.status !== "suppressed" && record.sentBeforeError !== true) return false;
		const index = typeof record.index === "number" && Number.isInteger(record.index) ? record.index : void 0;
		return index !== void 0 && hasQueuedVisiblePayload(payloads[index]);
	});
}
function hasQueuedVisibleReplyEvidence(params) {
	if (params.route.channel === "webchat") return hasQueuedVisibleAgentPayload(params.result);
	return hasAutomaticVisibleSendEvidence(params.result);
}
async function evaluateQueuedGeneratedMediaAgentResult(params) {
	if (hasUnexpectedRecoverySideEffects(params.result)) {
		log$2.warn("queued generated-media recovery reported an unexpected committed side effect", { queueId: params.entry.id });
		await deadLetterSessionDelivery(params.entry, "queued generated-media delivery dead-lettered after an unexpected committed side effect", params.stateDir);
	}
	const expectedMediaUrls = params.entry.expectedMediaUrls ?? [];
	const deliveredMediaUrls = new Set(collectQueuedDeliveredMediaUrls(params).map(normalizeMediaReferenceForComparison));
	const isDelivered = (url) => deliveredMediaUrls.has(normalizeMediaReferenceForComparison(url));
	const missingMediaUrls = expectedMediaUrls.filter((url) => !isDelivered(url));
	const provenExpectedMediaUrls = expectedMediaUrls.filter(isDelivered);
	const ambiguousMediaUrls = new Set(collectAmbiguousAutomaticMediaUrls(params.result).map(normalizeMediaReferenceForComparison));
	const deliveryFailure = getAgentCommandDeliveryFailure(params.result);
	const replySatisfied = expectedMediaUrls.length > 0 ? missingMediaUrls.length === 0 : hasQueuedVisibleReplyEvidence(params);
	if (params.result.payloadsTruncated === true && !replySatisfied) {
		log$2.warn("queued generated-media delivery has truncated delivery evidence", { queueId: params.entry.id });
		await deadLetterSessionDelivery(params.entry, "queued generated-media delivery dead-lettered after truncated evidence", params.stateDir);
	}
	if (expectedMediaUrls.length > 0 && missingMediaUrls.length === 0) {
		await params.persistInternalMedia?.(provenExpectedMediaUrls);
		return;
	}
	const rearmAgentRun = async (reason, updates) => {
		const currentAgentRunAttempt = params.entry.agentRunAttempt ?? 0;
		if (!(params.entry.lastChargedAgentRunAttempt === currentAgentRunAttempt)) await failSessionDelivery(params.entry.id, reason, ...sessionDeliveryStateDirArgs$1(params.stateDir));
		try {
			if (updates) await advanceSessionDeliveryAgentRun(params.entry.id, updates, ...sessionDeliveryStateDirArgs$1(params.stateDir));
			else if (params.stateDir !== void 0) await advanceSessionDeliveryAgentRun(params.entry.id, void 0, params.stateDir);
			else await advanceSessionDeliveryAgentRun(params.entry.id);
			await deferSessionDelivery(params.entry.id, AGENT_DELIVERY_OWNERSHIP_RETRY_MS, ...sessionDeliveryStateDirArgs$1(params.stateDir));
		} catch (error) {
			log$2.warn("queued generated-media terminal attempt state transition remains pending", {
				queueId: params.entry.id,
				error: String(error)
			});
			throw new SessionDeliveryRetryChargedError(`${reason}; queue state transition failed after retry charge`);
		}
		throw new SessionDeliveryDeferredError(reason);
	};
	if (deliveryFailure && expectedMediaUrls.length > 0) {
		if (params.result.deliveryStatus?.status === "partial_failed" && !hasCompleteAutomaticMediaDeliveryOutcomeEvidence(params.result, missingMediaUrls) || missingMediaUrls.some((url) => ambiguousMediaUrls.has(normalizeMediaReferenceForComparison(url)))) {
			log$2.warn("queued generated-media delivery has ambiguous attachment side effects", {
				queueId: params.entry.id,
				error: deliveryFailure
			});
			await deadLetterSessionDelivery(params.entry, "queued generated-media delivery dead-lettered after ambiguous side effects", params.stateDir);
		}
	} else if (deliveryFailure) {
		if (hasQueuedVisibleReplyEvidence(params)) {
			log$2.warn("queued generated-media notice may already be visible; refusing duplicate replay", {
				queueId: params.entry.id,
				error: deliveryFailure
			});
			await deadLetterSessionDelivery(params.entry, "queued generated-media notice dead-lettered after a visible partial delivery", params.stateDir);
		}
		await rearmAgentRun(deliveryFailure);
	}
	if (provenExpectedMediaUrls.length > 0) await params.persistInternalMedia?.(provenExpectedMediaUrls);
	if (missingMediaUrls.length > 0) {
		const retryMessage = formatGeneratedMediaDeliveryRetryForPrompt(missingMediaUrls);
		await rearmAgentRun(`queued generated-media agent turn ${missingMediaUrls.length < expectedMediaUrls.length ? "partially missed" : "missed"} expected media: ${missingMediaUrls.join(", ")}`, {
			expectedMediaUrls: missingMediaUrls,
			...missingMediaUrls.length < expectedMediaUrls.length || hasQueuedVisibleReplyEvidence(params) || params.result.deliveryStatus?.status === "partial_failed" ? { suppressTextDelivery: true } : {},
			...retryMessage ? { message: retryMessage } : {}
		});
	}
	if (expectedMediaUrls.length === 0 && !hasQueuedVisibleReplyEvidence(params)) await rearmAgentRun("queued generated-media agent turn completed without a visible reply");
}
/** Runs durable generated-media handoffs through the normal owning-session agent loop. */
async function deliverQueuedGeneratedMediaAgentTurn(params) {
	if (params.entry.kind !== "agentTurn") return false;
	const entry = params.entry;
	const route = entry.route;
	if (!route || entry.inputProvenance?.kind !== "inter_session" || !entry.sourceReplyDeliveryMode) return false;
	const queuedRunId = resolveQueuedAgentRunId(entry);
	if (resolveDurableCompletionDeliveryMode(entry.sourceReplyDeliveryMode) === "host_owned" && route.channel === "webchat") return await deadLetterSessionDelivery(entry, "queued host-owned generated-media delivery requires an external route", params.stateDir);
	const persistInternalMedia = route.channel === "webchat" && (entry.expectedMediaUrls?.length ?? 0) > 0 ? async (mediaUrls) => {
		const sessionId = params.sessionEntry?.sessionId?.trim();
		if (!sessionId) throw new Error("queued internal generated-media delivery has no owning session");
		const appended = await appendAssistantMessageToSessionTranscript({
			sessionKey: params.canonicalKey,
			expectedSessionId: sessionId,
			...params.sessionEntry?.cronRunContinuation?.lifecycleRevision ? { expectedLifecycleRevision: params.sessionEntry.cronRunContinuation.lifecycleRevision } : {},
			mediaUrls,
			idempotencyKey: `${queuedRunId}:generated-media-transcript`,
			updateMode: "inline"
		});
		if (!appended.ok) {
			if (appended.code === "session-rebound") await deadLetterSessionDelivery(entry, "queued internal generated-media delivery lost its owning session", params.stateDir);
			throw new Error(`queued internal generated-media transcript persistence failed: ${appended.reason}`);
		}
	} : void 0;
	const evaluateResult = async (result) => {
		await evaluateQueuedGeneratedMediaAgentResult({
			entry,
			result,
			route,
			...params.stateDir !== void 0 ? { stateDir: params.stateDir } : {},
			...persistInternalMedia ? { persistInternalMedia } : {}
		});
		return true;
	};
	const terminalEvidence = getRestartRecoveryTerminalDeliveryEvidence(params.sessionEntry, queuedRunId);
	if (terminalEvidence) return await evaluateResult(terminalEvidence);
	if (hasRestartRecoveryTerminalRun(params.sessionEntry, queuedRunId)) await deadLetterSessionDelivery(entry, "queued generated-media agent turn dead-lettered without durable terminal evidence", params.stateDir);
	if (params.sessionEntry?.restartRecoveryDeliverySourceRunId === queuedRunId && Boolean(params.sessionEntry.restartRecoveryDeliveryRunId)) {
		await deferSessionDelivery(entry.id, AGENT_DELIVERY_OWNERSHIP_RETRY_MS, ...sessionDeliveryStateDirArgs$1(params.stateDir));
		throw new SessionDeliveryDeferredError("queued generated-media agent turn is still owned by agent recovery");
	}
	if (entry.deliveryStartedAt !== void 0) await deadLetterSessionDelivery(entry, "queued generated-media agent turn dead-lettered after an interrupted unproven attempt", params.stateDir);
	const sourceReplyDeliveryMode = "automatic";
	const cronSessionId = params.sessionEntry?.cronRunContinuation?.lifecycleRevision?.trim() ? params.sessionEntry?.sessionId?.trim() : void 0;
	await markSessionDeliveryAttemptStarted(entry, ...sessionDeliveryStateDirArgs$1(params.stateDir));
	let accepted = false;
	let response;
	try {
		response = await dispatchGatewayMethodInProcess("agent", {
			sessionKey: params.canonicalKey,
			message: entry.message,
			deliver: route.channel !== INTERNAL_MESSAGE_CHANNEL,
			bestEffortDeliver: false,
			channel: route.channel,
			accountId: route.accountId,
			to: route.to,
			threadId: route.threadId,
			...cronSessionId ? { sessionId: cronSessionId } : {},
			inputProvenance: entry.inputProvenance,
			sourceReplyDeliveryMode,
			disableMessageTool: true,
			forceRestartSafeTools: true,
			idempotencyKey: queuedRunId
		}, {
			...cronSessionId ? { allowSyntheticCronRunContinuation: true } : {},
			expectFinal: true,
			forceSyntheticClient: true,
			internalDeliveryMediaUrls: entry.expectedMediaUrls ?? [],
			...entry.suppressTextDelivery === true ? { internalDeliverySuppressText: true } : {},
			onAccepted: () => {
				accepted = true;
			}
		});
	} catch (error) {
		if (!accepted) throw new SessionDeliverySafeRetryError("queued generated-media agent turn failed before gateway acceptance", { cause: error });
		throw error;
	}
	const result = getGatewayAgentResult(response);
	if (!result) {
		const responseStatus = response && typeof response === "object" ? response.status : void 0;
		const latestEntry = loadSessionEntry(entry.sessionKey).entry;
		if (responseStatus === "accepted") accepted = true;
		if (responseStatus === "accepted" || responseStatus === "in_flight" || latestEntry?.restartRecoveryDeliverySourceRunId === queuedRunId && latestEntry.restartRecoveryDeliveryRunId) {
			await deferSessionDelivery(entry.id, AGENT_DELIVERY_OWNERSHIP_RETRY_MS, ...sessionDeliveryStateDirArgs$1(params.stateDir));
			throw new SessionDeliveryDeferredError("queued generated-media agent turn is still owned by agent recovery");
		}
		if (hasRestartRecoveryTerminalRun(latestEntry, queuedRunId)) {
			const latestTerminalEvidence = getRestartRecoveryTerminalDeliveryEvidence(latestEntry, queuedRunId);
			if (latestTerminalEvidence) return await evaluateResult(latestTerminalEvidence);
			log$2.warn("queued generated-media agent turn ended without durable delivery evidence; failing closed", {
				queueId: entry.id,
				runId: queuedRunId
			});
			await deadLetterSessionDelivery(entry, "queued generated-media agent turn dead-lettered without durable terminal evidence", params.stateDir);
		}
		if (!accepted) throw new SessionDeliverySafeRetryError("queued generated-media agent turn returned no result before gateway acceptance");
		throw new Error("queued generated-media agent turn returned no delivery result");
	}
	return await evaluateResult(result);
}
//#endregion
//#region src/gateway/server-restart-sentinel-notice.ts
const log$1 = createSubsystemLogger("gateway/restart-sentinel");
const RESTART_NOTICE_RECOVERY_DELAY_MS = process.env.VITEST ? 1 : 1e3;
const RESTART_NOTICE_MAX_ATTEMPTS = 45;
const RESTART_NOTICE_RECOVERY_MAX_CYCLES = 46;
async function enqueueRestartSentinelNotice(params) {
	return await enqueueDeliveryOnce({
		channel: params.channel,
		to: params.to,
		accountId: params.accountId,
		replyToId: params.replyToId,
		threadId: params.threadId,
		payloads: [{ text: params.message }],
		bestEffort: false,
		completionRetention: "permanent",
		maxRetries: RESTART_NOTICE_MAX_ATTEMPTS
	}, `restart-sentinel-notice:${params.sessionKey}:${params.revision}`);
}
async function waitForRecoveryDrain() {
	await new Promise((resolve) => {
		setTimeout(resolve, RESTART_NOTICE_RECOVERY_DELAY_MS).unref?.();
	});
}
async function drainFailedRestartSentinelNotice(params) {
	for (let cycle = 1; cycle <= RESTART_NOTICE_RECOVERY_MAX_CYCLES; cycle += 1) {
		const beforeDrain = await loadPendingDelivery(params.queueId).catch((error) => {
			log$1.warn(`${params.summary}: restart notice recovery reload failed: ${String(error)}`, {
				queueId: params.queueId,
				sessionKey: params.sessionKey,
				cycle
			});
		});
		if (beforeDrain === null) return;
		if ((beforeDrain ? Math.max(beforeDrain.attemptCount ?? 0, beforeDrain.retryCount) : 0) < RESTART_NOTICE_MAX_ATTEMPTS) await waitForRecoveryDrain();
		await drainPendingDeliveries({
			drainKey: `restart-recovery:${params.queueId}`,
			logLabel: `${params.summary}: restart notice recovery`,
			cfg: params.cfg,
			log: log$1,
			deliver: deliverOutboundPayloadsInternal,
			selectEntry: (entry) => ({
				match: entry.id === params.queueId,
				bypassBackoff: true
			})
		}).catch((error) => {
			log$1.warn(`${params.summary}: restart notice recovery drain failed: ${String(error)}`, {
				queueId: params.queueId,
				sessionKey: params.sessionKey,
				cycle
			});
		});
	}
	const pending = await loadPendingDelivery(params.queueId).catch((error) => {
		log$1.warn(`${params.summary}: restart notice terminal reload failed: ${String(error)}`, {
			queueId: params.queueId,
			sessionKey: params.sessionKey
		});
	});
	if (pending === null) return;
	log$1.warn(`${params.summary}: restart notice remains queued after bounded recovery`, {
		queueId: params.queueId,
		sessionKey: params.sessionKey,
		retryCount: pending?.retryCount ?? null,
		attemptCount: pending?.attemptCount ?? null,
		maxAttempts: RESTART_NOTICE_MAX_ATTEMPTS
	});
}
async function deliverRestartSentinelNotice(params) {
	const claim = await withActiveDeliveryClaim(params.queueId, async () => {
		try {
			if ((await reserveDeliveryAttempt(params.queueId, RESTART_NOTICE_MAX_ATTEMPTS)).status === "exhausted") return false;
		} catch (err) {
			log$1.warn(`${params.summary}: outbound delivery attempt reservation failed; queued for recovery: ${formatErrorMessage(err)}`, {
				channel: params.channel,
				to: params.to,
				sessionKey: params.sessionKey
			});
			return false;
		}
		try {
			const send = await sendDurableMessageBatch({
				cfg: params.cfg,
				channel: params.channel,
				to: params.to,
				accountId: params.accountId,
				replyToId: params.replyToId,
				threadId: params.threadId,
				payloads: [{ text: params.message }],
				session: buildOutboundSessionContext({
					cfg: params.cfg,
					sessionKey: params.sessionKey
				}),
				deps: params.deps,
				bestEffort: false,
				skipQueue: true,
				deliveryQueueId: params.queueId
			});
			if (send.status === "failed" || send.status === "partial_failed") throw send.error;
			if ((send.status === "sent" ? send.results : []).length === 0) throw new Error("outbound delivery returned no results");
			try {
				await ackDelivery(params.queueId);
				return true;
			} catch (err) {
				const error = formatErrorMessage(err);
				await failDeliveryAfterPlatformSend(params.queueId, error).catch(() => void 0);
				log$1.warn(`${params.summary}: outbound delivery ack failed; queued for recovery: ${error}`, {
					channel: params.channel,
					to: params.to,
					sessionKey: params.sessionKey
				});
				return false;
			}
		} catch (err) {
			const error = formatErrorMessage(err);
			if (findPlatformMessageRejectedError(err)) {
				try {
					const pending = await loadPendingDelivery(params.queueId);
					if (pending) await failPendingDelivery({
						id: params.queueId,
						expectedStatus: "pending",
						lastError: error,
						entry: pending
					});
				} catch (persistError) {
					log$1.warn(`${params.summary}: permanent rejection persistence failed; queued for recovery: ${formatErrorMessage(persistError)}`, {
						channel: params.channel,
						to: params.to,
						sessionKey: params.sessionKey
					});
					return false;
				}
				log$1.warn(`${params.summary}: outbound delivery permanently rejected: ${error}`, {
					channel: params.channel,
					to: params.to,
					sessionKey: params.sessionKey
				});
				return true;
			}
			await (isProvenDeliveryNotSentError(err) ? failDeliveryBeforePlatformSend : failDelivery)(params.queueId, error).catch(() => void 0);
			log$1.warn(`${params.summary}: outbound delivery failed; queued for recovery: ${String(err)}`, {
				channel: params.channel,
				to: params.to,
				sessionKey: params.sessionKey
			});
			return false;
		}
	});
	if (claim.status === "claimed-by-other-owner") log$1.info(`${params.summary}: durable restart notice claimed by recovery`, { sessionKey: params.sessionKey });
	if (claim.status === "claimed-by-other-owner" || claim.status === "claimed" && !claim.value) await drainFailedRestartSentinelNotice({
		cfg: params.cfg,
		queueId: params.queueId,
		sessionKey: params.sessionKey,
		summary: params.summary
	});
}
//#endregion
//#region src/gateway/server-restart-sentinel.ts
const log = createSubsystemLogger("gateway/restart-sentinel");
const RESTART_CONTINUATION_BUSY_RETRY_DELAY_MS = process.env.VITEST ? 1 : 6e3;
const RESTART_CONTINUATION_BUSY_MAX_ATTEMPTS = 20;
const CONTROL_PLANE_UPDATE_PENDING_RETRY_DELAY_MS = process.env.VITEST ? 1 : 2e3;
const CONTROL_PLANE_UPDATE_PENDING_MAX_ATTEMPTS = 900;
const RESTART_CONTINUATION_BUSY_RETRY_ERROR = "restart continuation deferred because previous run is still shutting down";
let latestUpdateRestartSentinel = null;
function sessionDeliveryStateDirArgs(stateDir) {
	return stateDir === void 0 ? [] : [stateDir];
}
function cloneRestartSentinelPayload(payload) {
	if (!payload) return null;
	return structuredClone(payload);
}
function hasRoutableDeliveryContext(context) {
	return Boolean(context?.channel && context?.to);
}
function enqueueRestartSentinelWake(message, sessionKey, deliveryContext) {
	enqueueSystemEvent(message, {
		sessionKey,
		...deliveryContext ? { deliveryContext } : {}
	});
	requestHeartbeat({
		source: "restart-sentinel",
		intent: "immediate",
		reason: "wake",
		sessionKey
	});
}
async function waitForRetry(delayMs) {
	await new Promise((resolve) => {
		setTimeout(resolve, delayMs).unref?.();
	});
}
function buildRestartContinuationMessageId(params) {
	return `restart-sentinel:${params.sessionKey}:${params.kind}:${params.revision}`;
}
function resolveRestartContinuationRoute(params) {
	if (!params.channel || !params.to) return;
	return {
		channel: params.channel,
		to: params.to,
		...params.accountId ? { accountId: params.accountId } : {},
		...params.replyToId ? { replyToId: params.replyToId } : {},
		...params.threadId ? { threadId: params.threadId } : {},
		chatType: params.chatType
	};
}
function isRestartContinuationBusyPayload(payload) {
	return typeof payload.text === "string" && payload.text.trim() === "⚠️ Previous run is still shutting down. Please try again in a moment.";
}
function isRestartContinuationBusyRetry(entry) {
	return entry?.lastError === RESTART_CONTINUATION_BUSY_RETRY_ERROR;
}
function resolveQueuedRestartContinuationMessageId(entry) {
	if (isRestartContinuationBusyRetry(entry) && entry.retryCount > 0) return `${entry.messageId}:retry:${entry.retryCount}`;
	return entry.messageId;
}
function resolveQueuedSessionDeliveryContext(entry) {
	if (entry.kind === "agentTurn" && entry.route) return {
		channel: entry.route.channel,
		to: entry.route.to,
		...entry.route.accountId ? { accountId: entry.route.accountId } : {},
		...entry.route.threadId ? { threadId: entry.route.threadId } : {}
	};
	return entry.deliveryContext;
}
async function deliverQueuedSessionDelivery(params) {
	const { cfg, entry, storePath, canonicalKey } = loadSessionEntry(params.entry.sessionKey);
	const queuedDeliveryContext = resolveQueuedSessionDeliveryContext(params.entry);
	if (params.entry.kind === "systemEvent") {
		enqueueRestartSentinelWake(params.entry.text, canonicalKey, queuedDeliveryContext);
		return;
	}
	if (params.entry.expectedSessionId && (!entry?.sessionId || entry.sessionId !== params.entry.expectedSessionId)) {
		log.warn("restart continuation skipped: session changed", {
			sessionKey: canonicalKey,
			queueId: params.entry.id,
			expectedSessionId: params.entry.expectedSessionId,
			actualSessionId: entry?.sessionId ?? null
		});
		enqueueRestartSentinelWake(params.entry.message, canonicalKey, queuedDeliveryContext);
		return;
	}
	if (!params.entry.route) {
		enqueueRestartSentinelWake(params.entry.message, canonicalKey, queuedDeliveryContext);
		return;
	}
	if (await deliverQueuedGeneratedMediaAgentTurn({
		entry: params.entry,
		canonicalKey,
		sessionEntry: entry,
		...params.stateDir !== void 0 ? { stateDir: params.stateDir } : {}
	})) return;
	if (params.entry.deliveryStartedAt !== void 0) {
		await markSessionDeliverySettlement(params.entry, "moved-to-failed", ...sessionDeliveryStateDirArgs(params.stateDir));
		throw new SessionDeliveryDeadLetteredError("queued agent turn dead-lettered after an interrupted unproven attempt");
	}
	const route = params.entry.route;
	const messageId = resolveQueuedRestartContinuationMessageId(params.entry);
	const userMessage = params.entry.message.trim();
	const agentId = resolveSessionAgentId({
		sessionKey: canonicalKey,
		config: cfg
	});
	let dispatchError;
	const ctxPayload = finalizeInboundContext({
		Body: userMessage,
		BodyForAgent: userMessage,
		BodyForCommands: "",
		RawBody: userMessage,
		CommandBody: "",
		SessionKey: canonicalKey,
		AccountId: route.accountId,
		MessageSid: messageId,
		Timestamp: Date.now(),
		InputProvenance: {
			kind: "internal_system",
			sourceChannel: route.channel,
			sourceTool: "restart-sentinel"
		},
		Provider: INTERNAL_MESSAGE_CHANNEL,
		Surface: INTERNAL_MESSAGE_CHANNEL,
		ChatType: route.chatType,
		CommandAuthorized: true,
		GatewayClientScopes: ["operator.admin"],
		GatewayClientCaps: [],
		ReplyToId: route.replyToId,
		OriginatingChannel: route.channel,
		OriginatingTo: route.to,
		ExplicitDeliverRoute: false,
		MessageThreadId: route.threadId
	}, {
		forceBodyForCommands: true,
		forceChatType: true
	});
	await dispatchAssembledChannelTurn({
		cfg,
		channel: route.channel,
		accountId: route.accountId,
		agentId,
		routeSessionKey: canonicalKey,
		storePath,
		ctxPayload,
		recordInboundSession,
		dispatchReplyWithBufferedBlockDispatcher,
		replyOptions: { sourceReplyDeliveryMode: "message_tool_only" },
		turnAdoptionLifecycle: {
			admission: "cancel-only",
			onAdopted: () => markSessionDeliveryAttemptStarted(params.entry, ...sessionDeliveryStateDirArgs(params.stateDir))
		},
		delivery: {
			preparePayload: (payload) => {
				if (isRestartContinuationBusyPayload(payload)) throw new SessionDeliverySafeRetryError(RESTART_CONTINUATION_BUSY_RETRY_ERROR);
				return payload;
			},
			durable: false,
			deliver: async () => ({ visibleReplySent: false }),
			onError: (err, info) => {
				dispatchError ??= err;
				log.warn(`restart continuation dispatch failed during ${info.kind}: ${String(err)}`, { sessionKey: canonicalKey });
			}
		},
		record: { onRecordError: (err) => {
			log.warn(`restart continuation failed to record inbound session metadata: ${String(err)}`, { sessionKey: canonicalKey });
		} }
	});
	if (dispatchError) throw toErrorObject(dispatchError, "Non-Error thrown");
}
function buildQueuedRestartContinuation(params) {
	const idempotencyKey = params.idempotencyKey ?? buildRestartContinuationMessageId({
		sessionKey: params.sessionKey,
		kind: params.continuation.kind,
		revision: params.revision
	});
	if (params.continuation.kind === "systemEvent") return {
		kind: "systemEvent",
		sessionKey: params.sessionKey,
		text: params.continuation.text,
		...params.deliveryContext ? { deliveryContext: params.deliveryContext } : {},
		idempotencyKey,
		maxRetries: RESTART_CONTINUATION_BUSY_MAX_ATTEMPTS,
		completionRetention: "permanent"
	};
	return {
		kind: "agentTurn",
		sessionKey: params.sessionKey,
		message: params.continuation.message,
		messageId: idempotencyKey,
		...params.expectedSessionId ? { expectedSessionId: params.expectedSessionId } : {},
		maxRetries: RESTART_CONTINUATION_BUSY_MAX_ATTEMPTS,
		completionRetention: "permanent",
		...params.route ? { route: params.route } : {},
		...params.deliveryContext ? { deliveryContext: params.deliveryContext } : {},
		idempotencyKey
	};
}
async function drainRestartContinuationQueue(params) {
	for (let attempt = 1; attempt <= RESTART_CONTINUATION_BUSY_MAX_ATTEMPTS; attempt += 1) {
		await drainPendingSessionDeliveries({
			drainKey: `restart-continuation:${params.entryId}`,
			logLabel: "restart continuation",
			log: params.log,
			deliver: (entry, context = {}) => deliverQueuedSessionDelivery({
				deps: params.deps,
				entry,
				...context.stateDir !== void 0 ? { stateDir: context.stateDir } : {}
			}),
			onSettled: (entry) => removeCronRunContinuationSessionIfIdle(entry.sessionKey, entry.id),
			selectEntry: (entry) => ({
				match: entry.id === params.entryId,
				bypassBackoff: true
			})
		});
		if (!isRestartContinuationBusyRetry(await loadPendingSessionDelivery(params.entryId))) return;
		if (attempt >= RESTART_CONTINUATION_BUSY_MAX_ATTEMPTS) return;
		params.log.info(`restart continuation: entry ${params.entryId} still waiting for the previous run to clear; retrying in ${RESTART_CONTINUATION_BUSY_RETRY_DELAY_MS}ms`);
		await waitForRetry(RESTART_CONTINUATION_BUSY_RETRY_DELAY_MS);
	}
}
async function recoverPendingRestartContinuationDeliveries(params) {
	await recoverPendingSessionDeliveries({
		deliver: (entry, context = {}) => deliverQueuedSessionDelivery({
			deps: params.deps,
			entry,
			...context.stateDir !== void 0 ? { stateDir: context.stateDir } : {}
		}),
		log: params.log ?? log,
		maxEnqueuedAt: params.maxEnqueuedAt,
		onSettled: (entry) => removeCronRunContinuationSessionIfIdle(entry.sessionKey, entry.id)
	});
}
async function loadRestartSentinelStartupTask(params) {
	const sentinel = await readRestartSentinel();
	if (!sentinel) return null;
	const payload = sentinel.payload;
	const sentinelRevision = sentinel.revision;
	if (payload.kind === "update") recordLatestUpdateRestartSentinel(payload);
	const sessionKey = payload.sessionKey?.trim();
	const message = formatRestartSentinelMessage(payload);
	const summary = summarizeRestartSentinel(payload);
	const wakeDeliveryContext = mergeDeliveryContext(payload.threadId != null ? {
		...payload.deliveryContext,
		threadId: payload.threadId
	} : payload.deliveryContext, void 0);
	const run = async () => {
		if (isPendingControlPlaneUpdateRestartSentinel(payload)) {
			const attempt = params.attempt ?? 0;
			if (attempt < CONTROL_PLANE_UPDATE_PENDING_MAX_ATTEMPTS) {
				setTimeout(() => {
					runWithGatewayIndependentRootWorkAdmission(async () => {
						await scheduleRestartSentinelWakeAttempt({
							deps: params.deps,
							attempt: attempt + 1
						});
					}).catch((err) => {
						log.warn(`restart sentinel pending update retry failed: ${formatErrorMessage(err)}`);
					});
				}, CONTROL_PLANE_UPDATE_PENDING_RETRY_DELAY_MS).unref?.();
				return {
					status: "skipped",
					reason: "update-restart-pending"
				};
			}
			log.warn(`${summary}: update restart sentinel remained pending after retry window`, {
				sessionKey,
				reason: payload.stats?.reason ?? null
			});
		}
		if (!sessionKey) {
			const mainSessionKey = resolveMainSessionKeyFromConfig();
			const wakeQueueId = await enqueueSessionDelivery(buildQueuedRestartContinuation({
				sessionKey: mainSessionKey,
				continuation: {
					kind: "systemEvent",
					text: message
				},
				revision: sentinelRevision,
				idempotencyKey: `restart-sentinel-wake:${mainSessionKey}:${sentinelRevision}`
			}));
			if (payload.continuation) log.warn(`${summary}: continuation skipped: restart sentinel sessionKey unavailable`, {
				sessionKey: mainSessionKey,
				continuationKind: payload.continuation.kind
			});
			if (!await clearRestartSentinelIfRevision(sentinelRevision)) log.info(`${summary}: newer restart sentinel preserved while draining durable wake`);
			await drainRestartContinuationQueue({
				deps: params.deps,
				entryId: wakeQueueId,
				log
			});
			return { status: "ran" };
		}
		const { baseSessionKey, threadId: sessionThreadId } = parseSessionThreadInfo(sessionKey);
		const { cfg, entry, canonicalKey } = loadSessionEntry(sessionKey);
		const sentinelContext = payload.deliveryContext;
		let sessionDeliveryContext = deliveryContextFromSession(entry);
		let chatType = entry?.origin?.chatType ?? "direct";
		if (!hasRoutableDeliveryContext(sessionDeliveryContext) && baseSessionKey && baseSessionKey !== sessionKey) {
			const { entry: baseEntry } = loadSessionEntry(baseSessionKey);
			chatType = entry?.origin?.chatType ?? baseEntry?.origin?.chatType ?? "direct";
			sessionDeliveryContext = mergeDeliveryContext(sessionDeliveryContext, deliveryContextFromSession(baseEntry));
		}
		const origin = mergeDeliveryContext(sentinelContext, sessionDeliveryContext);
		const channelRaw = origin?.channel;
		const channel = channelRaw ? normalizeChannelId(channelRaw) : null;
		const to = origin?.to;
		const threadId = payload.threadId ?? sessionThreadId ?? (origin?.threadId != null ? stringifyRouteThreadId(origin.threadId) : void 0);
		let resolvedTo;
		let replyToId;
		let resolvedThreadId = threadId;
		let continuationQueueId;
		let wakeQueueId;
		let noticeQueueId;
		let noticeQueueCreated = false;
		let continuationRoute;
		if (channel && to) {
			const resolved = resolveOutboundTarget({
				channel,
				to,
				cfg,
				accountId: origin?.accountId,
				mode: "implicit"
			});
			if (resolved.ok) {
				resolvedTo = resolved.to;
				const replyTransport = getChannelPlugin(channel)?.threading?.resolveReplyTransport?.({
					cfg,
					accountId: origin?.accountId,
					threadId
				}) ?? null;
				replyToId = replyTransport?.replyToId ?? void 0;
				resolvedThreadId = replyTransport && Object.hasOwn(replyTransport, "threadId") ? replyTransport.threadId != null ? stringifyRouteThreadId(replyTransport.threadId) : void 0 : threadId;
			}
		}
		if (payload.continuation) continuationRoute = resolveRestartContinuationRoute({
			channel: channel ?? void 0,
			to: resolvedTo,
			accountId: origin?.accountId,
			replyToId,
			threadId: resolvedThreadId,
			chatType
		});
		if (!(payload.continuation?.kind === "agentTurn" && continuationRoute !== void 0)) wakeQueueId = await enqueueSessionDelivery(buildQueuedRestartContinuation({
			sessionKey: canonicalKey,
			continuation: {
				kind: "systemEvent",
				text: message
			},
			revision: sentinelRevision,
			deliveryContext: wakeDeliveryContext,
			idempotencyKey: `restart-sentinel-wake:${canonicalKey}:${sentinelRevision}`
		}));
		if (payload.continuation) continuationQueueId = await enqueueSessionDelivery(buildQueuedRestartContinuation({
			sessionKey: canonicalKey,
			continuation: payload.continuation,
			revision: sentinelRevision,
			route: continuationRoute,
			expectedSessionId: entry?.sessionId,
			deliveryContext: resolvedTo && channel ? {
				channel,
				to: resolvedTo,
				...origin?.accountId ? { accountId: origin.accountId } : {},
				...resolvedThreadId ? { threadId: resolvedThreadId } : {}
			} : wakeDeliveryContext
		}));
		if (resolvedTo && channel) {
			const queuedNotice = await enqueueRestartSentinelNotice({
				channel,
				to: resolvedTo,
				accountId: origin?.accountId,
				replyToId,
				threadId: resolvedThreadId,
				message,
				sessionKey: canonicalKey,
				revision: sentinelRevision
			});
			noticeQueueId = queuedNotice.id;
			noticeQueueCreated = queuedNotice.created;
		}
		if (!await clearRestartSentinelIfRevision(sentinelRevision)) log.info(`${summary}: newer restart sentinel preserved while draining durable work`, { sessionKey: canonicalKey });
		if (wakeQueueId) await drainRestartContinuationQueue({
			deps: params.deps,
			entryId: wakeQueueId,
			log
		});
		if (resolvedTo && channel && noticeQueueId && noticeQueueCreated) await deliverRestartSentinelNotice({
			deps: params.deps,
			cfg,
			sessionKey: canonicalKey,
			summary,
			message,
			channel,
			to: resolvedTo,
			accountId: origin?.accountId,
			replyToId,
			threadId: resolvedThreadId,
			queueId: noticeQueueId
		});
		else if (noticeQueueId && !noticeQueueCreated) log.info(`${summary}: durable restart notice already owned`, { sessionKey: canonicalKey });
		if (continuationQueueId) await drainRestartContinuationQueue({
			deps: params.deps,
			entryId: continuationQueueId,
			log
		});
		return { status: "ran" };
	};
	return {
		source: "restart-sentinel",
		...sessionKey ? { sessionKey } : {},
		run
	};
}
async function scheduleRestartSentinelWakeAttempt(params) {
	const task = await loadRestartSentinelStartupTask(params);
	if (!task) return;
	await runStartupTasks({
		tasks: [task],
		log
	});
}
async function scheduleRestartSentinelWake(params) {
	await scheduleRestartSentinelWakeAttempt({
		...params,
		attempt: 0
	});
}
async function refreshLatestUpdateRestartSentinel() {
	const current = await readRestartSentinel();
	if (current?.payload.kind === "update" && isPendingControlPlaneUpdateRestartSentinel(current.payload)) {
		latestUpdateRestartSentinel = cloneRestartSentinelPayload(current.payload);
		return cloneRestartSentinelPayload(latestUpdateRestartSentinel);
	}
	const sentinel = await finalizeUpdateRestartSentinelRunningVersion() ?? current;
	if (sentinel?.payload.kind === "update") latestUpdateRestartSentinel = cloneRestartSentinelPayload(sentinel.payload);
	return cloneRestartSentinelPayload(latestUpdateRestartSentinel);
}
function getLatestUpdateRestartSentinel() {
	return cloneRestartSentinelPayload(latestUpdateRestartSentinel);
}
function recordLatestUpdateRestartSentinel(payload) {
	latestUpdateRestartSentinel = cloneRestartSentinelPayload(payload);
}
//#endregion
export { refreshLatestUpdateRestartSentinel as a, recoverPendingRestartContinuationDeliveries as i, getLatestUpdateRestartSentinel as n, scheduleRestartSentinelWake as o, recordLatestUpdateRestartSentinel as r, deliverQueuedSessionDelivery as t };
