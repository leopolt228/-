import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { m as resolveGatewayPort, x as resolveStateDir } from "./paths-CHQRdQZ3.js";
import "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-Drrs61Fd.js";
import { n as listAgentIds } from "./agent-scope-config-S7z_Yn4H.js";
import { i as loadOrCreateProcessDeviceIdentity, o as publicKeyRawBase64UrlFromPem } from "./device-identity-cacJqJr9.js";
import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { t as resolveAdvertisedLanHost } from "./advertised-lan-host-DDnjw-XN.js";
import { c as setHeartbeatsEnabled, o as requestHeartbeat } from "./heartbeat-wake-CH_r-5du.js";
import { a as enqueueSystemEvent, c as isSystemEventContextChanged } from "./system-events-BNfyhKS3.js";
import "./sessions-Uqhj6EXw.js";
import { t as resolveMainSessionKeyFromConfig } from "./main-session.runtime.js";
import { l as loadGatewaySessionRow } from "./session-utils-CEU0rCPC.js";
import { t as closedObject } from "./closed-object-DY9fiMP-.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { Hr as validateSystemInfoParams, Lm as lazyCompile } from "./src-Cy32TawB.js";
import { i as resolveRuntimeOsLabel } from "./os-summary--1-t8Sb6.js";
import { t as getMachineDisplayName } from "./machine-name-yWXbHsN6.js";
import "./heartbeat-runner-BnH5H5-Z.js";
import { n as getLastHeartbeatEvent } from "./heartbeat-events-DlVntfRX.js";
import { r as tryReadDiskSpace } from "./disk-space-CzASwJhY.js";
import { n as updateSystemPresence, t as listSystemPresence } from "./system-presence-DC0E007m.js";
import { t as assertValidParams } from "./validation-5fLHFuIF.js";
import { t as getGatewayProcessInstanceId } from "./process-instance-CwB3RMsz.js";
import { t as broadcastPresenceSnapshot } from "./presence-events-oTVUXVxs.js";
import os from "node:os";
import { Type } from "typebox";
const validateSystemEventParams = /* @__PURE__ */ lazyCompile(closedObject({
	text: Type.String(),
	idempotencyKey: Type.Optional(Type.String({ minLength: 1 })),
	sessionKey: Type.Optional(Type.String()),
	wake: Type.Optional(Type.Boolean()),
	deviceId: Type.Optional(Type.String()),
	instanceId: Type.Optional(Type.String()),
	host: Type.Optional(Type.String()),
	ip: Type.Optional(Type.String()),
	mode: Type.Optional(Type.String()),
	version: Type.Optional(Type.String()),
	platform: Type.Optional(Type.String()),
	deviceFamily: Type.Optional(Type.String()),
	modelIdentifier: Type.Optional(Type.String()),
	lastInputSeconds: Type.Optional(Type.Number()),
	reason: Type.Optional(Type.String()),
	roles: Type.Optional(Type.Array(Type.String())),
	scopes: Type.Optional(Type.Array(Type.String())),
	tags: Type.Optional(Type.Array(Type.String()))
}));
//#endregion
//#region src/gateway/server-methods/system.ts
let advertisedLanHostPromise = null;
function resolveCachedAdvertisedLanHost() {
	advertisedLanHostPromise ??= resolveAdvertisedLanHost().catch(() => null);
	return advertisedLanHostPromise;
}
async function collectSystemInfo(context) {
	const cpus = os.cpus();
	const cpuModel = cpus[0]?.model.trim() || void 0;
	const [oneMinute = 0, fiveMinutes = 0, fifteenMinutes = 0] = os.loadavg();
	const loadAverage = [
		oneMinute,
		fiveMinutes,
		fifteenMinutes
	];
	const stateDir = resolveStateDir();
	const disk = tryReadDiskSpace(stateDir);
	const port = resolveGatewayPort(context.getRuntimeConfig());
	const lanAddress = await resolveCachedAdvertisedLanHost() ?? void 0;
	return {
		machineName: await getMachineDisplayName(),
		hostname: os.hostname(),
		platform: os.platform(),
		release: os.release(),
		arch: os.arch(),
		osLabel: resolveRuntimeOsLabel(),
		...lanAddress ? { lanAddress } : {},
		port,
		nodeVersion: process.version,
		pid: process.pid,
		processInstanceId: getGatewayProcessInstanceId(),
		uptimeMs: Math.round(process.uptime() * 1e3),
		cpuCount: cpus.length,
		...cpuModel ? { cpuModel } : {},
		...loadAverage.some((value) => value !== 0) ? { loadAverage } : {},
		memoryTotalBytes: os.totalmem(),
		memoryFreeBytes: os.freemem(),
		...disk?.totalBytes != null ? {
			diskTotalBytes: disk.totalBytes,
			diskAvailableBytes: disk.availableBytes,
			diskPath: stateDir
		} : {}
	};
}
/** Gateway handlers for identity, host information, heartbeat toggles, and presence events. */
const systemHandlers = {
	"gateway.identity.get": ({ respond }) => {
		const identity = loadOrCreateProcessDeviceIdentity();
		respond(true, {
			deviceId: identity.deviceId,
			publicKey: publicKeyRawBase64UrlFromPem(identity.publicKeyPem)
		}, void 0);
	},
	"last-heartbeat": ({ respond }) => {
		respond(true, getLastHeartbeatEvent(), void 0);
	},
	"set-heartbeats": ({ params, respond }) => {
		const enabled = params.enabled;
		if (typeof enabled !== "boolean") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid set-heartbeats params: enabled (boolean) required"));
			return;
		}
		setHeartbeatsEnabled(enabled);
		respond(true, {
			ok: true,
			enabled
		}, void 0);
	},
	"system-presence": ({ respond }) => {
		respond(true, listSystemPresence(), void 0);
	},
	"system.info": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSystemInfoParams, "system.info", respond)) return;
		respond(true, await collectSystemInfo(context), void 0);
	},
	"system-event": ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSystemEventParams, "system-event", respond)) return;
		const text = normalizeOptionalString(params.text) ?? "";
		if (!text) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "text required"));
			return;
		}
		const requestedSessionKey = normalizeOptionalString(params.sessionKey);
		const sessionKey = requestedSessionKey ?? resolveMainSessionKeyFromConfig();
		const wake = params.wake === true;
		const isNodePresenceLine = text.startsWith("Node:");
		if (wake && isNodePresenceLine) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wake is not supported for node presence events"));
			return;
		}
		if (wake && requestedSessionKey) {
			const targetAgentId = normalizeAgentId(resolveAgentIdFromSessionKey(requestedSessionKey));
			if (!listAgentIds(context.getRuntimeConfig()).map(normalizeAgentId).includes(targetAgentId)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${targetAgentId}"`));
				return;
			}
			const targetSession = loadGatewaySessionRow(requestedSessionKey, { agentId: targetAgentId });
			if (!targetSession || targetSession.archived) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Unknown or archived session "${requestedSessionKey}"`));
				return;
			}
		}
		const deviceId = readStringValue(params.deviceId);
		const instanceId = readStringValue(params.instanceId);
		const host = readStringValue(params.host);
		const ip = readStringValue(params.ip);
		const mode = readStringValue(params.mode);
		const version = readStringValue(params.version);
		const platform = readStringValue(params.platform);
		const deviceFamily = readStringValue(params.deviceFamily);
		const modelIdentifier = readStringValue(params.modelIdentifier);
		const lastInputSeconds = typeof params.lastInputSeconds === "number" && Number.isFinite(params.lastInputSeconds) ? params.lastInputSeconds : void 0;
		const reason = readStringValue(params.reason);
		const presenceUpdate = updateSystemPresence({
			text,
			deviceId,
			instanceId,
			host,
			ip,
			mode,
			version,
			platform,
			deviceFamily,
			modelIdentifier,
			lastInputSeconds,
			reason,
			roles: Array.isArray(params.roles) && params.roles.every((t) => typeof t === "string") ? params.roles : void 0,
			scopes: Array.isArray(params.scopes) && params.scopes.every((t) => typeof t === "string") ? params.scopes : void 0,
			tags: Array.isArray(params.tags) && params.tags.every((t) => typeof t === "string") ? params.tags : void 0
		});
		if (isNodePresenceLine) {
			const next = presenceUpdate.next;
			const changed = new Set(presenceUpdate.changedKeys);
			const reasonValue = next.reason ?? reason;
			const normalizedReason = normalizeLowercaseStringOrEmpty(reasonValue);
			const ignoreReason = normalizedReason.startsWith("periodic") || normalizedReason === "heartbeat" || normalizedReason === "connect" || normalizedReason === "launch" || normalizedReason === "instances-refresh";
			const hostChanged = changed.has("host");
			const ipChanged = changed.has("ip");
			const versionChanged = changed.has("version");
			const modeChanged = changed.has("mode");
			const reasonChanged = changed.has("reason") && !ignoreReason;
			if (hostChanged || ipChanged || versionChanged || modeChanged || reasonChanged) {
				const contextChanged = isSystemEventContextChanged(sessionKey, presenceUpdate.key);
				const parts = [];
				if (contextChanged || hostChanged || ipChanged) {
					const hostLabel = normalizeOptionalString(next.host) ?? "Unknown";
					const ipLabel = normalizeOptionalString(next.ip);
					parts.push(`Node: ${hostLabel}${ipLabel ? ` (${ipLabel})` : ""}`);
				}
				if (versionChanged) parts.push(`app ${normalizeOptionalString(next.version) ?? "unknown"}`);
				if (modeChanged) parts.push(`mode ${normalizeOptionalString(next.mode) ?? "unknown"}`);
				if (reasonChanged) parts.push(`reason ${normalizeOptionalString(reasonValue) ?? "event"}`);
				const deltaText = parts.join(" · ");
				if (deltaText) enqueueSystemEvent(deltaText, {
					sessionKey,
					contextKey: presenceUpdate.key
				});
			}
		} else {
			enqueueSystemEvent(text, { sessionKey });
			if (wake) requestHeartbeat({
				source: "notifications-event",
				intent: "immediate",
				reason: "wake",
				sessionKey,
				heartbeat: { target: "last" }
			});
		}
		broadcastPresenceSnapshot({
			broadcast: context.broadcast,
			incrementPresenceVersion: context.incrementPresenceVersion,
			getHealthVersion: context.getHealthVersion
		});
		respond(true, { ok: true }, void 0);
	}
};
//#endregion
export { systemHandlers };
