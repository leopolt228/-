import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { r as DetachedTaskTerminalState } from "./detached-task-runtime-contract-CvurBpz7.js";
import { t as getAcpSessionManager } from "./manager-BpVH9RyR.js";
import { r as cancelActiveCronTaskRun, t as cancelBackgroundExecSession } from "./bash-process-control-Wej9_f4I.js";
//#region src/agents/subagent-control.d.ts
type SubagentKillTargetState = {
  state: "finalizing";
} | {
  state: "terminal";
  task: DetachedTaskTerminalState;
};
/** Kills every currently controlled child run and its descendants. */
/** Admin kill path for a subagent session key, bypassing caller ownership checks. */
declare function killSubagentRunAdmin(params: {
  cfg: OpenClawConfig;
  sessionKey: string;
}): Promise<{
  found: false;
  killed: boolean;
} | {
  runId: string;
  sessionKey: string;
  cascadeKilled: number;
  cascadeLabels: string[] | undefined;
  targetState?: SubagentKillTargetState | undefined;
  found: true;
  killed: boolean;
}>;
//#endregion
export { cancelActiveCronTaskRun, cancelBackgroundExecSession, getAcpSessionManager, killSubagentRunAdmin };