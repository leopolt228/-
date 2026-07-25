import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-COWbwBfI.js";
import { n as parseTcpPort, r as parseTcpPortFromArgs } from "./tcp-port-BiPmOnnn.js";
import { m as resolveGatewayPort } from "./paths-CHQRdQZ3.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { i as writeRuntimeJson, r as defaultRuntime } from "./runtime-ZHfN2VLf.js";
import { p as stopSystemdService, t as findInstalledSystemdGatewayScope, u as restartSystemdService } from "./systemd-iYtBw5_g.js";
import { i as resolveOpenClawWrapperPath, t as OPENCLAW_WRAPPER_ENV_KEY } from "./program-args-DmoB00d4.js";
import { t as buildGatewayInstallPlan } from "./daemon-install-helpers-C3ONqsD6.js";
import { t as parseDurationMs } from "./parse-duration-Be19e01j.js";
import { t as DEFAULT_GATEWAY_DAEMON_RUNTIME } from "./daemon-runtime-CHOL1Kuf.js";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-BUoLbi1r.js";
import { d as readConfigFileSnapshotForWrite, s as readBestEffortConfig } from "./io-CEgS2K9F.js";
import "./config-BOMcY2yX.js";
import { f as repairLaunchAgentBootstrap, i as formatLaunchAgentGuiSessionError, s as launchAgentPlistExists } from "./launchd-BI3BhZkH.js";
import { a as isGatewayExternallySupervised, n as assertGatewayServiceMutationAllowed, r as formatExternalSupervisorActionRequired } from "./gateway-supervision-BCaMyZ4m.js";
import { a as resolveGatewayService, n as formatGatewayServiceStartRepairIssues, s as mergeGatewayServiceEnv } from "./service-DSig-f_R.js";
import { i as signalVerifiedGatewayPidSync, n as formatGatewayPidList, t as findVerifiedGatewayListenerPidsOnPortSync } from "./gateway-processes-c8np4yhp.js";
import { h as createNullWriter, l as renderGatewayServiceStartHints, m as createDaemonActionContext, s as parsePortFromArgs } from "./shared-B2j_B0O6.js";
import { t as mergeInstallInvocationEnv } from "./install-Dvsx930j.js";
import { n as isRestartEnabled } from "./commands.flags-CZ7fp5Xb.js";
import { l as callGatewayCli } from "./call-ChM1o8yU.js";
import { r as probeGateway } from "./probe-DjATNAKd.js";
import { a as readActiveGatewayLockPort, i as readActiveGatewayLockIdentity, r as isSameGatewayLockIdentity } from "./gateway-lock-DuOE-FjH.js";
import { a as writeGatewayRestartIntentSync, t as clearGatewayRestartIntentSync } from "./restart-intent-CSwbg7-T.js";
import { l as resolveGatewayRestartDeferralTimeoutMs } from "./restart-B84EHBne.js";
import { n as NON_INTERACTIVE_GATEWAY_STOP_MESSAGE, r as isTerminalInteractive } from "./terminal-interactivity-Bmck99HR.js";
import { a as appendGatewayLifecycleAudit, i as runServiceUninstall, n as runServiceStart, o as createGatewayLifecycleMutationAudit, r as runServiceStop, t as runServiceRestart } from "./lifecycle-core-C-VRaWUx.js";
import { a as renderGatewayPortHealthDiagnostics, i as waitForGatewayHealthyListener, n as waitForGatewayHealthyRestart, o as renderRestartDiagnostics, r as terminateStaleGatewayPids, s as DEFAULT_RESTART_HEALTH_ATTEMPTS } from "./restart-health-CnZge4pm.js";
//#region src/cli/daemon-cli/launchd-recovery.ts
const LAUNCH_AGENT_RECOVERY_MESSAGE = "Gateway LaunchAgent was installed but not loaded; re-bootstrapped launchd service.";
/** Re-bootstrap an installed but unloaded LaunchAgent after a daemon start/restart command. */
async function recoverInstalledLaunchAgent(params) {
	if (process.platform !== "darwin") return null;
	const env = params.env ?? process.env;
	if (!await launchAgentPlistExists(env).catch(() => false)) return null;
	const repaired = await repairLaunchAgentBootstrap({ env }).catch(() => ({
		ok: false,
		status: "bootstrap-failed"
	}));
	if (!repaired.ok) {
		if (repaired.status === "gui-session-unavailable") {
			const actionHint = params.result === "started" ? "openclaw gateway start" : "openclaw gateway restart";
			throw new Error(formatLaunchAgentGuiSessionError({
				detail: repaired.detail,
				domain: repaired.domain,
				actionHint
			}));
		}
		return null;
	}
	return {
		result: params.result,
		loaded: true,
		message: LAUNCH_AGENT_RECOVERY_MESSAGE
	};
}
//#endregion
//#region src/cli/daemon-cli/lifecycle-safe-restart.ts
function formatSafeRestartWarnings(result) {
	return result.preflight.blockers.length === 0 ? void 0 : [result.preflight.summary];
}
function resolveGatewayRestartIntentOptions(opts) {
	if (opts.force && opts.wait !== void 0) throw new Error("--force cannot be combined with --wait");
	if (opts.force) return { force: true };
	return opts.wait === void 0 ? void 0 : { waitMs: parseDurationMs(opts.wait) };
}
/** Request an OpenClaw-aware restart through the running Gateway. */
async function requestSafeGatewayRestart(opts) {
	if (opts.force) throw new Error("--safe cannot be combined with --force; omit --safe to force restart now");
	if (opts.wait !== void 0) throw new Error("--safe cannot be combined with --wait; safe restart uses gateway deferral");
	const skipDeferral = opts.skipDeferral === true;
	const params = { reason: "gateway.restart.safe" };
	if (skipDeferral) params.skipDeferral = true;
	const result = await callGatewayCli({
		method: "gateway.restart.request",
		params,
		timeoutMs: 1e4
	});
	appendGatewayLifecycleAudit({
		action: "restart",
		source: "safe-rpc",
		mode: result.status,
		pid: result.restart.pid
	});
	const message = result.status === "coalesced" ? "safe restart request joined an existing pending gateway restart" : result.status === "deferred" ? "safe restart requested; gateway will restart after active work drains (bounded wait; may force after the timeout expires)" : skipDeferral ? "safe restart requested; gateway bypassing active-work deferral" : "safe restart requested; gateway will restart momentarily";
	const payload = {
		ok: true,
		result: result.status,
		message,
		preflight: result.preflight,
		restart: result.restart,
		warnings: formatSafeRestartWarnings(result)
	};
	if (opts.json) writeRuntimeJson(defaultRuntime, payload);
	else {
		defaultRuntime.log(message);
		if (result.preflight.blockers.length > 0) defaultRuntime.log(theme.warn(result.preflight.summary));
	}
	return true;
}
//#endregion
//#region src/cli/daemon-cli/start-repair.ts
async function repairLoadedGatewayServiceForStart(params) {
	const { snapshot: configSnapshot, writeOptions: configWriteOptions } = await readConfigFileSnapshotForWrite();
	const cfg = configSnapshot.valid ? configSnapshot.sourceConfig : configSnapshot.config;
	const existingEnvironment = params.state.command?.environment;
	const existingEnvironmentValueSources = params.state.command?.environmentValueSources;
	const installEnv = mergeInstallInvocationEnv({
		env: process.env,
		existingServiceEnv: existingEnvironment
	});
	const wrapperPath = await resolveOpenClawWrapperPath(installEnv[OPENCLAW_WRAPPER_ENV_KEY]);
	const installedPort = parseTcpPortFromArgs(params.state.command?.programArguments) ?? parseTcpPort(params.state.command?.environment?.OPENCLAW_GATEWAY_PORT);
	const port = params.port ?? installedPort ?? resolveGatewayPort(cfg);
	const tokenResolution = await resolveGatewayInstallToken({
		config: cfg,
		configSnapshot,
		configWriteOptions,
		env: installEnv,
		autoGenerateWhenMissing: true,
		persistGeneratedToken: true
	});
	if (tokenResolution.unavailableReason) throw new Error(tokenResolution.unavailableReason);
	const warnings = [formatGatewayServiceStartRepairIssues(params.issues), ...tokenResolution.warnings].filter((warning) => warning.trim().length > 0);
	if (!params.json) {
		defaultRuntime.log("Gateway service definition needs repair:");
		for (const warning of warnings) defaultRuntime.log(`- ${warning}`);
	}
	const { programArguments, workingDirectory, environment, environmentValueSources } = await buildGatewayInstallPlan({
		env: installEnv,
		port,
		runtime: DEFAULT_GATEWAY_DAEMON_RUNTIME,
		wrapperPath,
		existingEnvironment,
		existingEnvironmentValueSources,
		config: cfg,
		warn: (message) => {
			warnings.push(message);
			if (!params.json) defaultRuntime.log(`- ${message}`);
		}
	});
	await params.service.install({
		env: installEnv,
		stdout: params.stdout,
		warn: params.warn,
		programArguments,
		workingDirectory,
		environment,
		environmentValueSources
	});
	let loaded;
	try {
		loaded = await params.service.isLoaded({ env: installEnv });
	} catch {
		loaded = true;
	}
	return {
		result: params.action === "restart" ? "restarted" : "started",
		message: params.action === "restart" ? "Gateway service definition repaired and restarted." : "Gateway service definition repaired and started. Reopen the Control UI with `openclaw dashboard` or copy a fresh auth URL with `openclaw dashboard --no-open`.",
		warnings: warnings.length ? warnings : void 0,
		loaded
	};
}
//#endregion
//#region src/cli/daemon-cli/lifecycle.ts
const POST_RESTART_HEALTH_ATTEMPTS = DEFAULT_RESTART_HEALTH_ATTEMPTS;
const POST_RESTART_HEALTH_DELAY_MS = 500;
const WINDOWS_POST_RESTART_HEALTH_TIMEOUT_MS = 18e4;
function postRestartHealthAttempts() {
	return process.platform === "win32" ? Math.ceil(WINDOWS_POST_RESTART_HEALTH_TIMEOUT_MS / POST_RESTART_HEALTH_DELAY_MS) : POST_RESTART_HEALTH_ATTEMPTS;
}
function formatRestartFailure(params) {
	if (params.health.waitOutcome === "stopped-free") {
		const elapsedSeconds = Math.max(1, Math.round((params.health.elapsedMs ?? 0) / 1e3));
		return {
			statusLine: `Gateway restart failed after ${elapsedSeconds}s: service stayed stopped and port ${params.port} stayed free.`,
			failMessage: `Gateway restart failed after ${elapsedSeconds}s: service stayed stopped and health checks never came up.`
		};
	}
	const timeoutSeconds = Math.max(1, Math.round(params.health.elapsedMs === void 0 ? params.defaultTimeoutSeconds : params.health.elapsedMs / 1e3));
	return {
		statusLine: `Timed out after ${timeoutSeconds}s waiting for gateway port ${params.port} to become healthy.`,
		failMessage: `Gateway restart timed out after ${timeoutSeconds}s waiting for health checks.`
	};
}
async function resolveGatewayLifecycleContext(service = resolveGatewayService()) {
	const command = await service.readCommand(process.env).catch(() => null);
	const mergedEnv = mergeGatewayServiceEnv(process.env, command);
	const portFromArgs = parsePortFromArgs(command?.programArguments);
	const config = await readBestEffortConfig().catch(() => void 0);
	return {
		port: portFromArgs ?? resolveGatewayPort(config, mergedEnv),
		env: mergedEnv
	};
}
async function resolveGatewayLifecyclePort(service = resolveGatewayService()) {
	return (await resolveGatewayLifecycleContext(service)).port;
}
function resolveGatewayPortFallback() {
	return readBestEffortConfig().then((cfg) => resolveGatewayPort(cfg, process.env)).catch(() => resolveGatewayPort(void 0, process.env));
}
async function resolveExplicitGatewayConfigPort() {
	return (await readBestEffortConfig().catch(() => void 0))?.gateway?.port;
}
async function assertUnmanagedGatewayRestartEnabled(port) {
	const cfg = await readBestEffortConfig().catch(() => void 0);
	const probe = await probeGateway({
		url: `${Boolean(cfg?.gateway?.tls?.enabled) ? "wss" : "ws"}://127.0.0.1:${port}`,
		auth: {
			token: normalizeOptionalString(process.env.OPENCLAW_GATEWAY_TOKEN),
			password: normalizeOptionalString(process.env.OPENCLAW_GATEWAY_PASSWORD)
		},
		timeoutMs: 1e3
	}).catch(() => null);
	if (!probe?.ok) return;
	if (!isRestartEnabled(probe.configSnapshot)) throw new Error("Gateway restart is disabled in the running gateway config (commands.restart=false); unmanaged SIGUSR1 restart would be ignored");
}
function resolveVerifiedGatewayListenerPids(port) {
	return findVerifiedGatewayListenerPidsOnPortSync(port).filter((pid) => Number.isFinite(pid) && pid > 0);
}
async function handleSystemScopeSystemdGateway(action) {
	if (process.platform !== "linux") return null;
	const installed = await findInstalledSystemdGatewayScope(process.env).catch(() => null);
	if (installed?.scope !== "system") return null;
	const stdout = createNullWriter();
	if (action === "stop") {
		await stopSystemdService({
			stdout,
			env: process.env,
			onMutation: createGatewayLifecycleMutationAudit({ action: "stop" })
		});
		return {
			result: "stopped",
			message: `Gateway stopped via system-scope systemd unit ${installed.unitName}.`
		};
	}
	await restartSystemdService({
		stdout,
		env: process.env,
		onMutation: createGatewayLifecycleMutationAudit({ action: "restart" })
	});
	return {
		result: "restarted",
		message: `Gateway restarted via system-scope systemd unit ${installed.unitName}.`
	};
}
async function stopGatewayWithoutServiceManager(port, lockOwnerPid) {
	const managed = await handleSystemScopeSystemdGateway("stop");
	if (managed) return managed;
	const listenerPids = resolveVerifiedGatewayListenerPids(port);
	const pids = listenerPids.length > 0 ? listenerPids : lockOwnerPid ? [lockOwnerPid] : [];
	if (pids.length === 0) return null;
	for (const pid of pids) {
		signalVerifiedGatewayPidSync(pid, "SIGTERM");
		appendGatewayLifecycleAudit({
			action: "stop",
			source: "cli",
			mode: "sigterm",
			pid
		});
	}
	return {
		result: "stopped",
		message: `Gateway stop signal sent to unmanaged process${pids.length === 1 ? "" : "es"} on port ${port}: ${formatGatewayPidList(pids)}.`
	};
}
async function resolveRestartListenerHealthWait(restartIntent) {
	let drainTimeoutMs;
	if (restartIntent?.force) drainTimeoutMs = 0;
	else if (typeof restartIntent?.waitMs === "number" && Number.isFinite(restartIntent.waitMs)) drainTimeoutMs = restartIntent.waitMs > 0 ? Math.floor(restartIntent.waitMs) : void 0;
	else drainTimeoutMs = resolveGatewayRestartDeferralTimeoutMs();
	const replacementHealthAttempts = postRestartHealthAttempts();
	if (drainTimeoutMs === void 0) return {
		attempts: replacementHealthAttempts,
		waitIndefinitelyForPreviousOwner: true,
		timeoutSeconds: Math.round(replacementHealthAttempts * POST_RESTART_HEALTH_DELAY_MS / 1e3)
	};
	const attempts = replacementHealthAttempts + Math.ceil(drainTimeoutMs / POST_RESTART_HEALTH_DELAY_MS);
	return {
		attempts,
		waitIndefinitelyForPreviousOwner: false,
		timeoutSeconds: Math.round(attempts * POST_RESTART_HEALTH_DELAY_MS / 1e3)
	};
}
async function signalGatewayRestart(port, params) {
	if (params.enforceRestartConfig) await assertUnmanagedGatewayRestartEnabled(port);
	const pids = resolveVerifiedGatewayListenerPids(port);
	if (pids.length === 0) return null;
	if (pids.length > 1) throw new Error(`multiple gateway processes are listening on port ${port}: ${formatGatewayPidList(pids)}; use "openclaw gateway status --deep" before retrying restart`);
	const pid = expectDefined(pids[0], "pids entry at 0");
	const isWindows = process.platform === "win32";
	const requiresTargetedDelivery = params.requireLockIdentity === true || isWindows;
	const previousLockIdentity = requiresTargetedDelivery ? await readActiveGatewayLockIdentity() : void 0;
	if (requiresTargetedDelivery && (!previousLockIdentity || previousLockIdentity.pid !== pid || previousLockIdentity.port !== port)) throw new Error(`gateway lock identity does not match the verified listener on port ${port}; refusing an ambiguous restart`);
	const usesTargetedWindowsRpc = isWindows && Boolean(previousLockIdentity?.ownerId);
	const intentWritten = usesTargetedWindowsRpc ? false : writeGatewayRestartIntentSync({
		targetPid: pid,
		reason: "gateway.restart",
		...params.restartIntent ? { intent: params.restartIntent } : {}
	});
	if (requiresTargetedDelivery && !usesTargetedWindowsRpc && !intentWritten) throw new Error("failed to persist the gateway restart intent");
	try {
		if (previousLockIdentity) {
			const currentLockIdentity = await readActiveGatewayLockIdentity();
			if (!currentLockIdentity || !isSameGatewayLockIdentity(previousLockIdentity, currentLockIdentity)) throw new Error(`gateway lock owner changed before the restart request could be delivered on port ${port}`);
		}
		if (isWindows) if (previousLockIdentity?.ownerId) await callGatewayCli({
			method: "gateway.restart.request",
			params: {
				reason: "gateway.restart",
				target: {
					pid,
					ownerId: previousLockIdentity.ownerId,
					port
				},
				...params.restartIntent ? { restartIntent: params.restartIntent } : {}
			},
			localPortOverride: port,
			ignoreEnvUrlOverride: true,
			timeoutMs: 1e4
		});
		else await callGatewayCli({
			method: "gateway.restart.request",
			params: {
				reason: "gateway.restart",
				skipDeferral: true
			},
			localPortOverride: port,
			ignoreEnvUrlOverride: true,
			timeoutMs: 1e4
		});
		else signalVerifiedGatewayPidSync(pid, "SIGUSR1");
	} catch (err) {
		if (intentWritten) clearGatewayRestartIntentSync();
		throw err;
	}
	appendGatewayLifecycleAudit({
		action: "restart",
		source: params.auditSource,
		mode: isWindows ? "rpc" : "sigusr1",
		pid
	});
	return {
		result: "restarted",
		pid,
		previousLockIdentity,
		message: `Gateway restart request sent to ${params.processLabel} process on port ${port}: ${pid}.`
	};
}
async function restartGatewayWithoutServiceManager(port, restartIntent) {
	const managed = await handleSystemScopeSystemdGateway("restart");
	if (managed) return managed;
	return await signalGatewayRestart(port, {
		restartIntent,
		enforceRestartConfig: true,
		processLabel: "unmanaged",
		auditSource: "cli"
	});
}
function isGatewaySignalRestartResult(result) {
	return result !== null && "pid" in result && typeof result.pid === "number";
}
async function runExternalSupervisorRestart(opts) {
	const json = Boolean(opts.json);
	const { emit, fail } = createDaemonActionContext({
		action: "restart",
		json
	});
	const restartIntent = resolveGatewayRestartIntentOptions(opts);
	const configuredPort = await resolveExplicitGatewayConfigPort();
	const port = await readActiveGatewayLockPort().catch(() => void 0) ?? configuredPort ?? await resolveGatewayPortFallback();
	let signaled;
	try {
		signaled = await signalGatewayRestart(port, {
			restartIntent,
			enforceRestartConfig: false,
			processLabel: "externally supervised",
			requireLockIdentity: true,
			auditSource: "supervisor"
		});
	} catch (err) {
		fail(`Gateway restart failed: ${String(err)}`);
		return false;
	}
	if (!signaled) {
		fail(`No verified gateway process is listening on port ${port}. ${formatExternalSupervisorActionRequired("start the gateway")}`);
		return false;
	}
	const healthWait = await resolveRestartListenerHealthWait(restartIntent);
	const health = await waitForGatewayHealthyListener({
		port,
		attempts: healthWait.attempts,
		delayMs: POST_RESTART_HEALTH_DELAY_MS,
		previousLockIdentity: signaled.previousLockIdentity,
		waitIndefinitelyForPreviousOwner: healthWait.waitIndefinitelyForPreviousOwner
	});
	if (!health.healthy) {
		fail(`Gateway restart timed out after ${healthWait.timeoutSeconds}s waiting for health checks.`, renderGatewayPortHealthDiagnostics(health));
		return false;
	}
	emit({
		ok: true,
		result: signaled.result,
		message: signaled.message
	});
	if (!json) defaultRuntime.log(signaled.message);
	return true;
}
/** Uninstall the managed Gateway service after stopping it. */
async function runDaemonUninstall(opts = {}) {
	assertGatewayServiceMutationAllowed("uninstall the gateway service");
	return await runServiceUninstall({
		serviceNoun: "Gateway",
		service: resolveGatewayService(),
		opts,
		stopBeforeUninstall: true,
		assertNotLoadedAfterUninstall: true
	});
}
/** Start the managed Gateway service, repairing stale service definitions when possible. */
async function runDaemonStart(opts = {}) {
	assertGatewayServiceMutationAllowed("start the gateway");
	const service = resolveGatewayService();
	const expectedPort = await resolveExplicitGatewayConfigPort();
	return await runServiceStart({
		serviceNoun: "Gateway",
		service,
		renderStartHints: renderGatewayServiceStartHints,
		onNotLoaded: process.platform === "darwin" ? async () => {
			const recovered = await recoverInstalledLaunchAgent({ result: "started" });
			if (recovered) appendGatewayLifecycleAudit({
				action: "start",
				source: "cli",
				mode: "launchd-bootstrap"
			});
			return recovered;
		} : void 0,
		repairLoadedService: async ({ json, stdout, warn, state, issues }) => await repairLoadedGatewayServiceForStart({
			service,
			port: expectedPort,
			json,
			stdout,
			warn,
			state,
			issues
		}),
		expectedPort,
		opts
	});
}
/** Stop the managed Gateway service or verified unmanaged listener fallback. */
async function runDaemonStop(opts = {}) {
	if (!isTerminalInteractive() && !opts.force) {
		const { fail } = createDaemonActionContext({
			action: "stop",
			json: Boolean(opts.json)
		});
		fail(NON_INTERACTIVE_GATEWAY_STOP_MESSAGE);
		return;
	}
	assertGatewayServiceMutationAllowed("stop the gateway");
	const service = resolveGatewayService();
	return await runServiceStop({
		serviceNoun: "Gateway",
		service,
		opts,
		stopWhenNotLoaded: process.platform === "darwin" && Boolean(opts.disable),
		onNotLoaded: async ({ stdout }) => {
			if (process.platform === "linux") {
				if ((await service.readRuntime(process.env).catch(() => null))?.status === "running") {
					await service.stop({
						env: process.env,
						stdout,
						onMutation: createGatewayLifecycleMutationAudit({ action: "stop" })
					});
					return { result: "stopped" };
				}
			}
			const lockIdentity = await readActiveGatewayLockIdentity().catch(() => void 0);
			return await stopGatewayWithoutServiceManager(lockIdentity?.port ?? await resolveGatewayLifecyclePort(service).catch(() => resolveGatewayPortFallback()), lockIdentity?.pid);
		}
	});
}
/** Restart the Gateway service or a verified unmanaged listener, then prove health. */
async function runDaemonRestart(opts = {}) {
	if (opts.skipDeferral && !opts.safe) throw new Error("--skip-deferral requires --safe");
	if (opts.safe) return await requestSafeGatewayRestart(opts);
	if (isGatewayExternallySupervised()) return await runExternalSupervisorRestart(opts);
	const jsonOutput = Boolean(opts.json);
	const service = resolveGatewayService();
	let restartedWithoutServiceManager = false;
	let unmanagedPreviousLockIdentity;
	const restartIntent = resolveGatewayRestartIntentOptions(opts);
	const configuredPort = await resolveExplicitGatewayConfigPort();
	let managedRestartContext = await resolveGatewayLifecycleContext(service).catch(async () => ({
		port: await resolveGatewayPortFallback(),
		env: process.env
	}));
	let managedRestartPort = configuredPort ?? managedRestartContext.port;
	const unmanagedPort = await readActiveGatewayLockPort().catch(() => void 0) ?? managedRestartPort;
	const restartHealthAttempts = postRestartHealthAttempts();
	const restartWaitMs = restartHealthAttempts * POST_RESTART_HEALTH_DELAY_MS;
	const restartWaitSeconds = Math.round(restartWaitMs / 1e3);
	let unmanagedRestartHealthAttempts = restartHealthAttempts;
	let unmanagedRestartWaitIndefinitely = false;
	let unmanagedRestartWaitSeconds = restartWaitSeconds;
	return await runServiceRestart({
		serviceNoun: "Gateway",
		service,
		renderStartHints: renderGatewayServiceStartHints,
		opts: {
			...opts,
			...restartIntent ? { restartIntent } : {}
		},
		checkTokenDrift: true,
		expectedPort: configuredPort,
		repairLoadedService: async ({ json, stdout, warn, state, issues }) => {
			const result = await repairLoadedGatewayServiceForStart({
				action: "restart",
				service,
				port: configuredPort,
				json,
				stdout,
				warn,
				state,
				issues
			});
			managedRestartContext = await resolveGatewayLifecycleContext(service);
			managedRestartPort = configuredPort ?? managedRestartContext.port;
			return result;
		},
		onNotLoaded: async () => {
			if (process.platform === "darwin") {
				const recovered = await recoverInstalledLaunchAgent({ result: "restarted" });
				if (recovered) {
					appendGatewayLifecycleAudit({
						action: "restart",
						source: "cli",
						mode: "launchd-bootstrap"
					});
					return recovered;
				}
			}
			const handled = await restartGatewayWithoutServiceManager(unmanagedPort, restartIntent);
			if (handled) {
				restartedWithoutServiceManager = true;
				if (isGatewaySignalRestartResult(handled) && handled.previousLockIdentity) {
					unmanagedPreviousLockIdentity = handled.previousLockIdentity;
					const healthWait = await resolveRestartListenerHealthWait(restartIntent);
					unmanagedRestartHealthAttempts = healthWait.attempts;
					unmanagedRestartWaitIndefinitely = healthWait.waitIndefinitelyForPreviousOwner;
					unmanagedRestartWaitSeconds = healthWait.timeoutSeconds;
				}
				return handled;
			}
			return null;
		},
		postRestartCheck: async ({ warnings, fail, stdout, warn }) => {
			if (restartedWithoutServiceManager) {
				const health = await waitForGatewayHealthyListener({
					port: unmanagedPort,
					attempts: unmanagedRestartHealthAttempts,
					delayMs: POST_RESTART_HEALTH_DELAY_MS,
					...unmanagedPreviousLockIdentity ? {
						previousLockIdentity: unmanagedPreviousLockIdentity,
						waitIndefinitelyForPreviousOwner: unmanagedRestartWaitIndefinitely
					} : {}
				});
				if (health.healthy) return;
				const diagnostics = renderGatewayPortHealthDiagnostics(health);
				const timeoutLine = `Timed out after ${unmanagedRestartWaitSeconds}s waiting for gateway port ${unmanagedPort} to become healthy.`;
				if (!jsonOutput) {
					defaultRuntime.log(theme.warn(timeoutLine));
					for (const line of diagnostics) defaultRuntime.log(theme.muted(line));
				} else {
					warnings.push(timeoutLine);
					warnings.push(...diagnostics);
				}
				fail(`Gateway restart timed out after ${unmanagedRestartWaitSeconds}s waiting for health checks.`, [formatCliCommand("openclaw gateway status --deep"), formatCliCommand("openclaw doctor")]);
				throw new Error("unreachable after gateway restart health failure");
			}
			let health = await waitForGatewayHealthyRestart({
				service,
				port: managedRestartPort,
				attempts: restartHealthAttempts,
				delayMs: POST_RESTART_HEALTH_DELAY_MS,
				env: managedRestartContext.env,
				includeUnknownListenersAsStale: process.platform === "win32",
				supervisorKeepsAlive: process.platform === "darwin"
			});
			if (!health.healthy && health.staleGatewayPids.length > 0) {
				const staleMsg = `Found stale gateway process(es): ${health.staleGatewayPids.join(", ")}.`;
				warnings.push(staleMsg);
				if (!jsonOutput) {
					defaultRuntime.log(theme.warn(staleMsg));
					defaultRuntime.log(theme.muted("Stopping stale process(es) and retrying restart..."));
				}
				await terminateStaleGatewayPids(health.staleGatewayPids);
				const retryRestart = await service.restart({
					env: process.env,
					stdout,
					warn,
					onMutation: createGatewayLifecycleMutationAudit({ action: "restart" })
				});
				if (retryRestart.outcome === "scheduled") return retryRestart;
				health = await waitForGatewayHealthyRestart({
					service,
					port: managedRestartPort,
					attempts: restartHealthAttempts,
					delayMs: POST_RESTART_HEALTH_DELAY_MS,
					env: managedRestartContext.env,
					includeUnknownListenersAsStale: process.platform === "win32",
					supervisorKeepsAlive: process.platform === "darwin"
				});
			}
			if (health.healthy) return;
			const diagnostics = renderRestartDiagnostics(health);
			const failure = formatRestartFailure({
				health,
				port: managedRestartPort,
				defaultTimeoutSeconds: restartWaitSeconds
			});
			const runningNoPortLine = health.runtime.status === "running" && health.portUsage.status === "free" ? `Gateway process is running but port ${managedRestartPort} is still free (startup hang/crash loop or very slow VM startup).` : null;
			if (!jsonOutput) {
				defaultRuntime.log(theme.warn(failure.statusLine));
				if (runningNoPortLine) defaultRuntime.log(theme.warn(runningNoPortLine));
				for (const line of diagnostics) defaultRuntime.log(theme.muted(line));
			} else {
				warnings.push(failure.statusLine);
				if (runningNoPortLine) warnings.push(runningNoPortLine);
				warnings.push(...diagnostics);
			}
			fail(failure.failMessage, [formatCliCommand("openclaw gateway status --deep"), formatCliCommand("openclaw doctor")]);
			throw new Error("unreachable after gateway restart failure");
		}
	});
}
//#endregion
export { recoverInstalledLaunchAgent as a, runDaemonUninstall as i, runDaemonStart as n, runDaemonStop as r, runDaemonRestart as t };
