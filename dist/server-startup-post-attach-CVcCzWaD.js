import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { n as isTruthyEnvValue, r as isVitestRuntimeEnv } from "./env-CHfvZ8Nb.js";
import { x as resolveStateDir } from "./paths-CHQRdQZ3.js";
import { i as getPluginModuleLoaderStats } from "./plugin-module-loader-cache-BmNGbwiD.js";
import { t as STARTUP_UNAVAILABLE_GATEWAY_METHODS } from "./core-descriptors-BaSJeBqR.js";
import { m as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-CLw1UuhK.js";
import { _ as sweepSessionStateWatchNotices } from "./session-state-events-BG_mebdA.js";
import { s as hasRestartSentinel } from "./restart-sentinel-C6N0OP2Z.js";
import { t as GATEWAY_EVENT_UPDATE_AVAILABLE } from "./events-CrZXFXYx.js";
import { t as hasConfiguredInternalHooks } from "./configured-pV8SaeM2.js";
import { Worker } from "node:worker_threads";
import { monitorEventLoopDelay, performance } from "node:perf_hooks";
import pMap from "p-map";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
//#region src/gateway/server-startup-context-cache-prewarm.ts
const CONTEXT_CACHE_PREWARM_START_DELAY_MS = 5e3;
function scheduleContextCachePrewarm(params) {
	let stopped = false;
	let timer;
	const warm = async () => {
		if (stopped) return;
		const { ensureContextWindowCacheLoaded } = await import("./context-DkOlpGmA.js");
		if (!stopped) await ensureContextWindowCacheLoaded(params.cfgAtStart);
	};
	timer = setTimeout(() => {
		timer = void 0;
		runWithGatewayIndependentRootWorkAdmission(() => params.startupTrace ? params.startupTrace.measure("post-ready.context-window-cache", warm) : warm()).catch((err) => {
			params.log.warn(`post-ready.context-window-cache failed after gateway ready: ${String(err)}`);
		});
	}, CONTEXT_CACHE_PREWARM_START_DELAY_MS);
	timer.unref?.();
	return { stop: () => {
		stopped = true;
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
	} };
}
//#endregion
//#region src/gateway/server-startup-outcomes.ts
const GATEWAY_STARTUP_SUBSYSTEMS = [
	"internal-hooks",
	"internal-startup-hook",
	"gateway-start-hooks",
	"memory-qmd",
	"gmail-watcher",
	"gmail-model"
];
function skipped(subsystem, reason) {
	return {
		subsystem,
		status: "skipped",
		reason
	};
}
function resolveOutcomePlan(params) {
	const internalHooks = params.cfg.hooks?.internal?.enabled === false ? "hooks-disabled" : hasConfiguredInternalHooks(params.cfg) ? "configured" : "not-configured";
	const memoryQmd = params.cfg.memory?.backend !== "qmd" ? "not-configured" : params.memoryStartupMode === "off" ? "startup-disabled" : "scheduled";
	const gmailWatcher = !params.cfg.hooks?.enabled ? "hooks-disabled" : !params.cfg.hooks.gmail?.account ? "no-gmail-account" : isTruthyEnvValue((params.env ?? process.env).OPENCLAW_SKIP_GMAIL_WATCHER) ? "disabled-by-environment" : "scheduled";
	return {
		internalHooks,
		gatewayStartHooks: params.gatewayStartHooks,
		memoryQmd,
		gmailWatcher,
		gmailModel: params.cfg.hooks?.gmail?.model ? "scheduled" : "not-configured"
	};
}
/** Create the complete initial outcome set; awaited startup work may replace entries later. */
function createGatewayStartupOutcomeRecorder(params) {
	const plan = resolveOutcomePlan(params);
	const internalHooks = plan.internalHooks === "configured" ? skipped("internal-hooks", "no-handlers-loaded") : skipped("internal-hooks", plan.internalHooks);
	const internalStartupHook = plan.internalHooks === "hooks-disabled" ? skipped("internal-startup-hook", "hooks-disabled") : skipped("internal-startup-hook", "no-handlers-loaded");
	const outcomes = /* @__PURE__ */ new Map([
		["internal-hooks", internalHooks],
		["internal-startup-hook", internalStartupHook],
		["gateway-start-hooks", plan.gatewayStartHooks ? {
			subsystem: "gateway-start-hooks",
			status: "scheduled"
		} : skipped("gateway-start-hooks", "no-handlers-loaded")],
		["memory-qmd", plan.memoryQmd === "scheduled" ? {
			subsystem: "memory-qmd",
			status: "scheduled"
		} : skipped("memory-qmd", plan.memoryQmd)],
		["gmail-watcher", plan.gmailWatcher === "scheduled" ? {
			subsystem: "gmail-watcher",
			status: "scheduled"
		} : skipped("gmail-watcher", plan.gmailWatcher)],
		["gmail-model", plan.gmailModel === "scheduled" ? {
			subsystem: "gmail-model",
			status: "scheduled"
		} : skipped("gmail-model", "not-configured")]
	]);
	return {
		record: (outcome) => {
			outcomes.set(outcome.subsystem, outcome);
		},
		snapshot: () => GATEWAY_STARTUP_SUBSYSTEMS.flatMap((subsystem) => {
			const outcome = outcomes.get(subsystem);
			return outcome ? [outcome] : [];
		})
	};
}
/** Format outcomes in canonical order regardless of collection order. */
function formatGatewayStartupOutcomes(outcomes) {
	const bySubsystem = new Map(outcomes.map((outcome) => [outcome.subsystem, outcome]));
	return `gateway startup outcomes: ${GATEWAY_STARTUP_SUBSYSTEMS.flatMap((subsystem) => {
		const outcome = bySubsystem.get(subsystem);
		if (!outcome) return [];
		const detail = "reason" in outcome ? ` (${outcome.reason})` : "";
		return `${outcome.subsystem}=${outcome.status}${detail}`;
	}).join("; ")}`;
}
//#endregion
//#region src/gateway/system-ca-warmup.ts
const SYSTEM_CA_WARMUP_WARNING_MS = 1e4;
const SYSTEM_CA_WORKER_SOURCE = String.raw`
  const { getCACertificates } = require("node:tls");
  const { parentPort } = require("node:worker_threads");

  try {
    const certificateCount = getCACertificates("default").length;
    parentPort.postMessage({ ok: true, certificateCount });
  } catch (error) {
    parentPort.postMessage({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    parentPort.close();
  }
`;
function isSystemCaWarmupMessage(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const message = value;
	return message.ok === true ? typeof message.certificateCount === "number" : message.ok === false && typeof message.error === "string";
}
function isWorkerPermissionDenied(error) {
	return typeof error === "object" && error !== null && "code" in error && error.code === "ERR_ACCESS_DENIED";
}
/** Warm Node's effective default CA set without blocking the gateway event loop on macOS. */
async function warmMacOSSystemCaOffMainThread(options = {}) {
	const env = options.env ?? process.env;
	if ((options.platform ?? process.platform) !== "darwin" || options.env === void 0 && options.platform === void 0 && isVitestRuntimeEnv(env)) return;
	let worker;
	try {
		worker = (options.createWorker ?? ((source, workerOptions) => new Worker(source, workerOptions)))(SYSTEM_CA_WORKER_SOURCE, { eval: true });
	} catch (error) {
		if (!isWorkerPermissionDenied(error)) throw error;
		options.log?.warn("macOS CA warmup skipped because Node denied worker-thread permission; trust settings will load lazily");
		return;
	}
	await new Promise((resolve, reject) => {
		let settled = false;
		const warningTimer = setTimeout(() => {
			options.log?.warn("macOS CA warmup is still waiting for default trust settings; gateway post-attach startup remains deferred");
		}, options.warningMs ?? SYSTEM_CA_WARMUP_WARNING_MS);
		warningTimer.unref?.();
		const settle = (finish) => {
			if (settled) return;
			settled = true;
			clearTimeout(warningTimer);
			worker.removeAllListeners();
			finish();
		};
		worker.once("message", (value) => {
			settle(() => {
				if (!isSystemCaWarmupMessage(value)) {
					reject(/* @__PURE__ */ new Error("macOS system CA warmup worker returned an invalid result"));
					return;
				}
				if (!value.ok) {
					reject(new Error(value.error));
					return;
				}
				resolve();
			});
		});
		worker.once("error", (error) => settle(() => reject(error)));
		worker.once("exit", (code) => {
			settle(() => reject(/* @__PURE__ */ new Error(`macOS system CA warmup worker exited before replying (code ${code})`)));
		});
		worker.unref();
	});
}
//#endregion
//#region src/gateway/server-startup-post-attach.ts
const ACP_BACKEND_READY_TIMEOUT_MS = 5e3;
const ACP_BACKEND_READY_POLL_MS = 50;
const PROVIDER_AUTH_PREWARM_START_DELAY_MS = 5e3;
const PROVIDER_AUTH_REWARM_DELAY_MS = 1e3;
const AGENT_RUNTIME_PLUGIN_PREWARM_START_DELAY_MS = 0;
const DEFERRED_SIDECAR_START_DELAY_MS = 100;
const SESSION_LOCK_CLEANUP_CONCURRENCY = 4;
const SKIP_STARTUP_MODEL_PREWARM_ENV = "OPENCLAW_SKIP_STARTUP_MODEL_PREWARM";
const QMD_STARTUP_IDLE_DELAY_MS = 12e4;
const loadMainSessionRestartRecoveryModule = createLazyRuntimeModule(() => import("./main-session-restart-recovery-DCHdN5ny.js"));
const loadAgentDefaultsModule = createLazyRuntimeModule(() => import("./defaults-RjT9WtG0.js"));
const loadAgentModelSelectionModule = createLazyRuntimeModule(() => import("./model-selection-Su90IYNf.js"));
const loadInternalHooksModule = createLazyRuntimeModule(() => import("./internal-hooks-C_OwtJqD.js"));
const loadGatewayRestartSentinelModule = createLazyRuntimeModule(() => import("./server-restart-sentinel-BSenIVbE.js"));
/** Stop sidecars immediately when shutdown has already started before they are reported. */
function stopPostReadySidecarsAfterCloseStarted(params) {
	if (!params.closeStarted) return;
	for (const postReadySidecar of params.postReadySidecars) postReadySidecar.stop();
}
/** Measure a post-attach startup step when tracing is active. */
async function measureStartup(startupTrace, name, run) {
	return startupTrace ? startupTrace.measure(name, run) : await run();
}
/** Measure provider-auth warming without letting event-loop stalls hide in wall time. */
async function measureProviderAuthWarm(run) {
	const eventLoopDelay = monitorEventLoopDelay({ resolution: 10 });
	eventLoopDelay.enable();
	const startMs = performance.now();
	try {
		await run();
	} finally {
		eventLoopDelay.disable();
	}
	return {
		elapsedMs: performance.now() - startMs,
		eventLoopMaxMs: eventLoopDelay.max / 1e6
	};
}
function formatProviderAuthWarmMetrics(metrics) {
	return `in ${metrics.elapsedMs.toFixed(0)}ms eventLoopMax=${metrics.eventLoopMaxMs.toFixed(1)}ms`;
}
function shouldCheckRestartSentinel(env = process.env) {
	return !env.VITEST && env.NODE_ENV !== "test";
}
function shouldSkipStartupModelPrewarm(env = process.env) {
	const raw = env[SKIP_STARTUP_MODEL_PREWARM_ENV]?.trim().toLowerCase();
	return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}
function resolveGatewayMemoryStartupPolicy(cfg) {
	if (cfg.memory?.backend !== "qmd") return { mode: "off" };
	const startup = cfg.memory.qmd?.update?.startup;
	if (startup === "immediate") return { mode: "immediate" };
	if (startup === "idle") {
		const rawDelayMs = cfg.memory.qmd?.update?.startupDelayMs;
		return {
			mode: "idle",
			delayMs: typeof rawDelayMs === "number" && Number.isFinite(rawDelayMs) && rawDelayMs >= 0 ? Math.floor(rawDelayMs) : QMD_STARTUP_IDLE_DELAY_MS
		};
	}
	return { mode: "off" };
}
function scheduleGatewayMemoryBackend(params) {
	if (params.policy.mode === "off") return;
	const start = () => {
		runWithGatewayIndependentRootWorkAdmission(async () => {
			const { startGatewayMemoryBackend } = await import("./server-startup-memory-1544Zx9s.js");
			await startGatewayMemoryBackend({
				cfg: params.cfg,
				log: params.log
			});
		}).catch((err) => {
			params.log.warn(`qmd memory startup initialization failed: ${String(err)}`);
		});
	};
	if (params.policy.mode === "immediate") {
		setImmediate(start);
		return;
	}
	setTimeout(start, params.policy.delayMs).unref?.();
}
function schedulePostAttachUpdateSentinelRefresh(params) {
	setImmediate(() => {
		runWithGatewayIndependentRootWorkAdmission(async () => {
			await measureStartup(params.startupTrace, "post-attach.update-sentinel", async () => {
				await params.refreshLatestUpdateRestartSentinel();
			});
		}).catch((err) => {
			params.log.warn(`restart sentinel refresh failed: ${String(err)}`);
		});
	}).unref?.();
}
function scheduleProviderAuthStatePrewarm(params) {
	let stopped = false;
	let startupTimer;
	let rewarmTimer;
	let rewarmInFlight = false;
	let pendingRewarmReason;
	const isStopped = () => stopped;
	const delayMs = params.delayMs ?? PROVIDER_AUTH_PREWARM_START_DELAY_MS;
	runWithGatewayIndependentRootWorkAdmission(async () => {
		const [{ setAuthProfileFailureHook }, { clearCurrentProviderAuthState }] = await Promise.all([import("./failure-hook-DL7zdDho.js"), import("./model-provider-auth-state-CKEnjneK.js")]);
		const loadProviderAuthWarmModule = () => import("./model-provider-auth-NEO_q1CZ.js");
		const runRewarm = async (reason) => {
			await runWithGatewayIndependentRootWorkAdmission(async () => {
				if (isStopped()) return;
				const cfg = params.getConfig();
				rewarmInFlight = true;
				try {
					const { warmCurrentProviderAuthStateOffMainThread } = await loadProviderAuthWarmModule();
					const metrics = await measureProviderAuthWarm(() => warmCurrentProviderAuthStateOffMainThread(cfg, { isCancelled: isStopped }));
					if (isStopped()) return;
					params.log.info(`provider auth state re-warmed (${reason}) ${formatProviderAuthWarmMetrics(metrics)}`);
				} catch (err) {
					params.log.warn(`provider auth state rewarm failed: ${String(err)}`);
				} finally {
					rewarmInFlight = false;
					const nextReason = pendingRewarmReason;
					pendingRewarmReason = void 0;
					if (nextReason && !isStopped()) scheduleAuthMapRewarm(nextReason);
				}
			});
		};
		const scheduleAuthMapRewarm = (reason) => {
			if (isStopped()) return;
			pendingRewarmReason = reason;
			if (rewarmTimer || rewarmInFlight) return;
			rewarmTimer = setTimeout(() => {
				rewarmTimer = void 0;
				const nextReason = pendingRewarmReason ?? reason;
				pendingRewarmReason = void 0;
				runRewarm(nextReason);
			}, PROVIDER_AUTH_REWARM_DELAY_MS);
			rewarmTimer.unref?.();
		};
		if (isStopped()) return;
		setAuthProfileFailureHook(() => {
			if (isStopped()) return;
			clearCurrentProviderAuthState();
			scheduleAuthMapRewarm("auth-profile-failure");
		});
		if (!params.startupWarmEnabled) return;
		startupTimer = setTimeout(() => {
			runWithGatewayIndependentRootWorkAdmission(async () => {
				if (isStopped()) return;
				const cfg = params.getConfig();
				const { warmCurrentProviderAuthStateOffMainThread } = await loadProviderAuthWarmModule();
				const metrics = await measureProviderAuthWarm(() => warmCurrentProviderAuthStateOffMainThread(cfg, { isCancelled: isStopped }));
				if (isStopped()) return;
				params.log.info(`provider auth state pre-warmed ${formatProviderAuthWarmMetrics(metrics)}`);
			}).catch((err) => {
				params.log.warn(`provider auth state pre-warm failed: ${String(err)}`);
			});
		}, Math.max(0, delayMs));
		startupTimer.unref?.();
	}).catch((err) => {
		params.log.warn(`provider auth state pre-warm setup failed: ${String(err)}`);
	});
	return { stop: () => {
		stopped = true;
		if (startupTimer) {
			clearTimeout(startupTimer);
			startupTimer = void 0;
		}
		if (rewarmTimer) {
			clearTimeout(rewarmTimer);
			rewarmTimer = void 0;
		}
	} };
}
function scheduleAgentRuntimePluginPrewarm(params) {
	let stopped = false;
	let timer;
	const isStopped = () => stopped;
	timer = setTimeout(() => {
		timer = void 0;
		runWithGatewayIndependentRootWorkAdmission(async () => {
			await measureStartup(params.startupTrace, "post-ready.agent-runtime-plugins", async () => {
				if (isStopped()) return;
				const started = performance.now();
				const { ensureRuntimePluginsLoaded } = await import("./runtime-plugins-D1pXHub-.js");
				const cfg = params.getConfig();
				if (isStopped()) return;
				ensureRuntimePluginsLoaded({
					config: cfg,
					workspaceDir: params.workspaceDir,
					allowGatewaySubagentBinding: true
				});
				if (!isStopped()) params.log.info(`agent runtime plugins pre-warmed in ${(performance.now() - started).toFixed(0)}ms`);
			});
		}).catch((err) => {
			params.log.warn(`agent runtime plugin pre-warm failed: ${String(err)}`);
		});
	}, Math.max(0, params.delayMs ?? AGENT_RUNTIME_PLUGIN_PREWARM_START_DELAY_MS));
	timer.unref?.();
	return { stop: () => {
		stopped = true;
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
	} };
}
function schedulePostReadySidecarTask(params) {
	let stopped = false;
	const abortController = new AbortController();
	const isStopped = () => stopped;
	const handle = setImmediate(() => {
		if (isStopped()) return;
		runWithGatewayIndependentRootWorkAdmission(async () => {
			await measureStartup(params.startupTrace, params.name, () => params.run(isStopped, abortController.signal));
		}).catch((err) => {
			params.log.warn(`${params.name} failed after gateway ready: ${String(err)}`);
		});
	});
	handle.unref?.();
	return { stop: async () => {
		stopped = true;
		abortController.abort();
		clearImmediate(handle);
		await params.stop?.();
	} };
}
function scheduleRestartSentinelWakeAfterReady(params) {
	setTimeout(() => {
		runWithGatewayIndependentRootWorkAdmission(async () => {
			const { scheduleRestartSentinelWake } = await loadGatewayRestartSentinelModule();
			await scheduleRestartSentinelWake({ deps: params.deps });
		}).catch((err) => {
			params.log.warn(`restart sentinel wake failed to schedule: ${String(err)}`);
		});
	}, 750);
}
async function cleanupStaleSessionLocks(params) {
	const concurrency = Math.max(1, Math.min(params.sessionDirs.length, Math.floor(params.concurrency ?? SESSION_LOCK_CLEANUP_CONCURRENCY)));
	let markRestartAbortedMainSessionsFromLocks = params.markRestartAbortedMainSessionsFromLocks ?? null;
	const getMarker = async () => {
		markRestartAbortedMainSessionsFromLocks ??= (await loadMainSessionRestartRecoveryModule()).markRestartAbortedMainSessionsFromLocks;
		return markRestartAbortedMainSessionsFromLocks;
	};
	await pMap(params.sessionDirs, async (sessionsDir) => {
		if (params.isStopped()) return;
		const result = await params.cleanStaleLockFiles({
			sessionsDir,
			config: params.cfg,
			removeStale: true,
			log: { warn: (message) => params.log.warn(message) }
		});
		if (result.cleaned.length === 0) return;
		await (await getMarker())({
			sessionsDir,
			cleanedLocks: result.cleaned
		});
	}, {
		concurrency,
		stopOnError: true
	});
}
function scheduleTranscriptsAutoStartSidecar(params) {
	let stopTranscriptsAutoStart;
	return schedulePostReadySidecarTask({
		startupTrace: params.startupTrace,
		name: "sidecars.transcripts-auto-start",
		log: params.log,
		run: async (isStopped) => {
			const { createTranscriptsAutoStartService } = await import("./transcripts-tool-DXKuTOF-.js");
			if (isStopped()) return;
			const service = createTranscriptsAutoStartService({
				config: params.cfg,
				stateDir: resolveStateDir(),
				logger: params.log
			});
			stopTranscriptsAutoStart = () => service.stop();
			service.start();
		},
		stop: async () => {
			await stopTranscriptsAutoStart?.();
		}
	});
}
async function hasRestartSentinelFast(env = process.env) {
	return await hasRestartSentinel(env);
}
async function refreshLatestUpdateRestartSentinelIfPresent() {
	if (!await hasRestartSentinelFast()) return null;
	return await (await loadGatewayRestartSentinelModule()).refreshLatestUpdateRestartSentinel();
}
function hasGatewayStartHooks(pluginRegistry) {
	return pluginRegistry.typedHooks.some((hook) => hook.hookName === "gateway_start");
}
async function hasGatewayStartupInternalHookListeners() {
	const { hasInternalHookListeners } = await loadInternalHooksModule();
	return hasInternalHookListeners("gateway", "startup");
}
async function waitForAcpRuntimeBackendReady(params) {
	const { getAcpRuntimeBackend } = await import("./registry-D_VYQekE.js");
	const timeoutMs = params.timeoutMs ?? ACP_BACKEND_READY_TIMEOUT_MS;
	const pollMs = params.pollMs ?? ACP_BACKEND_READY_POLL_MS;
	const deadline = Date.now() + timeoutMs;
	do {
		const backend = getAcpRuntimeBackend(params.backendId);
		if (backend) try {
			if (!backend.healthy || backend.healthy()) return true;
		} catch {}
		await setTimeout$1(pollMs, void 0, { ref: false });
	} while (Date.now() < deadline);
	return false;
}
async function prewarmConfiguredPrimaryModel(params) {
	await publishConfiguredModelRuntimeSnapshots(params);
}
async function publishConfiguredModelRuntimeSnapshots(params) {
	const { refreshPreparedModelRuntimeSnapshots } = await import("./prepared-model-runtime-DBR-Doae.js");
	await refreshPreparedModelRuntimeSnapshots(params.cfg, {
		gatewayLifecycle: true,
		...params.workspaceDir ? { defaultWorkspaceDir: params.workspaceDir } : {}
	});
}
async function publishStartupModelRuntime(params, prewarm = prewarmConfiguredPrimaryModel) {
	await (shouldSkipStartupModelPrewarm() ? publishConfiguredModelRuntimeSnapshots : prewarm)(params);
}
/** Start post-ready sidecars such as channels, hooks, plugin services, and cleanup tasks. */
async function startGatewaySidecars(params) {
	const postReadySidecars = [];
	const internalHooksConfigured = hasConfiguredInternalHooks(params.cfg);
	await measureStartup(params.startupTrace, "sidecars.internal-hooks", async () => {
		try {
			if (internalHooksConfigured) {
				const [{ setInternalHooksEnabled }, { loadInternalHooks }] = await Promise.all([loadInternalHooksModule(), import("./loader-CeekxFDn.js")]);
				setInternalHooksEnabled(params.cfg.hooks?.internal?.enabled !== false);
				const loadedCount = await loadInternalHooks(params.cfg, params.defaultWorkspaceDir);
				if (loadedCount > 0) {
					params.startupOutcomes?.record({
						subsystem: "internal-hooks",
						status: "loaded"
					});
					params.logHooks.info(`loaded ${loadedCount} internal hook handler${loadedCount > 1 ? "s" : ""}`);
				} else params.startupOutcomes?.record({
					subsystem: "internal-hooks",
					status: "skipped",
					reason: "no-handlers-loaded"
				});
			}
		} catch (err) {
			params.startupOutcomes?.record({
				subsystem: "internal-hooks",
				status: "failed",
				reason: "see earlier log"
			});
			params.logHooks.error(`failed to load hooks: ${String(err)}`);
		}
	});
	const skipChannels = isTruthyEnvValue(process.env.OPENCLAW_SKIP_CHANNELS) || isTruthyEnvValue(process.env.OPENCLAW_SKIP_PROVIDERS);
	await measureStartup(params.startupTrace, "sidecars.model-runtime", () => publishStartupModelRuntime({
		cfg: params.cfg,
		workspaceDir: params.defaultWorkspaceDir,
		log: params.log
	}, params.prewarmPrimaryModel));
	await measureStartup(params.startupTrace, "sidecars.main-session-recovery", async () => {
		try {
			const { markStartupOrphanedMainSessionsForRecovery } = await loadMainSessionRestartRecoveryModule();
			await markStartupOrphanedMainSessionsForRecovery({ cfg: params.cfg });
		} catch (err) {
			params.log.warn(`main-session startup orphan marking failed before channel startup: ${String(err)}`);
		}
	});
	await measureStartup(params.startupTrace, "sidecars.channels", async () => {
		if (!skipChannels) try {
			await measureStartup(params.startupTrace, "sidecars.channel-start", () => params.startChannels());
		} catch (err) {
			params.logChannels.error(`channel startup failed: ${String(err)}`);
		}
		else await measureStartup(params.startupTrace, "sidecars.channel-skip", () => params.logChannels.info("skipping channel start (OPENCLAW_SKIP_CHANNELS=1 or OPENCLAW_SKIP_PROVIDERS=1)"));
	});
	await params.onChannelsStarted?.();
	let pluginServices = params.shouldStartPluginServices?.() === false ? null : await measureStartup(params.startupTrace, "sidecars.plugin-services", async () => {
		try {
			const { startPluginServices } = await import("./services-B4rq9SdI.js");
			return await startPluginServices({
				registry: params.pluginRegistry,
				config: params.cfg,
				workspaceDir: params.defaultWorkspaceDir,
				startupTrace: params.startupTrace,
				broadcastPluginEvent: params.broadcastPluginEvent
			});
		} catch (err) {
			params.log.warn(`plugin services failed to start: ${String(err)}`);
			return null;
		}
	});
	if (pluginServices && params.shouldStartPluginServices?.() === false) {
		await pluginServices.stop().catch((err) => {
			params.log.warn(`plugin services stop after close failed: ${String(err)}`);
		});
		pluginServices = null;
	}
	params.onPluginServices?.(pluginServices);
	if (internalHooksConfigured || await hasGatewayStartupInternalHookListeners()) {
		params.startupOutcomes?.record({
			subsystem: "internal-startup-hook",
			status: "scheduled"
		});
		setTimeout(() => {
			runWithGatewayIndependentRootWorkAdmission(async () => {
				const { createInternalHookEvent, triggerInternalHook } = await loadInternalHooksModule();
				await triggerInternalHook(createInternalHookEvent("gateway", "startup", "gateway:startup", {
					cfg: params.cfg,
					deps: params.deps,
					workspaceDir: params.defaultWorkspaceDir
				}));
			}).catch((err) => {
				params.logHooks.warn(`gateway startup hook failed: ${String(err)}`);
			});
		}, 250);
	}
	if (params.cfg.acp?.enabled) runWithGatewayIndependentRootWorkAdmission(async () => {
		const ready = await measureStartup(params.startupTrace, "sidecars.acp.runtime-ready", () => waitForAcpRuntimeBackendReady({ backendId: params.cfg.acp?.backend }));
		params.startupTrace?.detail("sidecars.acp.runtime-ready", [["readyCount", ready ? 1 : 0], ["backend", params.cfg.acp?.backend ?? "default"]]);
		await measureStartup(params.startupTrace, "sidecars.acp.identity-reconcile", async () => {
			const [{ getAcpSessionManager }, { ACP_SESSION_IDENTITY_RENDERER_VERSION }] = await Promise.all([import("./acp/control-plane/manager.js"), import("./acp-core/runtime/session-identifiers.js")]);
			const result = await getAcpSessionManager().reconcilePendingSessionIdentities({ cfg: params.cfg });
			if (result.checked === 0) return;
			params.log.warn(`acp startup identity reconcile (renderer=${ACP_SESSION_IDENTITY_RENDERER_VERSION}): checked=${result.checked} resolved=${result.resolved} failed=${result.failed}`);
		});
	}).catch((err) => {
		params.log.warn(`acp startup identity reconcile failed: ${String(err)}`);
	});
	await measureStartup(params.startupTrace, "sidecars.memory", async () => {
		const policy = resolveGatewayMemoryStartupPolicy(params.cfg);
		if (policy.mode === "off") return;
		scheduleGatewayMemoryBackend({
			cfg: params.cfg,
			log: params.log,
			policy
		});
	});
	schedulePostReadySidecarTask({
		startupTrace: params.startupTrace,
		name: "sidecars.session-locks",
		log: params.log,
		run: async (isStopped) => {
			try {
				const [{ resolveAgentSessionDirs }, { cleanStaleLockFiles }] = await Promise.all([import("./session-dirs-BUmx3Yg2.js"), import("./session-write-lock-B2043D-B.js")]);
				await cleanupStaleSessionLocks({
					sessionDirs: await resolveAgentSessionDirs(resolveStateDir(process.env)),
					cfg: params.cfg,
					log: params.log,
					isStopped,
					cleanStaleLockFiles
				});
			} catch (err) {
				params.log.warn(`session lock cleanup failed on startup: ${String(err)}`);
			}
		}
	});
	schedulePostReadySidecarTask({
		startupTrace: params.startupTrace,
		name: "sidecars.restart-sentinel",
		log: params.log,
		run: async () => {
			if (!shouldCheckRestartSentinel()) return;
			if (!await hasRestartSentinelFast()) return;
			scheduleRestartSentinelWakeAfterReady({
				deps: params.deps,
				log: params.log
			});
		}
	});
	if (params.cfg.hooks?.enabled && params.cfg.hooks.gmail?.account) postReadySidecars.push(schedulePostReadySidecarTask({
		startupTrace: params.startupTrace,
		name: "sidecars.gmail-watch",
		log: params.log,
		run: async (isStopped, signal) => {
			const { startGmailWatcherWithLogs } = await import("./gmail-watcher-lifecycle-B1flU0TW.js");
			if (isStopped()) return;
			await startGmailWatcherWithLogs({
				cfg: params.cfg,
				log: params.logHooks,
				isCancelled: isStopped,
				signal
			});
		}
	}));
	if (params.cfg.hooks?.gmail?.model) postReadySidecars.push(schedulePostReadySidecarTask({
		startupTrace: params.startupTrace,
		name: "sidecars.gmail-model",
		log: params.log,
		run: async (isStopped) => {
			const [{ DEFAULT_MODEL, DEFAULT_PROVIDER }, { loadPreparedModelCatalog }, { getModelRefStatus, resolveConfiguredModelRef, resolveHooksGmailModel }] = await Promise.all([
				loadAgentDefaultsModule(),
				import("./prepared-model-catalog-C7ceMjSu.js"),
				loadAgentModelSelectionModule()
			]);
			if (isStopped()) return;
			const hooksModelRef = resolveHooksGmailModel({
				cfg: params.cfg,
				defaultProvider: DEFAULT_PROVIDER
			});
			if (hooksModelRef) {
				const { provider: resolvedDefaultProvider, model: defaultModel } = resolveConfiguredModelRef({
					cfg: params.cfg,
					defaultProvider: DEFAULT_PROVIDER,
					defaultModel: DEFAULT_MODEL
				});
				const catalog = await loadPreparedModelCatalog({ config: params.cfg });
				const status = getModelRefStatus({
					cfg: params.cfg,
					catalog,
					ref: hooksModelRef,
					defaultProvider: resolvedDefaultProvider,
					defaultModel
				});
				if (!status.allowed) params.logHooks.warn(`hooks.gmail.model "${status.key}" not allowed by agents.defaults.modelPolicy.allow (will use primary instead)`);
				if (!status.inCatalog) params.logHooks.warn(`hooks.gmail.model "${status.key}" not in the model catalog (may fail at runtime)`);
			}
		}
	}));
	return {
		pluginServices,
		postReadySidecars
	};
}
const defaultGatewayPostAttachRuntimeDeps = {
	getGlobalHookRunner: async () => (await import("./plugins/hook-runner-global.js")).getGlobalHookRunner(),
	logGatewayStartup: async (params) => (await import("./server-startup-log-Ccd3K3jl.js")).logGatewayStartup(params),
	refreshLatestUpdateRestartSentinel: refreshLatestUpdateRestartSentinelIfPresent,
	scheduleGatewayUpdateCheck: async (...args) => (await import("./update-startup-DxvFd2YL.js")).scheduleGatewayUpdateCheck(...args),
	startGatewaySidecars,
	warmSystemCa: warmMacOSSystemCaOffMainThread,
	startGatewayTailscaleExposure: async (...args) => (await import("./server-tailscale-CyN2h6Gq.js")).startGatewayTailscaleExposure(...args)
};
function createDeferredGatewayUpdateCheck(params) {
	let started = false;
	let stopped = false;
	let stopUpdateCheck = null;
	const stop = () => {
		stopped = true;
		stopUpdateCheck?.();
		stopUpdateCheck = null;
	};
	const start = () => {
		if (started || stopped) return;
		started = true;
		setImmediate(() => {
			if (stopped) return;
			runWithGatewayIndependentRootWorkAdmission(async () => await measureStartup(params.startupTrace, "post-attach.update-check", () => params.runtimeDeps.scheduleGatewayUpdateCheck({
				cfg: params.cfg,
				log: params.log,
				isNixMode: params.isNixMode,
				onUpdateAvailableChange: (updateAvailable) => {
					const payload = { updateAvailable };
					params.broadcast(GATEWAY_EVENT_UPDATE_AVAILABLE, payload, { dropIfSlow: true });
				}
			}))).then((nextStop) => {
				if (stopped) {
					nextStop();
					return;
				}
				stopUpdateCheck = nextStop;
			}).catch((err) => {
				if (stopped) return;
				params.log.warn(`gateway update check failed to start: ${String(err)}`);
			});
		});
	};
	return {
		start,
		stop
	};
}
/** Start work that depends on the HTTP server being attached and visible. */
async function startGatewayPostAttachRuntime(params, runtimeDeps = defaultGatewayPostAttachRuntimeDeps) {
	if (!params.minimalTestGateway) await measureStartup(params.startupTrace, "post-attach.system-ca", () => runtimeDeps.warmSystemCa({ log: params.log }));
	let pluginRegistry = params.pluginRegistry;
	let startupPluginsLoaded = false;
	let startupPluginsLoadPromise = null;
	const loadStartupPluginsIfNeeded = async () => {
		if (params.minimalTestGateway || !params.loadStartupPlugins) return {
			pluginRegistry,
			gatewayMethods: []
		};
		if (startupPluginsLoaded) return {
			pluginRegistry,
			gatewayMethods: []
		};
		startupPluginsLoadPromise ??= (async () => {
			params.onStartupPluginsLoading?.();
			const loaded = await measureStartup(params.startupTrace, "plugins.runtime-post-bind", () => params.loadStartupPlugins());
			pluginRegistry = loaded.pluginRegistry;
			startupPluginsLoaded = true;
			params.startupTrace?.detail("plugins.runtime-post-bind", [["loadedPluginCount", pluginRegistry.plugins.filter((plugin) => plugin.status === "loaded").length], ["gatewayMethodCount", loaded.gatewayMethods.length]]);
			await params.onStartupPluginsLoaded?.(loaded);
			return loaded;
		})();
		return await startupPluginsLoadPromise;
	};
	await loadStartupPluginsIfNeeded();
	const memoryStartupPolicy = resolveGatewayMemoryStartupPolicy(params.gatewayPluginConfigAtStart);
	const startupOutcomes = createGatewayStartupOutcomeRecorder({
		cfg: params.gatewayPluginConfigAtStart,
		gatewayStartHooks: hasGatewayStartHooks(pluginRegistry),
		memoryStartupMode: memoryStartupPolicy.mode
	});
	const startupLogPromise = measureStartup(params.startupTrace, "post-attach.log", () => runtimeDeps.logGatewayStartup({
		cfg: params.cfgAtStart,
		activationSourceConfig: params.activationSourceConfig,
		bindHost: params.bindHost,
		bindHosts: params.bindHosts,
		port: params.port,
		tlsEnabled: params.tlsEnabled,
		loadedPluginIds: pluginRegistry.plugins.filter((plugin) => plugin.status === "loaded").map((plugin) => plugin.id),
		log: params.log,
		isNixMode: params.isNixMode,
		startupStartedAt: params.startupStartedAt
	}));
	const updateCheck = params.minimalTestGateway ? {
		start: () => {},
		stop: () => {}
	} : createDeferredGatewayUpdateCheck({
		startupTrace: params.startupTrace,
		runtimeDeps,
		cfg: params.cfgAtStart,
		log: params.log,
		isNixMode: params.isNixMode,
		broadcast: params.broadcast
	});
	const tailscaleCleanupPromise = params.minimalTestGateway ? Promise.resolve(null) : params.tailscaleMode === "off" && !params.resetOnExit ? Promise.resolve(null) : measureStartup(params.startupTrace, "post-attach.tailscale", () => runtimeDeps.startGatewayTailscaleExposure({
		tailscaleMode: params.tailscaleMode,
		resetOnExit: params.resetOnExit,
		serviceName: params.serviceName,
		preserveFunnel: params.preserveFunnel,
		port: params.port,
		controlUiBasePath: params.controlUiBasePath,
		logTailscale: params.logTailscale
	}));
	let pluginServicesReported = false;
	let reportedPluginServices = null;
	const reportPluginServices = (pluginServices) => {
		pluginServicesReported = true;
		reportedPluginServices = pluginServices;
		params.onPluginServices?.(pluginServices);
	};
	const waitForSidecarStartTurn = () => new Promise((resolve) => {
		if (params.sidecarStartup === "defer") {
			setTimeout(resolve, DEFERRED_SIDECAR_START_DELAY_MS).unref?.();
			return;
		}
		setImmediate(resolve);
	});
	const sidecarsPromise = params.minimalTestGateway ? Promise.resolve({
		pluginServices: null,
		pluginRegistry,
		postReadySidecars: []
	}) : waitForSidecarStartTurn().then(async () => {
		await loadStartupPluginsIfNeeded();
		const workerEnvironmentSidecar = params.isClosing?.() ? null : await params.startWorkerEnvironmentRuntime?.() ?? null;
		params.log.info("starting channels and sidecars...");
		const loaderStatsBefore = getPluginModuleLoaderStats();
		const result = await (async () => {
			try {
				return await measureStartup(params.startupTrace, "sidecars.total", () => runtimeDeps.startGatewaySidecars({
					cfg: params.gatewayPluginConfigAtStart,
					pluginRegistry,
					defaultWorkspaceDir: params.defaultWorkspaceDir,
					deps: params.deps,
					startChannels: params.startChannels,
					log: params.log,
					logHooks: params.logHooks,
					logChannels: params.logChannels,
					startupTrace: params.startupTrace,
					onChannelsStarted: params.onChannelsStarted,
					onPluginServices: reportPluginServices,
					shouldStartPluginServices: () => params.isClosing?.() !== true,
					broadcastPluginEvent: params.broadcastPluginEvent,
					startupOutcomes
				}));
			} catch (error) {
				await workerEnvironmentSidecar?.stop();
				throw error;
			}
		})();
		const loaderStatsAfter = getPluginModuleLoaderStats();
		params.startupTrace?.detail("sidecars.plugin-loader", [
			["callsCount", loaderStatsAfter.calls - loaderStatsBefore.calls],
			["nativeHitsCount", loaderStatsAfter.nativeHits - loaderStatsBefore.nativeHits],
			["nativeMissesCount", loaderStatsAfter.nativeMisses - loaderStatsBefore.nativeMisses],
			["sourceTransformForcedCount", loaderStatsAfter.sourceTransformForced - loaderStatsBefore.sourceTransformForced],
			["sourceTransformFallbacksCount", loaderStatsAfter.sourceTransformFallbacks - loaderStatsBefore.sourceTransformFallbacks]
		]);
		try {
			const { scheduleRestartAbortedMainSessionRecovery } = await loadMainSessionRestartRecoveryModule();
			scheduleRestartAbortedMainSessionRecovery({
				cfg: params.cfgAtStart,
				gatewayRuntime: params.recoveryRuntime
			});
		} catch (err) {
			params.log.warn(`main-session restart recovery failed to schedule: ${String(err)}`);
		}
		try {
			const { scheduleSubagentOrphanRecovery } = await import("./subagent-registry-C96xk-8n.js");
			scheduleSubagentOrphanRecovery();
		} catch (err) {
			params.log.warn(`subagent restart recovery failed to schedule: ${String(err)}`);
		}
		for (const method of STARTUP_UNAVAILABLE_GATEWAY_METHODS) params.unavailableGatewayMethods.delete(method);
		if (!pluginServicesReported) reportPluginServices(result.pluginServices);
		const postReadySidecars = [...result.postReadySidecars];
		const gatewayLifetimeSidecars = [scheduleContextCachePrewarm(params)];
		if (workerEnvironmentSidecar) gatewayLifetimeSidecars.push(workerEnvironmentSidecar);
		if (params.agentRuntimePluginPrewarm?.enabled !== false) gatewayLifetimeSidecars.push(scheduleAgentRuntimePluginPrewarm({
			getConfig: params.agentRuntimePluginPrewarm?.getConfig ?? params.providerAuthPrewarm?.getConfig ?? (() => params.gatewayPluginConfigAtStart),
			workspaceDir: params.defaultWorkspaceDir,
			startupTrace: params.startupTrace,
			log: params.log,
			delayMs: params.agentRuntimePluginPrewarm?.delayMs
		}));
		if (params.providerAuthPrewarm && params.providerAuthPrewarm.enabled !== false) gatewayLifetimeSidecars.push(scheduleProviderAuthStatePrewarm({
			getConfig: params.providerAuthPrewarm.getConfig ?? (() => params.cfgAtStart),
			log: params.log,
			delayMs: params.providerAuthPrewarm.delayMs,
			startupWarmEnabled: params.providerAuthPrewarm.enabled === true
		}));
		if (params.gatewayPluginConfigAtStart.transcripts?.autoStart?.length) gatewayLifetimeSidecars.push(scheduleTranscriptsAutoStartSidecar({
			cfg: params.gatewayPluginConfigAtStart,
			startupTrace: params.startupTrace,
			log: params.log
		}));
		params.onPostReadySidecars?.(postReadySidecars);
		params.onGatewayLifetimeSidecars?.(gatewayLifetimeSidecars);
		params.log.info(formatGatewayStartupOutcomes(startupOutcomes.snapshot()));
		params.onSidecarsReady?.();
		params.startupTrace?.detail("sidecars.ready", [["loadedPluginCount", pluginRegistry.plugins.filter((plugin) => plugin.status === "loaded").length], ["postReadySidecarCount", postReadySidecars.length + gatewayLifetimeSidecars.length]]);
		params.startupTrace?.mark("sidecars.ready");
		if (params.sidecarStartup !== "defer") params.log.info("gateway ready");
		return {
			...result,
			postReadySidecars,
			gatewayLifetimeSidecars,
			pluginRegistry
		};
	});
	sidecarsPromise.then(async (sidecarsResult) => {
		if (params.minimalTestGateway) return;
		schedulePostAttachUpdateSentinelRefresh({
			startupTrace: params.startupTrace,
			log: params.log,
			refreshLatestUpdateRestartSentinel: runtimeDeps.refreshLatestUpdateRestartSentinel
		});
		setImmediate(() => {
			sweepSessionStateWatchNotices();
		}).unref?.();
		if (!hasGatewayStartHooks(sidecarsResult.pluginRegistry)) return;
		await new Promise((resolve) => {
			setImmediate(resolve);
		});
		const hookRunner = await runtimeDeps.getGlobalHookRunner();
		if (hookRunner?.hasHooks("gateway_start")) {
			const { withPluginHttpRouteRegistry } = await import("./http-registry-B-jFvyrr.js");
			runWithGatewayIndependentRootWorkAdmission(async () => {
				await withPluginHttpRouteRegistry(sidecarsResult.pluginRegistry, () => hookRunner.runGatewayStart({ port: params.port }, {
					port: params.port,
					config: params.gatewayPluginConfigAtStart,
					workspaceDir: params.defaultWorkspaceDir,
					getCron: () => params.getCronService?.() ?? params.deps.cron
				}));
			}).catch((err) => {
				params.log.warn(`gateway_start hook failed: ${String(err)}`);
			});
		}
	}).catch((err) => {
		params.log.warn(`gateway sidecars failed to start: ${String(err)}`);
	});
	if (params.sidecarStartup !== "defer") {
		const [, tailscaleCleanup, sidecarsResult] = await Promise.all([
			startupLogPromise,
			tailscaleCleanupPromise,
			sidecarsPromise
		]);
		updateCheck.start();
		return {
			stopGatewayUpdateCheck: updateCheck.stop,
			tailscaleCleanup,
			pluginServices: sidecarsResult.pluginServices
		};
	}
	const [, tailscaleCleanup] = await Promise.all([startupLogPromise, tailscaleCleanupPromise]);
	updateCheck.start();
	return {
		stopGatewayUpdateCheck: updateCheck.stop,
		tailscaleCleanup,
		pluginServices: reportedPluginServices
	};
}
const testing = {
	agentRuntimePluginPrewarmStartDelayMs: AGENT_RUNTIME_PLUGIN_PREWARM_START_DELAY_MS,
	providerAuthPrewarmStartDelayMs: PROVIDER_AUTH_PREWARM_START_DELAY_MS,
	hasRestartSentinelFast,
	prewarmConfiguredPrimaryModel,
	publishConfiguredModelRuntimeSnapshots,
	publishStartupModelRuntime,
	refreshLatestUpdateRestartSentinelIfPresent,
	resolveGatewayMemoryStartupPolicy,
	cleanupStaleSessionLocks,
	scheduleProviderAuthStatePrewarm,
	scheduleRestartSentinelWakeAfterReady,
	shouldSkipStartupModelPrewarm,
	stopPostReadySidecarsAfterCloseStarted
};
//#endregion
export { testing as __testing, testing, startGatewayPostAttachRuntime, startGatewaySidecars, stopPostReadySidecarsAfterCloseStarted };
