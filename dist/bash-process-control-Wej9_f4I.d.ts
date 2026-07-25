//#region src/cron/service/active-run-cancellation.d.ts
declare function abortActiveCronTaskRuns(reason?: string): number;
/** Retires restart-drain bookkeeping without hiding still-running cores from suspension. */
declare function retireActiveCronTaskRunTracking(): void;
declare function waitForActiveCronTaskRuns(timeoutMs: number): Promise<{
  drained: boolean;
  active: number;
}>;
declare function cancelActiveCronTaskRun(params: {
  runId: string | undefined;
  reason?: string;
}): boolean;
//#endregion
//#region src/agents/bash-process-control.d.ts
declare function cancelBackgroundExecSession(sessionId: string): boolean;
//#endregion
export { waitForActiveCronTaskRuns as a, retireActiveCronTaskRunTracking as i, abortActiveCronTaskRuns as n, cancelActiveCronTaskRun as r, cancelBackgroundExecSession as t };