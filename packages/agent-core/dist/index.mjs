// packages/llm-core/src/utils/event-stream.ts
var EventStream = class {
  constructor(isComplete, extractResult) {
    this.queue = [];
    this.waiting = [];
    this.done = false;
    this.isComplete = isComplete;
    this.extractResult = extractResult;
    const resolvers = [];
    this.finalResultPromise = new Promise((resolve) => {
      resolvers.push(resolve);
    });
    const resolveFinalResult = resolvers.at(0);
    if (!resolveFinalResult) {
      throw new Error("event stream result promise did not initialize its resolver");
    }
    this.resolveFinalResult = resolveFinalResult;
  }
  push(event) {
    if (this.done) {
      return;
    }
    if (this.isComplete(event)) {
      this.done = true;
      this.resolveFinalResult(this.extractResult(event));
    }
    const waiter = this.waiting.shift();
    if (waiter) {
      waiter({ value: event, done: false });
    } else {
      this.queue.push(event);
    }
  }
  end(result) {
    this.done = true;
    if (result !== void 0) {
      this.resolveFinalResult(result);
    }
    while (this.waiting.length > 0) {
      const waiter = this.waiting.shift();
      if (!waiter) {
        break;
      }
      waiter({ value: void 0, done: true });
    }
  }
  async *[Symbol.asyncIterator]() {
    while (true) {
      if (this.queue.length > 0) {
        for (const event of this.queue.splice(0, 1)) {
          yield event;
        }
      } else if (this.done) {
        return;
      } else {
        const result = await new Promise((resolve) => {
          this.waiting.push(resolve);
        });
        if (result.done) {
          return;
        }
        yield result.value;
      }
    }
  }
  result() {
    return this.finalResultPromise;
  }
};

// packages/agent-core/src/errors.ts
var TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE = "openclaw_transcript_not_continuable";
var TranscriptNotContinuableError = class extends Error {
  constructor(role) {
    super(`Cannot continue from message role: ${role}`);
    this.code = TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE;
    this.name = "TranscriptNotContinuableError";
    this.role = role;
  }
};

// packages/agent-core/src/harness/session/uuid.ts
var lastTimestamp = -Infinity;
var sequence = 0;
function fillRandomBytes(bytes) {
  const crypto = globalThis.crypto;
  if (crypto?.getRandomValues) {
    crypto.getRandomValues(bytes);
    return;
  }
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
}
function uuidv7() {
  const random = new Uint8Array(16);
  fillRandomBytes(random);
  const timestamp = Date.now();
  if (timestamp > lastTimestamp) {
    sequence = new DataView(random.buffer, random.byteOffset + 6, 4).getUint32(0);
    lastTimestamp = timestamp;
  } else {
    sequence = sequence + 1 >>> 0;
    if (sequence === 0) {
      lastTimestamp++;
    }
  }
  const bytes = new Uint8Array(16);
  bytes[0] = lastTimestamp / 1099511627776 & 255;
  bytes[1] = lastTimestamp / 4294967296 & 255;
  bytes[2] = lastTimestamp / 16777216 & 255;
  bytes[3] = lastTimestamp / 65536 & 255;
  bytes[4] = lastTimestamp / 256 & 255;
  bytes[5] = lastTimestamp & 255;
  bytes[6] = 112 | sequence >>> 28 & 15;
  bytes[7] = sequence >>> 20 & 255;
  bytes[8] = 128 | sequence >>> 14 & 63;
  bytes[9] = sequence >>> 6 & 255;
  const randomLowBits = random.at(10);
  if (randomLowBits === void 0) {
    throw new Error("UUID random buffer is shorter than 11 bytes");
  }
  bytes[10] = (sequence & 63) << 2 | randomLowBits & 3;
  bytes.set(random.subarray(11), 11);
  return formatUuid(bytes);
}
function formatUuid(bytes) {
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}

