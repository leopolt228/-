import { X as resolveAgentMaxConcurrent, Z as resolveSubagentMaxConcurrent } from "./io-CEgS2K9F.js";
import { g as setCommandLaneConcurrency } from "./command-queue-B2fMJE4M.js";
import { t as resolveCronMaxConcurrentRuns } from "./cron-limits-txevLFpr.js";
import { n as enableSessionSuspensionTimersForGatewayStart, r as getCleanupSuspendedLaneIdsForGatewayPublication } from "./session-suspension-DNYLXcr7.js";
//#region src/gateway/server-lanes.ts
function resolveGatewayLaneConcurrency(cfg) {
	return {
		cron: resolveCronMaxConcurrentRuns(),
		main: resolveAgentMaxConcurrent(cfg),
		subagent: resolveSubagentMaxConcurrent(cfg)
	};
}
function applyGatewayLaneConcurrency(concurrency, opts = {}) {
	const suspendedLaneIds = opts.gatewayStart ? enableSessionSuspensionTimersForGatewayStart((laneId, savedResumeConcurrency) => {
		switch (laneId) {
			case "cron":
			case "cron-nested": return concurrency.cron;
			case "main": return concurrency.main;
			case "nested": return 1;
			case "subagent": return concurrency.subagent;
			default: return savedResumeConcurrency;
		}
	}) : getCleanupSuspendedLaneIdsForGatewayPublication();
	if (!suspendedLaneIds.has("cron")) setCommandLaneConcurrency("cron", concurrency.cron);
	if (!suspendedLaneIds.has("cron-nested")) setCommandLaneConcurrency("cron-nested", concurrency.cron);
	if (!suspendedLaneIds.has("main")) setCommandLaneConcurrency("main", concurrency.main);
	if (opts.gatewayStart) {
		if (!suspendedLaneIds.has("nested")) setCommandLaneConcurrency("nested", 1);
	}
	if (!suspendedLaneIds.has("subagent")) setCommandLaneConcurrency("subagent", concurrency.subagent);
}
//#endregion
//#region src/gateway/server/hook-client-ip-config.ts
/**
* Adapts gateway network trust config to the hooks HTTP request handler.
*/
function resolveHookClientIpConfig(cfg) {
	return {
		trustedProxies: cfg.gateway?.trustedProxies,
		allowRealIpFallback: cfg.gateway?.allowRealIpFallback === true
	};
}
//#endregion
export { applyGatewayLaneConcurrency as n, resolveGatewayLaneConcurrency as r, resolveHookClientIpConfig as t };
