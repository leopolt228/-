import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { t as danger } from "./globals-DBBT7Ru5.js";
import { r as resolveBatchedReplyThreadingPolicy } from "./reply-threading-BP15SwF-.js";
import { i as resolveOpenProviderRuntimeGroupPolicy } from "./runtime-group-policy-B5DjRp_T.js";
import "./runtime-env-BDC_axp1.js";
import "./reply-reference-oyTerJRY.js";
import "./runtime-group-policy-CXo40VxH.js";
import { n as createChannelRunQueue } from "./channel-lifecycle.core-C98dobNq.js";
import { l as createChannelInboundDebouncer, u as shouldDebounceTextInbound } from "./channel-inbound-CsmpMLUZ.js";
import { d as createChannelIngressMonitor } from "./channel-outbound-D_Kkmr30.js";
import { Ut as GatewayDispatchEvents } from "./discord-BO4_MvbK.js";
import { t as getDiscordRuntime } from "./runtime-Dg4d9hPu.js";
import { a as resolveDiscordChannelParentSafe, n as resolveDiscordChannelInfoSafe, r as resolveDiscordChannelNameSafe, t as resolveDiscordChannelIdSafe } from "./channel-access-C12aDZ0p.js";
import { f as resolveDiscordMessageChannelId, i as resolveDiscordMessageText, l as hasDiscordMessageStickers } from "./message-utils-BCz8auPX.js";
import { n as mapGatewayDispatchData } from "./gateway-dispatch-DxjoEpib.js";
//#region extensions/discord/src/monitor/ingress.ts
const DISCORD_INGRESS_PAYLOAD_VERSION = 1;
const DISCORD_INGRESS_DRAIN_INTERVAL_MS = 1e3;
const DISCORD_INGRESS_COMPLETED_TTL_MS = 720 * 60 * 6e4;
const DISCORD_INGRESS_COMPLETED_MAX_ENTRIES = 5e3;
const DISCORD_INGRESS_FAILED_TTL_MS = 720 * 60 * 6e4;
const DISCORD_INGRESS_FAILED_MAX_ENTRIES = 5e3;
var DiscordIngressPayloadError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "DiscordIngressPayloadError";
	}
};
function nonEmptyString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : null;
}
function inspectDiscordMessage(rawMessage) {
	if (!rawMessage || typeof rawMessage !== "object" || Array.isArray(rawMessage)) throw new DiscordIngressPayloadError("Discord MESSAGE_CREATE payload must be an object");
	const candidate = rawMessage;
	const eventId = nonEmptyString(candidate.id);
	if (!eventId) throw new DiscordIngressPayloadError("Discord MESSAGE_CREATE payload is missing its snowflake");
	const channelId = nonEmptyString(candidate.channel_id);
	if (!channelId) throw new DiscordIngressPayloadError("Discord MESSAGE_CREATE payload is missing channel_id");
	return {
		eventId,
		laneKey: `channel:${channelId}`
	};
}
function decodeDiscordIngressPayload(payload, claimedId) {
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new DiscordIngressPayloadError("Discord ingress payload must be an object");
	const candidate = payload;
	try {
		inspectDiscordMessage(candidate.rawMessage);
	} catch (error) {
		throw new DiscordIngressPayloadError(`Discord ingress payload ${claimedId} is invalid`, { cause: error });
	}
	return {
		version: candidate.version,
		body: {
			receivedAt: candidate.receivedAt,
			rawMessage: candidate.rawMessage
		}
	};
}
function errorText(error) {
	return error instanceof Error ? error.message : String(error);
}
function isDiscordAuthenticationFailure(error) {
	let current = error;
	const seen = /* @__PURE__ */ new Set();
	while (current && typeof current === "object" && !seen.has(current)) {
		seen.add(current);
		const candidate = current;
		if (candidate.status === 401 || candidate.statusCode === 401) return true;
		current = candidate.cause;
	}
	return false;
}
function createDiscordIngressMonitor(params) {
	const monitor = createChannelIngressMonitor({
		queue: params.queue ?? getDiscordRuntime().state.openChannelIngressQueue({ accountId: params.accountId }),
		inspect: inspectDiscordMessage,
		payload: {
			version: DISCORD_INGRESS_PAYLOAD_VERSION,
			serialize: (rawMessage, { receivedAt }) => ({
				receivedAt,
				rawMessage
			}),
			deserialize: (body) => body.rawMessage,
			encode: ({ body }) => ({
				version: DISCORD_INGRESS_PAYLOAD_VERSION,
				...body
			}),
			decode: (payload, { claim }) => decodeDiscordIngressPayload(payload, claim.id),
			createClaimError: (kind) => new DiscordIngressPayloadError(kind === "invalid-version" ? "Discord ingress payload version is unsupported" : "Discord message identity changed after durable admission")
		},
		deliver: async (rawMessage, lifecycle) => {
			const event = mapGatewayDispatchData(params.client, GatewayDispatchEvents.MessageCreate, rawMessage);
			return await params.dispatch(event, lifecycle);
		},
		pollIntervalMs: DISCORD_INGRESS_DRAIN_INTERVAL_MS,
		retention: {
			pruneIntervalMs: 0,
			completedTtlMs: DISCORD_INGRESS_COMPLETED_TTL_MS,
			completedMaxEntries: DISCORD_INGRESS_COMPLETED_MAX_ENTRIES,
			failedTtlMs: DISCORD_INGRESS_FAILED_TTL_MS,
			failedMaxEntries: DISCORD_INGRESS_FAILED_MAX_ENTRIES
		},
		appendRetryDelaysMs: [0],
		drain: {
			resolveNonRetryableFailure: (error) => {
				if (error instanceof DiscordIngressPayloadError) return {
					reason: "invalid-event",
					message: error.message
				};
				if (isDiscordAuthenticationFailure(error)) return {
					reason: "authentication-failed",
					message: errorText(error)
				};
				return null;
			},
			onLog: (message) => params.runtime.error?.(danger(`discord ingress: ${message}`))
		},
		onError: (error) => params.runtime.error?.(danger(`discord ingress drain failed: ${errorText(error)}`))
	});
	return {
		accept: async (rawMessage) => {
			await monitor.admit(rawMessage);
		},
		start: monitor.start,
		stop: monitor.stop
	};
}
//#endregion
//#region extensions/discord/src/monitor/inbound-job.ts
function resolveDiscordInboundJobQueueKey(ctx) {
	const sessionKey = ctx.route.sessionKey?.trim();
	if (sessionKey) return sessionKey;
	const baseSessionKey = ctx.baseSessionKey?.trim();
	if (baseSessionKey) return baseSessionKey;
	return ctx.messageChannelId;
}
function buildDiscordInboundJob(ctx, options) {
	const { runtime, abortSignal, guildHistories, client, turnAdoptionLifecycle, threadBindings, discordRestFetch, message, data, threadChannel, ...payload } = ctx;
	const sanitizedMessage = sanitizeDiscordInboundMessage(message);
	return {
		queueKey: resolveDiscordInboundJobQueueKey(ctx),
		payload: {
			...payload,
			message: sanitizedMessage,
			data: {
				...data,
				message: sanitizedMessage
			},
			threadChannel: normalizeDiscordThreadChannel(threadChannel)
		},
		runtime: {
			runtime,
			abortSignal,
			guildHistories,
			client,
			turnAdoptionLifecycle,
			threadBindings,
			discordRestFetch
		},
		ingressSettlement: options?.ingressSettlement
	};
}
function materializeDiscordInboundJob(job, abortSignal) {
	return {
		...job.payload,
		...job.runtime,
		abortSignal: abortSignal ?? job.runtime.abortSignal
	};
}
function sanitizeDiscordInboundMessage(message) {
	const descriptors = Object.getOwnPropertyDescriptors(message);
	delete descriptors.channel;
	return Object.create(Object.getPrototypeOf(message), descriptors);
}
function normalizeDiscordThreadChannel(threadChannel) {
	if (!threadChannel) return null;
	const channelInfo = resolveDiscordChannelInfoSafe(threadChannel);
	const parent = resolveDiscordChannelParentSafe(threadChannel);
	return {
		id: threadChannel.id,
		name: channelInfo.name,
		parentId: channelInfo.parentId,
		parent: parent ? {
			id: resolveDiscordChannelIdSafe(parent),
			name: resolveDiscordChannelNameSafe(parent)
		} : void 0,
		ownerId: channelInfo.ownerId
	};
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.batch-gate.ts
function applyImplicitReplyBatchGate(ctx, replyToMode, isBatched) {
	const replyThreading = resolveBatchedReplyThreadingPolicy(replyToMode, isBatched);
	if (!replyThreading) return;
	ctx.ReplyThreading = replyThreading;
}
//#endregion
//#region extensions/discord/src/monitor/message-run-queue.ts
const loadMessageProcessRuntime = createLazyRuntimeModule(() => import("./message-handler.process-cfO5D3Pr.js"));
async function processDiscordQueuedMessage(params) {
	const abortSignal = params.job.runtime.abortSignal && params.lifecycleSignal ? AbortSignal.any([params.job.runtime.abortSignal, params.lifecycleSignal]) : params.job.runtime.abortSignal ?? params.lifecycleSignal;
	try {
		await (params.testing?.processDiscordMessage ?? (await loadMessageProcessRuntime()).processDiscordMessage)(materializeDiscordInboundJob(params.job, abortSignal));
		if (abortSignal?.aborted) await params.job.ingressSettlement?.abandon(abortSignal.reason);
		else await params.job.ingressSettlement?.settle();
	} catch (error) {
		await params.job.ingressSettlement?.abandon(error);
		throw error;
	}
}
async function cleanupSkippedDiscordQueuedMessage(params) {
	await params.job.ingressSettlement?.abandon(/* @__PURE__ */ new Error("discord queued run skipped before processing"));
}
function createDiscordMessageRunQueue(params) {
	const skippedCleanup = /* @__PURE__ */ new Set();
	const runQueue = createChannelRunQueue({
		setStatus: params.setStatus,
		abortSignal: params.abortSignal,
		onError: (error) => {
			params.runtime.error(danger(`discord message run failed: ${String(error)}`));
		}
	});
	let lifecycleActive = !params.abortSignal?.aborted;
	const pendingTasks = /* @__PURE__ */ new Set();
	const onAbort = () => void cleanupSkippedQueuedMessages();
	async function cleanupSkippedQueuedMessages() {
		params.abortSignal?.removeEventListener("abort", onAbort);
		if (!lifecycleActive && skippedCleanup.size === 0) return;
		lifecycleActive = false;
		const cleanups = [...skippedCleanup];
		skippedCleanup.clear();
		for (const cleanup of cleanups) await cleanup();
	}
	if (params.abortSignal?.aborted) cleanupSkippedQueuedMessages();
	else params.abortSignal?.addEventListener("abort", onAbort, { once: true });
	return {
		enqueue(job) {
			let resolvePending;
			const pending = new Promise((resolve) => {
				resolvePending = resolve;
			});
			pendingTasks.add(pending);
			const settlePending = () => {
				pendingTasks.delete(pending);
				resolvePending();
			};
			const cleanupSkipped = async () => {
				try {
					await cleanupSkippedDiscordQueuedMessage({ job });
				} finally {
					settlePending();
				}
			};
			if (!lifecycleActive) {
				cleanupSkipped();
				return;
			}
			skippedCleanup.add(cleanupSkipped);
			runQueue.enqueue(job.queueKey, async ({ lifecycleSignal }) => {
				skippedCleanup.delete(cleanupSkipped);
				try {
					await processDiscordQueuedMessage({
						job,
						lifecycleSignal,
						testing: params.testing
					});
				} finally {
					settlePending();
				}
			});
		},
		async deactivate() {
			runQueue.deactivate();
			await cleanupSkippedQueuedMessages();
			await Promise.allSettled(pendingTasks);
		}
	};
}
//#endregion
//#region extensions/discord/src/monitor/message-dispatcher.ts
const loadMessagePreflightRuntime = createLazyRuntimeModule(() => import("./message-handler.preflight-CSl2cmaD.js"));
function isNonEmptyString(value) {
	return typeof value === "string" && value.length > 0;
}
function buildFlushIngressLifecycle(entries) {
	const lifecycles = entries.map((entry) => entry.turnAdoptionLifecycle).filter((lifecycle) => lifecycle !== void 0);
	const [firstLifecycle] = lifecycles;
	if (!firstLifecycle) return {
		lifecycle: void 0,
		settle: async () => {},
		abandon: async () => {}
	};
	let handedOff = false;
	const adoptAll = async () => {
		for (const lifecycle of lifecycles) await lifecycle.onAdopted();
	};
	return {
		lifecycle: {
			abortSignal: lifecycles.length === 1 ? firstLifecycle.abortSignal : AbortSignal.any(lifecycles.map((lifecycle) => lifecycle.abortSignal)),
			onAdopted: async () => {
				handedOff = true;
				await adoptAll();
			},
			onDeferred: () => {
				handedOff = true;
				for (const lifecycle of lifecycles) lifecycle.onDeferred();
			},
			onAdoptionFinalizing: () => {
				for (const lifecycle of lifecycles) lifecycle.onAdoptionFinalizing();
			},
			onAbandoned: async () => {
				handedOff = true;
				for (const lifecycle of lifecycles) await lifecycle.onAbandoned();
			}
		},
		settle: async () => {
			if (!handedOff) await adoptAll();
		},
		abandon: async () => {
			if (handedOff) return;
			handedOff = true;
			for (const lifecycle of lifecycles) await lifecycle.onAbandoned();
		}
	};
}
function createDiscordMessageDispatcher(params) {
	const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: params.cfg.channels?.discord !== void 0,
		groupPolicy: params.discordConfig?.groupPolicy,
		defaultGroupPolicy: params.cfg.channels?.defaults?.groupPolicy
	});
	const ackReactionScope = params.discordConfig?.ackReactionScope ?? params.cfg.messages?.ackReactionScope ?? "group-mentions";
	const preflightDiscordMessageImpl = params.testing?.preflightDiscordMessage;
	const messageRunQueue = createDiscordMessageRunQueue({
		runtime: params.runtime,
		setStatus: params.setStatus,
		abortSignal: params.abortSignal,
		testing: params.testing
	});
	const dispatcherShutdown = new AbortController();
	const pendingDebounceEntries = /* @__PURE__ */ new Set();
	const pendingCancellationSettlements = /* @__PURE__ */ new Set();
	const activeDebounceFlushes = /* @__PURE__ */ new Set();
	const resolveDebounceKey = (entry) => {
		const message = entry.data.message;
		const authorId = entry.data.author?.id;
		if (!message || !authorId) return null;
		const channelId = resolveDiscordMessageChannelId({
			message,
			eventChannelId: entry.data.channel_id
		});
		return channelId ? `discord:${params.accountId}:${channelId}:${authorId}` : null;
	};
	const { debouncer } = createChannelInboundDebouncer({
		cfg: params.cfg,
		channel: "discord",
		buildKey: resolveDebounceKey,
		shouldDebounce: (entry) => {
			const message = entry.data.message;
			if (!message) return false;
			return shouldDebounceTextInbound({
				text: resolveDiscordMessageText(message, { includeForwarded: false }),
				cfg: params.cfg,
				hasMedia: message.attachments && message.attachments.length > 0 || hasDiscordMessageStickers(message)
			});
		},
		onFlush: async (entries) => {
			let resolveTrackedFlush;
			const trackedFlush = new Promise((resolve) => {
				resolveTrackedFlush = resolve;
			});
			activeDebounceFlushes.add(trackedFlush);
			try {
				for (const entry of entries) pendingDebounceEntries.delete(entry);
				const last = entries.at(-1);
				if (!last) return;
				const ingress = buildFlushIngressLifecycle(entries);
				const abortSignal = last.abortSignal;
				if (abortSignal?.aborted) {
					await ingress.abandon(abortSignal.reason);
					return;
				}
				try {
					if (entries.length === 1) {
						const ctx = await (preflightDiscordMessageImpl ?? (await loadMessagePreflightRuntime()).preflightDiscordMessage)({
							...params,
							ackReactionScope,
							groupPolicy,
							abortSignal,
							data: last.data,
							client: last.client,
							turnAdoptionLifecycle: ingress.lifecycle
						});
						if (abortSignal?.aborted) {
							await ingress.abandon(abortSignal.reason);
							return;
						}
						if (!ctx) {
							await ingress.settle();
							return;
						}
						applyImplicitReplyBatchGate(ctx, params.replyToMode, false);
						messageRunQueue.enqueue(buildDiscordInboundJob(ctx, { ingressSettlement: ingress }));
						return;
					}
					const combinedBaseText = entries.map((entry) => resolveDiscordMessageText(entry.data.message, { includeForwarded: false })).filter(Boolean).join("\n");
					const syntheticMessage = Object.create(Object.getPrototypeOf(last.data.message), {
						...Object.getOwnPropertyDescriptors(last.data.message),
						content: {
							value: combinedBaseText,
							enumerable: true,
							configurable: true
						},
						attachments: {
							value: [],
							enumerable: true,
							configurable: true
						},
						message_snapshots: {
							value: last.data.message.message_snapshots,
							enumerable: true,
							configurable: true
						},
						messageSnapshots: {
							value: last.data.message.messageSnapshots,
							enumerable: true,
							configurable: true
						},
						rawData: {
							value: { ...last.data.message.rawData },
							enumerable: true,
							configurable: true
						}
					});
					const syntheticData = {
						...last.data,
						message: syntheticMessage
					};
					const ctx = await (preflightDiscordMessageImpl ?? (await loadMessagePreflightRuntime()).preflightDiscordMessage)({
						...params,
						ackReactionScope,
						groupPolicy,
						abortSignal,
						data: syntheticData,
						client: last.client,
						turnAdoptionLifecycle: ingress.lifecycle
					});
					if (abortSignal?.aborted) {
						await ingress.abandon(abortSignal.reason);
						return;
					}
					if (!ctx) {
						await ingress.settle();
						return;
					}
					applyImplicitReplyBatchGate(ctx, params.replyToMode, true);
					const ids = entries.map((entry) => entry.data.message?.id).filter(isNonEmptyString);
					if (ids.length > 0) {
						const ctxBatch = ctx;
						ctxBatch.MessageSids = ids;
						ctxBatch.MessageSidFirst = ids[0];
						ctxBatch.MessageSidLast = ids[ids.length - 1];
					}
					messageRunQueue.enqueue(buildDiscordInboundJob(ctx, { ingressSettlement: ingress }));
				} catch (error) {
					await ingress.abandon(error);
					throw error;
				}
			} finally {
				activeDebounceFlushes.delete(trackedFlush);
				resolveTrackedFlush();
			}
		},
		onError: (err) => {
			params.runtime.error(danger(`discord debounce flush failed: ${String(err)}`));
		},
		onCancel: (entries) => {
			for (const entry of entries) {
				pendingDebounceEntries.delete(entry);
				const settlement = Promise.resolve(entry.turnAdoptionLifecycle?.onAbandoned()).catch((error) => {
					params.runtime.error(danger(`discord ingress cancellation settlement failed: ${String(error)}`));
				}).finally(() => {
					pendingCancellationSettlements.delete(settlement);
				});
				pendingCancellationSettlements.add(settlement);
			}
		}
	});
	const dispatchMessage = async (data, client, options) => {
		try {
			if (dispatcherShutdown.signal.aborted || options?.abortSignal?.aborted) return {
				kind: "failed-retryable",
				error: dispatcherShutdown.signal.aborted ? dispatcherShutdown.signal.reason ?? /* @__PURE__ */ new Error("discord dispatcher shut down") : options?.abortSignal?.reason ?? /* @__PURE__ */ new Error("discord dispatch aborted")
			};
			const msgAuthorId = data.message?.author?.id ?? data.author?.id;
			if (params.botUserId && msgAuthorId === params.botUserId) return { kind: "completed" };
			const entry = {
				data,
				client,
				abortSignal: options?.abortSignal ? AbortSignal.any([options.abortSignal, dispatcherShutdown.signal]) : dispatcherShutdown.signal,
				turnAdoptionLifecycle: options?.turnAdoptionLifecycle
			};
			const debounceKey = resolveDebounceKey(entry);
			if (debounceKey) {
				entry.debounceKey = debounceKey;
				pendingDebounceEntries.add(entry);
			}
			await debouncer.enqueue(entry);
			if (options?.turnAdoptionLifecycle) return { kind: "deferred" };
			return { kind: "completed" };
		} catch (err) {
			params.runtime.error(danger(`handler failed: ${String(err)}`));
			if (options?.turnAdoptionLifecycle) throw err;
			return { kind: "completed" };
		}
	};
	const handler = (data, client, options) => {
		const result = dispatchMessage(data, client, options);
		return options?.turnAdoptionLifecycle ? result : result.then(() => void 0);
	};
	handler.deactivate = async () => {
		dispatcherShutdown.abort(/* @__PURE__ */ new Error("discord-message-handler-deactivated"));
		const pendingKeys = new Set([...pendingDebounceEntries].map((entry) => entry.debounceKey).filter((key) => key !== void 0));
		for (const key of pendingKeys) debouncer.cancelKey(key);
		pendingDebounceEntries.clear();
		await Promise.allSettled(pendingCancellationSettlements);
		await Promise.allSettled(activeDebounceFlushes);
		await messageRunQueue.deactivate();
	};
	return handler;
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.ts
function createDiscordMessageHandler(params) {
	const dispatcher = createDiscordMessageDispatcher(params);
	const ingress = (params.testing?.createIngressMonitor ?? createDiscordIngressMonitor)({
		accountId: params.accountId,
		client: params.client,
		runtime: params.runtime,
		dispatch: (event, lifecycle) => dispatcher(event, params.client, {
			abortSignal: lifecycle.abortSignal,
			turnAdoptionLifecycle: lifecycle
		})
	});
	ingress.start();
	const activeAdmissions = /* @__PURE__ */ new Set();
	let accepting = true;
	const handler = async (rawMessage) => {
		if (!accepting) return;
		const admission = ingress.accept(rawMessage);
		activeAdmissions.add(admission);
		try {
			await admission;
		} finally {
			activeAdmissions.delete(admission);
		}
	};
	handler.deactivate = async () => {
		accepting = false;
		await Promise.allSettled(activeAdmissions);
		await dispatcher.deactivate();
		await ingress.stop();
	};
	return handler;
}
//#endregion
export { createDiscordMessageHandler as t };
