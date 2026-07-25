import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { c as SessionEntry } from "./types-D43pE80v.js";
//#region src/agents/thinking-runtime.d.ts
/** Resolves an explicit session override before configured model/provider policy. */
declare function resolveEffectiveAgentRuntime(params: {
  cfg: OpenClawConfig;
  provider: string;
  modelId: string;
  agentId?: string;
  sessionKey?: string;
  sessionEntry?: Pick<SessionEntry, "agentHarnessId" | "agentRuntimeOverride">;
}): string;
//#endregion
export { resolveEffectiveAgentRuntime as t };