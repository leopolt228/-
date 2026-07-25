import { r as isVitestRuntimeEnv } from "./env-CHfvZ8Nb.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import { n as getPluginRegistryState } from "./runtime-state-Bd0YsvqM.js";
import "./config-BOMcY2yX.js";
import { m as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-CLw1UuhK.js";
import { yt as loadSessionEntry } from "./session-accessor-Mu3lv_Tl.js";
import { K as resolveSessionStorePathForScope } from "./store-DDuGv_UJ.js";
import { d as recordSessionHumanDirectMessage, f as recordSessionStateEvent } from "./session-state-events-BG_mebdA.js";
import { i as updateSessionUpstreamLinkMarker, n as listWatchedSessionUpstreamLinks, r as readSessionUpstreamLink, t as deleteSessionUpstreamLink } from "./session-upstream-links-Bzgf8xD_.js";
import { l as isEmbeddedAgentRunActive } from "./runs-DDczt14d.js";
import { i as readRecentUserAssistantTextForSession } from "./transcript-vdi-rYV7.js";
import { t as isGatewayModelPricingEnabled } from "./model-pricing-config-OEwtqVMb.js";
import "./embedded-agent-BD_ojzpk.js";
import { d as startSessionDeliveryRuntime, u as schedulePendingSessionDeliveries } from "./subagent-announce-origin-DHldKZbu.js";
import { t as removeCronRunContinuationSessionIfIdle } from "./cron-run-continuation-cleanup-CQsZgw8_.js";
import { r as startHeartbeatRunner } from "./heartbeat-runner-BnH5H5-Z.js";
import { r as createNoopHeartbeatRunner } from "./server-runtime-startup-services-BNtQeGKG.js";
import { createHash } from "node:crypto";
//#region src/sessions/session-upstream-monitor.ts
/** Polls watched adopted sessions for direct upstream human activity. */
const SESSION_UPSTREAM_MONITOR_INTERVAL_MS = 6e4;
const SESSION_UPSTREAM_MONITOR_INITIAL_DELAY_MS = 15e3;
const SESSION_UPSTREAM_OWN_USER_TEXT_LIMIT = 10;
const SESSION_UPSTREAM_MISSING_THRESHOLD = 3;
const log = createSubsystemLogger("sessions/upstream-monitor");
function currentProviders() {
	return (getPluginRegistryState()?.activeRegistry?.sessionCatalogs ?? []).map((registration) => registration.provider);
}
function databaseOptions(options) {
	return {
		...options.env ? { env: options.env } : {},
		...options.path ? { path: options.path } : {}
	};
}
function normalizeUserText(text) {
	return text.trim().replace(/\s+/g, " ");
}
function upstreamSourceKey(probe) {
	return createHash("sha256").update(`${probe.hostId}\u0000${probe.threadId}\u0000${JSON.stringify(probe.upstreamRef)}`).digest("hex").slice(0, 16);
}
function upstreamMonitorLinkKey(probe) {
	return `${probe.sessionKey}\n${probe.agentId}\n${upstreamSourceKey(probe)}`;
}
async function loadOwnRecentUserTexts(probe, entry, options) {
	if (options.loadOwnRecentUserTexts) return await options.loadOwnRecentUserTexts({
		entry,
		probe
	});
	const storePath = resolveSessionStorePathForScope({
		agentId: probe.agentId,
		sessionKey: probe.sessionKey,
		...options.env ? { env: options.env } : {}
	});
	return (await readRecentUserAssistantTextForSession({
		agentId: probe.agentId,
		sessionKey: probe.sessionKey,
		storePath,
		limit: SESSION_UPSTREAM_OWN_USER_TEXT_LIMIT,
		preferUpstreamUserText: true,
		role: "user"
	})).map((item) => normalizeUserText(item.text)).filter(Boolean);
}
async function probeProvenanceUnchanged(probe, options) {
	const entry = (options.loadEntry ?? loadSessionEntry)({
		sessionKey: probe.sessionKey,
		agentId: probe.agentId,
		clone: false,
		...options.env ? { env: options.env } : {}
	});
	if (!entry?.sessionId || (options.isRunActive ?? isEmbeddedAgentRunActive)(entry.sessionId)) return false;
	const current = await loadOwnRecentUserTexts(probe, entry, options);
	return current.length === probe.ownRecentUserTexts.length && current.every((text, index) => text === probe.ownRecentUserTexts[index]);
}
async function runSessionUpstreamMonitorTick(options = {}, missingCounts = /* @__PURE__ */ new Map()) {
	const dbOptions = databaseOptions(options);
	const linksByCatalog = listWatchedSessionUpstreamLinks(dbOptions);
	const watchedLinkKeys = new Set([...linksByCatalog.values()].flatMap((links) => links.map(upstreamMonitorLinkKey)));
	for (const key of missingCounts.keys()) if (!watchedLinkKeys.has(key)) missingCounts.delete(key);
	const providers = options.providers ?? currentProviders();
	const providerById = new Map(providers.map((provider) => [provider.id, provider]));
	for (const [catalogId, links] of linksByCatalog) {
		const provider = providerById.get(catalogId);
		if (!provider?.checkUpstreamActivity) continue;
		const probes = [];
		for (const link of links) {
			const probe = {
				sessionKey: link.sessionKey,
				agentId: link.agentId,
				threadId: link.threadId,
				hostId: link.hostId,
				upstreamKind: link.upstreamKind,
				upstreamRef: link.upstreamRef,
				marker: link.marker
			};
			try {
				const entry = (options.loadEntry ?? loadSessionEntry)({
					sessionKey: probe.sessionKey,
					agentId: probe.agentId,
					clone: false,
					...options.env ? { env: options.env } : {}
				});
				if (!entry?.sessionId || (options.isRunActive ?? isEmbeddedAgentRunActive)(entry.sessionId)) continue;
				probes.push({
					...probe,
					ownRecentUserTexts: await loadOwnRecentUserTexts(probe, entry, options)
				});
			} catch (error) {
				log.warn(`upstream transcript provenance failed for ${probe.sessionKey}: ${String(error)}`);
			}
		}
		if (probes.length === 0) continue;
		const probeBySessionKey = new Map(probes.map((probe) => [probe.sessionKey, probe]));
		const linkUpdatedAtBySessionKey = new Map(links.map((link) => [link.sessionKey, link.updatedAt]));
		try {
			const outcomes = await provider.checkUpstreamActivity(probes);
			const missingSessionKeys = new Set(outcomes.filter((outcome) => outcome.kind === "missing").map((outcome) => outcome.sessionKey));
			for (const probe of probes) if (!missingSessionKeys.has(probe.sessionKey)) missingCounts.delete(upstreamMonitorLinkKey(probe));
			for (const outcome of outcomes) {
				const probe = probeBySessionKey.get(outcome.sessionKey);
				if (!probe) continue;
				const missingCountKey = upstreamMonitorLinkKey(probe);
				if (outcome.kind === "missing") {
					const expectedUpdatedAt = linkUpdatedAtBySessionKey.get(outcome.sessionKey);
					if (expectedUpdatedAt === void 0) {
						missingCounts.delete(missingCountKey);
						continue;
					}
					const previous = missingCounts.get(missingCountKey);
					const missingCount = Math.min(SESSION_UPSTREAM_MISSING_THRESHOLD, (previous?.linkUpdatedAt === expectedUpdatedAt ? previous.count : 0) + 1);
					missingCounts.set(missingCountKey, {
						count: missingCount,
						linkUpdatedAt: expectedUpdatedAt
					});
					if (missingCount < SESSION_UPSTREAM_MISSING_THRESHOLD) continue;
					const currentLink = readSessionUpstreamLink(probe.sessionKey, probe.agentId, dbOptions);
					if (!currentLink || currentLink.updatedAt !== expectedUpdatedAt || upstreamSourceKey(currentLink) !== upstreamSourceKey(probe)) {
						missingCounts.delete(missingCountKey);
						continue;
					}
					const sourceKey = upstreamSourceKey(probe);
					if (!recordSessionStateEvent({
						sessionKey: probe.sessionKey,
						agentId: probe.agentId,
						kind: "upstream_missing",
						actorType: "system",
						dedupeKey: `upstream-missing:${probe.sessionKey}:${sourceKey}:${currentLink.updatedAt}`,
						summary: `upstream missing via ${catalogId}`,
						payload: { channel: catalogId }
					}, {
						...dbOptions,
						now: (options.now ?? Date.now)()
					})) {
						missingCounts.set(missingCountKey, {
							count: SESSION_UPSTREAM_MISSING_THRESHOLD - 1,
							linkUpdatedAt: expectedUpdatedAt
						});
						continue;
					}
					deleteSessionUpstreamLink(probe.sessionKey, probe.agentId, dbOptions);
					missingCounts.delete(missingCountKey);
					continue;
				}
				missingCounts.delete(missingCountKey);
				const activity = outcome;
				if (!Number.isSafeInteger(activity.humanTurns) || activity.humanTurns < 0) continue;
				try {
					if (!await probeProvenanceUnchanged(probe, options)) continue;
				} catch (error) {
					log.warn(`upstream transcript provenance failed for ${probe.sessionKey}: ${String(error)}`);
					continue;
				}
				const expectedUpdatedAt = linkUpdatedAtBySessionKey.get(activity.sessionKey);
				const currentLink = readSessionUpstreamLink(probe.sessionKey, probe.agentId, dbOptions);
				if (!currentLink || currentLink.updatedAt !== expectedUpdatedAt || upstreamSourceKey({
					hostId: currentLink.hostId,
					threadId: currentLink.threadId,
					upstreamRef: currentLink.upstreamRef
				}) !== upstreamSourceKey(probe)) continue;
				if (activity.humanTurns === 0) {
					updateSessionUpstreamLinkMarker(probe.sessionKey, probe.agentId, activity.nextMarker, {
						...dbOptions,
						now: (options.now ?? Date.now)(),
						...expectedUpdatedAt === void 0 ? {} : { expectedUpdatedAt }
					});
					continue;
				}
				if (!Number.isFinite(activity.occurredAt) || !activity.dedupeId) continue;
				if (!recordSessionHumanDirectMessage({
					sessionKey: probe.sessionKey,
					agentId: probe.agentId,
					actor: { actorType: "human" },
					channel: catalogId,
					dedupeKey: `upstream:${probe.sessionKey}:${upstreamSourceKey(probe)}:${activity.dedupeId}`,
					...activity.humanTurns > 1 ? { payload: { turns: activity.humanTurns } } : {},
					occurredAt: activity.occurredAt
				}, {
					...dbOptions,
					now: (options.now ?? Date.now)()
				})) continue;
				updateSessionUpstreamLinkMarker(probe.sessionKey, probe.agentId, activity.nextMarker, {
					...dbOptions,
					now: (options.now ?? Date.now)(),
					...expectedUpdatedAt === void 0 ? {} : { expectedUpdatedAt }
				});
			}
		} catch (error) {
			log.warn(`upstream activity probe failed for ${catalogId}: ${String(error)}`);
		}
	}
}
function startSessionUpstreamMonitor(options = {}) {
	let stopped = false;
	let running = false;
	const missingCounts = /* @__PURE__ */ new Map();
	const run = () => {
		if (stopped || running) return;
		running = true;
		runSessionUpstreamMonitorTick(options, missingCounts).catch((error) => {
			log.warn(`upstream monitor tick failed: ${String(error)}`);
		}).finally(() => {
			running = false;
		});
	};
	const initialTimer = setTimeout(run, SESSION_UPSTREAM_MONITOR_INITIAL_DELAY_MS);
	initialTimer.unref?.();
	const interval = setInterval(run, SESSION_UPSTREAM_MONITOR_INTERVAL_MS);
	interval.unref?.();
	return { stop: () => {
		stopped = true;
		clearTimeout(initialTimer);
		clearInterval(interval);
	} };
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.sessionUpstreamMonitorTestApi")] = { runSessionUpstreamMonitorTick };
//#endregion
//#region src/gateway/server-runtime-services.ts
/** Starts cron without making the surrounding startup or reload transaction wait. */
function startGatewayCronWithLogging(params) {
	const reconciliation = params.cronReconciliation.arm({
		reason: params.reason,
		config: params.config,
		cronState: params.cronState
	});
	runWithGatewayIndependentRootWorkAdmission(async () => {
		try {
			await params.cronState.cron.start();
			await params.afterStart?.();
			await reconciliation.complete();
		} catch (err) {
			params.logCron.error(`failed to start: ${String(err)}`);
			params.onStartError?.(err);
		}
	}).catch((err) => params.logCron.error(`failed to enter start root: ${String(err)}`));
}
function clearGatewayMaintenanceHandles(maintenance) {
	if (!maintenance) return;
	clearInterval(maintenance.tickInterval);
	clearInterval(maintenance.healthInterval);
	clearInterval(maintenance.dedupeCleanup);
	clearInterval(maintenance.worktreeCleanup);
	if (maintenance.mediaCleanup) clearInterval(maintenance.mediaCleanup);
	maintenance.skillCuratorCleanup();
}
/** Runs maintenance that is intentionally delayed until after the gateway is ready. */
async function runGatewayPostReadyMaintenance(params) {
	try {
		const maintenance = await params.startMaintenance();
		if (maintenance) params.applyMaintenance(maintenance);
	} catch (err) {
		params.log.warn(`gateway post-ready maintenance startup failed: ${String(err)}`);
	}
	if (params.shouldStartCron()) {
		params.markCronStartHandled();
		startGatewayCronWithLogging({
			cronState: params.cronState,
			cronReconciliation: params.cronReconciliation,
			reason: "startup",
			config: params.cronConfig,
			logCron: params.logCron
		});
	}
	params.recordPostReadyMemory();
}
/** Schedules post-ready maintenance and cancels/cleans handles if shutdown wins the race. */
function scheduleGatewayPostReadyMaintenance(params) {
	const timer = setTimeout(() => {
		params.onStarted?.();
		if (params.isClosing()) return;
		runWithGatewayIndependentRootWorkAdmission(async () => runGatewayPostReadyMaintenance({
			startMaintenance: async () => {
				if (params.isClosing()) return null;
				const maintenance = await params.startMaintenance();
				if (params.isClosing()) {
					clearGatewayMaintenanceHandles(maintenance);
					return null;
				}
				return maintenance;
			},
			applyMaintenance: (maintenance) => {
				if (params.isClosing()) {
					clearGatewayMaintenanceHandles(maintenance);
					return;
				}
				params.applyMaintenance(maintenance);
			},
			shouldStartCron: () => !params.isClosing() && params.shouldStartCron(),
			markCronStartHandled: params.markCronStartHandled,
			cronState: params.cronState,
			cronReconciliation: params.cronReconciliation,
			cronConfig: params.cronConfig,
			logCron: params.logCron,
			log: params.log,
			recordPostReadyMemory: () => {
				if (!params.isClosing()) params.recordPostReadyMemory();
			}
		})).catch((err) => params.log.warn(`gateway post-ready maintenance deferred task failed: ${String(err)}`));
	}, params.delayMs);
	timer.unref?.();
	return timer;
}
/** Schedules one low-priority task, retrying until the gateway has no active request roots. */
function scheduleGatewayIdleTask(params) {
	let stopped = false;
	let timer = null;
	const schedule = (delayMs) => {
		if (stopped || params.isClosing()) return;
		timer = setTimeout(() => {
			timer = null;
			if (stopped || params.isClosing()) return;
			if (params.isBusy()) {
				schedule(params.retryDelayMs);
				return;
			}
			runWithGatewayIndependentRootWorkAdmission(async () => {
				if (stopped || params.isClosing()) return;
				if (params.isBusy()) {
					schedule(params.retryDelayMs);
					return;
				}
				await params.run();
			}).catch((error) => params.log.warn(`${params.errorMessage}: ${String(error)}`));
		}, delayMs);
		timer.unref?.();
	};
	schedule(params.delayMs);
	return { stop: () => {
		stopped = true;
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	} };
}
function recoverPendingOutboundDeliveries(params) {
	runWithGatewayIndependentRootWorkAdmission(async () => {
		const { recoverPendingDeliveries } = await import("./delivery-queue-BKkw15Mf.js");
		const { deliverOutboundPayloadsInternal } = await import("./deliver-8pAOnueU.js");
		await recoverPendingDeliveries({
			deliver: deliverOutboundPayloadsInternal,
			log: params.log.child("delivery-recovery"),
			cfg: params.cfg
		});
	}).catch((err) => params.log.error(`Delivery recovery failed: ${String(err)}`));
}
function startPendingSessionDeliveryRuntime(params) {
	let stopped = false;
	let stopRuntime;
	const timer = setTimeout(() => {
		runWithGatewayIndependentRootWorkAdmission(async () => {
			const { deliverQueuedSessionDelivery, recoverPendingRestartContinuationDeliveries } = await import("./server-restart-sentinel-BSenIVbE.js");
			if (stopped) return;
			const logRecovery = params.log.child("session-delivery-recovery");
			stopRuntime = startSessionDeliveryRuntime({
				deliver: (entry, context = {}) => deliverQueuedSessionDelivery({
					deps: params.deps,
					entry,
					...context.stateDir !== void 0 ? { stateDir: context.stateDir } : {}
				}),
				log: logRecovery,
				onSettled: (entry) => removeCronRunContinuationSessionIfIdle(entry.sessionKey, entry.id)
			});
			try {
				await recoverPendingRestartContinuationDeliveries({
					deps: params.deps,
					log: logRecovery,
					maxEnqueuedAt: params.maxEnqueuedAt
				});
			} finally {
				await schedulePendingSessionDeliveries();
			}
		}).catch((err) => params.log.error(`Session delivery recovery failed: ${String(err)}`));
	}, 1250);
	timer.unref?.();
	return () => {
		stopped = true;
		clearTimeout(timer);
		stopRuntime?.();
		stopRuntime = void 0;
	};
}
function startGatewayModelPricingRefreshOnDemand(params) {
	if (!isGatewayModelPricingEnabled(params.config)) return () => {};
	let stopped = false;
	let stopRefresh;
	runWithGatewayIndependentRootWorkAdmission(async () => {
		const { startGatewayModelPricingRefresh } = await import("./model-pricing-cache-Bk-qrRzM.js");
		if (stopped) return;
		stopRefresh = startGatewayModelPricingRefresh({
			config: params.config,
			...params.pluginLookUpTable ? { pluginLookUpTable: params.pluginLookUpTable } : {}
		});
		if (stopped) {
			stopRefresh();
			stopRefresh = void 0;
		}
	}).catch((err) => params.log.error(`Model pricing refresh failed to start: ${String(err)}`));
	return () => {
		stopped = true;
		stopRefresh?.();
		stopRefresh = void 0;
	};
}
/** Activates background gateway services after core runtime startup is ready. */
function activateGatewayScheduledServices(params) {
	if (params.minimalTestGateway) return {
		heartbeatRunner: createNoopHeartbeatRunner(),
		stopModelPricingRefresh: () => {}
	};
	const heartbeatRunner = startHeartbeatRunner({
		cfg: params.cfgAtStart,
		readCurrentConfig: getRuntimeConfig
	});
	const sessionUpstreamMonitor = startSessionUpstreamMonitor();
	const stopSessionDeliveryRuntime = startPendingSessionDeliveryRuntime({
		deps: params.deps,
		log: params.log,
		maxEnqueuedAt: params.sessionDeliveryRecoveryMaxEnqueuedAt
	});
	const heartbeatRunnerWithUpstreamMonitor = {
		updateConfig: heartbeatRunner.updateConfig,
		stop: () => {
			stopSessionDeliveryRuntime();
			sessionUpstreamMonitor.stop();
			heartbeatRunner.stop();
		}
	};
	if (params.startCron !== false) startGatewayCronWithLogging({
		cronState: params.cronState,
		cronReconciliation: params.cronReconciliation,
		reason: "startup",
		config: params.cfgAtStart,
		logCron: params.logCron
	});
	recoverPendingOutboundDeliveries({
		cfg: params.cfgAtStart,
		log: params.log
	});
	return {
		heartbeatRunner: heartbeatRunnerWithUpstreamMonitor,
		stopModelPricingRefresh: !isVitestRuntimeEnv() ? startGatewayModelPricingRefreshOnDemand({
			config: params.cfgAtStart,
			...params.pluginLookUpTable ? { pluginLookUpTable: params.pluginLookUpTable } : {},
			log: params.log
		}) : () => {}
	};
}
//#endregion
export { startGatewayCronWithLogging as a, scheduleGatewayPostReadyMaintenance as i, runGatewayPostReadyMaintenance as n, scheduleGatewayIdleTask as r, activateGatewayScheduledServices as t };
