import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { r as normalizeControlUiBasePath } from "./control-ui-shared-BqBD1Err.js";
import { n as isWellFormedApprovalId } from "./approval-id-BTRnO3t1.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { g as validateApprovalResolveParams, m as validateApprovalHistoryParams, p as validateApprovalGetParams } from "./src-Cy32TawB.js";
import { o as getOperatorApprovalDetailed, s as getOperatorApprovalDetailedByLocator, t as OperatorApprovalHistoryCursorError, u as listTerminalOperatorApprovals } from "./operator-approval-store-DgskoN7_.js";
import { n as canResolveOperatorApproval, r as canReviewOperatorApproval, t as canAccessOperatorApproval } from "./operator-approval-authorization-CrxlK5WB.js";
import { t as publishAppliedApprovalResolution } from "./approval-publication-CVeG4EJY.js";
//#region src/gateway/server-methods/approval.ts
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function buildApprovalSnapshot(record, controlUiBasePath) {
	const common = {
		id: record.id,
		status: record.status,
		presentation: record.presentation,
		urlPath: `${controlUiBasePath}/approve/${encodeURIComponent(record.id)}`,
		createdAtMs: record.createdAtMs,
		expiresAtMs: record.expiresAtMs
	};
	if (record.status === "pending") return common;
	if (record.resolvedAtMs === null || record.terminalReason === null) return null;
	const terminal = {
		...common,
		resolvedAtMs: record.resolvedAtMs,
		reason: record.terminalReason,
		source: {
			...record.source.agentId ? { agentId: record.source.agentId } : {},
			...record.source.sessionKey ? { sessionKey: record.source.sessionKey } : {}
		},
		...record.resolver ? { resolver: {
			kind: record.resolver.kind,
			...record.resolver.id ? { id: record.resolver.id } : {}
		} } : {}
	};
	if (record.status === "allowed") {
		if (record.decision !== "allow-once" && record.decision !== "allow-always") return null;
		return {
			...terminal,
			decision: record.decision
		};
	}
	if (record.status === "denied") return {
		...terminal,
		decision: "deny"
	};
	return terminal;
}
function resolveApprovalResolver(client) {
	const deviceId = normalizeOptionalString(client?.connect?.device?.id);
	if (deviceId) return {
		kind: "device",
		id: deviceId
	};
	return {
		kind: "runtime",
		id: normalizeOptionalString(client?.connect?.client?.id) ?? null
	};
}
function resolveLegacyApprovalLabel(client) {
	return normalizeOptionalString(client?.connect?.client?.displayName) ?? normalizeOptionalString(client?.connect?.client?.id) ?? null;
}
function respondApprovalNotFound(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval not found", { details: { reason: ErrorCodes.APPROVAL_NOT_FOUND } }));
}
function respondApprovalUnavailable(params) {
	params.context.logGateway?.error?.(`approval ${params.operation} storage failure: ${String(params.error)}`);
	params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `approval ${params.operation} unavailable`));
}
function readExactApprovalId(params) {
	if (!isRecord(params) || typeof params.id !== "string") return null;
	const id = params.id;
	return isWellFormedApprovalId(id) ? id : null;
}
function loadVisibleApproval(params) {
	if (!(params.allowApprovalRuntime ? canResolveOperatorApproval(params.client) : canReviewOperatorApproval(params.client))) return null;
	const liveRecord = params.execApprovalManager.getLiveSnapshot(params.id) ?? params.pluginApprovalManager.getLiveSnapshot(params.id) ?? params.systemAgentApprovalManager?.getLiveSnapshot(params.id);
	if (liveRecord && !canAccessOperatorApproval({
		client: params.client,
		allowApprovalRuntime: params.allowApprovalRuntime,
		binding: { reviewerDeviceIds: liveRecord.approvalReviewerDeviceIds }
	})) return null;
	let lookup;
	try {
		lookup = params.allowTransportRef ? getOperatorApprovalDetailedByLocator({
			locator: params.id,
			databaseOptions: params.databaseOptions
		}) : getOperatorApprovalDetailed({
			id: params.id,
			databaseOptions: params.databaseOptions
		});
	} catch (error) {
		const corrupt = {
			outcome: "corrupt",
			id: params.id
		};
		params.execApprovalManager.reconcileDurableLookup(corrupt);
		params.pluginApprovalManager.reconcileDurableLookup(corrupt);
		params.systemAgentApprovalManager?.reconcileDurableLookup(corrupt);
		throw error;
	}
	if (lookup.outcome === "found") {
		if (!canAccessOperatorApproval({
			client: params.client,
			allowApprovalRuntime: params.allowApprovalRuntime,
			binding: { reviewerDeviceIds: lookup.record.reviewerDeviceIds }
		})) return null;
		return (lookup.record.kind === "exec" ? params.execApprovalManager : lookup.record.kind === "plugin" ? params.pluginApprovalManager : params.systemAgentApprovalManager)?.reconcileDurableLookup(lookup) ?? null;
	}
	const missing = {
		outcome: lookup.outcome === "corrupt" ? "corrupt" : "missing",
		id: lookup.outcome === "corrupt" ? lookup.id ?? params.id : params.id
	};
	params.execApprovalManager.reconcileDurableLookup(missing);
	params.pluginApprovalManager.reconcileDurableLookup(missing);
	params.systemAgentApprovalManager?.reconcileDurableLookup(missing);
	return null;
}
function resolveLiveRecord(params) {
	return params.liveRecord ?? params.manager.getLiveSnapshot(params.id) ?? void 0;
}
function applyForcedDeny(params) {
	const result = params.manager.forceDenyDetailed(params.id, "malformed-verdict", params.resolver, "denied", void 0, false, params.localResolvedBy);
	switch (result.outcome) {
		case "denied": return {
			ok: true,
			applied: true,
			record: result.record,
			liveRecord: resolveLiveRecord({
				manager: params.manager,
				id: params.id,
				liveRecord: result.liveRecord
			})
		};
		case "expired":
		case "already-terminal":
		case "not-due": return {
			ok: true,
			applied: false,
			record: result.record,
			liveRecord: result.liveRecord
		};
		case "not-found":
		case "corrupt": return { ok: false };
	}
	return result;
}
function applyApprovalDecision(params) {
	if (params.forceMalformedDeny) return applyForcedDeny(params);
	const result = params.manager.resolveDetailed(params.id, params.decision, params.resolver, params.localResolvedBy);
	switch (result.outcome) {
		case "resolved": return {
			ok: true,
			applied: true,
			record: result.record,
			liveRecord: resolveLiveRecord({
				manager: params.manager,
				id: params.id,
				liveRecord: result.liveRecord
			})
		};
		case "expired":
		case "already-resolved": return {
			ok: true,
			applied: false,
			record: result.record,
			liveRecord: result.liveRecord
		};
		case "decision-not-allowed": return applyForcedDeny(params);
		case "not-found":
		case "corrupt": return { ok: false };
	}
	return result;
}
/** Creates kind-agnostic approval lookup and resolution handlers. */
function createApprovalHandlers(params) {
	return {
		"approval.history": ({ params: rawParams, respond, context }) => {
			if (!validateApprovalHistoryParams(rawParams)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid approval.history params"));
				return;
			}
			const historyParams = rawParams;
			let history;
			try {
				history = listTerminalOperatorApprovals({
					cursor: historyParams.cursor,
					limit: historyParams.limit,
					kind: historyParams.kind,
					databaseOptions: params.databaseOptions
				});
			} catch (error) {
				if (error instanceof OperatorApprovalHistoryCursorError) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid approval.history cursor"));
					return;
				}
				respondApprovalUnavailable({
					context,
					respond,
					operation: "history",
					error
				});
				return;
			}
			const controlUiBasePath = normalizeControlUiBasePath(context.getRuntimeConfig()?.gateway?.controlUi?.basePath);
			respond(true, {
				items: history.records.flatMap((record) => {
					const snapshot = buildApprovalSnapshot(record, controlUiBasePath);
					return snapshot && snapshot.status !== "pending" ? [snapshot] : [];
				}),
				...history.nextCursor ? { nextCursor: history.nextCursor } : {}
			}, void 0);
		},
		"approval.get": ({ params: rawParams, respond, client, context }) => {
			if (!validateApprovalGetParams(rawParams)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid approval.get params"));
				return;
			}
			const id = readExactApprovalId(rawParams);
			let record;
			try {
				record = id ? loadVisibleApproval({
					id,
					client,
					execApprovalManager: params.execApprovalManager,
					pluginApprovalManager: params.pluginApprovalManager,
					systemAgentApprovalManager: params.systemAgentApprovalManager,
					databaseOptions: params.databaseOptions
				}) : null;
			} catch (error) {
				respondApprovalUnavailable({
					context,
					respond,
					operation: "lookup",
					error
				});
				return;
			}
			const controlUiBasePath = normalizeControlUiBasePath(context.getRuntimeConfig()?.gateway?.controlUi?.basePath);
			const approval = record ? buildApprovalSnapshot(record, controlUiBasePath) : null;
			if (!approval) {
				respondApprovalNotFound(respond);
				return;
			}
			respond(true, { approval }, void 0);
		},
		"approval.resolve": async ({ params: rawParams, respond, client, context }) => {
			const id = readExactApprovalId(rawParams);
			let record;
			try {
				record = id ? loadVisibleApproval({
					id,
					client,
					allowApprovalRuntime: true,
					allowTransportRef: true,
					execApprovalManager: params.execApprovalManager,
					pluginApprovalManager: params.pluginApprovalManager,
					systemAgentApprovalManager: params.systemAgentApprovalManager,
					databaseOptions: params.databaseOptions
				}) : null;
			} catch (error) {
				respondApprovalUnavailable({
					context,
					respond,
					operation: "lookup",
					error
				});
				return;
			}
			if (!id || !record) {
				respondApprovalNotFound(respond);
				return;
			}
			if (record.status !== "pending") {
				const controlUiBasePath = normalizeControlUiBasePath(context.getRuntimeConfig()?.gateway?.controlUi?.basePath);
				const approval = buildApprovalSnapshot(record, controlUiBasePath);
				if (!approval || approval.status === "pending") {
					respondApprovalNotFound(respond);
					return;
				}
				respond(true, {
					applied: false,
					approval
				}, void 0);
				return;
			}
			const resolver = resolveApprovalResolver(client);
			const localResolvedBy = resolveLegacyApprovalLabel(client);
			const validParams = validateApprovalResolveParams(rawParams);
			const resolveParams = validParams ? rawParams : null;
			const requestedDecision = resolveParams?.decision ?? null;
			const decisionAllowed = requestedDecision === "deny" || requestedDecision !== null && record.presentation.allowedDecisions.includes(requestedDecision);
			const kindMatches = resolveParams?.kind === record.presentation.kind;
			const forceMalformedDeny = !validParams || !kindMatches || !decisionAllowed;
			let resolution;
			try {
				resolution = record.kind === "exec" ? applyApprovalDecision({
					manager: params.execApprovalManager,
					id: record.id,
					decision: requestedDecision,
					forceMalformedDeny,
					resolver,
					localResolvedBy
				}) : record.kind === "plugin" ? applyApprovalDecision({
					manager: params.pluginApprovalManager,
					id: record.id,
					decision: requestedDecision,
					forceMalformedDeny,
					resolver,
					localResolvedBy
				}) : applyApprovalDecision({
					manager: params.systemAgentApprovalManager,
					id: record.id,
					decision: requestedDecision,
					forceMalformedDeny,
					resolver,
					localResolvedBy
				});
			} catch (error) {
				respondApprovalUnavailable({
					context,
					respond,
					operation: "resolve",
					error
				});
				return;
			}
			if (!resolution.ok) {
				respondApprovalNotFound(respond);
				return;
			}
			const terminalRecord = resolution.record;
			if (terminalRecord.status === "pending") {
				respondApprovalNotFound(respond);
				return;
			}
			const approval = buildApprovalSnapshot(terminalRecord, normalizeControlUiBasePath(context.getRuntimeConfig()?.gateway?.controlUi?.basePath));
			if (!approval) {
				respondApprovalNotFound(respond);
				return;
			}
			respond(true, {
				applied: resolution.applied,
				approval
			}, void 0);
			if (resolution.applied && resolution.liveRecord) publishAppliedApprovalResolution({
				record: terminalRecord,
				liveRecord: resolution.liveRecord,
				context,
				forwarder: params.forwarder,
				iosPushDelivery: params.iosPushDelivery,
				pluginIosPushDelivery: params.pluginIosPushDelivery
			}).catch((error) => {
				context.logGateway?.error?.(`${terminalRecord.kind} approvals: unified resolve publication failed: ${String(error)}`);
			});
		}
	};
}
//#endregion
export { createApprovalHandlers };
