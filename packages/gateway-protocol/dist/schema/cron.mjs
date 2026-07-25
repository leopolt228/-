// packages/gateway-protocol/src/schema/cron.ts
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

// packages/gateway-protocol/src/schema/cron.ts
function cronAgentTurnPayloadSchema(params) {
  return closedObject({
    kind: Type3.Literal("agentTurn"),
    message: params.message,
    model: Type3.Optional(params.model),
    fallbacks: Type3.Optional(params.fallbacks),
    thinking: Type3.Optional(params.thinking),
    timeoutSeconds: Type3.Optional(Type3.Number({ minimum: 0 })),
    allowUnsafeExternalContent: Type3.Optional(Type3.Boolean()),
    lightContext: Type3.Optional(Type3.Boolean()),
    toolsAllow: Type3.Optional(params.toolsAllow),
    // Server-managed marker for auto-stamped defaults; persisted so CLI cron
    // runs can drop only the cap that was never user-explicit.
    toolsAllowIsDefault: Type3.Optional(Type3.Boolean())
  });
}
function cronCommandPayloadSchema(params) {
  return closedObject({
    kind: Type3.Literal("command"),
    argv: params.argv,
    cwd: Type3.Optional(Type3.String({ minLength: 1 })),
    env: Type3.Optional(Type3.Record(Type3.String({ minLength: 1 }), Type3.String())),
    input: Type3.Optional(Type3.String()),
    timeoutSeconds: Type3.Optional(Type3.Number({ minimum: 0 })),
    noOutputTimeoutSeconds: Type3.Optional(Type3.Number({ minimum: 0 })),
    outputMaxBytes: Type3.Optional(Type3.Integer({ minimum: 1 })),
    toolsAllow: Type3.Optional(params.toolsAllow),
    toolsAllowIsDefault: Type3.Optional(Type3.Boolean())
  });
}
function cronScriptPayloadSchema(params) {
  return closedObject({
    kind: Type3.Literal("script"),
    script: params.script,
    timeoutSeconds: Type3.Optional(Type3.Number({ minimum: 1 })),
    toolBudget: Type3.Optional(Type3.Integer({ minimum: 1 })),
    toolsAllow: Type3.Optional(params.toolsAllow),
    toolsAllowIsDefault: Type3.Optional(Type3.Boolean())
  });
}
var CronSessionTargetSchema = Type3.Union([
  Type3.Literal("main"),
  Type3.Literal("isolated"),
  Type3.Literal("current"),
  Type3.String({ pattern: "^session:.+" })
]);
var CronWakeModeSchema = Type3.Union([Type3.Literal("next-heartbeat"), Type3.Literal("now")]);
function cronRunStatusSchema(options = {}) {
  return Type3.Union([Type3.Literal("ok"), Type3.Literal("error"), Type3.Literal("skipped")], options);
}
var CronRunStatusSchema = cronRunStatusSchema();
var CronConfigRevisionSchema = Type3.String({ minLength: 1, maxLength: 128 });
var DeprecatedCronRunStatusSchema = cronRunStatusSchema({
  deprecated: true,
  description: "Deprecated alias for lastRunStatus."
});
var CronSortDirSchema = Type3.Union([Type3.Literal("asc"), Type3.Literal("desc")]);
var CronJobsEnabledFilterSchema = Type3.Union([
  Type3.Literal("all"),
  Type3.Literal("enabled"),
  Type3.Literal("disabled")
]);
var CronJobsScheduleKindFilterSchema = Type3.Union([
  Type3.Literal("all"),
  Type3.Literal("at"),
  Type3.Literal("every"),
  Type3.Literal("cron"),
  Type3.Literal("on-exit")
]);
var CronJobsLastRunStatusFilterSchema = Type3.Union([
  Type3.Literal("all"),
  Type3.Literal("ok"),
  Type3.Literal("error"),
  Type3.Literal("skipped"),
  Type3.Literal("unknown")
]);
var CronJobsSortBySchema = Type3.Union([
  Type3.Literal("nextRunAtMs"),
  Type3.Literal("updatedAtMs"),
  Type3.Literal("name")
]);
var CronRunsStatusFilterSchema = Type3.Union([
  Type3.Literal("all"),
  Type3.Literal("ok"),
  Type3.Literal("error"),
  Type3.Literal("skipped")
]);
var CronRunsStatusValueSchema = Type3.Union([
  Type3.Literal("ok"),
  Type3.Literal("error"),
  Type3.Literal("skipped")
]);
var CronDeliveryStatusSchema = Type3.Union([
  Type3.Literal("delivered"),
  Type3.Literal("not-delivered"),
  Type3.Literal("unknown"),
  Type3.Literal("not-requested")
]);
var NonBlankString = Type3.String({ minLength: 1, pattern: "\\S" });
var CronDeclarationKeySchema = Type3.String({ minLength: 1, maxLength: 200, pattern: "\\S" });
var CronDisplayNameSchema = Type3.String({ minLength: 1, maxLength: 200, pattern: "\\S" });
var CronOwnerSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  sessionKey: Type3.Optional(NonEmptyString)
});
var CronAnnounceChannelSchema = Type3.Union([Type3.Literal("last"), NonBlankString]);
var CronFailoverReasonSchema = Type3.Union([
  Type3.Literal("auth"),
  Type3.Literal("auth_permanent"),
  Type3.Literal("format"),
  Type3.Literal("rate_limit"),
  Type3.Literal("overloaded"),
  Type3.Literal("billing"),
  Type3.Literal("server_error"),
  Type3.Literal("timeout"),
  Type3.Literal("context_overflow"),
  Type3.Literal("model_not_found"),
  Type3.Literal("session_expired"),
  Type3.Literal("empty_response"),
  Type3.Literal("no_error_details"),
  Type3.Literal("unclassified"),
  Type3.Literal("unknown")
]);
var CronRunDiagnosticSeveritySchema = Type3.Union([
  Type3.Literal("info"),
  Type3.Literal("warn"),
  Type3.Literal("error")
]);
var CronRunDiagnosticSourceSchema = Type3.Union([
  Type3.Literal("cron-preflight"),
  Type3.Literal("cron-setup"),
  Type3.Literal("model-preflight"),
  Type3.Literal("agent-run"),
  Type3.Literal("tool"),
  Type3.Literal("exec"),
  Type3.Literal("delivery")
]);
var CronRunDiagnosticSchema = closedObject({
  ts: Type3.Integer({ minimum: 0 }),
  source: CronRunDiagnosticSourceSchema,
  severity: CronRunDiagnosticSeveritySchema,
  message: Type3.String(),
  toolName: Type3.Optional(Type3.String()),
  exitCode: Type3.Optional(Type3.Union([Type3.Number(), Type3.Null()])),
  truncated: Type3.Optional(Type3.Boolean())
});
var CronRunDiagnosticsSchema = closedObject({
  summary: Type3.Optional(Type3.String()),
  entries: Type3.Array(CronRunDiagnosticSchema)
});
var CronCommonOptionalFields = {
  agentId: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
  sessionKey: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
  description: Type3.Optional(Type3.String()),
  enabled: Type3.Optional(Type3.Boolean()),
  deleteAfterRun: Type3.Optional(Type3.Boolean())
};
function cronIdOrJobIdParams(extraFields) {
  return Type3.Union([
    closedObject({
      id: NonEmptyString,
      ...extraFields
    }),
    closedObject({
      jobId: NonEmptyString,
      ...extraFields
    })
  ]);
}
var CronRunLogJobIdSchema = Type3.String({
  minLength: 1,
  // Prevent path traversal via separators in cron.runs id/jobId.
  pattern: "^[^/\\\\]+$"
});
var CronScheduleSchema = Type3.Union([
  closedObject({
    kind: Type3.Literal("at"),
    at: NonEmptyString
  }),
  closedObject({
    kind: Type3.Literal("every"),
    everyMs: Type3.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
    anchorMs: Type3.Optional(Type3.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }))
  }),
  closedObject({
    kind: Type3.Literal("cron"),
    expr: NonEmptyString,
    tz: Type3.Optional(Type3.String()),
    staggerMs: Type3.Optional(Type3.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }))
  }),
  closedObject({
    // Event-driven trigger: fires once when the gateway-owned watcher running
    // `command` exits. Survives per-turn CLI teardown (runs under the gateway
    // ProcessSupervisor, not the turn process tree).
    kind: Type3.Literal("on-exit"),
    command: NonEmptyString,
    cwd: Type3.Optional(NonEmptyString)
  })
]);
var CronTriggerSchema = closedObject({
  script: Type3.String({ minLength: 1, maxLength: 65536 }),
  once: Type3.Optional(Type3.Boolean())
});
var CronPacingSchema = Type3.Object(
  {
    min: Type3.Optional(NonBlankString),
    max: Type3.Optional(NonBlankString)
  },
  {
    additionalProperties: false,
    description: "Dynamic-cadence bounds; at least one of min or max is required"
  }
);
var CronPayloadSchema = Type3.Union([
  closedObject({
    kind: Type3.Literal("systemEvent"),
    text: NonEmptyString,
    toolsAllow: Type3.Optional(Type3.Array(Type3.String())),
    toolsAllowIsDefault: Type3.Optional(Type3.Boolean())
  }),
  cronAgentTurnPayloadSchema({
    message: NonEmptyString,
    model: Type3.String(),
    fallbacks: Type3.Array(Type3.String()),
    toolsAllow: Type3.Array(Type3.String()),
    thinking: Type3.String()
  }),
  cronCommandPayloadSchema({
    argv: Type3.Array(NonEmptyString, { minItems: 1 }),
    toolsAllow: Type3.Array(Type3.String())
  }),
  cronScriptPayloadSchema({
    script: Type3.String({ minLength: 1, maxLength: 65536 }),
    toolsAllow: Type3.Array(Type3.String())
  })
]);
var CronPayloadPatchSchema = Type3.Union([
  closedObject({
    kind: Type3.Literal("systemEvent"),
    text: Type3.Optional(NonEmptyString),
    toolsAllow: Type3.Optional(Type3.Union([Type3.Array(Type3.String()), Type3.Null()])),
    toolsAllowIsDefault: Type3.Optional(Type3.Boolean())
  }),
  cronAgentTurnPayloadSchema({
    message: Type3.Optional(NonEmptyString),
    model: Type3.Union([Type3.String(), Type3.Null()]),
    fallbacks: Type3.Union([Type3.Array(Type3.String()), Type3.Null()]),
    toolsAllow: Type3.Union([Type3.Array(Type3.String()), Type3.Null()]),
    thinking: Type3.Union([Type3.String(), Type3.Null()])
  }),
  cronCommandPayloadSchema({
    argv: Type3.Optional(Type3.Array(NonEmptyString, { minItems: 1 })),
    toolsAllow: Type3.Union([Type3.Array(Type3.String()), Type3.Null()])
  }),
  cronScriptPayloadSchema({
    script: Type3.Optional(Type3.String({ minLength: 1, maxLength: 65536 })),
    toolsAllow: Type3.Union([Type3.Array(Type3.String()), Type3.Null()])
  })
]);
var CronFailureAlertSchema = closedObject({
  after: Type3.Optional(Type3.Integer({ minimum: 1 })),
  channel: Type3.Optional(CronAnnounceChannelSchema),
  to: Type3.Optional(NonBlankString),
  cooldownMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  includeSkipped: Type3.Optional(Type3.Boolean()),
  mode: Type3.Optional(Type3.Union([Type3.Literal("announce"), Type3.Literal("webhook")])),
  accountId: Type3.Optional(NonEmptyString)
});
var CronFailureAlertPatchSchema = closedObject({
  after: Type3.Optional(Type3.Union([Type3.Integer({ minimum: 1 }), Type3.Null()])),
  channel: Type3.Optional(Type3.Union([CronAnnounceChannelSchema, Type3.Null()])),
  to: Type3.Optional(Type3.Union([NonBlankString, Type3.Null()])),
  cooldownMs: Type3.Optional(Type3.Union([Type3.Integer({ minimum: 0 }), Type3.Null()])),
  includeSkipped: Type3.Optional(Type3.Union([Type3.Boolean(), Type3.Null()])),
  mode: Type3.Optional(Type3.Union([Type3.Literal("announce"), Type3.Literal("webhook"), Type3.Null()])),
  accountId: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()]))
});
var CronFailureDestinationSchema = closedObject({
  channel: Type3.Optional(CronAnnounceChannelSchema),
  to: Type3.Optional(NonBlankString),
  accountId: Type3.Optional(NonEmptyString),
  mode: Type3.Optional(Type3.Union([Type3.Literal("announce"), Type3.Literal("webhook")]))
});
var CronFailureDestinationPatchSchema = closedObject({
  channel: Type3.Optional(Type3.Union([CronAnnounceChannelSchema, Type3.Null()])),
  to: Type3.Optional(Type3.Union([NonBlankString, Type3.Null()])),
  accountId: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
  mode: Type3.Optional(Type3.Union([Type3.Literal("announce"), Type3.Literal("webhook"), Type3.Null()]))
});
var CronCompletionDestinationSchema = closedObject({
  mode: Type3.Literal("webhook"),
  to: NonBlankString
});
var CronDeliverySharedProperties = {
  channel: Type3.Optional(CronAnnounceChannelSchema),
  threadId: Type3.Optional(Type3.Union([Type3.String(), Type3.Number()])),
  accountId: Type3.Optional(NonEmptyString),
  bestEffort: Type3.Optional(Type3.Boolean()),
  failureDestination: Type3.Optional(CronFailureDestinationSchema)
};
var CronDeliveryPatchSharedProperties = {
  channel: Type3.Optional(Type3.Union([CronAnnounceChannelSchema, Type3.Null()])),
  threadId: Type3.Optional(Type3.Union([Type3.String(), Type3.Number(), Type3.Null()])),
  accountId: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
  bestEffort: Type3.Optional(Type3.Boolean()),
  failureDestination: Type3.Optional(Type3.Union([CronFailureDestinationPatchSchema, Type3.Null()]))
};
var CronDeliveryNoopSchema = closedObject({
  mode: Type3.Literal("none"),
  ...CronDeliverySharedProperties,
  to: Type3.Optional(NonBlankString)
});
var CronDeliveryAnnounceSchema = closedObject({
  mode: Type3.Literal("announce"),
  ...CronDeliverySharedProperties,
  completionDestination: Type3.Optional(CronCompletionDestinationSchema),
  to: Type3.Optional(NonBlankString)
});
var CronDeliveryWebhookSchema = closedObject({
  mode: Type3.Literal("webhook"),
  ...CronDeliverySharedProperties,
  to: NonBlankString
});
var CronDeliverySchema = Type3.Union([
  CronDeliveryNoopSchema,
  CronDeliveryAnnounceSchema,
  CronDeliveryWebhookSchema
]);
var CronDeliveryPatchSchema = closedObject({
  mode: Type3.Optional(
    Type3.Union([Type3.Literal("none"), Type3.Literal("announce"), Type3.Literal("webhook")])
  ),
  ...CronDeliveryPatchSharedProperties,
  completionDestination: Type3.Optional(Type3.Union([CronCompletionDestinationSchema, Type3.Null()])),
  to: Type3.Optional(Type3.Union([NonBlankString, Type3.Null()]))
});
var CronFailureNotificationDeliverySchema = closedObject({
  delivered: Type3.Optional(Type3.Boolean()),
  status: CronDeliveryStatusSchema,
  error: Type3.Optional(Type3.String())
});
var CronJobStateSchema = closedObject({
  nextRunAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  runningAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  lastRunAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  lastRunStatus: Type3.Optional(CronRunStatusSchema),
  lastStatus: Type3.Optional(DeprecatedCronRunStatusSchema),
  lastError: Type3.Optional(Type3.String()),
  lastDiagnostics: Type3.Optional(CronRunDiagnosticsSchema),
  lastDiagnosticSummary: Type3.Optional(Type3.String()),
  lastErrorReason: Type3.Optional(CronFailoverReasonSchema),
  lastDurationMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  consecutiveErrors: Type3.Optional(Type3.Integer({ minimum: 0 })),
  consecutiveSkipped: Type3.Optional(Type3.Integer({ minimum: 0 })),
  lastDelivered: Type3.Optional(Type3.Boolean()),
  lastDeliveryStatus: Type3.Optional(CronDeliveryStatusSchema),
  lastDeliveryError: Type3.Optional(Type3.String()),
  lastFailureNotificationDelivered: Type3.Optional(Type3.Boolean()),
  lastFailureNotificationDeliveryStatus: Type3.Optional(CronDeliveryStatusSchema),
  lastFailureNotificationDeliveryError: Type3.Optional(Type3.String()),
  lastFailureAlertAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  lastTriggerEvalAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  triggerEvalCount: Type3.Optional(Type3.Integer({ minimum: 0 })),
  lastTriggerFireAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  triggerState: Type3.Optional(Type3.Unknown())
});
var CronJobStatePatchSchema = closedObject({
  nextRunAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  runningAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  lastRunAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  lastRunStatus: Type3.Optional(CronRunStatusSchema),
  lastStatus: Type3.Optional(DeprecatedCronRunStatusSchema),
  lastError: Type3.Optional(Type3.String()),
  lastErrorReason: Type3.Optional(CronFailoverReasonSchema),
  lastDurationMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  consecutiveErrors: Type3.Optional(Type3.Integer({ minimum: 0 })),
  consecutiveSkipped: Type3.Optional(Type3.Integer({ minimum: 0 })),
  lastDelivered: Type3.Optional(Type3.Boolean()),
  lastDeliveryStatus: Type3.Optional(CronDeliveryStatusSchema),
  lastDeliveryError: Type3.Optional(Type3.String()),
  lastFailureNotificationDelivered: Type3.Optional(Type3.Boolean()),
  lastFailureNotificationDeliveryStatus: Type3.Optional(CronDeliveryStatusSchema),
  lastFailureNotificationDeliveryError: Type3.Optional(Type3.String()),
  lastFailureAlertAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  lastTriggerEvalAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  triggerEvalCount: Type3.Optional(Type3.Integer({ minimum: 0 })),
  lastTriggerFireAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  triggerState: Type3.Optional(Type3.Unknown())
});
var CronJobSchema = closedObject({
  id: NonEmptyString,
  declarationKey: Type3.Optional(CronDeclarationKeySchema),
  displayName: Type3.Optional(CronDisplayNameSchema),
  owner: Type3.Optional(CronOwnerSchema),
  agentId: Type3.Optional(NonEmptyString),
  sessionKey: Type3.Optional(NonEmptyString),
  name: NonEmptyString,
  description: Type3.Optional(Type3.String()),
  enabled: Type3.Boolean(),
  deleteAfterRun: Type3.Optional(Type3.Boolean()),
  createdAtMs: Type3.Integer({ minimum: 0 }),
  updatedAtMs: Type3.Integer({ minimum: 0 }),
  /** Opaque Gateway-computed token for the job definition, excluding scheduler state. */
  configRevision: Type3.Optional(CronConfigRevisionSchema),
  schedule: CronScheduleSchema,
  pacing: Type3.Optional(CronPacingSchema),
  trigger: Type3.Optional(CronTriggerSchema),
  sessionTarget: CronSessionTargetSchema,
  wakeMode: CronWakeModeSchema,
  payload: CronPayloadSchema,
  delivery: Type3.Optional(CronDeliverySchema),
  failureAlert: Type3.Optional(Type3.Union([Type3.Literal(false), CronFailureAlertSchema])),
  state: CronJobStateSchema,
  nextRunAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  lastRunAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  lastRunStatus: Type3.Optional(CronRunStatusSchema),
  lastRunError: Type3.Optional(Type3.String()),
  lastDelivered: Type3.Optional(Type3.Boolean()),
  lastDeliveryStatus: Type3.Optional(CronDeliveryStatusSchema),
  lastDeliveryError: Type3.Optional(Type3.String()),
  lastFailureNotificationDelivered: Type3.Optional(Type3.Boolean()),
  lastFailureNotificationDeliveryStatus: Type3.Optional(CronDeliveryStatusSchema),
  lastFailureNotificationDeliveryError: Type3.Optional(Type3.String())
});
var CronListParamsSchema = closedObject({
  includeDisabled: Type3.Optional(Type3.Boolean()),
  limit: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 200 })),
  offset: Type3.Optional(Type3.Integer({ minimum: 0 })),
  query: Type3.Optional(Type3.String()),
  enabled: Type3.Optional(CronJobsEnabledFilterSchema),
  scheduleKind: Type3.Optional(CronJobsScheduleKindFilterSchema),
  lastRunStatus: Type3.Optional(CronJobsLastRunStatusFilterSchema),
  sortBy: Type3.Optional(CronJobsSortBySchema),
  sortDir: Type3.Optional(CronSortDirSchema),
  agentId: Type3.Optional(NonEmptyString),
  compact: Type3.Optional(Type3.Boolean())
});
var CronStatusParamsSchema = closedObject({});
var CronGetParamsSchema = cronIdOrJobIdParams({});
var CronAddParamsSchema = closedObject({
  name: NonEmptyString,
  declarationKey: Type3.Optional(CronDeclarationKeySchema),
  displayName: Type3.Optional(CronDisplayNameSchema),
  owner: Type3.Optional(CronOwnerSchema),
  ...CronCommonOptionalFields,
  schedule: CronScheduleSchema,
  pacing: Type3.Optional(CronPacingSchema),
  trigger: Type3.Optional(CronTriggerSchema),
  sessionTarget: CronSessionTargetSchema,
  wakeMode: CronWakeModeSchema,
  payload: CronPayloadSchema,
  delivery: Type3.Optional(CronDeliverySchema),
  failureAlert: Type3.Optional(Type3.Union([Type3.Literal(false), CronFailureAlertSchema]))
});
var CronDeclarativeAddResultSchema = closedObject({
  created: Type3.Boolean(),
  updated: Type3.Optional(Type3.Boolean()),
  job: CronJobSchema
});
var CronAddResultSchema = Type3.Union([CronJobSchema, CronDeclarativeAddResultSchema]);
var CronJobPatchSchema = closedObject({
  name: Type3.Optional(NonEmptyString),
  displayName: Type3.Optional(Type3.Union([CronDisplayNameSchema, Type3.Null()])),
  ...CronCommonOptionalFields,
  schedule: Type3.Optional(CronScheduleSchema),
  pacing: Type3.Optional(Type3.Union([CronPacingSchema, Type3.Null()])),
  trigger: Type3.Optional(Type3.Union([CronTriggerSchema, Type3.Null()])),
  sessionTarget: Type3.Optional(CronSessionTargetSchema),
  wakeMode: Type3.Optional(CronWakeModeSchema),
  payload: Type3.Optional(CronPayloadPatchSchema),
  delivery: Type3.Optional(CronDeliveryPatchSchema),
  failureAlert: Type3.Optional(
    Type3.Union([Type3.Literal(false), CronFailureAlertPatchSchema, Type3.Null()])
  ),
  state: Type3.Optional(CronJobStatePatchSchema)
});
var CronUpdateParamsSchema = cronIdOrJobIdParams({
  patch: CronJobPatchSchema,
  /** Rejects the patch when the current definition does not match the caller's token. */
  expectedConfigRevision: Type3.Optional(CronConfigRevisionSchema)
});
var CronRemoveParamsSchema = cronIdOrJobIdParams({});
var CronRunParamsSchema = cronIdOrJobIdParams({
  mode: Type3.Optional(Type3.Union([Type3.Literal("due"), Type3.Literal("force")])),
  /** Rejects the mutation if the Gateway restarted after the caller's preflight. */
  expectedProcessInstanceId: Type3.Optional(NonEmptyString)
});
var CronRunsParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  scope: Type3.Optional(Type3.Union([Type3.Literal("job"), Type3.Literal("all")])),
  id: Type3.Optional(CronRunLogJobIdSchema),
  jobId: Type3.Optional(CronRunLogJobIdSchema),
  runId: Type3.Optional(NonEmptyString),
  limit: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 200 })),
  offset: Type3.Optional(Type3.Integer({ minimum: 0 })),
  statuses: Type3.Optional(Type3.Array(CronRunsStatusValueSchema, { minItems: 1, maxItems: 3 })),
  status: Type3.Optional(CronRunsStatusFilterSchema),
  deliveryStatuses: Type3.Optional(
    Type3.Array(CronDeliveryStatusSchema, { minItems: 1, maxItems: 4 })
  ),
  deliveryStatus: Type3.Optional(CronDeliveryStatusSchema),
  query: Type3.Optional(Type3.String()),
  sortDir: Type3.Optional(CronSortDirSchema)
});
var CronRunLogEntrySchema = closedObject({
  ts: Type3.Integer({ minimum: 0 }),
  jobId: NonEmptyString,
  action: Type3.Literal("finished"),
  status: Type3.Optional(CronRunStatusSchema),
  error: Type3.Optional(Type3.String()),
  errorReason: Type3.Optional(CronFailoverReasonSchema),
  summary: Type3.Optional(Type3.String()),
  diagnostics: Type3.Optional(CronRunDiagnosticsSchema),
  delivered: Type3.Optional(Type3.Boolean()),
  deliveryStatus: Type3.Optional(CronDeliveryStatusSchema),
  deliveryError: Type3.Optional(Type3.String()),
  failureNotificationDelivery: Type3.Optional(CronFailureNotificationDeliverySchema),
  sessionId: Type3.Optional(NonEmptyString),
  sessionKey: Type3.Optional(NonEmptyString),
  runId: Type3.Optional(NonEmptyString),
  runAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  durationMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  nextRunAtMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  triggerFired: Type3.Optional(Type3.Boolean()),
  model: Type3.Optional(Type3.String()),
  provider: Type3.Optional(Type3.String()),
  usage: Type3.Optional(
    closedObject({
      input_tokens: Type3.Optional(Type3.Number()),
      output_tokens: Type3.Optional(Type3.Number()),
      total_tokens: Type3.Optional(Type3.Number()),
      cache_read_tokens: Type3.Optional(Type3.Number()),
      cache_write_tokens: Type3.Optional(Type3.Number())
    })
  ),
  jobName: Type3.Optional(Type3.String())
});
export {
  CronAddParamsSchema,
  CronAddResultSchema,
  CronDeclarativeAddResultSchema,
  CronDeliverySchema,
  CronGetParamsSchema,
  CronJobSchema,
  CronJobStateSchema,
  CronListParamsSchema,
  CronPacingSchema,
  CronRemoveParamsSchema,
  CronRunLogEntrySchema,
  CronRunParamsSchema,
  CronRunsParamsSchema,
  CronStatusParamsSchema,
  CronUpdateParamsSchema
};
