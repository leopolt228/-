import { S as VideoDescriptionResult, d as MediaUnderstandingProvider, n as AudioTranscriptionResult, t as AudioTranscriptionRequest, x as VideoDescriptionRequest } from "../../types-C8XeqxqU2.js";
//#region extensions/google/media-understanding-provider.d.ts
declare function transcribeGeminiAudio(params: AudioTranscriptionRequest): Promise<AudioTranscriptionResult>;
declare function describeGeminiVideo(params: VideoDescriptionRequest): Promise<VideoDescriptionResult>;
declare const googleMediaUnderstandingProvider: MediaUnderstandingProvider;
//#endregion
export { describeGeminiVideo, googleMediaUnderstandingProvider, transcribeGeminiAudio };