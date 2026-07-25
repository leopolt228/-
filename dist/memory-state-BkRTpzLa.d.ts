import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { zt as MemoryCitationsMode } from "./types.slack-DFzHb8bG.js";

//#region packages/memory-host-sdk/src/host/types.d.ts
type MemorySource = "memory" | "sessions";
/** One ranked memory search hit with optional vector/text scoring details. */
type MemorySearchResult = {
  path: string;
  startLine: number;
  endLine: number;
  score: number;
  vectorScore?: number;
  textScore?: number;
  snippet: string;
  source: MemorySource;
  citation?: string;
};
/** Cached/probed embedding availability status. */
type MemoryEmbeddingProbeResult = {
  ok: boolean;
  error?: string;
  checked?: boolean;
  cached?: boolean;
  checkedAtMs?: number;
  cacheExpiresAtMs?: number;
};
/** Progress event emitted during memory sync. */
type MemorySyncProgressUpdate = {
  completed: number;
  total: number;
  label?: string;
};
type MemorySessionSyncTarget = {
  /** Owning OpenClaw agent. Omit only when the active manager scope already supplies it. */agentId?: string; /** Storage-neutral transcript/session identity. */
  sessionId: string; /** Optional visible session-store key for callers that already carry it. */
  sessionKey?: string;
};
type MemorySyncParams = {
  reason?: string;
  force?: boolean; /** Storage-neutral session transcript targets to refresh. */
  sessions?: MemorySessionSyncTarget[]; /** Archive/support transcript files to refresh without treating paths as active session identity. */
  archiveFiles?: string[];
  progress?: (update: MemorySyncProgressUpdate) => void;
};
/** @public Runtime backend/mode diagnostics for memory search. */
type MemorySearchRuntimeQmdCollectionValidationDebug = {
  cacheState?: "hit" | "miss" | "write" | "bypass-force" | "error";
  elapsedMs: number;
  collectionCount: number;
  listCalls?: number;
  showCalls?: number;
};
/** @public */
type MemorySearchRuntimeQmdMultiCollectionProbeDebug = {
  cacheState?: "hit" | "miss" | "write" | "error";
  elapsedMs: number;
  supported: boolean;
};
/** @public */
type MemorySearchRuntimeQmdSearchPlanDebug = {
  command?: "query" | "search" | "vsearch";
  collectionCount?: number;
  groupCount?: number;
  sources?: MemorySource[];
};
/** @public */
type MemorySearchRuntimeQmdDebug = {
  collectionValidation?: MemorySearchRuntimeQmdCollectionValidationDebug;
  multiCollectionProbe?: MemorySearchRuntimeQmdMultiCollectionProbeDebug;
  searchPlan?: MemorySearchRuntimeQmdSearchPlanDebug;
};
type MemorySearchRuntimeDebug = {
  backend: "builtin" | "qmd";
  configuredMode?: string;
  effectiveMode?: string;
  fallback?: string;
  qmd?: MemorySearchRuntimeQmdDebug;
};
/** Result of reading a memory file, optionally paginated/truncated. */
type MemoryReadResult = {
  text: string;
  path: string;
  truncated?: boolean;
  from?: number;
  lines?: number;
  nextFrom?: number;
};
/** Aggregated memory backend status for CLI/UI diagnostics. */
type MemoryProviderStatus = {
  backend: "builtin" | "qmd";
  provider: string;
  model?: string;
  requestedProvider?: string;
  files?: number;
  chunks?: number;
  dirty?: boolean;
  workspaceDir?: string;
  dbPath?: string;
  extraPaths?: string[];
  sources?: MemorySource[];
  sourceCounts?: Array<{
    source: MemorySource;
    files: number;
    chunks: number;
  }>;
  cache?: {
    enabled: boolean;
    entries?: number;
    maxEntries?: number;
  };
  fts?: {
    enabled: boolean;
    available: boolean;
    error?: string;
  };
  fallback?: {
    from: string;
    reason?: string;
  };
  vector?: {
    enabled: boolean;
    storeAvailable?: boolean;
    semanticAvailable?: boolean;
    available?: boolean;
    extensionPath?: string;
    loadError?: string;
    dims?: number;
  };
  batch?: {
    enabled: boolean;
    failures: number;
    limit: number;
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
    lastError?: string;
    lastProvider?: string;
  };
  custom?: Record<string, unknown>;
};
/** Search/read/sync/status contract implemented by memory managers. */
interface MemorySearchManager {
  search(query: string, opts?: {
    maxResults?: number;
    minScore?: number;
    sessionKey?: string;
    qmdSearchModeOverride?: "query" | "search" | "vsearch";
    onDebug?: (debug: MemorySearchRuntimeDebug) => void;
    sources?: MemorySource[]; /** Optional caller cancellation; managers consume it where their runtime supports cancellation. */
    signal?: AbortSignal;
  }): Promise<MemorySearchResult[]>;
  readFile(params: {
    relPath: string;
    from?: number;
    lines?: number;
  }): Promise<MemoryReadResult>;
  status(): MemoryProviderStatus;
  sync?(params?: MemorySyncParams): Promise<void>;
  getCachedEmbeddingAvailability?(): MemoryEmbeddingProbeResult | null;
  probeEmbeddingAvailability(): Promise<MemoryEmbeddingProbeResult>;
  probeVectorStoreAvailability?(): Promise<boolean>;
  probeVectorAvailability(): Promise<boolean>;
  close?(): Promise<void>;
}
//#endregion
//#region src/plugins/memory-state.d.ts
type MemoryPromptSectionParams = {
  availableTools: Set<string>;
  citationsMode?: MemoryCitationsMode;
  agentId?: string;
  agentSessionKey?: string;
  sandboxed?: boolean;
};
type MemoryPromptSectionBuilder = (params: MemoryPromptSectionParams) => string[];
/**
 * Loads and renders prompt state before synchronous prompt assembly.
 * Implementations may perform async state reads here, but must validate their
 * owner instance before returning lines for the current run.
 */
