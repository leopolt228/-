import { s as getVerboseFlag, u as isHelpOrVersionInvocation } from "./argv-D4LdWdQQ.js";
import { n as resolveCliName } from "./cli-name-CVj-3DWf.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DyflwSWk.js";
import { r as setVerbose } from "./global-state-BCtvHc7P.js";
import { r as defaultRuntime } from "./runtime-ZHfN2VLf.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import "./globals-DBBT7Ru5.js";
import { n as resolveCliChannelOptions } from "./channel-options-CKL4O-YY.js";
import { n as isParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.js";
import { n as ensureCliExecutionBootstrap, r as resolveCliExecutionStartupContext, t as applyCliExecutionStartupPresentation } from "./command-execution-startup-B_-mT-rb.js";
import { n as shouldBypassConfigGuardForCommandPath } from "./command-startup-policy-CR8_xaoY.js";
import { n as setProgramContext } from "./program-context-VEhF8JxS.js";
import { t as isCommandJsonOutputMode } from "./json-mode-BcwbsF88.js";
import { n as resolvePluginInstallPreactionRequest, t as resolvePluginInstallInvalidConfigPolicy } from "./plugin-install-config-policy-BGqTiWPb.js";
import { t as forceFreePort } from "./ports-DBCbyv5E.js";
import { t as registerProgramCommands } from "./command-registry-iK5L53fT.js";
import { t as configureProgramHelp } from "./help-e2PTmWcy.js";
import process$1 from "node:process";
import { Command } from "commander";
//#region src/cli/program/context.ts
/** Create a program context that resolves channel options once on first use. */
function createProgramContext() {
	let cachedChannelOptions;
	const getChannelOptions = () => {
		if (cachedChannelOptions === void 0) cachedChannelOptions = resolveCliChannelOptions();
		return cachedChannelOptions;
	};
	return {
		programVersion: VERSION,
		get channelOptions() {
			return getChannelOptions();
		},
		get messageChannelOptions() {
			return getChannelOptions().join("|");
		},
		get agentChannelOptions() {
			return ["last", ...getChannelOptions()].join("|");
		}
	};
}
//#endregion
//#region src/cli/program/preaction.ts
function setProcessTitleForCommand(actionCommand) {
	let current = actionCommand;
	while (current.parent && current.parent.parent) current = current.parent;
	const name = current.name();
	const cliName = resolveCliName();
	if (!name || name === cliName) return;
	process.title = `${cliName}-${name}`;
}
function shouldAllowInvalidConfigForAction(actionCommand, commandPath) {
	return resolvePluginInstallInvalidConfigPolicy(resolvePluginInstallPreactionRequest({
		actionCommand,
		commandPath,
		argv: process.argv
	})) === "allow-plugin-recovery";
}
function getActionCommandPath(actionCommand) {
	const commandPath = [];
	let current = actionCommand;
	while (current.parent) {
		commandPath.unshift(current.name());
		current = current.parent;
	}
	return commandPath;
}
function getCliLogLevel(actionCommand) {
	if (actionCommand.getOptionValueSourceWithGlobals("logLevel") !== "cli") return;
	const logLevel = actionCommand.optsWithGlobals().logLevel;
	return typeof logLevel === "string" ? logLevel : void 0;
}
function isBareParentDefaultHelpInvocation(actionCommand, argv) {
	if (!isParentDefaultHelpAction(actionCommand)) return false;
	const { commandPath } = resolveCliArgvInvocation(argv);
	const [primary, extra] = commandPath;
	if (extra !== void 0 || !primary) return false;
	return primary === actionCommand.name() || actionCommand.aliases().includes(primary);
}
function isGuidedConfigAction(actionCommand) {
	return actionCommand.name() === "config" && !actionCommand.parent?.parent;
}
function isGuidedConfigCommandPath(commandPath) {
	const [primary, secondary, extra] = commandPath;
	if (primary !== "config" || extra !== void 0) return false;
	return secondary !== "get" && secondary !== "set" && secondary !== "patch" && secondary !== "unset" && secondary !== "file" && secondary !== "schema" && secondary !== "validate";
}
function isGatewayRunAction(actionCommand) {
	if (actionCommand.name() === "gateway") return actionCommand.parent?.parent === null;
	return actionCommand.name() === "run" && actionCommand.parent?.name() === "gateway" && actionCommand.parent.parent?.parent === null;
}
/** Register global pre-action bootstrap hooks for every non-help command invocation. */
function registerPreActionHooks(program, programVersion) {
	program.hook("preAction", async (_thisCommand, actionCommand) => {
		setProcessTitleForCommand(actionCommand);
		const argv = process.argv;
		if (isHelpOrVersionInvocation(argv) || isBareParentDefaultHelpInvocation(actionCommand, argv)) return;
		const jsonOutputMode = isCommandJsonOutputMode(actionCommand, argv);
		const { commandPath, startupPolicy } = resolveCliExecutionStartupContext({
			argv,
			protocolCommandPath: getActionCommandPath(actionCommand),
			jsonOutputMode,
			env: process.env
		});
		await applyCliExecutionStartupPresentation({
			startupPolicy,
			version: programVersion
		});
		const verbose = getVerboseFlag(argv, { includeDebug: true });
		setVerbose(verbose);
		const cliLogLevel = getCliLogLevel(actionCommand);
		if (cliLogLevel) process.env.OPENCLAW_LOG_LEVEL = cliLogLevel;
		if (!verbose) process.env.NODE_NO_WARNINGS ??= "1";
		if (shouldBypassConfigGuardForCommandPath(commandPath) || isGuidedConfigAction(actionCommand) || isGuidedConfigCommandPath(commandPath)) return;
		let beforeStateMigrations;
		let skipPristineStartupStateMigrations = false;
		let skipPristineCoreStateMigrations = false;
		let allowInvalid = shouldAllowInvalidConfigForAction(actionCommand, commandPath);
		if (isGatewayRunAction(actionCommand)) {
			const { prepareGatewayRunBootstrap, recheckGatewayRunBootstrap, wasPreparedGatewayRunCoreStatePristine, wasPreparedGatewayRunStatePristine } = await import("./pre-bootstrap-CLju9IvY.js");
			const { resolveGatewayRunOptions } = await import("./run-options-BO1zlNtl.js");
			const resolvedOptions = resolveGatewayRunOptions(actionCommand.opts(), actionCommand);
			allowInvalid ||= resolvedOptions.allowUnconfigured === true;
			const opts = {
				force: resolvedOptions.force === true,
				reset: resolvedOptions.reset === true
			};
			if (!await prepareGatewayRunBootstrap({
				opts,
				runtime: defaultRuntime
			})) return;
			skipPristineStartupStateMigrations = wasPreparedGatewayRunStatePristine();
			skipPristineCoreStateMigrations = wasPreparedGatewayRunCoreStatePristine();
			beforeStateMigrations = (snapshot) => recheckGatewayRunBootstrap({
				opts,
				runtime: defaultRuntime,
				...snapshot ? { snapshot } : {}
			});
		}
		await ensureCliExecutionBootstrap({
			runtime: defaultRuntime,
			commandPath,
			startupPolicy,
			allowInvalid,
			...beforeStateMigrations ? { beforeStateMigrations } : {},
			...skipPristineStartupStateMigrations ? { skipPristineStartupStateMigrations: true } : {},
			...skipPristineCoreStateMigrations ? { skipPristineCoreStateMigrations: true } : {},
			skipConfigGuard: shouldBypassConfigGuardForCommandPath(commandPath)
		});
		if (beforeStateMigrations) {
			const { reloadTrustedGatewayRunEnvironment } = await import("./pre-bootstrap-CLju9IvY.js");
			await reloadTrustedGatewayRunEnvironment({ runtime: defaultRuntime });
		}
	});
}
//#endregion
//#region src/cli/program/build-program.ts
function buildProgram() {
	const program = new Command();
	program.enablePositionalOptions();
	program.exitOverride((err) => {
		process$1.exitCode = typeof err.exitCode === "number" ? err.exitCode : 1;
		throw err;
	});
	const ctx = createProgramContext();
	const argv = process$1.argv;
	setProgramContext(program, ctx);
	configureProgramHelp(program, ctx);
	registerPreActionHooks(program, ctx.programVersion);
	registerProgramCommands(program, ctx, argv);
	return program;
}
//#endregion
export { buildProgram, forceFreePort };
