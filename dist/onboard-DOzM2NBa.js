import { p as createModelCatalogPresetAppliers } from "./provider-onboard-BhAeQ_J7.js";
import { a as buildCohereModelDefinition, n as COHERE_COMMAND_A_PLUS_MODEL_ID, r as COHERE_MODEL_CATALOG, t as COHERE_BASE_URL } from "./models-CpXor-BQ.js";
const COHERE_DEFAULT_MODEL_REF = `cohere/${COHERE_COMMAND_A_PLUS_MODEL_ID}`;
const coherePresetAppliers = createModelCatalogPresetAppliers({
	primaryModelRef: COHERE_DEFAULT_MODEL_REF,
	resolveParams: (_cfg) => ({
		providerId: "cohere",
		api: "openai-completions",
		baseUrl: COHERE_BASE_URL,
		catalogModels: COHERE_MODEL_CATALOG.map(buildCohereModelDefinition),
		aliases: [{
			modelRef: COHERE_DEFAULT_MODEL_REF,
			alias: "Cohere Command A+"
		}]
	})
});
function applyCohereConfig(cfg) {
	return coherePresetAppliers.applyConfig(cfg);
}
//#endregion
export { applyCohereConfig as n, COHERE_DEFAULT_MODEL_REF as t };
