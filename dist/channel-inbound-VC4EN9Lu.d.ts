import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { Kn as PluginRuntime, br as ConversationFacts, nr as BuildChannelInboundEventContextParams, rr as BuiltChannelInboundEventContext, ur as filterChannelInboundSupplementalContext, xr as InboundMediaFacts } from "./types-Bi5Leigi.js";
import { o as TurnAdoptionLifecycle } from "./types-BBQnzy9U.js";
import { _ as InboundEventKind, t as FinalizedMsgContext } from "./templating-CzGprbNA.js";
import { n as HistoryMediaEntry } from "./history.types-CZQnFyil.js";
import { t as appendTranscriptEvent } from "./session-accessor-D9GCz3fF.js";
import { t as OutboundReplyPayload } from "./reply-payload-DS9v--Bs.js";
import { s as CommandNormalizeOptions } from "./commands-registry.types-B_p0nGwG.js";
import { n as EnvelopeFormatOptions } from "./envelope-XTVF34lJ.js";
import { n as createInboundDebouncer, t as InboundDebounceCreateParams } from "./inbound-debounce-C-BgcUfv.js";
//#region src/channels/direct-dm.d.ts
type DirectDmRoutePeer = {
  kind: "direct";
  id: string;
};
type DirectDmRoute = {
  agentId: string;
  sessionKey: string;
  accountId?: string;
};
type DispatchInboundDirectDmParams = {
  cfg: OpenClawConfig;
  channel: string;
  channelLabel: string;
  accountId: string;
  peer: DirectDmRoutePeer;
  senderId: string;
  senderAddress: string;
  recipientAddress: string;
  conversationLabel: string;
  rawBody: string;
  messageId: string;
  timestamp?: number;
  commandAuthorized?: boolean;
  turnAdoptionLifecycle?: TurnAdoptionLifecycle; /** Set only after the channel's sender/pairing guard admits this event. */
  inboundAccessAuthorized?: boolean;
  bodyForAgent?: string;
  commandBody?: string;
  provider?: string;
  surface?: string;
  originatingChannel?: string;
  originatingTo?: string;
  extraContext?: Record<string, unknown>;
  deliver: (payload: OutboundReplyPayload) => Promise<void>;
  onRecordError: (err: unknown) => void;
  onDispatchError: (err: unknown, info: {
    kind: string;
  }) => void;
};
declare function dispatchInboundDirectDm(params: DispatchInboundDirectDmParams): Promise<{
  route: DirectDmRoute;
  ctxPayload: FinalizedMsgContext;
}>;
declare function dispatchInboundDirectDmWithRuntime(params: DispatchInboundDirectDmParams & {
  runtime: PluginRuntime;
}): Promise<{
  route: DirectDmRoute;
  storePath: string;
  ctxPayload: FinalizedMsgContext;
}>;
//#endregion
//#region src/channels/inbound-debounce-policy.d.ts
/** Returns true when an inbound text event is safe to debounce before dispatch. */
declare function shouldDebounceTextInbound(params: {
  text: string | null | undefined;
  cfg: OpenClawConfig;
  hasMedia?: boolean;
  commandOptions?: CommandNormalizeOptions;
  allowDebounce?: boolean;
}): boolean;
/** Creates a channel-scoped inbound debouncer using config/default debounce timing. */
declare function createChannelInboundDebouncer<T>(params: Omit<InboundDebounceCreateParams<T>, "debounceMs"> & {
  cfg: OpenClawConfig;
  channel: string;
  debounceMsOverride?: number;
}): {
  debounceMs: number;
  debouncer: ReturnType<typeof createInboundDebouncer<T>>;
};
//#endregion
//#region src/channels/session-envelope.d.ts
/** Resolves envelope options and previous timestamp for one inbound channel session. */
declare function resolveInboundSessionEnvelopeContext(params: {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey: string;
}): {
  storePath: string;
  envelopeOptions: EnvelopeFormatOptions;
  previousTimestamp: number | undefined;
};
//#endregion
//#region src/channels/inbound-event/classification.d.ts
/**
 * Facts needed to classify whether inbound room activity should wake the agent.
 */
type ClassifyChannelInboundEventParams = {
  conversation: Pick<ConversationFacts, "kind">;
  unmentionedGroupPolicy?: InboundEventKind;
  wasMentioned?: boolean;
  hasControlCommand?: boolean;
  hasAbortRequest?: boolean;
  commandSource?: "native" | "text";
};
/**
 * Classifies an inbound channel event as an actionable request or passive room event.
 */
declare function classifyChannelInboundEvent(params: ClassifyChannelInboundEventParams): InboundEventKind;
/**
 * Resolves the configured policy for unmentioned group/channel inbound events.
 */
