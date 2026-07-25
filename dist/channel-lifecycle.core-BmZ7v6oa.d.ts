import { r as ChannelAccountSnapshot } from "./types.core-Di2R8WTy.js";
import { S as MessageReceipt, y as LiveMessageState } from "./types-Dx3rJUBE.js";

//#region src/channels/message/live.d.ts
/** Mutable draft preview handle used before a live message is finalized or discarded. */
type LivePreviewFinalizerDraft<TId> = {
  flush: () => Promise<void>;
  id: () => TId | undefined;
  seal?: () => Promise<void>;
  discardPending?: () => Promise<void>;
  clear: () => Promise<void>;
};
/** Outcome kind returned after attempting to finalize or fall back from a live preview. */
type LivePreviewFinalizerResultKind = "normal-delivered" | "normal-skipped" | "preview-finalized" | "preview-retained";
/** Result of a live preview finalization attempt plus the latest live state. */
type LivePreviewFinalizerResult<TPayload> = {
  kind: LivePreviewFinalizerResultKind;
  liveState?: LiveMessageState<TPayload>;
};
/** Adapter contract for channels that can edit a draft preview into the final message. */
type FinalizableLivePreviewAdapter<TPayload, TId, TEdit> = {
  draft?: LivePreviewFinalizerDraft<TId>;
  buildFinalEdit: (payload: TPayload) => TEdit | undefined;
  editFinal: (id: TId, edit: TEdit) => Promise<void>;
  resolveFinalizedId?: (id: TId, edit: TEdit) => TId | undefined;
  createPreviewReceipt?: (id: TId, edit: TEdit) => MessageReceipt;
  onPreviewFinalized?: (id: TId, receipt: MessageReceipt, liveState: LiveMessageState<TPayload>) => Promise<void> | void;
  buildSupplementalPayload?: (payload: TPayload) => TPayload | undefined;
  deliverSupplemental?: (payload: TPayload) => Promise<boolean | void>;
  handlePreviewEditError?: (params: {
    error: unknown;
    id: TId;
    edit: TEdit;
    payload: TPayload;
    liveState: LiveMessageState<TPayload>;
  }) => "fallback" | "retain" | Promise<"fallback" | "retain">;
  logPreviewEditFailure?: (error: unknown) => void;
};
/** Defines a finalizable live-preview adapter while preserving its generic payload/id/edit types. */
declare function defineFinalizableLivePreviewAdapter<TPayload, TId, TEdit>(adapter: FinalizableLivePreviewAdapter<TPayload, TId, TEdit>): FinalizableLivePreviewAdapter<TPayload, TId, TEdit>;
/** Creates a receipt for a draft/preview platform message. */
declare function createPreviewMessageReceipt(params: {
  id: unknown;
  threadId?: string;
  replyToId?: string;
  sentAt?: number;
  raw?: unknown;
}): MessageReceipt;
/** Runs live-preview finalization through an optional adapter, falling back to normal delivery. */
declare function deliverWithFinalizableLivePreviewAdapter<TPayload, TId, TEdit>(params: {
  kind: "tool" | "block" | "final";
  payload: TPayload;
  liveState?: LiveMessageState<TPayload>;
  adapter?: FinalizableLivePreviewAdapter<TPayload, TId, TEdit>;
  deliverNormally: (payload: TPayload) => Promise<boolean | void>;
  onNormalDelivered?: () => Promise<void> | void;
}): Promise<LivePreviewFinalizerResult<TPayload>>;
//#endregion
//#region src/channels/draft-stream-loop.d.ts
/** Throttled draft-stream sender used by channels that edit in-progress replies. */
type DraftStreamLoop = {
  update: (text: string) => void;
  flush: () => Promise<void>;
  stop: () => void;
  resetPending: () => void;
  resetThrottleWindow: () => void;
  waitForInFlight: () => Promise<void>; /** Removes queued (not in-flight) text atomically and cancels its scheduled flush. */
  takePending?: () => string;
};
type CreatedDraftStreamLoop = DraftStreamLoop & {
  takePending: () => string;
};
/** Creates a single-flight draft stream loop that preserves the newest pending text. */
declare function createDraftStreamLoop(params: {
  throttleMs: number;
  isStopped: () => boolean;
  sendOrEditStreamMessage: (text: string) => Promise<void | boolean>;
  onBackgroundFlushError?: (err: unknown) => void;
}): CreatedDraftStreamLoop;
//#endregion
//#region src/channels/draft-stream-controls.d.ts
/**
 * Mutable finalization flags shared by draft stream controls and channel adapters.
 */
