import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-CVTyEDNG.js";
import { t as modelCatalog } from "./openclaw.plugin-Da1weRYK.js";
//#region extensions/mistral/provider-catalog.ts
function buildMistralProvider() {
	return buildManifestModelProviderConfig({
		providerId: "mistral",
		catalog: modelCatalog.providers.mistral
	});
}
//#endregion
export { buildMistralProvider as t };
