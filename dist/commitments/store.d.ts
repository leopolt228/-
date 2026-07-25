import { i as OpenClawConfig } from "../types.openclaw-DAPZkTyD.js";
import { a as CommitmentScope, i as CommitmentRecord, o as CommitmentStatus, r as CommitmentExtractionItem, t as CommitmentCandidate } from "../types-Bx64ymas.js";

//#region src/commitments/store.d.ts
declare function resolveCommitmentDatabasePath(env?: NodeJS.ProcessEnv): string;
declare function listPendingCommitmentsForScope(params: {
  cfg?: OpenClawConfig;
  scope: CommitmentScope;
  nowMs?: number;
  limit?: number;
}): Promise<CommitmentRecord[]>;
declare function upsertInferredCommitments(params: {
  cfg?: OpenClawConfig;
  item: CommitmentExtractionItem;
  candidates: Array<{
    candidate: CommitmentCandidate;
    earliestMs: number;
    latestMs: number;
    timezone: string;
  }>;
  nowMs?: number;
}): Promise<CommitmentRecord[]>;
declare function listDueCommitmentsForSession(params: {
  cfg?: OpenClawConfig;
  agentId: string;
  sessionKey: string;
  nowMs?: number;
  limit?: number;
}): Promise<CommitmentRecord[]>;
declare function listDueCommitmentSessionKeys(params: {
  cfg?: OpenClawConfig;
  agentId: string;
  nowMs?: number;
  limit?: number;
}): Promise<string[]>;
declare function markCommitmentsAttempted(params: {
  cfg?: OpenClawConfig;
  ids: string[];
  nowMs?: number;
}): Promise<void>;
declare function markCommitmentsStatus(params: {
  cfg?: OpenClawConfig;
  ids: string[];
  status: Extract<CommitmentStatus, "sent" | "dismissed" | "expired">;
  nowMs?: number;
}): Promise<void>;
declare function listCommitments(params?: {
  cfg?: OpenClawConfig;
  status?: CommitmentStatus;
  agentId?: string;
  nowMs?: number;
}): Promise<CommitmentRecord[]>;
//#endregion
export { listCommitments, listDueCommitmentSessionKeys, listDueCommitmentsForSession, listPendingCommitmentsForScope, markCommitmentsAttempted, markCommitmentsStatus, resolveCommitmentDatabasePath, upsertInferredCommitments };