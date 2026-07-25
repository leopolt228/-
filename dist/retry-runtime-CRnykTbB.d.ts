//#region src/infra/retry-after.d.ts
/** Parses an RFC Retry-After header as delay seconds or any valid HTTP-date form. */
declare function parseRetryAfterHeaderSeconds(value: string | null | undefined, now?: number): number | undefined;
//#endregion
export { parseRetryAfterHeaderSeconds as t };