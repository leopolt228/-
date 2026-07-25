import { n as FileStoreSync } from "./file-store-BeHCpy1e.js";
import fs from "node:fs";
import fs$1 from "node:fs/promises";

//#region node_modules/@openclaw/fs-safe/dist/root-paths.d.ts
type InvalidPathResult = {
  ok: false;
  error: string;
};
type ResolvePathsWithinRootParams = {
  rootDir: string;
  requestedPaths: string[];
  scopeLabel: string;
};
type ResolvePathsWithinRootResult = {
  ok: true;
  paths: string[];
} | InvalidPathResult;
type PathScopeResolveOptions = {
  defaultName?: string;
};
type PathScopeOptions = {
  label: string;
};
type PathScope = {
  rootDir: string;
  label: string;
  resolve(requestedPath: string, options?: PathScopeResolveOptions): {
    ok: true;
    path: string;
  } | {
    ok: false;
    error: string;
  };
  resolveAll(requestedPaths: string[]): ResolvePathsWithinRootResult;
  existing(requestedPaths: string[]): Promise<ResolvePathsWithinRootResult>;
  files(requestedPaths: string[]): Promise<ResolvePathsWithinRootResult>;
  writable(requestedPath: string, options?: PathScopeResolveOptions): Promise<{
    ok: true;
    path: string;
  } | {
    ok: false;
    error: string;
  }>;
  ensureDir(requestedPath: string, options?: PathScopeResolveOptions & {
    mode?: number;
  }): Promise<{
    ok: true;
    path: string;
  } | {
    ok: false;
    error: string;
  }>;
};
declare function resolveExistingPathsWithinRoot(params: ResolvePathsWithinRootParams): Promise<ResolvePathsWithinRootResult>;
declare function resolveStrictExistingPathsWithinRoot(params: ResolvePathsWithinRootParams): Promise<ResolvePathsWithinRootResult>;
declare function pathScope(rootDir: string, options: PathScopeOptions): PathScope;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/symlink-parents.d.ts
type AssertNoSymlinkParentsOptions = {
  rootDir: string;
  targetPath: string;
  allowMissing?: boolean;
  allowOutsideRoot?: boolean;
  allowRootChildSymlink?: boolean;
  requireDirectories?: boolean;
  messagePrefix?: string;
};
declare function assertNoSymlinkParents(params: AssertNoSymlinkParentsOptions): Promise<void>;
declare function assertNoSymlinkParentsSync(params: AssertNoSymlinkParentsOptions): void;
//#endregion
//#region src/security/channel-metadata.d.ts
/**
 * Build bounded, externally wrapped channel metadata for prompt context.
 * Channel-provided labels can be user-controlled, so callers must treat this as untrusted content.
 */
declare function buildUntrustedChannelMetadata(params: {
  source: string;
  label: string;
  entries: Array<string | null | undefined>;
  maxChars?: number;
}): string | undefined;
//#endregion
//#region src/security/safe-regex.d.ts
type SafeRegexRejectReason = "empty" | "unsafe-nested-repetition" | "invalid-regex";
type SafeRegexCompileResult = {
  regex: RegExp;
  source: string;
  flags: string;
  reason: null;
} | {
  regex: null;
  source: string;
  flags: string;
  reason: SafeRegexRejectReason;
};
declare function compileSafeRegexDetailed(source: string, flags?: string): SafeRegexCompileResult;
//#endregion
//#region src/infra/private-file-store.d.ts
type PrivateFileStoreSync = FileStoreSync;
/** Create a sync private file store rooted at `rootDir`. */
declare function privateFileStoreSync(rootDir: string): PrivateFileStoreSync;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/replace-file.d.ts
type ReplaceFileAtomicFileSystem = {
  promises: Pick<typeof fs$1, "mkdir" | "chmod" | "writeFile" | "rename" | "copyFile" | "unlink" | "rm" | "open" | "stat" | "lstat">;
};
type ReplaceFileAtomicBaseOptions = {
  filePath: string;
  content: string | Uint8Array;
  dirMode?: number;
  mode?: number;
  preserveExistingMode?: boolean;
  tempPrefix?: string;
  renameMaxRetries?: number;
  renameRetryBaseDelayMs?: number;
  copyFallbackOnPermissionError?: boolean;
  syncTempFile?: boolean;
  syncParentDir?: boolean;
  throwOnCleanupError?: boolean;
};
type ReplaceFileAtomicOptions = ReplaceFileAtomicBaseOptions & {
  fileSystem?: ReplaceFileAtomicFileSystem;
  beforeRename?: (params: {
    filePath: string;
    tempPath: string;
  }) => Promise<void>;
};
type ReplaceFileAtomicResult = {
  method: "rename" | "copy-fallback";
};
declare function replaceFileAtomic$1(options: ReplaceFileAtomicOptions): Promise<ReplaceFileAtomicResult>;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/move-path.d.ts
type MovePathWithCopyFallbackOptions$1 = {
  from: string;
  sourceHardlinks?: "allow" | "reject";
  to: string;
};
//#endregion
//#region src/infra/replace-file.d.ts
/** Atomic file replacement primitive re-exported through the fs-safe defaults shim. */
declare const replaceFileAtomic: typeof replaceFileAtomic$1;
/** Options for moving paths while optionally rejecting hardlinked source files. */
type MovePathWithCopyFallbackOptions = MovePathWithCopyFallbackOptions$1 & {
  sourceHardlinks?: "allow" | "reject";
};
/**
 * Moves a path using fs-safe's copy fallback, with an OpenClaw hardlink guard
 * for install/update flows that must not preserve package-manager links.
 */
declare function movePathWithCopyFallback(options: MovePathWithCopyFallbackOptions): Promise<void>;
//#endregion
//#region src/security/secret-equal.d.ts
/** Compare two optional UTF-8 secrets without leaking length through timingSafeEqual errors. */
declare function safeEqualSecret(provided: string | undefined | null, expected: string | undefined | null): boolean;
//#endregion
//#region src/plugin-sdk/security-runtime.d.ts
/**
 * @deprecated Broad public SDK barrel. Prefer focused security/SSRF/secret
 * subpaths and avoid adding new imports here.
 */
/** Return whether a path resolves to a regular file, treating filesystem errors as missing. */
declare function fileExists(filePath: string): boolean;
//#endregion
export { privateFileStoreSync as a, buildUntrustedChannelMetadata as c, pathScope as d, resolveExistingPathsWithinRoot as f, replaceFileAtomic as i, assertNoSymlinkParents as l, safeEqualSecret as n, SafeRegexRejectReason as o, resolveStrictExistingPathsWithinRoot as p, movePathWithCopyFallback as r, compileSafeRegexDetailed as s, fileExists as t, assertNoSymlinkParentsSync as u };