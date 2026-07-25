import { t as SubsystemLogger } from "./subsystem-RmDRaRJV.js";
import { DatabaseSync } from "node:sqlite";

//#region src/infra/sqlite-transaction.d.ts
type SqliteTransactionOptions = {
  busyTimeoutMs?: number;
  databaseLabel?: string;
  logger?: Pick<SubsystemLogger, "warn">;
  operationLabel?: string;
  slowTransactionHoldMs?: number;
};
declare function runSqliteImmediateTransactionSync<T>(db: DatabaseSync, operation: () => T, options?: SqliteTransactionOptions): T;
//#endregion
//#region src/state/openclaw-state-db-contract.d.ts
/** Options for resolving or overriding the shared state database path. */
type OpenClawStateDatabaseOptions = {
  env?: NodeJS.ProcessEnv;
  path?: string;
};
type OpenClawStateDatabaseSchemaMigration = {
  kind: "agent-databases-composite-primary-key" | "audit-events-v2" | "operator-approvals-system-agent" | "session-watch-cursor-provenance-v4" | "strict-tables-v3";
  path: string;
};
//#endregion
//#region src/state/openclaw-state-db-schema-repair.d.ts
declare function detectOpenClawStateDatabaseSchemaMigrations(options?: OpenClawStateDatabaseOptions): OpenClawStateDatabaseSchemaMigration[];
//#endregion
//#region src/state/openclaw-state-db.d.ts
declare function repairOpenClawStateDatabaseSchema(options?: OpenClawStateDatabaseOptions): {
  changes: string[];
  warnings: string[];
};
//#endregion
export { runSqliteImmediateTransactionSync as a, OpenClawStateDatabaseSchemaMigration as i, detectOpenClawStateDatabaseSchemaMigrations as n, OpenClawStateDatabaseOptions as r, repairOpenClawStateDatabaseSchema as t };