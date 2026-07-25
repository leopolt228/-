import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { a as CommitmentScope } from "./types-Bx64ymas.js";

//#region src/commitments/runtime.d.ts
type CommitmentExtractionEnqueueInput = CommitmentScope & {
  cfg?: OpenClawConfig;
  nowMs?: number;
  userText: string;
  assistantText?: string;
  sourceMessageId?: string;
  sourceRunId?: string;
};
/** Enqueues one completed turn for delayed commitment extraction. */
declare function enqueueCommitmentExtraction(input: CommitmentExtractionEnqueueInput): boolean;
//#endregion
export { enqueueCommitmentExtraction as t };