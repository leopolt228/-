import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import "./session-key-Drrs61Fd.js";
import path from "node:path";
//#region src/config/sessions/session-sqlite-target.ts
function resolveCustomStoreSqlitePath(params) {
	const resolved = path.resolve(params.storePath);
	const sessionsDir = path.dirname(resolved);
	const sqliteBaseName = params.sqliteBaseName ?? (path.basename(resolved, path.extname(resolved)) || "openclaw-agent");
	const agentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
	const sqliteName = agentId && agentId !== "main" && normalizeAgentId(sqliteBaseName) !== agentId ? `${sqliteBaseName}.${agentId}` : sqliteBaseName;
	return path.join(sessionsDir, `${sqliteName}.sqlite`);
}
/** Resolves the SQLite database target that owns a legacy session store path. */
function resolveSqliteTargetFromSessionStorePath(storePath, options = {}) {
	const resolved = path.resolve(storePath);
	if (path.basename(resolved) === "openclaw-agent.sqlite" || resolved.endsWith(".sqlite")) {
		const agentId = resolveAgentIdFromSqliteDatabasePath(resolved);
		return {
			path: resolved,
			...agentId ? { agentId } : {}
		};
	}
	const sessionsDir = path.dirname(resolved);
	if (path.basename(resolved) !== "sessions.json") return { path: resolveCustomStoreSqlitePath({
		...options.agentId ? { agentId: options.agentId } : {},
		storePath: resolved
	}) };
	if (path.basename(sessionsDir) !== "sessions") return { path: resolveCustomStoreSqlitePath({
		...options.agentId ? { agentId: options.agentId } : {},
		sqliteBaseName: "openclaw-agent",
		storePath: resolved
	}) };
	const agentDir = path.dirname(sessionsDir);
	if (path.basename(path.dirname(agentDir)) !== "agents") return { path: resolveCustomStoreSqlitePath({
		...options.agentId ? { agentId: options.agentId } : {},
		sqliteBaseName: "openclaw-agent",
		storePath: resolved
	}) };
	return {
		agentId: normalizeAgentId(path.basename(agentDir)),
		path: path.join(agentDir, "agent", "openclaw-agent.sqlite")
	};
}
/** Extracts the agent id from the canonical per-agent SQLite database path. */
function resolveAgentIdFromSqliteDatabasePath(databasePath) {
	if (path.basename(databasePath) !== "openclaw-agent.sqlite") return;
	const agentDbDir = path.dirname(databasePath);
	if (path.basename(agentDbDir) !== "agent") return;
	const agentDir = path.dirname(agentDbDir);
	if (path.basename(path.dirname(agentDir)) !== "agents") return;
	return normalizeAgentId(path.basename(agentDir));
}
//#endregion
export { resolveSqliteTargetFromSessionStorePath as t };
