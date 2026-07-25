import { a as openRootFile, i as matchRootFileOpenFailure, n as RootFileOpenResult, o as openRootFileSync, r as canUseRootFileOpen, t as RootFileOpenFailure } from "../root-file-CHsiWjWZ.js";

//#region src/infra/boundary-file-read.d.ts
/** Read a pinned descriptor without changing OpenClaw's user-facing overflow error. */
declare function readFileDescriptorBounded(fd: number, maxBytes: number): Promise<Buffer>;
/** Synchronous variant for callers that own a pinned descriptor. */
declare function readFileDescriptorBoundedSync(fd: number, maxBytes: number): Buffer;
//#endregion
export { type RootFileOpenFailure, type RootFileOpenResult, canUseRootFileOpen, matchRootFileOpenFailure, openRootFile, openRootFileSync, readFileDescriptorBounded, readFileDescriptorBoundedSync };