// packages/gateway-protocol/src/schema/exec-approvals.ts
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

// packages/gateway-protocol/src/schema/exec-approvals.ts
var ExecApprovalsAllowlistEntrySchema = closedObject({
  id: Type3.Optional(NonEmptyString),
  pattern: Type3.String(),
  source: Type3.Optional(Type3.Literal("allow-always")),
  commandText: Type3.Optional(Type3.String()),
  argPattern: Type3.Optional(Type3.String()),
  lastUsedAt: Type3.Optional(Type3.Number({ minimum: 0 })),
  lastUsedCommand: Type3.Optional(Type3.String()),
  lastResolvedPath: Type3.Optional(Type3.String())
});
var ExecApprovalsPolicyFields = {
  security: Type3.Optional(Type3.String()),
  ask: Type3.Optional(Type3.String()),
  askFallback: Type3.Optional(Type3.String()),
  autoAllowSkills: Type3.Optional(Type3.Boolean())
};
var ExecSecuritySchema = Type3.Union([
  Type3.Literal("deny"),
  Type3.Literal("allowlist"),
  Type3.Literal("full")
]);
var ExecAskSchema = Type3.Union([
  Type3.Literal("off"),
  Type3.Literal("on-miss"),
  Type3.Literal("always")
]);
var ExecApprovalsResolvedDefaultsSchema = closedObject({
  security: ExecSecuritySchema,
  ask: ExecAskSchema,
  askFallback: ExecSecuritySchema,
  autoAllowSkills: Type3.Boolean()
});
var ExecApprovalsDefaultsSchema = closedObject(ExecApprovalsPolicyFields);
var ExecApprovalsAgentSchema = closedObject({
  ...ExecApprovalsPolicyFields,
  allowlist: Type3.Optional(Type3.Array(ExecApprovalsAllowlistEntrySchema))
});
var ExecApprovalsFileSchema = closedObject({
  version: Type3.Literal(1),
  socket: Type3.Optional(
    closedObject({
      path: Type3.Optional(Type3.String()),
      token: Type3.Optional(Type3.String())
    })
  ),
  defaults: Type3.Optional(ExecApprovalsDefaultsSchema),
  agents: Type3.Optional(Type3.Record(Type3.String(), ExecApprovalsAgentSchema))
});
var ExecApprovalsSnapshotSchema = closedObject({
  path: NonEmptyString,
  exists: Type3.Boolean(),
  hash: NonEmptyString,
  file: ExecApprovalsFileSchema
});
var NativeExecApprovalActionSchema = Type3.Union([
  Type3.Literal("allow"),
  Type3.Literal("deny"),
  Type3.Literal("prompt")
]);
var NativeExecApprovalRuleSchema = closedObject({
  pattern: NonEmptyString,
  action: NativeExecApprovalActionSchema,
  shells: Type3.Optional(Type3.Array(NonEmptyString)),
  description: Type3.Optional(Type3.String()),
  enabled: Type3.Optional(Type3.Boolean())
});
var NativeExecApprovalConstraintsSchema = closedObject({
  baseHashRequired: Type3.Optional(Type3.Boolean()),
  defaultAllowAllowed: Type3.Optional(Type3.Boolean()),
  broadAllowRulesAllowed: Type3.Optional(Type3.Boolean()),
  dangerousAllowRulesAllowed: Type3.Optional(Type3.Boolean())
});
var ExecApprovalsNodeSnapshotSchema = Type3.Object(
  {
    path: Type3.Optional(Type3.String()),
    exists: Type3.Optional(Type3.Boolean()),
    hash: Type3.Optional(Type3.String()),
    file: Type3.Optional(ExecApprovalsFileSchema),
    resolvedDefaults: Type3.Optional(ExecApprovalsResolvedDefaultsSchema),
    enabled: Type3.Optional(Type3.Boolean()),
    baseHash: Type3.Optional(NonEmptyString),
    defaultAction: Type3.Optional(NativeExecApprovalActionSchema),
    rules: Type3.Optional(Type3.Array(NativeExecApprovalRuleSchema)),
    constraints: Type3.Optional(NativeExecApprovalConstraintsSchema),
    message: Type3.Optional(Type3.String())
  },
  {
    additionalProperties: false,
    oneOf: [
      {
        required: ["path", "exists", "hash", "file"],
        not: {
          anyOf: [
            { required: ["enabled"] },
            { required: ["baseHash"] },
            { required: ["defaultAction"] },
            { required: ["rules"] },
            { required: ["constraints"] },
            { required: ["message"] }
          ]
        }
      },
      {
        properties: { enabled: { const: true }, hash: { minLength: 1 } },
        required: ["enabled", "hash", "defaultAction", "rules"],
        not: {
          anyOf: [
            { required: ["path"] },
            { required: ["exists"] },
            { required: ["file"] },
            { required: ["resolvedDefaults"] },
            { required: ["message"] }
          ]
        }
      },
      {
        properties: { enabled: { const: false } },
        required: ["enabled"],
        not: {
          anyOf: [
            { required: ["path"] },
            { required: ["exists"] },
            { required: ["hash"] },
            { required: ["file"] },
            { required: ["resolvedDefaults"] },
            { required: ["baseHash"] },
            { required: ["defaultAction"] },
            { required: ["rules"] },
            { required: ["constraints"] }
          ]
        }
      }
    ]
  }
);
var ExecApprovalsGetParamsSchema = closedObject({});
var ExecApprovalsSetParamsSchema = closedObject({
  file: ExecApprovalsFileSchema,
  baseHash: Type3.Optional(NonEmptyString)
});
var ExecApprovalsNodeGetParamsSchema = closedObject({
  nodeId: NonEmptyString
});
var NativeExecApprovalPolicySchema = closedObject({
  defaultAction: Type3.Optional(NativeExecApprovalActionSchema),
  // Windows treats set as full replacement; omission would silently clear the rule list.
  rules: Type3.Array(NativeExecApprovalRuleSchema)
});
var ExecApprovalsNodeSetParamsSchema = Type3.Object(
  {
    nodeId: NonEmptyString,
    file: Type3.Optional(ExecApprovalsFileSchema),
    native: Type3.Optional(NativeExecApprovalPolicySchema),
    baseHash: Type3.Optional(NonEmptyString)
  },
  {
    additionalProperties: false,
    oneOf: [
      { required: ["file"], not: { required: ["native"] } },
      {
        required: ["native", "baseHash"],
        not: { required: ["file"] }
      }
    ]
  }
);
var ExecApprovalGetParamsSchema = closedObject({
  id: NonEmptyString
});
var ExecApprovalPolicySecuritySchema = Type3.Union([
  Type3.Literal("deny"),
  Type3.Literal("allowlist"),
  Type3.Literal("full")
]);
var ExecApprovalPolicySnapshotSchema = closedObject({
  security: ExecApprovalPolicySecuritySchema,
  ask: Type3.Union([Type3.Literal("off"), Type3.Literal("on-miss"), Type3.Literal("always")]),
  askFallback: ExecApprovalPolicySecuritySchema,
  autoAllowSkills: Type3.Boolean(),
  allowlistRules: Type3.Array(
    closedObject({
      pattern: Type3.String(),
      argPattern: Type3.Optional(Type3.String()),
      source: Type3.Optional(Type3.Literal("allow-always"))
    })
  )
});
var ExecApprovalRequestParamsSchema = closedObject({
  id: Type3.Optional(NonEmptyString),
  command: Type3.Optional(NonEmptyString),
  commandArgv: Type3.Optional(Type3.Array(Type3.String())),
  systemRunPlan: Type3.Optional(
    closedObject({
      argv: Type3.Array(Type3.String()),
      cwd: Type3.Union([Type3.String(), Type3.Null()]),
      commandText: Type3.String(),
      commandPreview: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
      agentId: Type3.Union([Type3.String(), Type3.Null()]),
      sessionKey: Type3.Union([Type3.String(), Type3.Null()]),
      policySnapshot: Type3.Optional(ExecApprovalPolicySnapshotSchema),
      mutableFileOperand: Type3.Optional(
        Type3.Union([
          closedObject({
            argvIndex: Type3.Integer({ minimum: 0 }),
            path: Type3.String(),
            sha256: Type3.String()
          }),
          Type3.Null()
        ])
      )
    })
  ),
  env: Type3.Optional(Type3.Record(NonEmptyString, Type3.String())),
  cwd: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
  nodeId: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
  host: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
  security: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
  ask: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
  warningText: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
  unavailableDecisions: Type3.Optional(
    Type3.Array(Type3.String({ enum: ["allow-always"] }), {
      minItems: 1,
      maxItems: 1
    })
  ),
  commandSpans: Type3.Optional(
    Type3.Array(
      closedObject({
        startIndex: Type3.Integer({
          minimum: 0,
          description: "Inclusive UTF-16 code unit offset into command."
        }),
        endIndex: Type3.Integer({
          minimum: 1,
          description: "Exclusive UTF-16 code unit offset into command; must be greater than startIndex and no greater than command.length."
        })
      })
    )
  ),
  agentId: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
  resolvedPath: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
  sessionKey: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
  sessionId: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
  runId: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
  toolCallId: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
  turnSourceChannel: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
  turnSourceTo: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
  turnSourceAccountId: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
  turnSourceThreadId: Type3.Optional(Type3.Union([Type3.String(), Type3.Number(), Type3.Null()])),
  approvalReviewerDeviceIds: Type3.Optional(
    Type3.Array(NonEmptyString, {
      description: "Trusted approval-runtime metadata naming operator devices that may review this approval; ordinary Gateway clients may send the field, but the Gateway only binds it for internal approval-runtime requests."
    })
  ),
  requireDeliveryRoute: Type3.Optional(Type3.Boolean()),
  suppressDelivery: Type3.Optional(Type3.Boolean()),
  timeoutMs: Type3.Optional(Type3.Integer({ minimum: 1 })),
  twoPhase: Type3.Optional(Type3.Boolean())
});
var ExecApprovalResolveParamsSchema = closedObject({
  id: NonEmptyString,
  decision: NonEmptyString
});
export {
  ExecApprovalGetParamsSchema,
  ExecApprovalRequestParamsSchema,
  ExecApprovalResolveParamsSchema,
  ExecApprovalsGetParamsSchema,
  ExecApprovalsNodeGetParamsSchema,
  ExecApprovalsNodeSetParamsSchema,
  ExecApprovalsNodeSnapshotSchema,
  ExecApprovalsSetParamsSchema,
  ExecApprovalsSnapshotSchema
};
