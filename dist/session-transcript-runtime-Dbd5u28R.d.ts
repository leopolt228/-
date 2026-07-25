import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { s as AgentMessage } from "./types-Dedz4oTJ.js";
import { a as SessionTranscriptRawDeltaResult, c as TranscriptMessageAppendResult, i as SessionTranscriptRawDeltaLimits, l as TranscriptUpdatePayload, o as SessionTranscriptVisibleMessageDeltaLimits, s as TranscriptMessageAppendOptions } from "./session-accessor-D9GCz3fF.js";
import { a as SessionTranscriptUpdateMode, i as SessionTranscriptDeliveryMirror, r as SessionTranscriptAppendResult, t as LatestAssistantTranscriptText } from "./transcript-CVPqoo9S.js";
import { n as SessionTranscriptIdentity, o as SessionTranscriptReadParams } from "./session-transcript-memory-hit-RB9BE5he.js";

//#region src/plugin-sdk/session-transcript-runtime.d.ts
type SessionTranscriptEvent = unknown;
type SessionTranscriptTargetParams = SessionTranscriptReadParams;
/** Scoped target and bounds for one raw generation-aware transcript page. */
type SessionTranscriptRawDeltaParams = SessionTranscriptTargetParams & SessionTranscriptRawDeltaLimits;
/** Scoped target and bounds for one active-path visible-message page. */
type SessionTranscriptVisibleMessageDeltaParams = SessionTranscriptTargetParams & SessionTranscriptVisibleMessageDeltaLimits;
/** Generation-aware outcome for one bounded visible-message read. */
type SessionTranscriptVisibleMessageDeltaResult = {
  kind: "page"; /** Opaque cursor positioned after the last returned visible message. */
  cursor: string; /** Ordered active-path message entries selected for this page. */
  entries: SessionTranscriptMessageEntry[]; /** True when another visible message remains after this page. */
  hasMore: boolean; /** First unread event size when it cannot fit under maxBytes. */
  requiredBytes?: number; /** Stored JSONL bytes represented by entries. */
  serializedBytes: number;
} | {
  kind: "reset"; /** Fresh opaque bootstrap cursor for the current visible generation. */
  cursor: string; /** Stable discontinuity that invalidated the supplied cursor. */
  reason: "anchor_missing" | "anchor_moved" | "generation_mismatch" | "invalid_cursor" | "scope_mismatch";
} | {
  kind: "unavailable";
  reason: "projection_rebuilding";
} | {
  kind: "missing";
};
type SessionTranscriptMessageEntry = {
  /** Stable transcript event id for this message entry. */entryId: string; /** Parent id after active-branch normalization; null when this is a visible root. */
  parentId: string | null; /** Ordered read metadata for this full transcript read, not a resumable cursor. */
  seq: number; /** Redacted agent message payload as persisted by the runtime. */
  message: AgentMessage; /** Convenience mirror of message.role. */
  role: AgentMessage["role"]; /** Entry timestamp recorded by the transcript store, when present. */
  createdAt?: string; /** Message idempotency key, when the persisted message has one. */
  idempotencyKey?: string;
};
type SessionTranscriptTarget = SessionTranscriptIdentity & {
  targetKind: "runtime-session";
};
type SessionTranscriptAppendMessageParams<TMessage> = SessionTranscriptTargetParams & TranscriptMessageAppendOptions<TMessage>;
type SessionTranscriptAssistantMirrorAppendParams = SessionTranscriptReadParams & {
  config?: OpenClawConfig;
  deliveryMirror?: SessionTranscriptDeliveryMirror;
  idempotencyKey?: string;
  mediaUrls?: string[];
  text?: string;
  updateMode?: SessionTranscriptUpdateMode;
};
type SessionTranscriptWriteLockParams = SessionTranscriptTargetParams & {
  config?: TranscriptMessageAppendOptions<unknown>["config"];
};
type SessionTranscriptWriteLockContext = {
  appendMessage: <TMessage>(options: Omit<TranscriptMessageAppendOptions<TMessage>, "config">) => Promise<TranscriptMessageAppendResult<TMessage> | undefined>;
  publishUpdate: (update?: TranscriptUpdatePayload) => Promise<void>;
  readEvents: () => Promise<SessionTranscriptEvent[]>;
  target: SessionTranscriptTarget;
};
type SessionTranscriptMirrorAppendResult = {
  ok: true;
  messageId: string;
} | Extract<SessionTranscriptAppendResult, {
  ok: false;
}>;
/**
 * Resolves the public identity for a transcript without returning its file path.
 */
