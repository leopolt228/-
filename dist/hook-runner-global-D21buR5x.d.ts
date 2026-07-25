import { $ as PluginHookSubagentSpawnedEvent, A as PluginHookLlmInputEvent, At as PluginHookBeforePromptBuildEvent, B as PluginHookReplyPayloadSendingContext, C as PluginHookCronReconciledContext, Ct as PluginHookMessageSentEvent, D as PluginHookGatewayStopEvent, Dt as PluginHookBeforeToolCallResult, E as PluginHookGatewayStartEvent, F as PluginHookRegistration, G as PluginHookSessionContext, H as PluginHookReplyPayloadSendingResult, I as PluginHookReplyDispatchContext, J as PluginHookSubagentContext, K as PluginHookSessionEndEvent, L as PluginHookReplyDispatchEvent, M as PluginHookModelCallEndedEvent, N as PluginHookModelCallStartedEvent, O as PluginHookHandlerMap, Ot as PluginHookBeforeModelResolveEvent, P as PluginHookName, Q as PluginHookSubagentProgressEvent, R as PluginHookReplyDispatchResult, S as PluginHookCronChangedEvent, St as PluginHookMessageSendingResult, T as PluginHookGatewayContext, Tt as InputGateDecision, U as PluginHookResolveExecEnvContext, V as PluginHookReplyPayloadSendingEvent, W as PluginHookResolveExecEnvEvent, X as PluginHookSubagentDeliveryTargetResult, Y as PluginHookSubagentDeliveryTargetEvent, Z as PluginHookSubagentEndedEvent, _ as PluginHookBeforeMessageWriteEvent, _t as PluginHookInboundClaimContext, a as PluginHookBeforeAgentFinalizeEvent, b as PluginHookBeforeToolCallEvent, bt as PluginHookMessageReceivedEvent, c as PluginHookBeforeAgentReplyResult, ct as PluginHookToolResultPersistResult, d as PluginHookBeforeDispatchContext, dt as PluginHeartbeatPromptContributionEvent, et as PluginHookSubagentSpawningEvent, f as PluginHookBeforeDispatchEvent, ft as PluginHeartbeatPromptContributionResult, g as PluginHookBeforeInstallResult, h as PluginHookBeforeInstallEvent, i as PluginHookAgentEndEvent, j as PluginHookLlmOutputEvent, jt as PluginHookBeforePromptBuildResult, k as PluginHookInboundClaimResult, kt as PluginHookBeforeModelResolveResult, l as PluginHookBeforeAgentRunEvent, lt as PluginAgentTurnPrepareEvent, m as PluginHookBeforeInstallContext, n as PluginHookAfterToolCallEvent, nt as PluginHookToolContext, o as PluginHookBeforeAgentFinalizeResult, ot as PluginHookToolResultPersistContext, p as PluginHookBeforeDispatchResult, q as PluginHookSessionStartEvent, r as PluginHookAgentContext, s as PluginHookBeforeAgentReplyEvent, st as PluginHookToolResultPersistEvent, t as PluginHookAfterCompactionEvent, tt as PluginHookSubagentSpawningResult, u as PluginHookBeforeCompactionEvent, ut as PluginAgentTurnPrepareResult, v as PluginHookBeforeMessageWriteResult, vt as PluginHookInboundClaimEvent, w as PluginHookCronReconciledEvent, wt as GateHookResult, xt as PluginHookMessageSendingEvent, y as PluginHookBeforeResetEvent, yt as PluginHookMessageContext } from "./hook-types-Y_WIyhXM.js";
import { t as HookEntry } from "./types-BCpQVPCb.js";

//#region src/plugins/hook-registry.types.d.ts
/** Legacy hook registration stored by the global hook runner registry. */
type PluginLegacyHookRegistration = {
  pluginId: string;
  entry: HookEntry;
  events: string[];
  source: string;
  rootDir?: string;
};
/** Hook runner registry state for legacy and typed plugin hooks. */
type HookRunnerRegistry = {
  hooks: PluginLegacyHookRegistration[];
  typedHooks: PluginHookRegistration[];
};
/** Global hook runner registry snapshot with plugin load status. */
type GlobalHookRunnerRegistry = HookRunnerRegistry & {
  plugins: Array<{
    id: string;
    status: "loaded" | "disabled" | "error";
  }>;
};
//#endregion
//#region src/plugins/hooks.d.ts
type HookRunnerLogger = {
  debug?: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};