// packages/llm-core/src/model-contracts/anthropic.ts
function normalizeClaudeModelId(modelId) {
  const normalized = modelId?.trim().toLowerCase() ?? "";
  const unprefixed = normalized.startsWith("anthropic/") ? normalized.slice("anthropic/".length) : normalized;
  return unprefixed.replace(/[._\s]+/g, "-");
}
function resolveClaudeModelIdentity(ref) {
  const configuredCanonicalModelId = typeof ref.params?.canonicalModelId === "string" ? ref.params.canonicalModelId : void 0;
  const normalized = normalizeClaudeModelId(configuredCanonicalModelId ?? ref.id);
  const match = /(?:^|[-/])claude-/.exec(normalized);
  return match ? normalized.slice((match.index ?? 0) + (match[0].startsWith("claude-") ? 0 : 1)) : normalized;
}
function resolveClaudeFable5ModelIdentity(ref) {
  const normalized = resolveClaudeModelIdentity(ref);
  const match = /(?:^|-)claude-fable-5(?=$|[^a-z0-9])/.exec(normalized);
  if (!match) {
    return void 0;
  }
  return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
function resolveClaudeSonnet5ModelIdentity(ref) {
  const normalized = resolveClaudeModelIdentity(ref);
  const match = /(?:^|-)claude-sonnet-5(?=$|[^a-z0-9])/.exec(normalized);
  if (!match) {
    return void 0;
  }
  return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}

// packages/llm-core/src/validation.ts
import { Compile } from "typebox/compile";
var validatorCache = /* @__PURE__ */ new WeakMap();
var MAX_JSON_COERCE_LENGTH = 64 * 1024;
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function isJsonSchemaObject(value) {
  return isRecord(value);
}
function getSchemaTypes(schema) {
  if (typeof schema.type === "string") {
    return [schema.type];
  }
  if (Array.isArray(schema.type)) {
    return schema.type.filter((type) => typeof type === "string");
  }
  return [];
}
function matchesJsonType(value, type) {
  switch (type) {
    case "number":
      return typeof value === "number";
    case "integer":
      return typeof value === "number" && Number.isInteger(value);
    case "boolean":
      return typeof value === "boolean";
    case "string":
      return typeof value === "string";
    case "null":
      return value === null;
    case "array":
      return Array.isArray(value);
    case "object":
      return isRecord(value) && !Array.isArray(value);
    default:
      return false;
  }
}
function isValidatorSchema(value) {
  return isRecord(value);
}
var JSON_NUMBER_TOKEN_RE = /^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d+)?$/iu;
function parseJsonNumberString(value) {
  const trimmed = value.trim();
  if (!trimmed || !JSON_NUMBER_TOKEN_RE.test(trimmed)) {
    return void 0;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function parseJsonIntegerString(value) {
  const parsed = parseJsonNumberString(value);
  return parsed !== void 0 && Number.isSafeInteger(parsed) ? parsed : void 0;
}
function getSubSchemaValidator(schema) {
  if (!isValidatorSchema(schema)) {
    return void 0;
  }
  try {
    return getValidator(schema);
  } catch {
    return void 0;
  }
}
function coercePrimitiveByType(value, type) {
  switch (type) {
    case "number": {
      if (value === null) {
        return 0;
      }
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = parseJsonNumberString(value);
        if (parsed !== void 0) {
          return parsed;
        }
      }
      if (typeof value === "boolean") {
        return value ? 1 : 0;
      }
      return value;
    }
    case "integer": {
      if (value === null) {
        return 0;
      }
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = parseJsonIntegerString(value);
        if (parsed !== void 0) {
          return parsed;
        }
      }
      if (typeof value === "boolean") {
        return value ? 1 : 0;
      }
      return value;
    }
    case "boolean": {
      if (value === null) {
        return false;
      }
      if (typeof value === "string") {
        if (value === "true") {
          return true;
        }
        if (value === "false") {
          return false;
        }
      }
      if (typeof value === "number") {
        if (value === 1) {
          return true;
        }
        if (value === 0) {
          return false;
        }
      }
      return value;
    }
    case "string": {
      if (value === null) {
        return "";
      }
      if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
      }
      return value;
    }
    case "array": {
      if (typeof value === "string" && value.trim() !== "" && value.length <= MAX_JSON_COERCE_LENGTH) {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch {
        }
      }
      return value;
    }
    case "object": {
      if (typeof value === "string" && value.trim() !== "" && value.length <= MAX_JSON_COERCE_LENGTH) {
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
            return parsed;
          }
        } catch {
        }
      }
      return value;
    }
    case "null": {
      if (value === "" || value === 0 || value === false) {
        return null;
      }
      return value;
    }
    default:
      return value;
  }
}
function applySchemaObjectCoercion(value, schema) {
  const properties = schema.properties;
  const definedKeys = new Set(properties ? Object.keys(properties) : []);
  if (properties) {
    for (const [key, propertySchema] of Object.entries(properties)) {
      if (key in value) {
        value[key] = coerceWithJsonSchema(value[key], propertySchema);
      }
    }
  }
  if (schema.additionalProperties && isJsonSchemaObject(schema.additionalProperties)) {
    for (const [key, propertyValue] of Object.entries(value)) {
      if (!definedKeys.has(key)) {
        value[key] = coerceWithJsonSchema(propertyValue, schema.additionalProperties);
      }
    }
  }
}
function applySchemaArrayCoercion(value, schema) {
  if (Array.isArray(schema.items)) {
    for (let index = 0; index < value.length; index++) {
      const itemSchema = schema.items[index];
      if (itemSchema) {
        value[index] = coerceWithJsonSchema(value[index], itemSchema);
      }
    }
    return;
  }
  if (isJsonSchemaObject(schema.items)) {
    for (let index = 0; index < value.length; index++) {
      value[index] = coerceWithJsonSchema(value[index], schema.items);
    }
  }
}
function coerceWithUnionSchema(value, schemas) {
  if (value === null) {
    for (const schema of schemas) {
      const types = getSchemaTypes(schema);
      if (types.includes("null")) {
        const validator = getSubSchemaValidator(schema);
        if (!validator || validator.Check(value)) {
          return value;
        }
      }
    }
  }
  for (const schema of schemas) {
    const candidate = structuredClone(value);
    const coerced = coerceWithJsonSchema(candidate, schema);
    const validator = getSubSchemaValidator(schema);
    if (validator?.Check(coerced)) {
      return coerced;
    }
  }
  return value;
}
function coerceWithJsonSchema(value, schema) {
  let nextValue = value;
  if (Array.isArray(schema.allOf)) {
    for (const nested of schema.allOf) {
      nextValue = coerceWithJsonSchema(nextValue, nested);
    }
  }
  if (Array.isArray(schema.anyOf)) {
    nextValue = coerceWithUnionSchema(nextValue, schema.anyOf);
  }
  if (Array.isArray(schema.oneOf)) {
    nextValue = coerceWithUnionSchema(nextValue, schema.oneOf);
  }
  const schemaTypes = getSchemaTypes(schema);
  const matchesUnionMember = schemaTypes.length > 1 && schemaTypes.some((schemaType) => matchesJsonType(nextValue, schemaType));
  if (schemaTypes.length > 0 && !matchesUnionMember) {
    for (const schemaType of schemaTypes) {
      const candidate = coercePrimitiveByType(nextValue, schemaType);
      if (candidate !== nextValue) {
        nextValue = candidate;
        break;
      }
    }
  }
  if (schemaTypes.includes("object") && isRecord(nextValue) && !Array.isArray(nextValue)) {
    applySchemaObjectCoercion(nextValue, schema);
  }
  if (schemaTypes.includes("array") && Array.isArray(nextValue)) {
    applySchemaArrayCoercion(nextValue, schema);
  }
  return nextValue;
}
function getValidator(schema) {
  const key = schema;
  const cached = validatorCache.get(key);
  if (cached) {
    return cached;
  }
  const validator = Compile(schema);
  validatorCache.set(key, validator);
  return validator;
}
function formatValidationPath(error) {
  if (error.keyword === "required") {
    const requiredProperty = error.params.requiredProperties?.[0];
    if (requiredProperty) {
      const basePath = error.instancePath.replace(/^\//, "").replace(/\//g, ".");
      return basePath ? `${basePath}.${requiredProperty}` : requiredProperty;
    }
  }
  const path = error.instancePath.replace(/^\//, "").replace(/\//g, ".");
  return path || "root";
}
function validateToolCall(tools, toolCall) {
  const tool = tools.find((t) => t.name === toolCall.name);
  if (!tool) {
    throw new Error(`Tool "${toolCall.name}" not found`);
  }
  return validateToolArguments(tool, toolCall);
}
function validateToolArguments(tool, toolCall) {
  const args = structuredClone(toolCall.arguments);
  const validator = getValidator(tool.parameters);
  validator.Convert(args);
  if (isJsonSchemaObject(tool.parameters)) {
    const coerced = coerceWithJsonSchema(args, tool.parameters);
    if (coerced !== args) {
      if (isRecord(args) && isRecord(coerced)) {
        for (const key of Object.keys(args)) {
          delete args[key];
        }
        Object.assign(args, coerced);
      } else {
        return validator.Check(coerced) ? coerced : args;
      }
    }
  }
  if (validator.Check(args)) {
    return args;
  }
  const errors = validator.Errors(args).map((error) => `  - ${formatValidationPath(error)}: ${error.message}`).join("\n") || "Unknown validation error";
  throw new Error(
    `Validation failed for tool "${toolCall.name}":
${errors}

Received arguments:
${JSON.stringify(toolCall.arguments, null, 2)}`
  );
}

// packages/agent-core/src/reasoning.ts
var ENABLED_THINKING_LEVELS = /* @__PURE__ */ new Set([
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max"
]);
function isEnabledThinkingLevel(value) {
  return ENABLED_THINKING_LEVELS.has(value);
}
function resolveAgentReasoningOption(model, thinkingLevel) {
  if (thinkingLevel !== "off") {
    return thinkingLevel;
  }
  const offFallback = model.thinkingLevelMap?.off ?? ((model.api === "anthropic-messages" || model.api === "bedrock-converse-stream") && resolveClaudeFable5ModelIdentity(model) ? "low" : void 0);
  if (isEnabledThinkingLevel(offFallback)) {
    return offFallback;
  }
  return model.api === "anthropic-messages" && resolveClaudeSonnet5ModelIdentity(model) ? "off" : void 0;
}

// packages/agent-core/src/runtime-deps.ts
function missingRuntimeDep(name) {
  return new Error(
    `@openclaw/agent-core runtime dependency "${name}" is not configured. Pass an AgentCoreRuntimeDeps instance or a streamFn explicitly.`
  );
}
function resolveAgentCoreStreamFn(runtime, streamFn) {
  if (streamFn) {
    return streamFn;
  }
  if (runtime?.streamSimple) {
    return runtime.streamSimple;
  }
  throw missingRuntimeDep("streamSimple");
}
function resolveAgentCoreCompleteFn(runtime) {
  if (runtime?.completeSimple) {
    return runtime.completeSimple;
  }
  throw missingRuntimeDep("completeSimple");
}

// packages/agent-core/src/tool-execution-context.ts
import { AsyncLocalStorage } from "node:async_hooks";
var activeToolExecution = new AsyncLocalStorage();
function runWithAgentToolExecutionContext(context, run) {
  return activeToolExecution.run(context, run);
}

// packages/agent-core/src/turn-interruption.ts
function createFailureMessage(model, error, aborted) {
  return {
    role: "assistant",
    content: [{ type: "text", text: "" }],
    api: model.api,
    provider: model.provider,
    model: model.id,
    stopReason: aborted ? "aborted" : "error",
    errorMessage: error instanceof Error ? error.message : String(error),
    timestamp: Date.now(),
    usage: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 0,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
    }
  };
}
var INTERRUPTED_TURN_GUIDANCE = `<turn_aborted>
The previous turn was interrupted. Any running background processes may still be active. If any tools or commands were aborted, they may have partially executed.
</turn_aborted>`;
function isTurnHandoffAbort(signal) {
  if (!signal?.aborted) {
    return false;
  }
  const reason = signal.reason;
  return typeof reason === "object" && reason !== null && reason.turnHandoff === true;
}
function createInterruptedTurnMessage() {
  return {
    role: "custom",
    customType: "openclaw:turn-aborted",
    content: INTERRUPTED_TURN_GUIDANCE,
    display: false,
    timestamp: Date.now()
  };
}
async function appendInterruptedTurnMessage(messages, emit) {
  const interruption = createInterruptedTurnMessage();
  messages.push(interruption);
  await emit({ type: "message_start", message: interruption });
  await emit({ type: "message_end", message: interruption });
}
function normalizeCoreContextMessages(messages) {
  return messages.map((message) => {
    if (message.role !== "custom" || message.customType !== "openclaw:turn-aborted") {
      return message;
    }
    return {
      role: "user",
      content: typeof message.content === "string" ? [{ type: "text", text: message.content }] : message.content,
      timestamp: message.timestamp
    };
  });
}

// packages/agent-core/src/agent-loop.ts
var EventStreamConstructor = EventStream;
function appendTextDeltaToAssistantMessage(message, contentIndex, delta) {
  const content = [...message.content];
  const currentContent = content[contentIndex];
  content[contentIndex] = currentContent?.type === "text" ? { ...currentContent, text: currentContent.text + delta } : { type: "text", text: delta };
  return { ...message, content };
}
function resolveAssistantMessageUpdate(event, currentMessage) {
  if ("partial" in event && event.partial) {
    return event.partial;
  }
  if (event.type === "text_delta") {
    return appendTextDeltaToAssistantMessage(currentMessage, event.contentIndex, event.delta);
  }
  return currentMessage;
}
function removeNonExecutableToolCalls(message) {
  if (message.stopReason === "toolUse") {
    return message;
  }
  const content = message.content.filter((item) => item.type !== "toolCall");
  return content.length === message.content.length ? message : { ...message, content };
}
function ensureToolTurnIdentity(message) {
  if (message.stopReason !== "toolUse" || message.responseId?.trim() || message.turnId?.trim()) {
    return message;
  }
  return { ...message, turnId: uuidv7() };
}
function agentLoop(prompts, context, config, signal, streamFn, runtime) {
  const stream = createAgentStream();
  void runAgentLoop(
    prompts,
    context,
    config,
    async (event) => {
      stream.push(event);
    },
    signal,
    streamFn,
    runtime
  ).then((messages) => {
    stream.end(messages);
  }).catch((error) => {
    pushLoopFailure(stream, config, error, signal);
  });
  return stream;
}
function agentLoopContinue(context, config, signal, streamFn, runtime) {
  const lastMessage = context.messages.at(-1);
  if (!lastMessage) {
    throw new Error("Cannot continue: no messages in context");
  }
  if (lastMessage.role === "assistant") {
    throw new TranscriptNotContinuableError(lastMessage.role);
  }
  const stream = createAgentStream();
  void runAgentLoopContinue(
    context,
    config,
    async (event) => {
      stream.push(event);
    },
    signal,
    streamFn,
    runtime
  ).then((messages) => {
    stream.end(messages);
  }).catch((error) => {
    pushLoopFailure(stream, config, error, signal);
  });
  return stream;
}
async function runAgentLoop(prompts, context, config, emit, signal, streamFn, runtime) {
  const newMessages = [...prompts];
  const currentContext = {
    ...context,
    messages: [...context.messages, ...prompts]
  };
  await emit({ type: "agent_start" });
  await emit({ type: "turn_start" });
  for (const prompt of prompts) {
    await emit({ type: "message_start", message: prompt });
    await emit({ type: "message_end", message: prompt });
  }
  await runLoop(currentContext, newMessages, config, signal, emit, streamFn, runtime);
  return newMessages;
}
async function runAgentLoopContinue(context, config, emit, signal, streamFn, runtime) {
  const lastMessage = context.messages.at(-1);
  if (!lastMessage) {
    throw new Error("Cannot continue: no messages in context");
  }
  if (lastMessage.role === "assistant") {
    throw new TranscriptNotContinuableError(lastMessage.role);
  }
  const newMessages = [];
  const currentContext = { ...context };
  await emit({ type: "agent_start" });
  await emit({ type: "turn_start" });
  await runLoop(currentContext, newMessages, config, signal, emit, streamFn, runtime);
  return newMessages;
}
function createAgentStream() {
  return new EventStreamConstructor(
    (event) => event.type === "agent_end",
    (event) => event.type === "agent_end" ? event.messages : []
  );
}
function pushLoopFailure(stream, config, error, signal) {
  const aborted = signal?.aborted === true;
  const failureMessage = createFailureMessage(config.model, error, aborted);
  stream.push({ type: "message_start", message: failureMessage });
  stream.push({ type: "message_end", message: failureMessage });
  stream.push({ type: "turn_end", message: failureMessage, toolResults: [] });
  const messages = [failureMessage];
  if (aborted && !isTurnHandoffAbort(signal)) {
    const interruption = createInterruptedTurnMessage();
    messages.push(interruption);
    stream.push({ type: "message_start", message: interruption });
    stream.push({ type: "message_end", message: interruption });
  }
  stream.push({ type: "agent_end", messages });
}
async function runLoop(initialContext, newMessages, initialConfig, signal, emit, streamFn, runtime) {
  let currentContext = initialContext;
  let config = initialConfig;
  let firstTurn = true;
  let turnOpen = true;
  let pendingMessages = await config.getSteeringMessages?.() || [];
  const stopIfAborted = async () => {
    if (!signal?.aborted) {
      return false;
    }
    const abortedMessage = createFailureMessage(
      config.model,
      signal.reason instanceof Error ? signal.reason : new Error("Agent run aborted"),
      true
    );
    newMessages.push(abortedMessage);
    if (!turnOpen) {
      await emit({ type: "turn_start" });
      turnOpen = true;
    }
    await emit({ type: "message_start", message: abortedMessage });
    await emit({ type: "message_end", message: abortedMessage });
    await emit({ type: "turn_end", message: abortedMessage, toolResults: [] });
    turnOpen = false;
    if (!isTurnHandoffAbort(signal)) {
      await appendInterruptedTurnMessage(newMessages, emit);
    }
    await emit({ type: "agent_end", messages: newMessages });
    return true;
  };
  while (true) {
    let hasMoreToolCalls = true;
    while (hasMoreToolCalls || pendingMessages.length > 0) {
      if (await stopIfAborted()) {
        return;
      }
      if (!firstTurn) {
        await emit({ type: "turn_start" });
        turnOpen = true;
      } else {
        firstTurn = false;
      }
      if (pendingMessages.length > 0) {
        for (const message2 of pendingMessages) {
          await emit({ type: "message_start", message: message2 });
          await emit({ type: "message_end", message: message2 });
          currentContext.messages.push(message2);
          newMessages.push(message2);
        }
      }
      if (await stopIfAborted()) {
        return;
      }
      const message = await streamAssistantResponse(
        currentContext,
        config,
        signal,
        emit,
        streamFn,
        runtime
      );
      newMessages.push(message);
      if (message.stopReason === "error" || message.stopReason === "aborted") {
        await emit({ type: "turn_end", message, toolResults: [] });
        if (message.stopReason === "aborted" && signal?.aborted && !isTurnHandoffAbort(signal)) {
          await appendInterruptedTurnMessage(newMessages, emit);
        }
        await emit({ type: "agent_end", messages: newMessages });
        return;
      }
      const toolCalls = message.content.filter((c) => c.type === "toolCall");
      const toolResults = [];
      hasMoreToolCalls = false;
      if (message.stopReason === "toolUse" && toolCalls.length > 0) {
        const executedToolBatch = await executeToolCalls(
          currentContext,
          message,
          config,
          signal,
          emit
        );
        toolResults.push(...executedToolBatch.messages);
        hasMoreToolCalls = !executedToolBatch.terminate;
        for (const result of toolResults) {
          currentContext.messages.push(result);
          newMessages.push(result);
        }
      }
      await emit({ type: "turn_end", message, toolResults });
      turnOpen = false;
      if (await stopIfAborted()) {
        return;
      }
      const nextTurnContext = {
        message,
        toolResults,
        context: currentContext,
        newMessages
      };
      const nextTurnSnapshot = await config.prepareNextTurn?.(nextTurnContext);
      if (nextTurnSnapshot) {
        currentContext = nextTurnSnapshot.context ?? currentContext;
        const nextModel = nextTurnSnapshot.model ?? config.model;
        const nextThinkingLevel = nextTurnSnapshot.thinkingLevel ?? config.thinkingLevel;
        const shouldResolveReasoning = nextTurnSnapshot.thinkingLevel !== void 0 || nextTurnSnapshot.model !== void 0 && nextThinkingLevel !== void 0;
        const nextReasoning = shouldResolveReasoning && nextThinkingLevel !== void 0 ? resolveAgentReasoningOption(nextModel, nextThinkingLevel) : config.reasoning;
        config = Object.assign({}, config, {
          model: nextModel,
          thinkingLevel: nextThinkingLevel,
          reasoning: nextReasoning
        });
      }
      if (await stopIfAborted()) {
        return;
      }
      if (await config.shouldStopAfterTurn?.({
        message,
        toolResults,
        context: currentContext,
        newMessages
      })) {
        await emit({ type: "agent_end", messages: newMessages });
        return;
      }
      pendingMessages = await config.getSteeringMessages?.() || [];
      if (await stopIfAborted()) {
        return;
      }
    }
    const followUpMessages = await config.getFollowUpMessages?.() || [];
    if (followUpMessages.length > 0) {
      pendingMessages = followUpMessages;
      continue;
    }
    break;
  }
  await emit({ type: "agent_end", messages: newMessages });
}
async function streamAssistantResponse(context, config, signal, emit, streamFn, runtime) {
  let messages = context.messages;
  if (config.transformContext) {
    messages = await config.transformContext(messages, signal);
  }
  messages = normalizeCoreContextMessages(messages);
  const llmMessages = await config.convertToLlm(messages);
  const llmContext = {
    systemPrompt: context.systemPrompt,
    messages: llmMessages,
    tools: context.tools
  };
  const streamFunction = resolveAgentCoreStreamFn(runtime, streamFn);
  const resolvedApiKey = (config.getApiKey ? await config.getApiKey(config.model.provider) : void 0) || config.apiKey;
  const response = await streamFunction(config.model, llmContext, {
    ...config,
    apiKey: resolvedApiKey,
    signal
  });
  let partialMessage = null;
  let addedPartial = false;
  for await (const event of response) {
    switch (event.type) {
      case "start": {
        const message = event.partial;
        partialMessage = message;
        context.messages.push(message);
        addedPartial = true;
        await emit({ type: "message_start", message: { ...message } });
        break;
      }
      case "text_start":
      case "text_delta":
      case "text_end":
      case "thinking_start":
      case "thinking_delta":
      case "thinking_end":
      case "toolcall_start":
      case "toolcall_delta":
      case "toolcall_end":
        if (partialMessage) {
          const message = resolveAssistantMessageUpdate(event, partialMessage);
          partialMessage = message;
          context.messages[context.messages.length - 1] = message;
          await emit({
            type: "message_update",
            assistantMessageEvent: event,
            message: { ...message }
          });
        }
        break;
      case "done":
      case "error": {
        const finalMessage2 = ensureToolTurnIdentity(
          removeNonExecutableToolCalls(await response.result())
        );
        if (addedPartial) {
          context.messages[context.messages.length - 1] = finalMessage2;
        } else {
          context.messages.push(finalMessage2);
        }
        if (!addedPartial) {
          await emit({ type: "message_start", message: { ...finalMessage2 } });
        }
        await emit({ type: "message_end", message: finalMessage2 });
        return finalMessage2;
      }
    }
  }
  const finalMessage = ensureToolTurnIdentity(
    removeNonExecutableToolCalls(await response.result())
  );
  if (addedPartial) {
    context.messages[context.messages.length - 1] = finalMessage;
  } else {
    context.messages.push(finalMessage);
    await emit({ type: "message_start", message: { ...finalMessage } });
  }
  await emit({ type: "message_end", message: finalMessage });
  return finalMessage;
}
async function executeToolCalls(currentContext, assistantMessage, config, signal, emit) {
  const toolCalls = assistantMessage.content.filter((c) => c.type === "toolCall");
  const resolvedToolCalls = /* @__PURE__ */ new Map();
  let hasSequentialToolCall = false;
  if (config.toolExecution !== "sequential") {
    for (const toolCall of toolCalls) {
      const resolution = await resolveToolCallTool(
        currentContext,
        assistantMessage,
        toolCall,
        config,
        signal,
        resolvedToolCalls
      );
      if (resolution.kind === "resolved" && resolution.tool?.executionMode === "sequential") {
        hasSequentialToolCall = true;
        break;
      }
      if (signal?.aborted) {
        break;
      }
    }
  }
  if (config.toolExecution === "sequential" || hasSequentialToolCall) {
    return executeToolCallsSequential(
      currentContext,
      assistantMessage,
      toolCalls,
      resolvedToolCalls,
      config,
      signal,
      emit
    );
  }
  return executeToolCallsParallel(
    currentContext,
    assistantMessage,
    toolCalls,
    resolvedToolCalls,
    config,
    signal,
    emit
  );
}
function hidesToolCallFromChannelProgress(context, toolCall, resolvedToolCalls) {
  const resolution = resolvedToolCalls.get(toolCall);
  const tool = resolution?.kind === "resolved" ? resolution.tool : context.tools?.find((candidate) => candidate.name === toolCall.name);
  return tool?.hideFromChannelProgress === true;
}
async function executeToolCallsSequential(currentContext, assistantMessage, toolCalls, resolvedToolCalls, config, signal, emit) {
  const finalizedCalls = [];
  const messages = [];
  for (const toolCall of toolCalls) {
    const hideFromChannelProgress = hidesToolCallFromChannelProgress(
      currentContext,
      toolCall,
      resolvedToolCalls
    );
    await emit({
      type: "tool_execution_start",
      toolCallId: toolCall.id,
      toolName: toolCall.name,
      args: toolCall.arguments,
      ...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
    });
    const preparation = await prepareToolCall(
      currentContext,
      assistantMessage,
      toolCall,
      config,
      signal,
      resolvedToolCalls
    );
    let finalized;
    if (preparation.kind === "immediate") {
      finalized = {
        toolCall,
        result: preparation.result,
        isError: preparation.isError,
        executionStarted: false,
        ...preparation.errorKind ? { errorKind: preparation.errorKind } : {},
        ...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
      };
    } else {
      const executed = await executePreparedToolCall(
        preparation,
        { assistantMessage, toolCall: preparation.toolCall },
        signal,
        emit
      );
      finalized = await finalizeExecutedToolCall(
        currentContext,
        assistantMessage,
        preparation,
        executed,
        config,
        signal
      );
    }
    await emitToolExecutionEnd(finalized, emit);
    const toolResultMessage = createToolResultMessage(finalized);
    await emitToolResultMessage(toolResultMessage, emit);
    finalizedCalls.push(finalized);
    messages.push(toolResultMessage);
    if (signal?.aborted) {
      break;
    }
  }
  return {
    messages,
    terminate: shouldTerminateToolBatch(finalizedCalls)
  };
}
async function executeToolCallsParallel(currentContext, assistantMessage, toolCalls, resolvedToolCalls, config, signal, emit) {
  const finalizedCalls = [];
  for (const toolCall of toolCalls) {
    const hideFromChannelProgress = hidesToolCallFromChannelProgress(
      currentContext,
      toolCall,
      resolvedToolCalls
    );
    await emit({
      type: "tool_execution_start",
      toolCallId: toolCall.id,
      toolName: toolCall.name,
      args: toolCall.arguments,
      ...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
    });
    const preparation = await prepareToolCall(
      currentContext,
      assistantMessage,
      toolCall,
      config,
      signal,
      resolvedToolCalls
    );
    if (preparation.kind === "immediate") {
      const finalized = {
        toolCall,
        result: preparation.result,
        isError: preparation.isError,
        executionStarted: false,
        ...preparation.errorKind ? { errorKind: preparation.errorKind } : {},
        ...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
      };
      await emitToolExecutionEnd(finalized, emit);
      finalizedCalls.push(finalized);
      if (signal?.aborted) {
        break;
      }
      continue;
    }
    finalizedCalls.push(async () => {
      const executed = await executePreparedToolCall(
        preparation,
        { assistantMessage, toolCall: preparation.toolCall },
        signal,
        emit
      );
      const finalized = await finalizeExecutedToolCall(
        currentContext,
        assistantMessage,
        preparation,
        executed,
        config,
        signal
      );
      await emitToolExecutionEnd(finalized, emit);
      return finalized;
    });
    if (signal?.aborted) {
      break;
    }
  }
  const orderedFinalizedCalls = await Promise.all(
    finalizedCalls.map((entry) => typeof entry === "function" ? entry() : Promise.resolve(entry))
  );
  const messages = [];
  for (const finalized of orderedFinalizedCalls) {
    const toolResultMessage = createToolResultMessage(finalized);
    await emitToolResultMessage(toolResultMessage, emit);
    messages.push(toolResultMessage);
  }
  return {
    messages,
    terminate: shouldTerminateToolBatch(orderedFinalizedCalls)
  };
}
function shouldTerminateToolBatch(finalizedCalls) {
  return finalizedCalls.length > 0 && finalizedCalls.every((finalized) => finalized.result.terminate === true);
}
function prepareToolCallArguments(tool, toolCall) {
  if (!tool.prepareArguments) {
    return toolCall;
  }
  const preparedArguments = tool.prepareArguments(toolCall.arguments);
  if (preparedArguments === toolCall.arguments) {
    return toolCall;
  }
  return {
    ...toolCall,
    arguments: preparedArguments
  };
}
async function resolveToolCallTool(currentContext, assistantMessage, toolCall, config, signal, resolvedToolCalls) {
  const cached = resolvedToolCalls?.get(toolCall);
  if (cached) {
    return cached;
  }
  let resolution;
  try {
    let tool = currentContext.tools?.find((t) => t.name === toolCall.name);
    if (!tool) {
      const resolvedTool = await config.resolveDeferredTool?.(
        {
          assistantMessage,
          toolCall,
          context: currentContext
        },
        signal
      );
      if (resolvedTool && resolvedTool.name !== toolCall.name) {
        throw new Error(
          `Deferred tool resolver returned "${resolvedTool.name}" for requested "${toolCall.name}"`
        );
      }
      tool = resolvedTool;
      if (tool) {
        currentContext.tools = [...currentContext.tools ?? [], tool];
      }
    }
    resolution = { kind: "resolved", ...tool ? { tool } : {} };
  } catch (error) {
    resolution = { kind: "error", error };
  }
  resolvedToolCalls?.set(toolCall, resolution);
  return resolution;
}
async function prepareToolCall(currentContext, assistantMessage, toolCall, config, signal, resolvedToolCalls) {
  const resolution = await resolveToolCallTool(
    currentContext,
    assistantMessage,
    toolCall,
    config,
    signal,
    resolvedToolCalls
  );
  if (resolution.kind === "error") {
    return {
      kind: "immediate",
      result: createErrorToolResult(
        signal?.aborted ? "Operation aborted" : resolution.error instanceof Error ? resolution.error.message : String(resolution.error)
      ),
      isError: true
    };
  }
  const tool = resolution.tool;
  if (!tool) {
    return {
      kind: "immediate",
      result: createErrorToolResult(`Tool ${toolCall.name} not found`),
      isError: true
    };
  }
  let preparedToolCall;
  try {
    preparedToolCall = prepareToolCallArguments(tool, toolCall);
  } catch (error) {
    return {
      kind: "immediate",
      result: createErrorToolResult(error instanceof Error ? error.message : String(error)),
      isError: true
    };
  }
  let validatedArgs;
  try {
    validatedArgs = validateToolArguments(tool, preparedToolCall);
  } catch (error) {
    return {
      kind: "immediate",
      result: createErrorToolResult(error instanceof Error ? error.message : String(error)),
      isError: true,
      errorKind: "argument-validation"
    };
  }
  try {
    if (config.beforeToolCall) {
      const beforeResult = await config.beforeToolCall(
        {
          assistantMessage,
          toolCall,
          args: validatedArgs,
          context: currentContext
        },
        signal
      );
      if (signal?.aborted) {
        return {
          kind: "immediate",
          result: createErrorToolResult("Operation aborted"),
          isError: true
        };
      }
      if (beforeResult?.block) {
        return {
          kind: "immediate",
          result: createErrorToolResult(beforeResult.reason || "Tool execution was blocked"),
          isError: true
        };
      }
    }
    if (signal?.aborted) {
      return {
        kind: "immediate",
        result: createErrorToolResult("Operation aborted"),
        isError: true
      };
    }
    return {
      kind: "prepared",
      toolCall,
      tool,
      args: validatedArgs
    };
  } catch (error) {
    return {
      kind: "immediate",
      result: createErrorToolResult(error instanceof Error ? error.message : String(error)),
      isError: true
    };
  }
}
async function executePreparedToolCall(prepared, executionContext, signal, emit) {
  if (signal?.aborted) {
    return {
      result: createErrorToolResult("Operation aborted"),
      isError: true,
      executionStarted: false
    };
  }
  const updateEvents = [];
  let acceptingUpdates = true;
  try {
    const result = await runWithAgentToolExecutionContext(
      executionContext,
      () => prepared.tool.execute(
        prepared.toolCall.id,
        prepared.args,
        signal,
        (partialResult) => {
          if (!acceptingUpdates) {
            return;
          }
          updateEvents.push(
            Promise.resolve(
              emit({
                type: "tool_execution_update",
                toolCallId: prepared.toolCall.id,
                toolName: prepared.toolCall.name,
                args: prepared.toolCall.arguments,
                partialResult,
                ...prepared.tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {}
              })
            )
          );
        }
      )
    );
    acceptingUpdates = false;
    await Promise.all(updateEvents);
    return { result, isError: false, executionStarted: true };
  } catch (error) {
    acceptingUpdates = false;
    await Promise.all(updateEvents);
    return {
      result: createErrorToolResult(error instanceof Error ? error.message : String(error)),
      isError: true,
      executionStarted: true
    };
  } finally {
    acceptingUpdates = false;
  }
}
async function finalizeExecutedToolCall(currentContext, assistantMessage, prepared, executed, config, signal) {
  let result = executed.result;
  let isError = executed.isError;
  if (executed.executionStarted && config.afterToolCall) {
    try {
      const afterResult = await config.afterToolCall(
        {
          assistantMessage,
          toolCall: prepared.toolCall,
          args: prepared.args,
          result,
          isError,
          context: currentContext
        },
        signal
      );
      if (afterResult) {
        result = {
          ...result,
          content: afterResult.content ?? result.content,
          details: afterResult.details ?? result.details,
          terminate: afterResult.terminate ?? result.terminate
        };
        isError = afterResult.isError ?? isError;
      }
    } catch (error) {
      result = createErrorToolResult(error instanceof Error ? error.message : String(error));
      isError = true;
    }
  }
  return {
    toolCall: prepared.toolCall,
    result,
    isError,
    executionStarted: executed.executionStarted,
    ...prepared.tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {}
  };
}
function createErrorToolResult(message) {
  return {
    content: [{ type: "text", text: message }],
    details: {}
  };
}
async function emitToolExecutionEnd(finalized, emit) {
  await emit({
    type: "tool_execution_end",
    toolCallId: finalized.toolCall.id,
    toolName: finalized.toolCall.name,
    result: finalized.result,
    isError: finalized.isError,
    executionStarted: finalized.executionStarted,
    ...finalized.errorKind ? { errorKind: finalized.errorKind } : {},
    ...finalized.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {}
  });
}
function createToolResultMessage(finalized) {
  return {
    role: "toolResult",
    toolCallId: finalized.toolCall.id,
    toolName: finalized.toolCall.name,
    content: finalized.result.content ?? [],
    details: finalized.result.details,
    isError: finalized.isError,
    timestamp: Date.now()
  };
}
async function emitToolResultMessage(toolResultMessage, emit) {
  await emit({ type: "message_start", message: toolResultMessage });
  await emit({ type: "message_end", message: toolResultMessage });
}

// packages/agent-core/src/agent.ts
function defaultConvertToLlm(messages) {
  return messages.filter(
    (message) => message.role === "user" || message.role === "assistant" || message.role === "toolResult"
  );
}
var DEFAULT_MODEL = {
  id: "unknown",
  name: "unknown",
  api: "unknown",
  provider: "unknown",
  baseUrl: "",
  reasoning: false,
  input: [],
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  contextWindow: 0,
  maxTokens: 0
};
function createMutableAgentState(initialState) {
  let tools = initialState?.tools?.slice() ?? [];
  let messages = initialState?.messages?.slice() ?? [];
  return {
    systemPrompt: initialState?.systemPrompt ?? "",
    model: initialState?.model ?? DEFAULT_MODEL,
    thinkingLevel: initialState?.thinkingLevel ?? "off",
    get tools() {
      return tools;
    },
    set tools(nextTools) {
      tools = nextTools.slice();
    },
    get messages() {
      return messages;
    },
    set messages(nextMessages) {
      messages = nextMessages.slice();
    },
    isStreaming: false,
    streamingMessage: void 0,
    pendingToolCalls: /* @__PURE__ */ new Set(),
    errorMessage: void 0
  };
}
var PendingMessageQueue = class {
  constructor(mode) {
    this.messages = [];
    this.mode = mode;
  }
  enqueue(message) {
    this.messages.push(message);
  }
  hasItems() {
    return this.messages.length > 0;
  }
  drain() {
    if (this.mode === "all") {
      const drained = this.messages.slice();
      this.messages = [];
      return drained;
    }
    const first = this.messages[0];
    if (!first) {
      return [];
    }
    this.messages = this.messages.slice(1);
    return [first];
  }
  clear() {
    this.messages = [];
  }
};
var Agent = class {
  constructor(options = {}) {
    this.listeners = /* @__PURE__ */ new Set();
    this.mutableState = createMutableAgentState(options.initialState);
    this.convertToLlm = options.convertToLlm ?? defaultConvertToLlm;
    this.transformContext = options.transformContext;
    this.runtime = options.runtime;
    this.streamFn = resolveAgentCoreStreamFn(options.runtime, options.streamFn);
    this.getApiKey = options.getApiKey;
    this.onPayload = options.onPayload;
    this.onResponse = options.onResponse;
    this.beforeToolCall = options.beforeToolCall;
    this.resolveDeferredTool = options.resolveDeferredTool;
    this.afterToolCall = options.afterToolCall;
    this.prepareNextTurn = options.prepareNextTurn;
    this.prepareNextTurnWithContext = options.prepareNextTurnWithContext;
    this.steeringQueue = new PendingMessageQueue(options.steeringMode ?? "one-at-a-time");
    this.followUpQueue = new PendingMessageQueue(options.followUpMode ?? "one-at-a-time");
    this.sessionId = options.sessionId;
    this.thinkingBudgets = options.thinkingBudgets;
    this.transport = options.transport ?? "auto";
    this.maxRetryDelayMs = options.maxRetryDelayMs;
    this.toolExecution = options.toolExecution ?? "parallel";
  }
  /**
   * Subscribe to agent lifecycle events.
   *
   * Listener promises are awaited in subscription order and are included in
   * the current run's settlement. Listeners also receive the active abort
   * signal for the current run.
   *
   * `agent_end` is the final emitted event for a run, but the agent does not
   * become idle until all awaited listeners for that event have settled.
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  /**
   * Current agent state.
   *
   * Assigning `state.tools` or `state.messages` copies the provided top-level array.
   */
  get state() {
    return this.mutableState;
  }
  /** Controls how queued steering messages are drained. */
  set steeringMode(mode) {
    this.steeringQueue.mode = mode;
  }
  get steeringMode() {
    return this.steeringQueue.mode;
  }
  /** Controls how queued follow-up messages are drained. */
  set followUpMode(mode) {
    this.followUpQueue.mode = mode;
  }
  get followUpMode() {
    return this.followUpQueue.mode;
  }
  /** Queue a message to be injected after the current assistant turn finishes. */
  steer(message) {
    this.steeringQueue.enqueue(message);
  }
  /** Queue a message to run only after the agent would otherwise stop. */
  followUp(message) {
    this.followUpQueue.enqueue(message);
  }
  /** Remove all queued steering messages. */
  clearSteeringQueue() {
    this.steeringQueue.clear();
  }
  /** Remove all queued follow-up messages. */
  clearFollowUpQueue() {
    this.followUpQueue.clear();
  }
  /** Remove all queued steering and follow-up messages. */
  clearAllQueues() {
    this.clearSteeringQueue();
    this.clearFollowUpQueue();
  }
  /** Returns true when either queue still contains pending messages. */
  hasQueuedMessages() {
    return this.steeringQueue.hasItems() || this.followUpQueue.hasItems();
  }
  /** Active abort signal for the current run, if any. */
  get signal() {
    return this.activeRun?.abortController.signal;
  }
  /** Abort the current run, if one is active. */
  abort(reason) {
    this.activeRun?.abortController.abort(reason);
  }
  /**
   * Resolve when the current run and all awaited event listeners have finished.
   *
   * This resolves after `agent_end` listeners settle.
   */
  waitForIdle() {
    return this.activeRun?.promise ?? Promise.resolve();
  }
  /** Clear transcript state, runtime state, and queued messages. */
  reset() {
    this.mutableState.messages = [];
    this.mutableState.isStreaming = false;
    this.mutableState.streamingMessage = void 0;
    this.mutableState.pendingToolCalls = /* @__PURE__ */ new Set();
    this.mutableState.errorMessage = void 0;
    this.clearFollowUpQueue();
    this.clearSteeringQueue();
  }
  async prompt(input, images) {
    if (this.activeRun) {
      throw new Error(
        "Agent is already processing a prompt. Use steer() or followUp() to queue messages, or wait for completion."
      );
    }
    const messages = this.normalizePromptInput(input, images);
    await this.runPromptMessages(messages);
  }
  /** Continue from the current transcript. The last message must be a user or tool-result message. */
  async continue() {
    if (this.activeRun) {
      throw new Error("Agent is already processing. Wait for completion before continuing.");
    }
    const lastMessage = this.mutableState.messages[this.mutableState.messages.length - 1];
    if (!lastMessage) {
      throw new Error("No messages to continue from");
    }
    if (lastMessage.role === "assistant" || lastMessage.role === "toolResult") {
      const queuedSteering = this.steeringQueue.drain();
      if (queuedSteering.length > 0) {
        await this.runPromptMessages(queuedSteering, { skipInitialSteeringPoll: true });
        return;
      }
      const queuedFollowUps = this.followUpQueue.drain();
      if (queuedFollowUps.length > 0) {
        await this.runPromptMessages(queuedFollowUps);
        return;
      }
    }
    if (lastMessage.role === "assistant") {
      throw new TranscriptNotContinuableError(lastMessage.role);
    }
    await this.runContinuation();
  }
  normalizePromptInput(input, images) {
    if (Array.isArray(input)) {
      return input;
    }
    if (typeof input !== "string") {
      return [input];
    }
    const content = [{ type: "text", text: input }];
    if (images && images.length > 0) {
      content.push(...images);
    }
    return [{ role: "user", content, timestamp: Date.now() }];
  }
  async runPromptMessages(messages, options = {}) {
    await this.runWithLifecycle(async (signal) => {
      await runAgentLoop(
        messages,
        this.createContextSnapshot(),
        this.createLoopConfig(options),
        (event) => this.processEvents(event),
        signal,
        this.streamFn
      );
    });
  }
  async runContinuation() {
    await this.runWithLifecycle(async (signal) => {
      await runAgentLoopContinue(
        this.createContextSnapshot(),
        this.createLoopConfig(),
        (event) => this.processEvents(event),
        signal,
        this.streamFn
      );
    });
  }
  createContextSnapshot() {
    return {
      systemPrompt: this.mutableState.systemPrompt,
      messages: this.mutableState.messages.slice(),
      tools: this.mutableState.tools.slice()
    };
  }
  createLoopConfig(options = {}) {
    let skipInitialSteeringPoll = options.skipInitialSteeringPoll === true;
    return {
      model: this.mutableState.model,
      thinkingLevel: this.mutableState.thinkingLevel,
      reasoning: resolveAgentReasoningOption(
        this.mutableState.model,
        this.mutableState.thinkingLevel
      ),
      sessionId: this.sessionId,
      onPayload: this.onPayload,
      onResponse: this.onResponse,
      transport: this.transport,
      thinkingBudgets: this.thinkingBudgets,
      maxRetryDelayMs: this.maxRetryDelayMs,
      toolExecution: this.toolExecution,
      beforeToolCall: this.beforeToolCall,
      resolveDeferredTool: this.resolveDeferredTool,
      afterToolCall: this.afterToolCall,
      prepareNextTurn: this.prepareNextTurnWithContext || this.prepareNextTurn ? async (context) => {
        if (this.prepareNextTurnWithContext) {
          return await this.prepareNextTurnWithContext(context, this.signal);
        }
        return await this.prepareNextTurn?.(this.signal);
      } : void 0,
      convertToLlm: this.convertToLlm,
      transformContext: this.transformContext,
      getApiKey: this.getApiKey,
      getSteeringMessages: async () => {
        if (skipInitialSteeringPoll) {
          skipInitialSteeringPoll = false;
          return [];
        }
        return this.steeringQueue.drain();
      },
      getFollowUpMessages: async () => this.followUpQueue.drain()
    };
  }
  async runWithLifecycle(executor) {
    if (this.activeRun) {
      throw new Error("Agent is already processing.");
    }
    const abortController = new AbortController();
    let resolvePromise = () => {
    };
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    this.activeRun = { promise, resolve: resolvePromise, abortController };
    this.mutableState.isStreaming = true;
    this.mutableState.streamingMessage = void 0;
    this.mutableState.errorMessage = void 0;
    try {
      await executor(abortController.signal);
    } catch (error) {
      await this.handleRunFailure(error, abortController.signal.aborted);
    } finally {
      this.finishRun();
    }
  }
  async handleRunFailure(error, aborted) {
    const failureMessage = createFailureMessage(this.mutableState.model, error, aborted);
    await this.processEvents({ type: "message_start", message: failureMessage });
    await this.processEvents({ type: "message_end", message: failureMessage });
    await this.processEvents({ type: "turn_end", message: failureMessage, toolResults: [] });
    const messages = [failureMessage];
    if (aborted && !isTurnHandoffAbort(this.signal)) {
      await appendInterruptedTurnMessage(messages, (event) => this.processEvents(event));
    }
    await this.processEvents({ type: "agent_end", messages });
  }
  finishRun() {
    this.mutableState.isStreaming = false;
    this.mutableState.streamingMessage = void 0;
    this.mutableState.pendingToolCalls = /* @__PURE__ */ new Set();
    this.activeRun?.resolve();
    this.activeRun = void 0;
  }
  /**
   * Reduce internal state for a loop event, then await listeners.
   *
   * `agent_end` only means no further loop events will be emitted. The run is
   * considered idle later, after all awaited listeners for `agent_end` finish
   * and `finishRun()` clears runtime-owned state.
   */
  async processEvents(event) {
    switch (event.type) {
      case "agent_start":
      case "turn_start":
      case "tool_execution_update":
        break;
      case "message_start":
        this.mutableState.streamingMessage = event.message;
        break;
      case "message_update":
        this.mutableState.streamingMessage = event.message;
        break;
      case "message_end":
        this.mutableState.streamingMessage = void 0;
        this.mutableState.messages.push(event.message);
        break;
      case "tool_execution_start": {
        const pendingToolCalls = new Set(this.mutableState.pendingToolCalls);
        pendingToolCalls.add(event.toolCallId);
        this.mutableState.pendingToolCalls = pendingToolCalls;
        break;
      }
      case "tool_execution_end": {
        const pendingToolCalls = new Set(this.mutableState.pendingToolCalls);
        pendingToolCalls.delete(event.toolCallId);
        this.mutableState.pendingToolCalls = pendingToolCalls;
        break;
      }
      case "turn_end":
        if (event.message.role === "assistant" && event.message.errorMessage) {
          this.mutableState.errorMessage = event.message.errorMessage;
        }
        break;
      case "agent_end":
        this.mutableState.streamingMessage = void 0;
        break;
    }
    const signal = this.activeRun?.abortController.signal;
    if (!signal) {
      throw new Error("Agent listener invoked outside active run");
    }
    for (const listener of this.listeners) {
      await listener(event, signal);
    }
  }
};

// packages/agent-core/src/harness/env/kill-tree.ts
import { spawn, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
var DEFAULT_GRACE_MS = 3e3;
var MAX_GRACE_MS = 6e4;
function killProcessTree(pid, opts) {
  if (!Number.isFinite(pid) || pid <= 0) {
    return;
  }
  if (process.platform === "win32") {
    if (opts?.force === true) {
      signalProcessTreeWindows(pid, "SIGKILL");
      return;
    }
    const graceMs2 = normalizeGraceMs(opts?.graceMs);
    killProcessTreeWindows(pid, graceMs2);
    return;
  }
  const useGroupKill = opts?.detached === true || opts?.detached !== false && isProcessGroupLeader(pid);
  if (opts?.force === true) {
    signalProcessTreeUnix(pid, "SIGKILL", useGroupKill);
    return;
  }
  const graceMs = normalizeGraceMs(opts?.graceMs);
  signalProcessTreeUnix(pid, "SIGTERM", useGroupKill);
  setTimeout(() => {
    const stillAlive = useGroupKill ? isProcessAlive(-pid) || isProcessAlive(pid) : isProcessAlive(pid);
    if (!stillAlive) {
      return;
    }
    signalProcessTreeUnix(pid, "SIGKILL", useGroupKill);
  }, graceMs).unref();
}
function signalProcessTree(pid, signal, opts) {
  if (!Number.isFinite(pid) || pid <= 0) {
    return;
  }
  if (process.platform === "win32") {
    signalProcessTreeWindows(pid, signal);
    return;
  }
  const useGroupKill = opts?.detached === true || opts?.detached !== false && isProcessGroupLeader(pid);
  signalProcessTreeUnix(pid, signal, useGroupKill);
}
function normalizeGraceMs(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_GRACE_MS;
  }
  return Math.max(0, Math.min(MAX_GRACE_MS, Math.floor(value)));
}
function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}
function parseProcessGroupId(value) {
  if (typeof value !== "string" || !/^\d+$/.test(value.trim())) {
    return void 0;
  }
  const pgid = Number(value.trim());
  return Number.isSafeInteger(pgid) && pgid > 0 ? pgid : void 0;
}
function readProcessGroupIdFromPs(pid) {
  try {
    const res = spawnSync("ps", ["-p", String(pid), "-o", "pgid="], {
      encoding: "utf8",
      timeout: 500
    });
    if (res.error || res.status !== 0) {
      return void 0;
    }
    return parseProcessGroupId(res.stdout);
  } catch {
    return void 0;
  }
}
function readProcessGroupIdFromProc(pid) {
  try {
    const stat = readFileSync(`/proc/${pid}/stat`, "utf8");
    const commEnd = stat.lastIndexOf(")");
    if (commEnd < 0) {
      return void 0;
    }
    const fields = stat.slice(commEnd + 1).trim().split(/\s+/);
    return parseProcessGroupId(fields[2]);
  } catch {
    return void 0;
  }
}
function isProcessGroupLeader(pid) {
  const procPgid = process.platform === "linux" ? readProcessGroupIdFromProc(pid) : void 0;
  const pgid = procPgid ?? readProcessGroupIdFromPs(pid);
  return pgid === pid;
}
function signalProcessTreeUnix(pid, signal, useGroupKill) {
  if (useGroupKill) {
    try {
      process.kill(-pid, signal);
      return;
    } catch {
    }
  }
  try {
    process.kill(pid, signal);
  } catch {
  }
}
function runTaskkill(args) {
  try {
    const child = spawn("taskkill", args, {
      stdio: "ignore",
      detached: true,
      windowsHide: true
    });
    child.once("error", () => {
    });
  } catch {
  }
}
function killProcessTreeWindows(pid, graceMs) {
  signalProcessTreeWindows(pid, "SIGTERM");
  setTimeout(() => {
    if (!isProcessAlive(pid)) {
      return;
    }
    signalProcessTreeWindows(pid, "SIGKILL");
  }, graceMs).unref();
}
function signalProcessTreeWindows(pid, signal) {
  const args = signal === "SIGKILL" ? ["/F", "/T", "/PID", String(pid)] : ["/T", "/PID", String(pid)];
  runTaskkill(args);
}

