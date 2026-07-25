import { s as ModelDefinitionConfig } from "./types.models-FHGBX8Gn.js";
//#region extensions/mistral/model-definitions.d.ts
declare const MISTRAL_BASE_URL: string;
declare const MISTRAL_DEFAULT_MODEL_ID = "mistral-large-latest";
declare function buildMistralModelDefinition(): ModelDefinitionConfig;
//#endregion
export { MISTRAL_DEFAULT_MODEL_ID as n, buildMistralModelDefinition as r, MISTRAL_BASE_URL as t };