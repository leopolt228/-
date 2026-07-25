// packages/gateway-protocol/src/schema/worker-inference.ts
import { Type as Type4 } from "typebox";
import { Value } from "typebox/value";

// packages/gateway-protocol/src/schema/closed-object.ts
import { Type } from "typebox";
function closedObject(properties) {
  return Type.Object(properties, { additionalProperties: false });
}

// packages/gateway-protocol/src/schema/worker-admission.ts
import { Type as Type3 } from "typebox";

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

// packages/gateway-protocol/src/schema/since.ts
function withSince(train, schema) {
  Object.assign(schema, { "x-openclaw-since": train });
  return schema;
}

// packages/gateway-protocol/src/schema/worker-protocol-primitives.ts
import { Type as Type2 } from "typebox";
var WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH = 256;
var WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH = 128;
var WORKER_PROTOCOL_MAX_PAYLOAD_BYTES = 64 * 1024;
var WorkerIdentifierSchema = Type2.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH,
  pattern: "^\\S(?:.*\\S)?$"
});
var WorkerFrameIdSchema = Type2.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH
});
var WorkerAdmissionFailureReasonSchema = Type2.Union([
  Type2.Literal("invalid-credential"),
  Type2.Literal("credential-expired"),
  Type2.Literal("environment-mismatch"),
  Type2.Literal("environment-unavailable"),
  Type2.Literal("bundle-mismatch"),
  Type2.Literal("version-mismatch"),
  Type2.Literal("session-mismatch"),
  Type2.Literal("placement-mismatch"),
  Type2.Literal("owner-epoch-mismatch"),
  Type2.Literal("rpc-set-mismatch"),
  Type2.Literal("protocol-features-mismatch")
]);
var WorkerProtocolCloseReasonSchema = Type2.Union([
  WorkerAdmissionFailureReasonSchema,
  Type2.Literal("invalid-handshake"),
  Type2.Literal("protocol-mismatch"),
  Type2.Literal("gateway-unavailable"),
  Type2.Literal("invalid-frame"),
  Type2.Literal("slow-consumer"),
  Type2.Literal("method-not-allowed"),
  Type2.Literal("invalid-heartbeat"),
  Type2.Literal("credential-replaced"),
  Type2.Literal("gateway-shutdown")
]);
var WorkerErrorCodeSchema = Type2.Union([
  Type2.Literal("INVALID_REQUEST"),
  Type2.Literal("UNAVAILABLE")
]);
var WorkerErrorDetailsSchema = closedObject({ reason: WorkerProtocolCloseReasonSchema });
var WorkerErrorShapeSchema = closedObject({
  code: WorkerErrorCodeSchema,
  message: Type2.String({ minLength: 1, maxLength: 256 }),
  details: WorkerErrorDetailsSchema,
  retryable: Type2.Optional(Type2.Boolean()),
  retryAfterMs: Type2.Optional(Type2.Integer({ minimum: 0 }))
});
var WorkerErrorResponseFrameSchema = closedObject({
  type: Type2.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type2.Literal(false),
  error: WorkerErrorShapeSchema
});
var WorkerTranscriptUsageSchema = closedObject({
  input: Type2.Number({ minimum: 0 }),
  output: Type2.Number({ minimum: 0 }),
  cacheRead: Type2.Number({ minimum: 0 }),
  cacheWrite: Type2.Number({ minimum: 0 }),
  contextUsage: Type2.Optional(
    Type2.Union([
      closedObject({
        state: Type2.Literal("available"),
        promptTokens: Type2.Number({ minimum: 0 }),
        totalTokens: Type2.Number({ minimum: 0 })
      }),
      closedObject({ state: Type2.Literal("unavailable") })
    ])
  ),
  totalTokens: Type2.Number({ minimum: 0 }),
  cost: closedObject({
    input: Type2.Number({ minimum: 0 }),
    output: Type2.Number({ minimum: 0 }),
    cacheRead: Type2.Number({ minimum: 0 }),
    cacheWrite: Type2.Number({ minimum: 0 }),
    total: Type2.Number({ minimum: 0 }),
    totalOrigin: Type2.Optional(Type2.Literal("provider-billed"))
  })
});
var WorkerTranscriptAssistantDiagnosticSchema = closedObject({
  type: WorkerIdentifierSchema,
  timestamp: Type2.Integer({ minimum: 0 }),
  error: Type2.Optional(
    closedObject({
      name: Type2.Optional(Type2.String({ maxLength: 256 })),
      message: Type2.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
      stack: Type2.Optional(Type2.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
      code: Type2.Optional(Type2.Union([Type2.String({ maxLength: 256 }), Type2.Number()]))
    })
  ),
  details: Type2.Optional(
    Type2.Record(Type2.String({ minLength: 1, maxLength: 256 }), Type2.Unknown())
  )
});
var LiveTextSchema = Type2.String({
  maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
});
var LiveIntegerSchema = Type2.Integer({
  minimum: 0,
  maximum: Number.MAX_SAFE_INTEGER
});
var LiveSequenceSchema = Type2.Integer({
  minimum: 1,
  maximum: Number.MAX_SAFE_INTEGER
});

// packages/gateway-protocol/src/schema/worker-admission.ts
var WORKER_PROTOCOL_METHODS = [
  "worker.heartbeat",
  "worker.transcript.commit",
  "worker.live-event"
];
var WORKER_PROTOCOL_MAX_FEATURES = 64;
var WORKER_PROTOCOL_MAX_FEATURE_LENGTH = 128;
var WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES = 64;
var WORKER_TRANSCRIPT_MAX_CONTENT_PARTS = 128;
var WORKER_TRANSCRIPT_MAX_JSON_DEPTH = 32;
var WorkerCredentialSchema = Type3.String({ minLength: 16, maxLength: 256 });
var WorkerProtocolFeatureSchema = Type3.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_FEATURE_LENGTH
});
var WorkerBundleHashSchema = Type3.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var WorkerAdmissionHandshakeSchema = withSince(
  "2026.7",
  closedObject({
    bundleHash: WorkerBundleHashSchema,
    openclawVersion: Type3.String({ minLength: 1, maxLength: 128 }),
    protocolFeatures: Type3.Array(WorkerProtocolFeatureSchema, {
      maxItems: WORKER_PROTOCOL_MAX_FEATURES,
      uniqueItems: true
    })
  })
);
var WorkerConnectAdmissionCommonProperties = {
  environmentId: WorkerIdentifierSchema,
  credential: WorkerCredentialSchema,
  ownerEpoch: Type3.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  rpcSetVersion: Type3.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
  handshake: WorkerAdmissionHandshakeSchema
};
var WorkerConnectAdmissionSchema = Type3.Union([
  closedObject({
    ...WorkerConnectAdmissionCommonProperties,
    sessionId: Type3.Null(),
    runId: Type3.Null()
  }),
  closedObject({
    ...WorkerConnectAdmissionCommonProperties,
    sessionId: WorkerIdentifierSchema,
    runId: WorkerIdentifierSchema
  })
]);
var WorkerConnectParamsSchema = closedObject({
  minProtocol: Type3.Integer({ minimum: 1 }),
  maxProtocol: Type3.Integer({ minimum: 1 }),
  client: closedObject({
    id: Type3.Literal(GATEWAY_CLIENT_IDS.WORKER),
    version: Type3.String({ minLength: 1, maxLength: 128 }),
    platform: Type3.String({ minLength: 1, maxLength: 128 }),
    mode: Type3.Literal(GATEWAY_CLIENT_MODES.WORKER)
  }),
  role: Type3.Literal("worker"),
  admission: WorkerConnectAdmissionSchema
});
var WorkerConnectRequestFrameSchema = closedObject({
  type: Type3.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type3.Literal("connect"),
  params: WorkerConnectParamsSchema
});
var WorkerHelloOkSchema = closedObject({
  type: Type3.Literal("worker-hello-ok"),
  environmentId: WorkerIdentifierSchema,
  sessionId: Type3.Union([WorkerIdentifierSchema, Type3.Null()]),
  ownerEpoch: Type3.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  rpcSetVersion: Type3.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
  protocolFeatures: Type3.Array(WorkerProtocolFeatureSchema, {
    maxItems: WORKER_PROTOCOL_MAX_FEATURES,
    uniqueItems: true
  }),
  credentialExpiresAtMs: Type3.Integer({ minimum: 0 }),
  policy: closedObject({
    heartbeatIntervalMs: Type3.Integer({ minimum: 1 }),
    maxPayload: Type3.Integer({ minimum: 1 })
  })
});
var WorkerAdmissionSuccessResponseFrameSchema = closedObject({
  type: Type3.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type3.Literal(true),
  payload: WorkerHelloOkSchema
});
var WorkerAdmissionResponseFrameSchema = Type3.Union([
  WorkerAdmissionSuccessResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
var WorkerStatusSchema = Type3.Union([
  Type3.Literal("ready"),
  Type3.Literal("busy"),
  Type3.Literal("draining")
]);
var WorkerHeartbeatParamsSchema = closedObject({
  sentAtMs: Type3.Integer({ minimum: 0 }),
  status: WorkerStatusSchema
});
var WorkerHeartbeatResultSchema = closedObject({
  receivedAtMs: Type3.Integer({ minimum: 0 }),
  status: Type3.Literal("ok"),
  ownerEpoch: Type3.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER })
});
var WorkerHeartbeatRequestFrameSchema = closedObject({
  type: Type3.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type3.Literal(WORKER_PROTOCOL_METHODS[0]),
  params: WorkerHeartbeatParamsSchema
});
var WorkerHeartbeatSuccessResponseFrameSchema = closedObject({
  type: Type3.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type3.Literal(true),
  payload: WorkerHeartbeatResultSchema
});
var WorkerHeartbeatResponseFrameSchema = Type3.Union([
  WorkerHeartbeatSuccessResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
var WorkerTranscriptTextContentSchema = closedObject({
  type: Type3.Literal("text"),
  text: Type3.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
  textSignature: Type3.Optional(
    Type3.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })
  )
});
var WorkerTranscriptThinkingContentSchema = closedObject({
  type: Type3.Literal("thinking"),
  thinking: Type3.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
  thinkingSignature: Type3.Optional(
    Type3.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })
  ),
  redacted: Type3.Optional(Type3.Boolean())
});
var WorkerTranscriptImageContentSchema = closedObject({
  type: Type3.Literal("image"),
  data: Type3.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
  mimeType: Type3.String({ minLength: 1, maxLength: 256 })
});
var WorkerTranscriptToolCallSchema = closedObject({
  type: Type3.Literal("toolCall"),
  id: WorkerIdentifierSchema,
  name: WorkerIdentifierSchema,
  arguments: Type3.Record(Type3.String({ minLength: 1, maxLength: 256 }), Type3.Unknown()),
  thoughtSignature: Type3.Optional(
    Type3.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })
  ),
  executionMode: Type3.Optional(Type3.Union([Type3.Literal("sequential"), Type3.Literal("parallel")]))
});
var WorkerTranscriptUserMessageSchema = closedObject({
  role: Type3.Literal("user"),
  content: Type3.Array(
    Type3.Union([WorkerTranscriptTextContentSchema, WorkerTranscriptImageContentSchema]),
    { minItems: 1, maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
  ),
  timestamp: Type3.Integer({ minimum: 0 })
});
var WorkerTranscriptAssistantMessageSchema = closedObject({
  role: Type3.Literal("assistant"),
  content: Type3.Array(
    Type3.Union([
      WorkerTranscriptTextContentSchema,
      WorkerTranscriptThinkingContentSchema,
      WorkerTranscriptToolCallSchema
    ]),
    { maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
  ),
  api: WorkerIdentifierSchema,
  provider: WorkerIdentifierSchema,
  model: WorkerIdentifierSchema,
  responseModel: Type3.Optional(WorkerIdentifierSchema),
  responseId: Type3.Optional(WorkerIdentifierSchema),
  diagnostics: Type3.Optional(
    Type3.Array(WorkerTranscriptAssistantDiagnosticSchema, {
      maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
    })
  ),
  usage: WorkerTranscriptUsageSchema,
  stopReason: Type3.Union([
    Type3.Literal("stop"),
    Type3.Literal("length"),
    Type3.Literal("toolUse"),
    Type3.Literal("error"),
    Type3.Literal("aborted")
  ]),
  errorMessage: Type3.Optional(Type3.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
  errorCode: Type3.Optional(Type3.String({ maxLength: 256 })),
  errorType: Type3.Optional(Type3.String({ maxLength: 256 })),
  errorBody: Type3.Optional(Type3.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
  timestamp: Type3.Integer({ minimum: 0 })
});
var WorkerTranscriptToolResultMessageSchema = closedObject({
  role: Type3.Literal("toolResult"),
  toolCallId: WorkerIdentifierSchema,
  toolName: WorkerIdentifierSchema,
  content: Type3.Array(
    Type3.Union([WorkerTranscriptTextContentSchema, WorkerTranscriptImageContentSchema]),
    { maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
  ),
  details: Type3.Optional(Type3.Unknown()),
  isError: Type3.Boolean(),
  timestamp: Type3.Integer({ minimum: 0 })
});
var WorkerTranscriptMessageSchema = Type3.Union([
  WorkerTranscriptUserMessageSchema,
  WorkerTranscriptAssistantMessageSchema,
  WorkerTranscriptToolResultMessageSchema
]);
var WorkerTranscriptCommitParamsSchema = closedObject({
  runEpoch: Type3.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  seq: Type3.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
  baseLeafId: Type3.Union([WorkerIdentifierSchema, Type3.Null()]),
  messages: Type3.Array(WorkerTranscriptMessageSchema, {
    minItems: 1,
    maxItems: WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES
  })
});
var WorkerTranscriptCommitResultSchema = closedObject({
  entryIds: Type3.Array(WorkerIdentifierSchema, {
    minItems: 1,
    maxItems: WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES
  }),
  newLeafId: WorkerIdentifierSchema
});
var WorkerTranscriptCommitErrorReasonSchema = Type3.Union([
  Type3.Literal("stale-base-leaf"),
  Type3.Literal("epoch-mismatch"),
  Type3.Literal("invalid-batch"),
  Type3.Literal("session-not-attached")
]);
var WorkerTranscriptCommitErrorShapeSchema = closedObject({
  code: Type3.Literal("INVALID_REQUEST"),
  message: Type3.String({ minLength: 1, maxLength: 256 }),
  details: closedObject({ reason: WorkerTranscriptCommitErrorReasonSchema })
});
var WorkerTranscriptCommitRequestFrameSchema = closedObject({
  type: Type3.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type3.Literal(WORKER_PROTOCOL_METHODS[1]),
  params: WorkerTranscriptCommitParamsSchema
});
var WorkerTranscriptCommitSuccessResponseFrameSchema = closedObject({
  type: Type3.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type3.Literal(true),
  payload: WorkerTranscriptCommitResultSchema
});
var WorkerTranscriptCommitErrorResponseFrameSchema = closedObject({
  type: Type3.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type3.Literal(false),
  error: WorkerTranscriptCommitErrorShapeSchema
});
var WorkerTranscriptCommitResponseFrameSchema = Type3.Union([
  WorkerTranscriptCommitSuccessResponseFrameSchema,
  WorkerTranscriptCommitErrorResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
function workerLiveObject(properties) {
  return closedObject(properties);
}
var OptionalLiveTextSchema = Type3.Optional(LiveTextSchema);
var OptionalLiveIntegerSchema = Type3.Optional(LiveIntegerSchema);
var LiveIdentifierSchema = Type3.String({
  minLength: 1,
  maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES,
  pattern: "^\\S(?:.*\\S)?$"
});
var WorkerLiveAssistantPayloadSchema = workerLiveObject({
  text: LiveTextSchema,
  delta: LiveTextSchema,
  replace: Type3.Optional(Type3.Literal(true)),
  mediaUrls: Type3.Optional(
    Type3.Array(LiveIdentifierSchema, {
      maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
    })
  ),
  phase: Type3.Optional(Type3.Union([Type3.Literal("commentary"), Type3.Literal("final_answer")])),
  itemId: Type3.Optional(WorkerIdentifierSchema)
});
var WorkerLiveThinkingPayloadSchema = workerLiveObject({
  text: LiveTextSchema,
  delta: LiveTextSchema
});
var WorkerLiveToolCommonProperties = {
  name: WorkerIdentifierSchema,
  toolCallId: WorkerIdentifierSchema,
  hideFromChannelProgress: Type3.Optional(Type3.Literal(true))
};
var WorkerLiveToolPayloadSchema = Type3.Union([
  workerLiveObject({
    ...WorkerLiveToolCommonProperties,
    phase: Type3.Literal("start"),
    args: Type3.Unknown()
  }),
  workerLiveObject({
    ...WorkerLiveToolCommonProperties,
    phase: Type3.Literal("update"),
    partialResult: Type3.Unknown()
  }),
  workerLiveObject({
    ...WorkerLiveToolCommonProperties,
    phase: Type3.Literal("result"),
    meta: OptionalLiveTextSchema,
    isError: Type3.Boolean(),
    result: Type3.Unknown(),
    toolErrorSummary: OptionalLiveTextSchema
  })
]);
var WorkerLiveApprovalCommonProperties = {
  kind: Type3.Union([Type3.Literal("exec"), Type3.Literal("plugin"), Type3.Literal("unknown")]),
  title: LiveTextSchema,
  itemId: Type3.Optional(WorkerIdentifierSchema),
  toolCallId: Type3.Optional(WorkerIdentifierSchema),
  approvalId: Type3.Optional(WorkerIdentifierSchema),
  approvalSlug: Type3.Optional(WorkerIdentifierSchema),
  command: OptionalLiveTextSchema,
  host: OptionalLiveTextSchema,
  reason: OptionalLiveTextSchema,
  scope: Type3.Optional(Type3.Union([Type3.Literal("turn"), Type3.Literal("session")])),
  message: OptionalLiveTextSchema
};
var WorkerLiveApprovalPayloadSchema = Type3.Union([
  workerLiveObject({
    ...WorkerLiveApprovalCommonProperties,
    phase: Type3.Literal("requested"),
    status: Type3.Union([Type3.Literal("pending"), Type3.Literal("unavailable")])
  }),
  workerLiveObject({
    ...WorkerLiveApprovalCommonProperties,
    phase: Type3.Literal("resolved"),
    status: Type3.Union([Type3.Literal("approved"), Type3.Literal("denied"), Type3.Literal("failed")])
  })
]);
var WorkerLiveLifecycleStartPayloadSchema = workerLiveObject({
  phase: Type3.Literal("start"),
  startedAt: LiveIntegerSchema
});
var WorkerLiveFallbackReasonSchema = Type3.Union([
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
var WorkerLiveFallbackAttemptSchema = workerLiveObject({
  provider: LiveIdentifierSchema,
  model: LiveIdentifierSchema,
  error: LiveTextSchema,
  reason: Type3.Optional(WorkerLiveFallbackReasonSchema),
  authMode: Type3.Optional(LiveIdentifierSchema),
  status: OptionalLiveIntegerSchema,
  code: Type3.Optional(Type3.String({ minLength: 1, maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }))
});
var WorkerLiveFallbackCommonProperties = {
  selectedProvider: LiveIdentifierSchema,
  selectedModel: LiveIdentifierSchema,
  activeProvider: LiveIdentifierSchema,
  activeModel: LiveIdentifierSchema
};
var WorkerLiveLifecycleFallbackPayloadSchema = workerLiveObject({
  ...WorkerLiveFallbackCommonProperties,
  phase: Type3.Literal("fallback"),
  reasonSummary: LiveTextSchema,
  attemptSummaries: Type3.Array(LiveTextSchema, {
    maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
  }),
  attempts: Type3.Array(WorkerLiveFallbackAttemptSchema, {
    maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
  })
});
var WorkerLiveLifecycleFallbackClearedPayloadSchema = workerLiveObject({
  ...WorkerLiveFallbackCommonProperties,
  phase: Type3.Literal("fallback_cleared"),
  previousActiveModel: Type3.Optional(LiveIdentifierSchema)
});
var WorkerLiveLifecycleFallbackStepPayloadSchema = workerLiveObject({
  phase: Type3.Literal("fallback_step"),
  fallbackStepType: Type3.Literal("fallback_step"),
  fallbackStepFromModel: LiveIdentifierSchema,
  fallbackStepToModel: Type3.Optional(LiveIdentifierSchema),
  fallbackStepFromFailureReason: Type3.Optional(WorkerLiveFallbackReasonSchema),
  fallbackStepFromFailureDetail: OptionalLiveTextSchema,
  fallbackStepChainPosition: OptionalLiveIntegerSchema,
  fallbackStepFinalOutcome: Type3.Union([
    Type3.Literal("next_fallback"),
    Type3.Literal("succeeded"),
    Type3.Literal("chain_exhausted")
  ])
});
var WorkerLiveLifecycleTerminalCommonProperties = {
  startedAt: OptionalLiveIntegerSchema,
  endedAt: LiveIntegerSchema,
  stopReason: Type3.Optional(WorkerIdentifierSchema),
  yielded: Type3.Optional(Type3.Literal(true)),
  timeoutPhase: Type3.Optional(
    Type3.Union([
      Type3.Literal("queue"),
      Type3.Literal("preflight"),
      Type3.Literal("provider"),
      Type3.Literal("post_turn"),
      Type3.Literal("gateway_draining")
    ])
  ),
  providerStarted: Type3.Optional(Type3.Boolean()),
  aborted: Type3.Optional(Type3.Boolean()),
  toolErrorSummary: OptionalLiveTextSchema,
  livenessState: Type3.Optional(
    Type3.Union([
      Type3.Literal("working"),
      Type3.Literal("paused"),
      Type3.Literal("blocked"),
      Type3.Literal("abandoned")
    ])
  ),
  replayInvalid: Type3.Optional(Type3.Literal(true))
};
var WorkerLiveLifecycleTerminalPayloadSchema = Type3.Union([
  workerLiveObject({
    ...WorkerLiveLifecycleTerminalCommonProperties,
    phase: Type3.Literal("finishing"),
    error: OptionalLiveTextSchema
  }),
  workerLiveObject({
    ...WorkerLiveLifecycleTerminalCommonProperties,
    phase: Type3.Literal("end")
  }),
  workerLiveObject({
    ...WorkerLiveLifecycleTerminalCommonProperties,
    phase: Type3.Literal("error"),
    error: LiveTextSchema,
    fallbackExhaustedFailure: Type3.Optional(Type3.Literal(true))
  })
]);
var WorkerLiveLifecyclePayloadSchema = Type3.Union([
  WorkerLiveLifecycleStartPayloadSchema,
  WorkerLiveLifecycleFallbackPayloadSchema,
  WorkerLiveLifecycleFallbackClearedPayloadSchema,
  WorkerLiveLifecycleFallbackStepPayloadSchema,
  WorkerLiveLifecycleTerminalPayloadSchema
]);
var WorkerLiveEventSchema = Type3.Union([
  workerLiveObject({ kind: Type3.Literal("assistant"), payload: WorkerLiveAssistantPayloadSchema }),
  workerLiveObject({ kind: Type3.Literal("thinking"), payload: WorkerLiveThinkingPayloadSchema }),
  workerLiveObject({ kind: Type3.Literal("tool"), payload: WorkerLiveToolPayloadSchema }),
  workerLiveObject({ kind: Type3.Literal("approval"), payload: WorkerLiveApprovalPayloadSchema }),
  workerLiveObject({ kind: Type3.Literal("lifecycle"), payload: WorkerLiveLifecyclePayloadSchema })
]);
var WorkerLiveEventParamsSchema = workerLiveObject({
  runEpoch: LiveIntegerSchema,
  lastAckedSeq: LiveIntegerSchema,
  seq: LiveSequenceSchema,
  runId: WorkerIdentifierSchema,
  event: WorkerLiveEventSchema
});
var WorkerLiveEventResultSchema = workerLiveObject({
  ackedSeq: LiveIntegerSchema
});
var WorkerLiveEventErrorDetailsSchema = Type3.Union([
  workerLiveObject({
    reason: Type3.Union([
      Type3.Literal("epoch-mismatch"),
      Type3.Literal("session-not-attached"),
      Type3.Literal("invalid-event"),
      Type3.Literal("capacity-exceeded")
    ])
  }),
  workerLiveObject({
    reason: Type3.Literal("resync-required"),
    ackedSeq: LiveIntegerSchema,
    expectedSeq: LiveSequenceSchema
  })
]);
var WorkerLiveEventErrorShapeSchema = workerLiveObject({
  code: Type3.Literal("INVALID_REQUEST"),
  message: Type3.String({ minLength: 1, maxLength: 256 }),
  details: WorkerLiveEventErrorDetailsSchema
});
var WorkerLiveEventRequestFrameSchema = workerLiveObject({
  type: Type3.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type3.Literal(WORKER_PROTOCOL_METHODS[2]),
  params: WorkerLiveEventParamsSchema
});
var WorkerLiveEventSuccessResponseFrameSchema = workerLiveObject({
  type: Type3.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type3.Literal(true),
  payload: WorkerLiveEventResultSchema
});
var WorkerLiveEventErrorResponseFrameSchema = workerLiveObject({
  type: Type3.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type3.Literal(false),
  error: WorkerLiveEventErrorShapeSchema
});
var WorkerLiveEventResponseFrameSchema = Type3.Union([
  WorkerLiveEventSuccessResponseFrameSchema,
  WorkerLiveEventErrorResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);

// packages/gateway-protocol/src/schema/worker-inference.ts
var WORKER_INFERENCE_PROTOCOL_FEATURE = "worker-inference-v1";
var WORKER_INFERENCE_METHODS = [
  "worker.inference.start",
  "worker.inference.cancel"
];
var WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES = 25 * 1024 * 1024;
var WORKER_INFERENCE_MAX_CONTEXT_MESSAGES = 1024;
var WORKER_INFERENCE_MAX_TOOLS = 256;
var WORKER_INFERENCE_MAX_OUTPUT_TOKENS = 1e6;
function workerInferenceObject(properties) {
  return closedObject(properties);
}
var InferenceTextSchema = Type4.String({
  maxLength: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES
});
var OptionalInferenceTextSchema = Type4.Optional(InferenceTextSchema);
var WorkerInferenceTextContentSchema = workerInferenceObject({
  type: Type4.Literal("text"),
  text: InferenceTextSchema,
  textSignature: OptionalInferenceTextSchema
});
var WorkerInferenceImageContentSchema = workerInferenceObject({
  type: Type4.Literal("image"),
  data: Type4.String({
    minLength: 1,
    maxLength: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES
  }),
  mimeType: Type4.String({ minLength: 1, maxLength: 256 })
});
var WorkerInferenceThinkingContentSchema = workerInferenceObject({
  type: Type4.Literal("thinking"),
  thinking: InferenceTextSchema,
  thinkingSignature: OptionalInferenceTextSchema,
  redacted: Type4.Optional(Type4.Boolean())
});
var WorkerInferenceToolCallSchema = workerInferenceObject({
  type: Type4.Literal("toolCall"),
  id: WorkerIdentifierSchema,
  name: WorkerIdentifierSchema,
  arguments: Type4.Record(Type4.String({ minLength: 1, maxLength: 256 }), Type4.Unknown()),
  thoughtSignature: OptionalInferenceTextSchema,
  executionMode: Type4.Optional(Type4.Union([Type4.Literal("sequential"), Type4.Literal("parallel")]))
});
var WorkerInferenceUserMessageSchema = workerInferenceObject({
  role: Type4.Literal("user"),
  content: Type4.Union([
    InferenceTextSchema,
    Type4.Array(Type4.Union([WorkerInferenceTextContentSchema, WorkerInferenceImageContentSchema]), {
      minItems: 1,
      maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
    })
  ]),
  timestamp: LiveIntegerSchema,
  runtimeContextCarrier: Type4.Optional(Type4.Boolean())
});
var WorkerInferenceAssistantMessageProperties = {
  role: Type4.Literal("assistant"),
  content: Type4.Array(
    Type4.Union([
      WorkerInferenceTextContentSchema,
      WorkerInferenceThinkingContentSchema,
      WorkerInferenceToolCallSchema
    ]),
    { maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
  ),
  api: WorkerIdentifierSchema,
  provider: WorkerIdentifierSchema,
  model: WorkerIdentifierSchema,
  responseModel: Type4.Optional(WorkerIdentifierSchema),
  responseId: Type4.Optional(WorkerIdentifierSchema),
  usage: WorkerTranscriptUsageSchema,
  timestamp: LiveIntegerSchema
};
var WorkerInferenceAssistantMessageSchema = workerInferenceObject({
  ...WorkerInferenceAssistantMessageProperties,
  stopReason: Type4.Union([Type4.Literal("stop"), Type4.Literal("length"), Type4.Literal("toolUse")])
});
var WorkerInferenceContextAssistantMessageSchema = workerInferenceObject({
  ...WorkerInferenceAssistantMessageProperties,
  diagnostics: Type4.Optional(
    Type4.Array(WorkerTranscriptAssistantDiagnosticSchema, {
      maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS
    })
  ),
  stopReason: Type4.Union([
    Type4.Literal("stop"),
    Type4.Literal("length"),
    Type4.Literal("toolUse"),
    Type4.Literal("error"),
    Type4.Literal("aborted")
  ]),
  errorMessage: OptionalInferenceTextSchema,
  errorCode: Type4.Optional(Type4.String({ maxLength: 256 })),
  errorType: Type4.Optional(Type4.String({ maxLength: 256 })),
  errorBody: OptionalInferenceTextSchema
});
var WorkerInferenceMessageSchema = Type4.Union([
  WorkerInferenceUserMessageSchema,
  WorkerInferenceContextAssistantMessageSchema,
  workerInferenceObject({
    role: Type4.Literal("toolResult"),
    toolCallId: WorkerIdentifierSchema,
    toolName: WorkerIdentifierSchema,
    content: Type4.Array(
      Type4.Union([WorkerInferenceTextContentSchema, WorkerInferenceImageContentSchema]),
      { maxItems: WORKER_TRANSCRIPT_MAX_CONTENT_PARTS }
    ),
    details: Type4.Optional(Type4.Unknown()),
    isError: Type4.Boolean(),
    timestamp: LiveIntegerSchema
  })
]);
var WorkerInferenceToolSchema = workerInferenceObject({
  name: WorkerIdentifierSchema,
  description: LiveTextSchema,
  parameters: Type4.Unknown()
});
var WorkerInferenceModelRefSchema = workerInferenceObject({
  provider: WorkerIdentifierSchema,
  model: WorkerIdentifierSchema
});
var WorkerInferenceContextSchema = workerInferenceObject({
  systemPrompt: Type4.Optional(InferenceTextSchema),
  messages: Type4.Array(WorkerInferenceMessageSchema, {
    maxItems: WORKER_INFERENCE_MAX_CONTEXT_MESSAGES
  }),
  tools: Type4.Optional(
    Type4.Array(WorkerInferenceToolSchema, { maxItems: WORKER_INFERENCE_MAX_TOOLS })
  )
});
var WorkerInferenceReasoningSchema = Type4.Union([
  Type4.Literal("off"),
  Type4.Literal("minimal"),
  Type4.Literal("low"),
  Type4.Literal("medium"),
  Type4.Literal("high"),
  Type4.Literal("xhigh"),
  Type4.Literal("adaptive"),
  Type4.Literal("max")
]);
var WorkerInferenceThinkingBudgetSchema = Type4.Integer({
  minimum: 0,
  maximum: WORKER_INFERENCE_MAX_OUTPUT_TOKENS
});
var WorkerInferenceThinkingBudgetsSchema = workerInferenceObject({
  minimal: Type4.Optional(WorkerInferenceThinkingBudgetSchema),
  low: Type4.Optional(WorkerInferenceThinkingBudgetSchema),
  medium: Type4.Optional(WorkerInferenceThinkingBudgetSchema),
  high: Type4.Optional(WorkerInferenceThinkingBudgetSchema),
  max: Type4.Optional(WorkerInferenceThinkingBudgetSchema)
});
var WorkerInferenceOptionsSchema = workerInferenceObject({
  temperature: Type4.Optional(Type4.Number({ minimum: 0, maximum: 2 })),
  maxTokens: Type4.Optional(
    Type4.Integer({ minimum: 1, maximum: WORKER_INFERENCE_MAX_OUTPUT_TOKENS })
  ),
  reasoning: Type4.Optional(WorkerInferenceReasoningSchema),
  thinkingBudgets: Type4.Optional(WorkerInferenceThinkingBudgetsSchema)
});
var WorkerInferenceIdentityProperties = {
  runEpoch: LiveIntegerSchema,
  sessionId: WorkerIdentifierSchema,
  runId: WorkerIdentifierSchema,
  turnId: WorkerIdentifierSchema
};
var WorkerInferenceStartParamsSchema = workerInferenceObject({
  ...WorkerInferenceIdentityProperties,
  modelRef: WorkerInferenceModelRefSchema,
  context: WorkerInferenceContextSchema,
  options: WorkerInferenceOptionsSchema
});
var WorkerInferenceStartResultSchema = workerInferenceObject({
  status: Type4.Union([Type4.Literal("accepted"), Type4.Literal("replayed")])
});
var WorkerInferenceErrorReasonSchema = Type4.Union([
  Type4.Literal("model-not-approved"),
  Type4.Literal("invalid-context"),
  Type4.Literal("epoch-mismatch"),
  Type4.Literal("session-not-attached"),
  Type4.Literal("provider-error"),
  Type4.Literal("cancelled")
]);
var WorkerInferenceErrorShapeSchema = workerInferenceObject({
  code: Type4.Union([Type4.Literal("INVALID_REQUEST"), Type4.Literal("UNAVAILABLE")]),
  message: Type4.String({ minLength: 1, maxLength: 256 }),
  details: workerInferenceObject({ reason: WorkerInferenceErrorReasonSchema })
});
var WorkerInferenceStartRequestFrameSchema = workerInferenceObject({
  type: Type4.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type4.Literal(WORKER_INFERENCE_METHODS[0]),
  params: WorkerInferenceStartParamsSchema
});
var WorkerInferenceStartSuccessResponseFrameSchema = workerInferenceObject({
  type: Type4.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type4.Literal(true),
  payload: WorkerInferenceStartResultSchema
});
var WorkerInferenceErrorResponseFrameSchema = workerInferenceObject({
  type: Type4.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type4.Literal(false),
  error: WorkerInferenceErrorShapeSchema
});
var WorkerInferenceStartResponseFrameSchema = Type4.Union([
  WorkerInferenceStartSuccessResponseFrameSchema,
  WorkerInferenceErrorResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
var WorkerInferenceCancelParamsSchema = workerInferenceObject({
  ...WorkerInferenceIdentityProperties
});
var WorkerInferenceCancelResultSchema = workerInferenceObject({
  status: Type4.Literal("cancelled")
});
var WorkerInferenceCancelRequestFrameSchema = workerInferenceObject({
  type: Type4.Literal("req"),
  id: WorkerFrameIdSchema,
  method: Type4.Literal(WORKER_INFERENCE_METHODS[1]),
  params: WorkerInferenceCancelParamsSchema
});
var WorkerInferenceCancelSuccessResponseFrameSchema = workerInferenceObject({
  type: Type4.Literal("res"),
  id: WorkerFrameIdSchema,
  ok: Type4.Literal(true),
  payload: WorkerInferenceCancelResultSchema
});
var WorkerInferenceCancelResponseFrameSchema = Type4.Union([
  WorkerInferenceCancelSuccessResponseFrameSchema,
  WorkerInferenceErrorResponseFrameSchema,
  WorkerErrorResponseFrameSchema
]);
var WorkerInferenceResolvedModelSchema = workerInferenceObject({
  api: WorkerIdentifierSchema,
  provider: WorkerIdentifierSchema,
  model: WorkerIdentifierSchema
});
var WorkerInferenceStreamEventSchema = Type4.Union([
  workerInferenceObject({
    type: Type4.Literal("start"),
    resolvedModel: WorkerInferenceResolvedModelSchema,
    timestamp: LiveIntegerSchema
  }),
  workerInferenceObject({
    type: Type4.Literal("text_start"),
    contentIndex: LiveIntegerSchema,
    contentSignature: OptionalInferenceTextSchema
  }),
  workerInferenceObject({
    type: Type4.Literal("text_delta"),
    contentIndex: LiveIntegerSchema,
    delta: InferenceTextSchema
  }),
  workerInferenceObject({
    type: Type4.Literal("text_end"),
    contentIndex: LiveIntegerSchema,
    contentSignature: OptionalInferenceTextSchema
  }),
  workerInferenceObject({ type: Type4.Literal("thinking_start"), contentIndex: LiveIntegerSchema }),
  workerInferenceObject({
    type: Type4.Literal("thinking_delta"),
    contentIndex: LiveIntegerSchema,
    delta: InferenceTextSchema
  }),
  workerInferenceObject({
    type: Type4.Literal("thinking_end"),
    contentIndex: LiveIntegerSchema,
    contentSignature: OptionalInferenceTextSchema
  }),
  workerInferenceObject({
    type: Type4.Literal("toolcall_start"),
    contentIndex: LiveIntegerSchema,
    id: WorkerIdentifierSchema,
    toolName: WorkerIdentifierSchema
  }),
  workerInferenceObject({
    type: Type4.Literal("toolcall_delta"),
    contentIndex: LiveIntegerSchema,
    delta: InferenceTextSchema
  }),
  workerInferenceObject({ type: Type4.Literal("toolcall_end"), contentIndex: LiveIntegerSchema })
]);
var WorkerInferenceEventParamsSchema = workerInferenceObject({
  ...WorkerInferenceIdentityProperties,
  seq: LiveSequenceSchema,
  event: WorkerInferenceStreamEventSchema
});
var WorkerInferenceEventFrameSchema = workerInferenceObject({
  type: Type4.Literal("event"),
  event: Type4.Literal("worker.inference.event"),
  payload: WorkerInferenceEventParamsSchema
});
var WorkerInferenceTerminalDoneSchema = workerInferenceObject({
  type: Type4.Literal("done"),
  message: WorkerInferenceAssistantMessageSchema
});
var WorkerInferenceTerminalErrorSchema = workerInferenceObject({
  type: Type4.Literal("error"),
  reason: WorkerInferenceErrorReasonSchema,
  message: Type4.String({ minLength: 1, maxLength: 256 }),
  usage: Type4.Optional(WorkerTranscriptUsageSchema)
});
var WorkerInferenceTerminalOutcomeSchema = Type4.Union([
  WorkerInferenceTerminalDoneSchema,
  WorkerInferenceTerminalErrorSchema
]);
var WorkerInferenceTerminalParamsSchema = workerInferenceObject({
  ...WorkerInferenceIdentityProperties,
  seq: LiveSequenceSchema,
  outcome: WorkerInferenceTerminalOutcomeSchema
});
var WorkerInferenceTerminalFrameSchema = workerInferenceObject({
  type: Type4.Literal("event"),
  event: Type4.Literal("worker.inference.terminal"),
  payload: WorkerInferenceTerminalParamsSchema
});
function isSafeWorkerInferenceJson(data) {
  const stack = [{ depth: 0, value: data }];
  const seen = /* @__PURE__ */ new WeakSet();
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || current.depth > WORKER_TRANSCRIPT_MAX_JSON_DEPTH) {
      return false;
    }
    if (current.value === null || typeof current.value === "string" || typeof current.value === "boolean") {
      continue;
    }
    if (typeof current.value === "number") {
      if (!Number.isFinite(current.value)) {
        return false;
      }
      continue;
    }
    if (typeof current.value !== "object" || seen.has(current.value)) {
      return false;
    }
    seen.add(current.value);
    const values = Array.isArray(current.value) ? current.value : Object.values(current.value);
    for (const value of values) {
      stack.push({ depth: current.depth + 1, value });
    }
  }
  return true;
}
function validateWorkerInferenceStartParams(data) {
  return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceStartParamsSchema, data);
}
function validateWorkerInferenceCancelParams(data) {
  return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceCancelParamsSchema, data);
}
function validateWorkerInferenceTerminalOutcome(data) {
  return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceTerminalOutcomeSchema, data);
}
function validateWorkerInferenceEventFrame(data) {
  return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceEventFrameSchema, data);
}
function validateWorkerInferenceTerminalFrame(data) {
  return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceTerminalFrameSchema, data);
}
export {
  WORKER_INFERENCE_MAX_CONTEXT_MESSAGES,
  WORKER_INFERENCE_MAX_OUTPUT_TOKENS,
  WORKER_INFERENCE_METHODS,
  WORKER_INFERENCE_PROTOCOL_FEATURE,
  WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES,
  WorkerInferenceCancelRequestFrameSchema,
  WorkerInferenceCancelResponseFrameSchema,
  WorkerInferenceModelRefSchema,
  WorkerInferenceOptionsSchema,
  WorkerInferenceStartRequestFrameSchema,
  WorkerInferenceStartResponseFrameSchema,
  validateWorkerInferenceCancelParams,
  validateWorkerInferenceEventFrame,
  validateWorkerInferenceStartParams,
  validateWorkerInferenceTerminalFrame,
  validateWorkerInferenceTerminalOutcome
};
