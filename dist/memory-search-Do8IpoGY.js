import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { A as resolvePositiveTimerTimeoutMs, n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-Crk_c9KW.js";
import { _ as uniqueStrings, l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import "./redact-DNq_HeDt.js";
import "./paths-CHQRdQZ3.js";
import "./theme-vjDs9tao.js";
import "./fs-safe-Dy0g6QwA.js";
import "./runtime-ZHfN2VLf.js";
import "./subsystem-Dogzi5wG.js";
import { i as clampNumber, r as clampInt } from "./utils-K2PjeLaV.js";
import "./types.secrets-BgE_Zq2x.js";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import "./sqlite-wal-jkTlXxi6.js";
import "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { r as resolveAgentConfig$1 } from "./agent-scope-config-S7z_Yn4H.js";
import "./parse-duration-Be19e01j.js";
import "./globals-DBBT7Ru5.js";
import "./run-with-concurrency-BHgpSCM6.js";
import "./config-BOMcY2yX.js";
import { R as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db-BZ3-lIlN.js";
import { I as getMemoryEmbeddingProvider } from "./registry-BSBtFA2q.js";
import "./memory-state-BkKwMbMM.js";
import "./mime-De36NoRj.js";
import "./paths-BpMRJ7TJ.js";
import { F as readTranscriptStatsSync } from "./session-accessor-Mu3lv_Tl.js";
import "./transcript-events-DsykQ-Ww.js";
import "./common-C39GdgQ7.js";
import "./internal-runtime-context-BW7WOTKc.js";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DTFzouyz.js";
import "./strip-inbound-meta-CbJ4Y6Dq.js";
import "./input-provenance-B6vSIOBi.js";
import "./heartbeat-Bkwxbekw.js";
import { n as runtimeMemorySecretOwnerId } from "./runtime-config-collectors-fo9_lArf.js";
import "./command-secret-gateway-DmjgS8zs.js";
import "./heartbeat-filter-heuIP_Mh.js";
import "./agent-settings-BDb2FlBy.js";
import "./current-time-sWC78VoB.js";
import "./cli-utils-B33Avitx.js";
import "./help-format-CAcwboTs.js";
import "./progress-DY8jzvl0.js";
import "./session-store-runtime-yTK-eEl-.js";
import "./heartbeat-events-filter-CwG3RmMF.js";
import "./memory-embedding-provider-runtime-C8U8ZwXj.js";
import "./config-schema-BXo5neWF.js";
import { t as getEmbeddingProvider } from "./embedding-provider-runtime-CAAeF26z.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region packages/memory-host-sdk/src/host/openclaw-runtime.ts
/** Returns an opaque revision that changes for every canonical transcript mutation. */
function readTranscriptContentRevisionSync(params) {
	const stats = readTranscriptStatsSync(params);
	return [
		"sqlite",
		stats.maxSeq,
		stats.sizeBytes,
		stats.eventCount,
		stats.lastMutationAtMs ?? "",
		stats.lastObservedMutationAtMs ?? ""
	].join(":");
}
//#endregion
//#region packages/memory-host-sdk/src/host/config-utils.ts
function resolveRememberAcrossConversations(cfg, agentId) {
	const defaults = cfg.agents?.defaults?.memorySearch;
	const explicit = (resolveAgentConfig(cfg, agentId)?.memorySearch)?.rememberAcrossConversations ?? defaults?.rememberAcrossConversations;
	if (explicit !== void 0) return explicit;
	return (cfg.session?.dmScope === void 0 || cfg.session.dmScope === "main") && !cfg.bindings?.some((binding) => {
		if (!binding || typeof binding !== "object") return false;
		const session = binding.session;
		return Boolean(session) && typeof session === "object" && session.dmScope !== void 0;
	});
}
/** Root memory filename used in agent workspaces. */
const MEMORY_HOST_ROOT_FILENAME = "MEMORY.md";
const DEFAULT_AGENT_ID = "main";
const LEGACY_STATE_DIRNAMES = [".clawdbot"];
const NEW_STATE_DIRNAME = ".openclaw";
/** Treat shell-placeholder home values as absent. */
function normalizeHomeValue(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed || trimmed === "undefined" || trimmed === "null") return;
	return trimmed;
}
/** Resolve the underlying OS home before applying OpenClaw-specific overrides. */
function resolveRawOsHomeDir(env, homedir) {
	return normalizeHomeValue(env.HOME) ?? normalizeHomeValue(env.USERPROFILE) ?? normalizeHomeValue(homedir());
}
/** Resolve OPENCLAW_HOME or the OS home, falling back to cwd for hermetic tests. */
function resolveRequiredHomeDir(env = process.env, homedir = os.homedir) {
	const explicitHome = normalizeHomeValue(env.OPENCLAW_HOME);
	const rawHome = explicitHome ? explicitHome.replace(/^~(?=$|[\\/])/, resolveRawOsHomeDir(env, homedir) ?? "") : resolveRawOsHomeDir(env, homedir);
	return rawHome ? path.resolve(rawHome) : path.resolve(process.cwd());
}
/** Resolve standalone memory-host paths without importing core home-directory policy. */
function resolveMemoryHostUserPath(input, env = process.env, homedir = os.homedir) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	if (trimmed.startsWith("~")) return path.resolve(trimmed.replace(/^~(?=$|[\\/])/, resolveRequiredHomeDir(env, homedir)));
	return path.resolve(trimmed);
}
/** Return legacy state roots in priority order. */
function legacyStateDirs(homedir) {
	return LEGACY_STATE_DIRNAMES.map((dir) => path.join(homedir(), dir));
}
/** Resolve the current state root while preserving shipped legacy installs when present. */
function resolveStateDir(env = process.env, homedir = os.homedir) {
	const override = env.OPENCLAW_STATE_DIR?.trim();
	if (override) return resolveMemoryHostUserPath(override, env, homedir);
	const effectiveHome = () => resolveRequiredHomeDir(env, homedir);
	const nextDir = path.join(effectiveHome(), NEW_STATE_DIRNAME);
	if (env.OPENCLAW_TEST_FAST === "1" || fs.existsSync(nextDir)) return nextDir;
	return legacyStateDirs(effectiveHome).find((dir) => {
		try {
			return fs.existsSync(dir);
		} catch {
			return false;
		}
	}) ?? nextDir;
}
/** Resolve the default agent workspace, partitioned by OPENCLAW_PROFILE when set. */
function resolveDefaultAgentWorkspaceDir(env = process.env) {
	const home = resolveRequiredHomeDir(env, os.homedir);
	const profile = env.OPENCLAW_PROFILE?.trim();
	if (profile && normalizeLowercaseStringOrEmpty(profile) !== "default") return path.join(home, ".openclaw", `workspace-${profile}`);
	return path.join(home, ".openclaw", "workspace");
}
/** Return configured agent entries after dropping nullish placeholders. */
function listAgentEntries(cfg) {
	return Array.isArray(cfg.agents?.list) ? cfg.agents.list.filter((entry) => Boolean(entry)) : [];
}
/** Resolve the default agent id from explicit default marker or first agent entry. */
function resolveDefaultAgentId(cfg) {
	const agents = listAgentEntries(cfg);
	if (agents.length === 0) return DEFAULT_AGENT_ID;
	const chosen = (agents.find((agent) => agent.default) ?? agents[0])?.id;
	return normalizeAgentId(chosen || DEFAULT_AGENT_ID);
}
/** Find one agent config by canonical id. */
function resolveAgentConfig(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	return listAgentEntries(cfg).find((entry) => normalizeAgentId(entry.id) === id);
}
/** Remove null bytes before paths are handed to filesystem APIs. */
function stripNullBytes(value) {
	return value.replaceAll("\0", "");
}
/** Resolve the workspace directory for an agent id and config defaults. */
function resolveMemoryHostAgentWorkspaceDir(cfg, agentId, env = process.env) {
	const id = normalizeAgentId(agentId);
	const configured = resolveAgentConfig(cfg, id)?.workspace?.trim();
	if (configured) return stripNullBytes(resolveMemoryHostUserPath(configured, env));
	const fallback = cfg.agents?.defaults?.workspace?.trim();
	if (id === resolveDefaultAgentId(cfg)) return stripNullBytes(fallback ? resolveMemoryHostUserPath(fallback, env) : resolveDefaultAgentWorkspaceDir(env));
	if (fallback) return stripNullBytes(path.join(resolveMemoryHostUserPath(fallback, env), id));
	return stripNullBytes(path.join(resolveStateDir(env), `workspace-${id}`));
}
/** Resolve context limits for an agent with defaults fallback. */
function resolveMemoryHostAgentContextLimits(cfg, agentId) {
	const defaults = cfg?.agents?.defaults?.contextLimits;
	if (!cfg || !agentId) return defaults;
	return resolveAgentConfig(cfg, agentId)?.contextLimits ?? defaults;
}
/** Resolve enabled memory search config plus deduplicated extra paths for an agent. */
function resolveMemoryHostSearchPathConfig(cfg, agentId) {
	const defaults = cfg.agents?.defaults?.memorySearch;
	const overrides = resolveAgentConfig(cfg, agentId)?.memorySearch;
	const enabled = overrides?.enabled ?? defaults?.enabled ?? true;
	if (!enabled) return null;
	const rawPaths = normalizeStringEntries([...defaults?.extraPaths ?? [], ...overrides?.extraPaths ?? []]);
	return {
		enabled,
		rememberAcrossConversations: resolveRememberAcrossConversations(cfg, agentId),
		extraPaths: uniqueStrings(rawPaths)
	};
}
//#endregion
//#region packages/memory-host-sdk/src/host/multimodal.ts
const MEMORY_MULTIMODAL_SPECS = {
	image: {
		labelPrefix: "Image file",
		extensions: [
			".jpg",
			".jpeg",
			".png",
			".webp",
			".gif",
			".heic",
			".heif"
		]
	},
	audio: {
		labelPrefix: "Audio file",
		extensions: [
			".mp3",
			".wav",
			".ogg",
			".opus",
			".m4a",
			".m2a",
			".aac",
			".flac"
		]
	}
};
/** All supported multimodal memory modalities in stable config order. */
const MEMORY_MULTIMODAL_MODALITIES = Object.keys(MEMORY_MULTIMODAL_SPECS);
/** Default max bytes for one multimodal memory file. */
const DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES = 10 * 1024 * 1024;
/** Normalize user modality selections to supported modalities. */
function normalizeMemoryMultimodalModalities(raw) {
	if (raw === void 0 || raw.includes("all")) return [...MEMORY_MULTIMODAL_MODALITIES];
	const normalized = /* @__PURE__ */ new Set();
	for (const value of raw) if (value === "image" || value === "audio") normalized.add(value);
	return Array.from(normalized);
}
/** Normalize user multimodal settings, including disabled-state empty modality list. */
function normalizeMemoryMultimodalSettings(raw) {
	const enabled = raw.enabled === true;
	const maxFileBytes = typeof raw.maxFileBytes === "number" && Number.isFinite(raw.maxFileBytes) ? Math.max(1, Math.floor(raw.maxFileBytes)) : DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES;
	return {
		enabled,
		modalities: enabled ? normalizeMemoryMultimodalModalities(raw.modalities) : [],
		maxFileBytes
	};
}
/** Return true when multimodal memory ingestion has at least one enabled modality. */
function isMemoryMultimodalEnabled(settings) {
	return settings.enabled && settings.modalities.length > 0;
}
/** Return accepted file extensions for a modality. */
function getMemoryMultimodalExtensions(modality) {
	return MEMORY_MULTIMODAL_SPECS[modality].extensions;
}
/** Build the text label that accompanies embedded multimodal file content. */
function buildMemoryMultimodalLabel(modality, normalizedPath) {
	return `${MEMORY_MULTIMODAL_SPECS[modality].labelPrefix}: ${normalizedPath}`;
}
/** Build a glob that matches an extension case-insensitively for QMD sources. */
function buildCaseInsensitiveExtensionGlob(extension) {
	const normalized = normalizeLowercaseStringOrEmpty(extension).replace(/^\./, "");
	if (!normalized) return "*";
	return `*.${Array.from(normalized, (char) => `[${char.toLowerCase()}${char.toUpperCase()}]`).join("")}`;
}
/** Classify a file path into a supported multimodal modality under current settings. */
function classifyMemoryMultimodalPath(filePath, settings) {
	if (!isMemoryMultimodalEnabled(settings)) return null;
	const lower = normalizeLowercaseStringOrEmpty(filePath);
	for (const modality of settings.modalities) for (const extension of getMemoryMultimodalExtensions(modality)) if (lower.endsWith(extension)) return modality;
	return null;
}
//#endregion
//#region src/agents/memory-search.ts
/**
* Resolves memory-search source, sync, and ranking configuration.
*/
const DEFAULT_CHUNK_TOKENS = 400;
const DEFAULT_CHUNK_OVERLAP = 80;
const DEFAULT_WATCH_DEBOUNCE_MS = 1500;
const DEFAULT_SESSION_DELTA_BYTES = 1e5;
const DEFAULT_SESSION_DELTA_MESSAGES = 50;
const DEFAULT_MAX_RESULTS = 6;
const DEFAULT_MIN_SCORE = .35;
const DEFAULT_HYBRID_ENABLED = true;
const DEFAULT_HYBRID_VECTOR_WEIGHT = .7;
const DEFAULT_HYBRID_TEXT_WEIGHT = .3;
const DEFAULT_HYBRID_CANDIDATE_MULTIPLIER = 4;
const DEFAULT_MMR_ENABLED = false;
const DEFAULT_MMR_LAMBDA = .7;
const DEFAULT_TEMPORAL_DECAY_ENABLED = false;
const DEFAULT_TEMPORAL_DECAY_HALF_LIFE_DAYS = 30;
const DEFAULT_CACHE_ENABLED = true;
const DEFAULT_CACHE_MAX_ENTRIES = void 0;
const DEFAULT_SOURCES = ["memory"];
const DEFAULT_MEMORY_EMBEDDING_PROVIDER = "openai";
const DEFAULT_REMOTE_BATCH_POLL_INTERVAL_MS = 2e3;
const DEFAULT_REMOTE_BATCH_TIMEOUT_MINUTES = 60;
const MAX_REMOTE_BATCH_TIMEOUT_MINUTES = Math.floor(MAX_TIMER_TIMEOUT_MS / 6e4);
function resolveRemoteBatchPollIntervalMs(overrideValue, defaultValue) {
	return resolvePositiveTimerTimeoutMs(overrideValue ?? defaultValue, DEFAULT_REMOTE_BATCH_POLL_INTERVAL_MS);
}
function resolveRemoteBatchTimeoutMinutes(overrideValue, defaultValue) {
	const value = overrideValue ?? defaultValue;
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? clampInt(value, 1, MAX_REMOTE_BATCH_TIMEOUT_MINUTES) : DEFAULT_REMOTE_BATCH_TIMEOUT_MINUTES;
}
function normalizeSources(sources, sessionMemoryEnabled) {
	const normalized = /* @__PURE__ */ new Set();
	const input = sources?.length ? sources : DEFAULT_SOURCES;
	for (const source of input) {
		if (source === "memory") normalized.add("memory");
		if (source === "sessions" && sessionMemoryEnabled) normalized.add("sessions");
	}
	if (normalized.size === 0) normalized.add("memory");
	return Array.from(normalized);
}
function getConfiguredMemoryEmbeddingProvider(providerId, cfg) {
	if (normalizeProviderId(providerId) === "none") return;
	const directAdapter = getMemoryEmbeddingProvider(providerId);
	if (directAdapter) return directAdapter;
	const genericAdapter = getEmbeddingProvider(providerId, cfg);
	if (genericAdapter) return genericAdapter;
	const ownerApi = findNormalizedProviderValue(cfg.models?.providers, providerId)?.api?.trim();
	if (!ownerApi) return;
	const normalizedProvider = normalizeProviderId(providerId);
	const normalizedOwner = normalizeProviderId(ownerApi);
	if (!normalizedOwner || normalizedOwner === normalizedProvider) return;
	return getMemoryEmbeddingProvider(normalizedOwner);
}
function mergeConfig(cfg, defaults, overrides, agentId) {
	const enabled = overrides?.enabled ?? defaults?.enabled ?? true;
	const rememberAcrossConversations = resolveRememberAcrossConversations(cfg, agentId);
	const configuredSessionMemory = overrides?.experimental?.sessionMemory ?? defaults?.experimental?.sessionMemory ?? false;
	const sessionMemory = rememberAcrossConversations || configuredSessionMemory;
	const rawProvider = overrides?.provider ?? defaults?.provider;
	const provider = rawProvider?.trim() === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : rawProvider?.trim() || DEFAULT_MEMORY_EMBEDDING_PROVIDER;
	const primaryAdapter = getConfiguredMemoryEmbeddingProvider(provider, cfg);
	const defaultRemote = defaults?.remote;
	const overrideRemote = overrides?.remote;
	const fallback = overrides?.fallback ?? defaults?.fallback ?? "none";
	const fallbackAdapter = normalizeProviderId(provider) !== "none" && fallback && fallback !== "none" ? getConfiguredMemoryEmbeddingProvider(fallback, cfg) : void 0;
	const includeRemote = Boolean(overrideRemote?.baseUrl || overrideRemote?.apiKey || overrideRemote?.headers || overrideRemote?.nonBatchConcurrency != null || defaultRemote?.baseUrl || defaultRemote?.apiKey || defaultRemote?.headers || defaultRemote?.nonBatchConcurrency != null) || primaryAdapter?.transport !== "local" || fallbackAdapter?.transport === "remote";
	const batch = {
		enabled: overrideRemote?.batch?.enabled ?? defaultRemote?.batch?.enabled ?? false,
		wait: overrideRemote?.batch?.wait ?? defaultRemote?.batch?.wait ?? true,
		concurrency: Math.max(1, overrideRemote?.batch?.concurrency ?? defaultRemote?.batch?.concurrency ?? 2),
		pollIntervalMs: resolveRemoteBatchPollIntervalMs(overrideRemote?.batch?.pollIntervalMs, defaultRemote?.batch?.pollIntervalMs),
		timeoutMinutes: resolveRemoteBatchTimeoutMinutes(overrideRemote?.batch?.timeoutMinutes, defaultRemote?.batch?.timeoutMinutes)
	};
	const remote = includeRemote ? {
		baseUrl: overrideRemote?.baseUrl ?? defaultRemote?.baseUrl,
		apiKey: overrideRemote?.apiKey ?? defaultRemote?.apiKey,
		headers: overrideRemote?.headers ?? defaultRemote?.headers,
		nonBatchConcurrency: overrideRemote?.nonBatchConcurrency ?? defaultRemote?.nonBatchConcurrency,
		batch
	} : void 0;
	const modelDefault = primaryAdapter?.defaultModel;
	const model = overrides?.model ?? defaults?.model ?? modelDefault ?? "";
	const inputType = overrides?.inputType?.trim() || defaults?.inputType?.trim() || void 0;
	const queryInputType = overrides?.queryInputType?.trim() || defaults?.queryInputType?.trim() || void 0;
	const documentInputType = overrides?.documentInputType?.trim() || defaults?.documentInputType?.trim() || void 0;
	const outputDimensionality = overrides?.outputDimensionality ?? defaults?.outputDimensionality;
	const local = {
		modelPath: overrides?.local?.modelPath ?? defaults?.local?.modelPath,
		modelCacheDir: overrides?.local?.modelCacheDir ?? defaults?.local?.modelCacheDir,
		contextSize: overrides?.local?.contextSize ?? defaults?.local?.contextSize
	};
	const configuredSources = overrides?.sources ?? defaults?.sources;
	const searchSources = normalizeSources(configuredSources, configuredSessionMemory || rememberAcrossConversations && configuredSources?.includes("sessions") === true);
	const sources = normalizeSources(rememberAcrossConversations ? [...searchSources, "sessions"] : configuredSources, sessionMemory);
	const extraPaths = uniqueStrings(normalizeStringEntries([...defaults?.extraPaths ?? [], ...overrides?.extraPaths ?? []]));
	const multimodal = normalizeMemoryMultimodalSettings({
		enabled: overrides?.multimodal?.enabled ?? defaults?.multimodal?.enabled,
		modalities: overrides?.multimodal?.modalities ?? defaults?.multimodal?.modalities,
		maxFileBytes: overrides?.multimodal?.maxFileBytes ?? defaults?.multimodal?.maxFileBytes
	});
	const vector = {
		enabled: overrides?.store?.vector?.enabled ?? defaults?.store?.vector?.enabled ?? true,
		extensionPath: overrides?.store?.vector?.extensionPath ?? defaults?.store?.vector?.extensionPath
	};
	const fts = { tokenizer: overrides?.store?.fts?.tokenizer ?? defaults?.store?.fts?.tokenizer ?? "unicode61" };
	const store = {
		driver: overrides?.store?.driver ?? defaults?.store?.driver ?? "sqlite",
		databasePath: resolveOpenClawAgentSqlitePath({
			agentId,
			env: process.env
		}),
		fts,
		vector
	};
	const chunking = {
		tokens: DEFAULT_CHUNK_TOKENS,
		overlap: DEFAULT_CHUNK_OVERLAP
	};
	const sync = resolveSyncConfig(defaults, overrides);
	const query = {
		maxResults: overrides?.query?.maxResults ?? defaults?.query?.maxResults ?? DEFAULT_MAX_RESULTS,
		minScore: overrides?.query?.minScore ?? defaults?.query?.minScore ?? DEFAULT_MIN_SCORE
	};
	const hybrid = {
		enabled: overrides?.query?.hybrid?.enabled ?? defaults?.query?.hybrid?.enabled ?? DEFAULT_HYBRID_ENABLED,
		vectorWeight: DEFAULT_HYBRID_VECTOR_WEIGHT,
		textWeight: DEFAULT_HYBRID_TEXT_WEIGHT,
		candidateMultiplier: DEFAULT_HYBRID_CANDIDATE_MULTIPLIER,
		mmr: {
			enabled: overrides?.query?.hybrid?.mmr?.enabled ?? defaults?.query?.hybrid?.mmr?.enabled ?? DEFAULT_MMR_ENABLED,
			lambda: DEFAULT_MMR_LAMBDA
		},
		temporalDecay: {
			enabled: overrides?.query?.hybrid?.temporalDecay?.enabled ?? defaults?.query?.hybrid?.temporalDecay?.enabled ?? DEFAULT_TEMPORAL_DECAY_ENABLED,
			halfLifeDays: DEFAULT_TEMPORAL_DECAY_HALF_LIFE_DAYS
		}
	};
	const cache = {
		enabled: overrides?.cache?.enabled ?? defaults?.cache?.enabled ?? DEFAULT_CACHE_ENABLED,
		maxEntries: DEFAULT_CACHE_MAX_ENTRIES
	};
	const overlap = clampNumber(chunking.overlap, 0, Math.max(0, chunking.tokens - 1));
	const minScore = clampNumber(query.minScore, 0, 1);
	const vectorWeight = clampNumber(hybrid.vectorWeight, 0, 1);
	const textWeight = clampNumber(hybrid.textWeight, 0, 1);
	const sum = vectorWeight + textWeight;
	const normalizedVectorWeight = sum > 0 ? vectorWeight / sum : DEFAULT_HYBRID_VECTOR_WEIGHT;
	const normalizedTextWeight = sum > 0 ? textWeight / sum : DEFAULT_HYBRID_TEXT_WEIGHT;
	const candidateMultiplier = clampInt(hybrid.candidateMultiplier, 1, 20);
	const temporalDecayHalfLifeDays = Math.max(1, Math.floor(Number.isFinite(hybrid.temporalDecay.halfLifeDays) ? hybrid.temporalDecay.halfLifeDays : DEFAULT_TEMPORAL_DECAY_HALF_LIFE_DAYS));
	const deltaBytes = clampInt(sync.sessions.deltaBytes, 0, Number.MAX_SAFE_INTEGER);
	const deltaMessages = clampInt(sync.sessions.deltaMessages, 0, Number.MAX_SAFE_INTEGER);
	const postCompactionForce = sync.sessions.postCompactionForce;
	return {
		enabled,
		rememberAcrossConversations,
		sources,
		searchSources,
		extraPaths,
		multimodal,
		provider,
		remote,
		experimental: { sessionMemory },
		fallback,
		model,
		inputType,
		queryInputType,
		documentInputType,
		outputDimensionality,
		local,
		store,
		chunking: {
			tokens: Math.max(1, chunking.tokens),
			overlap
		},
		sync: {
			...sync,
			sessions: {
				deltaBytes,
				deltaMessages,
				postCompactionForce
			}
		},
		query: {
			...query,
			minScore,
			hybrid: {
				enabled: hybrid.enabled,
				vectorWeight: normalizedVectorWeight,
				textWeight: normalizedTextWeight,
				candidateMultiplier,
				mmr: {
					enabled: hybrid.mmr.enabled,
					lambda: Number.isFinite(hybrid.mmr.lambda) ? Math.max(0, Math.min(1, hybrid.mmr.lambda)) : DEFAULT_MMR_LAMBDA
				},
				temporalDecay: {
					enabled: hybrid.temporalDecay.enabled,
					halfLifeDays: temporalDecayHalfLifeDays
				}
			}
		},
		cache: {
			enabled: cache.enabled,
			maxEntries: typeof cache.maxEntries === "number" && Number.isFinite(cache.maxEntries) ? Math.max(1, Math.floor(cache.maxEntries)) : void 0
		}
	};
}
function resolveSyncConfig(defaults, overrides) {
	return {
		onSessionStart: overrides?.sync?.onSessionStart ?? defaults?.sync?.onSessionStart ?? true,
		onSearch: overrides?.sync?.onSearch ?? defaults?.sync?.onSearch ?? true,
		watch: overrides?.sync?.watch ?? defaults?.sync?.watch ?? true,
		watchDebounceMs: DEFAULT_WATCH_DEBOUNCE_MS,
		intervalMinutes: 0,
		embeddingBatchTimeoutSeconds: overrides?.sync?.embeddingBatchTimeoutSeconds ?? defaults?.sync?.embeddingBatchTimeoutSeconds,
		sessions: {
			deltaBytes: overrides?.sync?.sessions?.deltaBytes ?? defaults?.sync?.sessions?.deltaBytes ?? DEFAULT_SESSION_DELTA_BYTES,
			deltaMessages: overrides?.sync?.sessions?.deltaMessages ?? defaults?.sync?.sessions?.deltaMessages ?? DEFAULT_SESSION_DELTA_MESSAGES,
			postCompactionForce: overrides?.sync?.sessions?.postCompactionForce ?? defaults?.sync?.sessions?.postCompactionForce ?? true
		}
	};
}
function resolveMemorySearchConfig(cfg, agentId) {
	const defaults = cfg.agents?.defaults?.memorySearch;
	const overrides = resolveAgentConfig$1(cfg, agentId)?.memorySearch;
	const resolved = mergeConfig(cfg, defaults, overrides, agentId);
	if (!resolved.enabled) return null;
	assertSecretOwnerAvailable("capability", runtimeMemorySecretOwnerId(agentId));
	const isFtsOnly = normalizeProviderId(resolved.provider) === "none";
	const multimodalActive = isMemoryMultimodalEnabled(resolved.multimodal);
	const multimodalProvider = isFtsOnly ? void 0 : getConfiguredMemoryEmbeddingProvider(resolved.provider, cfg);
	if (!isFtsOnly && multimodalActive && (multimodalProvider && !(multimodalProvider.supportsMultimodalEmbeddings?.({ model: resolved.model }) ?? false) || !multimodalProvider && getEmbeddingProvider(resolved.provider, cfg))) throw new Error("agents.*.memorySearch.multimodal requires a provider adapter that supports multimodal embeddings for the configured model.");
	if (multimodalActive && resolved.fallback !== "none") throw new Error("agents.*.memorySearch.multimodal does not support memorySearch.fallback. Set fallback to \"none\".");
	return resolved;
}
function resolveMemorySearchSyncConfig(cfg, agentId) {
	const defaults = cfg.agents?.defaults?.memorySearch;
	const overrides = resolveAgentConfig$1(cfg, agentId)?.memorySearch;
	if (!(overrides?.enabled ?? defaults?.enabled ?? true)) return null;
	return resolveSyncConfig(defaults, overrides);
}
//#endregion
export { classifyMemoryMultimodalPath as a, resolveMemoryHostAgentContextLimits as c, resolveMemoryHostUserPath as d, resolveRememberAcrossConversations as f, buildMemoryMultimodalLabel as i, resolveMemoryHostAgentWorkspaceDir as l, resolveMemorySearchSyncConfig as n, getMemoryMultimodalExtensions as o, readTranscriptContentRevisionSync as p, buildCaseInsensitiveExtensionGlob as r, MEMORY_HOST_ROOT_FILENAME as s, resolveMemorySearchConfig as t, resolveMemoryHostSearchPathConfig as u };
