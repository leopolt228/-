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
export {
  BRANCH_SUMMARY_PREFIX,
  BRANCH_SUMMARY_SUFFIX,
  COMPACTION_SUMMARY_PREFIX,
  COMPACTION_SUMMARY_SUFFIX,
  asAgentMessage,
  bashExecutionToText,
  convertToLlm,
  createBranchSummaryMessage,
  createCompactionSummaryMessage,
  createCustomMessage
};
