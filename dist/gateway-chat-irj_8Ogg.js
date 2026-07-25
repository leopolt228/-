import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as sleep } from "./sleep-Ce8zcpEF.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import { t as assertExplicitGatewayAuthModeWhenBothConfigured } from "./auth-mode-policy-BBlyaJJE.js";
import { i as isLoopbackHost } from "./net-DBokCmJs.js";
import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import "./config-BOMcY2yX.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES, t as GATEWAY_CLIENT_CAPS } from "./client-info-D4mGPeue.js";
import "./version-CwNT1gaY.js";
import { d as ensureExplicitGatewayAuth, o as buildGatewayConnectionDetails, v as resolveExplicitGatewayAuth } from "./call-ChM1o8yU.js";
import { t as GatewayClient } from "./client-DpNJQtBd.js";
import { r as roleScopesAllow } from "./operator-scope-compat-BVrjvlGm.js";
import { t as startGatewayClientWhenEventLoopReady } from "./client-start-readiness-DNgt3RJE.js";
import { n as GatewayClientRequestError } from "./client-U9ekE9wL.js";
import { a as readActiveGatewayLockPort } from "./gateway-lock-DuOE-FjH.js";
import { t as resolveGatewayInteractiveSurfaceAuth } from "./auth-surface-resolution-DJ8ycR-4.js";
import { n as TUI_SETUP_AUTH_SOURCE_ENV, t as TUI_SETUP_AUTH_SOURCE_CONFIG } from "./setup-launch-env-DehdAyoV.js";
import { randomUUID } from "node:crypto";
//#region src/tui/gateway-chat.ts
const STARTUP_CHAT_HISTORY_RETRY_TIMEOUT_MS = 6e4;
const STARTUP_CHAT_HISTORY_DEFAULT_RETRY_MS = 500;
const STARTUP_CHAT_HISTORY_MAX_RETRY_MS = 5e3;
function throwGatewayAuthResolutionError(reason) {
	throw new Error([
		reason,
		"Fix: set OPENCLAW_GATEWAY_TOKEN/OPENCLAW_GATEWAY_PASSWORD, pass --token/--password,",
		"or resolve the configured secret provider for this credential."
	].join("\n"));
}
function isRetryableStartupUnavailable(err, method) {
	if (!(err instanceof GatewayClientRequestError)) return false;
	if (err.gatewayCode !== "UNAVAILABLE" || !err.retryable) return false;
	const details = err.details;
	if (!details || typeof details !== "object") return true;
	const detailMethod = details.method;
	return typeof detailMethod !== "string" || detailMethod === method;
}
function resolveStartupRetryDelayMs(err) {
	const retryAfterMs = typeof err.retryAfterMs === "number" ? err.retryAfterMs : STARTUP_CHAT_HISTORY_DEFAULT_RETRY_MS;
	return Math.min(Math.max(retryAfterMs, 100), STARTUP_CHAT_HISTORY_MAX_RETRY_MS);
}
function nonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
function isLegacyPreserveSideRunsError(err) {
	if (!(err instanceof GatewayClientRequestError) || err.gatewayCode !== "INVALID_REQUEST") return false;
	const message = err.message.toLowerCase();
	return message.includes("invalid chat.abort params") && message.includes("preservesideruns");
}
function isLegacySucceedsParentError(err) {
	if (!(err instanceof GatewayClientRequestError) || err.gatewayCode !== "INVALID_REQUEST") return false;
	const message = err.message.toLowerCase();
	return message.includes("invalid sessions.create params") && message.includes("succeedsparent");
}
var GatewayChatClient = class GatewayChatClient {
	constructor(connection) {
		this.connection = connection;
		this.readyPromise = new Promise((resolve) => {
			this.resolveReady = resolve;
		});
		this.client = new GatewayClient({
			url: connection.url,
			token: connection.token,
			password: connection.password,
			tlsFingerprint: connection.tlsFingerprint,
			preauthHandshakeTimeoutMs: connection.preauthHandshakeTimeoutMs,
			clientName: GATEWAY_CLIENT_NAMES.TUI,
			clientDisplayName: "openclaw-tui",
			clientVersion: VERSION,
			platform: process.platform,
			mode: GATEWAY_CLIENT_MODES.UI,
			deviceIdentity: connection.allowInsecureLocalOperatorUi ? null : void 0,
			caps: [
				GATEWAY_CLIENT_CAPS.PLUGIN_APPROVALS,
				GATEWAY_CLIENT_CAPS.TASK_SUGGESTIONS,
				GATEWAY_CLIENT_CAPS.TOOL_EVENTS
			],
			instanceId: randomUUID(),
			minProtocol: 4,
			maxProtocol: 4,
			onHelloOk: (hello) => {
				this.hello = hello;
				this.resolveReady?.();
				this.onConnected?.();
			},
			onEvent: (evt) => {
				this.onEvent?.({
					event: evt.event,
					payload: evt.payload,
					seq: evt.seq
				});
			},
			onClose: (_code, reason) => {
				this.readyPromise = new Promise((resolve) => {
					this.resolveReady = resolve;
				});
				this.onDisconnected?.(reason);
			},
			onGap: (info) => {
				this.onGap?.(info);
			}
		});
	}
	static async connect(opts) {
		const connection = await resolveGatewayConnection(opts);
		return new GatewayChatClient(connection);
	}
	/** Connect to a target already selected and authenticated by a preceding Gateway probe. */
	static connectBound(opts) {
		return new GatewayChatClient(resolveBoundGatewayConnection(opts));
	}
	start() {
		startGatewayClientWhenEventLoopReady(this.client, { clientOptions: { preauthHandshakeTimeoutMs: this.connection.preauthHandshakeTimeoutMs } }).then((readiness) => {
			if (!readiness.ready && !readiness.aborted) this.onDisconnected?.("gateway event loop readiness timeout");
		}).catch((err) => {
			this.onDisconnected?.(err instanceof Error ? err.message : String(err));
		});
	}
	stop() {
		return this.client.stopAndWait();
	}
	async subscribeSessionEvents() {
		return await this.client.request("sessions.subscribe", {});
	}
	async waitForReady() {
		await this.readyPromise;
	}
	async sendChat(opts) {
		const runId = opts.runId ?? randomUUID();
		const response = await this.client.request("chat.send", {
			sessionKey: opts.sessionKey,
			...opts.agentId ? { agentId: opts.agentId } : {},
			...opts.sessionId ? { sessionId: opts.sessionId } : {},
			message: opts.message,
			thinking: opts.thinking,
			deliver: opts.deliver,
			timeoutMs: opts.timeoutMs,
			idempotencyKey: runId
		});
		const acceptedRunId = nonEmptyString(response?.runId) ?? runId;
		const status = nonEmptyString(response?.status);
		return status ? {
			runId: acceptedRunId,
			status
		} : { runId: acceptedRunId };
	}
	async abortChat(opts) {
		const params = {
			sessionKey: opts.sessionKey,
			...opts.agentId ? { agentId: opts.agentId } : {},
			...opts.runId ? { runId: opts.runId } : {}
		};
		if (opts.runId) return await this.client.request("chat.abort", params);
		try {
			return await this.client.request("chat.abort", {
				...params,
				preserveSideRuns: true
			});
		} catch (err) {
			if (!isLegacyPreserveSideRunsError(err)) throw err;
			return await this.client.request("chat.abort", params);
		}
	}
	async loadHistory(opts) {
		const startedAt = Date.now();
		for (;;) try {
			return await this.client.request("chat.history", {
				sessionKey: opts.sessionKey,
				...opts.agentId ? { agentId: opts.agentId } : {},
				limit: opts.limit
			});
		} catch (err) {
			if (Date.now() - startedAt < STARTUP_CHAT_HISTORY_RETRY_TIMEOUT_MS && isRetryableStartupUnavailable(err, "chat.history")) {
				await sleep(resolveStartupRetryDelayMs(err));
				continue;
			}
			throw err;
		}
	}
	async listSessions(opts) {
		return await this.client.request("sessions.list", opts ?? {});
	}
	async listAgents() {
		return await this.client.request("agents.list", {});
	}
	async patchSession(opts) {
		return await this.client.request("sessions.patch", opts);
	}
	async createSession(opts) {
		const params = {
			...opts,
			emitCommandHooks: Boolean(opts.parentSessionKey)
		};
		try {
			return await this.client.request("sessions.create", params);
		} catch (err) {
			if (opts.succeedsParent === void 0 || !isLegacySucceedsParentError(err)) throw err;
			const { succeedsParent: _succeedsParent, ...legacyParams } = params;
			if (!opts.succeedsParent) {
				const { parentSessionKey: _parentSessionKey, emitCommandHooks: _emitCommandHooks, ...parallelParams } = legacyParams;
				return await this.client.request("sessions.create", parallelParams);
			}
			return await this.client.request("sessions.create", legacyParams);
		}
	}
	async resetSession(key, reason, opts) {
		return await this.client.request("sessions.reset", {
			key,
			...opts?.agentId ? { agentId: opts.agentId } : {},
			...reason ? { reason } : {}
		});
	}
	async getGatewayStatus() {
		return await this.client.request("status");
	}
	async listModels() {
		const res = await this.client.request("models.list");
		return Array.isArray(res?.models) ? res.models : [];
	}
	async listCommands(opts) {
		const res = await this.client.request("commands.list", opts ?? {});
		return Array.isArray(res?.commands) ? res.commands : [];
	}
	async listPluginApprovals() {
		return await this.client.request("plugin.approval.list", {});
	}
	async resolvePluginApproval(id, decision) {
		return await this.client.request("plugin.approval.resolve", {
			id,
			decision
		});
	}
	getTaskSuggestionActionCapabilities() {
		const auth = this.hello?.auth;
		const methods = this.hello?.features?.methods;
		const allows = (method, scope) => Array.isArray(methods) && methods.includes(method) && Boolean(auth && roleScopesAllow({
			role: auth.role,
			requestedScopes: [scope],
			allowedScopes: auth.scopes
		}));
		return {
			canAccept: allows("taskSuggestions.accept", "operator.admin"),
			canDismiss: allows("taskSuggestions.dismiss", "operator.write")
		};
	}
	async listTaskSuggestions() {
		if (this.hello?.features?.methods?.includes("taskSuggestions.list") !== true) return [];
		const actions = this.getTaskSuggestionActionCapabilities();
		if (!actions.canAccept && !actions.canDismiss) return [];
		return (await this.client.request("taskSuggestions.list", {})).suggestions;
	}
	async acceptTaskSuggestion(taskId) {
		return await this.client.request("taskSuggestions.accept", { taskId });
	}
	async dismissTaskSuggestion(taskId) {
		return await this.client.request("taskSuggestions.dismiss", { taskId });
	}
};
/**
* Preserve a pre-probed Gateway route across an in-process handoff. This path
* deliberately ignores global config and Gateway env overrides, including
* credentials, while still applying the normal remote URL safety policy.
*/
function resolveBoundGatewayConnection(opts) {
	const url = buildGatewayConnectionDetails({
		config: opts.config,
		url: opts.url,
		ignoreEnvUrlOverride: true
	}).url;
	const explicitAuth = resolveExplicitGatewayAuth({
		token: opts.token,
		password: opts.password
	});
	return {
		url,
		token: explicitAuth.token,
		password: explicitAuth.password,
		...opts.tlsFingerprint ? { tlsFingerprint: opts.tlsFingerprint } : {},
		allowInsecureLocalOperatorUi: false
	};
}
async function resolveGatewayConnection(opts) {
	const config = getRuntimeConfig();
	const env = process.env;
	const gatewayAuthMode = config.gateway?.auth?.mode;
	const isRemoteMode = config.gateway?.mode === "remote";
	const preferConfiguredAuth = env[TUI_SETUP_AUTH_SOURCE_ENV] === TUI_SETUP_AUTH_SOURCE_CONFIG;
	const urlOverride = typeof opts.url === "string" && opts.url.trim().length > 0 ? opts.url.trim() : void 0;
	const explicitAuth = resolveExplicitGatewayAuth({
		token: opts.token,
		password: opts.password
	});
	ensureExplicitGatewayAuth({
		urlOverride,
		urlOverrideSource: "cli",
		explicitAuth,
		errorHint: "Fix: pass --token or --password when using --url."
	});
	const activeLocalGatewayPort = Boolean(urlOverride || env.OPENCLAW_GATEWAY_URL?.trim() || env.OPENCLAW_GATEWAY_PORT?.trim() || isRemoteMode) ? void 0 : await readActiveGatewayLockPort();
	const url = buildGatewayConnectionDetails({
		config,
		...urlOverride ? { url: urlOverride } : {},
		...activeLocalGatewayPort ? { localPortOverride: activeLocalGatewayPort } : {}
	}).url;
	const allowInsecureLocalOperatorUi = (() => {
		if (config.gateway?.controlUi?.allowInsecureAuth !== true) return false;
		try {
			return isLoopbackHost(new URL(url).hostname);
		} catch {
			return false;
		}
	})();
	if (urlOverride) return {
		url,
		token: explicitAuth.token,
		password: explicitAuth.password,
		...opts.tlsFingerprint ? { tlsFingerprint: opts.tlsFingerprint } : {},
		allowInsecureLocalOperatorUi
	};
	if (isRemoteMode) {
		const resolved = await resolveGatewayInteractiveSurfaceAuth({
			config,
			env,
			explicitAuth,
			suppressEnvAuthFallback: preferConfiguredAuth,
			surface: "remote"
		});
		if (resolved.failureReason) throwGatewayAuthResolutionError(resolved.failureReason);
		return {
			url,
			token: resolved.token,
			password: resolved.password,
			...opts.tlsFingerprint ?? config.gateway?.remote?.tlsFingerprint ? { tlsFingerprint: opts.tlsFingerprint ?? config.gateway?.remote?.tlsFingerprint } : {},
			allowInsecureLocalOperatorUi: false
		};
	}
	if (gatewayAuthMode === "none" || gatewayAuthMode === "trusted-proxy") {
		const resolved = await resolveGatewayInteractiveSurfaceAuth({
			config,
			env,
			explicitAuth,
			surface: "local"
		});
		return {
			url,
			token: resolved.token,
			password: resolved.password,
			...opts.tlsFingerprint ? { tlsFingerprint: opts.tlsFingerprint } : {},
			allowInsecureLocalOperatorUi
		};
	}
	try {
		assertExplicitGatewayAuthModeWhenBothConfigured(config);
	} catch (err) {
		throwGatewayAuthResolutionError(formatErrorMessage(err));
	}
	const resolved = await resolveGatewayInteractiveSurfaceAuth({
		config,
		env,
		explicitAuth,
		suppressEnvAuthFallback: preferConfiguredAuth,
		surface: "local"
	});
	if (resolved.failureReason) throwGatewayAuthResolutionError(resolved.failureReason);
	return {
		url,
		token: resolved.token,
		password: resolved.password,
		...opts.tlsFingerprint ? { tlsFingerprint: opts.tlsFingerprint } : {},
		allowInsecureLocalOperatorUi
	};
}
//#endregion
export { GatewayChatClient };
