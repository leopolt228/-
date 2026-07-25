import { c as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { bt as validateEnvironmentsListParams, vt as validateEnvironmentsCreateParams, xt as validateEnvironmentsStatusParams, yt as validateEnvironmentsDestroyParams } from "./src-Cy32TawB.js";
import { l as listDevicePairing } from "./device-pairing-DUA4LHep.js";
import { a as listNodePairing } from "./node-pairing-kSMAHxQd.js";
import { r as respondUnavailableOnThrow, t as respondInvalidParams } from "./nodes.helpers-7n_NmUos.js";
import { t as formatForLog } from "./ws-log-Bj-6Do--.js";
import { r as listKnownNodes, t as createKnownNodeCatalog } from "./node-catalog-RXfNIHiO.js";
//#region src/gateway/server-methods/environments.ts
const GATEWAY_ENVIRONMENT = {
	id: "gateway",
	type: "local",
	label: "Gateway local",
	status: "available",
	capabilities: [
		"agent.run",
		"sessions",
		"tools",
		"workspace"
	]
};
const WORKER_STATUS = {
	requested: "starting",
	provisioning: "starting",
	bootstrapping: "starting",
	ready: "available",
	attached: "available",
	idle: "available",
	draining: "stopping",
	destroying: "stopping",
	destroyed: "unavailable",
	failed: "error",
	orphaned: "error"
};
function uniqueSortedStrings(...items) {
	return normalizeSortedUniqueTrimmedStringList(items.flatMap((item) => item ?? []));
}
function rejectInvalid(respond, method, validator) {
	return respondInvalidParams({
		respond,
		method,
		validator
	});
}
function summarizeNodeEnvironment(node) {
	const capabilities = uniqueSortedStrings(node.caps, node.commands);
	return {
		id: `node:${node.nodeId}`,
		type: "node",
		label: node.displayName ?? node.nodeId,
		status: node.connected ? "available" : "unavailable",
		...capabilities.length > 0 ? { capabilities } : {}
	};
}
/** Projects a durable worker row without exposing its SSH credential reference. */
function summarizeWorkerEnvironment(record, now = Date.now()) {
	return {
		id: record.environmentId,
		type: "worker",
		status: WORKER_STATUS[record.state],
		worker: {
			providerId: record.providerId,
			...record.leaseId ? { leaseId: record.leaseId } : {},
			state: record.state,
			ageMs: Math.max(0, Math.trunc(now - record.createdAtMs)),
			...record.state === "idle" && record.idleSinceAtMs !== null ? { idleMs: Math.max(0, Math.trunc(now - record.idleSinceAtMs)) } : {},
			attachedSessionIds: uniqueSortedStrings(record.attachedSessionIds),
			tunnelStatus: record.tunnelStatus
		}
	};
}
async function listEnvironments(context) {
	const [devices, nodes] = await Promise.all([listDevicePairing(), listNodePairing()]);
	const catalog = createKnownNodeCatalog({
		pairedDevices: devices.paired,
		pairedNodes: nodes.paired,
		connectedNodes: context.nodeRegistry.listConnected()
	});
	return [GATEWAY_ENVIRONMENT, ...listKnownNodes(catalog).map(summarizeNodeEnvironment)];
}
function listWorkerEnvironments(context) {
	try {
		return context.workerEnvironmentService?.list() ?? [];
	} catch {
		return [];
	}
}
function listWorkerProfiles(context) {
	if (!context.workerEnvironmentService || !context.workerPlacementDispatchService) return [];
	const profiles = context.getRuntimeConfig().cloudWorkers?.profiles ?? {};
	return Object.entries(profiles).flatMap(([id, profile]) => {
		const providerId = typeof profile.provider === "string" ? profile.provider.trim() : "";
		return id.trim() && providerId ? [{
			id: id.trim(),
			providerId
		}] : [];
	}).toSorted((left, right) => left.id.localeCompare(right.id));
}
async function respondWorkerMutation(respond, run, invalidCodes, unavailableMessage) {
	try {
		respond(true, summarizeWorkerEnvironment(await run()), void 0);
	} catch (error) {
		const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
		const invalid = typeof code === "string" && invalidCodes.includes(code);
		const message = invalid && error instanceof Error ? error.message : unavailableMessage;
		respond(false, void 0, errorShape(invalid ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, message));
	}
}
const environmentsHandlers = {
	"environments.list": async ({ params, respond, context }) => {
		if (!validateEnvironmentsListParams(params)) return rejectInvalid(respond, "environments.list", validateEnvironmentsListParams);
		await respondUnavailableOnThrow(respond, async () => {
			const environments = await listEnvironments(context);
			const workers = listWorkerEnvironments(context);
			const summarizedAtMs = Date.now();
			environments.push(...workers.map((record) => summarizeWorkerEnvironment(record, summarizedAtMs)));
			const profiles = listWorkerProfiles(context);
			respond(true, {
				environments,
				...profiles.length > 0 ? { profiles } : {}
			}, void 0);
		});
	},
	"environments.status": async ({ params, respond, context }) => {
		if (!validateEnvironmentsStatusParams(params)) return rejectInvalid(respond, "environments.status", validateEnvironmentsStatusParams);
		await respondUnavailableOnThrow(respond, async () => {
			const environment = (await listEnvironments(context)).find((entry) => entry.id === params.environmentId);
			if (environment) {
				respond(true, environment, void 0);
				return;
			}
			let worker;
			try {
				worker = context.workerEnvironmentService?.get(params.environmentId);
			} catch {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "environment status unavailable"));
				return;
			}
			respond(Boolean(worker), worker ? summarizeWorkerEnvironment(worker) : void 0, worker ? void 0 : errorShape(ErrorCodes.INVALID_REQUEST, "unknown environmentId"));
		});
	},
	"environments.create": async ({ params, respond, context }) => {
		if (!validateEnvironmentsCreateParams(params)) return rejectInvalid(respond, "environments.create", validateEnvironmentsCreateParams);
		const service = context.workerEnvironmentService;
		if (!service) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "cloud worker environments are not configured"));
			return;
		}
		await respondWorkerMutation(respond, () => service.create(params.profileId, params.idempotencyKey), ["profile_not_found", "invalid_profile"], "worker environment creation failed");
	},
	"environments.destroy": async ({ params, respond, context }) => {
		if (!validateEnvironmentsDestroyParams(params)) return rejectInvalid(respond, "environments.destroy", validateEnvironmentsDestroyParams);
		const service = context.workerEnvironmentService;
		if (!service) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown environmentId"));
			return;
		}
		await respondWorkerMutation(respond, async () => {
			const placementService = context.workerPlacementDispatchService;
			if (params.force && !placementService?.forceDestroyEnvironment) throw new Error("cloud worker placement control is unavailable");
			const destroyed = params.force ? await placementService.forceDestroyEnvironment(params.environmentId) : await service.destroyUnattached(params.environmentId);
			try {
				await context.workerPlacementDispatchService?.reconcileActive?.(params.environmentId);
			} catch (error) {
				context.logGateway.warn(`worker placement reconciliation after destroy failed: ${formatForLog(error)}`);
			}
			return destroyed;
		}, ["environment_not_found", "invalid_state"], "worker environment destruction failed");
	}
};
//#endregion
export { environmentsHandlers, summarizeWorkerEnvironment };
