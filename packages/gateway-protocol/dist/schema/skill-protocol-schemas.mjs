// packages/gateway-protocol/src/schema/agents-models-skills.ts
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

// packages/gateway-protocol/src/schema/agents-models-skills.ts
var GatewayAgentRuntimeSchema = closedObject({
  id: NonEmptyString,
  fallback: Type3.Optional(Type3.Union([Type3.Literal("openclaw"), Type3.Literal("none")])),
  source: Type3.Union([
    Type3.Literal("env"),
    Type3.Literal("agent"),
    Type3.Literal("defaults"),
    Type3.Literal("model"),
    Type3.Literal("provider"),
    Type3.Literal("implicit"),
    Type3.Literal("session"),
    Type3.Literal("session-key")
  ])
});
var ModelChoiceSchema = closedObject({
  id: NonEmptyString,
  name: NonEmptyString,
  provider: NonEmptyString,
  alias: Type3.Optional(NonEmptyString),
  available: Type3.Optional(Type3.Boolean()),
  contextWindow: Type3.Optional(Type3.Integer({ minimum: 1 })),
  reasoning: Type3.Optional(Type3.Boolean()),
  agentRuntime: Type3.Optional(GatewayAgentRuntimeSchema),
  apiKeySupported: Type3.Optional(Type3.Boolean()),
  input: Type3.Optional(
    Type3.Array(
      Type3.Union([
        Type3.Literal("text"),
        Type3.Literal("image"),
        Type3.Literal("audio"),
        Type3.Literal("video"),
        Type3.Literal("document")
      ])
    )
  )
});
var AgentSummarySchema = closedObject({
  id: NonEmptyString,
  name: Type3.Optional(NonEmptyString),
  identity: Type3.Optional(
    closedObject({
      name: Type3.Optional(NonEmptyString),
      theme: Type3.Optional(NonEmptyString),
      emoji: Type3.Optional(NonEmptyString),
      avatar: Type3.Optional(NonEmptyString),
      avatarUrl: Type3.Optional(NonEmptyString)
    })
  ),
  workspace: Type3.Optional(NonEmptyString),
  workspaceGit: Type3.Optional(Type3.Boolean()),
  model: Type3.Optional(
    closedObject({
      primary: Type3.Optional(NonEmptyString),
      fallbacks: Type3.Optional(Type3.Array(NonEmptyString))
    })
  ),
  agentRuntime: Type3.Optional(GatewayAgentRuntimeSchema),
  thinkingLevels: Type3.Optional(
    Type3.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString
      })
    )
  ),
  thinkingOptions: Type3.Optional(Type3.Array(NonEmptyString)),
  thinkingDefault: Type3.Optional(NonEmptyString)
});
var AgentsListParamsSchema = closedObject({});
var AgentsListResultSchema = closedObject({
  defaultId: NonEmptyString,
  mainKey: NonEmptyString,
  scope: Type3.Union([Type3.Literal("per-sender"), Type3.Literal("global")]),
  agents: Type3.Array(AgentSummarySchema)
});
var AgentsCreateParamsSchema = closedObject({
  name: NonEmptyString,
  workspace: Type3.Optional(NonEmptyString),
  model: Type3.Optional(NonEmptyString),
  emoji: Type3.Optional(Type3.String()),
  avatar: Type3.Optional(Type3.String())
});
var AgentsCreateResultSchema = closedObject({
  ok: Type3.Literal(true),
  agentId: NonEmptyString,
  name: NonEmptyString,
  workspace: NonEmptyString,
  model: Type3.Optional(NonEmptyString)
});
var AgentsUpdateParamsSchema = closedObject({
  agentId: NonEmptyString,
  name: Type3.Optional(NonEmptyString),
  workspace: Type3.Optional(NonEmptyString),
  model: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
  emoji: Type3.Optional(Type3.String()),
  avatar: Type3.Optional(Type3.String())
});
var AgentsUpdateResultSchema = closedObject({
  ok: Type3.Literal(true),
  agentId: NonEmptyString
});
var AgentsDeleteParamsSchema = closedObject({
  agentId: NonEmptyString,
  deleteFiles: Type3.Optional(Type3.Boolean())
});
var AgentsDeleteResultSchema = closedObject({
  ok: Type3.Literal(true),
  agentId: NonEmptyString,
  removedBindings: Type3.Integer({ minimum: 0 }),
  removed: Type3.Optional(
    Type3.Array(
      closedObject({
        path: NonEmptyString,
        method: Type3.Union([Type3.Literal("trash"), Type3.Literal("missing")])
      })
    )
  ),
  failed: Type3.Optional(
    Type3.Array(
      closedObject({
        path: NonEmptyString,
        reason: NonEmptyString
      })
    )
  )
});
var AgentsFileEntrySchema = closedObject({
  name: NonEmptyString,
  path: NonEmptyString,
  missing: Type3.Boolean(),
  size: Type3.Optional(Type3.Integer({ minimum: 0 })),
  updatedAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  content: Type3.Optional(Type3.String())
});
var AgentsFilesListParamsSchema = closedObject({
  agentId: NonEmptyString
});
var AgentsFilesListResultSchema = closedObject({
  agentId: NonEmptyString,
  workspace: NonEmptyString,
  files: Type3.Array(AgentsFileEntrySchema)
});
var AgentsFilesGetParamsSchema = closedObject({
  agentId: NonEmptyString,
  name: NonEmptyString
});
var AgentsFilesGetResultSchema = closedObject({
  agentId: NonEmptyString,
  workspace: NonEmptyString,
  file: AgentsFileEntrySchema
});
var AgentsFilesSetParamsSchema = closedObject({
  agentId: NonEmptyString,
  name: NonEmptyString,
  content: Type3.String()
});
var AgentsFilesSetResultSchema = closedObject({
  ok: Type3.Literal(true),
  agentId: NonEmptyString,
  workspace: NonEmptyString,
  file: AgentsFileEntrySchema
});
var ModelsListParamsSchema = closedObject({
  includeProviderCapabilities: Type3.Optional(Type3.Boolean()),
  view: Type3.Optional(
    Type3.Union([
      Type3.Literal("default"),
      Type3.Literal("configured"),
      Type3.Literal("provider-config"),
      Type3.Literal("all")
    ])
  )
});
var ModelsListResultSchema = closedObject({
  models: Type3.Array(ModelChoiceSchema)
});
var ModelsProbeParamsSchema = closedObject({
  provider: NonEmptyString,
  profileId: Type3.Optional(NonEmptyString),
  timeoutMs: Type3.Optional(Type3.Integer({ minimum: 1 }))
});
var AuthProbeStatusSchema = Type3.Union([
  Type3.Literal("ok"),
  Type3.Literal("auth"),
  Type3.Literal("rate_limit"),
  Type3.Literal("billing"),
  Type3.Literal("timeout"),
  Type3.Literal("format"),
  Type3.Literal("unknown"),
  Type3.Literal("no_model")
]);
var ModelsProbeTargetResultSchema = closedObject({
  profileId: Type3.Optional(NonEmptyString),
  label: NonEmptyString,
  status: AuthProbeStatusSchema,
  latencyMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  error: Type3.Optional(Type3.String())
});
var ModelsProbeResultSchema = closedObject({
  provider: NonEmptyString,
  status: AuthProbeStatusSchema,
  latencyMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  error: Type3.Optional(Type3.String()),
  results: Type3.Array(ModelsProbeTargetResultSchema)
});
var SkillsStatusParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString)
});
var SkillsBinsParamsSchema = closedObject({});
var SkillsBinsResultSchema = closedObject({
  bins: Type3.Array(NonEmptyString)
});
var Sha256String = Type3.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-fA-F0-9]{64}$"
});
var SkillUploadIdempotencyKeyString = Type3.String({
  minLength: 1,
  maxLength: 2048
});
var SkillUploadDataBase64String = Type3.String({
  minLength: 1,
  maxLength: 5592408
});
var SkillsUploadBeginParamsSchema = closedObject({
  kind: Type3.Literal("skill-archive"),
  slug: NonEmptyString,
  sizeBytes: Type3.Integer({ minimum: 1 }),
  sha256: Type3.Optional(Sha256String),
  force: Type3.Optional(Type3.Boolean()),
  idempotencyKey: Type3.Optional(SkillUploadIdempotencyKeyString)
});
var SkillsUploadChunkParamsSchema = closedObject({
  uploadId: NonEmptyString,
  offset: Type3.Integer({ minimum: 0 }),
  dataBase64: SkillUploadDataBase64String
});
var SkillsUploadCommitParamsSchema = closedObject({
  uploadId: NonEmptyString,
  sha256: Type3.Optional(Sha256String)
});
var SkillsInstallParamsSchema = Type3.Union([
  closedObject({
    agentId: Type3.Optional(NonEmptyString),
    name: NonEmptyString,
    installId: NonEmptyString,
    dangerouslyForceUnsafeInstall: Type3.Optional(
      Type3.Boolean({
        deprecated: true,
        description: "Deprecated compatibility field. Current servers ignore it; install policy is controlled by security.installPolicy."
      })
    ),
    timeoutMs: Type3.Optional(Type3.Integer({ minimum: 1e3 }))
  }),
  closedObject({
    agentId: Type3.Optional(NonEmptyString),
    source: Type3.Literal("clawhub"),
    slug: NonEmptyString,
    version: Type3.Optional(NonEmptyString),
    force: Type3.Optional(Type3.Boolean()),
    acknowledgeClawHubRisk: Type3.Optional(Type3.Boolean()),
    timeoutMs: Type3.Optional(Type3.Integer({ minimum: 1e3 }))
  }),
  closedObject({
    agentId: Type3.Optional(NonEmptyString),
    source: Type3.Literal("upload"),
    uploadId: NonEmptyString,
    slug: NonEmptyString,
    force: Type3.Optional(Type3.Boolean()),
    sha256: Type3.Optional(Sha256String),
    timeoutMs: Type3.Optional(Type3.Integer({ minimum: 1e3 }))
  })
]);
var SkillsUpdateParamsSchema = Type3.Union([
  closedObject({
    skillKey: NonEmptyString,
    enabled: Type3.Optional(Type3.Boolean()),
    apiKey: Type3.Optional(Type3.String()),
    env: Type3.Optional(Type3.Record(NonEmptyString, Type3.String()))
  }),
  closedObject({
    agentId: Type3.Optional(NonEmptyString),
    source: Type3.Literal("clawhub"),
    slug: Type3.Optional(NonEmptyString),
    all: Type3.Optional(Type3.Boolean()),
    acknowledgeClawHubRisk: Type3.Optional(Type3.Boolean())
  })
]);
var SkillsSearchParamsSchema = closedObject({
  query: Type3.Optional(NonEmptyString),
  limit: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 100 }))
});
var SkillsSearchResultSchema = closedObject({
  results: Type3.Array(
    closedObject({
      score: Type3.Number(),
      slug: NonEmptyString,
      displayName: NonEmptyString,
      summary: Type3.Optional(Type3.String()),
      version: Type3.Optional(NonEmptyString),
      updatedAt: Type3.Optional(Type3.Integer())
    })
  )
});
var SkillsDetailParamsSchema = closedObject({
  slug: NonEmptyString
});
var SkillsSecurityVerdictsParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString)
});
var SkillsDetailResultSchema = closedObject({
  skill: Type3.Union([
    closedObject({
      slug: NonEmptyString,
      displayName: NonEmptyString,
      summary: Type3.Optional(Type3.String()),
      tags: Type3.Optional(Type3.Record(NonEmptyString, Type3.String())),
      channel: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
      isOfficial: Type3.Optional(Type3.Union([Type3.Boolean(), Type3.Null()])),
      createdAt: Type3.Integer(),
      updatedAt: Type3.Integer()
    }),
    Type3.Null()
  ]),
  latestVersion: Type3.Optional(
    Type3.Union([
      closedObject({
        version: NonEmptyString,
        createdAt: Type3.Integer(),
        changelog: Type3.Optional(Type3.String())
      }),
      Type3.Null()
    ])
  ),
  metadata: Type3.Optional(
    Type3.Union([
      closedObject({
        os: Type3.Optional(Type3.Union([Type3.Array(Type3.String()), Type3.Null()])),
        systems: Type3.Optional(Type3.Union([Type3.Array(Type3.String()), Type3.Null()]))
      }),
      Type3.Null()
    ])
  ),
  owner: Type3.Optional(
    Type3.Union([
      closedObject({
        handle: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
        displayName: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
        image: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
        official: Type3.Optional(Type3.Union([Type3.Boolean(), Type3.Null()])),
        channel: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
        isOfficial: Type3.Optional(Type3.Union([Type3.Boolean(), Type3.Null()]))
      }),
      Type3.Null()
    ])
  )
});
var SkillsSecurityVerdictsResultSchema = closedObject({
  schema: Type3.Literal("openclaw.skills.security-verdicts.v1"),
  items: Type3.Array(
    closedObject({
      registry: NonEmptyString,
      ok: Type3.Boolean(),
      decision: NonEmptyString,
      reasons: Type3.Array(Type3.String()),
      requestedSlug: NonEmptyString,
      requestedVersion: NonEmptyString,
      slug: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
      version: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
      displayName: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
      publisherHandle: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
      publisherDisplayName: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
      createdAt: Type3.Optional(Type3.Union([Type3.Integer(), Type3.Null()])),
      checkedAt: Type3.Optional(Type3.Union([Type3.Integer(), Type3.Null()])),
      skillUrl: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
      securityAuditUrl: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
      securityStatus: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
      securityPassed: Type3.Optional(Type3.Union([Type3.Boolean(), Type3.Null()])),
      error: Type3.Optional(
        closedObject({
          code: Type3.Optional(Type3.String()),
          message: Type3.Optional(Type3.String())
        })
      )
    })
  )
});
var SkillsSkillCardParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  skillKey: NonEmptyString
});
var SkillsSkillCardResultSchema = closedObject({
  schema: Type3.Literal("openclaw.skills.skill-card.v1"),
  skillKey: NonEmptyString,
  path: NonEmptyString,
  sizeBytes: Type3.Integer({ minimum: 0 }),
  content: Type3.String()
});
var SkillProposalStatusSchema = Type3.Union([
  Type3.Literal("pending"),
  Type3.Literal("applied"),
  Type3.Literal("rejected"),
  Type3.Literal("quarantined"),
  Type3.Literal("stale")
]);
var SkillProposalKindSchema = Type3.Union([Type3.Literal("create"), Type3.Literal("update")]);
var SkillProposalScanStateSchema = Type3.Union([
  Type3.Literal("pending"),
  Type3.Literal("clean"),
  Type3.Literal("failed"),
  Type3.Literal("quarantined")
]);
var SkillProposalSourceSchema = Type3.Union([
  Type3.Literal("skill-workshop"),
  Type3.Literal("cli"),
  Type3.Literal("gateway")
]);
var SkillProposalContentString = Type3.String({ minLength: 1, maxLength: 1048576 });
var SkillProposalSupportFileInputSchema = closedObject({
  path: NonEmptyString,
  content: Type3.String({ maxLength: 262144 })
});
var SkillProposalSupportFileSchema = closedObject({
  path: NonEmptyString,
  sizeBytes: Type3.Integer({ minimum: 0, maximum: 262144 }),
  hash: Sha256String,
  targetExisted: Type3.Optional(Type3.Boolean()),
  targetContentHash: Type3.Optional(Sha256String)
});
var SkillProposalFindingSchema = closedObject({
  ruleId: NonEmptyString,
  severity: Type3.Union([Type3.Literal("info"), Type3.Literal("warn"), Type3.Literal("critical")]),
  file: NonEmptyString,
  line: Type3.Integer({ minimum: 1 }),
  message: NonEmptyString,
  evidence: Type3.String()
});
var SkillProposalScanSchema = closedObject({
  state: SkillProposalScanStateSchema,
  scannedAt: NonEmptyString,
  critical: Type3.Integer({ minimum: 0 }),
  warn: Type3.Integer({ minimum: 0 }),
  info: Type3.Integer({ minimum: 0 }),
  findings: Type3.Array(SkillProposalFindingSchema)
});
var SkillProposalTargetSchema = closedObject({
  skillName: NonEmptyString,
  skillKey: NonEmptyString,
  skillDir: NonEmptyString,
  skillFile: NonEmptyString,
  source: Type3.Optional(NonEmptyString),
  currentContentHash: Type3.Optional(NonEmptyString)
});
var SkillProposalOriginSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  sessionKey: Type3.Optional(NonEmptyString),
  runId: Type3.Optional(NonEmptyString),
  messageId: Type3.Optional(NonEmptyString)
});
var SkillProposalRecordSchema = closedObject({
  schema: Type3.Literal("openclaw.skill-workshop.proposal.v1"),
  id: NonEmptyString,
  kind: SkillProposalKindSchema,
  status: SkillProposalStatusSchema,
  title: NonEmptyString,
  description: NonEmptyString,
  createdAt: NonEmptyString,
  updatedAt: NonEmptyString,
  createdBy: SkillProposalSourceSchema,
  origin: Type3.Optional(SkillProposalOriginSchema),
  proposedVersion: NonEmptyString,
  draftFile: Type3.Literal("PROPOSAL.md"),
  draftHash: NonEmptyString,
  supportFiles: Type3.Optional(Type3.Array(SkillProposalSupportFileSchema, { maxItems: 64 })),
  target: SkillProposalTargetSchema,
  scan: SkillProposalScanSchema,
  goal: Type3.Optional(Type3.String()),
  evidence: Type3.Optional(Type3.String()),
  appliedAt: Type3.Optional(NonEmptyString),
  rejectedAt: Type3.Optional(NonEmptyString),
  quarantinedAt: Type3.Optional(NonEmptyString),
  staleAt: Type3.Optional(NonEmptyString),
  statusReason: Type3.Optional(Type3.String())
});
var SkillProposalManifestEntrySchema = closedObject({
  id: NonEmptyString,
  kind: SkillProposalKindSchema,
  status: SkillProposalStatusSchema,
  title: NonEmptyString,
  description: NonEmptyString,
  skillName: NonEmptyString,
  skillKey: NonEmptyString,
  createdAt: NonEmptyString,
  updatedAt: NonEmptyString,
  scanState: SkillProposalScanStateSchema
});
var SkillsProposalsListParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString)
});
var SkillsProposalsListResultSchema = closedObject({
  schema: Type3.Literal("openclaw.skill-workshop.proposals-manifest.v1"),
  updatedAt: NonEmptyString,
  proposals: Type3.Array(SkillProposalManifestEntrySchema)
});
var SkillsProposalInspectParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  proposalId: NonEmptyString
});
var SkillsProposalInspectResultSchema = closedObject({
  record: SkillProposalRecordSchema,
  content: Type3.String(),
  supportFiles: Type3.Optional(Type3.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 }))
});
var SkillsProposalCreateParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  name: NonEmptyString,
  description: NonEmptyString,
  content: SkillProposalContentString,
  supportFiles: Type3.Optional(Type3.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
  goal: Type3.Optional(Type3.String()),
  evidence: Type3.Optional(Type3.String())
});
var SkillsProposalUpdateParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  skillName: NonEmptyString,
  description: Type3.Optional(NonEmptyString),
  content: SkillProposalContentString,
  supportFiles: Type3.Optional(Type3.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
  goal: Type3.Optional(Type3.String()),
  evidence: Type3.Optional(Type3.String())
});
var SkillsProposalReviseParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  proposalId: NonEmptyString,
  content: SkillProposalContentString,
  supportFiles: Type3.Optional(Type3.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
  description: Type3.Optional(NonEmptyString),
  goal: Type3.Optional(Type3.String()),
  evidence: Type3.Optional(Type3.String())
});
var SkillsProposalRequestRevisionParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  targetAgentId: Type3.Optional(NonEmptyString),
  proposalId: NonEmptyString,
  instructions: Type3.String({ minLength: 1, maxLength: 32768 }),
  sessionKey: NonEmptyString,
  sessionId: Type3.Optional(NonEmptyString),
  idempotencyKey: NonEmptyString
});
var SkillsProposalRequestRevisionResultSchema = Type3.Object(
  {
    runId: NonEmptyString,
    status: Type3.Union([
      Type3.Literal("started"),
      Type3.Literal("in_flight"),
      Type3.Literal("ok"),
      Type3.Literal("timeout"),
      Type3.Literal("error")
    ])
  },
  { additionalProperties: true }
);
var SkillsProposalActionParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  proposalId: NonEmptyString,
  reason: Type3.Optional(Type3.String())
});
var SkillsProposalApplyResultSchema = closedObject({
  record: SkillProposalRecordSchema,
  targetSkillFile: NonEmptyString
});
var SkillLifecycleStateSchema = Type3.Union([
  Type3.Literal("active"),
  Type3.Literal("stale"),
  Type3.Literal("archived")
]);
var SkillCuratorEntrySchema = closedObject({
  skillFile: NonEmptyString,
  skillKey: NonEmptyString,
  skillName: NonEmptyString,
  state: SkillLifecycleStateSchema,
  pinned: Type3.Boolean(),
  createdAtMs: Type3.Number(),
  stateChangedAtMs: Type3.Number(),
  lastUsedAtMs: Type3.Union([Type3.Number(), Type3.Null()]),
  useCount: Type3.Number(),
  archivedReason: Type3.Union([Type3.String(), Type3.Null()])
});
var SkillOverlapCandidateSchema = closedObject({
  left: NonEmptyString,
  right: NonEmptyString,
  score: Type3.Number()
});
var SkillsCuratorStatusParamsSchema = closedObject({});
var SkillsCuratorStatusResultSchema = closedObject({
  lastAttemptAtMs: Type3.Union([Type3.Number(), Type3.Null()]),
  lastSuccessAtMs: Type3.Union([Type3.Number(), Type3.Null()]),
  lastError: Type3.Union([Type3.String(), Type3.Null()]),
  counts: closedObject({
    active: Type3.Number(),
    stale: Type3.Number(),
    archived: Type3.Number()
  }),
  skills: Type3.Array(SkillCuratorEntrySchema),
  overlaps: Type3.Array(SkillOverlapCandidateSchema)
});
var SkillsCuratorActionParamsSchema = closedObject({ skill: NonEmptyString });
var ToolsCatalogParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  includePlugins: Type3.Optional(Type3.Boolean())
});
var ToolsEffectiveParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  sessionKey: NonEmptyString
});
var ToolsInvokeParamsSchema = closedObject({
  name: NonEmptyString,
  args: Type3.Optional(Type3.Record(Type3.String(), Type3.Unknown())),
  sessionKey: Type3.Optional(NonEmptyString),
  agentId: Type3.Optional(NonEmptyString),
  confirm: Type3.Optional(Type3.Boolean()),
  idempotencyKey: Type3.Optional(NonEmptyString),
  /**
   * Explicit operation-local marker for an authenticated direct operator.
   * Missing values remain delegated, and agent runtime identity wins server-side.
   */
  conversationReadOrigin: Type3.Optional(Type3.Literal("direct-operator"))
});
var ToolCatalogProfileSchema = closedObject({
  id: Type3.Union([
    Type3.Literal("minimal"),
    Type3.Literal("coding"),
    Type3.Literal("messaging"),
    Type3.Literal("full")
  ]),
  label: NonEmptyString
});
var ToolCatalogEntrySchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  description: Type3.String(),
  source: Type3.Union([Type3.Literal("core"), Type3.Literal("plugin")]),
  pluginId: Type3.Optional(NonEmptyString),
  optional: Type3.Optional(Type3.Boolean()),
  risk: Type3.Optional(
    Type3.Union([Type3.Literal("low"), Type3.Literal("medium"), Type3.Literal("high")])
  ),
  tags: Type3.Optional(Type3.Array(NonEmptyString)),
  defaultProfiles: Type3.Array(
    Type3.Union([
      Type3.Literal("minimal"),
      Type3.Literal("coding"),
      Type3.Literal("messaging"),
      Type3.Literal("full")
    ])
  )
});
var ToolCatalogGroupSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  source: Type3.Union([Type3.Literal("core"), Type3.Literal("plugin")]),
  pluginId: Type3.Optional(NonEmptyString),
  tools: Type3.Array(ToolCatalogEntrySchema)
});
var ToolsCatalogResultSchema = closedObject({
  agentId: NonEmptyString,
  profiles: Type3.Array(ToolCatalogProfileSchema),
  groups: Type3.Array(ToolCatalogGroupSchema)
});
var ToolsEffectiveEntrySchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  description: Type3.String(),
  rawDescription: Type3.String(),
  source: Type3.Union([
    Type3.Literal("core"),
    Type3.Literal("plugin"),
    Type3.Literal("channel"),
    Type3.Literal("mcp")
  ]),
  pluginId: Type3.Optional(NonEmptyString),
  channelId: Type3.Optional(NonEmptyString),
  risk: Type3.Optional(
    Type3.Union([Type3.Literal("low"), Type3.Literal("medium"), Type3.Literal("high")])
  ),
  tags: Type3.Optional(Type3.Array(NonEmptyString))
});
var ToolsEffectiveGroupSchema = closedObject({
  id: Type3.Union([
    Type3.Literal("core"),
    Type3.Literal("plugin"),
    Type3.Literal("channel"),
    Type3.Literal("mcp")
  ]),
  label: NonEmptyString,
  source: Type3.Union([
    Type3.Literal("core"),
    Type3.Literal("plugin"),
    Type3.Literal("channel"),
    Type3.Literal("mcp")
  ]),
  tools: Type3.Array(ToolsEffectiveEntrySchema)
});
var ToolsEffectiveNoticeSchema = closedObject({
  id: NonEmptyString,
  severity: Type3.Union([Type3.Literal("info"), Type3.Literal("warning")]),
  message: Type3.String()
});
var ToolsEffectiveResultSchema = closedObject({
  agentId: NonEmptyString,
  profile: NonEmptyString,
  groups: Type3.Array(ToolsEffectiveGroupSchema),
  notices: Type3.Optional(Type3.Array(ToolsEffectiveNoticeSchema))
});
var ToolsInvokeErrorSchema = closedObject({
  code: NonEmptyString,
  message: NonEmptyString,
  details: Type3.Optional(Type3.Unknown())
});
var ToolsInvokeResultSchema = closedObject({
  ok: Type3.Boolean(),
  toolName: NonEmptyString,
  output: Type3.Optional(Type3.Unknown()),
  requiresApproval: Type3.Optional(Type3.Boolean()),
  approvalId: Type3.Optional(NonEmptyString),
  source: Type3.Optional(
    Type3.Union([
      Type3.Literal("core"),
      Type3.Literal("plugin"),
      Type3.Literal("mcp"),
      Type3.Literal("channel"),
      Type3.String()
    ])
  ),
  error: Type3.Optional(ToolsInvokeErrorSchema)
});

