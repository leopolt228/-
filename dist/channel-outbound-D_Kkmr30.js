import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as sleep } from "./sleep-Ce8zcpEF.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { r as createChannelIngressDrain } from "./ingress-drain-CcUB4x_c.js";
import "./payloads-BfQIm4rr.js";
import { t as resolveAccountEntry } from "./account-lookup-DgErwy8P.js";
import "./session-context-Cq_Z7k0n.js";
import { F as resolveChannelStreamingPreviewChunk } from "./streaming-CeN4qI3u.js";
import { c as resolveTextChunkLimit } from "./chunk-B-Yo_muw.js";
import { i as livePreviewFinalizerCapabilities, n as channelMessageReceiveAckPolicies, r as durableFinalDeliveryCapabilities, t as channelMessageLiveCapabilities } from "./types-GcWljJIT.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-C0uxiauk.js";
import "./sanitize-text-BCxyPW9Z.js";
import "./identity-M9c2BE55.js";
import "./reply-pipeline-CxG32UxG.js";
import "./outbound-echo-VBgVjbfx.js";
import "./progress-draft-compositor-BtUZIejX.js";
import "./draft-stream-controls-CW7sYKql.js";
//#region src/channels/message/adapter.ts
const defaultManualReceiveAdapter$1 = {
	defaultAckPolicy: "manual",
	supportedAckPolicies: ["manual"]
};
/** Defines a message adapter while defaulting receive acknowledgement to manual. */
function defineChannelMessageAdapter(adapter) {
	return {
		...adapter,
		receive: adapter.receive ?? defaultManualReceiveAdapter$1
	};
}
//#endregion
//#region src/channels/message/outbound-bridge.ts
/**
* Legacy outbound bridge adapter.
*
* Wraps old channel send functions in the newer channel message adapter contract.
*/
const defaultManualReceiveAdapter = {
	defaultAckPolicy: "manual",
	supportedAckPolicies: ["manual"]
};
function resolveResultMessageId(result) {
	return result.messageId ?? result.receipt?.primaryPlatformMessageId ?? result.receipt?.platformMessageIds[0] ?? result.chatId ?? result.channelId ?? result.roomId ?? result.conversationId ?? result.toJid ?? result.pollId;
}
function toMessageSendResult(result, params) {
	const receipt = result.receipt ? params.normalizeReceiptKind ? {
		...result.receipt,
		parts: result.receipt.parts.map((part) => ({
			...part,
			kind: params.kind
		}))
	} : result.receipt : createMessageReceiptFromOutboundResults({
		results: [result],
		kind: params.kind,
		threadId: params.threadId == null ? void 0 : String(params.threadId),
		replyToId: params.replyToId ?? void 0
	});
	return {
		receipt,
		...resolveResultMessageId({
			...result,
			receipt
		}) ? { messageId: resolveResultMessageId({
			...result,
			receipt
		}) } : {}
	};
}
function adaptOutboundBridgeContext(ctx, resultParams) {
	const { onDeliveryResult, ...outboundCtx } = ctx;
	return {
		...outboundCtx,
		...onDeliveryResult ? { onDeliveryResult: async (result) => {
			await onDeliveryResult(toMessageSendResult(result, resultParams));
		} } : {}
	};
}
function hasRenderedPresentationBlocks(channelData) {
	return Object.values(channelData ?? {}).some((value) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) return false;
		const blocks = value.presentationBlocks;
		return Array.isArray(blocks) && blocks.length > 0;
	});
}
function resolvePayloadReceiptKind(ctx) {
	if (ctx.payload.audioAsVoice && (ctx.mediaUrl || ctx.payload.mediaUrl || ctx.payload.mediaUrls?.length)) return "voice";
	if (ctx.mediaUrl || ctx.payload.mediaUrl || ctx.payload.mediaUrls?.length) return "media";
	if (Boolean(ctx.payload.presentation?.title || ctx.payload.presentation?.blocks?.length) || hasRenderedPresentationBlocks(ctx.payload.channelData)) return "card";
	if (ctx.payload.interactive) return "card";
	if (ctx.payload.location) return "card";
	if (ctx.payload.text?.trim() || ctx.text.trim()) return "text";
	return "unknown";
}
/** Converts legacy outbound send methods into a typed channel message adapter. */
function createChannelMessageAdapterFromOutbound(params) {
	const send = {};
	if (params.outbound.sendText) send.text = async (ctx) => {
		const resultParams = {
			kind: "text",
			threadId: ctx.threadId,
			replyToId: ctx.replyToId
		};
		return toMessageSendResult(await params.outbound.sendText(adaptOutboundBridgeContext(ctx, resultParams)), resultParams);
	};
	if (params.outbound.sendMedia) send.media = async (ctx) => {
		const resultParams = {
			kind: ctx.audioAsVoice ? "voice" : "media",
			threadId: ctx.threadId,
			replyToId: ctx.replyToId
		};
		return toMessageSendResult(await params.outbound.sendMedia(adaptOutboundBridgeContext(ctx, resultParams)), resultParams);
	};
	if (params.outbound.sendPayload) send.payload = async (ctx) => {
		const resultParams = {
			kind: resolvePayloadReceiptKind(ctx),
			threadId: ctx.threadId,
			replyToId: ctx.replyToId
		};
		return toMessageSendResult(await params.outbound.sendPayload(adaptOutboundBridgeContext(ctx, resultParams)), resultParams);
	};
	if (params.outbound.sendPoll) send.poll = async (ctx) => {
		const resultParams = {
			kind: "poll",
			normalizeReceiptKind: true,
			threadId: ctx.threadId,
			replyToId: ctx.replyToId
		};
		return toMessageSendResult(await params.outbound.sendPoll(adaptOutboundBridgeContext(ctx, resultParams)), resultParams);
	};
	return {
		...params.id ? { id: params.id } : {},
		durableFinal: { capabilities: params.capabilities ?? params.outbound.deliveryCapabilities?.durableFinal },
		send,
		...params.live ? { live: params.live } : {},
		receive: params.receive ?? defaultManualReceiveAdapter
	};
}
//#endregion
//#region src/channels/message/durable-receive.ts
function normalizeDurableInboundReceiveId(id) {
	const normalized = id.trim();
	if (!normalized) throw new Error("Durable inbound receive id cannot be empty");
	return normalized;
}
/** Adapts the shared channel ingress queue to the durable receive journal API. */
function createDurableInboundReceiveJournalFromQueue(options) {
	const prune = async (protectId) => {
		if (options.retention) await options.queue.prune({
			...options.retention,
			...protectId === void 0 ? {} : { protectIds: [protectId] }
		});
	};
	return {
		accept: async (id, payload, acceptOptions) => {
			await prune();
			const result = await options.queue.enqueue(normalizeDurableInboundReceiveId(id), payload, {
				...acceptOptions?.metadata === void 0 ? {} : { metadata: acceptOptions.metadata },
				...acceptOptions?.receivedAt === void 0 ? {} : { receivedAt: acceptOptions.receivedAt }
			});
			await prune(normalizeDurableInboundReceiveId(id));
			if (result.kind === "accepted") return {
				kind: "accepted",
				duplicate: false,
				record: result.record
			};
			if (result.kind === "completed") return {
				kind: "completed",
				duplicate: true,
				record: result.record
			};
			if (result.kind === "pending" || result.kind === "claimed") return {
				kind: "pending",
				duplicate: true,
				record: result.record
			};
			return {
				kind: "pending",
				duplicate: true,
				record: {
					id: result.record.id,
					payload,
					receivedAt: result.record.failedAt,
					updatedAt: result.record.failedAt,
					attempts: 0
				}
			};
		},
		pending: async () => {
			await prune();
			return await options.queue.listPending({ limit: "all" });
		},
		complete: async (id, completeOptions) => {
			await options.queue.complete(normalizeDurableInboundReceiveId(id), {
				...completeOptions?.metadata === void 0 ? {} : { metadata: completeOptions.metadata },
				...completeOptions?.completedAt === void 0 ? {} : { completedAt: completeOptions.completedAt }
			});
			await prune(normalizeDurableInboundReceiveId(id));
		},
		release: async (id, releaseOptions) => {
			const released = await options.queue.release(normalizeDurableInboundReceiveId(id), {
				...releaseOptions?.lastError === void 0 ? {} : { lastError: releaseOptions.lastError },
				...releaseOptions?.releasedAt === void 0 ? {} : { releasedAt: releaseOptions.releasedAt }
			});
			await prune(normalizeDurableInboundReceiveId(id));
			return released;
		},
		deletePending: async (id) => {
			const deleted = await options.queue.delete(normalizeDurableInboundReceiveId(id));
			await prune();
			return deleted;
		}
	};
}
//#endregion
//#region src/channels/message/ingress-monitor.ts
/** Shared durable channel-ingress admission, pump, retention, and shutdown lifecycle. */
const DEFAULT_APPEND_RETRY_DELAYS_MS = [
	0,
	100,
	300
];
/**
* Creates the shared monitor around a durable queue and ingress drain.
* Channel code keeps transport inspection, payload shape, and delivery policy.
*/
function createChannelIngressMonitor(options) {
	const now = options.now ?? Date.now;
	const appendRetryDelaysMs = options.appendRetryDelaysMs ?? DEFAULT_APPEND_RETRY_DELAYS_MS;
	const waitForDeliveryIdleBeforeRepump = options.waitForDeliveryIdleBeforeRepump ?? false;
	const { pruneIntervalMs, ...pruneOptions } = options.retention;
	const shutdown = new AbortController();
	const drainAbortSignal = options.abortSignal ? AbortSignal.any([shutdown.signal, options.abortSignal]) : shutdown.signal;
	const activeDeliveries = /* @__PURE__ */ new Set();
	const queueFactory = typeof options.queue === "function" ? options.queue : () => options.queue;
	let queue = typeof options.queue === "function" ? void 0 : options.queue;
	let drain;
	let running = false;
	let stopped = false;
	let requested = false;
	let pumping;
	let drainIdleWake;
	let drainIdleWakeRequested = false;
	let pollTimer;
	let lastPrunedAt = 0;
	let admissionTail = Promise.resolve();
	let admissionClaimLocked = false;
	const admissionClaimWaiters = [];
	let stopTask;
	let lastReportedActive = false;
	const reportError = (error) => {
		try {
			options.onError?.(error);
		} catch {}
	};
	const publishActivity = () => {
		const active = activeDeliveries.size > 0 || running && (requested || pumping !== void 0);
		if (active === lastReportedActive) return;
		lastReportedActive = active;
		try {
			options.onActivityChange?.(active);
		} catch (error) {
			reportError(error);
		}
	};
	const withAdmissionClaimLock = (task) => {
		const run = () => {
			admissionClaimLocked = true;
			let result;
			try {
				result = Promise.resolve(task());
			} catch (error) {
				result = Promise.reject(toErrorObject(error, "Channel ingress admission task failed"));
			}
			return result.finally(() => {
				const next = admissionClaimWaiters.shift();
				if (next) next();
				else admissionClaimLocked = false;
			});
		};
		if (!admissionClaimLocked) return run();
		return new Promise((resolve, reject) => {
			admissionClaimWaiters.push(() => {
				run().then(resolve, reject);
			});
		});
	};
	const createStoppedError = () => options.createStoppedError?.() ?? /* @__PURE__ */ new Error("Channel ingress monitor is stopped.");
	const getQueue = () => queue ??= queueFactory();
	const isAborted = () => drainAbortSignal.aborted;
	const waitForActiveDeliveries = async () => {
		while (activeDeliveries.size > 0) await Promise.allSettled(activeDeliveries);
	};
	const waitForPumpIdle = async () => {
		for (;;) {
			const activePump = pumping;
			if (!activePump) return;
			await activePump;
		}
	};
	const getDrain = () => {
		drain ??= createChannelIngressDrain({
			...options.drain,
			queue: getQueue(),
			abortSignal: drainAbortSignal,
			now,
			retryPolicy: options.drain?.retryPolicy ?? {
				maxAttempts: 8,
				deadLetterMinAgeMs: 864e5
			},
			formatError: options.drain?.formatError ?? formatErrorMessage,
			dispatchClaimedEvent: async (claim, lifecycle) => {
				if (!running || isAborted() || lifecycle.abortSignal.aborted) return {
					kind: "failed-retryable",
					error: createStoppedError()
				};
				let decoded;
				if (options.payload.storage === "raw-event") {
					const stored = claim.payload;
					if (!stored || typeof stored.rawEvent !== "string") throw options.payload.createClaimError("invalid-version", claim);
					decoded = {
						version: stored.version,
						body: stored.rawEvent
					};
				} else decoded = options.payload.decode(claim.payload, { claim });
				if (decoded.version !== options.payload.version) throw options.payload.createClaimError("invalid-version", claim);
				const raw = options.payload.deserialize(decoded.body, { claim });
				const claimedLaneKey = claim.laneKey ?? options.drain?.deriveLaneKey?.(claim);
				const facts = options.inspect(raw, {
					phase: "claim",
					claimedId: claim.id,
					claimedLaneKey
				});
				if (!facts || facts.eventId !== claim.id || facts.laneKey !== claimedLaneKey) throw options.payload.createClaimError("identity-mismatch", claim);
				let handedOff = false;
				let deferredHandoff = false;
				const wrappedLifecycle = {
					...lifecycle,
					admission: "exclusive",
					onAdopted: async () => {
						handedOff = true;
						await lifecycle.onAdopted();
						requestDrain();
					},
					onDeferred: () => {
						handedOff = true;
						deferredHandoff = true;
						lifecycle.onDeferred();
					},
					onAdoptionFinalizing: () => {
						handedOff = true;
						deferredHandoff = true;
						lifecycle.onAdoptionFinalizing();
					},
					onAbandoned: async () => {
						handedOff = true;
						deferredHandoff = true;
						await lifecycle.onAbandoned();
						requestDrain();
					}
				};
				const delivery = Promise.resolve().then(() => options.deliver(raw, wrappedLifecycle, claim));
				activeDeliveries.add(delivery);
				publishActivity();
				let result;
				try {
					result = await delivery;
				} catch (error) {
					if (isAborted() || lifecycle.abortSignal.aborted) return {
						kind: "failed-retryable",
						error
					};
					throw error;
				} finally {
					activeDeliveries.delete(delivery);
					publishActivity();
				}
				if (result?.kind === "failed-retryable") return result;
				if (isAborted() || lifecycle.abortSignal.aborted) return {
					kind: "failed-retryable",
					error: createStoppedError()
				};
				if (result?.kind === "completed") return result;
				if (result?.kind === "deferred") {
					if (!deferredHandoff) wrappedLifecycle.onDeferred();
					return { kind: "deferred" };
				}
				if (!handedOff) await wrappedLifecycle.onAdopted();
				return deferredHandoff ? { kind: "deferred" } : { kind: "completed" };
			}
		});
		return drain;
	};
	const pruneIfDue = async () => {
		const currentTime = now();
		if (currentTime - lastPrunedAt < pruneIntervalMs) return;
		await getQueue().prune({
			...pruneOptions,
			now: currentTime
		});
		lastPrunedAt = currentTime;
	};
	const scheduleDrainIdleWake = (activeDrain) => {
		if (drainIdleWake) {
			drainIdleWakeRequested = true;
			return;
		}
		drainIdleWakeRequested = false;
		const wake = activeDrain.waitForIdle();
		drainIdleWake = wake;
		wake.then(() => {
			if (drainIdleWake !== wake) return;
			const shouldRearm = drainIdleWakeRequested && running && !isAborted();
			drainIdleWake = void 0;
			drainIdleWakeRequested = false;
			if (shouldRearm) scheduleDrainIdleWake(activeDrain);
			requestDrain();
		}, (error) => {
			if (drainIdleWake === wake) {
				drainIdleWake = void 0;
				drainIdleWakeRequested = false;
			}
			reportError(error);
		});
	};
	const runPump = async () => {
		try {
			for (;;) {
				requested = false;
				await pruneIfDue();
				if (!running || isAborted()) break;
				const activeDrain = getDrain();
				const { started } = await withAdmissionClaimLock(() => activeDrain.drainOnce({ shouldStop: () => !running || isAborted() || options.drain?.startLimit !== void 0 && activeDeliveries.size >= options.drain.startLimit }));
				if (waitForDeliveryIdleBeforeRepump) {
					await waitForActiveDeliveries();
					await activeDrain.waitForIdle();
				} else if (started > 0) scheduleDrainIdleWake(activeDrain);
				if (!running || isAborted() || !requested && (!waitForDeliveryIdleBeforeRepump || started === 0)) break;
			}
		} catch (error) {
			reportError(error);
		} finally {
			pumping = void 0;
			if (!running || isAborted()) requested = false;
			else if (requested) requestDrain();
			publishActivity();
		}
	};
	const requestDrain = () => {
		if (!running || isAborted()) {
			publishActivity();
			return;
		}
		requested = true;
		if (pumping) {
			publishActivity();
			return;
		}
		pumping = options.runPumpTask ? options.runPumpTask(runPump) : runPump();
		publishActivity();
	};
	const clearPollTimer = () => {
		clearInterval(pollTimer);
		pollTimer = void 0;
	};
	const pause = async () => {
		running = false;
		requested = false;
		clearPollTimer();
		publishActivity();
		await waitForPumpIdle();
	};
	const admitOnce = async (params) => {
		let lastError;
		for (const delayMs of appendRetryDelaysMs) {
			if (delayMs > 0) await sleep(delayMs);
			try {
				return await getQueue().enqueue(params.facts.eventId, params.payload, {
					receivedAt: params.receivedAt,
					laneKey: params.facts.laneKey
				});
			} catch (error) {
				lastError = error;
			}
		}
		if (lastError instanceof Error) throw lastError;
		throw new Error(lastError === void 0 ? "Channel ingress append failed without an error." : formatErrorMessage(lastError), { cause: lastError });
	};
	const assertAdmissionOpen = () => {
		if (stopped && options.admissionMode !== "durable-after-stop" || options.admissionMode === "while-running" && !running || options.abortSignal?.aborted && options.admissionMode !== "durable-after-stop") throw createStoppedError();
	};
	const admitRaw = async (raw, admitOptions) => {
		try {
			const facts = admitOptions.facts ?? options.inspect(raw, { phase: "admission" });
			if (!facts) return { kind: "ignored" };
			const body = options.payload.serialize(raw, {
				facts,
				receivedAt: admitOptions.receivedAt
			});
			const payload = options.payload.storage === "raw-event" ? {
				version: options.payload.version,
				rawEvent: body
			} : options.payload.encode({
				version: options.payload.version,
				body
			});
			const queueResult = await admitOnce({
				facts,
				payload,
				receivedAt: admitOptions.receivedAt
			});
			admitOptions.onDurablyAdmitted();
			await options.onDurableAdmission?.(raw, {
				facts,
				receivedAt: admitOptions.receivedAt
			});
			return {
				kind: "durable",
				queueResult
			};
		} catch (error) {
			await options.onAdmissionFailure?.(raw, error);
			throw error;
		}
	};
	const scheduleAdmission = (work) => {
		const admission = admissionTail.then(() => withAdmissionClaimLock(work));
		admissionTail = admission.then(() => void 0, () => void 0);
		return admission;
	};
	return {
		admit: async (raw, admitOptions) => {
			assertAdmissionOpen();
			const receivedAt = admitOptions?.receivedAt ?? now();
			let durablyAdmitted = false;
			try {
				return await scheduleAdmission(() => admitRaw(raw, {
					receivedAt,
					...admitOptions?.facts ? { facts: admitOptions.facts } : {},
					onDurablyAdmitted: () => {
						durablyAdmitted = true;
					}
				}));
			} finally {
				if (durablyAdmitted) requestDrain();
			}
		},
		admitBatch: async (rawEvents, admitOptions) => {
			assertAdmissionOpen();
			const receivedAt = admitOptions?.receivedAt ?? now();
			let durablyAdmitted = false;
			try {
				return await scheduleAdmission(async () => {
					const results = [];
					for (const raw of rawEvents) results.push(await admitRaw(raw, {
						receivedAt,
						onDurablyAdmitted: () => {
							durablyAdmitted = true;
						}
					}));
					return results;
				});
			} finally {
				if (durablyAdmitted) requestDrain();
			}
		},
		start: () => {
			if (running || stopped || isAborted()) return;
			running = true;
			pollTimer = setInterval(requestDrain, options.pollIntervalMs);
			pollTimer.unref?.();
			requestDrain();
		},
		requestDrain,
		pause,
		stop: () => {
			stopTask ??= (async () => {
				stopped = true;
				running = false;
				requested = false;
				clearPollTimer();
				publishActivity();
				await admissionTail;
				shutdown.abort(createStoppedError());
				await waitForPumpIdle();
				if (options.waitForDeliveryIdleOnStop !== false) await waitForActiveDeliveries();
				drain?.dispose();
				if (options.waitForDeliveryIdleOnStop !== false) await drain?.waitForIdle();
			})();
			return stopTask;
		},
		waitForIdle: async () => {
			for (;;) {
				await admissionTail;
				await waitForPumpIdle();
				await waitForActiveDeliveries();
				await drain?.waitForIdle();
				if (!pumping && activeDeliveries.size === 0 && !requested) return;
			}
		},
		waitForPumpIdle,
		isRunning: () => running,
		isStopped: () => stopped
	};
}
//#endregion
//#region src/channels/message/contracts.ts
/**
* Lists declared receive acknowledgement policies, including the default policy fallback.
*/
function listDeclaredReceiveAckPolicies(receive) {
	const declared = receive?.supportedAckPolicies?.length ? receive.supportedAckPolicies : receive?.defaultAckPolicy ? [receive.defaultAckPolicy] : [];
	return channelMessageReceiveAckPolicies.filter((policy) => declared.includes(policy));
}
/**
* Verifies proof callbacks for every declared durable-final delivery capability.
*/
async function verifyDurableFinalCapabilityProofs(params) {
	const results = [];
	for (const capability of durableFinalDeliveryCapabilities) {
		if (params.capabilities?.[capability] !== true) {
			results.push({
				capability,
				status: "not_declared"
			});
			continue;
		}
		const proof = params.proofs[capability];
		if (!proof) throw new Error(`${params.adapterName} declares durable final capability "${capability}" without a contract proof`);
		await proof();
		results.push({
			capability,
			status: "verified"
		});
	}
	return results;
}
/**
* Verifies proof callbacks for every declared live-preview finalizer capability.
*/
async function verifyLivePreviewFinalizerCapabilityProofs(params) {
	const results = [];
	for (const capability of livePreviewFinalizerCapabilities) {
		if (params.capabilities?.[capability] !== true) {
			results.push({
				capability,
				status: "not_declared"
			});
			continue;
		}
		const proof = params.proofs[capability];
		if (!proof) throw new Error(`${params.adapterName} declares live preview finalizer capability "${capability}" without a contract proof`);
		await proof();
		results.push({
			capability,
			status: "verified"
		});
	}
	return results;
}
/**
* Verifies proof callbacks for every declared live message capability.
*/
async function verifyChannelMessageLiveCapabilityProofs(params) {
	const results = [];
	for (const capability of channelMessageLiveCapabilities) {
		if (params.capabilities?.[capability] !== true) {
			results.push({
				capability,
				status: "not_declared"
			});
			continue;
		}
		const proof = params.proofs[capability];
		if (!proof) throw new Error(`${params.adapterName} declares live capability "${capability}" without a contract proof`);
		await proof();
		results.push({
			capability,
			status: "verified"
		});
	}
	return results;
}
/**
* Verifies proof callbacks for every declared receive acknowledgement policy.
*/
async function verifyChannelMessageReceiveAckPolicyProofs(params) {
	const declared = new Set(listDeclaredReceiveAckPolicies(params.receive));
	const results = [];
	for (const policy of channelMessageReceiveAckPolicies) {
		if (!declared.has(policy)) {
			results.push({
				policy,
				status: "not_declared"
			});
			continue;
		}
		const proof = params.proofs[policy];
		if (!proof) throw new Error(`${params.adapterName} declares receive ack policy "${policy}" without a contract proof`);
		await proof();
		results.push({
			policy,
			status: "verified"
		});
	}
	return results;
}
/**
* Verifies durable-final proofs from a channel message adapter declaration.
*/
async function verifyChannelMessageAdapterCapabilityProofs(params) {
	return await verifyDurableFinalCapabilityProofs({
		adapterName: params.adapterName,
		capabilities: params.adapter.durableFinal?.capabilities,
		proofs: params.proofs
	});
}
/**
* Verifies receive acknowledgement proofs from a channel message adapter declaration.
*/
async function verifyChannelMessageReceiveAckPolicyAdapterProofs(params) {
	return await verifyChannelMessageReceiveAckPolicyProofs({
		adapterName: params.adapterName,
		receive: params.adapter.receive,
		proofs: params.proofs
	});
}
/**
* Verifies live-preview finalizer proofs from a channel message adapter declaration.
*/
async function verifyChannelMessageLiveFinalizerProofs(params) {
	return await verifyLivePreviewFinalizerCapabilityProofs({
		adapterName: params.adapterName,
		capabilities: params.adapter.live?.finalizer?.capabilities,
		proofs: params.proofs
	});
}
/**
* Verifies live message capability proofs from a channel message adapter declaration.
*/
async function verifyChannelMessageLiveCapabilityAdapterProofs(params) {
	return await verifyChannelMessageLiveCapabilityProofs({
		adapterName: params.adapterName,
		capabilities: params.adapter.live?.capabilities,
		proofs: params.proofs
	});
}
//#endregion
//#region src/channels/message/receive.ts
const neverAbortedSignal = new AbortController().signal;
/** Returns whether an ack policy should acknowledge at the supplied processing stage. */
function shouldAckMessageAfterStage(policy, stage) {
	switch (policy) {
		case "after_receive_record": return stage === "receive_record";
		case "after_agent_dispatch": return stage === "agent_dispatch";
		case "after_durable_send": return stage === "durable_send";
		case "manual": return false;
	}
	return false;
}
function normalizeAckErrorMessage(error) {
	return error instanceof Error ? error.message : String(error);
}
/** Creates a receive context with idempotent ack and explicit nack state transitions. */
function createMessageReceiveContext(params) {
	let nackInFlight;
	const ctx = {
		id: params.id,
		channel: params.channel,
		...params.accountId ? { accountId: params.accountId } : {},
		message: params.message,
		ackPolicy: params.ackPolicy ?? "after_receive_record",
		ackState: "pending",
		receivedAt: params.receivedAt ?? Date.now(),
		signal: params.signal ?? neverAbortedSignal,
		shouldAckAfter: (stage) => shouldAckMessageAfterStage(ctx.ackPolicy, stage),
		ack: async () => {
			if (ctx.ackState === "acked") return;
			await params.onAck?.();
			ctx.ackState = "acked";
			ctx.ackedAt = Date.now();
			delete ctx.nackErrorMessage;
		},
		nack: async (error) => {
			if (ctx.ackState === "nacked") return;
			if (nackInFlight) {
				await nackInFlight;
				return;
			}
			nackInFlight = (async () => {
				await params.onNack?.(error);
				ctx.ackState = "nacked";
				ctx.nackErrorMessage = normalizeAckErrorMessage(error);
			})();
			try {
				await nackInFlight;
			} finally {
				nackInFlight = void 0;
			}
		}
	};
	return ctx;
}
//#endregion
//#region src/channels/draft-streaming-chunking.ts
const DEFAULT_DRAFT_STREAM_MIN = 200;
const DEFAULT_DRAFT_STREAM_MAX = 800;
function resolveChannelDraftStreamingChunking(cfg, channelId, accountId, opts) {
	const textLimit = resolveTextChunkLimit(cfg, channelId, accountId, { fallbackLimit: opts.fallbackLimit });
	const normalizedAccountId = normalizeAccountId(accountId);
	const channelCfg = cfg?.channels?.[channelId];
	const draftCfg = resolveChannelStreamingPreviewChunk(resolveAccountEntry(channelCfg?.accounts, normalizedAccountId)) ?? resolveChannelStreamingPreviewChunk(channelCfg);
	const maxRequested = Math.max(1, Math.floor(draftCfg?.maxChars ?? DEFAULT_DRAFT_STREAM_MAX));
	const maxChars = Math.max(1, Math.min(maxRequested, textLimit));
	const minRequested = Math.max(1, Math.floor(draftCfg?.minChars ?? DEFAULT_DRAFT_STREAM_MIN));
	return {
		minChars: Math.min(minRequested, maxChars),
		maxChars,
		breakPreference: draftCfg?.breakPreference === "newline" || draftCfg?.breakPreference === "sentence" ? draftCfg.breakPreference : "paragraph"
	};
}
//#endregion
//#region src/plugin-sdk/channel-outbound.ts
const loadChannelMessageRuntimeModule = createLazyRuntimeModule(() => import("./runtime-DjiAO-3g.js"));
/** Lazily forwards inbound reply delivery through the channel turn kernel. */
const deliverInboundReplyWithMessageSendContext = async (...args) => {
	return await (await import("./kernel-C1rta5F0.js")).deliverInboundReplyWithMessageSendContext(...args);
};
/** Sends a durable message batch without eager-loading channel message runtime internals. */
async function sendDurableMessageBatch(params) {
	return await (await loadChannelMessageRuntimeModule()).sendDurableMessageBatch(params);
}
/** Runs work inside a durable message send context loaded through the SDK lazy boundary. */
async function withDurableMessageSendContext(params, run) {
	return await (await loadChannelMessageRuntimeModule()).withDurableMessageSendContext(params, run);
}
//#endregion
export { createMessageReceiveContext as a, verifyChannelMessageLiveFinalizerProofs as c, createChannelIngressMonitor as d, createDurableInboundReceiveJournalFromQueue as f, resolveChannelDraftStreamingChunking as i, verifyChannelMessageReceiveAckPolicyAdapterProofs as l, defineChannelMessageAdapter as m, sendDurableMessageBatch as n, verifyChannelMessageAdapterCapabilityProofs as o, createChannelMessageAdapterFromOutbound as p, withDurableMessageSendContext as r, verifyChannelMessageLiveCapabilityAdapterProofs as s, deliverInboundReplyWithMessageSendContext as t, verifyDurableFinalCapabilityProofs as u };
