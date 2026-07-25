import { DatabaseSync } from "node:sqlite";

//#region src/infra/sqlite-strict.d.ts
type SqliteStrictMigrationOptions = {
  busyTimeoutMs?: number;
  databaseLabel?: string;
};
type SqliteStrictMigrationResult = {
  migratedTables: string[];
};
/** Atomically upgrade OpenClaw-owned tables described by a canonical STRICT schema. */
declare function migrateSqliteSchemaToStrict(db: DatabaseSync, schemaSql: string, options?: SqliteStrictMigrationOptions): SqliteStrictMigrationResult;
//#endregion
export { SqliteStrictMigrationResult as n, migrateSqliteSchemaToStrict as r, SqliteStrictMigrationOptions as t };