import { n as HistoryMediaEntry, t as HistoryEntry } from "./history.types-CZQnFyil.js";

//#region src/channels/turn/history-window.d.ts
type MaybePromise$1<T> = T | Promise<T>;
/** Windowed channel history facade used by turn adapters to record and render recent context. */
type ChannelHistoryWindow<T extends HistoryEntry = HistoryEntry> = {
  record: (params: {
    historyKey: string;
    entry?: T | null;
    limit: number;
  }) => T[];
  recordWithMedia: (params: {
    historyKey: string;
    entry?: T | null;
    limit: number;
    media?: readonly HistoryMediaEntry[] | null | (() => MaybePromise$1<readonly HistoryMediaEntry[] | null | undefined>);
    mediaLimit?: number;
    messageId?: string;
    shouldRecord?: () => boolean;
  }) => Promise<T[]>;
  buildPendingContext: (params: {
    historyKey: string;
    limit: number;
    currentMessage: string;
    formatEntry: (entry: T) => string;
    lineBreak?: string;
  }) => string;
  buildInboundHistory: (params: {
    historyKey: string;
    limit: number;
  }) => HistoryEntry[] | undefined;
  clear: (params: {
    historyKey: string;
    limit: number;
  }) => void;
};
/** Creates a bounded channel history window over a caller-owned history map. */
declare function createChannelHistoryWindow<T extends HistoryEntry = HistoryEntry>(params: {
  historyMap: Map<string, T[]>;
}): ChannelHistoryWindow<T>;
//#endregion
//#region src/auto-reply/reply/history.d.ts
declare const HISTORY_CONTEXT_MARKER = "[Chat messages since your last reply - for context]";
declare const DEFAULT_GROUP_HISTORY_LIMIT = 50;
/**
 * Evict oldest keys from a history map when it exceeds MAX_HISTORY_KEYS.
 * Uses Map's insertion order for LRU-like behavior.
 */
declare function evictOldHistoryKeys<T>(historyMap: Map<string, T[]>, maxKeys?: number): void;
/** Wraps previous chat history and the current message in the prompt context marker format. */
declare function buildHistoryContext(params: {
  historyText: string;
  currentMessage: string;
  lineBreak?: string;
}): string;
/** Appends one history entry, enforces per-session limit, and refreshes LRU key order. */
declare function recordChannelHistoryEntry<T extends HistoryEntry>(params: {
  historyMap: Map<string, T[]>;
  historyKey: string;
  entry: T;
  limit: number;
}): T[];
/**
 * @deprecated Plugin message-turn code should use `createChannelHistoryWindow(...).record(...)`.
 * This helper remains for core internals and older plugin compatibility.
 */
declare const recordPendingHistoryEntry: typeof recordChannelHistoryEntry;
declare function recordChannelHistoryEntryIfEnabled<T extends HistoryEntry>(params: {
  historyMap: Map<string, T[]>;
  historyKey: string;
  entry?: T | null;
  limit: number;
}): T[];
/**
 * @deprecated Plugin message-turn code should use `createChannelHistoryWindow(...).record(...)`.
 * This helper remains for core internals and older plugin compatibility.
 */
declare const recordPendingHistoryEntryIfEnabled: typeof recordChannelHistoryEntryIfEnabled;
type MaybePromise<T> = T | Promise<T>;
/** Filters history media to local image entries safe to re-attach to prompt context. */
declare function normalizeHistoryMediaEntries(params: {
  media?: readonly HistoryMediaEntry[] | null;
  limit?: number;
  messageId?: string;
}): HistoryMediaEntry[];
declare function recordChannelHistoryEntryWithMedia<T extends HistoryEntry>(params: {
  historyMap: Map<string, T[]>;
  historyKey: string;
  entry?: T | null;
  limit: number;
  media?: readonly HistoryMediaEntry[] | null | (() => MaybePromise<readonly HistoryMediaEntry[] | null | undefined>);
  mediaLimit?: number;
  messageId?: string;
  shouldRecord?: () => boolean;
}): Promise<T[]>;
/**
 * @deprecated Plugin message-turn code should use
 * `createChannelHistoryWindow(...).recordWithMedia(...)`.
 */
