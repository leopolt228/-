// packages/media-understanding-common/src/errors.ts
var MediaUnderstandingSkipError = class extends Error {
  constructor(reason, message) {
    super(message);
    this.reason = reason;
    this.name = "MediaUnderstandingSkipError";
  }
};
function isMediaUnderstandingSkipError(err) {
  return err instanceof MediaUnderstandingSkipError;
}
export {
  MediaUnderstandingSkipError,
  isMediaUnderstandingSkipError
};
