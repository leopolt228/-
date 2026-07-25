import { O as resolveOpenClawStateSqlitePath, Q as executeSqliteQuerySync, X as readSqliteUserVersion, Z as clearNodeSqliteKyselyCacheForDatabase, b as OPENCLAW_DATABASE_SCHEMA_DOCS_URL, et as getNodeSqliteKysely, x as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-DkOMT2fb.js";
import { i as requireNodeSqlite } from "./sqlite-transaction-DCHi8Wi-.js";
import { existsSync } from "node:fs";
import path from "node:path";
//#region src/state/openclaw-database-preflight.ts
/** Fatal Gateway refusal when persisted schemas were written by a newer build. */
var OpenClawDatabaseSchemaPreflightError = class extends Error {
	constructor(incompatibleDatabases) {
		super(`Gateway refused startup because ${incompatibleDatabases.length} OpenClaw database schema(s) are newer than this build. See ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
		this.incompatibleDatabases = incompatibleDatabases;
		this.name = "OpenClawDatabaseSchemaPreflightError";
	}
};
function readWriterAppVersion(database) {
	try {
		const row = database.prepare("SELECT app_version FROM schema_meta WHERE meta_key = 'primary' LIMIT 1").get();
		return typeof row?.app_version === "string" && row.app_version.length > 0 ? row.app_version : void 0;
	} catch {
		return;
	}
}
function readRegisteredAgentDatabases(database) {
	if (!database.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = 'agent_databases'").get()) return [];
	return executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("agent_databases").select(["agent_id", "path"])).rows.flatMap((row) => typeof row.agent_id === "string" && typeof row.path === "string" ? [{
		agentId: row.agent_id,
		path: row.path
	}] : []);
}
function errorReason(error) {
	return error instanceof Error ? error.message : String(error);
}
/** Read schema headers; report unreadable existing files without diagnosing or repairing them. */
function preflightOpenClawDatabaseSchemas(options) {
	const result = {
		incompatible: [],
		indeterminate: []
	};
	const statePath = path.resolve(resolveOpenClawStateSqlitePath(options.env));
	if (!existsSync(statePath)) return result;
	const sqlite = requireNodeSqlite();
	let stateDatabase;
	try {
		stateDatabase = new sqlite.DatabaseSync(statePath, { readOnly: true });
		stateDatabase.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		const stateVersion = readSqliteUserVersion(stateDatabase);
		if (stateVersion > options.supportedVersions.state) {
			const writerAppVersion = readWriterAppVersion(stateDatabase);
			result.incompatible.push({
				kind: "state",
				path: statePath,
				foundVersion: stateVersion,
				supportedVersion: options.supportedVersions.state,
				...writerAppVersion ? { writerAppVersion } : {}
			});
		}
		let registeredDatabases;
		try {
			registeredDatabases = readRegisteredAgentDatabases(stateDatabase);
		} catch (error) {
			result.indeterminate.push({
				kind: "state",
				path: statePath,
				reason: `agent database registry query failed: ${errorReason(error)}`
			});
			return result;
		}
		for (const row of registeredDatabases) {
			const agentPath = path.resolve(row.path);
			if (!existsSync(agentPath)) continue;
			let agentDatabase;
			try {
				agentDatabase = new sqlite.DatabaseSync(agentPath, { readOnly: true });
				agentDatabase.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
				const agentVersion = readSqliteUserVersion(agentDatabase);
				if (agentVersion <= options.supportedVersions.agent) continue;
				const writerAppVersion = readWriterAppVersion(agentDatabase);
				result.incompatible.push({
					kind: "agent",
					path: agentPath,
					agentId: row.agentId,
					foundVersion: agentVersion,
					supportedVersion: options.supportedVersions.agent,
					...writerAppVersion ? { writerAppVersion } : {}
				});
			} catch (error) {
				result.indeterminate.push({
					kind: "agent",
					path: agentPath,
					reason: errorReason(error)
				});
			} finally {
				agentDatabase?.close();
			}
		}
		return result;
	} catch (error) {
		result.indeterminate.push({
			kind: "state",
			path: statePath,
			reason: errorReason(error)
		});
		return result;
	} finally {
		if (stateDatabase) {
			clearNodeSqliteKyselyCacheForDatabase(stateDatabase);
			stateDatabase.close();
		}
	}
}
//#endregion
export { preflightOpenClawDatabaseSchemas as n, OpenClawDatabaseSchemaPreflightError as t };
