import { _ as ChannelImplicitMentionsConfig } from "./types.slack-DFzHb8bG.js";

//#region src/channels/mention-gating.d.ts
type InboundImplicitMentionKind = "reply_to_bot" | "quoted_bot" | "bot_thread_participant" | "native";
type InboundMentionFacts = {
  canDetectMention: boolean;
  wasMentioned: boolean;
  hasAnyMention?: boolean;
  implicitMentionKinds?: readonly InboundImplicitMentionKind[];
};
type InboundMentionPolicy = {
  isGroup: boolean;
  requireMention: boolean;
  implicitMentions?: ChannelImplicitMentionsConfig;
  allowedImplicitMentionKinds?: readonly InboundImplicitMentionKind[];
  allowTextCommands: boolean;
  hasControlCommand: boolean;
  commandAuthorized: boolean;
};
/** @deprecated Prefer the nested `{ facts, policy }` call shape for new code. */
type ResolveInboundMentionDecisionFlatParams = InboundMentionFacts & InboundMentionPolicy;
type ResolveInboundMentionDecisionNestedParams = {
  facts: InboundMentionFacts;
  policy: InboundMentionPolicy;
};
type ResolveInboundMentionDecisionParams = ResolveInboundMentionDecisionFlatParams | ResolveInboundMentionDecisionNestedParams;
type InboundMentionDecision = {
  effectiveWasMentioned: boolean;
  shouldSkip: boolean;
  implicitMention: boolean;
  matchedImplicitMentionKinds: InboundImplicitMentionKind[];
  shouldBypassMention: boolean;
};
declare function implicitMentionKindWhen(kind: InboundImplicitMentionKind, enabled: boolean): InboundImplicitMentionKind[];
declare function resolveInboundMentionDecision(params: ResolveInboundMentionDecisionParams): InboundMentionDecision;
//#endregion
export { ResolveInboundMentionDecisionFlatParams as a, implicitMentionKindWhen as c, InboundMentionPolicy as i, resolveInboundMentionDecision as l, InboundMentionDecision as n, ResolveInboundMentionDecisionNestedParams as o, InboundMentionFacts as r, ResolveInboundMentionDecisionParams as s, InboundImplicitMentionKind as t };