type MemoryPromptSectionPreparer = (params: MemoryPromptSectionParams) => Promise<readonly string[]>;
type PreparedMemoryPromptSection = Readonly<{
  context: Readonly<{
    availableTools: readonly string[];
    citationsMode?: MemoryCitationsMode;
    agentId?: string;
    agentSessionKey?: string;
    sandboxed: boolean;
  }>;
  lines: readonly string[];
}>;
type MemoryCorpusSearchResult = {
  corpus: string;
  path: string;
  title?: string;
  kind?: string;
  score: number;
  snippet: string;
  id?: string;
  startLine?: number;
  endLine?: number;
  citation?: string;
  source?: string;
  provenanceLabel?: string;
  sourceType?: string;
  sourcePath?: string;
  updatedAt?: string;
};
type MemoryCorpusGetResult = {
  corpus: string;
  path: string;
  title?: string;
  kind?: string;
  content: string;
  fromLine: number;
  lineCount: number;
  id?: string;
  provenanceLabel?: string;
  sourceType?: string;
  sourcePath?: string;
  updatedAt?: string;
};
type MemoryCorpusSupplement = {
  search(params: {
    query: string;
    maxResults?: number;
    agentId?: string;
    agentSessionKey?: string;
    sandboxed?: boolean;
  }): Promise<MemoryCorpusSearchResult[]>;
  get(params: {
    lookup: string;
    fromLine?: number;
    lineCount?: number;
    agentId?: string;
    agentSessionKey?: string;
    sandboxed?: boolean;
  }): Promise<MemoryCorpusGetResult | null>;
};
type MemoryCorpusSupplementRegistration = {
  pluginId: string;
  supplement: MemoryCorpusSupplement;
};
type MemoryPromptSupplementRegistration = {
  pluginId: string;
  builder: MemoryPromptSectionBuilder;
};
type MemoryPromptPreparationRegistration = {
  pluginId: string;
  prepare: MemoryPromptSectionPreparer;
};
type MemoryFlushPlan = {
  softThresholdTokens: number;
  forceFlushTranscriptBytes: number;
  reserveTokensFloor: number;
  model?: string;
  prompt: string;
  systemPrompt: string;
  relativePath: string;
};
type MemoryFlushPlanResolver = (params: {
  cfg?: OpenClawConfig;
  nowMs?: number;
}) => MemoryFlushPlan | null;
type RegisteredMemorySearchManager = MemorySearchManager;
type MemoryRuntimeQmdConfig = {
  command?: string;
};
type MemoryRuntimeBackendConfig = {
  backend: "builtin";
} | {
  backend: "qmd";
  qmd?: MemoryRuntimeQmdConfig;
};
type MemoryPluginRuntime = {
  getMemorySearchManager(params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: "default" | "status" | "cli";
  }): Promise<{
    manager: RegisteredMemorySearchManager | null;
    debug?: {
      backend?: "builtin" | "qmd";
      purpose?: "default" | "status" | "cli";
      managerMs?: number;
      managerCacheState?: "cached-full-hit" | "cached-full-miss" | "transient-cli" | "transient-status" | "pending-create-wait" | "fallback-builtin" | "recent-failure-cooldown";
      qmdIdentityHash?: string;
      failureCode?: "qmd-unavailable";
    };
    error?: string;
  }>;
  resolveMemoryBackendConfig(params: {
    cfg: OpenClawConfig;
    agentId: string;
  }): MemoryRuntimeBackendConfig;
  closeMemorySearchManager?(params: {
    cfg: OpenClawConfig;
    agentId: string;
  }): Promise<void>;
  closeAllMemorySearchManagers?(): Promise<void>;
};
type MemoryPluginPublicArtifactContentType = "markdown" | "json" | "text";
type MemoryPluginPublicArtifact = {
  kind: string;
  workspaceDir: string;
  relativePath: string;
  absolutePath: string;
  agentIds: string[];
  contentType: MemoryPluginPublicArtifactContentType;
};
type MemoryPluginPublicArtifactsProvider = {
  listArtifacts(params: {
    cfg: OpenClawConfig;
  }): Promise<MemoryPluginPublicArtifact[]>;
};
type MemoryPluginCapability = {
  promptBuilder?: MemoryPromptSectionBuilder;
  flushPlanResolver?: MemoryFlushPlanResolver;
  runtime?: MemoryPluginRuntime;
  publicArtifacts?: MemoryPluginPublicArtifactsProvider;
};
type MemoryPluginCapabilityRegistration = {
  pluginId: string;
  capability: MemoryPluginCapability;
};
type MemoryPluginState = {
  capability?: MemoryPluginCapabilityRegistration;
  corpusSupplements: MemoryCorpusSupplementRegistration[];
  promptPreparations: MemoryPromptPreparationRegistration[];
  promptSupplements: MemoryPromptSupplementRegistration[];
};
declare function registerMemoryCorpusSupplement(pluginId: string, supplement: MemoryCorpusSupplement): void;
declare function registerMemoryCapability(pluginId: string, capability: MemoryPluginCapability): void;
declare function getMemoryCapabilityRegistration(): MemoryPluginCapabilityRegistration | undefined;
declare function listMemoryCorpusSupplements(): MemoryCorpusSupplementRegistration[];
declare function registerMemoryPromptSupplement(pluginId: string, builder: MemoryPromptSectionBuilder): void;
declare function registerMemoryPromptPreparation(pluginId: string, prepare: MemoryPromptSectionPreparer): void;
/** Prepare one immutable memory prompt snapshot for a run. */
declare function prepareMemoryPromptSection(params: MemoryPromptSectionParams): Promise<PreparedMemoryPromptSection>;
/** Keep async preparation run-scoped while a context engine assembles synchronously. */
declare function runWithPreparedMemoryPromptSection<T>(params: MemoryPromptSectionParams, run: () => Promise<T>): Promise<T>;
declare function getActivePreparedMemoryPromptSection(): PreparedMemoryPromptSection | undefined;
declare function buildMemoryPromptSection(params: MemoryPromptSectionParams, prepared?: PreparedMemoryPromptSection): string[];
declare function listMemoryPromptSupplements(): MemoryPromptSupplementRegistration[];
declare function listMemoryPromptPreparations(): MemoryPromptPreparationRegistration[];
declare function resolveMemoryFlushPlan(params: {
  cfg?: OpenClawConfig;
  nowMs?: number;
}): MemoryFlushPlan | null;
declare function getMemoryRuntime(): MemoryPluginRuntime | undefined;
declare function hasMemoryRuntime(): boolean;
declare function listActiveMemoryPublicArtifacts(params: {
  cfg: OpenClawConfig;
}): Promise<MemoryPluginPublicArtifact[]>;
declare function restoreMemoryPluginState(state: MemoryPluginState): void;
declare function clearMemoryPluginState(): void;
//#endregion
export { runWithPreparedMemoryPromptSection as A, prepareMemoryPromptSection as C, registerMemoryPromptSupplement as D, registerMemoryPromptPreparation as E, MemorySearchRuntimeDebug as F, MemorySessionSyncTarget as I, MemorySyncParams as L, MemoryReadResult as M, MemorySearchManager as N, resolveMemoryFlushPlan as O, MemorySearchResult as P, MemorySyncProgressUpdate as R, listMemoryPromptSupplements as S, registerMemoryCorpusSupplement as T, getMemoryRuntime as _, MemoryPluginCapability as a, listMemoryCorpusSupplements as b, MemoryPluginRuntime as c, PreparedMemoryPromptSection as d, RegisteredMemorySearchManager as f, getMemoryCapabilityRegistration as g, getActivePreparedMemoryPromptSection as h, MemoryFlushPlanResolver as i, MemoryProviderStatus as j, restoreMemoryPluginState as k, MemoryPromptSectionBuilder as l, clearMemoryPluginState as m, MemoryCorpusSupplement as n, MemoryPluginPublicArtifact as o, buildMemoryPromptSection as p, MemoryFlushPlan as r, MemoryPluginPublicArtifactsProvider as s, MemoryCorpusSearchResult as t, MemoryPromptSectionParams as u, hasMemoryRuntime as v, registerMemoryCapability as w, listMemoryPromptPreparations as x, listActiveMemoryPublicArtifacts as y };