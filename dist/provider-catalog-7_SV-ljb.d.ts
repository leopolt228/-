import { m as ModelProviderDeclarationConfig } from "./types.models-FHGBX8Gn.js";
//#region extensions/nvidia/provider-catalog.d.ts
declare const NVIDIA_DEFAULT_MODEL_ID = "nvidia/nemotron-3-ultra-550b-a55b";
declare function buildNvidiaProvider(): ModelProviderDeclarationConfig;
declare function buildSelectableNvidiaProvider(): ModelProviderDeclarationConfig;
declare function buildLiveNvidiaProvider(): Promise<ModelProviderDeclarationConfig>;
declare function buildSelectableLiveNvidiaProvider(): Promise<ModelProviderDeclarationConfig>;
//#endregion
export { buildSelectableNvidiaProvider as a, buildSelectableLiveNvidiaProvider as i, buildLiveNvidiaProvider as n, buildNvidiaProvider as r, NVIDIA_DEFAULT_MODEL_ID as t };