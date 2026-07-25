import { x as resolveStateDir } from "./paths-CHQRdQZ3.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { i as buildAgentMainSessionKey } from "./session-key-Drrs61Fd.js";
import { t as isSensitiveConfigPath } from "./sensitive-paths-DYIyGcFS.js";
import { t as SYSTEM_AGENT_ID } from "./agent-id-BZRNsGar.js";
import { i as resolveCliBackendConfig } from "./cli-backends-Bd-NX5h4.js";
import { i as loadSystemAgentOverview } from "./overview-DI7HbHOk.js";
import { a as resolveSystemAgentVerifiedInferenceRoute, i as resolveSystemAgentExpectedAgentHarnessRuntimeArtifact } from "./verified-inference-ItlIzSNQ.js";
import { a as parseSystemAgentOperation, i as isPersistentSystemAgentOperation, n as describeSystemAgentPersistentOperation, t as executeSystemAgentOperation } from "./operations-DzQ7KANu.js";
import { n as hashSystemAgentOperation } from "./system-agent-tool-BLfonbSD.js";
import { n as isSystemAgentInferenceUnavailableError, t as SystemAgentInferenceUnavailableError } from "./inference-error-DBtJWCgv.js";
import { t as approvalQuestion } from "./dialogue-CFsPSok1.js";
import { n as classifySystemAgentApprovalText } from "./approval-intent-ByqGm6Ct.js";
import { o as normalizeCliModel } from "./helpers-CH03IdKf.js";
import { t as WizardSession } from "./session-BrK_AQzo.js";
import { a as SYSTEM_AGENT_SYSTEM_PROMPT } from "./assistant-prompts-BOkeccny.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/system-agent/agent-turn.ts
/**
* OpenClaw is a real agent: same loop, session transcript, and tool pipeline
* as regular agents — restricted to the single ring-zero `openclaw` tool.
* Embedded runtimes enforce that restriction with toolsAllow. CLI harnesses
* must explicitly support per-run native-tool selection, then receive the tool
* over a dedicated stdio MCP server that replaces the normal bundle surface.
* Turns share one persistent session so the conversation has genuine
* multi-turn memory. Inference setup must succeed before this runner is entered.
*/
const AGENT_TURN_TIMEOUT_MS = 12e4;
const SYSTEM_AGENT_MCP_TOOL_NAME = "mcp__openclaw__openclaw";
function createSystemAgentSession(verifiedInference) {
	if (!verifiedInference) throw new SystemAgentInferenceUnavailableError("agent-turn");
	return {
		sessionId: `openclaw-${randomUUID()}`,
		verifiedInference,
		proposalRef: {}
	};
}
function extractRunText(result) {
	return result.meta?.finalAssistantVisibleText ?? result.meta?.finalAssistantRawText ?? result.payloads?.map((payload) => payload.text?.trim()).filter(Boolean).join("\n");
}
async function ensureSystemAgentDirs(sessionId) {
	const base = path.join(resolveStateDir(), "openclaw");
	const workspaceDir = path.join(base, "workspace");
	await fs.mkdir(workspaceDir, { recursive: true });
	await fs.mkdir(path.join(base, "sessions"), { recursive: true });
	return {
		workspaceDir,
		sessionFile: path.join(base, "sessions", `${sessionId}.jsonl`)
	};
}
async function cleanupSystemAgentSession(session) {
	const sessionFile = path.join(resolveStateDir(), "openclaw", "sessions", `${session.sessionId}.jsonl`);
	delete session.cliSession;
	await fs.rm(sessionFile, { force: true });
}
function clearSystemAgentCliSession(session) {
	delete session.cliSession;
}
function clearFailedSystemAgentSessionState(session) {
	session.proposalRef.current = void 0;
	session.proposalRef.operation = void 0;
	clearSystemAgentCliSession(session);
}
function throwSystemAgentInferenceUnavailable(params) {
	clearFailedSystemAgentSessionState(params.session);
	throw new SystemAgentInferenceUnavailableError("agent-turn", params.failures);
}
function cliRouteKey(route, backend) {
	return JSON.stringify({
		provider: route.provider,
		backendId: backend?.id ?? route.provider,
		modelLabel: route.modelLabel,
		configuredModel: route.model,
		model: backend ? normalizeCliModel(route.model, backend.config) : route.model,
		authProfileId: route.authProfileId ?? "",
		agentDir: path.resolve(route.agentDir),
		backend: backend ? {
			pluginId: backend.pluginId,
			modelProvider: backend.modelProvider,
			config: backend.config,
			bundleMcp: backend.bundleMcp,
			bundleMcpMode: backend.bundleMcpMode,
			authEpochMode: backend.authEpochMode,
			nativeToolMode: backend.nativeToolMode,
			sideQuestionToolMode: backend.sideQuestionToolMode
		} : null
	});
}
function resolveSystemAgentCliBackend(route) {
	const backend = resolveCliBackendConfig(route.provider, route.runConfig, { agentId: SYSTEM_AGENT_ID });
	if (!backend) return null;
	const { liveSession: _liveSession, ...config } = backend.config;
	return {
		...backend,
		config
	};
}
function resolveSystemAgentCliToolAvailability(backend) {
	if (backend?.nativeToolMode === "none") return;
	if (backend?.nativeToolMode === "selectable" && backend.resolveExecutionArgs) return {
		native: [],
		mcp: [SYSTEM_AGENT_MCP_TOOL_NAME]
	};
	const backendId = backend?.id ?? "unknown";
	throw new Error(`CLI backend ${backendId} cannot enforce OpenClaw's exact tool availability`);
}
/**
* CLI harnesses run the openclaw tool in a stdio MCP subprocess, so the
* in-process proposalRef/directiveRef cannot be shared with the host. Mirror
* the tool's transitions from the harness tool events instead: a denial
* registers the exact-operation hash, a mismatch voids it, an executed
* mutation consumes it, and directive actions replay the interactive handoff —
* same lifecycle as system-agent-tool.ts enforces.
*/
async function mirrorSystemAgentToolStateFromEvents(params) {
	const [{ onAgentEvent }, { extractToolResultText }, { resolveSystemAgentProposalTransition, resolveSystemAgentDirectiveTransition }] = await Promise.all([
		import("./agent-events-QrtaD--k.js"),
		import("./embedded-agent-subscribe.tools-DIWX1oXs.js"),
		import("./system-agent-tool-BEH-POLt.js")
	]);
	return onAgentEvent((evt) => {
		if (evt.runId !== params.runId || evt.stream !== "tool" || evt.data.phase !== "result") return;
		const name = typeof evt.data.name === "string" ? evt.data.name : "";
		if (name !== "openclaw" && !name.endsWith("__openclaw")) return;
		const args = typeof evt.data.args === "object" && evt.data.args !== null ? evt.data.args : {};
		const resultText = extractToolResultText(evt.data.result) ?? "";
		const transition = resolveSystemAgentProposalTransition({
			args,
			resultText
		});
		if (transition) {
			params.proposalRef.current = transition.proposal;
			params.proposalRef.operation = transition.operation;
		}
		const directive = resolveSystemAgentDirectiveTransition({
			args,
			resultText
		});
		if (directive && params.directiveRef.current?.kind !== "approved-operation") params.directiveRef.current = directive;
	});
}
/**
* Run one OpenClaw turn through the embedded agent loop. Route, runner, and
* output failures are typed so callers may try another inference path without
* mistaking the failure for deterministic setup authority.
*/
async function runSystemAgentTurnWithDeps(params, deps = {}) {
	const binding = params.session.verifiedInference;
	if (!binding) return throwSystemAgentInferenceUnavailable({ session: params.session });
	let plan;
	try {
		plan = await resolveSystemAgentVerifiedInferenceRoute(binding, deps);
	} catch (error) {
		return throwSystemAgentInferenceUnavailable({
			session: params.session,
			failures: [error]
		});
	}
	if (!plan) return throwSystemAgentInferenceUnavailable({ session: params.session });
	let expectedAgentHarnessRuntimeArtifact;
	try {
		expectedAgentHarnessRuntimeArtifact = resolveSystemAgentExpectedAgentHarnessRuntimeArtifact(binding);
	} catch (error) {
		return throwSystemAgentInferenceUnavailable({
			session: params.session,
			failures: [error]
		});
	}
	let workspaceDir;
	let sessionFile;
	try {
		({workspaceDir, sessionFile} = await ensureSystemAgentDirs(params.session.sessionId));
	} catch (error) {
		return throwSystemAgentInferenceUnavailable({
			session: params.session,
			failures: [error]
		});
	}
	const runId = `openclaw-turn-${randomUUID()}`;
	const shared = {
		sessionId: params.session.sessionId,
		sessionKey: buildAgentMainSessionKey({ agentId: SYSTEM_AGENT_ID }),
		agentId: SYSTEM_AGENT_ID,
		trigger: "manual",
		sessionFile,
		workspaceDir,
		config: plan.runConfig,
		prompt: params.input,
		timeoutMs: AGENT_TURN_TIMEOUT_MS,
		thinkLevel: "off",
		runId,
		messageChannel: "openclaw",
		messageProvider: "openclaw"
	};
	const directiveRef = {};
	const systemAgentTool = {
		surface: params.surface,
		approvalArmed: params.approvalArmed,
		proposalRef: params.session.proposalRef,
		directiveRef
	};
	try {
		let result;
		if (plan.runner === "cli") {
			const backend = resolveSystemAgentCliBackend(plan);
			const cliToolAvailability = resolveSystemAgentCliToolAvailability(backend);
			const routeKey = cliRouteKey(plan, backend);
			const previousBinding = params.session.cliSession?.routeKey === routeKey ? params.session.cliSession.binding : void 0;
			if (!previousBinding) clearSystemAgentCliSession(params.session);
			const runCli = deps.runCliAgent ?? (await import("./cli-runner-D3UxLbG3.js")).runCliAgent;
			const stopToolStateMirror = await mirrorSystemAgentToolStateFromEvents({
				runId,
				proposalRef: params.session.proposalRef,
				directiveRef
			});
			try {
				result = await runCli({
					...shared,
					provider: plan.provider,
					model: plan.model,
					agentDir: plan.agentDir,
					...plan.authProfileId ? { authProfileId: plan.authProfileId } : {},
					extraSystemPrompt: SYSTEM_AGENT_SYSTEM_PROMPT,
					extraSystemPromptStatic: SYSTEM_AGENT_SYSTEM_PROMPT,
					systemAgentTool,
					...cliToolAvailability ? { cliToolAvailability } : {},
					...previousBinding ? { cliSessionBinding: previousBinding } : {},
					disableCliLiveSession: true,
					cleanupCliLiveSessionOnRunEnd: true
				});
			} finally {
				stopToolStateMirror();
			}
			const agentMeta = result.meta?.agentMeta;
			if (agentMeta?.clearCliSessionBinding || !agentMeta?.cliSessionBinding?.sessionId) clearSystemAgentCliSession(params.session);
			else if (agentMeta?.cliSessionBinding?.sessionId) params.session.cliSession = {
				routeKey,
				binding: agentMeta.cliSessionBinding
			};
		} else {
			clearSystemAgentCliSession(params.session);
			result = await (deps.runEmbeddedAgent ?? (await import("./embedded-agent-p-G43BJq.js")).runEmbeddedAgent)({
				...shared,
				extraSystemPrompt: SYSTEM_AGENT_SYSTEM_PROMPT,
				toolsAllow: ["openclaw"],
				systemAgentTool,
				disableMessageTool: true,
				provider: plan.provider,
				model: plan.model,
				agentDir: plan.agentDir,
				agentHarnessRuntimeOverride: plan.agentHarnessRuntimeOverride,
				...expectedAgentHarnessRuntimeArtifact ? { expectedAgentHarnessRuntimeArtifact } : {},
				...plan.authProfileId ? {
					authProfileId: plan.authProfileId,
					authProfileIdSource: "user"
				} : {}
			});
		}
		if (params.session.verifiedInference !== binding) throw new SystemAgentInferenceUnavailableError("agent-turn");
		if (!await resolveSystemAgentVerifiedInferenceRoute(binding, deps)) throw new SystemAgentInferenceUnavailableError("agent-turn");
		const text = extractRunText(result)?.trim();
		if (!text) throw new SystemAgentInferenceUnavailableError("agent-turn");
		return {
			text,
			modelLabel: plan.modelLabel,
			...directiveRef.current ? { directive: directiveRef.current } : {}
		};
	} catch (error) {
		const failures = error instanceof SystemAgentInferenceUnavailableError ? [...error.failures] : [error];
		return throwSystemAgentInferenceUnavailable({
			session: params.session,
			failures
		});
	}
}
const runSystemAgentTurn = (params) => runSystemAgentTurnWithDeps(params);
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.systemAgentTurnTestApi")] = { runSystemAgentTurnWithDeps };
//#endregion
//#region src/system-agent/operator-approval.ts
function resolvePendingOperatorProposal(pending, proposalRef) {
	const operation = pending ?? proposalRef.operation;
	if (!operation || !isPersistentSystemAgentOperation(operation)) return null;
	const hash = hashSystemAgentOperation(operation);
	if (proposalRef.current && proposalRef.current !== hash) return null;
	proposalRef.current = hash;
	proposalRef.operation = operation;
	return {
		operation,
		hash
	};
}
async function resolveOperatorApprovalDecision(params) {
	const proposal = params.getProposal();
	if (!proposal || proposal.hash !== params.proposalHash) return null;
	if (params.decision !== "allow-once") {
		params.clear();
		return params.denied();
	}
	return await params.apply(`[operator-approved] Human approved ${params.proposalHash}. Apply exact proposal; approved=true.`);
}
//#endregion
//#region src/system-agent/post-write-verification.ts
function unavailable(reason) {
	return [`⚠ The write was applied, but post-write verification is unavailable: ${reason}.`, "Run `openclaw doctor --fix`, then verify the configuration before continuing."].join("\n");
}
async function verifyConfigAfterSystemAgentWrite(resolveRepair) {
	let issuesText;
	try {
		const { readConfigFileSnapshot } = await import("./config/config.js");
		const snapshot = await readConfigFileSnapshot();
		if (!snapshot.exists) return unavailable("openclaw.json was not found");
		if (snapshot.valid) return null;
		const issues = (snapshot.issues ?? []).map((issue) => `${issue.path ? `${issue.path}: ` : ""}${issue.message}`);
		issuesText = issues.length > 0 ? issues.join("\n") : "unknown validation failure";
	} catch {
		return unavailable("openclaw.json could not be read");
	}
	const notice = `⚠ openclaw.json failed validation after that write:\n${issuesText}`;
	let recovery;
	try {
		recovery = await resolveRepair(`[config-verify] The config file is now invalid:\n${issuesText}\nPropose one corrective command from the allowed list.`);
	} catch (error) {
		if (!isSystemAgentInferenceUnavailableError(error)) throw error;
		return `${notice}\nThe write was applied, but inference could not propose a repair. Run \`openclaw doctor --fix\`, then try again.`;
	}
	return recovery.text ? `${notice}\n\n${recovery.text}` : `${notice}\nExit OpenClaw and run \`openclaw doctor --fix\`, or use \`config schema <path>\` to check the expected shape before leaving.`;
}
//#endregion
//#region src/system-agent/chat-engine.ts
const log = createSubsystemLogger("system-agent/chat-engine");
function createHostedWizardRuntime(runtime) {
	return {
		...runtime,
		exit: (code) => {
			throw new Error(`hosted wizard exited with code ${String(code)}`);
		}
	};
}
function createCaptureRuntime() {
	const lines = [];
	return {
		log: (...args) => lines.push(args.join(" ")),
		error: (...args) => lines.push(args.join(" ")),
		exit: (code) => {
			throw new Error(`OpenClaw operation exited with code ${String(code)}`);
		},
		read: () => lines.join("\n").trim()
	};
}
function defaultChannelSetupWizardRunner(channel, beforePersistentApply) {
	return async (prompter) => {
		const [{ readSetupConfigFileSnapshot, writeWizardConfigFile }, { createChannelOnboardingPostWriteHookCollector, runCollectedChannelOnboardingPostWriteHooks, setupChannels }] = await Promise.all([import("./setup.shared-DH3PG3Ri.js"), import("./onboard-channels-CFRMM7RU.js")]);
		const snapshot = await readSetupConfigFileSnapshot();
		if (!snapshot.exists || !snapshot.valid || !snapshot.hash) throw new Error("Channel setup requires a valid saved config snapshot. Run `openclaw doctor --fix`, then retry.");
		const baseConfig = snapshot.sourceConfig ?? snapshot.config;
		const baseHash = snapshot.hash;
		const { defaultRuntime } = await import("./runtime-CRHWG0Vd.js");
		const runtime = createHostedWizardRuntime(defaultRuntime);
		const postWriteHooks = createChannelOnboardingPostWriteHookCollector();
		const nextConfig = await setupChannels(baseConfig, runtime, prompter, {
			initialSelection: [channel],
			forceAllowFromChannels: [channel],
			allowIMessageInstall: true,
			allowSignalInstall: true,
			deferStatusUntilSelection: true,
			quickstartDefaults: true,
			skipDmPolicyPrompt: true,
			skipConfirm: true,
			beforePersistentEffect: async () => await beforePersistentApply(runtime),
			onPostWriteHook: (hook) => postWriteHooks.collect(hook)
		});
		await beforePersistentApply(runtime);
		const committedConfig = await writeWizardConfigFile(nextConfig, {
			allowConfigSizeDrop: false,
			baseHash,
			migrationBaseConfig: baseConfig
		});
		await runCollectedChannelOnboardingPostWriteHooks({
			hooks: postWriteHooks.drain(),
			cfg: committedConfig,
			runtime,
			beforePersistentEffect: async () => await beforePersistentApply(runtime)
		});
	};
}
function formatWizardOptions(step) {
	return (step.options ?? []).map((option, index) => {
		const hint = option.hint ? ` — ${option.hint}` : "";
		return `${index + 1}. ${option.label}${hint}`;
	});
}
/**
* Mirror the awaited wizard step as a typed question for card clients. Only
* closed choices small enough for cards qualify; everything else stays text.
* Option replies are labels/yes/no because parseWizardAnswer matches those.
*/
function wizardStepChatQuestion(step) {
	if (!step) return;
	if (step.type === "confirm") {
		const yesRecommended = step.initialValue !== false;
		return {
			id: step.id,
			header: step.title ?? "Confirm",
			question: step.message ?? "Continue?",
			options: [{
				label: "Yes",
				reply: "yes",
				...yesRecommended ? { recommended: true } : {}
			}, {
				label: "No",
				reply: "no",
				...!yesRecommended ? { recommended: true } : {}
			}]
		};
	}
	if (step.type !== "select") return;
	const options = step.options ?? [];
	if (options.length < 2 || options.length > 4) return;
	return {
		id: step.id,
		header: step.title ?? "Choose one",
		question: step.message ?? "Choose one.",
		options: options.map((option) => {
			const mapped = { label: option.label };
			if (option.hint) mapped.description = option.hint;
			if (step.initialValue !== void 0 && option.value === step.initialValue) mapped.recommended = true;
			return mapped;
		})
	};
}
function renderWizardStep(step) {
	const lines = [];
	if (step.title) lines.push(`**${step.title}**`);
	if (step.message) lines.push(step.message);
	switch (step.type) {
		case "select":
			lines.push(...formatWizardOptions(step), "Reply with a number.");
			break;
		case "multiselect":
			lines.push(...formatWizardOptions(step), "Reply with numbers (e.g. 1,3) or `none`.");
			break;
		case "confirm":
			lines.push("Reply yes or no.");
			break;
		case "text":
			if (step.placeholder) lines.push(`(e.g. ${step.placeholder})`);
			lines.push("Type your answer.");
			break;
		default: break;
	}
	lines.push("Say `cancel` to stop this setup.");
	return lines.filter(Boolean).join("\n");
}
/** Map a chat reply to a wizard step answer; null means "could not parse". */
function parseWizardAnswer(step, text) {
	const trimmed = text.trim();
	if (step.type === "confirm") {
		const intent = classifySystemAgentApprovalText(trimmed);
		if (intent === "approve") return { value: true };
		if (intent === "decline") return { value: false };
		return null;
	}
	if (step.type === "text") return { value: trimmed };
	const options = step.options ?? [];
	const matchOption = (token) => {
		const index = Number(token);
		if (Number.isInteger(index) && index >= 1 && index <= options.length) return options[index - 1];
		const lower = token.toLowerCase();
		return options.find((option) => option.label.toLowerCase() === lower || typeof option.value === "string" && option.value.toLowerCase() === lower);
	};
	if (step.type === "select") {
		const option = matchOption(trimmed);
		return option ? { value: option.value } : null;
	}
	if (step.type === "multiselect") {
		if (/^none$/i.test(trimmed)) return { value: [] };
		const tokens = trimmed.split(/[\s,]+/).map((token) => token.trim()).filter(Boolean);
		const values = [];
		for (const token of tokens) {
			const option = matchOption(token);
			if (!option) return null;
			values.push(option.value);
		}
		return { value: values };
	}
	return { value: step.type === "action" ? true : void 0 };
}
function formatOperationError(error) {
	return `That did not go through: ${error instanceof Error ? error.message : String(error)}`;
}
/**
* A typed `config set` against a sensitive path carries a raw secret; the
* stored history feeds future planner prompts (and CLI-harness transcripts),
* so the value is masked the same way hosted-wizard secrets are.
*/
function redactSensitiveCommandText(text) {
	const operation = parseSystemAgentOperation(text);
	if (operation.kind === "config-set" && isSensitiveConfigPath(operation.path)) return `config set ${operation.path} <redacted secret>`;
	return text;
}
function formatPendingOperationForAssistant(operation) {
	const description = describeSystemAgentPersistentOperation(operation);
	return operation.kind === "setup" ? `${description}. Exact setup JSON: ${JSON.stringify(operation)}. Keep the verified model unless the user explicitly asks to leave OpenClaw and reconfigure inference.` : description;
}
function preservePendingSetupModel(pending, operation) {
	if (pending?.kind !== "setup" || operation.kind !== "setup") return operation;
	const pendingModel = pending.model?.trim();
	const requestedModel = operation.model?.trim();
	if (requestedModel && requestedModel !== pendingModel) return operation;
	return {
		...operation,
		...requestedModel ? {} : pendingModel ? { model: pendingModel } : {}
	};
}
var SystemAgentChatEngine = class {
	constructor(opts) {
		this.opts = opts;
		this.pending = null;
		this.wizardBridge = null;
		this.awaitingSetupChannel = false;
		this.history = [];
		this.turnQueue = Promise.resolve();
		const binding = opts?.verifiedInference;
		if (!binding) throw new SystemAgentInferenceUnavailableError("conversation");
		this.verifiedInference = binding;
		this.agentSession = createSystemAgentSession(binding);
	}
	/**
	* Seed a proposed operation that the user's next approval will apply. Used
	* by first-run onboarding: the welcome message states the plan, the user
	* just agrees.
	*/
	propose(operation) {
		this.clearPendingProposals();
		this.pending = operation;
		return describeSystemAgentPersistentOperation(operation);
	}
	hasPendingProposal() {
		return this.pending !== null;
	}
	getPendingOperatorProposal() {
		return resolvePendingOperatorProposal(this.pending, this.agentSession.proposalRef);
	}
	async resolveOperatorApproval(decision, proposalHash) {
		const turn = this.turnQueue.then(async () => {
			const reply = await resolveOperatorApprovalDecision({
				decision,
				proposalHash,
				getProposal: () => this.getPendingOperatorProposal(),
				clear: () => this.clearPendingProposals(),
				apply: (message) => this.pending ? this.applyPendingProposal() : this.resolveAssistantTurn(message, true),
				denied: () => ({
					text: "Denied. No change.",
					action: "none"
				})
			});
			if (reply?.text) this.history.push({
				role: "assistant",
				text: reply.text
			});
			return reply;
		});
		this.turnQueue = turn.catch(() => void 0);
		return await turn;
	}
	/** Record a host-rendered assistant message (welcome) so AI turns see it. */
	noteAssistantMessage(text) {
		this.history.push({
			role: "assistant",
			text
		});
	}
	/** Seed only conversational context; wizard and approval state intentionally stay fresh. */
	seedHistory(turns) {
		this.history.push(...turns.map((turn) => ({ ...turn })));
	}
	historyLength() {
		return this.history.length;
	}
	/** Return copies so the server can persist exactly the engine's sanitized commit. */
	historySince(index) {
		return this.history.slice(index).map((turn) => ({
			role: turn.role,
			text: turn.text
		}));
	}
	async dispose() {
		this.wizardBridge?.session.cancel();
		this.wizardBridge = null;
		this.lastSensitiveChannel = void 0;
		this.awaitingSetupChannel = false;
		await cleanupSystemAgentSession(this.agentSession);
	}
	async handle(text) {
		const turn = this.turnQueue.then(() => this.handleSerialized(text));
		this.turnQueue = turn.catch(() => void 0);
		return await turn;
	}
	async handleSerialized(text) {
		await this.requireVerifiedInference();
		const sensitiveTurn = this.wizardBridge?.step?.sensitive === true;
		const reply = await this.resolveTurn(text);
		this.history.push({
			role: "user",
			text: sensitiveTurn ? "<redacted secret>" : redactSensitiveCommandText(text)
		});
		if (reply.text) this.history.push({
			role: "assistant",
			text: reply.text
		});
		const question = wizardStepChatQuestion(this.wizardBridge?.step ?? null);
		return {
			...reply,
			...this.wizardBridge?.step?.sensitive === true ? { sensitive: true } : {},
			...this.wizardBridge ? { wizardInputPending: true } : {},
			...question ? { question } : {}
		};
	}
	async resolveTurn(text) {
		if (this.wizardBridge) return {
			text: await this.resolveWizardBridgeReply(text),
			action: "none"
		};
		const trimmed = text.trim();
		if (!trimmed) return {
			text: "Tiny claw tap: tell me what you want — setup, repair, channels, anything config.",
			action: "none"
		};
		if (/^(quit|exit)$/i.test(trimmed)) return {
			text: "OpenClaw retracts into shell. Bye.",
			action: "exit"
		};
		if (this.awaitingSetupChannel) {
			if (/^(cancel|abort|stop)$/i.test(trimmed)) {
				this.awaitingSetupChannel = false;
				return {
					text: "Channel wizard handoff cancelled.",
					action: "none"
				};
			}
			if (!/^[a-z0-9_-]+$/i.test(trimmed)) return {
				text: "Reply with one channel id, such as `slack` or `telegram`, or say `cancel`.",
				action: "none"
			};
			this.awaitingSetupChannel = false;
			return await this.runOperation({
				kind: "open-setup",
				target: "channels",
				channel: trimmed.toLowerCase()
			}, void 0);
		}
		if (this.opts.operatorApprovalOnly && this.getPendingOperatorProposal()) return {
			text: "Approval pending. Human must decide in OpenClaw UI.",
			action: "none"
		};
		const typed = parseSystemAgentOperation(text);
		if (typed.kind === "config-set" && isSensitiveConfigPath(typed.path)) return await this.runOperation(typed, void 0);
		const typedRefusal = this.refuseDelegatedNavigationDirective(typed.kind);
		if (typedRefusal) return {
			text: typedRefusal,
			action: "none"
		};
		if (typed.kind === "open-tui") {
			this.clearPendingProposals();
			return await this.runOperation(typed, void 0);
		}
		if (typed.kind === "open-setup" || typed.kind === "channel-setup" || typed.kind === "model-setup") return await this.runOperation(typed, void 0);
		const intent = this.opts.operatorApprovalOnly ? "other" : await this.classifyApprovalIntent(text);
		if (this.pending) {
			if (intent === "approve") {
				await this.requireVerifiedInference();
				return await this.applyPendingProposal();
			}
			if (intent === "decline") {
				const skippedModelSetup = this.pending.kind === "model-setup";
				this.clearPendingProposals();
				this.hostProposalResolution = "declined";
				return {
					text: skippedModelSetup ? "Skipped. The current inference route is unchanged." : "Skipped. No barnacles on config today.",
					action: "none"
				};
			}
		}
		if (intent === "decline") {
			this.agentSession.proposalRef.current = void 0;
			this.agentSession.proposalRef.operation = void 0;
		}
		return await this.resolveAssistantTurn(text, this.opts.operatorApprovalOnly ? false : intent === "approve");
	}
	async classifyApprovalIntent(text) {
		if (!(this.pending !== null || this.agentSession.proposalRef.current !== void 0)) return "other";
		return await (this.opts.classifyApproval ?? (await import("./approval-intent-BMaZcQ4Y.js")).classifySystemAgentApprovalIntent)({
			message: text,
			...this.pending ? { proposal: describeSystemAgentPersistentOperation(this.pending) } : {},
			verifiedInference: this.verifiedInference
		});
	}
	async applyPendingProposal() {
		const pending = this.pending;
		this.clearPendingProposals();
		this.hostProposalResolution = "approved";
		if (!pending) return {
			text: "",
			action: "none"
		};
		if (pending.kind === "channel-setup") return {
			text: await this.startChannelSetupWizard(pending.channel),
			action: "none"
		};
		if (pending.kind === "model-setup") return await this.startModelSetup(pending.workspace);
		if (!isPersistentSystemAgentOperation(pending)) return await this.runOperation(pending, void 0);
		return await this.applyApprovedPersistentOperation(pending);
	}
	async applyApprovedPersistentOperation(operation) {
		if (!isPersistentSystemAgentOperation(operation)) throw new Error(`OpenClaw host received a non-persistent approved operation.`);
		const capture = createCaptureRuntime();
		let result;
		try {
			result = await (this.opts.executeOperation ?? executeSystemAgentOperation)(operation, capture, {
				approved: true,
				deps: this.commandDeps(),
				beforePersistentApply: async () => {
					await this.requirePersistentApplyInference(capture);
				},
				onVerifiedInferenceChanged: (binding) => this.rebindVerifiedInference(binding)
			});
		} catch (error) {
			if (isSystemAgentInferenceUnavailableError(error)) throw error;
			capture.error(formatOperationError(error));
		}
		const verify = result?.applied ? await this.verifyConfigAfterWrite() : null;
		const followUp = this.armFollowUp(result?.followUp);
		const baseText = [
			capture.read() || "Applied. Audit entry written.",
			verify,
			followUp
		].filter(Boolean).join("\n\n");
		if ((operation.kind === "setup" || operation.kind === "create-agent") && result?.applied && result.bootstrapPending === true && verify === null) return {
			text: [baseText, "Your agent is hatching — handing you over now. You can always find me in Settings → Ask OpenClaw."].join("\n\n"),
			action: "open-tui",
			agentDraft: "hatch",
			handoff: {
				kind: "open-tui",
				agentDraft: "hatch",
				...operation.workspace ? { workspace: operation.workspace } : {},
				...result.agentId ? { agentId: result.agentId } : {}
			}
		};
		return {
			text: baseText,
			action: "none"
		};
	}
	/**
	* AI turn: the OpenClaw persona answers and acts through the ring-zero
	* tool. The single-turn planner is a second inference path; if neither path
	* answers, the turn fails closed instead of executing model-free guesses.
	*/
	async resolveAssistantTurn(text, approvalArmed) {
		const overview = await this.loadOverview();
		const agentTurn = this.opts.runAgentTurn ?? runSystemAgentTurn;
		const resolutionMarker = this.hostProposalResolution ? `[host-proposal-resolved] The previously host-seeded proposal was ${this.hostProposalResolution}. Do not present it as pending.\n` : "";
		let agentFailure;
		let loopReply;
		try {
			loopReply = await agentTurn({
				input: `${resolutionMarker}${this.pending ? `[pending-proposal] Awaiting the user's approval: ${formatPendingOperationForAssistant(this.pending)}. It is already host-seeded; if they want it (or a variant), drive it through the openclaw tool yourself.\n${text}` : text}`,
				overview,
				surface: this.opts.surface ?? "cli",
				approvalArmed,
				session: this.agentSession
			});
		} catch (error) {
			agentFailure = error;
			loopReply = null;
		}
		if (loopReply?.text) {
			this.hostProposalResolution = void 0;
			if (loopReply.directive) this.clearPendingProposals();
			else if (this.agentSession.proposalRef.current !== void 0) this.pending = null;
			return await this.applyAgentTurnReply(loopReply);
		}
		const planner = this.opts.planWithAssistant ?? (await import("./assistant-DVIYph3M.js")).planSystemAgentCommand;
		let plannerFailure;
		let plan;
		try {
			plan = await planner({
				input: text,
				overview,
				history: this.history,
				...this.pending ? { pendingOperation: formatPendingOperationForAssistant(this.pending) } : {},
				verifiedInference: this.verifiedInference
			});
			if (plan) await this.requireVerifiedInference();
		} catch (error) {
			plannerFailure = error;
			plan = null;
		}
		if (!plan) throw new SystemAgentInferenceUnavailableError("conversation", [agentFailure, plannerFailure].filter((failure) => failure !== void 0));
		const replyText = plan.reply ?? "";
		if (!plan.command) {
			if (!replyText.trim()) throw new SystemAgentInferenceUnavailableError("planner", [agentFailure]);
			return {
				text: replyText,
				action: "none"
			};
		}
		const operation = preservePendingSetupModel(this.pending, parseSystemAgentOperation(plan.command));
		if (operation.kind === "none") {
			if (!replyText.trim()) throw new SystemAgentInferenceUnavailableError("planner", [agentFailure]);
			return {
				text: replyText,
				action: "none"
			};
		}
		const provenance = `(${plan.modelLabel ?? "model"} → \`${plan.command}\`)`;
		const executed = await this.runOperation(operation, provenance);
		return {
			...executed,
			text: [replyText, executed.text].filter(Boolean).join("\n\n")
		};
	}
	async applyAgentTurnReply(loopReply) {
		await this.requireVerifiedInference();
		const refusal = this.refuseDelegatedNavigationDirective(loopReply.directive?.kind);
		if (refusal) return {
			text: [loopReply.text, refusal].filter(Boolean).join("\n\n"),
			action: "none"
		};
		if (loopReply.directive?.kind === "approved-operation") {
			const applied = await this.applyApprovedPersistentOperation(loopReply.directive.operation);
			return {
				...applied,
				text: [loopReply.text, applied.text].filter(Boolean).join("\n\n")
			};
		}
		if (loopReply.directive?.kind === "channel-setup") {
			const wizardIntro = await this.startChannelSetupWizard(loopReply.directive.channel);
			return {
				text: [loopReply.text, wizardIntro].filter(Boolean).join("\n\n"),
				action: "none"
			};
		}
		if (loopReply.directive?.kind === "model-setup") {
			const setup = await this.startModelSetup(loopReply.directive.workspace);
			return {
				...setup,
				text: [loopReply.text, setup.text].filter(Boolean).join("\n\n")
			};
		}
		if (loopReply.directive?.kind === "open-tui") {
			this.clearPendingProposals();
			return {
				text: loopReply.text,
				action: "open-tui",
				handoff: loopReply.directive
			};
		}
		if (loopReply.directive?.kind === "open-setup") {
			const handoff = await this.runOperation(loopReply.directive, void 0);
			return {
				...handoff,
				text: [loopReply.text, handoff.text].filter(Boolean).join("\n\n")
			};
		}
		return {
			text: loopReply.text,
			action: "none"
		};
	}
	refuseDelegatedNavigationDirective(kind) {
		if (!this.opts.operatorApprovalOnly) return;
		if (kind === "channel-setup" || kind === "model-setup" || kind === "open-setup" || kind === "open-tui") return "Channel, model, and setup flows need a human operator in the OpenClaw app; they cannot run from a delegated agent request.";
	}
	async runOperation(operation, provenance) {
		await this.requireVerifiedInference();
		if (operation.kind === "open-tui") {
			this.clearPendingProposals();
			return {
				text: "Opening your normal agent TUI. Use /openclaw there to come back.",
				action: "open-tui",
				handoff: operation
			};
		}
		if (operation.kind === "open-setup") {
			this.clearPendingProposals();
			if (this.opts.surface === "gateway") return {
				text: "The app owns the setup screens here — use Settings, or run `openclaw onboard` in a terminal.",
				action: "none"
			};
			if (operation.target !== "channels") return {
				text: "Setup can replace the inference route powering this session. Exit OpenClaw and run `openclaw onboard`; it saves only a route that passes a live test. Then start OpenClaw again.",
				action: "none"
			};
			let handoff = operation;
			if (handoff.target === "channels" && !handoff.channel) {
				const channel = this.lastSensitiveChannel;
				if (!channel) {
					this.awaitingSetupChannel = true;
					return {
						text: "Which channel should I open in the masked terminal wizard?",
						action: "none"
					};
				}
				this.lastSensitiveChannel = void 0;
				handoff = {
					...handoff,
					channel
				};
			}
			this.awaitingSetupChannel = false;
			return {
				text: `Opening the ${handoff.target === "channels" ? `${handoff.channel ?? "channel"} setup` : "setup"} wizard.`,
				action: "open-setup",
				handoff
			};
		}
		if (operation.kind === "channel-setup") return {
			text: await this.startChannelSetupWizard(operation.channel),
			action: "none"
		};
		if (operation.kind === "model-setup") return await this.startModelSetup(operation.workspace);
		const capture = createCaptureRuntime();
		if (isPersistentSystemAgentOperation(operation) && !this.opts.yes) {
			this.clearPendingProposals();
			this.pending = operation;
			await executeSystemAgentOperation(operation, capture, {
				approved: false,
				deps: this.commandDeps()
			});
			return {
				text: [
					provenance,
					capture.read(),
					approvalQuestion(operation)
				].filter(Boolean).join("\n\n"),
				action: "none"
			};
		}
		let result;
		try {
			result = await (this.opts.executeOperation ?? executeSystemAgentOperation)(operation, capture, {
				approved: this.opts.yes === true || !isPersistentSystemAgentOperation(operation),
				deps: this.commandDeps(),
				beforePersistentApply: async () => {
					await this.requirePersistentApplyInference(capture);
				},
				onVerifiedInferenceChanged: (binding) => this.rebindVerifiedInference(binding)
			});
		} catch (error) {
			if (isSystemAgentInferenceUnavailableError(error)) throw error;
			capture.error(formatOperationError(error));
		}
		const verify = result?.applied ? await this.verifyConfigAfterWrite() : null;
		const followUp = this.armFollowUp(result?.followUp);
		const reply = [
			provenance,
			capture.read(),
			verify,
			followUp
		].filter(Boolean).join("\n\n");
		if (operation.kind === "none" && reply.includes("Bye.")) return {
			text: reply,
			action: "exit"
		};
		return {
			text: reply,
			action: "none"
		};
	}
	async loadOverview() {
		const verifiedRoute = await this.requireVerifiedInference();
		return {
			...this.opts.deps?.loadOverview ? await this.opts.deps.loadOverview() : await loadSystemAgentOverview(),
			defaultModel: verifiedRoute.modelLabel
		};
	}
	async planGreeting(params) {
		const planner = this.opts.planGreeting;
		const plan = planner ? await planner(params) : await import("./assistant-DVIYph3M.js").then(({ planSystemAgentGreetingWithConfiguredModel }) => planSystemAgentGreetingWithConfiguredModel({
			...params,
			verifiedInference: this.verifiedInference,
			deps: this.opts.deps
		}));
		if (plan) await this.requireVerifiedInference();
		return plan;
	}
	async requireVerifiedInference() {
		const binding = this.verifiedInference;
		if (this.agentSession.verifiedInference !== binding) return this.throwInferenceUnavailable();
		try {
			const route = await resolveSystemAgentVerifiedInferenceRoute(binding, this.opts.deps);
			if (route) return route;
		} catch (error) {
			return this.throwInferenceUnavailable([error]);
		}
		return this.throwInferenceUnavailable();
	}
	async requirePersistentApplyInference(runtime) {
		const binding = this.verifiedInference;
		if (this.agentSession.verifiedInference !== binding) return this.throwInferenceUnavailable();
		try {
			const { resolvePersistentApplyInference } = await import("./system-agent/setup-inference.js");
			const route = await resolvePersistentApplyInference({
				binding,
				runtime,
				deps: this.opts.deps
			});
			if (route) return route;
		} catch (error) {
			if (isSystemAgentInferenceUnavailableError(error)) return this.throwInferenceUnavailable(error.failures, false);
			return this.throwInferenceUnavailable([error], false);
		}
		return this.throwInferenceUnavailable([], false);
	}
	rebindVerifiedInference(binding) {
		if (binding.execution.agentId !== this.verifiedInference.execution.agentId) return;
		delete this.agentSession.cliSession;
		this.verifiedInference = binding;
		this.agentSession.verifiedInference = binding;
	}
	throwInferenceUnavailable(failures = [], cancelWizard = true) {
		this.pending = null;
		this.hostProposalResolution = void 0;
		this.agentSession.proposalRef.current = void 0;
		this.agentSession.proposalRef.operation = void 0;
		delete this.agentSession.cliSession;
		if (cancelWizard) this.wizardBridge?.session.cancel();
		this.wizardBridge = null;
		this.lastSensitiveChannel = void 0;
		this.awaitingSetupChannel = false;
		this.history.splice(0);
		throw new SystemAgentInferenceUnavailableError("conversation", failures);
	}
	/**
	* Post-write hook: re-validate openclaw.json after every applied operation.
	* On failure the exact schema issues go straight back into the conversation
	* (and to the AI, which proposes one corrective command) so a bad write is
	* caught and fixed in the same chat instead of surfacing at gateway start.
	*/
	async verifyConfigAfterWrite() {
		return await verifyConfigAfterSystemAgentWrite((message) => this.resolveAssistantTurn(message, false));
	}
	commandDeps() {
		if (!this.opts.deps && !this.opts.surface) return;
		return {
			...this.opts.deps,
			...this.opts.surface ? { setupSurface: this.opts.surface } : {}
		};
	}
	clearPendingProposals() {
		this.pending = null;
		this.agentSession.proposalRef.current = void 0;
		this.agentSession.proposalRef.operation = void 0;
	}
	armFollowUp(operation) {
		if (operation?.kind !== "model-setup") return null;
		return ["No usable inference route is configured, so OpenClaw cannot continue.", "Exit and run `openclaw onboard`; it saves only a route that passes a live test."].join("\n");
	}
	async startChannelSetupWizard(channel) {
		this.clearPendingProposals();
		this.lastSensitiveChannel = void 0;
		const beforePersistentApply = async (runtime) => {
			await this.requirePersistentApplyInference(runtime);
		};
		const runWizard = this.opts.runChannelSetupWizard ?? ((ch, prompter, guard) => defaultChannelSetupWizardRunner(ch, guard)(prompter));
		const session = new WizardSession((prompter) => runWizard(channel, prompter, beforePersistentApply));
		this.wizardBridge = {
			session,
			step: null,
			label: channel,
			autoSelectChannel: channel
		};
		return await this.pumpWizardBridge();
	}
	async startModelSetup(_workspace) {
		this.clearPendingProposals();
		return {
			text: ["Changing provider credentials would replace the inference route powering this session.", "Exit OpenClaw and run `openclaw onboard`; it stages credentials, live-tests the new route, and saves only a passing setup. Then start OpenClaw again."].join("\n"),
			action: "none"
		};
	}
	/**
	* "connect telegram" already names the channel; answer the wizard's channel
	* selection step automatically instead of echoing the full channel wall.
	*/
	tryAutoSelectChannel(step) {
		const bridge = this.wizardBridge;
		const channel = bridge?.autoSelectChannel;
		if (!bridge || !channel) return null;
		if (step.type !== "select" && step.type !== "multiselect") return null;
		const match = (step.options ?? []).find((option) => typeof option.value === "string" && option.value.toLowerCase() === channel);
		if (!match) return null;
		bridge.autoSelectChannel = void 0;
		return { value: step.type === "multiselect" ? [match.value] : match.value };
	}
	/** Advance the hosted wizard to the next interactive step (or completion). */
	async pumpWizardBridge() {
		const bridge = this.wizardBridge;
		if (!bridge) return "";
		const result = await bridge.session.next();
		if (result.done) {
			this.wizardBridge = null;
			const label = bridge.label;
			if (result.status === "done") {
				try {
					await (this.opts.appendAuditEntry ?? (await import("./system-agent/audit.js")).appendSystemAgentAuditEntry)({
						operation: "channels.setup",
						summary: `Configured channel ${label} via chat setup`,
						details: { channel: label }
					});
				} catch (error) {
					log.warn(`channel setup completed without audit entry: ${formatErrorMessage(error)}`);
				}
				const verify = await this.verifyConfigAfterWrite();
				return [
					`Done — ${label} is configured.`,
					"Say `restart gateway` to apply channel changes, or `channels` to review.",
					verify ?? ""
				].filter(Boolean).join("\n");
			}
			if (result.status === "cancelled") return "Channel setup cancelled. Nothing was changed beyond completed steps.";
			return `Channel setup stopped: ${result.error ?? "unknown error"}`;
		}
		bridge.step = result.step ?? null;
		if (bridge.step) {
			const auto = this.tryAutoSelectChannel(bridge.step);
			if (auto) {
				const step = bridge.step;
				bridge.step = null;
				await bridge.session.answer(step.id, auto.value);
				return await this.pumpWizardBridge();
			}
			if (this.opts.surface === "cli" && bridge.step.sensitive === true) {
				bridge.session.cancel();
				this.wizardBridge = null;
				this.lastSensitiveChannel = bridge.label;
				return ["Sensitive input is not accepted in the OpenClaw chat because terminal input is visible.", `Say \`open channel wizard\` and I'll hand you to the masked terminal wizard for ${bridge.label}, or run \`openclaw channels add --channel ${bridge.label}\` yourself later.`].join("\n");
			}
			if (bridge.step.type === "note" || bridge.step.type === "progress") {
				const step = bridge.step;
				bridge.step = null;
				await bridge.session.answer(step.id, void 0);
				const next = await this.pumpWizardBridge();
				return [renderWizardStep(step), next].filter(Boolean).join("\n\n");
			}
			if (bridge.step.type === "action" && bridge.step.executor !== "client") {
				const step = bridge.step;
				bridge.step = null;
				await bridge.session.answer(step.id, true);
				return await this.pumpWizardBridge();
			}
		}
		return bridge.step ? renderWizardStep(bridge.step) : "";
	}
	async resolveWizardBridgeReply(text) {
		const bridge = this.wizardBridge;
		if (!bridge) return "";
		if (/^(cancel|abort|stop|quit|exit)$/i.test(text.trim())) {
			bridge.session.cancel();
			return await this.pumpWizardBridge();
		}
		const step = bridge.step;
		if (!step) return await this.pumpWizardBridge();
		const answer = parseWizardAnswer(step, text);
		if (!answer) return ["I could not match that answer.", renderWizardStep(step)].join("\n");
		const validationError = await bridge.session.answer(step.id, answer.value);
		if (validationError) return [validationError, renderWizardStep(step)].join("\n\n");
		return await this.pumpWizardBridge();
	}
};
//#endregion
export { SystemAgentChatEngine as t };
