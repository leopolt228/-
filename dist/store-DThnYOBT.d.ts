import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { a as AuthProfileStore } from "./types-BYLj8dvi.js";
import { i as OpenClawAgentDatabase } from "./openclaw-agent-db-DHviaU-j.js";

//#region src/agents/auth-profiles/external-cli-discovery.d.ts
/** External CLI auth discovery mode used while loading auth profile stores. */
type ExternalCliAuthDiscovery = {
  mode: "none";
  allowKeychainPrompt?: false;
  config?: OpenClawConfig;
} | {
  mode: "existing";
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
} | {
  mode: "scoped";
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
  providerIds?: Iterable<string>;
  profileIds?: Iterable<string>;
};
//#endregion
//#region src/agents/auth-profiles/store.d.ts
type LoadAuthProfileStoreOptions = {
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
  database?: OpenClawAgentDatabase;
  externalCli?: ExternalCliAuthDiscovery;
  inheritedAuthDir?: string;
  readOnly?: boolean;
  syncExternalCli?: boolean;
  externalCliProviderIds?: Iterable<string>;
  externalCliProfileIds?: Iterable<string>;
};
type SaveAuthProfileStoreOptions = {
  filterExternalAuthProfiles?: boolean;
  preserveOrderProfileIds?: Iterable<string>;
  preserveStateProfileIds?: Iterable<string>;
  pruneOrderProfileIds?: Iterable<string>;
  syncExternalCli?: boolean;
};
/** Apply an auth store update inside the SQLite write lock. */
declare function updateAuthProfileStoreWithLock(params: {
  agentDir?: string;
  saveOptions?: SaveAuthProfileStoreOptions;
  updater: (store: AuthProfileStore) => boolean;
}): Promise<AuthProfileStore | null>;
/** Loads the effective runtime store for an agent, including inherited main profiles. */
declare function loadAuthProfileStoreForRuntime(agentDir?: string, options?: LoadAuthProfileStoreOptions): AuthProfileStore;
/** Load auth profiles for secret resolution without keychain prompts or writes. */
declare function loadAuthProfileStoreForSecretsRuntime(agentDir?: string, options?: Pick<LoadAuthProfileStoreOptions, "config" | "externalCli" | "externalCliProviderIds" | "externalCliProfileIds" | "inheritedAuthDir">): AuthProfileStore;
/** Load auth profiles with runtime external profiles removed from the result. */
declare function loadAuthProfileStoreWithoutExternalProfiles(agentDir?: string, loadOptions?: Pick<LoadAuthProfileStoreOptions, "allowKeychainPrompt" | "inheritedAuthDir">): AuthProfileStore;
/** Ensure an auth store is available, including runtime/external profile overlays. */
declare function ensureAuthProfileStore(agentDir?: string, options?: {
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
  externalCli?: ExternalCliAuthDiscovery;
  externalCliProviderIds?: Iterable<string>;
  externalCliProfileIds?: Iterable<string>;
  inheritedAuthDir?: string;
  readOnly?: boolean;
  syncExternalCli?: boolean;
}): AuthProfileStore;
/** Find a persisted credential in the scoped store, falling back to the main store. */
declare function findPersistedAuthProfileCredential(params: {
  agentDir?: string;
  profileId: string;
}): AuthProfileStore["profiles"][string] | undefined;
/** Resolve which agent dir owns a persisted profile, accounting for inherited OAuth. */
declare function resolvePersistedAuthProfileOwnerAgentDir(params: {
  agentDir?: string;
  profileId: string;
}): string | undefined;
/** Load the store shape used when applying local-only auth updates. */
declare function ensureAuthProfileStoreForLocalUpdate(agentDir?: string): AuthProfileStore;
/** Replace runtime auth-profile snapshots, used by tests and prepared runtimes. */
declare function replaceRuntimeAuthProfileStoreSnapshots(entries: Array<{
  agentDir?: string;
  store: AuthProfileStore;
}>): void;
/** Clear all runtime auth-profile snapshots. */
declare function clearRuntimeAuthProfileStoreSnapshots(): void;
/** Save the auth profile store plus sidecar state, preserving runtime overlay metadata. */
declare function saveAuthProfileStore(store: AuthProfileStore, agentDir?: string, options?: SaveAuthProfileStoreOptions, database?: OpenClawAgentDatabase): void;
//#endregion
export { loadAuthProfileStoreForRuntime as a, replaceRuntimeAuthProfileStoreSnapshots as c, updateAuthProfileStoreWithLock as d, findPersistedAuthProfileCredential as i, resolvePersistedAuthProfileOwnerAgentDir as l, ensureAuthProfileStore as n, loadAuthProfileStoreForSecretsRuntime as o, ensureAuthProfileStoreForLocalUpdate as r, loadAuthProfileStoreWithoutExternalProfiles as s, clearRuntimeAuthProfileStoreSnapshots as t, saveAuthProfileStore as u };