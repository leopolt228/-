import { Gt as uploadBatchJsonlFile, en as EmbeddingBatchExecutionParams, gt as withRemoteHttpResponse, in as EmbeddingBatchStatus, on as postJsonWithRetry } from "../../types-Bi5Leigi.js";
import { n as VoyageEmbeddingClient } from "../../embedding-provider-8Az4peJS.js";

//#region extensions/voyage/embedding-batch.d.ts
/**
 * Voyage Batch API Input Line format.
 * See: https://docs.voyageai.com/docs/batch-inference
 */
type VoyageBatchRequest = {
  custom_id: string;
  body: {
    input: string | string[];
  };
};
type VoyageBatchStatus = EmbeddingBatchStatus;
type VoyageBatchDeps = {
  now: () => number;
  sleep: (ms: number) => Promise<void>;
  postJsonWithRetry: typeof postJsonWithRetry<VoyageBatchStatus>;
  uploadBatchJsonlFile: typeof uploadBatchJsonlFile;
  withRemoteHttpResponse: typeof withRemoteHttpResponse;
};
declare function runVoyageEmbeddingBatches(params: {
  client: VoyageEmbeddingClient;
  agentId: string;
  requests: VoyageBatchRequest[];
  deps?: Partial<VoyageBatchDeps>;
} & EmbeddingBatchExecutionParams): Promise<Map<string, number[]>>;
//#endregion
export { runVoyageEmbeddingBatches };