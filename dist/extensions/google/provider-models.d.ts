import { qc as ProviderRuntimeModel } from "../../types-Bi5Leigi.js";
import { Qt as ProviderResolveDynamicModelContext } from "../../plugin-entry-Bj-pdgAt.js";

//#region extensions/google/provider-models.d.ts
declare function resolveGoogleGeminiForwardCompatModel(params: {
  providerId: string;
  templateProviderId?: string;
  ctx: ProviderResolveDynamicModelContext;
}): ProviderRuntimeModel | undefined;
declare function isModernGoogleModel(modelId: string): boolean;
//#endregion
export { isModernGoogleModel, resolveGoogleGeminiForwardCompatModel };