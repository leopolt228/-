import "../runtime-DVfm4UUr.js";
//#region src/commitments/runtime.test-support.ts
function getTestApi() {
	const api = globalThis[Symbol.for("openclaw.commitmentRuntimeTestApi")];
	if (!api) throw new Error("commitment runtime test API is unavailable");
	return api;
}
function configureCommitmentExtractionRuntime(next) {
	getTestApi().configureCommitmentExtractionRuntime(next);
}
async function drainCommitmentExtractionQueue() {
	return await getTestApi().drainCommitmentExtractionQueue();
}
function resetCommitmentExtractionRuntimeForTests() {
	getTestApi().resetCommitmentExtractionRuntimeForTests();
}
//#endregion
export { configureCommitmentExtractionRuntime, drainCommitmentExtractionQueue, resetCommitmentExtractionRuntimeForTests };
