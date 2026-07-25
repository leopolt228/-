import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { An as ResolvedMemorySearchConfig, at as MemoryEmbeddingProvider, ct as MemoryEmbeddingProviderCreateOptions, dt as MemoryEmbeddingProviderRuntime, gn as EmbeddingInput } from "./types-Bi5Leigi.js";
import { F as MemorySearchRuntimeDebug, I as MemorySessionSyncTarget, L as MemorySyncParams, N as MemorySearchManager, R as MemorySyncProgressUpdate, j as MemoryProviderStatus } from "./memory-state-BkRTpzLa.js";
import { n as MemorySearchResult, r as MemorySource, t as MemoryEmbeddingProbeResult } from "./memory-core-host-engine-storage-H9shzF_C.js";
import { t as MemoryCoreAcquireLocalService } from "./embedding-local-service-BCpPp3QB.js";
import { v as SessionTranscriptCorpusEntry } from "./memory-core-host-engine-qmd-BBB_NJu1.js";
import { FSWatcher } from "chokidar";
import { DatabaseSync } from "node:sqlite";

//#region extensions/memory-core/src/memory/embeddings.d.ts
type EmbeddingProvider = MemoryEmbeddingProvider;
type EmbeddingProviderId = string;
type EmbeddingProviderRequest = string;
type EmbeddingProviderFallback = string;
type EmbeddingProviderRuntime = MemoryEmbeddingProviderRuntime;
type EmbeddingProviderResult = {
  provider: EmbeddingProvider | null;
  requestedProvider: EmbeddingProviderRequest;
  fallbackFrom?: string;
  fallbackReason?: string;
  providerUnavailableReason?: string;
  runtime?: EmbeddingProviderRuntime;
};
type CreateEmbeddingProviderOptions = MemoryEmbeddingProviderCreateOptions & {
  provider: EmbeddingProviderRequest;
  fallback: EmbeddingProviderFallback;
  acquireLocalService?: MemoryCoreAcquireLocalService;
};
declare function createEmbeddingProvider(options: CreateEmbeddingProviderOptions): Promise<EmbeddingProviderResult>;
//#endregion
//#region extensions/memory-core/src/memory/manager-reindex-state.d.ts
type MemoryIndexMeta = {
  model: string;
  provider: string;
  providerKey?: string;
  sources?: MemorySource[];
  scopeHash?: string;
  chunkTokens: number;
  chunkOverlap: number;
  vectorDims?: number;
  ftsTokenizer?: string;
};
type MemoryIndexIdentityState = {
  status: "valid";
} | {
  status: "missing";
  reason: string;
} | {
  status: "mismatched";
  reason: string;
};
type MemoryIndexProviderIdentity = {
  provider: string;
  model: string;
  providerKey: string;
};
//#endregion
//#region extensions/memory-core/src/memory/manager-provider-state.d.ts
type MemoryProviderLifecycleState = {
  mode: "pending";
  requestedProvider: string;
} | {
  mode: "active";
  providerId: string;
} | {
  mode: "degraded";
  providerId: string;
  reason: string;
  code?: string;
} | {
  mode: "fallback-active";
  providerId: string;
  fallbackFrom: string;
  reason: string;
} | {
  mode: "fts-only";
  reason: string;
  attemptedProviderId?: string;
};
//#endregion
//#region extensions/memory-core/src/memory/watch-settle.d.ts
type MemoryWatchEventStats = {
  isDirectory?: () => boolean;
  size?: number;
  mtimeMs?: number;
};
type WatchPathSnapshot = {
  size: number;
  mtimeMs: number;
};
type MemoryWatchSettleQueue = Map<string, WatchPathSnapshot | null>;
//#endregion
//#region extensions/memory-core/src/memory/manager-sync-base.d.ts
type MemorySyncProgressState = {
  completed: number;
  total: number;
  label?: string;
  report: (update: MemorySyncProgressUpdate) => void;
};
type MemoryIndexEntry$1 = {
  path: string;
  absPath: string;
  mtimeMs: number;
  size: number;
  hash: string;
  kind?: "markdown" | "multimodal";
  content?: string;
  contentText?: string;
  lineMap?: number[];
};
type MemoryIndexWorkItem = {
  entry: MemoryIndexEntry$1;
  source: MemorySource;
  afterIndex?: () => void;
};
type MemorySourceSyncPlan = {
  indexItems: MemoryIndexWorkItem[];
  finalize: () => Promise<void> | void;
};
type MemorySessionDeltaState = {
  lastSize: number;
  pendingBytes: number;
  pendingMessages: number;
};
type MemoryReindexRetryState = {
  dirty: boolean;
  memoryFullRetryDirty: boolean;
  sessionsDirty: boolean;
  sessionsFullRetryDirty: boolean;
  sessionsDirtyFiles: Set<string>;
  sessionDeltas: Map<string, MemorySessionDeltaState>;
};
declare abstract class MemoryManagerSyncBase {
  protected readonly acquireLocalService?: MemoryCoreAcquireLocalService;
  protected abstract readonly cfg: OpenClawConfig;
  protected abstract readonly agentId: string;
  protected abstract readonly workspaceDir: string;
  protected abstract readonly settings: ResolvedMemorySearchConfig;
  protected provider: EmbeddingProvider | null;
  protected fallbackFrom?: EmbeddingProviderId;
  protected abstract providerUnavailableReason?: string;
  protected abstract providerLifecycle: MemoryProviderLifecycleState;
  protected providerRuntime?: EmbeddingProviderRuntime;
  protected abstract batch: {
    enabled: boolean;
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
  };
  protected readonly sources: Set<MemorySource>;
  protected providerKey: string | null;
  protected abstract readonly vector: {
    enabled: boolean;
    available: boolean | null;
    semanticAvailable?: boolean;
    extensionPath?: string;
    loadError?: string;
    dims?: number;
  };
  protected readonly fts: {
    enabled: boolean;
    available: boolean;
    loadError?: string;
  };
  protected vectorReady: Promise<boolean> | null;
  protected watcher: FSWatcher | null;
  protected watchTimer: NodeJS.Timeout | null;
  protected sessionWatchTimer: NodeJS.Timeout | null;
  protected sessionUnsubscribe: (() => void) | null;
  protected fallbackReason?: string;
  protected intervalTimer: NodeJS.Timeout | null;
  protected memoryWatchPressureStartupTimer: NodeJS.Timeout | null;
  protected closed: boolean;
  protected dirty: boolean;
  protected memoryFullRetryDirty: boolean;
  protected pendingWatchPaths: MemoryWatchSettleQueue;
  protected sessionsDirty: boolean;
  protected sessionsFullRetryDirty: boolean;
  protected sessionsDirtyFiles: Set<string>;
  protected sessionPendingFiles: Set<string>;
  protected sessionPendingTargets: Map<string, MemorySessionSyncTarget>;
  protected sessionDeltas: Map<string, MemorySessionDeltaState>;
  protected vectorDegradedWriteWarningShown: boolean;
  protected lastMetaSerialized: string | null;
  protected abstract readonly cache: {
    enabled: boolean;
    maxEntries?: number;
  };
  protected abstract db: DatabaseSync;
  protected abstract computeProviderKey(): string;
  protected abstract resolveProviderIndexIdentities(): MemoryIndexProviderIdentity[];
  protected abstract sync(params?: MemorySyncParams): Promise<void>;
  protected abstract withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T>;
  protected abstract getIndexConcurrency(): number;
  protected abstract pruneEmbeddingCacheIfNeeded(): void;
  protected abstract resetProviderInitializationForRetry(): void;
  protected abstract assertRequiredProviderAvailable(operation: "search" | "sync"): void;
  protected abstract indexFile(entry: MemoryIndexEntry$1, options: {
    source: MemorySource;
    content?: string;
  }): Promise<void>;
  protected abstract syncMemoryFiles(params: {
    needsFullReindex: boolean;
    progress?: MemorySyncProgressState;
    deferIndex?: boolean;
  }): Promise<MemorySourceSyncPlan>;
  protected abstract syncArchiveFiles(params: {
    needsFullReindex: boolean;
    targetArchiveFiles?: string[];
    progress?: MemorySyncProgressState;
    deferIndex?: boolean;
    prefixIndexItems?: MemoryIndexWorkItem[];
  }): Promise<MemorySourceSyncPlan>;
  protected indexFiles(items: MemoryIndexWorkItem[]): Promise<void>;
  protected emptySourceSyncPlan(): MemorySourceSyncPlan;
  protected snapshotReindexRetryState(): MemoryReindexRetryState;
  protected restoreReindexRetryState(snapshot: MemoryReindexRetryState): void;
  protected markFailedFullReindexRetry(params: {
    memory: boolean;
    sessions: boolean;
  }): void;
  protected clearSessionRetryState(): void;
  protected clearMemoryRetryState(): void;
  protected refreshSessionDirtyFlag(): void;
  protected shouldDeferSourceWideBatch(): boolean;
  protected indexQueuedFiles(items: MemoryIndexWorkItem[], progress?: MemorySyncProgressState, label?: string): Promise<void>;
  protected executeSourceSyncPlans(plans: MemorySourceSyncPlan[], progress?: MemorySyncProgressState): Promise<void>;
  protected executeSourceWideSync(params: {
    shouldSyncMemory: boolean;
    shouldSyncSessions: boolean;
    needsFullReindex: boolean;
    needsFullSessionReindex?: boolean;
    targetArchiveFiles?: string[];
    progress?: MemorySyncProgressState;
  }): Promise<void>;
  protected hasIndexedChunks(): boolean;
  protected hasSemanticChunks(): boolean;
  protected resolveCurrentIndexIdentityState(params?: {
    meta?: MemoryIndexMeta | null;
    provider?: {
      id: string;
      model: string;
    } | null;
    providerKeyKnown?: boolean;
    vectorReady?: boolean;
    hasIndexedChunks?: boolean;
  }): MemoryIndexIdentityState;
  protected resetVectorState(): void;
  protected ensureVectorReady(dimensions?: number): Promise<boolean>;
  private loadVectorExtension;
  private ensureVectorTable;
  private dropLegacyVectorTable;
  private dropVectorTable;
  protected buildSourceFilter(alias?: string, sourcesOverride?: MemorySource[]): {
    sql: string;
    params: MemorySource[];
  };
  protected openDatabase(): DatabaseSync;
  protected seedEmbeddingCache(sourceDb: DatabaseSync): Promise<void>;
  protected ensureSchema(): void;
  protected readMeta(): MemoryIndexMeta | null;
  protected writeMeta(meta: MemoryIndexMeta): void;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-watch-ops.d.ts
declare abstract class MemoryManagerWatchOps extends MemoryManagerSyncBase {
  private nativeMemoryWatchPairs;
  private readonly memoryWatchPressureWarning;
  protected ensureWatcher(): void;
  private scheduleMemoryWatchPressureStartupCheck;
  private warnIfMemoryWatchPressure;
  private currentMemoryChokidarWatcher;
  protected attachNativeMemoryWatchForDir(dir: string, markDirty: (watchPath?: string, stats?: MemoryWatchEventStats) => void): boolean;
  protected attachLinuxMemoryDirectoryTreeWatchForDir(dir: string, markDirty: (watchPath?: string, stats?: MemoryWatchEventStats) => void): boolean;
  private attachLinuxMemoryDirectoryTreeSubtree;
  private closeNativeMemoryWatchPair;
  protected closeNativeMemoryWatchPairs(): void;
  private removeNativeMemoryParentWatch;
  private removeNativeMemoryWatchPair;
  protected attachMemoryChokidarFallback(dir: string, markDirty: (watchPath?: string, stats?: MemoryWatchEventStats) => void): void;
  protected ensureIntervalSync(): void;
  private scheduleWatchSync;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-session-sync-ops.d.ts
type MemorySessionTranscriptUpdate = {
  agentId?: string;
  sessionFile?: string;
  sessionKey?: string;
  target?: {
    agentId: string;
    sessionId: string;
    sessionKey: string;
  };
};
declare abstract class MemoryManagerSessionSyncOps extends MemoryManagerWatchOps {
  protected sessionPathForCorpusEntry(entry: SessionTranscriptCorpusEntry): string;
  protected legacyExtensionlessSessionPathForIdentity(agentId: string, sessionId: string): string;
  protected buildSessionEntryOptions(entry: SessionTranscriptCorpusEntry): {
    updatedAtMs?: number | undefined;
    sessionKey?: string | undefined;
    generatedByDreamingNarrative: boolean;
    generatedByCronRun: boolean;
  };
  protected ensureSessionListener(): void;
  protected subscribeSessionTranscriptUpdates(listener: (update: MemorySessionTranscriptUpdate) => void): () => void;
  private scheduleCorpusSessionFileDirty;
  protected ensureSessionStartupCatchup(): void;
  protected markSessionStartupCatchupDirtyFiles(): Promise<string[]>;
  protected runSessionStartupCatchup(): Promise<string[]>;
  private scheduleSessionDirty;
  private processSessionDeltaBatch;
  private updateSessionDelta;
  private countNewlines;
  protected resetSessionDelta(absPath: string, size: number): void;
  private isSessionFileForAgent;
  private resolveSessionTranscriptUpdateSyncTarget;
  protected normalizeTargetArchiveFiles(archiveFiles?: string[], corpusEntries?: readonly SessionTranscriptCorpusEntry[]): Set<string> | null;
  private normalizeTargetSessions;
  private resolveArchiveFilesForSyncTargets;
  protected combineTargetArchiveFiles(params: {
    sessions?: MemorySessionSyncTarget[];
    archiveFiles?: string[];
  }): Promise<Set<string> | null>;
  private memorySessionSyncTargetKey;
  protected shouldSyncSessions(params?: MemorySyncParams, needsFullReindex?: boolean): boolean;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-source-sync-ops.d.ts
declare abstract class MemoryManagerSourceSyncOps extends MemoryManagerSessionSyncOps {
  protected syncMemoryFiles(params: {
    needsFullReindex: boolean;
    progress?: MemorySyncProgressState;
    deferIndex?: boolean;
  }): Promise<MemorySourceSyncPlan>;
  protected syncArchiveFiles(params: {
    needsFullReindex: boolean;
    targetArchiveFiles?: string[];
    progress?: MemorySyncProgressState;
    deferIndex?: boolean;
    prefixIndexItems?: MemoryIndexWorkItem[];
  }): Promise<MemorySourceSyncPlan>;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-sync-ops.d.ts
declare abstract class MemoryManagerSyncOps extends MemoryManagerSourceSyncOps {
  private createSyncProgress;
  private assertFtsOnlySyncAllowed;
  protected runSync(params?: MemorySyncParams): Promise<void>;
  protected shouldFallbackOnError(err: unknown): boolean;
  private hasRequestedTargetSessionSync;
  protected resolveBatchConfig(): {
    enabled: boolean;
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
  };
  protected activateFallbackProvider(reason: string): Promise<boolean>;
  private runInPlaceReindex;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-embedding-ops.d.ts
type MemoryIndexEntry = MemoryIndexWorkItem["entry"];
declare abstract class MemoryManagerEmbeddingOps extends MemoryManagerSyncOps {
  protected abstract batchFailureCount: number;
  protected abstract batchFailureLastError?: string;
  protected abstract batchFailureLastProvider?: string;
  protected abstract batchFailureLock: Promise<void>;
  protected abstract markLocalEmbeddingProviderDegraded(err: unknown): void;
  protected pruneEmbeddingCacheIfNeeded(): void;
  private upsertEmbeddingCacheEntries;
  private embedChunksInBatches;
  protected computeProviderKey(): string;
  protected resolveProviderIndexIdentities(): MemoryIndexProviderIdentity[];
  private buildBatchDebug;
  private embedChunksWithBatch;
  private collectCachedEmbeddings;
  protected embedBatchWithRetry(texts: string[]): Promise<number[][]>;
  protected embedBatchInputsWithRetry(inputs: EmbeddingInput[]): Promise<number[][]>;
  private waitForEmbeddingRetry;
  private resolveEmbeddingTimeout;
  protected embedQueryWithRetry(text: string, signal?: AbortSignal): Promise<number[]>;
  protected withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T>;
  private withBatchFailureLock;
  private resetBatchFailureCount;
  private recordBatchFailure;
  private runBatchWithTimeoutRetry;
  private runBatchWithFallback;
  protected getIndexConcurrency(): number;
  private clearIndexedFileData;
  private upsertFileRecord;
  private deleteFileRecord;
  /**
   * Write chunks (and optional embeddings) for a file into the index.
   * Handles both the chunks table, the vector table, and the FTS table.
   * Pass an empty embeddings array to skip vector writes (FTS-only mode).
   */
  private writeChunks;
  private prepareIndexEntry;
  protected indexFiles(items: MemoryIndexWorkItem[]): Promise<void>;
  protected indexFile(entry: MemoryIndexEntry, options: {
    source: MemorySource;
    content?: string;
  }): Promise<void>;
}
//#endregion
//#region extensions/memory-core/src/memory/manager.d.ts
type MemoryIndexManagerPurpose = "default" | "status" | "cli";
declare function closeAllMemoryIndexManagers(): Promise<void>;
declare function closeMemoryIndexManagersForAgent(params: {
  cfg: OpenClawConfig;
  agentId: string;
}): Promise<void>;
declare class MemoryIndexManager extends MemoryManagerEmbeddingOps implements MemorySearchManager {
  private readonly cacheKey;
  private readonly purpose;
  protected readonly acquireLocalService?: MemoryCoreAcquireLocalService;
  protected readonly cfg: OpenClawConfig;
  protected readonly agentId: string;
  protected readonly workspaceDir: string;
  protected readonly settings: ResolvedMemorySearchConfig;
  private readonly providerRequirement;
  protected provider: EmbeddingProvider | null;
  private readonly requestedProvider;
  private providerInitPromise;
  private providerInitialized;
  protected fallbackFrom?: EmbeddingProviderId;
  protected fallbackReason?: string;
  protected providerUnavailableReason?: string;
  protected providerLifecycle: MemoryProviderLifecycleState;
  protected providerRuntime?: EmbeddingProviderRuntime;
  protected batch: {
    enabled: boolean;
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
  };
  protected batchFailureCount: number;
  protected batchFailureLastError?: string;
  protected batchFailureLastProvider?: string;
  protected batchFailureLock: Promise<void>;
  protected db: DatabaseSync;
  protected readonly sources: Set<MemorySource>;
  protected providerKey: string;
  protected readonly cache: {
    enabled: boolean;
    maxEntries?: number;
  };
  protected readonly vector: {
    enabled: boolean;
    available: boolean | null;
    semanticAvailable?: boolean;
    extensionPath?: string;
    loadError?: string;
    dims?: number;
  };
  protected readonly fts: {
    enabled: boolean;
    available: boolean;
    loadError?: string;
  };
  protected vectorReady: Promise<boolean> | null;
  protected watcher: FSWatcher | null;
  protected watchTimer: NodeJS.Timeout | null;
  protected sessionWatchTimer: NodeJS.Timeout | null;
  protected sessionUnsubscribe: (() => void) | null;
  protected intervalTimer: NodeJS.Timeout | null;
  protected memoryWatchPressureStartupTimer: NodeJS.Timeout | null;
  protected closed: boolean;
  protected dirty: boolean;
  protected sessionsDirty: boolean;
  protected sessionsDirtyFiles: Set<string>;
  protected sessionPendingFiles: Set<string>;
  protected sessionPendingTargets: Map<string, MemorySessionSyncTarget>;
  private indexIdentityDirty;
  protected sessionDeltas: Map<string, {
    lastSize: number;
    pendingBytes: number;
    pendingMessages: number;
  }>;
  private sessionWarm;
  private syncing;
  private queuedArchiveFiles;
  private queuedSessions;
  private queuedSessionSync;
  private readonlyRecoveryAttempts;
  private readonlyRecoverySuccesses;
  private readonlyRecoveryFailures;
  private readonlyRecoveryLastError?;
  private indexIdentityState;
  private static loadProviderResult;
  static get(params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: MemoryIndexManagerPurpose;
    acquireLocalService?: MemoryCoreAcquireLocalService;
  }): Promise<MemoryIndexManager | null>;
  private constructor();
  private applyProviderResult;
  private ensureProviderInitialized;
  protected resetProviderInitializationForRetry(): void;
  protected markLocalEmbeddingProviderDegraded(err: unknown): void;
  protected isRequiredProviderUnavailable(): boolean;
  protected buildRequiredProviderUnavailableError(operation: "search" | "sync"): Error;
  protected assertRequiredProviderAvailable(operation: "search" | "sync"): void;
  warmSession(sessionKey?: string): Promise<void>;
  private refreshIndexIdentityDirty;
  search(query: string, opts?: {
    maxResults?: number;
    minScore?: number;
    sessionKey?: string;
    qmdSearchModeOverride?: "query" | "search" | "vsearch";
    onDebug?: (debug: MemorySearchRuntimeDebug) => void; /** When set, only these chunk sources are considered (must be enabled for this manager). */
    sources?: MemorySource[]; /** Caller-owned cancellation; aborts in-flight embedding work when the caller stops waiting. */
    signal?: AbortSignal;
  }): Promise<MemorySearchResult[]>;
  private selectScoredResults;
  private rankKeywordOnlyResults;
  private finalizeKeywordOnlyResults;
  private hasIndexedContent;
  private searchVector;
  private buildFtsQuery;
  private searchKeyword;
  private searchKeywordWithFallback;
  private resolveKeywordFallbackTerms;
  private mergeKeywordSearchHits;
  private limitKeywordSearchHits;
  private toMemorySearchResults;
  private mergeHybridResults;
  sync(params?: MemorySyncParams): Promise<void>;
  private enqueueTargetedSessionSync;
  private runSyncWithReadonlyRecovery;
  readFile(params: {
    relPath: string;
    from?: number;
    lines?: number;
  }): Promise<{
    text: string;
    path: string;
  }>;
  status(): MemoryProviderStatus;
  probeVectorAvailability(): Promise<boolean>;
  probeVectorStoreAvailability(): Promise<boolean>;
  private cacheProbeResult;
  getCachedEmbeddingAvailability(): MemoryEmbeddingProbeResult | null;
  probeEmbeddingAvailability(): Promise<MemoryEmbeddingProbeResult>;
  close(): Promise<void>;
}
//#endregion
export { createEmbeddingProvider as i, closeAllMemoryIndexManagers as n, closeMemoryIndexManagersForAgent as r, MemoryIndexManager as t };