// packages/gateway-protocol/src/schema/gateway-suspend.ts
import { Type as Type2 } from "typebox";

// packages/gateway-protocol/src/schema/closed-object.ts
import { Type } from "typebox";
function closedObject(properties) {
  return Type.Object(properties, { additionalProperties: false });
}

// packages/gateway-protocol/src/schema/gateway-suspend.ts
var SuspensionTokenSchema = Type2.String({ minLength: 1, maxLength: 128, pattern: "\\S" });
var CountSchema = Type2.Integer({ minimum: 0 });
var GatewaySuspendTaskBlockerSchema = closedObject({
  taskId: Type2.String(),
  status: Type2.Literal("running"),
  runtime: Type2.Union([
    Type2.Literal("subagent"),
    Type2.Literal("acp"),
    Type2.Literal("cli"),
    Type2.Literal("cron")
  ]),
  runId: Type2.Optional(Type2.String()),
  label: Type2.Optional(Type2.String()),
  title: Type2.Optional(Type2.String())
});
var GatewaySuspendBlockerSchema = closedObject({
  kind: Type2.Union([
    Type2.Literal("queue"),
    Type2.Literal("reply"),
    Type2.Literal("embedded-run"),
    Type2.Literal("background-exec"),
    Type2.Literal("cron-run"),
    Type2.Literal("task"),
    Type2.Literal("root-request"),
    Type2.Literal("session-admission"),
    Type2.Literal("session-mutation"),
    Type2.Literal("chat-run"),
    Type2.Literal("queued-turn"),
    Type2.Literal("terminal-persistence"),
    Type2.Literal("terminal-session")
  ]),
  count: CountSchema,
  message: Type2.String(),
  task: Type2.Optional(GatewaySuspendTaskBlockerSchema)
});
var GatewaySuspendPrepareParamsSchema = closedObject({ requestId: SuspensionTokenSchema });
var GatewaySuspendPrepareBusyResultSchema = closedObject({
  status: Type2.Literal("busy"),
  reason: Type2.Union([Type2.Literal("active-work"), Type2.Literal("gateway-draining")]),
  retryAfterMs: CountSchema,
  activeCount: CountSchema,
  blockers: Type2.Array(GatewaySuspendBlockerSchema)
});
var GatewaySuspendPrepareReadyResultSchema = closedObject({
  status: Type2.Literal("ready"),
  suspensionId: SuspensionTokenSchema,
  expiresAtMs: CountSchema,
  activeCount: CountSchema,
  blockers: Type2.Array(GatewaySuspendBlockerSchema)
});
var GatewaySuspendPrepareResultSchema = Type2.Union([
  GatewaySuspendPrepareBusyResultSchema,
  GatewaySuspendPrepareReadyResultSchema
]);
var GatewaySuspendStatusParamsSchema = closedObject({
  suspensionId: SuspensionTokenSchema
});
var GatewaySuspendStatusRunningResultSchema = closedObject({
  status: Type2.Literal("running")
});
var GatewaySuspendStatusReadyResultSchema = closedObject({
  status: Type2.Literal("ready"),
  expiresAtMs: CountSchema
});
var GatewaySuspendStatusResultSchema = Type2.Union([
  GatewaySuspendStatusRunningResultSchema,
  GatewaySuspendStatusReadyResultSchema
]);
var GatewaySuspendResumeParamsSchema = GatewaySuspendStatusParamsSchema;
var GatewaySuspendResumeResultSchema = closedObject({
  ok: Type2.Literal(true),
  status: Type2.Literal("running"),
  resumed: Type2.Boolean()
});
export {
  GatewaySuspendBlockerSchema,
  GatewaySuspendPrepareBusyResultSchema,
  GatewaySuspendPrepareParamsSchema,
  GatewaySuspendPrepareReadyResultSchema,
  GatewaySuspendPrepareResultSchema,
  GatewaySuspendResumeParamsSchema,
  GatewaySuspendResumeResultSchema,
  GatewaySuspendStatusParamsSchema,
  GatewaySuspendStatusReadyResultSchema,
  GatewaySuspendStatusResultSchema,
  GatewaySuspendStatusRunningResultSchema,
  GatewaySuspendTaskBlockerSchema
};
