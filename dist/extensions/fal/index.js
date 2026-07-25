import { t as definePluginEntry } from "../../plugin-entry-IGDbtR-A.js";
import { t as buildFalImageGenerationProvider } from "../../image-generation-provider-CE6U7uxz.js";
import { t as buildFalMusicGenerationProvider } from "../../music-generation-provider-eN1Xt6-M.js";
import { t as createFalProvider } from "../../provider-registration-CQwmI315.js";
import { t as buildFalVideoGenerationProvider } from "../../video-generation-provider-B4PlW1AN.js";
var fal_default = definePluginEntry({
	id: "fal",
	name: "fal Provider",
	description: "Bundled fal image, video, and music generation provider",
	register(api) {
		api.registerProvider(createFalProvider());
		api.registerImageGenerationProvider(buildFalImageGenerationProvider());
		api.registerMusicGenerationProvider(buildFalMusicGenerationProvider());
		api.registerVideoGenerationProvider(buildFalVideoGenerationProvider());
	}
});
//#endregion
export { fal_default as default };
