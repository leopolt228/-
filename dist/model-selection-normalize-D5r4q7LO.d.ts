import { t as PluginManifestRecord } from "./manifest-registry-C53V9sX9.js";

//#region src/agents/model-selection-normalize.d.ts
type ModelRef = {
  provider: string;
  model: string;
};
type ModelManifestNormalizationContext = {
  manifestPlugins?: readonly Pick<PluginManifestRecord, "modelIdNormalization">[];
};
/** Find a provider value by normalized provider ID. */
declare function findNormalizedProviderValue<T>(entries: Record<string, T> | undefined, provider: string): T | undefined;
type ModelRefNormalizeOptions = ModelManifestNormalizationContext & {
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
};
/** Normalize a provider/model pair into a canonical model reference. */
/** Parse `provider/model` or bare model text using a default provider. */
declare function parseModelRef(raw: string, defaultProvider: string, options?: ModelRefNormalizeOptions): ModelRef | null;
//#endregion
export { parseModelRef as i, ModelRef as n, findNormalizedProviderValue as r, ModelManifestNormalizationContext as t };