declare function resolveSessionTranscriptIdentity(params: SessionTranscriptReadParams): Promise<SessionTranscriptIdentity>;
/**
 * Resolves the public target for transcript operations without exposing the
 * current storage path as identity.
 */
declare function resolveSessionTranscriptTarget(params: SessionTranscriptTargetParams): Promise<SessionTranscriptTarget>;
/**
 * Reads transcript events by public session identity instead of file path.
 */
declare function readSessionTranscriptEvents(params: SessionTranscriptTargetParams): Promise<SessionTranscriptEvent[]>;
/** Reads one bounded raw page; the opaque cursor survives append and resets after replacement. */
declare function readSessionTranscriptRawDelta(params: SessionTranscriptRawDeltaParams): Promise<SessionTranscriptRawDeltaResult>;
/** Reads one bounded active-path page that resumes appends and resets after discontinuities. */
declare function readSessionTranscriptVisibleMessageDelta(params: SessionTranscriptVisibleMessageDeltaParams): Promise<SessionTranscriptVisibleMessageDeltaResult>;
/**
 * Reads visible transcript message entries by scoped identity.
 *
 * This is a branch-safe message projection over the current full transcript
 * read. `seq` is ordered read metadata, not a resumable cursor.
 */
declare function readVisibleSessionTranscriptMessageEntries(params: SessionTranscriptTargetParams): Promise<SessionTranscriptMessageEntry[]>;
/**
 * Reads the latest visible assistant text by scoped identity.
 */
declare function readLatestAssistantTextByIdentity(params: SessionTranscriptTargetParams): Promise<LatestAssistantTranscriptText | undefined>;
/**
 * Appends a delivery-mirror assistant message through the SQLite transcript accessor.
 */
declare function appendAssistantMirrorMessageByIdentity(params: SessionTranscriptAssistantMirrorAppendParams): Promise<SessionTranscriptMirrorAppendResult>;
/**
 * Appends a transcript message by scoped transcript target.
 */
declare function appendSessionTranscriptMessageByIdentity<TMessage>(params: SessionTranscriptAppendMessageParams<TMessage>): Promise<TranscriptMessageAppendResult<TMessage> | undefined>;
/**
 * Publishes a transcript update by scoped transcript target.
 */
declare function publishSessionTranscriptUpdateByIdentity(params: SessionTranscriptTargetParams & {
  update?: TranscriptUpdatePayload;
}): Promise<void>;
/**
 * Runs transcript work under the write lock for the resolved scoped target.
 */
declare function withSessionTranscriptWriteLock<T>(params: SessionTranscriptWriteLockParams, run: (context: SessionTranscriptWriteLockContext) => Promise<T> | T): Promise<T>;
//#endregion
export { withSessionTranscriptWriteLock as S, readSessionTranscriptRawDelta as _, SessionTranscriptRawDeltaParams as a, resolveSessionTranscriptIdentity as b, SessionTranscriptVisibleMessageDeltaParams as c, SessionTranscriptWriteLockParams as d, appendAssistantMirrorMessageByIdentity as f, readSessionTranscriptEvents as g, readLatestAssistantTextByIdentity as h, SessionTranscriptMessageEntry as i, SessionTranscriptVisibleMessageDeltaResult as l, publishSessionTranscriptUpdateByIdentity as m, SessionTranscriptAssistantMirrorAppendParams as n, SessionTranscriptTarget as o, appendSessionTranscriptMessageByIdentity as p, SessionTranscriptEvent as r, SessionTranscriptTargetParams as s, SessionTranscriptAppendMessageParams as t, SessionTranscriptWriteLockContext as u, readSessionTranscriptVisibleMessageDelta as v, resolveSessionTranscriptTarget as x, readVisibleSessionTranscriptMessageEntries as y };