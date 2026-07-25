import { r as AssistantMessage } from "./types-CVnOkpxa.js";
//#region src/agents/embedded-agent-utils.d.ts
/** Extract sanitized assistant text across all text content blocks. */
declare function extractAssistantText(msg: AssistantMessage): string;
/** Format reasoning text for markdown-friendly channel surfaces. */
declare function formatReasoningMessage(text: string): string;
//#endregion
export { formatReasoningMessage as n, extractAssistantText as t };