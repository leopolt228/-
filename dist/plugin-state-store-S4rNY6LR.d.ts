import { i as PluginStateSyncKeyedStore, t as OpenKeyedStoreOptions } from "./plugin-state-store.types-DX2gE09P.js";

//#region src/plugin-state/plugin-state-store.d.ts
/** Opens a sync plugin-state namespace for a non-core plugin id. */
declare function createPluginStateSyncKeyedStore<T>(pluginId: string, options: OpenKeyedStoreOptions): PluginStateSyncKeyedStore<T>;
//#endregion
export { createPluginStateSyncKeyedStore as t };