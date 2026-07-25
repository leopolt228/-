import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { n as isTruthyEnvValue } from "./env-CHfvZ8Nb.js";
import { c as resolveCanonicalConfigPath } from "./paths-CHQRdQZ3.js";
import { t as ExitError } from "./runtime-ZHfN2VLf.js";
import { f as resolveHomeDir } from "./utils-K2PjeLaV.js";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-9fUuyise.js";
import { c as normalizePluginsConfig, l as resolveEffectiveEnableState } from "./config-state-rO7K73Ka.js";
import { _ as recoverConfigFromLastKnownGood, a as preserveConfigSnapshotAsClobbered, et as parseConfigJson5, g as recoverConfigFromJsonRootSuffix, l as readConfigFileSnapshot } from "./io-CEgS2K9F.js";
import "./env-vars-CdPCvJw6.js";
import { n as formatConfigIssueLines } from "./issue-format-BfBp97Wi.js";
import { a as formatPluginVerificationDiagnostic, c as setActiveDegradedPlugins, t as buildDegradedPluginsFromVerificationFailures } from "./runtime-degraded-state-CbW4-KRp.js";
import { t as note } from "./note-AoV1Tth-.js";
import { r as noteIncludeConfinementWarning } from "./doctor-config-analysis-BfL8Qb8f.js";
import { t as findDoctorLegacyConfigIssues } from "./legacy-config-issues-vJjDKFKO.js";
import { t as migrateLegacyConfig } from "./legacy-config-migrate-CwWuLgY9.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor/shared/legacy-config-state-migration-input.ts
function resolveStateMigrationConfigInput(params) {
	const pluginDoctorConfig = params.snapshot.sourceConfig ?? params.snapshot.config ?? params.snapshot.parsed;
	if (params.snapshot.valid) return params.snapshot.legacyIssues.length > 0 && pluginDoctorConfig !== void 0 ? {
		cfg: params.baseConfig,
		pluginDoctorConfig
	} : { cfg: params.baseConfig };
	const migrationSource = pluginDoctorConfig ?? params.snapshot.parsed;
	if (params.snapshot.legacyIssues.length === 0 || migrationSource === void 0) return null;
	const migrated = migrateLegacyConfig(migrationSource);
	if (!migrated.config) return null;
	if (migrated.partiallyValid) return { pluginDoctorConfig: pluginDoctorConfig ?? migrationSource };
	return {
		cfg: migrated.config,
		...pluginDoctorConfig ? { pluginDoctorConfig } : {}
	};
}
//#endregion
//#region src/commands/doctor-config-preflight.ts
/** Config preflight for doctor: legacy config/state migration, recovery, and snapshot loading. */
const loadDoctorStateMigrations = createLazyRuntimeModule(() => import("./doctor-state-migrations-CuvvCf8V.js"));
const loadLegacyCronRepair = createLazyRuntimeModule(() => import("./legacy-repair-tkgO0f20.js"));
const startupPreflightTraceStartedAt = performance.now();
function withLegacyCronWebhook(config, legacyConfig) {
	const legacyCron = legacyConfig?.cron;
	if (!legacyCron || !Object.hasOwn(legacyCron, "webhook")) return config;
	return {
		...config,
		cron: {
			...config.cron,
			webhook: legacyCron.webhook
		}
	};
}
async function measureStartupPreflightStep(name, run) {
	if (!isTruthyEnvValue(process.env.OPENCLAW_GATEWAY_STARTUP_TRACE)) return await run();
	const startedAt = performance.now();
	try {
		return await run();
	} finally {
		const durationMs = performance.now() - startedAt;
		const totalMs = performance.now() - startupPreflightTraceStartedAt;
		process.stderr.write(`[gateway] startup trace: cli.bootstrap.${name} ${durationMs.toFixed(1)}ms total=${totalMs.toFixed(1)}ms\n`);
	}
}
async function maybeMigrateLegacyConfig() {
	const changes = [];
	const home = resolveHomeDir();
	if (!home) return changes;
	const targetPath = resolveCanonicalConfigPath();
	const targetDir = path.dirname(targetPath);
	try {
		await fs.access(targetPath);
		return changes;
	} catch {}
	const legacyCandidates = [path.join(home, ".clawdbot", "clawdbot.json")];
	let legacyPath = null;
	for (const candidate of legacyCandidates) try {
		await fs.access(candidate);
		legacyPath = candidate;
		break;
	} catch {}
	if (!legacyPath) return changes;
	await fs.mkdir(targetDir, { recursive: true });
	try {
		await fs.copyFile(legacyPath, targetPath, fs.constants.COPYFILE_EXCL);
		changes.push(`Migrated legacy config: ${legacyPath} -> ${targetPath}`);
	} catch {}
	return changes;
}
function collectDoctorLegacyIssues(snapshot) {
	if (!snapshot.exists) return [];
	const resolvedRaw = snapshot.sourceConfig ?? snapshot.config ?? {};
	return findDoctorLegacyConfigIssues(resolvedRaw, snapshot.parsed ?? resolvedRaw);
}
function addDoctorLegacyIssues(snapshot) {
	const legacyIssues = collectDoctorLegacyIssues(snapshot);
	if (legacyIssues.length === 0) return snapshot;
	return {
		...snapshot,
		legacyIssues
	};
}
/** Returns true during updater-managed config rewrites where plugin validation may be stale. */
function shouldSkipPluginValidationForDoctorConfigPreflight(env = process.env) {
	return isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS);
}
function noteStateMigrationResult(result) {
	if (result.changes.length > 0) note(result.changes.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
	const notices = result.notices ?? [];
	if (notices.length > 0) note(notices.map((entry) => `- ${entry}`).join("\n"), "Doctor notices");
	if (result.warnings.length > 0) note(result.warnings.map((entry) => `- ${entry}`).join("\n"), "Doctor warnings");
}
async function planStartupPluginVerification(params) {
	const { planStartupPluginConvergence } = await measureStartupPreflightStep("plugin-plan-import", () => import("./startup-plugin-convergence-plan-CXFKU9zl.js"));
	return await measureStartupPreflightStep("plugin-plan", () => planStartupPluginConvergence({
		config: params.cfg,
		env: params.env
	}));
}
function buildStartupPluginQuarantine(params) {
	return buildDegradedPluginsFromVerificationFailures(params.failures.filter((failure) => Boolean(failure.installPath) && isStartupPluginVerificationFailureActive({
		cfg: params.cfg,
		failure
	})));
}
function isStartupPluginVerificationFailureActive(params) {
	return resolveEffectiveEnableState({
		id: params.failure.pluginId,
		origin: "global",
		config: normalizePluginsConfig(params.cfg.plugins),
		rootConfig: params.cfg
	}).enabled;
}
function formatStartupPluginSmokeFailure(failure) {
	return `Plugin "${failure.pluginId}": ${formatPluginVerificationDiagnostic({
		kind: "plugin-verification",
		reason: failure.reason,
		detail: failure.detail,
		...failure.installPath ? { installPath: failure.installPath } : {}
	})}. Run \`openclaw update repair\` to retry plugin repair.`;
}
async function runStartupUpgradeConvergence(params) {
	const plan = await planStartupPluginVerification(params);
	if (!plan.required) return {
		blockingDiagnostic: null,
		quarantinedPlugins: []
	};
	const { runPostCorePluginConvergence } = await measureStartupPreflightStep("plugin-convergence-import", () => import("./post-core-plugin-convergence-CDQThuVZ.js"));
	const convergence = await measureStartupPreflightStep("plugin-convergence", () => runPostCorePluginConvergence({
		cfg: params.cfg,
		env: params.env,
		baselineInstallRecords: plan.installRecords
	}));
	if (convergence.changes.length > 0) note(convergence.changes.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
	const notices = convergence.notices ?? [];
	if (notices.length > 0) note(notices.map((notice) => `- ${notice.message} ${notice.guidance.join(" ")}`.trim()).join("\n"), "Doctor notices");
	const warnings = convergence.warnings.map((warning) => `${warning.message} ${warning.guidance.join(" ")}`.trim());
	if (warnings.length > 0) note(warnings.map((warning) => `- ${warning}`).join("\n"), "Doctor warnings");
	const quarantinedPlugins = buildStartupPluginQuarantine({
		cfg: params.cfg,
		failures: convergence.smokeFailures
	});
	const nonBlockingWarningKeys = new Set(convergence.smokeFailures.filter((failure) => Boolean(failure.installPath) || !isStartupPluginVerificationFailureActive({
		cfg: params.cfg,
		failure
	})).map((failure) => JSON.stringify([failure.pluginId, `${failure.reason}: ${failure.detail}`])));
	const blockingMessages = convergence.warnings.filter((warning) => !warning.pluginId || !nonBlockingWarningKeys.has(JSON.stringify([warning.pluginId, warning.reason]))).map((warning) => `${warning.message} ${warning.guidance.join(" ")}`.trim());
	return {
		blockingDiagnostic: blockingMessages.length > 0 ? {
			kind: "plugin-verification",
			messages: blockingMessages
		} : null,
		quarantinedPlugins
	};
}
async function refreshStartupPluginQuarantine(params) {
	const plan = await planStartupPluginVerification(params);
	if (!plan.required) return {
		blockingDiagnostic: null,
		quarantinedPlugins: []
	};
	const { runActivePluginPayloadSmokeCheck } = await measureStartupPreflightStep("plugin-payload-verification-import", () => import("./active-plugin-payload-validation-BHSD2Zdr.js"));
	const smoke = await measureStartupPreflightStep("plugin-payload-verification", () => runActivePluginPayloadSmokeCheck({
		cfg: params.cfg,
		records: plan.installRecords,
		env: params.env
	}));
	const quarantinedPlugins = buildStartupPluginQuarantine({
		cfg: params.cfg,
		failures: smoke.failures
	});
	const blockingFailures = smoke.failures.filter((failure) => !failure.installPath && isStartupPluginVerificationFailureActive({
		cfg: params.cfg,
		failure
	}));
	if (quarantinedPlugins.length > 0) note(quarantinedPlugins.map((plugin) => `- ${formatStartupPluginSmokeFailure({
		pluginId: plugin.pluginId,
		reason: plugin.diagnostic.reason,
		detail: plugin.diagnostic.detail,
		...plugin.diagnostic.installPath ? { installPath: plugin.diagnostic.installPath } : {}
	})}`).join("\n"), "Doctor warnings");
	return {
		blockingDiagnostic: blockingFailures.length > 0 ? {
			kind: "plugin-verification",
			messages: blockingFailures.map(formatStartupPluginSmokeFailure)
		} : null,
		quarantinedPlugins
	};
}
function formatStartupMigrationFailure(params) {
	return [
		"OpenClaw startup migrations did not complete cleanly; refusing to report the gateway ready.",
		...[...params.warnings.map((warning) => `- ${warning}`), ...params.blockers.map((blocker) => `- ${blocker}`)],
		"Run \"openclaw doctor --fix\" against the mounted state/config, then restart the container."
	].join("\n");
}
function formatStartupPluginVerificationFailure(diagnostic) {
	return [
		"OpenClaw plugin verification failed; refusing to report the gateway ready.",
		...diagnostic.messages.map((message) => `- ${message}`),
		"Resolve the plugin verification errors above, then restart the container."
	].join("\n");
}
function throwStartupMigrationRefusal(message) {
	console.error(message);
	throw new ExitError(1, message);
}
function throwStartupMigrationGuardRejected() {
	throw new Error("OpenClaw startup migrations were skipped because the selected config changed during startup; refusing to report the gateway ready. Retry startup so the new config can be validated.");
}
/**
* Runs early doctor config checks before the main config repair flow.
*
* It may migrate legacy state/config paths, recover corrupt target config when requested, and
* returns the best-effort config snapshot used by later doctor checks.
*/
async function runDoctorConfigPreflight(options = {}) {
	const stateMigrationsRequested = options.migrateState !== false;
	const startupCheckpoint = options.requireStartupMigrationCheckpoint === true ? await import("./startup-migration-checkpoint-CfobY_n7.js") : void 0;
	let stateMigrations;
	let startupMigrationEnv = process.env;
	let shouldRecordStartupCheckpoint = false;
	let skipPristineStartupStateMigrations = options.skipPristineStartupStateMigrations === true;
	let skipPristineCoreStateMigrations = skipPristineStartupStateMigrations || options.skipPristineCoreStateMigrations === true;
	let startupMigrationLease;
	let startupMigrationHeartbeat;
	let startupMigrationHeartbeatError;
	const startupMigrationWarnings = [];
	const cronCodexRuntimePolicyTargets = [];
	const noteStartupStateMigrationResult = (result) => {
		startupMigrationWarnings.push(...result.warnings);
		noteStateMigrationResult(result);
	};
	try {
		if (startupCheckpoint && !skipPristineStartupStateMigrations) {
			const { planPristineStartupStateMigrations } = await measureStartupPreflightStep("pristine-state-plan-import", () => import("./pristine-startup-state-C2Xk-nbU.js"));
			const pristineStatePlan = await measureStartupPreflightStep("pristine-state-plan", () => planPristineStartupStateMigrations(process.env));
			skipPristineStartupStateMigrations = pristineStatePlan.skipAllStateMigrations;
			skipPristineCoreStateMigrations ||= pristineStatePlan.skipCoreStateMigrations;
		}
		const stateMigrationsAllowed = !stateMigrationsRequested || options.beforeStateMigrations === void 0 || await options.beforeStateMigrations();
		if (startupCheckpoint && !stateMigrationsAllowed) throwStartupMigrationGuardRejected();
		if (startupCheckpoint) {
			startupMigrationEnv = cloneEnvWithPlatformSemantics(process.env);
			shouldRecordStartupCheckpoint = startupCheckpoint.needsStartupMigrationCheckpoint({ env: startupMigrationEnv });
			startupMigrationLease = shouldRecordStartupCheckpoint ? startupCheckpoint.acquireStartupMigrationLease({ env: startupMigrationEnv }) : void 0;
			if (startupMigrationLease) {
				startupMigrationHeartbeat = setInterval(() => {
					try {
						startupMigrationLease?.heartbeat();
					} catch (error) {
						startupMigrationHeartbeatError = error;
					}
				}, 6e4);
				startupMigrationHeartbeat.unref?.();
			}
		}
		stateMigrations = stateMigrationsRequested && (!startupCheckpoint || shouldRecordStartupCheckpoint) && !skipPristineStartupStateMigrations ? await measureStartupPreflightStep("state-migrations-import", loadDoctorStateMigrations) : void 0;
		if (stateMigrations && stateMigrationsAllowed) {
			const { autoMigrateLegacyStateDir } = stateMigrations;
			noteStartupStateMigrationResult(await measureStartupPreflightStep("state-dir-migrations", () => autoMigrateLegacyStateDir({ env: process.env })));
		}
		if (options.migrateLegacyConfig !== false) {
			const legacyConfigChanges = await maybeMigrateLegacyConfig();
			if (legacyConfigChanges.length > 0) note(legacyConfigChanges.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
		}
		const readOptions = {
			...options.observe === false ? { observe: false } : {},
			skipPluginValidation: shouldSkipPluginValidationForDoctorConfigPreflight()
		};
		let snapshot = addDoctorLegacyIssues(await measureStartupPreflightStep("config-snapshot", () => readConfigFileSnapshot(readOptions)));
		if (options.repairPrefixedConfig === true && snapshot.exists && !snapshot.valid) {
			if (await recoverConfigFromJsonRootSuffix(snapshot)) {
				note("Removed non-JSON prefix from openclaw.json; original saved as .clobbered.*.", "Config");
				snapshot = addDoctorLegacyIssues(await readConfigFileSnapshot(readOptions));
			} else if (await recoverConfigFromLastKnownGood({
				snapshot,
				reason: "doctor-invalid-config"
			})) {
				note("Restored openclaw.json from last-known-good; original saved as .clobbered.*.", "Config");
				snapshot = addDoctorLegacyIssues(await readConfigFileSnapshot(readOptions));
			}
			if (!snapshot.valid && typeof snapshot.raw === "string" && !parseConfigJson5(snapshot.raw).ok) {
				const clobberedPath = await preserveConfigSnapshotAsClobbered(snapshot);
				if (!clobberedPath) throw new Error(`Config could not be parsed or recovered, and doctor could not preserve a .clobbered snapshot. The original remains unchanged at ${snapshot.path}; refusing to apply repairs.`);
				throw new Error(`Config could not be parsed or recovered. Original preserved at ${clobberedPath}. The current file remains unchanged; refusing to apply repairs.`);
			}
		}
		const invalidConfigNote = options.invalidConfigNote ?? "Config invalid; doctor will run with best-effort config.";
		if (invalidConfigNote && snapshot.exists && !snapshot.valid && snapshot.legacyIssues.length === 0) {
			note(invalidConfigNote, "Config");
			noteIncludeConfinementWarning(snapshot);
		}
		const warnings = snapshot.warnings ?? [];
		if (warnings.length > 0) note(formatConfigIssueLines(warnings, "-").join("\n"), "Config warnings");
		const baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
		const stateMigrationInput = resolveStateMigrationConfigInput({
			snapshot,
			baseConfig
		});
		const freshConfigGuardAllowed = !(stateMigrations !== void 0 || shouldRecordStartupCheckpoint) || !stateMigrationsAllowed || options.beforeStateMigrations === void 0 || await options.beforeStateMigrations(snapshot);
		if (startupCheckpoint && !freshConfigGuardAllowed) throwStartupMigrationGuardRejected();
		if (stateMigrations && stateMigrationsAllowed && freshConfigGuardAllowed) {
			const { autoMigrateLegacyState, autoMigrateLegacyPluginDoctorState, autoMigrateLegacyTaskStateSidecars } = stateMigrations;
			if (stateMigrationInput) {
				const pluginDoctorOnlyConfig = stateMigrationInput.pluginDoctorConfig ?? stateMigrationInput.cfg;
				if (skipPristineCoreStateMigrations && pluginDoctorOnlyConfig) noteStartupStateMigrationResult(await autoMigrateLegacyPluginDoctorState({
					config: pluginDoctorOnlyConfig,
					env: process.env
				}));
				else if (stateMigrationInput.cfg) {
					const { collectCronCodexRuntimePolicyTargetsReadOnly, repairLegacyCronStoreWithoutPrompt } = await loadLegacyCronRepair();
					noteStartupStateMigrationResult(await repairLegacyCronStoreWithoutPrompt({
						cfg: withLegacyCronWebhook(stateMigrationInput.cfg, stateMigrationInput.pluginDoctorConfig),
						migrateCodexModelRefs: false
					}));
					if (options.repairPrefixedConfig === true) {
						const cronCodexPlan = await collectCronCodexRuntimePolicyTargetsReadOnly({ cfg: stateMigrationInput.cfg });
						cronCodexRuntimePolicyTargets.push(...cronCodexPlan.targets);
						noteStartupStateMigrationResult({
							changes: [],
							warnings: cronCodexPlan.warnings
						});
					}
					noteStartupStateMigrationResult(await autoMigrateLegacyState({
						cfg: stateMigrationInput.cfg,
						...stateMigrationInput.pluginDoctorConfig ? { pluginDoctorConfig: stateMigrationInput.pluginDoctorConfig } : {},
						env: process.env,
						recoverCorruptTargetStore: options.recoverCorruptTargetStore,
						doctorOnlyStateMigrations: options.doctorOnlyStateMigrations
					}));
				} else if (stateMigrationInput.pluginDoctorConfig) {
					noteStartupStateMigrationResult(await autoMigrateLegacyPluginDoctorState({
						config: stateMigrationInput.pluginDoctorConfig,
						env: process.env
					}));
					noteStartupStateMigrationResult(await autoMigrateLegacyTaskStateSidecars({ env: process.env }));
				}
			} else noteStartupStateMigrationResult(await autoMigrateLegacyTaskStateSidecars({ env: process.env }));
		}
		if (startupCheckpoint) {
			if (shouldRecordStartupCheckpoint) {
				if (startupMigrationHeartbeatError) throw startupMigrationHeartbeatError instanceof Error ? startupMigrationHeartbeatError : /* @__PURE__ */ new Error("OpenClaw startup migration lease heartbeat failed.");
				if (startupMigrationWarnings.length > 0) throwStartupMigrationRefusal(formatStartupMigrationFailure({
					warnings: startupMigrationWarnings,
					blockers: []
				}));
				if (!snapshot.valid) throwStartupMigrationRefusal(formatStartupMigrationFailure({
					warnings: [],
					blockers: ["OpenClaw config is invalid; run \"openclaw doctor --fix\" before startup."]
				}));
			}
			setActiveDegradedPlugins([]);
			if (snapshot.valid) {
				const pluginConvergence = shouldRecordStartupCheckpoint ? await runStartupUpgradeConvergence({
					cfg: baseConfig,
					env: process.env
				}) : await refreshStartupPluginQuarantine({
					cfg: baseConfig,
					env: process.env
				});
				setActiveDegradedPlugins(pluginConvergence.quarantinedPlugins);
				if (pluginConvergence.blockingDiagnostic) throwStartupMigrationRefusal(formatStartupPluginVerificationFailure(pluginConvergence.blockingDiagnostic));
			}
			if (shouldRecordStartupCheckpoint) startupCheckpoint.recordSuccessfulStartupMigrations({
				env: startupMigrationEnv,
				lease: startupMigrationLease
			});
		}
		return {
			snapshot,
			baseConfig,
			...cronCodexRuntimePolicyTargets.length > 0 ? { cronCodexRuntimePolicyTargets } : {}
		};
	} finally {
		if (startupMigrationHeartbeat) clearInterval(startupMigrationHeartbeat);
		startupMigrationLease?.release();
	}
}
//#endregion
export { shouldSkipPluginValidationForDoctorConfigPreflight as n, runDoctorConfigPreflight as t };
