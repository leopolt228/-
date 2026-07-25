import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { C as createDiagnosticTraceContextFromActiveScope, M as hasInternalDiagnosticEventListeners, T as freezeDiagnosticTraceContext, j as runWithDiagnosticTraceContext, o as emitTrustedDiagnosticEvent, s as emitTrustedDiagnosticEventWithPrivateData, t as areDiagnosticsEnabledForProcess, x as createChildDiagnosticTraceContext } from "./diagnostic-events-Dt41CZkD.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { O as withAgentRunLifecycleGeneration, n as captureAgentRunLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Dg0sI2pr.js";
import { s as resolveBlockMessage, t as getGlobalHookRunner } from "./hook-runner-global-C6QB2pJa.js";
import { h as setReplyPayloadMetadata } from "./reply-payload-BtIUrr9c.js";
import { t as SessionManager } from "./session-manager-Ofb7FHrt.js";
import { i as buildUsageWithNoCost, n as buildAssistantMessage } from "./stream-message-shared-DKS8UMJ_.js";
import { i as resolveCliBackendConfig } from "./cli-backends-Bd-NX5h4.js";
import { i as classifyFailoverReason, v as isFailoverErrorMessage } from "./errors-DMOgb-Rt.js";
import { c as isFailoverError, d as isTimeoutError, p as resolveFailoverStatus, t as FailoverError, u as isSignalTimeoutReason } from "./failover-error-B8xHNn2y.js";
import { a as resolveCliRuntimeOwnerFingerprint, i as resolveCliRuntimeArtifactFingerprint } from "./cli-auth-epoch-DXULm7G_.js";
import { n as SILENT_REPLY_TOKEN } from "./tokens-DKI4eGAu.js";
import { n as appendExactAssistantMessageToSessionTranscript } from "./transcript-vdi-rYV7.js";
import "./embedded-agent-helpers-DDAtCAER.js";
import { i as buildGenericCliContextEngineHostSupport } from "./host-compat-BibWlia2.js";
import { d as waitForDeferredTurnMaintenanceForSession, i as bootstrapHarnessContextEngine, l as runHarnessContextEngineMaintenance, n as runAgentEndSideEffects, s as finalizeHarnessContextEngineTurn, t as awaitAgentEndSideEffects } from "./agent-end-side-effects-6JsKr3JF.js";
import { n as diagnosticErrorFailureKind, r as diagnosticErrorMessage, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-CxJn_BAC.js";
import { N as isHeartbeatLifecycleRunKind } from "./openclaw-tools-U0Zy3sfO.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-ey8aD0rO.js";
import { n as buildAgentHookContextIdentityFields, t as buildAgentHookContextChannelFields } from "./hook-agent-context-DtfLo2HB.js";
import { a as runAgentHarnessLlmInputHook, o as runAgentHarnessLlmOutputHook, s as buildAgentHookContext } from "./lifecycle-hook-helpers-L479pS81.js";
import { n as buildHandledBeforeAgentReplyPayloads, r as runBeforeAgentReplyForTurn, t as buildEmbeddedRunPayloads } from "./payloads-NfuDeA4g.js";
import { u as hashCliReseedPrompt } from "./cli-session-history.claude-q5_fT1P_.js";
import { o as shouldUseClaudeLiveSession } from "./claude-live-session-TONNMRFQ.js";
import { v as cliBackendLog, y as formatCliBackendOutputDigest } from "./helpers-CH03IdKf.js";
import { n as getCliMessagingDeliveryEvidence, t as attachCliMessagingDeliveryEvidence } from "./delivery-evidence-Cmz7UHq4.js";
import { i as loadCliSessionHistoryMessages, l as claudeCliSessionTranscriptHasContent, r as loadCliSessionContextEngineMessages, s as buildAgentHookConversationMessages } from "./session-history-CM7L7D0_.js";
//#region src/agents/cli-runner/run-diagnostics.ts
/** Trusted run hierarchy for Claude Code CLI-backed agent turns. */
function diagnosticBase(params, trace) {
	const channel = params.messageChannel ?? params.messageProvider;
	return {
		runId: params.runId,
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		provider: params.modelProvider ?? "anthropic",
		...params.model ? { model: params.model } : {},
		...params.trigger ? { trigger: params.trigger } : {},
		...channel ? { channel } : {},
		trace
	};
}
function resultRunOutcome(result) {
	if (result.meta.livenessState === "blocked") return "blocked";
	if (result.meta.aborted === true) return "aborted";
	if (result.meta.error) return "error";
	return "completed";
}
function errorHarnessOutcome(error, abortSignal) {
	const failureKind = diagnosticErrorFailureKind(error);
	if (failureKind === "timeout") return "timed_out";
	if (failureKind === "aborted") return abortSignal?.aborted && isSignalTimeoutReason(abortSignal.reason) ? "timed_out" : "aborted";
	if (abortSignal?.aborted === true) return isSignalTimeoutReason(abortSignal.reason) ? "timed_out" : "aborted";
	if (isTimeoutError(error)) return "timed_out";
	return "error";
}
/**
* Wraps one OpenClaw Claude CLI turn in synthetic harness/run boundaries.
* The child run scope makes every real Claude CLI model call nest beneath it.
*/
async function runClaudeCliAgentTurnWithDiagnostics(params, run) {
	const harnessTrace = freezeDiagnosticTraceContext(createDiagnosticTraceContextFromActiveScope());
	const runTrace = freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(harnessTrace));
	const harnessBase = {
		...diagnosticBase(params, harnessTrace),
		harnessId: "claude-cli"
	};
	const runBase = diagnosticBase(params, runTrace);
	const startedAt = Date.now();
	let phase = "prepare";
	emitTrustedDiagnosticEvent({
		type: "harness.run.started",
		...harnessBase
	});
	emitTrustedDiagnosticEvent({
		type: "run.started",
		...runBase
	});
	try {
		const result = await runWithDiagnosticTraceContext(runTrace, () => run({ setPhase: (nextPhase) => {
			phase = nextPhase;
		} }));
		const runOutcome = resultRunOutcome(result);
		const resultErrorMessage = result.meta.error?.message;
		const runErrorMessage = runOutcome === "error" ? resultErrorMessage : void 0;
		emitTrustedDiagnosticEventWithPrivateData({
			type: "run.completed",
			...runBase,
			durationMs: Date.now() - startedAt,
			outcome: runOutcome,
			...runOutcome === "blocked" ? { blockedBy: "before_agent_run" } : {},
			...runOutcome === "error" && result.meta.error ? { errorCategory: result.meta.error.kind } : {}
		}, runErrorMessage ? { errorMessage: runErrorMessage } : void 0);
		emitTrustedDiagnosticEventWithPrivateData({
			type: "harness.run.completed",
			...harnessBase,
			durationMs: Date.now() - startedAt,
			outcome: result.meta.timeoutPhase !== void 0 ? "timed_out" : runOutcome === "aborted" ? "aborted" : runOutcome === "completed" ? "completed" : "error",
			...typeof result.meta.yielded === "boolean" ? { yieldDetected: result.meta.yielded } : {}
		}, resultErrorMessage && (runOutcome === "error" || runOutcome === "blocked") ? { errorMessage: resultErrorMessage } : void 0);
		return result.diagnosticTrace ? result : {
			...result,
			diagnosticTrace: harnessTrace
		};
	} catch (error) {
		const errorMessage = diagnosticErrorMessage(error);
		const harnessOutcome = errorHarnessOutcome(error, params.abortSignal);
		emitTrustedDiagnosticEventWithPrivateData({
			type: "run.completed",
			...runBase,
			durationMs: Date.now() - startedAt,
			outcome: harnessOutcome === "error" ? "error" : "aborted",
			...harnessOutcome === "error" ? { errorCategory: diagnosticErrorCategory(error) } : {}
		}, errorMessage ? { errorMessage } : void 0);
		if (harnessOutcome === "error") emitTrustedDiagnosticEventWithPrivateData({
			type: "harness.run.error",
			...harnessBase,
			durationMs: Date.now() - startedAt,
			phase,
			errorCategory: diagnosticErrorCategory(error)
		}, errorMessage ? { errorMessage } : void 0);
		else emitTrustedDiagnosticEvent({
			type: "harness.run.completed",
			...harnessBase,
			durationMs: Date.now() - startedAt,
			outcome: harnessOutcome
		});
		throw error;
	}
}
//#endregion
//#region src/agents/cli-runner.ts
/**
* Top-level CLI-backed agent runner orchestration.
*/
const log = createSubsystemLogger("agents/cli-runner");
const cliRunnerDeps = {
	claudeCliSessionTranscriptHasContent,
	delay: async (delayMs) => {
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
	}
};
function isClaudeCliProvider(provider) {
	return provider.trim().toLowerCase() === "claude-cli";
}
function resolveReusableCliSessionId(reusableCliSession) {
	return reusableCliSession.mode === "reuse" || reusableCliSession.mode === "reuse-with-drift" ? reusableCliSession.sessionId : void 0;
}
function shouldRetryFreshCliSessionAfterFailover(params) {
	if (!params.hasHistoryPrompt) return false;
	switch (params.error.reason) {
		case "session_expired": return true;
		case "unknown": return params.error.code === "cli_unknown_empty_failure";
		case "empty_response": return params.error.code === "cli_unknown_empty_failure";
		case "timeout": return params.error.code === "cli_no_output_timeout";
		case "context_overflow": return params.error.code === "cli_context_overflow";
		default: return false;
	}
}
function formatCliEmptyOutputDiagnostics(output) {
	const process = output.diagnostics?.process;
	if (!process) return;
	return [
		`backend=${process.backendId}`,
		`reason=${process.processReason}`,
		`exitCode=${process.exitCode ?? "null"}`,
		`exitSignal=${process.exitSignal ?? "null"}`,
		`durationMs=${process.durationMs}`,
		`stdoutBytes=${process.stdoutBytes}`,
		`stdoutHash=${process.stdoutHash}`,
		`stderrBytes=${process.stderrBytes}`,
		`stderrHash=${process.stderrHash}`,
		`useResume=${process.useResume ? "true" : "false"}`
	].join(" ");
}
/** Checks whether a Claude CLI session binding has reached its transcript file. */
async function isCliBindingFlushed(sessionId, provider, workspaceDir, options) {
	if (!provider || !isClaudeCliProvider(provider)) return true;
	if (!sessionId) return false;
	if (options?.skipTranscriptProbe) return true;
	for (const delayMs of [
		0,
		50,
		150
	]) {
		if (delayMs > 0) await cliRunnerDeps.delay(delayMs);
		if (await cliRunnerDeps.claudeCliSessionTranscriptHasContent({
			sessionId,
			workspaceDir
		})) return true;
	}
	return false;
}
function flushSessionManagerTranscript(sessionManager) {
	sessionManager.replacePersistedTranscript?.();
}
async function assertSuccessfulCliRuntimeBindingCurrent(context) {
	if (!context.runtimeArtifactFingerprint) return;
	const currentArtifact = await resolveCliRuntimeArtifactFingerprint({
		provider: context.params.provider,
		config: context.params.config ?? context.contextEngineConfig,
		agentId: context.params.agentId,
		runtimeArtifactId: context.backendResolved.id
	});
	if (currentArtifact !== context.runtimeArtifactFingerprint) throw new Error("CLI executable/package artifact changed during successful inference");
	if (!context.runtimeOwnerFingerprint) return;
	if (await resolveCliRuntimeOwnerFingerprint({
		provider: context.params.provider,
		config: context.params.config ?? context.contextEngineConfig,
		...context.agentDir ? { agentDir: context.agentDir } : {},
		agentId: context.params.agentId,
		runtimeOwnerId: context.backendResolved.id,
		...context.effectiveAuthProfileId ? { authProfileId: context.effectiveAuthProfileId } : {},
		...context.authBindingSkipsLocalCredential ? { skipLocalCredential: true } : {},
		runtimeArtifactFingerprint: currentArtifact
	}) !== context.runtimeOwnerFingerprint) throw new Error("CLI runtime owner changed during successful inference");
}
function buildCliHookUserMessage(prompt) {
	return {
		role: "user",
		content: prompt,
		timestamp: Date.now()
	};
}
function buildCliHookAssistantMessage(params) {
	return {
		role: "assistant",
		content: [{
			type: "text",
			text: params.text
		}],
		api: "responses",
		provider: params.provider,
		model: params.model,
		...params.usage ? { usage: params.usage } : {},
		stopReason: "stop",
		timestamp: Date.now()
	};
}
function isAgentMessage(value) {
	return Boolean(value && typeof value === "object" && "role" in value);
}
function buildCliContextEngineUserMessage(prompt) {
	return {
		role: "user",
		content: prompt,
		timestamp: Date.now()
	};
}
function buildCliContextEngineAssistantMessage(params) {
	return buildCliHookAssistantMessage(params);
}
function shouldAwaitCliAgentEndHook(params) {
	return !params.messageChannel && !params.messageProvider;
}
async function runCliAgentEndHook(params, hookParams) {
	if (shouldAwaitCliAgentEndHook(params)) {
		await awaitAgentEndSideEffects(hookParams);
		return;
	}
	runAgentEndSideEffects(hookParams);
}
async function persistApprovedCliUserTurnTranscript(params) {
	const recorder = params.userTurnTranscriptRecorder;
	const reusingPersistedTurn = params.suppressNextUserMessagePersistence === true;
	if (!recorder || reusingPersistedTurn && !recorder.hasPersisted()) return recorder?.isBlocked() === true;
	const persisted = await recorder.persistApproved({ cwd: params.cwd ?? params.workspaceDir });
	if (!persisted && !recorder.hasPersisted() && await recorder.resolveMessage()) recorder.markBlocked();
	if (persisted && !reusingPersistedTurn) try {
		const notification = params.onUserMessagePersisted?.(persisted.message);
		if (notification) Promise.resolve(notification).catch((error) => {
			log.warn(`CLI user turn persistence notification failed: ${formatErrorMessage(error)}`);
		});
	} catch (error) {
		log.warn(`CLI user turn persistence notification failed: ${formatErrorMessage(error)}`);
	}
	return persisted !== void 0 || recorder.hasPersisted() || recorder.isBlocked();
}
async function persistCliAssistantTranscript(params) {
	const { runParams } = params;
	if (!runParams.persistAssistantTranscript || !runParams.sessionKey || !params.text) return false;
	if (runParams.currentInboundEventKind === "room_event") return true;
	try {
		const result = await appendExactAssistantMessageToSessionTranscript({
			sessionKey: runParams.sessionKey,
			agentId: runParams.agentId,
			expectedSessionId: runParams.sessionId,
			storePath: runParams.storePath,
			idempotencyKey: `cli-assistant:${runParams.runId}`,
			config: runParams.config,
			beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
			message: buildAssistantMessage({
				model: {
					api: "cli",
					provider: runParams.provider,
					id: params.modelId
				},
				content: [{
					type: "text",
					text: params.text
				}],
				stopReason: "stop",
				usage: buildUsageWithNoCost({
					input: params.usage?.input,
					output: params.usage?.output,
					cacheRead: params.usage?.cacheRead,
					cacheWrite: params.usage?.cacheWrite,
					totalTokens: params.usage?.total
				})
			})
		});
		if (!result.ok) {
			log.warn(`CLI assistant transcript persistence skipped: ${result.reason}`);
			return result.code === "blocked" || result.code === "session-rebound";
		}
		return true;
	} catch (error) {
		log.warn(`CLI assistant transcript persistence failed: ${formatErrorMessage(error)}`);
		return false;
	}
}
async function notifyCliUserMessagePersisted(params, message, context) {
	try {
		await Promise.resolve(params.onUserMessagePersisted?.(message));
	} catch (err) {
		log.warn(`${context} notification failed: ${formatErrorMessage(err)}`);
	}
}
async function finalizeCliContextEngineTurn(params) {
	const { context } = params;
	if (!context.contextEngine) return;
	const { params: runParams } = context;
	const prePromptMessages = params.historyMessages.filter(isAgentMessage);
	const turnMessages = [];
	if (context.contextEngineTurnPrompt) turnMessages.push(buildCliContextEngineUserMessage(context.contextEngineTurnPrompt));
	if (params.assistantText) turnMessages.push(buildCliContextEngineAssistantMessage({
		text: params.assistantText,
		provider: runParams.provider,
		model: context.modelId,
		usage: params.output.usage
	}));
	let deferredTurnMaintenance;
	const contextEngineHostSupport = buildGenericCliContextEngineHostSupport({ backendId: context.backendResolved.id });
	if ((await finalizeHarnessContextEngineTurn({
		contextEngine: context.contextEngine,
		promptError: false,
		aborted: runParams.abortSignal?.aborted === true,
		yieldAborted: false,
		sessionIdUsed: runParams.sessionId,
		sessionKey: runParams.sessionKey,
		sessionFile: runParams.sessionFile,
		isHeartbeat: isHeartbeatLifecycleRunKind(runParams.bootstrapContextRunKind),
		messagesSnapshot: [...prePromptMessages, ...turnMessages],
		prePromptMessageCount: prePromptMessages.length,
		config: context.contextEngineConfig,
		contextEngineHostSupport,
		providerId: runParams.provider,
		modelId: context.modelId,
		runMaintenance: async (maintenanceParams) => await runHarnessContextEngineMaintenance({
			...maintenanceParams,
			onDeferredMaintenance: (promise) => {
				deferredTurnMaintenance = promise;
			}
		}),
		warn: (message) => log.warn(message)
	})).postTurnFinalizationSucceeded && deferredTurnMaintenance) context.contextEngineDeferredTurnMaintenance = deferredTurnMaintenance;
}
/** Prepares and runs one CLI-backed agent turn. */
function runCliAgent(paramsInput) {
	const lifecycleGeneration = paramsInput.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(paramsInput.runId);
	const params = {
		...paramsInput,
		lifecycleGeneration
	};
	return withAgentRunLifecycleGeneration(lifecycleGeneration, () => isClaudeCliProvider(params.provider) && areDiagnosticsEnabledForProcess() && hasInternalDiagnosticEventListeners() ? runClaudeCliAgentTurnWithDiagnostics(params, (diagnosticLifecycle) => runCliAgentInternal(params, diagnosticLifecycle)) : runCliAgentInternal(params));
}
async function runCliAgentInternal(params, diagnosticLifecycle) {
	assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
	params.onExecutionStarted?.();
	const hookStartedAt = Date.now();
	const hookResult = await runBeforeAgentReplyForTurn({
		runId: params.runId,
		trigger: params.trigger,
		event: { cleanedBody: params.prompt },
		context: {
			runId: params.runId,
			jobId: params.jobId,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			workspaceDir: params.workspaceDir,
			trigger: params.trigger,
			...buildAgentHookContextChannelFields(params),
			...buildAgentHookContextIdentityFields({
				trigger: params.trigger,
				senderId: params.senderId,
				chatId: params.chatId,
				channelContext: params.channelContext
			})
		},
		onDispatch: () => params.onExecutionPhase?.({
			phase: "before_agent_reply",
			provider: params.provider,
			model: params.model ?? ""
		}),
		onDeclined: () => params.onExecutionPhase?.({
			phase: "runtime_plugins",
			provider: params.provider,
			model: params.model ?? ""
		})
	});
	if (hookResult?.handled) {
		const finalText = hookResult.reply?.text ?? "NO_REPLY";
		const sessionBindingDisabled = resolveCliBackendConfig(params.provider, params.config, { agentId: params.agentId })?.config.sessionMode === "none";
		cliBackendLog.info(`cli synthetic turn: provider=${params.provider} model=<synthetic> requestedModel=${params.model ?? ""} durationMs=${Date.now() - hookStartedAt} ${formatCliBackendOutputDigest(finalText)}`);
		return {
			payloads: buildHandledBeforeAgentReplyPayloads(hookResult.reply),
			meta: {
				durationMs: Date.now() - hookStartedAt,
				agentMeta: {
					sessionId: "",
					provider: params.provider,
					model: params.model ?? "",
					...sessionBindingDisabled ? { clearCliSessionBinding: true } : {}
				},
				finalAssistantVisibleText: finalText,
				finalAssistantRawText: finalText
			}
		};
	}
	const { prepareCliRunContext } = await import("./prepare.runtime.js");
	const context = await prepareCliRunContext(params);
	let result;
	let runError;
	try {
		result = await runPreparedCliAgent(context, diagnosticLifecycle);
	} catch (error) {
		runError = error;
	}
	let cleanupError;
	const recordCleanupError = (error) => {
		cleanupError ??= error;
	};
	if (params.cleanupCliLiveSessionOnRunEnd === true) try {
		const { closeClaudeLiveSessionForContext } = await import("./claude-live-session-BB38vldI.js");
		await closeClaudeLiveSessionForContext(context);
	} catch (error) {
		recordCleanupError(error);
	}
	if (params.cleanupBundleMcpOnRunEnd === true) try {
		const { closeMcpLoopbackServer } = await import("./mcp-http-DaaQ9QXp.js");
		await closeMcpLoopbackServer();
	} catch (error) {
		recordCleanupError(error);
	}
	if (cleanupError) if (runError || result?.didSendViaMessagingTool === true) log.warn(`cli run cleanup failed after completion: ${formatErrorMessage(cleanupError)}`);
	else {
		diagnosticLifecycle?.setPhase("cleanup");
		runError = cleanupError instanceof Error ? cleanupError : new Error(formatErrorMessage(cleanupError));
	}
	if (runError) throw runError instanceof Error ? runError : new Error(formatErrorMessage(runError));
	return result;
}
/** Runs an already-prepared CLI agent context through hooks and execution. */
async function runPreparedCliAgent(context, diagnosticLifecycle) {
	const { executePreparedCliRun } = await import("./execute.runtime.js");
	const { params } = context;
	const sessionBindingDisabled = context.preparedBackend.backend.sessionMode === "none";
	const preparedContextAgentMeta = isClaudeCliProvider(params.provider) && context.contextWindowInfo ? { contextTokens: context.contextWindowInfo.tokens } : {};
	const hookRunner = getGlobalHookRunner();
	const hasLlmInputHooks = hookRunner?.hasHooks("llm_input") === true;
	const hasLlmOutputHooks = hookRunner?.hasHooks("llm_output") === true;
	const hasAgentEndHooks = hookRunner?.hasHooks("agent_end") === true;
	const hasBeforeAgentRunHooks = hookRunner?.hasHooks("before_agent_run") === true;
	const needsHookHistory = hasLlmInputHooks || hasAgentEndHooks || hasBeforeAgentRunHooks;
	await waitForDeferredTurnMaintenanceForSession(params.sessionKey ?? params.sessionId);
	const historyMessages = needsHookHistory ? await loadCliSessionHistoryMessages({
		sessionId: params.sessionId,
		sessionFile: params.sessionFile,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		config: params.config
	}) : [];
	const llmInputEvent = {
		runId: params.runId,
		sessionId: params.sessionId,
		provider: params.provider,
		model: context.modelId,
		systemPrompt: context.systemPrompt,
		prompt: params.prompt,
		historyMessages,
		imagesCount: params.images?.length ?? 0
	};
	const hookContext = {
		runId: params.runId,
		jobId: params.jobId,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		workspaceDir: params.workspaceDir,
		trigger: params.trigger,
		...params.config ? { config: params.config } : {},
		...context.contextWindowInfo?.tokens ? { contextTokenBudget: context.contextWindowInfo.tokens } : {},
		...context.contextWindowInfo?.source ? { contextWindowSource: context.contextWindowInfo.source } : {},
		...context.contextWindowInfo?.referenceTokens ? { contextWindowReferenceTokens: context.contextWindowInfo.referenceTokens } : {},
		...buildAgentHookContextChannelFields(params),
		...buildAgentHookContextIdentityFields({
			trigger: params.trigger,
			senderId: params.senderId,
			chatId: params.chatId,
			channelContext: params.channelContext
		})
	};
	const buildAgentEndMessages = (lastAssistant) => [...buildAgentHookConversationMessages({
		historyMessages,
		currentTurnMessages: [buildCliHookUserMessage(params.prompt), ...lastAssistant ? [lastAssistant] : []]
	})];
	const buildFailedAgentEndEvent = (error) => ({
		messages: buildAgentEndMessages(),
		success: false,
		error,
		durationMs: Date.now() - context.started
	});
	const buildBlockedAgentEndEvent = (message) => ({
		messages: buildAgentHookConversationMessages({
			historyMessages,
			currentTurnMessages: [buildCliHookUserMessage(message)]
		}),
		success: false,
		error: message,
		durationMs: Date.now() - context.started
	});
	const buildBlockedBeforeAgentRunResult = (message) => ({
		payloads: [{
			text: message,
			isError: true
		}],
		meta: {
			durationMs: Date.now() - context.started,
			finalAssistantVisibleText: message,
			finalAssistantRawText: message,
			livenessState: "blocked",
			error: {
				kind: "hook_block",
				message
			},
			systemPromptReport: context.systemPromptReport,
			executionTrace: {
				winnerProvider: params.provider,
				winnerModel: context.modelId,
				attempts: [{
					provider: params.provider,
					model: context.modelId,
					result: "error",
					reason: "before_agent_run blocked the run"
				}],
				fallbackUsed: false,
				runner: "cli"
			},
			requestShaping: {
				...params.thinkLevel ? { thinking: params.thinkLevel } : {},
				...context.effectiveAuthProfileId ? { authMode: "auth-profile" } : {}
			},
			completion: {
				finishReason: "blocked",
				stopReason: "blocked",
				refusal: true
			},
			agentMeta: {
				sessionId: params.sessionId ?? "",
				provider: params.provider,
				model: context.modelId,
				...preparedContextAgentMeta,
				...sessionBindingDisabled ? { clearCliSessionBinding: true } : {}
			}
		}
	});
	let deliveredMessagingSideEffect = false;
	let userTurnHandled = false;
	const buildCliSourceReplyMirrorPayloads = (evidence) => {
		return buildEmbeddedRunPayloads({
			assistantTexts: [],
			toolMetas: [],
			lastAssistant: void 0,
			inlineToolResultsAllowed: false,
			sessionKey: params.sessionKey ?? "",
			provider: params.provider,
			model: context.modelId,
			didSendViaMessagingTool: evidence.didSendViaMessagingTool,
			didDeliverSourceReplyViaMessageTool: evidence.didDeliverSourceReplyViaMessageTool,
			messagingToolSourceReplyPayloads: evidence.messagingToolSourceReplyPayloads,
			sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
			agentId: params.agentId,
			runId: params.runId
		});
	};
	const resolveCliSourceReplyMirror = (evidence) => {
		const payloads = buildCliSourceReplyMirrorPayloads(evidence);
		return {
			payloads,
			delivered: payloads.length > 0 || params.sourceReplyDeliveryMode === "message_tool_only" && evidence.didDeliverSourceReplyViaMessageTool === true,
			visibleText: payloads.map((payload) => payload.text?.trim() ?? "").filter(Boolean).join("\n\n") || void 0
		};
	};
	const buildDeliveredFailureResult = (error, evidence) => {
		const message = formatErrorMessage(error);
		const { payloads } = resolveCliSourceReplyMirror(evidence);
		deliveredMessagingSideEffect = true;
		return {
			...payloads.length > 0 ? { payloads } : {},
			meta: {
				durationMs: Date.now() - context.started,
				systemPromptReport: context.systemPromptReport,
				stopReason: "error",
				executionTrace: {
					winnerProvider: params.provider,
					winnerModel: context.modelId,
					attempts: [{
						provider: params.provider,
						model: context.modelId,
						result: "error",
						reason: message
					}],
					fallbackUsed: false,
					runner: "cli"
				},
				requestShaping: {
					...params.thinkLevel ? { thinking: params.thinkLevel } : {},
					...context.effectiveAuthProfileId ? { authMode: "auth-profile" } : {}
				},
				completion: {
					finishReason: "error",
					stopReason: "error",
					refusal: false
				},
				agentMeta: {
					sessionId: "",
					provider: params.provider,
					model: context.modelId,
					...preparedContextAgentMeta,
					...sessionBindingDisabled || resolveReusableCliSessionId(context.reusableCliSession) ? { clearCliSessionBinding: true } : {}
				}
			},
			didSendViaMessagingTool: true,
			...evidence.didDeliverSourceReplyViaMessageTool ? { didDeliverSourceReplyViaMessageTool: true } : {},
			...evidence.messagingToolSentTexts?.length ? { messagingToolSentTexts: evidence.messagingToolSentTexts } : {},
			...evidence.messagingToolSentMediaUrls?.length ? { messagingToolSentMediaUrls: evidence.messagingToolSentMediaUrls } : {},
			...evidence.messagingToolSentTargets?.length ? { messagingToolSentTargets: evidence.messagingToolSentTargets } : {},
			...evidence.messagingToolSourceReplyPayloads?.length ? { messagingToolSourceReplyPayloads: evidence.messagingToolSourceReplyPayloads } : {}
		};
	};
	const persistBlockedBeforeAgentRun = async (block) => {
		const nowMs = Date.now();
		const redactedUserMessage = {
			role: "user",
			content: [{
				type: "text",
				text: block.message
			}],
			timestamp: nowMs,
			idempotencyKey: `hook-block:before_agent_run:user:${params.runId}`,
			__openclaw: { beforeAgentRunBlocked: {
				blockedBy: block.pluginId,
				blockedAt: nowMs
			} }
		};
		try {
			const persisted = await params.userTurnTranscriptRecorder?.persistBlocked(redactedUserMessage);
			if (persisted) {
				await notifyCliUserMessagePersisted(params, persisted.message, "before_agent_run block user-turn persistence");
				return;
			}
		} catch (err) {
			log.warn(`before_agent_run block: failed to persist canonical CLI user message: ${formatErrorMessage(err)}`);
		}
		try {
			const sessionManager = SessionManager.open(params.sessionFile);
			sessionManager.appendMessage(redactedUserMessage);
			flushSessionManagerTranscript(sessionManager);
		} catch (err) {
			log.warn(`before_agent_run block: failed to persist redacted CLI user message: ${formatErrorMessage(err)}`);
		}
	};
	const toCliRunFailure = (error) => {
		if (isFailoverError(error)) throw error;
		const message = formatErrorMessage(error);
		if (isFailoverErrorMessage(message, { provider: params.provider })) {
			const reason = classifyFailoverReason(message, { provider: params.provider }) ?? "unknown";
			const status = resolveFailoverStatus(reason);
			throw new FailoverError(message, {
				reason,
				provider: params.provider,
				model: context.modelId,
				sessionId: params.sessionId,
				lane: params.lane,
				status
			});
		}
		throw error;
	};
	const executeCliAttempt = async (cliSessionIdToUse, timeoutMs = params.timeoutMs) => {
		const attemptContext = timeoutMs === params.timeoutMs ? context : {
			...context,
			params: {
				...context.params,
				timeoutMs
			}
		};
		diagnosticLifecycle?.setPhase("send");
		const output = await executePreparedCliRun(attemptContext, cliSessionIdToUse, diagnosticLifecycle ? { onPhase: diagnosticLifecycle.setPhase } : void 0);
		diagnosticLifecycle?.setPhase("resolve");
		const sourceReplyMirror = resolveCliSourceReplyMirror(output);
		const assistantText = sourceReplyMirror.delivered ? sourceReplyMirror.visibleText ?? "" : output.text.trim();
		if (!assistantText && !output.didSendViaMessagingTool && params.allowEmptyAssistantReplyAsSilent !== true) {
			const emptyOutputDiagnostics = formatCliEmptyOutputDiagnostics(output);
			if (emptyOutputDiagnostics) cliBackendLog.warn(`cli empty response diagnostics: ${emptyOutputDiagnostics}`);
			throw attachCliMessagingDeliveryEvidence(new FailoverError("CLI backend returned an empty response.", {
				reason: "empty_response",
				provider: params.provider,
				model: context.modelId,
				sessionId: params.sessionId,
				lane: params.lane
			}), output);
		}
		const assistantTexts = assistantText ? [assistantText] : [];
		const lastAssistant = assistantText.length > 0 ? buildCliHookAssistantMessage({
			text: assistantText,
			provider: params.provider,
			model: context.modelId,
			usage: output.usage
		}) : void 0;
		if (assistantText.length > 0 && hasLlmOutputHooks) runAgentHarnessLlmOutputHook({
			event: {
				runId: params.runId,
				sessionId: params.sessionId,
				provider: params.provider,
				model: context.modelId,
				...context.contextWindowInfo?.tokens ? { contextTokenBudget: context.contextWindowInfo.tokens } : {},
				...context.contextWindowInfo?.source ? { contextWindowSource: context.contextWindowInfo.source } : {},
				...context.contextWindowInfo?.referenceTokens ? { contextWindowReferenceTokens: context.contextWindowInfo.referenceTokens } : {},
				resolvedRef: `${params.provider}/${context.modelId}`,
				assistantTexts,
				...lastAssistant ? { lastAssistant } : {},
				...output.usage ? { usage: output.usage } : {}
			},
			ctx: hookContext,
			hookRunner
		});
		return {
			output,
			assistantText,
			lastAssistant,
			sourceReplyWasDelivered: sourceReplyMirror.delivered,
			usedHistoryPrompt: cliSessionIdToUse === void 0 && context.openClawHistoryPrompt !== void 0
		};
	};
	const buildCliRunResult = (resultParams) => {
		const text = resultParams.output.text?.trim();
		const rawText = resultParams.output.rawText?.trim();
		const sourceReplyMirror = resolveCliSourceReplyMirror(resultParams.output);
		const finalAssistantVisibleText = sourceReplyMirror.delivered ? sourceReplyMirror.visibleText : text;
		const payloads = sourceReplyMirror.payloads.length > 0 ? sourceReplyMirror.payloads : sourceReplyMirror.delivered ? void 0 : text ? [resultParams.assistantTranscriptOwned ? setReplyPayloadMetadata({ text }, { assistantTranscriptOwned: true }) : { text }] : params.allowEmptyAssistantReplyAsSilent === true ? [{ text: SILENT_REPLY_TOKEN }] : void 0;
		if (resultParams.output.didSendViaMessagingTool) deliveredMessagingSideEffect = true;
		const unflushedCliSessionId = !sessionBindingDisabled && resultParams.effectiveCliSessionId && resultParams.bindingFlushOk === false ? resultParams.effectiveCliSessionId : void 0;
		const persistedCliSessionId = sessionBindingDisabled ? void 0 : unflushedCliSessionId ? void 0 : resultParams.effectiveCliSessionId;
		const createdReseedReceipt = persistedCliSessionId && resultParams.usedHistoryPrompt && isClaudeCliProvider(params.provider) && resultParams.output.finalPromptText !== void 0 && userTurnHandled && params.sessionId ? {
			version: 1,
			promptHash: hashCliReseedPrompt(resultParams.output.finalPromptText),
			localSessionId: params.sessionId,
			userTurnDisposition: params.userTurnTranscriptRecorder?.hasPersisted() ? "persisted" : "omitted"
		} : void 0;
		const preservedReseedReceipt = params.cliSessionBinding && persistedCliSessionId === params.cliSessionBinding.sessionId ? params.cliSessionBinding.reseedReceipt : void 0;
		const reseedReceipt = createdReseedReceipt ?? preservedReseedReceipt;
		const agentSessionId = sessionBindingDisabled ? params.sessionId ?? "" : unflushedCliSessionId ? "" : resultParams.effectiveCliSessionId ?? params.sessionId ?? "";
		const yielded = resultParams.output.yielded === true;
		const stopReason = yielded ? "end_turn" : "completed";
		params.onSuccessfulAuthBinding?.({
			...context.effectiveAuthProfileId ? { authProfileId: context.effectiveAuthProfileId } : {},
			...context.authBindingFingerprint ? { authFingerprint: context.authBindingFingerprint } : {},
			...!context.authBindingFingerprint && context.runtimeOwnerFingerprint ? {
				runtimeOwnerFingerprint: context.runtimeOwnerFingerprint,
				runtimeOwnerKind: "cli-runtime",
				runtimeOwnerId: context.backendResolved.id
			} : {},
			...context.runtimeArtifactFingerprint ? {
				runtimeArtifactFingerprint: context.runtimeArtifactFingerprint,
				runtimeArtifactId: context.backendResolved.id
			} : {},
			...context.authBindingSkipsLocalCredential ? { skipLocalCredential: true } : {}
		});
		return {
			payloads,
			meta: {
				durationMs: Date.now() - context.started,
				...resultParams.output.finalPromptText ? { finalPromptText: resultParams.output.finalPromptText } : {},
				...finalAssistantVisibleText || rawText ? {
					...finalAssistantVisibleText ? { finalAssistantVisibleText } : {},
					...rawText ? { finalAssistantRawText: rawText } : {}
				} : {},
				systemPromptReport: context.systemPromptReport,
				...yielded ? {
					yielded: true,
					livenessState: "paused",
					stopReason
				} : {},
				executionTrace: {
					winnerProvider: params.provider,
					winnerModel: context.modelId,
					attempts: [{
						provider: params.provider,
						model: context.modelId,
						result: "success"
					}],
					fallbackUsed: false,
					runner: "cli"
				},
				requestShaping: {
					...params.thinkLevel ? { thinking: params.thinkLevel } : {},
					...context.effectiveAuthProfileId ? { authMode: "auth-profile" } : {}
				},
				completion: {
					finishReason: yielded ? "end_turn" : "stop",
					stopReason,
					refusal: false
				},
				agentMeta: {
					sessionId: agentSessionId,
					provider: params.provider,
					model: context.modelId,
					...preparedContextAgentMeta,
					usage: resultParams.output.usage,
					...resultParams.output.usage ? { lastCallUsage: resultParams.output.usage } : {},
					...persistedCliSessionId ? { cliSessionBinding: {
						sessionId: persistedCliSessionId,
						...context.effectiveAuthProfileId ? { authProfileId: context.effectiveAuthProfileId } : {},
						...context.authEpoch ? { authEpoch: context.authEpoch } : {},
						authEpochVersion: context.authEpochVersion,
						...context.extraSystemPromptHash ? { extraSystemPromptHash: context.extraSystemPromptHash } : {},
						...context.messageToolPolicyHash ? { messageToolPolicyHash: context.messageToolPolicyHash } : {},
						...context.promptToolNamesHash ? { promptToolNamesHash: context.promptToolNamesHash } : {},
						...context.cwdHash ? { cwdHash: context.cwdHash } : {},
						...context.preparedBackend.mcpConfigHash ? { mcpConfigHash: context.preparedBackend.mcpConfigHash } : {},
						...context.preparedBackend.mcpResumeHash ? { mcpResumeHash: context.preparedBackend.mcpResumeHash } : {},
						...reseedReceipt ? { reseedReceipt } : {}
					} } : {},
					...sessionBindingDisabled || unflushedCliSessionId ? { clearCliSessionBinding: true } : {}
				}
			},
			...resultParams.output.didSendViaMessagingTool ? { didSendViaMessagingTool: true } : {},
			...resultParams.output.didDeliverSourceReplyViaMessageTool ? { didDeliverSourceReplyViaMessageTool: true } : {},
			...resultParams.output.messagingToolSentTexts?.length ? { messagingToolSentTexts: resultParams.output.messagingToolSentTexts } : {},
			...resultParams.output.messagingToolSentMediaUrls?.length ? { messagingToolSentMediaUrls: resultParams.output.messagingToolSentMediaUrls } : {},
			...resultParams.output.messagingToolSentTargets?.length ? { messagingToolSentTargets: resultParams.output.messagingToolSentTargets } : {},
			...resultParams.output.messagingToolSourceReplyPayloads?.length ? { messagingToolSourceReplyPayloads: resultParams.output.messagingToolSourceReplyPayloads } : {}
		};
	};
	const executeRun = async () => {
		await bootstrapHarnessContextEngine({
			hadSessionFile: context.hadSessionFile,
			contextEngine: context.contextEngine,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionFile: params.sessionFile,
			config: context.contextEngineConfig,
			contextEngineHostSupport: buildGenericCliContextEngineHostSupport({ backendId: context.backendResolved.id }),
			providerId: params.provider,
			modelId: context.modelId,
			warn: (message) => log.warn(message)
		});
		const contextEngineHistoryMessages = context.contextEngine ? await loadCliSessionContextEngineMessages({
			sessionId: params.sessionId,
			sessionFile: params.sessionFile,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			config: params.config
		}) : [];
		const finishCliAttempt = async (result, fallbackCliSessionId) => {
			const { output, assistantText, lastAssistant, sourceReplyWasDelivered, usedHistoryPrompt } = result;
			try {
				await assertSuccessfulCliRuntimeBindingCurrent(context);
				const effectiveCliSessionId = output.sessionId ?? fallbackCliSessionId;
				await finalizeCliContextEngineTurn({
					context,
					historyMessages: context.contextEngine ? contextEngineHistoryMessages : historyMessages,
					assistantText,
					output
				});
				const assistantTranscriptOwned = await persistCliAssistantTranscript({
					runParams: params,
					text: sourceReplyWasDelivered ? "" : assistantText,
					modelId: context.modelId,
					usage: output.usage
				});
				const bindingFlushOk = sessionBindingDisabled ? true : await isCliBindingFlushed(effectiveCliSessionId, params.provider, context.cwd ?? context.workspaceDir, { skipTranscriptProbe: shouldUseClaudeLiveSession(context) });
				await runCliAgentEndHook(params, {
					event: {
						messages: buildAgentEndMessages(lastAssistant),
						success: true,
						durationMs: Date.now() - context.started
					},
					ctx: hookContext,
					hookRunner
				});
				return buildCliRunResult({
					output,
					effectiveCliSessionId,
					bindingFlushOk,
					assistantTranscriptOwned,
					usedHistoryPrompt
				});
			} catch (error) {
				throw attachCliMessagingDeliveryEvidence(error, output);
			}
		};
		const finishDeliveredFailure = async (error) => {
			const evidence = getCliMessagingDeliveryEvidence(error);
			if (!evidence) return;
			await runCliAgentEndHook(params, {
				event: buildFailedAgentEndEvent(formatErrorMessage(error)),
				ctx: hookContext,
				hookRunner
			});
			return buildDeliveredFailureResult(error, evidence);
		};
		if (hasBeforeAgentRunHooks && hookRunner) {
			let beforeRunResult;
			try {
				beforeRunResult = await hookRunner.runBeforeAgentRun({
					prompt: params.prompt,
					systemPrompt: context.systemPrompt,
					messages: buildAgentHookConversationMessages({
						historyMessages,
						currentTurnMessages: []
					}),
					channelId: hookContext.channelId,
					accountId: params.agentAccountId,
					senderId: params.senderId ?? void 0,
					senderIsOwner: params.senderIsOwner ?? void 0
				}, buildAgentHookContext(hookContext));
			} catch {
				const blockMessage = resolveBlockMessage({
					outcome: "block",
					reason: "before_agent_run hook failed"
				}, { blockedBy: "before_agent_run" });
				await persistBlockedBeforeAgentRun({
					message: blockMessage,
					pluginId: "before_agent_run"
				});
				await runCliAgentEndHook(params, {
					event: buildBlockedAgentEndEvent(blockMessage),
					ctx: hookContext,
					hookRunner
				});
				return buildBlockedBeforeAgentRunResult(blockMessage);
			}
			const beforeRunDecision = beforeRunResult?.decision;
			if (beforeRunDecision?.outcome === "block") {
				const blockMessage = resolveBlockMessage(beforeRunDecision, { blockedBy: beforeRunResult?.pluginId ?? "unknown" });
				await persistBlockedBeforeAgentRun({
					message: blockMessage,
					pluginId: beforeRunResult?.pluginId ?? "unknown"
				});
				await runCliAgentEndHook(params, {
					event: buildBlockedAgentEndEvent(blockMessage),
					ctx: hookContext,
					hookRunner
				});
				return buildBlockedBeforeAgentRunResult(blockMessage);
			}
		}
		userTurnHandled = await persistApprovedCliUserTurnTranscript(params);
		runAgentHarnessLlmInputHook({
			event: llmInputEvent,
			ctx: hookContext,
			hookRunner
		});
		const reusableCliSessionId = resolveReusableCliSessionId(context.reusableCliSession);
		try {
			return await finishCliAttempt(await executeCliAttempt(reusableCliSessionId), reusableCliSessionId);
		} catch (err) {
			const deliveredFailure = await finishDeliveredFailure(err);
			if (deliveredFailure) return deliveredFailure;
			if (isFailoverError(err)) {
				const retryableSessionId = reusableCliSessionId;
				if (shouldRetryFreshCliSessionAfterFailover({
					error: err,
					hasHistoryPrompt: Boolean(context.openClawHistoryPrompt)
				}) && retryableSessionId && params.sessionKey) try {
					const retryTimeoutMs = params.timeoutMs - (Date.now() - context.started);
					if (retryTimeoutMs <= 0) throw err;
					if (params.onBeforeFreshCliSessionRetry) {
						if (!await params.onBeforeFreshCliSessionRetry({
							provider: params.provider,
							reason: err.reason,
							sessionId: retryableSessionId
						})) throw err;
					}
					cliBackendLog.warn(`cli session recovery retry: provider=${params.provider} reason=${err.reason} sessionKey=${params.sessionKey}`);
					return await finishCliAttempt(await executeCliAttempt(void 0, retryTimeoutMs));
				} catch (retryErr) {
					const deliveredRetryFailure = await finishDeliveredFailure(retryErr);
					if (deliveredRetryFailure) return deliveredRetryFailure;
					const retryMessage = formatErrorMessage(retryErr);
					await runCliAgentEndHook(params, {
						event: buildFailedAgentEndEvent(retryMessage),
						ctx: hookContext,
						hookRunner
					});
					return toCliRunFailure(retryErr);
				}
				await runCliAgentEndHook(params, {
					event: buildFailedAgentEndEvent(formatErrorMessage(err)),
					ctx: hookContext,
					hookRunner
				});
				throw err;
			}
			const message = formatErrorMessage(err);
			await runCliAgentEndHook(params, {
				event: buildFailedAgentEndEvent(message),
				ctx: hookContext,
				hookRunner
			});
			return toCliRunFailure(err);
		}
	};
	let runResult;
	let runError;
	let runFailed = false;
	try {
		runResult = await executeRun();
	} catch (error) {
		runFailed = true;
		runError = error;
	}
	try {
		await context.preparedBackend.cleanup?.();
	} catch (cleanupError) {
		if (!deliveredMessagingSideEffect) {
			if (runFailed) cliBackendLog.warn(`CLI run also failed before backend cleanup: ${formatErrorMessage(runError)}`);
			diagnosticLifecycle?.setPhase("cleanup");
			throw cleanupError;
		}
		cliBackendLog.warn(`CLI backend cleanup failed after confirmed message delivery: ${formatErrorMessage(cleanupError)}`);
	}
	if (runFailed) throw runError;
	if (!runResult) throw new Error("CLI run completed without a result");
	return runResult;
}
//#endregion
export { runCliAgent as n, runPreparedCliAgent as r, isCliBindingFlushed as t };
