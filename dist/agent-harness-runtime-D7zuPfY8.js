import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { l as redactToolDetail } from "./redact-DNq_HeDt.js";
import "./errors-DdbcjW1Y.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import "./utils-K2PjeLaV.js";
import "./version-CeFj_iGk.js";
import "./agent-scope-CrBA-6Gx.js";
import "./registry-D03pg4Q5.js";
import "./provider-request-config-DrrUROfX.js";
import { r as listCodexAppServerExtensionFactories } from "./registry-BSBtFA2q.js";
import { c as joinPresentTextSegments, t as getGlobalHookRunner } from "./hook-runner-global-C6QB2pJa.js";
import "./session-accessor-Mu3lv_Tl.js";
import "./model-auth-919iJVmy.js";
import "./execution-auth-binding-CmucNoqo.js";
import "./run-termination-BQ_P-sPi.js";
import "./diagnostic-CiatiVjT.js";
import { m as queueEmbeddedAgentMessageWithOutcome } from "./runs-DDczt14d.js";
import "./tools-DzbN4AH5.js";
import "./agent-end-side-effects-6JsKr3JF.js";
import "./local-model-lean-DtWpmc0Y.js";
import "./agent-tools.before-tool-call-CvBO0Qc6.js";
import "./gateway-wQ1RjFk5.js";
import "./tool-result-error-W5qOAoXI.js";
import "./logger-DTutvtjM.js";
import "./heartbeat-tool-response-B3cJVfMo.js";
import { r as resolveToolDisplay, t as formatToolDetail } from "./tool-display-DjpsCVVm.js";
import "./streaming-CeN4qI3u.js";
import "./embedded-agent-messaging-6-R0iczA.js";
import "./embedded-agent-subscribe.tools-ZSch5vg4.js";
import "./embedded-agent-message-tool-source-reply-Cf0LNR0X.js";
import "./bootstrap-files-YwSKY3O3.js";
import { g as wrapPluginSystemContextSection } from "./attempt.prompt-helpers-CxGA3lR4.js";
import "./session-write-lock-CndgqGyM.js";
import "./nodes-utils-TLOpgxbj.js";
import "./hook-helpers-ey8aD0rO.js";
import "./context-BGxLoANr.js";
import "./sandbox-fNdb3CBK.js";
import "./tools-OV4GgubX.js";
import "./tool-schema-projection-ZrMdwk4s.js";
import "./attempt-tool-construction-plan-BeSmQ2ah.js";
import "./attempt.thread-helpers-CSgI6NbT.js";
import "./attempt.tool-run-context-Cuo-wu8Q.js";
import { s as buildAgentHookContext } from "./lifecycle-hook-helpers-L479pS81.js";
import "./tool-result-middleware-BU9nGhBx.js";
import "./result-fallback-classifier--iXpZDg_.js";
import "./build-B9vAwyJq.js";
import "./native-hook-relay-6mIkwkRz.js";
//#region src/agents/harness/prompt-compaction-hook-helpers.ts
/**
* Agent harness prompt and compaction hook helpers.
*
* Harness runtimes use this to run plugin hooks around prompt construction and
* compaction while keeping hook failures non-fatal.
*/
const log$1 = createSubsystemLogger("agents/harness");
/** Runs before-prompt hooks and returns the adjusted prompt fields. */
async function resolveAgentHarnessBeforePromptBuildResult(params) {
	const hookRunner = getGlobalHookRunner();
	const hasHeartbeatContribution = params.ctx.trigger === "heartbeat" && params.bootstrapContextRunKind !== "commitment-only" && Boolean(hookRunner?.hasHooks("heartbeat_prompt_contribution"));
	if (!hasHeartbeatContribution && !hookRunner?.hasHooks("before_prompt_build")) return {
		prompt: params.prompt,
		developerInstructions: params.developerInstructions,
		promptInputRange: {
			start: 0,
			end: params.prompt.length
		}
	};
	const hookCtx = buildAgentHookContext(params.ctx);
	const promptEvent = {
		prompt: params.prompt,
		messages: params.messages
	};
	const heartbeatResult = hasHeartbeatContribution && hookRunner ? await hookRunner.runHeartbeatPromptContribution({
		sessionKey: params.ctx.sessionKey,
		agentId: params.ctx.agentId,
		heartbeatName: "heartbeat"
	}, hookCtx).catch((error) => {
		log$1.warn(`heartbeat_prompt_contribution hook failed: ${String(error)}`);
	}) : void 0;
	const promptBuildResult = hookRunner?.hasHooks("before_prompt_build") ? await hookRunner.runBeforePromptBuild(promptEvent, hookCtx).catch((error) => {
		log$1.warn(`before_prompt_build hook failed: ${String(error)}`);
	}) : void 0;
	const systemPrompt = resolvePromptBuildSystemPrompt({
		developerInstructions: params.developerInstructions,
		promptBuildResult
	});
	const promptPrefix = joinPresentTextSegments([heartbeatResult?.prependContext, promptBuildResult?.prependContext]);
	const promptSuffix = joinPresentTextSegments([heartbeatResult?.appendContext, promptBuildResult?.appendContext]);
	const prompt = joinPresentTextSegments([
		promptPrefix,
		params.prompt,
		promptSuffix
	]) ?? params.prompt;
	const promptInputStart = params.prompt.length === 0 ? promptPrefix?.length ?? 0 : promptPrefix ? promptPrefix.length + 2 : 0;
	return {
		prompt,
		developerInstructions: joinPresentTextSegments([
			wrapPluginSystemContextSection(promptBuildResult?.prependSystemContext),
			systemPrompt,
			wrapPluginSystemContextSection(promptBuildResult?.appendSystemContext)
		]) ?? systemPrompt,
		promptInputRange: {
			start: promptInputStart,
			end: promptInputStart + params.prompt.length
		}
	};
}
function resolvePromptBuildSystemPrompt(params) {
	if (typeof params.promptBuildResult?.systemPrompt === "string") return params.promptBuildResult.systemPrompt;
	return params.developerInstructions;
}
/** Runs best-effort before-compaction hooks for a harness session. */
async function runAgentHarnessBeforeCompactionHook(params) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("before_compaction")) return;
	try {
		await hookRunner.runBeforeCompaction({
			messageCount: params.messages?.length ?? -1,
			...params.messages ? { messages: params.messages } : {},
			sessionFile: params.sessionFile
		}, buildAgentHookContext(params.ctx));
	} catch (error) {
		log$1.warn(`before_compaction hook failed: ${String(error)}`);
	}
}
/** Runs best-effort after-compaction hooks for a harness session. */
async function runAgentHarnessAfterCompactionHook(params) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("after_compaction")) return;
	try {
		await hookRunner.runAfterCompaction({
			messageCount: params.messages?.length ?? -1,
			compactedCount: params.compactedCount,
			sessionFile: params.sessionFile
		}, buildAgentHookContext(params.ctx));
	} catch (error) {
		log$1.warn(`after_compaction hook failed: ${String(error)}`);
	}
}
//#endregion
//#region src/agents/harness/codex-app-server-extensions.ts
/**
* Codex app-server extension runner.
*
* Harness integration uses this to let registered extensions observe and adjust
* tool results before they are returned to the agent runtime.
*/
const log = createSubsystemLogger("agents/harness");
/** Creates a runner that applies registered Codex app-server tool-result extensions. */
function createCodexAppServerToolResultExtensionRunner(ctx, factories = listCodexAppServerExtensionFactories()) {
	const handlers = [];
	const runtime = { on(event, handler) {
		if (event === "tool_result") handlers.push(handler);
	} };
	const initPromise = (async () => {
		for (const factory of factories) await factory(runtime);
	})();
	return { async applyToolResultExtensions(event) {
		await initPromise;
		let current = event.result;
		for (const handler of handlers) try {
			const next = await handler({
				...event,
				result: current
			}, ctx);
			if (next?.result) current = next.result;
		} catch (error) {
			const detail = error instanceof Error ? error.message : String(error);
			log.warn(`[codex] tool_result extension failed for ${event.toolName}: ${detail}`);
		}
		return current;
	} };
}
//#endregion
//#region src/plugin-sdk/agent-harness-runtime.ts
/** Default truncation limit for user-facing tool progress output. */
const TOOL_PROGRESS_OUTPUT_MAX_CHARS = 8e3;
/**
* @deprecated Active-run queueing is an internal runtime concern. This legacy
* boolean API only reports immediate queue eligibility and cannot observe async
* runtime rejection; runtime-owned delivery paths should use acceptance-aware
* steering instead of public SDK queueing.
*/
function queueAgentHarnessMessage(sessionId, text, options) {
	return queueEmbeddedAgentMessageWithOutcome(sessionId, text, options).queued;
}
/** Detect prompt image references and load them through the same limits used by embedded runs. */
async function detectAndLoadAgentHarnessPromptImages(params) {
	const [{ resolveImageSanitizationLimits }, { detectAndLoadPromptImages }, { MAX_IMAGE_BYTES }] = await Promise.all([
		import("./image-sanitization-BghTEphW.js"),
		import("./images--S-Plyz8.js"),
		import("./media-core/constants.js")
	]);
	return detectAndLoadPromptImages({
		prompt: params.prompt,
		workspaceDir: params.workspaceDir,
		model: params.model,
		existingImages: params.existingImages,
		imageOrder: params.imageOrder,
		maxBytes: MAX_IMAGE_BYTES,
		maxDimensionPx: resolveImageSanitizationLimits(params.config).maxDimensionPx,
		workspaceOnly: params.workspaceOnly,
		localRoots: params.localRoots,
		sandbox: params.sandbox
	});
}
/** Load Codex bundle MCP thread config without forcing the heavy config module into SDK imports. */
async function loadCodexBundleMcpThreadConfig(params) {
	const { loadCodexBundleMcpThreadConfig: load } = await import("./codex-mcp-config-CIW2lwWG.js");
	return load(params);
}
/**
* Materialize requester-scoped MCP tools for a harness run (dynamic tools, not
* harness-native MCP config). Lazy-loaded so harness plugins avoid the MCP manager graph.
*/
async function materializeRequesterScopedMcpToolsForHarnessRun(params) {
	const { materializeRequesterScopedMcpToolsForHarnessRun: materialize } = await import("./agent-bundle-mcp-harness-TTQBrUkU.js");
	return materialize(params);
}
/** Infer compact display metadata for one tool invocation from its name and arguments. */
function inferToolMetaFromArgs(toolName, args, options) {
	return formatToolDetail(resolveToolDisplay({
		name: toolName,
		args,
		detailMode: options?.detailMode
	}));
}
/**
* Prepare verbose tool output for user-facing progress messages.
*/
function formatToolProgressOutput(output, options) {
	const trimmed = output.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
	if (!trimmed) return;
	const redacted = redactToolDetail(trimmed);
	const maxChars = options?.maxChars ?? 8e3;
	if (redacted.length <= maxChars) return redacted;
	return `${truncateUtf16Safe(redacted, maxChars)}\n...(truncated)...`;
}
/**
* Classify terminal harness turns that completed without assistant output that
* should advance fallback. Deliberate silent replies such as NO_REPLY count as
* intentional output, while whitespace-only text remains fallback-eligible.
* This is intentionally SDK-level so plugin harness adapters such as Codex
* preserve the same OpenClaw-owned fallback signals as the built-in OpenClaw path
* without re-implementing terminal-result policy.
*/
function classifyAgentHarnessTerminalOutcome(params) {
	if (!params.turnCompleted || params.promptError !== void 0 && params.promptError !== null || hasVisibleAssistantText(params.assistantTexts)) return;
	if (params.planText?.trim()) return "planning-only";
	if (params.reasoningText?.trim()) return "reasoning-only";
	return "empty";
}
function hasVisibleAssistantText(assistantTexts) {
	return assistantTexts.some((text) => text.trim().length > 0);
}
//#endregion
export { inferToolMetaFromArgs as a, queueAgentHarnessMessage as c, runAgentHarnessAfterCompactionHook as d, runAgentHarnessBeforeCompactionHook as f, formatToolProgressOutput as i, createCodexAppServerToolResultExtensionRunner as l, classifyAgentHarnessTerminalOutcome as n, loadCodexBundleMcpThreadConfig as o, detectAndLoadAgentHarnessPromptImages as r, materializeRequesterScopedMcpToolsForHarnessRun as s, TOOL_PROGRESS_OUTPUT_MAX_CHARS as t, resolveAgentHarnessBeforePromptBuildResult as u };
