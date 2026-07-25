import { n as InternalHookEventType, r as InternalHookHandler, t as InternalHookEvent } from "./internal-hook-types-DM6LaXwu.js";
//#region src/hooks/internal-hooks.d.ts
type MessageReceivedHookContext = {
  /** Sender identifier (e.g., phone number, user ID) */from: string; /** Message content */
  content: string; /** Unix timestamp when the message was received */
  timestamp?: number; /** Channel identifier (for example "chat" or "support-chat") */
  channelId: string; /** Provider account ID for multi-account setups */
  accountId?: string; /** Conversation/chat ID */
  conversationId?: string; /** Message ID from the provider */
  messageId?: string; /** Additional provider-specific metadata */
  metadata?: Record<string, unknown>;
};
type MessageSentHookContext = {
  /** Recipient identifier */to: string; /** Message content */
  content: string; /** Whether the message was sent successfully */
  success: boolean; /** Error message if sending failed */
  error?: string; /** Channel identifier (for example "chat" or "support-chat") */
  channelId: string; /** Provider account ID for multi-account setups */
  accountId?: string; /** Conversation/chat ID */
  conversationId?: string; /** Message ID returned by the provider */
  messageId?: string; /** Whether this message was sent in a group/channel context */
  isGroup?: boolean; /** Group or channel identifier, if applicable */
  groupId?: string;
};
/**
 * Register a hook handler for a specific event type or event:action combination
 *
 * @param eventKey - Event type (e.g., 'command') or specific action (e.g., 'command:new')
 * @param handler - Function to call when the event is triggered
 *
 * @example
 * ```ts
 * // Listen to all command events
 * registerInternalHook('command', async (event) => {
 *   console.log('Command:', event.action);
 * });
 *
 * // Listen only to /new commands
 * registerInternalHook('command:new', async (event) => {
 *   await saveSessionToMemory(event);
 * });
 * ```
 */
declare function registerInternalHook(eventKey: string, handler: InternalHookHandler): void;
/**
 * Clear all registered hooks (useful for testing)
 */
declare function clearInternalHooks(): void;
/**
 * Trigger a hook event
 *
 * Calls all handlers registered for:
 * 1. The general event type (e.g., 'command')
 * 2. The specific event:action combination (e.g., 'command:new')
 *
 * Handlers are called in registration order. Errors are caught and logged
 * but don't prevent other handlers from running.
 *
 * @param event - The event to trigger
 */
declare function triggerInternalHook(event: InternalHookEvent): Promise<void>;
/**
 * Create a hook event with common fields filled in
 *
 * @param type - The event type
 * @param action - The action within that type
 * @param sessionKey - The session key
 * @param context - Additional context
 */
declare function createInternalHookEvent(type: InternalHookEventType, action: string, sessionKey: string, context?: Record<string, unknown>): InternalHookEvent;
//#endregion
export { registerInternalHook as a, createInternalHookEvent as i, MessageSentHookContext as n, triggerInternalHook as o, clearInternalHooks as r, MessageReceivedHookContext as t };