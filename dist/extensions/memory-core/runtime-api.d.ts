import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { hn as DEFAULT_LOCAL_MODEL } from "../../types-Bi5Leigi.js";
import { o as PluginStateLeaseRunner } from "../../plugin-state-lease.types-D2kJwQpO.js";
import { N as MemorySearchManager, c as MemoryPluginRuntime } from "../../memory-state-BkRTpzLa.js";
import { a as ShortTermDreamingStats, c as auditShortTermPromotionArtifacts, d as repairShortTermPromotionArtifacts, i as ShortTermAuditSummary, l as loadShortTermPromotionDreamingStats, o as ShortTermDreamingStatsEntry, r as RepairShortTermPromotionArtifactsResult, t as configureMemoryCoreDreamingState, u as removeGroundedShortTermCandidates } from "../../dreaming-state-CW8ZWdsE.js";
import { i as resolveMemoryVectorState, n as resolveMemoryCacheSummary, r as resolveMemoryFtsState, t as Tone } from "../../memory-core-host-status-DFdKQ9Ot.js";
import { t as MemoryCoreAcquireLocalService } from "../../embedding-local-service-BCpPp3QB.js";
import { i as createEmbeddingProvider, t as MemoryIndexManager } from "../../manager-DgZlcAMv.js";
import { t as checkQmdBinaryAvailability } from "../../memory-core-host-engine-qmd-BBB_NJu1.js";
import { t as hasConfiguredMemorySecretInput } from "../../memory-core-host-secret-CPKoKypy.js";

//#region extensions/memory-core/src/memory/search-manager.d.ts
type Maybe<T> = T | null;
type MemorySearchManagerCacheState = "cached-full-hit" | "cached-full-miss" | "transient-cli" | "transient-status" | "pending-create-wait" | "fallback-builtin" | "recent-failure-cooldown";
type MemorySearchManagerDebug = {
  backend?: "builtin" | "qmd";
  purpose?: MemorySearchManagerPurpose;
  managerMs?: number;
  managerCacheState?: MemorySearchManagerCacheState;
  qmdIdentityHash?: string;
  failureCode?: "qmd-unavailable";
};
type MemorySearchManagerResult = {
  manager: Maybe<MemorySearchManager>;
  error?: string;
  debug?: MemorySearchManagerDebug;
};
type MemorySearchManagerPurpose = "default" | "status" | "cli";
type MemorySearchManagerParams = {
  cfg: OpenClawConfig;
  agentId: string;
  purpose?: MemorySearchManagerPurpose;
  acquireLocalService?: MemoryCoreAcquireLocalService;
  withLease?: PluginStateLeaseRunner;
};
declare function getMemorySearchManager(params: MemorySearchManagerParams): Promise<MemorySearchManagerResult>;
//#endregion
//#region extensions/memory-core/src/runtime-provider.d.ts
declare const memoryRuntime: MemoryPluginRuntime;
//#endregion
//#region extensions/memory-core/src/memory/provider-adapters.d.ts
type BuiltinMemoryEmbeddingProviderDoctorMetadata = {
  providerId: string;
  authProviderId: string;
  envVars: string[];
  transport: "local" | "remote";
  autoSelectPriority?: number;
};
declare function getBuiltinMemoryEmbeddingProviderDoctorMetadata(providerId: string): BuiltinMemoryEmbeddingProviderDoctorMetadata | null;
declare function listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata(): Array<BuiltinMemoryEmbeddingProviderDoctorMetadata>;
//#endregion
//#region extensions/memory-core/src/dreaming-repair.d.ts
type DreamingArtifactsAuditIssue = {
  severity: "warn" | "error";
  code: "dreaming-session-corpus-unreadable" | "dreaming-session-corpus-self-ingested" | "dreaming-session-ingestion-unreadable" | "dreaming-diary-unreadable";
  message: string;
  fixable: boolean;
};
type DreamingArtifactsAuditSummary = {
  dreamsPath?: string;
  sessionCorpusDir: string;
  sessionCorpusFileCount: number;
  suspiciousSessionCorpusFileCount: number;
  suspiciousSessionCorpusLineCount: number;
  sessionIngestionPath: string;
  sessionIngestionExists: boolean;
  issues: DreamingArtifactsAuditIssue[];
};
type RepairDreamingArtifactsResult = {
  changed: boolean;
  archiveDir?: string;
  archivedDreamsDiary: boolean;
  archivedSessionCorpus: boolean;
  archivedSessionIngestion: boolean;
  archivedPaths: string[];
  warnings: string[];
};
declare function auditDreamingArtifacts(params: {
  workspaceDir: string;
}): Promise<DreamingArtifactsAuditSummary>;
declare function repairDreamingArtifacts(params: {
  workspaceDir: string;
  archiveDiary?: boolean;
  now?: Date;
}): Promise<RepairDreamingArtifactsResult>;
//#endregion
export { type BuiltinMemoryEmbeddingProviderDoctorMetadata, DEFAULT_LOCAL_MODEL, type DreamingArtifactsAuditSummary, MemoryIndexManager, type RepairDreamingArtifactsResult, type RepairShortTermPromotionArtifactsResult, type ShortTermAuditSummary, type ShortTermDreamingStats, type ShortTermDreamingStatsEntry, type Tone, auditDreamingArtifacts, auditShortTermPromotionArtifacts, checkQmdBinaryAvailability, configureMemoryCoreDreamingState, createEmbeddingProvider, getBuiltinMemoryEmbeddingProviderDoctorMetadata, getMemorySearchManager, hasConfiguredMemorySecretInput, listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata, loadShortTermPromotionDreamingStats, memoryRuntime, removeGroundedShortTermCandidates, repairDreamingArtifacts, repairShortTermPromotionArtifacts, resolveMemoryCacheSummary, resolveMemoryFtsState, resolveMemoryVectorState };