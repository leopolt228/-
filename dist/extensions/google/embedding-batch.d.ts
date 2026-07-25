import { en as EmbeddingBatchExecutionParams } from "../../types-Bi5Leigi.js";
import { n as GeminiEmbeddingClient, r as GeminiTextEmbeddingRequest } from "../../embedding-provider-l_OOBxyT.js";

//#region extensions/google/embedding-batch.d.ts
type GeminiBatchRequest = {
  custom_id: string;
  request: GeminiTextEmbeddingRequest;
};
declare function runGeminiEmbeddingBatches(params: {
  gemini: GeminiEmbeddingClient;
  agentId: string;
  requests: GeminiBatchRequest[];
} & EmbeddingBatchExecutionParams): Promise<Map<string, number[]>>;
//#endregion
export { runGeminiEmbeddingBatches };