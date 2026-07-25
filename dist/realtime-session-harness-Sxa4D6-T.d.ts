import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { Ai as RealtimeVoiceRole, Ei as RealtimeVoiceProviderConfig, Mi as RealtimeVoiceToolCallEvent, Ni as RealtimeVoiceToolResultOptions, Oo as RuntimeLogger, _i as RealtimeVoiceBargeInOptions, gi as RealtimeVoiceAudioFormat, hi as RealtimeVoiceAudioClearReason, ji as RealtimeVoiceTool, ti as RealtimeVoiceProviderPlugin, vi as RealtimeVoiceBridge, wi as RealtimeVoiceCloseReason, xi as RealtimeVoiceBridgeEvent } from "./types-Bi5Leigi.js";
import { $t as TalkEventInput, Qt as TalkEventContext, Zt as TalkEvent, en as TalkEventSequencer } from "./diagnostic-events-D5MV3iZe.js";

//#region src/talk/talk-session-controller.d.ts
/**
 * Why a turn-scoped Talk operation could not emit an event.
 */
type TalkTurnFailureReason = "no_active_turn" | "stale_turn";
/**
 * Successful turn operation with the emitted Talk event.
 */
type TalkTurnSuccess = {
  event: TalkEvent;
  ok: true;
  turnId: string;
};
/**
 * Failed turn operation when the requested turn does not match controller state.
 */
type TalkTurnFailure = {
  ok: false;
  reason: TalkTurnFailureReason;
};
/**
 * Result for ending or cancelling an active Talk turn.
 */
type TalkTurnResult = TalkTurnSuccess | TalkTurnFailure;
/**
 * Result for operations that ensure a turn exists and may emit a start event.
 */
type TalkEnsureTurnResult = {
  event?: TalkEvent;
  turnId: string;
};
/**
 * Stateful Talk event controller for one session's turns, output audio, and recent event buffer.
 */
