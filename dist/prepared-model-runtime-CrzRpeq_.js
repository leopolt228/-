import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { o as asDateTimestampMs } from "./number-coercion-Crk_c9KW.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import "./utils-K2PjeLaV.js";
import { s as coerceSecretRef } from "./types.secrets-BgE_Zq2x.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import "./agent-scope-CrBA-6Gx.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, n as listAgentIds, o as resolveAgentWorkspaceDir, s as resolveDefaultAgentDir } from "./agent-scope-config-S7z_Yn4H.js";
import { t as MODEL_APIS } from "./types.models-BHfgMdAm.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-xuKL7EBL.js";
import { u as hashRuntimeConfigValue } from "./runtime-snapshot-BW7iP5ad.js";
import { g as resolveProviderEnvAuthLookupMaps, h as listProviderEnvAuthLookupKeys } from "./model-auth-markers-Bqpoo9x7.js";
import { g as normalizeProviderResolvedModelWithPlugin, k as resolveProviderSyntheticAuthWithPlugin, r as applyProviderResolvedTransportWithPlugin } from "./provider-runtime-BE5KxvKF.js";
import { p as registerRuntimeAuthProfileStoreMutationListener } from "./runtime-snapshots-CQokmk8n.js";
import { d as loadAuthProfileStoreForSecretsRuntime, f as loadAuthProfileStoreWithoutExternalProfiles, i as ensureAuthProfileStore, o as ensureAuthProfileStoreWithoutExternalProfiles, u as loadAuthProfileStoreForRuntime } from "./store-BTcmQtbp.js";
import { t as buildPreparedModelCatalogSnapshot } from "./model-catalog-Be-bQQxa.js";
import { t as withTimeout } from "./with-timeout-BMBwq3as.js";
import { n as isReservedSystemAgentId } from "./agent-id-BZRNsGar.js";
import { a as normalizeModelCompat } from "./provider-model-compat-0eNk_A0D.js";
import { n as resolveRuntimeSyntheticAuthProviderRefs } from "./synthetic-auth.runtime.js";
import { i as resolveAuthProfileOrder } from "./order-FUfwr_5s.js";
import { t as resolveEnvApiKey } from "./model-auth-env-COYR71VZ.js";
import { E as resolveModelPluginMetadataSnapshot, h as ModelRegistry, y as AuthStorage } from "./sessions-Coo3M9oK.js";
import { i as loadBundledProviderStaticCatalogContextModels } from "./model.static-catalog-CkdQf8Mx.js";
import { t as ensureOpenClawModelsJson } from "./models-config-Coc-FEPz.js";
import { t as ensureRuntimePluginsLoaded } from "./runtime-plugins-C2HQO8GV.js";
import path from "node:path";
//#region src/agents/agent-auth-credentials.ts
/** Converts auth-profile credentials into agent runtime credential maps. */
const AGENT_SECRET_REF_CONFIGURED_MARKER = "openclaw-secret-ref-configured";
function hasConfiguredSecretRef(value) {
	return coerceSecretRef(value) !== null;
}
function secretRefPlaceholder(options) {
	if (options?.includeSecretRefPlaceholders === true) return {
		type: "api_key",
		key: AGENT_SECRET_REF_CONFIGURED_MARKER
	};
	return null;
}
function convertAuthProfileCredentialToAgent(cred, options) {
	if (cred.type === "api_key") {
		const key = normalizeOptionalString(cred.key) ?? "";
		if (!key) return hasConfiguredSecretRef(cred.keyRef) ? secretRefPlaceholder(options) : null;
		return {
			type: "api_key",
			key
		};
	}
	if (cred.type === "token") {
		if (cred.expires !== void 0) {
			const expires = asDateTimestampMs(cred.expires);
			if (expires === void 0 || Date.now() >= expires) return null;
		}
		const token = normalizeOptionalString(cred.token) ?? "";
		if (!token) return hasConfiguredSecretRef(cred.tokenRef) ? secretRefPlaceholder(options) : null;
		return {
			type: "api_key",
			key: token
		};
	}
	if (cred.type === "oauth") {
		const access = normalizeOptionalString(cred.access) ?? "";
		const refresh = normalizeOptionalString(cred.refresh) ?? "";
		const expires = asDateTimestampMs(cred.expires);
		if (!access || !refresh || expires === void 0 || expires <= 0) return null;
		return {
			type: "oauth",
			access,
			refresh,
			expires
		};
	}
	return null;
}
/** Build one canonically selected credential per normalized provider. */
function resolveAgentCredentialMapFromStore(store, options) {
	const credentials = {};
	for (const credential of Object.values(store.profiles)) {
		const provider = normalizeProviderId(credential.provider ?? "");
		if (!provider) continue;
		if (credentials[provider]) continue;
		const profileIds = resolveAuthProfileOrder({
			cfg: options?.config,
			store,
			provider,
			...options?.includeSecretRefPlaceholders === true ? { readinessMode: "read-only" } : {}
		});
		for (const profileId of profileIds) {
			const profile = store.profiles[profileId];
			if (!profile) continue;
			const converted = convertAuthProfileCredentialToAgent(profile, options);
			if (converted) {
				credentials[provider] = converted;
				break;
			}
		}
	}
	return credentials;
}
//#endregion
//#region src/agents/agent-auth-discovery-core.ts
/** Adds provider credentials resolvable from env/config without mutating existing credentials. */
function addEnvBackedAgentCredentials(credentials, options = {}) {
	const env = options.env ?? process.env;
	const { aliasMap, envCandidateMap: candidateMap, authEvidenceMap } = resolveProviderEnvAuthLookupMaps({
		config: options.config,
		workspaceDir: options.workspaceDir,
		env
	});
	const next = { ...credentials };
	for (const provider of listProviderEnvAuthLookupKeys({
		envCandidateMap: candidateMap,
		authEvidenceMap
	})) {
		if (next[provider]) continue;
		const resolved = resolveEnvApiKey(provider, env, {
			config: options.config,
			workspaceDir: options.workspaceDir,
			aliasMap,
			candidateMap,
			authEvidenceMap
		});
		if (!resolved?.apiKey) continue;
		next[provider] = {
			type: "api_key",
			key: resolved.apiKey
		};
	}
	return next;
}
//#endregion
//#region src/agents/agent-auth-discovery.ts
/** Discovers agent runtime credentials from auth profiles, env, and synthetic providers. */
/** Resolves agent credentials from auth profiles, env, and synthetic auth hooks. */
function resolveAgentCredentialsForDiscovery(agentDir, options) {
	const storeOptions = {
		allowKeychainPrompt: false,
		...options?.config ? { config: options.config } : {},
		...options?.externalCli ? { externalCli: options.externalCli } : {},
		...options?.inheritedAuthDir ? { inheritedAuthDir: options.inheritedAuthDir } : {}
	};
	const credentials = addEnvBackedAgentCredentials(resolveAgentCredentialMapFromStore(options?.skipExternalAuthProfiles === true ? options.readOnly === true ? loadAuthProfileStoreWithoutExternalProfiles(agentDir, options.inheritedAuthDir ? { inheritedAuthDir: options.inheritedAuthDir } : void 0) : ensureAuthProfileStoreWithoutExternalProfiles(agentDir, {
		allowKeychainPrompt: false,
		...options?.inheritedAuthDir ? { inheritedAuthDir: options.inheritedAuthDir } : {}
	}) : options?.readOnly === true ? options.externalCli || options.config || options.inheritedAuthDir ? loadAuthProfileStoreForRuntime(agentDir, {
		readOnly: true,
		...storeOptions
	}) : loadAuthProfileStoreForSecretsRuntime(agentDir) : ensureAuthProfileStore(agentDir, storeOptions), {
		includeSecretRefPlaceholders: options?.readOnly === true,
		config: options?.config
	}), {
		config: options?.config,
		workspaceDir: options?.workspaceDir,
		env: options?.env
	});
	const syntheticAuthProviderRefs = options?.syntheticAuthProviderRefs ?? resolveRuntimeSyntheticAuthProviderRefs();
	for (const provider of syntheticAuthProviderRefs) {
		if (credentials[provider]) continue;
		const apiKey = resolveProviderSyntheticAuthWithPlugin({
			provider,
			context: {
				config: void 0,
				provider,
				providerConfig: void 0
			}
		})?.apiKey?.trim();
		if (!apiKey) continue;
		credentials[provider] = {
			type: "api_key",
			key: apiKey
		};
	}
	return credentials;
}
//#endregion
//#region src/agents/agent-model-discovery.ts
/** Discovers agent models and auth storage with provider/plugin normalization hooks. */
/** Applies plugin model normalization and transport hooks to discovered agent models. */
function normalizeDiscoveredAgentModel(value, agentDir, options) {
	if (!isRecord(value)) return value;
	if (typeof value.id !== "string" || typeof value.name !== "string" || typeof value.provider !== "string") return value;
	const model = value;
	const runtimeContext = {
		...options?.config !== void 0 ? { config: options.config } : {},
		...options?.workspaceDir !== void 0 ? { workspaceDir: options.workspaceDir } : {}
	};
	const pluginNormalized = normalizeProviderResolvedModelWithPlugin({
		provider: model.provider,
		modelId: model.id,
		...runtimeContext,
		context: {
			provider: model.provider,
			modelId: model.id,
			model,
			agentDir
		}
	}) ?? model;
	const transportNormalized = applyProviderResolvedTransportWithPlugin({
		provider: model.provider,
		modelId: model.id,
		...runtimeContext,
		context: {
			provider: model.provider,
			modelId: model.id,
			model: pluginNormalized,
			agentDir
		}
	}) ?? pluginNormalized;
	if (!isRecord(transportNormalized) || typeof transportNormalized.id !== "string" || typeof transportNormalized.name !== "string" || typeof transportNormalized.provider !== "string" || typeof transportNormalized.api !== "string") return value;
	return normalizeModelCompat(transportNormalized);
}
function createOpenClawModelRegistry(authStorage, modelsJsonPath, agentDir, options) {
	const pluginMetadataSnapshot = resolveModelPluginMetadataSnapshot({
		...options?.config ? { config: options.config } : {},
		...options?.pluginMetadataSnapshot ? { pluginMetadataSnapshot: options.pluginMetadataSnapshot } : {},
		...options?.workspaceDir ? { workspaceDir: options.workspaceDir } : {},
		allowWorkspaceScopedCurrent: options?.workspaceDir === void 0,
		useRuntimeConfig: options?.config === void 0
	});
	const registryOptions = pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {};
	const registry = ModelRegistry.create(authStorage, modelsJsonPath, registryOptions);
	const getAll = registry.getAll.bind(registry);
	const getAvailable = registry.getAvailable.bind(registry);
	const find = registry.find.bind(registry);
	const refresh = registry.refresh.bind(registry);
	const providerFilter = options?.providerFilter ? normalizeProviderId(options.providerFilter) : "";
	const matchesProviderFilter = (entry) => !providerFilter || normalizeProviderId(entry.provider) === providerFilter;
	const shouldNormalize = options?.normalizeModels !== false;
	const findCache = /* @__PURE__ */ new Map();
	const normalizeEntry = (entry) => shouldNormalize ? normalizeDiscoveredAgentModel(entry, agentDir, options) : entry;
	registry.getAll = () => {
		const entries = getAll().filter((entry) => matchesProviderFilter(entry));
		return shouldNormalize ? entries.map(normalizeEntry) : entries;
	};
	registry.getAvailable = () => {
		const entries = getAvailable().filter((entry) => matchesProviderFilter(entry));
		return shouldNormalize ? entries.map(normalizeEntry) : entries;
	};
	registry.find = (provider, modelId) => {
		const key = `${normalizeProviderId(provider)}\0${modelId}`;
		if (findCache.has(key)) return findCache.get(key);
		const fallbackEntry = find(provider, modelId);
		const resolved = fallbackEntry ? normalizeEntry(fallbackEntry) : void 0;
		findCache.set(key, resolved);
		return resolved;
	};
	registry.refresh = () => {
		findCache.clear();
		return refresh();
	};
	return registry;
}
/** Creates auth storage for model discovery from stored and env-backed credentials. */
/** Builds auth storage for model discovery without prompting for secrets. */
function discoverAuthStorage(agentDir, options) {
	const credentials = options?.skipCredentials === true ? {} : resolveAgentCredentialsForDiscovery(agentDir, options);
	return AuthStorage.inMemory(credentials);
}
/** Creates the model registry used by agent model discovery. */
/** Creates a model registry for one agent directory, optionally filtered and plugin-normalized. */
function discoverModels(authStorage, agentDir, options) {
	return createOpenClawModelRegistry(authStorage, path.join(agentDir, "models.json"), agentDir, options);
}
//#endregion
//#region src/agents/prepared-model-runtime.owner.ts
/** Construction and owner identity for prepared model runtime generations. */
const MODEL_RUNTIME_PROVIDER_DISCOVERY_TIMEOUT_MS = 5e3;
var PreparedModelRuntimeOwnerNotPublishedError = class extends Error {};
var PreparedModelRuntimePublicationSupersededError = class extends PreparedModelRuntimeOwnerNotPublishedError {};
function rebindInputToCommittedConfiguredOwner(owners, rawInput) {
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const committed = [...owners.values()].filter((owner) => owner.provenance === "configured" && owner.snapshot && !owner.needsRefresh && !owner.pending);
	const identityCandidates = input.agentId === void 0 ? [] : committed.filter((owner) => owner.input.agentId === input.agentId);
	const exactCandidates = identityCandidates.filter((owner) => owner.input.agentDir === input.agentDir);
	const directoryCandidates = committed.filter((owner) => owner.input.agentDir === input.agentDir);
	const canRebindByDirectory = input.agentId === void 0 || isReservedSystemAgentId(input.agentId);
	const candidates = exactCandidates.length > 0 ? exactCandidates : canRebindByDirectory && directoryCandidates.length > 0 ? directoryCandidates : identityCandidates;
	if (candidates.length !== 1) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model runtime owner was not committed after replacement for ${input.agentDir}`);
	const owner = candidates[0];
	const preserveWorkspaceDir = input.preserveWorkspaceDirOnRefresh === true && input.workspaceDir !== void 0;
	const agentId = input.agentId ?? owner.input.agentId;
	return normalizePreparedModelRuntimeInput({
		...input,
		...agentId ? { agentId } : {},
		agentDir: owner.input.agentDir,
		config: owner.input.config,
		inheritedAuthDir: owner.input.inheritedAuthDir,
		env: owner.input.env,
		workspaceDir: preserveWorkspaceDir ? input.workspaceDir : owner.input.workspaceDir,
		preserveWorkspaceDirOnRefresh: preserveWorkspaceDir
	});
}
/** Accepts canonical config clones without weakening projected-config isolation. */
function preparedModelRuntimeConfigsMatch(left, right) {
	if (left === right) return true;
	try {
		return hashRuntimeConfigValue(left) === hashRuntimeConfigValue(right);
	} catch {
		return false;
	}
}
function normalizeOptionalDir(dirname) {
	return dirname ? path.resolve(dirname) : void 0;
}
function normalizePreparedModelRuntimeInput(input) {
	const { inheritedAuthDir: _inheritedAuthDir, readOnly, skipCredentials, workspaceDir: _workspaceDir, ...rest } = input;
	const inheritedAuthDir = normalizeOptionalDir(input.inheritedAuthDir ?? resolveDefaultAgentDir(input.config, input.env));
	const workspaceDir = normalizeOptionalDir(input.workspaceDir);
	const env = input.env ? Object.freeze({ ...input.env }) : void 0;
	return {
		...rest,
		agentDir: path.resolve(input.agentDir),
		...inheritedAuthDir ? { inheritedAuthDir } : {},
		...readOnly === true ? { readOnly: true } : {},
		...skipCredentials === true ? { skipCredentials: true } : {},
		...workspaceDir ? { workspaceDir } : {},
		...env ? { env } : {}
	};
}
function environmentFingerprint(env) {
	return env ? hashRuntimeConfigValue(env) : void 0;
}
function effectiveEnvironmentFingerprint(input) {
	return hashRuntimeConfigValue(input.env ?? process.env);
}
function isCatalogModelApi(value) {
	return value !== void 0 && MODEL_APIS.includes(value);
}
function toStaticCatalogEntry(model) {
	return {
		id: model.id,
		name: model.name ?? model.id,
		provider: model.provider,
		...isCatalogModelApi(model.api) ? { api: model.api } : {},
		...model.baseUrl ? { baseUrl: model.baseUrl } : {},
		...model.contextWindow ? { contextWindow: model.contextWindow } : {},
		...model.contextTokens ? { contextTokens: model.contextTokens } : {},
		...model.reasoning !== void 0 ? { reasoning: model.reasoning } : {},
		...model.input ? { input: model.input } : {},
		...model.params ? { params: model.params } : {},
		...model.compat ? { compat: model.compat } : {},
		...model.mediaInput ? { mediaInput: model.mediaInput } : {}
	};
}
function ownerKey(input) {
	return JSON.stringify({
		agentId: input.agentId,
		agentDir: input.agentDir,
		inheritedAuthDir: input.inheritedAuthDir,
		readOnly: input.readOnly === true,
		skipCredentials: input.skipCredentials === true,
		workspaceDir: input.workspaceDir,
		env: environmentFingerprint(input.env),
		config: input.readOnly ? hashRuntimeConfigValue(input.config) : void 0
	});
}
function resolvePublishedOwner(owners, input, options = {}) {
	const exact = owners.get(ownerKey(input));
	if (exact) return exact;
	if (!options.allowConfiguredWorkspaceFallback) return;
	const candidates = [...owners.values()].filter((owner) => owner.provenance === "configured" && (input.agentId === void 0 || owner.input.agentId === input.agentId) && owner.input.agentDir === input.agentDir && owner.input.inheritedAuthDir === input.inheritedAuthDir && owner.input.readOnly === input.readOnly && owner.input.skipCredentials === input.skipCredentials && (input.env === void 0 || owner.environmentFingerprint === environmentFingerprint(input.env)) && (input.workspaceDir === void 0 || owner.input.workspaceDir === input.workspaceDir));
	return candidates.length === 1 ? candidates[0] : void 0;
}
function hasSameLifecycleInput(left, right) {
	return left.config === right.config && left.agentId === right.agentId && left.inheritedAuthDir === right.inheritedAuthDir && left.readOnly === right.readOnly && left.skipCredentials === right.skipCredentials && left.workspaceDir === right.workspaceDir && environmentFingerprint(left.env) === environmentFingerprint(right.env) && left.preserveWorkspaceDirOnRefresh === right.preserveWorkspaceDirOnRefresh;
}
function toError(error) {
	return error instanceof Error ? error : new Error(String(error));
}
function createPreparedModelRuntimeReplacement() {
	let resolve;
	let reject;
	const promise = new Promise((resolvePromise, rejectPromise) => {
		resolve = resolvePromise;
		reject = rejectPromise;
	});
	promise.catch(() => void 0);
	return {
		gateId: Symbol("prepared-model-runtime-replacement"),
		promise,
		resolve,
		reject
	};
}
function listConfiguredOwnerInputs(config, defaultWorkspaceDir) {
	const inheritedAuthDir = resolveDefaultAgentDir(config);
	const defaultAgentId = resolveDefaultAgentId(config);
	return listAgentIds(config).map((agentId) => {
		const preserveWorkspaceDirOnRefresh = agentId === defaultAgentId && defaultWorkspaceDir;
		const input = {
			agentId,
			agentDir: resolveAgentDir(config, agentId),
			config,
			inheritedAuthDir,
			workspaceDir: preserveWorkspaceDirOnRefresh ? defaultWorkspaceDir : resolveAgentWorkspaceDir(config, agentId)
		};
		if (preserveWorkspaceDirOnRefresh) input.preserveWorkspaceDirOnRefresh = true;
		return input;
	});
}
async function buildSnapshot(input) {
	const env = input.env ?? process.env;
	if (!input.readOnly) ensureRuntimePluginsLoaded({
		config: input.config,
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
	});
	const pluginMetadataSnapshot = resolvePluginMetadataSnapshot({
		config: input.config,
		env,
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
	});
	if (!input.readOnly) await ensureOpenClawModelsJson(input.config, input.agentDir, {
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...input.env ? { env } : {},
		providerDiscoveryTimeoutMs: MODEL_RUNTIME_PROVIDER_DISCOVERY_TIMEOUT_MS
	});
	const templateAuthStorage = discoverAuthStorage(input.agentDir, {
		config: input.config,
		readOnly: true,
		...input.skipCredentials ? { skipCredentials: true } : {},
		...input.inheritedAuthDir ? { inheritedAuthDir: input.inheritedAuthDir } : {},
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...input.env ? { env } : {}
	});
	const templateModelRegistry = discoverModels(templateAuthStorage, input.agentDir, {
		config: input.config,
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}
	});
	const credentials = templateAuthStorage.getAll();
	const modelCatalog = await buildPreparedModelCatalogSnapshot({
		agentDir: input.agentDir,
		authCredentials: credentials,
		config: input.config,
		modelRegistry: templateModelRegistry,
		metadataSnapshot: pluginMetadataSnapshot,
		...input.env ? { env } : {},
		...input.readOnly ? { readOnly: true } : {},
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
	});
	const staticEntries = (await loadBundledProviderStaticCatalogContextModels({
		cfg: input.config,
		env,
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
	})).map(toStaticCatalogEntry);
	const createStores = () => {
		const authStorage = AuthStorage.inMemory(credentials);
		return {
			authStorage,
			modelRegistry: templateModelRegistry.fork(authStorage)
		};
	};
	return Object.freeze({
		...input.agentId ? { agentId: input.agentId } : {},
		agentDir: input.agentDir,
		...input.inheritedAuthDir ? { inheritedAuthDir: input.inheritedAuthDir } : {},
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		config: input.config,
		metadataSnapshot: pluginMetadataSnapshot,
		modelCatalog: {
			...modelCatalog,
			staticEntries
		},
		createStores
	});
}
function startSerializedSnapshotBuild(input, agentBuildCompletions, buildTimeoutMs) {
	const previousBuildCompletion = agentBuildCompletions.get(input.agentDir);
	const startBuild = (async () => {
		if (previousBuildCompletion) await previousBuildCompletion;
		return { actualBuild: buildSnapshot(input) };
	})();
	const completion = startBuild.then(async ({ actualBuild }) => await actualBuild).then(() => void 0, () => void 0);
	agentBuildCompletions.set(input.agentDir, completion);
	completion.then(() => {
		if (agentBuildCompletions.get(input.agentDir) === completion) agentBuildCompletions.delete(input.agentDir);
	});
	return {
		pending: withTimeout(async () => {
			const { actualBuild } = await startBuild;
			return await actualBuild;
		}, buildTimeoutMs, "prepared model runtime publication"),
		completion
	};
}
async function publishModelRuntimeSnapshot(input, owners, agentBuildCompletions, buildTimeoutMs, existing, provenance = "explicit") {
	const key = ownerKey(input);
	const owner = existing ?? {
		input,
		environmentFingerprint: effectiveEnvironmentFingerprint(input),
		provenance,
		generation: 0,
		needsRefresh: false
	};
	owner.input = input;
	owner.environmentFingerprint = effectiveEnvironmentFingerprint(input);
	owner.provenance = provenance;
	owner.generation += 1;
	owner.needsRefresh = true;
	owner.refreshError = void 0;
	const generation = owner.generation;
	const build = startSerializedSnapshotBuild(input, agentBuildCompletions, buildTimeoutMs);
	owner.buildCompletion = build.completion;
	build.completion.then(() => {
		if (owner.buildCompletion === build.completion) owner.buildCompletion = void 0;
	});
	owners.set(key, owner);
	const publication = (async () => {
		try {
			const snapshot = await build.pending;
			if (owner.generation !== generation || owners.get(key) !== owner) throw new PreparedModelRuntimePublicationSupersededError(`prepared model runtime publication was superseded for ${input.agentDir}`);
			owner.snapshot = snapshot;
			owner.pending = void 0;
			owner.needsRefresh = false;
			return snapshot;
		} catch (error) {
			const refreshError = toError(error);
			if (owner.generation === generation && owners.get(key) === owner) {
				owner.pending = void 0;
				owner.needsRefresh = true;
				owner.refreshError = refreshError;
			}
			throw refreshError;
		}
	})();
	owner.pending = publication;
	return await publication;
}
//#endregion
//#region src/agents/prepared-model-runtime.ts
const log = createSubsystemLogger("agents/prepared-model-runtime");
const DEFAULT_MODEL_RUNTIME_BUILD_TIMEOUT_MS = 3e4;
let modelRuntimeBuildTimeoutMs = DEFAULT_MODEL_RUNTIME_BUILD_TIMEOUT_MS;
const owners = /* @__PURE__ */ new Map();
const agentBuildCompletions = /* @__PURE__ */ new Map();
const standaloneActivationTails = /* @__PURE__ */ new Map();
let retainedDirectRunOwner;
let gatewayLifecycleActive = false;
let refreshTail = Promise.resolve();
let refreshRequestEpoch = 0;
let pendingModelRuntimeReplacement;
const pendingAuthMutations = [];
/** Resolves a published owner or activates a standalone lifecycle owner. */
async function loadPreparedModelRuntimeSnapshot(rawInput) {
	let input = normalizePreparedModelRuntimeInput({
		...rawInput,
		preserveWorkspaceDirOnRefresh: rawInput.preserveWorkspaceDirOnRefresh ?? rawInput.workspaceDir !== void 0
	});
	for (;;) {
		const replacement = pendingModelRuntimeReplacement;
		if (replacement) {
			await replacement.promise;
			if (pendingModelRuntimeReplacement) continue;
			input = rebindInputToCommittedConfiguredOwner(owners, input);
			continue;
		}
		try {
			return await prepareModelRuntimeSnapshot(input);
		} catch (error) {
			if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
		}
		const activationGate = pendingModelRuntimeReplacement;
		if (activationGate) {
			await activationGate.promise;
			if (pendingModelRuntimeReplacement) continue;
			input = rebindInputToCommittedConfiguredOwner(owners, input);
			continue;
		}
		const activated = await activateStandalonePreparedModelRuntime(input);
		const replacementAfterActivation = pendingModelRuntimeReplacement;
		if (replacementAfterActivation) {
			await replacementAfterActivation.promise;
			if (pendingModelRuntimeReplacement) continue;
			input = rebindInputToCommittedConfiguredOwner(owners, input);
			continue;
		}
		if (!activated) return await prepareModelRuntimeSnapshot(input);
		try {
			return await prepareModelRuntimeSnapshot(input);
		} catch (error) {
			if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
		}
	}
}
/** Returns an already-published generation without starting discovery. */
function getPreparedModelRuntimeSnapshot(rawInput) {
	if (pendingModelRuntimeReplacement) return;
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const owner = resolvePublishedOwner(owners, input, { allowConfiguredWorkspaceFallback: rawInput.workspaceDir === void 0 || rawInput.agentId === void 0 });
	if (!owner?.snapshot || owner.needsRefresh || owner.pending) return;
	if (input.readOnly && !preparedModelRuntimeConfigsMatch(owner.input.config, input.config)) return;
	return owner.snapshot;
}
/** Publishes one owner from an explicit startup/activation lifecycle boundary. */
async function publishPreparedModelRuntimeSnapshot(rawInput, options = {}) {
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const existing = owners.get(ownerKey(input));
	if (existing?.pending) {
		if (!options.force && hasSameLifecycleInput(existing.input, input)) return await existing.pending;
		return await publishModelRuntimeSnapshot(input, owners, agentBuildCompletions, modelRuntimeBuildTimeoutMs, existing, options.provenance);
	}
	if (existing?.buildCompletion) throw existing.refreshError ?? /* @__PURE__ */ new Error(`prepared model runtime build is still settling for ${input.agentDir}`);
	if (existing?.snapshot && !existing.needsRefresh && !options.force && hasSameLifecycleInput(existing.input, input)) return existing.snapshot;
	return await publishModelRuntimeSnapshot(input, owners, agentBuildCompletions, modelRuntimeBuildTimeoutMs, existing, options.provenance);
}
/** Activates lifecycle publication for direct embedded runtimes without a gateway startup. */
async function activateStandalonePreparedModelRuntime(rawInput) {
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const key = ownerKey(input);
	const activation = (standaloneActivationTails.get(key) ?? Promise.resolve()).then(async () => await activateStandalonePreparedModelRuntimeNow(input));
	const tail = activation.then(() => void 0, () => void 0);
	standaloneActivationTails.set(key, tail);
	try {
		return await activation;
	} finally {
		if (standaloneActivationTails.get(key) === tail) standaloneActivationTails.delete(key);
	}
}
async function activateStandalonePreparedModelRuntimeNow(input) {
	for (;;) {
		const overlapsConfiguredOwner = [...owners.values()].some((owner) => owner.provenance === "configured" && owner.input.agentDir === input.agentDir && (input.agentId === void 0 || owner.input.agentId === input.agentId) && (input.workspaceDir === void 0 || owner.input.workspaceDir === input.workspaceDir));
		if (gatewayLifecycleActive && (!input.readOnly || overlapsConfiguredOwner)) return;
		try {
			return await publishPreparedModelRuntimeSnapshot({
				...input,
				preserveWorkspaceDirOnRefresh: input.workspaceDir !== void 0
			}, { provenance: "standalone" });
		} catch (error) {
			if (!(error instanceof PreparedModelRuntimePublicationSupersededError)) throw error;
			const replacement = pendingModelRuntimeReplacement;
			if (replacement) await replacement.promise;
		}
	}
}
async function acquirePreparedModelRuntimeLease(rawInput, provenance, options = {}) {
	let input = normalizePreparedModelRuntimeInput({
		...rawInput,
		preserveWorkspaceDirOnRefresh: rawInput.preserveWorkspaceDirOnRefresh ?? rawInput.workspaceDir !== void 0
	});
	let key = ownerKey(input);
	let owner;
	let snapshot;
	for (;;) {
		const replacement = pendingModelRuntimeReplacement;
		if (replacement) {
			await replacement.promise;
			if (pendingModelRuntimeReplacement) continue;
			input = rebindInputToCommittedConfiguredOwner(owners, input);
			key = ownerKey(input);
			continue;
		}
		let existing = owners.get(key);
		let staleDynamicOwner = existing?.needsRefresh && !existing.pending && (existing.provenance === "run" || existing.provenance === "ephemeral");
		if (gatewayLifecycleActive && provenance === "run" && (!existing || staleDynamicOwner)) {
			input = rebindInputToCommittedConfiguredOwner(owners, input);
			key = ownerKey(input);
			existing = owners.get(key);
			staleDynamicOwner = existing?.needsRefresh && !existing.pending && (existing.provenance === "run" || existing.provenance === "ephemeral");
		}
		try {
			if (staleDynamicOwner) snapshot = await publishModelRuntimeSnapshot(input, owners, agentBuildCompletions, modelRuntimeBuildTimeoutMs, void 0, provenance);
			else if (existing) snapshot = await prepareModelRuntimeSnapshot(input);
			else snapshot = await publishPreparedModelRuntimeSnapshot(input, { provenance });
		} catch (error) {
			if (error instanceof PreparedModelRuntimePublicationSupersededError) continue;
			throw error;
		}
		const published = owners.get(key);
		if (pendingModelRuntimeReplacement || !published || published.snapshot !== snapshot || published.needsRefresh || published.pending) continue;
		owner = published;
		break;
	}
	if (owner.provenance !== provenance) return {
		snapshot,
		release: () => {}
	};
	if (provenance === "run" && options.retainIdleRunOwner) {
		const previous = retainedDirectRunOwner;
		retainedDirectRunOwner = {
			key,
			owner
		};
		if (previous && previous.owner !== owner && (previous.owner.leaseCount ?? 0) === 0 && owners.get(previous.key) === previous.owner) owners.delete(previous.key);
	}
	owner.leaseCount = (owner.leaseCount ?? 0) + 1;
	let released = false;
	return {
		snapshot,
		release: () => {
			if (released) return;
			released = true;
			owner.leaseCount = Math.max(0, (owner.leaseCount ?? 1) - 1);
			if (owner.leaseCount === 0 && owners.get(key) === owner) {
				if (retainedDirectRunOwner?.owner !== owner) owners.delete(key);
			}
		}
	};
}
/** Acquires the exact writable workspace generation at agent-run admission. */
async function acquireAgentRunPreparedModelRuntime(rawInput, options = {}) {
	return await acquirePreparedModelRuntimeLease(rawInput, "run", options);
}
/** Acquires a one-read metadata generation without retaining a dynamic workspace owner. */
async function acquireReadOnlyPreparedModelRuntime(rawInput) {
	return await acquirePreparedModelRuntimeLease({
		...rawInput,
		readOnly: true
	}, "ephemeral");
}
/** Returns the snapshot published by the lifecycle owner. Request config cannot replace it. */
async function prepareModelRuntimeSnapshot(rawInput) {
	const replacement = pendingModelRuntimeReplacement;
	if (replacement) {
		await replacement.promise;
		return await prepareModelRuntimeSnapshot(rawInput);
	}
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const existing = resolvePublishedOwner(owners, input, { allowConfiguredWorkspaceFallback: rawInput.workspaceDir === void 0 || rawInput.agentId === void 0 });
	if (input.readOnly && existing && !preparedModelRuntimeConfigsMatch(existing.input.config, input.config)) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared read-only model runtime owner was not published for the requested config (${input.agentDir})`);
	if (existing?.pending) {
		try {
			await existing.pending;
		} catch {}
		return await prepareModelRuntimeSnapshot(rawInput);
	}
	if (existing?.needsRefresh) throw existing.refreshError ?? /* @__PURE__ */ new Error("prepared model runtime refresh is pending");
	if (existing?.snapshot) return existing.snapshot;
	throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model runtime owner was not published for ${input.agentDir}`);
}
/** Invalidates every published generation before config/plugin runtime replacement. */
function markPreparedModelRuntimeSnapshotsStale(reason = "prepared model runtime owner is stale after config publication", options = {}) {
	if (options.waitForReplacement) {
		const superseded = pendingModelRuntimeReplacement;
		pendingModelRuntimeReplacement = createPreparedModelRuntimeReplacement();
		superseded?.resolve();
	} else if (!options.preserveReplacementWait && pendingModelRuntimeReplacement) {
		const cancelled = pendingModelRuntimeReplacement;
		pendingModelRuntimeReplacement = void 0;
		cancelled.resolve();
	}
	refreshRequestEpoch += 1;
	const staleError = new Error(reason);
	for (const [key, owner] of owners) {
		if (owner.provenance === "standalone") {
			owner.generation += 1;
			owners.delete(key);
			continue;
		}
		owner.generation += 1;
		owner.needsRefresh = true;
		owner.refreshError = staleError;
	}
	return pendingModelRuntimeReplacement?.gateId;
}
/** Rejects readers waiting for a replacement when its owning reload cannot continue. */
function rejectPendingPreparedModelRuntimeReplacement(gateId, error) {
	const replacement = pendingModelRuntimeReplacement;
	if (!replacement || !gateId || replacement.gateId !== gateId) return;
	pendingModelRuntimeReplacement = void 0;
	replacement.reject(toError(error));
}
/** Rebuilds active owners after config/plugin runtime publication. */
async function refreshPreparedModelRuntimeSnapshotsNow(config, options = {}) {
	if (options.gatewayLifecycle) gatewayLifecycleActive = true;
	const staleError = /* @__PURE__ */ new Error("prepared model runtime owner is stale after config publication");
	for (const owner of owners.values()) {
		owner.generation += 1;
		owner.needsRefresh = true;
		owner.refreshError = staleError;
	}
	const entries = [];
	const knownKeys = /* @__PURE__ */ new Set();
	for (const rawInput of listConfiguredOwnerInputs(config, options.defaultWorkspaceDir)) {
		let input = normalizePreparedModelRuntimeInput(rawInput);
		const preservedOwner = [...owners.values()].find((owner) => owner.provenance === "configured" && owner.input.agentId === input.agentId && owner.input.agentDir === input.agentDir && owner.input.preserveWorkspaceDirOnRefresh && owner.input.workspaceDir);
		if (preservedOwner?.input.workspaceDir) input = {
			...input,
			workspaceDir: preservedOwner.input.workspaceDir,
			preserveWorkspaceDirOnRefresh: true
		};
		const key = ownerKey(input);
		if (knownKeys.has(key)) continue;
		knownKeys.add(key);
		const owner = owners.get(key);
		entries.push({
			owner,
			input
		});
	}
	for (const [key, owner] of owners) if (!knownKeys.has(key) && (gatewayLifecycleActive || owner.provenance === "configured")) owners.delete(key);
	const candidates = entries.map(({ owner: existing, input }) => {
		const owner = existing?.provenance === "configured" ? existing : {
			input,
			environmentFingerprint: effectiveEnvironmentFingerprint(input),
			provenance: "configured",
			generation: 0,
			needsRefresh: true
		};
		owner.input = input;
		owner.environmentFingerprint = effectiveEnvironmentFingerprint(input);
		owner.provenance = "configured";
		owner.generation += 1;
		owner.needsRefresh = true;
		owner.refreshError = void 0;
		const generation = owner.generation;
		const build = startSerializedSnapshotBuild(input, agentBuildCompletions, modelRuntimeBuildTimeoutMs);
		owner.buildCompletion = build.completion;
		owners.set(ownerKey(input), owner);
		build.completion.then(() => {
			if (owner.buildCompletion === build.completion) owner.buildCompletion = void 0;
		});
		return {
			build,
			generation,
			owner
		};
	});
	const publication = (async () => {
		try {
			const snapshots = await Promise.all(candidates.map(({ build }) => build.pending));
			for (const [index, candidate] of candidates.entries()) {
				if (candidate.owner.generation !== candidate.generation) continue;
				candidate.owner.snapshot = snapshots[index];
				candidate.owner.pending = void 0;
				candidate.owner.needsRefresh = false;
			}
			return snapshots;
		} catch (error) {
			const refreshError = toError(error);
			await Promise.allSettled(candidates.map(({ build }) => build.pending));
			for (const candidate of candidates) {
				if (candidate.owner.generation !== candidate.generation) continue;
				candidate.owner.pending = void 0;
				candidate.owner.needsRefresh = true;
				candidate.owner.refreshError = refreshError;
			}
			throw refreshError;
		}
	})();
	for (const [index, candidate] of candidates.entries()) {
		const pending = publication.then((snapshots) => snapshots[index]);
		candidate.owner.pending = pending;
		pending.catch(() => void 0);
	}
	await publication;
}
/** Serializes config/plugin publications so only the latest completed refresh retires owners. */
function refreshPreparedModelRuntimeSnapshots(config, options = {}) {
	markPreparedModelRuntimeSnapshotsStale(void 0, { waitForReplacement: true });
	const requestEpoch = refreshRequestEpoch;
	const replacement = pendingModelRuntimeReplacement;
	return enqueuePreparedModelRuntimePublication(async () => {
		if (requestEpoch !== refreshRequestEpoch) return;
		await refreshPreparedModelRuntimeSnapshotsNow(config, options);
		if (requestEpoch !== refreshRequestEpoch) return;
		await drainPendingAuthMutations();
	}).then(() => {
		if (requestEpoch === refreshRequestEpoch && replacement && pendingModelRuntimeReplacement === replacement) {
			pendingModelRuntimeReplacement = void 0;
			replacement.resolve();
		}
	}, (error) => {
		const refreshError = toError(error);
		if (requestEpoch === refreshRequestEpoch) for (const owner of owners.values()) {
			owner.generation += 1;
			owner.pending = void 0;
			owner.needsRefresh = true;
			owner.refreshError = refreshError;
		}
		if (requestEpoch === refreshRequestEpoch && replacement && pendingModelRuntimeReplacement === replacement) {
			pendingModelRuntimeReplacement = void 0;
			replacement.reject(refreshError);
		}
		throw refreshError;
	});
}
function enqueuePreparedModelRuntimePublication(task) {
	const publication = refreshTail.then(task);
	refreshTail = publication.then(() => void 0, () => void 0);
	return publication;
}
async function drainPendingAuthMutations() {
	while (pendingAuthMutations.length > 0) {
		const events = pendingAuthMutations.splice(0);
		for (const event of events) event.agentDir = normalizeOptionalDir(event.agentDir);
		const entries = [];
		for (const owner of owners.values()) if (events.some((event) => event.affectsInheritedStores || owner.input.agentDir === event.agentDir || owner.input.inheritedAuthDir === event.agentDir)) entries.push({
			owner,
			input: owner.input
		});
		const failures = (await Promise.allSettled(entries.map(async ({ owner, input }) => await publishPreparedModelRuntimeSnapshot(input, {
			force: true,
			provenance: owner.provenance
		})))).flatMap((result) => result.status === "rejected" && !(result.reason instanceof PreparedModelRuntimePublicationSupersededError) ? [result.reason] : []);
		if (failures.length === 1) throw failures[0];
		if (failures.length > 1) throw new AggregateError(failures, `${failures.length} model runtime owner refreshes failed`);
	}
}
function invalidateForAuthMutation(event) {
	const normalizedEvent = {
		...event,
		agentDir: normalizeOptionalDir(event.agentDir)
	};
	const staleError = /* @__PURE__ */ new Error("prepared model runtime owner is stale after auth mutation");
	let invalidatedOwner = false;
	for (const owner of owners.values()) {
		if (!normalizedEvent.affectsInheritedStores && owner.input.agentDir !== normalizedEvent.agentDir && owner.input.inheritedAuthDir !== normalizedEvent.agentDir) continue;
		invalidatedOwner = true;
		owner.generation += 1;
		owner.needsRefresh = true;
		owner.refreshError = staleError;
	}
	if (!invalidatedOwner) return;
	pendingAuthMutations.push(normalizedEvent);
	enqueuePreparedModelRuntimePublication(drainPendingAuthMutations).catch((error) => {
		if (error instanceof PreparedModelRuntimePublicationSupersededError) return;
		log.warn(`auth-triggered model runtime refresh failed: ${String(error)}`);
	});
}
registerRuntimeAuthProfileStoreMutationListener(invalidateForAuthMutation);
function resetPreparedModelRuntimeSnapshotsForTest() {
	pendingModelRuntimeReplacement?.resolve();
	pendingModelRuntimeReplacement = void 0;
	owners.clear();
	agentBuildCompletions.clear();
	standaloneActivationTails.clear();
	retainedDirectRunOwner = void 0;
	gatewayLifecycleActive = false;
	refreshTail = Promise.resolve();
	refreshRequestEpoch = 0;
	pendingAuthMutations.length = 0;
	modelRuntimeBuildTimeoutMs = DEFAULT_MODEL_RUNTIME_BUILD_TIMEOUT_MS;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.preparedModelRuntimeTestApi")] = {
	resetPreparedModelRuntimeSnapshotsForTest,
	setModelRuntimeBuildTimeoutMsForTest: (timeoutMs) => {
		modelRuntimeBuildTimeoutMs = timeoutMs;
	}
};
//#endregion
export { loadPreparedModelRuntimeSnapshot as a, publishPreparedModelRuntimeSnapshot as c, PreparedModelRuntimeOwnerNotPublishedError as d, preparedModelRuntimeConfigsMatch as f, getPreparedModelRuntimeSnapshot as i, refreshPreparedModelRuntimeSnapshots as l, acquireReadOnlyPreparedModelRuntime as n, markPreparedModelRuntimeSnapshotsStale as o, normalizeDiscoveredAgentModel as p, activateStandalonePreparedModelRuntime as r, prepareModelRuntimeSnapshot as s, acquireAgentRunPreparedModelRuntime as t, rejectPendingPreparedModelRuntimeReplacement as u };
