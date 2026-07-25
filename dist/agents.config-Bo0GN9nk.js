import { c as normalizeOptionalString, m as resolvePrimaryStringValue } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir, t as listAgentEntries } from "./agent-scope-config-S7z_Yn4H.js";
import { r as resolveAgentAvatarUrlFromSource } from "./identity-avatar-file-CXm1GKsi.js";
import { i as listRouteBindings } from "./bindings-CI-O7TMQ.js";
import { i as loadAgentIdentityFromWorkspace, n as identityHasValues } from "./identity-file-CXrnLY30.js";
//#region src/commands/agents.config.ts
/** Find a configured agent entry by normalized id. */
function findAgentEntryIndex(list, agentId) {
	const id = normalizeAgentId(agentId);
	return list.findIndex((entry) => normalizeAgentId(entry.id) === id);
}
function resolveAgentModel(cfg, agentId) {
	const entryPrimary = resolvePrimaryStringValue(listAgentEntries(cfg).find((agent) => normalizeAgentId(agent.id) === normalizeAgentId(agentId))?.model);
	if (entryPrimary) return entryPrimary;
	return resolvePrimaryStringValue(cfg.agents?.defaults?.model);
}
/** Load non-empty identity metadata from a workspace identity file. */
function loadAgentIdentity(workspace) {
	const parsed = loadAgentIdentityFromWorkspace(workspace);
	if (!parsed) return null;
	return identityHasValues(parsed) ? parsed : null;
}
/** Build config-derived summaries for text/JSON agent listing. */
function buildAgentSummaries(cfg) {
	const defaultAgentId = normalizeAgentId(resolveDefaultAgentId(cfg));
	const configuredAgents = listAgentEntries(cfg);
	const orderedIds = configuredAgents.length > 0 ? configuredAgents.map((agent) => normalizeAgentId(agent.id)) : [defaultAgentId];
	const bindingCounts = /* @__PURE__ */ new Map();
	for (const binding of listRouteBindings(cfg)) {
		const agentId = normalizeAgentId(binding.agentId);
		bindingCounts.set(agentId, (bindingCounts.get(agentId) ?? 0) + 1);
	}
	return uniqueStrings(orderedIds).map((id) => {
		const workspace = resolveAgentWorkspaceDir(cfg, id);
		const identity = loadAgentIdentity(workspace);
		const configIdentity = configuredAgents.find((agent) => normalizeAgentId(agent.id) === id)?.identity;
		const identityName = identity?.name ?? configIdentity?.name?.trim();
		const identityEmoji = identity?.emoji ?? configIdentity?.emoji?.trim();
		const identityAvatarUrl = resolveAgentAvatarUrlFromSource(cfg, id, identity?.avatar ?? configIdentity?.avatar);
		const identitySource = identity ? "identity" : configIdentity && (identityName || identityEmoji || identityAvatarUrl) ? "config" : void 0;
		const summary = {
			id,
			name: normalizeOptionalString(configuredAgents.find((agent) => normalizeAgentId(agent.id) === id)?.name),
			identityName,
			identityEmoji,
			identitySource,
			workspace,
			agentDir: resolveAgentDir(cfg, id),
			model: resolveAgentModel(cfg, id),
			bindings: bindingCounts.get(id) ?? 0,
			isDefault: id === defaultAgentId
		};
		if (identityAvatarUrl) summary.identityAvatarUrl = identityAvatarUrl;
		return summary;
	});
}
/** Add or update one agent entry while preserving the default-agent placeholder when needed. */
function applyAgentConfig(cfg, params) {
	const agentId = normalizeAgentId(params.agentId);
	const name = params.name?.trim();
	const list = listAgentEntries(cfg);
	const index = findAgentEntryIndex(list, agentId);
	const base = (index >= 0 ? list[index] : void 0) ?? { id: agentId };
	const mergedIdentity = params.identity ? {
		...base.identity,
		...params.identity
	} : void 0;
	const nextEntry = {
		...base,
		...name ? { name } : {},
		...params.workspace ? { workspace: params.workspace } : {},
		...params.agentDir ? { agentDir: params.agentDir } : {},
		...mergedIdentity ? { identity: mergedIdentity } : {}
	};
	if (params.model === null) delete nextEntry.model;
	else if (params.model !== void 0) nextEntry.model = params.model;
	const nextList = [...list];
	if (index >= 0) nextList[index] = nextEntry;
	else {
		if (nextList.length === 0 && agentId !== normalizeAgentId(resolveDefaultAgentId(cfg))) nextList.push({ id: resolveDefaultAgentId(cfg) });
		nextList.push(nextEntry);
	}
	return {
		...cfg,
		agents: {
			...cfg.agents,
			list: nextList
		}
	};
}
/** Remove an agent and any config references that route or allow traffic to it. */
function pruneAgentConfig(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	const agents = listAgentEntries(cfg);
	const pruneAllowAgents = (allowAgents) => allowAgents?.filter((entry) => {
		const trimmed = entry.trim();
		return !trimmed || trimmed === "*" || normalizeAgentId(trimmed) !== id;
	});
	const nextAgentsList = [];
	for (const entry of agents) {
		if (normalizeAgentId(entry.id) === id) continue;
		nextAgentsList.push(entry.subagents?.allowAgents ? {
			...entry,
			subagents: {
				...entry.subagents,
				allowAgents: pruneAllowAgents(entry.subagents.allowAgents)
			}
		} : entry);
	}
	const nextAgents = nextAgentsList.length > 0 ? nextAgentsList : void 0;
	const bindings = cfg.bindings ?? [];
	const filteredBindings = bindings.filter((binding) => normalizeAgentId(binding.agentId) !== id);
	const allow = cfg.tools?.agentToAgent?.allow ?? [];
	const filteredAllow = allow.filter((entry) => entry !== id);
	const nextDefaults = cfg.agents?.defaults?.subagents?.allowAgents ? {
		...cfg.agents.defaults,
		subagents: {
			...cfg.agents.defaults.subagents,
			allowAgents: pruneAllowAgents(cfg.agents.defaults.subagents.allowAgents)
		}
	} : cfg.agents?.defaults;
	const nextAgentsConfig = cfg.agents ? {
		...cfg.agents,
		defaults: nextDefaults,
		list: nextAgents
	} : nextAgents ? { list: nextAgents } : void 0;
	const nextTools = cfg.tools?.agentToAgent ? {
		...cfg.tools,
		agentToAgent: {
			...cfg.tools.agentToAgent,
			allow: filteredAllow.length > 0 ? filteredAllow : void 0
		}
	} : cfg.tools;
	return {
		config: {
			...cfg,
			agents: nextAgentsConfig,
			bindings: filteredBindings.length > 0 ? filteredBindings : void 0,
			tools: nextTools
		},
		removedBindings: bindings.length - filteredBindings.length,
		removedAllow: allow.length - filteredAllow.length
	};
}
//#endregion
export { pruneAgentConfig as a, loadAgentIdentity as i, buildAgentSummaries as n, findAgentEntryIndex as r, applyAgentConfig as t };
