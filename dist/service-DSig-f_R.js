import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { n as parseTcpPort, r as parseTcpPortFromArgs } from "./tcp-port-BiPmOnnn.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import { h as resolveFutureConfigActionBlock, m as formatFutureConfigActionBlock } from "./config-env-vars-9fUuyise.js";
import { c as readSystemdServiceRuntime, d as stageSystemdService, f as startSystemdService, h as uninstallSystemdService, i as isSystemdServiceEnabled, n as installSystemdService, p as stopSystemdService, s as readSystemdServiceExecStart, u as restartSystemdService } from "./systemd-iYtBw5_g.js";
import { l as readConfigFileSnapshot } from "./io-CEgS2K9F.js";
import "./config-BOMcY2yX.js";
import { _ as stopLaunchAgent, a as installLaunchAgent, d as readLaunchAgentRuntime, g as startLaunchAgent, h as stageLaunchAgent, m as restartLaunchAgent, o as isLaunchAgentLoaded, u as readLaunchAgentProgramArguments, v as uninstallLaunchAgent } from "./launchd-BI3BhZkH.js";
import { n as assertGatewayServiceMutationAllowed } from "./gateway-supervision-BCaMyZ4m.js";
import { d as stopScheduledTask, i as readScheduledTaskRuntime, l as stageScheduledTask, n as isScheduledTaskInstalled, p as uninstallScheduledTask, r as readScheduledTaskCommand, s as restartScheduledTask, t as installScheduledTask, u as startScheduledTask } from "./schtasks-DfZtOELz.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/daemon/future-config-guard.ts
/** Prevents daemon write actions when the config belongs to a newer OpenClaw. */
async function readFutureConfigActionBlock(action) {
	try {
		return resolveFutureConfigActionBlock({
			action,
			snapshot: await readConfigFileSnapshot()
		});
	} catch {
		return null;
	}
}
async function assertFutureConfigActionAllowed(action) {
	const block = await readFutureConfigActionBlock(action);
	if (block) throw new Error(formatFutureConfigActionBlock(block));
}
//#endregion
//#region src/daemon/service-env-merge.ts
function mergeGatewayServiceEnv(baseEnv, command) {
	if (!command?.environment) return baseEnv;
	const merged = {
		...baseEnv,
		...command.environment
	};
	for (const key of [
		"OPENCLAW_LAUNCHD_LABEL",
		"OPENCLAW_SYSTEMD_UNIT",
		"OPENCLAW_WINDOWS_TASK_NAME"
	]) {
		const value = baseEnv[key]?.trim();
		if (value) merged[key] = value;
	}
	return merged;
}
//#endregion
//#region src/daemon/service.ts
/** Platform service registry and shared gateway service start/repair logic. */
function ignoreServiceWriteResult(write) {
	return async (args) => {
		await write(args);
	};
}
const TEMP_PROGRAM_ROOTS = [
	os.tmpdir(),
	"/tmp",
	"/private/tmp",
	"/var/tmp"
].map((entry) => path.resolve(entry));
function pathIsSameOrChild(candidate, parent) {
	return candidate === parent || candidate.startsWith(`${parent}${path.sep}`);
}
function isTemporaryProgramPath(value) {
	if (!value || !path.isAbsolute(value)) return false;
	const resolved = path.resolve(value);
	return TEMP_PROGRAM_ROOTS.some((root) => pathIsSameOrChild(resolved, root));
}
function isMissingProgramPath(value) {
	if (!value || !path.isAbsolute(value)) return false;
	return !fs.existsSync(value);
}
function collectGatewayServiceStartRepairIssues(state, expectedPort) {
	const command = state.command;
	if (!state.loaded || !command) return [];
	const issues = [];
	const serviceVersion = command.environment?.OPENCLAW_SERVICE_VERSION?.trim();
	if (serviceVersion && serviceVersion !== VERSION) issues.push({
		code: "version-mismatch",
		message: `service was installed by OpenClaw ${serviceVersion}, current CLI is ${VERSION}`
	});
	const servicePort = parseTcpPortFromArgs(command.programArguments) ?? parseTcpPort(command.environment?.OPENCLAW_GATEWAY_PORT ?? "");
	if (expectedPort !== void 0 && servicePort !== null && servicePort !== expectedPort) issues.push({
		code: "port-mismatch",
		message: `service port ${servicePort} does not match current gateway config port ${expectedPort}`
	});
	for (const candidate of command.programArguments.slice(0, 2)) {
		if (isTemporaryProgramPath(candidate)) {
			issues.push({
				code: "temporary-program",
				message: `service command points at a temporary path: ${candidate}`
			});
			continue;
		}
		if (isMissingProgramPath(candidate)) issues.push({
			code: "missing-program",
			message: `service command points at a missing path: ${candidate}`
		});
	}
	return issues;
}
/** Reads the installed service and reports definition drift that must be repaired before launch. */
async function inspectGatewayServiceStartRepair(service, args, expectedPort) {
	const state = await readGatewayServiceState(service, args);
	return {
		state,
		issues: collectGatewayServiceStartRepairIssues(state, expectedPort)
	};
}
function formatGatewayServiceStartRepairIssues(issues) {
	return issues.map((issue) => issue.message).join("; ");
}
async function readGatewayServiceState(service, args = {}) {
	const baseEnv = args.env ?? process.env;
	const command = await service.readCommand(baseEnv).catch(() => null);
	const env = mergeGatewayServiceEnv(baseEnv, command);
	const [loaded, runtime] = await Promise.all([service.isLoaded({
		env,
		timeoutMs: args.timeoutMs
	}).catch(() => false), service.readRuntime(env, { timeoutMs: args.timeoutMs }).catch(() => void 0)]);
	return {
		installed: command !== null,
		loaded,
		running: runtime?.status === "running",
		env,
		command,
		runtime
	};
}
async function startGatewayService(service, args, expectedPort) {
	const { state, issues: repairIssues } = await inspectGatewayServiceStartRepair(service, { env: args.env }, expectedPort);
	if (!state.loaded && !state.installed) return {
		outcome: "missing-install",
		state
	};
	if (state.loaded && state.running) return {
		outcome: "already-running",
		state,
		issues: repairIssues
	};
	if (repairIssues.length > 0) return {
		outcome: "repair-required",
		state,
		issues: repairIssues
	};
	try {
		await service.start({
			...args,
			env: state.env
		});
		return {
			outcome: "started",
			state: await readGatewayServiceState(service, { env: state.env })
		};
	} catch (err) {
		const nextState = await readGatewayServiceState(service, { env: state.env });
		if (!nextState.installed) return {
			outcome: "missing-install",
			state: nextState
		};
		throw err;
	}
}
function describeGatewayServiceRestart(serviceNoun, result) {
	if (result.outcome === "scheduled") return {
		scheduled: true,
		daemonActionResult: "scheduled",
		message: `restart scheduled, ${normalizeLowercaseStringOrEmpty(serviceNoun)} will restart momentarily`,
		progressMessage: `${serviceNoun} service restart scheduled.`
	};
	return {
		scheduled: false,
		daemonActionResult: "restarted",
		message: `${serviceNoun} service restarted.`,
		progressMessage: `${serviceNoun} service restarted.`
	};
}
function createUnsupportedGatewayServiceError() {
	return /* @__PURE__ */ new Error(`Gateway service install not supported on ${process.platform}`);
}
async function rejectUnsupportedGatewayService() {
	throw createUnsupportedGatewayServiceError();
}
function createUnsupportedGatewayService() {
	return {
		label: "Gateway service",
		loadedText: "available",
		notLoadedText: "not installed",
		stage: rejectUnsupportedGatewayService,
		install: rejectUnsupportedGatewayService,
		uninstall: rejectUnsupportedGatewayService,
		start: rejectUnsupportedGatewayService,
		stop: rejectUnsupportedGatewayService,
		restart: rejectUnsupportedGatewayService,
		isLoaded: rejectUnsupportedGatewayService,
		readCommand: async () => null,
		readRuntime: async () => ({
			status: "unknown",
			detail: createUnsupportedGatewayServiceError().message
		})
	};
}
const GATEWAY_SERVICE_REGISTRY = {
	darwin: {
		label: "LaunchAgent",
		loadedText: "loaded",
		notLoadedText: "not loaded",
		stage: ignoreServiceWriteResult(stageLaunchAgent),
		install: ignoreServiceWriteResult(installLaunchAgent),
		uninstall: uninstallLaunchAgent,
		start: startLaunchAgent,
		stop: stopLaunchAgent,
		restart: restartLaunchAgent,
		isLoaded: isLaunchAgentLoaded,
		readCommand: readLaunchAgentProgramArguments,
		readRuntime: readLaunchAgentRuntime
	},
	linux: {
		label: "systemd user",
		loadedText: "enabled",
		notLoadedText: "disabled",
		stage: ignoreServiceWriteResult(stageSystemdService),
		install: ignoreServiceWriteResult(installSystemdService),
		uninstall: uninstallSystemdService,
		start: startSystemdService,
		stop: stopSystemdService,
		restart: restartSystemdService,
		isLoaded: isSystemdServiceEnabled,
		readCommand: readSystemdServiceExecStart,
		readRuntime: readSystemdServiceRuntime
	},
	win32: {
		label: "Scheduled Task",
		loadedText: "registered",
		notLoadedText: "missing",
		stage: ignoreServiceWriteResult(stageScheduledTask),
		install: ignoreServiceWriteResult(installScheduledTask),
		uninstall: uninstallScheduledTask,
		start: startScheduledTask,
		stop: stopScheduledTask,
		restart: restartScheduledTask,
		isLoaded: isScheduledTaskInstalled,
		readCommand: readScheduledTaskCommand,
		readRuntime: readScheduledTaskRuntime
	}
};
function assertGatewayServiceMutationOwnedByOpenClaw(action, env) {
	assertGatewayServiceMutationAllowed(action, process.env);
	if (env && env !== process.env) assertGatewayServiceMutationAllowed(action, env);
}
function withGatewayServiceMutationGuards(service) {
	return {
		...service,
		stage: async (args) => {
			assertGatewayServiceMutationOwnedByOpenClaw("rewrite the gateway service", args.env);
			await assertFutureConfigActionAllowed("rewrite the gateway service");
			return await service.stage(args);
		},
		install: async (args) => {
			assertGatewayServiceMutationOwnedByOpenClaw("install or rewrite the gateway service", args.env);
			await assertFutureConfigActionAllowed("install or rewrite the gateway service");
			return await service.install(args);
		},
		uninstall: async (args) => {
			assertGatewayServiceMutationOwnedByOpenClaw("uninstall the gateway service", args.env);
			await assertFutureConfigActionAllowed("uninstall the gateway service");
			return await service.uninstall(args);
		},
		start: async (args) => {
			assertGatewayServiceMutationOwnedByOpenClaw("start the gateway service", args.env);
			await assertFutureConfigActionAllowed("start the gateway service");
			return await service.start(args);
		},
		stop: async (args) => {
			assertGatewayServiceMutationOwnedByOpenClaw("stop the gateway service", args.env);
			await assertFutureConfigActionAllowed("stop the gateway service");
			return await service.stop(args);
		},
		restart: async (args) => {
			assertGatewayServiceMutationOwnedByOpenClaw("restart the gateway service", args.env);
			await assertFutureConfigActionAllowed("restart the gateway service");
			return await service.restart(args);
		}
	};
}
function isSupportedGatewayServicePlatform(platform) {
	return Object.hasOwn(GATEWAY_SERVICE_REGISTRY, platform);
}
function resolveGatewayService() {
	if (isSupportedGatewayServicePlatform(process.platform)) return withGatewayServiceMutationGuards(GATEWAY_SERVICE_REGISTRY[process.platform]);
	return createUnsupportedGatewayService();
}
//#endregion
export { resolveGatewayService as a, readGatewayServiceState as i, formatGatewayServiceStartRepairIssues as n, startGatewayService as o, inspectGatewayServiceStartRepair as r, mergeGatewayServiceEnv as s, describeGatewayServiceRestart as t };