declare const recordPendingHistoryEntryWithMedia: typeof recordChannelHistoryEntryWithMedia;
declare function buildChannelPendingHistoryContext(params: {
  historyMap: Map<string, HistoryEntry[]>;
  historyKey: string;
  limit: number;
  currentMessage: string;
  formatEntry: (entry: HistoryEntry) => string;
  lineBreak?: string;
}): string;
/**
 * @deprecated Plugin message-turn code should use
 * `createChannelHistoryWindow(...).buildPendingContext(...)`.
 */
declare const buildPendingHistoryContextFromMap: typeof buildChannelPendingHistoryContext;
declare function buildChannelInboundHistory<T extends HistoryEntry>(params: {
  historyMap: Map<string, T[]>;
  historyKey: string;
  limit: number;
}): HistoryEntry[] | undefined;
/**
 * @deprecated Plugin message-turn code should use
 * `createChannelHistoryWindow(...).buildInboundHistory(...)`.
 */
declare const buildInboundHistoryFromMap: typeof buildChannelInboundHistory;
/** Builds structured inbound history entries from an existing window. */
declare function buildInboundHistoryFromEntries(params: {
  entries: readonly HistoryEntry[];
  limit: number;
}): HistoryEntry[] | undefined;
/**
 * @deprecated Prefer `buildHistoryContextFromEntries(...)` for existing entry
 * arrays, or `createChannelHistoryWindow(...)` when working from a history map.
 * This helper remains for older plugin compatibility.
 */
declare function buildHistoryContextFromMap(params: {
  historyMap: Map<string, HistoryEntry[]>;
  historyKey: string;
  limit: number;
  entry?: HistoryEntry;
  currentMessage: string;
  formatEntry: (entry: HistoryEntry) => string;
  lineBreak?: string;
  excludeLast?: boolean;
}): string;
declare function clearChannelHistory(params: {
  historyMap: Map<string, HistoryEntry[]>;
  historyKey: string;
}): void;
/**
 * @deprecated Plugin message-turn code should use `createChannelHistoryWindow(...).clear(...)`.
 */
declare const clearHistoryEntries: typeof clearChannelHistory;
declare function clearChannelHistoryIfEnabled(params: {
  historyMap: Map<string, HistoryEntry[]>;
  historyKey: string;
  limit: number;
}): void;
/**
 * @deprecated Plugin message-turn code should use `createChannelHistoryWindow(...).clear(...)`.
 * This helper remains for core internals and older plugin compatibility.
 */
declare const clearHistoryEntriesIfEnabled: typeof clearChannelHistoryIfEnabled;
/** Builds prompt text from already-recorded history entries. */
declare function buildHistoryContextFromEntries(params: {
  entries: HistoryEntry[];
  currentMessage: string;
  formatEntry: (entry: HistoryEntry) => string;
  lineBreak?: string;
  excludeLast?: boolean;
}): string;
//#endregion
export { createChannelHistoryWindow as _, buildHistoryContextFromMap as a, buildPendingHistoryContextFromMap as c, evictOldHistoryKeys as d, normalizeHistoryMediaEntries as f, ChannelHistoryWindow as g, recordPendingHistoryEntryWithMedia as h, buildHistoryContextFromEntries as i, clearHistoryEntries as l, recordPendingHistoryEntryIfEnabled as m, HISTORY_CONTEXT_MARKER as n, buildInboundHistoryFromEntries as o, recordPendingHistoryEntry as p, buildHistoryContext as r, buildInboundHistoryFromMap as s, DEFAULT_GROUP_HISTORY_LIMIT as t, clearHistoryEntriesIfEnabled as u };