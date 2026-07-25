import { h as redactSensitiveArgv } from "./io.audit-ChVTQVyd.js";
import { n as toMcpEnvRecord, r as toMcpStringArray, t as isMcpConfigRecord } from "./mcp-config-shared-DHNeNaPb.js";
//#region src/agents/mcp-stdio.ts
/**
* Stdio MCP launch config normalization.
* Accepts OpenClaw and upstream MCP config field names, keeping only
* command/args/env/cwd needed to spawn a stdio server.
*/
/** Resolve raw MCP server config into a stdio launch config. */
function resolveStdioMcpServerLaunchConfig(raw, options) {
	if (!isMcpConfigRecord(raw)) return {
		ok: false,
		reason: "server config must be an object"
	};
	if (typeof raw.command !== "string" || raw.command.trim().length === 0) {
		if (typeof raw.url === "string" && raw.url.trim().length > 0) return {
			ok: false,
			reason: "not a stdio server (has url)"
		};
		return {
			ok: false,
			reason: "its command is missing"
		};
	}
	const cwd = typeof raw.cwd === "string" && raw.cwd.trim().length > 0 ? raw.cwd : typeof raw.workingDirectory === "string" && raw.workingDirectory.trim().length > 0 ? raw.workingDirectory : void 0;
	return {
		ok: true,
		config: {
			command: raw.command,
			args: toMcpStringArray(raw.args),
			env: toMcpEnvRecord(raw.env, { onDroppedEntry: options?.onDroppedEnv }),
			cwd
		}
	};
}
/** Describe a stdio MCP launch config for diagnostics. */
function describeStdioMcpServerLaunchConfig(config) {
	const redactedArgs = Array.isArray(config.args) ? redactSensitiveArgv(config.args) : [];
	const args = redactedArgs.length > 0 ? ` ${redactedArgs.join(" ")}` : "";
	const cwd = config.cwd ? ` (cwd=${config.cwd})` : "";
	return `${config.command}${args}${cwd}`;
}
//#endregion
export { resolveStdioMcpServerLaunchConfig as n, describeStdioMcpServerLaunchConfig as t };
