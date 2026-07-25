import { k as SystemAgentOperation } from "./types-CzbSjEqY.js";
//#region src/agents/tools/system-agent-tool.d.ts
type SystemAgentToolOptions = {
  /** Where setup side effects run; the gateway surface never manages its own daemon. */surface: "cli" | "gateway";
  /**
   * Host-verified consent for THIS turn: true only when the host judged the
   * user's actual message to be an explicit approval. The model-supplied
   * `approved` argument alone must never authorize a mutation (prompt
   * injection, model error).
   */
  approvalArmed?: boolean;
  /**
   * Approval is scoped to one exact operation: a denied mutating call records
   * its canonical hash here (host-owned, survives turns), and an armed turn
   * may execute only a call matching that hash. Cleared after use.
   */
  proposalRef?: {
    current?: string;
    operation?: SystemAgentOperation;
  };
  /**
   * Host handoff channel for actions the tool cannot perform itself
   * (interactive channel setup, external onboarding guidance, opening the
   * agent TUI). The engine reads it after the turn; CLI MCP hosts mirror it
   * from tool events.
   */
  directiveRef?: {
    current?: SystemAgentToolDirective;
  };
};
/** Host directives the hosting chat engine handles after the turn. */
type SystemAgentToolDirective = {
  kind: "channel-setup";
  channel: string;
} | {
  kind: "model-setup";
  workspace?: string;
} | {
  kind: "open-tui";
  agentId?: string;
  workspace?: string;
} | Extract<SystemAgentOperation, {
  kind: "open-setup";
}> | {
  kind: "approved-operation";
  operation: SystemAgentOperation;
};
//#endregion
export { SystemAgentToolOptions as t };