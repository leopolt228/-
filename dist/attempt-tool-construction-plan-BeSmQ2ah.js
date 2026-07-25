import { f as expandToolGroups, m as normalizeToolName, o as expandPolicyWithPluginGroups, p as normalizeToolList, r as buildPluginToolGroups } from "./tool-policy-GYMCyycR.js";
import { n as isToolAllowedByPolicyName } from "./tool-policy-match-gf5E9Psx.js";
//#region src/agents/core-tool-factory-descriptors.ts
const CORE_TOOL_FACTORY_FAMILY_BY_NAME = new Map([
	{
		name: "edit",
		family: "base-coding"
	},
	{
		name: "read",
		family: "base-coding"
	},
	{
		name: "write",
		family: "base-coding"
	},
	{
		name: "apply_patch",
		family: "shell"
	},
	{
		name: "exec",
		family: "shell"
	},
	{
		name: "process",
		family: "shell"
	},
	{
		name: "agents_list",
		family: "openclaw"
	},
	{
		name: "agents_wait",
		family: "openclaw"
	},
	{
		name: "ask_user",
		family: "openclaw"
	},
	{
		name: "openclaw",
		family: "openclaw"
	},
	{
		name: "computer",
		family: "openclaw"
	},
	{
		name: "conversations_list",
		family: "openclaw"
	},
	{
		name: "conversations_send",
		family: "openclaw"
	},
	{
		name: "conversations_turn",
		family: "openclaw"
	},
	{
		name: "cron",
		family: "openclaw"
	},
	{
		name: "dashboard",
		family: "openclaw"
	},
	{
		name: "gateway",
		family: "openclaw"
	},
	{
		name: "get_goal",
		family: "openclaw"
	},
	{
		name: "heartbeat_respond",
		family: "openclaw"
	},
	{
		name: "image",
		family: "openclaw"
	},
	{
		name: "image_generate",
		family: "openclaw"
	},
	{
		name: "message",
		family: "openclaw"
	},
	{
		name: "music_generate",
		family: "openclaw"
	},
	{
		name: "nodes",
		family: "openclaw"
	},
	{
		name: "pdf",
		family: "openclaw"
	},
	{
		name: "session_status",
		family: "openclaw"
	},
	{
		name: "show_widget",
		family: "openclaw"
	},
	{
		name: "sessions",
		family: "openclaw"
	},
	{
		name: "sessions_history",
		family: "openclaw"
	},
	{
		name: "sessions_list",
		family: "openclaw"
	},
	{
		name: "sessions_search",
		family: "openclaw"
	},
	{
		name: "sessions_send",
		family: "openclaw"
	},
	{
		name: "sessions_spawn",
		family: "openclaw"
	},
	{
		name: "sessions_yield",
		family: "openclaw"
	},
	{
		name: "structured_output",
		family: "openclaw"
	},
	{
		name: "skill_workshop",
		family: "openclaw"
	},
	{
		name: "spawn_task",
		family: "openclaw"
	},
	{
		name: "create_goal",
		family: "openclaw"
	},
	{
		name: "subagents",
		family: "openclaw"
	},
	{
		name: "terminal",
		family: "openclaw"
	},
	{
		name: "transcripts",
		family: "openclaw"
	},
	{
		name: "tts",
		family: "openclaw"
	},
	{
		name: "update_goal",
		family: "openclaw"
	},
	{
		name: "update_plan",
		family: "openclaw"
	},
	{
		name: "dismiss_task",
		family: "openclaw"
	},
	{
		name: "video_generate",
		family: "openclaw"
	},
	{
		name: "web_fetch",
		family: "openclaw"
	},
	{
		name: "web_search",
		family: "openclaw"
	}
].map(({ name, family }) => [name, family]));
function resolveCoreToolFactoryFamily(name) {
	return CORE_TOOL_FACTORY_FAMILY_BY_NAME.get(name);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-tool-construction-plan.ts
/**
* Plans which core, bundle MCP, and bundle LSP tools an attempt should build.
*/
const ALL_CODING_TOOL_CONSTRUCTION_PLAN = {
	includeBaseCodingTools: true,
	includeShellTools: true,
	includeChannelTools: true,
	includeOpenClawTools: true,
	includePluginTools: true
};
const NO_CODING_TOOL_CONSTRUCTION_PLAN = {
	includeBaseCodingTools: false,
	includeShellTools: false,
	includeChannelTools: false,
	includeOpenClawTools: false,
	includePluginTools: false
};
function cloneCodingToolConstructionPlan(plan) {
	return { ...plan };
}
function isBundleMcpAllowlistName(normalized) {
	return normalized === "bundle-mcp" || normalized.includes("__");
}
function isPluginGroupAllowlistName(normalized) {
	return normalized === "group:plugins";
}
function hasWildcardToolAllowlist(toolsAllow) {
	return toolsAllow.some((entry) => normalizeToolName(entry) === "*");
}
/**
* Applies a runtime allowlist to a concrete tool list after expanding tool and
* plugin groups. Undefined allowlists keep all tools; an explicit empty list
* intentionally disables all runtime tools.
*/
function applyEmbeddedAttemptToolsAllow(tools, toolsAllow, options) {
	if (!toolsAllow) return tools;
	if (toolsAllow.length === 0) return [];
	if (hasWildcardToolAllowlist(toolsAllow)) return tools;
	const pluginGroups = options?.toolMeta ? buildPluginToolGroups({
		tools,
		toolMeta: options.toolMeta
	}) : void 0;
	const policy = pluginGroups ? expandPolicyWithPluginGroups({ allow: toolsAllow }, pluginGroups) : { allow: toolsAllow };
	return tools.filter((tool) => isToolAllowedByPolicyName(tool.name, policy));
}
/**
* Adds host-required tools to a narrowed runtime allowlist. Wildcard and
* undefined allowlists already cover every required tool.
*/
function mergeForcedEmbeddedAttemptToolsAllow(toolsAllow, params) {
	if (toolsAllow === void 0 || hasWildcardToolAllowlist(toolsAllow)) return toolsAllow;
	const required = [...params.forceMessageTool ? ["message"] : [], ...params.forceToolNames ?? []];
	if (required.length === 0) return toolsAllow;
	const normalized = new Set(toolsAllow.map((entry) => normalizeToolName(entry)));
	const missing = required.filter((name) => !normalized.has(normalizeToolName(name)));
	return missing.length === 0 ? toolsAllow : [...toolsAllow, ...missing];
}
function resolveCodingToolConstructionPlanForAllowlist(toolsAllow) {
	if (!toolsAllow) return cloneCodingToolConstructionPlan(ALL_CODING_TOOL_CONSTRUCTION_PLAN);
	if (toolsAllow.length === 0) return cloneCodingToolConstructionPlan(NO_CODING_TOOL_CONSTRUCTION_PLAN);
	if (hasWildcardToolAllowlist(toolsAllow)) return cloneCodingToolConstructionPlan(ALL_CODING_TOOL_CONSTRUCTION_PLAN);
	const normalized = normalizeToolList(expandToolGroups(toolsAllow));
	const coreFamilies = /* @__PURE__ */ new Set();
	let includePluginTools = false;
	for (const name of normalized) {
		const family = resolveCoreToolFactoryFamily(name);
		if (family) {
			coreFamilies.add(family);
			continue;
		}
		if (!isBundleMcpAllowlistName(name)) includePluginTools = true;
	}
	const includeBaseCodingTools = coreFamilies.has("base-coding");
	const includeShellTools = coreFamilies.has("shell");
	const includeOpenClawTools = coreFamilies.has("openclaw");
	return {
		includeBaseCodingTools,
		includeShellTools,
		includeChannelTools: includePluginTools,
		includeOpenClawTools,
		includePluginTools
	};
}
/**
* Decides which tool families need to be constructed for an embedded attempt.
* This keeps allowlisted plugin/channel tools available without forcing every
* local core tool factory to run for narrow plugin-only configurations.
*/
function resolveEmbeddedAttemptToolConstructionPlan(params) {
	if (params.disableTools === true || params.isRawModelRun === true || params.toolsEnabled === false) return {
		constructTools: false,
		includeCoreTools: false,
		codingToolConstructionPlan: cloneCodingToolConstructionPlan(NO_CODING_TOOL_CONSTRUCTION_PLAN)
	};
	const toolsAllow = mergeForcedEmbeddedAttemptToolsAllow(params.toolsAllow, { forceMessageTool: params.forceMessageTool });
	const codingToolConstructionPlan = resolveCodingToolConstructionPlanForAllowlist(toolsAllow);
	const includeCoreTools = codingToolConstructionPlan.includeBaseCodingTools || codingToolConstructionPlan.includeShellTools || codingToolConstructionPlan.includeOpenClawTools;
	return {
		constructTools: includeCoreTools || codingToolConstructionPlan.includeChannelTools || codingToolConstructionPlan.includePluginTools,
		includeCoreTools,
		...toolsAllow ? { runtimeToolAllowlist: toolsAllow } : {},
		codingToolConstructionPlan
	};
}
function shouldCreateBundleRuntimeForAttempt(params, matchesAllowlist) {
	if (!params.toolsEnabled || params.disableTools === true) return false;
	if (!params.toolsAllow) return true;
	if (params.toolsAllow.length === 0) return false;
	if (hasWildcardToolAllowlist(params.toolsAllow)) return true;
	return params.toolsAllow.some((toolName) => matchesAllowlist(normalizeToolName(toolName)));
}
/**
* Decides whether the bundled MCP runtime is needed for this attempt. Bundle
* runtime creation follows explicit bundle/plugin allowlist names rather than
* generic local tool names.
*/
function shouldCreateBundleMcpRuntimeForAttempt(params) {
	return shouldCreateBundleRuntimeForAttempt(params, (normalized) => {
		return isBundleMcpAllowlistName(normalized) || isPluginGroupAllowlistName(normalized);
	});
}
/**
* Decides whether the bundled LSP runtime is needed for this attempt. LSP tools
* are enabled by default/wildcard and by allowlist entries with the `lsp_`
* prefix.
*/
function shouldCreateBundleLspRuntimeForAttempt(params) {
	return shouldCreateBundleRuntimeForAttempt(params, (normalized) => {
		return normalized.startsWith("lsp_");
	});
}
//#endregion
export { shouldCreateBundleMcpRuntimeForAttempt as a, shouldCreateBundleLspRuntimeForAttempt as i, mergeForcedEmbeddedAttemptToolsAllow as n, resolveEmbeddedAttemptToolConstructionPlan as r, applyEmbeddedAttemptToolsAllow as t };
