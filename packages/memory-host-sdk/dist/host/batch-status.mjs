// packages/memory-host-sdk/src/host/batch-status.ts
var TERMINAL_FAILURE_STATES = /* @__PURE__ */ new Set(["failed", "expired", "cancelled", "canceled"]);
function resolveBatchCompletionFromStatus(params) {
  if (!params.status.output_file_id) {
    throw new Error(`${params.provider} batch ${params.batchId} completed without output file`);
  }
  return {
    outputFileId: params.status.output_file_id,
    errorFileId: params.status.error_file_id ?? void 0
  };
}
async function throwIfBatchCompletionError(params) {
  if (params.status.status !== "completed" || !params.status.error_file_id) {
    return;
  }
  const detail = await params.readError(params.status.error_file_id);
  throw new Error(
    `${params.provider} batch ${params.status.id ?? "<unknown>"} completed: ${detail ?? "provider error file present"}`
  );
}
async function throwIfBatchTerminalFailure(params) {
  const state = params.status.status ?? "unknown";
  if (!TERMINAL_FAILURE_STATES.has(state)) {
    return;
  }
  const detail = params.status.error_file_id ? await params.readError(params.status.error_file_id) : void 0;
  const suffix = detail ? `: ${detail}` : "";
  throw new Error(`${params.provider} batch ${params.status.id ?? "<unknown>"} ${state}${suffix}`);
}
async function resolveCompletedBatchResult(params) {
  const batchId = params.status.id ?? "<unknown>";
  if (!params.wait && params.status.status !== "completed") {
    throw new Error(
      `${params.provider} batch ${batchId} submitted; enable remote.batch.wait to await completion`
    );
  }
  const completed = params.status.status === "completed" ? resolveBatchCompletionFromStatus({
    provider: params.provider,
    batchId,
    status: params.status
  }) : await params.waitForBatch();
  if (!completed.outputFileId) {
    throw new Error(`${params.provider} batch ${batchId} completed without output file`);
  }
  return completed;
}
export {
  resolveBatchCompletionFromStatus,
  resolveCompletedBatchResult,
  throwIfBatchCompletionError,
  throwIfBatchTerminalFailure
};
