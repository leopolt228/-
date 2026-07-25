import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { a as logWarn } from "./logger-DT9z6GgH.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-BHgpSCM6.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-CkPr90q0.js";
import { i as sanitizeServerName, t as assignSafeServerNames } from "./agent-bundle-mcp-names-DTVZURdO.js";
import { _ as loadSessionMcpConfig, b as mergeMcpToolCatalogs, d as createSessionMcpRuntimeManager, f as setDefaultCreateSessionMcpRuntime, n as disposeAllSessionMcpRuntimes, o as getSessionMcpRuntimeManagerForTesting, p as resolveSessionMcpRuntimeIdleTtlMs } from "./agent-bundle-mcp-manager-api-ChkvrkDs.js";
import { a as matchesMcpToolFilterPattern, i as createMcpJsonSchemaValidator, n as OpenClawStdioClientTransport, r as sanitizeMcpMetadataText, t as resolveMcpTransport } from "./mcp-transport-CizFap71.js";
import { t as isMcpConfigRecord } from "./mcp-config-shared-DHNeNaPb.js";
import { t as applyMcpConnectionOverride } from "./mcp-connection-resolver-E_dHdEMQ.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { ErrorCode } from "@modelcontextprotocol/sdk/types.js";
//#region src/agents/agent-bundle-mcp-runtime.ts
/** Session-scoped MCP runtime catalog loader and transport lifecycle. */
const MCP_APPS_CLIENT_EXTENSION = "io.modelcontextprotocol/ui";
const MCP_APP_RESOURCE_MIME_TYPE = "text/html;profile=mcp-app";
const BUNDLE_MCP_FAILURE_THRESHOLD = 3;
const BUNDLE_MCP_FAILURE_COOLDOWN_MS = 6e4;
const BUNDLE_MCP_CATALOG_LIST_TIMEOUT_MS = 1500;
const BUNDLE_MCP_DISPOSE_TIMEOUT_MS = 5e3;
const BUNDLE_MCP_CATALOG_CONNECT_CONCURRENCY = 6;
let bundleMcpCatalogListTimeoutMs;
const BUNDLE_MCP_TEST_STATE_KEY = Symbol.for("openclaw.bundleMcpTestState");
function getBundleMcpTestState() {
	const globalStore = globalThis;
	const existing = globalStore[BUNDLE_MCP_TEST_STATE_KEY];
	if (existing) return existing;
	const state = {};
	globalStore[BUNDLE_MCP_TEST_STATE_KEY] = state;
	return state;
}
async function connectWithTimeout(serverName, client, transport, timeoutMs) {
	const abortController = new AbortController();
	let timeout;
	let deadlineExpired = false;
	try {
		await Promise.race([client.connect(transport, {
			signal: abortController.signal,
			timeout: timeoutMs,
			maxTotalTimeout: timeoutMs
		}), new Promise((_, reject) => {
			timeout = setTimeout(() => {
				deadlineExpired = true;
				abortController.abort();
				reject(/* @__PURE__ */ new Error("MCP connect deadline expired"));
			}, timeoutMs);
		})]);
	} catch (error) {
		if (deadlineExpired || isMcpConfigRecord(error) && error.code === ErrorCode.RequestTimeout) {
			if (transport instanceof OpenClawStdioClientTransport) await transport.forceClose();
			await settleWithin(client.close(), Math.min(timeoutMs, 1e3));
			throw new Error(`MCP server "${serverName}" timed out: did not complete initialize within ${timeoutMs / 1e3}s`, { cause: error });
		}
		throw error;
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
function redactErrorUrls(error) {
	return redactSensitiveUrlLikeString(String(error));
}
async function listAllTools(client, timeoutMs) {
	const tools = [];
	let cursor;
	do {
		const params = cursor ? { cursor } : void 0;
		const page = await client.listTools(params, { timeout: timeoutMs });
		tools.push(...page.tools);
		cursor = page.nextCursor;
	} while (cursor);
	return tools;
}
function isMcpMethodNotFoundError(error) {
	if (isMcpConfigRecord(error) && error.code === ErrorCode.MethodNotFound) return true;
	const message = String(error);
	return message.includes("-32601") || /method not found/i.test(message);
}
async function listAllToolsBestEffort(params) {
	try {
		return await listAllTools(params.client, params.timeoutMs);
	} catch (error) {
		if (params.suppressUnsupported && isMcpMethodNotFoundError(error)) return [];
		throw error;
	}
}
function hasConfiguredMcpRequestTimeout(rawServer) {
	if (!rawServer || typeof rawServer !== "object") return false;
	const record = rawServer;
	for (const key of ["requestTimeoutMs", "timeout"]) {
		const value = record[key];
		if (typeof value === "number" && Number.isFinite(value) && value > 0) return true;
	}
	return false;
}
function getCatalogListTimeoutMs(rawServer, requestTimeoutMs) {
	if (bundleMcpCatalogListTimeoutMs !== void 0) return bundleMcpCatalogListTimeoutMs;
	return hasConfiguredMcpRequestTimeout(rawServer) ? requestTimeoutMs : BUNDLE_MCP_CATALOG_LIST_TIMEOUT_MS;
}
function setBundleMcpCatalogListTimeoutMsForTest(timeoutMs) {
	bundleMcpCatalogListTimeoutMs = typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? Math.floor(timeoutMs) : void 0;
}
function setBundleMcpDisposeTimeoutMsForTest(timeoutMs) {
	getBundleMcpTestState().disposeTimeoutMs = typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? Math.floor(timeoutMs) : void 0;
}
function buildMcpClientCapabilities(mcpAppsEnabled) {
	return mcpAppsEnabled ? { extensions: { [MCP_APPS_CLIENT_EXTENSION]: { mimeTypes: [MCP_APP_RESOURCE_MIME_TYPE] } } } : {};
}
function buildMcpClientOptions(mcpAppsEnabled) {
	return { capabilities: buildMcpClientCapabilities(mcpAppsEnabled) };
}
async function listAllResources(client, timeoutMs) {
	const resources = [];
	let cursor;
	do {
		const params = cursor ? { cursor } : void 0;
		const page = await client.listResources(params, { timeout: timeoutMs });
		resources.push(...page.resources);
		cursor = page.nextCursor;
	} while (cursor);
	return resources;
}
async function listAllPrompts(client, timeoutMs) {
	const prompts = [];
	let cursor;
	do {
		const params = cursor ? { cursor } : void 0;
		const page = await client.listPrompts(params, { timeout: timeoutMs });
		prompts.push(...page.prompts);
		cursor = page.nextCursor;
	} while (cursor);
	return prompts;
}
function normalizeStringList(value) {
	if (!Array.isArray(value)) return;
	const entries = value.filter((entry) => typeof entry === "string");
	return entries.length > 0 ? entries : void 0;
}
function normalizeToolUiVisibility(value) {
	if (!Array.isArray(value)) return;
	const normalized = value.filter((entry) => entry === "app" || entry === "model");
	return [...new Set(normalized)].toSorted();
}
function getMcpToolSelection(rawServer) {
	if (!isMcpConfigRecord(rawServer) || !isMcpConfigRecord(rawServer.toolFilter)) return {};
	return {
		include: normalizeStringList(rawServer.toolFilter.include),
		exclude: normalizeStringList(rawServer.toolFilter.exclude)
	};
}
function shouldExposeMcpTool(selection, toolName) {
	const include = selection.include ?? [];
	const exclude = selection.exclude ?? [];
	if (include.length > 0 && !include.some((pattern) => matchesMcpToolFilterPattern(pattern, toolName))) return false;
	return !exclude.some((pattern) => matchesMcpToolFilterPattern(pattern, toolName));
}
function summarizeServerCapabilities(capabilities) {
	return {
		resources: capabilities?.resources ? { listChanged: capabilities.resources.listChanged === true } : void 0,
		prompts: capabilities?.prompts ? { listChanged: capabilities.prompts.listChanged === true } : void 0,
		tools: capabilities?.tools ? { listChanged: capabilities.tools.listChanged === true } : void 0
	};
}
async function settleWithin(promise, timeoutMs) {
	let timer;
	return await Promise.race([promise.then(() => true, () => true), new Promise((resolve) => {
		timer = setTimeout(() => {
			resolve();
		}, timeoutMs);
		timer.unref?.();
	}).then(() => false)]).finally(() => {
		if (timer) clearTimeout(timer);
	});
}
async function disposeSession(session) {
	session.detachStderr?.();
	const timeoutMs = getBundleMcpTestState().disposeTimeoutMs ?? BUNDLE_MCP_DISPOSE_TIMEOUT_MS;
	if (!await settleWithin((async () => {
		if (session.transportType === "streamable-http") await session.transport.terminateSession().catch(() => {});
		await session.transport.close().catch(() => {});
		await session.client.close().catch(() => {});
	})(), timeoutMs)) {
		const transportClose = session.transport instanceof OpenClawStdioClientTransport ? session.transport.forceClose() : session.transport.close();
		await settleWithin(Promise.allSettled([transportClose, session.client.close()]), timeoutMs);
	}
}
function createDisposedError(sessionId) {
	return /* @__PURE__ */ new Error(`bundle-mcp runtime disposed for session ${sessionId}`);
}
function createSessionMcpRuntime(params) {
	const { loaded, fingerprint: computedFingerprint } = loadSessionMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		logDiagnostics: true,
		manifestRegistry: params.manifestRegistry,
		includeServerNames: params.includeServerNames,
		excludeServerNames: params.excludeServerNames,
		redactConnectionServerNames: params.redactConnectionServerNames,
		safeServerNamesByServer: params.safeServerNamesByServer
	});
	const configFingerprint = params.configFingerprint ?? computedFingerprint;
	const mcpAppsEnabled = params.cfg?.mcp?.apps?.enabled === true;
	const createdAt = Date.now();
	let lastUsedAt = createdAt;
	let activeLeases = 0;
	let disposed = false;
	let catalog = null;
	let catalogInFlight;
	let catalogInvalidationGeneration = 0;
	const sessions = /* @__PURE__ */ new Map();
	const serverBackoff = /* @__PURE__ */ new Map();
	const recordServerToolFailure = (serverName, nowMs) => {
		const failures = (serverBackoff.get(serverName)?.failures ?? 0) + 1;
		const nextBackoff = { failures };
		if (failures >= BUNDLE_MCP_FAILURE_THRESHOLD) nextBackoff.retryAfterMs = nowMs + BUNDLE_MCP_FAILURE_COOLDOWN_MS;
		serverBackoff.set(serverName, nextBackoff);
	};
	const runGuardedServerRequest = async (serverName, request, options) => {
		const tracksFailureBackoff = options?.failureBackoff !== "ignore";
		const nowMs = Date.now();
		const backoff = serverBackoff.get(serverName);
		if (tracksFailureBackoff && backoff?.retryAfterMs && nowMs < backoff.retryAfterMs) throw new Error(`bundle-mcp server "${serverName}" is paused after repeated tool failures; retry after ${new Date(backoff.retryAfterMs).toISOString()}`);
		try {
			const result = await request();
			if (tracksFailureBackoff) serverBackoff.delete(serverName);
			return result;
		} catch (error) {
			if (tracksFailureBackoff) recordServerToolFailure(serverName, nowMs);
			throw error;
		}
	};
	const failIfDisposed = () => {
		if (disposed) throw createDisposedError(params.sessionId);
	};
	const requireConnectedSession = (serverName) => {
		const session = sessions.get(serverName);
		if (!session || !session.connected) throw new Error(session?.disconnectReason ? `bundle-mcp server "${serverName}" is disconnected: ${session.disconnectReason}` : `bundle-mcp server "${serverName}" is not connected`);
		return session;
	};
	const ensureSessionConnected = async (session, connectionTimeoutMs) => {
		if (session.retiring) throw new Error(`bundle-mcp server "${session.serverName}" is retiring`);
		if (session.connected) return;
		session.connectPromise ??= connectWithTimeout(session.serverName, session.client, session.transport, connectionTimeoutMs).then(() => {
			session.connected = true;
		}).finally(() => {
			session.connectPromise = void 0;
		});
		await session.connectPromise;
	};
	const retireSessionIfCurrent = async (serverName, session) => {
		if (sessions.get(serverName) !== session) return false;
		session.retiring = true;
		sessions.delete(serverName);
		await disposeSession(session);
		return true;
	};
	const getCatalog = async () => {
		failIfDisposed();
		if (catalog) return catalog;
		if (catalogInFlight) return catalogInFlight;
		const catalogGeneration = catalogInvalidationGeneration;
		const inFlight = (async () => {
			if (Object.keys(loaded.mcpServers).length === 0) return {
				version: 1,
				generatedAt: Date.now(),
				servers: {},
				tools: []
			};
			const servers = {};
			const tools = [];
			const diagnostics = [];
			const safeServerNamesByServer = params.safeServerNamesByServer ?? assignSafeServerNames(Object.keys(loaded.mcpServers));
			const usedServerNames = new Set([...safeServerNamesByServer.values()].map((name) => normalizeLowercaseStringOrEmpty(name)));
			try {
				const preparedEntries = [];
				for (const [serverName, rawServer] of Object.entries(loaded.mcpServers)) {
					failIfDisposed();
					const override = params.connectionOverrides?.get(serverName);
					const resolved = resolveMcpTransport(serverName, override ? applyMcpConnectionOverride(rawServer, override) : rawServer, {
						cfg: params.cfg,
						agentDir: params.agentDir
					});
					if (!resolved) continue;
					const safeServerName = safeServerNamesByServer.get(serverName) ?? sanitizeServerName(serverName, usedServerNames);
					if (safeServerName !== serverName) logWarn(`bundle-mcp: server key "${serverName}" registered as "${safeServerName}" for provider-safe tool names.`);
					const launchDescription = override ? `${serverName}: requester-scoped connection` : resolved.description;
					preparedEntries.push({
						serverName,
						rawServer,
						resolved,
						safeServerName,
						launchDescription
					});
				}
				const { results, firstError, hasError } = await runTasksWithConcurrency({
					tasks: preparedEntries.map(({ serverName, rawServer, resolved, safeServerName, launchDescription }) => async () => {
						failIfDisposed();
						let session = sessions.get(serverName);
						while (session && !session.retiring && !session.connected && !session.connectPromise) {
							await retireSessionIfCurrent(serverName, session);
							session = sessions.get(serverName);
						}
						if (session?.retiring) session = void 0;
						const reusedSession = Boolean(session);
						if (!session) {
							const client = new Client({
								name: "openclaw-bundle-mcp",
								version: "0.0.0"
							}, {
								...buildMcpClientOptions(mcpAppsEnabled),
								jsonSchemaValidator: createMcpJsonSchemaValidator(),
								listChanged: { tools: {
									autoRefresh: false,
									debounceMs: 0,
									onChanged: (error) => {
										if (error) logWarn(`bundle-mcp: failed to refresh changed tool list for server "${serverName}": ${redactErrorUrls(error)}`);
										catalogInvalidationGeneration += 1;
										catalog = null;
										catalogInFlight = void 0;
									}
								} }
							});
							const createdSession = {
								serverName,
								client,
								transport: resolved.transport,
								transportType: resolved.transportType,
								requestTimeoutMs: resolved.requestTimeoutMs,
								supportsParallelToolCalls: resolved.supportsParallelToolCalls,
								connected: false,
								retiring: false,
								catalogUseCount: 0,
								sharedAcrossCatalogGenerations: false,
								detachStderr: resolved.detachStderr
							};
							client.onclose = () => {
								createdSession.connected = false;
								createdSession.disconnectReason = "mcp transport closed";
							};
							session = createdSession;
							sessions.set(serverName, session);
						}
						if (session.catalogUseCount === 0) session.sharedAcrossCatalogGenerations = false;
						if (reusedSession && session.catalogUseCount > 0) session.sharedAcrossCatalogGenerations = true;
						session.catalogUseCount += 1;
						try {
							failIfDisposed();
							await ensureSessionConnected(session, resolved.connectionTimeoutMs);
							failIfDisposed();
							const capabilities = summarizeServerCapabilities(session.client.getServerCapabilities());
							const listedTools = await listAllToolsBestEffort({
								client: session.client,
								timeoutMs: getCatalogListTimeoutMs(rawServer, resolved.requestTimeoutMs),
								suppressUnsupported: Boolean(!capabilities.tools && (capabilities.resources || capabilities.prompts))
							});
							failIfDisposed();
							const selection = getMcpToolSelection(rawServer);
							const exposedTools = listedTools.filter((tool) => shouldExposeMcpTool(selection, tool.name.trim()));
							const serverEntry = {
								serverName,
								safeServerName,
								launchSummary: launchDescription,
								toolCount: exposedTools.length,
								requestTimeoutMs: resolved.requestTimeoutMs,
								supportsParallelToolCalls: resolved.supportsParallelToolCalls,
								...capabilities.resources ? { resources: capabilities.resources } : {},
								...capabilities.prompts ? { prompts: capabilities.prompts } : {},
								...capabilities.tools ? { tools: {
									...capabilities.tools,
									...exposedTools.length !== listedTools.length ? { filteredCount: listedTools.length - exposedTools.length } : {}
								} } : {},
								...selection.include || selection.exclude ? { toolFilter: {
									...selection.include ? { include: [...selection.include] } : {},
									...selection.exclude ? { exclude: [...selection.exclude] } : {}
								} } : {}
							};
							const toolEntries = [];
							for (const tool of exposedTools) {
								const toolName = tool.name.trim();
								if (!toolName) continue;
								const { _meta: metadata } = tool;
								const uiMeta = metadata?.ui && typeof metadata.ui === "object" && !Array.isArray(metadata.ui) ? metadata.ui : void 0;
								const rawResourceUri = uiMeta?.resourceUri ?? metadata?.["ui/resourceUri"];
								const uiResourceUri = typeof rawResourceUri === "string" && rawResourceUri.startsWith("ui://") ? rawResourceUri : void 0;
								const uiVisibility = normalizeToolUiVisibility(uiMeta?.visibility);
								toolEntries.push({
									serverName,
									safeServerName,
									toolName,
									title: tool.title,
									description: sanitizeMcpMetadataText(tool.description),
									inputSchema: tool.inputSchema,
									fallbackDescription: `Provided by bundle MCP server "${serverName}" (${launchDescription}).`,
									...uiResourceUri ? { uiResourceUri } : {},
									...uiVisibility ? { uiVisibility } : {}
								});
							}
							return {
								serverName,
								serverEntry,
								toolEntries,
								diagnostics: []
							};
						} catch (error) {
							const message = redactErrorUrls(error);
							if (!disposed) logWarn(`bundle-mcp: failed to ${reusedSession ? "refresh" : "start"} server "${serverName}" (${launchDescription}): ${message}`);
							const diags = [{
								serverName,
								safeServerName,
								launchSummary: launchDescription,
								message
							}];
							const sharedWithNewerGeneration = session.sharedAcrossCatalogGenerations || session.catalogUseCount > 1;
							if (!session.connected) await retireSessionIfCurrent(serverName, session);
							else if (!reusedSession && !sharedWithNewerGeneration) await retireSessionIfCurrent(serverName, session);
							failIfDisposed();
							return {
								serverName,
								serverEntry: null,
								toolEntries: [],
								diagnostics: diags
							};
						} finally {
							session.catalogUseCount -= 1;
							if (session.catalogUseCount === 0) session.sharedAcrossCatalogGenerations = false;
						}
					}),
					limit: BUNDLE_MCP_CATALOG_CONNECT_CONCURRENCY,
					errorMode: "continue"
				});
				if (hasError) throw firstError;
				for (const result of results) {
					if (!result) continue;
					const { serverEntry, toolEntries, diagnostics: serverDiags } = result;
					if (serverEntry) servers[result.serverName] = serverEntry;
					tools.push(...toolEntries);
					diagnostics.push(...serverDiags);
				}
				failIfDisposed();
				return {
					version: 1,
					generatedAt: Date.now(),
					servers,
					tools,
					...diagnostics.length > 0 ? { diagnostics } : {}
				};
			} catch (error) {
				await Promise.allSettled(Array.from(sessions.values(), (session) => disposeSession(session)));
				sessions.clear();
				throw error;
			}
		})();
		catalogInFlight = inFlight;
		try {
			const nextCatalog = await inFlight;
			failIfDisposed();
			if (catalogInvalidationGeneration === catalogGeneration) catalog = nextCatalog;
			return nextCatalog;
		} finally {
			if (catalogInFlight === inFlight) catalogInFlight = void 0;
		}
	};
	return {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		agentDir: params.agentDir,
		configFingerprint,
		...params.requesterScope ? { requesterScope: params.requesterScope } : {},
		isRequesterScopedServer: () => params.requesterScope !== void 0,
		mcpAppsEnabled,
		createdAt,
		get lastUsedAt() {
			return lastUsedAt;
		},
		get activeLeases() {
			return activeLeases;
		},
		acquireLease() {
			activeLeases += 1;
			let released = false;
			return () => {
				if (released) return;
				released = true;
				activeLeases = Math.max(0, activeLeases - 1);
			};
		},
		getCatalog,
		/** Synchronous catalog snapshot only; must not connect transports or issue tools/list. */
		peekCatalog() {
			return catalog;
		},
		markUsed() {
			lastUsedAt = Date.now();
		},
		async callTool(serverName, toolName, input) {
			failIfDisposed();
			await getCatalog();
			const session = requireConnectedSession(serverName);
			return await runGuardedServerRequest(serverName, async () => await session.client.callTool({
				name: toolName,
				arguments: isMcpConfigRecord(input) ? input : {}
			}, void 0, { timeout: session.requestTimeoutMs }));
		},
		async listTools(serverName, requestParams) {
			failIfDisposed();
			await getCatalog();
			const session = requireConnectedSession(serverName);
			return await runGuardedServerRequest(serverName, async () => session.client.listTools(requestParams, { timeout: session.requestTimeoutMs }));
		},
		async listResources(serverName, options) {
			failIfDisposed();
			await getCatalog();
			const session = requireConnectedSession(serverName);
			return await runGuardedServerRequest(serverName, async () => listAllResources(session.client, session.requestTimeoutMs), options);
		},
		async readResource(serverName, uri, options) {
			failIfDisposed();
			await getCatalog();
			const session = requireConnectedSession(serverName);
			return await runGuardedServerRequest(serverName, async () => await session.client.readResource({ uri }, { timeout: session.requestTimeoutMs }), options);
		},
		async listResourceTemplates(serverName, requestParams) {
			failIfDisposed();
			await getCatalog();
			const session = requireConnectedSession(serverName);
			return await runGuardedServerRequest(serverName, async () => session.client.listResourceTemplates(requestParams, { timeout: session.requestTimeoutMs }));
		},
		async listPrompts(serverName) {
			failIfDisposed();
			await getCatalog();
			const session = requireConnectedSession(serverName);
			return await runGuardedServerRequest(serverName, async () => listAllPrompts(session.client, session.requestTimeoutMs));
		},
		async getPrompt(serverName, name, args) {
			failIfDisposed();
			await getCatalog();
			const session = requireConnectedSession(serverName);
			return await runGuardedServerRequest(serverName, async () => await session.client.getPrompt({
				name,
				...args ? { arguments: args } : {}
			}, { timeout: session.requestTimeoutMs }));
		},
		async dispose() {
			if (disposed) return;
			disposed = true;
			catalog = null;
			catalogInFlight = void 0;
			const sessionsToClose = Array.from(sessions.values());
			sessions.clear();
			await Promise.allSettled(sessionsToClose.map((session) => disposeSession(session)));
		}
	};
}
setDefaultCreateSessionMcpRuntime(createSessionMcpRuntime);
const testing = {
	buildMcpClientCapabilities,
	createSessionMcpRuntimeManager,
	async resetSessionMcpRuntimeManager() {
		await disposeAllSessionMcpRuntimes();
		setBundleMcpCatalogListTimeoutMsForTest();
		setBundleMcpDisposeTimeoutMsForTest();
		const { testing: resolverTesting } = await import("./mcp-connection-resolver-ES3gYFWM.js");
		resolverTesting.setMcpServerConnectionResolversForTest();
		resolverTesting.setMcpConnectionResolverTimeoutMsForTest();
		resolverTesting.setMcpConnectionRevalidateMsForTest();
	},
	getCachedSessionIds() {
		return getSessionMcpRuntimeManagerForTesting().listSessionIds();
	},
	getCachedRuntimeKeys() {
		return getSessionMcpRuntimeManagerForTesting().listRuntimeKeys();
	},
	getBookkeepingSizes(manager) {
		return manager.bookkeepingSizesForTest?.() ?? {};
	},
	setBundleMcpCatalogListTimeoutMsForTest,
	setBundleMcpDisposeTimeoutMsForTest,
	resolveSessionMcpRuntimeIdleTtlMs,
	mergeMcpToolCatalogs
};
//#endregion
export { testing as n, createSessionMcpRuntime as t };
