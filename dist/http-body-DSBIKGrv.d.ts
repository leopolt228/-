import { IncomingMessage, ServerResponse } from "node:http";

//#region src/infra/http-body.d.ts
declare const DEFAULT_WEBHOOK_MAX_BODY_BYTES: number;
declare const DEFAULT_WEBHOOK_BODY_TIMEOUT_MS = 30000;
type RequestBodyLimitErrorCode = "PAYLOAD_TOO_LARGE" | "REQUEST_BODY_TIMEOUT" | "CONNECTION_CLOSED";
type RequestBodyLimitErrorInit = {
  code: RequestBodyLimitErrorCode;
  message?: string;
};
declare class RequestBodyLimitError extends Error {
  readonly code: RequestBodyLimitErrorCode;
  readonly statusCode: number;
  constructor(init: RequestBodyLimitErrorInit);
}
declare function isRequestBodyLimitError(error: unknown, code?: RequestBodyLimitErrorCode): error is RequestBodyLimitError;
declare function requestBodyErrorToText(code: RequestBodyLimitErrorCode): string;
type ReadRequestBodyOptions = {
  maxBytes: number;
  timeoutMs?: number;
  encoding?: BufferEncoding;
};
type RequestBodyLimitValues = {
  maxBytes: number;
  timeoutMs: number;
};
declare function resolveRequestBodyLimitValues(options: {
  maxBytes: number;
  timeoutMs?: number;
}): RequestBodyLimitValues;
declare const testApi: {
  resolveRequestBodyLimitValues: typeof resolveRequestBodyLimitValues;
};
type ReadResponseTextPrefixOptions = {
  chunkTimeoutMs?: number;
  onIdleTimeout?: (params: {
    chunkTimeoutMs: number;
  }) => Error; /** Static timeout or lazy resolver evaluated immediately before body consumption. */
  timeoutMs?: number | (() => number);
  onTimeout?: (params: {
    timeoutMs: number;
  }) => Error;
};
type ReadResponseTextPrefixResult = {
  text: string;
  size: number;
  truncated: boolean;
};
/** Reads and decodes a bounded text prefix while cancelling unread overflow. */
declare function readResponseTextPrefix(response: Response, maxBytes: number, options?: ReadResponseTextPrefixOptions): Promise<ReadResponseTextPrefixResult>;
/** Reads a response body under byte, idle, and overall timeout bounds. */
declare function readResponseWithLimit(response: Response, maxBytes: number, options?: ReadResponseTextPrefixOptions & {
  onOverflow?: (params: {
    size: number;
    maxBytes: number;
    res: Response;
  }) => Error;
}): Promise<Buffer>;
/** Reads a small collapsed text prefix from a response body for diagnostics/errors. */
declare function readResponseTextSnippet(response: Response, options?: ReadResponseTextPrefixOptions & {
  maxBytes?: number;
  maxChars?: number;
}): Promise<string | undefined>;
declare function readRequestBodyWithLimit(req: IncomingMessage, options: ReadRequestBodyOptions): Promise<string>;
type ReadJsonBodyResult = {
  ok: true;
  value: unknown;
} | {
  ok: false;
  error: string;
  code: RequestBodyLimitErrorCode | "INVALID_JSON";
};
type ReadJsonBodyOptions = ReadRequestBodyOptions & {
  emptyObjectOnEmpty?: boolean;
};
declare function readJsonBodyWithLimit(req: IncomingMessage, options: ReadJsonBodyOptions): Promise<ReadJsonBodyResult>;
type RequestBodyLimitGuard = {
  dispose: () => void;
  isTripped: () => boolean;
  code: () => RequestBodyLimitErrorCode | null;
};
type RequestBodyLimitGuardOptions = {
  maxBytes: number;
  timeoutMs?: number;
  responseFormat?: "json" | "text";
  responseText?: Partial<Record<RequestBodyLimitErrorCode, string>>;
};
declare function installRequestBodyLimitGuard(req: IncomingMessage, res: ServerResponse, options: RequestBodyLimitGuardOptions): RequestBodyLimitGuard;
//#endregion
export { readResponseTextSnippet as _, ReadRequestBodyOptions as a, testApi as b, RequestBodyLimitError as c, RequestBodyLimitGuardOptions as d, installRequestBodyLimitGuard as f, readResponseTextPrefix as g, readRequestBodyWithLimit as h, ReadJsonBodyResult as i, RequestBodyLimitErrorCode as l, readJsonBodyWithLimit as m, DEFAULT_WEBHOOK_MAX_BODY_BYTES as n, ReadResponseTextPrefixOptions as o, isRequestBodyLimitError as p, ReadJsonBodyOptions as r, ReadResponseTextPrefixResult as s, DEFAULT_WEBHOOK_BODY_TIMEOUT_MS as t, RequestBodyLimitGuard as u, readResponseWithLimit as v, requestBodyErrorToText as y };