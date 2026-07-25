import { Z as clearNodeSqliteKyselyCacheForDatabase, x as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-DkOMT2fb.js";
import { i as requireNodeSqlite } from "./sqlite-transaction-DCHi8Wi-.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { M as assertSupportedAgentSchemaVersion, N as readExistingAgentSchemaMeta, R as resolveOpenClawAgentSqlitePath, j as assertExistingAgentSchemaOwner } from "./openclaw-agent-db-BZ3-lIlN.js";
import fs from "node:fs";
//#region src/state/openclaw-agent-db-readonly.ts
function isMissingTableError(error) {
	return error instanceof Error && error.code === "ERR_SQLITE_ERROR" && /\bno such table:/iu.test(error.message);
}
/** Read agent state without creating, registering, migrating, or joining its writable lifecycle. */
function withOpenClawAgentDatabaseReadOnly(operation, options) {
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveOpenClawAgentSqlitePath({
		...options,
		agentId
	});
	if (!fs.existsSync(pathname)) return {
		found: false,
		reason: "database-missing"
	};
	const db = new (requireNodeSqlite()).DatabaseSync(pathname, { readOnly: true });
	try {
		db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		assertSupportedAgentSchemaVersion(db, pathname);
		const schemaMeta = readExistingAgentSchemaMeta(db);
		if (!schemaMeta) return {
			found: false,
			reason: "schema-missing"
		};
		assertExistingAgentSchemaOwner(schemaMeta, agentId, pathname);
		try {
			return {
				found: true,
				value: operation({
					agentId,
					db,
					path: pathname
				})
			};
		} catch (error) {
			if (isMissingTableError(error)) return {
				found: false,
				reason: "table-missing"
			};
			throw error;
		}
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(db);
		db.close();
	}
}
//#endregion
export { withOpenClawAgentDatabaseReadOnly as t };
