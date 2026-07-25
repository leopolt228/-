import "./agent-scope-CrBA-6Gx.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir } from "./agent-scope-config-S7z_Yn4H.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-xuKL7EBL.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { o as normalizeProviderId } from "./model-selection-normalize-D7Dhjaxs.js";
import "./model-selection-Dx2ArePR.js";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor/shared/stale-agent-model-ref-repair.ts
const DEFAULT_MODEL_REF = `${DEFAULT_PROVIDER}/${DEFAULT_MODEL}`;
function isRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function providerFromModelRef(ref) {
	const trimmed = ref.trim();
	const slash = trimmed.indexOf("/");
	if (slash <= 0 || slash === trimmed.length - 1) return;
	return normalizeProviderId(trimmed.slice(0, slash)) || void 0;
}
function collectPluginProviderIds(cfg, options) {
	if (options.pluginProviderIds) return {
		providerIds: new Set([...options.pluginProviderIds].map(normalizeProviderId).filter(Boolean)),
		warnings: []
	};
	const snapshot = resolvePluginMetadataSnapshot({
		config: cfg,
		workspaceDir: resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg)) ?? void 0,
		env: options.env ?? process.env,
		allowWorkspaceScopedCurrent: true
	});
	if (snapshot.diagnostics.some((diagnostic) => diagnostic.level === "error")) return { warnings: ["Skipped stale agent model reference repair because plugin discovery reported errors."] };
	const providerIds = /* @__PURE__ */ new Set();
	for (const owners of [
		snapshot.owners.providers,
		snapshot.owners.modelCatalogProviders,
		snapshot.owners.setupProviders,
		snapshot.owners.cliBackends
	]) for (const providerId of owners.keys()) {
		const normalized = normalizeProviderId(providerId);
		if (normalized) providerIds.add(normalized);
	}
	return {
		providerIds,
		warnings: []
	};
}
function collectPersistedProviderIds(params) {
	const injected = params.injected?.get(params.agentId);
	if (injected) return { providerIds: new Set([...injected].map(normalizeProviderId).filter(Boolean)) };
	if (params.injected) return { providerIds: /* @__PURE__ */ new Set() };
	const modelsPath = path.join(resolveAgentDir(params.cfg, params.agentId, params.env), "models.json");
	let raw;
	try {
		raw = fs.readFileSync(modelsPath, "utf8");
	} catch (error) {
		if (error.code === "ENOENT") return { providerIds: /* @__PURE__ */ new Set() };
		return { warning: `Skipped stale model reference repair for agent "${params.agentId}" because ${modelsPath} could not be read.` };
	}
	try {
		const parsed = JSON.parse(raw);
		if (!parsed.providers || typeof parsed.providers !== "object" || Array.isArray(parsed.providers)) return { providerIds: /* @__PURE__ */ new Set() };
		return { providerIds: new Set(Object.keys(parsed.providers).map(normalizeProviderId).filter(Boolean)) };
	} catch {
		return { warning: `Skipped stale model reference repair for agent "${params.agentId}" because ${modelsPath} is invalid JSON.` };
	}
}
function repairModelMap(params) {
	if (!isRecord(params.models)) return;
	const refs = Object.keys(params.models);
	const staleRefs = refs.filter((ref) => params.isStale(ref));
	if (staleRefs.length === refs.length && staleRefs.length > 0 && !params.replacementRef) {
		params.warnings.push(`Skipped clearing ${params.path} because no available replacement model could keep the allowlist restrictive.`);
		return;
	}
	for (const ref of staleRefs) {
		const provider = params.isStale(ref);
		delete params.models[ref];
		params.changes.push(`Removed stale ${params.path} entry "${ref}" (provider "${provider}" is unavailable).`);
	}
	if (refs.length > 0 && (staleRefs.length > 0 || params.ensureReplacement === true) && params.replacementRef && !Object.hasOwn(params.models, params.replacementRef)) {
		params.models[params.replacementRef] = {};
		params.changes.push(`Added ${params.path} entry "${params.replacementRef}" to keep the repaired allowlist restrictive.`);
	}
}
function filterFallbacks(params) {
	if (!Array.isArray(params.model.fallbacks)) return;
	params.model.fallbacks = params.model.fallbacks.filter((ref) => {
		if (typeof ref !== "string") return true;
		const provider = params.isStale(ref);
		if (!provider) return true;
		params.changes.push(`Removed stale ${params.path} fallback "${ref}" (provider "${provider}" is unavailable).`);
		return false;
	});
	if (params.model.fallbacks.length === 0) delete params.model.fallbacks;
}
function firstExplicitModelRef(cfg) {
	if (!isRecord(cfg.models?.providers)) return;
	for (const [providerId, provider] of Object.entries(cfg.models.providers)) {
		if (!isRecord(provider) || !Array.isArray(provider.models)) continue;
		const normalizedProvider = normalizeProviderId(providerId);
		const modelId = provider.models.map((model) => isRecord(model) && typeof model.id === "string" ? model.id.trim() : "").find(Boolean);
		if (normalizedProvider && modelId) return `${normalizedProvider}/${modelId}`;
	}
}
function modelPrimaryRef(model) {
	if (typeof model === "string") return model;
	return isRecord(model) && typeof model.primary === "string" ? model.primary : void 0;
}
function repairStaleAgentModelRefs(cfg, options = {}) {
	const replaceMode = cfg.models?.mode === "replace";
	const pluginProviders = replaceMode ? {
		providerIds: /* @__PURE__ */ new Set(),
		warnings: []
	} : collectPluginProviderIds(cfg, options);
	if (!pluginProviders.providerIds) return {
		config: cfg,
		changes: [],
		warnings: pluginProviders.warnings
	};
	const baseAvailableProviders = pluginProviders.providerIds;
	if (!replaceMode) baseAvailableProviders.add(normalizeProviderId(DEFAULT_PROVIDER));
	for (const providerId of Object.keys(cfg.models?.providers ?? {})) {
		const normalized = normalizeProviderId(providerId);
		if (normalized) baseAvailableProviders.add(normalized);
	}
	for (const backendId of Object.keys(isRecord(cfg.agents?.defaults?.cliBackends) ? cfg.agents.defaults.cliBackends : {})) {
		const normalized = normalizeProviderId(backendId);
		if (normalized) baseAvailableProviders.add(normalized);
	}
	const config = structuredClone(cfg);
	const changes = [];
	const warnings = [...pluginProviders.warnings];
	const env = options.env ?? process.env;
	const persistedForAgent = (agentId) => {
		const persisted = collectPersistedProviderIds({
			cfg,
			agentId,
			env,
			injected: options.persistedProviderIdsByAgentId
		});
		if (!persisted.providerIds) {
			if (persisted.warning) warnings.push(persisted.warning);
			return;
		}
		return persisted.providerIds;
	};
	const availabilityForAgent = (agentId) => {
		const available = new Set(baseAvailableProviders);
		if (replaceMode) return available;
		const persisted = persistedForAgent(agentId);
		if (!persisted) return;
		for (const providerId of persisted) available.add(providerId);
		return available;
	};
	const availabilityForDefaults = () => {
		const available = new Set(baseAvailableProviders);
		if (replaceMode) return available;
		const inheritingAgentIds = [];
		for (const agent of Array.isArray(cfg.agents?.list) ? cfg.agents.list : []) {
			if (!isRecord(agent) || typeof agent.id !== "string") continue;
			const explicitPrimary = modelPrimaryRef(agent.model);
			if (!explicitPrimary) {
				inheritingAgentIds.push(agent.id);
				continue;
			}
			const agentAvailability = availabilityForAgent(agent.id);
			const provider = providerFromModelRef(explicitPrimary);
			if (agentAvailability && provider && !agentAvailability.has(provider)) inheritingAgentIds.push(agent.id);
		}
		if (inheritingAgentIds.length === 0) inheritingAgentIds.push(resolveDefaultAgentId(cfg));
		let commonPersisted;
		for (const agentId of inheritingAgentIds) {
			const persisted = persistedForAgent(agentId);
			if (!persisted) return;
			commonPersisted = commonPersisted ? new Set([...commonPersisted].filter((providerId) => persisted.has(providerId))) : new Set(persisted);
		}
		for (const providerId of commonPersisted ?? []) available.add(providerId);
		return available;
	};
	const availabilityForDefaultModelMap = () => {
		const available = new Set(baseAvailableProviders);
		if (replaceMode) return available;
		const inheritingAgentIds = (Array.isArray(cfg.agents?.list) ? cfg.agents.list : []).filter((agent) => isRecord(agent) && typeof agent.id === "string" && !isRecord(agent.models)).map((agent) => agent.id);
		if (inheritingAgentIds.length === 0) inheritingAgentIds.push(resolveDefaultAgentId(cfg));
		for (const agentId of inheritingAgentIds) {
			const persisted = persistedForAgent(agentId);
			if (!persisted) return;
			for (const providerId of persisted) available.add(providerId);
		}
		return available;
	};
	const makeStaleChecker = (available) => (ref) => {
		const provider = providerFromModelRef(ref);
		return provider && !available.has(provider) ? provider : void 0;
	};
	const defaults = config.agents?.defaults;
	const defaultAvailability = availabilityForDefaults();
	let repairedDefaultPrimary = modelPrimaryRef(defaults?.model) ?? (replaceMode ? firstExplicitModelRef(cfg) : DEFAULT_MODEL_REF);
	let defaultPrimaryChanged = false;
	if (defaults && defaultAvailability) {
		const isStale = makeStaleChecker(defaultAvailability);
		const configuredReplacement = replaceMode ? firstExplicitModelRef(cfg) : DEFAULT_MODEL_REF;
		if (defaults.model) {
			if (typeof defaults.model === "string") {
				const provider = isStale(defaults.model);
				if (provider) {
					const staleRef = defaults.model;
					if (configuredReplacement) {
						defaults.model = configuredReplacement;
						defaultPrimaryChanged = true;
						changes.push(`Replaced stale agents.defaults.model "${staleRef}" with default "${configuredReplacement}" (provider "${provider}" is unavailable).`);
					} else {
						delete defaults.model;
						defaultPrimaryChanged = true;
						changes.push(`Removed stale agents.defaults.model "${staleRef}" because provider "${provider}" is unavailable and no replacement model is configured.`);
					}
				}
			} else if (isRecord(defaults.model)) {
				const provider = typeof defaults.model.primary === "string" ? isStale(defaults.model.primary) : void 0;
				let replacement;
				if (provider && typeof defaults.model.primary === "string") {
					const staleRef = defaults.model.primary;
					replacement = replaceMode ? (Array.isArray(defaults.model.fallbacks) ? defaults.model.fallbacks.find((fallback) => typeof fallback === "string" && !isStale(fallback)) : void 0) ?? configuredReplacement : configuredReplacement;
					if (replacement) {
						defaults.model.primary = replacement;
						defaultPrimaryChanged = true;
						changes.push(`Replaced stale agents.defaults.model primary "${staleRef}" with default "${replacement}" (provider "${provider}" is unavailable).`);
					} else {
						delete defaults.model.primary;
						defaultPrimaryChanged = true;
						changes.push(`Removed stale agents.defaults.model primary "${staleRef}" because provider "${provider}" is unavailable and no replacement model is configured.`);
					}
				}
				filterFallbacks({
					model: defaults.model,
					path: "agents.defaults.model",
					isStale,
					changes
				});
				if (replacement && Array.isArray(defaults.model.fallbacks) && defaults.model.fallbacks.includes(replacement)) {
					defaults.model.fallbacks = defaults.model.fallbacks.filter((fallback) => fallback !== replacement);
					changes.push(`Removed duplicate agents.defaults.model fallback "${replacement}" after selecting it as the default primary.`);
					if (defaults.model.fallbacks.length === 0) delete defaults.model.fallbacks;
				}
				if (!defaults.model.primary && !defaults.model.fallbacks) delete defaults.model;
			}
		}
		repairedDefaultPrimary = modelPrimaryRef(defaults.model) ?? (replaceMode ? firstExplicitModelRef(cfg) : DEFAULT_MODEL_REF);
		const modelMapAvailability = availabilityForDefaultModelMap();
		if (modelMapAvailability) repairModelMap({
			models: defaults.models,
			path: "agents.defaults.models",
			isStale: makeStaleChecker(modelMapAvailability),
			replacementRef: repairedDefaultPrimary,
			ensureReplacement: defaultPrimaryChanged,
			changes,
			warnings
		});
	}
	for (const [index, agent] of (Array.isArray(config.agents?.list) ? config.agents.list : []).entries()) {
		if (!isRecord(agent) || typeof agent.id !== "string") continue;
		const available = availabilityForAgent(agent.id);
		if (!available) continue;
		const isStale = makeStaleChecker(available);
		const modelPath = `agents.list[${index}].model`;
		const canInheritDefault = Boolean(defaultAvailability && repairedDefaultPrimary && (!replaceMode || modelPrimaryRef(defaults?.model)) && !isStale(repairedDefaultPrimary));
		let agentPrimaryChanged = false;
		if (typeof agent.model === "string") {
			const provider = isStale(agent.model);
			if (provider) {
				const staleRef = agent.model;
				if (canInheritDefault) {
					delete agent.model;
					agentPrimaryChanged = true;
					changes.push(`Removed stale ${modelPath} "${staleRef}" so agent "${agent.id}" inherits the default model (provider "${provider}" is unavailable).`);
				} else if (repairedDefaultPrimary && !isStale(repairedDefaultPrimary)) {
					agent.model = repairedDefaultPrimary;
					agentPrimaryChanged = true;
					changes.push(`Replaced stale ${modelPath} "${staleRef}" with "${repairedDefaultPrimary}" (provider "${provider}" is unavailable).`);
				} else warnings.push(`Skipped stale ${modelPath} repair because no available inherited or replacement model is configured.`);
			}
		} else if (isRecord(agent.model)) {
			const provider = typeof agent.model.primary === "string" ? isStale(agent.model.primary) : void 0;
			let agentReplacement;
			if (provider && typeof agent.model.primary === "string") {
				const staleRef = agent.model.primary;
				if (canInheritDefault) {
					delete agent.model.primary;
					agentPrimaryChanged = true;
					agentReplacement = repairedDefaultPrimary;
					changes.push(`Removed stale ${modelPath} primary "${staleRef}" so agent "${agent.id}" inherits the default model (provider "${provider}" is unavailable).`);
				} else if (agentReplacement = (Array.isArray(agent.model.fallbacks) ? agent.model.fallbacks.find((fallback) => typeof fallback === "string" && !isStale(fallback)) : void 0) ?? (repairedDefaultPrimary && !isStale(repairedDefaultPrimary) ? repairedDefaultPrimary : void 0)) {
					agent.model.primary = agentReplacement;
					agentPrimaryChanged = true;
					changes.push(`Replaced stale ${modelPath} primary "${staleRef}" with "${agentReplacement}" (provider "${provider}" is unavailable).`);
				} else warnings.push(`Skipped stale ${modelPath} primary repair because no available inherited or replacement model is configured.`);
			}
			filterFallbacks({
				model: agent.model,
				path: modelPath,
				isStale,
				changes
			});
			if (agentReplacement && Array.isArray(agent.model.fallbacks) && agent.model.fallbacks.includes(agentReplacement)) {
				agent.model.fallbacks = agent.model.fallbacks.filter((fallback) => fallback !== agentReplacement);
				changes.push(`Removed duplicate ${modelPath} fallback "${agentReplacement}" after selecting it as the primary.`);
				if (agent.model.fallbacks.length === 0) delete agent.model.fallbacks;
			}
			if (!agent.model.primary && !agent.model.fallbacks) delete agent.model;
		}
		const effectiveAgentPrimary = modelPrimaryRef(agent.model) ?? repairedDefaultPrimary;
		repairModelMap({
			models: agent.models,
			path: `agents.list[${index}].models`,
			isStale,
			replacementRef: effectiveAgentPrimary && !isStale(effectiveAgentPrimary) ? effectiveAgentPrimary : void 0,
			ensureReplacement: agentPrimaryChanged || !modelPrimaryRef(agent.model) && defaultPrimaryChanged,
			changes,
			warnings
		});
	}
	return {
		config: changes.length > 0 ? config : cfg,
		changes,
		warnings
	};
}
//#endregion
export { repairStaleAgentModelRefs };
