import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { n as RuntimeEnv } from "./runtime-DRcp7-j9.js";
import { r as ThinkLevel } from "./thinking.shared-0bZWY054.js";
import { t as ModelCatalogEntry } from "./model-catalog.types-cokHDhLz.js";
import { n as ModelRef, t as ModelManifestNormalizationContext } from "./model-selection-normalize-D5r4q7LO.js";

//#region src/agents/model-selection-config.d.ts
declare function resolveDefaultModelForAgent(params: {
  cfg: OpenClawConfig;
  agentId?: string;
  allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext): ModelRef;
//#endregion
//#region src/agents/model-thinking-default.d.ts
/** Resolves the default thinking level for a provider/model pair. */
declare function resolveThinkingDefault(params: {
  cfg: OpenClawConfig;
  provider: string;
  model: string;
  catalog?: ModelCatalogEntry[];
  agentRuntime?: string | null;
}): ThinkLevel;
/** Resolves thinking default after loading runtime catalog only when needed. */
declare function resolveThinkingDefaultWithRuntimeCatalog(params: {
  cfg: OpenClawConfig;
  provider: string;
  model: string;
  loadRuntimeCatalog: () => Promise<ModelCatalogEntry[]>;
  agentRuntime?: string | null;
}): Promise<ThinkLevel>;
//#endregion
//#region src/agents/model-selection-shared.d.ts
type ModelManifestPlugins = ModelManifestNormalizationContext["manifestPlugins"];
type ModelAliasIndex = {
  byAlias: Map<string, {
    alias: string;
    ref: ModelRef;
  }>;
  byProviderAlias?: Map<string, {
    alias: string;
    ref: ModelRef;
  }>;
  byKey: Map<string, string[]>;
};
type BuildModelAliasIndexParams = {
  cfg: OpenClawConfig;
  defaultProvider: string;
  agentId?: string;
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext;
/** Build lookup maps from user-facing aliases to normalized model refs. */
declare function buildModelAliasIndex(params: BuildModelAliasIndexParams): ModelAliasIndex;
declare function resolveModelRefFromString(params: {
  cfg?: OpenClawConfig;
  raw: string;
  defaultProvider: string;
  aliasIndex?: ModelAliasIndex;
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext): {
  ref: ModelRef;
  alias?: string;
} | null;
/** Build catalog entries from configured provider model rows. */
declare function buildConfiguredModelCatalog(params: {
  cfg: OpenClawConfig;
  workspaceDir?: string;
  manifestPlugins?: ModelManifestPlugins;
}): ModelCatalogEntry[];
//#endregion
//#region src/agents/model-selection.d.ts
declare function resolveAllowedModelRef(params: {
  cfg: OpenClawConfig;
  catalog: ModelCatalogEntry[];
  raw: string;
  defaultProvider: string;
  defaultModel?: string;
} & ModelManifestNormalizationContext): {
  ref: ModelRef;
  key: string;
} | {
  error: string;
};
//#endregion
//#region src/config/logging.d.ts
type LogConfigUpdatedOptions = {
  path?: string;
  backupPath?: string | false;
  suffix?: string;
};
/** Formats a config path for operator-facing log output. */
/** Emits the standard config-updated message through the active runtime logger. */
declare function logConfigUpdated(runtime: RuntimeEnv, opts?: LogConfigUpdatedOptions): void;
//#endregion
//#region src/commands/models/shared.d.ts
/** Runtime config snapshot supplied to model config mutators. */
type UpdateConfigContext = {
  runtimeConfig: OpenClawConfig;
};
/** Reads source config, applies a mutator, and writes only the source-form config. */
declare function updateConfig(mutator: (cfg: OpenClawConfig, context: UpdateConfigContext) => OpenClawConfig): Promise<OpenClawConfig>;
//#endregion
export { buildModelAliasIndex as a, resolveThinkingDefaultWithRuntimeCatalog as c, buildConfiguredModelCatalog as i, resolveDefaultModelForAgent as l, logConfigUpdated as n, resolveModelRefFromString as o, resolveAllowedModelRef as r, resolveThinkingDefault as s, updateConfig as t };