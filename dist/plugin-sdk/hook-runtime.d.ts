import { Ct as PluginHookMessageSentEvent, bt as PluginHookMessageReceivedEvent, yt as PluginHookMessageContext } from "../hook-types-Y_WIyhXM.js";
import { t as FinalizedMsgContext } from "../templating-CzGprbNA.js";
import { t as DiagnosticTraceContext } from "../diagnostic-trace-context-c5mRZYEt.js";
import { a as resetGlobalHookRunner, i as initializeGlobalHookRunner } from "../hook-runner-global-D21buR5x.js";
import { a as registerInternalHook, i as createInternalHookEvent, n as MessageSentHookContext, o as triggerInternalHook, r as clearInternalHooks, t as MessageReceivedHookContext } from "../internal-hooks-1OPIKx94.js";

//#region src/hooks/fire-and-forget.d.ts
/** Queue limits for bounded fire-and-forget hook execution. */
type FireAndForgetBoundedHookOptions = {
  maxConcurrency?: number;
  maxQueue?: number;
  timeoutMs?: number;
};
/** Format hook errors as bounded single-line log messages with secrets redacted upstream. */
/** Run a hook promise without awaiting it, logging rejection safely. */
declare function fireAndForgetHook(task: Promise<unknown>, label: string, logger?: (message: string) => void): void;
/** Queue a fire-and-forget hook with bounded concurrency, queue depth, and timeout logs. */
declare function fireAndForgetBoundedHook(task: () => Promise<unknown>, label: string, logger?: (message: string) => void, options?: FireAndForgetBoundedHookOptions): void;
//#endregion
//#region src/hooks/message-hook-mappers.d.ts
type CanonicalInboundMessageHookContext = {
  from: string;
  to?: string;
  content: string;
  body?: string;
  bodyForAgent?: string;
  transcript?: string;
  timestamp?: number;
  channelId: string;
  accountId?: string;
  conversationId?: string;
  sessionKey?: string;
  agentId?: string;
  runId?: string;
  messageId?: string;
  senderId?: string;
  senderName?: string;
  senderUsername?: string;
  senderE164?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
  provider?: string;
  surface?: string;
  threadId?: string | number;
  threadParentId?: string | number;
  mediaPath?: string;
  mediaUrl?: string;
  mediaType?: string;
  mediaPaths?: string[];
  mediaUrls?: string[];
  mediaTypes?: string[];
  mediaRemoteHost?: string;
  mediaStagingPending?: boolean;
  originalMediaPath?: string;
  originalMediaUrl?: string;
  originalMediaType?: string;
  originalMediaPaths?: string[];
  originalMediaUrls?: string[];
  originalMediaTypes?: string[];
  originatingChannel?: string;
  originatingTo?: string;
  guildId?: string;
  channelName?: string;
  isGroup: boolean;
  groupId?: string;
  topicName?: string;
  trace?: DiagnosticTraceContext;
  callDepth?: number;
};
type CanonicalSentMessageHookContext = {
  to: string;
  content: string;
  success: boolean;
  error?: string;
  channelId: string;
  accountId?: string;
  conversationId?: string;
  sessionKey?: string;
  runId?: string;
  messageId?: string;
  trace?: DiagnosticTraceContext;
  callDepth?: number;
  isGroup?: boolean;
  groupId?: string;
};
declare function deriveInboundMessageHookContext(ctx: FinalizedMsgContext, overrides?: {
  content?: string;
  messageId?: string;
}): CanonicalInboundMessageHookContext;
declare function buildCanonicalSentMessageHookContext(params: {
  to: string;
  content: string;
  success: boolean;
  error?: string;
  channelId: string;
  accountId?: string;
  conversationId?: string;
  sessionKey?: string;
  runId?: string;
  messageId?: string;
  trace?: DiagnosticTraceContext;
  callDepth?: number;
  isGroup?: boolean;
  groupId?: string;
}): CanonicalSentMessageHookContext;
declare function toPluginMessageContext(canonical: CanonicalInboundMessageHookContext | CanonicalSentMessageHookContext): PluginHookMessageContext;
declare function toPluginMessageReceivedEvent(canonical: CanonicalInboundMessageHookContext): PluginHookMessageReceivedEvent;
declare function toPluginMessageSentEvent(canonical: CanonicalSentMessageHookContext): PluginHookMessageSentEvent;
declare function toInternalMessageReceivedContext(canonical: CanonicalInboundMessageHookContext): MessageReceivedHookContext;
declare function toInternalMessageSentContext(canonical: CanonicalSentMessageHookContext): MessageSentHookContext;
//#endregion
export { buildCanonicalSentMessageHookContext, clearInternalHooks, createInternalHookEvent, deriveInboundMessageHookContext, fireAndForgetBoundedHook, fireAndForgetHook, initializeGlobalHookRunner, registerInternalHook, resetGlobalHookRunner, toInternalMessageReceivedContext, toInternalMessageSentContext, toPluginMessageContext, toPluginMessageReceivedEvent, toPluginMessageSentEvent, triggerInternalHook };