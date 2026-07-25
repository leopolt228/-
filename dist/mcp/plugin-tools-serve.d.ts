import { i as OpenClawConfig } from "../types.openclaw-DAPZkTyD.js";
import { n as AnyAgentTool } from "../common-B6rw6aZ3.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

//#region src/mcp/plugin-tools-serve.d.ts
declare function resolvePluginToolsForMcp(params: {
  config: OpenClawConfig;
  agentSessionKey?: string;
}): AnyAgentTool[];
declare function createPluginToolsMcpServer(params?: {
  config?: OpenClawConfig;
  tools?: AnyAgentTool[];
  agentSessionKey?: string;
}): Server;
declare function servePluginToolsMcp(): Promise<void>;
//#endregion
export { createPluginToolsMcpServer, resolvePluginToolsForMcp, servePluginToolsMcp };