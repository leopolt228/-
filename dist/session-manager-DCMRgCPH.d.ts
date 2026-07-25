import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { C as TextContent, d as Message, l as ImageContent } from "./types-CVnOkpxa.js";
import { g as CustomMessage, p as BashExecutionMessage, s as AgentMessage } from "./types-Dedz4oTJ.js";
//#region src/config/sessions/version.d.ts
/** Current persisted session transcript/header schema version. */
declare const CURRENT_SESSION_VERSION = 3;
//#endregion
//#region src/config/sessions/sqlite-marker.d.ts
type SqliteSessionFileMarker = {
  agentId: string;
  sessionId: string;
  storePath: string;
};
/** Formats the canonical sessionFile marker for SQLite-backed transcripts. */
declare function formatSqliteSessionFileMarker(marker: SqliteSessionFileMarker): string;
/** Parses a SQLite-backed transcript sessionFile marker. */
declare function parseSqliteSessionFileMarker(sessionFile: string | undefined): SqliteSessionFileMarker | undefined;
/** Checks whether a sessionFile marker points at the expected session id. */
declare function sqliteSessionFileMarkerMatchesSession(sessionFile: string | undefined, sessionId: string): boolean;
//#endregion
//#region src/config/sessions/transcript-write-context.d.ts
type OwnedSessionTranscriptPublishedEntry = {
  kind: "id";
  id: string;
} | {
  kind: "header";
  serialized: string;
} | {
  kind: "serialized";
  serialized: string;
};
type OwnedSessionTranscriptCacheSnapshot = {
  dev: bigint;
  ino: bigint;
  size: bigint;
  mtimeNs: bigint;
  ctimeNs: bigint;
};
//#endregion
//#region src/agents/sessions/session-manager-types.d.ts
interface SessionHeader {
  type: "session";
  version?: number;
  id: string;
  timestamp: string;
  cwd: string;
  parentSession?: string;
}
interface NewSessionOptions {
  id?: string;
  parentSession?: string;
}
interface SessionEntryBase {
  type: string;
  id: string;
  parentId: string | null;
  timestamp: string;
  /** This row consumes the raw side cursor instead of the visible leaf. */
  appendMode?: "side";
}
interface SessionMessageEntry extends SessionEntryBase {
  type: "message";
  message: AgentMessage;
}
interface ThinkingLevelChangeEntry extends SessionEntryBase {
  type: "thinking_level_change";
  thinkingLevel: string;
}
interface ModelChangeEntry extends SessionEntryBase {
  type: "model_change";
  provider: string;
  modelId: string;
}
interface CompactionEntry<T = unknown> extends SessionEntryBase {
  type: "compaction";
  summary: string;
  firstKeptEntryId: string;
  tokensBefore: number;
  /** Extension-specific data, such as artifact indexes or version markers. */
  details?: T;
  /** True for extension-generated compaction entries. */
  fromHook?: boolean;
}
interface BranchSummaryEntry<T = unknown> extends SessionEntryBase {
  type: "branch_summary";
  fromId: string;
  summary: string;
  /** Extension-specific data that is not sent to the model. */
  details?: T;
  /** True for extension-generated branch summaries. */
  fromHook?: boolean;
}
/** Extension state that is persisted but excluded from model context. */
interface CustomEntry<T = unknown> extends SessionEntryBase {
  type: "custom";
  customType: string;
  data?: T;
}
interface LabelEntry extends SessionEntryBase {
  type: "label";
  targetId: string;
  label: string | undefined;
}
interface SessionInfoEntry extends SessionEntryBase {
  type: "session_info";
  name?: string;
}
/** Extension message that participates in model context. */
interface CustomMessageEntry<T = unknown> extends SessionEntryBase {
  type: "custom_message";
  customType: string;
  content: string | (TextContent | ImageContent)[];
  details?: T;
  display: boolean;
}
type SessionEntry = SessionMessageEntry | ThinkingLevelChangeEntry | ModelChangeEntry | CompactionEntry | BranchSummaryEntry | CustomEntry | CustomMessageEntry | LabelEntry | SessionInfoEntry;
type FileEntry = SessionHeader | SessionEntry;
type AppendPersistenceOptions = {
  config?: OpenClawConfig;
  idempotencyLookup?: "scan" | "scan-assistant" | "caller-checked";
  invalidateSerializedPrefixCache?: boolean;
};
interface SessionTreeNode {
  entry: SessionEntry;
  children: SessionTreeNode[];
  label?: string;
  labelTimestamp?: string;
}
interface SessionContext {
  messages: AgentMessage[];
  thinkingLevel: string;
  model: {
    provider: string;
    modelId: string;
  } | null;
}
interface SessionInfo {
  path: string;
  id: string;
  /** Working directory where the session started. Empty for old sessions. */
  cwd: string;
  name?: string;
  parentSessionPath?: string;
  created: Date;
  modified: Date;
  messageCount: number;
  firstMessage: string;
  allMessagesText: string;
}
type SessionListProgress = (loaded: number, total: number) => void;
interface PromptReleasedOpaqueEntry {
  type: "prompt_released_opaque";
  record: unknown;
  preserveActiveLeaf?: true;
}
type PromptReleasedSessionEntry = SessionMessageEntry | CustomEntry | LabelEntry | SessionInfoEntry | PromptReleasedOpaqueEntry;
type PromptReleasedSessionMergeResult = {
  sessionFileSnapshot?: OwnedSessionTranscriptCacheSnapshot;
  publishedEntries?: readonly OwnedSessionTranscriptPublishedEntry[];
  requiresReload?: true;
};
type SessionFileSnapshot = OwnedSessionTranscriptCacheSnapshot;
type PreservedOpaqueFileEntry = {
  index: number;
  record: unknown;
};
type SessionLeafControl = {
  type: "leaf";
  id: string;
  parentId: string | null;
  timestamp: string;
  targetId: string | null;
  appendParentId?: string | null;
  appendMode?: "side";
};
//#endregion
//#region src/agents/sessions/session-manager-codec.d.ts
declare function migrateSessionEntries(entries: FileEntry[]): void;
declare function parseSessionEntries(content: string): FileEntry[];
declare function buildSessionContext(entries: SessionEntry[], leafId?: string | null, byIdInput?: Map<string, SessionEntry>): SessionContext;
declare function parseOpaqueLeafEntry(record: unknown): {
  id: string;
  parentId: string | null;
  targetId: string | null;
  appendParentId?: string | null;
  appendMode?: "side";
} | undefined;
//#endregion
//#region src/agents/sessions/session-manager-file.d.ts
type LoadedSessionFile = {
  entries: FileEntry[];
  snapshot: SessionFileSnapshot | undefined;
};
//#endregion
//#region src/agents/sessions/session-manager-core.d.ts
type SqliteSessionManagerPersistence = SqliteSessionFileMarker & {
  sessionKey: string;
};
declare class SessionManagerCore {
  protected sessionId: string;
  protected sessionFile: string | undefined;
  protected sessionDir: string;
  protected cwd: string;
  protected shouldPersist: boolean;
  protected flushed: boolean;
  protected fileEntries: FileEntry[];
  protected opaqueFileEntries: PreservedOpaqueFileEntry[];
  protected byId: Map<string, SessionEntry>;
  protected opaqueParentsById: Map<string, string | null>;
  protected logicalParentsById: Map<string, string | null>;
  protected invalidLeafControlIds: Set<string>;
  protected labelsById: Map<string, string>;
  protected labelTimestampsById: Map<string, string>;
  protected leafId: string | null;
  protected appendParentId: string | null;
  protected promptReleasedSideBranchParentId: string | null | undefined;
  protected recoveredCorruptHeader: boolean;
  protected sessionFileSnapshot: SessionFileSnapshot | undefined;
  protected sqlitePersistence: SqliteSessionManagerPersistence | undefined;
  constructor(cwd: string, sessionDir: string, sessionFile: string | undefined, persist: boolean, loadedSessionFile?: LoadedSessionFile, sqlitePersistence?: SqliteSessionManagerPersistence);
  setSessionFile(sessionFile: string): void;
  protected setLoadedSessionFile(sessionFile: string, loaded: LoadedSessionFile): void;
  protected setLoadedSqliteSessionFile(sessionFile: string, loaded: LoadedSessionFile): void;
  newSession(options?: NewSessionOptions): string | undefined;
  protected resolveOpaqueLeafTargetId(targetId: string | null): string | null;
  protected resolveOpaqueAppendParentId(parentId: string | null): string | null;
  protected resolveOpaqueLeafControl(leafEntry: ReturnType<typeof parseOpaqueLeafEntry>): {
    leafId: string | null;
    appendParentId: string | null;
    appendMode?: "side";
  } | undefined;
  protected buildIndex(): void;
  protected resolveCanonicalParentId(parentId: string | null): string | null;
  protected normalizeEntryParent(entry: SessionEntry): SessionEntry;
  private findFirstCanonicalDescendantOnBranch;
  private findFirstCanonicalDescendant;
  protected resolveBranchTargetId(branchFromId: string): string | null | undefined;
  protected clampOpaqueFileEntryIndexes(): void;
  protected createLeafControl(parentId: string | null, appendParentId?: string | null, appendMode?: "side"): SessionLeafControl;
  protected rememberLeafControl(leafEntry: SessionLeafControl): void;
  protected getPersistedFileEntries(leafAppendParentId?: string | null, leafAppendMode?: "side"): unknown[];
  getSerializedFileLinesForRewrite(): string[];
  clearPreservedOpaqueFileEntries(): void;
  protected writeFullFile(leafAppendParentId?: string | null, leafAppendMode?: "side"): string;
  protected replacePersistedTranscript(options?: {
    publishSnapshot?: boolean;
    leafAppendParentId?: string | null;
    leafAppendMode?: "side";
  }): void;
  isPersisted(): boolean;
  getCwd(): string;
  getSessionDir(): string;
  getSessionId(): string;
  wasRecoveredFromCorruptHeader(): boolean;
  getSessionFile(): string | undefined;
}
//#endregion
//#region src/agents/sessions/session-manager-persistence.d.ts
declare class SessionManagerPersistence extends SessionManagerCore {
  removeTrailingEntries(predicate: (entry: SessionEntry) => boolean, options?: {
    preserveTrailing?: (entry: SessionEntry) => boolean;
  }): number;
  protected persistRecord(entry: unknown, options?: AppendPersistenceOptions, publishSnapshot?: boolean): void;
  persist(entry: SessionEntry, options?: AppendPersistenceOptions): void;
  private persistSqliteRecord;
  syncSnapshotAfterHeaderRewrite(expectedContent?: string): void;
  mergePromptReleasedSessionEntries(entries: readonly PromptReleasedSessionEntry[], options?: {
    persistLeaf?: boolean;
  }): PromptReleasedSessionMergeResult | undefined;
  private assertPromptReleasedEntriesPreserveActiveLeaf;
}
//#endregion
//#region src/agents/sessions/session-manager-entries.d.ts
declare class SessionManagerEntries extends SessionManagerPersistence {
  protected appendEntry(entry: SessionEntry, options?: AppendPersistenceOptions): void;
  appendMessage(message: Message | CustomMessage | BashExecutionMessage, options?: AppendPersistenceOptions): string;
  appendThinkingLevelChange(thinkingLevel: string): string;
  appendModelChange(provider: string, modelId: string): string;
  appendCompaction(summary: string, firstKeptEntryId: string, tokensBefore: number, details?: unknown, fromHook?: boolean): string;
  appendCustomEntry(customType: string, data?: unknown): string;
  appendSessionInfo(name: string): string;
  getSessionName(): string | undefined;
  appendCustomMessageEntry(customType: string, content: string | (TextContent | ImageContent)[], display: boolean, details?: unknown): string;
  getLeafId(): string | null;
  getLeafEntry(): SessionEntry | undefined;
  getEntry(id: string): SessionEntry | undefined;
  getChildren(parentId: string): SessionEntry[];
  getLabel(id: string): string | undefined;
  appendLabelChange(targetId: string, label: string | undefined): string;
  getBranch(fromId?: string): SessionEntry[];
  buildSessionContext(): SessionContext;
  getHeader(): SessionHeader | null;
  getEntries(): SessionEntry[];
  getTree(): SessionTreeNode[];
  branch(branchFromId: string): void;
  resetLeaf(): void;
  branchWithSummary(branchFromId: string | null, summary: string, details?: unknown, fromHook?: boolean): string;
}
//#endregion
//#region src/agents/sessions/session-manager-branching.d.ts
declare class SessionManagerBranching extends SessionManagerEntries {
  private collectBranchedSessionPath;
  createBranchedSession(leafId: string): string | undefined;
}
//#endregion
//#region src/agents/sessions/session-manager.d.ts
declare class SessionManager extends SessionManagerBranching {
  private constructor();
  setSessionFile(sessionFile: string): void;
  newSession(options?: NewSessionOptions): string | undefined;
  getSerializedFileLinesForRewrite(): string[];
  clearPreservedOpaqueFileEntries(): void;
  isPersisted(): boolean;
  getCwd(): string;
  getSessionDir(): string;
  getSessionId(): string;
  wasRecoveredFromCorruptHeader(): boolean;
  getSessionFile(): string | undefined;
  removeTrailingEntries(predicate: (entry: SessionEntry) => boolean, options?: {
    preserveTrailing?: (entry: SessionEntry) => boolean;
  }): number;
  persist(entry: SessionEntry, options?: AppendPersistenceOptions): void;
  syncSnapshotAfterHeaderRewrite(expectedContent?: string): void;
  mergePromptReleasedSessionEntries(entries: readonly PromptReleasedSessionEntry[], options?: {
    persistLeaf?: boolean;
  }): PromptReleasedSessionMergeResult | undefined;
  appendMessage(message: Message | CustomMessage | BashExecutionMessage, options?: AppendPersistenceOptions): string;
  appendThinkingLevelChange(thinkingLevel: string): string;
  appendModelChange(provider: string, modelId: string): string;
  appendCompaction(summary: string, firstKeptEntryId: string, tokensBefore: number, details?: unknown, fromHook?: boolean): string;
  appendCustomEntry(customType: string, data?: unknown): string;
  appendSessionInfo(name: string): string;
  getSessionName(): string | undefined;
  appendCustomMessageEntry(customType: string, content: string | (TextContent | ImageContent)[], display: boolean, details?: unknown): string;
  getLeafId(): string | null;
  getLeafEntry(): SessionEntry | undefined;
  getEntry(id: string): SessionEntry | undefined;
  getChildren(parentId: string): SessionEntry[];
  getLabel(id: string): string | undefined;
  appendLabelChange(targetId: string, label: string | undefined): string;
  getBranch(fromId?: string): SessionEntry[];
  buildSessionContext(): SessionContext;
  getHeader(): SessionHeader | null;
  getEntries(): SessionEntry[];
  getTree(): SessionTreeNode[];
  branch(branchFromId: string): void;
  resetLeaf(): void;
  branchWithSummary(branchFromId: string | null, summary: string, details?: unknown, fromHook?: boolean): string;
  createBranchedSession(leafId: string): string | undefined;
  static create(cwd: string, sessionDir?: string): SessionManager;
  static open(path: string, sessionDir?: string, cwdOverride?: string): SessionManager;
  static continueRecent(cwd: string, sessionDir?: string): SessionManager;
  static inMemory(cwd?: string): SessionManager;
  static forkFrom(sourcePath: string, targetCwd: string, sessionDir?: string): SessionManager;
  static list(cwd: string, sessionDir?: string, onProgress?: SessionListProgress): Promise<SessionInfo[]>;
  static listAll(onProgress?: SessionListProgress): Promise<SessionInfo[]>;
}
type ReadonlySessionManager = Pick<SessionManager, "getCwd" | "getSessionDir" | "getSessionId" | "getSessionFile" | "getLeafId" | "getLeafEntry" | "getEntry" | "getLabel" | "getBranch" | "getHeader" | "getEntries" | "getTree" | "getSessionName">;
//#endregion
export { parseSessionEntries as a, SessionEntry as c, parseSqliteSessionFileMarker as d, sqliteSessionFileMarkerMatchesSession as f, migrateSessionEntries as i, SqliteSessionFileMarker as l, SessionManager as n, BranchSummaryEntry as o, CURRENT_SESSION_VERSION as p, buildSessionContext as r, CompactionEntry as s, ReadonlySessionManager as t, formatSqliteSessionFileMarker as u };