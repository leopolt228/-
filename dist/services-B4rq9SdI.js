import { r as STATE_DIR } from "./paths-CHQRdQZ3.js";
import { g as onTrustedInternalDiagnosticEvent, s as emitTrustedDiagnosticEventWithPrivateData } from "./diagnostic-events-Dt41CZkD.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import { t as encodeStartupTraceSegment } from "./startup-trace-segment-Cd4cVDJE.js";
import { n as withPluginHttpRouteRegistry } from "./http-registry-wH4gRLLj.js";
//#region src/plugins/services.ts
/** Starts, stops, and inspects plugin service registrations. */
const log = createSubsystemLogger("plugins");
function createPluginLogger() {
	return {
		info: (msg) => log.info(msg),
		warn: (msg) => log.warn(msg),
		error: (msg) => log.error(msg),
		debug: (msg) => log.debug(msg)
	};
}
function createServiceContext(params) {
	const grantsInternalDiagnostics = params.service?.pluginId === params.service?.service.id && (params.service?.service.id === "diagnostics-otel" || params.service?.service.id === "diagnostics-prometheus") && (params.service?.origin === "bundled" || params.service?.trustedOfficialInstall === true);
	return {
		config: params.config,
		workspaceDir: params.workspaceDir,
		stateDir: STATE_DIR,
		logger: createPluginLogger(),
		...params.gatewayEvents ? { gatewayEvents: params.gatewayEvents } : {},
		...params.startupTrace ? { startupTrace: createScopedPluginServiceStartupTrace(params.startupTrace, createPluginServiceTraceName(params.service)) } : {},
		...grantsInternalDiagnostics ? { internalDiagnostics: {
			emit: emitTrustedDiagnosticEventWithPrivateData,
			onEvent: onTrustedInternalDiagnosticEvent
		} } : {}
	};
}
function createScopedGatewayEvents(params) {
	if (!params.broadcast) return { revoke: () => void 0 };
	let active = true;
	return {
		gatewayEvents: { emit: (event, payload, opts) => {
			if (!active) throw new Error("plugin service gateway event emitter is no longer active");
			if (!/^[a-z][a-z0-9_-]*$/u.test(event)) throw new Error(`invalid plugin gateway event name: ${event}`);
			if (!isPluginJsonValue(payload)) throw new Error("plugin gateway event payload must be bounded JSON");
			if (opts?.scope !== "operator.read" && opts?.scope !== "operator.write" && opts?.scope !== "operator.admin") throw new Error("plugin gateway event scope must be an operator scope");
			params.broadcast?.(`plugin.${params.pluginId}.${event}`, payload, opts.scope);
		} },
		revoke: () => {
			active = false;
		}
	};
}
function createPluginServiceTraceName(entry) {
	return `sidecars.plugin-services.${encodeStartupTraceSegment(entry.pluginId)}.${encodeStartupTraceSegment(entry.service.id)}`;
}
function createScopedPluginServiceStartupTrace(startupTrace, prefix) {
	const scopeName = (name) => `${prefix}.${name.split(".").map((segment) => encodeStartupTraceSegment(segment)).join(".")}`;
	return {
		measure: (name, run) => startupTrace.measure(scopeName(name), run),
		...startupTrace.detail ? { detail: (name, metrics) => startupTrace.detail?.(scopeName(name), metrics) } : {}
	};
}
async function startPluginServices(params) {
	const running = [];
	let failedCount = 0;
	for (const entry of params.registry.services) {
		const service = entry.service;
		const traceName = createPluginServiceTraceName(entry);
		const scopedGatewayEvents = createScopedGatewayEvents({
			pluginId: entry.pluginId,
			broadcast: params.broadcastPluginEvent
		});
		const serviceContext = createServiceContext({
			config: params.config,
			startupTrace: params.startupTrace,
			workspaceDir: params.workspaceDir,
			service: entry,
			gatewayEvents: scopedGatewayEvents.gatewayEvents
		});
		try {
			const startService = () => withPluginHttpRouteRegistry(params.registry, () => service.start(serviceContext));
			if (params.startupTrace) await params.startupTrace.measure(traceName, startService);
			else await startService();
			running.push({
				id: service.id,
				stop: service.stop ? () => service.stop?.(serviceContext) : void 0,
				revokeGatewayEvents: scopedGatewayEvents.revoke
			});
		} catch (err) {
			scopedGatewayEvents.revoke();
			failedCount += 1;
			const error = err;
			log.error(`plugin service failed (${service.id}, plugin=${entry.pluginId}, root=${entry.rootDir ?? "unknown"}): ${error?.message ?? String(err)}`);
		}
	}
	params.startupTrace?.detail?.("sidecars.plugin-services.summary", [
		["serviceCount", params.registry.services.length],
		["startedCount", running.length],
		["failedCount", failedCount]
	]);
	return { stop: async () => {
		for (const entry of running.toReversed()) try {
			if (entry.stop) await withPluginHttpRouteRegistry(params.registry, () => entry.stop?.());
		} catch (err) {
			log.warn(`plugin service stop failed (${entry.id}): ${String(err)}`);
		} finally {
			entry.revokeGatewayEvents();
		}
	} };
}
//#endregion
export { startPluginServices };
