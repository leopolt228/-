// packages/speech-core/src/runtime-availability.ts
var assertRuntimeAvailable;
function setSpeechRuntimeAvailabilityGuard(guard) {
  assertRuntimeAvailable = guard;
}
function assertSpeechRuntimeAvailable() {
  assertRuntimeAvailable?.();
}
function isSpeechRuntimeAvailable() {
  try {
    assertSpeechRuntimeAvailable();
    return true;
  } catch {
    return false;
  }
}
export {
  assertSpeechRuntimeAvailable,
  isSpeechRuntimeAvailable,
  setSpeechRuntimeAvailabilityGuard
};
