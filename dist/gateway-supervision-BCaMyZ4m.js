//#region src/infra/gateway-supervision.ts
const GATEWAY_SUPERVISOR_MODE_ENV = "OPENCLAW_SUPERVISOR_MODE";
const EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON = "external-supervisor-update-required";
function resolveGatewaySupervisorMode(env = process.env) {
	return env[GATEWAY_SUPERVISOR_MODE_ENV]?.trim().toLowerCase() === "external" ? "external" : "auto";
}
function isGatewayExternallySupervised(env = process.env) {
	return resolveGatewaySupervisorMode(env) === "external";
}
function formatExternalSupervisorActionRequired(action) {
	return [`OpenClaw gateway lifecycle is managed by an external supervisor (${GATEWAY_SUPERVISOR_MODE_ENV}=external).`, `Use that supervisor to ${action}.`].join(" ");
}
function formatExternalSupervisorUpdateRequired() {
	return [`OpenClaw self-update is disabled while gateway lifecycle is managed by an external supervisor (${GATEWAY_SUPERVISOR_MODE_ENV}=external).`, "Use the external supervisor's update workflow so it can stop the gateway, update and finalize the runtime, then restart it safely."].join(" ");
}
function assertGatewayServiceMutationAllowed(action, env = process.env) {
	if (isGatewayExternallySupervised(env)) throw new Error(formatExternalSupervisorActionRequired(action));
}
//#endregion
export { isGatewayExternallySupervised as a, formatExternalSupervisorUpdateRequired as i, assertGatewayServiceMutationAllowed as n, formatExternalSupervisorActionRequired as r, EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON as t };
