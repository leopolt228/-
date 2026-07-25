import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { f as safeRealpathSync, i as isPathInside, p as safeStatSync } from "./path-DILYn_gk.js";
import { a as isPluginLifecycleTraceEnabled, n as discoverOpenClawPlugins } from "./discovery-Bhd5Zo0N.js";
import { i as openRootFileSync } from "./root-file-9jkyxRTl.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import "./utils-K2PjeLaV.js";
import { r as resolveConfigEnvVars } from "./env-substitution-CUd6i0EE.js";
import { o as createConfigRuntimeEnv } from "./config-env-vars-9fUuyise.js";
import "./boundary-file-read-BgBHxIxZ.js";
import { l as tryReadJsonSync } from "./json--wG6OtAJ.js";
import "./json-files-2JJFkKam.js";
import { t as PluginLruCache } from "./plugin-cache-primitives-BaxqicKH.js";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-CnjMmIMH.js";
import { i as kindsEqual, r as hasKind } from "./slots-CqNa_aqs.js";
import { n as loadPluginManifestRegistry } from "./manifest-registry-DkJa8Tn0.js";
import "./path-safety-DYp8wadK.js";
import { n as resolveOpenClawDevSourceRoot, t as isBundledPluginInsideDevSourceRoot } from "./dev-source-root-BBoGpDBN.js";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-Ck8FXgzr.js";
import { r as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-DjVucfOz.js";
import { c as normalizePluginsConfig, f as resolveMemorySlotDecision, l as resolveEffectiveEnableState, n as createPluginActivationSource, t as applyTestPluginDefaults, u as resolveEffectivePluginActivationState } from "./config-state-rO7K73Ka.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import { a as resolveManifestOwnerBasePolicyBlock, t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-DDNqTTIl.js";
import { t as validateJsonSchemaValue } from "./schema-validator-fsGhGcGu.js";
import { n as getCachedPluginModuleLoader, o as installOpenClawPluginSdkNativeResolver, t as createPluginModuleLoaderCache, u as toSafeImportPath } from "./plugin-module-loader-cache-BmNGbwiD.js";
import { c as resolvePluginRuntimeModulePathWithDiagnostics, t as buildPluginLoaderAliasMap } from "./sdk-alias-BzrvkJcB.js";
import { c as hasExplicitPluginIdScope, d as serializePluginIdScope, f as fingerprintPluginDiscoveryContext, m as resolvePluginDiscoveryContext, s as createPluginIdScopeSet, u as normalizePluginIdScope } from "./current-plugin-metadata-snapshot-BQju0mzJ.js";
import { u as collectPluginManifestCompatCodes } from "./installed-plugin-index-DlWmC2dq.js";
import { t as unwrapDefaultModuleExport } from "./module-export-DsZgGIbX.js";
import { C as resolveMemoryDreamingPluginConfig, S as resolveMemoryDreamingConfig, c as DEFAULT_MEMORY_DREAMING_PLUGIN_ID } from "./dreaming-BmyNO7Dv.js";
import { C as restoreRegisteredEmbeddingProviders, x as listRegisteredEmbeddingProviders, y as clearEmbeddingProviders } from "./gateway-startup-plugin-ids-DDW1RRDk.js";
import "./env-vars-CdPCvJw6.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { i as listRegisteredAgentHarnesses, s as restoreRegisteredAgentHarnesses, t as clearAgentHarnesses } from "./registry-D03pg4Q5.js";
import { i as withProfile } from "./plugin-load-profile-DuCTWeuT.js";
import { n as attachPluginApiFacades, t as buildPluginApi } from "./api-builder-BOlccqi0.js";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-C5QdhmQ5.js";
import "./installed-plugin-index-records-D6eYE-Kv.js";
import { t as quoteCliArg } from "./quote-cli-arg-BriMa9wW.js";
import { a as restoreDetachedTaskLifecycleRuntimeRegistration, n as getDetachedTaskLifecycleRuntimeRegistration, t as clearDetachedTaskLifecycleRuntimeRegistration } from "./detached-task-runtime-state-BrJUgd0A.js";
import { d as listRegisteredPluginCommands, p as restorePluginCommands, s as clearPluginCommands } from "./command-registration-eT0Xvf3Q.js";
import { F as clearMemoryEmbeddingProviders, G as restoreRegisteredCompactionProviders, H as clearCompactionProviders, V as restoreRegisteredMemoryEmbeddingProviders, W as listRegisteredCompactionProviders, t as createPluginRegistry, z as listRegisteredMemoryEmbeddingProviders } from "./registry-BSBtFA2q.js";
import { D as setActivePluginRegistry, O as createEmptyPluginRegistry, c as getActivePluginRegistry, f as getActivePluginRuntimeSubagentMode, l as getActivePluginRegistryKey, v as recordImportedPluginId } from "./runtime-BapEso0o.js";
import { i as initializeGlobalHookRunner } from "./hook-runner-global-C6QB2pJa.js";
import { c as restorePluginInteractiveHandlers, r as listPluginInteractiveHandlers, t as clearPluginInteractiveHandlers } from "./interactive-registry-DYMqCNCz.js";
import { a as formatPluginVerificationDiagnostic, i as findActiveDegradedPlugin, n as clearActiveDegradedPlugin, r as degradedPluginMatchesRoot } from "./runtime-degraded-state-CbW4-KRp.js";
import { _ as restoreMemoryPluginState, c as listMemoryCorpusSupplements, i as getMemoryCapabilityRegistration, l as listMemoryPromptPreparations, n as clearMemoryPluginState, u as listMemoryPromptSupplements } from "./memory-state-BkKwMbMM.js";
import { i as restoreSessionDiscussionProvider, n as getSessionDiscussionProvider, t as clearSessionDiscussionProvider } from "./session-discussion-registry-C3y7e-bP.js";
import { t as encodeStartupTraceSegment } from "./startup-trace-segment-Cd4cVDJE.js";
import { n as inspectBundleMcpRuntimeSupport } from "./bundle-mcp-CVx224CI.js";
import { a as resolveSetupChannelRegistration, i as resolveBundledRuntimeChannelRegistration, n as loadBundledRuntimeChannelPlugin, o as shouldDeferConfiguredChannelFullRuntimeMerge, r as mergeSetupRuntimeChannelPlugin, s as shouldLoadChannelPluginInSetupRuntime, t as channelPluginIdBelongsToManifest } from "./loader-channel-setup-B_v5send.js";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/loader-cache-state.ts
/** Cache state helper for plugin loader registries, in-flight loads, and warning suppression. */
/** Error thrown when one plugin registry cache key attempts nested loading. */
var PluginLoadReentryError = class extends Error {
	constructor(cacheKey) {
		super(`plugin load reentry detected for cache key: ${cacheKey}`);
		this.name = "PluginLoadReentryError";
		this.cacheKey = cacheKey;
	}
};
/** Small registry cache with reentry detection and per-key warning memory. */
var PluginLoaderCacheState = class {
	#registryCache;
	#inFlightLoads = /* @__PURE__ */ new Set();
	#openAllowlistWarningCache = /* @__PURE__ */ new Set();
	constructor(defaultMaxEntries) {
		this.#registryCache = new PluginLruCache(defaultMaxEntries);
	}
	get maxEntries() {
		return this.#registryCache.maxEntries;
	}
	setMaxEntriesForTest(value) {
		this.#registryCache.setMaxEntriesForTest(value);
	}
	clear() {
		this.#registryCache.clear();
		this.#inFlightLoads.clear();
		this.#openAllowlistWarningCache.clear();
	}
	clearCachedRegistries() {
		this.#registryCache.clear();
		this.#openAllowlistWarningCache.clear();
	}
	get(cacheKey) {
		return this.#registryCache.get(cacheKey);
	}
	set(cacheKey, state) {
		this.#registryCache.set(cacheKey, state);
	}
	isLoadInFlight(cacheKey) {
		return this.#inFlightLoads.has(cacheKey);
	}
	beginLoad(cacheKey) {
		if (this.#inFlightLoads.has(cacheKey)) throw new PluginLoadReentryError(cacheKey);
		this.#inFlightLoads.add(cacheKey);
	}
	finishLoad(cacheKey) {
		this.#inFlightLoads.delete(cacheKey);
	}
	hasOpenAllowlistWarning(cacheKey) {
		return this.#openAllowlistWarningCache.has(cacheKey);
	}
	recordOpenAllowlistWarning(cacheKey) {
		this.#openAllowlistWarningCache.add(cacheKey);
	}
};
//#endregion
//#region src/plugins/loader-cache-instances.ts
const MAX_PLUGIN_REGISTRY_CACHE_ENTRIES = 128;
const pluginLoaderCacheInstances = {
	scoped: new PluginLoaderCacheState(MAX_PLUGIN_REGISTRY_CACHE_ENTRIES),
	fullWorkspace: new PluginLoaderCacheState(MAX_PLUGIN_REGISTRY_CACHE_ENTRIES)
};
//#endregion
//#region src/plugins/loader-load-context.ts
function safeRealpathOrResolve$2(value) {
	try {
		return fs.realpathSync(value);
	} catch {
		return path.resolve(value);
	}
}
function resolveBundledPackageRootForCache(stockRoot) {
	if (!stockRoot) return;
	const resolved = path.resolve(stockRoot);
	const parent = path.dirname(resolved);
	if (path.basename(resolved) === "extensions" && (path.basename(parent) === "dist" || path.basename(parent) === "dist-runtime")) return path.dirname(parent);
	const sourcePackageRoot = parent;
	return fs.existsSync(path.join(sourcePackageRoot, "package.json")) ? sourcePackageRoot : void 0;
}
function readPackageVersionForCache(packageJsonPath) {
	const parsed = tryReadJsonSync(packageJsonPath);
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return "unknown";
	const version = parsed.version;
	return typeof version === "string" && version.trim() ? version.trim() : "unknown";
}
const bundledPackageCacheIdentityByStockRoot = /* @__PURE__ */ new Map();
function resolveBundledPackageCacheIdentity(stockRoot) {
	if (!stockRoot) return;
	const packageRoot = resolveBundledPackageRootForCache(stockRoot);
	if (!packageRoot) return;
	const stockRootKey = path.resolve(stockRoot);
	const cached = bundledPackageCacheIdentityByStockRoot.get(stockRootKey);
	if (cached) return cached;
	const packageJsonPath = path.join(packageRoot, "package.json");
	let identity;
	try {
		const stat = fs.statSync(packageJsonPath);
		identity = {
			packageJson: safeRealpathOrResolve$2(packageJsonPath),
			packageRoot: safeRealpathOrResolve$2(packageRoot),
			packageVersion: readPackageVersionForCache(packageJsonPath),
			size: stat.size,
			mtimeMs: stat.mtimeMs
		};
	} catch {
		identity = {
			packageJson: path.resolve(packageJsonPath),
			packageRoot: safeRealpathOrResolve$2(packageRoot),
			packageVersion: "missing",
			size: -1,
			mtimeMs: -1
		};
	}
	bundledPackageCacheIdentityByStockRoot.set(stockRootKey, identity);
	return identity;
}
function buildActivationMetadataHash(params) {
	const enabledSourceChannels = Object.entries(params.activationSource.rootConfig?.channels ?? {}).filter(([, value]) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) return false;
		return value.enabled === true;
	}).map(([channelId]) => channelId).toSorted((left, right) => left.localeCompare(right));
	const pluginEntryStates = Object.entries(params.activationSource.plugins.entries).map(([pluginId, entry]) => [pluginId, entry?.enabled ?? null]).toSorted(([left], [right]) => left.localeCompare(right));
	const autoEnableReasonEntries = Object.entries(params.autoEnabledReasons).map(([pluginId, reasons]) => [pluginId, [...reasons]]).toSorted(([left], [right]) => left.localeCompare(right));
	return createHash("sha256").update(JSON.stringify({
		enabled: params.activationSource.plugins.enabled,
		allow: params.activationSource.plugins.allow,
		deny: params.activationSource.plugins.deny,
		memorySlot: params.activationSource.plugins.slots.memory,
		entries: pluginEntryStates,
		enabledChannels: enabledSourceChannels,
		autoEnabledReasons: autoEnableReasonEntries
	})).digest("hex");
}
function redactPluginConfigForCacheKey(plugins) {
	const entries = Object.fromEntries(Object.entries(plugins.entries).map(([pluginId, entry]) => [pluginId, "config" in entry ? {
		...entry,
		config: "<plugin-config>"
	} : entry]));
	return {
		...plugins,
		entries
	};
}
function buildCacheKey(params) {
	const discoveryContext = resolvePluginDiscoveryContext({
		workspaceDir: params.workspaceDir,
		loadPaths: params.plugins.loadPaths,
		env: params.env
	});
	const { roots, loadPaths } = discoveryContext;
	const bundledPackage = resolveBundledPackageCacheIdentity(roots.stock);
	const installs = Object.fromEntries(Object.entries(params.installs ?? {}).map(([pluginId, install]) => [pluginId, {
		...install,
		installPath: typeof install.installPath === "string" ? resolveUserPath(install.installPath, params.env) : install.installPath,
		sourcePath: typeof install.sourcePath === "string" ? resolveUserPath(install.sourcePath, params.env) : install.sourcePath
	}]));
	const setupOnlyKey = params.includeSetupOnlyChannelPlugins === true ? "setup-only" : "runtime";
	const setupOnlyModeKey = params.forceSetupOnlyChannelPlugins === true ? "force-setup" : "normal-setup";
	const setupOnlyRequirementKey = params.requireSetupEntryForSetupOnlyChannelPlugins === true ? "require-setup-entry" : "allow-full-fallback";
	const startupChannelMode = params.forceFullRuntimeForChannelPlugins === true ? "force-full" : params.preferSetupRuntimeForChannelPlugins === true ? "prefer-setup" : "full";
	const bundledArtifactMode = params.preferBuiltPluginArtifacts === true ? "prefer-built-artifacts" : "source-default";
	const rawConfigEnvMode = params.resolveRawConfigEnvVars === true ? "resolve-raw-env" : "runtime-config";
	const moduleLoadMode = params.loadModules === false ? "manifest-only" : "load-modules";
	const discoveryMode = params.toolDiscovery === true ? "tool-discovery" : "default-discovery";
	const activationMode = params.activate === false ? "snapshot" : "active";
	return `${roots.workspace ?? ""}::${roots.global ?? ""}::${roots.stock ?? ""}::${JSON.stringify({
		bundledPackage,
		devSourceRoot: params.devSourceRoot ?? "",
		discoveryFingerprint: fingerprintPluginDiscoveryContext(discoveryContext),
		...params.plugins,
		installs,
		loadPaths,
		activationMetadataKey: params.activationMetadataKey ?? ""
	})}::${serializePluginIdScope(params.onlyPluginIds)}::${setupOnlyKey}::${setupOnlyModeKey}::${setupOnlyRequirementKey}::${startupChannelMode}::${bundledArtifactMode}::${rawConfigEnvMode}::${moduleLoadMode}::${discoveryMode}::${params.runtimeSubagentMode ?? "default"}::${params.pluginSdkResolution ?? "auto"}::${JSON.stringify(params.coreGatewayMethodNames ?? [])}::${activationMode}`;
}
function resolveRuntimeSubagentMode(runtimeOptions) {
	if (runtimeOptions?.allowGatewaySubagentBinding === true) return "gateway-bindable";
	return runtimeOptions?.subagent ? "explicit" : "default";
}
function hasExplicitCompatibilityInputs(options) {
	return options.config !== void 0 || options.activationSourceConfig !== void 0 || options.autoEnabledReasons !== void 0 || options.workspaceDir !== void 0 || options.env !== void 0 || options.resolveRawConfigEnvVars !== void 0 || hasExplicitPluginIdScope(options.onlyPluginIds) || options.runtimeOptions !== void 0 || options.pluginSdkResolution !== void 0 || options.coreGatewayHandlers !== void 0 || options.includeSetupOnlyChannelPlugins === true || options.forceSetupOnlyChannelPlugins === true || options.requireSetupEntryForSetupOnlyChannelPlugins === true || options.preferSetupRuntimeForChannelPlugins === true || options.preferBuiltPluginArtifacts === true || options.loadModules === false;
}
function resolveCoreGatewayMethodNames(options) {
	const names = new Set(options.coreGatewayMethodNames ?? []);
	for (const name of Object.keys(options.coreGatewayHandlers ?? {})) names.add(name);
	return Array.from(names).toSorted();
}
function mergePluginTrustList(runtimeList, sourceList) {
	if (sourceList.length === 0) return runtimeList;
	const merged = [...runtimeList];
	const seen = new Set(merged);
	for (const entry of sourceList) if (!seen.has(entry)) {
		merged.push(entry);
		seen.add(entry);
	}
	return merged.length === runtimeList.length ? runtimeList : merged;
}
function mergeTrustPluginConfigFromActivationSource(params) {
	const source = params.activationSource.plugins;
	const allow = mergePluginTrustList(params.normalized.allow, source.allow);
	const deny = mergePluginTrustList(params.normalized.deny, source.deny);
	const loadPaths = mergePluginTrustList(params.normalized.loadPaths, source.loadPaths);
	if (allow === params.normalized.allow && deny === params.normalized.deny && loadPaths === params.normalized.loadPaths) return params.normalized;
	return {
		...params.normalized,
		allow,
		deny,
		loadPaths
	};
}
function resolvePluginLoadCacheContext(options = {}) {
	const shouldResolveRawConfigEnvVars = options.resolveRawConfigEnvVars === true;
	const baseEnv = options.env ?? process.env;
	const rawConfig = options.config ?? {};
	const rawActivationSourceConfig = resolvePluginActivationSourceConfig({
		config: options.config,
		activationSourceConfig: options.activationSourceConfig
	});
	const env = shouldResolveRawConfigEnvVars ? createConfigRuntimeEnv(rawConfig, baseEnv) : baseEnv;
	const cfg = applyTestPluginDefaults(shouldResolveRawConfigEnvVars ? resolveConfigEnvVars(rawConfig, env, { onMissing: () => void 0 }) : rawConfig, env);
	const activationSourceConfig = shouldResolveRawConfigEnvVars ? resolveConfigEnvVars(rawActivationSourceConfig, env, { onMissing: () => void 0 }) : rawActivationSourceConfig;
	const normalized = normalizePluginsConfig(cfg.plugins);
	const activationSource = createPluginActivationSource({ config: activationSourceConfig });
	const trustNormalized = mergeTrustPluginConfigFromActivationSource({
		normalized,
		activationSource
	});
	const onlyPluginIds = normalizePluginIdScope(options.onlyPluginIds);
	const includeSetupOnlyChannelPlugins = options.includeSetupOnlyChannelPlugins === true;
	const forceSetupOnlyChannelPlugins = options.forceSetupOnlyChannelPlugins === true;
	const requireSetupEntryForSetupOnlyChannelPlugins = options.requireSetupEntryForSetupOnlyChannelPlugins === true;
	const preferSetupRuntimeForChannelPlugins = options.preferSetupRuntimeForChannelPlugins === true;
	const forceFullRuntimeForChannelPlugins = options.forceFullRuntimeForChannelPlugins === true;
	const preferBuiltPluginArtifacts = options.preferBuiltPluginArtifacts === true;
	const runtimeSubagentMode = resolveRuntimeSubagentMode(options.runtimeOptions);
	const coreGatewayMethodNames = resolveCoreGatewayMethodNames(options);
	const installRecords = {
		...options.installRecords ?? loadInstalledPluginIndexInstallRecordsSync({ env }),
		...cfg.plugins?.installs
	};
	const devSourceRoot = resolveOpenClawDevSourceRoot(env);
	const cacheKey = buildCacheKey({
		workspaceDir: options.workspaceDir,
		plugins: shouldResolveRawConfigEnvVars ? redactPluginConfigForCacheKey(trustNormalized) : trustNormalized,
		activationMetadataKey: buildActivationMetadataHash({
			activationSource,
			autoEnabledReasons: options.autoEnabledReasons ?? {}
		}),
		installs: installRecords,
		env,
		devSourceRoot,
		onlyPluginIds,
		includeSetupOnlyChannelPlugins,
		forceSetupOnlyChannelPlugins,
		requireSetupEntryForSetupOnlyChannelPlugins,
		preferSetupRuntimeForChannelPlugins,
		forceFullRuntimeForChannelPlugins,
		preferBuiltPluginArtifacts,
		resolveRawConfigEnvVars: options.resolveRawConfigEnvVars,
		toolDiscovery: options.toolDiscovery,
		loadModules: options.loadModules,
		runtimeSubagentMode,
		pluginSdkResolution: options.pluginSdkResolution,
		coreGatewayMethodNames,
		activate: options.activate
	});
	return {
		env,
		cfg,
		normalized: trustNormalized,
		activationSourceConfig,
		activationSource,
		autoEnabledReasons: options.autoEnabledReasons ?? {},
		onlyPluginIds,
		includeSetupOnlyChannelPlugins,
		forceSetupOnlyChannelPlugins,
		requireSetupEntryForSetupOnlyChannelPlugins,
		preferSetupRuntimeForChannelPlugins,
		forceFullRuntimeForChannelPlugins,
		preferBuiltPluginArtifacts,
		shouldActivate: options.activate !== false,
		shouldLoadModules: options.loadModules !== false,
		runtimeSubagentMode,
		installRecords,
		devSourceRoot,
		cacheKey
	};
}
//#endregion
//#region src/plugins/plugin-runtime-artifact-resolution.ts
/** Resolves the exact root and entry selected by the plugin runtime loader. */
const resolvedPluginRuntimeArtifacts = /* @__PURE__ */ new Map();
function safeRealpathOrResolve$1(value) {
	try {
		return fs.realpathSync(value);
	} catch {
		return path.resolve(value);
	}
}
function clearPluginRuntimeArtifactResolutionMemo() {
	resolvedPluginRuntimeArtifacts.clear();
}
/** Canonical packaged runtime replaces staging-only dist-runtime artifacts. */
function resolveCanonicalDistRuntimeSource(source) {
	const marker = `${path.sep}dist-runtime${path.sep}extensions${path.sep}`;
	const index = source.indexOf(marker);
	if (index === -1) return source;
	const candidate = `${source.slice(0, index)}${path.sep}dist${path.sep}extensions${path.sep}${source.slice(index + marker.length)}`;
	return fs.existsSync(candidate) ? candidate : source;
}
function rewriteBundledRuntimeArtifactRelativePath(relativePath) {
	return relativePath.replace(/\.[^.]+$/u, ".js");
}
function listPackageLocalRuntimeArtifactOutputExtensions(sourceExt) {
	switch (sourceExt) {
		case ".mts":
		case ".mjs": return [
			".mjs",
			".js",
			".cjs"
		];
		case ".cts":
		case ".cjs": return [
			".cjs",
			".js",
			".mjs"
		];
		default: return [
			".js",
			".mjs",
			".cjs"
		];
	}
}
function listPackageLocalRuntimeArtifactRelativePathBases(relativePath) {
	const ext = path.extname(relativePath).toLowerCase();
	const withoutExt = ext ? relativePath.slice(0, -ext.length) : relativePath;
	if (!withoutExt.startsWith(`src${path.sep}`) && !withoutExt.startsWith("src/")) return [withoutExt];
	return [withoutExt.slice(4), withoutExt];
}
function listPackageLocalDistRuntimeArtifactRelativePaths(relativePath) {
	const ext = path.extname(relativePath).toLowerCase();
	const candidates = /* @__PURE__ */ new Set();
	for (const base of listPackageLocalRuntimeArtifactRelativePathBases(relativePath)) for (const outputExt of listPackageLocalRuntimeArtifactOutputExtensions(ext)) candidates.add(`${base}${outputExt}`);
	return [...candidates];
}
function shouldPreferPackageLocalDistRuntimeArtifact(source) {
	switch (path.extname(source).toLowerCase()) {
		case ".ts":
		case ".tsx":
		case ".mts":
		case ".cts": return true;
		default: return false;
	}
}
function resolvePackageLocalDistRuntimeArtifact(params) {
	const relativeSource = path.relative(params.rootDir, params.source);
	if (!shouldPreferPackageLocalDistRuntimeArtifact(relativeSource) || relativeSource === "" || relativeSource.startsWith("..") || path.isAbsolute(relativeSource)) return null;
	const artifactRoot = path.join(params.rootDir, "dist");
	for (const artifactRelativePath of listPackageLocalDistRuntimeArtifactRelativePaths(relativeSource)) {
		const artifactSource = path.join(artifactRoot, artifactRelativePath);
		if (fs.existsSync(artifactSource)) return safeRealpathOrResolve$1(artifactSource);
	}
	return null;
}
function resolvePreferredBuiltRuntimeArtifact(params) {
	const rootDir = safeRealpathOrResolve$1(params.rootDir);
	const source = safeRealpathOrResolve$1(params.source);
	if (!params.preferBuiltPluginArtifacts) return {
		source,
		rootDir
	};
	if (params.origin !== "bundled") {
		const artifactSource = resolvePackageLocalDistRuntimeArtifact({
			source,
			rootDir
		});
		if (artifactSource) return {
			source: artifactSource,
			rootDir
		};
		return {
			source,
			rootDir
		};
	}
	if (params.packageManifest?.build?.bundledDist === false) return {
		source,
		rootDir
	};
	const packageLocalArtifactSource = resolvePackageLocalDistRuntimeArtifact({
		source,
		rootDir
	});
	if (packageLocalArtifactSource) return {
		source: packageLocalArtifactSource,
		rootDir
	};
	const extensionsDir = path.dirname(rootDir);
	if (path.basename(extensionsDir) !== "extensions") return {
		source,
		rootDir
	};
	const packageRoot = path.dirname(extensionsDir);
	if (path.basename(packageRoot) === "dist" || path.basename(packageRoot) === "dist-runtime") return {
		source,
		rootDir
	};
	const relativeSource = path.relative(rootDir, source);
	if (relativeSource === "" || relativeSource.startsWith("..") || path.isAbsolute(relativeSource)) return {
		source,
		rootDir
	};
	const artifactRelativePath = rewriteBundledRuntimeArtifactRelativePath(relativeSource);
	for (const artifactRootName of ["dist-runtime", "dist"]) {
		const artifactRoot = path.join(packageRoot, artifactRootName, "extensions", path.basename(rootDir));
		const artifactSource = path.join(artifactRoot, artifactRelativePath);
		if (fs.existsSync(artifactSource)) return {
			source: safeRealpathOrResolve$1(artifactSource),
			rootDir: safeRealpathOrResolve$1(artifactRoot)
		};
	}
	return {
		source,
		rootDir
	};
}
/** Applies both loader selection phases in their runtime order. */
function resolvePluginRuntimeArtifact(params) {
	const rootDir = resolveCanonicalDistRuntimeSource(safeRealpathOrResolve$1(params.rootDir));
	const source = resolveCanonicalDistRuntimeSource(safeRealpathOrResolve$1(params.source));
	const memoKey = JSON.stringify([
		params.pluginId,
		rootDir,
		params.entryKind
	]);
	const cached = resolvedPluginRuntimeArtifacts.get(memoKey);
	if (cached) return { ...cached };
	const preferred = resolvePreferredBuiltRuntimeArtifact({
		...params,
		source,
		rootDir
	});
	const resolved = {
		source: resolveCanonicalDistRuntimeSource(preferred.source),
		rootDir: resolveCanonicalDistRuntimeSource(preferred.rootDir)
	};
	resolvedPluginRuntimeArtifacts.set(memoKey, resolved);
	return { ...resolved };
}
//#endregion
//#region src/plugins/loader-cache.ts
const pluginLoaderCacheState = pluginLoaderCacheInstances.scoped;
const fullWorkspacePluginLoaderCacheState = pluginLoaderCacheInstances.fullWorkspace;
function getPluginRegistryCache(onlyPluginIds) {
	return onlyPluginIds ? pluginLoaderCacheState : fullWorkspacePluginLoaderCacheState;
}
function getCachedPluginRegistry(cacheKey, onlyPluginIds) {
	return getPluginRegistryCache(onlyPluginIds).get(cacheKey);
}
function setCachedPluginRegistry(cacheKey, state, onlyPluginIds) {
	getPluginRegistryCache(onlyPluginIds).set(cacheKey, state);
}
function getReusableCachedPluginRegistry(params) {
	const exact = getCachedPluginRegistry(params.cacheKey, params.onlyPluginIds);
	if (exact) return {
		state: exact,
		cacheKey: params.cacheKey,
		runtimeSubagentMode: params.runtimeSubagentMode
	};
	if (params.runtimeSubagentMode !== "default") return;
	const gatewayBindableContext = resolvePluginLoadCacheContext({
		...params.options,
		runtimeOptions: {
			...params.options.runtimeOptions,
			allowGatewaySubagentBinding: true
		}
	});
	const gatewayBindable = getCachedPluginRegistry(gatewayBindableContext.cacheKey, gatewayBindableContext.onlyPluginIds);
	if (!gatewayBindable) return;
	return {
		state: gatewayBindable,
		cacheKey: gatewayBindableContext.cacheKey,
		runtimeSubagentMode: gatewayBindableContext.runtimeSubagentMode
	};
}
function clearPluginRegistryLoadCache() {
	clearPluginRuntimeArtifactResolutionMemo();
	pluginLoaderCacheState.clearCachedRegistries();
	fullWorkspacePluginLoaderCacheState.clearCachedRegistries();
}
function resolvePluginRegistryLoadCacheKey(options = {}) {
	return resolvePluginLoadCacheContext(options).cacheKey;
}
function isPluginRegistryLoadInFlight(options = {}) {
	return pluginLoaderCacheState.isLoadInFlight(resolvePluginRegistryLoadCacheKey(options));
}
//#endregion
//#region src/plugins/loader-provenance.ts
function createPathMatcher() {
	return {
		exact: /* @__PURE__ */ new Set(),
		dirs: []
	};
}
function addPathToMatcher(matcher, rawPath, env = process.env) {
	const trimmed = rawPath.trim();
	if (!trimmed) return;
	const resolved = resolveUserPath(trimmed, env);
	if (!resolved) return;
	const canonical = safeRealpathSync(resolved) ?? resolved;
	if (matcher.exact.has(canonical) || matcher.dirs.includes(canonical)) return;
	if (safeStatSync(canonical)?.isDirectory()) {
		matcher.dirs.push(canonical);
		return;
	}
	matcher.exact.add(canonical);
}
function matchesPathMatcher(matcher, sourcePath) {
	if (matcher.exact.has(sourcePath)) return true;
	return matcher.dirs.some((dirPath) => isPathInside(dirPath, sourcePath));
}
function formatPluginInspectCommand(pluginId) {
	return `openclaw plugins inspect ${quoteCliArg(pluginId)}`;
}
/** Builds provenance matchers from configured load paths and install records. */
function buildProvenanceIndex(params) {
	const loadPathMatcher = createPathMatcher();
	for (const loadPath of params.normalizedLoadPaths) addPathToMatcher(loadPathMatcher, loadPath, params.env);
	const installRules = /* @__PURE__ */ new Map();
	const installs = params.installRecords ?? loadInstalledPluginIndexInstallRecordsSync({ env: params.env });
	for (const [pluginId, install] of Object.entries(installs)) {
		const rule = {
			trackedWithoutPaths: false,
			matcher: createPathMatcher()
		};
		const trackedPaths = normalizeTrimmedStringList([install.installPath, install.sourcePath]);
		if (trackedPaths.length === 0) rule.trackedWithoutPaths = true;
		else for (const trackedPath of trackedPaths) addPathToMatcher(rule.matcher, trackedPath, params.env);
		installRules.set(pluginId, rule);
	}
	return {
		loadPathMatcher,
		installRules
	};
}
function isTrackedByProvenance(params) {
	const sourcePath = resolveUserPath(params.source, params.env);
	const canonicalSourcePath = safeRealpathSync(sourcePath) ?? sourcePath;
	const installRule = params.index.installRules.get(params.pluginId);
	if (installRule) {
		if (installRule.trackedWithoutPaths) return true;
		if (matchesPathMatcher(installRule.matcher, canonicalSourcePath)) return true;
	}
	return matchesPathMatcher(params.index.loadPathMatcher, canonicalSourcePath);
}
function matchesExplicitInstallRule(params) {
	const sourcePath = resolveUserPath(params.source, params.env);
	const canonicalSourcePath = safeRealpathSync(sourcePath) ?? sourcePath;
	const installRule = params.index.installRules.get(params.pluginId);
	if (!installRule || installRule.trackedWithoutPaths) return false;
	return matchesPathMatcher(installRule.matcher, canonicalSourcePath);
}
function resolveCandidateDuplicateRank(params) {
	const pluginId = params.manifestBySource.get(params.candidate.source)?.id;
	const isExplicitInstall = params.candidate.origin === "global" && pluginId !== void 0 && matchesExplicitInstallRule({
		pluginId,
		source: params.candidate.source,
		index: params.provenance,
		env: params.env
	});
	if (params.candidate.origin === "config") return 0;
	if (params.candidate.origin === "bundled" && isBundledPluginInsideDevSourceRoot({
		rootDir: params.candidate.rootDir,
		env: params.env
	})) return 1;
	if (params.candidate.origin === "global" && isExplicitInstall) return 2;
	if (params.candidate.origin === "bundled") return 3;
	if (params.candidate.origin === "workspace") return 4;
	return 5;
}
/** Orders duplicate plugin candidates by configured, installed, bundled, then workspace trust. */
function compareDuplicateCandidateOrder(params) {
	const leftPluginId = params.manifestBySource.get(params.left.source)?.id;
	const rightPluginId = params.manifestBySource.get(params.right.source)?.id;
	if (!leftPluginId || leftPluginId !== rightPluginId) return 0;
	return resolveCandidateDuplicateRank({
		candidate: params.left,
		manifestBySource: params.manifestBySource,
		provenance: params.provenance,
		env: params.env
	}) - resolveCandidateDuplicateRank({
		candidate: params.right,
		manifestBySource: params.manifestBySource,
		provenance: params.provenance,
		env: params.env
	});
}
/** Warns when an open plugin allowlist may auto-load non-bundled plugins. */
function warnWhenAllowlistIsOpen(params) {
	if (!params.emitWarning) return;
	if (!params.pluginsEnabled) return;
	const autoDiscoverable = params.discoverablePlugins.filter((entry) => (entry.origin === "workspace" || entry.origin === "global") && !params.explicitlyEnabledPluginIds?.has(entry.id));
	if (autoDiscoverable.length === 0) return;
	const allDiscoveredIds = new Set(params.discoverablePlugins.map((entry) => entry.id));
	const hasConfiguredAllowlist = params.allow.length > 0;
	const allowHasDiscoveredMatch = params.allow.some((id) => allDiscoveredIds.has(id));
	if (hasConfiguredAllowlist && allowHasDiscoveredMatch) return;
	if (params.warningCache.hasOpenAllowlistWarning(params.warningCacheKey)) return;
	const preview = autoDiscoverable.slice(0, 6).map((entry) => `${entry.id} (${entry.source})`).join(", ");
	const truncated = autoDiscoverable.length > 6;
	const extra = truncated ? ` (+${autoDiscoverable.length - 6} more)` : "";
	const inspectCommands = autoDiscoverable.map((entry) => `'${formatPluginInspectCommand(entry.id)}'`).join(", ");
	const remediation = truncated ? "Run 'openclaw plugins list --enabled --verbose' to enumerate every discovered plugin id, inspect trusted ids with 'openclaw plugins inspect <id>', and add the ones you trust to plugins.allow in openclaw.json." : `To trust them explicitly, set plugins.allow in openclaw.json (e.g. "plugins": { "allow": [${autoDiscoverable.map((entry) => JSON.stringify(entry.id)).join(", ")}] }). Run 'openclaw plugins list --enabled --verbose' or ${inspectCommands} to confirm plugin ids.`;
	params.warningCache.recordOpenAllowlistWarning(params.warningCacheKey);
	if (!hasConfiguredAllowlist) {
		params.logger.warn(`[plugins] plugins.allow is empty; discovered non-bundled plugins may auto-load: ${preview}${extra}. ${remediation}`);
		return;
	}
	const unmatchedEntries = params.allow.filter((id) => !allDiscoveredIds.has(id));
	const unmatchedPreview = unmatchedEntries.slice(0, 6).map((id) => `"${id}"`).join(", ");
	const unmatchedExtra = unmatchedEntries.length > 6 ? ` (+${unmatchedEntries.length - 6} more)` : "";
	params.logger.warn(`[plugins] plugins.allow entries ${unmatchedPreview}${unmatchedExtra} do not match any discovered plugin ids; discovered non-bundled plugins: ${preview}${extra}. Use the plugin id (not a channel id or npm package name).`);
}
/** Adds diagnostics for loaded plugins without install or load-path provenance. */
function warnAboutUntrackedLoadedPlugins(params) {
	const allowSet = new Set(params.allowlist);
	for (const plugin of params.registry.plugins) {
		if (plugin.status !== "loaded" || plugin.origin === "bundled") continue;
		if (allowSet.has(plugin.id)) continue;
		if (isTrackedByProvenance({
			pluginId: plugin.id,
			source: plugin.source,
			index: params.provenance,
			env: params.env
		})) continue;
		const message = `loaded without install/load-path provenance; treat as untracked local code. Verify source with '${formatPluginInspectCommand(plugin.id)}', then pin trust via plugins.allow (e.g. "plugins": { "allow": [${JSON.stringify(plugin.id)}] }) or reinstall from a trusted source so OpenClaw records install provenance.`;
		params.registry.diagnostics.push({
			level: "warn",
			pluginId: plugin.id,
			source: plugin.source,
			message
		});
		if (params.emitWarning) params.logger.warn(`[plugins] ${plugin.id}: ${message} (${plugin.source})`);
	}
}
//#endregion
//#region src/plugins/loader-records.ts
/** Converts loaded plugin registries into stable plugin records for status and diagnostics. */
/** Builds the registry record shape shared by plugin loading, status, and diagnostics. */
function createPluginRecord(params) {
	return {
		id: params.id,
		name: params.name ?? params.id,
		description: params.description,
		version: params.version,
		packageName: params.packageName,
		format: params.format ?? "openclaw",
		bundleFormat: params.bundleFormat,
		bundleCapabilities: params.bundleCapabilities,
		source: params.source,
		rootDir: params.rootDir,
		origin: params.origin,
		workspaceDir: params.workspaceDir,
		trustedOfficialInstall: params.trustedOfficialInstall,
		enabled: params.enabled,
		compat: params.compat,
		explicitlyEnabled: params.activationState?.explicitlyEnabled,
		activated: params.activationState?.activated,
		activationSource: params.activationState?.source,
		activationReason: params.activationState?.reason,
		syntheticAuthRefs: params.syntheticAuthRefs ?? [],
		status: params.enabled ? "loaded" : "disabled",
		toolNames: [],
		hookNames: [],
		channelIds: [...params.channelIds ?? []],
		cliBackendIds: [],
		providerIds: [...params.providerIds ?? []],
		embeddingProviderIds: [...params.contracts?.embeddingProviders ?? []],
		speechProviderIds: [...params.contracts?.speechProviders ?? []],
		realtimeTranscriptionProviderIds: [...params.contracts?.realtimeTranscriptionProviders ?? []],
		realtimeVoiceProviderIds: [...params.contracts?.realtimeVoiceProviders ?? []],
		mediaUnderstandingProviderIds: [...params.contracts?.mediaUnderstandingProviders ?? []],
		transcriptSourceProviderIds: [...params.contracts?.transcriptSourceProviders ?? []],
		imageGenerationProviderIds: [...params.contracts?.imageGenerationProviders ?? []],
		videoGenerationProviderIds: [...params.contracts?.videoGenerationProviders ?? []],
		musicGenerationProviderIds: [...params.contracts?.musicGenerationProviders ?? []],
		webFetchProviderIds: [...params.contracts?.webFetchProviders ?? []],
		webSearchProviderIds: [...params.contracts?.webSearchProviders ?? []],
		migrationProviderIds: [...params.contracts?.migrationProviders ?? []],
		contextEngineIds: [],
		memoryEmbeddingProviderIds: [...params.contracts?.memoryEmbeddingProviders ?? []],
		agentHarnessIds: [],
		cliCommands: [],
		services: [],
		gatewayDiscoveryServiceIds: [],
		commands: [],
		httpRoutes: 0,
		hookCount: 0,
		configSchema: params.configSchema,
		configUiHints: void 0,
		configJsonSchema: void 0,
		contracts: params.contracts
	};
}
/** Marks a discovered plugin inactive without discarding its metadata record. */
function markPluginActivationDisabled(record, reason) {
	record.activated = false;
	record.activationSource = "disabled";
	record.activationReason = reason;
}
/** Records a boot-time payload quarantine without importing or activating the plugin. */
function recordPluginConfiguredUnavailable(params) {
	const error = formatPluginVerificationDiagnostic(params.degradedPlugin.diagnostic);
	params.record.status = "error";
	params.record.error = error;
	params.record.failurePhase = "validation";
	params.record.activated = false;
	params.record.activationReason = `configured-unavailable: ${params.degradedPlugin.diagnostic.reason}`;
	params.registry.plugins.push(params.record);
	params.seenIds.set(params.record.id, params.origin);
	params.registry.diagnostics.push({
		level: "error",
		pluginId: params.record.id,
		source: params.record.source,
		code: "plugin-verification",
		message: error
	});
}
/** Joins auto-enable reasons into the single registry field shown by status surfaces. */
function formatAutoEnabledActivationReason(reasons) {
	if (!reasons || reasons.length === 0) return;
	return reasons.join("; ");
}
/** Records a loader failure in the registry, diagnostics list, and operator log consistently. */
function recordPluginError(params) {
	const errorText = isPluginLifecycleTraceEnabled() && params.error instanceof Error && typeof params.error.stack === "string" ? params.error.stack : String(params.error);
	const deprecatedApiHint = errorText.includes("api.registerHttpHandler") && errorText.includes("is not a function") ? "deprecated api.registerHttpHandler(...) was removed; use api.registerHttpRoute(...) for plugin-owned routes or registerPluginHttpRoute(...) for dynamic lifecycle routes" : null;
	const displayError = deprecatedApiHint ? `${deprecatedApiHint} (${errorText})` : errorText;
	params.logger.error(`${params.logPrefix}${displayError}`);
	params.record.status = "error";
	params.record.error = displayError;
	params.record.failedAt = /* @__PURE__ */ new Date();
	params.record.failurePhase = params.phase;
	params.registry.plugins.push(params.record);
	params.seenIds.set(params.pluginId, params.origin);
	params.registry.diagnostics.push({
		level: "error",
		pluginId: params.record.id,
		source: params.record.source,
		message: `${params.diagnosticMessagePrefix}${displayError}`,
		...params.diagnosticCode ? { code: params.diagnosticCode } : {}
	});
}
/** Groups failed plugin ids by loader phase for compact startup summaries. */
function formatPluginFailureSummary(failedPlugins) {
	const grouped = /* @__PURE__ */ new Map();
	for (const plugin of failedPlugins) {
		const phase = plugin.failurePhase ?? "load";
		const ids = grouped.get(phase);
		if (ids) {
			ids.push(plugin.id);
			continue;
		}
		grouped.set(phase, [plugin.id]);
	}
	return [...grouped.entries()].map(([phase, ids]) => `${phase}: ${ids.join(", ")}`).join("; ");
}
function isPluginLoadDebugEnabled(env) {
	const normalized = normalizeLowercaseStringOrEmpty(env.OPENCLAW_PLUGIN_LOAD_DEBUG);
	return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}
