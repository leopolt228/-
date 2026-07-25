import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { E as ReplyToMode, z as StreamingMode } from "./types.base-DucQBSmL.js";
import { _s as ChannelIngressQueuePruneOptions, ms as ChannelIngressQueueClaim, ps as ChannelIngressQueue, qn as kernel_d_exports, ss as CreateChannelIngressDrainOptions, vs as ChannelIngressQueueRecord } from "./types-Bi5Leigi.js";
import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
import { W as StreamingCompatEntry, i as ChannelProgressDraftLine, t as AgentPlanStep } from "./streaming-B2sDmRwE.js";
import { S as MessageReceipt, T as MessageReceiptSourceResult, _ as DurableFinalDeliveryRequirementMap, a as ChannelMessageLiveCapability, b as LivePreviewFinalizerCapability, c as ChannelMessageSendMediaContext, f as ChannelMessageSendTextContext, g as DurableFinalDeliveryCapability, h as DeriveDurableFinalDeliveryRequirementsParams, i as ChannelMessageLiveAdapterShape, l as ChannelMessageSendPayloadContext, n as ChannelMessageAdapterShape, o as ChannelMessageReceiveAckPolicy, s as ChannelMessageReceiveAdapterShape, t as ChannelMessageAdapter, u as ChannelMessageSendPollContext, w as MessageReceiptPartKind } from "./types-Dx3rJUBE.js";
import { n as DurableMessageSendContext, r as DurableMessageSendContextParams, t as DurableMessageBatchSendResult } from "./runtime-BD2-iO24.js";
//#region src/channels/message/outbound-echo.d.ts
type OutboundMessageIdentityScope = {
  channel: string;
  accountId?: string;
  conversationId: string;
};
type OutboundMessageIdentity = OutboundMessageIdentityScope & ({
  messageId: string;
  sourceId?: string;
} | {
  messageId?: string;
  sourceId: string;
});
/** Records a platform message id emitted by a channel's own outbound send path. */
declare function recordOutboundMessageIdentity(identity: OutboundMessageIdentity): void;
/** Returns whether an inbound platform message matches a recently emitted outbound id. */
declare function isRecentOutboundMessageIdentity(identity: OutboundMessageIdentity): boolean;
//#endregion
//#region src/channels/message/capabilities.d.ts
/** Derives the adapter capabilities core needs before it can require durable final delivery. */
declare function deriveDurableFinalDeliveryRequirements(params: DeriveDurableFinalDeliveryRequirementsParams): DurableFinalDeliveryRequirementMap;
//#endregion
//#region src/channels/message/adapter.d.ts
declare const defaultManualReceiveAdapter: {
  readonly defaultAckPolicy: "manual";
  readonly supportedAckPolicies: readonly ["manual"];
};
type ChannelMessageAdapterWithDefaultReceive<TAdapter extends ChannelMessageAdapterShape> = TAdapter & {
  receive: TAdapter["receive"] extends undefined ? typeof defaultManualReceiveAdapter : NonNullable<TAdapter["receive"]>;
};
/** Defines a message adapter while defaulting receive acknowledgement to manual. */
declare function defineChannelMessageAdapter<const TAdapter extends ChannelMessageAdapterShape>(adapter: TAdapter): ChannelMessageAdapter<ChannelMessageAdapterWithDefaultReceive<TAdapter>>;
//#endregion
//#region src/channels/message/outbound-bridge.d.ts
/** Send result accepted from legacy outbound bridge methods before receipt normalization. */
type ChannelMessageOutboundBridgeResult = MessageReceiptSourceResult & {
  receipt?: MessageReceipt;
  messageId?: string;
};
type ChannelMessageOutboundBridgeContext<TContext> = Omit<TContext, "onDeliveryResult"> & {
  onDeliveryResult?: (result: ChannelMessageOutboundBridgeResult) => Promise<void> | void;
};
/** Legacy outbound adapter shape bridged into the channel message adapter contract. */
type ChannelMessageOutboundBridgeAdapter<TConfig = unknown> = {
  deliveryCapabilities?: {
    durableFinal?: DurableFinalDeliveryRequirementMap;
  };
  sendText?: (ctx: ChannelMessageOutboundBridgeContext<ChannelMessageSendTextContext<TConfig>>) => Promise<ChannelMessageOutboundBridgeResult>;
  sendMedia?: (ctx: ChannelMessageOutboundBridgeContext<ChannelMessageSendMediaContext<TConfig>>) => Promise<ChannelMessageOutboundBridgeResult>;
  sendPayload?: (ctx: ChannelMessageOutboundBridgeContext<ChannelMessageSendPayloadContext<TConfig>>) => Promise<ChannelMessageOutboundBridgeResult>;
  sendPoll?: (ctx: ChannelMessageOutboundBridgeContext<ChannelMessageSendPollContext<TConfig>>) => Promise<ChannelMessageOutboundBridgeResult>;
};
/** Options for building a message adapter from legacy outbound send functions. */
type CreateChannelMessageAdapterFromOutboundParams<TConfig = unknown> = {
  id?: string;
  outbound: ChannelMessageOutboundBridgeAdapter<TConfig>;
  capabilities?: DurableFinalDeliveryRequirementMap;
  live?: ChannelMessageLiveAdapterShape;
  receive?: ChannelMessageReceiveAdapterShape;
};
/** Converts legacy outbound send methods into a typed channel message adapter. */
declare function createChannelMessageAdapterFromOutbound<TConfig = unknown>(params: CreateChannelMessageAdapterFromOutboundParams<TConfig>): ChannelMessageAdapterShape<TConfig>;
//#endregion
//#region src/channels/message/durable-receive.d.ts
/** Pending inbound receive record kept until agent dispatch or durable send completes. */
type DurableInboundReceivePendingRecord<TPayload, TMetadata = unknown> = {
  id: string;
  payload: TPayload;
  metadata?: TMetadata;
  receivedAt: number;
  updatedAt: number;
  attempts: number;
  lastAttemptAt?: number;
  lastError?: string;
};
/** Completed inbound receive tombstone used to detect duplicate platform events. */
type DurableInboundReceiveCompletedRecord<TMetadata = unknown> = {
  id: string;
  completedAt: number;
  metadata?: TMetadata;
};
/** Accept result for a new or duplicate inbound platform event. */
type DurableInboundReceiveAcceptResult<TPayload, TMetadata, TCompletedMetadata> = {
  kind: "accepted";
  duplicate: false;
  record: DurableInboundReceivePendingRecord<TPayload, TMetadata>;
} | {
  kind: "pending";
  duplicate: true;
  record: DurableInboundReceivePendingRecord<TPayload, TMetadata>;
} | {
  kind: "completed";
  duplicate: true;
  record: DurableInboundReceiveCompletedRecord<TCompletedMetadata>;
};
/** Options recorded when accepting a pending inbound event. */
type DurableInboundReceiveAcceptOptions<TMetadata> = {
  metadata?: TMetadata;
  receivedAt?: number;
};
/** Options recorded when marking an inbound event complete. */
type DurableInboundReceiveCompleteOptions<TCompletedMetadata> = {
  metadata?: TCompletedMetadata;
  completedAt?: number;
};
/** Options recorded when releasing an inbound event for retry. */
type DurableInboundReceiveReleaseOptions = {
  lastError?: string;
  releasedAt?: number;
};
/** Durable receive journal facade used by channel receive pipelines. */
type DurableInboundReceiveJournal<TPayload, TMetadata, TCompletedMetadata> = {
  accept(id: string, payload: TPayload, options?: DurableInboundReceiveAcceptOptions<TMetadata>): Promise<DurableInboundReceiveAcceptResult<TPayload, TMetadata, TCompletedMetadata>>;
  pending(): Promise<Array<DurableInboundReceivePendingRecord<TPayload, TMetadata>>>;
  complete(id: string, options?: DurableInboundReceiveCompleteOptions<TCompletedMetadata>): Promise<void>;
  release(id: string, options?: DurableInboundReceiveReleaseOptions): Promise<boolean>;
  deletePending(id: string): Promise<boolean>;
};
/** Queue-backed durable receive journal options with optional retention pruning. */
type DurableInboundReceiveQueueJournalOptions<TPayload, TMetadata, TCompletedMetadata> = {
  queue: ChannelIngressQueue<TPayload, TMetadata, TCompletedMetadata>;
  retention?: ChannelIngressQueuePruneOptions;
};
/** Adapts the shared channel ingress queue to the durable receive journal API. */
declare function createDurableInboundReceiveJournalFromQueue<TPayload, TMetadata = unknown, TCompletedMetadata = unknown>(options: DurableInboundReceiveQueueJournalOptions<TPayload, TMetadata, TCompletedMetadata>): DurableInboundReceiveJournal<TPayload, TMetadata, TCompletedMetadata>;
//#endregion
//#region src/channels/message/ingress-claim-owner.d.ts
declare const INGRESS_CLAIM_PROCESS_ID: string;
declare function processPidFromOwnerId(ownerId: string): number;
//#endregion
//#region src/channels/message/ingress-monitor.d.ts
/** Stable identity and serialization lane extracted before durable admission. */
type ChannelIngressMonitorFacts = {
  eventId: string;
  laneKey: string;
};
/** Versioned body presented to a channel's persisted-payload encoder. */
type ChannelIngressPayloadEnvelope<TBody> = {
  version: number;
  body: TBody;
};
/** Claim ownership lifecycle handed to one channel delivery. */
type ChannelIngressMonitorLifecycle = {
  admission: "exclusive";
  abortSignal: AbortSignal;
  onAdopted: () => void | Promise<void>;
  onDeferred: () => void;
  onAdoptionFinalizing: () => void;
  onAbandoned: () => void | Promise<void>;
};
/** Optional explicit outcome from a channel delivery. */
type ChannelIngressMonitorDeliveryResult = {
  kind: "completed";
} | {
  kind: "deferred";
} | {
  kind: "failed-retryable";
  error: unknown;
};
type ChannelIngressMonitorInspectionContext = {
  phase: "admission";
} | {
  phase: "claim";
  claimedId: string;
  claimedLaneKey: string | undefined;
};
type ChannelIngressMonitorClaimErrorKind = "invalid-version" | "identity-mismatch";
type ChannelIngressMonitorPayloadCodec<TRaw, TBody, TStoredPayload, TMetadata> = {
  version: number;
  serialize: (raw: TRaw, context: {
    facts: ChannelIngressMonitorFacts;
    receivedAt: number;
  }) => TBody;
  deserialize: (body: TBody, context: {
    claim: ChannelIngressQueueClaim<TStoredPayload, TMetadata>;
  }) => TRaw;
  createClaimError: (kind: ChannelIngressMonitorClaimErrorKind, claim: ChannelIngressQueueClaim<TStoredPayload, TMetadata>) => Error;
} & ((TBody extends string ? {
  storage: "raw-event";
} : never) | {
  storage?: "custom";
  encode: (envelope: ChannelIngressPayloadEnvelope<TBody>) => TStoredPayload;
  decode: (payload: TStoredPayload, context: {
    claim: ChannelIngressQueueClaim<TStoredPayload, TMetadata>;
  }) => {
    version: unknown;
    body: TBody;
  };
});
type ChannelIngressMonitorRetention = {
  pruneIntervalMs: number;
  pendingTtlMs?: number;
  pendingMaxEntries?: number;
  completedTtlMs?: number;
  completedMaxEntries?: number;
  failedTtlMs?: number;
  failedMaxEntries?: number;
};
type ChannelIngressMonitorDrainOptions<TStoredPayload, TMetadata> = Omit<CreateChannelIngressDrainOptions<TStoredPayload, TMetadata>, "queue" | "dispatchClaimedEvent" | "abortSignal" | "now" | "ownerId" | "claimLeaseMs">;
type CreateChannelIngressMonitorOptions<TRaw, TBody, TStoredPayload, TMetadata> = {
  queue: ChannelIngressQueue<TStoredPayload, TMetadata> | (() => ChannelIngressQueue<TStoredPayload, TMetadata>);
  inspect: (raw: TRaw, context: ChannelIngressMonitorInspectionContext) => ChannelIngressMonitorFacts | null;
  payload: ChannelIngressMonitorPayloadCodec<TRaw, TBody, TStoredPayload, TMetadata>;
  deliver: (raw: TRaw, lifecycle: ChannelIngressMonitorLifecycle, claim: ChannelIngressQueueClaim<TStoredPayload, TMetadata>) => Promise<ChannelIngressMonitorDeliveryResult | void> | ChannelIngressMonitorDeliveryResult | void;
  pollIntervalMs: number;
  retention: ChannelIngressMonitorRetention;
  appendRetryDelaysMs?: readonly number[];
  onDurableAdmission?: (raw: TRaw, context: {
    facts: ChannelIngressMonitorFacts;
    receivedAt: number;
  }) => void | Promise<void>;
  onAdmissionFailure?: (raw: TRaw, error: unknown) => void | Promise<void>; /** False lets repeated requests fill drain capacity while earlier claims remain active. */
  waitForDeliveryIdleBeforeRepump?: boolean; /** Runs each pump under a channel-owned async context such as a detached request root. */
  runPumpTask?: (work: () => Promise<void>) => Promise<void>; /** False lets a channel apply its own bounded delivery grace before final disposal. */
  waitForDeliveryIdleOnStop?: boolean;
  drain?: ChannelIngressMonitorDrainOptions<TStoredPayload, TMetadata>;
  abortSignal?: AbortSignal;
  now?: () => number;
  onError?: (error: unknown) => void;
  onActivityChange?: (active: boolean) => void;
  createStoppedError?: () => Error; /** Durable-after-stop preserves append-only admission for handlers selected before unregister. */
  admissionMode?: "until-stopped" | "while-running" | "durable-after-stop";
};
/**
 * Creates the shared monitor around a durable queue and ingress drain.
 * Channel code keeps transport inspection, payload shape, and delivery policy.
 */
