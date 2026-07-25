import { i as OpenClawConfig } from "../types.openclaw-DAPZkTyD.js";
import { no as HookContext } from "../types-Bi5Leigi.js";
import { n as AnyAgentTool } from "../common-B6rw6aZ3.js";
import { i as ToolSearchCatalogToolExecutor, n as createOpenClawCodingTools, r as ToolSearchCatalogRef } from "../agent-harness-DuPK-pHe.js";

//#region src/agents/harness/tool-surface-bridge.d.ts
type AgentHarnessToolSurfaceRuntime$1 = {
  codeModeControlsEnabled: boolean;
  compactTools: (tools: AnyAgentTool[], options?: {
    hookContext?: HookContext;
    localModelLeanApplied?: boolean;
  }) => {
    tools: AnyAgentTool[];
  };
  config: OpenClawConfig | undefined;
  includeToolSearchControls: boolean;
  runtimeToolAllowlist: string[] | undefined;
  toolSearchCatalogRef: ToolSearchCatalogRef | undefined;
  toolSearchControlsEnabled: boolean;
  cleanup: () => void;
  toolSearchCatalogExecutor: ToolSearchCatalogToolExecutor | undefined;
};
declare function createAgentHarnessToolSurfaceRuntime$1(params: {
  abortSignal?: AbortSignal;
  agentId?: string;
  config?: OpenClawConfig;
  disableTools?: boolean;
  executeTool: ToolSearchCatalogToolExecutor;
  forceMessageTool?: boolean;
  isRawModelRun?: boolean;
  modelId?: string;
  modelProvider?: string;
  modelToolsEnabled: boolean;
  prompt?: string;
  runId?: string;
  runtimeToolAllowlist?: readonly string[];
  sessionId?: string;
  sessionKey?: string;
  sourceReplyDeliveryMode?: string;
  toolsAllow?: readonly string[];
}): AgentHarnessToolSurfaceRuntime$1;
//#endregion
//#region src/plugin-sdk/agent-harness-tool-runtime.d.ts
type OpenClawCodingToolsOptions = NonNullable<Parameters<typeof createOpenClawCodingTools>[0]>;
type AgentHarnessToolSurfaceRuntime = Omit<AgentHarnessToolSurfaceRuntime$1, "toolSearchCatalogExecutor" | "toolSearchCatalogRef"> & {
  toolSearchCatalogExecutor: OpenClawCodingToolsOptions["toolSearchCatalogExecutor"];
  toolSearchCatalogRef: OpenClawCodingToolsOptions["toolSearchCatalogRef"];
};
type AgentHarnessToolSurfaceRuntimeParams = Omit<Parameters<typeof createAgentHarnessToolSurfaceRuntime$1>[0], "executeTool"> & {
  executeTool: NonNullable<OpenClawCodingToolsOptions["toolSearchCatalogExecutor"]>;
};
declare function createAgentHarnessToolSurfaceRuntime(params: AgentHarnessToolSurfaceRuntimeParams): AgentHarnessToolSurfaceRuntime;
//#endregion
export { AgentHarnessToolSurfaceRuntime, AgentHarnessToolSurfaceRuntimeParams, createAgentHarnessToolSurfaceRuntime };