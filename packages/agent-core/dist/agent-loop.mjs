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
export {
  agentLoop,
  agentLoopContinue,
  runAgentLoop,
  runAgentLoopContinue
};