declare function createChannelIngressMonitor<TRaw, TBody, TStoredPayload, TMetadata = unknown>(options: CreateChannelIngressMonitorOptions<TRaw, TBody, TStoredPayload, TMetadata>): {
  admit: (raw: TRaw, admitOptions?: {
    receivedAt?: number;
    facts?: ChannelIngressMonitorFacts;
  }) => Promise<{
    readonly kind: "ignored";
    readonly queueResult?: undefined;
  } | {
    readonly kind: "durable";
    readonly queueResult: {
      kind: "failed";
      duplicate: true;
      record: {
        id: string;
        channelId: string;
        accountId: string;
        queueName: string;
        failedAt: number;
        reason: string;
        message?: string;
      };
    } | {
      kind: "accepted";
      duplicate: false;
      record: ChannelIngressQueueRecord<TStoredPayload, TMetadata>;
    } | {
      kind: "pending";
      duplicate: true;
      record: ChannelIngressQueueRecord<TStoredPayload, TMetadata>;
    } | {
      kind: "claimed";
      duplicate: true;
      record: ChannelIngressQueueClaim<TStoredPayload, TMetadata>;
    } | {
      kind: "completed";
      duplicate: true;
      record: {
        id: string;
        channelId: string;
        accountId: string;
        queueName: string;
        completedAt: number;
        metadata?: unknown;
      };
    };
  }>;
  admitBatch: (rawEvents: readonly TRaw[], admitOptions?: {
    receivedAt?: number;
  }) => Promise<({
    readonly kind: "ignored";
    readonly queueResult?: undefined;
  } | {
    readonly kind: "durable";
    readonly queueResult: {
      kind: "failed";
      duplicate: true;
      record: {
        id: string;
        channelId: string;
        accountId: string;
        queueName: string;
        failedAt: number;
        reason: string;
        message?: string;
      };
    } | {
      kind: "accepted";
      duplicate: false;
      record: ChannelIngressQueueRecord<TStoredPayload, TMetadata>;
    } | {
      kind: "pending";
      duplicate: true;
      record: ChannelIngressQueueRecord<TStoredPayload, TMetadata>;
    } | {
      kind: "claimed";
      duplicate: true;
      record: ChannelIngressQueueClaim<TStoredPayload, TMetadata>;
    } | {
      kind: "completed";
      duplicate: true;
      record: {
        id: string;
        channelId: string;
        accountId: string;
        queueName: string;
        completedAt: number;
        metadata?: unknown;
      };
    };
  })[]>;
  start: () => void;
  requestDrain: () => void;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  waitForIdle: () => Promise<void>;
  waitForPumpIdle: () => Promise<void>;
  isRunning: () => boolean;
  isStopped: () => boolean;
};
//#endregion
//#region src/channels/message/contracts.d.ts
/**
 * Proof callback used to verify one declared durable-final delivery capability.
 */
