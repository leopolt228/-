import { g as OpenClawPluginApi } from "../../plugin-entry-Bj-pdgAt.js";
import { a as ClaudeCatalogParamsError, i as CLAUDE_TERMINAL_RESUME_COMMAND, n as CLAUDE_SESSIONS_LIST_COMMAND, o as isResumableClaudeSource, r as CLAUDE_SESSION_READ_COMMAND, t as CLAUDE_CLI_NODE_RUN_COMMAND } from "../../session-catalog-shared-DophxI1a.js";
import { a as ClaudeSessionTranscriptPage, n as ClaudeSessionCatalogPage } from "../../session-catalog-types-sXGmr5C2.js";

//#region extensions/anthropic/session-catalog.d.ts
declare function listLocalClaudeSessionPage(value: unknown, homeDir?: string): Promise<ClaudeSessionCatalogPage>;
declare function readLocalClaudeTranscriptPage(value: unknown, homeDir?: string): Promise<Omit<ClaudeSessionTranscriptPage, "hostId" | "label">>;
declare function registerClaudeSessionCatalog(api: OpenClawPluginApi): void;
//#endregion
export { CLAUDE_CLI_NODE_RUN_COMMAND, CLAUDE_SESSIONS_LIST_COMMAND, CLAUDE_SESSION_READ_COMMAND, CLAUDE_TERMINAL_RESUME_COMMAND, ClaudeCatalogParamsError, isResumableClaudeSource, listLocalClaudeSessionPage, readLocalClaudeTranscriptPage, registerClaudeSessionCatalog };