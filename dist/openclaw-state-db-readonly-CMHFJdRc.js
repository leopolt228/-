import { O as resolveOpenClawStateSqlitePath, X as readSqliteUserVersion, Y as createNewerSqliteSchemaVersionError, Z as clearNodeSqliteKyselyCacheForDatabase, x as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-DkOMT2fb.js";
import { i as requireNodeSqlite } from "./sqlite-transaction-DCHi8Wi-.js";
import path from "node:path";
//#region src/state/openclaw-state-db-readonly.ts
function assertSupportedSchemaVersion(db, pathname) {
	const userVersion = readSqliteUserVersion(db);
	if (userVersion > 5) throw createNewerSqliteSchemaVersionError("OpenClaw state database", pathname, userVersion, 5);
}
/**
* Read shared state without joining the writable lifecycle.
*
* CLI metadata reads can overlap a live Gateway. Keep them off schema repair,
* journal-mode setup, checkpoints, and permission mutation owned by writers.
*/
function withOpenClawStateDatabaseReadOnly(operation, options = {}) {
	const pathname = path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
	const db = new (requireNodeSqlite()).DatabaseSync(pathname, { readOnly: true });
	try {
		db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		assertSupportedSchemaVersion(db, pathname);
		return operation({
			db,
			path: pathname
		});
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(db);
		db.close();
	}
}
//#endregion
export { withOpenClawStateDatabaseReadOnly as t };
