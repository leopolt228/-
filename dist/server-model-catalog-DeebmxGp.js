import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
//#region src/gateway/server-model-catalog.ts
async function resolveLoader(params) {
	if (params?.loadPreparedModelCatalogSnapshot) return params.loadPreparedModelCatalogSnapshot;
	const { loadPreparedModelCatalogSnapshot } = await import("./prepared-model-catalog-C7ceMjSu.js");
	return loadPreparedModelCatalogSnapshot;
}
async function resetPreparedModelCatalogForTest() {
	const [{ resetPreparedModelRuntimeSnapshotsForTest }, { resetModelCatalogBuilderCacheForTest }] = await Promise.all([import("./prepared-model-runtime.test-support-BYyBntIt.js"), import("./model-catalog-7OlepBlY.js")]);
	resetPreparedModelRuntimeSnapshotsForTest();
	resetModelCatalogBuilderCacheForTest();
}
async function loadGatewayModelCatalogSnapshot(params) {
	const config = (params?.getConfig ?? getRuntimeConfig)();
	return await (await resolveLoader(params))({
		...params?.agentId ? { agentId: params.agentId } : {},
		...params?.agentDir ? { agentDir: params.agentDir } : {},
		config,
		readOnly: params?.readOnly !== false,
		...params?.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
}
async function loadGatewayModelCatalog(params) {
	return (await loadGatewayModelCatalogSnapshot(params)).entries;
}
//#endregion
export { loadGatewayModelCatalogSnapshot as n, resetPreparedModelCatalogForTest as r, loadGatewayModelCatalog as t };
