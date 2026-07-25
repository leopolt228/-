import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { x as resolveStateDir } from "./paths-CHQRdQZ3.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { t as retryAsync } from "./retry-Cn-q-rcX.js";
import "./agent-scope-CrBA-6Gx.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-Drrs61Fd.js";
import { o as resolveAgentWorkspaceDir } from "./agent-scope-config-S7z_Yn4H.js";
import { n as GatewayClientRequestError } from "./client-U9ekE9wL.js";
import { m as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-CLw1UuhK.js";
import { _ as listAgentRunsForSession, p as getAgentEventLifecycleGeneration } from "./agent-events-Dg0sI2pr.js";
import { n as deliveryContextFromSession, o as normalizeDeliveryContext } from "./delivery-context.shared-D6zu5SGz.js";
import { o as resolveSessionTranscriptPathInDir, r as resolveSessionFilePath } from "./paths-BpMRJ7TJ.js";
import { Nt as listSessionEntriesByStatus, rt as applySessionEntryReplacements, u as persistSessionTranscriptTurn, vt as loadExactSessionEntry, yt as loadSessionEntry } from "./session-accessor-Mu3lv_Tl.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-DYDkUiW3.js";
import "./message-channel-CkiwT4Uh.js";
import { o as resolveAllAgentSessionStoreTargetsSync } from "./targets-DhNEpENL.js";
import { At as cancelSessionWorkAdmissionHandoff, _ as resolveRestartRecoveryChannelAuthority, bt as beginSessionWorkAdmission, d as buildRestartRecoveryClaimCleanupPatch, h as hasRestartRecoveryTerminalRun } from "./store-DDuGv_UJ.js";
import { t as resolveAgentSessionDirs } from "./session-dirs-D4v_ujH0.js";
import { t as ensureRuntimePluginsLoaded } from "./runtime-plugins-C2HQO8GV.js";
import { f as listActiveEmbeddedRunSessionIds, p as listActiveEmbeddedRunSessionKeys } from "./run-state-D28kFtJW.js";
import { i as isSilentReplyPayloadText, n as SILENT_REPLY_TOKEN } from "./tokens-DKI4eGAu.js";
import "./sessions-Uqhj6EXw.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-Vx3ij-ME.js";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-vdi-rYV7.js";
import { n as MAIN_SESSION_RESTART_RECOVERY_SOURCE_TOOL } from "./input-provenance-B6vSIOBi.js";
import { s as readSessionMessagesAsync } from "./session-transcript-readers-DSb8L-vG.js";
import { h as resolveGatewaySessionStoreTarget } from "./session-utils-CEU0rCPC.js";
import { i as buildRunUserTurnIdempotencyKey } from "./user-turn-transcript-Dums4a4X.js";
import "./code-mode-control-tools-Byyzl1H3.js";
import { o as sanitizePendingFinalDeliveryText } from "./pending-final-delivery-C3iA5iUb.js";
import { n as buildMainSessionRecoveryClearPatch } from "./main-session-recovery-clear-BngYLTap.js";
import { n as isMainSessionRecoveryExhausted, r as transitionMainSessionRecovery, t as isMainRestartRecoveryCandidate } from "./main-session-recovery-state-CTVh5Ed7.js";
import { r as commitMainSessionRecovery } from "./main-session-recovery-store-Dr0yGqam.js";
import { t as isTrustedMessageActionTurnIngress } from "./message-action-turn-capability-BcyILfBH.js";
import { n as findRestartRecoveryUnsafeReplyHook } from "./restart-recovery-hook-safety-Co3AFwp5.js";
import { n as resolveSendPolicy } from "./send-policy-DYCRpCMq.js";
import { t as scheduleMainSessionRecoveryPendingTarget } from "./main-session-recovery-owner-release-CKDi4nci.js";
import { n as scheduleAdmittedRecoveryRestore, t as restoreAdmittedRecoveryWithRetries } from "./main-session-recovery-restore-CaM__oRH.js";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/main-session-restart-claim.ts
function matchesExpectedRestartRecoveryClaim(entry, expected) {
	return Boolean(entry && entry.sessionId === expected.sessionId && entry.status === "running" && entry.abortedLastRun === true && normalizeOptionalString(entry.restartRecoveryDeliveryRunId) === expected.recoveryRunId && normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) === expected.recoverySourceRunId);
}
function loadExpectedRestartRecoveryClaim(params) {
	const exact = loadExactSessionEntry({
		readConsistency: "latest",
		sessionKey: params.expected.sessionKey,
		storePath: params.storePath
	});
	return exact?.sessionKey === params.expected.sessionKey && matchesExpectedRestartRecoveryClaim(exact.entry, params.expected) ? exact.entry : void 0;
}
function buildUnresumableSessionNoticeIdempotencyKey(entry) {
	return `main-session-restart-recovery:${normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) ?? normalizeOptionalString(entry.restartRecoveryDeliveryRunId) ?? entry.sessionId}:failed-notice`;
}
//#endregion
//#region src/agents/main-session-restart-dispatch.ts
const log$2 = createSubsystemLogger("main-session-restart-recovery");
const RESERVATION_ROLLBACK_RETRY_DELAY_MS = 1e3;
const RESERVATION_ROLLBACK_RETRY_MAX_DELAY_MS = 3e4;
const RESTART_RECOVERY_RESUME_MESSAGE = "[System] Your previous turn was interrupted by a gateway restart while OpenClaw was waiting on tool/model work. Continue from the existing transcript and finish the interrupted response.";
function normalizeFiniteTimestamp$1(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function hasRestartRecoveryMessageActionAuthority(entry) {
	const authority = resolveRestartRecoveryChannelAuthority(entry);
	return authority !== void 0 && isTrustedMessageActionTurnIngress(authority.deliveryContext.channel);
}
/** Internal continuations never inherit channel authority; every other message-tool recovery must. */
function requiresRestartRecoveryMessageActionAuthority(entry) {
	return entry.restartRecoverySourceReplyDeliveryMode === "message_tool_only" && entry.restartRecoverySourceIngress !== "internal";
}
function resolveRestartRecoveryResumeBlockReason(params) {
	const beforeAgentReplyState = params.entry.restartRecoveryBeforeAgentReplyState;
	const sourceIngress = params.entry.restartRecoverySourceIngress;
	if (!(sourceIngress === void 0 && normalizeOptionalString(params.entry.restartRecoveryDeliveryRunId) !== void 0 || beforeAgentReplyState === "admitted" || beforeAgentReplyState === "continue" || beforeAgentReplyState === "handled-reply" || sourceIngress === "channel" || sourceIngress === "control-ui")) return;
	if (!params.cfg) return "pre-hook recovery runtime config is unavailable";
	try {
		const agentId = resolveAgentIdFromSessionKey(params.sessionKey);
		ensureRuntimePluginsLoaded({
			config: params.cfg,
			workspaceDir: resolveAgentWorkspaceDir(params.cfg, agentId),
			allowGatewaySubagentBinding: true
		});
	} catch {
		return "pre-hook recovery runtime plugins could not be loaded";
	}
	const unsafeHook = findRestartRecoveryUnsafeReplyHook();
	return unsafeHook ? `pre-hook recovery cannot bypass the active ${unsafeHook} hook` : void 0;
}
function buildResumeMessage(pendingFinalDeliveryText) {
	const sanitizedPendingText = typeof pendingFinalDeliveryText === "string" ? sanitizePendingFinalDeliveryText(pendingFinalDeliveryText) : "";
	if (sanitizedPendingText) return `${RESTART_RECOVERY_RESUME_MESSAGE}\n\nNote: The interrupted final reply was captured: "${sanitizedPendingText}"`;
	return RESTART_RECOVERY_RESUME_MESSAGE;
}
function resolveRestartRecoveryDeliveryContext(params) {
	const activeRunDeliveryContext = normalizeDeliveryContext(params.entry.restartRecoveryDeliveryContext);
	const hasActiveRunDeliveryClaim = normalizeOptionalString(params.entry.restartRecoveryDeliveryRunId) !== void 0;
	const deliveryContext = normalizeDeliveryContext(params.entry.pendingFinalDeliveryContext) ?? activeRunDeliveryContext ?? (params.includeSessionDeliveryFallback && !hasActiveRunDeliveryClaim ? deliveryContextFromSession(params.entry) : void 0);
	const channel = normalizeOptionalString(deliveryContext?.channel);
	const to = normalizeOptionalString(deliveryContext?.to);
	if (!channel || !to || !isDeliverableMessageChannel(channel)) return;
	if (params.cfg && resolveSendPolicy({
		cfg: params.cfg,
		entry: params.entry,
		sessionKey: params.sessionKey,
		channel,
		chatType: params.entry.chatType
	}) === "deny") return;
	return {
		...deliveryContext,
		channel,
		to
	};
}
function normalizeRestartRecoveryTerminalStatus(value) {
	return value === "error" || value === "ok" || value === "timeout" ? value : void 0;
}
async function probeRestartRecoveryTerminalStatus(runId, gatewayRuntime) {
	try {
		const result = await gatewayRuntime.waitForAgent({
			runId,
			timeoutMs: 0
		}, 2e3);
		const status = normalizeRestartRecoveryTerminalStatus(result.status);
		return status === "timeout" && typeof result.endedAt !== "number" ? void 0 : status;
	} catch {
		return;
	}
}
async function settleRestartRecoveryDispatch(params) {
	await applySessionEntryReplacements({
		sessionKeys: params.sessionKeys,
		storePath: params.storePath,
		update: (entries) => {
			const current = entries.filter(({ entry }) => entry.sessionId === params.expectedSessionId && normalizeOptionalString(entry.restartRecoveryDeliveryRunId) === params.expectedRecoveryRunId && normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) === params.expectedRecoverySourceRunId).toSorted((a, b) => (b.entry.updatedAt ?? 0) - (a.entry.updatedAt ?? 0))[0];
			if (!current) return { result: void 0 };
			const entry = current.entry;
			const now = Date.now();
			if (params.terminalStatus) {
				entry.abortedLastRun = params.terminalStatus !== "ok";
				entry.status = params.terminalStatus === "ok" ? "done" : params.terminalStatus === "timeout" ? "timeout" : "failed";
				entry.endedAt = now;
				const startedAt = normalizeFiniteTimestamp$1(entry.startedAt);
				if (startedAt !== void 0) entry.runtimeMs = Math.max(0, now - startedAt);
				entry.restartRecoveryForceSafeTools = void 0;
				Object.assign(entry, buildRestartRecoveryClaimCleanupPatch({
					entry,
					recordTerminalSource: true,
					terminalRunId: params.expectedRecoveryRunId,
					terminalSourceRunId: params.expectedRecoverySourceRunId
				}), buildMainSessionRecoveryClearPatch(entry));
			} else entry.abortedLastRun = false;
			entry.updatedAt = now;
			return {
				result: void 0,
				replacements: [{
					sessionKey: current.sessionKey,
					entry
				}]
			};
		}
	});
}
function isExactRestartRecoveryDispatchAdmission(params) {
	const entry = params.admission.entry;
	return entry?.sessionId === params.sessionId && (entry.abortedLastRun === false && normalizeOptionalString(entry.restartRecoveryDeliveryRunId) === params.recoveryRunId && entry.restartRecoveryRuns?.some((run) => run.runId === params.recoveryRunId && run.lifecycleGeneration === params.lifecycleGeneration) === true || hasRestartRecoveryTerminalRun(entry, params.recoveryRunId) && (params.terminalStatus === "ok" && entry.status === "done" || params.terminalStatus === "error" && entry.status === "failed" || params.terminalStatus === "timeout" && entry.status === "timeout"));
}
async function rollbackRestartRecoveryReservation(params) {
	return await retryAsync(async () => await commitMainSessionRecovery({
		command: {
			kind: params.kind,
			reservation: params.reservation
		},
		requireWriteSuccess: true,
		target: {
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}
	}), 3, 25);
}
function scheduleRestartRecoveryReservationRollback(params, delayMs = RESERVATION_ROLLBACK_RETRY_DELAY_MS) {
	setTimeout(() => {
		rollbackRestartRecoveryReservation(params).then(({ entry, sessionKey }) => {
			const state = entry?.mainRestartRecovery;
			if (entry?.sessionId === params.reservation.sessionId && sessionKey && entry.status === "running" && entry.abortedLastRun === true && isMainRestartRecoveryCandidate(entry, sessionKey) && state && !state.foregroundClaims && !state.reservation && !state.tombstone) scheduleMainSessionRecoveryPendingTarget({
				sessionId: entry.sessionId,
				sessionKey,
				storePath: params.storePath
			});
		}, (error) => {
			log$2.warn(`failed delayed restart recovery reservation rollback ${params.sessionKey}: ${String(error)}`);
			scheduleRestartRecoveryReservationRollback(params, Math.min(delayMs * 2, RESERVATION_ROLLBACK_RETRY_MAX_DELAY_MS));
		});
	}, delayMs).unref?.();
}
async function resumeMainSession(params) {
	const sanitizedPendingText = typeof params.pendingFinalDeliveryText === "string" ? sanitizePendingFinalDeliveryText(params.pendingFinalDeliveryText) : "";
	const deliveryContext = resolveRestartRecoveryDeliveryContext({
		cfg: params.cfg,
		entry: params.entry,
		sessionKey: params.sessionKey
	});
	const claimedRunId = normalizeOptionalString(params.entry.restartRecoveryDeliveryRunId);
	const sourceRunId = normalizeOptionalString(params.entry.restartRecoveryDeliverySourceRunId);
	if (requiresRestartRecoveryMessageActionAuthority(params.entry) && !hasRestartRecoveryMessageActionAuthority(params.entry)) {
		log$2.warn(`refusing message-tool-only recovery without channel authority: ${params.sessionKey}`);
		return "failed";
	}
	const recoveryRunId = claimedRunId && claimedRunId !== sourceRunId ? claimedRunId : randomUUID();
	const reusingRecoveryRunId = recoveryRunId === claimedRunId;
	const dispatchSessionKey = params.canonicalSessionKey ?? params.sessionKey;
	const recoverySessionKeys = Array.from(/* @__PURE__ */ new Set([dispatchSessionKey, params.sessionKey]));
	let reservation;
	let dispatchStarted = false;
	try {
		const reserved = await commitMainSessionRecovery({
			command: {
				kind: "prepare_attempt",
				attempt: params.recoveryAttempt,
				lifecycleGeneration: getAgentEventLifecycleGeneration(),
				now: Date.now(),
				observation: params.observation,
				runId: recoveryRunId
			},
			requireWriteSuccess: true,
			target: {
				sessionKey: params.sessionKey,
				storePath: params.storePath
			}
		});
		if (reserved.transition.kind !== "reserved") return "skipped";
		reservation = reserved.transition.reservation;
		if (!await applySessionEntryReplacements({
			sessionKeys: [params.sessionKey],
			storePath: params.storePath,
			update: (entries) => {
				const entry = entries.find((entry) => entry.sessionKey === params.sessionKey)?.entry;
				if (!entry || entry.sessionId !== params.entry.sessionId || entry.status !== "running" || entry.abortedLastRun !== true || normalizeOptionalString(entry.restartRecoveryDeliveryRunId) !== claimedRunId || normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) !== sourceRunId) return { result: false };
				entry.restartRecoveryDeliveryRunId = recoveryRunId;
				if (params.forceRestartSafeTools) entry.restartRecoveryForceSafeTools = true;
				entry.updatedAt = Date.now();
				return {
					result: true,
					replacements: [{
						sessionKey: params.sessionKey,
						entry
					}]
				};
			}
		})) {
			const rollback = await rollbackRestartRecoveryReservation({
				kind: "cancel_reservation",
				reservation,
				sessionKey: params.sessionKey,
				storePath: params.storePath
			});
			reservation = void 0;
			const current = rollback.entry;
			return current?.sessionId === params.entry.sessionId && current.status === "running" && current.abortedLastRun === true && !current.mainRestartRecovery?.reservation && !current.mainRestartRecovery?.tombstone ? "failed" : "skipped";
		}
		const agentParams = {
			message: buildResumeMessage(sanitizedPendingText),
			sessionKey: dispatchSessionKey,
			expectedExistingSessionId: params.entry.sessionId,
			...params.sessionWorkAdmissionHandoffId ? { internalRuntimeHandoffId: params.sessionWorkAdmissionHandoffId } : {},
			idempotencyKey: recoveryRunId,
			deliver: Boolean(deliveryContext) && params.entry.restartRecoverySourceReplyDeliveryMode !== "message_tool_only",
			lane: "main",
			...params.entry.restartRecoverySourceReplyDeliveryMode ? { sourceReplyDeliveryMode: params.entry.restartRecoverySourceReplyDeliveryMode } : {},
			...params.forceRestartSafeTools ? { forceRestartSafeTools: true } : {},
			inputProvenance: {
				kind: "internal_system",
				sourceSessionKey: dispatchSessionKey,
				sourceTool: MAIN_SESSION_RESTART_RECOVERY_SOURCE_TOOL
			}
		};
		if (deliveryContext) {
			agentParams.channel = deliveryContext.channel;
			agentParams.to = deliveryContext.to;
			agentParams.bestEffortDeliver = true;
			if (deliveryContext.accountId) agentParams.accountId = deliveryContext.accountId;
			if (deliveryContext.threadId != null) agentParams.threadId = String(deliveryContext.threadId);
		}
		if (params.forceRestartSafeTools) log$2.info(`dispatching restart-safe recovery for ${params.sessionKey}`);
		dispatchStarted = true;
		const dispatchResult = await params.gatewayRuntime.dispatchAgent(agentParams, 1e4);
		let terminalStatus = normalizeRestartRecoveryTerminalStatus(dispatchResult.status);
		if (!terminalStatus && reusingRecoveryRunId && dispatchResult.status === "accepted") terminalStatus = await probeRestartRecoveryTerminalStatus(recoveryRunId, params.gatewayRuntime);
		const lifecycleGeneration = getAgentEventLifecycleGeneration();
		const admission = await commitMainSessionRecovery({
			command: {
				kind: "admit_recovery",
				lifecycleGeneration,
				now: Date.now(),
				runId: recoveryRunId,
				sessionId: params.entry.sessionId
			},
			target: {
				sessionKey: params.sessionKey,
				storePath: params.storePath
			}
		});
		if (admission.transition.kind !== "admitted_recovery" && !isExactRestartRecoveryDispatchAdmission({
			admission,
			lifecycleGeneration,
			recoveryRunId,
			sessionId: params.entry.sessionId,
			terminalStatus
		})) throw new Error(`restart recovery admission changed before settlement: ${params.sessionKey}`);
		await settleRestartRecoveryDispatch({
			expectedRecoveryRunId: recoveryRunId,
			expectedRecoverySourceRunId: sourceRunId,
			expectedSessionId: params.entry.sessionId,
			sessionKeys: recoverySessionKeys,
			storePath: params.storePath,
			terminalStatus
		});
		log$2.info(`resumed interrupted main session: ${params.sessionKey}${sanitizedPendingText ? " (with pending payload)" : ""}`);
		return "resumed";
	} catch (error) {
		const explicitlyRejected = error instanceof GatewayClientRequestError;
		try {
			if (dispatchStarted && !explicitlyRejected) {
				const terminalStatus = await probeRestartRecoveryTerminalStatus(recoveryRunId, params.gatewayRuntime);
				if (terminalStatus) {
					const lifecycleGeneration = getAgentEventLifecycleGeneration();
					const admission = await commitMainSessionRecovery({
						command: {
							kind: "admit_recovery",
							lifecycleGeneration,
							now: Date.now(),
							runId: recoveryRunId,
							sessionId: params.entry.sessionId
						},
						target: {
							sessionKey: params.sessionKey,
							storePath: params.storePath
						}
					});
					const exactRunAlreadyAdmitted = isExactRestartRecoveryDispatchAdmission({
						admission,
						lifecycleGeneration,
						recoveryRunId,
						sessionId: params.entry.sessionId,
						terminalStatus
					});
					if (admission.transition.kind !== "admitted_recovery" && !exactRunAlreadyAdmitted) log$2.warn(`restart recovery admission changed before settlement: ${params.sessionKey}`);
					else {
						if (reservation) await commitMainSessionRecovery({
							command: {
								kind: "abandon_reservation",
								reservation
							},
							target: {
								sessionKey: params.sessionKey,
								storePath: params.storePath
							}
						});
						await settleRestartRecoveryDispatch({
							expectedRecoveryRunId: recoveryRunId,
							expectedRecoverySourceRunId: sourceRunId,
							expectedSessionId: params.entry.sessionId,
							sessionKeys: recoverySessionKeys,
							storePath: params.storePath,
							terminalStatus
						});
						log$2.info(`settled completed restart recovery for ${params.sessionKey}`);
						return "resumed";
					}
				}
			}
		} catch (settlementError) {
			log$2.warn(`failed to settle ambiguous restart recovery ${params.sessionKey}: ${String(settlementError)}`);
			const restoreAdmittedRecovery = async () => {
				const restored = await commitMainSessionRecovery({
					command: {
						kind: "mark_admitted_recovery_interrupted",
						lifecycleGeneration: getAgentEventLifecycleGeneration(),
						now: Date.now(),
						runId: recoveryRunId,
						sessionId: params.entry.sessionId
					},
					requireWriteSuccess: true,
					target: {
						sessionKey: params.sessionKey,
						storePath: params.storePath
					}
				});
				return restored.transition.kind === "applied" && restored.entry && restored.sessionKey ? {
					sessionId: restored.entry.sessionId,
					sessionKey: restored.sessionKey,
					storePath: params.storePath
				} : void 0;
			};
			try {
				scheduleMainSessionRecoveryPendingTarget(await restoreAdmittedRecoveryWithRetries(restoreAdmittedRecovery));
			} catch (restoreError) {
				log$2.warn(`failed to restore ambiguous restart recovery ${params.sessionKey}: ${String(restoreError)}`);
				scheduleAdmittedRecoveryRestore(restoreAdmittedRecovery);
			}
		}
		if (reservation) {
			const rollbackReservation = reservation;
			await rollbackRestartRecoveryReservation({
				kind: dispatchStarted && !explicitlyRejected ? "abandon_reservation" : "cancel_reservation",
				reservation: rollbackReservation,
				sessionKey: params.sessionKey,
				storePath: params.storePath
			}).catch((rollbackError) => {
				log$2.warn(`failed to roll back interrupted main session recovery attempt ${params.sessionKey}: ${String(rollbackError)}`);
				scheduleRestartRecoveryReservationRollback({
					kind: dispatchStarted && !explicitlyRejected ? "abandon_reservation" : "cancel_reservation",
					reservation: rollbackReservation,
					sessionKey: params.sessionKey,
					storePath: params.storePath
				});
			});
		}
		log$2.warn(`failed to resume interrupted main session ${params.sessionKey}: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
		return "failed";
	}
}
//#endregion
//#region src/agents/main-session-restart-recovery-failure.ts
const log$1 = createSubsystemLogger("main-session-restart-recovery");
const TOMBSTONED_SESSION_NOTICE = "I couldn't recover this session after repeated gateway restarts. Use /new or /reset to start a replacement session.";
async function claimMainRestartRecoveryTombstone(params) {
	const claim = await commitMainSessionRecovery({
		command: {
			kind: "tombstone",
			now: Date.now(),
			observation: params.observation,
			reason: params.reason
		},
		requireWriteSuccess: true,
		target: {
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}
	});
	if (claim.transition.kind !== "tombstoned" || !claim.entry) return null;
	log$1.warn(`tombstoned main-session restart recovery: ${params.sessionKey} (${params.reason})`);
	return claim.entry;
}
async function tombstoneMainRestartRecoveryWithNotice(params) {
	const deliveryContext = resolveRestartRecoveryDeliveryContext({
		cfg: params.cfg,
		entry: params.entry,
		includeSessionDeliveryFallback: true,
		sessionKey: params.sessionKey
	});
	if (!deliveryContext) {
		let entry = params.entry;
		let observation = params.observation;
		for (let attempt = 0; attempt < 3; attempt += 1) {
			const notice = await writeUnresumableSessionNotice$1({
				...params,
				entry,
				observation,
				text: TOMBSTONED_SESSION_NOTICE
			});
			if (notice === "written") return "tombstoned";
			if (notice === "failed") return "notice_failed";
			const current = loadSessionEntry({
				sessionKey: params.sessionKey,
				storePath: params.storePath,
				readConsistency: "latest"
			});
			const state = current?.mainRestartRecovery;
			if (!current || current.sessionId !== params.entry.sessionId || state?.cycleId !== params.observation.cycleId || state.tombstone || !isMainSessionRecoveryExhausted(current)) return "skipped";
			entry = current;
			observation = {
				sessionId: current.sessionId,
				cycleId: state.cycleId,
				revision: state.revision
			};
		}
		return "notice_failed";
	}
	const tombstonedEntry = await claimMainRestartRecoveryTombstone(params);
	if (!tombstonedEntry) return "skipped";
	await sendUnresumableSessionNotice$1({
		deliveryContext,
		entry: tombstonedEntry,
		gatewayRuntime: params.gatewayRuntime,
		reason: params.reason,
		sessionKey: params.sessionKey,
		text: TOMBSTONED_SESSION_NOTICE
	});
	return "tombstoned";
}
async function sendUnresumableSessionNotice$1(params) {
	const messageParams = {
		to: params.deliveryContext.to,
		message: params.text,
		bestEffort: true,
		...params.deliveryContext.threadId != null ? { threadId: params.deliveryContext.threadId } : {}
	};
	const actionParams = {
		channel: params.deliveryContext.channel,
		action: "send",
		sessionKey: params.sessionKey,
		sessionId: params.entry.sessionId,
		idempotencyKey: buildUnresumableSessionNoticeIdempotencyKey(params.entry),
		params: messageParams
	};
	const accountId = normalizeOptionalString(params.deliveryContext.accountId);
	if (accountId) actionParams.accountId = accountId;
	try {
		await params.gatewayRuntime.sendRecoveryNotice(actionParams, 1e4);
		log$1.info(`sent interrupted main session recovery notice: ${params.sessionKey} (${params.reason})`);
	} catch (error) {
		log$1.warn(`failed to send interrupted main session recovery notice ${params.sessionKey}: ${String(error)}`);
	}
}
async function writeUnresumableSessionNotice$1(params) {
	const recoveryState = params.entry.mainRestartRecovery;
	if (!recoveryState || recoveryState.cycleId !== params.observation.cycleId || recoveryState.revision !== params.observation.revision) return "stale";
	const now = Date.now();
	const result = await appendAssistantMessageToSessionTranscript({
		agentId: resolveAgentIdFromSessionKey(params.sessionKey),
		sessionKey: params.sessionKey,
		expectedSessionId: params.entry.sessionId,
		expectedSessionState: {
			abortedLastRun: params.entry.abortedLastRun,
			mainRestartRecoveryCycleId: params.observation.cycleId,
			mainRestartRecoveryRevision: params.observation.revision,
			restartRecoveryBeforeAgentReplyState: params.entry.restartRecoveryBeforeAgentReplyState,
			restartRecoveryDeliveryReceiptState: params.entry.restartRecoveryDeliveryReceiptState,
			restartRecoveryDeliveryToolCallId: params.entry.restartRecoveryDeliveryToolCallId,
			restartRecoveryDeliveryRequestFingerprint: params.entry.restartRecoveryDeliveryRequestFingerprint,
			restartRecoveryDeliveryRunId: params.entry.restartRecoveryDeliveryRunId,
			restartRecoveryDeliverySourceRunId: params.entry.restartRecoveryDeliverySourceRunId,
			restartRecoveryRequesterAccountId: params.entry.restartRecoveryRequesterAccountId,
			restartRecoveryRequesterSenderId: params.entry.restartRecoveryRequesterSenderId,
			restartRecoverySameChannelThreadRequired: params.entry.restartRecoverySameChannelThreadRequired,
			restartRecoverySourceIngress: params.entry.restartRecoverySourceIngress,
			restartRecoverySourceReplyDeliveryMode: params.entry.restartRecoverySourceReplyDeliveryMode,
			restartRecoveryTerminalRunIds: params.entry.restartRecoveryTerminalRunIds,
			status: params.entry.status,
			updatedAt: params.entry.updatedAt
		},
		sessionLifecyclePatch: {
			abortedLastRun: false,
			endedAt: now,
			mainRestartRecovery: {
				...recoveryState,
				revision: recoveryState.revision + 1,
				tombstone: { reason: params.reason }
			},
			runtimeMs: Math.max(0, now - (params.entry.startedAt ?? now)),
			status: "failed",
			updatedAt: now
		},
		storePath: params.storePath,
		text: params.text,
		idempotencyKey: buildUnresumableSessionNoticeIdempotencyKey(params.entry)
	}).catch((error) => ({
		ok: false,
		reason: String(error)
	}));
	if (!result.ok) log$1.warn(`failed to write interrupted main session notice ${params.sessionKey}: ${result.reason}`);
	return result.ok ? "written" : "code" in result && result.code === "session-rebound" ? "stale" : "failed";
}
//#endregion
//#region src/agents/main-session-restart-recovery.ts
/**
* Post-restart recovery for main sessions interrupted while holding a transcript lock.
*/
const log = createSubsystemLogger("main-session-restart-recovery");
const DEFAULT_RECOVERY_DELAY_MS = 5e3;
const MAX_RECOVERY_RETRIES = 3;
const RETRY_BACKOFF_MULTIPLIER = 2;
const UNRESUMABLE_SESSION_NOTICE = "I was interrupted by a gateway restart and couldn't safely resume the previous turn. Please send that last request again and I'll pick it up cleanly.";
function loadExpectedRestartRecoveryTarget(params) {
	const exact = loadExactSessionEntry({
		sessionKey: params.expected.sessionKey,
		storePath: params.storePath,
		readConsistency: "latest"
	});
	const entry = exact?.sessionKey === params.expected.sessionKey ? exact.entry : void 0;
	return entry?.sessionId === params.expected.sessionId && entry.status === "running" && entry.abortedLastRun === true && isMainRestartRecoveryCandidate(entry, params.expected.sessionKey) ? entry : void 0;
}
function shouldSkipMainRecovery(entry, sessionKey) {
	return !isMainRestartRecoveryCandidate(entry, sessionKey);
}
function normalizeStringSet(values) {
	const normalized = /* @__PURE__ */ new Set();
	for (const value of values ?? []) {
		const trimmed = value.trim();
		if (trimmed) normalized.add(trimmed);
	}
	return normalized;
}
function normalizeFiniteTimestamp(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function hasCurrentProcessOwner(params) {
	if (params.activeSessionIds.has(params.entry.sessionId)) return true;
	return params.activeSessionIds.size === 0 && params.activeSessionKeys.has(params.sessionKey);
}
function normalizeTranscriptLockPath(lockPath) {
	const trimmed = lockPath.trim();
	if (!path.basename(trimmed).endsWith(".jsonl.lock")) return;
	const resolved = path.resolve(trimmed);
	try {
		return path.join(fs.realpathSync(path.dirname(resolved)), path.basename(resolved));
	} catch {
		return resolved;
	}
}
function resolveEntryTranscriptLockPaths(params) {
	const paths = /* @__PURE__ */ new Set();
	const push = (resolvePath) => {
		try {
			paths.add(path.resolve(`${resolvePath()}.lock`));
		} catch {}
	};
	push(() => resolveSessionFilePath(params.entry.sessionId, params.entry, { sessionsDir: params.sessionsDir }));
	push(() => resolveSessionTranscriptPathInDir(params.entry.sessionId, params.sessionsDir));
	return [...paths];
}
async function markRestartAbortedMainSessions(params) {
	const sessionKeys = normalizeStringSet(params.sessionKeys);
	const sessionIds = normalizeStringSet(params.sessionIds);
	const preferSessionIdMatch = sessionIds.size > 0;
	const activeRuns = [...params.activeRuns ?? []].map((run) => ({
		runId: run.runId.trim(),
		lifecycleGeneration: run.lifecycleGeneration.trim(),
		sessionKey: run.sessionKey.trim(),
		sessionId: run.sessionId.trim(),
		observedAt: normalizeFiniteTimestamp(run.observedAt)
	})).filter((run) => run.runId && run.lifecycleGeneration && (run.sessionKey || run.sessionId));
	const currentLifecycleGeneration = getAgentEventLifecycleGeneration();
	const result = {
		marked: 0,
		skipped: 0
	};
	if (sessionKeys.size === 0 && sessionIds.size === 0) return result;
	const storePaths = /* @__PURE__ */ new Set();
	const env = params.stateDir === void 0 ? process.env : {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const stateDir = resolveStateDir(env);
	const configs = [params.cfg, ...params.additionalCfgs ?? []].filter((cfg) => Boolean(cfg));
	for (const cfg of configs) {
		try {
			for (const target of resolveAllAgentSessionStoreTargetsSync(cfg, { env })) storePaths.add(path.resolve(target.storePath));
		} catch (err) {
			log.warn(`failed to resolve configured session stores for restart marker: ${String(err)}`);
		}
		for (const sessionKey of sessionKeys) try {
			const target = resolveGatewaySessionStoreTarget({
				cfg,
				key: sessionKey
			});
			storePaths.add(path.resolve(target.storePath));
			for (const storeKey of target.storeKeys) {
				const trimmed = storeKey.trim();
				if (trimmed) sessionKeys.add(trimmed);
			}
		} catch (err) {
			log.warn(`failed to resolve session store for restart marker ${sessionKey}: ${String(err)}`);
		}
	}
	for (const sessionsDir of await resolveAgentSessionDirs(stateDir)) storePaths.add(path.join(sessionsDir, "sessions.json"));
	for (const storePath of storePaths) {
		const storeResult = await applySessionEntryReplacements({
			storePath,
			requireWriteSuccess: true,
			update: (entries) => {
				const replacements = [];
				const counts = {
					marked: 0,
					skipped: 0
				};
				for (const { sessionKey, entry } of entries) {
					const registeredActiveRuns = listAgentRunsForSession({
						sessionKey,
						sessionId: entry.sessionId
					});
					const matchingActiveRuns = activeRuns.filter((run) => (run.sessionId ? run.sessionId === entry.sessionId : run.sessionKey === sessionKey) && (entry.status === "running" || run.observedAt === void 0 || normalizeFiniteTimestamp(entry.updatedAt) === void 0 || entry.updatedAt < run.observedAt && run.lifecycleGeneration !== currentLifecycleGeneration) && params.isActiveRun?.(run) !== false);
					if (entry.status !== "running" && matchingActiveRuns.length === 0 && registeredActiveRuns.length === 0) continue;
					if (!(typeof entry.sessionId === "string" && sessionIds.has(entry.sessionId) ? true : !preferSessionIdMatch && sessionKeys.has(sessionKey))) continue;
					if (shouldSkipMainRecovery(entry, sessionKey)) {
						counts.skipped++;
						continue;
					}
					const wasRunning = entry.status === "running";
					const recoveryRuns = /* @__PURE__ */ new Map();
					for (const run of entry.restartRecoveryRuns ?? []) if (run.lifecycleGeneration === currentLifecycleGeneration) recoveryRuns.set(`${run.runId}\u0000${run.lifecycleGeneration}`, run);
					const replaceActiveRunMarker = (run) => {
						for (const [key, existingRun] of recoveryRuns) if (existingRun.runId === run.runId) recoveryRuns.delete(key);
						recoveryRuns.set(`${run.runId}\u0000${run.lifecycleGeneration}`, run);
					};
					for (const run of registeredActiveRuns) replaceActiveRunMarker(run);
					for (const run of matchingActiveRuns) replaceActiveRunMarker({
						runId: run.runId,
						lifecycleGeneration: run.lifecycleGeneration
					});
					entry.restartRecoveryRuns = [...recoveryRuns.values()].toSorted((a, b) => a.runId === b.runId ? a.lifecycleGeneration.localeCompare(b.lifecycleGeneration) : a.runId.localeCompare(b.runId));
					transitionMainSessionRecovery(entry, {
						kind: "mark_interrupted",
						cycleId: randomUUID(),
						now: Date.now(),
						resetRuntime: !wasRunning,
						runs: entry.restartRecoveryRuns
					});
					replacements.push({
						sessionKey,
						entry
					});
					counts.marked++;
				}
				return {
					result: counts,
					replacements
				};
			}
		});
		result.marked += storeResult.marked;
		result.skipped += storeResult.skipped;
	}
	if (result.marked > 0) log.warn(`marked ${result.marked} interrupted main session(s) for restart recovery${params.reason ? ` (${params.reason})` : ""}`);
	return result;
}
async function markStartupOrphanedMainSessionsForRecovery(params) {
	const result = {
		marked: 0,
		skipped: 0
	};
	const providedActiveSessionIds = params.activeSessionIds === void 0 ? void 0 : normalizeStringSet(params.activeSessionIds);
	const providedActiveSessionKeys = params.activeSessionKeys === void 0 ? void 0 : normalizeStringSet(params.activeSessionKeys);
	const updatedBeforeMs = normalizeFiniteTimestamp(params.updatedBeforeMs);
	const resolveActiveSessionIds = () => providedActiveSessionIds ?? normalizeStringSet(listActiveEmbeddedRunSessionIds());
	const resolveActiveSessionKeys = () => providedActiveSessionKeys ?? normalizeStringSet(listActiveEmbeddedRunSessionKeys());
	for (const storePath of await resolveRestartRecoveryStorePaths(params)) {
		const storeResult = await applySessionEntryReplacements({
			storePath,
			statuses: ["running"],
			update: (entries) => {
				const replacements = [];
				const counts = {
					marked: 0,
					skipped: 0
				};
				for (const { sessionKey, entry } of entries) {
					if (entry.status !== "running" || entry.abortedLastRun === true) continue;
					if (shouldSkipMainRecovery(entry, sessionKey)) {
						counts.skipped++;
						continue;
					}
					const updatedAt = normalizeFiniteTimestamp(entry.updatedAt);
					if (updatedBeforeMs !== void 0 && updatedAt !== void 0 && updatedAt > updatedBeforeMs) continue;
					if (hasCurrentProcessOwner({
						activeSessionIds: resolveActiveSessionIds(),
						activeSessionKeys: resolveActiveSessionKeys(),
						entry,
						sessionKey
					})) continue;
					transitionMainSessionRecovery(entry, {
						kind: "mark_interrupted",
						cycleId: randomUUID(),
						now: Date.now()
					});
					replacements.push({
						sessionKey,
						entry
					});
					counts.marked++;
				}
				return {
					result: counts,
					replacements
				};
			}
		});
		result.marked += storeResult.marked;
		result.skipped += storeResult.skipped;
	}
	if (result.marked > 0) log.warn(`marked ${result.marked} startup-orphaned main session(s) for restart recovery`);
	return result;
}
function getMessageRole(message) {
	if (!message || typeof message !== "object") return;
	const role = message.role;
	return typeof role === "string" ? role : void 0;
}
function findSourceTurnRange(params) {
	const sourceUserTurnId = buildRunUserTurnIdempotencyKey(params.sourceTurnId);
	const sourceTurnIds = /* @__PURE__ */ new Set([params.sourceTurnId, sourceUserTurnId]);
	const continuationTurnId = params.continuationRunId ? buildRunUserTurnIdempotencyKey(params.continuationRunId) : void 0;
	for (let index = params.messages.length - 1; index >= 0; index -= 1) {
		const message = params.messages[index];
		if (getMessageRole(message) === "user" && message && typeof message === "object" && sourceTurnIds.has(normalizeOptionalString(message.idempotencyKey) ?? "")) {
			let endIndex = params.messages.length;
			for (let nextIndex = index + 1; nextIndex < params.messages.length; nextIndex += 1) {
				const nextMessage = params.messages[nextIndex];
				if (getMessageRole(nextMessage) !== "user") continue;
				const nextIdempotencyKey = nextMessage && typeof nextMessage === "object" ? normalizeOptionalString(nextMessage.idempotencyKey) : void 0;
				if (nextIdempotencyKey === `${params.sourceTurnId}:late-media` || nextIdempotencyKey === continuationTurnId || continuationTurnId !== void 0 && nextIdempotencyKey === `${continuationTurnId}:late-media`) continue;
				endIndex = nextIndex;
				break;
			}
			return {
				startIndex: index,
				endIndex
			};
		}
	}
}
function readToolCallId(message) {
	return [
		message.toolCallId,
		message.toolUseId,
		message.tool_call_id,
		message.tool_use_id,
		message.callId,
		message.call_id
	].map(normalizeOptionalString).find(Boolean);
}
function findMessageToolCallIndexInSourceTurn(params) {
	for (let index = params.sourceTurnRange.endIndex - 1; index > params.sourceTurnRange.startIndex; index -= 1) {
		const message = params.messages[index];
		if (!message || typeof message !== "object" || getMessageRole(message) !== "assistant") continue;
		const content = message.content;
		if (!Array.isArray(content)) continue;
		if (content.some((block) => {
			if (!block || typeof block !== "object") return false;
			const record = block;
			const type = normalizeOptionalString(record.type);
			return (type === "toolCall" || type === "toolUse" || type === "tool_use") && normalizeOptionalString(record.id) === params.toolCallId && normalizeOptionalString(record.name) === "message";
		})) return index;
	}
}
function hasSiblingAssistantToolCalls(message) {
	if (!message || typeof message !== "object" || getMessageRole(message) !== "assistant") return true;
	const content = message.content;
	if (!Array.isArray(content)) return true;
	let toolCallCount = 0;
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const type = normalizeOptionalString(block.type);
		if (type === "toolCall" || type === "toolUse" || type === "tool_use") toolCallCount += 1;
	}
	return toolCallCount !== 1;
}
function isSuccessfulMessageToolResult(message, toolCallId) {
	const role = getMessageRole(message);
	if (!message || typeof message !== "object" || role !== "tool" && role !== "toolResult") return false;
	const record = message;
	return readToolCallId(record) === toolCallId && normalizeOptionalString(record.toolName) === "message" && record.isError !== true;
}
function findSuccessfulMessageToolResultIndex(params) {
	for (let index = params.toolCallIndex + 1; index < params.sourceTurnRange.endIndex; index += 1) if (isSuccessfulMessageToolResult(params.messages[index], params.toolCallId)) return index;
}
function isExactMessageToolDeliveryMirror(params) {
	if (!params.message || typeof params.message !== "object") return false;
	const marker = params.message.openclawDeliveryMirror;
	if (!marker || typeof marker !== "object") return false;
	const delivery = marker;
	return delivery.kind === "message-tool-source-reply" && delivery.final === true && normalizeOptionalString(delivery.sourceTurnId) === params.sourceTurnId && normalizeOptionalString(delivery.toolCallId) === params.toolCallId;
}
function isSafeTerminalDeliveryTailMessage(params) {
	if (isExactMessageToolDeliveryMirror(params)) return true;
	return isRestartAbortTailArtifact(params.message);
}
function isTerminalSilentAssistantMessage(message) {
	if (!message || typeof message !== "object" || getMessageRole(message) !== "assistant") return false;
	if (normalizeOptionalString(message.stopReason) !== "stop") return false;
	const content = message.content;
	if (!Array.isArray(content) || content.length === 0) return false;
	const textParts = [];
	for (const block of content) {
		if (!block || typeof block !== "object") return false;
		const type = normalizeOptionalString(block.type);
		if (type === "thinking") continue;
		if (type !== "text") return false;
		const text = normalizeOptionalString(block.text);
		if (text) textParts.push(text);
	}
	return isSilentReplyPayloadText(textParts.join("\n"), SILENT_REPLY_TOKEN);
}
function canReconcileTerminalDeliveryAtSourceTurnTail(params) {
	if (params.sourceTurnRange.endIndex !== params.messages.length) return false;
	for (let messageIndex = params.toolCallIndex + 1; messageIndex < params.sourceTurnRange.endIndex; messageIndex += 1) {
		if (messageIndex === params.successfulToolResultIndex) continue;
		const message = params.messages[messageIndex];
		if (params.successfulToolResultIndex !== void 0 && messageIndex > params.successfulToolResultIndex && messageIndex === params.sourceTurnRange.endIndex - 1 && isTerminalSilentAssistantMessage(message)) continue;
		if (isSafeTerminalDeliveryTailMessage({
			message,
			sourceTurnId: params.sourceTurnId,
			toolCallId: params.toolCallId
		})) continue;
		return false;
	}
	return true;
}
function buildRecoveryToolResultIdempotencyKey(sourceTurnId, toolCallId) {
	return `restart-recovery:message-tool-result:${sourceTurnId}:${toolCallId}`;
}
function isMeaningfulTailMessage(message) {
	const role = getMessageRole(message);
	if (!role || role === "system") return false;
	return true;
}
function readDeliveredTerminalSourceReplyToolCallId(messages, expectedSourceTurnId) {
	if (!expectedSourceTurnId) return;
	for (const message of messages.toReversed()) {
		if (!message || typeof message !== "object" || getMessageRole(message) !== "assistant") continue;
		const marker = message.openclawDeliveryMirror;
		if (!marker || typeof marker !== "object") continue;
		const delivery = marker;
		if (delivery.kind === "message-tool-source-reply" && delivery.final === true && normalizeOptionalString(delivery.sourceTurnId) === expectedSourceTurnId) return normalizeOptionalString(delivery.toolCallId);
	}
}
function readCodeModeWaitCall(message) {
	if (!message || typeof message !== "object" || getMessageRole(message) !== "assistant" || message.stopReason !== "toolUse") return;
	const content = message.content;
	if (!Array.isArray(content)) return;
	const supportedTypes = /* @__PURE__ */ new Set([
		"text",
		"thinking",
		"toolCall",
		"toolUse",
		"tool_use"
	]);
	if (content.some((block) => !block || typeof block !== "object" || !supportedTypes.has(String(block.type)) || block.type === "text" && Boolean(normalizeOptionalString(block.text)))) return;
	const toolCalls = content.filter((block) => {
		const type = block.type;
		return type === "toolCall" || type === "toolUse" || type === "tool_use";
	});
	if (toolCalls.length !== 1) return;
	const block = toolCalls[0];
	if (normalizeOptionalString(block.name) !== "wait") return;
	const args = block.arguments ?? block.input;
	const runId = args && typeof args === "object" ? normalizeOptionalString(args.runId) : void 0;
	if (!runId) return;
	const toolCallId = normalizeOptionalString(block.id);
	return {
		runId,
		...toolCallId ? { toolCallId } : {}
	};
}
function isResumableTailMessage(message) {
	const role = getMessageRole(message);
	return role === "user" || role === "tool" || role === "toolResult";
}
function isPendingAssistantToolCall(message) {
	if (!message || typeof message !== "object" || getMessageRole(message) !== "assistant") return false;
	if (normalizeOptionalString(message.stopReason) !== "toolUse") return false;
	const content = message.content;
	if (!Array.isArray(content)) return false;
	let hasToolCall = false;
	for (const block of content) {
		if (!block || typeof block !== "object") return false;
		const type = normalizeOptionalString(block.type);
		if (type === "toolCall" || type === "toolUse" || type === "tool_use") {
			hasToolCall = true;
			continue;
		}
		if (type === "thinking") continue;
		if (type === "text" && !normalizeOptionalString(block.text)) continue;
		return false;
	}
	return hasToolCall;
}
function readCodeModeCheckpoint(message) {
	if (!message || typeof message !== "object") return;
	const role = getMessageRole(message);
	if (role !== "tool" && role !== "toolResult") return;
	const toolName = normalizeOptionalString(message.toolName);
	if (toolName !== "exec" && toolName !== "wait") return;
	const content = message.content;
	if (!Array.isArray(content)) return;
	const text = normalizeOptionalString(content.find((block) => block && typeof block === "object" && block.type === "text")?.text);
	if (!text) return;
	try {
		const result = JSON.parse(text);
		if (result.status === "completed" || result.status === "failed") return { replaySafe: result.replaySafe === true };
		const runId = normalizeOptionalString(result.runId);
		return result.status === "waiting" && runId ? {
			replaySafe: result.replaySafe === true,
			runId
		} : void 0;
	} catch {
		return;
	}
}
function hasReplaySafeCodeModeCheckpointInCurrentTurn(messages) {
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (getMessageRole(message) === "user") return false;
		if (readCodeModeCheckpoint(message)?.replaySafe === true) return true;
	}
	return false;
}
function isRestartAbortTailArtifact(message) {
	if (!message || typeof message !== "object" || getMessageRole(message) !== "assistant") return false;
	const stopReason = normalizeOptionalString(message.stopReason);
	if (stopReason !== "error" && stopReason !== "aborted") return false;
	const errorMessage = normalizeOptionalString(message.errorMessage);
	const content = message.content;
	return Array.isArray(content) && content.length === 0 && (errorMessage === "Request was aborted" || errorMessage === "This operation was aborted");
}
function isRestartAbortedWaitFailure(message) {
	if (!message || typeof message !== "object" || getMessageRole(message) !== "toolResult") return false;
	const record = message;
	if (normalizeOptionalString(record.toolName) !== "wait" || record.isError !== true) return false;
	const details = record.details;
	if (!details || typeof details !== "object" || details.status !== "failed" || details.code !== "internal_error") return false;
	const content = record.content;
	const contentText = Array.isArray(content) ? content.filter((block) => block && typeof block === "object" && block.type === "text").map((block) => normalizeOptionalString(block.text) ?? "").join("\n") : "";
	const errorText = normalizeOptionalString(details.error) ?? normalizeOptionalString(contentText);
	return /^(?:(?:Abort)?Error:\s*)?(?:The|This) operation was aborted\.?$/u.test(errorText ?? "");
}
function isRestartAbortedWaitResultArtifact(message, waitMessage) {
	if (!isRestartAbortedWaitFailure(message)) return false;
	const toolCallId = normalizeOptionalString(message.toolCallId);
	const waitCall = readCodeModeWaitCall(waitMessage);
	return Boolean(toolCallId && waitCall?.toolCallId === toolCallId);
}
function isApprovalPendingToolResult(message) {
	if (!message || typeof message !== "object" || getMessageRole(message) !== "toolResult") return false;
	const details = message.details;
	if (!details || typeof details !== "object") return false;
	return details.status === "approval-pending";
}
function resolveMainSessionResumePolicy(messages, forceRestartSafeTools = false, expectedSourceTurnId, beforeAgentReplyState, deliveryReceiptState, deliveryToolCallId) {
	const mirroredToolCallId = readDeliveredTerminalSourceReplyToolCallId(messages, expectedSourceTurnId);
	if (mirroredToolCallId) return {
		action: "complete",
		reason: "delivered-terminal",
		toolCallId: mirroredToolCallId
	};
	if (deliveryReceiptState === "delivered-terminal") return deliveryToolCallId ? {
		action: "complete",
		reason: "delivered-terminal-receipt",
		toolCallId: deliveryToolCallId
	} : {
		action: "fail",
		reason: "terminal delivery receipt lacks tool-call correlation"
	};
	if (deliveryReceiptState === "terminal-pending") return {
		action: "fail",
		reason: "terminal source reply delivery outcome is unknown"
	};
	if (beforeAgentReplyState === "handled-silent") return {
		action: "complete",
		reason: "handled-silent"
	};
	if (beforeAgentReplyState === "pending") return {
		action: "fail",
		reason: "before_agent_reply hook outcome is unknown"
	};
	if (beforeAgentReplyState === "handled-reply") return {
		action: "fail",
		reason: "before_agent_reply handled reply is not recoverable"
	};
	if (beforeAgentReplyState === "handled-unrecoverable") return {
		action: "fail",
		reason: "before_agent_reply handled an unrecoverable reply shape"
	};
	const meaningfulMessages = messages.toReversed().filter(isMeaningfulTailMessage);
	if (isRestartAbortTailArtifact(meaningfulMessages[0])) meaningfulMessages.shift();
	if (isRestartAbortedWaitResultArtifact(meaningfulMessages[0], meaningfulMessages[1])) meaningfulMessages.shift();
	const lastMeaningful = meaningfulMessages[0];
	if (forceRestartSafeTools && isPendingAssistantToolCall(lastMeaningful)) return {
		action: "resume",
		forceRestartSafeTools: true
	};
	if (isRestartAbortedWaitFailure(lastMeaningful)) {
		const waitCall = readCodeModeWaitCall(meaningfulMessages[1]);
		const checkpoint = readCodeModeCheckpoint(meaningfulMessages[2]);
		return waitCall && checkpoint?.replaySafe === true && checkpoint.runId === waitCall.runId ? {
			action: "resume",
			forceRestartSafeTools: true
		} : {
			action: "fail",
			reason: "failed Code Mode wait cannot be matched to a replay-safe checkpoint"
		};
	}
	const waitCall = readCodeModeWaitCall(lastMeaningful);
	if (waitCall) {
		const checkpoint = readCodeModeCheckpoint(meaningfulMessages[1]);
		return checkpoint?.replaySafe === true && checkpoint.runId === waitCall.runId ? {
			action: "resume",
			forceRestartSafeTools: true
		} : {
			action: "fail",
			reason: "Code Mode wait checkpoint is not replay-safe"
		};
	}
	const tailCheckpoint = readCodeModeCheckpoint(lastMeaningful);
	if (tailCheckpoint) return tailCheckpoint.replaySafe ? {
		action: "resume",
		forceRestartSafeTools: true
	} : {
		action: "fail",
		reason: "Code Mode wait checkpoint is not replay-safe"
	};
	if (!lastMeaningful || !isResumableTailMessage(lastMeaningful)) return {
		action: "fail",
		reason: "transcript tail is not resumable"
	};
	if (isApprovalPendingToolResult(lastMeaningful)) return {
		action: "fail",
		reason: "transcript tail is a stale approval-pending tool result"
	};
	return {
		action: "resume",
		forceRestartSafeTools: false
	};
}
async function markSessionFailed(params) {
	if ((await commitMainSessionRecovery({
		command: {
			kind: "fail_recovery",
			now: Date.now(),
			observation: params.observation
		},
		requireWriteSuccess: true,
		target: {
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}
	})).transition.kind === "failed") {
		log.warn(`marked interrupted main session failed: ${params.sessionKey} (${params.reason})`);
		return true;
	}
	return false;
}
async function markSessionCompletedAfterRecoveryCheckpoint(params) {
	const expectedRecoveryRunId = normalizeOptionalString(params.entry.restartRecoveryDeliveryRunId);
	const expectedRecoverySourceRunId = normalizeOptionalString(params.entry.restartRecoveryDeliverySourceRunId);
	const endedAt = Date.now();
	const lifecyclePatch = {
		...buildRestartRecoveryClaimCleanupPatch({
			entry: params.entry,
			recordTerminalSource: expectedRecoverySourceRunId !== void 0,
			terminalSourceRunId: expectedRecoverySourceRunId
		}),
		abortedLastRun: false,
		endedAt,
		pendingFinalDelivery: void 0,
		pendingFinalDeliveryText: void 0,
		pendingFinalDeliveryCreatedAt: void 0,
		pendingFinalDeliveryLastAttemptAt: void 0,
		pendingFinalDeliveryAttemptCount: void 0,
		pendingFinalDeliveryLastError: void 0,
		pendingFinalDeliveryContext: void 0,
		pendingFinalDeliveryIntentId: void 0,
		restartRecoveryForceSafeTools: void 0,
		restartRecoveryRuns: void 0,
		runtimeMs: typeof params.entry.startedAt === "number" ? Math.max(0, endedAt - params.entry.startedAt) : void 0,
		status: "done",
		updatedAt: endedAt
	};
	const sourceTurnId = normalizeOptionalString(params.sourceTurnId);
	if (params.reason === "handled-silent" && !sourceTurnId) return {
		outcome: "unsafe-transcript",
		reason: "handled silent checkpoint lacks its durable source turn"
	};
	const sourceTurnRange = sourceTurnId ? findSourceTurnRange({
		continuationRunId: expectedRecoveryRunId,
		messages: params.messages,
		sourceTurnId
	}) : void 0;
	const toolCallId = normalizeOptionalString(params.toolCallId);
	if (sourceTurnId && sourceTurnRange === void 0) return {
		outcome: "unsafe-transcript",
		reason: "recovery checkpoint cannot be matched to its durable source turn"
	};
	if (sourceTurnRange && sourceTurnRange.endIndex !== params.messages.length) return {
		outcome: "unsafe-transcript",
		reason: "recovery checkpoint belongs to an earlier transcript turn"
	};
	if (toolCallId && !sourceTurnId) return {
		outcome: "unsafe-transcript",
		reason: "terminal delivery lacks its durable source turn"
	};
	const messageToolCallIndex = toolCallId && sourceTurnRange ? findMessageToolCallIndexInSourceTurn({
		messages: params.messages,
		sourceTurnRange,
		toolCallId
	}) : void 0;
	if (toolCallId && messageToolCallIndex === void 0) return {
		outcome: "unsafe-transcript",
		reason: "terminal delivery cannot be matched to its message tool call"
	};
	if (messageToolCallIndex !== void 0 && hasSiblingAssistantToolCalls(params.messages[messageToolCallIndex])) return {
		outcome: "unsafe-transcript",
		reason: "terminal message tool call has sibling tool work"
	};
	const recoveryToolResultIdempotencyKey = toolCallId && sourceTurnId ? buildRecoveryToolResultIdempotencyKey(sourceTurnId, toolCallId) : void 0;
	const successfulToolResultIndex = toolCallId && sourceTurnRange && messageToolCallIndex !== void 0 ? findSuccessfulMessageToolResultIndex({
		messages: params.messages,
		sourceTurnRange,
		toolCallId,
		toolCallIndex: messageToolCallIndex
	}) : void 0;
	if (toolCallId && sourceTurnId && sourceTurnRange !== void 0 && messageToolCallIndex !== void 0 && !canReconcileTerminalDeliveryAtSourceTurnTail({
		messages: params.messages,
		sourceTurnId,
		sourceTurnRange,
		toolCallId,
		toolCallIndex: messageToolCallIndex,
		successfulToolResultIndex
	})) return {
		outcome: "unsafe-transcript",
		reason: successfulToolResultIndex === void 0 ? "terminal delivery would require an out-of-order transcript repair" : "terminal delivery result is followed by unfinished transcript work"
	};
	if (toolCallId && sourceTurnId && sourceTurnRange !== void 0 && messageToolCallIndex !== void 0 && recoveryToolResultIdempotencyKey && successfulToolResultIndex === void 0) {
		const expectedSessionState = {
			abortedLastRun: params.entry.abortedLastRun,
			restartRecoveryBeforeAgentReplyState: params.entry.restartRecoveryBeforeAgentReplyState,
			restartRecoveryDeliveryReceiptState: params.entry.restartRecoveryDeliveryReceiptState,
			restartRecoveryDeliveryToolCallId: params.entry.restartRecoveryDeliveryToolCallId,
			restartRecoveryDeliveryRequestFingerprint: params.entry.restartRecoveryDeliveryRequestFingerprint,
			restartRecoveryDeliveryRunId: params.entry.restartRecoveryDeliveryRunId,
			restartRecoveryDeliverySourceRunId: params.entry.restartRecoveryDeliverySourceRunId,
			restartRecoveryRequesterAccountId: params.entry.restartRecoveryRequesterAccountId,
			restartRecoveryRequesterSenderId: params.entry.restartRecoveryRequesterSenderId,
			restartRecoverySameChannelThreadRequired: params.entry.restartRecoverySameChannelThreadRequired,
			restartRecoverySourceIngress: params.entry.restartRecoverySourceIngress,
			restartRecoverySourceReplyDeliveryMode: params.entry.restartRecoverySourceReplyDeliveryMode,
			restartRecoveryTerminalRunIds: params.entry.restartRecoveryTerminalRunIds,
			status: params.entry.status,
			updatedAt: params.entry.updatedAt
		};
		const completed = (await persistSessionTranscriptTurn({
			agentId: resolveAgentIdFromSessionKey(params.sessionKey),
			sessionId: params.entry.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}, {
			expectedSessionId: params.entry.sessionId,
			expectedSessionState,
			messages: [{
				idempotencyLookup: "scan",
				message: {
					role: "toolResult",
					toolCallId,
					toolName: "message",
					content: [{
						type: "text",
						text: "Message delivered before gateway restart."
					}],
					idempotencyKey: recoveryToolResultIdempotencyKey,
					isError: false,
					timestamp: endedAt
				}
			}],
			sessionLifecyclePatch: lifecyclePatch,
			updateMode: "none"
		})).sessionEntry?.status === "done";
		if (completed) log.info(`reconciled delivered terminal reply after restart: ${params.sessionKey}`);
		return { outcome: completed ? "completed" : "changed" };
	}
	const marked = await applySessionEntryReplacements({
		sessionKeys: [params.sessionKey],
		storePath: params.storePath,
		update: (entries) => {
			const entry = entries.find((candidate) => candidate.sessionKey === params.sessionKey)?.entry;
			if (!entry || entry.sessionId !== params.entry.sessionId || entry.status !== "running" || entry.abortedLastRun !== true || normalizeOptionalString(entry.restartRecoveryDeliveryRunId) !== expectedRecoveryRunId || normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) !== expectedRecoverySourceRunId) return { result: false };
			Object.assign(entry, lifecyclePatch);
			return {
				result: true,
				replacements: [{
					sessionKey: params.sessionKey,
					entry
				}]
			};
		}
	});
	if (marked) log.info(params.reason === "delivered-terminal" || params.reason === "delivered-terminal-receipt" ? `reconciled delivered terminal reply after restart: ${params.sessionKey}` : `reconciled handled silent reply after restart: ${params.sessionKey}`);
	return { outcome: marked ? "completed" : "changed" };
}
async function sendUnresumableSessionNotice(params) {
	const messageParams = {
		to: params.deliveryContext.to,
		message: UNRESUMABLE_SESSION_NOTICE,
		bestEffort: true
	};
	if (params.deliveryContext.threadId != null) messageParams.threadId = params.deliveryContext.threadId;
	const actionParams = {
		channel: params.deliveryContext.channel,
		action: "send",
		sessionKey: params.sessionKey,
		sessionId: params.entry.sessionId,
		idempotencyKey: buildUnresumableSessionNoticeIdempotencyKey(params.entry),
		params: messageParams
	};
	const accountId = normalizeOptionalString(params.deliveryContext.accountId);
	if (accountId) actionParams.accountId = accountId;
	try {
		await params.gatewayRuntime.sendRecoveryNotice(actionParams, 1e4);
		log.info(`sent interrupted main session recovery notice: ${params.sessionKey} (${params.reason})`);
	} catch (err) {
		log.warn(`failed to send interrupted main session recovery notice ${params.sessionKey}: ${String(err)}`);
	}
}
async function writeUnresumableSessionNotice(params) {
	const result = await appendAssistantMessageToSessionTranscript({
		agentId: resolveAgentIdFromSessionKey(params.sessionKey),
		sessionKey: params.sessionKey,
		expectedSessionId: params.entry.sessionId,
		expectedSessionState: {
			abortedLastRun: params.entry.abortedLastRun,
			restartRecoveryBeforeAgentReplyState: params.entry.restartRecoveryBeforeAgentReplyState,
			restartRecoveryDeliveryReceiptState: params.entry.restartRecoveryDeliveryReceiptState,
			restartRecoveryDeliveryToolCallId: params.entry.restartRecoveryDeliveryToolCallId,
			restartRecoveryDeliveryRequestFingerprint: params.entry.restartRecoveryDeliveryRequestFingerprint,
			restartRecoveryDeliveryRunId: params.entry.restartRecoveryDeliveryRunId,
			restartRecoveryDeliverySourceRunId: params.entry.restartRecoveryDeliverySourceRunId,
			restartRecoveryRequesterAccountId: params.entry.restartRecoveryRequesterAccountId,
			restartRecoveryRequesterSenderId: params.entry.restartRecoveryRequesterSenderId,
			restartRecoverySameChannelThreadRequired: params.entry.restartRecoverySameChannelThreadRequired,
			restartRecoverySourceIngress: params.entry.restartRecoverySourceIngress,
			restartRecoverySourceReplyDeliveryMode: params.entry.restartRecoverySourceReplyDeliveryMode,
			restartRecoveryTerminalRunIds: params.entry.restartRecoveryTerminalRunIds,
			status: params.entry.status,
			updatedAt: params.entry.updatedAt
		},
		storePath: params.storePath,
		text: UNRESUMABLE_SESSION_NOTICE,
		idempotencyKey: buildUnresumableSessionNoticeIdempotencyKey(params.entry)
	}).catch((error) => ({
		ok: false,
		reason: String(error)
	}));
	if (!result.ok) log.warn(`failed to write interrupted main session notice ${params.sessionKey}: ${result.reason}`);
	return result.ok;
}
async function failUnresumableMainSession(params) {
	const deliveryContext = resolveRestartRecoveryDeliveryContext({
		cfg: params.cfg,
		entry: params.entry,
		includeSessionDeliveryFallback: true,
		sessionKey: params.sessionKey
	});
	if (!deliveryContext && !await writeUnresumableSessionNotice({
		entry: params.entry,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	})) return "failed";
	if (!await markSessionFailed({
		observation: params.observation,
		storePath: params.storePath,
		sessionKey: params.sessionKey,
		reason: params.reason
	})) return "skipped";
	if (deliveryContext) await sendUnresumableSessionNotice({
		deliveryContext,
		entry: params.entry,
		gatewayRuntime: params.gatewayRuntime,
		reason: params.reason,
		sessionKey: params.sessionKey
	});
	return "failed";
}
async function markRestartAbortedMainSessionsFromLocks(params) {
	const result = {
		marked: 0,
		skipped: 0
	};
	const sessionsDir = path.resolve(params.sessionsDir);
	const interruptedLockPaths = new Set(params.cleanedLocks.map((lock) => normalizeTranscriptLockPath(lock.lockPath)).filter((lockPath) => Boolean(lockPath)));
	if (interruptedLockPaths.size === 0) return result;
	const storeResult = await applySessionEntryReplacements({
		storePath: path.join(sessionsDir, "sessions.json"),
		statuses: ["running"],
		update: (entries) => {
			const replacements = [];
			const counts = {
				marked: 0,
				skipped: 0
			};
			for (const { sessionKey, entry } of entries) {
				if (entry.status !== "running") continue;
				if (shouldSkipMainRecovery(entry, sessionKey)) {
					counts.skipped++;
					continue;
				}
				if (!resolveEntryTranscriptLockPaths({
					entry,
					sessionsDir
				}).some((lockPath) => interruptedLockPaths.has(lockPath))) continue;
				transitionMainSessionRecovery(entry, {
					kind: "mark_interrupted",
					cycleId: randomUUID(),
					now: Date.now()
				});
				replacements.push({
					sessionKey,
					entry
				});
				counts.marked++;
			}
			return {
				result: counts,
				replacements
			};
		}
	});
	result.marked += storeResult.marked;
	result.skipped += storeResult.skipped;
	if (result.marked > 0) log.warn(`marked ${result.marked} interrupted main session(s) from stale transcript locks`);
	return result;
}
function resolveRecoveryDispatchSessionKey(params) {
	if (!params.cfg) return params.sessionKey;
	try {
		const target = resolveGatewaySessionStoreTarget({
			cfg: params.cfg,
			key: params.sessionKey
		});
		return !params.cfg.session?.store || path.resolve(target.storePath) === path.resolve(params.storePath) ? target.canonicalKey : void 0;
	} catch (err) {
		log.warn(`failed to resolve recovery store for ${params.sessionKey}: ${String(err)}`);
		return;
	}
}
async function recoverStore(params) {
	const result = {
		recovered: 0,
		failed: 0,
		skipped: 0
	};
	const providedActiveSessionIds = params.activeSessionIds === void 0 ? void 0 : normalizeStringSet(params.activeSessionIds);
	const providedActiveSessionKeys = params.activeSessionKeys === void 0 ? void 0 : normalizeStringSet(params.activeSessionKeys);
	const resolveActiveSessionIds = () => providedActiveSessionIds ?? normalizeStringSet(listActiveEmbeddedRunSessionIds());
	const resolveActiveSessionKeys = () => providedActiveSessionKeys ?? normalizeStringSet(listActiveEmbeddedRunSessionKeys());
	let entries;
	try {
		if (params.expectedClaim) {
			const entry = loadExpectedRestartRecoveryClaim({
				expected: params.expectedClaim,
				storePath: params.storePath
			});
			entries = entry ? [{
				sessionKey: params.expectedClaim.sessionKey,
				entry
			}] : [];
		} else if (params.expectedTarget) {
			const entry = loadExpectedRestartRecoveryTarget({
				expected: params.expectedTarget,
				storePath: params.storePath
			});
			entries = entry ? [{
				sessionKey: params.expectedTarget.sessionKey,
				entry
			}] : [];
		} else entries = listSessionEntriesByStatus({ storePath: params.storePath }, ["running"]);
	} catch (err) {
		log.warn(`failed to load session store ${params.storePath}: ${String(err)}`);
		result.failed++;
		return result;
	}
	for (const { sessionKey, entry: loadedEntry } of entries.toSorted((a, b) => a.sessionKey.localeCompare(b.sessionKey))) {
		let entry = loadedEntry;
		if (!entry || entry.status !== "running" || entry.abortedLastRun !== true) continue;
		if (shouldSkipMainRecovery(entry, sessionKey)) {
			result.skipped++;
			continue;
		}
		if (resolveSessionWorkStartError(sessionKey, entry)) {
			result.skipped++;
			continue;
		}
		const resolvedDispatchSessionKey = resolveRecoveryDispatchSessionKey({
			cfg: params.cfg,
			sessionKey,
			storePath: params.storePath
		});
		if (!resolvedDispatchSessionKey) {
			result.skipped++;
			continue;
		}
		const dispatchSessionKey = params.expectedClaim?.canonicalSessionKey ?? params.expectedTarget?.canonicalSessionKey ?? resolvedDispatchSessionKey;
		if (hasCurrentProcessOwner({
			activeSessionIds: resolveActiveSessionIds(),
			activeSessionKeys: resolveActiveSessionKeys(),
			entry,
			sessionKey
		})) {
			result.skipped++;
			continue;
		}
		const resumeDedupeKey = sessionKey;
		if (params.resumedSessionKeys.has(resumeDedupeKey)) {
			result.skipped++;
			continue;
		}
		const observed = await commitMainSessionRecovery({
			command: {
				kind: "observe",
				cycleId: randomUUID(),
				lifecycleGeneration: getAgentEventLifecycleGeneration(),
				sessionKey
			},
			requireWriteSuccess: true,
			target: {
				sessionKey,
				storePath: params.storePath
			}
		});
		if (!observed.entry || observed.transition.kind !== "observed") {
			result.skipped++;
			continue;
		}
		entry = observed.entry;
		const recoveryView = observed.transition.view;
		if (recoveryView.status === "inactive" || recoveryView.status === "blocked" || recoveryView.status === "tombstoned") {
			result.skipped++;
			continue;
		}
		if (recoveryView.status === "exhausted") {
			if (await tombstoneMainRestartRecoveryWithNotice({
				cfg: params.cfg,
				entry,
				gatewayRuntime: params.gatewayRuntime,
				observation: recoveryView.observation,
				reason: recoveryView.reason,
				sessionKey,
				storePath: params.storePath
			}) === "notice_failed") result.failed++;
			else result.skipped++;
			continue;
		}
		if (params.observationOnly) {
			result.skipped++;
			continue;
		}
		const recordResumeResult = (resumeResult) => {
			if (resumeResult === "resumed") {
				params.resumedSessionKeys.add(resumeDedupeKey);
				result.recovered++;
			} else if (resumeResult === "skipped") result.skipped++;
			else {
				result.failed++;
				const current = loadExpectedRestartRecoveryTarget({
					expected: {
						sessionId: entry.sessionId,
						sessionKey
					},
					storePath: params.storePath
				});
				if (current?.mainRestartRecovery?.chargedAttempts === MAX_RECOVERY_RETRIES && !current.mainRestartRecovery.reservation) params.onExhaustedTarget?.({
					canonicalSessionKey: dispatchSessionKey,
					sessionId: entry.sessionId,
					sessionKey,
					storePath: params.storePath
				});
			}
		};
		if (requiresRestartRecoveryMessageActionAuthority(entry) && !hasRestartRecoveryMessageActionAuthority(entry)) {
			const disposition = await failUnresumableMainSession({
				cfg: params.cfg,
				entry,
				gatewayRuntime: params.gatewayRuntime,
				observation: recoveryView.observation,
				reason: "message-tool-only recovery authority is unavailable",
				sessionKey,
				storePath: params.storePath
			});
			result[disposition]++;
			continue;
		}
		const expectedRecoverySourceRunId = normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId);
		let resumeBlockReason;
		let resumeSafetyResolved = false;
		const failBlockedResume = async () => {
			if (!resumeSafetyResolved) {
				resumeSafetyResolved = true;
				resumeBlockReason = resolveRestartRecoveryResumeBlockReason({
					cfg: params.cfg,
					entry,
					sessionKey
				});
			}
			if (!resumeBlockReason) return false;
			const disposition = await failUnresumableMainSession({
				cfg: params.cfg,
				entry,
				gatewayRuntime: params.gatewayRuntime,
				observation: recoveryView.observation,
				reason: resumeBlockReason,
				sessionKey,
				storePath: params.storePath
			});
			result[disposition]++;
			return true;
		};
		if (entry.pendingFinalDelivery === true && entry.pendingFinalDeliveryText && entry.restartRecoveryForceSafeTools === true) {
			if (await failBlockedResume()) continue;
			recordResumeResult(await resumeMainSession({
				canonicalSessionKey: dispatchSessionKey,
				cfg: params.cfg,
				entry,
				observation: recoveryView.observation,
				recoveryAttempt: recoveryView.nextAttempt,
				storePath: params.storePath,
				sessionKey,
				pendingFinalDeliveryText: entry.pendingFinalDeliveryText,
				forceRestartSafeTools: true,
				sessionWorkAdmissionHandoffId: params.sessionWorkAdmissionHandoffId,
				gatewayRuntime: params.gatewayRuntime
			}));
			continue;
		}
		let messages;
		try {
			messages = await readSessionMessagesAsync({
				agentId: resolveAgentIdFromSessionKey(sessionKey),
				sessionEntry: entry,
				sessionId: entry.sessionId,
				sessionKey,
				storePath: params.storePath
			}, {
				mode: "recent",
				maxMessages: 20,
				maxBytes: 256 * 1024
			});
		} catch (err) {
			if (entry.pendingFinalDelivery === true && entry.pendingFinalDeliveryText) {
				if (await failBlockedResume()) continue;
				log.warn(`transcript unavailable for ${sessionKey}; resuming its durable pending final delivery`);
				recordResumeResult(await resumeMainSession({
					canonicalSessionKey: dispatchSessionKey,
					cfg: params.cfg,
					entry,
					observation: recoveryView.observation,
					recoveryAttempt: recoveryView.nextAttempt,
					storePath: params.storePath,
					sessionKey,
					pendingFinalDeliveryText: entry.pendingFinalDeliveryText,
					sessionWorkAdmissionHandoffId: params.sessionWorkAdmissionHandoffId,
					gatewayRuntime: params.gatewayRuntime
				}));
				continue;
			}
			log.warn(`failed to read transcript for ${sessionKey}: ${String(err)}`);
			result.failed++;
			continue;
		}
		if (entry.pendingFinalDelivery === true && entry.pendingFinalDeliveryText) {
			if (await failBlockedResume()) continue;
			recordResumeResult(await resumeMainSession({
				canonicalSessionKey: dispatchSessionKey,
				cfg: params.cfg,
				entry,
				observation: recoveryView.observation,
				recoveryAttempt: recoveryView.nextAttempt,
				storePath: params.storePath,
				sessionKey,
				pendingFinalDeliveryText: entry.pendingFinalDeliveryText,
				forceRestartSafeTools: hasReplaySafeCodeModeCheckpointInCurrentTurn(messages),
				sessionWorkAdmissionHandoffId: params.sessionWorkAdmissionHandoffId,
				gatewayRuntime: params.gatewayRuntime
			}));
			continue;
		}
		const resumePolicy = resolveMainSessionResumePolicy(messages, entry.restartRecoveryForceSafeTools === true, expectedRecoverySourceRunId, entry.restartRecoveryBeforeAgentReplyState, entry.restartRecoveryDeliveryReceiptState, entry.restartRecoveryDeliveryToolCallId);
		if (resumePolicy.action === "complete") {
			const completion = await markSessionCompletedAfterRecoveryCheckpoint({
				entry,
				messages,
				reason: resumePolicy.reason,
				storePath: params.storePath,
				sessionKey,
				sourceTurnId: expectedRecoverySourceRunId,
				...resumePolicy.reason === "handled-silent" ? {} : { toolCallId: resumePolicy.toolCallId }
			});
			if (completion.outcome === "completed") {
				params.resumedSessionKeys.add(resumeDedupeKey);
				result.recovered++;
			} else if (completion.outcome === "changed") result.skipped++;
			else {
				const disposition = await failUnresumableMainSession({
					cfg: params.cfg,
					entry,
					gatewayRuntime: params.gatewayRuntime,
					observation: recoveryView.observation,
					reason: completion.reason,
					sessionKey,
					storePath: params.storePath
				});
				result[disposition]++;
			}
			continue;
		}
		if (resumePolicy.action === "fail") {
			const disposition = await failUnresumableMainSession({
				cfg: params.cfg,
				entry,
				gatewayRuntime: params.gatewayRuntime,
				observation: recoveryView.observation,
				reason: resumePolicy.reason,
				sessionKey,
				storePath: params.storePath
			});
			result[disposition]++;
			continue;
		}
		if (await failBlockedResume()) continue;
		recordResumeResult(await resumeMainSession({
			canonicalSessionKey: dispatchSessionKey,
			cfg: params.cfg,
			entry,
			observation: recoveryView.observation,
			recoveryAttempt: recoveryView.nextAttempt,
			storePath: params.storePath,
			sessionKey,
			pendingFinalDeliveryText: entry.pendingFinalDeliveryText,
			forceRestartSafeTools: entry.restartRecoveryForceSafeTools === true || resumePolicy.forceRestartSafeTools,
			sessionWorkAdmissionHandoffId: params.sessionWorkAdmissionHandoffId,
			gatewayRuntime: params.gatewayRuntime
		}));
	}
	return result;
}
async function resolveRestartRecoveryStorePaths(params) {
	const storePaths = /* @__PURE__ */ new Set();
	const stateDir = params.stateDir ?? resolveStateDir(process.env);
	for (const sessionsDir of await resolveAgentSessionDirs(stateDir)) storePaths.add(path.join(sessionsDir, "sessions.json"));
	if (params.cfg) {
		const env = {
			...process.env,
			OPENCLAW_STATE_DIR: stateDir
		};
		for (const target of resolveAllAgentSessionStoreTargetsSync(params.cfg, { env })) storePaths.add(path.resolve(target.storePath));
	}
	return [...storePaths].toSorted((a, b) => a.localeCompare(b));
}
async function recoverRestartAbortedMainSessionsWithOptions(params) {
	const result = {
		recovered: 0,
		failed: 0,
		skipped: 0
	};
	const resumedSessionKeys = params.resumedSessionKeys ?? /* @__PURE__ */ new Set();
	for (const storePath of await resolveRestartRecoveryStorePaths(params)) {
		const storeResult = await recoverStore({
			cfg: params.cfg,
			onExhaustedTarget: params.onExhaustedTarget,
			storePath,
			resumedSessionKeys,
			activeSessionIds: params.activeSessionIds,
			activeSessionKeys: params.activeSessionKeys,
			gatewayRuntime: params.gatewayRuntime
		});
		result.recovered += storeResult.recovered;
		result.failed += storeResult.failed;
		result.skipped += storeResult.skipped;
	}
	if (result.recovered > 0 || result.failed > 0) log.info(`main-session restart recovery complete: recovered=${result.recovered} failed=${result.failed} skipped=${result.skipped}`);
	return result;
}
async function recoverRestartAbortedMainSessions(params) {
	return await recoverRestartAbortedMainSessionsWithOptions(params);
}
/** Retries one exact durable Control UI row from its owning per-agent SQLite store. */
async function retryRestartAbortedMainSessionRecovery(params) {
	const expectedClaim = {
		canonicalSessionKey: params.canonicalSessionKey,
		recoveryRunId: params.expectedRecoveryRunId,
		recoverySourceRunId: params.expectedRecoverySourceRunId,
		sessionId: params.expectedSessionId,
		sessionKey: params.sessionKey
	};
	if (!loadExpectedRestartRecoveryClaim({
		expected: expectedClaim,
		storePath: params.storePath
	})) return {
		recovered: 0,
		failed: 0,
		skipped: 0
	};
	const assertClaimCurrent = () => {
		if (!loadExpectedRestartRecoveryClaim({
			expected: expectedClaim,
			storePath: params.storePath
		})) throw new Error("restart recovery session ownership changed before dispatch");
	};
	const admission = await beginSessionWorkAdmission({
		scope: params.storePath,
		identities: [
			params.sessionKey,
			params.canonicalSessionKey,
			params.expectedSessionId
		],
		assertAllowed: assertClaimCurrent,
		revalidateAllowed: assertClaimCurrent
	});
	const handoffId = admission.createHandoff();
	try {
		return await admission.run(async () => await recoverStore({
			cfg: params.cfg,
			storePath: params.storePath,
			resumedSessionKeys: /* @__PURE__ */ new Set(),
			expectedClaim,
			sessionWorkAdmissionHandoffId: handoffId,
			gatewayRuntime: params.gatewayRuntime
		}));
	} finally {
		cancelSessionWorkAdmissionHandoff(handoffId);
		admission.release();
	}
}
/** Reconciles one interrupted row after its final foreground owner releases. */
async function retryRestartAbortedMainSessionRecoveryAfterOwnerRelease(params) {
	return await recoverExpectedRestartRecoveryTarget(params);
}
async function recoverExpectedRestartRecoveryTarget(params) {
	const expectedTarget = {
		canonicalSessionKey: params.canonicalSessionKey,
		sessionId: params.expectedSessionId,
		sessionKey: params.sessionKey
	};
	const assertTargetCurrent = () => {
		if (!loadExpectedRestartRecoveryTarget({
			expected: expectedTarget,
			storePath: params.storePath
		})) throw new Error("restart recovery session ownership changed before owner-release retry");
	};
	if (!loadExpectedRestartRecoveryTarget({
		expected: expectedTarget,
		storePath: params.storePath
	})) return {
		recovered: 0,
		failed: 0,
		skipped: 0
	};
	const admission = await beginSessionWorkAdmission({
		scope: params.storePath,
		identities: [params.sessionKey, params.expectedSessionId],
		assertAllowed: assertTargetCurrent,
		revalidateAllowed: assertTargetCurrent
	});
	const handoffId = admission.createHandoff();
	try {
		return await admission.run(async () => await recoverStore({
			cfg: params.cfg,
			observationOnly: params.observationOnly,
			storePath: params.storePath,
			resumedSessionKeys: /* @__PURE__ */ new Set(),
			expectedTarget,
			sessionWorkAdmissionHandoffId: handoffId,
			gatewayRuntime: params.gatewayRuntime
		}));
	} finally {
		cancelSessionWorkAdmissionHandoff(handoffId);
		admission.release();
	}
}
function scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease(params) {
	const retryDelayMs = params.delayMs ?? DEFAULT_RECOVERY_DELAY_MS;
	const maxRetries = params.maxRetries ?? MAX_RECOVERY_RETRIES;
	const scheduleAttempt = (attempt, delayMs) => {
		const run = () => {
			runWithGatewayIndependentRootWorkAdmission(async () => {
				const gatewayRuntime = params.getGatewayRuntime();
				if (!gatewayRuntime) throw new Error("Gateway recovery runtime is unavailable");
				return await retryRestartAbortedMainSessionRecoveryAfterOwnerRelease({
					cfg: params.getConfig(),
					expectedSessionId: params.expectedSessionId,
					sessionKey: params.sessionKey,
					storePath: params.storePath,
					gatewayRuntime
				});
			}).then((result) => {
				const stillPending = loadExpectedRestartRecoveryTarget({
					expected: {
						sessionId: params.expectedSessionId,
						sessionKey: params.sessionKey
					},
					storePath: params.storePath
				});
				if ((result.failed > 0 || result.recovered === 0 && stillPending) && attempt < maxRetries) scheduleAttempt(attempt + 1, retryDelayMs * 2 ** (attempt - 1));
				else if (attempt === maxRetries && stillPending?.mainRestartRecovery?.chargedAttempts === MAX_RECOVERY_RETRIES && !stillPending.mainRestartRecovery.reservation) scheduleAttempt(attempt + 1, 0);
			}).catch((error) => {
				if (attempt < maxRetries) scheduleAttempt(attempt + 1, retryDelayMs * 2 ** (attempt - 1));
				else log.warn(`main-session owner-release recovery failed: ${String(error)}`);
			});
		};
		if (delayMs <= 0) run();
		else setTimeout(run, delayMs).unref?.();
	};
	scheduleAttempt(1, 0);
}
async function recoverStartupOrphanedMainSessionsWithOptions(params) {
	const startupRecoveryCutoffMs = params.updatedBeforeMs ?? Date.now();
	const marked = await markStartupOrphanedMainSessionsForRecovery({
		cfg: params.cfg,
		stateDir: params.stateDir,
		activeSessionIds: params.activeSessionIds,
		activeSessionKeys: params.activeSessionKeys,
		updatedBeforeMs: startupRecoveryCutoffMs
	});
	const recovered = await recoverRestartAbortedMainSessionsWithOptions({
		cfg: params.cfg,
		onExhaustedTarget: params.onExhaustedTarget,
		stateDir: params.stateDir,
		resumedSessionKeys: params.resumedSessionKeys,
		activeSessionIds: params.activeSessionIds,
		activeSessionKeys: params.activeSessionKeys,
		gatewayRuntime: params.gatewayRuntime
	});
	return {
		marked: marked.marked,
		recovered: recovered.recovered,
		failed: recovered.failed,
		skipped: marked.skipped + recovered.skipped
	};
}
async function recoverStartupOrphanedMainSessions(params) {
	return await recoverStartupOrphanedMainSessionsWithOptions(params);
}
function scheduleRestartAbortedMainSessionRecovery(params) {
	const initialDelay = params.delayMs ?? DEFAULT_RECOVERY_DELAY_MS;
	const maxRetries = params.maxRetries ?? MAX_RECOVERY_RETRIES;
	const resumedSessionKeys = /* @__PURE__ */ new Set();
	const startupRecoveryCutoffMs = Date.now();
	const runRecoveryAttempt = (attempt, delay) => {
		const exhaustedTargets = /* @__PURE__ */ new Map();
		const reconcileExhaustedTargets = async () => {
			const outcomes = await Promise.allSettled([...exhaustedTargets.values()].map((target) => runWithGatewayIndependentRootWorkAdmission(async () => await recoverExpectedRestartRecoveryTarget({
				canonicalSessionKey: target.canonicalSessionKey,
				cfg: params.cfg,
				expectedSessionId: target.sessionId,
				observationOnly: true,
				sessionKey: target.sessionKey,
				storePath: target.storePath,
				gatewayRuntime: params.gatewayRuntime
			}))));
			for (const outcome of outcomes) if (outcome.status === "rejected") log.warn(`main-session exhaustion reconciliation failed: ${String(outcome.reason)}`);
		};
		runWithGatewayIndependentRootWorkAdmission(async () => await recoverStartupOrphanedMainSessionsWithOptions({
			cfg: params.cfg,
			onExhaustedTarget: (target) => {
				exhaustedTargets.set(`${target.storePath}\u0000${target.sessionKey}`, target);
			},
			stateDir: params.stateDir,
			resumedSessionKeys,
			updatedBeforeMs: startupRecoveryCutoffMs,
			gatewayRuntime: params.gatewayRuntime
		})).then(async (result) => {
			if (result.failed > 0 && attempt < maxRetries) scheduleAttempt(attempt + 1, delay * RETRY_BACKOFF_MULTIPLIER);
			else if (result.failed > 0 && attempt === maxRetries && exhaustedTargets.size > 0) await reconcileExhaustedTargets();
		}).catch(async (err) => {
			if (attempt < maxRetries) {
				log.warn(`main-session restart recovery failed: ${String(err)}`);
				scheduleAttempt(attempt + 1, delay * RETRY_BACKOFF_MULTIPLIER);
			} else {
				log.warn(`main-session restart recovery gave up: ${String(err)}`);
				await reconcileExhaustedTargets();
			}
		});
	};
	const scheduleAttempt = (attempt, delay) => {
		if (delay <= 0) {
			runRecoveryAttempt(attempt, delay);
			return;
		}
		setTimeout(() => {
			runRecoveryAttempt(attempt, delay);
		}, delay).unref?.();
	};
	scheduleAttempt(1, initialDelay);
}
//#endregion
export { recoverStartupOrphanedMainSessions as a, scheduleRestartAbortedMainSessionRecovery as c, recoverRestartAbortedMainSessions as i, scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease as l, markRestartAbortedMainSessionsFromLocks as n, retryRestartAbortedMainSessionRecovery as o, markStartupOrphanedMainSessionsForRecovery as r, retryRestartAbortedMainSessionRecoveryAfterOwnerRelease as s, markRestartAbortedMainSessions as t };
