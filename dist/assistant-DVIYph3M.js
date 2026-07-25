import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import "./agent-scope-CrBA-6Gx.js";
import { o as resolveAgentWorkspaceDir } from "./agent-scope-config-S7z_Yn4H.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-xuKL7EBL.js";
import { a as resolveSystemAgentVerifiedInferenceRoute, i as resolveSystemAgentExpectedAgentHarnessRuntimeArtifact } from "./verified-inference-ItlIzSNQ.js";
import { t as SystemAgentInferenceUnavailableError } from "./inference-error-DBtJWCgv.js";
import { c as parseSystemAgentAssistantPlanText, i as SYSTEM_AGENT_GREETING_SYSTEM_PROMPT, n as SYSTEM_AGENT_ASSISTANT_SYSTEM_PROMPT, o as buildSystemAgentAssistantUserPrompt, r as SYSTEM_AGENT_ASSISTANT_TIMEOUT_MS, s as buildSystemAgentGreetingUserPrompt, t as SYSTEM_AGENT_ASSISTANT_LOCAL_TIMEOUT_MS } from "./assistant-prompts-BOkeccny.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/system-agent/assistant-timeout.ts
function resolveSystemAgentAssistantTimeoutFromManifests(params) {
	const providers = /* @__PURE__ */ new Set([normalizeProviderId(params.route.provider), normalizeProviderId(params.route.modelLabel.split("/", 1)[0] ?? "")]);
	return params.plugins.some((plugin) => Object.entries(plugin.modelPricing?.providers ?? {}).some(([provider, pricing]) => providers.has(normalizeProviderId(provider)) && pricing.external === false)) ? SYSTEM_AGENT_ASSISTANT_LOCAL_TIMEOUT_MS : SYSTEM_AGENT_ASSISTANT_TIMEOUT_MS;
}
function resolveSystemAgentAssistantTimeoutMs(route) {
	try {
		const workspaceDir = resolveAgentWorkspaceDir(route.runConfig, route.agentId);
		return resolveSystemAgentAssistantTimeoutFromManifests({
			route,
			plugins: resolvePluginMetadataSnapshot({
				config: route.runConfig,
				workspaceDir,
				env: process.env,
				allowWorkspaceScopedCurrent: true
			}).plugins
		});
	} catch {
		return SYSTEM_AGENT_ASSISTANT_TIMEOUT_MS;
	}
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.systemAgentTimeoutTestApi")] = { resolveSystemAgentAssistantTimeoutFromManifests };
//#endregion
//#region src/system-agent/assistant.ts
async function planSystemAgentCommand(params) {
	return await planSystemAgentCommandWithConfiguredModel(params);
}
/** Plan only through the configured default agent's verified route. */
async function planSystemAgentCommandWithConfiguredModel(params) {
	const input = params.input.trim();
	if (!input) return null;
	const result = await runConfiguredSystemAgentText({
		prompt: buildSystemAgentAssistantUserPrompt({
			input,
			overview: params.overview,
			...params.history ? { history: params.history } : {},
			...params.pendingOperation ? { pendingOperation: params.pendingOperation } : {}
		}),
		systemPrompt: SYSTEM_AGENT_ASSISTANT_SYSTEM_PROMPT,
		runIdPrefix: "openclaw-planner",
		verifiedInference: params.verifiedInference,
		deps: params.deps
	});
	const parsed = parseSystemAgentAssistantPlanText(result?.text);
	return parsed && result ? {
		...parsed,
		modelLabel: result.modelLabel
	} : null;
}
/** One tool-free, verified inference turn for the cached caretaker greeting. */
async function planSystemAgentGreetingWithConfiguredModel(params) {
	const result = await runConfiguredSystemAgentText({
		prompt: buildSystemAgentGreetingUserPrompt(params),
		systemPrompt: SYSTEM_AGENT_GREETING_SYSTEM_PROMPT,
		runIdPrefix: "openclaw-greeting",
		verifiedInference: params.verifiedInference,
		deps: params.deps,
		timeoutMs: params.timeoutMs
	});
	return result ? {
		text: result.text,
		modelRef: result.modelLabel
	} : null;
}
async function runConfiguredSystemAgentText(params) {
	const route = await requireVerifiedPlannerRoute(params.verifiedInference, params.deps);
	let expectedAgentHarnessRuntimeArtifact;
	try {
		expectedAgentHarnessRuntimeArtifact = resolveSystemAgentExpectedAgentHarnessRuntimeArtifact(params.verifiedInference);
	} catch (error) {
		throw new SystemAgentInferenceUnavailableError("planner", [error]);
	}
	const tempDir = await (params.deps?.createTempDir ?? createTempPlannerDir)();
	let text;
	try {
		const runId = `${params.runIdPrefix}-${randomUUID()}`;
		const timeoutMs = params.timeoutMs ?? (params.deps?.resolveAssistantTimeoutMs ?? resolveSystemAgentAssistantTimeoutMs)(route);
		const shared = {
			sessionId: `${runId}-session`,
			agentId: "openclaw",
			trigger: "manual",
			sessionFile: path.join(tempDir, "session.jsonl"),
			workspaceDir: tempDir,
			cwd: tempDir,
			agentDir: route.agentDir,
			config: route.runConfig,
			prompt: params.prompt,
			provider: route.provider,
			model: route.model,
			timeoutMs,
			thinkLevel: "off",
			runId,
			extraSystemPrompt: params.systemPrompt,
			extraSystemPromptStatic: params.systemPrompt,
			messageChannel: "openclaw",
			messageProvider: "openclaw",
			disableTools: true,
			disableTrajectory: true,
			...route.authProfileId ? { authProfileId: route.authProfileId } : {}
		};
		text = extractPlannerResultText(route.runner === "cli" ? await (params.deps?.runCliAgent ?? (await import("./cli-runner-D3UxLbG3.js")).runCliAgent)({
			...shared,
			executionMode: "side-question",
			cleanupCliLiveSessionOnRunEnd: true
		}) : await (params.deps?.runEmbeddedAgent ?? (await import("./embedded-agent-p-G43BJq.js")).runEmbeddedAgent)({
			...shared,
			toolsAllow: [],
			agentHarnessRuntimeOverride: route.agentHarnessRuntimeOverride,
			...expectedAgentHarnessRuntimeArtifact ? { expectedAgentHarnessRuntimeArtifact } : {},
			cleanupBundleMcpOnRunEnd: true,
			...route.authProfileId ? { authProfileIdSource: "user" } : {}
		}))?.trim();
	} catch (error) {
		if (error instanceof SystemAgentInferenceUnavailableError) throw error;
		text = void 0;
	} finally {
		await (params.deps?.removeTempDir ?? removeTempPlannerDir)(tempDir);
	}
	if (!text) return null;
	await requireVerifiedPlannerRoute(params.verifiedInference, params.deps);
	return {
		text,
		modelLabel: route.modelLabel
	};
}
async function requireVerifiedPlannerRoute(binding, deps) {
	if (!binding) throw new SystemAgentInferenceUnavailableError("planner");
	try {
		const route = await resolveSystemAgentVerifiedInferenceRoute(binding, deps);
		if (route) return route;
	} catch (error) {
		throw new SystemAgentInferenceUnavailableError("planner", [error]);
	}
	throw new SystemAgentInferenceUnavailableError("planner");
}
async function createTempPlannerDir() {
	return await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-planner-"));
}
async function removeTempPlannerDir(dir) {
	await fs.rm(dir, {
		recursive: true,
		force: true
	});
}
function extractPlannerResultText(result) {
	return result.meta?.finalAssistantVisibleText ?? result.meta?.finalAssistantRawText ?? result.payloads?.map((payload) => payload.text?.trim()).filter(Boolean).join("\n");
}
//#endregion
export { planSystemAgentCommand, planSystemAgentGreetingWithConfiguredModel };
