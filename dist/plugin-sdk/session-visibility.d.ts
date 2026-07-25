import { i as OpenClawConfig } from "../types.openclaw-DAPZkTyD.js";
import { n as GatewayClientName, t as GatewayClientMode } from "../client-info-CBeyXFzt.js";
import { t as OperatorScope } from "../operator-scopes-Bvk1osNM.js";
import { t as DeviceIdentity } from "../device-identity-store-BxHmXNWZ.js";
import { a as GatewayClientRequestOptions } from "../client-CmAHRX9Y.js";

//#region src/gateway/call.d.ts
type GatewayRequestFunction = <T = Record<string, unknown>>(method: string, params?: unknown, opts?: GatewayClientRequestOptions) => Promise<T>;
type CallGatewayBaseOptions = {
  url?: string;
  token?: string;
  password?: string;
  tlsFingerprint?: string;
  config?: OpenClawConfig;
  method: string;
  params?: unknown;
  expectFinal?: boolean;
  timeoutMs?: number | null;
  signal?: AbortSignal;
  onAccepted?: GatewayClientRequestOptions["onAccepted"];
  onSignalAbort?: (request: GatewayRequestFunction) => Promise<void> | void;
  clientName?: GatewayClientName;
  clientDisplayName?: string;
  clientVersion?: string;
  platform?: string;
  mode?: GatewayClientMode;
  approvalRuntimeToken?: string;
  agentRuntimeIdentityToken?: string;
  useStoredDeviceAuth?: boolean;
  requiredStoredDeviceAuthScopes?: OperatorScope[];
  requireLocalBackendSharedAuth?: boolean;
  deviceIdentity?: DeviceIdentity | null;
  instanceId?: string;
  minProtocol?: number;
  maxProtocol?: number;
  requiredMethods?: string[];
  /**
   * Overrides the config path shown in connection error details.
   * Does not affect config loading; callers still control auth via opts.token/password/env/config.
   */
  configPath?: string;
  /**
   * Explicit local gateway port for command-line overrides such as `gateway health --port`.
   * Bypasses OPENCLAW_GATEWAY_URL and OPENCLAW_GATEWAY_PORT for this call only.
   */
  localPortOverride?: number; /** Keep a caller-supplied config target authoritative over OPENCLAW_GATEWAY_URL. */
  ignoreEnvUrlOverride?: boolean;
};
type CallGatewayOptions = CallGatewayBaseOptions & {
  scopes?: OperatorScope[];
};
declare function callGateway<T = Record<string, unknown>>(opts: CallGatewayOptions): Promise<T>;
//#endregion
//#region src/plugin-sdk/session-visibility.d.ts
type GatewayCaller = typeof callGateway;
/** Test hook: must stay aligned with `sessions-resolution` `testing.setDepsForTest`. */
declare const sessionVisibilityGatewayTesting: {
  setCallGatewayForListSpawned(overrides?: GatewayCaller): void;
};
/** Configured visibility mode for session tools and session-related commands. */
type SessionToolsVisibility = "self" | "tree" | "agent" | "all";
/** Agent-to-agent access policy compiled from `tools.agentToAgent` config. */
type AgentToAgentPolicy = {
  enabled: boolean;
  matchesAllow: (agentId: string) => boolean;
  isAllowed: (requesterAgentId: string, targetAgentId: string) => boolean;
};
/** Session operation whose visibility error copy should be rendered. */
type SessionAccessAction = "history" | "send" | "list" | "status";
/** Result of checking whether one session operation may target a session. */
type SessionAccessResult = {
  allowed: true;
  expectedSessionId?: string;
} | {
  allowed: false;
  error: string;
  status: "forbidden";
};
type ScopedSessionAccessRequest = {
  action: Exclude<SessionAccessAction, "list">;
  requesterSessionKey: string;
  targetSessionKey: string;
};
type ScopedSessionAccessGrant = {
  expectedSessionId: string;
};
type ScopedSessionAccessProvider = (request: ScopedSessionAccessRequest) => ScopedSessionAccessGrant | undefined;
declare function registerScopedSessionAccessProvider(provider: ScopedSessionAccessProvider): () => void;
declare function resolveScopedSessionAccess(request: ScopedSessionAccessRequest): ScopedSessionAccessGrant | undefined;
/** Minimal session row metadata needed to evaluate ownership and cross-agent access. */
type SessionVisibilityRow = {
  key: string;
  agentId?: string;
  ownerSessionKey?: string;
  spawnedBy?: string;
  parentSessionKey?: string;
};
/** List sessions spawned by the requester through the gateway session list method. */
declare function listSpawnedSessionKeys(params: {
  requesterSessionKey: string;
  limit?: number;
}): Promise<Set<string>>;
/** Resolve configured session-tool visibility, defaulting invalid or missing values to tree. */
declare function resolveSessionToolsVisibility(cfg: OpenClawConfig): SessionToolsVisibility;
/** Resolve visibility after applying sandbox clamps for spawned-session-only agents. */
declare function resolveEffectiveSessionToolsVisibility(params: {
  cfg: OpenClawConfig;
  sandboxed: boolean;
}): SessionToolsVisibility;
/** Resolve sandbox-specific session visibility clamp for agent defaults. */
declare function resolveSandboxSessionToolsVisibility(cfg: OpenClawConfig): "spawned" | "all";
/** Compile agent-to-agent allow rules into reusable matching predicates. */
declare function createAgentToAgentPolicy(cfg: OpenClawConfig): AgentToAgentPolicy;
/** Create a direct session-key visibility checker for one requester/action pair. */
declare function createSessionVisibilityCheckerImpl(params: {
  action: SessionAccessAction;
  requesterAgentId?: string;
  requesterSessionKey: string;
  visibility: SessionToolsVisibility;
  a2aPolicy: AgentToAgentPolicy;
  spawnedKeys: Set<string> | null;
}): {
  check: (targetSessionKey: string) => SessionAccessResult;
};
/** Direct-key visibility checker plus registration for narrow host-owned grants. */
declare const createSessionVisibilityChecker: typeof createSessionVisibilityCheckerImpl & {
  registerScopedAccessProvider: typeof registerScopedSessionAccessProvider;
  resolveScopedAccess: typeof resolveScopedSessionAccess;
};
/** Create a row-aware visibility checker that can use owner/spawn metadata. */
declare function createSessionVisibilityRowChecker(params: {
  action: SessionAccessAction;
  requesterAgentId?: string;
  requesterSessionKey: string;
  visibility: SessionToolsVisibility;
  a2aPolicy: AgentToAgentPolicy;
}): {
  check: (row: SessionVisibilityRow) => SessionAccessResult;
};
/** Create a visibility guard, loading spawned-session ownership when direct keys need it. */
declare function createSessionVisibilityGuard(params: {
  action: SessionAccessAction;
  requesterAgentId?: string;
  requesterSessionKey: string;
  visibility: SessionToolsVisibility;
  a2aPolicy: AgentToAgentPolicy;
}): Promise<{
  check: (targetSessionKey: string) => SessionAccessResult;
}>;
//#endregion
export { AgentToAgentPolicy, SessionAccessAction, SessionAccessResult, SessionToolsVisibility, SessionVisibilityRow, createAgentToAgentPolicy, createSessionVisibilityChecker, createSessionVisibilityGuard, createSessionVisibilityRowChecker, listSpawnedSessionKeys, resolveEffectiveSessionToolsVisibility, resolveSandboxSessionToolsVisibility, resolveSessionToolsVisibility, sessionVisibilityGatewayTesting };