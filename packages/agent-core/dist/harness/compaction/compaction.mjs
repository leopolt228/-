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
var MAX_JSON_COERCE_LENGTH = 64 * 1024;

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
function resolveAgentCoreCompleteFn(runtime) {
  if (runtime?.completeSimple) {
    return runtime.completeSimple;
  }
  throw missingRuntimeDep("completeSimple");
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
export {
  DEFAULT_COMPACTION_SETTINGS,
  SUMMARIZATION_SYSTEM_PROMPT,
  calculateContextTokens,
  compact,
  estimateContextTokens,
  estimateTokens,
  findCutPoint,
  findTurnStartIndex,
  generateSummary,
  getLastAssistantUsage,
  prepareCompaction,
  serializeConversation,
  shouldCompact
};