type TalkSessionController = {
  readonly activeTurnId: string | undefined;
  readonly context: TalkEventContext;
  readonly outputAudioActive: boolean;
  readonly recentEvents: readonly TalkEvent[];
  clearActiveTurn(): void;
  emit<TPayload>(input: TalkEventInput<TPayload>): TalkEvent<TPayload>;
  ensureTurn(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkEnsureTurnResult;
  startTurn(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkEnsureTurnResult;
  endTurn(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkTurnResult;
  cancelTurn(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkTurnResult;
  finishOutputAudio(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkEvent | undefined;
  startOutputAudio(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkEnsureTurnResult;
};
/**
 * Session context plus controller retention settings.
 */
type TalkSessionControllerParams = TalkEventContext & {
  maxRecentEvents?: number;
  turnIdPrefix?: string;
};
/**
 * Optional controller hooks and sequencer overrides for tests and observers.
 */
type TalkSessionControllerOptions = {
  now?: () => Date | string;
  onEvent?: (event: TalkEvent) => void;
  sequencer?: TalkEventSequencer;
};
/**
 * Creates a per-session Talk controller that emits correlated turn and output-audio events.
 */
declare function createTalkSessionController(params: TalkSessionControllerParams, options?: TalkSessionControllerOptions): TalkSessionController;
/**
 * Normalizes legacy realtime transport names into Talk transport families.
 */
declare function normalizeTalkTransport(value: string | undefined): string | undefined;
//#endregion
//#region src/talk/forced-consult-coordinator.d.ts
/** Timer abstraction used so tests can inject deterministic fake timers. */
type RealtimeVoiceForcedConsultTimer = {
  clear(): void;
};
/** Coordinator tuning and injectable clock/timer/matcher hooks. */
type RealtimeVoiceForcedConsultCoordinatorOptions = {
  limit?: number; /** Window for matching late native consults to forced consult handles. */
  nativeDedupeMs?: number;
  now?: () => number;
  setTimer?: (fn: () => void, ms: number) => RealtimeVoiceForcedConsultTimer;
  questionsMatch?: (left: string | undefined, right: string | undefined) => boolean;
};
/** Stable handle for one forced consult lifecycle. */
type RealtimeVoiceForcedConsultHandle<TContext = unknown> = {
  id: string;
  question: string;
  context?: TContext;
};
/** Classification of a native provider consult relative to forced consult state. */
type RealtimeVoiceForcedConsultNativeMatch<TContext = unknown> = {
  kind: "none";
  question?: string;
} | {
  kind: "pending";
  question?: string;
  handle: RealtimeVoiceForcedConsultHandle<TContext>;
} | {
  kind: "in_flight";
  question?: string;
  handle: RealtimeVoiceForcedConsultHandle<TContext>;
} | {
  kind: "already_delivered";
  question?: string;
  handle: RealtimeVoiceForcedConsultHandle<TContext>;
};
type RealtimeVoiceForcedConsultNativeRecentOptions = {
  /** Treat native calls without readable questions as recent generic consults. */allowUnknownQuestion?: boolean;
};
/** Public state machine for forced/native consult dedupe in a voice session. */
type RealtimeVoiceForcedConsultCoordinator<TContext = unknown> = {
  prepare(question: string, options?: {
    context?: TContext;
    id?: string;
  }): RealtimeVoiceForcedConsultHandle<TContext> | undefined;
  schedule(handle: RealtimeVoiceForcedConsultHandle<TContext>, delayMs: number, run: (handle: RealtimeVoiceForcedConsultHandle<TContext>) => void): void;
  clearPending(): void;
  consumePending(question?: string): RealtimeVoiceForcedConsultHandle<TContext> | undefined;
  cancelPending(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  recordNativeConsult(args: unknown, nativeCallId?: string): RealtimeVoiceForcedConsultNativeMatch<TContext>;
  markStarted(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  markDelivered(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  markCancelled(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  isCancelled(handle: RealtimeVoiceForcedConsultHandle<TContext>): boolean;
  nativeCallIds(handle: RealtimeVoiceForcedConsultHandle<TContext>): readonly string[];
  handles(): readonly RealtimeVoiceForcedConsultHandle<TContext>[];
  rememberQuestion(handle: RealtimeVoiceForcedConsultHandle<TContext>, question: string): void;
  findRecent(question: string): RealtimeVoiceForcedConsultHandle<TContext> | undefined;
  hasRecent(question: string): boolean;
  hasRecentNativeConsult(question: string, options?: RealtimeVoiceForcedConsultNativeRecentOptions): boolean;
  remove(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  clear(): void;
};
/** Create an in-memory forced-consult coordinator for one realtime session. */
declare function createRealtimeVoiceForcedConsultCoordinator<TContext = unknown>(options?: RealtimeVoiceForcedConsultCoordinatorOptions): RealtimeVoiceForcedConsultCoordinator<TContext>;
//#endregion
//#region src/talk/output-activity-tracker.d.ts
/**
 * Realtime voice output activity counters and playback-state tracking.
 *
 * Providers use this to decide whether assistant output is active,
 * interruptible, or overdue relative to the audio duration already emitted.
 */
type RealtimeVoiceOutputActivityTrackerOptions = {
  /** Injectable clock for deterministic tests and playback watchdog math. */now?: () => number;
};
/** One output activity increment from source audio and/or sink audio. */
type RealtimeVoiceOutputActivityDelta = {
  audioMs?: number;
  sourceAudioBytes?: number;
  sinkAudioBytes?: number;
};
/** Current output counters and playback timestamps. */
type RealtimeVoiceOutputActivitySnapshot = {
  audioMs: number;
  chunks: number;
  sourceAudioBytes: number;
  sinkAudioBytes: number;
  playbackStarted: boolean;
  streamEnding: boolean;
  lastAudioAt?: number;
  playbackStartedAt?: number;
};
/** Mutable tracker for one realtime voice output stream. */
type RealtimeVoiceOutputActivityTracker = {
  markStreamOpened(): void;
  markStreamEnding(): void;
  markPlaybackStarted(): void;
  markAudio(delta: RealtimeVoiceOutputActivityDelta): void;
  reset(): void; /** Whether output exists or the downstream sink reports active playback. */
  isActive(sinkActive?: boolean): boolean; /** Whether caller speech should be treated as interrupting current output. */
  isInterruptible(sinkActive?: boolean): boolean;
  elapsedPlaybackMs(): number; /** Delay before watchdog should assume playback has exceeded expected audio duration. */
  playbackWatchdogDelayMs(options: {
    marginMs: number;
    minMs?: number;
  }): number | undefined;
  snapshot(): RealtimeVoiceOutputActivitySnapshot;
};
/** Create a fresh output activity tracker for a realtime voice session. */
declare function createRealtimeVoiceOutputActivityTracker(options?: RealtimeVoiceOutputActivityTrackerOptions): RealtimeVoiceOutputActivityTracker;
//#endregion
//#region src/talk/agent-consult-tool.d.ts
/** Stable provider-facing tool name for realtime voice agent delegation. */
declare const REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME = "openclaw_agent_consult";
/** Closed policy set controlling whether the consult tool is exposed. */
declare const REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES: readonly ["safe-read-only", "owner", "none"];
/** Tool exposure policy for the shared realtime voice consult tool. */
type RealtimeVoiceAgentConsultToolPolicy = (typeof REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES)[number];
/** Normalized tool-call arguments accepted from realtime providers. */
type RealtimeVoiceAgentConsultArgs = {
  question: string;
  context?: string;
  responseStyle?: string;
  confirmationId?: string;
};
/** Compact transcript entry included in delegated agent prompts. */
type RealtimeVoiceAgentConsultTranscriptEntry = {
  role: "user" | "assistant";
  text: string;
};
/** Shared realtime voice function-tool descriptor projected to providers. */
declare const REALTIME_VOICE_AGENT_CONSULT_TOOL: RealtimeVoiceTool;
/** Build the interim spoken instruction while the delegated agent turn runs. */
declare function buildRealtimeVoiceAgentConsultWorkingResponse(audienceLabel?: string): Record<string, unknown>;
/** Type guard for user/config supplied consult tool policies. */
declare function isRealtimeVoiceAgentConsultToolPolicy(value: unknown): value is RealtimeVoiceAgentConsultToolPolicy;
/** Normalize a configured consult tool policy with a caller-owned fallback. */
declare function resolveRealtimeVoiceAgentConsultToolPolicy(value: unknown, fallback: RealtimeVoiceAgentConsultToolPolicy): RealtimeVoiceAgentConsultToolPolicy;
/** Merge the shared consult tool with provider/plugin custom realtime tools. */
declare function resolveRealtimeVoiceAgentConsultTools(policy: RealtimeVoiceAgentConsultToolPolicy, customTools?: RealtimeVoiceTool[]): RealtimeVoiceTool[];
/** Resolve the OpenClaw tool allowlist paired with the consult exposure policy. */
declare function resolveRealtimeVoiceAgentConsultToolsAllow(policy: RealtimeVoiceAgentConsultToolPolicy): string[] | undefined;
/** Build model instructions for when the voice agent should call the consult tool. */
declare function buildRealtimeVoiceAgentConsultPolicyInstructions(config: {
  toolPolicy: RealtimeVoiceAgentConsultToolPolicy;
  consultPolicy?: "auto" | "substantive" | "always";
}): string | undefined;
/** Parse provider-owned consult tool arguments into the normalized contract. */
declare function parseRealtimeVoiceAgentConsultArgs(args: unknown): RealtimeVoiceAgentConsultArgs;
/** Build the plain chat message used by browser/chat forwarding paths. */
declare function buildRealtimeVoiceAgentConsultChatMessage(args: unknown): string;
/** Build the delegated OpenClaw agent prompt for a live voice consult. */
declare function buildRealtimeVoiceAgentConsultPrompt(params: {
  args: unknown;
  transcript: RealtimeVoiceAgentConsultTranscriptEntry[];
  surface: string;
  userLabel: string;
  assistantLabel?: string;
  questionSourceLabel?: string;
}): string;
/** Collect only visible answer text from streamed delegated-agent payloads. */
declare function collectRealtimeVoiceAgentConsultVisibleText(payloads: Array<{
  text?: unknown;
  isError?: boolean;
  isReasoning?: boolean;
  isCommentary?: boolean;
}>): string | null;
//#endregion
//#region src/talk/agent-talkback-runtime.d.ts
/** Text produced by a delegated voice consult. */
type RealtimeVoiceAgentTalkbackResult = {
  text: string;
};
/** Minimal queue API owned by a realtime voice session. */
type RealtimeVoiceAgentTalkbackQueue = {
  close(): void;
  enqueue(question: string, metadata?: unknown): void;
};
/** Runtime dependencies and policy knobs for the talkback queue. */
type RealtimeVoiceAgentTalkbackQueueParams = {
  /** Delay used to merge nearby transcript fragments into one consult. */debounceMs: number;
  isStopped: () => boolean;
  logger: Pick<RuntimeLogger, "info" | "warn">;
  logPrefix: string;
  responseStyle: string;
  fallbackText: string; /** Delegates a batched question to OpenClaw and respects the abort signal. */
  consult: (args: {
    question: string;
    metadata?: unknown;
    responseStyle: string;
    signal: AbortSignal;
  }) => Promise<RealtimeVoiceAgentTalkbackResult>; /** Delivers final speakable text back to the realtime provider/session. */
  deliver: (text: string) => void;
};
/** Create a serial consult queue for realtime transcript talkback. */
declare function createRealtimeVoiceAgentTalkbackQueue(params: RealtimeVoiceAgentTalkbackQueueParams): RealtimeVoiceAgentTalkbackQueue;
//#endregion
//#region src/talk/session-runtime.d.ts
/**
 * Transport-facing audio target used by realtime voice bridge sessions.
 */
type RealtimeVoiceAudioSink = {
  isOpen?: () => boolean;
  sendAudio: (audio: Buffer) => void;
  clearAudio?: (reason?: RealtimeVoiceAudioClearReason) => void;
  sendMark?: (markName: string) => void;
};
/**
 * Controls how provider playback marks are bridged to transports that may or may not ack marks.
 */
type RealtimeVoiceMarkStrategy = "transport" | "ack-immediately" | "ignore";
/**
 * Stable session facade handed to gateway code and provider tool callbacks.
 */
type RealtimeVoiceBridgeSession = {
  bridge: RealtimeVoiceBridge;
  acknowledgeMark(markName?: string): void;
  close(): void;
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  sendUserMessage(text: string): void;
  handleBargeIn(options?: RealtimeVoiceBargeInOptions): void;
  setMediaTimestamp(ts: number): void;
  submitToolResult(callId: string, result: unknown, options?: RealtimeVoiceToolResultOptions): void | Promise<void>;
  triggerGreeting(instructions?: string): void;
};
/**
 * Provider bridge inputs plus transport callbacks for one realtime voice session.
 */
type RealtimeVoiceBridgeSessionParams = {
  provider: RealtimeVoiceProviderPlugin;
  cfg?: OpenClawConfig;
  providerConfig: RealtimeVoiceProviderConfig;
  audioFormat?: RealtimeVoiceAudioFormat;
  audioSink: RealtimeVoiceAudioSink;
  instructions?: string;
  language?: string;
  initialGreetingInstructions?: string;
  autoRespondToAudio?: boolean;
  interruptResponseOnInputAudio?: boolean;
  markStrategy?: RealtimeVoiceMarkStrategy;
  triggerGreetingOnReady?: boolean;
  tools?: RealtimeVoiceTool[];
  onTranscript?: (role: RealtimeVoiceRole, text: string, isFinal: boolean) => void;
  onEvent?: (event: RealtimeVoiceBridgeEvent) => void;
  onToolCall?: (event: RealtimeVoiceToolCallEvent, session: RealtimeVoiceBridgeSession) => void | Promise<void>;
  onReady?: (session: RealtimeVoiceBridgeSession) => void;
  onError?: (error: Error) => void;
  onClose?: (reason: RealtimeVoiceCloseReason) => void;
};
/**
 * Creates a realtime voice bridge session and wires provider events to the configured audio sink.
 */
declare function createRealtimeVoiceBridgeSession(params: RealtimeVoiceBridgeSessionParams): RealtimeVoiceBridgeSession;
//#endregion
//#region src/talk/session-log-runtime.d.ts
/** Ring-buffer entry for transcript text used by Talk health and echo suppression. */
type RealtimeVoiceTranscriptEntry = {
  at: string;
  role: RealtimeVoiceRole;
  text: string;
};
/** Compact health snapshot exposed to diagnostics without dumping full transcript history. */
type RealtimeVoiceTranscriptHealth = {
  realtimeTranscriptLines: number;
  lastRealtimeTranscriptAt?: string;
  lastRealtimeTranscriptRole?: RealtimeVoiceRole;
  lastRealtimeTranscriptText?: string;
  recentRealtimeTranscript: RealtimeVoiceTranscriptEntry[];
};
/** Bridge event plus capture time, kept separate from provider event payload shape. */
type RealtimeVoiceBridgeEventLogEntry = RealtimeVoiceBridgeEvent & {
  at: string;
};
/** Compact health snapshot of recent realtime bridge events. */
type RealtimeVoiceBridgeEventHealth = {
  lastRealtimeEventAt?: string;
  lastRealtimeEventType?: string;
  lastRealtimeEventDetail?: string;
  recentRealtimeEvents: RealtimeVoiceBridgeEventLogEntry[];
};
/** Appends a transcript entry and trims old rows in-place to bound Talk diagnostics memory. */
declare function recordRealtimeVoiceTranscript(transcript: RealtimeVoiceTranscriptEntry[], role: RealtimeVoiceRole, text: string, maxEntries?: number): RealtimeVoiceTranscriptEntry;
/** Summarizes transcript history for health endpoints and UI diagnostics. */
declare function getRealtimeVoiceTranscriptHealth(transcript: RealtimeVoiceTranscriptEntry[]): RealtimeVoiceTranscriptHealth;
/** Records low-volume bridge events while dropping raw audio chunks from diagnostics. */
declare function recordRealtimeVoiceBridgeEvent(events: RealtimeVoiceBridgeEventLogEntry[], event: RealtimeVoiceBridgeEvent, maxEntries?: number): void;
/** Summarizes recent bridge events without exposing the full rolling event buffer. */
declare function getRealtimeVoiceBridgeEventHealth(events: RealtimeVoiceBridgeEventLogEntry[]): RealtimeVoiceBridgeEventHealth;
/** Detects user transcript text that likely came from assistant speaker echo, not speech. */
declare function isLikelyRealtimeVoiceAssistantEchoTranscript(params: {
  transcript: RealtimeVoiceTranscriptEntry[];
  text: string;
  lookbackMs: number;
  nowMs?: number;
}): boolean;
/** Extends input suppression through the estimated playback tail for assistant audio. */
declare function extendRealtimeVoiceOutputEchoSuppression(params: {
  audio: Buffer;
  bytesPerMs: number;
  tailMs: number;
  nowMs: number;
  lastOutputPlayableUntilMs: number;
  suppressInputUntilMs: number;
}): {
  lastOutputPlayableUntilMs: number;
  suppressInputUntilMs: number;
  durationMs: number;
};
//#endregion
//#region src/talk/realtime-session-harness.d.ts
type RealtimeVoiceSessionHarnessTalkPayloads = {
  turnStarted: () => unknown;
  turnEnded: (reason: string) => unknown;
  inputAudioDelta: (audio: Buffer) => unknown;
  outputAudioStarted: () => unknown;
  outputAudioDelta: (audio: Buffer) => unknown;
  outputAudioDone: (reason: string) => unknown;
};
type RealtimeVoiceSessionHarnessEchoSuppression = {
  bytesPerMs: number;
  tailMs: number;
  transcriptLookbackMs: number;
};
type RealtimeVoiceSessionHarnessHealth = ReturnType<typeof getRealtimeVoiceTranscriptHealth> & Partial<ReturnType<typeof getRealtimeVoiceBridgeEventHealth>> & {
  providerConnected: boolean;
  realtimeReady: boolean;
  audioInputActive: boolean;
  audioOutputActive: boolean;
  lastInputAt?: string;
  lastOutputAt?: string;
  lastSuppressedInputAt?: string;
  lastInputBytes: number;
  lastOutputBytes: number;
  suppressedInputBytes: number;
  recentTalkEvents: Array<{
    id: string;
    type: TalkEvent["type"];
    sessionId: string;
    turnId?: string;
    seq: number;
    timestamp: string;
    final?: boolean;
  }>;
};
type RealtimeVoiceSessionHarness<TForcedConsultContext = unknown> = {
  readonly forcedConsults: RealtimeVoiceForcedConsultCoordinator<TForcedConsultContext>;
  readonly outputActivity: RealtimeVoiceOutputActivityTracker;
  readonly talk: TalkSessionController;
  readonly talkback: RealtimeVoiceAgentTalkbackQueue | undefined;
  readonly transcript: RealtimeVoiceTranscriptEntry[];
  close(): void;
  createBridge(params: RealtimeVoiceBridgeSessionParams): RealtimeVoiceBridgeSession;
  emit<TPayload>(input: TalkEventInput<TPayload>): TalkEvent<TPayload>;
  ensureTurn(): string;
  endTurn(reason?: string): void;
  finishOutputAudio(reason: string): void;
  flushOutput(flush: () => void): void;
  getHealth(params: {
    providerConnected: boolean;
    realtimeReady: boolean;
  }): RealtimeVoiceSessionHarnessHealth;
  handleBargeIn(options: RealtimeVoiceBargeInOptions, flushOutput: () => void): void;
  isLikelyAssistantEchoTranscript(text: string): boolean;
  isOutputPlaybackWindowActive(): boolean;
  recordInputAudio(audio: Buffer): boolean;
  recordOutputAudio(audio: Buffer, activity?: RealtimeVoiceOutputActivityDelta): void;
  recordTranscript(role: RealtimeVoiceRole, text: string): RealtimeVoiceTranscriptEntry;
};
declare function createRealtimeVoiceSessionHarness<TForcedConsultContext = unknown>(params: {
  talk: TalkSessionControllerParams;
  talkPayloads: RealtimeVoiceSessionHarnessTalkPayloads;
  onTalkEvent?: (event: TalkEvent) => void;
  talkback?: Omit<RealtimeVoiceAgentTalkbackQueueParams, "isStopped">;
  forcedConsults?: RealtimeVoiceForcedConsultCoordinatorOptions;
  echoSuppression?: RealtimeVoiceSessionHarnessEchoSuppression;
}): RealtimeVoiceSessionHarness<TForcedConsultContext>;
//#endregion
export { TalkSessionControllerParams as $, buildRealtimeVoiceAgentConsultPrompt as A, RealtimeVoiceOutputActivityTracker as B, REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME as C, RealtimeVoiceAgentConsultTranscriptEntry as D, RealtimeVoiceAgentConsultToolPolicy as E, resolveRealtimeVoiceAgentConsultToolPolicy as F, RealtimeVoiceForcedConsultHandle as G, createRealtimeVoiceOutputActivityTracker as H, resolveRealtimeVoiceAgentConsultTools as I, RealtimeVoiceForcedConsultTimer as J, RealtimeVoiceForcedConsultNativeMatch as K, resolveRealtimeVoiceAgentConsultToolsAllow as L, collectRealtimeVoiceAgentConsultVisibleText as M, isRealtimeVoiceAgentConsultToolPolicy as N, buildRealtimeVoiceAgentConsultChatMessage as O, parseRealtimeVoiceAgentConsultArgs as P, TalkSessionControllerOptions as Q, RealtimeVoiceOutputActivityDelta as R, REALTIME_VOICE_AGENT_CONSULT_TOOL as S, RealtimeVoiceAgentConsultArgs as T, RealtimeVoiceForcedConsultCoordinator as U, RealtimeVoiceOutputActivityTrackerOptions as V, RealtimeVoiceForcedConsultCoordinatorOptions as W, TalkEnsureTurnResult as X, createRealtimeVoiceForcedConsultCoordinator as Y, TalkSessionController as Z, createRealtimeVoiceBridgeSession as _, RealtimeVoiceTranscriptEntry as a, normalizeTalkTransport as at, RealtimeVoiceAgentTalkbackResult as b, getRealtimeVoiceBridgeEventHealth as c, recordRealtimeVoiceBridgeEvent as d, TalkTurnFailure as et, recordRealtimeVoiceTranscript as f, RealtimeVoiceMarkStrategy as g, RealtimeVoiceBridgeSessionParams as h, RealtimeVoiceBridgeEventLogEntry as i, createTalkSessionController as it, buildRealtimeVoiceAgentConsultWorkingResponse as j, buildRealtimeVoiceAgentConsultPolicyInstructions as k, getRealtimeVoiceTranscriptHealth as l, RealtimeVoiceBridgeSession as m, createRealtimeVoiceSessionHarness as n, TalkTurnResult as nt, RealtimeVoiceTranscriptHealth as o, RealtimeVoiceAudioSink as p, RealtimeVoiceForcedConsultNativeRecentOptions as q, RealtimeVoiceBridgeEventHealth as r, TalkTurnSuccess as rt, extendRealtimeVoiceOutputEchoSuppression as s, RealtimeVoiceSessionHarness as t, TalkTurnFailureReason as tt, isLikelyRealtimeVoiceAssistantEchoTranscript as u, RealtimeVoiceAgentTalkbackQueue as v, REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES as w, createRealtimeVoiceAgentTalkbackQueue as x, RealtimeVoiceAgentTalkbackQueueParams as y, RealtimeVoiceOutputActivitySnapshot as z };