type FinalizableDraftStreamState = {
  stopped: boolean;
  final: boolean;
};
type StopAndClearMessageIdParams<T> = {
  stopForClear: () => Promise<void>;
  readMessageId: () => T | undefined;
  clearMessageId: () => void;
};
type ClearFinalizableDraftMessageParams<T> = StopAndClearMessageIdParams<T> & {
  isValidMessageId: (value: unknown) => value is T;
  deleteMessage: (messageId: T) => Promise<void>;
  onDeleteFailure?: (messageId: T) => void;
  onDeleteSuccess?: (messageId: T) => void;
  warn?: (message: string) => void;
  warnPrefix: string;
};
type FinalizableDraftLifecycleParams<T> = Omit<ClearFinalizableDraftMessageParams<T>, "onDeleteFailure" | "stopForClear"> & {
  throttleMs: number;
  state: FinalizableDraftStreamState;
  sendOrEditStreamMessage: (text: string) => Promise<boolean>;
};
/**
 * Creates controls for streaming preview messages that can be finalized, sealed, or cleared.
 */
declare function createFinalizableDraftStreamControls(params: {
  throttleMs: number;
  isStopped: () => boolean;
  isFinal: () => boolean;
  markStopped: () => void;
  markFinal: () => void;
  sendOrEditStreamMessage: (text: string) => Promise<boolean>;
}): {
  loop: DraftStreamLoop & {
    takePending: () => string;
  };
  update: (text: string) => void;
  stop: () => Promise<void>;
  seal: () => Promise<void>;
  discardPending: () => Promise<void>;
  stopForClear: () => Promise<void>;
};
/**
 * Creates finalizable draft controls backed by a shared mutable state object.
 */
declare function createFinalizableDraftStreamControlsForState(params: {
  throttleMs: number;
  state: FinalizableDraftStreamState;
  sendOrEditStreamMessage: (text: string) => Promise<boolean>;
}): {
  loop: DraftStreamLoop & {
    takePending: () => string;
  };
  update: (text: string) => void;
  stop: () => Promise<void>;
  seal: () => Promise<void>;
  discardPending: () => Promise<void>;
  stopForClear: () => Promise<void>;
};
/**
 * Stops a draft stream, reads the current preview message id, then clears the stored id.
 */
declare function takeMessageIdAfterStop<T>(params: StopAndClearMessageIdParams<T>): Promise<T | undefined>;
/**
 * Stops a draft stream and deletes its preview message when the stored id is valid.
 * Claims the current id before deletion; stateful callers can retain failures through
 * onDeleteFailure without making overlapping clears delete the same message twice.
 */
declare function clearFinalizableDraftMessage<T>(params: ClearFinalizableDraftMessageParams<T>): Promise<void>;
/**
 * Builds the standard draft lifecycle used by channel streaming preview implementations.
 */
