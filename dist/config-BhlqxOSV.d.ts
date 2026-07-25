import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { g as OpenClawPluginApi } from "./plugin-entry-Bj-pdgAt.js";
import { d as ActiveMemoryFastMode, it as ResolvedActiveRecallPluginConfig } from "./types-BDJia9Pj.js";

//#region extensions/active-memory/config.d.ts
declare function clampInt(value: number | undefined, fallback: number, min: number, max: number): number;
declare function hasDeprecatedModelFallbackPolicy(pluginConfig: unknown): boolean;
declare function resolveSafeTranscriptDir(baseSessionsDir: string, transcriptDir: string): string;
declare function resolvePersistentTranscriptBaseDir(api: OpenClawPluginApi, agentId: string): string;
declare function requireTransientWorkspaceDir(tempDir: string | undefined): string;
declare function isMissingRegisteredMemoryToolsError(error: unknown, toolsAllow?: readonly string[]): boolean;
declare function normalizePluginConfig(pluginConfig: unknown, cfg?: OpenClawConfig): ResolvedActiveRecallPluginConfig;
declare function applyActiveMemoryRuntimeConfigSnapshot(cfg: OpenClawConfig, pluginConfig: ResolvedActiveRecallPluginConfig): OpenClawConfig;
declare function resolveActiveMemoryCleanupConfig(api: OpenClawPluginApi): OpenClawConfig | undefined;
declare function normalizeActiveMemoryFastMode(fastMode: unknown): ActiveMemoryFastMode | undefined;
declare function resetActiveMemoryConfigForTests(): void;
declare function setMinimumTimeoutMsForTests(value: number): void;
declare function setSetupGraceTimeoutMsForTests(value: number): void;
/**
 * Recalls eligible for CLI-backend dispatch run a fresh CLI process, which
 * measured runs place at 9-20s — over the plain 15s default. Eligibility is
 * the runner's own dispatch decision (route, registered backend, stored
 * credential mode), so API-key setups that keep the direct passthrough also
 * keep the plain default. Explicit operator timeoutMs config always wins.
 */
declare function applyCliRuntimeRecallTimeoutDefault(config: ResolvedActiveRecallPluginConfig, cliDispatchEligible: boolean): ResolvedActiveRecallPluginConfig;
//#endregion
export { isMissingRegisteredMemoryToolsError as a, requireTransientWorkspaceDir as c, resolvePersistentTranscriptBaseDir as d, resolveSafeTranscriptDir as f, hasDeprecatedModelFallbackPolicy as i, resetActiveMemoryConfigForTests as l, setSetupGraceTimeoutMsForTests as m, applyCliRuntimeRecallTimeoutDefault as n, normalizeActiveMemoryFastMode as o, setMinimumTimeoutMsForTests as p, clampInt as r, normalizePluginConfig as s, applyActiveMemoryRuntimeConfigSnapshot as t, resolveActiveMemoryCleanupConfig as u };