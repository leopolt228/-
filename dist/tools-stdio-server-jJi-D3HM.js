import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { a as routeLogsToStderr } from "./console-DvVy2coK.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import { f as coerceChatContentText } from "./sanitize-user-facing-text-sWgeyF-a.js";
import { f as rewrapToolWithBeforeToolCallHook, m as wrapToolWithBeforeToolCallHook } from "./agent-tools.before-tool-call-CvBO0Qc6.js";
import { w as isToolWrappedWithBeforeToolCallHook } from "./gateway-wQ1RjFk5.js";
import { randomUUID } from "node:crypto";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
//#region src/mcp/agent-session-env.ts
const OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV = "OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY";
function resolveToolsMcpAgentSessionKey(env = process.env) {
	return env["OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY"]?.trim() || void 0;
}
//#endregion
//#region src/mcp/plugin-tools-handlers.ts
function toMcpContentBlock(block) {
	if (!isRecord(block)) return {
		type: "text",
		text: coerceChatContentText(block)
	};
	if (block.type !== "image") return block;
	if (typeof block.data === "string" && typeof block.mimeType === "string") return block;
	const source = block.source;
	if (isRecord(source) && source.type === "base64" && typeof source.data === "string" && typeof source.media_type === "string") return {
		type: "image",
		data: source.data,
		mimeType: source.media_type
	};
	return {
		type: "text",
		text: coerceChatContentText(block)
	};
}
function resolveJsonSchemaForTool(tool) {
	const params = tool.parameters;
	if (params && typeof params === "object" && "type" in params) return params;
	return {
		type: "object",
		properties: {}
	};
}
function createPluginToolsMcpHandlers(tools) {
	const wrappedTools = tools.map((tool) => {
		if (isToolWrappedWithBeforeToolCallHook(tool)) return rewrapToolWithBeforeToolCallHook(tool, void 0, { approvalMode: "report" });
		return wrapToolWithBeforeToolCallHook(tool, void 0, { approvalMode: "report" });
	});
	const toolMap = /* @__PURE__ */ new Map();
	for (const tool of wrappedTools) toolMap.set(tool.name, tool);
	return {
		listTools: async () => ({ tools: wrappedTools.map((tool) => ({
			name: tool.name,
			description: tool.description ?? "",
			inputSchema: resolveJsonSchemaForTool(tool)
		})) }),
		callTool: async (params, signal) => {
			const tool = toolMap.get(params.name);
			if (!tool) return {
				content: [{
					type: "text",
					text: `Unknown tool: ${params.name}`
				}],
				isError: true
			};
			try {
				const result = await tool.execute(`mcp-${randomUUID()}`, params.arguments ?? {}, signal);
				const rawContent = result && typeof result === "object" && "content" in result ? result.content : result;
				return { content: Array.isArray(rawContent) ? rawContent.map(toMcpContentBlock) : [{
					type: "text",
					text: coerceChatContentText(rawContent)
				}] };
			} catch (err) {
				return {
					content: [{
						type: "text",
						text: `Tool error: ${formatErrorMessage(err)}`
					}],
					isError: true
				};
			}
		}
	};
}
//#endregion
//#region src/mcp/tools-stdio-server.ts
function createToolsMcpServer(params) {
	const handlers = createPluginToolsMcpHandlers(params.tools);
	const server = new Server({
		name: params.name,
		version: VERSION
	}, { capabilities: { tools: {} } });
	server.setRequestHandler(ListToolsRequestSchema, handlers.listTools);
	server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
		return await handlers.callTool(request.params, extra.signal);
	});
	return server;
}
async function connectToolsMcpServerToStdio(server, options = {}) {
	routeLogsToStderr();
	const transport = new StdioServerTransport();
	let shuttingDown = false;
	let resolveShutdown;
	const shutdownComplete = new Promise((resolve) => {
		resolveShutdown = resolve;
	});
	const shutdown = () => {
		if (shuttingDown) return;
		shuttingDown = true;
		process.stdin.off("end", shutdown);
		process.stdin.off("close", shutdown);
		process.off("SIGINT", shutdown);
		process.off("SIGTERM", shutdown);
		(async () => {
			let shutdownError;
			try {
				await server.close();
			} catch (error) {
				shutdownError = error;
			}
			try {
				await options.onShutdown?.();
			} catch (error) {
				shutdownError ??= error;
			} finally {
				resolveShutdown?.();
			}
			if (shutdownError) process.stderr.write(`MCP stdio shutdown failed: ${formatErrorMessage(shutdownError)}\n`);
		})();
	};
	process.stdin.once("end", shutdown);
	process.stdin.once("close", shutdown);
	process.once("SIGINT", shutdown);
	process.once("SIGTERM", shutdown);
	await server.connect(transport);
	if (options.onShutdown) await shutdownComplete;
}
//#endregion
export { resolveToolsMcpAgentSessionKey as i, createToolsMcpServer as n, OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV as r, connectToolsMcpServerToStdio as t };