// packages/gateway-protocol/src/schema/skill-history.ts
import { Type as Type4 } from "typebox";

// packages/gateway-protocol/src/protocol-validator.ts
import { Compile } from "typebox/compile";
// @__NO_SIDE_EFFECTS__
function lazyCompile(schema, precheck) {
  let compiled;
  let errors = null;
  const getCompiled = () => {
    compiled ??= Compile(schema);
    return compiled;
  };
  const validate = ((data) => {
    const precheckError = precheck?.(data);
    if (precheckError) {
      errors = [precheckError];
      return false;
    }
    const current = getCompiled();
    const valid = current.Check(data);
    errors = valid ? null : [...current.Errors(data)];
    return valid;
  });
  Object.defineProperties(validate, {
    errors: {
      configurable: true,
      enumerable: true,
      get: () => errors,
      set: (nextErrors) => {
        errors = nextErrors ?? null;
      }
    },
    schema: {
      configurable: true,
      enumerable: true,
      get: () => schema
    }
  });
  return validate;
}

// packages/gateway-protocol/src/schema/skill-history.ts
var SkillsProposalHistoryStatusParamsSchema = Type4.Object(
  { agentId: Type4.Optional(NonEmptyString) },
  { additionalProperties: false }
);
var SkillsProposalHistoryScanParamsSchema = Type4.Object(
  {
    agentId: Type4.Optional(NonEmptyString),
    direction: Type4.Optional(Type4.Union([Type4.Literal("older"), Type4.Literal("newer")]))
  },
  { additionalProperties: false }
);
var SkillsProposalHistoryScanResultSchema = Type4.Object(
  {
    schema: Type4.Literal("openclaw.skill-workshop.history-scan.v1"),
    hasScanned: Type4.Boolean(),
    reviewedSessions: Type4.Integer({ minimum: 0 }),
    ideasFound: Type4.Integer({ minimum: 0 }),
    hasMore: Type4.Boolean(),
    lastScanReviewed: Type4.Integer({ minimum: 0 }),
    lastScanIdeas: Type4.Integer({ minimum: 0 }),
    lastScanAt: Type4.Optional(NonEmptyString),
    oldestReviewedAt: Type4.Optional(NonEmptyString),
    newestReviewedAt: Type4.Optional(NonEmptyString)
  },
  { additionalProperties: false }
);
var validateSkillsProposalHistoryStatusParams = lazyCompile(
  SkillsProposalHistoryStatusParamsSchema
);
var validateSkillsProposalHistoryScanParams = lazyCompile(
  SkillsProposalHistoryScanParamsSchema
);

// packages/gateway-protocol/src/schema/skill-protocol-schemas.ts
var SkillWorkshopProtocolSchemas = {
  SkillsProposalsListParams: SkillsProposalsListParamsSchema,
  SkillsProposalsListResult: SkillsProposalsListResultSchema,
  SkillsProposalHistoryStatusParams: SkillsProposalHistoryStatusParamsSchema,
  SkillsProposalHistoryScanParams: SkillsProposalHistoryScanParamsSchema,
  SkillsProposalHistoryScanResult: SkillsProposalHistoryScanResultSchema
};
export {
  SkillWorkshopProtocolSchemas
};
