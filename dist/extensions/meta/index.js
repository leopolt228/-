import { a as buildProviderReplayFamilyHooks } from "../../provider-model-shared-Dzz3IkWT.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-Cxa0r8-X.js";
import { n as applyMetaConfig, t as META_DEFAULT_MODEL_REF } from "../../onboard-Di21PVjq.js";
import { t as buildMetaProvider } from "../../provider-catalog-oQHucfEz.js";
import { t as wrapMetaProviderStream } from "../../stream-C3CF6gdI.js";
import { t as resolveMetaThinkingProfile } from "../../thinking-B5r9ylsm.js";
var meta_default = defineSingleProviderPluginEntry({
	id: "meta",
	name: "Meta Provider",
	description: "Bundled Meta provider plugin",
	provider: {
		label: "Meta",
		docsPath: "/providers/meta",
		auth: [{
			methodId: "api-key",
			label: "Meta API key",
			hint: "Meta (Responses API)",
			optionKey: "metaApiKey",
			flagName: "--meta-api-key",
			envVar: "MODEL_API_KEY",
			promptMessage: "Enter Meta API key",
			defaultModel: META_DEFAULT_MODEL_REF,
			applyConfig: (cfg) => applyMetaConfig(cfg),
			noteMessage: ["Meta provides Responses API inference."].join("\n"),
			noteTitle: "Meta",
			wizard: {
				groupLabel: "Meta",
				groupHint: "Meta (Responses API)"
			}
		}],
		catalog: {
			buildProvider: buildMetaProvider,
			buildStaticProvider: buildMetaProvider
		},
		...buildProviderReplayFamilyHooks({ family: "openai-compatible" }),
		wrapStreamFn: wrapMetaProviderStream,
		resolveThinkingProfile: ({ modelId }) => resolveMetaThinkingProfile(modelId)
	}
});
//#endregion
export { meta_default as default };
