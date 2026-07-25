import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { Do as PluginRuntimeCore, Ei as RealtimeVoiceProviderConfig, Fs as RunEmbeddedAgentParams, Oi as RealtimeVoiceProviderId, Oo as RuntimeLogger, ji as RealtimeVoiceTool, ti as RealtimeVoiceProviderPlugin } from "./types-Bi5Leigi.js";
import { Zt as TalkEvent, r as DiagnosticEventInput } from "./diagnostic-events-D5MV3iZe.js";
import { n as EmbeddedAgentQueueMessageOutcome } from "./runs-DIsUJ1lT.js";
import { D as RealtimeVoiceAgentConsultTranscriptEntry } from "./realtime-session-harness-Sxa4D6-T.js";

//#region src/talk/diagnostics.d.ts
type TalkDiagnosticEventInput = Extract<DiagnosticEventInput, {
  type: "talk.event";
}>;
/** Convert a Talk event into the bounded diagnostic payload shape. */
declare function createTalkDiagnosticEvent(event: TalkEvent): TalkDiagnosticEventInput;
/** Emit a trusted internal diagnostic event for one Talk event. */
declare function recordTalkDiagnosticEvent(event: TalkEvent): void;
//#endregion
//#region src/talk/logging.d.ts
/**
 * Log severity produced from Talk event envelopes.
 */
type TalkLogLevel = "info" | "warn";
/**
 * Compact structured log record for a non-noisy Talk event.
 */
type TalkLogRecord = {
  level: TalkLogLevel;
  message: string;
  attributes: Record<string, string | number | boolean>;
};
/**
 * Converts high-level Talk events into compact structured log records, skipping noisy deltas.
 */
declare function createTalkLogRecord(event: TalkEvent): TalkLogRecord | undefined;
/**
 * Emits Talk logs best-effort so logging failures never break realtime audio handling.
 */
