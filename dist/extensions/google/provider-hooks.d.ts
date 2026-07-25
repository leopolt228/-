import { Bc as ProviderReplayPolicy, Rc as ProviderReasoningOutputMode, Vc as ProviderReplayPolicyContext, Wc as ProviderSanitizeReplayHistoryContext, zc as ProviderReasoningOutputModeContext } from "../../types-Bi5Leigi.js";
import { s as AgentMessage } from "../../types-Dedz4oTJ.js";
import { r as ProviderThinkingProfile } from "../../provider-thinking.types-DhIiOz1Q.js";
import { At as ProviderDefaultThinkingPolicyContext, Mt as ProviderFailoverErrorContext, Rt as ProviderNormalizeToolSchemasContext, a as AnyAgentTool, on as ProviderToolSchemaDiagnostic } from "../../plugin-entry-Bj-pdgAt.js";
import { p as createGoogleThinkingStreamWrapper } from "../../provider-stream-shared-DTYsoEex.js";
//#region extensions/google/provider-hooks.d.ts
declare const GOOGLE_GEMINI_PROVIDER_HOOKS: {
  resolveThinkingProfile: (context: ProviderDefaultThinkingPolicyContext) => ProviderThinkingProfile | undefined;
  wrapStreamFn: typeof createGoogleThinkingStreamWrapper;
  classifyFailoverReason: ({
    code
  }: ProviderFailoverErrorContext) => "overloaded" | "server_error" | "timeout" | undefined;
  normalizeToolSchemas: (ctx: ProviderNormalizeToolSchemasContext) => AnyAgentTool[];
  inspectToolSchemas: (ctx: ProviderNormalizeToolSchemasContext) => ProviderToolSchemaDiagnostic[];
  buildReplayPolicy?: ((ctx: ProviderReplayPolicyContext) => ProviderReplayPolicy | null | undefined) | undefined;
  sanitizeReplayHistory?: ((ctx: ProviderSanitizeReplayHistoryContext) => Promise<AgentMessage[] | null | undefined> | AgentMessage[] | null | undefined) | undefined;
  resolveReasoningOutputMode?: ((ctx: ProviderReasoningOutputModeContext) => ProviderReasoningOutputMode | null | undefined) | undefined;
};
//#endregion
export { GOOGLE_GEMINI_PROVIDER_HOOKS };