import { Static, TSchema, Type } from "typebox";

//#region packages/gateway-protocol/src/schema/nodes.d.ts
/** Reasons a node can report itself alive without implying an operator action. */
declare const NodePresenceAliveReasonSchema: Type.TString;
/** Presence heartbeat payload sent by remote nodes to refresh gateway state. */
declare const NodePresenceAlivePayloadSchema: Type.TObject<{
  trigger: Type.TString;
  sentAtMs: Type.TOptional<Type.TInteger>;
  displayName: Type.TOptional<Type.TString>;
  version: Type.TOptional<Type.TString>;
  platform: Type.TOptional<Type.TString>;
  deviceFamily: Type.TOptional<Type.TString>;
  modelIdentifier: Type.TOptional<Type.TString>;
  pushTransport: Type.TOptional<Type.TString>;
}>;
/** Recent operator input activity reported by an interactive node. */
declare const NodePresenceActivityPayloadSchema: Type.TObject<{
  idleSeconds: Type.TInteger;
  saturated: Type.TOptional<Type.TBoolean>;
}>;
/** Normalized result for node-originated events after gateway dispatch. */
declare const NodeEventResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  event: Type.TString;
  handled: Type.TBoolean;
  reason: Type.TOptional<Type.TString>;
}>;
/** Lists pending node-pairing requests. */
declare const NodePairListParamsSchema: Type.TObject<{}>;
/** Approves a pending node-pairing request by request id. */
declare const NodePairApproveParamsSchema: Type.TObject<{
  requestId: Type.TString;
}>;
/** Rejects a pending node-pairing request by request id. */
declare const NodePairRejectParamsSchema: Type.TObject<{
  requestId: Type.TString;
}>;
/** Removes an already paired node from the gateway trust set. */
declare const NodePairRemoveParamsSchema: Type.TObject<{
  nodeId: Type.TString;
}>;
/** Lists paired nodes known to the gateway. */
declare const NodeListParamsSchema: Type.TObject<{}>;
/** Agent-visible tool descriptor advertised by a connected node. */
declare const NodePluginToolDescriptorSchema: Type.TObject<{
  pluginId: Type.TString;
  name: Type.TString;
  description: Type.TString;
  parameters: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  command: Type.TOptional<Type.TString>;
  mcp: Type.TOptional<Type.TObject<{
    server: Type.TString;
    tool: Type.TString;
  }>>;
}>;
/** Replaces the connected node's dynamic agent-visible plugin/MCP tool catalog. */
declare const NodePluginToolsUpdateParamsSchema: Type.TObject<{
  tools: Type.TArray<Type.TObject<{
    pluginId: Type.TString;
    name: Type.TString;
    description: Type.TString;
    parameters: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    command: Type.TOptional<Type.TString>;
    mcp: Type.TOptional<Type.TObject<{
      server: Type.TString;
      tool: Type.TString;
    }>>;
  }>>;
}>;
type NodePluginToolDescriptor = Static<typeof NodePluginToolDescriptorSchema>;
type NodePluginToolsUpdateParams = Static<typeof NodePluginToolsUpdateParamsSchema>;
/** Agent-visible skill descriptor advertised by a connected node. */
declare const NodeSkillDescriptorSchema: Type.TObject<{
  name: Type.TString;
  description: Type.TString;
  content: Type.TString;
}>;
/** Replaces the connected node's agent-visible skill catalog. */
declare const NodeSkillsUpdateParamsSchema: Type.TObject<{
  skills: Type.TArray<Type.TObject<{
    name: Type.TString;
    description: Type.TString;
    content: Type.TString;
  }>>;
}>;
type NodeSkillDescriptor = Static<typeof NodeSkillDescriptorSchema>;
type NodeSkillsUpdateParams = Static<typeof NodeSkillsUpdateParamsSchema>;
/** Acknowledges queued node work that the node has consumed. */
declare const NodePendingAckParamsSchema: Type.TObject<{
  ids: Type.TArray<Type.TString>;
}>;
/** Invokes a command on a paired node; idempotency allows safe retries. */
declare const NodeInvokeParamsSchema: Type.TObject<{
  nodeId: Type.TString;
  command: Type.TString;
  params: Type.TOptional<Type.TUnknown>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  idempotencyKey: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  turnSourceChannel: Type.TOptional<Type.TString>;
  turnSourceTo: Type.TOptional<Type.TString>;
  turnSourceAccountId: Type.TOptional<Type.TString>;
  turnSourceThreadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
}>;
/** Result callback payload for a node command invocation. */
declare const NodeInvokeResultParamsSchema: Type.TObject<{
  id: Type.TString;
  nodeId: Type.TString;
  ok: Type.TBoolean;
  payload: Type.TOptional<Type.TUnknown>;
  payloadJSON: Type.TOptional<Type.TString>;
  error: Type.TOptional<Type.TObject<{
    code: Type.TOptional<Type.TString>;
    message: Type.TOptional<Type.TString>;
  }>>;
}>;
/** Ordered UTF-8 output emitted while a node command invocation is running. */
declare const NodeInvokeProgressParamsSchema: Type.TObject<{
  invokeId: Type.TString;
  nodeId: Type.TString;
  seq: Type.TInteger;
  chunk: Type.TString;
}>;
/** Generic node event envelope accepted by the gateway. */
declare const NodeEventParamsSchema: Type.TObject<{
  event: Type.TString;
  payload: Type.TOptional<Type.TUnknown>;
  payloadJSON: Type.TOptional<Type.TString>;
}>;
/** Request for a bounded batch of queued work assigned to the calling node. */
declare const NodePendingDrainParamsSchema: Type.TObject<{
  maxItems: Type.TOptional<Type.TInteger>;
}>;
/** Drain response with a revision marker for node queue state. */
declare const NodePendingDrainResultSchema: Type.TObject<{
  nodeId: Type.TString;
  revision: Type.TInteger;
  items: Type.TArray<Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    priority: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    payload: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  }>>;
  hasMore: Type.TBoolean;
}>;
/** Enqueues gateway-initiated work for a paired node. */
declare const NodePendingEnqueueParamsSchema: Type.TObject<{
  nodeId: Type.TString;
  type: Type.TString;
  priority: Type.TOptional<Type.TString>;
  expiresInMs: Type.TOptional<Type.TInteger>;
  wake: Type.TOptional<Type.TBoolean>;
}>;
/** Enqueue result echoes queue revision and whether wake delivery was attempted. */
declare const NodePendingEnqueueResultSchema: Type.TObject<{
  nodeId: Type.TString;
  revision: Type.TInteger;
  queued: Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    priority: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    payload: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  }>;
  wakeTriggered: Type.TBoolean;
}>;
/** Ordered input frame sent by the gateway to one long-lived node invoke. */
declare const NodeInvokeInputEventSchema: Type.TObject<{
  id: Type.TString;
  nodeId: Type.TString;
  seq: Type.TInteger;
  payloadJSON: Type.TString;
}>;
type NodePairListParams = Static<typeof NodePairListParamsSchema>;
type NodePairApproveParams = Static<typeof NodePairApproveParamsSchema>;
type NodePairRejectParams = Static<typeof NodePairRejectParamsSchema>;
type NodePairRemoveParams = Static<typeof NodePairRemoveParamsSchema>;
type NodeListParams = Static<typeof NodeListParamsSchema>;
type NodeInvokeParams = Static<typeof NodeInvokeParamsSchema>;
type NodeInvokeResultParams = Static<typeof NodeInvokeResultParamsSchema>;
type NodeInvokeProgressParams = Static<typeof NodeInvokeProgressParamsSchema>;
type NodeInvokeInputEvent = Static<typeof NodeInvokeInputEventSchema>;
type NodeEventParams = Static<typeof NodeEventParamsSchema>;
type NodeEventResult = Static<typeof NodeEventResultSchema>;
type NodePresenceAlivePayload = Static<typeof NodePresenceAlivePayloadSchema>;
type NodePresenceAliveReason = Static<typeof NodePresenceAliveReasonSchema>;
type NodePresenceActivityPayload = Static<typeof NodePresenceActivityPayloadSchema>;
type NodePendingDrainParams = Static<typeof NodePendingDrainParamsSchema>;
type NodePendingDrainResult = Static<typeof NodePendingDrainResultSchema>;
type NodePendingEnqueueParams = Static<typeof NodePendingEnqueueParamsSchema>;
type NodePendingEnqueueResult = Static<typeof NodePendingEnqueueResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/validation-errors.d.ts
/** Normalized validation error shape exposed by every protocol validator. */
type ValidationError = {
  /** Failed schema keyword, when the validator can report one. */keyword?: string; /** JSON-pointer path to the failing data location. */
  instancePath?: string; /** JSON-pointer path to the failing schema location. */
  schemaPath?: string; /** Validator-specific keyword parameters for richer diagnostics. */
  params?: Record<string, unknown>; /** Human-readable validation message. */
  message?: string;
};
/** Convert validator errors into compact operator-facing failure text. */
declare function formatValidationErrors(errors: ValidationError[] | null | undefined): string;
//#endregion
//#region packages/gateway-protocol/src/protocol-validator.d.ts
/** Runtime validator shape shared by gateway clients and server handlers. */
type ProtocolValidator<T = unknown> = ((data: unknown) => data is T) & {
  errors: ValidationError[] | null; /** Original schema used by the validator, exposed for diagnostics/tests. */
  schema: unknown;
};
//#endregion
//#region packages/gateway-protocol/src/clawhub-trust-error-details.d.ts
/** Structured ClawHub trust details carried in gateway error payloads. */
declare const ClawHubTrustErrorCodes: {
  readonly SECURITY_UNAVAILABLE: "clawhub_security_unavailable";
  readonly RISK_ACKNOWLEDGEMENT_REQUIRED: "clawhub_risk_acknowledgement_required";
  readonly DOWNLOAD_BLOCKED: "clawhub_download_blocked";
};
type ClawHubTrustErrorCode = (typeof ClawHubTrustErrorCodes)[keyof typeof ClawHubTrustErrorCodes];
type ClawHubTrustErrorDetails = {
  clawhubTrustCode?: ClawHubTrustErrorCode;
  version?: string;
  warning?: string;
};
declare function isClawHubTrustErrorCode(value: unknown): value is ClawHubTrustErrorCode;
declare function buildClawHubTrustErrorDetails(params: {
  code?: ClawHubTrustErrorCode;
  version?: string;
  warning?: string;
}): ClawHubTrustErrorDetails | undefined;
declare function readClawHubTrustErrorDetails(details: unknown): ClawHubTrustErrorDetails | undefined;
//#endregion
//#region packages/gateway-protocol/src/system-agent-error-details.d.ts
/** Structured system-agent details carried in gateway error payloads. */
declare const SystemAgentErrorDetailCodes: {
  readonly SESSION_INVALIDATED: "system_agent_session_invalidated";
};
type SystemAgentSessionInvalidatedErrorDetails = {
  code: typeof SystemAgentErrorDetailCodes.SESSION_INVALIDATED;
};
declare function buildSystemAgentSessionInvalidatedErrorDetails(): SystemAgentSessionInvalidatedErrorDetails;
declare function readSystemAgentSessionInvalidatedErrorDetails(details: unknown): SystemAgentSessionInvalidatedErrorDetails | undefined;
//#endregion
//#region packages/gateway-protocol/src/gateway-error-details.d.ts
/** Gateway JSON-RPC style error codes shared by clients and server handlers. */
declare const ErrorCodes: {
  /** Client has not completed account/device linking for this gateway. */readonly NOT_LINKED: "NOT_LINKED"; /** Device exists but still needs an explicit pairing approval. */
  readonly NOT_PAIRED: "NOT_PAIRED"; /** Agent turn exceeded the gateway wait window. */
  readonly AGENT_TIMEOUT: "AGENT_TIMEOUT"; /** Request payload failed protocol validation or method preconditions. */
  readonly INVALID_REQUEST: "INVALID_REQUEST"; /** Authenticated caller lacks permission for the requested operation. */
  readonly FORBIDDEN: "FORBIDDEN"; /** Approval resolution referenced a missing or expired approval request. */
  readonly APPROVAL_NOT_FOUND: "APPROVAL_NOT_FOUND"; /** Gateway service or required backend is temporarily unavailable. */
  readonly UNAVAILABLE: "UNAVAILABLE";
};
/** Closed set of canonical gateway error code strings. */
type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
/** Stable discriminants for structured method-level authorization failures. */
declare const GatewayErrorDetailCodes: {
  readonly MISSING_SCOPE: "MISSING_SCOPE";
  readonly MCP_APP_VIEW_EXPIRED: "MCP_APP_VIEW_EXPIRED";
};
/** Missing operator-scope details shared by WebSocket and HTTP responses. */
type MissingScopeErrorDetails = {
  code: typeof GatewayErrorDetailCodes.MISSING_SCOPE;
  missingScope: string;
  requiredScopes: string[];
};
type McpAppViewExpiredErrorDetails = {
  code: typeof GatewayErrorDetailCodes.MCP_APP_VIEW_EXPIRED;
};
/** Structured details emitted by method-level authorization failures. */
type GatewayErrorDetails = MissingScopeErrorDetails | McpAppViewExpiredErrorDetails;
/** Reads validated missing-scope details from an untrusted protocol payload. */
declare function readMissingScopeErrorDetails(details: unknown): MissingScopeErrorDetails | null;
declare function isMcpAppViewExpiredError(error: unknown): boolean;
/**
 * Reads a method-level missing-scope failure, preferring structured details.
 * The message fallback keeps clients compatible with gateways predating structured details.
 */
declare function readMissingScopeError(error: unknown): MissingScopeErrorDetails | null;
//#endregion
//#region packages/gateway-protocol/src/terminal-validators.d.ts
declare const validateTerminalOpenParams: ProtocolValidator<{
  agentId?: string | undefined;
  catalog?: {
    threadId: string;
    catalogId: string;
    hostId: string;
  } | undefined;
  cols: number;
  rows: number;
}>;
declare const validateTerminalInputParams: ProtocolValidator<{
  sessionId: string;
  data: string;
}>;
declare const validateTerminalResizeParams: ProtocolValidator<{
  sessionId: string;
  cols: number;
  rows: number;
}>;
declare const validateTerminalCloseParams: ProtocolValidator<{
  sessionId: string;
}>;
declare const validateTerminalAttachParams: ProtocolValidator<{
  sessionId: string;
}>;
declare const validateTerminalTextParams: ProtocolValidator<{
  sessionId: string;
}>;
declare const validateTerminalUploadParams: ProtocolValidator<{
  sessionId: string;
  name: string;
  contentBase64: string;
}>;
declare const validateTerminalUploadResult: ProtocolValidator<{
  path: string;
  size: number;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/approval-id.d.ts
/** Whether an approval id is non-empty, path-stable, and contains no unpaired UTF-16 surrogate. */
declare function isWellFormedApprovalId(value: string): boolean;
//#endregion
//#region packages/gateway-protocol/src/schema/approvals.d.ts
/** Approval owner used to select the safe presentation payload. */
declare const ApprovalKindSchema: Type.TUnion<[Type.TLiteral<"exec">, Type.TLiteral<"plugin">, Type.TLiteral<"system-agent">]>;
/** Reviewer decisions accepted by the unified approval resolver. */
declare const ApprovalDecisionSchema: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>;
/** Reviewer decisions that permit an operation to proceed. */
declare const ApprovalAllowDecisionSchema: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>;
/** Closed reason recorded for a terminal approval transition. */
declare const ApprovalTerminalReasonSchema: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"timeout">, Type.TLiteral<"malformed-verdict">, Type.TLiteral<"no-route">, Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">, Type.TLiteral<"storage-corrupt">]>;
/** Reviewer-facing severity for plugin-owned approval requests. */
declare const PluginApprovalSeveritySchema: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
/** Redacted exec details safe to persist and render outside the requesting runtime. */
declare const ExecApprovalPresentationSchema: Type.TObject<{
  kind: Type.TLiteral<"exec">;
  commandText: Type.TString;
  commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
}>;
/** Plugin-supplied reviewer text safe to persist and render across surfaces. */
declare const PluginApprovalPresentationSchema: Type.TObject<{
  kind: Type.TLiteral<"plugin">;
  title: Type.TString;
  description: Type.TString;
  severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
  pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
}>;
/** Reviewer-safe presentation discriminated by the approval owner. */
declare const ApprovalPresentationSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"exec">;
  commandText: Type.TString;
  commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"plugin">;
  title: Type.TString;
  description: Type.TString;
  severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
  pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"system-agent">;
  title: Type.TString;
  description: Type.TString;
  proposalHash: Type.TString;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
}>]>;
/** Approval that has not yet accepted a reviewer decision. */
declare const PendingApprovalSnapshotSchema: Type.TObject<{
  status: Type.TLiteral<"pending">;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"exec">;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"plugin">;
    title: Type.TString;
    description: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"system-agent">;
    title: Type.TString;
    description: Type.TString;
    proposalHash: Type.TString;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
  }>]>;
}>;
/** Approval whose first recorded reviewer decision allows the operation. */
declare const AllowedApprovalSnapshotSchema: Type.TObject<{
  status: Type.TLiteral<"allowed">;
  decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>;
  reason: Type.TUnion<[Type.TLiteral<"user">]>;
  resolvedAtMs: Type.TInteger;
  source: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>>;
  resolver: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
  }>>;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"exec">;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"plugin">;
    title: Type.TString;
    description: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"system-agent">;
    title: Type.TString;
    description: Type.TString;
    proposalHash: Type.TString;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
  }>]>;
}>;
/** Approval whose first recorded reviewer decision denies the operation. */
declare const DeniedApprovalSnapshotSchema: Type.TObject<{
  status: Type.TLiteral<"denied">;
  decision: Type.TLiteral<"deny">;
  reason: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"malformed-verdict">, Type.TLiteral<"no-route">, Type.TLiteral<"storage-corrupt">]>;
  resolvedAtMs: Type.TInteger;
  source: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>>;
  resolver: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
  }>>;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"exec">;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"plugin">;
    title: Type.TString;
    description: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"system-agent">;
    title: Type.TString;
    description: Type.TString;
    proposalHash: Type.TString;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
  }>]>;
}>;
/** Approval that reached its deadline and therefore failed closed. */
declare const ExpiredApprovalSnapshotSchema: Type.TObject<{
  status: Type.TLiteral<"expired">;
  reason: Type.TUnion<[Type.TLiteral<"timeout">]>;
  resolvedAtMs: Type.TInteger;
  source: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>>;
  resolver: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
  }>>;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"exec">;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"plugin">;
    title: Type.TString;
    description: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"system-agent">;
    title: Type.TString;
    description: Type.TString;
    proposalHash: Type.TString;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
  }>]>;
}>;
/** Approval cancelled by its runtime owner before a reviewer decision. */
declare const CancelledApprovalSnapshotSchema: Type.TObject<{
  status: Type.TLiteral<"cancelled">;
  reason: Type.TUnion<[Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">]>;
  resolvedAtMs: Type.TInteger;
  source: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>>;
  resolver: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
  }>>;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"exec">;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"plugin">;
    title: Type.TString;
    description: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"system-agent">;
    title: Type.TString;
    description: Type.TString;
    proposalHash: Type.TString;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
  }>]>;
}>;
/** Durable approval projection returned identically to every authorized surface. */
declare const ApprovalSnapshotSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"pending">;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"exec">;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"plugin">;
    title: Type.TString;
    description: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"system-agent">;
    title: Type.TString;
    description: Type.TString;
    proposalHash: Type.TString;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
  }>]>;
}>, Type.TObject<{
  status: Type.TLiteral<"allowed">;
  decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>;
  reason: Type.TUnion<[Type.TLiteral<"user">]>;
  resolvedAtMs: Type.TInteger;
  source: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>>;
  resolver: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
  }>>;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"exec">;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"plugin">;
    title: Type.TString;
    description: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"system-agent">;
    title: Type.TString;
    description: Type.TString;
    proposalHash: Type.TString;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
  }>]>;
}>, Type.TObject<{
  status: Type.TLiteral<"denied">;
  decision: Type.TLiteral<"deny">;
  reason: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"malformed-verdict">, Type.TLiteral<"no-route">, Type.TLiteral<"storage-corrupt">]>;
  resolvedAtMs: Type.TInteger;
  source: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>>;
  resolver: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
  }>>;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"exec">;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"plugin">;
    title: Type.TString;
    description: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"system-agent">;
    title: Type.TString;
    description: Type.TString;
    proposalHash: Type.TString;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
  }>]>;
}>, Type.TObject<{
  status: Type.TLiteral<"expired">;
  reason: Type.TUnion<[Type.TLiteral<"timeout">]>;
  resolvedAtMs: Type.TInteger;
  source: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>>;
  resolver: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
  }>>;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"exec">;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"plugin">;
    title: Type.TString;
    description: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"system-agent">;
    title: Type.TString;
    description: Type.TString;
    proposalHash: Type.TString;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
  }>]>;
}>, Type.TObject<{
  status: Type.TLiteral<"cancelled">;
  reason: Type.TUnion<[Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">]>;
  resolvedAtMs: Type.TInteger;
  source: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>>;
  resolver: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
  }>>;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"exec">;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"plugin">;
    title: Type.TString;
    description: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"system-agent">;
    title: Type.TString;
    description: Type.TString;
    proposalHash: Type.TString;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
  }>]>;
}>]>;
/** Durable terminal approval state returned after a resolution attempt. */
declare const TerminalApprovalSnapshotSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"allowed">;
  decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>;
  reason: Type.TUnion<[Type.TLiteral<"user">]>;
  resolvedAtMs: Type.TInteger;
  source: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>>;
  resolver: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
  }>>;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"exec">;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"plugin">;
    title: Type.TString;
    description: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"system-agent">;
    title: Type.TString;
    description: Type.TString;
    proposalHash: Type.TString;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
  }>]>;
}>, Type.TObject<{
  status: Type.TLiteral<"denied">;
  decision: Type.TLiteral<"deny">;
  reason: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"malformed-verdict">, Type.TLiteral<"no-route">, Type.TLiteral<"storage-corrupt">]>;
  resolvedAtMs: Type.TInteger;
  source: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>>;
  resolver: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
  }>>;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"exec">;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"plugin">;
    title: Type.TString;
    description: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"system-agent">;
    title: Type.TString;
    description: Type.TString;
    proposalHash: Type.TString;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
  }>]>;
}>, Type.TObject<{
  status: Type.TLiteral<"expired">;
  reason: Type.TUnion<[Type.TLiteral<"timeout">]>;
  resolvedAtMs: Type.TInteger;
  source: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>>;
  resolver: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
  }>>;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"exec">;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"plugin">;
    title: Type.TString;
    description: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"system-agent">;
    title: Type.TString;
    description: Type.TString;
    proposalHash: Type.TString;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
  }>]>;
}>, Type.TObject<{
  status: Type.TLiteral<"cancelled">;
  reason: Type.TUnion<[Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">]>;
  resolvedAtMs: Type.TInteger;
  source: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>>;
  resolver: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
  }>>;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"exec">;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"plugin">;
    title: Type.TString;
    description: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"system-agent">;
    title: Type.TString;
    description: Type.TString;
    proposalHash: Type.TString;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
  }>]>;
}>]>;
/** Lookup payload for one approval by its exact full id. */
declare const ApprovalGetParamsSchema: Type.TObject<{
  id: Type.TString;
}>;
/** Current durable state for one authorized approval lookup. */
declare const ApprovalGetResultSchema: Type.TObject<{
  approval: Type.TUnion<[Type.TObject<{
    status: Type.TLiteral<"pending">;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>, Type.TObject<{
    status: Type.TLiteral<"allowed">;
    decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>;
    reason: Type.TUnion<[Type.TLiteral<"user">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>, Type.TObject<{
    status: Type.TLiteral<"denied">;
    decision: Type.TLiteral<"deny">;
    reason: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"malformed-verdict">, Type.TLiteral<"no-route">, Type.TLiteral<"storage-corrupt">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>, Type.TObject<{
    status: Type.TLiteral<"expired">;
    reason: Type.TUnion<[Type.TLiteral<"timeout">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>, Type.TObject<{
    status: Type.TLiteral<"cancelled">;
    reason: Type.TUnion<[Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>]>;
}>;
/** Cursor-based query for the retained terminal approval ledger. */
declare const ApprovalHistoryParamsSchema: Type.TObject<{
  cursor: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
  kind: Type.TOptional<Type.TUnion<[Type.TLiteral<"exec">, Type.TLiteral<"plugin">, Type.TLiteral<"system-agent">]>>;
}>;
/** Newest-first page from the retained terminal approval ledger. */
declare const ApprovalHistoryResultSchema: Type.TObject<{
  items: Type.TArray<Type.TUnion<[Type.TObject<{
    status: Type.TLiteral<"allowed">;
    decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>;
    reason: Type.TUnion<[Type.TLiteral<"user">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>, Type.TObject<{
    status: Type.TLiteral<"denied">;
    decision: Type.TLiteral<"deny">;
    reason: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"malformed-verdict">, Type.TLiteral<"no-route">, Type.TLiteral<"storage-corrupt">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>, Type.TObject<{
    status: Type.TLiteral<"expired">;
    reason: Type.TUnion<[Type.TLiteral<"timeout">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>, Type.TObject<{
    status: Type.TLiteral<"cancelled">;
    reason: Type.TUnion<[Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>]>>;
  nextCursor: Type.TOptional<Type.TString>;
}>;
/** Reviewer decision for one approval identified by its exact full id. */
declare const ApprovalResolveParamsSchema: Type.TObject<{
  id: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"exec">, Type.TLiteral<"plugin">, Type.TLiteral<"system-agent">]>;
  decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>;
}>;
/** First-answer outcome plus the canonical recorded state returned to all contenders. */
declare const ApprovalResolveResultSchema: Type.TObject<{
  applied: Type.TBoolean;
  approval: Type.TUnion<[Type.TObject<{
    status: Type.TLiteral<"allowed">;
    decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>;
    reason: Type.TUnion<[Type.TLiteral<"user">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>, Type.TObject<{
    status: Type.TLiteral<"denied">;
    decision: Type.TLiteral<"deny">;
    reason: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"malformed-verdict">, Type.TLiteral<"no-route">, Type.TLiteral<"storage-corrupt">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>, Type.TObject<{
    status: Type.TLiteral<"expired">;
    reason: Type.TUnion<[Type.TLiteral<"timeout">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>, Type.TObject<{
    status: Type.TLiteral<"cancelled">;
    reason: Type.TUnion<[Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>]>;
}>;
/** Sanitized approval transition delivered only to an opted-in session audience. */
declare const SessionApprovalEventSchema: Type.TUnion<[Type.TObject<{
  phase: Type.TLiteral<"pending">;
  approval: Type.TObject<{
    status: Type.TLiteral<"pending">;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>;
  sessionKey: Type.TString;
  sourceSessionKey: Type.TOptional<Type.TString>;
  updatedAtMs: Type.TInteger;
}>, Type.TObject<{
  phase: Type.TLiteral<"terminal">;
  approval: Type.TUnion<[Type.TObject<{
    status: Type.TLiteral<"allowed">;
    decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>;
    reason: Type.TUnion<[Type.TLiteral<"user">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>, Type.TObject<{
    status: Type.TLiteral<"denied">;
    decision: Type.TLiteral<"deny">;
    reason: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"malformed-verdict">, Type.TLiteral<"no-route">, Type.TLiteral<"storage-corrupt">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>, Type.TObject<{
    status: Type.TLiteral<"expired">;
    reason: Type.TUnion<[Type.TLiteral<"timeout">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>, Type.TObject<{
    status: Type.TLiteral<"cancelled">;
    reason: Type.TUnion<[Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>]>;
  sessionKey: Type.TString;
  sourceSessionKey: Type.TOptional<Type.TString>;
  updatedAtMs: Type.TInteger;
}>]>;
/** Authoritative pending approval set returned when a session stream subscribes. */
declare const SessionApprovalReplaySchema: Type.TObject<{
  sessionKey: Type.TString;
  updatedAtMs: Type.TInteger;
  approvals: Type.TArray<Type.TObject<{
    status: Type.TLiteral<"pending">;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>>;
  truncated: Type.TBoolean;
}>;
type ApprovalKind = Static<typeof ApprovalKindSchema>;
type ApprovalDecision = Static<typeof ApprovalDecisionSchema>;
type ApprovalAllowDecision = Static<typeof ApprovalAllowDecisionSchema>;
type ApprovalTerminalReason = Static<typeof ApprovalTerminalReasonSchema>;
type PluginApprovalSeverity = Static<typeof PluginApprovalSeveritySchema>;
type ExecApprovalPresentation = Static<typeof ExecApprovalPresentationSchema>;
type PluginApprovalPresentation = Static<typeof PluginApprovalPresentationSchema>;
type ApprovalPresentation = Static<typeof ApprovalPresentationSchema>;
type PendingApprovalSnapshot = Static<typeof PendingApprovalSnapshotSchema>;
type ApprovalSnapshot = Static<typeof ApprovalSnapshotSchema>;
type ApprovalGetParams = Static<typeof ApprovalGetParamsSchema>;
type ApprovalGetResult = Static<typeof ApprovalGetResultSchema>;
type ApprovalHistoryParams = Static<typeof ApprovalHistoryParamsSchema>;
type ApprovalHistoryResult = Static<typeof ApprovalHistoryResultSchema>;
type ApprovalResolveParams = Static<typeof ApprovalResolveParamsSchema>;
type ApprovalResolveResult = Static<typeof ApprovalResolveResultSchema>;
type AllowedApprovalSnapshot = Static<typeof AllowedApprovalSnapshotSchema>;
type DeniedApprovalSnapshot = Static<typeof DeniedApprovalSnapshotSchema>;
type ExpiredApprovalSnapshot = Static<typeof ExpiredApprovalSnapshotSchema>;
type CancelledApprovalSnapshot = Static<typeof CancelledApprovalSnapshotSchema>;
type TerminalApprovalSnapshot = Static<typeof TerminalApprovalSnapshotSchema>;
type SessionApprovalEvent = Static<typeof SessionApprovalEventSchema>;
type SessionApprovalReplay = Static<typeof SessionApprovalReplaySchema>;
//#endregion
//#region packages/gateway-protocol/src/approval-result-validators.d.ts
declare const validateApprovalGetResult: ProtocolValidator<{
  approval: {
    id: string;
    status: "pending";
    presentation: {
      agentId?: string | null | undefined;
      host?: string | null | undefined;
      nodeId?: string | null | undefined;
      commandPreview?: string | null | undefined;
      warningText?: string | null | undefined;
      kind: "exec";
      commandText: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
    } | {
      agentId?: string | null | undefined;
      toolName?: string | null | undefined;
      pluginId?: string | null | undefined;
      kind: "plugin";
      title: string;
      description: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      severity: "info" | "warning" | "critical";
    } | {
      agentId?: string | null | undefined;
      kind: "system-agent";
      title: string;
      description: string;
      allowedDecisions: ["allow-once", "deny"];
      proposalHash: string;
    };
    urlPath: string;
    createdAtMs: number;
    expiresAtMs: number;
  } | {
    source?: {
      agentId?: string | undefined;
      sessionKey?: string | undefined;
    } | undefined;
    resolver?: {
      id?: string | undefined;
      kind: "device" | "channel" | "runtime" | "system";
    } | undefined;
    id: string;
    status: "allowed";
    reason: "user";
    decision: "allow-once" | "allow-always";
    presentation: {
      agentId?: string | null | undefined;
      host?: string | null | undefined;
      nodeId?: string | null | undefined;
      commandPreview?: string | null | undefined;
      warningText?: string | null | undefined;
      kind: "exec";
      commandText: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
    } | {
      agentId?: string | null | undefined;
      toolName?: string | null | undefined;
      pluginId?: string | null | undefined;
      kind: "plugin";
      title: string;
      description: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      severity: "info" | "warning" | "critical";
    } | {
      agentId?: string | null | undefined;
      kind: "system-agent";
      title: string;
      description: string;
      allowedDecisions: ["allow-once", "deny"];
      proposalHash: string;
    };
    urlPath: string;
    createdAtMs: number;
    expiresAtMs: number;
    resolvedAtMs: number;
  } | {
    source?: {
      agentId?: string | undefined;
      sessionKey?: string | undefined;
    } | undefined;
    resolver?: {
      id?: string | undefined;
      kind: "device" | "channel" | "runtime" | "system";
    } | undefined;
    id: string;
    status: "denied";
    reason: "user" | "malformed-verdict" | "no-route" | "storage-corrupt";
    decision: "deny";
    presentation: {
      agentId?: string | null | undefined;
      host?: string | null | undefined;
      nodeId?: string | null | undefined;
      commandPreview?: string | null | undefined;
      warningText?: string | null | undefined;
      kind: "exec";
      commandText: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
    } | {
      agentId?: string | null | undefined;
      toolName?: string | null | undefined;
      pluginId?: string | null | undefined;
      kind: "plugin";
      title: string;
      description: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      severity: "info" | "warning" | "critical";
    } | {
      agentId?: string | null | undefined;
      kind: "system-agent";
      title: string;
      description: string;
      allowedDecisions: ["allow-once", "deny"];
      proposalHash: string;
    };
    urlPath: string;
    createdAtMs: number;
    expiresAtMs: number;
    resolvedAtMs: number;
  } | {
    source?: {
      agentId?: string | undefined;
      sessionKey?: string | undefined;
    } | undefined;
    resolver?: {
      id?: string | undefined;
      kind: "device" | "channel" | "runtime" | "system";
    } | undefined;
    id: string;
    status: "expired";
    reason: "timeout";
    presentation: {
      agentId?: string | null | undefined;
      host?: string | null | undefined;
      nodeId?: string | null | undefined;
      commandPreview?: string | null | undefined;
      warningText?: string | null | undefined;
      kind: "exec";
      commandText: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
    } | {
      agentId?: string | null | undefined;
      toolName?: string | null | undefined;
      pluginId?: string | null | undefined;
      kind: "plugin";
      title: string;
      description: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      severity: "info" | "warning" | "critical";
    } | {
      agentId?: string | null | undefined;
      kind: "system-agent";
      title: string;
      description: string;
      allowedDecisions: ["allow-once", "deny"];
      proposalHash: string;
    };
    urlPath: string;
    createdAtMs: number;
    expiresAtMs: number;
    resolvedAtMs: number;
  } | {
    source?: {
      agentId?: string | undefined;
      sessionKey?: string | undefined;
    } | undefined;
    resolver?: {
      id?: string | undefined;
      kind: "device" | "channel" | "runtime" | "system";
    } | undefined;
    id: string;
    status: "cancelled";
    reason: "run-aborted" | "gateway-restart";
    presentation: {
      agentId?: string | null | undefined;
      host?: string | null | undefined;
      nodeId?: string | null | undefined;
      commandPreview?: string | null | undefined;
      warningText?: string | null | undefined;
      kind: "exec";
      commandText: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
    } | {
      agentId?: string | null | undefined;
      toolName?: string | null | undefined;
      pluginId?: string | null | undefined;
      kind: "plugin";
      title: string;
      description: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      severity: "info" | "warning" | "critical";
    } | {
      agentId?: string | null | undefined;
      kind: "system-agent";
      title: string;
      description: string;
      allowedDecisions: ["allow-once", "deny"];
      proposalHash: string;
    };
    urlPath: string;
    createdAtMs: number;
    expiresAtMs: number;
    resolvedAtMs: number;
  };
}>;
declare const validateApprovalHistoryResult: ProtocolValidator<{
  nextCursor?: string | undefined;
  items: ({
    source?: {
      agentId?: string | undefined;
      sessionKey?: string | undefined;
    } | undefined;
    resolver?: {
      id?: string | undefined;
      kind: "device" | "channel" | "runtime" | "system";
    } | undefined;
    id: string;
    status: "allowed";
    reason: "user";
    decision: "allow-once" | "allow-always";
    presentation: {
      agentId?: string | null | undefined;
      host?: string | null | undefined;
      nodeId?: string | null | undefined;
      commandPreview?: string | null | undefined;
      warningText?: string | null | undefined;
      kind: "exec";
      commandText: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
    } | {
      agentId?: string | null | undefined;
      toolName?: string | null | undefined;
      pluginId?: string | null | undefined;
      kind: "plugin";
      title: string;
      description: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      severity: "info" | "warning" | "critical";
    } | {
      agentId?: string | null | undefined;
      kind: "system-agent";
      title: string;
      description: string;
      allowedDecisions: ["allow-once", "deny"];
      proposalHash: string;
    };
    urlPath: string;
    createdAtMs: number;
    expiresAtMs: number;
    resolvedAtMs: number;
  } | {
    source?: {
      agentId?: string | undefined;
      sessionKey?: string | undefined;
    } | undefined;
    resolver?: {
      id?: string | undefined;
      kind: "device" | "channel" | "runtime" | "system";
    } | undefined;
    id: string;
    status: "denied";
    reason: "user" | "malformed-verdict" | "no-route" | "storage-corrupt";
    decision: "deny";
    presentation: {
      agentId?: string | null | undefined;
      host?: string | null | undefined;
      nodeId?: string | null | undefined;
      commandPreview?: string | null | undefined;
      warningText?: string | null | undefined;
      kind: "exec";
      commandText: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
    } | {
      agentId?: string | null | undefined;
      toolName?: string | null | undefined;
      pluginId?: string | null | undefined;
      kind: "plugin";
      title: string;
      description: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      severity: "info" | "warning" | "critical";
    } | {
      agentId?: string | null | undefined;
      kind: "system-agent";
      title: string;
      description: string;
      allowedDecisions: ["allow-once", "deny"];
      proposalHash: string;
    };
    urlPath: string;
    createdAtMs: number;
    expiresAtMs: number;
    resolvedAtMs: number;
  } | {
    source?: {
      agentId?: string | undefined;
      sessionKey?: string | undefined;
    } | undefined;
    resolver?: {
      id?: string | undefined;
      kind: "device" | "channel" | "runtime" | "system";
    } | undefined;
    id: string;
    status: "expired";
    reason: "timeout";
    presentation: {
      agentId?: string | null | undefined;
      host?: string | null | undefined;
      nodeId?: string | null | undefined;
      commandPreview?: string | null | undefined;
      warningText?: string | null | undefined;
      kind: "exec";
      commandText: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
    } | {
      agentId?: string | null | undefined;
      toolName?: string | null | undefined;
      pluginId?: string | null | undefined;
      kind: "plugin";
      title: string;
      description: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      severity: "info" | "warning" | "critical";
    } | {
      agentId?: string | null | undefined;
      kind: "system-agent";
      title: string;
      description: string;
      allowedDecisions: ["allow-once", "deny"];
      proposalHash: string;
    };
    urlPath: string;
    createdAtMs: number;
    expiresAtMs: number;
    resolvedAtMs: number;
  } | {
    source?: {
      agentId?: string | undefined;
      sessionKey?: string | undefined;
    } | undefined;
    resolver?: {
      id?: string | undefined;
      kind: "device" | "channel" | "runtime" | "system";
    } | undefined;
    id: string;
    status: "cancelled";
    reason: "run-aborted" | "gateway-restart";
    presentation: {
      agentId?: string | null | undefined;
      host?: string | null | undefined;
      nodeId?: string | null | undefined;
      commandPreview?: string | null | undefined;
      warningText?: string | null | undefined;
      kind: "exec";
      commandText: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
    } | {
      agentId?: string | null | undefined;
      toolName?: string | null | undefined;
      pluginId?: string | null | undefined;
      kind: "plugin";
      title: string;
      description: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      severity: "info" | "warning" | "critical";
    } | {
      agentId?: string | null | undefined;
      kind: "system-agent";
      title: string;
      description: string;
      allowedDecisions: ["allow-once", "deny"];
      proposalHash: string;
    };
    urlPath: string;
    createdAtMs: number;
    expiresAtMs: number;
    resolvedAtMs: number;
  })[];
}>;
declare const validateApprovalResolveResult: ProtocolValidator<{
  approval: {
    source?: {
      agentId?: string | undefined;
      sessionKey?: string | undefined;
    } | undefined;
    resolver?: {
      id?: string | undefined;
      kind: "device" | "channel" | "runtime" | "system";
    } | undefined;
    id: string;
    status: "allowed";
    reason: "user";
    decision: "allow-once" | "allow-always";
    presentation: {
      agentId?: string | null | undefined;
      host?: string | null | undefined;
      nodeId?: string | null | undefined;
      commandPreview?: string | null | undefined;
      warningText?: string | null | undefined;
      kind: "exec";
      commandText: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
    } | {
      agentId?: string | null | undefined;
      toolName?: string | null | undefined;
      pluginId?: string | null | undefined;
      kind: "plugin";
      title: string;
      description: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      severity: "info" | "warning" | "critical";
    } | {
      agentId?: string | null | undefined;
      kind: "system-agent";
      title: string;
      description: string;
      allowedDecisions: ["allow-once", "deny"];
      proposalHash: string;
    };
    urlPath: string;
    createdAtMs: number;
    expiresAtMs: number;
    resolvedAtMs: number;
  } | {
    source?: {
      agentId?: string | undefined;
      sessionKey?: string | undefined;
    } | undefined;
    resolver?: {
      id?: string | undefined;
      kind: "device" | "channel" | "runtime" | "system";
    } | undefined;
    id: string;
    status: "denied";
    reason: "user" | "malformed-verdict" | "no-route" | "storage-corrupt";
    decision: "deny";
    presentation: {
      agentId?: string | null | undefined;
      host?: string | null | undefined;
      nodeId?: string | null | undefined;
      commandPreview?: string | null | undefined;
      warningText?: string | null | undefined;
      kind: "exec";
      commandText: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
    } | {
      agentId?: string | null | undefined;
      toolName?: string | null | undefined;
      pluginId?: string | null | undefined;
      kind: "plugin";
      title: string;
      description: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      severity: "info" | "warning" | "critical";
    } | {
      agentId?: string | null | undefined;
      kind: "system-agent";
      title: string;
      description: string;
      allowedDecisions: ["allow-once", "deny"];
      proposalHash: string;
    };
    urlPath: string;
    createdAtMs: number;
    expiresAtMs: number;
    resolvedAtMs: number;
  } | {
    source?: {
      agentId?: string | undefined;
      sessionKey?: string | undefined;
    } | undefined;
    resolver?: {
      id?: string | undefined;
      kind: "device" | "channel" | "runtime" | "system";
    } | undefined;
    id: string;
    status: "expired";
    reason: "timeout";
    presentation: {
      agentId?: string | null | undefined;
      host?: string | null | undefined;
      nodeId?: string | null | undefined;
      commandPreview?: string | null | undefined;
      warningText?: string | null | undefined;
      kind: "exec";
      commandText: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
    } | {
      agentId?: string | null | undefined;
      toolName?: string | null | undefined;
      pluginId?: string | null | undefined;
      kind: "plugin";
      title: string;
      description: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      severity: "info" | "warning" | "critical";
    } | {
      agentId?: string | null | undefined;
      kind: "system-agent";
      title: string;
      description: string;
      allowedDecisions: ["allow-once", "deny"];
      proposalHash: string;
    };
    urlPath: string;
    createdAtMs: number;
    expiresAtMs: number;
    resolvedAtMs: number;
  } | {
    source?: {
      agentId?: string | undefined;
      sessionKey?: string | undefined;
    } | undefined;
    resolver?: {
      id?: string | undefined;
      kind: "device" | "channel" | "runtime" | "system";
    } | undefined;
    id: string;
    status: "cancelled";
    reason: "run-aborted" | "gateway-restart";
    presentation: {
      agentId?: string | null | undefined;
      host?: string | null | undefined;
      nodeId?: string | null | undefined;
      commandPreview?: string | null | undefined;
      warningText?: string | null | undefined;
      kind: "exec";
      commandText: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
    } | {
      agentId?: string | null | undefined;
      toolName?: string | null | undefined;
      pluginId?: string | null | undefined;
      kind: "plugin";
      title: string;
      description: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      severity: "info" | "warning" | "critical";
    } | {
      agentId?: string | null | undefined;
      kind: "system-agent";
      title: string;
      description: string;
      allowedDecisions: ["allow-once", "deny"];
      proposalHash: string;
    };
    urlPath: string;
    createdAtMs: number;
    expiresAtMs: number;
    resolvedAtMs: number;
  };
  applied: boolean;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-inference.d.ts
declare const WORKER_INFERENCE_PROTOCOL_FEATURE = "worker-inference-v1";
declare const WORKER_INFERENCE_METHODS: readonly ["worker.inference.start", "worker.inference.cancel"];
declare const WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES: number;
declare const WORKER_INFERENCE_MAX_CONTEXT_MESSAGES = 1024;
declare const WORKER_INFERENCE_MAX_OUTPUT_TOKENS = 1000000;
declare const WorkerInferenceModelRefSchema: Type.TObject<{
  readonly provider: Type.TString;
  readonly model: Type.TString;
}>;
declare const WorkerInferenceContextSchema: Type.TObject<{
  readonly systemPrompt: Type.TOptional<Type.TString>;
  readonly messages: Type.TArray<Type.TUnion<[Type.TObject<{
    readonly role: Type.TLiteral<"user">;
    readonly content: Type.TUnion<[Type.TString, Type.TArray<Type.TUnion<[Type.TObject<{
      readonly type: Type.TLiteral<"text">;
      readonly text: Type.TString;
      readonly textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"image">;
      readonly data: Type.TString;
      readonly mimeType: Type.TString;
    }>]>>]>;
    readonly timestamp: Type.TInteger;
    readonly runtimeContextCarrier: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    readonly diagnostics: Type.TOptional<Type.TArray<Type.TObject<{
      type: Type.TString;
      timestamp: Type.TInteger;
      error: Type.TOptional<Type.TObject<{
        name: Type.TOptional<Type.TString>;
        message: Type.TString;
        stack: Type.TOptional<Type.TString>;
        code: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
      }>>;
      details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    }>>>;
    readonly stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">, Type.TLiteral<"error">, Type.TLiteral<"aborted">]>;
    readonly errorMessage: Type.TOptional<Type.TString>;
    readonly errorCode: Type.TOptional<Type.TString>;
    readonly errorType: Type.TOptional<Type.TString>;
    readonly errorBody: Type.TOptional<Type.TString>;
    readonly role: Type.TLiteral<"assistant">;
    readonly content: Type.TArray<Type.TUnion<[Type.TObject<{
      readonly type: Type.TLiteral<"text">;
      readonly text: Type.TString;
      readonly textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"thinking">;
      readonly thinking: Type.TString;
      readonly thinkingSignature: Type.TOptional<Type.TString>;
      readonly redacted: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"toolCall">;
      readonly id: Type.TString;
      readonly name: Type.TString;
      readonly arguments: Type.TRecord<"^.*$", Type.TUnknown>;
      readonly thoughtSignature: Type.TOptional<Type.TString>;
      readonly executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
    }>]>>;
    readonly api: Type.TString;
    readonly provider: Type.TString;
    readonly model: Type.TString;
    readonly responseModel: Type.TOptional<Type.TString>;
    readonly responseId: Type.TOptional<Type.TString>;
    readonly usage: Type.TObject<{
      input: Type.TNumber;
      output: Type.TNumber;
      cacheRead: Type.TNumber;
      cacheWrite: Type.TNumber;
      contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
        state: Type.TLiteral<"available">;
        promptTokens: Type.TNumber;
        totalTokens: Type.TNumber;
      }>, Type.TObject<{
        state: Type.TLiteral<"unavailable">;
      }>]>>;
      totalTokens: Type.TNumber;
      cost: Type.TObject<{
        input: Type.TNumber;
        output: Type.TNumber;
        cacheRead: Type.TNumber;
        cacheWrite: Type.TNumber;
        total: Type.TNumber;
        totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
      }>;
    }>;
    readonly timestamp: Type.TInteger;
  }>, Type.TObject<{
    readonly role: Type.TLiteral<"toolResult">;
    readonly toolCallId: Type.TString;
    readonly toolName: Type.TString;
    readonly content: Type.TArray<Type.TUnion<[Type.TObject<{
      readonly type: Type.TLiteral<"text">;
      readonly text: Type.TString;
      readonly textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"image">;
      readonly data: Type.TString;
      readonly mimeType: Type.TString;
    }>]>>;
    readonly details: Type.TOptional<Type.TUnknown>;
    readonly isError: Type.TBoolean;
    readonly timestamp: Type.TInteger;
  }>]>>;
  readonly tools: Type.TOptional<Type.TArray<Type.TObject<{
    readonly name: Type.TString;
    readonly description: Type.TString;
    readonly parameters: Type.TUnknown;
  }>>>;
}>;
declare const WorkerInferenceOptionsSchema: Type.TObject<{
  readonly temperature: Type.TOptional<Type.TNumber>;
  readonly maxTokens: Type.TOptional<Type.TInteger>;
  readonly reasoning: Type.TOptional<Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"minimal">, Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">, Type.TLiteral<"xhigh">, Type.TLiteral<"adaptive">, Type.TLiteral<"max">]>>;
  readonly thinkingBudgets: Type.TOptional<Type.TObject<{
    readonly minimal: Type.TOptional<Type.TInteger>;
    readonly low: Type.TOptional<Type.TInteger>;
    readonly medium: Type.TOptional<Type.TInteger>;
    readonly high: Type.TOptional<Type.TInteger>;
    readonly max: Type.TOptional<Type.TInteger>;
  }>>;
}>;
declare const WorkerInferenceStartParamsSchema: Type.TObject<{
  readonly modelRef: Type.TObject<{
    readonly provider: Type.TString;
    readonly model: Type.TString;
  }>;
  readonly context: Type.TObject<{
    readonly systemPrompt: Type.TOptional<Type.TString>;
    readonly messages: Type.TArray<Type.TUnion<[Type.TObject<{
      readonly role: Type.TLiteral<"user">;
      readonly content: Type.TUnion<[Type.TString, Type.TArray<Type.TUnion<[Type.TObject<{
        readonly type: Type.TLiteral<"text">;
        readonly text: Type.TString;
        readonly textSignature: Type.TOptional<Type.TString>;
      }>, Type.TObject<{
        readonly type: Type.TLiteral<"image">;
        readonly data: Type.TString;
        readonly mimeType: Type.TString;
      }>]>>]>;
      readonly timestamp: Type.TInteger;
      readonly runtimeContextCarrier: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      readonly diagnostics: Type.TOptional<Type.TArray<Type.TObject<{
        type: Type.TString;
        timestamp: Type.TInteger;
        error: Type.TOptional<Type.TObject<{
          name: Type.TOptional<Type.TString>;
          message: Type.TString;
          stack: Type.TOptional<Type.TString>;
          code: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
        }>>;
        details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
      }>>>;
      readonly stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">, Type.TLiteral<"error">, Type.TLiteral<"aborted">]>;
      readonly errorMessage: Type.TOptional<Type.TString>;
      readonly errorCode: Type.TOptional<Type.TString>;
      readonly errorType: Type.TOptional<Type.TString>;
      readonly errorBody: Type.TOptional<Type.TString>;
      readonly role: Type.TLiteral<"assistant">;
      readonly content: Type.TArray<Type.TUnion<[Type.TObject<{
        readonly type: Type.TLiteral<"text">;
        readonly text: Type.TString;
        readonly textSignature: Type.TOptional<Type.TString>;
      }>, Type.TObject<{
        readonly type: Type.TLiteral<"thinking">;
        readonly thinking: Type.TString;
        readonly thinkingSignature: Type.TOptional<Type.TString>;
        readonly redacted: Type.TOptional<Type.TBoolean>;
      }>, Type.TObject<{
        readonly type: Type.TLiteral<"toolCall">;
        readonly id: Type.TString;
        readonly name: Type.TString;
        readonly arguments: Type.TRecord<"^.*$", Type.TUnknown>;
        readonly thoughtSignature: Type.TOptional<Type.TString>;
        readonly executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
      }>]>>;
      readonly api: Type.TString;
      readonly provider: Type.TString;
      readonly model: Type.TString;
      readonly responseModel: Type.TOptional<Type.TString>;
      readonly responseId: Type.TOptional<Type.TString>;
      readonly usage: Type.TObject<{
        input: Type.TNumber;
        output: Type.TNumber;
        cacheRead: Type.TNumber;
        cacheWrite: Type.TNumber;
        contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
          state: Type.TLiteral<"available">;
          promptTokens: Type.TNumber;
          totalTokens: Type.TNumber;
        }>, Type.TObject<{
          state: Type.TLiteral<"unavailable">;
        }>]>>;
        totalTokens: Type.TNumber;
        cost: Type.TObject<{
          input: Type.TNumber;
          output: Type.TNumber;
          cacheRead: Type.TNumber;
          cacheWrite: Type.TNumber;
          total: Type.TNumber;
          totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
        }>;
      }>;
      readonly timestamp: Type.TInteger;
    }>, Type.TObject<{
      readonly role: Type.TLiteral<"toolResult">;
      readonly toolCallId: Type.TString;
      readonly toolName: Type.TString;
      readonly content: Type.TArray<Type.TUnion<[Type.TObject<{
        readonly type: Type.TLiteral<"text">;
        readonly text: Type.TString;
        readonly textSignature: Type.TOptional<Type.TString>;
      }>, Type.TObject<{
        readonly type: Type.TLiteral<"image">;
        readonly data: Type.TString;
        readonly mimeType: Type.TString;
      }>]>>;
      readonly details: Type.TOptional<Type.TUnknown>;
      readonly isError: Type.TBoolean;
      readonly timestamp: Type.TInteger;
    }>]>>;
    readonly tools: Type.TOptional<Type.TArray<Type.TObject<{
      readonly name: Type.TString;
      readonly description: Type.TString;
      readonly parameters: Type.TUnknown;
    }>>>;
  }>;
  readonly options: Type.TObject<{
    readonly temperature: Type.TOptional<Type.TNumber>;
    readonly maxTokens: Type.TOptional<Type.TInteger>;
    readonly reasoning: Type.TOptional<Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"minimal">, Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">, Type.TLiteral<"xhigh">, Type.TLiteral<"adaptive">, Type.TLiteral<"max">]>>;
    readonly thinkingBudgets: Type.TOptional<Type.TObject<{
      readonly minimal: Type.TOptional<Type.TInteger>;
      readonly low: Type.TOptional<Type.TInteger>;
      readonly medium: Type.TOptional<Type.TInteger>;
      readonly high: Type.TOptional<Type.TInteger>;
      readonly max: Type.TOptional<Type.TInteger>;
    }>>;
  }>;
  readonly runEpoch: Type.TInteger;
  readonly sessionId: Type.TString;
  readonly runId: Type.TString;
  readonly turnId: Type.TString;
}>;
declare const WorkerInferenceStartResultSchema: Type.TObject<{
  readonly status: Type.TUnion<[Type.TLiteral<"accepted">, Type.TLiteral<"replayed">]>;
}>;
declare const WorkerInferenceErrorReasonSchema: Type.TUnion<[Type.TLiteral<"model-not-approved">, Type.TLiteral<"invalid-context">, Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"session-not-attached">, Type.TLiteral<"provider-error">, Type.TLiteral<"cancelled">]>;
declare const WorkerInferenceErrorShapeSchema: Type.TObject<{
  readonly code: Type.TUnion<[Type.TLiteral<"INVALID_REQUEST">, Type.TLiteral<"UNAVAILABLE">]>;
  readonly message: Type.TString;
  readonly details: Type.TObject<{
    readonly reason: Type.TUnion<[Type.TLiteral<"model-not-approved">, Type.TLiteral<"invalid-context">, Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"session-not-attached">, Type.TLiteral<"provider-error">, Type.TLiteral<"cancelled">]>;
  }>;
}>;
declare const WorkerInferenceStartRequestFrameSchema: Type.TObject<{
  readonly type: Type.TLiteral<"req">;
  readonly id: Type.TString;
  readonly method: Type.TLiteral<"worker.inference.start">;
  readonly params: Type.TObject<{
    readonly modelRef: Type.TObject<{
      readonly provider: Type.TString;
      readonly model: Type.TString;
    }>;
    readonly context: Type.TObject<{
      readonly systemPrompt: Type.TOptional<Type.TString>;
      readonly messages: Type.TArray<Type.TUnion<[Type.TObject<{
        readonly role: Type.TLiteral<"user">;
        readonly content: Type.TUnion<[Type.TString, Type.TArray<Type.TUnion<[Type.TObject<{
          readonly type: Type.TLiteral<"text">;
          readonly text: Type.TString;
          readonly textSignature: Type.TOptional<Type.TString>;
        }>, Type.TObject<{
          readonly type: Type.TLiteral<"image">;
          readonly data: Type.TString;
          readonly mimeType: Type.TString;
        }>]>>]>;
        readonly timestamp: Type.TInteger;
        readonly runtimeContextCarrier: Type.TOptional<Type.TBoolean>;
      }>, Type.TObject<{
        readonly diagnostics: Type.TOptional<Type.TArray<Type.TObject<{
          type: Type.TString;
          timestamp: Type.TInteger;
          error: Type.TOptional<Type.TObject<{
            name: Type.TOptional<Type.TString>;
            message: Type.TString;
            stack: Type.TOptional<Type.TString>;
            code: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
          }>>;
          details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
        }>>>;
        readonly stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">, Type.TLiteral<"error">, Type.TLiteral<"aborted">]>;
        readonly errorMessage: Type.TOptional<Type.TString>;
        readonly errorCode: Type.TOptional<Type.TString>;
        readonly errorType: Type.TOptional<Type.TString>;
        readonly errorBody: Type.TOptional<Type.TString>;
        readonly role: Type.TLiteral<"assistant">;
        readonly content: Type.TArray<Type.TUnion<[Type.TObject<{
          readonly type: Type.TLiteral<"text">;
          readonly text: Type.TString;
          readonly textSignature: Type.TOptional<Type.TString>;
        }>, Type.TObject<{
          readonly type: Type.TLiteral<"thinking">;
          readonly thinking: Type.TString;
          readonly thinkingSignature: Type.TOptional<Type.TString>;
          readonly redacted: Type.TOptional<Type.TBoolean>;
        }>, Type.TObject<{
          readonly type: Type.TLiteral<"toolCall">;
          readonly id: Type.TString;
          readonly name: Type.TString;
          readonly arguments: Type.TRecord<"^.*$", Type.TUnknown>;
          readonly thoughtSignature: Type.TOptional<Type.TString>;
          readonly executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
        }>]>>;
        readonly api: Type.TString;
        readonly provider: Type.TString;
        readonly model: Type.TString;
        readonly responseModel: Type.TOptional<Type.TString>;
        readonly responseId: Type.TOptional<Type.TString>;
        readonly usage: Type.TObject<{
          input: Type.TNumber;
          output: Type.TNumber;
          cacheRead: Type.TNumber;
          cacheWrite: Type.TNumber;
          contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
            state: Type.TLiteral<"available">;
            promptTokens: Type.TNumber;
            totalTokens: Type.TNumber;
          }>, Type.TObject<{
            state: Type.TLiteral<"unavailable">;
          }>]>>;
          totalTokens: Type.TNumber;
          cost: Type.TObject<{
            input: Type.TNumber;
            output: Type.TNumber;
            cacheRead: Type.TNumber;
            cacheWrite: Type.TNumber;
            total: Type.TNumber;
            totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
          }>;
        }>;
        readonly timestamp: Type.TInteger;
      }>, Type.TObject<{
        readonly role: Type.TLiteral<"toolResult">;
        readonly toolCallId: Type.TString;
        readonly toolName: Type.TString;
        readonly content: Type.TArray<Type.TUnion<[Type.TObject<{
          readonly type: Type.TLiteral<"text">;
          readonly text: Type.TString;
          readonly textSignature: Type.TOptional<Type.TString>;
        }>, Type.TObject<{
          readonly type: Type.TLiteral<"image">;
          readonly data: Type.TString;
          readonly mimeType: Type.TString;
        }>]>>;
        readonly details: Type.TOptional<Type.TUnknown>;
        readonly isError: Type.TBoolean;
        readonly timestamp: Type.TInteger;
      }>]>>;
      readonly tools: Type.TOptional<Type.TArray<Type.TObject<{
        readonly name: Type.TString;
        readonly description: Type.TString;
        readonly parameters: Type.TUnknown;
      }>>>;
    }>;
    readonly options: Type.TObject<{
      readonly temperature: Type.TOptional<Type.TNumber>;
      readonly maxTokens: Type.TOptional<Type.TInteger>;
      readonly reasoning: Type.TOptional<Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"minimal">, Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">, Type.TLiteral<"xhigh">, Type.TLiteral<"adaptive">, Type.TLiteral<"max">]>>;
      readonly thinkingBudgets: Type.TOptional<Type.TObject<{
        readonly minimal: Type.TOptional<Type.TInteger>;
        readonly low: Type.TOptional<Type.TInteger>;
        readonly medium: Type.TOptional<Type.TInteger>;
        readonly high: Type.TOptional<Type.TInteger>;
        readonly max: Type.TOptional<Type.TInteger>;
      }>>;
    }>;
    readonly runEpoch: Type.TInteger;
    readonly sessionId: Type.TString;
    readonly runId: Type.TString;
    readonly turnId: Type.TString;
  }>;
}>;
declare const WorkerInferenceStartResponseFrameSchema: Type.TUnion<[Type.TObject<{
  readonly type: Type.TLiteral<"res">;
  readonly id: Type.TString;
  readonly ok: Type.TLiteral<true>;
  readonly payload: Type.TObject<{
    readonly status: Type.TUnion<[Type.TLiteral<"accepted">, Type.TLiteral<"replayed">]>;
  }>;
}>, Type.TObject<{
  readonly type: Type.TLiteral<"res">;
  readonly id: Type.TString;
  readonly ok: Type.TLiteral<false>;
  readonly error: Type.TObject<{
    readonly code: Type.TUnion<[Type.TLiteral<"INVALID_REQUEST">, Type.TLiteral<"UNAVAILABLE">]>;
    readonly message: Type.TString;
    readonly details: Type.TObject<{
      readonly reason: Type.TUnion<[Type.TLiteral<"model-not-approved">, Type.TLiteral<"invalid-context">, Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"session-not-attached">, Type.TLiteral<"provider-error">, Type.TLiteral<"cancelled">]>;
    }>;
  }>;
}>, Type.TObject<{
  type: Type.TLiteral<"res">;
  id: Type.TString;
  ok: Type.TLiteral<false>;
  error: Type.TObject<{
    code: Type.TUnion<[Type.TLiteral<"INVALID_REQUEST">, Type.TLiteral<"UNAVAILABLE">]>;
    message: Type.TString;
    details: Type.TObject<{
      reason: Type.TUnion<[Type.TUnion<[Type.TLiteral<"invalid-credential">, Type.TLiteral<"credential-expired">, Type.TLiteral<"environment-mismatch">, Type.TLiteral<"environment-unavailable">, Type.TLiteral<"bundle-mismatch">, Type.TLiteral<"version-mismatch">, Type.TLiteral<"session-mismatch">, Type.TLiteral<"placement-mismatch">, Type.TLiteral<"owner-epoch-mismatch">, Type.TLiteral<"rpc-set-mismatch">, Type.TLiteral<"protocol-features-mismatch">]>, Type.TLiteral<"invalid-handshake">, Type.TLiteral<"protocol-mismatch">, Type.TLiteral<"gateway-unavailable">, Type.TLiteral<"invalid-frame">, Type.TLiteral<"slow-consumer">, Type.TLiteral<"method-not-allowed">, Type.TLiteral<"invalid-heartbeat">, Type.TLiteral<"credential-replaced">, Type.TLiteral<"gateway-shutdown">]>;
    }>;
    retryable: Type.TOptional<Type.TBoolean>;
    retryAfterMs: Type.TOptional<Type.TInteger>;
  }>;
}>]>;
declare const WorkerInferenceCancelParamsSchema: Type.TObject<{
  readonly runEpoch: Type.TInteger;
  readonly sessionId: Type.TString;
  readonly runId: Type.TString;
  readonly turnId: Type.TString;
}>;
declare const WorkerInferenceCancelResultSchema: Type.TObject<{
  readonly status: Type.TLiteral<"cancelled">;
}>;
declare const WorkerInferenceCancelRequestFrameSchema: Type.TObject<{
  readonly type: Type.TLiteral<"req">;
  readonly id: Type.TString;
  readonly method: Type.TLiteral<"worker.inference.cancel">;
  readonly params: Type.TObject<{
    readonly runEpoch: Type.TInteger;
    readonly sessionId: Type.TString;
    readonly runId: Type.TString;
    readonly turnId: Type.TString;
  }>;
}>;
declare const WorkerInferenceCancelResponseFrameSchema: Type.TUnion<[Type.TObject<{
  readonly type: Type.TLiteral<"res">;
  readonly id: Type.TString;
  readonly ok: Type.TLiteral<true>;
  readonly payload: Type.TObject<{
    readonly status: Type.TLiteral<"cancelled">;
  }>;
}>, Type.TObject<{
  readonly type: Type.TLiteral<"res">;
  readonly id: Type.TString;
  readonly ok: Type.TLiteral<false>;
  readonly error: Type.TObject<{
    readonly code: Type.TUnion<[Type.TLiteral<"INVALID_REQUEST">, Type.TLiteral<"UNAVAILABLE">]>;
    readonly message: Type.TString;
    readonly details: Type.TObject<{
      readonly reason: Type.TUnion<[Type.TLiteral<"model-not-approved">, Type.TLiteral<"invalid-context">, Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"session-not-attached">, Type.TLiteral<"provider-error">, Type.TLiteral<"cancelled">]>;
    }>;
  }>;
}>, Type.TObject<{
  type: Type.TLiteral<"res">;
  id: Type.TString;
  ok: Type.TLiteral<false>;
  error: Type.TObject<{
    code: Type.TUnion<[Type.TLiteral<"INVALID_REQUEST">, Type.TLiteral<"UNAVAILABLE">]>;
    message: Type.TString;
    details: Type.TObject<{
      reason: Type.TUnion<[Type.TUnion<[Type.TLiteral<"invalid-credential">, Type.TLiteral<"credential-expired">, Type.TLiteral<"environment-mismatch">, Type.TLiteral<"environment-unavailable">, Type.TLiteral<"bundle-mismatch">, Type.TLiteral<"version-mismatch">, Type.TLiteral<"session-mismatch">, Type.TLiteral<"placement-mismatch">, Type.TLiteral<"owner-epoch-mismatch">, Type.TLiteral<"rpc-set-mismatch">, Type.TLiteral<"protocol-features-mismatch">]>, Type.TLiteral<"invalid-handshake">, Type.TLiteral<"protocol-mismatch">, Type.TLiteral<"gateway-unavailable">, Type.TLiteral<"invalid-frame">, Type.TLiteral<"slow-consumer">, Type.TLiteral<"method-not-allowed">, Type.TLiteral<"invalid-heartbeat">, Type.TLiteral<"credential-replaced">, Type.TLiteral<"gateway-shutdown">]>;
    }>;
    retryable: Type.TOptional<Type.TBoolean>;
    retryAfterMs: Type.TOptional<Type.TInteger>;
  }>;
}>]>;
declare const WorkerInferenceEventParamsSchema: Type.TObject<{
  readonly seq: Type.TInteger;
  readonly event: Type.TUnion<[Type.TObject<{
    readonly type: Type.TLiteral<"start">;
    readonly resolvedModel: Type.TObject<{
      readonly api: Type.TString;
      readonly provider: Type.TString;
      readonly model: Type.TString;
    }>;
    readonly timestamp: Type.TInteger;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"text_start">;
    readonly contentIndex: Type.TInteger;
    readonly contentSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"text_delta">;
    readonly contentIndex: Type.TInteger;
    readonly delta: Type.TString;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"text_end">;
    readonly contentIndex: Type.TInteger;
    readonly contentSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"thinking_start">;
    readonly contentIndex: Type.TInteger;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"thinking_delta">;
    readonly contentIndex: Type.TInteger;
    readonly delta: Type.TString;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"thinking_end">;
    readonly contentIndex: Type.TInteger;
    readonly contentSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"toolcall_start">;
    readonly contentIndex: Type.TInteger;
    readonly id: Type.TString;
    readonly toolName: Type.TString;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"toolcall_delta">;
    readonly contentIndex: Type.TInteger;
    readonly delta: Type.TString;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"toolcall_end">;
    readonly contentIndex: Type.TInteger;
  }>]>;
  readonly runEpoch: Type.TInteger;
  readonly sessionId: Type.TString;
  readonly runId: Type.TString;
  readonly turnId: Type.TString;
}>;
declare const WorkerInferenceEventFrameSchema: Type.TObject<{
  readonly type: Type.TLiteral<"event">;
  readonly event: Type.TLiteral<"worker.inference.event">;
  readonly payload: Type.TObject<{
    readonly seq: Type.TInteger;
    readonly event: Type.TUnion<[Type.TObject<{
      readonly type: Type.TLiteral<"start">;
      readonly resolvedModel: Type.TObject<{
        readonly api: Type.TString;
        readonly provider: Type.TString;
        readonly model: Type.TString;
      }>;
      readonly timestamp: Type.TInteger;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"text_start">;
      readonly contentIndex: Type.TInteger;
      readonly contentSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"text_delta">;
      readonly contentIndex: Type.TInteger;
      readonly delta: Type.TString;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"text_end">;
      readonly contentIndex: Type.TInteger;
      readonly contentSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"thinking_start">;
      readonly contentIndex: Type.TInteger;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"thinking_delta">;
      readonly contentIndex: Type.TInteger;
      readonly delta: Type.TString;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"thinking_end">;
      readonly contentIndex: Type.TInteger;
      readonly contentSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"toolcall_start">;
      readonly contentIndex: Type.TInteger;
      readonly id: Type.TString;
      readonly toolName: Type.TString;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"toolcall_delta">;
      readonly contentIndex: Type.TInteger;
      readonly delta: Type.TString;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"toolcall_end">;
      readonly contentIndex: Type.TInteger;
    }>]>;
    readonly runEpoch: Type.TInteger;
    readonly sessionId: Type.TString;
    readonly runId: Type.TString;
    readonly turnId: Type.TString;
  }>;
}>;
declare const WorkerInferenceTerminalOutcomeSchema: Type.TUnion<[Type.TObject<{
  readonly type: Type.TLiteral<"done">;
  readonly message: Type.TObject<{
    readonly stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">]>;
    readonly role: Type.TLiteral<"assistant">;
    readonly content: Type.TArray<Type.TUnion<[Type.TObject<{
      readonly type: Type.TLiteral<"text">;
      readonly text: Type.TString;
      readonly textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"thinking">;
      readonly thinking: Type.TString;
      readonly thinkingSignature: Type.TOptional<Type.TString>;
      readonly redacted: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"toolCall">;
      readonly id: Type.TString;
      readonly name: Type.TString;
      readonly arguments: Type.TRecord<"^.*$", Type.TUnknown>;
      readonly thoughtSignature: Type.TOptional<Type.TString>;
      readonly executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
    }>]>>;
    readonly api: Type.TString;
    readonly provider: Type.TString;
    readonly model: Type.TString;
    readonly responseModel: Type.TOptional<Type.TString>;
    readonly responseId: Type.TOptional<Type.TString>;
    readonly usage: Type.TObject<{
      input: Type.TNumber;
      output: Type.TNumber;
      cacheRead: Type.TNumber;
      cacheWrite: Type.TNumber;
      contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
        state: Type.TLiteral<"available">;
        promptTokens: Type.TNumber;
        totalTokens: Type.TNumber;
      }>, Type.TObject<{
        state: Type.TLiteral<"unavailable">;
      }>]>>;
      totalTokens: Type.TNumber;
      cost: Type.TObject<{
        input: Type.TNumber;
        output: Type.TNumber;
        cacheRead: Type.TNumber;
        cacheWrite: Type.TNumber;
        total: Type.TNumber;
        totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
      }>;
    }>;
    readonly timestamp: Type.TInteger;
  }>;
}>, Type.TObject<{
  readonly type: Type.TLiteral<"error">;
  readonly reason: Type.TUnion<[Type.TLiteral<"model-not-approved">, Type.TLiteral<"invalid-context">, Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"session-not-attached">, Type.TLiteral<"provider-error">, Type.TLiteral<"cancelled">]>;
  readonly message: Type.TString;
  readonly usage: Type.TOptional<Type.TObject<{
    input: Type.TNumber;
    output: Type.TNumber;
    cacheRead: Type.TNumber;
    cacheWrite: Type.TNumber;
    contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
      state: Type.TLiteral<"available">;
      promptTokens: Type.TNumber;
      totalTokens: Type.TNumber;
    }>, Type.TObject<{
      state: Type.TLiteral<"unavailable">;
    }>]>>;
    totalTokens: Type.TNumber;
    cost: Type.TObject<{
      input: Type.TNumber;
      output: Type.TNumber;
      cacheRead: Type.TNumber;
      cacheWrite: Type.TNumber;
      total: Type.TNumber;
      totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
    }>;
  }>>;
}>]>;
declare const WorkerInferenceTerminalParamsSchema: Type.TObject<{
  readonly seq: Type.TInteger;
  readonly outcome: Type.TUnion<[Type.TObject<{
    readonly type: Type.TLiteral<"done">;
    readonly message: Type.TObject<{
      readonly stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">]>;
      readonly role: Type.TLiteral<"assistant">;
      readonly content: Type.TArray<Type.TUnion<[Type.TObject<{
        readonly type: Type.TLiteral<"text">;
        readonly text: Type.TString;
        readonly textSignature: Type.TOptional<Type.TString>;
      }>, Type.TObject<{
        readonly type: Type.TLiteral<"thinking">;
        readonly thinking: Type.TString;
        readonly thinkingSignature: Type.TOptional<Type.TString>;
        readonly redacted: Type.TOptional<Type.TBoolean>;
      }>, Type.TObject<{
        readonly type: Type.TLiteral<"toolCall">;
        readonly id: Type.TString;
        readonly name: Type.TString;
        readonly arguments: Type.TRecord<"^.*$", Type.TUnknown>;
        readonly thoughtSignature: Type.TOptional<Type.TString>;
        readonly executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
      }>]>>;
      readonly api: Type.TString;
      readonly provider: Type.TString;
      readonly model: Type.TString;
      readonly responseModel: Type.TOptional<Type.TString>;
      readonly responseId: Type.TOptional<Type.TString>;
      readonly usage: Type.TObject<{
        input: Type.TNumber;
        output: Type.TNumber;
        cacheRead: Type.TNumber;
        cacheWrite: Type.TNumber;
        contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
          state: Type.TLiteral<"available">;
          promptTokens: Type.TNumber;
          totalTokens: Type.TNumber;
        }>, Type.TObject<{
          state: Type.TLiteral<"unavailable">;
        }>]>>;
        totalTokens: Type.TNumber;
        cost: Type.TObject<{
          input: Type.TNumber;
          output: Type.TNumber;
          cacheRead: Type.TNumber;
          cacheWrite: Type.TNumber;
          total: Type.TNumber;
          totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
        }>;
      }>;
      readonly timestamp: Type.TInteger;
    }>;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"error">;
    readonly reason: Type.TUnion<[Type.TLiteral<"model-not-approved">, Type.TLiteral<"invalid-context">, Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"session-not-attached">, Type.TLiteral<"provider-error">, Type.TLiteral<"cancelled">]>;
    readonly message: Type.TString;
    readonly usage: Type.TOptional<Type.TObject<{
      input: Type.TNumber;
      output: Type.TNumber;
      cacheRead: Type.TNumber;
      cacheWrite: Type.TNumber;
      contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
        state: Type.TLiteral<"available">;
        promptTokens: Type.TNumber;
        totalTokens: Type.TNumber;
      }>, Type.TObject<{
        state: Type.TLiteral<"unavailable">;
      }>]>>;
      totalTokens: Type.TNumber;
      cost: Type.TObject<{
        input: Type.TNumber;
        output: Type.TNumber;
        cacheRead: Type.TNumber;
        cacheWrite: Type.TNumber;
        total: Type.TNumber;
        totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
      }>;
    }>>;
  }>]>;
  readonly runEpoch: Type.TInteger;
  readonly sessionId: Type.TString;
  readonly runId: Type.TString;
  readonly turnId: Type.TString;
}>;
declare const WorkerInferenceTerminalFrameSchema: Type.TObject<{
  readonly type: Type.TLiteral<"event">;
  readonly event: Type.TLiteral<"worker.inference.terminal">;
  readonly payload: Type.TObject<{
    readonly seq: Type.TInteger;
    readonly outcome: Type.TUnion<[Type.TObject<{
      readonly type: Type.TLiteral<"done">;
      readonly message: Type.TObject<{
        readonly stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">]>;
        readonly role: Type.TLiteral<"assistant">;
        readonly content: Type.TArray<Type.TUnion<[Type.TObject<{
          readonly type: Type.TLiteral<"text">;
          readonly text: Type.TString;
          readonly textSignature: Type.TOptional<Type.TString>;
        }>, Type.TObject<{
          readonly type: Type.TLiteral<"thinking">;
          readonly thinking: Type.TString;
          readonly thinkingSignature: Type.TOptional<Type.TString>;
          readonly redacted: Type.TOptional<Type.TBoolean>;
        }>, Type.TObject<{
          readonly type: Type.TLiteral<"toolCall">;
          readonly id: Type.TString;
          readonly name: Type.TString;
          readonly arguments: Type.TRecord<"^.*$", Type.TUnknown>;
          readonly thoughtSignature: Type.TOptional<Type.TString>;
          readonly executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
        }>]>>;
        readonly api: Type.TString;
        readonly provider: Type.TString;
        readonly model: Type.TString;
        readonly responseModel: Type.TOptional<Type.TString>;
        readonly responseId: Type.TOptional<Type.TString>;
        readonly usage: Type.TObject<{
          input: Type.TNumber;
          output: Type.TNumber;
          cacheRead: Type.TNumber;
          cacheWrite: Type.TNumber;
          contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
            state: Type.TLiteral<"available">;
            promptTokens: Type.TNumber;
            totalTokens: Type.TNumber;
          }>, Type.TObject<{
            state: Type.TLiteral<"unavailable">;
          }>]>>;
          totalTokens: Type.TNumber;
          cost: Type.TObject<{
            input: Type.TNumber;
            output: Type.TNumber;
            cacheRead: Type.TNumber;
            cacheWrite: Type.TNumber;
            total: Type.TNumber;
            totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
          }>;
        }>;
        readonly timestamp: Type.TInteger;
      }>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"error">;
      readonly reason: Type.TUnion<[Type.TLiteral<"model-not-approved">, Type.TLiteral<"invalid-context">, Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"session-not-attached">, Type.TLiteral<"provider-error">, Type.TLiteral<"cancelled">]>;
      readonly message: Type.TString;
      readonly usage: Type.TOptional<Type.TObject<{
        input: Type.TNumber;
        output: Type.TNumber;
        cacheRead: Type.TNumber;
        cacheWrite: Type.TNumber;
        contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
          state: Type.TLiteral<"available">;
          promptTokens: Type.TNumber;
          totalTokens: Type.TNumber;
        }>, Type.TObject<{
          state: Type.TLiteral<"unavailable">;
        }>]>>;
        totalTokens: Type.TNumber;
        cost: Type.TObject<{
          input: Type.TNumber;
          output: Type.TNumber;
          cacheRead: Type.TNumber;
          cacheWrite: Type.TNumber;
          total: Type.TNumber;
          totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
        }>;
      }>>;
    }>]>;
    readonly runEpoch: Type.TInteger;
    readonly sessionId: Type.TString;
    readonly runId: Type.TString;
    readonly turnId: Type.TString;
  }>;
}>;
type WorkerInferenceModelRef = Static<typeof WorkerInferenceModelRefSchema>;
type WorkerInferenceContext = Static<typeof WorkerInferenceContextSchema>;
type WorkerInferenceOptions = Static<typeof WorkerInferenceOptionsSchema>;
type WorkerInferenceStartParams = Static<typeof WorkerInferenceStartParamsSchema>;
type WorkerInferenceStartResult = Static<typeof WorkerInferenceStartResultSchema>;
type WorkerInferenceErrorReason = Static<typeof WorkerInferenceErrorReasonSchema>;
type WorkerInferenceErrorShape = Static<typeof WorkerInferenceErrorShapeSchema>;
type WorkerInferenceStartRequestFrame = Static<typeof WorkerInferenceStartRequestFrameSchema>;
type WorkerInferenceStartResponseFrame = Static<typeof WorkerInferenceStartResponseFrameSchema>;
type WorkerInferenceCancelParams = Static<typeof WorkerInferenceCancelParamsSchema>;
type WorkerInferenceCancelResult = Static<typeof WorkerInferenceCancelResultSchema>;
type WorkerInferenceCancelRequestFrame = Static<typeof WorkerInferenceCancelRequestFrameSchema>;
type WorkerInferenceCancelResponseFrame = Static<typeof WorkerInferenceCancelResponseFrameSchema>;
type WorkerInferenceEventParams = Static<typeof WorkerInferenceEventParamsSchema>;
type WorkerInferenceEventFrame = Static<typeof WorkerInferenceEventFrameSchema>;
type WorkerInferenceTerminalOutcome = Static<typeof WorkerInferenceTerminalOutcomeSchema>;
type WorkerInferenceTerminalParams = Static<typeof WorkerInferenceTerminalParamsSchema>;
type WorkerInferenceTerminalFrame = Static<typeof WorkerInferenceTerminalFrameSchema>;
declare function validateWorkerInferenceStartParams(data: unknown): data is WorkerInferenceStartParams;
declare function validateWorkerInferenceCancelParams(data: unknown): data is WorkerInferenceCancelParams;
declare function validateWorkerInferenceTerminalOutcome(data: unknown): data is WorkerInferenceTerminalOutcome;
declare function validateWorkerInferenceEventFrame(data: unknown): data is WorkerInferenceEventFrame;
declare function validateWorkerInferenceTerminalFrame(data: unknown): data is WorkerInferenceTerminalFrame;
//#endregion
//#region packages/gateway-protocol/src/schema/skill-history.d.ts
declare const SkillsProposalHistoryStatusParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
}>;
declare const SkillsProposalHistoryScanParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  direction: Type.TOptional<Type.TUnion<[Type.TLiteral<"older">, Type.TLiteral<"newer">]>>;
}>;
declare const SkillsProposalHistoryScanResultSchema: Type.TObject<{
  schema: Type.TLiteral<"openclaw.skill-workshop.history-scan.v1">;
  hasScanned: Type.TBoolean;
  reviewedSessions: Type.TInteger;
  ideasFound: Type.TInteger;
  hasMore: Type.TBoolean;
  lastScanReviewed: Type.TInteger;
  lastScanIdeas: Type.TInteger;
  lastScanAt: Type.TOptional<Type.TString>;
  oldestReviewedAt: Type.TOptional<Type.TString>;
  newestReviewedAt: Type.TOptional<Type.TString>;
}>;
type SkillsProposalHistoryStatusParams = Static<typeof SkillsProposalHistoryStatusParamsSchema>;
type SkillsProposalHistoryScanParams = Static<typeof SkillsProposalHistoryScanParamsSchema>;
type SkillsProposalHistoryScanResult = Static<typeof SkillsProposalHistoryScanResultSchema>;
declare const validateSkillsProposalHistoryStatusParams: ProtocolValidator<{
  agentId?: string | undefined;
}>;
declare const validateSkillsProposalHistoryScanParams: ProtocolValidator<{
  agentId?: string | undefined;
  direction?: "older" | "newer" | undefined;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/ui-command.d.ts
declare const UiSplitCommandSchema: Type.TObject<{
  kind: Type.TLiteral<"split">;
  direction: Type.TUnion<[Type.TLiteral<"right">, Type.TLiteral<"down">]>;
  sessionKey: Type.TString;
}>;
declare const UiClosePaneCommandSchema: Type.TObject<{
  kind: Type.TLiteral<"close-pane">;
  sessionKey: Type.TString;
}>;
declare const UiFocusCommandSchema: Type.TObject<{
  kind: Type.TLiteral<"focus">;
  sessionKey: Type.TString;
}>;
declare const UiSidebarCommandSchema: Type.TObject<{
  kind: Type.TLiteral<"sidebar">;
  visible: Type.TBoolean;
}>;
declare const UiPanelCommandSchema: Type.TObject<{
  kind: Type.TLiteral<"panel">;
  panel: Type.TUnion<[Type.TLiteral<"terminal">, Type.TLiteral<"browser">]>;
  open: Type.TBoolean;
  dock: Type.TOptional<Type.TUnion<[Type.TLiteral<"bottom">, Type.TLiteral<"right">]>>;
  terminalSessionId: Type.TOptional<Type.TString>;
}>;
declare const UiNavigateCommandSchema: Type.TObject<{
  kind: Type.TLiteral<"navigate">;
  sessionKey: Type.TString;
}>;
declare const UiCommandSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"split">;
  direction: Type.TUnion<[Type.TLiteral<"right">, Type.TLiteral<"down">]>;
  sessionKey: Type.TString;
}>, Type.TObject<{
  kind: Type.TLiteral<"close-pane">;
  sessionKey: Type.TString;
}>, Type.TObject<{
  kind: Type.TLiteral<"focus">;
  sessionKey: Type.TString;
}>, Type.TObject<{
  kind: Type.TLiteral<"sidebar">;
  visible: Type.TBoolean;
}>, Type.TObject<{
  kind: Type.TLiteral<"panel">;
  panel: Type.TUnion<[Type.TLiteral<"terminal">, Type.TLiteral<"browser">]>;
  open: Type.TBoolean;
  dock: Type.TOptional<Type.TUnion<[Type.TLiteral<"bottom">, Type.TLiteral<"right">]>>;
  terminalSessionId: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  kind: Type.TLiteral<"navigate">;
  sessionKey: Type.TString;
}>]>;
type UiCommand = Static<typeof UiCommandSchema>;
declare const UiCommandParamsSchema: Type.TObject<{
  command: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"split">;
    direction: Type.TUnion<[Type.TLiteral<"right">, Type.TLiteral<"down">]>;
    sessionKey: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"close-pane">;
    sessionKey: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"focus">;
    sessionKey: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"sidebar">;
    visible: Type.TBoolean;
  }>, Type.TObject<{
    kind: Type.TLiteral<"panel">;
    panel: Type.TUnion<[Type.TLiteral<"terminal">, Type.TLiteral<"browser">]>;
    open: Type.TBoolean;
    dock: Type.TOptional<Type.TUnion<[Type.TLiteral<"bottom">, Type.TLiteral<"right">]>>;
    terminalSessionId: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"navigate">;
    sessionKey: Type.TString;
  }>]>;
  sessionKey: Type.TOptional<Type.TString>;
}>;
type UiCommandParams = Static<typeof UiCommandParamsSchema>;
declare const UiCommandResultSchema: Type.TObject<{
  ok: Type.TBoolean;
}>;
type UiCommandResult = Static<typeof UiCommandResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/frames.d.ts
declare const GATEWAY_SERVER_CAPS: {
  readonly BOARD_WIDGET_PUT_CANVAS_DOC: "board-widget-put-canvas-doc";
  readonly CHAT_SEND_ROUTING_CONTRACT: "chat-send-routing-contract";
  readonly SYSTEM_AGENT_SETUP_MODEL_REF: "openclaw-setup-model-ref";
};
/**
 * Top-level gateway frame schemas.
 *
 * These are the WebSocket envelope contracts; method/event payload schemas live
 * in feature-specific modules and are referenced by runtime validators.
 */
/** Periodic server heartbeat event payload. */
declare const TickEventSchema: Type.TObject<{
  ts: Type.TInteger;
}>;
/** Server shutdown notice event payload. */
declare const ShutdownEventSchema: Type.TObject<{
  reason: Type.TString;
  restartExpectedMs: Type.TOptional<Type.TInteger>;
}>;
/** Initial client hello/connect payload sent before the gateway accepts frames. */
declare const ConnectParamsSchema: Type.TObject<{
  minProtocol: Type.TInteger;
  maxProtocol: Type.TInteger;
  client: Type.TObject<{
    id: Type.TEnum<["webchat-ui", "openclaw-control-ui", "openclaw-browser-copilot", "openclaw-tui", "webchat", "cli", "gateway-client", "openclaw-macos", "openclaw-linux", "openclaw-ios", "openclaw-watchos", "openclaw-android", "node-host", "openclaw-worker", "test", "fingerprint", "openclaw-probe"]>;
    displayName: Type.TOptional<Type.TString>;
    version: Type.TString;
    platform: Type.TString;
    deviceFamily: Type.TOptional<Type.TString>;
    modelIdentifier: Type.TOptional<Type.TString>;
    mode: Type.TEnum<["webchat", "cli", "worker", "test", "probe", "ui", "backend", "node"]>;
    instanceId: Type.TOptional<Type.TString>;
  }>;
  caps: Type.TOptional<Type.TArray<Type.TString>>;
  commands: Type.TOptional<Type.TArray<Type.TString>>;
  permissions: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
  pathEnv: Type.TOptional<Type.TString>;
  role: Type.TOptional<Type.TString>;
  scopes: Type.TOptional<Type.TArray<Type.TString>>;
  device: Type.TOptional<Type.TObject<{
    id: Type.TString;
    publicKey: Type.TString;
    signature: Type.TString;
    signedAt: Type.TInteger;
    nonce: Type.TString;
  }>>;
  auth: Type.TOptional<Type.TObject<{
    token: Type.TOptional<Type.TString>;
    bootstrapToken: Type.TOptional<Type.TString>;
    deviceToken: Type.TOptional<Type.TString>;
    password: Type.TOptional<Type.TString>;
    approvalRuntimeToken: Type.TOptional<Type.TString>;
    agentRuntimeIdentityToken: Type.TOptional<Type.TString>;
  }>>;
  locale: Type.TOptional<Type.TString>;
  userAgent: Type.TOptional<Type.TString>;
}>;
/** Successful gateway hello response with negotiated protocol and initial state. */
declare const HelloOkSchema: Type.TObject<{
  type: Type.TLiteral<"hello-ok">;
  protocol: Type.TInteger;
  server: Type.TObject<{
    version: Type.TString;
    connId: Type.TString;
  }>;
  features: Type.TObject<{
    methods: Type.TArray<Type.TString>;
    events: Type.TArray<Type.TString>;
    capabilities: Type.TOptional<Type.TArray<Type.TString>>;
  }>;
  snapshot: Type.TObject<{
    presence: Type.TArray<Type.TObject<{
      host: Type.TOptional<Type.TString>;
      ip: Type.TOptional<Type.TString>;
      version: Type.TOptional<Type.TString>;
      platform: Type.TOptional<Type.TString>;
      deviceFamily: Type.TOptional<Type.TString>;
      modelIdentifier: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TString>;
      lastInputSeconds: Type.TOptional<Type.TInteger>;
      reason: Type.TOptional<Type.TString>;
      tags: Type.TOptional<Type.TArray<Type.TString>>;
      text: Type.TOptional<Type.TString>;
      ts: Type.TInteger;
      deviceId: Type.TOptional<Type.TString>;
      roles: Type.TOptional<Type.TArray<Type.TString>>;
      scopes: Type.TOptional<Type.TArray<Type.TString>>;
      instanceId: Type.TOptional<Type.TString>;
      user: Type.TOptional<Type.TObject<{
        id: Type.TString;
        email: Type.TOptional<Type.TString>;
        name: Type.TOptional<Type.TString>;
        avatarUrl: Type.TOptional<Type.TString>;
      }>>;
      watchedSessions: Type.TOptional<Type.TArray<Type.TString>>;
    }>>;
    health: Type.TObject<{
      ok: Type.TOptional<Type.TLiteral<true>>;
      ts: Type.TOptional<Type.TInteger>;
      durationMs: Type.TOptional<Type.TInteger>;
      eventLoop: Type.TOptional<Type.TObject<{
        degraded: Type.TBoolean;
        reasons: Type.TArray<Type.TUnion<[Type.TLiteral<"event_loop_delay">, Type.TLiteral<"event_loop_utilization">, Type.TLiteral<"cpu">]>>;
        intervalMs: Type.TNumber;
        delayP99Ms: Type.TNumber;
        delayMaxMs: Type.TNumber;
        utilization: Type.TNumber;
        cpuCoreRatio: Type.TNumber;
      }>>;
      plugins: Type.TOptional<Type.TObject<{
        loaded: Type.TArray<Type.TString>;
        errors: Type.TArray<Type.TObject<{
          id: Type.TString;
          origin: Type.TString;
          activated: Type.TBoolean;
          activationSource: Type.TOptional<Type.TString>;
          activationReason: Type.TOptional<Type.TString>;
          failurePhase: Type.TOptional<Type.TString>;
          error: Type.TString;
        }>>;
        unavailable: Type.TOptional<Type.TArray<Type.TObject<{
          id: Type.TString;
          state: Type.TLiteral<"configured-unavailable">;
          diagnostic: Type.TObject<{
            kind: Type.TLiteral<"plugin-verification">;
            reason: Type.TString;
            detail: Type.TString;
          }>;
        }>>>;
      }>>;
      contextEngines: Type.TOptional<Type.TObject<{
        quarantined: Type.TArray<Type.TObject<{
          engineId: Type.TString;
          owner: Type.TOptional<Type.TString>;
          operation: Type.TString;
          reason: Type.TString;
          failedAt: Type.TInteger;
        }>>;
      }>>;
      deliveryQueues: Type.TOptional<Type.TObject<{
        failed: Type.TArray<Type.TObject<{
          queueName: Type.TString;
          count: Type.TInteger;
          oldestFailedAt: Type.TOptional<Type.TInteger>;
        }>>;
      }>>;
      modelPricing: Type.TOptional<Type.TObject<{
        state: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"degraded">, Type.TLiteral<"disabled">]>;
        sources: Type.TArray<Type.TObject<{
          source: Type.TUnion<[Type.TLiteral<"openrouter">, Type.TLiteral<"litellm">, Type.TLiteral<"bootstrap">, Type.TLiteral<"refresh">]>;
          state: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"degraded">]>;
          lastFailureAt: Type.TOptional<Type.TInteger>;
          detail: Type.TOptional<Type.TString>;
        }>>;
        lastFailureAt: Type.TOptional<Type.TInteger>;
        detail: Type.TOptional<Type.TString>;
      }>>;
      configReload: Type.TOptional<Type.TObject<{
        hotReloadStatus: Type.TUnion<[Type.TLiteral<"active">, Type.TLiteral<"disabled">]>;
      }>>;
      channels: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
      channelOrder: Type.TOptional<Type.TArray<Type.TString>>;
      channelLabels: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
      heartbeatSeconds: Type.TOptional<Type.TInteger>;
      defaultAgentId: Type.TOptional<Type.TString>;
      agents: Type.TOptional<Type.TArray<Type.TObject<{
        agentId: Type.TString;
        name: Type.TOptional<Type.TString>;
        isDefault: Type.TBoolean;
        heartbeat: Type.TObject<{
          enabled: Type.TBoolean;
          every: Type.TString;
          everyMs: Type.TUnion<[Type.TInteger, Type.TNull]>;
          prompt: Type.TString;
          target: Type.TString;
          model: Type.TOptional<Type.TString>;
          ackMaxChars: Type.TInteger;
        }>;
        sessions: Type.TObject<{
          path: Type.TString;
          count: Type.TInteger;
          recent: Type.TArray<Type.TObject<{
            key: Type.TString;
            updatedAt: Type.TUnion<[Type.TInteger, Type.TNull]>;
            age: Type.TUnion<[Type.TInteger, Type.TNull]>;
          }>>;
        }>;
      }>>>;
      sessions: Type.TOptional<Type.TObject<{
        path: Type.TString;
        count: Type.TInteger;
        recent: Type.TArray<Type.TObject<{
          key: Type.TString;
          updatedAt: Type.TUnion<[Type.TInteger, Type.TNull]>;
          age: Type.TUnion<[Type.TInteger, Type.TNull]>;
        }>>;
      }>>;
    }>;
    stateVersion: Type.TObject<{
      presence: Type.TInteger;
      health: Type.TInteger;
    }>;
    uptimeMs: Type.TInteger;
    appliedConfigHash: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    configPath: Type.TOptional<Type.TString>;
    stateDir: Type.TOptional<Type.TString>;
    sessionDefaults: Type.TOptional<Type.TObject<{
      defaultAgentId: Type.TString;
      mainKey: Type.TString;
      mainSessionKey: Type.TString;
      scope: Type.TOptional<Type.TString>;
    }>>;
    authMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"token">, Type.TLiteral<"password">, Type.TLiteral<"trusted-proxy">]>>;
    updateAvailable: Type.TOptional<Type.TObject<{
      currentVersion: Type.TString;
      latestVersion: Type.TString;
      channel: Type.TString;
    }>>;
  }>;
  controlUiTabs: Type.TOptional<Type.TArray<Type.TObject<{
    pluginId: Type.TString;
    id: Type.TString;
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
    icon: Type.TOptional<Type.TString>;
    path: Type.TOptional<Type.TString>;
    requiresGatewayAuth: Type.TOptional<Type.TBoolean>;
    group: Type.TOptional<Type.TUnion<[Type.TLiteral<"control">, Type.TLiteral<"agent">]>>;
    order: Type.TOptional<Type.TNumber>;
  }>>>;
  pluginSurfaceUrls: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  auth: Type.TObject<{
    deviceToken: Type.TOptional<Type.TString>;
    role: Type.TString;
    scopes: Type.TArray<Type.TString>;
    issuedAtMs: Type.TOptional<Type.TInteger>;
    deviceTokens: Type.TOptional<Type.TArray<Type.TObject<{
      deviceToken: Type.TString;
      role: Type.TString;
      scopes: Type.TArray<Type.TString>;
      issuedAtMs: Type.TInteger;
    }>>>;
  }>;
  policy: Type.TObject<{
    maxPayload: Type.TInteger;
    maxBufferedBytes: Type.TInteger;
    tickIntervalMs: Type.TInteger;
  }>;
}>;
/** Standard structured error shape used in response frames and connect failures. */
declare const ErrorShapeSchema: Type.TObject<{
  code: Type.TString;
  message: Type.TString;
  details: Type.TOptional<Type.TUnknown>;
  retryable: Type.TOptional<Type.TBoolean>;
  retryAfterMs: Type.TOptional<Type.TInteger>;
}>;
/** Client request frame envelope; `method` selects the payload validator. */
declare const RequestFrameSchema: Type.TObject<{
  type: Type.TLiteral<"req">;
  id: Type.TString;
  method: Type.TString;
  params: Type.TOptional<Type.TUnknown>;
}>;
/** Server response frame envelope paired with a prior request id. */
declare const ResponseFrameSchema: Type.TObject<{
  type: Type.TLiteral<"res">;
  id: Type.TString;
  ok: Type.TBoolean;
  payload: Type.TOptional<Type.TUnknown>;
  error: Type.TOptional<Type.TObject<{
    code: Type.TString;
    message: Type.TString;
    details: Type.TOptional<Type.TUnknown>;
    retryable: Type.TOptional<Type.TBoolean>;
    retryAfterMs: Type.TOptional<Type.TInteger>;
  }>>;
}>;
/** Server event frame envelope; `event` selects the payload validator. */
declare const EventFrameSchema: Type.TObject<{
  type: Type.TLiteral<"event">;
  event: Type.TString;
  payload: Type.TOptional<Type.TUnknown>;
  seq: Type.TOptional<Type.TInteger>;
  stateVersion: Type.TOptional<Type.TObject<{
    presence: Type.TInteger;
    health: Type.TInteger;
  }>>;
}>;
declare const GatewayFrameSchema: Type.TUnion<[Type.TObject<{
  type: Type.TLiteral<"req">;
  id: Type.TString;
  method: Type.TString;
  params: Type.TOptional<Type.TUnknown>;
}>, Type.TObject<{
  type: Type.TLiteral<"res">;
  id: Type.TString;
  ok: Type.TBoolean;
  payload: Type.TOptional<Type.TUnknown>;
  error: Type.TOptional<Type.TObject<{
    code: Type.TString;
    message: Type.TString;
    details: Type.TOptional<Type.TUnknown>;
    retryable: Type.TOptional<Type.TBoolean>;
    retryAfterMs: Type.TOptional<Type.TInteger>;
  }>>;
}>, Type.TObject<{
  type: Type.TLiteral<"event">;
  event: Type.TString;
  payload: Type.TOptional<Type.TUnknown>;
  seq: Type.TOptional<Type.TInteger>;
  stateVersion: Type.TOptional<Type.TObject<{
    presence: Type.TInteger;
    health: Type.TInteger;
  }>>;
}>]>;
type ConnectParams = Static<typeof ConnectParamsSchema>;
type HelloOk = Static<typeof HelloOkSchema>;
type ErrorShape = Static<typeof ErrorShapeSchema>;
type RequestFrame = Static<typeof RequestFrameSchema>;
type ResponseFrame = Static<typeof ResponseFrameSchema>;
type EventFrame = Static<typeof EventFrameSchema>;
type GatewayFrame = Static<typeof GatewayFrameSchema>;
type TickEvent = Static<typeof TickEventSchema>;
type ShutdownEvent = Static<typeof ShutdownEventSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/error-codes.d.ts
/** Missing operator-scope details shared by WebSocket and HTTP responses. */
declare const MissingScopeErrorDetailsSchema: Type.TObject<{
  code: Type.TLiteral<"MISSING_SCOPE">;
  missingScope: Type.TString;
  requiredScopes: Type.TArray<Type.TString>;
}>;
/** Structured details emitted by method-level authorization failures. */
declare const GatewayErrorDetailsSchema: Type.TUnion<[Type.TObject<{
  code: Type.TLiteral<"MISSING_SCOPE">;
  missingScope: Type.TString;
  requiredScopes: Type.TArray<Type.TString>;
}>, Type.TObject<{
  code: Type.TLiteral<"MCP_APP_VIEW_EXPIRED">;
}>]>;
/** Builds the canonical gateway error payload while preserving optional retry metadata. */
declare function errorShape(code: ErrorCode, message: string, opts?: {
  details?: unknown;
  retryable?: boolean;
  retryAfterMs?: number;
}): ErrorShape;
/** Builds structured details for a missing operator scope. */
declare function buildMissingScopeErrorDetails(params: {
  missingScope: string;
  requiredScopes: readonly string[];
}): MissingScopeErrorDetails;
/** Builds a forbidden error for a missing operator scope without message parsing. */
declare function missingScopeErrorShape(params: {
  missingScope: string;
  requiredScopes: readonly string[];
}): ErrorShape;
//#endregion
//#region packages/gateway-protocol/src/schema/board.d.ts
declare const BoardTabIdSchema: Type.TString;
declare const BoardWidgetNameSchema: Type.TString;
declare const BoardChatDockSchema: Type.TUnion<[Type.TLiteral<"left">, Type.TLiteral<"right">, Type.TLiteral<"bottom">, Type.TLiteral<"hidden">]>;
declare const BoardSizeSchema: Type.TUnion<[Type.TLiteral<"sm">, Type.TLiteral<"md">, Type.TLiteral<"lg">, Type.TLiteral<"xl">, Type.TLiteral<"full">]>;
declare const BOARD_CRON_JOB_ID_MAX_LENGTH = 256;
declare const BOARD_CRON_TRIGGER_PREFIX = "cron.trigger:";
declare const BOARD_WIDGET_TOOL_MAX_LENGTH: number;
declare const BoardTabSchema: Type.TObject<{
  tabId: Type.TString;
  title: Type.TString;
  position: Type.TInteger;
  chatDock: Type.TUnion<[Type.TLiteral<"left">, Type.TLiteral<"right">, Type.TLiteral<"bottom">, Type.TLiteral<"hidden">]>;
}>;
type BoardTab = Static<typeof BoardTabSchema>;
declare const BoardWidgetDeclaredSchema: Type.TObject<{
  netOrigins: Type.TOptional<Type.TArray<Type.TString>>;
  tools: Type.TOptional<Type.TArray<Type.TString>>;
}>;
type BoardWidgetDeclared = Static<typeof BoardWidgetDeclaredSchema>;
declare const BoardWidgetSchema: Type.TObject<{
  name: Type.TString;
  tabId: Type.TString;
  title: Type.TOptional<Type.TString>;
  contentKind: Type.TUnion<[Type.TLiteral<"html">, Type.TLiteral<"mcp-app">]>;
  sizeW: Type.TInteger;
  sizeH: Type.TInteger;
  position: Type.TInteger;
  grantState: Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"pending">, Type.TLiteral<"granted">, Type.TLiteral<"rejected">]>;
  revision: Type.TInteger;
  instanceId: Type.TOptional<Type.TString>;
  declaredSummary: Type.TOptional<Type.TArray<Type.TString>>;
  declared: Type.TOptional<Type.TObject<{
    netOrigins: Type.TOptional<Type.TArray<Type.TString>>;
    tools: Type.TOptional<Type.TArray<Type.TString>>;
  }>>;
  frameUrl: Type.TOptional<Type.TString>;
  viewTicket: Type.TOptional<Type.TString>;
  viewTicketTtlMs: Type.TOptional<Type.TInteger>;
  viewGeneration: Type.TOptional<Type.TString>;
  sandboxUrl: Type.TOptional<Type.TString>;
  sandboxPort: Type.TOptional<Type.TInteger>;
  sandboxOrigin: Type.TOptional<Type.TString>;
}>;
type BoardWidget = Static<typeof BoardWidgetSchema>;
declare const BoardSnapshotSchema: Type.TObject<{
  sessionKey: Type.TString;
  revision: Type.TInteger;
  tabs: Type.TArray<Type.TObject<{
    tabId: Type.TString;
    title: Type.TString;
    position: Type.TInteger;
    chatDock: Type.TUnion<[Type.TLiteral<"left">, Type.TLiteral<"right">, Type.TLiteral<"bottom">, Type.TLiteral<"hidden">]>;
  }>>;
  widgets: Type.TArray<Type.TObject<{
    name: Type.TString;
    tabId: Type.TString;
    title: Type.TOptional<Type.TString>;
    contentKind: Type.TUnion<[Type.TLiteral<"html">, Type.TLiteral<"mcp-app">]>;
    sizeW: Type.TInteger;
    sizeH: Type.TInteger;
    position: Type.TInteger;
    grantState: Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"pending">, Type.TLiteral<"granted">, Type.TLiteral<"rejected">]>;
    revision: Type.TInteger;
    instanceId: Type.TOptional<Type.TString>;
    declaredSummary: Type.TOptional<Type.TArray<Type.TString>>;
    declared: Type.TOptional<Type.TObject<{
      netOrigins: Type.TOptional<Type.TArray<Type.TString>>;
      tools: Type.TOptional<Type.TArray<Type.TString>>;
    }>>;
    frameUrl: Type.TOptional<Type.TString>;
    viewTicket: Type.TOptional<Type.TString>;
    viewTicketTtlMs: Type.TOptional<Type.TInteger>;
    viewGeneration: Type.TOptional<Type.TString>;
    sandboxUrl: Type.TOptional<Type.TString>;
    sandboxPort: Type.TOptional<Type.TInteger>;
    sandboxOrigin: Type.TOptional<Type.TString>;
  }>>;
}>;
type BoardSnapshot = Static<typeof BoardSnapshotSchema>;
declare const BoardTabCreateOpSchema: Type.TObject<{
  kind: Type.TLiteral<"tab_create">;
  tabId: Type.TString;
  title: Type.TString;
  chatDock: Type.TOptional<Type.TUnion<[Type.TLiteral<"left">, Type.TLiteral<"right">, Type.TLiteral<"bottom">, Type.TLiteral<"hidden">]>>;
}>;
declare const BoardTabUpdateOpSchema: Type.TObject<{
  kind: Type.TLiteral<"tab_update">;
  tabId: Type.TString;
  title: Type.TOptional<Type.TString>;
  chatDock: Type.TOptional<Type.TUnion<[Type.TLiteral<"left">, Type.TLiteral<"right">, Type.TLiteral<"bottom">, Type.TLiteral<"hidden">]>>;
  position: Type.TOptional<Type.TInteger>;
}>;
declare const BoardTabDeleteOpSchema: Type.TObject<{
  kind: Type.TLiteral<"tab_delete">;
  tabId: Type.TString;
}>;
declare const BoardTabsReorderOpSchema: Type.TObject<{
  kind: Type.TLiteral<"tabs_reorder">;
  tabIds: Type.TArray<Type.TString>;
}>;
declare const BoardWidgetMoveOpSchema: Type.TObject<{
  kind: Type.TLiteral<"widget_move">;
  name: Type.TString;
  tabId: Type.TOptional<Type.TString>;
  position: Type.TOptional<Type.TInteger>;
  after: Type.TOptional<Type.TString>;
}>;
declare const BoardWidgetResizeOpSchema: Type.TObject<{
  kind: Type.TLiteral<"widget_resize">;
  name: Type.TString;
  sizeW: Type.TInteger;
  sizeH: Type.TInteger;
}>;
declare const BoardWidgetRemoveOpSchema: Type.TObject<{
  kind: Type.TLiteral<"widget_remove">;
  name: Type.TString;
}>;
declare const BoardOpSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"tab_create">;
  tabId: Type.TString;
  title: Type.TString;
  chatDock: Type.TOptional<Type.TUnion<[Type.TLiteral<"left">, Type.TLiteral<"right">, Type.TLiteral<"bottom">, Type.TLiteral<"hidden">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"tab_update">;
  tabId: Type.TString;
  title: Type.TOptional<Type.TString>;
  chatDock: Type.TOptional<Type.TUnion<[Type.TLiteral<"left">, Type.TLiteral<"right">, Type.TLiteral<"bottom">, Type.TLiteral<"hidden">]>>;
  position: Type.TOptional<Type.TInteger>;
}>, Type.TObject<{
  kind: Type.TLiteral<"tab_delete">;
  tabId: Type.TString;
}>, Type.TObject<{
  kind: Type.TLiteral<"tabs_reorder">;
  tabIds: Type.TArray<Type.TString>;
}>, Type.TObject<{
  kind: Type.TLiteral<"widget_move">;
  name: Type.TString;
  tabId: Type.TOptional<Type.TString>;
  position: Type.TOptional<Type.TInteger>;
  after: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  kind: Type.TLiteral<"widget_resize">;
  name: Type.TString;
  sizeW: Type.TInteger;
  sizeH: Type.TInteger;
}>, Type.TObject<{
  kind: Type.TLiteral<"widget_remove">;
  name: Type.TString;
}>]>;
type BoardOp = Static<typeof BoardOpSchema>;
declare const BoardGetParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
}>;
type BoardGetParams = Static<typeof BoardGetParamsSchema>;
declare const BoardUpdateParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  ops: Type.TArray<Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"tab_create">;
    tabId: Type.TString;
    title: Type.TString;
    chatDock: Type.TOptional<Type.TUnion<[Type.TLiteral<"left">, Type.TLiteral<"right">, Type.TLiteral<"bottom">, Type.TLiteral<"hidden">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"tab_update">;
    tabId: Type.TString;
    title: Type.TOptional<Type.TString>;
    chatDock: Type.TOptional<Type.TUnion<[Type.TLiteral<"left">, Type.TLiteral<"right">, Type.TLiteral<"bottom">, Type.TLiteral<"hidden">]>>;
    position: Type.TOptional<Type.TInteger>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"tab_delete">;
    tabId: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"tabs_reorder">;
    tabIds: Type.TArray<Type.TString>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"widget_move">;
    name: Type.TString;
    tabId: Type.TOptional<Type.TString>;
    position: Type.TOptional<Type.TInteger>;
    after: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"widget_resize">;
    name: Type.TString;
    sizeW: Type.TInteger;
    sizeH: Type.TInteger;
  }>, Type.TObject<{
    kind: Type.TLiteral<"widget_remove">;
    name: Type.TString;
  }>]>>;
}>;
type BoardUpdateParams = Static<typeof BoardUpdateParamsSchema>;
declare const BoardMcpAppDescriptorSchema: Type.TObject<{
  serverName: Type.TString;
  toolName: Type.TString;
  uiResourceUri: Type.TString;
  toolCallId: Type.TString;
}>;
type BoardMcpAppDescriptor = Static<typeof BoardMcpAppDescriptorSchema>;
declare const BoardWidgetHtmlContentSchema: Type.TObject<{
  kind: Type.TLiteral<"html">;
  html: Type.TString;
}>;
declare const BoardWidgetMcpAppContentSchema: Type.TObject<{
  kind: Type.TLiteral<"mcp-app">;
  descriptor: Type.TObject<{
    serverName: Type.TString;
    toolName: Type.TString;
    uiResourceUri: Type.TString;
    toolCallId: Type.TString;
  }>;
}>;
declare const BoardWidgetMcpAppPutContentSchema: Type.TObject<{
  kind: Type.TLiteral<"mcp-app">;
  viewId: Type.TString;
}>;
declare const BoardWidgetContentSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"html">;
  html: Type.TString;
}>, Type.TObject<{
  kind: Type.TLiteral<"mcp-app">;
  descriptor: Type.TObject<{
    serverName: Type.TString;
    toolName: Type.TString;
    uiResourceUri: Type.TString;
    toolCallId: Type.TString;
  }>;
}>]>;
type BoardWidgetContent = Static<typeof BoardWidgetContentSchema>;
type BoardWidgetMaterializedContent = Static<typeof BoardWidgetHtmlContentSchema> | (Static<typeof BoardWidgetMcpAppContentSchema> & {
  interactive: boolean;
});
declare const BoardCanvasDocumentSourceSchema: Type.TObject<{
  kind: Type.TLiteral<"canvas-doc">;
  docId: Type.TString;
}>;
type BoardCanvasDocumentSource = Static<typeof BoardCanvasDocumentSourceSchema>;
declare const BoardWidgetPutContentSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"html">;
  html: Type.TString;
}>, Type.TObject<{
  kind: Type.TLiteral<"mcp-app">;
  viewId: Type.TString;
}>, Type.TObject<{
  kind: Type.TLiteral<"canvas-doc">;
  docId: Type.TString;
}>]>;
type BoardWidgetPutContent = Static<typeof BoardWidgetPutContentSchema>;
declare const BoardWidgetPutParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  name: Type.TString;
  title: Type.TOptional<Type.TString>;
  content: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"html">;
    html: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"mcp-app">;
    viewId: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"canvas-doc">;
    docId: Type.TString;
  }>]>;
  placement: Type.TOptional<Type.TObject<{
    tabId: Type.TOptional<Type.TString>;
    size: Type.TOptional<Type.TUnion<[Type.TLiteral<"sm">, Type.TLiteral<"md">, Type.TLiteral<"lg">, Type.TLiteral<"xl">, Type.TLiteral<"full">]>>;
    after: Type.TOptional<Type.TString>;
  }>>;
  declared: Type.TOptional<Type.TObject<{
    netOrigins: Type.TOptional<Type.TArray<Type.TString>>;
    tools: Type.TOptional<Type.TArray<Type.TString>>;
  }>>;
}>;
type BoardWidgetPutParams = Static<typeof BoardWidgetPutParamsSchema>;
/** Materialized input accepted by the board store after gateway source resolution. */
type BoardWidgetMaterializedPutParams = Omit<BoardWidgetPutParams, "content"> & {
  content: BoardWidgetMaterializedContent;
};
declare const BoardWidgetGrantParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  name: Type.TString;
  decision: Type.TUnion<[Type.TLiteral<"granted">, Type.TLiteral<"rejected">]>;
  revision: Type.TInteger;
  instanceId: Type.TString;
}>;
type BoardWidgetGrantParams = Static<typeof BoardWidgetGrantParamsSchema>;
declare const BoardWidgetAppViewParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  name: Type.TString;
  revision: Type.TInteger;
  instanceId: Type.TString;
}>;
type BoardWidgetAppViewParams = Static<typeof BoardWidgetAppViewParamsSchema>;
declare const BoardWidgetAppViewResultSchema: Type.TObject<{
  viewId: Type.TString;
  expiresAtMs: Type.TInteger;
}>;
type BoardWidgetAppViewResult = Static<typeof BoardWidgetAppViewResultSchema>;
declare const BoardViewTicketSchema: Type.TString;
declare const BoardLegacyEventParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  widget: Type.TString;
  payload: Type.TUnknown;
}>;
declare const BoardTicketEventParamsSchema: Type.TObject<{
  ticket: Type.TString;
  payload: Type.TUnknown;
}>;
declare const BoardEventParamsSchema: Type.TUnion<[Type.TObject<{
  sessionKey: Type.TString;
  widget: Type.TString;
  payload: Type.TUnknown;
}>, Type.TObject<{
  ticket: Type.TString;
  payload: Type.TUnknown;
}>]>;
type BoardEventParams = Static<typeof BoardEventParamsSchema>;
declare const BoardPromptAuthorizeParamsSchema: Type.TObject<{
  ticket: Type.TString;
}>;
type BoardPromptAuthorizeParams = Static<typeof BoardPromptAuthorizeParamsSchema>;
declare const BoardDataReadParamsSchema: Type.TObject<{
  ticket: Type.TString;
  bindingId: Type.TString;
  params: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
}>;
type BoardDataReadParams = Static<typeof BoardDataReadParamsSchema>;
declare const BoardActionParamsSchema: Type.TObject<{
  ticket: Type.TString;
  action: Type.TLiteral<"cron.trigger">;
  jobId: Type.TString;
}>;
type BoardActionParams = Static<typeof BoardActionParamsSchema>;
declare const BoardChangedEventSchema: Type.TObject<{
  sessionKey: Type.TString;
  revision: Type.TInteger;
  widget: Type.TOptional<Type.TString>;
}>;
type BoardChangedEvent = Static<typeof BoardChangedEventSchema>;
declare const BoardFocusTabCommandSchema: Type.TObject<{
  kind: Type.TLiteral<"focus_tab">;
  tabId: Type.TString;
}>;
declare const BoardSetChatDockCommandSchema: Type.TObject<{
  kind: Type.TLiteral<"set_chat_dock">;
  dock: Type.TUnion<[Type.TLiteral<"left">, Type.TLiteral<"right">, Type.TLiteral<"bottom">, Type.TLiteral<"hidden">]>;
}>;
declare const BoardCommandSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"focus_tab">;
  tabId: Type.TString;
}>, Type.TObject<{
  kind: Type.TLiteral<"set_chat_dock">;
  dock: Type.TUnion<[Type.TLiteral<"left">, Type.TLiteral<"right">, Type.TLiteral<"bottom">, Type.TLiteral<"hidden">]>;
}>]>;
type BoardCommand = Static<typeof BoardCommandSchema>;
declare const BoardCommandEventSchema: Type.TObject<{
  sessionKey: Type.TString;
  command: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"focus_tab">;
    tabId: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"set_chat_dock">;
    dock: Type.TUnion<[Type.TLiteral<"left">, Type.TLiteral<"right">, Type.TLiteral<"bottom">, Type.TLiteral<"hidden">]>;
  }>]>;
}>;
type BoardCommandEvent = Static<typeof BoardCommandEventSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/migrations.d.ts
declare const MAX_MEMORY_MIGRATION_ITEMS = 2000;
declare const MemoryMigrationItemSchema: Type.TObject<{
  id: Type.TString;
  status: Type.TUnion<[Type.TLiteral<"planned">, Type.TLiteral<"migrated">, Type.TLiteral<"skipped">, Type.TLiteral<"warning">, Type.TLiteral<"conflict">, Type.TLiteral<"error">]>;
  source: Type.TOptional<Type.TString>;
  target: Type.TOptional<Type.TString>;
  message: Type.TOptional<Type.TString>;
  reason: Type.TOptional<Type.TString>;
  details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
}>;
declare const MemoryMigrationProviderPlanSchema: Type.TObject<{
  providerId: Type.TString;
  label: Type.TString;
  description: Type.TOptional<Type.TString>;
  planFingerprint: Type.TOptional<Type.TString>;
  found: Type.TBoolean;
  source: Type.TOptional<Type.TString>;
  target: Type.TOptional<Type.TString>;
  confidence: Type.TOptional<Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>>;
  message: Type.TOptional<Type.TString>;
  error: Type.TOptional<Type.TString>;
  summary: Type.TObject<{
    total: Type.TInteger;
    planned: Type.TInteger;
    migrated: Type.TInteger;
    skipped: Type.TInteger;
    conflicts: Type.TInteger;
    errors: Type.TInteger;
    sensitive: Type.TInteger;
  }>;
  items: Type.TArray<Type.TObject<{
    id: Type.TString;
    status: Type.TUnion<[Type.TLiteral<"planned">, Type.TLiteral<"migrated">, Type.TLiteral<"skipped">, Type.TLiteral<"warning">, Type.TLiteral<"conflict">, Type.TLiteral<"error">]>;
    source: Type.TOptional<Type.TString>;
    target: Type.TOptional<Type.TString>;
    message: Type.TOptional<Type.TString>;
    reason: Type.TOptional<Type.TString>;
    details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  }>>;
  warnings: Type.TOptional<Type.TArray<Type.TString>>;
}>;
declare const MigrationsMemoryPlanParamsSchema: Type.TObject<{
  agentId: Type.TString;
  overwrite: Type.TOptional<Type.TBoolean>;
}>;
declare const MigrationsMemoryPlanResultSchema: Type.TObject<{
  agentId: Type.TString;
  workspace: Type.TString;
  providers: Type.TArray<Type.TObject<{
    providerId: Type.TString;
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
    planFingerprint: Type.TOptional<Type.TString>;
    found: Type.TBoolean;
    source: Type.TOptional<Type.TString>;
    target: Type.TOptional<Type.TString>;
    confidence: Type.TOptional<Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>>;
    message: Type.TOptional<Type.TString>;
    error: Type.TOptional<Type.TString>;
    summary: Type.TObject<{
      total: Type.TInteger;
      planned: Type.TInteger;
      migrated: Type.TInteger;
      skipped: Type.TInteger;
      conflicts: Type.TInteger;
      errors: Type.TInteger;
      sensitive: Type.TInteger;
    }>;
    items: Type.TArray<Type.TObject<{
      id: Type.TString;
      status: Type.TUnion<[Type.TLiteral<"planned">, Type.TLiteral<"migrated">, Type.TLiteral<"skipped">, Type.TLiteral<"warning">, Type.TLiteral<"conflict">, Type.TLiteral<"error">]>;
      source: Type.TOptional<Type.TString>;
      target: Type.TOptional<Type.TString>;
      message: Type.TOptional<Type.TString>;
      reason: Type.TOptional<Type.TString>;
      details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    }>>;
    warnings: Type.TOptional<Type.TArray<Type.TString>>;
  }>>;
}>;
declare const MigrationsMemoryApplyParamsSchema: Type.TObject<{
  idempotencyKey: Type.TString;
  agentId: Type.TString;
  providerId: Type.TString;
  planFingerprint: Type.TString;
  itemIds: Type.TArray<Type.TString>;
  overwrite: Type.TOptional<Type.TBoolean>;
}>;
declare const MigrationsMemoryApplyResultSchema: Type.TObject<{
  providerId: Type.TString;
  source: Type.TString;
  target: Type.TOptional<Type.TString>;
  summary: Type.TObject<{
    total: Type.TInteger;
    planned: Type.TInteger;
    migrated: Type.TInteger;
    skipped: Type.TInteger;
    conflicts: Type.TInteger;
    errors: Type.TInteger;
    sensitive: Type.TInteger;
  }>;
  items: Type.TArray<Type.TObject<{
    id: Type.TString;
    status: Type.TUnion<[Type.TLiteral<"planned">, Type.TLiteral<"migrated">, Type.TLiteral<"skipped">, Type.TLiteral<"warning">, Type.TLiteral<"conflict">, Type.TLiteral<"error">]>;
    source: Type.TOptional<Type.TString>;
    target: Type.TOptional<Type.TString>;
    message: Type.TOptional<Type.TString>;
    reason: Type.TOptional<Type.TString>;
    details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  }>>;
  warnings: Type.TOptional<Type.TArray<Type.TString>>;
  backupPath: Type.TOptional<Type.TString>;
  reportDir: Type.TOptional<Type.TString>;
}>;
declare const MigrationProtocolSchemas: {
  readonly MemoryMigrationItemStatus: Type.TUnion<[Type.TLiteral<"planned">, Type.TLiteral<"migrated">, Type.TLiteral<"skipped">, Type.TLiteral<"warning">, Type.TLiteral<"conflict">, Type.TLiteral<"error">]>;
  readonly MemoryMigrationItem: Type.TObject<{
    id: Type.TString;
    status: Type.TUnion<[Type.TLiteral<"planned">, Type.TLiteral<"migrated">, Type.TLiteral<"skipped">, Type.TLiteral<"warning">, Type.TLiteral<"conflict">, Type.TLiteral<"error">]>;
    source: Type.TOptional<Type.TString>;
    target: Type.TOptional<Type.TString>;
    message: Type.TOptional<Type.TString>;
    reason: Type.TOptional<Type.TString>;
    details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  }>;
  readonly MemoryMigrationSummary: Type.TObject<{
    total: Type.TInteger;
    planned: Type.TInteger;
    migrated: Type.TInteger;
    skipped: Type.TInteger;
    conflicts: Type.TInteger;
    errors: Type.TInteger;
    sensitive: Type.TInteger;
  }>;
  readonly MemoryMigrationProviderPlan: Type.TObject<{
    providerId: Type.TString;
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
    planFingerprint: Type.TOptional<Type.TString>;
    found: Type.TBoolean;
    source: Type.TOptional<Type.TString>;
    target: Type.TOptional<Type.TString>;
    confidence: Type.TOptional<Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>>;
    message: Type.TOptional<Type.TString>;
    error: Type.TOptional<Type.TString>;
    summary: Type.TObject<{
      total: Type.TInteger;
      planned: Type.TInteger;
      migrated: Type.TInteger;
      skipped: Type.TInteger;
      conflicts: Type.TInteger;
      errors: Type.TInteger;
      sensitive: Type.TInteger;
    }>;
    items: Type.TArray<Type.TObject<{
      id: Type.TString;
      status: Type.TUnion<[Type.TLiteral<"planned">, Type.TLiteral<"migrated">, Type.TLiteral<"skipped">, Type.TLiteral<"warning">, Type.TLiteral<"conflict">, Type.TLiteral<"error">]>;
      source: Type.TOptional<Type.TString>;
      target: Type.TOptional<Type.TString>;
      message: Type.TOptional<Type.TString>;
      reason: Type.TOptional<Type.TString>;
      details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    }>>;
    warnings: Type.TOptional<Type.TArray<Type.TString>>;
  }>;
  readonly MigrationsMemoryPlanParams: Type.TObject<{
    agentId: Type.TString;
    overwrite: Type.TOptional<Type.TBoolean>;
  }>;
  readonly MigrationsMemoryPlanResult: Type.TObject<{
    agentId: Type.TString;
    workspace: Type.TString;
    providers: Type.TArray<Type.TObject<{
      providerId: Type.TString;
      label: Type.TString;
      description: Type.TOptional<Type.TString>;
      planFingerprint: Type.TOptional<Type.TString>;
      found: Type.TBoolean;
      source: Type.TOptional<Type.TString>;
      target: Type.TOptional<Type.TString>;
      confidence: Type.TOptional<Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>>;
      message: Type.TOptional<Type.TString>;
      error: Type.TOptional<Type.TString>;
      summary: Type.TObject<{
        total: Type.TInteger;
        planned: Type.TInteger;
        migrated: Type.TInteger;
        skipped: Type.TInteger;
        conflicts: Type.TInteger;
        errors: Type.TInteger;
        sensitive: Type.TInteger;
      }>;
      items: Type.TArray<Type.TObject<{
        id: Type.TString;
        status: Type.TUnion<[Type.TLiteral<"planned">, Type.TLiteral<"migrated">, Type.TLiteral<"skipped">, Type.TLiteral<"warning">, Type.TLiteral<"conflict">, Type.TLiteral<"error">]>;
        source: Type.TOptional<Type.TString>;
        target: Type.TOptional<Type.TString>;
        message: Type.TOptional<Type.TString>;
        reason: Type.TOptional<Type.TString>;
        details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
      }>>;
      warnings: Type.TOptional<Type.TArray<Type.TString>>;
    }>>;
  }>;
  readonly MigrationsMemoryApplyParams: Type.TObject<{
    idempotencyKey: Type.TString;
    agentId: Type.TString;
    providerId: Type.TString;
    planFingerprint: Type.TString;
    itemIds: Type.TArray<Type.TString>;
    overwrite: Type.TOptional<Type.TBoolean>;
  }>;
  readonly MigrationsMemoryApplyResult: Type.TObject<{
    providerId: Type.TString;
    source: Type.TString;
    target: Type.TOptional<Type.TString>;
    summary: Type.TObject<{
      total: Type.TInteger;
      planned: Type.TInteger;
      migrated: Type.TInteger;
      skipped: Type.TInteger;
      conflicts: Type.TInteger;
      errors: Type.TInteger;
      sensitive: Type.TInteger;
    }>;
    items: Type.TArray<Type.TObject<{
      id: Type.TString;
      status: Type.TUnion<[Type.TLiteral<"planned">, Type.TLiteral<"migrated">, Type.TLiteral<"skipped">, Type.TLiteral<"warning">, Type.TLiteral<"conflict">, Type.TLiteral<"error">]>;
      source: Type.TOptional<Type.TString>;
      target: Type.TOptional<Type.TString>;
      message: Type.TOptional<Type.TString>;
      reason: Type.TOptional<Type.TString>;
      details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    }>>;
    warnings: Type.TOptional<Type.TArray<Type.TString>>;
    backupPath: Type.TOptional<Type.TString>;
    reportDir: Type.TOptional<Type.TString>;
  }>;
};
type MemoryMigrationItem = Static<typeof MemoryMigrationItemSchema>;
type MemoryMigrationProviderPlan = Static<typeof MemoryMigrationProviderPlanSchema>;
type MigrationsMemoryPlanResult = Static<typeof MigrationsMemoryPlanResultSchema>;
type MigrationsMemoryApplyResult = Static<typeof MigrationsMemoryApplyResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/migration-api.d.ts
declare const validateMigrationsMemoryPlanParams: ProtocolValidator<{
  overwrite?: boolean | undefined;
  agentId: string;
}>;
declare const validateMigrationsMemoryApplyParams: ProtocolValidator<{
  overwrite?: boolean | undefined;
  agentId: string;
  idempotencyKey: string;
  providerId: string;
  planFingerprint: string;
  itemIds: string[];
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/agent.d.ts
/** Stream event emitted by the agent runtime over the gateway protocol. */
declare const AgentEventSchema: Type.TObject<{
  runId: Type.TString;
  seq: Type.TInteger;
  stream: Type.TString;
  ts: Type.TInteger;
  spawnedBy: Type.TOptional<Type.TString>;
  isHeartbeat: Type.TOptional<Type.TBoolean>;
  data: Type.TRecord<"^.*$", Type.TUnknown>;
}>;
/** Request to execute a channel message action through a configured adapter. */
declare const MessageActionParamsSchema: Type.TObject<{
  channel: Type.TString;
  action: Type.TString;
  params: Type.TRecord<"^.*$", Type.TUnknown>;
  accountId: Type.TOptional<Type.TString>;
  requesterAccountId: Type.TOptional<Type.TString>;
  requesterSenderId: Type.TOptional<Type.TString>;
  senderIsOwner: Type.TOptional<Type.TBoolean>;
  sessionKey: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  inboundTurnKind: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  toolContext: Type.TOptional<Type.TObject<{
    currentChannelId: Type.TOptional<Type.TString>;
    currentMessagingTarget: Type.TOptional<Type.TString>;
    currentGraphChannelId: Type.TOptional<Type.TString>;
    currentChannelProvider: Type.TOptional<Type.TString>;
    currentThreadTs: Type.TOptional<Type.TString>;
    currentMessageId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    replyToMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"first">, Type.TLiteral<"all">, Type.TLiteral<"batched">]>>;
    hasRepliedRef: Type.TOptional<Type.TObject<{
      value: Type.TBoolean;
    }>>;
    sameChannelThreadRequired: Type.TOptional<Type.TBoolean>;
    skipCrossContextDecoration: Type.TOptional<Type.TBoolean>;
  }>>;
  /**
   * Explicit operation-local marker for an authenticated direct operator.
   * Missing values remain delegated, and agent runtime identity wins server-side.
   */
  conversationReadOrigin: Type.TOptional<Type.TLiteral<"direct-operator">>;
  idempotencyKey: Type.TString;
}>;
/** Outbound send request shared by channel adapters. */
declare const SendParamsSchema: Type.TObject<{
  to: Type.TString;
  message: Type.TOptional<Type.TString>;
  mediaUrl: Type.TOptional<Type.TString>;
  mediaUrls: Type.TOptional<Type.TArray<Type.TString>>; /** Base64 attachment payload for gateway-local media materialization. */
  buffer: Type.TOptional<Type.TString>; /** Optional filename for a base64 attachment payload. */
  filename: Type.TOptional<Type.TString>; /** Optional MIME type for a base64 attachment payload. */
  contentType: Type.TOptional<Type.TString>;
  asVoice: Type.TOptional<Type.TBoolean>;
  gifPlayback: Type.TOptional<Type.TBoolean>;
  channel: Type.TOptional<Type.TString>;
  accountId: Type.TOptional<Type.TString>; /** Optional agent id for per-agent media root resolution on gateway sends. */
  agentId: Type.TOptional<Type.TString>; /** Reply target message id for native quoted/threaded sends where supported. */
  replyToId: Type.TOptional<Type.TString>; /** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */
  threadId: Type.TOptional<Type.TString>; /** Force document-style media sends where supported. */
  forceDocument: Type.TOptional<Type.TBoolean>; /** Send silently (no notification) where supported. */
  silent: Type.TOptional<Type.TBoolean>; /** Channel-specific parse mode for formatted text. */
  parseMode: Type.TOptional<Type.TLiteral<"HTML">>; /** Optional session key for mirroring delivered output back into the transcript. */
  sessionKey: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
}>;
/** Gateway-owned request that lists persisted and channel-directory addresses. */
declare const ConversationListParamsSchema: Type.TObject<{
  agentId: Type.TString;
  channel: Type.TOptional<Type.TString>;
  query: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
}>;
declare const ConversationListItemSchema: Type.TObject<{
  conversationRef: Type.TString;
  channel: Type.TString;
  accountId: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"direct">, Type.TLiteral<"group">, Type.TLiteral<"channel">]>;
  target: Type.TString;
  threadId: Type.TOptional<Type.TString>;
  label: Type.TOptional<Type.TString>;
  firstSeenAt: Type.TInteger;
  lastSeenAt: Type.TInteger;
}>;
declare const ConversationListResultSchema: Type.TObject<{
  conversations: Type.TArray<Type.TObject<{
    conversationRef: Type.TString;
    channel: Type.TString;
    accountId: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"direct">, Type.TLiteral<"group">, Type.TLiteral<"channel">]>;
    target: Type.TString;
    threadId: Type.TOptional<Type.TString>;
    label: Type.TOptional<Type.TString>;
    firstSeenAt: Type.TInteger;
    lastSeenAt: Type.TInteger;
  }>>;
}>;
/** Gateway-owned request that sends to one durable external conversation. */
declare const ConversationSendParamsSchema: Type.TObject<{
  agentId: Type.TString;
  sourceSessionKey: Type.TOptional<Type.TString>;
  operationId: Type.TString;
  conversationRef: Type.TString;
  message: Type.TString;
}>;
declare const ConversationSendResultSchema: Type.TObject<{
  status: Type.TUnion<[Type.TLiteral<"sent">, Type.TLiteral<"queued">, Type.TLiteral<"suppressed">, Type.TLiteral<"unknown">]>;
  conversationRef: Type.TString;
  channel: Type.TString;
  messageId: Type.TOptional<Type.TString>;
  queueId: Type.TOptional<Type.TString>;
}>;
/** Gateway-owned request that sends and consumes one correlated external reply inline. */
declare const ConversationTurnParamsSchema: Type.TObject<{
  agentId: Type.TString;
  sourceSessionKey: Type.TOptional<Type.TString>;
  turnId: Type.TString;
  conversationRef: Type.TString;
  message: Type.TString;
  timeoutMs: Type.TInteger;
}>;
declare const ConversationTurnCancelParamsSchema: Type.TObject<{
  agentId: Type.TString;
  turnId: Type.TString;
}>;
declare const ConversationTurnCancelResultSchema: Type.TObject<{
  cancelled: Type.TBoolean;
}>;
declare const ConversationTurnReplySchema: Type.TObject<{
  conversationRef: Type.TString;
  messageId: Type.TString;
  replyToId: Type.TOptional<Type.TString>;
  threadId: Type.TOptional<Type.TString>;
  text: Type.TString;
  timestamp: Type.TInteger;
  transcriptArtifactId: Type.TOptional<Type.TString>;
  transcriptMessageId: Type.TOptional<Type.TString>;
}>;
declare const ConversationTurnResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"replied">;
  reply: Type.TObject<{
    conversationRef: Type.TString;
    messageId: Type.TString;
    replyToId: Type.TOptional<Type.TString>;
    threadId: Type.TOptional<Type.TString>;
    text: Type.TString;
    timestamp: Type.TInteger;
    transcriptArtifactId: Type.TOptional<Type.TString>;
    transcriptMessageId: Type.TOptional<Type.TString>;
  }>;
  conversationRef: Type.TString;
  channel: Type.TString;
  messageId: Type.TString;
  correlationPersisted: Type.TBoolean;
}>, Type.TObject<{
  status: Type.TLiteral<"timeout">;
  conversationRef: Type.TString;
  channel: Type.TString;
  messageId: Type.TString;
  correlationPersisted: Type.TBoolean;
}>, Type.TObject<{
  conversationRef: Type.TString;
  channel: Type.TString;
  messageId: Type.TOptional<Type.TString>;
  correlationPersisted: Type.TBoolean;
  status: Type.TUnion<[Type.TLiteral<"sent">, Type.TLiteral<"queued">, Type.TLiteral<"suppressed">, Type.TLiteral<"unknown">]>;
  error: Type.TString;
}>]>;
/** Poll creation request for adapters that support native polls. */
declare const PollParamsSchema: Type.TObject<{
  to: Type.TString;
  question: Type.TString;
  options: Type.TArray<Type.TString>;
  maxSelections: Type.TOptional<Type.TInteger>; /** Poll duration in seconds (channel-specific limits may apply). */
  durationSeconds: Type.TOptional<Type.TInteger>;
  durationHours: Type.TOptional<Type.TInteger>; /** Send silently (no notification) where supported. */
  silent: Type.TOptional<Type.TBoolean>; /** Poll anonymity where supported (e.g. Telegram polls default to anonymous). */
  isAnonymous: Type.TOptional<Type.TBoolean>; /** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */
  threadId: Type.TOptional<Type.TString>;
  channel: Type.TOptional<Type.TString>;
  accountId: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
}>;
/** Main agent-run request accepted by the gateway. */
declare const AgentParamsSchema: Type.TObject<{
  message: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  to: Type.TOptional<Type.TString>;
  replyTo: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  expectedExistingSessionId: Type.TOptional<Type.TString>;
  thinking: Type.TOptional<Type.TString>;
  deliver: Type.TOptional<Type.TBoolean>;
  attachments: Type.TOptional<Type.TArray<Type.TUnknown>>;
  channel: Type.TOptional<Type.TString>;
  replyChannel: Type.TOptional<Type.TString>;
  accountId: Type.TOptional<Type.TString>;
  replyAccountId: Type.TOptional<Type.TString>;
  threadId: Type.TOptional<Type.TString>;
  groupId: Type.TOptional<Type.TString>;
  groupChannel: Type.TOptional<Type.TString>;
  groupSpace: Type.TOptional<Type.TString>;
  timeout: Type.TOptional<Type.TInteger>;
  bestEffortDeliver: Type.TOptional<Type.TBoolean>;
  lane: Type.TOptional<Type.TString>;
  cwd: Type.TOptional<Type.TString>;
  cleanupBundleMcpOnRunEnd: Type.TOptional<Type.TBoolean>;
  modelRun: Type.TOptional<Type.TBoolean>;
  promptMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"full">, Type.TLiteral<"minimal">, Type.TLiteral<"none">]>>;
  extraSystemPrompt: Type.TOptional<Type.TString>;
  bootstrapContextMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"full">, Type.TLiteral<"lightweight">]>>;
  bootstrapContextRunKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"default">, Type.TLiteral<"heartbeat">, Type.TLiteral<"cron">]>>;
  acpTurnSource: Type.TOptional<Type.TLiteral<"manual_spawn">>;
  internalRuntimeHandoffId: Type.TOptional<Type.TString>;
  execApprovalFollowupExpectedSessionId: Type.TOptional<Type.TString>;
  internalEvents: Type.TOptional<Type.TArray<Type.TObject<{
    type: Type.TLiteral<"task_completion">;
    source: Type.TString;
    childSessionKey: Type.TString;
    childSessionId: Type.TOptional<Type.TString>;
    announceType: Type.TString;
    taskLabel: Type.TString;
    status: Type.TString;
    statusLabel: Type.TString;
    result: Type.TString;
    attachments: Type.TOptional<Type.TArray<Type.TObject<{
      type: Type.TOptional<Type.TString>;
      path: Type.TOptional<Type.TString>;
      url: Type.TOptional<Type.TString>;
      mediaUrl: Type.TOptional<Type.TString>;
      filePath: Type.TOptional<Type.TString>;
      mimeType: Type.TOptional<Type.TString>;
      name: Type.TOptional<Type.TString>;
    }>>>;
    mediaUrls: Type.TOptional<Type.TArray<Type.TString>>;
    statsLine: Type.TOptional<Type.TString>;
    replyInstruction: Type.TString;
  }>>>;
  inputProvenance: Type.TOptional<Type.TObject<{
    kind: Type.TString;
    originSessionId: Type.TOptional<Type.TString>;
    sourceSessionKey: Type.TOptional<Type.TString>;
    sourceChannel: Type.TOptional<Type.TString>;
    sourceTool: Type.TOptional<Type.TString>;
  }>>;
  suppressPromptPersistence: Type.TOptional<Type.TBoolean>;
  sessionEffects: Type.TOptional<Type.TUnion<[Type.TLiteral<"visible">, Type.TLiteral<"internal">]>>;
  sourceReplyDeliveryMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"automatic">, Type.TLiteral<"message_tool_only">]>>;
  disableMessageTool: Type.TOptional<Type.TBoolean>;
  swarmCollector: Type.TOptional<Type.TBoolean>;
  swarmOutputSchema: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  forceRestartSafeTools: Type.TOptional<Type.TBoolean>;
  voiceWakeTrigger: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
  label: Type.TOptional<Type.TString>;
}>;
/** Identity lookup request for the current or selected agent/session. */
declare const AgentIdentityParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
}>;
/** Public display identity returned for an agent. */
declare const AgentIdentityResultSchema: Type.TObject<{
  agentId: Type.TString;
  name: Type.TOptional<Type.TString>;
  avatar: Type.TOptional<Type.TString>;
  avatarSource: Type.TOptional<Type.TString>;
  avatarStatus: Type.TOptional<Type.TString>;
  avatarReason: Type.TOptional<Type.TString>;
  emoji: Type.TOptional<Type.TString>;
}>;
/** Waits for a submitted agent run to complete or time out. */
declare const AgentWaitParamsSchema: Type.TObject<{
  runId: Type.TString;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>;
/** Wake request from external schedulers or devices into an agent session. */
declare const WakeParamsSchema: Type.TObject<{
  mode: Type.TUnion<[Type.TLiteral<"now">, Type.TLiteral<"next-heartbeat">]>;
  text: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  /**
   * Optional agent id paired with `sessionKey`. Routes multi-agent setups
   * to the agent that owns the targeted session — closes the related half
   * of #46886 ("always routes to default agent").
   */
  agentId: Type.TOptional<Type.TString>;
}>;
type AgentEvent = Static<typeof AgentEventSchema>;
type AgentIdentityParams = Static<typeof AgentIdentityParamsSchema>;
type AgentIdentityResult = Static<typeof AgentIdentityResultSchema>;
type ConversationListParams = Static<typeof ConversationListParamsSchema>;
type ConversationListItem = Static<typeof ConversationListItemSchema>;
type ConversationListResult = Static<typeof ConversationListResultSchema>;
type ConversationSendParams = Static<typeof ConversationSendParamsSchema>;
type ConversationSendResult = Static<typeof ConversationSendResultSchema>;
type ConversationTurnParams = Static<typeof ConversationTurnParamsSchema>;
type ConversationTurnCancelParams = Static<typeof ConversationTurnCancelParamsSchema>;
type ConversationTurnCancelResult = Static<typeof ConversationTurnCancelResultSchema>;
type ConversationTurnReply = Static<typeof ConversationTurnReplySchema>;
type ConversationTurnResult = Static<typeof ConversationTurnResultSchema>;
type PollParams = Static<typeof PollParamsSchema>;
type AgentWaitParams = Static<typeof AgentWaitParamsSchema>;
type WakeParams = Static<typeof WakeParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/agents-models-skills.d.ts
/** Condensed agent record returned by list APIs. */
declare const AgentSummarySchema: Type.TObject<{
  id: Type.TString;
  name: Type.TOptional<Type.TString>;
  identity: Type.TOptional<Type.TObject<{
    name: Type.TOptional<Type.TString>;
    theme: Type.TOptional<Type.TString>;
    emoji: Type.TOptional<Type.TString>;
    avatar: Type.TOptional<Type.TString>;
    avatarUrl: Type.TOptional<Type.TString>;
  }>>;
  workspace: Type.TOptional<Type.TString>;
  workspaceGit: Type.TOptional<Type.TBoolean>;
  model: Type.TOptional<Type.TObject<{
    primary: Type.TOptional<Type.TString>;
    fallbacks: Type.TOptional<Type.TArray<Type.TString>>;
  }>>;
  agentRuntime: Type.TOptional<Type.TObject<{
    id: Type.TString;
    fallback: Type.TOptional<Type.TUnion<[Type.TLiteral<"openclaw">, Type.TLiteral<"none">]>>;
    source: Type.TUnion<[Type.TLiteral<"env">, Type.TLiteral<"agent">, Type.TLiteral<"defaults">, Type.TLiteral<"model">, Type.TLiteral<"provider">, Type.TLiteral<"implicit">, Type.TLiteral<"session">, Type.TLiteral<"session-key">]>;
  }>>;
  thinkingLevels: Type.TOptional<Type.TArray<Type.TObject<{
    id: Type.TString;
    label: Type.TString;
  }>>>;
  thinkingOptions: Type.TOptional<Type.TArray<Type.TString>>;
  thinkingDefault: Type.TOptional<Type.TString>;
}>;
/** Empty request payload for listing configured agents. */
declare const AgentsListParamsSchema: Type.TObject<{}>;
/** Agent list result including the default agent and session scoping mode. */
declare const AgentsListResultSchema: Type.TObject<{
  defaultId: Type.TString;
  mainKey: Type.TString;
  scope: Type.TUnion<[Type.TLiteral<"per-sender">, Type.TLiteral<"global">]>;
  agents: Type.TArray<Type.TObject<{
    id: Type.TString;
    name: Type.TOptional<Type.TString>;
    identity: Type.TOptional<Type.TObject<{
      name: Type.TOptional<Type.TString>;
      theme: Type.TOptional<Type.TString>;
      emoji: Type.TOptional<Type.TString>;
      avatar: Type.TOptional<Type.TString>;
      avatarUrl: Type.TOptional<Type.TString>;
    }>>;
    workspace: Type.TOptional<Type.TString>;
    workspaceGit: Type.TOptional<Type.TBoolean>;
    model: Type.TOptional<Type.TObject<{
      primary: Type.TOptional<Type.TString>;
      fallbacks: Type.TOptional<Type.TArray<Type.TString>>;
    }>>;
    agentRuntime: Type.TOptional<Type.TObject<{
      id: Type.TString;
      fallback: Type.TOptional<Type.TUnion<[Type.TLiteral<"openclaw">, Type.TLiteral<"none">]>>;
      source: Type.TUnion<[Type.TLiteral<"env">, Type.TLiteral<"agent">, Type.TLiteral<"defaults">, Type.TLiteral<"model">, Type.TLiteral<"provider">, Type.TLiteral<"implicit">, Type.TLiteral<"session">, Type.TLiteral<"session-key">]>;
    }>>;
    thinkingLevels: Type.TOptional<Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
    }>>>;
    thinkingOptions: Type.TOptional<Type.TArray<Type.TString>>;
    thinkingDefault: Type.TOptional<Type.TString>;
  }>>;
}>;
/** Creates a configured agent; the server supplies an omitted workspace. */
declare const AgentsCreateParamsSchema: Type.TObject<{
  name: Type.TString;
  workspace: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  emoji: Type.TOptional<Type.TString>;
  avatar: Type.TOptional<Type.TString>;
}>;
/** Result returned after creating an agent. */
declare const AgentsCreateResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  agentId: Type.TString;
  name: Type.TString;
  workspace: Type.TString;
  model: Type.TOptional<Type.TString>;
}>;
/** Updates mutable agent identity, workspace, and model fields; null clears the model override. */
declare const AgentsUpdateParamsSchema: Type.TObject<{
  agentId: Type.TString;
  name: Type.TOptional<Type.TString>;
  workspace: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  emoji: Type.TOptional<Type.TString>;
  avatar: Type.TOptional<Type.TString>;
}>;
/** Result returned after updating an agent. */
declare const AgentsUpdateResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  agentId: Type.TString;
}>;
/** Deletes an agent and optionally its workspace/config files. */
declare const AgentsDeleteParamsSchema: Type.TObject<{
  agentId: Type.TString;
  deleteFiles: Type.TOptional<Type.TBoolean>;
}>;
/** Result returned after deleting an agent and unbinding sessions. */
declare const AgentsDeleteResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  agentId: Type.TString;
  removedBindings: Type.TInteger;
  removed: Type.TOptional<Type.TArray<Type.TObject<{
    path: Type.TString;
    method: Type.TUnion<[Type.TLiteral<"trash">, Type.TLiteral<"missing">]>;
  }>>>;
  failed: Type.TOptional<Type.TArray<Type.TObject<{
    path: Type.TString;
    reason: Type.TString;
  }>>>;
}>;
/** File metadata and optional content for agent-local editable files. */
declare const AgentsFileEntrySchema: Type.TObject<{
  name: Type.TString;
  path: Type.TString;
  missing: Type.TBoolean;
  size: Type.TOptional<Type.TInteger>;
  updatedAtMs: Type.TOptional<Type.TInteger>;
  content: Type.TOptional<Type.TString>;
}>;
/** Lists editable files for one agent. */
declare const AgentsFilesListParamsSchema: Type.TObject<{
  agentId: Type.TString;
}>;
/** Editable file list for an agent workspace. */
declare const AgentsFilesListResultSchema: Type.TObject<{
  agentId: Type.TString;
  workspace: Type.TString;
  files: Type.TArray<Type.TObject<{
    name: Type.TString;
    path: Type.TString;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
  }>>;
}>;
/** Reads one editable agent file by name. */
declare const AgentsFilesGetParamsSchema: Type.TObject<{
  agentId: Type.TString;
  name: Type.TString;
}>;
/** Result for reading one editable agent file. */
declare const AgentsFilesGetResultSchema: Type.TObject<{
  agentId: Type.TString;
  workspace: Type.TString;
  file: Type.TObject<{
    name: Type.TString;
    path: Type.TString;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
  }>;
}>;
/** Writes one editable agent file. */
declare const AgentsFilesSetParamsSchema: Type.TObject<{
  agentId: Type.TString;
  name: Type.TString;
  content: Type.TString;
}>;
/** Result returned after writing an editable agent file. */
declare const AgentsFilesSetResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  agentId: Type.TString;
  workspace: Type.TString;
  file: Type.TObject<{
    name: Type.TString;
    path: Type.TString;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
  }>;
}>;
/** Model catalog request with optional visibility scope. */
declare const ModelsListParamsSchema: Type.TObject<{
  includeProviderCapabilities: Type.TOptional<Type.TBoolean>;
  view: Type.TOptional<Type.TUnion<[Type.TLiteral<"default">, Type.TLiteral<"configured">, Type.TLiteral<"provider-config">, Type.TLiteral<"all">]>>;
}>;
/** Runs a bounded live credential probe for one model provider. */
declare const ModelsProbeParamsSchema: Type.TObject<{
  provider: Type.TString;
  profileId: Type.TOptional<Type.TString>;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>;
declare const AuthProbeStatusSchema: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"auth">, Type.TLiteral<"rate_limit">, Type.TLiteral<"billing">, Type.TLiteral<"timeout">, Type.TLiteral<"format">, Type.TLiteral<"unknown">, Type.TLiteral<"no_model">]>;
/** Secret-free result for one provider credential target. */
declare const ModelsProbeTargetResultSchema: Type.TObject<{
  profileId: Type.TOptional<Type.TString>;
  label: Type.TString;
  status: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"auth">, Type.TLiteral<"rate_limit">, Type.TLiteral<"billing">, Type.TLiteral<"timeout">, Type.TLiteral<"format">, Type.TLiteral<"unknown">, Type.TLiteral<"no_model">]>;
  latencyMs: Type.TOptional<Type.TInteger>;
  error: Type.TOptional<Type.TString>;
}>;
/** Provider-level live probe rollup plus per-credential results. */
declare const ModelsProbeResultSchema: Type.TObject<{
  provider: Type.TString;
  status: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"auth">, Type.TLiteral<"rate_limit">, Type.TLiteral<"billing">, Type.TLiteral<"timeout">, Type.TLiteral<"format">, Type.TLiteral<"unknown">, Type.TLiteral<"no_model">]>;
  latencyMs: Type.TOptional<Type.TInteger>;
  error: Type.TOptional<Type.TString>;
  results: Type.TArray<Type.TObject<{
    profileId: Type.TOptional<Type.TString>;
    label: Type.TString;
    status: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"auth">, Type.TLiteral<"rate_limit">, Type.TLiteral<"billing">, Type.TLiteral<"timeout">, Type.TLiteral<"format">, Type.TLiteral<"unknown">, Type.TLiteral<"no_model">]>;
    latencyMs: Type.TOptional<Type.TInteger>;
    error: Type.TOptional<Type.TString>;
  }>>;
}>;
/** Reads installed skill status, optionally for a selected agent. */
declare const SkillsStatusParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
}>;
/** Empty request payload for listing available skill bins. */
declare const SkillsBinsParamsSchema: Type.TObject<{}>;
/** Skill bin names available to the gateway. */
declare const SkillsBinsResultSchema: Type.TObject<{
  bins: Type.TArray<Type.TString>;
}>;
/** Starts a chunked skill archive upload. */
declare const SkillsUploadBeginParamsSchema: Type.TObject<{
  kind: Type.TLiteral<"skill-archive">;
  slug: Type.TString;
  sizeBytes: Type.TInteger;
  sha256: Type.TOptional<Type.TString>;
  force: Type.TOptional<Type.TBoolean>;
  idempotencyKey: Type.TOptional<Type.TString>;
}>;
/** Uploads one base64-encoded chunk for a skill archive. */
declare const SkillsUploadChunkParamsSchema: Type.TObject<{
  uploadId: Type.TString;
  offset: Type.TInteger;
  dataBase64: Type.TString;
}>;
/** Commits a completed skill archive upload. */
declare const SkillsUploadCommitParamsSchema: Type.TObject<{
  uploadId: Type.TString;
  sha256: Type.TOptional<Type.TString>;
}>;
/** Installs a skill from legacy install id, ClawHub, or uploaded archive. */
declare const SkillsInstallParamsSchema: Type.TUnion<[Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  name: Type.TString;
  installId: Type.TString;
  dangerouslyForceUnsafeInstall: Type.TOptional<Type.TBoolean>;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>, Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  source: Type.TLiteral<"clawhub">;
  slug: Type.TString;
  version: Type.TOptional<Type.TString>;
  force: Type.TOptional<Type.TBoolean>;
  acknowledgeClawHubRisk: Type.TOptional<Type.TBoolean>;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>, Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  source: Type.TLiteral<"upload">;
  uploadId: Type.TString;
  slug: Type.TString;
  force: Type.TOptional<Type.TBoolean>;
  sha256: Type.TOptional<Type.TString>;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>]>;
/** Updates installed skill settings or refreshes ClawHub-installed skills. */
declare const SkillsUpdateParamsSchema: Type.TUnion<[Type.TObject<{
  skillKey: Type.TString;
  enabled: Type.TOptional<Type.TBoolean>;
  apiKey: Type.TOptional<Type.TString>;
  env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
}>, Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  source: Type.TLiteral<"clawhub">;
  slug: Type.TOptional<Type.TString>;
  all: Type.TOptional<Type.TBoolean>;
  acknowledgeClawHubRisk: Type.TOptional<Type.TBoolean>;
}>]>;
/** Searches the skill registry. */
declare const SkillsSearchParamsSchema: Type.TObject<{
  query: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
}>;
/** Ranked skill registry search results. */
declare const SkillsSearchResultSchema: Type.TObject<{
  results: Type.TArray<Type.TObject<{
    score: Type.TNumber;
    slug: Type.TString;
    displayName: Type.TString;
    summary: Type.TOptional<Type.TString>;
    version: Type.TOptional<Type.TString>;
    updatedAt: Type.TOptional<Type.TInteger>;
  }>>;
}>;
/** Reads registry detail for one skill slug. */
declare const SkillsDetailParamsSchema: Type.TObject<{
  slug: Type.TString;
}>;
/** Reads current security verdicts for configured skills. */
declare const SkillsSecurityVerdictsParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
}>;
/** Skill registry detail, latest version, metadata, and owner info. */
declare const SkillsDetailResultSchema: Type.TObject<{
  skill: Type.TUnion<[Type.TObject<{
    slug: Type.TString;
    displayName: Type.TString;
    summary: Type.TOptional<Type.TString>;
    tags: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    channel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    isOfficial: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TNull]>>;
    createdAt: Type.TInteger;
    updatedAt: Type.TInteger;
  }>, Type.TNull]>;
  latestVersion: Type.TOptional<Type.TUnion<[Type.TObject<{
    version: Type.TString;
    createdAt: Type.TInteger;
    changelog: Type.TOptional<Type.TString>;
  }>, Type.TNull]>>;
  metadata: Type.TOptional<Type.TUnion<[Type.TObject<{
    os: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
    systems: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
  }>, Type.TNull]>>;
  owner: Type.TOptional<Type.TUnion<[Type.TObject<{
    handle: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    displayName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    image: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    official: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TNull]>>;
    channel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    isOfficial: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TNull]>>;
  }>, Type.TNull]>>;
}>;
/** Security verdict report for installed/requested skills. */
declare const SkillsSecurityVerdictsResultSchema: Type.TObject<{
  schema: Type.TLiteral<"openclaw.skills.security-verdicts.v1">;
  items: Type.TArray<Type.TObject<{
    registry: Type.TString;
    ok: Type.TBoolean;
    decision: Type.TString;
    reasons: Type.TArray<Type.TString>;
    requestedSlug: Type.TString;
    requestedVersion: Type.TString;
    slug: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    version: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    displayName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    publisherHandle: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    publisherDisplayName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    createdAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    checkedAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    skillUrl: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    securityAuditUrl: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    securityStatus: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    securityPassed: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TNull]>>;
    error: Type.TOptional<Type.TObject<{
      code: Type.TOptional<Type.TString>;
      message: Type.TOptional<Type.TString>;
    }>>;
  }>>;
}>;
/** Reads the rendered skill card for one installed skill. */
declare const SkillsSkillCardParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  skillKey: Type.TString;
}>;
/** Rendered skill card content and file metadata. */
declare const SkillsSkillCardResultSchema: Type.TObject<{
  schema: Type.TLiteral<"openclaw.skills.skill-card.v1">;
  skillKey: Type.TString;
  path: Type.TString;
  sizeBytes: Type.TInteger;
  content: Type.TString;
}>;
/** Lists skill-workshop proposals for the selected agent scope. */
declare const SkillsProposalsListParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
}>;
/** Proposal manifest response for dashboard/workshop list views. */
declare const SkillsProposalsListResultSchema: Type.TObject<{
  schema: Type.TLiteral<"openclaw.skill-workshop.proposals-manifest.v1">;
  updatedAt: Type.TString;
  proposals: Type.TArray<Type.TObject<{
    id: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"create">, Type.TLiteral<"update">]>;
    status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"applied">, Type.TLiteral<"rejected">, Type.TLiteral<"quarantined">, Type.TLiteral<"stale">]>;
    title: Type.TString;
    description: Type.TString;
    skillName: Type.TString;
    skillKey: Type.TString;
    createdAt: Type.TString;
    updatedAt: Type.TString;
    scanState: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"clean">, Type.TLiteral<"failed">, Type.TLiteral<"quarantined">]>;
  }>>;
}>;
/** Reads a proposal record plus editable draft/support content. */
declare const SkillsProposalInspectParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  proposalId: Type.TString;
}>;
/** Full proposal inspection result used before apply/revise decisions. */
declare const SkillsProposalInspectResultSchema: Type.TObject<{
  record: Type.TObject<{
    schema: Type.TLiteral<"openclaw.skill-workshop.proposal.v1">;
    id: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"create">, Type.TLiteral<"update">]>;
    status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"applied">, Type.TLiteral<"rejected">, Type.TLiteral<"quarantined">, Type.TLiteral<"stale">]>;
    title: Type.TString;
    description: Type.TString;
    createdAt: Type.TString;
    updatedAt: Type.TString;
    createdBy: Type.TUnion<[Type.TLiteral<"skill-workshop">, Type.TLiteral<"cli">, Type.TLiteral<"gateway">]>;
    origin: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
      runId: Type.TOptional<Type.TString>;
      messageId: Type.TOptional<Type.TString>;
    }>>;
    proposedVersion: Type.TString;
    draftFile: Type.TLiteral<"PROPOSAL.md">;
    draftHash: Type.TString;
    supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
      path: Type.TString;
      sizeBytes: Type.TInteger;
      hash: Type.TString;
      targetExisted: Type.TOptional<Type.TBoolean>;
      targetContentHash: Type.TOptional<Type.TString>;
    }>>>;
    target: Type.TObject<{
      skillName: Type.TString;
      skillKey: Type.TString;
      skillDir: Type.TString;
      skillFile: Type.TString;
      source: Type.TOptional<Type.TString>;
      currentContentHash: Type.TOptional<Type.TString>;
    }>;
    scan: Type.TObject<{
      state: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"clean">, Type.TLiteral<"failed">, Type.TLiteral<"quarantined">]>;
      scannedAt: Type.TString;
      critical: Type.TInteger;
      warn: Type.TInteger;
      info: Type.TInteger;
      findings: Type.TArray<Type.TObject<{
        ruleId: Type.TString;
        severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"critical">]>;
        file: Type.TString;
        line: Type.TInteger;
        message: Type.TString;
        evidence: Type.TString;
      }>>;
    }>;
    goal: Type.TOptional<Type.TString>;
    evidence: Type.TOptional<Type.TString>;
    appliedAt: Type.TOptional<Type.TString>;
    rejectedAt: Type.TOptional<Type.TString>;
    quarantinedAt: Type.TOptional<Type.TString>;
    staleAt: Type.TOptional<Type.TString>;
    statusReason: Type.TOptional<Type.TString>;
  }>;
  content: Type.TString;
  supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
    path: Type.TString;
    content: Type.TString;
  }>>>;
}>;
/** Creates a proposal for a new skill. */
declare const SkillsProposalCreateParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  name: Type.TString;
  description: Type.TString;
  content: Type.TString;
  supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
    path: Type.TString;
    content: Type.TString;
  }>>>;
  goal: Type.TOptional<Type.TString>;
  evidence: Type.TOptional<Type.TString>;
}>;
/** Creates a proposal to update an existing skill. */
declare const SkillsProposalUpdateParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  skillName: Type.TString;
  description: Type.TOptional<Type.TString>;
  content: Type.TString;
  supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
    path: Type.TString;
    content: Type.TString;
  }>>>;
  goal: Type.TOptional<Type.TString>;
  evidence: Type.TOptional<Type.TString>;
}>;
/** Replaces draft content/support files for an existing proposal. */
declare const SkillsProposalReviseParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  proposalId: Type.TString;
  content: Type.TString;
  supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
    path: Type.TString;
    content: Type.TString;
  }>>>;
  description: Type.TOptional<Type.TString>;
  goal: Type.TOptional<Type.TString>;
  evidence: Type.TOptional<Type.TString>;
}>;
/** Starts an agent turn that revises a pending proposal from natural-language instructions. */
declare const SkillsProposalRequestRevisionParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  targetAgentId: Type.TOptional<Type.TString>;
  proposalId: Type.TString;
  instructions: Type.TString;
  sessionKey: Type.TString;
  sessionId: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
}>;
/** Chat-run acknowledgement returned after queueing a Skill Workshop revision request. */
declare const SkillsProposalRequestRevisionResultSchema: Type.TObject<{
  runId: Type.TString;
  status: Type.TUnion<[Type.TLiteral<"started">, Type.TLiteral<"in_flight">, Type.TLiteral<"ok">, Type.TLiteral<"timeout">, Type.TLiteral<"error">]>;
}>;
/** Shared approve/reject/quarantine action payload for one proposal. */
declare const SkillsProposalActionParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  proposalId: Type.TString;
  reason: Type.TOptional<Type.TString>;
}>;
/** Result returned after applying a skill proposal to disk. */
declare const SkillsProposalApplyResultSchema: Type.TObject<{
  record: Type.TObject<{
    schema: Type.TLiteral<"openclaw.skill-workshop.proposal.v1">;
    id: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"create">, Type.TLiteral<"update">]>;
    status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"applied">, Type.TLiteral<"rejected">, Type.TLiteral<"quarantined">, Type.TLiteral<"stale">]>;
    title: Type.TString;
    description: Type.TString;
    createdAt: Type.TString;
    updatedAt: Type.TString;
    createdBy: Type.TUnion<[Type.TLiteral<"skill-workshop">, Type.TLiteral<"cli">, Type.TLiteral<"gateway">]>;
    origin: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
      runId: Type.TOptional<Type.TString>;
      messageId: Type.TOptional<Type.TString>;
    }>>;
    proposedVersion: Type.TString;
    draftFile: Type.TLiteral<"PROPOSAL.md">;
    draftHash: Type.TString;
    supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
      path: Type.TString;
      sizeBytes: Type.TInteger;
      hash: Type.TString;
      targetExisted: Type.TOptional<Type.TBoolean>;
      targetContentHash: Type.TOptional<Type.TString>;
    }>>>;
    target: Type.TObject<{
      skillName: Type.TString;
      skillKey: Type.TString;
      skillDir: Type.TString;
      skillFile: Type.TString;
      source: Type.TOptional<Type.TString>;
      currentContentHash: Type.TOptional<Type.TString>;
    }>;
    scan: Type.TObject<{
      state: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"clean">, Type.TLiteral<"failed">, Type.TLiteral<"quarantined">]>;
      scannedAt: Type.TString;
      critical: Type.TInteger;
      warn: Type.TInteger;
      info: Type.TInteger;
      findings: Type.TArray<Type.TObject<{
        ruleId: Type.TString;
        severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"critical">]>;
        file: Type.TString;
        line: Type.TInteger;
        message: Type.TString;
        evidence: Type.TString;
      }>>;
    }>;
    goal: Type.TOptional<Type.TString>;
    evidence: Type.TOptional<Type.TString>;
    appliedAt: Type.TOptional<Type.TString>;
    rejectedAt: Type.TOptional<Type.TString>;
    quarantinedAt: Type.TOptional<Type.TString>;
    staleAt: Type.TOptional<Type.TString>;
    statusReason: Type.TOptional<Type.TString>;
  }>;
  targetSkillFile: Type.TString;
}>;
/** Proposal record result returned after non-apply proposal actions. */
declare const SkillsProposalRecordResultSchema: Type.TObject<{
  schema: Type.TLiteral<"openclaw.skill-workshop.proposal.v1">;
  id: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"create">, Type.TLiteral<"update">]>;
  status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"applied">, Type.TLiteral<"rejected">, Type.TLiteral<"quarantined">, Type.TLiteral<"stale">]>;
  title: Type.TString;
  description: Type.TString;
  createdAt: Type.TString;
  updatedAt: Type.TString;
  createdBy: Type.TUnion<[Type.TLiteral<"skill-workshop">, Type.TLiteral<"cli">, Type.TLiteral<"gateway">]>;
  origin: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    messageId: Type.TOptional<Type.TString>;
  }>>;
  proposedVersion: Type.TString;
  draftFile: Type.TLiteral<"PROPOSAL.md">;
  draftHash: Type.TString;
  supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
    path: Type.TString;
    sizeBytes: Type.TInteger;
    hash: Type.TString;
    targetExisted: Type.TOptional<Type.TBoolean>;
    targetContentHash: Type.TOptional<Type.TString>;
  }>>>;
  target: Type.TObject<{
    skillName: Type.TString;
    skillKey: Type.TString;
    skillDir: Type.TString;
    skillFile: Type.TString;
    source: Type.TOptional<Type.TString>;
    currentContentHash: Type.TOptional<Type.TString>;
  }>;
  scan: Type.TObject<{
    state: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"clean">, Type.TLiteral<"failed">, Type.TLiteral<"quarantined">]>;
    scannedAt: Type.TString;
    critical: Type.TInteger;
    warn: Type.TInteger;
    info: Type.TInteger;
    findings: Type.TArray<Type.TObject<{
      ruleId: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"critical">]>;
      file: Type.TString;
      line: Type.TInteger;
      message: Type.TString;
      evidence: Type.TString;
    }>>;
  }>;
  goal: Type.TOptional<Type.TString>;
  evidence: Type.TOptional<Type.TString>;
  appliedAt: Type.TOptional<Type.TString>;
  rejectedAt: Type.TOptional<Type.TString>;
  quarantinedAt: Type.TOptional<Type.TString>;
  staleAt: Type.TOptional<Type.TString>;
  statusReason: Type.TOptional<Type.TString>;
}>;
/** Reads persisted skill lifecycle curation state. */
declare const SkillsCuratorStatusParamsSchema: Type.TObject<{}>;
declare const SkillsCuratorStatusResultSchema: Type.TObject<{
  lastAttemptAtMs: Type.TUnion<[Type.TNumber, Type.TNull]>;
  lastSuccessAtMs: Type.TUnion<[Type.TNumber, Type.TNull]>;
  lastError: Type.TUnion<[Type.TString, Type.TNull]>;
  counts: Type.TObject<{
    active: Type.TNumber;
    stale: Type.TNumber;
    archived: Type.TNumber;
  }>;
  skills: Type.TArray<Type.TObject<{
    skillFile: Type.TString;
    skillKey: Type.TString;
    skillName: Type.TString;
    state: Type.TUnion<[Type.TLiteral<"active">, Type.TLiteral<"stale">, Type.TLiteral<"archived">]>;
    pinned: Type.TBoolean;
    createdAtMs: Type.TNumber;
    stateChangedAtMs: Type.TNumber;
    lastUsedAtMs: Type.TUnion<[Type.TNumber, Type.TNull]>;
    useCount: Type.TNumber;
    archivedReason: Type.TUnion<[Type.TString, Type.TNull]>;
  }>>;
  overlaps: Type.TArray<Type.TObject<{
    left: Type.TString;
    right: Type.TString;
    score: Type.TNumber;
  }>>;
}>;
/** Pins, unpins, or explicitly restores one curated skill. */
declare const SkillsCuratorActionParamsSchema: Type.TObject<{
  skill: Type.TString;
}>;
declare const SkillsCuratorActionResultSchema: Type.TObject<{
  skillFile: Type.TString;
  skillKey: Type.TString;
  skillName: Type.TString;
  state: Type.TUnion<[Type.TLiteral<"active">, Type.TLiteral<"stale">, Type.TLiteral<"archived">]>;
  pinned: Type.TBoolean;
  createdAtMs: Type.TNumber;
  stateChangedAtMs: Type.TNumber;
  lastUsedAtMs: Type.TUnion<[Type.TNumber, Type.TNull]>;
  useCount: Type.TNumber;
  archivedReason: Type.TUnion<[Type.TString, Type.TNull]>;
}>;
/** Reads the configured tool catalog for an agent. */
declare const ToolsCatalogParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  includePlugins: Type.TOptional<Type.TBoolean>;
}>;
/** Reads the effective tool set for one session. */
declare const ToolsEffectiveParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TString;
}>;
/** Invokes one tool through the gateway tool dispatcher. */
declare const ToolsInvokeParamsSchema: Type.TObject<{
  name: Type.TString;
  args: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  sessionKey: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  confirm: Type.TOptional<Type.TBoolean>;
  idempotencyKey: Type.TOptional<Type.TString>;
  /**
   * Explicit operation-local marker for an authenticated direct operator.
   * Missing values remain delegated, and agent runtime identity wins server-side.
   */
  conversationReadOrigin: Type.TOptional<Type.TLiteral<"direct-operator">>;
}>;
/** Tool catalog result for agent configuration UI. */
declare const ToolsCatalogResultSchema: Type.TObject<{
  agentId: Type.TString;
  profiles: Type.TArray<Type.TObject<{
    id: Type.TUnion<[Type.TLiteral<"minimal">, Type.TLiteral<"coding">, Type.TLiteral<"messaging">, Type.TLiteral<"full">]>;
    label: Type.TString;
  }>>;
  groups: Type.TArray<Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">]>;
    pluginId: Type.TOptional<Type.TString>;
    tools: Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
      description: Type.TString;
      source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">]>;
      pluginId: Type.TOptional<Type.TString>;
      optional: Type.TOptional<Type.TBoolean>;
      risk: Type.TOptional<Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>>;
      tags: Type.TOptional<Type.TArray<Type.TString>>;
      defaultProfiles: Type.TArray<Type.TUnion<[Type.TLiteral<"minimal">, Type.TLiteral<"coding">, Type.TLiteral<"messaging">, Type.TLiteral<"full">]>>;
    }>>;
  }>>;
}>;
/** Effective tool set for a session, including profile and filtering notices. */
declare const ToolsEffectiveResultSchema: Type.TObject<{
  agentId: Type.TString;
  profile: Type.TString;
  groups: Type.TArray<Type.TObject<{
    id: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">, Type.TLiteral<"channel">, Type.TLiteral<"mcp">]>;
    label: Type.TString;
    source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">, Type.TLiteral<"channel">, Type.TLiteral<"mcp">]>;
    tools: Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
      description: Type.TString;
      rawDescription: Type.TString;
      source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">, Type.TLiteral<"channel">, Type.TLiteral<"mcp">]>;
      pluginId: Type.TOptional<Type.TString>;
      channelId: Type.TOptional<Type.TString>;
      risk: Type.TOptional<Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>>;
      tags: Type.TOptional<Type.TArray<Type.TString>>;
    }>>;
  }>>;
  notices: Type.TOptional<Type.TArray<Type.TObject<{
    id: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">]>;
    message: Type.TString;
  }>>>;
}>;
/** Tool invocation result, including approval handoff when required. */
declare const ToolsInvokeResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  toolName: Type.TString;
  output: Type.TOptional<Type.TUnknown>;
  requiresApproval: Type.TOptional<Type.TBoolean>;
  approvalId: Type.TOptional<Type.TString>;
  source: Type.TOptional<Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">, Type.TLiteral<"mcp">, Type.TLiteral<"channel">, Type.TString]>>;
  error: Type.TOptional<Type.TObject<{
    code: Type.TString;
    message: Type.TString;
    details: Type.TOptional<Type.TUnknown>;
  }>>;
}>;
type AgentSummary = Static<typeof AgentSummarySchema>;
type AgentsFileEntry = Static<typeof AgentsFileEntrySchema>;
type AgentsCreateParams = Static<typeof AgentsCreateParamsSchema>;
type AgentsCreateResult = Static<typeof AgentsCreateResultSchema>;
type AgentsUpdateParams = Static<typeof AgentsUpdateParamsSchema>;
type AgentsUpdateResult = Static<typeof AgentsUpdateResultSchema>;
type AgentsDeleteParams = Static<typeof AgentsDeleteParamsSchema>;
type AgentsDeleteResult = Static<typeof AgentsDeleteResultSchema>;
type AgentsFilesListParams = Static<typeof AgentsFilesListParamsSchema>;
type AgentsFilesListResult = Static<typeof AgentsFilesListResultSchema>;
type AgentsFilesGetParams = Static<typeof AgentsFilesGetParamsSchema>;
type AgentsFilesGetResult = Static<typeof AgentsFilesGetResultSchema>;
type AgentsFilesSetParams = Static<typeof AgentsFilesSetParamsSchema>;
type AgentsFilesSetResult = Static<typeof AgentsFilesSetResultSchema>;
type AgentsListParams = Static<typeof AgentsListParamsSchema>;
type AgentsListResult = Static<typeof AgentsListResultSchema>;
type AuthProbeStatus = Static<typeof AuthProbeStatusSchema>;
type ModelsProbeParams = Static<typeof ModelsProbeParamsSchema>;
type ModelsProbeTargetResult = Static<typeof ModelsProbeTargetResultSchema>;
type ModelsProbeResult = Static<typeof ModelsProbeResultSchema>;
type SkillsStatusParams = Static<typeof SkillsStatusParamsSchema>;
type ToolsCatalogParams = Static<typeof ToolsCatalogParamsSchema>;
type ToolsCatalogResult = Static<typeof ToolsCatalogResultSchema>;
type ToolsEffectiveParams = Static<typeof ToolsEffectiveParamsSchema>;
type ToolsEffectiveResult = Static<typeof ToolsEffectiveResultSchema>;
type ToolsInvokeParams = Static<typeof ToolsInvokeParamsSchema>;
type ToolsInvokeResult = Static<typeof ToolsInvokeResultSchema>;
type SkillsBinsParams = Static<typeof SkillsBinsParamsSchema>;
type SkillsBinsResult = Static<typeof SkillsBinsResultSchema>;
type SkillsSearchParams = Static<typeof SkillsSearchParamsSchema>;
type SkillsSearchResult = Static<typeof SkillsSearchResultSchema>;
type SkillsDetailParams = Static<typeof SkillsDetailParamsSchema>;
type SkillsDetailResult = Static<typeof SkillsDetailResultSchema>;
type SkillsProposalsListParams = Static<typeof SkillsProposalsListParamsSchema>;
type SkillsProposalsListResult = Static<typeof SkillsProposalsListResultSchema>;
type SkillsProposalInspectParams = Static<typeof SkillsProposalInspectParamsSchema>;
type SkillsProposalInspectResult = Static<typeof SkillsProposalInspectResultSchema>;
type SkillsProposalCreateParams = Static<typeof SkillsProposalCreateParamsSchema>;
type SkillsProposalUpdateParams = Static<typeof SkillsProposalUpdateParamsSchema>;
type SkillsProposalReviseParams = Static<typeof SkillsProposalReviseParamsSchema>;
type SkillsProposalRequestRevisionParams = Static<typeof SkillsProposalRequestRevisionParamsSchema>;
type SkillsProposalRequestRevisionResult = Static<typeof SkillsProposalRequestRevisionResultSchema>;
type SkillsProposalActionParams = Static<typeof SkillsProposalActionParamsSchema>;
type SkillsProposalApplyResult = Static<typeof SkillsProposalApplyResultSchema>;
type SkillsProposalRecordResult = Static<typeof SkillsProposalRecordResultSchema>;
type SkillsCuratorStatusParams = Static<typeof SkillsCuratorStatusParamsSchema>;
type SkillsCuratorStatusResult = Static<typeof SkillsCuratorStatusResultSchema>;
type SkillsCuratorActionParams = Static<typeof SkillsCuratorActionParamsSchema>;
type SkillsCuratorActionResult = Static<typeof SkillsCuratorActionResultSchema>;
type SkillsSecurityVerdictsParams = Static<typeof SkillsSecurityVerdictsParamsSchema>;
type SkillsSecurityVerdictsResult = Static<typeof SkillsSecurityVerdictsResultSchema>;
type SkillsSkillCardParams = Static<typeof SkillsSkillCardParamsSchema>;
type SkillsSkillCardResult = Static<typeof SkillsSkillCardResultSchema>;
type SkillsUploadBeginParams = Static<typeof SkillsUploadBeginParamsSchema>;
type SkillsUploadChunkParams = Static<typeof SkillsUploadChunkParamsSchema>;
type SkillsUploadCommitParams = Static<typeof SkillsUploadCommitParamsSchema>;
type SkillsInstallParams = Static<typeof SkillsInstallParamsSchema>;
type SkillsUpdateParams = Static<typeof SkillsUpdateParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/agents-workspace.d.ts
/**
 * Read-only agent workspace browsing schemas.
 *
 * These contracts back the workspace file browser in operator clients
 * (mobile apps, Control UI). The surface is intentionally read-only:
 * write/delete/upload stay out of this namespace until a separately
 * reviewed mutation contract exists.
 */
/** One file or folder in an agent workspace directory listing. */
declare const AgentsWorkspaceEntrySchema: Type.TObject<{
  path: Type.TString;
  name: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
  size: Type.TOptional<Type.TInteger>;
  updatedAtMs: Type.TOptional<Type.TInteger>;
}>;
/** Lists one directory of an agent workspace. */
declare const AgentsWorkspaceListParamsSchema: Type.TObject<{
  agentId: Type.TString;
  path: Type.TOptional<Type.TString>;
  offset: Type.TOptional<Type.TInteger>;
  limit: Type.TOptional<Type.TInteger>;
}>;
/** Paginated directory listing rooted at the agent workspace. */
declare const AgentsWorkspaceListResultSchema: Type.TObject<{
  agentId: Type.TString;
  path: Type.TString;
  parentPath: Type.TOptional<Type.TString>;
  entries: Type.TArray<Type.TObject<{
    path: Type.TString;
    name: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
  }>>;
  totalEntries: Type.TInteger;
  offset: Type.TInteger;
}>;
/** One workspace file preview payload (UTF-8 text or base64 image). */
declare const AgentsWorkspaceFileSchema: Type.TObject<{
  path: Type.TString;
  name: Type.TString;
  size: Type.TInteger;
  updatedAtMs: Type.TInteger;
  mimeType: Type.TString;
  encoding: Type.TUnion<[Type.TLiteral<"utf8">, Type.TLiteral<"base64">]>;
  content: Type.TString;
}>;
/** Reads one workspace file by workspace-relative path. */
declare const AgentsWorkspaceGetParamsSchema: Type.TObject<{
  agentId: Type.TString;
  path: Type.TString;
}>;
/** Result for reading one workspace file. */
declare const AgentsWorkspaceGetResultSchema: Type.TObject<{
  agentId: Type.TString;
  file: Type.TObject<{
    path: Type.TString;
    name: Type.TString;
    size: Type.TInteger;
    updatedAtMs: Type.TInteger;
    mimeType: Type.TString;
    encoding: Type.TUnion<[Type.TLiteral<"utf8">, Type.TLiteral<"base64">]>;
    content: Type.TString;
  }>;
}>;
type AgentsWorkspaceEntry = Static<typeof AgentsWorkspaceEntrySchema>;
type AgentsWorkspaceFile = Static<typeof AgentsWorkspaceFileSchema>;
type AgentsWorkspaceListParams = Static<typeof AgentsWorkspaceListParamsSchema>;
type AgentsWorkspaceListResult = Static<typeof AgentsWorkspaceListResultSchema>;
type AgentsWorkspaceGetParams = Static<typeof AgentsWorkspaceGetParamsSchema>;
type AgentsWorkspaceGetResult = Static<typeof AgentsWorkspaceGetResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/artifacts.d.ts
/** Public artifact metadata returned before or alongside download data. */
declare const ArtifactSummarySchema: Type.TObject<{
  id: Type.TString;
  type: Type.TString;
  title: Type.TString;
  mimeType: Type.TOptional<Type.TString>;
  sizeBytes: Type.TOptional<Type.TInteger>;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  taskId: Type.TOptional<Type.TString>;
  messageSeq: Type.TOptional<Type.TInteger>;
  source: Type.TOptional<Type.TString>;
  download: Type.TObject<{
    mode: Type.TUnion<[Type.TLiteral<"bytes">, Type.TLiteral<"url">, Type.TLiteral<"unsupported">]>;
  }>;
}>;
/** List request payload for artifacts visible in the selected scope. */
declare const ArtifactsListParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  taskId: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
}>;
/** List response containing artifact summaries only. */
declare const ArtifactsListResultSchema: Type.TObject<{
  artifacts: Type.TArray<Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    title: Type.TString;
    mimeType: Type.TOptional<Type.TString>;
    sizeBytes: Type.TOptional<Type.TInteger>;
    sessionKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    messageSeq: Type.TOptional<Type.TInteger>;
    source: Type.TOptional<Type.TString>;
    download: Type.TObject<{
      mode: Type.TUnion<[Type.TLiteral<"bytes">, Type.TLiteral<"url">, Type.TLiteral<"unsupported">]>;
    }>;
  }>>;
}>;
/** Get request payload for one artifact summary. */
declare const ArtifactsGetParamsSchema: Type.TObject<{
  artifactId: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  taskId: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Get response containing one artifact summary. */
declare const ArtifactsGetResultSchema: Type.TObject<{
  artifact: Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    title: Type.TString;
    mimeType: Type.TOptional<Type.TString>;
    sizeBytes: Type.TOptional<Type.TInteger>;
    sessionKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    messageSeq: Type.TOptional<Type.TInteger>;
    source: Type.TOptional<Type.TString>;
    download: Type.TObject<{
      mode: Type.TUnion<[Type.TLiteral<"bytes">, Type.TLiteral<"url">, Type.TLiteral<"unsupported">]>;
    }>;
  }>;
}>;
/** Download request payload for one artifact. */
declare const ArtifactsDownloadParamsSchema: Type.TObject<{
  artifactId: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  taskId: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Download response, either inline base64 bytes, URL, or metadata for unsupported modes. */
declare const ArtifactsDownloadResultSchema: Type.TObject<{
  artifact: Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    title: Type.TString;
    mimeType: Type.TOptional<Type.TString>;
    sizeBytes: Type.TOptional<Type.TInteger>;
    sessionKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    messageSeq: Type.TOptional<Type.TInteger>;
    source: Type.TOptional<Type.TString>;
    download: Type.TObject<{
      mode: Type.TUnion<[Type.TLiteral<"bytes">, Type.TLiteral<"url">, Type.TLiteral<"unsupported">]>;
    }>;
  }>;
  encoding: Type.TOptional<Type.TLiteral<"base64">>;
  data: Type.TOptional<Type.TString>;
  url: Type.TOptional<Type.TString>;
}>;
type ArtifactSummary = Static<typeof ArtifactSummarySchema>;
type ArtifactsListParams = Static<typeof ArtifactsListParamsSchema>;
type ArtifactsListResult = Static<typeof ArtifactsListResultSchema>;
type ArtifactsGetParams = Static<typeof ArtifactsGetParamsSchema>;
type ArtifactsGetResult = Static<typeof ArtifactsGetResultSchema>;
type ArtifactsDownloadParams = Static<typeof ArtifactsDownloadParamsSchema>;
type ArtifactsDownloadResult = Static<typeof ArtifactsDownloadResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/audit-activity.d.ts
/** V1 agent-run activity record. */
declare const AuditActivityAgentRunV1Schema: TSchema;
/** V1 tool-action activity record. */
declare const AuditActivityToolActionV1Schema: TSchema;
declare const AuditActivityInboundMessageV1Schema: TSchema;
declare const AuditActivityOutboundMessageV1Schema: TSchema;
/** Discriminated V1 activity record union. */
declare const AuditActivityEventV1Schema: TSchema;
/** Bounded newest-first V1 activity query filters. */
declare const AuditActivityListParamsSchema: TSchema;
/** Stable sequence-cursor V1 activity page. */
declare const AuditActivityListResultSchema: TSchema;
/** Metadata-only audit query payloads. */
type AuditActivityRecordBaseV1 = {
  schemaVersion: 1;
  eventId: string;
  sequence: number;
  sourceSequence: number;
  occurredAt: number;
  redaction: "metadata_only";
};
type AuditActivityAgentRecordBaseV1 = AuditActivityRecordBaseV1 & {
  actor: {
    type: "agent" | "system";
    id: string;
  };
  agentId: string;
  sessionKey?: string;
  sessionId?: string;
  runId: string;
};
type AuditActivityAgentRunV1Terminal = {
  action: "agent.run.started";
  status: "started";
  errorCode?: never;
} | {
  action: "agent.run.finished";
  status: "succeeded";
  errorCode?: never;
} | {
  action: "agent.run.finished";
  status: "failed";
  errorCode: "run_failed";
} | {
  action: "agent.run.finished";
  status: "cancelled";
  errorCode: "run_cancelled";
} | {
  action: "agent.run.finished";
  status: "timed_out";
  errorCode: "run_timed_out";
} | {
  action: "agent.run.finished";
  status: "blocked";
  errorCode: "run_blocked";
};
type AuditActivityAgentRunV1 = AuditActivityAgentRecordBaseV1 & {
  eventType: "agent_run";
  kind: "agent_run";
} & AuditActivityAgentRunV1Terminal;
type AuditActivityToolActionV1Terminal = {
  action: "tool.action.started";
  status: "started";
  errorCode?: never;
} | {
  action: "tool.action.finished";
  status: "succeeded";
  errorCode?: never;
} | {
  action: "tool.action.finished";
  status: "failed";
  errorCode: "tool_failed";
} | {
  action: "tool.action.finished";
  status: "cancelled";
  errorCode: "tool_cancelled";
} | {
  action: "tool.action.finished";
  status: "timed_out";
  errorCode: "tool_timed_out";
} | {
  action: "tool.action.finished";
  status: "blocked";
  errorCode: "tool_blocked";
} | {
  action: "tool.action.finished";
  status: "unknown";
  errorCode: "tool_outcome_unknown";
};
type AuditActivityToolActionV1 = AuditActivityAgentRecordBaseV1 & {
  eventType: "tool_action";
  kind: "tool_action";
  toolCallId?: string;
  toolName?: string;
} & AuditActivityToolActionV1Terminal;
type AuditActivityMessageRecordBaseV1 = AuditActivityRecordBaseV1 & {
  kind: "message";
  channel: string;
  conversationKind: "direct" | "group" | "channel" | "unknown";
  durationMs?: number;
  resultCount?: number;
  agentId?: string;
  runId?: string;
  accountRef?: string;
  conversationRef?: string;
  messageRef?: string;
  targetRef?: string;
  sessionKey?: never;
  sessionId?: never;
  toolCallId?: never;
  toolName?: never;
};
type AuditActivityInboundMessageV1Terminal = {
  status: "succeeded";
  outcome: "completed";
  errorCode?: never;
  reasonCode?: "fast_abort" | "plugin_bound_handled" | "plugin_bound_unavailable" | "plugin_bound_declined" | "before_dispatch_handled" | "acp_dispatch_completed" | "acp_dispatch_empty";
} | {
  status: "blocked";
  outcome: "skipped";
  errorCode?: never;
  reasonCode?: "duplicate" | "reply_operation_active" | "reply_operation_aborted" | "acp_dispatch_aborted";
} | {
  status: "failed";
  outcome: "failed";
  errorCode: "message_processing_failed";
  reasonCode?: "acp_dispatch_failed" | "plugin_bound_error";
};
type AuditActivityInboundMessageV1 = AuditActivityMessageRecordBaseV1 & {
  eventType: "inbound_message";
  action: "message.inbound.processed";
  direction: "inbound";
  actor: {
    type: "channel_sender";
    id: string;
  } | {
    type: "system";
    id: string;
  };
  deliveryKind?: never;
  failureStage?: never;
} & AuditActivityInboundMessageV1Terminal;
type AuditActivityOutboundMessageV1Terminal = {
  status: "succeeded";
  outcome: "sent";
  errorCode?: never;
  reasonCode?: never;
  failureStage?: never;
  deliveryKind?: "text" | "media" | "other";
} | {
  status: "blocked";
  outcome: "suppressed";
  errorCode?: never;
  reasonCode: "cancelled_by_message_sending_hook" | "cancelled_by_reply_payload_sending_hook" | "empty_after_message_sending_hook" | "empty_after_reply_payload_sending_hook" | "no_visible_payload";
  failureStage?: never;
  deliveryKind?: never;
} | {
  status: "failed";
  outcome: "failed";
  errorCode: "message_delivery_failed" | "message_delivery_partial_failure";
  reasonCode?: never;
  failureStage: "platform_send" | "queue" | "unknown";
  deliveryKind?: "text" | "media" | "other";
} | {
  status: "unknown";
  outcome: "unknown";
  errorCode?: never;
  reasonCode?: never;
  failureStage: "platform_send" | "queue" | "unknown";
  deliveryKind?: never;
};
type AuditActivityOutboundMessageV1 = AuditActivityMessageRecordBaseV1 & {
  eventType: "outbound_message";
  action: "message.outbound.finished";
  direction: "outbound";
  actor: {
    type: "agent" | "system";
    id: string;
  };
} & AuditActivityOutboundMessageV1Terminal;
type AuditActivityEventV1 = AuditActivityAgentRunV1 | AuditActivityToolActionV1 | AuditActivityInboundMessageV1 | AuditActivityOutboundMessageV1;
type AuditActivityListParams = {
  agentId?: string;
  sessionKey?: string;
  runId?: string;
  kind?: "agent_run" | "tool_action" | "message";
  status?: "started" | "succeeded" | "failed" | "cancelled" | "timed_out" | "blocked" | "unknown";
  direction?: "inbound" | "outbound";
  channel?: string;
  after?: number;
  before?: number;
  limit?: number;
  cursor?: string;
};
type AuditActivityListResult = {
  events: AuditActivityEventV1[];
  nextCursor?: string;
};
//#endregion
//#region packages/gateway-protocol/src/schema/audit.d.ts
/** One content-free run/tool audit record. */
declare const AuditEventSchema: Type.TObject<{
  eventId: Type.TString;
  sequence: Type.TInteger;
  sourceSequence: Type.TInteger;
  occurredAt: Type.TInteger;
  kind: Type.TUnion<[Type.TLiteral<"agent_run">, Type.TLiteral<"tool_action">]>;
  action: Type.TUnion<[Type.TLiteral<"agent.run.started">, Type.TLiteral<"agent.run.finished">, Type.TLiteral<"tool.action.started">, Type.TLiteral<"tool.action.finished">]>;
  status: Type.TUnion<[Type.TLiteral<"started">, Type.TLiteral<"succeeded">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">, Type.TLiteral<"blocked">, Type.TLiteral<"unknown">]>;
  errorCode: Type.TOptional<Type.TUnion<[Type.TLiteral<"run_failed">, Type.TLiteral<"run_cancelled">, Type.TLiteral<"run_timed_out">, Type.TLiteral<"run_blocked">, Type.TLiteral<"tool_failed">, Type.TLiteral<"tool_cancelled">, Type.TLiteral<"tool_timed_out">, Type.TLiteral<"tool_blocked">, Type.TLiteral<"tool_outcome_unknown">]>>;
  actor: Type.TObject<{
    type: Type.TUnion<[Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
    id: Type.TString;
  }>;
  agentId: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  runId: Type.TString;
  toolCallId: Type.TOptional<Type.TString>;
  toolName: Type.TOptional<Type.TString>;
  redaction: Type.TLiteral<"metadata_only">;
}>;
/** Bounded newest-first audit query filters. */
declare const AuditListParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  kind: Type.TOptional<Type.TUnion<[Type.TLiteral<"agent_run">, Type.TLiteral<"tool_action">]>>;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"started">, Type.TLiteral<"succeeded">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">, Type.TLiteral<"blocked">, Type.TLiteral<"unknown">]>>;
  after: Type.TOptional<Type.TInteger>;
  before: Type.TOptional<Type.TInteger>;
  limit: Type.TOptional<Type.TInteger>;
  cursor: Type.TOptional<Type.TString>;
}>;
/** Stable sequence-cursor page suitable for bounded JSON export. */
declare const AuditListResultSchema: Type.TObject<{
  events: Type.TArray<Type.TObject<{
    eventId: Type.TString;
    sequence: Type.TInteger;
    sourceSequence: Type.TInteger;
    occurredAt: Type.TInteger;
    kind: Type.TUnion<[Type.TLiteral<"agent_run">, Type.TLiteral<"tool_action">]>;
    action: Type.TUnion<[Type.TLiteral<"agent.run.started">, Type.TLiteral<"agent.run.finished">, Type.TLiteral<"tool.action.started">, Type.TLiteral<"tool.action.finished">]>;
    status: Type.TUnion<[Type.TLiteral<"started">, Type.TLiteral<"succeeded">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">, Type.TLiteral<"blocked">, Type.TLiteral<"unknown">]>;
    errorCode: Type.TOptional<Type.TUnion<[Type.TLiteral<"run_failed">, Type.TLiteral<"run_cancelled">, Type.TLiteral<"run_timed_out">, Type.TLiteral<"run_blocked">, Type.TLiteral<"tool_failed">, Type.TLiteral<"tool_cancelled">, Type.TLiteral<"tool_timed_out">, Type.TLiteral<"tool_blocked">, Type.TLiteral<"tool_outcome_unknown">]>>;
    actor: Type.TObject<{
      type: Type.TUnion<[Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
      id: Type.TString;
    }>;
    agentId: Type.TString;
    sessionKey: Type.TOptional<Type.TString>;
    sessionId: Type.TOptional<Type.TString>;
    runId: Type.TString;
    toolCallId: Type.TOptional<Type.TString>;
    toolName: Type.TOptional<Type.TString>;
    redaction: Type.TLiteral<"metadata_only">;
  }>>;
  nextCursor: Type.TOptional<Type.TString>;
}>;
type AuditEvent = Static<typeof AuditEventSchema>;
type AuditListParams = Static<typeof AuditListParamsSchema>;
type AuditListResult = Static<typeof AuditListResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/users.d.ts
declare const UserProfileSchema: Type.TObject<{
  id: Type.TString;
  displayName: Type.TUnion<[Type.TString, Type.TNull]>;
  avatarMime: Type.TUnion<[Type.TUnion<[Type.TLiteral<"image/png">, Type.TLiteral<"image/jpeg">, Type.TLiteral<"image/webp">]>, Type.TNull]>;
  mergedInto: Type.TUnion<[Type.TString, Type.TNull]>;
  createdAt: Type.TInteger;
  updatedAt: Type.TInteger;
  emails: Type.TArray<Type.TString>;
  hasAvatar: Type.TBoolean;
}>;
declare const UsersListParamsSchema: Type.TObject<{}>;
declare const UsersListResultSchema: Type.TObject<{
  profiles: Type.TArray<Type.TObject<{
    id: Type.TString;
    displayName: Type.TUnion<[Type.TString, Type.TNull]>;
    avatarMime: Type.TUnion<[Type.TUnion<[Type.TLiteral<"image/png">, Type.TLiteral<"image/jpeg">, Type.TLiteral<"image/webp">]>, Type.TNull]>;
    mergedInto: Type.TUnion<[Type.TString, Type.TNull]>;
    createdAt: Type.TInteger;
    updatedAt: Type.TInteger;
    emails: Type.TArray<Type.TString>;
    hasAvatar: Type.TBoolean;
  }>>;
}>;
declare const UsersSelfParamsSchema: Type.TObject<{}>;
declare const UsersSelfResultSchema: Type.TObject<{
  profile: Type.TObject<{
    id: Type.TString;
    displayName: Type.TUnion<[Type.TString, Type.TNull]>;
    avatarMime: Type.TUnion<[Type.TUnion<[Type.TLiteral<"image/png">, Type.TLiteral<"image/jpeg">, Type.TLiteral<"image/webp">]>, Type.TNull]>;
    mergedInto: Type.TUnion<[Type.TString, Type.TNull]>;
    createdAt: Type.TInteger;
    updatedAt: Type.TInteger;
    emails: Type.TArray<Type.TString>;
    hasAvatar: Type.TBoolean;
  }>;
}>;
declare const UsersLinkEmailParamsSchema: Type.TObject<{
  email: Type.TString;
  targetProfileId: Type.TString;
}>;
declare const UsersLinkEmailResultSchema: Type.TObject<{
  profile: Type.TObject<{
    id: Type.TString;
    displayName: Type.TUnion<[Type.TString, Type.TNull]>;
    avatarMime: Type.TUnion<[Type.TUnion<[Type.TLiteral<"image/png">, Type.TLiteral<"image/jpeg">, Type.TLiteral<"image/webp">]>, Type.TNull]>;
    mergedInto: Type.TUnion<[Type.TString, Type.TNull]>;
    createdAt: Type.TInteger;
    updatedAt: Type.TInteger;
    emails: Type.TArray<Type.TString>;
    hasAvatar: Type.TBoolean;
  }>;
}>;
declare const UsersSetDisplayNameParamsSchema: Type.TObject<{
  profileId: Type.TString;
  displayName: Type.TUnion<[Type.TString, Type.TNull]>;
}>;
declare const UsersSetDisplayNameResultSchema: Type.TObject<{
  profile: Type.TObject<{
    id: Type.TString;
    displayName: Type.TUnion<[Type.TString, Type.TNull]>;
    avatarMime: Type.TUnion<[Type.TUnion<[Type.TLiteral<"image/png">, Type.TLiteral<"image/jpeg">, Type.TLiteral<"image/webp">]>, Type.TNull]>;
    mergedInto: Type.TUnion<[Type.TString, Type.TNull]>;
    createdAt: Type.TInteger;
    updatedAt: Type.TInteger;
    emails: Type.TArray<Type.TString>;
    hasAvatar: Type.TBoolean;
  }>;
}>;
declare const UsersSetAvatarParamsSchema: Type.TObject<{
  profileId: Type.TString;
  mime: Type.TUnion<[Type.TLiteral<"image/png">, Type.TLiteral<"image/jpeg">, Type.TLiteral<"image/webp">]>;
  avatarBase64: Type.TString;
}>;
declare const UsersSetAvatarResultSchema: Type.TObject<{
  profile: Type.TObject<{
    id: Type.TString;
    displayName: Type.TUnion<[Type.TString, Type.TNull]>;
    avatarMime: Type.TUnion<[Type.TUnion<[Type.TLiteral<"image/png">, Type.TLiteral<"image/jpeg">, Type.TLiteral<"image/webp">]>, Type.TNull]>;
    mergedInto: Type.TUnion<[Type.TString, Type.TNull]>;
    createdAt: Type.TInteger;
    updatedAt: Type.TInteger;
    emails: Type.TArray<Type.TString>;
    hasAvatar: Type.TBoolean;
  }>;
}>;
type UserProfile = Static<typeof UserProfileSchema>;
type UsersListParams = Static<typeof UsersListParamsSchema>;
type UsersListResult = Static<typeof UsersListResultSchema>;
type UsersSelfParams = Static<typeof UsersSelfParamsSchema>;
type UsersSelfResult = Static<typeof UsersSelfResultSchema>;
type UsersLinkEmailParams = Static<typeof UsersLinkEmailParamsSchema>;
type UsersLinkEmailResult = Static<typeof UsersLinkEmailResultSchema>;
type UsersSetDisplayNameParams = Static<typeof UsersSetDisplayNameParamsSchema>;
type UsersSetDisplayNameResult = Static<typeof UsersSetDisplayNameResultSchema>;
type UsersSetAvatarParams = Static<typeof UsersSetAvatarParamsSchema>;
type UsersSetAvatarResult = Static<typeof UsersSetAvatarResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/channels.d.ts
/**
 * Channel and Talk protocol schemas.
 *
 * Talk schemas are consumed by browser realtime clients, gateway relay sessions,
 * and channel adapters, so the mode/transport/brain unions below are shared
 * API vocabulary rather than provider-local implementation details.
 */
/** Toggles Talk mode for the gateway, with an optional rollout phase marker. */
declare const TalkModeParamsSchema: Type.TObject<{
  enabled: Type.TBoolean;
  phase: Type.TOptional<Type.TString>;
}>;
/** Reads Talk configuration; secrets are included only for trusted callers. */
declare const TalkConfigParamsSchema: Type.TObject<{
  includeSecrets: Type.TOptional<Type.TBoolean>;
}>;
/** One-shot text-to-speech request with provider-specific voice tuning knobs. */
declare const TalkSpeakParamsSchema: Type.TObject<{
  text: Type.TString;
  voiceId: Type.TOptional<Type.TString>;
  modelId: Type.TOptional<Type.TString>;
  outputFormat: Type.TOptional<Type.TString>;
  speed: Type.TOptional<Type.TNumber>;
  rateWpm: Type.TOptional<Type.TInteger>;
  stability: Type.TOptional<Type.TNumber>;
  similarity: Type.TOptional<Type.TNumber>;
  style: Type.TOptional<Type.TNumber>;
  speakerBoost: Type.TOptional<Type.TBoolean>;
  seed: Type.TOptional<Type.TInteger>;
  normalize: Type.TOptional<Type.TString>;
  language: Type.TOptional<Type.TString>;
  latencyTier: Type.TOptional<Type.TInteger>;
}>;
/**
 * One-shot text-to-speech request rendered with the configured TTS provider
 * chain (unlike `talk.speak`, which pins the Talk-mode provider).
 */
declare const TtsSpeakParamsSchema: Type.TObject<{
  text: Type.TString;
}>;
/** Canonical Talk event envelope emitted to browser, relay, and channel consumers. */
declare const TalkEventSchema: Type.TObject<{
  id: Type.TString;
  type: Type.TUnion<[Type.TLiteral<"session.started">, Type.TLiteral<"session.ready">, Type.TLiteral<"session.closed">, Type.TLiteral<"session.error">, Type.TLiteral<"session.replaced">, Type.TLiteral<"turn.started">, Type.TLiteral<"turn.ended">, Type.TLiteral<"turn.cancelled">, Type.TLiteral<"capture.started">, Type.TLiteral<"capture.stopped">, Type.TLiteral<"capture.cancelled">, Type.TLiteral<"capture.once">, Type.TLiteral<"input.audio.delta">, Type.TLiteral<"input.audio.committed">, Type.TLiteral<"transcript.delta">, Type.TLiteral<"transcript.done">, Type.TLiteral<"output.text.delta">, Type.TLiteral<"output.text.done">, Type.TLiteral<"output.audio.started">, Type.TLiteral<"output.audio.delta">, Type.TLiteral<"output.audio.done">, Type.TLiteral<"tool.call">, Type.TLiteral<"tool.progress">, Type.TLiteral<"tool.result">, Type.TLiteral<"tool.error">, Type.TLiteral<"usage.metrics">, Type.TLiteral<"latency.metrics">, Type.TLiteral<"health.changed">]>;
  sessionId: Type.TString;
  turnId: Type.TOptional<Type.TString>;
  captureId: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
  timestamp: Type.TString;
  mode: Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>;
  transport: Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>;
  brain: Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>;
  provider: Type.TOptional<Type.TString>;
  final: Type.TOptional<Type.TBoolean>;
  callId: Type.TOptional<Type.TString>;
  itemId: Type.TOptional<Type.TString>;
  parentId: Type.TOptional<Type.TString>;
  payload: Type.TUnknown;
}>;
/** Creates a browser-facing Talk client session. */
declare const TalkClientCreateParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  voiceSessionId: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  vadThreshold: Type.TOptional<Type.TNumber>;
  silenceDurationMs: Type.TOptional<Type.TInteger>;
  prefixPaddingMs: Type.TOptional<Type.TInteger>;
  reasoningEffort: Type.TOptional<Type.TString>;
  mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>;
  transport: Type.TOptional<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>;
  brain: Type.TOptional<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>;
  capabilities: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"camera-frame">, Type.TLiteral<"voice-transcript">]>>>;
}>;
/** Tool-call request from a browser/client session back into the agent runtime. */
declare const TalkClientToolCallParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  voiceSessionId: Type.TOptional<Type.TString>;
  callId: Type.TString;
  name: Type.TString;
  args: Type.TOptional<Type.TUnknown>;
  relaySessionId: Type.TOptional<Type.TString>;
}>;
/** One finalized transcript item from a client-owned Talk session. */
declare const TalkClientTranscriptParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  voiceSessionId: Type.TString;
  entryId: Type.TString;
  role: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"assistant">]>;
  text: Type.TString;
  timestamp: Type.TOptional<Type.TNumber>;
}>;
/** Logical close for a client-owned Talk session. */
declare const TalkClientCloseParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  voiceSessionId: Type.TString;
}>;
/** Result for client-owned transcript and close mutations. */
declare const TalkClientMutationResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
}>;
/** Agent run identity returned after accepting a Talk client tool call. */
declare const TalkClientToolCallResultSchema: Type.TObject<{
  runId: Type.TString;
  idempotencyKey: Type.TString;
}>;
/** Text steering request for a Talk session bound to an agent turn. */
declare const TalkClientSteerParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  text: Type.TString;
  mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"status">, Type.TLiteral<"steer">, Type.TLiteral<"cancel">, Type.TLiteral<"followup">]>>;
}>;
/** Result of applying agent control to an embedded or reply-backed Talk run. */
declare const TalkAgentControlResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  mode: Type.TUnion<[Type.TLiteral<"status">, Type.TLiteral<"steer">, Type.TLiteral<"cancel">, Type.TLiteral<"followup">]>;
  sessionKey: Type.TString;
  sessionId: Type.TOptional<Type.TString>;
  active: Type.TBoolean;
  queued: Type.TOptional<Type.TBoolean>;
  aborted: Type.TOptional<Type.TBoolean>;
  target: Type.TOptional<Type.TUnion<[Type.TLiteral<"embedded_run">, Type.TLiteral<"reply_run">]>>;
  reason: Type.TOptional<Type.TString>;
  message: Type.TString;
  speak: Type.TBoolean;
  show: Type.TBoolean;
  suppress: Type.TBoolean;
  providerResult: Type.TOptional<Type.TObject<{
    status: Type.TLiteral<"cancelled">;
    message: Type.TString;
  }>>;
  enqueuedAtMs: Type.TOptional<Type.TNumber>;
  deliveredAtMs: Type.TOptional<Type.TNumber>;
}>;
/** Joins an existing managed-room Talk session. */
declare const TalkSessionJoinParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  token: Type.TString;
}>;
/** Creates a gateway-managed Talk session for realtime, transcription, or relay use. */
declare const TalkSessionCreateParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  language: Type.TOptional<Type.TString>;
  vadThreshold: Type.TOptional<Type.TNumber>;
  silenceDurationMs: Type.TOptional<Type.TInteger>;
  prefixPaddingMs: Type.TOptional<Type.TInteger>;
  reasoningEffort: Type.TOptional<Type.TString>;
  mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>;
  transport: Type.TOptional<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>;
  brain: Type.TOptional<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>;
  ttlMs: Type.TOptional<Type.TInteger>;
}>;
/** Appends base64 audio to an active Talk session. */
declare const TalkSessionAppendAudioParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  audioBase64: Type.TString;
  timestamp: Type.TOptional<Type.TNumber>;
}>;
/** Starts or advances a Talk turn within a session. */
declare const TalkSessionTurnParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  turnId: Type.TOptional<Type.TString>;
}>;
/** Cancels the active or named Talk turn. */
declare const TalkSessionCancelTurnParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  turnId: Type.TOptional<Type.TString>;
  reason: Type.TOptional<Type.TString>;
}>;
/** Cancels currently streaming Talk output without necessarily ending the turn. */
declare const TalkSessionCancelOutputParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  turnId: Type.TOptional<Type.TString>;
  reason: Type.TOptional<Type.TString>;
}>;
/** Submits a tool result back to a Talk provider session. */
declare const TalkSessionSubmitToolResultParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  callId: Type.TString;
  result: Type.TUnknown;
  options: Type.TOptional<Type.TObject<{
    suppressResponse: Type.TOptional<Type.TBoolean>;
    willContinue: Type.TOptional<Type.TBoolean>;
  }>>;
}>;
/** Steers a managed Talk session by session id rather than transcript key. */
declare const TalkSessionSteerParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  text: Type.TString;
  mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"status">, Type.TLiteral<"steer">, Type.TLiteral<"cancel">, Type.TLiteral<"followup">]>>;
}>;
/** Closes a gateway-managed Talk session. */
declare const TalkSessionCloseParamsSchema: Type.TObject<{
  sessionId: Type.TString;
}>;
/** Empty request payload for reading configured Talk provider capabilities. */
declare const TalkCatalogParamsSchema: Type.TObject<{}>;
/** Provider, mode, transport, and audio-format catalog returned to clients. */
declare const TalkCatalogResultSchema: Type.TObject<{
  modes: Type.TArray<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>;
  transports: Type.TArray<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>;
  brains: Type.TArray<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>;
  speech: Type.TObject<{
    ready: Type.TOptional<Type.TBoolean>;
    activeProvider: Type.TOptional<Type.TString>;
    providers: Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
      configured: Type.TBoolean;
      aliases: Type.TOptional<Type.TArray<Type.TString>>;
      models: Type.TOptional<Type.TArray<Type.TString>>;
      voices: Type.TOptional<Type.TArray<Type.TString>>;
      defaultModel: Type.TOptional<Type.TString>;
      modes: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>>;
      transports: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>>;
      brains: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>>;
      inputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
        encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        sampleRateHz: Type.TInteger;
        channels: Type.TInteger;
      }>>>;
      outputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
        encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        sampleRateHz: Type.TInteger;
        channels: Type.TInteger;
      }>>>;
      supportsBrowserSession: Type.TOptional<Type.TBoolean>;
      supportsBargeIn: Type.TOptional<Type.TBoolean>;
      supportsToolCalls: Type.TOptional<Type.TBoolean>;
      supportsVideoFrames: Type.TOptional<Type.TBoolean>;
      supportsSessionResumption: Type.TOptional<Type.TBoolean>;
    }>>;
  }>;
  transcription: Type.TObject<{
    ready: Type.TOptional<Type.TBoolean>;
    activeProvider: Type.TOptional<Type.TString>;
    providers: Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
      configured: Type.TBoolean;
      aliases: Type.TOptional<Type.TArray<Type.TString>>;
      models: Type.TOptional<Type.TArray<Type.TString>>;
      voices: Type.TOptional<Type.TArray<Type.TString>>;
      defaultModel: Type.TOptional<Type.TString>;
      modes: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>>;
      transports: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>>;
      brains: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>>;
      inputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
        encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        sampleRateHz: Type.TInteger;
        channels: Type.TInteger;
      }>>>;
      outputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
        encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        sampleRateHz: Type.TInteger;
        channels: Type.TInteger;
      }>>>;
      supportsBrowserSession: Type.TOptional<Type.TBoolean>;
      supportsBargeIn: Type.TOptional<Type.TBoolean>;
      supportsToolCalls: Type.TOptional<Type.TBoolean>;
      supportsVideoFrames: Type.TOptional<Type.TBoolean>;
      supportsSessionResumption: Type.TOptional<Type.TBoolean>;
    }>>;
  }>;
  realtime: Type.TObject<{
    ready: Type.TOptional<Type.TBoolean>;
    activeProvider: Type.TOptional<Type.TString>;
    providers: Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
      configured: Type.TBoolean;
      aliases: Type.TOptional<Type.TArray<Type.TString>>;
      models: Type.TOptional<Type.TArray<Type.TString>>;
      voices: Type.TOptional<Type.TArray<Type.TString>>;
      defaultModel: Type.TOptional<Type.TString>;
      modes: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>>;
      transports: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>>;
      brains: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>>;
      inputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
        encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        sampleRateHz: Type.TInteger;
        channels: Type.TInteger;
      }>>>;
      outputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
        encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        sampleRateHz: Type.TInteger;
        channels: Type.TInteger;
      }>>>;
      supportsBrowserSession: Type.TOptional<Type.TBoolean>;
      supportsBargeIn: Type.TOptional<Type.TBoolean>;
      supportsToolCalls: Type.TOptional<Type.TBoolean>;
      supportsVideoFrames: Type.TOptional<Type.TBoolean>;
      supportsSessionResumption: Type.TOptional<Type.TBoolean>;
    }>>;
  }>;
}>;
/** Session creation result with transport-specific ids and credentials. */
declare const TalkSessionCreateResultSchema: Type.TObject<{
  sessionId: Type.TString;
  provider: Type.TOptional<Type.TString>;
  mode: Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>;
  transport: Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>;
  brain: Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>;
  relaySessionId: Type.TOptional<Type.TString>;
  transcriptionSessionId: Type.TOptional<Type.TString>;
  handoffId: Type.TOptional<Type.TString>;
  roomId: Type.TOptional<Type.TString>;
  roomUrl: Type.TOptional<Type.TString>;
  token: Type.TOptional<Type.TString>;
  audio: Type.TOptional<Type.TUnknown>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  expiresAt: Type.TOptional<Type.TNumber>;
}>;
/** Result for a Talk turn request, optionally including emitted events. */
declare const TalkSessionTurnResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  turnId: Type.TOptional<Type.TString>;
  events: Type.TOptional<Type.TArray<Type.TObject<{
    id: Type.TString;
    type: Type.TUnion<[Type.TLiteral<"session.started">, Type.TLiteral<"session.ready">, Type.TLiteral<"session.closed">, Type.TLiteral<"session.error">, Type.TLiteral<"session.replaced">, Type.TLiteral<"turn.started">, Type.TLiteral<"turn.ended">, Type.TLiteral<"turn.cancelled">, Type.TLiteral<"capture.started">, Type.TLiteral<"capture.stopped">, Type.TLiteral<"capture.cancelled">, Type.TLiteral<"capture.once">, Type.TLiteral<"input.audio.delta">, Type.TLiteral<"input.audio.committed">, Type.TLiteral<"transcript.delta">, Type.TLiteral<"transcript.done">, Type.TLiteral<"output.text.delta">, Type.TLiteral<"output.text.done">, Type.TLiteral<"output.audio.started">, Type.TLiteral<"output.audio.delta">, Type.TLiteral<"output.audio.done">, Type.TLiteral<"tool.call">, Type.TLiteral<"tool.progress">, Type.TLiteral<"tool.result">, Type.TLiteral<"tool.error">, Type.TLiteral<"usage.metrics">, Type.TLiteral<"latency.metrics">, Type.TLiteral<"health.changed">]>;
    sessionId: Type.TString;
    turnId: Type.TOptional<Type.TString>;
    captureId: Type.TOptional<Type.TString>;
    seq: Type.TInteger;
    timestamp: Type.TString;
    mode: Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>;
    transport: Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>;
    brain: Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>;
    provider: Type.TOptional<Type.TString>;
    final: Type.TOptional<Type.TBoolean>;
    callId: Type.TOptional<Type.TString>;
    itemId: Type.TOptional<Type.TString>;
    parentId: Type.TOptional<Type.TString>;
    payload: Type.TUnknown;
  }>>>;
}>;
/** Managed-room record returned to clients after joining an existing Talk session. */
declare const TalkSessionJoinResultSchema: Type.TObject<{
  id: Type.TString;
  roomId: Type.TString;
  roomUrl: Type.TString;
  sessionKey: Type.TString;
  sessionId: Type.TOptional<Type.TString>;
  channel: Type.TOptional<Type.TString>;
  target: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  mode: Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>;
  transport: Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>;
  brain: Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>;
  createdAt: Type.TNumber;
  expiresAt: Type.TNumber;
  room: Type.TObject<{
    activeClientId: Type.TOptional<Type.TString>;
    activeTurnId: Type.TOptional<Type.TString>;
    recentTalkEvents: Type.TArray<Type.TObject<{
      id: Type.TString;
      type: Type.TUnion<[Type.TLiteral<"session.started">, Type.TLiteral<"session.ready">, Type.TLiteral<"session.closed">, Type.TLiteral<"session.error">, Type.TLiteral<"session.replaced">, Type.TLiteral<"turn.started">, Type.TLiteral<"turn.ended">, Type.TLiteral<"turn.cancelled">, Type.TLiteral<"capture.started">, Type.TLiteral<"capture.stopped">, Type.TLiteral<"capture.cancelled">, Type.TLiteral<"capture.once">, Type.TLiteral<"input.audio.delta">, Type.TLiteral<"input.audio.committed">, Type.TLiteral<"transcript.delta">, Type.TLiteral<"transcript.done">, Type.TLiteral<"output.text.delta">, Type.TLiteral<"output.text.done">, Type.TLiteral<"output.audio.started">, Type.TLiteral<"output.audio.delta">, Type.TLiteral<"output.audio.done">, Type.TLiteral<"tool.call">, Type.TLiteral<"tool.progress">, Type.TLiteral<"tool.result">, Type.TLiteral<"tool.error">, Type.TLiteral<"usage.metrics">, Type.TLiteral<"latency.metrics">, Type.TLiteral<"health.changed">]>;
      sessionId: Type.TString;
      turnId: Type.TOptional<Type.TString>;
      captureId: Type.TOptional<Type.TString>;
      seq: Type.TInteger;
      timestamp: Type.TString;
      mode: Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>;
      transport: Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>;
      brain: Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>;
      provider: Type.TOptional<Type.TString>;
      final: Type.TOptional<Type.TBoolean>;
      callId: Type.TOptional<Type.TString>;
      itemId: Type.TOptional<Type.TString>;
      parentId: Type.TOptional<Type.TString>;
      payload: Type.TUnknown;
    }>>;
  }>;
}>;
/** Generic success result for Talk session lifecycle calls. */
declare const TalkSessionOkResultSchema: Type.TObject<{
  ok: Type.TBoolean;
}>;
/** Union of all browser Talk session setup payloads. */
declare const TalkClientCreateResultSchema: Type.TUnion<[Type.TObject<{
  provider: Type.TString;
  transport: Type.TLiteral<"webrtc">;
  voiceSessionId: Type.TString;
  clientSecret: Type.TString;
  offerUrl: Type.TOptional<Type.TString>;
  offerHeaders: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  expiresAt: Type.TOptional<Type.TNumber>;
}>, Type.TObject<{
  provider: Type.TString;
  transport: Type.TLiteral<"provider-websocket">;
  voiceSessionId: Type.TString;
  protocol: Type.TString;
  clientSecret: Type.TString;
  websocketUrl: Type.TString;
  audio: Type.TObject<{
    inputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
    inputSampleRateHz: Type.TInteger;
    outputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
    outputSampleRateHz: Type.TInteger;
  }>;
  initialMessage: Type.TOptional<Type.TUnknown>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  expiresAt: Type.TOptional<Type.TNumber>;
}>, Type.TObject<{
  provider: Type.TString;
  transport: Type.TLiteral<"gateway-relay">;
  voiceSessionId: Type.TOptional<Type.TString>;
  relaySessionId: Type.TString;
  audio: Type.TObject<{
    inputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
    inputSampleRateHz: Type.TInteger;
    outputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
    outputSampleRateHz: Type.TInteger;
  }>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  expiresAt: Type.TOptional<Type.TNumber>;
}>, Type.TObject<{
  provider: Type.TString;
  transport: Type.TLiteral<"managed-room">;
  voiceSessionId: Type.TOptional<Type.TString>;
  roomUrl: Type.TString;
  token: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  expiresAt: Type.TOptional<Type.TNumber>;
}>]>;
/** Full Talk config read result, including related session/UI context. */
declare const TalkConfigResultSchema: Type.TObject<{
  config: Type.TObject<{
    talk: Type.TOptional<Type.TObject<{
      provider: Type.TOptional<Type.TString>;
      providers: Type.TOptional<Type.TRecord<"^.*$", Type.TObject<{
        apiKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TUnion<[Type.TObject<{
          source: Type.TLiteral<"env">;
          provider: Type.TString;
          id: Type.TString;
        }>, Type.TObject<{
          source: Type.TLiteral<"file">;
          provider: Type.TString;
          id: Type.TUnsafe<string>;
        }>, Type.TObject<{
          source: Type.TLiteral<"exec">;
          provider: Type.TString;
          id: Type.TString;
        }>]>]>>;
      }>>>;
      realtime: Type.TOptional<Type.TObject<{
        provider: Type.TOptional<Type.TString>;
        providers: Type.TOptional<Type.TRecord<"^.*$", Type.TObject<{
          apiKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TUnion<[Type.TObject<{
            source: Type.TLiteral<"env">;
            provider: Type.TString;
            id: Type.TString;
          }>, Type.TObject<{
            source: Type.TLiteral<"file">;
            provider: Type.TString;
            id: Type.TUnsafe<string>;
          }>, Type.TObject<{
            source: Type.TLiteral<"exec">;
            provider: Type.TString;
            id: Type.TString;
          }>]>]>>;
        }>>>;
        model: Type.TOptional<Type.TString>;
        speakerVoice: Type.TOptional<Type.TString>;
        speakerVoiceId: Type.TOptional<Type.TString>;
        voice: Type.TOptional<Type.TString>;
        instructions: Type.TOptional<Type.TString>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>;
        transport: Type.TOptional<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>;
        vadThreshold: Type.TOptional<Type.TNumber>;
        silenceDurationMs: Type.TOptional<Type.TInteger>;
        prefixPaddingMs: Type.TOptional<Type.TInteger>;
        reasoningEffort: Type.TOptional<Type.TString>;
        brain: Type.TOptional<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>;
        consultRouting: Type.TOptional<Type.TUnion<[Type.TLiteral<"provider-direct">, Type.TLiteral<"force-agent-consult">]>>;
      }>>;
      resolved: Type.TOptional<Type.TObject<{
        provider: Type.TString;
        config: Type.TObject<{
          apiKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TUnion<[Type.TObject<{
            source: Type.TLiteral<"env">;
            provider: Type.TString;
            id: Type.TString;
          }>, Type.TObject<{
            source: Type.TLiteral<"file">;
            provider: Type.TString;
            id: Type.TUnsafe<string>;
          }>, Type.TObject<{
            source: Type.TLiteral<"exec">;
            provider: Type.TString;
            id: Type.TString;
          }>]>]>>;
        }>;
      }>>;
      consultThinkingLevel: Type.TOptional<Type.TString>;
      consultFastMode: Type.TOptional<Type.TBoolean>;
      speechLocale: Type.TOptional<Type.TString>;
      interruptOnSpeech: Type.TOptional<Type.TBoolean>;
      silenceTimeoutMs: Type.TOptional<Type.TInteger>;
    }>>;
    session: Type.TOptional<Type.TObject<{
      mainKey: Type.TOptional<Type.TString>;
    }>>;
    ui: Type.TOptional<Type.TObject<{
      seamColor: Type.TOptional<Type.TString>;
    }>>;
  }>;
}>;
/** Text-to-speech result with encoded audio and provider output metadata. */
declare const TalkSpeakResultSchema: Type.TObject<{
  audioBase64: Type.TString;
  provider: Type.TString;
  outputFormat: Type.TOptional<Type.TString>;
  voiceCompatible: Type.TOptional<Type.TBoolean>;
  mimeType: Type.TOptional<Type.TString>;
  fileExtension: Type.TOptional<Type.TString>;
}>;
/** Text-to-speech result for `tts.speak` with encoded audio and provider metadata. */
declare const TtsSpeakResultSchema: Type.TObject<{
  audioBase64: Type.TString;
  provider: Type.TString;
  outputFormat: Type.TOptional<Type.TString>;
  mimeType: Type.TOptional<Type.TString>;
  fileExtension: Type.TOptional<Type.TString>;
}>;
/** Channel status request, optionally probing one channel before returning. */
declare const ChannelsStatusParamsSchema: Type.TObject<{
  probe: Type.TOptional<Type.TBoolean>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  channel: Type.TOptional<Type.TString>;
}>;
/** Full channel status result for dashboard and operator diagnostics. */
declare const ChannelsStatusResultSchema: Type.TObject<{
  ts: Type.TInteger;
  channelOrder: Type.TArray<Type.TString>;
  channelLabels: Type.TRecord<"^.*$", Type.TString>;
  channelDetailLabels: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  channelSystemImages: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  channelMeta: Type.TOptional<Type.TArray<Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    detailLabel: Type.TString;
    systemImage: Type.TOptional<Type.TString>;
  }>>>;
  channels: Type.TRecord<"^.*$", Type.TUnknown>;
  channelAccounts: Type.TRecord<"^.*$", Type.TArray<Type.TObject<{
    accountId: Type.TString;
    name: Type.TOptional<Type.TString>;
    enabled: Type.TOptional<Type.TBoolean>;
    configured: Type.TOptional<Type.TBoolean>;
    linked: Type.TOptional<Type.TBoolean>;
    running: Type.TOptional<Type.TBoolean>;
    connected: Type.TOptional<Type.TBoolean>;
    reconnectAttempts: Type.TOptional<Type.TInteger>;
    lastConnectedAt: Type.TOptional<Type.TInteger>;
    lastError: Type.TOptional<Type.TString>;
    healthState: Type.TOptional<Type.TString>;
    lastStartAt: Type.TOptional<Type.TInteger>;
    lastStopAt: Type.TOptional<Type.TInteger>;
    lastInboundAt: Type.TOptional<Type.TInteger>;
    lastOutboundAt: Type.TOptional<Type.TInteger>;
    lastTransportActivityAt: Type.TOptional<Type.TInteger>;
    busy: Type.TOptional<Type.TBoolean>;
    activeRuns: Type.TOptional<Type.TInteger>;
    lastRunActivityAt: Type.TOptional<Type.TInteger>;
    lastProbeAt: Type.TOptional<Type.TInteger>;
    mode: Type.TOptional<Type.TString>;
    dmPolicy: Type.TOptional<Type.TString>;
    allowFrom: Type.TOptional<Type.TArray<Type.TString>>;
    tokenSource: Type.TOptional<Type.TString>;
    botTokenSource: Type.TOptional<Type.TString>;
    appTokenSource: Type.TOptional<Type.TString>;
    baseUrl: Type.TOptional<Type.TString>;
    allowUnmentionedGroups: Type.TOptional<Type.TBoolean>;
    cliPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    dbPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    port: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    probe: Type.TOptional<Type.TUnknown>;
    audit: Type.TOptional<Type.TUnknown>;
    application: Type.TOptional<Type.TUnknown>;
  }>>>;
  channelDefaultAccountId: Type.TRecord<"^.*$", Type.TString>;
  eventLoop: Type.TOptional<Type.TObject<{
    degraded: Type.TBoolean;
    reasons: Type.TArray<Type.TUnion<[Type.TLiteral<"event_loop_delay">, Type.TLiteral<"event_loop_utilization">, Type.TLiteral<"cpu">]>>;
    intervalMs: Type.TInteger;
    delayP99Ms: Type.TNumber;
    delayMaxMs: Type.TNumber;
    utilization: Type.TNumber;
    cpuCoreRatio: Type.TNumber;
  }>>;
  partial: Type.TOptional<Type.TBoolean>;
  warnings: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Logs out one channel account. */
declare const ChannelsLogoutParamsSchema: Type.TObject<{
  channel: Type.TString;
  accountId: Type.TOptional<Type.TString>;
}>;
/** Stops one channel account runtime. */
declare const ChannelsStopParamsSchema: Type.TObject<{
  channel: Type.TString;
  accountId: Type.TOptional<Type.TString>;
}>;
/** Starts one channel account runtime. */
declare const ChannelsStartParamsSchema: Type.TObject<{
  channel: Type.TString;
  accountId: Type.TOptional<Type.TString>;
}>;
/** Starts browser/web login for a channel account. */
declare const WebLoginStartParamsSchema: Type.TObject<{
  force: Type.TOptional<Type.TBoolean>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  verbose: Type.TOptional<Type.TBoolean>;
  accountId: Type.TOptional<Type.TString>;
}>;
/** Waits for web login completion or the next QR code. */
declare const WebLoginWaitParamsSchema: Type.TObject<{
  timeoutMs: Type.TOptional<Type.TInteger>;
  accountId: Type.TOptional<Type.TString>;
  currentQrDataUrl: Type.TOptional<Type.TString>;
}>;
type TalkModeParams = Static<typeof TalkModeParamsSchema>;
type TalkCatalogParams = Static<typeof TalkCatalogParamsSchema>;
type TalkCatalogResult = Static<typeof TalkCatalogResultSchema>;
type TalkConfigParams = Static<typeof TalkConfigParamsSchema>;
type TalkConfigResult = Static<typeof TalkConfigResultSchema>;
type TalkClientCreateParams = Static<typeof TalkClientCreateParamsSchema>;
type TalkClientCreateResult = Static<typeof TalkClientCreateResultSchema>;
type TalkClientSteerParams = Static<typeof TalkClientSteerParamsSchema>;
type TalkAgentControlResult = Static<typeof TalkAgentControlResultSchema>;
type TalkClientToolCallParams = Static<typeof TalkClientToolCallParamsSchema>;
type TalkClientToolCallResult = Static<typeof TalkClientToolCallResultSchema>;
type TalkClientTranscriptParams = Static<typeof TalkClientTranscriptParamsSchema>;
type TalkClientCloseParams = Static<typeof TalkClientCloseParamsSchema>;
type TalkClientMutationResult = Static<typeof TalkClientMutationResultSchema>;
type TalkSessionCreateParams = Static<typeof TalkSessionCreateParamsSchema>;
type TalkSessionCreateResult = Static<typeof TalkSessionCreateResultSchema>;
type TalkSessionJoinParams = Static<typeof TalkSessionJoinParamsSchema>;
type TalkSessionJoinResult = Static<typeof TalkSessionJoinResultSchema>;
type TalkSessionAppendAudioParams = Static<typeof TalkSessionAppendAudioParamsSchema>;
type TalkSessionTurnParams = Static<typeof TalkSessionTurnParamsSchema>;
type TalkSessionCancelTurnParams = Static<typeof TalkSessionCancelTurnParamsSchema>;
type TalkSessionCancelOutputParams = Static<typeof TalkSessionCancelOutputParamsSchema>;
type TalkSessionTurnResult = Static<typeof TalkSessionTurnResultSchema>;
type TalkSessionSteerParams = Static<typeof TalkSessionSteerParamsSchema>;
type TalkSessionSubmitToolResultParams = Static<typeof TalkSessionSubmitToolResultParamsSchema>;
type TalkSessionCloseParams = Static<typeof TalkSessionCloseParamsSchema>;
type TalkSessionOkResult = Static<typeof TalkSessionOkResultSchema>;
type TalkSpeakParams = Static<typeof TalkSpeakParamsSchema>;
type TalkSpeakResult = Static<typeof TalkSpeakResultSchema>;
type TtsSpeakParams = Static<typeof TtsSpeakParamsSchema>;
type TtsSpeakResult = Static<typeof TtsSpeakResultSchema>;
type ChannelsStatusParams = Static<typeof ChannelsStatusParamsSchema>;
type ChannelsStatusResult = Static<typeof ChannelsStatusResultSchema>;
type ChannelsStartParams = Static<typeof ChannelsStartParamsSchema>;
type ChannelsStopParams = Static<typeof ChannelsStopParamsSchema>;
type ChannelsLogoutParams = Static<typeof ChannelsLogoutParamsSchema>;
type WebLoginStartParams = Static<typeof WebLoginStartParamsSchema>;
type WebLoginWaitParams = Static<typeof WebLoginWaitParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/talk-marks.d.ts
/** Acknowledges playback through a named realtime provider mark. */
declare const TalkSessionAcknowledgeMarkParamsSchema: import("typebox").TObject<{
  sessionId: import("typebox").TString;
  markName: import("typebox").TString;
}>;
type TalkSessionAcknowledgeMarkParams = Static<typeof TalkSessionAcknowledgeMarkParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/commands.d.ts
/** One command catalog entry visible to clients. */
declare const CommandEntrySchema: Type.TObject<{
  name: Type.TString;
  nativeName: Type.TOptional<Type.TString>;
  textAliases: Type.TOptional<Type.TArray<Type.TString>>;
  description: Type.TString;
  category: Type.TOptional<Type.TUnion<[Type.TLiteral<"session">, Type.TLiteral<"options">, Type.TLiteral<"status">, Type.TLiteral<"management">, Type.TLiteral<"media">, Type.TLiteral<"tools">, Type.TLiteral<"docks">]>>;
  source: Type.TUnion<[Type.TLiteral<"native">, Type.TLiteral<"skill">, Type.TLiteral<"plugin">]>;
  scope: Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"native">, Type.TLiteral<"both">]>;
  acceptsArgs: Type.TBoolean;
  args: Type.TOptional<Type.TArray<Type.TObject<{
    name: Type.TString;
    description: Type.TString;
    type: Type.TUnion<[Type.TLiteral<"string">, Type.TLiteral<"number">, Type.TLiteral<"boolean">]>;
    required: Type.TOptional<Type.TBoolean>;
    choices: Type.TOptional<Type.TArray<Type.TObject<{
      value: Type.TString;
      label: Type.TString;
    }>>>;
    dynamic: Type.TOptional<Type.TBoolean>;
  }>>>;
}>;
/** Command catalog request filters. */
declare const CommandsListParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  scope: Type.TOptional<Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"native">, Type.TLiteral<"both">]>>;
  includeArgs: Type.TOptional<Type.TBoolean>;
}>;
/** Bounded command catalog response. */
declare const CommandsListResultSchema: Type.TObject<{
  commands: Type.TArray<Type.TObject<{
    name: Type.TString;
    nativeName: Type.TOptional<Type.TString>;
    textAliases: Type.TOptional<Type.TArray<Type.TString>>;
    description: Type.TString;
    category: Type.TOptional<Type.TUnion<[Type.TLiteral<"session">, Type.TLiteral<"options">, Type.TLiteral<"status">, Type.TLiteral<"management">, Type.TLiteral<"media">, Type.TLiteral<"tools">, Type.TLiteral<"docks">]>>;
    source: Type.TUnion<[Type.TLiteral<"native">, Type.TLiteral<"skill">, Type.TLiteral<"plugin">]>;
    scope: Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"native">, Type.TLiteral<"both">]>;
    acceptsArgs: Type.TBoolean;
    args: Type.TOptional<Type.TArray<Type.TObject<{
      name: Type.TString;
      description: Type.TString;
      type: Type.TUnion<[Type.TLiteral<"string">, Type.TLiteral<"number">, Type.TLiteral<"boolean">]>;
      required: Type.TOptional<Type.TBoolean>;
      choices: Type.TOptional<Type.TArray<Type.TObject<{
        value: Type.TString;
        label: Type.TString;
      }>>>;
      dynamic: Type.TOptional<Type.TBoolean>;
    }>>>;
  }>>;
}>;
type CommandEntry = Static<typeof CommandEntrySchema>;
type CommandsListParams = Static<typeof CommandsListParamsSchema>;
type CommandsListResult = Static<typeof CommandsListResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/config.d.ts
/** Empty request payload for reading the current raw config. */
declare const ConfigGetParamsSchema: Type.TObject<{}>;
/** Full raw config replacement request with optional base hash guard. */
declare const ConfigSetParamsSchema: Type.TObject<{
  raw: Type.TString;
  baseHash: Type.TOptional<Type.TString>;
}>;
/** Raw config apply request that may schedule a restart. */
declare const ConfigApplyParamsSchema: Type.TObject<{
  readonly raw: Type.TString;
  readonly baseHash: Type.TOptional<Type.TString>;
  readonly sessionKey: Type.TOptional<Type.TString>;
  readonly deliveryContext: Type.TOptional<Type.TObject<{
    channel: Type.TOptional<Type.TString>;
    to: Type.TOptional<Type.TString>;
    accountId: Type.TOptional<Type.TString>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
  }>>;
  readonly note: Type.TOptional<Type.TString>;
  readonly restartDelayMs: Type.TOptional<Type.TInteger>;
}>;
/** Raw config patch request that may schedule a restart. */
declare const ConfigPatchParamsSchema: Type.TObject<{
  replacePaths: Type.TOptional<Type.TArray<Type.TString>>;
  raw: Type.TString;
  baseHash: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  deliveryContext: Type.TOptional<Type.TObject<{
    channel: Type.TOptional<Type.TString>;
    to: Type.TOptional<Type.TString>;
    accountId: Type.TOptional<Type.TString>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
  }>>;
  note: Type.TOptional<Type.TString>;
  restartDelayMs: Type.TOptional<Type.TInteger>;
}>;
/** Empty request payload for fetching the generated config schema. */
declare const ConfigSchemaParamsSchema: Type.TObject<{}>;
/** Schema lookup request for one config path. */
declare const ConfigSchemaLookupParamsSchema: Type.TObject<{
  path: Type.TString;
}>;
/** Empty request payload for checking update/restart status. */
declare const UpdateStatusParamsSchema: Type.TObject<{}>;
/** Request payload for running an update/restart flow with optional channel delivery context. */
declare const UpdateRunParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  deliveryContext: Type.TOptional<Type.TObject<{
    channel: Type.TOptional<Type.TString>;
    to: Type.TOptional<Type.TString>;
    accountId: Type.TOptional<Type.TString>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
  }>>;
  note: Type.TOptional<Type.TString>;
  continuationMessage: Type.TOptional<Type.TString>;
  restartDelayMs: Type.TOptional<Type.TInteger>;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>;
/** Full generated config schema response. */
declare const ConfigSchemaResponseSchema: Type.TObject<{
  schema: Type.TUnknown;
  uiHints: Type.TRecord<"^.*$", Type.TObject<{
    label: Type.TOptional<Type.TString>;
    help: Type.TOptional<Type.TString>;
    tags: Type.TOptional<Type.TArray<Type.TString>>;
    group: Type.TOptional<Type.TString>;
    order: Type.TOptional<Type.TInteger>;
    advanced: Type.TOptional<Type.TBoolean>;
    sensitive: Type.TOptional<Type.TBoolean>;
    placeholder: Type.TOptional<Type.TString>;
    itemTemplate: Type.TOptional<Type.TUnknown>;
  }>>;
  version: Type.TString;
  generatedAt: Type.TString;
}>;
/** Schema lookup response for one config path and its immediate children. */
declare const ConfigSchemaLookupResultSchema: Type.TObject<{
  path: Type.TString;
  schema: Type.TUnknown;
  reloadKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"restart">, Type.TLiteral<"hot">, Type.TLiteral<"none">]>>;
  hint: Type.TOptional<Type.TObject<{
    label: Type.TOptional<Type.TString>;
    help: Type.TOptional<Type.TString>;
    tags: Type.TOptional<Type.TArray<Type.TString>>;
    group: Type.TOptional<Type.TString>;
    order: Type.TOptional<Type.TInteger>;
    advanced: Type.TOptional<Type.TBoolean>;
    sensitive: Type.TOptional<Type.TBoolean>;
    placeholder: Type.TOptional<Type.TString>;
    itemTemplate: Type.TOptional<Type.TUnknown>;
  }>>;
  hintPath: Type.TOptional<Type.TString>;
  children: Type.TArray<Type.TObject<{
    key: Type.TString;
    path: Type.TString;
    type: Type.TOptional<Type.TUnion<[Type.TString, Type.TArray<Type.TString>]>>;
    required: Type.TBoolean;
    hasChildren: Type.TBoolean;
    reloadKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"restart">, Type.TLiteral<"hot">, Type.TLiteral<"none">]>>;
    hint: Type.TOptional<Type.TObject<{
      label: Type.TOptional<Type.TString>;
      help: Type.TOptional<Type.TString>;
      tags: Type.TOptional<Type.TArray<Type.TString>>;
      group: Type.TOptional<Type.TString>;
      order: Type.TOptional<Type.TInteger>;
      advanced: Type.TOptional<Type.TBoolean>;
      sensitive: Type.TOptional<Type.TBoolean>;
      placeholder: Type.TOptional<Type.TString>;
      itemTemplate: Type.TOptional<Type.TUnknown>;
    }>>;
    hintPath: Type.TOptional<Type.TString>;
  }>>;
}>;
type ConfigGetParams = Static<typeof ConfigGetParamsSchema>;
type ConfigSetParams = Static<typeof ConfigSetParamsSchema>;
type ConfigApplyParams = Static<typeof ConfigApplyParamsSchema>;
type ConfigPatchParams = Static<typeof ConfigPatchParamsSchema>;
type ConfigSchemaParams = Static<typeof ConfigSchemaParamsSchema>;
type ConfigSchemaResponse = Static<typeof ConfigSchemaResponseSchema>;
type UpdateStatusParams = Static<typeof UpdateStatusParamsSchema>;
type UpdateRunParams = Static<typeof UpdateRunParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/openclaw.d.ts
/**
 * OpenClaw chat lets clients (macOS app onboarding, future UIs) hold the
 * setup/repair conversation over the gateway. The gateway live-tests the
 * configured inference route before creating a session. Omitting `message`
 * returns the welcome/greeting for a verified fresh session without input.
 */
declare const SystemAgentChatParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  message: Type.TOptional<Type.TString>; /** Seeds a purpose-specific first greeting for a fresh conversation. */
  welcomeVariant: Type.TOptional<Type.TUnion<[Type.TLiteral<"onboarding">, Type.TLiteral<"new-agent">]>>; /** Drop any in-flight approval/wizard state and start the session over. */
  reset: Type.TOptional<Type.TBoolean>; /** Host-only regular-agent delegation context. Never model-authored. */
  delegation: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    turnSourceChannel: Type.TOptional<Type.TString>;
    turnSourceTo: Type.TOptional<Type.TString>;
    turnSourceAccountId: Type.TOptional<Type.TString>;
    turnSourceThreadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
  }>>;
}>;
/**
 * Structured choice attached to a chat reply. Card-capable clients render the
 * options and send back `reply` (default: `label`) as the next message; text
 * clients ignore this and use the reply prose, which always stands alone.
 */
declare const SystemAgentChatQuestionSchema: Type.TObject<{
  id: Type.TString;
  header: Type.TString;
  question: Type.TString;
  options: Type.TArray<Type.TObject<{
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
    recommended: Type.TOptional<Type.TBoolean>; /** Message text a client sends when this option is chosen; defaults to label. */
    reply: Type.TOptional<Type.TString>;
  }>>; /** Free-text answers are also accepted for this question. */
  isOther: Type.TOptional<Type.TBoolean>;
}>;
/** One OpenClaw reply; `action` tells clients about conversation handoffs. */
declare const SystemAgentChatResultSchema: Type.TObject<{
  sessionId: Type.TString;
  reply: Type.TString; /** The next reply is a hosted-wizard secret and clients must mask its input/echo. */
  sensitive: Type.TOptional<Type.TBoolean>; /** The hosted wizard will consume the next message as its current step answer. */
  wizardInputPending: Type.TOptional<Type.TBoolean>;
  action: Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"open-agent">, Type.TLiteral<"exit">]>; /** Optional localized-draft intent for an `open-agent` handoff. */
  agentDraft: Type.TOptional<Type.TLiteral<"hatch">>; /** Destination agent for a specific `open-agent` handoff. */
  agentId: Type.TOptional<Type.TString>;
  needsApproval: Type.TOptional<Type.TBoolean>;
  proposalId: Type.TOptional<Type.TString>;
  question: Type.TOptional<Type.TObject<{
    id: Type.TString;
    header: Type.TString;
    question: Type.TString;
    options: Type.TArray<Type.TObject<{
      label: Type.TString;
      description: Type.TOptional<Type.TString>;
      recommended: Type.TOptional<Type.TBoolean>; /** Message text a client sends when this option is chosen; defaults to label. */
      reply: Type.TOptional<Type.TString>;
    }>>; /** Free-text answers are also accepted for this question. */
    isOther: Type.TOptional<Type.TBoolean>;
  }>>;
}>;
declare const SystemAgentChatHistoryParamsSchema: Type.TObject<{
  limit: Type.TOptional<Type.TInteger>;
}>;
declare const SystemAgentChatHistoryTurnSchema: Type.TObject<{
  role: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"assistant">]>;
  text: Type.TString;
  at: Type.TNumber;
}>;
declare const SystemAgentChatHistoryResultSchema: Type.TObject<{
  turns: Type.TArray<Type.TObject<{
    role: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"assistant">]>;
    text: Type.TString;
    at: Type.TNumber;
  }>>;
}>;
declare const SystemChangeKindSchema: Type.TUnion<[Type.TLiteral<"operation">, Type.TLiteral<"config-write">, Type.TLiteral<"external-edit">]>;
declare const SystemChangeSourceSchema: Type.TUnion<[Type.TLiteral<"system-agent">, Type.TLiteral<"doctor">, Type.TLiteral<"config-rpc">, Type.TLiteral<"cli">, Type.TLiteral<"plugin-install">, Type.TLiteral<"external">, Type.TLiteral<"unknown">]>;
declare const SystemChangeEntrySchema: Type.TObject<{
  id: Type.TString;
  at: Type.TNumber;
  kind: Type.TUnion<[Type.TLiteral<"operation">, Type.TLiteral<"config-write">, Type.TLiteral<"external-edit">]>;
  source: Type.TUnion<[Type.TLiteral<"system-agent">, Type.TLiteral<"doctor">, Type.TLiteral<"config-rpc">, Type.TLiteral<"cli">, Type.TLiteral<"plugin-install">, Type.TLiteral<"external">, Type.TLiteral<"unknown">]>;
  summary: Type.TString;
  changedPaths: Type.TOptional<Type.TArray<Type.TString>>;
  invalid: Type.TOptional<Type.TBoolean>;
  opaqueChange: Type.TOptional<Type.TBoolean>;
}>;
declare const SystemChangesListParamsSchema: Type.TObject<{
  limit: Type.TOptional<Type.TInteger>;
  beforeCursor: Type.TOptional<Type.TString>;
}>;
declare const SystemChangesListResultSchema: Type.TObject<{
  entries: Type.TArray<Type.TObject<{
    id: Type.TString;
    at: Type.TNumber;
    kind: Type.TUnion<[Type.TLiteral<"operation">, Type.TLiteral<"config-write">, Type.TLiteral<"external-edit">]>;
    source: Type.TUnion<[Type.TLiteral<"system-agent">, Type.TLiteral<"doctor">, Type.TLiteral<"config-rpc">, Type.TLiteral<"cli">, Type.TLiteral<"plugin-install">, Type.TLiteral<"external">, Type.TLiteral<"unknown">]>;
    summary: Type.TString;
    changedPaths: Type.TOptional<Type.TArray<Type.TString>>;
    invalid: Type.TOptional<Type.TBoolean>;
    opaqueChange: Type.TOptional<Type.TBoolean>;
  }>>;
  nextCursor: Type.TOptional<Type.TString>;
}>;
/**
 * Structured first-run inference setup for GUI clients: detect reusable AI
 * access (CLI logins, env keys, existing config), then activate one choice.
 * Activation live-tests the candidate and persists it only on success, so a
 * client can walk the ladder candidate-by-candidate without ever leaving a
 * broken default model behind.
 */
declare const SystemAgentSetupDetectParamsSchema: Type.TObject<{}>;
declare const SystemAgentSetupDetectResultSchema: Type.TObject<{
  candidates: Type.TArray<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"existing-model">, Type.TLiteral<"openai-api-key">, Type.TLiteral<"anthropic-api-key">, Type.TLiteral<"claude-cli">, Type.TLiteral<"codex-cli">, Type.TLiteral<"gemini-cli">, Type.TTemplateLiteral<"^provider-auto:.*$">]>;
    label: Type.TString;
    detail: Type.TString;
    modelRef: Type.TString;
    recommended: Type.TBoolean; /** true: verified; false: definitively logged out; absent: unknown. */
    credentials: Type.TOptional<Type.TBoolean>;
    icon: Type.TOptional<Type.TString>;
    website: Type.TOptional<Type.TString>;
  }>>;
  unavailableCandidates: Type.TOptional<Type.TArray<Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    detail: Type.TString;
    reason: Type.TString;
  }>>>; /** Text-inference key/token methods exposed by the Gateway provider registry. */
  manualProviders: Type.TArray<Type.TObject<{
    /** Opaque provider-auth choice sent back during activation. */id: Type.TString;
    label: Type.TString;
    hint: Type.TOptional<Type.TString>;
    icon: Type.TOptional<Type.TString>;
    website: Type.TOptional<Type.TString>;
  }>>; /** Provider-owned browser and device-code login methods. */
  authOptions: Type.TOptional<Type.TArray<Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    hint: Type.TOptional<Type.TString>;
    groupLabel: Type.TOptional<Type.TString>;
    icon: Type.TOptional<Type.TString>;
    website: Type.TOptional<Type.TString>;
    kind: Type.TUnion<[Type.TLiteral<"oauth">, Type.TLiteral<"device-code">]>;
    featured: Type.TBoolean;
  }>>>;
  recommendedInstalls: Type.TOptional<Type.TArray<Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    hint: Type.TString;
    website: Type.TString;
    icon: Type.TString;
  }>>>;
  workspace: Type.TString;
  codexAppServerDetected: Type.TOptional<Type.TBoolean>;
  configuredModel: Type.TOptional<Type.TString>;
  setupComplete: Type.TBoolean;
}>;
/** Live verification of the Gateway's current default-agent inference route. */
declare const SystemAgentSetupVerifyParamsSchema: Type.TObject<{}>;
declare const SystemAgentSetupVerifyResultSchema: Type.TUnion<[Type.TObject<{
  ok: Type.TLiteral<true>;
  modelRef: Type.TString;
  latencyMs: Type.TNumber;
}>, Type.TObject<{
  ok: Type.TLiteral<false>;
  status: Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"rate_limit">, Type.TLiteral<"billing">, Type.TLiteral<"timeout">, Type.TLiteral<"format">, Type.TLiteral<"unavailable">, Type.TLiteral<"unknown">]>;
  error: Type.TString;
}>]>;
declare const SystemAgentSetupActivateParamsSchema: Type.TObject<{
  kind: Type.TUnion<[Type.TLiteral<"existing-model">, Type.TLiteral<"openai-api-key">, Type.TLiteral<"anthropic-api-key">, Type.TLiteral<"claude-cli">, Type.TLiteral<"codex-cli">, Type.TLiteral<"gemini-cli">, Type.TTemplateLiteral<"^provider-auto:.*$">, Type.TLiteral<"api-key">]>; /** Exact detected model for this route; prevents detect/activate drift. */
  modelRef: Type.TOptional<Type.TString>; /** Manual step only: opaque provider-auth choice returned by detection. */
  authChoice: Type.TOptional<Type.TString>; /** Manual step only: the pasted API key or token; masked by clients, never echoed. */
  apiKey: Type.TOptional<Type.TString>;
  workspace: Type.TOptional<Type.TString>;
}>;
declare const SystemAgentSetupActivateResultSchema: Type.TObject<{
  ok: Type.TBoolean; /** Present on success: the model ref that answered the live test. */
  modelRef: Type.TOptional<Type.TString>;
  latencyMs: Type.TOptional<Type.TNumber>; /** Human-readable setup summary lines (workspace, model, gateway). */
  lines: Type.TOptional<Type.TArray<Type.TString>>; /** Present on failure: coarse bucket for client copy + docs links. */
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"auth">, Type.TLiteral<"rate_limit">, Type.TLiteral<"billing">, Type.TLiteral<"timeout">, Type.TLiteral<"format">, Type.TLiteral<"unavailable">, Type.TLiteral<"unknown">]>>;
  error: Type.TOptional<Type.TString>;
}>;
/** Starts one provider-owned interactive login as a gateway wizard session. */
declare const SystemAgentSetupAuthStartParamsSchema: Type.TObject<{
  /** Client-generated so cancellation remains possible if the start reply is lost. */sessionId: Type.TString;
  authChoice: Type.TString;
  workspace: Type.TOptional<Type.TString>;
}>;
declare const SystemAgentSetupAuthStartResultSchema: Type.TObject<{
  done: Type.TBoolean;
  step: Type.TOptional<Type.TObject<{
    id: Type.TString;
    type: Type.TUnion<[Type.TLiteral<"note">, Type.TLiteral<"select">, Type.TLiteral<"text">, Type.TLiteral<"confirm">, Type.TLiteral<"multiselect">, Type.TLiteral<"progress">, Type.TLiteral<"action">]>;
    title: Type.TOptional<Type.TString>;
    message: Type.TOptional<Type.TString>;
    format: Type.TOptional<Type.TUnion<[Type.TLiteral<"plain">]>>;
    options: Type.TOptional<Type.TArray<Type.TObject<{
      value: Type.TUnknown;
      label: Type.TString;
      hint: Type.TOptional<Type.TString>;
    }>>>;
    initialValue: Type.TOptional<Type.TUnknown>;
    placeholder: Type.TOptional<Type.TString>;
    sensitive: Type.TOptional<Type.TBoolean>;
    executor: Type.TOptional<Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"client">]>>;
    externalUrl: Type.TOptional<Type.TString>;
    deviceCode: Type.TOptional<Type.TObject<{
      code: Type.TString;
      expiresInMinutes: Type.TOptional<Type.TInteger>;
      message: Type.TOptional<Type.TString>;
    }>>;
  }>>;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"cancelled">, Type.TLiteral<"error">]>>;
  error: Type.TOptional<Type.TString>;
  channels: Type.TOptional<Type.TArray<Type.TString>>;
  accounts: Type.TOptional<Type.TArray<Type.TObject<{
    channel: Type.TString;
    accountId: Type.TString;
  }>>>;
  sessionId: Type.TString;
}>;
type SystemAgentChatParams = Static<typeof SystemAgentChatParamsSchema>;
type SystemAgentChatQuestion = Static<typeof SystemAgentChatQuestionSchema>;
type SystemAgentChatResult = Static<typeof SystemAgentChatResultSchema>;
type SystemAgentChatHistoryParams = Static<typeof SystemAgentChatHistoryParamsSchema>;
type SystemAgentChatHistoryTurn = Static<typeof SystemAgentChatHistoryTurnSchema>;
type SystemAgentChatHistoryResult = Static<typeof SystemAgentChatHistoryResultSchema>;
type SystemChangeEntry = Static<typeof SystemChangeEntrySchema>;
type SystemChangeKind = Static<typeof SystemChangeKindSchema>;
type SystemChangeSource = Static<typeof SystemChangeSourceSchema>;
type SystemChangesListParams = Static<typeof SystemChangesListParamsSchema>;
type SystemChangesListResult = Static<typeof SystemChangesListResultSchema>;
type SystemAgentSetupDetectParams = Static<typeof SystemAgentSetupDetectParamsSchema>;
type SystemAgentSetupDetectResult = Static<typeof SystemAgentSetupDetectResultSchema>;
type SystemAgentSetupActivateParams = Static<typeof SystemAgentSetupActivateParamsSchema>;
type SystemAgentSetupActivateResult = Static<typeof SystemAgentSetupActivateResultSchema>;
type SystemAgentSetupVerifyParams = Static<typeof SystemAgentSetupVerifyParamsSchema>;
type SystemAgentSetupVerifyResult = Static<typeof SystemAgentSetupVerifyResultSchema>;
type SystemAgentSetupAuthStartParams = Static<typeof SystemAgentSetupAuthStartParamsSchema>;
type SystemAgentSetupAuthStartResult = Static<typeof SystemAgentSetupAuthStartResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/cron.d.ts
/** Persisted cron job definition returned by scheduler list/get APIs. */
declare const CronJobSchema: Type.TObject<{
  id: Type.TString;
  declarationKey: Type.TOptional<Type.TString>;
  displayName: Type.TOptional<Type.TString>;
  owner: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>>;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  name: Type.TString;
  description: Type.TOptional<Type.TString>;
  enabled: Type.TBoolean;
  deleteAfterRun: Type.TOptional<Type.TBoolean>;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger; /** Opaque Gateway-computed token for the job definition, excluding scheduler state. */
  configRevision: Type.TOptional<Type.TString>;
  schedule: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"at">;
    at: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"every">;
    everyMs: Type.TInteger;
    anchorMs: Type.TOptional<Type.TInteger>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"cron">;
    expr: Type.TString;
    tz: Type.TOptional<Type.TString>;
    staggerMs: Type.TOptional<Type.TInteger>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"on-exit">;
    command: Type.TString;
    cwd: Type.TOptional<Type.TString>;
  }>]>;
  pacing: Type.TOptional<Type.TObject<{
    min: Type.TOptional<Type.TString>;
    max: Type.TOptional<Type.TString>;
  }>>;
  trigger: Type.TOptional<Type.TObject<{
    script: Type.TString;
    once: Type.TOptional<Type.TBoolean>;
  }>>;
  sessionTarget: Type.TUnion<[Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]>;
  wakeMode: Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>;
  payload: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"systemEvent">;
    text: Type.TString;
    toolsAllow: Type.TOptional<Type.TArray<Type.TString>>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"agentTurn">;
    message: Type.TSchema;
    model: Type.TOptional<Type.TSchema>;
    fallbacks: Type.TOptional<Type.TSchema>;
    thinking: Type.TOptional<Type.TSchema>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
    lightContext: Type.TOptional<Type.TBoolean>;
    toolsAllow: Type.TOptional<Type.TSchema>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"command">;
    argv: Type.TSchema;
    cwd: Type.TOptional<Type.TString>;
    env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    input: Type.TOptional<Type.TString>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
    outputMaxBytes: Type.TOptional<Type.TInteger>;
    toolsAllow: Type.TOptional<Type.TSchema>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"script">;
    script: Type.TSchema;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    toolBudget: Type.TOptional<Type.TInteger>;
    toolsAllow: Type.TOptional<Type.TSchema>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>]>;
  delivery: Type.TOptional<Type.TUnion<[Type.TObject<{
    to: Type.TOptional<Type.TString>;
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    accountId: Type.TOptional<Type.TString>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    }>>;
    mode: Type.TLiteral<"none">;
  }>, Type.TObject<{
    completionDestination: Type.TOptional<Type.TObject<{
      mode: Type.TLiteral<"webhook">;
      to: Type.TString;
    }>>;
    to: Type.TOptional<Type.TString>;
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    accountId: Type.TOptional<Type.TString>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    }>>;
    mode: Type.TLiteral<"announce">;
  }>, Type.TObject<{
    to: Type.TString;
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    accountId: Type.TOptional<Type.TString>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    }>>;
    mode: Type.TLiteral<"webhook">;
  }>]>>;
  failureAlert: Type.TOptional<Type.TUnion<[Type.TLiteral<false>, Type.TObject<{
    after: Type.TOptional<Type.TInteger>;
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    to: Type.TOptional<Type.TString>;
    cooldownMs: Type.TOptional<Type.TInteger>;
    includeSkipped: Type.TOptional<Type.TBoolean>;
    mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    accountId: Type.TOptional<Type.TString>;
  }>]>>;
  state: Type.TObject<{
    nextRunAtMs: Type.TOptional<Type.TInteger>;
    runningAtMs: Type.TOptional<Type.TInteger>;
    lastRunAtMs: Type.TOptional<Type.TInteger>;
    lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
    lastStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
    lastError: Type.TOptional<Type.TString>;
    lastDiagnostics: Type.TOptional<Type.TObject<{
      summary: Type.TOptional<Type.TString>;
      entries: Type.TArray<Type.TObject<{
        ts: Type.TInteger;
        source: Type.TUnion<[Type.TLiteral<"cron-preflight">, Type.TLiteral<"cron-setup">, Type.TLiteral<"model-preflight">, Type.TLiteral<"agent-run">, Type.TLiteral<"tool">, Type.TLiteral<"exec">, Type.TLiteral<"delivery">]>;
        severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"error">]>;
        message: Type.TString;
        toolName: Type.TOptional<Type.TString>;
        exitCode: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
        truncated: Type.TOptional<Type.TBoolean>;
      }>>;
    }>>;
    lastDiagnosticSummary: Type.TOptional<Type.TString>;
    lastErrorReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"context_overflow">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
    lastDurationMs: Type.TOptional<Type.TInteger>;
    consecutiveErrors: Type.TOptional<Type.TInteger>;
    consecutiveSkipped: Type.TOptional<Type.TInteger>;
    lastDelivered: Type.TOptional<Type.TBoolean>;
    lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    lastDeliveryError: Type.TOptional<Type.TString>;
    lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
    lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
    lastFailureAlertAtMs: Type.TOptional<Type.TInteger>;
    lastTriggerEvalAtMs: Type.TOptional<Type.TInteger>;
    triggerEvalCount: Type.TOptional<Type.TInteger>;
    lastTriggerFireAtMs: Type.TOptional<Type.TInteger>;
    triggerState: Type.TOptional<Type.TUnknown>;
  }>;
  nextRunAtMs: Type.TOptional<Type.TInteger>;
  lastRunAtMs: Type.TOptional<Type.TInteger>;
  lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
  lastRunError: Type.TOptional<Type.TString>;
  lastDelivered: Type.TOptional<Type.TBoolean>;
  lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
  lastDeliveryError: Type.TOptional<Type.TString>;
  lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
  lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
  lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
}>;
/** Query params for listing cron jobs with filters and pagination. */
declare const CronListParamsSchema: Type.TObject<{
  includeDisabled: Type.TOptional<Type.TBoolean>;
  limit: Type.TOptional<Type.TInteger>;
  offset: Type.TOptional<Type.TInteger>;
  query: Type.TOptional<Type.TString>;
  enabled: Type.TOptional<Type.TUnion<[Type.TLiteral<"all">, Type.TLiteral<"enabled">, Type.TLiteral<"disabled">]>>;
  scheduleKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"all">, Type.TLiteral<"at">, Type.TLiteral<"every">, Type.TLiteral<"cron">, Type.TLiteral<"on-exit">]>>;
  lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"all">, Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">, Type.TLiteral<"unknown">]>>;
  sortBy: Type.TOptional<Type.TUnion<[Type.TLiteral<"nextRunAtMs">, Type.TLiteral<"updatedAtMs">, Type.TLiteral<"name">]>>;
  sortDir: Type.TOptional<Type.TUnion<[Type.TLiteral<"asc">, Type.TLiteral<"desc">]>>;
  agentId: Type.TOptional<Type.TString>;
  compact: Type.TOptional<Type.TBoolean>;
}>;
/** Empty request payload for scheduler status. */
declare const CronStatusParamsSchema: Type.TObject<{}>;
/** Looks up a job by stable id or legacy jobId alias. */
declare const CronGetParamsSchema: Type.TUnion<[Type.TObject<{
  id: Type.TString;
}>, Type.TObject<{
  jobId: Type.TString;
}>]>;
/** Creates a scheduled job with schedule, target, payload, and delivery policy. */
declare const CronAddParamsSchema: Type.TObject<{
  schedule: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"at">;
    at: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"every">;
    everyMs: Type.TInteger;
    anchorMs: Type.TOptional<Type.TInteger>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"cron">;
    expr: Type.TString;
    tz: Type.TOptional<Type.TString>;
    staggerMs: Type.TOptional<Type.TInteger>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"on-exit">;
    command: Type.TString;
    cwd: Type.TOptional<Type.TString>;
  }>]>;
  pacing: Type.TOptional<Type.TObject<{
    min: Type.TOptional<Type.TString>;
    max: Type.TOptional<Type.TString>;
  }>>;
  trigger: Type.TOptional<Type.TObject<{
    script: Type.TString;
    once: Type.TOptional<Type.TBoolean>;
  }>>;
  sessionTarget: Type.TUnion<[Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]>;
  wakeMode: Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>;
  payload: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"systemEvent">;
    text: Type.TString;
    toolsAllow: Type.TOptional<Type.TArray<Type.TString>>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"agentTurn">;
    message: Type.TSchema;
    model: Type.TOptional<Type.TSchema>;
    fallbacks: Type.TOptional<Type.TSchema>;
    thinking: Type.TOptional<Type.TSchema>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
    lightContext: Type.TOptional<Type.TBoolean>;
    toolsAllow: Type.TOptional<Type.TSchema>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"command">;
    argv: Type.TSchema;
    cwd: Type.TOptional<Type.TString>;
    env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    input: Type.TOptional<Type.TString>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
    outputMaxBytes: Type.TOptional<Type.TInteger>;
    toolsAllow: Type.TOptional<Type.TSchema>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"script">;
    script: Type.TSchema;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    toolBudget: Type.TOptional<Type.TInteger>;
    toolsAllow: Type.TOptional<Type.TSchema>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>]>;
  delivery: Type.TOptional<Type.TUnion<[Type.TObject<{
    to: Type.TOptional<Type.TString>;
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    accountId: Type.TOptional<Type.TString>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    }>>;
    mode: Type.TLiteral<"none">;
  }>, Type.TObject<{
    completionDestination: Type.TOptional<Type.TObject<{
      mode: Type.TLiteral<"webhook">;
      to: Type.TString;
    }>>;
    to: Type.TOptional<Type.TString>;
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    accountId: Type.TOptional<Type.TString>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    }>>;
    mode: Type.TLiteral<"announce">;
  }>, Type.TObject<{
    to: Type.TString;
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    accountId: Type.TOptional<Type.TString>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    }>>;
    mode: Type.TLiteral<"webhook">;
  }>]>>;
  failureAlert: Type.TOptional<Type.TUnion<[Type.TLiteral<false>, Type.TObject<{
    after: Type.TOptional<Type.TInteger>;
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    to: Type.TOptional<Type.TString>;
    cooldownMs: Type.TOptional<Type.TInteger>;
    includeSkipped: Type.TOptional<Type.TBoolean>;
    mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    accountId: Type.TOptional<Type.TString>;
  }>]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  sessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  description: Type.TOptional<Type.TString>;
  enabled: Type.TOptional<Type.TBoolean>;
  deleteAfterRun: Type.TOptional<Type.TBoolean>;
  name: Type.TString;
  declarationKey: Type.TOptional<Type.TString>;
  displayName: Type.TOptional<Type.TString>;
  owner: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>>;
}>;
/** Successful declaration-key convergence result. */
declare const CronDeclarativeAddResultSchema: Type.TObject<{
  created: Type.TBoolean;
  updated: Type.TOptional<Type.TBoolean>;
  job: Type.TObject<{
    id: Type.TString;
    declarationKey: Type.TOptional<Type.TString>;
    displayName: Type.TOptional<Type.TString>;
    owner: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    name: Type.TString;
    description: Type.TOptional<Type.TString>;
    enabled: Type.TBoolean;
    deleteAfterRun: Type.TOptional<Type.TBoolean>;
    createdAtMs: Type.TInteger;
    updatedAtMs: Type.TInteger; /** Opaque Gateway-computed token for the job definition, excluding scheduler state. */
    configRevision: Type.TOptional<Type.TString>;
    schedule: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"at">;
      at: Type.TString;
    }>, Type.TObject<{
      kind: Type.TLiteral<"every">;
      everyMs: Type.TInteger;
      anchorMs: Type.TOptional<Type.TInteger>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"cron">;
      expr: Type.TString;
      tz: Type.TOptional<Type.TString>;
      staggerMs: Type.TOptional<Type.TInteger>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"on-exit">;
      command: Type.TString;
      cwd: Type.TOptional<Type.TString>;
    }>]>;
    pacing: Type.TOptional<Type.TObject<{
      min: Type.TOptional<Type.TString>;
      max: Type.TOptional<Type.TString>;
    }>>;
    trigger: Type.TOptional<Type.TObject<{
      script: Type.TString;
      once: Type.TOptional<Type.TBoolean>;
    }>>;
    sessionTarget: Type.TUnion<[Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]>;
    wakeMode: Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>;
    payload: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"systemEvent">;
      text: Type.TString;
      toolsAllow: Type.TOptional<Type.TArray<Type.TString>>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"agentTurn">;
      message: Type.TSchema;
      model: Type.TOptional<Type.TSchema>;
      fallbacks: Type.TOptional<Type.TSchema>;
      thinking: Type.TOptional<Type.TSchema>;
      timeoutSeconds: Type.TOptional<Type.TNumber>;
      allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
      lightContext: Type.TOptional<Type.TBoolean>;
      toolsAllow: Type.TOptional<Type.TSchema>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"command">;
      argv: Type.TSchema;
      cwd: Type.TOptional<Type.TString>;
      env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
      input: Type.TOptional<Type.TString>;
      timeoutSeconds: Type.TOptional<Type.TNumber>;
      noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
      outputMaxBytes: Type.TOptional<Type.TInteger>;
      toolsAllow: Type.TOptional<Type.TSchema>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"script">;
      script: Type.TSchema;
      timeoutSeconds: Type.TOptional<Type.TNumber>;
      toolBudget: Type.TOptional<Type.TInteger>;
      toolsAllow: Type.TOptional<Type.TSchema>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>]>;
    delivery: Type.TOptional<Type.TUnion<[Type.TObject<{
      to: Type.TOptional<Type.TString>;
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
      accountId: Type.TOptional<Type.TString>;
      bestEffort: Type.TOptional<Type.TBoolean>;
      failureDestination: Type.TOptional<Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        to: Type.TOptional<Type.TString>;
        accountId: Type.TOptional<Type.TString>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
      }>>;
      mode: Type.TLiteral<"none">;
    }>, Type.TObject<{
      completionDestination: Type.TOptional<Type.TObject<{
        mode: Type.TLiteral<"webhook">;
        to: Type.TString;
      }>>;
      to: Type.TOptional<Type.TString>;
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
      accountId: Type.TOptional<Type.TString>;
      bestEffort: Type.TOptional<Type.TBoolean>;
      failureDestination: Type.TOptional<Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        to: Type.TOptional<Type.TString>;
        accountId: Type.TOptional<Type.TString>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
      }>>;
      mode: Type.TLiteral<"announce">;
    }>, Type.TObject<{
      to: Type.TString;
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
      accountId: Type.TOptional<Type.TString>;
      bestEffort: Type.TOptional<Type.TBoolean>;
      failureDestination: Type.TOptional<Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        to: Type.TOptional<Type.TString>;
        accountId: Type.TOptional<Type.TString>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
      }>>;
      mode: Type.TLiteral<"webhook">;
    }>]>>;
    failureAlert: Type.TOptional<Type.TUnion<[Type.TLiteral<false>, Type.TObject<{
      after: Type.TOptional<Type.TInteger>;
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      to: Type.TOptional<Type.TString>;
      cooldownMs: Type.TOptional<Type.TInteger>;
      includeSkipped: Type.TOptional<Type.TBoolean>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
      accountId: Type.TOptional<Type.TString>;
    }>]>>;
    state: Type.TObject<{
      nextRunAtMs: Type.TOptional<Type.TInteger>;
      runningAtMs: Type.TOptional<Type.TInteger>;
      lastRunAtMs: Type.TOptional<Type.TInteger>;
      lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
      lastStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
      lastError: Type.TOptional<Type.TString>;
      lastDiagnostics: Type.TOptional<Type.TObject<{
        summary: Type.TOptional<Type.TString>;
        entries: Type.TArray<Type.TObject<{
          ts: Type.TInteger;
          source: Type.TUnion<[Type.TLiteral<"cron-preflight">, Type.TLiteral<"cron-setup">, Type.TLiteral<"model-preflight">, Type.TLiteral<"agent-run">, Type.TLiteral<"tool">, Type.TLiteral<"exec">, Type.TLiteral<"delivery">]>;
          severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"error">]>;
          message: Type.TString;
          toolName: Type.TOptional<Type.TString>;
          exitCode: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
          truncated: Type.TOptional<Type.TBoolean>;
        }>>;
      }>>;
      lastDiagnosticSummary: Type.TOptional<Type.TString>;
      lastErrorReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"context_overflow">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
      lastDurationMs: Type.TOptional<Type.TInteger>;
      consecutiveErrors: Type.TOptional<Type.TInteger>;
      consecutiveSkipped: Type.TOptional<Type.TInteger>;
      lastDelivered: Type.TOptional<Type.TBoolean>;
      lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
      lastDeliveryError: Type.TOptional<Type.TString>;
      lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
      lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
      lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
      lastFailureAlertAtMs: Type.TOptional<Type.TInteger>;
      lastTriggerEvalAtMs: Type.TOptional<Type.TInteger>;
      triggerEvalCount: Type.TOptional<Type.TInteger>;
      lastTriggerFireAtMs: Type.TOptional<Type.TInteger>;
      triggerState: Type.TOptional<Type.TUnknown>;
    }>;
    nextRunAtMs: Type.TOptional<Type.TInteger>;
    lastRunAtMs: Type.TOptional<Type.TInteger>;
    lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
    lastRunError: Type.TOptional<Type.TString>;
    lastDelivered: Type.TOptional<Type.TBoolean>;
    lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    lastDeliveryError: Type.TOptional<Type.TString>;
    lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
    lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
  }>;
}>;
/** Successful result from imperative create or declaration-key convergence. */
declare const CronAddResultSchema: Type.TUnion<[Type.TObject<{
  id: Type.TString;
  declarationKey: Type.TOptional<Type.TString>;
  displayName: Type.TOptional<Type.TString>;
  owner: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>>;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  name: Type.TString;
  description: Type.TOptional<Type.TString>;
  enabled: Type.TBoolean;
  deleteAfterRun: Type.TOptional<Type.TBoolean>;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger; /** Opaque Gateway-computed token for the job definition, excluding scheduler state. */
  configRevision: Type.TOptional<Type.TString>;
  schedule: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"at">;
    at: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"every">;
    everyMs: Type.TInteger;
    anchorMs: Type.TOptional<Type.TInteger>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"cron">;
    expr: Type.TString;
    tz: Type.TOptional<Type.TString>;
    staggerMs: Type.TOptional<Type.TInteger>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"on-exit">;
    command: Type.TString;
    cwd: Type.TOptional<Type.TString>;
  }>]>;
  pacing: Type.TOptional<Type.TObject<{
    min: Type.TOptional<Type.TString>;
    max: Type.TOptional<Type.TString>;
  }>>;
  trigger: Type.TOptional<Type.TObject<{
    script: Type.TString;
    once: Type.TOptional<Type.TBoolean>;
  }>>;
  sessionTarget: Type.TUnion<[Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]>;
  wakeMode: Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>;
  payload: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"systemEvent">;
    text: Type.TString;
    toolsAllow: Type.TOptional<Type.TArray<Type.TString>>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"agentTurn">;
    message: Type.TSchema;
    model: Type.TOptional<Type.TSchema>;
    fallbacks: Type.TOptional<Type.TSchema>;
    thinking: Type.TOptional<Type.TSchema>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
    lightContext: Type.TOptional<Type.TBoolean>;
    toolsAllow: Type.TOptional<Type.TSchema>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"command">;
    argv: Type.TSchema;
    cwd: Type.TOptional<Type.TString>;
    env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    input: Type.TOptional<Type.TString>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
    outputMaxBytes: Type.TOptional<Type.TInteger>;
    toolsAllow: Type.TOptional<Type.TSchema>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"script">;
    script: Type.TSchema;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    toolBudget: Type.TOptional<Type.TInteger>;
    toolsAllow: Type.TOptional<Type.TSchema>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>]>;
  delivery: Type.TOptional<Type.TUnion<[Type.TObject<{
    to: Type.TOptional<Type.TString>;
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    accountId: Type.TOptional<Type.TString>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    }>>;
    mode: Type.TLiteral<"none">;
  }>, Type.TObject<{
    completionDestination: Type.TOptional<Type.TObject<{
      mode: Type.TLiteral<"webhook">;
      to: Type.TString;
    }>>;
    to: Type.TOptional<Type.TString>;
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    accountId: Type.TOptional<Type.TString>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    }>>;
    mode: Type.TLiteral<"announce">;
  }>, Type.TObject<{
    to: Type.TString;
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    accountId: Type.TOptional<Type.TString>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    }>>;
    mode: Type.TLiteral<"webhook">;
  }>]>>;
  failureAlert: Type.TOptional<Type.TUnion<[Type.TLiteral<false>, Type.TObject<{
    after: Type.TOptional<Type.TInteger>;
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    to: Type.TOptional<Type.TString>;
    cooldownMs: Type.TOptional<Type.TInteger>;
    includeSkipped: Type.TOptional<Type.TBoolean>;
    mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    accountId: Type.TOptional<Type.TString>;
  }>]>>;
  state: Type.TObject<{
    nextRunAtMs: Type.TOptional<Type.TInteger>;
    runningAtMs: Type.TOptional<Type.TInteger>;
    lastRunAtMs: Type.TOptional<Type.TInteger>;
    lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
    lastStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
    lastError: Type.TOptional<Type.TString>;
    lastDiagnostics: Type.TOptional<Type.TObject<{
      summary: Type.TOptional<Type.TString>;
      entries: Type.TArray<Type.TObject<{
        ts: Type.TInteger;
        source: Type.TUnion<[Type.TLiteral<"cron-preflight">, Type.TLiteral<"cron-setup">, Type.TLiteral<"model-preflight">, Type.TLiteral<"agent-run">, Type.TLiteral<"tool">, Type.TLiteral<"exec">, Type.TLiteral<"delivery">]>;
        severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"error">]>;
        message: Type.TString;
        toolName: Type.TOptional<Type.TString>;
        exitCode: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
        truncated: Type.TOptional<Type.TBoolean>;
      }>>;
    }>>;
    lastDiagnosticSummary: Type.TOptional<Type.TString>;
    lastErrorReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"context_overflow">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
    lastDurationMs: Type.TOptional<Type.TInteger>;
    consecutiveErrors: Type.TOptional<Type.TInteger>;
    consecutiveSkipped: Type.TOptional<Type.TInteger>;
    lastDelivered: Type.TOptional<Type.TBoolean>;
    lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    lastDeliveryError: Type.TOptional<Type.TString>;
    lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
    lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
    lastFailureAlertAtMs: Type.TOptional<Type.TInteger>;
    lastTriggerEvalAtMs: Type.TOptional<Type.TInteger>;
    triggerEvalCount: Type.TOptional<Type.TInteger>;
    lastTriggerFireAtMs: Type.TOptional<Type.TInteger>;
    triggerState: Type.TOptional<Type.TUnknown>;
  }>;
  nextRunAtMs: Type.TOptional<Type.TInteger>;
  lastRunAtMs: Type.TOptional<Type.TInteger>;
  lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
  lastRunError: Type.TOptional<Type.TString>;
  lastDelivered: Type.TOptional<Type.TBoolean>;
  lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
  lastDeliveryError: Type.TOptional<Type.TString>;
  lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
  lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
  lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  created: Type.TBoolean;
  updated: Type.TOptional<Type.TBoolean>;
  job: Type.TObject<{
    id: Type.TString;
    declarationKey: Type.TOptional<Type.TString>;
    displayName: Type.TOptional<Type.TString>;
    owner: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    name: Type.TString;
    description: Type.TOptional<Type.TString>;
    enabled: Type.TBoolean;
    deleteAfterRun: Type.TOptional<Type.TBoolean>;
    createdAtMs: Type.TInteger;
    updatedAtMs: Type.TInteger; /** Opaque Gateway-computed token for the job definition, excluding scheduler state. */
    configRevision: Type.TOptional<Type.TString>;
    schedule: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"at">;
      at: Type.TString;
    }>, Type.TObject<{
      kind: Type.TLiteral<"every">;
      everyMs: Type.TInteger;
      anchorMs: Type.TOptional<Type.TInteger>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"cron">;
      expr: Type.TString;
      tz: Type.TOptional<Type.TString>;
      staggerMs: Type.TOptional<Type.TInteger>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"on-exit">;
      command: Type.TString;
      cwd: Type.TOptional<Type.TString>;
    }>]>;
    pacing: Type.TOptional<Type.TObject<{
      min: Type.TOptional<Type.TString>;
      max: Type.TOptional<Type.TString>;
    }>>;
    trigger: Type.TOptional<Type.TObject<{
      script: Type.TString;
      once: Type.TOptional<Type.TBoolean>;
    }>>;
    sessionTarget: Type.TUnion<[Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]>;
    wakeMode: Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>;
    payload: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"systemEvent">;
      text: Type.TString;
      toolsAllow: Type.TOptional<Type.TArray<Type.TString>>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"agentTurn">;
      message: Type.TSchema;
      model: Type.TOptional<Type.TSchema>;
      fallbacks: Type.TOptional<Type.TSchema>;
      thinking: Type.TOptional<Type.TSchema>;
      timeoutSeconds: Type.TOptional<Type.TNumber>;
      allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
      lightContext: Type.TOptional<Type.TBoolean>;
      toolsAllow: Type.TOptional<Type.TSchema>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"command">;
      argv: Type.TSchema;
      cwd: Type.TOptional<Type.TString>;
      env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
      input: Type.TOptional<Type.TString>;
      timeoutSeconds: Type.TOptional<Type.TNumber>;
      noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
      outputMaxBytes: Type.TOptional<Type.TInteger>;
      toolsAllow: Type.TOptional<Type.TSchema>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"script">;
      script: Type.TSchema;
      timeoutSeconds: Type.TOptional<Type.TNumber>;
      toolBudget: Type.TOptional<Type.TInteger>;
      toolsAllow: Type.TOptional<Type.TSchema>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>]>;
    delivery: Type.TOptional<Type.TUnion<[Type.TObject<{
      to: Type.TOptional<Type.TString>;
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
      accountId: Type.TOptional<Type.TString>;
      bestEffort: Type.TOptional<Type.TBoolean>;
      failureDestination: Type.TOptional<Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        to: Type.TOptional<Type.TString>;
        accountId: Type.TOptional<Type.TString>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
      }>>;
      mode: Type.TLiteral<"none">;
    }>, Type.TObject<{
      completionDestination: Type.TOptional<Type.TObject<{
        mode: Type.TLiteral<"webhook">;
        to: Type.TString;
      }>>;
      to: Type.TOptional<Type.TString>;
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
      accountId: Type.TOptional<Type.TString>;
      bestEffort: Type.TOptional<Type.TBoolean>;
      failureDestination: Type.TOptional<Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        to: Type.TOptional<Type.TString>;
        accountId: Type.TOptional<Type.TString>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
      }>>;
      mode: Type.TLiteral<"announce">;
    }>, Type.TObject<{
      to: Type.TString;
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
      accountId: Type.TOptional<Type.TString>;
      bestEffort: Type.TOptional<Type.TBoolean>;
      failureDestination: Type.TOptional<Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        to: Type.TOptional<Type.TString>;
        accountId: Type.TOptional<Type.TString>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
      }>>;
      mode: Type.TLiteral<"webhook">;
    }>]>>;
    failureAlert: Type.TOptional<Type.TUnion<[Type.TLiteral<false>, Type.TObject<{
      after: Type.TOptional<Type.TInteger>;
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      to: Type.TOptional<Type.TString>;
      cooldownMs: Type.TOptional<Type.TInteger>;
      includeSkipped: Type.TOptional<Type.TBoolean>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
      accountId: Type.TOptional<Type.TString>;
    }>]>>;
    state: Type.TObject<{
      nextRunAtMs: Type.TOptional<Type.TInteger>;
      runningAtMs: Type.TOptional<Type.TInteger>;
      lastRunAtMs: Type.TOptional<Type.TInteger>;
      lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
      lastStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
      lastError: Type.TOptional<Type.TString>;
      lastDiagnostics: Type.TOptional<Type.TObject<{
        summary: Type.TOptional<Type.TString>;
        entries: Type.TArray<Type.TObject<{
          ts: Type.TInteger;
          source: Type.TUnion<[Type.TLiteral<"cron-preflight">, Type.TLiteral<"cron-setup">, Type.TLiteral<"model-preflight">, Type.TLiteral<"agent-run">, Type.TLiteral<"tool">, Type.TLiteral<"exec">, Type.TLiteral<"delivery">]>;
          severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"error">]>;
          message: Type.TString;
          toolName: Type.TOptional<Type.TString>;
          exitCode: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
          truncated: Type.TOptional<Type.TBoolean>;
        }>>;
      }>>;
      lastDiagnosticSummary: Type.TOptional<Type.TString>;
      lastErrorReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"context_overflow">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
      lastDurationMs: Type.TOptional<Type.TInteger>;
      consecutiveErrors: Type.TOptional<Type.TInteger>;
      consecutiveSkipped: Type.TOptional<Type.TInteger>;
      lastDelivered: Type.TOptional<Type.TBoolean>;
      lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
      lastDeliveryError: Type.TOptional<Type.TString>;
      lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
      lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
      lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
      lastFailureAlertAtMs: Type.TOptional<Type.TInteger>;
      lastTriggerEvalAtMs: Type.TOptional<Type.TInteger>;
      triggerEvalCount: Type.TOptional<Type.TInteger>;
      lastTriggerFireAtMs: Type.TOptional<Type.TInteger>;
      triggerState: Type.TOptional<Type.TUnknown>;
    }>;
    nextRunAtMs: Type.TOptional<Type.TInteger>;
    lastRunAtMs: Type.TOptional<Type.TInteger>;
    lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
    lastRunError: Type.TOptional<Type.TString>;
    lastDelivered: Type.TOptional<Type.TBoolean>;
    lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    lastDeliveryError: Type.TOptional<Type.TString>;
    lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
    lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
  }>;
}>]>;
/** Updates a cron job by id or legacy jobId alias. */
declare const CronUpdateParamsSchema: Type.TUnion<[Type.TObject<{
  id: Type.TString;
}>, Type.TObject<{
  jobId: Type.TString;
}>]>;
/** Removes a cron job by id or legacy jobId alias. */
declare const CronRemoveParamsSchema: Type.TUnion<[Type.TObject<{
  id: Type.TString;
}>, Type.TObject<{
  jobId: Type.TString;
}>]>;
/** Runs a cron job immediately or only if due. */
declare const CronRunParamsSchema: Type.TUnion<[Type.TObject<{
  id: Type.TString;
}>, Type.TObject<{
  jobId: Type.TString;
}>]>;
/** Query params for cron run history. */
declare const CronRunsParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  scope: Type.TOptional<Type.TUnion<[Type.TLiteral<"job">, Type.TLiteral<"all">]>>;
  id: Type.TOptional<Type.TString>;
  jobId: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
  offset: Type.TOptional<Type.TInteger>;
  statuses: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>>;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"all">, Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
  deliveryStatuses: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>>;
  deliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
  query: Type.TOptional<Type.TString>;
  sortDir: Type.TOptional<Type.TUnion<[Type.TLiteral<"asc">, Type.TLiteral<"desc">]>>;
}>;
/** One persisted cron run history entry. */
declare const CronRunLogEntrySchema: Type.TObject<{
  ts: Type.TInteger;
  jobId: Type.TString;
  action: Type.TLiteral<"finished">;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
  error: Type.TOptional<Type.TString>;
  errorReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"context_overflow">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
  summary: Type.TOptional<Type.TString>;
  diagnostics: Type.TOptional<Type.TObject<{
    summary: Type.TOptional<Type.TString>;
    entries: Type.TArray<Type.TObject<{
      ts: Type.TInteger;
      source: Type.TUnion<[Type.TLiteral<"cron-preflight">, Type.TLiteral<"cron-setup">, Type.TLiteral<"model-preflight">, Type.TLiteral<"agent-run">, Type.TLiteral<"tool">, Type.TLiteral<"exec">, Type.TLiteral<"delivery">]>;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"error">]>;
      message: Type.TString;
      toolName: Type.TOptional<Type.TString>;
      exitCode: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
      truncated: Type.TOptional<Type.TBoolean>;
    }>>;
  }>>;
  delivered: Type.TOptional<Type.TBoolean>;
  deliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
  deliveryError: Type.TOptional<Type.TString>;
  failureNotificationDelivery: Type.TOptional<Type.TObject<{
    delivered: Type.TOptional<Type.TBoolean>;
    status: Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>;
    error: Type.TOptional<Type.TString>;
  }>>;
  sessionId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  runAtMs: Type.TOptional<Type.TInteger>;
  durationMs: Type.TOptional<Type.TInteger>;
  nextRunAtMs: Type.TOptional<Type.TInteger>;
  triggerFired: Type.TOptional<Type.TBoolean>;
  model: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  usage: Type.TOptional<Type.TObject<{
    input_tokens: Type.TOptional<Type.TNumber>;
    output_tokens: Type.TOptional<Type.TNumber>;
    total_tokens: Type.TOptional<Type.TNumber>;
    cache_read_tokens: Type.TOptional<Type.TNumber>;
    cache_write_tokens: Type.TOptional<Type.TNumber>;
  }>>;
  jobName: Type.TOptional<Type.TString>;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/cron.types.d.ts
type CronJob = Static<typeof CronJobSchema>;
type CronListParams = Static<typeof CronListParamsSchema>;
type CronStatusParams = Static<typeof CronStatusParamsSchema>;
type CronGetParams = Static<typeof CronGetParamsSchema>;
type CronAddParams = Static<typeof CronAddParamsSchema>;
type CronAddResult = Static<typeof CronAddResultSchema>;
type CronDeclarativeAddResult = Static<typeof CronDeclarativeAddResultSchema>;
type CronUpdateParams = Static<typeof CronUpdateParamsSchema>;
type CronRemoveParams = Static<typeof CronRemoveParamsSchema>;
type CronRunParams = Static<typeof CronRunParamsSchema>;
type CronRunsParams = Static<typeof CronRunsParamsSchema>;
type CronRunLogEntry = Static<typeof CronRunLogEntrySchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/environments.d.ts
/**
 * Environment inventory protocol schemas.
 *
 * Environments are runtime targets such as local hosts, VMs, or remote workers;
 * this schema layer only describes their gateway-visible status summary.
 */
/** Runtime availability state for an environment target. */
declare const EnvironmentStatusSchema: Type.TString;
/** Durable lifecycle states for plugin-provisioned worker environments. */
declare const WorkerEnvironmentStateSchema: Type.TUnion<[Type.TLiteral<"requested">, Type.TLiteral<"provisioning">, Type.TLiteral<"bootstrapping">, Type.TLiteral<"ready">, Type.TLiteral<"attached">, Type.TLiteral<"idle">, Type.TLiteral<"draining">, Type.TLiteral<"destroying">, Type.TLiteral<"destroyed">, Type.TLiteral<"failed">, Type.TLiteral<"orphaned">]>;
/** Process-local SSH tunnel connectivity for a worker environment. */
declare const WorkerTunnelStatusSchema: Type.TUnion<[Type.TLiteral<"stopped">, Type.TLiteral<"connecting">, Type.TLiteral<"connected">, Type.TLiteral<"reconnecting">]>;
/** Worker-only lifecycle metadata layered onto the existing environment projection. */
declare const WorkerEnvironmentMetadataSchema: Type.TObject<{
  providerId: Type.TString;
  leaseId: Type.TOptional<Type.TString>;
  state: Type.TUnion<[Type.TLiteral<"requested">, Type.TLiteral<"provisioning">, Type.TLiteral<"bootstrapping">, Type.TLiteral<"ready">, Type.TLiteral<"attached">, Type.TLiteral<"idle">, Type.TLiteral<"draining">, Type.TLiteral<"destroying">, Type.TLiteral<"destroyed">, Type.TLiteral<"failed">, Type.TLiteral<"orphaned">]>;
  ageMs: Type.TInteger;
  idleMs: Type.TOptional<Type.TInteger>;
  attachedSessionIds: Type.TArray<Type.TString>;
  tunnelStatus: Type.TUnion<[Type.TLiteral<"stopped">, Type.TLiteral<"connecting">, Type.TLiteral<"connected">, Type.TLiteral<"reconnecting">]>;
}>;
/** Public environment summary shown in listings and status responses. */
declare const EnvironmentSummarySchema: Type.TObject<{
  id: Type.TString;
  type: Type.TString;
  label: Type.TOptional<Type.TString>;
  status: Type.TString;
  capabilities: Type.TOptional<Type.TArray<Type.TString>>;
  worker: Type.TOptional<Type.TObject<{
    providerId: Type.TString;
    leaseId: Type.TOptional<Type.TString>;
    state: Type.TUnion<[Type.TLiteral<"requested">, Type.TLiteral<"provisioning">, Type.TLiteral<"bootstrapping">, Type.TLiteral<"ready">, Type.TLiteral<"attached">, Type.TLiteral<"idle">, Type.TLiteral<"draining">, Type.TLiteral<"destroying">, Type.TLiteral<"destroyed">, Type.TLiteral<"failed">, Type.TLiteral<"orphaned">]>;
    ageMs: Type.TInteger;
    idleMs: Type.TOptional<Type.TInteger>;
    attachedSessionIds: Type.TArray<Type.TString>;
    tunnelStatus: Type.TUnion<[Type.TLiteral<"stopped">, Type.TLiteral<"connecting">, Type.TLiteral<"connected">, Type.TLiteral<"reconnecting">]>;
  }>>;
}>;
/** Empty request payload for listing known environments. */
declare const EnvironmentsListParamsSchema: Type.TObject<{}>;
/** List response containing all gateway-visible environment summaries. */
declare const EnvironmentsListResultSchema: Type.TObject<{
  environments: Type.TArray<Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    label: Type.TOptional<Type.TString>;
    status: Type.TString;
    capabilities: Type.TOptional<Type.TArray<Type.TString>>;
    worker: Type.TOptional<Type.TObject<{
      providerId: Type.TString;
      leaseId: Type.TOptional<Type.TString>;
      state: Type.TUnion<[Type.TLiteral<"requested">, Type.TLiteral<"provisioning">, Type.TLiteral<"bootstrapping">, Type.TLiteral<"ready">, Type.TLiteral<"attached">, Type.TLiteral<"idle">, Type.TLiteral<"draining">, Type.TLiteral<"destroying">, Type.TLiteral<"destroyed">, Type.TLiteral<"failed">, Type.TLiteral<"orphaned">]>;
      ageMs: Type.TInteger;
      idleMs: Type.TOptional<Type.TInteger>;
      attachedSessionIds: Type.TArray<Type.TString>;
      tunnelStatus: Type.TUnion<[Type.TLiteral<"stopped">, Type.TLiteral<"connecting">, Type.TLiteral<"connected">, Type.TLiteral<"reconnecting">]>;
    }>>;
  }>>;
  profiles: Type.TOptional<Type.TArray<Type.TObject<{
    id: Type.TString;
    providerId: Type.TString;
  }>>>;
}>;
/** Status lookup request for one environment id. */
declare const EnvironmentsStatusParamsSchema: Type.TObject<{
  environmentId: Type.TString;
}>;
/** Status lookup result for one environment id. */
declare const EnvironmentsStatusResultSchema: Type.TObject<{
  id: Type.TString;
  type: Type.TString;
  label: Type.TOptional<Type.TString>;
  status: Type.TString;
  capabilities: Type.TOptional<Type.TArray<Type.TString>>;
  worker: Type.TOptional<Type.TObject<{
    providerId: Type.TString;
    leaseId: Type.TOptional<Type.TString>;
    state: Type.TUnion<[Type.TLiteral<"requested">, Type.TLiteral<"provisioning">, Type.TLiteral<"bootstrapping">, Type.TLiteral<"ready">, Type.TLiteral<"attached">, Type.TLiteral<"idle">, Type.TLiteral<"draining">, Type.TLiteral<"destroying">, Type.TLiteral<"destroyed">, Type.TLiteral<"failed">, Type.TLiteral<"orphaned">]>;
    ageMs: Type.TInteger;
    idleMs: Type.TOptional<Type.TInteger>;
    attachedSessionIds: Type.TArray<Type.TString>;
    tunnelStatus: Type.TUnion<[Type.TLiteral<"stopped">, Type.TLiteral<"connecting">, Type.TLiteral<"connected">, Type.TLiteral<"reconnecting">]>;
  }>>;
}>;
/** Creates a worker environment from one configured provider profile. */
declare const EnvironmentsCreateParamsSchema: Type.TObject<{
  profileId: Type.TString;
  idempotencyKey: Type.TString;
}>;
/** Create result uses the same public summary shape as list and status. */
declare const EnvironmentsCreateResultSchema: Type.TObject<{
  id: Type.TString;
  type: Type.TString;
  label: Type.TOptional<Type.TString>;
  status: Type.TString;
  capabilities: Type.TOptional<Type.TArray<Type.TString>>;
  worker: Type.TOptional<Type.TObject<{
    providerId: Type.TString;
    leaseId: Type.TOptional<Type.TString>;
    state: Type.TUnion<[Type.TLiteral<"requested">, Type.TLiteral<"provisioning">, Type.TLiteral<"bootstrapping">, Type.TLiteral<"ready">, Type.TLiteral<"attached">, Type.TLiteral<"idle">, Type.TLiteral<"draining">, Type.TLiteral<"destroying">, Type.TLiteral<"destroyed">, Type.TLiteral<"failed">, Type.TLiteral<"orphaned">]>;
    ageMs: Type.TInteger;
    idleMs: Type.TOptional<Type.TInteger>;
    attachedSessionIds: Type.TArray<Type.TString>;
    tunnelStatus: Type.TUnion<[Type.TLiteral<"stopped">, Type.TLiteral<"connecting">, Type.TLiteral<"connected">, Type.TLiteral<"reconnecting">]>;
  }>>;
}>;
/** Destroys one durable worker environment by its gateway-owned id. */
declare const EnvironmentsDestroyParamsSchema: Type.TObject<{
  environmentId: Type.TString;
  force: Type.TOptional<Type.TBoolean>;
}>;
/** Destroy result exposes the terminal worker lifecycle state. */
declare const EnvironmentsDestroyResultSchema: Type.TObject<{
  id: Type.TString;
  type: Type.TString;
  label: Type.TOptional<Type.TString>;
  status: Type.TString;
  capabilities: Type.TOptional<Type.TArray<Type.TString>>;
  worker: Type.TOptional<Type.TObject<{
    providerId: Type.TString;
    leaseId: Type.TOptional<Type.TString>;
    state: Type.TUnion<[Type.TLiteral<"requested">, Type.TLiteral<"provisioning">, Type.TLiteral<"bootstrapping">, Type.TLiteral<"ready">, Type.TLiteral<"attached">, Type.TLiteral<"idle">, Type.TLiteral<"draining">, Type.TLiteral<"destroying">, Type.TLiteral<"destroyed">, Type.TLiteral<"failed">, Type.TLiteral<"orphaned">]>;
    ageMs: Type.TInteger;
    idleMs: Type.TOptional<Type.TInteger>;
    attachedSessionIds: Type.TArray<Type.TString>;
    tunnelStatus: Type.TUnion<[Type.TLiteral<"stopped">, Type.TLiteral<"connecting">, Type.TLiteral<"connected">, Type.TLiteral<"reconnecting">]>;
  }>>;
}>;
type EnvironmentStatus = Static<typeof EnvironmentStatusSchema>;
type WorkerEnvironmentState = Static<typeof WorkerEnvironmentStateSchema>;
type WorkerTunnelStatus = Static<typeof WorkerTunnelStatusSchema>;
type WorkerEnvironmentMetadata = Static<typeof WorkerEnvironmentMetadataSchema>;
type EnvironmentSummary = Static<typeof EnvironmentSummarySchema>;
type EnvironmentsCreateParams = Static<typeof EnvironmentsCreateParamsSchema>;
type EnvironmentsCreateResult = Static<typeof EnvironmentsCreateResultSchema>;
type EnvironmentsDestroyParams = Static<typeof EnvironmentsDestroyParamsSchema>;
type EnvironmentsDestroyResult = Static<typeof EnvironmentsDestroyResultSchema>;
type EnvironmentsListParams = Static<typeof EnvironmentsListParamsSchema>;
type EnvironmentsListResult = Static<typeof EnvironmentsListResultSchema>;
type EnvironmentsStatusParams = Static<typeof EnvironmentsStatusParamsSchema>;
type EnvironmentsStatusResult = Static<typeof EnvironmentsStatusResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/exec-approvals.d.ts
/** File-backed read snapshot with path/hash metadata for optimistic writes. */
declare const ExecApprovalsSnapshotSchema: Type.TObject<{
  path: Type.TString;
  exists: Type.TBoolean;
  hash: Type.TString;
  file: Type.TObject<{
    version: Type.TLiteral<1>;
    socket: Type.TOptional<Type.TObject<{
      path: Type.TOptional<Type.TString>;
      token: Type.TOptional<Type.TString>;
    }>>;
    defaults: Type.TOptional<Type.TObject<{
      security: Type.TOptional<Type.TString>;
      ask: Type.TOptional<Type.TString>;
      askFallback: Type.TOptional<Type.TString>;
      autoAllowSkills: Type.TOptional<Type.TBoolean>;
    }>>;
    agents: Type.TOptional<Type.TRecord<"^.*$", Type.TObject<{
      allowlist: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TOptional<Type.TString>;
        pattern: Type.TString;
        source: Type.TOptional<Type.TLiteral<"allow-always">>;
        commandText: Type.TOptional<Type.TString>;
        argPattern: Type.TOptional<Type.TString>;
        lastUsedAt: Type.TOptional<Type.TNumber>;
        lastUsedCommand: Type.TOptional<Type.TString>;
        lastResolvedPath: Type.TOptional<Type.TString>;
      }>>>;
      security: Type.TOptional<Type.TString>;
      ask: Type.TOptional<Type.TString>;
      askFallback: Type.TOptional<Type.TString>;
      autoAllowSkills: Type.TOptional<Type.TBoolean>;
    }>>>;
  }>;
}>;
/** Node read snapshot supporting file-backed and host-native approval owners. */
declare const ExecApprovalsNodeSnapshotSchema: Type.TObject<{
  path: Type.TOptional<Type.TString>;
  exists: Type.TOptional<Type.TBoolean>;
  hash: Type.TOptional<Type.TString>;
  file: Type.TOptional<Type.TObject<{
    version: Type.TLiteral<1>;
    socket: Type.TOptional<Type.TObject<{
      path: Type.TOptional<Type.TString>;
      token: Type.TOptional<Type.TString>;
    }>>;
    defaults: Type.TOptional<Type.TObject<{
      security: Type.TOptional<Type.TString>;
      ask: Type.TOptional<Type.TString>;
      askFallback: Type.TOptional<Type.TString>;
      autoAllowSkills: Type.TOptional<Type.TBoolean>;
    }>>;
    agents: Type.TOptional<Type.TRecord<"^.*$", Type.TObject<{
      allowlist: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TOptional<Type.TString>;
        pattern: Type.TString;
        source: Type.TOptional<Type.TLiteral<"allow-always">>;
        commandText: Type.TOptional<Type.TString>;
        argPattern: Type.TOptional<Type.TString>;
        lastUsedAt: Type.TOptional<Type.TNumber>;
        lastUsedCommand: Type.TOptional<Type.TString>;
        lastResolvedPath: Type.TOptional<Type.TString>;
      }>>>;
      security: Type.TOptional<Type.TString>;
      ask: Type.TOptional<Type.TString>;
      askFallback: Type.TOptional<Type.TString>;
      autoAllowSkills: Type.TOptional<Type.TBoolean>;
    }>>>;
  }>>;
  resolvedDefaults: Type.TOptional<Type.TObject<{
    security: Type.TUnion<[Type.TLiteral<"deny">, Type.TLiteral<"allowlist">, Type.TLiteral<"full">]>;
    ask: Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"on-miss">, Type.TLiteral<"always">]>;
    askFallback: Type.TUnion<[Type.TLiteral<"deny">, Type.TLiteral<"allowlist">, Type.TLiteral<"full">]>;
    autoAllowSkills: Type.TBoolean;
  }>>;
  enabled: Type.TOptional<Type.TBoolean>;
  baseHash: Type.TOptional<Type.TString>;
  defaultAction: Type.TOptional<Type.TUnion<[Type.TLiteral<"allow">, Type.TLiteral<"deny">, Type.TLiteral<"prompt">]>>;
  rules: Type.TOptional<Type.TArray<Type.TObject<{
    pattern: Type.TString;
    action: Type.TUnion<[Type.TLiteral<"allow">, Type.TLiteral<"deny">, Type.TLiteral<"prompt">]>;
    shells: Type.TOptional<Type.TArray<Type.TString>>;
    description: Type.TOptional<Type.TString>;
    enabled: Type.TOptional<Type.TBoolean>;
  }>>>;
  constraints: Type.TOptional<Type.TObject<{
    baseHashRequired: Type.TOptional<Type.TBoolean>;
    defaultAllowAllowed: Type.TOptional<Type.TBoolean>;
    broadAllowRulesAllowed: Type.TOptional<Type.TBoolean>;
    dangerousAllowRulesAllowed: Type.TOptional<Type.TBoolean>;
  }>>;
  message: Type.TOptional<Type.TString>;
}>;
/** Empty request payload for reading local exec approval policy. */
declare const ExecApprovalsGetParamsSchema: Type.TObject<{}>;
/** Local exec approval policy write request with optional base hash guard. */
declare const ExecApprovalsSetParamsSchema: Type.TObject<{
  file: Type.TObject<{
    version: Type.TLiteral<1>;
    socket: Type.TOptional<Type.TObject<{
      path: Type.TOptional<Type.TString>;
      token: Type.TOptional<Type.TString>;
    }>>;
    defaults: Type.TOptional<Type.TObject<{
      security: Type.TOptional<Type.TString>;
      ask: Type.TOptional<Type.TString>;
      askFallback: Type.TOptional<Type.TString>;
      autoAllowSkills: Type.TOptional<Type.TBoolean>;
    }>>;
    agents: Type.TOptional<Type.TRecord<"^.*$", Type.TObject<{
      allowlist: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TOptional<Type.TString>;
        pattern: Type.TString;
        source: Type.TOptional<Type.TLiteral<"allow-always">>;
        commandText: Type.TOptional<Type.TString>;
        argPattern: Type.TOptional<Type.TString>;
        lastUsedAt: Type.TOptional<Type.TNumber>;
        lastUsedCommand: Type.TOptional<Type.TString>;
        lastResolvedPath: Type.TOptional<Type.TString>;
      }>>>;
      security: Type.TOptional<Type.TString>;
      ask: Type.TOptional<Type.TString>;
      askFallback: Type.TOptional<Type.TString>;
      autoAllowSkills: Type.TOptional<Type.TBoolean>;
    }>>>;
  }>;
  baseHash: Type.TOptional<Type.TString>;
}>;
/** Lookup request for one pending exec approval by id. */
declare const ExecApprovalGetParamsSchema: Type.TObject<{
  id: Type.TString;
}>;
/** Pending command execution approval request shown to reviewers. */
declare const ExecApprovalRequestParamsSchema: Type.TObject<{
  id: Type.TOptional<Type.TString>;
  command: Type.TOptional<Type.TString>;
  commandArgv: Type.TOptional<Type.TArray<Type.TString>>;
  systemRunPlan: Type.TOptional<Type.TObject<{
    argv: Type.TArray<Type.TString>;
    cwd: Type.TUnion<[Type.TString, Type.TNull]>;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TUnion<[Type.TString, Type.TNull]>;
    sessionKey: Type.TUnion<[Type.TString, Type.TNull]>;
    policySnapshot: Type.TOptional<Type.TObject<{
      security: Type.TUnion<[Type.TLiteral<"deny">, Type.TLiteral<"allowlist">, Type.TLiteral<"full">]>;
      ask: Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"on-miss">, Type.TLiteral<"always">]>;
      askFallback: Type.TUnion<[Type.TLiteral<"deny">, Type.TLiteral<"allowlist">, Type.TLiteral<"full">]>;
      autoAllowSkills: Type.TBoolean;
      allowlistRules: Type.TArray<Type.TObject<{
        pattern: Type.TString;
        argPattern: Type.TOptional<Type.TString>;
        source: Type.TOptional<Type.TLiteral<"allow-always">>;
      }>>;
    }>>;
    mutableFileOperand: Type.TOptional<Type.TUnion<[Type.TObject<{
      argvIndex: Type.TInteger;
      path: Type.TString;
      sha256: Type.TString;
    }>, Type.TNull]>>;
  }>>;
  env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  cwd: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  security: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  ask: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  unavailableDecisions: Type.TOptional<Type.TArray<Type.TString>>;
  commandSpans: Type.TOptional<Type.TArray<Type.TObject<{
    startIndex: Type.TInteger;
    endIndex: Type.TInteger;
  }>>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  resolvedPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  sessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  sessionId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  runId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  toolCallId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceChannel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceTo: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceAccountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceThreadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber, Type.TNull]>>;
  approvalReviewerDeviceIds: Type.TOptional<Type.TArray<Type.TString>>;
  requireDeliveryRoute: Type.TOptional<Type.TBoolean>;
  suppressDelivery: Type.TOptional<Type.TBoolean>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  twoPhase: Type.TOptional<Type.TBoolean>;
}>;
/** Reviewer decision payload for one pending exec approval. */
declare const ExecApprovalResolveParamsSchema: Type.TObject<{
  id: Type.TString;
  decision: Type.TString;
}>;
type ExecApprovalsGetParams = Static<typeof ExecApprovalsGetParamsSchema>;
type ExecApprovalsSetParams = Static<typeof ExecApprovalsSetParamsSchema>;
type ExecApprovalsNodeSnapshot = Static<typeof ExecApprovalsNodeSnapshotSchema>;
type ExecApprovalsSnapshot = Static<typeof ExecApprovalsSnapshotSchema>;
type ExecApprovalGetParams = Static<typeof ExecApprovalGetParamsSchema>;
type ExecApprovalRequestParams = Static<typeof ExecApprovalRequestParamsSchema>;
type ExecApprovalResolveParams = Static<typeof ExecApprovalResolveParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/devices.d.ts
/**
 * Device pairing and token-management protocol schemas.
 *
 * These payloads cross the gateway approval boundary, so request ids and device
 * ids stay explicit and feature handlers own the authorization checks.
 */
/** Lists pending and approved device pairing records. */
declare const DevicePairListParamsSchema: Type.TObject<{}>;
/** Approves a pending pairing request by request id. */
declare const DevicePairApproveParamsSchema: Type.TObject<{
  requestId: Type.TString;
}>;
/** Rejects a pending pairing request by request id. */
declare const DevicePairRejectParamsSchema: Type.TObject<{
  requestId: Type.TString;
}>;
/** Renames a paired device while preserving its stable device id. */
declare const DevicePairRenameParamsSchema: Type.TObject<{
  deviceId: Type.TString;
  label: Type.TString;
}>;
/**
 * Generates a device-pairing setup code (and optional QR) so a mobile/companion
 * client can scan it and connect to this gateway. The embedded setup code mints
 * a short-lived bootstrap token that defaults to full native-mobile operator
 * access, so this method requires operator.admin
 * (enforced by the core method descriptor's method-scope policy, not the handler)
 * and is not advertised. `bootstrapProfile: "limited"` omits operator.admin;
 * `bootstrapProfile: "node"` narrows the handoff to a node role with no operator
 * scopes for companion devices such as watchOS.
 */
declare const DevicePairSetupCodeParamsSchema: Type.TObject<{
  publicUrl: Type.TOptional<Type.TString>;
  preferRemoteUrl: Type.TOptional<Type.TBoolean>;
  includeQr: Type.TOptional<Type.TBoolean>;
  bootstrapProfile: Type.TOptional<Type.TString>;
}>;
/**
 * Setup code plus non-secret connection metadata. `auth` is a label only
 * ("token" | "password"); the gateway credential itself is never returned.
 * `accessDowngraded` reports the plaintext-LAN safety fallback from full to
 * limited access so the presenting client can explain how to upgrade.
 */
declare const DevicePairSetupCodeResultSchema: Type.TObject<{
  setupCode: Type.TString;
  qrDataUrl: Type.TOptional<Type.TString>;
  gatewayUrl: Type.TString;
  gatewayUrls: Type.TOptional<Type.TArray<Type.TString>>;
  auth: Type.TUnion<[Type.TLiteral<"token">, Type.TLiteral<"password">]>;
  urlSource: Type.TString;
  access: Type.TOptional<Type.TUnion<[Type.TLiteral<"full">, Type.TLiteral<"limited">, Type.TLiteral<"node">]>>;
  accessDowngraded: Type.TOptional<Type.TBoolean>;
}>;
type DevicePairListParams = Static<typeof DevicePairListParamsSchema>;
type DevicePairApproveParams = Static<typeof DevicePairApproveParamsSchema>;
type DevicePairRejectParams = Static<typeof DevicePairRejectParamsSchema>;
type DevicePairSetupCodeParams = Static<typeof DevicePairSetupCodeParamsSchema>;
type DevicePairSetupCodeResult = Static<typeof DevicePairSetupCodeResultSchema>;
type DevicePairRenameParams = Static<typeof DevicePairRenameParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/fs.d.ts
declare const FsListDirParamsSchema: Type.TObject<{
  /** Absolute directory to list; omitted means the selected host's home directory. */path: Type.TOptional<Type.TString>; /** Connected node host to browse; omitted means the Gateway host. */
  nodeId: Type.TOptional<Type.TString>;
}>;
declare const FsDirEntrySchema: Type.TObject<{
  name: Type.TString;
  path: Type.TString; /** Dot-prefixed directories; clients render them dimmed after visible ones. */
  hidden: Type.TOptional<Type.TBoolean>;
}>;
declare const FsListDirResultSchema: Type.TObject<{
  /** Resolved absolute path that was listed. */path: Type.TString; /** Absent at the filesystem root. */
  parent: Type.TOptional<Type.TString>; /** Selected host's home directory, for the picker's "home" shortcut. */
  home: Type.TString;
  entries: Type.TArray<Type.TObject<{
    name: Type.TString;
    path: Type.TString; /** Dot-prefixed directories; clients render them dimmed after visible ones. */
    hidden: Type.TOptional<Type.TBoolean>;
  }>>;
}>;
type FsDirEntry = Static<typeof FsDirEntrySchema>;
type FsListDirParams = Static<typeof FsListDirParamsSchema>;
type FsListDirResult = Static<typeof FsListDirResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/gateway-suspend.d.ts
declare const GatewaySuspendTaskBlockerSchema: Type.TObject<{
  taskId: Type.TString;
  status: Type.TLiteral<"running">;
  runtime: Type.TUnion<[Type.TLiteral<"subagent">, Type.TLiteral<"acp">, Type.TLiteral<"cli">, Type.TLiteral<"cron">]>;
  runId: Type.TOptional<Type.TString>;
  label: Type.TOptional<Type.TString>;
  title: Type.TOptional<Type.TString>;
}>;
declare const GatewaySuspendBlockerSchema: Type.TObject<{
  kind: Type.TUnion<[Type.TLiteral<"queue">, Type.TLiteral<"reply">, Type.TLiteral<"embedded-run">, Type.TLiteral<"background-exec">, Type.TLiteral<"cron-run">, Type.TLiteral<"task">, Type.TLiteral<"root-request">, Type.TLiteral<"session-admission">, Type.TLiteral<"session-mutation">, Type.TLiteral<"chat-run">, Type.TLiteral<"queued-turn">, Type.TLiteral<"terminal-persistence">, Type.TLiteral<"terminal-session">]>;
  count: Type.TInteger;
  message: Type.TString;
  task: Type.TOptional<Type.TObject<{
    taskId: Type.TString;
    status: Type.TLiteral<"running">;
    runtime: Type.TUnion<[Type.TLiteral<"subagent">, Type.TLiteral<"acp">, Type.TLiteral<"cli">, Type.TLiteral<"cron">]>;
    runId: Type.TOptional<Type.TString>;
    label: Type.TOptional<Type.TString>;
    title: Type.TOptional<Type.TString>;
  }>>;
}>;
declare const GatewaySuspendPrepareParamsSchema: Type.TObject<{
  requestId: Type.TString;
}>;
declare const GatewaySuspendPrepareBusyResultSchema: Type.TObject<{
  status: Type.TLiteral<"busy">;
  reason: Type.TUnion<[Type.TLiteral<"active-work">, Type.TLiteral<"gateway-draining">]>;
  retryAfterMs: Type.TInteger;
  activeCount: Type.TInteger;
  blockers: Type.TArray<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"queue">, Type.TLiteral<"reply">, Type.TLiteral<"embedded-run">, Type.TLiteral<"background-exec">, Type.TLiteral<"cron-run">, Type.TLiteral<"task">, Type.TLiteral<"root-request">, Type.TLiteral<"session-admission">, Type.TLiteral<"session-mutation">, Type.TLiteral<"chat-run">, Type.TLiteral<"queued-turn">, Type.TLiteral<"terminal-persistence">, Type.TLiteral<"terminal-session">]>;
    count: Type.TInteger;
    message: Type.TString;
    task: Type.TOptional<Type.TObject<{
      taskId: Type.TString;
      status: Type.TLiteral<"running">;
      runtime: Type.TUnion<[Type.TLiteral<"subagent">, Type.TLiteral<"acp">, Type.TLiteral<"cli">, Type.TLiteral<"cron">]>;
      runId: Type.TOptional<Type.TString>;
      label: Type.TOptional<Type.TString>;
      title: Type.TOptional<Type.TString>;
    }>>;
  }>>;
}>;
declare const GatewaySuspendPrepareReadyResultSchema: Type.TObject<{
  status: Type.TLiteral<"ready">;
  suspensionId: Type.TString;
  expiresAtMs: Type.TInteger;
  activeCount: Type.TInteger;
  blockers: Type.TArray<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"queue">, Type.TLiteral<"reply">, Type.TLiteral<"embedded-run">, Type.TLiteral<"background-exec">, Type.TLiteral<"cron-run">, Type.TLiteral<"task">, Type.TLiteral<"root-request">, Type.TLiteral<"session-admission">, Type.TLiteral<"session-mutation">, Type.TLiteral<"chat-run">, Type.TLiteral<"queued-turn">, Type.TLiteral<"terminal-persistence">, Type.TLiteral<"terminal-session">]>;
    count: Type.TInteger;
    message: Type.TString;
    task: Type.TOptional<Type.TObject<{
      taskId: Type.TString;
      status: Type.TLiteral<"running">;
      runtime: Type.TUnion<[Type.TLiteral<"subagent">, Type.TLiteral<"acp">, Type.TLiteral<"cli">, Type.TLiteral<"cron">]>;
      runId: Type.TOptional<Type.TString>;
      label: Type.TOptional<Type.TString>;
      title: Type.TOptional<Type.TString>;
    }>>;
  }>>;
}>;
declare const GatewaySuspendPrepareResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"busy">;
  reason: Type.TUnion<[Type.TLiteral<"active-work">, Type.TLiteral<"gateway-draining">]>;
  retryAfterMs: Type.TInteger;
  activeCount: Type.TInteger;
  blockers: Type.TArray<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"queue">, Type.TLiteral<"reply">, Type.TLiteral<"embedded-run">, Type.TLiteral<"background-exec">, Type.TLiteral<"cron-run">, Type.TLiteral<"task">, Type.TLiteral<"root-request">, Type.TLiteral<"session-admission">, Type.TLiteral<"session-mutation">, Type.TLiteral<"chat-run">, Type.TLiteral<"queued-turn">, Type.TLiteral<"terminal-persistence">, Type.TLiteral<"terminal-session">]>;
    count: Type.TInteger;
    message: Type.TString;
    task: Type.TOptional<Type.TObject<{
      taskId: Type.TString;
      status: Type.TLiteral<"running">;
      runtime: Type.TUnion<[Type.TLiteral<"subagent">, Type.TLiteral<"acp">, Type.TLiteral<"cli">, Type.TLiteral<"cron">]>;
      runId: Type.TOptional<Type.TString>;
      label: Type.TOptional<Type.TString>;
      title: Type.TOptional<Type.TString>;
    }>>;
  }>>;
}>, Type.TObject<{
  status: Type.TLiteral<"ready">;
  suspensionId: Type.TString;
  expiresAtMs: Type.TInteger;
  activeCount: Type.TInteger;
  blockers: Type.TArray<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"queue">, Type.TLiteral<"reply">, Type.TLiteral<"embedded-run">, Type.TLiteral<"background-exec">, Type.TLiteral<"cron-run">, Type.TLiteral<"task">, Type.TLiteral<"root-request">, Type.TLiteral<"session-admission">, Type.TLiteral<"session-mutation">, Type.TLiteral<"chat-run">, Type.TLiteral<"queued-turn">, Type.TLiteral<"terminal-persistence">, Type.TLiteral<"terminal-session">]>;
    count: Type.TInteger;
    message: Type.TString;
    task: Type.TOptional<Type.TObject<{
      taskId: Type.TString;
      status: Type.TLiteral<"running">;
      runtime: Type.TUnion<[Type.TLiteral<"subagent">, Type.TLiteral<"acp">, Type.TLiteral<"cli">, Type.TLiteral<"cron">]>;
      runId: Type.TOptional<Type.TString>;
      label: Type.TOptional<Type.TString>;
      title: Type.TOptional<Type.TString>;
    }>>;
  }>>;
}>]>;
declare const GatewaySuspendStatusParamsSchema: Type.TObject<{
  suspensionId: Type.TString;
}>;
declare const GatewaySuspendStatusRunningResultSchema: Type.TObject<{
  status: Type.TLiteral<"running">;
}>;
declare const GatewaySuspendStatusReadyResultSchema: Type.TObject<{
  status: Type.TLiteral<"ready">;
  expiresAtMs: Type.TInteger;
}>;
declare const GatewaySuspendStatusResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"running">;
}>, Type.TObject<{
  status: Type.TLiteral<"ready">;
  expiresAtMs: Type.TInteger;
}>]>;
declare const GatewaySuspendResumeParamsSchema: Type.TObject<{
  suspensionId: Type.TString;
}>;
declare const GatewaySuspendResumeResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  status: Type.TLiteral<"running">;
  resumed: Type.TBoolean;
}>;
type GatewaySuspendTaskBlocker = Static<typeof GatewaySuspendTaskBlockerSchema>;
type GatewaySuspendBlocker = Static<typeof GatewaySuspendBlockerSchema>;
type GatewaySuspendPrepareParams = Static<typeof GatewaySuspendPrepareParamsSchema>;
type GatewaySuspendPrepareResult = Static<typeof GatewaySuspendPrepareResultSchema>;
type GatewaySuspendStatusParams = Static<typeof GatewaySuspendStatusParamsSchema>;
type GatewaySuspendStatusResult = Static<typeof GatewaySuspendStatusResultSchema>;
type GatewaySuspendResumeParams = Static<typeof GatewaySuspendResumeParamsSchema>;
type GatewaySuspendResumeResult = Static<typeof GatewaySuspendResumeResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/logs-chat.d.ts
/** Cursor-based request for the gateway log tail endpoint. */
declare const LogsTailParamsSchema: Type.TObject<{
  cursor: Type.TOptional<Type.TInteger>;
  limit: Type.TOptional<Type.TInteger>;
  maxBytes: Type.TOptional<Type.TInteger>;
}>;
/** Gateway log tail payload returned to dashboard clients. */
declare const LogsTailResultSchema: Type.TObject<{
  file: Type.TString;
  cursor: Type.TInteger;
  size: Type.TInteger;
  lines: Type.TArray<Type.TString>;
  truncated: Type.TOptional<Type.TBoolean>;
  reset: Type.TOptional<Type.TBoolean>;
}>;
/** Session-scoped history request used by WebChat and native WebSocket clients. */
declare const ChatHistoryParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
  offset: Type.TOptional<Type.TInteger>;
  messageId: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  maxChars: Type.TOptional<Type.TInteger>;
}>;
/** Lightweight chat metadata request; optional agent scope keeps selector state explicit. */
declare const ChatMetadataParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
}>;
/** Batched purpose-title request for tool calls rendered in the Control UI. */
declare const ChatToolTitlesParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  items: Type.TArray<Type.TObject<{
    id: Type.TString;
    name: Type.TString;
    input: Type.TString;
  }>>;
}>;
/**
 * Titles keyed by the caller-provided item id; missing ids mean no title.
 * `disabled: true` tells clients the gateway has tool titles switched off so
 * they stop requesting for the rest of the session.
 */
declare const ChatToolTitlesResultSchema: Type.TObject<{
  titles: Type.TRecord<"^.*$", Type.TString>;
  disabled: Type.TOptional<Type.TBoolean>;
}>;
/** Typed result shape for tool-title consumers. */
type ChatToolTitlesResult = Static<typeof ChatToolTitlesResultSchema>;
/** User-to-agent send request; idempotency key lets clients safely retry transport failures. */
declare const ChatSendParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  message: Type.TString;
  thinking: Type.TOptional<Type.TString>;
  fastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">]>>;
  fastAutoOnSeconds: Type.TOptional<Type.TInteger>;
  queueMode: Type.TOptional<Type.TString>;
  deliver: Type.TOptional<Type.TBoolean>;
  originatingChannel: Type.TOptional<Type.TString>;
  originatingTo: Type.TOptional<Type.TString>;
  originatingAccountId: Type.TOptional<Type.TString>;
  originatingThreadId: Type.TOptional<Type.TString>;
  replyToId: Type.TOptional<Type.TString>;
  attachments: Type.TOptional<Type.TArray<Type.TUnknown>>;
  toolBindings: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  systemInputProvenance: Type.TOptional<Type.TObject<{
    kind: Type.TString;
    originSessionId: Type.TOptional<Type.TString>;
    sourceSessionKey: Type.TOptional<Type.TString>;
    sourceChannel: Type.TOptional<Type.TString>;
    sourceTool: Type.TOptional<Type.TString>;
  }>>;
  systemProvenanceReceipt: Type.TOptional<Type.TString>;
  suppressCommandInterpretation: Type.TOptional<Type.TBoolean>;
  expectedSessionRoutingContract: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
}>;
/** Inserts an operator-visible synthetic message into an existing chat transcript. */
declare const ChatInjectParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  message: Type.TString;
  label: Type.TOptional<Type.TString>;
}>;
/** Public chat stream event union consumed by gateway protocol validators. */
declare const ChatEventSchema: Type.TUnion<[Type.TObject<{
  state: Type.TLiteral<"delta">;
  message: Type.TOptional<Type.TUnknown>;
  deltaText: Type.TString;
  replace: Type.TOptional<Type.TBoolean>;
  usage: Type.TOptional<Type.TUnknown>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>, Type.TObject<{
  state: Type.TLiteral<"final">;
  message: Type.TOptional<Type.TUnknown>;
  usage: Type.TOptional<Type.TUnknown>;
  stopReason: Type.TOptional<Type.TString>;
  yielded: Type.TOptional<Type.TLiteral<true>>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>, Type.TObject<{
  state: Type.TLiteral<"aborted">;
  message: Type.TOptional<Type.TUnknown>;
  errorMessage: Type.TOptional<Type.TString>;
  stopReason: Type.TOptional<Type.TString>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>, Type.TObject<{
  state: Type.TLiteral<"error">;
  message: Type.TOptional<Type.TUnknown>;
  errorMessage: Type.TOptional<Type.TString>;
  errorKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"refusal">, Type.TLiteral<"timeout">, Type.TLiteral<"rate_limit">, Type.TLiteral<"context_length">, Type.TLiteral<"unknown">]>>;
  usage: Type.TOptional<Type.TUnknown>;
  stopReason: Type.TOptional<Type.TString>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>]>;
type ChatMetadataParams = Static<typeof ChatMetadataParamsSchema>;
type ChatToolTitlesParams = Static<typeof ChatToolTitlesParamsSchema>;
type LogsTailParams = Static<typeof LogsTailParamsSchema>;
type LogsTailResult = Static<typeof LogsTailResultSchema>;
type ChatInjectParams = Static<typeof ChatInjectParamsSchema>;
type ChatEvent = Static<typeof ChatEventSchema>;
//#endregion
//#region packages/gateway-protocol/src/version.d.ts
/** Current gateway protocol version emitted by modern clients and servers. */
declare const PROTOCOL_VERSION: 4;
/** Lowest general client protocol version accepted by the gateway. */
declare const MIN_CLIENT_PROTOCOL_VERSION: 4;
/** Lowest authenticated node protocol version accepted by the gateway. */
declare const MIN_NODE_PROTOCOL_VERSION: 3;
/** Lowest lightweight probe protocol version accepted by the gateway. */
declare const MIN_PROBE_PROTOCOL_VERSION: 3;
//#endregion
//#region packages/gateway-protocol/src/schema/push.d.ts
/** Request payload for sending a test APNS notification to one node. */
declare const PushTestParamsSchema: Type.TObject<{
  nodeId: Type.TString;
  title: Type.TOptional<Type.TString>;
  body: Type.TOptional<Type.TString>;
  environment: Type.TOptional<Type.TString>;
}>;
/** Result payload from an APNS push test, including provider status and transport. */
declare const PushTestResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  status: Type.TInteger;
  apnsId: Type.TOptional<Type.TString>;
  reason: Type.TOptional<Type.TString>;
  tokenSuffix: Type.TString;
  topic: Type.TString;
  environment: Type.TString;
  transport: Type.TString;
}>;
/** Empty request payload for fetching the Web Push VAPID public key. */
declare const WebPushVapidPublicKeyParamsSchema: Type.TObject<{}>;
/** Browser Web Push subscription payload registered with the gateway. */
declare const WebPushSubscribeParamsSchema: Type.TObject<{
  endpoint: Type.TString;
  keys: Type.TObject<{
    p256dh: Type.TString;
    auth: Type.TString;
  }>;
}>;
/** Browser Web Push endpoint removal payload. */
declare const WebPushUnsubscribeParamsSchema: Type.TObject<{
  endpoint: Type.TString;
}>;
/** Request payload for sending a test Web Push notification to current subscriptions. */
declare const WebPushTestParamsSchema: Type.TObject<{
  title: Type.TOptional<Type.TString>;
  body: Type.TOptional<Type.TString>;
}>;
/** Empty request type for fetching the Web Push VAPID public key. */
type WebPushVapidPublicKeyParams = Record<string, never>;
/** Browser PushSubscription subset persisted by the gateway. */
type WebPushSubscribeParams = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};
/** Browser PushSubscription endpoint removal request. */
type WebPushUnsubscribeParams = {
  endpoint: string;
};
/** Optional title/body overrides for a Web Push test notification. */
type WebPushTestParams = {
  title?: string;
  body?: string;
};
//#endregion
//#region packages/gateway-protocol/src/schema/questions.d.ts
declare const QuestionOptionSchema: Type.TObject<{
  label: Type.TString;
  description: Type.TOptional<Type.TString>;
}>;
/** Unnormalized question accepted by question.request. */
declare const QuestionRequestQuestionSchema: Type.TObject<{
  questionId: Type.TString;
  header: Type.TString;
  question: Type.TString;
  options: Type.TArray<Type.TObject<{
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
  }>>;
  multiSelect: Type.TOptional<Type.TBoolean>;
  isOther: Type.TOptional<Type.TBoolean>;
  isSecret: Type.TOptional<Type.TBoolean>;
}>;
/** Canonical normalized question shown to an operator. */
declare const QuestionSchema: Type.TObject<{
  questionId: Type.TString;
  header: Type.TString;
  question: Type.TString;
  options: Type.TArray<Type.TObject<{
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
  }>>;
  multiSelect: Type.TOptional<Type.TBoolean>;
  isOther: Type.TOptional<Type.TBoolean>;
  isSecret: Type.TOptional<Type.TBoolean>;
}>;
declare const QuestionAnswersSchema: Type.TObject<{
  answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
}>;
declare const QuestionStatusSchema: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"answered">, Type.TLiteral<"cancelled">, Type.TLiteral<"expired">]>;
/**
 * One pending or recently resolved transient question request. Flat object with
 * optional terminal fields (exec-approval record precedent): native protocol
 * codegen cannot emit per-status object unions, and the manager owns the
 * status/answers invariant (answers present only when status is "answered").
 */
declare const QuestionRecordSchema: Type.TObject<{
  id: Type.TString;
  questions: Type.TArray<Type.TObject<{
    questionId: Type.TString;
    header: Type.TString;
    question: Type.TString;
    options: Type.TArray<Type.TObject<{
      label: Type.TString;
      description: Type.TOptional<Type.TString>;
    }>>;
    multiSelect: Type.TOptional<Type.TBoolean>;
    isOther: Type.TOptional<Type.TBoolean>;
    isSecret: Type.TOptional<Type.TBoolean>;
  }>>;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"answered">, Type.TLiteral<"cancelled">, Type.TLiteral<"expired">]>;
  answers: Type.TOptional<Type.TObject<{
    answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
  }>>;
  resolvedBy: Type.TOptional<Type.TString>;
}>;
declare const QuestionRequestParamsSchema: Type.TObject<{
  id: Type.TOptional<Type.TString>;
  questions: Type.TArray<Type.TObject<{
    questionId: Type.TString;
    header: Type.TString;
    question: Type.TString;
    options: Type.TArray<Type.TObject<{
      label: Type.TString;
      description: Type.TOptional<Type.TString>;
    }>>;
    multiSelect: Type.TOptional<Type.TBoolean>;
    isOther: Type.TOptional<Type.TBoolean>;
    isSecret: Type.TOptional<Type.TBoolean>;
  }>>;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>;
declare const QuestionRequestResultSchema: Type.TObject<{
  id: Type.TString;
  expiresAtMs: Type.TInteger;
}>;
declare const QuestionWaitAnswerParamsSchema: Type.TObject<{
  id: Type.TString;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>;
declare const QuestionWaitAnswerResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"pending">;
}>, Type.TObject<{
  status: Type.TLiteral<"answered">;
  answers: Type.TObject<{
    answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
  }>;
}>, Type.TObject<{
  status: Type.TLiteral<"cancelled">;
}>, Type.TObject<{
  status: Type.TLiteral<"expired">;
}>]>;
declare const QuestionResolveParamsSchema: Type.TUnion<[Type.TObject<{
  id: Type.TString;
  answers: Type.TObject<{
    answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
  }>;
  resolvedBy: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  id: Type.TString;
  cancel: Type.TLiteral<true>;
  resolvedBy: Type.TOptional<Type.TString>;
}>]>;
declare const QuestionResolveResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"answered">;
  answers: Type.TObject<{
    answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
  }>;
}>, Type.TObject<{
  status: Type.TLiteral<"cancelled">;
}>]>;
declare const QuestionGetParamsSchema: Type.TObject<{
  id: Type.TString;
}>;
declare const QuestionGetResultSchema: Type.TObject<{
  question: Type.TObject<{
    id: Type.TString;
    questions: Type.TArray<Type.TObject<{
      questionId: Type.TString;
      header: Type.TString;
      question: Type.TString;
      options: Type.TArray<Type.TObject<{
        label: Type.TString;
        description: Type.TOptional<Type.TString>;
      }>>;
      multiSelect: Type.TOptional<Type.TBoolean>;
      isOther: Type.TOptional<Type.TBoolean>;
      isSecret: Type.TOptional<Type.TBoolean>;
    }>>;
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"answered">, Type.TLiteral<"cancelled">, Type.TLiteral<"expired">]>;
    answers: Type.TOptional<Type.TObject<{
      answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
    }>>;
    resolvedBy: Type.TOptional<Type.TString>;
  }>;
}>;
declare const QuestionListParamsSchema: Type.TObject<{}>;
declare const QuestionListResultSchema: Type.TObject<{
  questions: Type.TArray<Type.TObject<{
    id: Type.TString;
    questions: Type.TArray<Type.TObject<{
      questionId: Type.TString;
      header: Type.TString;
      question: Type.TString;
      options: Type.TArray<Type.TObject<{
        label: Type.TString;
        description: Type.TOptional<Type.TString>;
      }>>;
      multiSelect: Type.TOptional<Type.TBoolean>;
      isOther: Type.TOptional<Type.TBoolean>;
      isSecret: Type.TOptional<Type.TBoolean>;
    }>>;
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"answered">, Type.TLiteral<"cancelled">, Type.TLiteral<"expired">]>;
    answers: Type.TOptional<Type.TObject<{
      answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
    }>>;
    resolvedBy: Type.TOptional<Type.TString>;
  }>>;
}>;
declare const QuestionRequestedEventSchema: Type.TObject<{
  id: Type.TString;
  questions: Type.TArray<Type.TObject<{
    questionId: Type.TString;
    header: Type.TString;
    question: Type.TString;
    options: Type.TArray<Type.TObject<{
      label: Type.TString;
      description: Type.TOptional<Type.TString>;
    }>>;
    multiSelect: Type.TOptional<Type.TBoolean>;
    isOther: Type.TOptional<Type.TBoolean>;
    isSecret: Type.TOptional<Type.TBoolean>;
  }>>;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"answered">, Type.TLiteral<"cancelled">, Type.TLiteral<"expired">]>;
  answers: Type.TOptional<Type.TObject<{
    answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
  }>>;
  resolvedBy: Type.TOptional<Type.TString>;
}>;
declare const QuestionResolvedEventSchema: Type.TUnion<[Type.TObject<{
  id: Type.TString;
  status: Type.TLiteral<"answered">;
  answers: Type.TObject<{
    answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
  }>;
}>, Type.TObject<{
  id: Type.TString;
  status: Type.TLiteral<"cancelled">;
}>, Type.TObject<{
  id: Type.TString;
  status: Type.TLiteral<"expired">;
}>]>;
type QuestionOption = Static<typeof QuestionOptionSchema>;
type Question = Static<typeof QuestionSchema>;
type QuestionRequestQuestion = Static<typeof QuestionRequestQuestionSchema>;
type QuestionAnswers = Static<typeof QuestionAnswersSchema>;
type QuestionStatus = Static<typeof QuestionStatusSchema>;
type QuestionRecord = Static<typeof QuestionRecordSchema>;
type QuestionRequestParams = Static<typeof QuestionRequestParamsSchema>;
type QuestionRequestResult = Static<typeof QuestionRequestResultSchema>;
type QuestionWaitAnswerParams = Static<typeof QuestionWaitAnswerParamsSchema>;
type QuestionWaitAnswerResult = Static<typeof QuestionWaitAnswerResultSchema>;
type QuestionResolveParams = Static<typeof QuestionResolveParamsSchema>;
type QuestionResolveResult = Static<typeof QuestionResolveResultSchema>;
type QuestionGetParams = Static<typeof QuestionGetParamsSchema>;
type QuestionGetResult = Static<typeof QuestionGetResultSchema>;
type QuestionListParams = Static<typeof QuestionListParamsSchema>;
type QuestionListResult = Static<typeof QuestionListResultSchema>;
type QuestionRequestedEvent = Static<typeof QuestionRequestedEventSchema>;
type QuestionResolvedEvent = Static<typeof QuestionResolvedEventSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/session-placement-state.d.ts
declare const SESSION_PLACEMENT_STATES: readonly ["local", "requested", "provisioning", "syncing", "starting", "active", "draining", "reconciling", "reclaimed", "failed"];
type SessionPlacementState = (typeof SESSION_PLACEMENT_STATES)[number];
declare function isCloudWorkerPlacementState(state: SessionPlacementState | undefined): state is Exclude<SessionPlacementState, "local" | "reclaimed">;
//#endregion
//#region packages/gateway-protocol/src/schema/session-placement.d.ts
/** Durable gateway ownership states for one session execution placement.
 * The literal list stays explicit because Type.Union needs a tuple for
 * Static inference (a mapped array collapses Static to never); the guard
 * below keeps it in lockstep with SESSION_PLACEMENT_STATES. */
declare const SessionPlacementStateSchema: Type.TUnion<[Type.TLiteral<"local">, Type.TLiteral<"requested">, Type.TLiteral<"provisioning">, Type.TLiteral<"syncing">, Type.TLiteral<"starting">, Type.TLiteral<"active">, Type.TLiteral<"draining">, Type.TLiteral<"reconciling">, Type.TLiteral<"reclaimed">, Type.TLiteral<"failed">]>;
/** Gateway-visible placement projection; `state` remains the closed discriminator. */
declare const SessionPlacementSchema: Type.TUnion<[Type.TObject<{
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  state: Type.TLiteral<"local">;
}>, Type.TObject<{
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  state: Type.TLiteral<"requested">;
}>, Type.TObject<{
  environmentId: Type.TOptional<Type.TString>;
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  state: Type.TLiteral<"provisioning">;
}>, Type.TObject<{
  environmentId: Type.TString;
  workerBundleHash: Type.TString;
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  state: Type.TLiteral<"syncing">;
}>, Type.TObject<{
  workspaceBaseManifestRef: Type.TString;
  remoteWorkspaceDir: Type.TString;
  environmentId: Type.TString;
  workerBundleHash: Type.TString;
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  state: Type.TLiteral<"starting">;
}>, Type.TObject<{
  workspaceResultConflict: Type.TOptional<Type.TObject<{
    paths: Type.TArray<Type.TString>;
    stagedResultRef: Type.TString;
    totalCount: Type.TOptional<Type.TInteger>;
  }>>;
  lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
  lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
  workspaceBaseManifestRef: Type.TString;
  remoteWorkspaceDir: Type.TString;
  environmentId: Type.TString;
  activeOwnerEpoch: Type.TInteger;
  workerBundleHash: Type.TString;
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  state: Type.TLiteral<"active">;
}>, Type.TObject<{
  workspaceResultConflict: Type.TOptional<Type.TObject<{
    paths: Type.TArray<Type.TString>;
    stagedResultRef: Type.TString;
    totalCount: Type.TOptional<Type.TInteger>;
  }>>;
  lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
  lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
  workspaceBaseManifestRef: Type.TString;
  remoteWorkspaceDir: Type.TString;
  environmentId: Type.TString;
  activeOwnerEpoch: Type.TInteger;
  workerBundleHash: Type.TString;
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  state: Type.TLiteral<"draining">;
}>, Type.TObject<{
  workspaceResultConflict: Type.TOptional<Type.TObject<{
    paths: Type.TArray<Type.TString>;
    stagedResultRef: Type.TString;
    totalCount: Type.TOptional<Type.TInteger>;
  }>>;
  lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
  lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
  workspaceBaseManifestRef: Type.TString;
  remoteWorkspaceDir: Type.TString;
  environmentId: Type.TString;
  activeOwnerEpoch: Type.TInteger;
  workerBundleHash: Type.TString;
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  state: Type.TLiteral<"reconciling">;
}>, Type.TObject<{
  workspaceResultConflict: Type.TOptional<Type.TObject<{
    paths: Type.TArray<Type.TString>;
    stagedResultRef: Type.TString;
    totalCount: Type.TOptional<Type.TInteger>;
  }>>;
  lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
  lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
  environmentId: Type.TOptional<Type.TString>;
  activeOwnerEpoch: Type.TOptional<Type.TInteger>;
  workspaceBaseManifestRef: Type.TOptional<Type.TString>;
  remoteWorkspaceDir: Type.TOptional<Type.TString>;
  workerBundleHash: Type.TOptional<Type.TString>;
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  state: Type.TLiteral<"reclaimed">;
}>, Type.TObject<{
  recoveryError: Type.TString;
  workspaceResultConflict: Type.TOptional<Type.TObject<{
    paths: Type.TArray<Type.TString>;
    stagedResultRef: Type.TString;
    totalCount: Type.TOptional<Type.TInteger>;
  }>>;
  lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
  lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
  environmentId: Type.TOptional<Type.TString>;
  activeOwnerEpoch: Type.TOptional<Type.TInteger>;
  workspaceBaseManifestRef: Type.TOptional<Type.TString>;
  remoteWorkspaceDir: Type.TOptional<Type.TString>;
  workerBundleHash: Type.TOptional<Type.TString>;
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  state: Type.TLiteral<"failed">;
}>]>;
/** Requests one-way dispatch of an existing local session to a configured worker profile. */
declare const SessionsDispatchParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  profileId: Type.TString;
}>;
/** Result returned once session dispatch reaches durable worker ownership. */
declare const SessionsDispatchResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  key: Type.TString;
  sessionId: Type.TString;
  placement: Type.TObject<{
    workspaceResultConflict: Type.TOptional<Type.TObject<{
      paths: Type.TArray<Type.TString>;
      stagedResultRef: Type.TString;
      totalCount: Type.TOptional<Type.TInteger>;
    }>>;
    lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
    lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
    workspaceBaseManifestRef: Type.TString;
    remoteWorkspaceDir: Type.TString;
    environmentId: Type.TString;
    activeOwnerEpoch: Type.TInteger;
    workerBundleHash: Type.TString;
    generation: Type.TInteger;
    createdAtMs: Type.TInteger;
    updatedAtMs: Type.TInteger;
    stateChangedAtMs: Type.TInteger;
    state: Type.TLiteral<"active">;
  }>;
}>;
/** Requests safe workspace reconciliation and teardown of an active cloud worker. */
declare const SessionsReclaimParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Result returned once worker ownership has been destroyed and reclaimed. */
declare const SessionsReclaimResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  key: Type.TString;
  sessionId: Type.TString;
  placement: Type.TObject<{
    workspaceResultConflict: Type.TOptional<Type.TObject<{
      paths: Type.TArray<Type.TString>;
      stagedResultRef: Type.TString;
      totalCount: Type.TOptional<Type.TInteger>;
    }>>;
    lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
    lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
    environmentId: Type.TOptional<Type.TString>;
    activeOwnerEpoch: Type.TOptional<Type.TInteger>;
    workspaceBaseManifestRef: Type.TOptional<Type.TString>;
    remoteWorkspaceDir: Type.TOptional<Type.TString>;
    workerBundleHash: Type.TOptional<Type.TString>;
    generation: Type.TInteger;
    createdAtMs: Type.TInteger;
    updatedAtMs: Type.TInteger;
    stateChangedAtMs: Type.TInteger;
    state: Type.TLiteral<"reclaimed">;
  }>;
}>;
type SessionPlacement = Static<typeof SessionPlacementSchema>;
type SessionsDispatchParams = Static<typeof SessionsDispatchParamsSchema>;
type SessionsDispatchResult = Static<typeof SessionsDispatchResultSchema>;
type SessionsReclaimParams = Static<typeof SessionsReclaimParamsSchema>;
type SessionsReclaimResult = Static<typeof SessionsReclaimResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/session-discussion.d.ts
declare const SessionDiscussionStateSchema: Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"available">, Type.TLiteral<"open">]>;
declare const SessionDiscussionInfoSchema: Type.TObject<{
  state: Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"available">, Type.TLiteral<"open">]>;
  embedUrl: Type.TOptional<Type.TString>;
  openUrl: Type.TOptional<Type.TString>;
}>;
declare const SessionDiscussionInfoParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
}>;
declare const SessionDiscussionOpenParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
}>;
declare const SessionDiscussionInfoResultSchema: Type.TObject<{
  state: Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"available">, Type.TLiteral<"open">]>;
  embedUrl: Type.TOptional<Type.TString>;
  openUrl: Type.TOptional<Type.TString>;
}>;
declare const SessionDiscussionOpenResultSchema: Type.TObject<{
  state: Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"available">, Type.TLiteral<"open">]>;
  embedUrl: Type.TOptional<Type.TString>;
  openUrl: Type.TOptional<Type.TString>;
}>;
type SessionDiscussionState = Static<typeof SessionDiscussionStateSchema>;
type SessionDiscussionInfo = Static<typeof SessionDiscussionInfoSchema>;
type SessionDiscussionInfoParams = Static<typeof SessionDiscussionInfoParamsSchema>;
type SessionDiscussionOpenParams = Static<typeof SessionDiscussionOpenParamsSchema>;
type SessionDiscussionInfoResult = Static<typeof SessionDiscussionInfoResultSchema>;
type SessionDiscussionOpenResult = Static<typeof SessionDiscussionOpenResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/snapshot.d.ts
/**
 * Gateway state snapshot schemas.
 *
 * Snapshots are sent during hello and later event streams; they summarize node
 * presence, health, session defaults, and version counters for clients.
 */
/** One gateway-visible presence record for a node/client/runtime. */
declare const PresenceEntrySchema: Type.TObject<{
  host: Type.TOptional<Type.TString>;
  ip: Type.TOptional<Type.TString>;
  version: Type.TOptional<Type.TString>;
  platform: Type.TOptional<Type.TString>;
  deviceFamily: Type.TOptional<Type.TString>;
  modelIdentifier: Type.TOptional<Type.TString>;
  mode: Type.TOptional<Type.TString>;
  lastInputSeconds: Type.TOptional<Type.TInteger>;
  reason: Type.TOptional<Type.TString>;
  tags: Type.TOptional<Type.TArray<Type.TString>>;
  text: Type.TOptional<Type.TString>;
  ts: Type.TInteger;
  deviceId: Type.TOptional<Type.TString>;
  roles: Type.TOptional<Type.TArray<Type.TString>>;
  scopes: Type.TOptional<Type.TArray<Type.TString>>;
  instanceId: Type.TOptional<Type.TString>;
  user: Type.TOptional<Type.TObject<{
    /** Opaque identity key: authenticated email today, durable profile id later. Clients group presence by this. */id: Type.TString;
    email: Type.TOptional<Type.TString>;
    name: Type.TOptional<Type.TString>;
    avatarUrl: Type.TOptional<Type.TString>;
  }>>; /** Session keys this connection is actively subscribed to (watching). Sorted lexicographically for deterministic snapshots. */
  watchedSessions: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Monotonic version counters for snapshot subtrees. */
declare const StateVersionSchema: Type.TObject<{
  presence: Type.TInteger;
  health: Type.TInteger;
}>;
/** Initial and incremental gateway state snapshot payload. */
declare const SnapshotSchema: Type.TObject<{
  presence: Type.TArray<Type.TObject<{
    host: Type.TOptional<Type.TString>;
    ip: Type.TOptional<Type.TString>;
    version: Type.TOptional<Type.TString>;
    platform: Type.TOptional<Type.TString>;
    deviceFamily: Type.TOptional<Type.TString>;
    modelIdentifier: Type.TOptional<Type.TString>;
    mode: Type.TOptional<Type.TString>;
    lastInputSeconds: Type.TOptional<Type.TInteger>;
    reason: Type.TOptional<Type.TString>;
    tags: Type.TOptional<Type.TArray<Type.TString>>;
    text: Type.TOptional<Type.TString>;
    ts: Type.TInteger;
    deviceId: Type.TOptional<Type.TString>;
    roles: Type.TOptional<Type.TArray<Type.TString>>;
    scopes: Type.TOptional<Type.TArray<Type.TString>>;
    instanceId: Type.TOptional<Type.TString>;
    user: Type.TOptional<Type.TObject<{
      /** Opaque identity key: authenticated email today, durable profile id later. Clients group presence by this. */id: Type.TString;
      email: Type.TOptional<Type.TString>;
      name: Type.TOptional<Type.TString>;
      avatarUrl: Type.TOptional<Type.TString>;
    }>>; /** Session keys this connection is actively subscribed to (watching). Sorted lexicographically for deterministic snapshots. */
    watchedSessions: Type.TOptional<Type.TArray<Type.TString>>;
  }>>;
  health: Type.TObject<{
    ok: Type.TOptional<Type.TLiteral<true>>;
    ts: Type.TOptional<Type.TInteger>;
    durationMs: Type.TOptional<Type.TInteger>;
    eventLoop: Type.TOptional<Type.TObject<{
      degraded: Type.TBoolean;
      reasons: Type.TArray<Type.TUnion<[Type.TLiteral<"event_loop_delay">, Type.TLiteral<"event_loop_utilization">, Type.TLiteral<"cpu">]>>;
      intervalMs: Type.TNumber;
      delayP99Ms: Type.TNumber;
      delayMaxMs: Type.TNumber;
      utilization: Type.TNumber;
      cpuCoreRatio: Type.TNumber;
    }>>;
    plugins: Type.TOptional<Type.TObject<{
      loaded: Type.TArray<Type.TString>;
      errors: Type.TArray<Type.TObject<{
        id: Type.TString;
        origin: Type.TString;
        activated: Type.TBoolean;
        activationSource: Type.TOptional<Type.TString>;
        activationReason: Type.TOptional<Type.TString>;
        failurePhase: Type.TOptional<Type.TString>;
        error: Type.TString;
      }>>;
      unavailable: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TString;
        state: Type.TLiteral<"configured-unavailable">;
        diagnostic: Type.TObject<{
          kind: Type.TLiteral<"plugin-verification">;
          reason: Type.TString;
          detail: Type.TString;
        }>;
      }>>>;
    }>>;
    contextEngines: Type.TOptional<Type.TObject<{
      quarantined: Type.TArray<Type.TObject<{
        engineId: Type.TString;
        owner: Type.TOptional<Type.TString>;
        operation: Type.TString;
        reason: Type.TString;
        failedAt: Type.TInteger;
      }>>;
    }>>;
    deliveryQueues: Type.TOptional<Type.TObject<{
      failed: Type.TArray<Type.TObject<{
        queueName: Type.TString;
        count: Type.TInteger;
        oldestFailedAt: Type.TOptional<Type.TInteger>;
      }>>;
    }>>;
    modelPricing: Type.TOptional<Type.TObject<{
      state: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"degraded">, Type.TLiteral<"disabled">]>;
      sources: Type.TArray<Type.TObject<{
        source: Type.TUnion<[Type.TLiteral<"openrouter">, Type.TLiteral<"litellm">, Type.TLiteral<"bootstrap">, Type.TLiteral<"refresh">]>;
        state: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"degraded">]>;
        lastFailureAt: Type.TOptional<Type.TInteger>;
        detail: Type.TOptional<Type.TString>;
      }>>;
      lastFailureAt: Type.TOptional<Type.TInteger>;
      detail: Type.TOptional<Type.TString>;
    }>>;
    configReload: Type.TOptional<Type.TObject<{
      hotReloadStatus: Type.TUnion<[Type.TLiteral<"active">, Type.TLiteral<"disabled">]>;
    }>>;
    channels: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    channelOrder: Type.TOptional<Type.TArray<Type.TString>>;
    channelLabels: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    heartbeatSeconds: Type.TOptional<Type.TInteger>;
    defaultAgentId: Type.TOptional<Type.TString>;
    agents: Type.TOptional<Type.TArray<Type.TObject<{
      agentId: Type.TString;
      name: Type.TOptional<Type.TString>;
      isDefault: Type.TBoolean;
      heartbeat: Type.TObject<{
        enabled: Type.TBoolean;
        every: Type.TString;
        everyMs: Type.TUnion<[Type.TInteger, Type.TNull]>;
        prompt: Type.TString;
        target: Type.TString;
        model: Type.TOptional<Type.TString>;
        ackMaxChars: Type.TInteger;
      }>;
      sessions: Type.TObject<{
        path: Type.TString;
        count: Type.TInteger;
        recent: Type.TArray<Type.TObject<{
          key: Type.TString;
          updatedAt: Type.TUnion<[Type.TInteger, Type.TNull]>;
          age: Type.TUnion<[Type.TInteger, Type.TNull]>;
        }>>;
      }>;
    }>>>;
    sessions: Type.TOptional<Type.TObject<{
      path: Type.TString;
      count: Type.TInteger;
      recent: Type.TArray<Type.TObject<{
        key: Type.TString;
        updatedAt: Type.TUnion<[Type.TInteger, Type.TNull]>;
        age: Type.TUnion<[Type.TInteger, Type.TNull]>;
      }>>;
    }>>;
  }>;
  stateVersion: Type.TObject<{
    presence: Type.TInteger;
    health: Type.TInteger;
  }>;
  uptimeMs: Type.TInteger; /** Resolved source-config revision accepted by the active Gateway runtime. */
  appliedConfigHash: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  configPath: Type.TOptional<Type.TString>;
  stateDir: Type.TOptional<Type.TString>;
  sessionDefaults: Type.TOptional<Type.TObject<{
    defaultAgentId: Type.TString;
    mainKey: Type.TString;
    mainSessionKey: Type.TString;
    scope: Type.TOptional<Type.TString>;
  }>>;
  authMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"token">, Type.TLiteral<"password">, Type.TLiteral<"trusted-proxy">]>>;
  updateAvailable: Type.TOptional<Type.TObject<{
    currentVersion: Type.TString;
    latestVersion: Type.TString;
    channel: Type.TString;
  }>>;
}>;
type Snapshot = Static<typeof SnapshotSchema>;
type PresenceEntry = Static<typeof PresenceEntrySchema>;
type StateVersion = Static<typeof StateVersionSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/system-info.d.ts
/** Empty request payload for Gateway host system information. */
declare const SystemInfoParamsSchema: Type.TObject<{}>;
/** Gateway host identity and resource snapshot. */
declare const SystemInfoResultSchema: Type.TObject<{
  machineName: Type.TString;
  hostname: Type.TString;
  platform: Type.TString;
  release: Type.TString;
  arch: Type.TString;
  osLabel: Type.TString;
  lanAddress: Type.TOptional<Type.TString>;
  port: Type.TOptional<Type.TInteger>;
  nodeVersion: Type.TString;
  pid: Type.TInteger; /** Process-start identity for invalidating work that cannot survive a Gateway restart. */
  processInstanceId: Type.TOptional<Type.TString>;
  uptimeMs: Type.TInteger;
  cpuCount: Type.TInteger;
  cpuModel: Type.TOptional<Type.TString>;
  loadAverage: Type.TOptional<Type.TTuple<[Type.TNumber, Type.TNumber, Type.TNumber]>>;
  memoryTotalBytes: Type.TInteger;
  memoryFreeBytes: Type.TInteger;
  diskTotalBytes: Type.TOptional<Type.TInteger>;
  diskAvailableBytes: Type.TOptional<Type.TInteger>;
  diskPath: Type.TOptional<Type.TString>;
}>;
type SystemInfoParams = Static<typeof SystemInfoParamsSchema>;
type SystemInfoResult = Static<typeof SystemInfoResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/task-suggestions.d.ts
/** One model-proposed follow-up task waiting for operator action. */
declare const TaskSuggestionSchema: Type.TObject<{
  id: Type.TString;
  title: Type.TString;
  prompt: Type.TString;
  tldr: Type.TString;
  cwd: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  createdAt: Type.TInteger;
}>;
/** Lists pending suggestions, optionally narrowed to one source session. */
declare const TaskSuggestionsListParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
}>;
declare const TaskSuggestionsListResultSchema: Type.TObject<{
  suggestions: Type.TArray<Type.TObject<{
    id: Type.TString;
    title: Type.TString;
    prompt: Type.TString;
    tldr: Type.TString;
    cwd: Type.TString;
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    createdAt: Type.TInteger;
  }>>;
}>;
/** Creates a pending suggestion without starting any work. */
declare const TaskSuggestionsCreateParamsSchema: Type.TObject<{
  title: Type.TString;
  prompt: Type.TString;
  tldr: Type.TString;
  cwd: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
declare const TaskSuggestionsCreateResultSchema: Type.TObject<{
  taskId: Type.TString;
  suggestion: Type.TObject<{
    id: Type.TString;
    title: Type.TString;
    prompt: Type.TString;
    tldr: Type.TString;
    cwd: Type.TString;
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    createdAt: Type.TInteger;
  }>;
}>;
declare const TaskSuggestionResolutionSchema: Type.TUnion<[Type.TLiteral<"dismissed">, Type.TLiteral<"accepted">, Type.TLiteral<"expired">]>;
/** Atomically claims a pending suggestion and starts its server-owned worktree session. */
declare const TaskSuggestionsAcceptParamsSchema: Type.TObject<{
  taskId: Type.TString;
}>;
declare const TaskSuggestionsAcceptResultSchema: Type.TObject<{
  taskId: Type.TString;
  key: Type.TString;
}>;
/** Removes a pending suggestion without starting work. */
declare const TaskSuggestionsDismissParamsSchema: Type.TObject<{
  taskId: Type.TString;
  reason: Type.TOptional<Type.TString>;
}>;
declare const TaskSuggestionsDismissResultSchema: Type.TObject<{
  taskId: Type.TString;
  dismissed: Type.TBoolean;
}>;
/** Live update emitted when a pending suggestion is created or resolved. */
declare const TaskSuggestionEventSchema: Type.TUnion<[Type.TObject<{
  action: Type.TLiteral<"created">;
  suggestion: Type.TObject<{
    id: Type.TString;
    title: Type.TString;
    prompt: Type.TString;
    tldr: Type.TString;
    cwd: Type.TString;
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    createdAt: Type.TInteger;
  }>;
}>, Type.TObject<{
  action: Type.TLiteral<"resolved">;
  taskId: Type.TString;
  resolution: Type.TUnion<[Type.TLiteral<"dismissed">, Type.TLiteral<"accepted">, Type.TLiteral<"expired">]>;
}>]>;
type TaskSuggestion = Static<typeof TaskSuggestionSchema>;
type TaskSuggestionEvent = Static<typeof TaskSuggestionEventSchema>;
type TaskSuggestionResolution = Static<typeof TaskSuggestionResolutionSchema>;
type TaskSuggestionsAcceptParams = Static<typeof TaskSuggestionsAcceptParamsSchema>;
type TaskSuggestionsAcceptResult = Static<typeof TaskSuggestionsAcceptResultSchema>;
type TaskSuggestionsCreateParams = Static<typeof TaskSuggestionsCreateParamsSchema>;
type TaskSuggestionsCreateResult = Static<typeof TaskSuggestionsCreateResultSchema>;
type TaskSuggestionsDismissParams = Static<typeof TaskSuggestionsDismissParamsSchema>;
type TaskSuggestionsDismissResult = Static<typeof TaskSuggestionsDismissResultSchema>;
type TaskSuggestionsListParams = Static<typeof TaskSuggestionsListParamsSchema>;
type TaskSuggestionsListResult = Static<typeof TaskSuggestionsListResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/tasks.d.ts
/** Public task summary returned by task list/get/cancel responses. */
declare const TaskSummarySchema: Type.TObject<{
  id: Type.TString;
  kind: Type.TOptional<Type.TString>;
  runtime: Type.TOptional<Type.TString>;
  status: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>;
  title: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  childSessionKey: Type.TOptional<Type.TString>;
  ownerKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  taskId: Type.TOptional<Type.TString>;
  flowId: Type.TOptional<Type.TString>;
  parentTaskId: Type.TOptional<Type.TString>;
  sourceId: Type.TOptional<Type.TString>;
  createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
  updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
  startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
  endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
  toolUseCount: Type.TOptional<Type.TInteger>;
  lastToolName: Type.TOptional<Type.TString>;
  progressSummary: Type.TOptional<Type.TString>;
  terminalSummary: Type.TOptional<Type.TString>;
  error: Type.TOptional<Type.TString>; /** Bounded task input. Returned by tasks.get; omitted from list/event summaries. */
  prompt: Type.TOptional<Type.TString>;
}>;
/** Task list filters with bounded pagination. */
declare const TasksListParamsSchema: Type.TObject<{
  status: Type.TOptional<Type.TUnion<[Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>, Type.TArray<Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>>]>>;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
  cursor: Type.TOptional<Type.TString>;
}>;
/** Task list page response. */
declare const TasksListResultSchema: Type.TObject<{
  tasks: Type.TArray<Type.TObject<{
    id: Type.TString;
    kind: Type.TOptional<Type.TString>;
    runtime: Type.TOptional<Type.TString>;
    status: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>;
    title: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    childSessionKey: Type.TOptional<Type.TString>;
    ownerKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    flowId: Type.TOptional<Type.TString>;
    parentTaskId: Type.TOptional<Type.TString>;
    sourceId: Type.TOptional<Type.TString>;
    createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    toolUseCount: Type.TOptional<Type.TInteger>;
    lastToolName: Type.TOptional<Type.TString>;
    progressSummary: Type.TOptional<Type.TString>;
    terminalSummary: Type.TOptional<Type.TString>;
    error: Type.TOptional<Type.TString>; /** Bounded task input. Returned by tasks.get; omitted from list/event summaries. */
    prompt: Type.TOptional<Type.TString>;
  }>>;
  nextCursor: Type.TOptional<Type.TString>;
}>;
/** Lookup request for one task id. */
declare const TasksGetParamsSchema: Type.TObject<{
  taskId: Type.TString;
}>;
/** Lookup result for one task summary. */
declare const TasksGetResultSchema: Type.TObject<{
  task: Type.TObject<{
    id: Type.TString;
    kind: Type.TOptional<Type.TString>;
    runtime: Type.TOptional<Type.TString>;
    status: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>;
    title: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    childSessionKey: Type.TOptional<Type.TString>;
    ownerKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    flowId: Type.TOptional<Type.TString>;
    parentTaskId: Type.TOptional<Type.TString>;
    sourceId: Type.TOptional<Type.TString>;
    createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    toolUseCount: Type.TOptional<Type.TInteger>;
    lastToolName: Type.TOptional<Type.TString>;
    progressSummary: Type.TOptional<Type.TString>;
    terminalSummary: Type.TOptional<Type.TString>;
    error: Type.TOptional<Type.TString>; /** Bounded task input. Returned by tasks.get; omitted from list/event summaries. */
    prompt: Type.TOptional<Type.TString>;
  }>;
}>;
/** Cancel request for one task id with optional operator reason. */
declare const TasksCancelParamsSchema: Type.TObject<{
  taskId: Type.TString;
  reason: Type.TOptional<Type.TString>;
}>;
/** Cancel result, including the task snapshot when it was found. */
declare const TasksCancelResultSchema: Type.TObject<{
  found: Type.TBoolean;
  cancelled: Type.TBoolean;
  reason: Type.TOptional<Type.TString>;
  task: Type.TOptional<Type.TObject<{
    id: Type.TString;
    kind: Type.TOptional<Type.TString>;
    runtime: Type.TOptional<Type.TString>;
    status: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>;
    title: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    childSessionKey: Type.TOptional<Type.TString>;
    ownerKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    flowId: Type.TOptional<Type.TString>;
    parentTaskId: Type.TOptional<Type.TString>;
    sourceId: Type.TOptional<Type.TString>;
    createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    toolUseCount: Type.TOptional<Type.TInteger>;
    lastToolName: Type.TOptional<Type.TString>;
    progressSummary: Type.TOptional<Type.TString>;
    terminalSummary: Type.TOptional<Type.TString>;
    error: Type.TOptional<Type.TString>; /** Bounded task input. Returned by tasks.get; omitted from list/event summaries. */
    prompt: Type.TOptional<Type.TString>;
  }>>;
}>;
type TaskSummary = Static<typeof TaskSummarySchema>;
type TasksListParams = Static<typeof TasksListParamsSchema>;
type TasksListResult = Static<typeof TasksListResultSchema>;
type TasksGetParams = Static<typeof TasksGetParamsSchema>;
type TasksGetResult = Static<typeof TasksGetResultSchema>;
type TasksCancelParams = Static<typeof TasksCancelParamsSchema>;
type TasksCancelResult = Static<typeof TasksCancelResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/terminal.d.ts
/** Opens a shell session; the server picks the shell, cwd, and confinement. */
declare const TerminalOpenParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  catalog: Type.TOptional<Type.TObject<{
    catalogId: Type.TString;
    hostId: Type.TString;
    threadId: Type.TString;
  }>>;
  cols: Type.TInteger;
  rows: Type.TInteger;
}>;
type TerminalOpenParams = Static<typeof TerminalOpenParamsSchema>;
/** Result of a successful open; carries the facts the UI header renders. */
declare const TerminalOpenResultSchema: Type.TObject<{
  sessionId: Type.TString;
  agentId: Type.TString;
  shell: Type.TString;
  cwd: Type.TString;
  confined: Type.TBoolean;
  title: Type.TOptional<Type.TString>;
}>;
type TerminalOpenResult = Static<typeof TerminalOpenResultSchema>;
/** Writes client keystrokes to the session stdin. */
declare const TerminalInputParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  data: Type.TString;
}>;
type TerminalInputParams = Static<typeof TerminalInputParamsSchema>;
/** Stages one file on the host bound to an existing terminal session. */
declare const TerminalUploadParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  name: Type.TString;
  contentBase64: Type.TString;
}>;
type TerminalUploadParams = Static<typeof TerminalUploadParamsSchema>;
/** Absolute temporary path pasted into the active terminal after upload. */
declare const TerminalUploadResultSchema: Type.TObject<{
  path: Type.TString;
  size: Type.TInteger;
}>;
type TerminalUploadResult = Static<typeof TerminalUploadResultSchema>;
/** Resizes the PTY grid after the client viewport changes. */
declare const TerminalResizeParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  cols: Type.TInteger;
  rows: Type.TInteger;
}>;
type TerminalResizeParams = Static<typeof TerminalResizeParamsSchema>;
/** Closes a session and kills its process tree. */
declare const TerminalCloseParamsSchema: Type.TObject<{
  sessionId: Type.TString;
}>;
type TerminalCloseParams = Static<typeof TerminalCloseParamsSchema>;
/**
 * Attaches the calling admin connection. Connection-owned sessions use
 * take-over; agent-owned sessions retain ownership and add a shared viewer.
 */
declare const TerminalAttachParamsSchema: Type.TObject<{
  sessionId: Type.TString;
}>;
type TerminalAttachParams = Static<typeof TerminalAttachParamsSchema>;
/** Result of a successful attach; mirrors open plus the replay buffer. */
declare const TerminalAttachResultSchema: Type.TObject<{
  sessionId: Type.TString;
  agentId: Type.TString;
  shell: Type.TString;
  cwd: Type.TString;
  confined: Type.TBoolean;
  buffer: Type.TString;
  seq: Type.TOptional<Type.TInteger>;
}>;
type TerminalAttachResult = Static<typeof TerminalAttachResultSchema>;
/** One attachable session, as reported by terminal.list. */
declare const TerminalSessionInfoSchema: Type.TObject<{
  sessionId: Type.TString;
  agentId: Type.TString;
  shell: Type.TString;
  cwd: Type.TString;
  confined: Type.TBoolean; /** False while the session is detached (no connection owns its stream). */
  attached: Type.TBoolean; /** Connection-owned session, or the trusted agent session key that owns it. */
  owner: Type.TOptional<Type.TUnion<[Type.TLiteral<"conn">, Type.TString]>>;
  createdAtMs: Type.TInteger;
}>;
type TerminalSessionInfo = Static<typeof TerminalSessionInfoSchema>;
/**
 * Sessions a reconnecting admin client can attach. All admin connections see
 * the same list: the terminal surface is already operator.admin (full host
 * access), so cross-connection visibility adds no privilege.
 */
declare const TerminalListResultSchema: Type.TObject<{
  sessions: Type.TArray<Type.TObject<{
    sessionId: Type.TString;
    agentId: Type.TString;
    shell: Type.TString;
    cwd: Type.TString;
    confined: Type.TBoolean; /** False while the session is detached (no connection owns its stream). */
    attached: Type.TBoolean; /** Connection-owned session, or the trusted agent session key that owns it. */
    owner: Type.TOptional<Type.TUnion<[Type.TLiteral<"conn">, Type.TString]>>;
    createdAtMs: Type.TInteger;
  }>>;
}>;
type TerminalListResult = Static<typeof TerminalListResultSchema>;
/** Reads the current output buffer as plain text without attaching. */
declare const TerminalTextParamsSchema: Type.TObject<{
  sessionId: Type.TString;
}>;
type TerminalTextParams = Static<typeof TerminalTextParamsSchema>;
/** Plain-text buffer contents (ANSI stripped); an agent/LLM affordance. */
declare const TerminalTextResultSchema: Type.TObject<{
  text: Type.TString;
}>;
type TerminalTextResult = Static<typeof TerminalTextResultSchema>;
/** Shared ok/void result for input, resize, and close. */
declare const TerminalAckResultSchema: Type.TObject<{
  ok: Type.TBoolean;
}>;
type TerminalAckResult = Static<typeof TerminalAckResultSchema>;
/** Streamed output chunk; seq is its cumulative UTF-16 end offset within the session. */
declare const TerminalDataEventSchema: Type.TObject<{
  sessionId: Type.TString;
  seq: Type.TInteger;
  data: Type.TString;
}>;
type TerminalDataEvent = Static<typeof TerminalDataEventSchema>;
/** Terminal end-of-life notice; the session id is invalid after this event. */
declare const TerminalExitEventSchema: Type.TObject<{
  sessionId: Type.TString;
  exitCode: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
  signal: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
  reason: Type.TOptional<Type.TUnion<[Type.TLiteral<"process_exit">, Type.TLiteral<"closed">, Type.TLiteral<"disconnected">, Type.TLiteral<"detached">, Type.TLiteral<"error">]>>;
  error: Type.TOptional<Type.TString>;
}>;
type TerminalExitEvent = Static<typeof TerminalExitEventSchema>;
/** Union of every event a terminal session can emit. */
declare const TerminalEventSchema: Type.TUnion<[Type.TObject<{
  sessionId: Type.TString;
  seq: Type.TInteger;
  data: Type.TString;
}>, Type.TObject<{
  sessionId: Type.TString;
  exitCode: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
  signal: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
  reason: Type.TOptional<Type.TUnion<[Type.TLiteral<"process_exit">, Type.TLiteral<"closed">, Type.TLiteral<"disconnected">, Type.TLiteral<"detached">, Type.TLiteral<"error">]>>;
  error: Type.TOptional<Type.TString>;
}>]>;
type TerminalEvent = Static<typeof TerminalEventSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/plugins.d.ts
/** Empty request payload for listing plugin UI descriptors. */
declare const PluginsUiDescriptorsParamsSchema: Type.TObject<{}>;
/** Response payload containing all plugin UI descriptors visible to the client. */
declare const PluginsUiDescriptorsResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  descriptors: Type.TArray<Type.TObject<{
    id: Type.TString;
    pluginId: Type.TString;
    pluginName: Type.TOptional<Type.TString>;
    surface: Type.TUnion<[Type.TLiteral<"session">, Type.TLiteral<"tool">, Type.TLiteral<"run">, Type.TLiteral<"settings">]>;
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
    placement: Type.TOptional<Type.TString>;
    schema: Type.TOptional<Type.TUnknown>;
    requiredScopes: Type.TOptional<Type.TArray<Type.TString>>;
  }>>;
}>;
/** Request payload for invoking one plugin-owned session action. */
declare const PluginsSessionActionParamsSchema: Type.TObject<{
  pluginId: Type.TString;
  actionId: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  payload: Type.TOptional<Type.TUnknown>;
}>;
/** Discriminated plugin action result returned to gateway clients. */
declare const PluginsSessionActionResultSchema: Type.TUnion<[Type.TObject<{
  ok: Type.TLiteral<true>;
  result: Type.TOptional<Type.TUnknown>;
  continueAgent: Type.TOptional<Type.TBoolean>;
  reply: Type.TOptional<Type.TUnknown>;
}>, Type.TObject<{
  ok: Type.TLiteral<false>;
  error: Type.TString;
  code: Type.TOptional<Type.TString>;
  details: Type.TOptional<Type.TUnknown>;
}>]>;
declare const PluginCatalogInstallActionSchema: Type.TUnion<[Type.TObject<{
  source: Type.TLiteral<"clawhub">;
  packageName: Type.TString;
}>, Type.TObject<{
  source: Type.TLiteral<"official">;
  pluginId: Type.TString;
}>]>;
/** Cold control-plane representation of an installed or available plugin. */
declare const PluginCatalogEntrySchema: Type.TObject<{
  id: Type.TString;
  name: Type.TString;
  packageName: Type.TOptional<Type.TString>;
  description: Type.TOptional<Type.TString>;
  version: Type.TOptional<Type.TString>;
  kind: Type.TOptional<Type.TArray<Type.TString>>;
  origin: Type.TOptional<Type.TString>;
  installed: Type.TBoolean;
  enabled: Type.TBoolean;
  state: Type.TUnion<[Type.TLiteral<"enabled">, Type.TLiteral<"disabled">, Type.TLiteral<"not-installed">, Type.TLiteral<"error">]>;
  featured: Type.TOptional<Type.TBoolean>;
  featuredAt: Type.TOptional<Type.TInteger>;
  order: Type.TOptional<Type.TNumber>; /** True when the gateway can resolve a manifest or catalog icon for this plugin identity. */
  hasIcon: Type.TOptional<Type.TBoolean>;
  install: Type.TOptional<Type.TUnion<[Type.TObject<{
    source: Type.TLiteral<"clawhub">;
    packageName: Type.TString;
  }>, Type.TObject<{
    source: Type.TLiteral<"official">;
    pluginId: Type.TString;
  }>]>>;
  error: Type.TOptional<Type.TString>; /** Coarse manifest-derived grouping (channel, provider, memory, ...) for catalog UIs. */
  category: Type.TOptional<Type.TString>; /** True when the plugin has an install record and can be removed via plugins.uninstall. */
  removable: Type.TOptional<Type.TBoolean>;
}>;
/** Empty request payload for the cold plugin catalog. */
declare const PluginsListParamsSchema: Type.TObject<{}>;
/** Installed and curated plugin catalog visible to the current gateway client. */
declare const PluginsListResultSchema: Type.TObject<{
  plugins: Type.TArray<Type.TObject<{
    id: Type.TString;
    name: Type.TString;
    packageName: Type.TOptional<Type.TString>;
    description: Type.TOptional<Type.TString>;
    version: Type.TOptional<Type.TString>;
    kind: Type.TOptional<Type.TArray<Type.TString>>;
    origin: Type.TOptional<Type.TString>;
    installed: Type.TBoolean;
    enabled: Type.TBoolean;
    state: Type.TUnion<[Type.TLiteral<"enabled">, Type.TLiteral<"disabled">, Type.TLiteral<"not-installed">, Type.TLiteral<"error">]>;
    featured: Type.TOptional<Type.TBoolean>;
    featuredAt: Type.TOptional<Type.TInteger>;
    order: Type.TOptional<Type.TNumber>; /** True when the gateway can resolve a manifest or catalog icon for this plugin identity. */
    hasIcon: Type.TOptional<Type.TBoolean>;
    install: Type.TOptional<Type.TUnion<[Type.TObject<{
      source: Type.TLiteral<"clawhub">;
      packageName: Type.TString;
    }>, Type.TObject<{
      source: Type.TLiteral<"official">;
      pluginId: Type.TString;
    }>]>>;
    error: Type.TOptional<Type.TString>; /** Coarse manifest-derived grouping (channel, provider, memory, ...) for catalog UIs. */
    category: Type.TOptional<Type.TString>; /** True when the plugin has an install record and can be removed via plugins.uninstall. */
    removable: Type.TOptional<Type.TBoolean>;
  }>>;
  diagnostics: Type.TArray<Type.TUnknown>;
  mutationAllowed: Type.TBoolean;
}>;
/** Request payload for searching installable ClawHub plugin families. */
declare const PluginsSearchParamsSchema: Type.TObject<{
  query: Type.TString;
  limit: Type.TOptional<Type.TInteger>;
}>;
/** ClawHub package fields exposed by plugin search. */
declare const PluginSearchPackageSchema: Type.TObject<{
  name: Type.TString;
  displayName: Type.TString;
  family: Type.TUnion<[Type.TLiteral<"code-plugin">, Type.TLiteral<"bundle-plugin">]>;
  channel: Type.TUnion<[Type.TLiteral<"official">, Type.TLiteral<"community">, Type.TLiteral<"private">]>;
  isOfficial: Type.TBoolean;
  summary: Type.TOptional<Type.TString>;
  latestVersion: Type.TOptional<Type.TString>;
  runtimeId: Type.TOptional<Type.TString>;
  downloads: Type.TOptional<Type.TNumber>;
  verificationTier: Type.TOptional<Type.TString>;
}>;
/** Ranked ClawHub plugin search hit. */
declare const PluginSearchResultEntrySchema: Type.TObject<{
  score: Type.TNumber;
  package: Type.TObject<{
    name: Type.TString;
    displayName: Type.TString;
    family: Type.TUnion<[Type.TLiteral<"code-plugin">, Type.TLiteral<"bundle-plugin">]>;
    channel: Type.TUnion<[Type.TLiteral<"official">, Type.TLiteral<"community">, Type.TLiteral<"private">]>;
    isOfficial: Type.TBoolean;
    summary: Type.TOptional<Type.TString>;
    latestVersion: Type.TOptional<Type.TString>;
    runtimeId: Type.TOptional<Type.TString>;
    downloads: Type.TOptional<Type.TNumber>;
    verificationTier: Type.TOptional<Type.TString>;
  }>;
}>;
/** Ranked installable plugin packages matching the query. */
declare const PluginsSearchResultSchema: Type.TObject<{
  results: Type.TArray<Type.TObject<{
    score: Type.TNumber;
    package: Type.TObject<{
      name: Type.TString;
      displayName: Type.TString;
      family: Type.TUnion<[Type.TLiteral<"code-plugin">, Type.TLiteral<"bundle-plugin">]>;
      channel: Type.TUnion<[Type.TLiteral<"official">, Type.TLiteral<"community">, Type.TLiteral<"private">]>;
      isOfficial: Type.TBoolean;
      summary: Type.TOptional<Type.TString>;
      latestVersion: Type.TOptional<Type.TString>;
      runtimeId: Type.TOptional<Type.TString>;
      downloads: Type.TOptional<Type.TNumber>;
      verificationTier: Type.TOptional<Type.TString>;
    }>;
  }>>;
}>;
/** Trusted official-catalog or acknowledged ClawHub install request. */
declare const PluginsInstallParamsSchema: Type.TUnion<[Type.TObject<{
  source: Type.TLiteral<"clawhub">;
  packageName: Type.TString;
  version: Type.TOptional<Type.TString>;
  acknowledgeClawHubRisk: Type.TOptional<Type.TBoolean>;
}>, Type.TObject<{
  source: Type.TLiteral<"official">;
  pluginId: Type.TString;
}>]>;
/** Successful plugin installation result. */
declare const PluginsInstallResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  plugin: Type.TObject<{
    id: Type.TString;
    name: Type.TString;
    packageName: Type.TOptional<Type.TString>;
    description: Type.TOptional<Type.TString>;
    version: Type.TOptional<Type.TString>;
    kind: Type.TOptional<Type.TArray<Type.TString>>;
    origin: Type.TOptional<Type.TString>;
    installed: Type.TBoolean;
    enabled: Type.TBoolean;
    state: Type.TUnion<[Type.TLiteral<"enabled">, Type.TLiteral<"disabled">, Type.TLiteral<"not-installed">, Type.TLiteral<"error">]>;
    featured: Type.TOptional<Type.TBoolean>;
    featuredAt: Type.TOptional<Type.TInteger>;
    order: Type.TOptional<Type.TNumber>; /** True when the gateway can resolve a manifest or catalog icon for this plugin identity. */
    hasIcon: Type.TOptional<Type.TBoolean>;
    install: Type.TOptional<Type.TUnion<[Type.TObject<{
      source: Type.TLiteral<"clawhub">;
      packageName: Type.TString;
    }>, Type.TObject<{
      source: Type.TLiteral<"official">;
      pluginId: Type.TString;
    }>]>>;
    error: Type.TOptional<Type.TString>; /** Coarse manifest-derived grouping (channel, provider, memory, ...) for catalog UIs. */
    category: Type.TOptional<Type.TString>; /** True when the plugin has an install record and can be removed via plugins.uninstall. */
    removable: Type.TOptional<Type.TBoolean>;
  }>;
  restartRequired: Type.TLiteral<true>;
  warnings: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Internal signal that persisted plugin metadata changed outside the Gateway process. */
declare const PluginsRefreshParamsSchema: Type.TObject<{}>;
/** Successful plugin metadata refresh admission. */
declare const PluginsRefreshResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
}>;
/** Request payload for removing one installed plugin and its managed files. */
declare const PluginsUninstallParamsSchema: Type.TObject<{
  pluginId: Type.TString;
}>;
/** Successful plugin removal result listing the cleanup actions that ran. */
declare const PluginsUninstallResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  pluginId: Type.TString;
  restartRequired: Type.TLiteral<true>;
  removed: Type.TArray<Type.TString>;
  warnings: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Request payload for changing one installed plugin's policy state. */
declare const PluginsSetEnabledParamsSchema: Type.TObject<{
  pluginId: Type.TString;
  enabled: Type.TBoolean;
}>;
/** Successful plugin enablement policy update. */
declare const PluginsSetEnabledResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  plugin: Type.TObject<{
    id: Type.TString;
    name: Type.TString;
    packageName: Type.TOptional<Type.TString>;
    description: Type.TOptional<Type.TString>;
    version: Type.TOptional<Type.TString>;
    kind: Type.TOptional<Type.TArray<Type.TString>>;
    origin: Type.TOptional<Type.TString>;
    installed: Type.TBoolean;
    enabled: Type.TBoolean;
    state: Type.TUnion<[Type.TLiteral<"enabled">, Type.TLiteral<"disabled">, Type.TLiteral<"not-installed">, Type.TLiteral<"error">]>;
    featured: Type.TOptional<Type.TBoolean>;
    featuredAt: Type.TOptional<Type.TInteger>;
    order: Type.TOptional<Type.TNumber>; /** True when the gateway can resolve a manifest or catalog icon for this plugin identity. */
    hasIcon: Type.TOptional<Type.TBoolean>;
    install: Type.TOptional<Type.TUnion<[Type.TObject<{
      source: Type.TLiteral<"clawhub">;
      packageName: Type.TString;
    }>, Type.TObject<{
      source: Type.TLiteral<"official">;
      pluginId: Type.TString;
    }>]>>;
    error: Type.TOptional<Type.TString>; /** Coarse manifest-derived grouping (channel, provider, memory, ...) for catalog UIs. */
    category: Type.TOptional<Type.TString>; /** True when the plugin has an install record and can be removed via plugins.uninstall. */
    removable: Type.TOptional<Type.TBoolean>;
  }>;
  restartRequired: Type.TBoolean;
  warnings: Type.TOptional<Type.TArray<Type.TString>>;
}>;
type PluginCatalogEntry = Static<typeof PluginCatalogEntrySchema>;
type PluginsListParams = Static<typeof PluginsListParamsSchema>;
type PluginsListResult = Static<typeof PluginsListResultSchema>;
type PluginsSearchParams = Static<typeof PluginsSearchParamsSchema>;
type PluginsSearchResult = Static<typeof PluginsSearchResultSchema>;
type PluginsInstallParams = Static<typeof PluginsInstallParamsSchema>;
type PluginsInstallResult = Static<typeof PluginsInstallResultSchema>;
type PluginsRefreshParams = Static<typeof PluginsRefreshParamsSchema>;
type PluginsRefreshResult = Static<typeof PluginsRefreshResultSchema>;
type PluginsUninstallParams = Static<typeof PluginsUninstallParamsSchema>;
type PluginsUninstallResult = Static<typeof PluginsUninstallResultSchema>;
type PluginsSetEnabledParams = Static<typeof PluginsSetEnabledParamsSchema>;
type PluginsSetEnabledResult = Static<typeof PluginsSetEnabledResultSchema>;
type PluginsSessionActionParams = Static<typeof PluginsSessionActionParamsSchema>;
type PluginsSessionActionResult = Static<typeof PluginsSessionActionResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/wizard.d.ts
/** Starts a setup wizard, optionally scoped to a local or remote workspace. */
declare const WizardStartParamsSchema: Type.TObject<{
  mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"local">, Type.TLiteral<"remote">]>>;
  workspace: Type.TOptional<Type.TString>;
  flow: Type.TOptional<Type.TUnion<[Type.TLiteral<"setup">, Type.TLiteral<"channels">]>>;
  channel: Type.TOptional<Type.TString>;
}>;
/** Advances a wizard session, with an answer when the previous step requested input. */
declare const WizardNextParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  answer: Type.TOptional<Type.TObject<{
    stepId: Type.TString;
    value: Type.TOptional<Type.TUnknown>;
  }>>;
}>;
/** Cancels an active wizard session. */
declare const WizardCancelParamsSchema: Type.TObject<{
  sessionId: Type.TString;
}>;
/** Reads status for an active or recently completed wizard session. */
declare const WizardStatusParamsSchema: Type.TObject<{
  sessionId: Type.TString;
}>;
/** UI contract for one wizard step rendered by gateway clients. */
declare const WizardStepSchema: Type.TObject<{
  id: Type.TString;
  type: Type.TUnion<[Type.TLiteral<"note">, Type.TLiteral<"select">, Type.TLiteral<"text">, Type.TLiteral<"confirm">, Type.TLiteral<"multiselect">, Type.TLiteral<"progress">, Type.TLiteral<"action">]>;
  title: Type.TOptional<Type.TString>;
  message: Type.TOptional<Type.TString>;
  format: Type.TOptional<Type.TUnion<[Type.TLiteral<"plain">]>>;
  options: Type.TOptional<Type.TArray<Type.TObject<{
    value: Type.TUnknown;
    label: Type.TString;
    hint: Type.TOptional<Type.TString>;
  }>>>;
  initialValue: Type.TOptional<Type.TUnknown>;
  placeholder: Type.TOptional<Type.TString>;
  sensitive: Type.TOptional<Type.TBoolean>;
  executor: Type.TOptional<Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"client">]>>;
  externalUrl: Type.TOptional<Type.TString>;
  deviceCode: Type.TOptional<Type.TObject<{
    code: Type.TString;
    expiresInMinutes: Type.TOptional<Type.TInteger>;
    message: Type.TOptional<Type.TString>;
  }>>;
}>;
/** Result after advancing a wizard session. */
declare const WizardNextResultSchema: Type.TObject<{
  done: Type.TBoolean;
  step: Type.TOptional<Type.TObject<{
    id: Type.TString;
    type: Type.TUnion<[Type.TLiteral<"note">, Type.TLiteral<"select">, Type.TLiteral<"text">, Type.TLiteral<"confirm">, Type.TLiteral<"multiselect">, Type.TLiteral<"progress">, Type.TLiteral<"action">]>;
    title: Type.TOptional<Type.TString>;
    message: Type.TOptional<Type.TString>;
    format: Type.TOptional<Type.TUnion<[Type.TLiteral<"plain">]>>;
    options: Type.TOptional<Type.TArray<Type.TObject<{
      value: Type.TUnknown;
      label: Type.TString;
      hint: Type.TOptional<Type.TString>;
    }>>>;
    initialValue: Type.TOptional<Type.TUnknown>;
    placeholder: Type.TOptional<Type.TString>;
    sensitive: Type.TOptional<Type.TBoolean>;
    executor: Type.TOptional<Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"client">]>>;
    externalUrl: Type.TOptional<Type.TString>;
    deviceCode: Type.TOptional<Type.TObject<{
      code: Type.TString;
      expiresInMinutes: Type.TOptional<Type.TInteger>;
      message: Type.TOptional<Type.TString>;
    }>>;
  }>>;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"cancelled">, Type.TLiteral<"error">]>>;
  error: Type.TOptional<Type.TString>;
  channels: Type.TOptional<Type.TArray<Type.TString>>;
  accounts: Type.TOptional<Type.TArray<Type.TObject<{
    channel: Type.TString;
    accountId: Type.TString;
  }>>>;
}>;
/** Result returned when a wizard session is created. */
declare const WizardStartResultSchema: Type.TObject<{
  done: Type.TBoolean;
  step: Type.TOptional<Type.TObject<{
    id: Type.TString;
    type: Type.TUnion<[Type.TLiteral<"note">, Type.TLiteral<"select">, Type.TLiteral<"text">, Type.TLiteral<"confirm">, Type.TLiteral<"multiselect">, Type.TLiteral<"progress">, Type.TLiteral<"action">]>;
    title: Type.TOptional<Type.TString>;
    message: Type.TOptional<Type.TString>;
    format: Type.TOptional<Type.TUnion<[Type.TLiteral<"plain">]>>;
    options: Type.TOptional<Type.TArray<Type.TObject<{
      value: Type.TUnknown;
      label: Type.TString;
      hint: Type.TOptional<Type.TString>;
    }>>>;
    initialValue: Type.TOptional<Type.TUnknown>;
    placeholder: Type.TOptional<Type.TString>;
    sensitive: Type.TOptional<Type.TBoolean>;
    executor: Type.TOptional<Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"client">]>>;
    externalUrl: Type.TOptional<Type.TString>;
    deviceCode: Type.TOptional<Type.TObject<{
      code: Type.TString;
      expiresInMinutes: Type.TOptional<Type.TInteger>;
      message: Type.TOptional<Type.TString>;
    }>>;
  }>>;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"cancelled">, Type.TLiteral<"error">]>>;
  error: Type.TOptional<Type.TString>;
  channels: Type.TOptional<Type.TArray<Type.TString>>;
  accounts: Type.TOptional<Type.TArray<Type.TObject<{
    channel: Type.TString;
    accountId: Type.TString;
  }>>>;
  sessionId: Type.TString;
}>;
/** Minimal status poll result used when the client does not need the next step. */
declare const WizardStatusResultSchema: Type.TObject<{
  status: Type.TUnion<[Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"cancelled">, Type.TLiteral<"error">]>;
  error: Type.TOptional<Type.TString>;
}>;
type WizardStartParams = Static<typeof WizardStartParamsSchema>;
type WizardNextParams = Static<typeof WizardNextParamsSchema>;
type WizardCancelParams = Static<typeof WizardCancelParamsSchema>;
type WizardStatusParams = Static<typeof WizardStatusParamsSchema>;
type WizardStep = Static<typeof WizardStepSchema>;
type WizardNextResult = Static<typeof WizardNextResultSchema>;
type WizardStartResult = Static<typeof WizardStartResultSchema>;
type WizardStatusResult = Static<typeof WizardStatusResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-protocol-primitives.d.ts
declare const WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH = 256;
declare const WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH = 128;
declare const WORKER_PROTOCOL_MAX_PAYLOAD_BYTES: number;
declare const WorkerIdentifierSchema: Type.TString;
declare const WorkerFrameIdSchema: Type.TString;
declare const WorkerAdmissionFailureReasonSchema: Type.TUnion<[Type.TLiteral<"invalid-credential">, Type.TLiteral<"credential-expired">, Type.TLiteral<"environment-mismatch">, Type.TLiteral<"environment-unavailable">, Type.TLiteral<"bundle-mismatch">, Type.TLiteral<"version-mismatch">, Type.TLiteral<"session-mismatch">, Type.TLiteral<"placement-mismatch">, Type.TLiteral<"owner-epoch-mismatch">, Type.TLiteral<"rpc-set-mismatch">, Type.TLiteral<"protocol-features-mismatch">]>;
declare const WorkerProtocolCloseReasonSchema: Type.TUnion<[Type.TUnion<[Type.TLiteral<"invalid-credential">, Type.TLiteral<"credential-expired">, Type.TLiteral<"environment-mismatch">, Type.TLiteral<"environment-unavailable">, Type.TLiteral<"bundle-mismatch">, Type.TLiteral<"version-mismatch">, Type.TLiteral<"session-mismatch">, Type.TLiteral<"placement-mismatch">, Type.TLiteral<"owner-epoch-mismatch">, Type.TLiteral<"rpc-set-mismatch">, Type.TLiteral<"protocol-features-mismatch">]>, Type.TLiteral<"invalid-handshake">, Type.TLiteral<"protocol-mismatch">, Type.TLiteral<"gateway-unavailable">, Type.TLiteral<"invalid-frame">, Type.TLiteral<"slow-consumer">, Type.TLiteral<"method-not-allowed">, Type.TLiteral<"invalid-heartbeat">, Type.TLiteral<"credential-replaced">, Type.TLiteral<"gateway-shutdown">]>;
declare const WorkerErrorShapeSchema: Type.TObject<{
  code: Type.TUnion<[Type.TLiteral<"INVALID_REQUEST">, Type.TLiteral<"UNAVAILABLE">]>;
  message: Type.TString;
  details: Type.TObject<{
    reason: Type.TUnion<[Type.TUnion<[Type.TLiteral<"invalid-credential">, Type.TLiteral<"credential-expired">, Type.TLiteral<"environment-mismatch">, Type.TLiteral<"environment-unavailable">, Type.TLiteral<"bundle-mismatch">, Type.TLiteral<"version-mismatch">, Type.TLiteral<"session-mismatch">, Type.TLiteral<"placement-mismatch">, Type.TLiteral<"owner-epoch-mismatch">, Type.TLiteral<"rpc-set-mismatch">, Type.TLiteral<"protocol-features-mismatch">]>, Type.TLiteral<"invalid-handshake">, Type.TLiteral<"protocol-mismatch">, Type.TLiteral<"gateway-unavailable">, Type.TLiteral<"invalid-frame">, Type.TLiteral<"slow-consumer">, Type.TLiteral<"method-not-allowed">, Type.TLiteral<"invalid-heartbeat">, Type.TLiteral<"credential-replaced">, Type.TLiteral<"gateway-shutdown">]>;
  }>;
  retryable: Type.TOptional<Type.TBoolean>;
  retryAfterMs: Type.TOptional<Type.TInteger>;
}>;
declare const LiveIntegerSchema: Type.TInteger;
declare const LiveSequenceSchema: Type.TInteger;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-admission.d.ts
declare const WORKER_RPC_SET_VERSION = 1;
declare const WORKER_HEARTBEAT_INTERVAL_MS = 15000;
declare const WORKER_PROTOCOL_METHODS: readonly ["worker.heartbeat", "worker.transcript.commit", "worker.live-event"];
declare const WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE = "worker-transcript-commit-v1";
declare const WORKER_LIVE_EVENT_PROTOCOL_FEATURE = "worker-live-event-v1";
declare const WORKER_PROTOCOL_FEATURES: readonly ["worker-heartbeat-v1", "worker-transcript-commit-v1", "worker-live-event-v1", "worker-inference-v1"];
declare const WORKER_PROTOCOL_MAX_METHOD_LENGTH = 64;
declare const WORKER_PROTOCOL_MAX_FEATURES = 64;
declare const WORKER_PROTOCOL_MAX_FEATURE_LENGTH = 128;
declare const WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES = 64;
declare const WORKER_TRANSCRIPT_MAX_CONTENT_PARTS = 128;
declare const WORKER_TRANSCRIPT_MAX_JSON_DEPTH = 32;
/** Build identity presented by a worker before the gateway admits it. */
declare const WorkerAdmissionHandshakeSchema: Type.TObject<{
  bundleHash: Type.TString;
  openclawVersion: Type.TString;
  protocolFeatures: Type.TArray<Type.TString>;
}>;
/** Dedicated first-frame payload accepted only on the worker ingress. */
declare const WorkerConnectParamsSchema: Type.TObject<{
  minProtocol: Type.TInteger;
  maxProtocol: Type.TInteger;
  client: Type.TObject<{
    id: Type.TLiteral<"openclaw-worker">;
    version: Type.TString;
    platform: Type.TString;
    mode: Type.TLiteral<"worker">;
  }>;
  role: Type.TLiteral<"worker">;
  admission: Type.TUnion<[Type.TObject<{
    sessionId: Type.TNull;
    runId: Type.TNull;
    environmentId: Type.TString;
    credential: Type.TString;
    ownerEpoch: Type.TInteger;
    rpcSetVersion: Type.TInteger;
    handshake: Type.TObject<{
      bundleHash: Type.TString;
      openclawVersion: Type.TString;
      protocolFeatures: Type.TArray<Type.TString>;
    }>;
  }>, Type.TObject<{
    sessionId: Type.TString;
    runId: Type.TString;
    environmentId: Type.TString;
    credential: Type.TString;
    ownerEpoch: Type.TInteger;
    rpcSetVersion: Type.TInteger;
    handshake: Type.TObject<{
      bundleHash: Type.TString;
      openclawVersion: Type.TString;
      protocolFeatures: Type.TArray<Type.TString>;
    }>;
  }>]>;
}>;
declare const WorkerConnectRequestFrameSchema: Type.TObject<{
  type: Type.TLiteral<"req">;
  id: Type.TString;
  method: Type.TLiteral<"connect">;
  params: Type.TObject<{
    minProtocol: Type.TInteger;
    maxProtocol: Type.TInteger;
    client: Type.TObject<{
      id: Type.TLiteral<"openclaw-worker">;
      version: Type.TString;
      platform: Type.TString;
      mode: Type.TLiteral<"worker">;
    }>;
    role: Type.TLiteral<"worker">;
    admission: Type.TUnion<[Type.TObject<{
      sessionId: Type.TNull;
      runId: Type.TNull;
      environmentId: Type.TString;
      credential: Type.TString;
      ownerEpoch: Type.TInteger;
      rpcSetVersion: Type.TInteger;
      handshake: Type.TObject<{
        bundleHash: Type.TString;
        openclawVersion: Type.TString;
        protocolFeatures: Type.TArray<Type.TString>;
      }>;
    }>, Type.TObject<{
      sessionId: Type.TString;
      runId: Type.TString;
      environmentId: Type.TString;
      credential: Type.TString;
      ownerEpoch: Type.TInteger;
      rpcSetVersion: Type.TInteger;
      handshake: Type.TObject<{
        bundleHash: Type.TString;
        openclawVersion: Type.TString;
        protocolFeatures: Type.TArray<Type.TString>;
      }>;
    }>]>;
  }>;
}>;
/** Minimal admission response; workers never receive the general gateway snapshot. */
declare const WorkerHelloOkSchema: Type.TObject<{
  type: Type.TLiteral<"worker-hello-ok">;
  environmentId: Type.TString;
  sessionId: Type.TUnion<[Type.TString, Type.TNull]>;
  ownerEpoch: Type.TInteger;
  rpcSetVersion: Type.TInteger;
  protocolFeatures: Type.TArray<Type.TString>;
  credentialExpiresAtMs: Type.TInteger;
  policy: Type.TObject<{
    heartbeatIntervalMs: Type.TInteger;
    maxPayload: Type.TInteger;
  }>;
}>;
declare const WorkerAdmissionResponseFrameSchema: Type.TUnion<[Type.TObject<{
  type: Type.TLiteral<"res">;
  id: Type.TString;
  ok: Type.TLiteral<true>;
  payload: Type.TObject<{
    type: Type.TLiteral<"worker-hello-ok">;
    environmentId: Type.TString;
    sessionId: Type.TUnion<[Type.TString, Type.TNull]>;
    ownerEpoch: Type.TInteger;
    rpcSetVersion: Type.TInteger;
    protocolFeatures: Type.TArray<Type.TString>;
    credentialExpiresAtMs: Type.TInteger;
    policy: Type.TObject<{
      heartbeatIntervalMs: Type.TInteger;
      maxPayload: Type.TInteger;
    }>;
  }>;
}>, Type.TObject<{
  type: Type.TLiteral<"res">;
  id: Type.TString;
  ok: Type.TLiteral<false>;
  error: Type.TObject<{
    code: Type.TUnion<[Type.TLiteral<"INVALID_REQUEST">, Type.TLiteral<"UNAVAILABLE">]>;
    message: Type.TString;
    details: Type.TObject<{
      reason: Type.TUnion<[Type.TUnion<[Type.TLiteral<"invalid-credential">, Type.TLiteral<"credential-expired">, Type.TLiteral<"environment-mismatch">, Type.TLiteral<"environment-unavailable">, Type.TLiteral<"bundle-mismatch">, Type.TLiteral<"version-mismatch">, Type.TLiteral<"session-mismatch">, Type.TLiteral<"placement-mismatch">, Type.TLiteral<"owner-epoch-mismatch">, Type.TLiteral<"rpc-set-mismatch">, Type.TLiteral<"protocol-features-mismatch">]>, Type.TLiteral<"invalid-handshake">, Type.TLiteral<"protocol-mismatch">, Type.TLiteral<"gateway-unavailable">, Type.TLiteral<"invalid-frame">, Type.TLiteral<"slow-consumer">, Type.TLiteral<"method-not-allowed">, Type.TLiteral<"invalid-heartbeat">, Type.TLiteral<"credential-replaced">, Type.TLiteral<"gateway-shutdown">]>;
    }>;
    retryable: Type.TOptional<Type.TBoolean>;
    retryAfterMs: Type.TOptional<Type.TInteger>;
  }>;
}>]>;
declare const WorkerHeartbeatParamsSchema: Type.TObject<{
  sentAtMs: Type.TInteger;
  status: Type.TUnion<[Type.TLiteral<"ready">, Type.TLiteral<"busy">, Type.TLiteral<"draining">]>;
}>;
declare const WorkerHeartbeatResultSchema: Type.TObject<{
  receivedAtMs: Type.TInteger;
  status: Type.TLiteral<"ok">;
  ownerEpoch: Type.TInteger;
}>;
declare const WorkerHeartbeatRequestFrameSchema: Type.TObject<{
  type: Type.TLiteral<"req">;
  id: Type.TString;
  method: Type.TLiteral<"worker.heartbeat">;
  params: Type.TObject<{
    sentAtMs: Type.TInteger;
    status: Type.TUnion<[Type.TLiteral<"ready">, Type.TLiteral<"busy">, Type.TLiteral<"draining">]>;
  }>;
}>;
declare const WorkerHeartbeatResponseFrameSchema: Type.TUnion<[Type.TObject<{
  type: Type.TLiteral<"res">;
  id: Type.TString;
  ok: Type.TLiteral<true>;
  payload: Type.TObject<{
    receivedAtMs: Type.TInteger;
    status: Type.TLiteral<"ok">;
    ownerEpoch: Type.TInteger;
  }>;
}>, Type.TObject<{
  type: Type.TLiteral<"res">;
  id: Type.TString;
  ok: Type.TLiteral<false>;
  error: Type.TObject<{
    code: Type.TUnion<[Type.TLiteral<"INVALID_REQUEST">, Type.TLiteral<"UNAVAILABLE">]>;
    message: Type.TString;
    details: Type.TObject<{
      reason: Type.TUnion<[Type.TUnion<[Type.TLiteral<"invalid-credential">, Type.TLiteral<"credential-expired">, Type.TLiteral<"environment-mismatch">, Type.TLiteral<"environment-unavailable">, Type.TLiteral<"bundle-mismatch">, Type.TLiteral<"version-mismatch">, Type.TLiteral<"session-mismatch">, Type.TLiteral<"placement-mismatch">, Type.TLiteral<"owner-epoch-mismatch">, Type.TLiteral<"rpc-set-mismatch">, Type.TLiteral<"protocol-features-mismatch">]>, Type.TLiteral<"invalid-handshake">, Type.TLiteral<"protocol-mismatch">, Type.TLiteral<"gateway-unavailable">, Type.TLiteral<"invalid-frame">, Type.TLiteral<"slow-consumer">, Type.TLiteral<"method-not-allowed">, Type.TLiteral<"invalid-heartbeat">, Type.TLiteral<"credential-replaced">, Type.TLiteral<"gateway-shutdown">]>;
    }>;
    retryable: Type.TOptional<Type.TBoolean>;
    retryAfterMs: Type.TOptional<Type.TInteger>;
  }>;
}>]>;
declare const WorkerTranscriptMessageSchema: Type.TUnion<[Type.TObject<{
  role: Type.TLiteral<"user">;
  content: Type.TArray<Type.TUnion<[Type.TObject<{
    type: Type.TLiteral<"text">;
    text: Type.TString;
    textSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    type: Type.TLiteral<"image">;
    data: Type.TString;
    mimeType: Type.TString;
  }>]>>;
  timestamp: Type.TInteger;
}>, Type.TObject<{
  role: Type.TLiteral<"assistant">;
  content: Type.TArray<Type.TUnion<[Type.TObject<{
    type: Type.TLiteral<"text">;
    text: Type.TString;
    textSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    type: Type.TLiteral<"thinking">;
    thinking: Type.TString;
    thinkingSignature: Type.TOptional<Type.TString>;
    redacted: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    type: Type.TLiteral<"toolCall">;
    id: Type.TString;
    name: Type.TString;
    arguments: Type.TRecord<"^.*$", Type.TUnknown>;
    thoughtSignature: Type.TOptional<Type.TString>;
    executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
  }>]>>;
  api: Type.TString;
  provider: Type.TString;
  model: Type.TString;
  responseModel: Type.TOptional<Type.TString>;
  responseId: Type.TOptional<Type.TString>;
  diagnostics: Type.TOptional<Type.TArray<Type.TObject<{
    type: Type.TString;
    timestamp: Type.TInteger;
    error: Type.TOptional<Type.TObject<{
      name: Type.TOptional<Type.TString>;
      message: Type.TString;
      stack: Type.TOptional<Type.TString>;
      code: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    }>>;
    details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  }>>>;
  usage: Type.TObject<{
    input: Type.TNumber;
    output: Type.TNumber;
    cacheRead: Type.TNumber;
    cacheWrite: Type.TNumber;
    contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
      state: Type.TLiteral<"available">;
      promptTokens: Type.TNumber;
      totalTokens: Type.TNumber;
    }>, Type.TObject<{
      state: Type.TLiteral<"unavailable">;
    }>]>>;
    totalTokens: Type.TNumber;
    cost: Type.TObject<{
      input: Type.TNumber;
      output: Type.TNumber;
      cacheRead: Type.TNumber;
      cacheWrite: Type.TNumber;
      total: Type.TNumber;
      totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
    }>;
  }>;
  stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">, Type.TLiteral<"error">, Type.TLiteral<"aborted">]>;
  errorMessage: Type.TOptional<Type.TString>;
  errorCode: Type.TOptional<Type.TString>;
  errorType: Type.TOptional<Type.TString>;
  errorBody: Type.TOptional<Type.TString>;
  timestamp: Type.TInteger;
}>, Type.TObject<{
  role: Type.TLiteral<"toolResult">;
  toolCallId: Type.TString;
  toolName: Type.TString;
  content: Type.TArray<Type.TUnion<[Type.TObject<{
    type: Type.TLiteral<"text">;
    text: Type.TString;
    textSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    type: Type.TLiteral<"image">;
    data: Type.TString;
    mimeType: Type.TString;
  }>]>>;
  details: Type.TOptional<Type.TUnknown>;
  isError: Type.TBoolean;
  timestamp: Type.TInteger;
}>]>;
declare const WorkerTranscriptCommitParamsSchema: Type.TObject<{
  runEpoch: Type.TInteger;
  seq: Type.TInteger;
  baseLeafId: Type.TUnion<[Type.TString, Type.TNull]>;
  messages: Type.TArray<Type.TUnion<[Type.TObject<{
    role: Type.TLiteral<"user">;
    content: Type.TArray<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"text">;
      text: Type.TString;
      textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"image">;
      data: Type.TString;
      mimeType: Type.TString;
    }>]>>;
    timestamp: Type.TInteger;
  }>, Type.TObject<{
    role: Type.TLiteral<"assistant">;
    content: Type.TArray<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"text">;
      text: Type.TString;
      textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"thinking">;
      thinking: Type.TString;
      thinkingSignature: Type.TOptional<Type.TString>;
      redacted: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      type: Type.TLiteral<"toolCall">;
      id: Type.TString;
      name: Type.TString;
      arguments: Type.TRecord<"^.*$", Type.TUnknown>;
      thoughtSignature: Type.TOptional<Type.TString>;
      executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
    }>]>>;
    api: Type.TString;
    provider: Type.TString;
    model: Type.TString;
    responseModel: Type.TOptional<Type.TString>;
    responseId: Type.TOptional<Type.TString>;
    diagnostics: Type.TOptional<Type.TArray<Type.TObject<{
      type: Type.TString;
      timestamp: Type.TInteger;
      error: Type.TOptional<Type.TObject<{
        name: Type.TOptional<Type.TString>;
        message: Type.TString;
        stack: Type.TOptional<Type.TString>;
        code: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
      }>>;
      details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    }>>>;
    usage: Type.TObject<{
      input: Type.TNumber;
      output: Type.TNumber;
      cacheRead: Type.TNumber;
      cacheWrite: Type.TNumber;
      contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
        state: Type.TLiteral<"available">;
        promptTokens: Type.TNumber;
        totalTokens: Type.TNumber;
      }>, Type.TObject<{
        state: Type.TLiteral<"unavailable">;
      }>]>>;
      totalTokens: Type.TNumber;
      cost: Type.TObject<{
        input: Type.TNumber;
        output: Type.TNumber;
        cacheRead: Type.TNumber;
        cacheWrite: Type.TNumber;
        total: Type.TNumber;
        totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
      }>;
    }>;
    stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">, Type.TLiteral<"error">, Type.TLiteral<"aborted">]>;
    errorMessage: Type.TOptional<Type.TString>;
    errorCode: Type.TOptional<Type.TString>;
    errorType: Type.TOptional<Type.TString>;
    errorBody: Type.TOptional<Type.TString>;
    timestamp: Type.TInteger;
  }>, Type.TObject<{
    role: Type.TLiteral<"toolResult">;
    toolCallId: Type.TString;
    toolName: Type.TString;
    content: Type.TArray<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"text">;
      text: Type.TString;
      textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"image">;
      data: Type.TString;
      mimeType: Type.TString;
    }>]>>;
    details: Type.TOptional<Type.TUnknown>;
    isError: Type.TBoolean;
    timestamp: Type.TInteger;
  }>]>>;
}>;
declare const WorkerTranscriptCommitResultSchema: Type.TObject<{
  entryIds: Type.TArray<Type.TString>;
  newLeafId: Type.TString;
}>;
declare const WorkerTranscriptCommitErrorReasonSchema: Type.TUnion<[Type.TLiteral<"stale-base-leaf">, Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"invalid-batch">, Type.TLiteral<"session-not-attached">]>;
declare const WorkerTranscriptCommitErrorShapeSchema: Type.TObject<{
  code: Type.TLiteral<"INVALID_REQUEST">;
  message: Type.TString;
  details: Type.TObject<{
    reason: Type.TUnion<[Type.TLiteral<"stale-base-leaf">, Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"invalid-batch">, Type.TLiteral<"session-not-attached">]>;
  }>;
}>;
declare const WorkerTranscriptCommitRequestFrameSchema: Type.TObject<{
  type: Type.TLiteral<"req">;
  id: Type.TString;
  method: Type.TLiteral<"worker.transcript.commit">;
  params: Type.TObject<{
    runEpoch: Type.TInteger;
    seq: Type.TInteger;
    baseLeafId: Type.TUnion<[Type.TString, Type.TNull]>;
    messages: Type.TArray<Type.TUnion<[Type.TObject<{
      role: Type.TLiteral<"user">;
      content: Type.TArray<Type.TUnion<[Type.TObject<{
        type: Type.TLiteral<"text">;
        text: Type.TString;
        textSignature: Type.TOptional<Type.TString>;
      }>, Type.TObject<{
        type: Type.TLiteral<"image">;
        data: Type.TString;
        mimeType: Type.TString;
      }>]>>;
      timestamp: Type.TInteger;
    }>, Type.TObject<{
      role: Type.TLiteral<"assistant">;
      content: Type.TArray<Type.TUnion<[Type.TObject<{
        type: Type.TLiteral<"text">;
        text: Type.TString;
        textSignature: Type.TOptional<Type.TString>;
      }>, Type.TObject<{
        type: Type.TLiteral<"thinking">;
        thinking: Type.TString;
        thinkingSignature: Type.TOptional<Type.TString>;
        redacted: Type.TOptional<Type.TBoolean>;
      }>, Type.TObject<{
        type: Type.TLiteral<"toolCall">;
        id: Type.TString;
        name: Type.TString;
        arguments: Type.TRecord<"^.*$", Type.TUnknown>;
        thoughtSignature: Type.TOptional<Type.TString>;
        executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
      }>]>>;
      api: Type.TString;
      provider: Type.TString;
      model: Type.TString;
      responseModel: Type.TOptional<Type.TString>;
      responseId: Type.TOptional<Type.TString>;
      diagnostics: Type.TOptional<Type.TArray<Type.TObject<{
        type: Type.TString;
        timestamp: Type.TInteger;
        error: Type.TOptional<Type.TObject<{
          name: Type.TOptional<Type.TString>;
          message: Type.TString;
          stack: Type.TOptional<Type.TString>;
          code: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
        }>>;
        details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
      }>>>;
      usage: Type.TObject<{
        input: Type.TNumber;
        output: Type.TNumber;
        cacheRead: Type.TNumber;
        cacheWrite: Type.TNumber;
        contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
          state: Type.TLiteral<"available">;
          promptTokens: Type.TNumber;
          totalTokens: Type.TNumber;
        }>, Type.TObject<{
          state: Type.TLiteral<"unavailable">;
        }>]>>;
        totalTokens: Type.TNumber;
        cost: Type.TObject<{
          input: Type.TNumber;
          output: Type.TNumber;
          cacheRead: Type.TNumber;
          cacheWrite: Type.TNumber;
          total: Type.TNumber;
          totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
        }>;
      }>;
      stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">, Type.TLiteral<"error">, Type.TLiteral<"aborted">]>;
      errorMessage: Type.TOptional<Type.TString>;
      errorCode: Type.TOptional<Type.TString>;
      errorType: Type.TOptional<Type.TString>;
      errorBody: Type.TOptional<Type.TString>;
      timestamp: Type.TInteger;
    }>, Type.TObject<{
      role: Type.TLiteral<"toolResult">;
      toolCallId: Type.TString;
      toolName: Type.TString;
      content: Type.TArray<Type.TUnion<[Type.TObject<{
        type: Type.TLiteral<"text">;
        text: Type.TString;
        textSignature: Type.TOptional<Type.TString>;
      }>, Type.TObject<{
        type: Type.TLiteral<"image">;
        data: Type.TString;
        mimeType: Type.TString;
      }>]>>;
      details: Type.TOptional<Type.TUnknown>;
      isError: Type.TBoolean;
      timestamp: Type.TInteger;
    }>]>>;
  }>;
}>;
declare const WorkerTranscriptCommitResponseFrameSchema: Type.TUnion<[Type.TObject<{
  type: Type.TLiteral<"res">;
  id: Type.TString;
  ok: Type.TLiteral<true>;
  payload: Type.TObject<{
    entryIds: Type.TArray<Type.TString>;
    newLeafId: Type.TString;
  }>;
}>, Type.TObject<{
  type: Type.TLiteral<"res">;
  id: Type.TString;
  ok: Type.TLiteral<false>;
  error: Type.TObject<{
    code: Type.TLiteral<"INVALID_REQUEST">;
    message: Type.TString;
    details: Type.TObject<{
      reason: Type.TUnion<[Type.TLiteral<"stale-base-leaf">, Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"invalid-batch">, Type.TLiteral<"session-not-attached">]>;
    }>;
  }>;
}>, Type.TObject<{
  type: Type.TLiteral<"res">;
  id: Type.TString;
  ok: Type.TLiteral<false>;
  error: Type.TObject<{
    code: Type.TUnion<[Type.TLiteral<"INVALID_REQUEST">, Type.TLiteral<"UNAVAILABLE">]>;
    message: Type.TString;
    details: Type.TObject<{
      reason: Type.TUnion<[Type.TUnion<[Type.TLiteral<"invalid-credential">, Type.TLiteral<"credential-expired">, Type.TLiteral<"environment-mismatch">, Type.TLiteral<"environment-unavailable">, Type.TLiteral<"bundle-mismatch">, Type.TLiteral<"version-mismatch">, Type.TLiteral<"session-mismatch">, Type.TLiteral<"placement-mismatch">, Type.TLiteral<"owner-epoch-mismatch">, Type.TLiteral<"rpc-set-mismatch">, Type.TLiteral<"protocol-features-mismatch">]>, Type.TLiteral<"invalid-handshake">, Type.TLiteral<"protocol-mismatch">, Type.TLiteral<"gateway-unavailable">, Type.TLiteral<"invalid-frame">, Type.TLiteral<"slow-consumer">, Type.TLiteral<"method-not-allowed">, Type.TLiteral<"invalid-heartbeat">, Type.TLiteral<"credential-replaced">, Type.TLiteral<"gateway-shutdown">]>;
    }>;
    retryable: Type.TOptional<Type.TBoolean>;
    retryAfterMs: Type.TOptional<Type.TInteger>;
  }>;
}>]>;
declare const WorkerLiveEventSchema: Type.TUnion<[Type.TObject<{
  readonly kind: Type.TLiteral<"assistant">;
  readonly payload: Type.TObject<{
    readonly text: Type.TString;
    readonly delta: Type.TString;
    readonly replace: Type.TOptional<Type.TLiteral<true>>;
    readonly mediaUrls: Type.TOptional<Type.TArray<Type.TString>>;
    readonly phase: Type.TOptional<Type.TUnion<[Type.TLiteral<"commentary">, Type.TLiteral<"final_answer">]>>;
    readonly itemId: Type.TOptional<Type.TString>;
  }>;
}>, Type.TObject<{
  readonly kind: Type.TLiteral<"thinking">;
  readonly payload: Type.TObject<{
    readonly text: Type.TString;
    readonly delta: Type.TString;
  }>;
}>, Type.TObject<{
  readonly kind: Type.TLiteral<"tool">;
  readonly payload: Type.TUnion<[Type.TObject<{
    readonly phase: Type.TLiteral<"start">;
    readonly args: Type.TUnknown;
    readonly name: Type.TString;
    readonly toolCallId: Type.TString;
    readonly hideFromChannelProgress: Type.TOptional<Type.TLiteral<true>>;
  }>, Type.TObject<{
    readonly phase: Type.TLiteral<"update">;
    readonly partialResult: Type.TUnknown;
    readonly name: Type.TString;
    readonly toolCallId: Type.TString;
    readonly hideFromChannelProgress: Type.TOptional<Type.TLiteral<true>>;
  }>, Type.TObject<{
    readonly phase: Type.TLiteral<"result">;
    readonly meta: Type.TOptional<Type.TString>;
    readonly isError: Type.TBoolean;
    readonly result: Type.TUnknown;
    readonly toolErrorSummary: Type.TOptional<Type.TString>;
    readonly name: Type.TString;
    readonly toolCallId: Type.TString;
    readonly hideFromChannelProgress: Type.TOptional<Type.TLiteral<true>>;
  }>]>;
}>, Type.TObject<{
  readonly kind: Type.TLiteral<"approval">;
  readonly payload: Type.TUnion<[Type.TObject<{
    readonly phase: Type.TLiteral<"requested">;
    readonly status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"unavailable">]>;
    readonly kind: Type.TUnion<[Type.TLiteral<"exec">, Type.TLiteral<"plugin">, Type.TLiteral<"unknown">]>;
    readonly title: Type.TString;
    readonly itemId: Type.TOptional<Type.TString>;
    readonly toolCallId: Type.TOptional<Type.TString>;
    readonly approvalId: Type.TOptional<Type.TString>;
    readonly approvalSlug: Type.TOptional<Type.TString>;
    readonly command: Type.TOptional<Type.TString>;
    readonly host: Type.TOptional<Type.TString>;
    readonly reason: Type.TOptional<Type.TString>;
    readonly scope: Type.TOptional<Type.TUnion<[Type.TLiteral<"turn">, Type.TLiteral<"session">]>>;
    readonly message: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    readonly phase: Type.TLiteral<"resolved">;
    readonly status: Type.TUnion<[Type.TLiteral<"approved">, Type.TLiteral<"denied">, Type.TLiteral<"failed">]>;
    readonly kind: Type.TUnion<[Type.TLiteral<"exec">, Type.TLiteral<"plugin">, Type.TLiteral<"unknown">]>;
    readonly title: Type.TString;
    readonly itemId: Type.TOptional<Type.TString>;
    readonly toolCallId: Type.TOptional<Type.TString>;
    readonly approvalId: Type.TOptional<Type.TString>;
    readonly approvalSlug: Type.TOptional<Type.TString>;
    readonly command: Type.TOptional<Type.TString>;
    readonly host: Type.TOptional<Type.TString>;
    readonly reason: Type.TOptional<Type.TString>;
    readonly scope: Type.TOptional<Type.TUnion<[Type.TLiteral<"turn">, Type.TLiteral<"session">]>>;
    readonly message: Type.TOptional<Type.TString>;
  }>]>;
}>, Type.TObject<{
  readonly kind: Type.TLiteral<"lifecycle">;
  readonly payload: Type.TUnion<[Type.TObject<{
    readonly phase: Type.TLiteral<"start">;
    readonly startedAt: Type.TInteger;
  }>, Type.TObject<{
    readonly phase: Type.TLiteral<"fallback">;
    readonly reasonSummary: Type.TString;
    readonly attemptSummaries: Type.TArray<Type.TString>;
    readonly attempts: Type.TArray<Type.TObject<{
      readonly provider: Type.TString;
      readonly model: Type.TString;
      readonly error: Type.TString;
      readonly reason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"context_overflow">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
      readonly authMode: Type.TOptional<Type.TString>;
      readonly status: Type.TOptional<Type.TInteger>;
      readonly code: Type.TOptional<Type.TString>;
    }>>;
    readonly selectedProvider: Type.TString;
    readonly selectedModel: Type.TString;
    readonly activeProvider: Type.TString;
    readonly activeModel: Type.TString;
  }>, Type.TObject<{
    readonly phase: Type.TLiteral<"fallback_cleared">;
    readonly previousActiveModel: Type.TOptional<Type.TString>;
    readonly selectedProvider: Type.TString;
    readonly selectedModel: Type.TString;
    readonly activeProvider: Type.TString;
    readonly activeModel: Type.TString;
  }>, Type.TObject<{
    readonly phase: Type.TLiteral<"fallback_step">;
    readonly fallbackStepType: Type.TLiteral<"fallback_step">;
    readonly fallbackStepFromModel: Type.TString;
    readonly fallbackStepToModel: Type.TOptional<Type.TString>;
    readonly fallbackStepFromFailureReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"context_overflow">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
    readonly fallbackStepFromFailureDetail: Type.TOptional<Type.TString>;
    readonly fallbackStepChainPosition: Type.TOptional<Type.TInteger>;
    readonly fallbackStepFinalOutcome: Type.TUnion<[Type.TLiteral<"next_fallback">, Type.TLiteral<"succeeded">, Type.TLiteral<"chain_exhausted">]>;
  }>, Type.TUnion<[Type.TObject<{
    readonly phase: Type.TLiteral<"finishing">;
    readonly error: Type.TOptional<Type.TString>;
    readonly startedAt: Type.TOptional<Type.TInteger>;
    readonly endedAt: Type.TInteger;
    readonly stopReason: Type.TOptional<Type.TString>;
    readonly yielded: Type.TOptional<Type.TLiteral<true>>;
    readonly timeoutPhase: Type.TOptional<Type.TUnion<[Type.TLiteral<"queue">, Type.TLiteral<"preflight">, Type.TLiteral<"provider">, Type.TLiteral<"post_turn">, Type.TLiteral<"gateway_draining">]>>;
    readonly providerStarted: Type.TOptional<Type.TBoolean>;
    readonly aborted: Type.TOptional<Type.TBoolean>;
    readonly toolErrorSummary: Type.TOptional<Type.TString>;
    readonly livenessState: Type.TOptional<Type.TUnion<[Type.TLiteral<"working">, Type.TLiteral<"paused">, Type.TLiteral<"blocked">, Type.TLiteral<"abandoned">]>>;
    readonly replayInvalid: Type.TOptional<Type.TLiteral<true>>;
  }>, Type.TObject<{
    readonly phase: Type.TLiteral<"end">;
    readonly startedAt: Type.TOptional<Type.TInteger>;
    readonly endedAt: Type.TInteger;
    readonly stopReason: Type.TOptional<Type.TString>;
    readonly yielded: Type.TOptional<Type.TLiteral<true>>;
    readonly timeoutPhase: Type.TOptional<Type.TUnion<[Type.TLiteral<"queue">, Type.TLiteral<"preflight">, Type.TLiteral<"provider">, Type.TLiteral<"post_turn">, Type.TLiteral<"gateway_draining">]>>;
    readonly providerStarted: Type.TOptional<Type.TBoolean>;
    readonly aborted: Type.TOptional<Type.TBoolean>;
    readonly toolErrorSummary: Type.TOptional<Type.TString>;
    readonly livenessState: Type.TOptional<Type.TUnion<[Type.TLiteral<"working">, Type.TLiteral<"paused">, Type.TLiteral<"blocked">, Type.TLiteral<"abandoned">]>>;
    readonly replayInvalid: Type.TOptional<Type.TLiteral<true>>;
  }>, Type.TObject<{
    readonly phase: Type.TLiteral<"error">;
    readonly error: Type.TString;
    readonly fallbackExhaustedFailure: Type.TOptional<Type.TLiteral<true>>;
    readonly startedAt: Type.TOptional<Type.TInteger>;
    readonly endedAt: Type.TInteger;
    readonly stopReason: Type.TOptional<Type.TString>;
    readonly yielded: Type.TOptional<Type.TLiteral<true>>;
    readonly timeoutPhase: Type.TOptional<Type.TUnion<[Type.TLiteral<"queue">, Type.TLiteral<"preflight">, Type.TLiteral<"provider">, Type.TLiteral<"post_turn">, Type.TLiteral<"gateway_draining">]>>;
    readonly providerStarted: Type.TOptional<Type.TBoolean>;
    readonly aborted: Type.TOptional<Type.TBoolean>;
    readonly toolErrorSummary: Type.TOptional<Type.TString>;
    readonly livenessState: Type.TOptional<Type.TUnion<[Type.TLiteral<"working">, Type.TLiteral<"paused">, Type.TLiteral<"blocked">, Type.TLiteral<"abandoned">]>>;
    readonly replayInvalid: Type.TOptional<Type.TLiteral<true>>;
  }>]>]>;
}>]>;
declare const WorkerLiveEventParamsSchema: Type.TObject<{
  readonly runEpoch: typeof LiveIntegerSchema;
  readonly lastAckedSeq: typeof LiveIntegerSchema;
  readonly seq: typeof LiveSequenceSchema;
  readonly runId: typeof WorkerIdentifierSchema;
  readonly event: typeof WorkerLiveEventSchema;
}>;
declare const WorkerLiveEventResultSchema: Type.TObject<{
  readonly ackedSeq: Type.TInteger;
}>;
declare const WorkerLiveEventErrorDetailsSchema: Type.TUnion<[Type.TObject<{
  readonly reason: Type.TUnion<[Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"session-not-attached">, Type.TLiteral<"invalid-event">, Type.TLiteral<"capacity-exceeded">]>;
}>, Type.TObject<{
  readonly reason: Type.TLiteral<"resync-required">;
  readonly ackedSeq: Type.TInteger;
  readonly expectedSeq: Type.TInteger;
}>]>;
declare const WorkerLiveEventErrorShapeSchema: Type.TObject<{
  readonly code: Type.TLiteral<"INVALID_REQUEST">;
  readonly message: Type.TString;
  readonly details: Type.TUnion<[Type.TObject<{
    readonly reason: Type.TUnion<[Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"session-not-attached">, Type.TLiteral<"invalid-event">, Type.TLiteral<"capacity-exceeded">]>;
  }>, Type.TObject<{
    readonly reason: Type.TLiteral<"resync-required">;
    readonly ackedSeq: Type.TInteger;
    readonly expectedSeq: Type.TInteger;
  }>]>;
}>;
declare const WorkerLiveEventRequestFrameSchema: Type.TObject<{
  readonly type: Type.TLiteral<"req">;
  readonly id: typeof WorkerFrameIdSchema;
  readonly method: Type.TLiteral<(typeof WORKER_PROTOCOL_METHODS)[2]>;
  readonly params: typeof WorkerLiveEventParamsSchema;
}>;
declare const WorkerLiveEventResponseFrameSchema: Type.TUnion<[Type.TObject<{
  readonly type: Type.TLiteral<"res">;
  readonly id: Type.TString;
  readonly ok: Type.TLiteral<true>;
  readonly payload: Type.TObject<{
    readonly ackedSeq: Type.TInteger;
  }>;
}>, Type.TObject<{
  readonly type: Type.TLiteral<"res">;
  readonly id: Type.TString;
  readonly ok: Type.TLiteral<false>;
  readonly error: Type.TObject<{
    readonly code: Type.TLiteral<"INVALID_REQUEST">;
    readonly message: Type.TString;
    readonly details: Type.TUnion<[Type.TObject<{
      readonly reason: Type.TUnion<[Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"session-not-attached">, Type.TLiteral<"invalid-event">, Type.TLiteral<"capacity-exceeded">]>;
    }>, Type.TObject<{
      readonly reason: Type.TLiteral<"resync-required">;
      readonly ackedSeq: Type.TInteger;
      readonly expectedSeq: Type.TInteger;
    }>]>;
  }>;
}>, Type.TObject<{
  type: Type.TLiteral<"res">;
  id: Type.TString;
  ok: Type.TLiteral<false>;
  error: Type.TObject<{
    code: Type.TUnion<[Type.TLiteral<"INVALID_REQUEST">, Type.TLiteral<"UNAVAILABLE">]>;
    message: Type.TString;
    details: Type.TObject<{
      reason: Type.TUnion<[Type.TUnion<[Type.TLiteral<"invalid-credential">, Type.TLiteral<"credential-expired">, Type.TLiteral<"environment-mismatch">, Type.TLiteral<"environment-unavailable">, Type.TLiteral<"bundle-mismatch">, Type.TLiteral<"version-mismatch">, Type.TLiteral<"session-mismatch">, Type.TLiteral<"placement-mismatch">, Type.TLiteral<"owner-epoch-mismatch">, Type.TLiteral<"rpc-set-mismatch">, Type.TLiteral<"protocol-features-mismatch">]>, Type.TLiteral<"invalid-handshake">, Type.TLiteral<"protocol-mismatch">, Type.TLiteral<"gateway-unavailable">, Type.TLiteral<"invalid-frame">, Type.TLiteral<"slow-consumer">, Type.TLiteral<"method-not-allowed">, Type.TLiteral<"invalid-heartbeat">, Type.TLiteral<"credential-replaced">, Type.TLiteral<"gateway-shutdown">]>;
    }>;
    retryable: Type.TOptional<Type.TBoolean>;
    retryAfterMs: Type.TOptional<Type.TInteger>;
  }>;
}>]>;
type WorkerAdmissionHandshake = Static<typeof WorkerAdmissionHandshakeSchema>;
type WorkerConnectParams = Static<typeof WorkerConnectParamsSchema>;
type WorkerConnectRequestFrame = Static<typeof WorkerConnectRequestFrameSchema>;
type WorkerAdmissionFailureReason = Static<typeof WorkerAdmissionFailureReasonSchema>;
type WorkerProtocolCloseReason = Static<typeof WorkerProtocolCloseReasonSchema>;
type WorkerErrorShape = Static<typeof WorkerErrorShapeSchema>;
type WorkerHelloOk = Static<typeof WorkerHelloOkSchema>;
type WorkerAdmissionResponseFrame = Static<typeof WorkerAdmissionResponseFrameSchema>;
type WorkerHeartbeatParams = Static<typeof WorkerHeartbeatParamsSchema>;
type WorkerHeartbeatResult = Static<typeof WorkerHeartbeatResultSchema>;
type WorkerHeartbeatRequestFrame = Static<typeof WorkerHeartbeatRequestFrameSchema>;
type WorkerHeartbeatResponseFrame = Static<typeof WorkerHeartbeatResponseFrameSchema>;
type WorkerTranscriptMessage = Static<typeof WorkerTranscriptMessageSchema>;
type WorkerTranscriptCommitParams = Static<typeof WorkerTranscriptCommitParamsSchema>;
type WorkerTranscriptCommitResult = Static<typeof WorkerTranscriptCommitResultSchema>;
type WorkerTranscriptCommitErrorReason = Static<typeof WorkerTranscriptCommitErrorReasonSchema>;
type WorkerTranscriptCommitErrorShape = Static<typeof WorkerTranscriptCommitErrorShapeSchema>;
type WorkerTranscriptCommitRequestFrame = Static<typeof WorkerTranscriptCommitRequestFrameSchema>;
type WorkerTranscriptCommitResponseFrame = Static<typeof WorkerTranscriptCommitResponseFrameSchema>;
type WorkerLiveEvent = Static<typeof WorkerLiveEventSchema>;
type WorkerLiveEventParams = Static<typeof WorkerLiveEventParamsSchema>;
type WorkerLiveEventResult = Static<typeof WorkerLiveEventResultSchema>;
type WorkerLiveEventErrorDetails = Static<typeof WorkerLiveEventErrorDetailsSchema>;
type WorkerLiveEventErrorShape = Static<typeof WorkerLiveEventErrorShapeSchema>;
type WorkerLiveEventRequestFrame = Static<typeof WorkerLiveEventRequestFrameSchema>;
type WorkerLiveEventResponseFrame = Static<typeof WorkerLiveEventResponseFrameSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/worktrees.d.ts
declare const WorktreeRecordSchema: Type.TObject<{
  id: Type.TString;
  name: Type.TString;
  repoFingerprint: Type.TString;
  repoRoot: Type.TString;
  path: Type.TString;
  branch: Type.TString;
  baseRef: Type.TString;
  ownerKind: Type.TString;
  ownerId: Type.TOptional<Type.TString>;
  snapshotRef: Type.TOptional<Type.TString>;
  createdAt: Type.TInteger;
  lastActiveAt: Type.TInteger;
  removedAt: Type.TOptional<Type.TInteger>;
}>;
declare const WorktreesListParamsSchema: Type.TObject<{}>;
declare const WorktreesListResultSchema: Type.TObject<{
  worktrees: Type.TArray<Type.TObject<{
    id: Type.TString;
    name: Type.TString;
    repoFingerprint: Type.TString;
    repoRoot: Type.TString;
    path: Type.TString;
    branch: Type.TString;
    baseRef: Type.TString;
    ownerKind: Type.TString;
    ownerId: Type.TOptional<Type.TString>;
    snapshotRef: Type.TOptional<Type.TString>;
    createdAt: Type.TInteger;
    lastActiveAt: Type.TInteger;
    removedAt: Type.TOptional<Type.TInteger>;
  }>>;
}>;
declare const WorktreesCreateParamsSchema: Type.TObject<{
  repoRoot: Type.TString;
  name: Type.TOptional<Type.TString>;
  baseRef: Type.TOptional<Type.TString>;
}>;
declare const WorktreesRemoveParamsSchema: Type.TObject<{
  id: Type.TString;
  force: Type.TOptional<Type.TBoolean>;
}>;
declare const WorktreesRemoveResultSchema: Type.TObject<{
  removed: Type.TBoolean;
  snapshotRef: Type.TOptional<Type.TString>; /** Why the pre-removal snapshot failed; present only on forced removals that continued without one. */
  snapshotError: Type.TOptional<Type.TString>;
}>;
declare const WorktreesBranchesParamsSchema: Type.TObject<{
  repoRoot: Type.TString;
}>;
declare const WorktreeBranchSchema: Type.TObject<{
  name: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"local">, Type.TLiteral<"remote">]>;
}>;
declare const WorktreesBranchesResultSchema: Type.TObject<{
  branches: Type.TArray<Type.TObject<{
    name: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"local">, Type.TLiteral<"remote">]>;
  }>>;
  defaultBranch: Type.TOptional<Type.TString>;
  headBranch: Type.TOptional<Type.TString>;
}>;
declare const WorktreesRestoreParamsSchema: Type.TObject<{
  id: Type.TString;
}>;
declare const WorktreesGcParamsSchema: Type.TObject<{}>;
declare const WorktreesGcResultSchema: Type.TObject<{
  removed: Type.TArray<Type.TString>;
  orphansDeleted: Type.TInteger;
  snapshotsPruned: Type.TInteger;
}>;
type WorktreeRecord = Static<typeof WorktreeRecordSchema>;
type WorktreesListParams = Static<typeof WorktreesListParamsSchema>;
type WorktreesListResult = Static<typeof WorktreesListResultSchema>;
type WorktreesCreateParams = Static<typeof WorktreesCreateParamsSchema>;
type WorktreesRemoveParams = Static<typeof WorktreesRemoveParamsSchema>;
type WorktreesRemoveResult = Static<typeof WorktreesRemoveResultSchema>;
type WorktreesRestoreParams = Static<typeof WorktreesRestoreParamsSchema>;
type WorktreesGcParams = Static<typeof WorktreesGcParamsSchema>;
type WorktreesGcResult = Static<typeof WorktreesGcResultSchema>;
type WorktreeBranch = Static<typeof WorktreeBranchSchema>;
type WorktreesBranchesParams = Static<typeof WorktreesBranchesParamsSchema>;
type WorktreesBranchesResult = Static<typeof WorktreesBranchesResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/index.d.ts
declare const validateCommandsListParams: ProtocolValidator<{
  agentId?: string | undefined;
  provider?: string | undefined;
  scope?: "text" | "native" | "both" | undefined;
  includeArgs?: boolean | undefined;
}>;
declare const validateConnectParams: ProtocolValidator<{
  caps?: string[] | undefined;
  commands?: string[] | undefined;
  permissions?: Record<string, boolean> | undefined;
  pathEnv?: string | undefined;
  role?: string | undefined;
  scopes?: string[] | undefined;
  device?: {
    id: string;
    publicKey: string;
    signature: string;
    signedAt: number;
    nonce: string;
  } | undefined;
  auth?: {
    token?: string | undefined;
    bootstrapToken?: string | undefined;
    deviceToken?: string | undefined;
    password?: string | undefined;
    approvalRuntimeToken?: string | undefined;
    agentRuntimeIdentityToken?: string | undefined;
  } | undefined;
  locale?: string | undefined;
  userAgent?: string | undefined;
  minProtocol: number;
  maxProtocol: number;
  client: {
    displayName?: string | undefined;
    deviceFamily?: string | undefined;
    modelIdentifier?: string | undefined;
    instanceId?: string | undefined;
    id: "webchat-ui" | "openclaw-control-ui" | "openclaw-browser-copilot" | "openclaw-tui" | "webchat" | "cli" | "gateway-client" | "openclaw-macos" | "openclaw-linux" | "openclaw-ios" | "openclaw-watchos" | "openclaw-android" | "node-host" | "openclaw-worker" | "test" | "fingerprint" | "openclaw-probe";
    version: string;
    platform: string;
    mode: "webchat" | "cli" | "test" | "ui" | "backend" | "node" | "worker" | "probe";
  };
}>;
declare const validateWorkerAdmissionHandshake: ProtocolValidator<{
  bundleHash: string;
  openclawVersion: string;
  protocolFeatures: string[];
}>;
declare const validateWorkerConnectRequestFrame: ProtocolValidator<{
  type: "req";
  id: string;
  method: "connect";
  params: {
    minProtocol: number;
    maxProtocol: number;
    client: {
      id: "openclaw-worker";
      version: string;
      platform: string;
      mode: "worker";
    };
    role: "worker";
    admission: {
      sessionId: null;
      runId: null;
      environmentId: string;
      credential: string;
      ownerEpoch: number;
      rpcSetVersion: number;
      handshake: {
        bundleHash: string;
        openclawVersion: string;
        protocolFeatures: string[];
      };
    } | {
      sessionId: string;
      runId: string;
      environmentId: string;
      credential: string;
      ownerEpoch: number;
      rpcSetVersion: number;
      handshake: {
        bundleHash: string;
        openclawVersion: string;
        protocolFeatures: string[];
      };
    };
  };
}>;
declare const validateWorkerHeartbeatParams: ProtocolValidator<{
  sentAtMs: number;
  status: "ready" | "busy" | "draining";
}>;
declare const validateWorkerTranscriptCommitParams: ProtocolValidator<{
  runEpoch: number;
  seq: number;
  baseLeafId: string | null;
  messages: ({
    role: "user";
    content: ({
      textSignature?: string | undefined;
      type: "text";
      text: string;
    } | {
      type: "image";
      data: string;
      mimeType: string;
    })[];
    timestamp: number;
  } | {
    responseModel?: string | undefined;
    responseId?: string | undefined;
    diagnostics?: {
      error?: {
        name?: string | undefined;
        stack?: string | undefined;
        code?: string | number | undefined;
        message: string;
      } | undefined;
      details?: Record<string, unknown> | undefined;
      type: string;
      timestamp: number;
    }[] | undefined;
    errorMessage?: string | undefined;
    errorCode?: string | undefined;
    errorType?: string | undefined;
    errorBody?: string | undefined;
    provider: string;
    role: "assistant";
    content: ({
      textSignature?: string | undefined;
      type: "text";
      text: string;
    } | {
      thinkingSignature?: string | undefined;
      redacted?: boolean | undefined;
      type: "thinking";
      thinking: string;
    } | {
      thoughtSignature?: string | undefined;
      executionMode?: "sequential" | "parallel" | undefined;
      type: "toolCall";
      id: string;
      name: string;
      arguments: Record<string, unknown>;
    })[];
    timestamp: number;
    api: string;
    model: string;
    usage: {
      contextUsage?: {
        state: "available";
        promptTokens: number;
        totalTokens: number;
      } | {
        state: "unavailable";
      } | undefined;
      input: number;
      output: number;
      cacheRead: number;
      cacheWrite: number;
      totalTokens: number;
      cost: {
        totalOrigin?: "provider-billed" | undefined;
        input: number;
        output: number;
        cacheRead: number;
        cacheWrite: number;
        total: number;
      };
    };
    stopReason: "error" | "stop" | "length" | "toolUse" | "aborted";
  } | {
    details?: unknown;
    role: "toolResult";
    content: ({
      textSignature?: string | undefined;
      type: "text";
      text: string;
    } | {
      type: "image";
      data: string;
      mimeType: string;
    })[];
    timestamp: number;
    toolCallId: string;
    toolName: string;
    isError: boolean;
  })[];
}>;
declare const validateWorkerLiveEventParams: ProtocolValidator<{
  readonly runId: string;
  readonly runEpoch: number;
  readonly seq: number;
  readonly lastAckedSeq: number;
  readonly event: {
    readonly kind: "assistant";
    readonly payload: {
      readonly replace?: true | undefined;
      readonly mediaUrls?: string[] | undefined;
      readonly phase?: "commentary" | "final_answer" | undefined;
      readonly itemId?: string | undefined;
      readonly text: string;
      readonly delta: string;
    };
  } | {
    readonly kind: "thinking";
    readonly payload: {
      readonly text: string;
      readonly delta: string;
    };
  } | {
    readonly kind: "tool";
    readonly payload: {
      readonly hideFromChannelProgress?: true | undefined;
      readonly name: string;
      readonly toolCallId: string;
      readonly phase: "start";
      readonly args: unknown;
    } | {
      readonly hideFromChannelProgress?: true | undefined;
      readonly name: string;
      readonly toolCallId: string;
      readonly phase: "update";
      readonly partialResult: unknown;
    } | {
      readonly hideFromChannelProgress?: true | undefined;
      readonly meta?: string | undefined;
      readonly toolErrorSummary?: string | undefined;
      readonly name: string;
      readonly toolCallId: string;
      readonly isError: boolean;
      readonly phase: "result";
      readonly result: unknown;
    };
  } | {
    readonly kind: "approval";
    readonly payload: {
      readonly scope?: "turn" | "session" | undefined;
      readonly message?: string | undefined;
      readonly toolCallId?: string | undefined;
      readonly itemId?: string | undefined;
      readonly approvalId?: string | undefined;
      readonly approvalSlug?: string | undefined;
      readonly command?: string | undefined;
      readonly host?: string | undefined;
      readonly reason?: string | undefined;
      readonly status: "unavailable" | "pending";
      readonly kind: "exec" | "plugin" | "unknown";
      readonly phase: "requested";
      readonly title: string;
    } | {
      readonly scope?: "turn" | "session" | undefined;
      readonly message?: string | undefined;
      readonly toolCallId?: string | undefined;
      readonly itemId?: string | undefined;
      readonly approvalId?: string | undefined;
      readonly approvalSlug?: string | undefined;
      readonly command?: string | undefined;
      readonly host?: string | undefined;
      readonly reason?: string | undefined;
      readonly status: "approved" | "denied" | "failed";
      readonly kind: "exec" | "plugin" | "unknown";
      readonly phase: "resolved";
      readonly title: string;
    };
  } | {
    readonly kind: "lifecycle";
    readonly payload: {
      readonly phase: "start";
      readonly startedAt: number;
    } | {
      readonly phase: "fallback";
      readonly attemptSummaries: string[];
      readonly attempts: {
        readonly status?: number | undefined;
        readonly code?: string | undefined;
        readonly reason?: "auth" | "unknown" | "auth_permanent" | "format" | "rate_limit" | "overloaded" | "billing" | "server_error" | "timeout" | "context_overflow" | "model_not_found" | "session_expired" | "empty_response" | "no_error_details" | "unclassified" | undefined;
        readonly authMode?: string | undefined;
        readonly provider: string;
        readonly model: string;
        readonly error: string;
      }[];
      readonly reasonSummary: string;
      readonly selectedProvider: string;
      readonly selectedModel: string;
      readonly activeProvider: string;
      readonly activeModel: string;
    } | {
      readonly previousActiveModel?: string | undefined;
      readonly phase: "fallback_cleared";
      readonly selectedProvider: string;
      readonly selectedModel: string;
      readonly activeProvider: string;
      readonly activeModel: string;
    } | {
      readonly fallbackStepToModel?: string | undefined;
      readonly fallbackStepFromFailureReason?: "auth" | "unknown" | "auth_permanent" | "format" | "rate_limit" | "overloaded" | "billing" | "server_error" | "timeout" | "context_overflow" | "model_not_found" | "session_expired" | "empty_response" | "no_error_details" | "unclassified" | undefined;
      readonly fallbackStepFromFailureDetail?: string | undefined;
      readonly fallbackStepChainPosition?: number | undefined;
      readonly phase: "fallback_step";
      readonly fallbackStepType: "fallback_step";
      readonly fallbackStepFinalOutcome: "next_fallback" | "succeeded" | "chain_exhausted";
      readonly fallbackStepFromModel: string;
    } | {
      readonly error?: string | undefined;
      readonly stopReason?: string | undefined;
      readonly aborted?: boolean | undefined;
      readonly toolErrorSummary?: string | undefined;
      readonly startedAt?: number | undefined;
      readonly yielded?: true | undefined;
      readonly timeoutPhase?: "provider" | "queue" | "preflight" | "post_turn" | "gateway_draining" | undefined;
      readonly providerStarted?: boolean | undefined;
      readonly livenessState?: "working" | "paused" | "blocked" | "abandoned" | undefined;
      readonly replayInvalid?: true | undefined;
      readonly phase: "finishing";
      readonly endedAt: number;
    } | {
      readonly stopReason?: string | undefined;
      readonly aborted?: boolean | undefined;
      readonly toolErrorSummary?: string | undefined;
      readonly startedAt?: number | undefined;
      readonly yielded?: true | undefined;
      readonly timeoutPhase?: "provider" | "queue" | "preflight" | "post_turn" | "gateway_draining" | undefined;
      readonly providerStarted?: boolean | undefined;
      readonly livenessState?: "working" | "paused" | "blocked" | "abandoned" | undefined;
      readonly replayInvalid?: true | undefined;
      readonly phase: "end";
      readonly endedAt: number;
    } | {
      readonly stopReason?: string | undefined;
      readonly aborted?: boolean | undefined;
      readonly toolErrorSummary?: string | undefined;
      readonly startedAt?: number | undefined;
      readonly yielded?: true | undefined;
      readonly timeoutPhase?: "provider" | "queue" | "preflight" | "post_turn" | "gateway_draining" | undefined;
      readonly providerStarted?: boolean | undefined;
      readonly livenessState?: "working" | "paused" | "blocked" | "abandoned" | undefined;
      readonly replayInvalid?: true | undefined;
      readonly fallbackExhaustedFailure?: true | undefined;
      readonly error: string;
      readonly phase: "error";
      readonly endedAt: number;
    };
  };
}>;
declare const validateGatewaySuspendPrepareParams: ProtocolValidator<{
  requestId: string;
}>;
declare const validateGatewaySuspendStatusParams: ProtocolValidator<{
  suspensionId: string;
}>;
declare const validateGatewaySuspendResumeParams: ProtocolValidator<{
  suspensionId: string;
}>;
declare const validateRequestFrame: ProtocolValidator<{
  params?: unknown;
  type: "req";
  id: string;
  method: string;
}>;
declare const validateMessageActionParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionId?: string | undefined;
  accountId?: string | undefined;
  requesterAccountId?: string | undefined;
  requesterSenderId?: string | undefined;
  senderIsOwner?: boolean | undefined;
  sessionKey?: string | undefined;
  inboundTurnKind?: string | undefined;
  toolContext?: {
    currentChannelId?: string | undefined;
    currentMessagingTarget?: string | undefined;
    currentGraphChannelId?: string | undefined;
    currentChannelProvider?: string | undefined;
    currentThreadTs?: string | undefined;
    currentMessageId?: string | number | undefined;
    replyToMode?: "off" | "first" | "all" | "batched" | undefined;
    hasRepliedRef?: {
      value: boolean;
    } | undefined;
    sameChannelThreadRequired?: boolean | undefined;
    skipCrossContextDecoration?: boolean | undefined;
  } | undefined;
  conversationReadOrigin?: "direct-operator" | undefined;
  params: Record<string, unknown>;
  channel: string;
  action: string;
  idempotencyKey: string;
}>;
declare const validateSendParams: ProtocolValidator<{
  agentId?: string | undefined;
  message?: string | undefined;
  mediaUrls?: string[] | undefined;
  channel?: string | undefined;
  accountId?: string | undefined;
  sessionKey?: string | undefined;
  mediaUrl?: string | undefined;
  buffer?: string | undefined;
  filename?: string | undefined;
  contentType?: string | undefined;
  asVoice?: boolean | undefined;
  gifPlayback?: boolean | undefined;
  replyToId?: string | undefined;
  threadId?: string | undefined;
  forceDocument?: boolean | undefined;
  silent?: boolean | undefined;
  parseMode?: "HTML" | undefined;
  idempotencyKey: string;
  to: string;
}>;
declare const validateConversationListParams: ProtocolValidator<{
  channel?: string | undefined;
  query?: string | undefined;
  limit?: number | undefined;
  agentId: string;
}>;
declare const validateConversationSendParams: ProtocolValidator<{
  sourceSessionKey?: string | undefined;
  agentId: string;
  message: string;
  operationId: string;
  conversationRef: string;
}>;
declare const validateConversationTurnCancelParams: ProtocolValidator<{
  agentId: string;
  turnId: string;
}>;
declare const validateConversationTurnParams: ProtocolValidator<{
  sourceSessionKey?: string | undefined;
  agentId: string;
  message: string;
  conversationRef: string;
  turnId: string;
  timeoutMs: number;
}>;
declare const validatePollParams: ProtocolValidator<{
  channel?: string | undefined;
  accountId?: string | undefined;
  threadId?: string | undefined;
  silent?: boolean | undefined;
  maxSelections?: number | undefined;
  durationSeconds?: number | undefined;
  durationHours?: number | undefined;
  isAnonymous?: boolean | undefined;
  idempotencyKey: string;
  to: string;
  question: string;
  options: string[];
}>;
declare const validateAgentParams: ProtocolValidator<{
  agentId?: string | undefined;
  provider?: string | undefined;
  sessionId?: string | undefined;
  thinking?: string | undefined;
  model?: string | undefined;
  timeout?: number | undefined;
  channel?: string | undefined;
  accountId?: string | undefined;
  sessionKey?: string | undefined;
  to?: string | undefined;
  threadId?: string | undefined;
  replyTo?: string | undefined;
  expectedExistingSessionId?: string | undefined;
  deliver?: boolean | undefined;
  attachments?: unknown[] | undefined;
  replyChannel?: string | undefined;
  replyAccountId?: string | undefined;
  groupId?: string | undefined;
  groupChannel?: string | undefined;
  groupSpace?: string | undefined;
  bestEffortDeliver?: boolean | undefined;
  lane?: string | undefined;
  cwd?: string | undefined;
  cleanupBundleMcpOnRunEnd?: boolean | undefined;
  modelRun?: boolean | undefined;
  promptMode?: "full" | "minimal" | "none" | undefined;
  extraSystemPrompt?: string | undefined;
  bootstrapContextMode?: "full" | "lightweight" | undefined;
  bootstrapContextRunKind?: "default" | "heartbeat" | "cron" | undefined;
  acpTurnSource?: "manual_spawn" | undefined;
  internalRuntimeHandoffId?: string | undefined;
  execApprovalFollowupExpectedSessionId?: string | undefined;
  internalEvents?: {
    mediaUrls?: string[] | undefined;
    attachments?: {
      type?: string | undefined;
      mimeType?: string | undefined;
      name?: string | undefined;
      mediaUrl?: string | undefined;
      path?: string | undefined;
      url?: string | undefined;
      filePath?: string | undefined;
    }[] | undefined;
    childSessionId?: string | undefined;
    statsLine?: string | undefined;
    type: "task_completion";
    status: string;
    result: string;
    source: string;
    childSessionKey: string;
    announceType: string;
    taskLabel: string;
    statusLabel: string;
    replyInstruction: string;
  }[] | undefined;
  inputProvenance?: {
    sourceSessionKey?: string | undefined;
    originSessionId?: string | undefined;
    sourceChannel?: string | undefined;
    sourceTool?: string | undefined;
    kind: string;
  } | undefined;
  suppressPromptPersistence?: boolean | undefined;
  sessionEffects?: "visible" | "internal" | undefined;
  sourceReplyDeliveryMode?: "automatic" | "message_tool_only" | undefined;
  disableMessageTool?: boolean | undefined;
  swarmCollector?: boolean | undefined;
  swarmOutputSchema?: Record<string, unknown> | undefined;
  forceRestartSafeTools?: boolean | undefined;
  voiceWakeTrigger?: string | undefined;
  label?: string | undefined;
  message: string;
  idempotencyKey: string;
}>;
declare const validateAuditActivityListParams: ProtocolValidator<AuditActivityListParams>;
declare const validateAuditListParams: ProtocolValidator<{
  agentId?: string | undefined;
  runId?: string | undefined;
  status?: "unknown" | "failed" | "succeeded" | "blocked" | "started" | "cancelled" | "timed_out" | undefined;
  kind?: "agent_run" | "tool_action" | undefined;
  sessionKey?: string | undefined;
  limit?: number | undefined;
  after?: number | undefined;
  before?: number | undefined;
  cursor?: string | undefined;
}>;
declare const validateUsersListParams: ProtocolValidator<object>;
declare const validateUsersSelfParams: ProtocolValidator<object>;
declare const validateUsersSelfResult: ProtocolValidator<{
  profile: {
    id: string;
    displayName: string | null;
    avatarMime: "image/png" | "image/jpeg" | "image/webp" | null;
    mergedInto: string | null;
    createdAt: number;
    updatedAt: number;
    emails: string[];
    hasAvatar: boolean;
  };
}>;
declare const validateUsersLinkEmailParams: ProtocolValidator<{
  email: string;
  targetProfileId: string;
}>;
declare const validateUsersLinkEmailResult: ProtocolValidator<{
  profile: {
    id: string;
    displayName: string | null;
    avatarMime: "image/png" | "image/jpeg" | "image/webp" | null;
    mergedInto: string | null;
    createdAt: number;
    updatedAt: number;
    emails: string[];
    hasAvatar: boolean;
  };
}>;
declare const validateUsersSetDisplayNameParams: ProtocolValidator<{
  displayName: string | null;
  profileId: string;
}>;
declare const validateUsersSetDisplayNameResult: ProtocolValidator<{
  profile: {
    id: string;
    displayName: string | null;
    avatarMime: "image/png" | "image/jpeg" | "image/webp" | null;
    mergedInto: string | null;
    createdAt: number;
    updatedAt: number;
    emails: string[];
    hasAvatar: boolean;
  };
}>;
declare const validateUsersSetAvatarParams: ProtocolValidator<{
  profileId: string;
  mime: "image/png" | "image/jpeg" | "image/webp";
  avatarBase64: string;
}>;
declare const validateUsersSetAvatarResult: ProtocolValidator<{
  profile: {
    id: string;
    displayName: string | null;
    avatarMime: "image/png" | "image/jpeg" | "image/webp" | null;
    mergedInto: string | null;
    createdAt: number;
    updatedAt: number;
    emails: string[];
    hasAvatar: boolean;
  };
}>;
declare const validateAgentIdentityParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey?: string | undefined;
}>;
declare const validateAgentWaitParams: ProtocolValidator<{
  timeoutMs?: number | undefined;
  runId: string;
}>;
declare const validateWakeParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey?: string | undefined;
  text: string;
  mode: "now" | "next-heartbeat";
}>;
declare const validateAgentsListParams: ProtocolValidator<object>;
declare const validateWorktreesListParams: ProtocolValidator<object>;
declare const validateBoardGetParams: ProtocolValidator<{
  sessionKey: string;
}>;
declare const validateBoardUpdateParams: ProtocolValidator<{
  sessionKey: string;
  ops: ({
    chatDock?: "left" | "right" | "bottom" | "hidden" | undefined;
    kind: "tab_create";
    title: string;
    tabId: string;
  } | {
    title?: string | undefined;
    chatDock?: "left" | "right" | "bottom" | "hidden" | undefined;
    position?: number | undefined;
    kind: "tab_update";
    tabId: string;
  } | {
    kind: "tab_delete";
    tabId: string;
  } | {
    kind: "tabs_reorder";
    tabIds: string[];
  } | {
    after?: string | undefined;
    tabId?: string | undefined;
    position?: number | undefined;
    name: string;
    kind: "widget_move";
  } | {
    name: string;
    kind: "widget_resize";
    sizeW: number;
    sizeH: number;
  } | {
    name: string;
    kind: "widget_remove";
  })[];
}>;
declare const validateBoardWidgetContent: ProtocolValidator<{
  kind: "html";
  html: string;
} | {
  kind: "mcp-app";
  descriptor: {
    toolCallId: string;
    toolName: string;
    serverName: string;
    uiResourceUri: string;
  };
}>;
declare const validateBoardWidgetAppViewParams: ProtocolValidator<{
  instanceId: string;
  name: string;
  sessionKey: string;
  revision: number;
}>;
declare const validateBoardWidgetPutParams: ProtocolValidator<{
  title?: string | undefined;
  placement?: {
    after?: string | undefined;
    tabId?: string | undefined;
    size?: "full" | "sm" | "md" | "lg" | "xl" | undefined;
  } | undefined;
  declared?: {
    netOrigins?: string[] | undefined;
    tools?: string[] | undefined;
  } | undefined;
  content: {
    kind: "html";
    html: string;
  } | {
    kind: "mcp-app";
    viewId: string;
  } | {
    kind: "canvas-doc";
    docId: string;
  };
  name: string;
  sessionKey: string;
}>;
declare const validateBoardWidgetGrantParams: ProtocolValidator<{
  instanceId: string;
  name: string;
  sessionKey: string;
  revision: number;
  decision: "granted" | "rejected";
}>;
declare const validateBoardEventParams: ProtocolValidator<{
  payload: unknown;
  sessionKey: string;
  widget: string;
} | {
  payload: unknown;
  ticket: string;
}>;
declare const validateBoardPromptAuthorizeParams: ProtocolValidator<{
  ticket: string;
}>;
declare const validateBoardDataReadParams: ProtocolValidator<{
  params?: Record<string, unknown> | undefined;
  ticket: string;
  bindingId: string;
}>;
declare const validateBoardActionParams: ProtocolValidator<{
  action: "cron.trigger";
  ticket: string;
  jobId: string;
}>;
declare const validateWorktreesCreateParams: ProtocolValidator<{
  name?: string | undefined;
  baseRef?: string | undefined;
  repoRoot: string;
}>;
declare const validateWorktreesRemoveParams: ProtocolValidator<{
  force?: boolean | undefined;
  id: string;
}>;
declare const validateWorktreesRestoreParams: ProtocolValidator<{
  id: string;
}>;
declare const validateWorktreesGcParams: ProtocolValidator<object>;
declare const validateWorktreesBranchesParams: ProtocolValidator<{
  repoRoot: string;
}>;
declare const validateFsListDirParams: ProtocolValidator<{
  path?: string | undefined;
  nodeId?: string | undefined;
}>;
declare const validateFsListDirResult: ProtocolValidator<{
  parent?: string | undefined;
  path: string;
  home: string;
  entries: {
    hidden?: boolean | undefined;
    name: string;
    path: string;
  }[];
}>;
declare const validateAgentsCreateParams: ProtocolValidator<{
  model?: string | undefined;
  workspace?: string | undefined;
  emoji?: string | undefined;
  avatar?: string | undefined;
  name: string;
}>;
declare const validateAgentsUpdateParams: ProtocolValidator<{
  name?: string | undefined;
  model?: string | null | undefined;
  workspace?: string | undefined;
  emoji?: string | undefined;
  avatar?: string | undefined;
  agentId: string;
}>;
declare const validateAgentsDeleteParams: ProtocolValidator<{
  deleteFiles?: boolean | undefined;
  agentId: string;
}>;
declare const validateAgentsFilesListParams: ProtocolValidator<{
  agentId: string;
}>;
declare const validateAgentsFilesGetParams: ProtocolValidator<{
  agentId: string;
  name: string;
}>;
declare const validateAgentsFilesSetParams: ProtocolValidator<{
  agentId: string;
  content: string;
  name: string;
}>;
declare const validateAgentsWorkspaceListParams: ProtocolValidator<{
  limit?: number | undefined;
  path?: string | undefined;
  offset?: number | undefined;
  agentId: string;
}>;
declare const validateAgentsWorkspaceGetParams: ProtocolValidator<{
  agentId: string;
  path: string;
}>;
declare const validateArtifactsListParams: ProtocolValidator<{
  agentId?: string | undefined;
  runId?: string | undefined;
  sessionKey?: string | undefined;
  taskId?: string | undefined;
}>;
declare const validateArtifactsGetParams: ProtocolValidator<{
  agentId?: string | undefined;
  runId?: string | undefined;
  sessionKey?: string | undefined;
  taskId?: string | undefined;
  artifactId: string;
}>;
declare const validateArtifactsDownloadParams: ProtocolValidator<{
  agentId?: string | undefined;
  runId?: string | undefined;
  sessionKey?: string | undefined;
  taskId?: string | undefined;
  artifactId: string;
}>;
declare const validateNodePairListParams: ProtocolValidator<object>;
declare const validateNodePairApproveParams: ProtocolValidator<{
  requestId: string;
}>;
declare const validateNodePairRejectParams: ProtocolValidator<{
  requestId: string;
}>;
declare const validateNodePairRemoveParams: ProtocolValidator<{
  nodeId: string;
}>;
declare const validateNodeRenameParams: ProtocolValidator<{
  displayName: string;
  nodeId: string;
}>;
declare const validateNodeListParams: ProtocolValidator<object>;
declare const validateNodePluginToolsUpdateParams: ProtocolValidator<{
  tools: {
    command?: string | undefined;
    parameters?: Record<string, unknown> | undefined;
    mcp?: {
      tool: string;
      server: string;
    } | undefined;
    name: string;
    pluginId: string;
    description: string;
  }[];
}>;
declare const validateNodeSkillsUpdateParams: ProtocolValidator<{
  skills: {
    content: string;
    name: string;
    description: string;
  }[];
}>;
declare const validateEnvironmentsCreateParams: ProtocolValidator<{
  idempotencyKey: string;
  profileId: string;
}>;
declare const validateEnvironmentsDestroyParams: ProtocolValidator<{
  force?: boolean | undefined;
  environmentId: string;
}>;
declare const validateEnvironmentsListParams: ProtocolValidator<object>;
declare const validateEnvironmentsStatusParams: ProtocolValidator<{
  environmentId: string;
}>;
declare const validateSystemInfoParams: ProtocolValidator<object>;
declare const validateSystemInfoResult: ProtocolValidator<{
  lanAddress?: string | undefined;
  port?: number | undefined;
  processInstanceId?: string | undefined;
  cpuModel?: string | undefined;
  loadAverage?: [number, number, number] | undefined;
  diskTotalBytes?: number | undefined;
  diskAvailableBytes?: number | undefined;
  diskPath?: string | undefined;
  platform: string;
  machineName: string;
  hostname: string;
  release: string;
  arch: string;
  osLabel: string;
  nodeVersion: string;
  pid: number;
  uptimeMs: number;
  cpuCount: number;
  memoryTotalBytes: number;
  memoryFreeBytes: number;
}>;
declare const validateNodePendingAckParams: ProtocolValidator<{
  ids: string[];
}>;
declare const validateNodeDescribeParams: ProtocolValidator<{
  nodeId: string;
}>;
declare const validateNodeInvokeParams: ProtocolValidator<{
  params?: unknown;
  sessionKey?: string | undefined;
  timeoutMs?: number | undefined;
  turnSourceChannel?: string | undefined;
  turnSourceTo?: string | undefined;
  turnSourceAccountId?: string | undefined;
  turnSourceThreadId?: string | number | undefined;
  command: string;
  idempotencyKey: string;
  nodeId: string;
}>;
declare const validateNodeInvokeResultParams: ProtocolValidator<{
  error?: {
    message?: string | undefined;
    code?: string | undefined;
  } | undefined;
  payload?: unknown;
  payloadJSON?: string | undefined;
  id: string;
  ok: boolean;
  nodeId: string;
}>;
declare const validateNodeInvokeProgressParams: ProtocolValidator<{
  seq: number;
  nodeId: string;
  invokeId: string;
  chunk: string;
}>;
declare const validateNodeEventParams: ProtocolValidator<{
  payload?: unknown;
  payloadJSON?: string | undefined;
  event: string;
}>;
declare const validateNodePresenceActivityPayload: ProtocolValidator<{
  saturated?: boolean | undefined;
  idleSeconds: number;
}>;
declare const validateNodePendingDrainParams: ProtocolValidator<{
  maxItems?: number | undefined;
}>;
declare const validateNodePendingEnqueueParams: ProtocolValidator<{
  priority?: string | undefined;
  expiresInMs?: number | undefined;
  wake?: boolean | undefined;
  type: string;
  nodeId: string;
}>;
declare const validatePushTestParams: ProtocolValidator<{
  title?: string | undefined;
  body?: string | undefined;
  environment?: string | undefined;
  nodeId: string;
}>;
declare const validateWebPushVapidPublicKeyParams: ProtocolValidator<WebPushVapidPublicKeyParams>;
declare const validateWebPushSubscribeParams: ProtocolValidator<WebPushSubscribeParams>;
declare const validateWebPushUnsubscribeParams: ProtocolValidator<WebPushUnsubscribeParams>;
declare const validateWebPushTestParams: ProtocolValidator<WebPushTestParams>;
declare const validateSecretsResolveParams: ProtocolValidator<{
  allowedPaths?: string[] | undefined;
  forcedActivePaths?: string[] | undefined;
  optionalActivePaths?: string[] | undefined;
  providerOverrides?: {
    webSearch?: string | undefined;
    webFetch?: string | undefined;
  } | undefined;
  commandName: string;
  targetIds: string[];
}>;
declare const validateSecretsResolveResult: ProtocolValidator<{
  diagnostics?: string[] | undefined;
  ok?: boolean | undefined;
  assignments?: {
    path?: string | undefined;
    value: unknown;
    pathSegments: string[];
  }[] | undefined;
  inactiveRefPaths?: string[] | undefined;
}>;
declare const validateSessionsListParams: ProtocolValidator<{
  agentId?: string | undefined;
  limit?: number | undefined;
  label?: string | undefined;
  offset?: number | undefined;
  activeMinutes?: number | undefined;
  requireLastInteraction?: boolean | undefined;
  sortBy?: "updatedAt" | "lastInteractionAt" | undefined;
  includeGlobal?: boolean | undefined;
  includeUnknown?: boolean | undefined;
  configuredAgentsOnly?: boolean | undefined;
  includeDerivedTitles?: boolean | undefined;
  includeLastMessage?: boolean | undefined;
  spawnedBy?: string | undefined;
  search?: string | undefined;
  archived?: boolean | undefined;
}>;
declare const validateSessionsCatalogListParams: ProtocolValidator<{
  agentId?: string | undefined;
  search?: string | undefined;
  catalogId?: string | undefined;
  cursors?: Record<string, string> | undefined;
  progressId?: string | undefined;
  limitPerHost?: number | undefined;
  hostIds?: string[] | undefined;
}>;
declare const validateSessionsCatalogReadParams: ProtocolValidator<{
  limit?: number | undefined;
  cursor?: string | undefined;
  threadId: string;
  catalogId: string;
  hostId: string;
}>;
declare const validateSessionsCatalogContinueParams: ProtocolValidator<{
  threadId: string;
  catalogId: string;
  hostId: string;
}>;
declare const validateSessionsCatalogArchiveParams: ProtocolValidator<{
  threadId: string;
  catalogId: string;
  hostId: string;
  confirmNoOtherRunner: true;
}>;
declare const validateSessionsSearchParams: ProtocolValidator<{
  agentId?: string | undefined;
  limit?: number | undefined;
  sessionKeys?: string[] | undefined;
  query: string;
}>;
declare const validateSessionsCleanupParams: ProtocolValidator<{
  agent?: string | undefined;
  allAgents?: boolean | undefined;
  enforce?: boolean | undefined;
  activeKey?: string | undefined;
  fixMissing?: boolean | undefined;
  fixDmScope?: boolean | undefined;
}>;
declare const validateSessionsPreviewParams: ProtocolValidator<{
  limit?: number | undefined;
  maxChars?: number | undefined;
  keys: string[];
}>;
declare const validateSessionsDescribeParams: ProtocolValidator<{
  includeDerivedTitles?: boolean | undefined;
  includeLastMessage?: boolean | undefined;
  key: string;
}>;
declare const validateSessionsResolveParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionId?: string | undefined;
  label?: string | undefined;
  includeGlobal?: boolean | undefined;
  includeUnknown?: boolean | undefined;
  spawnedBy?: string | undefined;
  key?: string | undefined;
  allowMissing?: boolean | undefined;
}>;
declare const validateSessionsFilesListParams: ProtocolValidator<{
  agentId?: string | undefined;
  path?: string | undefined;
  search?: string | undefined;
  sessionKey: string;
}>;
declare const validateSessionsFilesGetParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey: string;
  path: string;
}>;
declare const validateSessionsFilesSetParams: ProtocolValidator<{
  agentId?: string | undefined;
  content: string;
  sessionKey: string;
  path: string;
  expectedHash: string;
}>;
declare const validateSessionsFilesRevealParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
}>;
declare const validateSessionsDiffParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey: string;
}>;
declare const validateSessionsCreateParams: ProtocolValidator<{
  agentId?: string | undefined;
  model?: string | undefined;
  message?: string | undefined;
  attachments?: unknown[] | undefined;
  cwd?: string | undefined;
  label?: string | undefined;
  catalogId?: string | undefined;
  key?: string | undefined;
  thinkingLevel?: string | undefined;
  parentSessionKey?: string | undefined;
  fork?: boolean | undefined;
  emitCommandHooks?: boolean | undefined;
  succeedsParent?: boolean | undefined;
  task?: string | undefined;
  worktree?: boolean | undefined;
  worktreeBaseRef?: string | undefined;
  worktreeName?: string | undefined;
  execNode?: string | undefined;
}>;
declare const validateSessionsSendParams: ProtocolValidator<{
  agentId?: string | undefined;
  thinking?: string | undefined;
  idempotencyKey?: string | undefined;
  timeoutMs?: number | undefined;
  attachments?: unknown[] | undefined;
  message: string;
  key: string;
}>;
declare const validateSessionsDispatchParams: ProtocolValidator<{
  agentId?: string | undefined;
  profileId: string;
  key: string;
}>;
declare const validateSessionsReclaimParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
}>;
declare const validateSessionsMessagesSubscribeParams: ProtocolValidator<{
  agentId?: string | undefined;
  includeApprovals?: true | undefined;
  key: string;
}>;
declare const validateSessionsMessagesUnsubscribeParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
}>;
declare const validateSessionsAbortParams: ProtocolValidator<{
  agentId?: string | undefined;
  runId?: string | undefined;
  key?: string | undefined;
}>;
declare const validateSessionsPatchParams: ProtocolValidator<{
  agentId?: string | undefined;
  model?: string | null | undefined;
  label?: string | null | undefined;
  spawnedBy?: string | null | undefined;
  archived?: boolean | undefined;
  thinkingLevel?: string | null | undefined;
  execNode?: string | null | undefined;
  category?: string | null | undefined;
  icon?: string | null | undefined;
  statusNote?: string | null | undefined;
  attention?: string | null | undefined;
  ttlMinutes?: number | undefined;
  pinned?: boolean | undefined;
  unread?: boolean | undefined;
  fastMode?: boolean | "auto" | null | undefined;
  verboseLevel?: string | null | undefined;
  traceLevel?: string | null | undefined;
  reasoningLevel?: string | null | undefined;
  responseUsage?: "off" | "full" | "tokens" | "on" | null | undefined;
  elevatedLevel?: string | null | undefined;
  execHost?: string | null | undefined;
  execSecurity?: string | null | undefined;
  execAsk?: string | null | undefined;
  spawnedWorkspaceDir?: string | null | undefined;
  spawnedCwd?: string | null | undefined;
  spawnDepth?: number | null | undefined;
  subagentRole?: "orchestrator" | "leaf" | null | undefined;
  subagentControlScope?: "none" | "children" | null | undefined;
  inheritedToolAllow?: string[] | null | undefined;
  inheritedToolDeny?: string[] | null | undefined;
  sendPolicy?: "allow" | "deny" | null | undefined;
  groupActivation?: "mention" | "always" | null | undefined;
  key: string;
}>;
declare const validateSessionsPluginPatchParams: ProtocolValidator<{
  value?: unknown;
  unset?: boolean | undefined;
  pluginId: string;
  key: string;
  namespace: string;
}>;
declare const validateSessionsResetParams: ProtocolValidator<{
  agentId?: string | undefined;
  reason?: "new" | "reset" | undefined;
  key: string;
}>;
declare const validateSessionsDeleteParams: ProtocolValidator<{
  agentId?: string | undefined;
  deleteTranscript?: boolean | undefined;
  expectedSessionId?: string | undefined;
  expectedLifecycleRevision?: string | undefined;
  expectedSessionUpdatedAt?: number | undefined;
  emitLifecycleHooks?: boolean | undefined;
  archivedOnly?: boolean | undefined;
  key: string;
}>;
declare const validateSessionsGroupsListParams: ProtocolValidator<object>;
declare const validateSessionsGroupsPutParams: ProtocolValidator<{
  names: string[];
}>;
declare const validateSessionsGroupsRenameParams: ProtocolValidator<{
  name: string;
  to: string;
}>;
declare const validateSessionsGroupsDeleteParams: ProtocolValidator<{
  name: string;
}>;
declare const validateSessionsCompactParams: ProtocolValidator<{
  agentId?: string | undefined;
  maxLines?: number | undefined;
  key: string;
}>;
declare const validateSessionsCompactionListParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
}>;
declare const validateSessionsCompactionGetParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
  checkpointId: string;
}>;
declare const validateSessionsCompactionBranchParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
  checkpointId: string;
}>;
declare const validateSessionsCompactionRestoreParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
  checkpointId: string;
}>;
declare const validateSessionsBranchesListParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey: string;
}>;
declare const validateSessionsBranchesSwitchParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey: string;
  leafEntryId: string;
}>;
declare const validateSessionsRewindParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey: string;
  entryId: string;
}>;
declare const validateSessionsForkParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey: string;
  entryId: string;
}>;
declare const validateSessionsUsageParams: ProtocolValidator<{
  agentId?: string | undefined;
  mode?: "utc" | "gateway" | "specific" | undefined;
  limit?: number | undefined;
  key?: string | undefined;
  agentScope?: "all" | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  range?: "all" | "7d" | "30d" | "90d" | "1y" | undefined;
  groupBy?: "instance" | "family" | undefined;
  includeHistorical?: boolean | undefined;
  utcOffset?: string | undefined;
  timeZone?: string | undefined;
  includeContextWeight?: boolean | undefined;
}>;
declare const validateSessionDiscussionInfoParams: ProtocolValidator<{
  sessionKey: string;
}>;
declare const validateSessionDiscussionInfoResult: ProtocolValidator<{
  embedUrl?: string | undefined;
  openUrl?: string | undefined;
  state: "available" | "none" | "open";
}>;
declare const validateSessionDiscussionOpenParams: ProtocolValidator<{
  sessionKey: string;
}>;
declare const validateSessionDiscussionOpenResult: ProtocolValidator<{
  embedUrl?: string | undefined;
  openUrl?: string | undefined;
  state: "available" | "none" | "open";
}>;
declare const validateTaskSuggestionsListParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey?: string | undefined;
}>;
declare const validateTaskSuggestionsCreateParams: ProtocolValidator<{
  agentId?: string | undefined;
  title: string;
  sessionKey: string;
  cwd: string;
  prompt: string;
  tldr: string;
}>;
declare const validateTaskSuggestionsAcceptParams: ProtocolValidator<{
  taskId: string;
}>;
declare const validateTaskSuggestionsDismissParams: ProtocolValidator<{
  reason?: string | undefined;
  taskId: string;
}>;
declare const validateTasksListParams: ProtocolValidator<{
  agentId?: string | undefined;
  status?: "failed" | "cancelled" | "timed_out" | "queued" | "running" | "completed" | ("failed" | "cancelled" | "timed_out" | "queued" | "running" | "completed")[] | undefined;
  sessionKey?: string | undefined;
  limit?: number | undefined;
  cursor?: string | undefined;
}>;
declare const validateTasksGetParams: ProtocolValidator<{
  taskId: string;
}>;
declare const validateTasksCancelParams: ProtocolValidator<{
  reason?: string | undefined;
  taskId: string;
}>;
declare const validateConfigGetParams: ProtocolValidator<object>;
declare const validateConfigSetParams: ProtocolValidator<{
  baseHash?: string | undefined;
  raw: string;
}>;
declare const validateConfigApplyParams: ProtocolValidator<{
  readonly sessionKey?: string | undefined;
  readonly baseHash?: string | undefined;
  readonly deliveryContext?: {
    channel?: string | undefined;
    accountId?: string | undefined;
    to?: string | undefined;
    threadId?: string | number | undefined;
  } | undefined;
  readonly note?: string | undefined;
  readonly restartDelayMs?: number | undefined;
  readonly raw: string;
}>;
declare const validateConfigPatchParams: ProtocolValidator<{
  sessionKey?: string | undefined;
  baseHash?: string | undefined;
  deliveryContext?: {
    channel?: string | undefined;
    accountId?: string | undefined;
    to?: string | undefined;
    threadId?: string | number | undefined;
  } | undefined;
  note?: string | undefined;
  restartDelayMs?: number | undefined;
  replacePaths?: string[] | undefined;
  raw: string;
}>;
declare const validateConfigSchemaParams: ProtocolValidator<object>;
declare const validateConfigSchemaLookupParams: ProtocolValidator<{
  path: string;
}>;
declare const validateConfigSchemaLookupResult: ProtocolValidator<{
  reloadKind?: "none" | "restart" | "hot" | undefined;
  hint?: {
    label?: string | undefined;
    help?: string | undefined;
    tags?: string[] | undefined;
    group?: string | undefined;
    order?: number | undefined;
    advanced?: boolean | undefined;
    sensitive?: boolean | undefined;
    placeholder?: string | undefined;
    itemTemplate?: unknown;
  } | undefined;
  hintPath?: string | undefined;
  path: string;
  children: {
    type?: string | string[] | undefined;
    reloadKind?: "none" | "restart" | "hot" | undefined;
    hint?: {
      label?: string | undefined;
      help?: string | undefined;
      tags?: string[] | undefined;
      group?: string | undefined;
      order?: number | undefined;
      advanced?: boolean | undefined;
      sensitive?: boolean | undefined;
      placeholder?: string | undefined;
      itemTemplate?: unknown;
    } | undefined;
    hintPath?: string | undefined;
    required: boolean;
    path: string;
    key: string;
    hasChildren: boolean;
  }[];
  schema: unknown;
}>;
declare const validateSystemAgentChatParams: ProtocolValidator<{
  message?: string | undefined;
  reset?: boolean | undefined;
  welcomeVariant?: "onboarding" | "new-agent" | undefined;
  delegation?: {
    agentId?: string | undefined;
    sessionKey?: string | undefined;
    turnSourceChannel?: string | undefined;
    turnSourceTo?: string | undefined;
    turnSourceAccountId?: string | undefined;
    turnSourceThreadId?: string | number | undefined;
  } | undefined;
  sessionId: string;
}>;
declare const validateSystemAgentChatHistoryParams: ProtocolValidator<{
  limit?: number | undefined;
}>;
declare const validateSystemChangesListParams: ProtocolValidator<{
  limit?: number | undefined;
  beforeCursor?: string | undefined;
}>;
declare const validateSystemAgentSetupDetectParams: ProtocolValidator<object>;
declare const validateSystemAgentSetupVerifyParams: ProtocolValidator<object>;
declare const validateSystemAgentSetupActivateParams: ProtocolValidator<{
  workspace?: string | undefined;
  modelRef?: string | undefined;
  authChoice?: string | undefined;
  apiKey?: string | undefined;
  kind: "existing-model" | "openai-api-key" | "anthropic-api-key" | "claude-cli" | "codex-cli" | "gemini-cli" | "api-key" | `provider-auto:${string}`;
}>;
declare const validateSystemAgentSetupAuthStartParams: ProtocolValidator<{
  workspace?: string | undefined;
  sessionId: string;
  authChoice: string;
}>;
declare const validateWizardStartParams: ProtocolValidator<{
  mode?: "local" | "remote" | undefined;
  channel?: string | undefined;
  workspace?: string | undefined;
  flow?: "setup" | "channels" | undefined;
}>;
declare const validateWizardNextParams: ProtocolValidator<{
  answer?: {
    value?: unknown;
    stepId: string;
  } | undefined;
  sessionId: string;
}>;
declare const validateWizardCancelParams: ProtocolValidator<{
  sessionId: string;
}>;
declare const validateWizardStatusParams: ProtocolValidator<{
  sessionId: string;
}>;
declare const validateTalkModeParams: ProtocolValidator<{
  phase?: string | undefined;
  enabled: boolean;
}>;
declare const validateTalkCatalogParams: ProtocolValidator<object>;
declare const validateTalkConfigParams: ProtocolValidator<{
  includeSecrets?: boolean | undefined;
}>;
declare const validateTalkConfigResult: ProtocolValidator<{
  config: {
    ui?: {
      seamColor?: string | undefined;
    } | undefined;
    session?: {
      mainKey?: string | undefined;
    } | undefined;
    talk?: {
      provider?: string | undefined;
      resolved?: {
        provider: string;
        config: {
          apiKey?: string | {
            provider: string;
            id: string;
            source: "env";
          } | {
            provider: string;
            id: string;
            source: "file";
          } | {
            provider: string;
            id: string;
            source: "exec";
          } | undefined;
        };
      } | undefined;
      providers?: Record<string, {
        apiKey?: string | {
          provider: string;
          id: string;
          source: "env";
        } | {
          provider: string;
          id: string;
          source: "file";
        } | {
          provider: string;
          id: string;
          source: "exec";
        } | undefined;
      }> | undefined;
      realtime?: {
        provider?: string | undefined;
        mode?: "realtime" | "stt-tts" | "transcription" | undefined;
        model?: string | undefined;
        providers?: Record<string, {
          apiKey?: string | {
            provider: string;
            id: string;
            source: "env";
          } | {
            provider: string;
            id: string;
            source: "file";
          } | {
            provider: string;
            id: string;
            source: "exec";
          } | undefined;
        }> | undefined;
        speakerVoice?: string | undefined;
        speakerVoiceId?: string | undefined;
        voice?: string | undefined;
        instructions?: string | undefined;
        transport?: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room" | undefined;
        vadThreshold?: number | undefined;
        silenceDurationMs?: number | undefined;
        prefixPaddingMs?: number | undefined;
        reasoningEffort?: string | undefined;
        brain?: "none" | "agent-consult" | "direct-tools" | undefined;
        consultRouting?: "provider-direct" | "force-agent-consult" | undefined;
      } | undefined;
      consultThinkingLevel?: string | undefined;
      consultFastMode?: boolean | undefined;
      speechLocale?: string | undefined;
      interruptOnSpeech?: boolean | undefined;
      silenceTimeoutMs?: number | undefined;
    } | undefined;
  };
}>;
declare const validateTalkClientCreateParams: ProtocolValidator<{
  provider?: string | undefined;
  mode?: "realtime" | "stt-tts" | "transcription" | undefined;
  model?: string | undefined;
  sessionKey?: string | undefined;
  voice?: string | undefined;
  transport?: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room" | undefined;
  vadThreshold?: number | undefined;
  silenceDurationMs?: number | undefined;
  prefixPaddingMs?: number | undefined;
  reasoningEffort?: string | undefined;
  brain?: "none" | "agent-consult" | "direct-tools" | undefined;
  voiceSessionId?: string | undefined;
  capabilities?: ("camera-frame" | "voice-transcript")[] | undefined;
}>;
declare const validateTalkClientCreateResult: ProtocolValidator<{
  model?: string | undefined;
  voice?: string | undefined;
  offerUrl?: string | undefined;
  offerHeaders?: Record<string, string> | undefined;
  expiresAt?: number | undefined;
  provider: string;
  transport: "webrtc";
  voiceSessionId: string;
  clientSecret: string;
} | {
  model?: string | undefined;
  voice?: string | undefined;
  expiresAt?: number | undefined;
  initialMessage?: unknown;
  provider: string;
  audio: {
    inputEncoding: "pcm16" | "g711_ulaw";
    inputSampleRateHz: number;
    outputEncoding: "pcm16" | "g711_ulaw";
    outputSampleRateHz: number;
  };
  transport: "provider-websocket";
  voiceSessionId: string;
  clientSecret: string;
  protocol: string;
  websocketUrl: string;
} | {
  model?: string | undefined;
  voice?: string | undefined;
  voiceSessionId?: string | undefined;
  expiresAt?: number | undefined;
  provider: string;
  audio: {
    inputEncoding: "pcm16" | "g711_ulaw";
    inputSampleRateHz: number;
    outputEncoding: "pcm16" | "g711_ulaw";
    outputSampleRateHz: number;
  };
  transport: "gateway-relay";
  relaySessionId: string;
} | {
  token?: string | undefined;
  model?: string | undefined;
  voice?: string | undefined;
  voiceSessionId?: string | undefined;
  expiresAt?: number | undefined;
  provider: string;
  transport: "managed-room";
  roomUrl: string;
}>;
declare const validateTalkClientCloseParams: ProtocolValidator<{
  sessionKey: string;
  voiceSessionId: string;
}>;
declare const validateTalkClientMutationResult: ProtocolValidator<{
  ok: true;
}>;
declare const validateTalkClientToolCallParams: ProtocolValidator<{
  args?: unknown;
  voiceSessionId?: string | undefined;
  relaySessionId?: string | undefined;
  name: string;
  sessionKey: string;
  callId: string;
}>;
declare const validateTalkClientToolCallResult: ProtocolValidator<{
  runId: string;
  idempotencyKey: string;
}>;
declare const validateTalkClientTranscriptParams: ProtocolValidator<{
  timestamp?: number | undefined;
  text: string;
  role: "user" | "assistant";
  sessionKey: string;
  entryId: string;
  voiceSessionId: string;
}>;
declare const validateTalkClientSteerParams: ProtocolValidator<{
  mode?: "status" | "steer" | "cancel" | "followup" | undefined;
  text: string;
  sessionKey: string;
}>;
declare const validateTalkSessionCreateParams: ProtocolValidator<{
  provider?: string | undefined;
  mode?: "realtime" | "stt-tts" | "transcription" | undefined;
  model?: string | undefined;
  sessionKey?: string | undefined;
  spawnedBy?: string | undefined;
  voice?: string | undefined;
  transport?: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room" | undefined;
  vadThreshold?: number | undefined;
  silenceDurationMs?: number | undefined;
  prefixPaddingMs?: number | undefined;
  reasoningEffort?: string | undefined;
  brain?: "none" | "agent-consult" | "direct-tools" | undefined;
  language?: string | undefined;
  ttlMs?: number | undefined;
}>;
declare const validateTalkSessionJoinParams: ProtocolValidator<{
  token: string;
  sessionId: string;
}>;
declare const validateTalkSessionAppendAudioParams: ProtocolValidator<{
  timestamp?: number | undefined;
  sessionId: string;
  audioBase64: string;
}>;
declare const validateTalkSessionAcknowledgeMarkParams: ProtocolValidator<{
  sessionId: string;
  markName: string;
}>;
declare const validateTalkSessionTurnParams: ProtocolValidator<{
  turnId?: string | undefined;
  sessionId: string;
}>;
declare const validateTalkSessionCancelTurnParams: ProtocolValidator<{
  reason?: string | undefined;
  turnId?: string | undefined;
  sessionId: string;
}>;
declare const validateTalkSessionCancelOutputParams: ProtocolValidator<{
  reason?: string | undefined;
  turnId?: string | undefined;
  sessionId: string;
}>;
declare const validateTalkSessionSteerParams: ProtocolValidator<{
  mode?: "status" | "steer" | "cancel" | "followup" | undefined;
  sessionKey?: string | undefined;
  text: string;
  sessionId: string;
}>;
declare const validateTalkSessionSubmitToolResultParams: ProtocolValidator<{
  options?: {
    suppressResponse?: boolean | undefined;
    willContinue?: boolean | undefined;
  } | undefined;
  sessionId: string;
  result: unknown;
  callId: string;
}>;
declare const validateTalkSessionCloseParams: ProtocolValidator<{
  sessionId: string;
}>;
declare const validateTalkSpeakParams: ProtocolValidator<{
  language?: string | undefined;
  voiceId?: string | undefined;
  modelId?: string | undefined;
  outputFormat?: string | undefined;
  speed?: number | undefined;
  rateWpm?: number | undefined;
  stability?: number | undefined;
  similarity?: number | undefined;
  style?: number | undefined;
  speakerBoost?: boolean | undefined;
  seed?: number | undefined;
  normalize?: string | undefined;
  latencyTier?: number | undefined;
  text: string;
}>;
declare const validateTtsSpeakParams: ProtocolValidator<{
  text: string;
}>;
declare const validateChannelsStatusParams: ProtocolValidator<{
  probe?: boolean | undefined;
  channel?: string | undefined;
  timeoutMs?: number | undefined;
}>;
declare const validateChannelsStartParams: ProtocolValidator<{
  accountId?: string | undefined;
  channel: string;
}>;
declare const validateChannelsStopParams: ProtocolValidator<{
  accountId?: string | undefined;
  channel: string;
}>;
declare const validateChannelsLogoutParams: ProtocolValidator<{
  accountId?: string | undefined;
  channel: string;
}>;
declare const validateModelsListParams: ProtocolValidator<{
  includeProviderCapabilities?: boolean | undefined;
  view?: "default" | "all" | "configured" | "provider-config" | undefined;
}>;
declare const validateSkillsStatusParams: ProtocolValidator<{
  agentId?: string | undefined;
}>;
declare const validateToolsCatalogParams: ProtocolValidator<{
  agentId?: string | undefined;
  includePlugins?: boolean | undefined;
}>;
declare const validateToolsEffectiveParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey: string;
}>;
declare const validateToolsInvokeParams: ProtocolValidator<{
  agentId?: string | undefined;
  args?: Record<string, unknown> | undefined;
  sessionKey?: string | undefined;
  conversationReadOrigin?: "direct-operator" | undefined;
  idempotencyKey?: string | undefined;
  confirm?: boolean | undefined;
  name: string;
}>;
declare const validateSkillsBinsParams: ProtocolValidator<object>;
declare const validateSkillsInstallParams: ProtocolValidator<{
  agentId?: string | undefined;
  timeoutMs?: number | undefined;
  dangerouslyForceUnsafeInstall?: boolean | undefined;
  name: string;
  installId: string;
} | {
  agentId?: string | undefined;
  version?: string | undefined;
  timeoutMs?: number | undefined;
  force?: boolean | undefined;
  acknowledgeClawHubRisk?: boolean | undefined;
  source: "clawhub";
  slug: string;
} | {
  agentId?: string | undefined;
  timeoutMs?: number | undefined;
  force?: boolean | undefined;
  sha256?: string | undefined;
  source: "upload";
  slug: string;
  uploadId: string;
}>;
declare const validateSkillsUploadBeginParams: ProtocolValidator<{
  idempotencyKey?: string | undefined;
  force?: boolean | undefined;
  sha256?: string | undefined;
  kind: "skill-archive";
  slug: string;
  sizeBytes: number;
}>;
declare const validateSkillsUploadChunkParams: ProtocolValidator<{
  offset: number;
  uploadId: string;
  dataBase64: string;
}>;
declare const validateSkillsUploadCommitParams: ProtocolValidator<{
  sha256?: string | undefined;
  uploadId: string;
}>;
declare const validateSkillsUpdateParams: ProtocolValidator<{
  apiKey?: string | undefined;
  enabled?: boolean | undefined;
  env?: Record<string, string> | undefined;
  skillKey: string;
} | {
  agentId?: string | undefined;
  all?: boolean | undefined;
  slug?: string | undefined;
  acknowledgeClawHubRisk?: boolean | undefined;
  source: "clawhub";
}>;
declare const validateSkillsSearchParams: ProtocolValidator<{
  query?: string | undefined;
  limit?: number | undefined;
}>;
declare const validateSkillsDetailParams: ProtocolValidator<{
  slug: string;
}>;
declare const validateSkillsCuratorStatusParams: ProtocolValidator<object>;
declare const validateSkillsCuratorActionParams: ProtocolValidator<{
  skill: string;
}>;
declare const validateSkillsProposalsListParams: ProtocolValidator<{
  agentId?: string | undefined;
}>;
declare const validateSkillsProposalInspectParams: ProtocolValidator<{
  agentId?: string | undefined;
  proposalId: string;
}>;
declare const validateSkillsProposalCreateParams: ProtocolValidator<{
  agentId?: string | undefined;
  supportFiles?: {
    content: string;
    path: string;
  }[] | undefined;
  goal?: string | undefined;
  evidence?: string | undefined;
  content: string;
  name: string;
  description: string;
}>;
declare const validateSkillsProposalUpdateParams: ProtocolValidator<{
  agentId?: string | undefined;
  description?: string | undefined;
  supportFiles?: {
    content: string;
    path: string;
  }[] | undefined;
  goal?: string | undefined;
  evidence?: string | undefined;
  content: string;
  skillName: string;
}>;
declare const validateSkillsProposalReviseParams: ProtocolValidator<{
  agentId?: string | undefined;
  description?: string | undefined;
  supportFiles?: {
    content: string;
    path: string;
  }[] | undefined;
  goal?: string | undefined;
  evidence?: string | undefined;
  content: string;
  proposalId: string;
}>;
declare const validateSkillsProposalRequestRevisionParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionId?: string | undefined;
  targetAgentId?: string | undefined;
  sessionKey: string;
  idempotencyKey: string;
  instructions: string;
  proposalId: string;
}>;
declare const validateSkillsProposalActionParams: ProtocolValidator<{
  agentId?: string | undefined;
  reason?: string | undefined;
  proposalId: string;
}>;
declare const validateSkillsSecurityVerdictsParams: ProtocolValidator<{
  agentId?: string | undefined;
}>;
declare const validateSkillsSkillCardParams: ProtocolValidator<{
  agentId?: string | undefined;
  skillKey: string;
}>;
declare const validateCronListParams: ProtocolValidator<{
  agentId?: string | undefined;
  query?: string | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  sortBy?: "name" | "nextRunAtMs" | "updatedAtMs" | undefined;
  enabled?: "all" | "enabled" | "disabled" | undefined;
  includeDisabled?: boolean | undefined;
  scheduleKind?: "all" | "cron" | "at" | "every" | "on-exit" | undefined;
  lastRunStatus?: "error" | "unknown" | "all" | "ok" | "skipped" | undefined;
  sortDir?: "asc" | "desc" | undefined;
  compact?: boolean | undefined;
}>;
declare const validateCronStatusParams: ProtocolValidator<object>;
declare const validateCronGetParams: ProtocolValidator<{
  id: string;
} | {
  jobId: string;
}>;
declare const validateCronAddParams: ProtocolValidator<{
  agentId?: string | null | undefined;
  displayName?: string | undefined;
  sessionKey?: string | null | undefined;
  description?: string | undefined;
  enabled?: boolean | undefined;
  declarationKey?: string | undefined;
  owner?: {
    agentId?: string | undefined;
    sessionKey?: string | undefined;
  } | undefined;
  pacing?: {
    min?: string | undefined;
    max?: string | undefined;
  } | undefined;
  trigger?: {
    once?: boolean | undefined;
    script: string;
  } | undefined;
  delivery?: {
    channel?: string | undefined;
    accountId?: string | undefined;
    to?: string | undefined;
    threadId?: string | number | undefined;
    bestEffort?: boolean | undefined;
    failureDestination?: {
      mode?: "announce" | "webhook" | undefined;
      channel?: string | undefined;
      accountId?: string | undefined;
      to?: string | undefined;
    } | undefined;
    mode: "none";
  } | {
    channel?: string | undefined;
    accountId?: string | undefined;
    to?: string | undefined;
    threadId?: string | number | undefined;
    bestEffort?: boolean | undefined;
    failureDestination?: {
      mode?: "announce" | "webhook" | undefined;
      channel?: string | undefined;
      accountId?: string | undefined;
      to?: string | undefined;
    } | undefined;
    completionDestination?: {
      mode: "webhook";
      to: string;
    } | undefined;
    mode: "announce";
  } | {
    channel?: string | undefined;
    accountId?: string | undefined;
    threadId?: string | number | undefined;
    bestEffort?: boolean | undefined;
    failureDestination?: {
      mode?: "announce" | "webhook" | undefined;
      channel?: string | undefined;
      accountId?: string | undefined;
      to?: string | undefined;
    } | undefined;
    mode: "webhook";
    to: string;
  } | undefined;
  failureAlert?: false | {
    mode?: "announce" | "webhook" | undefined;
    channel?: string | undefined;
    accountId?: string | undefined;
    to?: string | undefined;
    after?: number | undefined;
    cooldownMs?: number | undefined;
    includeSkipped?: boolean | undefined;
  } | undefined;
  deleteAfterRun?: boolean | undefined;
  name: string;
  payload: {
    toolsAllow?: string[] | undefined;
    toolsAllowIsDefault?: boolean | undefined;
    text: string;
    kind: "systemEvent";
  } | {
    thinking?: unknown;
    model?: unknown;
    toolsAllow?: unknown;
    toolsAllowIsDefault?: boolean | undefined;
    fallbacks?: unknown;
    timeoutSeconds?: number | undefined;
    allowUnsafeExternalContent?: boolean | undefined;
    lightContext?: boolean | undefined;
    message: unknown;
    kind: "agentTurn";
  } | {
    input?: string | undefined;
    cwd?: string | undefined;
    env?: Record<string, string> | undefined;
    toolsAllow?: unknown;
    toolsAllowIsDefault?: boolean | undefined;
    timeoutSeconds?: number | undefined;
    noOutputTimeoutSeconds?: number | undefined;
    outputMaxBytes?: number | undefined;
    kind: "command";
    argv: unknown;
  } | {
    toolsAllow?: unknown;
    toolsAllowIsDefault?: boolean | undefined;
    timeoutSeconds?: number | undefined;
    toolBudget?: number | undefined;
    kind: "script";
    script: unknown;
  };
  schedule: {
    kind: "at";
    at: string;
  } | {
    anchorMs?: number | undefined;
    kind: "every";
    everyMs: number;
  } | {
    tz?: string | undefined;
    staggerMs?: number | undefined;
    kind: "cron";
    expr: string;
  } | {
    cwd?: string | undefined;
    kind: "on-exit";
    command: string;
  };
  sessionTarget: string;
  wakeMode: "now" | "next-heartbeat";
}>;
declare const validateCronUpdateParams: ProtocolValidator<{
  id: string;
} | {
  jobId: string;
}>;
declare const validateCronRemoveParams: ProtocolValidator<{
  id: string;
} | {
  jobId: string;
}>;
declare const validateCronRunParams: ProtocolValidator<{
  id: string;
} | {
  jobId: string;
}>;
declare const validateCronRunsParams: ProtocolValidator<{
  agentId?: string | undefined;
  scope?: "all" | "job" | undefined;
  id?: string | undefined;
  runId?: string | undefined;
  status?: "error" | "all" | "ok" | "skipped" | undefined;
  query?: string | undefined;
  limit?: number | undefined;
  jobId?: string | undefined;
  offset?: number | undefined;
  sortDir?: "asc" | "desc" | undefined;
  statuses?: ("error" | "ok" | "skipped")[] | undefined;
  deliveryStatuses?: ("unknown" | "delivered" | "not-delivered" | "not-requested")[] | undefined;
  deliveryStatus?: "unknown" | "delivered" | "not-delivered" | "not-requested" | undefined;
}>;
declare const validateDevicePairListParams: ProtocolValidator<object>;
declare const validateDevicePairApproveParams: ProtocolValidator<{
  requestId: string;
}>;
declare const validateDevicePairRejectParams: ProtocolValidator<{
  requestId: string;
}>;
declare const validateDevicePairRemoveParams: ProtocolValidator<{
  deviceId: string;
}>;
declare const validateDevicePairSetupCodeParams: ProtocolValidator<{
  publicUrl?: string | undefined;
  preferRemoteUrl?: boolean | undefined;
  includeQr?: boolean | undefined;
  bootstrapProfile?: string | undefined;
}>;
declare const validateDevicePairRenameParams: ProtocolValidator<{
  label: string;
  deviceId: string;
}>;
declare const validateDeviceTokenRotateParams: ProtocolValidator<{
  scopes?: string[] | undefined;
  role: string;
  deviceId: string;
}>;
declare const validateDeviceTokenRevokeParams: ProtocolValidator<{
  role: string;
  deviceId: string;
}>;
declare const validateApprovalPresentation: ProtocolValidator<{
  agentId?: string | null | undefined;
  host?: string | null | undefined;
  nodeId?: string | null | undefined;
  commandPreview?: string | null | undefined;
  warningText?: string | null | undefined;
  kind: "exec";
  commandText: string;
  allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
} | {
  agentId?: string | null | undefined;
  toolName?: string | null | undefined;
  pluginId?: string | null | undefined;
  kind: "plugin";
  title: string;
  description: string;
  allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
  severity: "info" | "warning" | "critical";
} | {
  agentId?: string | null | undefined;
  kind: "system-agent";
  title: string;
  description: string;
  allowedDecisions: ["allow-once", "deny"];
  proposalHash: string;
}>;
declare const validateApprovalGetParams: ProtocolValidator<{
  id: string;
}>;
declare const validateApprovalHistoryParams: ProtocolValidator<{
  kind?: "exec" | "plugin" | "system-agent" | undefined;
  limit?: number | undefined;
  cursor?: string | undefined;
}>;
declare const validateApprovalResolveParams: ProtocolValidator<{
  id: string;
  kind: "exec" | "plugin" | "system-agent";
  decision: "deny" | "allow-once" | "allow-always";
}>;
declare const validateExecApprovalsGetParams: ProtocolValidator<object>;
declare const validateExecApprovalsSetParams: ProtocolValidator<{
  baseHash?: string | undefined;
  file: {
    socket?: {
      token?: string | undefined;
      path?: string | undefined;
    } | undefined;
    defaults?: {
      security?: string | undefined;
      ask?: string | undefined;
      askFallback?: string | undefined;
      autoAllowSkills?: boolean | undefined;
    } | undefined;
    agents?: Record<string, {
      security?: string | undefined;
      ask?: string | undefined;
      askFallback?: string | undefined;
      autoAllowSkills?: boolean | undefined;
      allowlist?: {
        id?: string | undefined;
        source?: "allow-always" | undefined;
        commandText?: string | undefined;
        argPattern?: string | undefined;
        lastUsedAt?: number | undefined;
        lastUsedCommand?: string | undefined;
        lastResolvedPath?: string | undefined;
        pattern: string;
      }[] | undefined;
    }> | undefined;
    version: 1;
  };
}>;
declare const validateExecApprovalGetParams: ProtocolValidator<{
  id: string;
}>;
declare const validateExecApprovalRequestParams: ProtocolValidator<{
  agentId?: string | null | undefined;
  id?: string | undefined;
  sessionId?: string | null | undefined;
  runId?: string | null | undefined;
  toolCallId?: string | null | undefined;
  command?: string | undefined;
  host?: string | null | undefined;
  sessionKey?: string | null | undefined;
  timeoutMs?: number | undefined;
  cwd?: string | null | undefined;
  nodeId?: string | null | undefined;
  turnSourceChannel?: string | null | undefined;
  turnSourceTo?: string | null | undefined;
  turnSourceAccountId?: string | null | undefined;
  turnSourceThreadId?: string | number | null | undefined;
  env?: Record<string, string> | undefined;
  warningText?: string | null | undefined;
  security?: string | null | undefined;
  ask?: string | null | undefined;
  commandArgv?: string[] | undefined;
  systemRunPlan?: {
    commandPreview?: string | null | undefined;
    policySnapshot?: {
      security: "full" | "deny" | "allowlist";
      ask: "off" | "always" | "on-miss";
      askFallback: "full" | "deny" | "allowlist";
      autoAllowSkills: boolean;
      allowlistRules: {
        source?: "allow-always" | undefined;
        argPattern?: string | undefined;
        pattern: string;
      }[];
    } | undefined;
    mutableFileOperand?: {
      path: string;
      sha256: string;
      argvIndex: number;
    } | null | undefined;
    agentId: string | null;
    sessionKey: string | null;
    cwd: string | null;
    argv: string[];
    commandText: string;
  } | undefined;
  unavailableDecisions?: string[] | undefined;
  commandSpans?: {
    startIndex: number;
    endIndex: number;
  }[] | undefined;
  resolvedPath?: string | null | undefined;
  approvalReviewerDeviceIds?: string[] | undefined;
  requireDeliveryRoute?: boolean | undefined;
  suppressDelivery?: boolean | undefined;
  twoPhase?: boolean | undefined;
}>;
declare const validateExecApprovalResolveParams: ProtocolValidator<{
  id: string;
  decision: string;
}>;
declare const validateQuestionRequestParams: ProtocolValidator<{
  agentId?: string | undefined;
  id?: string | undefined;
  sessionKey?: string | undefined;
  timeoutMs?: number | undefined;
  questions: {
    multiSelect?: boolean | undefined;
    isOther?: boolean | undefined;
    isSecret?: boolean | undefined;
    question: string;
    options: {
      description?: string | undefined;
      label: string;
    }[];
    questionId: string;
    header: string;
  }[];
}>;
declare const validateQuestionWaitAnswerParams: ProtocolValidator<{
  timeoutMs?: number | undefined;
  id: string;
}>;
declare const validateQuestionResolveParams: ProtocolValidator<{
  resolvedBy?: string | undefined;
  id: string;
  answers: {
    answers: Record<string, string[]>;
  };
} | {
  resolvedBy?: string | undefined;
  id: string;
  cancel: true;
}>;
declare const validateQuestionGetParams: ProtocolValidator<{
  id: string;
}>;
declare const validateQuestionListParams: ProtocolValidator<object>;
declare const validatePluginApprovalRequestParams: ProtocolValidator<{
  agentId?: string | undefined;
  toolCallId?: string | undefined;
  toolName?: string | undefined;
  sessionKey?: string | undefined;
  timeoutMs?: number | undefined;
  pluginId?: string | undefined;
  turnSourceChannel?: string | undefined;
  turnSourceTo?: string | undefined;
  turnSourceAccountId?: string | undefined;
  turnSourceThreadId?: string | number | undefined;
  allowedDecisions?: string[] | undefined;
  severity?: string | undefined;
  approvalReviewerDeviceIds?: string[] | undefined;
  twoPhase?: boolean | undefined;
  title: string;
  description: string;
}>;
declare const validatePluginApprovalResolveParams: ProtocolValidator<{
  id: string;
  decision: string;
}>;
declare const validatePluginsListParams: ProtocolValidator<object>;
declare const validatePluginsRefreshParams: ProtocolValidator<object>;
declare const validatePluginsSearchParams: ProtocolValidator<{
  limit?: number | undefined;
  query: string;
}>;
declare const validatePluginsInstallParams: ProtocolValidator<{
  version?: string | undefined;
  acknowledgeClawHubRisk?: boolean | undefined;
  source: "clawhub";
  packageName: string;
} | {
  source: "official";
  pluginId: string;
}>;
declare const validatePluginsSetEnabledParams: ProtocolValidator<{
  pluginId: string;
  enabled: boolean;
}>;
declare const validatePluginsUninstallParams: ProtocolValidator<{
  pluginId: string;
}>;
declare const validatePluginsUiDescriptorsParams: ProtocolValidator<object>;
declare const validatePluginsUiDescriptorsResult: ProtocolValidator<{
  ok: true;
  descriptors: {
    placement?: string | undefined;
    description?: string | undefined;
    schema?: unknown;
    pluginName?: string | undefined;
    requiredScopes?: string[] | undefined;
    id: string;
    label: string;
    pluginId: string;
    surface: "tool" | "session" | "run" | "settings";
  }[];
}>;
declare const validatePluginsSessionActionParams: ProtocolValidator<{
  payload?: unknown;
  sessionKey?: string | undefined;
  pluginId: string;
  actionId: string;
}>;
declare const validatePluginsSessionActionResult: ProtocolValidator<{
  result?: unknown;
  continueAgent?: boolean | undefined;
  reply?: unknown;
  ok: true;
} | {
  code?: string | undefined;
  details?: unknown;
  error: string;
  ok: false;
}>;
declare const validateExecApprovalsNodeGetParams: ProtocolValidator<{
  nodeId: string;
}>;
declare const validateExecApprovalsNodeSetParams: ProtocolValidator<{
  native?: {
    defaultAction?: "allow" | "deny" | "prompt" | undefined;
    rules: {
      description?: string | undefined;
      enabled?: boolean | undefined;
      shells?: string[] | undefined;
      action: "allow" | "deny" | "prompt";
      pattern: string;
    }[];
  } | undefined;
  file?: {
    socket?: {
      token?: string | undefined;
      path?: string | undefined;
    } | undefined;
    defaults?: {
      security?: string | undefined;
      ask?: string | undefined;
      askFallback?: string | undefined;
      autoAllowSkills?: boolean | undefined;
    } | undefined;
    agents?: Record<string, {
      security?: string | undefined;
      ask?: string | undefined;
      askFallback?: string | undefined;
      autoAllowSkills?: boolean | undefined;
      allowlist?: {
        id?: string | undefined;
        source?: "allow-always" | undefined;
        commandText?: string | undefined;
        argPattern?: string | undefined;
        lastUsedAt?: number | undefined;
        lastUsedCommand?: string | undefined;
        lastResolvedPath?: string | undefined;
        pattern: string;
      }[] | undefined;
    }> | undefined;
    version: 1;
  } | undefined;
  baseHash?: string | undefined;
  nodeId: string;
}>;
declare const validateExecApprovalsNodeSnapshot: ProtocolValidator<{
  message?: string | undefined;
  file?: {
    socket?: {
      token?: string | undefined;
      path?: string | undefined;
    } | undefined;
    defaults?: {
      security?: string | undefined;
      ask?: string | undefined;
      askFallback?: string | undefined;
      autoAllowSkills?: boolean | undefined;
    } | undefined;
    agents?: Record<string, {
      security?: string | undefined;
      ask?: string | undefined;
      askFallback?: string | undefined;
      autoAllowSkills?: boolean | undefined;
      allowlist?: {
        id?: string | undefined;
        source?: "allow-always" | undefined;
        commandText?: string | undefined;
        argPattern?: string | undefined;
        lastUsedAt?: number | undefined;
        lastUsedCommand?: string | undefined;
        lastResolvedPath?: string | undefined;
        pattern: string;
      }[] | undefined;
    }> | undefined;
    version: 1;
  } | undefined;
  path?: string | undefined;
  baseHash?: string | undefined;
  enabled?: boolean | undefined;
  defaultAction?: "allow" | "deny" | "prompt" | undefined;
  rules?: {
    description?: string | undefined;
    enabled?: boolean | undefined;
    shells?: string[] | undefined;
    action: "allow" | "deny" | "prompt";
    pattern: string;
  }[] | undefined;
  exists?: boolean | undefined;
  hash?: string | undefined;
  resolvedDefaults?: {
    security: "full" | "deny" | "allowlist";
    ask: "off" | "always" | "on-miss";
    askFallback: "full" | "deny" | "allowlist";
    autoAllowSkills: boolean;
  } | undefined;
  constraints?: {
    baseHashRequired?: boolean | undefined;
    defaultAllowAllowed?: boolean | undefined;
    broadAllowRulesAllowed?: boolean | undefined;
    dangerousAllowRulesAllowed?: boolean | undefined;
  } | undefined;
}>;
declare const validateLogsTailParams: ProtocolValidator<{
  limit?: number | undefined;
  cursor?: number | undefined;
  maxBytes?: number | undefined;
}>;
declare const validateModelsProbeParams: ProtocolValidator<{
  timeoutMs?: number | undefined;
  profileId?: string | undefined;
  provider: string;
}>;
declare const validateChatHistoryParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionId?: string | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  maxChars?: number | undefined;
  messageId?: string | undefined;
  sessionKey: string;
}>;
declare const validateChatMetadataParams: ProtocolValidator<{
  agentId?: string | undefined;
}>;
declare const validateChatMessageGetParams: ProtocolValidator<{
  agentId?: string | undefined;
  maxChars?: number | undefined;
  sessionKey: string;
  messageId: string;
}>;
declare const validateChatToolTitlesParams: ProtocolValidator<{
  agentId?: string | undefined;
  items: {
    id: string;
    name: string;
    input: string;
  }[];
  sessionKey: string;
}>;
declare const validateChatSendParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionId?: string | undefined;
  thinking?: string | undefined;
  replyToId?: string | undefined;
  timeoutMs?: number | undefined;
  deliver?: boolean | undefined;
  attachments?: unknown[] | undefined;
  fastMode?: boolean | "auto" | undefined;
  fastAutoOnSeconds?: number | undefined;
  queueMode?: string | undefined;
  originatingChannel?: string | undefined;
  originatingTo?: string | undefined;
  originatingAccountId?: string | undefined;
  originatingThreadId?: string | undefined;
  toolBindings?: Record<string, unknown> | undefined;
  systemInputProvenance?: {
    sourceSessionKey?: string | undefined;
    originSessionId?: string | undefined;
    sourceChannel?: string | undefined;
    sourceTool?: string | undefined;
    kind: string;
  } | undefined;
  systemProvenanceReceipt?: string | undefined;
  suppressCommandInterpretation?: boolean | undefined;
  expectedSessionRoutingContract?: string | undefined;
  message: string;
  sessionKey: string;
  idempotencyKey: string;
}>;
declare const validateChatAbortParams: ProtocolValidator<{
  agentId?: string | undefined;
  runId?: string | undefined;
  preserveSideRuns?: boolean | undefined;
  sessionKey: string;
}>;
declare const validateChatInjectParams: ProtocolValidator<{
  agentId?: string | undefined;
  label?: string | undefined;
  message: string;
  sessionKey: string;
}>;
declare const validateUpdateStatusParams: ProtocolValidator<object>;
declare const validateUpdateRunParams: ProtocolValidator<{
  sessionKey?: string | undefined;
  timeoutMs?: number | undefined;
  deliveryContext?: {
    channel?: string | undefined;
    accountId?: string | undefined;
    to?: string | undefined;
    threadId?: string | number | undefined;
  } | undefined;
  note?: string | undefined;
  restartDelayMs?: number | undefined;
  continuationMessage?: string | undefined;
}>;
declare const validateUiCommandParams: ProtocolValidator<{
  sessionKey?: string | undefined;
  command: {
    kind: "split";
    sessionKey: string;
    direction: "right" | "down";
  } | {
    kind: "close-pane";
    sessionKey: string;
  } | {
    kind: "focus";
    sessionKey: string;
  } | {
    kind: "sidebar";
    visible: boolean;
  } | {
    dock?: "right" | "bottom" | undefined;
    terminalSessionId?: string | undefined;
    kind: "panel";
    open: boolean;
    panel: "terminal" | "browser";
  } | {
    kind: "navigate";
    sessionKey: string;
  };
}>;
declare const validateWebLoginStartParams: ProtocolValidator<{
  accountId?: string | undefined;
  timeoutMs?: number | undefined;
  force?: boolean | undefined;
  verbose?: boolean | undefined;
}>;
declare const validateWebLoginWaitParams: ProtocolValidator<{
  accountId?: string | undefined;
  timeoutMs?: number | undefined;
  currentQrDataUrl?: string | undefined;
}>;
type SessionsPatchResult = {
  ok: true;
  path: string;
  key: string;
  entry: Record<string, unknown>;
  resolved?: {
    modelProvider?: string;
    model?: string;
    agentRuntime?: GatewayAgentRuntime;
    thinkingLevel?: string;
    thinkingLevels?: Array<{
      id: string;
      label: string;
    }>;
  };
};
type GatewayAgentRuntime = {
  id: string;
  fallback?: "openclaw" | "none";
  source: "env" | "agent" | "defaults" | "model" | "provider" | "implicit" | "session" | "session-key";
};
//#endregion
export { validateConversationListParams as $, NodePresenceActivityPayloadSchema as $C, ErrorCodes as $S, SkillsSkillCardParamsSchema as $_, WorkerHeartbeatRequestFrameSchema as $a, UiCommandResult as $b, SystemInfoResult as $c, EnvironmentsStatusResultSchema as $d, SystemAgentSetupVerifyParams as $f, ModelsProbeParamsSchema as $g, ArtifactsGetParams as $h, validateWorktreesBranchesParams as $i, QuestionRequestedEvent as $l, TtsSpeakParamsSchema as $m, validateSessionsGroupsDeleteParams as $n, WizardStepSchema as $o, TalkCatalogResultSchema as $p, validateTalkClientTranscriptParams as $r, TerminalOpenParams as $s, validateNodePluginToolsUpdateParams as $t, GatewaySuspendResumeParamsSchema as $u, WakeParams as $v, AllowedApprovalSnapshotSchema as $x, BoardViewTicketSchema as $y, validateBoardWidgetContent as A, NodeListParamsSchema as AC, ExpiredApprovalSnapshot as AS, SkillsProposalRecordResult as A_, WORKER_LIVE_EVENT_PROTOCOL_FEATURE as Aa, ConnectParams as Ab, TaskSuggestionEvent as Ac, ExecApprovalsNodeSnapshot as Ad, SystemAgentChatHistoryParamsSchema as Af, AgentsFilesGetParamsSchema as Ag, AuditListParams as Ah, validateUsersListParams as Ai, SessionPlacementState as Al, TalkSessionCreateParams as Am, validateSessionsAbortParams as An, WorkerTranscriptCommitResultSchema as Ao, UpdateStatusParamsSchema as Ap, validateSkillsSkillCardParams as Ar, PluginsUiDescriptorsResultSchema as As, validateExecApprovalsSetParams as At, ChatHistoryParamsSchema as Au, ConversationListItemSchema as Av, WorkerInferenceEventParams as Ax, BoardGetParams as Ay, validateChatMessageGetParams as B, NodePendingDrainParams as BC, SessionApprovalReplay as BS, SkillsProposalsListParams as B_, WORKER_TRANSCRIPT_MAX_JSON_DEPTH as Ba, HelloOkSchema as Bb, TaskSuggestionsCreateParamsSchema as Bc, EnvironmentsCreateResult as Bd, SystemAgentChatResultSchema as Bf, AgentsFilesSetResultSchema as Bg, AuditActivityListParams as Bh, validateWebPushSubscribeParams as Bi, QuestionListParamsSchema as Bl, TalkSessionSteerParams as Bm, validateSessionsCompactionGetParams as Bn, WizardNextParams as Bo, ChannelsStartParams as Bp, validateSystemAgentSetupDetectParams as Br, TerminalAttachResultSchema as Bs, validateNodeDescribeParams as Bt, LogsTailParams as Bu, ConversationTurnCancelParamsSchema as Bv, WorkerInferenceStartResult as Bx, BoardSizeSchema as By, validateBoardActionParams as C, NodeInvokeInputEventSchema as CC, ApprovalTerminalReasonSchema as CS, SkillsProposalApplyResultSchema as C_, WorktreesRemoveParams as Ca, BoardWidgetResizeOpSchema as Cb, TasksGetResult as Cc, ExecApprovalGetParamsSchema as Cd, CronListParamsSchema as Cf, AgentsDeleteParams as Cg, UsersSetAvatarResultSchema as Ch, validateToolsInvokeParams as Ci, SessionsDispatchParamsSchema as Cl, TalkSessionAppendAudioParamsSchema as Cm, validateSecretsResolveParams as Cn, WorkerTranscriptCommitParams as Co, ConfigSchemaResponse as Cp, validateSkillsProposalInspectParams as Cr, PluginsSessionActionResult as Cs, validateExecApprovalGetParams as Ct, WebPushVapidPublicKeyParamsSchema as Cu, AgentIdentityParams as Cv, WorkerInferenceCancelResponseFrame as Cx, BoardCommandEventSchema as Cy, validateBoardPromptAuthorizeParams as D, NodeInvokeProgressParamsSchema as DC, DeniedApprovalSnapshotSchema as DS, SkillsProposalInspectParamsSchema as D_, WorktreesRestoreParams as Da, buildMissingScopeErrorDetails as Db, TasksListResult as Dc, ExecApprovalResolveParamsSchema as Dd, CronStatusParamsSchema as Df, AgentsFileEntry as Dg, UsersSetDisplayNameResultSchema as Dh, validateUpdateStatusParams as Di, SessionsReclaimParamsSchema as Dl, TalkSessionCancelTurnParamsSchema as Dm, validateSessionDiscussionInfoResult as Dn, WorkerTranscriptCommitResponseFrame as Do, UpdateRunParams as Dp, validateSkillsProposalsListParams as Dr, PluginsSetEnabledResult as Ds, validateExecApprovalsNodeGetParams as Dt, PROTOCOL_VERSION as Du, AgentParamsSchema as Dv, WorkerInferenceErrorReason as Dx, BoardEventParams as Dy, validateBoardGetParams as E, NodeInvokeProgressParams as EC, DeniedApprovalSnapshot as ES, SkillsProposalInspectParams as E_, WorktreesRemoveResultSchema as Ea, MissingScopeErrorDetailsSchema as Eb, TasksListParamsSchema as Ec, ExecApprovalResolveParams as Ed, CronRunsParamsSchema as Ef, AgentsDeleteResultSchema as Eg, UsersSetDisplayNameResult as Eh, validateUpdateRunParams as Ei, SessionsReclaimParams as El, TalkSessionCancelTurnParams as Em, validateSessionDiscussionInfoParams as En, WorkerTranscriptCommitRequestFrameSchema as Eo, ConfigSetParamsSchema as Ep, validateSkillsProposalUpdateParams as Er, PluginsSetEnabledParamsSchema as Es, validateExecApprovalsGetParams as Et, MIN_PROBE_PROTOCOL_VERSION as Eu, AgentIdentityResultSchema as Ev, WorkerInferenceContext as Ex, BoardDataReadParamsSchema as Ey, validateChannelsStatusParams as F, NodePairRejectParams as FC, PluginApprovalPresentationSchema as FS, SkillsProposalRequestRevisionResultSchema as F_, WORKER_PROTOCOL_METHODS as Fa, EventFrameSchema as Fb, TaskSuggestionsAcceptParams as Fc, EnvironmentStatusSchema as Fd, SystemAgentChatParams as Ff, AgentsFilesListResult as Fg, AuditActivityAgentRunV1Schema as Fh, validateUsersSetDisplayNameParams as Fi, QuestionGetParams as Fl, TalkSessionJoinParamsSchema as Fm, validateSessionsCatalogListParams as Fn, WORKER_PROTOCOL_MAX_PAYLOAD_BYTES as Fo, CommandsListResultSchema as Fp, validateSkillsUploadCommitParams as Fr, TerminalAckResult as Fs, validateGatewaySuspendStatusParams as Ft, ChatSendParamsSchema as Fu, ConversationSendParams as Fv, WorkerInferenceStartParams as Fx, BoardOp as Fy, validateConfigApplyParams as G, NodePendingEnqueueParamsSchema as GC, validateTerminalAttachParams as GS, SkillsSearchParamsSchema as G_, WorkerAdmissionResponseFrameSchema as Ga, ShutdownEvent as Gb, TaskSuggestionsDismissResult as Gc, EnvironmentsDestroyResultSchema as Gd, SystemAgentSetupAuthStartParams as Gf, AgentsUpdateParams as Gg, AuditActivityOutboundMessageV1Schema as Gh, validateWizardNextParams as Gi, QuestionRecord as Gl, TalkSessionTurnParamsSchema as Gm, validateSessionsDescribeParams as Gn, WizardStartParamsSchema as Go, ChannelsStatusResultSchema as Gp, validateTalkCatalogParams as Gr, TerminalEvent as Gs, validateNodeListParams as Gt, GatewaySuspendBlockerSchema as Gu, ConversationTurnReply as Gv, validateWorkerInferenceEventFrame as Gx, BoardTabDeleteOpSchema as Gy, validateChatSendParams as H, NodePendingDrainResult as HC, TerminalApprovalSnapshot as HS, SkillsProposalsListResult as H_, WorkerAdmissionHandshake as Ha, RequestFrameSchema as Hb, TaskSuggestionsCreateResultSchema as Hc, EnvironmentsDestroyParams as Hd, SystemAgentSetupActivateParamsSchema as Hf, AgentsListParamsSchema as Hg, AuditActivityListResult as Hh, validateWebPushUnsubscribeParams as Hi, QuestionListResultSchema as Hl, TalkSessionSubmitToolResultParams as Hm, validateSessionsCompactionRestoreParams as Hn, WizardNextResult as Ho, ChannelsStatusParams as Hp, validateSystemChangesListParams as Hr, TerminalCloseParamsSchema as Hs, validateNodeInvokeParams as Ht, LogsTailResult as Hu, ConversationTurnCancelResultSchema as Hv, WorkerInferenceTerminalOutcome as Hx, BoardSnapshotSchema as Hy, validateChannelsStopParams as I, NodePairRejectParamsSchema as IC, PluginApprovalSeverity as IS, SkillsProposalReviseParams as I_, WORKER_RPC_SET_VERSION as Ia, GATEWAY_SERVER_CAPS as Ib, TaskSuggestionsAcceptParamsSchema as Ic, EnvironmentSummary as Id, SystemAgentChatParamsSchema as If, AgentsFilesListResultSchema as Ig, AuditActivityEventV1 as Ih, validateUsersSetDisplayNameResult as Ii, QuestionGetParamsSchema as Il, TalkSessionJoinResult as Im, validateSessionsCatalogReadParams as In, WorkerAdmissionFailureReasonSchema as Io, TalkSessionAcknowledgeMarkParams as Ip, validateSystemAgentChatHistoryParams as Ir, TerminalAckResultSchema as Is, validateLogsTailParams as It, ChatToolTitlesParams as Iu, ConversationSendParamsSchema as Iv, WorkerInferenceStartRequestFrame as Ix, BoardOpSchema as Iy, validateConfigSchemaLookupParams as J, NodePluginToolDescriptor as JC, validateTerminalOpenParams as JS, SkillsSecurityVerdictsParams as J_, WorkerConnectRequestFrameSchema as Ja, TickEventSchema as Jb, TaskSuggestionsListParamsSchema as Jc, EnvironmentsListResult as Jd, SystemAgentSetupAuthStartResultSchema as Jf, AgentsUpdateResultSchema as Jg, ArtifactSummary as Jh, validateWorkerAdmissionHandshake as Ji, QuestionRequestParamsSchema as Jl, TalkSpeakParams as Jm, validateSessionsFilesGetParams as Jn, WizardStatusParams as Jo, TalkAgentControlResult as Jp, validateTalkClientCreateResult as Jr, TerminalExitEventSchema as Js, validateNodePairRejectParams as Jt, GatewaySuspendPrepareParamsSchema as Ju, ConversationTurnResultSchema as Jv, validateWorkerInferenceTerminalOutcome as Jx, BoardTabUpdateOpSchema as Jy, validateConfigGetParams as K, NodePendingEnqueueResult as KC, validateTerminalCloseParams as KS, SkillsSearchResult as K_, WorkerConnectParams as Ka, ShutdownEventSchema as Kb, TaskSuggestionsDismissResultSchema as Kc, EnvironmentsListParams as Kd, SystemAgentSetupAuthStartParamsSchema as Kf, AgentsUpdateParamsSchema as Kg, AuditActivityToolActionV1 as Kh, validateWizardStartParams as Ki, QuestionRecordSchema as Kl, TalkSessionTurnResult as Km, validateSessionsDiffParams as Kn, WizardStartResult as Ko, ChannelsStopParams as Kp, validateTalkClientCloseParams as Kr, TerminalEventSchema as Ks, validateNodePairApproveParams as Kt, GatewaySuspendPrepareBusyResultSchema as Ku, ConversationTurnReplySchema as Kv, validateWorkerInferenceStartParams as Kx, BoardTabIdSchema as Ky, validateChatAbortParams as L, NodePairRemoveParams as LC, PluginApprovalSeveritySchema as LS, SkillsProposalReviseParamsSchema as L_, WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE as La, GatewayFrame as Lb, TaskSuggestionsAcceptResult as Lc, EnvironmentSummarySchema as Ld, SystemAgentChatQuestion as Lf, AgentsFilesSetParams as Lg, AuditActivityEventV1Schema as Lh, validateWakeParams as Li, QuestionGetResult as Ll, TalkSessionJoinResultSchema as Lm, validateSessionsCleanupParams as Ln, WorkerProtocolCloseReasonSchema as Lo, TalkSessionAcknowledgeMarkParamsSchema as Lp, validateSystemAgentChatParams as Lr, TerminalAttachParams as Ls, validateMessageActionParams as Lt, ChatToolTitlesParamsSchema as Lu, ConversationSendResult as Lv, WorkerInferenceStartRequestFrameSchema as Lx, BoardPromptAuthorizeParams as Ly, validateBoardWidgetPutParams as M, NodePairApproveParamsSchema as MC, PendingApprovalSnapshot as MS, SkillsProposalRequestRevisionParams as M_, WORKER_PROTOCOL_MAX_FEATURES as Ma, ErrorShape as Mb, TaskSuggestionResolution as Mc, ExecApprovalsSetParamsSchema as Md, SystemAgentChatHistoryResultSchema as Mf, AgentsFilesGetResultSchema as Mg, AuditListResult as Mh, validateUsersSelfResult as Mi, Question as Ml, TalkSessionCreateResult as Mm, validateSessionsBranchesSwitchParams as Mn, WorkerTranscriptMessageSchema as Mo, CommandsListParams as Mp, validateSkillsUpdateParams as Mr, PluginsUninstallParamsSchema as Ms, validateFsListDirResult as Mt, ChatInjectParamsSchema as Mu, ConversationListParamsSchema as Mv, WorkerInferenceModelRefSchema as Mx, BoardLegacyEventParamsSchema as My, validateChannelsLogoutParams as N, NodePairListParams as NC, PendingApprovalSnapshotSchema as NS, SkillsProposalRequestRevisionParamsSchema as N_, WORKER_PROTOCOL_MAX_FEATURE_LENGTH as Na, ErrorShapeSchema as Nb, TaskSuggestionResolutionSchema as Nc, ExecApprovalsSnapshot as Nd, SystemAgentChatHistoryTurn as Nf, AgentsFilesListParams as Ng, AuditListResultSchema as Nh, validateUsersSetAvatarParams as Ni, QuestionAnswers as Nl, TalkSessionCreateResultSchema as Nm, validateSessionsCatalogArchiveParams as Nn, WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH as No, CommandsListParamsSchema as Np, validateSkillsUploadBeginParams as Nr, PluginsUninstallResult as Ns, validateGatewaySuspendPrepareParams as Nt, ChatMetadataParams as Nu, ConversationListResult as Nv, WorkerInferenceOptions as Nx, BoardMcpAppDescriptor as Ny, validateBoardUpdateParams as O, NodeInvokeResultParams as OC, ExecApprovalPresentation as OS, SkillsProposalInspectResult as O_, WorktreesRestoreParamsSchema as Oa, errorShape as Ob, TasksListResultSchema as Oc, ExecApprovalsGetParams as Od, CronUpdateParamsSchema as Of, AgentsFileEntrySchema as Og, AuditEvent as Oh, validateUsersLinkEmailParams as Oi, SessionsReclaimResult as Ol, TalkSessionCloseParams as Om, validateSessionDiscussionOpenParams as On, WorkerTranscriptCommitResponseFrameSchema as Oo, UpdateRunParamsSchema as Op, validateSkillsSearchParams as Or, PluginsSetEnabledResultSchema as Os, validateExecApprovalsNodeSetParams as Ot, ChatEvent as Ou, AgentWaitParams as Ov, WorkerInferenceErrorShape as Ox, BoardEventParamsSchema as Oy, validateChannelsStartParams as P, NodePairListParamsSchema as PC, PluginApprovalPresentation as PS, SkillsProposalRequestRevisionResult as P_, WORKER_PROTOCOL_MAX_METHOD_LENGTH as Pa, EventFrame as Pb, TaskSuggestionSchema as Pc, EnvironmentStatus as Pd, SystemAgentChatHistoryTurnSchema as Pf, AgentsFilesListParamsSchema as Pg, AuditActivityAgentRunV1 as Ph, validateUsersSetAvatarResult as Pi, QuestionAnswersSchema as Pl, TalkSessionJoinParams as Pm, validateSessionsCatalogContinueParams as Pn, WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH as Po, CommandsListResult as Pp, validateSkillsUploadChunkParams as Pr, PluginsUninstallResultSchema as Ps, validateGatewaySuspendResumeParams as Pt, ChatMetadataParamsSchema as Pu, ConversationListResultSchema as Pv, WorkerInferenceOptionsSchema as Px, BoardMcpAppDescriptorSchema as Py, validateConnectParams as Q, NodePresenceActivityPayload as QC, validateTerminalUploadResult as QS, SkillsSkillCardParams as Q_, WorkerHeartbeatRequestFrame as Qa, UiCommandParamsSchema as Qb, SystemInfoParamsSchema as Qc, EnvironmentsStatusResult as Qd, SystemAgentSetupDetectResultSchema as Qf, ModelsProbeParams as Qg, ArtifactsDownloadResult as Qh, validateWorkerTranscriptCommitParams as Qi, QuestionRequestResultSchema as Ql, TtsSpeakParams as Qm, validateSessionsForkParams as Qn, WizardStep as Qo, TalkCatalogResult as Qp, validateTalkClientToolCallResult as Qr, TerminalListResultSchema as Qs, validateNodePendingEnqueueParams as Qt, GatewaySuspendResumeParams as Qu, SendParamsSchema as Qv, AllowedApprovalSnapshot as Qx, BoardUpdateParamsSchema as Qy, validateChatHistoryParams as R, NodePairRemoveParamsSchema as RC, SessionApprovalEvent as RS, SkillsProposalUpdateParams as R_, WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES as Ra, GatewayFrameSchema as Rb, TaskSuggestionsAcceptResultSchema as Rc, EnvironmentsCreateParams as Rd, SystemAgentChatQuestionSchema as Rf, AgentsFilesSetParamsSchema as Rg, AuditActivityInboundMessageV1 as Rh, validateWebLoginStartParams as Ri, QuestionGetResultSchema as Rl, TalkSessionOkResult as Rm, validateSessionsCompactParams as Rn, WizardCancelParams as Ro, ChannelsLogoutParams as Rp, validateSystemAgentSetupActivateParams as Rr, TerminalAttachParamsSchema as Rs, validateModelsListParams as Rt, ChatToolTitlesResult as Ru, ConversationSendResultSchema as Rv, WorkerInferenceStartResponseFrame as Rx, BoardPromptAuthorizeParamsSchema as Ry, validateAuditListParams as S, NodeInvokeInputEvent as SC, ApprovalTerminalReason as SS, SkillsProposalApplyResult as S_, WorktreesListResultSchema as Sa, BoardWidgetRemoveOpSchema as Sb, TasksGetParamsSchema as Sc, ExecApprovalGetParams as Sd, CronJobSchema as Sf, AgentsCreateResultSchema as Sg, UsersSetAvatarResult as Sh, validateToolsEffectiveParams as Si, SessionsDispatchParams as Sl, TalkSessionAppendAudioParams as Sm, validateRequestFrame as Sn, WorkerTranscriptCommitErrorShapeSchema as So, ConfigSchemaParamsSchema as Sp, validateSkillsProposalCreateParams as Sr, PluginsSessionActionParamsSchema as Ss, validateEnvironmentsStatusParams as St, WebPushVapidPublicKeyParams as Su, AgentEventSchema as Sv, WorkerInferenceCancelRequestFrameSchema as Sx, BoardCommandEvent as Sy, validateBoardEventParams as T, NodeInvokeParamsSchema as TC, CancelledApprovalSnapshotSchema as TS, SkillsProposalCreateParamsSchema as T_, WorktreesRemoveResult as Ta, GatewayErrorDetailsSchema as Tb, TasksListParams as Tc, ExecApprovalRequestParamsSchema as Td, CronRunParamsSchema as Tf, AgentsDeleteResult as Tg, UsersSetDisplayNameParamsSchema as Th, validateUiCommandParams as Ti, SessionsDispatchResultSchema as Tl, TalkSessionCancelOutputParamsSchema as Tm, validateSendParams as Tn, WorkerTranscriptCommitRequestFrame as To, ConfigSetParams as Tp, validateSkillsProposalReviseParams as Tr, PluginsSetEnabledParams as Ts, validateExecApprovalResolveParams as Tt, MIN_NODE_PROTOCOL_VERSION as Tu, AgentIdentityResult as Tv, WorkerInferenceCancelResult as Tx, BoardDataReadParams as Ty, validateChatToolTitlesParams as U, NodePendingDrainResultSchema as UC, TerminalApprovalSnapshotSchema as US, SkillsProposalsListResultSchema as U_, WorkerAdmissionHandshakeSchema as Ua, ResponseFrame as Ub, TaskSuggestionsDismissParams as Uc, EnvironmentsDestroyParamsSchema as Ud, SystemAgentSetupActivateResult as Uf, AgentsListResult as Ug, AuditActivityListResultSchema as Uh, validateWebPushVapidPublicKeyParams as Ui, QuestionOption as Ul, TalkSessionSubmitToolResultParamsSchema as Um, validateSessionsCreateParams as Un, WizardNextResultSchema as Uo, ChannelsStatusParamsSchema as Up, validateSystemInfoParams as Ur, TerminalDataEvent as Us, validateNodeInvokeProgressParams as Ut, LogsTailResultSchema as Uu, ConversationTurnParams as Uv, WorkerInferenceTerminalParams as Ux, BoardTab as Uy, validateChatMetadataParams as V, NodePendingDrainParamsSchema as VC, SessionApprovalReplaySchema as VS, SkillsProposalsListParamsSchema as V_, WorkerAdmissionFailureReason as Va, RequestFrame as Vb, TaskSuggestionsCreateResult as Vc, EnvironmentsCreateResultSchema as Vd, SystemAgentSetupActivateParams as Vf, AgentsListParams as Vg, AuditActivityListParamsSchema as Vh, validateWebPushTestParams as Vi, QuestionListResult as Vl, TalkSessionSteerParamsSchema as Vm, validateSessionsCompactionListParams as Vn, WizardNextParamsSchema as Vo, ChannelsStartParamsSchema as Vp, validateSystemAgentSetupVerifyParams as Vr, TerminalCloseParams as Vs, validateNodeEventParams as Vt, LogsTailParamsSchema as Vu, ConversationTurnCancelResult as Vv, WorkerInferenceTerminalFrame as Vx, BoardSnapshot as Vy, validateCommandsListParams as W, NodePendingEnqueueParams as WC, isWellFormedApprovalId as WS, SkillsSearchParams as W_, WorkerAdmissionResponseFrame as Wa, ResponseFrameSchema as Wb, TaskSuggestionsDismissParamsSchema as Wc, EnvironmentsDestroyResult as Wd, SystemAgentSetupActivateResultSchema as Wf, AgentsListResultSchema as Wg, AuditActivityOutboundMessageV1 as Wh, validateWizardCancelParams as Wi, QuestionOptionSchema as Wl, TalkSessionTurnParams as Wm, validateSessionsDeleteParams as Wn, WizardStartParams as Wo, ChannelsStatusResult as Wp, validateSystemInfoResult as Wr, TerminalDataEventSchema as Ws, validateNodeInvokeResultParams as Wt, GatewaySuspendBlocker as Wu, ConversationTurnParamsSchema as Wv, validateWorkerInferenceCancelParams as Wx, BoardTabCreateOpSchema as Wy, validateConfigSchemaParams as X, NodePluginToolsUpdateParams as XC, validateTerminalTextParams as XS, SkillsSecurityVerdictsResult as X_, WorkerHeartbeatParams as Xa, UiCommand as Xb, TaskSuggestionsListResultSchema as Xc, EnvironmentsStatusParams as Xd, SystemAgentSetupDetectParamsSchema as Xf, AuthProbeStatusSchema as Xg, ArtifactsDownloadParams as Xh, validateWorkerHeartbeatParams as Xi, QuestionRequestQuestionSchema as Xl, TalkSpeakResult as Xm, validateSessionsFilesRevealParams as Xn, WizardStatusResult as Xo, TalkCatalogParams as Xp, validateTalkClientSteerParams as Xr, TerminalInputParamsSchema as Xs, validateNodePendingAckParams as Xt, GatewaySuspendPrepareResult as Xu, PollParams as Xv, validateApprovalHistoryResult as Xx, BoardTicketEventParamsSchema as Xy, validateConfigSchemaLookupResult as Y, NodePluginToolDescriptorSchema as YC, validateTerminalResizeParams as YS, SkillsSecurityVerdictsParamsSchema as Y_, WorkerErrorShape as Ya, UiClosePaneCommandSchema as Yb, TaskSuggestionsListResult as Yc, EnvironmentsListResultSchema as Yd, SystemAgentSetupDetectParams as Yf, AuthProbeStatus as Yg, ArtifactSummarySchema as Yh, validateWorkerConnectRequestFrame as Yi, QuestionRequestQuestion as Yl, TalkSpeakParamsSchema as Ym, validateSessionsFilesListParams as Yn, WizardStatusParamsSchema as Yo, TalkAgentControlResultSchema as Yp, validateTalkClientMutationResult as Yr, TerminalInputParams as Ys, validateNodePairRemoveParams as Yt, GatewaySuspendPrepareReadyResultSchema as Yu, MessageActionParamsSchema as Yv, validateApprovalGetResult as Yx, BoardTabsReorderOpSchema as Yy, validateConfigSetParams as Z, NodePluginToolsUpdateParamsSchema as ZC, validateTerminalUploadParams as ZS, SkillsSecurityVerdictsResultSchema as Z_, WorkerHeartbeatParamsSchema as Za, UiCommandParams as Zb, SystemInfoParams as Zc, EnvironmentsStatusParamsSchema as Zd, SystemAgentSetupDetectResult as Zf, ModelsListParamsSchema as Zg, ArtifactsDownloadParamsSchema as Zh, validateWorkerLiveEventParams as Zi, QuestionRequestResult as Zl, TalkSpeakResultSchema as Zm, validateSessionsFilesSetParams as Zn, WizardStatusResultSchema as Zo, TalkCatalogParamsSchema as Zp, validateTalkClientToolCallParams as Zr, TerminalListResult as Zs, validateNodePendingDrainParams as Zt, GatewaySuspendPrepareResultSchema as Zu, PollParamsSchema as Zv, validateApprovalResolveResult as Zx, BoardUpdateParams as Zy, validateApprovalResolveParams as _, ValidationError as _C, ApprovalResolveParamsSchema as _S, SkillsDetailResultSchema as __, WorktreesGcResult as _a, BoardWidgetNameSchema as _b, TasksCancelParams as _c, DevicePairListParams as _d, CronUpdateParams as _f, AgentSummary as _g, UsersSelfParamsSchema as _h, validateTaskSuggestionsListParams as _i, SessionDiscussionState as _l, TalkConfigParamsSchema as _m, validateQuestionGetParams as _n, WorkerLiveEventSchema as _o, ConfigPatchParams as _p, validateSkillsCuratorActionParams as _r, PluginsSearchParams as _s, validateDeviceTokenRevokeParams as _t, WebPushSubscribeParamsSchema as _u, ToolsEffectiveResult as _v, WORKER_INFERENCE_METHODS as _x, BoardCanvasDocumentSourceSchema as _y, validateAgentsCreateParams as a, readMissingScopeError as aC, ApprovalGetParamsSchema as aS, SkillsBinsResult as a_, WorktreeBranch as aa, BoardWidgetContent as ab, TerminalSessionInfo as ac, GatewaySuspendStatusResult as ad, WorkerTunnelStatusSchema as af, AgentsWorkspaceEntry as ag, WebLoginWaitParamsSchema as ah, validateTalkSessionCancelOutputParams as ai, StateVersion as al, TalkClientCreateResultSchema as am, validatePluginsInstallParams as an, WorkerLiveEventErrorDetails as ao, SystemChangeKind as ap, validateSessionsMessagesUnsubscribeParams as ar, PluginsInstallParams as as, validateCronListParams as at, QuestionResolvedEvent as au, SkillsUpdateParamsSchema as av, NodeSkillDescriptorSchema as aw, UiSidebarCommandSchema as ax, MemoryMigrationProviderPlan as ay, validateArtifactsListParams as b, NodeEventResult as bC, ApprovalSnapshot as bS, SkillsProposalActionParams as b_, WorktreesListParamsSchema as ba, BoardWidgetPutParams as bb, TasksCancelResultSchema as bc, DevicePairSetupCodeParams as bd, CronDeclarativeAddResultSchema as bf, AgentsCreateParamsSchema as bg, UsersSetAvatarParams as bh, validateTasksListParams as bi, SessionPlacementSchema as bl, TalkEventSchema as bm, validateQuestionResolveParams as bn, WorkerTranscriptCommitErrorReasonSchema as bo, ConfigSchemaLookupResultSchema as bp, validateSkillsInstallParams as br, PluginsSearchResultSchema as bs, validateEnvironmentsDestroyParams as bt, WebPushUnsubscribeParams as bu, ToolsInvokeResult as bv, WorkerInferenceCancelParams as bx, BoardChatDockSchema as by, validateAgentsFilesListParams as c, SystemAgentSessionInvalidatedErrorDetails as cC, ApprovalHistoryParams as cS, SkillsCuratorActionResult as c_, WorktreeRecordSchema as ca, BoardWidgetDeclaredSchema as cb, TerminalTextParamsSchema as cc, GatewaySuspendTaskBlocker as cd, CronDeclarativeAddResult as cf, AgentsWorkspaceFileSchema as cg, UsersLinkEmailParams as ch, validateTalkSessionCreateParams as ci, SessionDiscussionInfoParams as cl, TalkClientSteerParams as cm, validatePluginsSearchParams as cn, WorkerLiveEventErrorShapeSchema as co, SystemChangeSourceSchema as cp, validateSessionsPreviewParams as cr, PluginsInstallResultSchema as cs, validateCronRunsParams as ct, QuestionStatus as cu, SkillsUploadChunkParams as cv, SkillsProposalHistoryScanParamsSchema as cx, MigrationsMemoryApplyResult as cy, validateAgentsUpdateParams as d, ClawHubTrustErrorCodes as dC, ApprovalHistoryResultSchema as dS, SkillsCuratorStatusParamsSchema as d_, WorktreesBranchesResult as da, BoardWidgetHtmlContentSchema as db, TerminalUploadParams as dc, FsDirEntrySchema as dd, CronListParams as df, AgentsWorkspaceGetResult as dg, UsersLinkEmailResultSchema as dh, validateTalkSessionSubmitToolResultParams as di, SessionDiscussionInfoResultSchema as dl, TalkClientToolCallParamsSchema as dm, validatePluginsSetEnabledParams as dn, WorkerLiveEventRequestFrame as do, SystemChangesListResult as dp, validateSessionsResolveParams as dr, PluginsListResult as ds, validateDevicePairApproveParams as dt, QuestionWaitAnswerParamsSchema as du, SkillsUploadCommitParamsSchema as dv, SkillsProposalHistoryStatusParams as dx, BOARD_CRON_JOB_ID_MAX_LENGTH as dy, GatewayErrorDetailCodes as eC, ApprovalAllowDecision as eS, ModelsProbeResult as e_, validateWorktreesCreateParams as ea, BoardWidget as eb, TerminalOpenParamsSchema as ec, GatewaySuspendResumeResult as ed, WorkerEnvironmentMetadata as ef, ArtifactsGetParamsSchema as eg, TtsSpeakResult as eh, validateTalkConfigParams as ei, SystemInfoResultSchema as el, TalkClientCloseParams as em, validateNodePresenceActivityPayload as en, WorkerHeartbeatResponseFrame as eo, SystemAgentSetupVerifyParamsSchema as ep, validateSessionsGroupsListParams as er, PluginCatalogEntry as es, validateConversationSendParams as et, QuestionRequestedEventSchema as eu, SkillsSkillCardResult as ev, NodePresenceAlivePayload as ew, UiCommandResultSchema as ex, WakeParamsSchema as ey, validateAgentsWorkspaceGetParams as f, ClawHubTrustErrorDetails as fC, ApprovalKind as fS, SkillsCuratorStatusResult as f_, WorktreesBranchesResultSchema as fa, BoardWidgetMaterializedContent as fb, TerminalUploadParamsSchema as fc, FsListDirParams as fd, CronRemoveParams as ff, AgentsWorkspaceGetResultSchema as fg, UsersListParams as fh, validateTalkSessionTurnParams as fi, SessionDiscussionInfoSchema as fl, TalkClientToolCallResult as fm, validatePluginsUiDescriptorsParams as fn, WorkerLiveEventRequestFrameSchema as fo, SystemChangesListResultSchema as fp, validateSessionsRewindParams as fr, PluginsListResultSchema as fs, validateDevicePairListParams as ft, QuestionWaitAnswerResult as fu, ToolsCatalogParams as fv, SkillsProposalHistoryStatusParamsSchema as fx, BOARD_CRON_TRIGGER_PREFIX as fy, validateApprovalPresentation as g, ProtocolValidator as gC, ApprovalResolveParams as gS, SkillsDetailResult as g_, WorktreesGcParamsSchema as ga, BoardWidgetMoveOpSchema as gb, TaskSummarySchema as gc, DevicePairApproveParams as gd, CronStatusParams as gf, AgentsWorkspaceListResultSchema as gg, UsersSelfParams as gh, validateTaskSuggestionsDismissParams as gi, SessionDiscussionOpenResultSchema as gl, TalkConfigParams as gm, validatePushTestParams as gn, WorkerLiveEventResultSchema as go, ConfigGetParamsSchema as gp, validateSkillsBinsParams as gr, PluginsRefreshResultSchema as gs, validateDevicePairSetupCodeParams as gt, WebPushSubscribeParams as gu, ToolsEffectiveParamsSchema as gv, WORKER_INFERENCE_MAX_OUTPUT_TOKENS as gx, BoardCanvasDocumentSource as gy, validateApprovalHistoryParams as h, readClawHubTrustErrorDetails as hC, ApprovalPresentationSchema as hS, SkillsDetailParamsSchema as h_, WorktreesGcParams as ha, BoardWidgetMcpAppPutContentSchema as hb, TaskSummary as hc, FsListDirResultSchema as hd, CronRunsParams as hf, AgentsWorkspaceListResult as hg, UsersListResultSchema as hh, validateTaskSuggestionsCreateParams as hi, SessionDiscussionOpenResult as hl, TalkClientTranscriptParamsSchema as hm, validatePollParams as hn, WorkerLiveEventResult as ho, ConfigGetParams as hp, validateSessionsUsageParams as hr, PluginsRefreshResult as hs, validateDevicePairRenameParams as ht, PushTestResultSchema as hu, ToolsEffectiveParams as hv, WORKER_INFERENCE_MAX_CONTEXT_MESSAGES as hx, BoardActionParamsSchema as hy, validateAgentWaitParams as i, isMcpAppViewExpiredError as iC, ApprovalGetParams as iS, SkillsBinsParams as i_, validateWorktreesRestoreParams as ia, BoardWidgetAppViewResultSchema as ib, TerminalResizeParamsSchema as ic, GatewaySuspendStatusReadyResultSchema as id, WorkerTunnelStatus as if, ArtifactsListResult as ig, WebLoginWaitParams as ih, validateTalkSessionAppendAudioParams as ii, SnapshotSchema as il, TalkClientCreateResult as im, validatePluginApprovalResolveParams as in, WorkerLiveEvent as io, SystemChangeEntrySchema as ip, validateSessionsMessagesSubscribeParams as ir, PluginSearchResultEntrySchema as is, validateCronGetParams as it, QuestionResolveResultSchema as iu, SkillsUpdateParams as iv, NodeSkillDescriptor as iw, UiPanelCommandSchema as ix, MemoryMigrationItem as iy, validateBoardWidgetGrantParams as j, NodePairApproveParams as jC, ExpiredApprovalSnapshotSchema as jS, SkillsProposalRecordResultSchema as j_, WORKER_PROTOCOL_FEATURES as ja, ConnectParamsSchema as jb, TaskSuggestionEventSchema as jc, ExecApprovalsSetParams as jd, SystemAgentChatHistoryResult as jf, AgentsFilesGetResult as jg, AuditListParamsSchema as jh, validateUsersSelfParams as ji, isCloudWorkerPlacementState as jl, TalkSessionCreateParamsSchema as jm, validateSessionsBranchesListParams as jn, WorkerTranscriptMessage as jo, CommandEntry as jp, validateSkillsStatusParams as jr, PluginsUninstallParams as js, validateFsListDirParams as jt, ChatInjectParams as ju, ConversationListParams as jv, WorkerInferenceModelRef as jx, BoardGetParamsSchema as jy, validateBoardWidgetAppViewParams as k, NodeListParams as kC, ExecApprovalPresentationSchema as kS, SkillsProposalInspectResultSchema as k_, WORKER_HEARTBEAT_INTERVAL_MS as ka, missingScopeErrorShape as kb, TaskSuggestion as kc, ExecApprovalsGetParamsSchema as kd, SystemAgentChatHistoryParams as kf, AgentsFilesGetParams as kg, AuditEventSchema as kh, validateUsersLinkEmailResult as ki, SessionsReclaimResultSchema as kl, TalkSessionCloseParamsSchema as km, validateSessionDiscussionOpenResult as kn, WorkerTranscriptCommitResult as ko, UpdateStatusParams as kp, validateSkillsSecurityVerdictsParams as kr, PluginsUiDescriptorsParamsSchema as ks, validateExecApprovalsNodeSnapshot as kt, ChatEventSchema as ku, ConversationListItem as kv, WorkerInferenceEventFrame as kx, BoardFocusTabCommandSchema as ky, validateAgentsFilesSetParams as l, buildSystemAgentSessionInvalidatedErrorDetails as lC, ApprovalHistoryParamsSchema as lS, SkillsCuratorActionResultSchema as l_, WorktreesBranchesParams as la, BoardWidgetGrantParams as lb, TerminalTextResult as lc, GatewaySuspendTaskBlockerSchema as ld, CronGetParams as lf, AgentsWorkspaceGetParams as lg, UsersLinkEmailParamsSchema as lh, validateTalkSessionJoinParams as li, SessionDiscussionInfoParamsSchema as ll, TalkClientSteerParamsSchema as lm, validatePluginsSessionActionParams as ln, WorkerLiveEventParams as lo, SystemChangesListParams as lp, validateSessionsReclaimParams as lr, PluginsListParams as ls, validateCronStatusParams as lt, QuestionStatusSchema as lu, SkillsUploadChunkParamsSchema as lv, SkillsProposalHistoryScanResult as lx, MigrationsMemoryPlanParamsSchema as ly, validateApprovalGetParams as m, isClawHubTrustErrorCode as mC, ApprovalPresentation as mS, SkillsDetailParams as m_, WorktreesCreateParamsSchema as ma, BoardWidgetMcpAppContentSchema as mb, TerminalUploadResultSchema as mc, FsListDirResult as md, CronRunParams as mf, AgentsWorkspaceListParamsSchema as mg, UsersListResult as mh, validateTaskSuggestionsAcceptParams as mi, SessionDiscussionOpenParamsSchema as ml, TalkClientTranscriptParams as mm, validatePluginsUninstallParams as mn, WorkerLiveEventResponseFrameSchema as mo, ConfigApplyParamsSchema as mp, validateSessionsSendParams as mr, PluginsRefreshParamsSchema as ms, validateDevicePairRemoveParams as mt, PushTestParamsSchema as mu, ToolsCatalogResult as mv, validateSkillsProposalHistoryStatusParams as mx, BoardActionParams as my, validateAgentIdentityParams as n, McpAppViewExpiredErrorDetails as nC, ApprovalDecision as nS, ModelsProbeTargetResult as n_, validateWorktreesListParams as na, BoardWidgetAppViewParamsSchema as nb, TerminalOpenResultSchema as nc, GatewaySuspendStatusParams as nd, WorkerEnvironmentState as nf, ArtifactsListParams as ng, WebLoginStartParams as nh, validateTalkModeParams as ni, PresenceEntrySchema as nl, TalkClientCreateParams as nm, validateNodeSkillsUpdateParams as nn, WorkerHeartbeatResult as no, SystemAgentSetupVerifyResultSchema as np, validateSessionsGroupsRenameParams as nr, PluginCatalogInstallActionSchema as ns, validateConversationTurnParams as nt, QuestionResolveParamsSchema as nu, SkillsStatusParams as nv, NodePresenceAliveReason as nw, UiFocusCommandSchema as nx, validateMigrationsMemoryPlanParams as ny, validateAgentsDeleteParams as o, readMissingScopeErrorDetails as oC, ApprovalGetResult as oS, SkillsCuratorActionParams as o_, WorktreeBranchSchema as oa, BoardWidgetContentSchema as ob, TerminalSessionInfoSchema as oc, GatewaySuspendStatusResultSchema as od, CronAddParams as of, AgentsWorkspaceEntrySchema as og, UserProfile as oh, validateTalkSessionCancelTurnParams as oi, StateVersionSchema as ol, TalkClientMutationResult as om, validatePluginsListParams as on, WorkerLiveEventErrorDetailsSchema as oo, SystemChangeKindSchema as op, validateSessionsPatchParams as or, PluginsInstallParamsSchema as os, validateCronRemoveParams as ot, QuestionResolvedEventSchema as ou, SkillsUploadBeginParams as ov, NodeSkillsUpdateParams as ow, UiSplitCommandSchema as ox, MigrationProtocolSchemas as oy, validateAgentsWorkspaceListParams as p, buildClawHubTrustErrorDetails as pC, ApprovalKindSchema as pS, SkillsCuratorStatusResultSchema as p_, WorktreesCreateParams as pa, BoardWidgetMaterializedPutParams as pb, TerminalUploadResult as pc, FsListDirParamsSchema as pd, CronRunLogEntry as pf, AgentsWorkspaceListParams as pg, UsersListParamsSchema as ph, validateTalkSpeakParams as pi, SessionDiscussionOpenParams as pl, TalkClientToolCallResultSchema as pm, validatePluginsUiDescriptorsResult as pn, WorkerLiveEventResponseFrame as po, ConfigApplyParams as pp, validateSessionsSearchParams as pr, PluginsRefreshParams as ps, validateDevicePairRejectParams as pt, QuestionWaitAnswerResultSchema as pu, ToolsCatalogParamsSchema as pv, validateSkillsProposalHistoryScanParams as px, BOARD_WIDGET_TOOL_MAX_LENGTH as py, validateConfigPatchParams as q, NodePendingEnqueueResultSchema as qC, validateTerminalInputParams as qS, SkillsSearchResultSchema as q_, WorkerConnectRequestFrame as qa, TickEvent as qb, TaskSuggestionsListParams as qc, EnvironmentsListParamsSchema as qd, SystemAgentSetupAuthStartResult as qf, AgentsUpdateResult as qg, AuditActivityToolActionV1Schema as qh, validateWizardStatusParams as qi, QuestionRequestParams as ql, TalkSessionTurnResultSchema as qm, validateSessionsDispatchParams as qn, WizardStartResultSchema as qo, ChannelsStopParamsSchema as qp, validateTalkClientCreateParams as qr, TerminalExitEvent as qs, validateNodePairListParams as qt, GatewaySuspendPrepareParams as qu, ConversationTurnResult as qv, validateWorkerInferenceTerminalFrame as qx, BoardTabSchema as qy, validateAgentParams as r, MissingScopeErrorDetails as rC, ApprovalDecisionSchema as rS, ModelsProbeTargetResultSchema as r_, validateWorktreesRemoveParams as ra, BoardWidgetAppViewResult as rb, TerminalResizeParams as rc, GatewaySuspendStatusParamsSchema as rd, WorkerEnvironmentStateSchema as rf, ArtifactsListParamsSchema as rg, WebLoginStartParamsSchema as rh, validateTalkSessionAcknowledgeMarkParams as ri, Snapshot as rl, TalkClientCreateParamsSchema as rm, validatePluginApprovalRequestParams as rn, WorkerHelloOk as ro, SystemChangeEntry as rp, validateSessionsListParams as rr, PluginSearchPackageSchema as rs, validateCronAddParams as rt, QuestionResolveResult as ru, SkillsStatusParamsSchema as rv, NodePresenceAliveReasonSchema as rw, UiNavigateCommandSchema as rx, MAX_MEMORY_MIGRATION_ITEMS as ry, validateAgentsFilesGetParams as s, SystemAgentErrorDetailCodes as sC, ApprovalGetResultSchema as sS, SkillsCuratorActionParamsSchema as s_, WorktreeRecord as sa, BoardWidgetDeclared as sb, TerminalTextParams as sc, GatewaySuspendStatusRunningResultSchema as sd, CronAddResult as sf, AgentsWorkspaceFile as sg, UserProfileSchema as sh, validateTalkSessionCloseParams as si, SessionDiscussionInfo as sl, TalkClientMutationResultSchema as sm, validatePluginsRefreshParams as sn, WorkerLiveEventErrorShape as so, SystemChangeSource as sp, validateSessionsPluginPatchParams as sr, PluginsInstallResult as ss, validateCronRunParams as st, QuestionSchema as su, SkillsUploadBeginParamsSchema as sv, NodeSkillsUpdateParamsSchema as sw, SkillsProposalHistoryScanParams as sx, MigrationsMemoryApplyParamsSchema as sy, SessionsPatchResult as t, GatewayErrorDetails as tC, ApprovalAllowDecisionSchema as tS, ModelsProbeResultSchema as t_, validateWorktreesGcParams as ta, BoardWidgetAppViewParams as tb, TerminalOpenResult as tc, GatewaySuspendResumeResultSchema as td, WorkerEnvironmentMetadataSchema as tf, ArtifactsGetResult as tg, TtsSpeakResultSchema as th, validateTalkConfigResult as ti, PresenceEntry as tl, TalkClientCloseParamsSchema as tm, validateNodeRenameParams as tn, WorkerHeartbeatResponseFrameSchema as to, SystemAgentSetupVerifyResult as tp, validateSessionsGroupsPutParams as tr, PluginCatalogEntrySchema as ts, validateConversationTurnCancelParams as tt, QuestionResolveParams as tu, SkillsSkillCardResultSchema as tv, NodePresenceAlivePayloadSchema as tw, UiCommandSchema as tx, validateMigrationsMemoryApplyParams as ty, validateAgentsListParams as u, readSystemAgentSessionInvalidatedErrorDetails as uC, ApprovalHistoryResult as uS, SkillsCuratorStatusParams as u_, WorktreesBranchesParamsSchema as ua, BoardWidgetGrantParamsSchema as ub, TerminalTextResultSchema as uc, FsDirEntry as ud, CronJob as uf, AgentsWorkspaceGetParamsSchema as ug, UsersLinkEmailResult as uh, validateTalkSessionSteerParams as ui, SessionDiscussionInfoResult as ul, TalkClientToolCallParams as um, validatePluginsSessionActionResult as un, WorkerLiveEventParamsSchema as uo, SystemChangesListParamsSchema as up, validateSessionsResetParams as ur, PluginsListParamsSchema as us, validateCronUpdateParams as ut, QuestionWaitAnswerParams as uu, SkillsUploadCommitParams as uv, SkillsProposalHistoryScanResultSchema as ux, MigrationsMemoryPlanResult as uy, validateArtifactsDownloadParams as v, formatValidationErrors as vC, ApprovalResolveResult as vS, SkillsInstallParams as v_, WorktreesGcResultSchema as va, BoardWidgetPutContent as vb, TasksCancelParamsSchema as vc, DevicePairRejectParams as vd, CronAddParamsSchema as vf, AgentSummarySchema as vg, UsersSelfResult as vh, validateTasksCancelParams as vi, SessionDiscussionStateSchema as vl, TalkConfigResult as vm, validateQuestionListParams as vn, WorkerProtocolCloseReason as vo, ConfigPatchParamsSchema as vp, validateSkillsCuratorStatusParams as vr, PluginsSearchParamsSchema as vs, validateDeviceTokenRotateParams as vt, WebPushTestParams as vu, ToolsInvokeParams as vv, WORKER_INFERENCE_PROTOCOL_FEATURE as vx, BoardChangedEvent as vy, validateBoardDataReadParams as w, NodeInvokeParams as wC, CancelledApprovalSnapshot as wS, SkillsProposalCreateParams as w_, WorktreesRemoveParamsSchema as wa, BoardWidgetSchema as wb, TasksGetResultSchema as wc, ExecApprovalRequestParams as wd, CronRemoveParamsSchema as wf, AgentsDeleteParamsSchema as wg, UsersSetDisplayNameParams as wh, validateTtsSpeakParams as wi, SessionsDispatchResult as wl, TalkSessionCancelOutputParams as wm, validateSecretsResolveResult as wn, WorkerTranscriptCommitParamsSchema as wo, ConfigSchemaResponseSchema as wp, validateSkillsProposalRequestRevisionParams as wr, PluginsSessionActionResultSchema as ws, validateExecApprovalRequestParams as wt, MIN_CLIENT_PROTOCOL_VERSION as wu, AgentIdentityParamsSchema as wv, WorkerInferenceCancelResponseFrameSchema as wx, BoardCommandSchema as wy, validateAuditActivityListParams as x, NodeEventResultSchema as xC, ApprovalSnapshotSchema as xS, SkillsProposalActionParamsSchema as x_, WorktreesListResult as xa, BoardWidgetPutParamsSchema as xb, TasksGetParams as xc, DevicePairSetupCodeResult as xd, CronGetParamsSchema as xf, AgentsCreateResult as xg, UsersSetAvatarParamsSchema as xh, validateToolsCatalogParams as xi, SessionPlacementStateSchema as xl, TalkModeParams as xm, validateQuestionWaitAnswerParams as xn, WorkerTranscriptCommitErrorShape as xo, ConfigSchemaParams as xp, validateSkillsProposalActionParams as xr, PluginsSessionActionParams as xs, validateEnvironmentsListParams as xt, WebPushUnsubscribeParamsSchema as xu, AgentEvent as xv, WorkerInferenceCancelRequestFrame as xx, BoardCommand as xy, validateArtifactsGetParams as y, NodeEventParams as yC, ApprovalResolveResultSchema as yS, SkillsInstallParamsSchema as y_, WorktreesListParams as ya, BoardWidgetPutContentSchema as yb, TasksCancelResult as yc, DevicePairRenameParams as yd, CronAddResultSchema as yf, AgentsCreateParams as yg, UsersSelfResultSchema as yh, validateTasksGetParams as yi, SessionPlacement as yl, TalkConfigResultSchema as ym, validateQuestionRequestParams as yn, WorkerTranscriptCommitErrorReason as yo, ConfigSchemaLookupParamsSchema as yp, validateSkillsDetailParams as yr, PluginsSearchResult as ys, validateEnvironmentsCreateParams as yt, WebPushTestParamsSchema as yu, ToolsInvokeParamsSchema as yv, WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES as yx, BoardChangedEventSchema as yy, validateChatInjectParams as z, NodePendingAckParamsSchema as zC, SessionApprovalEventSchema as zS, SkillsProposalUpdateParamsSchema as z_, WORKER_TRANSCRIPT_MAX_CONTENT_PARTS as za, HelloOk as zb, TaskSuggestionsCreateParams as zc, EnvironmentsCreateParamsSchema as zd, SystemAgentChatResult as zf, AgentsFilesSetResult as zg, AuditActivityInboundMessageV1Schema as zh, validateWebLoginWaitParams as zi, QuestionListParams as zl, TalkSessionOkResultSchema as zm, validateSessionsCompactionBranchParams as zn, WizardCancelParamsSchema as zo, ChannelsLogoutParamsSchema as zp, validateSystemAgentSetupAuthStartParams as zr, TerminalAttachResult as zs, validateModelsProbeParams as zt, ChatToolTitlesResultSchema as zu, ConversationTurnCancelParams as zv, WorkerInferenceStartResponseFrameSchema as zx, BoardSetChatDockCommandSchema as zy };