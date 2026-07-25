import { i as OpenClawConfig } from "../types.openclaw-DAPZkTyD.js";
import { n as CommitmentExtractionBatchResult, r as CommitmentExtractionItem } from "../types-Bx64ymas.js";
//#region src/commitments/runtime.test-support.d.ts
type TimerHandle = ReturnType<typeof setTimeout>;
type CommitmentExtractionRuntime = {
  extractBatch?: (params: {
    cfg?: OpenClawConfig;
    items: CommitmentExtractionItem[];
  }) => Promise<CommitmentExtractionBatchResult>;
  resolveDefaultModel?: (params: {
    cfg: OpenClawConfig;
    agentId?: string;
  }) => {
    provider: string;
    model: string;
  };
  setTimer?: (callback: () => void, delayMs: number) => TimerHandle;
  clearTimer?: (timer: TimerHandle) => void;
  forceInTests?: boolean;
};
declare function configureCommitmentExtractionRuntime(next: CommitmentExtractionRuntime): void;
declare function drainCommitmentExtractionQueue(): Promise<number>;
declare function resetCommitmentExtractionRuntimeForTests(): void;
//#endregion
export { configureCommitmentExtractionRuntime, drainCommitmentExtractionQueue, resetCommitmentExtractionRuntimeForTests };