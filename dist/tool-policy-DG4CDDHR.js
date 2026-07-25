import { m as normalizeToolName } from "./tool-policy-GYMCyycR.js";
//#region src/agents/cli-runner/tool-policy.ts
/** Transport prefix CLI harnesses use for loopback OpenClaw MCP tool names. */
const OPENCLAW_MCP_TOOL_PREFIX = "mcp__openclaw__";
/** Strips the loopback MCP transport prefix so observers see gateway tool names. */
function stripOpenClawMcpToolPrefix(toolName) {
	return toolName.startsWith("mcp__openclaw__") ? toolName.slice(15) : toolName;
}
/**
* Derives the loopback MCP grant allowlist from a selectable-backend MCP
* permission list. Wildcards keep the full session-scoped surface; entries for
* other MCP servers are not loopback-governed and drop out. A non-wildcard
* list that leaves no loopback names fails closed (empty allowlist).
*/
function resolveLoopbackToolsAllowFromMcpPermissions(mcp) {
	if (!mcp) return;
	const names = /* @__PURE__ */ new Set();
	for (const entry of mcp) {
		const trimmed = entry.trim();
		if (!trimmed) continue;
		if (trimmed === "*" || trimmed === `mcp__openclaw__*`) return;
		if (trimmed.startsWith("mcp__") && !trimmed.startsWith("mcp__openclaw__")) continue;
		const name = normalizeToolName(stripOpenClawMcpToolPrefix(trimmed));
		if (name) names.add(name);
	}
	return [...names];
}
/** CLI backends cannot enforce runtime caps; keep only real restrictions. */
function resolveCliRuntimeToolsAllow(toolsAllow, toolsAllowIsDefault) {
	if (toolsAllow === void 0 || toolsAllowIsDefault) return;
	return toolsAllow.some((toolName) => normalizeToolName(toolName) === "*") ? void 0 : toolsAllow;
}
//#endregion
export { stripOpenClawMcpToolPrefix as i, resolveCliRuntimeToolsAllow as n, resolveLoopbackToolsAllowFromMcpPermissions as r, OPENCLAW_MCP_TOOL_PREFIX as t };
