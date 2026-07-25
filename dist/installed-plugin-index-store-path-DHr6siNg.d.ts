//#region src/plugins/installed-plugin-index-store-path.d.ts
/** Options for resolving installed plugin index storage paths. */
type InstalledPluginIndexStoreOptions = {
  env?: NodeJS.ProcessEnv;
  stateDir?: string;
  filePath?: string;
};
//#endregion
export { InstalledPluginIndexStoreOptions as t };