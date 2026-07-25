import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DTFzouyz.js";
import { T as setSpeechRuntimeAvailabilityGuard } from "./runtime-api-IUluPrEw.js";
import "./tts-runtime-glkhnUcd.js";
//#region src/tts/tts.ts
/** Public TTS runtime barrel exposed to core callers and plugin SDK facades. */
setSpeechRuntimeAvailabilityGuard(() => {
	assertSecretOwnerAvailable("capability", "tts");
});
//#endregion
export {};
