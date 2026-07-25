import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-CThCRo6Z.js";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-D4mGPeue.js";
import "./version-CwNT1gaY.js";
import { n as GatewayClientRequestError } from "./client-U9ekE9wL.js";
import "./method-scopes-DN3UnWnt.js";
import "./operator-scopes-BHrNTqoH.js";
import { c as getActivePluginRegistry } from "./runtime-BapEso0o.js";
import { r as isKnownCoreToolId } from "./tool-catalog-Bi5DGU0C.js";
import { m as normalizeToolName } from "./tool-policy-GYMCyycR.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-in-process-dispatch.ts
function unwrapGatewayMethodDispatchResponse(method, response) {
	if (!response.ok) throw new GatewayClientRequestError({
		code: response.error?.code,
		message: response.error?.message ?? `Gateway method "${method}" failed.`,
		details: response.error?.details,
		retryable: response.error?.retryable,
		retryAfterMs: response.error?.retryAfterMs
	});
	return response.payload;
}
function resolveDispatchDeadlineMs(timeoutMs) {
	if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs)) return;
	return Date.now() + resolveSafeTimeoutDelayMs(timeoutMs);
}
function resolveRemainingDispatchTimeoutMs(deadlineMs) {
	return deadlineMs === void 0 ? void 0 : resolveSafeTimeoutDelayMs(deadlineMs - Date.now(), { minMs: 0 });
}
async function waitForDispatch(method, promise, deadlineMs) {
	const remainingTimeoutMs = resolveRemainingDispatchTimeoutMs(deadlineMs);
	if (remainingTimeoutMs === void 0) return await promise;
	let timeout;
	try {
		return await Promise.race([promise, new Promise((_resolve, reject) => {
			timeout = setTimeout(() => {
				reject(/* @__PURE__ */ new Error(`gateway request timeout for ${method}`));
			}, remainingTimeoutMs);
		})]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
/** Dispatches one request through the ordinary Gateway router without opening a transport. */
async function dispatchGatewayRequestInProcessRaw(method, params, options) {
	let firstResponse;
	let finalResponse;
	let resolveFirstResponse;
	let rejectFirstResponse;
	let resolveFinalResponse;
	let rejectFinalResponse;
	let postFirstResponseError;
	const firstResponsePromise = new Promise((resolve, reject) => {
		resolveFirstResponse = resolve;
		rejectFirstResponse = reject;
	});
	const deadlineMs = resolveDispatchDeadlineMs(options.timeoutMs);
	const { handleGatewayRequest } = await import("./server-methods-BErTop9A.js");
	handleGatewayRequest({
		req: {
			type: "req",
			id: `${options.requestIdPrefix ?? "in-process"}-${randomUUID()}`,
			method,
			params
		},
		client: options.client,
		isWebchatConnect: options.isWebchatConnect ?? (() => false),
		respond: (ok, payload, error, meta) => {
			const response = {
				ok,
				payload,
				error,
				...meta ? { meta } : {}
			};
			if (!firstResponse) {
				firstResponse = response;
				resolveFirstResponse?.(response);
				return;
			}
			if (!finalResponse) {
				finalResponse = response;
				resolveFinalResponse?.(response);
			}
		},
		context: options.context,
		methodRegistry: options.methodRegistry
	}).then(() => {
		if (!firstResponse) rejectFirstResponse?.(/* @__PURE__ */ new Error(`Gateway method "${method}" completed without a response.`));
	}).catch((err) => {
		const error = err instanceof Error ? err : new Error(String(err));
		if (!firstResponse) {
			rejectFirstResponse?.(error);
			return;
		}
		postFirstResponseError = error;
		rejectFinalResponse?.(error);
	});
	firstResponse = await waitForDispatch(method, firstResponsePromise, deadlineMs);
	const firstPayload = firstResponse.payload;
	if (options.expectFinal !== true || firstPayload?.status !== "accepted") return firstResponse;
	options.onAccepted?.(firstResponse.payload);
	if (postFirstResponseError) throw postFirstResponseError;
	return finalResponse ?? await new Promise((resolve, reject) => {
		resolveFinalResponse = resolve;
		const timeoutMs = resolveRemainingDispatchTimeoutMs(deadlineMs);
		const timeout = timeoutMs === void 0 ? void 0 : setTimeout(() => reject(/* @__PURE__ */ new Error(`gateway request timeout for ${method}`)), timeoutMs);
		const clearFinalTimeout = () => {
			if (timeout) clearTimeout(timeout);
		};
		rejectFinalResponse = (err) => {
			clearFinalTimeout();
			reject(err);
		};
		if (postFirstResponseError) {
			rejectFinalResponse(postFirstResponseError);
			return;
		}
		if (finalResponse) {
			clearFinalTimeout();
			resolve(finalResponse);
			return;
		}
		resolveFinalResponse = (response) => {
			clearFinalTimeout();
			resolve(response);
		};
	});
}
async function dispatchGatewayRequestInProcess(method, params, options) {
	return unwrapGatewayMethodDispatchResponse(method, await dispatchGatewayRequestInProcessRaw(method, params, options));
}
//#endregion
//#region src/gateway/server-plugin-runtime-client.ts
function createSyntheticPluginRuntimeClient(params) {
	const pluginRuntimeOwnerId = typeof params?.pluginRuntimeOwnerId === "string" && params.pluginRuntimeOwnerId.trim() ? params.pluginRuntimeOwnerId.trim() : void 0;
	return {
		connect: {
			minProtocol: 4,
			maxProtocol: 4,
			client: {
				id: GATEWAY_CLIENT_IDS.GATEWAY_CLIENT,
				version: "internal",
				platform: "node",
				mode: GATEWAY_CLIENT_MODES.BACKEND
			},
			role: "operator",
			scopes: params?.scopes ?? ["operator.write"]
		},
		internal: {
			allowModelOverride: params?.allowModelOverride === true,
			...params?.agentRunTracking ? { agentRunTracking: params.agentRunTracking } : {},
			...params?.cronRunContinuation === true ? { cronRunContinuation: true } : {},
			...params?.internalDeliveryMediaUrls ? { internalDeliveryMediaUrls: [...params.internalDeliveryMediaUrls] } : {},
			...params?.internalDeliverySuppressText === true ? { internalDeliverySuppressText: true } : {},
			...params?.scopes?.includes("operator.approvals") ? { approvalRuntime: true } : {},
			...pluginRuntimeOwnerId ? { pluginRuntimeOwnerId } : {},
			...params?.runtimePluginToolGrant ? { runtimePluginToolGrant: params.runtimePluginToolGrant } : {}
		}
	};
}
function mergePluginRuntimeClientInternal(client, internal) {
	if (!client || !internal) return client ?? null;
	return {
		...client,
		internal: {
			...client.internal,
			...internal
		}
	};
}
function resolvePluginSubagentToolsAlsoAllow(params) {
	const requested = uniqueStrings((params.toolsAlsoAllow ?? []).map((entry) => normalizeToolName(entry.trim())).filter(Boolean));
	if (requested.length === 0) return;
	const pluginId = params.pluginId?.trim();
	if (!pluginId) throw new Error("toolsAlsoAllow requires plugin identity for subagent runs.");
	const registry = getActivePluginRegistry();
	for (const toolName of requested) {
		if (isKnownCoreToolId(toolName)) throw new Error(`plugin "${pluginId}" may not add core tool "${toolName}" to subagent runs.`);
		const owners = uniqueStrings((registry?.tools ?? []).filter((registration) => [...registration.names, ...registration.declaredNames ?? []].some((registeredName) => normalizeToolName(registeredName) === toolName)).map((registration) => registration.pluginId));
		if (owners.length !== 1 || owners[0] !== pluginId) throw new Error(`plugin "${pluginId}" does not uniquely own subagent tool "${toolName}".`);
	}
	return {
		pluginId,
		toolNames: requested
	};
}
//#endregion
export { dispatchGatewayRequestInProcessRaw as a, dispatchGatewayRequestInProcess as i, mergePluginRuntimeClientInternal as n, unwrapGatewayMethodDispatchResponse as o, resolvePluginSubagentToolsAlsoAllow as r, createSyntheticPluginRuntimeClient as t };
