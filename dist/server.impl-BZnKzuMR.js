import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { n as createLazyPromise, r as createLazyPromiseLoader } from "./lazy-promise-EhsWch5m.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { i as logAcceptedEnvOption, n as isTruthyEnvValue, r as isVitestRuntimeEnv } from "./env-CHfvZ8Nb.js";
import { D as resolveIntegerOption, b as parseStrictPositiveInteger } from "./number-coercion-Crk_c9KW.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { a as isNixMode, o as normalizeStateDirEnv } from "./paths-CHQRdQZ3.js";
import { S as createDiagnosticTraceContext, f as isDiagnosticsEnabled, j as runWithDiagnosticTraceContext, y as setDiagnosticsEnabledForProcess } from "./diagnostic-events-Dt41CZkD.js";
import { r as runtimeForLogger, t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import "./utils-K2PjeLaV.js";
import { t as sleep } from "./sleep-Ce8zcpEF.js";
import { d as prepareConfigRuntimeEnv, l as initializePublishedConfigRuntimeEnv, r as collectConfigRuntimeEnvOwnership } from "./config-env-vars-9fUuyise.js";
import { l as isSecretRef } from "./types.secrets-BgE_Zq2x.js";
import { o as setCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BQju0mzJ.js";
import { t as clearPluginMetadataLifecycleCaches } from "./plugin-metadata-lifecycle-C3dWg4tn.js";
import { c as isDiagnosticsTimelineEnabled, s as emitDiagnosticsTimelineEvent } from "./plugin-metadata-snapshot-xuKL7EBL.js";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.js";
import { _ as resolveRequestClientIp, i as isLoopbackHost, m as resolveGatewayListenHosts } from "./net-DBokCmJs.js";
import { l as buildRateLimitIdentityKey, o as AUTH_RATE_LIMIT_SCOPE_NODE_REAPPROVAL, u as createAuthRateLimiter } from "./auth-rate-limit-0tExR5U8.js";
import { a as isLocalDirectRequest, n as authorizeHttpGatewayConnect, o as withSerializedKeyedAttempt } from "./auth-6en4RqxB.js";
import { n as resolveGatewayAuth } from "./auth-resolve-OMDlKaXM.js";
import { B as captureConfigOverrideApplier, l as readConfigFileSnapshot, o as promoteConfigSnapshotToLastKnownGood, r as getRuntimeConfig, u as readConfigFileSnapshotForRuntimeTransaction, v as registerConfigWriteListener } from "./io-CEgS2K9F.js";
import { n as assertGatewayConfigEnvSelectionUnchanged } from "./gateway-env-selection-DmX_wdxL.js";
import { S as setAppliedRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-BW7iP5ad.js";
import { n as isRestartEnabled } from "./commands.flags-CZ7fp5Xb.js";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-D4mGPeue.js";
import { t as loadGatewayTlsRuntime$1 } from "./gateway-BY0DVQhF.js";
import "./method-scopes-DN3UnWnt.js";
import { n as createCoreGatewayMethodDescriptors, r as isCoreGatewayMethodClassified, s as listCoreGatewayMethodNames, t as STARTUP_UNAVAILABLE_GATEWAY_METHODS } from "./core-descriptors-BaSJeBqR.js";
import { a as READ_SCOPE, i as QUESTIONS_SCOPE, n as APPROVALS_SCOPE, r as PAIRING_SCOPE, s as WRITE_SCOPE, t as ADMIN_SCOPE } from "./operator-scopes-BHrNTqoH.js";
import { t as GatewayLockError } from "./gateway-lock-DuOE-FjH.js";
import { c as isGatewayWorkAdmissionClosed, i as getActiveGatewayRootWorkCount } from "./gateway-work-admission-CLw1UuhK.js";
import { f as setGatewaySigusr1RestartPolicy, p as setPreRestartDeferralCheck } from "./restart-B84EHBne.js";
import { r as readGatewayRestartHandoffSync } from "./restart-handoff-Dgbh21G4.js";
import { _ as pinActivePluginSessionExtensionRegistry, b as releasePinnedPluginHttpRouteRegistry, g as pinActivePluginHttpRouteRegistry, h as pinActivePluginChannelRegistry, x as releasePinnedPluginSessionExtensionRegistry, y as releasePinnedPluginChannelRegistry } from "./runtime-BapEso0o.js";
import { a as resolveMainSessionKey } from "./main-session-C7kXMD8t.js";
import { i as listLoadedChannelPlugins, n as getLoadedChannelPluginEntryById } from "./registry-loaded-BV9s-P0K.js";
import { t as isBrowserCopilotClient } from "./message-channel-CkiwT4Uh.js";
import { i as tryLoadActivatedBundledPluginPublicSurfaceModule } from "./facade-runtime-CZWmCPja.js";
import { i as createPluginGatewayMethodDescriptors, n as createGatewayMethodRegistry, t as createGatewayMethodDescriptorsFromHandlers } from "./registry-CnDSDSlE.js";
import { a as enqueueSystemEvent } from "./system-events-BNfyhKS3.js";
import { C as stopDiagnosticHeartbeat, S as startDiagnosticHeartbeat } from "./diagnostic-CiatiVjT.js";
import { i as withDiagnosticPhase } from "./diagnostic-phase-bPtfbE0s.js";
import { s as resolveCronJobsStorePath } from "./store-CFkN1_TJ.js";
import { d as getActiveEmbeddedRunCount, m as resolveActiveEmbeddedRunSessionId } from "./run-state-D28kFtJW.js";
import "./sessions-Uqhj6EXw.js";
import { o as getActiveBackgroundExecSessionCount } from "./bash-process-registry-BrIqJ2bV.js";
import { t as getTotalPendingReplies } from "./dispatcher-registry-CaTZukRA.js";
import { r as getActiveCronJobCount } from "./active-jobs-BSWUEHJl.js";
import { f as isGatewayDraining, l as getTotalQueueSize } from "./command-queue-B2fMJE4M.js";
import { a as decodeSandboxHostCsp, i as buildSandboxHostProxyHtml, n as buildSandboxHostContentSecurityPolicy, s as resolveSandboxHostPort } from "./sandbox-host-Bq3pdqNs.js";
import { i as getActiveSecretsRuntimeConfigSnapshot, r as clearSecretsRuntimeSnapshot } from "./runtime-state-DTHJs1uZ.js";
import { i as withCoreCanvasNodeCapability, n as isCanvasDocumentHttpPath, r as resolveCanvasNodeCapability } from "./constants-Cm4bJJ1Q.js";
import { t as isCoreCanvasHostEnabled } from "./config-B2c1x9vw.js";
import { i as setFallbackGatewayContextResolver } from "./server-plugin-fallback-context-D6HXEDNK.js";
import "./server-plugins-Cct9l_MT.js";
import { t as clearSessionSuspensionTimers } from "./session-suspension-DNYLXcr7.js";
import { n as applyGatewayLaneConcurrency, r as resolveGatewayLaneConcurrency, t as resolveHookClientIpConfig } from "./hook-client-ip-config-WlJh7kig.js";
import { n as DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS, r as evaluateChannelHealth, t as DEFAULT_CHANNEL_CONNECT_GRACE_MS } from "./channel-health-policy-DJ7DclxT.js";
import { a as enforceSharedGatewaySessionGenerationForConfigWrite, s as getRequiredSharedGatewaySessionGeneration } from "./server-shared-auth-generation-BBlJKQd7.js";
import { n as mergeGatewayAuthConfig, r as mergeGatewayTailscaleConfig } from "./startup-auth-BBach1wy.js";
import { a as createChatRunState, c as createToolEventRecipientRegistry, o as createSessionEventSubscriberRegistry, s as createSessionMessageSubscriberRegistry } from "./server-chat-state-B5sGX0h3.js";
import { c as recordGatewayRestartTraceDetail, d as resumeGatewayRestartTraceFromHandoff, i as finishGatewayRestartTrace, l as recordGatewayRestartTraceSpan, n as collectGatewayProcessMemoryUsageMb, u as resumeGatewayRestartTraceFromEnv } from "./restart-trace-CzbQ5gIb.js";
import { t as ensureOpenClawCliOnPath } from "./path-env-CAw3sShN.js";
import { a as resolveControlUiRootOverrideSync, n as isPackageProvenControlUiRootSync, o as resolveControlUiRootSync, t as ensureControlUiAssetsBuilt } from "./control-ui-assets-BvBARucQ.js";
import { d as reusePendingNodePairingForReconnect, r as finalizeNodePairingCleanupClaim, u as requestNodePairing } from "./node-pairing-kSMAHxQd.js";
import { i as recordRemoteNodeInfo, s as removeRemoteNodeInfo } from "./remote-DHCpOPa8.js";
import { n as logRejectedLargePayload } from "./diagnostic-payload-Cvs6bzBU.js";
import { i as MAX_BUFFERED_BYTES, o as MAX_PREAUTH_PAYLOAD_BYTES } from "./server-constants-DKuFNbQH.js";
import { c as normalizePluginNodeCapabilityScopedUrl } from "./plugin-node-capability-9V7uhGk6.js";
import { i as summarizeAgentEventForWsLog, n as logWs, r as shouldLogWs } from "./ws-log-Bj-6Do--.js";
import { t as createDeferred } from "./deferred-DJrEoFQk.js";
import { t as createDefaultDeps } from "./deps-BlJhVyB4.js";
import { c as revokeAttachGrantsForSession } from "./mcp-grant-store-BXg0F56m.js";
import { c as CONTROL_UI_PLUGIN_ICON_PATH_PREFIX, r as CONTROL_UI_CATALOG_ICON_PATH_PREFIX } from "./control-ui-contract-ojJRnCW_.js";
import { a as resolvePluginRoutePathContext, i as isProtectedPluginRoutePathFromContext } from "./route-match-CjzRe5Nj.js";
import { r as sendGatewayAuthFailure, u as setDefaultSecurityHeaders } from "./http-common-CjZLtWEF.js";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-8sA0oUQm.js";
import { n as resolveAssistantIdentity } from "./assistant-identity-Cx--KUQj.js";
import { n as ensureControlUiAllowedOriginsForNonLoopbackBind } from "./gateway-control-ui-origins-Wcq5mZWn.js";
import { n as isControlUiApprovalDocumentPath, r as isControlUiPluginManagerRequest } from "./control-ui-routing-BpXfhgN4.js";
import { n as resolveGatewayReloadPluginActivationCandidate, r as resolveGatewayStartupPluginActivationConfig, t as mergeActivationSectionsIntoRuntimeConfig } from "./plugin-activation-runtime-config-CA0YTtbC.js";
import { r as upsertPresence } from "./system-presence-DC0E007m.js";
import { a as incrementPresenceVersion, i as getPresenceVersion, n as getHealthCache, o as refreshGatewayHealthSnapshot, r as getHealthVersion } from "./health-state-DJCCqH4h.js";
import { t as resolveGatewayPluginConfig } from "./runtime-plugin-config-MVwwsGVY.js";
import { r as clearNodeWakeState } from "./nodes-wake-state-D3Lnk3Xv.js";
import { t as broadcastPresenceSnapshot } from "./presence-events-oTVUXVxs.js";
import { t as GATEWAY_EVENTS } from "./server-methods-list-h0jTEYVt.js";
import { n as GATEWAY_WS_PREAUTH_BUDGET_PROPERTY, t as GATEWAY_WS_CONNECTION_KIND_PROPERTY } from "./ws-types-D4iS735K.js";
import { t as disposeNodeConnectionNotifications } from "./node-connection-notifications-B8-8L-p8.js";
import { a as writeGatewayUpgradeServiceUnavailable, n as shouldEnforceGatewayAuthForPluginPath, r as runWithGatewayHttpWorkAdmission } from "./route-auth-07xfDNkB.js";
import { n as matchUserProfileAvatarPath } from "./user-profiles-http-path-CvR7l2ks.js";
import { t as findMatchingPluginNodeCapabilityRoute } from "./route-capability-UMtg-bja.js";
import path from "node:path";
import { monitorEventLoopDelay, performance } from "node:perf_hooks";
import { WebSocketServer } from "ws";
import { createServer } from "node:http";
import { createServer as createServer$1 } from "node:https";
//#region src/gateway/node-reapproval-coordinator.ts
function normalizeFingerprintList(value) {
	return value ? [...new Set(value.map((entry) => entry.trim()).filter((entry) => entry.length > 0))].toSorted() : void 0;
}
function buildRequestFingerprint(input) {
	const permissions = input.permissions ? Object.fromEntries(Object.entries(input.permissions).toSorted(([left], [right]) => left.localeCompare(right))) : void 0;
	return JSON.stringify({
		nodeId: input.nodeId.trim(),
		clientId: input.clientId,
		clientMode: input.clientMode,
		displayName: input.displayName,
		platform: input.platform,
		version: input.version,
		coreVersion: input.coreVersion,
		uiVersion: input.uiVersion,
		deviceFamily: input.deviceFamily,
		modelIdentifier: input.modelIdentifier,
		caps: normalizeFingerprintList(input.caps),
		commands: normalizeFingerprintList(input.commands),
		permissions,
		remoteIp: input.remoteIp,
		silent: Boolean(input.silent)
	});
}
/** Creates the gateway-lifetime owner for paired-node reapproval write limits. */
function createNodeReapprovalCoordinator(config) {
	const limiter = createAuthRateLimiter({
		...config,
		exemptLoopback: false
	});
	const requestStates = /* @__PURE__ */ new Map();
	let disposed = false;
	const executeRequest = async ({ input, cleanupClaim, baseDir }) => {
		if (disposed) return null;
		const reused = await reusePendingNodePairingForReconnect(input, cleanupClaim, baseDir);
		if (reused) return reused;
		const identityKey = buildRateLimitIdentityKey("node", input.nodeId.trim());
		if (!limiter.check(identityKey, "node-reapproval").allowed) return null;
		const result = await requestNodePairing(input, baseDir);
		limiter.recordFailure(identityKey, AUTH_RATE_LIMIT_SCOPE_NODE_REAPPROVAL);
		return result;
	};
	const finishActiveRequest = (nodeId, state, fingerprint) => {
		if (requestStates.get(nodeId) !== state || state.activeFingerprint !== fingerprint) return;
		if (!state.queued) requestStates.delete(nodeId);
	};
	const startFirstRequest = (nodeId, state, request) => {
		withSerializedKeyedAttempt({
			key: `node-reapproval:${nodeId}`,
			run: async () => {
				try {
					request.deferred.resolve(await executeRequest(request.params));
				} catch (error) {
					request.deferred.reject(error);
				} finally {
					finishActiveRequest(nodeId, state, request.fingerprint);
				}
			}
		});
	};
	const startQueuedRequest = (nodeId, state) => {
		withSerializedKeyedAttempt({
			key: `node-reapproval:${nodeId}`,
			run: async () => {
				const queued = state.queued;
				if (!queued) return;
				state.queued = void 0;
				state.activeFingerprint = queued.fingerprint;
				try {
					queued.deferred.resolve(await executeRequest(queued.params));
					for (const follower of queued.followers) follower.resolve(null);
				} catch (error) {
					queued.deferred.reject(error);
					for (const follower of queued.followers) follower.reject(error);
				} finally {
					finishActiveRequest(nodeId, state, queued.fingerprint);
				}
			}
		});
	};
	return {
		request(params) {
			if (disposed) return Promise.resolve(null);
			const nodeId = params.input.nodeId.trim();
			const fingerprint = buildRequestFingerprint(params.input);
			const state = requestStates.get(nodeId);
			if (!state) {
				const deferred = createDeferred();
				const nextState = { activeFingerprint: fingerprint };
				requestStates.set(nodeId, nextState);
				startFirstRequest(nodeId, nextState, {
					fingerprint,
					params,
					deferred,
					followers: []
				});
				return deferred.promise;
			}
			if (state.queued?.fingerprint === fingerprint) {
				const follower = createDeferred();
				state.queued.params = params;
				state.queued.followers.push(follower);
				return follower.promise;
			}
			const deferred = createDeferred();
			if (state.queued) {
				state.queued.deferred.resolve(null);
				for (const follower of state.queued.followers) follower.resolve(null);
				state.queued = {
					fingerprint,
					params,
					deferred,
					followers: []
				};
			} else {
				state.queued = {
					fingerprint,
					params,
					deferred,
					followers: []
				};
				startQueuedRequest(nodeId, state);
			}
			return deferred.promise;
		},
		async finalizeCleanup(claim) {
			return await withSerializedKeyedAttempt({
				key: `node-reapproval:${claim.nodeId}`,
				run: async () => await finalizeNodePairingCleanupClaim(claim)
			});
		},
		dispose() {
			disposed = true;
			for (const state of requestStates.values()) {
				state.queued?.deferred.resolve(null);
				for (const follower of state.queued?.followers ?? []) follower.resolve(null);
			}
			requestStates.clear();
			limiter.dispose();
		}
	};
}
//#endregion
//#region src/gateway/plugin-channel-reload-targets.ts
function addNormalizedTarget(targets, value) {
	const normalized = normalizeOptionalString(value);
	if (normalized) targets.add(normalized);
}
/** Lists all config ids that should trigger reload for a channel plugin target. */
function listChannelPluginConfigTargetIds(target) {
	const targets = /* @__PURE__ */ new Set();
	addNormalizedTarget(targets, target.channelId);
	addNormalizedTarget(targets, target.pluginId);
	for (const alias of target.aliases ?? []) addNormalizedTarget(targets, alias);
	return targets;
}
/** Returns true when changed config paths affect any target plugin/channel id. */
function pluginConfigTargetsChanged(targetIds, changedPaths) {
	const prefixes = Array.from(targetIds, (id) => [`plugins.entries.${id}`, `plugins.installs.${id}`]).flat();
	return changedPaths.some((path) => prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}.`)));
}
//#endregion
//#region src/gateway/server-control-ui-root.ts
function startControlUiAssetsBuild(params) {
	ensureControlUiAssetsBuilt(params.gatewayRuntime).then((result) => {
		if (!result.ok && result.message) params.log.warn(`gateway: ${result.message}`);
	}).catch((error) => {
		params.log.warn(`gateway: Control UI assets build failed: ${error instanceof Error ? error.message : String(error)}`);
	});
}
/** Resolves the Control UI asset root state for gateway startup. */
async function resolveGatewayControlUiRootState(params) {
	if (params.controlUiRootOverride) {
		const resolvedOverride = resolveControlUiRootOverrideSync(params.controlUiRootOverride);
		const resolvedOverridePath = path.resolve(params.controlUiRootOverride);
		if (!resolvedOverride) params.log.warn(`gateway: controlUi.root not found at ${resolvedOverridePath}`);
		return resolvedOverride ? {
			kind: "resolved",
			path: resolvedOverride
		} : {
			kind: "invalid",
			path: resolvedOverridePath
		};
	}
	if (!params.controlUiEnabled) return;
	const resolveRoot = () => resolveControlUiRootSync({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
	const resolvedRoot = resolveRoot();
	if (!resolvedRoot) {
		startControlUiAssetsBuild({
			gatewayRuntime: params.gatewayRuntime,
			log: params.log
		});
		return;
	}
	return {
		kind: isPackageProvenControlUiRootSync(resolvedRoot, {
			moduleUrl: import.meta.url,
			argv1: process.argv[1],
			cwd: process.cwd()
		}) ? "bundled" : "resolved",
		path: resolvedRoot
	};
}
//#endregion
//#region src/gateway/server-cron-lazy.ts
/** Creates a cron state proxy that imports the real cron service on first use. */
function createLazyGatewayCronState(params) {
	const env = params.env ?? process.env;
	const storePath = resolveCronJobsStorePath(params.cfg.cron?.store, env);
	const cronEnabled = env.OPENCLAW_SKIP_CRON !== "1" && params.cfg.cron?.enabled !== false;
	let loaded = null;
	let stopped = false;
	let lifecycleGeneration = 0;
	let schedulingPaused = false;
	const schedulingResumeWaiters = /* @__PURE__ */ new Set();
	const releaseSchedulingResumeWaiters = () => {
		const waiters = Array.from(schedulingResumeWaiters);
		schedulingResumeWaiters.clear();
		for (const resolve of waiters) resolve();
	};
	const waitForSchedulingResume = async () => {
		if (!schedulingPaused) return;
		await new Promise((resolve) => {
			schedulingResumeWaiters.add(resolve);
		});
	};
	const cronStateLoader = createLazyPromiseLoader(() => import("./server-cron-DPEYlXLB.js").then(({ buildGatewayCronService }) => {
		loaded = {
			state: buildGatewayCronService(params),
			phase: "idle",
			startPromise: null,
			startGeneration: null,
			schedulingPaused: false,
			underlyingStartInFlight: false,
			underlyingStarted: false
		};
		if (schedulingPaused) {
			loaded.state.cron.pauseScheduling();
			loaded.schedulingPaused = true;
		}
		return loaded;
	}), { cacheRejections: true });
	const load = async () => {
		if (loaded) return loaded;
		return await cronStateLoader.load();
	};
	const cron = {
		async start() {
			stopped = false;
			const generation = lifecycleGeneration;
			const startCancelled = () => stopped || generation !== lifecycleGeneration;
			const resolved = await load();
			const hasStarted = () => resolved.phase === "started";
			if (startCancelled()) return;
			if (hasStarted()) return;
			if (resolved.startPromise) {
				const pendingGeneration = resolved.startGeneration;
				try {
					await resolved.startPromise;
				} catch (err) {
					if (pendingGeneration === generation) throw err;
				}
				if (startCancelled() || hasStarted()) return;
				if (pendingGeneration !== generation) {
					await cron.start();
					return;
				}
			}
			resolved.phase = "starting";
			resolved.startGeneration = generation;
			const startPromise = (async () => {
				await waitForSchedulingResume();
				if (startCancelled()) {
					resolved.phase = "stopped";
					return;
				}
				if (resolved.schedulingPaused) {
					resolved.state.cron.resumeScheduling();
					resolved.schedulingPaused = false;
				}
				resolved.underlyingStartInFlight = true;
				try {
					await resolved.state.cron.start();
					resolved.underlyingStarted = true;
				} catch (err) {
					resolved.underlyingStarted = false;
					resolved.phase = startCancelled() ? "stopped" : "idle";
					throw err;
				} finally {
					resolved.underlyingStartInFlight = false;
				}
				if (startCancelled()) {
					resolved.phase = "stopped";
					resolved.underlyingStarted = false;
					resolved.state.cron.stop();
					resolved.state.stopExitWatchers?.();
					return;
				}
				if (schedulingPaused) {
					resolved.state.cron.pauseScheduling();
					resolved.schedulingPaused = true;
				}
				try {
					if (resolved.state.cronEnabled) await resolved.state.reconcileExitWatchers?.();
				} catch (err) {
					resolved.phase = startCancelled() ? "stopped" : "started";
					throw err;
				}
				if (startCancelled()) {
					resolved.phase = "stopped";
					resolved.underlyingStarted = false;
					resolved.state.cron.stop();
					resolved.state.stopExitWatchers?.();
					return;
				}
				resolved.phase = "started";
			})();
			resolved.startPromise = startPromise;
			try {
				await startPromise;
			} finally {
				if (resolved.startPromise === startPromise) {
					resolved.startPromise = null;
					resolved.startGeneration = null;
				}
			}
		},
		stop() {
			stopped = true;
			lifecycleGeneration += 1;
			releaseSchedulingResumeWaiters();
			if (loaded) {
				loaded.phase = "stopped";
				loaded.underlyingStarted = false;
				loaded.state.cron.stop();
				loaded.state.stopExitWatchers?.();
				return;
			}
			const loading = cronStateLoader.peek();
			if (loading) loading.then((resolved) => {
				if (!stopped) return;
				resolved.phase = "stopped";
				resolved.underlyingStarted = false;
				resolved.state.cron.stop();
				resolved.state.stopExitWatchers?.();
			}).catch(() => {});
		},
		pauseScheduling() {
			schedulingPaused = true;
			if (loaded) {
				loaded.state.cron.pauseScheduling();
				loaded.schedulingPaused = true;
			}
		},
		resumeScheduling() {
			schedulingPaused = false;
			releaseSchedulingResumeWaiters();
			if (loaded && loaded.schedulingPaused && (loaded.underlyingStarted || loaded.underlyingStartInFlight)) {
				loaded.state.cron.resumeScheduling();
				loaded.schedulingPaused = false;
			}
		},
		getSuspensionBlockerCount() {
			const loadedBlockers = loaded?.state.cron.getSuspensionBlockerCount?.() ?? 0;
			return loaded?.phase === "starting" ? Math.max(1, loadedBlockers) : loadedBlockers;
		},
		async status() {
			return await (await load()).state.cron.status();
		},
		async list(opts) {
			return await (await load()).state.cron.list(opts);
		},
		async listPage(opts) {
			return await (await load()).state.cron.listPage(opts);
		},
		async add(input, opts) {
			return await (await load()).state.cron.add(input, opts);
		},
		async update(id, patch) {
			return await (await load()).state.cron.update(id, patch);
		},
		async updateWithPrecondition(id, patch, precondition) {
			return await (await load()).state.cron.updateWithPrecondition(id, patch, precondition);
		},
		async remove(id) {
			return await (await load()).state.cron.remove(id);
		},
		async removeAgentJobsTransactional(agentId, commit) {
			return await (await load()).state.cron.removeAgentJobsTransactional(agentId, commit);
		},
		async run(id, mode, opts) {
			return await (await load()).state.cron.run(id, mode, opts);
		},
		async enqueueRun(id, mode) {
			return await (await load()).state.cron.enqueueRun(id, mode);
		},
		getJob(id) {
			if (!loaded) return;
			return loaded.state.cron.getJob(id);
		},
		async readJob(id) {
			return await (await load()).state.cron.readJob(id);
		},
		getDefaultAgentId() {
			if (!loaded) return;
			return loaded.state.cron.getDefaultAgentId();
		},
		wake(opts) {
			if (!loaded) {
				load();
				return { ok: false };
			}
			return loaded.state.cron.wake(opts);
		}
	};
	return {
		cron,
		storePath,
		cronEnabled
	};
}
//#endregion
//#region src/gateway/server-cron-reconciled.ts
function createGatewayCronReconciliation(params) {
	let lifecycleGeneration = 0;
	let activeAbortController;
	const supersedeActive = () => {
		lifecycleGeneration += 1;
		activeAbortController?.abort();
		activeAbortController = void 0;
	};
	return {
		arm: ({ reason, config, cronState }) => {
			supersedeActive();
			const generation = lifecycleGeneration;
			const abortController = new AbortController();
			activeAbortController = abortController;
			const cron = cronState.cron;
			const event = {
				reason,
				enabled: cronState.cronEnabled
			};
			let completed = false;
			return { complete: async () => {
				if (completed) return;
				completed = true;
				if (params.isClosing() || generation !== lifecycleGeneration || abortController.signal.aborted) return;
				await params.runHook(event, {
					port: params.port,
					config,
					workspaceDir: params.workspaceDir,
					getCron: () => cron,
					abortSignal: abortController.signal
				});
			} };
		},
		invalidate: supersedeActive
	};
}
//#endregion
//#region src/gateway/server-runtime-handles.ts
/** Creates gateway mutable state with inert handles that are safe to stop before startup finishes. */
function createGatewayServerMutableState() {
	const noopInterval = () => {
		const timer = setInterval(() => {}, 1 << 30);
		timer.unref?.();
		return timer;
	};
	return {
		bonjourStop: null,
		tickInterval: noopInterval(),
		healthInterval: noopInterval(),
		dedupeCleanup: noopInterval(),
		mediaCleanup: null,
		worktreeCleanup: null,
		skillCuratorCleanup: () => {},
		heartbeatRunner: {
			stop: () => {},
			updateConfig: (_cfg) => {}
		},
		stopGatewayUpdateCheck: () => {},
		tailscaleCleanup: null,
		postReadySidecars: [],
		gatewayLifetimeSidecars: [],
		skillsRefreshTimer: null,
		skillsRefreshDelayMs: 3e4,
		skillsChangeUnsub: () => {},
		channelHealthMonitor: null,
		stopModelPricingRefresh: () => {},
		mcpServer: void 0,
		configReloader: {
			stop: async () => {},
			notifyPluginMetadataChanged: () => {}
		},
		agentUnsub: null,
		heartbeatUnsub: null,
		transcriptUnsub: null,
		lifecycleUnsub: null,
		taskUnsub: null
	};
}
//#endregion
//#region src/gateway/server-live-state.ts
/** Creates gateway live state with fresh mutable runtime handles. */
function createGatewayServerLiveState(params) {
	return {
		...createGatewayServerMutableState(),
		hooksConfig: params.hooksConfig,
		hookClientIpConfig: params.hookClientIpConfig,
		cronState: params.cronState,
		pluginServices: null,
		gatewayMethods: params.gatewayMethods
	};
}
//#endregion
//#region src/gateway/mcp-app-sandbox-http.ts
const MCP_APP_PERMISSIONS_POLICY = "camera=(), microphone=(), geolocation=(), clipboard-write=()";
function handleMcpAppSandboxHttpRequest(req, res) {
	let url;
	try {
		url = new URL(req.url ?? "/", "http://localhost");
	} catch {
		res.statusCode = 400;
		res.end("Bad Request");
		return;
	}
	if (url.pathname !== "/mcp-app-sandbox" || req.method !== "GET" && req.method !== "HEAD") {
		res.statusCode = 404;
		res.end("Not Found");
		return;
	}
	let csp;
	try {
		csp = decodeSandboxHostCsp(url.searchParams.get("csp"));
	} catch {
		res.statusCode = 400;
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("invalid MCP App sandbox policy");
		return;
	}
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Content-Security-Policy", buildSandboxHostContentSecurityPolicy(csp));
	res.setHeader("Permissions-Policy", MCP_APP_PERMISSIONS_POLICY);
	res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
	res.setHeader("Origin-Agent-Cluster", "?1");
	res.setHeader("Referrer-Policy", "no-referrer");
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.end(req.method === "HEAD" ? void 0 : buildSandboxHostProxyHtml(csp));
}
/** Dedicated listener: this origin must never serve Control UI or authenticated Gateway data. */
function createSandboxHostHttpServer(tlsOptions) {
	const handler = (req, res) => {
		handleMcpAppSandboxHttpRequest(req, res);
	};
	return tlsOptions ? createServer$1(tlsOptions, handler) : createServer(handler);
}
//#endregion
//#region src/gateway/server-broadcast.ts
const EVENT_SCOPE_GUARDS = {
	agent: [READ_SCOPE],
	chat: [READ_SCOPE],
	"board.changed": [READ_SCOPE],
	"board.command": [READ_SCOPE],
	"ui.command": [READ_SCOPE],
	"chat.send_timing": [READ_SCOPE],
	"chat.side_result": [READ_SCOPE],
	cron: [READ_SCOPE],
	health: [],
	"exec.approval.requested": [APPROVALS_SCOPE],
	"exec.approval.resolved": [APPROVALS_SCOPE],
	"question.requested": [QUESTIONS_SCOPE],
	"question.resolved": [QUESTIONS_SCOPE],
	heartbeat: [],
	"plugin.approval.requested": [APPROVALS_SCOPE],
	"plugin.approval.resolved": [APPROVALS_SCOPE],
	"openclaw.approval.requested": [APPROVALS_SCOPE],
	"openclaw.approval.resolved": [APPROVALS_SCOPE],
	presence: [],
	shutdown: [],
	tick: [],
	"talk.event": [READ_SCOPE],
	"talk.mode": [WRITE_SCOPE],
	task: [READ_SCOPE],
	"task.suggestion": [READ_SCOPE],
	"update.available": [],
	"config.changed": [READ_SCOPE],
	"voicewake.changed": [READ_SCOPE],
	"voicewake.routing.changed": [READ_SCOPE],
	"device.pair.requested": [PAIRING_SCOPE],
	"device.pair.resolved": [PAIRING_SCOPE],
	"node.pair.requested": [PAIRING_SCOPE],
	"node.pair.resolved": [PAIRING_SCOPE],
	"node.presence": [READ_SCOPE],
	"sessions.catalog.host": [READ_SCOPE],
	"sessions.changed": [READ_SCOPE],
	"session.approval": [APPROVALS_SCOPE],
	"session.message": [READ_SCOPE],
	"session.operation": [READ_SCOPE],
	"session.tool": [READ_SCOPE],
	"terminal.data": [ADMIN_SCOPE],
	"terminal.exit": [ADMIN_SCOPE]
};
const NODE_ALLOWED_EVENTS = /* @__PURE__ */ new Set(["voicewake.changed", "voicewake.routing.changed"]);
const SESSION_SUBSCRIPTION_EVENTS = /* @__PURE__ */ new Set([
	"agent",
	"chat",
	"chat.side_result"
]);
function serializeFrameField(name, value) {
	const fieldJSON = JSON.stringify({ [name]: value });
	const keyJSON = JSON.stringify(name);
	const prefix = `{${keyJSON}:`;
	return fieldJSON.startsWith(prefix) ? `,${keyJSON}:${fieldJSON.slice(prefix.length, -1)}` : "";
}
function hasEventScope(client, event, explicitPluginScope) {
	if (client.connectionKind === "worker") return false;
	if (explicitPluginScope) {
		if ((client.connect.role ?? "operator") !== "operator") return false;
		const scopes = Array.isArray(client.connect.scopes) ? client.connect.scopes : [];
		if (scopes.includes("operator.admin")) return true;
		return explicitPluginScope === "operator.read" ? scopes.includes("operator.read") || scopes.includes("operator.write") : explicitPluginScope === "operator.write" && scopes.includes("operator.write");
	}
	const required = EVENT_SCOPE_GUARDS[event];
	if (!required && event.startsWith("plugin.")) {
		if ((client.connect.role ?? "operator") !== "operator") return false;
		const scopes = Array.isArray(client.connect.scopes) ? client.connect.scopes : [];
		return scopes.includes("operator.write") || scopes.includes("operator.admin");
	}
	if (!required) return false;
	if (required.length === 0) return true;
	const role = client.connect.role ?? "operator";
	if (role !== "operator") return role === "node" && NODE_ALLOWED_EVENTS.has(event);
	const scopes = Array.isArray(client.connect.scopes) ? client.connect.scopes : [];
	if (scopes.includes("operator.admin")) return true;
	if (required.includes("operator.read")) return scopes.includes("operator.read") || scopes.includes("operator.write");
	return required.some((scope) => scopes.includes(scope));
}
function createGatewayBroadcaster(params) {
	const clientSeq = /* @__PURE__ */ new WeakMap();
	const reportedSlowPayloadClients = /* @__PURE__ */ new WeakSet();
	const broadcastInternal = (event, payload, opts, targetConnIds, explicitPluginScope) => {
		if (params.clients.size === 0) return;
		const isTargeted = Boolean(targetConnIds);
		if (shouldLogWs()) {
			const logMeta = {
				event,
				seq: isTargeted ? "targeted" : "per-client",
				clients: params.clients.size,
				targets: targetConnIds ? targetConnIds.size : void 0,
				dropIfSlow: opts?.dropIfSlow,
				presenceVersion: opts?.stateVersion?.presence,
				healthVersion: opts?.stateVersion?.health
			};
			if (event === "agent") Object.assign(logMeta, summarizeAgentEventForWsLog(payload));
			logWs("out", "event", logMeta);
		}
		let frameBase;
		const getFrameBase = () => {
			if (!frameBase) frameBase = {
				eventJSON: JSON.stringify(event),
				payloadFragment: serializeFrameField("payload", payload),
				stateVersionFragment: opts?.stateVersion === void 0 ? "" : serializeFrameField("stateVersion", opts.stateVersion)
			};
			return frameBase;
		};
		for (const c of params.clients) {
			if (targetConnIds && !targetConnIds.has(c.connId)) continue;
			if (!hasEventScope(c, event, explicitPluginScope)) continue;
			if ((isBrowserCopilotClient(c.connect.client) || hasGatewayClientCap(c.connect.caps, GATEWAY_CLIENT_CAPS.SESSION_SCOPED_EVENTS)) && SESSION_SUBSCRIPTION_EVENTS.has(event) && (!opts?.sessionKeys?.length || !opts.sessionKeys.some((sessionKey) => params.sessionMessageSubscribers?.get(sessionKey).has(c.connId)))) continue;
			const nextSeq = (clientSeq.get(c) ?? 0) + 1;
			const slow = c.socket.bufferedAmount > MAX_BUFFERED_BYTES;
			if (!slow) reportedSlowPayloadClients.delete(c);
			else if (!reportedSlowPayloadClients.has(c)) {
				reportedSlowPayloadClients.add(c);
				logRejectedLargePayload({
					surface: "gateway.ws.outbound_buffer",
					bytes: c.socket.bufferedAmount,
					limitBytes: MAX_BUFFERED_BYTES,
					reason: opts?.dropIfSlow ? "ws_send_buffer_drop" : "ws_send_buffer_close"
				});
			}
			if (slow && opts?.dropIfSlow) {
				if (!isTargeted) clientSeq.set(c, nextSeq);
				continue;
			}
			if (slow) {
				try {
					c.socket.close(1008, "slow consumer");
				} catch {}
				continue;
			}
			try {
				const eventSeq = isTargeted ? void 0 : nextSeq;
				if (!isTargeted) clientSeq.set(c, nextSeq);
				const base = getFrameBase();
				const seqFragment = eventSeq === void 0 ? "" : `,"seq":${eventSeq}`;
				const frame = `{"type":"event","event":${base.eventJSON}${base.payloadFragment}${seqFragment}${base.stateVersionFragment}}`;
				c.socket.send(frame);
			} catch {}
		}
	};
	const broadcast = (event, payload, opts) => broadcastInternal(event, payload, opts);
	const broadcastToConnIds = (event, payload, connIds, opts) => {
		if (connIds.size === 0) return;
		broadcastInternal(event, payload, opts, connIds);
	};
	const getBufferedAmount = (connId) => {
		for (const client of params.clients) if (client.connId === connId) return client.socket.bufferedAmount;
	};
	const broadcastPluginEvent = (event, payload, scope) => {
		if (!event.startsWith("plugin.") || event.startsWith("plugin.approval.")) throw new Error(`invalid plugin gateway event: ${event}`);
		if (scope !== "operator.read" && scope !== "operator.write" && scope !== "operator.admin") throw new Error("invalid plugin gateway event scope");
		broadcastInternal(event, payload, void 0, void 0, scope);
	};
	return {
		broadcast,
		broadcastToConnIds,
		broadcastPluginEvent,
		getBufferedAmount
	};
}
//#endregion
//#region src/channels/plugins/gateway-auth-bypass.ts
const GATEWAY_AUTH_API_ARTIFACT_BASENAME = "gateway-auth-api.js";
const MISSING_PUBLIC_SURFACE_PREFIX = "Unable to resolve bundled plugin public surface ";
/** Resolves to null when the plugin is not activated or ships no gateway auth artifact. */
async function loadChannelGatewayAuthApi(channelId) {
	try {
		return await tryLoadActivatedBundledPluginPublicSurfaceModule({
			dirName: channelId,
			artifactBasename: GATEWAY_AUTH_API_ARTIFACT_BASENAME
		});
	} catch (error) {
		if (error instanceof Error && error.message.startsWith(MISSING_PUBLIC_SURFACE_PREFIX)) return null;
		throw error;
	}
}
/**
* Resolves configured gateway auth bypass paths from a channel plugin artifact.
*/
async function resolveBundledChannelGatewayAuthBypassPaths(params) {
	return ((await loadChannelGatewayAuthApi(params.channelId))?.resolveGatewayAuthBypassPaths?.({ cfg: params.cfg }) ?? []).flatMap((path) => typeof path === "string" && path.trim() ? [path.trim()] : []);
}
//#endregion
//#region src/gateway/server-http.ts
const getControlUiModule = createLazyRuntimeModule(() => import("./control-ui-CynIreGZ.js"));
const getCanvasServeModule = createLazyRuntimeModule(() => import("./serve.runtime.js"));
const getBoardHttpModule = createLazyRuntimeModule(() => import("./board-http-BT_5x4wL.js"));
const getEmbeddingsHttpModule = createLazyRuntimeModule(() => import("./embeddings-http-DIsdnqkC.js"));
const getManagedImageAttachmentsModule = createLazyRuntimeModule(() => import("./managed-image-attachments-D4hrESoN.js"));
const getMcpAppStandaloneModule = createLazyRuntimeModule(() => import("./mcp-app-standalone-fmG7M2br.js"));
const getPluginIconHttpModule = createLazyRuntimeModule(() => import("./plugin-icon-http-DgUu93H2.js"));
const getModelsHttpModule = createLazyRuntimeModule(() => import("./models-http-CZAKrc3n.js"));
const getOpenAiHttpModule = createLazyRuntimeModule(() => import("./openai-http-C2Wx3me3.js"));
const getOpenResponsesHttpModule = createLazyRuntimeModule(() => import("./openresponses-http-BOXvxhmz.js"));
const getSessionHistoryHttpModule = createLazyRuntimeModule(() => import("./sessions-history-http-Dq2HPUcE.js"));
const getSessionKillHttpModule = createLazyRuntimeModule(() => import("./session-kill-http-BhNtHkED.js"));
const getToolsInvokeHttpModule = createLazyRuntimeModule(() => import("./tools-invoke-http-CjmNyVTr.js"));
const getUserProfilesHttpModule = createLazyRuntimeModule(() => import("./user-profiles-http-BK-8mY1U.js"));
const getPluginNodeCapabilityAuthModule = createLazyRuntimeModule(() => import("./plugin-node-capability-auth-CHhP6tuU.js"));
const getHttpAuthUtilsModule = createLazyRuntimeModule(() => import("./http-auth-utils-Bsz5LWZ6.js"));
const getPluginRouteRuntimeScopesModule = createLazyRuntimeModule(() => import("./plugin-route-runtime-scopes-qRFIiaj4.js"));
const GATEWAY_PROBE_STATUS_BY_PATH = /* @__PURE__ */ new Map([
	["/health", "live"],
	["/healthz", "live"],
	["/ready", "ready"],
	["/readyz", "ready"]
]);
function isControlUiCatalogIconRequest(pathname, basePath) {
	const normalizedBasePath = basePath && basePath !== "/" ? basePath.endsWith("/") ? basePath.slice(0, -1) : basePath : "";
	return [CONTROL_UI_PLUGIN_ICON_PATH_PREFIX, CONTROL_UI_CATALOG_ICON_PATH_PREFIX].some((prefix) => pathname.startsWith(`${normalizedBasePath}${prefix}/`));
}
const pluginGatewayAuthBypassPathsCache = /* @__PURE__ */ new WeakMap();
async function resolvePluginGatewayAuthBypassPaths(configSnapshot) {
	const paths = /* @__PURE__ */ new Set();
	const configuredChannels = configSnapshot.channels;
	if (!configuredChannels || Object.keys(configuredChannels).length === 0) return paths;
	for (const channelId of Object.keys(configuredChannels)) for (const path of await resolveBundledChannelGatewayAuthBypassPaths({
		channelId,
		cfg: configSnapshot
	})) paths.add(path);
	return paths;
}
function getCachedPluginGatewayAuthBypassPaths(configSnapshot) {
	const cached = pluginGatewayAuthBypassPathsCache.get(configSnapshot);
	if (cached) return cached;
	const resolved = resolvePluginGatewayAuthBypassPaths(configSnapshot).catch((error) => {
		pluginGatewayAuthBypassPathsCache.delete(configSnapshot);
		throw error;
	});
	pluginGatewayAuthBypassPathsCache.set(configSnapshot, resolved);
	return resolved;
}
function isOpenAiModelsPath(pathname) {
	return pathname === "/v1/models" || pathname.startsWith("/v1/models/");
}
function isMcpAppStandalonePath(pathname) {
	return pathname === "/__openclaw__/mcp-app" || pathname === "/__openclaw__/mcp-app/view";
}
function isBoardWidgetPath(pathname) {
	return pathname.startsWith("/__openclaw__/board/");
}
function isEmbeddingsPath(pathname) {
	return pathname === "/v1/embeddings";
}
function isOpenAiChatCompletionsPath(pathname) {
	return pathname === "/v1/chat/completions";
}
function isOpenResponsesPath(pathname) {
	return pathname === "/v1/responses";
}
function isToolsInvokePath(pathname) {
	return pathname === "/tools/invoke";
}
function isManagedOutgoingImagePath(pathname) {
	return pathname.startsWith("/api/chat/media/outgoing/");
}
function isSessionKillPath(pathname) {
	return /^\/sessions\/[^/]+\/kill$/.test(pathname);
}
function isSessionHistoryPath(pathname) {
	return /^\/sessions\/[^/]+\/history$/.test(pathname);
}
function shouldEnforceDefaultPluginGatewayAuth(pathContext) {
	return pathContext.malformedEncoding || pathContext.decodePassLimitReached || isProtectedPluginRoutePathFromContext(pathContext);
}
async function canRevealReadinessDetails(params) {
	if (isLocalDirectRequest(params.req, params.trustedProxies, params.allowRealIpFallback)) return true;
	if (params.resolvedAuth.mode === "none") return false;
	const { getBearerToken, resolveHttpBrowserOriginPolicy } = await getHttpAuthUtilsModule();
	const bearerToken = getBearerToken(params.req);
	return (await authorizeHttpGatewayConnect({
		auth: params.resolvedAuth,
		connectAuth: bearerToken ? {
			token: bearerToken,
			password: bearerToken
		} : null,
		req: params.req,
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback,
		browserOriginPolicy: resolveHttpBrowserOriginPolicy(params.req)
	})).ok;
}
/** Handles live/ready probe endpoints before normal gateway routing. */
async function handleGatewayProbeRequest(req, res, requestPath, resolvedAuth, trustedProxies, allowRealIpFallback, getReadiness) {
	const status = GATEWAY_PROBE_STATUS_BY_PATH.get(requestPath);
	if (!status) return false;
	const method = (req.method ?? "GET").toUpperCase();
	if (method !== "GET" && method !== "HEAD") {
		res.statusCode = 405;
		res.setHeader("Allow", "GET, HEAD");
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("Method Not Allowed");
		return true;
	}
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.setHeader("Cache-Control", "no-store");
	let statusCode;
	let body;
	if (status === "ready" && getReadiness) {
		const includeDetails = await canRevealReadinessDetails({
			req,
			resolvedAuth,
			trustedProxies,
			allowRealIpFallback
		});
		try {
			const result = getReadiness();
			statusCode = result.ready ? 200 : 503;
			body = JSON.stringify(includeDetails ? result : { ready: result.ready });
		} catch {
			statusCode = 503;
			body = JSON.stringify(includeDetails ? {
				ready: false,
				failing: ["internal"],
				uptimeMs: 0
			} : { ready: false });
		}
	} else {
		statusCode = 200;
		body = JSON.stringify({
			ok: true,
			status
		});
	}
	res.statusCode = statusCode;
	res.end(method === "HEAD" ? void 0 : body);
	return true;
}
function writeUpgradeAuthFailure(socket, auth) {
	if (auth.rateLimited) {
		const retryAfterSeconds = auth.retryAfterMs && auth.retryAfterMs > 0 ? Math.ceil(auth.retryAfterMs / 1e3) : void 0;
		socket.write([
			"HTTP/1.1 429 Too Many Requests",
			retryAfterSeconds ? `Retry-After: ${retryAfterSeconds}` : void 0,
			"Content-Type: application/json; charset=utf-8",
			"Connection: close",
			"",
			JSON.stringify({ error: {
				message: "Too many failed authentication attempts. Please try again later.",
				type: "rate_limited"
			} })
		].filter(Boolean).join("\r\n"));
		return;
	}
	socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
}
function parseGatewayRequestPath(rawUrl) {
	try {
		return new URL(rawUrl ?? "/", "http://localhost").pathname;
	} catch {
		return;
	}
}
async function runGatewayHttpRequestStages(stages) {
	for (const stage of stages) try {
		if (await stage.run()) return true;
	} catch (err) {
		if (!stage.continueOnError) throw err;
		console.error(`[gateway-http] stage "${stage.name}" threw — skipping:`, err);
	}
	return false;
}
function buildPluginRequestStages(params) {
	if (!params.handlePluginRequest) return [];
	const requestClientIp = resolveRequestClientIp(params.req, params.trustedProxies, params.allowRealIpFallback);
	let pluginGatewayAuthSatisfied = false;
	let pluginGatewayRequestAuth;
	let pluginRequestOperatorScopes;
	return [{
		name: "plugin-auth",
		run: async () => {
			const pathContext = params.pluginPathContext ?? resolvePluginRoutePathContext(params.requestPath);
			if (!(params.shouldEnforcePluginGatewayAuth ?? shouldEnforceDefaultPluginGatewayAuth)(pathContext)) return false;
			if ((await params.getGatewayAuthBypassPaths()).has(params.requestPath)) return false;
			const { authorizePluginGatewayHttpRequestOrReply } = await getHttpAuthUtilsModule();
			const { resolvePluginRouteRuntimeOperatorScopes } = await getPluginRouteRuntimeScopesModule();
			const authResult = await authorizePluginGatewayHttpRequestOrReply({
				req: params.req,
				res: params.res,
				auth: params.resolvedAuth,
				trustedProxies: params.trustedProxies,
				allowRealIpFallback: params.allowRealIpFallback,
				rateLimiter: params.rateLimiter,
				requestPath: params.requestPath,
				resolveOperatorScopes: resolvePluginRouteRuntimeOperatorScopes
			});
			if (!authResult) return true;
			pluginGatewayAuthSatisfied = true;
			pluginGatewayRequestAuth = authResult.requestAuth;
			pluginRequestOperatorScopes = authResult.operatorScopes;
			return false;
		}
	}, {
		name: "plugin-http",
		continueOnError: true,
		run: () => {
			const pathContext = params.pluginPathContext ?? resolvePluginRoutePathContext(params.requestPath);
			return params.handlePluginRequest?.(params.req, params.res, pathContext, {
				gatewayAuthSatisfied: pluginGatewayAuthSatisfied,
				gatewayRequestAuth: pluginGatewayRequestAuth,
				gatewayRequestOperatorScopes: pluginRequestOperatorScopes,
				gatewayRequestClientIp: requestClientIp
			}) ?? false;
		}
	}];
}
/** Creates the gateway HTTP/HTTPS server and ordered request-stage router. */
function createGatewayHttpServer(opts) {
	const { clients, controlUiEnabled, controlUiBasePath, controlUiRoot, openAiChatCompletionsEnabled, openAiChatCompletionsConfig, openResponsesEnabled, openResponsesConfig, strictTransportSecurityHeader, handleHooksRequest, handlePluginRequest, shouldEnforcePluginGatewayAuth, resolvePluginNodeCapabilityRoute, resolvedAuth, rateLimiter, getReadiness } = opts;
	const getResolvedAuth = opts.getResolvedAuth ?? (() => resolvedAuth);
	const loadGatewayConfig = opts.getRuntimeConfig ?? getRuntimeConfig;
	const openAiCompatEnabled = openAiChatCompletionsEnabled || openResponsesEnabled;
	const httpServer = opts.tlsOptions ? createServer$1(opts.tlsOptions, (req, res) => {
		handleRequestWithTrace(req, res);
	}) : createServer((req, res) => {
		handleRequestWithTrace(req, res);
	});
	function handleRequestWithTrace(req, res) {
		return runWithDiagnosticTraceContext(createDiagnosticTraceContext(), () => handleRequest(req, res));
	}
	async function handleRequest(req, res) {
		setDefaultSecurityHeaders(res, { strictTransportSecurity: strictTransportSecurityHeader });
		if ((req.headers.upgrade ?? "").toLowerCase() === "websocket") return;
		try {
			const requestPath = parseGatewayRequestPath(req.url);
			if (requestPath === void 0) {
				sendGatewayAuthFailure(res, {
					ok: false,
					reason: "unauthorized"
				});
				return;
			}
			if (GATEWAY_PROBE_STATUS_BY_PATH.get(requestPath) === "live") {
				await handleGatewayProbeRequest(req, res, requestPath, getResolvedAuth(), [], false, getReadiness);
				return;
			}
			const configSnapshot = loadGatewayConfig();
			const trustedProxies = configSnapshot.gateway?.trustedProxies ?? [];
			const allowRealIpFallback = configSnapshot.gateway?.allowRealIpFallback === true;
			const scopedNodeCapability = normalizePluginNodeCapabilityScopedUrl(req.url ?? "/");
			if (scopedNodeCapability.malformedScopedPath) {
				sendGatewayAuthFailure(res, {
					ok: false,
					reason: "unauthorized"
				});
				return;
			}
			if (scopedNodeCapability.rewrittenUrl) req.url = scopedNodeCapability.rewrittenUrl;
			const scopedRequestPath = scopedNodeCapability.pathname;
			const pluginPathContext = resolvePluginRoutePathContext(scopedRequestPath);
			const nodeCapability = resolvePluginNodeCapabilityRoute?.(pluginPathContext);
			const resolvedAuthValue = getResolvedAuth();
			const handleControlUiRequest = async () => (await getControlUiModule()).handleControlUiHttpRequest(req, res, {
				basePath: controlUiBasePath,
				config: configSnapshot,
				terminalEnabled: opts.isTerminalEnabled?.() ?? configSnapshot.gateway?.terminal?.enabled === true,
				agentId: resolveAssistantIdentity({ cfg: configSnapshot }).agentId,
				root: controlUiRoot,
				auth: resolvedAuthValue,
				trustedProxies,
				allowRealIpFallback,
				rateLimiter
			});
			const requestStages = [{
				name: "gateway-probes",
				run: () => handleGatewayProbeRequest(req, res, scopedRequestPath, resolvedAuthValue, trustedProxies, allowRealIpFallback, getReadiness)
			}, {
				name: "hooks",
				run: () => handleHooksRequest(req, res)
			}];
			if (opts.handleWatchNodeRequest && scopedRequestPath.startsWith("/api/nodes/watch/")) requestStages.push({
				name: "watch-node",
				run: () => runWithGatewayHttpWorkAdmission(res, () => opts.handleWatchNodeRequest?.(req, res) ?? false)
			});
			if (openAiCompatEnabled && isOpenAiModelsPath(scopedRequestPath)) requestStages.push({
				name: "models",
				run: async () => await runWithGatewayHttpWorkAdmission(res, async () => (await getModelsHttpModule()).handleOpenAiModelsHttpRequest(req, res, {
					auth: resolvedAuthValue,
					trustedProxies,
					allowRealIpFallback,
					rateLimiter
				}))
			});
			if (openAiCompatEnabled && isEmbeddingsPath(scopedRequestPath)) requestStages.push({
				name: "embeddings",
				run: async () => await runWithGatewayHttpWorkAdmission(res, async () => (await getEmbeddingsHttpModule()).handleOpenAiEmbeddingsHttpRequest(req, res, {
					auth: resolvedAuthValue,
					trustedProxies,
					allowRealIpFallback,
					rateLimiter
				}))
			});
			if (isToolsInvokePath(scopedRequestPath)) requestStages.push({
				name: "tools-invoke",
				run: async () => await runWithGatewayHttpWorkAdmission(res, async () => (await getToolsInvokeHttpModule()).handleToolsInvokeHttpRequest(req, res, {
					auth: resolvedAuthValue,
					trustedProxies,
					allowRealIpFallback,
					rateLimiter
				}))
			});
			if (isSessionKillPath(scopedRequestPath)) requestStages.push({
				name: "sessions-kill",
				run: async () => await runWithGatewayHttpWorkAdmission(res, async () => (await getSessionKillHttpModule()).handleSessionKillHttpRequest(req, res, {
					auth: resolvedAuthValue,
					trustedProxies,
					allowRealIpFallback,
					rateLimiter
				}))
			});
			if (isSessionHistoryPath(scopedRequestPath)) requestStages.push({
				name: "sessions-history",
				run: async () => await runWithGatewayHttpWorkAdmission(res, async () => (await getSessionHistoryHttpModule()).handleSessionHistoryHttpRequest(req, res, {
					auth: resolvedAuthValue,
					getResolvedAuth,
					trustedProxies,
					allowRealIpFallback,
					rateLimiter
				}))
			});
			if (isBoardWidgetPath(scopedRequestPath)) requestStages.push({
				name: "board-widget",
				run: async () => await runWithGatewayHttpWorkAdmission(res, async () => (await getBoardHttpModule()).handleBoardHttpRequest(req, res))
			});
			if (matchUserProfileAvatarPath(scopedRequestPath) !== void 0) requestStages.push({
				name: "user-profile-avatar",
				run: async () => await runWithGatewayHttpWorkAdmission(res, async () => (await getUserProfilesHttpModule()).handleUserProfileAvatarHttpRequest(req, res, scopedRequestPath, {
					auth: resolvedAuthValue,
					trustedProxies,
					allowRealIpFallback,
					rateLimiter
				}))
			});
			if (openResponsesEnabled && isOpenResponsesPath(scopedRequestPath)) requestStages.push({
				name: "openresponses",
				run: async () => await runWithGatewayHttpWorkAdmission(res, async () => (await getOpenResponsesHttpModule()).handleOpenResponsesHttpRequest(req, res, {
					auth: resolvedAuthValue,
					config: openResponsesConfig,
					trustedProxies,
					allowRealIpFallback,
					rateLimiter
				}))
			});
			if (openAiChatCompletionsEnabled && isOpenAiChatCompletionsPath(scopedRequestPath)) requestStages.push({
				name: "openai",
				run: async () => await runWithGatewayHttpWorkAdmission(res, async () => (await getOpenAiHttpModule()).handleOpenAiHttpRequest(req, res, {
					auth: resolvedAuthValue,
					config: openAiChatCompletionsConfig,
					trustedProxies,
					allowRealIpFallback,
					rateLimiter
				}))
			});
			if (isControlUiApprovalDocumentPath({
				basePath: controlUiBasePath,
				pathname: scopedRequestPath
			})) requestStages.push({
				name: "control-ui-approval-document",
				run: async () => {
					if (!controlUiEnabled) {
						res.statusCode = 404;
						res.setHeader("Content-Type", "text/plain; charset=utf-8");
						res.end("Not Found");
						return true;
					}
					if (await handleControlUiRequest()) return true;
					res.statusCode = 404;
					res.setHeader("Content-Type", "text/plain; charset=utf-8");
					res.end("Not Found");
					return true;
				}
			});
			if (nodeCapability) requestStages.push({
				name: "node-capability-auth",
				run: async () => {
					if (!nodeCapability) return false;
					const { authorizePluginNodeCapabilityRequest } = await getPluginNodeCapabilityAuthModule();
					const ok = await authorizePluginNodeCapabilityRequest({
						req,
						auth: resolvedAuthValue,
						trustedProxies,
						allowRealIpFallback,
						clients,
						nodeCapability,
						capability: scopedNodeCapability.capability,
						malformedScopedPath: scopedNodeCapability.malformedScopedPath,
						rateLimiter
					});
					if (!ok.ok) {
						sendGatewayAuthFailure(res, ok);
						return true;
					}
					return false;
				}
			});
			if (nodeCapability && isCoreCanvasHostEnabled(configSnapshot) && isCanvasDocumentHttpPath(scopedRequestPath)) requestStages.push({
				name: "canvas-documents",
				run: async () => await (await getCanvasServeModule()).handleCanvasDocumentHttpRequest(req, res)
			});
			if (controlUiEnabled && isControlUiPluginManagerRequest({
				basePath: controlUiBasePath,
				pathname: scopedRequestPath,
				method: req.method
			})) requestStages.push({
				name: "control-ui-plugin-manager",
				run: async () => (await getControlUiModule()).handleControlUiHttpRequest(req, res, {
					basePath: controlUiBasePath,
					config: configSnapshot,
					terminalEnabled: opts.isTerminalEnabled?.() ?? configSnapshot.gateway?.terminal?.enabled === true,
					agentId: resolveAssistantIdentity({ cfg: configSnapshot }).agentId,
					root: controlUiRoot,
					auth: resolvedAuthValue,
					trustedProxies,
					allowRealIpFallback,
					rateLimiter
				})
			});
			if (configSnapshot.mcp?.apps?.enabled === true && isMcpAppStandalonePath(scopedRequestPath)) requestStages.push({
				name: "mcp-app-standalone",
				run: async () => {
					return await (await getMcpAppStandaloneModule()).handleMcpAppStandaloneHttpRequest(req, res, {
						sandboxPort: configSnapshot.mcp?.apps?.sandboxPort,
						sandboxOrigin: configSnapshot.mcp?.apps?.sandboxOrigin
					});
				}
			});
			requestStages.push(...buildPluginRequestStages({
				req,
				res,
				requestPath: scopedRequestPath,
				getGatewayAuthBypassPaths: () => getCachedPluginGatewayAuthBypassPaths(configSnapshot),
				pluginPathContext,
				handlePluginRequest,
				shouldEnforcePluginGatewayAuth,
				resolvedAuth: resolvedAuthValue,
				trustedProxies,
				allowRealIpFallback,
				rateLimiter
			}));
			if (isManagedOutgoingImagePath(scopedRequestPath)) requestStages.push({
				name: "chat-managed-image-media",
				run: async () => (await getManagedImageAttachmentsModule()).handleManagedOutgoingImageHttpRequest(req, res, {
					auth: resolvedAuthValue,
					trustedProxies,
					allowRealIpFallback,
					rateLimiter
				})
			});
			if (controlUiEnabled && isControlUiCatalogIconRequest(scopedRequestPath, controlUiBasePath)) requestStages.push({
				name: "control-ui-catalog-icon",
				run: async () => (await getPluginIconHttpModule()).handlePluginIconHttpRequest(req, res, {
					basePath: controlUiBasePath,
					config: configSnapshot,
					auth: resolvedAuthValue,
					trustedProxies,
					allowRealIpFallback,
					rateLimiter
				})
			});
			if (controlUiEnabled) {
				requestStages.push({
					name: "control-ui-assistant-media",
					run: async () => (await getControlUiModule()).handleControlUiAssistantMediaRequest(req, res, {
						basePath: controlUiBasePath,
						config: configSnapshot,
						agentId: resolveAssistantIdentity({ cfg: configSnapshot }).agentId,
						auth: resolvedAuthValue,
						trustedProxies,
						allowRealIpFallback,
						rateLimiter
					})
				});
				requestStages.push({
					name: "control-ui-avatar",
					run: async () => {
						const { handleControlUiAvatarRequest } = await getControlUiModule();
						return handleControlUiAvatarRequest(req, res, {
							basePath: controlUiBasePath,
							config: configSnapshot,
							auth: resolvedAuthValue,
							trustedProxies,
							allowRealIpFallback,
							rateLimiter
						});
					}
				});
				requestStages.push({
					name: "control-ui-http",
					run: handleControlUiRequest
				});
			}
			if (await runGatewayHttpRequestStages(requestStages)) return;
			res.statusCode = 404;
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Not Found");
		} catch (err) {
			console.error("[gateway-http] unhandled error in request handler:", err);
			res.statusCode = 500;
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Internal Server Error");
		}
	}
	return httpServer;
}
/** Attaches WebSocket and plugin-upgrade routing to an already-created HTTP server. */
function attachGatewayUpgradeHandler(opts) {
	const { httpServer, wss, handlePluginUpgrade, shouldEnforcePluginGatewayAuth, resolvePluginNodeCapabilityRoute, clients, preauthConnectionBudget, resolvedAuth, rateLimiter, log } = opts;
	const getResolvedAuth = opts.getResolvedAuth ?? (() => resolvedAuth);
	httpServer.on("upgrade", (req, socket, head) => {
		runWithDiagnosticTraceContext(createDiagnosticTraceContext(), async () => {
			const configSnapshot = getRuntimeConfig();
			const trustedProxies = configSnapshot.gateway?.trustedProxies ?? [];
			const allowRealIpFallback = configSnapshot.gateway?.allowRealIpFallback === true;
			const requestClientIp = resolveRequestClientIp(req, trustedProxies, allowRealIpFallback);
			const scopedNodeCapability = normalizePluginNodeCapabilityScopedUrl(req.url ?? "/");
			if (scopedNodeCapability.malformedScopedPath) {
				writeUpgradeAuthFailure(socket, {
					ok: false,
					reason: "unauthorized"
				});
				socket.destroy();
				return;
			}
			if (scopedNodeCapability.rewrittenUrl) req.url = scopedNodeCapability.rewrittenUrl;
			const resolvedAuthLocal = getResolvedAuth();
			const requestPath = scopedNodeCapability.pathname;
			const pathContext = resolvePluginRoutePathContext(requestPath);
			const nodeCapability = resolvePluginNodeCapabilityRoute?.(pathContext);
			if (nodeCapability) {
				const { authorizePluginNodeCapabilityRequest } = await getPluginNodeCapabilityAuthModule();
				const ok = await authorizePluginNodeCapabilityRequest({
					req,
					auth: resolvedAuthLocal,
					trustedProxies,
					allowRealIpFallback,
					clients,
					nodeCapability,
					capability: scopedNodeCapability.capability,
					malformedScopedPath: scopedNodeCapability.malformedScopedPath,
					rateLimiter
				});
				if (!ok.ok) {
					writeUpgradeAuthFailure(socket, ok);
					socket.destroy();
					return;
				}
			}
			if (handlePluginUpgrade) {
				let pluginGatewayAuthSatisfied = false;
				let pluginGatewayRequestAuth;
				let pluginGatewayRequestOperatorScopes;
				if ((shouldEnforcePluginGatewayAuth ?? shouldEnforceDefaultPluginGatewayAuth)(pathContext) && !(await getCachedPluginGatewayAuthBypassPaths(configSnapshot)).has(requestPath)) {
					const { checkGatewayHttpRequestAuth } = await getHttpAuthUtilsModule();
					const authCheck = await checkGatewayHttpRequestAuth({
						req,
						auth: resolvedAuthLocal,
						trustedProxies,
						allowRealIpFallback,
						rateLimiter,
						cfg: configSnapshot
					});
					if (!authCheck.ok) {
						writeUpgradeAuthFailure(socket, authCheck.authResult);
						socket.destroy();
						return;
					}
					pluginGatewayAuthSatisfied = true;
					pluginGatewayRequestAuth = authCheck.requestAuth;
					const { resolvePluginRouteRuntimeOperatorScopes } = await getPluginRouteRuntimeScopesModule();
					pluginGatewayRequestOperatorScopes = resolvePluginRouteRuntimeOperatorScopes(req, authCheck.requestAuth);
				}
				if (await handlePluginUpgrade(req, socket, head, pathContext, {
					gatewayAuthSatisfied: pluginGatewayAuthSatisfied,
					gatewayRequestAuth: pluginGatewayRequestAuth,
					gatewayRequestOperatorScopes: pluginGatewayRequestOperatorScopes,
					gatewayRequestClientIp: requestClientIp
				})) return;
			}
			if (isGatewayWorkAdmissionClosed()) {
				writeGatewayUpgradeServiceUnavailable(socket, "Gateway websocket admission closed");
				socket.destroy();
				return;
			}
			const preauthBudgetKey = requestClientIp;
			if (wss.listenerCount("connection") === 0) {
				writeGatewayUpgradeServiceUnavailable(socket, "Gateway websocket handlers unavailable");
				socket.destroy();
				return;
			}
			if (!preauthConnectionBudget.acquire(preauthBudgetKey)) {
				writeGatewayUpgradeServiceUnavailable(socket, "Too many unauthenticated sockets");
				socket.destroy();
				return;
			}
			let budgetTransferred = false;
			const releaseUpgradeBudget = () => {
				if (budgetTransferred) return;
				budgetTransferred = true;
				preauthConnectionBudget.release(preauthBudgetKey);
			};
			socket.once("close", releaseUpgradeBudget);
			try {
				wss.handleUpgrade(req, socket, head, (ws) => {
					ws["__openclawPreauthBudgetKey"] = preauthBudgetKey;
					wss.emit("connection", ws, req);
					if (Boolean(ws["__openclawPreauthBudgetClaimed"])) {
						budgetTransferred = true;
						socket.off("close", releaseUpgradeBudget);
					}
				});
			} catch {
				socket.off("close", releaseUpgradeBudget);
				releaseUpgradeBudget();
				throw new Error("gateway websocket upgrade failed");
			}
		}).catch((err) => {
			const remoteAddress = socket.remoteAddress ?? "unknown";
			const errorMessage = err instanceof Error ? err.message : String(err);
			log?.warn(`ws upgrade error from ${remoteAddress}: ${errorMessage}`);
			socket.destroy();
		});
	});
}
/** Attach the loopback-only worker ingress and force every accepted socket into worker mode. */
function attachWorkerGatewayUpgradeHandler(params) {
	params.httpServer.on("upgrade", (req, socket, head) => {
		if (isGatewayWorkAdmissionClosed()) {
			writeGatewayUpgradeServiceUnavailable(socket, "Worker websocket admission closed");
			socket.destroy();
			return;
		}
		const preauthBudgetKey = req.socket.remoteAddress;
		if (params.wss.listenerCount("connection") === 0) {
			writeGatewayUpgradeServiceUnavailable(socket, "Worker websocket handlers unavailable");
			socket.destroy();
			return;
		}
		if (!params.preauthConnectionBudget.acquire(preauthBudgetKey)) {
			writeGatewayUpgradeServiceUnavailable(socket, "Too many unauthenticated sockets");
			socket.destroy();
			return;
		}
		let budgetTransferred = false;
		const releaseUpgradeBudget = () => {
			if (budgetTransferred) return;
			budgetTransferred = true;
			params.preauthConnectionBudget.release(preauthBudgetKey);
		};
		socket.once("close", releaseUpgradeBudget);
		try {
			params.wss.handleUpgrade(req, socket, head, (ws) => {
				const workerSocket = ws;
				workerSocket[GATEWAY_WS_CONNECTION_KIND_PROPERTY] = "worker";
				workerSocket[GATEWAY_WS_PREAUTH_BUDGET_PROPERTY] = params.preauthConnectionBudget;
				workerSocket["__openclawPreauthBudgetKey"] = preauthBudgetKey;
				params.wss.emit("connection", ws, req);
				if (workerSocket["__openclawPreauthBudgetClaimed"]) {
					budgetTransferred = true;
					socket.off("close", releaseUpgradeBudget);
				}
			});
		} catch (error) {
			socket.off("close", releaseUpgradeBudget);
			releaseUpgradeBudget();
			params.log?.warn(`worker websocket upgrade failed: ${error instanceof Error ? error.message : String(error)}`);
			socket.destroy();
		}
	});
}
//#endregion
//#region src/gateway/server/http-listen.ts
const EADDRINUSE_MAX_RETRIES = 20;
const EADDRINUSE_RETRY_INTERVAL_MS = 500;
async function closeServerQuietly(httpServer) {
	await new Promise((resolve) => {
		try {
			httpServer.close(() => resolve());
		} catch {
			resolve();
		}
	});
}
/** Listen on the configured gateway host/port, retrying transient EADDRINUSE windows. */
async function listenGatewayHttpServer(params) {
	const { httpServer, bindHost, port, retryEaddrinuse = true, serviceName = "gateway", endpointScheme = "ws" } = params;
	const maxRetries = retryEaddrinuse ? EADDRINUSE_MAX_RETRIES : 0;
	for (const attempt of Array.from({ length: maxRetries + 1 }, (_, index) => index)) try {
		await new Promise((resolve, reject) => {
			const onError = (err) => {
				httpServer.off("listening", onListening);
				reject(err);
			};
			const onListening = () => {
				httpServer.off("error", onError);
				resolve();
			};
			httpServer.once("error", onError);
			httpServer.once("listening", onListening);
			httpServer.listen(port, bindHost);
		});
		return;
	} catch (err) {
		const code = err.code;
		if (code === "EADDRINUSE" && attempt < maxRetries) {
			await closeServerQuietly(httpServer);
			await sleep(EADDRINUSE_RETRY_INTERVAL_MS);
			continue;
		}
		if (code === "EADDRINUSE") throw new GatewayLockError(`another ${serviceName} instance is already listening on ${endpointScheme}://${bindHost}:${port}`, err);
		throw new GatewayLockError(`failed to bind ${serviceName} socket on ${endpointScheme}://${bindHost}:${port}: ${String(err)}`, err);
	}
}
//#endregion
//#region src/gateway/server/preauth-connection-budget.ts
const DEFAULT_MAX_PREAUTH_CONNECTIONS_PER_IP = 32;
const UNKNOWN_CLIENT_IP_BUDGET_KEY = "__openclaw_unknown_client_ip__";
function getMaxPreauthConnectionsPerIpFromEnv(env = process.env) {
	const configured = env.OPENCLAW_MAX_PREAUTH_CONNECTIONS_PER_IP || env.VITEST && env.OPENCLAW_TEST_MAX_PREAUTH_CONNECTIONS_PER_IP;
	if (!configured) return DEFAULT_MAX_PREAUTH_CONNECTIONS_PER_IP;
	const parsed = parseStrictPositiveInteger(configured);
	if (parsed === void 0) return DEFAULT_MAX_PREAUTH_CONNECTIONS_PER_IP;
	return parsed;
}
function createPreauthConnectionBudget(limit = getMaxPreauthConnectionsPerIpFromEnv()) {
	const maxConnectionsPerIp = resolveIntegerOption(limit, getMaxPreauthConnectionsPerIpFromEnv(), { min: 1 });
	const counts = /* @__PURE__ */ new Map();
	const normalizeBudgetKey = (clientIp) => {
		return clientIp?.trim() || UNKNOWN_CLIENT_IP_BUDGET_KEY;
	};
	return {
		acquire(clientIp) {
			const ip = normalizeBudgetKey(clientIp);
			const next = (counts.get(ip) ?? 0) + 1;
			if (next > maxConnectionsPerIp) return false;
			counts.set(ip, next);
			return true;
		},
		release(clientIp) {
			const ip = normalizeBudgetKey(clientIp);
			const current = counts.get(ip);
			if (current === void 0) return;
			if (current <= 1) {
				counts.delete(ip);
				return;
			}
			counts.set(ip, current - 1);
		}
	};
}
//#endregion
//#region src/gateway/server-runtime-state.ts
const loadGatewayPluginsHttpModule = async () => await import("./plugins-http-Dol8RBRf.js");
/** Creates the HTTP/WebSocket runtime state and pinned plugin registries for one gateway start. */
async function createGatewayRuntimeState(params) {
	pinActivePluginHttpRouteRegistry(params.pluginRegistry);
	pinActivePluginSessionExtensionRegistry(params.pluginRegistry);
	if (params.pinChannelRegistry !== false) pinActivePluginChannelRegistry(params.pluginRegistry);
	else releasePinnedPluginChannelRegistry();
	try {
		const loadRuntimeConfig = params.getRuntimeConfig ?? (() => params.cfg);
		const resolvePluginRouteRegistry = () => params.getPluginRouteRegistry?.() ?? params.pluginRegistry;
		const clients = /* @__PURE__ */ new Set();
		const sessionEventSubscribers = createSessionEventSubscriberRegistry();
		const sessionMessageSubscribers = createSessionMessageSubscriberRegistry();
		const gatewayBroadcaster = createGatewayBroadcaster({
			clients,
			sessionMessageSubscribers
		});
		let loadedHooksRequestHandler = null;
		const handleHooksRequest = async (req, res) => {
			const hooksConfig = params.hooksConfig();
			if (!hooksConfig) return false;
			const url = new URL(req.url ?? "/", "http://localhost");
			const basePath = hooksConfig.basePath;
			if (url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) return false;
			return await runWithGatewayHttpWorkAdmission(res, async () => {
				if (!loadedHooksRequestHandler) {
					const { createGatewayHooksRequestHandler } = await import("./hooks-CH065ZvI.js");
					loadedHooksRequestHandler = createGatewayHooksRequestHandler({
						deps: params.deps,
						getHooksConfig: params.hooksConfig,
						getClientIpConfig: params.getHookClientIpConfig,
						bindHost: params.bindHost,
						port: params.port,
						logHooks: params.logHooks
					});
				}
				return await loadedHooksRequestHandler(req, res);
			});
		};
		let loadedPluginRequestHandler = null;
		let loadedPluginUpgradeHandler = null;
		const handlePluginRequest = async (req, res, pathContext, dispatchContext) => {
			if ((resolvePluginRouteRegistry().httpRoutes ?? []).length === 0) return false;
			if (!loadedPluginRequestHandler) {
				const { createGatewayPluginRequestHandler } = await loadGatewayPluginsHttpModule();
				loadedPluginRequestHandler = createGatewayPluginRequestHandler({
					registry: params.pluginRegistry,
					getRouteRegistry: resolvePluginRouteRegistry,
					log: params.logPlugins,
					getGatewayRequestContext: params.getGatewayRequestContext
				});
			}
			return await loadedPluginRequestHandler(req, res, pathContext, dispatchContext);
		};
		const handlePluginUpgrade = async (req, socket, head, pathContext, dispatchContext) => {
			if ((resolvePluginRouteRegistry().httpRoutes ?? []).length === 0) return false;
			if (!loadedPluginUpgradeHandler) {
				const { createGatewayPluginUpgradeHandler } = await loadGatewayPluginsHttpModule();
				loadedPluginUpgradeHandler = createGatewayPluginUpgradeHandler({
					registry: params.pluginRegistry,
					getRouteRegistry: resolvePluginRouteRegistry,
					log: params.logPlugins,
					getGatewayRequestContext: params.getGatewayRequestContext
				});
			}
			return await loadedPluginUpgradeHandler(req, socket, head, pathContext, dispatchContext);
		};
		const shouldEnforcePluginGatewayAuth = (pathContext) => {
			return shouldEnforceGatewayAuthForPluginPath(resolvePluginRouteRegistry(), pathContext);
		};
		const resolvePluginNodeCapabilityRoute = (pathContext) => {
			const coreCanvasCapability = isCoreCanvasHostEnabled(loadRuntimeConfig()) ? resolveCanvasNodeCapability(pathContext.candidates) : void 0;
			if (coreCanvasCapability) return coreCanvasCapability;
			return findMatchingPluginNodeCapabilityRoute(resolvePluginRouteRegistry(), pathContext)?.nodeCapability;
		};
		const bindHosts = await resolveGatewayListenHosts(params.bindHost);
		if (!isLoopbackHost(params.bindHost)) params.log.warn("⚠️  Gateway is binding to a non-loopback address. Ensure authentication is configured before exposing to public networks.");
		if (params.cfg.gateway?.controlUi?.dangerouslyAllowHostHeaderOriginFallback === true) params.log.warn("⚠️  gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback=true is enabled. Host-header origin fallback weakens origin checks and should only be used as break-glass.");
		const wss = new WebSocketServer({
			noServer: true,
			maxPayload: MAX_PREAUTH_PAYLOAD_BYTES
		});
		const preauthConnectionBudget = createPreauthConnectionBudget();
		const workerPreauthConnectionBudget = createPreauthConnectionBudget();
		const httpServers = [];
		const gatewayHttpServers = [];
		const httpBindHosts = [];
		for (const _ of bindHosts) {
			const httpServer = createGatewayHttpServer({
				clients,
				controlUiEnabled: params.controlUiEnabled,
				controlUiBasePath: params.controlUiBasePath,
				controlUiRoot: params.controlUiRoot,
				openAiChatCompletionsEnabled: params.openAiChatCompletionsEnabled,
				openAiChatCompletionsConfig: params.openAiChatCompletionsConfig,
				openResponsesEnabled: params.openResponsesEnabled,
				openResponsesConfig: params.openResponsesConfig,
				strictTransportSecurityHeader: params.strictTransportSecurityHeader,
				handleWatchNodeRequest: params.handleWatchNodeRequest,
				handleHooksRequest,
				handlePluginRequest,
				shouldEnforcePluginGatewayAuth,
				resolvePluginNodeCapabilityRoute,
				resolvedAuth: params.resolvedAuth,
				getResolvedAuth: params.getResolvedAuth,
				rateLimiter: params.rateLimiter,
				getReadiness: params.getReadiness,
				getRuntimeConfig: loadRuntimeConfig,
				isTerminalEnabled: params.isTerminalEnabled,
				tlsOptions: params.gatewayTls?.enabled ? params.gatewayTls.tlsOptions : void 0
			});
			attachGatewayUpgradeHandler({
				httpServer,
				wss,
				handlePluginUpgrade,
				shouldEnforcePluginGatewayAuth,
				resolvePluginNodeCapabilityRoute,
				clients,
				preauthConnectionBudget,
				resolvedAuth: params.resolvedAuth,
				getResolvedAuth: params.getResolvedAuth,
				rateLimiter: params.rateLimiter,
				log: params.log
			});
			gatewayHttpServers.push(httpServer);
			httpServers.push(httpServer);
		}
		let workerIngressPort;
		const workerHttpServer = params.workerIngressEnabled ? createServer((_req, res) => {
			res.statusCode = 404;
			res.end("Not Found");
		}) : void 0;
		if (workerHttpServer) attachWorkerGatewayUpgradeHandler({
			httpServer: workerHttpServer,
			wss,
			preauthConnectionBudget: workerPreauthConnectionBudget,
			log: params.log
		});
		const httpServer = gatewayHttpServers[0];
		if (!httpServer) throw new Error("Gateway HTTP server failed to start");
		let mcpAppSandboxPort;
		let sandboxHostStartPromise = null;
		let startListeningPromise = null;
		let startListeningComplete = false;
		const startSandboxHost = async () => {
			if (sandboxHostStartPromise) return await sandboxHostStartPromise;
			sandboxHostStartPromise = (async () => {
				if (httpBindHosts.length === 0) throw new Error("Gateway listener must start before the sandbox host");
				const sandboxPort = resolveSandboxHostPort(params.port, params.cfg.mcp?.apps?.sandboxPort);
				const sandboxServers = bindHosts.map(() => createSandboxHostHttpServer(params.gatewayTls?.enabled ? params.gatewayTls.tlsOptions : void 0));
				httpServers.push(...sandboxServers);
				try {
					for (const host of httpBindHosts) {
						const server = sandboxServers[bindHosts.indexOf(host)];
						if (!server) throw new Error(`Missing sandbox host HTTP server for bind host ${host}`);
						await listenGatewayHttpServer({
							httpServer: server,
							bindHost: host,
							port: sandboxPort,
							retryEaddrinuse: false,
							serviceName: "MCP App sandbox",
							endpointScheme: params.gatewayTls?.enabled ? "https" : "http"
						});
					}
				} catch (error) {
					await Promise.all(sandboxServers.map((server) => new Promise((resolve) => {
						if (!server.listening) {
							resolve();
							return;
						}
						server.close(() => resolve());
					})));
					for (const server of sandboxServers) {
						const index = httpServers.indexOf(server);
						if (index >= 0) httpServers.splice(index, 1);
					}
					throw error;
				}
				mcpAppSandboxPort = sandboxPort;
				return sandboxPort;
			})();
			const startAttempt = sandboxHostStartPromise;
			startAttempt.catch(() => {
				if (sandboxHostStartPromise === startAttempt) sandboxHostStartPromise = null;
			});
			return await startAttempt;
		};
		const ensureSandboxHostPort = async () => {
			if (!startListeningComplete) {
				if (!startListeningPromise) throw new Error("Gateway listener must start before the sandbox host");
				await startListeningPromise;
			}
			return await startSandboxHost();
		};
		const startListening = async () => {
			if (startListeningPromise) {
				await startListeningPromise;
				return;
			}
			startListeningPromise = (async () => {
				const requiredAlias = params.bindHost !== "127.0.0.1" && bindHosts.includes("127.0.0.1") ? "127.0.0.1" : void 0;
				const listenOrder = requiredAlias ? [requiredAlias, ...bindHosts.filter((host) => host !== requiredAlias)] : bindHosts;
				const boundHosts = /* @__PURE__ */ new Set();
				for (const host of listenOrder) {
					const index = bindHosts.indexOf(host);
					const server = gatewayHttpServers[index];
					if (!server) throw new Error(`Missing gateway HTTP server for bind host ${host}`);
					const requiredLoopbackAlias = host === requiredAlias;
					try {
						await listenGatewayHttpServer({
							httpServer: server,
							bindHost: host,
							port: params.port,
							retryEaddrinuse: !requiredLoopbackAlias
						});
						boundHosts.add(host);
					} catch (err) {
						if (host === bindHosts[0] || requiredLoopbackAlias) throw err;
						params.log.warn(`gateway: failed to bind loopback alias ${host}:${params.port} (${String(err)})`);
					}
				}
				httpBindHosts.push(...bindHosts.filter((host) => boundHosts.has(host)));
				if (httpBindHosts.length === 0) throw new Error("Gateway HTTP server failed to start");
				if (params.cfg.mcp?.apps?.enabled === true) await startSandboxHost();
				if (workerHttpServer) {
					await listenGatewayHttpServer({
						httpServer: workerHttpServer,
						bindHost: "127.0.0.1",
						port: 0,
						retryEaddrinuse: false
					});
					const address = workerHttpServer.address();
					if (!address || typeof address === "string") throw new Error("Worker gateway ingress failed to resolve its loopback port");
					workerIngressPort = address.port;
					httpServers.push(workerHttpServer);
				}
				startListeningComplete = true;
			})();
			await startListeningPromise;
		};
		const agentRunSeq = /* @__PURE__ */ new Map();
		const dedupe = /* @__PURE__ */ new Map();
		const chatRunState = createChatRunState();
		const chatRunRegistry = chatRunState.registry;
		const chatRunBuffers = chatRunState.buffers;
		const chatDeltaSentAt = chatRunState.deltaSentAt;
		const chatDeltaLastBroadcastLen = chatRunState.deltaLastBroadcastLen;
		const addChatRun = chatRunRegistry.add;
		const removeChatRun = chatRunRegistry.remove;
		const chatAbortControllers = /* @__PURE__ */ new Map();
		const chatQueuedTurns = /* @__PURE__ */ new Map();
		const toolEventRecipients = createToolEventRecipientRegistry();
		return {
			releasePluginRouteRegistry: () => {
				releasePinnedPluginHttpRouteRegistry();
				releasePinnedPluginSessionExtensionRegistry();
				releasePinnedPluginChannelRegistry();
			},
			httpServer,
			httpServers,
			httpBindHosts,
			startListening,
			wss,
			preauthConnectionBudget,
			clients,
			...gatewayBroadcaster,
			agentRunSeq,
			dedupe,
			chatRunState,
			chatRunBuffers,
			chatDeltaSentAt,
			chatDeltaLastBroadcastLen,
			addChatRun,
			removeChatRun,
			chatAbortControllers,
			chatQueuedTurns,
			toolEventRecipients,
			sessionEventSubscribers,
			sessionMessageSubscribers,
			getWorkerIngressEndpoint: () => workerIngressPort === void 0 ? void 0 : {
				host: "127.0.0.1",
				port: workerIngressPort
			},
			getMcpAppSandboxPort: () => mcpAppSandboxPort,
			ensureSandboxHostPort
		};
	} catch (err) {
		releasePinnedPluginHttpRouteRegistry();
		releasePinnedPluginSessionExtensionRegistry();
		releasePinnedPluginChannelRegistry();
		throw err;
	}
}
//#endregion
//#region src/gateway/server-wizard-sessions.ts
const UNCOLLECTED_TERMINAL_RETENTION_MS = 300 * 1e3;
/** Creates the in-memory tracker used for active Gateway wizard sessions. */
function createWizardSessionTracker(options) {
	const wizardSessions = /* @__PURE__ */ new Map();
	const terminalSince = /* @__PURE__ */ new Map();
	const now = options?.now ?? Date.now;
	const findRunningWizard = () => {
		for (const [id, session] of wizardSessions) {
			if (session.getStatus() === "running") {
				terminalSince.delete(id);
				return id;
			}
			const observedAt = terminalSince.get(id);
			if (observedAt === void 0) terminalSince.set(id, now());
			else if (now() - observedAt >= UNCOLLECTED_TERMINAL_RETENTION_MS) {
				wizardSessions.delete(id);
				terminalSince.delete(id);
			}
		}
		return null;
	};
	const purgeWizardSession = (id) => {
		const session = wizardSessions.get(id);
		if (!session) return;
		if (session.getStatus() === "running") return;
		wizardSessions.delete(id);
		terminalSince.delete(id);
	};
	return {
		wizardSessions,
		findRunningWizard,
		purgeWizardSession
	};
}
//#endregion
//#region src/gateway/server/event-loop-health.ts
const EVENT_LOOP_MONITOR_RESOLUTION_MS = 20;
const EVENT_LOOP_DELAY_WARN_MS = 1e3;
const EVENT_LOOP_UTILIZATION_WARN = .95;
const CPU_CORE_RATIO_WARN = .9;
const LOAD_DEGRADATION_DELAY_COEVIDENCE_MS = 25;
const SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS = 1e3;
function roundMetric(value, digits = 3) {
	if (!Number.isFinite(value)) return 0;
	const factor = 10 ** digits;
	return Math.round(value * factor) / factor;
}
function nanosecondsToMilliseconds(value) {
	return roundMetric(value / 1e6, 1);
}
function classifyGatewayEventLoopHealthReasons(metrics) {
	const reasons = [];
	if (metrics.delayP99Ms >= EVENT_LOOP_DELAY_WARN_MS || metrics.delayMaxMs >= EVENT_LOOP_DELAY_WARN_MS) reasons.push("event_loop_delay");
	if (metrics.intervalMs < SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS) return reasons;
	if (!(metrics.delayP99Ms >= LOAD_DEGRADATION_DELAY_COEVIDENCE_MS || metrics.delayMaxMs >= LOAD_DEGRADATION_DELAY_COEVIDENCE_MS)) return reasons;
	if (metrics.utilization >= EVENT_LOOP_UTILIZATION_WARN) reasons.push("event_loop_utilization");
	if (metrics.cpuCoreRatio >= CPU_CORE_RATIO_WARN) reasons.push("cpu");
	return reasons;
}
function createGatewayEventLoopHealthMonitor(deps = {}) {
	const nowMs = deps.now ?? Date.now;
	const readCpuUsage = deps.cpuUsage ?? process.cpuUsage.bind(process);
	const readEventLoopUtilization = deps.eventLoopUtilization ?? performance.eventLoopUtilization.bind(performance);
	const createDelayMonitor = deps.createDelayMonitor ?? ((resolutionMs) => monitorEventLoopDelay({ resolution: resolutionMs }));
	let monitor = null;
	let lastWallAt = nowMs();
	let lastCpuUsage = readCpuUsage();
	let lastEventLoopUtilization = readEventLoopUtilization();
	let lastSnapshot;
	try {
		monitor = createDelayMonitor(EVENT_LOOP_MONITOR_RESOLUTION_MS);
		monitor.enable();
		monitor.reset();
	} catch {
		monitor = null;
	}
	return {
		snapshot: () => {
			if (!monitor || !lastCpuUsage || !lastEventLoopUtilization || lastWallAt <= 0) return;
			const now = nowMs();
			const intervalMs = Math.max(1, now - lastWallAt);
			const delayP99Ms = nanosecondsToMilliseconds(monitor.percentile(99));
			const delayMaxMs = nanosecondsToMilliseconds(monitor.max);
			if (!(delayP99Ms >= EVENT_LOOP_DELAY_WARN_MS || delayMaxMs >= EVENT_LOOP_DELAY_WARN_MS) && intervalMs < SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS) return lastSnapshot;
			const cpuUsage = readCpuUsage(lastCpuUsage);
			const currentEventLoopUtilization = readEventLoopUtilization();
			const utilization = roundMetric(readEventLoopUtilization(currentEventLoopUtilization, lastEventLoopUtilization).utilization);
			const cpuCoreRatio = roundMetric(roundMetric((cpuUsage.user + cpuUsage.system) / 1e3, 1) / intervalMs);
			const reasons = classifyGatewayEventLoopHealthReasons({
				intervalMs,
				delayP99Ms,
				delayMaxMs,
				utilization,
				cpuCoreRatio
			});
			const snapshot = {
				degraded: reasons.length > 0,
				reasons,
				intervalMs,
				delayP99Ms,
				delayMaxMs,
				utilization,
				cpuCoreRatio
			};
			monitor.reset();
			lastWallAt = now;
			lastCpuUsage = readCpuUsage();
			lastEventLoopUtilization = currentEventLoopUtilization;
			lastSnapshot = snapshot;
			return snapshot;
		},
		stop: () => {
			monitor?.disable();
			monitor = null;
			lastWallAt = 0;
			lastCpuUsage = null;
			lastEventLoopUtilization = null;
			lastSnapshot = void 0;
		}
	};
}
//#endregion
//#region src/gateway/server/readiness.ts
const DEFAULT_READINESS_CACHE_TTL_MS = 1e3;
function shouldIgnoreReadinessFailure(accountSnapshot, health, autostartSuppressed) {
	if (health.reason === "unmanaged" || health.reason === "stale-socket") return true;
	if (autostartSuppressed && health.reason === "not-running") return true;
	return health.reason === "not-running" && accountSnapshot.restartPending === true;
}
/** Create a cached readiness checker over channel runtime health. */
function createReadinessChecker(deps) {
	const { channelManager, startedAt } = deps;
	const cacheTtlMs = Math.max(0, deps.cacheTtlMs ?? DEFAULT_READINESS_CACHE_TTL_MS);
	let cachedAt = 0;
	let cachedState = null;
	return () => {
		const now = Date.now();
		const uptimeMs = now - startedAt;
		if (deps.getStartupPending?.()) return withEventLoopHealth({
			ready: false,
			failing: [deps.getStartupPendingReason?.() ?? "startup-sidecars"],
			uptimeMs
		}, deps.getEventLoopHealth);
		if (deps.getGatewayDraining?.()) return withEventLoopHealth({
			ready: false,
			failing: ["gateway-draining"],
			uptimeMs
		}, deps.getEventLoopHealth);
		if (deps.shouldSkipChannelReadiness?.()) return withEventLoopHealth({
			ready: true,
			failing: [],
			uptimeMs
		}, deps.getEventLoopHealth);
		if (cachedState && now - cachedAt < cacheTtlMs) return withEventLoopHealth({
			...cachedState,
			uptimeMs
		}, deps.getEventLoopHealth);
		const snapshot = channelManager.getRuntimeSnapshot();
		const autostartSuppressed = channelManager.getAutostartSuppression() !== null;
		const failing = [];
		const suppressed = [];
		for (const [channelId, accounts] of Object.entries(snapshot.channelAccounts)) {
			if (!accounts) continue;
			for (const accountSnapshot of Object.values(accounts)) {
				if (!accountSnapshot) continue;
				const health = evaluateChannelHealth(accountSnapshot, {
					now,
					staleEventThresholdMs: DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS,
					channelConnectGraceMs: DEFAULT_CHANNEL_CONNECT_GRACE_MS,
					channelId
				});
				if (!health.healthy && autostartSuppressed && health.reason === "not-running") {
					if (!suppressed.includes(channelId)) suppressed.push(channelId);
					continue;
				}
				if (!health.healthy && !shouldIgnoreReadinessFailure(accountSnapshot, health, autostartSuppressed)) {
					failing.push(channelId);
					break;
				}
			}
		}
		cachedAt = now;
		cachedState = {
			ready: failing.length === 0,
			failing,
			...suppressed.length > 0 ? { suppressed } : {}
		};
		return withEventLoopHealth({
			...cachedState,
			uptimeMs
		}, deps.getEventLoopHealth);
	};
}
function withEventLoopHealth(result, getEventLoopHealth) {
	const eventLoop = getEventLoopHealth?.();
	return eventLoop ? {
		...result,
		eventLoop
	} : result;
}
//#endregion
//#region src/gateway/server/tls.ts
/** Loads certificate/key material for the gateway listener from config. */
async function loadGatewayTlsRuntime(cfg, log) {
	return await loadGatewayTlsRuntime$1(cfg, log);
}
//#endregion
//#region src/gateway/startup-control-ui-origins.ts
/**
* Seeds runtime-only Control UI origins when a non-loopback gateway bind would
* otherwise reject the browser that just opened the local UI.
*/
async function maybeSeedControlUiAllowedOriginsAtStartup(params) {
	const seeded = ensureControlUiAllowedOriginsForNonLoopbackBind(params.config, {
		isContainerEnvironment,
		runtimeBind: params.runtimeBind,
		runtimePort: params.runtimePort
	});
	if (!seeded.seededOrigins || !seeded.bind) return {
		config: params.config,
		seededAllowedOrigins: false
	};
	params.log.info(buildSeededOriginsInfoLog(seeded.seededOrigins, seeded.bind));
	return {
		config: seeded.config,
		seededAllowedOrigins: true
	};
}
function buildSeededOriginsInfoLog(origins, bind) {
	return `gateway: seeded gateway.controlUi.allowedOrigins ${JSON.stringify(origins)} for bind=${bind} (required since v2026.2.26; see issue #29385). Applied for this runtime without writing config; add other origins to gateway.controlUi.allowedOrigins if needed.`;
}
//#endregion
//#region src/gateway/server.impl.ts
const loadGatewayModelCatalogModule = createLazyRuntimeModule(() => import("./server-model-catalog-DGP4yXL3.js"));
const loadWorkerEnvironmentStartupModule = createLazyRuntimeModule(() => import("./server-worker-environment-startup-DHwxNbpT.js"));
const loadWorkerPlacementStartupModule = createLazyRuntimeModule(() => import("./server-worker-placement-startup-onIp2Q3u.js"));
async function resetPreparedModelCatalogForTest() {
	const { resetPreparedModelCatalogForTest: resetPreparedModelCatalogForTestLocal } = await loadGatewayModelCatalogModule();
	await resetPreparedModelCatalogForTestLocal();
}
ensureOpenClawCliOnPath();
const MAX_MEDIA_TTL_HOURS = 168;
const POST_READY_MAINTENANCE_DELAY_MS = 250;
const RETAINED_PLUGIN_CLEANUP_DELAY_MS = 3e4;
function approvalRequestTargetsSession(request, sessionKeys, sessionId) {
	if (typeof request !== "object" || request === null) return false;
	const record = request;
	return typeof record.sessionId === "string" && record.sessionId === sessionId || typeof record.sessionKey === "string" && sessionKeys.has(record.sessionKey);
}
const loadGatewayStartupEarlyModule = createLazyRuntimeModule(() => import("./server-startup-early-DvOSWw3u.js"));
const loadGatewayStartupPostAttachModule = createLazyRuntimeModule(() => import("./server-startup-post-attach-CVcCzWaD.js"));
function listGatewayStartupChannelPlugins() {
	return listLoadedChannelPlugins();
}
function resolveMediaCleanupTtlMs(ttlHoursRaw) {
	const ttlMs = Math.min(Math.max(ttlHoursRaw, 1), MAX_MEDIA_TTL_HOURS) * 60 * 6e4;
	if (!Number.isFinite(ttlMs) || !Number.isSafeInteger(ttlMs)) throw new Error(`Invalid media.ttlHours: ${String(ttlHoursRaw)}`);
	return ttlMs;
}
const log = createSubsystemLogger("gateway");
const logDiscovery = log.child("discovery");
const logTailscale = log.child("tailscale");
const logChannels = log.child("channels");
const getChannelRuntime = createLazyRuntimeModule(() => import("./runtime-channel-C3_IQWAU.js").then(({ createRuntimeChannel }) => createRuntimeChannel()));
async function closeMcpLoopbackServerOnDemand() {
	const { closeMcpLoopbackServer } = await import("./mcp-http-DaaQ9QXp.js");
	await closeMcpLoopbackServer();
}
const loadGatewayCloseModule = createLazyRuntimeModule(() => import("./server-close.runtime.js"));
const loadGatewayModelCatalog = async (...args) => {
	return (await loadGatewayModelCatalogModule()).loadGatewayModelCatalog(...args);
};
const loadGatewayModelCatalogSnapshot = async (...args) => {
	return (await loadGatewayModelCatalogModule()).loadGatewayModelCatalogSnapshot(...args);
};
const loadGatewayPluginBootstrapModule = createLazyRuntimeModule(() => import("./server-plugin-bootstrap-CKmEeoWO.js"));
const logHealth = log.child("health");
const logCron = log.child("cron");
const logReload = log.child("reload");
const logHooks = log.child("hooks");
const logPlugins = log.child("plugins");
const logWsControl = log.child("ws");
const logSecrets = log.child("secrets");
const gatewayRuntime = runtimeForLogger(log);
function createGatewayStartupTrace() {
	const logEnabled = isTruthyEnvValue(process.env.OPENCLAW_GATEWAY_STARTUP_TRACE);
	let timelineConfig;
	let eventLoopDelay;
	const timelineOptions = () => ({
		...timelineConfig ? { config: timelineConfig } : {},
		env: process.env
	});
	const eventLoopTimelineEnabled = () => isDiagnosticsTimelineEnabled(timelineOptions()) && isTruthyEnvValue(process.env.OPENCLAW_DIAGNOSTICS_EVENT_LOOP);
	const ensureEventLoopDelay = () => {
		if (eventLoopDelay || !logEnabled && !eventLoopTimelineEnabled()) return;
		eventLoopDelay = monitorEventLoopDelay({ resolution: 10 });
		eventLoopDelay.enable();
	};
	ensureEventLoopDelay();
	const started = performance.now();
	let last = started;
	let spanSequence = 0;
	const formatMetric = (key, value) => `${key}=${typeof value === "number" ? value.toFixed(1) : value}`;
	const mapTimelineName = (name) => {
		switch (name) {
			case "config.snapshot": return "config.load";
			case "config.auth":
			case "config.final-snapshot":
			case "runtime.config": return "config.normalize";
			case "plugins.bootstrap": return "plugins.load";
			case "runtime.post-attach":
			case "ready": return "gateway.ready";
			default: return name;
		}
	};
	const takeEventLoopSample = () => {
		if (!eventLoopDelay) return;
		const sample = {
			p50Ms: eventLoopDelay.percentile(50) / 1e6,
			p95Ms: eventLoopDelay.percentile(95) / 1e6,
			p99Ms: eventLoopDelay.percentile(99) / 1e6,
			maxMs: eventLoopDelay.max / 1e6
		};
		eventLoopDelay.reset();
		return sample;
	};
	const emitEventLoopTimelineSample = (activeSpanName, sample) => {
		if (!eventLoopTimelineEnabled()) return;
		if (!sample) return;
		emitDiagnosticsTimelineEvent({
			type: "eventLoop.sample",
			name: "eventLoop",
			phase: "startup",
			activeSpanName: mapTimelineName(activeSpanName),
			attributes: activeSpanName === mapTimelineName(activeSpanName) ? void 0 : { traceName: activeSpanName },
			...sample
		}, timelineOptions());
	};
	const emit = (name, durationMs, totalMs, eventLoopSample, extras = []) => {
		const metrics = [["eventLoopMax", `${(eventLoopSample?.maxMs ?? 0).toFixed(1)}ms`], ...extras];
		recordGatewayRestartTraceSpan(`restart.ready.${name}`, durationMs, totalMs, metrics);
		if (logEnabled) log.info(`startup trace: ${name} ${durationMs.toFixed(1)}ms total=${totalMs.toFixed(1)}ms ${metrics.map(([key, value]) => formatMetric(key, value)).join(" ")}`);
	};
	return {
		setConfig(config) {
			timelineConfig = config;
			ensureEventLoopDelay();
		},
		mark(name) {
			const now = performance.now();
			const eventLoopSample = takeEventLoopSample();
			emit(name, now - last, now - started, eventLoopSample);
			emitDiagnosticsTimelineEvent({
				type: "mark",
				name: mapTimelineName(name),
				phase: "startup",
				durationMs: now - started,
				attributes: name === mapTimelineName(name) ? void 0 : { traceName: name }
			}, timelineOptions());
			emitEventLoopTimelineSample(name, eventLoopSample);
			last = now;
			if (name === "ready") eventLoopDelay?.disable();
		},
		detail(name, metrics) {
			const attributes = Object.fromEntries(metrics);
			recordGatewayRestartTraceDetail(`restart.ready.${name}`, metrics);
			if (logEnabled) log.info(`startup trace: ${name} ${metrics.map(([key, value]) => formatMetric(key, value)).join(" ")}`);
			emitDiagnosticsTimelineEvent({
				type: "mark",
				name: mapTimelineName(name),
				phase: "startup",
				attributes: {
					traceName: name,
					...attributes
				}
			}, timelineOptions());
		},
		async measure(name, run, options = {}) {
			const before = performance.now();
			const spanId = `gateway-startup-${++spanSequence}`;
			emitDiagnosticsTimelineEvent({
				type: "span.start",
				name: mapTimelineName(name),
				phase: "startup",
				spanId,
				attributes: name === mapTimelineName(name) ? void 0 : { traceName: name }
			}, timelineOptions());
			try {
				const result = await withDiagnosticPhase(mapTimelineName(name), run, { traceName: name });
				const now = performance.now();
				emitDiagnosticsTimelineEvent({
					type: "span.end",
					name: mapTimelineName(name),
					phase: "startup",
					spanId,
					durationMs: now - before,
					attributes: name === mapTimelineName(name) ? void 0 : { traceName: name }
				}, timelineOptions());
				return result;
			} catch (error) {
				const now = performance.now();
				emitDiagnosticsTimelineEvent({
					type: "span.error",
					name: mapTimelineName(name),
					phase: "startup",
					spanId,
					durationMs: now - before,
					attributes: name === mapTimelineName(name) ? void 0 : { traceName: name },
					errorName: error instanceof Error ? error.name : typeof error,
					...options.omitErrorMessage ? {} : { errorMessage: error instanceof Error ? error.message : String(error) }
				}, timelineOptions());
				throw error;
			} finally {
				const now = performance.now();
				const eventLoopSample = takeEventLoopSample();
				emit(name, now - before, now - started, eventLoopSample);
				emitEventLoopTimelineSample(name, eventLoopSample);
				last = now;
			}
		}
	};
}
function formatRuntimeGatewayAuthTokenWarning() {
	const base = "Gateway auth token was missing. Generated a runtime token for this startup without changing config; restart will generate a different token.";
	if (!isNixMode) return `${base} Persist one with \`openclaw config set gateway.auth.mode token\` and \`openclaw config set gateway.auth.token <token>\`.`;
	return [
		base,
		"In Nix mode, set gateway.auth.token in your Nix-managed OpenClaw config and rebuild.",
		"For the first-party Nix flow, see https://github.com/openclaw/nix-openclaw#quick-start and https://docs.openclaw.ai/install/nix."
	].join(" ");
}
async function stopTaskRegistryMaintenanceOnDemand() {
	const { stopTaskRegistryMaintenance } = await import("./task-registry.maintenance-B64Z33gN.js");
	stopTaskRegistryMaintenance();
}
function createGatewayAuthRateLimiters(rateLimitConfig) {
	return {
		rateLimiter: createAuthRateLimiter(rateLimitConfig ?? {}),
		browserRateLimiter: createAuthRateLimiter({
			...rateLimitConfig,
			exemptLoopback: false
		})
	};
}
async function startGatewayServer(port = 18789, opts = {}) {
	normalizeStateDirEnv(process.env);
	const [{ OPENCLAW_DATABASE_SCHEMA_DOCS_URL, OpenClawDatabaseSchemaPreflightError, preflightOpenClawDatabaseSchemas }, agentDatabase, stateDatabase] = await Promise.all([
		import("./openclaw-database-preflight-Cdc1P31_.js"),
		import("./openclaw-agent-db-Dz9knUky.js"),
		import("./openclaw-state-db-D_6Qq4ZX.js")
	]);
	const databaseSchemas = preflightOpenClawDatabaseSchemas({
		env: process.env,
		supportedVersions: {
			state: stateDatabase.OPENCLAW_STATE_SCHEMA_VERSION,
			agent: agentDatabase.OPENCLAW_AGENT_SCHEMA_VERSION
		}
	});
	if (databaseSchemas.incompatible.length > 0) {
		for (const database of databaseSchemas.incompatible) log.error("database schema preflight rejected newer schema", {
			kind: database.kind,
			path: database.path,
			...database.agentId ? { agentId: database.agentId } : {},
			foundVersion: database.foundVersion,
			supportedVersion: database.supportedVersion,
			writerAppVersion: database.writerAppVersion ?? "unknown",
			docsUrl: OPENCLAW_DATABASE_SCHEMA_DOCS_URL
		});
		throw new OpenClawDatabaseSchemaPreflightError(databaseSchemas.incompatible);
	}
	for (const database of databaseSchemas.indeterminate) log.warn("database schema preflight could not inspect database; continuing to real open", {
		kind: database.kind,
		path: database.path,
		reason: database.reason,
		docsUrl: OPENCLAW_DATABASE_SCHEMA_DOCS_URL
	});
	const { bootstrapGatewayNetworkRuntime } = await import("./server-network-runtime-DiImuw5G.js");
	bootstrapGatewayNetworkRuntime();
	const minimalTestGateway = isVitestRuntimeEnv() && process.env.OPENCLAW_TEST_MINIMAL_GATEWAY === "1";
	process.env.OPENCLAW_GATEWAY_PORT = String(port);
	logAcceptedEnvOption({
		key: "OPENCLAW_RAW_STREAM",
		description: "raw stream logging enabled"
	});
	logAcceptedEnvOption({
		key: "OPENCLAW_RAW_STREAM_PATH",
		description: "raw stream log path override"
	});
	if (!resumeGatewayRestartTraceFromEnv(process.env, [["source", "env"]])) {
		const restartHandoff = readGatewayRestartHandoffSync();
		resumeGatewayRestartTraceFromHandoff(restartHandoff?.restartTrace, [
			["source", restartHandoff?.source],
			["restartKind", restartHandoff?.restartKind],
			["supervisorMode", restartHandoff?.supervisorMode]
		]);
	}
	const startupTrace = createGatewayStartupTrace();
	const startupConfigModulePromise = import("./server-startup-config-Cc0lkn3O.js");
	const loadStartupPluginsModule = createLazyPromise(() => import("./server-startup-plugins-DUZKBmZA.js"), { cacheRejections: true });
	const { loadGatewayStartupConfigSnapshot } = await startupConfigModulePromise;
	const envBeforeStartupConfigLoad = { ...process.env };
	const startupConfigLoad = await startupTrace.measure("config.snapshot", () => loadGatewayStartupConfigSnapshot({
		minimalTestGateway,
		log,
		measure: (name, run) => startupTrace.measure(name, run),
		...opts.startupConfigSnapshotRead ? { initialSnapshotRead: opts.startupConfigSnapshotRead } : {}
	}));
	const configSnapshot = startupConfigLoad.snapshot;
	const startupAuthOverride = opts.auth ? structuredClone(opts.auth) : void 0;
	const startupTailscaleOverride = opts.tailscale ? structuredClone(opts.tailscale) : void 0;
	const controlUiSeed = minimalTestGateway ? {
		config: configSnapshot.config,
		seededAllowedOrigins: false
	} : await startupTrace.measure("control-ui.seed", () => maybeSeedControlUiAllowedOriginsAtStartup({
		config: configSnapshot.config,
		log,
		runtimeBind: opts.bind,
		runtimePort: port
	}));
	const startupConfigSnapshot = controlUiSeed.seededAllowedOrigins ? {
		...configSnapshot,
		runtimeConfig: controlUiSeed.config,
		config: controlUiSeed.config
	} : configSnapshot;
	const emitSecretsStateEvent = (code, message, cfg) => {
		enqueueSystemEvent(`[${code}] ${message}`, {
			sessionKey: resolveMainSessionKey(cfg),
			contextKey: code
		});
	};
	const { createRuntimeSecretsActivator } = await startupConfigModulePromise;
	const activateRuntimeSecrets = createRuntimeSecretsActivator({
		logSecrets,
		emitStateEvent: emitSecretsStateEvent,
		channelAutostartSuppression: opts.channelAutostartSuppression,
		...startupConfigLoad.pluginMetadataSnapshot ? { pluginMetadataSnapshot: startupConfigLoad.pluginMetadataSnapshot } : {}
	});
	let startupInternalWriteHash = null;
	let startupLastGoodSnapshot = configSnapshot;
	const startupActivationSourceConfig = configSnapshot.sourceConfig;
	const startupRuntimeConfig = captureConfigOverrideApplier()(startupConfigSnapshot.config);
	startupTrace.setConfig(startupRuntimeConfig);
	const { prepareGatewayStartupConfig } = await startupConfigModulePromise;
	const authBootstrap = await startupTrace.measure("config.auth", () => prepareGatewayStartupConfig({
		configSnapshot: startupConfigSnapshot,
		authOverride: startupAuthOverride,
		tailscaleOverride: startupTailscaleOverride,
		activateRuntimeSecrets,
		log,
		measure: (name, run, measureOptions) => startupTrace.measure(name, run, measureOptions)
	}), { omitErrorMessage: true });
	const cfgAtStart = authBootstrap.cfg;
	startupTrace.setConfig(cfgAtStart);
	if (authBootstrap.generatedToken) log.warn(formatRuntimeGatewayAuthTokenWarning());
	const trustedProxyDeviceAutoApprove = cfgAtStart.gateway?.auth?.trustedProxy?.deviceAutoApprove;
	if (cfgAtStart.gateway?.auth?.mode === "trusted-proxy" && trustedProxyDeviceAutoApprove?.enabled === true && trustedProxyDeviceAutoApprove.scopes?.some((scope) => scope.trim() === "operator.admin")) log.warn("SECURITY WARNING: gateway.auth.trustedProxy.deviceAutoApprove.scopes includes operator.admin; every proxy-authenticated user can auto-approve a new browser device with full admin, and requests without scopes receive full admin automatically. Remove operator.admin to require manual approval until per-identity roles are available.");
	const resolvedStartupAuthOverride = startupAuthOverride ? Object.fromEntries([
		"mode",
		"token",
		"password",
		"allowTailscale",
		"rateLimit",
		"trustedProxy"
	].flatMap((key) => {
		if (startupAuthOverride[key] === void 0) return [];
		if ((key === "token" || key === "password") && isSecretRef(startupAuthOverride[key])) return [];
		const resolvedValue = cfgAtStart.gateway?.auth?.[key];
		return resolvedValue === void 0 ? [] : [[key, structuredClone(resolvedValue)]];
	})) : void 0;
	const startupAuthSecretRefOverride = startupAuthOverride ? {
		...isSecretRef(startupAuthOverride.token) ? { token: structuredClone(startupAuthOverride.token) } : {},
		...isSecretRef(startupAuthOverride.password) ? { password: structuredClone(startupAuthOverride.password) } : {}
	} : void 0;
	const reloadAuthOverride = authBootstrap.generatedToken ? mergeGatewayAuthConfig(resolvedStartupAuthOverride, { token: authBootstrap.generatedToken }) : resolvedStartupAuthOverride;
	const diagnosticsEnabled = isDiagnosticsEnabled(cfgAtStart);
	setDiagnosticsEnabledForProcess(diagnosticsEnabled);
	if (diagnosticsEnabled) startDiagnosticHeartbeat(void 0, {
		getConfig: getRuntimeConfig,
		startupGraceMs: 6e4
	});
	setGatewaySigusr1RestartPolicy({ allowExternal: isRestartEnabled(cfgAtStart) });
	let getActiveTaskCount = () => 0;
	setPreRestartDeferralCheck(() => getTotalQueueSize() + getTotalPendingReplies() + getActiveEmbeddedRunCount() + getActiveCronJobCount() + getActiveBackgroundExecSessionCount() + getActiveGatewayRootWorkCount({ excludeCurrent: true }) + getActiveTaskCount());
	const seededControlUiAllowedOrigins = controlUiSeed.seededAllowedOrigins ? cfgAtStart.gateway?.controlUi?.allowedOrigins : void 0;
	const applyFixedGatewayOverlays = (config) => {
		let runtimeConfig = config;
		if (reloadAuthOverride || startupTailscaleOverride) runtimeConfig = {
			...runtimeConfig,
			gateway: {
				...runtimeConfig.gateway,
				...reloadAuthOverride ? { auth: mergeGatewayAuthConfig(runtimeConfig.gateway?.auth, reloadAuthOverride) } : {},
				...startupTailscaleOverride ? { tailscale: mergeGatewayTailscaleConfig(runtimeConfig.gateway?.tailscale, startupTailscaleOverride) } : {}
			}
		};
		if (seededControlUiAllowedOrigins && runtimeConfig.gateway?.controlUi?.allowedOrigins === void 0) runtimeConfig = {
			...runtimeConfig,
			gateway: {
				...runtimeConfig.gateway,
				controlUi: {
					...runtimeConfig.gateway?.controlUi,
					allowedOrigins: seededControlUiAllowedOrigins
				}
			}
		};
		return runtimeConfig;
	};
	const applyReloadableGatewayAuthRefs = (config) => {
		if (!startupAuthSecretRefOverride?.token && !startupAuthSecretRefOverride?.password) return config;
		return {
			...config,
			gateway: {
				...config.gateway,
				auth: mergeGatewayAuthConfig(config.gateway?.auth, startupAuthSecretRefOverride)
			}
		};
	};
	const prepareReloadCandidate = (params) => {
		const previousSourceConfig = params.previousSourceConfig ?? getRuntimeConfigSourceSnapshot() ?? startupLastGoodSnapshot.sourceConfig;
		assertGatewayConfigEnvSelectionUnchanged(previousSourceConfig, params.sourceConfig);
		const runtimeEnv = prepareConfigRuntimeEnv({
			previousConfig: previousSourceConfig,
			nextConfig: params.sourceConfig
		});
		const metadata = startupConfigLoad.pluginMetadataSnapshot;
		const pluginCandidate = minimalTestGateway ? {
			runtimeConfig: params.runtimeConfig,
			compareConfig: params.sourceConfig
		} : resolveGatewayReloadPluginActivationCandidate({
			...params,
			env: runtimeEnv.env,
			...metadata?.manifestRegistry ? { manifestRegistry: metadata.manifestRegistry } : {},
			discovery: metadata?.discovery
		});
		const applyCandidateOverrides = captureConfigOverrideApplier();
		const reapplyCompareOverlays = (config) => applyCandidateOverrides(mergeActivationSectionsIntoRuntimeConfig({
			runtimeConfig: config,
			activationConfig: pluginCandidate.compareConfig
		}));
		const reapplyRuntimeOverlays = (config) => applyFixedGatewayOverlays(applyReloadableGatewayAuthRefs(reapplyCompareOverlays(config)));
		return {
			runtimeConfig: reapplyRuntimeOverlays(params.runtimeConfig),
			compareConfig: reapplyCompareOverlays(params.sourceConfig),
			runtimeEnv,
			reapplyRuntimeOverlays,
			reapplyCompareOverlays
		};
	};
	if (startupConfigLoad.wroteConfig || authBootstrap.persistedGeneratedToken) {
		const startupSnapshot = await startupTrace.measure("config.final-snapshot", () => readConfigFileSnapshot());
		startupInternalWriteHash = startupSnapshot.hash ?? null;
		startupLastGoodSnapshot = startupSnapshot;
	}
	setAppliedRuntimeConfigSnapshot(cfgAtStart, startupLastGoodSnapshot.sourceConfig);
	initializePublishedConfigRuntimeEnv(startupLastGoodSnapshot.sourceConfig, {
		ownedEnv: collectConfigRuntimeEnvOwnership(startupLastGoodSnapshot.sourceConfig, envBeforeStartupConfigLoad, process.env),
		preserveExistingOwnership: true
	});
	const workerEnvironmentStartup = minimalTestGateway ? void 0 : await startupTrace.measure("worker-environments.store-import", async () => {
		return await (await loadWorkerEnvironmentStartupModule()).loadGatewayWorkerEnvironmentStartupState();
	});
	const { prepareGatewayPluginBootstrap } = await loadStartupPluginsModule();
	const pluginBootstrap = await startupTrace.measure("plugins.bootstrap", () => prepareGatewayPluginBootstrap({
		cfgAtStart,
		activationSourceConfig: startupActivationSourceConfig,
		startupRuntimeConfig,
		pluginMetadataSnapshot: startupConfigLoad.pluginMetadataSnapshot,
		workerProviderIds: workerEnvironmentStartup?.durableProviderIds ?? [],
		minimalTestGateway,
		log,
		loadRuntimePlugins: false,
		loadSetupRuntimePlugins: true
	}));
	const { gatewayPluginConfigAtStart, defaultWorkspaceDir, deferredConfiguredChannelPluginIds, startupPluginIds, pluginLookUpTable, baseMethods, runtimePluginsLoaded } = pluginBootstrap;
	const coreGatewayMethodNames = listCoreGatewayMethodNames();
	setCurrentPluginMetadataSnapshot(pluginLookUpTable, {
		config: startupActivationSourceConfig,
		compatibleConfigs: [
			startupRuntimeConfig,
			cfgAtStart,
			gatewayPluginConfigAtStart
		],
		env: process.env,
		workspaceDir: defaultWorkspaceDir
	});
	if (pluginLookUpTable) {
		const metrics = pluginLookUpTable.metrics;
		startupTrace.detail("plugins.lookup-table", [
			["registrySnapshotMs", metrics.registrySnapshotMs],
			["manifestRegistryMs", metrics.manifestRegistryMs],
			["startupPlanMs", metrics.startupPlanMs],
			["ownerMapsMs", metrics.ownerMapsMs],
			["totalMs", metrics.totalMs],
			["indexPlugins", String(metrics.indexPluginCount)],
			["indexPluginCount", metrics.indexPluginCount],
			["manifestPlugins", String(metrics.manifestPluginCount)],
			["manifestPluginCount", metrics.manifestPluginCount],
			["startupPlugins", String(metrics.startupPluginCount)],
			["startupPluginCount", metrics.startupPluginCount],
			["deferredChannelPlugins", String(metrics.deferredChannelPluginCount)],
			["deferredChannelPluginCount", metrics.deferredChannelPluginCount]
		]);
	}
	let { pluginRegistry, baseGatewayMethods } = pluginBootstrap;
	const hasConfiguredWorkerProfiles = Object.keys(gatewayPluginConfigAtStart.cloudWorkers?.profiles ?? {}).length > 0;
	const shouldStartWorkerEnvironmentService = hasConfiguredWorkerProfiles || Boolean(workerEnvironmentStartup?.records.length) || Boolean(workerEnvironmentStartup?.hasNonlocalPlacementRecords);
	let resolveWorkerGatewayEndpoint = () => void 0;
	const { workerEnvironmentService, workerLiveEvents } = workerEnvironmentStartup && shouldStartWorkerEnvironmentService ? await startupTrace.measure("worker-environments.runtime-imports", async () => {
		return await (await loadWorkerEnvironmentStartupModule()).createGatewayWorkerEnvironmentRuntime({
			getPluginRegistry: () => pluginRegistry,
			resolveWorkerGateway: () => resolveWorkerGatewayEndpoint(),
			startup: workerEnvironmentStartup,
			log
		});
	}) : {};
	let revokeWorkerDispatchSessionAuthority = (_params) => {
		throw new Error("Worker dispatch authority revocation is not ready");
	};
	const workerPlacementRuntime = workerEnvironmentService && workerEnvironmentStartup ? await startupTrace.measure("worker-environments.placement-runtime", async () => {
		return (await loadWorkerPlacementStartupModule()).createGatewayWorkerPlacementRuntime({
			placements: workerEnvironmentStartup.placementStore,
			environments: workerEnvironmentService,
			admitNewPlacements: hasConfiguredWorkerProfiles,
			revokeSessionAuthority: (request) => revokeWorkerDispatchSessionAuthority(request),
			warn: (message) => log.warn(message)
		});
	}) : void 0;
	const workerPlacementControlAvailable = workerPlacementRuntime?.dispatchService;
	const workerPlacementDispatchAvailable = hasConfiguredWorkerProfiles ? workerPlacementControlAvailable : void 0;
	const channelLogs = Object.fromEntries(listGatewayStartupChannelPlugins().map((plugin) => [plugin.id, logChannels.child(plugin.id)]));
	const channelRuntimeEnvs = Object.fromEntries(Object.entries(channelLogs).map(([id, logger]) => [id, runtimeForLogger(logger)]));
	const listStartupChannelGatewayMethods = () => {
		const methods = [];
		for (const plugin of listGatewayStartupChannelPlugins()) {
			methods.push(...plugin.gatewayMethods ?? []);
			for (const descriptor of plugin.gatewayMethodDescriptors ?? []) methods.push(descriptor.name);
		}
		return methods;
	};
	const listActiveGatewayMethods = (nextBaseGatewayMethods) => uniqueStrings([...nextBaseGatewayMethods, ...listStartupChannelGatewayMethods()]).filter((method) => (workerPlacementDispatchAvailable || method !== "sessions.dispatch") && (workerPlacementControlAvailable || method !== "sessions.reclaim"));
	const runtimeConfig = await startupTrace.measure("runtime.config", async () => {
		const { resolveGatewayRuntimeConfig } = await import("./server-runtime-config-Dac03D_z.js");
		return resolveGatewayRuntimeConfig({
			cfg: cfgAtStart,
			port,
			bind: opts.bind,
			host: opts.host,
			controlUiEnabled: opts.controlUiEnabled,
			openAiChatCompletionsEnabled: opts.openAiChatCompletionsEnabled,
			openResponsesEnabled: opts.openResponsesEnabled,
			auth: resolvedStartupAuthOverride,
			tailscale: startupTailscaleOverride
		});
	});
	const { bindHost, controlUiEnabled, openAiChatCompletionsEnabled, openAiChatCompletionsConfig, openResponsesEnabled, openResponsesConfig, strictTransportSecurityHeader, controlUiBasePath, controlUiRoot: controlUiRootOverride, resolvedAuth, tailscaleConfig, tailscaleMode } = runtimeConfig;
	const getResolvedAuth = () => resolveGatewayAuth({
		authConfig: getActiveSecretsRuntimeConfigSnapshot()?.config.gateway?.auth ?? getRuntimeConfig().gateway?.auth,
		authOverride: resolvedStartupAuthOverride,
		env: process.env,
		tailscaleMode
	});
	const resolveSharedGatewaySessionGenerationForConfig = (config) => resolveSharedGatewaySessionGeneration(resolveGatewayAuth({
		authConfig: config.gateway?.auth,
		authOverride: resolvedStartupAuthOverride,
		env: process.env,
		tailscaleMode
	}), config.gateway?.trustedProxies);
	const resolveCurrentSharedGatewaySessionGeneration = () => resolveSharedGatewaySessionGeneration(getResolvedAuth(), getRuntimeConfig().gateway?.trustedProxies);
	const resolveSharedGatewaySessionGenerationForRuntimeSnapshot = () => resolveSharedGatewaySessionGeneration(resolveGatewayAuth({
		authConfig: getRuntimeConfig().gateway?.auth,
		authOverride: resolvedStartupAuthOverride,
		env: process.env,
		tailscaleMode
	}), getRuntimeConfig().gateway?.trustedProxies);
	const sharedGatewaySessionGenerationState = {
		current: resolveCurrentSharedGatewaySessionGeneration(),
		required: null
	};
	const preauthHandshakeTimeoutMs = void 0;
	const initialHooksConfig = runtimeConfig.hooksConfig;
	const initialHookClientIpConfig = resolveHookClientIpConfig(cfgAtStart);
	const rateLimitConfig = cfgAtStart.gateway?.auth?.rateLimit;
	const { rateLimiter: authRateLimiter, browserRateLimiter: browserAuthRateLimiter } = createGatewayAuthRateLimiters(rateLimitConfig);
	const nodeReapprovalCoordinator = createNodeReapprovalCoordinator(rateLimitConfig);
	const controlUiRootState = await startupTrace.measure("control-ui.root", () => resolveGatewayControlUiRootState({
		controlUiRootOverride,
		controlUiEnabled,
		gatewayRuntime,
		log
	}));
	const { createTerminalLaunchPolicy } = await import("./launch-CUteJUki.js");
	const terminalLaunchPolicy = createTerminalLaunchPolicy(cfgAtStart);
	const { runDefaultChannelSetupWizard, runDefaultSetupWizard } = await import("./wizard-DeZpNZsl.js");
	const wizardRunner = opts.wizardRunner ?? runDefaultSetupWizard;
	const channelWizardRunner = opts.channelWizardRunner ?? runDefaultChannelSetupWizard;
	const { wizardSessions, findRunningWizard, purgeWizardSession } = createWizardSessionTracker();
	const systemAgentSessions = /* @__PURE__ */ new Map();
	const deps = createDefaultDeps();
	let runtimeState = null;
	let gatewayCronStartHandled = false;
	const gatewayTls = await startupTrace.measure("tls.runtime", () => loadGatewayTlsRuntime(cfgAtStart.gateway?.tls, log.child("tls")));
	if (cfgAtStart.gateway?.tls?.enabled && !gatewayTls.enabled) throw new Error(gatewayTls.error ?? "gateway tls: failed to enable");
	const serverStartedAt = Date.now();
	const readinessEventLoopHealth = createGatewayEventLoopHealthMonitor();
	let startupSidecarsReady = minimalTestGateway;
	let startupPendingReason = "startup-sidecars";
	let releaseStartupAccountStarts = () => {};
	const startupAccountStartsReady = new Promise((resolve) => {
		releaseStartupAccountStarts = resolve;
	});
	let gatewayInstanceRuntime;
	let gatewayInstanceDispatchReady = false;
	const { createChannelManager } = await import("./server-channels-2D1lp0Xv.js");
	const channelManager = createChannelManager({
		getRuntimeConfig: () => {
			return resolveGatewayPluginConfig({ config: getRuntimeConfig() });
		},
		channelLogs,
		channelRuntimeEnvs,
		resolveChannelRuntime: getChannelRuntime,
		getPluginHttpRouteRegistry: () => pluginRegistry,
		startupTrace,
		deferStartupAccountStartsUntil: startupAccountStartsReady,
		getNativeApprovalRuntime: () => gatewayInstanceRuntime?.nativeApprovals
	});
	channelManager.setAutostartSuppression(opts.channelAutostartSuppression ?? null);
	const sidecarStartup = opts.sidecarStartup ?? "start";
	const isGatewayStartupPending = () => !startupSidecarsReady && sidecarStartup === "start";
	const getReadiness = createReadinessChecker({
		channelManager,
		startedAt: serverStartedAt,
		getStartupPending: isGatewayStartupPending,
		getStartupPendingReason: () => startupPendingReason,
		getGatewayDraining: isGatewayDraining,
		getEventLoopHealth: readinessEventLoopHealth.snapshot,
		shouldSkipChannelReadiness: () => isTruthyEnvValue(process.env.OPENCLAW_SKIP_CHANNELS) || isTruthyEnvValue(process.env.OPENCLAW_SKIP_PROVIDERS)
	});
	log.info("starting HTTP server...");
	let currentPluginRegistryGatewayContext;
	const watchNodeRequestHandler = {};
	const { releasePluginRouteRegistry, httpServer, httpServers, httpBindHosts, startListening, wss, preauthConnectionBudget, clients, broadcast, broadcastToConnIds, broadcastPluginEvent, getBufferedAmount, agentRunSeq, dedupe, chatRunState, chatRunBuffers, chatDeltaSentAt, chatDeltaLastBroadcastLen, addChatRun, removeChatRun, chatAbortControllers, chatQueuedTurns, toolEventRecipients, sessionEventSubscribers, sessionMessageSubscribers, getWorkerIngressEndpoint, getMcpAppSandboxPort, ensureSandboxHostPort } = await startupTrace.measure("runtime.state", () => createGatewayRuntimeState({
		cfg: cfgAtStart,
		getRuntimeConfig,
		bindHost,
		port,
		controlUiEnabled,
		controlUiBasePath,
		controlUiRoot: controlUiRootState,
		openAiChatCompletionsEnabled,
		openAiChatCompletionsConfig,
		openResponsesEnabled,
		openResponsesConfig,
		strictTransportSecurityHeader,
		resolvedAuth,
		rateLimiter: authRateLimiter,
		isTerminalEnabled: terminalLaunchPolicy.isEnabled,
		gatewayTls,
		getResolvedAuth,
		hooksConfig: () => runtimeState?.hooksConfig ?? initialHooksConfig,
		getHookClientIpConfig: () => runtimeState?.hookClientIpConfig ?? initialHookClientIpConfig,
		pluginRegistry,
		getPluginRouteRegistry: () => pluginRegistry,
		getGatewayRequestContext: () => currentPluginRegistryGatewayContext,
		pinChannelRegistry: !minimalTestGateway,
		deps,
		log,
		logHooks,
		logPlugins,
		getReadiness,
		handleWatchNodeRequest: async (req, res) => await watchNodeRequestHandler.current?.(req, res) ?? false,
		workerIngressEnabled: Boolean(workerEnvironmentService)
	}));
	resolveWorkerGatewayEndpoint = getWorkerIngressEndpoint;
	const presenceWatchedSessions = (connId) => {
		return [...sessionMessageSubscribers.getForConnection(connId)].slice(-32).toSorted();
	};
	const updateWatchedSessionsPresence = (connId, previous) => {
		const watchedSessions = presenceWatchedSessions(connId);
		if (watchedSessions.length === previous.length && watchedSessions.every((key, index) => key === previous[index])) return;
		const client = [...clients].find((candidate) => candidate.connId === connId);
		if (!client?.presenceKey) return;
		upsertPresence(client.presenceKey, { watchedSessions: watchedSessions.length > 0 ? watchedSessions : void 0 });
		broadcastPresenceSnapshot({
			broadcast,
			incrementPresenceVersion,
			getHealthVersion
		});
	};
	const subscribeSessionMessageEvents = (connId, sessionKey, options) => {
		const previous = presenceWatchedSessions(connId);
		const rollback = sessionMessageSubscribers.subscribe(connId, sessionKey, options);
		updateWatchedSessionsPresence(connId, previous);
		if (!rollback) return;
		const rollbackPresence = (() => {
			const rollbackPrevious = presenceWatchedSessions(connId);
			rollback();
			updateWatchedSessionsPresence(connId, rollbackPrevious);
		});
		rollbackPresence.commit = () => rollback.commit();
		return rollbackPresence;
	};
	const unsubscribeSessionMessageEvents = (connId, sessionKey) => {
		const previous = presenceWatchedSessions(connId);
		sessionMessageSubscribers.unsubscribe(connId, sessionKey);
		updateWatchedSessionsPresence(connId, previous);
	};
	const restartRecoveryCandidates = /* @__PURE__ */ new Map();
	const { createGatewayNodeSessionRuntime } = await import("./server-node-session-runtime-DAHQo0Vm.js");
	const { nodeRegistry, nodePresenceTimers, nodeSendToSession, nodeSendToAllSubscribed, nodeSubscribe, nodeUnsubscribe, nodeUnsubscribeAll, broadcastVoiceWakeChanged, hasTalkNodeConnected } = createGatewayNodeSessionRuntime({
		broadcast,
		sessionEventSubscribers,
		sessionMessageSubscribers,
		listRegisteredNodePluginToolCommands: () => pluginRegistry.nodeHostCommands,
		nodePluginToolsEnabled: cfgAtStart.gateway?.nodes?.pluginTools?.enabled !== false,
		nodeSkillsEnabled: cfgAtStart.gateway?.nodes?.skills?.enabled !== false
	});
	const { createWatchNodeHttpRuntime } = await import("./watch-node-http-byY9wi68.js");
	const watchNodeHttpRuntime = createWatchNodeHttpRuntime({
		nodeRegistry,
		getConfig: getRuntimeConfig,
		broadcast,
		rateLimiter: authRateLimiter,
		nodeReapprovalCoordinator,
		onNodeConnected: (session) => {
			upsertPresence(session.nodeId, {
				host: session.displayName ?? session.clientId ?? session.nodeId,
				ip: session.remoteIp,
				version: session.version,
				platform: session.platform,
				deviceFamily: session.deviceFamily,
				modelIdentifier: session.modelIdentifier,
				mode: session.clientMode,
				deviceId: session.nodeId,
				roles: ["node"],
				scopes: [],
				instanceId: session.nodeId,
				reason: "connect"
			});
			incrementPresenceVersion();
			recordRemoteNodeInfo({
				nodeId: session.nodeId,
				connId: session.connId,
				displayName: session.displayName,
				platform: session.platform,
				deviceFamily: session.deviceFamily,
				commands: session.commands,
				remoteIp: session.remoteIp
			});
		},
		onNodeDisconnected: (nodeId) => {
			upsertPresence(nodeId, { reason: "disconnect" });
			broadcastPresenceSnapshot({
				broadcast,
				incrementPresenceVersion,
				getHealthVersion
			});
			removeRemoteNodeInfo(nodeId);
			nodeUnsubscribeAll(nodeId);
			clearNodeWakeState(nodeId);
		},
		onError: (message, error) => log.warn(`${message}: ${String(error)}`)
	});
	watchNodeRequestHandler.current = watchNodeHttpRuntime.handleRequest;
	const { TerminalSessionManager, DEFAULT_TERMINAL_DETACH_SECONDS } = await import("./session-manager-2WSZ6UYo.js");
	const { createTerminalSessionTransport } = await import("./gateway-transport-CCDhR7aF.js");
	const terminalSessions = new TerminalSessionManager({
		...createTerminalSessionTransport(broadcastToConnIds, getBufferedAmount),
		detachGraceMs: (cfgAtStart.gateway?.terminal?.detachedSessionTimeoutSeconds ?? DEFAULT_TERMINAL_DETACH_SECONDS) * 1e3
	});
	applyGatewayLaneConcurrency(resolveGatewayLaneConcurrency(cfgAtStart), { gatewayStart: true });
	runtimeState = createGatewayServerLiveState({
		hooksConfig: initialHooksConfig,
		hookClientIpConfig: initialHookClientIpConfig,
		cronState: createLazyGatewayCronState({
			cfg: cfgAtStart,
			deps,
			broadcast
		}),
		gatewayMethods: listActiveGatewayMethods(baseGatewayMethods)
	});
	deps.cron = runtimeState.cronState.cron;
	const pluginHostServices = { get cron() {
		return runtimeState.cronState.cron;
	} };
	let closePreludeStarted = false;
	const cronReconciliation = createGatewayCronReconciliation({
		port,
		workspaceDir: defaultWorkspaceDir,
		isClosing: () => closePreludeStarted,
		runHook: async (event, ctx) => {
			try {
				const hookRunner = (await import("./plugins/hook-runner-global.js")).getGlobalHookRunner();
				if (hookRunner?.hasHooks("cron_reconciled")) await hookRunner.runCronReconciled(event, ctx);
			} catch (err) {
				logCron.error(`cron_reconciled hook failed: ${String(err)}`);
			}
		}
	});
	let postReadyMaintenanceTimer = null;
	let retainedPluginCleanupHandle = null;
	const clearPostReadyMaintenanceTimer = () => {
		if (!postReadyMaintenanceTimer) return;
		clearTimeout(postReadyMaintenanceTimer);
		postReadyMaintenanceTimer = null;
	};
	const markClosePreludeStarted = () => {
		closePreludeStarted = true;
		gatewayInstanceDispatchReady = false;
		gatewayInstanceRuntime?.close();
		cronReconciliation.invalidate();
		clearPostReadyMaintenanceTimer();
		retainedPluginCleanupHandle?.stop();
		retainedPluginCleanupHandle = null;
	};
	let configReloaderStopPromise = null;
	const stopConfigReloaderForClose = () => {
		configReloaderStopPromise ??= runtimeState.configReloader.stop();
		return configReloaderStopPromise;
	};
	const beginClosePrelude = async () => {
		clearSessionSuspensionTimers();
		markClosePreludeStarted();
		await stopConfigReloaderForClose().catch(() => {});
	};
	const runClosePrelude = async () => {
		await beginClosePrelude();
		disposeNodeConnectionNotifications(nodeRegistry);
		watchNodeHttpRuntime.close();
		clearPluginMetadataLifecycleCaches();
		const { runGatewayClosePrelude } = await loadGatewayCloseModule();
		await runGatewayClosePrelude({
			...diagnosticsEnabled ? { stopDiagnostics: stopDiagnosticHeartbeat } : {},
			clearSkillsRefreshTimer: () => {
				if (!runtimeState?.skillsRefreshTimer) return;
				clearTimeout(runtimeState.skillsRefreshTimer);
				runtimeState.skillsRefreshTimer = null;
			},
			skillsChangeUnsub: runtimeState.skillsChangeUnsub,
			disposeAuthRateLimiter: () => {
				authRateLimiter.dispose();
				nodeReapprovalCoordinator.dispose();
			},
			disposeBrowserAuthRateLimiter: () => browserAuthRateLimiter.dispose(),
			stopModelPricingRefresh: runtimeState.stopModelPricingRefresh,
			stopChannelHealthMonitor: async () => {
				const monitor = runtimeState?.channelHealthMonitor;
				monitor?.shutdown();
				await monitor?.waitForIdle();
			},
			stopReadinessEventLoopHealth: readinessEventLoopHealth.stop,
			clearSecretsRuntimeSnapshot,
			closeMcpServer: closeMcpLoopbackServerOnDemand
		});
	};
	const { getRuntimeSnapshot, startChannels, startChannel, stopChannel, markChannelLoggedOut } = channelManager;
	const refreshGatewayHealthSnapshotWithRuntime = (optsResult) => refreshGatewayHealthSnapshot({
		...optsResult,
		getRuntimeSnapshot,
		getEventLoopHealth: readinessEventLoopHealth.snapshot,
		getConfigReloaderHotReloadStatus: () => runtimeState?.configReloader.hotReloadStatus?.()
	});
	const stopRegisteredPostReadySidecars = async () => {
		const postReadySidecars = runtimeState.postReadySidecars;
		runtimeState.postReadySidecars = [];
		for (const postReadySidecar of postReadySidecars) await postReadySidecar.stop();
	};
	const stopRegisteredGatewayLifetimeSidecars = async () => {
		const gatewayLifetimeSidecars = runtimeState.gatewayLifetimeSidecars;
		runtimeState.gatewayLifetimeSidecars = [];
		for (const gatewayLifetimeSidecar of gatewayLifetimeSidecars) await gatewayLifetimeSidecar.stop();
	};
	const createCloseHandler = () => async (optsValue) => {
		const channelIds = listLoadedChannelPlugins().map((plugin) => plugin.id);
		const { createGatewayCloseHandler, drainActiveSessionsForShutdown } = await loadGatewayCloseModule();
		await createGatewayCloseHandler({
			bonjourStop: runtimeState.bonjourStop,
			tailscaleCleanup: runtimeState.tailscaleCleanup,
			releasePluginRouteRegistry,
			channelIds,
			stopChannel,
			pluginServices: runtimeState.pluginServices,
			postReadySidecars: runtimeState.postReadySidecars,
			cron: runtimeState.cronState.cron,
			heartbeatRunner: runtimeState.heartbeatRunner,
			updateCheckStop: runtimeState.stopGatewayUpdateCheck,
			stopTaskRegistryMaintenance: stopTaskRegistryMaintenanceOnDemand,
			nodePresenceTimers,
			broadcast,
			tickInterval: runtimeState.tickInterval,
			healthInterval: runtimeState.healthInterval,
			dedupeCleanup: runtimeState.dedupeCleanup,
			mediaCleanup: runtimeState.mediaCleanup,
			worktreeCleanup: runtimeState.worktreeCleanup,
			skillCuratorCleanup: runtimeState.skillCuratorCleanup,
			agentUnsub: runtimeState.agentUnsub,
			heartbeatUnsub: runtimeState.heartbeatUnsub,
			transcriptUnsub: runtimeState.transcriptUnsub,
			lifecycleUnsub: runtimeState.lifecycleUnsub,
			taskUnsub: runtimeState.taskUnsub,
			chatRunState,
			chatAbortControllers,
			chatQueuedTurns,
			restartRecoveryCandidates,
			removeChatRun,
			agentRunSeq,
			nodeSendToSession,
			resolveActiveSessionIdForKey: resolveActiveEmbeddedRunSessionId,
			markMainSessionsAbortedForRestart: async ({ sessionKeys, sessionIds, activeRuns, reason, isActiveRun }) => {
				if (sessionKeys.size === 0 && sessionIds.size === 0) return;
				const { markRestartAbortedMainSessions } = await import("./main-session-restart-recovery-DCHdN5ny.js");
				await markRestartAbortedMainSessions({
					cfg: getRuntimeConfig(),
					sessionKeys,
					sessionIds,
					activeRuns,
					isActiveRun,
					reason
				});
			},
			getPendingReplyCount: getTotalPendingReplies,
			clients,
			configReloader: { stop: stopConfigReloaderForClose },
			wss,
			httpServer,
			httpServers,
			drainActiveSessionsForShutdown
		})(optsValue);
	};
	let clearFallbackGatewayContextForServer = () => {};
	const closeOnStartupFailure = async () => {
		try {
			await beginClosePrelude();
			await stopRegisteredGatewayLifetimeSidecars();
			await stopRegisteredPostReadySidecars();
			await runClosePrelude();
			await createCloseHandler()({ reason: "gateway startup failed" });
		} finally {
			clearFallbackGatewayContextForServer();
		}
	};
	const broadcastVoiceWakeRoutingChanged = (config) => {
		broadcast("voicewake.routing.changed", { config }, { dropIfSlow: true });
	};
	try {
		const earlyRuntime = await startupTrace.measure("runtime.early", () => loadGatewayStartupEarlyModule().then(({ startGatewayEarlyRuntime }) => startGatewayEarlyRuntime({
			minimalTestGateway,
			cfgAtStart,
			port,
			gatewayTls,
			gatewayDirectReachable: !isLoopbackHost(bindHost),
			tailscaleMode,
			log,
			logDiscovery,
			nodeRegistry,
			pluginRegistry,
			broadcast,
			nodeSendToAllSubscribed,
			getPresenceVersion,
			getHealthVersion,
			refreshGatewayHealthSnapshot: refreshGatewayHealthSnapshotWithRuntime,
			logHealth,
			dedupe,
			chatAbortControllers,
			chatQueuedTurns,
			restartRecoveryCandidates,
			chatRunState,
			chatRunBuffers,
			chatDeltaSentAt,
			chatDeltaLastBroadcastLen,
			removeChatRun,
			agentRunSeq,
			nodeSendToSession,
			...typeof cfgAtStart.media?.ttlHours === "number" ? { mediaCleanupTtlMs: resolveMediaCleanupTtlMs(cfgAtStart.media.ttlHours) } : {},
			skillsRefreshDelayMs: runtimeState.skillsRefreshDelayMs,
			getSkillsRefreshTimer: () => runtimeState.skillsRefreshTimer,
			setSkillsRefreshTimer: (timer) => {
				runtimeState.skillsRefreshTimer = timer;
			},
			getRuntimeConfig,
			startupTrace
		})));
		runtimeState.bonjourStop = earlyRuntime.bonjourStop;
		getActiveTaskCount = earlyRuntime.getActiveTaskCount;
		runtimeState.skillsChangeUnsub = earlyRuntime.skillsChangeUnsub;
		const [{ startGatewayEventSubscriptions }, { startGatewayRuntimeServices }] = await startupTrace.measure("runtime.post-early-imports", () => Promise.all([import("./server-runtime-subscriptions-DPeKF2Bo.js"), import("./server-runtime-startup-services-DMlWB-Aw.js")]));
		const runtimeSubscriptions = await startupTrace.measure("runtime.subscriptions", () => startGatewayEventSubscriptions({
			log,
			broadcast,
			broadcastToConnIds,
			nodeSendToSession,
			agentRunSeq,
			chatRunState,
			toolEventRecipients,
			sessionEventSubscribers,
			sessionMessageSubscribers,
			chatAbortControllers,
			restartRecoveryCandidates
		}));
		Object.assign(runtimeState, runtimeSubscriptions);
		const runtimeServices = await startupTrace.measure("runtime.services", () => startGatewayRuntimeServices({
			minimalTestGateway,
			cfgAtStart,
			channelManager,
			log
		}));
		Object.assign(runtimeState, runtimeServices);
		const { createOperatorApprovalSessionEventRuntime } = await import("./operator-approval-session-events-G4mSTyZL.js");
		const approvalManagersForReplay = /* @__PURE__ */ new Map();
		const approvalSessionEvents = createOperatorApprovalSessionEventRuntime({
			clients,
			sessionMessageSubscribers,
			broadcastToConnIds,
			controlUiBasePath,
			reconcileTerminal: (record) => {
				return approvalManagersForReplay.get(record.kind)?.reconcileDurableTerminal(record) ?? false;
			}
		});
		const { execApprovalManager, cancelRunBoundApprovals, forwardPluginApprovalRequest, pluginApprovalIosPushDelivery, pluginApprovalManager, systemAgentApprovalManager, extraHandlers, coreGatewayHandlers } = await startupTrace.measure("gateway.handlers", async () => {
			const [{ createGatewayAuxHandlers }, { coreGatewayHandlers: coreGatewayHandlersLocal }] = await Promise.all([import("./server-aux-handlers-BB3iEllk.js"), import("./server-methods-BErTop9A.js")]);
			return {
				...createGatewayAuxHandlers({
					log,
					activateRuntimeSecrets,
					sharedGatewaySessionGenerationState,
					resolveSharedGatewaySessionGenerationForConfig,
					clients,
					startChannel,
					stopChannel,
					getChannelAutostartSuppression: channelManager.getAutostartSuppression,
					logChannels,
					onApprovalLifecycle: approvalSessionEvents.publish
				}),
				coreGatewayHandlers: coreGatewayHandlersLocal
			};
		});
		approvalManagersForReplay.set("exec", execApprovalManager);
		approvalManagersForReplay.set("plugin", pluginApprovalManager);
		approvalManagersForReplay.set("system-agent", systemAgentApprovalManager);
		revokeWorkerDispatchSessionAuthority = ({ sessionId, sessionKeys }) => {
			const keys = new Set(sessionKeys);
			for (const sessionKey of keys) revokeAttachGrantsForSession(sessionKey);
			for (const record of execApprovalManager.listPendingRecords()) if (approvalRequestTargetsSession(record.request, keys, sessionId)) execApprovalManager.expire(record.id, "worker-dispatch");
			for (const record of pluginApprovalManager.listPendingRecords()) if (approvalRequestTargetsSession(record.request, keys, sessionId)) pluginApprovalManager.expire(record.id, "worker-dispatch");
		};
		const attachedGatewayExtraHandlers = {
			...pluginRegistry.gatewayHandlers,
			...extraHandlers
		};
		let attachedPluginGatewayHandlerKeys = new Set(Object.keys(pluginRegistry.gatewayHandlers));
		const buildAttachedGatewayMethodRegistry = (nextPluginRegistry) => {
			const coreDescriptorHandlers = { ...coreGatewayHandlers };
			const auxHandlers = {};
			for (const [method, handler] of Object.entries(extraHandlers)) if (isCoreGatewayMethodClassified(method)) coreDescriptorHandlers[method] = handler;
			else auxHandlers[method] = handler;
			return createGatewayMethodRegistry([
				...createCoreGatewayMethodDescriptors(coreDescriptorHandlers).filter((descriptor) => (workerEnvironmentService || descriptor.name !== "environments.create" && descriptor.name !== "environments.destroy") && (workerPlacementDispatchAvailable || descriptor.name !== "sessions.dispatch") && (workerPlacementControlAvailable || descriptor.name !== "sessions.reclaim")),
				...createPluginGatewayMethodDescriptors(nextPluginRegistry),
				...createGatewayMethodDescriptorsFromHandlers({
					handlers: auxHandlers,
					owner: {
						kind: "aux",
						area: "gateway-extra"
					},
					defaultScope: ADMIN_SCOPE
				})
			]);
		};
		let attachedGatewayMethodRegistry = buildAttachedGatewayMethodRegistry(pluginRegistry);
		const listAttachedGatewayMethods = () => {
			const methods = attachedGatewayMethodRegistry.listAdvertisedMethods();
			methods.push(...listStartupChannelGatewayMethods());
			return uniqueStrings(methods);
		};
		runtimeState.gatewayMethods.splice(0, runtimeState.gatewayMethods.length, ...listAttachedGatewayMethods());
		const replaceAttachedPluginRuntime = (loaded) => {
			pluginRegistry = loaded.pluginRegistry;
			baseGatewayMethods = loaded.gatewayMethods;
			for (const key of attachedPluginGatewayHandlerKeys) delete attachedGatewayExtraHandlers[key];
			Object.assign(attachedGatewayExtraHandlers, pluginRegistry.gatewayHandlers);
			attachedPluginGatewayHandlerKeys = new Set(Object.keys(pluginRegistry.gatewayHandlers));
			attachedGatewayMethodRegistry = buildAttachedGatewayMethodRegistry(pluginRegistry);
			runtimeState.gatewayMethods.splice(0, runtimeState.gatewayMethods.length, ...listAttachedGatewayMethods());
			pinActivePluginHttpRouteRegistry(pluginRegistry);
			pinActivePluginSessionExtensionRegistry(pluginRegistry);
			pinActivePluginChannelRegistry(pluginRegistry);
			nodeRegistry.refreshNodePluginTools();
		};
		const refreshAttachedGatewayDiscovery = async (nextPluginRegistry) => {
			if (minimalTestGateway) return;
			try {
				const stopPreviousDiscovery = runtimeState.bonjourStop;
				runtimeState.bonjourStop = null;
				if (stopPreviousDiscovery) try {
					await stopPreviousDiscovery();
				} catch (err) {
					logDiscovery.warn(`gateway discovery stop failed before plugin refresh: ${String(err)}`);
				}
				const { startGatewayPluginDiscovery } = await loadGatewayStartupEarlyModule();
				runtimeState.bonjourStop = await startGatewayPluginDiscovery({
					minimalTestGateway,
					cfgAtStart,
					port,
					gatewayTls,
					gatewayDirectReachable: !isLoopbackHost(bindHost),
					tailscaleMode,
					logDiscovery,
					pluginRegistry: nextPluginRegistry
				});
			} catch (err) {
				logDiscovery.warn(`gateway discovery refresh failed after plugin load: ${String(err)}`);
			}
		};
		const listAttachedChannelConfigTargets = () => new Map(listGatewayStartupChannelPlugins().map((plugin) => [plugin.id, listChannelPluginConfigTargetIds({
			channelId: plugin.id,
			pluginId: getLoadedChannelPluginEntryById(plugin.id)?.pluginId,
			aliases: plugin.meta.aliases
		})]));
		const reloadAttachedGatewayPlugins = async (params) => {
			const beforeChannelTargets = listAttachedChannelConfigTargets();
			const beforeChannelIds = new Set(beforeChannelTargets.keys());
			const [{ loadPluginLookUpTable }, { prepareGatewayPluginLoad }, { startPluginServices }] = await Promise.all([
				import("./plugin-lookup-table-Dy_ovvLb.js"),
				loadGatewayPluginBootstrapModule(),
				import("./services-B4rq9SdI.js")
			]);
			const nextPluginLookUpTable = loadPluginLookUpTable({
				config: resolveGatewayStartupPluginActivationConfig({
					runtimeConfig: params.nextConfig,
					activationSourceConfig: params.nextConfig,
					env: params.env
				}),
				workspaceDir: defaultWorkspaceDir,
				env: params.env,
				activationSourceConfig: params.nextConfig,
				workerProviderIds: workerEnvironmentStartup?.listDurableProviderIds() ?? []
			});
			const nextStartupPluginIds = new Set(nextPluginLookUpTable.startup.pluginIds);
			const nextStartupChannelIds = /* @__PURE__ */ new Set();
			for (const plugin of nextPluginLookUpTable.manifestRegistry.plugins) {
				if (!nextStartupPluginIds.has(plugin.id)) continue;
				if (plugin.channels.length === 0) {
					nextStartupChannelIds.add(plugin.id);
					continue;
				}
				for (const channelId of plugin.channels) nextStartupChannelIds.add(channelId);
			}
			const channelsToStopBeforeReplace = /* @__PURE__ */ new Set();
			for (const channelId of beforeChannelIds) {
				const targetIds = beforeChannelTargets.get(channelId) ?? /* @__PURE__ */ new Set([channelId]);
				if (!nextStartupChannelIds.has(channelId) || pluginConfigTargetsChanged(targetIds, params.changedPaths)) channelsToStopBeforeReplace.add(channelId);
			}
			await params.beforeReplace(channelsToStopBeforeReplace);
			if (params.isAborted?.()) return {
				restartChannels: /* @__PURE__ */ new Set(),
				activeChannels: new Set(beforeChannelIds),
				cancelled: true
			};
			const previousPluginServices = runtimeState.pluginServices;
			await params.commitRuntime();
			const loaded = prepareGatewayPluginLoad({
				cfg: params.nextConfig,
				workspaceDir: defaultWorkspaceDir,
				log,
				coreGatewayMethodNames,
				hostServices: pluginHostServices,
				baseMethods,
				pluginLookUpTable: nextPluginLookUpTable
			});
			setCurrentPluginMetadataSnapshot(nextPluginLookUpTable, {
				config: params.nextConfig,
				env: params.env,
				workspaceDir: defaultWorkspaceDir
			});
			replaceAttachedPluginRuntime(loaded);
			runtimeState.pluginServices = null;
			if (previousPluginServices) await previousPluginServices.stop();
			await refreshAttachedGatewayDiscovery(loaded.pluginRegistry);
			runtimeState.pluginServices = await startPluginServices({
				registry: loaded.pluginRegistry,
				config: params.nextConfig,
				workspaceDir: defaultWorkspaceDir,
				broadcastPluginEvent
			});
			const afterChannelTargets = listAttachedChannelConfigTargets();
			const afterChannelIds = new Set(afterChannelTargets.keys());
			const restartChannels = /* @__PURE__ */ new Set();
			for (const channelId of /* @__PURE__ */ new Set([...beforeChannelIds, ...afterChannelIds])) {
				const targetIds = afterChannelTargets.get(channelId) ?? beforeChannelTargets.get(channelId) ?? /* @__PURE__ */ new Set([channelId]);
				if (afterChannelIds.has(channelId) && (beforeChannelIds.has(channelId) !== afterChannelIds.has(channelId) || pluginConfigTargetsChanged(targetIds, params.changedPaths))) restartChannels.add(channelId);
			}
			return {
				restartChannels,
				activeChannels: afterChannelIds
			};
		};
		const unavailableGatewayMethods = new Set(minimalTestGateway ? [] : STARTUP_UNAVAILABLE_GATEWAY_METHODS);
		const gatewayRequestContext = await startupTrace.measure("gateway.request-context", async () => {
			const { createGatewayRequestContext } = await import("./server-request-context-CGIu4zkX.js");
			return createGatewayRequestContext({
				deps,
				runtimeState,
				getRuntimeConfig,
				getMcpAppSandboxPort,
				ensureSandboxHostPort,
				resolveTerminalLaunchPolicy: terminalLaunchPolicy.resolve,
				isTerminalEnabled: terminalLaunchPolicy.isEnabled,
				execApprovalManager,
				cancelRunBoundApprovals,
				forwardPluginApprovalRequest,
				pluginApprovalIosPushDelivery,
				pluginApprovalManager,
				systemAgentApprovalManager,
				listSessionPendingApprovals: approvalSessionEvents.replay,
				loadGatewayModelCatalog,
				loadGatewayModelCatalogSnapshot,
				getHealthCache,
				refreshHealthSnapshot: refreshGatewayHealthSnapshotWithRuntime,
				logHealth,
				logGateway: log,
				incrementPresenceVersion,
				getHealthVersion,
				broadcast,
				broadcastToConnIds,
				nodeSendToSession,
				nodeSendToAllSubscribed,
				nodeSubscribe,
				nodeUnsubscribe,
				nodeUnsubscribeAll,
				hasConnectedTalkNode: hasTalkNodeConnected,
				clients,
				invalidateDeviceTransports: watchNodeHttpRuntime.invalidateSessionsForDevice,
				disconnectDeviceTransports: watchNodeHttpRuntime.disconnectSessionsForDevice,
				enforceSharedGatewayAuthGenerationForConfigWrite: (nextConfig) => {
					enforceSharedGatewaySessionGenerationForConfigWrite({
						state: sharedGatewaySessionGenerationState,
						nextConfig,
						resolveRuntimeSnapshotGeneration: resolveSharedGatewaySessionGenerationForRuntimeSnapshot,
						clients
					});
				},
				nodeRegistry,
				...workerEnvironmentService ? { workerEnvironmentService } : {},
				...workerPlacementRuntime ? { workerSessionPlacementService: workerPlacementRuntime.placements } : {},
				...workerPlacementControlAvailable ? { workerPlacementDispatchService: workerPlacementControlAvailable } : {},
				terminalSessions,
				agentRunSeq,
				chatAbortControllers,
				chatQueuedTurns,
				chatAbortedRuns: chatRunState.abortedRuns,
				chatRunBuffers: chatRunState.buffers,
				chatRunPlanSnapshots: chatRunState.planSnapshots,
				chatDeltaSentAt: chatRunState.deltaSentAt,
				chatDeltaLastBroadcastLen: chatRunState.deltaLastBroadcastLen,
				chatDeltaLastBroadcastText: chatRunState.deltaLastBroadcastText,
				agentDeltaSentAt: chatRunState.agentDeltaSentAt,
				bufferedAgentEvents: chatRunState.bufferedAgentEvents,
				clearChatRunState: chatRunState.clearRun,
				addChatRun,
				removeChatRun,
				subscribeSessionEvents: sessionEventSubscribers.subscribe,
				unsubscribeSessionEvents: sessionEventSubscribers.unsubscribe,
				subscribeSessionMessageEvents,
				unsubscribeSessionMessageEvents,
				unsubscribeAllSessionEvents: (connId) => {
					sessionEventSubscribers.unsubscribe(connId);
					sessionMessageSubscribers.unsubscribeAll(connId);
				},
				getSessionEventSubscriberConnIds: sessionEventSubscribers.getAll,
				registerToolEventRecipient: toolEventRecipients.add,
				dedupe,
				wizardSessions,
				systemAgentSessions,
				findRunningWizard,
				purgeWizardSession,
				getRuntimeSnapshot,
				getEventLoopHealth: readinessEventLoopHealth.snapshot,
				startChannel,
				stopChannel,
				markChannelLoggedOut,
				wizardRunner,
				channelWizardRunner,
				broadcastVoiceWakeChanged,
				unavailableGatewayMethods,
				broadcastVoiceWakeRoutingChanged
			});
		});
		currentPluginRegistryGatewayContext = gatewayRequestContext;
		const { createGatewayInstanceRuntime } = await import("./server-instance-runtime-BOruL4r4.js");
		const gatewayInstanceRuntimeLocal = createGatewayInstanceRuntime({
			getContext: () => gatewayRequestContext,
			getMethodRegistry: () => attachedGatewayMethodRegistry,
			isDispatchAvailable: () => gatewayInstanceDispatchReady && !closePreludeStarted,
			logError: (message) => log.error(message)
		});
		gatewayInstanceRuntime = gatewayInstanceRuntimeLocal;
		gatewayRequestContext.approvalEvents = gatewayInstanceRuntimeLocal.approvalEvents;
		gatewayRequestContext.recoveryRuntime = gatewayInstanceRuntimeLocal.recovery;
		const fallbackGatewayContextCleanup = setFallbackGatewayContextResolver(() => gatewayRequestContext);
		clearFallbackGatewayContextForServer = typeof fallbackGatewayContextCleanup === "function" ? () => {
			fallbackGatewayContextCleanup();
		} : () => {};
		if (!minimalTestGateway) {
			if (runtimePluginsLoaded && deferredConfiguredChannelPluginIds.length > 0) {
				const { reloadDeferredGatewayPlugins } = await loadGatewayPluginBootstrapModule();
				const loaded = await startupTrace.measure("gateway.deferred-plugins", () => reloadDeferredGatewayPlugins({
					cfg: gatewayPluginConfigAtStart,
					activationSourceConfig: startupActivationSourceConfig,
					workspaceDir: defaultWorkspaceDir,
					log,
					coreGatewayMethodNames,
					hostServices: pluginHostServices,
					baseMethods,
					pluginIds: startupPluginIds,
					pluginLookUpTable,
					logDiagnostics: false
				}));
				replaceAttachedPluginRuntime(loaded);
				await refreshAttachedGatewayDiscovery(loaded.pluginRegistry);
			}
		}
		const [{ attachGatewayWsHandlers }, { listPluginNodeCapabilities }] = await startupTrace.measure("gateway.ws-imports", () => Promise.all([import("./server-ws-runtime--2VCJjj7.js"), import("./route-capability-Cjzy-wRF.js")]));
		const pluginSurfaceScheme = gatewayTls.enabled ? "https" : "http";
		await startupTrace.measure("gateway.ws-attach", () => attachGatewayWsHandlers({
			wss,
			clients,
			preauthConnectionBudget,
			port,
			gatewayHost: bindHost ?? void 0,
			pluginSurfaceScheme,
			getPluginNodeCapabilities: () => withCoreCanvasNodeCapability(listPluginNodeCapabilities(pluginRegistry), isCoreCanvasHostEnabled(getRuntimeConfig())),
			resolvedAuth,
			getResolvedAuth,
			getRequiredSharedGatewaySessionGeneration: () => getRequiredSharedGatewaySessionGeneration(sharedGatewaySessionGenerationState),
			rateLimiter: authRateLimiter,
			browserRateLimiter: browserAuthRateLimiter,
			nodeReapprovalCoordinator,
			preauthHandshakeTimeoutMs,
			isStartupPending: isGatewayStartupPending,
			gatewayMethods: runtimeState.gatewayMethods,
			events: GATEWAY_EVENTS,
			logGateway: log,
			logHealth,
			logWsControl,
			extraHandlers: attachedGatewayExtraHandlers,
			getMethodRegistry: () => attachedGatewayMethodRegistry,
			...workerEnvironmentService ? { workerConnectionService: workerEnvironmentService } : {},
			broadcast,
			context: gatewayRequestContext
		}));
		await startupTrace.measure("http.listen", () => startListening());
		gatewayInstanceDispatchReady = true;
		startupTrace.mark("http.bound");
		const sessionDeliveryRecoveryMaxEnqueuedAt = Date.now();
		let postAttachRuntimeReturned = false;
		let scheduledServicesActivated = false;
		const loadScheduledServicesModule = createLazyPromise(() => import("./server-runtime-services-BmiS4yHJ.js"), { cacheRejections: true });
		const activateScheduledServicesWhenReady = () => {
			if (closePreludeStarted || !postAttachRuntimeReturned || !startupSidecarsReady || scheduledServicesActivated) return;
			scheduledServicesActivated = true;
			loadScheduledServicesModule().then((gatewayRuntimeServices) => {
				if (closePreludeStarted) return;
				const activated = gatewayRuntimeServices.activateGatewayScheduledServices({
					minimalTestGateway,
					cfgAtStart,
					deps,
					sessionDeliveryRecoveryMaxEnqueuedAt,
					cronState: runtimeState.cronState,
					cronReconciliation,
					startCron: false,
					logCron,
					log,
					pluginLookUpTable
				});
				runtimeState.heartbeatRunner = activated.heartbeatRunner;
				runtimeState.stopModelPricingRefresh = activated.stopModelPricingRefresh;
			});
		};
		({stopGatewayUpdateCheck: runtimeState.stopGatewayUpdateCheck, tailscaleCleanup: runtimeState.tailscaleCleanup, pluginServices: runtimeState.pluginServices} = await startupTrace.measure("runtime.post-attach", () => loadGatewayStartupPostAttachModule().then(({ startGatewayPostAttachRuntime, stopPostReadySidecarsAfterCloseStarted }) => startGatewayPostAttachRuntime({
			minimalTestGateway,
			cfgAtStart,
			bindHost,
			bindHosts: httpBindHosts,
			port,
			tlsEnabled: gatewayTls.enabled,
			log,
			isNixMode,
			startupStartedAt: opts.startupStartedAt,
			broadcast,
			broadcastPluginEvent,
			tailscaleMode,
			resetOnExit: tailscaleConfig.resetOnExit ?? false,
			serviceName: tailscaleConfig.serviceName,
			preserveFunnel: tailscaleConfig.preserveFunnel ?? false,
			controlUiBasePath,
			logTailscale,
			gatewayPluginConfigAtStart,
			activationSourceConfig: startupActivationSourceConfig,
			pluginRegistry,
			defaultWorkspaceDir,
			deps,
			startChannels,
			recoveryRuntime: gatewayInstanceRuntimeLocal.recovery,
			logHooks,
			logChannels,
			unavailableGatewayMethods,
			loadStartupPlugins: runtimePluginsLoaded ? void 0 : async () => {
				const { loadGatewayStartupPluginRuntime } = await loadStartupPluginsModule();
				return loadGatewayStartupPluginRuntime({
					cfg: gatewayPluginConfigAtStart,
					activationSourceConfig: startupActivationSourceConfig,
					workspaceDir: defaultWorkspaceDir,
					log,
					baseMethods,
					coreGatewayMethodNames,
					hostServices: pluginHostServices,
					startupPluginIds,
					pluginLookUpTable,
					startupTrace
				});
			},
			onStartupPluginsLoading: () => {
				startupPendingReason = "startup-sidecars";
			},
			onStartupPluginsLoaded: async (loaded) => {
				replaceAttachedPluginRuntime(loaded);
				startupPendingReason = "startup-sidecars";
				await refreshAttachedGatewayDiscovery(loaded.pluginRegistry);
			},
			getCronService: () => runtimeState?.cronState.cron,
			onChannelsStarted: () => {
				releaseStartupAccountStarts();
			},
			onPluginServices: (pluginServices) => {
				runtimeState.pluginServices = pluginServices;
			},
			onPostReadySidecars: (postReadySidecars) => {
				runtimeState.postReadySidecars = postReadySidecars;
				stopPostReadySidecarsAfterCloseStarted({
					postReadySidecars,
					closeStarted: closePreludeStarted
				});
				if (closePreludeStarted) runtimeState.postReadySidecars = [];
			},
			onGatewayLifetimeSidecars: (gatewayLifetimeSidecars) => {
				runtimeState.gatewayLifetimeSidecars = gatewayLifetimeSidecars;
				stopPostReadySidecarsAfterCloseStarted({
					postReadySidecars: gatewayLifetimeSidecars,
					closeStarted: closePreludeStarted
				});
				if (closePreludeStarted) runtimeState.gatewayLifetimeSidecars = [];
			},
			...workerPlacementRuntime ? { startWorkerEnvironmentRuntime: async () => {
				if (closePreludeStarted) return null;
				return await workerPlacementRuntime.startRuntime({
					isClosePreludeStarted: () => closePreludeStarted,
					registerSidecar: (sidecar) => {
						runtimeState.gatewayLifetimeSidecars.push(sidecar);
					}
				});
			} } : {},
			onSidecarsReady: () => {
				startupSidecarsReady = true;
				activateScheduledServicesWhenReady();
			},
			isClosing: () => closePreludeStarted,
			startupTrace,
			sidecarStartup,
			providerAuthPrewarm: { getConfig: getRuntimeConfig }
		}))));
		startupTrace.detail("memory.ready", collectGatewayProcessMemoryUsageMb());
		startupTrace.mark("ready");
		if (sidecarStartup === "defer") log.info("gateway ready");
		finishGatewayRestartTrace("restart.ready", collectGatewayProcessMemoryUsageMb());
		if (!minimalTestGateway) {
			const { startOpenClawDatabaseIntegrityVerifier } = await import("./openclaw-database-verify-MD-iD3xH.js");
			runtimeState.gatewayLifetimeSidecars.push(startOpenClawDatabaseIntegrityVerifier({ env: process.env }));
		}
		postAttachRuntimeReturned = true;
		activateScheduledServicesWhenReady();
		const { startManagedGatewayConfigReloader } = await import("./server-reload-handlers-BO4B_tG2.js");
		runtimeState.configReloader = startManagedGatewayConfigReloader({
			minimalTestGateway,
			initialConfig: cfgAtStart,
			initialCompareConfig: startupLastGoodSnapshot.sourceConfig,
			initialSnapshotRawHash: startupLastGoodSnapshot.exists ? startupLastGoodSnapshot.hash ?? null : null,
			initialAuthoredConfig: startupLastGoodSnapshot.parsed,
			initialIncludedPaths: startupLastGoodSnapshot.includedPaths ?? [],
			initialSnapshotValid: startupLastGoodSnapshot.valid,
			initialSnapshotIssues: startupLastGoodSnapshot.issues,
			initialInternalWriteHash: startupInternalWriteHash,
			watchPath: configSnapshot.path,
			readSnapshot: readConfigFileSnapshotForRuntimeTransaction,
			promoteSnapshot: promoteConfigSnapshotToLastKnownGood,
			subscribeToWrites: (listener) => registerConfigWriteListener(listener, {
				ownsRuntimeActivationFor: configSnapshot.path,
				preCommitRuntimePreflight: async (sourceConfig, runtimeRefresh) => {
					const candidate = prepareReloadCandidate({
						runtimeConfig: sourceConfig,
						sourceConfig
					});
					await activateRuntimeSecrets(candidate.runtimeConfig, {
						reason: "reload",
						activate: false,
						env: candidate.runtimeEnv.env,
						includeAuthStoreRefs: runtimeRefresh?.includeAuthStoreRefs
					});
					return candidate;
				}
			}),
			deps,
			broadcast,
			getState: () => ({
				hooksConfig: runtimeState.hooksConfig,
				hookClientIpConfig: runtimeState.hookClientIpConfig,
				heartbeatRunner: runtimeState.heartbeatRunner,
				cronState: runtimeState.cronState,
				channelHealthMonitor: runtimeState.channelHealthMonitor
			}),
			setState: (nextState) => {
				const cronStateChanged = nextState.cronState !== runtimeState.cronState;
				runtimeState.hooksConfig = nextState.hooksConfig;
				runtimeState.hookClientIpConfig = nextState.hookClientIpConfig;
				runtimeState.heartbeatRunner = nextState.heartbeatRunner;
				runtimeState.cronState = nextState.cronState;
				deps.cron = runtimeState.cronState.cron;
				runtimeState.channelHealthMonitor = nextState.channelHealthMonitor;
				if (cronStateChanged) gatewayCronStartHandled = true;
			},
			startChannel,
			stopChannel,
			getChannelAutostartSuppression: channelManager.getAutostartSuppression,
			stopPostReadySidecars: stopRegisteredPostReadySidecars,
			reloadPlugins: reloadAttachedGatewayPlugins,
			logHooks,
			logChannels,
			logCron,
			logReload,
			cronReconciliation,
			onCronRestart: () => {
				gatewayCronStartHandled = true;
			},
			prepareTerminalConfig: (plan, nextConfig) => {
				terminalLaunchPolicy.prepareConfig(nextConfig, { restartPending: plan.restartGateway });
			},
			reconcileTerminalSessions: () => {
				terminalSessions.closeDisallowedAgents((agentId) => terminalLaunchPolicy.resolve(agentId).ok);
			},
			commitTerminalConfig: (nextConfig) => {
				terminalLaunchPolicy.commitConfig();
				workerLiveEvents?.rebindAll(nextConfig);
			},
			acceptTerminalConfig: terminalLaunchPolicy.acceptConfig,
			channelManager,
			activateRuntimeSecrets,
			prepareConfigCandidate: prepareReloadCandidate,
			applyRuntimeConfigOverrides: applyFixedGatewayOverlays,
			resolveSharedGatewaySessionGenerationForConfig,
			sharedGatewaySessionGenerationState,
			clients,
			...opts.hotReloadRecovery ? { requestRecoveryRestart: opts.hotReloadRecovery } : {},
			restartRecoveryAvailable: opts.hotReloadRecovery !== void 0
		});
		await promoteConfigSnapshotToLastKnownGood(startupLastGoodSnapshot).catch((err) => {
			log.warn(`gateway: failed to promote config last-known-good backup: ${String(err)}`);
		});
		if (!minimalTestGateway) {
			const gatewayRuntimeServices = await loadScheduledServicesModule();
			postReadyMaintenanceTimer = gatewayRuntimeServices.scheduleGatewayPostReadyMaintenance({
				delayMs: POST_READY_MAINTENANCE_DELAY_MS,
				isClosing: () => closePreludeStarted,
				onStarted: () => {
					postReadyMaintenanceTimer = null;
				},
				startMaintenance: async () => {
					if (closePreludeStarted) return null;
					return earlyRuntime.startMaintenance();
				},
				applyMaintenance: (maintenance) => {
					if (closePreludeStarted) {
						clearInterval(maintenance.tickInterval);
						clearInterval(maintenance.healthInterval);
						clearInterval(maintenance.dedupeCleanup);
						if (maintenance.mediaCleanup) clearInterval(maintenance.mediaCleanup);
						clearInterval(maintenance.worktreeCleanup);
						maintenance.skillCuratorCleanup();
						return;
					}
					runtimeState.tickInterval = maintenance.tickInterval;
					runtimeState.healthInterval = maintenance.healthInterval;
					runtimeState.dedupeCleanup = maintenance.dedupeCleanup;
					runtimeState.mediaCleanup = maintenance.mediaCleanup;
					runtimeState.worktreeCleanup = maintenance.worktreeCleanup;
					runtimeState.skillCuratorCleanup = maintenance.skillCuratorCleanup;
				},
				shouldStartCron: () => !closePreludeStarted && !gatewayCronStartHandled,
				markCronStartHandled: () => {
					gatewayCronStartHandled = true;
				},
				cronState: runtimeState.cronState,
				cronReconciliation,
				cronConfig: cfgAtStart,
				logCron,
				log,
				recordPostReadyMemory: () => {
					startupTrace.detail("memory.post-ready", collectGatewayProcessMemoryUsageMb());
				}
			});
			retainedPluginCleanupHandle = gatewayRuntimeServices.scheduleGatewayIdleTask({
				delayMs: RETAINED_PLUGIN_CLEANUP_DELAY_MS,
				retryDelayMs: RETAINED_PLUGIN_CLEANUP_DELAY_MS,
				isClosing: () => closePreludeStarted,
				isBusy: () => getActiveGatewayRootWorkCount({ excludeCurrent: true }) > 0,
				run: async () => {
					const { cleanupRetainedPluginInstallGenerations } = await import("./server-retained-plugin-cleanup-DFk-qgRW.js");
					await cleanupRetainedPluginInstallGenerations({ log });
				},
				log,
				errorMessage: "retained npm generation cleanup failed"
			});
		} else startupTrace.detail("memory.post-ready", collectGatewayProcessMemoryUsageMb());
	} catch (err) {
		await closeOnStartupFailure();
		throw err;
	}
	const close = createCloseHandler();
	return { close: async (optsLocal) => {
		try {
			await beginClosePrelude();
			terminalSessions.disposeAll();
			await stopRegisteredGatewayLifetimeSidecars();
			await stopRegisteredPostReadySidecars();
			const { runGlobalGatewayStopSafely } = await import("./plugins/hook-runner-global.js");
			await runGlobalGatewayStopSafely({
				event: { reason: optsLocal?.reason ?? "gateway stopping" },
				ctx: { port },
				onError: (err) => log.warn(`gateway_stop hook failed: ${String(err)}`)
			});
			await runClosePrelude();
			await close(optsLocal);
		} finally {
			clearFallbackGatewayContextForServer();
		}
	} };
}
//#endregion
export { resetPreparedModelCatalogForTest, startGatewayServer };
