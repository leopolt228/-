import { t as resolveMemoryBackendConfig } from "./backend-config-Bzby-qx1.js";
import "./memory-core-host-runtime-files-Cwu2LRmo.js";
import { n as closeMemorySearchManager, r as getMemorySearchManager, t as closeAllMemorySearchManagers } from "./memory-D8aUiFpz.js";
//#region extensions/memory-core/src/runtime-provider.ts
function createMemoryRuntime(host = {}) {
	return {
		async getMemorySearchManager(params) {
			const { manager, debug, error } = await getMemorySearchManager({
				...params,
				...host.acquireLocalService ? { acquireLocalService: host.acquireLocalService } : {},
				...host.withLease ? { withLease: host.withLease } : {}
			});
			return {
				manager,
				debug,
				error
			};
		},
		resolveMemoryBackendConfig(params) {
			return resolveMemoryBackendConfig(params);
		},
		async closeAllMemorySearchManagers() {
			await closeAllMemorySearchManagers();
		},
		async closeMemorySearchManager(params) {
			await closeMemorySearchManager(params);
		}
	};
}
const memoryRuntime = createMemoryRuntime();
//#endregion
export { memoryRuntime as n, createMemoryRuntime as t };
