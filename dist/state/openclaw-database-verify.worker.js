import { x as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../openclaw-state-db-DkOMT2fb.js";
import { i as requireNodeSqlite } from "../sqlite-transaction-DCHi8Wi-.js";
import { l as isTerminalSqliteIntegrityError, s as assertSqliteIntegrity } from "../sqlite-wal-jkTlXxi6.js";
import { parentPort, workerData } from "node:worker_threads";
//#region src/state/openclaw-database-verify.worker.ts
function isVerifyTarget(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const target = value;
	return typeof target.path === "string" && (target.kind === "agent" || target.kind === "state") && typeof target.label === "string";
}
/** Verify database files serially so large agent scans never compete for I/O. */
function verifyOpenClawDatabases(targets) {
	const sqlite = requireNodeSqlite();
	return targets.map((target) => {
		let database;
		try {
			database = new sqlite.DatabaseSync(target.path, { readOnly: true });
			database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
			assertSqliteIntegrity(database, target.label);
			return {
				path: target.path,
				ok: true
			};
		} catch (error) {
			const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
			const terminal = error instanceof Error && isTerminalSqliteIntegrityError(error);
			return {
				path: target.path,
				ok: false,
				error: detail,
				terminal
			};
		} finally {
			database?.close();
		}
	});
}
if (parentPort) {
	const targets = Array.isArray(workerData) ? workerData.filter(isVerifyTarget) : [];
	parentPort.postMessage(verifyOpenClawDatabases(targets), []);
}
//#endregion
export { verifyOpenClawDatabases };
