import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";

//#region src/memory-host-sdk/dreaming.d.ts
declare const DEFAULT_MEMORY_DREAMING_FREQUENCY = "0 3 * * *";
declare const MANAGED_MEMORY_DREAMING_CRON_NAME = "Memory Dreaming Promotion";
declare const MANAGED_MEMORY_DREAMING_CRON_TAG = "[managed-by=memory-core.short-term-promotion]";
declare const MEMORY_DREAMING_SYSTEM_EVENT_TEXT = "__openclaw_memory_core_short_term_promotion_dream__";
declare const LEGACY_MEMORY_LIGHT_DREAMING_CRON_NAME = "Memory Light Dreaming";
declare const LEGACY_MEMORY_LIGHT_DREAMING_CRON_TAG = "[managed-by=memory-core.dreaming.light]";
declare const LEGACY_MEMORY_LIGHT_DREAMING_EVENT_TEXT = "__openclaw_memory_core_light_sleep__";
declare const LEGACY_MEMORY_REM_DREAMING_CRON_NAME = "Memory REM Dreaming";
declare const LEGACY_MEMORY_REM_DREAMING_CRON_TAG = "[managed-by=memory-core.dreaming.rem]";
declare const LEGACY_MEMORY_REM_DREAMING_EVENT_TEXT = "__openclaw_memory_core_rem_sleep__";
declare const DEFAULT_MEMORY_DEEP_DREAMING_LIMIT = 10;
declare const DEFAULT_MEMORY_DEEP_DREAMING_MIN_SCORE = 0.8;
declare const DEFAULT_MEMORY_DEEP_DREAMING_MIN_RECALL_COUNT = 3;
declare const DEFAULT_MEMORY_DEEP_DREAMING_MIN_UNIQUE_QUERIES = 3;
declare const DEFAULT_MEMORY_DEEP_DREAMING_RECENCY_HALF_LIFE_DAYS = 14;
declare const DEFAULT_MEMORY_DEEP_DREAMING_MAX_PROMOTED_SNIPPET_TOKENS = 160;
type MemoryDreamingSpeed = "fast" | "balanced" | "slow";
type MemoryDreamingThinking = "low" | "medium" | "high";
type MemoryDreamingBudget = "cheap" | "medium" | "expensive";
type MemoryDreamingStorageMode = "inline" | "separate" | "both";
type MemoryLightDreamingSource = "daily" | "sessions" | "recall";
type MemoryDeepDreamingSource = "daily" | "memory" | "sessions" | "logs" | "recall";
type MemoryRemDreamingSource = "memory" | "daily" | "deep";
type MemoryDreamingExecutionConfig = {
  speed: MemoryDreamingSpeed;
  thinking: MemoryDreamingThinking;
  budget: MemoryDreamingBudget;
  model?: string;
  maxOutputTokens?: number;
  temperature?: number;
  timeoutMs?: number;
};
type MemoryDreamingStorageConfig = {
  mode: MemoryDreamingStorageMode;
  separateReports: boolean;
};
type MemoryLightDreamingConfig = {
  enabled: boolean;
  cron: string;
  lookbackDays: number;
  limit: number;
  dedupeSimilarity: number;
  sources: MemoryLightDreamingSource[];
  execution: MemoryDreamingExecutionConfig;
};
type MemoryDeepDreamingRecoveryConfig = {
  enabled: boolean;
  triggerBelowHealth: number;
  lookbackDays: number;
  maxRecoveredCandidates: number;
  minRecoveryConfidence: number;
  autoWriteMinConfidence: number;
};
type MemoryDeepDreamingConfig = {
  enabled: boolean;
  cron: string;
  limit: number;
  minScore: number;
  minRecallCount: number;
  minUniqueQueries: number;
  recencyHalfLifeDays: number;
  maxAgeDays?: number;
  maxPromotedSnippetTokens?: number;
  sources: MemoryDeepDreamingSource[];
  recovery: MemoryDeepDreamingRecoveryConfig;
  execution: MemoryDreamingExecutionConfig;
};
type MemoryRemDreamingConfig = {
  enabled: boolean;
  cron: string;
  lookbackDays: number;
  limit: number;
  minPatternStrength: number;
  sources: MemoryRemDreamingSource[];
  execution: MemoryDreamingExecutionConfig;
};
type MemoryDreamingPhaseName = "light" | "deep" | "rem";
type MemoryDreamingConfig = {
  enabled: boolean;
  frequency: string;
  timezone?: string;
  verboseLogging: boolean;
  storage: MemoryDreamingStorageConfig;
  execution: {
    defaults: MemoryDreamingExecutionConfig;
  };
  phases: {
    light: MemoryLightDreamingConfig;
    deep: MemoryDeepDreamingConfig;
    rem: MemoryRemDreamingConfig;
  };
};
type MemoryDreamingWorkspace = {
  workspaceDir: string;
  agentIds: string[];
};
type MemoryDreamingWorkspaceOptions = {
  primaryWorkspaceDir?: string | null;
  primaryAgentId?: string | null;
  env?: NodeJS.ProcessEnv;
};
declare function resolveMemoryDreamingPluginConfig(cfg: OpenClawConfig | Record<string, unknown> | undefined): Record<string, unknown> | undefined;
/** @deprecated Use resolveMemoryDreamingPluginConfig. */
declare const resolveMemoryCorePluginConfig: typeof resolveMemoryDreamingPluginConfig;
declare function resolveMemoryDreamingConfig(params: {
  pluginConfig?: Record<string, unknown>;
  cfg?: OpenClawConfig;
}): MemoryDreamingConfig;
declare function resolveMemoryDeepDreamingConfig(params: {
  pluginConfig?: Record<string, unknown>;
  cfg?: OpenClawConfig;
}): MemoryDeepDreamingConfig & {
  timezone?: string;
  verboseLogging: boolean;
  storage: MemoryDreamingStorageConfig;
};
declare function resolveMemoryLightDreamingConfig(params: {
  pluginConfig?: Record<string, unknown>;
  cfg?: OpenClawConfig;
}): MemoryLightDreamingConfig & {
  timezone?: string;
  verboseLogging: boolean;
  storage: MemoryDreamingStorageConfig;
};
declare function resolveMemoryRemDreamingConfig(params: {
  pluginConfig?: Record<string, unknown>;
  cfg?: OpenClawConfig;
}): MemoryRemDreamingConfig & {
  timezone?: string;
  verboseLogging: boolean;
  storage: MemoryDreamingStorageConfig;
};
declare function formatMemoryDreamingDay(epochMs: number, timezone?: string): string;
declare function isSameMemoryDreamingDay(firstEpochMs: number, secondEpochMs: number, timezone?: string): boolean;
declare function resolveMemoryDreamingWorkspaces(cfg: OpenClawConfig, options?: MemoryDreamingWorkspaceOptions): MemoryDreamingWorkspace[];
//#endregion
export { resolveMemoryDreamingConfig as C, resolveMemoryRemDreamingConfig as D, resolveMemoryLightDreamingConfig as E, resolveMemoryDeepDreamingConfig as S, resolveMemoryDreamingWorkspaces as T, MemoryDreamingPhaseName as _, DEFAULT_MEMORY_DEEP_DREAMING_MIN_UNIQUE_QUERIES as a, isSameMemoryDreamingDay as b, LEGACY_MEMORY_LIGHT_DREAMING_CRON_NAME as c, LEGACY_MEMORY_REM_DREAMING_CRON_NAME as d, LEGACY_MEMORY_REM_DREAMING_CRON_TAG as f, MEMORY_DREAMING_SYSTEM_EVENT_TEXT as g, MANAGED_MEMORY_DREAMING_CRON_TAG as h, DEFAULT_MEMORY_DEEP_DREAMING_MIN_SCORE as i, LEGACY_MEMORY_LIGHT_DREAMING_CRON_TAG as l, MANAGED_MEMORY_DREAMING_CRON_NAME as m, DEFAULT_MEMORY_DEEP_DREAMING_MAX_PROMOTED_SNIPPET_TOKENS as n, DEFAULT_MEMORY_DEEP_DREAMING_RECENCY_HALF_LIFE_DAYS as o, LEGACY_MEMORY_REM_DREAMING_EVENT_TEXT as p, DEFAULT_MEMORY_DEEP_DREAMING_MIN_RECALL_COUNT as r, DEFAULT_MEMORY_DREAMING_FREQUENCY as s, DEFAULT_MEMORY_DEEP_DREAMING_LIMIT as t, LEGACY_MEMORY_LIGHT_DREAMING_EVENT_TEXT as u, MemoryDreamingStorageConfig as v, resolveMemoryDreamingPluginConfig as w, resolveMemoryCorePluginConfig as x, formatMemoryDreamingDay as y };