declare function recordTalkLogEvent(event: TalkEvent): void;
//#endregion
//#region src/talk/observability.d.ts
/** Record one Talk event through diagnostics and logging projections. */
declare function recordTalkObservabilityEvent(event: TalkEvent): void;
//#endregion
//#region src/talk/activation-name.d.ts
declare const REALTIME_VOICE_ACTIVATION_NAME_MAX_WORDS = 2;
/** Transcript edge where an activation name was heard. */
type RealtimeVoiceActivationNameEdge = "leading" | "trailing";
/** Whether the heard name matched exactly or through the guarded fuzzy path. */
type RealtimeVoiceActivationNameMatchKind = "exact" | "fuzzy";
/** Activation-name match result plus transcript text with the name removed. */
type RealtimeVoiceActivationNameTranscriptResult = {
  allowed: true;
  text: string;
  activationName: string;
  heardName: string;
  match: RealtimeVoiceActivationNameMatchKind;
  edge: RealtimeVoiceActivationNameEdge;
} | {
  allowed: false;
  text: string;
};
/** Count alphanumeric words in a configured activation name. */
declare function realtimeVoiceActivationNameWordCount(value: string): number;
/** Normalize configured activation names while preserving word boundaries. */
declare function normalizeRealtimeVoiceActivationName(value: string): string | undefined;
/** Extract the supported leading activation-name prefix from a longer phrase. */
declare function normalizeRealtimeVoiceActivationNamePrefix(value: string, maxWords?: number): string | undefined;
/** Validate the configured activation name length bound. */
declare function isSupportedRealtimeVoiceActivationName(value: string, maxWords?: number): boolean;
/** Normalize and reject unsupported activation names in one reusable step. */
declare function normalizeSupportedRealtimeVoiceActivationName(value: string | undefined, maxWords?: number): string | undefined;
/** Prefer longer names first so nested names match the most specific option. */
declare function sortRealtimeVoiceActivationNames(names: string[]): string[];
/** Match and strip a configured activation name from either transcript edge. */
declare function matchRealtimeVoiceActivationName(text: string, activationNames: string[], maxWords?: number): Extract<RealtimeVoiceActivationNameTranscriptResult, {
  allowed: true;
}> | undefined;
//#endregion
//#region src/talk/consult-transcript.d.ts
/** Reason a transcript should be ignored before creating a consult request. */
type SkippableRealtimeVoiceConsultTranscriptReason = "empty" | "incomplete-transcript" | "trailing-fragment" | "non-actionable-closing";
/** Classify transcript text that is empty, incomplete, fragmented, or non-actionable. */
declare function classifySkippableRealtimeVoiceConsultTranscript(text: string): SkippableRealtimeVoiceConsultTranscriptReason | undefined;
//#endregion
//#region src/talk/consult-question.d.ts
type RealtimeVoiceConsultQuestionMatchOptions = {
  /** Minimum overlap ratio against the smaller token set for fuzzy matches. */minTokenOverlapRatio?: number; /** Minimum number of non-stopword tokens that must overlap. */
  minTokenOverlapCount?: number;
};
type RealtimeVoiceSpeakableToolResultOptions = {
  /** Candidate result keys to read from object-shaped tool output. */keys?: readonly string[]; /** Maximum spoken result length before appending a truncation marker. */
  maxChars?: number; /** Whether a raw string result is allowed as speakable output. */
  stringResult?: boolean;
};
/** Read the consult question from a raw string or selected object keys. */
declare function readRealtimeVoiceConsultQuestion(args: unknown, keys?: readonly string[]): string | undefined;
/** Normalize consult questions for stable matching across punctuation/casing. */
declare function normalizeRealtimeVoiceConsultQuestion(value: string | undefined): string | undefined;
/** Compare two consult questions with exact, containment, and token-overlap matching. */
declare function matchRealtimeVoiceConsultQuestions(left: string | undefined, right: string | undefined, options?: RealtimeVoiceConsultQuestionMatchOptions): boolean;
/** Extract a bounded speakable string from a tool result payload. */
declare function readSpeakableRealtimeVoiceToolResult(result: unknown, options?: RealtimeVoiceSpeakableToolResultOptions): string | undefined;
//#endregion
//#region src/talk/turn-context-tracker.d.ts
/**
 * Retention and clock controls for realtime voice turn context tracking.
 */
type RealtimeVoiceTurnContextTrackerOptions = {
  limit?: number;
  ignoredContextTtlMs?: number;
  now?: () => number;
  deferUntilAudio?: boolean;
};
/**
 * Mutable handle for a single realtime voice turn and caller-owned per-turn metadata.
 */
type RealtimeVoiceTurnContextHandle<TContext, TExtra extends object = Record<never, never>> = TExtra & {
  id: string;
  context: TContext;
  hasAudio: boolean;
  closed: boolean;
  startedAt: number;
  lastAudioAt?: number;
};
type RealtimeVoiceTurnContextOpenArgs<TExtra extends object> = keyof TExtra extends never ? [extra?: TExtra] : [extra: TExtra];
/**
 * Tracks which realtime voice turn context should be attached to the next audio-bearing response.
 */
type RealtimeVoiceTurnContextTracker<TContext, TExtra extends object = Record<never, never>> = {
  open(context: TContext, ...extra: RealtimeVoiceTurnContextOpenArgs<TExtra>): RealtimeVoiceTurnContextHandle<TContext, TExtra>;
  markAudio(handle: RealtimeVoiceTurnContextHandle<TContext, TExtra>): void;
  close(handle: RealtimeVoiceTurnContextHandle<TContext, TExtra>): void;
  consumeAudioContext(): TContext | undefined;
  peekAudioTurn(): RealtimeVoiceTurnContextHandle<TContext, TExtra> | undefined;
  hasAudioContext(): boolean;
  rememberIgnoredContext(context: TContext | undefined): void;
  consumeIgnoredContext(): TContext | undefined;
  size(): number;
  clear(): void;
};
declare function createRealtimeVoiceTurnContextTracker<TContext, TExtra extends object = Record<never, never>>(options?: RealtimeVoiceTurnContextTrackerOptions): RealtimeVoiceTurnContextTracker<TContext, TExtra>;
//#endregion
//#region src/talk/agent-consult-runtime.d.ts
/**
 * Agent runtime surface used by realtime voice consults.
 */
