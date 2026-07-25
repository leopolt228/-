//#region src/cli/progress.d.ts
type ProgressOptions = {
  label: string;
  indeterminate?: boolean;
  total?: number;
  enabled?: boolean;
  delayMs?: number;
  stream?: NodeJS.WriteStream;
  fallback?: "spinner" | "line" | "log" | "none";
};
/** Minimal progress API exposed to CLI work callbacks. */
type ProgressReporter = {
  setLabel: (label: string) => void;
  setPercent: (percent: number) => void;
  tick: (delta?: number) => void;
  done: () => void;
};
/** Completed/total progress update shape used by totals-based commands. */
type ProgressTotalsUpdate = {
  completed: number;
  total: number;
  label?: string;
};
/** Run async work with a progress reporter that is always stopped in finally. */
declare function withProgress<T>(options: ProgressOptions, work: (progress: ProgressReporter) => Promise<T>): Promise<T>;
/** Run async work with a progress reporter plus a completed/total update adapter. */
declare function withProgressTotals<T>(options: ProgressOptions, work: (update: (update: ProgressTotalsUpdate) => void, progress: ProgressReporter) => Promise<T>): Promise<T>;
//#endregion
export { withProgressTotals as n, withProgress as t };