//#region src/cron/public-job.ts
/** Remove scheduler-only state before a cron job crosses a public API boundary. */
function toPublicCronJob(job) {
	const state = { ...job.state };
	delete state.queuedAtMs;
	delete state.startupCatchupAtMs;
	delete state.pacedNextRunAtMs;
	delete state.forcePreservedNextRunAtMs;
	return {
		...job,
		state
	};
}
//#endregion
export { toPublicCronJob as t };
