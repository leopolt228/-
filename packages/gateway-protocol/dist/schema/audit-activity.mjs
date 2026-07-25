// packages/gateway-protocol/src/schema/audit-activity.ts
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

// packages/gateway-protocol/src/schema/audit-activity.ts
var AuditActivitySchemaVersionV1Schema = Type3.Integer({ minimum: 1, maximum: 1 });
var AuditActivityStatusV1Schema = Type3.Union([
  Type3.Literal("started"),
  Type3.Literal("succeeded"),
  Type3.Literal("failed"),
  Type3.Literal("cancelled"),
  Type3.Literal("timed_out"),
  Type3.Literal("blocked"),
  Type3.Literal("unknown")
]);
var AuditActivityKindV1Schema = Type3.Union([
  Type3.Literal("agent_run"),
  Type3.Literal("tool_action"),
  Type3.Literal("message")
]);
var AuditActivityDirectionV1Schema = Type3.Union([
  Type3.Literal("inbound"),
  Type3.Literal("outbound")
]);
var AuditActivityConversationKindV1Schema = Type3.Union([
  Type3.Literal("direct"),
  Type3.Literal("group"),
  Type3.Literal("channel"),
  Type3.Literal("unknown")
]);
var AuditActivityHmacRefV1Schema = Type3.String({
  pattern: "^hmac-sha256:v1:[a-f0-9]{32}:[a-f0-9]{64}$"
});
var AuditActivityAgentActorV1Schema = closedObject({
  type: Type3.Union([Type3.Literal("agent"), Type3.Literal("system")]),
  id: NonEmptyString
});
var AuditActivityInboundActorV1Schema = Type3.Union([
  closedObject({
    type: Type3.Literal("channel_sender"),
    id: AuditActivityHmacRefV1Schema
  }),
  closedObject({
    type: Type3.Literal("system"),
    id: NonEmptyString
  })
]);
var AuditActivityOutboundActorV1Schema = closedObject({
  type: Type3.Union([Type3.Literal("agent"), Type3.Literal("system")]),
  id: NonEmptyString
});
var commonProperties = {
  schemaVersion: AuditActivitySchemaVersionV1Schema,
  eventId: NonEmptyString,
  sequence: Type3.Integer({ minimum: 1 }),
  sourceSequence: Type3.Integer({ minimum: 1 }),
  occurredAt: Type3.Integer({ minimum: 0 }),
  redaction: Type3.Literal("metadata_only")
};
var agentProperties = {
  actor: AuditActivityAgentActorV1Schema,
  agentId: NonEmptyString,
  sessionKey: Type3.Optional(NonEmptyString),
  sessionId: Type3.Optional(NonEmptyString),
  runId: NonEmptyString
};
var messageProperties = {
  channel: NonEmptyString,
  conversationKind: AuditActivityConversationKindV1Schema,
  durationMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  resultCount: Type3.Optional(Type3.Integer({ minimum: 0 })),
  agentId: Type3.Optional(NonEmptyString),
  runId: Type3.Optional(NonEmptyString),
  accountRef: Type3.Optional(AuditActivityHmacRefV1Schema),
  conversationRef: Type3.Optional(AuditActivityHmacRefV1Schema),
  messageRef: Type3.Optional(AuditActivityHmacRefV1Schema),
  targetRef: Type3.Optional(AuditActivityHmacRefV1Schema)
};
function correlatedObject(properties, variants) {
  return Type3.Object(properties, { additionalProperties: false, allOf: [variants] });
}
function withoutField(field) {
  return { not: { required: [field] } };
}
var withoutErrorCode = withoutField("errorCode");
var withoutReasonCode = withoutField("reasonCode");
var withoutFailureStage = withoutField("failureStage");
var withoutDeliveryKind = withoutField("deliveryKind");
var agentRunProperties = {
  eventType: Type3.Literal("agent_run"),
  ...commonProperties,
  ...agentProperties,
  kind: Type3.Literal("agent_run")
};
var AuditActivityAgentRunV1Schema = correlatedObject(
  {
    ...agentRunProperties,
    action: Type3.Union([Type3.Literal("agent.run.started"), Type3.Literal("agent.run.finished")]),
    status: Type3.Union([
      Type3.Literal("started"),
      Type3.Literal("succeeded"),
      Type3.Literal("failed"),
      Type3.Literal("cancelled"),
      Type3.Literal("timed_out"),
      Type3.Literal("blocked")
    ]),
    errorCode: Type3.Optional(
      Type3.Union([
        Type3.Literal("run_failed"),
        Type3.Literal("run_cancelled"),
        Type3.Literal("run_timed_out"),
        Type3.Literal("run_blocked")
      ])
    )
  },
  Type3.Union([
    Type3.Intersect([
      Type3.Object({
        action: Type3.Literal("agent.run.started"),
        status: Type3.Literal("started")
      }),
      withoutErrorCode
    ]),
    Type3.Intersect([
      Type3.Object({
        action: Type3.Literal("agent.run.finished"),
        status: Type3.Literal("succeeded")
      }),
      withoutErrorCode
    ]),
    Type3.Object({
      action: Type3.Literal("agent.run.finished"),
      status: Type3.Literal("failed"),
      errorCode: Type3.Literal("run_failed")
    }),
    Type3.Object({
      action: Type3.Literal("agent.run.finished"),
      status: Type3.Literal("cancelled"),
      errorCode: Type3.Literal("run_cancelled")
    }),
    Type3.Object({
      action: Type3.Literal("agent.run.finished"),
      status: Type3.Literal("timed_out"),
      errorCode: Type3.Literal("run_timed_out")
    }),
    Type3.Object({
      action: Type3.Literal("agent.run.finished"),
      status: Type3.Literal("blocked"),
      errorCode: Type3.Literal("run_blocked")
    })
  ])
);
var toolActionProperties = {
  eventType: Type3.Literal("tool_action"),
  ...commonProperties,
  ...agentProperties,
  kind: Type3.Literal("tool_action"),
  toolCallId: Type3.Optional(NonEmptyString),
  toolName: Type3.Optional(NonEmptyString)
};
var AuditActivityToolActionV1Schema = correlatedObject(
  {
    ...toolActionProperties,
    action: Type3.Union([Type3.Literal("tool.action.started"), Type3.Literal("tool.action.finished")]),
    status: AuditActivityStatusV1Schema,
    errorCode: Type3.Optional(
      Type3.Union([
        Type3.Literal("tool_failed"),
        Type3.Literal("tool_cancelled"),
        Type3.Literal("tool_timed_out"),
        Type3.Literal("tool_blocked"),
        Type3.Literal("tool_outcome_unknown")
      ])
    )
  },
  Type3.Union([
    Type3.Intersect([
      Type3.Object({
        action: Type3.Literal("tool.action.started"),
        status: Type3.Literal("started")
      }),
      withoutErrorCode
    ]),
    Type3.Intersect([
      Type3.Object({
        action: Type3.Literal("tool.action.finished"),
        status: Type3.Literal("succeeded")
      }),
      withoutErrorCode
    ]),
    Type3.Object({
      action: Type3.Literal("tool.action.finished"),
      status: Type3.Literal("failed"),
      errorCode: Type3.Literal("tool_failed")
    }),
    Type3.Object({
      action: Type3.Literal("tool.action.finished"),
      status: Type3.Literal("cancelled"),
      errorCode: Type3.Literal("tool_cancelled")
    }),
    Type3.Object({
      action: Type3.Literal("tool.action.finished"),
      status: Type3.Literal("timed_out"),
      errorCode: Type3.Literal("tool_timed_out")
    }),
    Type3.Object({
      action: Type3.Literal("tool.action.finished"),
      status: Type3.Literal("blocked"),
      errorCode: Type3.Literal("tool_blocked")
    }),
    Type3.Object({
      action: Type3.Literal("tool.action.finished"),
      status: Type3.Literal("unknown"),
      errorCode: Type3.Literal("tool_outcome_unknown")
    })
  ])
);
var inboundMessageProperties = {
  eventType: Type3.Literal("inbound_message"),
  ...commonProperties,
  ...messageProperties,
  kind: Type3.Literal("message"),
  action: Type3.Literal("message.inbound.processed"),
  direction: Type3.Literal("inbound"),
  actor: AuditActivityInboundActorV1Schema
};
var inboundCompletedReasonSchema = Type3.Union([
  Type3.Literal("fast_abort"),
  Type3.Literal("plugin_bound_handled"),
  Type3.Literal("plugin_bound_unavailable"),
  Type3.Literal("plugin_bound_declined"),
  Type3.Literal("before_dispatch_handled"),
  Type3.Literal("acp_dispatch_completed"),
  Type3.Literal("acp_dispatch_empty")
]);
var inboundSkippedReasonSchema = Type3.Union([
  Type3.Literal("duplicate"),
  Type3.Literal("reply_operation_active"),
  Type3.Literal("reply_operation_aborted"),
  Type3.Literal("acp_dispatch_aborted")
]);
var inboundFailureReasonSchema = Type3.Union([
  Type3.Literal("acp_dispatch_failed"),
  Type3.Literal("plugin_bound_error")
]);
var AuditActivityInboundMessageV1Schema = correlatedObject(
  {
    ...inboundMessageProperties,
    status: Type3.Union([
      Type3.Literal("succeeded"),
      Type3.Literal("blocked"),
      Type3.Literal("failed")
    ]),
    outcome: Type3.Union([
      Type3.Literal("completed"),
      Type3.Literal("skipped"),
      Type3.Literal("failed")
    ]),
    errorCode: Type3.Optional(Type3.Literal("message_processing_failed")),
    reasonCode: Type3.Optional(
      Type3.Union([
        ...inboundCompletedReasonSchema.anyOf,
        ...inboundSkippedReasonSchema.anyOf,
        ...inboundFailureReasonSchema.anyOf
      ])
    )
  },
  Type3.Union([
    Type3.Intersect([
      Type3.Object({
        status: Type3.Literal("succeeded"),
        outcome: Type3.Literal("completed"),
        reasonCode: Type3.Optional(inboundCompletedReasonSchema)
      }),
      withoutErrorCode
    ]),
    Type3.Intersect([
      Type3.Object({
        status: Type3.Literal("blocked"),
        outcome: Type3.Literal("skipped"),
        reasonCode: Type3.Optional(inboundSkippedReasonSchema)
      }),
      withoutErrorCode
    ]),
    Type3.Object({
      status: Type3.Literal("failed"),
      outcome: Type3.Literal("failed"),
      errorCode: Type3.Literal("message_processing_failed"),
      reasonCode: Type3.Optional(inboundFailureReasonSchema)
    })
  ])
);
var outboundMessageProperties = {
  eventType: Type3.Literal("outbound_message"),
  ...commonProperties,
  ...messageProperties,
  kind: Type3.Literal("message"),
  action: Type3.Literal("message.outbound.finished"),
  direction: Type3.Literal("outbound"),
  actor: AuditActivityOutboundActorV1Schema,
  deliveryKind: Type3.Optional(
    Type3.Union([Type3.Literal("text"), Type3.Literal("media"), Type3.Literal("other")])
  )
};
var outboundSuppressedReasonSchema = Type3.Union([
  Type3.Literal("cancelled_by_message_sending_hook"),
  Type3.Literal("cancelled_by_reply_payload_sending_hook"),
  Type3.Literal("empty_after_message_sending_hook"),
  Type3.Literal("empty_after_reply_payload_sending_hook"),
  Type3.Literal("no_visible_payload")
]);
var outboundFailureStageSchema = Type3.Union([
  Type3.Literal("platform_send"),
  Type3.Literal("queue"),
  Type3.Literal("unknown")
]);
var outboundFailureErrorSchema = Type3.Union([
  Type3.Literal("message_delivery_failed"),
  Type3.Literal("message_delivery_partial_failure")
]);
var AuditActivityOutboundMessageV1Schema = correlatedObject(
  {
    ...outboundMessageProperties,
    status: Type3.Union([
      Type3.Literal("succeeded"),
      Type3.Literal("blocked"),
      Type3.Literal("failed"),
      Type3.Literal("unknown")
    ]),
    outcome: Type3.Union([
      Type3.Literal("sent"),
      Type3.Literal("suppressed"),
      Type3.Literal("failed"),
      Type3.Literal("unknown")
    ]),
    errorCode: Type3.Optional(outboundFailureErrorSchema),
    reasonCode: Type3.Optional(outboundSuppressedReasonSchema),
    failureStage: Type3.Optional(outboundFailureStageSchema)
  },
  Type3.Union([
    Type3.Intersect([
      Type3.Object({ status: Type3.Literal("succeeded"), outcome: Type3.Literal("sent") }),
      withoutErrorCode,
      withoutReasonCode,
      withoutFailureStage
    ]),
    Type3.Intersect([
      Type3.Object({
        status: Type3.Literal("blocked"),
        outcome: Type3.Literal("suppressed"),
        reasonCode: outboundSuppressedReasonSchema
      }),
      withoutErrorCode,
      withoutFailureStage,
      withoutDeliveryKind
    ]),
    Type3.Intersect([
      Type3.Object({
        status: Type3.Literal("failed"),
        outcome: Type3.Literal("failed"),
        errorCode: outboundFailureErrorSchema,
        failureStage: outboundFailureStageSchema
      }),
      withoutReasonCode
    ]),
    Type3.Intersect([
      Type3.Object({
        status: Type3.Literal("unknown"),
        outcome: Type3.Literal("unknown"),
        failureStage: outboundFailureStageSchema
      }),
      withoutErrorCode,
      withoutReasonCode,
      withoutDeliveryKind
    ])
  ])
);
var AuditActivityEventV1Schema = Type3.Union([
  AuditActivityAgentRunV1Schema,
  AuditActivityToolActionV1Schema,
  AuditActivityInboundMessageV1Schema,
  AuditActivityOutboundMessageV1Schema
]);
var AuditActivityListParamsSchema = closedObject({
  agentId: Type3.Optional(NonEmptyString),
  sessionKey: Type3.Optional(NonEmptyString),
  runId: Type3.Optional(NonEmptyString),
  kind: Type3.Optional(AuditActivityKindV1Schema),
  status: Type3.Optional(AuditActivityStatusV1Schema),
  direction: Type3.Optional(AuditActivityDirectionV1Schema),
  channel: Type3.Optional(NonEmptyString),
  after: Type3.Optional(Type3.Integer({ minimum: 0 })),
  before: Type3.Optional(Type3.Integer({ minimum: 0 })),
  limit: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 500 })),
  cursor: Type3.Optional(NonEmptyString)
});
var AuditActivityListResultSchema = closedObject({
  events: Type3.Array(AuditActivityEventV1Schema),
  nextCursor: Type3.Optional(NonEmptyString)
});
export {
  AuditActivityAgentRunV1Schema,
  AuditActivityEventV1Schema,
  AuditActivityInboundMessageV1Schema,
  AuditActivityListParamsSchema,
  AuditActivityListResultSchema,
  AuditActivityOutboundMessageV1Schema,
  AuditActivityToolActionV1Schema
};