declare function resolveUnmentionedGroupInboundPolicy(params: {
  cfg: OpenClawConfig;
  agentId?: string;
}): InboundEventKind;
//#endregion
//#region src/channels/feedback-reflection.d.ts
declare const DEFAULT_CHANNEL_FEEDBACK_REFLECTION_COOLDOWN_MS = 300000;
declare function recordChannelFeedbackEvent(params: {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey: string;
  event: Parameters<typeof appendTranscriptEvent>[1];
}): Promise<boolean>;
type ChannelFeedbackReflectionResult = {
  status: "cooldown";
} | {
  status: "empty";
} | {
  status: "complete";
  learning: string;
  storePath: string;
  followUp: boolean;
  userMessage?: string;
  responseLength: number;
};
declare function runChannelFeedbackReflection(params: {
  cfg: OpenClawConfig;
  channel: string;
  channelLabel: string;
  accountId?: string;
  agentId: string;
  sessionKey: string;
  conversationId: string;
  conversationKind: "direct" | "group" | "channel";
  thumbedDownResponse?: string;
  userComment?: string;
  cooldownMs?: number;
  onRecordError?: (error: unknown) => void;
  onDispatchError?: (error: unknown) => void;
}): Promise<ChannelFeedbackReflectionResult>;
//#endregion
//#region src/channels/inbound-event/media.d.ts
/**
 * Attachment metadata accepted from channel plugins before core normalization.
 */
type ChannelInboundMediaInput = {
  path?: string | null;
  url?: string | null;
  contentType?: string | null;
  kind?: InboundMediaFacts["kind"] | null;
  transcribed?: boolean | null;
  messageId?: string | null;
};
type MediaPlaceholderTextFact = Readonly<Pick<ChannelInboundMediaInput, "contentType" | "kind" | "path" | "url">>;
/** Renders structured media facts for channel surfaces that can carry text only. */
declare function formatMediaPlaceholderText(media: readonly MediaPlaceholderTextFact[]): string;
/**
 * Environment payload fields consumed by prompt/context builders for inbound media attachments.
 */
type ChannelInboundMediaPayload = {
  MediaPath?: string;
  MediaUrl?: string;
  MediaType?: string;
  MediaPaths?: string[];
  MediaUrls?: string[];
  MediaTypes?: string[];
  MediaTranscribedIndexes?: number[];
};
/** Appends an unavailable-media notice to real caption text, or returns the notice alone. */
declare function formatInboundMediaUnavailableText(params: {
  body?: string | null;
  notice: string;
}): string;
/**
 * Normalizes plugin-provided attachment facts into the channel turn media shape.
 */
declare function toInboundMediaFacts(media: readonly ChannelInboundMediaInput[] | null | undefined, defaults?: {
  kind?: InboundMediaFacts["kind"];
  messageId?: string;
  transcribed?: (media: ChannelInboundMediaInput, index: number) => boolean;
}): InboundMediaFacts[];
/**
 * Projects inbound attachment facts into transcript history without transient turn-only flags.
 */
declare function toHistoryMediaEntries(media: readonly ChannelInboundMediaInput[] | null | undefined, defaults?: {
  kind?: InboundMediaFacts["kind"];
  messageId?: string;
}): HistoryMediaEntry[];
/**
 * Builds prompt environment media fields while keeping single-item legacy fields populated.
 */
declare function buildChannelInboundMediaPayload(media: readonly InboundMediaFacts[] | null | undefined): ChannelInboundMediaPayload;
//#endregion
//#region src/plugin-sdk/channel-inbound.d.ts
/**
 * Deprecated turn-context input alias that still accepts the old `inboundTurnKind` name.
 *
 * @deprecated Use `BuildChannelInboundEventContextParams`.
 */
type BuildChannelTurnContextParams = Omit<BuildChannelInboundEventContextParams, "message"> & {
  message: BuildChannelInboundEventContextParams["message"] & {
    inboundTurnKind?: InboundEventKind;
  };
};
/**
 * Deprecated turn-context result alias with the historical `InboundTurnKind` field.
 *
 * @deprecated Use `BuiltChannelInboundEventContext`.
 */
type BuiltChannelTurnContext = BuiltChannelInboundEventContext & {
  InboundTurnKind: InboundEventKind;
};
/**
 * Builds inbound-event context for callers still passing `inboundTurnKind`.
 *
 * @deprecated Use `buildChannelInboundEventContext`.
 */
declare function buildChannelTurnContext(params: BuildChannelTurnContextParams): BuiltChannelTurnContext;
/**
 * Deprecated supplemental-context filter alias retained for channel SDK compatibility.
 *
 * @deprecated Use `filterChannelInboundSupplementalContext`.
 */
declare const filterChannelTurnSupplementalContext: typeof filterChannelInboundSupplementalContext;
//#endregion
export { dispatchInboundDirectDm as C, shouldDebounceTextInbound as S, ClassifyChannelInboundEventParams as _, ChannelInboundMediaInput as a, resolveInboundSessionEnvelopeContext as b, buildChannelInboundMediaPayload as c, toHistoryMediaEntries as d, toInboundMediaFacts as f, runChannelFeedbackReflection as g, recordChannelFeedbackEvent as h, filterChannelTurnSupplementalContext as i, formatInboundMediaUnavailableText as l, DEFAULT_CHANNEL_FEEDBACK_REFLECTION_COOLDOWN_MS as m, BuiltChannelTurnContext as n, ChannelInboundMediaPayload as o, ChannelFeedbackReflectionResult as p, buildChannelTurnContext as r, MediaPlaceholderTextFact as s, BuildChannelTurnContextParams as t, formatMediaPlaceholderText as u, classifyChannelInboundEvent as v, dispatchInboundDirectDmWithRuntime as w, createChannelInboundDebouncer as x, resolveUnmentionedGroupInboundPolicy as y };