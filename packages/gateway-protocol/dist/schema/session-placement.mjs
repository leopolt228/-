// packages/gateway-protocol/src/schema/session-placement.ts
import { Type as Type3 } from "typebox";

// packages/gateway-protocol/src/schema/closed-object.ts
import { Type } from "typebox";
function closedObject(properties) {
  return Type.Object(properties, { additionalProperties: false });
}

// packages/gateway-protocol/src/schema/primitives.ts
import { Type as Type2 } from "typebox";

// packages/gateway-protocol/src/client-info.ts
var GATEWAY_CLIENT_IDS = {
  WEBCHAT_UI: "webchat-ui",
  CONTROL_UI: "openclaw-control-ui",
  BROWSER_COPILOT: "openclaw-browser-copilot",
  TUI: "openclaw-tui",
  WEBCHAT: "webchat",
  CLI: "cli",
  GATEWAY_CLIENT: "gateway-client",
  MACOS_APP: "openclaw-macos",
  // Native Linux UI uses the same trusted-client admission class as the macOS app.
  LINUX_APP: "openclaw-linux",
  IOS_APP: "openclaw-ios",
  WATCHOS_APP: "openclaw-watchos",
  ANDROID_APP: "openclaw-android",
  NODE_HOST: "node-host",
  WORKER: "openclaw-worker",
  TEST: "test",
  FINGERPRINT: "fingerprint",
  PROBE: "openclaw-probe"
};
var GATEWAY_CLIENT_MODES = {
  WEBCHAT: "webchat",
  CLI: "cli",
  UI: "ui",
  BACKEND: "backend",
  NODE: "node",
  WORKER: "worker",
  PROBE: "probe",
  TEST: "test"
};
var GATEWAY_CLIENT_ID_SET = new Set(Object.values(GATEWAY_CLIENT_IDS));
var GATEWAY_CLIENT_MODE_SET = new Set(Object.values(GATEWAY_CLIENT_MODES));

// packages/gateway-protocol/src/secret-ref-contract.ts
var SINGLE_VALUE_FILE_REF_ID = "value";
var SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
var FILE_SECRET_REF_ID_ABSOLUTE_JSON_SCHEMA_PATTERN = "^/";
var FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN = "~(?:[^01]|$)";
var EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN = "^(?!.*(?:^|/)\\.{1,2}(?:/|$))[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$";

// packages/gateway-protocol/src/schema/primitives.ts
var ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
var INPUT_PROVENANCE_KIND_VALUES = ["external_user", "inter_session", "internal_system"];
var SESSION_LABEL_MAX_LENGTH = 512;
var NonEmptyString = Type2.String({ minLength: 1 });
var CHAT_SEND_SESSION_KEY_MAX_LENGTH = 512;
var ChatSendSessionKeyString = Type2.String({
  minLength: 1,
  maxLength: CHAT_SEND_SESSION_KEY_MAX_LENGTH
});
var SessionLabelString = Type2.String({
  minLength: 1,
  maxLength: SESSION_LABEL_MAX_LENGTH
});
var InputProvenanceSchema = closedObject({
  kind: Type2.String({ enum: [...INPUT_PROVENANCE_KIND_VALUES] }),
  originSessionId: Type2.Optional(Type2.String()),
  sourceSessionKey: Type2.Optional(Type2.String()),
  sourceChannel: Type2.Optional(Type2.String()),
  sourceTool: Type2.Optional(Type2.String())
});
var GatewayClientIdSchema = Type2.Enum(GATEWAY_CLIENT_IDS);
var GatewayClientModeSchema = Type2.Enum(GATEWAY_CLIENT_MODES);
var SecretProviderAliasString = Type2.String({
  pattern: SECRET_PROVIDER_ALIAS_PATTERN.source
});
var EnvSecretRefSchema = closedObject({
  source: Type2.Literal("env"),
  provider: SecretProviderAliasString,
  id: Type2.String({ pattern: ENV_SECRET_REF_ID_RE.source })
});
var FileSecretRefIdSchema = Type2.Unsafe({
  type: "string",
  anyOf: [
    { const: SINGLE_VALUE_FILE_REF_ID },
    {
      allOf: [
        { pattern: FILE_SECRET_REF_ID_ABSOLUTE_JSON_SCHEMA_PATTERN },
        { not: { pattern: FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN } }
      ]
    }
  ]
});
var FileSecretRefSchema = closedObject({
  source: Type2.Literal("file"),
  provider: SecretProviderAliasString,
  id: FileSecretRefIdSchema
});
var ExecSecretRefSchema = closedObject({
  source: Type2.Literal("exec"),
  provider: SecretProviderAliasString,
  id: Type2.String({ pattern: EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN })
});
var SecretRefSchema = Type2.Union([
  EnvSecretRefSchema,
  FileSecretRefSchema,
  ExecSecretRefSchema
]);
var SecretInputSchema = Type2.Union([Type2.String(), SecretRefSchema]);

