//#region src/infra/node-commands.ts
const NODE_SYSTEM_RUN_COMMANDS = [
	"system.run.prepare",
	"system.run",
	"system.which"
];
const NODE_SYSTEM_NOTIFY_COMMAND = "system.notify";
const NODE_FS_LIST_DIR_COMMAND = "fs.listDir";
const NODE_TERMINAL_UPLOAD_COMMAND = "terminal.upload";
const NODE_FILE_COMMANDS = [NODE_FS_LIST_DIR_COMMAND, NODE_TERMINAL_UPLOAD_COMMAND];
const NODE_BROWSER_PROXY_COMMAND = "browser.proxy";
const NODE_MCP_TOOLS_CALL_COMMAND = "mcp.tools.call.v1";
const NODE_AGENT_CLI_CLAUDE_RUN_COMMAND = "agent.cli.claude.run.v1";
const NODE_DEVICE_APPS_COMMAND = "device.apps";
const NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS = 3e4;
const NODE_EXEC_APPROVALS_COMMANDS = ["system.execApprovals.get", "system.execApprovals.set"];
const NODE_ADMIN_ONLY_INVOKE_COMMAND_SET = /* @__PURE__ */ new Set([
	NODE_BROWSER_PROXY_COMMAND,
	NODE_FS_LIST_DIR_COMMAND,
	NODE_TERMINAL_UPLOAD_COMMAND
]);
/** Returns true when direct node invocation crosses an admin-only host boundary. */
function isAdminOnlyNodeInvokeCommand(command) {
	return typeof command === "string" && NODE_ADMIN_ONLY_INVOKE_COMMAND_SET.has(command);
}
const NODE_MCP_TOOL_CALL_TIMEOUT_MS = 12e4;
const NODE_MCP_TOOL_CALL_GATEWAY_TIMEOUT_MS = 125e3;
//#endregion
export { NODE_EXEC_APPROVALS_COMMANDS as a, NODE_MCP_TOOLS_CALL_COMMAND as c, NODE_SYSTEM_NOTIFY_COMMAND as d, NODE_SYSTEM_RUN_COMMANDS as f, NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS as i, NODE_MCP_TOOL_CALL_GATEWAY_TIMEOUT_MS as l, isAdminOnlyNodeInvokeCommand as m, NODE_BROWSER_PROXY_COMMAND as n, NODE_FILE_COMMANDS as o, NODE_TERMINAL_UPLOAD_COMMAND as p, NODE_DEVICE_APPS_COMMAND as r, NODE_FS_LIST_DIR_COMMAND as s, NODE_AGENT_CLI_CLAUDE_RUN_COMMAND as t, NODE_MCP_TOOL_CALL_TIMEOUT_MS as u };
