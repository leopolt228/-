import { en as EmbeddingBatchExecutionParams } from "../../types-Bi5Leigi.js";
import { n as OpenAiEmbeddingClient } from "../../embedding-provider-BhplP7xr.js";

//#region extensions/openai/embedding-batch.d.ts
type OpenAiBatchRequest = {
  custom_id: string;
  method: "POST";
  url: "/v1/embeddings";
  body: {
    model: string;
    input: string;
  };
};
declare const OPENAI_BATCH_ENDPOINT = "/v1/embeddings";
declare function runOpenAiEmbeddingBatches(params: {
  openAi: OpenAiEmbeddingClient;
  agentId: string;
  requests: OpenAiBatchRequest[];
  maxJsonlBytes?: number;
} & EmbeddingBatchExecutionParams): Promise<Map<string, number[]>>;
//#endregion
export { OPENAI_BATCH_ENDPOINT, runOpenAiEmbeddingBatches };