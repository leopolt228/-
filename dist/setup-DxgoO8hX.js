import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { m as resolveGatewayPort } from "./paths-CHQRdQZ3.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { r as defaultRuntime } from "./runtime-ZHfN2VLf.js";
import { u as withConsoleSubsystemsSuppressed } from "./console-DvVy2coK.js";
import "./utils-K2PjeLaV.js";
import { p as normalizeSecretInputString } from "./types.secrets-BgE_Zq2x.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-B7OGjVYg.js";
import "./config-BOMcY2yX.js";
import { n as t } from "./i18n-CX_FBkXY.js";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import { c as formatPluginCompatibilityNotice, r as buildPluginCompatibilitySnapshotNotices } from "./status-Byf7l36b.js";
import { t as runWizardWithPromptNavigation } from "./navigation-prompter-CL-8dE9t.js";
import { t as resolveSetupSecretInputString } from "./setup.secret-input-C9_jHjxy.js";
import { a as resolveQuickstartGatewayDefaults, i as requireRiskAcknowledgement, n as readSetupConfigFileSnapshot, o as writeWizardConfigFile, r as readValidSetupConfigFile } from "./setup.shared-Ce40z7aq.js";
import { n as listSetupMigrationOptions, r as runSetupMigrationImport, t as detectSetupMigrationSources } from "./setup.migration-import-DQUxR0rX.js";
//#region src/wizard/setup.model-auth.ts
const loadAuthChoiceModule = createLazyRuntimeModule(() => import("./auth-choice-CsMGvpSY.js"));
const loadModelPickerModule = createLazyRuntimeModule(() => import("./model-picker-CNjMFfto.js"));
function isAuthChoiceSelected(value, keepCurrentAuthChoice) {
	return keepCurrentAuthChoice === void 0 || value !== keepCurrentAuthChoice;
}
async function resolveAuthChoiceModelSelectionPolicy(params) {
	const preferredProvider = await params.resolvePreferredProviderForAuthChoice({
		choice: params.authChoice,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	const [{ resolveManifestProviderAuthChoice }, { resolvePluginSetupProvider }] = await Promise.all([import("./provider-auth-choices-hiBdG3fo.js"), import("./setup-registry-DorntR9n.js")]);
	const manifestChoice = resolveManifestProviderAuthChoice(params.authChoice, {
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		includeUntrustedWorkspacePlugins: false
	});
	if (manifestChoice) {
		const setupProvider = resolvePluginSetupProvider({
			provider: manifestChoice.providerId,
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			pluginIds: [manifestChoice.pluginId]
		});
		const setupPolicy = (setupProvider?.auth.find((method) => normalizeProviderId(method.id) === normalizeProviderId(manifestChoice.methodId)))?.wizard?.modelSelection ?? setupProvider?.wizard?.setup?.modelSelection;
		return {
			preferredProvider,
			promptWhenAuthChoiceProvided: setupPolicy?.promptWhenAuthChoiceProvided === true,
			allowKeepCurrent: setupPolicy?.allowKeepCurrent ?? true
		};
	}
	const { resolvePluginProviders, resolveProviderPluginChoice } = await import("./provider-auth-choice.runtime.js");
	const providers = resolvePluginProviders({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		mode: "setup"
	});
	const resolvedChoice = resolveProviderPluginChoice({
		providers,
		choice: params.authChoice
	});
	const matchedProvider = resolvedChoice?.provider ?? (() => {
		const preferredId = preferredProvider?.trim();
		if (!preferredId) return;
		return providers.find((provider) => typeof provider.id === "string" && provider.id.trim() === preferredId);
	})();
	const setupPolicy = resolvedChoice?.wizard?.modelSelection ?? matchedProvider?.wizard?.setup?.modelSelection;
	return {
		preferredProvider,
		promptWhenAuthChoiceProvided: setupPolicy?.promptWhenAuthChoiceProvided === true,
		allowKeepCurrent: setupPolicy?.allowKeepCurrent ?? true
	};
}
/**
* Run the provider auth-choice + default-model selection loop. When
* `opts.authChoice` is set the prompt is skipped and the flag drives the flow
* (public onboarding automation contract).
*/
async function runSetupModelAuthStep(params) {
	const { opts, prompter, runtime, workspaceDir } = params;
	let nextConfig = params.stagedCandidate?.config ?? params.config;
	let replacementBaseConfig = params.config;
	let authProfiles = params.stagedCandidate?.authProfiles ?? [];
	let persistAuthProfiles = params.stagedCandidate?.persistAuthProfiles ?? (async () => {});
	const authChoiceFromPrompt = opts.authChoice === void 0;
	let authChoice = opts.authChoice;
	let authStore;
	let promptAuthChoiceGrouped;
	let keepCurrentAuthChoice;
	if (authChoiceFromPrompt) {
		const { ensureAuthProfileStore } = await import("./agents/auth-profiles.runtime.js");
		const authChoicePromptModule = await import("./auth-choice-prompt-BLe9-3o8.js");
		promptAuthChoiceGrouped = authChoicePromptModule.promptAuthChoiceGrouped;
		keepCurrentAuthChoice = authChoicePromptModule.KEEP_CURRENT_AUTH_CHOICE;
		authStore = ensureAuthProfileStore(void 0, { allowKeychainPrompt: false });
	}
	while (true) {
		if (authChoiceFromPrompt) authChoice = await promptAuthChoiceGrouped({
			prompter,
			store: authStore,
			includeSkip: true,
			config: nextConfig,
			workspaceDir,
			allowKeepCurrentProvider: true
		});
		if (authChoice === void 0) throw new WizardCancelledError(t("wizard.setup.authChoiceRequired"));
		if (!isAuthChoiceSelected(authChoice, keepCurrentAuthChoice)) break;
		nextConfig = replacementBaseConfig;
		authProfiles = [];
		persistAuthProfiles = async () => {};
		if (authChoice === "custom-api-key") {
			const { promptCustomApiConfig } = await import("./onboard-custom-BDFhJsnf.js");
			nextConfig = (await promptCustomApiConfig({
				prompter,
				runtime,
				config: nextConfig,
				secretInputMode: opts.secretInputMode
			})).config;
			prompter.disableBackNavigation?.();
			break;
		}
		if (authChoice === "skip") {
			if (authChoiceFromPrompt) {
				const { applyPrimaryModel, promptDefaultModel } = await loadModelPickerModule();
				const modelSelection = await promptDefaultModel({
					config: nextConfig,
					prompter,
					allowKeep: true,
					ignoreAllowlist: true,
					includeProviderPluginSetups: false,
					loadCatalog: false,
					workspaceDir,
					runtime
				});
				if (modelSelection.config) nextConfig = modelSelection.config;
				if (modelSelection.model) nextConfig = applyPrimaryModel(nextConfig, modelSelection.model);
				const { warnIfModelConfigLooksOff } = await loadAuthChoiceModule();
				await warnIfModelConfigLooksOff(nextConfig, prompter, { validateCatalog: false });
			}
			break;
		}
		const [{ prepareAuthChoice, resolvePreferredProviderForAuthChoice, warnIfModelConfigLooksOff }, { applyPrimaryModel, promptDefaultModel }] = await Promise.all([loadAuthChoiceModule(), loadModelPickerModule()]);
		prompter.disableBackNavigation?.();
		let authResult;
		try {
			authResult = await prepareAuthChoice({
				authChoice,
				config: nextConfig,
				prompter,
				runtime,
				setDefaultModel: true,
				preserveExistingDefaultModel: true,
				opts: {
					...opts,
					token: opts.authChoice === "apiKey" && opts.token ? opts.token : void 0
				}
			});
		} catch (error) {
			if (error instanceof WizardCancelledError || !authChoiceFromPrompt) throw error;
			await prompter.note([formatErrorMessage(error), t("wizard.setup.authChoiceFailedRetry")].join("\n"), t("wizard.setup.authChoiceFailedTitle"));
			continue;
		}
		nextConfig = authResult.config;
		authProfiles = authResult.authProfiles;
		persistAuthProfiles = authResult.persistAuthProfiles;
		if (authResult.retrySelection) {
			if (authChoiceFromPrompt) {
				replacementBaseConfig = authResult.config;
				continue;
			}
			break;
		}
		if (authResult.agentModelOverride) nextConfig = applyPrimaryModel(nextConfig, authResult.agentModelOverride);
		const authChoiceModelSelectionPolicy = await resolveAuthChoiceModelSelectionPolicy({
			authChoice,
			config: nextConfig,
			workspaceDir,
			resolvePreferredProviderForAuthChoice
		});
		if (authChoiceFromPrompt || authChoiceModelSelectionPolicy?.promptWhenAuthChoiceProvided) {
			const modelSelection = await promptDefaultModel({
				config: nextConfig,
				prompter,
				allowKeep: authChoiceModelSelectionPolicy?.allowKeepCurrent ?? true,
				ignoreAllowlist: true,
				includeProviderPluginSetups: true,
				preferredProvider: authChoiceModelSelectionPolicy?.preferredProvider,
				browseCatalogOnDemand: true,
				workspaceDir,
				runtime
			});
			if (modelSelection.config) nextConfig = modelSelection.config;
			if (modelSelection.model) nextConfig = applyPrimaryModel(nextConfig, modelSelection.model);
		}
		await warnIfModelConfigLooksOff(nextConfig, prompter, { validateCatalog: false });
		break;
	}
	return {
		config: nextConfig,
		authProfiles,
		persistAuthProfiles
	};
}
//#endregion
//#region src/wizard/setup.ts
const loadConfigLoggingModule = createLazyRuntimeModule(() => import("./logging-CiGGi3FT.js"));
const loadOnboardConfigModule = createLazyRuntimeModule(() => import("./onboard-config-BGG5CP3W.js"));
function hasConfiguredDefaultModel(config) {
	return resolveAgentModelPrimaryValue(config.agents?.defaults?.model) !== void 0;
}
async function offerLiveModelVerification(params) {
	if (!await params.prompter.confirm({
		message: t("wizard.setup.testAiAccess"),
		initialValue: true
	})) return {
		config: params.config,
		verified: false
	};
	const { verifySetupInferenceConfig } = await import("./system-agent/setup-inference.js");
	const verify = async (candidate) => {
		const progress = params.prompter.progress(t("wizard.setup.testAiProgress"));
		const result = await withConsoleSubsystemsSuppressed(() => verifySetupInferenceConfig({
			config: candidate.config,
			runtime: params.runtime,
			authProfiles: candidate.authProfiles
		}));
		progress.stop();
		if (result.ok) await params.prompter.note(t("wizard.setup.testAiSuccess", { seconds: (result.latencyMs / 1e3).toFixed(1) }), t("wizard.setup.testAiTitle"));
		else await params.prompter.note(t("wizard.setup.testAiFailure", { reason: result.error }), t("wizard.setup.testAiTitle"));
		return result;
	};
	let candidate = {
		config: params.config,
		authProfiles: [],
		persistAuthProfiles: async () => {}
	};
	let shouldPersistCandidate = false;
	while (true) {
		const result = await verify(candidate);
		if (result.ok) {
			if (!shouldPersistCandidate) return {
				config: params.config,
				verified: true
			};
			await candidate.persistAuthProfiles(result.authProfiles);
			return {
				config: await params.writeConfig(candidate.config),
				verified: true
			};
		}
		if (result.authProfiles) candidate.authProfiles = result.authProfiles;
		if (await params.prompter.select({
			message: t("wizard.setup.testAiFailureChoice"),
			options: [{
				value: "fix",
				label: t("wizard.setup.testAiFix")
			}, {
				value: "continue",
				label: t("wizard.setup.testAiContinue")
			}]
		}) === "continue") return {
			config: params.config,
			verified: false
		};
		candidate = await runSetupModelAuthStep({
			config: params.config,
			stagedCandidate: candidate,
			opts: {
				...params.opts,
				authChoice: void 0
			},
			prompter: params.prompter,
			runtime: params.runtime,
			workspaceDir: params.workspaceDir
		});
		shouldPersistCandidate = true;
	}
}
function isSetupImportFlowChoice(flow) {
	return flow === "import" || flow.startsWith("import:");
}
function resolveImportProviderFromFlowChoice(flow) {
	return flow.startsWith("import:") ? flow.slice(7) : void 0;
}
async function runSetupWizard(opts, runtimeInput, prompter) {
	await runWizardWithPromptNavigation(prompter, async (navigationPrompter) => await runSetupWizardOnce(opts, runtimeInput, navigationPrompter));
}
async function runSetupWizardOnce(opts, runtimeInput, prompter) {
	let runtime = runtimeInput;
	runtime ??= defaultRuntime;
	const onboardHelpers = await import("./onboard-helpers-BtjO0REF.js");
	await onboardHelpers.printWizardHeader(runtime);
	await prompter.intro(t("wizard.setup.intro"));
	const snapshot = await readSetupConfigFileSnapshot();
	let baseConfig = snapshot.valid ? snapshot.exists ? snapshot.sourceConfig ?? snapshot.config : {} : {};
	baseConfig = await requireRiskAcknowledgement({
		opts,
		prompter,
		config: baseConfig
	});
	let pendingPluginInstallMigrationBaseConfig = baseConfig;
	const writeSetupConfigFile = async (config, optsLocal = {}) => await writeWizardConfigFile(config, {
		...optsLocal,
		migrationBaseConfig: pendingPluginInstallMigrationBaseConfig,
		onPendingPluginInstallMigration: () => {
			pendingPluginInstallMigrationBaseConfig = void 0;
		}
	});
	if (snapshot.exists && !snapshot.valid) {
		await prompter.note(onboardHelpers.summarizeExistingConfig(baseConfig), t("wizard.setup.invalidConfigTitle"));
		if (snapshot.issues.length > 0) await prompter.note([
			...snapshot.issues.map((iss) => `- ${iss.path}: ${iss.message}`),
			"",
			"Docs: https://docs.openclaw.ai/gateway/configuration"
		].join("\n"), "Config issues");
		await prompter.outro(`Config invalid. Run \`${formatCliCommand("openclaw doctor")}\` to repair it, then re-run setup.`);
		runtime.exit(1);
		return;
	}
	const compatibilityNotices = snapshot.valid ? buildPluginCompatibilitySnapshotNotices({ config: baseConfig }) : [];
	if (compatibilityNotices.length > 0) await prompter.note([
		`Detected ${compatibilityNotices.length} plugin compatibility notice${compatibilityNotices.length === 1 ? "" : "s"} in the current config.`,
		...compatibilityNotices.slice(0, 4).map((notice) => `- ${formatPluginCompatibilityNotice(notice)}`),
		...compatibilityNotices.length > 4 ? [`- ... +${compatibilityNotices.length - 4} more`] : [],
		"",
		`Review: ${formatCliCommand("openclaw doctor")}`,
		`Inspect: ${formatCliCommand("openclaw plugins inspect --all")}`
	].join("\n"), t("wizard.setup.pluginCompatibilityTitle"));
	const quickstartHint = t("wizard.setup.flowQuickstartHint", { command: formatCliCommand("openclaw configure") });
	const manualHint = t("wizard.setup.flowAdvancedHint");
	const hasExistingModelConfig = hasConfiguredDefaultModel(baseConfig);
	const migrationDetections = await detectSetupMigrationSources({
		config: baseConfig,
		runtime
	});
	const importOptions = (await listSetupMigrationOptions({
		baseConfig,
		detections: migrationDetections
	})).map((option) => {
		const choice = {
			value: `import:${option.providerId}`,
			label: t("wizard.migration.importFrom", { source: option.label })
		};
		if (option.hint) choice.hint = option.hint;
		return choice;
	});
	const explicitFlowRaw = opts.flow?.trim();
	const normalizedExplicitFlow = explicitFlowRaw === "manual" ? "advanced" : explicitFlowRaw;
	if (normalizedExplicitFlow && normalizedExplicitFlow !== "quickstart" && normalizedExplicitFlow !== "advanced" && normalizedExplicitFlow !== "import") {
		runtime.error("Invalid --flow. Use quickstart, manual, advanced, or import. Example: openclaw onboard --flow quickstart");
		runtime.exit(1);
		return;
	}
	const explicitFlow = normalizedExplicitFlow === "quickstart" || normalizedExplicitFlow === "advanced" || normalizedExplicitFlow === "import" ? normalizedExplicitFlow : void 0;
	const keepModelOption = hasExistingModelConfig ? {
		value: "keep-model",
		label: t("wizard.setup.flowKeepModel"),
		hint: t("wizard.setup.flowKeepModelHint")
	} : void 0;
	const importIntent = Boolean(opts.importFrom?.trim() || opts.importSource?.trim() || opts.importSecrets);
	let flow = explicitFlow ?? (importIntent ? "import" : await prompter.select({
		message: t("wizard.setup.setupMode"),
		options: [
			...keepModelOption ? [keepModelOption] : [],
			{
				value: "quickstart",
				label: t("wizard.setup.flowQuickstart"),
				hint: quickstartHint
			},
			{
				value: "advanced",
				label: t("wizard.setup.flowAdvanced"),
				hint: manualHint
			},
			...importOptions
		],
		initialValue: hasExistingModelConfig ? "keep-model" : "quickstart"
	}));
	let keepExistingModelConfig = flow === "keep-model";
	if (keepExistingModelConfig) flow = "quickstart";
	if (opts.mode === "remote" && flow === "quickstart") {
		await prompter.note(t("wizard.setup.quickstartOnlyLocal"), t("wizard.setup.quickstartTitle"));
		flow = "advanced";
	}
	if (snapshot.exists && !keepExistingModelConfig) await prompter.note(onboardHelpers.summarizeExistingConfig(baseConfig), t("wizard.setup.existingConfigTitle"));
	const usedImportFlow = Boolean(opts.importFrom || isSetupImportFlowChoice(flow));
	if (usedImportFlow) {
		const importFrom = opts.importFrom ?? resolveImportProviderFromFlowChoice(flow);
		prompter.disableBackNavigation?.();
		await runSetupMigrationImport({
			opts: {
				...opts,
				...importFrom ? { importFrom } : {}
			},
			baseConfig,
			detections: migrationDetections,
			prompter,
			runtime,
			readConfigFile: readValidSetupConfigFile,
			commitConfigFile: (cfg) => writeWizardConfigFile(cfg, { allowConfigSizeDrop: true }),
			continueOnboarding: true
		});
		const migratedSnapshot = await readSetupConfigFileSnapshot();
		if (!migratedSnapshot.valid) throw new Error("Migration produced an invalid OpenClaw config. Run `openclaw doctor`.");
		baseConfig = migratedSnapshot.sourceConfig ?? migratedSnapshot.config;
		pendingPluginInstallMigrationBaseConfig = baseConfig;
		keepExistingModelConfig ||= hasConfiguredDefaultModel(baseConfig);
		flow = "quickstart";
	}
	const wizardFlow = flow === "advanced" ? "advanced" : "quickstart";
	const quickstartGateway = resolveQuickstartGatewayDefaults(baseConfig);
	if (flow === "quickstart") {
		const formatBind = (value) => {
			if (value === "loopback") return t("wizard.gateway.bindLoopback");
			if (value === "lan") return t("wizard.gateway.bindLan");
			if (value === "custom") return t("wizard.gateway.bindCustom");
			if (value === "tailnet") return t("wizard.gateway.bindTailnet");
			return t("wizard.gateway.bindAuto");
		};
		const formatAuth = (value) => {
			if (value === "token") return t("wizard.setup.quickstartAuthTokenDefault");
			return t("common.password");
		};
		const formatTailscale = (value) => {
			return t(`wizard.gatewayTailscale.${value}`);
		};
		const quickstartLines = quickstartGateway.hasExisting ? [
			t("wizard.setup.quickstartKeepSettings"),
			t("wizard.setup.quickstartGatewayPort", { port: quickstartGateway.port }),
			t("wizard.setup.quickstartGatewayBind", { bind: formatBind(quickstartGateway.bind) }),
			...quickstartGateway.bind === "custom" && quickstartGateway.customBindHost ? [t("wizard.setup.quickstartGatewayCustomIp", { host: quickstartGateway.customBindHost })] : [],
			t("wizard.setup.quickstartGatewayAuth", { auth: formatAuth(quickstartGateway.authMode) }),
			t("wizard.setup.quickstartTailscaleExposure", { exposure: formatTailscale(quickstartGateway.tailscaleMode) }),
			t("wizard.setup.quickstartDirectChannels")
		] : [
			t("wizard.setup.quickstartGatewayPort", { port: quickstartGateway.port }),
			t("wizard.setup.quickstartGatewayBind", { bind: t("wizard.gateway.bindLoopback") }),
			t("wizard.setup.quickstartGatewayAuth", { auth: t("wizard.setup.quickstartAuthTokenDefault") }),
			t("wizard.setup.quickstartTailscaleExposure", { exposure: t("wizard.gatewayTailscale.off") }),
			t("wizard.setup.quickstartDirectChannels")
		];
		await prompter.note(quickstartLines.join("\n"), "QuickStart");
	}
	const localPort = resolveGatewayPort(baseConfig);
	const localUrl = `ws://127.0.0.1:${localPort}`;
	let localGatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;
	try {
		const resolvedGatewayToken = await resolveSetupSecretInputString({
			config: baseConfig,
			value: baseConfig.gateway?.auth?.token,
			path: "gateway.auth.token",
			env: process.env
		});
		if (resolvedGatewayToken) localGatewayToken = resolvedGatewayToken;
	} catch (error) {
		await prompter.note([t("wizard.setup.secretRefProbeFailed", { field: "gateway.auth.token" }), formatErrorMessage(error)].join("\n"), t("wizard.gateway.auth"));
	}
	let localGatewayPassword = process.env.OPENCLAW_GATEWAY_PASSWORD;
	try {
		const resolvedGatewayPassword = await resolveSetupSecretInputString({
			config: baseConfig,
			value: baseConfig.gateway?.auth?.password,
			path: "gateway.auth.password",
			env: process.env
		});
		if (resolvedGatewayPassword) localGatewayPassword = resolvedGatewayPassword;
	} catch (error) {
		await prompter.note([t("wizard.setup.secretRefProbeFailed", { field: "gateway.auth.password" }), formatErrorMessage(error)].join("\n"), t("wizard.gateway.auth"));
	}
	const localProbe = await onboardHelpers.probeGatewayReachable({
		url: localUrl,
		token: localGatewayToken,
		password: localGatewayPassword
	});
	const storedRemoteUrl = normalizeOptionalString(baseConfig.gateway?.remote?.url);
	const optionRemoteUrl = normalizeOptionalString(opts.remoteUrl);
	const remoteUrlChanged = opts.remoteUrl !== void 0 && optionRemoteUrl !== storedRemoteUrl;
	const remoteSeedConfig = opts.remoteUrl === void 0 && opts.remoteToken === void 0 ? baseConfig : {
		...baseConfig,
		gateway: {
			...baseConfig.gateway,
			remote: {
				...baseConfig.gateway?.remote,
				...opts.remoteUrl !== void 0 ? { url: optionRemoteUrl } : {},
				...opts.remoteToken !== void 0 ? { token: normalizeOptionalString(opts.remoteToken) } : remoteUrlChanged ? { token: void 0 } : {},
				...remoteUrlChanged ? { password: void 0 } : {}
			}
		}
	};
	const seededRemoteUrl = remoteSeedConfig.gateway?.remote?.url?.trim() ?? "";
	const remoteOnboard = seededRemoteUrl ? await import("./onboard-remote-DdLPkfjq.js") : null;
	const remoteUrl = seededRemoteUrl && remoteOnboard?.validateGatewayWebSocketUrl(seededRemoteUrl) === void 0 ? seededRemoteUrl : "";
	let remoteGatewayToken = normalizeSecretInputString(remoteSeedConfig.gateway?.remote?.token);
	try {
		const resolvedRemoteGatewayToken = await resolveSetupSecretInputString({
			config: remoteSeedConfig,
			value: remoteSeedConfig.gateway?.remote?.token,
			path: "gateway.remote.token",
			env: process.env
		});
		if (resolvedRemoteGatewayToken) remoteGatewayToken = resolvedRemoteGatewayToken;
	} catch (error) {
		await prompter.note(["Could not resolve gateway.remote.token SecretRef for setup probe.", formatErrorMessage(error)].join("\n"), "Gateway auth");
	}
	const remoteProbe = remoteUrl ? await onboardHelpers.probeGatewayReachable({
		url: remoteUrl,
		token: remoteGatewayToken
	}) : null;
	const mode = opts.mode ?? (flow === "quickstart" ? "local" : await prompter.select({
		message: t("wizard.setup.whatSetup"),
		options: [{
			value: "local",
			label: t("wizard.setup.localGateway"),
			hint: localProbe.ok ? t("wizard.setup.localGatewayReachable", { url: localUrl }) : t("wizard.setup.localGatewayMissing", { url: localUrl })
		}, {
			value: "remote",
			label: t("wizard.setup.remoteGateway"),
			hint: !remoteUrl ? t("wizard.setup.remoteGatewayMissing") : remoteProbe?.ok ? t("wizard.setup.remoteGatewayReachable", { url: remoteUrl }) : t("wizard.setup.remoteGatewayUnreachable", { url: remoteUrl })
		}]
	}));
	if (mode === "remote") {
		const { promptRemoteGatewayConfig } = remoteOnboard ?? await import("./onboard-remote-DdLPkfjq.js");
		const { applySkipBootstrapConfig } = await loadOnboardConfigModule();
		const { logConfigUpdated } = await loadConfigLoggingModule();
		let nextConfig = await promptRemoteGatewayConfig(remoteSeedConfig, prompter, { secretInputMode: opts.secretInputMode });
		if (opts.skipBootstrap) nextConfig = applySkipBootstrapConfig(nextConfig);
		nextConfig = onboardHelpers.applyWizardMetadata(nextConfig, {
			command: "onboard",
			mode
		});
		prompter.disableBackNavigation?.();
		await writeSetupConfigFile(nextConfig, { allowConfigSizeDrop: false });
		logConfigUpdated(runtime);
		await prompter.outro(t("wizard.setup.remoteConfigured"));
		return;
	}
	const workspaceDir = resolveUserPath((opts.workspace ?? (flow === "quickstart" ? baseConfig.agents?.defaults?.workspace ?? onboardHelpers.DEFAULT_WORKSPACE : await prompter.text({
		message: t("wizard.setup.workspaceDirectory"),
		initialValue: baseConfig.agents?.defaults?.workspace ?? onboardHelpers.DEFAULT_WORKSPACE
	}))).trim() || onboardHelpers.DEFAULT_WORKSPACE);
	const { applyLocalSetupWorkspaceConfig, applySkipBootstrapConfig } = await loadOnboardConfigModule();
	let nextConfig = applyLocalSetupWorkspaceConfig(baseConfig, workspaceDir);
	if (opts.skipBootstrap) nextConfig = applySkipBootstrapConfig(nextConfig);
	if (!keepExistingModelConfig) {
		const modelAuth = await runSetupModelAuthStep({
			config: nextConfig,
			opts,
			prompter,
			runtime,
			workspaceDir
		});
		await modelAuth.persistAuthProfiles();
		nextConfig = modelAuth.config;
	}
	const { configureGatewayForSetup } = await import("./setup.gateway-config-De0vtgf7.js");
	const gateway = await configureGatewayForSetup({
		flow: wizardFlow,
		baseConfig,
		nextConfig,
		localPort,
		quickstartGateway,
		secretInputMode: opts.secretInputMode,
		prompter,
		runtime
	});
	nextConfig = gateway.nextConfig;
	const settings = gateway.settings;
	nextConfig = await writeSetupConfigFile(nextConfig, { allowConfigSizeDrop: false });
	let liveModelVerified = false;
	if (opts.nonInteractive !== true && opts.authChoice !== "skip" && !usedImportFlow && hasConfiguredDefaultModel(nextConfig)) {
		const verification = await offerLiveModelVerification({
			config: nextConfig,
			opts,
			prompter,
			runtime,
			workspaceDir,
			writeConfig: async (config) => await writeSetupConfigFile(config, { allowConfigSizeDrop: false })
		});
		nextConfig = verification.config;
		liveModelVerified = verification.verified;
	}
	prompter.disableBackNavigation?.();
	if (opts.skipChannels) await prompter.note(t("wizard.setup.skipChannels"), t("wizard.setup.channelsTitle"));
	else {
		const { listChannelPlugins } = await import("./plugins-B002eaXp.js");
		const { setupChannels } = await import("./onboard-channels-CFRMM7RU.js");
		const quickstartAllowFromChannels = flow === "quickstart" ? listChannelPlugins().filter((plugin) => plugin.meta.quickstartAllowFrom).map((plugin) => plugin.id) : [];
		nextConfig = await setupChannels(nextConfig, runtime, prompter, {
			allowIMessageInstall: true,
			allowSignalInstall: true,
			deferStatusUntilSelection: flow === "quickstart",
			forceAllowFromChannels: quickstartAllowFromChannels,
			skipDmPolicyPrompt: flow === "quickstart",
			skipConfirm: flow === "quickstart",
			quickstartDefaults: flow === "quickstart",
			secretInputMode: opts.secretInputMode
		});
	}
	nextConfig = await writeSetupConfigFile(nextConfig, { allowConfigSizeDrop: false });
	const { logConfigUpdated } = await loadConfigLoggingModule();
	logConfigUpdated(runtime);
	await onboardHelpers.ensureWorkspaceAndSessions(workspaceDir, runtime, {
		skipBootstrap: Boolean(nextConfig.agents?.defaults?.skipBootstrap),
		skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles
	});
	if (!usedImportFlow) {
		const { runSetupMemoryImportStep } = await import("./setup.memory-import-BJ2z74CX.js");
		await runSetupMemoryImportStep({
			config: nextConfig,
			prompter,
			runtime
		});
	}
	if (opts.skipSearch) await prompter.note(t("wizard.setup.skipSearch"), t("wizard.setup.searchTitle"));
	else {
		const { setupSearch } = await import("./onboard-search-D3ZkmVA9.js");
		nextConfig = await setupSearch(nextConfig, runtime, prompter, {
			quickstartDefaults: flow === "quickstart",
			secretInputMode: opts.secretInputMode
		});
	}
	if (opts.skipSkills) await prompter.note(t("wizard.setup.skipSkills"), t("wizard.setup.skillsTitle"));
	else {
		const { setupSkills } = await import("./onboard-skills-C2H02ijx.js");
		nextConfig = await setupSkills(nextConfig, workspaceDir, runtime, prompter, { nodeManager: opts.nodeManager });
	}
	let commitAppRecommendationResult;
	if (flow !== "quickstart") {
		const { setupOfficialPluginInstalls } = await import("./setup.official-plugins-DZ1c5sNS.js");
		nextConfig = await setupOfficialPluginInstalls({
			config: nextConfig,
			prompter,
			runtime,
			workspaceDir
		});
		const { setupAppRecommendations } = await import("./setup.app-recommendations-CBKLx_0Z.js");
		const recommendationOutcome = await setupAppRecommendations({
			config: nextConfig,
			prompter,
			runtime,
			workspaceDir,
			modelRouteVerified: liveModelVerified
		});
		nextConfig = recommendationOutcome.config;
		commitAppRecommendationResult = recommendationOutcome.commitResult;
		const { setupPluginConfig } = await import("./setup.plugin-config-CWruhPTp.js");
		nextConfig = await setupPluginConfig({
			config: nextConfig,
			prompter,
			workspaceDir
		});
	}
	if (!opts.skipHooks) {
		const { enableDefaultOnboardingInternalHooks } = await import("./onboard-hooks-B9MyjyDR.js");
		nextConfig = enableDefaultOnboardingInternalHooks(nextConfig);
	}
	nextConfig = onboardHelpers.applyWizardMetadata(nextConfig, {
		command: "onboard",
		mode
	});
	nextConfig = await writeSetupConfigFile(nextConfig, { allowConfigSizeDrop: false });
	commitAppRecommendationResult?.();
	const { finalizeSetupWizard } = await import("./setup.finalize-S4Ua5b40.js");
	if ((await finalizeSetupWizard({
		flow: wizardFlow,
		opts,
		baseConfig,
		hadExistingConfig: snapshot.exists,
		nextConfig,
		workspaceDir,
		settings,
		prompter,
		runtime
	})).launchedTui) runtime.exit(0);
}
//#endregion
export { runSetupWizard as t };
