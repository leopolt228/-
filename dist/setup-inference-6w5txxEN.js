import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-COWbwBfI.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import "./utils-K2PjeLaV.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { s as normalizePluginTargetConfig } from "./config-state-rO7K73Ka.js";
import { i as resolveAgentModelPrimaryValue, n as normalizeAgentModelRefForConfig } from "./model-input-B7OGjVYg.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { c as resolveDefaultAgentId, r as resolveAgentConfig } from "./agent-scope-config-S7z_Yn4H.js";
import { O as createMergePatch } from "./io-CEgS2K9F.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-DqR_mVNH.js";
import { n as enablePluginInConfig } from "./enable-DsCTg972.js";
import { S as resolveModelRefFromString, i as buildModelAliasIndex } from "./model-selection-shared-CPPxIJAX.js";
import { i as modelKey, o as normalizeProviderId$1, r as legacyModelKey } from "./model-selection-normalize-D7Dhjaxs.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-CV4VBWUf.js";
import { t as applyMergePatch } from "./merge-patch-v6a67_Hq.js";
import { o as loadPersistedAuthProfileStore } from "./persisted-BCOBzYGx.js";
import { n as resolvePluginProviders } from "./providers.runtime-rdUuPAIP.js";
import { c as readGeminiCliCredentialsCached, o as readClaudeCliCredentialsCached } from "./external-auth-YSE72NiU.js";
import { u as loadAuthProfileStoreForRuntime, v as updateAuthProfileStoreWithLock } from "./store-BTcmQtbp.js";
import "./model-selection-Dx2ArePR.js";
import { l as normalizeAuthProfileCredential } from "./profiles-C6oqGGG6.js";
import { t as listRecommendedToolInstalls } from "./recommended-tool-installs-BYuK9jI2.js";
import { i as resolveCliBackendConfig } from "./cli-backends-Bd-NX5h4.js";
import { a as describeFailoverError } from "./failover-error-B8xHNn2y.js";
import { t as buildAgentRuntimeAuthPlan } from "./auth-DO-YLivZ.js";
import { a as probeLocalCommand } from "./overview-DI7HbHOk.js";
import { n as resolveManifestProviderAuthChoice, r as resolveManifestProviderAuthChoices } from "./provider-auth-choices-BqQ_qaxJ.js";
import { a as runProviderPluginAuthMethodUnpersisted, n as applyProviderPluginAuthMethodResultConfig } from "./provider-auth-choice-C6-OW3cA.js";
import { i as appendSystemAgentAuditEntry } from "./audit-DahVIjyb.js";
import { i as sameDefaultInferenceRoute, n as projectInferenceRoute, r as resolveSystemAgentConfiguredRouteFromConfig, t as projectDefaultInferenceRoute } from "./inference-route-qXzDFODa.js";
import { n as loadAuthoredSetupConfig } from "./onboarding-welcome-D20p9289.js";
import { a as resolveSystemAgentVerifiedInferenceRoute, n as createSystemAgentVerifiedInferenceBinding, r as hasCurrentSystemAgentOwnerPluginArtifacts, t as captureSystemAgentOwnerPluginArtifacts } from "./verified-inference-ItlIzSNQ.js";
import { i as createSystemAgentModelSelectionUpdater, r as createQuickstartNotePrompter, t as applySystemAgentModelSelection } from "./setup-apply-C-y1GT_i.js";
import { t as compareProviderAuthChoiceGroups } from "./provider-auth-choice-order-CiFFDn0D.js";
import { randomInt, randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/onboard-inference.ts
/**
* Onboarding treats inference as the one required step: reuse whatever the
* machine already has (env API keys, Claude Code login, Codex login) before
* asking the user anything. The ladder order is a documented contract
* (docs/cli/setup.md "Setup bootstrap") — change docs when changing it.
*/
const OPENAI_API_DEFAULT_MODEL_REF = "openai/gpt-5.6";
const ANTHROPIC_API_DEFAULT_MODEL_REF = "anthropic/claude-opus-4-8";
const CLAUDE_CLI_DEFAULT_MODEL_REF = "claude-cli/claude-opus-4-8";
const CODEX_APP_SERVER_DEFAULT_MODEL_REF = "openai/gpt-5.6-sol";
const GEMINI_CLI_DEFAULT_MODEL_REF = "google-gemini-cli/gemini-3.1-pro-preview";
function detectCliCredentialState(params) {
	if (!params.probe.found) return;
	if (params.hasStoredCredentials) return true;
	return params.platform === "darwin" ? void 0 : false;
}
function describeCliDetail(credentials, loginHint) {
	if (credentials === true) return "logged in";
	if (credentials === false) return `installed, not logged in — ${loginHint}, then check again`;
	return "installed";
}
async function detectCodexLoginState(probe, command) {
	if (!(await probe(command, ["login", "status"], { timeoutMs: 3e3 })).error) return true;
}
function randomizeClaudeCodexTie(candidates, pickRandomInt) {
	const claudeIndex = candidates.findIndex((candidate) => candidate.kind === "claude-cli" && candidate.credentials !== false);
	const codexIndex = candidates.findIndex((candidate) => candidate.kind === "codex-cli" && candidate.credentials !== false);
	if (claudeIndex === -1 || codexIndex === -1 || pickRandomInt(2) === 0) return;
	const claudeCandidate = candidates[claudeIndex];
	const codexCandidate = candidates[codexIndex];
	candidates[claudeIndex] = expectDefined(codexCandidate, "Codex onboarding candidate");
	candidates[codexIndex] = expectDefined(claudeCandidate, "Claude onboarding candidate");
}
const CODEX_MACOS_APP_NAMES = [
	"ChatGPT.app",
	"Codex.app",
	"Codex Beta.app"
];
async function probeCodexCommand(params) {
	const pathProbe = await params.probe("codex");
	if (pathProbe.found || params.platform !== "darwin") return pathProbe;
	const home = params.env.HOME?.trim() || os.homedir();
	const appExecutables = new Set(CODEX_MACOS_APP_NAMES.flatMap((appName) => [path.join("/Applications", appName, "Contents", "Resources", "codex"), path.join(home, "Applications", appName, "Contents", "Resources", "codex")]));
	for (const executable of appExecutables) {
		const appProbe = await params.probe(executable);
		if (appProbe.found) return appProbe;
	}
	return pathProbe;
}
/** Detects a native Codex App Server without coupling it to inference selection. */
async function detectNativeCodexAppServer(options = {}) {
	return await probeCodexCommand({
		probe: options.probeLocalCommand ?? probeLocalCommand,
		env: options.env ?? process.env,
		platform: options.platform ?? process.platform
	});
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.onboardInferenceTestApi")] = { detectNativeCodexAppServer };
/**
* Detect usable inference backends in ladder order. Returns candidates only
* for backends that exist on this machine; the first entry is the bootstrap
* default. Backends that are definitively logged out sink below logged-in and
* unknown ones so a stale install never outranks a working login.
*/
async function detectInferenceBackends(options = {}) {
	const env = options.env ?? process.env;
	const platform = options.platform ?? process.platform;
	const probe = options.deps?.probeLocalCommand ?? probeLocalCommand;
	const readClaude = options.deps?.readClaudeCliCredentials ?? (() => readClaudeCliCredentialsCached({
		allowKeychainPrompt: false,
		ttlMs: 6e4
	}));
	const readGemini = options.deps?.readGeminiCliCredentials ?? (() => readGeminiCliCredentialsCached({ ttlMs: 6e4 }));
	const candidates = [];
	const defaultAgentId = options.config ? resolveDefaultAgentId(options.config) : void 0;
	if (resolveAgentModelPrimaryValue(options.config ? resolveAgentConfig(options.config, resolveDefaultAgentId(options.config))?.model : void 0) ?? resolveAgentModelPrimaryValue(options.config?.agents?.defaults?.model)) {
		const resolved = resolveDefaultModelForAgent({
			cfg: options.config ?? {},
			...defaultAgentId ? { agentId: defaultAgentId } : {}
		});
		candidates.push({
			kind: "existing-model",
			modelRef: `${resolved.provider}/${resolved.model}`,
			label: "Current model",
			detail: "already configured",
			credentials: true
		});
	}
	if (env.OPENAI_API_KEY?.trim()) candidates.push({
		kind: "openai-api-key",
		modelRef: OPENAI_API_DEFAULT_MODEL_REF,
		label: "OpenAI API key",
		detail: "OPENAI_API_KEY set",
		credentials: true
	});
	if (env.ANTHROPIC_API_KEY?.trim()) candidates.push({
		kind: "anthropic-api-key",
		modelRef: ANTHROPIC_API_DEFAULT_MODEL_REF,
		label: "Anthropic API key",
		detail: "ANTHROPIC_API_KEY set",
		credentials: true
	});
	const [claudeProbe, codexProbe, geminiProbe] = await Promise.all([
		probe("claude"),
		detectNativeCodexAppServer({
			probeLocalCommand: probe,
			env,
			platform
		}),
		probe("gemini")
	]);
	const cliCandidates = [];
	if (claudeProbe.found && !claudeProbe.timedOut) {
		const credentials = detectCliCredentialState({
			probe: claudeProbe,
			hasStoredCredentials: readClaude() !== null,
			platform
		});
		cliCandidates.push({
			kind: "claude-cli",
			modelRef: CLAUDE_CLI_DEFAULT_MODEL_REF,
			label: "Claude Code",
			detail: describeCliDetail(credentials, "run `claude auth login`"),
			...credentials === void 0 ? {} : { credentials }
		});
	}
	if (codexProbe.found && !codexProbe.timedOut) {
		const credentials = options.deps?.readCodexCliCredentials ? detectCliCredentialState({
			probe: codexProbe,
			hasStoredCredentials: options.deps.readCodexCliCredentials() !== null,
			platform
		}) : await detectCodexLoginState(probe, codexProbe.command);
		cliCandidates.push({
			kind: "codex-cli",
			modelRef: CODEX_APP_SERVER_DEFAULT_MODEL_REF,
			label: "Codex",
			detail: describeCliDetail(credentials, "run `codex login`"),
			...credentials === void 0 ? {} : { credentials }
		});
	}
	if (geminiProbe.found && !geminiProbe.timedOut) {
		const credentials = readGemini() !== null;
		cliCandidates.push({
			kind: "gemini-cli",
			modelRef: GEMINI_CLI_DEFAULT_MODEL_REF,
			label: "Gemini CLI",
			detail: describeCliDetail(credentials, "sign in to Gemini CLI"),
			credentials
		});
	}
	randomizeClaudeCodexTie(cliCandidates, options.deps?.randomInt ?? randomInt);
	candidates.push(...cliCandidates.filter((candidate) => candidate.credentials !== false), ...cliCandidates.filter((candidate) => candidate.credentials === false));
	return candidates;
}
//#endregion
//#region src/config/local-model-lean-auto.ts
const AUTO_LOCAL_MODEL_LEAN_PROVIDER_IDS = /* @__PURE__ */ new Set(["lmstudio", "ollama"]);
/** Returns true only for local runtimes that onboarding can identify without model-name guesses. */
function shouldAutoEnableLocalModelLean(providerId) {
	return AUTO_LOCAL_MODEL_LEAN_PROVIDER_IDS.has(normalizeProviderId(providerId));
}
function resolveDefaultModelRef(config) {
	const model = config.agents?.defaults?.model;
	return typeof model === "string" ? model : model?.primary;
}
function clearAutoModel(config) {
	const wizard = { ...config.wizard };
	delete wizard.localModelLeanAutoModel;
	return {
		...config,
		wizard
	};
}
/** Maintains the onboarding-owned lean default while preserving explicit user configuration. */
function applyAutoLocalModelLean(params) {
	const localModelLean = params.config.agents?.defaults?.experimental?.localModelLean;
	const autoModel = params.config.wizard?.localModelLeanAutoModel;
	const onboardingOwnsSetting = autoModel !== void 0 && resolveDefaultModelRef(params.config) === autoModel;
	if (!shouldAutoEnableLocalModelLean(params.providerId)) {
		if (!autoModel) return {
			config: params.config,
			changed: false,
			enabled: false
		};
		const config = clearAutoModel(params.config);
		if (!onboardingOwnsSetting || localModelLean !== true) return {
			config,
			changed: true,
			enabled: false
		};
		const experimental = { ...params.config.agents?.defaults?.experimental };
		delete experimental.localModelLean;
		return {
			config: {
				...config,
				agents: {
					...config.agents,
					defaults: {
						...config.agents?.defaults,
						experimental
					}
				}
			},
			changed: true,
			enabled: false
		};
	}
	if (localModelLean !== void 0) {
		if (!autoModel) return {
			config: params.config,
			changed: false,
			enabled: false
		};
		if (!onboardingOwnsSetting || !localModelLean) return {
			config: clearAutoModel(params.config),
			changed: true,
			enabled: false
		};
		if (autoModel === params.modelRef) return {
			config: params.config,
			changed: false,
			enabled: false
		};
		return {
			config: {
				...params.config,
				wizard: {
					...params.config.wizard,
					localModelLeanAutoModel: params.modelRef
				}
			},
			changed: true,
			enabled: false
		};
	}
	return {
		config: {
			...params.config,
			wizard: {
				...params.config.wizard,
				localModelLeanAutoModel: params.modelRef
			},
			agents: {
				...params.config.agents,
				defaults: {
					...params.config.agents?.defaults,
					experimental: {
						...params.config.agents?.defaults?.experimental,
						localModelLean: true
					}
				}
			}
		},
		changed: true,
		enabled: true
	};
}
//#endregion
//#region src/system-agent/revalidate-inference-owner.ts
async function revalidateSetupInferenceOwner(params) {
	return await (params.deps.createSystemAgentVerifiedInferenceBinding ?? createSystemAgentVerifiedInferenceBinding)({
		configuredRoute: params.route,
		executionRoute: params.route,
		auth: params.auth,
		deps: params.deps
	});
}
//#endregion
//#region src/system-agent/setup-inference-auth-options.ts
function supportsSetupTextInference(scopes) {
	return !scopes || scopes.includes("text-inference");
}
function supportsSetupManualSecret(choice) {
	return supportsSetupTextInference(choice.onboardingScopes) && choice.appGuidedSecret === true;
}
function listSetupInferenceManualProviders(authChoices) {
	const choices = /* @__PURE__ */ new Map();
	for (const choice of authChoices) {
		const id = choice.choiceId.trim();
		if (!id || choices.has(id) || !supportsSetupManualSecret(choice)) continue;
		choices.set(id, {
			id,
			label: choice.choiceLabel,
			...choice.choiceHint?.trim() ? { hint: choice.choiceHint.trim() } : {},
			...choice.icon ? { icon: choice.icon } : {},
			...choice.website ? { website: choice.website } : {}
		});
	}
	return [...choices.values()].toSorted((a, b) => a.label.localeCompare(b.label, "en") || a.id.localeCompare(b.id, "en"));
}
function listSetupInferenceAuthOptions(authChoices) {
	const choices = /* @__PURE__ */ new Map();
	for (const choice of authChoices) {
		const id = choice.choiceId.trim();
		if (!id || choices.has(id) || !supportsSetupTextInference(choice.onboardingScopes) || choice.assistantVisibility === "manual-only" || !choice.appGuidedAuth) continue;
		choices.set(id, {
			metadata: choice,
			option: {
				id,
				label: choice.choiceLabel,
				...choice.choiceHint?.trim() ? { hint: choice.choiceHint.trim() } : {},
				...choice.groupLabel?.trim() ? { groupLabel: choice.groupLabel.trim() } : {},
				...choice.icon ? { icon: choice.icon } : {},
				...choice.website ? { website: choice.website } : {},
				kind: choice.appGuidedAuth,
				featured: choice.onboardingFeatured === true
			}
		});
	}
	return [...choices.values()].toSorted((a, b) => Number(b.option.featured) - Number(a.option.featured) || compareProviderAuthChoiceGroups({
		id: a.metadata.groupId ?? a.metadata.providerId,
		label: a.metadata.groupLabel ?? a.metadata.choiceLabel
	}, {
		id: b.metadata.groupId ?? b.metadata.providerId,
		label: b.metadata.groupLabel ?? b.metadata.choiceLabel
	}) || (a.metadata.assistantPriority ?? 0) - (b.metadata.assistantPriority ?? 0) || a.option.label.localeCompare(b.option.label, "en") || a.option.id.localeCompare(b.option.id, "en")).map(({ option }) => option);
}
//#endregion
//#region src/system-agent/setup-inference-probe.ts
const SETUP_INFERENCE_TEST_MAX_TOKENS = 32;
/** Plugin and auto-selected harnesses may not support OpenClaw's request-scoped token cap. */
function resolveSetupInferenceProbeStreamParams(agentHarnessId) {
	return !agentHarnessId || agentHarnessId === "openclaw" ? { streamParams: { maxTokens: SETUP_INFERENCE_TEST_MAX_TOKENS } } : {};
}
//#endregion
//#region src/system-agent/setup-inference.ts
const log = createSubsystemLogger("system-agent/setup-inference");
/**
* Inference is the one required onboarding step (docs/cli/setup.md
* "Setup bootstrap"). This module gives structured clients (macOS app) the
* same ladder the conversation uses, with one hard guarantee: a candidate is
* persisted as the default model only after a real completion round-trips.
* A failing candidate must never leave config pointing at a broken model.
*/
const SETUP_INFERENCE_TEST_TIMEOUT_MS = 9e4;
const SETUP_INFERENCE_TEST_PROMPT = "Reply with the single word OK. Do not use tools.";
const PROVIDER_AUTO_SETUP_KIND_PREFIX = "provider-auto:";
const AUTO_LOCAL_MODEL_LEAN_ANNOUNCEMENT = "This model is small, so I set up the lean surface — switching to a bigger model later lifts it.";
/**
* The config commit may have happened, so callers must verify current setup
* instead of treating this like a definitive candidate failure and retrying.
*/
var SetupInferenceActivationIndeterminateError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SetupInferenceActivationIndeterminateError";
	}
};
var SetupInferenceActivationUnavailableError = class extends Error {
	constructor(..._args2) {
		super(..._args2);
		this.name = "SetupInferenceActivationUnavailableError";
	}
};
var SetupInferenceCancelledError = class extends Error {
	constructor() {
		super("Provider login was cancelled.");
	}
};
function throwIfSetupInferenceCancelled(params) {
	if (params.signal?.aborted || params.isCancelled?.()) throw new SetupInferenceCancelledError();
}
async function waitForProviderAuth(promise, signal) {
	if (!signal) return await promise;
	if (signal.aborted) throw new SetupInferenceCancelledError();
	let rejectAborted;
	const aborted = new Promise((_resolve, reject) => {
		rejectAborted = reject;
	});
	const onAbort = () => rejectAborted?.(new SetupInferenceCancelledError());
	signal.addEventListener("abort", onAbort, { once: true });
	try {
		return await Promise.race([promise, aborted]);
	} finally {
		signal.removeEventListener("abort", onAbort);
	}
}
function toProviderAutoSetupKind(choiceId) {
	return `${PROVIDER_AUTO_SETUP_KIND_PREFIX}${encodeURIComponent(choiceId)}`;
}
function parseProviderAutoSetupChoiceId(kind) {
	if (!kind.startsWith(PROVIDER_AUTO_SETUP_KIND_PREFIX)) return;
	const encoded = kind.slice(14);
	if (!encoded) return;
	try {
		return decodeURIComponent(encoded) || void 0;
	} catch {
		return;
	}
}
function invalidSetupConfigError(snapshot) {
	const issue = snapshot.issues?.[0];
	const detail = issue ? ` (${issue.path ? `${issue.path}: ` : ""}${issue.message})` : "";
	return `OpenClaw config ${snapshot.path} is invalid${detail}. Fix it before running setup.`;
}
function resolveCandidatePresentation(kind, authChoices) {
	const choice = authChoices.find((candidate) => candidate.choiceId === kind || candidate.deprecatedChoiceIds?.includes(kind) === true);
	return {
		...choice?.icon ? { icon: choice.icon } : {},
		...choice?.website ? { website: choice.website } : {}
	};
}
async function resolveSetupInferenceWorkspace(params) {
	const { authoredConfig, hasAuthoredSetup } = await loadAuthoredSetupConfig(params);
	const { DEFAULT_WORKSPACE } = await import("./onboard-helpers-BtjO0REF.js");
	return {
		workspace: resolveUserPath(authoredConfig?.agents?.defaults?.workspace?.trim() || DEFAULT_WORKSPACE),
		hasAuthoredSetup
	};
}
/**
* Manual setup options only — no CLI probing, no credential discovery. Used
* when guarded onboarding declines the "look around" step: the option lists
* derive from config and plugin manifests, never from scanning the machine.
*/
async function listManualSetupInferenceOptions(deps = {}) {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const snapshot = await readConfigFileSnapshot();
	if (snapshot.exists && !snapshot.valid) throw new Error(invalidSetupConfigError(snapshot));
	const cfg = snapshot.exists && snapshot.valid ? snapshot.runtimeConfig ?? snapshot.config : {};
	const { workspace } = await resolveSetupInferenceWorkspace({
		configExists: snapshot.exists,
		configValid: snapshot.valid
	});
	const authChoices = (deps.resolveManifestProviderAuthChoices ?? resolveManifestProviderAuthChoices)({
		config: cfg,
		workspaceDir: workspace,
		includeUntrustedWorkspacePlugins: false,
		includeWorkspacePlugins: false
	}).filter((choice) => (deps.enablePluginInConfig ?? enablePluginInConfig)(cfg, choice.pluginId).enabled);
	return {
		manualProviders: listSetupInferenceManualProviders(authChoices),
		authOptions: listSetupInferenceAuthOptions(authChoices),
		workspace,
		setupComplete: Boolean(resolveAgentEffectiveModelPrimary(cfg, resolveDefaultAgentId(cfg)))
	};
}
async function detectSetupInference(deps = {}) {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const snapshot = await readConfigFileSnapshot();
	if (snapshot.exists && !snapshot.valid) throw new Error(invalidSetupConfigError(snapshot));
	const cfg = snapshot.exists && snapshot.valid ? snapshot.runtimeConfig ?? snapshot.config : {};
	const detected = await (deps.detectInferenceBackends ?? detectInferenceBackends)({ config: cfg });
	const unavailableCandidates = detected.filter((candidate) => candidate.kind === "gemini-cli").map((candidate) => ({
		id: candidate.kind,
		label: candidate.label,
		detail: candidate.detail,
		reason: "Can't be auto-tested safely here. Use 'Gemini CLI OAuth' or a Gemini API key instead."
	}));
	const probe = deps.probeLocalCommand ?? probeLocalCommand;
	const [antigravity, pi, opencode] = await Promise.all([
		probe("agy"),
		probe("pi"),
		probe("opencode")
	]);
	if (antigravity.found && !antigravity.timedOut) unavailableCandidates.push({
		id: "antigravity-cli",
		label: "Antigravity CLI",
		detail: "installed",
		reason: "Can't be auto-tested safely here. Sign in with a provider or use an API key instead."
	});
	if (pi.found && !pi.timedOut) unavailableCandidates.push({
		id: "pi-cli",
		label: "Pi CLI",
		detail: "installed",
		reason: "Pi CLI is installed, but its whole-agent sessions require separate setup and are not a reusable guided-setup inference route."
	});
	if (opencode.found && !opencode.timedOut) unavailableCandidates.push({
		id: "opencode-cli",
		label: "OpenCode CLI",
		detail: "installed",
		reason: "OpenCode CLI is installed, but its ACP harness requires separate setup and is not a reusable guided-setup inference route."
	});
	const raw = detected.filter((candidate) => candidate.kind !== "gemini-cli");
	const { workspace } = await resolveSetupInferenceWorkspace({
		configExists: snapshot.exists,
		configValid: snapshot.valid
	});
	const authChoices = (deps.resolveManifestProviderAuthChoices ?? resolveManifestProviderAuthChoices)({
		config: cfg,
		workspaceDir: workspace,
		includeUntrustedWorkspacePlugins: false,
		includeWorkspacePlugins: false
	}).filter((choice) => (deps.enablePluginInConfig ?? enablePluginInConfig)(cfg, choice.pluginId).enabled);
	const candidates = raw.map((candidate) => Object.assign(candidate, { recommended: false }, resolveCandidatePresentation(candidate.kind, authChoices)));
	const configuredModel = candidates.find((candidate) => candidate.kind === "existing-model")?.modelRef;
	const discoveryChoices = authChoices.filter((choice) => choice.appGuidedDiscovery === true && supportsSetupTextInference(choice.onboardingScopes));
	if (discoveryChoices.length > 0) {
		let discoveryConfig = cfg;
		const enabledChoices = [];
		for (const choice of discoveryChoices) {
			const enabled = (deps.enablePluginInConfig ?? enablePluginInConfig)(discoveryConfig, choice.pluginId);
			if (!enabled.enabled) continue;
			discoveryConfig = enabled.config;
			enabledChoices.push(choice);
		}
		const providers = (deps.resolvePluginProviders ?? resolvePluginProviders)({
			config: discoveryConfig,
			workspaceDir: workspace,
			mode: "setup",
			includeUntrustedWorkspacePlugins: false,
			onlyPluginIds: [...new Set(enabledChoices.map((choice) => choice.pluginId))]
		});
		const discovered = await Promise.all(enabledChoices.map(async (choice) => {
			const method = providers.find((candidate) => candidate.pluginId === choice.pluginId && normalizeProviderId$1(candidate.id) === normalizeProviderId$1(choice.providerId))?.auth.find((candidate) => candidate.id === choice.methodId);
			if (!method?.appGuidedSetup) return null;
			try {
				const candidate = await method.appGuidedSetup.detect({
					config: discoveryConfig,
					env: process.env,
					workspaceDir: workspace
				});
				if (!candidate) return null;
				const ref = parseRef(candidate.modelRef);
				if (!ref.model || normalizeProviderId$1(ref.provider) !== normalizeProviderId$1(choice.providerId)) {
					log.warn(`Ignoring invalid app-guided model ${candidate.modelRef} from ${choice.choiceId}.`);
					return null;
				}
				return Object.assign({
					kind: toProviderAutoSetupKind(choice.choiceId),
					label: choice.choiceLabel,
					detail: candidate.detail?.trim() || "available locally",
					modelRef: candidate.modelRef,
					recommended: false,
					credentials: true
				}, choice.icon ? { icon: choice.icon } : {}, choice.website ? { website: choice.website } : {});
			} catch (error) {
				log.debug(`App-guided discovery failed for ${choice.choiceId}: ${formatErrorMessage(error)}`);
				return null;
			}
		}));
		candidates.push(...discovered.filter((candidate) => candidate !== null));
	}
	return {
		candidates,
		unavailableCandidates,
		manualProviders: listSetupInferenceManualProviders(authChoices),
		authOptions: listSetupInferenceAuthOptions(authChoices),
		recommendedInstalls: listRecommendedToolInstalls(),
		workspace,
		...configuredModel ? { configuredModel } : {},
		setupComplete: Boolean(configuredModel)
	};
}
function configureCodexCliPreparedAuth(cfg) {
	const entry = cfg.plugins?.entries?.codex;
	const pluginConfig = entry?.config ?? {};
	const appServer = pluginConfig.appServer && typeof pluginConfig.appServer === "object" ? pluginConfig.appServer : {};
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			entries: {
				...cfg.plugins?.entries,
				codex: {
					...entry,
					config: {
						...pluginConfig,
						appServer: {
							...appServer,
							transport: "stdio",
							homeScope: "agent"
						}
					}
				}
			}
		}
	};
}
function extractRunText(result) {
	return result.meta?.finalAssistantVisibleText ?? result.meta?.finalAssistantRawText ?? result.payloads?.map((payload) => payload.text?.trim()).filter(Boolean).join("\n");
}
function extractRunTerminalError(result) {
	const errorPayload = result.payloads?.find((payload) => payload.isError === true)?.text?.trim();
	const hasMetaError = result.meta?.error !== void 0;
	const metaError = result.meta?.error?.message?.trim();
	const livenessState = result.meta?.livenessState?.trim().toLowerCase();
	if (!errorPayload && !hasMetaError && livenessState !== "blocked" && livenessState !== "abandoned") return;
	return metaError || errorPayload || (livenessState ? `Inference ended in the ${livenessState} state.` : "Inference failed.");
}
function extractRunWinnerError(plan, result) {
	const winnerProvider = result.meta?.executionTrace?.winnerProvider?.trim();
	const winnerModel = result.meta?.executionTrace?.winnerModel?.trim();
	if (!winnerProvider || !winnerModel) return "The inference run did not report which provider and model produced its reply.";
	if (winnerProvider === plan.provider && winnerModel === plan.model) return;
	return `The inference run answered through ${winnerProvider}/${winnerModel} instead of the requested ${plan.provider}/${plan.model}. Disable model-routing overrides or choose the working route directly, then retry.`;
}
function resolveToolFreeCliSetupError(plan) {
	if (plan.runner !== "cli") return;
	const backend = resolveCliBackendConfig(plan.provider, plan.config, plan.agentId ? { agentId: plan.agentId } : {});
	if (backend?.sideQuestionToolMode === "disabled") return;
	const geminiCliProvider = parseRef(GEMINI_CLI_DEFAULT_MODEL_REF).provider;
	if (backend?.nativeToolMode === "none" && plan.provider !== geminiCliProvider) return;
	return plan.provider === geminiCliProvider ? "Gemini CLI cannot be used for inference-gated setup because it has no hard tool-free mode. Choose Claude Code, Codex, or an API-key provider; normal Gemini CLI agent runs remain available after setup." : `CLI backend ${backend?.id ?? plan.provider} cannot be used for inference-gated setup because it has no hard tool-free mode. Choose another inference provider.`;
}
function resolveStrictSetupAuthProfileError(params) {
	const profileId = params.plan.authProfileId?.trim();
	if (!profileId) return;
	const credential = (params.deps.loadAuthProfileStoreForRuntime ?? loadAuthProfileStoreForRuntime)(params.plan.agentDir, {
		readOnly: true,
		allowKeychainPrompt: false,
		config: params.plan.config,
		externalCliProviderIds: [params.plan.provider]
	}).profiles[profileId];
	if (!credential) return `No credentials found for the configured setup profile "${profileId}".`;
	if (params.plan.runner === "embedded") {
		if (buildAgentRuntimeAuthPlan({
			provider: params.plan.provider,
			authProfileProvider: credential.provider,
			authProfileMode: credential.type,
			sessionAuthProfileId: profileId,
			config: params.plan.config,
			workspaceDir: params.workspaceDir,
			harnessId: params.plan.agentHarnessRuntimeOverride,
			harnessRuntime: params.plan.agentHarnessRuntimeOverride,
			allowHarnessAuthProfileForwarding: true
		}).forwardedAuthProfileId === profileId) return;
	} else {
		const aliasContext = {
			config: params.plan.config,
			workspaceDir: params.workspaceDir
		};
		try {
			if (resolveProviderIdForAuth(params.plan.provider, aliasContext) === resolveProviderIdForAuth(credential.provider, aliasContext)) return;
		} catch {
			return `Could not verify that configured setup profile "${profileId}" belongs to the selected ${params.plan.provider} inference route.`;
		}
	}
	return `Configured setup profile "${profileId}" belongs to ${credential.provider}, not the selected ${params.plan.provider} inference route.`;
}
function parseRef(modelRef) {
	const slash = modelRef.indexOf("/");
	return slash === -1 ? {
		provider: modelRef,
		model: ""
	} : {
		provider: modelRef.slice(0, slash),
		model: modelRef.slice(slash + 1)
	};
}
function projectSetupTargetModelMetadata(config, modelRef) {
	const target = parseRef(modelRef);
	const canonicalKey = modelKey(target.provider, target.model);
	const keys = new Set([
		canonicalKey,
		legacyModelKey(target.provider, target.model),
		`${target.provider}/${canonicalKey}`
	].filter((key) => Boolean(key)));
	const project = (models) => Object.fromEntries([...keys].map((key) => [key, Object.hasOwn(models ?? {}, key) ? {
		exists: true,
		value: structuredClone(models?.[key])
	} : { exists: false }]));
	const defaultAgentId = resolveDefaultAgentId(config);
	const agent = config.agents?.list?.find((entry) => normalizeAgentId(entry.id) === defaultAgentId);
	return {
		defaultAgentId,
		defaults: project(config.agents?.defaults?.models),
		agent: project(agent?.models)
	};
}
function resolveSetupAgentRuntimeId(kind) {
	if (kind === "codex-cli") return "codex";
	if (kind === "openai-api-key" || kind === "anthropic-api-key" || kind === "api-key" || kind === "provider-auth" || parseProviderAutoSetupChoiceId(kind) !== void 0) return "openclaw";
}
function mapFailoverReasonToSetupStatus(reason) {
	if (reason === "auth" || reason === "auth_permanent") return "auth";
	if (reason === "rate_limit" || reason === "overloaded") return "rate_limit";
	if (reason === "billing") return "billing";
	if (reason === "timeout") return "timeout";
	if (reason === "format" || reason === "model_not_found") return "format";
	return "unknown";
}
function prepareManualAuthForActivation(params) {
	const selectedProfile = params.profiles.find((profile) => profile.profileId === params.selectedProfileId);
	if (!selectedProfile) throw new Error("The selected setup credential was not returned by its provider.");
	const selectedProfileId = `${normalizeProviderId$1(selectedProfile.credential.provider) || "provider"}:setup-${randomUUID()}`;
	const profile = {
		...selectedProfile,
		profileId: selectedProfileId
	};
	return {
		config: projectManualInferenceConfig({
			...params,
			selectedProfile,
			selectedProfileId
		}),
		profiles: [profile],
		selectedProfileId
	};
}
function copySelectedModelMetadata(params) {
	const preparedDefaultModels = params.prepared.agents?.defaults?.models;
	if (preparedDefaultModels && Object.hasOwn(preparedDefaultModels, params.modelRef)) params.target.agents = {
		...params.target.agents,
		defaults: {
			...params.target.agents?.defaults,
			models: {
				...params.target.agents?.defaults?.models,
				[params.modelRef]: structuredClone(expectDefined(preparedDefaultModels[params.modelRef], "prepared default models entry at params.model ref"))
			}
		}
	};
	const defaultAgentId = resolveDefaultAgentId(params.target);
	const preparedAgent = params.prepared.agents?.list?.find((agent) => agent.id === defaultAgentId);
	if (!preparedAgent?.models || !Object.hasOwn(preparedAgent.models, params.modelRef)) return;
	const targetAgents = params.target.agents?.list;
	const targetAgentIndex = targetAgents?.findIndex((agent) => agent.id === defaultAgentId) ?? -1;
	if (!targetAgents || targetAgentIndex < 0) return;
	const nextAgents = structuredClone(targetAgents);
	const targetAgent = expectDefined(nextAgents[targetAgentIndex], "next agents entry at target agent index");
	if (!targetAgent) return;
	targetAgent.models = {
		...targetAgent.models,
		[params.modelRef]: structuredClone(expectDefined(preparedAgent.models[params.modelRef], "models entry at params.model ref"))
	};
	params.target.agents = {
		...params.target.agents,
		list: nextAgents
	};
}
function findSelectedProviderConfigKey(config, providerId) {
	const providers = config.models?.providers;
	if (!providers) return;
	if (Object.hasOwn(providers, providerId)) return providerId;
	const normalizedProvider = normalizeProviderId$1(providerId);
	return Object.keys(providers).find((candidate) => normalizeProviderId$1(candidate) === normalizedProvider);
}
/**
* Provider auth hooks are untrusted setup input. Carry only the selected
* inference route's config into the probe; OpenClaw owns every other setup
* surface after intelligence exists.
*/
function projectManualInferenceConfig(params) {
	const config = structuredClone(params.baseConfig);
	if (params.selectedProfile && params.selectedProfileId) {
		const metadata = params.preparedConfig.auth?.profiles?.[params.selectedProfile.profileId] ?? {
			provider: params.selectedProfile.credential.provider,
			mode: params.selectedProfile.credential.type
		};
		config.auth = {
			...config.auth,
			profiles: {
				...config.auth?.profiles,
				[params.selectedProfileId]: structuredClone(metadata)
			}
		};
	}
	const providerConfigKey = findSelectedProviderConfigKey(params.preparedConfig, params.providerId);
	if (providerConfigKey) {
		const preparedProvider = params.preparedConfig.models?.providers?.[providerConfigKey];
		if (preparedProvider === void 0) throw new Error(`Prepared provider config missing for ${providerConfigKey}`);
		config.models = {
			...config.models,
			providers: {
				...config.models?.providers,
				[providerConfigKey]: structuredClone(preparedProvider)
			}
		};
	}
	if (params.pluginId) {
		const preparedEntry = params.preparedConfig.plugins?.entries?.[params.pluginId];
		if (preparedEntry !== void 0) config.plugins = {
			...config.plugins,
			entries: {
				...config.plugins?.entries,
				[params.pluginId]: structuredClone(preparedEntry)
			}
		};
	}
	copySelectedModelMetadata({
		target: config,
		prepared: params.preparedConfig,
		modelRef: params.modelRef
	});
	return config;
}
function canonicalizeSetupModelRef(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider
	});
	const resolved = resolveModelRefFromString({
		cfg: params.cfg,
		raw: params.raw,
		defaultProvider: params.defaultProvider,
		aliasIndex
	});
	return resolved ? `${resolved.ref.provider}/${resolved.ref.model}` : params.raw;
}
async function buildTestPlan(params) {
	const { kind, cfg, workspaceDir } = params;
	const resolveRouteModelRef = (defaultModelRef) => {
		const modelRef = params.modelRef?.trim() || defaultModelRef;
		const selected = parseRef(modelRef);
		const expected = parseRef(defaultModelRef);
		if (!selected.model || normalizeProviderId$1(selected.provider) !== normalizeProviderId$1(expected.provider)) return { error: `${modelRef} is not compatible with the ${kind} inference route.` };
		return modelRef;
	};
	const providerAutoChoiceId = parseProviderAutoSetupChoiceId(kind);
	if (providerAutoChoiceId) {
		const choice = (params.deps.resolveManifestProviderAuthChoice ?? resolveManifestProviderAuthChoice)(providerAutoChoiceId, {
			config: cfg,
			workspaceDir: params.pluginWorkspaceDir,
			includeUntrustedWorkspacePlugins: false,
			includeWorkspacePlugins: false
		});
		if (!choice || choice.appGuidedDiscovery !== true || !supportsSetupTextInference(choice.onboardingScopes)) return { error: "That detected provider is no longer available on this Gateway." };
		const enablePlugin = params.deps.enablePluginInConfig ?? enablePluginInConfig;
		const enableResult = enablePlugin(cfg, choice.pluginId);
		if (!enableResult.enabled) return { error: `${choice.choiceLabel} is disabled (${enableResult.reason ?? "blocked"}).` };
		const sourceEnableResult = enablePlugin(params.sourceCfg, choice.pluginId);
		if (!sourceEnableResult.enabled) return { error: `${choice.choiceLabel} is disabled (${sourceEnableResult.reason ?? "blocked"}).` };
		const provider = (params.deps.resolvePluginProviders ?? resolvePluginProviders)({
			config: enableResult.config,
			workspaceDir: params.pluginWorkspaceDir,
			mode: "setup",
			includeUntrustedWorkspacePlugins: false,
			onlyPluginIds: [choice.pluginId]
		}).find((candidate) => candidate.pluginId === choice.pluginId && normalizeProviderId$1(candidate.id) === normalizeProviderId$1(choice.providerId));
		const method = provider?.auth.find((candidate) => candidate.id === choice.methodId);
		if (!provider || !method?.appGuidedSetup) return { error: "That detected provider is no longer available on this Gateway." };
		const modelRef = params.modelRef?.trim();
		if (!modelRef) return { error: "The detected provider model is missing. Run detection again." };
		try {
			const result = await method.appGuidedSetup.prepare({
				config: enableResult.config,
				env: process.env,
				workspaceDir: params.pluginWorkspaceDir,
				modelRef,
				...params.signal ? { signal: params.signal } : {}
			});
			const preparedModelRef = result?.defaultModel ? normalizeAgentModelRefForConfig(result.defaultModel) : "";
			if (!result || preparedModelRef !== modelRef) return { error: `${choice.choiceLabel} could not prepare the detected model. Run detection again.` };
			const ref = parseRef(modelRef);
			if (!ref.model || normalizeProviderId$1(ref.provider) !== normalizeProviderId$1(choice.providerId)) return { error: `${choice.choiceLabel} returned an invalid detected model.` };
			const preparedConfig = applyProviderPluginAuthMethodResultConfig({
				config: enableResult.config,
				result
			});
			const matchingProfile = result.profiles.find((profile) => normalizeProviderId$1(profile.credential.provider) === normalizeProviderId$1(ref.provider));
			if (result.profiles.length > 0 && !matchingProfile) return { error: `${choice.choiceLabel} did not return credentials for its detected model.` };
			const prepared = matchingProfile ? prepareManualAuthForActivation({
				baseConfig: enableResult.config,
				preparedConfig,
				profiles: result.profiles,
				selectedProfileId: matchingProfile.profileId,
				modelRef,
				providerId: ref.provider,
				pluginId: choice.pluginId
			}) : {
				config: projectManualInferenceConfig({
					baseConfig: enableResult.config,
					preparedConfig,
					modelRef,
					providerId: ref.provider,
					pluginId: choice.pluginId
				}),
				profiles: [],
				selectedProfileId: void 0
			};
			return {
				runner: "embedded",
				...ref,
				modelRef,
				agentDir: params.agentDir,
				config: prepared.config,
				agentId: "openclaw",
				routeAgentId: resolveDefaultAgentId(prepared.config),
				...prepared.selectedProfileId ? { authProfileId: prepared.selectedProfileId } : {},
				persistModelRef: modelRef,
				manualAuth: {
					profiles: prepared.profiles,
					runtimeConfigBase: enableResult.config,
					sourceConfigBase: sourceEnableResult.config,
					configPatch: createMergePatch(enableResult.config, prepared.config),
					pluginId: choice.pluginId
				}
			};
		} catch (error) {
			return { error: `${choice.choiceLabel} could not prepare app-guided setup: ${formatErrorMessage(error)}` };
		}
	}
	switch (kind) {
		case "existing-model": {
			const route = await resolveSystemAgentConfiguredRouteFromConfig(cfg, params.routeAgentId);
			if (!route) return { error: "No configured default-agent inference route is available." };
			const requestedModelRef = params.modelRef?.trim();
			const requestedTarget = requestedModelRef ? canonicalizeSetupModelRef({
				cfg,
				raw: requestedModelRef,
				defaultProvider: route.provider
			}) : void 0;
			if (requestedModelRef && requestedTarget !== route.modelLabel) return { error: `The configured default model changed from ${requestedModelRef} to ${route.modelLabel}. Try setup again.` };
			return {
				runner: route.runner,
				provider: route.provider,
				model: route.model,
				modelRef: route.modelLabel,
				config: route.runConfig,
				agentId: "openclaw",
				routeAgentId: route.agentId,
				agentDir: route.agentDir,
				...route.runner === "embedded" ? { agentHarnessRuntimeOverride: route.agentHarnessRuntimeOverride } : {},
				...route.authProfileId ? { authProfileId: route.authProfileId } : {}
			};
		}
		case "claude-cli": {
			const modelRef = resolveRouteModelRef(CLAUDE_CLI_DEFAULT_MODEL_REF);
			if (typeof modelRef !== "string") return modelRef;
			return {
				runner: "cli",
				...parseRef(modelRef),
				modelRef,
				config: cfg,
				agentId: "openclaw",
				routeAgentId: resolveDefaultAgentId(cfg),
				persistModelRef: modelRef
			};
		}
		case "gemini-cli": {
			const modelRef = resolveRouteModelRef(GEMINI_CLI_DEFAULT_MODEL_REF);
			if (typeof modelRef !== "string") return modelRef;
			return {
				runner: "cli",
				...parseRef(modelRef),
				modelRef,
				config: cfg,
				agentId: "openclaw",
				routeAgentId: resolveDefaultAgentId(cfg),
				persistModelRef: modelRef
			};
		}
		case "codex-cli": {
			const modelRef = resolveRouteModelRef(CODEX_APP_SERVER_DEFAULT_MODEL_REF);
			if (typeof modelRef !== "string") return modelRef;
			return {
				runner: "embedded",
				...parseRef(modelRef),
				modelRef,
				agentHarnessRuntimeOverride: "codex",
				config: cfg,
				agentId: "openclaw",
				routeAgentId: resolveDefaultAgentId(cfg),
				agentDir: params.agentDir,
				cleanupBundleMcpOnRunEnd: true,
				persistModelRef: modelRef
			};
		}
		case "openai-api-key": {
			const modelRef = resolveRouteModelRef(OPENAI_API_DEFAULT_MODEL_REF);
			if (typeof modelRef !== "string") return modelRef;
			return {
				runner: "embedded",
				...parseRef(modelRef),
				modelRef,
				config: cfg,
				agentId: "openclaw",
				routeAgentId: resolveDefaultAgentId(cfg),
				persistModelRef: modelRef
			};
		}
		case "anthropic-api-key": {
			const modelRef = resolveRouteModelRef(ANTHROPIC_API_DEFAULT_MODEL_REF);
			if (typeof modelRef !== "string") return modelRef;
			return {
				runner: "embedded",
				...parseRef(modelRef),
				modelRef,
				config: cfg,
				agentId: "openclaw",
				routeAgentId: resolveDefaultAgentId(cfg),
				persistModelRef: modelRef
			};
		}
		case "api-key":
		case "provider-auth": {
			const interactive = kind === "provider-auth";
			const apiKey = params.apiKey?.trim();
			if (!interactive && !apiKey) return { error: "Enter an API key or token first." };
			const authChoice = params.authChoice?.trim();
			const choice = authChoice ? (params.deps.resolveManifestProviderAuthChoice ?? resolveManifestProviderAuthChoice)(authChoice, {
				config: cfg,
				workspaceDir: params.pluginWorkspaceDir,
				includeUntrustedWorkspacePlugins: false,
				includeWorkspacePlugins: false
			}) : void 0;
			if (!choice || !supportsSetupTextInference(choice.onboardingScopes) || !interactive && !supportsSetupManualSecret(choice) || interactive && (choice.assistantVisibility === "manual-only" || !choice.appGuidedAuth)) return { error: interactive ? "That provider login is not available on this Gateway." : "That key-based provider is not available on this Gateway." };
			const enablePlugin = params.deps.enablePluginInConfig ?? enablePluginInConfig;
			const enableResult = enablePlugin(cfg, choice.pluginId);
			if (!enableResult.enabled) return { error: `${choice.choiceLabel} is disabled (${enableResult.reason ?? "blocked"}).` };
			const sourceEnableResult = enablePlugin(params.sourceCfg, choice.pluginId);
			if (!sourceEnableResult.enabled) return { error: `${choice.choiceLabel} is disabled (${sourceEnableResult.reason ?? "blocked"}).` };
			const provider = (params.deps.resolvePluginProviders ?? resolvePluginProviders)({
				config: enableResult.config,
				workspaceDir: params.pluginWorkspaceDir,
				mode: "setup",
				includeUntrustedWorkspacePlugins: false,
				onlyPluginIds: [choice.pluginId]
			}).find((candidate) => candidate.pluginId === choice.pluginId && normalizeProviderId$1(candidate.id) === normalizeProviderId$1(choice.providerId));
			const method = provider?.auth.find((candidate) => candidate.id === choice.methodId);
			const resolved = provider && method ? {
				provider,
				method
			} : null;
			if (!resolved || !supportsSetupTextInference(resolved.method.wizard?.onboardingScopes) || interactive && resolved.method.kind !== "oauth" && resolved.method.kind !== "device_code") return { error: interactive ? "That provider login is not available on this Gateway." : "That key-based provider is not available on this Gateway." };
			let result;
			let preparedConfig;
			try {
				if (interactive) {
					if (!params.prompter) return { error: "This provider login requires an interactive setup session." };
					throwIfSetupInferenceCancelled(params);
					result = await waitForProviderAuth(runProviderPluginAuthMethodUnpersisted({
						config: enableResult.config,
						runtime: params.runtime,
						...params.signal ? { signal: params.signal } : {},
						isRemote: params.isRemoteProviderAuth,
						prompter: params.prompter,
						method: resolved.method,
						agentDir: params.agentDir,
						workspaceDir
					}), params.signal);
					throwIfSetupInferenceCancelled(params);
					preparedConfig = applyProviderPluginAuthMethodResultConfig({
						config: enableResult.config,
						result
					});
				} else if (resolved.method.kind === "api_key" || resolved.method.kind === "token") {
					result = await runProviderPluginAuthMethodUnpersisted({
						config: enableResult.config,
						runtime: params.runtime,
						prompter: createQuickstartNotePrompter(params.runtime),
						method: resolved.method,
						agentDir: params.agentDir,
						workspaceDir,
						secretInputMode: "plaintext",
						allowSecretRefPrompt: false,
						opts: {
							token: apiKey,
							tokenProvider: resolved.provider.id
						}
					});
					preparedConfig = applyProviderPluginAuthMethodResultConfig({
						config: enableResult.config,
						result
					});
				} else {
					const prepared = await runProviderManualSecretMethod({
						config: enableResult.config,
						baseConfig: cfg,
						choice,
						method: resolved.method,
						apiKey,
						agentDir: params.agentDir,
						workspaceDir
					});
					result = prepared.result;
					preparedConfig = prepared.config;
				}
			} catch (error) {
				if (error instanceof SetupInferenceCancelledError || params.signal?.aborted) return { error: "Provider login was cancelled." };
				const detail = error instanceof Error ? error.message : String(error);
				return { error: `${resolved.provider.label} could not prepare this ${interactive ? "login" : "credential"} for app-guided setup: ${detail}` };
			}
			const modelRef = result.defaultModel ? normalizeAgentModelRefForConfig(result.defaultModel) : "";
			if (!modelRef || result.profiles.length === 0) return { error: `${resolved.provider.label} does not expose a starter model for app-guided setup.` };
			const ref = parseRef(modelRef);
			if (!ref.model) return { error: `${resolved.provider.label} returned an invalid starter model.` };
			const matchingProfile = result.profiles.find((profile) => normalizeProviderId$1(profile.credential.provider) === normalizeProviderId$1(ref.provider));
			if (!matchingProfile) return { error: `${resolved.provider.label} did not return credentials for its starter model.` };
			const preparedAuth = prepareManualAuthForActivation({
				baseConfig: enableResult.config,
				preparedConfig,
				profiles: result.profiles,
				selectedProfileId: matchingProfile.profileId,
				modelRef,
				providerId: ref.provider,
				...resolved.provider.pluginId ? { pluginId: resolved.provider.pluginId } : {}
			});
			return {
				runner: "embedded",
				...ref,
				modelRef,
				agentDir: params.agentDir,
				config: preparedAuth.config,
				agentId: "openclaw",
				routeAgentId: resolveDefaultAgentId(preparedAuth.config),
				authProfileId: preparedAuth.selectedProfileId,
				persistModelRef: modelRef,
				manualAuth: {
					profiles: preparedAuth.profiles,
					runtimeConfigBase: enableResult.config,
					sourceConfigBase: sourceEnableResult.config,
					configPatch: createMergePatch(enableResult.config, preparedAuth.config),
					...resolved.provider.pluginId ? { pluginId: resolved.provider.pluginId } : {}
				}
			};
		}
		default: return { error: `Unknown inference choice "${kind}".` };
	}
}
async function runProviderManualSecretMethod(params) {
	const optionKey = params.choice.optionKey;
	const runNonInteractive = params.method.runNonInteractive;
	if (!optionKey || !params.choice.cliOption || !runNonInteractive) throw new Error("Provider does not expose app-guided secret setup.");
	let methodError = "";
	const isolatedRuntime = {
		log: () => {},
		error: (...args) => {
			methodError = args.map(String).join(" ");
		},
		exit: (code) => {
			throw new Error(methodError || `Provider setup exited with code ${code}.`);
		}
	};
	const configured = await runNonInteractive({
		authChoice: params.choice.choiceId,
		config: params.config,
		baseConfig: params.baseConfig,
		opts: {
			[optionKey]: params.apiKey,
			secretInputMode: "plaintext"
		},
		runtime: isolatedRuntime,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		resolveApiKey: async (input) => typeof input.flagValue === "string" && input.flagValue.trim() ? {
			key: input.flagValue.trim(),
			source: "flag"
		} : null,
		toApiKeyCredential: ({ provider, resolved, email, metadata }) => ({
			type: "api_key",
			provider,
			key: resolved.key,
			...email ? { email } : {},
			...metadata ? { metadata } : {}
		})
	});
	if (!configured) throw new Error(methodError || "Provider setup did not produce a configuration.");
	const store = loadPersistedAuthProfileStore(params.agentDir);
	const profiles = Object.entries(store?.profiles ?? {}).map(([profileId, credential]) => ({
		profileId,
		credential
	}));
	const previousModel = resolveAgentModelPrimaryValue(params.config.agents?.defaults?.model);
	const configuredModel = resolveAgentModelPrimaryValue(configured.agents?.defaults?.model);
	const configuredProvider = configuredModel ? parseRef(configuredModel).provider : void 0;
	const configuredModelOwnedByProvider = configuredProvider !== void 0 && normalizeProviderId$1(configuredProvider) === normalizeProviderId$1(params.choice.providerId);
	const defaultModel = configuredModel && (configuredModel !== previousModel || configuredModelOwnedByProvider) ? configuredModel : params.method.starterModel;
	if (profiles.length === 0 || !defaultModel) throw new Error("Provider setup did not produce credentials and a starter model.");
	return {
		result: {
			profiles,
			defaultModel
		},
		config: configured
	};
}
/**
* Test one candidate with a real completion, then persist it as the setup
* default. Manual credentials are tested from a temporary auth store and
* copied into the real agent store only after success. A managed Codex install
* record may remain after a failed probe because the installed package already exists.
*/
async function activateSetupInference(params) {
	try {
		const result = await activateSetupInferenceUnredacted(params);
		if (result.ok) return {
			...result,
			lines: await Promise.all(result.lines.map((line) => redactSetupInferenceError(line, params.apiKey)))
		};
		return {
			...result,
			error: await redactSetupInferenceError(result.error, params.apiKey)
		};
	} catch (error) {
		const redacted = await redactSetupInferenceError(error instanceof Error ? error.message : String(error), params.apiKey);
		if (error instanceof SetupInferenceCancelledError || params.signal?.aborted) return {
			ok: false,
			status: "unavailable",
			error: "Provider login was cancelled."
		};
		if (error instanceof SetupInferenceActivationUnavailableError) return {
			ok: false,
			status: "unavailable",
			error: redacted
		};
		if (error instanceof SetupInferenceActivationIndeterminateError) throw new SetupInferenceActivationIndeterminateError(redacted);
		throw new Error(redacted);
	}
}
async function activateSetupInferenceUnredacted(params) {
	const deps = params.deps ?? {};
	const readSnapshot = deps.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot;
	const snapshot = await readSnapshot();
	if (snapshot.exists && !snapshot.valid) throw new Error(invalidSetupConfigError(snapshot));
	const cfg = snapshot.exists ? snapshot.runtimeConfig ?? snapshot.config : {};
	const sourceCfg = snapshot.exists ? snapshot.sourceConfig ?? snapshot.config : {};
	const workspace = params.workspace?.trim() ? resolveUserPath(params.workspace) : (await resolveSetupInferenceWorkspace({
		configExists: snapshot.exists,
		configValid: snapshot.valid
	})).workspace;
	const tempDir = await (deps.createTempDir ?? (() => fs.mkdtemp(path.join(os.tmpdir(), "openclaw-setup-inference-"))))();
	const testAgentDir = path.join(tempDir, "agent");
	let pendingCodexInstall;
	let codexInstallOwnership = "unknown";
	let codexRegistryNeedsReload = false;
	let codexRegistryReloaded = false;
	try {
		const plan = await buildTestPlan({
			kind: params.kind,
			...params.modelRef !== void 0 ? { modelRef: params.modelRef } : {},
			...params.authChoice !== void 0 ? { authChoice: params.authChoice } : {},
			...params.apiKey !== void 0 ? { apiKey: params.apiKey } : {},
			cfg,
			sourceCfg,
			workspaceDir: tempDir,
			pluginWorkspaceDir: workspace,
			agentDir: testAgentDir,
			runtime: params.runtime,
			...params.prompter ? { prompter: params.prompter } : {},
			...params.signal ? { signal: params.signal } : {},
			...params.isCancelled ? { isCancelled: params.isCancelled } : {},
			...params.kind === "provider-auth" ? { isRemoteProviderAuth: params.surface === "gateway" } : {},
			deps
		});
		if ("error" in plan) return {
			ok: false,
			status: "unavailable",
			error: plan.error
		};
		const hasPreparedAuthProfiles = (plan.manualAuth?.profiles.length ?? 0) > 0;
		let testPlan = plan;
		if (plan.persistModelRef) {
			const agentRuntimeId = resolveSetupAgentRuntimeId(params.kind);
			const stagedConfig = await applySystemAgentModelSelection({
				config: plan.config,
				model: plan.persistModelRef,
				...agentRuntimeId ? { agentRuntimeId } : {},
				...plan.manualAuth && plan.authProfileId ? { authProfileId: plan.authProfileId } : {}
			});
			testPlan = {
				...plan,
				config: stagedConfig,
				routeAgentId: resolveDefaultAgentId(stagedConfig)
			};
		}
		let codexPluginPatch;
		if (params.kind === "codex-cli") {
			const { stripPendingPluginInstallRecords } = await import("./install-record-commit-X0abJfY-.js");
			const codexInstallBase = stripPendingPluginInstallRecords(testPlan.config);
			const enabledCodexBase = enablePluginInConfig(normalizePluginTargetConfig(codexInstallBase, "codex"), "codex");
			if (!enabledCodexBase.enabled) return {
				ok: false,
				status: "unavailable",
				error: `Could not enable the Codex runtime plugin: ${enabledCodexBase.reason ?? "plugin disabled"}.`
			};
			const ensured = await (deps.ensureCodexRuntimePlugin ?? (await import("./codex-runtime-plugin-install-Dhc1EfYr.js")).ensureCodexRuntimePluginForModelSelection)({
				cfg: enabledCodexBase.config,
				model: plan.modelRef,
				agentId: testPlan.routeAgentId,
				prompter: createQuickstartNotePrompter(params.runtime),
				runtime: params.runtime,
				workspaceDir: tempDir
			});
			if (!ensured.installed) return {
				ok: false,
				status: ensured.status === "timed_out" ? "timeout" : "unavailable",
				error: ensured.status === "timed_out" ? "Codex runtime plugin installation timed out. Try again." : ensured.reason ? `Could not enable the Codex runtime plugin: ${ensured.reason}.` : "Could not install the Codex runtime plugin. Try again once the plugin is available."
			};
			codexRegistryNeedsReload = true;
			pendingCodexInstall = ensured.cfg.plugins?.installs?.codex;
			if (pendingCodexInstall) {
				if (!await retainUnownedCodexInstall({
					record: pendingCodexInstall,
					verifyOwnership: false,
					deps
				})) return {
					ok: false,
					status: "unavailable",
					error: "Could not retain the staged Codex runtime safely. No inference route was changed; retry after checking the plugin storage directory."
				};
			}
			const enabledCodex = enablePluginInConfig(configureCodexCliPreparedAuth(normalizePluginTargetConfig(ensured.cfg, "codex")), "codex");
			if (!enabledCodex.enabled) return {
				ok: false,
				status: "unavailable",
				error: `Could not enable the Codex runtime plugin: ${enabledCodex.reason ?? "plugin disabled"}.`
			};
			const stagedCodexConfig = enabledCodex.config;
			codexPluginPatch = createMergePatch(codexInstallBase, stripPendingPluginInstallRecords(stagedCodexConfig));
			testPlan = {
				...testPlan,
				config: stagedCodexConfig
			};
			const refreshPluginRegistry = deps.refreshPluginRegistryAfterConfigMutation ?? (await import("./registry-refresh-7ijD11ai.js")).refreshPluginRegistryAfterConfigMutation;
			let registryRefreshWarning;
			await refreshPluginRegistry({
				config: testPlan.config,
				reason: "source-changed",
				workspaceDir: workspace,
				policyPluginIds: ["codex"],
				traceCommand: "openclaw-setup-probe",
				logger: { warn: (message) => registryRefreshWarning = message }
			});
			const ensureHarnessPlugin = deps.ensureSelectedAgentHarnessPlugin ?? (await import("./runtime-plugin-rYr3hJiN.js")).ensureSelectedAgentHarnessPlugin;
			try {
				await ensureHarnessPlugin({
					provider: testPlan.provider,
					modelId: testPlan.model,
					config: testPlan.config,
					agentId: testPlan.routeAgentId,
					agentHarnessRuntimeOverride: "codex",
					workspaceDir: tempDir
				});
			} catch (error) {
				const loadError = `Could not load the Codex runtime plugin: ${formatErrorMessage(error)}`;
				return {
					ok: false,
					status: "unavailable",
					error: registryRefreshWarning ? `${registryRefreshWarning} ${loadError}` : loadError
				};
			}
		}
		const baselineRoute = await projectDefaultInferenceRoute(cfg);
		const verifiedRoute = await projectDefaultInferenceRoute(testPlan.config);
		const stagedRoute = verifiedRoute.route;
		const stagedExecutionRoute = await resolveSystemAgentConfiguredRouteFromConfig(testPlan.config);
		if (!stagedRoute || !stagedExecutionRoute || stagedRoute.runner !== testPlan.runner || stagedRoute.provider !== testPlan.provider || stagedRoute.model !== testPlan.model || stagedRoute.modelLabel !== plan.modelRef || plan.authProfileId && stagedRoute.authProfileId !== plan.authProfileId) return {
			ok: false,
			status: "unavailable",
			error: "The staged default-agent route does not match the requested inference candidate. Review model runtime policy and retry."
		};
		const baselineTargetModelMetadata = projectSetupTargetModelMetadata(cfg, stagedRoute.modelLabel);
		const sourceTargetModelMetadata = projectSetupTargetModelMetadata(sourceCfg, stagedRoute.modelLabel);
		if (testPlan.runner === "embedded" && stagedRoute.runner === "embedded") testPlan = {
			...testPlan,
			config: stagedExecutionRoute.runConfig,
			agentDir: hasPreparedAuthProfiles ? testAgentDir : stagedRoute.agentDir,
			agentHarnessRuntimeOverride: stagedRoute.agentHarnessRuntimeOverride
		};
		else testPlan = {
			...testPlan,
			config: stagedExecutionRoute.runConfig,
			...!hasPreparedAuthProfiles ? { agentDir: stagedRoute.agentDir } : {}
		};
		if (hasPreparedAuthProfiles && plan.manualAuth) {
			if ((await persistManualAuthProfiles({
				profiles: plan.manualAuth.profiles,
				agentDir: testAgentDir,
				deps
			})).status !== "persisted") return {
				ok: false,
				status: "unknown",
				error: "Could not stage the credential for its live inference test; try again in a moment."
			};
		}
		let stagedOwnerPluginArtifacts;
		try {
			stagedOwnerPluginArtifacts = (deps.captureSystemAgentOwnerPluginArtifacts ?? captureSystemAgentOwnerPluginArtifacts)({
				config: stagedExecutionRoute.runConfig,
				executionRoute: stagedExecutionRoute,
				deps
			});
		} catch {
			return {
				ok: false,
				status: "unavailable",
				error: "Could not bind the staged inference plugin runtime. Refresh or reinstall the plugin and retry."
			};
		}
		if (params.signal?.aborted || params.isCancelled?.()) return {
			ok: false,
			status: "unavailable",
			error: "Provider login was cancelled."
		};
		let test;
		try {
			test = await runSetupInferenceTest({
				plan: testPlan,
				tempDir,
				deps,
				authProfileStateMode: "read-only",
				requireExecutionOwner: true,
				...params.signal ? { signal: params.signal } : {}
			});
			throwIfSetupInferenceCancelled(params);
		} catch (error) {
			if (error instanceof SetupInferenceCancelledError || params.signal?.aborted) return {
				ok: false,
				status: "unavailable",
				error: "Provider login was cancelled."
			};
			throw error;
		}
		if (!test.ok) return test;
		if (plan.authProfileId && test.auth.authProfileId !== plan.authProfileId) return {
			ok: false,
			status: "auth",
			error: `The inference run used profile "${test.auth.authProfileId ?? "unknown"}" instead of the configured profile "${plan.authProfileId}". No model or credential route was saved.`
		};
		const autoLocalModelLeanUpdate = applyAutoLocalModelLean({
			config: sourceCfg,
			providerId: testPlan.provider,
			modelRef: plan.modelRef
		});
		const needsPersistence = plan.persistModelRef !== void 0 || plan.manualAuth !== void 0 || codexPluginPatch !== void 0 || pendingCodexInstall !== void 0 || autoLocalModelLeanUpdate.changed;
		if (!test.auth.authFingerprint && (!test.auth.runtimeOwnerFingerprint || !test.auth.runtimeOwnerKind || !test.auth.runtimeOwnerId?.trim())) return {
			ok: false,
			status: "unknown",
			error: "Inference succeeded, but its runtime did not report an owner that OpenClaw can safely reuse. No model or credential route was saved."
		};
		if (testPlan.runner === "cli" && (!test.auth.runtimeArtifactFingerprint || !test.auth.runtimeArtifactId?.trim())) return {
			ok: false,
			status: "unknown",
			error: "Inference succeeded, but its CLI executable/package artifact could not be safely reused. No model or credential route was saved."
		};
		if (testPlan.runner === "embedded") {
			const successfulHarnessId = test.auth.agentHarnessId?.trim();
			if (!successfulHarnessId || testPlan.agentHarnessRuntimeOverride !== "auto" && successfulHarnessId !== testPlan.agentHarnessRuntimeOverride) return {
				ok: false,
				status: "unknown",
				error: "Inference succeeded, but its exact agent harness could not be safely reused. No model or credential route was saved."
			};
			if (successfulHarnessId !== "openclaw" && (test.auth.runtimeOwnerKind !== "plugin-harness" || test.auth.runtimeOwnerId?.trim() !== successfulHarnessId || !test.auth.runtimeArtifactFingerprint || !test.auth.runtimeArtifactId?.trim())) return {
				ok: false,
				status: "unknown",
				error: "Inference succeeded, but its agent harness artifact could not be safely reused. No model or credential route was saved."
			};
		}
		let committedConfig;
		let autoLocalModelLeanApplied = false;
		if (!needsPersistence) {
			const latestSnapshot = await readSnapshot();
			const latestRuntime = latestSnapshot.exists && latestSnapshot.valid ? latestSnapshot.runtimeConfig ?? latestSnapshot.config : void 0;
			const latestRoute = latestRuntime ? await projectDefaultInferenceRoute(latestRuntime) : void 0;
			if (!latestRoute || !sameDefaultInferenceRoute(latestRoute, verifiedRoute)) return {
				ok: false,
				status: "unknown",
				error: "The default-agent inference route changed during its live test. Review the current model/auth/runtime settings and retry."
			};
			const latestResolvedRoute = latestRuntime ? await resolveSystemAgentConfiguredRouteFromConfig(latestRuntime) : null;
			if (!latestResolvedRoute) return {
				ok: false,
				status: "unknown",
				error: "The default-agent inference route could not be resolved after its live test. Review the current model/auth/runtime settings and retry."
			};
			try {
				if (!hasSameOwnerPluginArtifacts(await revalidateSetupInferenceOwner({
					route: latestResolvedRoute,
					auth: test.auth,
					deps
				}), stagedOwnerPluginArtifacts)) throw new Error("inference owner plugin runtime changed during its live test");
			} catch {
				return {
					ok: false,
					status: "auth",
					error: "The verified inference owner changed before activation completed. Retry the inference check."
				};
			}
		}
		if (needsPersistence) {
			const { stripPendingPluginInstallRecords } = await import("./install-record-commit-X0abJfY-.js");
			const agentRuntimeId = resolveSetupAgentRuntimeId(params.kind);
			const selectModel = plan.persistModelRef ? await createSystemAgentModelSelectionUpdater({
				model: plan.persistModelRef,
				...agentRuntimeId ? { agentRuntimeId } : {},
				...plan.manualAuth && plan.authProfileId ? { authProfileId: plan.authProfileId } : {}
			}) : void 0;
			const stageCandidate = (current, configKind) => {
				let next = codexPluginPatch === void 0 ? current : stripPendingPluginInstallRecords(current);
				if (plan.manualAuth) next = applyManualAuthConfig(next, plan.manualAuth, configKind, deps.enablePluginInConfig ?? enablePluginInConfig);
				if (codexPluginPatch !== void 0) {
					const enabledCodex = enablePluginInConfig(normalizePluginTargetConfig(applyMergePatch(next, codexPluginPatch), "codex"), "codex");
					if (!enabledCodex.enabled) throw new SetupInferenceActivationUnavailableError(`Could not enable the Codex runtime plugin: ${enabledCodex.reason ?? "plugin disabled"}.`);
					next = enabledCodex.config;
				}
				next = applyAutoLocalModelLean({
					config: next,
					providerId: testPlan.provider,
					modelRef: plan.modelRef
				}).config;
				next = selectModel ? selectModel(next) : next;
				if (!pendingCodexInstall) return next;
				return {
					...next,
					plugins: {
						...next.plugins,
						installs: { codex: pendingCodexInstall }
					}
				};
			};
			const persistedRoute = pendingCodexInstall ? await projectDefaultInferenceRoute(stripPendingPluginInstallRecords(stageCandidate(cfg, "runtime"))) : verifiedRoute;
			const expectedSourceCandidateRoute = await projectDefaultInferenceRoute(stageCandidate(sourceCfg, "source"));
			const transformConfig = deps.transformConfigWithPendingPluginInstalls ?? (await import("./install-record-commit-X0abJfY-.js")).transformConfigWithPendingPluginInstalls;
			let manualAuthReceipt;
			if (hasPreparedAuthProfiles && plan.manualAuth) {
				throwIfSetupInferenceCancelled(params);
				const initialCandidate = stageCandidate(cfg, "runtime");
				const initialRoute = await projectDefaultInferenceRoute(initialCandidate);
				const resolvedRoute = await resolveSystemAgentConfiguredRouteFromConfig(initialCandidate);
				if (!sameDefaultInferenceRoute(initialRoute, verifiedRoute) || !resolvedRoute || resolvedRoute.modelLabel !== plan.modelRef || resolvedRoute.authProfileId !== plan.authProfileId) throw new Error("The default-agent inference route changed during its live test, so the verified credential was not saved. Review the current model/auth/runtime settings and retry.");
				const persistedManualAuth = await persistManualAuthProfiles({
					profiles: plan.manualAuth.profiles,
					agentDir: resolvedRoute.agentDir,
					deps
				});
				if (persistedManualAuth.status === "unknown") {
					if (await rollbackManualAuthProfiles(persistedManualAuth.receipt, deps)) return {
						ok: false,
						status: "unknown",
						error: "Could not confirm the credential write, so it was rolled back. Try again in a moment."
					};
					throw new SetupInferenceActivationIndeterminateError("Inference activation could not confirm whether its verified credential was saved or rolled back. No config commit was attempted; run openclaw doctor --fix before retrying.");
				}
				if (persistedManualAuth.status === "not-persisted") return {
					ok: false,
					status: "unknown",
					error: "Could not save the verified credential; try again in a moment."
				};
				manualAuthReceipt = persistedManualAuth.receipt;
			}
			let commitMayHaveStarted = false;
			try {
				throwIfSetupInferenceCancelled(params);
				committedConfig = (await transformConfig({
					base: "source",
					afterWrite: { mode: "auto" },
					transform: async (current, context) => {
						const latestRuntime = context.snapshot.runtimeConfig ?? context.snapshot.config;
						const stagedRuntime = stageCandidate(latestRuntime, "runtime");
						if (!sameDefaultInferenceRoute(await projectDefaultInferenceRoute(latestRuntime), baselineRoute)) throw new Error("The default-agent inference route changed during its live test, so the verified candidate was not saved. Review the current model/auth/runtime settings and retry.");
						if (!isDeepStrictEqual(projectSetupTargetModelMetadata(latestRuntime, stagedRoute.modelLabel), baselineTargetModelMetadata)) throw new Error("The target model metadata changed during its live inference test, so the verified candidate was not saved. Review the current model settings and retry.");
						if (!sameDefaultInferenceRoute(await projectDefaultInferenceRoute(stagedRuntime), verifiedRoute)) throw new Error("The default-agent inference route changed during its live test, so the verified candidate was not saved. Review the current model/auth/runtime settings and retry.");
						const resolvedRoute = await resolveSystemAgentConfiguredRouteFromConfig(stagedRuntime);
						if (!resolvedRoute || resolvedRoute.modelLabel !== plan.modelRef || plan.authProfileId && resolvedRoute.authProfileId !== plan.authProfileId) throw new Error("The latest default-agent route no longer matches the verified candidate, so it was not saved. Review the current config and retry.");
						if (!isDeepStrictEqual(projectSetupTargetModelMetadata(current, stagedRoute.modelLabel), sourceTargetModelMetadata)) throw new Error("The authored target model metadata changed during its live inference test, so the verified candidate was not saved. Review the current model settings and retry.");
						const autoLocalModelLean = applyAutoLocalModelLean({
							config: current,
							providerId: testPlan.provider,
							modelRef: plan.modelRef
						});
						const nextConfig = stageCandidate(current, "source");
						const nextRouteProjection = await projectDefaultInferenceRoute(nextConfig);
						const nextResolvedRoute = await resolveSystemAgentConfiguredRouteFromConfig(nextConfig);
						if (!sameDefaultInferenceRoute(nextRouteProjection, expectedSourceCandidateRoute) || !nextResolvedRoute || nextResolvedRoute.modelLabel !== plan.modelRef || plan.authProfileId && nextResolvedRoute.authProfileId !== plan.authProfileId) throw new Error("The source config no longer matches the verified candidate, so it was not saved. Review the current config and retry.");
						if (!hasSameOwnerPluginArtifacts(await revalidateSetupInferenceOwner({
							route: nextResolvedRoute,
							auth: test.auth,
							deps
						}), stagedOwnerPluginArtifacts)) throw new Error("inference owner plugin runtime changed during its live test");
						throwIfSetupInferenceCancelled(params);
						params.onCommitStarted?.();
						commitMayHaveStarted = true;
						autoLocalModelLeanApplied = autoLocalModelLean.enabled;
						return { nextConfig };
					}
				})).nextConfig;
				if (pendingCodexInstall) codexInstallOwnership = "owned";
			} catch (error) {
				if (!commitMayHaveStarted) {
					if (manualAuthReceipt) {
						if (!await rollbackManualAuthProfiles(manualAuthReceipt, deps)) throw new SetupInferenceActivationIndeterminateError("Inference activation stopped before its config commit, but could not confirm removal of its staged credential. Run openclaw doctor --fix before retrying.");
					}
					throw error;
				}
				const reconciledSnapshot = await readSnapshot().catch(() => null);
				const reconciledRuntime = reconciledSnapshot?.exists && reconciledSnapshot.valid ? reconciledSnapshot.runtimeConfig ?? reconciledSnapshot.config : void 0;
				const reconciledRoute = reconciledRuntime ? await projectDefaultInferenceRoute(reconciledRuntime) : void 0;
				const codexInstallPersisted = pendingCodexInstall ? await isCodexInstallRecordPersisted(pendingCodexInstall, deps) : true;
				const committedDespiteError = reconciledRoute !== void 0 && sameDefaultInferenceRoute(reconciledRoute, persistedRoute) && (!manualAuthReceipt || manualAuthProfilesPersisted(manualAuthReceipt, deps)) && codexInstallPersisted;
				if (pendingCodexInstall) codexInstallOwnership = committedDespiteError ? "owned" : "unowned";
				if (!committedDespiteError) {
					if (manualAuthReceipt) {
						if (!reconciledRuntime || configReferencesManualAuthProfiles(reconciledRuntime, manualAuthReceipt)) throw new SetupInferenceActivationIndeterminateError("Inference activation could not confirm its config commit state. The verified credential was retained because the current config may reference it. Run openclaw doctor --fix before retrying.");
						if (!await rollbackManualAuthProfiles(manualAuthReceipt, deps)) throw new SetupInferenceActivationIndeterminateError("Inference activation failed and its staged credential could not be rolled back. Run openclaw doctor --fix before retrying.");
					}
					throw error;
				}
				committedConfig = reconciledSnapshot?.sourceConfig ?? reconciledRuntime;
				log.warn("Inference activation committed successfully despite a post-write cleanup error.");
			}
		}
		if (codexRegistryNeedsReload && committedConfig) {
			codexRegistryReloaded = await reloadCodexRegistryAfterActivation({
				readSnapshot,
				workspaceDir: workspace,
				deps
			});
			if (!codexRegistryReloaded) throw new SetupInferenceActivationIndeterminateError("Inference activation committed, but the active plugin registry could not be reloaded. Restart the Gateway before using Codex inference.");
		}
		const announceAutoLocalModelLean = autoLocalModelLeanApplied && committedConfig?.agents?.defaults?.experimental?.localModelLean === true;
		let lines = [`Inference verified: ${plan.modelRef}`, ...announceAutoLocalModelLean ? [AUTO_LOCAL_MODEL_LEAN_ANNOUNCEMENT] : []];
		if (params.surface === "gateway" && params.recordSetupAudit !== false) {
			const after = await readSnapshot().catch(() => null);
			try {
				await appendSystemAgentAuditEntry({
					operation: "openclaw.setup",
					summary: "Verified and configured AI access through OpenClaw setup",
					configPath: after?.path ?? snapshot.path,
					configHashBefore: snapshot.hash ?? null,
					configHashAfter: after?.hash ?? null,
					details: {
						modelRef: plan.modelRef,
						inferenceKind: params.kind
					}
				});
			} catch (error) {
				const warning = `Inference setup completed, but OpenClaw could not record its audit entry: ${formatErrorMessage(error)}`;
				params.runtime.error?.(warning);
				lines = [...lines, warning];
			}
		}
		return {
			ok: true,
			modelRef: plan.modelRef,
			latencyMs: test.latencyMs,
			lines
		};
	} finally {
		let codexCleanupError;
		if (pendingCodexInstall && codexInstallOwnership !== "owned") {
			if (!await retainUnownedCodexInstall({
				record: pendingCodexInstall,
				verifyOwnership: false,
				deps
			})) codexCleanupError = new SetupInferenceActivationIndeterminateError("Inference activation stopped before its Codex runtime package could be retained safely. Restart the Gateway before retrying.");
		}
		if (codexRegistryNeedsReload && !codexRegistryReloaded) {
			codexRegistryReloaded = await reloadCodexRegistryAfterActivation({
				readSnapshot,
				workspaceDir: workspace,
				deps
			});
			if (!codexRegistryReloaded) codexCleanupError = new SetupInferenceActivationIndeterminateError("Inference activation could not restore the active plugin registry after its Codex probe. Restart the Gateway before retrying.");
		}
		await cleanupSetupInferenceTempDir({
			tempDir,
			deps,
			runtime: params.runtime
		});
		if (codexCleanupError) throw codexCleanupError;
	}
}
async function redactSetupInferenceError(message, apiKey) {
	const secrets = new Set([apiKey, apiKey?.trim()].filter((value) => Boolean(value)));
	let redacted = message;
	for (const secret of Array.from(secrets).toSorted((a, b) => b.length - a.length)) redacted = redacted.split(secret).join("[redacted]");
	const { redactToolPayloadText } = await import("./redact-C5zL2TF0.js");
	return redactToolPayloadText(redacted);
}
function hasSameOwnerPluginArtifacts(binding, snapshot) {
	return isDeepStrictEqual(binding.ownerPluginIds, snapshot.ownerPluginIds) && isDeepStrictEqual(binding.ownerPluginArtifacts, snapshot.ownerPluginArtifacts);
}
async function verifySetupInference(params) {
	const readSnapshot = {
		...params.deps,
		...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {}
	}.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot;
	const snapshot = await readSnapshot();
	if (!snapshot.exists) return {
		ok: false,
		status: "unavailable",
		error: "No OpenClaw config exists. Run `openclaw onboard` first."
	};
	if (!snapshot.valid) return {
		ok: false,
		status: "format",
		error: invalidSetupConfigError(snapshot)
	};
	const cfg = snapshot.runtimeConfig ?? snapshot.config;
	const baselineRoute = await projectInferenceRoute(cfg, params.agentId);
	let verifiedBinding;
	const verification = await verifySetupInferenceConfig({
		config: cfg,
		runtime: params.runtime,
		requireExecutionOwner: params.bindSession === true,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
		...params.deps ? { deps: params.deps } : {},
		...params.bindSession ? { onVerifiedExecution: (_auth, binding) => {
			verifiedBinding = binding;
		} } : {}
	});
	if (!verification.ok) return verification;
	const latestSnapshot = await readSnapshot().catch(() => null);
	const latestConfig = latestSnapshot?.exists && latestSnapshot.valid ? latestSnapshot.runtimeConfig ?? latestSnapshot.config : void 0;
	const latestRoute = latestConfig ? await projectInferenceRoute(latestConfig, params.agentId) : void 0;
	if (!latestRoute || !sameDefaultInferenceRoute(baselineRoute, latestRoute)) return {
		ok: false,
		status: "unknown",
		error: "The inference route changed during its live test. Review current model/auth/runtime settings and retry."
	};
	if (!params.bindSession) return verification;
	if (!await resolveSystemAgentConfiguredRouteFromConfig(cfg, params.agentId) || !verifiedBinding) return {
		ok: false,
		status: "unknown",
		error: "The successful inference run did not report an exact execution binding. Retry setup before starting OpenClaw."
	};
	return {
		...verification,
		binding: verifiedBinding
	};
}
function executionRouteIdentity(route) {
	const { runConfig: _runConfig, ...identity } = route;
	return identity;
}
/**
* Strict credentials need only the static owner check. Opaque runtimes can
* prove liveness only by completing another exact turn at the side-effect
* boundary; the result must still be the original frozen route.
*/
async function resolvePersistentApplyInference(params) {
	const deps = params.deps ?? {};
	const resolveVerified = deps.resolveVerifiedInferenceRoute ?? resolveSystemAgentVerifiedInferenceRoute;
	const initialRoute = await resolveVerified(params.binding, deps);
	if (!initialRoute) return null;
	const hasCurrentOwnerPluginArtifacts = deps.hasCurrentOwnerPluginArtifacts ?? hasCurrentSystemAgentOwnerPluginArtifacts;
	if (!await hasCurrentOwnerPluginArtifacts(params.binding, deps)) return null;
	if (params.binding.auth.proofKind !== "runtime-owner") return initialRoute;
	const live = await (deps.verifyBoundInference ?? verifySetupInference)({
		runtime: params.runtime,
		bindSession: true,
		agentId: params.binding.execution.agentId,
		deps
	});
	if (!live.ok || !isDeepStrictEqual(live.binding.configuredRoute, params.binding.configuredRoute) || !isDeepStrictEqual(executionRouteIdentity(live.binding.execution), executionRouteIdentity(params.binding.execution)) || !isDeepStrictEqual(live.binding.executionFingerprint, params.binding.executionFingerprint) || !isDeepStrictEqual(live.binding.ownerPluginIds, params.binding.ownerPluginIds) || !isDeepStrictEqual(live.binding.ownerPluginArtifacts, params.binding.ownerPluginArtifacts) || !isDeepStrictEqual(live.binding.auth, params.binding.auth)) return null;
	const finalRoute = await resolveVerified(params.binding, deps);
	if (!finalRoute || !await hasCurrentOwnerPluginArtifacts(params.binding, deps)) return null;
	return finalRoute;
}
/** Live-test a staged default-agent route before any caller persists it. */
async function verifySetupInferenceConfig(params) {
	const deps = {
		...params.deps,
		...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {}
	};
	const cfg = params.config;
	const routeAgentId = normalizeAgentId(params.agentId ?? resolveDefaultAgentId(cfg));
	if (!resolveAgentEffectiveModelPrimary(cfg, routeAgentId)) return {
		ok: false,
		status: "unavailable",
		error: "No agent model is configured. Run `openclaw onboard` first."
	};
	const tempDir = await (deps.createTempDir ?? (() => fs.mkdtemp(path.join(os.tmpdir(), "openclaw-setup-inference-"))))();
	try {
		const builtPlan = await buildTestPlan({
			kind: "existing-model",
			cfg,
			sourceCfg: cfg,
			workspaceDir: tempDir,
			pluginWorkspaceDir: tempDir,
			agentDir: path.join(tempDir, "agent"),
			runtime: params.runtime,
			routeAgentId,
			deps
		});
		if ("error" in builtPlan) return {
			ok: false,
			status: "unavailable",
			error: builtPlan.error
		};
		let plan = builtPlan;
		if (params.authProfiles && params.authProfiles.length > 0) {
			const selectedProfile = plan.authProfileId ? params.authProfiles.find((profile) => profile.profileId === plan.authProfileId) : params.authProfiles.find((profile) => normalizeProviderId$1(profile.credential.provider) === normalizeProviderId$1(plan.provider));
			if (!selectedProfile) return {
				ok: false,
				status: "auth",
				error: plan.authProfileId ? "The staged credential does not match the configured auth profile." : "The staged credential does not belong to the configured inference provider."
			};
			const stagedAgentDir = path.join(tempDir, "agent");
			if ((await persistManualAuthProfiles({
				profiles: params.authProfiles,
				agentDir: stagedAgentDir,
				deps
			})).status !== "persisted") return {
				ok: false,
				status: "unknown",
				error: "Could not stage the credential for its live inference test; try again in a moment."
			};
			plan = {
				...plan,
				agentDir: stagedAgentDir,
				authProfileId: selectedProfile.profileId
			};
		}
		const readStagedAuthProfiles = () => {
			if (!params.authProfiles || params.authProfiles.length === 0) return;
			const { profiles } = (deps.loadAuthProfileStoreForRuntime ?? loadAuthProfileStoreForRuntime)(plan.agentDir, {
				readOnly: true,
				allowKeychainPrompt: false,
				config: plan.config,
				externalCliProviderIds: [plan.provider]
			});
			return params.authProfiles.map((profile) => {
				const credential = profiles[profile.profileId];
				if (!credential) throw new Error("staged profile missing after verification");
				return {
					profileId: profile.profileId,
					credential
				};
			});
		};
		const retainStagedAuthProfiles = () => {
			try {
				return {
					ok: true,
					authProfiles: readStagedAuthProfiles()
				};
			} catch {
				return {
					ok: false,
					result: {
						ok: false,
						status: "unknown",
						error: "Could not retain the credential after its live inference test."
					}
				};
			}
		};
		const requiresExecutionOwner = params.requireExecutionOwner === true || params.onVerifiedExecution !== void 0;
		let configuredRoute;
		let stagedOwnerPluginArtifacts;
		if (requiresExecutionOwner) {
			configuredRoute = await resolveSystemAgentConfiguredRouteFromConfig(cfg, routeAgentId) ?? void 0;
			if (!configuredRoute) return {
				ok: false,
				status: "unknown",
				error: "The verified inference route could not be resolved for owner validation."
			};
			try {
				stagedOwnerPluginArtifacts = (deps.captureSystemAgentOwnerPluginArtifacts ?? captureSystemAgentOwnerPluginArtifacts)({
					config: cfg,
					executionRoute: configuredRoute,
					deps
				});
			} catch {
				return {
					ok: false,
					status: "unavailable",
					error: "Could not bind the configured inference plugin runtime. Refresh or reinstall the plugin and retry."
				};
			}
		}
		let test = await runSetupInferenceTest({
			plan,
			tempDir,
			deps,
			authProfileStateMode: "read-only",
			requireExecutionOwner: requiresExecutionOwner
		});
		let retained = retainStagedAuthProfiles();
		if (!retained.ok) return retained.result;
		let authProfiles = retained.authProfiles;
		if (test.ok) {
			const verifiedProfileId = test.auth.authProfileId;
			if (plan.authProfileId && verifiedProfileId !== plan.authProfileId) return {
				ok: false,
				status: "auth",
				error: `The inference run used profile "${verifiedProfileId ?? "unknown"}" instead of the configured profile "${plan.authProfileId}".`,
				...authProfiles ? { authProfiles } : {}
			};
			if (params.onVerifiedExecution && !plan.authProfileId && verifiedProfileId) {
				test = await runSetupInferenceTest({
					plan: {
						...plan,
						authProfileId: verifiedProfileId
					},
					tempDir,
					deps,
					authProfileStateMode: "read-only",
					requireExecutionOwner: true
				});
				retained = retainStagedAuthProfiles();
				if (!retained.ok) return retained.result;
				authProfiles = retained.authProfiles;
				if (!test.ok) return {
					...test,
					error: await redactSetupInferenceError(test.error),
					...authProfiles ? { authProfiles } : {}
				};
				if (test.auth.authProfileId !== verifiedProfileId) return {
					ok: false,
					status: "auth",
					error: "The selected inference credential changed during its locked verification.",
					...authProfiles ? { authProfiles } : {}
				};
			}
			if (params.requireExecutionOwner || params.onVerifiedExecution) try {
				const binding = await revalidateSetupInferenceOwner({
					route: configuredRoute,
					auth: test.auth,
					deps
				});
				if (!stagedOwnerPluginArtifacts || !hasSameOwnerPluginArtifacts(binding, stagedOwnerPluginArtifacts)) throw new Error("inference owner plugin runtime changed during its live test");
				params.onVerifiedExecution?.(test.auth, binding);
			} catch {
				return {
					ok: false,
					status: "auth",
					error: "The verified inference owner changed before validation completed. Retry the inference check.",
					...authProfiles ? { authProfiles } : {}
				};
			}
			return {
				ok: true,
				latencyMs: test.latencyMs,
				modelRef: plan.modelRef,
				...authProfiles ? { authProfiles } : {}
			};
		}
		return {
			...test,
			error: await redactSetupInferenceError(test.error),
			...authProfiles ? { authProfiles } : {}
		};
	} finally {
		await cleanupSetupInferenceTempDir({
			tempDir,
			deps,
			runtime: params.runtime
		});
	}
}
/** Run one tool-free completion through the configured setup inference route. */
async function completeSetupInference(params) {
	const snapshot = await (params.deps?.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot)();
	if (!snapshot.exists) return {
		ok: false,
		status: "unavailable",
		error: "No OpenClaw config exists."
	};
	if (!snapshot.valid) return {
		ok: false,
		status: "format",
		error: invalidSetupConfigError(snapshot)
	};
	return await completeSetupInferenceConfig({
		config: snapshot.runtimeConfig ?? snapshot.config,
		prompt: params.prompt,
		runtime: params.runtime,
		...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
		...params.deps ? { deps: params.deps } : {}
	});
}
/** Config-injected variant used by setup clients and live provider tests. */
async function completeSetupInferenceConfig(params) {
	const deps = {
		...params.deps,
		...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {}
	};
	const routeAgentId = normalizeAgentId(resolveDefaultAgentId(params.config));
	if (!resolveAgentEffectiveModelPrimary(params.config, routeAgentId)) return {
		ok: false,
		status: "unavailable",
		error: "No agent model is configured."
	};
	const tempDir = await (deps.createTempDir ?? (() => fs.mkdtemp(path.join(os.tmpdir(), "openclaw-setup-inference-"))))();
	try {
		const plan = await buildTestPlan({
			kind: "existing-model",
			cfg: params.config,
			sourceCfg: params.config,
			workspaceDir: tempDir,
			pluginWorkspaceDir: tempDir,
			agentDir: path.join(tempDir, "agent"),
			runtime: params.runtime,
			routeAgentId,
			deps
		});
		if ("error" in plan) return {
			ok: false,
			status: "unavailable",
			error: plan.error
		};
		const result = await runSetupInferenceTest({
			plan,
			prompt: params.prompt,
			tempDir,
			deps,
			authProfileStateMode: "read-only",
			requireExecutionOwner: false
		});
		if (!result.ok) return {
			...result,
			error: await redactSetupInferenceError(result.error)
		};
		if (plan.authProfileId && result.auth.authProfileId !== plan.authProfileId) return {
			ok: false,
			status: "auth",
			error: "The inference completion used a different credential than the configured route."
		};
		return {
			ok: true,
			modelRef: plan.modelRef,
			latencyMs: result.latencyMs,
			text: result.text
		};
	} finally {
		await cleanupSetupInferenceTempDir({
			tempDir,
			deps,
			runtime: params.runtime
		});
	}
}
async function cleanupSetupInferenceTempDir(params) {
	try {
		(params.deps.disposeOpenClawAgentDatabaseByPath ?? (await import("./openclaw-agent-db-Dz9knUky.js")).disposeOpenClawAgentDatabaseByPath)(path.join(params.tempDir, "agent", "openclaw-agent.sqlite"));
	} catch {
		log.warn("Could not dispose the temporary inference auth database.");
	}
	try {
		await (params.deps.removeTempDir ?? ((dir) => fs.rm(dir, {
			recursive: true,
			force: true
		})))(params.tempDir);
	} catch (error) {
		params.runtime?.error?.(`Could not remove temporary AI setup files: ${formatErrorMessage(error)}`);
		log.warn("Could not remove the temporary inference test directory.");
	}
}
async function isCodexInstallRecordPersisted(record, deps) {
	try {
		const currentInstallRecords = await (deps.readPersistedInstalledPluginIndexInstallRecords ?? (await import("./installed-plugin-index-records-CBud6Uko.js")).readPersistedInstalledPluginIndexInstallRecords)();
		return currentInstallRecords !== null && isDeepStrictEqual(currentInstallRecords.codex, record);
	} catch {
		return false;
	}
}
async function retainUnownedCodexInstall(params) {
	if (params.verifyOwnership && await isCodexInstallRecordPersisted(params.record, params.deps)) return true;
	if (params.record.source !== "npm" || !params.record.installPath?.trim()) return true;
	try {
		const marked = await (params.deps.markRetainedManagedNpmInstall ?? (await import("./managed-npm-retention-DsFQNKOm.js")).markRetainedManagedNpmInstall)({
			packageDir: params.record.installPath,
			pluginId: "codex",
			reason: "openclaw-inference-activation-not-committed"
		});
		if (!marked) log.warn("Could not retain the uncommitted Codex runtime package generation.");
		return marked;
	} catch {
		log.warn("Could not retain the uncommitted Codex runtime package generation.");
		return false;
	} finally {
		await clearUnownedCodexInstallCaches(params.deps);
	}
}
async function clearUnownedCodexInstallCaches(deps) {
	try {
		(deps.clearLoadInstalledPluginIndexInstallRecordsCache ?? (await import("./installed-plugin-index-records-CBud6Uko.js")).clearLoadInstalledPluginIndexInstallRecordsCache)();
	} catch {
		log.warn("Could not clear the plugin install-record cache after failed Codex activation.");
	}
	try {
		(deps.clearPluginMetadataLifecycleCaches ?? (await import("./plugin-metadata-lifecycle-Dl-Z8Zml.js")).clearPluginMetadataLifecycleCaches)();
	} catch {
		log.warn("Could not clear plugin metadata caches after failed Codex activation.");
	}
	try {
		await (deps.invalidatePluginRuntimeDiscoveryAfterConfigMutation ?? (await import("./registry-refresh-7ijD11ai.js")).invalidatePluginRuntimeDiscoveryAfterConfigMutation)({ logger: log });
	} catch {
		log.warn("Could not clear plugin runtime discovery after failed Codex activation.");
	}
}
async function reloadCodexRegistryAfterActivation(params) {
	let snapshot;
	try {
		snapshot = await params.readSnapshot();
	} catch {
		log.warn("Could not read config while reloading the plugin registry after Codex activation.");
		return false;
	}
	const runtimeConfig = snapshot.exists && snapshot.valid ? snapshot.runtimeConfig ?? snapshot.config : {};
	const sourceConfig = snapshot.exists && snapshot.valid ? snapshot.sourceConfig ?? snapshot.config : {};
	try {
		await (params.deps.refreshPluginRegistryAfterConfigMutation ?? (await import("./registry-refresh-7ijD11ai.js")).refreshPluginRegistryAfterConfigMutation)({
			config: sourceConfig,
			reason: "source-changed",
			workspaceDir: params.workspaceDir,
			logger: log
		});
	} catch {
		log.warn("Could not refresh persisted plugin registry metadata after Codex activation.");
	}
	try {
		(params.deps.ensurePluginRegistryLoaded ?? (await import("./runtime-registry-loader-7xx4MjHr.js")).ensurePluginRegistryLoaded)({
			scope: "all",
			config: runtimeConfig,
			activationSourceConfig: sourceConfig,
			workspaceDir: params.workspaceDir
		});
		return true;
	} catch {
		log.warn("Could not reload the active plugin registry after Codex inference activation.");
		return false;
	}
}
function isMergePatchObject(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function mergePatchConflicts(base, current, patch) {
	if (!isMergePatchObject(patch)) return !isDeepStrictEqual(base, current);
	const baseIsObject = isMergePatchObject(base);
	const currentIsObject = isMergePatchObject(current);
	if (baseIsObject !== currentIsObject) return true;
	if (!baseIsObject && !currentIsObject && !isDeepStrictEqual(base, current)) return true;
	const baseRecord = baseIsObject ? base : {};
	const currentRecord = currentIsObject ? current : {};
	return Object.entries(patch).some(([key, childPatch]) => mergePatchConflicts(baseRecord[key], currentRecord[key], childPatch));
}
function applyManualAuthConfig(config, manualAuth, configKind, enablePlugin = enablePluginInConfig) {
	let enabledConfig = config;
	if (manualAuth.pluginId) {
		const enableResult = enablePlugin(config, manualAuth.pluginId);
		if (!enableResult.enabled) throw new Error(`Provider plugin ${manualAuth.pluginId} is ${enableResult.reason}.`);
		enabledConfig = enableResult.config;
	}
	if (mergePatchConflicts(configKind === "runtime" ? manualAuth.runtimeConfigBase : manualAuth.sourceConfigBase, enabledConfig, manualAuth.configPatch)) throw new Error("Provider configuration changed during the live inference test, so the verified credential was not saved. Review the current provider settings and retry.");
	return applyMergePatch(enabledConfig, manualAuth.configPatch);
}
function modelSelectionReferencesProfile(value, profileIds) {
	if (typeof value === "string") {
		const profile = splitTrailingAuthProfile(value).profile;
		return profile !== void 0 && profileIds.has(profile);
	}
	if (!isMergePatchObject(value)) return false;
	if (modelSelectionReferencesProfile(value.primary, profileIds)) return true;
	return Array.isArray(value.fallbacks) && value.fallbacks.some((fallback) => modelSelectionReferencesProfile(fallback, profileIds));
}
function configReferencesManualAuthProfiles(config, receipt) {
	const profileIds = new Set(receipt.profiles.map((profile) => profile.profileId));
	if (Object.keys(config.auth?.profiles ?? {}).some((profileId) => profileIds.has(profileId))) return true;
	if (Object.values(config.auth?.order ?? {}).some((order) => order.some((profileId) => profileIds.has(profileId)))) return true;
	if (modelSelectionReferencesProfile(config.agents?.defaults?.model, profileIds)) return true;
	return (config.agents?.list ?? []).some((agent) => modelSelectionReferencesProfile(agent.model, profileIds));
}
function readManualAuthProfiles(receipt, deps) {
	let store;
	try {
		store = (deps.loadPersistedAuthProfileStore ?? loadPersistedAuthProfileStore)(receipt.agentDir);
	} catch {
		return "unknown";
	}
	if (!store) return "unknown";
	if (receipt.profiles.every((profile) => isDeepStrictEqual(store.profiles[profile.profileId], profile.credential))) return "present";
	if (receipt.profiles.every((profile) => store.profiles[profile.profileId] === void 0)) return "absent";
	return "mismatch";
}
function manualAuthProfilesPersisted(receipt, deps) {
	return readManualAuthProfiles(receipt, deps) === "present";
}
async function persistManualAuthProfiles(params) {
	const profiles = params.profiles.map((profile) => ({
		profileId: profile.profileId,
		credential: normalizeAuthProfileCredential(profile.credential)
	}));
	const insertedProfileIds = /* @__PURE__ */ new Set();
	const receipt = {
		agentDir: params.agentDir,
		profiles,
		insertedProfileIds
	};
	let collision = false;
	const updated = await (params.deps.updateAuthProfileStoreWithLock ?? updateAuthProfileStoreWithLock)({
		agentDir: params.agentDir,
		saveOptions: {
			filterExternalAuthProfiles: false,
			syncExternalCli: false
		},
		updater: (store) => {
			let changed = false;
			for (const profile of profiles) {
				const existing = store.profiles[profile.profileId];
				if (existing && !isDeepStrictEqual(existing, profile.credential)) {
					collision = true;
					return false;
				}
				if (!existing) {
					store.profiles[profile.profileId] = profile.credential;
					insertedProfileIds.add(profile.profileId);
					changed = true;
				}
			}
			return changed;
		}
	});
	if (collision) return { status: "not-persisted" };
	const readback = readManualAuthProfiles(receipt, params.deps);
	if (updated !== null || readback === "present") return {
		status: "persisted",
		receipt
	};
	return readback === "absent" ? { status: "not-persisted" } : {
		status: "unknown",
		receipt
	};
}
async function rollbackManualAuthProfiles(receipt, deps) {
	if (receipt.insertedProfileIds.size === 0) return true;
	const update = deps.updateAuthProfileStoreWithLock ?? updateAuthProfileStoreWithLock;
	for (let attempt = 0; attempt < 3; attempt += 1) {
		let updated = null;
		try {
			updated = await update({
				agentDir: receipt.agentDir,
				saveOptions: {
					filterExternalAuthProfiles: false,
					syncExternalCli: false
				},
				updater: (store) => {
					let changed = false;
					for (const profile of receipt.profiles) {
						if (!receipt.insertedProfileIds.has(profile.profileId)) continue;
						if (isDeepStrictEqual(store.profiles[profile.profileId], profile.credential)) {
							delete store.profiles[profile.profileId];
							changed = true;
						}
					}
					return changed;
				}
			});
		} catch {}
		if (updated && receipt.profiles.every((profile) => !receipt.insertedProfileIds.has(profile.profileId) || updated.profiles[profile.profileId] === void 0)) return true;
		let persistedStore;
		try {
			persistedStore = (deps.loadPersistedAuthProfileStore ?? loadPersistedAuthProfileStore)(receipt.agentDir);
		} catch {
			persistedStore = null;
		}
		if (persistedStore && receipt.profiles.every((profile) => !receipt.insertedProfileIds.has(profile.profileId) || persistedStore.profiles[profile.profileId] === void 0)) return true;
	}
	return false;
}
async function runSetupInferenceTest(params) {
	const { plan, tempDir, deps, authProfileStateMode, requireExecutionOwner } = params;
	const runId = `probe-setup-inference-${randomUUID()}`;
	const sessionId = runId;
	const sessionFile = path.join(tempDir, "session.jsonl");
	const timeoutMs = deps.timeoutMs ?? 9e4;
	const started = Date.now();
	let successfulAuth;
	try {
		if (plan.runner === "cli") {
			const unsupportedError = resolveToolFreeCliSetupError(plan);
			if (unsupportedError) return {
				ok: false,
				status: "unavailable",
				error: unsupportedError
			};
		}
		const strictProfileError = resolveStrictSetupAuthProfileError({
			plan,
			workspaceDir: tempDir,
			deps
		});
		if (strictProfileError) return {
			ok: false,
			status: "auth",
			error: strictProfileError
		};
		let result;
		if (plan.runner === "cli") result = await (deps.runCliAgent ?? (await import("./cli-runner-D3UxLbG3.js")).runCliAgent)({
			sessionId,
			sessionKey: `temp:setup-inference:${runId}`,
			agentId: plan.agentId ?? "openclaw",
			trigger: "manual",
			sessionFile,
			workspaceDir: tempDir,
			...plan.agentDir ? { agentDir: plan.agentDir } : {},
			config: plan.config,
			prompt: params.prompt ?? SETUP_INFERENCE_TEST_PROMPT,
			provider: plan.provider,
			model: plan.model,
			...plan.authProfileId ? { authProfileId: plan.authProfileId } : {},
			timeoutMs,
			runId,
			messageChannel: "openclaw",
			messageProvider: "openclaw",
			executionMode: "side-question",
			disableTools: true,
			cleanupCliLiveSessionOnRunEnd: true,
			onSuccessfulAuthBinding: (binding) => {
				successfulAuth = binding;
			},
			...params.signal ? { abortSignal: params.signal } : {}
		});
		else result = await (deps.runEmbeddedAgent ?? (await import("./embedded-agent-p-G43BJq.js")).runEmbeddedAgent)({
			sessionId,
			sessionKey: `temp:setup-inference:${runId}`,
			agentId: plan.agentId ?? "openclaw",
			trigger: "manual",
			sessionFile,
			workspaceDir: tempDir,
			...plan.agentDir ? { agentDir: plan.agentDir } : {},
			config: plan.config,
			prompt: params.prompt ?? SETUP_INFERENCE_TEST_PROMPT,
			provider: plan.provider,
			model: plan.model,
			...plan.authProfileId ? {
				authProfileId: plan.authProfileId,
				authProfileIdSource: "user"
			} : {},
			authProfileStateMode,
			...plan.cleanupBundleMcpOnRunEnd ? { cleanupBundleMcpOnRunEnd: true } : {},
			...plan.agentHarnessRuntimeOverride ? { agentHarnessRuntimeOverride: plan.agentHarnessRuntimeOverride } : {},
			timeoutMs,
			runId,
			lane: `session:probe-setup-inference:${plan.provider}`,
			thinkLevel: "off",
			reasoningLevel: "off",
			verboseLevel: "off",
			...params.prompt === void 0 ? resolveSetupInferenceProbeStreamParams(plan.agentHarnessRuntimeOverride) : {},
			disableTools: true,
			modelRun: true,
			messageChannel: "openclaw",
			messageProvider: "openclaw",
			onSuccessfulAuthBinding: (binding) => {
				successfulAuth = binding;
			},
			...params.signal ? { abortSignal: params.signal } : {}
		});
		if (params.signal?.aborted) throw new SetupInferenceCancelledError();
		const terminalError = extractRunTerminalError(result);
		if (terminalError) {
			const described = describeFailoverError(new Error(terminalError));
			return {
				ok: false,
				status: mapFailoverReasonToSetupStatus(described.reason),
				error: described.message
			};
		}
		const text = extractRunText(result)?.trim();
		if (!text) return {
			ok: false,
			status: "format",
			error: "The model started but did not send a reply. Try again or pick another option."
		};
		const winnerError = extractRunWinnerError(plan, result);
		if (winnerError) return {
			ok: false,
			status: "format",
			error: winnerError
		};
		if (requireExecutionOwner && !successfulAuth) return {
			ok: false,
			status: "unknown",
			error: "Inference succeeded, but its runtime did not report an owner that OpenClaw can safely reuse."
		};
		return {
			ok: true,
			latencyMs: Date.now() - started,
			text,
			auth: successfulAuth ?? (!requireExecutionOwner && plan.authProfileId ? { authProfileId: plan.authProfileId } : {})
		};
	} catch (error) {
		const described = describeFailoverError(error);
		return {
			ok: false,
			status: mapFailoverReasonToSetupStatus(described.reason),
			error: described.message
		};
	}
}
//#endregion
export { completeSetupInferenceConfig as a, resolvePersistentApplyInference as c, listSetupInferenceAuthOptions as d, listSetupInferenceManualProviders as f, completeSetupInference as i, verifySetupInference as l, SetupInferenceActivationIndeterminateError as n, detectSetupInference as o, activateSetupInference as r, listManualSetupInferenceOptions as s, SETUP_INFERENCE_TEST_TIMEOUT_MS as t, verifySetupInferenceConfig as u };
