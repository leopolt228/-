import { s as normalizeOptionalLowercaseString } from "../string-coerce-DW4mBlAt.js";
import { r as formatErrorMessage } from "../errors-DdbcjW1Y.js";
import { t as isContainerEnvironment } from "../container-environment-CNsJSTpY.js";
import { r as getRuntimeConfig } from "../io-CEgS2K9F.js";
import "../config-BOMcY2yX.js";
import { n as consumeGatewayRestartIntentPayloadSync, r as consumeGatewayRestartIntentSync } from "../restart-intent-CSwbg7-T.js";
import { v as waitForActiveGatewayRootWork } from "../gateway-work-admission-CLw1UuhK.js";
import { a as markGatewaySigusr1RestartHandled, c as resetGatewayRestartStateForInProcessRestart, d as scheduleGatewaySigusr1Restart, i as isGatewaySigusr1RestartExternallyAllowed, l as resolveGatewayRestartDeferralTimeoutMs, m as triggerOpenClawRestart, n as consumeGatewaySigusr1RestartIntent, o as peekGatewaySigusr1RestartReason, s as requestGatewayRestartWithSignalAdmission, t as consumeGatewaySigusr1RestartAuthorization, u as rollbackGatewayRestartSignalAdmission } from "../restart-B84EHBne.js";
import { i as writeGatewayRestartHandoffSync } from "../restart-handoff-Dgbh21G4.js";
import { T as rotateAgentEventLifecycleGeneration } from "../agent-events-Dg0sI2pr.js";
import { n as reloadTaskRuntimeStateFromStore } from "../runtime-internal-BFTkiMql.js";
import { l as writeDiagnosticStabilityBundleForFailureSync } from "../diagnostic-stability-bundle-0tcSxw3r.js";
import { d as getActiveEmbeddedRunCount, f as listActiveEmbeddedRunSessionIds, p as listActiveEmbeddedRunSessionKeys } from "../run-state-D28kFtJW.js";
import { n as abortEmbeddedAgentRun, w as waitForActiveEmbeddedRuns } from "../runs-DDczt14d.js";
import { t as markRestartAbortedMainSessions } from "../main-session-restart-recovery-B8-0R38X.js";
import { n as detectGatewayRespawnSupervisor, r as detectRespawnSupervisor } from "../supervisor-markers-BnF4Tqgn.js";
import { l as resetCronActiveJobs, t as advanceCronActiveJobGeneration, u as waitForActiveCronJobs } from "../active-jobs-BSWUEHJl.js";
import { a as retireActiveCronTaskRunTracking, c as waitForActiveCronTaskRuns, t as abortActiveCronTaskRuns } from "../active-run-cancellation-b13k1cU0.js";
import { _ as waitForActiveTasks, i as getActiveTaskCount, m as resetAllLanes, p as markGatewayDraining } from "../command-queue-B2fMJE4M.js";
import { n as getInspectableActiveTaskRestartBlockers } from "../task-registry.maintenance-CSMi6B7X.js";
import { r as resetGatewaySuspendCoordinatorForLifecycleRestart } from "../gateway-suspend-coordinator-DlXiAtiw.js";
import { c as markUpdateRestartSentinelFailure } from "../restart-sentinel-C6N0OP2Z.js";
import { r as abortPendingChannelReloads } from "../server-reload-handlers-E3Pcxo3G.js";
import { spawn } from "node:child_process";
//#region src/infra/process-respawn.ts
function isTruthy(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}
const PNPM_VERSIONED_OPENCLAW_ENTRY_PATTERN = /^(.*?)([\\/])node_modules\2\.pnpm\2openclaw@[^\\/]+\2node_modules\2openclaw\2.+$/;
function rewritePnpmVersionedOpenClawEntryPath(entryPath) {
	return entryPath.replace(PNPM_VERSIONED_OPENCLAW_ENTRY_PATTERN, "$1$2node_modules$2openclaw$2openclaw.mjs");
}
function spawnDetachedGatewayProcess(opts = {}) {
	const [entryArg, ...entryArgs] = process.argv.slice(1);
	const args = [
		...process.execArgv,
		...entryArg ? [rewritePnpmVersionedOpenClawEntryPath(entryArg)] : [],
		...entryArgs
	];
	const child = spawn(process.execPath, args, {
		env: opts.env ? {
			...process.env,
			...opts.env
		} : process.env,
		detached: true,
		stdio: "inherit"
	});
	child.on("error", () => {});
	child.unref();
	return {
		child,
		pid: child.pid ?? void 0
	};
}
/**
* Attempt to restart this process with a fresh PID.
* - supervised environments (launchd/systemd/schtasks): caller should exit and let supervisor restart
* - OPENCLAW_NO_RESPAWN=1: caller should keep in-process restart behavior (tests/dev)
* - unmanaged environments: caller should keep in-process restart behavior so
*   custom supervisors keep tracking the same gateway PID
*/
function restartGatewayProcessWithFreshPid(_opts = {}) {
	if (isTruthy(process.env.OPENCLAW_NO_RESPAWN)) return { mode: "disabled" };
	const supervisor = detectGatewayRespawnSupervisor(process.env);
	if (supervisor) {
		if (supervisor === "schtasks") {
			const restart = triggerOpenClawRestart();
			if (!restart.ok) return {
				mode: "failed",
				detail: restart.detail ?? `${restart.method} restart failed`
			};
		}
		return { mode: "supervised" };
	}
	if (process.platform === "win32") return {
		mode: "disabled",
		detail: "win32: detached respawn unsupported without Scheduled Task markers"
	};
	if (isContainerEnvironment()) return {
		mode: "disabled",
		detail: "container: use in-process restart to keep PID 1 alive"
	};
	return {
		mode: "disabled",
		detail: "unmanaged: use in-process restart to keep custom supervisor PID tracking stable"
	};
}
/**
* Update restarts must replace the OS process so the new code runs from a
* fresh module graph after package files have changed on disk.
*
* Unlike the generic restart path, update mode allows detached respawn on
* unmanaged Windows installs because there is no safe in-process fallback once
* the installed package contents have been replaced.
*/
function respawnGatewayProcessForUpdate(opts = {}) {
	const supervisor = detectGatewayRespawnSupervisor(process.env, process.platform, { includeLinuxOpenClawGatewayServiceMarker: true });
	if (supervisor) {
		if (supervisor === "schtasks") {
			const restart = triggerOpenClawRestart();
			if (!restart.ok) return {
				mode: "failed",
				detail: restart.detail ?? `${restart.method} restart failed`
			};
		}
		return { mode: "supervised" };
	}
	if (isTruthy(process.env.OPENCLAW_NO_RESPAWN)) return {
		mode: "disabled",
		detail: "OPENCLAW_NO_RESPAWN"
	};
	try {
		const { child, pid } = spawnDetachedGatewayProcess(opts);
		return {
			mode: "spawned",
			pid,
			child
		};
	} catch (err) {
		return {
			mode: "failed",
			detail: formatErrorMessage(err)
		};
	}
}
//#endregion
export { abortActiveCronTaskRuns, abortEmbeddedAgentRun, abortPendingChannelReloads, advanceCronActiveJobGeneration, consumeGatewayRestartIntentPayloadSync, consumeGatewayRestartIntentSync, consumeGatewaySigusr1RestartAuthorization, consumeGatewaySigusr1RestartIntent, detectGatewayRespawnSupervisor, detectRespawnSupervisor, getActiveEmbeddedRunCount, getActiveTaskCount, getInspectableActiveTaskRestartBlockers, getRuntimeConfig, isGatewaySigusr1RestartExternallyAllowed, listActiveEmbeddedRunSessionIds, listActiveEmbeddedRunSessionKeys, markGatewayDraining, markGatewaySigusr1RestartHandled, markRestartAbortedMainSessions, markUpdateRestartSentinelFailure, peekGatewaySigusr1RestartReason, reloadTaskRuntimeStateFromStore, requestGatewayRestartWithSignalAdmission, resetAllLanes, resetCronActiveJobs, resetGatewayRestartStateForInProcessRestart, resetGatewaySuspendCoordinatorForLifecycleRestart, resolveGatewayRestartDeferralTimeoutMs, respawnGatewayProcessForUpdate, restartGatewayProcessWithFreshPid, retireActiveCronTaskRunTracking, rollbackGatewayRestartSignalAdmission, rotateAgentEventLifecycleGeneration, scheduleGatewaySigusr1Restart, waitForActiveCronJobs, waitForActiveCronTaskRuns, waitForActiveEmbeddedRuns, waitForActiveGatewayRootWork, waitForActiveTasks, writeDiagnosticStabilityBundleForFailureSync, writeGatewayRestartHandoffSync };
