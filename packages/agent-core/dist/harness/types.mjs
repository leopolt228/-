// packages/normalization-core/src/result.ts
function ok(value) {
  return { ok: true, value };
}
function err(error) {
  return { ok: false, error };
}

// packages/agent-core/src/harness/types.ts
var CompactionError = class extends Error {
  constructor(code, message, cause) {
    super(message, cause === void 0 ? void 0 : { cause });
    this.name = "CompactionError";
    this.code = code;
  }
};
var BranchSummaryError = class extends Error {
  constructor(code, message, cause) {
    super(message, cause === void 0 ? void 0 : { cause });
    this.name = "BranchSummaryError";
    this.code = code;
  }
};
export {
  BranchSummaryError,
  CompactionError,
  err,
  ok
};