// packages/gateway-protocol/src/schema/session-placement-state.ts
function isCloudWorkerPlacementState(state) {
  return state !== void 0 && state !== "local" && state !== "reclaimed";
}

// packages/gateway-protocol/src/schema/session-placement.ts
var SessionPlacementStateSchema = Type3.Union([
  Type3.Literal("local"),
  Type3.Literal("requested"),
  Type3.Literal("provisioning"),
  Type3.Literal("syncing"),
  Type3.Literal("starting"),
  Type3.Literal("active"),
  Type3.Literal("draining"),
  Type3.Literal("reconciling"),
  Type3.Literal("reclaimed"),
  Type3.Literal("failed")
]);
var SessionPlacementTimingProperties = {
  generation: Type3.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  createdAtMs: Type3.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  updatedAtMs: Type3.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  stateChangedAtMs: Type3.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
};
var SessionPlacementOwnerEpochSchema = Type3.Integer({
  minimum: 1,
  maximum: Number.MAX_SAFE_INTEGER
});
var WorkerBundleHashSchema = Type3.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var SessionPlacementWorkspaceProperties = {
  workspaceBaseManifestRef: NonEmptyString,
  remoteWorkspaceDir: NonEmptyString
};
var SessionPlacementAckProperties = {
  lastTranscriptAckCursor: Type3.Optional(
    Type3.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
  ),
  lastLiveEventAckCursor: Type3.Optional(
    Type3.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
  )
};
var WorkspaceResultConflictSchema = closedObject({
  paths: Type3.Array(NonEmptyString, { minItems: 1, maxItems: 256 }),
  stagedResultRef: NonEmptyString,
  totalCount: Type3.Optional(Type3.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }))
});
var SessionPlacementConflictProperties = {
  workspaceResultConflict: Type3.Optional(WorkspaceResultConflictSchema)
};
var TerminalSessionPlacementProperties = {
  environmentId: Type3.Optional(NonEmptyString),
  activeOwnerEpoch: Type3.Optional(SessionPlacementOwnerEpochSchema),
  workspaceBaseManifestRef: Type3.Optional(NonEmptyString),
  remoteWorkspaceDir: Type3.Optional(NonEmptyString),
  workerBundleHash: Type3.Optional(WorkerBundleHashSchema),
  ...SessionPlacementAckProperties,
  ...SessionPlacementConflictProperties
};
function createUnownedSessionPlacementSchema(state) {
  return closedObject({ state: Type3.Literal(state), ...SessionPlacementTimingProperties });
}
function createWorkerOwnedSessionPlacementSchema(state) {
  return closedObject({
    state: Type3.Literal(state),
    ...SessionPlacementTimingProperties,
    environmentId: NonEmptyString,
    activeOwnerEpoch: SessionPlacementOwnerEpochSchema,
    workerBundleHash: WorkerBundleHashSchema,
    ...SessionPlacementWorkspaceProperties,
    ...SessionPlacementAckProperties,
    ...SessionPlacementConflictProperties
  });
}
var LocalSessionPlacementSchema = createUnownedSessionPlacementSchema("local");
var RequestedSessionPlacementSchema = createUnownedSessionPlacementSchema("requested");
var ProvisioningSessionPlacementSchema = closedObject({
  state: Type3.Literal("provisioning"),
  ...SessionPlacementTimingProperties,
  environmentId: Type3.Optional(NonEmptyString)
});
var SyncingSessionPlacementSchema = closedObject({
  state: Type3.Literal("syncing"),
  ...SessionPlacementTimingProperties,
  environmentId: NonEmptyString,
  workerBundleHash: WorkerBundleHashSchema
});
var StartingSessionPlacementSchema = closedObject({
  state: Type3.Literal("starting"),
  ...SessionPlacementTimingProperties,
  environmentId: NonEmptyString,
  workerBundleHash: WorkerBundleHashSchema,
  ...SessionPlacementWorkspaceProperties
});
var ActiveWorkerSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("active");
var DrainingSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("draining");
var ReconcilingSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("reconciling");
var ReclaimedSessionPlacementSchema = closedObject({
  state: Type3.Literal("reclaimed"),
  ...SessionPlacementTimingProperties,
  ...TerminalSessionPlacementProperties
});
var FailedSessionPlacementSchema = closedObject({
  state: Type3.Literal("failed"),
  ...SessionPlacementTimingProperties,
  ...TerminalSessionPlacementProperties,
  recoveryError: NonEmptyString
});
var SessionPlacementSchema = Type3.Union([
  LocalSessionPlacementSchema,
  RequestedSessionPlacementSchema,
  ProvisioningSessionPlacementSchema,
  SyncingSessionPlacementSchema,
  StartingSessionPlacementSchema,
  ActiveWorkerSessionPlacementSchema,
  DrainingSessionPlacementSchema,
  ReconcilingSessionPlacementSchema,
  ReclaimedSessionPlacementSchema,
  FailedSessionPlacementSchema
]);
var SessionsDispatchParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type3.Optional(NonEmptyString),
  profileId: NonEmptyString
});
var SessionsDispatchResultSchema = closedObject({
  ok: Type3.Literal(true),
  key: NonEmptyString,
  sessionId: NonEmptyString,
  placement: ActiveWorkerSessionPlacementSchema
});
var SessionsReclaimParamsSchema = Type3.Object(
  {
    key: NonEmptyString,
    agentId: Type3.Optional(NonEmptyString)
  },
  { additionalProperties: false }
);
var SessionsReclaimResultSchema = Type3.Object(
  {
    ok: Type3.Literal(true),
    key: NonEmptyString,
    sessionId: NonEmptyString,
    placement: ReclaimedSessionPlacementSchema
  },
  { additionalProperties: false }
);
var SessionPlacementProtocolSchemas = {
  SessionPlacementState: SessionPlacementStateSchema,
  LocalSessionPlacement: LocalSessionPlacementSchema,
  RequestedSessionPlacement: RequestedSessionPlacementSchema,
  ProvisioningSessionPlacement: ProvisioningSessionPlacementSchema,
  SyncingSessionPlacement: SyncingSessionPlacementSchema,
  StartingSessionPlacement: StartingSessionPlacementSchema,
  ActiveWorkerSessionPlacement: ActiveWorkerSessionPlacementSchema,
  DrainingSessionPlacement: DrainingSessionPlacementSchema,
  ReconcilingSessionPlacement: ReconcilingSessionPlacementSchema,
  ReclaimedSessionPlacement: ReclaimedSessionPlacementSchema,
  FailedSessionPlacement: FailedSessionPlacementSchema,
  SessionPlacement: SessionPlacementSchema,
  SessionsDispatchParams: SessionsDispatchParamsSchema,
  SessionsDispatchResult: SessionsDispatchResultSchema,
  SessionsReclaimParams: SessionsReclaimParamsSchema,
  SessionsReclaimResult: SessionsReclaimResultSchema
};
export {
  SessionPlacementProtocolSchemas,
  SessionPlacementSchema,
  SessionPlacementStateSchema,
  SessionsDispatchParamsSchema,
  SessionsDispatchResultSchema,
  SessionsReclaimParamsSchema,
  SessionsReclaimResultSchema,
  isCloudWorkerPlacementState
};
