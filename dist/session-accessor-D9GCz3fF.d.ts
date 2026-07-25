import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { t as DeliveryContext } from "./delivery-context.types-CgrQeDKp.js";
import { c as SessionEntry, r as GroupKeyResolution } from "./types-D43pE80v.js";
import { i as MsgContext } from "./templating-CzGprbNA.js";

//#region src/sessions/transcript-events.d.ts
/** Storage-neutral identity for the session transcript that changed. */
type SessionTranscriptUpdateTarget = {
  agentId: string;
  sessionId: string;
  sessionKey: string;
};
type SessionTranscriptUpdateFields = {
  sessionFile?: string;
  target?: SessionTranscriptUpdateTarget;
  sessionKey?: string;
  agentId?: string;
  sessionId?: string;
  message?: unknown;
  messageId?: string;
  messageSeq?: number;
};
/** Normalized transcript update emitted after a session transcript changes. */
type SessionTranscriptUpdate = Omit<SessionTranscriptUpdateFields, "sessionFile"> & {
  target: SessionTranscriptUpdateTarget;
};
/** Internal transcript update that may identify a transcript without a file path. */
type InternalSessionTranscriptUpdate = SessionTranscriptUpdateFields;
type SessionTranscriptListener = (update: SessionTranscriptUpdate) => void;
type InternalSessionTranscriptListener = (update: InternalSessionTranscriptUpdate) => void;
/** Registers a listener for normalized session transcript updates. */
declare function onSessionTranscriptUpdate(listener: SessionTranscriptListener): () => void;
/** Registers an internal listener for identity-only or file-backed transcript updates. */
declare function onInternalSessionTranscriptUpdate(listener: InternalSessionTranscriptListener): () => void;
//#endregion
//#region src/config/sessions/session-accessor.types.d.ts
/**
 * Session access API for callers that need entries or transcripts without
 * depending on the persisted store layout. Callers provide stable session
 * identity, and this module resolves the current entry/transcript target while
 * preserving canonical-key, transcript-linking, and update-notification rules.
 *
 * Ownership contract (#88838): this accessor is the permanent storage-neutral
 * domain boundary for session/transcript runtime access; the SQLite storage
 * flip implements this interface. The entry workflow helpers in store.ts are
 * the file-backend implementation it delegates to plus the plugin-SDK
 * deprecation-window surface (RFC 0007); they become internal as direct
 * callers migrate here. New runtime callers use this module, not store.ts.
 */
