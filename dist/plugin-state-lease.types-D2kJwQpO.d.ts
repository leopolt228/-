//#region src/plugin-state/plugin-blob-store.types.d.ts
type PluginBlobEntryInfo<TMetadata> = {
  key: string;
  metadata: TMetadata;
  sizeBytes: number;
  createdAt: number;
  expiresAt?: number;
};
type PluginBlobEntry<TMetadata> = PluginBlobEntryInfo<TMetadata> & {
  bytes: Uint8Array;
};
type PluginBlobStore<TMetadata> = {
  register(key: string, bytes: Uint8Array, metadata: TMetadata, opts?: {
    ttlMs?: number;
  }): Promise<void>;
  registerIfAbsent(key: string, bytes: Uint8Array, metadata: TMetadata, opts?: {
    ttlMs?: number;
  }): Promise<boolean>;
  lookup(key: string): Promise<PluginBlobEntry<TMetadata> | undefined>;
  entries(): Promise<PluginBlobEntryInfo<TMetadata>[]>;
  delete(key: string): Promise<boolean>;
  deleteExpiredKey(key: string): Promise<PluginBlobEntryInfo<TMetadata> | undefined>;
  deleteExpired(): Promise<PluginBlobEntryInfo<TMetadata>[]>;
  clear(): Promise<void>;
};
type PluginBlobOverflowPolicy = "evict-oldest" | "reject-new";
type OpenBlobStoreOptions = {
  namespace: string;
  maxEntries: number;
  maxBytesPerEntry: number;
  maxBytesPerNamespace: number;
  overflowPolicy?: PluginBlobOverflowPolicy;
  defaultTtlMs?: number;
};
//#endregion
//#region src/plugin-state/plugin-state-lease.types.d.ts
type PluginStateLeaseDatabase = {
  scope: "shared";
} | {
  scope: "agent";
  agentId: string;
};
type PluginStateLeaseOptions = {
  namespace: string;
  key: string;
  database: PluginStateLeaseDatabase;
  leaseMs: number;
  waitMs: number;
  signal?: AbortSignal;
};
type PluginStateLeaseContext = {
  signal: AbortSignal; /** Verify that this exact owner holds a non-expired lease at this instant. */
  assertOwned(): void;
};
type PluginStateLeaseRunner = <T>(options: PluginStateLeaseOptions, run: (lease: PluginStateLeaseContext) => Promise<T>) => Promise<T>;
type PluginStateLeaseErrorCode = "PLUGIN_STATE_LEASE_INVALID_INPUT" | "PLUGIN_STATE_LEASE_TIMEOUT" | "PLUGIN_STATE_LEASE_ABORTED" | "PLUGIN_STATE_LEASE_LOST" | "PLUGIN_STATE_LEASE_STORAGE_FAILED";
declare class PluginStateLeaseError extends Error {
  readonly code: PluginStateLeaseErrorCode;
  constructor(message: string, options: {
    code: PluginStateLeaseErrorCode;
    cause?: unknown;
  });
}
//#endregion
export { PluginStateLeaseOptions as a, PluginBlobEntry as c, PluginStateLeaseErrorCode as i, PluginBlobEntryInfo as l, PluginStateLeaseDatabase as n, PluginStateLeaseRunner as o, PluginStateLeaseError as r, OpenBlobStoreOptions as s, PluginStateLeaseContext as t, PluginBlobStore as u };