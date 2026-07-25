import { $ as executeSqliteQueryTakeFirstSync, O as resolveOpenClawStateSqlitePath, Q as executeSqliteQuerySync, a as openOpenClawStateDatabase, c as runOpenClawStateWriteTransaction, et as getNodeSqliteKysely } from "./openclaw-state-db-DkOMT2fb.js";
import { i as resolveUserTimezone } from "./date-time-BhYZ-ADP.js";
import { a as commitmentRecordToUpdate, i as commitmentRecordToRow, r as commitmentRecordFromRow, t as coerceCommitmentRecord } from "./store-record-DwIxciDC.js";
import { randomBytes } from "node:crypto";
//#region src/commitments/config.ts
const DEFAULT_COMMITMENT_EXTRACTION_DEBOUNCE_MS = 15e3;
const DEFAULT_COMMITMENT_BATCH_MAX_ITEMS = 8;
const DEFAULT_COMMITMENT_EXTRACTION_QUEUE_MAX_ITEMS = 64;
const DEFAULT_COMMITMENT_CONFIDENCE_THRESHOLD = .72;
const DEFAULT_COMMITMENT_CARE_CONFIDENCE_THRESHOLD = .86;
const DEFAULT_COMMITMENT_EXTRACTION_TIMEOUT_SECONDS = 45;
const DEFAULT_COMMITMENT_MAX_PER_DAY = 3;
function positiveInt(value, fallback) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}
/** Resolves commitment extraction config with conservative defaults. */
function resolveCommitmentsConfig(cfg) {
	const raw = cfg?.commitments;
	return {
		enabled: raw?.enabled === true,
		maxPerDay: positiveInt(raw?.maxPerDay, DEFAULT_COMMITMENT_MAX_PER_DAY),
		extraction: {
			debounceMs: DEFAULT_COMMITMENT_EXTRACTION_DEBOUNCE_MS,
			batchMaxItems: DEFAULT_COMMITMENT_BATCH_MAX_ITEMS,
			queueMaxItems: DEFAULT_COMMITMENT_EXTRACTION_QUEUE_MAX_ITEMS,
			confidenceThreshold: DEFAULT_COMMITMENT_CONFIDENCE_THRESHOLD,
			careConfidenceThreshold: DEFAULT_COMMITMENT_CARE_CONFIDENCE_THRESHOLD,
			timeoutSeconds: DEFAULT_COMMITMENT_EXTRACTION_TIMEOUT_SECONDS
		}
	};
}
/** Resolves the timezone used when interpreting inferred commitment dates. */
function resolveCommitmentTimezone(cfg) {
	return resolveUserTimezone(cfg?.agents?.defaults?.userTimezone);
}
//#endregion
//#region src/commitments/store.ts
const ROLLING_DAY_MS = 1440 * 60 * 1e3;
const ACTIVE_STATUSES = ["pending", "snoozed"];
function databaseOptions(env = process.env) {
	return { env };
}
function resolveCommitmentDatabasePath(env = process.env) {
	return resolveOpenClawStateSqlitePath(env);
}
function generateCommitmentId(nowMs) {
	return `cm_${nowMs.toString(36)}_${randomBytes(5).toString("hex")}`;
}
function optionalScopeValue(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed : void 0;
}
function normalizeScope(scope) {
	return {
		agentId: scope.agentId.trim(),
		sessionKey: scope.sessionKey.trim(),
		channel: scope.channel.trim(),
		...optionalScopeValue(scope.accountId) ? { accountId: scope.accountId?.trim() } : {},
		...optionalScopeValue(scope.to) ? { to: scope.to?.trim() } : {},
		...optionalScopeValue(scope.threadId) ? { threadId: scope.threadId?.trim() } : {},
		...optionalScopeValue(scope.senderId) ? { senderId: scope.senderId?.trim() } : {}
	};
}
function candidateToRecord(params) {
	const scope = normalizeScope(params.item);
	return coerceCommitmentRecord({
		id: generateCommitmentId(params.nowMs),
		...scope,
		kind: params.candidate.kind,
		sensitivity: params.candidate.sensitivity,
		source: params.candidate.source,
		status: "pending",
		reason: params.candidate.reason.trim(),
		suggestedText: params.candidate.suggestedText.trim(),
		dedupeKey: params.candidate.dedupeKey.trim(),
		confidence: params.candidate.confidence,
		dueWindow: {
			earliestMs: params.earliestMs,
			latestMs: params.latestMs,
			timezone: params.timezone
		},
		...optionalScopeValue(params.item.sourceMessageId) ? { sourceMessageId: params.item.sourceMessageId?.trim() } : {},
		...optionalScopeValue(params.item.sourceRunId) ? { sourceRunId: params.item.sourceRunId?.trim() } : {},
		createdAtMs: params.nowMs,
		updatedAtMs: params.nowMs,
		attempts: 0
	});
}
function expireAfterMs() {
	return 4320 * 60 * 1e3;
}
function updateCommitmentRow(db, record) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("commitments").set(commitmentRecordToUpdate(record)).where("id", "=", record.id));
}
function expireStaleCommitmentsInTransaction(db, nowMs) {
	const rows = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("commitments").selectAll().where("status", "in", [...ACTIVE_STATUSES]).where("due_latest_ms", "<", nowMs - expireAfterMs())).rows;
	for (const row of rows) updateCommitmentRow(db, {
		...commitmentRecordFromRow(row),
		status: "expired",
		expiredAtMs: nowMs,
		updatedAtMs: nowMs
	});
	return rows.length;
}
function expireStaleCommitments(nowMs) {
	return runOpenClawStateWriteTransaction(({ db }) => expireStaleCommitmentsInTransaction(db, nowMs));
}
function applyExactScopeWhere(query, scope) {
	const normalized = normalizeScope(scope);
	let scoped = query.where("agent_id", "=", normalized.agentId).where("session_key", "=", normalized.sessionKey).where("channel", "=", normalized.channel);
	scoped = normalized.accountId ? scoped.where("account_id", "=", normalized.accountId) : scoped.where("account_id", "is", null);
	scoped = normalized.to ? scoped.where("recipient_id", "=", normalized.to) : scoped.where("recipient_id", "is", null);
	scoped = normalized.threadId ? scoped.where("thread_id", "=", normalized.threadId) : scoped.where("thread_id", "is", null);
	return normalized.senderId ? scoped.where("sender_id", "=", normalized.senderId) : scoped.where("sender_id", "is", null);
}
function activeAndUnsnoozed(query, nowMs) {
	return query.where("status", "in", [...ACTIVE_STATUSES]).where((eb) => eb.or([
		eb("status", "=", "pending"),
		eb("snoozed_until_ms", "is", null),
		eb("snoozed_until_ms", "<=", nowMs)
	]));
}
async function listPendingCommitmentsForScope(params) {
	const nowMs = params.nowMs ?? Date.now();
	expireStaleCommitments(nowMs);
	const database = openOpenClawStateDatabase();
	const scoped = applyExactScopeWhere(getNodeSqliteKysely(database.db).selectFrom("commitments").selectAll(), params.scope);
	return executeSqliteQuerySync(database.db, activeAndUnsnoozed(scoped, nowMs).orderBy("due_earliest_ms", "asc").orderBy("created_at_ms", "asc").orderBy("id", "asc").limit(params.limit ?? 20)).rows.map(commitmentRecordFromRow);
}
async function upsertInferredCommitments(params) {
	if (params.candidates.length === 0) return [];
	const nowMs = params.nowMs ?? Date.now();
	const planned = params.candidates.flatMap((entry) => {
		const record = candidateToRecord({
			item: params.item,
			...entry,
			nowMs
		});
		return record ? [record] : [];
	});
	if (planned.length === 0) return [];
	const scope = normalizeScope(params.item);
	return runOpenClawStateWriteTransaction(({ db }) => {
		expireStaleCommitmentsInTransaction(db, nowMs);
		const commitmentsDb = getNodeSqliteKysely(db);
		const created = [];
		for (const record of planned) {
			const existingRow = executeSqliteQueryTakeFirstSync(db, applyExactScopeWhere(commitmentsDb.selectFrom("commitments").selectAll(), scope).where("dedupe_key", "=", record.dedupeKey).where("status", "in", [...ACTIVE_STATUSES]).orderBy("updated_at_ms", "desc").orderBy("id", "asc"));
			if (existingRow) {
				const existing = commitmentRecordFromRow(existingRow);
				updateCommitmentRow(db, {
					...existing,
					reason: record.reason,
					suggestedText: record.suggestedText,
					confidence: Math.max(existing.confidence, record.confidence),
					dueWindow: {
						earliestMs: Math.min(existing.dueWindow.earliestMs, record.dueWindow.earliestMs),
						latestMs: Math.max(existing.dueWindow.latestMs, record.dueWindow.latestMs),
						timezone: record.dueWindow.timezone
					},
					updatedAtMs: nowMs
				});
				continue;
			}
			executeSqliteQuerySync(db, commitmentsDb.insertInto("commitments").values(commitmentRecordToRow(record)));
			created.push(record);
		}
		return created;
	}, databaseOptions());
}
async function listDueCommitmentsForSession(params) {
	const resolved = resolveCommitmentsConfig(params.cfg);
	if (!resolved.enabled) return [];
	const nowMs = params.nowMs ?? Date.now();
	expireStaleCommitments(nowMs);
	const database = openOpenClawStateDatabase();
	const commitmentsDb = getNodeSqliteKysely(database.db);
	const sentCountRow = executeSqliteQueryTakeFirstSync(database.db, commitmentsDb.selectFrom("commitments").select((eb) => eb.fn.countAll().as("count")).where("agent_id", "=", params.agentId).where("session_key", "=", params.sessionKey).where("status", "=", "sent").where("sent_at_ms", ">=", nowMs - ROLLING_DAY_MS));
	const remainingToday = resolved.maxPerDay - Number(sentCountRow?.count ?? 0);
	if (remainingToday <= 0) return [];
	const limit = Math.min(params.limit ?? 3, remainingToday, 3);
	const due = activeAndUnsnoozed(commitmentsDb.selectFrom("commitments").selectAll().where("agent_id", "=", params.agentId).where("session_key", "=", params.sessionKey), nowMs).where("due_earliest_ms", "<=", nowMs).where("due_latest_ms", ">=", nowMs - expireAfterMs()).orderBy("due_earliest_ms", "asc").orderBy("created_at_ms", "asc").orderBy("id", "asc").limit(limit);
	return executeSqliteQuerySync(database.db, due).rows.map(commitmentRecordFromRow);
}
async function listDueCommitmentSessionKeys(params) {
	const resolved = resolveCommitmentsConfig(params.cfg);
	if (!resolved.enabled) return [];
	const nowMs = params.nowMs ?? Date.now();
	expireStaleCommitments(nowMs);
	const database = openOpenClawStateDatabase();
	const commitmentsDb = getNodeSqliteKysely(database.db);
	const dueSessionRows = executeSqliteQuerySync(database.db, activeAndUnsnoozed(commitmentsDb.selectFrom("commitments").select("session_key").distinct().where("agent_id", "=", params.agentId), nowMs).where("due_earliest_ms", "<=", nowMs).where("due_latest_ms", ">=", nowMs - expireAfterMs()).orderBy("session_key", "asc")).rows;
	if (dueSessionRows.length === 0) return [];
	const sentCountRows = executeSqliteQuerySync(database.db, commitmentsDb.selectFrom("commitments").select(["session_key", (eb) => eb.fn.countAll().as("count")]).where("agent_id", "=", params.agentId).where("status", "=", "sent").where("sent_at_ms", ">=", nowMs - ROLLING_DAY_MS).groupBy("session_key")).rows;
	const sentCounts = new Map(sentCountRows.map((row) => [row.session_key, Number(row.count)]));
	const eligible = dueSessionRows.map((row) => row.session_key).filter((sessionKey) => (sentCounts.get(sessionKey) ?? 0) < resolved.maxPerDay);
	return params.limit && params.limit > 0 ? eligible.slice(0, params.limit) : eligible;
}
async function markCommitmentsAttempted(params) {
	const ids = [...new Set(params.ids.map((id) => id.trim()).filter(Boolean))];
	if (ids.length === 0) return;
	const nowMs = params.nowMs ?? Date.now();
	runOpenClawStateWriteTransaction(({ db }) => {
		const rows = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("commitments").selectAll().where("id", "in", ids)).rows;
		for (const row of rows) {
			const record = commitmentRecordFromRow(row);
			updateCommitmentRow(db, {
				...record,
				attempts: record.attempts + 1,
				lastAttemptAtMs: nowMs,
				updatedAtMs: nowMs
			});
		}
	});
}
async function markCommitmentsStatus(params) {
	const ids = [...new Set(params.ids.map((id) => id.trim()).filter(Boolean))];
	if (ids.length === 0) return;
	const nowMs = params.nowMs ?? Date.now();
	runOpenClawStateWriteTransaction(({ db }) => {
		const rows = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("commitments").selectAll().where("id", "in", ids).where("status", "in", [...ACTIVE_STATUSES])).rows;
		for (const row of rows) updateCommitmentRow(db, {
			...commitmentRecordFromRow(row),
			status: params.status,
			updatedAtMs: nowMs,
			...params.status === "sent" ? { sentAtMs: nowMs } : {},
			...params.status === "dismissed" ? { dismissedAtMs: nowMs } : {},
			...params.status === "expired" ? { expiredAtMs: nowMs } : {}
		});
	});
}
async function listCommitments(params) {
	expireStaleCommitments(params?.nowMs ?? Date.now());
	const database = openOpenClawStateDatabase();
	let query = getNodeSqliteKysely(database.db).selectFrom("commitments").selectAll();
	if (params?.status) query = query.where("status", "=", params.status);
	if (params?.agentId) query = query.where("agent_id", "=", params.agentId);
	return executeSqliteQuerySync(database.db, query.orderBy("due_earliest_ms", "asc").orderBy("created_at_ms", "asc").orderBy("id", "asc")).rows.map((row) => commitmentRecordFromRow(row));
}
//#endregion
export { markCommitmentsAttempted as a, upsertInferredCommitments as c, listPendingCommitmentsForScope as i, resolveCommitmentTimezone as l, listDueCommitmentSessionKeys as n, markCommitmentsStatus as o, listDueCommitmentsForSession as r, resolveCommitmentDatabasePath as s, listCommitments as t, resolveCommitmentsConfig as u };
