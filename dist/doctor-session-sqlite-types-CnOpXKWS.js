//#region src/commands/doctor-session-sqlite-types.ts
const SESSION_SQLITE_WARNING_ISSUE_CODES = /* @__PURE__ */ new Set([
	"entry_invalid",
	"transcript_archive_failed",
	"transcript_malformed",
	"transcript_missing",
	"unreferenced_jsonl_archive_failed"
]);
function isSessionSqliteMigrationWarning(issue) {
	return SESSION_SQLITE_WARNING_ISSUE_CODES.has(issue.code);
}
//#endregion
export { isSessionSqliteMigrationWarning as t };
