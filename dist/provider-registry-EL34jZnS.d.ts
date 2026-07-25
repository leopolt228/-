import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { Ro as SpeechModelOverridePolicy, Vo as SpeechProviderId, ni as SpeechProviderPlugin, ts as TtsDirectiveParseResult, zo as SpeechProviderConfig } from "./types-Bi5Leigi.js";
//#region src/tts/tts-provider-helpers.d.ts
/** Resolve the first non-blank API key in provider-defined precedence order. */
declare function resolveSpeechProviderApiKey(...candidates: Array<string | undefined>): string | undefined;
declare function requireInRange(value: number, min: number, max: number, label: string): void;
declare function normalizeLanguageCode(code?: string): string | undefined;
declare function normalizeApplyTextNormalization(mode?: string): "auto" | "on" | "off" | undefined;
declare function normalizeSeed(seed?: number): number | undefined;
declare function scheduleCleanup(tempDir: string, delayMs?: number): void;
//#endregion
//#region src/tts/directives.d.ts
type ParseTtsDirectiveOptions = {
  cfg?: OpenClawConfig;
  providers?: readonly SpeechProviderPlugin[];
  providerConfigs?: Record<string, SpeechProviderConfig>;
  preferredProviderId?: string;
};
/** Streaming cleaner used to strip TTS tags before final text parsing is available. */
/** Parse TTS directives from final message text, leaving markdown code spans unchanged. */
declare function parseTtsDirectives(text: string, policy: SpeechModelOverridePolicy, options?: ParseTtsDirectiveOptions): TtsDirectiveParseResult;
//#endregion
//#region src/tts/provider-registry.d.ts
/** List configured speech providers using manifest/capability discovery. */
declare const listSpeechProviders: (cfg?: OpenClawConfig) => SpeechProviderPlugin[];
/** List currently loaded speech providers from the active runtime registry. */
declare const listLoadedSpeechProviders: (cfg?: OpenClawConfig) => SpeechProviderPlugin[];
/** Resolve a configured speech provider by canonical ID or alias. */
declare const getSpeechProvider: (providerId: string | undefined, cfg?: OpenClawConfig) => SpeechProviderPlugin | undefined;
/** Resolve an input provider ID or alias to the provider's canonical ID. */
declare const canonicalizeSpeechProviderId: (providerId: string | undefined, cfg?: OpenClawConfig) => SpeechProviderId | undefined;
//#endregion
export { parseTtsDirectives as a, normalizeSeed as c, scheduleCleanup as d, listSpeechProviders as i, requireInRange as l, getSpeechProvider as n, normalizeApplyTextNormalization as o, listLoadedSpeechProviders as r, normalizeLanguageCode as s, canonicalizeSpeechProviderId as t, resolveSpeechProviderApiKey as u };