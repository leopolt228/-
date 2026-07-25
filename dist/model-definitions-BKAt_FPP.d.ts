import { s as ModelDefinitionConfig } from "./types.models-FHGBX8Gn.js";
//#region extensions/minimax/model-definitions.d.ts
declare const DEFAULT_MINIMAX_BASE_URL = "https://api.minimax.io/v1";
declare const MINIMAX_API_BASE_URL = "https://api.minimax.io/anthropic";
declare const MINIMAX_CN_API_BASE_URL = "https://api.minimaxi.com/anthropic";
declare const MINIMAX_HOSTED_MODEL_ID = "MiniMax-M3";
declare const MINIMAX_HOSTED_MODEL_REF = "minimax/MiniMax-M3";
declare const DEFAULT_MINIMAX_MAX_TOKENS = 131072;
declare const MINIMAX_API_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
declare const MINIMAX_HOSTED_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
declare const MINIMAX_LM_STUDIO_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
declare function resolveMinimaxApiCost(modelId: string): ModelDefinitionConfig["cost"];
declare function buildMinimaxModelDefinition(params: {
  id: string;
  name?: string;
  reasoning?: boolean;
  cost: ModelDefinitionConfig["cost"];
  contextWindow: number;
  maxTokens: number;
}): ModelDefinitionConfig;
declare function buildMinimaxApiModelDefinition(modelId: string): ModelDefinitionConfig;
//#endregion
export { MINIMAX_CN_API_BASE_URL as a, MINIMAX_HOSTED_MODEL_REF as c, buildMinimaxModelDefinition as d, resolveMinimaxApiCost as f, MINIMAX_API_COST as i, MINIMAX_LM_STUDIO_COST as l, DEFAULT_MINIMAX_MAX_TOKENS as n, MINIMAX_HOSTED_COST as o, MINIMAX_API_BASE_URL as r, MINIMAX_HOSTED_MODEL_ID as s, DEFAULT_MINIMAX_BASE_URL as t, buildMinimaxApiModelDefinition as u };