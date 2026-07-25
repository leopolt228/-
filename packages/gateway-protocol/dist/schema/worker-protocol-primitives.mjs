// packages/gateway-protocol/src/schema/worker-protocol-primitives.ts
import { Type as Type2 } from "typebox";

// packages/gateway-protocol/src/schema/closed-object.ts
import { Type } from "typebox";
function closedObject(properties) {
  return Type.Object(properties, { additionalProperties: false });
}

// packages/gateway-protocol/src/schema/worker-protocol-primitives.ts
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
export {
  LiveIntegerSchema,
  LiveSequenceSchema,
  LiveTextSchema,
  WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH,
  WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH,
  WORKER_PROTOCOL_MAX_PAYLOAD_BYTES,
  WorkerAdmissionFailureReasonSchema,
  WorkerErrorResponseFrameSchema,
  WorkerErrorShapeSchema,
  WorkerFrameIdSchema,
  WorkerIdentifierSchema,
  WorkerProtocolCloseReasonSchema,
  WorkerTranscriptAssistantDiagnosticSchema,
  WorkerTranscriptUsageSchema
};
