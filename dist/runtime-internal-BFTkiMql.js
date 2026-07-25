import { T as reloadTaskRegistryFromStore, V as ensureTaskFlowRegistryReady, Y as reloadTaskFlowRegistryFromStore, a as ensureTaskRegistryReady } from "./task-registry-BkemWOKR.js";
//#region src/tasks/runtime-internal.ts
function ensureTaskRuntimeStateReady() {
	ensureTaskFlowRegistryReady();
	ensureTaskRegistryReady();
}
function reloadTaskRuntimeStateFromStore() {
	reloadTaskFlowRegistryFromStore();
	reloadTaskRegistryFromStore();
}
//#endregion
export { reloadTaskRuntimeStateFromStore as n, ensureTaskRuntimeStateReady as t };