type DurableFinalCapabilityProof = () => Promise<void> | void;
/**
 * Proof callbacks keyed by durable-final delivery capability.
 */
type DurableFinalCapabilityProofMap = Partial<Record<DurableFinalDeliveryCapability, DurableFinalCapabilityProof>>;
/**
 * Verification result for one durable-final delivery capability.
 */
type DurableFinalCapabilityProofResult = {
  capability: DurableFinalDeliveryCapability;
  status: "verified" | "not_declared";
};
/**
 * Proof callback used to verify one live-preview finalizer capability.
 */
type LivePreviewFinalizerCapabilityProof = () => Promise<void> | void;
/**
 * Proof callback used to verify one live message capability.
 */
type ChannelMessageLiveCapabilityProof = () => Promise<void> | void;
/**
 * Proof callback used to verify one receive acknowledgement policy.
 */
type ChannelMessageReceiveAckPolicyProof = () => Promise<void> | void;
/**
 * Proof callbacks keyed by live-preview finalizer capability.
 */
type LivePreviewFinalizerCapabilityProofMap = Partial<Record<LivePreviewFinalizerCapability, LivePreviewFinalizerCapabilityProof>>;
/**
 * Proof callbacks keyed by live message capability.
 */
type ChannelMessageLiveCapabilityProofMap = Partial<Record<ChannelMessageLiveCapability, ChannelMessageLiveCapabilityProof>>;
/**
 * Proof callbacks keyed by receive acknowledgement policy.
 */
