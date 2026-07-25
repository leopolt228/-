import { $o as SpeechVoiceOption } from "../../types-Bi5Leigi.js";
import { t as XAI_BASE_URL } from "../../model-definitions-CmcYSAXM.js";
//#region extensions/xai/tts.d.ts
declare const XAI_TTS_FALLBACK_VOICES: readonly ["ara", "eve", "leo", "rex", "sal"];
declare function normalizeXaiTtsBaseUrl(baseUrl?: string): string;
declare function isValidXaiTtsVoice(voice: string): boolean;
declare function listXaiTtsVoices(params: {
  apiKey: string;
  baseUrl?: string;
}): Promise<SpeechVoiceOption[]>;
declare function normalizeXaiLanguageCode(value: unknown): string | undefined;
type XaiTtsResponseFormat = "mp3" | "wav" | "pcm" | "mulaw" | "alaw";
declare function xaiTTSStream(params: {
  text: string;
  apiKey: string;
  baseUrl: string;
  voiceId: string;
  language?: string;
  speed?: number;
  responseFormat?: XaiTtsResponseFormat;
  timeoutMs: number;
  maxBytes?: number;
}): Promise<{
  audioStream: ReadableStream<Uint8Array>;
  release: () => Promise<void>;
}>;
declare function xaiTTS(params: {
  text: string;
  apiKey: string;
  baseUrl: string;
  voiceId: string;
  language?: string;
  speed?: number;
  responseFormat?: "mp3" | "wav" | "pcm" | "mulaw" | "alaw";
  timeoutMs: number;
  maxBytes?: number;
}): Promise<Buffer>;
//#endregion
export { XAI_BASE_URL, XAI_TTS_FALLBACK_VOICES, isValidXaiTtsVoice, listXaiTtsVoices, normalizeXaiLanguageCode, normalizeXaiTtsBaseUrl, xaiTTS, xaiTTSStream };