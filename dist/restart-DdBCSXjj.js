import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import "./number-coercion-Crk_c9KW.js";
import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { i as readActiveGatewayLockIdentity } from "./gateway-lock-DuOE-FjH.js";
import { i as getActiveGatewayRootWorkCount } from "./gateway-work-admission-CLw1UuhK.js";
import { d as scheduleGatewaySigusr1Restart, s as requestGatewayRestartWithSignalAdmission } from "./restart-B84EHBne.js";
import { t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-Be5P18zA.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
//#region src/infra/restart-coordinator.ts
function createSafeGatewayRestartPreflight(inspectors = {}) {
	const snapshot = createGatewayActiveWorkSnapshot({
		...inspectors,
		getRootRequests: inspectors.getRootRequests ?? (() => getActiveGatewayRootWorkCount({ excludeCurrent: true })),
		getSessionAdmissions: () => 0,
		getSessionMutations: () => 0,
		getChatRuns: () => 0,
		getQueuedTurns: () => 0,
		getTerminalPersistence: () => 0,
		getTerminalSessions: () => 0
	});
	const counts = {
		queueSize: snapshot.counts.queueSize,
		pendingReplies: snapshot.counts.pendingReplies,
		embeddedRuns: snapshot.counts.embeddedRuns,
		cronRuns: snapshot.counts.cronRuns,
		backgroundExecSessions: snapshot.counts.backgroundExecSessions,
		rootRequests: snapshot.counts.rootRequests,
		activeTasks: snapshot.counts.activeTasks,
		totalActive: snapshot.counts.queueSize + snapshot.counts.pendingReplies + snapshot.counts.embeddedRuns + snapshot.counts.cronRuns + snapshot.counts.backgroundExecSessions + snapshot.counts.rootRequests + snapshot.counts.activeTasks
	};
	const blockers = snapshot.blockers;
	const summary = blockers.length === 0 ? "safe to restart now" : `restart deferred: ${blockers.map((blocker) => blocker.message).join("; ")}`;
	return {
		safe: counts.totalActive === 0,
		counts,
		blockers,
		summary
	};
}
/** Schedule a gateway restart after collecting tracked active-work blockers. */
function requestSafeGatewayRestart(opts = {}) {
	const preflight = createSafeGatewayRestartPreflight(opts.inspect);
	const skipDeferral = opts.skipDeferral === true;
	const restart = scheduleGatewaySigusr1Restart({
		delayMs: opts.delayMs ?? 0,
		reason: opts.reason ?? "gateway.restart.safe",
		...opts.preservePendingEmitHooks === true || skipDeferral ? { preservePendingEmitHooksOnDeferralBypass: true } : {},
		...skipDeferral ? { skipDeferral: true } : {}
	});
	return {
		ok: true,
		status: restart.coalesced ? "coalesced" : skipDeferral || preflight.safe ? "scheduled" : "deferred",
		preflight,
		restart
	};
}
//#endregion
//#region src/gateway/server-methods/restart.ts
function isRestartRequestParams(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function normalizeReason(value) {
	return typeof value === "string" && value.trim() ? truncateUtf16Safe(value.trim(), 200) : void 0;
}
function normalizeSkipDeferral(value) {
	return value === true;
}
function parseTargetedGatewayRestart(value) {
	if (value === void 0) return;
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const target = value;
	if (typeof target.pid !== "number" || !Number.isSafeInteger(target.pid) || target.pid <= 0 || typeof target.ownerId !== "string" || !target.ownerId.trim() || typeof target.port !== "number" || !Number.isInteger(target.port) || target.port <= 0 || target.port > 65535) return null;
	return {
		pid: target.pid,
		ownerId: target.ownerId.trim(),
		port: target.port
	};
}
function parseTargetedRestartIntent(value, reason) {
	if (value !== void 0 && (!value || typeof value !== "object" || Array.isArray(value))) return null;
	const raw = value ?? {};
	const force = raw.force === true;
	const waitMs = typeof raw.waitMs === "number" && Number.isSafeInteger(raw.waitMs) && raw.waitMs >= 0 && raw.waitMs <= 2147e6 ? raw.waitMs : void 0;
	if (raw.force !== void 0 && typeof raw.force !== "boolean" || raw.waitMs !== void 0 && waitMs === void 0 || force && waitMs !== void 0) return null;
	return {
		...reason ? { reason } : {},
		...force ? { force: true } : {},
		...waitMs !== void 0 ? { waitMs } : {}
	};
}
/** Gateway request handlers for safe restart coordination. */
const restartHandlers = {
	"gateway.restart.request": async ({ respond, params }) => {
		if (!isRestartRequestParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid gateway.restart.request params"));
			return;
		}
		const reason = normalizeReason(params.reason);
		const target = parseTargetedGatewayRestart(params.target);
		if (target === null) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid targeted gateway restart"));
			return;
		}
		if (target) {
			const intent = parseTargetedRestartIntent(params.restartIntent, reason);
			if (!intent) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid targeted gateway restart intent"));
				return;
			}
			const activeLock = await readActiveGatewayLockIdentity().catch(() => void 0);
			if (!activeLock || activeLock.pid !== process.pid || activeLock.pid !== target.pid || activeLock.ownerId !== target.ownerId || activeLock.port !== target.port) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "target gateway no longer owns the active lock"));
				return;
			}
			const result = requestGatewayRestartWithSignalAdmission(reason, intent);
			if (result.status === "failed") {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "target gateway restart delivery failed"));
				return;
			}
			respond(true, {
				ok: true,
				status: result.status,
				pid: process.pid
			});
			return;
		}
		respond(true, requestSafeGatewayRestart({
			reason,
			delayMs: 0,
			skipDeferral: normalizeSkipDeferral(params.skipDeferral)
		}));
	},
	"gateway.restart.preflight": async ({ respond }) => {
		respond(true, createSafeGatewayRestartPreflight());
	}
};
//#endregion
export { restartHandlers };
