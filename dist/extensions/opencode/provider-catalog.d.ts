import { m as ModelProviderDeclarationConfig } from "../../types.models-FHGBX8Gn.js";
import { qc as ProviderRuntimeModel } from "../../types-Bi5Leigi.js";
import { t as ModelCatalogEntry } from "../../model-catalog.types-cokHDhLz.js";
import { a as LiveModelCatalogFetchGuard } from "../../provider-catalog-live-runtime-DqNV74ov.js";

//#region extensions/opencode/provider-catalog.d.ts
type FetchOpencodeZenLiveModelIdsParams = {
  apiKey?: string;
  discoveryApiKey?: string;
  fetchGuard?: LiveModelCatalogFetchGuard;
  signal?: AbortSignal;
};
declare function buildStaticOpencodeZenProviderConfig(apiKey?: string): ModelProviderDeclarationConfig;
declare function buildOpencodeZenLiveProviderConfig(params?: FetchOpencodeZenLiveModelIdsParams): Promise<ModelProviderDeclarationConfig>;
declare function listOpencodeZenModelCatalogEntries(): ModelCatalogEntry[];
declare function resolveOpencodeZenModel(modelId: string): ProviderRuntimeModel | undefined;
declare function normalizeOpencodeZenBaseUrl(params: {
  api?: string | null;
  baseUrl?: string;
}): string | undefined;
//#endregion
export { buildOpencodeZenLiveProviderConfig, buildStaticOpencodeZenProviderConfig, listOpencodeZenModelCatalogEntries, normalizeOpencodeZenBaseUrl, resolveOpencodeZenModel };