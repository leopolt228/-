import { t as definePluginEntry } from "../../plugin-entry-IGDbtR-A.js";
import { t as elevenLabsMediaUnderstandingProvider } from "../../media-understanding-provider-CyUOWFca.js";
import { t as buildElevenLabsRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-CJKs1DOa.js";
import { t as buildElevenLabsSpeechProvider } from "../../speech-provider-CpZ2PUy2.js";
//#region extensions/elevenlabs/index.ts
var elevenlabs_default = definePluginEntry({
	id: "elevenlabs",
	name: "ElevenLabs Speech",
	description: "Bundled ElevenLabs speech provider",
	register(api) {
		api.registerSpeechProvider(buildElevenLabsSpeechProvider());
		api.registerMediaUnderstandingProvider(elevenLabsMediaUnderstandingProvider);
		api.registerRealtimeTranscriptionProvider(buildElevenLabsRealtimeTranscriptionProvider());
	}
});
//#endregion
export { elevenlabs_default as default };
