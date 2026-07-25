import { n as RuntimeEnv } from "../runtime-DRcp7-j9.js";
import { _ as createDraftStreamLoop, a as createChannelRunQueue, c as waitUntilAbort, d as clearFinalizableDraftMessage, f as createFinalizableDraftLifecycle, g as DraftStreamLoop, h as takeMessageIdAfterStop, i as createAccountStatusSink, l as createRunStateMachine, m as createFinalizableDraftStreamControlsForState, n as ChannelRunQueueParams, o as keepHttpServerTaskAlive, p as createFinalizableDraftStreamControls, r as ChannelRunQueueTaskContext, s as runPassiveAccountLifecycle, t as ChannelRunQueue, u as FinalizableDraftStreamState, v as LivePreviewFinalizerDraft, y as LivePreviewFinalizerResultKind } from "../channel-lifecycle.core-BmZ7v6oa.js";

//#region src/channels/draft-preview-finalizer.d.ts
/**
 * @deprecated Use `LivePreviewFinalizerDraft` from `openclaw/plugin-sdk/channel-outbound`.
 */
type DraftPreviewFinalizerDraft<TId> = LivePreviewFinalizerDraft<TId>;
/**
 * @deprecated Use `LivePreviewFinalizerResult` from `openclaw/plugin-sdk/channel-outbound`.
 */
type DraftPreviewFinalizerResult = Exclude<LivePreviewFinalizerResultKind, "preview-retained">;
/**
 * @deprecated Use `deliverFinalizableLivePreview` from `openclaw/plugin-sdk/channel-outbound`.
 */
declare function deliverFinalizableDraftPreview<TPayload, TId, TEdit>(params: {
  kind: "tool" | "block" | "final";
  payload: TPayload;
  draft?: DraftPreviewFinalizerDraft<TId>;
  buildFinalEdit: (payload: TPayload) => TEdit | undefined;
  editFinal: (id: TId, edit: TEdit) => Promise<void>;
  deliverNormally: (payload: TPayload) => Promise<boolean | void>;
  onPreviewFinalized?: (id: TId) => Promise<void> | void;
  onNormalDelivered?: () => Promise<void> | void;
  logPreviewEditFailure?: (error: unknown) => void;
}): Promise<DraftPreviewFinalizerResult>;
//#endregion
//#region src/channels/transport/stall-watchdog.d.ts
type StallWatchdogTimeoutMeta = {
  idleMs: number;
  timeoutMs: number;
};
/** Public control surface for a transport stall watchdog instance. */
type ArmableStallWatchdog = {
  arm: (atMs?: number) => void;
  touch: (atMs?: number) => void;
  disarm: () => void;
  stop: () => void;
  isArmed: () => boolean;
};
/** Creates a watchdog that reports once when an armed transport goes idle. */
declare function createArmableStallWatchdog(params: {
  label: string;
  timeoutMs: number;
  checkIntervalMs?: number;
  abortSignal?: AbortSignal;
  runtime?: RuntimeEnv;
  onTimeout: (meta: StallWatchdogTimeoutMeta) => void;
}): ArmableStallWatchdog;
//#endregion
export { type ArmableStallWatchdog, ChannelRunQueue, ChannelRunQueueParams, ChannelRunQueueTaskContext, DraftPreviewFinalizerDraft, DraftPreviewFinalizerResult, DraftStreamLoop, FinalizableDraftStreamState, type StallWatchdogTimeoutMeta, clearFinalizableDraftMessage, createAccountStatusSink, createArmableStallWatchdog, createChannelRunQueue, createDraftStreamLoop, createFinalizableDraftLifecycle, createFinalizableDraftStreamControls, createFinalizableDraftStreamControlsForState, createRunStateMachine, deliverFinalizableDraftPreview, keepHttpServerTaskAlive, runPassiveAccountLifecycle, takeMessageIdAfterStop, waitUntilAbort };