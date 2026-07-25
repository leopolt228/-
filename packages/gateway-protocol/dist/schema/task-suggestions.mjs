// packages/gateway-protocol/src/schema/task-suggestions.ts
import { Type as Type2 } from "typebox";

// packages/gateway-protocol/src/schema/closed-object.ts
import { Type } from "typebox";
function closedObject(properties) {
  return Type.Object(properties, { additionalProperties: false });
}

// packages/gateway-protocol/src/schema/task-suggestions.ts
var TaskIdSchema = Type2.String({ minLength: 1, maxLength: 128 });
var TaskTitleSchema = Type2.String({ minLength: 1, maxLength: 60 });
var TaskPromptSchema = Type2.String({ minLength: 1, maxLength: 32768 });
var TaskTldrSchema = Type2.String({ minLength: 1, maxLength: 1024 });
var TaskCwdSchema = Type2.String({ minLength: 1, maxLength: 4096 });
var TaskSessionKeySchema = Type2.String({ minLength: 1, maxLength: 512 });
var TaskAgentIdSchema = Type2.String({ minLength: 1, maxLength: 128 });
var TaskSuggestionSchema = closedObject({
  id: TaskIdSchema,
  title: TaskTitleSchema,
  prompt: TaskPromptSchema,
  tldr: TaskTldrSchema,
  cwd: TaskCwdSchema,
  sessionKey: TaskSessionKeySchema,
  agentId: Type2.Optional(TaskAgentIdSchema),
  createdAt: Type2.Integer({ minimum: 0 })
});
var TaskSuggestionsListParamsSchema = closedObject({
  sessionKey: Type2.Optional(TaskSessionKeySchema),
  agentId: Type2.Optional(TaskAgentIdSchema)
});
var TaskSuggestionsListResultSchema = closedObject({
  suggestions: Type2.Array(TaskSuggestionSchema)
});
var TaskSuggestionsCreateParamsSchema = closedObject({
  title: TaskTitleSchema,
  prompt: TaskPromptSchema,
  tldr: TaskTldrSchema,
  cwd: TaskCwdSchema,
  sessionKey: TaskSessionKeySchema,
  agentId: Type2.Optional(TaskAgentIdSchema)
});
var TaskSuggestionsCreateResultSchema = closedObject({
  taskId: TaskIdSchema,
  suggestion: TaskSuggestionSchema
});
var TaskSuggestionResolutionSchema = Type2.Union([
  Type2.Literal("dismissed"),
  Type2.Literal("accepted"),
  Type2.Literal("expired")
]);
var TaskSuggestionsAcceptParamsSchema = closedObject({ taskId: TaskIdSchema });
var TaskSuggestionsAcceptResultSchema = closedObject({
  taskId: TaskIdSchema,
  key: TaskSessionKeySchema
});
var TaskSuggestionsDismissParamsSchema = closedObject({
  taskId: TaskIdSchema,
  reason: Type2.Optional(Type2.String({ maxLength: 1024 }))
});
var TaskSuggestionsDismissResultSchema = closedObject({
  taskId: TaskIdSchema,
  dismissed: Type2.Boolean()
});
var TaskSuggestionEventSchema = Type2.Union([
  closedObject({ action: Type2.Literal("created"), suggestion: TaskSuggestionSchema }),
  closedObject({
    action: Type2.Literal("resolved"),
    taskId: TaskIdSchema,
    resolution: TaskSuggestionResolutionSchema
  })
]);
export {
  TaskSuggestionEventSchema,
  TaskSuggestionResolutionSchema,
  TaskSuggestionSchema,
  TaskSuggestionsAcceptParamsSchema,
  TaskSuggestionsAcceptResultSchema,
  TaskSuggestionsCreateParamsSchema,
  TaskSuggestionsCreateResultSchema,
  TaskSuggestionsDismissParamsSchema,
  TaskSuggestionsDismissResultSchema,
  TaskSuggestionsListParamsSchema,
  TaskSuggestionsListResultSchema
};
