import { g as sortUniqueStrings, l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { n as discoverOpenClawPlugins } from "./discovery-Bhd5Zo0N.js";
import { i as openRootFileSync } from "./root-file-9jkyxRTl.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import "./boundary-file-read-BgBHxIxZ.js";
import { i as resolveConfigScopedRuntimeCacheValue } from "./plugin-cache-primitives-BaxqicKH.js";
import { n as loadPluginManifestRegistry } from "./manifest-registry-DkJa8Tn0.js";
import { n as resolveOpenClawDevSourceRoot } from "./dev-source-root-BBoGpDBN.js";
import { i as resolveBundledPluginRepoEntryPath } from "./bundled-plugin-metadata-CrWS3bPy.js";
import { n as getCachedPluginModuleLoader, t as createPluginModuleLoaderCache } from "./plugin-module-loader-cache-BmNGbwiD.js";
import { l as shouldPreferNativeModuleLoad, t as buildPluginLoaderAliasMap } from "./sdk-alias-BzrvkJcB.js";
import { t as unwrapDefaultModuleExport } from "./module-export-DsZgGIbX.js";
import { n as normalizeCapabilityProviderId } from "./provider-registry-shared-Cg-By8cT.js";
import { a as loadManifestContractSnapshot, n as isManifestPluginAvailableForControlPlane, t as hasManifestContractValue } from "./manifest-contract-eligibility-DbVdNqi2.js";
import { n as withBundledPluginVitestCompat, t as withBundledPluginEnablementCompat } from "./bundled-compat-B3hvbtGQ.js";
import { t as buildPluginApi } from "./api-builder-BOlccqi0.js";
import { l as resolvePluginRegistryLoadCacheKey, r as resolveRuntimePluginRegistry } from "./loader-Bp4FN_wM.js";
import { c as normalizePluginToolContractNames, h as resolveVoiceModelRefs, o as normalizeAgentToolResultMiddlewareRuntimes, s as findUndeclaredPluginToolNames } from "./registry-BSBtFA2q.js";
import { O as createEmptyPluginRegistry } from "./runtime-BapEso0o.js";
import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-zZ4JR6Tx.js";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
//#region src/plugins/captured-registration.ts
function createCapturedPluginRegistration(params) {
	const providers = [];
	const agentHarnesses = [];
	const cliRegistrars = [];
	const cliBackends = [];
	const textTransforms = [];
	const codexAppServerExtensionFactories = [];
	const agentToolResultMiddlewares = [];
	const embeddingProviders = [];
	const speechProviders = [];
	const realtimeTranscriptionProviders = [];
	const realtimeVoiceProviders = [];
	const mediaUnderstandingProviders = [];
	const transcriptSourceProviders = [];
	const imageGenerationProviders = [];
	const videoGenerationProviders = [];
	const musicGenerationProviders = [];
	const webFetchProviders = [];
	const webSearchProviders = [];
	const workerProviders = [];
	const migrationProviders = [];
	const memoryEmbeddingProviders = [];
	const sessionExtensions = [];
	const trustedToolPolicies = [];
	const toolMetadata = [];
	const controlUiDescriptors = [];
	const runtimeLifecycles = [];
	const agentEventSubscriptions = [];
	const sessionSchedulerJobs = [];
	const sessionActions = [];
	let capturedSessionTurnCount = 0;
	const tools = [];
	const modelCatalogProviders = [];
	const sessionCatalogs = [];
	const pluginId = params?.id ?? "captured-plugin-registration";
	const pluginName = params?.name ?? "Captured Plugin Registration";
	const pluginSource = params?.source ?? "captured-plugin-registration";
	return {
		providers,
		agentHarnesses,
		cliRegistrars,
		cliBackends,
		textTransforms,
		codexAppServerExtensionFactories,
		agentToolResultMiddlewares,
		embeddingProviders,
		speechProviders,
		realtimeTranscriptionProviders,
		realtimeVoiceProviders,
		mediaUnderstandingProviders,
		transcriptSourceProviders,
		imageGenerationProviders,
		videoGenerationProviders,
		musicGenerationProviders,
		webFetchProviders,
		webSearchProviders,
		workerProviders,
		migrationProviders,
		memoryEmbeddingProviders,
		sessionExtensions,
		trustedToolPolicies,
		toolMetadata,
		controlUiDescriptors,
		runtimeLifecycles,
		agentEventSubscriptions,
		sessionSchedulerJobs,
		sessionActions,
		tools,
		modelCatalogProviders,
		sessionCatalogs,
		api: buildPluginApi({
			id: pluginId,
			name: pluginName,
			source: pluginSource,
			registrationMode: params?.registrationMode ?? "full",
			config: params?.config ?? {},
			runtime: {},
			logger: {
				info() {},
				warn() {},
				error() {},
				debug() {}
			},
			resolvePath: (input) => input,
			handlers: {
				registerCli(registrar, opts) {
					const parentPath = normalizeStringEntries(opts?.parentPath ?? []);
					const descriptors = (opts?.descriptors ?? []).map((descriptor) => ({
						name: descriptor.name.trim(),
						description: descriptor.description.trim(),
						hasSubcommands: descriptor.hasSubcommands
					})).filter((descriptor) => descriptor.name && descriptor.description);
					const commands = normalizeStringEntries([...opts?.commands ?? [], ...descriptors.map((descriptor) => descriptor.name)]);
					if (commands.length === 0) return;
					cliRegistrars.push({
						register: registrar,
						parentPath,
						commands,
						descriptors
					});
				},
				registerProvider(provider) {
					providers.push(provider);
				},
				registerModelCatalogProvider(provider) {
					modelCatalogProviders.push(provider);
				},
				registerSessionCatalog(provider) {
					sessionCatalogs.push(provider);
				},
				registerAgentHarness(harness) {
					agentHarnesses.push(harness);
				},
				registerCodexAppServerExtensionFactory(factory) {
					codexAppServerExtensionFactories.push(factory);
				},
				registerAgentToolResultMiddleware(handler, options) {
					const runtimes = normalizeAgentToolResultMiddlewareRuntimes(options);
					agentToolResultMiddlewares.push({
						pluginId,
						pluginName,
						rawHandler: handler,
						handler,
						runtimes,
						source: pluginSource
					});
				},
				registerCliBackend(backend) {
					cliBackends.push(backend);
				},
				registerTextTransforms(transforms) {
					textTransforms.push(transforms);
				},
				registerEmbeddingProvider(provider) {
					embeddingProviders.push(provider);
				},
				registerSpeechProvider(provider) {
					speechProviders.push(provider);
				},
				registerRealtimeTranscriptionProvider(provider) {
					realtimeTranscriptionProviders.push(provider);
				},
				registerRealtimeVoiceProvider(provider) {
					realtimeVoiceProviders.push(provider);
				},
				registerMediaUnderstandingProvider(provider) {
					mediaUnderstandingProviders.push(provider);
				},
				registerTranscriptSourceProvider(provider) {
					transcriptSourceProviders.push(provider);
				},
				registerImageGenerationProvider(provider) {
					imageGenerationProviders.push(provider);
				},
				registerVideoGenerationProvider(provider) {
					videoGenerationProviders.push(provider);
				},
				registerMusicGenerationProvider(provider) {
					musicGenerationProviders.push(provider);
				},
				registerWebFetchProvider(provider) {
					webFetchProviders.push(provider);
				},
				registerWebSearchProvider(provider) {
					webSearchProviders.push(provider);
				},
				registerWorkerProvider(provider) {
					workerProviders.push(provider);
				},
				registerMigrationProvider(provider) {
					migrationProviders.push(provider);
				},
				registerMemoryEmbeddingProvider(adapter) {
					memoryEmbeddingProviders.push(adapter);
				},
				registerSessionExtension(extension) {
					sessionExtensions.push(extension);
				},
				registerTrustedToolPolicy(policy) {
					trustedToolPolicies.push(policy);
				},
				registerToolMetadata(metadata) {
					toolMetadata.push(metadata);
				},
				registerControlUiDescriptor(descriptor) {
					controlUiDescriptors.push(descriptor);
				},
				registerRuntimeLifecycle(lifecycle) {
					runtimeLifecycles.push(lifecycle);
				},
				registerAgentEventSubscription(subscription) {
					agentEventSubscriptions.push(subscription);
				},
				emitAgentEvent: () => ({
					emitted: false,
					reason: "captured registration"
				}),
				registerSessionSchedulerJob(job) {
					sessionSchedulerJobs.push(job);
					return {
						id: job.id,
						pluginId,
						sessionKey: job.sessionKey,
						kind: job.kind
					};
				},
				registerSessionAction(action) {
					sessionActions.push(action);
				},
				sendSessionAttachment: async () => ({
					ok: false,
					error: "captured registration"
				}),
				scheduleSessionTurn: async (schedule) => {
					capturedSessionTurnCount += 1;
					return {
						id: `captured-session-turn-${capturedSessionTurnCount}`,
						pluginId,
						sessionKey: schedule.sessionKey,
						kind: "session-turn"
					};
				},
				unscheduleSessionTurnsByTag: async () => ({
					removed: 0,
					failed: 0
				}),
				registerTool(tool) {
					if (typeof tool !== "function") tools.push(tool);
				}
			}
		})
	};
}
//#endregion
//#region src/plugins/bundled-capability-runtime.ts
/** Loads capability providers from bundled plugin public runtime artifacts. */
const log = createSubsystemLogger("plugins");
const CAPABILITY_VITEST_SHIM_ALIASES = [
	{
		subpath: "config-runtime",
		target: new URL("./capability-runtime-vitest-shims/config-runtime.ts", import.meta.url)
	},
	{
		subpath: "media-runtime",
		target: new URL("./capability-runtime-vitest-shims/media-runtime.ts", import.meta.url)
	},
	{
		subpath: "provider-onboard",
		target: new URL("../plugin-sdk/provider-onboard.ts", import.meta.url)
	},
	{
		subpath: "speech-core",
		target: new URL("./capability-runtime-vitest-shims/speech-core.ts", import.meta.url)
	}
];
function buildVitestCapabilityShimAliasMap() {
	return Object.fromEntries(CAPABILITY_VITEST_SHIM_ALIASES.flatMap(({ subpath, target }) => {
		const targetPath = fileURLToPath(target);
		return [[`openclaw/plugin-sdk/${subpath}`, targetPath], [`@openclaw/plugin-sdk/${subpath}`, targetPath]];
	}));
}
function applyVitestCapabilityAliasOverrides(params) {
	if (!params.env?.VITEST || params.pluginSdkResolution !== "dist") return params.aliasMap;
	return {
		...params.aliasMap,
		...buildVitestCapabilityShimAliasMap()
	};
}
function shouldApplyVitestCapabilityAliasOverrides(params) {
	return Boolean(params.env?.VITEST && params.pluginSdkResolution === "dist");
}
function buildBundledCapabilityRuntimeConfig(pluginIds, env) {
	return withBundledPluginVitestCompat({
		config: withBundledPluginEnablementCompat({
			config: void 0,
			pluginIds
		}),
		pluginIds,
		env
	});
}
function resolvePluginModuleExport(moduleExport) {
	const resolved = unwrapDefaultModuleExport(moduleExport);
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
function createCapabilityPluginRecord(params) {
	return {
		id: params.id,
		name: params.name ?? params.id,
		version: params.version,
		description: params.description,
		source: params.source,
		rootDir: params.rootDir,
		origin: "bundled",
		workspaceDir: params.workspaceDir,
		enabled: true,
		status: "loaded",
		toolNames: [],
		hookNames: [],
		channelIds: [],
		cliBackendIds: [],
		providerIds: [],
		embeddingProviderIds: [],
		speechProviderIds: [],
		realtimeTranscriptionProviderIds: [],
		realtimeVoiceProviderIds: [],
		mediaUnderstandingProviderIds: [],
		transcriptSourceProviderIds: [],
		imageGenerationProviderIds: [],
		videoGenerationProviderIds: [],
		musicGenerationProviderIds: [],
		webFetchProviderIds: [],
		webSearchProviderIds: [],
		migrationProviderIds: [],
		memoryEmbeddingProviderIds: [],
		agentHarnessIds: [],
		cliCommands: [],
		services: [],
		gatewayDiscoveryServiceIds: [],
		commands: [],
		httpRoutes: 0,
		hookCount: 0,
		configSchema: true
	};
}
function recordCapabilityLoadError(registry, record, message) {
	record.status = "error";
	record.error = message;
	registry.plugins.push(record);
	registry.diagnostics.push({
		level: "error",
		pluginId: record.id,
		source: record.source,
		message: `failed to load plugin: ${message}`
	});
	log.error(`[plugins] ${record.id} failed to load from ${record.source}: ${message}`);
}
function loadBundledCapabilityRuntimeRegistry(params) {
	const env = params.env ?? process.env;
	const devSourceRoot = resolveOpenClawDevSourceRoot(env);
	const pluginIds = new Set(params.pluginIds);
	const registry = createEmptyPluginRegistry();
	const moduleLoaders = createPluginModuleLoaderCache();
	const getModuleLoader = (modulePath) => {
		const tryNative = shouldPreferNativeModuleLoad(modulePath) && !(env?.VITEST && params.pluginSdkResolution === "dist");
		const aliasMap = shouldApplyVitestCapabilityAliasOverrides({
			pluginSdkResolution: params.pluginSdkResolution,
			env
		}) ? applyVitestCapabilityAliasOverrides({
			aliasMap: buildPluginLoaderAliasMap(modulePath, process.argv[1], import.meta.url, params.pluginSdkResolution, devSourceRoot),
			pluginSdkResolution: params.pluginSdkResolution,
			env
		}) : void 0;
		return getCachedPluginModuleLoader({
			cache: moduleLoaders,
			modulePath,
			importerUrl: import.meta.url,
			devSourceRoot,
			loaderFilename: import.meta.url,
			...aliasMap ? { aliasMap } : {},
			pluginSdkResolution: params.pluginSdkResolution,
			tryNative
		});
	};
	const discovery = params.discovery ?? discoverOpenClawPlugins({ env });
	const manifestRegistry = loadPluginManifestRegistry({
		config: buildBundledCapabilityRuntimeConfig(params.pluginIds, env),
		env,
		candidates: discovery.candidates,
		diagnostics: discovery.diagnostics
	});
	registry.diagnostics.push(...manifestRegistry.diagnostics);
	const manifestByRoot = new Map(manifestRegistry.plugins.map((record) => [record.rootDir, record]));
	const seenPluginIds = /* @__PURE__ */ new Set();
	const repoRoot = process.cwd();
	for (const candidate of discovery.candidates) {
		const manifest = manifestByRoot.get(candidate.rootDir);
		if (!manifest || manifest.origin !== "bundled" || !pluginIds.has(manifest.id)) continue;
		if (seenPluginIds.has(manifest.id)) continue;
		seenPluginIds.add(manifest.id);
		const record = createCapabilityPluginRecord({
			id: manifest.id,
			name: manifest.name,
			description: manifest.description,
			version: manifest.version,
			source: env?.VITEST && params.pluginSdkResolution === "dist" ? resolveBundledPluginRepoEntryPath({
				rootDir: repoRoot,
				pluginId: manifest.id,
				preferBuilt: true
			}) ?? candidate.source : candidate.source,
			rootDir: candidate.rootDir,
			workspaceDir: candidate.workspaceDir
		});
		const opened = openRootFileSync({
			absolutePath: record.source,
			rootPath: record.source === candidate.source ? candidate.rootDir : repoRoot,
			boundaryLabel: record.source === candidate.source ? "plugin root" : "repo root",
			rejectHardlinks: false,
			skipLexicalRootCheck: true
		});
		if (!opened.ok) {
			recordCapabilityLoadError(registry, record, "plugin entry path escapes plugin root or fails alias checks");
			continue;
		}
		const safeSource = opened.path;
		fs.closeSync(opened.fd);
		let mod;
		try {
			mod = getModuleLoader(safeSource)(safeSource);
		} catch (error) {
			recordCapabilityLoadError(registry, record, String(error));
			continue;
		}
		const register = resolvePluginModuleExport(mod).register;
		if (typeof register !== "function") {
			record.status = "disabled";
			record.error = "plugin export missing register(api)";
			registry.plugins.push(record);
			continue;
		}
		try {
			const captured = createCapturedPluginRegistration();
			register(captured.api);
			record.cliBackendIds.push(...captured.cliBackends.map((entry) => entry.id));
			record.providerIds.push(...captured.providers.map((entry) => entry.id));
			record.embeddingProviderIds.push(...captured.embeddingProviders.map((entry) => entry.id));
			record.speechProviderIds.push(...captured.speechProviders.map((entry) => entry.id));
			record.realtimeTranscriptionProviderIds.push(...captured.realtimeTranscriptionProviders.map((entry) => entry.id));
			record.realtimeVoiceProviderIds.push(...captured.realtimeVoiceProviders.map((entry) => entry.id));
			record.mediaUnderstandingProviderIds.push(...captured.mediaUnderstandingProviders.map((entry) => entry.id));
			record.transcriptSourceProviderIds.push(...captured.transcriptSourceProviders.map((entry) => entry.id));
			record.imageGenerationProviderIds.push(...captured.imageGenerationProviders.map((entry) => entry.id));
			record.videoGenerationProviderIds.push(...captured.videoGenerationProviders.map((entry) => entry.id));
			record.musicGenerationProviderIds.push(...captured.musicGenerationProviders.map((entry) => entry.id));
			record.webFetchProviderIds.push(...captured.webFetchProviders.map((entry) => entry.id));
			record.webSearchProviderIds.push(...captured.webSearchProviders.map((entry) => entry.id));
			record.migrationProviderIds.push(...captured.migrationProviders.map((entry) => entry.id));
			record.memoryEmbeddingProviderIds.push(...captured.memoryEmbeddingProviders.map((entry) => entry.id));
			record.agentHarnessIds.push(...captured.agentHarnesses.map((entry) => entry.id));
			record.toolNames.push(...captured.tools.map((entry) => entry.name));
			registry.cliBackends.push(...captured.cliBackends.map((backend) => ({
				pluginId: record.id,
				pluginName: record.name,
				backend,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.textTransforms.push(...captured.textTransforms.map((transforms) => ({
				pluginId: record.id,
				pluginName: record.name,
				transforms,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.providers.push(...captured.providers.map((provider) => ({
				pluginId: record.id,
				pluginName: record.name,
				provider,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.embeddingProviders.push(...captured.embeddingProviders.map((provider) => ({
				pluginId: record.id,
				pluginName: record.name,
				provider,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.speechProviders.push(...captured.speechProviders.map((provider) => ({
				pluginId: record.id,
				pluginName: record.name,
				provider,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.realtimeTranscriptionProviders.push(...captured.realtimeTranscriptionProviders.map((provider) => ({
				pluginId: record.id,
				pluginName: record.name,
				provider,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.realtimeVoiceProviders.push(...captured.realtimeVoiceProviders.map((provider) => ({
				pluginId: record.id,
				pluginName: record.name,
				provider,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.mediaUnderstandingProviders.push(...captured.mediaUnderstandingProviders.map((provider) => ({
				pluginId: record.id,
				pluginName: record.name,
				provider,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.transcriptSourceProviders.push(...captured.transcriptSourceProviders.map((provider) => ({
				pluginId: record.id,
				pluginName: record.name,
				provider,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.imageGenerationProviders.push(...captured.imageGenerationProviders.map((provider) => ({
				pluginId: record.id,
				pluginName: record.name,
				provider,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.videoGenerationProviders.push(...captured.videoGenerationProviders.map((provider) => ({
				pluginId: record.id,
				pluginName: record.name,
				provider,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.musicGenerationProviders.push(...captured.musicGenerationProviders.map((provider) => ({
				pluginId: record.id,
				pluginName: record.name,
				provider,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.webFetchProviders.push(...captured.webFetchProviders.map((provider) => ({
				pluginId: record.id,
				pluginName: record.name,
				provider,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.webSearchProviders.push(...captured.webSearchProviders.map((provider) => ({
				pluginId: record.id,
				pluginName: record.name,
				provider,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.migrationProviders.push(...captured.migrationProviders.map((provider) => ({
				pluginId: record.id,
				pluginName: record.name,
				provider,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.memoryEmbeddingProviders.push(...captured.memoryEmbeddingProviders.map((provider) => ({
				pluginId: record.id,
				pluginName: record.name,
				provider,
				source: record.source,
				rootDir: record.rootDir
			})));
			registry.agentHarnesses.push(...captured.agentHarnesses.map((harness) => ({
				pluginId: record.id,
				pluginName: record.name,
				harness,
				source: record.source,
				rootDir: record.rootDir
			})));
			const declaredToolNames = normalizePluginToolContractNames(record.contracts);
			for (const tool of captured.tools) {
				const undeclared = findUndeclaredPluginToolNames({
					declaredNames: declaredToolNames,
					toolNames: [tool.name]
				});
				if (undeclared.length > 0) {
					registry.diagnostics.push({
						level: "error",
						pluginId: record.id,
						source: record.source,
						message: `plugin must declare contracts.tools for: ${undeclared.join(", ")}`
					});
					continue;
				}
				registry.tools.push({
					pluginId: record.id,
					pluginName: record.name,
					factory: () => tool,
					names: [tool.name],
					declaredNames: declaredToolNames,
					optional: false,
					source: record.source,
					rootDir: record.rootDir
				});
			}
			registry.plugins.push(record);
		} catch (error) {
			recordCapabilityLoadError(registry, record, String(error));
		}
	}
	return registry;
}
//#endregion
//#region src/plugins/capability-provider-runtime.ts
/** Resolves plugin capability providers through manifest contracts, bundled compat, and runtime registries. */
const capabilityProviderSnapshotCache = /* @__PURE__ */ new WeakMap();
const CAPABILITY_CONTRACT_KEY = {
	embeddingProviders: "embeddingProviders",
	memoryEmbeddingProviders: "memoryEmbeddingProviders",
	speechProviders: "speechProviders",
	realtimeTranscriptionProviders: "realtimeTranscriptionProviders",
	realtimeVoiceProviders: "realtimeVoiceProviders",
	mediaUnderstandingProviders: "mediaUnderstandingProviders",
	transcriptSourceProviders: "transcriptSourceProviders",
	imageGenerationProviders: "imageGenerationProviders",
	videoGenerationProviders: "videoGenerationProviders",
	musicGenerationProviders: "musicGenerationProviders"
};
function shouldResolveWhenPluginsAreGloballyDisabled(key) {
	return key === "speechProviders";
}
function shouldMergeManifestProvidersWhenActive(key) {
	return key === "imageGenerationProviders" || key === "videoGenerationProviders" || key === "musicGenerationProviders";
}
function shouldSkipCapabilityResolution(params) {
	return params.cfg?.plugins?.enabled === false && !shouldResolveWhenPluginsAreGloballyDisabled(params.key);
}
/** Loads the manifest snapshot used to resolve capability-provider ownership. */
function loadCapabilityManifestSnapshot(params) {
	return loadManifestContractSnapshot({
		config: params.cfg,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
}
function resolveCapabilityPluginIds(params) {
	const contractKey = CAPABILITY_CONTRACT_KEY[params.key];
	const snapshot = loadCapabilityManifestSnapshot(params);
	const contractPlugins = snapshot.plugins.filter((plugin) => hasManifestContractValue({
		plugin,
		contract: contractKey,
		value: params.providerId
	}));
	return {
		runtimePluginIds: sortUniqueStrings(contractPlugins.filter((plugin) => isManifestPluginAvailableForControlPlane({
			snapshot,
			plugin,
			config: params.cfg
		})).map((plugin) => plugin.id)),
		bundledCompatPluginIds: sortUniqueStrings(contractPlugins.filter((plugin) => plugin.origin === "bundled").map((plugin) => plugin.id))
	};
}
function resolveBundledCapabilityCompatPluginIds(params) {
	return resolveCapabilityPluginIds(params).bundledCompatPluginIds;
}
function resolveCapabilityProviderConfig(params) {
	const pluginIds = params.pluginIds ?? resolveBundledCapabilityCompatPluginIds(params);
	return withBundledPluginVitestCompat({
		config: withBundledPluginEnablementCompat({
			config: params.cfg,
			pluginIds
		}),
		pluginIds,
		env: process.env
	});
}
function createCapabilityProviderFallbackLoadOptions(params) {
	return {
		...params.compatConfig === void 0 ? {} : { config: params.compatConfig },
		onlyPluginIds: params.pluginIds,
		activate: false
	};
}
function resolveCapabilityProviderSnapshotCacheKey(params) {
	return JSON.stringify({
		key: params.key,
		load: resolvePluginRegistryLoadCacheKey(params.loadOptions)
	});
}
function findProviderById(entries, providerId) {
	const normalizedProviderId = normalizeCapabilityProviderId(providerId);
	if (!normalizedProviderId) return;
	const providerEntries = entries;
	for (const entry of providerEntries) if (typeof entry.provider.id === "string" && normalizeCapabilityProviderId(entry.provider.id) === normalizedProviderId) return entry.provider;
	for (const entry of providerEntries) if ((Array.isArray(entry.provider.aliases) ? entry.provider.aliases : []).some((alias) => typeof alias === "string" && normalizeCapabilityProviderId(alias) === normalizedProviderId)) return entry.provider;
}
function mergeCapabilityProviders(left, right) {
	const merged = /* @__PURE__ */ new Map();
	const unnamed = [];
	const addEntries = (entries) => {
		for (const entry of entries) {
			const provider = entry.provider;
			if (!provider.id) {
				unnamed.push(provider);
				continue;
			}
			if (!merged.has(provider.id)) merged.set(provider.id, provider);
		}
	};
	addEntries(left);
	addEntries(right);
	return [...merged.values(), ...unnamed];
}
function mergeCapabilityProviderEntries(left, right) {
	const merged = /* @__PURE__ */ new Map();
	const unnamed = [];
	const addEntries = (entries) => {
		for (const entry of entries) {
			const provider = entry.provider;
			if (!provider.id) {
				unnamed.push(entry);
				continue;
			}
			if (!merged.has(provider.id)) merged.set(provider.id, entry);
		}
	};
	addEntries(left);
	addEntries(right);
	return [...merged.values(), ...unnamed];
}
function addObjectKeys(target, value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return;
	for (const key of Object.keys(value)) {
		const normalized = key.trim().toLowerCase();
		if (normalized) target.add(normalized);
	}
}
function addStringValue(target, value) {
	if (typeof value !== "string") return;
	const normalized = value.trim().toLowerCase();
	if (normalized) target.add(normalized);
}
function addModelConfigProviderIds(target, value) {
	for (const ref of resolveVoiceModelRefs(value)) addStringValue(target, ref.provider);
}
function collectRequestedSpeechProviderIds(cfg, options) {
	const requested = /* @__PURE__ */ new Set();
	const tts = typeof cfg?.messages?.tts === "object" && cfg.messages.tts !== null ? cfg.messages.tts : void 0;
	addStringValue(requested, tts?.provider);
	addObjectKeys(requested, tts?.providers);
	if (options.includeVoiceModel) addModelConfigProviderIds(requested, cfg?.agents?.defaults?.voiceModel);
	addObjectKeys(requested, cfg?.models?.providers);
	return requested;
}
function collectRequestedVoiceModelProviderIds(cfg) {
	const requested = /* @__PURE__ */ new Set();
	addModelConfigProviderIds(requested, cfg?.agents?.defaults?.voiceModel);
	return requested;
}
function addMediaModelProviders(target, value) {
	if (!Array.isArray(value)) return;
	for (const entry of value) if (typeof entry === "object" && entry !== null) addStringValue(target, entry.provider);
}
function collectRequestedMediaUnderstandingProviderIds(cfg) {
	const requested = /* @__PURE__ */ new Set();
	const media = cfg?.tools?.media;
	addMediaModelProviders(requested, media?.models);
	addMediaModelProviders(requested, media?.image?.models);
	addMediaModelProviders(requested, media?.audio?.models);
	addMediaModelProviders(requested, media?.video?.models);
	return requested;
}
function collectRequestedCapabilityProviderIds(params) {
	switch (params.key) {
		case "speechProviders": return collectRequestedSpeechProviderIds(params.cfg, { includeVoiceModel: params.includeVoiceModel ?? false });
		case "realtimeTranscriptionProviders":
		case "realtimeVoiceProviders": return params.includeVoiceModel ? collectRequestedVoiceModelProviderIds(params.cfg) : void 0;
		case "mediaUnderstandingProviders": return collectRequestedMediaUnderstandingProviderIds(params.cfg);
		default: return;
	}
}
function nonEmptyRequestedProviders(requested) {
	return requested && requested.size > 0 ? requested : void 0;
}
function shouldScopeCapabilityLoadToRequestedProviders(key) {
	return key === "speechProviders" || key === "realtimeTranscriptionProviders" || key === "realtimeVoiceProviders";
}
function removeActiveProviderIds(requested, entries) {
	for (const entry of entries) {
		const provider = entry.provider;
		if (typeof provider.id === "string") requested.delete(provider.id.toLowerCase());
		if (Array.isArray(provider.aliases)) {
			for (const alias of provider.aliases) if (typeof alias === "string") requested.delete(alias.toLowerCase());
		}
	}
}
function filterLoadedProvidersForRequestedConfig(params) {
	if (params.key !== "speechProviders" && params.key !== "realtimeTranscriptionProviders" && params.key !== "realtimeVoiceProviders" && params.key !== "mediaUnderstandingProviders") return [];
	if (params.requested.size === 0) return [];
	return params.entries.filter((entry) => {
		const provider = entry.provider;
		if (typeof provider.id === "string" && params.requested.has(provider.id.toLowerCase())) return true;
		if (Array.isArray(provider.aliases)) return provider.aliases.some((alias) => typeof alias === "string" && params.requested.has(alias.toLowerCase()));
		return false;
	});
}
function resolveRequestedCapabilityPluginIds(params) {
	if (!params.requested || params.requested.size === 0) return;
	const runtimePluginIds = /* @__PURE__ */ new Set();
	const bundledCompatPluginIds = /* @__PURE__ */ new Set();
	for (const providerId of params.requested) {
		const resolution = resolveCapabilityPluginIds({
			key: params.key,
			cfg: params.cfg,
			providerId
		});
		for (const pluginId of resolution.runtimePluginIds) runtimePluginIds.add(pluginId);
		for (const pluginId of resolution.bundledCompatPluginIds) bundledCompatPluginIds.add(pluginId);
	}
	return runtimePluginIds.size > 0 ? {
		runtimePluginIds: sortUniqueStrings(runtimePluginIds),
		bundledCompatPluginIds: sortUniqueStrings(bundledCompatPluginIds)
	} : void 0;
}
function loadCapabilityProviderEntries(params) {
	const loadedRegistry = getLoadedRuntimePluginRegistry({
		env: params.loadOptions.env,
		loadOptions: params.loadOptions,
		workspaceDir: params.loadOptions.workspaceDir,
		requiredPluginIds: params.loadOptions.onlyPluginIds
	});
	const loadedEntries = loadedRegistry?.[params.key] ?? [];
	const coldEntries = (loadedRegistry ? void 0 : resolveRuntimePluginRegistry(params.loadOptions))?.[params.key] ?? [];
	const entries = loadedEntries.length > 0 && coldEntries.length > 0 ? mergeCapabilityProviderEntries(loadedEntries, coldEntries) : loadedEntries.length > 0 ? loadedEntries : coldEntries;
	const missingRequested = params.requested && params.requested.size > 0 ? new Set(params.requested) : void 0;
	if (missingRequested) removeActiveProviderIds(missingRequested, entries);
	if (entries.length > 0 && (!missingRequested || missingRequested.size === 0)) return entries;
	if (params.bundledCompatPluginIds.length === 0) return entries;
	const captured = loadBundledCapabilityRuntimeRegistry({
		pluginIds: params.bundledCompatPluginIds,
		env: process.env,
		pluginSdkResolution: params.loadOptions.pluginSdkResolution
	})[params.key];
	return entries.length > 0 ? mergeCapabilityProviderEntries(entries, captured) : captured;
}
function resolvePluginCapabilityProvider(params) {
	if (shouldSkipCapabilityResolution(params)) return;
	const activeProvider = findProviderById(getLoadedRuntimePluginRegistry()?.[params.key] ?? [], params.providerId);
	if (activeProvider) return activeProvider;
	let pluginIds = resolveCapabilityPluginIds({
		key: params.key,
		cfg: params.cfg,
		providerId: params.providerId
	});
	if (pluginIds.runtimePluginIds.length === 0) {
		pluginIds = resolveCapabilityPluginIds({
			key: params.key,
			cfg: params.cfg
		});
		if (pluginIds.runtimePluginIds.length === 0) return;
	}
	const loadOptions = createCapabilityProviderFallbackLoadOptions({
		compatConfig: resolveCapabilityProviderConfig({
			key: params.key,
			cfg: params.cfg,
			pluginIds: pluginIds.bundledCompatPluginIds
		}),
		pluginIds: pluginIds.runtimePluginIds
	});
	return findProviderById(resolveConfigScopedRuntimeCacheValue({
		cache: capabilityProviderSnapshotCache,
		config: params.cfg,
		key: resolveCapabilityProviderSnapshotCacheKey({
			key: params.key,
			loadOptions
		}),
		load: () => loadCapabilityProviderEntries({
			key: params.key,
			bundledCompatPluginIds: pluginIds.bundledCompatPluginIds,
			loadOptions,
			requested: /* @__PURE__ */ new Set([params.providerId.toLowerCase()])
		})
	}), params.providerId);
}
function resolveCachedCapabilityProviderEntries(params) {
	return resolveConfigScopedRuntimeCacheValue({
		cache: capabilityProviderSnapshotCache,
		config: params.cfg,
		key: resolveCapabilityProviderSnapshotCacheKey({
			key: params.key,
			loadOptions: params.loadOptions
		}),
		load: () => loadCapabilityProviderEntries({
			key: params.key,
			bundledCompatPluginIds: params.bundledCompatPluginIds,
			loadOptions: params.loadOptions,
			requested: params.requested
		})
	});
}
function resolvePluginCapabilityProviders(params) {
	if (shouldSkipCapabilityResolution(params)) return [];
	const activeProviders = getLoadedRuntimePluginRegistry()?.[params.key] ?? [];
	const missingRequestedProviders = activeProviders.length > 0 ? nonEmptyRequestedProviders(collectRequestedCapabilityProviderIds({
		key: params.key,
		cfg: params.cfg,
		includeVoiceModel: true
	})) : void 0;
	if (activeProviders.length > 0 && params.key !== "memoryEmbeddingProviders") {
		if (!missingRequestedProviders && !shouldMergeManifestProvidersWhenActive(params.key)) return activeProviders.map((entry) => entry.provider);
		if (missingRequestedProviders) {
			removeActiveProviderIds(missingRequestedProviders, activeProviders);
			if (missingRequestedProviders.size === 0) return activeProviders.map((entry) => entry.provider);
		}
	}
	const requestedProviders = missingRequestedProviders ?? (activeProviders.length === 0 ? nonEmptyRequestedProviders(collectRequestedCapabilityProviderIds({
		key: params.key,
		cfg: params.cfg
	})) : void 0);
	const requestedProviderLoadScope = requestedProviders && shouldScopeCapabilityLoadToRequestedProviders(params.key) ? requestedProviders : void 0;
	const requestedPluginIds = resolveRequestedCapabilityPluginIds({
		key: params.key,
		cfg: params.cfg,
		requested: requestedProviderLoadScope
	});
	const requestedProviderFilter = requestedProviders && (!shouldScopeCapabilityLoadToRequestedProviders(params.key) || requestedPluginIds) ? requestedProviders : void 0;
	const pluginIds = requestedPluginIds ?? resolveCapabilityPluginIds({
		key: params.key,
		cfg: params.cfg
	});
	const loadOptions = createCapabilityProviderFallbackLoadOptions({
		compatConfig: resolveCapabilityProviderConfig({
			key: params.key,
			cfg: params.cfg,
			pluginIds: pluginIds.bundledCompatPluginIds
		}),
		pluginIds: pluginIds.runtimePluginIds
	});
	const loadedProviders = resolveCachedCapabilityProviderEntries({
		key: params.key,
		cfg: params.cfg,
		bundledCompatPluginIds: pluginIds.bundledCompatPluginIds,
		loadOptions,
		requested: requestedProviderFilter
	});
	if (params.key !== "memoryEmbeddingProviders") {
		const requestedLoadedProviders = requestedProviderFilter ? filterLoadedProvidersForRequestedConfig({
			key: params.key,
			requested: requestedProviderFilter,
			entries: loadedProviders
		}) : loadedProviders;
		return mergeCapabilityProviders(activeProviders, activeProviders.length > 0 && missingRequestedProviders ? filterLoadedProvidersForRequestedConfig({
			key: params.key,
			requested: missingRequestedProviders,
			entries: requestedLoadedProviders
		}) : requestedLoadedProviders);
	}
	return mergeCapabilityProviders(activeProviders, loadedProviders);
}
//#endregion
export { resolvePluginCapabilityProvider as n, resolvePluginCapabilityProviders as r, loadCapabilityManifestSnapshot as t };
