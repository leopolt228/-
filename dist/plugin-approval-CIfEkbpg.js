import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-D4mGPeue.js";
import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { d as resolvePluginApprovalTimeoutMs } from "./plugin-approvals-D2muXfhg.js";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-B7vhht0w.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { nn as validatePluginApprovalRequestParams, rn as validatePluginApprovalResolveParams } from "./src-Cy32TawB.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
import { a as handleApprovalWaitDecision, c as listVisiblePendingApprovalRequests, i as handleApprovalResolve, l as registerPendingApprovalRecord, n as bindApprovalReviewerDeviceIds, o as handlePendingApprovalRequest, r as buildRequestedApprovalEvent, s as isApprovalRecordVisibleToClient, t as bindApprovalRequesterMetadata, u as resolveApprovalDecisionParams } from "./approval-shared-BWvY7dK1.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/plugin-approval.ts
/** Create plugin approval handlers backed by the shared approval manager. */
function createPluginApprovalHandlers(manager, opts) {
	return {
		"plugin.approval.list": async ({ respond, client }) => {
			respond(true, listVisiblePendingApprovalRequests({
				manager,
				client
			}), void 0);
		},
		"plugin.approval.request": async ({ params, client, respond, context }) => {
			if (!validatePluginApprovalRequestParams(params)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid plugin.approval.request params: ${formatValidationErrors(validatePluginApprovalRequestParams.errors)}`));
				return;
			}
			const p = params;
			const twoPhase = p.twoPhase === true;
			const timeoutMs = resolvePluginApprovalTimeoutMs(p.timeoutMs);
			const normalizeTrimmedString = (value) => normalizeOptionalString(value) || null;
			const request = {
				pluginId: p.pluginId ?? null,
				title: p.title,
				description: p.description,
				severity: p.severity ?? null,
				toolName: p.toolName ?? null,
				toolCallId: p.toolCallId ?? null,
				...Array.isArray(p.allowedDecisions) ? { allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions({ allowedDecisions: p.allowedDecisions }) } : {},
				agentId: p.agentId ?? null,
				sessionKey: p.sessionKey ?? null,
				turnSourceChannel: normalizeTrimmedString(p.turnSourceChannel),
				turnSourceTo: normalizeTrimmedString(p.turnSourceTo),
				turnSourceAccountId: normalizeTrimmedString(p.turnSourceAccountId),
				turnSourceThreadId: p.turnSourceThreadId ?? null
			};
			const record = manager.create(request, timeoutMs, `plugin:${randomUUID()}`);
			bindApprovalRequesterMetadata({
				record,
				client
			});
			if (client?.internal?.approvalRuntime === true) bindApprovalReviewerDeviceIds({
				record,
				deviceIds: p.approvalReviewerDeviceIds
			});
			const decisionPromise = registerPendingApprovalRecord({
				manager,
				record,
				timeoutMs,
				respond,
				context
			});
			if (!decisionPromise) return;
			const requestEvent = buildRequestedApprovalEvent(record);
			await handlePendingApprovalRequest({
				manager,
				record,
				decisionPromise,
				respond,
				context,
				clientConnId: client?.connId,
				requestEventName: "plugin.approval.requested",
				requestEvent,
				twoPhase,
				approvalKind: "plugin",
				deliverRequest: () => {
					const deliveryTasks = [];
					if (opts?.forwarder?.handlePluginApprovalRequested) deliveryTasks.push(opts.forwarder.handlePluginApprovalRequested(requestEvent).catch((err) => {
						context.logGateway?.error?.(`plugin approvals: forward request failed: ${String(err)}`);
						return false;
					}));
					if (opts?.iosPushDelivery?.handleRequested) deliveryTasks.push(opts.iosPushDelivery.handleRequested(requestEvent, { isTargetVisible: (target) => isApprovalRecordVisibleToClient({
						record,
						client: { connect: {
							client: { id: GATEWAY_CLIENT_IDS.IOS_APP },
							device: { id: target.deviceId },
							scopes: [...target.scopes]
						} }
					}) }).catch((err) => {
						context.logGateway?.error?.(`plugin approvals: iOS push request failed: ${String(err)}`);
						return false;
					}));
					if (deliveryTasks.length === 0) return false;
					return (async () => {
						let delivered = false;
						for (const task of deliveryTasks) delivered = await task || delivered;
						return delivered;
					})();
				},
				afterDecision: async (decision) => {
					if (decision === null) await opts?.iosPushDelivery?.handleExpired?.(requestEvent);
				},
				afterDecisionErrorLabel: "plugin approvals: iOS push expire failed"
			});
		},
		"plugin.approval.waitDecision": async ({ params, respond, client }) => {
			await handleApprovalWaitDecision({
				manager,
				inputId: params.id,
				client,
				respond
			});
		},
		"plugin.approval.resolve": async ({ params, respond, client, context }) => {
			const resolveParams = resolveApprovalDecisionParams({
				rawParams: params,
				validate: validatePluginApprovalResolveParams,
				methodName: "plugin.approval.resolve",
				respond
			});
			if (!resolveParams) return;
			const { inputId, decision } = resolveParams;
			await handleApprovalResolve({
				approvalKind: "plugin",
				manager,
				inputId,
				decision,
				respond,
				context,
				client,
				exposeAmbiguousPrefixError: false,
				validateDecision: (snapshot) => resolveCanonicalPluginApprovalRequestAllowedDecisions(snapshot.request).includes(decision) ? null : {
					message: `${decision} is unavailable for this plugin approval`,
					details: { allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions(snapshot.request) }
				},
				resolvedEventName: "plugin.approval.resolved",
				buildResolvedEvent: ({ approvalId, decision: decisionLocal, resolvedBy, snapshot, nowMs }) => ({
					id: approvalId,
					decision: decisionLocal,
					resolvedBy,
					ts: nowMs,
					request: snapshot.request
				}),
				forwardResolved: (resolvedEvent) => opts?.forwarder?.handlePluginApprovalResolved?.(resolvedEvent),
				forwardResolvedErrorLabel: "plugin approvals: forward resolve failed",
				extraResolvedHandlers: opts?.iosPushDelivery?.handleResolved ? [{
					run: (resolvedEvent) => opts.iosPushDelivery.handleResolved(resolvedEvent),
					errorLabel: "plugin approvals: iOS push resolve failed"
				}] : void 0
			});
		}
	};
}
//#endregion
export { createPluginApprovalHandlers };