type ChannelMessageReceiveAckPolicyProofMap = Partial<Record<ChannelMessageReceiveAckPolicy, ChannelMessageReceiveAckPolicyProof>>;
/**
 * Verification result for one live-preview finalizer capability.
 */
type LivePreviewFinalizerCapabilityProofResult = {
  capability: LivePreviewFinalizerCapability;
  status: "verified" | "not_declared";
};
/**
 * Verification result for one live message capability.
 */
type ChannelMessageLiveCapabilityProofResult = {
  capability: ChannelMessageLiveCapability;
  status: "verified" | "not_declared";
};
/**
 * Verification result for one receive acknowledgement policy.
 */
type ChannelMessageReceiveAckPolicyProofResult = {
  policy: ChannelMessageReceiveAckPolicy;
  status: "verified" | "not_declared";
};
/**
 * Verifies proof callbacks for every declared durable-final delivery capability.
 */
declare function verifyDurableFinalCapabilityProofs(params: {
  adapterName: string;
  capabilities?: DurableFinalDeliveryRequirementMap;
  proofs: DurableFinalCapabilityProofMap;
}): Promise<DurableFinalCapabilityProofResult[]>;
/**
 * Verifies durable-final proofs from a channel message adapter declaration.
 */
declare function verifyChannelMessageAdapterCapabilityProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "durableFinal">;
  proofs: DurableFinalCapabilityProofMap;
}): Promise<DurableFinalCapabilityProofResult[]>;
/**
 * Verifies receive acknowledgement proofs from a channel message adapter declaration.
 */
