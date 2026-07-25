import { r as getChildLogger } from "./logger-Dy4xN1lg.js";
import { et as getNodeSqliteKysely } from "./openclaw-state-db-DkOMT2fb.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { E as parseAgentSessionKey, d as resolveAgentIdFromSessionKey } from "./session-key-Drrs61Fd.js";
import { R as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db-BZ3-lIlN.js";
import { c as runQueuedStoreWrite, i as normalizeStoreSessionKey } from "./store-entry-Z-CrJCro.js";
import { t as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-BgE0IcT5.js";
import { t as formatSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import path from "node:path";
//#region src/config/sessions/session-accessor.sqlite-scope.ts
const SQLITE_SESSION_SLOW_WRITE_MS = 1e3;
const SQLITE_SESSION_WRITER_QUEUES = /* @__PURE__ */ new Map();
function getSessionKysely(database) {
	return getNodeSqliteKysely(database);
}
async function runExclusiveSqliteSessionWrite(scope, fn) {
	const storePath = resolveOpenClawAgentSqlitePath(toDatabaseOptions(scope));
	const startedAt = Date.now();
	try {
		const result = await runQueuedStoreWrite({
			queues: SQLITE_SESSION_WRITER_QUEUES,
			storePath,
			label: "runExclusiveSqliteSessionWrite",
			fn
		});
		const elapsedMs = Date.now() - startedAt;
		if (elapsedMs >= SQLITE_SESSION_SLOW_WRITE_MS) getChildLogger({ subsystem: "session-sqlite" }).warn("slow SQLite session write", {
			agentId: scope.agentId,
			elapsedMs,
			storePath
		});
		return result;
	} catch (error) {
		getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite session write failed", {
			agentId: scope.agentId,
			elapsedMs: Date.now() - startedAt,
			error,
			storePath
		});
		throw error;
	}
}
function resolveSqliteScope(scope) {
	const scopedAgentId = resolveExplicitSqliteAgentId(scope);
	const storeTarget = scope.storePath ? resolveSqliteTargetFromSessionStorePath(scope.storePath, { agentId: scopedAgentId }) : void 0;
	const agentId = resolveSqliteAgentId({
		scopedAgentId,
		sessionKey: scope.sessionKey,
		storeAgentId: storeTarget?.agentId,
		useDefaultAgentForUnownedStore: Boolean(storeTarget?.path && !storeTarget.agentId && !scopedAgentId)
	});
	if (!agentId) throw new Error("Cannot resolve SQLite session scope without an agent id");
	return {
		agentId,
		...scope.env ? { env: scope.env } : {},
		...storeTarget ? { path: storeTarget.path } : {},
		sessionKey: normalizeSqliteSessionKey(scope.sessionKey)
	};
}
function resolveSqliteReadScope(scope) {
	const sessionKey = scope.sessionKey ? normalizeSqliteSessionKey(scope.sessionKey) : void 0;
	const scopedAgentId = resolveExplicitSqliteAgentId({
		...scope,
		sessionKey
	});
	const storeTarget = scope.storePath ? resolveSqliteTargetFromSessionStorePath(scope.storePath, { agentId: scopedAgentId }) : void 0;
	const agentId = resolveSqliteAgentId({
		scopedAgentId,
		sessionKey,
		storeAgentId: storeTarget?.agentId,
		useDefaultAgentForUnownedStore: Boolean(storeTarget?.path && !storeTarget.agentId && !scopedAgentId)
	});
	if (!agentId) throw new Error("Cannot resolve SQLite transcript read scope without an agent id");
	return {
		agentId,
		...scope.env ? { env: scope.env } : {},
		...storeTarget ? { path: storeTarget.path } : {},
		...sessionKey ? { sessionKey } : {}
	};
}
function resolveExplicitSqliteAgentId(params) {
	return params.agentId ? normalizeAgentId(params.agentId) : parseAgentSessionKey(params.sessionKey)?.agentId;
}
function resolveSqliteStoreScope(storePath, options = {}) {
	return resolveSqliteScope({
		...options.agentId ? { agentId: options.agentId } : {},
		sessionKey: "",
		storePath
	});
}
function resolveSqliteAgentId(params) {
	const scopedAgentId = params.scopedAgentId ? normalizeAgentId(params.scopedAgentId) : void 0;
	if (scopedAgentId && params.storeAgentId && scopedAgentId !== params.storeAgentId) throw new Error(`SQLite session store path belongs to agent ${params.storeAgentId}; requested agent ${scopedAgentId}.`);
	return scopedAgentId ?? params.storeAgentId ?? (params.sessionKey !== void 0 ? resolveAgentIdFromSessionKey(params.sessionKey) : void 0) ?? (params.useDefaultAgentForUnownedStore ? "main" : void 0);
}
function resolveSqliteTranscriptArchiveDirectory(scope) {
	const databasePath = resolveOpenClawAgentSqlitePath(toDatabaseOptions(scope));
	const databaseDir = path.dirname(databasePath);
	if (path.basename(databaseDir) !== "agent") return databaseDir;
	return path.join(path.dirname(databaseDir), "sessions");
}
function resolveSqliteTranscriptScope(scope) {
	if (!scope.sessionId) throw new Error(`Cannot resolve SQLite transcript scope without a session id: ${scope.sessionKey}`);
	if (!scope.sessionKey) throw new Error(`Cannot resolve SQLite transcript scope without a session key: ${scope.sessionId}`);
	return {
		...resolveSqliteScope({
			...scope,
			sessionKey: scope.sessionKey
		}),
		sessionId: scope.sessionId
	};
}
function resolveSqliteTranscriptReadScope(scope) {
	return {
		...resolveSqliteReadScope(scope),
		sessionId: scope.sessionId
	};
}
function toDatabaseOptions(scope) {
	return {
		agentId: scope.agentId,
		...scope.env ? { env: scope.env } : {},
		...scope.path ? { path: scope.path } : {}
	};
}
function normalizeSqliteSessionKey(sessionKey) {
	return normalizeStoreSessionKey(sessionKey);
}
function cloneSessionEntry(entry) {
	return structuredClone(entry);
}
function formatSqliteSessionMarkerForScope(scope) {
	return formatSqliteSessionFileMarker({
		agentId: scope.agentId,
		sessionId: scope.sessionId,
		storePath: scope.path ?? resolveOpenClawAgentSqlitePath(toDatabaseOptions(scope))
	});
}
//#endregion
export { resolveSqliteReadScope as a, resolveSqliteTranscriptArchiveDirectory as c, runExclusiveSqliteSessionWrite as d, toDatabaseOptions as f, normalizeSqliteSessionKey as i, resolveSqliteTranscriptReadScope as l, formatSqliteSessionMarkerForScope as n, resolveSqliteScope as o, getSessionKysely as r, resolveSqliteStoreScope as s, cloneSessionEntry as t, resolveSqliteTranscriptScope as u };
