import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import "./config-BOMcY2yX.js";
import { a as getActiveSecretsRuntimeEnv, i as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-DTHJs1uZ.js";
//#region src/gateway/server-worker-environment-startup.ts
const loadWorkerEnvironmentRuntimeModule = createLazyRuntimeModule(() => import("./gateway/worker-environments/runtime.js"));
const loadWorkerInferenceRuntimeModule = createLazyRuntimeModule(() => import("./inference-runtime-CiHNwbMO.js"));
async function loadGatewayWorkerEnvironmentStartupState() {
	const [{ createWorkerEnvironmentStore }, { createWorkerSessionPlacementStore }] = await Promise.all([import("./store-DAg65mGs.js"), import("./placement-store-DO0FsquY.js")]);
	const store = createWorkerEnvironmentStore();
	const placementStore = createWorkerSessionPlacementStore();
	const records = store.list();
	const durableProviderIds = uniqueStrings(records.flatMap((record) => record.state === "destroyed" || record.state === "failed" || record.state === "orphaned" ? [] : [record.providerId]));
	const listDurableProviderIds = () => uniqueStrings(store.listForReconcile().map((record) => record.providerId));
	return {
		durableProviderIds,
		listDurableProviderIds,
		records,
		store,
		placementStore,
		hasNonlocalPlacementRecords: placementStore.listForReconcile().length > 0
	};
}
async function createGatewayWorkerEnvironmentRuntime(params) {
	const [{ createWorkerEnvironmentService }, { createWorkerLiveEventReceiver }, { createWorkerSessionPlacementGate }, { createWorkerTranscriptCommitter }, { createWorkerTunnelManager }, { resolveWorkerProvider }] = await Promise.all([
		import("./service-UN-G2D3E.js"),
		import("./live-events-CD0ZlHBa.js"),
		import("./placement-worker-gate-CGYIVPSv.js"),
		import("./transcript-commit-BLK7VCJm.js"),
		import("./tunnel-BVgEdjUL.js"),
		import("./worker-provider-registry-BxB_sOQh.js")
	]);
	params.startup.placementStore.clearLocalTurnClaimsAfterRestart();
	const placementGate = createWorkerSessionPlacementGate(params.startup.placementStore);
	let workerBundleProducer;
	let workerNpmArtifact;
	const prepareInstallation = async (install) => {
		const [workerRuntime, { WORKER_PROTOCOL_FEATURES }] = await Promise.all([loadWorkerEnvironmentRuntimeModule(), import("./worker-admission-BUgct5s1.js")]);
		workerBundleProducer ??= workerRuntime.createWorkerBundleProducer({ protocolFeatures: WORKER_PROTOCOL_FEATURES });
		const bundle = await workerBundleProducer.prepare();
		if (install === "bundle") return bundle;
		workerNpmArtifact ??= workerRuntime.resolveWorkerNpmInstallationArtifact({ bundle }).catch((error) => {
			workerNpmArtifact = void 0;
			throw error;
		});
		return await workerNpmArtifact;
	};
	const startupBindings = params.startup.records.flatMap((record) => record.state === "attached" && record.attachedSessionIds.length === 1 ? [{
		environmentId: record.environmentId,
		runEpoch: record.ownerEpoch,
		sessionId: record.attachedSessionIds[0]
	}] : []);
	const workerLiveEvents = createWorkerLiveEventReceiver({
		getConfig: getRuntimeConfig,
		startupBindings,
		startupOwners: new Map(startupBindings.map((binding) => [binding.environmentId, binding.runEpoch]))
	});
	return {
		workerEnvironmentService: createWorkerEnvironmentService({
			store: params.startup.store,
			getConfig: getRuntimeConfig,
			resolveProvider: (providerId) => resolveWorkerProvider(params.getPluginRegistry(), providerId),
			prepareInstallation,
			tunnelManager: createWorkerTunnelManager(),
			resolveWorkerGateway: params.resolveWorkerGateway,
			applyTranscriptCommit: createWorkerTranscriptCommitter({ getConfig: getRuntimeConfig }).commit,
			executeInference: async (inferenceParams) => {
				return await (await loadWorkerInferenceRuntimeModule()).executeWorkerInference(inferenceParams);
			},
			placementStore: placementGate,
			liveEvents: workerLiveEvents,
			resolveSshIdentity: async ({ provider, leaseId, profile, keyRef }) => {
				const workerRuntime = await loadWorkerEnvironmentRuntimeModule();
				return await workerRuntime.resolveWorkerSshIdentity({
					provider,
					leaseId,
					profile,
					keyRef,
					resolveGeneric: async (genericKeyRef) => ({
						kind: "material",
						contents: await workerRuntime.resolveSecretRefString(genericKeyRef, {
							config: getActiveSecretsRuntimeConfigSnapshot()?.sourceConfig ?? getRuntimeConfig(),
							env: getActiveSecretsRuntimeEnv()
						})
					})
				});
			},
			bootstrapWorker: async ({ sshEndpoint, installation, resolveIdentity, signal }) => {
				return await (await loadWorkerEnvironmentRuntimeModule()).bootstrapWorker({
					ssh: sshEndpoint,
					artifact: installation,
					pinnedHostKey: sshEndpoint.hostKey
				}, {
					signal,
					resolveIdentity
				});
			},
			logger: params.log.child("worker-environments")
		}),
		workerLiveEvents
	};
}
//#endregion
export { createGatewayWorkerEnvironmentRuntime, loadGatewayWorkerEnvironmentStartupState };
