import { m as resolveGatewayPort } from "./paths-CHQRdQZ3.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { h as shortenHomePath } from "./utils-K2PjeLaV.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { I as validateConfigObjectWithPlugins, f as readConfigFileSnapshotWithPluginMetadata, l as readConfigFileSnapshot, tt as resolveConfigSnapshotHash } from "./io-CEgS2K9F.js";
import { n as enablePluginInConfig } from "./enable-DsCTg972.js";
import { t as applyMergePatch } from "./merge-patch-v6a67_Hq.js";
import "./config-BOMcY2yX.js";
import { n as isReservedSystemAgentId } from "./agent-id-BZRNsGar.js";
import { i as sameDefaultInferenceRoute, t as projectDefaultInferenceRoute } from "./inference-route-qXzDFODa.js";
import { isDeepStrictEqual } from "node:util";
//#region src/system-agent/setup-config-snapshot.ts
function requireValidSystemAgentSetupSnapshot(snapshot) {
	if (snapshot.exists && !snapshot.valid) {
		const issue = snapshot.issues?.[0];
		const detail = issue ? ` (${issue.path ? `${issue.path}: ` : ""}${issue.message})` : "";
		throw new Error(`OpenClaw config ${shortenHomePath(snapshot.path)} is invalid${detail}. Fix it before running setup.`);
	}
	const sourceConfig = snapshot.exists ? snapshot.sourceConfig ?? snapshot.config : {};
	const runtimeConfig = snapshot.exists ? snapshot.runtimeConfig ?? snapshot.config : {};
	const reservedAgent = runtimeConfig.agents?.list?.find((entry) => isReservedSystemAgentId(entry.id));
	if (reservedAgent) throw new Error(`Agent id "${normalizeAgentId(reservedAgent.id)}" is reserved for the system agent. Rename that configured agent, then retry setup.`);
	return {
		sourceConfig,
		runtimeConfig
	};
}
//#endregion
//#region src/system-agent/setup-apply.ts
/** Prompter for quickstart-only flows: notes go to the log, prompts fail loud. */
function createQuickstartNotePrompter(runtime) {
	const unexpected = (kind) => {
		throw new Error(`openclaw setup hit an interactive ${kind} prompt; quickstart must not ask`);
	};
	return {
		intro: async () => {},
		outro: async () => {},
		note: async (message, title) => {
			runtime.log(title ? `${title}: ${message}` : message);
		},
		select: async (params) => {
			if (params.initialValue !== void 0) return params.initialValue;
			return unexpected("select");
		},
		multiselect: async () => unexpected("multiselect"),
		text: async () => unexpected("text"),
		confirm: async (params) => params.initialValue ?? true,
		progress: (label) => {
			runtime.log(label);
			return {
				update: (message) => runtime.log(message),
				stop: (message) => {
					if (message) runtime.log(message);
				}
			};
		}
	};
}
function applySecurityAcknowledgement(config) {
	if (config.wizard?.securityAcknowledgedAt) return config;
	return {
		...config,
		wizard: {
			...config.wizard,
			securityAcknowledgedAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	};
}
function applySystemAgentModelSelectionWithModules(params, modules) {
	const { agentScope, modelConfig, runtimePolicy } = modules;
	const nextConfig = structuredClone(params.config);
	const targetAgentId = params.targetAgentId ? normalizeAgentId(params.targetAgentId) : void 0;
	const agentId = targetAgentId ?? agentScope.resolveDefaultAgentId(nextConfig);
	if (targetAgentId && !nextConfig.agents?.list?.some((entry) => normalizeAgentId(entry.id) === targetAgentId)) throw new Error(`Could not resolve configured agent "${targetAgentId}".`);
	const writesAgent = Boolean(targetAgentId || agentScope.resolveAgentExplicitModelPrimary(nextConfig, agentId));
	nextConfig.agents ??= {};
	nextConfig.agents.defaults ??= {};
	const target = modelConfig.resolveModelTarget({
		raw: params.model,
		cfg: nextConfig
	});
	const key = modelConfig.upsertCanonicalModelConfigEntry({}, target);
	const configuredVisibleModels = nextConfig.agents.defaults.models;
	if (configuredVisibleModels && Object.keys(configuredVisibleModels).length > 0) {
		const defaultModels = { ...configuredVisibleModels };
		modelConfig.upsertCanonicalModelConfigEntry(defaultModels, target);
		nextConfig.agents.defaults.models = defaultModels;
	}
	let agent = nextConfig.agents.list?.find((entry) => normalizeAgentId(entry.id) === agentId);
	if (writesAgent) {
		if (!agent) throw new Error(`Could not resolve configured default agent "${agentId}".`);
		const agentModels = { ...agent.models };
		agent.models = agentModels;
		modelConfig.upsertCanonicalModelConfigEntry(agentModels, target);
	}
	if (params.agentRuntimeId) {
		if (!agent) {
			agent = {
				id: agentId,
				default: true
			};
			nextConfig.agents.list = [...nextConfig.agents.list ?? [], agent];
		}
		const agentModels = { ...agent.models };
		const agentKey = modelConfig.upsertCanonicalModelConfigEntry(agentModels, target);
		agentModels[agentKey] = {
			...agentModels[agentKey],
			agentRuntime: { id: params.agentRuntimeId }
		};
		agent.models = agentModels;
	} else {
		const clearRuntimePin = (models) => {
			const nextModels = { ...models };
			const modelKey = modelConfig.upsertCanonicalModelConfigEntry(nextModels, target);
			const entry = { ...nextModels[modelKey] };
			delete entry.agentRuntime;
			nextModels[modelKey] = entry;
			return nextModels;
		};
		const defaultModels = nextConfig.agents.defaults.models;
		if (defaultModels && Object.keys(defaultModels).length > 0) nextConfig.agents.defaults.models = clearRuntimePin(defaultModels);
		if (agent?.models && Object.keys(agent.models).length > 0) agent.models = clearRuntimePin(agent.models);
	}
	const selectedModel = params.authProfileId ? `${key}@${params.authProfileId}` : key;
	agentScope.setAgentEffectiveModelPrimary(nextConfig, agentId, selectedModel, { forceAgent: Boolean(targetAgentId) });
	if (params.agentRuntimeId) {
		if (runtimePolicy.resolveModelRuntimePolicy({
			config: nextConfig,
			provider: target.provider,
			modelId: target.model,
			agentId
		}).policy?.id !== params.agentRuntimeId) throw new Error(`Could not pin ${key} to the ${params.agentRuntimeId} runtime.`);
	}
	return nextConfig;
}
async function createSystemAgentModelSelectionUpdater(params) {
	const [agentScope, modelConfig, runtimePolicy] = await Promise.all([
		import("./agent-scope-RIXtZ2Lu.js"),
		import("./shared-Cq3jDYYq.js"),
		import("./model-runtime-policy-KXWiCcel.js")
	]);
	const modules = {
		agentScope,
		modelConfig,
		runtimePolicy
	};
	return (config) => applySystemAgentModelSelectionWithModules({
		...params,
		config
	}, modules);
}
async function applySystemAgentModelSelection(params) {
	return (await createSystemAgentModelSelectionUpdater(params))(params.config);
}
async function applySystemAgentSetup(params, hooks) {
	const { workspace, model, agentRuntimeId, authProfileId, expectedAgentId, expectedAgentDir, expectedModelRef, expectedConfigHash, configPatch, finalizeConfig, enablePluginId, refreshPluginRegistry, assertCommitPreconditions, surface, runtime } = params;
	const hasExpectedConfigHash = Object.hasOwn(params, "expectedConfigHash");
	const commit = hooks ? async (effect) => await hooks.commit(effect) : async (effect) => await effect();
	const [{ readSetupConfigFileSnapshot, resolveQuickstartGatewayDefaults }, onboardHelpers, { applyLocalSetupWorkspaceConfig }, { transformConfigWithPendingPluginInstalls }] = await Promise.all([
		import("./setup.shared-DH3PG3Ri.js"),
		import("./onboard-helpers-BtjO0REF.js"),
		import("./onboard-config-BGG5CP3W.js"),
		import("./install-record-commit-X0abJfY-.js")
	]);
	const snapshot = await readSetupConfigFileSnapshot();
	const snapshotConfig = requireValidSystemAgentSetupSnapshot(snapshot);
	if (hasExpectedConfigHash && resolveConfigSnapshotHash(snapshot) !== expectedConfigHash) throw new Error("OpenClaw config changed while AI access was being tested. Try setup again.");
	const guardModules = expectedAgentId || expectedAgentDir || expectedModelRef ? await Promise.all([import("./agent-scope-RIXtZ2Lu.js"), import("./model-selection-Su90IYNf.js")]) : void 0;
	const assertExpectedTarget = (config) => {
		if (!guardModules) return;
		const [{ resolveAgentDir, resolveDefaultAgentId }, { resolveDefaultModelForAgent }] = guardModules;
		const currentAgentId = resolveDefaultAgentId(config);
		if (expectedAgentId && currentAgentId !== expectedAgentId) throw new Error("The default agent changed while AI access was being tested. Try setup again.");
		if (expectedAgentDir && resolveAgentDir(config, currentAgentId) !== expectedAgentDir) throw new Error("The agent credential location changed while AI access was being tested. Try setup again.");
		if (expectedModelRef) {
			const current = resolveDefaultModelForAgent({
				cfg: config,
				agentId: currentAgentId
			});
			if (`${current.provider}/${current.model}` !== expectedModelRef) throw new Error("The default model changed while AI access was being tested. Try setup again.");
		}
	};
	assertExpectedTarget(snapshotConfig.runtimeConfig);
	const assertVerifiedRoute = async (setupSnapshot, expectedRoute = params.expectedInferenceRoute, phase = "before") => {
		if (!expectedRoute) return;
		const verifiedSnapshot = await readConfigFileSnapshot();
		const setupSource = setupSnapshot.exists ? setupSnapshot.sourceConfig ?? setupSnapshot.config : {};
		const verifiedSource = verifiedSnapshot.exists ? verifiedSnapshot.sourceConfig ?? verifiedSnapshot.config : {};
		const currentRoute = verifiedSnapshot.exists && verifiedSnapshot.valid && verifiedSnapshot.path === setupSnapshot.path && verifiedSnapshot.hash === setupSnapshot.hash && isDeepStrictEqual(verifiedSource, setupSource) ? await projectDefaultInferenceRoute(verifiedSnapshot.runtimeConfig ?? verifiedSnapshot.config) : null;
		if (!currentRoute || !sameDefaultInferenceRoute(currentRoute, expectedRoute)) throw new Error(phase === "before" ? "The default-agent inference route changed before setup could start, so no workspace or Gateway settings were changed. Retry setup from the current OpenClaw session." : "The default-agent inference route changed after the config write, so no further setup effects were applied. Retry setup from the current OpenClaw session.");
	};
	await assertVerifiedRoute(snapshot);
	const prompter = createQuickstartNotePrompter(runtime);
	const { configureGatewayForSetup } = await import("./setup.gateway-config-De0vtgf7.js");
	const buildSetupCandidate = async (currentBaseConfig) => {
		let setupBaseConfig = currentBaseConfig;
		if (enablePluginId) {
			const enabled = enablePluginInConfig(setupBaseConfig, enablePluginId);
			if (!enabled.enabled) throw new Error(`Provider plugin ${enablePluginId} is ${enabled.reason}.`);
			setupBaseConfig = enabled.config;
		}
		if (configPatch !== void 0) setupBaseConfig = applyMergePatch(setupBaseConfig, configPatch);
		let candidate = applyLocalSetupWorkspaceConfig(setupBaseConfig, workspace);
		if (model) candidate = await applySystemAgentModelSelection({
			config: candidate,
			model,
			...agentRuntimeId ? { agentRuntimeId } : {},
			...authProfileId ? { authProfileId } : {}
		});
		candidate = applySecurityAcknowledgement(candidate);
		const gateway = await configureGatewayForSetup({
			flow: "quickstart",
			baseConfig: currentBaseConfig,
			nextConfig: candidate,
			localPort: resolveGatewayPort(currentBaseConfig),
			quickstartGateway: resolveQuickstartGatewayDefaults(currentBaseConfig),
			prompter,
			runtime
		});
		return {
			nextConfig: onboardHelpers.applyWizardMetadata(gateway.nextConfig, {
				command: "onboard",
				mode: "local"
			}),
			settings: gateway.settings
		};
	};
	const committed = await commit(async () => await transformConfigWithPendingPluginInstalls({
		afterWrite: { mode: "auto" },
		writeOptions: {
			auditOrigin: "system-agent",
			allowConfigSizeDrop: false
		},
		transform: async (currentConfig, context) => {
			const currentSnapshot = requireValidSystemAgentSetupSnapshot(context.snapshot);
			if (hasExpectedConfigHash && context.previousHash !== expectedConfigHash) throw new Error("OpenClaw config changed while AI access was being tested. Try setup again.");
			await assertVerifiedRoute(context.snapshot);
			assertExpectedTarget(currentSnapshot.runtimeConfig);
			const setupCandidate = await buildSetupCandidate(currentConfig);
			const finalizedConfig = finalizeConfig ? finalizeConfig(setupCandidate.nextConfig, currentSnapshot.sourceConfig) : setupCandidate.nextConfig;
			const expectedSourceRoute = params.expectedInferenceRoute ? await projectDefaultInferenceRoute(finalizedConfig) : void 0;
			if (params.expectedInferenceRoute && (!params.expectedInferenceRoute.route || !expectedSourceRoute?.route || !isDeepStrictEqual(expectedSourceRoute.route, params.expectedInferenceRoute.route))) throw new Error("The setup candidate no longer preserves the exact verified inference route, so it was not saved. Retry setup from the current OpenClaw session.");
			assertCommitPreconditions?.();
			return {
				nextConfig: finalizedConfig,
				result: { settings: setupCandidate.settings }
			};
		}
	}));
	const nextConfig = committed.nextConfig;
	const settings = committed.result?.settings;
	if (!settings) throw new Error("OpenClaw setup committed without resolved Gateway settings.");
	if (params.expectedInferenceRoute) {
		const afterRead = await readConfigFileSnapshotWithPluginMetadata();
		const afterSnapshot = afterRead.snapshot;
		requireValidSystemAgentSetupSnapshot(afterSnapshot);
		const expectedRuntime = validateConfigObjectWithPlugins(committed.nextConfig, {
			env: process.env,
			pluginMetadataSnapshot: afterRead.pluginMetadataSnapshot
		});
		if (!expectedRuntime.ok) {
			const issue = expectedRuntime.issues[0];
			const detail = issue ? ` (${issue.path ? `${issue.path}: ` : ""}${issue.message})` : "";
			throw new Error(`OpenClaw could not validate the setup route after its config write${detail}. No further setup effects were applied. Retry setup from the current OpenClaw session.`);
		}
		const expectedPersistedRoute = await projectDefaultInferenceRoute(expectedRuntime.config);
		await assertVerifiedRoute(afterSnapshot, expectedPersistedRoute, "after");
		if (!isDeepStrictEqual(expectedPersistedRoute.route, params.expectedInferenceRoute.route)) throw new Error("The materialized inference route no longer matches the exact verified route, so no further setup effects were applied. Retry setup from the current OpenClaw session.");
	}
	const lines = [`Workspace: ${shortenHomePath(workspace)}`, model ? `Default model: ${model}` : void 0].filter((line) => line !== void 0);
	const runCommittedFollowUp = async (effect, onFailure) => {
		let effectStarted = false;
		try {
			return await commit(async () => {
				effectStarted = true;
				return await effect();
			});
		} catch (error) {
			if (!effectStarted) throw error;
			onFailure(error);
			return;
		}
	};
	const workspaceResult = await runCommittedFollowUp(async () => await onboardHelpers.ensureWorkspaceAndSessions(workspace, runtime, {
		skipBootstrap: Boolean(nextConfig.agents?.defaults?.skipBootstrap),
		skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles
	}), (error) => lines.push(`Workspace files: ${formatErrorMessage(error)}`));
	await runCommittedFollowUp(async () => {
		const { updateExecApprovals } = await import("./exec-approvals-Bl4mmZuc.js");
		await updateExecApprovals({ update: (approvals) => approvals.agents?.openclaw ? null : {
			...approvals,
			agents: {
				...approvals.agents,
				openclaw: {
					security: "full",
					ask: "off"
				}
			}
		} });
	}, (error) => lines.push(`OpenClaw exec approval: ${formatErrorMessage(error)}; local model harnesses may ask again.`));
	if (refreshPluginRegistry && enablePluginId) await runCommittedFollowUp(async () => {
		const { refreshPluginRegistryAfterConfigMutation } = await import("./registry-refresh-7ijD11ai.js");
		await refreshPluginRegistryAfterConfigMutation({
			config: nextConfig,
			reason: "source-changed",
			workspaceDir: workspace,
			traceCommand: "openclaw-setup",
			logger: { warn: (message) => lines.push(message) }
		});
	}, (error) => lines.push(`Plugin registry refresh failed: ${formatErrorMessage(error)}`));
	if (surface === "cli") await runCommittedFollowUp(async () => {
		const { ensureGatewayServiceForOnboarding } = await import("./setup.finalize-S4Ua5b40.js");
		const { installDaemon } = await ensureGatewayServiceForOnboarding({
			flow: "quickstart",
			opts: {},
			nextConfig,
			settings,
			prompter,
			runtime,
			loadedAction: "restart"
		});
		if (installDaemon) {
			const probeLinks = onboardHelpers.resolveLocalControlUiProbeLinks({
				bind: settings.bind,
				port: settings.port,
				customBindHost: settings.customBindHost,
				basePath: void 0,
				tlsEnabled: nextConfig.gateway?.tls?.enabled === true
			});
			const probe = await onboardHelpers.waitForGatewayReachable({
				url: probeLinks.wsUrl,
				token: settings.authMode === "token" ? settings.gatewayToken : void 0,
				deadlineMs: 15e3
			});
			lines.push(probe.ok ? `Gateway: running at ${probeLinks.wsUrl}` : `Gateway: not reachable yet (${probe.detail ?? "still starting"}) — say \`gateway status\` to check`);
		} else lines.push("Gateway: service install skipped — say `start gateway` when you want it running.");
	}, (error) => lines.push(`Gateway service: ${formatErrorMessage(error)}`));
	else lines.push("Gateway: running (managed by this app).");
	return {
		configPath: committed.path,
		configHashBefore: committed.previousHash,
		configHashAfter: committed.persistedHash,
		bootstrapPending: workspaceResult?.bootstrapPending === true,
		lines
	};
}
//#endregion
export { createSystemAgentModelSelectionUpdater as i, applySystemAgentSetup as n, createQuickstartNotePrompter as r, applySystemAgentModelSelection as t };
