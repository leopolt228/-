import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { n as createLazyPromise } from "./lazy-promise-EhsWch5m.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { o as toAgentModelListLike } from "./model-input-B7OGjVYg.js";
import { _ as resolveSessionAgentId, d as resolveAgentModelFallbacksOverride, w as hasSessionAutoModelFallbackProvenance } from "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-S7z_Yn4H.js";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-Cq9SwNpx.js";
import { t as resolveAgentHarnessPolicy } from "./policy-CZpNJ432.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-DqR_mVNH.js";
import { l as resolveActiveProviderThinkingProfile } from "./thinking-DDtbvjQ1.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-CV4VBWUf.js";
import { i as listRegisteredAgentHarnesses } from "./registry-D03pg4Q5.js";
import { i as resolveSessionFilePathOptions, r as resolveSessionFilePath } from "./paths-BpMRJ7TJ.js";
import { i as ensureAuthProfileStore } from "./store-BTcmQtbp.js";
import { t as formatDurationCompact } from "./format-duration-DKk9BtRb.js";
import "./model-selection-Dx2ArePR.js";
import { o as shouldPreferActiveRuntimeAliasAuthLabel, t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-XZ8Sb-m9.js";
import { n as formatTaskStatusDetail, r as formatTaskStatusTitle, t as buildTaskStatusSnapshot } from "./task-status-BIpP_2FL.js";
import { l as listTasksForSessionKeyForStatus, s as listTasksForAgentIdForStatus } from "./task-status-access-CLMWwpdp.js";
import { t as formatTokenCount } from "./token-format-D942KbWN.js";
import { r as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-CGtM0hst.js";
import { o as resolveContextTokensForModel, s as waitForContextWindowCacheLoad } from "./context-B5jw_tCX.js";
import { t as resolveFastModeState } from "./fast-mode-DLmTLUz8.js";
import { t as resolveAgentHarnessAutoSelectionHint } from "./auto-selection-Cid2o--p.js";
import { n as formatUsd } from "./usage-format-eg_0FVCW.js";
import { n as resolveNormalizedAccountEntry } from "./account-lookup-DgErwy8P.js";
import { c as resolveMainSessionAlias, s as resolveInternalSessionKey } from "./sessions-helpers-DVMRiynf.js";
import { t as normalizeGroupActivation } from "./group-activation-MKTJBUwi.js";
import { t as resolveModelAuthLabel } from "./model-auth-label-IBoMMERM.js";
import { c as resolveUsageProviderId } from "./provider-usage.shared-C4x5KiVT.js";
import { n as resolveSelectedAndActiveModel } from "./model-runtime-CT6T4rg0.js";
import { r as formatUsageWindowSummary } from "./provider-usage-DRFdaR8s.js";
import { t as loadProviderUsageSummary } from "./provider-usage.load-DTmg1Adu.js";
import { i as shouldUseCodexSyntheticUsageForRuntime, r as resolveUsageCredentialType, t as buildCodexSyntheticUsageAuth } from "./codex-synthetic-usage-ByJXt8Kd.js";
import { t as resolveActiveFallbackState } from "./fallback-notice-state-DJRCRutj.js";
import { r as formatCompactPluginHealthLine } from "./status-plugin-health-BdTMptTh.js";
import { i as formatMissingCostEntries } from "./session-cost-usage-totals-D4e-85ui.js";
import { c as resolveExistingUsageSessionFile, i as loadSessionCostSummariesFromCache } from "./session-cost-usage-BUCC0ilC.js";
import path from "node:path";
import os from "node:os";
//#region src/status/status-runtime-lines.ts
function buildStatusUptimeLine() {
	const format = (ms) => formatDurationCompact(ms, { spaced: true }) ?? "0s";
	const gatewayMs = Math.max(0, Math.round(process.uptime() * 1e3));
	const systemMs = Math.max(0, Math.round(os.uptime() * 1e3));
	return `⏱️ Uptime: gateway ${format(gatewayMs)} · system ${format(systemMs)}`;
}
async function resolveSessionCostLine(params) {
	const sessionId = params.sessionEntry?.sessionId?.trim();
	if (!sessionId) return;
	let sessionFile;
	try {
		const pathOpts = resolveSessionFilePathOptions({
			storePath: params.storePath,
			agentId: params.agentId
		});
		sessionFile = resolveExistingUsageSessionFile({
			sessionId,
			sessionEntry: params.sessionEntry,
			sessionFile: resolveSessionFilePath(sessionId, params.sessionEntry, pathOpts),
			agentId: params.agentId
		});
	} catch {
		return;
	}
	if (!sessionFile) return;
	const now = Date.now();
	const date = new Date(now);
	const startMs = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
	let timeout;
	try {
		const loaded = await Promise.race([loadSessionCostSummariesFromCache({
			sessions: [{
				sessionId,
				sessionFile
			}],
			config: params.cfg,
			agentId: params.agentId,
			startMs,
			endMs: now,
			dayBucket: {
				mode: "utc-offset",
				utcOffsetMinutes: -date.getTimezoneOffset()
			},
			requestRefresh: false
		}), new Promise((_, reject) => {
			timeout = setTimeout(() => reject(/* @__PURE__ */ new Error("session cost timeout")), 3500);
		})]).finally(() => {
			if (timeout) clearTimeout(timeout);
		});
		const summary = loaded.cacheStatus.status === "fresh" ? loaded.summaries[0] : null;
		if (!summary) return;
		const cost = summary.missingCostEntries > 0 ? `missing cost: ${formatMissingCostEntries(summary)}` : formatUsd(summary.totalCost);
		return `💵 ${cost ? `${cost} · ` : ""}${formatTokenCount(summary.totalTokens)} tok (today)`;
	} catch {
		return;
	}
}
async function appendSessionCostLine(usageLine, cfg, agentId, sessionEntry, storePath) {
	const line = await resolveSessionCostLine({
		cfg,
		agentId,
		...sessionEntry ? { sessionEntry } : {},
		...storePath ? { storePath } : {}
	});
	return line ? [usageLine, line].filter(Boolean).join("\n") : usageLine;
}
//#endregion
//#region src/status/status-text.ts
const USAGE_OAUTH_ONLY_PROVIDERS = /* @__PURE__ */ new Set([
	"anthropic",
	"github-copilot",
	"google-gemini-cli",
	"openai"
]);
const CODEX_APP_SERVER_HOME_DIRNAME = "codex-home";
function resolveStatusChannelFeatureLine(params) {
	if (normalizeOptionalLowercaseString(params.statusChannel) !== "telegram") return;
	const telegramConfig = params.cfg.channels?.telegram;
	const accountId = normalizeAccountId(params.statusAccountId ?? params.sessionEntry?.lastAccountId ?? params.sessionEntry?.origin?.accountId ?? telegramConfig?.defaultAccount);
	const accountConfig = resolveNormalizedAccountEntry(telegramConfig?.accounts, accountId, normalizeAccountId);
	if ((accountConfig?.richMessages ?? telegramConfig?.richMessages) === true) return "Telegram rich messages: on · Bot API 10.1 sendRichMessage enabled";
	return accountConfig?.richMessages === false ? "Telegram rich messages: off · enable richMessages for this Telegram account" : "Telegram rich messages: off · set channels.telegram.richMessages=true for tables/details/rich media";
}
const loadStatusMessageRuntime = createLazyPromise(() => import("./status-message.runtime.js").then((module) => module.loadStatusMessageRuntimeModule()), { cacheRejections: true });
const loadAgentThinkingRuntime = createLazyRuntimeModule(() => import("./thinking-runtime-YErOXei6.js"));
const loadThinkingLevelRuntime = createLazyRuntimeModule(() => import("./thinking-BKVjhTas.js"));
const loadStatusSubagentsRuntime = createLazyRuntimeModule(() => import("./status-subagents.runtime.js"));
const loadStatusQueueRuntime = createLazyRuntimeModule(() => import("./status-queue.runtime.js"));
const loadStatusPluginHealthRuntime = createLazyRuntimeModule(() => import("./status-plugin-health.runtime.js"));
function resolveStatusRuntimeContextTokens(params) {
	return resolveContextTokensForModel({
		cfg: params.cfg,
		provider: params.provider,
		model: params.model,
		allowAsyncLoad: false
	});
}
function shouldLoadUsageSummary(params) {
	if (!params.provider) return false;
	if (!USAGE_OAUTH_ONLY_PROVIDERS.has(params.provider)) return true;
	const auth = normalizeOptionalLowercaseString(params.selectedModelAuth);
	return Boolean(params.credentialType === "oauth" || params.credentialType === "token" || auth?.startsWith("oauth") || auth?.startsWith("token"));
}
function resolveCodexSyntheticUsageAuthProfileId(params) {
	const normalizedProfileId = params.profileId?.trim();
	if (!normalizedProfileId) return;
	try {
		const credential = ensureAuthProfileStore(params.agentDir, {
			allowKeychainPrompt: false,
			config: params.cfg,
			readOnly: true,
			syncExternalCli: false
		}).profiles[normalizedProfileId];
		if (!credential) return;
		const credentialProvider = normalizeOptionalLowercaseString(credential.provider);
		return resolveProviderIdForAuth(credential.provider, { config: params.cfg }) === "openai" || credentialProvider === "openai-codex" || credentialProvider === "codex-cli" ? normalizedProfileId : void 0;
	} catch {
		return;
	}
}
function formatSessionTaskLine(sessionKey) {
	const snapshot = buildTaskStatusSnapshot(listTasksForSessionKeyForStatus(sessionKey));
	const task = snapshot.focus;
	if (!task) return;
	const headline = snapshot.activeCount > 0 ? `${snapshot.activeCount} active · ${snapshot.totalCount} total` : snapshot.recentFailureCount > 0 ? `${snapshot.recentFailureCount} recent failure${snapshot.recentFailureCount === 1 ? "" : "s"}` : "recently finished";
	const title = formatTaskStatusTitle(task);
	const detail = formatTaskStatusDetail(task);
	const parts = [
		headline,
		task.runtime,
		title,
		detail
	].filter(Boolean);
	return parts.length ? `📌 Tasks: ${parts.join(" · ")}` : void 0;
}
async function resolveStatusHarnessId(params) {
	try {
		const sessionRuntime = resolveSessionRuntimeOverrideForProvider({
			provider: params.provider,
			entry: params.sessionEntry,
			cfg: params.cfg
		});
		const configuredRuntime = resolveAgentHarnessPolicy({
			provider: params.provider,
			modelId: params.model,
			config: params.cfg,
			agentId: params.agentId,
			sessionKey: params.sessionKey
		}).runtime;
		const runtime = sessionRuntime ?? configuredRuntime;
		if (runtime !== "auto") return normalizeOptionalLowercaseString(runtime) || void 0;
		if (listRegisteredAgentHarnesses().every(({ harness }) => resolveAgentHarnessAutoSelectionHint({
			harness,
			provider: params.provider
		}) !== void 0)) return "openclaw";
		const { resolveEffectiveAgentRuntime } = await loadAgentThinkingRuntime();
		return normalizeOptionalLowercaseString(resolveEffectiveAgentRuntime({
			cfg: params.cfg,
			provider: params.provider,
			modelId: params.model,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionEntry: params.sessionEntry
		})) || void 0;
	} catch {
		return;
	}
}
function resolveStatusRuntimeProvider(params) {
	const harness = normalizeOptionalLowercaseString(params.effectiveHarness);
	const provider = normalizeOptionalLowercaseString(params.provider);
	if (harness === "codex" && (provider === "openai" || provider === "codex")) return "openai";
	if (harness === "claude-cli" && provider === "anthropic") return "claude-cli";
	return params.provider;
}
function resolveStatusCodexCliCredentialsHome(params) {
	return normalizeOptionalLowercaseString(params.effectiveHarness) === "codex" ? path.join(params.agentDir, CODEX_APP_SERVER_HOME_DIRNAME) : void 0;
}
function formatAgentTaskCountsLine(agentId) {
	const snapshot = buildTaskStatusSnapshot(listTasksForAgentIdForStatus(agentId));
	if (snapshot.totalCount === 0) return;
	return `📌 Tasks: ${snapshot.activeCount} active · ${snapshot.totalCount} total · agent-local`;
}
async function resolveRuntimePluginHealthLine() {
	try {
		const { collectRuntimePluginHealthSnapshot } = await loadStatusPluginHealthRuntime();
		return formatCompactPluginHealthLine(collectRuntimePluginHealthSnapshot());
	} catch {
		return "⚠️ Plugins: health unavailable";
	}
}
async function buildStatusText(params) {
	const { cfg, sessionEntry, sessionKey, parentSessionKey, sessionScope, storePath, statusChannel, provider, model, contextTokens, thinkingCatalog, resolvedThinkLevel, resolvedFastMode, resolvedVerboseLevel, resolvedReasoningLevel, resolvedElevatedLevel, resolveDefaultThinkingLevel, isGroup, defaultGroupActivation } = params;
	const statusAgentId = sessionKey ? resolveSessionAgentId({
		sessionKey,
		config: cfg
	}) : resolveDefaultAgentId(cfg);
	const statusAgentDir = resolveAgentDir(cfg, statusAgentId);
	const statusWorkspaceDir = params.workspaceDir ?? sessionEntry?.spawnedWorkspaceDir ?? resolveAgentWorkspaceDir(cfg, statusAgentId);
	const selectedProvider = sessionEntry?.providerOverride?.trim() ?? provider;
	const selectedModel = sessionEntry?.modelOverride?.trim() ?? model;
	const modelRefs = resolveSelectedAndActiveModel({
		selectedProvider,
		selectedModel,
		sessionEntry,
		parseSelectedProvider: Boolean(sessionEntry?.modelOverride?.trim() && !sessionEntry?.providerOverride?.trim())
	});
	const selectedLookupProvider = modelRefs.selected.provider || selectedProvider || provider;
	const selectedLookupModel = modelRefs.selected.model || selectedModel || model;
	const effectiveHarness = params.resolvedHarness ?? await resolveStatusHarnessId({
		cfg,
		provider: selectedLookupProvider,
		model: selectedLookupModel,
		agentId: statusAgentId,
		sessionKey,
		sessionEntry
	});
	const codexCliCredentialsHome = resolveStatusCodexCliCredentialsHome({
		agentDir: statusAgentDir,
		effectiveHarness
	});
	const selectedStatusProvider = resolveStatusRuntimeProvider({
		provider: selectedLookupProvider,
		effectiveHarness
	});
	const selectedAuthProviders = listOpenAIAuthProfileProvidersForAgentRuntime({
		provider: selectedLookupProvider,
		harnessRuntime: effectiveHarness,
		config: cfg
	});
	const activeProvider = modelRefs.active.provider || provider;
	const activeStatusProvider = resolveStatusRuntimeProvider({
		provider: activeProvider,
		effectiveHarness
	});
	const activeAuthProviders = listOpenAIAuthProfileProvidersForAgentRuntime({
		provider: activeProvider,
		harnessRuntime: effectiveHarness,
		config: cfg
	});
	let selectedModelAuth = Object.hasOwn(params, "modelAuthOverride") ? params.modelAuthOverride : resolveModelAuthLabel({
		provider: selectedStatusProvider,
		acceptedProviderIds: selectedAuthProviders,
		cfg,
		sessionEntry,
		agentDir: statusAgentDir,
		workspaceDir: statusWorkspaceDir,
		codexCliCredentialsHome,
		includeExternalProfiles: false
	});
	const activeModelAuth = Object.hasOwn(params, "activeModelAuthOverride") ? params.activeModelAuthOverride : modelRefs.activeDiffers ? resolveModelAuthLabel({
		provider: activeStatusProvider,
		acceptedProviderIds: activeAuthProviders,
		cfg,
		sessionEntry,
		agentDir: statusAgentDir,
		workspaceDir: statusWorkspaceDir,
		codexCliCredentialsHome,
		includeExternalProfiles: false
	}) : selectedModelAuth;
	const runtimeAliasModelEquivalent = areRuntimeModelRefsEquivalent(modelRefs.selected.label, modelRefs.active.label, { config: cfg });
	const fallbackState = resolveActiveFallbackState({
		selectedModelRef: modelRefs.selected.label || "unknown",
		activeModelRef: modelRefs.active.label || "unknown",
		config: cfg,
		state: sessionEntry
	});
	if (shouldPreferActiveRuntimeAliasAuthLabel({
		runtimeAliasModelEquivalent,
		selectedAuthLabel: selectedModelAuth,
		activeAuthLabel: activeModelAuth
	})) selectedModelAuth = activeModelAuth;
	const activeRuntimeIsAuthoritative = !modelRefs.activeDiffers || fallbackState.active || hasSessionAutoModelFallbackProvenance(sessionEntry) || runtimeAliasModelEquivalent;
	const usageAuthLabel = activeRuntimeIsAuthoritative ? activeModelAuth : selectedModelAuth;
	const usageStatusProvider = activeRuntimeIsAuthoritative ? activeStatusProvider : selectedStatusProvider;
	const usageProvider = activeRuntimeIsAuthoritative ? activeProvider : selectedLookupProvider;
	const selectedUsageCredentialType = resolveUsageCredentialType(usageAuthLabel);
	const useCodexSyntheticUsage = selectedUsageCredentialType !== "api_key" && shouldUseCodexSyntheticUsageForRuntime({
		provider: usageStatusProvider,
		effectiveHarness,
		sessionHarnessId: sessionEntry?.agentHarnessId
	});
	const codexUsageAuthProfileId = useCodexSyntheticUsage ? resolveCodexSyntheticUsageAuthProfileId({
		profileId: sessionEntry?.authProfileOverride,
		cfg,
		agentDir: statusAgentDir
	}) : void 0;
	const usageCredentialType = useCodexSyntheticUsage ? "token" : selectedUsageCredentialType;
	const currentUsageProvider = resolveUsageProviderId(usageStatusProvider, { credentialType: usageCredentialType }) ?? resolveUsageProviderId(usageProvider, { credentialType: usageCredentialType });
	let usageLine = null;
	if (currentUsageProvider && shouldLoadUsageSummary({
		provider: currentUsageProvider,
		selectedModelAuth: usageAuthLabel,
		credentialType: usageCredentialType
	})) try {
		const usageSummaryTimeoutMs = useCodexSyntheticUsage ? 8e3 : 3500;
		let usageTimeout;
		const usageEntry = (await Promise.race([loadProviderUsageSummary({
			timeoutMs: usageSummaryTimeoutMs,
			providers: [currentUsageProvider],
			agentDir: statusAgentDir,
			workspaceDir: statusWorkspaceDir,
			config: cfg,
			auth: useCodexSyntheticUsage ? [buildCodexSyntheticUsageAuth({ authProfileId: codexUsageAuthProfileId })] : void 0
		}), new Promise((_, reject) => {
			usageTimeout = setTimeout(() => reject(/* @__PURE__ */ new Error("usage summary timeout")), usageSummaryTimeoutMs);
		})]).finally(() => {
			if (usageTimeout) clearTimeout(usageTimeout);
		})).providers[0];
		if (usageEntry && !usageEntry.error && (usageEntry.windows.length > 0 || Boolean(usageEntry.billing?.length) || Boolean(usageEntry.summary?.trim()))) {
			const summaryLine = formatUsageWindowSummary(usageEntry, {
				now: Date.now(),
				maxWindows: 2,
				includeResets: true
			});
			if (summaryLine) usageLine = `📊 Usage: ${summaryLine}`;
		}
	} catch {
		usageLine = null;
	}
	usageLine = await appendSessionCostLine(usageLine, cfg, statusAgentId, sessionEntry, storePath);
	const { getFollowupQueueDepth, resolveQueueSettings } = await loadStatusQueueRuntime();
	const queueSettings = resolveQueueSettings({
		cfg,
		channel: statusChannel,
		sessionEntry
	});
	const queueKey = sessionKey ?? sessionEntry?.sessionId;
	const queueDepth = queueKey ? getFollowupQueueDepth(queueKey) : 0;
	const queueOverrides = Boolean(sessionEntry?.queueDebounceMs ?? sessionEntry?.queueCap ?? sessionEntry?.queueDrop);
	let subagentsLine;
	let taskLine;
	if (sessionKey) {
		const { mainKey, alias } = resolveMainSessionAlias(cfg);
		const requesterKey = resolveInternalSessionKey({
			key: sessionKey,
			alias,
			mainKey
		});
		taskLine = params.skipDefaultTaskLookup ? params.taskLineOverride : params.taskLineOverride ?? formatSessionTaskLine(requesterKey);
		if (!taskLine && !params.skipDefaultTaskLookup) taskLine = formatAgentTaskCountsLine(statusAgentId);
		const { buildSubagentsStatusLine, countPendingDescendantRuns, listControlledSubagentRuns } = await loadStatusSubagentsRuntime();
		subagentsLine = buildSubagentsStatusLine({
			runs: listControlledSubagentRuns(requesterKey),
			verboseEnabled: resolvedVerboseLevel && resolvedVerboseLevel !== "off",
			pendingDescendantsForRun: (entry) => countPendingDescendantRuns(entry.childSessionKey)
		});
	}
	const groupActivation = isGroup ? normalizeGroupActivation(sessionEntry?.groupActivation) ?? defaultGroupActivation() : void 0;
	const agentDefaults = cfg.agents?.defaults ?? {};
	const agentConfig = resolveAgentConfig(cfg, statusAgentId);
	const effectiveFastMode = resolvedFastMode ?? resolveFastModeState({
		cfg,
		provider,
		model,
		agentId: statusAgentId,
		sessionEntry
	}).mode;
	const agentFallbacksOverride = resolveAgentModelFallbacksOverride(cfg, statusAgentId);
	const configuredDefaultRef = resolveDefaultModelForAgent({
		cfg,
		agentId: statusAgentId,
		allowPluginNormalization: false
	});
	const configuredDefaultModelLabel = `${configuredDefaultRef.provider}/${configuredDefaultRef.model}`;
	const pluginHealthLine = Object.hasOwn(params, "pluginHealthLineOverride") ? params.pluginHealthLineOverride : await resolveRuntimePluginHealthLine();
	const channelFeatureLine = resolveStatusChannelFeatureLine({
		cfg,
		statusChannel,
		statusAccountId: params.statusAccountId,
		sessionEntry
	});
	const { buildStatusMessage } = await loadStatusMessageRuntime();
	await waitForContextWindowCacheLoad();
	const explicitThinkingDefault = agentConfig?.thinkingDefault ?? agentDefaults.thinkingDefault;
	const configuredContextTokens = typeof agentConfig?.contextTokens === "number" && agentConfig.contextTokens > 0 ? agentConfig.contextTokens : typeof agentDefaults.contextTokens === "number" && agentDefaults.contextTokens > 0 ? agentDefaults.contextTokens : void 0;
	const runtimeContextTokens = resolveStatusRuntimeContextTokens({
		cfg,
		provider: activeStatusProvider,
		model: modelRefs.active.model || model
	});
	const selectedContextTokens = resolveStatusRuntimeContextTokens({
		cfg,
		provider: selectedStatusProvider,
		model: modelRefs.selected.model || selectedLookupModel
	});
	const statusAgentContextTokens = typeof contextTokens === "number" && contextTokens > 0 && (activeRuntimeIsAuthoritative || contextTokens === configuredContextTokens || contextTokens === selectedContextTokens) ? contextTokens : void 0;
	const statusRuntimeContextTokens = activeRuntimeIsAuthoritative ? runtimeContextTokens ?? (fallbackState.active && typeof contextTokens === "number" && contextTokens > 0 ? contextTokens : void 0) : void 0;
	const requestedThinkLevel = resolvedThinkLevel ?? explicitThinkingDefault ?? await resolveDefaultThinkingLevel() ?? sessionEntry?.thinkingLevel ?? "off";
	const activeThinkingProfile = requestedThinkLevel === "off" ? resolveActiveProviderThinkingProfile({
		provider: selectedLookupProvider,
		context: {
			provider: selectedLookupProvider,
			modelId: selectedLookupModel,
			agentRuntime: effectiveHarness
		}
	}) : void 0;
	const activeProfileSupportsOff = activeThinkingProfile?.levels.some((level) => level.id === "off");
	const effectiveThinkLevel = requestedThinkLevel === "off" && (activeThinkingProfile == null || activeProfileSupportsOff === true) ? "off" : (await loadThinkingLevelRuntime()).resolveSupportedThinkingLevel({
		provider: selectedLookupProvider,
		model: selectedLookupModel,
		level: requestedThinkLevel,
		catalog: thinkingCatalog,
		agentRuntime: effectiveHarness,
		providerPolicySource: normalizeOptionalLowercaseString(effectiveHarness) === "codex" && ["codex", "openai"].includes(normalizeOptionalLowercaseString(selectedLookupProvider) ?? "") ? "active-or-bundled" : "active"
	});
	return buildStatusMessage({
		config: cfg,
		agent: {
			...agentDefaults,
			model: {
				...toAgentModelListLike(agentDefaults.model),
				primary: params.primaryModelLabelOverride ?? `${provider}/${model}`,
				...agentFallbacksOverride === void 0 ? {} : { fallbacks: agentFallbacksOverride }
			},
			...statusAgentContextTokens !== void 0 ? { contextTokens: statusAgentContextTokens } : {},
			thinkingDefault: explicitThinkingDefault,
			verboseDefault: agentDefaults.verboseDefault,
			reasoningDefault: agentConfig?.reasoningDefault ?? agentDefaults.reasoningDefault,
			elevatedDefault: agentDefaults.elevatedDefault
		},
		agentId: statusAgentId,
		configuredDefaultModelLabel,
		explicitConfiguredContextTokens: configuredContextTokens,
		runtimeContextTokens: statusRuntimeContextTokens,
		sessionEntry,
		sessionKey,
		parentSessionKey,
		sessionScope,
		sessionStorePath: storePath,
		groupActivation,
		resolvedThink: effectiveThinkLevel,
		resolvedFast: effectiveFastMode,
		resolvedHarness: effectiveHarness,
		resolvedVerbose: resolvedVerboseLevel,
		resolvedReasoning: resolvedReasoningLevel,
		resolvedElevated: resolvedElevatedLevel,
		modelAuth: selectedModelAuth,
		activeModelAuth,
		uptimeLine: buildStatusUptimeLine(),
		usageLine: usageLine ?? void 0,
		queue: {
			mode: queueSettings.mode,
			depth: queueDepth,
			debounceMs: queueSettings.debounceMs,
			cap: queueSettings.cap,
			dropPolicy: queueSettings.dropPolicy,
			showDetails: queueOverrides
		},
		subagentsLine,
		taskLine,
		pluginHealthLine,
		channelFeatureLine,
		mediaDecisions: params.mediaDecisions,
		includeTranscriptUsage: params.includeTranscriptUsage ?? true
	});
}
//#endregion
export { buildStatusText as t };
