import { M as Usage, c as Context, f as Model, n as Api } from "../types-CVnOkpxa.js";
import { o as ModelCompatConfig } from "../types.models-FHGBX8Gn.js";
import { r as AssistantMessageEventStream } from "../validation-C7EKSWt7.js";
import { t as ContextUsage } from "../usage-BtQDwoEq.js";
import { OpenAIApiReasoningEffort, OpenAICompletionsToolChoice, OpenAIReasoningEffort } from "@openclaw/ai/internal/openai";
import { describeToolResultMediaPlaceholder, extractToolResultText, stripSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
import OpenAI from "openai";
import { ChatCompletionChunk } from "openai/resources/chat/completions.js";
import { FunctionTool, ResponseCreateParamsStreaming, ResponseInput, ResponseReasoningItem } from "openai/resources/responses/responses.js";

//#region src/agents/provider-transport-fetch.d.ts
declare function buildGuardedModelFetch(model: Model, timeoutMs?: number, options?: {
  sanitizeSse?: boolean;
}): typeof fetch;
//#endregion
//#region src/agents/openai-transport-shared.d.ts
type BaseOpenAIStreamOptions = {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stop?: string[];
  signal?: AbortSignal;
  apiKey?: string;
  cacheRetention?: "none" | "short" | "long";
  sessionId?: string;
  promptCacheKey?: string;
  authProfileId?: string;
  onPayload?: (payload: unknown, model: Model) => unknown;
  headers?: Record<string, string>;
  firstEventTimeoutMs?: number;
  onFirstEventTimeout?: (reason: Error) => void;
  openclawCodeModeToolSurface?: boolean;
  responseFormat?: Record<string, unknown>;
  frequencyPenalty?: number;
  presencePenalty?: number;
  seed?: number;
};
type OpenAICompletionsOptions = BaseOpenAIStreamOptions & {
  toolChoice?: OpenAICompletionsToolChoice;
  reasoning?: OpenAIReasoningEffort;
  reasoningEffort?: OpenAIReasoningEffort;
};
type OpenAIModeCompatInput = Omit<ModelCompatConfig, "thinkingFormat"> & {
  thinkingFormat?: string;
};
type OpenAIModeModel = Omit<Model, "compat"> & {
  compat?: OpenAIModeCompatInput | null;
};
type MutableAssistantOutput = {
  role: "assistant";
  content: Array<Record<string, unknown>>;
  api: Api;
  provider: string;
  model: string;
  usage: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    reasoningTokens?: number;
    totalTokens: number;
    cost: Usage["cost"];
  };
  stopReason: string;
  timestamp: number;
  responseId?: string;
  errorMessage?: string;
  errorCode?: string;
  errorType?: string;
  errorBody?: string;
};
//#endregion
//#region src/agents/openai-transport-params.d.ts
declare function enforceCodeModeResponsesToolSurface(payload: unknown): void;
declare function assertCodeModeResponsesToolSurface(payload: unknown): void;
declare function buildOpenAIClientHeaders(model: Model, context: Context, optionHeaders?: Record<string, string>, turnHeaders?: Record<string, string>, sessionId?: string): Record<string, string>;
declare function buildOpenAISdkClientOptions(model: Model): {
  timeout?: number;
};
declare function buildOpenAISdkRequestOptions(model: Model, signal?: AbortSignal, options?: {
  stream?: boolean;
}): {
  signal?: AbortSignal;
  timeout?: number;
  headers?: Record<string, string>;
} | undefined;
declare function getCompat(model: OpenAIModeModel): {
  supportsStore: boolean;
  supportsDeveloperRole: boolean;
  supportsReasoningEffort: boolean;
  reasoningEffortMap: Record<string, string>;
  supportsUsageInStreaming: boolean;
  maxTokensField: string;
  requiresToolResultName: boolean;
  requiresAssistantAfterToolResult: boolean;
  requiresThinkingAsText: boolean;
  thinkingFormat: string;
  openRouterRouting: Record<string, unknown>;
  vercelGatewayRouting: {};
  supportsStrictMode: boolean;
  supportsPromptCacheKey: boolean;
  supportsLongCacheRetention: boolean;
  requiresStringContent: boolean;
  strictMessageKeys: boolean;
  visibleReasoningDetailTypes: string[];
  requiresReasoningContentOnAssistantMessages: boolean;
  requiresNonEmptyUserOrAssistantMessage: boolean;
};
//#endregion
//#region src/agents/openai-completions-transport.d.ts
declare function createSseDoneDetector(): {
  observe(chunk: Uint8Array): void;
  finish(): void;
  sawDone: () => boolean;
};
declare function createOpenAICompletionsClient(model: Model, context: Context, apiKey: string, optionHeaders?: Record<string, string>, opts?: {
  fetch?: typeof globalThis.fetch;
}): OpenAI;
declare function buildOpenAICompletionsClientConfig(model: Model, context: Context, optionHeaders?: Record<string, string>): {
  baseURL: string;
  defaultHeaders: Record<string, string>;
  defaultQuery?: Record<string, string>;
};
declare function processOpenAICompletionsStream(responseStream: AsyncIterable<ChatCompletionChunk>, output: MutableAssistantOutput, model: Model, stream: {
  push(event: unknown): void;
}, options?: {
  signal?: AbortSignal;
  emitReasoning?: boolean;
  firstEventTimeoutMs?: number;
  abortFirstEventStream?: (reason: Error) => void;
  onFirstEventTimeout?: (reason: Error) => void;
  sawStreamDONE?: () => boolean;
}): Promise<void>;
declare function shouldEmitOpenAICompletionsReasoningForModel(model: OpenAIModeModel, options: OpenAICompletionsOptions | undefined): boolean;
declare function parseTransportChunkUsage(rawUsage: NonNullable<ChatCompletionChunk["usage"]> & {
  cost?: unknown;
}, model: Model): MutableAssistantOutput["usage"];
declare const completionsTesting: {
  getCompat: typeof getCompat;
  createSseDoneDetector: typeof createSseDoneDetector;
  createOpenAICompletionsClient: typeof createOpenAICompletionsClient;
  buildOpenAICompletionsClientConfig: typeof buildOpenAICompletionsClientConfig;
  parseTransportChunkUsage: typeof parseTransportChunkUsage;
  processOpenAICompletionsStream: typeof processOpenAICompletionsStream;
  shouldEmitOpenAICompletionsReasoningForModel: typeof shouldEmitOpenAICompletionsReasoningForModel;
};
declare global {
  var openclawOpenAICompletionsTransportTestApi: typeof completionsTesting | undefined;
}
//#endregion
//#region src/agents/model-transport-url.d.ts
/** Format a configured base URL for debug output, or the implicit default. */
declare function formatModelTransportDebugBaseUrl(rawUrl: string | undefined): string;
//#endregion
//#region src/agents/openai-responses-transport.d.ts
declare const OPENAI_RESPONSES_REASONING_REPLAY_META_KEY = "__openclaw_replay";
type OpenAIResponsesReasoningReplayMetadata = {
  v: 1;
  source: "openai-responses";
  provider: string;
  api: Api;
  model: string;
  baseUrlHash?: string;
  sessionHash?: string;
  authProfileHash?: string;
};
type ReplayableResponseReasoningItem = Omit<ResponseReasoningItem, "id"> & {
  id?: string;
  [OPENAI_RESPONSES_REASONING_REPLAY_META_KEY]?: OpenAIResponsesReasoningReplayMetadata;
};
type ResponsesClientLike = ReturnType<typeof createOpenAIResponsesClient>;
type OpenAIResponsesOptions = BaseOpenAIStreamOptions & {
  reasoning?: OpenAIReasoningEffort;
  reasoningEffort?: OpenAIReasoningEffort;
  reasoningSummary?: "auto" | "detailed" | "concise" | null;
  replayResponsesItemIds?: boolean;
  serviceTier?: ResponseCreateParamsStreaming["service_tier"];
  toolChoice?: ResponseCreateParamsStreaming["tool_choice"];
};
type OpenAIResponsesReplayContext = {
  provider: string;
  api: Api;
  model: string;
  baseUrlHash?: string;
  sessionHash?: string;
  authProfileHash?: string;
};
declare function summarizeResponsesTools(tools: unknown): string;
declare function stringifyRedactedPayload(value: unknown): string;
declare function stringifyRedactedEvent(value: unknown): string;
type ResponsesFailedNoDetailsObservation = {
  event: "openai_responses_response_failed_without_details";
  provider: string;
  api: Api;
  transportModel: string;
  providerRuntimeFailureKind: "no_error_details";
  responseId: string;
  responseStatus: string;
  responseModel: string;
  responseObject: string;
  metadataKeys: string[];
  requestIdHashes: string[];
  failureFieldsPreview: string;
  responsePreview: string;
};
type ResponsesFailedEventSummary = {
  message: string;
  responseId?: string;
  observation?: ResponsesFailedNoDetailsObservation;
};
declare function buildResponsesFailedNoDetailsObservation(event: Record<string, unknown>, model: Model, response?: Record<string, unknown> | undefined): ResponsesFailedNoDetailsObservation;
declare function summarizeResponsesFailedNoDetailsObservation(observation: ResponsesFailedNoDetailsObservation): string;
declare function normalizeResponsesFailedEvent(event: Record<string, unknown>, model: Model): ResponsesFailedEventSummary;
declare function summarizeResponsesPayload(params: unknown): string;
declare function isInvalidEncryptedContentError(error: unknown): boolean;
declare function stripResponsesRequestEncryptedContent(params: OpenAIResponsesRequestParams): OpenAIResponsesRequestParams;
declare function buildOpenAIResponsesReasoningReplayMetadata(model: Model, options?: Pick<BaseOpenAIStreamOptions, "authProfileId" | "sessionId">): OpenAIResponsesReasoningReplayMetadata;
declare function tagOpenAIResponsesReasoningReplayItem(item: Record<string, unknown>, model: Model, options?: Pick<BaseOpenAIStreamOptions, "authProfileId" | "sessionId">): Record<string, unknown>;
declare function prepareOpenAIResponsesReasoningItemForReplay(item: ReplayableResponseReasoningItem, context: OpenAIResponsesReplayContext, blockMetadata?: OpenAIResponsesReasoningReplayMetadata): ReplayableResponseReasoningItem;
declare function createResponsesStreamWithEncryptedContentRetry(params: {
  client: ResponsesClientLike;
  request: OpenAIResponsesRequestParams;
  requestOptions: unknown;
  model: Model;
}): Promise<AsyncIterable<unknown>>;
declare function resolveAzureOpenAIApiVersion(env?: NodeJS.ProcessEnv): string;
declare function processResponsesStream(openaiStream: AsyncIterable<unknown>, output: MutableAssistantOutput, stream: {
  push(event: unknown): void;
}, model: Model, options?: {
  serviceTier?: ResponseCreateParamsStreaming["service_tier"];
  applyServiceTierPricing?: (usage: MutableAssistantOutput["usage"], serviceTier?: ResponseCreateParamsStreaming["service_tier"]) => void;
  firstEventTimeoutMs?: number;
  abortFirstEventStream?: (reason: Error) => void;
  onFirstEventTimeout?: (reason: Error) => void;
  signal?: AbortSignal;
  sessionId?: string;
  authProfileId?: string;
}): Promise<void>;
declare function createOpenAIResponsesClient(model: Model, context: Context, apiKey: string, optionHeaders?: Record<string, string>, turnHeaders?: Record<string, string>, sessionId?: string): OpenAI;
declare function sanitizeOpenAICodexResponsesParams<T extends Record<string, unknown>>(model: Model, params: T): T;
declare function buildOpenAIResponsesParams(model: Model, context: Context, options: OpenAIResponsesOptions | undefined, metadata?: Record<string, string>): OpenAIResponsesRequestParams;
declare function createAzureOpenAIClient(model: Model, context: Context, apiKey: string, optionHeaders?: Record<string, string>, turnHeaders?: Record<string, string>): OpenAI;
type OpenAIResponsesRequestParams = {
  model: string;
  input: ResponseInput;
  stream: true;
  instructions?: string;
  prompt_cache_key?: string;
  prompt_cache_retention?: "24h";
  metadata?: Record<string, string>;
  store?: boolean;
  max_output_tokens?: number;
  temperature?: number;
  top_p?: number;
  text?: ResponseCreateParamsStreaming["text"];
  service_tier?: ResponseCreateParamsStreaming["service_tier"];
  tools?: FunctionTool[];
  tool_choice?: ResponseCreateParamsStreaming["tool_choice"];
  reasoning?: {
    effort: OpenAIApiReasoningEffort;
  } | {
    effort: OpenAIApiReasoningEffort;
    summary: NonNullable<OpenAIResponsesOptions["reasoningSummary"]>;
  };
  include?: string[];
};
declare const responsesTesting: {
  getCompat: typeof getCompat;
  assertCodeModeResponsesToolSurface: typeof assertCodeModeResponsesToolSurface;
  buildOpenAIResponsesParams: typeof buildOpenAIResponsesParams;
  buildOpenAIClientHeaders: typeof buildOpenAIClientHeaders;
  buildOpenAISdkClientOptions: typeof buildOpenAISdkClientOptions;
  buildOpenAISdkRequestOptions: typeof buildOpenAISdkRequestOptions;
  createAzureOpenAIClient: typeof createAzureOpenAIClient;
  createOpenAIResponsesClient: typeof createOpenAIResponsesClient;
  enforceCodeModeResponsesToolSurface: typeof enforceCodeModeResponsesToolSurface;
  sanitizeOpenAICodexResponsesParams: typeof sanitizeOpenAICodexResponsesParams;
  processResponsesStream: typeof processResponsesStream;
  formatModelTransportDebugBaseUrl: typeof formatModelTransportDebugBaseUrl;
  buildResponsesFailedNoDetailsObservation: typeof buildResponsesFailedNoDetailsObservation;
  buildOpenAIResponsesReasoningReplayMetadata: typeof buildOpenAIResponsesReasoningReplayMetadata;
  isInvalidEncryptedContentError: typeof isInvalidEncryptedContentError;
  normalizeResponsesFailedEvent: typeof normalizeResponsesFailedEvent;
  prepareOpenAIResponsesReasoningItemForReplay: typeof prepareOpenAIResponsesReasoningItemForReplay;
  createResponsesStreamWithEncryptedContentRetry: typeof createResponsesStreamWithEncryptedContentRetry;
  resolveAzureOpenAIApiVersion: typeof resolveAzureOpenAIApiVersion;
  stripResponsesRequestEncryptedContent: typeof stripResponsesRequestEncryptedContent;
  tagOpenAIResponsesReasoningReplayItem: typeof tagOpenAIResponsesReasoningReplayItem;
  summarizeResponsesFailedNoDetailsObservation: typeof summarizeResponsesFailedNoDetailsObservation;
  summarizeResponsesPayload: typeof summarizeResponsesPayload;
  summarizeResponsesTools: typeof summarizeResponsesTools;
  stringifyRedactedEvent: typeof stringifyRedactedEvent;
  stringifyRedactedPayload: typeof stringifyRedactedPayload;
};
declare global {
  var openclawOpenAIResponsesTransportTestApi: typeof responsesTesting | undefined;
}
//#endregion
//#region src/agents/openai-transport-stream.d.ts
declare function buildOpenAICompletionsParams(model: OpenAIModeModel, context: Context, options: OpenAICompletionsOptions | undefined): Record<string, unknown>;
//#endregion
//#region src/agents/transport-message-transform.d.ts
/** Transforms transcript messages into a provider-safe replay context. */
declare function transformTransportMessages(messages: Context["messages"], model: Model, normalizeToolCallId?: (id: string, targetModel: Model, source: {
  provider: string;
  api: Api;
  model: string;
}) => string, options?: {
  normalizeSameModelToolCallIds?: boolean;
  preserveCrossModelToolCallThoughtSignature?: boolean;
}): Context["messages"];
//#endregion
//#region src/agents/transport-stream-shared.d.ts
type TransportUsage = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  contextUsage?: ContextUsage;
  totalTokens: number;
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    total: number;
  };
};
type WritableTransportStream = {
  push(event: unknown): void;
  end(): void;
};
type TransportOutputShape = {
  stopReason: string;
  errorMessage?: string;
  errorCode?: string;
  errorType?: string;
  errorBody?: string;
};
/**
 * Encodes an assistant text-block phase signature (v1). Channels and the
 * embedded handler read this to route commentary/narration out of the final
 * reply. Shared so every provider transport tags phases identically.
 */
declare function sanitizeTransportPayloadText(text: string): string;
declare function coerceTransportToolCallArguments(argumentsValue: unknown): Record<string, unknown>;
declare function mergeTransportHeaders(...headerSources: Array<Record<string, string> | undefined>): Record<string, string> | undefined;
declare function createEmptyTransportUsage(): TransportUsage;
declare function createWritableTransportEventStream(): {
  eventStream: AssistantMessageEventStream;
  stream: WritableTransportStream;
};
declare function finalizeTransportStream(params: {
  stream: WritableTransportStream;
  output: TransportOutputShape;
  signal?: AbortSignal;
}): void;
declare function failTransportStream(params: {
  stream: WritableTransportStream;
  output: TransportOutputShape;
  signal?: AbortSignal;
  error: unknown;
  cleanup?: () => void;
}): void;
//#endregion
export { type WritableTransportStream, buildGuardedModelFetch, buildOpenAICompletionsParams, coerceTransportToolCallArguments, createEmptyTransportUsage, createWritableTransportEventStream, describeToolResultMediaPlaceholder, extractToolResultText, failTransportStream, finalizeTransportStream, mergeTransportHeaders, sanitizeTransportPayloadText, stripSystemPromptCacheBoundary, transformTransportMessages };