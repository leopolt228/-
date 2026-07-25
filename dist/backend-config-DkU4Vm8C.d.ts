import { a as OpenClawConfig, i as MemoryQmdStartupMode, n as MemoryCitationsMode, o as SessionSendPolicyConfig, r as MemoryQmdSearchMode, t as MemoryBackend } from "./config-utils-CMysGzTx.js";

//#region packages/memory-host-sdk/src/host/backend-config.d.ts
type ResolvedMemoryBackendConfig = {
  backend: MemoryBackend;
  citations: MemoryCitationsMode;
  qmd?: ResolvedQmdConfig;
};
/** @public */
type ResolvedQmdCollection = {
  name: string;
  path: string;
  pattern: string;
  kind: "memory" | "custom" | "sessions";
};
/** @public */
type ResolvedQmdUpdateConfig = {
  intervalMs: number;
  debounceMs: number;
  onBoot: boolean;
  startup: MemoryQmdStartupMode;
  startupDelayMs: number;
  waitForBootSync: boolean;
  embedIntervalMs: number;
  commandTimeoutMs: number;
  updateTimeoutMs: number;
  embedTimeoutMs: number;
};
/** @public */
type ResolvedQmdLimitsConfig = {
  maxResults: number;
  maxSnippetChars: number;
  maxInjectedChars: number;
  timeoutMs: number;
};
/** @public */
type ResolvedQmdSessionConfig = {
  enabled: boolean;
  /**
   * Whether ordinary memory searches and memory_get may access exported
   * session transcripts. Only explicit memory.qmd.sessions.enabled opts
   * transcripts into the ordinary memory corpus; remember-across-conversations
   * implies export for trusted recall search only.
   */
  readable: boolean;
  exportDir?: string;
  retentionDays?: number;
};
type ResolvedQmdMcporterConfig = {
  enabled: boolean;
  serverName: string;
  startDaemon: boolean;
};
type ResolvedQmdConfig = {
  command: string;
  mcporter: ResolvedQmdMcporterConfig;
  searchMode: MemoryQmdSearchMode;
  rerank?: boolean;
  searchTool?: string;
  collections: ResolvedQmdCollection[];
  sessions: ResolvedQmdSessionConfig;
  update: ResolvedQmdUpdateConfig;
  limits: ResolvedQmdLimitsConfig;
  includeDefaultMemory: boolean;
  scope?: SessionSendPolicyConfig;
};
declare function resolveMemoryBackendConfig(params: {
  cfg: OpenClawConfig;
  agentId: string;
}): ResolvedMemoryBackendConfig;
//#endregion
export { resolveMemoryBackendConfig as i, ResolvedQmdConfig as n, ResolvedQmdMcporterConfig as r, ResolvedMemoryBackendConfig as t };