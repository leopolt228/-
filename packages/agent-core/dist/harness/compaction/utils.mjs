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
export {
  computeFileLists,
  createFileOps,
  extractFileOpsFromMessage,
  formatFileOperations,
  getCompactionContentBlockText,
  serializeConversation
};
