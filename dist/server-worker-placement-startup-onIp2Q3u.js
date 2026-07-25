import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { c as redactSensitiveText } from "./redact-DNq_HeDt.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import { L as isDefaultAgentRuntimeId, z as normalizeOptionalAgentRuntimeId } from "./openai-routing-Cq9SwNpx.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-CV4VBWUf.js";
import "./config-BOMcY2yX.js";
import { Kt as normalizeUsage, V as withTranscriptWriteTransaction, Wt as hasNonzeroUsage } from "./session-accessor-Mu3lv_Tl.js";
import { Mt as runExclusiveSessionStoreWrite, Tt as interruptSessionWorkAdmissions, kt as runExclusiveSessionLifecycleMutation, yt as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS } from "./store-DDuGv_UJ.js";
import { N as convertToLlm } from "./agent-core-CeIXSisr.js";
import { t as SessionManager } from "./session-manager-Ofb7FHrt.js";
import { r as resolveEffectiveAgentRuntime } from "./thinking-runtime-g8O2MT43.js";
import { t as WORKER_INFERENCE_MAX_CONTEXT_MESSAGES } from "./worker-inference-9lwpzYW9.js";
import { t as clearSessionQueues } from "./cleanup-l49uocqk.js";
import { a as buildUsageAgentMetaFields, b as createUsageAccumulator, v as resolveReportedModelRef, x as mergeUsageIntoAccumulator } from "./helpers-AZJkDTWd.js";
import { n as mapThinkingLevelForProvider } from "./utils-CefVZRZM.js";
import { n as installSessionPlacementResetGuard, t as installSessionPlacementAdmissionProvider } from "./session-placement-admission-C_WzNYGC.js";
import { i as projectWorkspaceResultConflict, n as WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, r as formatWorkspaceConflictSummary, t as WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE } from "./workspace-conflicts-Vx0i_s3y.js";
import { n as recoverWorkerWorkspaceReconciliation } from "./workspace-reconcile-cfhMHPGS.js";
import { a as hasWorkerWorkspaceResultRef, c as preparedWorkerWorkspaceResultRef, i as deleteWorkerWorkspaceResultCleanupRefs, l as restoreStagedWorkerWorkspaceResultFromCleanup, n as cleanupWorkerWorkspaceResultRef, o as isWorkerWorkspaceResultCleanupRef, r as deleteStagedWorkerWorkspaceResult, s as moveStagedWorkerWorkspaceResultToCleanup, t as applyStagedWorkerWorkspaceResult, u as workerWorkspaceResultRef } from "./workspace-result-staging-D0XyFWhQ.js";
import { n as workerEnvironmentIdForIdempotencyKey } from "./service-CpzzVsRY.js";
import { a as toWorkerTranscriptMessage } from "./transcript-message-BO7eUWtX.js";
import { n as parseWorkerLaunchDescriptor } from "./launch-descriptor-ceQfU8Vd.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/worker-environments/placement-dispatch-failure.ts
const RECOVERY_ERROR_LIMIT = 1024;
function boundedError(error) {
	return truncateUtf16Safe(redactSensitiveText(formatErrorMessage(error), { mode: "tools" }).replace(/\s+/gu, " ").trim() || "unknown dispatch failure", RECOVERY_ERROR_LIMIT);
}
function isUnavailableEnvironment(environment) {
	return environment.state === "draining" || environment.state === "destroying" || environment.state === "destroyed" || environment.state === "failed" || environment.state === "orphaned";
}
function createPlacementFailureActions(deps) {
	const { environments, placements } = deps;
	const updateFailure = (placement, error) => placements.fail({
		sessionId: placement.sessionId,
		expectedGeneration: placement.generation,
		recoveryError: boundedError(error)
	});
	const cleanupEnvironment = async (params) => {
		const teardownErrors = [];
		try {
			await environments.stopTunnel(params.environmentId, params.ownerEpoch ?? void 0);
		} catch (error) {
			teardownErrors.push(`tunnel stop: ${boundedError(error)}`);
		}
		try {
			await environments.destroy(params.environmentId);
		} catch (error) {
			teardownErrors.push(`environment destroy: ${boundedError(error)}`);
		}
		return teardownErrors;
	};
	const teardownEnvironment = async (params) => {
		const environmentId = params.environmentId;
		const teardownErrors = environmentId ? await cleanupEnvironment({
			environmentId,
			ownerEpoch: params.ownerEpoch
		}) : [];
		const recoveryError = [boundedError(params.primaryError), ...teardownErrors].join("; ");
		updateFailure(params.placement, new Error(truncateUtf16Safe(recoveryError, RECOVERY_ERROR_LIMIT)));
	};
	const retryFailedTeardown = async (placement) => {
		if (!placement.environmentId) return;
		const environment = environments.get(placement.environmentId);
		if (!environment || environment.state === "destroyed" || environment.state === "failed" || environment.state === "orphaned") return;
		const teardownErrors = await cleanupEnvironment({
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch
		});
		if (teardownErrors.length > 0) {
			const recoveryError = [placement.recoveryError, ...teardownErrors].filter(Boolean).join("; ");
			placements.fail({
				sessionId: placement.sessionId,
				expectedGeneration: placement.generation,
				recoveryError: truncateUtf16Safe(recoveryError, RECOVERY_ERROR_LIMIT)
			});
		}
	};
	const startDrain = (placement) => {
		const draining = placements.startDrain({
			sessionId: placement.sessionId,
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch,
			expectedGeneration: placement.generation
		});
		if (draining.state !== "draining") throw new Error("Worker placement drain did not produce a draining placement");
		return draining;
	};
	const startReconcile = (placement) => {
		const reconciling = placements.startReconcile({
			sessionId: placement.sessionId,
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch,
			expectedGeneration: placement.generation
		});
		if (reconciling.state !== "reconciling") throw new Error("Worker placement reconcile did not produce a reconciling placement");
		return reconciling;
	};
	const finishReconcilingFailure = (placement, error, teardownErrors) => {
		const recoveryError = [boundedError(error), ...teardownErrors].join("; ");
		updateFailure(placement, new Error(truncateUtf16Safe(recoveryError, RECOVERY_ERROR_LIMIT)));
	};
	const failDraining = async (placement, error, options = {}) => {
		if (placement.turnClaim && !options.forceClaimFence) return;
		const current = placements.get(placement.sessionId);
		if (current?.state !== "draining") return;
		const reconciling = startReconcile(current);
		const teardownErrors = await cleanupEnvironment({
			environmentId: current.environmentId,
			ownerEpoch: current.activeOwnerEpoch
		});
		finishReconcilingFailure(reconciling, error, teardownErrors);
	};
	const reclaimActive = async (placement, environment, claimedTurnError) => {
		if (placement.turnClaim) {
			const draining = startDrain(placement);
			await failDraining(draining, claimedTurnError, { forceClaimFence: true });
			return;
		}
		const draining = startDrain(placement);
		if (draining.turnClaim) {
			await failDraining(draining, claimedTurnError, { forceClaimFence: true });
			return;
		}
		const reconciling = startReconcile(draining);
		if (environment && !isUnavailableEnvironment(environment)) {
			const teardownErrors = await cleanupEnvironment({
				environmentId: placement.environmentId,
				ownerEpoch: placement.activeOwnerEpoch
			});
			if (teardownErrors.length > 0) {
				finishReconcilingFailure(reconciling, /* @__PURE__ */ new Error(`Worker reclaim teardown failed: ${teardownErrors.join("; ")}`), []);
				return;
			}
		}
		placements.transition({
			sessionId: reconciling.sessionId,
			from: "reconciling",
			to: "reclaimed",
			expectedGeneration: reconciling.generation
		});
	};
	const failActive = async (placement, error, options = {}) => {
		const draining = startDrain(placement);
		await failDraining(draining, error, options);
	};
	return {
		failActive,
		failDraining,
		reclaimActive,
		retryFailedTeardown,
		teardownEnvironment
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-finalize.ts
/** Rechecks both owners after renewing the remote quiescence lease. */
async function verifyReconciledWorkspaceFinal(reconciliation, quiescence) {
	if (reconciliation.applyPreparedStagedResult && reconciliation.publishStagedResult) try {
		await reconciliation.verifyStable();
		await quiescence.assertActive();
		await reconciliation.verifyStable();
		await reconciliation.applyPreparedStagedResult();
		await reconciliation.verifyLocalStable();
		await quiescence.assertActive();
		await reconciliation.verifyStable();
		await reconciliation.verifyLocalStable();
		await reconciliation.publishStagedResult();
		return reconciliation.getAppliedWorkspaceResult?.();
	} catch (error) {
		await reconciliation.discardPreparedStagedResult?.().catch(() => void 0);
		throw error;
	}
	await reconciliation.verifyStable();
	await reconciliation.verifyLocalStable();
	await quiescence.assertActive();
	await reconciliation.verifyStable();
	await reconciliation.verifyLocalStable();
	return reconciliation.getAppliedWorkspaceResult?.();
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-pending-results.ts
function sameActiveEnvironment$1(placement, environment) {
	return Boolean(environment && environment.state === "attached" && placement.environmentId && environment.environmentId === placement.environmentId && placement.activeOwnerEpoch !== null && environment.ownerEpoch === placement.activeOwnerEpoch && placement.workerBundleHash && environment.bootstrapReceipt?.bundleHash === placement.workerBundleHash && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === placement.sessionId);
}
async function recoverPendingWorkspaceResults(deps, cleanupOrphans) {
	const { environments, failure, placements } = deps;
	const stagedResultOwners = /* @__PURE__ */ new Set();
	for (const pending of placements.listPendingWorkspaceResults()) {
		if (pending.stagedResultRef) stagedResultOwners.add(pending.sessionId);
		const sameGatewayInstance = pending.gatewayInstanceId === placements.workspaceResultInstanceId();
		if (sameGatewayInstance && pending.recoveryRequestedAtMs === null) continue;
		const placement = placements.get(pending.sessionId);
		try {
			const claim = placement?.turnClaim;
			if (placement?.state !== "active" && placement?.state !== "draining" || placement.environmentId !== pending.environmentId || placement.activeOwnerEpoch !== pending.ownerEpoch || claim?.owner !== "worker" || claim.claimId !== pending.claimId || claim.runId !== pending.runId || claim.generation !== pending.placementGeneration || claim.ownerEpoch !== pending.ownerEpoch) {
				if (pending.stagedResultRef && pending.workspaceAcceptedAtMs === null) continue;
				if (pending.stagedResultRef) {
					if (!placement) throw new Error(`Staged cloud workspace result lost its placement: ${pending.sessionId}`);
					await deleteStagedWorkerWorkspaceResult({
						root: await deps.resolveWorkspacePath(placement),
						stagedResultRef: pending.stagedResultRef
					});
				}
				placements.abandonWorkspaceResult(pending);
				if (placement?.state === "active") await failure.failActive(placement, /* @__PURE__ */ new Error(`Pending cloud workspace result has no active claim: ${pending.sessionId}`), { forceClaimFence: true });
				else if (placement?.state === "draining") await failure.failDraining(placement, /* @__PURE__ */ new Error(`Pending cloud workspace result has no draining claim: ${pending.sessionId}`), { forceClaimFence: true });
				continue;
			}
			const turnClaim = {
				sessionId: placement.sessionId,
				claimId: claim.claimId,
				runId: claim.runId,
				placementGeneration: claim.generation,
				owner: {
					kind: "worker",
					environmentId: placement.environmentId,
					ownerEpoch: placement.activeOwnerEpoch
				}
			};
			const localPath = await deps.resolveWorkspacePath({
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId
			});
			const priorWorkspaceResultConflict = placement.workspaceResultConflict ?? await deps.resolveWorkspaceResultConflict({
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId
			});
			const canonicalStagedResultRef = workerWorkspaceResultRef(turnClaim.claimId);
			let stagedResultRef = pending.stagedResultRef;
			if (!stagedResultRef && await hasWorkerWorkspaceResultRef({
				root: localPath,
				stagedResultRef: canonicalStagedResultRef
			})) {
				placements.recordStagedWorkspaceResult(turnClaim, canonicalStagedResultRef);
				stagedResultRef = canonicalStagedResultRef;
				stagedResultOwners.add(pending.sessionId);
			}
			if (stagedResultRef && pending.workspaceAcceptedAtMs !== null) {
				if (!await hasWorkerWorkspaceResultRef({
					root: localPath,
					stagedResultRef
				})) {
					const cleanupRef = cleanupWorkerWorkspaceResultRef(stagedResultRef);
					if (await hasWorkerWorkspaceResultRef({
						root: localPath,
						stagedResultRef: cleanupRef
					})) stagedResultRef = cleanupRef;
				}
			}
			const hasPreparedResult = !stagedResultRef && await hasWorkerWorkspaceResultRef({
				root: localPath,
				stagedResultRef: preparedWorkerWorkspaceResultRef(canonicalStagedResultRef)
			});
			const environment = environments.get(placement.environmentId);
			if (environment?.state === "attached" && environment.attachedSessionIds.includes(placement.sessionId) && environment.attachedSessionIds.length !== 1) continue;
			const stagedResultExists = stagedResultRef ? await hasWorkerWorkspaceResultRef({
				root: localPath,
				stagedResultRef
			}) : false;
			if (stagedResultRef && !stagedResultExists) {
				if (pending.workspaceAcceptedAtMs === null) continue;
				if (environment && environment.state !== "destroyed" && environment.ownerEpoch === placement.activeOwnerEpoch) await environments.destroy(placement.environmentId);
				if (placements.completeWorkspaceResultAndReleaseTurn(turnClaim, { reclaim: true }).state !== "reclaimed") throw new Error("Recovered cleaned worker result did not reclaim its environment");
				await environments.stopTunnel(placement.environmentId, placement.activeOwnerEpoch).catch(() => void 0);
				continue;
			}
			if (stagedResultRef) {
				let ownedStagedResultRef = stagedResultRef;
				const owner = {
					sessionId: placement.sessionId,
					environmentId: placement.environmentId,
					ownerEpoch: placement.activeOwnerEpoch,
					placementGeneration: placement.generation
				};
				const journal = {
					load: () => placements.loadWorkspaceReconciliation(owner),
					begin: (next) => placements.beginWorkspaceReconciliation(owner, next),
					commit: (manifestRef) => placements.updateWorkspaceBaseManifest({
						claim: turnClaim,
						manifestRef
					}),
					abort: () => placements.abortWorkspaceReconciliation(owner)
				};
				await deps.workspaceOperations.run(placement.environmentId, async () => {
					const owned = placements.get(placement.sessionId);
					const ownedClaim = owned?.turnClaim;
					if (owned?.state !== "active" && owned?.state !== "draining" || owned.generation !== placement.generation || owned.environmentId !== placement.environmentId || owned.activeOwnerEpoch !== placement.activeOwnerEpoch || ownedClaim?.owner !== "worker" || ownedClaim.claimId !== claim.claimId || ownedClaim.runId !== claim.runId) throw new Error("Recovered workspace result lost its placement owner");
					const interrupted = journal.load();
					const alreadyApplied = interrupted?.appliedManifestRef !== void 0;
					if (interrupted && !alreadyApplied) {
						await recoverWorkerWorkspaceReconciliation({
							root: localPath,
							journal: interrupted
						});
						journal.abort();
					}
					const reconciliation = await applyStagedWorkerWorkspaceResult({
						root: localPath,
						stagedResultRef: ownedStagedResultRef,
						expectedBaseManifestRef: placement.workspaceBaseManifestRef,
						alreadyAccepted: pending.workspaceAcceptedAtMs !== null || alreadyApplied,
						journal
					});
					await reconciliation.verifyLocalStable();
					const conflictPaths = reconciliation.conflictPaths;
					const retainStagedResult = conflictPaths.length > 0;
					if (pending.workspaceAcceptedAtMs === null) placements.acceptWorkspaceResult(turnClaim);
					if (conflictPaths.length > 0 && isWorkerWorkspaceResultCleanupRef(ownedStagedResultRef)) {
						await restoreStagedWorkerWorkspaceResultFromCleanup({
							root: localPath,
							cleanupRef: ownedStagedResultRef,
							stagedResultRef: canonicalStagedResultRef
						});
						ownedStagedResultRef = canonicalStagedResultRef;
					}
					const supersededConflict = priorWorkspaceResultConflict && (conflictPaths.length === 0 || priorWorkspaceResultConflict.stagedResultRef !== ownedStagedResultRef) ? priorWorkspaceResultConflict : void 0;
					if (supersededConflict && supersededConflict.stagedResultRef !== ownedStagedResultRef) await deleteStagedWorkerWorkspaceResult({
						root: localPath,
						stagedResultRef: supersededConflict.stagedResultRef
					});
					if (conflictPaths.length > 0) {
						const projectedConflict = projectWorkspaceResultConflict(conflictPaths, ownedStagedResultRef);
						placements.recordWorkspaceResultConflict(turnClaim, projectedConflict);
						await deps.reportWorkspaceResultConflict({
							sessionId: placement.sessionId,
							sessionKey: placement.sessionKey,
							agentId: placement.agentId,
							...projectedConflict
						});
					} else if (supersededConflict) placements.recordWorkspaceResultConflict(turnClaim, void 0);
					if (supersededConflict && conflictPaths.length === 0) await deps.reportWorkspaceResultConflict({
						sessionId: placement.sessionId,
						sessionKey: placement.sessionKey,
						agentId: placement.agentId,
						cleared: true
					});
					const cleanupRef = !retainStagedResult ? isWorkerWorkspaceResultCleanupRef(ownedStagedResultRef) ? ownedStagedResultRef : await moveStagedWorkerWorkspaceResultToCleanup({
						root: localPath,
						stagedResultRef: ownedStagedResultRef
					}) : void 0;
					const currentEnvironment = environments.get(placement.environmentId);
					if (currentEnvironment && currentEnvironment.state !== "destroyed" && currentEnvironment.ownerEpoch === placement.activeOwnerEpoch) await environments.destroy(placement.environmentId);
					if (placements.completeWorkspaceResultAndReleaseTurn(turnClaim, { reclaim: true }).state !== "reclaimed") throw new Error("Recovered worker result did not reclaim its stale environment");
					if (cleanupRef) await deleteStagedWorkerWorkspaceResult({
						root: localPath,
						stagedResultRef: cleanupRef
					}).catch(() => void 0);
					await environments.stopTunnel(placement.environmentId, placement.activeOwnerEpoch).catch(() => void 0);
				});
				continue;
			}
			if (!sameActiveEnvironment$1(placement, environment)) {
				if (hasPreparedResult) continue;
				if (pending.workspaceAcceptedAtMs !== null && environment?.state === "destroyed") {
					placements.completeWorkspaceResultAndReleaseTurn(turnClaim, { reclaim: true });
					continue;
				}
				placements.abandonWorkspaceResult(pending);
				if (placement.state === "active") await failure.failActive(placement, /* @__PURE__ */ new Error(`Pending cloud workspace result lost its worker: ${pending.sessionId}`), { forceClaimFence: true });
				else await failure.failDraining(placement, /* @__PURE__ */ new Error(`Pending cloud workspace result lost its worker: ${pending.sessionId}`), { forceClaimFence: true });
				continue;
			}
			const owner = {
				sessionId: placement.sessionId,
				environmentId: placement.environmentId,
				ownerEpoch: placement.activeOwnerEpoch,
				placementGeneration: placement.generation
			};
			const journal = {
				load: () => placements.loadWorkspaceReconciliation(owner),
				begin: (next) => placements.beginWorkspaceReconciliation(owner, next),
				commit: (manifestRef) => placements.updateWorkspaceBaseManifest({
					claim: turnClaim,
					manifestRef
				}),
				abort: () => placements.abortWorkspaceReconciliation(owner)
			};
			const tunnel = await environments.startTunnel({
				environmentId: placement.environmentId,
				ownerEpoch: placement.activeOwnerEpoch
			});
			await deps.workspaceOperations.run(placement.environmentId, async () => {
				const owned = placements.get(placement.sessionId);
				const ownedClaim = owned?.turnClaim;
				if (owned?.state !== "active" && owned?.state !== "draining" || owned.generation !== placement.generation || owned.environmentId !== placement.environmentId || owned.activeOwnerEpoch !== placement.activeOwnerEpoch || ownedClaim?.owner !== "worker" || ownedClaim.claimId !== claim.claimId || ownedClaim.runId !== claim.runId) throw new Error("Recovered workspace result lost its placement owner");
				const quiescence = await tunnel.quiesceWorkspace(placement.remoteWorkspaceDir);
				let quiescenceHandled = false;
				try {
					const applied = await verifyReconciledWorkspaceFinal(await tunnel.reconcileWorkspace({
						localPath,
						remoteWorkspaceDir: placement.remoteWorkspaceDir,
						baseManifestRef: placement.workspaceBaseManifestRef,
						journal: { ...journal },
						stagedResult: {
							ref: canonicalStagedResultRef,
							record: (ref) => placements.recordStagedWorkspaceResult(turnClaim, ref)
						}
					}), quiescence);
					placements.acceptWorkspaceResult(turnClaim);
					const recordedStagedResultRef = placements.listPendingWorkspaceResults().find((result) => result.sessionId === turnClaim.sessionId && result.claimId === turnClaim.claimId && result.runId === turnClaim.runId)?.stagedResultRef;
					const conflictPaths = applied?.conflictPaths ?? [];
					if (conflictPaths.length > 0 && !recordedStagedResultRef) throw new Error("Recovered cloud workspace conflict has no staged result reference");
					const supersededConflict = priorWorkspaceResultConflict && (conflictPaths.length === 0 || priorWorkspaceResultConflict.stagedResultRef !== recordedStagedResultRef) ? priorWorkspaceResultConflict : void 0;
					if (supersededConflict && supersededConflict.stagedResultRef !== recordedStagedResultRef) await deleteStagedWorkerWorkspaceResult({
						root: localPath,
						stagedResultRef: supersededConflict.stagedResultRef
					});
					if (conflictPaths.length > 0 && recordedStagedResultRef) {
						const projectedConflict = projectWorkspaceResultConflict(conflictPaths, recordedStagedResultRef);
						placements.recordWorkspaceResultConflict(turnClaim, projectedConflict);
						await deps.reportWorkspaceResultConflict({
							sessionId: placement.sessionId,
							sessionKey: placement.sessionKey,
							agentId: placement.agentId,
							...projectedConflict
						});
					} else if (supersededConflict) placements.recordWorkspaceResultConflict(turnClaim, void 0);
					if (supersededConflict && conflictPaths.length === 0) await deps.reportWorkspaceResultConflict({
						sessionId: placement.sessionId,
						sessionKey: placement.sessionKey,
						agentId: placement.agentId,
						cleared: true
					});
					const cleanupRef = recordedStagedResultRef && conflictPaths.length === 0 ? await moveStagedWorkerWorkspaceResultToCleanup({
						root: localPath,
						stagedResultRef: recordedStagedResultRef
					}) : void 0;
					if (sameGatewayInstance) {
						await quiescence.resume();
						quiescenceHandled = true;
						placements.completeWorkspaceResultAndReleaseTurn(turnClaim);
					} else {
						await environments.destroy(placement.environmentId);
						quiescenceHandled = true;
						if (placements.completeWorkspaceResultAndReleaseTurn(turnClaim, { reclaim: true }).state !== "reclaimed") throw new Error("Recovered worker result did not reclaim its stale environment");
						await environments.stopTunnel(placement.environmentId, placement.activeOwnerEpoch).catch(() => void 0);
					}
					if (cleanupRef) await deleteStagedWorkerWorkspaceResult({
						root: localPath,
						stagedResultRef: cleanupRef
					}).catch(() => void 0);
				} finally {
					if (!quiescenceHandled) await quiescence.resume();
				}
			});
		} catch {}
	}
	if (cleanupOrphans) {
		const retainedCleanupRefs = new Set(placements.listPendingWorkspaceResults().flatMap((pending) => pending.stagedResultRef ? [cleanupWorkerWorkspaceResultRef(pending.stagedResultRef)] : []));
		const cleanedWorkspaceRoots = /* @__PURE__ */ new Set();
		for (const placement of placements.list()) try {
			const root = await deps.resolveWorkspacePath(placement);
			if (!cleanedWorkspaceRoots.has(root)) {
				cleanedWorkspaceRoots.add(root);
				await deleteWorkerWorkspaceResultCleanupRefs({
					root,
					retainedRefs: retainedCleanupRefs
				});
			}
		} catch {}
	}
	return /* @__PURE__ */ new Set([...stagedResultOwners, ...placements.listPendingWorkspaceResults().map((pending) => pending.sessionId)]);
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-recovery.ts
function sameActiveEnvironment(placement, environment) {
	return Boolean(environment && environment.state === "attached" && placement.environmentId && environment.environmentId === placement.environmentId && placement.activeOwnerEpoch !== null && environment.ownerEpoch === placement.activeOwnerEpoch && placement.workerBundleHash && environment.bootstrapReceipt?.bundleHash === placement.workerBundleHash && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === placement.sessionId);
}
function isStartingPlacement(placement) {
	return placement.state === "starting";
}
function isFailedPlacement(placement) {
	return placement.state === "failed";
}
function createPlacementRecoveryActions(deps) {
	const { environments, failure, placements } = deps;
	const adoptActive = async (placement) => {
		if (placement.turnClaim) {
			const error = /* @__PURE__ */ new Error("Active worker turn claim cannot be proven live after gateway restart");
			await failure.failActive(placement, error, { forceClaimFence: true });
			return;
		}
		const environment = placement.environmentId ? environments.get(placement.environmentId) : void 0;
		if (!environment || isUnavailableEnvironment(environment)) {
			await failure.reclaimActive(placement, environment, /* @__PURE__ */ new Error("Active worker disappeared during restart reconciliation"));
			return;
		}
		if (!sameActiveEnvironment(placement, environment)) {
			await failure.reclaimActive(placement, environment, /* @__PURE__ */ new Error("Active worker placement does not match its environment owner"));
			return;
		}
		try {
			await environments.startTunnel({
				environmentId: environment.environmentId,
				ownerEpoch: environment.ownerEpoch
			});
			placements.adoptActive({
				sessionId: placement.sessionId,
				expectedGeneration: placement.generation,
				environmentId: environment.environmentId,
				ownerEpoch: environment.ownerEpoch
			});
		} catch (error) {
			await failure.failActive(placement, error);
		}
	};
	const resumeStarting = async (placement) => {
		const environment = placement.environmentId ? environments.get(placement.environmentId) : void 0;
		const expectedBundle = placement.workerBundleHash;
		const hasSyncedWorkspace = Boolean(placement.workspaceBaseManifestRef && placement.remoteWorkspaceDir);
		if (!(environment && expectedBundle && environment.bootstrapReceipt?.bundleHash === expectedBundle && hasSyncedWorkspace)) {
			const error = /* @__PURE__ */ new Error("Interrupted worker dispatch cannot safely resume");
			await failure.teardownEnvironment({
				placement,
				environmentId: placement.environmentId,
				ownerEpoch: environment?.ownerEpoch ?? null,
				primaryError: error
			});
			return;
		}
		try {
			const ownerEpoch = environment.state === "attached" && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === placement.sessionId ? environment.ownerEpoch : environment.state === "ready" || environment.state === "idle" ? (await environments.attachSession({
				environmentId: environment.environmentId,
				ownerEpoch: environment.ownerEpoch,
				sessionId: placement.sessionId
			})).ownerEpoch : void 0;
			if (ownerEpoch === void 0) throw new Error(`Worker environment cannot resume dispatch from ${environment.state}`);
			await environments.startTunnel({
				environmentId: environment.environmentId,
				ownerEpoch
			});
			await deps.runActivationBarrier({
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId,
				activate: () => {
					const activated = placements.transition({
						sessionId: placement.sessionId,
						from: "starting",
						to: "active",
						expectedGeneration: placement.generation,
						patch: { activeOwnerEpoch: ownerEpoch }
					});
					if (activated.state !== "active") throw new Error("Worker dispatch activation did not produce an active placement");
					return activated;
				}
			});
		} catch (error) {
			await failure.teardownEnvironment({
				placement,
				environmentId: environment.environmentId,
				ownerEpoch: environment.ownerEpoch,
				primaryError: error
			});
		}
	};
	const reconcile = async () => {
		await environments.reconcileOnce();
		const pendingResultOwners = await recoverPendingWorkspaceResults(deps, true);
		const journalOwners = new Set(placements.listWorkspaceReconciliationOwners().map((owner) => owner.sessionId));
		for (const placement of placements.listForReconcile()) {
			if (journalOwners.has(placement.sessionId) || pendingResultOwners.has(placement.sessionId)) continue;
			if (placement.state === "local" || placement.state === "reclaimed") continue;
			if (placement.state === "active") {
				await adoptActive(placement);
				continue;
			}
			if (isFailedPlacement(placement)) {
				await failure.retryFailedTeardown(placement);
				continue;
			}
			if (isStartingPlacement(placement)) {
				await resumeStarting(placement);
				continue;
			}
			const error = /* @__PURE__ */ new Error(`Worker dispatch interrupted in ${placement.state}`);
			if (placement.state === "draining") {
				await failure.failDraining(placement, error, { forceClaimFence: true });
				continue;
			}
			await failure.teardownEnvironment({
				placement,
				environmentId: placement.environmentId,
				ownerEpoch: placement.activeOwnerEpoch,
				primaryError: error
			});
		}
	};
	const reconcileActive = async (environmentId) => {
		await environments.reconcileOnce();
		const pendingResultOwners = await recoverPendingWorkspaceResults(deps, false);
		const journalOwners = new Set(placements.listWorkspaceReconciliationOwners().map((owner) => owner.sessionId));
		for (const placement of placements.listForReconcile()) {
			if (journalOwners.has(placement.sessionId) || pendingResultOwners.has(placement.sessionId)) continue;
			if (environmentId !== void 0 && placement.environmentId !== environmentId) continue;
			if (isFailedPlacement(placement)) {
				await failure.retryFailedTeardown(placement);
				continue;
			}
			if (placement.state !== "active") continue;
			const environment = environments.get(placement.environmentId);
			if (!environment || isUnavailableEnvironment(environment)) {
				await failure.reclaimActive(placement, environment, /* @__PURE__ */ new Error("Active worker disappeared during an admitted turn"));
				continue;
			}
			if (!sameActiveEnvironment(placement, environment)) await failure.reclaimActive(placement, environment, /* @__PURE__ */ new Error("Active worker placement does not match its environment owner"));
		}
	};
	return {
		reconcile,
		reconcileActive
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-force-abandon.ts
async function tryResolveWorkspacePath(resolveWorkspacePath, placement) {
	try {
		return await resolveWorkspacePath(placement);
	} catch {
		return;
	}
}
async function forceAbandonWorkerEnvironment(params) {
	const { environmentId, placements } = params;
	const recoveryError = "Cloud worker result abandoned by forced operator teardown";
	for (const owner of placements.listWorkspaceReconciliationOwners()) {
		if (owner.environmentId !== environmentId) continue;
		const placement = placements.get(owner.sessionId);
		if (placement?.state !== "active" && placement?.state !== "draining" || placement.environmentId !== owner.environmentId || placement.activeOwnerEpoch !== owner.ownerEpoch || placement.generation !== owner.placementGeneration) throw new Error(`Forced teardown found a stale workspace journal: ${owner.sessionId}`);
		const journal = placements.loadWorkspaceReconciliation(owner);
		if (journal) {
			const root = await tryResolveWorkspacePath(params.resolveWorkspacePath, placement);
			if (root) await recoverWorkerWorkspaceReconciliation({
				root,
				journal
			});
			placements.abortWorkspaceReconciliation(owner);
		}
	}
	for (const pending of placements.listPendingWorkspaceResults()) if (pending.environmentId === environmentId) {
		const placement = placements.get(pending.sessionId);
		if (!placement) {
			if (pending.stagedResultRef) throw new Error(`Forced teardown found a staged result without a placement: ${pending.sessionId}`);
		} else {
			const root = await tryResolveWorkspacePath(params.resolveWorkspacePath, placement);
			if (root) {
				const finalRef = pending.stagedResultRef ?? workerWorkspaceResultRef(pending.claimId);
				const refs = [finalRef, preparedWorkerWorkspaceResultRef(finalRef)];
				for (const stagedResultRef of refs) if (await hasWorkerWorkspaceResultRef({
					root,
					stagedResultRef
				})) await deleteStagedWorkerWorkspaceResult({
					root,
					stagedResultRef
				});
			}
		}
		placements.abandonWorkspaceResult(pending);
	}
	for (const placement of placements.listForReconcile()) {
		if (placement.environmentId !== environmentId) continue;
		let current = placements.get(placement.sessionId);
		if (current?.state === "active") current = placements.startDrain({
			sessionId: current.sessionId,
			environmentId: current.environmentId,
			ownerEpoch: current.activeOwnerEpoch,
			expectedGeneration: current.generation
		});
		if (current?.state === "draining") current = placements.startReconcile({
			sessionId: current.sessionId,
			environmentId: current.environmentId,
			ownerEpoch: current.activeOwnerEpoch,
			expectedGeneration: current.generation
		});
		if (current && current.state !== "failed") placements.fail({
			sessionId: current.sessionId,
			expectedGeneration: current.generation,
			recoveryError
		});
	}
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch.ts
function requireProvisionedEnvironment(environment, expectedEnvironmentId) {
	if (environment.state !== "ready" && environment.state !== "idle" || !environment.bootstrapReceipt || environment.environmentId !== expectedEnvironmentId) throw new Error(`Worker environment is not dispatchable: ${environment.state}`);
	return {
		environmentId: environment.environmentId,
		ownerEpoch: environment.ownerEpoch,
		bundleHash: environment.bootstrapReceipt.bundleHash
	};
}
function createWorkerPlacementDispatchService(options) {
	const { environments, placements } = options;
	const failure = createPlacementFailureActions({
		environments,
		placements
	});
	const recovery = createPlacementRecoveryActions({
		environments,
		failure,
		placements,
		runActivationBarrier: options.runActivationBarrier,
		resolveWorkspacePath: options.resolveWorkspacePath,
		reportWorkspaceResultConflict: options.reportWorkspaceResultConflict,
		resolveWorkspaceResultConflict: options.resolveWorkspaceResultConflict,
		workspaceOperations: options.workspaceOperations
	});
	const dispatch = async (request) => {
		let placement;
		let environmentId = null;
		let ownerEpoch = null;
		try {
			placement = await options.runLocalBarrier({
				sessionId: request.sessionId,
				sessionKey: request.sessionKey,
				agentId: request.agentId,
				startDispatch: () => {
					placement = placements.startDispatch({
						sessionId: request.sessionId,
						sessionKey: request.sessionKey,
						agentId: request.agentId
					});
					return placement;
				}
			});
			const localPath = await options.resolveWorkspacePath(request);
			const idempotencyKey = `session-dispatch:${request.sessionId}:${placement.generation}`;
			const expectedEnvironmentId = workerEnvironmentIdForIdempotencyKey(idempotencyKey);
			placement = placements.transition({
				sessionId: request.sessionId,
				from: "requested",
				to: "provisioning",
				expectedGeneration: placement.generation,
				patch: { environmentId: expectedEnvironmentId }
			});
			const provisioned = requireProvisionedEnvironment(await environments.create(request.profileId, idempotencyKey), expectedEnvironmentId);
			environmentId = provisioned.environmentId;
			ownerEpoch = provisioned.ownerEpoch;
			placement = placements.transition({
				sessionId: request.sessionId,
				from: "provisioning",
				to: "syncing",
				expectedGeneration: placement.generation,
				patch: {
					environmentId,
					workerBundleHash: provisioned.bundleHash
				}
			});
			const synced = await (await environments.startTunnel({
				environmentId,
				ownerEpoch
			})).syncWorkspace({
				localPath,
				sessionId: request.sessionId,
				generation: placement.generation
			});
			placement = placements.transition({
				sessionId: request.sessionId,
				from: "syncing",
				to: "starting",
				expectedGeneration: placement.generation,
				patch: {
					workspaceBaseManifestRef: synced.manifestRef,
					remoteWorkspaceDir: synced.remoteWorkspaceDir
				}
			});
			ownerEpoch = (await environments.attachSession({
				environmentId,
				ownerEpoch,
				sessionId: request.sessionId
			})).ownerEpoch;
			await environments.startTunnel({
				environmentId,
				ownerEpoch
			});
			const startingPlacement = placement;
			return await options.runActivationBarrier({
				sessionId: request.sessionId,
				sessionKey: request.sessionKey,
				agentId: request.agentId,
				activate: () => {
					const activated = placements.transition({
						sessionId: request.sessionId,
						from: "starting",
						to: "active",
						expectedGeneration: startingPlacement.generation,
						patch: { activeOwnerEpoch: ownerEpoch }
					});
					if (activated.state !== "active") throw new Error("Worker dispatch activation did not produce an active placement");
					return activated;
				}
			});
		} catch (error) {
			const current = placement ? placements.get(request.sessionId) : void 0;
			if (current && current.state !== "local" && current.state !== "reclaimed") if (current.state === "active") await failure.failActive(current, error);
			else {
				const currentEnvironmentId = environmentId ?? current.environmentId;
				const currentEnvironment = currentEnvironmentId ? environments.get(currentEnvironmentId) : void 0;
				await failure.teardownEnvironment({
					placement: current,
					environmentId: currentEnvironment?.environmentId ?? null,
					ownerEpoch: ownerEpoch ?? currentEnvironment?.ownerEpoch ?? null,
					primaryError: error
				});
			}
			throw error;
		}
	};
	const reclaimOnce = async (request) => await options.runReclaimBarrier({
		...request,
		reclaim: async (localPath) => {
			const current = placements.get(request.sessionId);
			if (current?.state !== "active" || current.turnClaim) throw new Error(`Session ${request.sessionKey} cannot stop cloud worker from placement ${current?.state ?? "missing"}`);
			const environment = environments.get(current.environmentId);
			if (!environment || environment.state !== "attached" || environment.ownerEpoch !== current.activeOwnerEpoch || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== current.sessionId) throw new Error("Active cloud worker does not match its session placement");
			const journalOwner = {
				sessionId: current.sessionId,
				environmentId: current.environmentId,
				ownerEpoch: current.activeOwnerEpoch,
				placementGeneration: current.generation
			};
			const reclaimClaimId = `reclaim-${randomUUID()}`;
			const reclaimClaim = placements.claimReclaimWorkspaceResult({
				sessionId: current.sessionId,
				sessionKey: current.sessionKey,
				agentId: current.agentId,
				claimId: reclaimClaimId,
				runId: reclaimClaimId,
				owner: {
					kind: "worker",
					environmentId: current.environmentId,
					ownerEpoch: current.activeOwnerEpoch
				}
			});
			const reclaimResultRef = workerWorkspaceResultRef(reclaimClaim.claimId);
			let manifestAccepted = false;
			const journal = {
				load: () => placements.loadWorkspaceReconciliation(journalOwner),
				begin: (next) => placements.beginWorkspaceReconciliation(journalOwner, next),
				commit: (manifestRef) => {
					placements.updateWorkspaceBaseManifest({
						claim: reclaimClaim,
						manifestRef
					});
					manifestAccepted = true;
				},
				abort: () => placements.abortWorkspaceReconciliation(journalOwner)
			};
			const cancelEmptyFailedReclaim = async () => {
				await options.workspaceOperations.run(current.environmentId, async () => {
					const stillOwnsEmptyResult = () => {
						const owned = placements.get(current.sessionId);
						const currentEnvironment = environments.get(current.environmentId);
						const pendingResult = placements.listPendingWorkspaceResults().find((pending) => pending.sessionId === reclaimClaim.sessionId && pending.claimId === reclaimClaim.claimId && pending.runId === reclaimClaim.runId);
						return !manifestAccepted && owned?.state === "active" && owned.turnClaim?.claimId === reclaimClaim.claimId && reclaimClaim.owner.kind === "worker" && currentEnvironment?.state === "attached" && currentEnvironment.ownerEpoch === reclaimClaim.owner.ownerEpoch && currentEnvironment.attachedSessionIds.length === 1 && currentEnvironment.attachedSessionIds[0] === owned.sessionId && pendingResult?.workspaceAcceptedAtMs === null && pendingResult.stagedResultRef === null;
					};
					if (!stillOwnsEmptyResult()) return;
					const [canonicalExists, preparedExists] = await Promise.all([hasWorkerWorkspaceResultRef({
						root: localPath,
						stagedResultRef: reclaimResultRef
					}), hasWorkerWorkspaceResultRef({
						root: localPath,
						stagedResultRef: preparedWorkerWorkspaceResultRef(reclaimResultRef)
					})]);
					if (!canonicalExists && !preparedExists && stillOwnsEmptyResult()) placements.cancelWorkspaceResultAndReleaseTurn(reclaimClaim);
				});
			};
			const finishReclaim = async () => {
				const pending = journal.load();
				if (pending) {
					await recoverWorkerWorkspaceReconciliation({
						root: localPath,
						journal: pending
					});
					journal.abort();
				}
				const tunnel = await environments.startTunnel({
					environmentId: current.environmentId,
					ownerEpoch: current.activeOwnerEpoch
				});
				const reclaimed = await options.workspaceOperations.run(current.environmentId, async () => {
					const owned = placements.get(current.sessionId);
					if (owned?.state !== "active" || owned.generation !== current.generation || owned.environmentId !== current.environmentId || owned.activeOwnerEpoch !== current.activeOwnerEpoch || owned.turnClaim?.claimId !== reclaimClaim.claimId) throw new Error("Cloud worker stop lost its placement owner before reconciliation");
					const quiescence = await tunnel.quiesceWorkspace(current.remoteWorkspaceDir);
					let destroyed = false;
					try {
						const reconciliation = await tunnel.reconcileWorkspace({
							localPath,
							remoteWorkspaceDir: current.remoteWorkspaceDir,
							baseManifestRef: current.workspaceBaseManifestRef,
							journal,
							stagedResult: {
								ref: reclaimResultRef,
								record: (ref) => placements.recordStagedWorkspaceResult(reclaimClaim, ref)
							}
						});
						const applied = await verifyReconciledWorkspaceFinal(reconciliation, quiescence);
						if (reconciliation.changed && !manifestAccepted) throw new Error("Cloud worker stop did not commit its reconciled workspace");
						placements.acceptWorkspaceResult(reclaimClaim);
						const recordedStagedResultRef = placements.listPendingWorkspaceResults().find((result) => result.sessionId === reclaimClaim.sessionId && result.claimId === reclaimClaim.claimId && result.runId === reclaimClaim.runId)?.stagedResultRef;
						const conflictPaths = applied?.conflictPaths ?? [];
						if (conflictPaths.length > 0 && !recordedStagedResultRef) throw new Error("Cloud worker stop conflict has no staged result reference");
						const priorWorkspaceResultConflict = current.workspaceResultConflict ?? await options.resolveWorkspaceResultConflict({
							sessionId: current.sessionId,
							sessionKey: current.sessionKey,
							agentId: current.agentId
						});
						const retainedWorkspaceResultConflict = !reconciliation.changed && conflictPaths.length === 0 ? priorWorkspaceResultConflict : void 0;
						const supersededConflict = priorWorkspaceResultConflict && !retainedWorkspaceResultConflict && (conflictPaths.length === 0 || priorWorkspaceResultConflict.stagedResultRef !== recordedStagedResultRef) ? priorWorkspaceResultConflict : void 0;
						if (supersededConflict && supersededConflict.stagedResultRef !== recordedStagedResultRef) await deleteStagedWorkerWorkspaceResult({
							root: localPath,
							stagedResultRef: supersededConflict.stagedResultRef
						});
						if (conflictPaths.length > 0 && recordedStagedResultRef) {
							const projectedConflict = projectWorkspaceResultConflict(conflictPaths, recordedStagedResultRef);
							placements.recordWorkspaceResultConflict(reclaimClaim, projectedConflict);
							await options.reportWorkspaceResultConflict({
								sessionId: current.sessionId,
								sessionKey: current.sessionKey,
								agentId: current.agentId,
								...projectedConflict
							});
						} else if (retainedWorkspaceResultConflict) placements.recordWorkspaceResultConflict(reclaimClaim, retainedWorkspaceResultConflict);
						else if (supersededConflict) {
							placements.recordWorkspaceResultConflict(reclaimClaim, void 0);
							await options.reportWorkspaceResultConflict({
								sessionId: current.sessionId,
								sessionKey: current.sessionKey,
								agentId: current.agentId,
								cleared: true
							});
						}
						const cleanupRef = recordedStagedResultRef && conflictPaths.length === 0 ? await moveStagedWorkerWorkspaceResultToCleanup({
							root: localPath,
							stagedResultRef: recordedStagedResultRef
						}) : void 0;
						await environments.destroy(current.environmentId);
						destroyed = true;
						const completed = placements.completeWorkspaceResultAndReleaseTurn(reclaimClaim, { reclaim: true });
						if (completed.state !== "reclaimed") throw new Error("Cloud worker stop did not produce a reclaimed placement");
						if (cleanupRef) await deleteStagedWorkerWorkspaceResult({
							root: localPath,
							stagedResultRef: cleanupRef
						}).catch(() => void 0);
						return completed;
					} finally {
						if (!destroyed) await quiescence.resume();
					}
				});
				try {
					await environments.stopTunnel(current.environmentId, current.activeOwnerEpoch);
				} catch {}
				return reclaimed;
			};
			try {
				return await finishReclaim();
			} catch (error) {
				await cancelEmptyFailedReclaim().catch(() => void 0);
				throw error;
			}
		}
	});
	const reclaimInFlight = /* @__PURE__ */ new Map();
	const reclaim = async (request) => {
		const current = placements.get(request.sessionId);
		if (current?.state === "reclaimed") return current;
		const inFlight = reclaimInFlight.get(request.sessionId);
		if (inFlight) return await inFlight;
		const operation = reclaimOnce(request);
		reclaimInFlight.set(request.sessionId, operation);
		try {
			return await operation;
		} finally {
			if (reclaimInFlight.get(request.sessionId) === operation) reclaimInFlight.delete(request.sessionId);
		}
	};
	return {
		dispatch,
		forceDestroyEnvironment: (environmentId) => options.workspaceOperations.run(environmentId, async () => {
			await forceAbandonWorkerEnvironment({
				placements,
				environmentId,
				resolveWorkspacePath: options.resolveWorkspacePath
			});
			return await environments.destroy(environmentId);
		}),
		reclaim,
		reconcile: recovery.reconcile,
		reconcileActive: recovery.reconcileActive
	};
}
//#endregion
//#region src/gateway/worker-environments/reclaimed-placement-redispatch.ts
function createReclaimedPlacementRedispatch(params) {
	return async (placement) => {
		const previousEnvironment = params.environments.get(placement.environmentId);
		if (!previousEnvironment) throw new Error(`Reclaimed worker placement has no environment record: ${placement.environmentId}`);
		return await params.dispatch({
			sessionId: placement.sessionId,
			sessionKey: placement.sessionKey,
			agentId: placement.agentId,
			profileId: previousEnvironment.profileId
		});
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-admission.ts
const PREVIOUS_RESULT_RECONCILING_MESSAGE = "The previous cloud turn's workspace result is still reconciling; it retries automatically — try again shortly.";
function isActiveTurnClaimCollision(error, sessionId) {
	return error instanceof Error && error.message === `Session ${sessionId} already has an active turn claim`;
}
function required(value, field) {
	const normalized = value?.trim();
	if (!normalized) throw new Error(`Worker turn ${field} is required`);
	return normalized;
}
function latestDurableWorkspaceConflict(entries) {
	for (const entry of entries.toReversed()) {
		if (entry.type !== "custom_message") continue;
		if (entry.customType === "cloud-workspace-conflict-cleared") return;
		if (entry.customType !== "cloud-workspace-conflict") continue;
		const details = entry.details;
		if (!Array.isArray(details?.paths) || details.paths.length === 0 || !details.paths.every((entryPath) => typeof entryPath === "string" && entryPath.length > 0) || typeof details.stagedResultRef !== "string" || details.totalCount !== void 0 && (!Number.isSafeInteger(details.totalCount) || details.totalCount < details.paths.length) || !/^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(details.stagedResultRef)) return;
		return projectWorkspaceResultConflict(details.paths, details.stagedResultRef, details.totalCount);
	}
}
async function waitForTurnOperation(params) {
	const timeout = AbortSignal.timeout(params.timeoutMs);
	const signal = params.signal ? AbortSignal.any([params.signal, timeout]) : timeout;
	const abortError = () => signal.reason instanceof Error ? signal.reason : new Error("Cloud worker operation aborted", { cause: signal.reason });
	if (signal.aborted) throw abortError();
	return await new Promise((resolve, reject) => {
		const onAbort = () => reject(abortError());
		signal.addEventListener("abort", onAbort, { once: true });
		params.operation.then(resolve, reject).finally(() => {
			signal.removeEventListener("abort", onAbort);
		});
	});
}
function resolvePlacementIdentity(claim, placement) {
	return {
		sessionId: claim.sessionId,
		agentId: placement?.agentId ?? required(claim.agentId, "agent id"),
		sessionKey: placement?.sessionKey ?? required(claim.sessionKey, "session key")
	};
}
function requireActivePlacement(placement) {
	if (placement.state !== "active" || !placement.remoteWorkspaceDir || !placement.workerBundleHash) throw new Error(`Worker turn rejected in placement ${placement.state}`);
	return placement;
}
function releaseClaimIfOwned(placements, turnClaim) {
	if (placements.validateTurnClaim(turnClaim)) placements.releaseTurn(turnClaim);
}
async function claimWorkerTurn(params) {
	const claim = () => params.placements.claimTurn({
		...params.identity,
		claimId: randomUUID(),
		runId: params.runId,
		owner: {
			kind: "worker",
			environmentId: params.placement.environmentId,
			ownerEpoch: params.placement.activeOwnerEpoch
		}
	});
	try {
		return {
			placement: params.placement,
			turnClaim: claim()
		};
	} catch (error) {
		if (!isActiveTurnClaimCollision(error, params.identity.sessionId)) throw error;
		const activeClaim = params.placements.get(params.identity.sessionId)?.turnClaim;
		if (activeClaim?.runId === params.runId) throw error;
		if (!params.placements.listPendingWorkspaceResults().some((pending) => activeClaim?.owner === "worker" && pending.sessionId === params.identity.sessionId && pending.claimId === activeClaim.claimId && pending.runId === activeClaim.runId)) {
			const refreshed = params.placements.get(params.identity.sessionId);
			if (refreshed?.state !== "active" || refreshed.environmentId !== params.placement.environmentId || refreshed.activeOwnerEpoch !== params.placement.activeOwnerEpoch || refreshed.turnClaim) throw error;
			return {
				placement: refreshed,
				turnClaim: claim()
			};
		}
	}
	try {
		await params.placements.waitForTurnClaimRelease(params.identity.sessionId, {
			timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
			...params.signal ? { signal: params.signal } : {}
		});
	} catch (error) {
		if (params.signal?.aborted) throw error;
		throw new Error(PREVIOUS_RESULT_RECONCILING_MESSAGE, { cause: error });
	}
	const refreshed = params.placements.get(params.identity.sessionId);
	if (refreshed?.state !== "active" || refreshed.environmentId !== params.placement.environmentId || refreshed.activeOwnerEpoch !== params.placement.activeOwnerEpoch) throw new Error(PREVIOUS_RESULT_RECONCILING_MESSAGE);
	try {
		return {
			placement: refreshed,
			turnClaim: claim()
		};
	} catch (error) {
		if (isActiveTurnClaimCollision(error, params.identity.sessionId)) throw new Error(PREVIOUS_RESULT_RECONCILING_MESSAGE, { cause: error });
		throw error;
	}
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-payload.ts
function windowInitialMessages(messages) {
	const projected = messages.flatMap((message) => {
		const value = toWorkerTranscriptMessage(message);
		return value ? [value] : [];
	});
	if (projected.length <= 1024) return projected;
	const minimumStart = projected.length - WORKER_INFERENCE_MAX_CONTEXT_MESSAGES;
	const completeTurnStart = projected.findIndex((message, index) => index >= minimumStart && message.role === "user");
	if (completeTurnStart < 0) throw new Error("Worker turn transcript has no complete context window");
	return projected.slice(completeTurnStart);
}
function fitLaunchDescriptor(build, messages) {
	let initialMessages = messages;
	while (true) {
		const descriptor = build(initialMessages);
		if (Buffer.byteLength(JSON.stringify(descriptor), "utf8") <= 26214400) return descriptor;
		const nextTurn = initialMessages.findIndex((message, index) => index > 0 && message.role === "user");
		if (nextTurn < 0) throw new Error("Worker turn context exceeds the launch descriptor payload limit");
		initialMessages = initialMessages.slice(nextTurn);
	}
}
function parseRuntimeResult(stdout) {
	let value;
	try {
		value = JSON.parse(stdout.trim());
	} catch (error) {
		throw new Error("Worker process returned invalid output", { cause: error });
	}
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Worker process returned invalid output");
	const result = value;
	if (result.status === "failed" && result.reason === "turn-failed" && Object.keys(result).every((key) => ["status", "reason"].includes(key))) return result;
	if (result.status === "completed" && (result.transcriptLeafId === null || typeof result.transcriptLeafId === "string") && typeof result.transcriptNextSeq === "number" && Number.isSafeInteger(result.transcriptNextSeq) && result.transcriptNextSeq >= 1 && Object.keys(result).every((key) => [
		"status",
		"transcriptLeafId",
		"transcriptNextSeq"
	].includes(key))) return result;
	if (result.status === "fenced" && (result.reason === "credential-replaced" || result.reason === "owner-epoch-mismatch") && Object.keys(result).every((key) => ["status", "reason"].includes(key))) return result;
	throw new Error("Worker process returned invalid output");
}
function assistantText(message) {
	if (message.role !== "assistant") return "";
	return message.content.flatMap((part) => part.type === "text" ? [part.text] : []).join("");
}
function buildWorkerAgentMeta(params) {
	const usageAccumulator = createUsageAccumulator();
	const assistants = params.messages.filter((message) => message.role === "assistant");
	let lastRunPromptUsage;
	for (const assistant of assistants) {
		const usage = normalizeUsage(assistant.usage);
		mergeUsageIntoAccumulator(usageAccumulator, usage);
		if (hasNonzeroUsage(usage)) lastRunPromptUsage = usage;
	}
	const lastAssistant = assistants.at(-1);
	const usageMeta = buildUsageAgentMetaFields({
		usageAccumulator,
		lastAssistantUsage: lastAssistant?.usage,
		lastRunPromptUsage,
		lastTurnTotal: lastRunPromptUsage?.total
	});
	const reportedModelRef = resolveReportedModelRef({
		...params.modelRef,
		assistant: lastAssistant
	});
	return {
		provider: reportedModelRef.provider,
		model: reportedModelRef.model,
		usage: usageMeta.usage,
		lastCallUsage: usageMeta.lastCallUsage,
		promptTokens: usageMeta.promptTokens
	};
}
function resolveTurnModelRef(params) {
	const explicitProvider = params.provider?.trim();
	const explicitModel = params.model?.trim();
	const defaults = explicitProvider && explicitModel ? void 0 : resolveDefaultModelForAgent({
		cfg: params.config ?? {},
		agentId: params.agentId
	});
	return {
		provider: explicitProvider ?? defaults?.provider ?? "",
		model: explicitModel ?? defaults?.model ?? ""
	};
}
function assertSupportedTurn(params) {
	if (params.images?.length || params.imageOrder?.length) throw new Error("Cloud worker turns do not yet support current-turn image input");
	if (params.clientTools?.length) throw new Error("Cloud worker turns do not support client-provided tools");
	const modelRef = resolveTurnModelRef(params);
	const explicitRuntime = normalizeOptionalAgentRuntimeId(params.agentHarnessId) ?? normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
	const runtime = explicitRuntime && !isDefaultAgentRuntimeId(explicitRuntime) ? explicitRuntime : resolveEffectiveAgentRuntime({
		cfg: params.config ?? {},
		provider: modelRef.provider,
		modelId: modelRef.model,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	if (runtime !== "openclaw") throw new Error(`Cloud worker turns require the OpenClaw runtime, not ${runtime}`);
	return modelRef;
}
//#endregion
//#region src/gateway/worker-environments/workspace-operation-coordinator.ts
/** Serializes local workspace mutation and forced teardown per environment. */
function createWorkerWorkspaceOperationCoordinator() {
	const tails = /* @__PURE__ */ new Map();
	return { async run(environmentId, operation) {
		const result = (tails.get(environmentId) ?? Promise.resolve()).catch(() => void 0).then(operation);
		const tail = result.then(() => void 0, () => void 0);
		tails.set(environmentId, tail);
		tail.finally(() => {
			if (tails.get(environmentId) === tail) tails.delete(environmentId);
		});
		return await result;
	} };
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-launcher.ts
const WORKER_LAUNCH_SCRIPT = "exec node \"$HOME/.openclaw-worker/$1/openclaw.mjs\" worker";
var WorkerTurnExecutionError = class extends Error {};
var WorkerWorkspaceReconciliationError = class extends Error {};
async function executeLocalTurn(params) {
	const current = params.placements.get(params.claim.sessionId);
	const turnClaim = params.placements.claimTurn({
		...resolvePlacementIdentity(params.claim, current),
		claimId: randomUUID(),
		runId: params.claim.runId,
		owner: { kind: "local" }
	});
	try {
		return await params.runLocal();
	} finally {
		releaseClaimIfOwned(params.placements, turnClaim);
	}
}
function recoveryError(error) {
	return truncateUtf16Safe(redactSensitiveText(formatErrorMessage(error), { mode: "tools" }).replace(/\s+/gu, " ").trim() || "cloud worker turn failed", 1024);
}
async function failHandedOffTurn(params) {
	const failures = [recoveryError(params.error)];
	let draining;
	try {
		draining = params.placements.startDrain({
			sessionId: params.placement.sessionId,
			environmentId: params.placement.environmentId,
			ownerEpoch: params.placement.activeOwnerEpoch,
			expectedGeneration: params.placement.generation
		});
	} catch {
		return;
	}
	if (draining.state !== "draining") return;
	releaseClaimIfOwned(params.placements, params.turnClaim);
	try {
		await params.environments.stopTunnel(params.placement.environmentId, params.placement.activeOwnerEpoch);
	} catch (error) {
		failures.push(`tunnel stop: ${recoveryError(error)}`);
	}
	try {
		await params.environments.destroy(params.placement.environmentId);
	} catch (error) {
		failures.push(`environment destroy: ${recoveryError(error)}`);
	}
	try {
		const reconciling = params.placements.startReconcile({
			sessionId: draining.sessionId,
			environmentId: draining.environmentId,
			ownerEpoch: draining.activeOwnerEpoch,
			expectedGeneration: draining.generation
		});
		if (reconciling.state !== "reconciling") return;
		params.placements.fail({
			sessionId: reconciling.sessionId,
			expectedGeneration: reconciling.generation,
			recoveryError: truncateUtf16Safe(failures.join("; "), 1024)
		});
	} catch {}
}
async function executeWorkerTurn(params) {
	const { placement, turn } = params;
	const modelRef = assertSupportedTurn(turn);
	const environment = params.environments.get(placement.environmentId);
	if (!environment || environment.state !== "attached" || environment.ownerEpoch !== placement.activeOwnerEpoch || environment.bootstrapReceipt?.bundleHash !== placement.workerBundleHash || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== placement.sessionId) throw new Error("Active worker placement does not match its attached environment");
	let manifestAccepted = false;
	let workspaceConflict;
	let clearWorkspaceConflictAfterRelease = false;
	let journalOwner = {
		sessionId: placement.sessionId,
		environmentId: placement.environmentId,
		ownerEpoch: placement.activeOwnerEpoch,
		placementGeneration: placement.generation
	};
	const journal = {
		load: () => params.placements.loadWorkspaceReconciliation(journalOwner),
		begin: (next) => params.placements.beginWorkspaceReconciliation(journalOwner, next),
		commit: (manifestRef) => {
			params.placements.updateWorkspaceBaseManifest({
				claim: params.turnClaim,
				manifestRef
			});
			manifestAccepted = true;
		},
		abort: () => params.placements.abortWorkspaceReconciliation(journalOwner)
	};
	try {
		await params.workspaceOperations.run(placement.environmentId, async () => {
			if (!params.placements.validateTurnClaim(params.turnClaim)) throw new Error("Cloud worker workspace recovery lost its turn claim");
			const pending = journal.load();
			if (pending) {
				await recoverWorkerWorkspaceReconciliation({
					root: turn.workspaceDir,
					journal: pending
				});
				journal.abort();
			}
		});
	} catch (error) {
		throw new WorkerWorkspaceReconciliationError(`Cloud worker workspace recovery could not complete: ${recoveryError(error)}`, { cause: error });
	}
	const startedAt = Date.now();
	turn.onExecutionStarted?.({ lifecycleGeneration: turn.lifecycleGeneration });
	turn.onExecutionPhase?.({
		phase: "runner_entered",
		backend: "cloud-worker"
	});
	const manager = SessionManager.open(turn.sessionFile);
	const userMessageAlreadyPersisted = turn.suppressNextUserMessagePersistence === true || turn.userTurnTranscriptRecorder?.hasPersisted() === true;
	const contextMessages = convertToLlm(manager.buildSessionContext().messages);
	const leaf = manager.getLeafEntry();
	const initialMessages = windowInitialMessages(userMessageAlreadyPersisted && leaf?.type === "message" && leaf.message.role === "user" ? contextMessages.slice(0, -1) : contextMessages);
	let baseLeafId = manager.getLeafId();
	if (!userMessageAlreadyPersisted) {
		const persisted = turn.userTurnTranscriptRecorder ? await turn.userTurnTranscriptRecorder.persistApproved({ cwd: turn.workspaceDir }) : void 0;
		if (persisted) {
			baseLeafId = persisted.messageId;
			turn.userTurnTranscriptRecorder?.markRuntimePersisted(persisted.message);
			turn.onUserMessagePersisted?.(persisted.message);
		} else if (turn.userTurnTranscriptRecorder?.hasPersisted()) baseLeafId = SessionManager.open(turn.sessionFile).getLeafId();
		else if (!turn.userTurnTranscriptRecorder) {
			const message = {
				role: "user",
				content: [{
					type: "text",
					text: turn.transcriptPrompt ?? turn.prompt
				}],
				timestamp: Date.now()
			};
			baseLeafId = manager.appendMessage(message);
			turn.onUserMessagePersisted?.(message);
		} else throw new Error("Cloud worker turn could not persist its canonical user message");
	}
	turn.onExecutionPhase?.({
		phase: "model_resolution",
		backend: "cloud-worker",
		provider: modelRef.provider,
		model: modelRef.model
	});
	const credential = await params.environments.acquireTurnCredential({
		environmentId: placement.environmentId,
		ownerEpoch: placement.activeOwnerEpoch,
		sessionId: placement.sessionId
	});
	const tunnel = await waitForTurnOperation({
		operation: params.environments.startTunnel({
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch
		}),
		...turn.abortSignal ? { signal: turn.abortSignal } : {},
		timeoutMs: turn.timeoutMs
	});
	const reasoning = mapThinkingLevelForProvider(turn.thinkLevel);
	const descriptor = fitLaunchDescriptor((windowedMessages) => parseWorkerLaunchDescriptor({
		version: 1,
		socketPath: tunnel.remoteSocketPath,
		admission: {
			environmentId: placement.environmentId,
			credential: credential.credential,
			sessionId: placement.sessionId,
			ownerEpoch: placement.activeOwnerEpoch,
			rpcSetVersion: credential.rpcSetVersion,
			handshake: environment.bootstrapReceipt
		},
		assignment: {
			runId: turn.runId,
			turnId: randomUUID(),
			prompt: turn.prompt,
			suppressPromptTranscript: true,
			workspaceDir: placement.remoteWorkspaceDir,
			modelRef,
			inferenceOptions: reasoning ? { reasoning } : {},
			...turn.extraSystemPrompt === void 0 ? {} : { systemPrompt: turn.extraSystemPrompt },
			initialMessages: windowedMessages,
			transcript: {
				baseLeafId,
				nextSeq: (placement.lastTranscriptAckCursor ?? 0) + 1
			},
			liveEvents: {
				ackedSeq: placement.lastLiveEventAckCursor ?? 0,
				nextSeq: (placement.lastLiveEventAckCursor ?? 0) + 1
			}
		}
	}), initialMessages);
	turn.userTurnTranscriptRecorder?.markSentToProvider?.();
	turn.onExecutionPhase?.({
		phase: "attempt_dispatch",
		backend: "cloud-worker"
	});
	const handoffAbort = new AbortController();
	params.onHandoff();
	const processPromise = tunnel.runWorkspaceCommand({
		argv: [
			"sh",
			"-c",
			WORKER_LAUNCH_SCRIPT,
			"openclaw-worker",
			placement.workerBundleHash
		],
		input: JSON.stringify(descriptor),
		timeoutMs: turn.timeoutMs,
		signal: turn.abortSignal ? AbortSignal.any([turn.abortSignal, handoffAbort.signal]) : handoffAbort.signal
	});
	turn.onExecutionPhase?.({
		phase: "process_spawned",
		backend: "cloud-worker"
	});
	let credentialDelivered;
	try {
		credentialDelivered = params.environments.acknowledgeCredentialDelivery(credential);
	} catch (error) {
		handoffAbort.abort();
		await processPromise.catch(() => void 0);
		throw new Error("Cloud worker credential handoff failed", { cause: error });
	}
	if (!credentialDelivered) {
		handoffAbort.abort();
		await processPromise.catch(() => void 0);
		throw new Error("Cloud worker credential owner changed during process handoff");
	}
	const processResult = await processPromise;
	if (processResult.code !== 0 || processResult.signal !== null || processResult.killed) {
		const detail = truncateUtf16Safe(redactSensitiveText(processResult.stderr, { mode: "tools" }).replace(/\s+/gu, " ").trim(), 400);
		throw new Error(detail ? `Cloud worker process failed before completing the turn: ${detail}` : "Cloud worker process failed before completing the turn");
	}
	const runtimeResult = parseRuntimeResult(processResult.stdout);
	if (runtimeResult.status === "fenced") throw new Error(`Cloud worker turn was fenced: ${runtimeResult.reason}`);
	if (runtimeResult.status === "failed") throw new WorkerTurnExecutionError("Cloud worker turn failed");
	const completed = SessionManager.open(turn.sessionFile);
	const currentPlacement = params.placements.get(placement.sessionId);
	if (runtimeResult.transcriptLeafId !== completed.getLeafId() || runtimeResult.transcriptNextSeq !== (currentPlacement?.lastTranscriptAckCursor ?? 0) + 1) throw new Error("Cloud worker result does not match its committed transcript acknowledgement");
	if (currentPlacement?.state !== "active" && currentPlacement?.state !== "draining" || currentPlacement.environmentId !== placement.environmentId || currentPlacement.activeOwnerEpoch !== placement.activeOwnerEpoch) throw new Error("Cloud worker placement changed before workspace reconciliation");
	const priorWorkspaceConflict = currentPlacement.workspaceResultConflict ?? latestDurableWorkspaceConflict(completed.getBranch());
	const terminal = runtimeResult.transcriptLeafId ? completed.getEntry(runtimeResult.transcriptLeafId) : void 0;
	if (!terminal || terminal.type !== "message" || terminal.message.role !== "assistant") throw new Error("Cloud worker completed without a terminal assistant transcript message");
	if (!params.placements.listPendingWorkspaceResults().some((pending) => pending.sessionId === params.turnClaim.sessionId && pending.claimId === params.turnClaim.claimId && pending.runId === params.turnClaim.runId)) throw new Error("Cloud worker completed without a durable workspace-result fence");
	const text = assistantText(terminal.message);
	const baseIndex = completed.getBranch().findIndex((entry) => entry.id === baseLeafId);
	const workerMessages = completed.getBranch().slice(baseIndex + 1).flatMap((entry) => entry.type === "message" ? [entry.message] : []);
	journalOwner = {
		sessionId: currentPlacement.sessionId,
		environmentId: currentPlacement.environmentId,
		ownerEpoch: currentPlacement.activeOwnerEpoch,
		placementGeneration: currentPlacement.generation
	};
	try {
		await params.workspaceOperations.run(currentPlacement.environmentId, async () => {
			if (!params.placements.validateTurnClaim(params.turnClaim)) throw new Error("Cloud worker workspace result lost its turn claim");
			const quiescence = await tunnel.quiesceWorkspace(currentPlacement.remoteWorkspaceDir);
			let resumed = false;
			try {
				const stagedResultRef = workerWorkspaceResultRef(params.turnClaim.claimId);
				const applied = await verifyReconciledWorkspaceFinal(await tunnel.reconcileWorkspace({
					localPath: turn.workspaceDir,
					remoteWorkspaceDir: currentPlacement.remoteWorkspaceDir,
					baseManifestRef: currentPlacement.workspaceBaseManifestRef,
					journal,
					stagedResult: {
						ref: stagedResultRef,
						record: (ref) => params.placements.recordStagedWorkspaceResult(params.turnClaim, ref)
					}
				}), quiescence);
				if (!manifestAccepted) throw new Error("Cloud worker workspace reconciliation was not durably accepted");
				params.placements.acceptWorkspaceResult(params.turnClaim);
				const recordedStagedResultRef = params.placements.listPendingWorkspaceResults().find((pending) => pending.sessionId === params.turnClaim.sessionId && pending.claimId === params.turnClaim.claimId && pending.runId === params.turnClaim.runId)?.stagedResultRef;
				if (applied?.conflictPaths.length && !recordedStagedResultRef) throw new Error("Cloud workspace conflict has no staged result reference");
				const supersededWorkspaceConflict = priorWorkspaceConflict && (!applied?.conflictPaths.length || priorWorkspaceConflict.stagedResultRef !== recordedStagedResultRef) ? priorWorkspaceConflict : void 0;
				if (supersededWorkspaceConflict && supersededWorkspaceConflict.stagedResultRef !== recordedStagedResultRef) await deleteStagedWorkerWorkspaceResult({
					root: turn.workspaceDir,
					stagedResultRef: supersededWorkspaceConflict.stagedResultRef
				});
				if (applied?.conflictPaths.length && recordedStagedResultRef) {
					const projectedConflict = projectWorkspaceResultConflict(applied.conflictPaths, recordedStagedResultRef);
					workspaceConflict = {
						...projectedConflict,
						summary: formatWorkspaceConflictSummary(projectedConflict.paths, projectedConflict.stagedResultRef, projectedConflict.totalCount)
					};
					params.placements.recordWorkspaceResultConflict(params.turnClaim, {
						paths: workspaceConflict.paths,
						stagedResultRef: workspaceConflict.stagedResultRef,
						totalCount: workspaceConflict.totalCount
					});
					SessionManager.open(turn.sessionFile).appendCustomMessageEntry(WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, workspaceConflict.summary, true, {
						paths: workspaceConflict.paths,
						stagedResultRef: workspaceConflict.stagedResultRef,
						totalCount: workspaceConflict.totalCount
					});
				} else if (priorWorkspaceConflict) {
					params.placements.recordWorkspaceResultConflict(params.turnClaim, void 0);
					clearWorkspaceConflictAfterRelease = true;
				}
				if (clearWorkspaceConflictAfterRelease) SessionManager.open(turn.sessionFile).appendCustomMessageEntry(WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE, "A later cloud workspace result superseded the previous conflict.", false);
				const cleanupRef = recordedStagedResultRef && !workspaceConflict ? await moveStagedWorkerWorkspaceResultToCleanup({
					root: turn.workspaceDir,
					stagedResultRef: recordedStagedResultRef
				}) : void 0;
				await quiescence.resume();
				resumed = true;
				params.placements.completeWorkspaceResultAndReleaseTurn(params.turnClaim);
				if (cleanupRef) await deleteStagedWorkerWorkspaceResult({
					root: turn.workspaceDir,
					stagedResultRef: cleanupRef
				}).catch(() => void 0);
			} finally {
				if (!resumed) await quiescence.resume();
			}
		});
	} catch (error) {
		throw new WorkerWorkspaceReconciliationError(`Cloud worker finished, but its workspace result could not be reconciled: ${recoveryError(error)}`, { cause: error });
	}
	if (workspaceConflict) {
		const reportedWorkspaceConflict = workspaceConflict;
		await Promise.resolve().then(() => turn.onAgentEvent?.({
			stream: "assistant",
			data: {
				text: text ? `${text}\n\n${reportedWorkspaceConflict.summary}` : reportedWorkspaceConflict.summary,
				delta: `${text ? "\n\n" : ""}${reportedWorkspaceConflict.summary}`
			}
		})).catch(() => void 0);
	}
	const replyText = workspaceConflict ? text ? `${text}\n\n${workspaceConflict.summary}` : workspaceConflict.summary : text;
	return {
		...replyText ? { payloads: [{ text: replyText }] } : {},
		meta: {
			durationMs: Date.now() - startedAt,
			agentMeta: {
				sessionId: placement.sessionId,
				sessionFile: turn.sessionFile,
				...buildWorkerAgentMeta({
					messages: workerMessages,
					modelRef
				})
			},
			stopReason: terminal.message.stopReason
		}
	};
}
function createWorkerSessionTurnPlacementProvider(options) {
	const workspaceOperations = options.workspaceOperations ?? createWorkerWorkspaceOperationCoordinator();
	return {
		async executeLocalTurn(claim, runLocal) {
			if (!options.placements.get(claim.sessionId) && options.admitNewPlacements === false) return await runLocal();
			return await executeLocalTurn({
				claim,
				placements: options.placements,
				runLocal
			});
		},
		async executeTurn(claim, turn, runLocal) {
			const current = options.placements.get(claim.sessionId);
			if (!current && (options.admitNewPlacements === false || turn.modelRun === true && !claim.sessionKey?.trim())) return await runLocal();
			if (!current || current.state === "local") return await executeLocalTurn({
				claim,
				placements: options.placements,
				runLocal
			});
			let routablePlacement = current;
			if (routablePlacement.state === "reclaimed") {
				if (!options.redispatchReclaimed) throw new Error("Reclaimed worker placement requires redispatch");
				routablePlacement = await options.redispatchReclaimed(routablePlacement);
			}
			const identity = resolvePlacementIdentity(claim, routablePlacement);
			let placement = requireActivePlacement(routablePlacement);
			const admitted = await claimWorkerTurn({
				placements: options.placements,
				identity,
				placement,
				runId: claim.runId,
				...turn.abortSignal ? { signal: turn.abortSignal } : {}
			});
			placement = admitted.placement;
			const turnClaim = admitted.turnClaim;
			let handedOff = false;
			try {
				return await executeWorkerTurn({
					environments: options.environments,
					onHandoff: () => {
						handedOff = true;
					},
					placement,
					placements: options.placements,
					workspaceOperations,
					turn,
					turnClaim
				});
			} catch (error) {
				if (options.placements.listPendingWorkspaceResults().some((pending) => pending.sessionId === turnClaim.sessionId && pending.claimId === turnClaim.claimId && pending.runId === turnClaim.runId)) {
					options.placements.handoffWorkspaceResultRecovery(turnClaim);
					throw error;
				}
				if (error instanceof WorkerWorkspaceReconciliationError && !handedOff) {
					releaseClaimIfOwned(options.placements, turnClaim);
					throw error;
				}
				if (error instanceof WorkerTurnExecutionError) {
					if (options.placements.validateTurnClaim(turnClaim)) {
						options.placements.releaseTurn(turnClaim);
						throw error;
					}
				}
				if (handedOff) await failHandedOffTurn({
					environments: options.environments,
					placements: options.placements,
					placement,
					turnClaim,
					error
				});
				else releaseClaimIfOwned(options.placements, turnClaim);
				throw error;
			}
		}
	};
}
//#endregion
//#region src/gateway/worker-workspace-conflict-transcript.ts
function createWorkerWorkspaceConflictTranscriptHandlers(loadSessionRuntime) {
	return {
		resolveWorkspaceResultConflict: async (identity) => {
			const { resolveFreshestSessionEntryFromStoreKeys, resolveGatewaySessionStoreTargetWithStore } = await loadSessionRuntime();
			const target = resolveGatewaySessionStoreTargetWithStore({
				cfg: getRuntimeConfig(),
				key: identity.sessionKey,
				agentId: identity.agentId,
				clone: false
			});
			if (resolveFreshestSessionEntryFromStoreKeys(target.store, target.storeKeys)?.sessionId !== identity.sessionId) return;
			return await withTranscriptWriteTransaction({
				agentId: target.agentId,
				sessionId: identity.sessionId,
				sessionKey: target.canonicalKey,
				storePath: target.storePath
			}, ({ sessionFile }) => {
				for (const transcriptEntry of SessionManager.open(sessionFile).getBranch().toReversed()) {
					if (transcriptEntry.type !== "custom_message") continue;
					if (transcriptEntry.customType === "cloud-workspace-conflict-cleared") return;
					if (transcriptEntry.customType !== "cloud-workspace-conflict") continue;
					const details = transcriptEntry.details;
					if (Array.isArray(details?.paths) && details.paths.length > 0 && details.paths.every((entryPath) => typeof entryPath === "string" && entryPath.length > 0) && typeof details.stagedResultRef === "string" && (details.totalCount === void 0 || Number.isSafeInteger(details.totalCount) && details.totalCount >= details.paths.length) && /^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(details.stagedResultRef)) return projectWorkspaceResultConflict(details.paths, details.stagedResultRef, details.totalCount);
					return;
				}
			});
		},
		reportWorkspaceResultConflict: async (conflict) => {
			const { resolveFreshestSessionEntryFromStoreKeys, resolveGatewaySessionStoreTargetWithStore } = await loadSessionRuntime();
			const target = resolveGatewaySessionStoreTargetWithStore({
				cfg: getRuntimeConfig(),
				key: conflict.sessionKey,
				agentId: conflict.agentId,
				clone: false
			});
			if (resolveFreshestSessionEntryFromStoreKeys(target.store, target.storeKeys)?.sessionId !== conflict.sessionId) throw new Error(`Recovered cloud workspace conflict lost session ${conflict.sessionId}`);
			await withTranscriptWriteTransaction({
				agentId: target.agentId,
				sessionId: conflict.sessionId,
				sessionKey: target.canonicalKey,
				storePath: target.storePath
			}, ({ sessionFile }) => {
				const manager = SessionManager.open(sessionFile);
				const latestConflictEntry = manager.getBranch().toReversed().find((transcriptEntry) => transcriptEntry.type === "custom_message" && (transcriptEntry.customType === "cloud-workspace-conflict" || transcriptEntry.customType === "cloud-workspace-conflict-cleared"));
				if ("cleared" in conflict) {
					if (latestConflictEntry?.type !== "custom_message" || latestConflictEntry.customType !== "cloud-workspace-conflict-cleared") manager.appendCustomMessageEntry(WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE, "A later cloud workspace result superseded the previous conflict.", false);
					return;
				}
				const projectedConflict = projectWorkspaceResultConflict(conflict.paths, conflict.stagedResultRef, conflict.totalCount);
				const details = latestConflictEntry?.type === "custom_message" ? latestConflictEntry.details : void 0;
				if (!(latestConflictEntry?.type === "custom_message" && latestConflictEntry.customType === "cloud-workspace-conflict" && details?.stagedResultRef === projectedConflict.stagedResultRef && details.totalCount === projectedConflict.totalCount && Array.isArray(details.paths) && JSON.stringify(details.paths) === JSON.stringify(projectedConflict.paths))) manager.appendCustomMessageEntry(WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, formatWorkspaceConflictSummary(projectedConflict.paths, projectedConflict.stagedResultRef, projectedConflict.totalCount), true, projectedConflict);
			});
		}
	};
}
//#endregion
//#region src/gateway/server-worker-placement-startup.ts
const WORKER_PLACEMENT_RECONCILE_INTERVAL_MS = 6e4;
const workerPlacementLog = createSubsystemLogger("gateway/worker-placement");
const loadWorkerPlacementSessionRuntimeModule = createLazyRuntimeModule(async () => {
	const [placementSessionRuntime, { managedWorktrees }, sessionUtils] = await Promise.all([
		import("./placement-session-runtime-CWh9hEDt.js"),
		import("./service-DNXT5RaW.js"),
		import("./session-utils-Jdwy9RSP.js")
	]);
	return {
		isWorkerPlacementSessionRuntimeSupported: placementSessionRuntime.isWorkerPlacementSessionRuntimeSupported,
		managedWorktrees,
		resolveWorkerPlacementSessionRuntime: placementSessionRuntime.resolveWorkerPlacementSessionRuntime,
		resolveFreshestSessionEntryFromStoreKeys: sessionUtils.resolveFreshestSessionEntryFromStoreKeys,
		resolveGatewaySessionStoreTargetWithStore: sessionUtils.resolveGatewaySessionStoreTargetWithStore
	};
});
var WorkerDispatchTargetChangedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "invalid_state";
	}
};
/** Serializes reconciliation sweeps against in-flight dispatches so a sweep never
* observes a placement mid-transition. Dispatches wait out any pending sweep. */
function coordinateWorkerPlacementDispatch(service) {
	let activeDispatchCount = 0;
	let reconciliation;
	const dispatchIdleWaiters = /* @__PURE__ */ new Set();
	const waitForDispatchIdle = () => {
		if (activeDispatchCount === 0) return Promise.resolve();
		return new Promise((resolve) => {
			dispatchIdleWaiters.add(resolve);
		});
	};
	const runReconciliation = (operation) => {
		if (reconciliation) return reconciliation;
		const current = (async () => {
			await waitForDispatchIdle();
			await operation();
		})();
		reconciliation = current;
		const clearCurrent = () => {
			if (reconciliation === current) reconciliation = void 0;
		};
		current.then(clearCurrent, clearCurrent);
		return current;
	};
	const runExclusivePlacementOperation = (operation) => {
		const current = (async () => {
			const pendingReconciliation = reconciliation;
			if (pendingReconciliation) await pendingReconciliation.catch(() => void 0);
			await waitForDispatchIdle();
			return await operation();
		})();
		const barrier = current.then(() => void 0, () => void 0);
		reconciliation = barrier;
		return current.finally(() => {
			if (reconciliation === barrier) reconciliation = void 0;
		});
	};
	const runPlacementOperation = async (operation) => {
		for (;;) {
			const pendingReconciliation = reconciliation;
			if (!pendingReconciliation) break;
			await pendingReconciliation.catch(() => void 0);
		}
		activeDispatchCount += 1;
		try {
			return await operation();
		} finally {
			activeDispatchCount -= 1;
			if (activeDispatchCount === 0) {
				const waiters = [...dispatchIdleWaiters];
				dispatchIdleWaiters.clear();
				for (const resolve of waiters) resolve();
			}
		}
	};
	return {
		dispatch: async (request) => await runPlacementOperation(() => service.dispatch(request)),
		forceDestroyEnvironment: (environmentId) => runExclusivePlacementOperation(() => service.forceDestroyEnvironment(environmentId)),
		reclaim: async (request) => await runPlacementOperation(() => service.reclaim(request)),
		reconcile: () => runReconciliation(service.reconcile),
		reconcileActive: () => runReconciliation(service.reconcileActive)
	};
}
function createGatewayWorkerPlacementRuntime(params) {
	const workspaceOperations = createWorkerWorkspaceOperationCoordinator();
	const workspaceConflictHandlers = createWorkerWorkspaceConflictTranscriptHandlers(loadWorkerPlacementSessionRuntimeModule);
	const resolveWorkspacePath = async ({ sessionId, sessionKey, agentId }) => {
		const { managedWorktrees, resolveFreshestSessionEntryFromStoreKeys, resolveGatewaySessionStoreTargetWithStore } = await loadWorkerPlacementSessionRuntimeModule();
		const target = resolveGatewaySessionStoreTargetWithStore({
			cfg: getRuntimeConfig(),
			key: sessionKey,
			agentId,
			clone: false
		});
		const sessionEntry = resolveFreshestSessionEntryFromStoreKeys(target.store, target.storeKeys);
		const worktree = managedWorktrees.findLiveByOwner("session", target.canonicalKey);
		if (sessionEntry?.sessionId !== sessionId || !sessionEntry.worktree?.id || !worktree || worktree.id !== sessionEntry.worktree.id || worktree.ownerId !== target.canonicalKey) throw new Error(`Session ${sessionKey} dispatch requires a session-owned managed worktree`);
		return worktree.path;
	};
	const dispatchService = coordinateWorkerPlacementDispatch(createWorkerPlacementDispatchService({
		placements: params.placements,
		environments: params.environments,
		...workspaceConflictHandlers,
		runLocalBarrier: async ({ sessionId, sessionKey, agentId, startDispatch }) => {
			const { isWorkerPlacementSessionRuntimeSupported, managedWorktrees, resolveFreshestSessionEntryFromStoreKeys, resolveGatewaySessionStoreTargetWithStore, resolveWorkerPlacementSessionRuntime } = await loadWorkerPlacementSessionRuntimeModule();
			const target = resolveGatewaySessionStoreTargetWithStore({
				cfg: getRuntimeConfig(),
				key: sessionKey,
				agentId,
				clone: false
			});
			const lifecycleIdentities = [
				sessionKey,
				target.canonicalKey,
				...target.storeKeys,
				sessionId
			];
			let placement;
			await runExclusiveSessionLifecycleMutation({
				scope: target.storePath,
				identities: lifecycleIdentities,
				prepare: async () => {
					const currentConfig = getRuntimeConfig();
					const currentTarget = resolveGatewaySessionStoreTargetWithStore({
						cfg: currentConfig,
						key: sessionKey,
						agentId,
						clone: false
					});
					const currentEntry = resolveFreshestSessionEntryFromStoreKeys(currentTarget.store, currentTarget.storeKeys);
					const worktree = managedWorktrees.findLiveByOwner("session", currentTarget.canonicalKey);
					if (currentTarget.storePath !== target.storePath || currentTarget.canonicalKey !== target.canonicalKey || currentTarget.agentId !== target.agentId || currentEntry?.sessionId !== sessionId || !currentEntry.worktree?.id || !worktree || worktree.id !== currentEntry.worktree.id || worktree.ownerId !== currentTarget.canonicalKey) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} changed before cloud worker dispatch. Retry.`);
					if (currentEntry.archivedAt !== void 0) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} was archived before cloud worker dispatch. Retry.`);
					const currentRuntime = resolveWorkerPlacementSessionRuntime({
						cfg: currentConfig,
						entry: currentEntry,
						agentId: currentTarget.agentId,
						sessionKey: currentTarget.canonicalKey
					});
					if (!isWorkerPlacementSessionRuntimeSupported(currentRuntime)) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} runtime changed to ${currentRuntime} before cloud worker dispatch. Retry.`);
					placement = startDispatch();
					clearSessionQueues(lifecycleIdentities);
					params.revokeSessionAuthority({
						sessionId,
						sessionKeys: lifecycleIdentities
					});
					if (!await interruptSessionWorkAdmissions({
						scope: target.storePath,
						identities: lifecycleIdentities,
						timeoutMs: 15e3
					})) throw new Error(`Session ${sessionKey} is still active; dispatch stopped`);
					await params.placements.waitForTurnClaimRelease(sessionId, { timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS });
					await runExclusiveSessionStoreWrite(target.storePath, async () => {}, { reentrant: true });
				},
				run: async () => {
					if (!placement) throw new Error(`Session ${sessionKey} dispatch barrier did not start`);
				}
			});
			if (!placement) throw new Error(`Session ${sessionKey} dispatch barrier did not complete`);
			return placement;
		},
		runActivationBarrier: async ({ sessionId, sessionKey, agentId, activate }) => {
			const { isWorkerPlacementSessionRuntimeSupported, managedWorktrees, resolveFreshestSessionEntryFromStoreKeys, resolveGatewaySessionStoreTargetWithStore, resolveWorkerPlacementSessionRuntime } = await loadWorkerPlacementSessionRuntimeModule();
			const target = resolveGatewaySessionStoreTargetWithStore({
				cfg: getRuntimeConfig(),
				key: sessionKey,
				agentId,
				clone: false
			});
			const lifecycleIdentities = [
				sessionKey,
				target.canonicalKey,
				...target.storeKeys,
				sessionId
			];
			let activePlacement;
			await runExclusiveSessionLifecycleMutation({
				scope: target.storePath,
				identities: lifecycleIdentities,
				run: async () => {
					const currentConfig = getRuntimeConfig();
					const currentTarget = resolveGatewaySessionStoreTargetWithStore({
						cfg: currentConfig,
						key: sessionKey,
						agentId,
						clone: false
					});
					const currentEntry = resolveFreshestSessionEntryFromStoreKeys(currentTarget.store, currentTarget.storeKeys);
					const worktree = managedWorktrees.findLiveByOwner("session", currentTarget.canonicalKey);
					if (currentTarget.storePath !== target.storePath || currentTarget.canonicalKey !== target.canonicalKey || currentTarget.agentId !== target.agentId || currentEntry?.sessionId !== sessionId || !currentEntry.worktree?.id || !worktree || worktree.id !== currentEntry.worktree.id || worktree.ownerId !== currentTarget.canonicalKey) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} changed before cloud worker activation. Retry.`);
					if (currentEntry.archivedAt !== void 0) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} was archived before cloud worker activation. Retry.`);
					const currentRuntime = resolveWorkerPlacementSessionRuntime({
						cfg: currentConfig,
						entry: currentEntry,
						agentId: currentTarget.agentId,
						sessionKey: currentTarget.canonicalKey
					});
					if (!isWorkerPlacementSessionRuntimeSupported(currentRuntime)) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} runtime changed to ${currentRuntime} before cloud worker activation. Retry.`);
					activePlacement = activate();
				}
			});
			if (!activePlacement) throw new Error(`Session ${sessionKey} activation barrier did not complete`);
			return activePlacement;
		},
		runReclaimBarrier: async ({ sessionId, sessionKey, agentId, reclaim }) => {
			const { managedWorktrees, resolveFreshestSessionEntryFromStoreKeys, resolveGatewaySessionStoreTargetWithStore } = await loadWorkerPlacementSessionRuntimeModule();
			const target = resolveGatewaySessionStoreTargetWithStore({
				cfg: getRuntimeConfig(),
				key: sessionKey,
				agentId,
				clone: false
			});
			const lifecycleIdentities = [
				sessionKey,
				target.canonicalKey,
				...target.storeKeys,
				sessionId
			];
			let worktreePath;
			let reclaimedPlacement;
			await runExclusiveSessionLifecycleMutation({
				scope: target.storePath,
				identities: lifecycleIdentities,
				prepare: async () => {
					const currentTarget = resolveGatewaySessionStoreTargetWithStore({
						cfg: getRuntimeConfig(),
						key: sessionKey,
						agentId,
						clone: false
					});
					const currentEntry = resolveFreshestSessionEntryFromStoreKeys(currentTarget.store, currentTarget.storeKeys);
					const worktree = managedWorktrees.findLiveByOwner("session", currentTarget.canonicalKey);
					if (currentTarget.storePath !== target.storePath || currentTarget.canonicalKey !== target.canonicalKey || currentTarget.agentId !== target.agentId || currentEntry?.sessionId !== sessionId || !currentEntry.worktree?.id || !worktree || worktree.id !== currentEntry.worktree.id || worktree.ownerId !== currentTarget.canonicalKey) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} changed before cloud worker stop. Retry.`);
					const placement = params.placements.get(sessionId);
					if (placement?.state !== "active" || placement.turnClaim) throw new Error(`Session ${sessionKey} has active work; wait before stopping its cloud worker`);
					worktreePath = worktree.path;
					if (!await interruptSessionWorkAdmissions({
						scope: target.storePath,
						identities: lifecycleIdentities,
						timeoutMs: 15e3
					})) throw new Error(`Session ${sessionKey} is still active; cloud worker stop cancelled`);
					await params.placements.waitForTurnClaimRelease(sessionId, { timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS });
					await runExclusiveSessionStoreWrite(target.storePath, async () => {}, { reentrant: true });
				},
				run: async () => {
					if (!worktreePath) throw new Error(`Session ${sessionKey} cloud worker stop barrier did not prepare`);
					reclaimedPlacement = await reclaim(worktreePath);
					params.revokeSessionAuthority({
						sessionId,
						sessionKeys: lifecycleIdentities
					});
				}
			});
			if (!reclaimedPlacement) throw new Error(`Session ${sessionKey} cloud worker stop barrier did not complete`);
			return reclaimedPlacement;
		},
		resolveWorkspacePath,
		workspaceOperations
	}));
	const admissionProvider = createWorkerSessionTurnPlacementProvider({
		environments: params.environments,
		placements: params.placements,
		admitNewPlacements: params.admitNewPlacements,
		redispatchReclaimed: createReclaimedPlacementRedispatch({
			environments: params.environments,
			dispatch: dispatchService.dispatch
		}),
		workspaceOperations
	});
	const recoverPendingWorkspaceReconciliations = async () => {
		for (const owner of params.placements.listWorkspaceReconciliationOwners()) try {
			const placement = params.placements.get(owner.sessionId);
			if (placement?.state !== "active" && placement?.state !== "draining" || placement.environmentId !== owner.environmentId || placement.activeOwnerEpoch !== owner.ownerEpoch || placement.generation !== owner.placementGeneration) throw new Error(`Cloud workspace journal has no matching owner: ${owner.sessionId}`);
			const localPath = await resolveWorkspacePath({
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId
			});
			const journal = params.placements.loadWorkspaceReconciliation(owner);
			if (!journal) continue;
			await recoverWorkerWorkspaceReconciliation({
				root: localPath,
				journal
			});
			params.placements.abortWorkspaceReconciliation(owner);
		} catch (error) {
			workerPlacementLog.error(`cloud workspace recovery deferred for ${owner.sessionId}: ${formatErrorMessage(error)}`);
		}
	};
	const startRuntime = async (hooks) => {
		const uninstallPlacementAdmission = installSessionPlacementAdmissionProvider(admissionProvider);
		const uninstallPlacementResetGuard = installSessionPlacementResetGuard((sessionId) => {
			const placement = params.placements.get(sessionId);
			if (!placement || placement.state === "local") return;
			return `cloud worker placement is ${placement.state}`;
		});
		let placementReconcileInterval;
		let placementReconcileInFlight;
		let stopped = false;
		const reconcileActivePlacements = () => {
			if (stopped) return Promise.resolve();
			if (placementReconcileInFlight) return placementReconcileInFlight;
			const current = dispatchService.reconcileActive();
			placementReconcileInFlight = current;
			const clearCurrent = () => {
				if (placementReconcileInFlight === current) placementReconcileInFlight = void 0;
			};
			current.then(clearCurrent, (error) => {
				params.warn(`Worker placement reconcile sweep failed: ${formatErrorMessage(error)}`);
				clearCurrent();
			});
			return current;
		};
		const sidecar = { stop: async () => {
			if (stopped) return;
			stopped = true;
			clearInterval(placementReconcileInterval);
			placementReconcileInterval = void 0;
			uninstallPlacementAdmission();
			uninstallPlacementResetGuard();
			const environmentStop = params.environments.stop();
			const environmentStopResult = (await Promise.allSettled([...placementReconcileInFlight ? [placementReconcileInFlight] : [], environmentStop])).at(-1);
			if (environmentStopResult?.status === "rejected") throw environmentStopResult.reason;
		} };
		hooks.registerSidecar(sidecar);
		const startupRecovery = recoverPendingWorkspaceReconciliations();
		placementReconcileInFlight = startupRecovery;
		try {
			await startupRecovery;
		} finally {
			if (placementReconcileInFlight === startupRecovery) placementReconcileInFlight = void 0;
		}
		if (hooks.isClosePreludeStarted()) {
			await sidecar.stop();
			return null;
		}
		const startupReconcile = dispatchService.reconcile();
		placementReconcileInFlight = startupReconcile;
		try {
			try {
				await startupReconcile;
			} finally {
				if (placementReconcileInFlight === startupReconcile) placementReconcileInFlight = void 0;
			}
			if (hooks.isClosePreludeStarted()) {
				await sidecar.stop();
				return null;
			}
			params.environments.start();
			placementReconcileInterval = setInterval(() => void reconcileActivePlacements(), WORKER_PLACEMENT_RECONCILE_INTERVAL_MS);
			placementReconcileInterval.unref?.();
			return sidecar;
		} catch (error) {
			await sidecar.stop();
			throw error;
		}
	};
	return {
		dispatchService,
		admissionProvider,
		placements: params.placements,
		startRuntime
	};
}
//#endregion
export { createGatewayWorkerPlacementRuntime };