// packages/agent-core/src/harness/messages.ts
function asAgentMessage(message) {
  return message;
}
function parseSessionTimestampMs(value) {
  if (typeof value !== "string" || !value.trim()) {
    return void 0;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function requireSessionTimestampMs(value, label) {
  const parsed = parseSessionTimestampMs(value);
  if (parsed === void 0) {
    throw new Error(`${label} must be a valid timestamp`);
  }
  return parsed;
}
function normalizeCompactionSummaryTimestamp(timestamp) {
  if (typeof timestamp === "number") {
    return timestamp;
  }
  const parsed = parseSessionTimestampMs(timestamp);
  return parsed ?? 0;
}
var COMPACTION_SUMMARY_PREFIX = `The conversation history before this point was compacted into the following summary:

<summary>
`;
var COMPACTION_SUMMARY_SUFFIX = `
</summary>`;
var BRANCH_SUMMARY_PREFIX = `The following is a summary of a branch that this conversation came back from:

<summary>
`;
var BRANCH_SUMMARY_SUFFIX = `</summary>`;
function bashExecutionToText(msg) {
  let text = `Ran \`${msg.command}\`
`;
  if (msg.output) {
    text += `\`\`\`
${msg.output}
\`\`\``;
  } else {
    text += "(no output)";
  }
  if (msg.cancelled) {
    text += "\n\n(command cancelled)";
  } else if (msg.exitCode !== null && msg.exitCode !== void 0 && msg.exitCode !== 0) {
    text += `

Command exited with code ${msg.exitCode}`;
  }
  if (msg.truncated && msg.fullOutputPath) {
    text += `

[Output truncated. Full output: ${msg.fullOutputPath}]`;
  }
  return text;
}
function createBranchSummaryMessage(summary, fromId, timestamp) {
  return {
    role: "branchSummary",
    summary,
    fromId,
    timestamp: requireSessionTimestampMs(timestamp, "branch summary timestamp")
  };
}
function createCompactionSummaryMessage(summary, tokensBefore, timestamp) {
  return {
    role: "compactionSummary",
    summary,
    tokensBefore,
    timestamp: requireSessionTimestampMs(timestamp, "compaction summary timestamp")
  };
}
function createCustomMessage(customType, content, display, details, timestamp) {
  return {
    role: "custom",
    customType,
    content,
    display,
    details,
    timestamp: requireSessionTimestampMs(timestamp, "custom message timestamp")
  };
}
function convertToLlm(messages) {
  return messages.map((m) => {
    const message = m;
    switch (message.role) {
      case "bashExecution":
        if (message.excludeFromContext) {
          return void 0;
        }
        return {
          role: "user",
          content: [{ type: "text", text: bashExecutionToText(message) }],
          timestamp: message.timestamp
        };
      case "custom": {
        const content = typeof message.content === "string" ? [{ type: "text", text: message.content }] : message.content;
        const runtimeContextCarrier = message.details?.runtimeContextCarrier === true;
        return {
          role: "user",
          content,
          timestamp: message.timestamp,
          ...runtimeContextCarrier ? { runtimeContextCarrier: true } : {}
        };
      }
      case "branchSummary":
        return {
          role: "user",
          content: [
            {
              type: "text",
              text: BRANCH_SUMMARY_PREFIX + message.summary + BRANCH_SUMMARY_SUFFIX
            }
          ],
          timestamp: message.timestamp
        };
      case "compactionSummary":
        return {
          role: "user",
          content: [
            {
              type: "text",
              text: COMPACTION_SUMMARY_PREFIX + message.summary + COMPACTION_SUMMARY_SUFFIX
            }
          ],
          timestamp: normalizeCompactionSummaryTimestamp(message.timestamp)
        };
      case "user":
      case "assistant":
      case "toolResult":
        return message;
      default:
        return void 0;
    }
  }).filter((m) => m !== void 0);
}

// packages/agent-core/src/harness/prompt-template-arguments.ts
function parseCommandArgs(argsString) {
  const args = [];
  let current = "";
  let inQuote = null;
  let hasToken = false;
  for (const char of argsString) {
    if (inQuote) {
      if (char === inQuote) {
        inQuote = null;
      } else {
        hasToken = true;
        current += char;
      }
    } else if (char === '"' || char === "'") {
      hasToken = true;
      inQuote = char;
    } else if (/\s/.test(char)) {
      if (hasToken) {
        args.push(current);
        current = "";
        hasToken = false;
      }
    } else {
      hasToken = true;
      current += char;
    }
  }
  if (hasToken) {
    args.push(current);
  }
  return args;
}
function parseSafeNonNegativeInteger(raw) {
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : void 0;
}
function substituteArgs(content, args) {
  let result = content;
  result = result.replace(/\$(\d+)/g, (_, num) => {
    const parsed = parseSafeNonNegativeInteger(num);
    if (parsed === void 0 || parsed <= 0) {
      return "";
    }
    return args[parsed - 1] ?? "";
  });
  result = result.replace(
    /\$\{@:(\d+)(?::(\d+))?\}/g,
    (_, startStr, lengthStr) => {
      const parsedStart = parseSafeNonNegativeInteger(startStr);
      if (parsedStart === void 0) {
        return "";
      }
      let start = parsedStart - 1;
      if (start < 0) {
        start = 0;
      }
      if (lengthStr) {
        const length = parseSafeNonNegativeInteger(lengthStr);
        if (length === void 0) {
          return "";
        }
        return args.slice(start, start + length).join(" ");
      }
      return args.slice(start).join(" ");
    }
  );
  const allArgs = args.join(" ");
  result = result.replace(/\$ARGUMENTS/g, allArgs);
  result = result.replace(/\$@/g, allArgs);
  return result;
}
function formatPromptTemplateInvocation(template, args = []) {
  return substituteArgs(template.content, args);
}

// packages/agent-core/src/harness/session/session.ts
function buildSessionContext(pathEntries) {
  let thinkingLevel = "off";
  let model = null;
  let compaction = null;
  for (const entry of pathEntries) {
    if (entry.type === "thinking_level_change") {
      thinkingLevel = entry.thinkingLevel;
    } else if (entry.type === "model_change") {
      model = { provider: entry.provider, modelId: entry.modelId };
    } else if (entry.type === "message" && entry.message.role === "assistant") {
      model = { provider: entry.message.provider, modelId: entry.message.model };
    } else if (entry.type === "compaction") {
      compaction = entry;
    }
  }
  const messages = [];
  const appendMessage = (entry) => {
    if (entry.type === "message") {
      messages.push(entry.message);
    } else if (entry.type === "custom_message") {
      messages.push(
        asAgentMessage(
          createCustomMessage(
            entry.customType,
            entry.content,
            entry.display,
            entry.details,
            entry.timestamp
          )
        )
      );
    } else if (entry.type === "branch_summary" && entry.summary) {
      messages.push(
        asAgentMessage(createBranchSummaryMessage(entry.summary, entry.fromId, entry.timestamp))
      );
    }
  };
  if (compaction) {
    messages.push(
      asAgentMessage(
        createCompactionSummaryMessage(
          compaction.summary,
          compaction.tokensBefore,
          compaction.timestamp
        )
      )
    );
    const compactionIdx = pathEntries.findIndex(
      (entry) => entry.type === "compaction" && entry.id === compaction.id
    );
    let foundFirstKept = false;
    for (const entry of pathEntries.slice(0, compactionIdx)) {
      if (entry.id === compaction.firstKeptEntryId) {
        foundFirstKept = true;
      }
      if (foundFirstKept) {
        appendMessage(entry);
      }
    }
    for (const entry of pathEntries.slice(compactionIdx + 1)) {
      appendMessage(entry);
    }
  } else {
    for (const entry of pathEntries) {
      appendMessage(entry);
    }
  }
  return { messages, thinkingLevel, model };
}

// packages/normalization-core/src/result.ts
function ok(value) {
  return { ok: true, value };
}
function err(error) {
  return { ok: false, error };
}

// packages/agent-core/src/harness/types.ts
var CompactionError = class extends Error {
  constructor(code, message, cause) {
    super(message, cause === void 0 ? void 0 : { cause });
    this.name = "CompactionError";
    this.code = code;
  }
};
var BranchSummaryError = class extends Error {
  constructor(code, message, cause) {
    super(message, cause === void 0 ? void 0 : { cause });
    this.name = "BranchSummaryError";
    this.code = code;
  }
};

// packages/normalization-core/src/utf16-slice.ts
function isHighSurrogate(codeUnit) {
  return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
  return codeUnit >= 56320 && codeUnit <= 57343;
}
function sliceUtf16Safe(input, start, end) {
  const len = input.length;
  let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
  let to = end === void 0 ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
  if (to <= from) {
    return "";
  }
  if (from > 0 && from < len) {
    const codeUnit = input.charCodeAt(from);
    if (isLowSurrogate(codeUnit) && isHighSurrogate(input.charCodeAt(from - 1))) {
      from += 1;
    }
  }
  if (to > 0 && to < len) {
    const codeUnit = input.charCodeAt(to - 1);
    if (isHighSurrogate(codeUnit) && isLowSurrogate(input.charCodeAt(to))) {
      to -= 1;
    }
  }
  return input.slice(from, to);
}
function truncateUtf16Safe(input, maxLen) {
  const limit = Math.max(0, Math.floor(maxLen));
  if (input.length <= limit) {
    return input;
  }
  return sliceUtf16Safe(input, 0, limit);
}

// packages/agent-core/src/harness/compaction/utils.ts
function createFileOps() {
  return {
    read: /* @__PURE__ */ new Set(),
    written: /* @__PURE__ */ new Set(),
    edited: /* @__PURE__ */ new Set()
  };
}
function extractFileOpsFromMessage(message, fileOps) {
  if (message.role !== "assistant") {
    return;
  }
  if (!("content" in message) || !Array.isArray(message.content)) {
    return;
  }
  for (const block of message.content) {
    if (typeof block !== "object" || block === null) {
      continue;
    }
    if (!("type" in block) || block.type !== "toolCall") {
      continue;
    }
    if (!("arguments" in block) || !("name" in block)) {
      continue;
    }
    const args = block.arguments;
    if (!args) {
      continue;
    }
    const path = typeof args.path === "string" ? args.path : void 0;
    if (!path) {
      continue;
    }
    switch (block.name) {
      case "read":
        fileOps.read.add(path);
        break;
      case "write":
        fileOps.written.add(path);
        break;
      case "edit":
        fileOps.edited.add(path);
        break;
    }
  }
}
function computeFileLists(fileOps) {
  const modified = /* @__PURE__ */ new Set([...fileOps.edited, ...fileOps.written]);
  const readOnly = [...fileOps.read].filter((f) => !modified.has(f)).toSorted();
  const modifiedFiles = [...modified].toSorted();
  return { readFiles: readOnly, modifiedFiles };
}
function formatFileOperations(readFiles, modifiedFiles) {
  const sections = [];
  if (readFiles.length > 0) {
    sections.push(`<read-files>
${readFiles.join("\n")}
</read-files>`);
  }
  if (modifiedFiles.length > 0) {
    sections.push(`<modified-files>
${modifiedFiles.join("\n")}
</modified-files>`);
  }
  if (sections.length === 0) {
    return "";
  }
  return `

${sections.join("\n\n")}`;
}
var TOOL_RESULT_MAX_CHARS = 2e3;
function safeJsonStringify(value) {
  try {
    return JSON.stringify(value) ?? "undefined";
  } catch {
    return "[unserializable]";
  }
}
function truncateForSummary(text, maxChars) {
  if (text.length <= maxChars) {
    return text;
  }
  const sliced = truncateUtf16Safe(text, maxChars);
  const truncatedChars = text.length - sliced.length;
  return `${sliced}

[... ${truncatedChars} more characters truncated]`;
}
function getCompactionContentBlockText(block) {
  if (block.type === "text" && block.text) {
    return block.text;
  }
  if (block.type !== "toolResult" && block.type !== "tool_result") {
    return "";
  }
  if (block.text) {
    return block.text;
  }
  return typeof block.content === "string" ? block.content : "";
}
function serializeConversation(messages) {
  const parts = [];
  for (const msg of messages) {
    if (msg.role === "user") {
      const content = typeof msg.content === "string" ? msg.content : msg.content.filter((c) => c.type === "text").map((c) => c.text).join("");
      if (content) {
        parts.push(`[User]: ${content}`);
      }
    } else if (msg.role === "assistant") {
      const textParts = [];
      const thinkingParts = [];
      const toolCalls = [];
      for (const block of msg.content) {
        if (block.type === "text") {
          textParts.push(block.text);
        } else if (block.type === "thinking") {
          thinkingParts.push(block.thinking);
        } else if (block.type === "toolCall") {
          const args = block.arguments;
          const argsStr = Object.entries(args).map(([k, v]) => `${k}=${safeJsonStringify(v)}`).join(", ");
          toolCalls.push(`${block.name}(${argsStr})`);
        }
      }
      if (thinkingParts.length > 0) {
        parts.push(`[Assistant thinking]: ${thinkingParts.join("\n")}`);
      }
      if (textParts.length > 0) {
        parts.push(`[Assistant]: ${textParts.join("\n")}`);
      }
      if (toolCalls.length > 0) {
        parts.push(`[Assistant tool calls]: ${toolCalls.join("; ")}`);
      }
    } else if (msg.role === "toolResult") {
      const content = msg.content.map(getCompactionContentBlockText).join("");
      if (content) {
        parts.push(`[Tool result]: ${truncateForSummary(content, TOOL_RESULT_MAX_CHARS)}`);
      }
    }
  }
  return parts.join("\n\n");
}

// packages/agent-core/src/harness/compaction/compaction.ts
function safeJsonStringify2(value) {
  try {
    return JSON.stringify(value) ?? "undefined";
  } catch {
    return "[unserializable]";
  }
}
function extractFileOperations(messages, entries, prevCompactionIndex) {
  const fileOps = createFileOps();
  if (prevCompactionIndex >= 0) {
    const prevCompaction = entries[prevCompactionIndex];
    if (!prevCompaction.fromHook && prevCompaction.details) {
      const details = prevCompaction.details;
      if (Array.isArray(details.readFiles)) {
        for (const f of details.readFiles) {
          fileOps.read.add(f);
        }
      }
      if (Array.isArray(details.modifiedFiles)) {
        for (const f of details.modifiedFiles) {
          fileOps.edited.add(f);
        }
      }
    }
  }
  for (const msg of messages) {
    extractFileOpsFromMessage(msg, fileOps);
  }
  return fileOps;
}
function getMessageFromEntry(entry) {
  if (entry.type === "message") {
    return entry.message;
  }
  if (entry.type === "custom_message") {
    return asAgentMessage(
      createCustomMessage(
        entry.customType,
        entry.content,
        entry.display,
        entry.details,
        entry.timestamp
      )
    );
  }
  if (entry.type === "branch_summary") {
    return asAgentMessage(createBranchSummaryMessage(entry.summary, entry.fromId, entry.timestamp));
  }
  if (entry.type === "compaction") {
    return asAgentMessage(
      createCompactionSummaryMessage(entry.summary, entry.tokensBefore, entry.timestamp)
    );
  }
  return void 0;
}
function getMessageFromEntryForCompaction(entry) {
  if (entry.type === "compaction") {
    return void 0;
  }
  return getMessageFromEntry(entry);
}
var DEFAULT_COMPACTION_SETTINGS = {
  enabled: true,
  reserveTokens: 16384,
  keepRecentTokens: 2e4
};
function calculateContextTokens(usage) {
  if (usage.contextUsage?.state === "available") {
    return usage.contextUsage.totalTokens;
  }
  return usage.totalTokens || usage.input + usage.output + usage.cacheRead + usage.cacheWrite;
}
function getAssistantUsage(msg) {
  if (msg.role === "assistant" && "usage" in msg) {
    const assistantMsg = msg;
    if (assistantMsg.stopReason !== "aborted" && assistantMsg.stopReason !== "error" && assistantMsg.usage && calculateContextTokens(assistantMsg.usage) > 0) {
      return assistantMsg.usage;
    }
  }
  return void 0;
}
function getLastAssistantUsage(entries) {
  for (const entry of entries.toReversed()) {
    if (entry.type === "message") {
      const usage = getAssistantUsage(entry.message);
      if (usage) {
        return usage;
      }
    }
  }
  return void 0;
}
function getLastAssistantUsageInfo(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages.at(i);
    if (!message) {
      continue;
    }
    const usage = getAssistantUsage(message);
    if (usage && usage.contextUsage?.state !== "unavailable") {
      return { usage, index: i };
    }
  }
  return void 0;
}
function estimateContextTokens(messages) {
  const usageInfo = getLastAssistantUsageInfo(messages);
  if (!usageInfo) {
    let estimated = 0;
    for (const message of messages) {
      estimated += estimateTokens(message);
    }
    return {
      tokens: estimated,
      usageTokens: 0,
      trailingTokens: estimated,
      lastUsageIndex: null
    };
  }
  const usageTokens = calculateContextTokens(usageInfo.usage);
  let trailingTokens = 0;
  for (const message of messages.slice(usageInfo.index + 1)) {
    trailingTokens += estimateTokens(message);
  }
  return {
    tokens: usageTokens + trailingTokens,
    usageTokens,
    trailingTokens,
    lastUsageIndex: usageInfo.index
  };
}
function shouldCompact(contextTokens, contextWindow, settings) {
  if (!settings.enabled) {
    return false;
  }
  return contextTokens > contextWindow - settings.reserveTokens;
}
var IMAGE_BLOCK_CHARS = 4800;
function countContentBlockChars(content) {
  let chars = 0;
  for (const block of content) {
    if (block.type === "image") {
      chars += IMAGE_BLOCK_CHARS;
    } else {
      chars += getCompactionContentBlockText(block).length;
    }
  }
  return chars;
}
function estimateTokens(message) {
  let chars = 0;
  const harnessMessage = message;
  switch (harnessMessage.role) {
    case "user": {
      const content = harnessMessage.content;
      if (typeof content === "string") {
        chars = content.length;
      } else if (Array.isArray(content)) {
        chars = countContentBlockChars(content);
      }
      return Math.ceil(chars / 4);
    }
    case "assistant": {
      const assistant = harnessMessage;
      for (const block of assistant.content) {
        if (block.type === "text") {
          chars += block.text.length;
        } else if (block.type === "thinking") {
          chars += block.thinking.length;
        } else if (block.type === "toolCall") {
          chars += block.name.length + safeJsonStringify2(block.arguments).length;
        }
      }
      return Math.ceil(chars / 4);
    }
    case "custom":
    case "toolResult": {
      if (typeof harnessMessage.content === "string") {
        chars = harnessMessage.content.length;
      } else {
        chars = countContentBlockChars(harnessMessage.content);
      }
      return Math.ceil(chars / 4);
    }
    case "bashExecution": {
      chars = harnessMessage.command.length + harnessMessage.output.length;
      return Math.ceil(chars / 4);
    }
    case "branchSummary":
    case "compactionSummary": {
      chars = harnessMessage.summary.length;
      return Math.ceil(chars / 4);
    }
  }
  return 0;
}
function isCutPointMessage(message) {
  switch (message.role) {
    case "user":
    case "assistant":
    case "bashExecution":
    case "custom":
    case "branchSummary":
    case "compactionSummary":
      return true;
    case "toolResult":
      return false;
  }
  return false;
}
function isTurnStartMessage(message) {
  switch (message.role) {
    case "user":
    case "bashExecution":
    case "custom":
    case "branchSummary":
    case "compactionSummary":
      return true;
    case "assistant":
    case "toolResult":
      return false;
  }
  return false;
}
function isTurnStartEntry(entry) {
  const message = getMessageFromEntryForCompaction(entry);
  return message ? isTurnStartMessage(message) : false;
}
function findValidCutPoints(entries, startIndex, endIndex) {
  const cutPoints = [];
  for (let i = startIndex; i < endIndex; i++) {
    const entry = entries[i];
    if (!entry) {
      continue;
    }
    const message = getMessageFromEntryForCompaction(entry);
    if (message && isCutPointMessage(message)) {
      cutPoints.push(i);
    }
  }
  return cutPoints;
}
function findTurnStartIndex(entries, entryIndex, startIndex) {
  for (let i = entryIndex; i >= startIndex; i--) {
    const entry = entries[i];
    if (!entry) {
      continue;
    }
    if (isTurnStartEntry(entry)) {
      return i;
    }
  }
  return -1;
}
function findCutPoint(entries, startIndex, endIndex, keepRecentTokens) {
  const cutPoints = findValidCutPoints(entries, startIndex, endIndex);
  if (cutPoints.length === 0) {
    return { firstKeptEntryIndex: startIndex, turnStartIndex: -1, isSplitTurn: false };
  }
  let accumulatedTokens = 0;
  const firstCutIndex = cutPoints.at(0);
  if (firstCutIndex === void 0) {
    return { firstKeptEntryIndex: startIndex, turnStartIndex: -1, isSplitTurn: false };
  }
  let cutIndex = firstCutIndex;
  for (let i = endIndex - 1; i >= startIndex; i--) {
    const entry = entries[i];
    if (!entry) {
      continue;
    }
    const message = getMessageFromEntryForCompaction(entry);
    if (!message) {
      continue;
    }
    const messageTokens = estimateTokens(message);
    accumulatedTokens += messageTokens;
    if (accumulatedTokens >= keepRecentTokens) {
      const lastCutIndex = cutPoints.at(-1);
      if (lastCutIndex === void 0) {
        throw new Error("compaction cut-point list became empty during selection");
      }
      cutIndex = lastCutIndex;
      for (const cutPoint of cutPoints) {
        if (cutPoint >= i) {
          cutIndex = cutPoint;
          break;
        }
      }
      break;
    }
  }
  while (cutIndex > startIndex) {
    const prevEntry = entries[cutIndex - 1];
    if (!prevEntry) {
      break;
    }
    if (prevEntry.type === "compaction") {
      break;
    }
    if (getMessageFromEntryForCompaction(prevEntry)) {
      break;
    }
    cutIndex--;
  }
  const cutEntry = entries[cutIndex];
  if (!cutEntry) {
    throw new Error("compaction cut point does not reference a session entry");
  }
  const startsTurn = isTurnStartEntry(cutEntry);
  const turnStartIndex = startsTurn ? -1 : findTurnStartIndex(entries, cutIndex, startIndex);
  return {
    firstKeptEntryIndex: cutIndex,
    turnStartIndex,
    isSplitTurn: !startsTurn && turnStartIndex !== -1
  };
}
var SUMMARIZATION_SYSTEM_PROMPT = `You are a context summarization assistant. Your task is to read a conversation between a user and an AI assistant, then produce a structured summary following the exact format specified.

Do NOT continue the conversation. Do NOT respond to any questions in the conversation. ONLY output the structured summary.`;
var SUMMARIZATION_PROMPT = `The messages above are a conversation to summarize. Create a structured context checkpoint summary that another LLM will use to continue the work.

Use this EXACT format:

## Goal
[What is the user trying to accomplish? Can be multiple items if the session covers different tasks.]

## Constraints & Preferences
- [Any constraints, preferences, or requirements mentioned by user]
- [Or "(none)" if none were mentioned]

## Progress
### Done
- [x] [Completed tasks/changes]

### In Progress
- [ ] [Current work]

### Blocked
- [Issues preventing progress, if any]

## Key Decisions
- **[Decision]**: [Brief rationale]

## Next Steps
1. [Ordered list of what should happen next]

## Critical Context
- [Any data, examples, or references needed to continue]
- [Or "(none)" if not applicable]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
var UPDATE_SUMMARIZATION_PROMPT = `The messages above are NEW conversation messages to incorporate into the existing summary provided in <previous-summary> tags.

Update the existing structured summary with new information. RULES:
- PRESERVE all existing information from the previous summary
- ADD new progress, decisions, and context from the new messages
- UPDATE the Progress section: move items from "In Progress" to "Done" when completed
- UPDATE "Next Steps" based on what was accomplished
- PRESERVE exact file paths, function names, and error messages
- If something is no longer relevant, you may remove it

Use this EXACT format:

## Goal
[Preserve existing goals, add new ones if the task expanded]

## Constraints & Preferences
- [Preserve existing, add new ones discovered]

## Progress
### Done
- [x] [Include previously done items AND newly completed items]

### In Progress
- [ ] [Current work - update based on progress]

### Blocked
- [Current blockers - remove if resolved]

## Key Decisions
- **[Decision]**: [Brief rationale] (preserve all previous, add new)

## Next Steps
1. [Update based on current state]

## Critical Context
- [Preserve important context, add new if needed]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
function createSummarizationOptions(model, maxTokens, apiKey, headers, signal, thinkingLevel) {
  const options = { maxTokens, signal, apiKey, headers };
  const fableReasoning = (model.api === "anthropic-messages" || model.api === "bedrock-converse-stream") && resolveClaudeFable5ModelIdentity(model) !== void 0;
  if ((model.reasoning || fableReasoning) && thinkingLevel) {
    options.reasoning = resolveAgentReasoningOption(model, thinkingLevel);
  }
  return options;
}
async function completeSummarization(model, context, options, streamFn, runtime) {
  if (streamFn) {
    return (await streamFn(model, context, options)).result();
  }
  return await resolveAgentCoreCompleteFn(runtime)(model, context, options);
}
async function runSummarizationCompletion(params) {
  const summarizationMessages = [
    {
      role: "user",
      content: [{ type: "text", text: params.promptText }],
      timestamp: Date.now()
    }
  ];
  const response = await completeSummarization(
    params.model,
    { systemPrompt: SUMMARIZATION_SYSTEM_PROMPT, messages: summarizationMessages },
    createSummarizationOptions(
      params.model,
      params.maxTokens,
      params.apiKey,
      params.headers,
      params.signal,
      params.thinkingLevel
    ),
    params.streamFn,
    params.runtime
  );
  if (response.stopReason === "aborted") {
    return err(
      new CompactionError("aborted", response.errorMessage || `${params.errorLabel} aborted`)
    );
  }
  if (response.stopReason === "error") {
    return err(
      new CompactionError(
        "summarization_failed",
        `${params.errorLabel} failed: ${response.errorMessage || "Unknown error"}`
      )
    );
  }
  return ok(
    response.content.filter((c) => c.type === "text").map((c) => c.text).join("\n")
  );
}
async function generateSummary(currentMessages, model, reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, runtime) {
  const maxTokens = Math.min(
    Math.floor(0.8 * reserveTokens),
    model.maxTokens > 0 ? model.maxTokens : Number.POSITIVE_INFINITY
  );
  let basePrompt = previousSummary ? UPDATE_SUMMARIZATION_PROMPT : SUMMARIZATION_PROMPT;
  if (customInstructions) {
    basePrompt = `${basePrompt}

Additional focus: ${customInstructions}`;
  }
  const llmMessages = convertToLlm(currentMessages);
  const conversationText = serializeConversation(llmMessages);
  let promptText = `<conversation>
${conversationText}
</conversation>

`;
  if (previousSummary) {
    promptText += `<previous-summary>
${previousSummary}
</previous-summary>

`;
  }
  promptText += basePrompt;
  return await runSummarizationCompletion({
    promptText,
    model,
    maxTokens,
    apiKey,
    headers,
    signal,
    thinkingLevel,
    streamFn,
    runtime,
    errorLabel: "Summarization"
  });
}
function prepareCompaction(pathEntries, settings) {
  if (pathEntries.at(-1)?.type === "compaction" || pathEntries.length === 0) {
    return ok(void 0);
  }
  let prevCompactionIndex = -1;
  for (let i = pathEntries.length - 1; i >= 0; i--) {
    if (pathEntries.at(i)?.type === "compaction") {
      prevCompactionIndex = i;
      break;
    }
  }
  let previousSummary;
  let boundaryStart = 0;
  if (prevCompactionIndex >= 0) {
    const prevCompaction = pathEntries[prevCompactionIndex];
    previousSummary = prevCompaction.summary;
    const firstKeptEntryIndex = pathEntries.findIndex(
      (entry) => entry.id === prevCompaction.firstKeptEntryId
    );
    boundaryStart = firstKeptEntryIndex >= 0 ? firstKeptEntryIndex : prevCompactionIndex + 1;
  }
  const boundaryEnd = pathEntries.length;
  const tokensBefore = estimateContextTokens(buildSessionContext(pathEntries).messages).tokens;
  const cutPoint = findCutPoint(pathEntries, boundaryStart, boundaryEnd, settings.keepRecentTokens);
  const firstKeptEntry = pathEntries[cutPoint.firstKeptEntryIndex];
  if (!firstKeptEntry?.id) {
    return err(
      new CompactionError(
        "invalid_session",
        "First kept entry has no UUID - session may need migration"
      )
    );
  }
  const firstKeptEntryId = firstKeptEntry.id;
  const historyEnd = cutPoint.isSplitTurn ? cutPoint.turnStartIndex : cutPoint.firstKeptEntryIndex;
  const messagesToSummarize = [];
  for (let i = boundaryStart; i < historyEnd; i++) {
    const entry = pathEntries.at(i);
    const msg = entry ? getMessageFromEntryForCompaction(entry) : void 0;
    if (msg) {
      messagesToSummarize.push(msg);
    }
  }
  const turnPrefixMessages = [];
  if (cutPoint.isSplitTurn) {
    for (let i = cutPoint.turnStartIndex; i < cutPoint.firstKeptEntryIndex; i++) {
      const entry = pathEntries.at(i);
      const msg = entry ? getMessageFromEntryForCompaction(entry) : void 0;
      if (msg) {
        turnPrefixMessages.push(msg);
      }
    }
  }
  if (messagesToSummarize.length === 0 && turnPrefixMessages.length === 0) {
    return ok(void 0);
  }
  const fileOps = extractFileOperations(messagesToSummarize, pathEntries, prevCompactionIndex);
  if (cutPoint.isSplitTurn) {
    for (const msg of turnPrefixMessages) {
      extractFileOpsFromMessage(msg, fileOps);
    }
  }
  return ok({
    firstKeptEntryId,
    messagesToSummarize,
    turnPrefixMessages,
    isSplitTurn: cutPoint.isSplitTurn,
    tokensBefore,
    previousSummary,
    fileOps,
    settings
  });
}
var TURN_PREFIX_SUMMARIZATION_PROMPT = `This is the PREFIX of a turn that was too large to keep. The SUFFIX (recent work) is retained.

Summarize the prefix to provide context for the retained suffix:

## Original Request
[What did the user ask for in this turn?]

## Early Progress
- [Key decisions and work done in the prefix]

## Context for Suffix
- [Information needed to understand the retained recent work]

Be concise. Focus on what's needed to understand the kept suffix.`;
async function compact(preparation, model, apiKey, headers, customInstructions, signal, thinkingLevel, streamFn, runtime) {
  const {
    firstKeptEntryId,
    messagesToSummarize,
    turnPrefixMessages,
    isSplitTurn,
    tokensBefore,
    previousSummary,
    fileOps,
    settings
  } = preparation;
  if (!firstKeptEntryId) {
    return err(
      new CompactionError(
        "invalid_session",
        "First kept entry has no UUID - session may need migration"
      )
    );
  }
  let summary;
  if (isSplitTurn && turnPrefixMessages.length > 0) {
    const historyResult = messagesToSummarize.length > 0 ? await generateSummary(
      messagesToSummarize,
      model,
      settings.reserveTokens,
      apiKey,
      headers,
      signal,
      customInstructions,
      previousSummary,
      thinkingLevel,
      streamFn,
      runtime
    ) : ok("No prior history.");
    if (!historyResult.ok) {
      return err(historyResult.error);
    }
    const turnPrefixResult = await generateTurnPrefixSummary(
      turnPrefixMessages,
      model,
      settings.reserveTokens,
      apiKey,
      headers,
      signal,
      thinkingLevel,
      streamFn,
      runtime
    );
    if (!turnPrefixResult.ok) {
      return err(turnPrefixResult.error);
    }
    summary = `${historyResult.value}

---

**Turn Context (split turn):**

${turnPrefixResult.value}`;
  } else {
    const summaryResult = await generateSummary(
      messagesToSummarize,
      model,
      settings.reserveTokens,
      apiKey,
      headers,
      signal,
      customInstructions,
      previousSummary,
      thinkingLevel,
      streamFn,
      runtime
    );
    if (!summaryResult.ok) {
      return err(summaryResult.error);
    }
    summary = summaryResult.value;
  }
  const { readFiles, modifiedFiles } = computeFileLists(fileOps);
  summary += formatFileOperations(readFiles, modifiedFiles);
  return ok({
    summary,
    firstKeptEntryId,
    tokensBefore,
    details: { readFiles, modifiedFiles }
  });
}
async function generateTurnPrefixSummary(messages, model, reserveTokens, apiKey, headers, signal, thinkingLevel, streamFn, runtime) {
  const maxTokens = Math.min(
    Math.floor(0.5 * reserveTokens),
    model.maxTokens > 0 ? model.maxTokens : Number.POSITIVE_INFINITY
  );
  const llmMessages = convertToLlm(messages);
  const conversationText = serializeConversation(llmMessages);
  const promptText = `<conversation>
${conversationText}
</conversation>

${TURN_PREFIX_SUMMARIZATION_PROMPT}`;
  return await runSummarizationCompletion({
    promptText,
    model,
    maxTokens,
    apiKey,
    headers,
    signal,
    thinkingLevel,
    streamFn,
    runtime,
    errorLabel: "Turn prefix summarization"
  });
}

// packages/agent-core/src/harness/compaction/branch-summarization.ts
function collectEntriesForBranchSummaryFromBranches(oldBranch, targetBranch) {
  const oldPath = new Set(oldBranch.map((entry) => entry.id));
  let commonAncestorId = null;
  for (const targetEntry of targetBranch.toReversed()) {
    if (oldPath.has(targetEntry.id)) {
      commonAncestorId = targetEntry.id;
      break;
    }
  }
  const firstSummarizedIndex = commonAncestorId === null ? 0 : oldBranch.findIndex((entry) => entry.id === commonAncestorId) + 1;
  return { entries: oldBranch.slice(firstSummarizedIndex), commonAncestorId };
}
function getMessageFromEntry2(entry) {
  switch (entry.type) {
    case "message":
      if (entry.message.role === "toolResult") {
        return void 0;
      }
      return entry.message;
    case "custom_message":
      return asAgentMessage(
        createCustomMessage(
          entry.customType,
          entry.content,
          entry.display,
          entry.details,
          entry.timestamp
        )
      );
    case "branch_summary":
      return asAgentMessage(
        createBranchSummaryMessage(entry.summary, entry.fromId, entry.timestamp)
      );
    case "compaction":
      return asAgentMessage(
        createCompactionSummaryMessage(entry.summary, entry.tokensBefore, entry.timestamp)
      );
    case "thinking_level_change":
    case "model_change":
    case "custom":
    case "label":
    case "session_info":
    case "leaf":
      return void 0;
  }
  return void 0;
}
function prepareBranchEntries(entries, tokenBudget = 0) {
  const messages = [];
  const fileOps = createFileOps();
  let totalTokens = 0;
  for (const entry of entries) {
    if (entry.type === "branch_summary" && !entry.fromHook && entry.details) {
      const details = entry.details;
      if (Array.isArray(details.readFiles)) {
        for (const f of details.readFiles) {
          fileOps.read.add(f);
        }
      }
      if (Array.isArray(details.modifiedFiles)) {
        for (const f of details.modifiedFiles) {
          fileOps.edited.add(f);
        }
      }
    }
  }
  for (const entry of entries.toReversed()) {
    const message = getMessageFromEntry2(entry);
    if (!message) {
      continue;
    }
    extractFileOpsFromMessage(message, fileOps);
    const tokens = estimateTokens(message);
    if (tokenBudget > 0 && totalTokens + tokens > tokenBudget) {
      if (entry.type === "compaction" || entry.type === "branch_summary") {
        if (totalTokens < tokenBudget * 0.9) {
          messages.unshift(message);
          totalTokens += tokens;
        }
      }
      break;
    }
    messages.unshift(message);
    totalTokens += tokens;
  }
  return { messages, fileOps, totalTokens };
}
var BRANCH_SUMMARY_PREAMBLE = `The user explored a different conversation branch before returning here.
Summary of that exploration:

`;
var BRANCH_SUMMARY_PROMPT = `Create a structured summary of this conversation branch for context when returning later.

Use this EXACT format:

## Goal
[What was the user trying to accomplish in this branch?]

## Constraints & Preferences
- [Any constraints, preferences, or requirements mentioned]
- [Or "(none)" if none were mentioned]

## Progress
### Done
- [x] [Completed tasks/changes]

### In Progress
- [ ] [Work that was started but not finished]

### Blocked
- [Issues preventing progress, if any]

## Key Decisions
- **[Decision]**: [Brief rationale]

## Next Steps
1. [What should happen next to continue this work]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
async function generateBranchSummary(entries, options) {
  const {
    model,
    apiKey,
    headers,
    signal,
    customInstructions,
    replaceInstructions,
    reserveTokens = 16384
  } = options;
  const contextWindow = model.contextWindow || 128e3;
  const tokenBudget = contextWindow - reserveTokens;
  const { messages, fileOps } = prepareBranchEntries(entries, tokenBudget);
  if (messages.length === 0) {
    return ok({ summary: "No content to summarize", readFiles: [], modifiedFiles: [] });
  }
  const llmMessages = convertToLlm(messages);
  const conversationText = serializeConversation(llmMessages);
  let instructions;
  if (replaceInstructions && customInstructions) {
    instructions = customInstructions;
  } else if (customInstructions) {
    instructions = `${BRANCH_SUMMARY_PROMPT}

Additional focus: ${customInstructions}`;
  } else {
    instructions = BRANCH_SUMMARY_PROMPT;
  }
  const promptText = `<conversation>
${conversationText}
</conversation>

${instructions}`;
  const summarizationMessages = [
    {
      role: "user",
      content: [{ type: "text", text: promptText }],
      timestamp: Date.now()
    }
  ];
  const context = { systemPrompt: SUMMARIZATION_SYSTEM_PROMPT, messages: summarizationMessages };
  const streamOptions = { apiKey, headers, signal, maxTokens: 2048 };
  const response = options.streamFn ? await (await options.streamFn(model, context, streamOptions)).result() : await resolveAgentCoreCompleteFn(options.runtime)(model, context, streamOptions);
  if (response.stopReason === "aborted") {
    return err(
      new BranchSummaryError("aborted", response.errorMessage || "Branch summary aborted")
    );
  }
  if (response.stopReason === "error") {
    return err(
      new BranchSummaryError(
        "summarization_failed",
        `Branch summary failed: ${response.errorMessage || "Unknown error"}`
      )
    );
  }
  let summary = response.content.filter((c) => c.type === "text").map((c) => c.text).join("\n");
  summary = BRANCH_SUMMARY_PREAMBLE + summary;
  const { readFiles, modifiedFiles } = computeFileLists(fileOps);
  summary += formatFileOperations(readFiles, modifiedFiles);
  return ok({
    summary: summary || "No summary generated",
    readFiles,
    modifiedFiles
  });
}

// packages/agent-core/src/harness/utils/truncate.ts
var DEFAULT_MAX_LINES = 2e3;
var DEFAULT_MAX_BYTES = 50 * 1024;
var GREP_MAX_LINE_LENGTH = 500;
var runtimeBuffer = globalThis.Buffer;
function splitLinesForCounting(content) {
  if (content.length === 0) {
    return [];
  }
  const lines = content.split("\n");
  if (content.endsWith("\n")) {
    lines.pop();
  }
  return lines;
}
function findFirstNonAscii(content) {
  for (let index = 0; index < content.length; index++) {
    if (content.charCodeAt(index) > 127) {
      return index;
    }
  }
  return -1;
}
function utf8ByteLength(content) {
  if (runtimeBuffer) {
    return runtimeBuffer.byteLength(content, "utf8");
  }
  const firstNonAscii = findFirstNonAscii(content);
  if (firstNonAscii === -1) {
    return content.length;
  }
  let bytes = firstNonAscii;
  for (let i = firstNonAscii; i < content.length; i++) {
    const code = content.charCodeAt(i);
    if (code <= 127) {
      bytes += 1;
    } else if (code <= 2047) {
      bytes += 2;
    } else if (code >= 55296 && code <= 56319 && i + 1 < content.length) {
      const next = content.charCodeAt(i + 1);
      if (next >= 56320 && next <= 57343) {
        bytes += 4;
        i++;
      } else {
        bytes += 3;
      }
    } else {
      bytes += 3;
    }
  }
  return bytes;
}
function replaceUnpairedSurrogates(content) {
  let output = "";
  for (let i = 0; i < content.length; i++) {
    const code = content.charCodeAt(i);
    if (code >= 55296 && code <= 56319) {
      if (i + 1 < content.length) {
        const next = content.charCodeAt(i + 1);
        if (next >= 56320 && next <= 57343) {
          output += content.charAt(i) + content.charAt(i + 1);
          i++;
          continue;
        }
      }
      output += "\uFFFD";
    } else if (code >= 56320 && code <= 57343) {
      output += "\uFFFD";
    } else {
      output += content.charAt(i);
    }
  }
  return output;
}
function formatSize(bytes) {
  if (bytes < 1024) {
    return `${bytes}B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
function resolveTruncationInput(content, options) {
  const maxLines = options.maxLines ?? DEFAULT_MAX_LINES;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const totalBytes = utf8ByteLength(content);
  const lines = splitLinesForCounting(content);
  return {
    lines,
    totalLines: lines.length,
    totalBytes,
    maxLines,
    maxBytes
  };
}
function buildTruncationResult(input, params) {
  return {
    content: params.content,
    truncated: params.truncated,
    truncatedBy: params.truncatedBy,
    totalLines: input.totalLines,
    totalBytes: input.totalBytes,
    outputLines: params.outputLines,
    outputBytes: params.outputBytes ?? utf8ByteLength(params.content),
    lastLinePartial: params.lastLinePartial ?? false,
    firstLineExceedsLimit: params.firstLineExceedsLimit ?? false,
    maxLines: input.maxLines,
    maxBytes: input.maxBytes
  };
}
function truncateHead(content, options = {}) {
  const input = resolveTruncationInput(content, options);
  if (input.totalLines <= input.maxLines && input.totalBytes <= input.maxBytes) {
    return buildTruncationResult(input, {
      content,
      truncated: false,
      truncatedBy: null,
      outputLines: input.totalLines,
      outputBytes: input.totalBytes
    });
  }
  const firstLine = input.lines[0];
  if (firstLine !== void 0 && utf8ByteLength(firstLine) > input.maxBytes) {
    return buildTruncationResult(input, {
      content: "",
      truncated: true,
      truncatedBy: "bytes",
      outputLines: 0,
      outputBytes: 0,
      firstLineExceedsLimit: true
    });
  }
  const outputLinesArr = [];
  let outputBytesCount = 0;
  let truncatedBy = input.totalLines > input.maxLines ? "lines" : "bytes";
  for (const [i, line] of input.lines.slice(0, input.maxLines).entries()) {
    const lineBytes = utf8ByteLength(line) + (i > 0 ? 1 : 0);
    if (outputBytesCount + lineBytes > input.maxBytes) {
      truncatedBy = "bytes";
      break;
    }
    outputLinesArr.push(line);
    outputBytesCount += lineBytes;
  }
  if (input.totalLines > input.maxLines && outputLinesArr.length >= input.maxLines && outputBytesCount <= input.maxBytes) {
    truncatedBy = "lines";
  }
  const outputContent = outputLinesArr.join("\n");
  return buildTruncationResult(input, {
    content: outputContent,
    truncated: true,
    truncatedBy,
    outputLines: outputLinesArr.length
  });
}
function truncateTail(content, options = {}) {
  const input = resolveTruncationInput(content, options);
  if (input.totalLines <= input.maxLines && input.totalBytes <= input.maxBytes) {
    return buildTruncationResult(input, {
      content,
      truncated: false,
      truncatedBy: null,
      outputLines: input.totalLines,
      outputBytes: input.totalBytes
    });
  }
  const outputLinesArr = [];
  let outputBytesCount = 0;
  let truncatedBy = input.totalLines > input.maxLines ? "lines" : "bytes";
  let lastLinePartial = false;
  for (let i = input.lines.length - 1; i >= 0 && outputLinesArr.length < input.maxLines; i--) {
    const line = input.lines.at(i);
    if (line === void 0) {
      continue;
    }
    const lineBytes = utf8ByteLength(line) + (outputLinesArr.length > 0 ? 1 : 0);
    if (outputBytesCount + lineBytes > input.maxBytes) {
      truncatedBy = "bytes";
      if (outputLinesArr.length === 0) {
        const truncatedLine = truncateStringToBytesFromEnd(line, input.maxBytes);
        outputLinesArr.unshift(truncatedLine);
        outputBytesCount = utf8ByteLength(truncatedLine);
        lastLinePartial = true;
      }
      break;
    }
    outputLinesArr.unshift(line);
    outputBytesCount += lineBytes;
  }
  if (input.totalLines > input.maxLines && outputLinesArr.length >= input.maxLines && outputBytesCount <= input.maxBytes) {
    truncatedBy = "lines";
  }
  const outputContent = outputLinesArr.join("\n");
  return buildTruncationResult(input, {
    content: outputContent,
    truncated: true,
    truncatedBy,
    outputLines: outputLinesArr.length,
    lastLinePartial
  });
}
function truncateStringToBytesFromEnd(str, maxBytes) {
  if (maxBytes <= 0) {
    return "";
  }
  let outputBytes = 0;
  let start = str.length;
  let needsReplacement = false;
  for (let i = str.length; i > 0; ) {
    let characterStart = i - 1;
    const code = str.charCodeAt(characterStart);
    let characterBytes;
    let unpairedSurrogate = false;
    if (code >= 56320 && code <= 57343 && characterStart > 0) {
      const previous = str.charCodeAt(characterStart - 1);
      if (previous >= 55296 && previous <= 56319) {
        characterStart--;
        characterBytes = 4;
      } else {
        characterBytes = 3;
        unpairedSurrogate = true;
      }
    } else if (code >= 55296 && code <= 57343) {
      characterBytes = 3;
      unpairedSurrogate = true;
    } else {
      characterBytes = code <= 127 ? 1 : code <= 2047 ? 2 : 3;
    }
    if (outputBytes + characterBytes > maxBytes) {
      break;
    }
    outputBytes += characterBytes;
    start = characterStart;
    needsReplacement ||= unpairedSurrogate;
    i = characterStart;
  }
  const output = str.slice(start);
  return needsReplacement ? replaceUnpairedSurrogates(output) : output;
}
function truncateLine(line, maxChars = GREP_MAX_LINE_LENGTH) {
  if (line.length <= maxChars) {
    return { text: line, wasTruncated: false };
  }
  let cut = maxChars;
  if (cut < line.length) {
    const lastCode = line.charCodeAt(cut - 1);
    if (lastCode >= 55296 && lastCode <= 56319) {
      const nextCode = line.charCodeAt(cut);
      if (nextCode >= 56320 && nextCode <= 57343) {
        cut -= 1;
      }
    }
  }
  return { text: `${line.slice(0, cut)}... [truncated]`, wasTruncated: true };
}
export {
  Agent,
  BRANCH_SUMMARY_PREFIX,
  BRANCH_SUMMARY_SUFFIX,
  COMPACTION_SUMMARY_PREFIX,
  COMPACTION_SUMMARY_SUFFIX,
  DEFAULT_COMPACTION_SETTINGS,
  DEFAULT_MAX_BYTES,
  DEFAULT_MAX_LINES,
  GREP_MAX_LINE_LENGTH,
  TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE,
  TranscriptNotContinuableError,
  agentLoop,
  agentLoopContinue,
  asAgentMessage,
  bashExecutionToText,
  buildSessionContext,
  calculateContextTokens,
  collectEntriesForBranchSummaryFromBranches,
  compact,
  convertToLlm,
  createBranchSummaryMessage,
  createCompactionSummaryMessage,
  createCustomMessage,
  estimateContextTokens,
  estimateTokens,
  findCutPoint,
  findTurnStartIndex,
  formatPromptTemplateInvocation,
  formatSize,
  generateBranchSummary,
  generateSummary,
  getLastAssistantUsage,
  killProcessTree,
  parseCommandArgs,
  prepareBranchEntries,
  prepareCompaction,
  resolveAgentCoreCompleteFn,
  resolveAgentCoreStreamFn,
  runAgentLoop,
  runAgentLoopContinue,
  serializeConversation,
  shouldCompact,
  signalProcessTree,
  substituteArgs,
  truncateHead,
  truncateLine,
  truncateTail,
  uuidv7,
  validateToolArguments,
  validateToolCall
};
