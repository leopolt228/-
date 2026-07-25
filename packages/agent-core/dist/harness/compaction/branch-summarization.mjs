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

// packages/normalization-core/src/result.ts
function ok(value) {
  return { ok: true, value };
}
function err(error) {
  return { ok: false, error };
}

// packages/agent-core/src/harness/types.ts
var BranchSummaryError = class extends Error {
  constructor(code, message, cause) {
    super(message, cause === void 0 ? void 0 : { cause });
    this.name = "BranchSummaryError";
    this.code = code;
  }
};

// packages/llm-core/src/validation.ts
import { Compile } from "typebox/compile";
var MAX_JSON_COERCE_LENGTH = 64 * 1024;

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
var SUMMARIZATION_SYSTEM_PROMPT = `You are a context summarization assistant. Your task is to read a conversation between a user and an AI assistant, then produce a structured summary following the exact format specified.

Do NOT continue the conversation. Do NOT respond to any questions in the conversation. ONLY output the structured summary.`;

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
function getMessageFromEntry(entry) {
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
    const message = getMessageFromEntry(entry);
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
export {
  collectEntriesForBranchSummaryFromBranches,
  generateBranchSummary,
  prepareBranchEntries
};
