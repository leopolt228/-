import { i as OpenClawConfig, t as ConfigFileSnapshot } from "./types.openclaw-DAPZkTyD.js";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-Dw9i7sK6.js";
import fs from "node:fs";
import JSON5 from "json5";

//#region src/config/config-env-vars.d.ts
/** Config-owned runtime env staged for one acceptance transaction. */
type ConfigRuntimeEnvPublication = (() => void) & {
  commit: () => void;
};
type PreparedConfigRuntimeEnv = {
  env: NodeJS.ProcessEnv;
  publish: () => ConfigRuntimeEnvPublication;
};
//#endregion
//#region src/config/runtime-snapshot.d.ts
type RuntimeConfigSnapshotRefreshOptions = {
  includeAuthStoreRefs?: boolean;
};
type RuntimeConfigSnapshotRefreshParams = RuntimeConfigSnapshotRefreshOptions & {
  sourceConfig: OpenClawConfig;
  preflightResult?: unknown;
};
type MaybePromise<T> = T | Promise<T>;
type ConfigWriteAfterWrite = {
  mode: "auto";
} | {
  mode: "restart";
  reason: string;
} | {
  mode: "none";
  reason: string;
};
type ConfigWriteFollowUp = {
  mode: "auto";
  requiresRestart: false;
} | {
  mode: "none";
  reason: string;
  requiresRestart: false;
} | {
  mode: "restart";
  reason: string;
  requiresRestart: true;
};
declare function resolveConfigWriteAfterWrite(afterWrite?: ConfigWriteAfterWrite): ConfigWriteAfterWrite;
declare function resolveConfigWriteFollowUp(afterWrite?: ConfigWriteAfterWrite): ConfigWriteFollowUp;
type RuntimeConfigSnapshotRefreshHandler = {
  preflight?: (params: RuntimeConfigSnapshotRefreshParams) => MaybePromise<unknown>;
  refresh: (params: RuntimeConfigSnapshotRefreshParams) => boolean | Promise<boolean>;
  clearOnRefreshFailure?: () => void;
};
type RuntimeConfigWriteNotification = {
  configPath: string;
  sourceConfig: OpenClawConfig;
  runtimeConfig: OpenClawConfig;
  persistedHash: string;
  revision: number;
  fingerprint: string;
  sourceFingerprint: string | null;
  writtenAtMs: number;
  afterWrite?: ConfigWriteAfterWrite;
  runtimeRefresh?: RuntimeConfigSnapshotRefreshOptions;
  preparedCandidate?: RuntimeConfigWritePreparedCandidate;
  preparedCandidatesByOwner?: ReadonlyMap<symbol, RuntimeConfigWritePreparedCandidate>;
};
type RuntimeConfigWritePreparedCandidate = {
  runtimeConfig: OpenClawConfig;
  compareConfig: OpenClawConfig;
  runtimeEnv?: PreparedConfigRuntimeEnv;
  reapplyRuntimeOverlays?: (config: OpenClawConfig) => OpenClawConfig;
  reapplyCompareOverlays?: (config: OpenClawConfig) => OpenClawConfig;
};
type RuntimeConfigSnapshotMetadata = {
  revision: number;
  fingerprint: string;
  sourceFingerprint: string | null;
  updatedAtMs: number;
};
declare function hashRuntimeConfigValue(value: OpenClawConfig): string;
declare function setRuntimeConfigSnapshot(config: OpenClawConfig, sourceConfig?: OpenClawConfig): void;
declare function setAppliedRuntimeConfigSnapshot(config: OpenClawConfig, sourceConfig: OpenClawConfig): void;
declare function resetConfigRuntimeState(): void;
declare function clearRuntimeConfigSnapshot(): void;
declare function getRuntimeConfigSnapshot(): OpenClawConfig | null;
declare function getRuntimeConfigSourceSnapshot(): OpenClawConfig | null;
declare function getRuntimeConfigSnapshotMetadata(): RuntimeConfigSnapshotMetadata | null;
/** Resolved source-config revision accepted by the active Gateway runtime. */
declare function getRuntimeConfigAppliedHash(): string | null;
declare function setRuntimeConfigAppliedHash(hash: string | null): void;
declare function resolveRuntimeConfigCacheKey(config: OpenClawConfig): string;
declare function selectApplicableRuntimeConfig(params: {
  inputConfig?: OpenClawConfig;
  runtimeConfig?: OpenClawConfig | null;
  runtimeSourceConfig?: OpenClawConfig | null;
}): OpenClawConfig | undefined;
declare function setRuntimeConfigSnapshotRefreshHandler(refreshHandler: RuntimeConfigSnapshotRefreshHandler | null): void;
//#endregion
//#region src/config/io.types.d.ts
type ParseConfigJson5Result = {
  ok: true;
  parsed: unknown;
} | {
  ok: false;
  error: string;
};
type ConfigWriteResult = {
  persistedHash: string;
  persistedConfig: OpenClawConfig;
};
declare const configWritePostCommitRollback: unique symbol;
type InternalConfigWriteResult = ConfigWriteResult & {
  [configWritePostCommitRollback]?: () => void;
};
type ConfigWriteAuditOrigin = "doctor" | "system-agent" | "config-rpc" | "plugin-install" | "cli";
type ConfigWriteOptions = {
  /** Semantic writer label recorded in the config audit journal. */auditOrigin?: ConfigWriteAuditOrigin; /** Read-time env snapshot used to validate `${VAR}` restoration decisions. */
  envSnapshotForRestore?: Record<string, string | undefined>; /** Only use envSnapshotForRestore for the config path that produced it. */
  expectedConfigPath?: string; /** Internal write destination captured by readConfigFileSnapshotForWrite(). */
  ownedConfigPathForWrite?: string; /** Rechecks that the config path captured at mutation start is still active. */
  assertConfigPathForWrite?: () => void; /** Paths that must be removed from the persisted payload. */
  unsetPaths?: string[][]; /** Caller-authored paths that stay persisted even when equal to defaults. */
  explicitSetPaths?: readonly (readonly string[])[]; /** Source-shaped values paired with explicitSetPaths. */
  explicitSetValueSource?: OpenClawConfig; /** Fresh snapshot fast path for an immediate write. */
  baseSnapshot?: ConfigFileSnapshot; /** Plugin metadata paired with baseSnapshot. */
  basePluginMetadataSnapshot?: PluginMetadataSnapshot; /** Skip the runtime refresh tail when no runtime snapshot is active. */
  skipRuntimeSnapshotRefresh?: boolean; /** Controls for the active runtime snapshot refresh. */
  runtimeRefresh?: RuntimeConfigSnapshotRefreshOptions; /** Allow intentionally destructive full-config writes. */
  allowDestructiveWrite?: boolean; /** Allow an intentional size drop while retaining other destructive guards. */
  allowConfigSizeDrop?: boolean; /** Suppress human-readable overwrite and anomaly logs. */
  skipOutputLogs?: boolean; /** Runtime reload intent for committed-write observers. */
  afterWrite?: ConfigWriteAfterWrite; /** Doctor-only legacy root keys retained on disk but excluded from validation. */
  preservedLegacyRootKeys?: readonly string[]; /** Skip plugin-aware validation for bounded repair migrations only. */
  skipPluginValidation?: boolean; /** Preserve an older writer version during update handoff writes. */
  lastTouchedVersionOverride?: string; /** Final async authority gate after runtime preflight and before commit. */
  preCommitRuntimePreflight?: (sourceConfig: OpenClawConfig) => Promise<unknown>; /** Snapshot-time hashes for include files that mutation writers may update. */
  includeFileHashesForWrite?: Record<string, string>; /** Snapshot-time canonical include targets that writers may update. */
  includeFileTargetsForWrite?: Record<string, string>;
};
type ReadConfigFileSnapshotForWriteResult = {
  snapshot: ConfigFileSnapshot;
  writeOptions: ConfigWriteOptions;
};
type ConfigWriteNotification = RuntimeConfigWriteNotification;
type ConfigSnapshotReadMeasure = <T>(name: string, run: () => T | Promise<T>) => Promise<T>;
declare class ConfigRuntimeRefreshError extends Error {
  constructor(message: string, options?: {
    cause?: unknown;
  });
}
type ConfigIoDeps = {
  fs?: typeof fs;
  json5?: typeof JSON5;
  env?: NodeJS.ProcessEnv;
  lowerPrecedenceEnv?: Readonly<Record<string, string>>;
  homedir?: () => string;
  configPath?: string;
  logger?: Pick<typeof console, "error" | "warn">;
  measure?: ConfigSnapshotReadMeasure;
  suppressFutureVersionWarning?: boolean;
  observe?: boolean;
};
type NormalizedConfigIoDeps = Required<ConfigIoDeps>;
type ConfigIoFactoryOptions = ConfigIoDeps & {
  pluginValidation?: "full" | "skip";
  preservedLegacyRootKeys?: readonly string[];
  shellEnvFallback?: "load" | "defer";
};
type ConfigSnapshotReadOptions = {
  measure?: ConfigSnapshotReadMeasure;
  observe?: boolean;
  isolateEnv?: boolean;
  lowerPrecedenceEnv?: Readonly<Record<string, string>>;
  recoverSuspicious?: boolean;
  allowSuspiciousRecovery?: (candidate: OpenClawConfig, current: OpenClawConfig) => boolean | Promise<boolean>;
  skipPluginValidation?: boolean;
  preservedLegacyRootKeys?: readonly string[];
  suppressFutureVersionWarning?: boolean;
};
type ReadConfigFileSnapshotInternalResult = {
  snapshot: ConfigFileSnapshot;
  envSnapshotForRestore?: Record<string, string | undefined>;
  includeFileHashesForWrite?: Record<string, string>;
  includeFileTargetsForWrite?: Record<string, string>;
  pluginMetadataSnapshot?: PluginMetadataSnapshot;
};
type ReadConfigFileSnapshotWithPluginMetadataResult = {
  snapshot: ConfigFileSnapshot;
  pluginMetadataSnapshot?: PluginMetadataSnapshot;
};
type BestEffortConfigSnapshot = {
  config: OpenClawConfig;
  sourceConfig: OpenClawConfig;
};
//#endregion
//#region src/config/io.context.d.ts
type ValidationPluginMetadataSnapshotLoader = {
  load: (config: OpenClawConfig) => PluginMetadataSnapshot;
  getSnapshot: () => PluginMetadataSnapshot | undefined;
};
type ConfigIoContext = {
  deps: NormalizedConfigIoDeps;
  configPath: string;
  options: ConfigIoFactoryOptions;
  observeLoadConfigSnapshot: (snapshot: ConfigFileSnapshot) => ConfigFileSnapshot;
  finalizeLoadedRuntimeConfig: (config: OpenClawConfig) => OpenClawConfig;
  createValidationPluginMetadataSnapshotLoader: (params: {
    effectiveConfigRaw: unknown;
    env: NodeJS.ProcessEnv;
  }) => ValidationPluginMetadataSnapshotLoader;
  resolveRuntimePreflightSourceConfig: (candidate: OpenClawConfig) => OpenClawConfig;
  resolveSuspiciousRecoveryBackupCandidate: (parsed: unknown) => OpenClawConfig | null;
};
//#endregion
//#region src/config/io.write.d.ts
declare function writeConfigFileFromContext(context: ConfigIoContext, cfg: OpenClawConfig, options: ConfigWriteOptions, readSnapshot: () => Promise<ReadConfigFileSnapshotInternalResult>): Promise<InternalConfigWriteResult>;
//#endregion
//#region src/config/io.factory.d.ts
declare function createConfigIO(options?: ConfigIoFactoryOptions): {
  configPath: string;
  env: NodeJS.ProcessEnv;
  loadConfig: (loadOptions?: {
    skipSuspiciousRecovery?: boolean;
  }) => OpenClawConfig;
  readBestEffortConfig: () => Promise<OpenClawConfig>;
  readBestEffortConfigSnapshot: () => Promise<BestEffortConfigSnapshot>;
  readSourceConfigBestEffort: () => Promise<OpenClawConfig>;
  readConfigFileSnapshot: (readOptions?: ConfigSnapshotReadOptions) => Promise<ConfigFileSnapshot>;
  readConfigFileSnapshotWithPluginMetadata: (readOptions?: ConfigSnapshotReadOptions) => Promise<ReadConfigFileSnapshotWithPluginMetadataResult>;
  readConfigFileSnapshotForWrite: () => Promise<ReadConfigFileSnapshotForWriteResult>;
  promoteConfigSnapshotToLastKnownGood: (snapshot: ConfigFileSnapshot) => Promise<boolean>;
  recoverConfigFromLastKnownGood: (params: {
    snapshot: ConfigFileSnapshot;
    reason: string;
  }) => Promise<boolean>;
  preserveConfigSnapshotAsClobbered: (snapshot: ConfigFileSnapshot) => Promise<string | null>;
  recoverConfigFromJsonRootSuffix: (snapshot: ConfigFileSnapshot) => Promise<boolean>;
  writeConfigFile: (config: Parameters<typeof writeConfigFileFromContext>[1], writeOptions?: Parameters<typeof writeConfigFileFromContext>[2]) => Promise<InternalConfigWriteResult>;
};
//#endregion
//#region src/config/io.read-helpers.d.ts
declare function resolveConfigSnapshotHash(snapshot: {
  hash?: string;
  raw?: string | null;
}): string | null;
declare function parseConfigJson5(raw: string, json5?: {
  parse: (value: string) => unknown;
}): ParseConfigJson5Result;
//#endregion
//#region src/config/io.runtime.d.ts
declare function clearConfigCache(): void;
declare function registerConfigWriteListener(listener: (event: ConfigWriteNotification) => void, options?: {
  ownsRuntimeActivationFor?: string;
  preCommitRuntimePreflight?: (sourceConfig: OpenClawConfig, refreshOptions?: RuntimeConfigSnapshotRefreshOptions) => Promise<RuntimeConfigWritePreparedCandidate>;
}): () => void;
declare function loadConfig(options?: {
  skipPluginValidation?: boolean;
  pin?: boolean;
  skipShellEnvFallback?: boolean;
}): OpenClawConfig;
declare function getRuntimeConfig(options?: {
  skipPluginValidation?: boolean;
  pin?: boolean;
  skipShellEnvFallback?: boolean;
}): OpenClawConfig;
declare function readBestEffortConfig(options?: {
  isolateEnv?: boolean;
  observe?: boolean;
  skipPluginValidation?: boolean;
}): Promise<OpenClawConfig>;
declare function readBestEffortConfigSnapshot(options?: {
  observe?: boolean;
  skipPluginValidation?: boolean;
}): Promise<BestEffortConfigSnapshot>;
declare function readSourceConfigBestEffort(): Promise<OpenClawConfig>;
declare function readConfigFileSnapshot(options?: ConfigSnapshotReadOptions): Promise<ConfigFileSnapshot>;
declare function readConfigFileSnapshotWithPluginMetadata(options?: Pick<ConfigSnapshotReadOptions, "allowSuspiciousRecovery" | "isolateEnv" | "lowerPrecedenceEnv" | "measure" | "observe" | "recoverSuspicious">): Promise<ReadConfigFileSnapshotWithPluginMetadataResult>;
declare function promoteConfigSnapshotToLastKnownGood(snapshot: ConfigFileSnapshot): Promise<boolean>;
declare function recoverConfigFromLastKnownGood(params: {
  snapshot: ConfigFileSnapshot;
  reason: string;
}): Promise<boolean>;
declare function recoverConfigFromJsonRootSuffix(snapshot: ConfigFileSnapshot): Promise<boolean>;
declare function readSourceConfigSnapshot(): Promise<ConfigFileSnapshot>;
declare function readConfigFileSnapshotForWrite(options?: {
  skipPluginValidation?: boolean;
}): Promise<ReadConfigFileSnapshotForWriteResult>;
declare function readSourceConfigSnapshotForWrite(): Promise<ReadConfigFileSnapshotForWriteResult>;
declare function writeConfigFile(cfg: OpenClawConfig, options?: ConfigWriteOptions): Promise<ConfigWriteResult>;
//#endregion
//#region src/config/runtime-source-projection.d.ts
/** Projects a runtime-derived config back onto the active authored source snapshot. */
declare function projectConfigOntoRuntimeSourceSnapshot(config: OpenClawConfig): OpenClawConfig;
//#endregion
export { RuntimeConfigSnapshotMetadata as A, resolveRuntimeConfigCacheKey as B, ConfigSnapshotReadOptions as C, ReadConfigFileSnapshotWithPluginMetadataResult as D, ConfigWriteResult as E, getRuntimeConfigSourceSnapshot as F, setRuntimeConfigSnapshotRefreshHandler as G, setAppliedRuntimeConfigSnapshot as H, hashRuntimeConfigValue as I, resetConfigRuntimeState as L, getRuntimeConfigAppliedHash as M, getRuntimeConfigSnapshot as N, ConfigWriteAfterWrite as O, getRuntimeConfigSnapshotMetadata as P, resolveConfigWriteAfterWrite as R, ConfigRuntimeRefreshError as S, ConfigWriteOptions as T, setRuntimeConfigAppliedHash as U, selectApplicableRuntimeConfig as V, setRuntimeConfigSnapshot as W, writeConfigFile as _, promoteConfigSnapshotToLastKnownGood as a, createConfigIO as b, readConfigFileSnapshot as c, readSourceConfigBestEffort as d, readSourceConfigSnapshot as f, registerConfigWriteListener as g, recoverConfigFromLastKnownGood as h, loadConfig as i, clearRuntimeConfigSnapshot as j, ConfigWriteFollowUp as k, readConfigFileSnapshotForWrite as l, recoverConfigFromJsonRootSuffix as m, clearConfigCache as n, readBestEffortConfig as o, readSourceConfigSnapshotForWrite as p, getRuntimeConfig as r, readBestEffortConfigSnapshot as s, projectConfigOntoRuntimeSourceSnapshot as t, readConfigFileSnapshotWithPluginMetadata as u, parseConfigJson5 as v, ConfigWriteNotification as w, BestEffortConfigSnapshot as x, resolveConfigSnapshotHash as y, resolveConfigWriteFollowUp as z };