declare function verifyChannelMessageReceiveAckPolicyAdapterProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "receive">;
  proofs: ChannelMessageReceiveAckPolicyProofMap;
}): Promise<ChannelMessageReceiveAckPolicyProofResult[]>;
/**
 * Verifies live-preview finalizer proofs from a channel message adapter declaration.
 */
declare function verifyChannelMessageLiveFinalizerProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "live">;
  proofs: LivePreviewFinalizerCapabilityProofMap;
}): Promise<LivePreviewFinalizerCapabilityProofResult[]>;
/**
 * Verifies live message capability proofs from a channel message adapter declaration.
 */
declare function verifyChannelMessageLiveCapabilityAdapterProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "live">;
  proofs: ChannelMessageLiveCapabilityProofMap;
}): Promise<ChannelMessageLiveCapabilityProofResult[]>;
//#endregion
//#region src/channels/message/receipt.d.ts
type MessageReceiptInputResult = MessageReceiptSourceResult & {
  receipt?: MessageReceipt;
};
/** Builds one normalized receipt from platform send results or nested adapter receipts. */
declare function createMessageReceiptFromOutboundResults(params: {
  results: readonly MessageReceiptInputResult[];
  kind?: MessageReceiptPartKind;
  threadId?: string;
  replyToId?: string;
  sentAt?: number;
}): MessageReceipt;
/** Lists unique platform message ids in receipt order. */
declare function listMessageReceiptPlatformIds(receipt: MessageReceipt): string[];
/** Resolves the explicit primary platform id, falling back to the first unique receipt id. */
declare function resolveMessageReceiptPrimaryId(receipt: MessageReceipt): string | undefined;
//#endregion
//#region src/channels/message/receive.d.ts
/** Public alias for channel receive acknowledgement policy names. */
type MessageAckPolicy = ChannelMessageReceiveAckPolicy;
/** Processing stage where a durable inbound message may be acknowledged. */
type MessageAckStage = "receive_record" | "agent_dispatch" | "durable_send" | "manual";
/** Current acknowledgement state for one inbound message context. */
type MessageAckState = "pending" | "acked" | "nacked";
/** Mutable receive context passed through durable inbound message processing. */
type MessageReceiveContext<TMessage = unknown> = {
  id: string;
  channel: string;
  accountId?: string;
  message: TMessage;
  ackPolicy: MessageAckPolicy;
  ackState: MessageAckState;
  ackedAt?: number;
  nackErrorMessage?: string;
  receivedAt: number;
  signal: AbortSignal;
  shouldAckAfter(stage: MessageAckStage): boolean;
  ack(): Promise<void>;
  nack(error: unknown): Promise<void>;
};
/** Creates a receive context with idempotent ack and explicit nack state transitions. */
declare function createMessageReceiveContext<TMessage>(params: {
  id: string;
  channel: string;
  accountId?: string;
  message: TMessage;
  ackPolicy?: MessageAckPolicy;
  receivedAt?: number;
  signal?: AbortSignal;
  onAck?: () => Promise<void> | void;
  onNack?: (error: unknown) => Promise<void> | void;
}): MessageReceiveContext<TMessage>;
//#endregion
//#region src/channels/typing-lifecycle.d.ts
type AsyncTick = () => Promise<void> | void;
type TypingKeepaliveLoop = {
  tick: () => Promise<void>;
  start: () => void;
  stop: () => void;
  isRunning: () => boolean;
};
/** Creates a cancellable keepalive loop for channel typing indicators. */
declare function createTypingKeepaliveLoop(params: {
  intervalMs: number;
  onTick: AsyncTick;
}): TypingKeepaliveLoop;
//#endregion
//#region src/channels/draft-streaming-chunking.d.ts
type ChannelDraftStreamingChunking = {
  minChars: number;
  maxChars: number;
  breakPreference: "paragraph" | "newline" | "sentence";
};
declare function resolveChannelDraftStreamingChunking(cfg: OpenClawConfig | undefined, channelId: ChannelId, accountId: string | null | undefined, opts: {
  fallbackLimit: number;
}): ChannelDraftStreamingChunking;
//#endregion
//#region src/infra/outbound/reply-policy.d.ts
/** Resolved reply target plus whether it came from payload or ambient context. */
type ReplyToResolution = {
  replyToId?: string;
  source?: "explicit" | "implicit";
};
/** Creates a reply-to supplier that consumes implicit single-use reply ids once. */
declare function createReplyToFanout(params: {
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
  replyToIdSource?: ReplyToResolution["source"];
}): () => string | undefined;
//#endregion
//#region src/channels/progress-draft-compositor.d.ts
type ChannelProgressDraftMode = StreamingMode;
type ChannelProgressDraftCompositorLine = string | ChannelProgressDraftLine;
type ChannelProgressDraftCompositorSnapshot = Readonly<{
  lines: readonly ChannelProgressDraftCompositorLine[];
  statusHeadline?: string;
  plan?: readonly AgentPlanStep[];
  planExplanation?: string;
}>;
/** Tracks per-turn activity for compact progress receipts. */
declare function createChannelProgressReceiptTracker(params?: {
  now?: () => number;
}): {
  noteReasoning(): void;
  closeReasoning: () => void;
  noteToolCall(toolName?: string): void;
  noteCommentary(itemId?: string, text?: string): void;
  reset: () => void;
  buildSummaryLine(): string;
};
type ChannelProgressDraftUpdateOptions = {
  flush?: boolean;
  lines?: readonly ChannelProgressDraftCompositorLine[];
};
/** Creates a stateful compositor for one streaming channel reply. */
declare function createChannelProgressDraftCompositor(params: {
  entry: StreamingCompatEntry | null | undefined;
  mode: ChannelProgressDraftMode;
  active: boolean;
  seed: string;
  update: (text: string, options?: ChannelProgressDraftUpdateOptions) => Promise<void> | void;
  deleteCurrent?: () => Promise<void> | void;
  tryNativeUpdate?: (text: string) => Promise<boolean> | boolean; /** Publish when structured lines change even if the rendered text does not. */
  updateOnLineChange?: boolean;
  formatLine?: (line: string) => string;
  isEmptyLine?: (line: ChannelProgressDraftCompositorLine | undefined) => boolean;
  shouldStartNow?: (line: ChannelProgressDraftCompositorLine | undefined) => boolean;
  reasoningLinePrefix?: string;
  commentaryLinePrefix?: string;
  reasoningGate?: boolean;
  commentaryItalics?: boolean;
  now?: () => number;
  setTimeoutFn?: typeof setTimeout;
  clearTimeoutFn?: typeof clearTimeout;
}): {
  readonly previewToolProgressEnabled: boolean;
  readonly commentaryProgressEnabled: boolean;
  readonly suppressDefaultToolProgressMessages: boolean;
  readonly hasStarted: boolean;
  readonly isVisible: boolean;
  readonly hasStatusHeadline: boolean;
  readonly hasPlanProgress: boolean;
  getSnapshot: () => ChannelProgressDraftCompositorSnapshot;
  markFinalReplyStarted(): void;
  markFinalReplyDelivered(): void;
  beginNewTurn(options?: {
    force?: boolean;
  }): boolean;
  reset(): void;
  resetReasoningProgress(): void;
  mergeReasoningProgress: (text?: string, options?: {
    snapshot?: boolean;
  }) => string;
  suppress(): void;
  cancel(): void;
  start(): Promise<void>;
  noteActivity(options?: {
    startImmediately?: boolean;
  }): Promise<boolean>;
  pushToolProgress: (line?: ChannelProgressDraftCompositorLine, options?: {
    toolName?: string;
    startImmediately?: boolean;
  }) => Promise<boolean>;
  pushPlanProgress(steps?: AgentPlanStep[], options?: {
    explanation?: string;
  }): Promise<boolean>;
  pushPreambleHeadline(text?: string, options?: {
    itemId?: string;
  }): Promise<boolean>;
  pushNarrationProgress(text?: string): Promise<boolean>;
  pushReasoningProgress(text?: string, options?: {
    snapshot?: boolean;
  }): Promise<boolean>;
  pushCommentaryProgress(text?: string, options?: {
    itemId?: string;
  }): Promise<boolean>;
};
//#endregion
//#region src/plugin-sdk/channel-outbound.d.ts
type ChannelInboundKernelModule = typeof kernel_d_exports;
/** Lazily forwards inbound reply delivery through the channel turn kernel. */
declare const deliverInboundReplyWithMessageSendContext: ChannelInboundKernelModule["deliverInboundReplyWithMessageSendContext"];
/** Sends a durable message batch without eager-loading channel message runtime internals. */
declare function sendDurableMessageBatch(
/**
 * Durable send context and outbound batch data forwarded to the channel runtime.
 */

params: DurableMessageSendContextParams): Promise<DurableMessageBatchSendResult>;
/** Runs work inside a durable message send context loaded through the SDK lazy boundary. */
declare function withDurableMessageSendContext<T>(
/**
 * Durable send context used to bind sends, receipts, and lifecycle callbacks.
 */

params: DurableMessageSendContextParams,
/**
 * Callback executed with the loaded durable-send runtime context.
 */

run: (ctx: DurableMessageSendContext) => Promise<T>): Promise<T>;
//#endregion
export { createChannelMessageAdapterFromOutbound as A, verifyDurableFinalCapabilityProofs as C, INGRESS_CLAIM_PROCESS_ID as D, createChannelIngressMonitor as E, recordOutboundMessageIdentity as F, deriveDurableFinalDeliveryRequirements as M, OutboundMessageIdentity as N, processPidFromOwnerId as O, isRecentOutboundMessageIdentity as P, verifyChannelMessageReceiveAckPolicyAdapterProofs as S, ChannelIngressMonitorLifecycle as T, listMessageReceiptPlatformIds as _, ChannelProgressDraftCompositorSnapshot as a, verifyChannelMessageLiveCapabilityAdapterProofs as b, ReplyToResolution as c, resolveChannelDraftStreamingChunking as d, createTypingKeepaliveLoop as f, createMessageReceiptFromOutboundResults as g, createMessageReceiveContext as h, ChannelProgressDraftCompositorLine as i, defineChannelMessageAdapter as j, createDurableInboundReceiveJournalFromQueue as k, createReplyToFanout as l, MessageReceiveContext as m, sendDurableMessageBatch as n, createChannelProgressDraftCompositor as o, MessageAckPolicy as p, withDurableMessageSendContext as r, createChannelProgressReceiptTracker as s, deliverInboundReplyWithMessageSendContext as t, ChannelDraftStreamingChunking as u, resolveMessageReceiptPrimaryId as v, ChannelIngressMonitorDeliveryResult as w, verifyChannelMessageLiveFinalizerProofs as x, verifyChannelMessageAdapterCapabilityProofs as y };