type RealtimeVoiceAgentConsultRuntime = PluginRuntimeCore["agent"];
/**
 * Speakable text returned to the realtime voice bridge after an agent consult.
 */
type RealtimeVoiceAgentConsultResult = {
  text: string;
};
/**
 * Controls whether voice consults run in a fresh session or fork context from the requester.
 */
type RealtimeVoiceAgentConsultContextMode = "isolated" | "fork";
/**
 * Fails closed when a realtime consult would cross a model-selection lock.
 */
declare function assertRealtimeVoiceAgentConsultModelSelectionUnlocked(params: {
  cfg: OpenClawConfig;
  agentRuntime: RealtimeVoiceAgentConsultRuntime;
  agentId: string;
  sessionKey: string;
  spawnedBy?: string | null;
  storePath?: string;
}): void;
/**
 * Runs an embedded agent consult and returns concise speakable text for realtime voice playback.
 */
declare function consultRealtimeVoiceAgent(params: {
  cfg: OpenClawConfig;
  agentRuntime: RealtimeVoiceAgentConsultRuntime;
  logger: Pick<RuntimeLogger, "warn">;
  sessionKey: string;
  messageProvider: string;
  lane: string;
  runIdPrefix: string;
  args: unknown;
  transcript: RealtimeVoiceAgentConsultTranscriptEntry[];
  surface: string;
  userLabel: string;
  assistantLabel?: string;
  questionSourceLabel?: string;
  agentId?: string;
  spawnedBy?: string | null;
  contextMode?: RealtimeVoiceAgentConsultContextMode;
  provider?: RunEmbeddedAgentParams["provider"];
  model?: RunEmbeddedAgentParams["model"];
  thinkLevel?: RunEmbeddedAgentParams["thinkLevel"];
  fastMode?: RunEmbeddedAgentParams["fastMode"];
  timeoutMs?: number;
  toolsAllow?: string[];
  extraSystemPrompt?: string;
  fallbackText?: string;
}): Promise<RealtimeVoiceAgentConsultResult>;
//#endregion
//#region src/talk/agent-run-control-shared.d.ts
/** Provider-facing control modes for status, steering, cancellation, and follow-up work. */
declare const REALTIME_VOICE_AGENT_CONTROL_MODES: readonly ["status", "steer", "cancel", "followup"];
/** Closed set of realtime voice agent-control modes. */
type RealtimeVoiceAgentControlMode = (typeof REALTIME_VOICE_AGENT_CONTROL_MODES)[number];
/** Provider return shape for control calls that cancel active work immediately. */
type RealtimeVoiceAgentControlProviderResult = {
  status: "cancelled";
  message: string;
};
/** Stable provider-facing tool name for active-run voice control. */
declare const REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME = "openclaw_agent_control";
/** Realtime function-tool descriptor projected to voice providers. */
declare const REALTIME_VOICE_AGENT_CONTROL_TOOL: RealtimeVoiceTool;
/** Classified control intent plus whether automatic tool routing is safe. */
type RealtimeVoiceAgentControlIntent = {
  mode: RealtimeVoiceAgentControlMode;
  confidence: "high" | "medium" | "low";
  reason: "explicit_mode" | "cancel_safety" | "status_query" | "followup_marker" | "steer_command" | "safe_default";
  shouldAutoControl: boolean;
};
/** Snapshot of active work used when recent Talk events cannot describe status. */
type RealtimeVoiceAgentRunActivity = {
  activeWorkKind?: "tool_call" | "model_call" | "embedded_run";
  hasActiveEmbeddedRun?: boolean;
  activeToolName?: string;
  activeToolCallId?: string;
  activeToolAgeMs?: number;
  lastProgressAgeMs?: number;
  lastProgressReason?: string;
};
/** Result returned after applying or reporting a voice control request. */
type RealtimeVoiceAgentControlResult = {
  ok: boolean;
  mode: RealtimeVoiceAgentControlMode;
  sessionKey: string;
  sessionId?: string;
  active: boolean;
  queued?: boolean;
  aborted?: boolean;
  target?: "embedded_run" | "reply_run";
  reason?: string;
  message: string;
  speak: boolean;
  show: boolean;
  suppress: boolean;
  providerResult?: RealtimeVoiceAgentControlProviderResult;
  enqueuedAtMs?: number;
  deliveredAtMs?: number;
};
/** Normalize user/config/provider supplied control modes. */
declare function normalizeRealtimeVoiceAgentControlMode(value: unknown): RealtimeVoiceAgentControlMode | undefined;
/** Classify raw spoken control text with conservative auto-control gating. */
declare function resolveRealtimeVoiceAgentControlIntent(params: {
  text: string;
  mode?: unknown;
}): RealtimeVoiceAgentControlIntent;
/** Return the best control mode for a spoken utterance, even if auto-routing is unsafe. */
declare function classifyRealtimeVoiceAgentControlText(text: string): RealtimeVoiceAgentControlMode;
/** Whether a spoken utterance is safe to route automatically to the control tool. */
declare function shouldAutoControlRealtimeVoiceAgentText(text: string): boolean;
/** Parse provider-owned control tool args from JSON strings or object payloads. */
declare function parseRealtimeVoiceAgentControlToolArgs(args: unknown): {
  text: string;
  mode: RealtimeVoiceAgentControlMode;
};
/** Build the system-style instruction that forces exact spoken status output. */
declare function buildRealtimeVoiceAgentControlSpeechMessage(text: string): string;
/** Provider result payload used when the control tool cancels active work. */
declare function buildRealtimeVoiceAgentCancelProviderResult(message?: string): RealtimeVoiceAgentControlProviderResult;
//#endregion
//#region src/talk/agent-run-control.d.ts
type RealtimeVoiceAgentControlDeps = {
  abortEmbeddedAgentRun: (sessionId: string) => boolean;
  queueEmbeddedAgentMessageWithOutcomeAsync: (sessionId: string, text: string, options?: {
    steeringMode?: "all";
    debounceMs?: number;
    taskSuggestionDeliveryMode?: undefined;
  }) => Promise<EmbeddedAgentQueueMessageOutcome>;
  getDiagnosticSessionActivitySnapshot: (params: {
    sessionId?: string;
    sessionKey?: string;
  }) => RealtimeVoiceAgentRunActivity;
  resolveActiveEmbeddedRunSessionId: (sessionKey: string) => string | undefined;
};
/** Apply a spoken status, cancel, steer, or follow-up request to an active run. */
declare function controlRealtimeVoiceAgentRun(params: {
  sessionKey: string;
  text: string;
  mode?: unknown;
  recentEvents?: readonly TalkEvent[];
}, deps?: RealtimeVoiceAgentControlDeps): Promise<RealtimeVoiceAgentControlResult>;
//#endregion
//#region src/talk/fast-context-runtime.d.ts
type Logger = {
  debug?: (message: string) => void;
};
/** Fast-context lookup policy for realtime voice consult shortcuts. */
type RealtimeVoiceFastContextConfig = {
  enabled: boolean; /** Maximum memory/session hits to include in the spoken-context prompt. */
  maxResults: number; /** Search backends allowed for the quick lookup. */
  sources: Array<"memory" | "sessions">; /** Deadline before the quick lookup gives up. */
  timeoutMs: number; /** Whether miss/unavailable/timeout should fall back to a full consult. */
  fallbackToConsult: boolean;
};
/** Human labels used in generated fast-context responses. */
type RealtimeVoiceFastContextLabels = {
  audienceLabel: string;
  contextName: string;
};
type RealtimeVoiceFastContextConsultResult = {
  handled: false;
} | {
  handled: true;
  result: RealtimeVoiceAgentConsultResult;
};
/** Try to answer a realtime consult from fast memory/session context. */
declare function resolveRealtimeVoiceFastContextConsult(params: {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey: string;
  config: RealtimeVoiceFastContextConfig;
  args: unknown;
  logger: Logger;
  labels?: Partial<RealtimeVoiceFastContextLabels>;
}): Promise<RealtimeVoiceFastContextConsultResult>;
//#endregion
//#region src/talk/provider-registry.d.ts
/**
 * Normalizes realtime voice provider ids so direct ids and aliases compare through one registry key.
 */