declare function createFinalizableDraftLifecycle<T>(params: FinalizableDraftLifecycleParams<T>): {
  clear: () => Promise<void>;
  clearWithStop: (stopForClear: () => Promise<void>) => Promise<void>;
  loop: DraftStreamLoop & {
    takePending: () => string;
  };
  update: (text: string) => void;
  stop: () => Promise<void>;
  seal: () => Promise<void>;
  discardPending: () => Promise<void>;
  stopForClear: () => Promise<void>;
};
//#endregion
//#region src/channels/run-state-machine.d.ts
type RunStateStatusPatch = {
  busy?: boolean;
  activeRuns?: number;
  lastRunActivityAt?: number | null;
  activeRunStartedAt?: number | null;
};
/** Status sink used by channel run-state updates. */
type RunStateStatusSink = (patch: RunStateStatusPatch) => void;
type RunStateMachineParams = {
  setStatus?: RunStateStatusSink;
  abortSignal?: AbortSignal;
  heartbeatMs?: number;
  now?: () => number;
};
/** Creates a channel run-state tracker with heartbeat updates while runs are active. */
declare function createRunStateMachine(params: RunStateMachineParams): {
  isActive(): boolean;
  onRunStart(): void;
  onRunEnd(): void;
  deactivate: () => void;
};
//#endregion
//#region src/plugin-sdk/channel-lifecycle.core.d.ts
type CloseAwareServer = {
  once: (event: "close", listener: () => void) => unknown;
};
type PassiveAccountLifecycleParams<Handle> = {
  abortSignal?: AbortSignal;
  start: () => Promise<Handle>;
  stop?: (handle: Handle) => void | Promise<void>;
  onStop?: () => void | Promise<void>;
};
/** Runtime context passed to queued channel work. */
type ChannelRunQueueTaskContext = {
  /** Signal tied to the channel/account lifecycle that owns the queued work. */lifecycleSignal?: AbortSignal;
};
/** Per-key async queue used by channel plugins to serialize account or thread work. */
type ChannelRunQueue = {
  /** Enqueue work under a serialization key such as account id, thread id, or chat id. */enqueue: (key: string, task: (context: ChannelRunQueueTaskContext) => Promise<void>) => void; /** Stop accepting meaningful work and mark the lifecycle as inactive. */
  deactivate: () => void;
};
/** Hooks used to wire channel queue state into runtime status and error reporting. */
type ChannelRunQueueParams = {
  /** Receives busy/idle lifecycle snapshots from the shared run-state machine. */setStatus?: RunStateStatusSink; /** Lifecycle signal propagated to queued tasks. */
  abortSignal?: AbortSignal; /** Best-effort sink for task failures after enqueueing. */
  onError?: (error: unknown) => void;
};
/** Bind a fixed account id into a status writer so lifecycle code can emit partial snapshots. */
declare function createAccountStatusSink(params: {
  accountId: string;
  setStatus: (next: ChannelAccountSnapshot) => void;
}): (patch: Omit<ChannelAccountSnapshot, "accountId">) => void;
/**
 * Serialize channel work per key while keeping lifecycle/busy accounting out of
 * channel-specific message handlers. The queue does not impose run timeouts;
 * callers should rely on session/tool/runtime lifecycle for long-running work.
 */
declare function createChannelRunQueue(params: ChannelRunQueueParams): ChannelRunQueue;
/**
 * Return a promise that resolves when the signal is aborted.
 *
 * If no signal is provided, the promise stays pending forever. When provided,
 * `onAbort` runs once before the promise resolves.
 */
declare function waitUntilAbort(signal?: AbortSignal, onAbort?: () => void | Promise<void>): Promise<void>;
/**
 * Keep a passive account task alive until abort, then run optional cleanup.
 */
declare function runPassiveAccountLifecycle<Handle>(params: PassiveAccountLifecycleParams<Handle>): Promise<void>;
/**
 * Keep a channel/provider task pending until the HTTP server closes.
 *
 * When an abort signal is provided, `onAbort` is invoked once and should
 * trigger server shutdown. The returned promise resolves only after `close`.
 */
declare function keepHttpServerTaskAlive(params: {
  server: CloseAwareServer;
  abortSignal?: AbortSignal;
  onAbort?: () => void | Promise<void>;
}): Promise<void>;
//#endregion
export { deliverWithFinalizableLivePreviewAdapter as S, createDraftStreamLoop as _, createChannelRunQueue as a, createPreviewMessageReceipt as b, waitUntilAbort as c, clearFinalizableDraftMessage as d, createFinalizableDraftLifecycle as f, DraftStreamLoop as g, takeMessageIdAfterStop as h, createAccountStatusSink as i, createRunStateMachine as l, createFinalizableDraftStreamControlsForState as m, ChannelRunQueueParams as n, keepHttpServerTaskAlive as o, createFinalizableDraftStreamControls as p, ChannelRunQueueTaskContext as r, runPassiveAccountLifecycle as s, ChannelRunQueue as t, FinalizableDraftStreamState as u, LivePreviewFinalizerDraft as v, defineFinalizableLivePreviewAdapter as x, LivePreviewFinalizerResultKind as y };