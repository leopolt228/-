import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { p as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-Crk_c9KW.js";
import { T as freezeDiagnosticTraceContext, f as isDiagnosticsEnabled, o as emitTrustedDiagnosticEvent, x as createChildDiagnosticTraceContext } from "./diagnostic-events-Dt41CZkD.js";
import { t as resolveNonNegativeNumber } from "./number-coercion-IpMOa8nH.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-B7OGjVYg.js";
import { b as resolveSubagentModelConfigSelectionResult } from "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { S as isCronSessionKey } from "./session-key-Drrs61Fd.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-S7z_Yn4H.js";
import { a as logWarn } from "./logger-DT9z6GgH.js";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-Cq9SwNpx.js";
import { a as getRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot, x as selectApplicableRuntimeConfig } from "./runtime-snapshot-BW7iP5ad.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { n as isThinkingLevelSupported, o as resolveSupportedThinkingLevel } from "./thinking-DDtbvjQ1.js";
import { s as normalizeThinkLevel } from "./thinking.shared-BWnbgBUO.js";
import { p as normalizeModelSelection, v as resolveConfiguredModelPolicyAllow, w as findModelInCatalog, x as resolveHooksGmailModel, y as resolveConfiguredModelRef } from "./model-selection-shared-CPPxIJAX.js";
import "./config-BOMcY2yX.js";
import { C as releaseAgentRunContext, O as withAgentRunLifecycleGeneration, a as consumeCronNextCheckProposal, m as getAgentRunContext, p as getAgentEventLifecycleGeneration, r as claimAgentRunContext, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Dg0sI2pr.js";
import { Ut as deriveSessionTotalTokens, Vt as deriveContextPromptTokens, Wt as hasNonzeroUsage } from "./session-accessor-Mu3lv_Tl.js";
import { t as formatSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import { S as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE, U as setSessionRuntimeModel, bt as beginSessionWorkAdmission, w as isAgentHarnessSessionKey, x as AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE } from "./store-DDuGv_UJ.js";
import { t as hasAnyAuthProfileStoreSource } from "./source-check-D7qXDGS3.js";
import { n as resolveAllowedModelRef, t as getModelRefStatus } from "./model-selection-resolve-DBp2V5If.js";
import { t as resolveThinkingDefault } from "./model-thinking-default-Bn7kjmzP.js";
import { t as isCliProvider } from "./model-selection-cli-DOykA-i1.js";
import { n as loadPreparedModelCatalog } from "./prepared-model-catalog-CoGiwhz3.js";
import { d as ensureAgentWorkspace } from "./workspace-GYctLxSN.js";
import { f as expandToolGroups, m as normalizeToolName } from "./tool-policy-GYMCyycR.js";
import { i as createAgentRunRestartAbortError } from "./run-termination-BQ_P-sPi.js";
import { n as resolveAgentTimeoutMs } from "./timeout-BEGWfRGM.js";
import { a as resolveCronDeliverySessionKey, n as isDetachedCronSessionTarget } from "./session-target-DJsUULzX.js";
import { i as isSilentReplyPayloadText, t as HEARTBEAT_TOKEN } from "./tokens-DKI4eGAu.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-Vx3ij-ME.js";
import { r as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-CGtM0hst.js";
import { r as resolveEffectiveAgentRuntime } from "./thinking-runtime-g8O2MT43.js";
import { t as resolveCronAgentSessionKey } from "./session-key-BRBN4bbo.js";
import { d as isCommandLaneTaskTimeoutError } from "./command-queue-B2fMJE4M.js";
import { l as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-ChkvrkDs.js";
import "./agent-bundle-mcp-tools-DaXqeeyj.js";
import { C as hasAcceptedSessionSpawn, s as hasCommittedMessagingToolDeliveryEvidence, x as resolveSourceDeliveryOutcome } from "./delivery-evidence-DV3bbMhs.js";
import { t as removeCronRunContinuationSessionIfIdle } from "./cron-run-continuation-cleanup-CQsZgw8_.js";
import { o as resolveCronAbortReasonText } from "./execution-errors-zetyeuvZ.js";
import { n as mapHookExternalContentSource, r as resolveHookExternalContentSource, t as isExternalHookSession } from "./external-content-source-CzLOB3HH.js";
import { n as resolveCronStyleNow } from "./current-time-sWC78VoB.js";
import { n as resolveCronDeliveryPlan, t as hasExplicitCronDeliveryTarget } from "./delivery-plan-DNk_xIW4.js";
import { t as createDiagnosticMessageLifecycle } from "./message-lifecycle-CpdyxtPU.js";
import { i as mergeCronRunDiagnostics, n as createCronRunDiagnosticsFromError, r as createCronRunDiagnosticsFromMissingWebSearchProvider, s as toolsAllowRequestsWebSearch, t as createCronRunDiagnosticsFromAgentResult } from "./run-diagnostics-BdlDOlTp.js";
import { i as resolveCronPreflightCandidates, s as resolveCronChannelOutputPolicy, t as resolveCronSourceDeliveryPlan } from "./source-delivery-fallback-DFAB3Epk.js";
import { a as markCronSessionPreRun, c as resolveCronLifecycleRevisionIdentity, i as createPersistCronSessionEntry, m as resolveHeartbeatAckMaxChars, n as adoptCronRunSessionMetadata, o as persistCronSkillsSnapshotIfChanged, p as resolveCronPayloadOutcome, r as createCronRunContinuationSession, s as projectCronOwnershipFields, t as CronSessionLifecycleClaimError, u as isHeartbeatOnlyResponse } from "./run-session-state-BkyW25dE.js";
import { t as cleanupCronRunSessionAfterRun } from "./session-cleanup-NffXsU2i.js";
import { n as resolveCronSession, t as loadCronSessionEntryLatest } from "./session-BU2LrFuw.js";
import { isDeepStrictEqual } from "node:util";
//#region src/skills/runtime/cron-snapshot.ts
const skillsSnapshotRuntimeLoader = createLazyImportLoader(() => import("./cron-snapshot.runtime.js"));
async function loadSkillsSnapshotRuntime() {
	return await skillsSnapshotRuntimeLoader.load();
}
async function resolveCronSkillsSnapshot(params) {
	if (params.isFastTestEnv) return params.existingSnapshot ?? {
		prompt: "",
		skills: []
	};
	const runtime = await loadSkillsSnapshotRuntime();
	const skillFilter = runtime.resolveEffectiveAgentSkillFilter(params.config, params.agentId);
	const nodeSkills = runtime.resolveNodeExecEligibility({
		cfg: params.config,
		agentId: params.agentId
	});
	return runtime.resolveReusableWorkspaceSkillSnapshot({
		workspaceDir: params.workspaceDir,
		config: params.config,
		agentId: params.agentId,
		existingSnapshot: params.existingSnapshot,
		skillFilter,
		eligibility: {
			nodeSkills,
			remote: runtime.getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec })
		},
		watch: false,
		hydrateExisting: false
	}).snapshot;
}
//#endregion
//#region src/cron/isolated-agent/model-selection.ts
function formatAllowedModelRefs(params) {
	const configured = resolveConfiguredModelPolicyAllow(params).refs;
	if (configured && configured.length > 0) return configured.toSorted().join(", ");
	return "(none configured)";
}
function formatCronPayloadModelRejection(params) {
	const { modelOverride, error } = params;
	if (error.startsWith("model not allowed:")) {
		const modelRef = error.slice(18).trim();
		return `cron payload.model '${modelOverride}' rejected by ${resolveConfiguredModelPolicyAllow(params).configPath ?? "agents.defaults.modelPolicy.allow"}: ${modelRef} is not in [${formatAllowedModelRefs(params)}]`;
	}
	return `cron payload.model '${modelOverride}' rejected: ${error}`;
}
/** Resolves the effective model for an isolated cron run across defaults, agents, hooks, payload, and session state. */
async function resolveCronModelSelection(params) {
	const resolvedDefault = resolveConfiguredModelRef({
		cfg: params.cfgWithAgentDefaults,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	let provider = resolvedDefault.provider;
	let model = resolvedDefault.model;
	let modelSource = "default";
	let catalog;
	const loadCatalogOnce = async () => {
		if (!catalog) catalog = await loadPreparedModelCatalog({
			config: params.catalogConfig,
			agentId: params.agentId,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			readOnly: true
		});
		return catalog;
	};
	const subagentModelConfigSelection = resolveSubagentModelConfigSelectionResult({
		cfg: params.cfg,
		agentId: params.agentId,
		agentConfigOverride: params.agentConfigOverride
	});
	const subagentModelRaw = normalizeModelSelection(subagentModelConfigSelection?.raw);
	const subagentModelSource = subagentModelConfigSelection?.source === "agent" ? "agent" : "subagent";
	if (subagentModelRaw) {
		const resolvedSubagent = resolveAllowedModelRef({
			cfg: params.cfg,
			catalog: await loadCatalogOnce(),
			raw: subagentModelRaw,
			defaultProvider: resolvedDefault.provider,
			defaultModel: resolvedDefault.model,
			agentId: params.agentId
		});
		if (!("error" in resolvedSubagent)) {
			provider = resolvedSubagent.ref.provider;
			model = resolvedSubagent.ref.model;
			modelSource = subagentModelSource;
		}
	}
	let hooksGmailModelApplied = false;
	const hooksGmailModelRef = params.isGmailHook ? resolveHooksGmailModel({
		cfg: params.cfg,
		defaultProvider: DEFAULT_PROVIDER
	}) : null;
	if (hooksGmailModelRef) {
		if (getModelRefStatus({
			cfg: params.cfg,
			catalog: await loadCatalogOnce(),
			ref: hooksGmailModelRef,
			defaultProvider: resolvedDefault.provider,
			defaultModel: resolvedDefault.model,
			agentId: params.agentId
		}).allowed) {
			provider = hooksGmailModelRef.provider;
			model = hooksGmailModelRef.model;
			hooksGmailModelApplied = true;
			modelSource = "hook";
		}
	}
	const modelOverrideRaw = params.payload.kind === "agentTurn" ? params.payload.model : void 0;
	const modelOverride = typeof modelOverrideRaw === "string" ? modelOverrideRaw.trim() : void 0;
	if (modelOverride !== void 0 && modelOverride.length > 0) {
		const resolvedOverride = resolveAllowedModelRef({
			cfg: params.cfg,
			catalog: await loadCatalogOnce(),
			raw: modelOverride,
			defaultProvider: resolvedDefault.provider,
			defaultModel: resolvedDefault.model,
			agentId: params.agentId
		});
		if ("error" in resolvedOverride) return {
			ok: false,
			error: formatCronPayloadModelRejection({
				cfg: params.cfg,
				agentId: params.agentId,
				modelOverride,
				error: resolvedOverride.error
			})
		};
		provider = resolvedOverride.ref.provider;
		model = resolvedOverride.ref.model;
		modelSource = "payload";
	}
	if (!modelOverride && !hooksGmailModelApplied) {
		const sessionModelOverride = params.sessionEntry.modelOverride?.trim();
		if (sessionModelOverride) {
			const sessionProviderOverride = params.sessionEntry.providerOverride?.trim() || resolvedDefault.provider;
			const resolvedSessionOverride = resolveAllowedModelRef({
				cfg: params.cfg,
				catalog: await loadCatalogOnce(),
				raw: `${sessionProviderOverride}/${sessionModelOverride}`,
				defaultProvider: resolvedDefault.provider,
				defaultModel: resolvedDefault.model,
				agentId: params.agentId
			});
			if (!("error" in resolvedSessionOverride)) {
				provider = resolvedSessionOverride.ref.provider;
				model = resolvedSessionOverride.ref.model;
				modelSource = "session";
			}
		}
	}
	return {
		ok: true,
		provider,
		model,
		modelSource
	};
}
//#endregion
//#region src/cron/isolated-agent/run-config.ts
/** Selects the active reloadable config when it descends from the cron caller's snapshot. */
function resolveCronActiveRuntimeConfig(cfg) {
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	if (!runtimeConfig || !runtimeSourceConfig) return cfg;
	return selectApplicableRuntimeConfig({
		inputConfig: cfg,
		runtimeConfig,
		runtimeSourceConfig
	}) ?? cfg;
}
function extractCronAgentDefaultsOverride(agentConfigOverride) {
	const { model: overrideModel, sandbox: _agentSandboxOverride, memorySearch: _agentMemorySearchOverride, ...agentOverrideRest } = agentConfigOverride ?? {};
	return {
		overrideModel,
		definedOverrides: Object.fromEntries(Object.entries(agentOverrideRest).filter(([, value]) => value !== void 0))
	};
}
function mergeCronAgentModelOverride(params) {
	const nextDefaults = { ...params.defaults };
	const existingModel = nextDefaults.model && typeof nextDefaults.model === "object" ? nextDefaults.model : {};
	if (typeof params.overrideModel === "string") nextDefaults.model = {
		...existingModel,
		primary: params.overrideModel
	};
	else if (params.overrideModel) nextDefaults.model = {
		...existingModel,
		...params.overrideModel
	};
	return nextDefaults;
}
/** Builds the agent defaults snapshot used by isolated cron runs. */
function buildCronAgentDefaultsConfig(params) {
	const { overrideModel, definedOverrides } = extractCronAgentDefaultsOverride(params.agentConfigOverride);
	return mergeCronAgentModelOverride({
		defaults: Object.assign({}, params.defaults, definedOverrides),
		overrideModel
	});
}
//#endregion
//#region src/cron/isolated-agent/run-timeout.ts
/** Converts cron payload timeout overrides into embedded-runner timeout signals. */
/** Converts explicit cron payload timeoutSeconds into a timer-safe millisecond override signal. */
function resolveCronRunTimeoutOverrideMs(timeoutSeconds) {
	return finiteSecondsToTimerSafeMilliseconds(timeoutSeconds);
}
//#endregion
//#region src/cron/isolated-agent/run.ts
const sessionAccessorRuntimeLoader = createLazyImportLoader(() => import("./session-accessor-QYu3Z6AW.js"));
const cronExecutorRuntimeLoader = createLazyImportLoader(() => import("./run-executor.runtime.js"));
const cronExternalContentRuntimeLoader = createLazyImportLoader(() => import("./run-external-content.runtime.js"));
const cronAuthProfileRuntimeLoader = createLazyImportLoader(() => import("./run-auth-profile.runtime.js"));
const cronContextRuntimeLoader = createLazyImportLoader(() => import("./run-context.runtime.js"));
const cronModelCatalogRuntimeLoader = createLazyImportLoader(() => import("./run-model-catalog.runtime.js"));
const cronDeliveryRuntimeLoader = createLazyImportLoader(() => import("./run-delivery.runtime.js"));
const cronModelPreflightRuntimeLoader = createLazyImportLoader(() => import("./model-preflight.runtime.js"));
const runtimePluginsLoader = createLazyImportLoader(() => import("./runtime-plugins.runtime.js"));
const codexNativeWebSearchLoader = createLazyImportLoader(() => import("./codex-native-web-search-Bsl1yKMz.js"));
const webToolRuntimeContextLoader = createLazyImportLoader(() => import("./web-tool-runtime-context-DOOdrMYM.js"));
const webSearchRuntimeLoader = createLazyImportLoader(() => import("./runtime-DrAnaGnD.js"));
async function loadSessionAccessorRuntime() {
	return await sessionAccessorRuntimeLoader.load();
}
async function loadCronExecutorRuntime() {
	return await cronExecutorRuntimeLoader.load();
}
async function loadCronExternalContentRuntime() {
	return await cronExternalContentRuntimeLoader.load();
}
async function loadCronAuthProfileRuntime() {
	return await cronAuthProfileRuntimeLoader.load();
}
async function loadCronContextRuntime() {
	return await cronContextRuntimeLoader.load();
}
async function loadCronModelCatalogRuntime() {
	return await cronModelCatalogRuntimeLoader.load();
}
async function loadCronDeliveryRuntime() {
	return await cronDeliveryRuntimeLoader.load();
}
async function loadCronModelPreflightRuntime() {
	return await cronModelPreflightRuntimeLoader.load();
}
async function loadRuntimePlugins() {
	return await runtimePluginsLoader.load();
}
async function loadCodexNativeWebSearch() {
	return await codexNativeWebSearchLoader.load();
}
async function loadWebToolRuntimeContext() {
	return await webToolRuntimeContextLoader.load();
}
async function loadWebSearchRuntime() {
	return await webSearchRuntimeLoader.load();
}
function hasConfiguredAuthProfiles(cfg) {
	return Boolean(cfg.auth?.profiles && Object.keys(cfg.auth.profiles).length > 0) || Boolean(cfg.auth?.order && Object.keys(cfg.auth.order).length > 0);
}
function isCronNestedLaneTaskTimeoutError(err) {
	return isCommandLaneTaskTimeoutError(err, "cron-nested");
}
async function retireRolledCronSessionMcpRuntime(params) {
	if (params.job.sessionTarget === "isolated") return;
	const previousSessionId = normalizeOptionalString(params.cronSession.previousSessionId);
	const currentSessionId = normalizeOptionalString(params.cronSession.sessionEntry.sessionId);
	if (!previousSessionId || previousSessionId === currentSessionId) return;
	await retireSessionMcpRuntime({
		sessionId: previousSessionId,
		reason: "cron-session-rollover",
		onError: (error, sessionId) => {
			logWarn(`[cron:${params.job.id}] Failed to dispose retired bundle MCP runtime for session ${sessionId}: ${String(error)}`);
		}
	});
}
function normalizeCronTraceTarget(target) {
	if (!target) return;
	return {
		...target.channel ? { channel: target.channel } : {},
		...target.to !== void 0 ? { to: target.to } : {},
		...target.accountId ? { accountId: target.accountId } : {},
		...target.threadId !== void 0 ? { threadId: target.threadId } : {},
		...target.source ? { source: target.source } : {}
	};
}
function normalizeMessagingToolTarget(delivery, resolvedDelivery) {
	const { target } = delivery;
	const channel = target.provider?.trim();
	if (!channel) return;
	return {
		channel: channel === "message" && resolvedDelivery.ok && delivery.verifiedTarget ? resolvedDelivery.channel : channel,
		...target.to ? { to: target.to } : {},
		...target.accountId ? { accountId: target.accountId } : {},
		...target.threadId ? { threadId: target.threadId } : {}
	};
}
function buildResolvedCronTraceTarget(resolvedDelivery) {
	if (resolvedDelivery.ok) return {
		ok: true,
		...normalizeCronTraceTarget({
			channel: resolvedDelivery.channel,
			to: resolvedDelivery.to,
			accountId: resolvedDelivery.accountId,
			threadId: resolvedDelivery.threadId,
			source: resolvedDelivery.mode === "implicit" ? "last" : "explicit"
		})
	};
	return {
		ok: false,
		...normalizeCronTraceTarget({
			channel: resolvedDelivery.channel,
			to: resolvedDelivery.to ?? null,
			accountId: resolvedDelivery.accountId,
			threadId: resolvedDelivery.threadId,
			source: resolvedDelivery.mode === "implicit" ? "last" : "explicit"
		}),
		error: resolvedDelivery.error.message
	};
}
function buildCronDeliveryTrace(params) {
	const intended = normalizeCronTraceTarget({
		channel: params.deliveryPlan.channel ?? "last",
		to: params.deliveryPlan.to ?? null,
		accountId: params.deliveryPlan.accountId,
		threadId: params.deliveryPlan.threadId,
		source: params.deliveryPlan.channel === "last" || !params.deliveryPlan.channel ? "last" : "explicit"
	});
	const resolved = params.deliveryPlan.mode !== "none" || hasExplicitCronDeliveryTarget(params.deliveryPlan) ? buildResolvedCronTraceTarget(params.resolvedDelivery) : void 0;
	const messageToolSentTo = params.sourceDeliveryOutcome.visibleDeliveries.map((delivery) => normalizeMessagingToolTarget(delivery, params.resolvedDelivery)).filter((target) => Boolean(target));
	return {
		...intended ? { intended } : {},
		...resolved ? { resolved } : {},
		...messageToolSentTo.length > 0 ? { messageToolSentTo } : {},
		fallbackUsed: params.fallbackUsed,
		delivered: params.delivered
	};
}
function canPromptForMessageTool(params) {
	if (!params.sourceDelivery.messageTool.enabled) return false;
	const normalizedToolsAllow = params.toolsAllow ? expandToolGroups(params.toolsAllow).map((toolName) => normalizeToolName(toolName)) : void 0;
	return params.toolsAllow === void 0 || normalizedToolsAllow?.includes("*") === true || normalizedToolsAllow?.includes("message") === true;
}
async function createCronToolsAllowPreflightDiagnostics(params) {
	const toolsAllow = params.agentPayload?.toolsAllow;
	if (params.agentPayload?.toolsAllowIsDefault === true || !toolsAllowRequestsWebSearch(toolsAllow)) return;
	try {
		const { shouldSuppressManagedWebSearchTool } = await loadCodexNativeWebSearch();
		if (shouldSuppressManagedWebSearchTool({
			config: params.cfg,
			modelProvider: params.provider,
			modelApi: params.modelApi,
			modelId: params.model,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			agentDir: params.agentDir
		})) return;
		const { resolveWebSearchToolRuntimeContext } = await loadWebToolRuntimeContext();
		const { config, preferRuntimeProviders, runtimeWebSearch } = resolveWebSearchToolRuntimeContext({
			config: params.cfg,
			lateBindRuntimeConfig: true
		});
		const { hasUsableWebSearchProvider } = await loadWebSearchRuntime();
		return createCronRunDiagnosticsFromMissingWebSearchProvider({
			toolsAllow,
			hasWebSearchProvider: hasUsableWebSearchProvider({
				config,
				agentDir: params.agentDir,
				runtimeWebSearch,
				preferRuntimeProviders
			})
		});
	} catch (error) {
		logWarn(`[cron:${params.jobId}] Failed to inspect web_search provider state for toolsAllow diagnostics: ${String(error)}`);
		return;
	}
}
/** Resolves the delivery plan and concrete target for one isolated cron run. */
async function resolveCronDeliveryContext(params) {
	const deliveryPlan = resolveCronDeliveryPlan(params.job);
	if (deliveryPlan.mode === "webhook") {
		const resolvedDelivery = {
			ok: false,
			channel: void 0,
			to: void 0,
			accountId: void 0,
			threadId: void 0,
			mode: "implicit",
			error: /* @__PURE__ */ new Error("webhook delivery has no chat target")
		};
		return {
			deliveryPlan,
			deliveryRequested: deliveryPlan.requested,
			resolvedDelivery,
			sourceDelivery: resolveCronSourceDeliveryPlan({
				deliveryPlan,
				resolvedDelivery
			})
		};
	}
	if (deliveryPlan.mode === "none" && !hasExplicitCronDeliveryTarget(deliveryPlan)) {
		const resolvedDelivery = {
			ok: false,
			channel: void 0,
			to: void 0,
			accountId: void 0,
			threadId: void 0,
			mode: "implicit",
			error: /* @__PURE__ */ new Error("delivery is disabled")
		};
		return {
			deliveryPlan,
			deliveryRequested: false,
			resolvedDelivery,
			sourceDelivery: resolveCronSourceDeliveryPlan({
				deliveryPlan,
				resolvedDelivery
			})
		};
	}
	const { resolveDeliveryTarget } = await loadCronDeliveryRuntime();
	const resolvedDelivery = await resolveDeliveryTarget(params.cfg, params.agentId, {
		channel: deliveryPlan.channel ?? "last",
		to: deliveryPlan.to,
		threadId: deliveryPlan.threadId,
		accountId: deliveryPlan.accountId,
		sessionKey: resolveCronDeliverySessionKey(params.job)
	});
	return {
		deliveryPlan,
		deliveryRequested: deliveryPlan.requested,
		resolvedDelivery,
		sourceDelivery: resolveCronSourceDeliveryPlan({
			deliveryPlan,
			resolvedDelivery
		})
	};
}
function appendCronDeliveryInstruction(params) {
	if (!params.deliveryRequested) return params.commandBody;
	if (params.messageToolEnabled) {
		const targetHint = params.requireExplicitMessageTarget || !params.resolvedDeliveryOk ? "with an explicit target" : "for the current chat";
		return `${params.commandBody}\n\nUse the message tool if you need to notify the user directly ${targetHint}. If you do not send directly, your final plain-text reply will be delivered automatically.`.trim();
	}
	return `${params.commandBody}\n\nYour response will be delivered automatically. If the task explicitly calls for messaging a specific external recipient, note who/where it should go instead of sending it yourself.`.trim();
}
function appendCronUnattendedRunPreamble(commandBody, opts) {
	return `${commandBody}\n\n${`This is an unattended scheduled run. Nobody is present to clarify or approve, so complete the task with what you have. Your final reply is the deliverable — not a plan, an acknowledgement, or a request for input. If nothing needs doing, reply exactly ${HEARTBEAT_TOKEN}. If something failed, state plainly what failed and what you tried — the scheduler owns retries and failure alerts.`}${opts.externalHook ? "" : " Where the job's own instructions conflict with this preamble, the job's instructions win (a question or plan the job explicitly requests is a valid deliverable). If this job is no longer needed, you may remove it with the cron tool."}`;
}
function resolvePositiveContextTokens(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : void 0;
}
async function loadCliRunnerRuntime() {
	return await import("./cli-runner.runtime.js");
}
async function loadUsageFormatRuntime() {
	return await import("./usage-format-BrVCsMM9.js");
}
function resolveCronAgentTurnMessage(input) {
	if (input.job.payload.kind === "agentTurn") return input.job.payload.message;
	return input.message;
}
async function prepareCronRunContext(params) {
	const { input } = params;
	const runtimeCfg = resolveCronActiveRuntimeConfig(input.cfg);
	const defaultAgentId = resolveDefaultAgentId(runtimeCfg);
	const requestedAgentId = typeof input.agentId === "string" && input.agentId.trim() ? input.agentId : typeof input.job.agentId === "string" && input.job.agentId.trim() ? input.job.agentId : void 0;
	const normalizedRequested = requestedAgentId ? normalizeAgentId(requestedAgentId) : void 0;
	const agentId = normalizedRequested ?? defaultAgentId;
	const selectedAgentConfig = resolveAgentConfig(runtimeCfg, agentId);
	const agentConfigOverride = normalizedRequested ? selectedAgentConfig : void 0;
	const matchesDefaultFallbackAgentStringModel = typeof selectedAgentConfig?.model === "string" && resolveAgentModelPrimaryValue(selectedAgentConfig.model) === resolveAgentModelPrimaryValue(runtimeCfg.agents?.defaults?.model);
	const agentCfg = buildCronAgentDefaultsConfig({
		defaults: runtimeCfg.agents?.defaults,
		agentConfigOverride
	});
	const cfgWithAgentDefaults = {
		...runtimeCfg,
		agents: Object.assign({}, runtimeCfg.agents, { defaults: agentCfg })
	};
	let catalog;
	const loadCatalog = async () => {
		if (!catalog) catalog = await (await loadCronModelCatalogRuntime()).loadPreparedModelCatalog({
			config: runtimeCfg,
			agentId,
			agentDir,
			readOnly: true
		});
		return catalog;
	};
	const baseSessionKey = (input.sessionKey?.trim() || `cron:${input.job.id}`).trim();
	const currentBoundSourceKey = input.job.sessionTarget === "current" ? input.job.sessionKey?.trim() : void 0;
	const usesDetachedRunSession = isDetachedCronSessionTarget(input.job.sessionTarget) || Boolean(currentBoundSourceKey);
	const baseSessionKeyIsCron = baseSessionKey.startsWith("cron:") || isCronSessionKey(baseSessionKey);
	const agentSessionKey = resolveCronAgentSessionKey({
		sessionKey: usesDetachedRunSession && !baseSessionKeyIsCron ? `cron:${input.job.id}` : baseSessionKey,
		agentId,
		mainKey: input.cfg.session?.mainKey,
		cfg: input.cfg
	});
	const resolvedBaseSessionKey = resolveCronAgentSessionKey({
		sessionKey: currentBoundSourceKey ?? baseSessionKey,
		agentId,
		mainKey: input.cfg.session?.mainKey,
		cfg: input.cfg
	});
	const sourceSessionKey = currentBoundSourceKey && resolvedBaseSessionKey !== agentSessionKey ? resolvedBaseSessionKey : void 0;
	const hookExternalContentSource = (input.job.payload.kind === "agentTurn" ? input.job.payload.externalContentSource : void 0) ?? resolveHookExternalContentSource(baseSessionKey);
	const workspaceDirRaw = resolveAgentWorkspaceDir(runtimeCfg, agentId);
	const agentDir = resolveAgentDir(runtimeCfg, agentId);
	const workspaceDir = (await ensureAgentWorkspace({
		dir: workspaceDirRaw,
		ensureBootstrapFiles: !agentCfg?.skipBootstrap && !params.isFastTestEnv,
		skipOptionalBootstrapFiles: agentCfg?.skipOptionalBootstrapFiles
	})).dir;
	const { ensureRuntimePluginsLoaded } = await loadRuntimePlugins();
	ensureRuntimePluginsLoaded({
		config: cfgWithAgentDefaults,
		workspaceDir,
		allowGatewaySubagentBinding: true
	});
	const isGmailHook = hookExternalContentSource === "gmail";
	const now = Date.now();
	const cronSession = resolveCronSession({
		cfg: input.cfg,
		sessionKey: agentSessionKey,
		sourceSessionKey,
		agentId,
		nowMs: now,
		forceNew: usesDetachedRunSession,
		hookExternalContentSource
	});
	const reservedKey = isAgentHarnessSessionKey(agentSessionKey);
	if (cronSession.initialSessionEntry?.modelSelectionLocked === true) throw new Error(reservedKey ? AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE : AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE);
	if (reservedKey && !cronSession.initialSessionEntry) throw new Error(AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE);
	const runSessionId = cronSession.sessionEntry.sessionId;
	const currentRunSessionId = () => cronSession.sessionEntry.sessionId ?? runSessionId;
	if (!cronSession.sessionEntry.sessionFile?.trim()) cronSession.sessionEntry.sessionFile = formatSqliteSessionFileMarker({
		agentId,
		sessionId: runSessionId,
		storePath: cronSession.storePath
	});
	const runSessionKey = usesDetachedRunSession || baseSessionKey.startsWith("cron:") ? `${agentSessionKey}:run:${runSessionId}` : agentSessionKey;
	const persistCronSessionRow = async ({ storePath, sessionKey, fallbackEntry, update }) => {
		const { patchSessionEntry } = await loadSessionAccessorRuntime();
		await patchSessionEntry({
			storePath,
			sessionKey,
			agentId
		}, (_entry, context) => update(context.existingEntry), {
			fallbackEntry,
			replaceEntry: true
		});
	};
	const persistSessionEntry = createPersistCronSessionEntry({
		cronSession,
		agentSessionKey,
		persistSessionEntry: persistCronSessionRow
	});
	const withRunSession = (result) => ({
		...result,
		sessionId: currentRunSessionId(),
		sessionKey: runSessionKey
	});
	if (!cronSession.sessionEntry.label?.trim() && baseSessionKey.startsWith("cron:")) {
		const labelSuffix = typeof input.job.name === "string" && input.job.name.trim() ? input.job.name.trim() : input.job.id;
		cronSession.sessionEntry.label = `Cron: ${labelSuffix}`;
	}
	const resolvedModelSelection = await resolveCronModelSelection({
		cfg: runtimeCfg,
		catalogConfig: runtimeCfg,
		cfgWithAgentDefaults,
		agentConfigOverride,
		sessionEntry: cronSession.sessionEntry,
		payload: input.job.payload,
		isGmailHook,
		agentId,
		agentDir,
		workspaceDir
	});
	if (!resolvedModelSelection.ok) return {
		ok: false,
		result: withRunSession({
			status: "error",
			error: resolvedModelSelection.error,
			diagnostics: createCronRunDiagnosticsFromError("cron-preflight", resolvedModelSelection.error)
		})
	};
	let provider = resolvedModelSelection.provider;
	let model = resolvedModelSelection.model;
	const useSubagentFallbacks = resolvedModelSelection.modelSource === "subagent";
	const inheritDefaultFallbacksForAgentStringModel = matchesDefaultFallbackAgentStringModel && (resolvedModelSelection.modelSource === "default" || resolvedModelSelection.modelSource === "agent");
	const modelPreflightRuntime = await loadCronModelPreflightRuntime();
	const preflightCandidates = resolveCronPreflightCandidates({
		cfg: cfgWithAgentDefaults,
		job: input.job,
		agentId,
		provider,
		model,
		useSubagentFallbacks,
		inheritDefaultFallbacksForAgentStringModel
	});
	let selectedPreflightCandidate;
	let selectedPreflightCandidateIndex = -1;
	let firstUnavailablePreflight;
	for (const [index, candidate] of preflightCandidates.entries()) {
		const candidatePreflight = await modelPreflightRuntime.preflightCronModelProvider({
			cfg: cfgWithAgentDefaults,
			provider: candidate.provider,
			model: candidate.model
		});
		if (candidatePreflight.status === "available") {
			selectedPreflightCandidate = candidate;
			selectedPreflightCandidateIndex = index;
			break;
		}
		firstUnavailablePreflight ??= candidatePreflight;
	}
	if (!selectedPreflightCandidate && firstUnavailablePreflight?.status === "unavailable") {
		logWarn(`[cron:${input.job.id}] ${firstUnavailablePreflight.reason}`);
		return {
			ok: false,
			result: withRunSession({
				status: "skipped",
				error: firstUnavailablePreflight.reason,
				diagnostics: createCronRunDiagnosticsFromError("model-preflight", firstUnavailablePreflight.reason, { severity: "warn" }),
				provider,
				model
			})
		};
	}
	const modelFallbacksOverride = selectedPreflightCandidate && (selectedPreflightCandidate.provider !== provider || selectedPreflightCandidate.model !== model) ? preflightCandidates.slice(selectedPreflightCandidateIndex + 1).map((candidate) => `${candidate.provider}/${candidate.model}`) : void 0;
	if (selectedPreflightCandidate && modelFallbacksOverride) {
		if (firstUnavailablePreflight?.status === "unavailable") logWarn(`[cron:${input.job.id}] Local provider preflight failed for ${firstUnavailablePreflight.provider}/${firstUnavailablePreflight.model} at ${firstUnavailablePreflight.baseUrl}; continuing with fallback ${selectedPreflightCandidate.provider}/${selectedPreflightCandidate.model}.`);
		provider = selectedPreflightCandidate.provider;
		model = selectedPreflightCandidate.model;
	}
	const hooksGmailThinking = isGmailHook ? normalizeThinkLevel(input.cfg.hooks?.gmail?.thinking) : void 0;
	const jobThink = normalizeThinkLevel((input.job.payload.kind === "agentTurn" ? input.job.payload.thinking : void 0) ?? void 0);
	const sessionThink = normalizeThinkLevel(cronSession.sessionEntry.thinkingLevel);
	const effectiveAgentRuntime = resolveEffectiveAgentRuntime({
		cfg: cfgWithAgentDefaults,
		provider,
		modelId: model,
		agentId,
		sessionKey: agentSessionKey,
		sessionEntry: cronSession.sessionEntry
	});
	let requestedThinkLevel = jobThink ?? hooksGmailThinking ?? sessionThink;
	if (!requestedThinkLevel) {
		const thinkingCatalog = await loadCatalog();
		requestedThinkLevel = resolveThinkingDefault({
			cfg: cfgWithAgentDefaults,
			provider,
			model,
			catalog: thinkingCatalog,
			agentRuntime: effectiveAgentRuntime
		});
	}
	const thinkingCatalog = await loadCatalog();
	if (!isThinkingLevelSupported({
		provider,
		model,
		level: requestedThinkLevel,
		catalog: thinkingCatalog,
		agentRuntime: effectiveAgentRuntime
	})) {
		const fallbackThinkLevel = resolveSupportedThinkingLevel({
			provider,
			model,
			level: requestedThinkLevel,
			catalog: thinkingCatalog,
			agentRuntime: effectiveAgentRuntime
		});
		if (fallbackThinkLevel !== requestedThinkLevel) logWarn(`[cron:${input.job.id}] Thinking level "${requestedThinkLevel}" is not supported for ${provider}/${model}; using "${fallbackThinkLevel}" for this candidate.`);
	}
	const explicitTimeoutSeconds = input.job.payload.kind === "agentTurn" ? input.job.payload.timeoutSeconds : void 0;
	const timeoutMs = resolveAgentTimeoutMs({
		cfg: cfgWithAgentDefaults,
		overrideSeconds: explicitTimeoutSeconds
	});
	const runTimeoutOverrideMs = resolveCronRunTimeoutOverrideMs(explicitTimeoutSeconds);
	const agentPayload = input.job.payload.kind === "agentTurn" ? input.job.payload : null;
	const configuredProvider = cfgWithAgentDefaults.models?.providers?.[provider];
	const modelApi = findModelInCatalog(thinkingCatalog, provider, model)?.api ?? configuredProvider?.models?.find((candidate) => candidate.id === model)?.api ?? configuredProvider?.api;
	const preflightDiagnostics = await createCronToolsAllowPreflightDiagnostics({
		cfg: cfgWithAgentDefaults,
		jobId: input.job.id,
		provider,
		model,
		modelApi,
		agentId,
		agentDir,
		sessionKey: agentSessionKey,
		agentPayload
	});
	const { deliveryPlan, deliveryRequested, resolvedDelivery, sourceDelivery } = await resolveCronDeliveryContext({
		cfg: cfgWithAgentDefaults,
		job: input.job,
		agentId
	});
	const { formattedTime, timeLine } = resolveCronStyleNow(input.cfg, now);
	const message = resolveCronAgentTurnMessage(input);
	const base = `[cron:${input.job.id} ${input.job.name}] ${message}`.trim();
	const isExternalHook = hookExternalContentSource !== void 0 || isExternalHookSession(baseSessionKey);
	const allowUnsafeExternalContent = agentPayload?.allowUnsafeExternalContent === true || isGmailHook && input.cfg.hooks?.gmail?.allowUnsafeExternalContent === true;
	const shouldWrapExternal = isExternalHook && !allowUnsafeExternalContent;
	let commandBody;
	if (isExternalHook) {
		const { detectSuspiciousPatterns } = await loadCronExternalContentRuntime();
		const suspiciousPatterns = detectSuspiciousPatterns(message);
		if (suspiciousPatterns.length > 0) logWarn(`[security] Suspicious patterns detected in external hook content (session=${baseSessionKey}, patterns=${suspiciousPatterns.length}): ${suspiciousPatterns.slice(0, 3).join(", ")}`);
	}
	if (shouldWrapExternal) {
		const { buildSafeExternalPrompt } = await loadCronExternalContentRuntime();
		commandBody = `${buildSafeExternalPrompt({
			content: message,
			source: mapHookExternalContentSource(hookExternalContentSource ?? "webhook"),
			jobName: input.job.name,
			jobId: input.job.id,
			timestamp: formattedTime
		})}\n\n${timeLine}`.trim();
	} else commandBody = `${base}\n${timeLine}`.trim();
	const messageToolPromptEnabled = canPromptForMessageTool({
		sourceDelivery,
		toolsAllow: agentPayload?.toolsAllow
	});
	commandBody = appendCronUnattendedRunPreamble(commandBody, { externalHook: isExternalHook });
	commandBody = appendCronDeliveryInstruction({
		commandBody,
		deliveryRequested,
		messageToolEnabled: messageToolPromptEnabled,
		resolvedDeliveryOk: resolvedDelivery.ok,
		requireExplicitMessageTarget: sourceDelivery.messageTool.requireExplicitTarget
	});
	const initialSessionEntry = cronSession.initialSessionEntry;
	const sessionWorkAdmission = await beginSessionWorkAdmission({
		scope: cronSession.storePath,
		identities: [
			agentSessionKey,
			initialSessionEntry?.sessionId,
			cronSession.sessionEntry.sessionId,
			resolveCronLifecycleRevisionIdentity(cronSession.lifecycleRevision),
			runSessionKey
		],
		signal: input.abortSignal ?? input.signal,
		onInterrupt: params.onLifecycleInterrupt,
		assertAllowed: () => {
			const currentEntry = loadCronSessionEntryLatest(cronSession.storePath, agentSessionKey);
			if (initialSessionEntry ? !currentEntry || !isDeepStrictEqual(projectCronOwnershipFields(currentEntry), projectCronOwnershipFields(initialSessionEntry)) : Boolean(currentEntry)) throw new Error(`Session "${agentSessionKey}" changed while starting work. Retry.`);
			const archivedSessionError = resolveSessionWorkStartError(agentSessionKey, currentEntry);
			if (archivedSessionError) throw new Error(archivedSessionError);
		}
	});
	try {
		const skillsSnapshot = await resolveCronSkillsSnapshot({
			workspaceDir,
			config: cfgWithAgentDefaults,
			agentId,
			existingSnapshot: cronSession.sessionEntry.skillsSnapshot,
			isFastTestEnv: params.isFastTestEnv
		});
		await persistCronSkillsSnapshotIfChanged({
			isFastTestEnv: params.isFastTestEnv,
			cronSession,
			skillsSnapshot,
			nowMs: Date.now(),
			persistSessionEntry
		});
		markCronSessionPreRun({
			entry: cronSession.sessionEntry,
			provider,
			model
		});
		try {
			await persistSessionEntry();
		} catch (err) {
			if (err instanceof CronSessionLifecycleClaimError) throw err;
			logWarn(`[cron:${input.job.id}] Failed to persist pre-run session entry: ${String(err)}`);
		}
		await retireRolledCronSessionMcpRuntime({
			job: input.job,
			cronSession
		});
		const authProfileId = !Boolean(cronSession.sessionEntry.authProfileOverride?.trim()) && !hasConfiguredAuthProfiles(cfgWithAgentDefaults) && !hasAnyAuthProfileStoreSource(agentDir) ? void 0 : await (await loadCronAuthProfileRuntime()).resolveSessionAuthProfileOverride({
			cfg: cfgWithAgentDefaults,
			provider,
			acceptedProviderIds: listOpenAIAuthProfileProvidersForAgentRuntime({
				provider,
				harnessRuntime: effectiveAgentRuntime,
				config: cfgWithAgentDefaults
			}),
			agentDir,
			sessionEntry: cronSession.sessionEntry,
			sessionStore: cronSession.store,
			sessionKey: agentSessionKey,
			storePath: cronSession.storePath,
			isNewSession: cronSession.isNewSession && input.job.sessionTarget !== "isolated"
		});
		const liveSelection = {
			provider,
			model,
			agentRuntimeOverride: resolveSessionRuntimeOverrideForProvider({
				provider,
				entry: cronSession.sessionEntry,
				cfg: cfgWithAgentDefaults
			}),
			authProfileId,
			authProfileIdSource: authProfileId ? cronSession.sessionEntry.authProfileOverrideSource : void 0
		};
		const runContinuationSession = baseSessionKey.startsWith("cron:") ? createCronRunContinuationSession({
			cronSession,
			runSessionKey,
			thinkingLevel: requestedThinkLevel,
			toolsAllow: agentPayload?.toolsAllow,
			toolsAllowIsDefault: agentPayload?.toolsAllowIsDefault,
			cliSessionBindingFacts: {
				sourceReplyDeliveryMode: sourceDelivery.sourceReplyDeliveryMode,
				requireExplicitMessageTarget: sourceDelivery.messageTool.requireExplicitTarget
			},
			persistSessionEntry: persistCronSessionRow
		}) : void 0;
		await runContinuationSession?.initialize();
		return {
			ok: true,
			context: {
				input,
				cfgWithAgentDefaults,
				agentId,
				agentCfg,
				agentDir,
				agentSessionKey,
				runSessionId,
				currentRunSessionId,
				runSessionKey,
				usesDetachedRunSession,
				workspaceDir,
				commandBody,
				cronSession,
				sessionWorkAdmission,
				persistSessionEntry,
				runContinuationSession,
				withRunSession,
				agentPayload,
				deliveryPlan,
				resolvedDelivery,
				deliveryRequested,
				sourceDelivery,
				messageToolPromptEnabled,
				suppressExecNotifyOnExit: deliveryPlan.mode === "none",
				skillsSnapshot,
				liveSelection,
				useSubagentFallbacks,
				inheritDefaultFallbacksForAgentStringModel,
				modelFallbacksOverride,
				thinkLevel: requestedThinkLevel,
				thinkingCatalog,
				timeoutMs,
				preflightDiagnostics,
				runTimeoutOverrideMs
			}
		};
	} catch (error) {
		sessionWorkAdmission.release();
		throw error;
	}
}
async function finalizeCronRun(params) {
	const { prepared, execution } = params;
	const finalRunResult = execution.runResult;
	const payloads = finalRunResult.payloads ?? [];
	let telemetry;
	if (!params.isAborted()) {
		if (finalRunResult.meta?.systemPromptReport) prepared.cronSession.sessionEntry.systemPromptReport = finalRunResult.meta.systemPromptReport;
		adoptCronRunSessionMetadata({
			entry: prepared.cronSession.sessionEntry,
			sessionKey: prepared.agentSessionKey,
			runMeta: finalRunResult.meta?.agentMeta
		});
	}
	const usage = finalRunResult.meta?.agentMeta?.usage;
	const lastCallUsage = finalRunResult.meta?.agentMeta?.lastCallUsage;
	const promptTokens = finalRunResult.meta?.agentMeta?.promptTokens;
	const modelUsed = finalRunResult.meta?.agentMeta?.model ?? execution.fallbackModel ?? execution.liveSelection.model;
	const providerUsed = finalRunResult.meta?.agentMeta?.provider ?? execution.fallbackProvider ?? execution.liveSelection.provider;
	const contextTokens = resolvePositiveContextTokens(prepared.agentCfg?.contextTokens) ?? (await loadCronContextRuntime()).lookupContextTokens(modelUsed, { allowAsyncLoad: false }) ?? resolvePositiveContextTokens(prepared.cronSession.sessionEntry.contextTokens) ?? 2e5;
	if (!params.isAborted()) {
		setSessionRuntimeModel(prepared.cronSession.sessionEntry, {
			provider: providerUsed,
			model: modelUsed
		});
		prepared.cronSession.sessionEntry.contextTokens = contextTokens;
		if (isCliProvider(providerUsed, prepared.cfgWithAgentDefaults)) {
			const cliSessionBinding = finalRunResult.meta?.agentMeta?.cliSessionBinding;
			const cliSessionId = finalRunResult.meta?.agentMeta?.sessionId?.trim();
			if (finalRunResult.meta?.agentMeta?.clearCliSessionBinding === true) {
				const { clearCliSession } = await loadCliRunnerRuntime();
				clearCliSession(prepared.cronSession.sessionEntry, providerUsed);
			} else if (cliSessionBinding?.sessionId?.trim()) {
				const { setCliSessionBinding } = await loadCliRunnerRuntime();
				setCliSessionBinding(prepared.cronSession.sessionEntry, providerUsed, cliSessionBinding);
			} else if (cliSessionId) {
				const { setCliSessionId } = await loadCliRunnerRuntime();
				setCliSessionId(prepared.cronSession.sessionEntry, providerUsed, cliSessionId);
			}
		}
	}
	if (hasNonzeroUsage(usage)) {
		const { estimateUsageCost, resolveModelCostConfig } = await loadUsageFormatRuntime();
		const input = usage.input ?? 0;
		const output = usage.output ?? 0;
		const cacheRead = usage.cacheRead ?? 0;
		const cacheWrite = usage.cacheWrite ?? 0;
		const hasBillableUsageBuckets = usage.input !== void 0 || usage.output !== void 0 || usage.cacheRead !== void 0 || usage.cacheWrite !== void 0;
		const lastCallTotalTokens = deriveSessionTotalTokens({
			usage: lastCallUsage,
			contextTokens,
			promptTokens
		});
		const totalTokens = typeof lastCallTotalTokens === "number" && lastCallTotalTokens > 0 ? lastCallTotalTokens : void 0;
		const runEstimatedCostUsd = resolveNonNegativeNumber(estimateUsageCost({
			usage,
			cost: resolveModelCostConfig({
				provider: providerUsed,
				model: modelUsed,
				config: prepared.cfgWithAgentDefaults
			})
		}));
		prepared.cronSession.sessionEntry.inputTokens = input;
		prepared.cronSession.sessionEntry.outputTokens = output;
		const telemetryUsage = {
			input_tokens: input,
			output_tokens: output
		};
		const bucketTotalTokens = input + output + cacheRead + cacheWrite;
		const aggregateTotalTokens = typeof usage.total === "number" && Number.isFinite(usage.total) ? Math.max(bucketTotalTokens, usage.total) : bucketTotalTokens;
		if (aggregateTotalTokens > 0) telemetryUsage.total_tokens = aggregateTotalTokens;
		if (typeof totalTokens === "number" && Number.isFinite(totalTokens) && totalTokens > 0) {
			prepared.cronSession.sessionEntry.totalTokens = totalTokens;
			prepared.cronSession.sessionEntry.totalTokensFresh = true;
		} else {
			prepared.cronSession.sessionEntry.totalTokens = void 0;
			prepared.cronSession.sessionEntry.totalTokensFresh = false;
		}
		prepared.cronSession.sessionEntry.cacheRead = cacheRead;
		prepared.cronSession.sessionEntry.cacheWrite = cacheWrite;
		if (runEstimatedCostUsd !== void 0) prepared.cronSession.sessionEntry.estimatedCostUsd = runEstimatedCostUsd;
		telemetry = {
			model: modelUsed,
			provider: providerUsed,
			usage: telemetryUsage
		};
		if (isDiagnosticsEnabled(prepared.cfgWithAgentDefaults)) {
			const usagePromptTokens = input + cacheRead + cacheWrite;
			const contextUsedTokens = deriveContextPromptTokens({
				lastCallUsage,
				promptTokens,
				usage
			});
			emitTrustedDiagnosticEvent({
				type: "model.usage",
				...finalRunResult.diagnosticTrace ? { trace: freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(finalRunResult.diagnosticTrace)) } : {},
				sessionKey: prepared.runSessionKey,
				sessionId: prepared.currentRunSessionId(),
				channel: "cron",
				agentId: prepared.agentId,
				provider: providerUsed,
				model: modelUsed,
				usage: {
					input,
					output,
					cacheRead,
					cacheWrite,
					promptTokens: usagePromptTokens,
					total: aggregateTotalTokens
				},
				lastCallUsage,
				context: {
					limit: contextTokens,
					...contextUsedTokens !== void 0 ? { used: contextUsedTokens } : {}
				},
				...hasBillableUsageBuckets && runEstimatedCostUsd !== void 0 ? { costUsd: runEstimatedCostUsd } : {},
				durationMs: execution.runEndedAt - execution.runStartedAt
			});
		}
	} else telemetry = {
		model: modelUsed,
		provider: providerUsed
	};
	await prepared.persistSessionEntry();
	await prepared.runContinuationSession?.seal({ basePersisted: true });
	if (params.isAborted()) return prepared.withRunSession({
		status: "error",
		error: params.abortReason(),
		diagnostics: mergeCronRunDiagnostics(prepared.preflightDiagnostics, createCronRunDiagnosticsFromAgentResult(finalRunResult, { finalStatus: "error" }), createCronRunDiagnosticsFromError("cron-setup", params.abortReason())),
		...telemetry
	});
	const cronPayloadOutcome = resolveCronPayloadOutcome({
		payloads,
		runLevelError: finalRunResult.meta?.error,
		failureSignal: finalRunResult.meta?.failureSignal,
		finalAssistantVisibleText: finalRunResult.meta?.finalAssistantVisibleText,
		preferFinalAssistantVisibleText: (await resolveCronChannelOutputPolicy(prepared.resolvedDelivery.channel, { deliveryRequested: prepared.deliveryRequested })).preferFinalAssistantVisibleText
	});
	if (finalRunResult.meta?.aborted === true && !cronPayloadOutcome.hasFatalErrorPayload) {
		const error = normalizeOptionalString(finalRunResult.meta.error?.message) ?? "cron isolated agent run aborted";
		const { cleanupDirectCronSession } = await loadCronDeliveryRuntime();
		await cleanupDirectCronSession({
			job: prepared.input.job,
			agentSessionKey: prepared.agentSessionKey,
			sessionId: prepared.currentRunSessionId(),
			lifecycleRevision: prepared.cronSession.lifecycleRevision,
			sessionUpdatedAt: prepared.cronSession.sessionEntry.updatedAt,
			beforeSessionDelete: params.beforeSessionDelete,
			retireReason: "cron-delete-after-run-aborted"
		});
		params.markCronRunSessionCleanupAttempted();
		return prepared.withRunSession({
			status: "error",
			error,
			diagnostics: mergeCronRunDiagnostics(prepared.preflightDiagnostics, createCronRunDiagnosticsFromAgentResult(finalRunResult, { finalStatus: "error" }), createCronRunDiagnosticsFromError("agent-run", error)),
			...telemetry
		});
	}
	const { synthesizedText, deliveryPayloads, deliveryPayloadHasStructuredContent, hasFatalStructuredErrorPayload, pendingPresentationWarningError } = cronPayloadOutcome;
	let { summary, outputText, hasFatalErrorPayload, embeddedRunError } = cronPayloadOutcome;
	const agentDiagnostics = createCronRunDiagnosticsFromAgentResult(finalRunResult, { finalStatus: hasFatalErrorPayload ? "error" : "ok" });
	const runDiagnostics = mergeCronRunDiagnostics(prepared.preflightDiagnostics, agentDiagnostics);
	const resolveRunOutcome = (result) => prepared.withRunSession({
		status: hasFatalErrorPayload ? "error" : "ok",
		...hasFatalErrorPayload ? { error: embeddedRunError ?? "cron isolated run returned an error payload" } : {},
		summary,
		outputText,
		delivered: result?.delivered,
		deliveryAttempted: result?.deliveryAttempted,
		deliveryError: result?.deliveryError,
		delivery: result?.delivery,
		diagnostics: mergeCronRunDiagnostics(runDiagnostics, hasFatalErrorPayload ? createCronRunDiagnosticsFromError("agent-run", embeddedRunError ?? "cron isolated run returned an error payload") : void 0, result?.deliveryError ? createCronRunDiagnosticsFromError("delivery", result.deliveryError) : void 0),
		...telemetry
	});
	const failPendingPresentationWarningUnlessDelivered = (delivered) => {
		if (pendingPresentationWarningError && delivered !== true) {
			hasFatalErrorPayload = true;
			embeddedRunError = pendingPresentationWarningError;
		}
	};
	const skipHeartbeatDelivery = prepared.deliveryRequested && !hasFatalErrorPayload && isHeartbeatOnlyResponse(deliveryPayloads, resolveHeartbeatAckMaxChars(prepared.agentCfg));
	const sourceDeliveryOutcome = resolveSourceDeliveryOutcome(prepared.sourceDelivery, {
		didSendViaMessageTool: finalRunResult.didSendViaMessagingTool,
		messageToolSentTargets: finalRunResult.messagingToolSentTargets
	});
	if (sourceDeliveryOutcome.visibleDeliveries.length > 0) {
		const { queueCronMessageToolDeliveryAwareness } = await loadCronDeliveryRuntime();
		await queueCronMessageToolDeliveryAwareness({
			cfg: prepared.cfgWithAgentDefaults,
			job: prepared.input.job,
			agentId: prepared.agentId,
			agentSessionKey: prepared.agentSessionKey,
			runStartedAt: execution.runStartedAt,
			resolvedDelivery: prepared.resolvedDelivery,
			sourceDeliveryOutcome
		});
	}
	const hasCommittedTerminalProgress = hasCommittedMessagingToolDeliveryEvidence(finalRunResult) || finalRunResult.didSendDeterministicApprovalPrompt === true || hasAcceptedSessionSpawn(finalRunResult.acceptedSessionSpawns) || (finalRunResult.successfulCronAdds ?? 0) > 0;
	const hasIntentionalSilentReply = finalRunResult.meta?.terminalReplyKind === "silent-empty" || isSilentReplyPayloadText(finalRunResult.meta?.finalAssistantRawText) || isSilentReplyPayloadText(finalRunResult.meta?.finalAssistantVisibleText);
	if (prepared.deliveryRequested && !hasFatalErrorPayload && !sourceDeliveryOutcome.satisfiesSourceDelivery && !hasCommittedTerminalProgress && !hasIntentionalSilentReply && deliveryPayloads.length === 0 && normalizeOptionalString(synthesizedText) === void 0) {
		const error = "cron isolated run completed without a final assistant payload";
		return prepared.withRunSession({
			status: "error",
			error,
			summary: error,
			outputText: error,
			delivered: false,
			deliveryAttempted: false,
			diagnostics: mergeCronRunDiagnostics(runDiagnostics, createCronRunDiagnosticsFromError("agent-run", error)),
			...telemetry
		});
	}
	if (hasFatalStructuredErrorPayload && prepared.deliveryRequested) {
		const { cleanupDirectCronSession } = await loadCronDeliveryRuntime();
		await cleanupDirectCronSession({
			job: prepared.input.job,
			agentSessionKey: prepared.agentSessionKey,
			sessionId: prepared.currentRunSessionId(),
			lifecycleRevision: prepared.cronSession.lifecycleRevision,
			sessionUpdatedAt: prepared.cronSession.sessionEntry.updatedAt,
			beforeSessionDelete: params.beforeSessionDelete,
			retireReason: "cron-delete-after-run-fatal-error"
		});
		params.markCronRunSessionCleanupAttempted();
		const deliveryTrace = buildCronDeliveryTrace({
			deliveryPlan: prepared.deliveryPlan,
			resolvedDelivery: prepared.resolvedDelivery,
			sourceDeliveryOutcome,
			fallbackUsed: false,
			delivered: sourceDeliveryOutcome.verifiedMessageToolDelivery
		});
		return resolveRunOutcome({
			delivered: sourceDeliveryOutcome.verifiedMessageToolDelivery,
			deliveryAttempted: sourceDeliveryOutcome.verifiedMessageToolDelivery,
			delivery: deliveryTrace
		});
	}
	const { dispatchCronDelivery, resolveCronDeliveryBestEffort } = await loadCronDeliveryRuntime();
	const deliveryResult = await dispatchCronDelivery({
		cfg: prepared.input.cfg,
		cfgWithAgentDefaults: prepared.cfgWithAgentDefaults,
		deps: prepared.input.deps,
		job: prepared.input.job,
		agentId: prepared.agentId,
		agentSessionKey: prepared.agentSessionKey,
		runSessionKey: prepared.runSessionKey,
		sessionId: prepared.currentRunSessionId(),
		lifecycleRevision: prepared.cronSession.lifecycleRevision,
		sessionUpdatedAt: prepared.cronSession.sessionEntry.updatedAt,
		beforeSessionDelete: params.beforeSessionDelete,
		runStartedAt: execution.runStartedAt,
		runEndedAt: execution.runEndedAt,
		timeoutMs: prepared.timeoutMs,
		resolvedDelivery: prepared.resolvedDelivery,
		deliveryRequested: prepared.deliveryRequested,
		skipHeartbeatDelivery,
		sourceDeliveryOutcome,
		deliveryBestEffort: resolveCronDeliveryBestEffort(prepared.input.job),
		deliveryPayloadHasStructuredContent,
		deliveryPayloads,
		synthesizedText,
		ttsAuto: prepared.cronSession.sessionEntry.ttsAuto,
		summary,
		outputText,
		telemetry,
		abortSignal: prepared.input.abortSignal ?? prepared.input.signal,
		isAborted: params.isAborted,
		abortReason: params.abortReason,
		withRunSession: prepared.withRunSession
	});
	if (deliveryResult.cronRunSessionCleanupAttempted) params.markCronRunSessionCleanupAttempted();
	const deliveryTrace = buildCronDeliveryTrace({
		deliveryPlan: prepared.deliveryPlan,
		resolvedDelivery: prepared.resolvedDelivery,
		sourceDeliveryOutcome,
		fallbackUsed: prepared.deliveryRequested && deliveryResult.deliveryAttempted && !sourceDeliveryOutcome.satisfiesSourceDelivery,
		delivered: deliveryResult.delivered
	});
	if (deliveryResult.result) {
		const deliveryError = deliveryResult.result.deliveryError ?? deliveryResult.deliveryError;
		const deliveryDiagnosticError = deliveryError ?? (deliveryResult.result.status === "error" ? deliveryResult.result.error : void 0);
		const resultWithDeliveryMeta = {
			...deliveryResult.result,
			delivered: deliveryResult.result.delivered ?? deliveryResult.delivered,
			deliveryAttempted: deliveryResult.result.deliveryAttempted ?? deliveryResult.deliveryAttempted,
			deliveryError,
			delivery: deliveryTrace,
			diagnostics: mergeCronRunDiagnostics(runDiagnostics, deliveryResult.result.diagnostics, deliveryDiagnosticError ? createCronRunDiagnosticsFromError("delivery", deliveryDiagnosticError) : void 0)
		};
		failPendingPresentationWarningUnlessDelivered(resultWithDeliveryMeta.delivered ?? deliveryResult.delivered);
		if (!hasFatalErrorPayload) {
			if (deliveryResult.result.status === "error" && deliveryResult.result.errorKind !== "delivery-target" && !params.isAborted()) {
				const failedDeliveryError = resultWithDeliveryMeta.error;
				const successfulResult = {
					...resultWithDeliveryMeta,
					status: "ok",
					delivered: resultWithDeliveryMeta.delivered ?? deliveryResult.delivered,
					...failedDeliveryError ? { deliveryError: failedDeliveryError } : {}
				};
				delete successfulResult.error;
				delete successfulResult.errorKind;
				return successfulResult;
			}
			return resultWithDeliveryMeta;
		}
		if (deliveryResult.result.status !== "ok") return resultWithDeliveryMeta;
		return resolveRunOutcome({
			delivered: deliveryResult.result.delivered,
			deliveryAttempted: resultWithDeliveryMeta.deliveryAttempted,
			delivery: deliveryTrace
		});
	}
	summary = deliveryResult.summary;
	outputText = deliveryResult.outputText;
	failPendingPresentationWarningUnlessDelivered(deliveryResult.delivered);
	return resolveRunOutcome({
		delivered: deliveryResult.delivered,
		deliveryAttempted: deliveryResult.deliveryAttempted,
		deliveryError: deliveryResult.deliveryError,
		delivery: deliveryTrace
	});
}
/**
* Release runtime references held by a completed isolated cron run.
*
* After the final durable write and delivery complete, the cron session store
* and run context are no longer needed in memory.  This shallow disposal prevents
* the heap-retention pattern described in #85019 where ~113k copies of the skill
* prompt string accumulated through cron run contexts that were never released.
*
* O(1) — nulls known large fields without deep traversal.  MUST run after the
* final `persistSessionEntry()` and delivery construction, never before.
*/
async function disposeCronRunContext(params) {
	releaseAgentRunContext(params.sessionId, params.runContextOwnerToken);
	if (params.ownsRunContext) await retireSessionMcpRuntime({
		sessionId: params.sessionId,
		reason: "isolated-cron-dispose",
		onError: (error, sid) => {
			logWarn(`[cron] Failed to retire MCP runtime during isolated cron dispose ${sid}: ${String(error)}`);
		}
	}).catch(() => {});
	params.cronSession.store = void 0;
}
/** Runs one isolated cron agent turn, including setup, execution, delivery, and persistence. */
async function runCronIsolatedAgentTurn(params) {
	const admittedLifecycleGeneration = getAgentEventLifecycleGeneration();
	const upstreamAbortSignal = params.abortSignal ?? params.signal;
	const lifecycleAbortController = new AbortController();
	const abortSignal = upstreamAbortSignal ? AbortSignal.any([upstreamAbortSignal, lifecycleAbortController.signal]) : lifecycleAbortController.signal;
	const isAborted = () => abortSignal?.aborted ?? false;
	const abortReason = () => resolveCronAbortReasonText(abortSignal?.reason) ?? "cron: job execution timed out";
	const isFastTestEnv = process.env.OPENCLAW_TEST_FAST === "1";
	const prepared = await prepareCronRunContext({
		input: {
			...params,
			abortSignal
		},
		isFastTestEnv,
		onLifecycleInterrupt: () => lifecycleAbortController.abort(createAgentRunRestartAbortError())
	});
	if (!prepared.ok) return prepared.result;
	const initialSessionId = prepared.context.cronSession.sessionEntry.sessionId;
	const ownsRunContext = params.job.sessionTarget === "isolated";
	let runContextOwnerToken;
	let runLifecycleGeneration = admittedLifecycleGeneration;
	let executionStarted = false;
	const notifyExecutionStarted = (info) => {
		executionStarted = true;
		if (info?.lifecycleGeneration) runLifecycleGeneration = info.lifecycleGeneration;
		params.onExecutionStarted?.({
			jobId: params.job.id,
			agentId: prepared.context.agentId,
			sessionId: prepared.context.currentRunSessionId(),
			sessionKey: prepared.context.runSessionKey,
			phase: "runner_entered",
			provider: prepared.context.liveSelection.provider,
			model: prepared.context.liveSelection.model
		});
	};
	const notifyExecutionPhase = (info) => {
		params.onExecutionPhase?.({
			jobId: params.job.id,
			agentId: prepared.context.agentId,
			sessionId: prepared.context.currentRunSessionId(),
			sessionKey: prepared.context.runSessionKey,
			provider: prepared.context.liveSelection.provider,
			model: prepared.context.liveSelection.model,
			...info
		});
	};
	const turnStartedAtMs = Date.now();
	const messageLifecycle = (() => {
		try {
			const lifecycle = createDiagnosticMessageLifecycle({
				enabled: isDiagnosticsEnabled(params.cfg),
				sessionId: prepared.context.runSessionId,
				sessionKey: prepared.context.runSessionKey,
				channel: "cron",
				source: "cron-isolated",
				startedAtMs: turnStartedAtMs,
				trackSessionState: true
			});
			lifecycle.markProcessing();
			return lifecycle;
		} catch (error) {
			prepared.context.sessionWorkAdmission.release();
			throw error;
		}
	})();
	let outcome = "completed";
	let outcomeError;
	let cronRunSessionCleanupAttempted = false;
	try {
		assertAgentRunLifecycleGenerationCurrent(runLifecycleGeneration);
		const existingRunContext = getAgentRunContext(initialSessionId);
		runContextOwnerToken = claimAgentRunContext(initialSessionId, {
			sessionKey: ownsRunContext || !existingRunContext?.sessionKey ? prepared.context.runSessionKey : existingRunContext.sessionKey,
			sessionId: initialSessionId,
			lifecycleGeneration: runLifecycleGeneration,
			cronRunsByJobId: /* @__PURE__ */ new Map([[params.job.id, { pacingEnabled: params.job.pacing !== void 0 }]])
		}, {
			trackOwner: true,
			ownsContext: ownsRunContext
		});
		const { executeCronRun } = await loadCronExecutorRuntime();
		const executionParams = {
			cfg: params.cfg,
			cfgWithAgentDefaults: prepared.context.cfgWithAgentDefaults,
			job: params.job,
			agentId: prepared.context.agentId,
			agentDir: prepared.context.agentDir,
			agentSessionKey: prepared.context.agentSessionKey,
			runSessionKey: prepared.context.runSessionKey,
			usesDetachedRunSession: prepared.context.usesDetachedRunSession,
			workspaceDir: prepared.context.workspaceDir,
			lane: params.lane,
			resolvedDelivery: {
				channel: prepared.context.resolvedDelivery.channel,
				to: prepared.context.resolvedDelivery.to,
				accountId: prepared.context.resolvedDelivery.accountId,
				threadId: prepared.context.resolvedDelivery.threadId
			},
			resolvedDeliveryOk: prepared.context.resolvedDelivery.ok,
			deliveryRequested: prepared.context.deliveryRequested,
			sourceDelivery: prepared.context.sourceDelivery,
			messageToolPromptEnabled: prepared.context.messageToolPromptEnabled,
			skillsSnapshot: prepared.context.skillsSnapshot,
			agentPayload: prepared.context.agentPayload,
			useSubagentFallbacks: prepared.context.useSubagentFallbacks,
			inheritDefaultFallbacksForAgentStringModel: prepared.context.inheritDefaultFallbacksForAgentStringModel,
			modelFallbacksOverride: prepared.context.modelFallbacksOverride,
			agentVerboseDefault: prepared.context.agentCfg?.verboseDefault,
			liveSelection: prepared.context.liveSelection,
			cronSession: prepared.context.cronSession,
			commandBody: prepared.context.commandBody,
			persistSessionEntry: prepared.context.persistSessionEntry,
			persistRunContinuationSession: prepared.context.runContinuationSession?.sync,
			setRunContinuationCliExecutionProvider: prepared.context.runContinuationSession?.setCliExecutionProvider,
			abortSignal,
			onExecutionStarted: notifyExecutionStarted,
			onExecutionPhase: notifyExecutionPhase,
			onLaneWait: params.onLaneWait,
			abortReason,
			isAborted,
			thinkLevel: prepared.context.thinkLevel,
			thinkingCatalog: prepared.context.thinkingCatalog,
			timeoutMs: prepared.context.timeoutMs,
			runTimeoutOverrideMs: prepared.context.runTimeoutOverrideMs,
			suppressExecNotifyOnExit: prepared.context.suppressExecNotifyOnExit
		};
		const execution = await prepared.context.sessionWorkAdmission.run(() => withAgentRunLifecycleGeneration(runLifecycleGeneration, () => executeCronRun(executionParams)));
		const finalized = await finalizeCronRun({
			prepared: prepared.context,
			execution,
			abortReason,
			isAborted,
			markCronRunSessionCleanupAttempted: () => {
				cronRunSessionCleanupAttempted = true;
			},
			beforeSessionDelete: prepared.context.sessionWorkAdmission.release
		});
		if (finalized.status === "error") {
			outcome = "error";
			outcomeError = finalized.error;
		}
		const delayMs = consumeCronNextCheckProposal(initialSessionId, params.job.id);
		return finalized.status !== "ok" || delayMs === void 0 ? finalized : {
			...finalized,
			nextCheck: { delayMs }
		};
	} catch (err) {
		consumeCronNextCheckProposal(initialSessionId, params.job.id);
		const isCronLaneTimeout = isAborted() || isCronNestedLaneTaskTimeoutError(err);
		const error = isCronLaneTimeout ? abortReason() : String(err);
		outcome = "error";
		outcomeError = error;
		return prepared.context.withRunSession({
			status: "error",
			error,
			executionStarted,
			provider: prepared.context.liveSelection.provider,
			model: prepared.context.liveSelection.model,
			diagnostics: mergeCronRunDiagnostics(prepared.context.preflightDiagnostics, createCronRunDiagnosticsFromError(isCronLaneTimeout ? "cron-setup" : "agent-run", isCronLaneTimeout ? error : err))
		});
	} finally {
		try {
			await prepared.context.runContinuationSession?.seal();
		} catch (sealError) {
			logWarn(`[cron:${params.job.id}] Failed to seal run continuation during cleanup: ${String(sealError)}`);
		}
		const finalSessionRef = {
			sessionId: prepared.context.currentRunSessionId(),
			sessionKey: prepared.context.runSessionKey
		};
		messageLifecycle.markIdle(void 0, finalSessionRef);
		messageLifecycle.markProcessed(outcome, {
			...finalSessionRef,
			error: outcomeError
		});
		try {
			if (!cronRunSessionCleanupAttempted) cronRunSessionCleanupAttempted = await cleanupCronRunSessionAfterRun({
				job: params.job,
				agentSessionKey: prepared.context.agentSessionKey,
				sessionId: prepared.context.currentRunSessionId(),
				lifecycleRevision: prepared.context.cronSession.lifecycleRevision,
				sessionUpdatedAt: prepared.context.cronSession.sessionEntry.updatedAt,
				beforeDelete: prepared.context.sessionWorkAdmission.release,
				reason: "cron-delete-after-run-finally"
			}) !== "not-requested";
		} finally {
			try {
				if (prepared.context.runContinuationSession) try {
					await removeCronRunContinuationSessionIfIdle(prepared.context.runSessionKey);
				} catch (error) {
					logWarn(`[cron:${params.job.id}] Failed to remove unused run continuation: ${String(error)}`);
				}
				await disposeCronRunContext({
					sessionId: initialSessionId,
					cronSession: prepared.context.cronSession,
					ownsRunContext,
					runContextOwnerToken
				});
			} finally {
				prepared.context.sessionWorkAdmission.release();
			}
		}
	}
}
//#endregion
export { buildCronAgentDefaultsConfig as n, resolveCronActiveRuntimeConfig as r, runCronIsolatedAgentTurn as t };
