import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { E as ReplyToMode } from "./types.base-DucQBSmL.js";
import { i as MsgContext } from "./templating-CzGprbNA.js";
import { M as ChannelThreadingAdapter } from "./types.core-Di2R8WTy.js";
import { t as PairingChannel } from "./pairing-store.types-Dnl8wXcu.js";
//#region src/channels/conversation-label.d.ts
/**
 * Resolves the most readable conversation label from normalized inbound message context.
 */
declare function resolveConversationLabel(ctx: MsgContext): string | undefined;
//#endregion
//#region src/channels/session-meta.d.ts
/**
 * Best-effort inbound session metadata recorder for channel plugin command handlers.
 */
declare function recordInboundSessionMetaSafe(params: {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey: string;
  ctx: MsgContext;
  onError?: (error: unknown) => void;
}): Promise<void>;
//#endregion
//#region src/channels/plugins/threading-helpers.d.ts
type ReplyToModeResolver = NonNullable<ChannelThreadingAdapter["resolveReplyToMode"]>;
/**
 * Creates a reply-to-mode resolver that always returns one mode.
 */
declare function createStaticReplyToModeResolver(mode: ReplyToMode): ReplyToModeResolver;
/**
 * Creates a resolver that reads reply-to mode from top-level channel config.
 */
declare function createTopLevelChannelReplyToModeResolver(channelId: string): ReplyToModeResolver;
/**
 * Creates a resolver that reads reply-to mode from account-scoped config.
 */
declare function createScopedAccountReplyToModeResolver<TAccount>(params: {
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => TAccount;
  resolveReplyToMode: (account: TAccount, chatType?: string | null) => ReplyToMode | null | undefined;
  fallback?: ReplyToMode;
}): ReplyToModeResolver;
//#endregion
//#region src/pairing/pairing-labels.d.ts
declare function resolvePairingIdLabel(channel: PairingChannel): string;
//#endregion
export { recordInboundSessionMetaSafe as a, createTopLevelChannelReplyToModeResolver as i, createScopedAccountReplyToModeResolver as n, resolveConversationLabel as o, createStaticReplyToModeResolver as r, resolvePairingIdLabel as t };