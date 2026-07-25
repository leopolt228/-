import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import "./runtime-env-BDC_axp1.js";
import { t as buildChannelApprovalNativeTargetKey } from "./approval-native-target-key-CcEHFoK3.js";
import { r as createChannelApprovalNativeRuntimeAdapter } from "./approval-handler-runtime-Dvm9QZ5c.js";
import { n as buildChannelApprovalResolvedText, r as resolvePreparedApprovalAccountId, t as buildChannelApprovalExpiredText } from "./approval-handler-runtime-VLFcJCym.js";
import "./approval-native-runtime-Baif6NGb.js";
import { a as buildApprovalReactionPendingContent } from "./approval-reaction-runtime-B4geGQ46.js";
import { c as parseIMessageTarget } from "./targets-B8U82l9l.js";
import { d as registerIMessageApprovalReactionTarget, h as unregisterIMessageApprovalReactionTarget, i as buildIMessageApprovalConversationKeyForTarget } from "./approval-reactions-B8WHau0l.js";
import { n as normalizeIMessageMessagingTarget } from "./normalize-C1AFiHzw.js";
import { t as sendMessageIMessage } from "./send-VJ9oXK7X.js";
//#region extensions/imessage/src/approval-handler.runtime.ts
const log = createSubsystemLogger("imessage/approvals");
function buildPendingPayload(params) {
	const pendingContent = buildApprovalReactionPendingContent({
		request: params.request,
		view: params.view,
		nowMs: params.nowMs
	});
	return {
		text: pendingContent.reactionPayload.text ?? "",
		allowedDecisions: pendingContent.reactionPayload.allowedDecisions
	};
}
function shouldThreadApprovalUpdate(to) {
	try {
		const parsed = parseIMessageTarget(to);
		if (parsed.kind === "handle" && parsed.service === "sms") return false;
	} catch {
		return true;
	}
	return true;
}
const imessageApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapter({
	eventKinds: ["exec", "plugin"],
	availability: {
		isConfigured: ({ context }) => Boolean(context),
		shouldHandle: ({ context }) => Boolean(context)
	},
	presentation: {
		buildPendingPayload: ({ request, approvalKind, nowMs, view }) => buildPendingPayload({
			request,
			approvalKind,
			nowMs,
			view
		}),
		buildResolvedResult: ({ request, resolved, view }) => ({
			kind: "update",
			payload: { text: buildChannelApprovalResolvedText({
				request,
				resolved,
				view
			}) }
		}),
		buildExpiredResult: ({ request, view }) => ({
			kind: "update",
			payload: { text: buildChannelApprovalExpiredText({
				request,
				view
			}) }
		})
	},
	transport: {
		prepareTarget: ({ plannedTarget, accountId }) => {
			const to = normalizeIMessageMessagingTarget(plannedTarget.target.to);
			if (!to) return null;
			const prepared = {
				to,
				accountId: resolvePreparedApprovalAccountId({
					plannedAccountId: plannedTarget.target.accountId,
					contextAccountId: accountId
				})
			};
			return {
				dedupeKey: `${prepared.accountId ?? ""}:${buildChannelApprovalNativeTargetKey({ to: prepared.to })}`,
				target: prepared
			};
		},
		deliverPending: async ({ cfg, preparedTarget, pendingPayload, view }) => {
			const guid = (await sendMessageIMessage(preparedTarget.to, pendingPayload.text, {
				config: cfg,
				approvalKind: view.approvalKind,
				...preparedTarget.accountId ? { accountId: preparedTarget.accountId } : {}
			})).guid;
			if (!guid) return null;
			const conversation = buildIMessageApprovalConversationKeyForTarget(preparedTarget.to);
			if (!conversation) return null;
			return {
				...preparedTarget.accountId ? { accountId: preparedTarget.accountId } : {},
				to: preparedTarget.to,
				conversation,
				messageId: guid
			};
		},
		updateEntry: async ({ cfg, entry, payload }) => {
			await sendMessageIMessage(entry.to, payload.text, {
				config: cfg,
				...entry.accountId ? { accountId: entry.accountId } : {},
				...shouldThreadApprovalUpdate(entry.to) ? { replyToId: entry.messageId } : {}
			});
		}
	},
	interactions: {
		bindPending: ({ entry, request, view, pendingPayload }) => {
			const accountId = entry.accountId?.trim();
			if (!accountId) {
				log.error(`imessage approvals: refusing to bind reaction target for ${request.id}; missing accountId in prepared entry`);
				return null;
			}
			const ttlMs = view.expiresAtMs - Date.now();
			if (ttlMs <= 0) {
				log.error(`imessage approvals: refusing to bind reaction target for ${request.id}; approval already expired at bind time`);
				return null;
			}
			return registerIMessageApprovalReactionTarget({
				accountId,
				conversation: entry.conversation,
				messageId: entry.messageId,
				approvalId: request.id,
				approvalKind: view.approvalKind,
				allowedDecisions: pendingPayload.allowedDecisions,
				ttlMs
			}) ? true : null;
		},
		unbindPending: ({ entry }) => {
			const accountId = entry.accountId?.trim();
			if (!accountId) return;
			unregisterIMessageApprovalReactionTarget({
				accountId,
				conversation: entry.conversation,
				messageId: entry.messageId
			});
		},
		cancelDelivered: ({ entry }) => {
			const accountId = entry.accountId?.trim();
			if (!accountId) return;
			unregisterIMessageApprovalReactionTarget({
				accountId,
				conversation: entry.conversation,
				messageId: entry.messageId
			});
		}
	},
	observe: { onDeliveryError: ({ error, request }) => {
		log.error(`imessage approvals: failed to send request ${request.id}: ${String(error)}`);
	} }
});
//#endregion
export { imessageApprovalNativeRuntime };