type HookFailurePolicy = "fail-open" | "fail-closed";
type VoidHookRunOptions = {
  unrefTimeout?: boolean;
};
type HookRunnerOptions = {
  logger?: HookRunnerLogger; /** If true, errors in hooks will be caught and logged instead of thrown */
  catchErrors?: boolean;
  /**
   * Optional per-hook failure policy.
   * Defaults to fail-open unless explicitly overridden for a hook name.
   */
  failurePolicyByHook?: Partial<Record<PluginHookName, HookFailurePolicy>>;
  /**
   * Optional timeout for void/observation hooks. A timed-out hook is logged and
   * the runner continues, but the plugin's underlying work is not cancelled.
   */
  voidHookTimeoutMsByHook?: Partial<Record<PluginHookName, number>>;
  /**
   * Optional timeout for modifying hooks. A timed-out hook is logged and skipped,
   * but the plugin's underlying work is not cancelled.
   */
  modifyingHookTimeoutMsByHook?: Partial<Record<PluginHookName, number>>;
};
type PluginTargetedInboundClaimOutcome = {
  status: "handled";
  result: PluginHookInboundClaimResult;
} | {
  status: "missing_plugin";
} | {
  status: "no_handler";
} | {
  status: "declined";
} | {
  status: "error";
  error: string;
};
/**
 * Create a hook runner for a specific registry.
 */
