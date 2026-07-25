import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { p as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-Crk_c9KW.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { u as redactToolPayloadText } from "./redact-DNq_HeDt.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { r as markOpenClawExecEnv } from "./openclaw-exec-env-BmbZ1aqS.js";
import { r as defaultRuntime } from "./runtime-ZHfN2VLf.js";
import { r as getChildLogger } from "./logger-Dy4xN1lg.js";
import "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { E as parseAgentSessionKey, d as resolveAgentIdFromSessionKey, f as resolveEventSessionKey, v as toAgentStoreSessionKey } from "./session-key-Drrs61Fd.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, n as listAgentIds, o as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-S7z_Yn4H.js";
import { t as parseDurationMs } from "./parse-duration-Be19e01j.js";
import { r as runCommandWithTimeout } from "./exec-Cb0CNQNz.js";
import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import { t as SsrFBlockedError } from "./ssrf-eKWXIRoD.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-C7JzO8vD.js";
import { m as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-CLw1UuhK.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-C6QB2pJa.js";
import { n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-C7kXMD8t.js";
import { l as resolveStorePath } from "./paths-BpMRJ7TJ.js";
import "./logging-DFuIlf8X.js";
import { t as ensureRuntimePluginsLoaded } from "./runtime-plugins-C2HQO8GV.js";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DTFzouyz.js";
import { d as ensureAgentWorkspace } from "./workspace-GYctLxSN.js";
import { o as requestHeartbeat } from "./heartbeat-wake-CH_r-5du.js";
import { o as enqueueSystemEventEntry, t as consumeSelectedSystemEventEntries } from "./system-events-BNfyhKS3.js";
import { a as resolveCronDeliverySessionKey, o as resolveCronNotificationSessionKey, s as resolveCronSessionTargetSessionKey } from "./session-target-DJsUULzX.js";
import { s as resolveCronJobsStorePath } from "./store-CFkN1_TJ.js";
import { t as abortAndDrainEmbeddedAgentRun } from "./runs-DDczt14d.js";
import { o as isSilentReplyText } from "./tokens-DKI4eGAu.js";
import "./sessions-Uqhj6EXw.js";
import { S as unregisterSessionAutomationSource, b as claimSessionAutomationEpoch, l as loadGatewaySessionRow, w as resolveCronJobBoundSessionKeys, x as registerSessionAutomationSource, y as bumpSessionAutomationVersion } from "./session-utils-CEU0rCPC.js";
import { t as resolveCronAgentSessionKey } from "./session-key-BRBN4bbo.js";
import { t as getProcessSupervisor } from "./supervisor-Da_-xdZV.js";
import { l as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-ChkvrkDs.js";
import { i as getPluginToolMeta } from "./tools-DzbN4AH5.js";
import "./agent-bundle-mcp-tools-DaXqeeyj.js";
import { a as isAgentDeletionBlocked } from "./agent-lifecycle-registry-CkmkoYeX.js";
import "./embedded-agent-BD_ojzpk.js";
import { b as createToolSearchCatalogRef, w as registerHeadlessToolSearchCatalog } from "./local-model-lean-DtWpmc0Y.js";
import { t as buildOutboundSessionContext } from "./session-context-Cq_Z7k0n.js";
import { r as resolveMainScopedEventSessionKey } from "./event-session-routing-CyZ_0PGe.js";
import { t as createOpenClawCodingTools } from "./agent-tools-D19rPL7p.js";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-0-LpzH8H.js";
import { n as resolveCronStoredDeliveryContext } from "./delivery-context-3tiYyUnG.js";
import { t as normalizeHttpWebhookUrl } from "./webhook-url-BOvGxtq0.js";
import { t as sendDurableMessageBatch } from "./runtime-CzinzbLb.js";
import { n as resolveSandboxContext } from "./context-BGxLoANr.js";
import "./sandbox-fNdb3CBK.js";
import { r as resolveEmbeddedAttemptToolConstructionPlan, t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-BeSmQ2ah.js";
import { c as runCodeModeScriptHeadless, n as CodeModeHeadlessAbortError, r as CodeModeHeadlessTimeoutError } from "./tool-search-runtime-config-DzBS8bQF.js";
import { t as cleanupBrowserSessionsForLifecycleEnd } from "./browser-lifecycle-cleanup-D_lKPd4O.js";
import { t as createOutboundSendDeps } from "./outbound-send-deps-DpHOvcCe.js";
import { n as resolveAgentOutboundIdentity } from "./identity-M9c2BE55.js";
import { n as resolveCronDeliveryPlan, r as resolveFailureDestination } from "./delivery-plan-DNk_xIW4.js";
import { t as resolveDeliveryTarget } from "./delivery-target-FhXY_V65.js";
import { n as buildCronAgentDefaultsConfig, r as resolveCronActiveRuntimeConfig, t as runCronIsolatedAgentTurn } from "./isolated-agent-DQCuOuwK.js";
import { t as toPublicCronJob } from "./public-job-K3v4W-Kg.js";
import { t as CronService } from "./service-I5TL4vDE.js";
import { n as runHeartbeatOnce } from "./heartbeat-runner-BnH5H5-Z.js";
import { t as buildGatewaySessionEventFields } from "./session-event-payload-Bisnnwx8.js";
import crypto from "node:crypto";
//#region src/cron/command-output-summary.ts
const MAX_PRESERVED_ACTION_LINES = 12;
const ACTION_LINE_PATTERNS = [
	/\b(device|user|verification|authorization|auth|login)\s+code\b/i,
	/\benter\s+(?:the\s+)?(?:code|verification code|device code)\b/i,
	/\bcopy\s+(?:this\s+)?code\b/i,
	/\bvisit\s+(?:https?:\/\/|www\.)/i,
	/\bopen\s+(?:https?:\/\/|www\.)/i,
	/\bbrowser\s+(?:to|at)\s+(?:https?:\/\/|www\.)/i,
	/\blog(?:\s|-)?in\s+(?:at|to|with)\b/i,
	/\bauth(?:enticate|orize)\s+(?:at|with|using)\b/i,
	/\bhttps?:\/\/[^\s]+\/(?:device|activate|login|oauth|authorize|auth)\b/i
];
const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/gi;
const CODE_PATTERN = /\b[A-Z0-9]{4}(?:[- ][A-Z0-9]{3,8}){1,4}\b/g;
const UNSEPARATED_CODE_PATTERN = /\b[A-Z0-9]{6,12}\b/g;
const SECRET_ASSIGNMENT_PATTERN = /\b((?:access|refresh)[_-]?token|api[_-]?key|token|password|secret)\s*([:=])\s*([^\s;&]+)/gi;
function isCronCommandActionCriticalLine(line) {
	const normalized = normalizeOptionalString(line);
	return Boolean(normalized && ACTION_LINE_PATTERNS.some((pattern) => pattern.test(normalized)));
}
function normalizeLines(lines) {
	const result = [];
	for (const line of lines ?? []) {
		const normalized = normalizeOptionalString(line);
		if (normalized && !result.includes(normalized)) result.push(normalized);
		if (result.length >= MAX_PRESERVED_ACTION_LINES) break;
	}
	return result;
}
function trimOutput(value) {
	return normalizeOptionalString(value);
}
function combineOutput(params) {
	const stdout = trimOutput(params.stdout ?? "");
	const stderr = trimOutput(params.stderr ?? "");
	if (stdout && stderr) return `stdout:\n${stdout}\n\nstderr:\n${stderr}`;
	return stdout ?? stderr;
}
function containsLine(haystack, needle) {
	if (!haystack) return false;
	return haystack.split(/\r?\n/).some((line) => line.trim() === needle.trim());
}
function buildCronCommandSummary(params) {
	const tail = combineOutput({
		stdout: params.stdout,
		stderr: params.stderr
	});
	const preserved = [...normalizeLines(params.preservedStdoutLines), ...normalizeLines(params.preservedStderrLines)].filter((line) => !containsLine(tail, line));
	if (preserved.length === 0) return tail;
	const actionBlock = `action-required output preserved:\n${preserved.join("\n")}`;
	return tail ? `${actionBlock}\n\n${tail}` : actionBlock;
}
function cronCommandSummaryNeedsExternalRedaction(summary) {
	if (!summary) return false;
	return summary.split(/\r?\n/).some((line) => line.startsWith("action-required output preserved:") || isCronCommandActionCriticalLine(line));
}
function redactCronCommandSummaryForExternalDelivery(summary) {
	if (!summary || !cronCommandSummaryNeedsExternalRedaction(summary)) return summary;
	return summary.split(/(\r?\n)/).map((part) => {
		if (/^\r?\n$/.test(part) || !isCronCommandActionCriticalLine(part)) return part;
		return redactToolPayloadText(part).replace(SECRET_ASSIGNMENT_PATTERN, (_match, key, separator) => {
			return `${key}${separator}***`;
		}).replace(URL_PATTERN, "[redacted-url]").replace(CODE_PATTERN, "[redacted-code]").replace(UNSEPARATED_CODE_PATTERN, "[redacted-code]");
	}).join("");
}
//#endregion
//#region src/cron/command-runner.ts
const DEFAULT_COMMAND_TIMEOUT_MS = 10 * 6e4;
const EFFECTIVELY_UNBOUNDED_TIMEOUT_MS = 2147483647;
function secondsToMs(value) {
	if (typeof value !== "number") return;
	if (value <= 0) return EFFECTIVELY_UNBOUNDED_TIMEOUT_MS;
	return finiteSecondsToTimerSafeMilliseconds(value) ?? void 0;
}
function formatCommand(argv) {
	return argv.map((arg) => JSON.stringify(arg)).join(" ");
}
function commandErrorMessage(params) {
	if (params.termination === "timeout") return "command timed out";
	if (params.termination === "no-output-timeout") return "command produced no output before noOutputTimeoutSeconds";
	if (params.termination === "signal") return params.signal ? `command stopped by signal ${params.signal}` : "command stopped";
	if (typeof params.code === "number") return `command exited with code ${params.code}`;
	return "command failed";
}
function buildDiagnostics(params) {
	const truncated = Boolean(params.stdoutTruncatedBytes && params.stdoutTruncatedBytes > 0) || Boolean(params.stderrTruncatedBytes && params.stderrTruncatedBytes > 0);
	return {
		...params.summary ? { summary: params.summary } : {},
		entries: [{
			ts: params.nowMs(),
			source: "exec",
			severity: params.status === "ok" ? "info" : "error",
			message: params.summary ? `command ${params.status}: ${params.command}` : `command ${params.status} with no output: ${params.command}`,
			exitCode: params.code,
			truncated,
			...params.signal ? { toolName: `signal:${params.signal}` } : {}
		}]
	};
}
/** Executes a cron command payload without starting an agent/model run. */
async function runCronCommandJob(params) {
	const nowMs = params.nowMs ?? Date.now;
	const { payload } = params.job;
	if (payload.kind !== "command") return {
		status: "skipped",
		error: "command runner requires payload.kind=\"command\""
	};
	if (!Array.isArray(payload.argv) || payload.argv.length === 0) return {
		status: "skipped",
		error: "command payload requires non-empty \"argv\""
	};
	const command = formatCommand(payload.argv);
	const noOutputTimeoutMs = secondsToMs(payload.noOutputTimeoutSeconds);
	try {
		const result = await runCommandWithTimeout(payload.argv, {
			timeoutMs: secondsToMs(payload.timeoutSeconds) ?? DEFAULT_COMMAND_TIMEOUT_MS,
			...payload.cwd ? { cwd: payload.cwd } : {},
			...payload.input !== void 0 ? { input: payload.input } : {},
			...payload.env ? { env: payload.env } : {},
			...noOutputTimeoutMs !== void 0 ? { noOutputTimeoutMs } : {},
			...payload.outputMaxBytes !== void 0 ? { maxOutputBytes: payload.outputMaxBytes } : {},
			preserveOutputLine: isCronCommandActionCriticalLine,
			...params.abortSignal ? { signal: params.abortSignal } : {},
			killProcessTree: true
		});
		const ok = result.code === 0 && !result.killed && result.termination !== "timeout" && result.termination !== "no-output-timeout" && result.termination !== "signal";
		const status = ok ? "ok" : "error";
		const summary = buildCronCommandSummary({
			stdout: result.stdout,
			stderr: result.stderr,
			preservedStdoutLines: result.preservedStdoutLines,
			preservedStderrLines: result.preservedStderrLines
		});
		const error = ok ? void 0 : commandErrorMessage({
			code: result.code,
			signal: result.signal,
			termination: result.termination
		});
		return {
			status,
			...error ? { error } : {},
			...summary ? { summary } : {},
			diagnostics: buildDiagnostics({
				command,
				status,
				summary,
				code: result.code,
				signal: result.signal,
				stdoutTruncatedBytes: result.stdoutTruncatedBytes,
				stderrTruncatedBytes: result.stderrTruncatedBytes,
				nowMs
			})
		};
	} catch (err) {
		const error = err instanceof Error ? err.message : String(err);
		return {
			status: "error",
			error,
			diagnostics: {
				summary: error,
				entries: [{
					ts: nowMs(),
					source: "exec",
					severity: "error",
					message: `command failed to start: ${command}: ${error}`,
					exitCode: null
				}]
			}
		};
	}
}
//#endregion
//#region src/cron/delivery.ts
/** Sends cron announce payloads and best-effort failure notifications. */
const FAILURE_NOTIFICATION_TIMEOUT_MS = 3e4;
const cronDeliveryLogger = getChildLogger({ subsystem: "cron-delivery" });
async function resolveCronAnnounceDelivery(params) {
	const targetResolutionOptions = params.target.inheritSessionThread === false ? { inheritSessionThread: false } : void 0;
	const resolvedTarget = await resolveDeliveryTarget(params.cfg, params.agentId, {
		channel: params.target.channel,
		to: params.target.to,
		threadId: params.target.threadId,
		accountId: params.target.accountId,
		sessionKey: params.target.sessionKey
	}, targetResolutionOptions);
	if (!resolvedTarget.ok) return {
		ok: false,
		error: resolvedTarget.error
	};
	const identity = resolveAgentOutboundIdentity(params.cfg, params.agentId);
	return {
		ok: true,
		resolvedTarget,
		session: buildOutboundSessionContext({
			cfg: params.cfg,
			agentId: params.agentId,
			sessionKey: resolveCronNotificationSessionKey({
				jobId: params.jobId,
				sessionKey: params.target.sessionKey
			})
		}),
		identity
	};
}
async function deliverCronAnnouncePayload(params) {
	const send = await sendDurableMessageBatch({
		cfg: params.cfg,
		channel: params.delivery.resolvedTarget.channel,
		to: params.delivery.resolvedTarget.to,
		accountId: params.delivery.resolvedTarget.accountId,
		threadId: params.delivery.resolvedTarget.threadId,
		payloads: [{ text: params.message }],
		session: params.delivery.session,
		identity: params.delivery.identity,
		bestEffort: false,
		deps: createOutboundSendDeps(params.deps),
		signal: params.abortSignal
	});
	if (send.status === "failed" || send.status === "partial_failed") throw send.error;
}
/** Sends a cron announce payload and throws if target resolution or delivery fails. */
async function sendCronAnnouncePayloadStrict(params) {
	const delivery = await resolveCronAnnounceDelivery(params);
	if (!delivery.ok) throw delivery.error;
	await deliverCronAnnouncePayload({
		deps: params.deps,
		cfg: params.cfg,
		delivery,
		message: params.message,
		abortSignal: params.abortSignal
	});
}
/** Sends a best-effort cron failure notification, logging resolution/send failures. */
async function sendFailureNotificationAnnounce(deps, cfg, agentId, jobId, target, message) {
	const delivery = await resolveCronAnnounceDelivery({
		cfg,
		agentId,
		jobId,
		target
	});
	if (!delivery.ok) {
		cronDeliveryLogger.warn({ error: delivery.error.message }, "cron: failed to resolve failure destination target");
		return;
	}
	const abortController = new AbortController();
	const timeout = setTimeout(() => {
		abortController.abort();
	}, FAILURE_NOTIFICATION_TIMEOUT_MS);
	try {
		await deliverCronAnnouncePayload({
			deps,
			cfg,
			delivery,
			message,
			abortSignal: abortController.signal
		});
	} catch (err) {
		cronDeliveryLogger.warn({
			err: formatErrorMessage(err),
			channel: delivery.resolvedTarget.channel,
			to: delivery.resolvedTarget.to
		}, "cron: failure destination announce failed");
	} finally {
		clearTimeout(timeout);
	}
}
//#endregion
//#region src/cron/trigger-script.ts
const MAX_CONCURRENT_TRIGGER_EVALS = 3;
const MAX_TRIGGER_STATE_BYTES = 16 * 1024;
const MAX_CACHED_TRIGGER_RUNTIMES = 128;
const HEADLESS_TRIGGER_WALL_CLOCK_MS = 3e4;
const HEADLESS_TRIGGER_TOOL_BUDGET = 5;
let activeTriggerEvaluations = 0;
function resolveTriggerAgentId(config, agentId) {
	return agentId?.trim() ? normalizeAgentId(agentId) : resolveDefaultAgentId(config);
}
async function prepareTriggerRuntime(params) {
	params.signal?.throwIfAborted();
	const agentId = resolveTriggerAgentId(params.runtimeConfig, params.agentId);
	const selectedAgentConfig = resolveAgentConfig(params.runtimeConfig, agentId);
	const agentConfigOverride = params.agentId?.trim() ? selectedAgentConfig : void 0;
	const agentDefaults = buildCronAgentDefaultsConfig({
		defaults: params.runtimeConfig.agents?.defaults,
		agentConfigOverride
	});
	const config = {
		...params.runtimeConfig,
		agents: Object.assign({}, params.runtimeConfig.agents, { defaults: agentDefaults })
	};
	const workspaceDirRaw = resolveAgentWorkspaceDir(config, agentId);
	const agentDir = resolveAgentDir(config, agentId);
	const workspace = await ensureAgentWorkspace({
		dir: workspaceDirRaw,
		ensureBootstrapFiles: !agentDefaults.skipBootstrap,
		skipOptionalBootstrapFiles: agentDefaults.skipOptionalBootstrapFiles
	});
	params.signal?.throwIfAborted();
	const workspaceDir = workspace.dir;
	ensureRuntimePluginsLoaded({
		config,
		workspaceDir,
		allowGatewaySubagentBinding: true
	});
	const sessionKey = resolveCronAgentSessionKey({
		sessionKey: `cron:${params.jobId}:trigger`,
		agentId,
		mainKey: config.session?.mainKey,
		cfg: config
	});
	const sandbox = await resolveSandboxContext({
		config,
		sessionKey,
		workspaceDir
	});
	params.signal?.throwIfAborted();
	const effectiveWorkspace = sandbox?.enabled && sandbox.workspaceAccess !== "rw" ? sandbox.workspaceDir : workspaceDir;
	const toolPlan = resolveEmbeddedAttemptToolConstructionPlan({
		toolsEnabled: true,
		toolsAllow: params.toolsAllow
	});
	return {
		tools: applyEmbeddedAttemptToolsAllow(toolPlan.constructTools ? createOpenClawCodingTools({
			agentId,
			exec: { config },
			sandbox,
			sessionKey,
			trigger: "cron",
			jobId: params.jobId,
			agentDir,
			cwd: effectiveWorkspace,
			workspaceDir: effectiveWorkspace,
			spawnWorkspaceDir: workspaceDir,
			config,
			allowGatewaySubagentBinding: true,
			includeCoreTools: toolPlan.includeCoreTools,
			runtimeToolAllowlist: toolPlan.runtimeToolAllowlist,
			toolConstructionPlan: toolPlan.codingToolConstructionPlan
		}) : [], params.toolsAllow, { toolMeta: (tool) => getPluginToolMeta(tool) }),
		hookContext: {
			agentId,
			config,
			cwd: effectiveWorkspace,
			workspaceDir: effectiveWorkspace,
			sessionKey,
			loopDetection: resolveToolLoopDetectionConfig({
				cfg: config,
				agentId
			})
		},
		ctx: {
			config,
			runtimeConfig: config,
			agentId,
			sessionKey
		}
	};
}
function triggerStateNamespace(state) {
	return {
		id: "cron:trigger",
		globalName: "trigger",
		scope: {
			kind: "object",
			entries: [["state", {
				kind: "value",
				value: state
			}]]
		}
	};
}
function triggerResultCandidate(result) {
	if (isRecord(result.value) && typeof result.value.fire === "boolean") return result.value;
	for (let index = result.output.length - 1; index >= 0; index -= 1) {
		const entry = result.output[index];
		if (isRecord(entry) && entry.type === "json") return entry.value;
	}
}
function scriptPayloadResultCandidate(result) {
	if (isRecord(result.value)) return result.value;
	for (let index = result.output.length - 1; index >= 0; index -= 1) {
		const entry = result.output[index];
		if (isRecord(entry) && entry.type === "json") return entry.value;
	}
}
function parseTriggerResult(result) {
	const candidate = triggerResultCandidate(result);
	if (!isRecord(candidate) || typeof candidate.fire !== "boolean") return {
		kind: "error",
		code: "internal_error",
		error: "cron trigger script must return an object with boolean fire"
	};
	if (candidate.message !== void 0 && typeof candidate.message !== "string") return {
		kind: "error",
		code: "internal_error",
		error: "cron trigger script message must be a string"
	};
	const state = validateCronState(candidate, "cron trigger");
	if (!state.ok) return {
		kind: "error",
		code: state.code,
		error: state.error
	};
	return {
		kind: "evaluated",
		fire: candidate.fire,
		...typeof candidate.message === "string" ? { message: candidate.message } : {},
		...state.stateChanged ? { state: state.state } : {}
	};
}
function createHeadlessDeadlineScope(params) {
	const controller = new AbortController();
	const onExternalAbort = () => controller.abort(new CodeModeHeadlessAbortError(`${params.label} aborted`));
	params.externalSignal?.addEventListener("abort", onExternalAbort, { once: true });
	if (params.externalSignal?.aborted) onExternalAbort();
	const timer = setTimeout(() => controller.abort(new CodeModeHeadlessTimeoutError(`${params.label} timed out`)), params.wallClockMs);
	return {
		deadline: Date.now() + params.wallClockMs,
		signal: controller.signal,
		cleanup: () => {
			clearTimeout(timer);
			params.externalSignal?.removeEventListener("abort", onExternalAbort);
		}
	};
}
async function awaitTriggerSignal(promise, signal) {
	if (signal.aborted) throw signal.reason instanceof Error ? signal.reason : new CodeModeHeadlessAbortError();
	let onAbort;
	try {
		const aborted = new Promise((_resolve, reject) => {
			onAbort = () => reject(signal.reason instanceof Error ? signal.reason : new CodeModeHeadlessAbortError());
			signal.addEventListener("abort", onAbort, { once: true });
		});
		return await Promise.race([promise, aborted]);
	} finally {
		if (onAbort) signal.removeEventListener("abort", onAbort);
	}
}
function createCronCodeModeRunner(deps) {
	const runHeadless = deps.runHeadless ?? runCodeModeScriptHeadless;
	const prepareRuntime = deps.prepareRuntime ?? prepareTriggerRuntime;
	const runtimeCache = /* @__PURE__ */ new Map();
	const trimRuntimeCache = () => {
		while (runtimeCache.size > MAX_CACHED_TRIGGER_RUNTIMES) {
			const oldestJobId = runtimeCache.keys().next().value;
			if (oldestJobId === void 0) return;
			runtimeCache.delete(oldestJobId);
		}
	};
	const resolveCachedRuntime = async (request) => {
		const cached = runtimeCache.get(request.jobId);
		if (cached && cached.configEpoch === request.runtimeConfig && cached.agentId === request.agentId && cached.toolsAllowKey === request.toolsAllowKey) {
			runtimeCache.delete(request.jobId);
			runtimeCache.set(request.jobId, cached);
			try {
				return await awaitTriggerSignal(cached.promise, request.signal);
			} catch (error) {
				if ((error instanceof CodeModeHeadlessAbortError || error instanceof CodeModeHeadlessTimeoutError) && !request.signal.aborted) {
					if (runtimeCache.get(request.jobId) === cached) runtimeCache.delete(request.jobId);
					return await resolveCachedRuntime(request);
				}
				throw error;
			}
		}
		const promise = prepareRuntime({
			runtimeConfig: request.runtimeConfig,
			jobId: request.jobId,
			agentId: request.requestedAgentId,
			toolsAllow: request.toolsAllow,
			signal: request.signal
		});
		const entry = {
			promise,
			configEpoch: request.runtimeConfig,
			agentId: request.agentId,
			toolsAllowKey: request.toolsAllowKey
		};
		runtimeCache.delete(request.jobId);
		runtimeCache.set(request.jobId, entry);
		trimRuntimeCache();
		promise.catch(() => {
			if (runtimeCache.get(request.jobId) === entry) runtimeCache.delete(request.jobId);
		});
		return await awaitTriggerSignal(entry.promise, request.signal);
	};
	return async function runCronCodeModeScript(params) {
		const evaluationScope = createHeadlessDeadlineScope({
			externalSignal: params.abortSignal,
			wallClockMs: params.wallClockMs,
			label: params.label
		});
		try {
			const runtimeConfig = resolveCronActiveRuntimeConfig(deps.config);
			const agentId = resolveTriggerAgentId(runtimeConfig, params.agentId);
			const toolsAllowKey = JSON.stringify(params.toolsAllow ?? null);
			const runtime = await resolveCachedRuntime({
				runtimeConfig,
				jobId: params.jobId,
				requestedAgentId: params.agentId,
				agentId,
				toolsAllow: params.toolsAllow,
				toolsAllowKey,
				signal: evaluationScope.signal
			});
			const catalogRef = createToolSearchCatalogRef();
			const runId = `cron-trigger:${params.jobId}:${crypto.randomUUID()}`;
			registerHeadlessToolSearchCatalog({
				catalogRef,
				tools: runtime.tools,
				hookContext: {
					...runtime.hookContext,
					runId
				}
			});
			const remainingWallClockMs = evaluationScope.deadline - Date.now();
			if (remainingWallClockMs <= 0) throw new CodeModeHeadlessTimeoutError(`${params.label} timed out`);
			const result = await runHeadless({
				ctx: {
					...runtime.ctx,
					catalogRef,
					abortSignal: evaluationScope.signal
				},
				code: params.script,
				wallClockMs: remainingWallClockMs,
				maxToolCalls: params.maxToolCalls,
				extraNamespaces: params.namespaces,
				signal: evaluationScope.signal
			});
			if (result.status === "failed") return {
				kind: "error",
				code: result.code,
				error: result.error
			};
			return {
				kind: "completed",
				result
			};
		} catch (error) {
			return {
				kind: "error",
				code: error instanceof CodeModeHeadlessTimeoutError ? "timeout" : error instanceof CodeModeHeadlessAbortError ? "aborted" : "internal_error",
				error: error instanceof Error ? error.message : String(error)
			};
		} finally {
			evaluationScope.cleanup();
		}
	};
}
function validateCronState(candidate, label) {
	if (!Object.hasOwn(candidate, "state")) return {
		ok: true,
		stateChanged: false
	};
	let serialized;
	try {
		serialized = JSON.stringify(candidate.state);
	} catch (error) {
		return {
			ok: false,
			code: "internal_error",
			error: `${label} state is not JSON-serializable: ${String(error)}`
		};
	}
	if (serialized === void 0) return {
		ok: false,
		code: "internal_error",
		error: `${label} state is not JSON-serializable`
	};
	if (Buffer.byteLength(serialized, "utf8") > MAX_TRIGGER_STATE_BYTES) return {
		ok: false,
		code: "output_limit_exceeded",
		error: `${label} state exceeds the 16KB limit`
	};
	return {
		ok: true,
		stateChanged: true,
		state: JSON.parse(serialized)
	};
}
function parseScriptPayloadResult(result) {
	const candidate = scriptPayloadResultCandidate(result);
	if (!isRecord(candidate)) return {
		kind: "error",
		code: "internal_error",
		error: "cron script payload must return an object"
	};
	if (candidate.notify !== void 0 && typeof candidate.notify !== "string") return {
		kind: "error",
		code: "internal_error",
		error: "cron script payload notify must be a string"
	};
	if (candidate.wake !== void 0 && candidate.wake !== "now" && candidate.wake !== "next-heartbeat") return {
		kind: "error",
		code: "internal_error",
		error: "cron script payload wake must be \"now\" or \"next-heartbeat\""
	};
	let nextCheck;
	if (candidate.nextCheck !== void 0) {
		if (typeof candidate.nextCheck !== "string") return {
			kind: "error",
			code: "internal_error",
			error: "cron script payload nextCheck must be a duration string"
		};
		try {
			const delayMs = parseDurationMs(candidate.nextCheck);
			if (delayMs <= 0) throw new Error("duration must be positive");
			nextCheck = { delayMs };
		} catch {
			return {
				kind: "error",
				code: "internal_error",
				error: "cron script payload nextCheck must be a positive duration"
			};
		}
	}
	const state = validateCronState(candidate, "cron script payload");
	if (!state.ok) return {
		kind: "error",
		code: state.code,
		error: state.error
	};
	return {
		kind: "completed",
		...candidate.notify !== void 0 ? { notify: candidate.notify } : {},
		...candidate.wake !== void 0 ? { wake: candidate.wake } : {},
		stateChanged: state.stateChanged,
		...state.stateChanged ? { state: state.state } : {},
		...nextCheck ? { nextCheck } : {}
	};
}
function createCronScriptRuntime(deps) {
	const run = createCronCodeModeRunner(deps);
	return {
		evaluateTrigger: async (params) => {
			if (activeTriggerEvaluations >= MAX_CONCURRENT_TRIGGER_EVALS) return { kind: "busy" };
			activeTriggerEvaluations += 1;
			try {
				const outcome = await run({
					...params,
					wallClockMs: HEADLESS_TRIGGER_WALL_CLOCK_MS,
					maxToolCalls: HEADLESS_TRIGGER_TOOL_BUDGET,
					label: "cron trigger evaluation",
					namespaces: [triggerStateNamespace(params.state)]
				});
				return outcome.kind === "completed" ? parseTriggerResult(outcome.result) : outcome;
			} finally {
				activeTriggerEvaluations -= 1;
			}
		},
		executePayload: async (params) => {
			const timeoutSeconds = Math.min(900, Math.max(1, Math.floor(params.timeoutSeconds ?? 300)));
			const toolBudget = Math.min(200, Math.max(1, Math.floor(params.toolBudget ?? 50)));
			const outcome = await run({
				...params,
				wallClockMs: timeoutSeconds * 1e3,
				maxToolCalls: toolBudget,
				label: "cron script payload",
				namespaces: [triggerStateNamespace(params.state)]
			});
			return outcome.kind === "completed" ? parseScriptPayloadResult(outcome.result) : outcome;
		}
	};
}
//#endregion
//#region src/gateway/cron-exit-watch-shell.ts
/** Resolve the native shell used for watched commands on each gateway platform. */
function resolveExitWatchShell(platform = process.platform) {
	if (platform === "win32") return {
		command: process.env.ComSpec?.trim() || "cmd.exe",
		argsFor: (command) => [
			"/d",
			"/s",
			"/c",
			command
		]
	};
	return {
		command: "bash",
		argsFor: (command) => ["-lc", command]
	};
}
//#endregion
//#region src/gateway/cron-exit-watchers.ts
/**
* Safety bound for a watched command, so a hung/never-exiting command cannot
* keep a gateway-owned process alive forever. Generous (24h) because on-exit
* legitimately watches long-running commands (builds, deploys); on timeout the
* watch ends and the job fires like any other exit.
*/
const ON_EXIT_WATCH_TIMEOUT_MS = 1440 * 60 * 1e3;
const SCOPE_PREFIX = "cron-exit";
function scopeKey(jobId) {
	return `${SCOPE_PREFIX}:${jobId}`;
}
function isWatchableExitJob(job) {
	return job.enabled && job.schedule.kind === "on-exit";
}
function createCronExitWatchers(params) {
	const shell = params.shell ?? resolveExitWatchShell();
	const active = /* @__PURE__ */ new Map();
	const settlingCancelledSlots = /* @__PURE__ */ new Set();
	const cancel = (jobId) => {
		const slot = active.get(jobId);
		if (!slot) return;
		slot.cancelled = true;
		if (!slot.lifecycleSettled) settlingCancelledSlots.add(slot);
		if (!slot.terminalPersisting) active.delete(jobId);
		slot.run?.cancel("manual-cancel");
		try {
			params.getProcessSupervisor().cancelScope(scopeKey(jobId), "manual-cancel");
		} catch (err) {
			params.logger.warn({
				err: String(err),
				jobId
			}, "cron-exit: cancel watcher failed");
		}
	};
	const arm = (job) => {
		const command = job.schedule.command;
		const cwd = job.schedule.cwd;
		const armToken = {};
		const slot = {
			armToken,
			job,
			run: void 0,
			fired: false,
			terminalPersisting: false,
			cancelled: false,
			lifecycleSettled: false,
			command,
			cwd
		};
		active.set(job.id, slot);
		const owns = () => active.get(job.id) === slot && slot.armToken === armToken;
		(async () => {
			let run;
			try {
				run = await params.getProcessSupervisor().spawn({
					sessionId: `cron-exit:${job.id}`,
					backendId: "cron-exit-watch",
					scopeKey: scopeKey(job.id),
					replaceExistingScope: true,
					mode: "child",
					argv: [shell.command, ...shell.argsFor(command)],
					...cwd ? { cwd } : {},
					env: markOpenClawExecEnv({ ...process.env }),
					timeoutMs: ON_EXIT_WATCH_TIMEOUT_MS,
					captureOutput: true
				});
			} catch (err) {
				if (owns()) active.delete(job.id);
				params.logger.warn({
					err: String(err),
					jobId: job.id
				}, "cron-exit: watcher spawn failed");
				return;
			}
			if (!owns()) {
				run.cancel("manual-cancel");
				try {
					await run.wait();
				} catch {}
				return;
			}
			slot.run = run;
			params.logger.info({
				jobId: job.id,
				runId: run.runId,
				command
			}, "cron-exit: watcher armed");
			let exit;
			try {
				exit = await run.wait();
			} catch (err) {
				if (owns()) active.delete(job.id);
				params.logger.warn({
					err: String(err),
					jobId: job.id
				}, "cron-exit: run.wait() rejected; released watcher slot without firing");
				return;
			}
			if (!owns()) return;
			params.logger.info({
				jobId: job.id,
				exitCode: exit.exitCode,
				reason: exit.reason
			}, "cron-exit: watched command exited; firing job");
			slot.terminalPersisting = true;
			try {
				await params.persistCompletion(job.id);
			} catch (err) {
				if (owns()) active.delete(job.id);
				params.logger.warn({
					err: String(err),
					jobId: job.id
				}, "cron-exit: persistCompletion failed; NOT firing (fail closed to avoid replay)");
				return;
			}
			slot.terminalPersisting = false;
			if (!owns() || slot.cancelled) {
				if (active.get(job.id) === slot) active.delete(job.id);
				return;
			}
			slot.fired = true;
			try {
				await params.fireOnExit(slot.job, {
					exitCode: exit.exitCode,
					reason: exit.reason,
					stdout: exit.stdout,
					stderr: exit.stderr,
					timedOut: exit.timedOut,
					noOutputTimedOut: exit.noOutputTimedOut
				});
			} catch (err) {
				params.logger.warn({
					err: String(err),
					jobId: job.id
				}, "cron-exit: fireOnExit after exit failed");
			}
		})().finally(() => {
			slot.lifecycleSettled = true;
			settlingCancelledSlots.delete(slot);
			if (slot.cancelled && active.get(job.id) === slot) active.delete(job.id);
		});
	};
	const reconcile = (jobs) => {
		const want = new Map(jobs.filter(isWatchableExitJob).map((j) => [j.id, j]));
		for (const jobId of Array.from(active.keys())) if (!want.has(jobId)) cancel(jobId);
		for (const [jobId, job] of want) {
			const slot = active.get(jobId);
			if (slot) {
				if (slot.fired) continue;
				const { command, cwd } = job.schedule;
				if (slot.command === command && slot.cwd === cwd) {
					slot.job = job;
					continue;
				}
				cancel(jobId);
			}
			arm(job);
		}
	};
	const cancelAll = () => {
		for (const jobId of Array.from(active.keys())) cancel(jobId);
	};
	return {
		reconcile,
		cancel,
		cancelAll,
		activeJobIds: () => Array.from(/* @__PURE__ */ new Set([...Array.from(active.entries()).filter(([, slot]) => !slot.fired).map(([jobId]) => jobId), ...Array.from(settlingCancelledSlots, (slot) => slot.job.id)]))
	};
}
//#endregion
//#region src/gateway/server-cron-notifications.ts
const CRON_WEBHOOK_TIMEOUT_MS = 1e4;
function redactWebhookUrl(url) {
	try {
		const parsed = new URL(url);
		return `${parsed.origin}${parsed.pathname}`;
	} catch {
		return "<invalid-webhook-url>";
	}
}
function redactOptionalWebhookUrl(url) {
	const normalized = normalizeOptionalString(url);
	return normalized ? redactWebhookUrl(normalized) : void 0;
}
function redactCommandCronEventForExternalDelivery(evt, job) {
	if (job?.payload.kind !== "command") return evt;
	const summary = redactCronCommandSummaryForExternalDelivery(evt.summary);
	const diagnosticsSummary = redactCronCommandSummaryForExternalDelivery(evt.diagnostics?.summary);
	const diagnosticsEntries = evt.diagnostics?.entries.map((entry) => ({
		...entry,
		message: redactCronCommandSummaryForExternalDelivery(entry.message) ?? entry.message
	}));
	const diagnosticsEntriesChanged = diagnosticsEntries?.some((entry, index) => entry.message !== evt.diagnostics?.entries[index]?.message);
	const embeddedJobState = evt.job?.state;
	const stripEmbeddedJobDiagnostics = Boolean(embeddedJobState && ("lastDiagnostics" in embeddedJobState || "lastDiagnosticSummary" in embeddedJobState));
	if (summary === evt.summary && diagnosticsSummary === evt.diagnostics?.summary && !diagnosticsEntriesChanged && !stripEmbeddedJobDiagnostics) return evt;
	const redacted = { ...evt };
	if (summary !== void 0) redacted.summary = summary;
	else delete redacted.summary;
	if (evt.diagnostics) {
		redacted.diagnostics = { ...evt.diagnostics };
		if (diagnosticsSummary !== void 0) redacted.diagnostics.summary = diagnosticsSummary;
		else delete redacted.diagnostics.summary;
		if (diagnosticsEntries) redacted.diagnostics.entries = diagnosticsEntries;
	}
	if (stripEmbeddedJobDiagnostics && evt.job) {
		const state = { ...evt.job.state };
		delete state.lastDiagnostics;
		delete state.lastDiagnosticSummary;
		redacted.job = {
			...evt.job,
			state
		};
	}
	return redacted;
}
/** Resolves direct webhook delivery and completion-destination webhooks. */
function resolveCronWebhookTargets(params) {
	const targets = [];
	const mode = normalizeOptionalLowercaseString(params.delivery?.mode);
	if (mode === "webhook") {
		const url = normalizeHttpWebhookUrl(params.delivery?.to);
		if (url) targets.push({
			url,
			source: "delivery"
		});
	}
	const completionMode = normalizeOptionalLowercaseString(params.delivery?.completionDestination?.mode);
	if (mode === "announce" && completionMode === "webhook") {
		const url = normalizeHttpWebhookUrl(params.delivery?.completionDestination?.to);
		if (url && targets.every((target) => target.url !== url)) targets.push({
			url,
			source: "completionDestination"
		});
	}
	return targets;
}
function buildCronWebhookHeaders(webhookToken) {
	const headers = { "Content-Type": "application/json" };
	if (webhookToken) headers.Authorization = `Bearer ${webhookToken}`;
	return headers;
}
function buildCronFailureWebhookPayload(params) {
	const failureMessage = `Cron job "${params.job.name}" failed: ${params.evt.error ?? "unknown error"}`;
	return {
		jobId: params.job.id,
		jobName: params.job.name,
		message: failureMessage,
		status: params.evt.status,
		error: params.evt.error,
		runAtMs: params.evt.runAtMs,
		durationMs: params.evt.durationMs,
		nextRunAtMs: params.evt.nextRunAtMs
	};
}
function buildCronFinishedWebhookPayload(evt) {
	if (evt.status !== "error") return evt;
	const { summary: _summary, diagnostics: _diagnostics, ...payload } = evt;
	if (evt.job) {
		const state = { ...evt.job.state };
		delete state.lastDiagnostics;
		delete state.lastDiagnosticSummary;
		return {
			...payload,
			job: {
				...evt.job,
				state
			}
		};
	}
	return payload;
}
/** Posts a cron webhook without throwing back into scheduler completion flow. */
async function postCronWebhook(params) {
	const abortController = new AbortController();
	const timeout = setTimeout(() => {
		abortController.abort();
	}, CRON_WEBHOOK_TIMEOUT_MS);
	try {
		assertSecretOwnerAvailable("capability", "cron-webhook");
		await (await fetchWithSsrFGuard({
			url: params.webhookUrl,
			init: {
				method: "POST",
				headers: buildCronWebhookHeaders(params.webhookToken),
				body: JSON.stringify(params.payload),
				signal: abortController.signal
			}
		})).release();
	} catch (err) {
		if (err instanceof SsrFBlockedError) params.logger.warn({
			...params.logContext,
			reason: formatErrorMessage(err),
			webhookUrl: redactWebhookUrl(params.webhookUrl)
		}, params.blockedLog);
		else params.logger.warn({
			...params.logContext,
			err: formatErrorMessage(err),
			webhookUrl: redactWebhookUrl(params.webhookUrl)
		}, params.failedLog);
	} finally {
		clearTimeout(timeout);
	}
}
/** Detached sends outlive cron ticks; own roots block mid-delivery suspension snapshots. */
function dispatchDetachedCronNotification(params) {
	runWithGatewayIndependentRootWorkAdmission(params.deliver).catch((err) => {
		params.logger.warn({
			jobId: params.jobId,
			err: formatErrorMessage(err)
		}, "cron: detached notification delivery failed");
	});
}
/** Sends the immediate failure alert for cron jobs that failed before normal completion delivery. */
async function sendGatewayCronFailureAlert(params) {
	await runWithGatewayIndependentRootWorkAdmission(async () => {
		await sendGatewayCronFailureAlertUnderAdmission(params);
	});
}
async function sendGatewayCronFailureAlertUnderAdmission(params) {
	const { agentId, cfg: runtimeConfig } = params.resolveCronAgent(params.job.agentId);
	const webhookToken = normalizeOptionalString(params.webhookToken);
	if (params.mode === "webhook" && !params.to) {
		params.logger.warn({ jobId: params.job.id }, "cron: failure alert webhook mode requires URL, skipping");
		return;
	}
	if (params.mode === "webhook" && params.to) {
		const webhookUrl = normalizeHttpWebhookUrl(params.to);
		if (webhookUrl) await postCronWebhook({
			webhookUrl,
			webhookToken,
			payload: {
				jobId: params.job.id,
				jobName: params.job.name,
				message: params.text
			},
			logContext: { jobId: params.job.id },
			blockedLog: "cron: failure alert webhook blocked by SSRF guard",
			failedLog: "cron: failure alert webhook failed",
			logger: params.logger
		});
		else params.logger.warn({
			jobId: params.job.id,
			webhookUrl: redactWebhookUrl(params.to)
		}, "cron: failure alert webhook URL is invalid, skipping");
		return;
	}
	const abortController = new AbortController();
	await sendCronAnnouncePayloadStrict({
		deps: params.deps,
		cfg: runtimeConfig,
		agentId,
		jobId: params.job.id,
		target: {
			channel: params.channel,
			to: params.to,
			accountId: params.accountId,
			sessionKey: resolveCronDeliverySessionKey(params.job)
		},
		message: params.text,
		abortSignal: abortController.signal
	});
}
/** Dispatches completion and failure-destination notifications after a cron run finishes. */
function dispatchGatewayCronFinishedNotifications(params) {
	const webhookToken = normalizeOptionalString(params.webhookToken);
	const redactedWebhookEvent = redactCommandCronEventForExternalDelivery(params.evt, params.job);
	const completionSummary = params.job?.payload.kind === "script" ? normalizeOptionalString(redactedWebhookEvent.summary) : params.evt.summary;
	const webhookTargets = resolveCronWebhookTargets({ delivery: params.job?.delivery && typeof params.job.delivery.mode === "string" ? {
		mode: params.job.delivery.mode,
		to: params.job.delivery.to,
		completionDestination: params.job.delivery.completionDestination
	} : void 0 });
	if (params.job?.delivery?.completionDestination?.mode === "webhook" && !normalizeHttpWebhookUrl(params.job.delivery.completionDestination.to)) params.logger.warn({
		jobId: params.evt.jobId,
		deliveryTo: redactOptionalWebhookUrl(params.job.delivery.completionDestination.to)
	}, "cron: skipped completion webhook delivery, delivery.completionDestination.to must be a valid http(s) URL");
	if (!webhookTargets.some((target) => target.source === "delivery") && params.job?.delivery?.mode === "webhook") params.logger.warn({
		jobId: params.evt.jobId,
		deliveryTo: redactOptionalWebhookUrl(params.job.delivery.to)
	}, "cron: skipped webhook delivery, delivery.to must be a valid http(s) URL");
	if (completionSummary) for (const webhookTarget of webhookTargets) {
		const payload = buildCronFinishedWebhookPayload(redactedWebhookEvent);
		dispatchDetachedCronNotification({
			jobId: params.evt.jobId,
			logger: params.logger,
			deliver: () => postCronWebhook({
				webhookUrl: webhookTarget.url,
				webhookToken,
				payload,
				logContext: {
					jobId: params.evt.jobId,
					source: webhookTarget.source
				},
				blockedLog: "cron: webhook delivery blocked by SSRF guard",
				failedLog: "cron: webhook delivery failed",
				logger: params.logger
			})
		});
	}
	dispatchCronFailureDestinationNotifications({
		evt: params.evt,
		job: params.job,
		deps: params.deps,
		logger: params.logger,
		resolveCronAgent: params.resolveCronAgent,
		webhookToken,
		globalFailureDestination: params.globalFailureDestination
	});
}
function dispatchCronFailureDestinationNotifications(params) {
	if (params.evt.status !== "error" || !params.job || params.job.delivery?.bestEffort === true) return;
	const job = params.job;
	const failureDest = resolveFailureDestination(job, params.globalFailureDestination);
	const deliverySessionKey = resolveCronDeliverySessionKey(job);
	const failurePayload = buildCronFailureWebhookPayload({
		evt: params.evt,
		job
	});
	if (failureDest) {
		if (failureDest.mode === "webhook" && failureDest.to) {
			const webhookUrl = normalizeHttpWebhookUrl(failureDest.to);
			if (webhookUrl) dispatchDetachedCronNotification({
				jobId: params.evt.jobId,
				logger: params.logger,
				deliver: () => postCronWebhook({
					webhookUrl,
					webhookToken: params.webhookToken,
					payload: failurePayload,
					logContext: { jobId: params.evt.jobId },
					blockedLog: "cron: failure destination webhook blocked by SSRF guard",
					failedLog: "cron: failure destination webhook failed",
					logger: params.logger
				})
			});
			else params.logger.warn({
				jobId: params.evt.jobId,
				webhookUrl: redactWebhookUrl(failureDest.to)
			}, "cron: failure destination webhook URL is invalid, skipping");
			return;
		}
		if (failureDest.mode === "announce") {
			const { agentId, cfg: runtimeConfig } = params.resolveCronAgent(job.agentId);
			dispatchDetachedCronNotification({
				jobId: job.id,
				logger: params.logger,
				deliver: () => sendFailureNotificationAnnounce(params.deps, runtimeConfig, agentId, job.id, {
					channel: failureDest.channel,
					to: failureDest.to,
					accountId: failureDest.accountId,
					sessionKey: deliverySessionKey,
					inheritSessionThread: false
				}, `⚠️ ${failurePayload.message}`)
			});
		}
		return;
	}
	const primaryPlan = resolveCronDeliveryPlan(job);
	if (primaryPlan.mode !== "announce" || !primaryPlan.requested) return;
	const { agentId, cfg: runtimeConfig } = params.resolveCronAgent(job.agentId);
	dispatchDetachedCronNotification({
		jobId: job.id,
		logger: params.logger,
		deliver: () => sendFailureNotificationAnnounce(params.deps, runtimeConfig, agentId, job.id, {
			channel: primaryPlan.channel,
			to: primaryPlan.to,
			accountId: primaryPlan.accountId,
			sessionKey: deliverySessionKey
		}, `⚠️ ${failurePayload.message}`)
	});
}
//#endregion
//#region src/gateway/server-cron.ts
function formatOnExitRunSummary(exit) {
	const lines = [
		"Watched command finished.",
		`Exit code: ${exit.exitCode ?? "none"}`,
		`Reason: ${exit.reason}`
	];
	const output = buildCronCommandSummary({
		stdout: exit.stdout,
		stderr: exit.stderr
	});
	return output ? `${lines.join("\n")}\n\nOutput:\n${output}` : lines.join("\n");
}
function addOnExitRunSummary(payload, exit) {
	const summary = formatOnExitRunSummary(exit);
	if (payload.kind === "systemEvent") return {
		...payload,
		text: `${payload.text}\n\n${summary}`
	};
	if (payload.kind === "agentTurn") return {
		...payload,
		message: `${payload.message}\n\n${summary}`
	};
	return payload;
}
/**
* On-exit jobs use the normal force-run path so every payload kind records
* run state, history, notifications, and delivery outcomes consistently.
*/
async function fireOnExitJob(job, exit, deps) {
	const payload = addOnExitRunSummary(job.payload, exit);
	await deps.run(job.id, payload === job.payload ? void 0 : payload);
}
function reconcileCronExitWatchers(params) {
	if (!params.cronEnabled) {
		params.exitWatchers.cancelAll();
		return;
	}
	params.exitWatchers.reconcile(params.jobs);
}
/** Pick only the keys whose values are not `undefined` from an object. */
function pickDefined(obj, keys) {
	const result = {};
	for (const k of keys) if (obj[k] !== void 0) result[k] = obj[k];
	return result;
}
function omitExplicitHeartbeatDestination(heartbeat) {
	if (!heartbeat) return;
	return {
		...heartbeat,
		to: void 0,
		accountId: void 0
	};
}
function sanitizeCronHeartbeatOverride(heartbeat) {
	return heartbeat?.target === "last" ? omitExplicitHeartbeatDestination(heartbeat) : heartbeat;
}
/** Map internal CronJob to the public plugin SDK shape. */
function toPluginCronJob(job) {
	return {
		id: job.id,
		agentId: job.agentId,
		name: job.name,
		description: job.description,
		enabled: job.enabled,
		schedule: job.schedule ? structuredClone(job.schedule) : void 0,
		sessionTarget: job.sessionTarget,
		wakeMode: job.wakeMode,
		payload: job.payload ? structuredClone(job.payload) : void 0,
		state: {
			nextRunAtMs: job.state.nextRunAtMs,
			runningAtMs: job.state.runningAtMs,
			lastRunAtMs: job.state.lastRunAtMs,
			lastRunStatus: job.state.lastRunStatus,
			lastError: job.state.lastError,
			lastDurationMs: job.state.lastDurationMs,
			lastDelivered: job.state.lastDelivered,
			lastDeliveryStatus: job.state.lastDeliveryStatus,
			lastDeliveryError: job.state.lastDeliveryError,
			lastFailureNotificationDelivered: job.state.lastFailureNotificationDelivered,
			lastFailureNotificationDeliveryStatus: job.state.lastFailureNotificationDeliveryStatus,
			lastFailureNotificationDeliveryError: job.state.lastFailureNotificationDeliveryError
		},
		createdAtMs: job.createdAtMs,
		updatedAtMs: job.updatedAtMs
	};
}
function isCommandCronJob(job) {
	return job?.payload?.kind === "command";
}
/** Build the cron service state used by Gateway startup and lazy cron loading. */
function buildGatewayCronService(params) {
	const cronLogger = getChildLogger({ module: "cron" });
	const env = params.env ?? process.env;
	const storePath = resolveCronJobsStorePath(params.cfg.cron?.store, env);
	const cronEnabled = env.OPENCLAW_SKIP_CRON !== "1" && params.cfg.cron?.enabled !== false;
	const findAgentEntry = (cfg, agentId) => Array.isArray(cfg.agents?.list) ? cfg.agents.list.find((entry) => entry && typeof entry.id === "string" && normalizeAgentId(entry.id) === agentId) : void 0;
	const hasConfiguredAgent = (cfg, agentId) => Boolean(findAgentEntry(cfg, agentId));
	const resolveCronAgent = (requested) => {
		const runtimeConfig = getRuntimeConfig();
		const normalized = typeof requested === "string" && requested.trim() ? normalizeAgentId(requested) : void 0;
		const defaultAgentId = resolveDefaultAgentId(runtimeConfig);
		if (normalized !== void 0 && normalized !== defaultAgentId && !hasConfiguredAgent(runtimeConfig, normalized)) throw new Error(`cron job agent is unavailable: ${normalized}`);
		const agentId = normalized ?? defaultAgentId;
		if (isAgentDeletionBlocked(agentId)) throw new Error(`cron job agent is unavailable: ${agentId}`);
		return {
			agentId,
			cfg: runtimeConfig
		};
	};
	const resolveCronSessionKey = (paramsValue) => {
		const requested = paramsValue.requestedSessionKey?.trim();
		if (!requested) return resolveAgentMainSessionKey({
			cfg: paramsValue.runtimeConfig,
			agentId: paramsValue.agentId
		});
		const candidate = toAgentStoreSessionKey({
			agentId: paramsValue.agentId,
			requestKey: requested,
			mainKey: paramsValue.runtimeConfig.session?.mainKey
		});
		const canonical = canonicalizeMainSessionAlias({
			cfg: paramsValue.runtimeConfig,
			agentId: paramsValue.agentId,
			sessionKey: candidate
		});
		if (canonical !== "global") {
			if (normalizeAgentId(resolveAgentIdFromSessionKey(canonical)) !== normalizeAgentId(paramsValue.agentId)) return resolveAgentMainSessionKey({
				cfg: paramsValue.runtimeConfig,
				agentId: paramsValue.agentId
			});
		}
		return resolveMainScopedEventSessionKey({
			cfg: paramsValue.runtimeConfig,
			sessionKey: canonical,
			agentId: paramsValue.agentId
		}) ?? canonical;
	};
	const resolveCronTarget = (opts) => {
		const requestedAgentId = typeof opts?.agentId === "string" && opts.agentId.trim() ? normalizeAgentId(opts.agentId) : void 0;
		const requestedSessionKey = typeof opts?.sessionKey === "string" && opts.sessionKey.trim() ? opts.sessionKey : void 0;
		if (opts?.preserveUntargeted && !requestedAgentId && !requestedSessionKey) return {
			runtimeConfig: getRuntimeConfig(),
			agentId: void 0,
			sessionKey: void 0
		};
		const derivedAgentId = requestedSessionKey && parseAgentSessionKey(requestedSessionKey) ? resolveAgentIdFromSessionKey(requestedSessionKey) : void 0;
		const { agentId: resolvedAgentId, cfg: runtimeConfig } = resolveCronAgent(requestedAgentId ?? derivedAgentId);
		const agentId = resolvedAgentId || void 0;
		const resolvedSessionKey = agentId ? resolveCronSessionKey({
			runtimeConfig,
			agentId,
			requestedSessionKey
		}) : void 0;
		return {
			runtimeConfig,
			agentId,
			sessionKey: resolvedSessionKey && runtimeConfig.session?.scope === "global" ? resolveEventSessionKey(resolvedSessionKey, runtimeConfig.session?.mainKey, runtimeConfig.session?.scope) : resolvedSessionKey
		};
	};
	const resolveCronHeartbeatOverride = (paramsLocal) => {
		if (!paramsLocal.heartbeat) return;
		const agentEntry = paramsLocal.agentId !== void 0 ? findAgentEntry(paramsLocal.runtimeConfig, paramsLocal.agentId) : void 0;
		const agentHeartbeat = agentEntry && typeof agentEntry === "object" ? agentEntry.heartbeat : void 0;
		return sanitizeCronHeartbeatOverride({
			...paramsLocal.runtimeConfig.agents?.defaults?.heartbeat,
			...agentHeartbeat,
			...paramsLocal.heartbeat
		});
	};
	const defaultAgentId = resolveDefaultAgentId(params.cfg);
	const resolveSessionStorePath = (agentId) => resolveStorePath(params.cfg.session?.store, { agentId: agentId ?? defaultAgentId });
	const sessionStorePath = resolveSessionStorePath(defaultAgentId);
	const scriptRuntime = params.cfg.cron?.triggers?.enabled === true ? createCronScriptRuntime({ config: params.cfg }) : void 0;
	const runCronChangedHook = (evt) => {
		const hookRunner = getGlobalHookRunner();
		if (!hookRunner?.hasHooks("cron_changed")) return;
		const hookCtx = {
			config: getRuntimeConfig(),
			getCron: () => cron
		};
		runWithGatewayIndependentRootWorkAdmission(async () => {
			await hookRunner.runCronChanged(evt, hookCtx);
		}).catch((err) => {
			cronLogger.warn({
				err: formatErrorMessage(err),
				jobId: evt.jobId
			}, "cron_changed hook failed");
		});
	};
	const exitWatchersRef = { current: void 0 };
	let exitWatcherReconciliations = 0;
	let exitWatcherGeneration = 0;
	const reconcileExitWatchers = async () => {
		const generation = exitWatcherGeneration;
		exitWatcherReconciliations += 1;
		try {
			if (!exitWatchersRef.current) return;
			const result = await cron.list({ includeDisabled: true });
			if (generation !== exitWatcherGeneration) return;
			const jobs = Array.isArray(result) ? result : result.jobs;
			reconcileCronExitWatchers({
				cronEnabled,
				exitWatchers: exitWatchersRef.current,
				jobs
			});
		} catch (err) {
			cronLogger.warn({ err: String(err) }, "cron-exit: reconcile failed");
		} finally {
			exitWatcherReconciliations -= 1;
		}
	};
	const broadcastCronBoundSessionChanges = (evt) => {
		const job = evt.job ?? cron.getJob(evt.jobId);
		if (!job) return;
		const boundKeys = resolveCronJobBoundSessionKeys(job, {
			cfg: getRuntimeConfig(),
			defaultAgentId: cron.getDefaultAgentId()
		});
		for (const sessionKey of boundKeys) {
			const sessionRow = loadGatewaySessionRow(sessionKey);
			params.broadcast("sessions.changed", {
				sessionKey,
				reason: "cron-binding",
				ts: Date.now(),
				...sessionRow ? buildGatewaySessionEventFields({ sessionRow }) : {}
			}, { dropIfSlow: true });
		}
	};
	const cron = new CronService({
		storePath,
		cronEnabled,
		cronConfig: params.cfg.cron,
		...scriptRuntime ? { evaluateCronTrigger: ({ job, script, state, abortSignal }) => scriptRuntime.evaluateTrigger({
			jobId: job.id,
			agentId: job.agentId,
			script,
			state,
			toolsAllow: job.payload.toolsAllow,
			abortSignal
		}) } : {},
		defaultAgentId,
		resolveDefaultAgentId: () => resolveDefaultAgentId(getRuntimeConfig()),
		isAgentAvailable: (agentId) => !isAgentDeletionBlocked(agentId) && listAgentIds(getRuntimeConfig()).some((id) => normalizeAgentId(id) === agentId),
		resolveSessionStorePath,
		sessionStorePath,
		enqueueSystemEvent: (text, opts) => {
			const { sessionKey } = resolveCronTarget(opts);
			if (!sessionKey) throw new Error("Cron system event target did not resolve a session key.");
			const event = enqueueSystemEventEntry(text, {
				sessionKey,
				contextKey: opts?.contextKey,
				deliveryContext: opts?.deliveryContext
			});
			return event ? {
				accepted: true,
				remove: () => consumeSelectedSystemEventEntries(sessionKey, [event]).length > 0
			} : { accepted: false };
		},
		resolveOriginDeliveryContext: (opts) => {
			const { runtimeConfig, sessionKey } = resolveCronTarget({
				...opts,
				preserveUntargeted: true
			});
			if (!sessionKey) return;
			return resolveCronStoredDeliveryContext({
				cfg: runtimeConfig,
				sessionKey
			});
		},
		requestHeartbeat: (opts) => {
			const { agentId, sessionKey } = resolveCronTarget({
				...opts,
				preserveUntargeted: true
			});
			requestHeartbeat({
				source: opts?.source ?? "cron",
				intent: opts?.intent ?? "event",
				reason: opts?.reason,
				agentId,
				sessionKey,
				heartbeat: sanitizeCronHeartbeatOverride(opts?.heartbeat)
			});
		},
		runHeartbeatOnce: async (opts) => {
			const { runtimeConfig, agentId, sessionKey } = resolveCronTarget({
				...opts,
				preserveUntargeted: true
			});
			return await runHeartbeatOnce({
				cfg: runtimeConfig,
				source: opts?.source ?? "cron",
				intent: opts?.intent ?? "event",
				reason: opts?.reason,
				agentId,
				sessionKey,
				owningCronJobMarker: opts?.owningCronJobMarker,
				owningCronLaneTaskMarker: opts?.owningCronLaneTaskMarker,
				heartbeat: resolveCronHeartbeatOverride({
					runtimeConfig,
					agentId,
					heartbeat: opts?.heartbeat
				}),
				deps: {
					...params.deps,
					runtime: defaultRuntime
				}
			});
		},
		runIsolatedAgentJob: async ({ job, message, abortSignal, onExecutionStarted, onExecutionPhase, onLaneWait }) => {
			const { agentId, cfg: runtimeConfig } = resolveCronAgent(job.agentId);
			const sessionKey = resolveCronSessionTargetSessionKey(job.sessionTarget) ?? `cron:${job.id}`;
			try {
				return await runCronIsolatedAgentTurn({
					cfg: runtimeConfig,
					deps: params.deps,
					job,
					message,
					abortSignal,
					onExecutionStarted,
					onExecutionPhase,
					onLaneWait,
					agentId,
					sessionKey,
					lane: "cron"
				});
			} finally {
				await cleanupBrowserSessionsForLifecycleEnd({
					sessionKeys: [sessionKey],
					onWarn: (msg) => cronLogger.warn({ jobId: job.id }, msg)
				});
			}
		},
		runCommandJob: async ({ job, abortSignal }) => {
			const result = await runCronCommandJob({
				job,
				abortSignal,
				nowMs: Date.now
			});
			const plan = resolveCronDeliveryPlan(job);
			const deliveryTrace = { intended: pickDefined({
				channel: plan.channel,
				to: plan.to,
				threadId: plan.threadId,
				accountId: plan.accountId,
				source: "explicit"
			}, [
				"channel",
				"to",
				"accountId",
				"threadId",
				"source"
			]) };
			if (typeof result.summary === "string" && isSilentReplyText(result.summary, "NO_REPLY")) {
				const { summary: _summary, ...silentResult } = result;
				return {
					...silentResult,
					deliveryAttempted: false,
					delivered: false,
					delivery: deliveryTrace
				};
			}
			if (!(plan.mode === "announce" && typeof result.summary === "string" && result.summary.trim())) return {
				...result,
				deliveryAttempted: false,
				delivered: false,
				delivery: deliveryTrace
			};
			const message = isCommandCronJob(job) ? redactCronCommandSummaryForExternalDelivery(result.summary) : result.summary;
			if (typeof message !== "string") return {
				...result,
				deliveryAttempted: false,
				delivered: false,
				delivery: deliveryTrace
			};
			const { agentId, cfg: runtimeConfig } = resolveCronAgent(job.agentId);
			try {
				await sendCronAnnouncePayloadStrict({
					deps: params.deps,
					cfg: runtimeConfig,
					agentId,
					jobId: job.id,
					target: {
						channel: plan.channel,
						to: plan.to,
						threadId: plan.threadId,
						accountId: plan.accountId,
						sessionKey: resolveCronDeliverySessionKey(job)
					},
					message,
					abortSignal: abortSignal ?? new AbortController().signal
				});
				return {
					...result,
					deliveryAttempted: true,
					delivered: true,
					delivery: {
						...deliveryTrace,
						delivered: true
					}
				};
			} catch (err) {
				const error = formatErrorMessage(err);
				const requiredDeliveryFailed = job.delivery?.bestEffort === false && result.status === "ok";
				cronLogger.warn({
					jobId: job.id,
					err: error
				}, "cron: command delivery failed");
				return {
					...result,
					status: requiredDeliveryFailed ? "error" : result.status,
					...requiredDeliveryFailed ? { error } : { deliveryError: error },
					deliveryAttempted: true,
					delivered: false,
					delivery: {
						...deliveryTrace,
						delivered: false,
						resolved: {
							channel: plan.channel,
							to: plan.to,
							accountId: plan.accountId,
							threadId: plan.threadId,
							source: "explicit",
							ok: false,
							error
						}
					}
				};
			}
		},
		runScriptJob: async ({ job, abortSignal }) => {
			if (!scriptRuntime || job.payload.kind !== "script") return {
				status: "error",
				error: "cron script payload executor is unavailable"
			};
			const execution = await scriptRuntime.executePayload({
				jobId: job.id,
				agentId: job.agentId,
				script: job.payload.script,
				state: job.state.triggerState,
				toolsAllow: job.payload.toolsAllow,
				timeoutSeconds: job.payload.timeoutSeconds,
				toolBudget: job.payload.toolBudget,
				abortSignal
			});
			if (execution.kind === "error") return {
				status: "error",
				error: `cron script payload failed (${execution.code}): ${execution.error}`
			};
			if (execution.nextCheck && !job.pacing) return {
				status: "error",
				error: "cron script payload returned nextCheck, but this job has no pacing bounds"
			};
			const notify = execution.notify?.trim() ? execution.notify : void 0;
			const plan = resolveCronDeliveryPlan(job);
			const deliveryTrace = { intended: pickDefined({
				channel: plan.channel,
				to: plan.to,
				accountId: plan.accountId,
				threadId: plan.threadId,
				source: "explicit"
			}, [
				"channel",
				"to",
				"accountId",
				"threadId",
				"source"
			]) };
			const base = {
				status: "ok",
				notify,
				wake: execution.wake,
				stateChanged: execution.stateChanged,
				...execution.stateChanged ? { state: execution.state } : {},
				nextCheck: execution.nextCheck,
				delivery: deliveryTrace
			};
			if (job.sessionTarget === "main" || plan.mode !== "announce" || !notify) return {
				...base,
				deliveryAttempted: false,
				delivered: false
			};
			const { agentId, cfg: runtimeConfig } = resolveCronAgent(job.agentId);
			try {
				await sendCronAnnouncePayloadStrict({
					deps: params.deps,
					cfg: runtimeConfig,
					agentId,
					jobId: job.id,
					target: {
						channel: plan.channel,
						to: plan.to,
						threadId: plan.threadId,
						accountId: plan.accountId,
						sessionKey: resolveCronDeliverySessionKey(job)
					},
					message: notify,
					abortSignal: abortSignal ?? new AbortController().signal
				});
				return {
					...base,
					deliveryAttempted: true,
					delivered: true,
					delivery: {
						...deliveryTrace,
						delivered: true
					}
				};
			} catch (err) {
				const error = formatErrorMessage(err);
				cronLogger.warn({
					jobId: job.id,
					err: error
				}, "cron: script payload delivery failed");
				return {
					...base,
					status: job.delivery?.bestEffort ? "ok" : "error",
					...job.delivery?.bestEffort ? { deliveryError: error } : { error },
					deliveryAttempted: true,
					delivered: false,
					delivery: {
						...deliveryTrace,
						delivered: false
					}
				};
			}
		},
		cleanupTimedOutAgentRun: async ({ job, execution }) => {
			if (!execution?.sessionId) return;
			const result = await abortAndDrainEmbeddedAgentRun({
				sessionId: execution.sessionId,
				sessionKey: execution.sessionKey,
				settleMs: 15e3,
				forceClear: true,
				reason: "cron_timeout"
			});
			cronLogger.warn({
				jobId: job.id,
				sessionId: execution.sessionId,
				sessionKey: execution.sessionKey,
				aborted: result.aborted,
				drained: result.drained,
				forceCleared: result.forceCleared
			}, "cron: cleaned up timed-out agent run");
			await retireSessionMcpRuntime({
				sessionId: execution.sessionId,
				reason: "cron-timeout-cleanup",
				onError: (error, sid) => {
					cronLogger.warn({
						jobId: job.id,
						sessionId: sid
					}, `cron: failed to retire MCP runtime for timed-out session: ${String(error)}`);
				}
			}).catch(() => {});
		},
		onIsolatedAgentSetupTimeout: ({ job, error, timeoutMs }) => {
			cronLogger.warn({
				jobId: job.id,
				jobName: job.name,
				timeoutMs,
				error
			}, "cron: isolated agent setup timed out before runner start; backing off job without gateway restart");
		},
		sendCronFailureAlert: async ({ job, text, channel, to, mode, accountId }) => await sendGatewayCronFailureAlert({
			deps: params.deps,
			logger: cronLogger,
			resolveCronAgent,
			webhookToken: params.cfg.cron?.webhookToken,
			job,
			text,
			channel,
			to,
			mode,
			accountId
		}),
		log: getChildLogger({
			module: "cron",
			storePath
		}),
		onEvent: (evt) => {
			bumpSessionAutomationVersion();
			params.broadcast("cron", evt.job ? {
				...evt,
				job: toPublicCronJob(evt.job)
			} : evt, { dropIfSlow: true });
			const jobSnapshot = evt.job ?? cron.getJob(evt.jobId);
			const pluginJob = jobSnapshot ? toPluginCronJob(jobSnapshot) : void 0;
			const hookSummary = isCommandCronJob(jobSnapshot) && typeof evt.summary === "string" ? redactCronCommandSummaryForExternalDelivery(evt.summary) : evt.summary;
			const hookEvt = {
				action: evt.action,
				jobId: evt.jobId,
				...pluginJob ? { job: pluginJob } : {},
				sessionTarget: jobSnapshot?.sessionTarget,
				agentId: jobSnapshot?.agentId,
				...pickDefined(evt, [
					"runAtMs",
					"durationMs",
					"status",
					"error",
					"delivered",
					"deliveryStatus",
					"deliveryError",
					"sessionId",
					"sessionKey",
					"runId",
					"nextRunAtMs",
					"model",
					"provider"
				]),
				...hookSummary !== void 0 ? { summary: hookSummary } : {}
			};
			runCronChangedHook(hookEvt);
			if (evt.action === "added" || evt.action === "updated" || evt.action === "removed") {
				broadcastCronBoundSessionChanges(evt);
				reconcileExitWatchers();
			} else if (evt.action === "finished") {
				if ((evt.job ?? cron.getJob(evt.jobId))?.enabled === false) broadcastCronBoundSessionChanges(evt);
			}
			if (evt.action === "finished") dispatchGatewayCronFinishedNotifications({
				evt,
				job: evt.job ?? cron.getJob(evt.jobId),
				deps: params.deps,
				logger: cronLogger,
				resolveCronAgent,
				webhookToken: params.cfg.cron?.webhookToken,
				globalFailureDestination: params.cfg.cron?.failureDestination
			});
		}
	});
	exitWatchersRef.current = createCronExitWatchers({
		getProcessSupervisor,
		persistCompletion: async (jobId) => await runWithGatewayIndependentRootWorkAdmission(async () => {
			await cron.update(jobId, { enabled: false });
		}),
		fireOnExit: (job, exit) => runWithGatewayIndependentRootWorkAdmission(async () => fireOnExitJob(job, exit, { run: (jobId, payload) => cron.run(jobId, "force", payload ? { payload } : void 0) })),
		logger: cronLogger
	});
	const getCronSuspensionBlockerCount = cron.getSuspensionBlockerCount.bind(cron);
	cron.getSuspensionBlockerCount = () => getCronSuspensionBlockerCount() + exitWatcherReconciliations + (exitWatchersRef.current?.activeJobIds().length ?? 0);
	const stopExitWatchers = () => {
		exitWatcherGeneration += 1;
		exitWatchersRef.current?.cancelAll();
	};
	const automationSource = {
		getJobs: () => cron.getLoadedJobs(),
		getDefaultAgentId: () => cron.getDefaultAgentId()
	};
	const automationEpoch = claimSessionAutomationEpoch();
	const stopCron = cron.stop.bind(cron);
	cron.stop = () => {
		stopCron();
		stopExitWatchers();
		unregisterSessionAutomationSource(automationSource);
	};
	const startCron = cron.start.bind(cron);
	cron.start = async () => {
		await startCron();
		registerSessionAutomationSource(automationSource, automationEpoch);
		params.broadcast("sessions.changed", {
			reason: "cron-bindings-loaded",
			ts: Date.now()
		}, { dropIfSlow: true });
	};
	return {
		cron,
		storePath,
		cronEnabled,
		reconcileExitWatchers,
		stopExitWatchers
	};
}
//#endregion
export { fireOnExitJob as n, buildGatewayCronService as t };
