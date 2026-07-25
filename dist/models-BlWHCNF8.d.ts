import { s as ModelDefinitionConfig } from "./types.models-FHGBX8Gn.js";
//#region extensions/synthetic/models.d.ts
declare const SYNTHETIC_BASE_URL = "https://api.synthetic.new/anthropic";
declare const SYNTHETIC_DEFAULT_MODEL_ID = "hf:MiniMaxAI/MiniMax-M3";
declare const SYNTHETIC_DEFAULT_MODEL_REF = "synthetic/hf:MiniMaxAI/MiniMax-M3";
declare const SYNTHETIC_MODEL_CATALOG: readonly [{
  readonly id: "hf:MiniMaxAI/MiniMax-M3";
  readonly name: "MiniMax M3";
  readonly reasoning: true;
  readonly input: readonly ["text", "image"];
  readonly contextWindow: 262144;
  readonly maxTokens: 65536;
}, {
  readonly id: "hf:moonshotai/Kimi-K2.7-Code";
  readonly name: "Kimi K2.7 Code";
  readonly reasoning: true;
  readonly input: readonly ["text", "image"];
  readonly contextWindow: 262144;
  readonly maxTokens: 8192;
}, {
  readonly id: "hf:nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-NVFP4";
  readonly name: "NVIDIA Nemotron 3 Super 120B A12B";
  readonly reasoning: true;
  readonly input: readonly ["text"];
  readonly contextWindow: 262144;
  readonly maxTokens: 8192;
}, {
  readonly id: "hf:openai/gpt-oss-120b";
  readonly name: "GPT OSS 120B";
  readonly reasoning: true;
  readonly input: readonly ["text"];
  readonly contextWindow: 131072;
  readonly maxTokens: 8192;
}, {
  readonly id: "hf:Qwen/Qwen3.6-27B";
  readonly name: "Qwen3.6 27B";
  readonly reasoning: true;
  readonly input: readonly ["text", "image"];
  readonly contextWindow: 262144;
  readonly maxTokens: 81920;
}, {
  readonly id: "hf:zai-org/GLM-4.7-Flash";
  readonly name: "GLM-4.7 Flash";
  readonly reasoning: true;
  readonly input: readonly ["text"];
  readonly contextWindow: 196608;
  readonly maxTokens: 131072;
}, {
  readonly id: "hf:zai-org/GLM-5.2";
  readonly name: "GLM-5.2";
  readonly reasoning: true;
  readonly input: readonly ["text"];
  readonly contextWindow: 524288;
  readonly maxTokens: 131072;
}];
type SyntheticCatalogEntry = (typeof SYNTHETIC_MODEL_CATALOG)[number];
declare function buildSyntheticModelDefinition(entry: SyntheticCatalogEntry): ModelDefinitionConfig;
//#endregion
export { buildSyntheticModelDefinition as a, SYNTHETIC_MODEL_CATALOG as i, SYNTHETIC_DEFAULT_MODEL_ID as n, SYNTHETIC_DEFAULT_MODEL_REF as r, SYNTHETIC_BASE_URL as t };