function describePluginModuleExportShape(value, label = "export", seen = /* @__PURE__ */ new Set()) {
	if (value === null) return [`${label}:null`];
	if (typeof value !== "object") return [`${label}:${typeof value}`];
	if (seen.has(value)) return [`${label}:circular`];
	seen.add(value);
	const record = value;
	const keys = Object.keys(record).toSorted();
	const visibleKeys = keys.slice(0, 8);
	const extraCount = keys.length - visibleKeys.length;
	const details = [`${label}:object keys=${visibleKeys.length > 0 ? `${visibleKeys.join(",")}${extraCount > 0 ? `,+${extraCount}` : ""}` : "none"}`];
	for (const key of [
		"default",
		"module",
		"register",
		"activate"
	]) if (Object.hasOwn(record, key)) details.push(...describePluginModuleExportShape(record[key], `${label}.${key}`, seen));
	return details;
}
function formatMissingPluginRegisterError(moduleExport, env) {
	const message = "plugin export missing register/activate";
	if (!isPluginLoadDebugEnabled(env)) return message;
	return `${message} (module shape: ${describePluginModuleExportShape(moduleExport).join("; ")})`;
}
//#endregion
//#region src/plugins/loader-shared.ts
function createPluginLoaderLogger() {
	return createSubsystemLogger("plugins");
}
function detailPluginStartupTrace(startupTrace, pluginId, metrics) {
	startupTrace?.detail(`plugins.gateway-load.plugin.${encodeStartupTraceSegment(pluginId)}`, metrics);
}
function resolveDreamingSidecarEngineId(params) {
	const normalizedMemorySlot = normalizeLowercaseStringOrEmpty(params.memorySlot);
	if (!normalizedMemorySlot || normalizedMemorySlot === "none" || normalizedMemorySlot === "memory-core") return null;
	return resolveMemoryDreamingConfig({
		pluginConfig: resolveMemoryDreamingPluginConfig(params.cfg),
		cfg: params.cfg
	}).enabled ? DEFAULT_MEMORY_DREAMING_PLUGIN_ID : null;
}
function resolveAuthorizedDreamingSidecar(params) {
	const engineId = resolveDreamingSidecarEngineId({
		cfg: params.cfg,
		memorySlot: params.memorySlot
	});
	if (!engineId || !params.normalized.enabled || !params.activationSource.plugins.enabled) return null;
	const selectedMemoryPluginId = normalizeLowercaseStringOrEmpty(params.memorySlot);
	if (!selectedMemoryPluginId || selectedMemoryPluginId === engineId) return null;
	if (params.normalized.deny.includes(engineId) || params.activationSource.plugins.deny.includes(engineId) || params.normalized.entries[engineId]?.enabled === false || params.activationSource.plugins.entries[engineId]?.enabled === false) return null;
	const selectedMemoryPlugin = params.manifestRegistry.plugins.find((plugin) => plugin.id === selectedMemoryPluginId);
	const sidecarPlugin = params.manifestRegistry.plugins.find((plugin) => plugin.id === engineId);
	if (!selectedMemoryPlugin || !sidecarPlugin || !hasKind(selectedMemoryPlugin.kind, "memory") || !hasKind(sidecarPlugin.kind, "memory")) return null;
	return resolveEffectiveEnableState({
		id: selectedMemoryPlugin.id,
		origin: selectedMemoryPlugin.origin,
		config: params.normalized,
		rootConfig: params.cfg,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(selectedMemoryPlugin),
		activationSource: params.activationSource
	}).enabled ? {
		engineId,
		selectedMemoryPluginId
	} : null;
}
function isAuthorizedDreamingSidecarPlugin(params) {
	return params.sidecar?.engineId === params.pluginId;
}
function matchesScopedPluginOrDreamingSidecar(params) {
	if (!params.onlyPluginIdSet || params.onlyPluginIdSet.has(params.pluginId)) return true;
	return params.pluginId === params.sidecar?.engineId && params.onlyPluginIdSet.has(params.sidecar.selectedMemoryPluginId);
}
function createPluginCandidatesFromManifestRegistry(manifestRegistry) {
	return manifestRegistry.plugins.map((record) => ({
		idHint: record.id,
		rootDir: record.rootDir,
		source: record.source,
		...record.setupSource !== void 0 ? { setupSource: record.setupSource } : {},
		origin: record.origin,
		...record.workspaceDir !== void 0 ? { workspaceDir: record.workspaceDir } : {},
		...record.format !== void 0 ? { format: record.format } : {},
		...record.bundleFormat !== void 0 ? { bundleFormat: record.bundleFormat } : {},
		...record.packageManifest !== void 0 ? { packageManifest: record.packageManifest } : {}
	}));
}
function clearActivatedPluginRuntimeState() {
	clearPluginRuntimeArtifactResolutionMemo();
	clearAgentHarnesses();
	clearPluginCommands();
	clearCompactionProviders();
	clearDetachedTaskLifecycleRuntimeRegistration();
	clearPluginInteractiveHandlers();
	clearEmbeddingProviders();
	clearMemoryEmbeddingProviders();
	clearMemoryPluginState();
	clearSessionDiscussionProvider();
}
var PluginLoadFailureError = class extends Error {
	constructor(registry) {
		const failedPlugins = registry.plugins.filter((entry) => entry.status === "error");
		const summary = failedPlugins.map((entry) => `${entry.id}: ${entry.error ?? "unknown plugin load error"}`).join("; ");
		super(`plugin load failed: ${summary}`);
		this.name = "PluginLoadFailureError";
		this.pluginIds = failedPlugins.map((entry) => entry.id);
		this.registry = registry;
	}
};
function validatePluginConfig(params) {
	const { schema, value } = params;
	if (!schema) return ok(value);
	if (isEmptyPluginConfigJsonSchema(schema)) {
		if (value === void 0 || value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return ok({});
		if (!value || typeof value !== "object" || Array.isArray(value)) return err(["<root>: must be object"]);
		return err(["<root>: config must be empty"]);
	}
	const result = validateJsonSchemaValue({
		schema,
		cacheKey: params.cacheKey ?? JSON.stringify(schema),
		value: value ?? {},
		applyDefaults: true
	});
	return result.ok ? ok(result.value) : err(result.errors.map((error) => error.text));
}
function isEmptyPluginConfigJsonSchema(schema) {
	if (schema.type !== "object" || schema.additionalProperties !== false) return false;
	const properties = schema.properties;
	if (!properties || typeof properties !== "object" || Array.isArray(properties) || Object.keys(properties).length > 0) return false;
	return !("required" in schema || "dependentRequired" in schema || "dependencies" in schema || "minProperties" in schema || "allOf" in schema || "anyOf" in schema || "oneOf" in schema || "not" in schema);
}
function pushDiagnostics(diagnostics, append) {
	diagnostics.push(...append);
}
function pushPluginValidationError(params) {
	params.record.status = "error";
	params.record.error = params.message;
	params.record.failedAt = /* @__PURE__ */ new Date();
	params.record.failurePhase = "validation";
	params.registry.plugins.push(params.record);
	params.seenIds.set(params.pluginId, params.origin);
	params.registry.diagnostics.push({
		level: "error",
		pluginId: params.record.id,
		source: params.record.source,
		message: params.record.error
	});
}
/** Builds the common manifest-backed record shape used by runtime and CLI loaders. */
function createManifestPluginRecord(params) {
	const { candidate, manifestRecord } = params;
	return createPluginRecord({
		id: manifestRecord.id,
		name: manifestRecord.name ?? manifestRecord.id,
		description: manifestRecord.description,
		version: manifestRecord.version,
		packageName: manifestRecord.packageName,
		format: manifestRecord.format,
		bundleFormat: manifestRecord.bundleFormat,
		bundleCapabilities: manifestRecord.bundleCapabilities,
		source: candidate.source,
		rootDir: candidate.rootDir,
		origin: candidate.origin,
		workspaceDir: candidate.workspaceDir,
		trustedOfficialInstall: manifestRecord.trustedOfficialInstall,
		enabled: params.enabled,
		compat: collectPluginManifestCompatCodes(manifestRecord),
		activationState: params.activationState,
		syntheticAuthRefs: manifestRecord.syntheticAuthRefs,
		channelIds: manifestRecord.channels,
		providerIds: manifestRecord.providers,
		configSchema: Boolean(manifestRecord.configSchema),
		contracts: manifestRecord.contracts
	});
}
function applyPluginManifestRecordDetails(record, manifestRecord) {
	record.kind = manifestRecord.kind;
	record.configUiHints = manifestRecord.configUiHints;
	record.configJsonSchema = manifestRecord.configSchema;
}
function applyManifestSnapshotMetadata(record, manifestRecord) {
	record.channelIds = [...manifestRecord.channels ?? []];
	record.providerIds = [...manifestRecord.providers ?? []];
	record.cliBackendIds = [...manifestRecord.cliBackends ?? [], ...manifestRecord.setup?.cliBackends ?? []];
	record.commands = (manifestRecord.commandAliases ?? []).map((alias) => alias.name);
}
function maybeThrowOnPluginLoadError(registry, throwOnLoadError) {
	if (throwOnLoadError && registry.plugins.some((entry) => entry.status === "error")) throw new PluginLoadFailureError(registry);
}
function activatePluginRegistry(registry, cacheKey, runtimeSubagentMode, workspaceDir) {
	setActivePluginRegistry(registry, cacheKey, runtimeSubagentMode, workspaceDir);
	initializeGlobalHookRunner(registry);
}
function safeRealpathOrResolve(value) {
	try {
		return fs.realpathSync(value);
	} catch {
		return path.resolve(value);
	}
}
//#endregion
//#region src/plugins/loader-discovery.ts
function resolvePluginLoadDiscovery(params) {
	const { options, context } = params;
	const discovery = params.suppliedManifestRegistry ? {
		candidates: createPluginCandidatesFromManifestRegistry(params.suppliedManifestRegistry),
		diagnostics: []
	} : options.discovery ?? discoverOpenClawPlugins({
		workspaceDir: options.workspaceDir,
		extraPaths: context.normalized.loadPaths,
		env: context.env,
		installRecords: context.installRecords
	});
	const manifestRegistry = params.suppliedManifestRegistry ?? loadPluginManifestRegistry({
		config: context.cfg,
		workspaceDir: options.workspaceDir,
		env: context.env,
		candidates: discovery.candidates,
		diagnostics: discovery.diagnostics,
		installRecords: nonEmptyInstallRecords(context.installRecords)
	});
	pushDiagnostics(params.diagnostics, manifestRegistry.diagnostics);
	warnWhenAllowlistIsOpen({
		emitWarning: params.emitWarning,
		logger: params.logger,
		pluginsEnabled: context.normalized.enabled,
		allow: context.normalized.allow,
		warningCacheKey: params.warningCacheKey,
		warningCache: pluginLoaderCacheState,
		explicitlyEnabledPluginIds: new Set(Object.entries(context.normalized.entries).filter(([, entry]) => entry.enabled === true).map(([pluginId]) => pluginId)),
		discoverablePlugins: manifestRegistry.plugins.filter((plugin) => !params.onlyPluginIdSet || params.onlyPluginIdSet.has(plugin.id)).map((plugin) => ({
			id: plugin.id,
			source: plugin.source,
			origin: plugin.origin
		}))
	});
	const provenance = buildProvenanceIndex({
		normalizedLoadPaths: context.normalized.loadPaths,
		env: context.env,
		installRecords: context.installRecords
	});
	const manifestBySource = new Map(manifestRegistry.plugins.map((record) => [record.source, record]));
	return {
		discovery,
		manifestRegistry,
		orderedCandidates: [...discovery.candidates].toSorted((left, right) => compareDuplicateCandidateOrder({
			left,
			right,
			manifestBySource,
			provenance,
			env: context.env
		})),
		manifestBySource,
		provenance
	};
}
function nonEmptyInstallRecords(records) {
	return Object.keys(records).length > 0 ? records : void 0;
}
//#endregion
//#region src/plugins/api-lifecycle.ts
const PLUGIN_API_METHOD_POLICIES = {
	emitAgentEvent: {
		phase: "runtime",
		lateCallable: true
	},
	sendSessionAttachment: {
		phase: "runtime",
		lateCallable: true
	},
	scheduleSessionTurn: {
		phase: "runtime",
		lateCallable: true
	},
	unscheduleSessionTurnsByTag: {
		phase: "runtime",
		lateCallable: true
	}
};
/** Returns lifecycle policy for one plugin API method name. */
function getPluginApiMethodLifecyclePolicy(methodName) {
	return PLUGIN_API_METHOD_POLICIES[methodName];
}
/** True when a plugin API method remains callable after registration. */
function isLateCallablePluginApiMethod(methodName) {
	return getPluginApiMethodLifecyclePolicy(methodName)?.lateCallable === true;
}
//#endregion
//#region src/plugins/loader-module-runtime.ts
const LAZY_RUNTIME_REFLECTION_KEYS = [
	"version",
	"gateway",
	"config",
	"agent",
	"subagent",
	"system",
	"media",
	"mediaUnderstanding",
	"tts",
	"channel",
	"events",
	"logging",
	"state",
	"modelAuth",
	"imageGeneration",
	"videoGeneration",
	"musicGeneration",
	"llm"
];
function isPromiseLike(value) {
	return (typeof value === "object" || typeof value === "function") && value !== null && typeof value.then === "function";
}
function createGuardedPluginRegistrationApi(api) {
	let closed = false;
	return {
		api: attachPluginApiFacades(new Proxy(api, { get(target, prop, receiver) {
			const value = Reflect.get(target, prop, receiver);
			if (typeof value !== "function") return value;
			if (typeof prop === "string" && isLateCallablePluginApiMethod(prop)) return (...args) => Reflect.apply(value, target, args);
			return (...args) => {
				if (closed) return;
				return Reflect.apply(value, target, args);
			};
		} })),
		close: () => {
			closed = true;
		}
	};
}
function runPluginRegisterSync(register, api) {
	const guarded = createGuardedPluginRegistrationApi(api);
	try {
		const result = register(guarded.api);
		if (isPromiseLike(result)) {
			Promise.resolve(result).catch(() => {});
			throw new Error("plugin register must be synchronous");
		}
	} finally {
		guarded.close();
	}
}
function createPluginModuleLoader(options) {
	const moduleLoaders = createPluginModuleLoaderCache();
	const createLoaderForModule = (modulePath) => {
		installOpenClawPluginSdkNativeResolver({
			argv1: process.argv[1],
			moduleUrl: import.meta.url,
			pluginModulePath: modulePath,
			devSourceRoot: options.devSourceRoot,
			pluginSdkResolution: options.pluginSdkResolution
		});
		return getCachedPluginModuleLoader({
			cache: moduleLoaders,
			modulePath,
			importerUrl: import.meta.url,
			loaderFilename: modulePath,
			devSourceRoot: options.devSourceRoot,
			aliasMap: buildPluginLoaderAliasMap(modulePath, process.argv[1], import.meta.url, options.pluginSdkResolution, options.devSourceRoot),
			pluginSdkResolution: options.pluginSdkResolution
		});
	};
	return (modulePath) => createLoaderForModule(modulePath)(toSafeImportPath(modulePath));
}
function formatPluginRuntimeModuleResolutionError(params) {
	const { resolution } = params;
	const candidates = resolution.candidates.length > 0 ? resolution.candidates.join(", ") : "<none>";
	return [
		"Unable to resolve plugin runtime module",
		`loader=${resolution.modulePath ?? "<unresolved>"}`,
		`packageRoot=${resolution.packageRoot ?? "<none>"}`,
		`pluginSdkResolution=${params.pluginSdkResolution ?? "auto"}`,
		`candidates=${candidates}`,
		...resolution.error ? [`resolverError=${resolution.error}`] : []
	].join("; ");
}
/** Lazily materializes the broad plugin runtime only when registration reads it. */
function createLazyPluginRuntime(params) {
	let createPluginRuntimeFactory = null;
	const resolveCreatePluginRuntime = () => {
		if (createPluginRuntimeFactory) return createPluginRuntimeFactory;
		const resolution = resolvePluginRuntimeModulePathWithDiagnostics({
			devSourceRoot: params.devSourceRoot,
			pluginSdkResolution: params.pluginSdkResolution
		});
		if (!resolution.resolvedPath) throw new Error(formatPluginRuntimeModuleResolutionError({
			resolution,
			pluginSdkResolution: params.pluginSdkResolution
		}));
		const resolvedPath = resolution.resolvedPath;
		const runtimeModule = withProfile({ source: resolvedPath }, "runtime-module", () => params.loadPluginModule(resolvedPath));
		if (typeof runtimeModule.createPluginRuntime !== "function") throw new Error("Plugin runtime module missing createPluginRuntime export");
		createPluginRuntimeFactory = runtimeModule.createPluginRuntime;
		return createPluginRuntimeFactory;
	};
	let resolvedRuntime = null;
	const resolveRuntime = () => {
		resolvedRuntime ??= resolveCreatePluginRuntime()(params.runtimeOptions);
		return resolvedRuntime;
	};
	const lazyRuntimeReflectionKeySet = new Set(LAZY_RUNTIME_REFLECTION_KEYS);
	const resolveLazyRuntimeDescriptor = (prop) => {
		if (!lazyRuntimeReflectionKeySet.has(prop)) return Reflect.getOwnPropertyDescriptor(resolveRuntime(), prop);
		return {
			configurable: true,
			enumerable: true,
			get() {
				return Reflect.get(resolveRuntime(), prop);
			},
			set(value) {
				Reflect.set(resolveRuntime(), prop, value);
			}
		};
	};
	return new Proxy({}, {
		get(_target, prop, receiver) {
			return Reflect.get(resolveRuntime(), prop, receiver);
		},
		set(_target, prop, value, receiver) {
			return Reflect.set(resolveRuntime(), prop, value, receiver);
		},
		has(_target, prop) {
			return lazyRuntimeReflectionKeySet.has(prop) || Reflect.has(resolveRuntime(), prop);
		},
		ownKeys() {
			return [...LAZY_RUNTIME_REFLECTION_KEYS];
		},
		getOwnPropertyDescriptor(_target, prop) {
			return resolveLazyRuntimeDescriptor(prop);
		},
		defineProperty(_target, prop, attributes) {
			return Reflect.defineProperty(resolveRuntime(), prop, attributes);
		},
		deleteProperty(_target, prop) {
			return Reflect.deleteProperty(resolveRuntime(), prop);
		},
		getPrototypeOf() {
			return Reflect.getPrototypeOf(resolveRuntime());
		}
	});
}
function resolvePluginModuleExport(moduleExport) {
	const seen = /* @__PURE__ */ new Set();
	const candidates = [unwrapDefaultModuleExport(moduleExport), moduleExport];
	for (let index = 0; index < candidates.length && index < 12; index += 1) {
		const resolved = candidates[index];
		if (seen.has(resolved)) continue;
		seen.add(resolved);
		if (typeof resolved === "function") return { register: resolved };
		if (resolved && typeof resolved === "object") {
			const definition = resolved;
			const register = definition.register;
			if (typeof register === "function") return {
				definition,
				register
			};
			for (const key of ["default", "module"]) if (key in definition) candidates.push(definition[key]);
		}
	}
	const resolved = candidates[0];
	if (typeof resolved === "function") return { register: resolved };
	if (resolved && typeof resolved === "object") {
		const definition = resolved;
		return {
			definition,
			register: definition.register
		};
	}
	return {};
}
function kindIncludes(kind, target) {
	return kind === target || Array.isArray(kind) && kind.includes(target);
}
function formatBundledChannelWrongLoaderError(kind) {
	if (kindIncludes(kind, "bundled-channel-setup-entry")) return "bundled channel setup entry requires setup-runtime loader";
	if (kindIncludes(kind, "bundled-channel-entry")) return "bundled channel entry requires setup-runtime loader";
	return null;
}
//#endregion
//#region src/plugins/plugin-registration-transaction.ts
function snapshotPluginProcessGlobalState() {
	return {
		agentHarnesses: listRegisteredAgentHarnesses(),
		commands: listRegisteredPluginCommands(),
		compactionProviders: listRegisteredCompactionProviders(),
		detachedTaskRuntimeRegistration: getDetachedTaskLifecycleRuntimeRegistration(),
		embeddingProviders: listRegisteredEmbeddingProviders(),
		interactiveHandlers: listPluginInteractiveHandlers(),
		memoryCapability: getMemoryCapabilityRegistration(),
		memoryCorpusSupplements: listMemoryCorpusSupplements(),
		memoryEmbeddingProviders: listRegisteredMemoryEmbeddingProviders(),
		memoryPromptPreparations: listMemoryPromptPreparations(),
		memoryPromptSupplements: listMemoryPromptSupplements(),
		sessionDiscussionProvider: getSessionDiscussionProvider()
	};
}
function restorePluginProcessGlobalState(state) {
	restoreRegisteredAgentHarnesses(state.agentHarnesses);
	restorePluginCommands(state.commands);
	restoreRegisteredCompactionProviders(state.compactionProviders);
	restoreDetachedTaskLifecycleRuntimeRegistration(state.detachedTaskRuntimeRegistration);
	restoreRegisteredEmbeddingProviders(state.embeddingProviders);
	restorePluginInteractiveHandlers(state.interactiveHandlers);
	restoreRegisteredMemoryEmbeddingProviders(state.memoryEmbeddingProviders);
	restoreMemoryPluginState({
		capability: state.memoryCapability,
		corpusSupplements: state.memoryCorpusSupplements,
		promptPreparations: state.memoryPromptPreparations,
		promptSupplements: state.memoryPromptSupplements
	});
	restoreSessionDiscussionProvider(state.sessionDiscussionProvider);
}
function snapshotPluginRegistry(registry) {
	return Object.fromEntries(Object.entries(registry).map(([key, value]) => {
		if (Array.isArray(value)) return [key, [...value]];
		if (value instanceof Map) return [key, new Map(value)];
		if (value && typeof value === "object") return [key, { ...value }];
		return [key, value];
	}));
}
function restorePluginRegistry(registry, snapshot) {
	Object.assign(registry, snapshot);
}
function createPluginRegistrationTransaction(params) {
	const registrySnapshot = params.registry ? snapshotPluginRegistry(params.registry) : void 0;
	const processGlobalState = snapshotPluginProcessGlobalState();
	let settled = false;
	const settle = (action) => {
		if (settled) return;
		action();
		settled = true;
	};
	return {
		commit: ({ activate }) => {
			settle(() => {
				if (!activate) restorePluginProcessGlobalState(processGlobalState);
			});
		},
		rollback: () => {
			settle(() => {
				params.rollbackGlobalSideEffects?.();
				if (params.registry && registrySnapshot) restorePluginRegistry(params.registry, registrySnapshot);
				restorePluginProcessGlobalState(processGlobalState);
			});
		}
	};
}
//#endregion
//#region src/plugins/loader-cli-registry.ts
const CLI_METADATA_ENTRY_BASENAMES = [
	"cli-metadata.ts",
	"cli-metadata.js",
	"cli-metadata.mjs",
	"cli-metadata.cjs"
];
async function loadOpenClawPluginCliRegistry(options = {}) {
	const context = resolvePluginLoadCacheContext({
		...options,
		activate: false
	});
	const logger = options.logger ?? createPluginLoaderLogger();
	const onlyPluginIdSet = createPluginIdScopeSet(context.onlyPluginIds);
	const loadPluginModule = createPluginModuleLoader({
		devSourceRoot: context.devSourceRoot,
		pluginSdkResolution: options.pluginSdkResolution
	});
	const { registry, registerCli } = createPluginRegistry({
		logger,
		runtime: {},
		coreGatewayHandlers: options.coreGatewayHandlers,
		...options.coreGatewayMethodNames !== void 0 && { coreGatewayMethodNames: options.coreGatewayMethodNames },
		activateGlobalSideEffects: false
	});
	const { manifestRegistry, orderedCandidates, manifestBySource } = resolvePluginLoadDiscovery({
		options,
		context,
		diagnostics: registry.diagnostics,
		logger,
		onlyPluginIdSet,
		emitWarning: false,
		warningCacheKey: `${context.cacheKey}::cli-metadata`
	});
	const seenIds = /* @__PURE__ */ new Map();
	const memorySlot = context.normalized.slots.memory;
	let selectedMemoryPluginId = null;
	const dreamingSidecar = resolveAuthorizedDreamingSidecar({
		cfg: context.cfg,
		normalized: context.normalized,
		activationSource: context.activationSource,
		manifestRegistry,
		memorySlot
	});
	for (const candidate of orderedCandidates) {
		const manifestRecord = manifestBySource.get(candidate.source);
		if (!manifestRecord) continue;
		const pluginId = manifestRecord.id;
		const policyId = normalizePluginPolicyId(pluginId);
		if (!matchesScopedPluginOrDreamingSidecar({
			onlyPluginIdSet,
			pluginId,
			sidecar: dreamingSidecar
		})) continue;
		const isDreamingSidecar = isAuthorizedDreamingSidecarPlugin({
			sidecar: dreamingSidecar,
			pluginId
		});
		const activationState = isDreamingSidecar ? {
			enabled: true,
			activated: true,
			explicitlyEnabled: false,
			source: "auto",
			reason: `dreaming sidecar for selected memory slot "${dreamingSidecar?.selectedMemoryPluginId ?? ""}"`
		} : resolveEffectivePluginActivationState({
			id: pluginId,
			origin: candidate.origin,
			config: context.normalized,
			rootConfig: context.cfg,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
			activationSource: context.activationSource,
			autoEnabledReason: formatAutoEnabledActivationReason(context.autoEnabledReasons[pluginId])
		});
		const existingOrigin = seenIds.get(pluginId);
		if (existingOrigin) {
			const duplicate = createManifestPluginRecord({
				candidate,
				manifestRecord,
				enabled: false,
				activationState
			});
			duplicate.status = "disabled";
			duplicate.error = `overridden by ${existingOrigin} plugin`;
			markPluginActivationDisabled(duplicate, duplicate.error);
			registry.plugins.push(duplicate);
			continue;
		}
		const enableState = isDreamingSidecar ? { enabled: true } : resolveEffectiveEnableState({
			id: pluginId,
			origin: candidate.origin,
			config: context.normalized,
			rootConfig: context.cfg,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
			activationSource: context.activationSource
		});
		const entry = context.normalized.entries[policyId];
		const record = createManifestPluginRecord({
			candidate,
			manifestRecord,
			enabled: enableState.enabled,
			activationState
		});
		applyPluginManifestRecordDetails(record, manifestRecord);
		const pushPluginLoadError = (message) => pushPluginValidationError({
			registry,
			seenIds,
			pluginId,
			origin: candidate.origin,
			record,
			message
		});
		if (!enableState.enabled) {
			record.status = "disabled";
			record.error = enableState.reason;
			markPluginActivationDisabled(record, enableState.reason);
			registry.plugins.push(record);
			seenIds.set(pluginId, candidate.origin);
			continue;
		}
		if (record.format === "bundle") {
			registry.plugins.push(record);
			seenIds.set(pluginId, candidate.origin);
			continue;
		}
		if (!manifestRecord.configSchema) {
			pushPluginLoadError("missing config schema");
			continue;
		}
		const validatedConfig = validatePluginConfig({
			schema: manifestRecord.configSchema,
			cacheKey: manifestRecord.schemaCacheKey,
			value: entry?.config
		});
		if (!validatedConfig.ok) {
			logger.error(`[plugins] ${record.id} invalid config: ${validatedConfig.error.join(", ")}`);
			pushPluginLoadError(`invalid config: ${validatedConfig.error.join(", ")}`);
			continue;
		}
		const cliMetadataSource = resolveCliMetadataEntrySource(candidate.rootDir);
		const sourceForCliMetadata = candidate.origin === "bundled" ? cliMetadataSource ? safeRealpathOrResolve(cliMetadataSource) : null : cliMetadataSource ?? candidate.source;
		if (!sourceForCliMetadata) {
			record.status = "loaded";
			registry.plugins.push(record);
			seenIds.set(pluginId, candidate.origin);
			continue;
		}
		const opened = openRootFileSync({
			absolutePath: sourceForCliMetadata,
			rootPath: safeRealpathOrResolve(candidate.rootDir),
			boundaryLabel: "plugin root",
			rejectHardlinks: shouldRejectHardlinkedPluginFiles({
				origin: candidate.origin,
				rootDir: candidate.rootDir,
				env: context.env
			}),
			skipLexicalRootCheck: true
		});
		if (!opened.ok) {
			pushPluginLoadError("plugin entry path escapes plugin root or fails alias checks");
			continue;
		}
		const safeSource = opened.path;
		fs.closeSync(opened.fd);
		let mod;
		try {
			mod = withProfile({
				pluginId: record.id,
				source: safeSource
			}, "cli-metadata", () => loadPluginModule(safeSource));
		} catch (error) {
			recordPluginError({
				logger,
				registry,
				record,
				seenIds,
				pluginId,
				origin: candidate.origin,
				phase: "load",
				error,
				logPrefix: `[plugins] ${record.id} failed to load from ${record.source}: `,
				diagnosticMessagePrefix: "failed to load plugin: "
			});
			continue;
		}
		const { definition, register } = resolvePluginModuleExport(mod);
		if (definition?.id && definition.id !== record.id) {
			pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", export uses "${definition.id}")`);
			continue;
		}
		record.name = definition?.name ?? record.name;
		record.description = definition?.description ?? record.description;
		record.version = definition?.version ?? record.version;
		const manifestKind = record.kind;
		const exportKind = definition?.kind;
		if (manifestKind && exportKind && !kindsEqual(manifestKind, exportKind)) registry.diagnostics.push({
			level: "warn",
			pluginId: record.id,
			source: record.source,
			message: `plugin kind mismatch (manifest uses "${String(manifestKind)}", export uses "${String(exportKind)}")`
		});
		record.kind = definition?.kind ?? record.kind;
		if (!isDreamingSidecar) {
			const memoryDecision = resolveMemorySlotDecision({
				id: record.id,
				kind: record.kind,
				slot: memorySlot,
				selectedId: selectedMemoryPluginId
			});
			if (!memoryDecision.enabled) {
				record.enabled = false;
				record.status = "disabled";
				record.error = memoryDecision.reason;
				markPluginActivationDisabled(record, memoryDecision.reason);
				registry.plugins.push(record);
				seenIds.set(pluginId, candidate.origin);
				continue;
			}
			if (memoryDecision.selected && hasKind(record.kind, "memory")) {
				selectedMemoryPluginId = record.id;
				record.memorySlotSelected = true;
			}
		}
		if (typeof register !== "function") {
			const wrongLoaderError = formatBundledChannelWrongLoaderError(record.kind);
			if (wrongLoaderError) {
				logger.error(`[plugins] ${record.id} ${wrongLoaderError}; ensure plugin is loaded via bundled channel discovery, not legacy plugin loader`);
				pushPluginLoadError(wrongLoaderError);
			} else {
				logger.error(`[plugins] ${record.id} missing register/activate export`);
				pushPluginLoadError(formatMissingPluginRegisterError(mod, context.env));
			}
			continue;
		}
		const api = buildPluginApi({
			id: record.id,
			name: record.name,
			version: record.version,
			description: record.description,
			source: record.source,
			rootDir: record.rootDir,
			registrationMode: "cli-metadata",
			config: context.cfg,
			pluginConfig: validatedConfig.value,
			runtime: {},
			logger,
			resolvePath: (input) => resolveUserPath(input),
			handlers: { registerCli: (registrar, opts) => registerCli(record, registrar, opts) }
		});
		const transaction = createPluginRegistrationTransaction({ registry });
		try {
			withProfile({
				pluginId: record.id,
				source: record.source
			}, "cli-metadata:register", () => runPluginRegisterSync(register, api));
			registry.plugins.push(record);
			seenIds.set(pluginId, candidate.origin);
			transaction.commit({ activate: true });
		} catch (error) {
			transaction.rollback();
			recordPluginError({
				logger,
				registry,
				record,
				seenIds,
				pluginId,
				origin: candidate.origin,
				phase: "register",
				error,
				logPrefix: `[plugins] ${record.id} failed during register from ${record.source}: `,
				diagnosticMessagePrefix: "plugin failed during register: "
			});
		}
	}
	return registry;
}
function resolveCliMetadataEntrySource(rootDir) {
	for (const basename of CLI_METADATA_ENTRY_BASENAMES) {
		const candidate = path.join(rootDir, basename);
		if (fs.existsSync(candidate)) return candidate;
	}
	return null;
}
//#endregion
//#region src/plugins/loader-channel-runtime.ts
/**
* Handles the setup-entry channel path.
* Returns true when the candidate is complete (loaded, disabled, or failed).
*/
function loadSetupRuntimeChannelCandidate(params) {
	const { manifestRecord, record, registrationPlan, runtimeCandidateEntry, registryBuilder } = params;
	if (!registrationPlan.loadSetupEntry || !manifestRecord.setupSource) return false;
	const setupRegistration = resolveSetupChannelRegistration(params.mod);
	if (setupRegistration.loadError) {
		recordPluginError({
			logger: params.logger,
			registry: registryBuilder.registry,
			record,
			seenIds: params.seenIds,
			pluginId: record.id,
			origin: params.candidateOrigin,
			phase: "load",
			error: setupRegistration.loadError,
			logPrefix: `[plugins] ${record.id} failed to load setup entry from ${record.source}: `,
			diagnosticMessagePrefix: "failed to load setup entry: ",
			diagnosticCode: "channel-setup-failure"
		});
		return true;
	}
	if (!setupRegistration.plugin) return false;
	if (!channelPluginIdBelongsToManifest({
		channelId: setupRegistration.plugin.id,
		pluginId: record.id,
		manifestChannels: manifestRecord.channels
	})) {
		params.pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", setup export uses "${setupRegistration.plugin.id}")`);
		return true;
	}
	const api = registryBuilder.createApi(record, {
		config: params.cfg,
		pluginConfig: {},
		hookPolicy: params.entry?.hooks,
		registrationMode: registrationPlan.mode
	});
	let mergedSetupRegistration = setupRegistration;
	let runtimeSetterApplied = false;
	if (registrationPlan.loadSetupRuntimeEntry && setupRegistration.usesBundledSetupContract && !shouldDeferConfiguredChannelFullRuntimeMerge({
		manifestChannels: manifestRecord.channels,
		startupDeferConfiguredChannelFullLoadUntilAfterListen: manifestRecord.startupDeferConfiguredChannelFullLoadUntilAfterListen,
		cfg: params.cfg,
		env: params.env,
		preferSetupRuntimeForChannelPlugins: params.preferSetupRuntimeForChannelPlugins
	}) && resolveCanonicalDistRuntimeSource(runtimeCandidateEntry.source) !== params.safeSource) {
		const runtimeOpened = openRootFileSync({
			absolutePath: resolveCanonicalDistRuntimeSource(runtimeCandidateEntry.source),
			rootPath: resolveCanonicalDistRuntimeSource(runtimeCandidateEntry.rootDir),
			boundaryLabel: "plugin root",
			rejectHardlinks: params.rejectHardlinks,
			skipLexicalRootCheck: true
		});
		if (!runtimeOpened.ok) {
			params.pushPluginLoadError("plugin entry path escapes plugin root or fails alias checks");
			return true;
		}
		const safeRuntimeSource = runtimeOpened.path;
		fs.closeSync(runtimeOpened.fd);
		let runtimeMod;
		try {
			runtimeMod = withProfile({
				pluginId: record.id,
				source: safeRuntimeSource
			}, "load-setup-runtime-entry", () => params.loadPluginModule(safeRuntimeSource));
		} catch (error) {
			recordPluginError({
				logger: params.logger,
				registry: registryBuilder.registry,
				record,
				seenIds: params.seenIds,
				pluginId: record.id,
				origin: params.candidateOrigin,
				phase: "load",
				error,
				logPrefix: `[plugins] ${record.id} failed to load setup-runtime entry from ${record.source}: `,
				diagnosticMessagePrefix: "failed to load setup-runtime entry: ",
				diagnosticCode: "channel-setup-failure"
			});
			return true;
		}
		const runtimeRegistration = resolveBundledRuntimeChannelRegistration(runtimeMod);
		if (runtimeRegistration.id && runtimeRegistration.id !== record.id) {
			params.pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", runtime entry uses "${runtimeRegistration.id}")`);
			return true;
		}
		if (runtimeRegistration.setChannelRuntime) try {
			runtimeRegistration.setChannelRuntime(api.runtime);
			runtimeSetterApplied = true;
		} catch (error) {
			recordPluginError({
				logger: params.logger,
				registry: registryBuilder.registry,
				record,
				seenIds: params.seenIds,
				pluginId: record.id,
				origin: params.candidateOrigin,
				phase: "load",
				error,
				logPrefix: `[plugins] ${record.id} failed to apply setup-runtime channel runtime from ${record.source}: `,
				diagnosticMessagePrefix: "failed to apply setup-runtime channel runtime: ",
				diagnosticCode: "channel-setup-failure"
			});
			return true;
		}
		const runtimePluginRegistration = loadBundledRuntimeChannelPlugin({ registration: runtimeRegistration });
		if (runtimePluginRegistration.loadError) {
			recordPluginError({
				logger: params.logger,
				registry: registryBuilder.registry,
				record,
				seenIds: params.seenIds,
				pluginId: record.id,
				origin: params.candidateOrigin,
				phase: "load",
				error: runtimePluginRegistration.loadError,
				logPrefix: `[plugins] ${record.id} failed to load setup-runtime channel entry from ${record.source}: `,
				diagnosticMessagePrefix: "failed to load setup-runtime channel entry: ",
				diagnosticCode: "channel-setup-failure"
			});
			return true;
		}
		if (runtimePluginRegistration.plugin) {
			if (runtimePluginRegistration.plugin.id && runtimePluginRegistration.plugin.id !== record.id) {
				params.pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", runtime export uses "${runtimePluginRegistration.plugin.id}")`);
				return true;
			}
			mergedSetupRegistration = {
				...setupRegistration,
				plugin: mergeSetupRuntimeChannelPlugin(runtimePluginRegistration.plugin, setupRegistration.plugin),
				setChannelRuntime: runtimeRegistration.setChannelRuntime ?? setupRegistration.setChannelRuntime
			};
		}
	}
	const mergedSetupPlugin = mergedSetupRegistration.plugin;
	if (!mergedSetupPlugin) return true;
	if (!channelPluginIdBelongsToManifest({
		channelId: mergedSetupPlugin.id,
		pluginId: record.id,
		manifestChannels: manifestRecord.channels
	})) {
		params.pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", setup export uses "${mergedSetupPlugin.id}")`);
		return true;
	}
	if (!runtimeSetterApplied) try {
		mergedSetupRegistration.setChannelRuntime?.(api.runtime);
	} catch (error) {
		recordPluginError({
			logger: params.logger,
			registry: registryBuilder.registry,
			record,
			seenIds: params.seenIds,
			pluginId: record.id,
			origin: params.candidateOrigin,
			phase: "load",
			error,
			logPrefix: `[plugins] ${record.id} failed to apply setup channel runtime from ${record.source}: `,
			diagnosticMessagePrefix: "failed to apply setup channel runtime: ",
			diagnosticCode: "channel-setup-failure"
		});
		return true;
	}
	if (registrationPlan.mode === "setup-runtime" && mergedSetupRegistration.registerSetupRuntime) {
		const transaction = createPluginRegistrationTransaction({ registry: registryBuilder.registry });
		try {
			runPluginRegisterSync((registrationApi) => mergedSetupRegistration.registerSetupRuntime?.(registrationApi), api);
			transaction.commit({ activate: true });
		} catch (error) {
			transaction.rollback();
			recordPluginError({
				logger: params.logger,
				registry: registryBuilder.registry,
				record,
				seenIds: params.seenIds,
				pluginId: record.id,
				origin: params.candidateOrigin,
				phase: "register",
				error,
				logPrefix: `[plugins] ${record.id} failed to register setup-runtime channel side effects from ${record.source}: `,
				diagnosticMessagePrefix: "failed to register setup-runtime channel side effects: ",
				diagnosticCode: "channel-setup-failure"
			});
			return true;
		}
	}
	try {
		api.registerChannel(mergedSetupPlugin);
	} catch (error) {
		recordPluginError({
			logger: params.logger,
			registry: registryBuilder.registry,
			record,
			seenIds: params.seenIds,
			pluginId: record.id,
			origin: params.candidateOrigin,
			phase: "load",
			error,
			logPrefix: `[plugins] ${record.id} failed to register setup channel from ${record.source}: `,
			diagnosticMessagePrefix: "failed to register setup channel: ",
			diagnosticCode: "channel-setup-failure"
		});
		return true;
	}
	registryBuilder.registry.plugins.push(record);
	params.seenIds.set(record.id, params.candidateOrigin);
	return true;
}
//#endregion
//#region src/plugins/loader-registration-plan.ts
/** Converts loader intent into explicit entrypoint and activation behavior. */
function resolvePluginRegistrationPlan(params) {
	if (params.canLoadScopedSetupOnlyChannelPlugin) return {
		mode: "setup-only",
		loadSetupEntry: true,
		loadSetupRuntimeEntry: false,
		runRuntimeCapabilityPolicy: false,
		runFullActivationOnlyRegistrations: false
	};
	if (params.scopedSetupOnlyChannelPluginRequested && params.requireSetupEntryForSetupOnlyChannelPlugins) return null;
	if (!params.enableStateEnabled) return null;
	if (params.toolDiscovery) return {
		mode: "tool-discovery",
		loadSetupEntry: false,
		loadSetupRuntimeEntry: false,
		runRuntimeCapabilityPolicy: true,
		runFullActivationOnlyRegistrations: false
	};
	if (!params.forceFullRuntimeForChannelPlugins && params.shouldLoadModules && !params.validateOnly && shouldLoadChannelPluginInSetupRuntime({
		manifestChannels: params.manifestRecord.channels,
		setupSource: params.manifestRecord.setupSource,
		startupDeferConfiguredChannelFullLoadUntilAfterListen: params.manifestRecord.startupDeferConfiguredChannelFullLoadUntilAfterListen,
		cfg: params.cfg,
		env: params.env,
		preferSetupRuntimeForChannelPlugins: params.preferSetupRuntimeForChannelPlugins
	})) return {
		mode: "setup-runtime",
		loadSetupEntry: true,
		loadSetupRuntimeEntry: true,
		runRuntimeCapabilityPolicy: false,
		runFullActivationOnlyRegistrations: false
	};
	const mode = params.shouldActivate ? "full" : "discovery";
	return {
		mode,
		loadSetupEntry: false,
		loadSetupRuntimeEntry: false,
		runRuntimeCapabilityPolicy: true,
		runFullActivationOnlyRegistrations: mode === "full"
	};
}
//#endregion
//#region src/plugins/loader-runtime-candidate.ts
function loadRuntimePluginCandidate(params) {
	const { candidate, manifestRecord, context, state } = params;
	const { registry } = params.registryBuilder;
	const pluginId = manifestRecord.id;
	const policyId = normalizePluginPolicyId(pluginId);
	if (!matchesScopedPluginOrDreamingSidecar({
		onlyPluginIdSet: params.onlyPluginIdSet,
		pluginId,
		sidecar: params.dreamingSidecar
	})) return;
	const isDreamingSidecar = isAuthorizedDreamingSidecarPlugin({
		sidecar: params.dreamingSidecar,
		pluginId
	});
	const activationState = isDreamingSidecar ? {
		enabled: true,
		activated: true,
		explicitlyEnabled: false,
		source: "auto",
		reason: `dreaming sidecar for selected memory slot "${params.dreamingSidecar?.selectedMemoryPluginId ?? ""}"`
	} : resolveEffectivePluginActivationState({
		id: pluginId,
		origin: candidate.origin,
		config: context.normalized,
		rootConfig: context.cfg,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
		activationSource: context.activationSource,
		autoEnabledReason: formatAutoEnabledActivationReason(context.autoEnabledReasons[pluginId])
	});
	const existingOrigin = state.seenIds.get(pluginId);
	if (existingOrigin) {
		const duplicate = createManifestPluginRecord({
			candidate,
			manifestRecord,
			enabled: false,
			activationState
		});
		duplicate.status = "disabled";
		duplicate.error = `overridden by ${existingOrigin} plugin`;
		markPluginActivationDisabled(duplicate, duplicate.error);
		registry.plugins.push(duplicate);
		return;
	}
	const enableState = isDreamingSidecar ? { enabled: true } : resolveEffectiveEnableState({
		id: pluginId,
		origin: candidate.origin,
		config: context.normalized,
		rootConfig: context.cfg,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
		activationSource: context.activationSource
	});
	const entry = context.normalized.entries[policyId];
	const record = createManifestPluginRecord({
		candidate,
		manifestRecord,
		enabled: enableState.enabled,
		activationState
	});
	applyPluginManifestRecordDetails(record, manifestRecord);
	const pluginRoot = safeRealpathOrResolve(candidate.rootDir);
	const degradedPluginForId = findActiveDegradedPlugin(pluginId);
	const degradedPlugin = degradedPluginForId && degradedPluginMatchesRoot(degradedPluginForId, pluginRoot) ? degradedPluginForId : void 0;
	const clearMismatchedQuarantineAfterLoad = enableState.enabled && Boolean(degradedPluginForId) && !degradedPlugin;
	if (enableState.enabled && degradedPlugin) {
		recordPluginConfiguredUnavailable({
			registry,
			record,
			seenIds: state.seenIds,
			origin: candidate.origin,
			degradedPlugin
		});
		return;
	}
	const trustedLocalScopedChannelSetupImport = resolveManifestOwnerBasePolicyBlock({
		plugin: { id: pluginId },
		normalizedConfig: context.normalized
	}) === null && (hasExplicitManifestOwnerTrust({
		plugin: { id: pluginId },
		normalizedConfig: context.normalized
	}) || candidate.origin === "workspace" && activationState.source === "auto");
	const blockUntrustedLocalScopedChannelSetupImport = context.includeSetupOnlyChannelPlugins && !params.validateOnly && Boolean(params.onlyPluginIdSet) && manifestRecord.channels.length > 0 && candidate.origin !== "bundled" && !trustedLocalScopedChannelSetupImport;
	const pushPluginLoadError = (message) => pushPluginValidationError({
		registry,
		seenIds: state.seenIds,
		pluginId,
		origin: candidate.origin,
		record,
		message
	});
	if (blockUntrustedLocalScopedChannelSetupImport) {
		record.status = "disabled";
		record.error = activationState.reason ?? enableState.reason ?? "local plugin requires explicit trust for setup";
		markPluginActivationDisabled(record, record.error);
		registry.plugins.push(record);
		return;
	}
	const runtimeCandidateEntry = resolvePluginRuntimeArtifact({
		pluginId,
		entryKind: "runtime",
		source: candidate.source,
		rootDir: pluginRoot,
		origin: candidate.origin,
		preferBuiltPluginArtifacts: context.preferBuiltPluginArtifacts,
		packageManifest: candidate.packageManifest
	});
	const runtimeSetupEntry = manifestRecord.setupSource ? resolvePluginRuntimeArtifact({
		pluginId,
		entryKind: "setup",
		source: manifestRecord.setupSource,
		rootDir: pluginRoot,
		origin: candidate.origin,
		preferBuiltPluginArtifacts: context.preferBuiltPluginArtifacts,
		packageManifest: candidate.packageManifest
	}) : void 0;
	const scopedSetupOnlyChannelPluginRequested = context.includeSetupOnlyChannelPlugins && !params.validateOnly && Boolean(params.onlyPluginIdSet) && manifestRecord.channels.length > 0 && (!enableState.enabled || context.forceSetupOnlyChannelPlugins);
	const registrationPlan = resolvePluginRegistrationPlan({
		canLoadScopedSetupOnlyChannelPlugin: scopedSetupOnlyChannelPluginRequested && (candidate.origin !== "workspace" || enableState.enabled) && (!context.requireSetupEntryForSetupOnlyChannelPlugins || Boolean(manifestRecord.setupSource)),
		scopedSetupOnlyChannelPluginRequested,
		requireSetupEntryForSetupOnlyChannelPlugins: context.requireSetupEntryForSetupOnlyChannelPlugins,
		enableStateEnabled: enableState.enabled,
		shouldLoadModules: context.shouldLoadModules,
		validateOnly: params.validateOnly,
		shouldActivate: context.shouldActivate,
		manifestRecord,
		cfg: context.cfg,
		env: context.env,
		preferSetupRuntimeForChannelPlugins: context.forceFullRuntimeForChannelPlugins ? false : context.preferSetupRuntimeForChannelPlugins,
		forceFullRuntimeForChannelPlugins: context.forceFullRuntimeForChannelPlugins,
		toolDiscovery: params.options.toolDiscovery === true
	});
	if (!registrationPlan) {
		record.status = "disabled";
		record.error = enableState.reason;
		markPluginActivationDisabled(record, enableState.reason);
		registry.plugins.push(record);
		state.seenIds.set(pluginId, candidate.origin);
		return;
	}
	if (!enableState.enabled) {
		record.status = "disabled";
		record.error = enableState.reason;
		markPluginActivationDisabled(record, enableState.reason);
	}
	if (record.format === "bundle") {
		recordBundleDiagnostics({
			record,
			registry
		});
		state.seenIds.set(pluginId, candidate.origin);
		return;
	}
	const memorySlot = context.normalized.slots.memory;
	if (registrationPlan.runRuntimeCapabilityPolicy && candidate.origin === "bundled" && hasKind(manifestRecord.kind, "memory") && !isDreamingSidecar) {
		const earlyMemoryDecision = resolveMemorySlotDecision({
			id: record.id,
			kind: manifestRecord.kind,
			slot: memorySlot,
			selectedId: state.selectedMemoryPluginId
		});
		if (!earlyMemoryDecision.enabled) {
			record.enabled = false;
			record.status = "disabled";
			record.error = earlyMemoryDecision.reason;
			markPluginActivationDisabled(record, earlyMemoryDecision.reason);
			registry.plugins.push(record);
			state.seenIds.set(pluginId, candidate.origin);
			return;
		}
	}
	if (!manifestRecord.configSchema) {
		pushPluginLoadError("missing config schema");
		return;
	}
	if (!context.shouldLoadModules && registrationPlan.runRuntimeCapabilityPolicy) {
		const memoryDecision = resolveMemorySlotDecision({
			id: record.id,
			kind: record.kind,
			slot: memorySlot,
			selectedId: state.selectedMemoryPluginId
		});
		if (!memoryDecision.enabled && !isDreamingSidecar) {
			record.enabled = false;
			record.status = "disabled";
			record.error = memoryDecision.reason;
			markPluginActivationDisabled(record, memoryDecision.reason);
			registry.plugins.push(record);
			state.seenIds.set(pluginId, candidate.origin);
			return;
		}
		if (memoryDecision.selected && hasKind(record.kind, "memory")) {
			state.selectedMemoryPluginId = record.id;
			state.memorySlotMatched = true;
			record.memorySlotSelected = true;
		}
	}
	const validatedConfig = validatePluginConfig({
		schema: manifestRecord.configSchema,
		cacheKey: manifestRecord.schemaCacheKey,
		value: entry?.config
	});
	if (!validatedConfig.ok) {
		params.logger.error(`[plugins] ${record.id} invalid config: ${validatedConfig.error.join(", ")}`);
		pushPluginLoadError(`invalid config: ${validatedConfig.error.join(", ")}`);
		return;
	}
	if (!context.shouldLoadModules) {
		applyManifestSnapshotMetadata(record, manifestRecord);
		registry.plugins.push(record);
		state.seenIds.set(pluginId, candidate.origin);
		return;
	}
	const loadEntry = registrationPlan.loadSetupEntry && runtimeSetupEntry ? runtimeSetupEntry : runtimeCandidateEntry;
	const moduleLoadSource = resolveCanonicalDistRuntimeSource(loadEntry.source);
	const moduleRoot = resolveCanonicalDistRuntimeSource(loadEntry.rootDir);
	const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
		origin: candidate.origin,
		rootDir: candidate.rootDir,
		env: context.env
	});
	const opened = openRootFileSync({
		absolutePath: moduleLoadSource,
		rootPath: moduleRoot,
		boundaryLabel: "plugin root",
		rejectHardlinks,
		skipLexicalRootCheck: true
	});
	if (!opened.ok) {
		pushPluginLoadError("plugin entry path escapes plugin root or fails alias checks");
		return;
	}
	const safeSource = opened.path;
	fs.closeSync(opened.fd);
	let mod = null;
	let moduleLoadMs;
	let moduleLoadFailed = false;
	const beforeModuleLoad = performance.now();
	try {
		recordImportedPluginId(record.id);
		state.pluginLoadAttemptCount++;
		params.logger.debug?.(`[plugins] loading ${record.id} from ${safeSource}`);
		mod = withProfile({
			pluginId: record.id,
			source: safeSource
		}, registrationPlan.mode, () => params.loadPluginModule(safeSource));
	} catch (error) {
		recordPluginError({
			logger: params.logger,
			registry,
			record,
			seenIds: state.seenIds,
			pluginId,
			origin: candidate.origin,
			phase: "load",
			error,
			logPrefix: `[plugins] ${record.id} failed to load from ${record.source}: `,
			diagnosticMessagePrefix: "failed to load plugin: "
		});
		moduleLoadFailed = true;
		return;
	} finally {
		moduleLoadMs = performance.now() - beforeModuleLoad;
		detailPluginStartupTrace(params.options.startupTrace, record.id, [["loadMs", moduleLoadMs], ["loadFailedCount", moduleLoadFailed ? 1 : 0]]);
	}
	if (loadSetupRuntimeChannelCandidate({
		mod,
		manifestRecord,
		record,
		registrationPlan,
		runtimeCandidateEntry,
		safeSource,
		rejectHardlinks,
		loadPluginModule: params.loadPluginModule,
		registryBuilder: params.registryBuilder,
		cfg: context.cfg,
		entry,
		env: context.env,
		preferSetupRuntimeForChannelPlugins: context.preferSetupRuntimeForChannelPlugins,
		seenIds: state.seenIds,
		candidateOrigin: candidate.origin,
		logger: params.logger,
		pushPluginLoadError
	})) return;
	const { definition, register } = resolvePluginModuleExport(mod);
	if (definition?.id && definition.id !== record.id) {
		pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", export uses "${definition.id}")`);
		return;
	}
	record.name = definition?.name ?? record.name;
	record.description = definition?.description ?? record.description;
	record.version = definition?.version ?? record.version;
	const manifestKind = record.kind;
	const exportKind = definition?.kind;
	if (manifestKind && exportKind && !kindsEqual(manifestKind, exportKind)) registry.diagnostics.push({
		level: "warn",
		pluginId: record.id,
		source: record.source,
		message: `plugin kind mismatch (manifest uses "${String(manifestKind)}", export uses "${String(exportKind)}")`
	});
	record.kind = definition?.kind ?? record.kind;
	if (hasKind(record.kind, "memory") && memorySlot === record.id) state.memorySlotMatched = true;
	if (registrationPlan.runRuntimeCapabilityPolicy && !isDreamingSidecar) {
		const memoryDecision = resolveMemorySlotDecision({
			id: record.id,
			kind: record.kind,
			slot: memorySlot,
			selectedId: state.selectedMemoryPluginId
		});
		if (!memoryDecision.enabled) {
			record.enabled = false;
			record.status = "disabled";
			record.error = memoryDecision.reason;
			markPluginActivationDisabled(record, memoryDecision.reason);
			registry.plugins.push(record);
			state.seenIds.set(pluginId, candidate.origin);
			return;
		}
		if (memoryDecision.selected && hasKind(record.kind, "memory")) {
			state.selectedMemoryPluginId = record.id;
			record.memorySlotSelected = true;
		}
	}
	if (registrationPlan.runFullActivationOnlyRegistrations) {
		if (definition?.reload) params.registryBuilder.registerReload(record, definition.reload);
		for (const nodeHostCommand of definition?.nodeHostCommands ?? []) params.registryBuilder.registerNodeHostCommand(record, nodeHostCommand);
		for (const collector of definition?.securityAuditCollectors ?? []) params.registryBuilder.registerSecurityAuditCollector(record, collector);
	}
	if (params.validateOnly) {
		registry.plugins.push(record);
		state.seenIds.set(pluginId, candidate.origin);
		return;
	}
	if (typeof register !== "function") {
		const wrongLoaderError = formatBundledChannelWrongLoaderError(record.kind);
		if (wrongLoaderError) {
			params.logger.error(`[plugins] ${record.id} ${wrongLoaderError}; ensure plugin is loaded via bundled channel discovery, not legacy plugin loader`);
			pushPluginLoadError(wrongLoaderError);
		} else {
			params.logger.error(`[plugins] ${record.id} missing register/activate export`);
			pushPluginLoadError(formatMissingPluginRegisterError(mod, context.env));
		}
		return;
	}
	const api = params.registryBuilder.createApi(record, {
		config: context.cfg,
		pluginConfig: validatedConfig.value,
		hookPolicy: entry?.hooks,
		registrationMode: registrationPlan.mode
	});
	const transaction = createPluginRegistrationTransaction({
		registry,
		rollbackGlobalSideEffects: () => params.registryBuilder.rollbackPluginGlobalSideEffects(record.id)
	});
	const beforeRegister = performance.now();
	let registerFailed = false;
	try {
		withProfile({
			pluginId: record.id,
			source: record.source
		}, `${registrationPlan.mode}:register`, () => runPluginRegisterSync(register, api));
		registry.plugins.push(record);
		state.seenIds.set(pluginId, candidate.origin);
		transaction.commit({ activate: context.shouldActivate });
		if (clearMismatchedQuarantineAfterLoad) clearActiveDegradedPlugin(pluginId);
	} catch (error) {
		transaction.rollback();
		recordPluginError({
			logger: params.logger,
			registry,
			record,
			seenIds: state.seenIds,
			pluginId,
			origin: candidate.origin,
			phase: "register",
			error,
			logPrefix: `[plugins] ${record.id} failed during register from ${record.source}: `,
			diagnosticMessagePrefix: "plugin failed during register: "
		});
		registerFailed = true;
	} finally {
		const registerMs = performance.now() - beforeRegister;
		detailPluginStartupTrace(params.options.startupTrace, record.id, [
			["registerMs", registerMs],
			["loadAndRegisterMs", moduleLoadMs + registerMs],
			["registerFailedCount", registerFailed ? 1 : 0]
		]);
	}
}
function recordBundleDiagnostics(params) {
	const unsupportedCapabilities = (params.record.bundleCapabilities ?? []).filter((capability) => capability !== "skills" && capability !== "mcpServers" && capability !== "settings" && !((capability === "commands" || capability === "agents" || capability === "outputStyles" || capability === "lspServers") && (params.record.bundleFormat === "claude" || params.record.bundleFormat === "cursor")) && !(capability === "hooks" && (params.record.bundleFormat === "codex" || params.record.bundleFormat === "claude")));
	for (const capability of unsupportedCapabilities) params.registry.diagnostics.push({
		level: "warn",
		pluginId: params.record.id,
		source: params.record.source,
		message: `bundle capability detected but not wired into OpenClaw yet: ${capability}`
	});
	if (params.record.enabled && params.record.rootDir && params.record.bundleFormat && (params.record.bundleCapabilities ?? []).includes("mcpServers")) {
		const runtimeSupport = inspectBundleMcpRuntimeSupport({
			pluginId: params.record.id,
			rootDir: params.record.rootDir,
			bundleFormat: params.record.bundleFormat
		});
		for (const message of runtimeSupport.diagnostics) params.registry.diagnostics.push({
			level: "warn",
			pluginId: params.record.id,
			source: params.record.source,
			message
		});
		if (runtimeSupport.unsupportedServerNames.length > 0) params.registry.diagnostics.push({
			level: "warn",
			pluginId: params.record.id,
			source: params.record.source,
			message: `bundle MCP servers use unsupported transports or incomplete configs (stdio only today): ${runtimeSupport.unsupportedServerNames.join(", ")}`
		});
	}
	params.registry.plugins.push(params.record);
}
//#endregion
//#region src/plugins/loader-runtime-load.ts
function loadOpenClawPlugins(options = {}) {
	const requestedOnlyPluginIdSet = createPluginIdScopeSet(normalizePluginIdScope(options.onlyPluginIds));
	if (requestedOnlyPluginIdSet && requestedOnlyPluginIdSet.size === 0) {
		const emptyRegistry = createEmptyPluginRegistry();
		if (options.activate !== false) {
			clearActivatedPluginRuntimeState();
			const runtimeSubagentMode = resolveRuntimeSubagentMode(options.runtimeOptions);
			activatePluginRegistry(emptyRegistry, `empty-plugin-scope::${runtimeSubagentMode}::${options.workspaceDir ?? ""}`, runtimeSubagentMode, options.workspaceDir);
		}
		return emptyRegistry;
	}
	const context = resolvePluginLoadCacheContext(options);
	const logger = options.logger ?? createPluginLoaderLogger();
	const validateOnly = options.mode === "validate";
	const onlyPluginIdSet = createPluginIdScopeSet(context.onlyPluginIds);
	const cacheEnabled = options.cache !== false && options.resolveRawConfigEnvVars !== true;
	if (cacheEnabled) {
		const cached = getReusableCachedPluginRegistry({
			cacheKey: context.cacheKey,
			onlyPluginIds: context.onlyPluginIds,
			runtimeSubagentMode: context.runtimeSubagentMode,
			options
		});
		if (cached) {
			if (context.shouldActivate) {
				restorePluginProcessGlobalState(cached.state.processGlobalState);
				activatePluginRegistry(cached.state.registry, cached.cacheKey, cached.runtimeSubagentMode, options.workspaceDir);
			}
			return cached.state.registry;
		}
	}
	pluginLoaderCacheState.beginLoad(context.cacheKey);
	let registryBuilder;
	const activatingLoadTransaction = context.shouldActivate ? createPluginRegistrationTransaction({ rollbackGlobalSideEffects: () => {
		const loadedPluginIds = (registryBuilder?.registry.plugins ?? []).filter((plugin) => plugin.status === "loaded").map((plugin) => plugin.id);
		for (const pluginId of loadedPluginIds.toReversed()) registryBuilder?.rollbackPluginGlobalSideEffects(pluginId);
	} }) : null;
	try {
		if (context.shouldActivate) clearActivatedPluginRuntimeState();
		const loadPluginModule = createPluginModuleLoader({
			devSourceRoot: context.devSourceRoot,
			pluginSdkResolution: options.pluginSdkResolution
		});
		registryBuilder = createPluginRegistry({
			logger,
			runtime: createLazyPluginRuntime({
				devSourceRoot: context.devSourceRoot,
				pluginSdkResolution: options.pluginSdkResolution,
				runtimeOptions: options.runtimeOptions,
				loadPluginModule
			}),
			coreGatewayHandlers: options.coreGatewayHandlers,
			...options.coreGatewayMethodNames !== void 0 && { coreGatewayMethodNames: options.coreGatewayMethodNames },
			...options.hostServices !== void 0 && { hostServices: options.hostServices },
			activateGlobalSideEffects: context.shouldActivate
		});
		const { registry } = registryBuilder;
		const { manifestRegistry, orderedCandidates, manifestBySource, provenance } = resolvePluginLoadDiscovery({
			options,
			context,
			diagnostics: registry.diagnostics,
			logger,
			onlyPluginIdSet,
			emitWarning: context.shouldActivate,
			warningCacheKey: context.cacheKey,
			suppliedManifestRegistry: options.manifestRegistry
		});
		const memorySlot = context.normalized.slots.memory;
		const state = {
			seenIds: /* @__PURE__ */ new Map(),
			selectedMemoryPluginId: null,
			memorySlotMatched: false,
			pluginLoadAttemptCount: 0
		};
		const dreamingSidecar = resolveAuthorizedDreamingSidecar({
			cfg: context.cfg,
			normalized: context.normalized,
			activationSource: context.activationSource,
			manifestRegistry,
			memorySlot
		});
		const pluginLoadStartMs = performance.now();
		for (const candidate of orderedCandidates) {
			const manifestRecord = manifestBySource.get(candidate.source);
			if (!manifestRecord) continue;
			loadRuntimePluginCandidate({
				candidate,
				manifestRecord,
				context,
				options,
				onlyPluginIdSet,
				dreamingSidecar,
				validateOnly,
				registryBuilder,
				loadPluginModule,
				logger,
				state
			});
		}
		const pluginLoadElapsedMs = performance.now() - pluginLoadStartMs;
		if (state.pluginLoadAttemptCount > 0) logger.debug?.(`[plugins] loaded ${registry.plugins.length} plugin(s) (${state.pluginLoadAttemptCount} attempted) in ${pluginLoadElapsedMs.toFixed(1)}ms`);
		if (!onlyPluginIdSet && typeof memorySlot === "string" && !state.memorySlotMatched) registry.diagnostics.push({
			level: "warn",
			message: `memory slot plugin not found or not marked as memory: ${memorySlot}`
		});
		warnAboutUntrackedLoadedPlugins({
			registry,
			provenance,
			allowlist: context.normalized.allow,
			emitWarning: context.shouldActivate,
			logger,
			env: context.env
		});
		maybeThrowOnPluginLoadError(registry, options.throwOnLoadError);
		if (context.shouldActivate && options.mode !== "validate") {
			const failedPlugins = registry.plugins.filter((plugin) => plugin.failedAt != null);
			if (failedPlugins.length > 0) logger.warn(`[plugins] ${failedPlugins.length} plugin(s) failed to initialize (${formatPluginFailureSummary(failedPlugins)}). Run 'openclaw plugins inspect <id> --runtime --json' for runtime diagnostics, 'openclaw plugins list' for registry state, and restart the Gateway after plugin code or load-path changes.`);
		}
		if (cacheEnabled) setCachedPluginRegistry(context.cacheKey, {
			registry,
			processGlobalState: snapshotPluginProcessGlobalState()
		}, context.onlyPluginIds);
		if (context.shouldActivate) {
			activatingLoadTransaction?.commit({ activate: true });
			activatePluginRegistry(registry, context.cacheKey, context.runtimeSubagentMode, options.workspaceDir);
		}
		return registry;
	} catch (error) {
		activatingLoadTransaction?.rollback();
		throw error;
	} finally {
		pluginLoaderCacheState.finishLoad(context.cacheKey);
	}
}
//#endregion
//#region src/plugins/loader-runtime-registry.ts
function pluginLoadOptionsMatchCacheKey(options, expectedCacheKey) {
	return resolvePluginLoadCacheContext(options).cacheKey === expectedCacheKey;
}
function pluginToolDiscoveryOptionsMatchActiveCacheKey(options, expectedCacheKey) {
	if (options.toolDiscovery !== true) return false;
	const fullRuntimeOptions = {
		...options,
		toolDiscovery: void 0
	};
	if (pluginLoadOptionsMatchCacheKey(fullRuntimeOptions, expectedCacheKey)) return true;
	if (options.activate !== false) return false;
	return pluginLoadOptionsMatchCacheKey({
		...fullRuntimeOptions,
		activate: true
	}, expectedCacheKey);
}
function registryContainsPluginScope(registry, onlyPluginIds) {
	if (!onlyPluginIds || onlyPluginIds.length === 0) return false;
	const loadedPluginIds = new Set(registry.plugins.map((plugin) => plugin.id));
	return onlyPluginIds.every((pluginId) => loadedPluginIds.has(pluginId));
}
function scopedPluginLoadOptionsMatchWiderActiveCacheKey(options, expectedCacheKey, activeRegistry) {
	const { onlyPluginIds } = resolvePluginLoadCacheContext(options);
	if (!registryContainsPluginScope(activeRegistry, onlyPluginIds)) return false;
	return pluginLoadOptionsMatchCacheKey({
		...options,
		onlyPluginIds: void 0
	}, expectedCacheKey);
}
function getCompatibleActivePluginRegistry(options = {}) {
	if (options.resolveRawConfigEnvVars === true) return;
	const activeRegistry = getActivePluginRegistry() ?? void 0;
	if (!activeRegistry) return;
	if (!hasExplicitCompatibilityInputs(options)) return activeRegistry;
	const activeCacheKey = getActivePluginRegistryKey();
	if (!activeCacheKey) return;
	const loadContext = resolvePluginLoadCacheContext(options);
	const matchesActiveCacheKey = (candidate) => {
		if (pluginLoadOptionsMatchCacheKey(candidate, activeCacheKey)) return true;
		if (candidate.coreGatewayMethodNames !== void 0) return false;
		return pluginLoadOptionsMatchCacheKey({
			...candidate,
			coreGatewayMethodNames: activeRegistry.coreGatewayMethodNames
		}, activeCacheKey);
	};
	const matchesCompatibleActiveRegistry = (candidate) => {
		if (matchesActiveCacheKey(candidate)) return true;
		if (scopedPluginLoadOptionsMatchWiderActiveCacheKey(candidate, activeCacheKey, activeRegistry)) return true;
		return pluginToolDiscoveryOptionsMatchActiveCacheKey(candidate, activeCacheKey);
	};
	if (matchesCompatibleActiveRegistry(options)) return activeRegistry;
	if (!loadContext.shouldActivate) {
		if (matchesCompatibleActiveRegistry({
			...options,
			activate: true
		})) return activeRegistry;
	}
	const activeRuntimeSubagentMode = getActivePluginRuntimeSubagentMode();
	if (activeRuntimeSubagentMode === "gateway-bindable") {
		if (matchesCompatibleActiveRegistry({
			...options,
			preferBuiltPluginArtifacts: true
		})) return activeRegistry;
		if (!loadContext.shouldActivate) {
			if (matchesCompatibleActiveRegistry({
				...options,
				activate: true,
				preferBuiltPluginArtifacts: true
			})) return activeRegistry;
		}
	}
	if (loadContext.runtimeSubagentMode === "default" && activeRuntimeSubagentMode === "gateway-bindable") {
		const gatewayBindableOptions = {
			...options,
			runtimeOptions: {
				...options.runtimeOptions,
				allowGatewaySubagentBinding: true
			}
		};
		const gatewayStartupOptions = {
			...gatewayBindableOptions,
			preferBuiltPluginArtifacts: true
		};
		if (!loadContext.shouldActivate) {
			const activatingGatewayBindableOptions = {
				...options,
				activate: true,
				runtimeOptions: {
					...options.runtimeOptions,
					allowGatewaySubagentBinding: true
				}
			};
			const activatingGatewayStartupOptions = {
				...activatingGatewayBindableOptions,
				preferBuiltPluginArtifacts: true
			};
			if (matchesCompatibleActiveRegistry(gatewayBindableOptions) || matchesCompatibleActiveRegistry(gatewayStartupOptions) || matchesCompatibleActiveRegistry(activatingGatewayBindableOptions) || matchesCompatibleActiveRegistry(activatingGatewayStartupOptions)) return activeRegistry;
		} else if (matchesCompatibleActiveRegistry(gatewayBindableOptions) || matchesCompatibleActiveRegistry(gatewayStartupOptions)) return activeRegistry;
	}
}
function resolveRuntimePluginRegistry(options) {
	if (!options || !hasExplicitCompatibilityInputs(options)) return getCompatibleActivePluginRegistry();
	const compatible = getCompatibleActivePluginRegistry(options);
	if (compatible) return compatible;
	if (isPluginRegistryLoadInFlight(options)) return;
	return loadOpenClawPlugins(options);
}
function getRuntimePluginRegistryForLoadOptions(options) {
	return resolveRuntimePluginRegistry(options);
}
/** Return a compatible active registry without triggering a fresh load on cache miss. */
function resolveCompatibleRuntimePluginRegistry(options) {
	return getCompatibleActivePluginRegistry(options);
}
//#endregion
export { loadOpenClawPluginCliRegistry as a, isPluginRegistryLoadInFlight as c, loadOpenClawPlugins as i, resolvePluginRegistryLoadCacheKey as l, resolveCompatibleRuntimePluginRegistry as n, clearActivatedPluginRuntimeState as o, resolveRuntimePluginRegistry as r, clearPluginRegistryLoadCache as s, getRuntimePluginRegistryForLoadOptions as t, resolvePluginRuntimeArtifact as u };
