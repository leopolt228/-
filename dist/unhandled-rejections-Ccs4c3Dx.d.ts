//#region src/infra/abort-signal.d.ts
/** Resolves when the signal aborts, or immediately when no wait is needed. */
declare function waitForAbortSignal(signal?: AbortSignal): Promise<void>;
//#endregion
//#region src/infra/unhandled-rejections.d.ts
type UnhandledRejectionHandler = (reason: unknown) => boolean;
type UncaughtExceptionHandler = (error: unknown) => boolean;
/**
 * Checks if an error is a transient network error that shouldn't crash the gateway.
 * These are typically temporary connectivity issues that will resolve on their own.
 */
declare function registerUnhandledRejectionHandler(handler: UnhandledRejectionHandler): () => void;
declare function registerUncaughtExceptionHandler(handler: UncaughtExceptionHandler): () => void;
//#endregion
export { registerUnhandledRejectionHandler as n, waitForAbortSignal as r, registerUncaughtExceptionHandler as t };