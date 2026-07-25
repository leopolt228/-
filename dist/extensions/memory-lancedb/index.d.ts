import { t as OpenClawPluginDefinition } from "../../types-Bi5Leigi.js";
import { v as OpenClawPluginConfigSchema, y as OpenClawPluginDefinition$1 } from "../../plugin-entry-Bj-pdgAt.js";
import { i as MemoryCategory } from "../../config-Bcaj9yPO.js";
import { a as MemoryQueryFilter } from "../../lancedb-store-DVv3snpG.js";

//#region extensions/memory-lancedb/index.d.ts
declare function normalizeRecallQuery(text: string, maxChars?: number): string;
declare function parseMemoryCliFilter(rawValue: unknown): MemoryQueryFilter | undefined;
declare function isEmbeddingDimensionsRejectedError(error: unknown): boolean;
declare function truncateEmbeddingVector(embedding: number[], dimensions: number, model: string): number[];
declare function runWithTimeout<T>(params: {
  timeoutMs: number;
  task: () => Promise<T>;
}): Promise<{
  status: "ok";
  value: T;
} | {
  status: "timeout";
}>;
declare const testing: {
  readonly isEmbeddingDimensionsRejectedError: typeof isEmbeddingDimensionsRejectedError;
  readonly runWithTimeout: typeof runWithTimeout;
  readonly truncateEmbeddingVector: typeof truncateEmbeddingVector;
};
declare function normalizeEmbeddingVector(value: unknown): number[];
declare function looksLikePromptInjection(text: string): boolean;
declare function escapeMemoryForPrompt(text: string): string;
/**
 * Returns true if `text` looks like it contains OpenClaw-injected envelope or
 * transport metadata that should never be persisted as a long-term memory.
 */
declare function looksLikeEnvelopeSludge(text: string): boolean;
/**
 * Strips OpenClaw-injected envelope metadata from a user message so that only
 * the user's actual intent text remains. Returns empty string if nothing
 * meaningful survives.
 */
declare function sanitizeForMemoryCapture(text: string): string;
declare function formatRelevantMemoriesContext(memories: Array<{
  category: MemoryCategory;
  text: string;
}>): string;
declare function shouldCapture(text: string, options?: {
  customTriggers?: string[];
  maxChars?: number;
}): boolean;
declare function detectCategory(text: string): MemoryCategory;
declare const _default: {
  id: string;
  name: string;
  description: string;
  configSchema: OpenClawPluginConfigSchema;
  register: NonNullable<OpenClawPluginDefinition$1["register"]>;
} & Pick<OpenClawPluginDefinition, "kind" | "reload" | "nodeHostCommands" | "securityAuditCollectors">;
//#endregion
export { _default as default, detectCategory, escapeMemoryForPrompt, formatRelevantMemoriesContext, looksLikeEnvelopeSludge, looksLikePromptInjection, normalizeEmbeddingVector, normalizeRecallQuery, parseMemoryCliFilter, sanitizeForMemoryCapture, shouldCapture, testing };