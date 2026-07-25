import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { u as withConsoleSubsystemsSuppressed } from "./console-DvVy2coK.js";
import { h as shortenHomePath } from "./utils-K2PjeLaV.js";
import { n as formatConfigIssueLines } from "./issue-format-BfBp97Wi.js";
import { n as t } from "./i18n-CX_FBkXY.js";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import { i as requireRiskAcknowledgement } from "./setup.shared-Ce40z7aq.js";
import { n as runInteractiveOnboarding, t as hasInteractiveOnboardingTty } from "./onboard-interactive-runner-DCjqfU2_.js";
//#region src/commands/onboard-guided-manual.ts
const SETUP_FAILURE_REASON_KEYS = {
	auth: "wizard.guided.failureAuth",
	rate_limit: "wizard.guided.failureRateLimit",
	billing: "wizard.guided.failureBilling",
	timeout: "wizard.guided.failureTimeout",
	format: "wizard.guided.failureFormat",
	unavailable: "wizard.guided.failureUnavailable",
	unknown: "wizard.guided.failureUnknown"
};
function setupFailureReason(status) {
	return t(SETUP_FAILURE_REASON_KEYS[status]);
}
async function noteActivationFailure(params) {
	await params.prompter.note(t("wizard.guided.testFailure", {
		label: params.label,
		reason: setupFailureReason(params.result.status),
		detail: params.result.error
	}), t("wizard.guided.aiAccessTitle"));
}
async function tryCandidate(params) {
	const progress = params.prompter.progress(t("wizard.guided.testingCandidate", {
		label: params.candidate.label,
		modelRef: params.candidate.modelRef
	}));
	const result = await withConsoleSubsystemsSuppressed(() => params.activate({
		kind: params.candidate.kind,
		modelRef: params.candidate.modelRef,
		workspace: params.workspace,
		surface: "cli",
		runtime: params.runtime
	}));
	progress.stop(result.ok ? t("wizard.guided.testPassed") : t("wizard.guided.testFailed"));
	if (result.ok) return {
		kind: "success",
		result
	};
	if (params.collectFailure) params.collectFailure({
		label: params.candidate.label,
		status: result.status
	});
	else await noteActivationFailure({
		prompter: params.prompter,
		label: params.candidate.label,
		result
	});
	return { kind: "failure" };
}
async function runManualStage(params) {
	const allowedChoices = /* @__PURE__ */ new Set([...params.detection.manualProviders.map((provider) => provider.id), ...params.detection.authOptions.map((option) => option.id)]);
	const detectedOptions = params.detection.candidates.map((candidate) => ({
		value: `candidate:${candidate.kind}`,
		label: t(params.autoAttemptedKinds.has(candidate.kind) ? "wizard.guided.retryCandidate" : "wizard.guided.tryCandidate", {
			label: candidate.label,
			detail: candidate.detail
		})
	}));
	if (detectedOptions.length === 0 && allowedChoices.size === 0) {
		await params.prompter.note(t("wizard.guided.noInferenceOptions"), t("wizard.guided.aiAccessTitle"));
		throw new WizardCancelledError("no inference setup options");
	}
	const additionalGroups = detectedOptions.length ? [{
		value: "detected-ai",
		label: t("wizard.guided.detectedTitle"),
		options: detectedOptions
	}] : [];
	const [{ ensureAuthProfileStore }, { promptAuthChoiceGrouped }] = await Promise.all([import("./agents/auth-profiles.runtime.js"), import("./auth-choice-prompt-BLe9-3o8.js")]);
	const store = ensureAuthProfileStore(void 0, { allowKeychainPrompt: false });
	while (true) {
		const choice = await promptAuthChoiceGrouped({
			prompter: params.prompter,
			store,
			includeSkip: true,
			assistantVisibleOnly: false,
			allowedChoices,
			additionalGroups,
			config: params.config,
			workspaceDir: params.workspace
		});
		if (choice === "skip") {
			if (params.hasActiveRoute) {
				await params.prompter.note(t("wizard.guided.keepingCurrent"), t("wizard.guided.aiAccessTitle"));
				return null;
			}
			await params.prompter.note(t("wizard.guided.nextStepsWithoutAi", { workspace: params.workspace }), t("wizard.guided.nextStepsTitle"));
			return null;
		}
		if (choice.startsWith("candidate:")) {
			const kind = choice.slice(10);
			const candidate = params.detection.candidates.find((item) => item.kind === kind);
			if (!candidate) continue;
			const attempt = await tryCandidate({
				candidate,
				workspace: params.workspace,
				runtime: params.runtime,
				prompter: params.prompter,
				activate: params.activate
			});
			if (attempt.kind === "success") return activationLines(attempt.result);
			continue;
		}
		const authOption = params.detection.authOptions.find((item) => item.id === choice);
		if (authOption) {
			const result = await withConsoleSubsystemsSuppressed(() => params.activate({
				kind: "provider-auth",
				authChoice: authOption.id,
				workspace: params.workspace,
				surface: "cli",
				runtime: params.runtime,
				prompter: params.prompter
			}));
			if (result.ok) return activationLines(result);
			await noteActivationFailure({
				prompter: params.prompter,
				label: authOption.label,
				result
			});
			continue;
		}
		const provider = params.detection.manualProviders.find((item) => item.id === choice);
		if (!provider) continue;
		const apiKey = await params.prompter.text({
			message: t("wizard.guided.apiKeyPrompt", { label: provider.label }),
			sensitive: true,
			validate: (value) => value.trim() ? void 0 : t("common.required")
		});
		const progress = params.prompter.progress(t("wizard.guided.testingManualProvider", { label: provider.label }));
		const result = await withConsoleSubsystemsSuppressed(() => params.activate({
			kind: "api-key",
			authChoice: provider.id,
			apiKey,
			workspace: params.workspace,
			surface: "cli",
			runtime: params.runtime
		}));
		progress.stop(result.ok ? t("wizard.guided.testPassed") : t("wizard.guided.testFailed"));
		if (result.ok) return activationLines(result);
		await noteActivationFailure({
			prompter: params.prompter,
			label: provider.label,
			result
		});
	}
}
function activationLines(result) {
	return [...result.lines, t("wizard.guided.repliedIn", { seconds: (result.latencyMs / 1e3).toFixed(1) })];
}
//#endregion
//#region src/commands/onboard-guided.ts
async function openSystemAgentChat(deps, workspace, runtime, acceptRisk) {
	await (deps.runSystemAgentChat ?? (async (setupWorkspace, chatRuntime, riskAccepted) => {
		const { runConversationalOnboarding } = await import("./onboard-interactive-Cb8cHmuk.js");
		await runConversationalOnboarding({
			workspace: setupWorkspace,
			...riskAccepted ? { acceptRisk: true } : {}
		}, chatRuntime);
	}))(workspace, runtime, acceptRisk);
}
async function persistRiskAcknowledgement(config) {
	const securityAcknowledgedAt = config.wizard?.securityAcknowledgedAt;
	if (!securityAcknowledgedAt) return;
	const { mutateConfigFileWithRetry } = await import("./config/config.js");
	await mutateConfigFileWithRetry({ mutate: (draft) => {
		if (draft.wizard?.securityAcknowledgedAt) return;
		draft.wizard = {
			...draft.wizard,
			securityAcknowledgedAt
		};
	} });
}
async function runGuidedOnboardingFlow(opts, runtime, deps) {
	const onboardHelpers = await import("./onboard-helpers-BtjO0REF.js");
	const prompter = await (deps.createPrompter?.() ?? import("./clack-prompter-DHZkz4Je.js").then(({ createClackPrompter }) => createClackPrompter()));
	await onboardHelpers.printWizardHeader(runtime);
	await prompter.intro(t("wizard.guided.custodianIntro"));
	await prompter.note(t("wizard.guided.escapeHatches"), t("wizard.guided.welcomeTitle"));
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const snapshot = await readConfigFileSnapshot();
	if (snapshot.exists && !snapshot.valid) {
		const issues = snapshot.issues.length > 0 ? formatConfigIssueLines(snapshot.issues, "-").join("\n") : t("wizard.guided.invalidConfigUnknown");
		await prompter.note(t("wizard.guided.invalidConfigDetails", {
			path: shortenHomePath(snapshot.path),
			issues
		}), t("wizard.setup.invalidConfigTitle"));
		await prompter.outro(t("wizard.guided.invalidConfigRepair", {
			fixCommand: formatCliCommand("openclaw doctor --fix"),
			inspectCommand: formatCliCommand("openclaw config validate")
		}));
		runtime.exit(1);
		return null;
	}
	const existingConfig = snapshot.exists && snapshot.valid ? snapshot.sourceConfig ?? snapshot.config : {};
	const acknowledgedConfig = await requireRiskAcknowledgement({
		opts,
		prompter,
		config: existingConfig
	});
	if (!existingConfig.wizard?.securityAcknowledgedAt) await (deps.persistRiskAcknowledgement ?? persistRiskAcknowledgement)(acknowledgedConfig);
	const custodianMode = (deps.handoffMode ?? "hatch") === "hatch";
	let accessMode = "full";
	if (custodianMode) {
		accessMode = await prompter.select({
			message: t("wizard.guided.accessQuestion"),
			options: [{
				value: "full",
				label: t("wizard.guided.accessFullLabel"),
				hint: t("wizard.guided.accessFullHint")
			}, {
				value: "guarded",
				label: t("wizard.guided.accessGuardedLabel"),
				hint: t("wizard.guided.accessGuardedHint")
			}],
			initialValue: existingConfig.wizard?.accessMode === "guarded" ? "guarded" : "full"
		}) === "guarded" ? "guarded" : "full";
		if (existingConfig.wizard?.accessMode !== accessMode) await (deps.persistAccessMode ?? persistAccessMode)(accessMode);
	}
	const workspace = resolveUserPath(opts.workspace?.trim() || acknowledgedConfig.agents?.defaults?.workspace?.trim() || onboardHelpers.DEFAULT_WORKSPACE);
	const activate = deps.activate ?? (await import("./system-agent/setup-inference.js")).activateSetupInference;
	const detect = deps.detect ?? (await import("./system-agent/setup-inference.js")).detectSetupInference;
	const autoAttemptedKinds = /* @__PURE__ */ new Set();
	const ladderFailures = [];
	let detection;
	let resultLines;
	let successLabel;
	const wantsDiscovery = accessMode === "full" || await prompter.select({
		message: t("wizard.guided.lookAroundQuestion"),
		options: [{
			value: "look",
			label: t("wizard.guided.lookAroundYes")
		}, {
			value: "manual",
			label: t("wizard.guided.lookAroundManual")
		}],
		initialValue: "look"
	}) !== "manual";
	if (wantsDiscovery) {
		const detectionProgress = prompter.progress(t("wizard.guided.detecting"));
		detection = await detect();
		detectionProgress.stop(t("wizard.guided.detected"));
		if (detection.candidates.length === 0) {
			await prompter.note(t("wizard.guided.foundNothing"), t("wizard.guided.detectedTitle"));
			if (detection.recommendedInstalls.length > 0) {
				const recommendedInstalls = detection.recommendedInstalls.map((install) => t("wizard.guided.recommendedInstall", {
					label: install.label,
					hint: install.hint,
					website: install.website
				}));
				await prompter.note(recommendedInstalls.join("\n"), t("wizard.guided.recommendedInstallsTitle"));
			}
		} else {
			const candidates = detection.candidates.map((candidate) => t("wizard.guided.detectedCandidate", {
				label: candidate.label,
				detail: candidate.detail
			}));
			await prompter.note(candidates.join("\n"), t("wizard.guided.detectedTitle"));
			const codingAgents = !custodianMode ? [] : detection.candidates.filter((candidate) => candidate.kind === "claude-cli" || candidate.kind === "codex-cli").map((candidate) => candidate.label);
			if (codingAgents.length > 0) await prompter.note(t("wizard.guided.codingAgentQuip", { labels: codingAgents.join(", ") }), t("wizard.guided.detectedTitle"));
		}
		if (detection.unavailableCandidates.length > 0) {
			const unavailable = detection.unavailableCandidates.map((candidate) => t("wizard.guided.unavailableCandidate", {
				label: candidate.label,
				detail: candidate.detail,
				reason: candidate.reason
			}));
			await prompter.note(unavailable.join("\n"), t("wizard.guided.unavailableTitle"));
		}
		for (const candidate of detection.candidates.filter((item) => item.credentials !== false)) {
			autoAttemptedKinds.add(candidate.kind);
			const attempt = await tryCandidate({
				candidate,
				workspace,
				runtime,
				prompter,
				activate,
				...custodianMode ? { collectFailure: (failure) => ladderFailures.push(failure) } : {}
			});
			if (attempt.kind === "success") {
				resultLines = activationLines(attempt.result);
				successLabel = candidate.label;
				break;
			}
			if (candidate.kind === "existing-model") {
				await prompter.note(t("wizard.guided.existingModelKept"), t("wizard.guided.aiAccessTitle"));
				break;
			}
		}
	} else detection = {
		candidates: [],
		unavailableCandidates: [],
		recommendedInstalls: [],
		...await (deps.listManualOptions ?? (await import("./system-agent/setup-inference.js")).listManualSetupInferenceOptions)()
	};
	if (resultLines && successLabel && custodianMode) {
		if (ladderFailures.length > 0) await prompter.note(t("wizard.guided.silentFailures", { count: String(ladderFailures.length) }), t("wizard.guided.aiAccessTitle"));
		if (await prompter.select({
			message: t("wizard.guided.routeConfirm", { label: successLabel }),
			options: [{
				value: "use",
				label: t("wizard.guided.routeUse", { label: successLabel })
			}, {
				value: "other",
				label: t("wizard.guided.routeOther")
			}],
			initialValue: "use"
		}) === "other") {
			if (ladderFailures.length > 0) await prompter.note([t("wizard.guided.failedOptionsIntro"), ...ladderFailures.map((failure) => t("wizard.guided.failedOptionLine", {
				label: failure.label,
				reason: setupFailureReason(failure.status)
			}))].join("\n"), t("wizard.guided.aiAccessTitle"));
			const manualResult = await runManualStage({
				detection,
				autoAttemptedKinds,
				config: existingConfig,
				workspace,
				runtime,
				prompter,
				activate,
				hasActiveRoute: true
			});
			if (manualResult) resultLines = manualResult;
		}
	} else if (!resultLines) {
		if (ladderFailures.length > 0) {
			const failureLines = ladderFailures.map((failure) => t("wizard.guided.failedOptionLine", {
				label: failure.label,
				reason: setupFailureReason(failure.status)
			}));
			await prompter.note([t("wizard.guided.failedOptionsIntro"), ...failureLines].join("\n"), t("wizard.guided.aiAccessTitle"));
		}
		const manualResult = await runManualStage({
			detection,
			autoAttemptedKinds,
			config: existingConfig,
			workspace,
			runtime,
			prompter,
			activate
		});
		if (!manualResult) return null;
		resultLines = manualResult;
	}
	await prompter.note(resultLines.join("\n"), t("wizard.guided.appliedTitle"));
	const persistedSnapshot = await readConfigFileSnapshot();
	let persistedConfig = persistedSnapshot.valid ? persistedSnapshot.sourceConfig ?? persistedSnapshot.config : acknowledgedConfig;
	if (wantsDiscovery) await (deps.runSetupMemoryImportStep ?? (await import("./setup.memory-import-BJ2z74CX.js")).runSetupMemoryImportStep)({
		config: persistedConfig,
		prompter,
		runtime
	});
	if (!custodianMode) return {
		workspace,
		next: "chat"
	};
	const alreadyConfigured = Boolean(detection?.setupComplete || existingConfig.gateway);
	if (alreadyConfigured) await prompter.note(t("wizard.guided.alreadySetUp"), t("wizard.guided.welcomeTitle"));
	else {
		const applySetup = deps.applySetup ?? (await import("./setup-apply-CyyX6lO1.js")).applySystemAgentSetup;
		const applyProgress = prompter.progress(t("wizard.guided.settingUp"));
		try {
			const applied = await withConsoleSubsystemsSuppressed(() => applySetup({
				workspace,
				surface: "cli",
				runtime
			}));
			applyProgress.stop(t("wizard.guided.setupDone"));
			if (applied.lines.length > 0) await prompter.note(applied.lines.join("\n"), t("wizard.guided.appliedTitle"));
			const appliedSnapshot = await readConfigFileSnapshot();
			if (!appliedSnapshot.valid) throw new Error("Setup wrote an invalid OpenClaw config.");
			persistedConfig = appliedSnapshot.sourceConfig ?? appliedSnapshot.config;
		} catch (error) {
			applyProgress.stop(t("wizard.guided.testFailed"));
			await prompter.note(t("wizard.guided.applyFailedFallback", { detail: error instanceof Error ? error.message : String(error) }), t("wizard.guided.aiAccessTitle"));
			return {
				workspace,
				next: "chat"
			};
		}
	}
	if (wantsDiscovery) {
		const recommendationOutcome = await (deps.runAppRecommendations ?? (await import("./setup.app-recommendations-CBKLx_0Z.js")).setupAppRecommendations)({
			config: persistedConfig,
			prompter,
			runtime,
			workspaceDir: workspace,
			modelRouteVerified: true
		});
		const recommendedConfig = recommendationOutcome.config;
		if (recommendedConfig !== persistedConfig) {
			const latestSnapshot = await readConfigFileSnapshot();
			if (!latestSnapshot.valid) throw new Error("App recommendations could not update an invalid OpenClaw config.");
			const latestConfig = latestSnapshot.sourceConfig ?? latestSnapshot.config;
			const { mergeWizardConfigOntoLatest, writeWizardConfigFile } = await import("./setup.shared-DH3PG3Ri.js");
			const mergedConfig = mergeWizardConfigOntoLatest(latestConfig, persistedConfig, recommendedConfig);
			await writeWizardConfigFile(mergedConfig, {
				allowConfigSizeDrop: false,
				...latestSnapshot.hash ? { baseHash: latestSnapshot.hash } : {},
				migrationBaseConfig: latestConfig
			});
			persistedConfig = mergedConfig;
		}
		recommendationOutcome.commitResult();
	}
	const hatchWorkspace = alreadyConfigured ? resolveUserPath(existingConfig.agents?.defaults?.workspace?.trim() || onboardHelpers.DEFAULT_WORKSPACE) : workspace;
	if (opts.tui !== true) {
		if ((await (deps.probeBrowserHandoffGateway ?? (await import("./onboard-browser-handoff-ehJMs0Qk.js")).probeBrowserHatchGateway)({ config: persistedConfig })).ok) {
			if ((await (deps.runBrowserHandoff ?? (await import("./onboard-browser-handoff-ehJMs0Qk.js")).runBrowserHatchHandoff)({
				config: persistedConfig,
				prompter,
				...opts.suppressGatewayTokenOutput ? { suppressTokenOutput: true } : {}
			})).handedOff) {
				await prompter.outro(t("wizard.guided.browserHandoffReady"));
				return {
					workspace: hatchWorkspace,
					next: "browser"
				};
			}
		}
	}
	await prompter.note(t("wizard.guided.findMeLater"), t("wizard.guided.welcomeTitle"));
	await prompter.outro(t("wizard.guided.hatchingNow"));
	return {
		workspace: hatchWorkspace,
		next: "hatch"
	};
}
async function persistAccessMode(mode) {
	const { mutateConfigFileWithRetry } = await import("./config/config.js");
	await mutateConfigFileWithRetry({ mutate: (draft) => {
		if (draft.wizard?.accessMode === mode) return;
		draft.wizard = {
			...draft.wizard,
			accessMode: mode
		};
	} });
}
async function launchHatchTui(workspace) {
	const [{ launchTuiCli }, { DEFAULT_BOOTSTRAP_FILENAME }, { restoreTerminalState }, fs, path] = await Promise.all([
		import("./tui-launch-CLVlc0Q6.js"),
		import("./workspace-Bgw5Juez.js"),
		import("./terminal-core/restore.js"),
		import("node:fs"),
		import("node:path")
	]);
	const hasBootstrap = fs.existsSync(path.join(workspace, DEFAULT_BOOTSTRAP_FILENAME));
	restoreTerminalState("guided hatch tui", { resumeStdinIfPaused: false });
	try {
		await launchTuiCli({
			local: true,
			deliver: false,
			...hasBootstrap ? { message: t("wizard.finalize.bootstrapHatchMessage") } : {}
		}, {});
	} finally {
		restoreTerminalState("post guided hatch tui", { resumeStdinIfPaused: false });
	}
}
async function runGuidedOnboarding(opts, runtime, deps = {}) {
	if (!hasInteractiveOnboardingTty()) {
		runtime.error(t("wizard.guided.ttyRequired"));
		runtime.exit(1);
		return;
	}
	const state = { handoff: null };
	await runInteractiveOnboarding(async () => {
		state.handoff = await runGuidedOnboardingFlow(opts, runtime, deps);
	}, runtime);
	const handoff = state.handoff;
	if (!handoff) return;
	if (handoff.next === "hatch") {
		await (deps.launchHatchTui ?? launchHatchTui)(handoff.workspace);
		return;
	}
	if (handoff.next === "browser") return;
	await openSystemAgentChat(deps, handoff.workspace, runtime, true);
}
//#endregion
export { runGuidedOnboarding as t };
