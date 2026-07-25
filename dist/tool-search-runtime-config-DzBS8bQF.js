import { r as createLazyPromiseLoader } from "./lazy-promise-EhsWch5m.js";
import { T as resolveExpiresAtMsFromDurationSeconds, m as isFutureDateTimestampMs } from "./number-coercion-Crk_c9KW.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { v as uniqueValues } from "./string-normalization-CRyoFBPt.js";
import { i as clampNumber } from "./utils-K2PjeLaV.js";
import { r as resolveAgentConfig } from "./agent-scope-config-S7z_Yn4H.js";
import { t as stableStringify } from "./stable-stringify-Cd9_EGsU.js";
import { M as createCodeModeNamespaceRuntime, N as describeCodeModeNamespacesForPrompt, P as toCodeModeJsonSafe, j as createCodeModeApiVirtualFiles } from "./registry-BSBtFA2q.js";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-FRp1oGK4.js";
import { t as getAgentToolExecutionContext } from "./tool-execution-context-C6v2UVPI.js";
import { n as ToolInputError, r as asToolParamsRecord } from "./common-C39GdgQ7.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { c as markCodeModeControlTool, n as CODE_MODE_WAIT_TOOL_NAME, o as isCodeModeControlTool, t as CODE_MODE_EXEC_TOOL_NAME } from "./code-mode-control-tools-Byyzl1H3.js";
import { d as addClientToolsToToolCatalog, p as applyToolCatalogCompaction, t as applyLocalModelLeanToolSearchDefaults, u as ToolSearchRuntime, y as compactToolSearchCatalogEntry } from "./local-model-lean-DtWpmc0Y.js";
import { o as optionalStringEnum } from "./typebox-BEFPvxS2.js";
import { a as resolveAgentRuntimeToolConfig, i as waitForCollectorCompletion, n as SWARM_CODE_MODE_REQUEST_FINGERPRINT, t as SWARM_CODE_MODE_IDEMPOTENCY_KEY } from "./swarm-code-mode-WbKPuafn.js";
import { d as getSwarmRunByLaunchReplayKey, f as initSubagentRegistry } from "./subagent-registry-CY9-zfiv.js";
import { t as resolveSwarmConfig } from "./swarm-config-BNK1oibW.js";
import { c as resolveMainSessionAlias, s as resolveInternalSessionKey } from "./sessions-helpers-DVMRiynf.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { Worker } from "node:worker_threads";
import { Type } from "typebox";
//#region src/agents/code-mode.ts
/**
* Host-side Code Mode controller for isolated QuickJS execution with bridged
* tool search/call/yield support.
*/
const DEFAULT_TIMEOUT_MS = 1e4;
const DEFAULT_MEMORY_LIMIT_BYTES = 64 * 1024 * 1024;
const DEFAULT_MAX_OUTPUT_BYTES = 64 * 1024;
const DEFAULT_MAX_SNAPSHOT_BYTES = 10 * 1024 * 1024;
const DEFAULT_MAX_PENDING_TOOL_CALLS = 16;
const DEFAULT_SNAPSHOT_TTL_SECONDS = 900;
const DEFAULT_SEARCH_LIMIT = 8;
const DEFAULT_MAX_SEARCH_LIMIT = 50;
const MAX_ACTIVE_CODE_MODE_RUNS = 64;
const MAX_AGENT_WAIT_SNAPSHOT_TTL_WINDOWS = 4;
const MAX_CODE_MODE_CATALOG_INDEX_CHARS = 8e3;
const CODE_MODE_WORKER_WATCHDOG_GRACE_MS = 2e3;
const activeRuns = /* @__PURE__ */ new Map();
const resumingRunIds = /* @__PURE__ */ new Set();
let activeRunReservations = 0;
const typescriptRuntimeLoader = createLazyPromiseLoader(() => import("typescript"), { cacheRejections: true });
let typescriptRuntimeForTest = null;
const defaultCodeModeSwarmDeps = {
	emitSessionLifecycleEvent,
	getSwarmRunByLaunchReplayKey,
	initSubagentRegistry,
	waitForCollectorCompletion
};
let codeModeSwarmDeps = defaultCodeModeSwarmDeps;
function normalizeCodeModeRawConfig(value) {
	const codeMode = value;
	if (codeMode === true) return { enabled: true };
	if (codeMode === false) return { enabled: false };
	return isRecord(codeMode) ? codeMode : void 0;
}
function readCodeModeRawConfig(config, agentId) {
	const globalRaw = normalizeCodeModeRawConfig((isRecord(config?.tools) ? config.tools : void 0)?.codeMode) ?? {};
	const agentRaw = config && agentId ? normalizeCodeModeRawConfig(resolveAgentConfig(config, agentId)?.tools?.codeMode) : void 0;
	return agentRaw ? {
		...globalRaw,
		...agentRaw
	} : globalRaw;
}
function readBoolean(value, fallback) {
	return typeof value === "boolean" ? value : fallback;
}
function readPositiveInteger(value, fallback) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : fallback;
}
function readLanguages(value) {
	if (!Array.isArray(value)) return ["javascript", "typescript"];
	const languages = value.filter((entry) => entry === "javascript" || entry === "typescript");
	return languages.length > 0 ? uniqueValues(languages) : ["javascript", "typescript"];
}
/** Resolves Code Mode runtime limits and language support from config. */
function resolveCodeModeConfig(config, agentId) {
	const raw = readCodeModeRawConfig(config, agentId);
	const maxSearchLimit = clampNumber(readPositiveInteger(raw.maxSearchLimit, DEFAULT_MAX_SEARCH_LIMIT), 1, DEFAULT_MAX_SEARCH_LIMIT);
	return {
		enabled: readBoolean(raw.enabled, false),
		runtime: "quickjs-wasi",
		mode: "only",
		languages: readLanguages(raw.languages),
		timeoutMs: clampNumber(readPositiveInteger(raw.timeoutMs, DEFAULT_TIMEOUT_MS), 100, 6e4),
		memoryLimitBytes: clampNumber(readPositiveInteger(raw.memoryLimitBytes, DEFAULT_MEMORY_LIMIT_BYTES), 1024 * 1024, 1024 * 1024 * 1024),
		maxOutputBytes: clampNumber(readPositiveInteger(raw.maxOutputBytes, DEFAULT_MAX_OUTPUT_BYTES), 1024, 10 * 1024 * 1024),
		maxSnapshotBytes: clampNumber(readPositiveInteger(raw.maxSnapshotBytes, DEFAULT_MAX_SNAPSHOT_BYTES), 1024, 256 * 1024 * 1024),
		maxPendingToolCalls: clampNumber(readPositiveInteger(raw.maxPendingToolCalls, DEFAULT_MAX_PENDING_TOOL_CALLS), 1, 128),
		snapshotTtlSeconds: clampNumber(readPositiveInteger(raw.snapshotTtlSeconds, DEFAULT_SNAPSHOT_TTL_SECONDS), 1, 1440 * 60),
		searchDefaultLimit: clampNumber(readPositiveInteger(raw.searchDefaultLimit, DEFAULT_SEARCH_LIMIT), 1, maxSearchLimit),
		maxSearchLimit
	};
}
function toToolSearchConfig(config) {
	return {
		enabled: true,
		mode: "tools",
		codeTimeoutMs: config.timeoutMs,
		searchDefaultLimit: config.searchDefaultLimit,
		maxSearchLimit: config.maxSearchLimit
	};
}
function resolveCodeModeHeadlessConfig(ctx, overrides) {
	const base = resolveCodeModeConfig(ctx.runtimeConfig ?? ctx.config, ctx.agentId);
	return {
		...base,
		timeoutMs: clampNumber(readPositiveInteger(overrides?.timeoutMs, base.timeoutMs), 100, 6e4),
		memoryLimitBytes: clampNumber(readPositiveInteger(overrides?.memoryLimitBytes, base.memoryLimitBytes), 1024 * 1024, 1024 * 1024 * 1024),
		maxOutputBytes: clampNumber(readPositiveInteger(overrides?.maxOutputBytes, base.maxOutputBytes), 1024, 10 * 1024 * 1024),
		maxSnapshotBytes: clampNumber(readPositiveInteger(overrides?.maxSnapshotBytes, base.maxSnapshotBytes), 1024, 256 * 1024 * 1024),
		maxPendingToolCalls: clampNumber(readPositiveInteger(overrides?.maxPendingToolCalls, base.maxPendingToolCalls), 1, 128)
	};
}
function removeExpiredRuns(now = Date.now()) {
	for (const [runId, state] of activeRuns) if (!isFutureDateTimestampMs(state.expiresAt, { nowMs: now })) {
		if (state.pending?.some((entry) => entry.method === "agentWait" && !entry.settled) && state.agentWaitRetainUntil !== void 0 && isFutureDateTimestampMs(state.agentWaitRetainUntil, { nowMs: now })) {
			const renewed = resolveCodeModeSnapshotExpiresAt(now, state.config.snapshotTtlSeconds);
			if (renewed !== void 0) {
				state.expiresAt = Math.min(renewed, state.agentWaitRetainUntil);
				continue;
			}
		}
		disposeCodeModeRun(runId);
	}
}
function disposeCodeModeRun(runId) {
	const state = activeRuns.get(runId);
	for (const pending of state?.pending ?? []) if (!pending.settled) pending.cancel?.();
	activeRuns.delete(runId);
	resumingRunIds.delete(runId);
}
function resolveCodeModeSnapshotExpiresAt(now, ttlSeconds) {
	return resolveExpiresAtMsFromDurationSeconds(ttlSeconds, { nowMs: now });
}
function enforceActiveRunLimit() {
	removeExpiredRuns();
	if (activeRuns.size + activeRunReservations >= MAX_ACTIVE_CODE_MODE_RUNS) throw new ToolInputError("too many suspended code mode runs.");
}
function reserveActiveRunSlot() {
	enforceActiveRunLimit();
	activeRunReservations += 1;
	let released = false;
	return () => {
		if (released) return;
		released = true;
		activeRunReservations = Math.max(0, activeRunReservations - 1);
	};
}
function jsonByteLength(value) {
	return Buffer.byteLength(JSON.stringify(toCodeModeJsonSafe(value)) ?? "null", "utf8");
}
var CodeModeLimitError = class extends ToolInputError {
	constructor(code, message) {
		super(message);
		this.name = "CodeModeLimitError";
		this.code = code;
	}
};
function isRuntimeInterruptedError(error) {
	return errorMessage(error) === "interrupted";
}
function codeModeFailureCode(error) {
	if (error instanceof CodeModeLimitError) return error.code;
	if (isRuntimeInterruptedError(error)) return "timeout";
	return error instanceof ToolInputError ? "invalid_input" : "internal_error";
}
function codeModeFailureMessage(error) {
	return isRuntimeInterruptedError(error) ? "code mode timeout exceeded" : errorMessage(error);
}
function enforceOutputLimit(output, config) {
	if (jsonByteLength(output) > config.maxOutputBytes) throw new CodeModeLimitError("output_limit_exceeded", "code mode output limit exceeded");
}
function enforceResultLimit(params) {
	enforceOutputLimit(params.output, params.config);
	if (params.value !== void 0 && jsonByteLength(params.value) > params.config.maxOutputBytes) throw new CodeModeLimitError("output_limit_exceeded", "code mode output limit exceeded");
}
function readCode(args) {
	const params = asToolParamsRecord(args);
	const codeParam = params.code;
	const commandParam = params.command;
	if (typeof codeParam === "string" && typeof commandParam === "string" && codeParam !== commandParam) throw new ToolInputError("code and command must match when both are provided.");
	const code = typeof commandParam === "string" ? commandParam : codeParam;
	if (typeof code !== "string" || !code.trim()) throw new ToolInputError("code or command must be a non-empty string.");
	const language = params.language;
	if (language !== void 0 && language !== "javascript" && language !== "typescript") throw new ToolInputError("language must be javascript or typescript.");
	const restartSafe = params.restartSafe;
	if (restartSafe !== void 0 && typeof restartSafe !== "boolean") throw new ToolInputError("restartSafe must be a boolean.");
	return {
		code,
		language,
		restartSafe: restartSafe === true
	};
}
function readRunId(args) {
	const params = asToolParamsRecord(args);
	const runId = params.runId ?? params.run_id;
	if (typeof runId !== "string" || !runId.trim()) throw new ToolInputError("runId must be a non-empty string.");
	return runId.trim();
}
function maskCodeLiteralsAndComments(code) {
	let masked = "";
	let index = 0;
	while (index < code.length) {
		const char = code[index];
		const next = code[index + 1];
		if (char === "/" && next === "/") {
			masked += "  ";
			index += 2;
			while (index < code.length && code[index] !== "\n") {
				masked += " ";
				index += 1;
			}
			continue;
		}
		if (char === "/" && next === "*") {
			masked += "  ";
			index += 2;
			while (index < code.length) {
				if (code[index] === "*" && code[index + 1] === "/") {
					masked += "  ";
					index += 2;
					break;
				}
				masked += code[index] === "\n" ? "\n" : " ";
				index += 1;
			}
			continue;
		}
		if (char === "'" || char === "\"") {
			const quote = char;
			masked += " ";
			index += 1;
			while (index < code.length) {
				const current = code[index];
				masked += current === "\n" ? "\n" : " ";
				index += 1;
				if (current === "\\") {
					if (index < code.length) {
						masked += code[index] === "\n" ? "\n" : " ";
						index += 1;
					}
					continue;
				}
				if (current === quote) break;
			}
			continue;
		}
		masked += char;
		index += 1;
	}
	return masked;
}
function rejectsModuleAccess(code) {
	const source = maskCodeLiteralsAndComments(code);
	return /\bimport\b\s*(?:\.|\(|["'`{*]|\w)|\brequire\b\s*\(/u.test(source);
}
async function loadTypeScriptRuntime() {
	if (typescriptRuntimeForTest) return typescriptRuntimeForTest;
	return await typescriptRuntimeLoader.load();
}
async function prepareSource(input) {
	const language = input.language ?? "javascript";
	if (!input.config.languages.includes(language)) throw new ToolInputError(`code mode ${language} input is disabled.`);
	if (rejectsModuleAccess(input.code)) throw new ToolInputError("code mode module access is disabled.");
	if (language === "javascript") return input.code;
	const ts = await loadTypeScriptRuntime();
	const transformed = ts.transpileModule(input.code, {
		compilerOptions: {
			target: ts.ScriptTarget.ES2022,
			module: ts.ModuleKind.ESNext,
			importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
			sourceMap: false
		},
		reportDiagnostics: true
	});
	const diagnostics = transformed.diagnostics ?? [];
	if (diagnostics.some((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)) throw new ToolInputError(`typescript transform failed: ${diagnostics.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")).join("\n")}`);
	if (rejectsModuleAccess(transformed.outputText)) throw new ToolInputError("code mode module access is disabled.");
	return transformed.outputText;
}
function errorMessage(error) {
	if (error instanceof Error) return error.message || String(error);
	return String(error);
}
function codeModeReplayIdForToolCall(ctx, toolCallId, code, assistantTurnId) {
	const outerRunId = ctx.runId?.trim();
	if (!outerRunId) return `cm_replay_${randomUUID()}`;
	const identity = JSON.stringify([
		ctx.sessionKey ?? "",
		ctx.sessionId ?? "",
		outerRunId,
		assistantTurnId?.trim() ?? "",
		toolCallId,
		code
	]);
	return `cm_replay_${createHash("sha256").update(identity).digest("hex").slice(0, 24)}`;
}
function requireCodeModeSwarmEnabled(ctx) {
	if (!resolveSwarmConfig(ctx.runtimeConfig ?? ctx.config, ctx.agentId).enabled) throw new ToolInputError("code mode swarm globals are disabled.");
}
function resolveCodeModeRequesterSessionKey(ctx) {
	const sessionKey = ctx.sessionKey?.trim();
	if (!sessionKey) throw new ToolInputError("code mode swarm globals require session and run identity.");
	const { mainKey, alias } = resolveMainSessionAlias(ctx.runtimeConfig ?? ctx.config ?? {});
	return resolveInternalSessionKey({
		key: sessionKey,
		alias,
		mainKey
	});
}
function resolveCodeModeSwarmGroupId(ctx) {
	const sessionKey = resolveCodeModeRequesterSessionKey(ctx);
	const runId = ctx.runId?.trim();
	if (!runId) throw new ToolInputError("code mode swarm globals require session and run identity.");
	return `swarm:${sessionKey}:${runId}`;
}
function replayedSpawnResult(entry) {
	return {
		status: "accepted",
		runId: entry.swarmRunId ?? entry.runId,
		sessionKey: entry.childSessionKey,
		...entry.label ? { label: entry.label } : {}
	};
}
function readOptionalStringOption(options, key) {
	const value = options[key];
	if (value === void 0) return;
	if (typeof value !== "string" || !value.trim()) throw new ToolInputError(`agents.run ${key} must be a non-empty string.`);
	return value.trim();
}
async function runAgentSpawnBridge(params) {
	requireCodeModeSwarmEnabled(params.ctx);
	const prompt = params.request.args[0];
	const options = isRecord(params.request.args[1]) ? params.request.args[1] : {};
	if (typeof prompt !== "string" || !prompt.trim()) throw new ToolInputError("agents.run prompt must be a non-empty string.");
	const fastMode = options.fastMode;
	if (fastMode !== void 0 && fastMode !== true && fastMode !== false && fastMode !== "auto") throw new ToolInputError("agents.run fastMode must be boolean or \"auto\".");
	const schema = options.schema;
	if (schema !== void 0 && !isRecord(schema)) throw new ToolInputError("agents.run schema must be a JSON schema object.");
	const label = readOptionalStringOption(options, "label");
	const model = readOptionalStringOption(options, "model");
	const thinking = readOptionalStringOption(options, "thinking");
	const agentId = readOptionalStringOption(options, "agentId");
	const spawnEntry = params.runtime.namespaceEntries().find((entry) => entry.source === "openclaw" && entry.name === "sessions_spawn");
	if (!spawnEntry) throw new ToolInputError("agents.run requires the sessions_spawn tool.");
	const spawnInput = {
		task: prompt.trim(),
		collect: true,
		groupId: resolveCodeModeSwarmGroupId(params.ctx),
		...label ? { label } : {},
		...model ? { model } : {},
		...thinking ? { thinking } : {},
		...agentId ? { agentId } : {},
		...fastMode !== void 0 ? { fastMode } : {},
		...schema ? { outputSchema: schema } : {}
	};
	const requestFingerprint = `sha256:${createHash("sha256").update(stableStringify(spawnInput)).digest("hex")}`;
	const idempotencyKey = `${params.codeModeRunId}:${params.request.id}`;
	const requesterSessionKey = resolveCodeModeRequesterSessionKey(params.ctx);
	let existing = codeModeSwarmDeps.getSwarmRunByLaunchReplayKey(idempotencyKey, requesterSessionKey);
	if (existing) {
		if (existing.swarmLaunchRequestFingerprint !== requestFingerprint) throw new ToolInputError("agents.run replay request does not match the persisted collector.");
		if (existing.swarmLaunchPending === true) {
			if (!existing.queuedLaunch) throw new ToolInputError("agents.run persisted launch reservation cannot be recovered.");
			codeModeSwarmDeps.initSubagentRegistry();
			existing = codeModeSwarmDeps.getSwarmRunByLaunchReplayKey(idempotencyKey, requesterSessionKey) ?? existing;
			if (existing.swarmLaunchPending === true && !existing.queuedLaunch) throw new ToolInputError("agents.run persisted launch reservation cannot be recovered.");
		}
		return replayedSpawnResult(existing);
	}
	Object.defineProperty(spawnInput, SWARM_CODE_MODE_IDEMPOTENCY_KEY, { value: idempotencyKey });
	Object.defineProperty(spawnInput, SWARM_CODE_MODE_REQUEST_FINGERPRINT, { value: requestFingerprint });
	const called = await params.runtime.callExactId(spawnEntry.id, spawnInput, {
		parentToolCallId: params.parentToolCallId,
		signal: params.signal,
		onUpdate: params.onUpdate
	});
	const value = isRecord(called.result) && "details" in called.result ? called.result.details : called.result;
	if (!isRecord(value) || value.status !== "accepted" || typeof value.runId !== "string") throw new ToolInputError(`agents.run spawn failed: ${isRecord(value) && typeof value.error === "string" ? value.error : "collector spawn was not accepted"}`);
	return value;
}
async function runAgentWaitBridge(params) {
	requireCodeModeSwarmEnabled(params.ctx);
	const runId = params.request.args[0];
	if (typeof runId !== "string" || !runId.trim()) throw new ToolInputError("agentWait run id must be a non-empty string.");
	const rawSessionKey = params.ctx.sessionKey?.trim();
	if (!rawSessionKey) throw new ToolInputError("agents.run wait requires session identity.");
	const requesterSessionKey = resolveCodeModeRequesterSessionKey(params.ctx);
	return await codeModeSwarmDeps.waitForCollectorCompletion({
		runId: runId.trim(),
		currentSessionKeys: /* @__PURE__ */ new Set([rawSessionKey, requesterSessionKey]),
		signal: params.signal
	});
}
function runSwarmNoteBridge(params) {
	requireCodeModeSwarmEnabled(params.ctx);
	const note = isRecord(params.request.args[0]) ? params.request.args[0] : void 0;
	const kind = note?.kind;
	const text = note?.text;
	if (kind !== "phase" && kind !== "log" || typeof text !== "string" || !text.trim()) throw new ToolInputError("swarmNote requires phase/log kind and non-empty text.");
	const sessionKey = params.ctx.sessionKey?.trim();
	if (!sessionKey) throw new ToolInputError("swarmNote requires session identity.");
	codeModeSwarmDeps.emitSessionLifecycleEvent({
		sessionKey,
		reason: "swarm-note",
		swarmGroupId: resolveCodeModeSwarmGroupId(params.ctx),
		kind,
		text: text.trim()
	});
	return { ok: true };
}
async function runBridgeRequest(params) {
	try {
		const values = Array.isArray(params.request.args) ? params.request.args : [];
		let value;
		switch (params.request.method) {
			case "search": {
				const query = values[0];
				if (typeof query !== "string") throw new ToolInputError("search query must be a string.");
				const options = isRecord(values[1]) ? values[1] : void 0;
				value = await params.runtime.search(query, {
					limit: typeof options?.limit === "number" ? options.limit : void 0,
					includeMcp: false
				});
				break;
			}
			case "describe": {
				const id = values[0];
				if (typeof id !== "string") throw new ToolInputError("describe id must be a string.");
				value = await params.runtime.describe(id, {
					includeMcp: false,
					recoverySurface: "tools"
				});
				break;
			}
			case "call": {
				const id = values[0];
				if (typeof id !== "string") throw new ToolInputError("call id must be a string.");
				value = await params.runtime.call(id, values[1] ?? {}, {
					includeMcp: false,
					parentToolCallId: params.parentToolCallId,
					signal: params.signal,
					onUpdate: params.onUpdate,
					recoverySurface: "tools"
				});
				break;
			}
			case "callValue": {
				const id = values[0];
				if (typeof id !== "string") throw new ToolInputError("callValue id must be a string.");
				value = await params.runtime.callValue(id, values[1] ?? {}, {
					includeMcp: false,
					parentToolCallId: params.parentToolCallId,
					signal: params.signal,
					onUpdate: params.onUpdate,
					recoverySurface: "tools"
				});
				break;
			}
			case "yield":
				value = {
					status: "yielded",
					reason: values[0] ?? null
				};
				break;
			case "namespace": {
				const namespaceId = values[0];
				const pathLocal = values[1];
				const callArgs = values[2];
				if (typeof namespaceId !== "string") throw new ToolInputError("namespace id must be a string.");
				if (!Array.isArray(pathLocal) || !pathLocal.every((entry) => typeof entry === "string")) throw new ToolInputError("namespace path must be an array of strings.");
				value = await params.namespaceRuntime.invoke(namespaceId, pathLocal, Array.isArray(callArgs) ? callArgs : [], async (request) => {
					const entry = request.catalogId ? params.runtime.namespaceEntries().find((candidate) => candidate.id === request.catalogId) : params.runtime.namespaceEntries().find((candidate) => candidate.name === request.toolName && candidate.sourceName === request.pluginId);
					if (!entry) throw new ToolInputError(`namespace tool is not visible in the run catalog: ${request.toolName}`);
					const called = await params.runtime.callExactId(entry.id, request.input, {
						parentToolCallId: params.parentToolCallId,
						signal: params.signal,
						onUpdate: params.onUpdate
					});
					if (request.catalogId) return called.result;
					return isRecord(called.result) && "details" in called.result ? called.result.details : called.result;
				});
				break;
			}
			case "agentSpawn":
				value = await runAgentSpawnBridge(params);
				break;
			case "agentWait":
				value = await runAgentWaitBridge(params);
				break;
			case "swarmNote":
				value = runSwarmNoteBridge(params);
				break;
		}
		return {
			id: params.request.id,
			ok: true,
			value: toCodeModeJsonSafe(value)
		};
	} catch (error) {
		return {
			id: params.request.id,
			ok: false,
			error: errorMessage(error)
		};
	}
}
function resolveCodeModeWorkerUrl(currentModuleUrl) {
	const currentPath = fileURLToPath(currentModuleUrl);
	const distMarker = `${path.sep}dist${path.sep}`;
	const distIndex = currentPath.lastIndexOf(distMarker);
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + distMarker.length - 1);
		return pathToFileURL(path.join(distRoot, "agents", "code-mode.worker.js"));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./code-mode.worker${extension}`, currentModuleUrl);
}
function codeModeWorkerUrl() {
	return resolveCodeModeWorkerUrl(import.meta.url);
}
function failedCodeModeWorkerResult(error, code) {
	return {
		status: "failed",
		error: errorMessage(error),
		code,
		output: []
	};
}
function normalizeCodeModeTimeoutResult(result) {
	if (result.status === "failed" && result.code === "timeout" && !String(result.error).includes("timeout exceeded")) return {
		...result,
		error: "code mode timeout exceeded"
	};
	return result;
}
function normalizeCodeModeWorkerResult(result) {
	return normalizeCodeModeTimeoutResult(result);
}
async function runCodeModeWorker(workerData, timeoutMs, workerUrl, signal) {
	const resolvedWorkerUrl = workerUrl ?? codeModeWorkerUrl();
	const sourceWorkerExecArgv = resolvedWorkerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0;
	let worker;
	try {
		worker = new Worker(resolvedWorkerUrl, {
			workerData,
			execArgv: sourceWorkerExecArgv
		});
	} catch (error) {
		return failedCodeModeWorkerResult(error, "runtime_unavailable");
	}
	let timer;
	let onAbort;
	try {
		return await new Promise((resolve) => {
			let settled = false;
			const finish = (result) => {
				if (settled) return;
				settled = true;
				resolve(result);
			};
			timer = setTimeout(() => {
				worker.terminate();
				finish({
					status: "failed",
					error: "code mode worker timeout exceeded",
					code: "timeout",
					output: []
				});
			}, timeoutMs);
			onAbort = () => {
				worker.terminate();
				const abortReason = signal?.reason;
				finish({
					status: "failed",
					error: abortReason instanceof CodeModeHeadlessTimeoutError ? "code mode timeout exceeded" : "code mode execution aborted",
					code: abortReason instanceof CodeModeHeadlessTimeoutError ? "timeout" : "aborted",
					output: []
				});
			};
			signal?.addEventListener("abort", onAbort, { once: true });
			if (signal?.aborted) onAbort();
			worker.once("message", (message) => {
				worker.terminate();
				const result = isRecord(message) ? message : {
					status: "failed",
					error: "invalid code mode worker response",
					code: "internal_error",
					output: []
				};
				finish(normalizeCodeModeWorkerResult(result));
			});
			worker.once("error", (error) => {
				finish(failedCodeModeWorkerResult(error, "runtime_unavailable"));
			});
			worker.once("exit", (code) => {
				if (code !== 0) finish(failedCodeModeWorkerResult(/* @__PURE__ */ new Error(`code mode worker exited with code ${code}`), "runtime_unavailable"));
			});
		});
	} finally {
		if (timer) clearTimeout(timer);
		if (onAbort) signal?.removeEventListener("abort", onAbort);
	}
}
var CodeModeHeadlessAbortError = class extends Error {
	constructor(message = "code mode execution aborted") {
		super(message);
		this.name = "CodeModeHeadlessAbortError";
	}
};
var CodeModeHeadlessTimeoutError = class extends Error {
	constructor(message = "code mode headless wall-clock timeout exceeded") {
		super(message);
		this.name = "CodeModeHeadlessTimeoutError";
	}
};
function createHeadlessAbortScope(signal, wallClockMs) {
	const controller = new AbortController();
	const onAbort = () => controller.abort(signal?.reason);
	signal?.addEventListener("abort", onAbort, { once: true });
	if (signal?.aborted) onAbort();
	const timer = setTimeout(() => controller.abort(new CodeModeHeadlessTimeoutError()), wallClockMs);
	return {
		signal: controller.signal,
		cleanup: () => {
			clearTimeout(timer);
			signal?.removeEventListener("abort", onAbort);
		}
	};
}
function headlessAbortError(signal) {
	return signal.reason instanceof CodeModeHeadlessTimeoutError ? signal.reason : signal.reason instanceof CodeModeHeadlessAbortError ? signal.reason : new CodeModeHeadlessAbortError();
}
function headlessFailure(params) {
	return {
		status: "failed",
		...params
	};
}
function remainingHeadlessMs(deadline) {
	const remaining = deadline - Date.now();
	if (remaining <= 0) throw new CodeModeHeadlessTimeoutError();
	return remaining;
}
async function awaitHeadlessDeadline(params) {
	const remainingMs = remainingHeadlessMs(params.deadline);
	if (params.signal?.aborted) throw headlessAbortError(params.signal);
	let timer;
	let onAbort;
	try {
		const timeout = new Promise((_resolve, reject) => {
			timer = setTimeout(() => reject(new CodeModeHeadlessTimeoutError()), remainingMs);
			const signal = params.signal;
			if (signal) {
				onAbort = () => reject(headlessAbortError(signal));
				signal.addEventListener("abort", onAbort, { once: true });
			}
		});
		return await Promise.race([params.promise, timeout]);
	} finally {
		if (timer) clearTimeout(timer);
		if (params.signal && onAbort) params.signal.removeEventListener("abort", onAbort);
	}
}
async function runHeadlessWorkerLeg(params) {
	const remainingMs = remainingHeadlessMs(params.deadline);
	const timeoutMs = Math.max(1, Math.min(params.config.timeoutMs, remainingMs));
	const workerTimeoutMs = Math.max(1, Math.min(remainingMs, timeoutMs + CODE_MODE_WORKER_WATCHDOG_GRACE_MS));
	return await runCodeModeWorker({
		...params.input,
		config: {
			...params.config,
			timeoutMs
		}
	}, workerTimeoutMs, void 0, params.signal);
}
function normalizeHeadlessNamespaceValue(descriptor) {
	if (descriptor.kind === "array") return {
		kind: "array",
		items: descriptor.items.map(normalizeHeadlessNamespaceValue)
	};
	if (descriptor.kind === "object") return {
		kind: "object",
		entries: descriptor.entries.map(([key, value]) => {
			if (!key) throw new ToolInputError("code mode namespace descriptor keys must not be empty");
			return [key, normalizeHeadlessNamespaceValue(value)];
		})
	};
	if (descriptor.kind !== "value") return descriptor;
	return {
		kind: "value",
		value: toCodeModeJsonSafe(descriptor.value)
	};
}
function normalizeHeadlessNamespace(descriptor) {
	return {
		...descriptor,
		scope: normalizeHeadlessNamespaceValue(descriptor.scope)
	};
}
function mergeHeadlessNamespaces(registered, extra) {
	const ids = new Set(registered.map((descriptor) => descriptor.id));
	const globalNames = new Set(registered.map((descriptor) => descriptor.globalName));
	const merged = [...registered];
	for (const descriptor of extra) {
		if (ids.has(descriptor.id) || globalNames.has(descriptor.globalName)) throw new ToolInputError(`code mode namespace collision for ${descriptor.id} (${descriptor.globalName})`);
		ids.add(descriptor.id);
		globalNames.add(descriptor.globalName);
		merged.push(normalizeHeadlessNamespace(descriptor));
	}
	return merged;
}
function headlessNamespaceFreezePrelude(descriptors) {
	return `;(() => {
    const seen = new WeakSet();
    const freeze = (value) => {
      if ((value === null || (typeof value !== "object" && typeof value !== "function")) || seen.has(value)) return value;
      seen.add(value);
      for (const key of Object.keys(value)) freeze(value[key]);
      return Object.freeze(value);
    };
    for (const name of ${JSON.stringify(descriptors.map((descriptor) => descriptor.globalName))}) freeze(globalThis[name]);
  })();\n`;
}
function createCodeModeApiFilesForRun(catalog, swarmEnabled) {
	const files = createCodeModeApiVirtualFiles(catalog);
	return swarmEnabled ? files : files.filter((file) => file.path !== "agents.d.ts");
}
/** Run Code Mode to completion without publishing resumable snapshot state. */
async function runCodeModeScriptHeadless(params) {
	const config = resolveCodeModeHeadlessConfig(params.ctx, params.overrides);
	const wallClockMs = clampNumber(readPositiveInteger(params.wallClockMs, 3e4), 1, 3e5);
	const maxToolCalls = clampNumber(readPositiveInteger(params.maxToolCalls, 5), 1, 128);
	const deadline = Date.now() + wallClockMs;
	const abortScope = createHeadlessAbortScope(params.signal, wallClockMs);
	const output = [];
	let toolCallCount = 0;
	try {
		const swarmEnabled = false;
		const codeModeRunId = `cm_headless_${randomUUID()}`;
		const runtime = new ToolSearchRuntime(params.ctx, toToolSearchConfig(config));
		const catalog = runtime.all({ includeMcp: false });
		const namespaceCatalog = runtime.namespaceEntries();
		const namespaceRuntime = await awaitHeadlessDeadline({
			promise: createCodeModeNamespaceRuntime(params.ctx, namespaceCatalog),
			deadline,
			signal: abortScope.signal
		});
		const preparedSource = await awaitHeadlessDeadline({
			promise: prepareSource({
				code: params.code,
				language: params.language,
				config
			}),
			deadline,
			signal: abortScope.signal
		});
		const namespaces = mergeHeadlessNamespaces(namespaceRuntime.descriptors, params.extraNamespaces ?? []);
		const source = `${headlessNamespaceFreezePrelude(namespaces)}${preparedSource}`;
		const parentToolCallId = `headless:${randomUUID()}`;
		let result = normalizeCodeModeWorkerResult(await runHeadlessWorkerLeg({
			input: {
				kind: "exec",
				source,
				catalog,
				apiFiles: createCodeModeApiFilesForRun(namespaceCatalog, swarmEnabled),
				namespaces,
				swarmEnabled
			},
			config,
			deadline,
			signal: abortScope.signal
		}));
		while (true) {
			output.push(...result.output);
			enforceOutputLimit(output, config);
			if (result.status === "completed") {
				enforceResultLimit({
					output,
					value: result.value,
					config
				});
				return {
					status: "completed",
					value: result.value,
					output,
					toolCallCount
				};
			}
			if (result.status === "failed") return headlessFailure({
				code: result.code,
				error: result.error,
				output,
				toolCallCount
			});
			enforceSnapshotPayloadLimits({
				snapshotBytes: result.snapshotBytes,
				config,
				output
			});
			const requestedToolCalls = result.pendingRequests.filter((request) => request.method === "call" || request.method === "callValue" || request.method === "namespace").length;
			toolCallCount += requestedToolCalls;
			if (toolCallCount > maxToolCalls) return headlessFailure({
				code: "tool_budget_exceeded",
				error: `code mode headless tool budget exceeded (${maxToolCalls})`,
				output,
				toolCallCount
			});
			const settledRequests = await awaitHeadlessDeadline({
				promise: Promise.all(result.pendingRequests.map((request) => runBridgeRequest({
					runtime,
					namespaceRuntime,
					parentToolCallId,
					codeModeRunId,
					ctx: params.ctx,
					request,
					signal: abortScope.signal
				}))),
				deadline,
				signal: abortScope.signal
			});
			result = normalizeCodeModeWorkerResult(await runHeadlessWorkerLeg({
				input: {
					kind: "resume",
					snapshotBytes: result.snapshotBytes,
					settledRequests
				},
				config,
				deadline,
				signal: abortScope.signal
			}));
		}
	} catch (error) {
		const timedOut = error instanceof CodeModeHeadlessTimeoutError;
		const aborted = error instanceof CodeModeHeadlessAbortError;
		return headlessFailure({
			code: timedOut ? "timeout" : aborted ? "aborted" : codeModeFailureCode(error),
			error: timedOut || aborted ? error.message : codeModeFailureMessage(error),
			output,
			toolCallCount
		});
	} finally {
		abortScope.cleanup();
	}
}
function snapshotState(params) {
	enforceSnapshotStateLimits(params);
	const runId = `cm_${randomUUID()}`;
	return storeSnapshotState({
		...params,
		runId,
		replayId: params.codeModeReplayId,
		pending: createPendingBridgeStates({
			...params,
			activeRunId: runId,
			codeModeRunId: params.codeModeReplayId
		}),
		replaySafe: params.replaySafe && pendingBridgeRequestsReplaySafe(params.pendingRequests, params.runtime)
	});
}
function pendingBridgeRequestsReplaySafe(pending, runtime) {
	return pending.every((request) => {
		if (request.method === "search" || request.method === "describe" || request.method === "yield" || request.method === "agentSpawn" || request.method === "agentWait") return true;
		if (request.method !== "call" && request.method !== "callValue") return false;
		const id = Array.isArray(request.args) ? request.args[0] : void 0;
		return typeof id === "string" && runtime.isReplaySafeExactId(id);
	});
}
function enforceSnapshotStateLimits(params) {
	enforceActiveRunLimit();
	enforceSnapshotPayloadLimits(params);
}
function enforceSnapshotPayloadLimits(params) {
	if (params.snapshotBytes.byteLength > params.config.maxSnapshotBytes) throw new CodeModeLimitError("snapshot_limit_exceeded", "code mode snapshot limit exceeded");
	enforceOutputLimit(params.output, params.config);
}
function createPendingBridgeStates(params) {
	return params.pendingRequests.map((request) => {
		const abortController = new AbortController();
		const signal = params.signal ? AbortSignal.any([params.signal, abortController.signal]) : abortController.signal;
		const promise = runBridgeRequest({
			runtime: params.runtime,
			namespaceRuntime: params.namespaceRuntime,
			parentToolCallId: params.parentToolCallId,
			codeModeRunId: params.codeModeRunId,
			ctx: params.ctx,
			request,
			signal,
			onUpdate: params.onUpdate
		});
		const state = {
			...request,
			promise,
			cancel: () => abortController.abort()
		};
		promise.then((settled) => {
			state.settled = settled;
			if (state.method === "agentWait" && params.activeRunId) {
				const active = activeRuns.get(params.activeRunId);
				if (active?.pending.includes(state)) {
					const renewed = resolveCodeModeSnapshotExpiresAt(Date.now(), active.config.snapshotTtlSeconds);
					if (renewed !== void 0) active.expiresAt = renewed;
				}
			}
		});
		return state;
	});
}
function storeSnapshotState(params) {
	const now = Date.now();
	const expiresAt = resolveCodeModeSnapshotExpiresAt(now, params.config.snapshotTtlSeconds);
	if (expiresAt === void 0) throw new ToolInputError("code mode run expiry is unavailable.");
	const agentWaitRetainUntil = params.pending.some((entry) => entry.method === "agentWait" && !entry.settled) ? resolveCodeModeSnapshotExpiresAt(now, params.config.snapshotTtlSeconds * MAX_AGENT_WAIT_SNAPSHOT_TTL_WINDOWS) : void 0;
	activeRuns.set(params.runId, {
		runId: params.runId,
		replayId: params.replayId,
		parentToolCallId: params.parentToolCallId,
		ctx: params.ctx,
		config: params.config,
		snapshotBytes: params.snapshotBytes,
		pending: params.pending,
		replaySafe: params.replaySafe,
		output: params.output,
		createdAt: now,
		expiresAt,
		agentWaitRetainUntil,
		runtime: params.runtime,
		namespaceRuntime: params.namespaceRuntime
	});
	return {
		status: "waiting",
		runId: params.runId,
		reason: codeModeWaitingReason(params.pending),
		pendingToolCalls: pendingToolCalls(params.pending),
		replaySafe: params.replaySafe,
		output: params.output,
		telemetry: telemetry(params.runtime)
	};
}
function codeModeWaitingReason(pending) {
	return pending.length > 0 && pending.every((entry) => entry.method === "yield") ? "yield" : "pending_tools";
}
function pendingToolCalls(pending) {
	return pending.map((entry) => ({
		id: entry.id,
		method: entry.method
	}));
}
function telemetry(runtime) {
	return {
		...runtime.telemetry(),
		visibleTools: [CODE_MODE_EXEC_TOOL_NAME, CODE_MODE_WAIT_TOOL_NAME]
	};
}
function renderCodeModeCatalogIndex(lines, total) {
	const omitted = total - lines.length;
	const footer = omitted > 0 ? `${omitted} additional OpenClaw/plugin tools omitted from this prompt index. Use ALL_TOOLS or tools.search inside exec to find them.` : "Use these exact ids with tools.callValue; use ALL_TOOLS or tools.search inside exec when lookup is ambiguous.";
	return [
		"OpenClaw/plugin tool quick index (exact ids plus compact input and declared output hints; descriptions are intentionally deferred):",
		"Each line is `id input -> output`; `-> ?` means the output shape is unknown.",
		"OUTPUT DECLARED RULE: use the named fields in the first exec; keep dependent reads, checks, and follow-up calls in that exec instead of returning a raw value only to inspect an already-declared shape.",
		"OUTPUT UNKNOWN RULE: when the needed tool is `-> ?`, including a final dependent call after declared-output calls, return that tool's raw value unchanged. Do not wrap it in the requested answer shape or read guessed fields; filter or map only in a later exec after observing its shape.",
		...lines,
		"",
		footer
	].join("\n");
}
function formatCodeModeCatalogIndex(catalog) {
	const lines = catalog.filter((entry) => entry.source === "openclaw").map((entry) => compactToolSearchCatalogEntry(entry)).toSorted((a, b) => (a.output ? 0 : 1) - (b.output ? 0 : 1) || a.id.localeCompare(b.id)).map((entry) => `- ${JSON.stringify(entry.id)} ${entry.input ?? "unknown"} -> ${entry.output ?? "?"}`);
	if (lines.length === 0) return "";
	const fullIndex = renderCodeModeCatalogIndex(lines, lines.length);
	if (fullIndex.length <= MAX_CODE_MODE_CATALOG_INDEX_CHARS) return fullIndex;
	const included = [];
	for (const line of lines) if (renderCodeModeCatalogIndex([...included, line], lines.length).length <= MAX_CODE_MODE_CATALOG_INDEX_CHARS) included.push(line);
	return renderCodeModeCatalogIndex(included, lines.length);
}
function createCodeModeExecDescription(ctx, catalog) {
	const namespacePrompt = describeCodeModeNamespacesForPrompt(ctx, catalog);
	const catalogKnown = catalog !== void 0;
	const hasMcp = catalog?.some((entry) => entry.source === "mcp") ?? false;
	const swarmEnabled = resolveSwarmConfig(ctx.runtimeConfig ?? ctx.config, ctx.agentId).enabled;
	const apiGuidance = !catalogKnown || hasMcp || swarmEnabled ? " Read TypeScript-style declaration files with `API.list(prefix?)` and `API.read(path)`." : "";
	const mcpGuidance = !catalogKnown || hasMcp ? " MCP tools are available only through the `MCP` namespace." : "";
	const swarmGuidance = swarmEnabled ? " Swarm globals `agents.run`, `phase`, and `log` are available; read `agents.d.ts` for types and orchestration idioms." : "";
	const namespaceGuidance = !catalogKnown || namespacePrompt ? " Registered plugin namespaces are available as direct globals and through `namespaces` when their required tools are visible in the run catalog." : "";
	const catalogIndex = catalog ? formatCodeModeCatalogIndex(catalog) : "";
	return "Run JavaScript or TypeScript in OpenClaw code mode. Use `return` to pass the final value back to the agent; awaited calls without a returned value complete as `null`. Quick-index arrows show trusted declared output hints; `-> ?` means never guess result field names. When the needed tool has an unknown output, including a final dependent call after declared-output calls, the first exec must return the raw tool value unchanged with `return await tools.callValue(id, args);`; do not wrap it in the requested answer shape or read guessed fields; filter or map it only in a later exec after observing its shape. When the arrow declares the fields you need, select, call, and process them in the first exec; do not spend another exec inspecting that declared shape. Within that exec, perform dependent reads, checks, and follow-up calls in order; nested calls still enforce normal tool policy and approvals. Parallelize only independent work. `ALL_TOOLS` is the complete compact catalog with exact ids, input hints, and declared output hints. Select from it directly when practical, use `tools.search(query: string, options?)` when lookup is ambiguous, and use `tools.describe(id: string)` only when the compact input hint is insufficient. Never invent or transform a tool id. `tools.callValue(id: string, args?)` executes a tool and returns its JSON value directly; `tools.call(id: string, args?)` preserves the raw `{ tool, result }` envelope. Example: `const hit = ALL_TOOLS.find((entry) => entry.description.includes('weather')) ?? (await tools.search('weather'))[0]; return await tools.callValue(hit.id, {});`. Node.js modules and `require`/`import` are NOT available; for any shell, file, network, or external action, use enabled catalog tools allowed by policy from inside your code." + apiGuidance + mcpGuidance + swarmGuidance + namespaceGuidance + " The `language` field accepts only \"javascript\" or \"typescript\"; do not pass \"bash\", \"shell\", or other values." + (namespacePrompt ? `\n\n${namespacePrompt}` : "") + (catalogIndex ? `\n\n${catalogIndex}` : "");
}
async function runExec(params) {
	removeExpiredRuns();
	const config = resolveCodeModeConfig(params.ctx.runtimeConfig ?? params.ctx.config, params.ctx.agentId);
	if (!config.enabled) throw new ToolInputError("code mode is disabled.");
	const runtime = new ToolSearchRuntime(params.ctx, toToolSearchConfig(config));
	if (params.signal?.aborted) return {
		status: "failed",
		error: "code mode execution aborted",
		code: "aborted",
		output: [],
		replaySafe: params.restartSafe,
		telemetry: telemetry(runtime)
	};
	const catalog = runtime.all({ includeMcp: false });
	const namespaceCatalog = runtime.namespaceEntries();
	const swarmEnabled = resolveSwarmConfig(params.ctx.runtimeConfig ?? params.ctx.config, params.ctx.agentId).enabled;
	const codeModeReplayId = codeModeReplayIdForToolCall(params.ctx, params.toolCallId, params.code, params.assistantTurnId);
	const namespaceRuntime = await createCodeModeNamespaceRuntime(params.ctx, namespaceCatalog);
	const apiFiles = createCodeModeApiFilesForRun(namespaceCatalog, swarmEnabled);
	let source;
	try {
		source = await prepareSource({
			code: params.code,
			language: params.language,
			config
		});
	} catch (error) {
		return {
			status: "failed",
			error: codeModeFailureMessage(error),
			code: codeModeFailureCode(error),
			output: [],
			replaySafe: params.restartSafe,
			telemetry: telemetry(runtime)
		};
	}
	const deadlineMs = Date.now() + config.timeoutMs;
	try {
		const result = normalizeCodeModeWorkerResult(await runCodeModeWorker({
			kind: "exec",
			source,
			config,
			catalog,
			apiFiles,
			namespaces: namespaceRuntime.descriptors,
			swarmEnabled
		}, config.timeoutMs + CODE_MODE_WORKER_WATCHDOG_GRACE_MS, void 0, params.signal));
		return await settleCodeModeResult({
			result,
			output: result.output,
			replaySafe: params.restartSafe,
			deadlineMs,
			parentToolCallId: params.toolCallId,
			codeModeReplayId,
			ctx: params.ctx,
			config,
			runtime,
			namespaceRuntime,
			signal: params.signal,
			onUpdate: params.onUpdate
		});
	} catch (error) {
		return {
			status: "failed",
			error: codeModeFailureMessage(error),
			code: codeModeFailureCode(error),
			output: [],
			replaySafe: params.restartSafe,
			telemetry: telemetry(runtime)
		};
	}
}
function usableResumeBudgetMs(deadlineMs, config) {
	const minimum = Math.min(250, Math.max(1, Math.floor(config.timeoutMs / 2)));
	const remaining = deadlineMs - Date.now();
	return remaining >= minimum ? remaining : void 0;
}
async function waitForPending(pending, timeoutMs, signal) {
	if (signal?.aborted) return false;
	const pendingPromises = pending.filter((entry) => !entry.settled).map((entry) => entry.promise);
	if (pendingPromises.length === 0) return true;
	let timer;
	let onAbort;
	try {
		return await Promise.race([
			Promise.all(pendingPromises).then(() => true),
			new Promise((resolve) => {
				timer = setTimeout(() => resolve(false), timeoutMs);
			}),
			...signal ? [new Promise((resolve) => {
				onAbort = () => resolve(false);
				signal.addEventListener("abort", onAbort, { once: true });
			})] : []
		]);
	} finally {
		if (timer) clearTimeout(timer);
		if (signal && onAbort) signal.removeEventListener("abort", onAbort);
	}
}
async function settleCodeModeResult(params) {
	let result = params.result;
	const output = params.output;
	const settleDeadline = params.deadlineMs;
	const abortedResult = () => ({
		status: "failed",
		error: "code mode execution aborted",
		code: "aborted",
		output,
		replaySafe: params.replaySafe,
		telemetry: telemetry(params.runtime)
	});
	while (result.status === "waiting" && result.pendingRequests.length > 0 && result.pendingRequests.every((request) => request.method !== "yield")) {
		if (params.replaySafe) {
			if (result.pendingRequests.every((request) => request.method === "namespace")) return {
				status: "failed",
				error: "restart-safe code mode cannot call plugin namespaces.",
				code: "invalid_input",
				output,
				replaySafe: true,
				telemetry: telemetry(params.runtime)
			};
			break;
		}
		const remainingMs = settleDeadline - Date.now();
		if (remainingMs <= 0) break;
		if (params.signal?.aborted) return abortedResult();
		enforceSnapshotPayloadLimits({
			snapshotBytes: result.snapshotBytes,
			config: params.config,
			output
		});
		const releaseReservation = reserveActiveRunSlot();
		try {
			const activeRunId = `cm_${randomUUID()}`;
			const pending = createPendingBridgeStates({
				pendingRequests: result.pendingRequests,
				runtime: params.runtime,
				namespaceRuntime: params.namespaceRuntime,
				parentToolCallId: params.parentToolCallId,
				codeModeRunId: params.codeModeReplayId,
				activeRunId,
				ctx: params.ctx,
				signal: params.signal,
				onUpdate: params.onUpdate
			});
			const ready = await waitForPending(pending, remainingMs, params.signal);
			const resumeBudgetMs = ready ? usableResumeBudgetMs(settleDeadline, params.config) : void 0;
			if (!ready || resumeBudgetMs === void 0) {
				if (params.signal?.aborted) return abortedResult();
				return storeSnapshotState({
					runId: activeRunId,
					replayId: params.codeModeReplayId,
					pending,
					replaySafe: false,
					snapshotBytes: result.snapshotBytes,
					parentToolCallId: params.parentToolCallId,
					ctx: params.ctx,
					config: params.config,
					runtime: params.runtime,
					namespaceRuntime: params.namespaceRuntime,
					output
				});
			}
			const settledRequests = [];
			for (const entry of pending) settledRequests.push(entry.settled ?? await entry.promise);
			result = normalizeCodeModeWorkerResult(await runCodeModeWorker({
				kind: "resume",
				snapshotBytes: result.snapshotBytes,
				config: {
					...params.config,
					timeoutMs: resumeBudgetMs
				},
				settledRequests
			}, resumeBudgetMs + CODE_MODE_WORKER_WATCHDOG_GRACE_MS, void 0, params.signal));
		} finally {
			releaseReservation();
		}
		output.push(...result.output);
		enforceOutputLimit(output, params.config);
	}
	if (result.status === "waiting") {
		if (params.signal?.aborted) return abortedResult();
		const pendingReplaySafe = pendingBridgeRequestsReplaySafe(result.pendingRequests, params.runtime);
		if (params.replaySafe && !pendingReplaySafe) return {
			status: "failed",
			error: "restart-safe code mode cannot call side-effecting tools.",
			code: "invalid_input",
			output,
			replaySafe: true,
			telemetry: telemetry(params.runtime)
		};
		return snapshotState({
			pendingRequests: result.pendingRequests,
			snapshotBytes: result.snapshotBytes,
			parentToolCallId: params.parentToolCallId,
			codeModeReplayId: params.codeModeReplayId,
			ctx: params.ctx,
			config: params.config,
			runtime: params.runtime,
			namespaceRuntime: params.namespaceRuntime,
			output,
			replaySafe: params.replaySafe,
			signal: params.signal,
			onUpdate: params.onUpdate
		});
	}
	enforceResultLimit({
		output,
		value: result.status === "completed" ? result.value : void 0,
		config: params.config
	});
	return {
		...result,
		output,
		replaySafe: params.replaySafe,
		telemetry: telemetry(params.runtime)
	};
}
async function runWait(params) {
	removeExpiredRuns();
	const state = activeRuns.get(params.runId);
	if (!state) throw new ToolInputError("code mode run is unavailable or expired.");
	if (state.ctx.runId && params.ctx.runId && state.ctx.runId !== params.ctx.runId) throw new ToolInputError("code mode run belongs to a different agent run.");
	if (state.ctx.sessionId && params.ctx.sessionId && state.ctx.sessionId !== params.ctx.sessionId || state.ctx.sessionKey && params.ctx.sessionKey && state.ctx.sessionKey !== params.ctx.sessionKey || state.ctx.agentId && params.ctx.agentId && state.ctx.agentId !== params.ctx.agentId) throw new ToolInputError("code mode run belongs to a different session.");
	if (resumingRunIds.has(state.runId)) throw new ToolInputError("code mode run is already being resumed.");
	resumingRunIds.add(state.runId);
	const deadlineMs = Date.now() + state.config.timeoutMs;
	try {
		const ready = await waitForPending(state.pending, Math.max(1, deadlineMs - Date.now()), params.signal);
		const resumeBudgetMs = ready ? usableResumeBudgetMs(deadlineMs, state.config) : void 0;
		if (!ready || resumeBudgetMs === void 0) {
			if (params.signal?.aborted) {
				disposeCodeModeRun(state.runId);
				return {
					status: "failed",
					error: "code mode execution aborted",
					code: "aborted",
					output: state.output,
					replaySafe: state.replaySafe,
					telemetry: telemetry(state.runtime)
				};
			}
			const pending = state.pending.filter((entry) => !entry.settled);
			return {
				status: "waiting",
				runId: state.runId,
				reason: codeModeWaitingReason(pending.length > 0 ? pending : state.pending),
				pendingToolCalls: pendingToolCalls(pending.length > 0 ? pending : state.pending),
				replaySafe: state.replaySafe,
				output: state.output,
				telemetry: telemetry(state.runtime)
			};
		}
		disposeCodeModeRun(state.runId);
		const settledRequests = [];
		for (const entry of state.pending) settledRequests.push(entry.settled ?? await entry.promise);
		const result = normalizeCodeModeWorkerResult(await runCodeModeWorker({
			kind: "resume",
			snapshotBytes: state.snapshotBytes,
			config: {
				...state.config,
				timeoutMs: resumeBudgetMs
			},
			settledRequests
		}, resumeBudgetMs + CODE_MODE_WORKER_WATCHDOG_GRACE_MS, void 0, params.signal));
		const output = [...state.output, ...result.output];
		enforceOutputLimit(output, state.config);
		return await settleCodeModeResult({
			result,
			output,
			replaySafe: state.replaySafe,
			deadlineMs,
			parentToolCallId: params.toolCallId,
			codeModeReplayId: state.replayId,
			ctx: state.ctx,
			config: state.config,
			runtime: state.runtime,
			namespaceRuntime: state.namespaceRuntime,
			signal: params.signal,
			onUpdate: params.onUpdate
		});
	} catch (error) {
		return {
			status: "failed",
			error: codeModeFailureMessage(error),
			code: codeModeFailureCode(error),
			output: state.output,
			replaySafe: state.replaySafe,
			telemetry: telemetry(state.runtime)
		};
	} finally {
		resumingRunIds.delete(state.runId);
	}
}
/** Create the exec/wait control tools for one Code Mode run context. */
function createCodeModeTools(ctx) {
	return [markCodeModeControlTool({
		name: CODE_MODE_EXEC_TOOL_NAME,
		label: "exec",
		description: createCodeModeExecDescription(ctx),
		parameters: Type.Object({
			code: Type.Optional(Type.String({ description: "JavaScript or TypeScript source for one complete workflow. Select exact ids from `ALL_TOOLS` or `tools.search`; never invent ids. `tools.search` takes a query string, not an object. Keep dependent operations in this program, never put dependent calls in Promise.all, and return the final value. `API` virtual declaration files and registered namespace globals are also available in scope; Node built-in modules are not." })),
			command: Type.Optional(Type.String({ description: "Alias for code, provided for exec-compatible hook policies." })),
			language: optionalStringEnum(["javascript", "typescript"], { description: "Source language. Must be \"javascript\" or \"typescript\". Defaults to javascript." }),
			restartSafe: Type.Optional(Type.Boolean({ description: "Set true only when every catalog call is explicitly replay-safe and OpenClaw may reconstruct the work after a gateway restart. Leave unset for ordinary calls; true rejects unmarked or side-effecting tools and plugin namespaces." }))
		}),
		execute: async (toolCallId, args, signal, onUpdate) => {
			const input = readCode(args);
			const executionContext = getAgentToolExecutionContext();
			return jsonResult(normalizeCodeModeTimeoutResult(await runExec({
				toolCallId,
				ctx,
				code: input.code,
				assistantTurnId: executionContext?.assistantMessage.responseId?.trim() || executionContext?.assistantMessage.turnId?.trim(),
				language: input.language,
				restartSafe: ctx.forceRestartSafeTools === true || input.restartSafe,
				signal,
				onUpdate
			})));
		}
	}), markCodeModeControlTool({
		name: CODE_MODE_WAIT_TOOL_NAME,
		label: "wait",
		hideFromChannelProgress: true,
		description: "Resume a suspended OpenClaw code mode run returned by exec.",
		parameters: Type.Object({ runId: Type.String({ description: "Code mode run id returned by exec." }) }),
		execute: async (toolCallId, args, signal, onUpdate) => jsonResult(normalizeCodeModeTimeoutResult(await runWait({
			toolCallId,
			ctx,
			runId: readRunId(args),
			signal,
			onUpdate
		})))
	})];
}
/** Compact normal tools behind Code Mode exec/wait controls. */
function applyCodeModeCatalog(params) {
	if (!resolveCodeModeConfig(params.config, params.agentId).enabled) return applyToolCatalogCompaction({
		...params,
		enabled: false,
		isVisibleControlTool: isCodeModeControlTool
	});
	const tools = params.tools.filter((tool) => isCodeModeControlTool(tool) || tool.name !== "tool_search_code" && tool.name !== "tool_search" && tool.name !== "tool_describe" && tool.name !== "tool_call");
	const compacted = applyToolCatalogCompaction({
		...params,
		tools,
		enabled: true,
		isVisibleControlTool: isCodeModeControlTool,
		shouldCatalogTool: (tool) => !isCodeModeControlTool(tool)
	});
	const visibleCatalog = params.catalogRef?.current?.entries;
	for (const tool of compacted.tools) if (tool.name === "exec") tool.description = createCodeModeExecDescription({
		config: params.config,
		runtimeConfig: params.config,
		agentId: params.agentId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		runId: params.runId,
		catalogRef: params.catalogRef
	}, visibleCatalog);
	return compacted;
}
/** Move client-side tool definitions into the active Code Mode catalog. */
function addClientToolsToCodeModeCatalog(params) {
	return addClientToolsToToolCatalog({
		...params,
		enabled: resolveCodeModeConfig(params.config, params.agentId).enabled
	});
}
/** Test-only hooks and state accessors for Code Mode worker orchestration. */
const testing = {
	activeRuns,
	resumingRunIds,
	codeModeReplayIdForToolCall,
	removeExpiredRuns,
	runBridgeRequest,
	createHeadlessAbortScope,
	normalizeCodeModeWorkerResult,
	runCodeModeWorker,
	resolveCodeModeHeadlessConfig,
	resolveCodeModeWorkerUrl,
	getTypescriptRuntimePromise: () => typescriptRuntimeLoader.peek() ?? null,
	setTypescriptRuntimeForTest: (runtime) => {
		typescriptRuntimeForTest = runtime;
	},
	setSwarmDepsForTest: (overrides) => {
		codeModeSwarmDeps = overrides ? {
			...defaultCodeModeSwarmDeps,
			...overrides
		} : defaultCodeModeSwarmDeps;
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.codeModeTestApi")] = testing;
//#endregion
//#region src/agents/tool-search-runtime-config.ts
function resolveAgentToolSearchRuntimeConfig(params) {
	const runtimeConfig = resolveAgentRuntimeToolConfig(params.config);
	if (params.forceDirectMessageTool) return runtimeConfig;
	return applyLocalModelLeanToolSearchDefaults({
		config: runtimeConfig,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
}
//#endregion
export { applyCodeModeCatalog as a, runCodeModeScriptHeadless as c, addClientToolsToCodeModeCatalog as i, CodeModeHeadlessAbortError as n, createCodeModeTools as o, CodeModeHeadlessTimeoutError as r, resolveCodeModeConfig as s, resolveAgentToolSearchRuntimeConfig as t };