type SessionAccessScope = {
  /** Agent owner used when the session key does not already encode one. */agentId?: string;
  /**
   * Set false only for internal read-only hot paths that will not retain or
   * mutate the returned entry.
   */
  clone?: boolean; /** Environment override used when resolving agent-scoped store paths in tests/tools. */
  env?: NodeJS.ProcessEnv; /** Set false for metadata-only reads that do not need hydrated prompt refs. */
  hydrateSkillPromptRefs?: boolean; /** Use latest when the caller must bypass any in-process metadata snapshot. */
  readConsistency?: "latest"; /** Canonical or alias session key for the entry being read or written. */
  sessionKey: string; /** Explicit store path for callers that already resolved the owning store. */
  storePath?: string;
};
type SessionTranscriptAccessScope = Omit<SessionAccessScope, "sessionKey"> & {
  /** Deprecated transcript locator from older file-backed call sites. */sessionFile?: string; /** Runtime session id used to resolve the transcript identity. */
  sessionId: string; /** Required when resolving through session metadata; optional for legacy locators. */
  sessionKey?: string; /** Channel thread suffix used when deriving topic transcript paths. */
  threadId?: string | number;
};
/** Raw transcript record for non-message events; message records use appendTranscriptMessage. */
type TranscriptEvent = unknown;
type SessionTranscriptEventRow = {
  event: TranscriptEvent;
  seq: number;
};
/** Count, byte, and continuation bounds for one raw transcript page. */
type SessionTranscriptRawDeltaLimits = {
  /** Opaque cursor returned by a prior page or reset result. */cursor?: string; /** Maximum serialized JSONL bytes returned by this page. */
  maxBytes?: number; /** Maximum number of events returned by this page. */
  maxEvents?: number;
};
/** Generation-aware outcome for one bounded raw transcript read. */
type SessionTranscriptRawDeltaResult = {
  kind: "page"; /** Cursor positioned after the last returned event. */
  cursor: string; /** Ordered raw transcript events selected for this page. */
  events: SessionTranscriptEventRow[]; /** True when another event remains after this page. */
  hasMore: boolean; /** First unread event size when it cannot fit under maxBytes. */
  requiredBytes?: number; /** Stored JSONL bytes represented by events. */
  serializedBytes: number;
} | {
  kind: "reset"; /** Fresh bootstrap cursor for the current generation. */
  cursor: string; /** Stable discontinuity that invalidated the supplied cursor. */
  reason: "generation_mismatch" | "invalid_cursor" | "scope_mismatch";
} | {
  kind: "missing";
};
/** Count, byte, and continuation bounds for one visible-message page. */
type SessionTranscriptVisibleMessageDeltaLimits = {
  /** Opaque continuation cursor; store and return it unchanged. */cursor?: string; /** Maximum serialized JSONL bytes returned by this page. */
  maxBytes?: number; /** Maximum number of visible messages returned by this page. */
  maxMessages?: number;
};
type TranscriptMessageAppendOptions<TMessage> = {
  /** Runtime config used for message redaction and transcript header metadata. */config?: OpenClawConfig; /** Working directory recorded in a newly created transcript header. */
  cwd?: string; /** How duplicate message idempotency keys are detected before append. */
  idempotencyLookup?: "scan" | "scan-assistant" | "caller-checked"; /** Provider/channel message payload to persist. */
  message: TMessage; /** Testable timestamp override for the generated transcript entry. */
  now?: number; /** Existing transcript event id owned by a caller with its own session tree. */
  eventId?: string; /** Existing parent id owned by a caller with its own session tree. */
  parentId?: string | null; /** Optional finalizer that runs after duplicate detection but before persistence. */
  prepareMessageAfterIdempotencyCheck?: (message: TMessage) => TMessage | undefined; /** Allow append without parent-link migration for large legacy linear transcripts. */
  useRawWhenLinear?: boolean;
};
type TranscriptMessageAppendResult<TMessage> = {
  /** False when idempotency lookup found an existing transcript message. */appended: boolean; /** Redacted message payload as persisted or replayed from the transcript. */
  message: TMessage; /** Existing or newly generated transcript message id. */
  messageId: string;
};
/** Transcript update fields supplied by callers; the target is resolved here. */
type TranscriptUpdatePayload = Partial<SessionTranscriptUpdate>;
//#endregion
//#region src/config/sessions/session-accessor.entry-mutation.d.ts
type RecordInboundSessionMetaParams = {
  /** Set false to only patch existing entries; missing sessions stay absent. */createIfMissing?: boolean; /** Inbound message context whose stable metadata is derived and persisted. */
  ctx: MsgContext; /** Group routing resolution for group-owned session keys. */
  groupResolution?: GroupKeyResolution | null; /** Canonical or alias session key for the inbound conversation. */
  sessionKey: string; /** Explicit store target for file-backed stores and SQLite migration adapters. */
  storePath: string;
};
type UpdateSessionLastRouteParams = {
  /** Account owning the delivery route when the channel is multi-account. */accountId?: string; /** Delivery channel id persisted as the last route channel. */
  channel?: SessionEntry["lastChannel"]; /** Set false to only patch existing entries; missing sessions stay absent. */
  createIfMissing?: boolean; /** Optional inbound context whose session metadata is derived alongside the route. */
  ctx?: MsgContext; /** Explicit delivery context merged over the persisted session fallback. */
  deliveryContext?: DeliveryContext; /** Group routing resolution for group-owned session keys. */
  groupResolution?: GroupKeyResolution | null; /** Canonical channel route persisted as the session route slot. */
  route?: SessionEntry["route"]; /** Canonical or alias session key for the routed conversation. */
  sessionKey: string; /** Explicit store target for file-backed stores and SQLite migration adapters. */
  storePath: string; /** Thread/topic id for the delivery route, when the transport has one. */
  threadId?: string | number; /** Delivery target persisted as the last route recipient. */
  to?: string;
};
/**
 * Records stable conversation metadata derived from one inbound message as a
 * single storage-sized upsert (createIfMissing by default). Inbound metadata
 * must not refresh activity timestamps — idle reset relies on updatedAt from
 * real session turns — so existing rows merge with preserve-activity
 * semantics while legacy alias keys collapse onto the canonical row.
 */
declare function recordInboundSessionMeta(params: RecordInboundSessionMetaParams): Promise<SessionEntry | null>;
/**
 * Persists the last known delivery route for one session as a single
 * storage-sized patch. Route updates preserve activity timestamps (#49515)
 * and merge explicit route/delivery input over the persisted session
 * fallback before normalizing the derived last* fields.
 */
declare function updateSessionLastRoute(params: UpdateSessionLastRouteParams): Promise<SessionEntry | null>;
//#endregion
//#region src/config/sessions/session-accessor.transcript.d.ts
/**
 * Appends a non-message transcript record such as session or metadata events.
 * Message records must use appendTranscriptMessage so parent links, idempotency,
 * and redaction are preserved.
 */
declare function appendTranscriptEvent(scope: SessionTranscriptAccessScope, event: TranscriptEvent): Promise<void>;
//#endregion
export { SessionTranscriptRawDeltaResult as a, TranscriptMessageAppendResult as c, onSessionTranscriptUpdate as d, SessionTranscriptRawDeltaLimits as i, TranscriptUpdatePayload as l, recordInboundSessionMeta as n, SessionTranscriptVisibleMessageDeltaLimits as o, updateSessionLastRoute as r, TranscriptMessageAppendOptions as s, appendTranscriptEvent as t, onInternalSessionTranscriptUpdate as u };