import "./agent-scope-CrBA-6Gx.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, n as listAgentIds, o as resolveAgentWorkspaceDir, s as resolveDefaultAgentDir } from "./agent-scope-config-S7z_Yn4H.js";
import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import "./config-BOMcY2yX.js";
import { d as PreparedModelRuntimeOwnerNotPublishedError, f as preparedModelRuntimeConfigsMatch, i as getPreparedModelRuntimeSnapshot, n as acquireReadOnlyPreparedModelRuntime, r as activateStandalonePreparedModelRuntime, s as prepareModelRuntimeSnapshot, t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-CrzRpeq_.js";
//#region src/agents/prepared-model-catalog.ts
/** Lifecycle-owned model catalog access. */
function resolveInputs(params = {}) {
	const config = params.config ?? getRuntimeConfig();
	const explicitOrDefaultAgentId = params.agentId ?? (params.agentDir === void 0 ? resolveDefaultAgentId(config) : void 0);
	const agentDir = params.agentDir ?? (explicitOrDefaultAgentId ? resolveAgentDir(config, explicitOrDefaultAgentId) : resolveDefaultAgentDir(config, params.env));
	const matchingAgentIds = params.agentDir === void 0 ? [] : listAgentIds(config).filter((candidateAgentId) => resolveAgentDir(config, candidateAgentId) === agentDir);
	const agentId = explicitOrDefaultAgentId ?? (params.agentDir === void 0 ? resolveDefaultAgentId(config) : matchingAgentIds.length === 1 ? matchingAgentIds[0] : void 0);
	const explicitWorkspaceDir = params.workspaceDir === void 0 ? void 0 : params.workspaceDir;
	const activationWorkspaceDir = explicitWorkspaceDir ?? (agentId ? resolveAgentWorkspaceDir(config, agentId) : void 0);
	const full = {
		...agentId ? { agentId } : {},
		agentDir,
		config,
		...params.env ? { env: params.env } : {},
		inheritedAuthDir: resolveDefaultAgentDir(config, params.env),
		...explicitWorkspaceDir ? { workspaceDir: explicitWorkspaceDir } : {}
	};
	const exact = params.readOnly ? {
		...full,
		readOnly: true
	} : full;
	const activationFull = activationWorkspaceDir ? {
		...full,
		workspaceDir: activationWorkspaceDir
	} : full;
	return {
		exact,
		full,
		activationFull,
		activationExact: params.readOnly ? {
			...activationFull,
			readOnly: true
		} : activationFull
	};
}
/** Returns the current published catalog without waiting or starting discovery. */
function getPreparedModelCatalogSnapshot(params = {}) {
	const { activationExact, activationFull, exact, full } = resolveInputs(params);
	const publishedFull = getPreparedModelRuntimeSnapshot(full);
	if (publishedFull && preparedModelRuntimeConfigsMatch(publishedFull.config, full.config)) return publishedFull.modelCatalog;
	if (activationFull && activationFull.workspaceDir !== full.workspaceDir) {
		const activatedFull = getPreparedModelRuntimeSnapshot(activationFull);
		if (activatedFull && preparedModelRuntimeConfigsMatch(activatedFull.config, full.config)) return activatedFull.modelCatalog;
	}
	if (exact === full) return;
	const publishedExact = getPreparedModelRuntimeSnapshot(exact);
	if (publishedExact && preparedModelRuntimeConfigsMatch(publishedExact.config, exact.config)) return publishedExact.modelCatalog;
	if (!activationExact || activationExact.workspaceDir === exact.workspaceDir) return;
	const activatedExact = getPreparedModelRuntimeSnapshot(activationExact);
	return activatedExact && preparedModelRuntimeConfigsMatch(activatedExact.config, exact.config) ? activatedExact.modelCatalog : void 0;
}
/** Resolves the lifecycle owner used for a catalog read. */
async function loadPreparedModelCatalogOwnerSnapshot(params = {}) {
	const { activationExact, activationFull, exact, full } = resolveInputs(params);
	if (params.readOnly) {
		const fullCandidates = activationFull.workspaceDir === full.workspaceDir ? [full] : [full, activationFull];
		for (const candidate of fullCandidates) try {
			const prepared = await prepareModelRuntimeSnapshot(candidate);
			if (!preparedModelRuntimeConfigsMatch(prepared.config, candidate.config)) throw new Error(`prepared model catalog owner config was replaced during the read (${candidate.agentDir})`);
			return prepared;
		} catch (error) {
			if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
		}
		const lease = await acquireReadOnlyPreparedModelRuntime(activationExact);
		try {
			if (!preparedModelRuntimeConfigsMatch(lease.snapshot.config, activationExact.config)) throw new Error(`prepared model catalog owner config was replaced during the read (${activationExact.agentDir})`);
			return lease.snapshot;
		} finally {
			lease.release();
		}
	}
	if (exact !== full) {
		const fullCandidates = activationFull.workspaceDir === full.workspaceDir ? [full] : [full, activationFull];
		for (const candidate of fullCandidates) try {
			const preparedFull = await prepareModelRuntimeSnapshot(candidate);
			if (preparedModelRuntimeConfigsMatch(preparedFull.config, full.config)) return preparedFull;
		} catch (error) {
			if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
		}
	}
	try {
		const preparedExact = await prepareModelRuntimeSnapshot(exact);
		if (preparedModelRuntimeConfigsMatch(preparedExact.config, exact.config)) return preparedExact;
	} catch (error) {
		if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
	}
	const activated = await activateStandalonePreparedModelRuntime(activationExact);
	if (activated && preparedModelRuntimeConfigsMatch(activated.config, activationExact.config)) return activated;
	if (activated) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model catalog owner was not published for the requested config (${activationExact.agentDir})`);
	const lease = await acquireAgentRunPreparedModelRuntime(activationFull);
	try {
		if (!preparedModelRuntimeConfigsMatch(lease.snapshot.config, activationFull.config)) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model catalog owner was not published for the requested config (${activationFull.agentDir})`);
		return lease.snapshot;
	} finally {
		lease.release();
	}
}
/** Reads one atomic catalog generation, activating a lifecycle owner when needed. */
async function loadPreparedModelCatalogSnapshot(params = {}) {
	return (await loadPreparedModelCatalogOwnerSnapshot(params)).modelCatalog;
}
async function loadPreparedModelCatalog(params = {}) {
	return (await loadPreparedModelCatalogSnapshot(params)).entries;
}
//#endregion
export { loadPreparedModelCatalogSnapshot as i, loadPreparedModelCatalog as n, loadPreparedModelCatalogOwnerSnapshot as r, getPreparedModelCatalogSnapshot as t };