declare function createHookRunner(registry: GlobalHookRunnerRegistry, options?: HookRunnerOptions): {
  runBeforeModelResolve: (event: PluginHookBeforeModelResolveEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeModelResolveResult | undefined>;
  runAgentTurnPrepare: (event: PluginAgentTurnPrepareEvent, ctx: PluginHookAgentContext) => Promise<PluginAgentTurnPrepareResult | undefined>;
  runBeforePromptBuild: (event: PluginHookBeforePromptBuildEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforePromptBuildResult | undefined>;
  runBeforeAgentReply: (event: PluginHookBeforeAgentReplyEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeAgentReplyResult | undefined>;
  runModelCallStarted: (event: PluginHookModelCallStartedEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runModelCallEnded: (event: PluginHookModelCallEndedEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runLlmInput: (event: PluginHookLlmInputEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runLlmOutput: (event: PluginHookLlmOutputEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runBeforeAgentFinalize: (event: PluginHookBeforeAgentFinalizeEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeAgentFinalizeResult | undefined>;
  runAgentEnd: (event: PluginHookAgentEndEvent, ctx: PluginHookAgentContext, optionsLocal?: VoidHookRunOptions) => Promise<void>;
  runBeforeCompaction: (event: PluginHookBeforeCompactionEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runAfterCompaction: (event: PluginHookAfterCompactionEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runBeforeReset: (event: PluginHookBeforeResetEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runBeforeAgentRun: (event: PluginHookBeforeAgentRunEvent, ctx: PluginHookAgentContext) => Promise<GateHookResult<InputGateDecision> | undefined>;
  runInboundClaim: (event: PluginHookInboundClaimEvent, ctx: PluginHookInboundClaimContext) => Promise<PluginHookInboundClaimResult | undefined>;
  runInboundClaimForPlugin: (pluginId: string, event: PluginHookInboundClaimEvent, ctx: PluginHookInboundClaimContext) => Promise<PluginHookInboundClaimResult | undefined>;
  runInboundClaimForPluginOutcome: (pluginId: string, event: PluginHookInboundClaimEvent, ctx: PluginHookInboundClaimContext) => Promise<PluginTargetedInboundClaimOutcome>;
  runChannelPairingRequested: (event: Parameters<PluginHookHandlerMap["channel_pairing_requested"]>[0], ctx: Parameters<PluginHookHandlerMap["channel_pairing_requested"]>[1]) => Promise<void>;
  runMessageReceived: (event: PluginHookMessageReceivedEvent, ctx: PluginHookMessageContext) => Promise<void>;
  runBeforeDispatch: (event: PluginHookBeforeDispatchEvent, ctx: PluginHookBeforeDispatchContext) => Promise<PluginHookBeforeDispatchResult | undefined>;
  runReplyDispatch: (event: PluginHookReplyDispatchEvent, ctx: PluginHookReplyDispatchContext) => Promise<PluginHookReplyDispatchResult | undefined>;
  runReplyPayloadSending: (event: PluginHookReplyPayloadSendingEvent, ctx: PluginHookReplyPayloadSendingContext) => Promise<PluginHookReplyPayloadSendingResult | undefined>;
  runMessageSending: (event: PluginHookMessageSendingEvent, ctx: PluginHookMessageContext) => Promise<PluginHookMessageSendingResult | undefined>;
  runMessageSent: (event: PluginHookMessageSentEvent, ctx: PluginHookMessageContext) => Promise<void>;
  runBeforeToolCall: (event: PluginHookBeforeToolCallEvent, ctx: PluginHookToolContext) => Promise<PluginHookBeforeToolCallResult | undefined>;
  runAfterToolCall: (event: PluginHookAfterToolCallEvent, ctx: PluginHookToolContext) => Promise<void>;
  runToolResultPersist: (event: PluginHookToolResultPersistEvent, ctx: PluginHookToolResultPersistContext) => PluginHookToolResultPersistResult | undefined;
  runBeforeMessageWrite: (event: PluginHookBeforeMessageWriteEvent, ctx: {
    agentId?: string;
    sessionKey?: string;
  }) => PluginHookBeforeMessageWriteResult | undefined;
  runSessionStart: (event: PluginHookSessionStartEvent, ctx: PluginHookSessionContext) => Promise<void>;
  runSessionEnd: (event: PluginHookSessionEndEvent, ctx: PluginHookSessionContext) => Promise<void>;
  runSubagentSpawning: (event: PluginHookSubagentSpawningEvent, ctx: PluginHookSubagentContext) => Promise<PluginHookSubagentSpawningResult | undefined>;
  runSubagentDeliveryTarget: (event: PluginHookSubagentDeliveryTargetEvent, ctx: PluginHookSubagentContext) => Promise<PluginHookSubagentDeliveryTargetResult | undefined>;
  runSubagentSpawned: (event: PluginHookSubagentSpawnedEvent, ctx: PluginHookSubagentContext) => Promise<void>;
  runSubagentProgress: (event: PluginHookSubagentProgressEvent, ctx: PluginHookSubagentContext) => Promise<void>;
  runSubagentEnded: (event: PluginHookSubagentEndedEvent, ctx: PluginHookSubagentContext) => Promise<void>;
  runGatewayStart: (event: PluginHookGatewayStartEvent, ctx: PluginHookGatewayContext) => Promise<void>;
  runGatewayStop: (event: PluginHookGatewayStopEvent, ctx: PluginHookGatewayContext) => Promise<void>;
  runHeartbeatPromptContribution: (event: PluginHeartbeatPromptContributionEvent, ctx: PluginHookAgentContext) => Promise<PluginHeartbeatPromptContributionResult | undefined>;
  runCronReconciled: (event: PluginHookCronReconciledEvent, ctx: PluginHookCronReconciledContext) => Promise<void>;
  runCronChanged: (event: PluginHookCronChangedEvent, ctx: PluginHookGatewayContext) => Promise<void>;
  runBeforeInstall: (event: PluginHookBeforeInstallEvent, ctx: PluginHookBeforeInstallContext) => Promise<PluginHookBeforeInstallResult | undefined>;
  runResolveExecEnv: (event: PluginHookResolveExecEnvEvent, ctx: PluginHookResolveExecEnvContext) => Promise<Record<string, string>>;
  hasHooks: (hookName: PluginHookName) => boolean;
  getHookCount: (hookName: PluginHookName) => number;
};
type HookRunner = ReturnType<typeof createHookRunner>;
//#endregion
//#region src/plugins/hook-runner-global.d.ts
/**
 * Initialize the global hook runner with a plugin registry.
 * Called on every plugin registry activation and by SDK consumers. The runner
 * instance stays stable so references captured mid-run keep seeing current
 * hooks. An isolated SDK registry stays authoritative; runtime registries use
 * the gateway surface precedence shared by plugin tool resolution.
 */
declare function initializeGlobalHookRunner(registry: GlobalHookRunnerRegistry): void;
/**
 * Get the global hook runner.
 * Returns null if plugins haven't been loaded yet.
 */
declare function getGlobalHookRunner(): HookRunner | null;
/**
 * Get the registry from the most recent activation or explicit initialization.
 * Returns null if plugins haven't been loaded yet. Hook dispatch does not use
 * this single registry; the runner resolves hooks from the live composed view.
 */
declare function getGlobalPluginRegistry(): GlobalHookRunnerRegistry | null;
/**
 * Check if any hooks are registered for a given hook name.
 */
declare function hasGlobalHooks(hookName: Parameters<HookRunner["hasHooks"]>[0]): boolean;
declare function runGlobalGatewayStopSafely(params: {
  event: PluginHookGatewayStopEvent;
  ctx: PluginHookGatewayContext;
  onError?: (err: unknown) => void;
}): Promise<void>;
/**
 * Reset the global hook runner (for testing).
 */
declare function resetGlobalHookRunner(): void;
//#endregion
export { resetGlobalHookRunner as a, initializeGlobalHookRunner as i, getGlobalPluginRegistry as n, runGlobalGatewayStopSafely as o, hasGlobalHooks as r, getGlobalHookRunner as t };