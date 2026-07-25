// packages/agent-core/src/errors.ts
var TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE = "openclaw_transcript_not_continuable";
var TranscriptNotContinuableError = class extends Error {
  constructor(role) {
    super(`Cannot continue from message role: ${role}`);
    this.code = TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE;
    this.name = "TranscriptNotContinuableError";
    this.role = role;
  }
};
export {
  TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE,
  TranscriptNotContinuableError
};
