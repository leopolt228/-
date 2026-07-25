import { t as defineSingleProviderPluginEntry } from "../../provider-entry-Cxa0r8-X.js";
import { o as isModernCohereModelId } from "../../models-CpXor-BQ.js";
import { n as applyCohereConfig, t as COHERE_DEFAULT_MODEL_REF } from "../../onboard-DOzM2NBa.js";
import { t as buildCohereProvider } from "../../provider-catalog-sEI7-j-U.js";
import { t as createCohereCompletionsWrapper } from "../../stream-CCUSzcL5.js";
//#region extensions/cohere/index.ts
var cohere_default = defineSingleProviderPluginEntry({
	id: "cohere",
	name: "Cohere Provider",
	description: "Cohere provider plugin",
	provider: {
		label: "Cohere",
		docsPath: "/providers/cohere",
		auth: [{
			methodId: "api-key",
			label: "Cohere API key",
			hint: "OpenAI-compatible inference",
			optionKey: "cohereApiKey",
			flagName: "--cohere-api-key",
			envVar: "COHERE_API_KEY",
			promptMessage: "Enter Cohere API key",
			defaultModel: COHERE_DEFAULT_MODEL_REF,
			applyConfig: (cfg) => applyCohereConfig(cfg),
			wizard: {
				groupLabel: "Cohere",
				groupHint: "OpenAI-compatible inference"
			}
		}],
		catalog: {
			buildProvider: buildCohereProvider,
			buildStaticProvider: buildCohereProvider
		},
		wrapStreamFn: (ctx) => createCohereCompletionsWrapper(ctx.streamFn),
		wrapSimpleCompletionStreamFn: (ctx) => createCohereCompletionsWrapper(ctx.streamFn),
		isModernModelRef: ({ modelId }) => isModernCohereModelId(modelId)
	}
});
//#endregion
export { cohere_default as default };
