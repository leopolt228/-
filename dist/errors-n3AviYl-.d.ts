//#region node_modules/@openclaw/fs-safe/dist/errors.d.ts
type FsSafeErrorCode = "already-exists" | "denied-path" | "device-path" | "hardlink" | "helper-failed" | "helper-unavailable" | "invalid-path" | "insecure-permissions" | "not-empty" | "not-file" | "not-found" | "not-owned" | "not-removable" | "outside-workspace" | "path-alias" | "path-mismatch" | "permission-unverified" | "symlink" | "timeout" | "too-large" | "unsupported-platform";
type FsSafeErrorCategory = "policy" | "operational";
declare class FsSafeError extends Error {
  readonly code: FsSafeErrorCode;
  readonly category: FsSafeErrorCategory;
  constructor(code: FsSafeErrorCode, message: string, options?: {
    cause?: unknown;
  });
}
//#endregion
export { FsSafeErrorCode as n, FsSafeError as t };