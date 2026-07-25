//#region src/agents/subagent-registry-steer-runtime.ts
let replaceSubagentRunAfterSteerImpl = null;
let finalizeInterruptedSubagentRunImpl = null;
let reserveSwarmCollectorLaunchImpl = null;
/** Installs registry mutation hooks used by steer/recovery runtime paths. */
function configureSubagentRegistrySteerRuntime(params) {
	replaceSubagentRunAfterSteerImpl = params.replaceSubagentRunAfterSteer;
	finalizeInterruptedSubagentRunImpl = params.finalizeInterruptedSubagentRun ?? null;
	reserveSwarmCollectorLaunchImpl = params.reserveSwarmCollectorLaunch ?? null;
}
/** Replaces a previous run id after steering, returning false when no hook is installed. */
function replaceSubagentRunAfterSteer(params) {
	return replaceSubagentRunAfterSteerImpl?.(params) ?? false;
}
/** Finalizes one interrupted run generation through the installed registry hook. */
async function finalizeInterruptedSubagentRun(params) {
	return await finalizeInterruptedSubagentRunImpl?.(params) ?? 0;
}
/** Durably reserves one host-originated collector recovery request. */
function reserveSwarmCollectorLaunch(runId, idempotencyKey) {
	return reserveSwarmCollectorLaunchImpl?.(runId, idempotencyKey) ?? false;
}
//#endregion
export { reserveSwarmCollectorLaunch as i, finalizeInterruptedSubagentRun as n, replaceSubagentRunAfterSteer as r, configureSubagentRegistrySteerRuntime as t };
