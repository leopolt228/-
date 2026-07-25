import { c as Context, f as Model, v as SimpleStreamOptions } from "./types-CVnOkpxa.js";
import { y as StreamFn } from "./types-Dedz4oTJ.js";
import { i as GoogleThinkingLevel } from "./provider-stream-shared-DTYsoEex.js";
//#region extensions/google/transport-stream.d.ts
type CanonicalGoogleTransportApi = "google-generative-ai" | "google-vertex";
type GoogleTransportApi = CanonicalGoogleTransportApi | "openclaw-google-generative-ai-transport";
type GoogleTransportModel = Model<GoogleTransportApi> & {
  headers?: Record<string, string>;
  provider: string;
};
type GoogleTransportOptions = SimpleStreamOptions & {
  cachedContent?: string;
  toolChoice?: "auto" | "none" | "any" | "required" | {
    type: "function";
    function: {
      name: string;
    };
  };
  thinking?: {
    enabled: boolean;
    budgetTokens?: number;
    level?: GoogleThinkingLevel;
  };
};
type GoogleGenerateContentRequest = {
  cachedContent?: string;
  contents: Array<Record<string, unknown>>;
  generationConfig?: Record<string, unknown>;
  systemInstruction?: Record<string, unknown>;
  tools?: Array<Record<string, unknown>>;
  toolConfig?: Record<string, unknown>;
};
declare function buildGoogleGenerativeAiParams(model: GoogleTransportModel, context: Context, options?: GoogleTransportOptions): GoogleGenerateContentRequest;
declare function createGoogleGenerativeAiTransportStreamFn(): StreamFn;
declare function createGoogleVertexTransportStreamFn(): StreamFn;
//#endregion
export { createGoogleGenerativeAiTransportStreamFn as n, createGoogleVertexTransportStreamFn as r, buildGoogleGenerativeAiParams as t };