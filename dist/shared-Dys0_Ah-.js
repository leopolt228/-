import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { n as normalizeAgentModelRefForConfig, o as toAgentModelListLike } from "./model-input-B7OGjVYg.js";
import "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, n as listAgentIds } from "./agent-scope-config-S7z_Yn4H.js";
import { l as readConfigFileSnapshot } from "./io-CEgS2K9F.js";
import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { S as resolveModelRefFromString, i as buildModelAliasIndex } from "./model-selection-shared-CPPxIJAX.js";
import { i as modelKey, r as legacyModelKey } from "./model-selection-normalize-D7Dhjaxs.js";
import { n as formatConfigIssueLines } from "./issue-format-BfBp97Wi.js";
import { r as replaceConfigFile } from "./config-BOMcY2yX.js";
import "./model-selection-Dx2ArePR.js";
import { n as canonicalizeModelCatalogProviderRef } from "./provider-aliases-D4jY8xbd.js";
//#region src/commands/models/shared.ts
/** Shared helpers for model commands that read or mutate model config. */
const ensureFlagCompatibility = (opts) => {
	if (opts.json && opts.plain) throw new Error("Choose either --json or --plain, not both.");
};
/** Formats token counts as compact K-suffixed labels. */
const formatTokenK = (value) => {
	if (!value || !Number.isFinite(value)) return "-";
	if (value < 1e3) return `${Math.round(value)}`;
	return `${Math.round(value / 1e3)}k`;
};
/** Formats millisecond durations for model command output. */
const formatMs = (value) => {
	if (value === null || value === void 0) return "-";
	if (!Number.isFinite(value)) return "-";
	if (value < 1e3) return `${Math.round(value)}ms`;
	return `${Math.round(value / 100) / 10}s`;
};
/** Loads config from disk and throws a formatted error when validation fails. */
async function loadValidConfigOrThrow() {
	const snapshot = await readConfigFileSnapshot();
	if (!snapshot.valid) {
		const issues = formatConfigIssueLines(snapshot.issues, "-").join("\n");
		throw new Error(`Invalid config at ${snapshot.path}\n${issues}`);
	}
	return snapshot.runtimeConfig ?? snapshot.config;
}
/** Reads source config, applies a mutator, and writes only the source-form config. */
async function updateConfig(mutator) {
	const snapshot = await readConfigFileSnapshot();
	if (!snapshot.valid) {
		const issues = formatConfigIssueLines(snapshot.issues, "-").join("\n");
		throw new Error(`Invalid config at ${snapshot.path}\n${issues}`);
	}
	const next = mutator(structuredClone(snapshot.sourceConfig ?? snapshot.config), { runtimeConfig: structuredClone(snapshot.runtimeConfig ?? snapshot.config) });
	await replaceConfigFile({
		nextConfig: next,
		baseHash: snapshot.hash
	});
	return next;
}
/** Resolves a CLI model reference through aliases and catalog provider aliases. */
function resolveModelTarget(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: DEFAULT_PROVIDER
	});
	const resolved = resolveModelRefFromString({
		raw: params.raw,
		defaultProvider: DEFAULT_PROVIDER,
		aliasIndex
	});
	if (!resolved) throw new Error(`Invalid model reference: ${params.raw}`);
	return canonicalizeModelCatalogProviderRef(resolved.ref, { cfg: params.cfg });
}
function resolveAuthoredModelAliasTarget(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: DEFAULT_PROVIDER
	});
	const resolved = resolveModelRefFromString({
		raw: params.raw,
		defaultProvider: DEFAULT_PROVIDER,
		aliasIndex
	});
	return resolved?.alias ? resolved.ref : void 0;
}
/** Resolves model reference strings to canonical provider/model keys. */
function resolveModelKeysFromEntries(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: DEFAULT_PROVIDER
	});
	return params.entries.map((entry) => resolveModelRefFromString({
		raw: entry,
		defaultProvider: DEFAULT_PROVIDER,
		aliasIndex
	})).filter((entry) => Boolean(entry)).map((entry) => modelKey(entry.ref.provider, entry.ref.model));
}
/** Validates an optional agent id against configured agents. */
function resolveKnownAgentId(params) {
	const raw = params.rawAgentId?.trim();
	if (!raw) return;
	const agentId = normalizeAgentId(raw);
	if (!listAgentIds(params.cfg).includes(agentId)) throw new Error(`Unknown agent id "${raw}". Use "${formatCliCommand("openclaw agents list")}" to see configured agents.`);
	return agentId;
}
/** Resolves the selected model-command agent and its profile directory. */
function resolveModelsTargetAgent(cfg, rawAgentId) {
	const agentId = resolveKnownAgentId({
		cfg,
		rawAgentId
	}) ?? resolveDefaultAgentId(cfg);
	return {
		agentId,
		agentDir: resolveAgentDir(cfg, agentId)
	};
}
/** Upserts the canonical model entry and folds legacy key metadata into it. */
function upsertCanonicalModelConfigEntry(models, params) {
	const key = modelKey(params.provider, params.model);
	const legacyKeys = [legacyModelKey(params.provider, params.model), `${params.provider}/${key}`].filter((legacyKey) => typeof legacyKey === "string" && legacyKey.length > 0 && legacyKey !== key);
	let legacyEntry;
	for (const legacyKey of legacyKeys) {
		const entry = models[legacyKey];
		if (!entry) continue;
		Object.assign(legacyEntry ??= {}, entry);
		legacyEntry.params = {
			...legacyEntry.params,
			...entry.params
		};
	}
	if (legacyEntry) models[key] = {
		...legacyEntry,
		...models[key],
		params: {
			...legacyEntry.params,
			...models[key]?.params
		}
	};
	else if (!models[key]) models[key] = {};
	for (const legacyKey of legacyKeys) delete models[legacyKey];
	return key;
}
/** Merges primary/fallback patches while normalizing refs for config storage. */
function mergePrimaryFallbackConfig(existing, patch) {
	const next = { ...existing && typeof existing === "object" ? existing : void 0 };
	if (patch.primary !== void 0) next.primary = normalizeAgentModelRefForConfig(patch.primary);
	if (patch.fallbacks !== void 0) next.fallbacks = patch.fallbacks.map((fallback) => normalizeAgentModelRefForConfig(fallback));
	else if (next.fallbacks !== void 0) next.fallbacks = next.fallbacks.map((fallback) => normalizeAgentModelRefForConfig(fallback));
	return next;
}
/** Applies a default text/image primary-model update and ensures the model entry exists. */
function applyDefaultModelPrimaryUpdate(params) {
	const resolved = params.resolveCfg && params.resolveCfg !== params.cfg ? resolveAuthoredModelAliasTarget({
		raw: params.modelRaw,
		cfg: params.cfg
	}) ?? resolveModelTarget({
		raw: params.modelRaw,
		cfg: params.resolveCfg
	}) : resolveModelTarget({
		raw: params.modelRaw,
		cfg: params.cfg
	});
	const nextModels = { ...params.cfg.agents?.defaults?.models };
	const key = upsertCanonicalModelConfigEntry(nextModels, resolved);
	const defaults = params.cfg.agents?.defaults ?? {};
	const existing = toAgentModelListLike(defaults[params.field]);
	return {
		...params.cfg,
		agents: {
			...params.cfg.agents,
			defaults: {
				...defaults,
				[params.field]: mergePrimaryFallbackConfig(existing, { primary: key }),
				models: nextModels
			}
		}
	};
}
/**
* Model key format: "provider/model"
*
* The model key is displayed in `/model status` and used to reference models.
* When using `/model <key>`, use the exact format shown (e.g., "openrouter/moonshotai/kimi-k2").
*
* For providers with hierarchical model IDs (e.g., OpenRouter), the model ID may include
* sub-providers (e.g., "moonshotai/kimi-k2"), resulting in a key like "openrouter/moonshotai/kimi-k2".
*/
//#endregion
export { loadValidConfigOrThrow as a, resolveModelKeysFromEntries as c, updateConfig as d, upsertCanonicalModelConfigEntry as f, formatTokenK as i, resolveModelTarget as l, ensureFlagCompatibility as n, mergePrimaryFallbackConfig as o, formatMs as r, resolveKnownAgentId as s, applyDefaultModelPrimaryUpdate as t, resolveModelsTargetAgent as u };