declare function normalizeRealtimeVoiceProviderId(providerId: string | undefined): RealtimeVoiceProviderId | undefined;
/**
 * Lists canonical realtime voice provider plugins in registry order.
 */
declare function listRealtimeVoiceProviders(cfg?: OpenClawConfig): RealtimeVoiceProviderPlugin[];
/**
 * Resolves a realtime voice provider by canonical id or declared alias.
 */
declare function getRealtimeVoiceProvider(providerId: string | undefined, cfg?: OpenClawConfig): RealtimeVoiceProviderPlugin | undefined;
/**
 * Converts a realtime voice provider id or alias into the canonical provider id when known.
 */
declare function canonicalizeRealtimeVoiceProviderId(providerId: string | undefined, cfg?: OpenClawConfig): RealtimeVoiceProviderId | undefined;
//#endregion
//#region src/talk/provider-resolver.d.ts
/** Resolved realtime voice provider plus provider-normalized config. */
type ResolvedRealtimeVoiceProvider = {
  provider: RealtimeVoiceProviderPlugin;
  providerConfig: RealtimeVoiceProviderConfig;
};
/** Inputs for resolving a configured or auto-selected realtime voice provider. */
type ResolveConfiguredRealtimeVoiceProviderParams = {
  configuredProviderId?: string;
  providerConfigs?: Record<string, Record<string, unknown> | undefined>; /** Last-mile overrides from a session/client request. */
  providerConfigOverrides?: Record<string, unknown>;
  cfg?: OpenClawConfig; /** Alternate config object used by generic provider selection internals. */
  cfgForResolve?: OpenClawConfig; /** Test/runtime override for the provider list. */
  providers?: RealtimeVoiceProviderPlugin[]; /** Model injected before provider-specific resolveConfig runs. */
  defaultModel?: string;
  noRegisteredProviderMessage?: string;
};
/** Resolve the configured realtime voice provider or auto-select the first configured one. */
declare function resolveConfiguredRealtimeVoiceProvider(params: ResolveConfiguredRealtimeVoiceProviderParams): ResolvedRealtimeVoiceProvider;
//#endregion
//#region src/talk/audio-energy.d.ts
type AudioEnergyStats = {
  peak: number;
  rms: number;
};
/** Read RMS and absolute peak from complete little-endian signed PCM16 samples. */
declare function readPcm16AudioStats(audio: Buffer): AudioEnergyStats;
/** Calculate normalized RMS from G.711 mu-law bytes. */
declare function calculateMulawRms(muLaw: Buffer): number;
/** Build an OR-threshold gate with optional sustained onset, silence hold, and cooldown. */
declare function createSpeechThresholdGate(options: {
  cooldownMs?: number;
  peakThreshold?: number;
  rmsThreshold?: number;
  silenceFrames?: number;
  speechFrames?: number;
}): {
  accept(stats: AudioEnergyStats, acceptOptions?: {
    nowMs?: number;
    onTrigger?: () => boolean;
  }): boolean;
};
//#endregion
//#region src/talk/audio-codec.d.ts
/** Resample little-endian signed 16-bit PCM to another integer sample rate. */
declare function resamplePcm(input: Buffer, inputSampleRate: number, outputSampleRate: number): Buffer;
/** Resample little-endian signed 16-bit PCM to the telephony 8 kHz rate. */
declare function resamplePcmTo8k(input: Buffer, inputSampleRate: number): Buffer;
/** Convert little-endian signed 16-bit PCM samples to G.711 mu-law bytes. */
declare function pcmToMulaw(pcm: Buffer): Buffer;
/** Expand G.711 mu-law bytes into little-endian signed 16-bit PCM samples. */
declare function mulawToPcm(mulaw: Buffer): Buffer;
/** Resample signed 16-bit PCM to 8 kHz and encode it as G.711 mu-law. */
declare function convertPcmToMulaw8k(pcm: Buffer, inputSampleRate: number): Buffer;
//#endregion
export { RealtimeVoiceActivationNameEdge as $, buildRealtimeVoiceAgentControlSpeechMessage as A, RealtimeVoiceTurnContextHandle as B, REALTIME_VOICE_AGENT_CONTROL_TOOL as C, RealtimeVoiceAgentControlProviderResult as D, RealtimeVoiceAgentControlMode as E, shouldAutoControlRealtimeVoiceAgentText as F, RealtimeVoiceSpeakableToolResultOptions as G, RealtimeVoiceTurnContextTrackerOptions as H, RealtimeVoiceAgentConsultResult as I, readRealtimeVoiceConsultQuestion as J, matchRealtimeVoiceConsultQuestions as K, RealtimeVoiceAgentConsultRuntime as L, normalizeRealtimeVoiceAgentControlMode as M, parseRealtimeVoiceAgentControlToolArgs as N, RealtimeVoiceAgentControlResult as O, resolveRealtimeVoiceAgentControlIntent as P, REALTIME_VOICE_ACTIVATION_NAME_MAX_WORDS as Q, assertRealtimeVoiceAgentConsultModelSelectionUnlocked as R, REALTIME_VOICE_AGENT_CONTROL_MODES as S, RealtimeVoiceAgentControlIntent as T, createRealtimeVoiceTurnContextTracker as U, RealtimeVoiceTurnContextTracker as V, RealtimeVoiceConsultQuestionMatchOptions as W, SkippableRealtimeVoiceConsultTranscriptReason as X, readSpeakableRealtimeVoiceToolResult as Y, classifySkippableRealtimeVoiceConsultTranscript as Z, RealtimeVoiceFastContextConfig as _, resamplePcmTo8k as a, normalizeRealtimeVoiceActivationNamePrefix as at, resolveRealtimeVoiceFastContextConsult as b, createSpeechThresholdGate as c, sortRealtimeVoiceActivationNames as ct, ResolvedRealtimeVoiceProvider as d, recordTalkLogEvent as dt, RealtimeVoiceActivationNameMatchKind as et, resolveConfiguredRealtimeVoiceProvider as f, createTalkDiagnosticEvent as ft, normalizeRealtimeVoiceProviderId as g, listRealtimeVoiceProviders as h, resamplePcm as i, normalizeRealtimeVoiceActivationName as it, classifyRealtimeVoiceAgentControlText as j, buildRealtimeVoiceAgentCancelProviderResult as k, readPcm16AudioStats as l, recordTalkObservabilityEvent as lt, getRealtimeVoiceProvider as m, mulawToPcm as n, isSupportedRealtimeVoiceActivationName as nt, AudioEnergyStats as o, normalizeSupportedRealtimeVoiceActivationName as ot, canonicalizeRealtimeVoiceProviderId as p, recordTalkDiagnosticEvent as pt, normalizeRealtimeVoiceConsultQuestion as q, pcmToMulaw as r, matchRealtimeVoiceActivationName as rt, calculateMulawRms as s, realtimeVoiceActivationNameWordCount as st, convertPcmToMulaw8k as t, RealtimeVoiceActivationNameTranscriptResult as tt, ResolveConfiguredRealtimeVoiceProviderParams as u, createTalkLogRecord as ut, RealtimeVoiceFastContextConsultResult as v, REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME as w, controlRealtimeVoiceAgentRun as x, RealtimeVoiceFastContextLabels as y, consultRealtimeVoiceAgent as z };