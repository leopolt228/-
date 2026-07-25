import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { A as resolvePositiveTimerTimeoutMs, d as clampPositiveTimerTimeoutMs } from "./number-coercion-Crk_c9KW.js";
import { t as sanitizeForLog } from "./ansi-BEaQ2G9r.js";
import { r as readTrimmedStringAlias } from "./string-readers-A0wspDGq.js";
import { a as logWarn } from "./logger-DT9z6GgH.js";
import { a as redactSensitiveUrl, o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-CkPr90q0.js";
import { a as loadUndiciRuntimeDeps } from "./undici-runtime-CvoyIVwn.js";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "./ssrf-eKWXIRoD.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-C7JzO8vD.js";
import { n as withOpenClawStateLease } from "./registry-BSBtFA2q.js";
import { d as loadAuthProfileStoreForSecretsRuntime } from "./store-BTcmQtbp.js";
import { t as wrapGuardedBodyStream } from "./guarded-body-stream-2l29s8uD.js";
import { n as resolveApiKeyForProfile } from "./oauth-t9_FvpLo.js";
import { i as resolveOpenClawMcpTransportAlias } from "./mcp-config-normalize-C4v_5S7O.js";
import { i as toMcpStringRecord, t as isMcpConfigRecord } from "./mcp-config-shared-DHNeNaPb.js";
import { a as resolveMcpOAuthStoreKey, i as readMcpOAuthStoreReadOnly, o as updateMcpOAuthStore, r as readMcpOAuthStore, t as clearMcpOAuthStore } from "./mcp-oauth-store-DCOq9PUx.js";
import { n as resolveStdioMcpServerLaunchConfig, t as describeStdioMcpServerLaunchConfig } from "./mcp-stdio-D6qe0U6h.js";
import crypto, { randomUUID } from "node:crypto";
import fs from "node:fs";
import { auth } from "@modelcontextprotocol/sdk/client/auth.js";
//#region src/agents/mcp-http-fetch.ts
/**
* MCP HTTP fetch wrappers.
* Adds SSRF protection, scoped TLS/client-cert dispatchers, response cleanup,
* and same-origin header handling around the MCP SDK fetch contract.
*/
/** Default MCP HTTP fetch backed by lazy-loaded undici runtime deps. */
const fetchWithUndici = async (url, init) => await loadUndiciRuntimeDeps().fetch(url, init);
const fetchWithUndiciGuard = async (input, init) => await fetchWithUndici(input instanceof Request ? input.url : input, init);
const MCP_HTTP_MAX_REDIRECTS = 20;
function resolveFetchRequest(input, init) {
	if (input instanceof Request) {
		const request = new Request(input, init);
		const body = request.body ?? void 0;
		return {
			url: request.url,
			signal: request.signal,
			init: {
				method: request.method,
				headers: request.headers,
				body,
				redirect: request.redirect,
				...body ? { duplex: "half" } : {}
			}
		};
	}
	const { signal, ...requestInit } = init ?? {};
	return {
		url: input instanceof URL ? input.toString() : input,
		signal: signal ?? void 0,
		init: init ? requestInit : void 0
	};
}
async function ensureGlobalFetchResponse(response) {
	const init = {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	};
	if (response.body != null) return new Response(response.body, init);
	if (response.status === 204 || response.status === 205 || response.status === 304) return new Response(null, init);
	return new Response(null, init);
}
async function buildManagedMcpResponse(response, release, refreshTimeout) {
	if (!response.body) {
		release();
		return await ensureGlobalFetchResponse(response);
	}
	const wrappedBody = wrapGuardedBodyStream({
		body: response.body,
		cleanup: release,
		refreshTimeout
	});
	return await ensureGlobalFetchResponse(new Response(wrappedBody, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	}));
}
/** Builds an MCP fetch function with optional TLS/client-cert dispatcher support. */
function buildMcpHttpFetch(params) {
	const needsCustomDispatcher = params.sslVerify === false || Boolean(params.clientCert || params.clientKey);
	const scopedOrigin = params.resourceUrl ? new URL(params.resourceUrl).origin : void 0;
	const policy = params.resourceUrl ? ssrfPolicyFromHttpBaseUrlAllowedOrigin(params.resourceUrl) : void 0;
	let customConnect;
	const resolveCustomDispatcherPolicy = (url) => {
		if (!needsCustomDispatcher || !scopedOrigin || url.origin !== scopedOrigin) return;
		customConnect ??= {
			...params.sslVerify === false ? { rejectUnauthorized: false } : {},
			...params.clientCert ? { cert: fs.readFileSync(params.clientCert, "utf-8") } : {},
			...params.clientKey ? { key: fs.readFileSync(params.clientKey, "utf-8") } : {}
		};
		return {
			mode: "direct",
			connect: customConnect
		};
	};
	return async (url, init) => {
		const request = resolveFetchRequest(url, init);
		const guarded = await fetchWithSsrFGuard({
			url: request.url,
			init: request.init,
			fetchImpl: fetchWithUndiciGuard,
			maxRedirects: MCP_HTTP_MAX_REDIRECTS,
			allowCrossOriginUnsafeRedirectReplay: true,
			auditContext: "mcp-http",
			useEnvProxyForEligibleUrls: true,
			...request.signal ? { signal: request.signal } : {},
			...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
			...policy ? { policy } : {},
			...needsCustomDispatcher ? { resolveDispatcherPolicy: resolveCustomDispatcherPolicy } : {}
		});
		return await buildManagedMcpResponse(guarded.response, guarded.release, guarded.refreshTimeout);
	};
}
/** Removes Authorization from MCP headers before forwarding to non-authorized paths. */
function withoutMcpAuthorizationHeader(headers) {
	if (!headers) return;
	const entries = Object.entries(headers).filter(([key]) => key.toLowerCase() !== "authorization");
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
/** Wraps MCP fetch so configured headers are applied only to the resource origin. */
function withSameOriginMcpHttpHeaders(params) {
	if (!params.headers || Object.keys(params.headers).length === 0) return params.fetchFn;
	const resourceOrigin = new URL(params.resourceUrl).origin;
	return (url, init) => {
		if (new URL(url).origin !== resourceOrigin) return params.fetchFn(url, init);
		const headers = new Headers(params.headers);
		for (const [key, value] of new Headers(init?.headers)) headers.set(key, value);
		return params.fetchFn(url, {
			...init,
			headers
		});
	};
}
//#endregion
//#region src/agents/mcp-oauth-provider.ts
/** MCP SDK OAuth provider backed by canonical OpenClaw state. */
const LEGACY_DEFAULT_REDIRECT_URL = "http://127.0.0.1:8989/oauth/callback";
function resolveTokenExpiresAt(tokens) {
	const expiresIn = tokens.expires_in;
	return typeof expiresIn === "number" && Number.isFinite(expiresIn) ? Date.now() + expiresIn * 1e3 : void 0;
}
function resolveOAuthRedirectUrl(config, store = {}) {
	return normalizeOptionalString(config.redirectUrl) ?? normalizeOptionalString(store.redirectUrl) ?? LEGACY_DEFAULT_REDIRECT_URL;
}
function buildOAuthClientMetadata(config, store = {}) {
	return {
		client_name: "OpenClaw MCP",
		redirect_uris: [resolveOAuthRedirectUrl(config, store)],
		grant_types: ["authorization_code", "refresh_token"],
		response_types: ["code"],
		token_endpoint_auth_method: "none",
		...normalizeOptionalString(config.scope) ? { scope: normalizeOptionalString(config.scope) } : {}
	};
}
function bindMcpOAuthLeaseAssertion(lease) {
	return lease ? (database) => lease.assertOwnedInTransaction(database) : void 0;
}
/** Bind OAuth network work to the lease that fences its persisted side effects. */
function withMcpOAuthLeaseSignal(fetchFn, leaseSignal) {
	const baseFetch = fetchFn ?? ((url, init) => fetch(url, init));
	return async (url, init) => {
		const requestSignal = init?.signal;
		const signal = requestSignal ? AbortSignal.any([requestSignal, leaseSignal]) : leaseSignal;
		return await baseFetch(url, {
			...init,
			signal
		});
	};
}
function beginMcpOAuthAuthorization(store) {
	const next = { ...store };
	if (next.credentialState === "uninitialized") delete next.credentialState;
	return next;
}
/** Creates the MCP SDK OAuth provider backed by canonical shared SQLite state. */
function createMcpOAuthClientProvider(params) {
	const config = params.config ?? {};
	const storeKey = resolveMcpOAuthStoreKey(params.serverName, params.serverUrl);
	const assertOwnedInTransaction = bindMcpOAuthLeaseAssertion(params.lease);
	const updateStore = (update) => updateMcpOAuthStore(storeKey, update, assertOwnedInTransaction);
	const allowAuthorizationRedirect = params.allowAuthorizationRedirect ?? Boolean(params.onAuthorizationUrl);
	const assertAuthorizationRedirectAllowed = () => {
		if (!allowAuthorizationRedirect) throw new Error(`MCP server "${params.serverName}" requires OAuth authorization. Run openclaw mcp login ${params.serverName}.`);
	};
	return {
		get redirectUrl() {
			return resolveOAuthRedirectUrl(config, readMcpOAuthStore(storeKey));
		},
		clientMetadataUrl: normalizeOptionalString(config.clientMetadataUrl),
		get clientMetadata() {
			return buildOAuthClientMetadata(config, readMcpOAuthStore(storeKey));
		},
		state() {
			assertAuthorizationRedirectAllowed();
			return randomUUID();
		},
		clientInformation() {
			return readMcpOAuthStore(storeKey).clientInformation;
		},
		saveClientInformation(clientInformation) {
			updateStore((store) => ({
				...beginMcpOAuthAuthorization(store),
				clientInformation
			}));
		},
		tokens() {
			return params.suppressStoredTokens ? void 0 : readMcpOAuthStore(storeKey).tokens;
		},
		saveTokens(tokens) {
			updateStore((store) => {
				const next = {
					...store,
					tokens
				};
				delete next.credentialState;
				delete next.pendingAuthorizationChallenge;
				const tokenExpiresAt = resolveTokenExpiresAt(tokens);
				if (tokenExpiresAt === void 0) delete next.tokenExpiresAt;
				else next.tokenExpiresAt = tokenExpiresAt;
				return next;
			});
		},
		async redirectToAuthorization(authorizationUrl) {
			assertAuthorizationRedirectAllowed();
			updateStore((store) => ({
				...beginMcpOAuthAuthorization(store),
				lastAuthorizationUrl: authorizationUrl.toString()
			}));
			await params.onAuthorizationUrl?.(authorizationUrl);
		},
		saveCodeVerifier(codeVerifier) {
			assertAuthorizationRedirectAllowed();
			updateStore((store) => ({
				...beginMcpOAuthAuthorization(store),
				codeVerifier
			}));
		},
		codeVerifier() {
			const codeVerifier = readMcpOAuthStore(storeKey).codeVerifier;
			if (!codeVerifier) throw new Error("Missing MCP OAuth code verifier. Run the login flow again.");
			return codeVerifier;
		},
		invalidateCredentials(scope) {
			updateStore((store) => {
				const next = { ...store };
				if (scope === "all" || scope === "client") delete next.clientInformation;
				if ((scope === "all" || scope === "tokens") && params.suppressStoredTokens !== true) {
					delete next.tokens;
					delete next.tokenExpiresAt;
					next.credentialState = "cleared";
				}
				if (scope === "all" || scope === "verifier") delete next.codeVerifier;
				if (scope === "all" || scope === "discovery") delete next.discoveryState;
				return next;
			});
		},
		saveDiscoveryState(discoveryState) {
			updateStore((store) => ({
				...beginMcpOAuthAuthorization(store),
				discoveryState
			}));
		},
		discoveryState() {
			return readMcpOAuthStore(storeKey).discoveryState;
		}
	};
}
//#endregion
//#region src/agents/mcp-oauth.ts
/** MCP OAuth credential provider, flow coordinator, and login helpers. */
const LOCALHOST_REDIRECT_URL = "http://localhost:8989/oauth/callback";
const TOKEN_EXPIRY_SKEW_MS = 3e4;
const MCP_OAUTH_LEASE_MS = 6e4;
const MCP_OAUTH_LEASE_WAIT_MS = 3e4;
function isMcpOAuthRedirectRegistrationError(error) {
	return /invalid_client_metadata|redirect_uri/i.test(String(error));
}
async function withMcpOAuthLease(storeKey, run, signal) {
	return await withOpenClawStateLease({
		scope: "core:mcp-oauth",
		key: storeKey,
		database: { scope: "shared" },
		leaseMs: MCP_OAUTH_LEASE_MS,
		waitMs: MCP_OAUTH_LEASE_WAIT_MS,
		...signal ? { signal } : {}
	}, run);
}
function mcpOAuthAdditionalAuthorizationError(serverName) {
	return /* @__PURE__ */ new Error(`MCP server "${serverName}" requires additional OAuth authorization. Run openclaw mcp login ${serverName}.`);
}
function applyMcpOAuthAuthorizationChallenge(current, params) {
	const next = {
		...current,
		pendingAuthorizationChallenge: {
			...current.pendingAuthorizationChallenge,
			...params.resourceMetadataUrl ? { resourceMetadataUrl: params.resourceMetadataUrl } : {},
			...params.scope ? { scope: params.scope } : {},
			...params.requiresAuthorization ? { requiresAuthorization: true } : {}
		}
	};
	if (current.credentialState === void 0 && current.tokens === void 0 && current.clientInformation === void 0 && current.codeVerifier === void 0 && current.discoveryState === void 0 && current.lastAuthorizationUrl === void 0 && current.redirectUrl === void 0) next.credentialState = "uninitialized";
	if (params.resourceMetadataUrl && current.discoveryState?.resourceMetadataUrl !== params.resourceMetadataUrl) delete next.discoveryState;
	return next;
}
async function resolveMcpOAuthAccessToken(params) {
	const storeKey = resolveMcpOAuthStoreKey(params.serverName, params.serverUrl);
	return await withMcpOAuthLease(storeKey, async (lease) => {
		const store = readMcpOAuthStore(storeKey);
		const tokens = store.tokens;
		const rejectedCurrentToken = params.rejectedAccessToken === tokens?.access_token;
		const challengeAppliesToCurrentState = !tokens?.access_token || rejectedCurrentToken;
		if (params.authorizationChallenge === true && challengeAppliesToCurrentState) {
			const resourceMetadataUrl = params.resourceMetadataUrl?.toString();
			const scope = normalizeOptionalString(params.scope);
			if (resourceMetadataUrl || scope || params.interactiveAuthorizationRequired === true) updateMcpOAuthStore(storeKey, (current) => applyMcpOAuthAuthorizationChallenge(current, {
				resourceMetadataUrl,
				scope,
				...params.interactiveAuthorizationRequired === true ? { requiresAuthorization: true } : {}
			}), bindMcpOAuthLeaseAssertion(lease));
		}
		if (params.authorizationChallenge === true && params.interactiveAuthorizationRequired === true && challengeAppliesToCurrentState) throw mcpOAuthAdditionalAuthorizationError(params.serverName);
		if (store.pendingAuthorizationChallenge?.requiresAuthorization === true) throw mcpOAuthAdditionalAuthorizationError(params.serverName);
		if (!tokens?.access_token) {
			if (params.allowMissingToken === true) return;
			throw new Error(`MCP server "${params.serverName}" requires OAuth authorization. Run openclaw mcp login ${params.serverName}.`);
		}
		const tokenIsFresh = store.tokenExpiresAt !== void 0 && store.tokenExpiresAt > Date.now() + TOKEN_EXPIRY_SKEW_MS;
		if (!rejectedCurrentToken && (tokenIsFresh || store.tokenExpiresAt === void 0 && (params.acceptUnknownExpiry === true || !tokens.refresh_token))) return tokens.access_token;
		if (!tokens.refresh_token) throw new Error(`MCP server "${params.serverName}" has expired OAuth credentials. Run openclaw mcp login ${params.serverName}.`);
		const pendingChallenge = store.pendingAuthorizationChallenge;
		const provider = createMcpOAuthClientProvider({
			...params,
			lease
		});
		const result = await auth(provider, {
			serverUrl: params.serverUrl,
			resourceMetadataUrl: params.resourceMetadataUrl ?? (pendingChallenge?.resourceMetadataUrl ? new URL(pendingChallenge.resourceMetadataUrl) : void 0),
			scope: params.scope ?? normalizeOptionalString(pendingChallenge?.scope) ?? normalizeOptionalString(params.config?.scope),
			fetchFn: withMcpOAuthLeaseSignal(params.fetchFn, lease.signal)
		});
		lease.assertOwned();
		const refreshedTokens = await provider.tokens();
		if (result !== "AUTHORIZED" || !refreshedTokens?.access_token) throw new Error(`MCP server "${params.serverName}" could not refresh OAuth credentials. Run openclaw mcp login ${params.serverName}.`);
		return refreshedTokens.access_token;
	}, params.signal);
}
/** Persist a terminal resource rejection without overwriting newer credentials. */
async function recordMcpOAuthAuthorizationRequired(params) {
	const storeKey = resolveMcpOAuthStoreKey(params.serverName, params.serverUrl);
	return await withMcpOAuthLease(storeKey, async (lease) => {
		if (readMcpOAuthStore(storeKey).tokens?.access_token !== params.rejectedAccessToken) return false;
		let recorded = false;
		updateMcpOAuthStore(storeKey, (current) => {
			if (current.tokens?.access_token !== params.rejectedAccessToken) return current;
			recorded = true;
			return applyMcpOAuthAuthorizationChallenge(current, {
				resourceMetadataUrl: params.resourceMetadataUrl?.toString(),
				scope: normalizeOptionalString(params.scope),
				requiresAuthorization: true
			});
		}, bindMcpOAuthLeaseAssertion(lease));
		return recorded;
	}, params.signal);
}
/** Deletes one OAuth session without racing an in-flight refresh or login. */
async function clearMcpOAuthCredentials(params) {
	const storeKey = resolveMcpOAuthStoreKey(params.serverName, params.serverUrl);
	await withMcpOAuthLease(storeKey, async (lease) => {
		clearMcpOAuthStore(storeKey, bindMcpOAuthLeaseAssertion(lease));
	});
}
/** Reads stored OAuth credential presence without exposing values or creating state. */
async function readMcpOAuthCredentialsStatus(params) {
	const store = readMcpOAuthStoreReadOnly(resolveMcpOAuthStoreKey(params.serverName, params.serverUrl));
	return {
		hasTokens: Boolean(store.tokens),
		requiresAuthorization: store.pendingAuthorizationChallenge?.requiresAuthorization === true,
		hasClientInformation: Boolean(store.clientInformation),
		hasCodeVerifier: Boolean(store.codeVerifier),
		hasDiscoveryState: Boolean(store.discoveryState),
		hasLastAuthorizationUrl: Boolean(store.lastAuthorizationUrl)
	};
}
async function runMcpOAuthLoginAttempt(params, lease) {
	const result = await auth(createMcpOAuthClientProvider({
		...params,
		allowAuthorizationRedirect: true,
		suppressStoredTokens: params.forceAuthorization,
		lease
	}), {
		serverUrl: params.serverUrl,
		authorizationCode: normalizeOptionalString(params.authorizationCode),
		resourceMetadataUrl: params.resourceMetadataUrl,
		scope: normalizeOptionalString(params.scope) ?? normalizeOptionalString(params.config?.scope),
		fetchFn: withMcpOAuthLeaseSignal(params.fetchFn, lease.signal)
	});
	lease.assertOwned();
	return result === "AUTHORIZED" ? "authorized" : "redirect";
}
/** Runs both redirect-registration attempts under one OAuth session lease. */
async function runMcpOAuthLogin(params) {
	const storeKey = resolveMcpOAuthStoreKey(params.serverName, params.serverUrl);
	return await withMcpOAuthLease(storeKey, async (lease) => {
		const store = readMcpOAuthStore(storeKey);
		const pendingChallenge = store.pendingAuthorizationChallenge;
		const loginParams = {
			...params,
			config: {
				...params.config,
				redirectUrl: normalizeOptionalString(params.config?.redirectUrl) ?? store.redirectUrl
			},
			resourceMetadataUrl: pendingChallenge?.resourceMetadataUrl ? new URL(pendingChallenge.resourceMetadataUrl) : void 0,
			scope: normalizeOptionalString(pendingChallenge?.scope),
			forceAuthorization: pendingChallenge?.requiresAuthorization === true
		};
		try {
			return await runMcpOAuthLoginAttempt(loginParams, lease);
		} catch (error) {
			if (!normalizeOptionalString(params.authorizationCode) && !normalizeOptionalString(params.config?.redirectUrl) && isMcpOAuthRedirectRegistrationError(error)) {
				const result = await runMcpOAuthLoginAttempt({
					...loginParams,
					config: {
						...params.config,
						redirectUrl: LOCALHOST_REDIRECT_URL
					}
				}, lease);
				updateMcpOAuthStore(storeKey, (current) => ({
					...current,
					redirectUrl: LOCALHOST_REDIRECT_URL
				}), bindMcpOAuthLeaseAssertion(lease));
				return result;
			}
			throw error;
		}
	});
}
//#endregion
//#region src/agents/mcp-http.ts
/**
* HTTP MCP launch config normalization.
*
* MCP server setup uses this to validate SSE/streamable HTTP server records,
* sanitize headers, and redact sensitive URLs in diagnostics.
*/
/** Normalizes an HTTP MCP server config record into a launchable transport config. */
function resolveHttpMcpServerLaunchConfig(raw, options) {
	if (!isMcpConfigRecord(raw)) return {
		ok: false,
		reason: "server config must be an object"
	};
	if (typeof raw.url !== "string" || raw.url.trim().length === 0) return {
		ok: false,
		reason: "its url is missing"
	};
	const url = raw.url.trim();
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return {
			ok: false,
			reason: `its url is not a valid URL: ${redactSensitiveUrlLikeString(url)}`
		};
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return {
		ok: false,
		reason: `only http and https URLs are supported, got ${parsed.protocol}`
	};
	let headers;
	if (raw.headers !== void 0 && raw.headers !== null) if (!isMcpConfigRecord(raw.headers)) options?.onMalformedHeaders?.(raw.headers);
	else headers = toMcpStringRecord(raw.headers, { onDroppedEntry: options?.onDroppedHeader });
	return {
		ok: true,
		config: {
			transportType: options?.transportType ?? "sse",
			url,
			headers
		}
	};
}
/** Describes an HTTP MCP server launch config without leaking URL credentials. */
function describeHttpMcpServerLaunchConfig(config) {
	return redactSensitiveUrl(config.url);
}
//#endregion
//#region src/agents/mcp-transport-config.ts
/**
* Resolves MCP transport command, environment, and timeout configuration.
*/
const DEFAULT_CONNECTION_TIMEOUT_MS = 3e4;
const DEFAULT_REQUEST_TIMEOUT_MS = 6e4;
function getPositiveNumber(rawServer, keys) {
	if (!rawServer || typeof rawServer !== "object") return;
	const record = rawServer;
	for (const key of keys) {
		const value = record[key];
		if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
	}
}
function getConnectionTimeoutMs(rawServer) {
	const milliseconds = getPositiveNumber(rawServer, ["connectionTimeoutMs"]);
	if (milliseconds) return clampPositiveTimerTimeoutMs(milliseconds) ?? DEFAULT_CONNECTION_TIMEOUT_MS;
	return DEFAULT_CONNECTION_TIMEOUT_MS;
}
function resolveMcpRequestTimeoutMs(rawServer, fallbackMs = DEFAULT_REQUEST_TIMEOUT_MS) {
	const milliseconds = getPositiveNumber(rawServer, ["requestTimeoutMs"]);
	if (milliseconds) return clampPositiveTimerTimeoutMs(milliseconds) ?? DEFAULT_REQUEST_TIMEOUT_MS;
	return resolvePositiveTimerTimeoutMs(fallbackMs, DEFAULT_REQUEST_TIMEOUT_MS);
}
function getBooleanField(rawServer, keys) {
	if (!rawServer || typeof rawServer !== "object") return;
	const record = rawServer;
	for (const key of keys) {
		const value = record[key];
		if (typeof value === "boolean") return value;
	}
}
function getStringField(rawServer, keys) {
	if (!rawServer || typeof rawServer !== "object") return;
	return readTrimmedStringAlias(rawServer, keys);
}
function getRequestedTransport(rawServer) {
	if (!rawServer || typeof rawServer !== "object" || typeof rawServer.transport !== "string") return "";
	return normalizeLowercaseStringOrEmpty(rawServer.transport);
}
function getRequestedTransportAlias(rawServer) {
	if (!rawServer || typeof rawServer !== "object" || typeof rawServer.type !== "string") return "";
	return resolveOpenClawMcpTransportAlias(rawServer.type) ?? "";
}
function resolveHttpTransportConfig(serverName, rawServer, transportType) {
	const launch = resolveHttpMcpServerLaunchConfig(rawServer, {
		transportType,
		onDroppedHeader: (key) => {
			logWarn(`bundle-mcp: server "${serverName}": header "${key}" has an unsupported value type and was ignored.`);
		},
		onMalformedHeaders: () => {
			logWarn(`bundle-mcp: server "${serverName}": "headers" must be a JSON object; the value was ignored.`);
		}
	});
	if (!launch.ok) return null;
	return {
		kind: "http",
		transportType: launch.config.transportType,
		url: launch.config.url,
		headers: launch.config.headers,
		...rawServer && typeof rawServer === "object" && rawServer.auth === "oauth" ? { auth: "oauth" } : {},
		...rawServer && typeof rawServer === "object" && rawServer.oauth && typeof rawServer.oauth === "object" && !Array.isArray(rawServer.oauth) ? { oauth: rawServer.oauth } : {},
		...getBooleanField(rawServer, ["sslVerify", "ssl_verify"]) !== void 0 ? { sslVerify: getBooleanField(rawServer, ["sslVerify", "ssl_verify"]) } : {},
		...getStringField(rawServer, ["clientCert", "client_cert"]) ? { clientCert: getStringField(rawServer, ["clientCert", "client_cert"]) } : {},
		...getStringField(rawServer, ["clientKey", "client_key"]) ? { clientKey: getStringField(rawServer, ["clientKey", "client_key"]) } : {},
		description: describeHttpMcpServerLaunchConfig(launch.config),
		connectionTimeoutMs: getConnectionTimeoutMs(rawServer),
		requestTimeoutMs: resolveMcpRequestTimeoutMs(rawServer),
		supportsParallelToolCalls: getBooleanField(rawServer, ["supportsParallelToolCalls", "supports_parallel_tool_calls"]) ?? false
	};
}
/** Resolve one MCP server's launch transport config, or null when unsupported. */
function resolveMcpTransportConfig(serverName, rawServer) {
	const logServerName = sanitizeForLog(serverName);
	const requestedTransport = getRequestedTransport(rawServer);
	const requestedTransportAlias = requestedTransport ? "" : getRequestedTransportAlias(rawServer);
	const effectiveTransport = requestedTransport || requestedTransportAlias;
	const stdioLaunch = resolveStdioMcpServerLaunchConfig(rawServer, { onDroppedEnv: (key) => {
		logWarn(`bundle-mcp: server "${logServerName}": env "${sanitizeForLog(key)}" is blocked for stdio startup safety and was ignored.`);
	} });
	if (stdioLaunch.ok) return {
		kind: "stdio",
		transportType: "stdio",
		command: stdioLaunch.config.command,
		args: stdioLaunch.config.args,
		env: stdioLaunch.config.env,
		cwd: stdioLaunch.config.cwd,
		description: describeStdioMcpServerLaunchConfig(stdioLaunch.config),
		connectionTimeoutMs: getConnectionTimeoutMs(rawServer),
		requestTimeoutMs: resolveMcpRequestTimeoutMs(rawServer),
		supportsParallelToolCalls: getBooleanField(rawServer, ["supportsParallelToolCalls", "supports_parallel_tool_calls"]) ?? false
	};
	if (effectiveTransport && effectiveTransport !== "sse" && effectiveTransport !== "streamable-http") {
		logWarn(`bundle-mcp: skipped server "${logServerName}" because transport "${sanitizeForLog(effectiveTransport)}" is not supported.`);
		return null;
	}
	if (effectiveTransport === "streamable-http") {
		const httpTransport = resolveHttpTransportConfig(serverName, rawServer, "streamable-http");
		if (httpTransport) return httpTransport;
	}
	const sseTransport = resolveHttpTransportConfig(serverName, rawServer, "sse");
	if (sseTransport) return sseTransport;
	const httpLaunch = resolveHttpMcpServerLaunchConfig(rawServer);
	const httpReason = httpLaunch.ok ? "not an HTTP MCP server" : httpLaunch.reason;
	logWarn(`bundle-mcp: skipped server "${logServerName}" because ${stdioLaunch.reason} and ${httpReason}.`);
	return null;
}
//#endregion
//#region src/agents/mcp-auth-profile.ts
/**
* Auth-profile backed bearer injection for remote MCP servers.
*/
function isRecord(value) {
	return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function normalizeStringHeaders(value) {
	if (!isRecord(value)) return;
	const entries = Object.entries(value).filter((entry) => typeof entry[1] === "string");
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
/** Returns the refresh-capable auth profile selected for one MCP server. */
function resolveMcpAuthProfileId(rawServer) {
	if (!isRecord(rawServer) || rawServer.auth !== "oauth" || !isRecord(rawServer.oauth)) return;
	const authProfileId = rawServer.oauth.authProfileId;
	return typeof authProfileId === "string" && authProfileId.trim().length > 0 ? authProfileId.trim() : void 0;
}
/** Returns whether a server needs an OpenClaw-managed bearer projected externally. */
function requiresMcpBearerProjection(rawServer) {
	if (!isRecord(rawServer) || rawServer.auth !== "oauth") return false;
	return Boolean(resolveMcpAuthProfileId(rawServer) || typeof rawServer.url === "string");
}
async function resolveMcpAuthProfileBearerToken(params) {
	const store = loadAuthProfileStoreForSecretsRuntime(params.agentDir, {
		config: params.cfg,
		externalCliProfileIds: [params.profileId]
	});
	const credential = store.profiles[params.profileId];
	if (!credential) throw new Error(`MCP server "${params.serverName}" references auth profile "${params.profileId}", but that profile was not found.`);
	if (credential.type !== "oauth") throw new Error(`MCP server "${params.serverName}" references auth profile "${params.profileId}", but ${credential.type} profiles are not refreshable. Use a refresh-capable OAuth profile.`);
	const resolved = await resolveApiKeyForProfile({
		cfg: params.cfg,
		store,
		profileId: params.profileId,
		agentDir: params.agentDir
	});
	if (!resolved || resolved.profileType !== "oauth" || !resolved.apiKey) throw new Error(`MCP server "${params.serverName}" could not resolve refreshable OAuth auth profile "${params.profileId}". Re-authenticate the profile and retry.`);
	if (!resolved.credential || resolved.credential.type !== "oauth" || typeof resolved.credential.access !== "string" || resolved.credential.access.trim().length === 0) throw new Error(`MCP server "${params.serverName}" resolved OAuth auth profile "${params.profileId}", but no raw access token was available for bearer projection.`);
	return resolved.credential.access;
}
async function resolveMcpBearerToken(params) {
	const authProfileId = resolveMcpAuthProfileId(params.server);
	if (authProfileId) return await resolveMcpAuthProfileBearerToken({
		serverName: params.serverName,
		profileId: authProfileId,
		cfg: params.cfg,
		agentDir: params.agentDir
	});
	if (params.server.auth !== "oauth") return;
	const resolved = resolveMcpTransportConfig(params.serverName, params.server);
	if (!resolved || resolved.kind !== "http") return;
	const fetchFn = withSameOriginMcpHttpHeaders({
		fetchFn: buildMcpHttpFetch({
			sslVerify: resolved.sslVerify,
			clientCert: resolved.clientCert,
			clientKey: resolved.clientKey,
			resourceUrl: resolved.url,
			timeoutMs: resolved.requestTimeoutMs
		}),
		headers: withoutMcpAuthorizationHeader(resolved.headers),
		resourceUrl: resolved.url
	});
	return await resolveMcpOAuthAccessToken({
		serverName: params.serverName,
		serverUrl: resolved.url,
		config: resolved.oauth,
		fetchFn
	});
}
/** Wraps HTTP MCP fetch with same-origin, refreshed bearer injection. */
function withMcpAuthProfileBearer(params) {
	const resourceOrigin = new URL(params.resourceUrl).origin;
	const configuredHeaders = withoutMcpAuthorizationHeader(params.headers);
	return async (url, init) => {
		if (new URL(url).origin !== resourceOrigin) return params.fetchFn(url, init);
		const headers = new Headers(configuredHeaders);
		for (const [key, value] of new Headers(init?.headers)) if (key.toLowerCase() !== "authorization") headers.set(key, value);
		const token = await resolveMcpAuthProfileBearerToken({
			serverName: params.serverName,
			profileId: params.authProfileId,
			cfg: params.cfg,
			agentDir: params.agentDir
		});
		headers.set("authorization", `Bearer ${token}`);
		return params.fetchFn(url, {
			...init,
			headers
		});
	};
}
function buildTokenEnvVarName(serverName) {
	return `OPENCLAW_MCP_AUTH_${crypto.createHash("sha256").update(serverName).digest("hex").slice(0, 12).toUpperCase()}_TOKEN`;
}
function stripOpenClawOnlyOAuthConfig(server) {
	const next = { ...server };
	delete next.auth;
	delete next.oauth;
	return next;
}
/** Resolves OAuth-backed MCP servers into bearer headers for external runtimes. */
async function resolveMcpBearerBundleConfig(params) {
	let nextServers;
	let nextEnv = params.env;
	const tokenProjection = params.tokenProjection ?? "env";
	for (const [serverName, server] of Object.entries(params.config.mcpServers)) {
		let token;
		try {
			token = await resolveMcpBearerToken({
				serverName,
				server,
				cfg: params.cfg,
				agentDir: params.agentDir
			});
		} catch (error) {
			if (!params.omitUnavailableOAuthServers || !requiresMcpBearerProjection(server)) throw error;
			nextServers ??= { ...params.config.mcpServers };
			delete nextServers[serverName];
			params.onServerUnavailable?.(serverName, error);
			continue;
		}
		if (!token) continue;
		let authorization;
		if (tokenProjection === "literal") authorization = `Bearer ${token}`;
		else {
			const envVar = buildTokenEnvVarName(serverName);
			if (!nextEnv || nextEnv === params.env) nextEnv = { ...params.env };
			nextEnv[envVar] = token;
			authorization = `Bearer \${${envVar}}`;
		}
		const headers = withoutMcpAuthorizationHeader(normalizeStringHeaders(server.headers));
		nextServers ??= { ...params.config.mcpServers };
		nextServers[serverName] = stripOpenClawOnlyOAuthConfig({
			...server,
			headers: {
				...headers,
				Authorization: authorization
			}
		});
	}
	return {
		config: nextServers ? { mcpServers: nextServers } : params.config,
		env: nextEnv
	};
}
//#endregion
export { resolveMcpRequestTimeoutMs as a, readMcpOAuthCredentialsStatus as c, runMcpOAuthLogin as d, buildMcpHttpFetch as f, withMcpAuthProfileBearer as i, recordMcpOAuthAuthorizationRequired as l, withoutMcpAuthorizationHeader as m, resolveMcpAuthProfileId as n, resolveMcpTransportConfig as o, withSameOriginMcpHttpHeaders as p, resolveMcpBearerBundleConfig as r, clearMcpOAuthCredentials as s, requiresMcpBearerProjection as t, resolveMcpOAuthAccessToken as u };
