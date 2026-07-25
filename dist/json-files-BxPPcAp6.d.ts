import { t as RootFileOpenFailure } from "./root-file-CHsiWjWZ.js";
import fs from "node:fs";

//#region node_modules/@openclaw/fs-safe/dist/text-atomic.d.ts
type WriteTextAtomicOptions$1 = {
  mode?: number;
  dirMode?: number;
  trailingNewline?: boolean;
  /**
   * When false, skip the temp-file and parent-directory fsync calls while
   * preserving the temp-file replace/rename behavior.
   *
   * Defaults to true.
   */
  durable?: boolean;
};
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/json.d.ts
type ReadJsonOptions = {
  maxBytes?: number;
};
declare function tryReadJsonSync<T = unknown>(pathname: string, options?: ReadJsonOptions): T | null;
declare function writeJsonSync(pathname: string, data: unknown): void;
declare class JsonFileReadError extends Error {
  readonly filePath: string;
  readonly reason: "read" | "parse";
  constructor(filePath: string, reason: "read" | "parse", cause: unknown);
}
type RootStructuredFileReadResult<T> = {
  ok: true;
  value: T;
  stat: fs.Stats;
  path: string;
  rootRealPath: string;
} | {
  ok: false;
  reason: "open";
  failure: RootFileOpenFailure;
} | {
  ok: false;
  reason: "invalid" | "parse";
  error: string;
};
type ReadRootStructuredFileSyncOptions<T> = {
  rootDir: string;
  rootRealPath?: string;
  relativePath: string;
  boundaryLabel: string;
  rejectHardlinks?: boolean;
  maxBytes?: number;
  parse: (raw: string) => unknown;
  validate?: (value: unknown) => value is T;
  invalidMessage?: string | ((relativePath: string) => string);
};
type ReadRootJsonSyncOptions = Omit<ReadRootStructuredFileSyncOptions<unknown>, "parse" | "validate" | "invalidMessage">;
declare function readRootStructuredFileSync<T>(options: ReadRootStructuredFileSyncOptions<T>): RootStructuredFileReadResult<T>;
declare function readRootJsonSync<T = unknown>(options: ReadRootJsonSyncOptions): RootStructuredFileReadResult<T>;
declare function readRootJsonObjectSync(options: ReadRootJsonSyncOptions): RootStructuredFileReadResult<Record<string, unknown>>;
declare function tryReadJson<T>(filePath: string, options?: ReadJsonOptions): Promise<T | null>;
declare function readJson<T>(filePath: string, options?: ReadJsonOptions): Promise<T>;
declare function readJsonIfExists<T>(filePath: string, options?: ReadJsonOptions): Promise<T | null>;
declare function readJsonSync<T = unknown>(filePath: string, options?: ReadJsonOptions): T;
type WriteJsonOptions = Pick<WriteTextAtomicOptions$1, "dirMode" | "durable" | "mode" | "trailingNewline">;
declare function writeJson(filePath: string, value: unknown, options?: WriteJsonOptions): Promise<void>;
//#endregion
//#region src/infra/json-files.d.ts
type WriteTextAtomicBeforeRename = (params: {
  filePath: string;
  tempPath: string;
}) => Promise<void>;
type WriteTextAtomicOptions = {
  mode?: number;
  dirMode?: number;
  trailingNewline?: boolean;
  durable?: boolean;
  beforeRename?: WriteTextAtomicBeforeRename;
  /**
   * Prefix for the staged `<prefix>.<pid>.<uuid>.tmp` file. Defaults to the
   * generic `.fs-safe-replace`; pass a target-specific prefix so an orphaned
   * temp (from a crash between write and rename) is identifiable and reclaimable.
   */
  tempPrefix?: string;
};
/** Writes text through the repo atomic replace helper with durable fsync by default. */
declare function writeTextAtomic(filePath: string, content: string, options?: WriteTextAtomicOptions): Promise<void>;
//#endregion
export { readJsonIfExists as a, readRootJsonSync as c, tryReadJsonSync as d, writeJson as f, readJson as i, readRootStructuredFileSync as l, writeTextAtomic as n, readJsonSync as o, writeJsonSync as p, JsonFileReadError as r, readRootJsonObjectSync as s, WriteTextAtomicOptions as t, tryReadJson as u };