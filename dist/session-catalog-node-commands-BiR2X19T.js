import { n as decodeNodePtyResumeParams, r as runNodePtyCommand } from "./node-host-YXbWYKo0.js";
import { n as validateClaudeSessionId } from "./invoke-agent-cli-claude-params-DM7e3NDF.js";
import { t as isExactClaudeSessionCursor } from "./session-catalog-cursor-NPLrVaSJ.js";
import { t as resolveClaudeTerminalExecutable } from "./session-catalog-executable-wljT8Oo6.js";
import { i as CLAUDE_TERMINAL_RESUME_COMMAND, n as CLAUDE_SESSIONS_LIST_COMMAND, o as isResumableClaudeSource, r as CLAUDE_SESSION_READ_COMMAND, t as CLAUDE_CLI_NODE_RUN_COMMAND } from "./session-catalog-shared-B8NbCO28.js";
import { n as readLocalClaudeTranscriptPage, t as listLocalClaudeSessionPage } from "./session-catalog-9B1_uNMR.js";
import { statSync } from "node:fs";
import path from "node:path";
import os from "node:os";
//#region extensions/anthropic/session-catalog-node-commands.ts
const CLAUDE_SESSIONS_CAPABILITY = "claude-sessions";
const CLAUDE_NODE_LOOKUP_PAGE_LIMIT = 100;
function claudeProjectsAvailable(env) {
	const homeDir = env.HOME?.trim() || env.USERPROFILE?.trim() || os.homedir();
	try {
		return statSync(path.join(homeDir, ".claude", "projects")).isDirectory();
	} catch {
		return false;
	}
}
function parseNodeParams(paramsJSON) {
	if (!paramsJSON) return;
	try {
		return JSON.parse(paramsJSON);
	} catch (error) {
		throw new Error("Claude session parameters must be valid JSON", { cause: error });
	}
}
async function requireLocalResumableClaudeSession(threadId) {
	let cursor;
	const seenCursors = /* @__PURE__ */ new Set();
	while (true) {
		const page = await listLocalClaudeSessionPage({
			limit: CLAUDE_NODE_LOOKUP_PAGE_LIMIT,
			...cursor ? { cursor } : {}
		});
		const record = page.sessions.find((candidate) => candidate.threadId === threadId);
		if (record) {
			if (isResumableClaudeSource(record.source)) return record;
			break;
		}
		const nextCursor = page.nextCursor;
		if (nextCursor === void 0 || seenCursors.has(nextCursor)) break;
		if (!isExactClaudeSessionCursor(nextCursor)) throw new Error("Claude session catalog returned an invalid cursor");
		seenCursors.add(nextCursor);
		cursor = nextCursor;
	}
	throw new Error("Claude session cannot be resumed in a terminal");
}
function createClaudeSessionNodeHostCommands() {
	return [
		{
			command: CLAUDE_SESSIONS_LIST_COMMAND,
			cap: CLAUDE_SESSIONS_CAPABILITY,
			dangerous: false,
			isAvailable: ({ env }) => claudeProjectsAvailable(env),
			handle: async (paramsJSON) => JSON.stringify(await listLocalClaudeSessionPage(parseNodeParams(paramsJSON)))
		},
		{
			command: CLAUDE_SESSION_READ_COMMAND,
			cap: CLAUDE_SESSIONS_CAPABILITY,
			dangerous: false,
			isAvailable: ({ env }) => claudeProjectsAvailable(env),
			handle: async (paramsJSON) => JSON.stringify(await readLocalClaudeTranscriptPage(parseNodeParams(paramsJSON)))
		},
		{
			command: CLAUDE_TERMINAL_RESUME_COMMAND,
			cap: CLAUDE_SESSIONS_CAPABILITY,
			dangerous: false,
			duplex: true,
			isAvailable: ({ env }) => claudeProjectsAvailable(env) && Boolean(resolveClaudeTerminalExecutable(env)),
			handle: async (paramsJSON, io) => {
				if (!io) throw new Error("Claude terminal command requires duplex transport");
				const params = decodeNodePtyResumeParams(paramsJSON, validateClaudeSessionId);
				const record = await requireLocalResumableClaudeSession(params.threadId);
				const resolution = resolveClaudeTerminalExecutable();
				if (!resolution) throw new Error("Claude CLI is unavailable");
				return JSON.stringify(await runNodePtyCommand({
					file: resolution.executable,
					args: ["--resume", params.threadId],
					cwd: record.cwd,
					...resolution.pathEnv ? { pathEnv: resolution.pathEnv } : {},
					cols: params.cols,
					rows: params.rows
				}, io));
			}
		}
	];
}
function createClaudeSessionNodeInvokePolicies() {
	return [{
		commands: [
			CLAUDE_SESSIONS_LIST_COMMAND,
			CLAUDE_SESSION_READ_COMMAND,
			CLAUDE_CLI_NODE_RUN_COMMAND,
			CLAUDE_TERMINAL_RESUME_COMMAND
		],
		defaultPlatforms: [
			"macos",
			"linux",
			"windows"
		],
		handle: (context) => context.command === "anthropic.claude.terminal.resume.v1" ? { ok: true } : context.invokeNode()
	}];
}
//#endregion
export { createClaudeSessionNodeInvokePolicies as n, createClaudeSessionNodeHostCommands as t };
