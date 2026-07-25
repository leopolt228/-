import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { Fs as RunEmbeddedAgentParams, Xc as EmbeddedAgentRunResult } from "./types-Bi5Leigi.js";
import { c as ProviderRouteOverridePresence } from "./provider-model-types-CPluX4eq.js";
//#region src/agents/embedded-agent-runner/run-orchestrator.d.ts
declare function runEmbeddedAgent(paramsInput: RunEmbeddedAgentParams): Promise<EmbeddedAgentRunResult>;
//#endregion
//#region src/agents/harness/runtime-plugin.d.ts
/** Ensures the plugin that owns the selected harness runtime is loaded before harness selection. */
declare function ensureSelectedAgentHarnessPlugin(params: {
  provider: string;
  modelId: string;
  config?: OpenClawConfig;
  agentId?: string;
  sessionKey?: string;
  agentHarnessId?: string;
  agentHarnessRuntimeOverride?: string;
  requestTransportOverrides?: ProviderRouteOverridePresence;
  workspaceDir: string;
}): Promise<void>;
//#endregion
export { runEmbeddedAgent as n, ensureSelectedAgentHarnessPlugin as t };