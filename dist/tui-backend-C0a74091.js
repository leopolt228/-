import { i as buildAgentMainSessionKey } from "./session-key-Drrs61Fd.js";
import { k as notifyListeners } from "./agent-events-Dg0sI2pr.js";
import { t as SYSTEM_AGENT_ID } from "./agent-id-BZRNsGar.js";
import { i as loadSystemAgentOverview, r as formatSystemAgentStartupMessage } from "./overview-DI7HbHOk.js";
import { t as buildOnboardingWelcome } from "./onboarding-welcome-D20p9289.js";
import { a as resolveSystemAgentVerifiedInferenceRoute } from "./verified-inference-ItlIzSNQ.js";
import { t as executeSystemAgentOperation } from "./operations-DzQ7KANu.js";
import { n as isSystemAgentInferenceUnavailableError, t as SystemAgentInferenceUnavailableError } from "./inference-error-DBtJWCgv.js";
import { t as SystemAgentChatEngine } from "./chat-engine-B4plXGD0.js";
import { x as runTui } from "./tui-D84N__Dq.js";
import { randomUUID } from "node:crypto";
//#region src/system-agent/tui-backend.ts
const SYSTEM_AGENT_SESSION_KEY = buildAgentMainSessionKey({ agentId: SYSTEM_AGENT_ID });
function createChatEngine(opts) {
	return new SystemAgentChatEngine({
		yes: opts.yes,
		deps: opts.deps,
		planWithAssistant: opts.planWithAssistant,
		surface: "cli",
		verifiedInference: opts.verifiedInference,
		...opts.runChannelSetupWizard ? { runChannelSetupWizard: opts.runChannelSetupWizard } : {}
	});
}
async function loadOverviewForTui(opts) {
	if (opts.deps?.loadOverview) return await opts.deps.loadOverview();
	return await loadSystemAgentOverview();
}
function message(role, text) {
	return {
		role,
		content: [{
			type: "text",
			text
		}],
		timestamp: Date.now()
	};
}
function splitModelRef(ref) {
	const trimmed = ref?.trim();
	if (!trimmed) return {};
	const slash = trimmed.indexOf("/");
	if (slash <= 0 || slash >= trimmed.length - 1) return { model: trimmed };
	return {
		provider: trimmed.slice(0, slash),
		model: trimmed.slice(slash + 1)
	};
}
var SystemAgentTuiBackend = class {
	constructor(opts, welcome, engine, route) {
		this.opts = opts;
		this.route = route;
		this.connection = { url: "openclaw local" };
		this.seq = 0;
		this.engineDisposal = null;
		this.inferenceFailure = null;
		this.handoff = null;
		this.requestExit = null;
		this.responseQueue = Promise.resolve();
		this.messages = [];
		this.engine = engine;
		this.messages.push(message("assistant", welcome));
	}
	setRequestExitHandler(handler) {
		this.requestExit = handler;
		if (this.inferenceFailure) queueMicrotask(handler);
	}
	consumeHandoff() {
		const handoff = this.handoff;
		this.handoff = null;
		return handoff;
	}
	start() {
		queueMicrotask(() => {
			this.onConnected?.();
		});
	}
	stop() {}
	async sendChat(opts) {
		const runId = opts.runId ?? randomUUID();
		const text = opts.message.trim();
		this.messages.push(message("user", opts.message));
		const response = this.responseQueue.then(() => this.respond(runId, opts.sessionKey, text));
		this.responseQueue = response.catch(() => void 0);
		return { runId };
	}
	async abortChat() {
		return {
			ok: true,
			aborted: false
		};
	}
	async loadHistory() {
		return {
			sessionId: "openclaw",
			messages: this.messages,
			thinkingLevel: this.route.thinkingLevel,
			verboseLevel: "off"
		};
	}
	async listSessions() {
		return {
			ts: Date.now(),
			path: "openclaw",
			count: 1,
			defaults: {
				model: this.route.model ?? null,
				modelProvider: this.route.modelProvider ?? null,
				contextTokens: null
			},
			sessions: [{
				key: SYSTEM_AGENT_SESSION_KEY,
				sessionId: "openclaw",
				displayName: "OpenClaw",
				updatedAt: Date.now(),
				thinkingLevel: this.route.thinkingLevel,
				verboseLevel: "off",
				model: this.route.model,
				modelProvider: this.route.modelProvider
			}]
		};
	}
	async listAgents() {
		return {
			defaultId: SYSTEM_AGENT_ID,
			mainKey: "main",
			scope: "per-sender",
			agents: [{
				id: SYSTEM_AGENT_ID,
				name: "OpenClaw"
			}]
		};
	}
	async patchSession(opts) {
		if (opts.model !== void 0) throw new Error("OpenClaw cannot change the model inside its active verified session. Exit and run `openclaw onboard`, then start OpenClaw again.");
		return {
			ok: true,
			path: "openclaw",
			key: SYSTEM_AGENT_SESSION_KEY,
			entry: {
				sessionId: "openclaw",
				displayName: "OpenClaw",
				updatedAt: Date.now()
			},
			resolved: {}
		};
	}
	async resetSession() {
		if (this.inferenceFailure) throw this.inferenceFailure;
		await this.disposeEngine();
		this.engine = createChatEngine(this.opts);
		this.engineDisposal = null;
		const overview = await loadOverviewForTui(this.opts);
		this.messages.splice(0, this.messages.length, message("assistant", formatSystemAgentStartupMessage(overview)));
		return { ok: true };
	}
	async createSession(_opts) {
		await this.resetSession();
		return {
			ok: true,
			key: SYSTEM_AGENT_SESSION_KEY,
			entry: {
				sessionId: "openclaw",
				updatedAt: Date.now()
			}
		};
	}
	async getGatewayStatus() {
		return (await loadOverviewForTui(this.opts)).gateway.reachable ? "Gateway reachable" : "Gateway unreachable";
	}
	async listModels() {
		return [];
	}
	async dispose() {
		try {
			await this.disposeEngine();
		} catch (error) {
			if (!this.inferenceFailure) throw error;
		}
	}
	disposeEngine() {
		this.engineDisposal ??= this.engine.dispose();
		return this.engineDisposal;
	}
	nextSeq() {
		this.seq += 1;
		return this.seq;
	}
	emit(event, payload) {
		const listener = this.onEvent;
		if (!listener) return;
		notifyListeners([listener], {
			event,
			payload,
			seq: this.nextSeq()
		});
	}
	emitFinal(runId, sessionKey, text) {
		const assistant = message("assistant", text || "OpenClaw listened and found nothing to change.");
		this.messages.push(assistant);
		this.emit("chat", {
			runId,
			sessionKey,
			state: "final",
			message: assistant
		});
	}
	emitError(runId, sessionKey, error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		this.emit("chat", {
			runId,
			sessionKey,
			state: "error",
			errorMessage
		});
	}
	async respond(runId, sessionKey, text) {
		if (this.inferenceFailure) {
			this.emitError(runId, sessionKey, this.inferenceFailure);
			queueMicrotask(() => this.requestExit?.());
			return;
		}
		try {
			const reply = await this.engine.handle(text);
			if ((reply.action === "open-tui" || reply.action === "open-setup") && reply.handoff) {
				this.handoff = reply.handoff;
				queueMicrotask(() => this.requestExit?.());
			} else if (reply.action === "exit") queueMicrotask(() => this.requestExit?.());
			this.emitFinal(runId, sessionKey, reply.text);
		} catch (error) {
			if (isSystemAgentInferenceUnavailableError(error)) {
				this.inferenceFailure = error;
				this.handoff = null;
				try {
					await this.disposeEngine();
				} catch {}
				this.emitError(runId, sessionKey, error);
				queueMicrotask(() => this.requestExit?.());
				return;
			}
			this.emitError(runId, sessionKey, error);
		}
	}
};
async function runSetupHandoff(handoff, opts, runtime) {
	if (handoff.target !== "channels") {
		runtime.error("Setup cannot replace the inference route powering OpenClaw. Exit and run `openclaw onboard`, then start OpenClaw again.");
		return;
	}
	const runChannelsAdd = opts.runChannelsAdd ?? (await import("./add-oDqsx7PY.js")).channelsAddCommand;
	const beforePersistentEffect = async () => {
		const binding = opts?.verifiedInference;
		if (!binding) throw new SystemAgentInferenceUnavailableError("conversation");
		try {
			const { resolvePersistentApplyInference } = await import("./system-agent/setup-inference.js");
			if (await resolvePersistentApplyInference({
				binding,
				runtime,
				deps: opts.deps
			})) return;
		} catch (error) {
			if (isSystemAgentInferenceUnavailableError(error)) throw error;
			throw new SystemAgentInferenceUnavailableError("conversation", [error]);
		}
		throw new SystemAgentInferenceUnavailableError("conversation");
	};
	await runChannelsAdd(handoff.channel ? { channel: handoff.channel } : {}, runtime, {
		hasFlags: false,
		beforePersistentEffect
	});
}
async function runSystemAgentTui(opts, runtime) {
	const binding = opts?.verifiedInference;
	if (!binding) throw new SystemAgentInferenceUnavailableError("conversation");
	const boundOpts = {
		...opts,
		verifiedInference: binding
	};
	let nextInput;
	let welcomeVariant = boundOpts.welcomeVariant;
	for (;;) {
		const route = await requireTuiVerifiedInference(boundOpts);
		const initialMessage = nextInput;
		const engine = createChatEngine(boundOpts);
		let welcome;
		if (welcomeVariant === "onboarding") welcome = (await buildOnboardingWelcome({
			engine,
			...boundOpts.setupWorkspace ? { workspace: boundOpts.setupWorkspace } : {}
		})).text;
		else {
			welcome = formatSystemAgentStartupMessage(await loadOverviewForTui(boundOpts));
			engine.noteAssistantMessage(welcome);
		}
		welcomeVariant = void 0;
		const backend = new SystemAgentTuiBackend(boundOpts, welcome, engine, route);
		const runTui$1 = boundOpts.runTui ?? runTui;
		try {
			await runTui$1({
				local: true,
				session: SYSTEM_AGENT_SESSION_KEY,
				historyLimit: 200,
				backend,
				config: {},
				title: "openclaw setup",
				...initialMessage ? { message: initialMessage } : {}
			});
		} finally {
			await backend.dispose();
		}
		const handoff = backend.consumeHandoff();
		if (!handoff) return;
		if (handoff.kind === "model-setup") {
			runtime.error("OpenClaw cannot replace its active inference route. Run `openclaw onboard` outside this session, then start OpenClaw again.");
			return;
		}
		if (handoff.kind === "open-setup") {
			await runSetupHandoff(handoff, boundOpts, runtime);
			return;
		}
		const result = await executeSystemAgentOperation(handoff, runtime, {
			approved: true,
			deps: boundOpts.deps
		});
		nextInput = result.nextInput;
		if (!nextInput?.trim() && !result.returnToShell) return;
	}
}
async function requireTuiVerifiedInference(opts) {
	const binding = opts?.verifiedInference;
	if (!binding) throw new SystemAgentInferenceUnavailableError("conversation");
	try {
		const route = await resolveSystemAgentVerifiedInferenceRoute(binding, opts.deps);
		if (route) {
			const [{ loadPreparedModelCatalog }, { resolveThinkingDefault }] = await Promise.all([import("./prepared-model-catalog-C7ceMjSu.js"), import("./model-thinking-default-CrJShgSf.js")]);
			const catalog = await loadPreparedModelCatalog({
				config: route.runConfig,
				agentId: route.agentId,
				agentDir: route.agentDir,
				readOnly: true
			}).catch(() => void 0);
			const model = splitModelRef(route.modelLabel);
			return {
				model: model.model,
				modelProvider: model.provider,
				thinkingLevel: resolveThinkingDefault({
					cfg: route.runConfig,
					provider: route.provider,
					model: route.model,
					catalog
				})
			};
		}
	} catch (error) {
		throw new SystemAgentInferenceUnavailableError("conversation", [error]);
	}
	throw new SystemAgentInferenceUnavailableError("conversation");
}
//#endregion
export { runSystemAgentTui };
