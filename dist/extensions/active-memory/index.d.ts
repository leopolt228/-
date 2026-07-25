import { t as OpenClawPluginDefinition } from "../../types-Bi5Leigi.js";
import { v as OpenClawPluginConfigSchema, y as OpenClawPluginDefinition$1 } from "../../plugin-entry-Bj-pdgAt.js";
import { a as isMissingRegisteredMemoryToolsError, m as setSetupGraceTimeoutMsForTests, p as setMinimumTimeoutMsForTests, s as normalizePluginConfig } from "../../config-BhlqxOSV.js";
import { n as buildPromptPrefix, t as buildMetadata } from "../../prompt-F8hIQlcK.js";
import { n as buildSearchQuery } from "../../query-C63r8S2c.js";
import { a as isCircuitBreakerOpen, d as shouldCacheResult, i as getCircuitBreakerEntry, n as buildCircuitBreakerKey, r as getCachedResult, t as buildCacheKey, u as setCachedResult } from "../../recall-state-5I6b_OF0.js";
import { n as buildPluginStatusLine } from "../../session-XKH0XbBu.js";
import { a as readPartialAssistantText, l as setTimeoutPartialDataGraceMsForTests } from "../../transcript-result-EQaPbqs4.js";
import { t as readActiveMemorySearchDebug } from "../../transcript-watch-Cir_1FsE.js";
import { s as hasUsableMemoryResultInSessionRecord } from "../../transcript-Qf8reTG3.js";

//#region extensions/active-memory/index.d.ts
/** Plugin entry registering Active Memory hooks, tools, config schema, and doctor cleanup. */
declare const _default: {
  id: string;
  name: string;
  description: string;
  configSchema: OpenClawPluginConfigSchema;
  register: NonNullable<OpenClawPluginDefinition$1["register"]>;
} & Pick<OpenClawPluginDefinition, "kind" | "reload" | "nodeHostCommands" | "securityAuditCollectors">;
declare const testing: {
  buildSearchQuery: typeof buildSearchQuery;
  buildCacheKey: typeof buildCacheKey;
  buildCircuitBreakerKey: typeof buildCircuitBreakerKey;
  buildMetadata: typeof buildMetadata;
  buildPluginStatusLine: typeof buildPluginStatusLine;
  buildPromptPrefix: typeof buildPromptPrefix;
  getCachedResult: typeof getCachedResult;
  hasUsableMemoryResultInSessionRecord: typeof hasUsableMemoryResultInSessionRecord;
  isCircuitBreakerOpen: typeof isCircuitBreakerOpen;
  isMissingRegisteredMemoryToolsError: typeof isMissingRegisteredMemoryToolsError;
  normalizePluginConfig: typeof normalizePluginConfig;
  readActiveMemorySearchDebug: typeof readActiveMemorySearchDebug;
  readPartialAssistantText: typeof readPartialAssistantText;
  shouldCacheResult: typeof shouldCacheResult;
  resetActiveRecallCacheForTests(): void;
  setMinimumTimeoutMsForTests: typeof setMinimumTimeoutMsForTests;
  setSetupGraceTimeoutMsForTests: typeof setSetupGraceTimeoutMsForTests;
  setTimeoutPartialDataGraceMsForTests: typeof setTimeoutPartialDataGraceMsForTests;
  setCachedResult: typeof setCachedResult;
  getCircuitBreakerEntry: typeof getCircuitBreakerEntry;
};
//#endregion
export { testing as __testing, testing, _default as default };