import { n as bindIngressLifecycleToReplyOptions, t as DEFAULT_INGRESS_ADOPTION_STALL_MS } from "./ingress-drain-CcUB4x_c.js";
import { d as createChannelIngressMonitor } from "./channel-outbound-D_Kkmr30.js";
import { l as runDetachedWebhookWork } from "./webhook-request-guards-BwB_e49u.js";
import { t as getZaloRuntime } from "./runtime-DCdSmvQG.js";
import { t as ZaloApiError } from "./api-CExJv-YC.js";
//#region extensions/zalo/src/webhook-spool.ts
const ZALO_WEBHOOK_SPOOL_VERSION = 1;
const ZALO_WEBHOOK_DRAIN_INTERVAL_MS = 500;
const ZALO_WEBHOOK_MAX_CONCURRENT_DELIVERIES = 8;
const ZALO_WEBHOOK_PRUNE_INTERVAL_MS = 3600 * 1e3;
const ZALO_WEBHOOK_COMPLETED_TTL_MS = 720 * 60 * 6e4;
const ZALO_WEBHOOK_COMPLETED_MAX_ENTRIES = 2e4;
const ZALO_WEBHOOK_FAILED_TTL_MS = 720 * 60 * 6e4;
const ZALO_WEBHOOK_FAILED_MAX_ENTRIES = 5e3;
var ZaloWebhookPayloadError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "ZaloWebhookPayloadError";
	}
};
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function nonEmptyString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : null;
}
function parseRawRecord(rawEvent) {
	let parsed;
	try {
		parsed = JSON.parse(rawEvent);
	} catch (error) {
		throw new ZaloWebhookPayloadError("Zalo webhook body contains invalid JSON.", { cause: error });
	}
	if (!isRecord(parsed)) throw new ZaloWebhookPayloadError("Zalo webhook body must be a JSON object.");
	return parsed;
}
function resolveUpdateRecord(envelope) {
	if (envelope.ok === true && isRecord(envelope.result)) return envelope.result;
	return envelope;
}
function inspectZaloWebhookEvent(rawEvent) {
	const update = resolveUpdateRecord(parseRawRecord(rawEvent));
	const message = isRecord(update.message) ? update.message : null;
	const eventId = nonEmptyString(message?.message_id);
	if (!eventId) throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.message_id.");
	const chatId = nonEmptyString((isRecord(message?.chat) ? message.chat : null)?.id);
	if (!chatId) throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.chat.id.");
	return {
		eventId,
		laneKey: `chat:${chatId}`,
		update
	};
}
function parseClaimedUpdate(payload, claimedId) {
	if (payload.version !== ZALO_WEBHOOK_SPOOL_VERSION || typeof payload.rawEvent !== "string") throw new ZaloWebhookPayloadError("Zalo webhook spool payload is invalid.");
	const facts = inspectZaloWebhookEvent(payload.rawEvent);
	if (facts.eventId !== claimedId) throw new ZaloWebhookPayloadError("Zalo webhook message id changed after durable admission.");
	const eventName = nonEmptyString(facts.update.event_name);
	if (eventName !== "message.text.received" && eventName !== "message.image.received" && eventName !== "message.sticker.received" && eventName !== "message.unsupported.received") throw new ZaloWebhookPayloadError("Zalo webhook event_name is unsupported.");
	const message = facts.update.message;
	const from = isRecord(message.from) ? message.from : null;
	const chat = isRecord(message.chat) ? message.chat : null;
	if (!nonEmptyString(from?.id)) throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.from.id.");
	if (chat?.chat_type !== "PRIVATE" && chat?.chat_type !== "GROUP") throw new ZaloWebhookPayloadError("Zalo webhook message has an invalid chat type.");
	if (typeof message.date !== "number" || !Number.isFinite(message.date)) throw new ZaloWebhookPayloadError("Zalo webhook message has an invalid date.");
	if (eventName === "message.text.received" && typeof message.text !== "string") throw new ZaloWebhookPayloadError("Zalo text event is missing message.text.");
	return facts.update;
}
function errorText(error) {
	return error instanceof Error ? error.message : String(error);
}
function isZaloAuthenticationFailure(error) {
	let current = error;
	const seen = /* @__PURE__ */ new Set();
	while (current && typeof current === "object" && !seen.has(current)) {
		seen.add(current);
		const candidate = current;
		if (current instanceof ZaloApiError && (current.errorCode === 401 || current.errorCode === 403) || candidate.status === 401 || candidate.status === 403 || candidate.statusCode === 401 || candidate.statusCode === 403) return true;
		current = candidate.cause;
	}
	return false;
}
function createZaloWebhookIngress(options) {
	const queue = options.queue ?? getZaloRuntime().state.openChannelIngressQueue({ accountId: options.accountId });
	const deferredClaims = /* @__PURE__ */ new Map();
	const monitor = createChannelIngressMonitor({
		queue,
		inspect: (rawEvent) => inspectZaloWebhookEvent(rawEvent),
		payload: {
			storage: "raw-event",
			version: ZALO_WEBHOOK_SPOOL_VERSION,
			serialize: (rawEvent) => rawEvent,
			deserialize: (rawEvent) => rawEvent,
			createClaimError: (kind) => new ZaloWebhookPayloadError(kind === "invalid-version" ? "Zalo webhook spool payload is invalid." : "Zalo webhook identity changed after durable admission.")
		},
		deliver: async (_rawEvent, lifecycle, claim) => {
			const update = parseClaimedUpdate(claim.payload, claim.id);
			const boundLifecycle = bindIngressLifecycleToReplyOptions(lifecycle).turnAdoptionLifecycle;
			let resolveDeferredClaim;
			const deferredClaim = new Promise((resolve) => {
				resolveDeferredClaim = resolve;
			});
			let deferredClaimSettled = false;
			const settleDeferredClaim = () => {
				if (deferredClaimSettled) return;
				deferredClaimSettled = true;
				if (deferredClaims.get(claim.id) === deferredClaim) deferredClaims.delete(claim.id);
				resolveDeferredClaim();
			};
			await options.deliver(update, {
				...boundLifecycle,
				onAdopted: async () => {
					try {
						await boundLifecycle.onAdopted();
					} finally {
						settleDeferredClaim();
					}
				},
				onDeferred: () => {
					if (!deferredClaimSettled) deferredClaims.set(claim.id, deferredClaim);
					boundLifecycle.onDeferred();
				},
				onAbandoned: () => {
					Promise.resolve(boundLifecycle.onAbandoned()).finally(settleDeferredClaim);
				}
			});
			return deferredClaims.has(claim.id) ? { kind: "deferred" } : { kind: "completed" };
		},
		pollIntervalMs: ZALO_WEBHOOK_DRAIN_INTERVAL_MS,
		retention: {
			pruneIntervalMs: ZALO_WEBHOOK_PRUNE_INTERVAL_MS,
			completedTtlMs: ZALO_WEBHOOK_COMPLETED_TTL_MS,
			completedMaxEntries: ZALO_WEBHOOK_COMPLETED_MAX_ENTRIES,
			failedTtlMs: ZALO_WEBHOOK_FAILED_TTL_MS,
			failedMaxEntries: ZALO_WEBHOOK_FAILED_MAX_ENTRIES
		},
		waitForDeliveryIdleBeforeRepump: false,
		runPumpTask: runDetachedWebhookWork,
		drain: {
			adoptionStallTimeoutMs: DEFAULT_INGRESS_ADOPTION_STALL_MS,
			startLimit: ZALO_WEBHOOK_MAX_CONCURRENT_DELIVERIES,
			retryPolicy: {
				maxAttempts: 8,
				deadLetterMinAgeMs: 0
			},
			resolveNonRetryableFailure: (error) => {
				if (error instanceof ZaloWebhookPayloadError) return {
					reason: "invalid-event",
					message: error.message
				};
				if (isZaloAuthenticationFailure(error)) return {
					reason: "authentication-failed",
					message: errorText(error)
				};
				return null;
			},
			onLog: (message) => options.runtime.error?.(`zalo ingress: ${message}`)
		},
		createStoppedError: () => /* @__PURE__ */ new Error("Zalo ingress stopped."),
		onError: (error) => options.runtime.error?.(`zalo ingress drain failed: ${errorText(error)}`)
	});
	return {
		accept: async (rawEvent) => {
			await monitor.admit(rawEvent);
		},
		start: monitor.start,
		stop: async () => {
			await monitor.stop();
			await Promise.allSettled(deferredClaims.values());
		}
	};
}
const zaloWebhookIngressRuntime = { createZaloWebhookIngress };
//#endregion
export { zaloWebhookIngressRuntime as n, ZaloWebhookPayloadError as t };
