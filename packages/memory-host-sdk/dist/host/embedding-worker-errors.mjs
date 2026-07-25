// packages/memory-host-sdk/src/host/embedding-worker-errors.ts
var LOCAL_EMBEDDING_WORKER_ERROR_CODES = {
  exited: "LOCAL_EMBEDDING_WORKER_EXITED",
  processError: "LOCAL_EMBEDDING_WORKER_PROCESS_ERROR",
  ipcError: "LOCAL_EMBEDDING_WORKER_IPC_ERROR"
};
function createLocalEmbeddingWorkerFailureError(params) {
  return Object.assign(new Error(params.message), {
    code: params.code,
    reason: params.reason,
    ...params.exitCode !== void 0 ? { exitCode: params.exitCode } : {},
    ...params.signal !== void 0 ? { signal: params.signal } : {},
    ...params.cause !== void 0 ? { cause: params.cause } : {}
  });
}
export {
  LOCAL_EMBEDDING_WORKER_ERROR_CODES,
  createLocalEmbeddingWorkerFailureError
};
