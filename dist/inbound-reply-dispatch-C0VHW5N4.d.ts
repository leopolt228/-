import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { Cr as RunChannelTurnParams, Nr as DispatchReplyWithBufferedBlockDispatcher, Qn as DurableInboundReplyDeliveryOptions, Sr as PreparedChannelTurn, gr as ChannelTurnPlan, mr as AssembledChannelTurn, vr as ChannelTurnResult, zr as DispatchFromConfigResult } from "./types-Bi5Leigi.js";
import { r as ReplyPayload } from "./reply-payload-Cz6pe8eB.js";
import { n as GetReplyOptions } from "./types-BBQnzy9U.js";
import { It as ReplyDispatcher } from "./hook-types-Y_WIyhXM.js";
import { t as FinalizedMsgContext } from "./templating-CzGprbNA.js";
import { t as recordInboundSession } from "./session-D8rMNcVb.js";

//#region src/infra/outbound/reply-payload-normalize.d.ts
/**
 * Outbound-facing subset of reply payload fields accepted from loose producers.
 */
type OutboundReplyPayload = {
  text?: string;
  mediaUrls?: string[];
  mediaUrl?: string;
  presentation?: ReplyPayload["presentation"];
  presentationTextMode?: ReplyPayload["presentationTextMode"];
  /**
   * @deprecated Use presentation. Runtime support remains for legacy producers.
   */
  interactive?: ReplyPayload["interactive"];
  channelData?: ReplyPayload["channelData"];
  sensitiveMedia?: boolean;
  replyToId?: string;
  location?: ReplyPayload["location"];
  videoAsNote?: boolean;
};
//#endregion
//#region src/channels/message/inbound-reply-dispatch.d.ts
type ReplyOptionsWithoutModelSelected = Omit<Omit<GetReplyOptions, "onBlockReply">, "onModelSelected">;
type RecordInboundSessionFn = typeof recordInboundSession;
type ReplyDispatchFromConfigOptions = Omit<GetReplyOptions, "onBlockReply">;
type ChannelInboundEventRunnerParams<TRaw, TDispatchResult = DispatchFromConfigResult> = RunChannelTurnParams<TRaw, TDispatchResult>;
type PreparedInboundReply<TDispatchResult> = PreparedChannelTurn<TDispatchResult>;
type AssembledInboundReply = AssembledChannelTurn;
type ChannelInboundTurnPlan = ChannelTurnPlan;
type InboundReplyDispatchResult<TDispatchResult> = ChannelTurnResult<TDispatchResult>;
/** Run an already prepared inbound reply through shared session-record + dispatch ordering. */
declare function runPreparedInboundReply<TDispatchResult>(params: PreparedChannelTurn<TDispatchResult>): Promise<ChannelTurnResult<TDispatchResult>>;
/** @deprecated Use `runPreparedInboundReply`. */
declare function runPreparedInboundReplyTurn<TDispatchResult>(params: PreparedChannelTurn<TDispatchResult>): Promise<ChannelTurnResult<TDispatchResult>>;
declare function runChannelInboundEvent<TRaw, TDispatchResult = DispatchFromConfigResult>(params: ChannelInboundEventRunnerParams<TRaw, TDispatchResult>): Promise<ChannelTurnResult<TDispatchResult>>;
/** @deprecated Use `runChannelInboundEvent`. */
declare function runInboundReplyTurn<TRaw, TDispatchResult = DispatchFromConfigResult>(params: ChannelInboundEventRunnerParams<TRaw, TDispatchResult>): Promise<ChannelTurnResult<TDispatchResult>>;
declare function dispatchChannelInboundReply(params: AssembledInboundReply): Promise<ChannelTurnResult>;
declare function dispatchChannelInboundTurn(params: ChannelInboundTurnPlan): Promise<ChannelTurnResult>;
/** Run `dispatchReplyFromConfig` with a dispatcher that always gets its settled callback. */
declare function dispatchReplyFromConfigWithSettledDispatcher(params: {
  cfg: OpenClawConfig;
  ctxPayload: FinalizedMsgContext;
  dispatcher: ReplyDispatcher;
  onSettled: () => void | Promise<void>;
  replyOptions?: ReplyDispatchFromConfigOptions;
  configOverride?: OpenClawConfig;
}): Promise<DispatchFromConfigResult>;
/** Assemble the common inbound reply dispatch dependencies for a resolved route. */
declare function buildInboundReplyDispatchBase(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  route: {
    agentId: string;
    sessionKey: string;
  };
  storePath: string;
  ctxPayload: FinalizedMsgContext;
  core: {
    channel: {
      session: {
        recordInboundSession: RecordInboundSessionFn;
      };
      reply: {
        dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
      };
    };
  };
}): {
  cfg: OpenClawConfig;
  channel: string;
  accountId: string | undefined;
  agentId: string;
  routeSessionKey: string;
  storePath: string;
  ctxPayload: FinalizedMsgContext;
  recordInboundSession: typeof recordInboundSession;
  dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
};
type BuildInboundReplyDispatchBaseParams = Parameters<typeof buildInboundReplyDispatchBase>[0];
type RecordInboundSessionAndDispatchReplyParams = {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  agentId: string;
  routeSessionKey: string;
  storePath: string;
  ctxPayload: FinalizedMsgContext;
  recordInboundSession: RecordInboundSessionFn;
  dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
  deliver: (payload: OutboundReplyPayload) => Promise<void>;
  durable?: false | DurableInboundReplyDeliveryOptions;
  onRecordError: (err: unknown) => void;
  onDispatchError: (err: unknown, info: {
    kind: string;
  }) => void;
  replyOptions?: ReplyOptionsWithoutModelSelected;
};
/**
 * Resolve the shared dispatch base and immediately record + dispatch one inbound reply turn.
 *
 * @deprecated Compatibility reply-dispatch bridge. New channel plugins should
 * expose a `message` adapter via `defineChannelMessageAdapter(...)` and route
 * sends through `deliverInboundReplyWithMessageSendContext(...)` or
 * `sendDurableMessageBatch(...)`.
 */
declare function dispatchInboundReplyWithBase(params: BuildInboundReplyDispatchBaseParams & Pick<RecordInboundSessionAndDispatchReplyParams, "deliver" | "durable" | "onRecordError" | "onDispatchError" | "replyOptions">): Promise<void>;
/**
 * Record the inbound session first, then dispatch the reply using normalized outbound delivery.
 *
 * @deprecated Compatibility reply-dispatch bridge. New channel plugins should
 * expose a `message` adapter via `defineChannelMessageAdapter(...)` and route
 * sends through `deliverInboundReplyWithMessageSendContext(...)` or
 * `sendDurableMessageBatch(...)`.
 */
declare function recordInboundSessionAndDispatchReply(params: RecordInboundSessionAndDispatchReplyParams): Promise<void>;
//#endregion
export { PreparedInboundReply as a, dispatchChannelInboundTurn as c, recordInboundSessionAndDispatchReply as d, runChannelInboundEvent as f, runPreparedInboundReplyTurn as h, InboundReplyDispatchResult as i, dispatchInboundReplyWithBase as l, runPreparedInboundReply as m, ChannelInboundEventRunnerParams as n, buildInboundReplyDispatchBase as o, runInboundReplyTurn as p, ChannelInboundTurnPlan as r, dispatchChannelInboundReply as s, AssembledInboundReply as t, dispatchReplyFromConfigWithSettledDispatcher as u };