import { Vo as SpeechProviderId } from "./types-Bi5Leigi.js";

//#region src/tts/provider-registry-core.d.ts
/** Normalize user/provider IDs into the canonical speech provider ID shape. */
declare function normalizeSpeechProviderId(providerId: string | undefined): SpeechProviderId | undefined;
//#endregion
export { normalizeSpeechProviderId as t };