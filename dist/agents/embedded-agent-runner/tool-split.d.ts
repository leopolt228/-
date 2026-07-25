import { no as HookContext } from "../../types-Bi5Leigi.js";
import { l as AgentTool } from "../../types-Dedz4oTJ.js";
import { s as ToolDefinition } from "../../index-DTRqLAuB.js";

//#region src/agents/agent-tool-definition-adapter.d.ts
type AnyAgentTool$1 = AgentTool;
/** Convert executable agent tools into session definitions with hook handling. */
declare function toToolDefinitions(tools: AnyAgentTool$1[], hookContext?: HookContext): ToolDefinition[];
//#endregion
//#region src/agents/embedded-agent-runner/tool-split.d.ts
type AnyAgentTool = AgentTool;
declare function splitSdkTools(options: {
  tools: AnyAgentTool[];
  sandboxEnabled: boolean;
  toolHookContext?: HookContext;
}): {
  customTools: ReturnType<typeof toToolDefinitions>;
};
//#endregion
export { splitSdkTools };