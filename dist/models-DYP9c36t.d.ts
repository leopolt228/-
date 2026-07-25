import { s as ModelDefinitionConfig } from "./types.models-FHGBX8Gn.js";
//#region extensions/huggingface/models.d.ts
declare const HUGGINGFACE_BASE_URL = "https://router.huggingface.co/v1";
declare const HUGGINGFACE_POLICY_SUFFIXES: readonly ["cheapest", "fastest"];
declare const HUGGINGFACE_MODEL_CATALOG: ModelDefinitionConfig[];
declare function isHuggingfacePolicyLocked(modelRef: string): boolean;
declare function buildHuggingfaceModelDefinition(model: (typeof HUGGINGFACE_MODEL_CATALOG)[number]): ModelDefinitionConfig;
declare function discoverHuggingfaceModels(apiKey: string, timeoutMs?: number): Promise<ModelDefinitionConfig[]>;
//#endregion
export { discoverHuggingfaceModels as a, buildHuggingfaceModelDefinition as i, HUGGINGFACE_MODEL_CATALOG as n, isHuggingfacePolicyLocked as o, HUGGINGFACE_POLICY_SUFFIXES as r, HUGGINGFACE_BASE_URL as t };