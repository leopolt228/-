import { c as rememberAdvertisedScopedMcpCatalog, i as getOrCreateRequesterScopedMcpRuntime, r as getAdvertisedScopedMcpCatalog } from "./agent-bundle-mcp-manager-api-ChkvrkDs.js";
import "./agent-bundle-mcp-runtime-cXylnYqu.js";
import { i as getPluginToolMeta } from "./tools-DzbN4AH5.js";
import { r as materializeBundleMcpToolsForRun, t as buildBundleMcpToolsFromCatalog } from "./agent-bundle-mcp-materialize-8Ic7kVvm.js";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-Ca0Rl8YJ.js";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-DgnjaCfn.js";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-BeSmQ2ah.js";
//#region src/agents/agent-bundle-mcp-harness.ts
function notConnectedToolResult(serverName, toolName) {
	const message = `Requester has not connected MCP server "${serverName}" (tool "${toolName}") for this turn.`;
	return {
		content: [{
			type: "text",
			text: message
		}],
		details: {
			status: "error",
			error: message,
			mcpServer: serverName,
			mcpTool: toolName
		}
	};
}
function applyHarnessToolPolicy(tools, params) {
	if (tools.length === 0) return tools;
	const allowed = applyEmbeddedAttemptToolsAllow(tools, params.toolsAllow, { toolMeta: (tool) => getPluginToolMeta(tool) });
	const profile = params.conversationCapabilityProfile ?? (params.policyContext ? resolveConversationCapabilityProfile({
		...params.policyContext,
		runtimeToolAllowlist: params.toolsAllow
	}) : void 0);
	if (!profile) return allowed;
	return applyFinalEffectiveToolPolicy({
		bundledTools: allowed,
		config: params.policyContext?.config ?? params.cfg,
		conversationCapabilityProfile: profile,
		warn: params.warn ?? (() => void 0)
	});
}
/**
* Materialize requester-scoped MCP tools for a harness run (e.g. Codex dynamic tools).
* Updates the session advertised-catalog cache when a requester resolves a catalog.
* Before any requester resolves in the session, returns undefined (nothing to advertise).
*/
async function materializeRequesterScopedMcpToolsForHarnessRun(params) {
	const scopedRuntime = await getOrCreateRequesterScopedMcpRuntime({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		agentDir: params.agentDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry,
		requesterSenderId: params.requesterSenderId,
		agentAccountId: params.agentAccountId,
		messageChannel: params.messageChannel
	});
	let liveRuntime;
	if (scopedRuntime) {
		liveRuntime = await materializeBundleMcpToolsForRun({
			runtime: scopedRuntime,
			reservedToolNames: params.reservedToolNames
		});
		const catalog = scopedRuntime.peekCatalog() ?? await scopedRuntime.getCatalog();
		rememberAdvertisedScopedMcpCatalog(params.sessionId, catalog);
	}
	const advertisedCatalog = getAdvertisedScopedMcpCatalog(params.sessionId);
	if (!advertisedCatalog || advertisedCatalog.tools.length === 0) {
		await liveRuntime?.dispose();
		return;
	}
	const advertisedTools = buildBundleMcpToolsFromCatalog({
		catalog: advertisedCatalog,
		reservedToolNames: params.reservedToolNames ? Array.from(params.reservedToolNames) : void 0,
		createExecute: (tool) => async () => notConnectedToolResult(tool.serverName, tool.toolName)
	});
	const liveByName = new Map((liveRuntime?.tools ?? []).map((tool) => [tool.name, tool]));
	const filteredTools = applyHarnessToolPolicy(advertisedTools.map((tool) => liveByName.get(tool.name) ?? tool), params);
	const filteredAdvertised = applyHarnessToolPolicy(advertisedTools, params);
	const allowedNames = new Set(filteredAdvertised.map((tool) => tool.name));
	const executableTools = filteredTools.filter((tool) => allowedNames.has(tool.name));
	let disposed = false;
	return {
		tools: executableTools,
		advertisedTools: filteredAdvertised,
		dispose: async () => {
			if (disposed) return;
			disposed = true;
			await liveRuntime?.dispose();
		}
	};
}
//#endregion
export { materializeRequesterScopedMcpToolsForHarnessRun };
