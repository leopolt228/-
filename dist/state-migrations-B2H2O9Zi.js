import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord$1 } from "./record-coerce-DHZ4bFlT.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-COWbwBfI.js";
import { o as resolveRequiredHomeDir, t as expandHomePrefix } from "./home-dir-DxrrpDft.js";
import { _ as resolveLegacyStateDirs, v as resolveNewStateDir, x as resolveStateDir, y as resolveOAuthDir } from "./paths-CHQRdQZ3.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { c as isWithinDir } from "./path-DILYn_gk.js";
import { t as sameFileIdentity } from "./file-identity-C0fBiekR.js";
import "./fs-safe-Dy0g6QwA.js";
import { a as root } from "./secure-temp-dir-D6Ou0J-U.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import "./utils-K2PjeLaV.js";
import { a as sha256Hex } from "./crypto-digest-CmUwt1S-.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-CqBTTiC9.js";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-CmZHj-1e.js";
import { t as CHANNEL_IDS } from "./ids-retRJEzF.js";
import "./path-safety-B0eXpnA9.js";
import { $ as executeSqliteQueryTakeFirstSync, O as resolveOpenClawStateSqlitePath, Q as executeSqliteQuerySync, a as openOpenClawStateDatabase, c as runOpenClawStateWriteTransaction, et as getNodeSqliteKysely, s as repairOpenClawStateDatabaseSchema, u as detectOpenClawStateDatabaseSchemaMigrations } from "./openclaw-state-db-DkOMT2fb.js";
import { i as requireNodeSqlite, n as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DCHi8Wi-.js";
import { c as resolveLegacyInstalledPluginIndexStorePath } from "./installed-plugin-index-record-reader-DjVucfOz.js";
import "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-DDgUze4y.js";
import { E as parseAgentSessionKey, d as resolveAgentIdFromSessionKey, i as buildAgentMainSessionKey, l as normalizeMainKey, n as DEFAULT_MAIN_KEY, t as DEFAULT_AGENT_ID, w as normalizeSessionKeyPreservingOpaquePeerIds } from "./session-key-Drrs61Fd.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-C7N4Rwku.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-S7z_Yn4H.js";
import "./installed-plugin-index-DlWmC2dq.js";
import { i as readPersistedInstalledPluginIndexSync, n as parseInstalledPluginIndex, s as writePersistedInstalledPluginIndexSync } from "./installed-plugin-index-store-CQB8uMnP.js";
import "./fs-safe-advanced-B0eXpnA9.js";
import { c as listBundledChannelLegacyStateMigrationDetectors, s as listBundledChannelLegacySessionSurfaces } from "./bundled-CX_lU3gw.js";
import { t as createSqliteAuditRecordStore } from "./sqlite-audit-record-store-CnLZzBLF.js";
import { n as CONFIG_AUDIT_SCOPE, t as CONFIG_AUDIT_MAX_ENTRIES } from "./io.audit-ChVTQVyd.js";
import { a as deriveEd25519PrivateKeyRaw, c as ed25519PublicKeyPemFromRaw, n as decodeCanonicalBase64OrBase64Url, o as deriveEd25519PublicKeyRaw, s as ed25519PrivateKeyPemFromRaw } from "./ed25519-signature-C0USCjHD.js";
import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-3LhI2apQ.js";
import { t as isLockOwnerDefinitelyStale } from "./stale-lock-file-CNYyEZFf.js";
import { s as withFileLock } from "./file-lock-A-LuZYyN.js";
import "./file-lock-DyuRCh-b.js";
import { d as readStoredDeviceIdentityReadOnly, f as repairInvalidStoredDeviceIdentity, h as acquireDeviceIdentityCoordinator, l as DeviceIdentityStorageError, m as validateStoredDeviceIdentity, p as resolveDeviceIdentityStore, u as generateStoredDeviceIdentity } from "./device-identity-cacJqJr9.js";
import { n as acquireGatewayLock, t as GatewayLockError } from "./gateway-lock-DuOE-FjH.js";
import { a as registerMigratedPluginStateEntry, h as getPluginStateCapacity, i as importPluginStateEntriesForDoctor, m as countPluginStateLiveEntries, n as createPluginStateKeyedStore, v as resolveMaxPluginStateEntriesPerPlugin } from "./plugin-state-store-DtRrl2QK.js";
import { n as canonicalizeMainSessionAlias } from "./main-session-C7kXMD8t.js";
import { t as resolveAgentsDirFromSessionStorePath } from "./paths-BpMRJ7TJ.js";
import { t as getChannelPlugin } from "./registry-DqyhCDsQ.js";
import { c as resolveSessionStoreTargets, o as resolveAllAgentSessionStoreTargetsSync, r as listConfiguredSessionStoreAgentIds } from "./targets-DhNEpENL.js";
import { i as saveSessionStore, l as normalizePersistedSessionEntryShape } from "./store-DDuGv_UJ.js";
import { o as getMediaDir } from "./store-NmJjqmad.js";
import { d as resolveWorkspaceStateIdentity, l as registerWorkspaceStateAliasesInTransaction, n as WORKSPACE_ATTESTED_BOOTSTRAP_FILENAMES, r as WORKSPACE_LEGACY_STATE_MIGRATION_KIND } from "./workspace-state-store-CJi45lE9.js";
import { n as LEGACY_WORKSPACE_ATTESTATION_HEADER, o as WORKSPACE_DOCTOR_CLAIM_SUFFIX, r as LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES, t as LEGACY_WORKSPACE_ATTESTATION_DIRNAME, u as resolveLegacyWorkspaceSourcePaths } from "./workspace-legacy-state-BPkp3711.js";
import { n as SYSTEM_AGENT_AUDIT_SCOPE, t as SYSTEM_AGENT_AUDIT_MAX_ENTRIES } from "./audit-DahVIjyb.js";
import { n as normalizeConversationRef } from "./session-binding-normalization-sQL-8bRz.js";
import { c as writeAcpSessionMetaForMigration } from "./session-meta-BBWApx8c.js";
import "./sessions-Uqhj6EXw.js";
import { a as writeRestartSentinelRowSync, n as parseRestartSentinelEnvelope, r as readRestartSentinelRowSync } from "./restart-sentinel-store-B0gifhyi.js";
import { n as parseMcpOAuthStoreJson } from "./mcp-oauth-store-DCOq9PUx.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-BzNF0htn.js";
import { a as commitmentRecordToUpdate, i as commitmentRecordToRow, n as commitmentImmutableIdentity, o as commitmentRecordsEqual, r as commitmentRecordFromRow, t as coerceCommitmentRecord } from "./store-record-DwIxciDC.js";
import { a as updateChannelPairingStateSnapshot, c as resolveAllowFromAccountId, d as getPairingAdapter, l as safeAccountKey, s as dedupePreserveOrder } from "./pairing-store-sqlite-BlWmoUVN.js";
import { t as listAgentWorkspaceDirs } from "./workspace-dirs-CTFrGP7b.js";
import { c as managedImageRecordToRow, l as managedImageRecordsEqual, s as managedImageRecordFromRow, t as MANAGED_OUTGOING_ORIGINALS_SUBDIR } from "./managed-image-record-store-lBXghreu.js";
import { n as LEGACY_NODE_HOST_CONFIG_FILE, r as NODE_HOST_CONFIG_KEY, t as LEGACY_NODE_HOST_CONFIG_CLAIM_SUFFIX } from "./config-BHQrsYRN.js";
import { c as recordsAfterLegacyAuditRawCheckpoint, d as prepareLegacyAuditRecords, f as serializePreparedAuditRecords, g as legacyAuditSourceGenerationKey, l as restoreInterruptedAuditRecoveryArchive, m as hasLegacyAuditRawCheckpointCapacity, n as finalizeLegacyAuditRecoveryArchive, o as readLegacyAuditSourceSnapshot, p as detectLegacyAuditLogs, r as findPreviousLegacyAuditRawCheckpoint, s as recordLegacyAuditRawCheckpoint, t as withLegacyAuditMigrationLease, u as scrubLegacyAuditRecoveryArchive } from "./state-migrations.audit-coordination-Aiu1Gm2d.js";
import { n as collectRelevantDoctorPluginIds, o as listPluginDoctorSessionStoreAgentIds, s as listPluginDoctorStateMigrationEntries } from "./doctor-contract-registry-C_4oQmE8.js";
import { a as isValidApnsNodeId, l as normalizeApnsEnvironment, n as apnsRegistrationToRow, p as normalizeCanonicalApnsRegistration, t as apnsRegistrationFromRow, u as normalizeApnsNodeId } from "./push-apns-store-KXfXqjY4.js";
import { n as normalizeVoiceWakeRoutingConfig } from "./voicewake-routing-Dig2QA5V.js";
import { c as isValidWebPushEndpoint, g as webPushVapidKeyPairToRow, h as webPushSubscriptionsEqual, l as isValidWebPushKey, m as webPushSubscriptionToRow, n as WEB_PUSH_VAPID_KEY_ID, o as hashWebPushEndpoint, p as webPushSubscriptionFromRow, r as createWebPushVapidKeyPair } from "./push-web-store-4KvAFla0.js";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { TextDecoder as TextDecoder$1, isDeepStrictEqual } from "node:util";
import { gunzipSync } from "node:zlib";
import { OAuthClientInformationSchema, OAuthMetadataSchema, OAuthProtectedResourceMetadataSchema, OAuthTokensSchema, OpenIdProviderDiscoveryMetadataSchema } from "@modelcontextprotocol/sdk/shared/auth.js";
//#region src/infra/state-migrations.acp-replay.ts
const LEGACY_LEDGER_VERSION = 1;
const LEGACY_LEDGER_LOCK_OPTIONS = {
	retries: {
		retries: 8,
		factor: 2,
		minTimeout: 50,
		maxTimeout: 5e3,
		randomize: true
	},
	stale: 15e3,
	staleRecovery: "fail-closed"
};
function resolveLegacyAcpReplayLedgerPath(stateDir) {
	return path.join(stateDir, "acp", "event-ledger.json");
}
function resolveLegacyAcpReplayClaimPath(sourcePath) {
	return `${sourcePath}.doctor-import`;
}
/** Detect the retired ledger only when an explicit doctor flow opts in. */
function detectLegacyAcpReplayLedger(params) {
	const sourcePath = resolveLegacyAcpReplayLedgerPath(params.stateDir);
	const claimPath = resolveLegacyAcpReplayClaimPath(sourcePath);
	return {
		sourcePath,
		hasLegacy: params.doctorOnlyStateMigrations === true && (fs.existsSync(sourcePath) || fs.existsSync(claimPath))
	};
}
function parseLegacyEvent(raw, sessionId) {
	if (!isRecord$1(raw) || !isRecord$1(raw.update)) throw new Error(`legacy ACP replay session ${sessionId} contains an invalid event`);
	if (typeof raw.seq !== "number" || !Number.isInteger(raw.seq) || raw.seq < 1 || typeof raw.at !== "number" || !Number.isFinite(raw.at) || raw.sessionId !== sessionId || typeof raw.sessionKey !== "string" || typeof raw.update.sessionUpdate !== "string") throw new Error(`legacy ACP replay session ${sessionId} contains an invalid event`);
	if (raw.runId !== void 0 && (typeof raw.runId !== "string" || raw.runId.length === 0)) throw new Error(`legacy ACP replay session ${sessionId} contains an invalid run id`);
	return {
		seq: raw.seq,
		at: raw.at,
		sessionId,
		sessionKey: raw.sessionKey,
		...typeof raw.runId === "string" ? { runId: raw.runId } : {},
		update: structuredClone(raw.update)
	};
}
function parseLegacySession(raw, expectedSessionId) {
	if (!isRecord$1(raw) || raw.sessionId !== expectedSessionId || typeof raw.sessionKey !== "string" || typeof raw.cwd !== "string" || typeof raw.complete !== "boolean" || typeof raw.createdAt !== "number" || !Number.isFinite(raw.createdAt) || typeof raw.updatedAt !== "number" || !Number.isFinite(raw.updatedAt) || typeof raw.nextSeq !== "number" || !Number.isInteger(raw.nextSeq) || raw.nextSeq < 1 || !Array.isArray(raw.events)) throw new Error(`legacy ACP replay session ${expectedSessionId} is invalid`);
	const events = raw.events.map((event) => parseLegacyEvent(event, expectedSessionId));
	const sequences = new Set(events.map((event) => event.seq));
	const maxSeq = events.reduce((max, event) => Math.max(max, event.seq), 0);
	if (sequences.size !== events.length || raw.nextSeq <= maxSeq) throw new Error(`legacy ACP replay session ${expectedSessionId} has invalid sequencing`);
	return {
		sessionId: expectedSessionId,
		sessionKey: raw.sessionKey,
		cwd: raw.cwd,
		complete: raw.complete,
		createdAt: raw.createdAt,
		updatedAt: raw.updatedAt,
		nextSeq: raw.nextSeq,
		events: events.toSorted((left, right) => left.seq - right.seq)
	};
}
function parseLegacyLedger(raw) {
	const parsed = JSON.parse(raw);
	if (!isRecord$1(parsed) || parsed.version !== LEGACY_LEDGER_VERSION || !isRecord$1(parsed.sessions)) throw new Error("legacy ACP replay ledger must be a version 1 JSON object");
	return Object.entries(parsed.sessions).map(([sessionId, session]) => parseLegacySession(session, sessionId));
}
function estimateSessionBytes(session) {
	return session.sessionId.length + session.sessionKey.length + session.cwd.length + 32;
}
function estimateEventBytes(event, updateJson) {
	return event.sessionId.length + event.sessionKey.length + updateJson.length + (event.runId?.length ?? 0) + 32;
}
function sourceIdentity(stat, raw) {
	return {
		dev: stat.dev,
		ino: stat.ino,
		mtimeMs: stat.mtimeMs,
		sha256: createHash("sha256").update(raw).digest("hex"),
		size: stat.size
	};
}
function sourceIdentityMatches(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mtimeMs === right.mtimeMs && left.sha256 === right.sha256 && left.size === right.size;
}
function reconcileCanonicalSession(db, session) {
	const replayDb = getNodeSqliteKysely(db);
	const stored = executeSqliteQueryTakeFirstSync(db, replayDb.selectFrom("acp_replay_sessions").select([
		"session_key",
		"cwd",
		"complete",
		"created_at",
		"updated_at",
		"next_seq",
		"estimated_bytes"
	]).where("session_id", "=", session.sessionId));
	if (!stored || stored.session_key !== session.sessionKey || stored.cwd !== session.cwd || stored.complete !== (session.complete ? 1 : 0) || stored.created_at !== session.createdAt || stored.updated_at !== session.updatedAt || stored.next_seq !== session.nextSeq) return false;
	const storedEvents = executeSqliteQuerySync(db, replayDb.selectFrom("acp_replay_events").select([
		"seq",
		"at",
		"session_key",
		"run_id",
		"update_json",
		"estimated_bytes"
	]).where("session_id", "=", session.sessionId).orderBy("seq", "asc")).rows;
	if (storedEvents.length !== session.events.length) return false;
	const expectedEventBytes = [];
	for (const [index, event] of session.events.entries()) {
		const storedEvent = storedEvents[index];
		if (!storedEvent) return false;
		let storedUpdate;
		try {
			storedUpdate = JSON.parse(storedEvent.update_json);
		} catch {
			return false;
		}
		if (storedEvent.seq !== event.seq || storedEvent.at !== event.at || storedEvent.session_key !== event.sessionKey || storedEvent.run_id !== (event.runId ?? null) || !isDeepStrictEqual(storedUpdate, event.update)) return false;
		expectedEventBytes.push(estimateEventBytes(event, JSON.stringify(event.update)));
	}
	for (const [index, event] of session.events.entries()) {
		const expectedBytes = expectedEventBytes[index];
		if (expectedBytes !== void 0 && storedEvents[index]?.estimated_bytes !== expectedBytes) executeSqliteQuerySync(db, replayDb.updateTable("acp_replay_events").set({ estimated_bytes: expectedBytes }).where("session_id", "=", session.sessionId).where("seq", "=", event.seq));
	}
	const expectedSessionBytes = estimateSessionBytes(session) + expectedEventBytes.reduce((sum, value) => sum + value, 0);
	if (stored.estimated_bytes !== expectedSessionBytes) executeSqliteQuerySync(db, replayDb.updateTable("acp_replay_sessions").set({ estimated_bytes: expectedSessionBytes }).where("session_id", "=", session.sessionId));
	return true;
}
/** Import, verify, and remove the retired JSON ledger during explicit doctor repair. */
async function migrateLegacyAcpReplayLedger(params) {
	const changes = [];
	const warnings = [];
	if (!params.detected.hasLegacy) return {
		changes,
		warnings
	};
	try {
		const result = await withFileLock(params.detected.sourcePath, LEGACY_LEDGER_LOCK_OPTIONS, async () => {
			const claimPath = resolveLegacyAcpReplayClaimPath(params.detected.sourcePath);
			const resumedClaim = fs.existsSync(claimPath);
			const activePath = resumedClaim ? claimPath : params.detected.sourcePath;
			const before = await fs$1.lstat(activePath);
			if (!before.isFile() || before.isSymbolicLink()) throw new Error("legacy ACP replay source is not a regular non-symlink file");
			const raw = await fs$1.readFile(activePath, "utf8");
			const identity = sourceIdentity(before, raw);
			const sessions = parseLegacyLedger(raw);
			let importedSessions = 0;
			let importedEvents = 0;
			let retainedSessions = 0;
			let claimedThisRun = false;
			try {
				if (!resumedClaim) {
					await fs$1.rename(params.detected.sourcePath, claimPath);
					claimedThisRun = true;
					if (!sourceIdentityMatches(identity, sourceIdentity(await fs$1.lstat(claimPath), await fs$1.readFile(claimPath, "utf8")))) throw new Error("legacy ACP replay source changed while doctor was claiming it");
				}
				runOpenClawStateWriteTransaction(({ db }) => {
					const replayDb = getNodeSqliteKysely(db);
					const missingSessions = [];
					for (const session of sessions) {
						if (executeSqliteQueryTakeFirstSync(db, replayDb.selectFrom("acp_replay_sessions").select("session_id").where("session_id", "=", session.sessionId))) {
							if (!reconcileCanonicalSession(db, session)) throw new Error(`canonical ACP replay session ${session.sessionId} conflicts with the legacy source`);
							retainedSessions += 1;
							continue;
						}
						missingSessions.push(session);
					}
					for (const session of missingSessions) {
						let estimatedBytes = estimateSessionBytes(session);
						executeSqliteQuerySync(db, replayDb.insertInto("acp_replay_sessions").values({
							session_id: session.sessionId,
							session_key: session.sessionKey,
							cwd: session.cwd,
							complete: session.complete ? 1 : 0,
							created_at: session.createdAt,
							updated_at: session.updatedAt,
							next_seq: session.nextSeq,
							estimated_bytes: estimatedBytes
						}));
						for (const event of session.events) {
							const updateJson = JSON.stringify(event.update);
							const eventBytes = estimateEventBytes(event, updateJson);
							executeSqliteQuerySync(db, replayDb.insertInto("acp_replay_events").values({
								session_id: event.sessionId,
								seq: event.seq,
								at: event.at,
								session_key: event.sessionKey,
								run_id: event.runId ?? null,
								update_json: updateJson,
								estimated_bytes: eventBytes
							}));
							estimatedBytes += eventBytes;
							importedEvents += 1;
						}
						executeSqliteQuerySync(db, replayDb.updateTable("acp_replay_sessions").set({ estimated_bytes: estimatedBytes }).where("session_id", "=", session.sessionId));
						if (!reconcileCanonicalSession(db, session)) throw new Error(`failed verifying imported ACP replay session ${session.sessionId}`);
						importedSessions += 1;
					}
				}, { env: {
					...process.env,
					OPENCLAW_STATE_DIR: params.stateDir
				} });
				await fs$1.unlink(claimPath);
				return {
					importedSessions,
					importedEvents,
					retainedSessions,
					pendingSource: fs.existsSync(params.detected.sourcePath)
				};
			} catch (error) {
				if (claimedThisRun && !fs.existsSync(params.detected.sourcePath)) await fs$1.rename(claimPath, params.detected.sourcePath).catch(() => {});
				throw error;
			}
		});
		changes.push(`Migrated ${result.importedSessions} ACP replay session(s) and ${result.importedEvents} event(s) → shared SQLite state`);
		if (result.retainedSessions > 0) changes.push(`Kept ${result.retainedSessions} existing ACP replay session(s) from shared SQLite state`);
		changes.push(`Removed retired ACP replay ledger ${params.detected.sourcePath}`);
		if (result.pendingSource) warnings.push(`A newer ACP replay ledger remains at ${params.detected.sourcePath}; rerun doctor to migrate it`);
	} catch (error) {
		warnings.push(`Failed migrating legacy ACP replay ledger ${params.detected.sourcePath}: ${String(error)}`);
	}
	return {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/legacy-json-object-stream.ts
const JSON_WHITESPACE = /* @__PURE__ */ new Set([
	" ",
	"	",
	"\r",
	"\n"
]);
var JsonCharacterCursor = class {
	constructor(chunks) {
		this.chunk = "";
		this.offset = 0;
		this.chunks = chunks[Symbol.asyncIterator]();
	}
	async fill() {
		while (this.offset >= this.chunk.length) {
			const next = await this.chunks.next();
			if (next.done) return false;
			this.chunk = next.value;
			this.offset = 0;
		}
		return true;
	}
	async peek() {
		return await this.fill() ? this.chunk[this.offset] ?? null : null;
	}
	async take() {
		if (!await this.fill()) return null;
		return this.chunk[this.offset++] ?? null;
	}
	async skipWhitespace() {
		while (true) {
			const next = await this.peek();
			if (next === null || !JSON_WHITESPACE.has(next)) return;
			await this.take();
		}
	}
};
function parseLegacyJson(raw) {
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("legacy JSON store contains invalid JSON");
	}
}
async function expectCharacter(cursor, expected) {
	await cursor.skipWhitespace();
	if (await cursor.take() !== expected) throw new Error(`expected ${JSON.stringify(expected)} in legacy JSON store`);
}
async function readJsonString(cursor) {
	await cursor.skipWhitespace();
	if (await cursor.take() !== "\"") throw new Error("expected string in legacy JSON store");
	let raw = "\"";
	let escaped = false;
	while (true) {
		const character = await cursor.take();
		if (character === null) throw new Error("unterminated string in legacy JSON store");
		raw += character;
		if (escaped) {
			escaped = false;
			continue;
		}
		if (character === "\\") {
			escaped = true;
			continue;
		}
		if (character === "\"") {
			const parsed = parseLegacyJson(raw);
			if (typeof parsed !== "string") throw new Error("invalid string in legacy JSON store");
			return parsed;
		}
	}
}
async function readJsonObject(cursor) {
	await cursor.skipWhitespace();
	if (await cursor.take() !== "{") throw new Error("legacy JSON entries must be objects");
	let raw = "{";
	let depth = 1;
	let escaped = false;
	let inString = false;
	while (depth > 0) {
		const character = await cursor.take();
		if (character === null) throw new Error("unterminated object in legacy JSON store");
		raw += character;
		if (inString) {
			if (escaped) escaped = false;
			else if (character === "\\") escaped = true;
			else if (character === "\"") inString = false;
			continue;
		}
		if (character === "\"") inString = true;
		else if (character === "{") depth += 1;
		else if (character === "}") depth -= 1;
	}
	return parseLegacyJson(raw);
}
async function parseSinglePropertyObject(params) {
	const cursor = new JsonCharacterCursor(params.chunks);
	await expectCharacter(cursor, "{");
	if (await readJsonString(cursor) !== params.property) throw new Error(`legacy JSON store must contain only ${params.property}`);
	await expectCharacter(cursor, ":");
	await expectCharacter(cursor, "{");
	await cursor.skipWhitespace();
	if (await cursor.peek() !== "}") while (true) {
		const key = await readJsonString(cursor);
		await expectCharacter(cursor, ":");
		params.onEntry(key, await readJsonObject(cursor));
		await cursor.skipWhitespace();
		const separator = await cursor.take();
		if (separator === "}") break;
		if (separator !== ",") throw new Error("expected comma or object end in legacy JSON store");
	}
	else await cursor.take();
	await expectCharacter(cursor, "}");
	await cursor.skipWhitespace();
	if (await cursor.take() !== null) throw new Error("legacy JSON store has trailing content");
}
async function* decodeUtf8Chunks(params) {
	const decoder = new TextDecoder("utf-8", { fatal: true });
	const stream = params.handle.createReadStream({
		autoClose: false,
		start: 0
	});
	for await (const rawChunk of stream) {
		const chunk = Buffer.isBuffer(rawChunk) ? rawChunk : Buffer.from(rawChunk);
		params.hash.update(chunk);
		params.onBytes(chunk.byteLength);
		const text = decoder.decode(chunk, { stream: true });
		if (text) yield text;
	}
	const tail = decoder.decode();
	if (tail) yield tail;
}
function assertStableRead(before, after, bytesRead) {
	if (before.dev !== after.dev || before.ino !== after.ino || before.mtimeMs !== after.mtimeMs || before.size !== after.size || bytesRead !== after.size) throw new Error("legacy JSON store changed while it was being read");
}
/** Hash a safely opened file, optionally parsing its single object property entry by entry. */
async function readLegacyJsonObjectStream(params) {
	const opened = await params.stateRoot.open(params.relativePath, {
		hardlinks: "reject",
		symlinks: "reject"
	});
	const hash = createHash("sha256");
	let size = 0;
	try {
		const before = opened.stat;
		if (params.property && params.onEntry) await parseSinglePropertyObject({
			chunks: decodeUtf8Chunks({
				handle: opened.handle,
				hash,
				onBytes: (length) => {
					size += length;
				}
			}),
			property: params.property,
			onEntry: params.onEntry
		});
		else {
			const stream = opened.handle.createReadStream({
				autoClose: false,
				start: 0
			});
			for await (const rawChunk of stream) {
				const chunk = Buffer.isBuffer(rawChunk) ? rawChunk : Buffer.from(rawChunk);
				hash.update(chunk);
				size += chunk.byteLength;
			}
		}
		const after = await opened.handle.stat();
		assertStableRead(before, after, size);
		return {
			dev: after.dev,
			ino: after.ino,
			mtimeMs: after.mtimeMs,
			sha256: hash.digest("hex"),
			size
		};
	} catch (error) {
		if (error instanceof TypeError && /encoded data was not valid/i.test(error.message)) throw new Error("legacy JSON store is not valid UTF-8", { cause: error });
		throw error;
	} finally {
		await opened[Symbol.asyncDispose]();
	}
}
//#endregion
//#region src/infra/state-migrations.apns.ts
const LEGACY_APNS_REGISTRATION_PATH = "push/apns-registrations.json";
const APNS_DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
const MIGRATION_KIND$5 = "legacy-apns-registrations-json";
const MIGRATION_LOCK_TIMEOUT_MS$7 = 250;
const MIGRATION_LOCK_POLL_INTERVAL_MS$7 = 25;
const MAX_LEGACY_APNS_UPDATED_AT_MS = 864e13;
const DIRECT_REGISTRATION_KEYS = /* @__PURE__ */ new Set([
	"nodeId",
	"transport",
	"token",
	"topic",
	"environment",
	"updatedAtMs"
]);
const RELAY_REGISTRATION_KEYS = /* @__PURE__ */ new Set([
	"nodeId",
	"transport",
	"relayHandle",
	"sendGrant",
	"installationId",
	"topic",
	"environment",
	"distribution",
	"updatedAtMs",
	"relayOrigin",
	"tokenDebugSuffix"
]);
function resolveLegacyApnsPath(stateDir) {
	return path.join(stateDir, LEGACY_APNS_REGISTRATION_PATH);
}
function legacyPathMayExist$4(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
function sourceOrClaimMayExist$4(sourcePath) {
	return legacyPathMayExist$4(sourcePath) || legacyPathMayExist$4(`${sourcePath}${APNS_DOCTOR_CLAIM_SUFFIX}`);
}
/** Detect the retired APNs store only when an explicit Doctor flow opts in. */
function detectLegacyApnsRegistrations(params) {
	const sourcePath = resolveLegacyApnsPath(params.stateDir);
	return {
		sourcePath,
		hasLegacy: params.doctorOnlyStateMigrations === true && sourceOrClaimMayExist$4(sourcePath)
	};
}
function relativeLegacyPath$6(stateDir, filePath) {
	const relativePath = path.relative(path.resolve(stateDir), path.resolve(filePath));
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) throw new Error("legacy APNs path is outside the state directory");
	return relativePath;
}
async function readLegacySourceSnapshot$9(stateRoot, stateDir, sourcePath, onEntry) {
	return {
		sourcePath,
		...await readLegacyJsonObjectStream({
			stateRoot,
			relativePath: relativeLegacyPath$6(stateDir, sourcePath),
			...onEntry ? {
				property: "registrationsByNodeId",
				onEntry
			} : {}
		})
	};
}
function snapshotsMatch$4(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mtimeMs === right.mtimeMs && left.sha256 === right.sha256 && left.size === right.size;
}
function assertOnlyKeys$3(value, allowed) {
	if (Object.keys(value).find((key) => !allowed.has(key))) throw new Error("legacy APNs registration has an unexpected field");
}
function isValidLegacyApnsTimestamp(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= MAX_LEGACY_APNS_UPDATED_AT_MS;
}
function parseLegacyApnsRegistration(rawNodeId, rawRegistration, env) {
	if (!isRecord$1(rawRegistration)) throw new Error("legacy APNs registration is not an object");
	const transport = rawRegistration.transport ?? "direct";
	if (transport !== "direct" && transport !== "relay") throw new Error("legacy APNs registration has invalid transport");
	assertOnlyKeys$3(rawRegistration, transport === "relay" ? RELAY_REGISTRATION_KEYS : DIRECT_REGISTRATION_KEYS);
	const normalizedNodeId = normalizeApnsNodeId(rawNodeId);
	if (!isValidApnsNodeId(normalizedNodeId)) throw new Error("legacy APNs registration has an invalid node id");
	if (!isValidLegacyApnsTimestamp(rawRegistration.updatedAtMs)) throw new Error("legacy APNs registration has an invalid updated timestamp");
	const registration = normalizeCanonicalApnsRegistration(transport === "direct" ? {
		...rawRegistration,
		transport,
		environment: normalizeApnsEnvironment(rawRegistration.environment) ?? "sandbox"
	} : {
		...rawRegistration,
		transport
	}, env);
	const invalidRelayOrigin = transport === "relay" && Object.hasOwn(rawRegistration, "relayOrigin") && (!registration || registration.transport !== "relay" || !registration.relayOrigin);
	const invalidTokenDebugSuffix = transport === "relay" && Object.hasOwn(rawRegistration, "tokenDebugSuffix") && typeof rawRegistration.tokenDebugSuffix !== "string";
	if (!registration || registration.nodeId !== normalizedNodeId || invalidRelayOrigin || invalidTokenDebugSuffix) throw new Error("legacy APNs registration is invalid");
	return [normalizedNodeId, registration];
}
function receiptSourceKey$3(sourcePath) {
	return `apns-json:${createHash("sha256").update(path.resolve(sourcePath)).digest("hex")}`;
}
function readMigrationReceipt$2(sourcePath, env) {
	const sourceKey = receiptSourceKey$3(sourcePath);
	const { db } = openOpenClawStateDatabase({ env });
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("migration_sources").select("removed_source").where("source_key", "=", sourceKey));
	return row ? {
		sourceKey,
		removedSource: row.removed_source === 1
	} : null;
}
function importAndRecordReceipt$3(params) {
	const sourceKey = receiptSourceKey$3(params.sourcePath);
	const runId = `${sourceKey}:${params.snapshot.sha256.slice(0, 16)}`;
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		if (executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("migration_sources").select("source_key").where("source_key", "=", sourceKey))) return {
			sourceKey,
			imported: 0,
			preserved: 0,
			suppressed: 0,
			receiptAuthoritative: true
		};
		let imported = 0;
		let preserved = 0;
		let suppressed = 0;
		const expectedNodeIds = [];
		for (const [nodeId, registration] of params.registrations) {
			const existing = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("apns_registrations").selectAll().where("node_id", "=", nodeId));
			const tombstone = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("apns_registration_tombstones").select("node_id").where("node_id", "=", nodeId));
			if (existing && tombstone) throw new Error("APNs state has both a registration and deletion tombstone");
			if (existing) {
				apnsRegistrationFromRow(existing);
				preserved += 1;
				expectedNodeIds.push(nodeId);
			} else if (tombstone) suppressed += 1;
			else {
				executeSqliteQuerySync(db, stateDb.insertInto("apns_registrations").values(apnsRegistrationToRow(registration)));
				imported += 1;
				expectedNodeIds.push(nodeId);
			}
		}
		for (const nodeId of expectedNodeIds) {
			const verified = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("apns_registrations").selectAll().where("node_id", "=", nodeId));
			if (!verified) throw new Error("SQLite verification failed for an APNs registration");
			apnsRegistrationFromRow(verified);
		}
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND$5,
			target: "apns_registrations",
			sourceSha256: params.snapshot.sha256,
			sourceRecordCount: params.registrations.size,
			importedRecordCount: imported,
			preservedSqliteRecordCount: preserved,
			suppressedDeletedRecordCount: suppressed
		});
		executeSqliteQuerySync(db, stateDb.insertInto("migration_runs").values({
			id: runId,
			started_at: now,
			finished_at: now,
			status: "completed",
			report_json: reportJson
		}));
		executeSqliteQuerySync(db, stateDb.insertInto("migration_sources").values({
			source_key: sourceKey,
			migration_kind: MIGRATION_KIND$5,
			source_path: params.sourcePath,
			target_table: "apns_registrations",
			source_sha256: params.snapshot.sha256,
			source_size_bytes: params.snapshot.size,
			source_record_count: params.registrations.size,
			last_run_id: runId,
			status: "completed",
			imported_at: now,
			removed_source: 0,
			report_json: reportJson
		}));
		return {
			sourceKey,
			imported,
			preserved,
			suppressed,
			receiptAuthoritative: false
		};
	}, { env: params.env });
}
function markSourceRemoved$4(sourceKey, env) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("migration_sources").set({ removed_source: 1 }).where("source_key", "=", sourceKey));
	}, { env });
}
async function removePath$2(params) {
	if (params.removeSource) {
		await params.removeSource(params.sourcePath);
		return;
	}
	await params.stateRoot.remove(relativeLegacyPath$6(params.stateDir, params.sourcePath));
}
async function cleanupReceiptAuthoritativeSources$1(params) {
	let removed = 0;
	for (const candidate of [params.sourcePath, `${params.sourcePath}${APNS_DOCTOR_CLAIM_SUFFIX}`]) {
		if (!await params.stateRoot.exists(relativeLegacyPath$6(params.stateDir, candidate))) continue;
		await readLegacySourceSnapshot$9(params.stateRoot, params.stateDir, candidate);
		await removePath$2({
			...params,
			sourcePath: candidate
		});
		removed += 1;
	}
	if (!params.receipt.removedSource || removed > 0) markSourceRemoved$4(params.receipt.sourceKey, params.env);
	return removed;
}
async function restoreClaim$6(params) {
	const claimPath = `${params.sourcePath}${APNS_DOCTOR_CLAIM_SUFFIX}`;
	try {
		if (!await params.stateRoot.exists(relativeLegacyPath$6(params.stateDir, claimPath))) return null;
		if (await params.stateRoot.exists(relativeLegacyPath$6(params.stateDir, params.sourcePath))) return `source path already exists: ${params.sourcePath}`;
		await params.stateRoot.move(relativeLegacyPath$6(params.stateDir, claimPath), relativeLegacyPath$6(params.stateDir, params.sourcePath));
		return null;
	} catch (error) {
		return String(error);
	}
}
async function migrateWithExclusiveStateOwnership$5(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	if (!params.detected.hasLegacy) return {
		changes,
		warnings
	};
	const receipt = readMigrationReceipt$2(params.detected.sourcePath, params.env);
	if (receipt) {
		try {
			if (await cleanupReceiptAuthoritativeSources$1({
				...params,
				sourcePath: params.detected.sourcePath,
				receipt
			}) > 0) notices.push("Discarded retired APNs JSON state already covered by its SQLite receipt.");
		} catch (error) {
			warnings.push(`APNs state is in SQLite, but legacy cleanup failed: ${String(error)}`);
		}
		return notices.length > 0 ? {
			changes,
			warnings,
			notices
		} : {
			changes,
			warnings
		};
	}
	const sourcePath = params.detected.sourcePath;
	const claimPath = `${sourcePath}${APNS_DOCTOR_CLAIM_SUFFIX}`;
	const hasSource = await params.stateRoot.exists(relativeLegacyPath$6(params.stateDir, sourcePath));
	const hasClaim = await params.stateRoot.exists(relativeLegacyPath$6(params.stateDir, claimPath));
	if (hasSource && hasClaim) return {
		changes,
		warnings: ["Failed migrating legacy APNs state: source and interrupted claim both exist."]
	};
	const activePath = hasSource ? sourcePath : hasClaim ? claimPath : null;
	if (!activePath) return {
		changes,
		warnings
	};
	let snapshot;
	const registrations = /* @__PURE__ */ new Map();
	try {
		snapshot = await readLegacySourceSnapshot$9(params.stateRoot, params.stateDir, activePath, (rawNodeId, rawRegistration) => {
			const [nodeId, registration] = parseLegacyApnsRegistration(rawNodeId, rawRegistration, params.env);
			if (registrations.has(nodeId)) throw new Error("legacy APNs registration has a duplicate node id");
			registrations.set(nodeId, registration);
		});
	} catch (error) {
		warnings.push(`Failed reading legacy APNs state: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	if (activePath === sourcePath) try {
		params.beforeClaim?.();
		await params.stateRoot.move(relativeLegacyPath$6(params.stateDir, sourcePath), relativeLegacyPath$6(params.stateDir, claimPath));
		const claimed = await readLegacySourceSnapshot$9(params.stateRoot, params.stateDir, claimPath);
		if (!snapshotsMatch$4(snapshot, claimed)) throw new Error("legacy APNs source changed before Doctor could claim it");
		snapshot = claimed;
	} catch (error) {
		const restoreError = await restoreClaim$6({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath
		});
		warnings.push(`Failed migrating legacy APNs state: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	let result;
	try {
		result = importAndRecordReceipt$3({
			env: params.env,
			sourcePath,
			snapshot,
			registrations
		});
	} catch (error) {
		const restoreError = await restoreClaim$6({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath
		});
		warnings.push(`Failed migrating legacy APNs state: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	try {
		if (await params.stateRoot.exists(relativeLegacyPath$6(params.stateDir, sourcePath))) throw new Error("legacy APNs source reappeared during import");
		await removePath$2({
			...params,
			sourcePath: claimPath
		});
		markSourceRemoved$4(result.sourceKey, params.env);
	} catch (error) {
		warnings.push(`APNs state is in SQLite, but legacy cleanup failed: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	changes.push(`Migrated ${result.imported} APNs registration${result.imported === 1 ? "" : "s"} to SQLite.`);
	if (result.preserved > 0) notices.push(`Preserved ${result.preserved} canonical SQLite APNs registration${result.preserved === 1 ? "" : "s"}.`);
	if (result.suppressed > 0) notices.push(`Kept ${result.suppressed} deleted APNs registration${result.suppressed === 1 ? "" : "s"} retired.`);
	notices.push("Removed retired APNs JSON state after verified SQLite import.");
	return {
		changes,
		warnings,
		notices
	};
}
/** Import the retired APNs store while excluding old Gateways that can recreate it. */
async function migrateLegacyApnsRegistrations(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	const env = {
		...params.env ?? process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env,
			pollIntervalMs: MIGRATION_LOCK_POLL_INTERVAL_MS$7,
			role: "sqlite-maintenance",
			timeoutMs: MIGRATION_LOCK_TIMEOUT_MS$7
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed migrating legacy APNs state: ${error instanceof GatewayLockError ? "the Gateway or another SQLite maintenance command owns this state directory" : String(error)}. Stop the Gateway and run \`openclaw doctor --fix\` again.`]
		};
	}
	if (!lock) return {
		changes: [],
		warnings: ["Failed migrating legacy APNs state: exclusive state ownership unavailable."]
	};
	let result = {
		changes: [],
		warnings: []
	};
	let releaseError;
	try {
		try {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				symlinks: "reject"
			});
			result = await migrateWithExclusiveStateOwnership$5({
				...params,
				env,
				stateRoot
			});
		} catch (error) {
			result.warnings.push(`Failed reading legacy APNs state: ${String(error)}`);
		}
	} finally {
		try {
			await lock.release();
		} catch (error) {
			releaseError = error;
		}
	}
	if (releaseError) result.warnings.push(`APNs migration lock release failed: ${formatErrorMessage(releaseError)}`);
	return result;
}
//#endregion
//#region src/infra/state-migrations.audit-sanitized.ts
async function writeRecoveredSanitizedAuditArchive(params) {
	const current = await params.root.exists(params.relativePath) ? await readLegacyAuditSourceSnapshot(params.root, params.relativePath) : void 0;
	let desired;
	if (params.previousCheckpoint) {
		if (!current || current.rawBytes.length < params.previousCheckpoint.sanitizedSize) {
			params.warnings.push(`Skipped ${params.sourceLabel} recovery because its sanitized archive is missing or truncated`);
			return false;
		}
		const checkpointedPrefix = current.rawBytes.subarray(0, params.previousCheckpoint.sanitizedSize);
		if (createHash("sha256").update(checkpointedPrefix).digest("hex") !== params.previousCheckpoint.sanitizedContentHash) {
			params.warnings.push(`Skipped ${params.sourceLabel} recovery because its sanitized archive changed after checkpoint`);
			return false;
		}
		desired = Buffer.concat([checkpointedPrefix, Buffer.from(params.candidateRecordsJsonl, "utf8")]);
		if (current.rawBytes.equals(desired)) return true;
		const currentIsVerifiedDesiredPrefix = desired.subarray(0, current.rawBytes.length).equals(current.rawBytes);
		if (current.rawBytes.length !== params.previousCheckpoint.sanitizedSize && !currentIsVerifiedDesiredPrefix) {
			params.warnings.push(`Skipped ${params.sourceLabel} recovery because its sanitized archive has an uncheckpointed tail`);
			return false;
		}
	} else {
		desired = Buffer.from(params.allRecordsJsonl, "utf8");
		if (current?.rawBytes.equals(desired)) return true;
	}
	await params.root.write(params.relativePath, desired, {
		mkdir: false,
		mode: 384
	});
	return true;
}
//#endregion
//#region src/infra/state-migrations.audit-logs.ts
function legacyAuditClaimPathForArchive(sourcePath, sanitizedArchivePath) {
	const archivePrefix = `${sourcePath}.migrated`;
	if (!sanitizedArchivePath.startsWith(archivePrefix)) throw new Error(`Invalid legacy audit archive path ${sanitizedArchivePath}`);
	const generationSuffix = sanitizedArchivePath.slice(archivePrefix.length);
	return path.join(path.dirname(sourcePath), `.${path.basename(sourcePath)}.doctor-importing${generationSuffix}`);
}
async function resolveAuditArchiveRelativePaths(root, sourceRelativePath) {
	const directoryPath = path.join(root.rootReal, path.dirname(sourceRelativePath));
	const baseName = path.basename(sourceRelativePath).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
	const archivePattern = new RegExp(`^${baseName}\\.migrated(?:\\.([2-9]|[1-9][0-9]+))?(?:\\.raw)?$`, "u");
	const claimPattern = new RegExp(`^\\.${baseName}\\.doctor-importing(?:\\.([2-9]|[1-9][0-9]+))?$`, "u");
	let latestGeneration = 0n;
	for (const entry of fs.readdirSync(directoryPath)) {
		const match = archivePattern.exec(entry) ?? claimPattern.exec(entry);
		if (!match) continue;
		const generation = BigInt(match[1] ?? "1");
		if (generation > latestGeneration) latestGeneration = generation;
	}
	const generation = latestGeneration + 1n;
	const sanitized = `${sourceRelativePath}.migrated${generation === 1n ? "" : `.${generation}`}`;
	return {
		sanitized,
		raw: `${sanitized}.raw`,
		resumeSanitized: false
	};
}
async function secureAuditArchiveFile(params) {
	try {
		const opened = await params.root.open(params.relativePath);
		try {
			await opened.handle.chmod(384);
			await opened.handle.sync();
		} finally {
			await opened.handle.close();
		}
		return true;
	} catch (error) {
		params.warnings.push(`Failed securing ${params.label} legacy source: ${String(error)}`);
		return false;
	}
}
async function archiveLegacyAuditClaim(params) {
	let moved = false;
	let sanitizedCreated = false;
	const archivePaths = params.archivePaths;
	try {
		if (archivePaths.resumeSanitized) await params.root.write(archivePaths.sanitized, params.sanitizedJsonl, {
			mkdir: false,
			mode: 384
		});
		else await params.root.create(archivePaths.sanitized, params.sanitizedJsonl, { mode: 384 });
		sanitizedCreated = true;
		if (!await secureAuditArchiveFile({
			root: params.root,
			relativePath: archivePaths.sanitized,
			label: `sanitized ${params.source.label}`,
			warnings: params.warnings
		})) return { moved: false };
		await params.root.move(params.claimRelativePath, archivePaths.raw);
		if (!await secureAuditArchiveFile({
			root: params.root,
			relativePath: archivePaths.raw,
			label: `raw archived ${params.source.label}`,
			warnings: params.warnings
		})) {
			try {
				await params.root.move(archivePaths.raw, params.claimRelativePath);
			} catch (error) {
				params.warnings.push(`Failed restoring unsecured ${params.source.label} legacy source: ${String(error)}`);
			}
			return { moved: false };
		}
		moved = true;
		const scrubbedSnapshot = await scrubLegacyAuditRecoveryArchive({
			root: params.root,
			relativePath: archivePaths.raw,
			expectedSnapshot: params.snapshot,
			label: params.source.label,
			warnings: params.warnings
		});
		params.changes.push(`Archived sanitized ${params.source.label} legacy source → ${path.join(path.dirname(params.source.logicalSourcePath), path.basename(archivePaths.sanitized))}; ${scrubbedSnapshot ? "scrubbed same-inode append recovery archive" : "retained same-inode append recovery archive for Doctor retry"} → ${path.join(path.dirname(params.source.logicalSourcePath), path.basename(archivePaths.raw))}`);
		return {
			moved: true,
			rawRelativePath: archivePaths.raw,
			...scrubbedSnapshot ? { scrubbedSnapshot } : {}
		};
	} catch (error) {
		params.warnings.push(`Failed archiving ${params.source.label} ${params.source.logicalSourcePath}: ${String(error)}`);
	} finally {
		if (!moved && sanitizedCreated) await params.root.remove(archivePaths.sanitized).catch(() => void 0);
	}
	return {
		moved,
		...moved ? { rawRelativePath: archivePaths.raw } : {}
	};
}
async function restoreOrPreserveLegacyAuditClaim(params) {
	try {
		if (!await params.root.exists(params.claimRelativePath)) return;
		if (!await params.root.exists(params.sourceRelativePath)) {
			await params.root.move(params.claimRelativePath, params.sourceRelativePath);
			await secureAuditArchiveFile({
				root: params.root,
				relativePath: params.sourceRelativePath,
				label: params.source.label,
				warnings: params.warnings
			});
			return;
		}
		await params.root.move(params.claimRelativePath, params.archivePaths.raw);
		await secureAuditArchiveFile({
			root: params.root,
			relativePath: params.archivePaths.raw,
			label: `preserved ${params.source.label}`,
			warnings: params.warnings
		});
		params.warnings.push(`Preserved claimed ${params.source.label} at ${path.join(path.dirname(params.source.logicalSourcePath), path.basename(params.archivePaths.raw))} because an old writer recreated ${params.source.logicalSourcePath}`);
	} catch (error) {
		params.warnings.push(`Failed restoring claimed ${params.source.label} ${params.source.logicalSourcePath}: ${String(error)}`);
	}
}
async function migrateLegacyAuditLogSource(params) {
	const changes = [];
	const warnings = [];
	const result = (completed) => ({
		changes,
		warnings,
		completed
	});
	const root$1 = await root(params.stateDir, {
		hardlinks: "reject",
		maxBytes: Number.MAX_SAFE_INTEGER,
		mkdir: false,
		mode: 384,
		symlinks: "reject"
	});
	const sourceRelativePath = path.relative(path.resolve(params.stateDir), params.source.logicalSourcePath);
	const detectedRelativePath = path.relative(path.resolve(params.stateDir), params.source.sourcePath);
	let archivePaths;
	let claimRelativePath = detectedRelativePath;
	if (params.source.storage === "active") {
		archivePaths = await resolveAuditArchiveRelativePaths(root$1, sourceRelativePath);
		claimRelativePath = path.relative(path.resolve(params.stateDir), legacyAuditClaimPathForArchive(params.source.logicalSourcePath, path.join(params.stateDir, archivePaths.sanitized)));
		await root$1.move(detectedRelativePath, claimRelativePath);
	} else if (params.source.storage === "claim") {
		if (!params.source.sanitizedArchivePath || !params.source.rawArchivePath) throw new Error(`Missing reserved archive generation for ${params.source.sourcePath}`);
		const sanitized = path.relative(path.resolve(params.stateDir), params.source.sanitizedArchivePath);
		const raw = path.relative(path.resolve(params.stateDir), params.source.rawArchivePath);
		archivePaths = {
			sanitized,
			raw,
			resumeSanitized: await root$1.exists(sanitized) && !await root$1.exists(raw)
		};
	}
	let claimFinalized = params.source.storage === "raw-archive";
	try {
		if (!await secureAuditArchiveFile({
			root: root$1,
			relativePath: claimRelativePath,
			label: `claimed ${params.source.label}`,
			warnings
		})) return result(false);
		const rawArchiveRelativePath = archivePaths?.raw ?? detectedRelativePath;
		if (!hasLegacyAuditRawCheckpointCapacity(params.stateDir, rawArchiveRelativePath)) {
			warnings.push(`Skipped ${params.source.label} migration because durable raw-archive checkpoint capacity is exhausted; left the legacy source in place`);
			return result(false);
		}
		if (!await restoreInterruptedAuditRecoveryArchive({
			root: root$1,
			relativePath: claimRelativePath,
			label: params.source.label,
			warnings
		})) return result(false);
		const snapshot = await readLegacyAuditSourceSnapshot(root$1, claimRelativePath);
		const sourceGeneration = legacyAuditSourceGenerationKey(rawArchiveRelativePath);
		const sanitizedRelativePath = params.source.storage === "raw-archive" && params.source.sanitizedArchivePath ? path.relative(path.resolve(params.stateDir), params.source.sanitizedArchivePath) : void 0;
		const previousCheckpoint = params.source.storage === "raw-archive" ? findPreviousLegacyAuditRawCheckpoint(params.stateDir, rawArchiveRelativePath) : void 0;
		if (params.source.storage === "raw-archive" && !previousCheckpoint) {
			if (!sanitizedRelativePath) throw new Error(`Missing sanitized archive path for ${params.source.sourcePath}`);
			const firstContentByte = snapshot.rawBytes.findIndex((byte) => byte !== 32 && byte !== 9 && byte !== 10 && byte !== 13);
			if (snapshot.rawBytes.length > 0 && firstContentByte !== 0) {
				warnings.push(`Skipped ${params.source.label} recovery because its checkpointless raw archive begins with ambiguous whitespace; left the archive in place`);
				return result(false);
			}
		}
		const prepared = prepareLegacyAuditRecords(params.source, snapshot.raw, sourceGeneration, previousCheckpoint?.recordOrdinalBase ?? 0);
		if (!prepared.ok) {
			warnings.push(...prepared.warnings);
			return result(false);
		}
		const env = {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		};
		const maxEntries = params.source.kind === "config" ? CONFIG_AUDIT_MAX_ENTRIES : SYSTEM_AGENT_AUDIT_MAX_ENTRIES;
		const store = createSqliteAuditRecordStore({
			scope: params.source.kind === "config" ? CONFIG_AUDIT_SCOPE : SYSTEM_AGENT_AUDIT_SCOPE,
			maxEntries,
			env
		});
		const existingEntries = store.entries();
		const existingKeys = new Set(existingEntries.map((entry) => entry.key));
		let candidateRecords = prepared.records;
		if (params.source.storage === "raw-archive") {
			if (previousCheckpoint) {
				const appendedRecords = recordsAfterLegacyAuditRawCheckpoint({
					checkpoint: previousCheckpoint,
					snapshot,
					records: prepared.records
				});
				if (!appendedRecords) {
					warnings.push(`Skipped ${params.source.label} recovery because ${params.source.sourcePath} changed other than by append; left the raw archive in place`);
					return result(false);
				}
				candidateRecords = appendedRecords;
			}
		}
		if (!previousCheckpoint && candidateRecords === prepared.records) {
			const lastRetainedSourceIndex = prepared.records.findLastIndex((record) => existingKeys.has(record.key));
			if (lastRetainedSourceIndex >= 0) candidateRecords = prepared.records.slice(lastRetainedSourceIndex + 1);
		}
		const missing = candidateRecords.filter((record) => !existingKeys.has(record.key));
		store.registerLegacyMany(missing);
		const importedKeys = new Set(store.entries().map((entry) => entry.key));
		const retainedNewRows = missing.filter((record) => importedKeys.has(record.key)).length;
		const retentionNote = retainedNewRows === missing.length ? "" : `; ${retainedNewRows} retained after bounded retention`;
		if (params.source.storage === "raw-archive") {
			if (!sanitizedRelativePath) throw new Error(`Missing sanitized archive path for ${params.source.sourcePath}`);
			if (!await writeRecoveredSanitizedAuditArchive({
				sourceLabel: params.source.label,
				root: root$1,
				relativePath: sanitizedRelativePath,
				allRecordsJsonl: prepared.sanitizedJsonl,
				candidateRecordsJsonl: serializePreparedAuditRecords(candidateRecords),
				previousCheckpoint,
				warnings
			})) return result(false);
			if (previousCheckpoint?.phase !== "merge-intent" || candidateRecords.length > 0) {
				if (!await recordLegacyAuditRawCheckpoint({
					stateDir: params.stateDir,
					rawPath: params.source.sourcePath,
					rawRelativePath: claimRelativePath,
					sanitizedRelativePath,
					root: root$1,
					snapshot,
					phase: "merge-intent",
					recordCount: prepared.records.length,
					recordOrdinalBase: previousCheckpoint?.recordOrdinalBase ?? 0,
					warnings
				})) return result(false);
			}
			if (!await secureAuditArchiveFile({
				root: root$1,
				relativePath: sanitizedRelativePath,
				label: `sanitized ${params.source.label}`,
				warnings
			})) return result(false);
			if (missing.length > 0) changes.push(`Recovered ${missing.length} later ${params.source.label} row(s) from ${params.source.sourcePath}${retentionNote}`);
			const scrubbedSnapshot = await scrubLegacyAuditRecoveryArchive({
				root: root$1,
				relativePath: claimRelativePath,
				expectedSnapshot: snapshot,
				label: params.source.label,
				warnings
			});
			if (!scrubbedSnapshot) return result(false);
			const scrubbedRecords = prepareLegacyAuditRecords(params.source, scrubbedSnapshot.raw, legacyAuditSourceGenerationKey(rawArchiveRelativePath));
			if (!scrubbedRecords.ok) {
				warnings.push(...scrubbedRecords.warnings);
				warnings.push(`Retained uncheckpointed ${params.source.label} recovery archive; rerun openclaw doctor --fix`);
				return result(false);
			}
			if (scrubbedRecords.records.length !== 0) {
				warnings.push(`A legacy ${params.source.label} writer appended during recovery; rerun openclaw doctor --fix to import the retained rows`);
				return result(false);
			}
			const checkpointed = await recordLegacyAuditRawCheckpoint({
				stateDir: params.stateDir,
				rawPath: params.source.sourcePath,
				rawRelativePath: claimRelativePath,
				sanitizedRelativePath,
				root: root$1,
				snapshot: scrubbedSnapshot,
				phase: "raw",
				recordCount: 0,
				recordOrdinalBase: (previousCheckpoint?.recordOrdinalBase ?? 0) + Math.max(previousCheckpoint?.recordCount ?? 0, prepared.records.length),
				warnings
			});
			if (checkpointed) await finalizeLegacyAuditRecoveryArchive({
				root: root$1,
				relativePath: claimRelativePath
			}).catch((error) => {
				warnings.push(`Failed removing completed ${params.source.label} recovery journal: ${String(error)}`);
			});
			return result(checkpointed);
		}
		if (!archivePaths) throw new Error(`Missing archive generation for ${params.source.sourcePath}`);
		changes.push(`Migrated ${params.source.label} -> shared SQLite state (${missing.length} new row(s)${retentionNote})`);
		const archived = await archiveLegacyAuditClaim({
			source: params.source,
			claimRelativePath,
			archivePaths,
			snapshot,
			sanitizedJsonl: prepared.sanitizedJsonl,
			root: root$1,
			changes,
			warnings
		});
		claimFinalized = archived.moved;
		if (!archived.moved || !archived.rawRelativePath) {
			changes.pop();
			return result(false);
		}
		if (!archived.scrubbedSnapshot) return result(false);
		const scrubbedRecords = prepareLegacyAuditRecords(params.source, archived.scrubbedSnapshot.raw, legacyAuditSourceGenerationKey(archived.rawRelativePath));
		if (!scrubbedRecords.ok) {
			warnings.push(...scrubbedRecords.warnings);
			warnings.push(`Retained uncheckpointed ${params.source.label} recovery archive; rerun openclaw doctor --fix`);
			return result(false);
		}
		if (scrubbedRecords.records.length !== 0) {
			warnings.push(`A legacy ${params.source.label} writer appended during migration; rerun openclaw doctor --fix to import the retained rows`);
			return result(false);
		}
		const rawPath = path.join(params.stateDir, archived.rawRelativePath);
		const checkpointed = await recordLegacyAuditRawCheckpoint({
			stateDir: params.stateDir,
			rawPath,
			rawRelativePath: archived.rawRelativePath,
			sanitizedRelativePath: archivePaths.sanitized,
			root: root$1,
			snapshot: archived.scrubbedSnapshot,
			phase: "raw",
			recordCount: 0,
			recordOrdinalBase: prepared.records.length,
			warnings
		});
		if (checkpointed) await finalizeLegacyAuditRecoveryArchive({
			root: root$1,
			relativePath: archived.rawRelativePath
		}).catch((error) => {
			warnings.push(`Failed removing completed ${params.source.label} recovery journal: ${String(error)}`);
		});
		if (await root$1.exists(sourceRelativePath) && !params.recreatedSourceScheduled) warnings.push(`An old writer recreated ${params.source.label} at ${params.source.logicalSourcePath}; rerun openclaw doctor --fix to import the retained rows`);
		return result(checkpointed);
	} finally {
		if (!claimFinalized && params.source.storage === "active" && archivePaths) await restoreOrPreserveLegacyAuditClaim({
			source: params.source,
			claimRelativePath,
			sourceRelativePath,
			archivePaths,
			root: root$1,
			warnings
		});
	}
}
async function migrateLegacyAuditLogs(params) {
	const changes = [];
	const warnings = [];
	if (params.detected.sources.length === 0) return {
		changes,
		warnings
	};
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env,
			pollIntervalMs: 25,
			role: "sqlite-maintenance",
			timeoutMs: 250
		});
	} catch (error) {
		warnings.push(`Skipped legacy audit migration because exclusive state ownership is unavailable: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	if (!lock) {
		warnings.push("Skipped legacy audit migration because exclusive state ownership is unavailable");
		return {
			changes,
			warnings
		};
	}
	try {
		await withLegacyAuditMigrationLease(params.stateDir, async () => {
			const blockedLogicalSources = /* @__PURE__ */ new Set();
			for (const [index, source] of params.detected.sources.entries()) {
				if (blockedLogicalSources.has(source.logicalSourcePath)) continue;
				try {
					const recreatedSourceScheduled = params.detected.sources.slice(index + 1).some((candidate) => candidate.storage === "active" && candidate.logicalSourcePath === source.logicalSourcePath);
					const result = await migrateLegacyAuditLogSource({
						source,
						stateDir: params.stateDir,
						...recreatedSourceScheduled ? { recreatedSourceScheduled: true } : {}
					});
					changes.push(...result.changes);
					warnings.push(...result.warnings);
					if (!result.completed) blockedLogicalSources.add(source.logicalSourcePath);
				} catch (error) {
					warnings.push(`Failed migrating ${source.label}: ${String(error)}`);
					blockedLogicalSources.add(source.logicalSourcePath);
				}
			}
		});
	} catch (error) {
		warnings.push(`Skipped legacy audit migration because coordination failed: ${String(error)}`);
	} finally {
		await lock.release();
	}
	return {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.channel-pairing.ts
const PAIRING_SUFFIX = "-pairing.json";
const ALLOW_FROM_SUFFIX = "-allowFrom.json";
function detectLegacyChannelPairingState(params) {
	let directoryEntries = [];
	try {
		directoryEntries = fs.readdirSync(params.sourceDir, { withFileTypes: true });
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}
	const files = directoryEntries.filter((entry) => entry.isFile() && (entry.name.endsWith(PAIRING_SUFFIX) || entry.name.endsWith(ALLOW_FROM_SUFFIX))).map((entry) => entry.name).toSorted();
	const pairedChannelIds = files.filter((filename) => filename.endsWith(PAIRING_SUFFIX)).map((filename) => filename.slice(0, -13));
	const knownChannelIds = dedupePreserveOrder([
		...CHANNEL_IDS,
		...params.configuredChannelIds ?? [],
		...pairedChannelIds
	]).toSorted((left, right) => right.length - left.length || left.localeCompare(right));
	return {
		sourceDir: params.sourceDir,
		files,
		knownChannelIds,
		defaultAccountIds: { ...params.configuredDefaultAccountIds },
		accountIds: Object.fromEntries(Object.entries(params.configuredAccountIds ?? {}).map(([channel, accountIds]) => [channel, dedupePreserveOrder(accountIds.map((accountId) => resolveAllowFromAccountId(accountId)))])),
		hasLegacy: files.length > 0
	};
}
function parsePairingFilename(filename) {
	return filename.endsWith(PAIRING_SUFFIX) ? filename.slice(0, -13) : null;
}
function parseAllowFromFilename(filename, knownChannelIds, defaultAccountIds, accountIds) {
	if (!filename.endsWith(ALLOW_FROM_SUFFIX)) return null;
	const stem = filename.slice(0, -15);
	const targets = [];
	let hasAccountCollision = false;
	for (const channel of knownChannelIds) {
		if (stem === channel) {
			targets.push({
				channel,
				accountId: normalizeOptionalString(defaultAccountIds[channel]) ?? "default"
			});
			continue;
		}
		if (!stem.startsWith(`${channel}-`)) continue;
		const accountKey = stem.slice(channel.length + 1);
		const matchingAccountIds = (accountIds[channel] ?? []).filter((accountId) => safeAccountKey(accountId) === accountKey);
		if (matchingAccountIds.length === 1 && matchingAccountIds[0]) targets.push({
			channel,
			accountId: matchingAccountIds[0]
		});
		else if (matchingAccountIds.length > 1) hasAccountCollision = true;
		else if (accountKey === "default" && CHANNEL_IDS.includes(channel)) targets.push({
			channel,
			accountId: DEFAULT_ACCOUNT_ID
		});
	}
	if (hasAccountCollision || targets.length > 1) return {
		target: null,
		reason: "ambiguous"
	};
	return targets[0] ? { target: targets[0] } : {
		target: null,
		reason: "unresolved"
	};
}
function normalizeLegacyPairingRequest(value) {
	if (!isRecord$1(value)) return null;
	const id = normalizeOptionalString(value.id);
	const code = normalizeOptionalString(value.code);
	const createdAt = normalizeOptionalString(value.createdAt);
	const lastSeenAt = normalizeOptionalString(value.lastSeenAt) ?? createdAt;
	if (!id || !code || !createdAt || !lastSeenAt) return null;
	const meta = isRecord$1(value.meta) ? Object.fromEntries(Object.entries(value.meta).map(([key, entry]) => [key, normalizeOptionalString(entry) ?? ""]).filter(([, entry]) => Boolean(entry))) : void 0;
	return {
		id,
		code,
		createdAt,
		lastSeenAt,
		...meta && Object.keys(meta).length ? { meta } : {}
	};
}
function readLegacyPairingRequests(filePath) {
	try {
		const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
		if (!isRecord$1(parsed) || !Array.isArray(parsed.requests)) return null;
		return parsed.requests.flatMap((entry) => {
			const request = normalizeLegacyPairingRequest(entry);
			return request ? [request] : [];
		});
	} catch {
		return null;
	}
}
function normalizeAllowEntry(channel, value) {
	const raw = typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
	if (!raw || raw === "*") return "";
	let adapter;
	try {
		adapter = getPairingAdapter(channel);
	} catch {
		adapter = null;
	}
	const entry = normalizeOptionalString(adapter?.normalizeAllowEntry ? adapter.normalizeAllowEntry(raw) : raw) ?? "";
	return entry === "*" ? "" : entry;
}
function readLegacyAllowFrom(filePath, channel) {
	try {
		const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
		const values = Array.isArray(parsed) ? parsed : isRecord$1(parsed) && Array.isArray(parsed.allowFrom) ? parsed.allowFrom : null;
		if (!values) return null;
		return dedupePreserveOrder(values.map((value) => normalizeAllowEntry(channel, value)).filter(Boolean));
	} catch {
		return null;
	}
}
function mergePairingRequests(current, legacy) {
	const merged = current.slice();
	const keys = new Set(current.map((request) => `${resolveAllowFromAccountId(request.meta?.accountId)}\0${request.id}`));
	for (const request of legacy) {
		const key = `${resolveAllowFromAccountId(request.meta?.accountId)}\0${request.id}`;
		if (!keys.has(key)) {
			keys.add(key);
			merged.push(request);
		}
	}
	return merged;
}
function removeImportedSource(filePath, warnings) {
	try {
		fs.rmSync(filePath, { force: true });
		return true;
	} catch (err) {
		warnings.push(`Imported legacy channel pairing state but failed removing ${filePath}: ${String(err)}`);
		return false;
	}
}
function migrateLegacyChannelPairingState(params) {
	const changes = [];
	const warnings = [];
	for (const filename of params.detected.files) {
		const filePath = path.join(params.detected.sourceDir, filename);
		const pairingChannel = parsePairingFilename(filename);
		if (pairingChannel) {
			const requests = readLegacyPairingRequests(filePath);
			if (!requests) {
				warnings.push(`Legacy channel pairing file unreadable; left in place at ${filePath}`);
				continue;
			}
			updateChannelPairingStateSnapshot(pairingChannel, params.env, (state) => {
				state.requests = mergePairingRequests(state.requests, requests);
			});
			removeImportedSource(filePath, warnings);
			changes.push(`Migrated ${requests.length} ${pairingChannel} pairing request(s) → shared SQLite state`);
			continue;
		}
		const allowTarget = parseAllowFromFilename(filename, params.detected.knownChannelIds, params.detected.defaultAccountIds, params.detected.accountIds);
		if (!allowTarget) continue;
		if (!allowTarget.target) {
			const reason = allowTarget.reason === "ambiguous" ? "ambiguous" : "unresolved";
			warnings.push(`Legacy channel allowFrom channel/account is ${reason}; left in place at ${filePath}`);
			continue;
		}
		const entries = readLegacyAllowFrom(filePath, allowTarget.target.channel);
		if (!entries) {
			warnings.push(`Legacy channel allowFrom file unreadable; left in place at ${filePath}`);
			continue;
		}
		const accountId = resolveAllowFromAccountId(allowTarget.target.accountId);
		updateChannelPairingStateSnapshot(allowTarget.target.channel, params.env, (state) => {
			state.allowFrom ??= {};
			state.allowFrom[accountId] = dedupePreserveOrder([...state.allowFrom[accountId] ?? [], ...entries]);
		});
		removeImportedSource(filePath, warnings);
		changes.push(`Migrated ${entries.length} ${allowTarget.target.channel}/${accountId} allowFrom entr${entries.length === 1 ? "y" : "ies"} → shared SQLite state`);
	}
	return {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.commitments.ts
const LEGACY_STORE_KEYS = /* @__PURE__ */ new Set(["version", "commitments"]);
const ACTIVE_STATUSES = ["pending", "snoozed"];
function resolveLegacyCommitmentsPath(stateDir) {
	return path.join(stateDir, "commitments", "commitments.json");
}
/** Detect retired commitment state only when an explicit doctor flow opts in. */
function detectLegacyCommitments(params) {
	const sourcePath = resolveLegacyCommitmentsPath(params.stateDir);
	return {
		sourcePath,
		hasLegacy: params.doctorOnlyStateMigrations === true && fs.existsSync(sourcePath)
	};
}
function readLegacySourceSnapshot$8(sourcePath) {
	const before = fs.lstatSync(sourcePath);
	if (!before.isFile() || before.isSymbolicLink()) throw new Error("legacy commitments source is not a regular non-symlink file");
	const raw = fs.readFileSync(sourcePath, "utf8");
	const after = fs.lstatSync(sourcePath);
	if (!after.isFile() || after.isSymbolicLink() || before.dev !== after.dev || before.ino !== after.ino || before.size !== after.size || before.mtimeMs !== after.mtimeMs) throw new Error("legacy commitments source changed while doctor was reading it");
	return {
		dev: after.dev,
		ino: after.ino,
		mtimeMs: after.mtimeMs,
		raw,
		sha256: createHash("sha256").update(raw).digest("hex"),
		size: after.size
	};
}
function sourceSnapshotsMatch$4(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mtimeMs === right.mtimeMs && left.sha256 === right.sha256 && left.size === right.size;
}
function assertLegacySourceUnchanged$1(sourcePath, snapshot) {
	if (!sourceSnapshotsMatch$4(readLegacySourceSnapshot$8(sourcePath), snapshot)) throw new Error("legacy commitments source changed after doctor loaded it");
}
function parseLegacyCommitments(raw) {
	const parsed = JSON.parse(raw);
	if (!isRecord$1(parsed) || parsed.version !== 1 || !Array.isArray(parsed.commitments)) throw new Error("legacy commitments store must be a version 1 JSON object");
	const unexpectedKey = Object.keys(parsed).find((key) => !LEGACY_STORE_KEYS.has(key));
	if (unexpectedKey) throw new Error(`legacy commitments store has unexpected field ${unexpectedKey}`);
	const records = [];
	const ids = /* @__PURE__ */ new Set();
	for (const [index, rawRecord] of parsed.commitments.entries()) {
		const record = coerceCommitmentRecord(rawRecord);
		if (!record) throw new Error(`legacy commitment at index ${index} is invalid`);
		if (ids.has(record.id)) throw new Error(`legacy commitments store contains duplicate id ${record.id}`);
		ids.add(record.id);
		records.push(record);
	}
	return records;
}
function sameLogicalScope(left, right) {
	return left.agentId === right.agentId && left.sessionKey === right.sessionKey && left.channel === right.channel && (left.accountId ?? "") === (right.accountId ?? "") && (left.to ?? "") === (right.to ?? "") && (left.threadId ?? "") === (right.threadId ?? "") && (left.senderId ?? "") === (right.senderId ?? "") && left.dedupeKey === right.dedupeKey;
}
function findActiveLogicalRow(db, record) {
	if (record.status !== "pending" && record.status !== "snoozed") return;
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("commitments").selectAll().where("agent_id", "=", record.agentId).where("session_key", "=", record.sessionKey).where("channel", "=", record.channel).where("dedupe_key", "=", record.dedupeKey).where("status", "in", [...ACTIVE_STATUSES]).orderBy("updated_at_ms", "desc").orderBy("id", "asc")).rows.find((candidate) => sameLogicalScope(commitmentRecordFromRow(candidate), record));
}
function updateCommitmentRow(db, record) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("commitments").set(commitmentRecordToUpdate(record)).where("id", "=", record.id));
}
function restoreClaimAfterCleanupFailure$1(claimPath, sourcePath) {
	if (!fs.existsSync(claimPath) || fs.existsSync(sourcePath)) return null;
	try {
		fs.renameSync(claimPath, sourcePath);
		return null;
	} catch (error) {
		return `; claimed source remains at ${claimPath} because restore also failed: ${String(error)}`;
	}
}
function claimAndRemoveSource(params) {
	params.beforeClaim?.();
	const claimPath = `${params.sourcePath}.doctor-importing-${process.pid}-${randomUUID()}`;
	fs.renameSync(params.sourcePath, claimPath);
	try {
		if (!sourceSnapshotsMatch$4(readLegacySourceSnapshot$8(claimPath), params.snapshot)) throw new Error("legacy commitments source changed before doctor could claim it");
		(params.removeSource ?? fs.unlinkSync)(claimPath);
	} catch (error) {
		const restoreFailure = restoreClaimAfterCleanupFailure$1(claimPath, params.sourcePath);
		throw new Error(`${String(error)}${restoreFailure ?? ""}`, { cause: error });
	}
}
/** Import, verify, and remove the retired JSON store during explicit doctor repair. */
function migrateLegacyCommitments(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	if (!params.detected.hasLegacy) return {
		changes,
		warnings
	};
	let snapshot;
	let legacyRecords;
	try {
		snapshot = readLegacySourceSnapshot$8(params.detected.sourcePath);
		legacyRecords = parseLegacyCommitments(snapshot.raw);
	} catch (error) {
		warnings.push(`Failed reading legacy commitments state ${params.detected.sourcePath}: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	const expectedRows = /* @__PURE__ */ new Map();
	let importedCount = 0;
	let newerSqliteCount = 0;
	let activeDuplicateCount = 0;
	try {
		assertLegacySourceUnchanged$1(params.detected.sourcePath, snapshot);
		runOpenClawStateWriteTransaction(({ db }) => {
			const commitmentsDb = getNodeSqliteKysely(db);
			for (const legacyRecord of legacyRecords) {
				const existingRow = executeSqliteQueryTakeFirstSync(db, commitmentsDb.selectFrom("commitments").selectAll().where("id", "=", legacyRecord.id));
				if (existingRow) {
					const existing = commitmentRecordFromRow(existingRow);
					if (commitmentImmutableIdentity(existing) !== commitmentImmutableIdentity(legacyRecord)) throw new Error(`commitment ${legacyRecord.id} has conflicting immutable identity`);
					if (existing.updatedAtMs > legacyRecord.updatedAtMs) {
						expectedRows.set(existing.id, existing);
						newerSqliteCount += 1;
						continue;
					}
					if (existing.updatedAtMs === legacyRecord.updatedAtMs) {
						if (!commitmentRecordsEqual(existing, legacyRecord)) throw new Error(`commitment ${legacyRecord.id} diverges between JSON and SQLite at the same timestamp`);
						expectedRows.set(existing.id, existing);
						continue;
					}
					updateCommitmentRow(db, legacyRecord);
					expectedRows.set(legacyRecord.id, legacyRecord);
					importedCount += 1;
					continue;
				}
				const activeLogicalRow = findActiveLogicalRow(db, legacyRecord);
				if (activeLogicalRow) {
					const activeRecord = commitmentRecordFromRow(activeLogicalRow);
					expectedRows.set(activeRecord.id, activeRecord);
					activeDuplicateCount += 1;
					continue;
				}
				executeSqliteQuerySync(db, commitmentsDb.insertInto("commitments").values(commitmentRecordToRow(legacyRecord)));
				expectedRows.set(legacyRecord.id, legacyRecord);
				importedCount += 1;
			}
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
	} catch (error) {
		warnings.push(`Failed migrating legacy commitments state: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		params.beforeVerify?.();
		const database = openOpenClawStateDatabase({ env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		const commitmentsDb = getNodeSqliteKysely(database.db);
		for (const expected of expectedRows.values()) {
			const row = executeSqliteQueryTakeFirstSync(database.db, commitmentsDb.selectFrom("commitments").selectAll().where("id", "=", expected.id));
			if (!row || !commitmentRecordsEqual(commitmentRecordFromRow(row), expected)) throw new Error(`SQLite verification failed for commitment ${expected.id}`);
		}
		assertLegacySourceUnchanged$1(params.detected.sourcePath, snapshot);
	} catch (error) {
		warnings.push(`Failed verifying legacy commitments migration: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		claimAndRemoveSource({
			sourcePath: params.detected.sourcePath,
			snapshot,
			beforeClaim: params.beforeClaim,
			removeSource: params.removeSource
		});
	} catch (error) {
		warnings.push(`Migrated commitments but could not remove legacy source ${params.detected.sourcePath}: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	if (importedCount > 0) changes.push(`Migrated ${importedCount} commitment(s) → shared SQLite state`);
	changes.push("Removed legacy commitments JSON after SQLite verification");
	if (newerSqliteCount > 0) notices.push(`Kept ${newerSqliteCount} newer shared SQLite commitment(s) over legacy JSON`);
	if (activeDuplicateCount > 0) notices.push(`Kept ${activeDuplicateCount} canonical active SQLite commitment(s) over legacy logical duplicates`);
	return notices.length > 0 ? {
		changes,
		warnings,
		notices
	} : {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.debug-proxy.ts
const DEBUG_PROXY_SQLITE_SIDECAR_SUFFIXES = [
	"",
	"-shm",
	"-wal",
	"-journal"
];
var LegacyDebugProxyBlobConflictError = class extends Error {
	constructor(blobId) {
		super(`legacy debug proxy blob conflicts with shared state: ${blobId}`);
		this.blobId = blobId;
	}
};
var LegacyDebugProxySessionConflictError = class extends Error {
	constructor(sessionId) {
		super(`legacy debug proxy session conflicts with shared state: ${sessionId}`);
		this.sessionId = sessionId;
	}
};
function fileExists$1(filePath) {
	try {
		return fs.statSync(filePath).isFile();
	} catch {
		return false;
	}
}
function dirExists(dirPath) {
	try {
		return fs.statSync(dirPath).isDirectory();
	} catch {
		return false;
	}
}
function resolveLegacyDebugProxyCapturePaths(stateDir) {
	const rootDir = path.join(stateDir, "debug-proxy");
	return {
		sourcePath: path.join(rootDir, "capture.sqlite"),
		blobDir: path.join(rootDir, "blobs")
	};
}
function hasPendingSqliteArchive(sourcePath) {
	return !fileExists$1(sourcePath) && fileExists$1(`${sourcePath}.migrated`) && DEBUG_PROXY_SQLITE_SIDECAR_SUFFIXES.some((suffix) => suffix !== "" && fileExists$1(`${sourcePath}${suffix}`));
}
function detectLegacyDebugProxyCaptureSidecar(stateDir, env = process.env) {
	const paths = resolveLegacyDebugProxyCapturePaths(stateDir);
	if (path.resolve(paths.sourcePath) === path.resolve(resolveOpenClawStateSqlitePath({
		...env,
		OPENCLAW_STATE_DIR: stateDir
	}))) return {
		...paths,
		hasLegacy: false
	};
	const hasArchivedDatabase = fileExists$1(`${paths.sourcePath}.migrated`);
	return {
		...paths,
		hasLegacy: fileExists$1(paths.sourcePath) || hasPendingSqliteArchive(paths.sourcePath) || hasArchivedDatabase && dirExists(paths.blobDir)
	};
}
function listSqliteColumns$1(db, table) {
	const rows = db.prepare(`PRAGMA table_info(${table})`).all();
	return new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
}
function assertTableColumns(db, table, expected) {
	const columns = listSqliteColumns$1(db, table);
	const missing = expected.filter((column) => !columns.has(column));
	if (missing.length > 0) throw new Error(`legacy ${table} table is missing ${missing.join(", ")}`);
}
function normalizeSqliteInteger(value) {
	return typeof value === "bigint" ? Number(value) : value;
}
function readLegacyDebugProxyCapture(params) {
	const db = new (requireNodeSqlite()).DatabaseSync(params.sourcePath, { readOnly: true });
	try {
		assertTableColumns(db, "capture_sessions", [
			"id",
			"started_at",
			"ended_at",
			"mode",
			"source_scope",
			"source_process",
			"proxy_url",
			"db_path",
			"blob_dir"
		]);
		assertTableColumns(db, "capture_events", [
			"session_id",
			"ts",
			"source_scope",
			"source_process",
			"protocol",
			"direction",
			"kind",
			"flow_id",
			"method",
			"host",
			"path",
			"status",
			"close_code",
			"content_type",
			"headers_json",
			"data_text",
			"data_blob_id",
			"data_sha256",
			"error_text",
			"meta_json"
		]);
		const sessions = db.prepare(`SELECT id, started_at, ended_at, mode, source_scope, source_process, proxy_url, blob_dir
         FROM capture_sessions
         ORDER BY started_at ASC, id ASC`).all();
		const events = db.prepare(`SELECT
           session_id, ts, source_scope, source_process, protocol, direction, kind, flow_id,
           method, host, path, status, close_code, content_type, headers_json, data_text,
           data_blob_id, data_sha256, error_text, meta_json
         FROM capture_events
         ORDER BY ts ASC, id ASC`).all();
		const sessionIds = new Set(sessions.map((session) => session.id));
		for (const event of events) {
			if (sessionIds.has(event.session_id)) continue;
			sessions.push({
				id: event.session_id,
				started_at: event.ts,
				ended_at: null,
				mode: "implicit",
				source_scope: event.source_scope,
				source_process: event.source_process,
				proxy_url: null,
				blob_dir: params.blobDir
			});
			sessionIds.add(event.session_id);
		}
		const blobEvents = /* @__PURE__ */ new Map();
		for (const event of events) {
			if (!event.data_blob_id) continue;
			const rows = blobEvents.get(event.data_blob_id) ?? [];
			rows.push(event);
			blobEvents.set(event.data_blob_id, rows);
		}
		const blobDirBySession = new Map(sessions.map((session) => [session.id, session.blob_dir]));
		const usedBlobDirs = /* @__PURE__ */ new Set();
		const blobs = [];
		for (const [blobId, referencingEvents] of blobEvents) {
			const candidateBlobDirs = [.../* @__PURE__ */ new Set([...referencingEvents.map((event) => blobDirBySession.get(event.session_id) ?? params.blobDir), params.blobDir])];
			const blobPath = candidateBlobDirs.map((blobDir) => path.join(blobDir, `${blobId}.bin.gz`)).find(fileExists$1) ?? path.join(candidateBlobDirs[0] ?? params.blobDir, `${blobId}.bin.gz`);
			const data = fs.readFileSync(blobPath);
			const raw = gunzipSync(data);
			const sha256 = sha256Hex(raw);
			if (sha256.slice(0, 24) !== blobId) throw new Error(`legacy debug proxy blob hash mismatch: ${blobPath}`);
			usedBlobDirs.add(path.dirname(blobPath));
			blobs.push({
				blobId,
				contentType: referencingEvents.find((event) => event.content_type)?.content_type ?? null,
				encoding: "gzip",
				sizeBytes: raw.byteLength,
				sha256,
				data,
				createdAt: Math.min(...referencingEvents.map((event) => normalizeSqliteInteger(event.ts) ?? 0))
			});
		}
		return {
			sessions,
			events,
			blobs,
			blobDirs: [...usedBlobDirs]
		};
	} finally {
		db.close();
	}
}
function eventValues(event) {
	return [
		event.session_id,
		normalizeSqliteInteger(event.ts),
		event.source_scope,
		event.source_process,
		event.protocol,
		event.direction,
		event.kind,
		event.flow_id,
		event.method,
		event.host,
		event.path,
		normalizeSqliteInteger(event.status),
		normalizeSqliteInteger(event.close_code),
		event.content_type,
		event.headers_json,
		event.data_text,
		event.data_blob_id,
		event.data_sha256,
		event.error_text,
		event.meta_json
	];
}
function eventKey(values) {
	return JSON.stringify(values);
}
function archiveLegacyDebugProxySqlite(params) {
	const existingSources = DEBUG_PROXY_SQLITE_SIDECAR_SUFFIXES.map((suffix) => `${params.sourcePath}${suffix}`).filter(fileExists$1);
	if (existingSources.length === 0) return;
	const resolutions = [];
	for (const sourcePath of existingSources) {
		const archivedPath = `${sourcePath}.migrated`;
		try {
			if (fileExists$1(archivedPath)) {
				if (fs.readFileSync(sourcePath).equals(fs.readFileSync(archivedPath))) {
					fs.rmSync(sourcePath, { force: true });
					resolutions.push({
						sourcePath,
						targetPath: archivedPath,
						removed: true
					});
					continue;
				}
				let index = 2;
				while (fs.existsSync(`${sourcePath}.migrated.${index}`)) index++;
				const nextArchivePath = `${sourcePath}.migrated.${index}`;
				fs.renameSync(sourcePath, nextArchivePath);
				resolutions.push({
					sourcePath,
					targetPath: nextArchivePath,
					removed: false
				});
				continue;
			}
			fs.renameSync(sourcePath, archivedPath);
			resolutions.push({
				sourcePath,
				targetPath: archivedPath,
				removed: false
			});
		} catch (err) {
			params.warnings.push(`Failed archiving debug proxy capture sidecar ${sourcePath}: ${String(err)}`);
			return;
		}
	}
	if (resolutions.every((resolution) => !resolution.removed && resolution.targetPath === `${resolution.sourcePath}.migrated`)) {
		params.changes.push(`Archived debug proxy capture sidecar legacy source → ${params.sourcePath}.migrated`);
		return;
	}
	for (const resolution of resolutions) params.changes.push(resolution.removed ? `Removed already-archived debug proxy capture sidecar legacy source ${resolution.sourcePath}` : `Archived debug proxy capture sidecar legacy source → ${resolution.targetPath}`);
}
function archiveLegacyDebugProxyBlobs(params) {
	if (!dirExists(params.blobDir)) return;
	const archivePath = `${params.blobDir}.migrated`;
	try {
		let targetPath = archivePath;
		if (dirExists(archivePath)) {
			let index = 2;
			while (fs.existsSync(`${params.blobDir}.migrated.${index}`)) index++;
			targetPath = `${params.blobDir}.migrated.${index}`;
		}
		fs.renameSync(params.blobDir, targetPath);
		params.changes.push(`Archived debug proxy capture blobs → ${targetPath}`);
	} catch (err) {
		params.warnings.push(`Failed archiving debug proxy capture blobs ${params.blobDir}: ${String(err)}`);
	}
}
function migrateLegacyDebugProxyCaptureSidecar(params) {
	const detected = params.detected ?? detectLegacyDebugProxyCaptureSidecar(params.stateDir);
	const changes = [];
	const warnings = [];
	if (!detected.hasLegacy) return {
		changes,
		warnings
	};
	if (!fileExists$1(detected.sourcePath)) {
		archiveLegacyDebugProxySqlite({
			sourcePath: detected.sourcePath,
			changes,
			warnings
		});
		if (fileExists$1(`${detected.sourcePath}.migrated`)) archiveLegacyDebugProxyBlobs({
			blobDir: detected.blobDir,
			changes,
			warnings
		});
		return {
			changes,
			warnings
		};
	}
	let legacy;
	try {
		legacy = readLegacyDebugProxyCapture(detected);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed reading debug proxy capture sidecar ${detected.sourcePath}: ${String(err)}`]
		};
	}
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const selectBlob = db.prepare(`SELECT encoding, size_bytes AS sizeBytes, sha256, data
           FROM capture_blobs
           WHERE blob_id = ?`);
			const insertBlob = db.prepare(`INSERT INTO capture_blobs (
            blob_id, content_type, encoding, size_bytes, sha256, data, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`);
			for (const blob of legacy.blobs) {
				const existing = selectBlob.get(blob.blobId);
				if (existing) {
					if (existing.encoding !== blob.encoding || Number(existing.sizeBytes) !== blob.sizeBytes || existing.sha256 !== blob.sha256 || !existing.data || !Buffer.from(existing.data).equals(blob.data)) throw new LegacyDebugProxyBlobConflictError(blob.blobId);
					continue;
				}
				insertBlob.run(blob.blobId, blob.contentType, blob.encoding, blob.sizeBytes, blob.sha256, blob.data, blob.createdAt);
			}
			const selectSession = db.prepare(`SELECT
            started_at AS startedAt,
            ended_at AS endedAt,
            mode,
            source_scope AS sourceScope,
            source_process AS sourceProcess,
            proxy_url AS proxyUrl
           FROM capture_sessions
           WHERE id = ?`);
			const insertSession = db.prepare(`INSERT INTO capture_sessions (
            id, started_at, ended_at, mode, source_scope, source_process, proxy_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`);
			for (const session of legacy.sessions) {
				const values = [
					session.id,
					normalizeSqliteInteger(session.started_at),
					normalizeSqliteInteger(session.ended_at),
					session.mode,
					session.source_scope,
					session.source_process,
					session.proxy_url
				];
				const existing = selectSession.get(session.id);
				if (existing) {
					const expected = {
						startedAt: values[1],
						endedAt: values[2],
						mode: values[3],
						sourceScope: values[4],
						sourceProcess: values[5],
						proxyUrl: values[6]
					};
					if (JSON.stringify(existing) !== JSON.stringify(expected)) throw new LegacyDebugProxySessionConflictError(session.id);
					continue;
				}
				insertSession.run(...values);
			}
			const existingEventCount = db.prepare(`SELECT COUNT(*) AS count
           FROM capture_events
           WHERE session_id IS ? AND ts IS ? AND source_scope IS ? AND source_process IS ?
             AND protocol IS ? AND direction IS ? AND kind IS ? AND flow_id IS ?
             AND method IS ? AND host IS ? AND path IS ? AND status IS ? AND close_code IS ?
             AND content_type IS ? AND headers_json IS ? AND data_text IS ? AND data_blob_id IS ?
             AND data_sha256 IS ? AND error_text IS ? AND meta_json IS ?
          `);
			const insertEvent = db.prepare(`INSERT INTO capture_events (
            session_id, ts, source_scope, source_process, protocol, direction, kind, flow_id,
            method, host, path, status, close_code, content_type, headers_json, data_text,
            data_blob_id, data_sha256, error_text, meta_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
			const existingCounts = /* @__PURE__ */ new Map();
			const seenCounts = /* @__PURE__ */ new Map();
			for (const event of legacy.events) {
				const values = eventValues(event);
				const key = eventKey(values);
				const seenCount = (seenCounts.get(key) ?? 0) + 1;
				seenCounts.set(key, seenCount);
				let existingCount = existingCounts.get(key);
				if (existingCount === void 0) {
					const row = existingEventCount.get(...values);
					existingCount = Number(row?.count ?? 0);
					existingCounts.set(key, existingCount);
				}
				if (seenCount > existingCount) insertEvent.run(...values);
			}
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		changes.push(`Migrated ${legacy.sessions.length} debug proxy capture ${legacy.sessions.length === 1 ? "session" : "sessions"}, ${legacy.events.length} ${legacy.events.length === 1 ? "event" : "events"}, and ${legacy.blobs.length} ${legacy.blobs.length === 1 ? "blob" : "blobs"} → shared SQLite state`);
	} catch (err) {
		const detail = err instanceof LegacyDebugProxyBlobConflictError ? `blob ${err.blobId} already exists with different data` : err instanceof LegacyDebugProxySessionConflictError ? `session ${err.sessionId} already exists with different data` : String(err);
		return {
			changes,
			warnings: [`Failed migrating debug proxy capture sidecar ${detected.sourcePath}: ${detail}`]
		};
	}
	archiveLegacyDebugProxySqlite({
		sourcePath: detected.sourcePath,
		changes,
		warnings
	});
	if (!fileExists$1(detected.sourcePath) && fileExists$1(`${detected.sourcePath}.migrated`)) {
		archiveLegacyDebugProxyBlobs({
			blobDir: detected.blobDir,
			changes,
			warnings
		});
		for (const blobDir of legacy.blobDirs) {
			if (path.resolve(blobDir) === path.resolve(detected.blobDir) || !dirExists(blobDir)) continue;
			warnings.push(`Left migrated debug proxy capture blobs in stored session directory: ${blobDir}`);
		}
	}
	return {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/device-identity-legacy.ts
function fingerprintPublicKey(publicKeyPem) {
	return createHash("sha256").update(deriveEd25519PublicKeyRaw(publicKeyPem)).digest("hex");
}
function isRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function isValidCreatedAtMs$1(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function normalizeLegacyCreatedAtMs(value) {
	return isValidCreatedAtMs$1(value) ? value : Date.now();
}
function normalizeLegacyKeyPair(params) {
	try {
		const publicKeyRaw = deriveEd25519PublicKeyRaw(params.publicKeyPem);
		const privateKeyRaw = deriveEd25519PrivateKeyRaw(params.privateKeyPem);
		const publicKeyPem = ed25519PublicKeyPemFromRaw(publicKeyRaw);
		const privateKeyPem = ed25519PrivateKeyPemFromRaw(privateKeyRaw);
		const normalized = {
			deviceId: fingerprintPublicKey(publicKeyPem),
			publicKeyPem,
			privateKeyPem,
			createdAtMs: params.createdAtMs
		};
		validateStoredDeviceIdentity(normalized);
		return normalized;
	} catch {
		return null;
	}
}
/** Normalize a retired Node PEM or Swift raw-key payload for Doctor import. */
function normalizeLegacyDeviceIdentity(value) {
	if (isRecord(value) && value.version === 1 && typeof value.deviceId === "string" && typeof value.publicKeyPem === "string" && typeof value.privateKeyPem === "string") return normalizeLegacyKeyPair({
		createdAtMs: normalizeLegacyCreatedAtMs(value.createdAtMs),
		privateKeyPem: value.privateKeyPem,
		publicKeyPem: value.publicKeyPem
	});
	if (isRecord(value) && !("version" in value) && typeof value.deviceId === "string" && typeof value.publicKey === "string" && typeof value.privateKey === "string") try {
		const publicKeyRaw = decodeCanonicalBase64OrBase64Url(value.publicKey);
		const privateKeyRaw = decodeCanonicalBase64OrBase64Url(value.privateKey);
		return normalizeLegacyKeyPair({
			createdAtMs: normalizeLegacyCreatedAtMs(value.createdAtMs),
			privateKeyPem: ed25519PrivateKeyPemFromRaw(privateKeyRaw),
			publicKeyPem: ed25519PublicKeyPemFromRaw(publicKeyRaw)
		});
	} catch {
		return null;
	}
	return null;
}
//#endregion
//#region src/infra/state-migrations.device-identity-repair.ts
const LEGACY_IDENTITY_RELATIVE_PATH = path.join("identity", "device.json");
const DOCTOR_CLAIM_SUFFIX$4 = ".doctor-importing";
const NATIVE_CLAIM_SUFFIX = ".native-importing";
const IDENTITY_KEY$1 = "primary";
function pathMayExist$2(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
/** Detect the exact retired paths and invalid canonical row only with Doctor authority. */
function detectLegacyDeviceIdentity(params) {
	const sourcePath = path.join(params.stateDir, LEGACY_IDENTITY_RELATIVE_PATH);
	const claimPath = `${sourcePath}${DOCTOR_CLAIM_SUFFIX$4}`;
	const nativeClaimPath = `${sourcePath}${NATIVE_CLAIM_SUFFIX}`;
	const doctorAuthorized = params.doctorOnlyStateMigrations === true;
	let hasInvalidCanonical = false;
	if (doctorAuthorized) try {
		readStoredDeviceIdentityReadOnly({
			env: {
				...params.env ?? process.env,
				OPENCLAW_STATE_DIR: params.stateDir
			},
			identityKey: IDENTITY_KEY$1
		});
	} catch (error) {
		hasInvalidCanonical = error instanceof DeviceIdentityStorageError;
	}
	return {
		sourcePath,
		claimPath,
		nativeClaimPath,
		hasLegacy: doctorAuthorized && (pathMayExist$2(claimPath) || pathMayExist$2(nativeClaimPath) || pathMayExist$2(sourcePath)),
		hasInvalidCanonical
	};
}
function hasLegacyDeviceIdentityPath(detected) {
	return pathMayExist$2(detected.claimPath) || pathMayExist$2(detected.nativeClaimPath) || pathMayExist$2(detected.sourcePath);
}
/** Generate a replacement only after the caller acquires Doctor's exclusive state lock. */
function repairInvalidCanonicalIdentity(env) {
	try {
		const result = repairInvalidStoredDeviceIdentity(generateStoredDeviceIdentity(), {
			env,
			identityKey: IDENTITY_KEY$1
		});
		if (!result.repaired) return {
			changes: [],
			warnings: []
		};
		if (!result.rotated) return {
			changes: ["Repaired invalid primary device identity metadata in SQLite."],
			warnings: []
		};
		return {
			changes: ["Replaced invalid primary device identity in SQLite."],
			warnings: [],
			notices: ["The repaired device has a new identity and must be approved again."]
		};
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed repairing invalid SQLite device identity: ${formatErrorMessage(error)}`]
		};
	}
}
//#endregion
//#region src/infra/state-migrations.device-identity.ts
const IDENTITY_KEY = "primary";
const MIGRATION_KIND$4 = "legacy-device-identity-json";
const MIGRATION_LOCK_TIMEOUT_MS$6 = 250;
const MIGRATION_LOCK_POLL_INTERVAL_MS$6 = 25;
const MAX_LEGACY_IDENTITY_BYTES = 128 * 1024;
const utf8Decoder$3 = new TextDecoder("utf-8", { fatal: true });
function isValidCreatedAtMs(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function deviceIdentityKeyMaterialMatches(left, right) {
	try {
		return deriveEd25519PublicKeyRaw(left.publicKeyPem).equals(deriveEd25519PublicKeyRaw(right.publicKeyPem)) && deriveEd25519PrivateKeyRaw(left.privateKeyPem).equals(deriveEd25519PrivateKeyRaw(right.privateKeyPem));
	} catch {
		return false;
	}
}
function relativeLegacyPath$5(stateDir, filePath) {
	const relativePath = path.relative(path.resolve(stateDir), path.resolve(filePath));
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) throw new Error("legacy device identity path is outside the state directory");
	return relativePath;
}
async function readLegacySourceSnapshot$7(params) {
	const opened = await params.stateRoot.read(relativeLegacyPath$5(params.stateDir, params.sourcePath), {
		hardlinks: "reject",
		maxBytes: MAX_LEGACY_IDENTITY_BYTES,
		symlinks: "reject"
	});
	if (opened.stat.size !== opened.buffer.byteLength) throw new Error("legacy device identity changed while it was being read");
	const identity = normalizeLegacyDeviceIdentity(JSON.parse(utf8Decoder$3.decode(opened.buffer)));
	if (!identity) throw new Error("legacy device identity is invalid or unsupported");
	return {
		sourcePath: params.sourcePath,
		dev: opened.stat.dev,
		ino: opened.stat.ino,
		mtimeMs: opened.stat.mtimeMs,
		sha256: createHash("sha256").update(opened.buffer).digest("hex"),
		size: opened.stat.size,
		identity
	};
}
function snapshotsMatch$3(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mtimeMs === right.mtimeMs && left.sha256 === right.sha256 && left.size === right.size;
}
function receiptSourceKey$2(sourcePath) {
	return `device-identity-json:${createHash("sha256").update(path.resolve(sourcePath)).digest("hex")}`;
}
function readMigrationReceipt$1(sourcePath, env) {
	const sourceKey = receiptSourceKey$2(sourcePath);
	const { db } = openOpenClawStateDatabase({ env });
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("migration_sources").select(["removed_source", "source_sha256"]).where("source_key", "=", sourceKey));
	return row ? {
		sourceKey,
		sourceSha256: row.source_sha256,
		removedSource: row.removed_source === 1
	} : null;
}
function classifyCanonicalRow(row, identity) {
	if (!isValidCreatedAtMs(row.updated_at_ms)) return "invalid";
	try {
		validateStoredDeviceIdentity({
			deviceId: row.device_id,
			publicKeyPem: row.public_key_pem,
			privateKeyPem: row.private_key_pem,
			createdAtMs: row.created_at_ms
		}, row.identity_key);
	} catch {
		return "invalid";
	}
	return row.identity_key === IDENTITY_KEY && row.device_id === identity.deviceId && deviceIdentityKeyMaterialMatches({
		deviceId: row.device_id,
		publicKeyPem: row.public_key_pem,
		privateKeyPem: row.private_key_pem
	}, identity) ? "same" : "different";
}
function readCanonicalIdentity(db) {
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("device_identities").selectAll().where("identity_key", "=", IDENTITY_KEY));
}
function verifyCanonicalIdentity(identity, env) {
	const { db } = openOpenClawStateDatabase({ env });
	const row = readCanonicalIdentity(db);
	if (!row || classifyCanonicalRow(row, identity) !== "same") throw new Error("canonical SQLite device identity no longer matches the legacy source");
}
function importAndRecordReceipt$2(params) {
	const sourceKey = receiptSourceKey$2(params.sourcePath);
	const runId = `${sourceKey}:${params.snapshot.sha256.slice(0, 16)}`;
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const existingReceipt = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("migration_sources").select("source_sha256").where("source_key", "=", sourceKey));
		if (existingReceipt) {
			if (existingReceipt.source_sha256 !== params.snapshot.sha256) throw new Error("migration receipt belongs to different device identity bytes");
			const existing = readCanonicalIdentity(db);
			if (!existing || classifyCanonicalRow(existing, params.snapshot.identity) !== "same") throw new Error("migration receipt does not match the canonical device identity");
			return {
				sourceKey,
				imported: false
			};
		}
		const existing = readCanonicalIdentity(db);
		const existingState = existing ? classifyCanonicalRow(existing, params.snapshot.identity) : void 0;
		if (existingState === "different") throw new Error("canonical SQLite device identity differs from the legacy identity");
		const imported = !existing || existingState === "invalid";
		const repaired = existingState === "invalid";
		if (!existing) executeSqliteQuerySync(db, stateDb.insertInto("device_identities").values({
			identity_key: IDENTITY_KEY,
			device_id: params.snapshot.identity.deviceId,
			public_key_pem: params.snapshot.identity.publicKeyPem,
			private_key_pem: params.snapshot.identity.privateKeyPem,
			created_at_ms: params.snapshot.identity.createdAtMs,
			updated_at_ms: now
		}));
		else if (repaired) executeSqliteQuerySync(db, stateDb.updateTable("device_identities").set({
			device_id: params.snapshot.identity.deviceId,
			public_key_pem: params.snapshot.identity.publicKeyPem,
			private_key_pem: params.snapshot.identity.privateKeyPem,
			created_at_ms: params.snapshot.identity.createdAtMs,
			updated_at_ms: now
		}).where("identity_key", "=", IDENTITY_KEY));
		const verified = readCanonicalIdentity(db);
		if (!verified || classifyCanonicalRow(verified, params.snapshot.identity) !== "same") throw new Error("SQLite verification failed for the primary device identity");
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND$4,
			target: "device_identities",
			identityKey: IDENTITY_KEY,
			deviceId: params.snapshot.identity.deviceId,
			sourceSha256: params.snapshot.sha256,
			importedRecordCount: imported ? 1 : 0,
			preservedSqliteRecordCount: existing ? 1 : 0,
			repairedSqliteRecordCount: repaired ? 1 : 0
		});
		executeSqliteQuerySync(db, stateDb.insertInto("migration_runs").values({
			id: runId,
			started_at: now,
			finished_at: now,
			status: "completed",
			report_json: reportJson
		}));
		executeSqliteQuerySync(db, stateDb.insertInto("migration_sources").values({
			source_key: sourceKey,
			migration_kind: MIGRATION_KIND$4,
			source_path: params.sourcePath,
			target_table: "device_identities",
			source_sha256: params.snapshot.sha256,
			source_size_bytes: params.snapshot.size,
			source_record_count: 1,
			last_run_id: runId,
			status: "completed",
			imported_at: now,
			removed_source: 0,
			report_json: reportJson
		}));
		return {
			sourceKey,
			imported
		};
	}, { env: params.env });
}
function markSourceRemoved$3(sourceKey, env) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("migration_sources").set({ removed_source: 1 }).where("source_key", "=", sourceKey));
	}, { env });
}
async function removePath$1(params) {
	if (params.removeSource) {
		await params.removeSource(params.sourcePath);
		return;
	}
	await params.stateRoot.remove(relativeLegacyPath$5(params.stateDir, params.sourcePath));
}
async function restoreClaim$5(params) {
	try {
		if (!await params.stateRoot.exists(relativeLegacyPath$5(params.stateDir, params.claimPath))) return null;
		if (await params.stateRoot.exists(relativeLegacyPath$5(params.stateDir, params.sourcePath))) return `source path already exists: ${params.sourcePath}`;
		await params.stateRoot.move(relativeLegacyPath$5(params.stateDir, params.claimPath), relativeLegacyPath$5(params.stateDir, params.sourcePath));
		return null;
	} catch (error) {
		return String(error);
	}
}
async function cleanupReceiptSources(params) {
	if (await params.stateRoot.exists(relativeLegacyPath$5(params.stateDir, params.detected.nativeClaimPath))) return {
		changes: [],
		warnings: ["Native device identity import is pending; restart the native app before running Doctor cleanup."]
	};
	const changes = [];
	const warnings = [];
	let removed = 0;
	for (const candidate of [params.detected.sourcePath, params.detected.claimPath]) {
		if (!await params.stateRoot.exists(relativeLegacyPath$5(params.stateDir, candidate))) continue;
		let snapshot;
		try {
			snapshot = await readLegacySourceSnapshot$7({
				stateRoot: params.stateRoot,
				stateDir: params.stateDir,
				sourcePath: candidate
			});
		} catch (error) {
			warnings.push(`Retired device identity cleanup refused ${candidate}: ${String(error)}`);
			continue;
		}
		if (snapshot.sha256 !== params.receipt.sourceSha256) {
			warnings.push(`Retired device identity cleanup preserved ${candidate}: bytes differ from the migration receipt.`);
			continue;
		}
		try {
			verifyCanonicalIdentity(snapshot.identity, params.env);
			await removePath$1({
				...params,
				sourcePath: candidate
			});
			removed += 1;
		} catch (error) {
			warnings.push(`Retired device identity cleanup failed for ${candidate}: ${String(error)}`);
		}
	}
	if (warnings.length === 0 && (!params.receipt.removedSource || removed > 0)) markSourceRemoved$3(params.receipt.sourceKey, params.env);
	if (removed > 0) changes.push("Removed retired device identity JSON covered by its SQLite receipt.");
	return {
		changes,
		warnings
	};
}
async function migrateWithExclusiveStateOwnership$4(params) {
	const receipt = readMigrationReceipt$1(params.detected.sourcePath, params.env);
	if (receipt) return await cleanupReceiptSources({
		...params,
		receipt
	});
	if (await params.stateRoot.exists(relativeLegacyPath$5(params.stateDir, params.detected.nativeClaimPath))) return {
		changes: [],
		warnings: ["Native device identity import is pending; restart the native app before running Doctor."]
	};
	const hasSource = await params.stateRoot.exists(relativeLegacyPath$5(params.stateDir, params.detected.sourcePath));
	const hasClaim = await params.stateRoot.exists(relativeLegacyPath$5(params.stateDir, params.detected.claimPath));
	if (hasSource && hasClaim) return {
		changes: [],
		warnings: ["Failed migrating legacy device identity: source and interrupted claim both exist."]
	};
	const activePath = hasSource ? params.detected.sourcePath : hasClaim ? params.detected.claimPath : null;
	if (!activePath) return {
		changes: [],
		warnings: []
	};
	let snapshot;
	try {
		snapshot = await readLegacySourceSnapshot$7({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath: activePath
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed reading legacy device identity: ${String(error)}`]
		};
	}
	if (activePath === params.detected.sourcePath) try {
		params.beforeClaim?.(params.detected.sourcePath);
		await params.stateRoot.move(relativeLegacyPath$5(params.stateDir, params.detected.sourcePath), relativeLegacyPath$5(params.stateDir, params.detected.claimPath));
		const claimed = await readLegacySourceSnapshot$7({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath: params.detected.claimPath
		});
		if (!snapshotsMatch$3(snapshot, claimed)) throw new Error("legacy device identity changed before Doctor could claim it");
		snapshot = claimed;
	} catch (error) {
		const restoreError = await restoreClaim$5({
			...params,
			...params.detected
		});
		return {
			changes: [],
			warnings: [`Failed migrating legacy device identity: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	let result;
	try {
		result = importAndRecordReceipt$2({
			env: params.env,
			sourcePath: params.detected.sourcePath,
			snapshot
		});
	} catch (error) {
		const restoreError = await restoreClaim$5({
			...params,
			...params.detected
		});
		return {
			changes: [],
			warnings: [`Failed migrating legacy device identity: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	try {
		params.beforeCleanup?.();
		if (await params.stateRoot.exists(relativeLegacyPath$5(params.stateDir, params.detected.sourcePath))) throw new Error("legacy device identity source reappeared during import");
		const finalSnapshot = await readLegacySourceSnapshot$7({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath: params.detected.claimPath
		});
		if (!snapshotsMatch$3(snapshot, finalSnapshot)) throw new Error("legacy device identity claim changed after SQLite import");
		verifyCanonicalIdentity(finalSnapshot.identity, params.env);
		await removePath$1({
			...params,
			sourcePath: params.detected.claimPath
		});
		if (await params.stateRoot.exists(relativeLegacyPath$5(params.stateDir, params.detected.claimPath))) throw new Error("legacy device identity Doctor claim remains after cleanup");
		markSourceRemoved$3(result.sourceKey, params.env);
	} catch (error) {
		return {
			changes: [],
			warnings: [`Device identity is in SQLite, but legacy cleanup failed: ${String(error)}`]
		};
	}
	return {
		changes: [result.imported ? "Migrated primary device identity to SQLite." : "Preserved identical primary device identity already in SQLite."],
		warnings: [],
		notices: ["Removed retired device identity JSON after verified SQLite import."]
	};
}
/** Import the retired primary identity while excluding Gateways that can recreate it. */
async function migrateLegacyDeviceIdentity(params) {
	if (!params.detected.hasLegacy && !params.detected.hasInvalidCanonical) return {
		changes: [],
		warnings: []
	};
	if (params.doctorOnlyStateMigrations !== true) return {
		changes: [],
		warnings: []
	};
	const env = {
		...params.env ?? process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env,
			pollIntervalMs: MIGRATION_LOCK_POLL_INTERVAL_MS$6,
			role: "sqlite-maintenance",
			timeoutMs: MIGRATION_LOCK_TIMEOUT_MS$6
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed migrating legacy device identity: ${error instanceof GatewayLockError ? "the Gateway or another SQLite maintenance command owns this state directory" : String(error)}. Stop the Gateway and run \`openclaw doctor --fix\` again.`]
		};
	}
	if (!lock) return {
		changes: [],
		warnings: ["Failed migrating legacy device identity: exclusive state ownership unavailable."]
	};
	let result = {
		changes: [],
		warnings: []
	};
	let releaseError;
	let identityCoordinator;
	try {
		try {
			identityCoordinator = acquireDeviceIdentityCoordinator({ databasePath: resolveDeviceIdentityStore({
				env,
				identityKey: IDENTITY_KEY
			}).databasePath });
		} catch (error) {
			result.warnings.push(`Failed migrating legacy device identity: identity state is busy (${formatErrorMessage(error)}).`);
		}
		if (identityCoordinator) try {
			if (hasLegacyDeviceIdentityPath(params.detected)) {
				const stateRoot = await root(params.stateDir, {
					hardlinks: "reject",
					maxBytes: MAX_LEGACY_IDENTITY_BYTES,
					symlinks: "reject"
				});
				result = await migrateWithExclusiveStateOwnership$4({
					...params,
					env,
					stateRoot
				});
			} else if (params.detected.hasInvalidCanonical) result = repairInvalidCanonicalIdentity(env);
		} catch (error) {
			result.warnings.push(`Failed reading legacy device identity state: ${String(error)}`);
		}
	} finally {
		try {
			identityCoordinator?.release();
		} catch (error) {
			releaseError = error;
		}
		try {
			await lock.release();
		} catch (error) {
			releaseError ??= error;
		}
	}
	if (releaseError) result.warnings.push(`Device identity migration lock release failed: ${formatErrorMessage(releaseError)}`);
	return result;
}
//#endregion
//#region src/infra/state-migrations.fs.ts
/** Reads directory entries or returns an empty list when the directory is missing/unreadable. */
function safeReadDir(dir) {
	try {
		return fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return [];
	}
}
/** Returns whether a path exists and resolves to a directory. */
function existsDir(dir) {
	try {
		return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
	} catch {
		return false;
	}
}
/** Creates a directory tree for migration targets. */
function ensureMigrationDir(dir) {
	fs.mkdirSync(dir, { recursive: true });
}
/** Returns whether a path exists and resolves to a regular file. */
function fileExists(p) {
	try {
		return fs.existsSync(p) && fs.statSync(p).isFile();
	} catch {
		return false;
	}
}
/** Reads a session store from disk, accepting JSON first and JSON5 as legacy/operator input. */
function readSessionStoreJson5(storePath) {
	try {
		return parseSessionStoreJson5(fs.readFileSync(storePath, "utf-8"));
	} catch {}
	return {
		store: {},
		ok: false
	};
}
/** Parses session-store text, preferring strict JSON before JSON5 compatibility. */
function parseSessionStoreJson5(raw) {
	try {
		const parsed = parseJsonWithJson5Fallback(raw);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return {
			store: parsed,
			ok: true
		};
	} catch {}
	return {
		store: {},
		ok: false
	};
}
//#endregion
//#region src/infra/state-migrations.session-surfaces.ts
let cachedLegacySessionSurfaces = null;
function getLegacySessionSurfaces() {
	cachedLegacySessionSurfaces ??= [...listBundledChannelLegacySessionSurfaces()];
	return cachedLegacySessionSurfaces;
}
function isSurfaceGroupKey(key) {
	return key.includes(":group:") || key.includes(":channel:");
}
function isLegacyGroupKey(key) {
	const trimmed = key.trim();
	if (!trimmed) return false;
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	if (lower.startsWith("group:") || lower.startsWith("channel:")) return true;
	for (const surface of getLegacySessionSurfaces()) if (surface.isLegacyGroupSessionKey?.(trimmed)) return true;
	return false;
}
function resetLegacySessionSurfacesForTest() {
	cachedLegacySessionSurfaces = null;
}
//#endregion
//#region src/infra/state-migrations.session-store.ts
function isLegacyDefaultMainAliasKey(key, mainKey) {
	const lower = normalizeLowercaseStringOrEmpty(key.trim());
	const canonicalMainKey = normalizeMainKey(mainKey);
	return lower === `agent:main:main` || lower === `agent:main:${canonicalMainKey}`;
}
function resolveCanonicalAgentSessionOwner(key) {
	const parsed = parseAgentSessionKey(key);
	if (parsed === null || !isValidAgentId(parsed.agentId) || normalizeAgentId(parsed.agentId) !== parsed.agentId) return;
	return parsed.agentId;
}
function canonicalizeSessionKeyForAgent(params) {
	const raw = params.key.trim();
	if (!raw) return raw;
	const rawLower = normalizeLowercaseStringOrEmpty(raw);
	const legacyDefaultMainAlias = isLegacyDefaultMainAliasKey(rawLower, params.mainKey);
	const configuredAgentId = normalizeAgentId(params.agentId);
	const canonicalRowOwner = resolveCanonicalAgentSessionOwner(raw);
	const candidateOwner = params.preserveCanonicalAgentOwner ? canonicalRowOwner : void 0;
	const agentId = (candidateOwner === "main" && configuredAgentId !== "main" && legacyDefaultMainAlias ? void 0 : candidateOwner) ?? configuredAgentId;
	const normalized = normalizeSessionKeyPreservingOpaquePeerIds(raw);
	if (rawLower === "global" || rawLower === "unknown") return rawLower;
	if (params.preserveForeignMainAliases && legacyDefaultMainAlias) return params.key;
	const canonicalMain = canonicalizeMainSessionAlias({
		cfg: { session: {
			scope: params.scope,
			mainKey: params.mainKey
		} },
		agentId,
		sessionKey: normalized
	});
	if (params.scope === "global" && canonicalMain === "global") return canonicalMain;
	if (params.preserveAmbiguousKeys && (!canonicalRowOwner || legacyDefaultMainAlias)) return params.key;
	if (params.skipCrossAgentRemap) {
		const parsed = parseAgentSessionKey(raw);
		if (parsed && normalizeAgentId(parsed.agentId) !== agentId) return normalized;
		if (agentId !== "main" && (rawLower === "main" || rawLower === params.mainKey)) return rawLower;
	}
	if (canonicalMain !== normalized) return normalizeLowercaseStringOrEmpty(canonicalMain);
	const defaultPrefix = `agent:${DEFAULT_AGENT_ID}:`;
	if (rawLower.startsWith(defaultPrefix) && agentId !== "main" && !params.skipCrossAgentRemap) {
		const rest = rawLower.slice(defaultPrefix.length);
		if (rest === "main" || rest === params.mainKey) {
			const remapped = `agent:${agentId}:${rest}`;
			return normalizeLowercaseStringOrEmpty(canonicalizeMainSessionAlias({
				cfg: { session: {
					scope: params.scope,
					mainKey: params.mainKey
				} },
				agentId,
				sessionKey: remapped
			}));
		}
	}
	if (rawLower.startsWith("agent:") && canonicalRowOwner) return normalized;
	if (rawLower.startsWith("subagent:")) return normalizeLowercaseStringOrEmpty(`agent:${agentId}:subagent:${raw.slice(9)}`);
	for (const surface of getLegacySessionSurfaces()) {
		const canonicalized = surface.canonicalizeLegacySessionKey?.({
			key: raw,
			agentId
		});
		const normalizedCanonicalized = normalizeSessionKeyPreservingOpaquePeerIds(canonicalized);
		if (normalizedCanonicalized) return normalizedCanonicalized;
	}
	if (rawLower.startsWith("group:") || rawLower.startsWith("channel:")) return normalizeLowercaseStringOrEmpty(`agent:${agentId}:unknown:${raw}`);
	if (isSurfaceGroupKey(raw)) return `agent:${agentId}:${normalized}`;
	return normalizeSessionKeyPreservingOpaquePeerIds(`agent:${agentId}:${raw}`);
}
function pickLatestLegacyDirectEntry(store) {
	let best = null;
	let bestUpdated = -1;
	for (const [key, entry] of Object.entries(store)) {
		if (!entry || typeof entry !== "object") continue;
		const normalized = key.trim();
		if (!normalized) continue;
		const normalizedLower = normalizeLowercaseStringOrEmpty(normalized);
		if (normalizedLower === "global") continue;
		if (normalizedLower.startsWith("agent:")) continue;
		if (normalizedLower.startsWith("subagent:")) continue;
		if (isLegacyGroupKey(normalized) || isSurfaceGroupKey(normalized)) continue;
		const updatedAt = typeof entry.updatedAt === "number" ? entry.updatedAt : 0;
		if (updatedAt > bestUpdated) {
			bestUpdated = updatedAt;
			best = entry;
		}
	}
	return best;
}
function normalizeSessionEntry(entry) {
	const shaped = normalizePersistedSessionEntryShape(entry);
	if (!shaped) return null;
	const normalized = { ...shaped };
	if (typeof normalized.sessionId === "string") normalized.updatedAt = typeof normalized.updatedAt === "number" && Number.isFinite(normalized.updatedAt) ? normalized.updatedAt : Date.now();
	const rec = normalized;
	if (typeof rec.groupChannel !== "string" && typeof rec.room === "string") rec.groupChannel = rec.room;
	delete rec.room;
	return normalized;
}
function resolveUpdatedAt(entry) {
	return typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt) ? entry.updatedAt : 0;
}
function mergeSessionEntry(params) {
	if (!params.existing) return params.incoming;
	const existingUpdated = resolveUpdatedAt(params.existing);
	const incomingUpdated = resolveUpdatedAt(params.incoming);
	if (incomingUpdated > existingUpdated) return params.incoming;
	if (incomingUpdated < existingUpdated) return params.existing;
	return params.preferIncomingOnTie ? params.incoming : params.existing;
}
function canonicalizeSessionStore(params) {
	const canonical = Object.create(null);
	const meta = /* @__PURE__ */ new Map();
	const legacyKeys = [];
	for (const [key, entry] of Object.entries(params.store)) {
		if (!entry || typeof entry !== "object") continue;
		const canonicalKey = canonicalizeSessionKeyForAgent({
			key,
			agentId: params.agentId,
			mainKey: params.mainKey,
			scope: params.scope,
			skipCrossAgentRemap: params.skipCrossAgentRemap,
			preserveCanonicalAgentOwner: params.preserveCanonicalAgentOwner,
			preserveAmbiguousKeys: params.preserveAmbiguousKeys,
			preserveForeignMainAliases: params.preserveForeignMainAliases
		});
		const isCanonical = canonicalKey === key;
		if (!isCanonical) legacyKeys.push(key);
		const existing = canonical[canonicalKey];
		if (!existing) {
			canonical[canonicalKey] = entry;
			meta.set(canonicalKey, {
				isCanonical,
				updatedAt: resolveUpdatedAt(entry)
			});
			continue;
		}
		const existingMeta = meta.get(canonicalKey);
		const incomingUpdated = resolveUpdatedAt(entry);
		const existingUpdated = existingMeta?.updatedAt ?? resolveUpdatedAt(existing);
		if (incomingUpdated > existingUpdated) {
			canonical[canonicalKey] = entry;
			meta.set(canonicalKey, {
				isCanonical,
				updatedAt: incomingUpdated
			});
			continue;
		}
		if (incomingUpdated < existingUpdated) continue;
		if (existingMeta?.isCanonical && !isCanonical) continue;
		if (!existingMeta?.isCanonical && isCanonical) {
			canonical[canonicalKey] = entry;
			meta.set(canonicalKey, {
				isCanonical,
				updatedAt: incomingUpdated
			});
			continue;
		}
	}
	return {
		store: canonical,
		legacyKeys
	};
}
function isAmbiguousSharedStoreKey(key, mainKey, scope) {
	const raw = key.trim();
	const lower = normalizeLowercaseStringOrEmpty(raw);
	if (!raw || lower === "global" || lower === "unknown") return false;
	if (scope === "global" && canonicalizeMainSessionAlias({
		cfg: { session: {
			scope,
			mainKey
		} },
		agentId: "main",
		sessionKey: lower
	}) === "global") return false;
	return !resolveCanonicalAgentSessionOwner(raw) || isLegacyDefaultMainAliasKey(lower, mainKey);
}
function aliasedSessionStoreMigrationWarning(params) {
	return `Deferred ${params.subject} ${params.count} ambiguous session key(s) in aliased store ${params.storePath}; remove filesystem aliases or configure one canonical session.store path, then rerun openclaw doctor --fix`;
}
function unresolvedSessionStoreIdentityWarning(subject, storePath) {
	return `Deferred ${subject} for ${storePath}; filesystem identity could not be established for every configured store path. Restore path access or configure one canonical session.store path, then rerun openclaw doctor --fix`;
}
function distinctSessionStoreAliasWarning(subject, storePath) {
	return `Deferred ${subject} in aliased store ${storePath}; atomic replacement cannot update distinct filesystem aliases as one operation. Remove filesystem aliases or configure one canonical session.store path, then rerun openclaw doctor --fix`;
}
function resolveStaleLegacySessionFile(params) {
	if (!params.entry || typeof params.entry !== "object" || Array.isArray(params.entry)) return;
	const entry = params.entry;
	const rawSessionFile = entry.sessionFile;
	if (typeof rawSessionFile !== "string") return;
	const legacySessionFile = path.isAbsolute(rawSessionFile) ? path.resolve(rawSessionFile) : path.resolve(params.legacyDir, rawSessionFile);
	const relative = path.relative(path.resolve(params.legacyDir), legacySessionFile);
	if (relative.startsWith("..") || path.isAbsolute(relative) || fileExists(legacySessionFile)) return;
	if (safeReadDir(path.dirname(params.legacyDir)).some((dirent) => dirent.isDirectory() && dirent.name.startsWith(`${path.basename(params.legacyDir)}.legacy-`) && fileExists(path.join(path.dirname(params.legacyDir), dirent.name, path.basename(legacySessionFile))))) return;
	const parsed = path.parse(path.basename(legacySessionFile));
	if (safeReadDir(params.targetDir).some((dirent) => dirent.isFile() && dirent.name.startsWith(`${parsed.name}.legacy-`) && dirent.name.endsWith(parsed.ext))) return;
	const targetSessionFile = path.join(params.targetDir, path.basename(legacySessionFile));
	if (!fileExists(targetSessionFile) || typeof entry.sessionId !== "string") return;
	const readFirstLine = () => {
		const fd = fs.openSync(targetSessionFile, "r");
		try {
			const buffer = Buffer.alloc(8192);
			const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0);
			if (bytesRead <= 0) return;
			const chunk = buffer.subarray(0, bytesRead).toString("utf8");
			const newline = chunk.indexOf("\n");
			return newline >= 0 ? chunk.slice(0, newline) : chunk;
		} finally {
			fs.closeSync(fd);
		}
	};
	try {
		const firstLine = readFirstLine();
		const header = firstLine ? JSON.parse(firstLine) : void 0;
		if (!header || typeof header !== "object" || Array.isArray(header)) return;
		if (header.type === "session") return header.id === entry.sessionId ? targetSessionFile : void 0;
		return (path.basename(entry.sessionId) === entry.sessionId ? `${entry.sessionId}.jsonl` : void 0) === path.basename(targetSessionFile) ? targetSessionFile : void 0;
	} catch {
		return;
	}
}
function skipJson5Trivia(raw, index) {
	let i = index;
	while (i < raw.length) {
		const ch = raw[i];
		if (ch === " " || ch === "\n" || ch === "\r" || ch === "	") {
			i++;
			continue;
		}
		if (ch === "/" && raw[i + 1] === "/") {
			i += 2;
			while (i < raw.length && raw[i] !== "\n") i++;
			continue;
		}
		if (ch === "/" && raw[i + 1] === "*") {
			i += 2;
			while (i < raw.length && !(raw[i] === "*" && raw[i + 1] === "/")) i++;
			return i < raw.length ? i + 2 : i;
		}
		break;
	}
	return i;
}
function readJson5String(raw, index) {
	const quote = raw[index];
	if (quote !== "\"" && quote !== "'") return null;
	let i = index + 1;
	let value = "";
	while (i < raw.length) {
		const ch = raw[i];
		if (ch === quote) return {
			value,
			next: i + 1
		};
		if (ch === "\\") return null;
		value += ch;
		i++;
	}
	return null;
}
function readJson5BareKey(raw, index) {
	let i = index;
	while (i < raw.length) {
		const ch = raw[i];
		if (ch === ":" || ch === " " || ch === "\n" || ch === "\r" || ch === "	" || ch === "," || ch === "}" || ch === "{" || ch === "[" || ch === "]") break;
		i++;
	}
	if (i === index) return null;
	return {
		value: raw.slice(index, i),
		next: i
	};
}
function listTopLevelSessionStoreKeys(raw) {
	let i = skipJson5Trivia(raw, 0);
	if (raw[i] !== "{") return null;
	i++;
	const keys = [];
	let depth = 1;
	let expectingKey = true;
	while (i < raw.length) {
		i = skipJson5Trivia(raw, i);
		const ch = raw[i];
		if (ch === void 0) return null;
		if (depth === 1 && ch === "}") return keys;
		if (depth === 1 && expectingKey) {
			const key = ch === "\"" || ch === "'" ? readJson5String(raw, i) : readJson5BareKey(raw, i);
			if (!key) return null;
			i = skipJson5Trivia(raw, key.next);
			if (raw[i] !== ":") return null;
			keys.push(key.value);
			i++;
			expectingKey = false;
			continue;
		}
		if (ch === "\"" || ch === "'") {
			const str = readJson5String(raw, i);
			if (!str) return null;
			i = str.next;
			continue;
		}
		if (ch === "{" || ch === "[") {
			depth++;
			i++;
			continue;
		}
		if (ch === "}" || ch === "]") {
			depth--;
			i++;
			if (depth < 1) return keys;
			continue;
		}
		if (depth === 1 && ch === ",") {
			expectingKey = true;
			i++;
			continue;
		}
		i++;
	}
	return null;
}
function sessionStoreTextMayNeedCanonicalization(params) {
	const keys = listTopLevelSessionStoreKeys(params.raw);
	if (!keys) return true;
	const storeAgentIds = new Set([...params.storeAgentIds].map((id) => normalizeAgentId(id)));
	const hasNonMainAgent = [...storeAgentIds].some((id) => id !== DEFAULT_AGENT_ID);
	for (const key of keys) {
		const rawKey = key.trim();
		if (rawKey !== key) return true;
		if (!rawKey) continue;
		const lowerKey = normalizeLowercaseStringOrEmpty(rawKey);
		if (lowerKey !== rawKey) return true;
		if (lowerKey === "global" || lowerKey === "unknown") continue;
		if (params.preserveForeignMainAliases && isLegacyDefaultMainAliasKey(lowerKey, params.mainKey)) return true;
		if (lowerKey === "main" || lowerKey === params.mainKey) return true;
		if (lowerKey.startsWith("subagent:")) return true;
		if (lowerKey.startsWith("group:") || lowerKey.startsWith("channel:")) return true;
		if (!lowerKey.startsWith("agent:")) return true;
		const rowOwner = resolveCanonicalAgentSessionOwner(rawKey);
		if (!rowOwner) return true;
		const agentMainAlias = `agent:${rowOwner}:${DEFAULT_MAIN_KEY}`;
		const agentMainKey = `agent:${rowOwner}:${params.mainKey}`;
		if (lowerKey === agentMainAlias && (params.mainKey !== "main" || params.scope === "global")) return true;
		if (lowerKey === agentMainKey && params.scope === "global") return true;
		if (lowerKey === `agent:main:main` && (params.mainKey !== "main" || hasNonMainAgent || params.scope === "global")) return true;
		if (lowerKey === `agent:main:${params.mainKey}` && hasNonMainAgent && !storeAgentIds.has("main")) return true;
	}
	return false;
}
function listLegacySessionKeys(params) {
	const legacy = [];
	for (const key of Object.keys(params.store)) if (canonicalizeSessionKeyForAgent({
		key,
		agentId: params.agentId,
		mainKey: params.mainKey,
		scope: params.scope,
		skipCrossAgentRemap: params.preserveAmbiguousKeys,
		preserveCanonicalAgentOwner: params.preserveAmbiguousKeys,
		preserveAmbiguousKeys: params.preserveAmbiguousKeys,
		preserveForeignMainAliases: params.preserveForeignMainAliases
	}) !== key) legacy.push(key);
	return legacy;
}
function emptyDirOrMissing(dir) {
	if (!existsDir(dir)) return true;
	return safeReadDir(dir).length === 0;
}
function removeDirIfEmpty(dir) {
	if (!existsDir(dir)) return;
	if (!emptyDirOrMissing(dir)) return;
	try {
		fs.rmdirSync(dir);
	} catch {}
}
async function migrateOrphanedSessionKeys(params) {
	const changes = [];
	const warnings = [];
	const env = params.env ?? process.env;
	const stateDir = resolveStateDir(env);
	const mainKey = normalizeMainKey(params.cfg.session?.mainKey);
	const scope = params.cfg.session?.scope;
	const storeConfig = params.cfg.session?.store;
	const pluginAgentIds = params.additionalAgentIds ?? listPluginDoctorSessionStoreAgentIds({
		config: params.cfg,
		env,
		pluginIds: collectRelevantDoctorPluginIds(params.cfg)
	});
	const pluginAgentIdSet = new Set(pluginAgentIds.map((id) => normalizeAgentId(id)));
	const storeMap = /* @__PURE__ */ new Map();
	const storeAliasCandidates = /* @__PURE__ */ new Map();
	const addToStoreMap = (p, id) => {
		const storePath = [...storeMap.keys()].find((candidate) => sessionStorePathsMatch(candidate, p)) ?? p;
		const aliasCandidates = storeAliasCandidates.get(storePath) ?? /* @__PURE__ */ new Set([storePath]);
		aliasCandidates.add(p);
		storeAliasCandidates.set(storePath, aliasCandidates);
		const existing = storeMap.get(storePath);
		if (existing) existing.add(id);
		else storeMap.set(storePath, /* @__PURE__ */ new Set([id]));
	};
	for (const configuredAgentId of listConfiguredSessionStoreAgentIds(params.cfg)) {
		const id = normalizeAgentId(configuredAgentId);
		addToStoreMap(storeConfig ? resolveStorePathFromTemplate(storeConfig, id, env) : path.join(stateDir, "agents", id, "sessions", "sessions.json"), id);
	}
	for (const pluginAgentId of pluginAgentIds) {
		const id = normalizeAgentId(pluginAgentId);
		addToStoreMap(storeConfig ? resolveStorePathFromTemplate(storeConfig, id, env) : path.join(stateDir, "agents", id, "sessions", "sessions.json"), id);
	}
	const agentsDir = path.join(stateDir, "agents");
	if (existsDir(agentsDir)) {
		for (const dirEntry of safeReadDir(agentsDir)) if (dirEntry.isDirectory()) {
			const diskAgentId = normalizeAgentId(dirEntry.name);
			if (diskAgentId) addToStoreMap(path.join(agentsDir, diskAgentId, "sessions", "sessions.json"), diskAgentId);
		}
	}
	for (const [mappedStorePath, storeAgentIds] of storeMap) {
		const storePaths = storeAliasCandidates.get(mappedStorePath) ?? /* @__PURE__ */ new Set([mappedStorePath]);
		const storePath = [...storePaths].find((candidate) => fileExists(candidate));
		if (!storePath) continue;
		const pluginForeignMainAliasRisk = [...storeAgentIds].some((id) => pluginAgentIdSet.has(id) && id !== "main");
		let raw;
		try {
			raw = fs.readFileSync(storePath, "utf-8");
		} catch (err) {
			warnings.push(`Could not read ${storePath}: ${String(err)}`);
			continue;
		}
		if (!sessionStoreTextMayNeedCanonicalization({
			raw,
			storeAgentIds,
			mainKey,
			scope,
			preserveForeignMainAliases: pluginForeignMainAliasRisk
		})) continue;
		let parsed;
		try {
			parsed = parseSessionStoreJson5(raw);
		} catch (err) {
			warnings.push(`Could not read ${storePath}: ${String(err)}`);
			continue;
		}
		if (!parsed.ok) continue;
		let working = parsed.store;
		let totalLegacy = 0;
		const storeAliases = resolveSessionStoreAliasPlan(storePath, storePaths);
		const hasDistinctAliases = storeAliases.hasDistinctAliases;
		const preserveAmbiguousKeys = storeAgentIds.size > 1;
		const preservedAmbiguousKeyCount = Object.keys(working).filter((key) => preserveAmbiguousKeys && isAmbiguousSharedStoreKey(key, mainKey, scope) || pluginForeignMainAliasRisk && isLegacyDefaultMainAliasKey(key, mainKey)).length;
		if (storeAliases.hasUnresolvedIdentity) {
			warnings.push(unresolvedSessionStoreIdentityWarning("session key migration", storePath));
			continue;
		}
		if (hasDistinctAliases && preservedAmbiguousKeyCount > 0) {
			warnings.push(aliasedSessionStoreMigrationWarning({
				subject: "migration of",
				count: preservedAmbiguousKeyCount,
				storePath
			}));
			continue;
		}
		if (storeAliases.hasFinalSymlink) {
			warnings.push(`Deferred session key migration in final-component symlink store ${storePath}; configure one canonical session.store path, then rerun openclaw doctor --fix`);
			continue;
		}
		if (hasDistinctAliases) {
			warnings.push(distinctSessionStoreAliasWarning("session key migration", storePath));
			continue;
		}
		for (const storeAgentId of storeAgentIds) {
			const { store: canonicalized, legacyKeys } = canonicalizeSessionStore({
				store: working,
				agentId: storeAgentId,
				mainKey,
				scope,
				skipCrossAgentRemap: preserveAmbiguousKeys,
				preserveCanonicalAgentOwner: true,
				preserveAmbiguousKeys,
				preserveForeignMainAliases: pluginForeignMainAliasRisk
			});
			working = canonicalized;
			totalLegacy += legacyKeys.length;
		}
		if (preservedAmbiguousKeyCount > 0) warnings.push(`Preserved ${preservedAmbiguousKeyCount} ambiguous session key(s) in potentially shared store ${storePath}`);
		if (totalLegacy === 0) continue;
		const normalized = Object.create(null);
		for (const [key, entry] of Object.entries(working)) {
			const ne = normalizeSessionEntry(entry);
			if (ne) normalized[key] = ne;
		}
		try {
			await saveSessionStoreStrict(storePath, normalized);
			changes.push(`Canonicalized ${totalLegacy} orphaned session key(s) in ${storePath}`);
		} catch (err) {
			warnings.push(`Failed to write canonicalized store ${storePath}: ${String(err)}`);
		}
	}
	return {
		changes,
		warnings
	};
}
async function migrateLegacyAcpSessionMetadata(params) {
	const changes = [];
	const warnings = [];
	const env = params.env ?? process.env;
	const now = params.now ?? (() => Date.now());
	const stateDir = resolveStateDir(env);
	const storeConfig = params.cfg.session?.store;
	const pluginAgentIds = params.pluginSessionStoreAgentIds ?? listPluginDoctorSessionStoreAgentIds({
		config: params.cfg,
		env,
		pluginIds: collectRelevantDoctorPluginIds(params.cfg)
	});
	const normalizedPluginAgentIds = new Set(pluginAgentIds.map((id) => normalizeAgentId(id)));
	const declaredAgentIds = /* @__PURE__ */ new Set([...listConfiguredSessionStoreAgentIds(params.cfg).map((id) => normalizeAgentId(id)), ...normalizedPluginAgentIds]);
	const declaredTargets = [...declaredAgentIds].map((agentId) => ({
		agentId,
		storePath: storeConfig ? resolveStorePathFromTemplate(storeConfig, agentId, env) : path.join(stateDir, "agents", agentId, "sessions", "sessions.json")
	}));
	const pluginTargets = declaredTargets.filter(({ agentId }) => agentId !== "main" && normalizedPluginAgentIds.has(agentId));
	const configuredAgents = Array.isArray(params.cfg.agents?.list) ? params.cfg.agents.list : [];
	const configuredAgentIds = new Set(configuredAgents.flatMap((entry) => entry?.id ? [normalizeAgentId(entry.id)] : []));
	const targets = resolveLegacyAcpMetadataSessionStoreTargets([...declaredAgentIds].some((agentId) => !configuredAgentIds.has(agentId)) ? {
		...params.cfg,
		agents: {
			...params.cfg.agents,
			list: [...configuredAgents, ...[...declaredAgentIds].filter((agentId) => !configuredAgentIds.has(agentId)).map((id) => ({ id }))]
		}
	} : params.cfg, env);
	const mainKey = normalizeMainKey(params.cfg.session?.mainKey);
	const scope = params.cfg.session?.scope;
	const storeGroups = [];
	for (const target of targets) {
		if (!fileExists(target.storePath)) continue;
		const group = storeGroups.find(({ target: existing }) => sessionStorePathsMatch(existing.storePath, target.storePath));
		const matchingDeclaredTargets = declaredTargets.filter((declaredTarget) => sessionStorePathsMatch(target.storePath, declaredTarget.storePath));
		if (group) {
			group.agentIds.add(normalizeAgentId(target.agentId));
			group.aliasCandidates.add(target.storePath);
			for (const declaredTarget of matchingDeclaredTargets) {
				group.agentIds.add(declaredTarget.agentId);
				group.aliasCandidates.add(declaredTarget.storePath);
			}
			continue;
		}
		storeGroups.push({
			target,
			agentIds: /* @__PURE__ */ new Set([normalizeAgentId(target.agentId), ...matchingDeclaredTargets.map((declaredTarget) => declaredTarget.agentId)]),
			aliasCandidates: /* @__PURE__ */ new Set([target.storePath, ...matchingDeclaredTargets.map((declaredTarget) => declaredTarget.storePath)])
		});
	}
	for (const { target, agentIds, aliasCandidates } of storeGroups) {
		const storePath = target.storePath;
		const storeAliases = resolveSessionStoreAliasPlan(storePath, aliasCandidates);
		const pluginForeignMainAliasRisk = pluginTargets.some((pluginTarget) => sessionStorePathsMatch(storePath, pluginTarget.storePath));
		let parsed;
		try {
			parsed = readSessionStoreJson5(storePath);
		} catch (err) {
			warnings.push(`Could not read ${storePath}: ${String(err)}`);
			continue;
		}
		if (!parsed.ok) continue;
		const ambiguousKeyCount = Object.keys(parsed.store).filter((key) => isAmbiguousSharedStoreKey(key, mainKey, scope) || pluginForeignMainAliasRisk && isLegacyDefaultMainAliasKey(key, mainKey)).length;
		const hasLegacyAcpMetadata = Object.values(parsed.store).some((entry) => normalizeSessionEntry(entry)?.acp !== void 0);
		if (hasLegacyAcpMetadata && storeAliases.hasUnresolvedIdentity) {
			warnings.push(unresolvedSessionStoreIdentityWarning("ACP metadata migration", storePath));
			continue;
		}
		if (hasLegacyAcpMetadata && storeAliases.hasFinalSymlink) {
			warnings.push(`Deferred ACP metadata migration in final-component symlink store ${storePath}; configure one canonical session.store path, then rerun openclaw doctor --fix`);
			continue;
		}
		if (hasLegacyAcpMetadata && storeAliases.hasDistinctAliases) {
			warnings.push(ambiguousKeyCount > 0 ? aliasedSessionStoreMigrationWarning({
				subject: "ACP metadata migration for",
				count: ambiguousKeyCount,
				storePath
			}) : distinctSessionStoreAliasWarning("ACP metadata migration", storePath));
			continue;
		}
		const normalized = Object.create(null);
		let migrated = 0;
		let preserved = 0;
		for (const [sessionKey, entry] of Object.entries(parsed.store)) {
			const normalizedEntry = normalizeSessionEntry(entry);
			if (!normalizedEntry) continue;
			if (normalizedEntry.acp) {
				const ambiguousSharedStoreKey = isAmbiguousSharedStoreKey(sessionKey, mainKey, scope);
				const ambiguousMultiOwnerKey = agentIds.size > 1 && ambiguousSharedStoreKey;
				const foreignMainAlias = pluginForeignMainAliasRisk && isLegacyDefaultMainAliasKey(sessionKey, mainKey);
				if (ambiguousMultiOwnerKey || foreignMainAlias) {
					preserved++;
					normalized[sessionKey] = normalizedEntry;
					continue;
				}
				writeAcpSessionMetaForMigration({
					sessionKey: canonicalizeSessionKeyForAgent({
						key: sessionKey,
						agentId: resolveCanonicalAgentSessionOwner(sessionKey) ?? target.agentId,
						mainKey,
						scope,
						skipCrossAgentRemap: true
					}),
					sessionId: normalizedEntry.sessionId,
					meta: normalizedEntry.acp,
					env,
					now
				});
				delete normalizedEntry.acp;
				migrated++;
			}
			normalized[sessionKey] = normalizedEntry;
		}
		if (preserved > 0) warnings.push(`Preserved ACP metadata for ${preserved} ambiguous session key(s) in potentially shared store ${storePath}`);
		if (migrated === 0) continue;
		try {
			await saveSessionStoreStrict(storePath, normalized);
			changes.push(`Migrated ${migrated} ACP session metadata ${migrated === 1 ? "row" : "rows"} → shared SQLite state`);
		} catch (err) {
			warnings.push(`Failed to write ACP metadata migration source ${storePath}: ${String(err)}`);
		}
	}
	return {
		changes,
		warnings
	};
}
function resolveLegacyAcpMetadataSessionStoreTargets(cfg, env) {
	const stateDir = resolveStateDir(env);
	const agentsDirs = /* @__PURE__ */ new Set([path.join(stateDir, "agents")]);
	const targets = /* @__PURE__ */ new Map();
	const addTarget = (agentId, storePath) => {
		if (!isManagedLegacySessionStorePathSafe(storePath)) return;
		const agentsDir = resolveAgentsDirFromSessionStorePath(storePath);
		if (agentsDir) agentsDirs.add(agentsDir);
		if (!targets.has(storePath)) targets.set(storePath, {
			agentId,
			storePath
		});
	};
	for (const target of resolveAllAgentSessionStoreTargetsSync(cfg, { env })) addTarget(target.agentId, target.storePath);
	for (const target of resolveSessionStoreTargets(cfg, { allAgents: true }, { env })) addTarget(target.agentId, target.storePath);
	for (const agentsDir of agentsDirs) {
		if (!existsDir(agentsDir)) continue;
		for (const entry of safeReadDir(agentsDir)) {
			if (!entry.isDirectory()) continue;
			const agentId = normalizeAgentId(entry.name);
			const normalizedDirName = normalizeLowercaseStringOrEmpty(entry.name);
			if (agentId === "main" && normalizedDirName !== agentId) continue;
			addTarget(agentId, path.join(agentsDir, entry.name, "sessions", "sessions.json"));
		}
	}
	return [...targets.values()];
}
function isManagedLegacySessionStorePathSafe(storePath) {
	const resolvedStorePath = path.resolve(storePath);
	const agentsDir = resolveAgentsDirFromSessionStorePath(resolvedStorePath);
	if (!agentsDir) return true;
	if (!fileExists(resolvedStorePath)) return true;
	try {
		const stat = fs.lstatSync(resolvedStorePath);
		if (stat.isSymbolicLink() || !stat.isFile()) return false;
		const resolvedAgentsDir = path.resolve(agentsDir);
		const realStorePath = fs.realpathSync.native(resolvedStorePath);
		return isWithinDir(fs.realpathSync.native(resolvedAgentsDir), realStorePath);
	} catch {
		return false;
	}
}
function resolveStorePathFromTemplate(template, agentId, env) {
	const expand = (s) => s.startsWith("~") ? expandHomePrefix(s, {
		env: env ?? process.env,
		homedir: os.homedir
	}) : s;
	if (template.includes("{agentId}")) return path.resolve(expand(template.replaceAll("{agentId}", agentId)));
	return path.resolve(expand(template));
}
function resolveSessionStorePathRelationship(left, right) {
	if (left === right) return "same";
	try {
		return sameFileIdentity(fs.statSync(left), fs.statSync(right)) ? "same" : "different";
	} catch (err) {
		const code = err.code;
		if (code !== "ENOENT" && code !== "ENOTDIR") return "unknown";
		const resolvedLeft = resolvePathThroughExistingParents(left);
		const resolvedRight = resolvePathThroughExistingParents(right);
		if (resolvedLeft === void 0 || resolvedRight === void 0) return "unknown";
		return resolvedLeft === resolvedRight ? "same" : "different";
	}
}
function sessionStorePathsMatch(left, right) {
	return resolveSessionStorePathRelationship(left, right) !== "different";
}
function resolvePathThroughExistingParents(filePath) {
	const resolvedPath = path.resolve(filePath);
	const suffix = [path.basename(resolvedPath)];
	let parentPath = path.dirname(resolvedPath);
	while (true) try {
		return path.join(fs.realpathSync.native(parentPath), ...suffix);
	} catch (err) {
		const code = err.code;
		if (code !== "ENOENT" && code !== "ENOTDIR") return;
		const nextParent = path.dirname(parentPath);
		if (nextParent === parentPath) return;
		suffix.unshift(path.basename(parentPath));
		parentPath = nextParent;
	}
}
function sessionStorePathIsFinalSymlink(storePath) {
	try {
		return fs.lstatSync(storePath).isSymbolicLink();
	} catch {
		return false;
	}
}
function sessionStorePathsHaveDistinctEntries(left, right) {
	if (left === right) return false;
	try {
		if (fs.lstatSync(left).isSymbolicLink() || fs.lstatSync(right).isSymbolicLink()) return true;
		return fs.realpathSync.native(left) !== fs.realpathSync.native(right);
	} catch (err) {
		const code = err.code;
		if (code !== "ENOENT" && code !== "ENOTDIR") return true;
		const resolvedLeft = resolvePathThroughExistingParents(left);
		const resolvedRight = resolvePathThroughExistingParents(right);
		return resolvedLeft === void 0 || resolvedLeft !== resolvedRight;
	}
}
function resolveSessionStoreAliasPlan(storePath, candidatePaths) {
	let hasDistinctEntries = false;
	let hasFinalSymlink = sessionStorePathIsFinalSymlink(storePath);
	let hasUnresolvedIdentity = false;
	for (const candidatePath of candidatePaths) {
		const relationship = resolveSessionStorePathRelationship(storePath, candidatePath);
		if (relationship === "different") continue;
		if (relationship === "unknown") {
			hasUnresolvedIdentity = true;
			continue;
		}
		hasFinalSymlink ||= sessionStorePathIsFinalSymlink(candidatePath);
		if (sessionStorePathsHaveDistinctEntries(storePath, candidatePath)) hasDistinctEntries = true;
	}
	return {
		hasDistinctAliases: hasFinalSymlink || hasDistinctEntries || hasUnresolvedIdentity,
		hasFinalSymlink,
		hasUnresolvedIdentity
	};
}
function mergeSessionStoreAliasPlans(left, right) {
	if (!left) return right;
	return {
		hasDistinctAliases: left.hasDistinctAliases || right.hasDistinctAliases,
		hasFinalSymlink: left.hasFinalSymlink || right.hasFinalSymlink,
		hasUnresolvedIdentity: left.hasUnresolvedIdentity || right.hasUnresolvedIdentity
	};
}
async function saveSessionStoreStrict(storePath, store) {
	await saveSessionStore(storePath, store, {
		skipMaintenance: true,
		requireWriteSuccess: true
	});
}
function resolveSessionStoreOwnership(params) {
	const targetStorePath = path.join(params.stateDir, "agents", params.targetAgentId, "sessions", "sessions.json");
	const configuredStore = params.cfg.session?.store;
	const resolveAgentStorePath = (agentId) => configuredStore ? resolveStorePathFromTemplate(configuredStore, agentId, params.env) : path.join(params.stateDir, "agents", agentId, "sessions", "sessions.json");
	const preserveForeignMainAliases = params.pluginSessionStoreAgentIds.some((pluginAgentId) => {
		const id = normalizeAgentId(pluginAgentId);
		if (id === "main") return false;
		return sessionStorePathsMatch(resolveAgentStorePath(id), targetStorePath);
	});
	const configuredOwnerStorePaths = [.../* @__PURE__ */ new Set([...listConfiguredSessionStoreAgentIds(params.cfg).map((id) => normalizeAgentId(id)), ...params.pluginSessionStoreAgentIds.map((id) => normalizeAgentId(id))])].map(resolveAgentStorePath);
	const preserveAmbiguousKeys = configuredOwnerStorePaths.filter((storePath) => sessionStorePathsMatch(storePath, targetStorePath)).length > 1;
	const candidateStorePaths = [...configuredOwnerStorePaths];
	const agentsDir = path.join(params.stateDir, "agents");
	for (const entry of safeReadDir(agentsDir)) if (entry.isDirectory()) candidateStorePaths.push(path.join(agentsDir, entry.name, "sessions", "sessions.json"));
	return {
		preserveAmbiguousKeys,
		preserveForeignMainAliases,
		targetStoreAliases: resolveSessionStoreAliasPlan(targetStorePath, candidateStorePaths)
	};
}
//#endregion
//#region src/infra/state-migrations.legacy-sessions.ts
async function migrateLegacySessions(detected, now, options = {}) {
	const changes = [];
	const warnings = [];
	if (!detected.sessions.hasLegacy) return {
		changes,
		warnings
	};
	ensureMigrationDir(detected.sessions.targetDir);
	const legacyParsed = fileExists(detected.sessions.legacyStorePath) ? readSessionStoreJson5(detected.sessions.legacyStorePath) : {
		store: {},
		ok: true
	};
	const targetParsed = fileExists(detected.sessions.targetStorePath) ? readSessionStoreJson5(detected.sessions.targetStorePath) : {
		store: {},
		ok: true
	};
	const legacyStore = legacyParsed.store;
	const targetStore = targetParsed.store;
	if (detected.sessions.targetStoreAliases.hasUnresolvedIdentity) {
		warnings.push(unresolvedSessionStoreIdentityWarning("legacy session migration", detected.sessions.targetStorePath));
		return {
			changes,
			warnings
		};
	}
	if (detected.sessions.targetStoreAliases.hasFinalSymlink) {
		warnings.push(`Deferred legacy session migration in final-component symlink store ${detected.sessions.targetStorePath}; configure one canonical session.store path, then rerun openclaw doctor --fix`);
		return {
			changes,
			warnings
		};
	}
	const ambiguousAliasedKeys = new Set([...Object.keys(targetStore), ...Object.keys(legacyStore)].filter((key) => isAmbiguousSharedStoreKey(key, detected.targetMainKey, detected.targetScope) || detected.sessions.preserveForeignMainAliases && isLegacyDefaultMainAliasKey(key, detected.targetMainKey)));
	if (detected.sessions.targetStoreAliases.hasDistinctAliases) {
		warnings.push(ambiguousAliasedKeys.size > 0 ? aliasedSessionStoreMigrationWarning({
			subject: "migration of",
			count: ambiguousAliasedKeys.size,
			storePath: detected.sessions.targetStorePath
		}) : distinctSessionStoreAliasWarning("legacy session migration", detected.sessions.targetStorePath));
		return {
			changes,
			warnings
		};
	}
	const canonicalizedTarget = canonicalizeSessionStore({
		store: targetStore,
		agentId: detected.targetAgentId,
		mainKey: detected.targetMainKey,
		scope: detected.targetScope,
		skipCrossAgentRemap: detected.sessions.preserveAmbiguousKeys,
		preserveCanonicalAgentOwner: true,
		preserveAmbiguousKeys: detected.sessions.preserveAmbiguousKeys,
		preserveForeignMainAliases: detected.sessions.preserveForeignMainAliases
	});
	const canonicalizedLegacy = canonicalizeSessionStore({
		store: legacyStore,
		agentId: detected.targetAgentId,
		mainKey: detected.targetMainKey,
		scope: detected.targetScope,
		preserveCanonicalAgentOwner: true,
		preserveForeignMainAliases: detected.sessions.preserveForeignMainAliases
	});
	const preservedLegacyForeignMainAliasCount = detected.sessions.preserveForeignMainAliases ? Object.keys(legacyStore).filter((key) => isLegacyDefaultMainAliasKey(key, detected.targetMainKey)).length : 0;
	let repairedStaleSessionFiles = false;
	for (const entry of Object.values(canonicalizedTarget.store)) {
		const targetSessionFile = resolveStaleLegacySessionFile({
			entry,
			legacyDir: detected.sessions.legacyDir,
			targetDir: detected.sessions.targetDir
		});
		if (targetSessionFile) {
			entry.sessionFile = targetSessionFile;
			repairedStaleSessionFiles = true;
		}
	}
	const merged = Object.create(null);
	for (const [key, entry] of Object.entries(canonicalizedTarget.store)) merged[key] = entry;
	for (const [key, entry] of Object.entries(canonicalizedLegacy.store)) merged[key] = mergeSessionEntry({
		existing: merged[key],
		incoming: entry,
		preferIncomingOnTie: false
	});
	const mainKey = buildAgentMainSessionKey({
		agentId: detected.targetAgentId,
		mainKey: detected.targetMainKey
	});
	let migratedDirectChatKey;
	if (!merged[mainKey]) {
		const latest = pickLatestLegacyDirectEntry(legacyStore);
		if (latest?.sessionId) {
			merged[mainKey] = latest;
			migratedDirectChatKey = mainKey;
		}
	}
	if (!legacyParsed.ok) warnings.push(`Legacy sessions store unreadable; left in place at ${detected.sessions.legacyStorePath}`);
	let targetReadable = !fileExists(detected.sessions.targetStorePath) || targetParsed.ok;
	if (!targetReadable) if (options.recoverCorruptTargetStore) {
		const archivedTargetPath = `${detected.sessions.targetStorePath}.corrupt-${now()}`;
		try {
			fs.renameSync(detected.sessions.targetStorePath, archivedTargetPath);
			changes.push(`Archived corrupt target sessions store → ${archivedTargetPath}`);
			targetReadable = true;
		} catch (err) {
			warnings.push(`Target sessions store unreadable; failed to archive ${detected.sessions.targetStorePath}: ${String(err)}`);
		}
	} else warnings.push(`Target sessions store unreadable; left untouched to avoid overwriting at ${detected.sessions.targetStorePath}. Run openclaw doctor --fix to archive it and retry the legacy merge.`);
	if (targetReadable && (legacyParsed.ok || targetParsed.ok) && (Object.keys(legacyStore).length > 0 || Object.keys(targetStore).length > 0)) {
		const normalized = Object.create(null);
		for (const [key, entry] of Object.entries(merged)) {
			const normalizedEntry = normalizeSessionEntry(entry);
			if (!normalizedEntry) continue;
			normalized[key] = normalizedEntry;
		}
		await saveSessionStoreStrict(detected.sessions.targetStorePath, normalized);
		if (migratedDirectChatKey) changes.push(`Migrated latest direct-chat session → ${migratedDirectChatKey}`);
		changes.push(`Merged sessions store → ${detected.sessions.targetStorePath}`);
		if (preservedLegacyForeignMainAliasCount > 0) warnings.push(`Preserved ${preservedLegacyForeignMainAliasCount} ambiguous session key(s) while importing legacy sessions into ${detected.sessions.targetStorePath}`);
		if (canonicalizedTarget.legacyKeys.length > 0) changes.push(`Canonicalized ${canonicalizedTarget.legacyKeys.length} legacy session key(s)`);
		if (repairedStaleSessionFiles) changes.push("Repaired migrated session transcript paths");
	}
	if (!targetReadable) return {
		changes,
		warnings
	};
	const movedSessionFiles = /* @__PURE__ */ new Map();
	const entries = safeReadDir(detected.sessions.legacyDir);
	for (const entry of entries) {
		if (!entry.isFile()) continue;
		if (entry.name === "sessions.json") continue;
		const from = path.join(detected.sessions.legacyDir, entry.name);
		let to = path.join(detected.sessions.targetDir, entry.name);
		if (fileExists(to)) {
			const parsed = path.parse(entry.name);
			to = path.join(detected.sessions.targetDir, `${parsed.name}.legacy-${now()}${parsed.ext}`);
		}
		try {
			fs.renameSync(from, to);
			movedSessionFiles.set(path.resolve(from), to);
			changes.push(`Moved ${entry.name} → agents/${detected.targetAgentId}/sessions`);
		} catch (err) {
			warnings.push(`Failed moving ${from}: ${String(err)}`);
		}
	}
	if (movedSessionFiles.size > 0) {
		let rewroteSessionFiles = false;
		for (const entry of Object.values(merged)) {
			const rawSessionFile = entry.sessionFile;
			const legacySessionFile = typeof rawSessionFile === "string" ? path.resolve(detected.sessions.legacyDir, rawSessionFile) : typeof entry.sessionId === "string" ? path.join(detected.sessions.legacyDir, `${entry.sessionId}.jsonl`) : void 0;
			const movedSessionFile = legacySessionFile ? movedSessionFiles.get(path.resolve(legacySessionFile)) : void 0;
			if (!movedSessionFile) continue;
			entry.sessionFile = movedSessionFile;
			rewroteSessionFiles = true;
		}
		if (rewroteSessionFiles) {
			const normalized = Object.create(null);
			for (const [key, entry] of Object.entries(merged)) {
				const normalizedEntry = normalizeSessionEntry(entry);
				if (normalizedEntry) normalized[key] = normalizedEntry;
			}
			await saveSessionStoreStrict(detected.sessions.targetStorePath, normalized);
			changes.push("Rewrote migrated session transcript paths");
		}
	}
	if (legacyParsed.ok && targetReadable) try {
		if (fileExists(detected.sessions.legacyStorePath)) fs.rmSync(detected.sessions.legacyStorePath, { force: true });
	} catch {}
	removeDirIfEmpty(detected.sessions.legacyDir);
	if (safeReadDir(detected.sessions.legacyDir).filter((e) => e.isFile()).length > 0) {
		const backupDir = `${detected.sessions.legacyDir}.legacy-${now()}`;
		try {
			fs.renameSync(detected.sessions.legacyDir, backupDir);
			warnings.push(`Left legacy sessions at ${backupDir}`);
		} catch {}
	}
	return {
		changes,
		warnings
	};
}
async function migrateLegacyAgentDir(detected, now) {
	const changes = [];
	const warnings = [];
	if (!detected.agentDir.hasLegacy) return {
		changes,
		warnings
	};
	ensureMigrationDir(detected.agentDir.targetDir);
	const entries = safeReadDir(detected.agentDir.legacyDir);
	for (const entry of entries) {
		const from = path.join(detected.agentDir.legacyDir, entry.name);
		const to = path.join(detected.agentDir.targetDir, entry.name);
		if (fs.existsSync(to)) continue;
		try {
			fs.renameSync(from, to);
			changes.push(`Moved agent file ${entry.name} → agents/${detected.targetAgentId}/agent`);
		} catch (err) {
			warnings.push(`Failed moving ${from}: ${String(err)}`);
		}
	}
	removeDirIfEmpty(detected.agentDir.legacyDir);
	if (!emptyDirOrMissing(detected.agentDir.legacyDir)) {
		const backupDir = path.join(detected.stateDir, "agents", detected.targetAgentId, `agent.legacy-${now()}`);
		try {
			fs.renameSync(detected.agentDir.legacyDir, backupDir);
			warnings.push(`Left legacy agent dir at ${backupDir}`);
		} catch (err) {
			warnings.push(`Failed relocating legacy agent dir: ${String(err)}`);
		}
	}
	return {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.managed-outgoing-images.ts
const LEGACY_RECORD_MAX_BYTES = 1024 * 1024;
const DEFAULT_TRANSIENT_TTL_MS = 900 * 1e3;
const ATTACHMENT_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DOCTOR_CLAIM_MARKER = ".json.doctor-importing-";
const DOCTOR_CLAIM_SUFFIX_RE = /^\d+-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RECORD_KEYS = /* @__PURE__ */ new Set([
	"attachmentId",
	"sessionKey",
	"agentId",
	"messageId",
	"createdAt",
	"updatedAt",
	"retentionClass",
	"alt",
	"original"
]);
const ORIGINAL_KEYS = /* @__PURE__ */ new Set([
	"path",
	"contentType",
	"width",
	"height",
	"sizeBytes",
	"filename"
]);
function resolveLegacyManagedOutgoingImageRecordsDir(stateDir) {
	return path.join(stateDir, "media", "outgoing", "records");
}
function sourceNameFromDoctorClaim(name) {
	const markerIndex = name.indexOf(DOCTOR_CLAIM_MARKER);
	if (markerIndex < 0) return null;
	const attachmentId = name.slice(0, markerIndex);
	const suffix = name.slice(markerIndex + 23);
	return ATTACHMENT_ID_RE.test(attachmentId) && DOCTOR_CLAIM_SUFFIX_RE.test(suffix) ? `${attachmentId}.json` : null;
}
function isLegacyManagedImageSourceName(name) {
	return name.endsWith(".json") || sourceNameFromDoctorClaim(name) !== null;
}
function detectLegacyManagedOutgoingImages(params) {
	const sourceDir = resolveLegacyManagedOutgoingImageRecordsDir(params.stateDir);
	let hasLegacy = false;
	if (params.doctorOnlyStateMigrations === true) try {
		hasLegacy = fs.readdirSync(sourceDir).some(isLegacyManagedImageSourceName);
	} catch {
		hasLegacy = false;
	}
	return {
		sourceDir,
		hasLegacy
	};
}
function recoverInterruptedDoctorClaims(sourceDir) {
	for (const claimName of fs.readdirSync(sourceDir).toSorted()) {
		const sourceName = sourceNameFromDoctorClaim(claimName);
		if (!sourceName) continue;
		const claimPath = path.join(sourceDir, claimName);
		const sourcePath = path.join(sourceDir, sourceName);
		const claimSnapshot = readLegacySourceSnapshot$6(claimPath);
		if (!fs.existsSync(sourcePath)) {
			fs.renameSync(claimPath, sourcePath);
			continue;
		}
		const sourceSnapshot = readLegacySourceSnapshot$6(sourcePath);
		if (sourceSnapshot.size !== claimSnapshot.size || sourceSnapshot.sha256 !== claimSnapshot.sha256) throw new Error(`interrupted managed image claim conflicts with ${sourcePath}`);
		fs.unlinkSync(claimPath);
	}
}
function readLegacySourceSnapshot$6(sourcePath) {
	const before = fs.lstatSync(sourcePath);
	if (!before.isFile() || before.isSymbolicLink()) throw new Error("legacy managed image source is not a regular non-symlink file");
	if (before.size > LEGACY_RECORD_MAX_BYTES) throw new Error("legacy managed image source exceeds the metadata size limit");
	const raw = fs.readFileSync(sourcePath, "utf8");
	const after = fs.lstatSync(sourcePath);
	if (!after.isFile() || after.isSymbolicLink() || before.dev !== after.dev || before.ino !== after.ino || before.size !== after.size || before.mtimeMs !== after.mtimeMs) throw new Error("legacy managed image source changed while doctor was reading it");
	return {
		sourcePath,
		dev: after.dev,
		ino: after.ino,
		mtimeMs: after.mtimeMs,
		raw,
		sha256: createHash("sha256").update(raw).digest("hex"),
		size: after.size
	};
}
function sourceSnapshotsMatch$3(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mtimeMs === right.mtimeMs && left.sha256 === right.sha256 && left.size === right.size;
}
function optionalNonEmptyString(value) {
	return typeof value === "string" && value.trim() ? value : void 0;
}
function nullableNonNegativeInteger(value) {
	if (value === null) return null;
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : void 0;
}
function parseLegacyManagedImageRecord(params) {
	const raw = JSON.parse(params.snapshot.raw);
	if (!isRecord$1(raw) || !isRecord$1(raw.original)) throw new Error("legacy managed image record must be an object");
	const unexpectedRecordKey = Object.keys(raw).find((key) => !RECORD_KEYS.has(key));
	const unexpectedOriginalKey = Object.keys(raw.original).find((key) => !ORIGINAL_KEYS.has(key));
	if (unexpectedRecordKey || unexpectedOriginalKey) throw new Error(`legacy managed image record has unexpected field ${unexpectedRecordKey ?? `original.${unexpectedOriginalKey}`}`);
	const attachmentId = optionalNonEmptyString(raw.attachmentId);
	const sessionKey = optionalNonEmptyString(raw.sessionKey);
	const agentId = optionalNonEmptyString(raw.agentId);
	const messageId = raw.messageId === null ? null : optionalNonEmptyString(raw.messageId);
	const createdAt = optionalNonEmptyString(raw.createdAt);
	const updatedAt = optionalNonEmptyString(raw.updatedAt);
	const alt = typeof raw.alt === "string" ? raw.alt : void 0;
	const retentionClass = raw.retentionClass;
	const originalPath = optionalNonEmptyString(raw.original.path);
	const contentType = optionalNonEmptyString(raw.original.contentType);
	const width = nullableNonNegativeInteger(raw.original.width);
	const height = nullableNonNegativeInteger(raw.original.height);
	const sizeBytes = nullableNonNegativeInteger(raw.original.sizeBytes);
	const filename = raw.original.filename === null ? null : optionalNonEmptyString(raw.original.filename);
	if (!attachmentId || !ATTACHMENT_ID_RE.test(attachmentId) || path.basename(params.snapshot.sourcePath) !== `${attachmentId}.json` || !sessionKey || raw.agentId !== void 0 && !agentId || raw.messageId !== null && messageId === void 0 || !createdAt || !Number.isFinite(Date.parse(createdAt)) || raw.updatedAt !== void 0 && (!updatedAt || !Number.isFinite(Date.parse(updatedAt))) || retentionClass !== void 0 && retentionClass !== "transient" && retentionClass !== "history" || alt === void 0 || !originalPath || !contentType || width === void 0 || height === void 0 || sizeBytes === void 0 || raw.original.filename !== null && filename === void 0) throw new Error(`legacy managed image record is invalid: ${params.snapshot.sourcePath}`);
	const resolvedOriginalPath = path.resolve(originalPath);
	const mediaRoot = path.dirname(path.dirname(path.dirname(resolvedOriginalPath)));
	if (!(/* @__PURE__ */ new Set([path.resolve(params.stateDir, "media"), path.resolve(getMediaDir())])).has(mediaRoot) || path.dirname(resolvedOriginalPath) !== path.join(mediaRoot, "outgoing/originals")) throw new Error("legacy managed image original is outside managed outgoing storage");
	const mediaId = path.basename(resolvedOriginalPath);
	if (!mediaId || mediaId === "." || mediaId === "..") throw new Error("legacy managed image original has an invalid media id");
	return {
		snapshot: params.snapshot,
		originalPath: resolvedOriginalPath,
		record: {
			attachmentId,
			sessionKey,
			...agentId ? { agentId } : {},
			messageId: messageId ?? null,
			createdAt,
			...updatedAt ? { updatedAt } : {},
			...retentionClass === "transient" || retentionClass === "history" ? { retentionClass } : {},
			alt,
			original: {
				mediaRoot,
				mediaId,
				mediaSubdir: MANAGED_OUTGOING_ORIGINALS_SUBDIR,
				contentType,
				width,
				height,
				sizeBytes,
				filename: filename ?? null
			}
		}
	};
}
function restoreClaimedSources(claimed) {
	const restoreErrors = [];
	for (const entry of claimed.toReversed()) {
		if (!fs.existsSync(entry.claimPath)) continue;
		if (fs.existsSync(entry.sourcePath)) {
			restoreErrors.push(`source path already exists: ${entry.sourcePath}`);
			continue;
		}
		try {
			fs.renameSync(entry.claimPath, entry.sourcePath);
		} catch (error) {
			restoreErrors.push(String(error));
		}
	}
	return restoreErrors;
}
function appendRestoreFailures(error, restoreErrors) {
	return `${String(error)}${restoreErrors.length > 0 ? `; restore failures: ${restoreErrors.join("; ")}` : ""}`;
}
function claimLegacySources$1(params) {
	params.beforeClaim?.();
	const claimed = [];
	try {
		for (const parsed of params.records) {
			const sourcePath = parsed.snapshot.sourcePath;
			const claimPath = `${sourcePath}.doctor-importing-${process.pid}-${randomUUID()}`;
			fs.renameSync(sourcePath, claimPath);
			claimed.push({
				claimPath,
				sourcePath,
				parsed
			});
			if (!sourceSnapshotsMatch$3(readLegacySourceSnapshot$6(claimPath), parsed.snapshot)) throw new Error(`legacy managed image source changed before doctor claimed it: ${sourcePath}`);
		}
		return claimed;
	} catch (error) {
		throw new Error(appendRestoreFailures(error, restoreClaimedSources(claimed)), { cause: error });
	}
}
function verifyClaimedSources(claimed) {
	for (const entry of claimed) {
		if (!sourceSnapshotsMatch$3(readLegacySourceSnapshot$6(entry.claimPath), entry.parsed.snapshot)) throw new Error(`claimed legacy managed image source changed: ${entry.sourcePath}`);
		if (fs.existsSync(entry.sourcePath)) throw new Error(`legacy managed image source was replaced while doctor imported it`);
	}
}
function removeClaimedSources$1(params) {
	try {
		for (const entry of params.claimed) (params.removeSource ?? fs.unlinkSync)(entry.claimPath);
	} catch (error) {
		throw new Error(appendRestoreFailures(error, restoreClaimedSources(params.claimed)), { cause: error });
	}
}
function isExpiredTransient(record, nowMs, transientTtlMs) {
	const createdAtMs = Date.parse(record.createdAt);
	return record.messageId === null && Number.isFinite(createdAtMs) && nowMs - createdAtMs >= transientTtlMs;
}
function rollbackImportedRecords(params) {
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const stateDb = getNodeSqliteKysely(db);
			for (const parsed of params.records) {
				const row = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("managed_outgoing_image_records").selectAll().where("attachment_id", "=", parsed.record.attachmentId));
				if (!row || row.cleanup_pending === 1 || !managedImageRecordsEqual(managedImageRecordFromRow(row), parsed.record)) continue;
				executeSqliteQuerySync(db, stateDb.deleteFrom("managed_outgoing_image_records").where("attachment_id", "=", parsed.record.attachmentId));
			}
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		return null;
	} catch (error) {
		return String(error);
	}
}
/** Import, verify, and remove retired record JSON during explicit Doctor repair. */
function migrateLegacyManagedOutgoingImages(params) {
	const changes = [];
	const warnings = [];
	if (!params.detected.hasLegacy) return {
		changes,
		warnings
	};
	let parsedRecords;
	try {
		const sourceDirStat = fs.lstatSync(params.detected.sourceDir);
		if (!sourceDirStat.isDirectory() || sourceDirStat.isSymbolicLink()) throw new Error("legacy managed image records owner is not a regular directory");
		recoverInterruptedDoctorClaims(params.detected.sourceDir);
		parsedRecords = fs.readdirSync(params.detected.sourceDir).filter((name) => name.endsWith(".json")).toSorted().map((name) => parseLegacyManagedImageRecord({
			snapshot: readLegacySourceSnapshot$6(path.join(params.detected.sourceDir, name)),
			stateDir: params.stateDir
		}));
	} catch (error) {
		warnings.push(`Failed reading legacy managed outgoing image state: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	const nowMs = params.nowMs ?? Date.now();
	const transientTtlMs = params.transientTtlMs ?? DEFAULT_TRANSIENT_TTL_MS;
	const discardedIds = /* @__PURE__ */ new Set();
	const insertedRecords = [];
	let claimed;
	try {
		claimed = claimLegacySources$1({
			records: parsedRecords,
			beforeClaim: params.beforeClaim
		});
	} catch (error) {
		warnings.push(`Failed claiming legacy managed outgoing image state: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const stateDb = getNodeSqliteKysely(db);
			for (const parsed of parsedRecords) {
				const existing = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("managed_outgoing_image_records").selectAll().where("attachment_id", "=", parsed.record.attachmentId));
				if (existing) {
					if (!managedImageRecordsEqual(managedImageRecordFromRow(existing), parsed.record)) throw new Error(`legacy managed image record conflicts with shared SQLite state: ${parsed.record.attachmentId}`);
					continue;
				}
				if (isExpiredTransient(parsed.record, nowMs, transientTtlMs)) {
					discardedIds.add(parsed.record.attachmentId);
					continue;
				}
				executeSqliteQuerySync(db, stateDb.insertInto("managed_outgoing_image_records").values(managedImageRecordToRow(parsed.record)));
				insertedRecords.push(parsed);
			}
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
	} catch (error) {
		warnings.push(`Failed migrating legacy managed outgoing image state: ${appendRestoreFailures(error, restoreClaimedSources(claimed))}`);
		return {
			changes,
			warnings
		};
	}
	try {
		params.beforeVerify?.();
		const database = openOpenClawStateDatabase({ env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		const stateDb = getNodeSqliteKysely(database.db);
		for (const parsed of parsedRecords) {
			const row = executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom("managed_outgoing_image_records").selectAll().where("attachment_id", "=", parsed.record.attachmentId));
			if (discardedIds.has(parsed.record.attachmentId)) {
				if (row) throw new Error(`discarded transient record unexpectedly exists: ${parsed.record.attachmentId}`);
			} else if (!row || !managedImageRecordsEqual(managedImageRecordFromRow(row), parsed.record)) throw new Error(`managed image verification failed: ${parsed.record.attachmentId}`);
		}
		verifyClaimedSources(claimed);
	} catch (error) {
		const rollbackError = rollbackImportedRecords({
			records: insertedRecords,
			stateDir: params.stateDir
		});
		const restoreErrors = restoreClaimedSources(claimed);
		warnings.push(`Failed verifying legacy managed outgoing image migration: ${appendRestoreFailures(error, restoreErrors)}` + (rollbackError ? `; SQLite rollback failure: ${rollbackError}` : ""));
		return {
			changes,
			warnings
		};
	}
	let deletedExpiredFiles = 0;
	try {
		for (const parsed of parsedRecords) {
			if (!discardedIds.has(parsed.record.attachmentId)) continue;
			fs.rmSync(parsed.originalPath, { force: true });
			deletedExpiredFiles += 1;
		}
	} catch (error) {
		warnings.push(`Failed deleting expired legacy managed image attachments: ${appendRestoreFailures(error, restoreClaimedSources(claimed))}`);
		return {
			changes,
			warnings
		};
	}
	try {
		removeClaimedSources$1({
			claimed,
			removeSource: params.removeSource
		});
	} catch (error) {
		warnings.push(`Migrated managed outgoing images but could not remove legacy JSON: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		fs.rmdirSync(params.detected.sourceDir);
	} catch {}
	const importedCount = parsedRecords.length - discardedIds.size;
	if (importedCount > 0) changes.push(`Migrated ${importedCount} managed outgoing image record(s) → shared SQLite state`);
	if (discardedIds.size > 0) changes.push(`Discarded ${discardedIds.size} expired managed outgoing image record(s)` + (deletedExpiredFiles > 0 ? ` and ${deletedExpiredFiles} attachment file(s)` : ""));
	changes.push("Removed legacy managed outgoing image JSON after SQLite verification");
	return {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.mcp-oauth-format.ts
const MAX_TIMESTAMP_MS = 864e13;
const STORE_KEYS = /* @__PURE__ */ new Set([
	"clientInformation",
	"tokens",
	"tokenExpiresAt",
	"codeVerifier",
	"discoveryState",
	"lastAuthorizationUrl",
	"redirectUrl",
	"state"
]);
const DISCOVERY_KEYS = /* @__PURE__ */ new Set([
	"authorizationServerUrl",
	"authorizationServerMetadata",
	"resourceMetadata",
	"resourceMetadataUrl"
]);
function assertOnlyKeys$2(value, allowed, label) {
	if (Object.keys(value).some((key) => !allowed.has(key))) throw new Error(`${label} has an unexpected field`);
}
function parseSafeUrl(value, label) {
	if (typeof value !== "string") throw new Error(`${label} is not a string`);
	let parsed;
	try {
		parsed = new URL(value);
	} catch {
		throw new Error(`${label} is not a valid URL`);
	}
	if ([
		"javascript:",
		"data:",
		"vbscript:"
	].includes(parsed.protocol)) throw new Error(`${label} uses an unsafe URL scheme`);
	return value;
}
function parseDiscoveryState(value) {
	if (!isRecord$1(value)) throw new Error("legacy MCP OAuth discovery state is not an object");
	assertOnlyKeys$2(value, DISCOVERY_KEYS, "legacy MCP OAuth discovery state");
	const result = { authorizationServerUrl: parseSafeUrl(value.authorizationServerUrl, "legacy MCP OAuth authorization server URL") };
	if (value.authorizationServerMetadata !== void 0) {
		const oauth = OAuthMetadataSchema.safeParse(value.authorizationServerMetadata);
		const oidc = oauth.success ? null : OpenIdProviderDiscoveryMetadataSchema.safeParse(value.authorizationServerMetadata);
		if (!oauth.success && !oidc?.success) throw new Error("legacy MCP OAuth authorization server metadata is invalid");
		result.authorizationServerMetadata = value.authorizationServerMetadata;
	}
	if (value.resourceMetadata !== void 0) {
		if (!OAuthProtectedResourceMetadataSchema.safeParse(value.resourceMetadata).success) throw new Error("legacy MCP OAuth resource metadata is invalid");
		result.resourceMetadata = value.resourceMetadata;
	}
	if (value.resourceMetadataUrl !== void 0) result.resourceMetadataUrl = parseSafeUrl(value.resourceMetadataUrl, "legacy MCP OAuth resource metadata URL");
	return result;
}
function parseLegacyMcpOAuthStore(value) {
	if (!isRecord$1(value)) throw new Error("legacy MCP OAuth store is not an object");
	assertOnlyKeys$2(value, STORE_KEYS, "legacy MCP OAuth store");
	const result = {};
	if (value.clientInformation !== void 0) {
		if (!OAuthClientInformationSchema.safeParse(value.clientInformation).success) throw new Error("legacy MCP OAuth client information is invalid");
		result.clientInformation = value.clientInformation;
	}
	if (value.tokens !== void 0) {
		if (!OAuthTokensSchema.safeParse(value.tokens).success) throw new Error("legacy MCP OAuth tokens are invalid");
		result.tokens = value.tokens;
	}
	if (value.tokenExpiresAt !== void 0) {
		if (typeof value.tokenExpiresAt !== "number" || !Number.isFinite(value.tokenExpiresAt) || value.tokenExpiresAt < 0 || value.tokenExpiresAt > MAX_TIMESTAMP_MS) throw new Error("legacy MCP OAuth token expiry is invalid");
		if (result.tokens !== void 0) result.tokenExpiresAt = value.tokenExpiresAt;
	}
	if (value.codeVerifier !== void 0) {
		if (typeof value.codeVerifier !== "string" || value.codeVerifier.length === 0) throw new Error("legacy MCP OAuth code verifier is invalid");
		result.codeVerifier = value.codeVerifier;
	}
	if (value.discoveryState !== void 0) result.discoveryState = parseDiscoveryState(value.discoveryState);
	if (value.lastAuthorizationUrl !== void 0) result.lastAuthorizationUrl = parseSafeUrl(value.lastAuthorizationUrl, "legacy MCP OAuth authorization URL");
	if (value.redirectUrl !== void 0) result.redirectUrl = parseSafeUrl(value.redirectUrl, "legacy MCP OAuth redirect URL");
	return result;
}
//#endregion
//#region src/infra/state-migrations.mcp-oauth-lock-stale.ts
const LEGACY_LOCK_STALE_MS = 6e4;
function parseLockPayload(raw) {
	try {
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
/** Classify only retired-runtime owners whose age and process identity are provably stale. */
function isDefinitelyStaleLegacyMcpOAuthLock(params) {
	const payload = parseLockPayload(params.raw);
	if (!payload) return false;
	const pid = payload.pid;
	const createdAt = payload.createdAt;
	const starttime = payload.starttime;
	if (typeof pid !== "number" || !Number.isSafeInteger(pid) || pid <= 0 || typeof createdAt !== "string" || starttime !== void 0 && (typeof starttime !== "number" || !Number.isSafeInteger(starttime) || starttime < 0)) return false;
	const createdAtMs = Date.parse(createdAt);
	const ageMs = (params.nowMs ?? Date.now()) - createdAtMs;
	if (!Number.isFinite(createdAtMs) || new Date(createdAtMs).toISOString() !== createdAt || !Number.isFinite(ageMs) || ageMs < LEGACY_LOCK_STALE_MS) return false;
	return isLockOwnerDefinitelyStale({
		payload,
		isPidDefinitelyDead: params.isPidDefinitelyDead ?? isPidDefinitelyDead,
		getProcessStartTime: params.getProcessStartTime ?? getFileLockProcessStartTime
	});
}
//#endregion
//#region src/infra/state-migrations.mcp-oauth-lock.ts
const LOCK_RETRIES = 20;
const LOCK_RETRY_FACTOR = 1.3;
const LOCK_RETRY_MIN_MS = 25;
const LOCK_RETRY_MAX_MS = 500;
const MAX_LEGACY_LOCK_BYTES = 64 * 1024;
function retryDelayMs(attempt) {
	return Math.min(LOCK_RETRY_MAX_MS, Math.max(LOCK_RETRY_MIN_MS, LOCK_RETRY_MIN_MS * LOCK_RETRY_FACTOR ** attempt));
}
function createLockPayload() {
	const payload = {
		pid: process.pid,
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		nonce: randomUUID()
	};
	const starttime = getFileLockProcessStartTime(process.pid);
	if (starttime !== null) payload.starttime = starttime;
	return `${JSON.stringify(payload, null, 2)}\n`;
}
function isAlreadyExists(error) {
	return error.code === "already-exists";
}
function isNotFound(error) {
	const code = error.code;
	return code === "ENOENT" || code === "not-found";
}
async function hasDefinitelyStaleLock(params) {
	try {
		return isDefinitelyStaleLegacyMcpOAuthLock({ raw: (await params.stateRoot.read(params.lockRelativePath, { maxBytes: MAX_LEGACY_LOCK_BYTES })).buffer.toString("utf8") });
	} catch (error) {
		if (isNotFound(error)) return false;
		throw error;
	}
}
async function acquireRootBoundedLegacyLock(params) {
	const lockRelativePath = `${params.targetRelativePath}.lock`;
	const raw = createLockPayload();
	for (let attempt = 0;; attempt += 1) try {
		await params.stateRoot.create(lockRelativePath, raw, { mode: 384 });
		break;
	} catch (error) {
		if (!isAlreadyExists(error) || attempt >= LOCK_RETRIES) {
			if (isAlreadyExists(error)) throw new Error(`file lock timeout for ${params.targetRelativePath}`, { cause: error });
			throw error;
		}
		if (await hasDefinitelyStaleLock({
			stateRoot: params.stateRoot,
			lockRelativePath
		})) throw Object.assign(/* @__PURE__ */ new Error(`file lock stale for ${params.targetRelativePath}`), { code: "file_lock_stale" });
		await new Promise((resolve) => {
			setTimeout(resolve, retryDelayMs(attempt));
		});
	}
	return async () => {
		if (await params.stateRoot.readText(lockRelativePath) !== raw) throw new Error(`legacy file lock ownership changed for ${params.targetRelativePath}`);
		await params.stateRoot.remove(lockRelativePath);
	};
}
/** Share the retired runtime's sidecar protocol without leaving the pinned state root. */
async function withRootBoundedLegacyFileLock(params, run) {
	const release = await acquireRootBoundedLegacyLock(params);
	try {
		return await run();
	} finally {
		await release();
	}
}
//#endregion
//#region src/infra/state-migrations.mcp-oauth.ts
const LEGACY_MCP_OAUTH_DIR = "mcp-oauth";
const DOCTOR_CLAIM_SUFFIX$3 = ".doctor-importing";
const MIGRATION_KIND$3 = "legacy-mcp-oauth-json";
const MIGRATION_LOCK_TIMEOUT_MS$5 = 250;
const MIGRATION_LOCK_POLL_INTERVAL_MS$5 = 25;
const MAX_LEGACY_STORE_BYTES = 4 * 1024 * 1024;
const LEGACY_STORE_NAME_RE = /^[A-Za-z][A-Za-z0-9_-]{0,29}-[0-9a-f]{16}\.json$/u;
const utf8Decoder$2 = new TextDecoder("utf-8", { fatal: true });
function exactLegacyBaseName(name) {
	const baseName = name.endsWith(DOCTOR_CLAIM_SUFFIX$3) ? name.slice(0, -17) : name;
	return LEGACY_STORE_NAME_RE.test(baseName) ? baseName : null;
}
function exactLegacyBaseNames(entries) {
	const baseNames = /* @__PURE__ */ new Set();
	for (const entry of entries) {
		const baseName = exactLegacyBaseName(entry.name);
		if (baseName) baseNames.add(baseName);
	}
	return Array.from(baseNames).toSorted();
}
function listLegacySourcePaths(sourceDir) {
	return exactLegacyBaseNames(fs.readdirSync(sourceDir, { withFileTypes: true })).map((baseName) => path.join(sourceDir, baseName));
}
async function listLegacySourcePathsFromRoot(params) {
	return exactLegacyBaseNames(await params.stateRoot.list(LEGACY_MCP_OAUTH_DIR, { withFileTypes: true })).map((baseName) => path.join(params.stateDir, LEGACY_MCP_OAUTH_DIR, baseName));
}
function pathMayExist$1(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
/** Detect exact retired MCP OAuth filenames only for an explicit Doctor flow. */
function detectLegacyMcpOAuthStores(params) {
	const sourceDir = path.join(params.stateDir, LEGACY_MCP_OAUTH_DIR);
	if (params.doctorOnlyStateMigrations !== true) return {
		sourceDir,
		sourcePaths: [],
		hasLegacy: false
	};
	try {
		const sourcePaths = listLegacySourcePaths(sourceDir);
		return {
			sourceDir,
			sourcePaths,
			hasLegacy: sourcePaths.length > 0
		};
	} catch {
		return {
			sourceDir,
			sourcePaths: [],
			hasLegacy: pathMayExist$1(sourceDir)
		};
	}
}
function relativeLegacyPath$4(stateDir, filePath) {
	const relativePath = path.relative(path.resolve(stateDir), path.resolve(filePath));
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) throw new Error("legacy MCP OAuth path is outside the state directory");
	return relativePath;
}
async function readLegacySourceSnapshot$5(stateRoot, stateDir, sourcePath, options = {}) {
	const opened = await stateRoot.read(relativeLegacyPath$4(stateDir, sourcePath), {
		hardlinks: "reject",
		maxBytes: MAX_LEGACY_STORE_BYTES,
		symlinks: "reject"
	});
	if (opened.stat.size !== opened.buffer.byteLength) throw new Error("legacy MCP OAuth store changed while it was being read");
	const parsed = options.parseStore === false ? {} : parseLegacyMcpOAuthStore(JSON.parse(utf8Decoder$2.decode(opened.buffer)));
	return {
		sourcePath,
		dev: opened.stat.dev,
		ino: opened.stat.ino,
		mtimeMs: opened.stat.mtimeMs,
		sha256: createHash("sha256").update(opened.buffer).digest("hex"),
		size: opened.stat.size,
		store: parsed
	};
}
function snapshotsMatch$2(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mtimeMs === right.mtimeMs && left.sha256 === right.sha256 && left.size === right.size;
}
function storeKeyForSource(sourcePath) {
	const fileName = path.basename(sourcePath);
	if (!LEGACY_STORE_NAME_RE.test(fileName)) throw new Error("legacy MCP OAuth filename is invalid");
	return fileName.slice(0, -5);
}
function receiptSourceKey$1(sourcePath) {
	return `mcp-oauth-json:${createHash("sha256").update(path.resolve(sourcePath)).digest("hex")}`;
}
function readMigrationReceipt(sourcePath, env) {
	const sourceKey = receiptSourceKey$1(sourcePath);
	const { db } = openOpenClawStateDatabase({ env });
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("migration_sources").select("removed_source").where("source_key", "=", sourceKey));
	return row ? {
		sourceKey,
		removedSource: row.removed_source === 1
	} : null;
}
function importAndRecordReceipt$1(params) {
	const sourceKey = receiptSourceKey$1(params.sourcePath);
	const storeKey = storeKeyForSource(params.sourcePath);
	const runId = `${sourceKey}:${params.snapshot.sha256.slice(0, 16)}`;
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		if (executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("migration_sources").select("source_key").where("source_key", "=", sourceKey))) return {
			sourceKey,
			imported: false
		};
		const existingStore = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("mcp_oauth_stores").selectAll().where("store_key", "=", storeKey));
		let importedLegacyState;
		if (existingStore) {
			if (existingStore.format_version !== 1) throw new Error("canonical MCP OAuth store has an unsupported format version");
			const canonicalStore = parseMcpOAuthStoreJson(storeKey, existingStore.store_json);
			const canMergeLegacyState = canonicalStore.credentialState === "uninitialized";
			const legacyStore = { ...params.snapshot.store };
			if (canonicalStore.pendingAuthorizationChallenge?.resourceMetadataUrl) delete legacyStore.discoveryState;
			importedLegacyState = canMergeLegacyState && Object.keys(legacyStore).some((key) => !Object.hasOwn(canonicalStore, key));
			if (importedLegacyState) {
				const mergedStore = {
					...legacyStore,
					...canonicalStore
				};
				delete mergedStore.credentialState;
				executeSqliteQuerySync(db, stateDb.updateTable("mcp_oauth_stores").set({
					store_json: JSON.stringify(mergedStore),
					updated_at: now
				}).where("store_key", "=", storeKey));
			}
		} else {
			importedLegacyState = true;
			executeSqliteQuerySync(db, stateDb.insertInto("mcp_oauth_stores").values({
				store_key: storeKey,
				format_version: 1,
				store_json: JSON.stringify(params.snapshot.store),
				updated_at: now
			}));
		}
		const verified = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("mcp_oauth_stores").selectAll().where("store_key", "=", storeKey));
		if (!verified || verified.format_version !== 1) throw new Error("SQLite verification failed for an MCP OAuth store");
		parseMcpOAuthStoreJson(storeKey, verified.store_json);
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND$3,
			target: "mcp_oauth_stores",
			storeKey,
			sourceSha256: params.snapshot.sha256,
			importedRecordCount: importedLegacyState ? 1 : 0,
			preservedSqliteRecordCount: existingStore ? 1 : 0
		});
		executeSqliteQuerySync(db, stateDb.insertInto("migration_runs").values({
			id: runId,
			started_at: now,
			finished_at: now,
			status: "completed",
			report_json: reportJson
		}));
		executeSqliteQuerySync(db, stateDb.insertInto("migration_sources").values({
			source_key: sourceKey,
			migration_kind: MIGRATION_KIND$3,
			source_path: params.sourcePath,
			target_table: "mcp_oauth_stores",
			source_sha256: params.snapshot.sha256,
			source_size_bytes: params.snapshot.size,
			source_record_count: 1,
			last_run_id: runId,
			status: "completed",
			imported_at: now,
			removed_source: 0,
			report_json: reportJson
		}));
		return {
			sourceKey,
			imported: importedLegacyState
		};
	}, { env: params.env });
}
function markSourceRemoved$2(sourceKey, env) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("migration_sources").set({ removed_source: 1 }).where("source_key", "=", sourceKey));
	}, { env });
}
async function removePath(params) {
	if (params.removeSource) {
		await params.removeSource(params.sourcePath);
		return;
	}
	await params.stateRoot.remove(relativeLegacyPath$4(params.stateDir, params.sourcePath));
}
async function cleanupReceiptAuthoritativeSources(params) {
	let removed = 0;
	for (const candidate of [params.sourcePath, `${params.sourcePath}${DOCTOR_CLAIM_SUFFIX$3}`]) {
		if (!await params.stateRoot.exists(relativeLegacyPath$4(params.stateDir, candidate))) continue;
		await readLegacySourceSnapshot$5(params.stateRoot, params.stateDir, candidate, { parseStore: false });
		await removePath({
			...params,
			sourcePath: candidate
		});
		removed += 1;
	}
	if (!params.receipt.removedSource || removed > 0) markSourceRemoved$2(params.receipt.sourceKey, params.env);
	return removed;
}
async function restoreClaim$4(params) {
	const claimPath = `${params.sourcePath}${DOCTOR_CLAIM_SUFFIX$3}`;
	try {
		if (!await params.stateRoot.exists(relativeLegacyPath$4(params.stateDir, claimPath))) return null;
		if (await params.stateRoot.exists(relativeLegacyPath$4(params.stateDir, params.sourcePath))) return `source path already exists: ${params.sourcePath}`;
		await params.stateRoot.move(relativeLegacyPath$4(params.stateDir, claimPath), relativeLegacyPath$4(params.stateDir, params.sourcePath));
		return null;
	} catch (error) {
		return String(error);
	}
}
async function migrateOneStore(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	const receipt = readMigrationReceipt(params.sourcePath, params.env);
	if (receipt) {
		try {
			if (await cleanupReceiptAuthoritativeSources({
				...params,
				receipt
			}) > 0) changes.push("Discarded recreated retired MCP OAuth JSON without importing it.");
		} catch (error) {
			warnings.push(`MCP OAuth state is in SQLite, but legacy cleanup failed: ${String(error)}`);
		}
		return notices.length > 0 ? {
			changes,
			warnings,
			notices
		} : {
			changes,
			warnings
		};
	}
	const claimPath = `${params.sourcePath}${DOCTOR_CLAIM_SUFFIX$3}`;
	const hasSource = await params.stateRoot.exists(relativeLegacyPath$4(params.stateDir, params.sourcePath));
	const hasClaim = await params.stateRoot.exists(relativeLegacyPath$4(params.stateDir, claimPath));
	if (hasSource && hasClaim) return {
		changes,
		warnings: [`Failed migrating legacy MCP OAuth store ${path.basename(params.sourcePath)}: source and interrupted claim both exist.`]
	};
	const activePath = hasSource ? params.sourcePath : hasClaim ? claimPath : null;
	if (!activePath) return {
		changes,
		warnings
	};
	let snapshot;
	try {
		snapshot = await readLegacySourceSnapshot$5(params.stateRoot, params.stateDir, activePath);
	} catch (error) {
		warnings.push(`Failed reading legacy MCP OAuth store ${path.basename(params.sourcePath)}: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	if (activePath === params.sourcePath) try {
		params.beforeClaim?.(params.sourcePath);
		await params.stateRoot.move(relativeLegacyPath$4(params.stateDir, params.sourcePath), relativeLegacyPath$4(params.stateDir, claimPath));
		const claimed = await readLegacySourceSnapshot$5(params.stateRoot, params.stateDir, claimPath);
		if (!snapshotsMatch$2(snapshot, claimed)) throw new Error("legacy MCP OAuth source changed before Doctor could claim it");
		snapshot = claimed;
	} catch (error) {
		const restoreError = await restoreClaim$4(params);
		warnings.push(`Failed migrating legacy MCP OAuth store ${path.basename(params.sourcePath)}: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	let result;
	try {
		result = importAndRecordReceipt$1({
			env: params.env,
			sourcePath: params.sourcePath,
			snapshot
		});
	} catch (error) {
		const restoreError = await restoreClaim$4(params);
		warnings.push(`Failed migrating legacy MCP OAuth store ${path.basename(params.sourcePath)}: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	try {
		if (await params.stateRoot.exists(relativeLegacyPath$4(params.stateDir, params.sourcePath))) throw new Error("legacy MCP OAuth source reappeared during import");
		const finalSnapshot = await readLegacySourceSnapshot$5(params.stateRoot, params.stateDir, claimPath);
		if (!snapshotsMatch$2(snapshot, finalSnapshot)) throw new Error("legacy MCP OAuth claim changed after SQLite import");
		await removePath({
			...params,
			sourcePath: claimPath
		});
		if (await params.stateRoot.exists(relativeLegacyPath$4(params.stateDir, claimPath))) throw new Error("legacy MCP OAuth Doctor claim remains after cleanup");
		markSourceRemoved$2(result.sourceKey, params.env);
	} catch (error) {
		warnings.push(`MCP OAuth state is in SQLite, but legacy cleanup failed: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	changes.push(result.imported ? `Migrated MCP OAuth store ${path.basename(params.sourcePath)} to SQLite.` : `Preserved canonical SQLite MCP OAuth store for ${path.basename(params.sourcePath)}.`);
	notices.push("Removed retired MCP OAuth JSON after verified SQLite import.");
	return {
		changes,
		warnings,
		notices
	};
}
async function migrateWithExclusiveStateOwnership$3(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	let sourcePaths;
	try {
		sourcePaths = await listLegacySourcePathsFromRoot(params);
	} catch (error) {
		const code = error.code;
		if (code === "ENOENT" || code === "not-found") return {
			changes,
			warnings
		};
		return {
			changes,
			warnings: [`Failed reading legacy MCP OAuth directory: ${String(error)}`]
		};
	}
	for (const sourcePath of sourcePaths) try {
		params.beforeLegacyLock?.(sourcePath);
		const result = await withRootBoundedLegacyFileLock({
			stateRoot: params.stateRoot,
			targetRelativePath: relativeLegacyPath$4(params.stateDir, sourcePath)
		}, async () => await migrateOneStore({
			...params,
			sourcePath
		}));
		changes.push(...result.changes);
		warnings.push(...result.warnings);
		notices.push(...result.notices ?? []);
	} catch (error) {
		const staleGuidance = error.code === "file_lock_stale" ? " Verify no older OpenClaw process is running, remove the retired .lock sidecar, and rerun Doctor." : "";
		warnings.push(`Failed locking legacy MCP OAuth store ${path.basename(sourcePath)}: ${String(error)}.${staleGuidance}`);
	}
	return notices.length > 0 ? {
		changes,
		warnings,
		notices
	} : {
		changes,
		warnings
	};
}
/** Import retired MCP OAuth stores while excluding old Gateways that can recreate them. */
async function migrateLegacyMcpOAuthStores(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	const env = {
		...params.env ?? process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env,
			pollIntervalMs: MIGRATION_LOCK_POLL_INTERVAL_MS$5,
			role: "sqlite-maintenance",
			timeoutMs: MIGRATION_LOCK_TIMEOUT_MS$5
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed migrating legacy MCP OAuth stores: ${error instanceof GatewayLockError ? "the Gateway or another SQLite maintenance command owns this state directory" : String(error)}. Stop the Gateway and run \`openclaw doctor --fix\` again.`]
		};
	}
	if (!lock) return {
		changes: [],
		warnings: ["Failed migrating legacy MCP OAuth stores: exclusive state ownership unavailable."]
	};
	let result = {
		changes: [],
		warnings: []
	};
	let releaseError;
	try {
		try {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				maxBytes: MAX_LEGACY_STORE_BYTES,
				symlinks: "reject"
			});
			result = await migrateWithExclusiveStateOwnership$3({
				...params,
				env,
				stateRoot
			});
		} catch (error) {
			result.warnings.push(`Failed reading legacy MCP OAuth state: ${String(error)}`);
		}
	} finally {
		try {
			await lock.release();
		} catch (error) {
			releaseError = error;
		}
	}
	if (releaseError) result.warnings.push(`MCP OAuth migration lock release failed: ${formatErrorMessage(releaseError)}`);
	return result;
}
//#endregion
//#region src/infra/state-migrations.messages.ts
function mergeNotices(sources) {
	return [...new Set(sources.flatMap((source) => source?.notices ? [...source.notices] : []))];
}
//#endregion
//#region src/infra/state-migrations.node-host.ts
const LEGACY_NODE_HOST_MAX_BYTES = 64 * 1024;
const MIGRATION_LOCK_TIMEOUT_MS$4 = 250;
const MIGRATION_LOCK_POLL_INTERVAL_MS$4 = 25;
const CONFIG_KEYS = /* @__PURE__ */ new Set([
	"version",
	"nodeId",
	"token",
	"displayName",
	"gateway"
]);
const GATEWAY_KEYS = /* @__PURE__ */ new Set([
	"host",
	"port",
	"tls",
	"tlsFingerprint",
	"contextPath"
]);
function legacyPathMayExist$3(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
function sourceOrClaimMayExist$3(sourcePath) {
	return legacyPathMayExist$3(sourcePath) || legacyPathMayExist$3(`${sourcePath}.doctor-importing`);
}
/** Detect retired node-host state only when an explicit Doctor flow opts in. */
function detectLegacyNodeHostConfig(params) {
	const sourcePath = path.join(params.stateDir, LEGACY_NODE_HOST_CONFIG_FILE);
	return {
		sourcePath,
		hasLegacy: params.doctorOnlyStateMigrations === true && sourceOrClaimMayExist$3(sourcePath)
	};
}
function relativeLegacyPath$3(stateDir, filePath) {
	const relativePath = path.relative(path.resolve(stateDir), path.resolve(filePath));
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) throw new Error(`legacy node-host path is outside the state directory: ${filePath}`);
	return relativePath;
}
async function readLegacySourceSnapshot$4(stateRoot, stateDir, sourcePath) {
	const opened = await stateRoot.read(relativeLegacyPath$3(stateDir, sourcePath), {
		hardlinks: "reject",
		maxBytes: LEGACY_NODE_HOST_MAX_BYTES,
		symlinks: "reject"
	});
	const raw = opened.buffer.toString("utf8");
	return {
		sourcePath,
		dev: opened.stat.dev,
		ino: opened.stat.ino,
		mtimeMs: opened.stat.mtimeMs,
		raw,
		sha256: createHash("sha256").update(raw).digest("hex"),
		size: opened.stat.size
	};
}
function sourceSnapshotsMatch$2(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mtimeMs === right.mtimeMs && left.sha256 === right.sha256 && left.size === right.size;
}
function contentSnapshotsMatch$1(left, right) {
	return left.sha256 === right.sha256 && left.size === right.size;
}
async function recoverInterruptedClaim$3(stateRoot, stateDir, sourcePath) {
	const claimPath = `${sourcePath}${LEGACY_NODE_HOST_CONFIG_CLAIM_SUFFIX}`;
	const claimRelativePath = relativeLegacyPath$3(stateDir, claimPath);
	const sourceRelativePath = relativeLegacyPath$3(stateDir, sourcePath);
	if (!await stateRoot.exists(claimRelativePath)) return;
	const claim = await readLegacySourceSnapshot$4(stateRoot, stateDir, claimPath);
	if (!await stateRoot.exists(sourceRelativePath)) {
		await stateRoot.move(claimRelativePath, sourceRelativePath);
		return;
	}
	if (!contentSnapshotsMatch$1(claim, await readLegacySourceSnapshot$4(stateRoot, stateDir, sourcePath))) throw new Error("interrupted node-host Doctor claim conflicts with its source");
	await stateRoot.remove(claimRelativePath);
}
function assertOnlyKeys$1(value, allowed, label) {
	const unexpected = Object.keys(value).find((key) => !allowed.has(key));
	if (unexpected) throw new Error(`${label} has unexpected field ${unexpected}`);
}
function optionalLegacyString(value, label) {
	if (value === void 0) return;
	if (typeof value !== "string" || !value.trim()) throw new Error(`${label} must be a non-empty string`);
	return value.trim();
}
function optionalLegacyContextPath(value) {
	if (value === void 0) return;
	if (typeof value !== "string") throw new Error("legacy node-host gateway contextPath must be a string");
	return value.trim() || void 0;
}
function parseLegacyGateway(value) {
	if (value === void 0) return;
	if (!isRecord$1(value)) throw new Error("legacy node-host gateway must be an object");
	assertOnlyKeys$1(value, GATEWAY_KEYS, "legacy node-host gateway");
	const port = value.port;
	if (port !== void 0 && (typeof port !== "number" || !Number.isSafeInteger(port) || port <= 0 || port > 65535)) throw new Error("legacy node-host gateway port is invalid");
	if (value.tls !== void 0 && typeof value.tls !== "boolean") throw new Error("legacy node-host gateway tls must be a boolean");
	const gateway = {
		host: optionalLegacyString(value.host, "legacy node-host gateway host"),
		port,
		tls: value.tls,
		tlsFingerprint: optionalLegacyString(value.tlsFingerprint, "legacy node-host gateway tlsFingerprint"),
		contextPath: optionalLegacyContextPath(value.contextPath)
	};
	return Object.values(gateway).some((entry) => entry !== void 0) ? gateway : void 0;
}
function parseLegacyNodeHostConfig(snapshot) {
	const parsed = JSON.parse(snapshot.raw);
	if (!isRecord$1(parsed)) throw new Error("legacy node-host config must be an object");
	assertOnlyKeys$1(parsed, CONFIG_KEYS, "legacy node-host config");
	if (parsed.version !== 1) throw new Error("legacy node-host config version must be 1");
	if (typeof parsed.nodeId !== "string" || !parsed.nodeId.trim()) throw new Error("legacy node-host nodeId must be a non-empty string");
	if (parsed.token !== void 0 && typeof parsed.token !== "string") throw new Error("legacy node-host token must be a string when present");
	return {
		config: {
			version: 1,
			nodeId: parsed.nodeId.trim(),
			displayName: optionalLegacyString(parsed.displayName, "legacy node-host displayName"),
			gateway: parseLegacyGateway(parsed.gateway)
		},
		updatedAtMs: Math.max(0, Math.floor(snapshot.mtimeMs))
	};
}
function nullableNonEmptyString(value, label) {
	if (value === null) return;
	if (!value.trim()) throw new Error(`invalid node-host SQLite row: ${label} must not be empty`);
	return value.trim();
}
function rowToCanonicalState(row) {
	if (row.version !== 1 || !row.node_id.trim()) throw new Error("invalid canonical node-host SQLite identity");
	if (!Number.isSafeInteger(row.updated_at_ms) || row.updated_at_ms < 0) throw new Error("invalid canonical node-host SQLite timestamp");
	if (row.gateway_port !== null && (!Number.isSafeInteger(row.gateway_port) || row.gateway_port <= 0 || row.gateway_port > 65535)) throw new Error("invalid canonical node-host SQLite gateway port");
	if (row.gateway_tls !== null && row.gateway_tls !== 0 && row.gateway_tls !== 1) throw new Error("invalid canonical node-host SQLite gateway tls");
	const gateway = {
		host: nullableNonEmptyString(row.gateway_host, "gateway_host"),
		port: row.gateway_port ?? void 0,
		tls: row.gateway_tls === null ? void 0 : row.gateway_tls === 1,
		tlsFingerprint: nullableNonEmptyString(row.gateway_tls_fingerprint, "gateway_tls_fingerprint"),
		contextPath: nullableNonEmptyString(row.gateway_context_path, "gateway_context_path")
	};
	return {
		config: {
			version: 1,
			nodeId: row.node_id.trim(),
			displayName: nullableNonEmptyString(row.display_name, "display_name"),
			gateway: Object.values(gateway).some((entry) => entry !== void 0) ? gateway : void 0
		},
		updatedAtMs: row.updated_at_ms
	};
}
function configsEqual(left, right) {
	return left.nodeId === right.nodeId && left.displayName === right.displayName && left.gateway?.host === right.gateway?.host && left.gateway?.port === right.gateway?.port && left.gateway?.tls === right.gateway?.tls && left.gateway?.tlsFingerprint === right.gateway?.tlsFingerprint && left.gateway?.contextPath === right.gateway?.contextPath;
}
function writeCanonicalState(db, state) {
	const gateway = state.config.gateway;
	const row = {
		config_key: NODE_HOST_CONFIG_KEY,
		version: 1,
		node_id: state.config.nodeId,
		token: null,
		display_name: state.config.displayName ?? null,
		gateway_host: gateway?.host ?? null,
		gateway_port: gateway?.port ?? null,
		gateway_tls: gateway?.tls === void 0 ? null : gateway.tls ? 1 : 0,
		gateway_tls_fingerprint: gateway?.tlsFingerprint ?? null,
		gateway_context_path: gateway?.contextPath ?? null,
		updated_at_ms: state.updatedAtMs
	};
	const { config_key: _configKey, ...updates } = row;
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("node_host_config").values(row).onConflict((conflict) => conflict.column("config_key").doUpdateSet(updates)));
}
function migrateIntoDatabase$1(params) {
	let imported = false;
	let preservedCanonical = false;
	runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const row = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("node_host_config").selectAll().where("config_key", "=", NODE_HOST_CONFIG_KEY));
		const existing = row ? rowToCanonicalState(row) : null;
		if (existing && existing.config.nodeId !== params.legacy.config.nodeId) throw new Error("legacy node-host nodeId conflicts with canonical SQLite identity");
		let expected = params.legacy;
		if (existing) {
			if (configsEqual(existing.config, params.legacy.config)) expected = existing.updatedAtMs >= params.legacy.updatedAtMs ? existing : params.legacy;
			else if (existing.updatedAtMs === params.legacy.updatedAtMs) throw new Error("legacy node-host config diverges at the same timestamp");
			else if (existing.updatedAtMs > params.legacy.updatedAtMs) {
				expected = existing;
				preservedCanonical = true;
			}
		}
		if (!existing || !configsEqual(existing.config, expected.config) || existing.updatedAtMs !== expected.updatedAtMs || row?.token !== null) {
			writeCanonicalState(db, expected);
			imported = expected === params.legacy;
		}
		const verifiedRow = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("node_host_config").selectAll().where("config_key", "=", NODE_HOST_CONFIG_KEY));
		if (!verifiedRow || verifiedRow.token !== null) throw new Error("SQLite verification failed for node-host config");
		const verified = rowToCanonicalState(verifiedRow);
		if (!configsEqual(verified.config, expected.config) || verified.updatedAtMs !== expected.updatedAtMs) throw new Error("SQLite verification failed for node-host config");
	}, { env: params.env });
	return {
		imported,
		preservedCanonical
	};
}
async function restoreClaim$3(params) {
	const claimPath = `${params.snapshot.sourcePath}${LEGACY_NODE_HOST_CONFIG_CLAIM_SUFFIX}`;
	try {
		if (!await params.stateRoot.exists(relativeLegacyPath$3(params.stateDir, claimPath))) return null;
		if (await params.stateRoot.exists(relativeLegacyPath$3(params.stateDir, params.snapshot.sourcePath))) return `source path already exists: ${params.snapshot.sourcePath}`;
		await params.stateRoot.move(relativeLegacyPath$3(params.stateDir, claimPath), relativeLegacyPath$3(params.stateDir, params.snapshot.sourcePath));
		return null;
	} catch (error) {
		return String(error);
	}
}
async function migrateWithExclusiveStateOwnership$2(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	const changes = [];
	const warnings = [];
	const notices = [];
	const sourcePath = params.detected.sourcePath;
	let snapshot;
	let legacy;
	try {
		await recoverInterruptedClaim$3(params.stateRoot, params.stateDir, sourcePath);
		if (!await params.stateRoot.exists(relativeLegacyPath$3(params.stateDir, sourcePath))) return {
			changes,
			warnings
		};
		snapshot = await readLegacySourceSnapshot$4(params.stateRoot, params.stateDir, sourcePath);
		legacy = parseLegacyNodeHostConfig(snapshot);
		params.beforeVerify?.();
		if (!sourceSnapshotsMatch$2(await readLegacySourceSnapshot$4(params.stateRoot, params.stateDir, sourcePath), snapshot)) throw new Error("legacy node-host source changed after Doctor loaded it");
	} catch (error) {
		warnings.push(`Failed reading legacy node-host state: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	const claimPath = `${sourcePath}${LEGACY_NODE_HOST_CONFIG_CLAIM_SUFFIX}`;
	try {
		params.beforeClaim?.();
		await params.stateRoot.move(relativeLegacyPath$3(params.stateDir, sourcePath), relativeLegacyPath$3(params.stateDir, claimPath));
		if (!sourceSnapshotsMatch$2(await readLegacySourceSnapshot$4(params.stateRoot, params.stateDir, claimPath), snapshot)) throw new Error("legacy node-host source changed before Doctor could claim it");
	} catch (error) {
		const restoreError = await restoreClaim$3({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			snapshot
		});
		warnings.push(`Failed migrating legacy node-host state: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	let result;
	try {
		result = migrateIntoDatabase$1({
			env: params.env,
			legacy
		});
	} catch (error) {
		const restoreError = await restoreClaim$3({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			snapshot
		});
		warnings.push(`Failed migrating legacy node-host state: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	try {
		if (await params.stateRoot.exists(relativeLegacyPath$3(params.stateDir, sourcePath))) throw new Error(`legacy node-host source reappeared during import: ${sourcePath}`);
		if (params.removeSource) await params.removeSource(claimPath);
		else await params.stateRoot.remove(relativeLegacyPath$3(params.stateDir, claimPath));
		if (await params.stateRoot.exists(relativeLegacyPath$3(params.stateDir, sourcePath)) || await params.stateRoot.exists(relativeLegacyPath$3(params.stateDir, claimPath))) throw new Error("legacy node-host source or Doctor claim remains after cleanup");
	} catch (error) {
		warnings.push(`Node-host state is in SQLite, but legacy cleanup failed: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	changes.push(result.preservedCanonical ? "Kept newer canonical node-host SQLite state." : result.imported ? "Migrated node-host config to shared SQLite state." : "Verified node-host config in shared SQLite state.");
	notices.push("Removed retired node.json after verified SQLite import.");
	return {
		changes,
		warnings,
		notices
	};
}
/** Import retired node-host state while excluding active Gateway/state maintenance owners. */
async function migrateLegacyNodeHostConfig(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	const env = {
		...params.env ?? process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env,
			pollIntervalMs: MIGRATION_LOCK_POLL_INTERVAL_MS$4,
			role: "sqlite-maintenance",
			timeoutMs: MIGRATION_LOCK_TIMEOUT_MS$4
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed migrating legacy node-host state: ${error instanceof GatewayLockError ? "the Gateway or another SQLite maintenance command owns this state directory" : String(error)}. Stop the Gateway and node host, then run \`openclaw doctor --fix\` again.`]
		};
	}
	if (!lock) return {
		changes: [],
		warnings: ["Failed migrating legacy node-host state: exclusive state ownership unavailable."]
	};
	let result = {
		changes: [],
		warnings: []
	};
	let releaseError;
	try {
		try {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				maxBytes: LEGACY_NODE_HOST_MAX_BYTES,
				symlinks: "reject"
			});
			result = await migrateWithExclusiveStateOwnership$2({
				...params,
				env,
				stateRoot
			});
		} catch (error) {
			result.warnings.push(`Failed reading legacy node-host state: ${String(error)}`);
		}
	} finally {
		try {
			await lock.release();
		} catch (error) {
			releaseError = error;
		}
	}
	if (releaseError) result.warnings.push(`Node-host migration lock release failed: ${formatErrorMessage(releaseError)}`);
	return result;
}
//#endregion
//#region src/infra/state-migrations.task-sidecar-rows.ts
function normalizeLegacySqliteInteger(value) {
	if (typeof value === "bigint") return Number(value);
	return value;
}
function listSqliteColumns(db, table) {
	const rows = db.prepare(`PRAGMA table_info(${table})`).all();
	return new Set(rows.flatMap((row) => row.name ? [row.name] : []));
}
function pickLegacyColumn(columns, name, fallbackSql = "NULL") {
	return columns.has(name) ? name : `${fallbackSql} AS ${name}`;
}
function legacyBindValue(value) {
	if (value == null || typeof value === "string" || typeof value === "number" || typeof value === "bigint" || value instanceof Uint8Array) return value ?? null;
	return JSON.stringify(value);
}
function legacyStringValue(value) {
	return typeof value === "string" ? value : "";
}
function normalizeLegacyTaskRow(row) {
	const runtime = legacyStringValue(row.runtime);
	const sourceId = typeof row.source_id === "string" ? row.source_id : "";
	const taskId = legacyStringValue(row.task_id);
	const ownerRaw = typeof row.owner_key === "string" ? row.owner_key.trim() : "";
	const requesterRaw = typeof row.requester_session_key === "string" ? row.requester_session_key.trim() : "";
	const ownerKey = ownerRaw || requesterRaw || `system:${runtime}:${sourceId || taskId}`;
	const scopeKind = (typeof row.scope_kind === "string" ? row.scope_kind : "") === "system" || ownerKey.startsWith("system:") ? "system" : "session";
	const childSessionKey = typeof row.child_session_key === "string" ? row.child_session_key.trim() : "";
	const persistedAgentId = typeof row.agent_id === "string" ? row.agent_id.trim() : "";
	const isSpawnRuntime = runtime === "subagent" || runtime === "acp";
	const childAgentId = isSpawnRuntime ? parseAgentSessionKey(childSessionKey)?.agentId : void 0;
	const requesterAgentId = (typeof row.requester_agent_id === "string" ? row.requester_agent_id.trim() : "") || (isSpawnRuntime ? parseAgentSessionKey(ownerKey)?.agentId ?? parseAgentSessionKey(requesterRaw)?.agentId ?? (childAgentId && persistedAgentId !== childAgentId ? persistedAgentId : "") : "");
	const executorAgentId = requesterAgentId ? childAgentId || persistedAgentId : persistedAgentId;
	const deliveryStatus = row.delivery_status === "not-requested" ? "not_applicable" : row.delivery_status;
	return {
		task_id: taskId,
		runtime,
		task_kind: legacyBindValue(row.task_kind),
		source_id: legacyBindValue(row.source_id),
		requester_session_key: scopeKind === "system" ? "" : requesterRaw || ownerKey,
		owner_key: ownerKey,
		scope_kind: scopeKind,
		child_session_key: childSessionKey || null,
		parent_flow_id: legacyBindValue(row.parent_flow_id),
		parent_task_id: legacyBindValue(row.parent_task_id),
		agent_id: executorAgentId || null,
		requester_agent_id: requesterAgentId || null,
		run_id: legacyBindValue(row.run_id),
		label: legacyBindValue(row.label),
		task: legacyBindValue(row.task ?? ""),
		status: legacyBindValue(row.status ?? ""),
		delivery_status: legacyBindValue(deliveryStatus ?? ""),
		notify_policy: legacyBindValue(row.notify_policy ?? ""),
		created_at: normalizeLegacySqliteInteger(row.created_at) ?? 0,
		started_at: normalizeLegacySqliteInteger(row.started_at),
		ended_at: normalizeLegacySqliteInteger(row.ended_at),
		last_event_at: normalizeLegacySqliteInteger(row.last_event_at),
		cleanup_after: normalizeLegacySqliteInteger(row.cleanup_after),
		error: legacyBindValue(row.error),
		progress_summary: legacyBindValue(row.progress_summary),
		terminal_summary: legacyBindValue(row.terminal_summary),
		terminal_outcome: legacyBindValue(row.terminal_outcome),
		detail_json: legacyBindValue(row.detail_json)
	};
}
function readLegacyTaskRows(sourcePath) {
	const db = new (requireNodeSqlite()).DatabaseSync(sourcePath, { readOnly: true });
	try {
		const columns = listSqliteColumns(db, "task_runs");
		if (columns.size === 0) return [];
		const selectColumns = [
			"task_id",
			"runtime",
			pickLegacyColumn(columns, "task_kind"),
			pickLegacyColumn(columns, "source_id"),
			pickLegacyColumn(columns, "requester_session_key"),
			pickLegacyColumn(columns, "owner_key"),
			pickLegacyColumn(columns, "scope_kind"),
			pickLegacyColumn(columns, "child_session_key"),
			pickLegacyColumn(columns, "parent_flow_id"),
			pickLegacyColumn(columns, "parent_task_id"),
			pickLegacyColumn(columns, "agent_id"),
			pickLegacyColumn(columns, "requester_agent_id"),
			pickLegacyColumn(columns, "run_id"),
			pickLegacyColumn(columns, "label"),
			"task",
			"status",
			"delivery_status",
			"notify_policy",
			"created_at",
			pickLegacyColumn(columns, "started_at"),
			pickLegacyColumn(columns, "ended_at"),
			pickLegacyColumn(columns, "last_event_at"),
			pickLegacyColumn(columns, "cleanup_after"),
			pickLegacyColumn(columns, "error"),
			pickLegacyColumn(columns, "progress_summary"),
			pickLegacyColumn(columns, "terminal_summary"),
			pickLegacyColumn(columns, "terminal_outcome"),
			pickLegacyColumn(columns, "detail_json")
		];
		return db.prepare(`SELECT ${selectColumns.join(", ")} FROM task_runs ORDER BY created_at ASC, task_id ASC`).all().map((row) => normalizeLegacyTaskRow(row));
	} finally {
		db.close();
	}
}
function readLegacyTaskDeliveryRows(sourcePath) {
	const db = new (requireNodeSqlite()).DatabaseSync(sourcePath, { readOnly: true });
	try {
		if (listSqliteColumns(db, "task_delivery_state").size === 0) return [];
		return db.prepare(`SELECT task_id, requester_origin_json, last_notified_event_at FROM task_delivery_state ORDER BY task_id ASC`).all();
	} finally {
		db.close();
	}
}
function insertTaskRunRowSql(db, row) {
	db.prepare(`
      INSERT INTO task_runs (
        task_id, runtime, task_kind, source_id, requester_session_key, owner_key, scope_kind,
        child_session_key, parent_flow_id, parent_task_id, agent_id, requester_agent_id, run_id,
        label, task, status, delivery_status, notify_policy, created_at, started_at, ended_at,
        last_event_at, cleanup_after, error, progress_summary, terminal_summary, terminal_outcome,
        detail_json
      ) VALUES (
        @task_id, @runtime, @task_kind, @source_id, @requester_session_key, @owner_key,
        @scope_kind, @child_session_key, @parent_flow_id, @parent_task_id, @agent_id,
        @requester_agent_id, @run_id, @label, @task, @status, @delivery_status, @notify_policy,
        @created_at, @started_at, @ended_at, @last_event_at, @cleanup_after, @error,
        @progress_summary, @terminal_summary, @terminal_outcome, @detail_json
      )
    `).run(row);
}
function insertTaskDeliveryRowSql(db, row) {
	db.prepare(`
      INSERT INTO task_delivery_state (
        task_id, requester_origin_json, last_notified_event_at
      ) VALUES (
        @task_id, @requester_origin_json, @last_notified_event_at
      )
    `).run(row);
}
//#endregion
//#region src/infra/state-migrations.storage.ts
const PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES = [
	"",
	"-shm",
	"-wal",
	"-journal"
];
const TASK_STATE_SQLITE_SIDECAR_SUFFIXES = [
	"",
	"-shm",
	"-wal",
	"-journal"
];
const LEGACY_DELIVERY_QUEUE_DIRS = [{
	label: "outbound delivery queue",
	queueName: "outbound",
	dirName: "delivery-queue"
}, {
	label: "session delivery queue",
	queueName: "session",
	dirName: "session-delivery-queue"
}];
var LegacyTaskStateSidecarConflictError = class extends Error {
	constructor(conflictedKeys) {
		super("legacy task-state sidecar conflicts with shared state");
		this.conflictedKeys = conflictedKeys;
	}
};
function buildLegacyMigrationPreview(plan) {
	if (plan.kind === "plugin-state-import") return plan.preview ?? `- ${plan.label}: ${plan.sourcePath}`;
	return `- ${plan.label}: ${plan.sourcePath} → ${plan.targetPath}`;
}
function resolveLegacyPluginStateSidecarPath(stateDir) {
	return path.join(stateDir, "plugin-state", "state.sqlite");
}
function resolveLegacyTaskRunsSidecarPath(stateDir) {
	return path.join(stateDir, "tasks", "runs.sqlite");
}
function resolveLegacyFlowRunsSidecarPath(stateDir) {
	return path.join(stateDir, "flows", "registry.sqlite");
}
function readLegacyPluginStateSidecarRows(sourcePath) {
	const db = new (requireNodeSqlite()).DatabaseSync(sourcePath, { readOnly: true });
	try {
		return db.prepare(`
          SELECT plugin_id, namespace, entry_key, value_json, created_at, expires_at
          FROM plugin_state_entries
          ORDER BY plugin_id ASC, namespace ASC, entry_key ASC
        `).all();
	} finally {
		db.close();
	}
}
function legacyPluginStateRowsMatch(existing, legacy) {
	return existing.value_json === legacy.value_json && normalizeLegacySqliteInteger(existing.created_at) === normalizeLegacySqliteInteger(legacy.created_at) && normalizeLegacySqliteInteger(existing.expires_at) === normalizeLegacySqliteInteger(legacy.expires_at);
}
function isLegacyPluginStateRowExpired(row, now) {
	const expiresAt = normalizeLegacySqliteInteger(row.expires_at);
	return expiresAt !== null && expiresAt <= now;
}
function hasPendingSqliteSidecarArchive(sourcePath, suffixes) {
	return !fileExists(sourcePath) && fileExists(`${sourcePath}.migrated`) && suffixes.some((suffix) => suffix !== "" && fileExists(`${sourcePath}${suffix}`));
}
function firstFreeArchivePath(sourcePath) {
	for (let index = 2;; index++) {
		const candidate = `${sourcePath}.migrated.${index}`;
		if (!fs.existsSync(candidate)) return candidate;
	}
}
function archiveLegacyFileSource(params) {
	const archivedPath = `${params.sourcePath}.migrated`;
	try {
		if (fileExists(archivedPath)) {
			if (fs.readFileSync(params.sourcePath).equals(fs.readFileSync(archivedPath))) {
				fs.rmSync(params.sourcePath, { force: true });
				return {
					sourcePath: params.sourcePath,
					targetPath: archivedPath,
					action: "removed"
				};
			}
			const nextArchivePath = firstFreeArchivePath(params.sourcePath);
			fs.renameSync(params.sourcePath, nextArchivePath);
			return {
				sourcePath: params.sourcePath,
				targetPath: nextArchivePath,
				action: "archived"
			};
		}
		fs.renameSync(params.sourcePath, archivedPath);
		return {
			sourcePath: params.sourcePath,
			targetPath: archivedPath,
			action: "archived"
		};
	} catch (err) {
		params.warnings.push(`Failed archiving ${params.label} ${params.sourcePath}: ${String(err)}`);
		return null;
	}
}
function recordArchiveCollisionResolutions(changes, label, resolutions) {
	for (const resolution of resolutions) changes.push(resolution.action === "removed" ? `Removed already-archived ${label} legacy source ${resolution.sourcePath}` : `Archived ${label} legacy source → ${resolution.targetPath}`);
}
function archiveLegacyPluginStateSidecar(params) {
	const existingSources = PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES.map((suffix) => `${params.sourcePath}${suffix}`).filter(fileExists);
	if (existingSources.length === 0) return;
	const resolutions = [];
	for (const sourcePath of existingSources) {
		const resolution = archiveLegacyFileSource({
			sourcePath,
			label: "plugin-state sidecar",
			warnings: params.warnings
		});
		if (!resolution) return;
		resolutions.push(resolution);
	}
	if (resolutions.every((resolution) => resolution.action === "archived" && resolution.targetPath === `${resolution.sourcePath}.migrated`)) params.changes.push(`Archived plugin-state sidecar legacy source → ${params.sourcePath}.migrated`);
	else recordArchiveCollisionResolutions(params.changes, "plugin-state sidecar", resolutions);
}
function readLegacyInstalledPluginIndex(sourcePath) {
	try {
		const parsed = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
		const current = parseInstalledPluginIndex(parsed);
		if (current) return current;
		const installRecords = readLegacyTopLevelInstallRecords(parsed) ?? readLegacyEmbeddedInstallRecords(parsed);
		if (!installRecords || typeof installRecords !== "object" || Array.isArray(installRecords)) return null;
		return parseInstalledPluginIndex({
			version: 1,
			hostContractVersion: "legacy",
			compatRegistryVersion: "legacy",
			migrationVersion: 1,
			policyHash: "legacy",
			generatedAtMs: 0,
			installRecords,
			plugins: [],
			diagnostics: []
		});
	} catch {
		return null;
	}
}
function readLegacyTopLevelInstallRecords(parsed) {
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
	const legacy = parsed;
	return legacy.installRecords ?? legacy.records;
}
function readLegacyEmbeddedInstallRecords(parsed) {
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
	const plugins = parsed.plugins;
	if (!Array.isArray(plugins)) return null;
	const records = {};
	for (const plugin of plugins) {
		if (!plugin || typeof plugin !== "object" || Array.isArray(plugin)) continue;
		const pluginId = plugin.pluginId;
		const installRecord = plugin.installRecord;
		if (typeof pluginId === "string" && pluginId.trim() && installRecord && typeof installRecord === "object" && !Array.isArray(installRecord)) records[pluginId] = installRecord;
	}
	return Object.keys(records).length > 0 ? records : null;
}
function legacyInstalledPluginIndexMatches(current, legacy) {
	return JSON.stringify(current.installRecords) === JSON.stringify(legacy.installRecords) && JSON.stringify(current.plugins) === JSON.stringify(legacy.plugins) && JSON.stringify(current.diagnostics) === JSON.stringify(legacy.diagnostics);
}
function readInstallRecordField(record, key) {
	return record[key];
}
function readInstallRecordStringField(record, key) {
	const value = readInstallRecordField(record, key);
	return typeof value === "string" ? value : void 0;
}
function legacyInstallRecordHasCurrentResolvedIdentity(params) {
	const { currentRecord, legacyRecord } = params;
	const currentResolvedSpec = readInstallRecordStringField(currentRecord, "resolvedSpec");
	const legacySpec = readInstallRecordStringField(legacyRecord, "spec");
	if (legacySpec) return currentResolvedSpec === legacySpec;
	const legacyResolvedSpec = readInstallRecordStringField(legacyRecord, "resolvedSpec");
	return Boolean(legacyResolvedSpec && currentResolvedSpec === legacyResolvedSpec);
}
function readAuthoritativeCurrentNpmIdentity(record) {
	const resolvedName = readInstallRecordStringField(record, "resolvedName");
	const resolvedVersion = readInstallRecordStringField(record, "resolvedVersion");
	if (resolvedName && resolvedVersion) return {
		name: resolvedName,
		version: resolvedVersion
	};
	const resolvedSpec = readInstallRecordStringField(record, "resolvedSpec");
	const parsed = resolvedSpec ? parseRegistryNpmSpec(resolvedSpec) : null;
	if (parsed?.selectorKind === "exact-version" && parsed.selector) return {
		name: parsed.name,
		version: parsed.selector
	};
	return null;
}
function legacyNpmInstallRecordSupersededByCurrent(params) {
	const { currentRecord, legacyRecord } = params;
	if (currentRecord.source !== "npm" || legacyRecord.source !== "npm") return false;
	const legacySpec = readInstallRecordStringField(legacyRecord, "spec");
	const legacyParsedSpec = legacySpec ? parseRegistryNpmSpec(legacySpec) : null;
	if (legacyParsedSpec?.selectorKind !== "exact-version") return false;
	const currentIdentity = readAuthoritativeCurrentNpmIdentity(currentRecord);
	return Boolean(currentIdentity && legacyParsedSpec.selector && currentIdentity.name === legacyParsedSpec.name && currentIdentity.version === legacyParsedSpec.selector);
}
function legacyInstallRecordCoveredByCurrent(currentRecord, legacyRecord) {
	if (currentRecord.source !== legacyRecord.source) return false;
	if (legacyNpmInstallRecordSupersededByCurrent({
		currentRecord,
		legacyRecord
	})) return true;
	for (const key of Object.keys(legacyRecord).toSorted()) {
		const currentValue = readInstallRecordField(currentRecord, key);
		if (currentValue === readInstallRecordField(legacyRecord, key)) continue;
		if (key === "spec" && legacyInstallRecordHasCurrentResolvedIdentity({
			currentRecord,
			legacyRecord
		})) continue;
		if ((key === "resolvedAt" || key === "installedAt") && typeof currentValue === "string") continue;
		return false;
	}
	return true;
}
function mergeLegacyInstalledPluginIndexRecords(current, legacy) {
	const installRecords = { ...current.installRecords };
	const conflicts = [];
	let addedCount = 0;
	for (const [pluginId, legacyRecord] of Object.entries(legacy.installRecords)) {
		const currentRecord = installRecords[pluginId];
		if (!currentRecord) {
			installRecords[pluginId] = legacyRecord;
			addedCount += 1;
			continue;
		}
		if (!legacyInstallRecordCoveredByCurrent(currentRecord, legacyRecord)) conflicts.push(pluginId);
	}
	return {
		merged: {
			...current,
			installRecords
		},
		addedCount,
		conflicts
	};
}
function archiveLegacyInstalledPluginIndex(params) {
	const resolution = archiveLegacyFileSource({
		sourcePath: params.sourcePath,
		label: "plugin install index",
		warnings: params.warnings
	});
	if (!resolution) return;
	params.changes.push(resolution.action === "removed" ? `Removed already-archived plugin install index legacy source ${params.sourcePath}` : `Archived plugin install index legacy source → ${resolution.targetPath}`);
}
function archiveLegacyTaskStateSidecar(params) {
	const existingSources = TASK_STATE_SQLITE_SIDECAR_SUFFIXES.map((suffix) => `${params.sourcePath}${suffix}`).filter(fileExists);
	if (existingSources.length === 0) return;
	const resolutions = [];
	for (const sourcePath of existingSources) {
		const resolution = archiveLegacyFileSource({
			sourcePath,
			label: `${params.label} sidecar`,
			warnings: params.warnings
		});
		if (!resolution) return;
		resolutions.push(resolution);
	}
	if (resolutions.every((resolution) => resolution.action === "archived" && resolution.targetPath === `${resolution.sourcePath}.migrated`)) params.changes.push(`Archived ${params.label} sidecar legacy source → ${params.sourcePath}.migrated`);
	else recordArchiveCollisionResolutions(params.changes, `${params.label} sidecar`, resolutions);
}
function hardenLegacyImportSource(params) {
	try {
		fs.chmodSync(params.sourcePath, 384);
		return true;
	} catch (err) {
		params.warnings.push(`Failed securing ${params.label} legacy source: ${String(err)}`);
		return false;
	}
}
function archiveLegacyImportSource(params) {
	if (!hardenLegacyImportSource(params)) return;
	const resolution = archiveLegacyFileSource({
		sourcePath: params.sourcePath,
		label: `${params.label} legacy source`,
		warnings: params.warnings
	});
	if (!resolution) return;
	if (resolution.action === "archived") try {
		fs.chmodSync(resolution.targetPath, 384);
	} catch (err) {
		params.warnings.push(`Failed securing archived ${params.label} legacy source: ${String(err)}`);
	}
	params.changes.push(resolution.action === "removed" ? `Removed already-archived ${params.label} legacy source ${params.sourcePath}` : `Archived ${params.label} legacy source → ${resolution.targetPath}`);
}
function legacyKeyValue(value) {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "bigint") return `${value}`;
	return "";
}
function normalizeLegacyFlowRow(row) {
	const syncMode = row.sync_mode === "task_mirrored" || row.shape === "single_task" ? "task_mirrored" : "managed";
	const ownerKey = typeof row.owner_key === "string" && row.owner_key.trim() ? row.owner_key.trim() : typeof row.owner_session_key === "string" ? row.owner_session_key.trim() : "";
	const controllerId = syncMode === "managed" ? typeof row.controller_id === "string" && row.controller_id.trim() ? row.controller_id.trim() : "core/legacy-restored" : null;
	return {
		flow_id: legacyBindValue(row.flow_id ?? ""),
		shape: legacyBindValue(row.shape),
		sync_mode: syncMode,
		owner_key: ownerKey,
		requester_origin_json: legacyBindValue(row.requester_origin_json),
		controller_id: controllerId,
		revision: normalizeLegacySqliteInteger(row.revision) ?? 0,
		status: legacyBindValue(row.status ?? ""),
		notify_policy: legacyBindValue(row.notify_policy ?? ""),
		goal: legacyBindValue(row.goal ?? ""),
		current_step: legacyBindValue(row.current_step),
		blocked_task_id: legacyBindValue(row.blocked_task_id),
		blocked_summary: legacyBindValue(row.blocked_summary),
		state_json: legacyBindValue(row.state_json),
		wait_json: legacyBindValue(row.wait_json),
		cancel_requested_at: normalizeLegacySqliteInteger(row.cancel_requested_at),
		created_at: normalizeLegacySqliteInteger(row.created_at) ?? 0,
		updated_at: normalizeLegacySqliteInteger(row.updated_at) ?? 0,
		ended_at: normalizeLegacySqliteInteger(row.ended_at)
	};
}
function legacyRowsMatch(existing, incoming, columns) {
	return columns.every((column) => normalizeLegacySqliteInteger(existing[column]) === normalizeLegacySqliteInteger(incoming[column]));
}
function readLegacyFlowRows(sourcePath) {
	const db = new (requireNodeSqlite()).DatabaseSync(sourcePath, { readOnly: true });
	try {
		const columns = listSqliteColumns(db, "flow_runs");
		if (columns.size === 0) return [];
		const selectColumns = [
			"flow_id",
			pickLegacyColumn(columns, "shape"),
			pickLegacyColumn(columns, "sync_mode"),
			pickLegacyColumn(columns, "owner_key"),
			pickLegacyColumn(columns, "owner_session_key"),
			pickLegacyColumn(columns, "requester_origin_json"),
			pickLegacyColumn(columns, "controller_id"),
			pickLegacyColumn(columns, "revision", "0"),
			"status",
			"notify_policy",
			"goal",
			pickLegacyColumn(columns, "current_step"),
			pickLegacyColumn(columns, "blocked_task_id"),
			pickLegacyColumn(columns, "blocked_summary"),
			pickLegacyColumn(columns, "state_json"),
			pickLegacyColumn(columns, "wait_json"),
			pickLegacyColumn(columns, "cancel_requested_at"),
			"created_at",
			"updated_at",
			pickLegacyColumn(columns, "ended_at")
		];
		return db.prepare(`SELECT ${selectColumns.join(", ")} FROM flow_runs ORDER BY created_at ASC, flow_id ASC`).all().map((row) => normalizeLegacyFlowRow(row));
	} finally {
		db.close();
	}
}
function insertFlowRunRowSql(db, row) {
	db.prepare(`
      INSERT INTO flow_runs (
        flow_id, shape, sync_mode, owner_key, requester_origin_json, controller_id, revision,
        status, notify_policy, goal, current_step, blocked_task_id, blocked_summary, state_json,
        wait_json, cancel_requested_at, created_at, updated_at, ended_at
      ) VALUES (
        @flow_id, @shape, @sync_mode, @owner_key, @requester_origin_json, @controller_id,
        @revision, @status, @notify_policy, @goal, @current_step, @blocked_task_id,
        @blocked_summary, @state_json, @wait_json, @cancel_requested_at, @created_at,
        @updated_at, @ended_at
      )
    `).run(row);
}
async function migrateLegacyTaskRunsSidecar(params) {
	const sourcePath = resolveLegacyTaskRunsSidecarPath(params.stateDir);
	if (!fileExists(sourcePath)) {
		const changes = [];
		const warnings = [];
		if (hasPendingSqliteSidecarArchive(sourcePath, TASK_STATE_SQLITE_SIDECAR_SUFFIXES)) archiveLegacyTaskStateSidecar({
			sourcePath,
			label: "task registry",
			changes,
			warnings
		});
		return {
			changes,
			warnings
		};
	}
	const changes = [];
	const warnings = [];
	let taskRows;
	let deliveryRows;
	try {
		taskRows = readLegacyTaskRows(sourcePath);
		deliveryRows = readLegacyTaskDeliveryRows(sourcePath);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed reading task registry sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	try {
		const conflicts = [];
		let importedTasks = 0;
		let importedDeliveryStates = 0;
		let skippedOrphanDeliveryStates = 0;
		runOpenClawStateWriteTransaction(({ db }) => {
			const taskColumns = [
				"runtime",
				"task_kind",
				"source_id",
				"requester_session_key",
				"owner_key",
				"scope_kind",
				"child_session_key",
				"parent_flow_id",
				"parent_task_id",
				"agent_id",
				"requester_agent_id",
				"run_id",
				"label",
				"task",
				"status",
				"delivery_status",
				"notify_policy",
				"created_at",
				"started_at",
				"ended_at",
				"last_event_at",
				"cleanup_after",
				"error",
				"progress_summary",
				"terminal_summary",
				"terminal_outcome",
				"detail_json"
			];
			for (const row of taskRows) {
				const taskId = legacyKeyValue(expectDefined(row.task_id, "task migration row key"));
				const existing = db.prepare(`SELECT ${taskColumns.join(", ")} FROM task_runs WHERE task_id = ?`).get(taskId);
				if (existing) {
					if (!legacyRowsMatch(existing, row, taskColumns)) conflicts.push(taskId);
					continue;
				}
				insertTaskRunRowSql(db, row);
				importedTasks++;
			}
			const deliveryColumns = ["requester_origin_json", "last_notified_event_at"];
			for (const row of deliveryRows) {
				const taskId = legacyKeyValue(expectDefined(row.task_id, "delivery migration row key"));
				const existing = db.prepare(`SELECT requester_origin_json, last_notified_event_at FROM task_delivery_state WHERE task_id = ?`).get(taskId);
				if (existing) {
					if (!legacyRowsMatch(existing, row, deliveryColumns)) conflicts.push(`${taskId}/delivery`);
					continue;
				}
				if (!db.prepare("SELECT 1 FROM task_runs WHERE task_id = ?").get(taskId)) {
					skippedOrphanDeliveryStates++;
					continue;
				}
				insertTaskDeliveryRowSql(db, row);
				importedDeliveryStates++;
			}
			if (conflicts.length > 0) throw new LegacyTaskStateSidecarConflictError(conflicts);
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		if (importedTasks > 0) changes.push(`Migrated ${importedTasks} task registry sidecar ${importedTasks === 1 ? "row" : "rows"} → shared SQLite state`);
		if (importedDeliveryStates > 0) changes.push(`Migrated ${importedDeliveryStates} task delivery sidecar ${importedDeliveryStates === 1 ? "row" : "rows"} → shared SQLite state`);
		if (skippedOrphanDeliveryStates > 0) warnings.push(`Skipped ${skippedOrphanDeliveryStates} orphan task delivery sidecar ${skippedOrphanDeliveryStates === 1 ? "row" : "rows"} with no task run`);
	} catch (err) {
		if (err instanceof LegacyTaskStateSidecarConflictError) return {
			changes,
			warnings: [`Left task registry sidecar in place because ${err.conflictedKeys.length} ${err.conflictedKeys.length === 1 ? "row" : "rows"} already existed in shared state: ${err.conflictedKeys[0]}`]
		};
		return {
			changes,
			warnings: [`Failed migrating task registry sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	archiveLegacyTaskStateSidecar({
		sourcePath,
		label: "task registry",
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
async function migrateLegacyFlowRunsSidecar(params) {
	const sourcePath = resolveLegacyFlowRunsSidecarPath(params.stateDir);
	if (!fileExists(sourcePath)) {
		const changes = [];
		const warnings = [];
		if (hasPendingSqliteSidecarArchive(sourcePath, TASK_STATE_SQLITE_SIDECAR_SUFFIXES)) archiveLegacyTaskStateSidecar({
			sourcePath,
			label: "task flow",
			changes,
			warnings
		});
		return {
			changes,
			warnings
		};
	}
	const changes = [];
	const warnings = [];
	let rows;
	try {
		rows = readLegacyFlowRows(sourcePath);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed reading task flow sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	try {
		const conflicts = [];
		let imported = 0;
		runOpenClawStateWriteTransaction(({ db }) => {
			const columns = [
				"shape",
				"sync_mode",
				"owner_key",
				"requester_origin_json",
				"controller_id",
				"revision",
				"status",
				"notify_policy",
				"goal",
				"current_step",
				"blocked_task_id",
				"blocked_summary",
				"state_json",
				"wait_json",
				"cancel_requested_at",
				"created_at",
				"updated_at",
				"ended_at"
			];
			for (const row of rows) {
				const flowId = legacyKeyValue(expectDefined(row.flow_id, "flow migration row key"));
				const existing = db.prepare(`SELECT ${columns.join(", ")} FROM flow_runs WHERE flow_id = ?`).get(flowId);
				if (existing) {
					if (!legacyRowsMatch(existing, row, columns)) conflicts.push(flowId);
					continue;
				}
				insertFlowRunRowSql(db, row);
				imported++;
			}
			if (conflicts.length > 0) throw new LegacyTaskStateSidecarConflictError(conflicts);
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		if (imported > 0) changes.push(`Migrated ${imported} task flow sidecar ${imported === 1 ? "row" : "rows"} → shared SQLite state`);
	} catch (err) {
		if (err instanceof LegacyTaskStateSidecarConflictError) return {
			changes,
			warnings: [`Left task flow sidecar in place because ${err.conflictedKeys.length} ${err.conflictedKeys.length === 1 ? "row" : "rows"} already existed in shared state: ${err.conflictedKeys[0]}`]
		};
		return {
			changes,
			warnings: [`Failed migrating task flow sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	archiveLegacyTaskStateSidecar({
		sourcePath,
		label: "task flow",
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
async function migrateLegacyTaskStateSidecars(params) {
	const taskRuns = await migrateLegacyTaskRunsSidecar(params);
	const flowRuns = await migrateLegacyFlowRunsSidecar(params);
	return {
		changes: [...taskRuns.changes, ...flowRuns.changes],
		warnings: [...taskRuns.warnings, ...flowRuns.warnings]
	};
}
function resolveLegacyDeliveryQueuePath(stateDir, dirName) {
	return path.join(stateDir, dirName);
}
function listLegacyDeliveryQueueFiles(queueDir) {
	const pending = safeReadDir(queueDir).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => ({
		sourcePath: path.join(queueDir, entry.name),
		status: "pending"
	}));
	const failedDir = path.join(queueDir, "failed");
	const failed = safeReadDir(failedDir).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => ({
		sourcePath: path.join(failedDir, entry.name),
		status: "failed"
	}));
	return [...pending, ...failed];
}
function listLegacyDeliveryQueueDeliveredMarkers(queueDir) {
	return safeReadDir(queueDir).filter((entry) => entry.isFile() && entry.name.endsWith(".delivered")).map((entry) => path.join(queueDir, entry.name));
}
function readLegacyDeliveryQueueEntry(sourcePath) {
	try {
		const parsed = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function legacyQueueMetadata(entry) {
	const session = entry.session;
	const route = entry.route;
	const deliveryContext = entry.deliveryContext;
	const stringOrNull = (value) => typeof value === "string" ? value : null;
	return {
		entryKind: stringOrNull(entry.kind) ?? "outbound",
		sessionKey: stringOrNull(entry.sessionKey) ?? stringOrNull(session?.key),
		channel: stringOrNull(entry.channel) ?? stringOrNull(route?.channel) ?? stringOrNull(deliveryContext?.channel),
		target: stringOrNull(entry.to) ?? stringOrNull(route?.to) ?? stringOrNull(deliveryContext?.to),
		accountId: stringOrNull(entry.accountId) ?? stringOrNull(route?.accountId) ?? stringOrNull(deliveryContext?.accountId)
	};
}
function buildLegacyDeliveryQueueRow(params) {
	const enqueuedAt = typeof params.entry.enqueuedAt === "number" ? params.entry.enqueuedAt : params.now;
	const retryCount = typeof params.entry.retryCount === "number" ? params.entry.retryCount : 0;
	const failedAt = params.status === "failed" ? typeof params.entry.failedAt === "number" ? params.entry.failedAt : typeof params.entry.lastAttemptAt === "number" ? params.entry.lastAttemptAt : enqueuedAt : null;
	const meta = legacyQueueMetadata(params.entry);
	return {
		queue_name: params.queueName,
		id: params.id,
		status: params.status,
		entry_kind: meta.entryKind,
		session_key: meta.sessionKey,
		channel: meta.channel,
		target: meta.target,
		account_id: meta.accountId,
		retry_count: retryCount,
		last_attempt_at: typeof params.entry.lastAttemptAt === "number" ? params.entry.lastAttemptAt : null,
		last_error: typeof params.entry.lastError === "string" ? params.entry.lastError : null,
		recovery_state: typeof params.entry.recoveryState === "string" ? params.entry.recoveryState : null,
		platform_send_started_at: typeof params.entry.platformSendStartedAt === "number" ? params.entry.platformSendStartedAt : null,
		entry_json: JSON.stringify({
			...params.entry,
			id: params.id,
			enqueuedAt,
			retryCount
		}),
		enqueued_at: enqueuedAt,
		updated_at: params.now,
		failed_at: failedAt
	};
}
function legacyDeliveryQueueRowsMatch(existing, incoming) {
	return [
		"status",
		"entry_kind",
		"session_key",
		"channel",
		"target",
		"account_id",
		"retry_count",
		"last_attempt_at",
		"last_error",
		"recovery_state",
		"platform_send_started_at",
		"entry_json",
		"enqueued_at",
		"failed_at"
	].every((column) => {
		const left = existing[column];
		const right = incoming[column];
		if (typeof left === "bigint" || typeof right === "bigint") return normalizeLegacySqliteInteger(left) === normalizeLegacySqliteInteger(right);
		return left === right;
	});
}
function removeLegacyDeliveryQueueDir(params) {
	try {
		fs.rmSync(params.queueDir, { recursive: true });
		params.changes.push(`Removed ${params.label} legacy source ${params.queueDir}`);
	} catch (err) {
		params.warnings.push(`Failed removing ${params.label} ${params.queueDir}: ${String(err)}`);
	}
}
function removeLegacyDeliveryQueueMarkers(markerPaths, label, warnings) {
	let removed = 0;
	for (const markerPath of markerPaths) try {
		fs.rmSync(markerPath, { force: true });
		removed++;
	} catch (err) {
		warnings.push(`Failed removing ${label} marker ${markerPath}: ${String(err)}`);
		return null;
	}
	return removed;
}
async function migrateLegacyDeliveryQueues(params) {
	const changes = [];
	const warnings = [];
	for (const queue of LEGACY_DELIVERY_QUEUE_DIRS) {
		const queueDir = resolveLegacyDeliveryQueuePath(params.stateDir, queue.dirName);
		const files = listLegacyDeliveryQueueFiles(queueDir);
		const markerPaths = listLegacyDeliveryQueueDeliveredMarkers(queueDir);
		if (files.length === 0 && markerPaths.length === 0) continue;
		let imported = 0;
		let skipped = 0;
		const conflicts = [];
		try {
			runOpenClawStateWriteTransaction(({ db }) => {
				const insert = db.prepare(`
            INSERT INTO delivery_queue_entries (
              queue_name, id, status, entry_kind, session_key, channel, target, account_id,
              retry_count, last_attempt_at, last_error, recovery_state,
              platform_send_started_at, entry_json, enqueued_at, updated_at, failed_at
            ) VALUES (
              @queue_name, @id, @status, @entry_kind, @session_key, @channel, @target,
              @account_id, @retry_count, @last_attempt_at, @last_error, @recovery_state,
              @platform_send_started_at, @entry_json, @enqueued_at, @updated_at, @failed_at
            )
          `);
				const now = Date.now();
				for (const file of files) {
					const entry = readLegacyDeliveryQueueEntry(file.sourcePath);
					const id = typeof entry?.id === "string" ? entry.id : path.basename(file.sourcePath, ".json");
					if (!entry || !id) {
						skipped++;
						continue;
					}
					const row = buildLegacyDeliveryQueueRow({
						queueName: queue.queueName,
						id,
						status: file.status,
						entry,
						now
					});
					const existing = db.prepare(`
                SELECT status, entry_kind, session_key, channel, target, account_id,
                       retry_count, last_attempt_at, last_error, recovery_state,
                       platform_send_started_at, entry_json, enqueued_at, failed_at
                  FROM delivery_queue_entries
                 WHERE queue_name = ? AND id = ?
              `).get(queue.queueName, id);
					if (existing) {
						if (!legacyDeliveryQueueRowsMatch(existing, row)) conflicts.push(id);
						continue;
					}
					insert.run(row);
					imported++;
				}
			}, { env: {
				...process.env,
				OPENCLAW_STATE_DIR: params.stateDir
			} });
		} catch (err) {
			warnings.push(`Failed migrating ${queue.label} ${queueDir}: ${String(err)}`);
			continue;
		}
		const removedMarkers = removeLegacyDeliveryQueueMarkers(markerPaths, queue.label, warnings);
		if (removedMarkers === null) continue;
		if (removedMarkers > 0) changes.push(`Removed ${removedMarkers} ${queue.label} delivered ${removedMarkers === 1 ? "marker" : "markers"}`);
		if (imported > 0) changes.push(`Migrated ${imported} ${queue.label} ${imported === 1 ? "entry" : "entries"} → shared SQLite state`);
		if (skipped > 0) {
			warnings.push(`Skipped ${skipped} malformed ${queue.label} ${skipped === 1 ? "entry" : "entries"}`);
			warnings.push(`Left ${queue.label} in place because malformed entries need manual cleanup`);
			continue;
		}
		if (conflicts.length > 0) {
			warnings.push(`Left ${queue.label} in place because ${conflicts.length} ${conflicts.length === 1 ? "entry" : "entries"} already existed in shared state: ${conflicts[0]}`);
			continue;
		}
		removeLegacyDeliveryQueueDir({
			queueDir,
			label: queue.label,
			changes,
			warnings
		});
	}
	return {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.plugin-state.ts
async function migrateLegacyPluginStateSidecar(params) {
	const sourcePath = resolveLegacyPluginStateSidecarPath(params.stateDir);
	if (!fileExists(sourcePath)) {
		const changes = [];
		const warnings = [];
		if (hasPendingSqliteSidecarArchive(sourcePath, PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES)) archiveLegacyPluginStateSidecar({
			sourcePath,
			changes,
			warnings
		});
		return {
			changes,
			warnings
		};
	}
	const changes = [];
	const warnings = [];
	let rows;
	try {
		rows = readLegacyPluginStateSidecarRows(sourcePath);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed reading plugin-state sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	try {
		const conflictedKeys = [];
		const rowsToInsert = [];
		let imported = 0;
		let skippedExpired = 0;
		const now = Date.now();
		runOpenClawStateWriteTransaction(({ db }) => {
			const stateDb = getNodeSqliteKysely(db);
			for (const row of rows) {
				executeSqliteQuerySync(db, stateDb.deleteFrom("plugin_state_entries").where("plugin_id", "=", row.plugin_id).where("namespace", "=", row.namespace).where("entry_key", "=", row.entry_key).where("expires_at", "is not", null).where("expires_at", "<=", now));
				const existing = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("plugin_state_entries").select([
					"value_json",
					"created_at",
					"expires_at"
				]).where("plugin_id", "=", row.plugin_id).where("namespace", "=", row.namespace).where("entry_key", "=", row.entry_key));
				const legacyExpired = isLegacyPluginStateRowExpired(row, now);
				if (existing) {
					if (!legacyPluginStateRowsMatch(existing, row)) if ((normalizeLegacySqliteInteger(existing.created_at) ?? 0) > (normalizeLegacySqliteInteger(row.created_at) ?? 0)) {} else if (legacyExpired) skippedExpired += 1;
					else conflictedKeys.push(`${row.plugin_id}/${row.namespace}/${row.entry_key}`);
					continue;
				}
				if (legacyExpired) {
					skippedExpired += 1;
					continue;
				}
				rowsToInsert.push(row);
			}
			for (const row of rowsToInsert) {
				executeSqliteQuerySync(db, stateDb.insertInto("plugin_state_entries").values({
					plugin_id: row.plugin_id,
					namespace: row.namespace,
					entry_key: row.entry_key,
					value_json: row.value_json,
					created_at: normalizeLegacySqliteInteger(row.created_at) ?? 0,
					expires_at: normalizeLegacySqliteInteger(row.expires_at)
				}).onConflict((conflict) => conflict.columns([
					"plugin_id",
					"namespace",
					"entry_key"
				]).doNothing()));
				imported += 1;
			}
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		if (imported > 0) changes.push(`Migrated ${imported} plugin-state sidecar ${imported === 1 ? "entry" : "entries"} → shared SQLite state`);
		if (conflictedKeys.length > 0) return {
			changes,
			warnings: [`Left plugin-state sidecar in place because ${conflictedKeys.length} ${conflictedKeys.length === 1 ? "row differs" : "rows differ"} from shared state without a newer canonical timestamp. First key: ${conflictedKeys[0]}`]
		};
		if (skippedExpired > 0) changes.push(`Dropped ${skippedExpired} expired plugin-state sidecar ${skippedExpired === 1 ? "entry" : "entries"}`);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed migrating plugin-state sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	archiveLegacyPluginStateSidecar({
		sourcePath,
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
async function migrateLegacyInstalledPluginIndex(params) {
	const sourcePath = resolveLegacyInstalledPluginIndexStorePath({ stateDir: params.stateDir });
	if (!fileExists(sourcePath)) return {
		changes: [],
		warnings: []
	};
	const changes = [];
	const warnings = [];
	const legacy = readLegacyInstalledPluginIndex(sourcePath);
	if (!legacy) return {
		changes,
		warnings: [`Left plugin install index in place because ${sourcePath} is invalid`]
	};
	const storeOptions = { stateDir: params.stateDir };
	const current = readPersistedInstalledPluginIndexSync(storeOptions);
	if (current && !legacyInstalledPluginIndexMatches(current, legacy)) {
		const merged = mergeLegacyInstalledPluginIndexRecords(current, legacy);
		if (merged.addedCount > 0) try {
			writePersistedInstalledPluginIndexSync(merged.merged, storeOptions);
			changes.push(`Merged ${merged.addedCount} legacy plugin install ${merged.addedCount === 1 ? "record" : "records"} → shared SQLite state`);
		} catch (err) {
			return {
				changes,
				warnings: [`Failed merging plugin install index ${sourcePath}: ${String(err)}`]
			};
		}
		if (merged.conflicts.length > 0) {
			archiveLegacyInstalledPluginIndex({
				sourcePath,
				changes,
				warnings
			});
			return {
				changes,
				warnings,
				notices: [`Kept canonical shared SQLite plugin install metadata despite differing legacy records for: ${merged.conflicts.join(", ")}`]
			};
		}
	}
	if (!current) try {
		writePersistedInstalledPluginIndexSync(legacy, storeOptions);
		const recordCount = Object.keys(legacy.installRecords).length;
		changes.push(`Migrated plugin install index ${recordCount} ${recordCount === 1 ? "record" : "records"} → shared SQLite state`);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed migrating plugin install index ${sourcePath}: ${String(err)}`]
		};
	}
	archiveLegacyInstalledPluginIndex({
		sourcePath,
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
function resolvePluginStateImportTargetKey(scopeKey, key) {
	return scopeKey ? `${scopeKey}:${key}` : key;
}
function findMissingKey(expected, actual) {
	for (const key of expected) if (!actual.has(key)) return key;
}
function compareImportEntriesNewestFirst(a, b) {
	if (a.timestamp !== void 0 && b.timestamp !== void 0) return b.timestamp - a.timestamp;
	if (a.ttlMs !== void 0 && b.ttlMs !== void 0) return b.ttlMs - a.ttlMs;
	return 0;
}
async function withPluginStateImportEnv(plan, run) {
	if (!plan.stateDir) return await run();
	const previous = process.env.OPENCLAW_STATE_DIR;
	process.env.OPENCLAW_STATE_DIR = plan.stateDir;
	try {
		return await run();
	} finally {
		if (previous === void 0) delete process.env.OPENCLAW_STATE_DIR;
		else process.env.OPENCLAW_STATE_DIR = previous;
	}
}
async function runLegacyMigrationPlans(plans) {
	const changes = [];
	const warnings = [];
	for (const plan of plans) {
		if (plan.kind === "plugin-state-import") {
			await withPluginStateImportEnv(plan, async () => {
				let storeEntries;
				let pluginEntryCount;
				const store = createPluginStateKeyedStore(plan.pluginId, {
					namespace: plan.namespace,
					maxEntries: plan.maxEntries,
					...plan.defaultTtlMs != null ? { defaultTtlMs: plan.defaultTtlMs } : {}
				});
				try {
					storeEntries = await store.entries();
					pluginEntryCount = countPluginStateLiveEntries(plan.pluginId);
				} catch (err) {
					warnings.push(`Failed reading ${plan.label} plugin state before migration: ${String(err)}`);
					return;
				}
				const existingKeys = new Set(storeEntries.map(({ key }) => key));
				const existingValuesByKey = new Map(storeEntries.map(({ key, value }) => [key, value]));
				const existingCreatedAtByKey = new Map(storeEntries.map(({ key, createdAt }) => [key, createdAt]));
				const expectedKeys = new Set(existingKeys);
				const namespaceRemainingCapacity = Math.max(0, plan.maxEntries - storeEntries.length);
				let entries;
				try {
					entries = await plan.readEntries();
				} catch (err) {
					warnings.push(`Failed reading ${plan.label} legacy source: ${String(err)}`);
					return;
				}
				const replacementEntries = [];
				let newEntries = [];
				const failedTargetKeys = /* @__PURE__ */ new Set();
				for (const entry of entries) {
					const targetKey = resolvePluginStateImportTargetKey(plan.scopeKey, entry.key);
					const existingValue = existingValuesByKey.get(targetKey);
					if (existingKeys.has(targetKey)) {
						if (existingValue !== void 0 && await plan.shouldReplaceExistingEntry?.({
							key: entry.key,
							existingValue,
							incomingValue: entry.value
						})) replacementEntries.push({
							...entry,
							targetKey,
							existedBefore: true
						});
						continue;
					}
					newEntries.push({
						...entry,
						targetKey,
						existedBefore: false
					});
				}
				const missingEntryCount = newEntries.length;
				const pluginRemainingCapacity = Math.max(0, resolveMaxPluginStateEntriesPerPlugin() - pluginEntryCount);
				const importBudget = Math.min(namespaceRemainingCapacity, pluginRemainingCapacity);
				if (missingEntryCount > importBudget) {
					newEntries = newEntries.toSorted(compareImportEntriesNewestFirst).slice(0, importBudget);
					const constraint = namespaceRemainingCapacity <= pluginRemainingCapacity ? `plugin state namespace ${plan.namespace} has room for ${namespaceRemainingCapacity}` : `plugin state has room for ${pluginRemainingCapacity}`;
					warnings.push(newEntries.length > 0 ? `Partially migrating ${plan.label} because ${constraint} of ${missingEntryCount} missing entries; importing the newest ${newEntries.length} and deferring the rest in the legacy source` : `Deferring ${plan.label} migration because ${constraint} of ${missingEntryCount} missing entries; left legacy source in place to retry when capacity frees`);
				}
				const registerPreservingCreatedAt = async (params) => {
					if (params.createdAtMs === void 0 || !Number.isFinite(params.createdAtMs) || params.createdAtMs < 0) {
						await store.register(params.key, params.value, params.ttlMs != null ? { ttlMs: params.ttlMs } : void 0);
						return;
					}
					registerMigratedPluginStateEntry({
						pluginId: plan.pluginId,
						namespace: plan.namespace,
						maxEntries: plan.maxEntries,
						...plan.defaultTtlMs != null ? { defaultTtlMs: plan.defaultTtlMs } : {},
						key: params.key,
						value: params.value,
						...params.ttlMs != null ? { ttlMs: params.ttlMs } : {},
						createdAtMs: params.createdAtMs
					});
				};
				const restoreExistingEntry = async (key) => {
					await registerPreservingCreatedAt({
						key,
						value: existingValuesByKey.get(key),
						createdAtMs: existingCreatedAtByKey.get(key)
					});
				};
				let imported = 0;
				const changedKeys = /* @__PURE__ */ new Set();
				for (const entry of [...replacementEntries, ...newEntries]) try {
					await registerPreservingCreatedAt({
						key: entry.targetKey,
						value: entry.value,
						...entry.ttlMs != null ? { ttlMs: entry.ttlMs } : {},
						...entry.timestamp !== void 0 ? { createdAtMs: entry.timestamp } : {}
					});
					const nextExpectedKeys = new Set(expectedKeys);
					nextExpectedKeys.add(entry.targetKey);
					const missingKey = findMissingKey(nextExpectedKeys, new Set((await store.entries()).map(({ key }) => key)));
					if (missingKey) {
						if (existingValuesByKey.has(entry.targetKey)) await restoreExistingEntry(entry.targetKey);
						else await store.delete(entry.targetKey);
						if (changedKeys.has(missingKey)) {
							changedKeys.delete(missingKey);
							expectedKeys.delete(missingKey);
							existingKeys.delete(missingKey);
							imported = Math.max(0, imported - 1);
						} else if (existingValuesByKey.has(missingKey)) try {
							await restoreExistingEntry(missingKey);
						} catch (restoreErr) {
							warnings.push(`Failed restoring ${plan.label} entry ${missingKey} after cap eviction: ${String(restoreErr)}`);
						}
						warnings.push(`Paused migrating ${plan.label} because plugin state cap evicted ${missingKey}; imported ${imported} of ${missingEntryCount} missing entries and deferred the rest in the legacy source`);
						break;
					}
					expectedKeys.add(entry.targetKey);
					existingKeys.add(entry.targetKey);
					changedKeys.add(entry.targetKey);
					imported++;
				} catch (err) {
					failedTargetKeys.add(entry.targetKey);
					warnings.push(`Failed migrating ${plan.label} entry ${entry.key}: ${String(err)}`);
				}
				if (imported > 0) changes.push(`Migrated ${imported} ${plan.label} ${imported === 1 ? "entry" : "entries"} → plugin state`);
				let cleanupKeys = existingKeys;
				if (plan.cleanupSource === "rename") cleanupKeys = expectedKeys;
				const allEntriesCovered = entries.length === 0 && plan.cleanupWhenEmpty === true || entries.length > 0 && entries.every(({ key }) => cleanupKeys.has(resolvePluginStateImportTargetKey(plan.scopeKey, key)) && !failedTargetKeys.has(resolvePluginStateImportTargetKey(plan.scopeKey, key)));
				if (allEntriesCovered && plan.cleanupSource === "rename" && fileExists(plan.sourcePath)) archiveLegacyImportSource({
					sourcePath: plan.sourcePath,
					label: plan.label,
					changes,
					warnings
				});
				if (allEntriesCovered && plan.cleanupSource === "remove" && fileExists(plan.sourcePath)) try {
					fs.unlinkSync(plan.sourcePath);
					changes.push(`Removed ${plan.label} legacy source (${plan.sourcePath})`);
				} catch (err) {
					warnings.push(`Failed removing ${plan.label} legacy source: ${String(err)}`);
				}
				if (allEntriesCovered && plan.removeSource) try {
					await plan.removeSource();
					changes.push(`Removed ${plan.label} legacy source (${plan.sourcePath})`);
				} catch (err) {
					warnings.push(`Failed removing ${plan.label} legacy source: ${String(err)}`);
				}
			});
			continue;
		}
		if (fileExists(plan.targetPath)) continue;
		try {
			ensureMigrationDir(path.dirname(plan.targetPath));
			if (plan.kind === "move") {
				fs.renameSync(plan.sourcePath, plan.targetPath);
				changes.push(`Moved ${plan.label} → ${plan.targetPath}`);
			} else {
				fs.copyFileSync(plan.sourcePath, plan.targetPath);
				changes.push(`Copied ${plan.label} → ${plan.targetPath}`);
			}
		} catch (err) {
			warnings.push(`Failed migrating ${plan.label} (${plan.sourcePath}): ${String(err)}`);
		}
	}
	return {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.rescue-pending.ts
function resolveLegacyRescuePendingPaths(stateDir) {
	return ["crestodian", "openclaw"].map((owner) => path.join(stateDir, owner, "rescue-pending"));
}
function isSafeLegacyOwnerDirectory(stateDir, sourcePath) {
	const ownerPath = path.dirname(sourcePath);
	try {
		const owner = fs.lstatSync(ownerPath);
		return owner.isDirectory() && !owner.isSymbolicLink() && path.resolve(path.dirname(ownerPath)) === path.resolve(stateDir);
	} catch {
		return false;
	}
}
/** Detect retired security capabilities only during an explicit doctor run. */
function detectLegacyRescuePending(params) {
	const sourcePaths = resolveLegacyRescuePendingPaths(params.stateDir);
	return {
		sourcePaths,
		hasLegacy: params.doctorOnlyStateMigrations === true && sourcePaths.some((sourcePath) => fs.existsSync(sourcePath))
	};
}
/** Discard retired one-shot capabilities; importing them could reactivate stale writes. */
function discardLegacyRescuePending(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	const removed = [];
	const warnings = [];
	for (const sourcePath of resolveLegacyRescuePendingPaths(params.stateDir)) {
		if (!fs.existsSync(sourcePath)) continue;
		if (!isSafeLegacyOwnerDirectory(params.stateDir, sourcePath)) {
			warnings.push(`Refused to remove retired rescue approvals through unsafe path ${sourcePath}`);
			continue;
		}
		try {
			fs.rmSync(sourcePath, {
				recursive: true,
				force: true
			});
			removed.push(sourcePath);
		} catch (error) {
			warnings.push(`Failed removing retired rescue approvals at ${sourcePath}: ${String(error)}`);
		}
	}
	return {
		changes: removed.length > 0 ? [`Discarded retired system-agent rescue approvals from ${removed.join(", ")}`] : [],
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.restart-sentinel.ts
const LEGACY_RESTART_SENTINEL_FILENAME = "restart-sentinel.json";
const DOCTOR_CLAIM_SUFFIX$2 = ".doctor-importing";
const MAX_LEGACY_RESTART_SENTINEL_BYTES = 4 * 1024 * 1024;
const MIGRATION_KIND$2 = "legacy-restart-sentinel-json";
const MIGRATION_LOCK_TIMEOUT_MS$3 = 250;
const MIGRATION_LOCK_POLL_INTERVAL_MS$3 = 25;
const utf8Decoder$1 = new TextDecoder("utf-8", { fatal: true });
function legacyPathMayExist$2(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
/** Detect the exact retired file for startup preflight and explicit Doctor alike. */
function detectLegacyRestartSentinel(params) {
	const sourcePath = path.join(params.stateDir, LEGACY_RESTART_SENTINEL_FILENAME);
	return {
		sourcePath,
		hasLegacy: legacyPathMayExist$2(sourcePath) || legacyPathMayExist$2(`${sourcePath}${DOCTOR_CLAIM_SUFFIX$2}`)
	};
}
function relativeLegacyPath$2(stateDir, filePath) {
	const relativePath = path.relative(path.resolve(stateDir), path.resolve(filePath));
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) throw new Error("legacy restart sentinel path is outside the state directory");
	return relativePath;
}
async function readLegacySourceSnapshot$3(stateRoot, stateDir, sourcePath) {
	const opened = await stateRoot.read(relativeLegacyPath$2(stateDir, sourcePath), {
		hardlinks: "reject",
		maxBytes: MAX_LEGACY_RESTART_SENTINEL_BYTES,
		symlinks: "reject"
	});
	if (!opened.stat.isFile() || opened.stat.size !== opened.buffer.byteLength) throw new Error("legacy restart sentinel is not a stable regular file");
	return {
		buffer: opened.buffer,
		dev: opened.stat.dev,
		ino: opened.stat.ino,
		mtimeMs: opened.stat.mtimeMs,
		sha256: createHash("sha256").update(opened.buffer).digest("hex"),
		size: opened.stat.size
	};
}
function snapshotsMatch$1(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mtimeMs === right.mtimeMs && left.sha256 === right.sha256 && left.size === right.size;
}
function parseLegacyEnvelope(snapshot) {
	try {
		return parseRestartSentinelEnvelope(JSON.parse(utf8Decoder$1.decode(snapshot.buffer)));
	} catch {
		return null;
	}
}
function receiptSourceKey(sourcePath) {
	return `restart-sentinel-json:${createHash("sha256").update(path.resolve(sourcePath)).digest("hex")}`;
}
function hasMigrationReceipt(sourcePath, env) {
	const { db } = openOpenClawStateDatabase({ env });
	return Boolean(executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("migration_sources").select("source_key").where("source_key", "=", receiptSourceKey(sourcePath))));
}
function decideAndRecordMigration(params) {
	const sourceKey = receiptSourceKey(params.sourcePath);
	const runId = `${sourceKey}:${params.snapshot.sha256.slice(0, 16)}`;
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const receipt = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("migration_sources").select("source_key").where("source_key", "=", sourceKey));
		const before = readRestartSentinelRowSync(db);
		let decision;
		if (receipt) decision = "receipt-authoritative";
		else if (!params.envelope) decision = "malformed-legacy-discarded";
		else if (before.kind === "valid") decision = "canonical-preserved";
		else {
			const written = writeRestartSentinelRowSync(db, params.envelope.payload);
			const verified = readRestartSentinelRowSync(db);
			if (verified.kind !== "valid" || verified.sentinel.revision !== written.revision || !isDeepStrictEqual(verified.sentinel.payload, params.envelope.payload)) throw new Error("SQLite verification failed for the restart sentinel migration");
			decision = before.kind === "invalid" ? "invalid-canonical-repaired" : "legacy-imported";
		}
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND$2,
			target: "gateway_restart_sentinel",
			decision,
			sourceSha256: params.snapshot.sha256,
			sourceValid: params.envelope !== null,
			importedRecordCount: decision === "legacy-imported" || decision === "invalid-canonical-repaired" ? 1 : 0,
			preservedSqliteRecordCount: decision === "canonical-preserved" ? 1 : 0
		});
		executeSqliteQuerySync(db, stateDb.insertInto("migration_runs").values({
			id: runId,
			started_at: now,
			finished_at: now,
			status: "completed",
			report_json: reportJson
		}).onConflict((conflict) => conflict.column("id").doUpdateSet({
			finished_at: now,
			status: "completed",
			report_json: reportJson
		})));
		executeSqliteQuerySync(db, stateDb.insertInto("migration_sources").values({
			source_key: sourceKey,
			migration_kind: MIGRATION_KIND$2,
			source_path: params.sourcePath,
			target_table: "gateway_restart_sentinel",
			source_sha256: params.snapshot.sha256,
			source_size_bytes: params.snapshot.size,
			source_record_count: params.envelope ? 1 : 0,
			last_run_id: runId,
			status: "completed",
			imported_at: now,
			removed_source: 0,
			report_json: reportJson
		}).onConflict((conflict) => conflict.column("source_key").doUpdateSet({
			source_sha256: params.snapshot.sha256,
			source_size_bytes: params.snapshot.size,
			source_record_count: params.envelope ? 1 : 0,
			last_run_id: runId,
			status: "completed",
			imported_at: now,
			removed_source: 0,
			report_json: reportJson
		})));
		return {
			decision,
			sourceKey
		};
	}, { env: params.env });
}
function markSourceRemoved$1(sourceKey, env) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("migration_sources").set({ removed_source: 1 }).where("source_key", "=", sourceKey));
	}, { env });
}
async function restoreClaim$2(params) {
	const claimPath = `${params.sourcePath}${DOCTOR_CLAIM_SUFFIX$2}`;
	try {
		if (!await params.stateRoot.exists(relativeLegacyPath$2(params.stateDir, claimPath))) return null;
		if (await params.stateRoot.exists(relativeLegacyPath$2(params.stateDir, params.sourcePath))) return `source path already exists: ${params.sourcePath}`;
		await params.stateRoot.move(relativeLegacyPath$2(params.stateDir, claimPath), relativeLegacyPath$2(params.stateDir, params.sourcePath));
		return null;
	} catch (error) {
		return String(error);
	}
}
async function recoverInterruptedClaim$2(params) {
	const claimPath = `${params.sourcePath}${DOCTOR_CLAIM_SUFFIX$2}`;
	const claimRelativePath = relativeLegacyPath$2(params.stateDir, claimPath);
	if (!await params.stateRoot.exists(claimRelativePath)) return;
	if (!await params.stateRoot.exists(relativeLegacyPath$2(params.stateDir, params.sourcePath))) {
		await params.stateRoot.move(claimRelativePath, relativeLegacyPath$2(params.stateDir, params.sourcePath));
		return;
	}
	if (!hasMigrationReceipt(params.sourcePath, params.env)) throw new Error("legacy restart sentinel source and interrupted claim both exist");
	await readLegacySourceSnapshot$3(params.stateRoot, params.stateDir, claimPath);
	await params.stateRoot.remove(claimRelativePath);
}
function decisionChange(decision) {
	switch (decision) {
		case "legacy-imported": return "Imported the legacy restart sentinel into shared SQLite state.";
		case "invalid-canonical-repaired": return "Replaced an invalid SQLite restart sentinel with validated legacy state.";
		case "canonical-preserved": return "Preserved the canonical SQLite restart sentinel and discarded conflicting legacy JSON.";
		case "malformed-legacy-discarded": return "Discarded malformed retired restart sentinel JSON without importing it.";
		case "receipt-authoritative": return "Discarded recreated retired restart sentinel JSON using its migration receipt.";
	}
	return decision;
}
async function migrateWithExclusiveStateOwnership$1(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	const sourcePath = params.detected.sourcePath;
	try {
		await recoverInterruptedClaim$2({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath,
			env: params.env
		});
	} catch (error) {
		return {
			changes,
			warnings: [`Failed recovering a legacy restart sentinel Doctor claim: ${String(error)}`]
		};
	}
	if (!await params.stateRoot.exists(relativeLegacyPath$2(params.stateDir, sourcePath))) return {
		changes,
		warnings
	};
	let snapshot;
	try {
		snapshot = await readLegacySourceSnapshot$3(params.stateRoot, params.stateDir, sourcePath);
	} catch (error) {
		return {
			changes,
			warnings: [`Failed reading the legacy restart sentinel: ${String(error)}`]
		};
	}
	const envelope = parseLegacyEnvelope(snapshot);
	const claimPath = `${sourcePath}${DOCTOR_CLAIM_SUFFIX$2}`;
	try {
		params.beforeVerify?.();
		if (!snapshotsMatch$1(await readLegacySourceSnapshot$3(params.stateRoot, params.stateDir, sourcePath), snapshot)) throw new Error("legacy restart sentinel changed after migration loaded it");
		params.beforeClaim?.();
		await params.stateRoot.move(relativeLegacyPath$2(params.stateDir, sourcePath), relativeLegacyPath$2(params.stateDir, claimPath));
		if (!snapshotsMatch$1(await readLegacySourceSnapshot$3(params.stateRoot, params.stateDir, claimPath), snapshot)) throw new Error("legacy restart sentinel changed before migration could claim it");
	} catch (error) {
		const restoreError = await restoreClaim$2({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath
		});
		return {
			changes,
			warnings: [`Failed claiming the legacy restart sentinel: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	let result;
	try {
		result = decideAndRecordMigration({
			env: params.env,
			sourcePath,
			snapshot,
			envelope
		});
	} catch (error) {
		const restoreError = await restoreClaim$2({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath
		});
		return {
			changes,
			warnings: [`Failed migrating the legacy restart sentinel: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	try {
		if (await params.stateRoot.exists(relativeLegacyPath$2(params.stateDir, sourcePath))) throw new Error("legacy restart sentinel reappeared during migration cleanup");
		if (params.removeSource) await params.removeSource(claimPath);
		else await params.stateRoot.remove(relativeLegacyPath$2(params.stateDir, claimPath));
		if (await params.stateRoot.exists(relativeLegacyPath$2(params.stateDir, sourcePath)) || await params.stateRoot.exists(relativeLegacyPath$2(params.stateDir, claimPath))) throw new Error("legacy restart sentinel remains after migration cleanup");
	} catch (error) {
		warnings.push(`Legacy restart sentinel cleanup failed: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		markSourceRemoved$1(result.sourceKey, params.env);
	} catch (error) {
		warnings.push(`Legacy restart sentinel was removed, but its receipt could not be finalized: ${String(error)}`);
	}
	changes.push(decisionChange(result.decision));
	notices.push("Removed retired restart-sentinel.json after recording its migration decision.");
	return {
		changes,
		warnings,
		notices
	};
}
/** Import or retire the old file under exclusive state ownership. */
async function migrateLegacyRestartSentinel(params) {
	const detected = params.detected;
	if (!detected?.hasLegacy) return {
		changes: [],
		warnings: []
	};
	const env = {
		...params.env ?? process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env,
			pollIntervalMs: MIGRATION_LOCK_POLL_INTERVAL_MS$3,
			role: "sqlite-maintenance",
			timeoutMs: MIGRATION_LOCK_TIMEOUT_MS$3
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed migrating the legacy restart sentinel: ${error instanceof GatewayLockError ? "the Gateway or another SQLite maintenance command owns this state directory" : String(error)}. Stop the Gateway, then run \`openclaw doctor --fix\` again.`]
		};
	}
	if (!lock) return {
		changes: [],
		warnings: ["Failed migrating the legacy restart sentinel: exclusive state ownership unavailable."]
	};
	let result = {
		changes: [],
		warnings: []
	};
	let releaseError;
	try {
		try {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				maxBytes: MAX_LEGACY_RESTART_SENTINEL_BYTES,
				symlinks: "reject"
			});
			result = await migrateWithExclusiveStateOwnership$1({
				...params,
				detected,
				env,
				stateRoot
			});
		} catch (error) {
			result.warnings.push(`Failed reading the legacy restart sentinel: ${String(error)}`);
		}
	} finally {
		try {
			await lock.release();
		} catch (error) {
			releaseError = error;
		}
	}
	if (releaseError) result.warnings.push(`Restart sentinel migration lock release failed: ${formatErrorMessage(releaseError)}`);
	return result;
}
//#endregion
//#region src/infra/state-migrations.runtime-state.ts
const VOICEWAKE_CONFIG_KEY = "default";
const DEFAULT_VOICEWAKE_TRIGGERS = [
	"openclaw",
	"claude",
	"computer"
];
function resolveLegacyVoiceWakeTriggersPath(stateDir) {
	return path.join(stateDir, "settings", "voicewake.json");
}
function resolveLegacyVoiceWakeRoutingPath(stateDir) {
	return path.join(stateDir, "settings", "voicewake-routing.json");
}
function readLegacyJsonObject(sourcePath) {
	return JSON.parse(fs.readFileSync(sourcePath, "utf8"));
}
function normalizeLegacyVoiceWakeTriggers(input) {
	const rec = input && typeof input === "object" ? input : {};
	const triggers = Array.isArray(rec.triggers) ? rec.triggers.flatMap((entry) => typeof entry === "string" ? [entry.trim()] : []).filter((entry) => entry.length > 0) : [];
	return triggers.length > 0 ? triggers : DEFAULT_VOICEWAKE_TRIGGERS;
}
function legacyVoiceWakeTriggersMatch(rows, triggers) {
	return rows.length === triggers.length && rows.every((row, index) => row.trigger === triggers[index]);
}
function legacyVoiceWakeTargetColumns(target) {
	if (target.agentId) return {
		targetAgentId: target.agentId,
		targetMode: "agent",
		targetSessionKey: null
	};
	if (target.sessionKey) return {
		targetAgentId: null,
		targetMode: "session",
		targetSessionKey: target.sessionKey
	};
	return {
		targetAgentId: null,
		targetMode: "current",
		targetSessionKey: null
	};
}
function legacyVoiceWakeTargetColumnsMatch(left, right) {
	return left.targetAgentId === (right.target_agent_id ?? null) && left.targetMode === right.target_mode && left.targetSessionKey === (right.target_session_key ?? null);
}
function legacyVoiceWakeRoutingMatches(configRow, routeRows, routingConfig) {
	if (!legacyVoiceWakeTargetColumnsMatch(legacyVoiceWakeTargetColumns(routingConfig.defaultTarget), {
		target_agent_id: configRow.default_target_agent_id,
		target_mode: configRow.default_target_mode,
		target_session_key: configRow.default_target_session_key
	})) return false;
	return routeRows.length === routingConfig.routes.length && routeRows.every((row, index) => {
		const route = routingConfig.routes[index];
		if (!route || row.trigger !== route.trigger) return false;
		return legacyVoiceWakeTargetColumnsMatch(legacyVoiceWakeTargetColumns(route.target), row);
	});
}
function migrateLegacyVoiceWakeSettings(params) {
	const changes = [];
	const warnings = [];
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	if (fileExists(params.detected.triggersPath)) {
		let triggers;
		try {
			triggers = normalizeLegacyVoiceWakeTriggers(readLegacyJsonObject(params.detected.triggersPath));
		} catch (err) {
			warnings.push(`Failed reading legacy voice wake triggers ${params.detected.triggersPath}: ${String(err)}`);
			triggers = [];
		}
		if (triggers.length > 0) {
			let imported = false;
			let shouldArchive = false;
			try {
				runOpenClawStateWriteTransaction(({ db }) => {
					const stateDb = getNodeSqliteKysely(db);
					const existing = executeSqliteQuerySync(db, stateDb.selectFrom("voicewake_triggers").select(["trigger"]).where("config_key", "=", VOICEWAKE_CONFIG_KEY).orderBy("position", "asc")).rows;
					if (existing.length > 0) {
						if (!legacyVoiceWakeTriggersMatch(existing, triggers)) warnings.push(`Left legacy voice wake triggers in place because shared SQLite state already has different triggers: ${params.detected.triggersPath}`);
						else shouldArchive = true;
						return;
					}
					const updatedAtMs = Date.now();
					executeSqliteQuerySync(db, stateDb.insertInto("voicewake_triggers").values(triggers.map((trigger, position) => ({
						config_key: VOICEWAKE_CONFIG_KEY,
						position,
						trigger,
						updated_at_ms: updatedAtMs
					}))));
					imported = true;
					shouldArchive = true;
				}, { env });
			} catch (err) {
				warnings.push(`Failed migrating legacy voice wake triggers: ${String(err)}`);
			}
			if (imported) changes.push(`Migrated ${triggers.length} voice wake ${triggers.length === 1 ? "trigger" : "triggers"} → shared SQLite state`);
			if (shouldArchive) archiveLegacyImportSource({
				sourcePath: params.detected.triggersPath,
				label: "voice wake triggers",
				changes,
				warnings
			});
		}
	}
	if (fileExists(params.detected.routingPath)) {
		let routingConfig = null;
		try {
			routingConfig = normalizeVoiceWakeRoutingConfig(readLegacyJsonObject(params.detected.routingPath));
		} catch (err) {
			warnings.push(`Failed reading legacy voice wake routing ${params.detected.routingPath}: ${String(err)}`);
		}
		if (routingConfig) {
			let imported = false;
			let shouldArchive = false;
			try {
				runOpenClawStateWriteTransaction(({ db }) => {
					const stateDb = getNodeSqliteKysely(db);
					const existing = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("voicewake_routing_config").select([
						"default_target_agent_id",
						"default_target_mode",
						"default_target_session_key"
					]).where("config_key", "=", VOICEWAKE_CONFIG_KEY));
					if (existing) {
						const routeRows = executeSqliteQuerySync(db, stateDb.selectFrom("voicewake_routing_routes").select([
							"target_agent_id",
							"target_mode",
							"target_session_key",
							"trigger"
						]).where("config_key", "=", VOICEWAKE_CONFIG_KEY).orderBy("position", "asc")).rows;
						if (legacyVoiceWakeRoutingMatches(existing, routeRows, routingConfig)) shouldArchive = true;
						else warnings.push(`Left legacy voice wake routing in place because shared SQLite routing already exists with different routes: ${params.detected.routingPath}`);
						return;
					}
					const updatedAtMs = Date.now();
					const defaultTarget = legacyVoiceWakeTargetColumns(routingConfig.defaultTarget);
					executeSqliteQuerySync(db, stateDb.insertInto("voicewake_routing_config").values({
						config_key: VOICEWAKE_CONFIG_KEY,
						version: 1,
						default_target_mode: defaultTarget.targetMode,
						default_target_agent_id: defaultTarget.targetAgentId,
						default_target_session_key: defaultTarget.targetSessionKey,
						updated_at_ms: updatedAtMs
					}));
					if (routingConfig.routes.length > 0) executeSqliteQuerySync(db, stateDb.insertInto("voicewake_routing_routes").values(routingConfig.routes.map((route, position) => {
						const target = legacyVoiceWakeTargetColumns(route.target);
						return {
							config_key: VOICEWAKE_CONFIG_KEY,
							position,
							trigger: route.trigger,
							target_mode: target.targetMode,
							target_agent_id: target.targetAgentId,
							target_session_key: target.targetSessionKey,
							updated_at_ms: updatedAtMs
						};
					})));
					imported = true;
					shouldArchive = true;
				}, { env });
			} catch (err) {
				warnings.push(`Failed migrating legacy voice wake routing: ${String(err)}`);
			}
			if (imported) changes.push(`Migrated voice wake routing config with ${routingConfig.routes.length} ${routingConfig.routes.length === 1 ? "route" : "routes"} → shared SQLite state`);
			if (shouldArchive) archiveLegacyImportSource({
				sourcePath: params.detected.routingPath,
				label: "voice wake routing",
				changes,
				warnings
			});
		}
	}
	return {
		changes,
		warnings
	};
}
function resolveLegacyConfigHealthPath(stateDir) {
	return path.join(stateDir, "logs", "config-health.json");
}
function normalizeLegacyConfigHealthEntry(configPath, input) {
	if (!configPath.trim() || !input || typeof input !== "object" || Array.isArray(input)) return null;
	const entry = input;
	const lastKnownGoodJson = entry.lastKnownGood && typeof entry.lastKnownGood === "object" ? JSON.stringify(entry.lastKnownGood) : null;
	const lastPromotedGoodJson = entry.lastPromotedGood && typeof entry.lastPromotedGood === "object" ? JSON.stringify(entry.lastPromotedGood) : null;
	const lastObservedSuspiciousSignature = typeof entry.lastObservedSuspiciousSignature === "string" ? entry.lastObservedSuspiciousSignature : null;
	if (!lastKnownGoodJson && !lastPromotedGoodJson && !lastObservedSuspiciousSignature) return null;
	return {
		configPath,
		lastKnownGoodJson,
		lastPromotedGoodJson,
		lastObservedSuspiciousSignature
	};
}
function normalizeLegacyConfigHealthFile(input) {
	const entries = (input && typeof input === "object" ? input : {}).entries;
	if (!entries || typeof entries !== "object" || Array.isArray(entries)) return [];
	return Object.entries(entries).flatMap(([configPath, entry]) => {
		const normalized = normalizeLegacyConfigHealthEntry(configPath, entry);
		return normalized ? [normalized] : [];
	}).toSorted((a, b) => a.configPath.localeCompare(b.configPath));
}
function configHealthRow(entry) {
	return {
		config_path: entry.configPath,
		last_known_good_json: entry.lastKnownGoodJson,
		last_promoted_good_json: entry.lastPromotedGoodJson,
		last_observed_suspicious_signature: entry.lastObservedSuspiciousSignature,
		updated_at_ms: Date.now()
	};
}
function retireLegacyConfigHealthSource(params) {
	if (!fileExists(`${params.sourcePath}.migrated`)) {
		archiveLegacyImportSource({
			sourcePath: params.sourcePath,
			label: "config health state",
			changes: params.changes,
			warnings: params.warnings
		});
		return;
	}
	try {
		fs.rmSync(params.sourcePath, { force: true });
		params.changes.push("Removed regenerated config health legacy source");
	} catch (err) {
		params.warnings.push(`Failed removing regenerated config health legacy source: ${String(err)}`);
	}
}
function migrateLegacyConfigHealth(params) {
	const changes = [];
	const warnings = [];
	if (!fileExists(params.detected.sourcePath)) return {
		changes,
		warnings
	};
	let entries;
	try {
		entries = normalizeLegacyConfigHealthFile(readLegacyJsonObject(params.detected.sourcePath));
	} catch (err) {
		warnings.push(`Failed reading legacy config health state ${params.detected.sourcePath}: ${String(err)}`);
		return {
			changes,
			warnings
		};
	}
	let importedCount = 0;
	let reconciledCount = 0;
	let shouldArchive = false;
	try {
		const result = runOpenClawStateWriteTransaction(({ db }) => {
			const stateDb = getNodeSqliteKysely(db);
			const existing = executeSqliteQuerySync(db, stateDb.selectFrom("config_health_entries").select([
				"config_path",
				"last_known_good_json",
				"last_promoted_good_json",
				"last_observed_suspicious_signature"
			])).rows;
			const existingByPath = new Map(existing.map((row) => [row.config_path, row]));
			const entriesToInsert = [];
			let transactionReconciledCount = 0;
			for (const entry of entries) {
				const existingEntry = existingByPath.get(entry.configPath);
				if (!existingEntry) {
					entriesToInsert.push(entry);
					continue;
				}
				const lastKnownGoodJson = existingEntry.last_known_good_json ?? entry.lastKnownGoodJson;
				const lastPromotedGoodJson = existingEntry.last_promoted_good_json ?? entry.lastPromotedGoodJson;
				if (lastKnownGoodJson === existingEntry.last_known_good_json && lastPromotedGoodJson === existingEntry.last_promoted_good_json) continue;
				executeSqliteQuerySync(db, stateDb.updateTable("config_health_entries").set({
					last_known_good_json: lastKnownGoodJson,
					last_promoted_good_json: lastPromotedGoodJson,
					updated_at_ms: Date.now()
				}).where("config_path", "=", entry.configPath));
				transactionReconciledCount += 1;
			}
			if (entriesToInsert.length > 0) executeSqliteQuerySync(db, stateDb.insertInto("config_health_entries").values(entriesToInsert.map(configHealthRow)));
			return {
				importedCount: entriesToInsert.length,
				reconciledCount: transactionReconciledCount
			};
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		importedCount = result.importedCount;
		reconciledCount = result.reconciledCount;
		shouldArchive = true;
	} catch (err) {
		warnings.push(`Failed migrating legacy config health state: ${String(err)}`);
	}
	if (importedCount > 0) changes.push(`Migrated ${importedCount} config health ${importedCount === 1 ? "entry" : "entries"} → shared SQLite state`);
	if (reconciledCount > 0) changes.push(`Reconciled ${reconciledCount} config health ${reconciledCount === 1 ? "entry" : "entries"} → shared SQLite state`);
	if (shouldArchive) retireLegacyConfigHealthSource({
		sourcePath: params.detected.sourcePath,
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
function resolveLegacyPluginBindingApprovalsPath(env, homedir) {
	return path.join(resolveRequiredHomeDir(env, homedir), ".openclaw", "plugin-binding-approvals.json");
}
function pluginBindingApprovalScopeKey(entry) {
	return [
		entry.pluginRoot,
		normalizeLowercaseStringOrEmpty(entry.channel),
		entry.accountId
	].join("::");
}
function normalizeLegacyPluginBindingApprovalEntry(input) {
	const entry = input && typeof input === "object" ? input : {};
	const pluginRoot = typeof entry.pluginRoot === "string" ? entry.pluginRoot.trim() : "";
	const pluginId = typeof entry.pluginId === "string" ? entry.pluginId.trim() : "";
	const channel = typeof entry.channel === "string" ? normalizeLowercaseStringOrEmpty(entry.channel) : "";
	const accountId = typeof entry.accountId === "string" && entry.accountId.trim() ? entry.accountId.trim() : "default";
	if (!pluginRoot || !pluginId || !channel) return null;
	return {
		pluginRoot,
		pluginId,
		pluginName: typeof entry.pluginName === "string" ? entry.pluginName : void 0,
		channel,
		accountId,
		approvedAt: typeof entry.approvedAt === "number" && Number.isFinite(entry.approvedAt) ? Math.floor(entry.approvedAt) : Date.now()
	};
}
function normalizeLegacyPluginBindingApprovalsFile(input) {
	const file = input && typeof input === "object" ? input : {};
	if (file.version !== 1 || !Array.isArray(file.approvals)) return [];
	const approvals = /* @__PURE__ */ new Map();
	for (const item of file.approvals) {
		const entry = normalizeLegacyPluginBindingApprovalEntry(item);
		if (!entry) continue;
		approvals.set(pluginBindingApprovalScopeKey(entry), entry);
	}
	return [...approvals.values()].toSorted((a, b) => pluginBindingApprovalScopeKey(a).localeCompare(pluginBindingApprovalScopeKey(b)));
}
function pluginBindingApprovalRow(entry) {
	return {
		plugin_root: entry.pluginRoot,
		channel: entry.channel,
		account_id: entry.accountId,
		plugin_id: entry.pluginId,
		plugin_name: entry.pluginName ?? null,
		approved_at: entry.approvedAt
	};
}
function pluginBindingApprovalComparable(entry) {
	return JSON.stringify(pluginBindingApprovalRow(entry));
}
function migrateLegacyPluginBindingApprovals(params) {
	const changes = [];
	const warnings = [];
	if (!params.detected.hasLegacy || !fileExists(params.detected.sourcePath)) return {
		changes,
		warnings
	};
	let approvals;
	try {
		approvals = normalizeLegacyPluginBindingApprovalsFile(readLegacyJsonObject(params.detected.sourcePath));
	} catch (err) {
		warnings.push(`Failed reading legacy plugin binding approvals ${params.detected.sourcePath}: ${String(err)}`);
		return {
			changes,
			warnings
		};
	}
	let importedCount = 0;
	let shouldArchive = approvals.length === 0;
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const stateDb = getNodeSqliteKysely(db);
			const existing = executeSqliteQuerySync(db, stateDb.selectFrom("plugin_binding_approvals").select([
				"plugin_root",
				"channel",
				"account_id",
				"plugin_id",
				"plugin_name",
				"approved_at"
			])).rows;
			const existingByKey = new Map(existing.map((row) => [pluginBindingApprovalScopeKey({
				pluginRoot: row.plugin_root,
				channel: row.channel,
				accountId: row.account_id
			}), JSON.stringify({
				plugin_root: row.plugin_root,
				channel: row.channel,
				account_id: row.account_id,
				plugin_id: row.plugin_id,
				plugin_name: row.plugin_name,
				approved_at: row.approved_at
			})]));
			const approvalsToInsert = [];
			let conflictCount = 0;
			for (const approval of approvals) {
				const key = pluginBindingApprovalScopeKey(approval);
				const existingApprovalJson = existingByKey.get(key);
				if (existingApprovalJson === void 0) approvalsToInsert.push(approval);
				else if (existingApprovalJson !== pluginBindingApprovalComparable(approval)) conflictCount += 1;
			}
			if (approvalsToInsert.length > 0) {
				executeSqliteQuerySync(db, stateDb.insertInto("plugin_binding_approvals").values(approvalsToInsert.map(pluginBindingApprovalRow)));
				importedCount = approvalsToInsert.length;
			}
			shouldArchive = conflictCount === 0;
			if (conflictCount > 0) warnings.push(`Left legacy plugin binding approvals in place because ${conflictCount} ${conflictCount === 1 ? "approval conflicts" : "approvals conflict"} with shared SQLite state: ${params.detected.sourcePath}`);
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
	} catch (err) {
		warnings.push(`Failed migrating legacy plugin binding approvals: ${String(err)}`);
	}
	if (importedCount > 0) changes.push(`Migrated ${importedCount} plugin binding ${importedCount === 1 ? "approval" : "approvals"} → shared SQLite state`);
	if (shouldArchive) archiveLegacyImportSource({
		sourcePath: params.detected.sourcePath,
		label: "plugin binding approvals",
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
const CURRENT_BINDING_CONVERSATION_KIND = "current";
function resolveLegacyCurrentConversationBindingsPath(stateDir) {
	return path.join(stateDir, "bindings", "current-conversations.json");
}
function currentConversationBindingKey(ref) {
	const normalized = normalizeConversationRef(ref);
	return [
		normalized.channel,
		normalized.accountId,
		normalized.parentConversationId ?? "",
		normalized.conversationId
	].join("␟");
}
function normalizeLegacyCurrentConversationBindingRecord(input) {
	const record = input && typeof input === "object" ? input : {};
	if (!record.conversation?.conversationId) return null;
	const conversation = normalizeConversationRef(record.conversation);
	const targetSessionKey = typeof record.targetSessionKey === "string" ? record.targetSessionKey.trim() : "";
	if (!targetSessionKey) return null;
	const targetKind = record.targetKind === "subagent" ? "subagent" : "session";
	const status = record.status === "ending" || record.status === "ended" ? record.status : "active";
	const boundAt = typeof record.boundAt === "number" && Number.isFinite(record.boundAt) ? Math.floor(record.boundAt) : Date.now();
	const expiresAt = typeof record.expiresAt === "number" && Number.isFinite(record.expiresAt) ? Math.floor(record.expiresAt) : void 0;
	return {
		bindingId: `generic:${currentConversationBindingKey(conversation)}`,
		targetSessionKey,
		targetKind,
		conversation,
		status,
		boundAt,
		...expiresAt !== void 0 ? { expiresAt } : {},
		...record.metadata && typeof record.metadata === "object" && !Array.isArray(record.metadata) ? { metadata: record.metadata } : {}
	};
}
function normalizeLegacyCurrentConversationBindingFile(input) {
	const file = input && typeof input === "object" ? input : {};
	if (file.version !== 1 || !Array.isArray(file.bindings)) return [];
	const records = /* @__PURE__ */ new Map();
	for (const item of file.bindings) {
		const record = normalizeLegacyCurrentConversationBindingRecord(item);
		if (!record) continue;
		records.set(currentConversationBindingKey(record.conversation), record);
	}
	return [...records.values()].toSorted((a, b) => a.bindingId.localeCompare(b.bindingId));
}
function currentConversationBindingRow(record) {
	const conversation = normalizeConversationRef(record.conversation);
	return {
		binding_key: currentConversationBindingKey(conversation),
		binding_id: record.bindingId,
		target_agent_id: resolveAgentIdFromSessionKey(record.targetSessionKey),
		target_session_id: null,
		target_session_key: record.targetSessionKey,
		channel: conversation.channel,
		account_id: conversation.accountId,
		conversation_kind: CURRENT_BINDING_CONVERSATION_KIND,
		parent_conversation_id: conversation.parentConversationId ?? null,
		conversation_id: conversation.conversationId,
		target_kind: record.targetKind,
		status: record.status,
		bound_at: record.boundAt,
		expires_at: record.expiresAt ?? null,
		metadata_json: record.metadata ? JSON.stringify(record.metadata) : null,
		record_json: JSON.stringify(record),
		updated_at: Date.now()
	};
}
function migrateLegacyCurrentConversationBindings(params) {
	const changes = [];
	const warnings = [];
	if (!fileExists(params.detected.sourcePath)) return {
		changes,
		warnings
	};
	let records;
	try {
		records = normalizeLegacyCurrentConversationBindingFile(readLegacyJsonObject(params.detected.sourcePath));
	} catch (err) {
		warnings.push(`Failed reading legacy current-conversation bindings ${params.detected.sourcePath}: ${String(err)}`);
		return {
			changes,
			warnings
		};
	}
	let importedCount = 0;
	let shouldArchive = records.length === 0;
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const stateDb = getNodeSqliteKysely(db);
			const existing = executeSqliteQuerySync(db, stateDb.selectFrom("current_conversation_bindings").select(["binding_key", "record_json"])).rows;
			const existingByKey = new Map(existing.map((row) => [row.binding_key, row.record_json]));
			const recordsToInsert = [];
			let conflictCount = 0;
			for (const record of records) {
				const key = currentConversationBindingKey(record.conversation);
				const existingRecordJson = existingByKey.get(key);
				if (existingRecordJson === void 0) recordsToInsert.push(record);
				else if (existingRecordJson !== JSON.stringify(record)) conflictCount += 1;
			}
			if (recordsToInsert.length === 0) {
				shouldArchive = conflictCount === 0;
				if (conflictCount > 0) warnings.push(`Left legacy current-conversation bindings in place because ${conflictCount} ${conflictCount === 1 ? "binding conflicts" : "bindings conflict"} with shared SQLite state: ${params.detected.sourcePath}`);
				return;
			}
			executeSqliteQuerySync(db, stateDb.insertInto("current_conversation_bindings").values(recordsToInsert.map(currentConversationBindingRow)));
			importedCount = recordsToInsert.length;
			shouldArchive = conflictCount === 0;
			if (conflictCount > 0) warnings.push(`Left legacy current-conversation bindings in place because ${conflictCount} ${conflictCount === 1 ? "binding conflicts" : "bindings conflict"} with shared SQLite state: ${params.detected.sourcePath}`);
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
	} catch (err) {
		warnings.push(`Failed migrating legacy current-conversation bindings: ${String(err)}`);
	}
	if (importedCount > 0) changes.push(`Migrated ${importedCount} current-conversation ${importedCount === 1 ? "binding" : "bindings"} → shared SQLite state`);
	if (shouldArchive) archiveLegacyImportSource({
		sourcePath: params.detected.sourcePath,
		label: "current-conversation bindings",
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.state-dir.ts
let autoMigrateStateDirChecked = false;
let autoMigrateTaskStateSidecarsChecked = false;
function resetAutoMigrateLegacyStateDirForTest() {
	autoMigrateStateDirChecked = false;
}
function resetAutoMigrateLegacyTaskStateSidecarsForTest() {
	autoMigrateTaskStateSidecarsChecked = false;
}
function resolveSymlinkTarget(linkPath) {
	try {
		const target = fs.readlinkSync(linkPath);
		return path.resolve(path.dirname(linkPath), target);
	} catch {
		return null;
	}
}
function formatStateDirMigration(legacyDir, targetDir) {
	return `State dir: ${legacyDir} → ${targetDir} (legacy path now symlinked)`;
}
function isDirPath(filePath) {
	try {
		return fs.statSync(filePath).isDirectory();
	} catch {
		return false;
	}
}
function isLegacyTreeSymlinkMirror(currentDir, realTargetDir) {
	let entries;
	try {
		entries = fs.readdirSync(currentDir, { withFileTypes: true });
	} catch {
		return false;
	}
	if (entries.length === 0) return false;
	for (const entry of entries) {
		const entryPath = path.join(currentDir, entry.name);
		let stat;
		try {
			stat = fs.lstatSync(entryPath);
		} catch {
			return false;
		}
		if (stat.isSymbolicLink()) {
			const resolvedTarget = resolveSymlinkTarget(entryPath);
			if (!resolvedTarget) return false;
			let resolvedRealTarget;
			try {
				resolvedRealTarget = fs.realpathSync(resolvedTarget);
			} catch {
				return false;
			}
			if (!isWithinDir(realTargetDir, resolvedRealTarget)) return false;
			continue;
		}
		if (stat.isDirectory()) {
			if (!isLegacyTreeSymlinkMirror(entryPath, realTargetDir)) return false;
			continue;
		}
		return false;
	}
	return true;
}
function isLegacyDirSymlinkMirror(legacyDir, targetDir) {
	let realTargetDir;
	try {
		realTargetDir = fs.realpathSync(targetDir);
	} catch {
		return false;
	}
	return isLegacyTreeSymlinkMirror(legacyDir, realTargetDir);
}
async function autoMigrateLegacyStateDir(params) {
	if (autoMigrateStateDirChecked) return {
		migrated: false,
		skipped: true,
		changes: [],
		warnings: []
	};
	autoMigrateStateDirChecked = true;
	const homedir = params.homedir ?? os.homedir;
	const env = params.env ?? process.env;
	const warnings = [];
	const changes = [];
	const notices = [];
	const hasCustomStateDir = Boolean(env.OPENCLAW_STATE_DIR?.trim());
	const targetDir = hasCustomStateDir ? resolveStateDir(env, homedir) : resolveNewStateDir(homedir);
	const migratePluginInstallIndex = async () => {
		const result = await migrateLegacyInstalledPluginIndex({ stateDir: targetDir });
		changes.push(...result.changes);
		warnings.push(...result.warnings);
		notices.push(...result.notices ?? []);
	};
	if (hasCustomStateDir) {
		await migratePluginInstallIndex();
		return {
			migrated: changes.length > 0,
			skipped: changes.length === 0 && warnings.length === 0 && notices.length === 0,
			changes,
			warnings,
			...notices.length > 0 ? { notices } : {}
		};
	}
	const legacyDirs = resolveLegacyStateDirs(homedir);
	let legacyDir = legacyDirs.find((dir) => {
		try {
			return fs.existsSync(dir);
		} catch {
			return false;
		}
	});
	let legacyStat;
	try {
		legacyStat = legacyDir ? fs.lstatSync(legacyDir) : null;
	} catch {
		legacyStat = null;
	}
	if (!legacyStat) {
		await migratePluginInstallIndex();
		return {
			migrated: changes.length > 0,
			skipped: false,
			changes,
			warnings,
			...notices.length > 0 ? { notices } : {}
		};
	}
	if (!legacyStat.isDirectory() && !legacyStat.isSymbolicLink()) {
		warnings.push(`Legacy state path is not a directory: ${legacyDir}`);
		return {
			migrated: false,
			skipped: false,
			changes,
			warnings
		};
	}
	let symlinkDepth = 0;
	while (legacyStat.isSymbolicLink()) {
		const legacyTarget = legacyDir ? resolveSymlinkTarget(legacyDir) : null;
		if (!legacyTarget) {
			warnings.push(`Legacy state dir is a symlink (${legacyDir ?? "unknown"}); could not resolve target.`);
			return {
				migrated: false,
				skipped: false,
				changes,
				warnings
			};
		}
		if (path.resolve(legacyTarget) === path.resolve(targetDir)) {
			await migratePluginInstallIndex();
			return {
				migrated: changes.length > 0,
				skipped: false,
				changes,
				warnings,
				...notices.length > 0 ? { notices } : {}
			};
		}
		if (legacyDirs.some((dir) => path.resolve(dir) === path.resolve(legacyTarget))) {
			legacyDir = legacyTarget;
			try {
				legacyStat = fs.lstatSync(legacyDir);
			} catch {
				legacyStat = null;
			}
			if (!legacyStat) {
				warnings.push(`Legacy state dir missing after symlink resolution: ${legacyDir}`);
				return {
					migrated: false,
					skipped: false,
					changes,
					warnings
				};
			}
			if (!legacyStat.isDirectory() && !legacyStat.isSymbolicLink()) {
				warnings.push(`Legacy state path is not a directory: ${legacyDir}`);
				return {
					migrated: false,
					skipped: false,
					changes,
					warnings
				};
			}
			symlinkDepth += 1;
			if (symlinkDepth > 2) {
				warnings.push(`Legacy state dir symlink chain too deep: ${legacyDir}`);
				return {
					migrated: false,
					skipped: false,
					changes,
					warnings
				};
			}
			continue;
		}
		warnings.push(`Legacy state dir is a symlink (${legacyDir ?? "unknown"} → ${legacyTarget}); skipping auto-migration.`);
		return {
			migrated: false,
			skipped: false,
			changes,
			warnings
		};
	}
	if (isDirPath(targetDir)) {
		if (legacyDir && isLegacyDirSymlinkMirror(legacyDir, targetDir)) {
			await migratePluginInstallIndex();
			return {
				migrated: changes.length > 0,
				skipped: false,
				changes,
				warnings,
				...notices.length > 0 ? { notices } : {}
			};
		}
		await migratePluginInstallIndex();
		warnings.push(`State dir migration skipped: target already exists (${targetDir}). Remove or merge manually.`);
		return {
			migrated: changes.length > 0,
			skipped: false,
			changes,
			warnings,
			...notices.length > 0 ? { notices } : {}
		};
	}
	try {
		if (!legacyDir) throw new Error("Legacy state dir not found");
		fs.renameSync(legacyDir, targetDir);
	} catch (err) {
		warnings.push(`Failed to move legacy state dir (${legacyDir ?? "unknown"} → ${targetDir}): ${String(err)}`);
		return {
			migrated: false,
			skipped: false,
			changes,
			warnings
		};
	}
	try {
		if (!legacyDir) throw new Error("Legacy state dir not found");
		fs.symlinkSync(targetDir, legacyDir, "dir");
		changes.push(formatStateDirMigration(legacyDir, targetDir));
	} catch (err) {
		try {
			if (process.platform === "win32") {
				if (!legacyDir) throw new Error("Legacy state dir not found", { cause: err });
				fs.symlinkSync(targetDir, legacyDir, "junction");
				changes.push(formatStateDirMigration(legacyDir, targetDir));
			} else throw err;
		} catch (fallbackErr) {
			try {
				if (!legacyDir) throw new Error("Legacy state dir not found", { cause: fallbackErr });
				fs.renameSync(targetDir, legacyDir);
				warnings.push(`State dir migration rolled back (failed to link legacy path): ${String(fallbackErr)}`);
				return {
					migrated: false,
					skipped: false,
					changes: [],
					warnings
				};
			} catch (rollbackErr) {
				warnings.push(`State dir moved but failed to link legacy path (${legacyDir ?? "unknown"} → ${targetDir}): ${String(fallbackErr)}`);
				warnings.push(`Rollback failed; set OPENCLAW_STATE_DIR=${targetDir} to avoid split state: ${String(rollbackErr)}`);
				changes.push(`State dir: ${legacyDir ?? "unknown"} → ${targetDir}`);
			}
		}
	}
	await migratePluginInstallIndex();
	return {
		migrated: changes.length > 0,
		skipped: false,
		changes,
		warnings,
		...notices.length > 0 ? { notices } : {}
	};
}
async function autoMigrateLegacyTaskStateSidecars(params) {
	if (autoMigrateTaskStateSidecarsChecked) return {
		migrated: false,
		skipped: true,
		changes: [],
		warnings: []
	};
	autoMigrateTaskStateSidecarsChecked = true;
	const result = await migrateLegacyTaskStateSidecars({ stateDir: resolveStateDir(params.env ?? process.env, params.homedir) });
	const logger = params.log ?? createSubsystemLogger("state-migrations");
	if (result.changes.length > 0) logger.info(`Auto-migrated legacy state:\n${result.changes.map((entry) => `- ${entry}`).join("\n")}`);
	if (result.warnings.length > 0) logger.warn(`Legacy state migration warnings:\n${result.warnings.map((entry) => `- ${entry}`).join("\n")}`);
	return {
		migrated: result.changes.length > 0,
		skipped: false,
		changes: result.changes,
		warnings: result.warnings
	};
}
//#endregion
//#region src/infra/state-migrations.subagent-registry-db.ts
const MIGRATION_KIND$1 = "legacy-subagent-registry-json";
/** Records the irreversible retirement decision before Doctor removes the claimed file. */
function recordLegacySubagentRegistryDiscard(params) {
	const sourceKey = `subagent-json:${createHash("sha256").update(params.sourcePath).digest("hex")}`;
	const now = Date.now();
	const runId = `${sourceKey}:${params.sourceSha256.slice(0, 16)}`;
	let decision = "retired-source-discarded";
	runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		if (executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("migration_sources").select("source_key").where("source_key", "=", sourceKey))) decision = "receipt-authoritative";
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND$1,
			target: "subagent_runs",
			decision,
			sourceSha256: params.sourceSha256,
			importedRecordCount: 0,
			reason: "retired transient state is never imported into the canonical SQLite registry"
		});
		executeSqliteQuerySync(db, stateDb.insertInto("migration_runs").values({
			id: runId,
			started_at: now,
			finished_at: now,
			status: "completed",
			report_json: reportJson
		}).onConflict((conflict) => conflict.column("id").doUpdateSet({
			finished_at: now,
			status: "completed",
			report_json: reportJson
		})));
		executeSqliteQuerySync(db, stateDb.insertInto("migration_sources").values({
			source_key: sourceKey,
			migration_kind: MIGRATION_KIND$1,
			source_path: params.sourcePath,
			target_table: "subagent_runs",
			source_sha256: params.sourceSha256,
			source_size_bytes: params.sourceSize,
			source_record_count: null,
			last_run_id: runId,
			status: "completed",
			imported_at: now,
			removed_source: 0,
			report_json: reportJson
		}).onConflict((conflict) => conflict.column("source_key").doUpdateSet({
			source_sha256: params.sourceSha256,
			source_size_bytes: params.sourceSize,
			source_record_count: null,
			last_run_id: runId,
			status: "completed",
			imported_at: now,
			removed_source: 0,
			report_json: reportJson
		})));
	}, { env: params.env });
	return {
		decision,
		sourceKey
	};
}
function markLegacySubagentRegistrySourceRemoved(sourceKey, env) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("migration_sources").set({ removed_source: 1 }).where("source_key", "=", sourceKey));
	}, { env });
}
//#endregion
//#region src/infra/state-migrations.subagent-registry.ts
const LEGACY_SUBAGENT_REGISTRY_MAX_BYTES = 16 * 1024 * 1024;
const MIGRATION_LOCK_TIMEOUT_MS$2 = 250;
const MIGRATION_LOCK_POLL_INTERVAL_MS$2 = 25;
const DOCTOR_CLAIM_SUFFIX$1 = ".doctor-importing";
function resolveLegacySubagentRegistryPath(stateDir) {
	return path.join(stateDir, "subagents", "runs.json");
}
function legacyPathMayExist$1(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
function sourceOrClaimMayExist$2(sourcePath) {
	return legacyPathMayExist$1(sourcePath) || legacyPathMayExist$1(`${sourcePath}${DOCTOR_CLAIM_SUFFIX$1}`);
}
/** Detect retired subagent state only when an explicit Doctor flow opts in. */
function detectLegacySubagentRegistry(params) {
	const sourcePath = resolveLegacySubagentRegistryPath(params.stateDir);
	return {
		sourcePath,
		hasLegacy: params.doctorOnlyStateMigrations === true && sourceOrClaimMayExist$2(sourcePath)
	};
}
function relativeLegacyPath$1(stateDir, filePath) {
	const relativePath = path.relative(path.resolve(stateDir), path.resolve(filePath));
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) throw new Error(`legacy subagent registry path is outside the state directory: ${filePath}`);
	return relativePath;
}
async function readLegacySourceSnapshot$2(stateRoot, stateDir, sourcePath) {
	const opened = await stateRoot.read(relativeLegacyPath$1(stateDir, sourcePath), {
		hardlinks: "reject",
		maxBytes: LEGACY_SUBAGENT_REGISTRY_MAX_BYTES,
		symlinks: "reject"
	});
	return {
		sourcePath,
		dev: opened.stat.dev,
		ino: opened.stat.ino,
		mtimeMs: opened.stat.mtimeMs,
		sha256: createHash("sha256").update(opened.buffer).digest("hex"),
		size: opened.stat.size
	};
}
function sourceSnapshotsMatch$1(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mtimeMs === right.mtimeMs && left.sha256 === right.sha256 && left.size === right.size;
}
async function recoverInterruptedClaim$1(stateRoot, stateDir, sourcePath, env) {
	const claimPath = `${sourcePath}${DOCTOR_CLAIM_SUFFIX$1}`;
	const claimRelativePath = relativeLegacyPath$1(stateDir, claimPath);
	const sourceRelativePath = relativeLegacyPath$1(stateDir, sourcePath);
	if (!await stateRoot.exists(claimRelativePath)) return;
	const claimed = await readLegacySourceSnapshot$2(stateRoot, stateDir, claimPath);
	if (!await stateRoot.exists(sourceRelativePath)) {
		await stateRoot.move(claimRelativePath, sourceRelativePath);
		return;
	}
	await readLegacySourceSnapshot$2(stateRoot, stateDir, sourcePath);
	const result = recordLegacySubagentRegistryDiscard({
		env,
		sourcePath,
		sourceSha256: claimed.sha256,
		sourceSize: claimed.size
	});
	await stateRoot.remove(claimRelativePath);
	markLegacySubagentRegistrySourceRemoved(result.sourceKey, env);
}
async function restoreClaim$1(params) {
	const claimPath = `${params.sourcePath}${DOCTOR_CLAIM_SUFFIX$1}`;
	try {
		if (!await params.stateRoot.exists(relativeLegacyPath$1(params.stateDir, claimPath))) return null;
		if (await params.stateRoot.exists(relativeLegacyPath$1(params.stateDir, params.sourcePath))) return `source path already exists: ${params.sourcePath}`;
		await params.stateRoot.move(relativeLegacyPath$1(params.stateDir, claimPath), relativeLegacyPath$1(params.stateDir, params.sourcePath));
		return null;
	} catch (error) {
		return String(error);
	}
}
async function migrateWithExclusiveStateOwnership(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	const sourcePath = params.detected.sourcePath;
	if (!params.detected.hasLegacy) return {
		changes,
		warnings
	};
	let snapshot;
	try {
		await recoverInterruptedClaim$1(params.stateRoot, params.stateDir, sourcePath, params.env);
		if (!await params.stateRoot.exists(relativeLegacyPath$1(params.stateDir, sourcePath))) return {
			changes,
			warnings
		};
		snapshot = await readLegacySourceSnapshot$2(params.stateRoot, params.stateDir, sourcePath);
	} catch (error) {
		warnings.push(`Failed reading legacy subagent registry: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	const claimPath = `${sourcePath}${DOCTOR_CLAIM_SUFFIX$1}`;
	try {
		params.beforeVerify?.();
		if (!sourceSnapshotsMatch$1(await readLegacySourceSnapshot$2(params.stateRoot, params.stateDir, sourcePath), snapshot)) throw new Error("legacy subagent registry changed after Doctor loaded it");
		params.beforeClaim?.();
		await params.stateRoot.move(relativeLegacyPath$1(params.stateDir, sourcePath), relativeLegacyPath$1(params.stateDir, claimPath));
		if (!sourceSnapshotsMatch$1(await readLegacySourceSnapshot$2(params.stateRoot, params.stateDir, claimPath), snapshot)) throw new Error("legacy subagent registry changed before Doctor could claim it");
	} catch (error) {
		const restoreError = await restoreClaim$1({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath
		});
		warnings.push(`Failed migrating legacy subagent registry: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	let result;
	try {
		result = recordLegacySubagentRegistryDiscard({
			env: params.env,
			sourcePath: snapshot.sourcePath,
			sourceSha256: snapshot.sha256,
			sourceSize: snapshot.size
		});
	} catch (error) {
		const restoreError = await restoreClaim$1({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath
		});
		warnings.push(`Failed migrating legacy subagent registry: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	try {
		if (await params.stateRoot.exists(relativeLegacyPath$1(params.stateDir, sourcePath))) throw new Error(`legacy subagent registry reappeared during retirement: ${sourcePath}`);
		if (params.removeSource) await params.removeSource(claimPath);
		else await params.stateRoot.remove(relativeLegacyPath$1(params.stateDir, claimPath));
		if (await params.stateRoot.exists(relativeLegacyPath$1(params.stateDir, sourcePath))) throw new Error(`legacy subagent registry reappeared during cleanup: ${sourcePath}`);
		if (await params.stateRoot.exists(relativeLegacyPath$1(params.stateDir, claimPath))) throw new Error(`legacy subagent registry Doctor claim remains after cleanup: ${claimPath}`);
	} catch (error) {
		warnings.push(`Legacy subagent registry retirement cleanup failed: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		markLegacySubagentRegistrySourceRemoved(result.sourceKey, params.env);
	} catch (error) {
		warnings.push(`Legacy subagent registry was removed, but its receipt could not be finalized: ${String(error)}`);
	}
	changes.push(result.decision === "receipt-authoritative" ? "Discarded recreated retired subagent JSON without importing it." : "Discarded retired subagent JSON without importing transient run state.");
	notices.push("Removed retired subagents/runs.json after the discard decision was recorded.");
	return {
		changes,
		warnings,
		notices
	};
}
/** Discard retired transient state while excluding active Gateway owners. */
async function migrateLegacySubagentRegistry(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	const env = {
		...params.env ?? process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env,
			pollIntervalMs: MIGRATION_LOCK_POLL_INTERVAL_MS$2,
			role: "sqlite-maintenance",
			timeoutMs: MIGRATION_LOCK_TIMEOUT_MS$2
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed migrating legacy subagent registry: ${error instanceof GatewayLockError ? "the Gateway or another SQLite maintenance command owns this state directory" : String(error)}. Stop the Gateway, then run \`openclaw doctor --fix\` again.`]
		};
	}
	if (!lock) return {
		changes: [],
		warnings: ["Failed migrating legacy subagent registry: exclusive state ownership unavailable."]
	};
	let result = {
		changes: [],
		warnings: []
	};
	let releaseError;
	try {
		try {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				maxBytes: LEGACY_SUBAGENT_REGISTRY_MAX_BYTES,
				symlinks: "reject"
			});
			result = await migrateWithExclusiveStateOwnership({
				...params,
				env,
				stateRoot
			});
		} catch (error) {
			result.warnings.push(`Failed reading legacy subagent registry: ${String(error)}`);
		}
	} finally {
		try {
			await lock.release();
		} catch (error) {
			releaseError = error;
		}
	}
	if (releaseError) result.warnings.push(`Subagent registry migration lock release failed: ${formatErrorMessage(releaseError)}`);
	return result;
}
//#endregion
//#region src/infra/state-migrations.tui-last-session.ts
const LEGACY_RECORD_KEYS = /* @__PURE__ */ new Set(["sessionKey", "updatedAt"]);
function resolveLegacyTuiLastSessionPath(stateDir) {
	return path.join(stateDir, "tui", "last-session.json");
}
/** Detect retired TUI state only when an explicit doctor flow opts in. */
function detectLegacyTuiLastSessions(params) {
	const sourcePath = resolveLegacyTuiLastSessionPath(params.stateDir);
	return {
		sourcePath,
		hasLegacy: params.doctorOnlyStateMigrations === true && fs.existsSync(sourcePath)
	};
}
function readLegacySourceSnapshot$1(sourcePath) {
	const before = fs.statSync(sourcePath);
	if (!before.isFile()) throw new Error("legacy TUI last-session source is not a regular file");
	const raw = fs.readFileSync(sourcePath, "utf8");
	const after = fs.statSync(sourcePath);
	if (before.dev !== after.dev || before.ino !== after.ino || before.size !== after.size || before.mtimeMs !== after.mtimeMs) throw new Error("legacy TUI last-session source changed while doctor was reading it");
	return {
		dev: after.dev,
		ino: after.ino,
		mtimeMs: after.mtimeMs,
		raw,
		sha256: createHash("sha256").update(raw).digest("hex"),
		size: after.size
	};
}
function assertLegacySourceUnchanged(sourcePath, expected) {
	if (!legacySourceSnapshotsMatch(readLegacySourceSnapshot$1(sourcePath), expected)) throw new Error("legacy TUI last-session source changed after doctor loaded it");
}
function legacySourceSnapshotsMatch(current, expected) {
	return current.dev === expected.dev && current.ino === expected.ino && current.size === expected.size && current.mtimeMs === expected.mtimeMs && current.sha256 === expected.sha256;
}
function restoreClaimAfterCleanupFailure(params) {
	if (!fs.existsSync(params.claimPath) || fs.existsSync(params.sourcePath)) return null;
	try {
		fs.renameSync(params.claimPath, params.sourcePath);
		return null;
	} catch (error) {
		return `; the claimed source remains at ${params.claimPath} because restore also failed: ${String(error)}`;
	}
}
function claimAndRemoveVerifiedLegacySource(params) {
	params.beforeClaim?.();
	const claimPath = `${params.sourcePath}.doctor-importing-${process.pid}-${randomUUID()}`;
	fs.renameSync(params.sourcePath, claimPath);
	try {
		if (!legacySourceSnapshotsMatch(readLegacySourceSnapshot$1(claimPath), params.snapshot)) throw new Error("legacy TUI last-session source changed before doctor could claim it");
		(params.removeSource ?? fs.unlinkSync)(claimPath);
	} catch (error) {
		const restoreFailure = restoreClaimAfterCleanupFailure({
			claimPath,
			sourcePath: params.sourcePath
		});
		throw new Error(`${String(error)}${restoreFailure ?? ""}`, { cause: error });
	}
}
function isObjectRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isHeartbeatSessionKey(sessionKey) {
	return sessionKey.toLowerCase().endsWith(":heartbeat");
}
function parseLegacyTuiLastSessions(raw) {
	const parsed = JSON.parse(raw);
	if (!isObjectRecord(parsed)) throw new Error("legacy TUI last-session store must be a JSON object");
	const records = [];
	for (const [scopeKey, value] of Object.entries(parsed)) {
		if (!scopeKey || scopeKey.trim() !== scopeKey) throw new Error("legacy TUI last-session store contains an invalid scope key");
		if (!isObjectRecord(value)) throw new Error(`legacy TUI last-session record ${scopeKey} must be an object`);
		const unexpectedKey = Object.keys(value).find((key) => !LEGACY_RECORD_KEYS.has(key));
		if (unexpectedKey) throw new Error(`legacy TUI last-session record ${scopeKey} has unexpected field ${unexpectedKey}`);
		const sessionKey = value.sessionKey;
		const updatedAt = value.updatedAt;
		if (typeof sessionKey !== "string" || !sessionKey || sessionKey.trim() !== sessionKey || sessionKey === "unknown") throw new Error(`legacy TUI last-session record ${scopeKey} has an invalid session key`);
		if (!Number.isSafeInteger(updatedAt) || updatedAt < 0) throw new Error(`legacy TUI last-session record ${scopeKey} has an invalid timestamp`);
		records.push({
			scopeKey,
			sessionKey,
			updatedAt
		});
	}
	return records;
}
function rowMatches(row, expected) {
	return row?.session_key === expected.sessionKey && row.updated_at === expected.updatedAt;
}
/** Import, verify, and remove the retired JSON store during an explicit doctor repair. */
function migrateLegacyTuiLastSessions(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	if (!params.detected.hasLegacy) return {
		changes,
		warnings
	};
	let snapshot;
	let records;
	try {
		snapshot = readLegacySourceSnapshot$1(params.detected.sourcePath);
		records = parseLegacyTuiLastSessions(snapshot.raw);
	} catch (error) {
		warnings.push(`Failed reading legacy TUI last-session state ${params.detected.sourcePath}: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	const activeRecords = records.filter((record) => !isHeartbeatSessionKey(record.sessionKey));
	const discardedHeartbeatCount = records.length - activeRecords.length;
	const expectedRows = /* @__PURE__ */ new Map();
	let importedCount = 0;
	let supersededCount = 0;
	try {
		assertLegacySourceUnchanged(params.detected.sourcePath, snapshot);
		runOpenClawStateWriteTransaction(({ db }) => {
			const tuiDb = getNodeSqliteKysely(db);
			for (const record of activeRecords) {
				const existing = executeSqliteQueryTakeFirstSync(db, tuiDb.selectFrom("tui_last_sessions").select(["session_key", "updated_at"]).where("scope_key", "=", record.scopeKey));
				if (!existing) {
					executeSqliteQuerySync(db, tuiDb.insertInto("tui_last_sessions").values({
						scope_key: record.scopeKey,
						session_key: record.sessionKey,
						updated_at: record.updatedAt
					}));
					expectedRows.set(record.scopeKey, record);
					importedCount += 1;
					continue;
				}
				if (existing.updated_at === record.updatedAt) {
					if (existing.session_key !== record.sessionKey) throw new Error(`scope ${record.scopeKey} has divergent JSON and SQLite pointers at the same timestamp`);
					expectedRows.set(record.scopeKey, record);
					continue;
				}
				if (existing.updated_at > record.updatedAt) {
					expectedRows.set(record.scopeKey, {
						scopeKey: record.scopeKey,
						sessionKey: existing.session_key,
						updatedAt: existing.updated_at
					});
					supersededCount += 1;
					continue;
				}
				executeSqliteQuerySync(db, tuiDb.updateTable("tui_last_sessions").set({
					session_key: record.sessionKey,
					updated_at: record.updatedAt
				}).where("scope_key", "=", record.scopeKey));
				expectedRows.set(record.scopeKey, record);
				importedCount += 1;
			}
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
	} catch (error) {
		warnings.push(`Failed migrating legacy TUI last-session state: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		params.beforeVerify?.();
		const database = openOpenClawStateDatabase({ env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		const tuiDb = getNodeSqliteKysely(database.db);
		for (const expected of expectedRows.values()) if (!rowMatches(executeSqliteQueryTakeFirstSync(database.db, tuiDb.selectFrom("tui_last_sessions").select(["session_key", "updated_at"]).where("scope_key", "=", expected.scopeKey)), expected)) throw new Error(`SQLite verification failed for scope ${expected.scopeKey}`);
		assertLegacySourceUnchanged(params.detected.sourcePath, snapshot);
	} catch (error) {
		warnings.push(`Failed verifying legacy TUI last-session migration: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		claimAndRemoveVerifiedLegacySource({
			sourcePath: params.detected.sourcePath,
			snapshot,
			beforeClaim: params.beforeClaim,
			removeSource: params.removeSource
		});
	} catch (error) {
		warnings.push(`Migrated TUI last-session state but could not remove legacy source ${params.detected.sourcePath}: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	if (importedCount > 0) changes.push(`Migrated ${importedCount} TUI last-session pointer(s) → shared SQLite state`);
	if (discardedHeartbeatCount > 0) changes.push(`Discarded ${discardedHeartbeatCount} legacy heartbeat TUI restore pointer(s)`);
	changes.push("Removed legacy TUI last-session JSON after SQLite verification");
	if (supersededCount > 0) notices.push(`Kept ${supersededCount} newer shared SQLite TUI last-session pointer(s) over legacy JSON`);
	return notices.length > 0 ? {
		changes,
		warnings,
		notices
	} : {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.update-check.ts
const UPDATE_CHECK_STATE_KEY = "default";
function resolveLegacyUpdateCheckPath(stateDir) {
	return path.join(stateDir, "update-check.json");
}
function normalizeLegacyUpdateCheckState(input) {
	const record = input && typeof input === "object" ? input : {};
	const readString = (key) => {
		const value = record[key];
		return typeof value === "string" && value.trim().length > 0 ? value : void 0;
	};
	return {
		lastCheckedAt: readString("lastCheckedAt"),
		lastNotifiedVersion: readString("lastNotifiedVersion"),
		lastNotifiedTag: readString("lastNotifiedTag"),
		lastAvailableVersion: readString("lastAvailableVersion"),
		lastAvailableTag: readString("lastAvailableTag"),
		autoInstallId: readString("autoInstallId"),
		autoFirstSeenVersion: readString("autoFirstSeenVersion"),
		autoFirstSeenTag: readString("autoFirstSeenTag"),
		autoFirstSeenAt: readString("autoFirstSeenAt"),
		autoLastAttemptVersion: readString("autoLastAttemptVersion"),
		autoLastAttemptAt: readString("autoLastAttemptAt"),
		autoLastSuccessVersion: readString("autoLastSuccessVersion"),
		autoLastSuccessAt: readString("autoLastSuccessAt")
	};
}
function legacyUpdateCheckStateMatches(row, state) {
	return (state.lastCheckedAt ?? null) === row.last_checked_at && (state.lastNotifiedVersion ?? null) === row.last_notified_version && (state.lastNotifiedTag ?? null) === row.last_notified_tag && (state.lastAvailableVersion ?? null) === row.last_available_version && (state.lastAvailableTag ?? null) === row.last_available_tag && (state.autoInstallId ?? null) === row.auto_install_id && (state.autoFirstSeenVersion ?? null) === row.auto_first_seen_version && (state.autoFirstSeenTag ?? null) === row.auto_first_seen_tag && (state.autoFirstSeenAt ?? null) === row.auto_first_seen_at && (state.autoLastAttemptVersion ?? null) === row.auto_last_attempt_version && (state.autoLastAttemptAt ?? null) === row.auto_last_attempt_at && (state.autoLastSuccessVersion ?? null) === row.auto_last_success_version && (state.autoLastSuccessAt ?? null) === row.auto_last_success_at;
}
function migrateLegacyUpdateCheckState(params) {
	const changes = [];
	const warnings = [];
	let notice;
	if (!fileExists(params.detected.sourcePath)) return {
		changes,
		warnings
	};
	let state;
	try {
		state = normalizeLegacyUpdateCheckState(JSON.parse(fs.readFileSync(params.detected.sourcePath, "utf8")));
	} catch (err) {
		warnings.push(`Failed reading legacy update-check state ${params.detected.sourcePath}: ${String(err)}`);
		return {
			changes,
			warnings
		};
	}
	let imported = false;
	let shouldArchive = false;
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const stateDb = getNodeSqliteKysely(db);
			const existing = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("update_check_state").selectAll().where("state_key", "=", UPDATE_CHECK_STATE_KEY));
			if (existing) {
				if (!legacyUpdateCheckStateMatches(existing, state)) notice = `Kept shared SQLite update-check state because legacy cache differs: ${params.detected.sourcePath}`;
				shouldArchive = true;
				return;
			}
			executeSqliteQuerySync(db, stateDb.insertInto("update_check_state").values({
				state_key: UPDATE_CHECK_STATE_KEY,
				last_checked_at: state.lastCheckedAt ?? null,
				last_notified_version: state.lastNotifiedVersion ?? null,
				last_notified_tag: state.lastNotifiedTag ?? null,
				last_available_version: state.lastAvailableVersion ?? null,
				last_available_tag: state.lastAvailableTag ?? null,
				auto_install_id: state.autoInstallId ?? null,
				auto_first_seen_version: state.autoFirstSeenVersion ?? null,
				auto_first_seen_tag: state.autoFirstSeenTag ?? null,
				auto_first_seen_at: state.autoFirstSeenAt ?? null,
				auto_last_attempt_version: state.autoLastAttemptVersion ?? null,
				auto_last_attempt_at: state.autoLastAttemptAt ?? null,
				auto_last_success_version: state.autoLastSuccessVersion ?? null,
				auto_last_success_at: state.autoLastSuccessAt ?? null,
				updated_at_ms: Date.now()
			}));
			imported = true;
			shouldArchive = true;
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
	} catch (err) {
		warnings.push(`Failed migrating legacy update-check state: ${String(err)}`);
	}
	if (imported) changes.push("Migrated update-check state → shared SQLite state");
	if (shouldArchive) archiveLegacyImportSource({
		sourcePath: params.detected.sourcePath,
		label: "update-check state",
		changes,
		warnings
	});
	return {
		changes,
		warnings,
		...notice ? { notices: [notice] } : {}
	};
}
//#endregion
//#region src/infra/state-migrations.web-push-parse.ts
const SUBSCRIPTION_STORE_KEYS = /* @__PURE__ */ new Set(["subscriptionsByEndpointHash"]);
const SUBSCRIPTION_KEYS = /* @__PURE__ */ new Set([
	"subscriptionId",
	"endpoint",
	"keys",
	"createdAtMs",
	"updatedAtMs"
]);
const PUSH_KEYS = /* @__PURE__ */ new Set(["p256dh", "auth"]);
const VAPID_KEYS = /* @__PURE__ */ new Set([
	"publicKey",
	"privateKey",
	"subject"
]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function assertOnlyKeys(value, allowed, label) {
	const unexpected = Object.keys(value).find((key) => !allowed.has(key));
	if (unexpected) throw new Error(`${label} has unexpected field ${unexpected}`);
}
function parseLegacySubscriptions(raw) {
	const parsed = JSON.parse(raw);
	if (!isRecord$1(parsed) || !isRecord$1(parsed.subscriptionsByEndpointHash)) throw new Error("legacy Web Push subscriptions must be an object");
	assertOnlyKeys(parsed, SUBSCRIPTION_STORE_KEYS, "legacy Web Push subscriptions store");
	const subscriptions = /* @__PURE__ */ new Map();
	const subscriptionIds = /* @__PURE__ */ new Set();
	for (const [endpointHash, rawSubscription] of Object.entries(parsed.subscriptionsByEndpointHash)) {
		if (!isRecord$1(rawSubscription) || !isRecord$1(rawSubscription.keys)) throw new Error("legacy Web Push subscription is not an object");
		assertOnlyKeys(rawSubscription, SUBSCRIPTION_KEYS, "legacy Web Push subscription");
		assertOnlyKeys(rawSubscription.keys, PUSH_KEYS, "legacy Web Push subscription keys");
		const { subscriptionId, endpoint, createdAtMs, updatedAtMs } = rawSubscription;
		const p256dh = rawSubscription.keys.p256dh;
		const auth = rawSubscription.keys.auth;
		if (typeof subscriptionId !== "string" || !UUID_RE.test(subscriptionId) || typeof endpoint !== "string" || !isValidWebPushEndpoint(endpoint) || hashWebPushEndpoint(endpoint) !== endpointHash || !isValidWebPushKey(p256dh) || !isValidWebPushKey(auth) || typeof createdAtMs !== "number" || !Number.isSafeInteger(createdAtMs) || createdAtMs < 0 || typeof updatedAtMs !== "number" || !Number.isSafeInteger(updatedAtMs) || updatedAtMs < createdAtMs) throw new Error("legacy Web Push subscription is invalid");
		if (subscriptionIds.has(subscriptionId)) throw new Error("legacy Web Push subscriptions contain a duplicate subscription id");
		subscriptionIds.add(subscriptionId);
		subscriptions.set(endpointHash, {
			subscriptionId,
			endpoint,
			keys: {
				p256dh,
				auth
			},
			createdAtMs,
			updatedAtMs
		});
	}
	return subscriptions;
}
function parseLegacyVapidKeys(raw, env) {
	const parsed = JSON.parse(raw);
	if (!isRecord$1(parsed)) throw new Error("legacy Web Push VAPID keys must be an object");
	assertOnlyKeys(parsed, VAPID_KEYS, "legacy Web Push VAPID keys");
	if (parsed.subject !== void 0 && typeof parsed.subject !== "string") throw new Error("legacy Web Push VAPID keys are invalid");
	const subject = normalizeOptionalString(parsed.subject) ?? normalizeOptionalString(env.OPENCLAW_VAPID_SUBJECT) ?? "https://openclaw.ai";
	if (!isValidWebPushKey(parsed.publicKey) || !isValidWebPushKey(parsed.privateKey) || subject.length > 512) throw new Error("legacy Web Push VAPID keys are invalid");
	return createWebPushVapidKeyPair(parsed.publicKey, parsed.privateKey, subject);
}
//#endregion
//#region src/infra/state-migrations.web-push.ts
const LEGACY_SUBSCRIPTIONS_MAX_BYTES = 4 * 1024 * 1024;
const LEGACY_VAPID_KEYS_MAX_BYTES = 64 * 1024;
const MIGRATION_LOCK_TIMEOUT_MS$1 = 250;
const MIGRATION_LOCK_POLL_INTERVAL_MS$1 = 25;
const DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
function resolveLegacyWebPushPaths(stateDir) {
	return {
		subscriptionsPath: path.join(stateDir, "push", "web-push-subscriptions.json"),
		vapidKeysPath: path.join(stateDir, "push", "vapid-keys.json")
	};
}
function legacyPathMayExist(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
function relativeLegacyPath(stateDir, filePath) {
	const relativePath = path.relative(path.resolve(stateDir), path.resolve(filePath));
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) throw new Error(`legacy Web Push path is outside the state directory: ${filePath}`);
	return relativePath;
}
const sourceOrClaimMayExist$1 = (sourcePath) => legacyPathMayExist(sourcePath) || legacyPathMayExist(`${sourcePath}${DOCTOR_CLAIM_SUFFIX}`);
function detectLegacyWebPush(params) {
	const paths = resolveLegacyWebPushPaths(params.stateDir);
	return {
		...paths,
		hasLegacy: params.doctorOnlyStateMigrations === true && (sourceOrClaimMayExist$1(paths.subscriptionsPath) || sourceOrClaimMayExist$1(paths.vapidKeysPath))
	};
}
async function readLegacySourceSnapshot(stateRoot, stateDir, sourcePath, maxBytes) {
	const opened = await stateRoot.read(relativeLegacyPath(stateDir, sourcePath), {
		hardlinks: "reject",
		maxBytes,
		symlinks: "reject"
	});
	const raw = opened.buffer.toString("utf8");
	return {
		sourcePath,
		dev: opened.stat.dev,
		ino: opened.stat.ino,
		mtimeMs: opened.stat.mtimeMs,
		raw,
		sha256: createHash("sha256").update(raw).digest("hex"),
		size: opened.stat.size
	};
}
function sourceSnapshotsMatch(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mtimeMs === right.mtimeMs && left.sha256 === right.sha256 && left.size === right.size;
}
function contentSnapshotsMatch(left, right) {
	return left.sha256 === right.sha256 && left.size === right.size;
}
function maxBytesForSource(sourcePath, subscriptionsPath) {
	return sourcePath === subscriptionsPath ? LEGACY_SUBSCRIPTIONS_MAX_BYTES : LEGACY_VAPID_KEYS_MAX_BYTES;
}
async function recoverInterruptedClaim(stateRoot, stateDir, sourcePath, maxBytes) {
	const claimPath = `${sourcePath}${DOCTOR_CLAIM_SUFFIX}`;
	const claimRelativePath = relativeLegacyPath(stateDir, claimPath);
	const sourceRelativePath = relativeLegacyPath(stateDir, sourcePath);
	if (!await stateRoot.exists(claimRelativePath)) return;
	const claim = await readLegacySourceSnapshot(stateRoot, stateDir, claimPath, maxBytes);
	if (!await stateRoot.exists(sourceRelativePath)) {
		await stateRoot.move(claimRelativePath, sourceRelativePath);
		return;
	}
	if (!contentSnapshotsMatch(claim, await readLegacySourceSnapshot(stateRoot, stateDir, sourcePath, maxBytes))) throw new Error("interrupted Web Push doctor claim conflicts with its source");
	await stateRoot.remove(claimRelativePath);
}
async function readLegacyState(stateRoot, stateDir, detected, env) {
	await recoverInterruptedClaim(stateRoot, stateDir, detected.subscriptionsPath, LEGACY_SUBSCRIPTIONS_MAX_BYTES);
	await recoverInterruptedClaim(stateRoot, stateDir, detected.vapidKeysPath, LEGACY_VAPID_KEYS_MAX_BYTES);
	const snapshots = [];
	let subscriptions = /* @__PURE__ */ new Map();
	let vapidKeys = null;
	if (await stateRoot.exists(relativeLegacyPath(stateDir, detected.subscriptionsPath))) {
		const snapshot = await readLegacySourceSnapshot(stateRoot, stateDir, detected.subscriptionsPath, LEGACY_SUBSCRIPTIONS_MAX_BYTES);
		subscriptions = parseLegacySubscriptions(snapshot.raw);
		snapshots.push(snapshot);
	}
	if (await stateRoot.exists(relativeLegacyPath(stateDir, detected.vapidKeysPath))) {
		const snapshot = await readLegacySourceSnapshot(stateRoot, stateDir, detected.vapidKeysPath, LEGACY_VAPID_KEYS_MAX_BYTES);
		vapidKeys = parseLegacyVapidKeys(snapshot.raw, env);
		snapshots.push(snapshot);
	}
	return {
		subscriptions,
		vapidKeys,
		snapshots
	};
}
async function assertSourcesUnchanged(stateRoot, stateDir, snapshots, subscriptionsPath) {
	for (const snapshot of snapshots) if (!sourceSnapshotsMatch(await readLegacySourceSnapshot(stateRoot, stateDir, snapshot.sourcePath, maxBytesForSource(snapshot.sourcePath, subscriptionsPath)), snapshot)) throw new Error("legacy Web Push source changed after doctor loaded it");
}
function mergedSubscription(params) {
	const { existing, legacy } = params;
	const createdAtMs = Math.min(existing.createdAtMs, legacy.createdAtMs);
	if (existing.updatedAtMs === legacy.updatedAtMs) {
		const normalizedExisting = {
			...existing,
			createdAtMs
		};
		if (!webPushSubscriptionsEqual(normalizedExisting, {
			...legacy,
			createdAtMs
		})) throw new Error("Web Push subscription diverges at the same timestamp");
		return normalizedExisting;
	}
	return {
		...existing.updatedAtMs > legacy.updatedAtMs ? existing : legacy,
		createdAtMs
	};
}
function findSubscriptionById(db, subscriptionId) {
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("web_push_subscriptions").selectAll().where("subscription_id", "=", subscriptionId));
}
function writeSubscription(db, endpointHash, subscription) {
	const row = webPushSubscriptionToRow({
		endpointHash,
		subscription
	});
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("web_push_subscriptions").values(row).onConflict((conflict) => conflict.column("endpoint_hash").doUpdateSet({
		subscription_id: row.subscription_id,
		endpoint: row.endpoint,
		p256dh: row.p256dh,
		auth: row.auth,
		created_at_ms: row.created_at_ms,
		updated_at_ms: row.updated_at_ms
	})));
}
function migrateIntoDatabase(params) {
	let importedSubscriptions = 0;
	let importedVapidKeys = false;
	runOpenClawStateWriteTransaction(({ db }) => {
		const webPushDb = getNodeSqliteKysely(db);
		const expectedSubscriptions = /* @__PURE__ */ new Map();
		for (const [endpointHash, legacySubscription] of params.legacy.subscriptions) {
			const existingRow = executeSqliteQueryTakeFirstSync(db, webPushDb.selectFrom("web_push_subscriptions").selectAll().where("endpoint_hash", "=", endpointHash));
			if (existingRow && existingRow.endpoint !== legacySubscription.endpoint) throw new Error("Web Push endpoint hash collision during legacy import");
			const existing = existingRow ? webPushSubscriptionFromRow(existingRow) : null;
			const expected = existing ? mergedSubscription({
				existing,
				legacy: legacySubscription
			}) : legacySubscription;
			const conflictingIdRow = findSubscriptionById(db, expected.subscriptionId);
			if (conflictingIdRow && conflictingIdRow.endpoint_hash !== endpointHash) throw new Error("Web Push subscription id conflicts with another endpoint");
			if (!existing || !webPushSubscriptionsEqual(existing, expected)) {
				writeSubscription(db, endpointHash, expected);
				importedSubscriptions += 1;
			}
			expectedSubscriptions.set(endpointHash, expected);
		}
		let expectedVapidKeys = null;
		if (params.legacy.vapidKeys) {
			const existingVapidRow = executeSqliteQueryTakeFirstSync(db, webPushDb.selectFrom("web_push_vapid_keys").selectAll().where("key_id", "=", WEB_PUSH_VAPID_KEY_ID));
			if (existingVapidRow) {
				if (existingVapidRow.public_key !== params.legacy.vapidKeys.publicKey || existingVapidRow.private_key !== params.legacy.vapidKeys.privateKey) throw new Error("legacy Web Push VAPID identity conflicts with SQLite");
				expectedVapidKeys = createWebPushVapidKeyPair(existingVapidRow.public_key, existingVapidRow.private_key, existingVapidRow.subject);
			} else {
				executeSqliteQuerySync(db, webPushDb.insertInto("web_push_vapid_keys").values(webPushVapidKeyPairToRow({
					keyPair: params.legacy.vapidKeys,
					nowMs: params.nowMs
				})));
				expectedVapidKeys = params.legacy.vapidKeys;
				importedVapidKeys = true;
			}
		}
		for (const [endpointHash, expected] of expectedSubscriptions) {
			const row = executeSqliteQueryTakeFirstSync(db, webPushDb.selectFrom("web_push_subscriptions").selectAll().where("endpoint_hash", "=", endpointHash));
			if (!row || !webPushSubscriptionsEqual(webPushSubscriptionFromRow(row), expected)) throw new Error("SQLite verification failed for a Web Push subscription");
		}
		if (expectedVapidKeys) {
			const row = executeSqliteQueryTakeFirstSync(db, webPushDb.selectFrom("web_push_vapid_keys").selectAll().where("key_id", "=", WEB_PUSH_VAPID_KEY_ID));
			if (!row || row.public_key !== expectedVapidKeys.publicKey || row.private_key !== expectedVapidKeys.privateKey || row.subject !== expectedVapidKeys.subject) throw new Error("SQLite verification failed for the Web Push VAPID identity");
		}
	}, { env: {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	} });
	return {
		importedSubscriptions,
		importedVapidKeys
	};
}
async function restoreClaims(params) {
	const errors = [];
	for (const snapshot of params.claimed.toReversed()) {
		const claimPath = `${snapshot.sourcePath}${DOCTOR_CLAIM_SUFFIX}`;
		const claimRelativePath = relativeLegacyPath(params.stateDir, claimPath);
		const sourceRelativePath = relativeLegacyPath(params.stateDir, snapshot.sourcePath);
		try {
			if (!await params.stateRoot.exists(claimRelativePath)) continue;
			if (await params.stateRoot.exists(sourceRelativePath)) {
				errors.push(`source path already exists: ${snapshot.sourcePath}`);
				continue;
			}
			await params.stateRoot.move(claimRelativePath, sourceRelativePath);
		} catch (error) {
			errors.push(String(error));
		}
	}
	return errors;
}
async function claimLegacySources(params) {
	params.beforeClaim?.();
	const claimed = [];
	try {
		for (const snapshot of params.snapshots) {
			const claimPath = `${snapshot.sourcePath}${DOCTOR_CLAIM_SUFFIX}`;
			await params.stateRoot.move(relativeLegacyPath(params.stateDir, snapshot.sourcePath), relativeLegacyPath(params.stateDir, claimPath));
			claimed.push(snapshot);
			if (!sourceSnapshotsMatch(await readLegacySourceSnapshot(params.stateRoot, params.stateDir, claimPath, maxBytesForSource(snapshot.sourcePath, params.subscriptionsPath)), snapshot)) throw new Error("legacy Web Push source changed before doctor could claim it");
		}
	} catch (error) {
		const restoreErrors = await restoreClaims({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			claimed
		});
		throw new Error(`${String(error)}${restoreErrors.length > 0 ? `; restore failures: ${restoreErrors.join("; ")}` : ""}`, { cause: error });
	}
	return claimed;
}
async function removeClaimedSources(params) {
	for (const snapshot of params.claimed) if (await params.stateRoot.exists(relativeLegacyPath(params.stateDir, snapshot.sourcePath))) throw new Error(`legacy Web Push source reappeared during import: ${snapshot.sourcePath}`);
	for (const snapshot of params.claimed) {
		const claimPath = `${snapshot.sourcePath}${DOCTOR_CLAIM_SUFFIX}`;
		if (params.removeSource) await params.removeSource(claimPath);
		else await params.stateRoot.remove(relativeLegacyPath(params.stateDir, claimPath));
	}
}
async function migrateLegacyWebPushWithExclusiveStateOwnership(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	if (!params.detected.hasLegacy) return {
		changes,
		warnings
	};
	let legacy;
	try {
		legacy = await readLegacyState(params.stateRoot, params.stateDir, params.detected, params.env);
	} catch (error) {
		warnings.push(`Failed reading legacy Web Push state: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	let claimed;
	try {
		params.beforeVerify?.();
		await assertSourcesUnchanged(params.stateRoot, params.stateDir, legacy.snapshots, params.detected.subscriptionsPath);
		claimed = await claimLegacySources({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			snapshots: legacy.snapshots,
			subscriptionsPath: params.detected.subscriptionsPath,
			beforeClaim: params.beforeClaim
		});
	} catch (error) {
		warnings.push(`Failed migrating legacy Web Push state: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	let result;
	try {
		result = migrateIntoDatabase({
			stateDir: params.stateDir,
			legacy,
			nowMs: Date.now()
		});
	} catch (error) {
		const restoreErrors = await restoreClaims({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			claimed
		});
		warnings.push(`Failed migrating legacy Web Push state: ${String(error)}${restoreErrors.length > 0 ? `; restore failures: ${restoreErrors.join("; ")}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	try {
		await removeClaimedSources({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			claimed,
			removeSource: params.removeSource
		});
	} catch (error) {
		warnings.push(`Web Push state is in SQLite, but legacy cleanup failed: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	changes.push(`Migrated ${result.importedSubscriptions} Web Push subscription${result.importedSubscriptions === 1 ? "" : "s"} to SQLite.`);
	if (result.importedVapidKeys) changes.push("Migrated the Web Push VAPID identity to SQLite.");
	notices.push("Removed retired Web Push JSON state after verified SQLite import.");
	return {
		changes,
		warnings,
		notices
	};
}
async function migrateLegacyWebPush(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	const env = {
		...params.env ?? process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env,
			pollIntervalMs: MIGRATION_LOCK_POLL_INTERVAL_MS$1,
			role: "sqlite-maintenance",
			timeoutMs: MIGRATION_LOCK_TIMEOUT_MS$1
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed migrating legacy Web Push state: ${error instanceof GatewayLockError ? "the Gateway or another SQLite maintenance command owns this state directory" : String(error)}. Stop the Gateway and run \`openclaw doctor --fix\` again.`]
		};
	}
	if (!lock) return {
		changes: [],
		warnings: ["Failed migrating legacy Web Push state: exclusive state ownership unavailable."]
	};
	let result = {
		changes: [],
		warnings: []
	};
	let releaseError;
	try {
		try {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				maxBytes: LEGACY_SUBSCRIPTIONS_MAX_BYTES,
				symlinks: "reject"
			});
			result = await migrateLegacyWebPushWithExclusiveStateOwnership({
				...params,
				env,
				stateRoot
			});
		} catch (error) {
			result.warnings.push(`Failed reading legacy Web Push state: ${String(error)}`);
		}
	} finally {
		try {
			await lock.release();
		} catch (error) {
			releaseError = error;
		}
	}
	if (releaseError) result.warnings.push(`Web Push migration lock release failed: ${formatErrorMessage(releaseError)}`);
	return result;
}
//#endregion
//#region src/infra/state-migrations.workspace-setup-receipts.ts
function resolveWorkspaceMigrationSourceKey(source) {
	return `workspace-${source.kind}:${createHash("sha256").update(source.workspaceKey).update("\0").update(path.resolve(source.sourcePath)).digest("hex")}`;
}
function readReceipt(source, env) {
	const key = resolveWorkspaceMigrationSourceKey(source);
	const { db } = openOpenClawStateDatabase({ env });
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("migration_sources").select(["source_sha256", "removed_source"]).where("source_key", "=", key));
	return row ? {
		sourceKey: key,
		sha256: row.source_sha256,
		removedSource: row.removed_source === 1
	} : null;
}
function markSourceRemoved(sourceKey, env) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("migration_sources").set({ removed_source: 1 }).where("source_key", "=", sourceKey));
	}, { env });
}
//#endregion
//#region src/infra/state-migrations.workspace-setup-store.ts
const MIGRATION_KIND = WORKSPACE_LEGACY_STATE_MIGRATION_KIND;
function parseIsoTimestamp(value, field) {
	if (value === void 0) return;
	if (typeof value !== "string" || value.length === 0) throw new Error(`legacy workspace setup ${field} is invalid`);
	const parsed = new Date(value);
	if (!Number.isFinite(parsed.getTime()) || parsed.toISOString() !== value) throw new Error(`legacy workspace setup ${field} is invalid`);
	return value;
}
function parseSetup(raw) {
	let value;
	try {
		value = JSON.parse(raw);
	} catch {
		throw new Error("legacy workspace setup contains invalid JSON");
	}
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("legacy workspace setup is not an object");
	const record = value;
	const allowed = /* @__PURE__ */ new Set([
		"version",
		"bootstrapSeededAt",
		"setupCompletedAt",
		"onboardingCompletedAt"
	]);
	if (Object.keys(record).some((key) => !allowed.has(key))) throw new Error("legacy workspace setup has an unexpected field");
	if (record.version !== void 0 && record.version !== 1) throw new Error("legacy workspace setup has an unsupported version");
	const bootstrapSeededAt = parseIsoTimestamp(record.bootstrapSeededAt, "bootstrap timestamp");
	const setupCompletedAt = parseIsoTimestamp(record.setupCompletedAt, "completion timestamp");
	const onboardingCompletedAt = parseIsoTimestamp(record.onboardingCompletedAt, "legacy completion timestamp");
	if (setupCompletedAt && onboardingCompletedAt && setupCompletedAt !== onboardingCompletedAt) throw new Error("legacy workspace setup has conflicting completion timestamps");
	const parsed = {
		...bootstrapSeededAt ? { bootstrapSeededAt } : {},
		...setupCompletedAt ?? onboardingCompletedAt ? { setupCompletedAt: setupCompletedAt ?? onboardingCompletedAt } : {}
	};
	return {
		kind: "setup",
		value: parsed,
		recordCount: Number(Boolean(parsed.bootstrapSeededAt)) + Number(Boolean(parsed.setupCompletedAt))
	};
}
function parseAttestation(snapshot) {
	const lines = snapshot.raw.split(/\r?\n/);
	if (lines.at(-1) === "") lines.pop();
	if (lines[0] !== "openclaw-workspace-attestation:v1" || lines.length < 2) throw new Error("legacy workspace attestation has an invalid header");
	parseIsoTimestamp(lines[1], "attestation timestamp");
	const generatedHashes = /* @__PURE__ */ new Map();
	for (const line of lines.slice(2)) {
		const match = /^generated:([^:]+):([a-f0-9]{64})$/.exec(line);
		if (!match?.[1] || !match[2] || !WORKSPACE_ATTESTED_BOOTSTRAP_FILENAMES.has(match[1])) throw new Error("legacy workspace attestation has an invalid generated hash");
		if (generatedHashes.has(match[1])) throw new Error("legacy workspace attestation has a duplicate generated hash");
		generatedHashes.set(match[1], match[2]);
	}
	const attestedAtMs = Math.trunc(snapshot.mtimeMs);
	if (!Number.isSafeInteger(attestedAtMs) || attestedAtMs < 0) throw new Error("legacy workspace attestation has an invalid modification time");
	return {
		kind: "attestation",
		value: {
			attestedAtMs,
			generatedHashes
		},
		recordCount: 1 + generatedHashes.size
	};
}
function parseSource(source, snapshot) {
	return source.kind === "setup" ? parseSetup(snapshot.raw) : parseAttestation(snapshot);
}
function mapsEqual(left, right) {
	if (left.size !== right.size) return false;
	for (const [key, value] of left) if (right.get(key) !== value) return false;
	return true;
}
function canonicalFingerprint(value) {
	return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
function setupFingerprint(params) {
	return canonicalFingerprint({
		kind: "setup",
		workspacePath: params.workspacePath,
		version: 1,
		bootstrapSeededAt: params.bootstrapSeededAt,
		setupCompletedAt: params.setupCompletedAt
	});
}
function attestationFingerprint(params) {
	return canonicalFingerprint({
		kind: "attestation",
		attestedAtMs: params.attestedAtMs,
		generatedHashes: [...params.generatedHashes.entries()].toSorted(([left], [right]) => left.localeCompare(right))
	});
}
function findMigrationAuthority(params) {
	const rows = executeSqliteQuerySync(params.db, params.kysely.selectFrom("migration_sources").select("report_json").where("migration_kind", "=", MIGRATION_KIND).where("target_table", "=", params.source.kind === "setup" ? "workspace_setup_state" : "workspace_attestations")).rows;
	let bestPriority = null;
	for (const row of rows) {
		if (!row.report_json) continue;
		try {
			const report = JSON.parse(row.report_json);
			if (report.workspaceKey !== params.source.workspaceKey || report.sourceKind !== params.source.kind || report.canonicalFingerprint !== params.fingerprint || report.authoritative !== true || typeof report.sourcePriority !== "number" || !Number.isSafeInteger(report.sourcePriority) || report.sourcePriority < 0) continue;
			bestPriority = bestPriority === null ? report.sourcePriority : Math.min(bestPriority, report.sourcePriority);
		} catch {}
	}
	return bestPriority === null ? null : { priority: bestPriority };
}
function canonicalCoversParsedSource(params) {
	const { db } = openOpenClawStateDatabase({ env: params.env });
	return runSqliteDeferredTransactionSync(db, () => {
		const kysely = getNodeSqliteKysely(db);
		if (params.source.kind === "setup" && params.parsed.kind === "setup") {
			if (!params.source.workspaceDir) return false;
			const row = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("workspace_setup_state").selectAll().where("workspace_key", "=", params.source.workspaceKey));
			if (!row || row.workspace_path !== params.source.workspaceDir || row.version !== 1) return false;
			const fingerprint = setupFingerprint({
				workspacePath: row.workspace_path,
				bootstrapSeededAt: row.bootstrap_seeded_at,
				setupCompletedAt: row.setup_completed_at
			});
			const sourceBootstrapSeededAt = params.parsed.value.bootstrapSeededAt ?? null;
			const sourceSetupCompletedAt = params.parsed.value.setupCompletedAt ?? null;
			const coversSource = (sourceBootstrapSeededAt === null || row.bootstrap_seeded_at === sourceBootstrapSeededAt) && (sourceSetupCompletedAt === null || row.setup_completed_at === sourceSetupCompletedAt);
			const authority = findMigrationAuthority({
				db,
				kysely,
				source: params.source,
				fingerprint
			});
			return coversSource || Boolean(authority && authority.priority <= params.source.priority);
		}
		if (params.source.kind !== "attestation" || params.parsed.kind !== "attestation") return false;
		const row = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("workspace_attestations").select("attested_at_ms").where("workspace_key", "=", params.source.workspaceKey));
		if (!row) return false;
		if (row.attested_at_ms > params.parsed.value.attestedAtMs) return true;
		if (row.attested_at_ms < params.parsed.value.attestedAtMs) return false;
		const hashes = new Map(executeSqliteQuerySync(db, kysely.selectFrom("workspace_generated_bootstrap_hashes").select(["filename", "sha256"]).where("workspace_key", "=", params.source.workspaceKey)).rows.map((hashRow) => [hashRow.filename, hashRow.sha256]));
		if (mapsEqual(hashes, params.parsed.value.generatedHashes)) return true;
		const fingerprint = attestationFingerprint({
			attestedAtMs: row.attested_at_ms,
			generatedHashes: hashes
		});
		const authority = findMigrationAuthority({
			db,
			kysely,
			source: params.source,
			fingerprint
		});
		return Boolean(authority && authority.priority <= params.source.priority);
	});
}
function importAndRecordReceipt(params) {
	const key = resolveWorkspaceMigrationSourceKey(params.source);
	const runId = `${key}:${params.snapshot.sha256.slice(0, 16)}`;
	const now = Date.now();
	return runOpenClawStateWriteTransaction((database) => {
		const { db } = database;
		const kysely = getNodeSqliteKysely(db);
		if (executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("migration_sources").select("source_key").where("source_key", "=", key))) throw new Error("workspace migration receipt appeared concurrently; retry Doctor");
		let imported = false;
		let resolution;
		let verifiedFingerprint;
		if (params.parsed.kind === "setup") {
			if (!params.source.workspaceDir) throw new Error("legacy workspace setup has no workspace path");
			const incomingFingerprint = setupFingerprint({
				workspacePath: params.source.workspaceDir,
				bootstrapSeededAt: params.parsed.value.bootstrapSeededAt ?? null,
				setupCompletedAt: params.parsed.value.setupCompletedAt ?? null
			});
			const existing = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("workspace_setup_state").selectAll().where("workspace_key", "=", params.source.workspaceKey));
			if (existing) {
				if (existing.workspace_path !== params.source.workspaceDir || existing.version !== 1) throw new Error("legacy workspace setup conflicts with canonical SQLite state");
				const existingFingerprint = setupFingerprint({
					workspacePath: existing.workspace_path,
					bootstrapSeededAt: existing.bootstrap_seeded_at,
					setupCompletedAt: existing.setup_completed_at
				});
				const sourceBootstrapSeededAt = params.parsed.value.bootstrapSeededAt ?? null;
				const sourceSetupCompletedAt = params.parsed.value.setupCompletedAt ?? null;
				const coversSource = (sourceBootstrapSeededAt === null || existing.bootstrap_seeded_at === sourceBootstrapSeededAt) && (sourceSetupCompletedAt === null || existing.setup_completed_at === sourceSetupCompletedAt);
				const authority = findMigrationAuthority({
					db,
					kysely,
					source: params.source,
					fingerprint: existingFingerprint
				});
				if (authority && params.source.priority < authority.priority) {
					executeSqliteQuerySync(db, kysely.updateTable("workspace_setup_state").set({
						bootstrap_seeded_at: sourceBootstrapSeededAt,
						setup_completed_at: sourceSetupCompletedAt,
						updated_at: now
					}).where("workspace_key", "=", params.source.workspaceKey));
					imported = true;
					resolution = "replaced";
					verifiedFingerprint = incomingFingerprint;
				} else if (coversSource) {
					resolution = "verified";
					verifiedFingerprint = existingFingerprint;
				} else if (!authority) {
					const mergedBootstrapSeededAt = existing.bootstrap_seeded_at ?? sourceBootstrapSeededAt;
					const mergedSetupCompletedAt = existing.setup_completed_at ?? sourceSetupCompletedAt;
					if (sourceBootstrapSeededAt !== null && existing.bootstrap_seeded_at !== null && sourceBootstrapSeededAt !== existing.bootstrap_seeded_at || sourceSetupCompletedAt !== null && existing.setup_completed_at !== null && sourceSetupCompletedAt !== existing.setup_completed_at) throw new Error("legacy workspace setup conflicts with canonical SQLite state");
					executeSqliteQuerySync(db, kysely.updateTable("workspace_setup_state").set({
						bootstrap_seeded_at: mergedBootstrapSeededAt,
						setup_completed_at: mergedSetupCompletedAt,
						updated_at: now
					}).where("workspace_key", "=", params.source.workspaceKey));
					imported = true;
					resolution = "merged";
					verifiedFingerprint = setupFingerprint({
						workspacePath: existing.workspace_path,
						bootstrapSeededAt: mergedBootstrapSeededAt,
						setupCompletedAt: mergedSetupCompletedAt
					});
				} else {
					resolution = "superseded";
					verifiedFingerprint = existingFingerprint;
				}
			} else {
				executeSqliteQuerySync(db, kysely.insertInto("workspace_setup_state").values({
					workspace_key: params.source.workspaceKey,
					workspace_path: params.source.workspaceDir,
					version: 1,
					bootstrap_seeded_at: params.parsed.value.bootstrapSeededAt ?? null,
					setup_completed_at: params.parsed.value.setupCompletedAt ?? null,
					updated_at: now
				}));
				imported = true;
				resolution = "inserted";
				verifiedFingerprint = incomingFingerprint;
			}
			const verified = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("workspace_setup_state").selectAll().where("workspace_key", "=", params.source.workspaceKey));
			const actualFingerprint = verified ? setupFingerprint({
				workspacePath: verified.workspace_path,
				bootstrapSeededAt: verified.bootstrap_seeded_at,
				setupCompletedAt: verified.setup_completed_at
			}) : null;
			if (!verified || actualFingerprint !== verifiedFingerprint) throw new Error("SQLite verification failed for workspace setup state");
		} else {
			const parsedAttestation = params.parsed.value;
			const incomingFingerprint = attestationFingerprint({
				attestedAtMs: parsedAttestation.attestedAtMs,
				generatedHashes: parsedAttestation.generatedHashes
			});
			const existing = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("workspace_attestations").selectAll().where("workspace_key", "=", params.source.workspaceKey));
			if (existing) {
				const rows = executeSqliteQuerySync(db, kysely.selectFrom("workspace_generated_bootstrap_hashes").select(["filename", "sha256"]).where("workspace_key", "=", params.source.workspaceKey)).rows;
				const existingHashes = new Map(rows.map((row) => [row.filename, row.sha256]));
				const existingFingerprint = attestationFingerprint({
					attestedAtMs: existing.attested_at_ms,
					generatedHashes: existingHashes
				});
				const replaceExistingAttestation = () => {
					executeSqliteQuerySync(db, kysely.updateTable("workspace_attestations").set({
						attested_at_ms: parsedAttestation.attestedAtMs,
						updated_at_ms: now
					}).where("workspace_key", "=", params.source.workspaceKey));
					executeSqliteQuerySync(db, kysely.deleteFrom("workspace_generated_bootstrap_hashes").where("workspace_key", "=", params.source.workspaceKey));
					const replacementHashes = [...parsedAttestation.generatedHashes.entries()].toSorted(([left], [right]) => left.localeCompare(right));
					if (replacementHashes.length > 0) executeSqliteQuerySync(db, kysely.insertInto("workspace_generated_bootstrap_hashes").values(replacementHashes.map(([filename, sha256]) => ({
						workspace_key: params.source.workspaceKey,
						filename,
						sha256
					}))));
				};
				if (existing.attested_at_ms === parsedAttestation.attestedAtMs && mapsEqual(existingHashes, parsedAttestation.generatedHashes)) {
					resolution = "verified";
					verifiedFingerprint = existingFingerprint;
				} else if (existing.attested_at_ms > parsedAttestation.attestedAtMs) {
					resolution = "superseded";
					verifiedFingerprint = existingFingerprint;
				} else if (existing.attested_at_ms === parsedAttestation.attestedAtMs) {
					const authority = findMigrationAuthority({
						db,
						kysely,
						source: params.source,
						fingerprint: existingFingerprint
					});
					if (!authority) throw new Error("legacy workspace attestation conflicts with canonical SQLite state");
					if (params.source.priority < authority.priority) {
						replaceExistingAttestation();
						imported = true;
						resolution = "replaced";
						verifiedFingerprint = incomingFingerprint;
					} else {
						resolution = "superseded";
						verifiedFingerprint = existingFingerprint;
					}
				} else {
					replaceExistingAttestation();
					imported = true;
					resolution = "replaced";
					verifiedFingerprint = incomingFingerprint;
				}
			} else {
				executeSqliteQuerySync(db, kysely.insertInto("workspace_attestations").values({
					workspace_key: params.source.workspaceKey,
					attested_at_ms: parsedAttestation.attestedAtMs,
					updated_at_ms: now
				}));
				const hashes = [...parsedAttestation.generatedHashes.entries()].toSorted(([a], [b]) => a.localeCompare(b));
				if (hashes.length > 0) executeSqliteQuerySync(db, kysely.insertInto("workspace_generated_bootstrap_hashes").values(hashes.map(([filename, sha256]) => ({
					workspace_key: params.source.workspaceKey,
					filename,
					sha256
				}))));
				imported = true;
				resolution = "inserted";
				verifiedFingerprint = incomingFingerprint;
			}
			const verified = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("workspace_attestations").select("attested_at_ms").where("workspace_key", "=", params.source.workspaceKey));
			const verifiedHashes = new Map(executeSqliteQuerySync(db, kysely.selectFrom("workspace_generated_bootstrap_hashes").select(["filename", "sha256"]).where("workspace_key", "=", params.source.workspaceKey)).rows.map((row) => [row.filename, row.sha256]));
			const actualFingerprint = verified ? attestationFingerprint({
				attestedAtMs: verified.attested_at_ms,
				generatedHashes: verifiedHashes
			}) : null;
			if (!verified || actualFingerprint !== verifiedFingerprint) throw new Error("SQLite verification failed for workspace attestation state");
		}
		if (params.source.workspaceDir) registerWorkspaceStateAliasesInTransaction({
			database,
			workspaceDirs: [params.source.workspaceDir, params.source.workspaceAliasPath ?? params.source.workspaceDir],
			identity: {
				workspaceKey: params.source.workspaceKey,
				workspacePath: params.source.workspaceDir
			},
			updatedAtMs: now
		});
		const targetTable = params.parsed.kind === "setup" ? "workspace_setup_state" : "workspace_attestations";
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND,
			sourceKind: params.parsed.kind,
			target: targetTable,
			workspaceKey: params.source.workspaceKey,
			sourceSha256: params.snapshot.sha256,
			sourceRecordCount: params.parsed.recordCount,
			sourcePriority: params.source.priority,
			canonicalFingerprint: verifiedFingerprint,
			authoritative: resolution === "inserted" || resolution === "replaced",
			resolution,
			imported
		});
		executeSqliteQuerySync(db, kysely.insertInto("migration_runs").values({
			id: runId,
			started_at: now,
			finished_at: now,
			status: "completed",
			report_json: reportJson
		}));
		executeSqliteQuerySync(db, kysely.insertInto("migration_sources").values({
			source_key: key,
			migration_kind: MIGRATION_KIND,
			source_path: params.source.sourcePath,
			target_table: targetTable,
			source_sha256: params.snapshot.sha256,
			source_size_bytes: params.snapshot.size,
			source_record_count: params.parsed.recordCount,
			last_run_id: runId,
			status: "completed",
			imported_at: now,
			removed_source: 0,
			report_json: reportJson
		}));
		return {
			sourceKey: key,
			imported
		};
	}, { env: params.env });
}
//#endregion
//#region src/infra/state-migrations.workspace-setup.ts
const SETUP_MAX_BYTES = 64 * 1024;
const CLAIM_SUFFIX = WORKSPACE_DOCTOR_CLAIM_SUFFIX;
const MIGRATION_LOCK_TIMEOUT_MS = 250;
const MIGRATION_LOCK_POLL_INTERVAL_MS = 25;
const utf8Decoder = new TextDecoder$1("utf-8", { fatal: true });
function pathMayExist(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
function sourceOrClaimMayExist(sourcePath) {
	return pathMayExist(sourcePath) || pathMayExist(`${sourcePath}${CLAIM_SUFFIX}`);
}
async function readBoundedRegularFile(params) {
	const opened = await params.sourceRoot.open(params.relativePath, {
		hardlinks: "reject",
		symlinks: "reject"
	});
	try {
		const before = opened.stat;
		if (!before.isFile() || before.nlink !== 1 || !Number.isSafeInteger(before.size) || before.size < 0 || before.size > params.maxBytes) throw new Error("legacy workspace source is not a safe regular file");
		const buffer = Buffer.alloc(before.size);
		let offset = 0;
		while (offset < buffer.length) {
			const { bytesRead } = await opened.handle.read(buffer, offset, buffer.length - offset, offset);
			if (bytesRead === 0) throw new Error("legacy workspace source ended unexpectedly");
			offset += bytesRead;
		}
		const after = await opened.handle.stat();
		if (!after.isFile() || after.nlink !== 1 || after.dev !== before.dev || after.ino !== before.ino || after.size !== before.size || after.mtimeMs !== before.mtimeMs || after.ctimeMs !== before.ctimeMs || offset !== after.size) throw new Error("legacy workspace source changed while reading");
		let raw;
		try {
			raw = utf8Decoder.decode(buffer);
		} catch {
			throw new Error("legacy workspace source is not valid UTF-8");
		}
		return {
			sourcePath: params.sourcePath,
			dev: after.dev,
			ino: after.ino,
			mtimeMs: after.mtimeMs,
			sha256: createHash("sha256").update(buffer).digest("hex"),
			size: after.size,
			raw
		};
	} finally {
		await opened[Symbol.asyncDispose]();
	}
}
function createLegacySource(params) {
	const rootDir = path.resolve(params.rootDir);
	const sourcePath = path.resolve(params.sourcePath);
	const relativePath = path.relative(rootDir, sourcePath);
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) throw new Error("legacy workspace source is outside its migration root");
	return {
		...params,
		rootDir,
		relativePath,
		sourcePath
	};
}
function snapshotsMatch(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mtimeMs === right.mtimeMs && left.sha256 === right.sha256 && left.size === right.size;
}
function siblingAttestationNeedsDoctor(filePath) {
	try {
		const before = fs.lstatSync(filePath);
		if (!before.isFile()) return false;
		const noFollow = typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
		let fd;
		try {
			fd = fs.openSync(filePath, fs.constants.O_RDONLY | noFollow);
		} catch {
			return true;
		}
		try {
			const opened = fs.fstatSync(fd);
			if (!opened.isFile() || opened.dev !== before.dev || opened.ino !== before.ino) return true;
			const expected = Buffer.from(`${LEGACY_WORKSPACE_ATTESTATION_HEADER}\n`, "utf8");
			const bytes = Buffer.alloc(expected.length);
			return fs.readSync(fd, bytes, 0, bytes.length, 0) === expected.length && bytes.equals(expected);
		} catch {
			return true;
		} finally {
			fs.closeSync(fd);
		}
	} catch {
		return false;
	}
}
function listOrphanAttestationSources(params) {
	const sources = [];
	const stateDirs = [.../* @__PURE__ */ new Set([params.stateDir, ...resolveLegacyStateDirs(params.homedir)])];
	for (const [priority, stateDir] of stateDirs.entries()) {
		const attestationDir = path.join(stateDir, LEGACY_WORKSPACE_ATTESTATION_DIRNAME);
		let entries;
		try {
			entries = fs.readdirSync(attestationDir, { withFileTypes: true });
		} catch (error) {
			if (error.code === "ENOENT") continue;
			sources.push({ ...createLegacySource({
				kind: "attestation",
				rootDir: stateDir,
				sourcePath: attestationDir,
				workspaceKey: "unreadable-attestation-directory",
				priority
			}) });
			continue;
		}
		for (const entry of entries) {
			const match = /^([a-f0-9]{64})\.attested(?:\.doctor-importing)?$/.exec(entry.name);
			if (!match?.[1]) continue;
			const sourceName = entry.name.endsWith(CLAIM_SUFFIX) ? entry.name.slice(0, -CLAIM_SUFFIX.length) : entry.name;
			sources.push(createLegacySource({
				kind: "attestation",
				rootDir: stateDir,
				sourcePath: path.join(attestationDir, sourceName),
				workspaceKey: match[1],
				priority
			}));
		}
	}
	return sources;
}
/** Detect retired workspace files only when an explicit Doctor flow opts in. */
function detectLegacyWorkspaceState(params) {
	if (params.doctorOnlyStateMigrations !== true) return {
		sources: [],
		hasLegacy: false
	};
	const env = {
		...params.env ?? process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const homedir = params.homedir ?? os.homedir;
	const byPath = /* @__PURE__ */ new Map();
	const add = (source) => {
		const key = `${source.kind}:${path.resolve(source.sourcePath)}`;
		const existing = byPath.get(key);
		const sourceIsConfigured = source.workspaceDir !== void 0;
		const existingIsConfigured = existing?.workspaceDir !== void 0;
		if (!existing || sourceIsConfigured && !existingIsConfigured || sourceIsConfigured === existingIsConfigured && source.priority < existing.priority) byPath.set(key, source);
	};
	for (const workspaceDir of listAgentWorkspaceDirs(params.cfg)) {
		const identity = resolveWorkspaceStateIdentity(workspaceDir);
		const paths = resolveLegacyWorkspaceSourcePaths(workspaceDir, {
			env,
			homedir
		});
		for (const [priority, sourcePath] of paths.setupStatePaths.entries()) if (sourceOrClaimMayExist(sourcePath)) add(createLegacySource({
			kind: "setup",
			rootDir: sourcePath.endsWith("openclaw-workspace-state.json") ? path.dirname(sourcePath) : path.dirname(path.dirname(sourcePath)),
			sourcePath,
			workspaceKey: identity.workspaceKey,
			workspaceDir: identity.workspacePath,
			workspaceAliasPath: paths.workspacePath,
			priority
		}));
		for (const [priority, sourcePath] of paths.stateDirAttestationPaths.entries()) if (sourceOrClaimMayExist(sourcePath)) add(createLegacySource({
			kind: "attestation",
			rootDir: path.dirname(path.dirname(sourcePath)),
			sourcePath,
			workspaceKey: identity.workspaceKey,
			workspaceDir: identity.workspacePath,
			workspaceAliasPath: paths.workspacePath,
			priority
		}));
		for (const [index, sourcePath] of paths.siblingAttestationPaths.entries()) {
			if (!pathMayExist(`${sourcePath}${CLAIM_SUFFIX}`) && !siblingAttestationNeedsDoctor(sourcePath)) continue;
			add(createLegacySource({
				kind: "attestation",
				rootDir: path.dirname(sourcePath),
				sourcePath,
				workspaceKey: identity.workspaceKey,
				workspaceDir: identity.workspacePath,
				workspaceAliasPath: paths.workspacePath,
				priority: paths.stateDirAttestationPaths.length + index
			}));
		}
	}
	for (const source of listOrphanAttestationSources({
		stateDir: params.stateDir,
		homedir
	})) add(source);
	const sources = [...byPath.values()].toSorted((left, right) => left.priority - right.priority || left.workspaceKey.localeCompare(right.workspaceKey) || left.sourcePath.localeCompare(right.sourcePath));
	return {
		sources,
		hasLegacy: sources.length > 0
	};
}
function assertConfiguredWorkspaceIdentity(source) {
	if (!source.workspaceAliasPath) return;
	if (!source.workspaceDir) throw new Error("configured legacy workspace source has no canonical path");
	const current = resolveWorkspaceStateIdentity(source.workspaceAliasPath);
	if (current.workspaceKey !== source.workspaceKey || current.workspacePath !== source.workspaceDir) throw new Error("configured workspace identity changed during Doctor migration");
}
async function restoreClaim(params) {
	const claimRelativePath = `${params.source.relativePath}${CLAIM_SUFFIX}`;
	try {
		if (!await params.sourceRoot.exists(claimRelativePath)) return null;
		if (await params.sourceRoot.exists(params.source.relativePath)) return `source path already exists: ${params.source.sourcePath}`;
		await params.sourceRoot.move(claimRelativePath, params.source.relativePath);
		return null;
	} catch (error) {
		return formatErrorMessage(error);
	}
}
async function cleanupReceiptSource(params) {
	try {
		assertConfiguredWorkspaceIdentity(params.source);
		const candidates = [{
			relativePath: params.source.relativePath,
			sourcePath: params.source.sourcePath
		}, {
			relativePath: `${params.source.relativePath}${CLAIM_SUFFIX}`,
			sourcePath: `${params.source.sourcePath}${CLAIM_SUFFIX}`
		}];
		const existing = [];
		for (const candidate of candidates) if (await params.sourceRoot.exists(candidate.relativePath)) existing.push(candidate);
		if (existing.length === 0) {
			if (!params.receipt.removedSource) markSourceRemoved(params.receipt.sourceKey, params.env);
			return {
				changes: [],
				warnings: []
			};
		}
		if (existing.length > 1) return {
			changes: [],
			warnings: ["Workspace state is in SQLite, but source and interrupted claim both exist."]
		};
		let active = existing[0];
		let snapshot = await readBoundedRegularFile({
			sourceRoot: params.sourceRoot,
			relativePath: active.relativePath,
			sourcePath: active.sourcePath,
			maxBytes: params.source.kind === "setup" ? SETUP_MAX_BYTES : LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES
		});
		let claimedByThisRun = false;
		if (active.relativePath === params.source.relativePath) {
			const claim = candidates[1];
			await params.sourceRoot.move(active.relativePath, claim.relativePath);
			const claimed = await readBoundedRegularFile({
				sourceRoot: params.sourceRoot,
				relativePath: claim.relativePath,
				sourcePath: claim.sourcePath,
				maxBytes: params.source.kind === "setup" ? SETUP_MAX_BYTES : LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES
			});
			if (!snapshotsMatch(snapshot, claimed)) {
				await restoreClaim({
					sourceRoot: params.sourceRoot,
					source: params.source
				});
				throw new Error("legacy workspace source changed before Doctor could claim it");
			}
			active = claim;
			snapshot = claimed;
			claimedByThisRun = true;
		}
		const parsed = parseSource(params.source, snapshot);
		if (!params.receipt.sha256 || snapshot.sha256 !== params.receipt.sha256 || !canonicalCoversParsedSource({
			source: params.source,
			parsed,
			env: params.env
		})) {
			if (claimedByThisRun) await restoreClaim({
				sourceRoot: params.sourceRoot,
				source: params.source
			});
			return {
				changes: [],
				warnings: ["Workspace state is in SQLite, but the retired source now conflicts."]
			};
		}
		const unchanged = await readBoundedRegularFile({
			sourceRoot: params.sourceRoot,
			relativePath: active.relativePath,
			sourcePath: active.sourcePath,
			maxBytes: params.source.kind === "setup" ? SETUP_MAX_BYTES : LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES
		});
		if (!snapshotsMatch(snapshot, unchanged)) {
			if (claimedByThisRun) await restoreClaim({
				sourceRoot: params.sourceRoot,
				source: params.source
			});
			throw new Error("legacy workspace claim changed before cleanup");
		}
		assertConfiguredWorkspaceIdentity(params.source);
		await params.sourceRoot.remove(active.relativePath);
		markSourceRemoved(params.receipt.sourceKey, params.env);
		return {
			changes: [],
			warnings: [],
			notices: ["Discarded retired workspace state already covered by its SQLite receipt."]
		};
	} catch (error) {
		return {
			changes: [],
			warnings: [`Workspace state is in SQLite, but legacy cleanup failed: ${formatErrorMessage(error)}`]
		};
	}
}
async function migrateOneSource(params) {
	let sourceRoot;
	try {
		assertConfiguredWorkspaceIdentity(params.source);
		sourceRoot = await root(params.source.rootDir, {
			hardlinks: "reject",
			symlinks: "reject"
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed reading legacy workspace state: ${formatErrorMessage(error)}`]
		};
	}
	const receipt = readReceipt(params.source, params.env);
	if (receipt) return cleanupReceiptSource({
		sourceRoot,
		source: params.source,
		receipt,
		env: params.env
	});
	const sourcePath = params.source.sourcePath;
	const claimPath = `${sourcePath}${CLAIM_SUFFIX}`;
	const claimRelativePath = `${params.source.relativePath}${CLAIM_SUFFIX}`;
	let hasSource;
	let hasClaim;
	try {
		hasSource = await sourceRoot.exists(params.source.relativePath);
		hasClaim = await sourceRoot.exists(claimRelativePath);
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed reading legacy workspace state: ${formatErrorMessage(error)}`]
		};
	}
	if (hasSource && hasClaim) return {
		changes: [],
		warnings: ["Failed migrating legacy workspace state: source and interrupted claim both exist."]
	};
	const activePath = hasSource ? sourcePath : hasClaim ? claimPath : null;
	const activeRelativePath = hasSource ? params.source.relativePath : hasClaim ? claimRelativePath : null;
	if (!activePath || !activeRelativePath) return {
		changes: [],
		warnings: []
	};
	let snapshot;
	let parsed;
	let claimedByThisRun = false;
	try {
		snapshot = await readBoundedRegularFile({
			sourceRoot,
			relativePath: activeRelativePath,
			sourcePath: activePath,
			maxBytes: params.source.kind === "setup" ? SETUP_MAX_BYTES : LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES
		});
		parsed = parseSource(params.source, snapshot);
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed reading legacy workspace state: ${formatErrorMessage(error)}`]
		};
	}
	if (activePath === sourcePath) try {
		params.beforeClaim?.(params.source);
		assertConfiguredWorkspaceIdentity(params.source);
		await sourceRoot.move(params.source.relativePath, claimRelativePath);
		const claimed = await readBoundedRegularFile({
			sourceRoot,
			relativePath: claimRelativePath,
			sourcePath: claimPath,
			maxBytes: params.source.kind === "setup" ? SETUP_MAX_BYTES : LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES
		});
		if (!snapshotsMatch(snapshot, claimed)) throw new Error("legacy workspace source changed before Doctor could claim it");
		snapshot = claimed;
		claimedByThisRun = true;
	} catch (error) {
		const restoreError = await restoreClaim({
			sourceRoot,
			source: params.source
		});
		return {
			changes: [],
			warnings: [`Failed migrating legacy workspace state: ${formatErrorMessage(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	let result;
	try {
		assertConfiguredWorkspaceIdentity(params.source);
		result = importAndRecordReceipt({
			source: params.source,
			snapshot,
			parsed,
			env: params.env
		});
	} catch (error) {
		const restoreError = claimedByThisRun ? await restoreClaim({
			sourceRoot,
			source: params.source
		}) : null;
		return {
			changes: [],
			warnings: [`Failed migrating legacy workspace state: ${formatErrorMessage(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	try {
		if (await sourceRoot.exists(params.source.relativePath)) throw new Error("legacy workspace source reappeared during import");
		const unchanged = await readBoundedRegularFile({
			sourceRoot,
			relativePath: claimRelativePath,
			sourcePath: claimPath,
			maxBytes: params.source.kind === "setup" ? SETUP_MAX_BYTES : LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES
		});
		if (!snapshotsMatch(snapshot, unchanged)) throw new Error("legacy workspace claim changed after import");
		if (params.removeSource) await params.removeSource(claimPath);
		else await sourceRoot.remove(claimRelativePath);
		markSourceRemoved(result.sourceKey, params.env);
	} catch (error) {
		return {
			changes: [],
			warnings: [`Workspace state is in SQLite, but legacy cleanup failed: ${formatErrorMessage(error)}`]
		};
	}
	const label = parsed.kind === "setup" ? "workspace setup state" : "workspace attestation";
	return {
		changes: [result.imported ? `Migrated ${label} to SQLite.` : `Verified canonical SQLite ${label}.`],
		warnings: [],
		notices: ["Removed retired workspace state after verified SQLite import."]
	};
}
/** Import retired workspace files while excluding Gateways that can recreate them. */
async function migrateLegacyWorkspaceState(params) {
	if (!params.detected?.hasLegacy) return {
		changes: [],
		warnings: []
	};
	const env = {
		...params.env ?? process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env,
			pollIntervalMs: MIGRATION_LOCK_POLL_INTERVAL_MS,
			role: "sqlite-maintenance",
			timeoutMs: MIGRATION_LOCK_TIMEOUT_MS
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed migrating legacy workspace state: ${error instanceof GatewayLockError ? "the Gateway or another SQLite maintenance command owns this state directory" : formatErrorMessage(error)}. Stop the Gateway and run \`openclaw doctor --fix\` again.`]
		};
	}
	if (!lock) return {
		changes: [],
		warnings: ["Failed migrating legacy workspace state: exclusive state ownership unavailable."]
	};
	const changes = [];
	const warnings = [];
	const notices = [];
	let releaseError;
	try {
		for (const source of params.detected.sources) {
			const result = await migrateOneSource({
				source,
				env,
				...params.beforeClaim ? { beforeClaim: params.beforeClaim } : {},
				...params.removeSource ? { removeSource: params.removeSource } : {}
			});
			changes.push(...result.changes);
			warnings.push(...result.warnings);
			notices.push(...result.notices ?? []);
		}
	} finally {
		try {
			await lock.release();
		} catch (error) {
			releaseError = error;
		}
	}
	if (releaseError) warnings.push(`Workspace migration lock release failed: ${formatErrorMessage(releaseError)}`);
	return notices.length > 0 ? {
		changes,
		warnings,
		notices
	} : {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.doctor.ts
function describeStateSchemaMigration(migration) {
	switch (migration.kind) {
		case "agent-databases-composite-primary-key": return "agent database registry primary key → agent_id,path";
		case "audit-events-v2": return "audit event ledger → versioned message lifecycle schema";
		case "operator-approvals-system-agent": return "operator approvals → OpenClaw system changes";
		case "session-watch-cursor-provenance-v4": return "session watch cursors → provenance column";
		case "strict-tables-v3": return "tables → SQLite STRICT typing";
	}
	return migration.kind;
}
const autoMigrateChecked = /* @__PURE__ */ new Set();
const PLUGIN_DOCTOR_MIGRATION_LOCK_TIMEOUT_MS = 250;
const PLUGIN_DOCTOR_MIGRATION_LOCK_POLL_INTERVAL_MS = 25;
function resetAutoMigrateLegacyStateForTest() {
	autoMigrateChecked.clear();
	resetAutoMigrateLegacyTaskStateSidecarsForTest();
	resetLegacySessionSurfacesForTest();
}
async function collectChannelLegacyStateMigrationPlans(params) {
	const plans = [];
	const detectors = listBundledChannelLegacyStateMigrationDetectors({ config: params.cfg });
	for (const detectLegacyStateMigrationsLocal of detectors) {
		const detected = await detectLegacyStateMigrationsLocal({
			cfg: params.cfg,
			env: params.env,
			stateDir: params.stateDir,
			oauthDir: params.oauthDir
		});
		if (detected?.length) for (const detectedPlan of detected) {
			const plan = detectedPlan.kind === "plugin-state-import" && !detectedPlan.stateDir ? {
				...detectedPlan,
				stateDir: params.stateDir
			} : detectedPlan;
			plans.push(plan);
		}
	}
	return plans;
}
async function collectPluginDoctorStateMigrationPlans(params) {
	const plans = [];
	const config = params.pluginDoctorConfig ?? params.cfg;
	for (const entry of listPluginDoctorStateMigrationEntries({
		config,
		env: params.env
	})) {
		if (entry.migration.doctorOnly === true && params.includeDoctorOnly !== true) continue;
		let detected;
		try {
			detected = await entry.migration.detectLegacyState({
				config,
				env: params.env,
				stateDir: params.stateDir,
				oauthDir: params.oauthDir,
				context: createPluginDoctorStateMigrationContext(entry.pluginId, params.env)
			});
		} catch (err) {
			params.warnings?.push(`Failed detecting ${entry.migration.label}: ${String(err)}`);
			continue;
		}
		if (detected?.preview.length) plans.push({
			pluginId: entry.pluginId,
			migration: entry.migration,
			preview: detected.preview
		});
	}
	return plans;
}
function createPluginDoctorStateMigrationContext(pluginId, env) {
	return {
		getPluginStateCapacity() {
			return getPluginStateCapacity(pluginId, env);
		},
		importPluginStateEntries(options, entries) {
			importPluginStateEntriesForDoctor(pluginId, {
				...options,
				env: options.env ?? env
			}, entries);
		},
		openPluginStateKeyedStore(options) {
			return createPluginStateKeyedStore(pluginId, {
				...options,
				env: options.env ?? env
			});
		}
	};
}
async function detectLegacyStateMigrations(params) {
	const env = params.env ?? process.env;
	const homedir = params.homedir ?? os.homedir;
	const stateDir = resolveStateDir(env, homedir);
	const oauthDir = resolveOAuthDir(env, stateDir);
	const targetAgentId = normalizeAgentId(resolveDefaultAgentId(params.cfg));
	const rawMainKey = params.cfg.session?.mainKey;
	const targetMainKey = typeof rawMainKey === "string" && rawMainKey.trim().length > 0 ? rawMainKey.trim() : DEFAULT_MAIN_KEY;
	const targetScope = params.cfg.session?.scope;
	const sessionsLegacyDir = path.join(stateDir, "sessions");
	const sessionsLegacyStorePath = path.join(sessionsLegacyDir, "sessions.json");
	const sessionsTargetDir = path.join(stateDir, "agents", targetAgentId, "sessions");
	const sessionsTargetStorePath = path.join(sessionsTargetDir, "sessions.json");
	const pluginConfig = params.pluginDoctorConfig ?? params.cfg;
	const pluginSessionStoreAgentIds = params.pluginSessionStoreAgentIds ?? listPluginDoctorSessionStoreAgentIds({
		config: pluginConfig,
		env,
		pluginIds: collectRelevantDoctorPluginIds(pluginConfig)
	});
	const currentSessionStoreOwnership = resolveSessionStoreOwnership({
		cfg: params.cfg,
		env,
		stateDir,
		targetAgentId,
		pluginSessionStoreAgentIds
	});
	const sessionStoreOwnership = {
		preserveAmbiguousKeys: params.sessionStoreOwnership?.preserveAmbiguousKeys === true || currentSessionStoreOwnership.preserveAmbiguousKeys,
		preserveForeignMainAliases: params.sessionStoreOwnership?.preserveForeignMainAliases === true || currentSessionStoreOwnership.preserveForeignMainAliases,
		targetStoreAliases: mergeSessionStoreAliasPlans(params.sessionStoreOwnership?.targetStoreAliases, currentSessionStoreOwnership.targetStoreAliases)
	};
	const { preserveForeignMainAliases } = sessionStoreOwnership;
	const legacySessionEntries = safeReadDir(sessionsLegacyDir);
	const hasLegacySessions = fileExists(sessionsLegacyStorePath) || legacySessionEntries.some((e) => e.isFile() && e.name.endsWith(".jsonl"));
	const targetSessionParsed = fileExists(sessionsTargetStorePath) ? readSessionStoreJson5(sessionsTargetStorePath) : {
		store: {},
		ok: true
	};
	const legacyKeys = targetSessionParsed.ok ? listLegacySessionKeys({
		store: targetSessionParsed.store,
		agentId: targetAgentId,
		mainKey: targetMainKey,
		scope: targetScope,
		preserveAmbiguousKeys: sessionStoreOwnership.preserveAmbiguousKeys,
		preserveForeignMainAliases
	}) : [];
	const hasStaleSessionFiles = targetSessionParsed.ok && Object.values(targetSessionParsed.store).some((entry) => Boolean(resolveStaleLegacySessionFile({
		entry,
		legacyDir: sessionsLegacyDir,
		targetDir: sessionsTargetDir
	})));
	const legacyAgentDir = path.join(stateDir, "agent");
	const targetAgentDir = path.join(stateDir, "agents", targetAgentId, "agent");
	const hasLegacyAgentDir = existsDir(legacyAgentDir);
	const pluginStateSidecarPath = resolveLegacyPluginStateSidecarPath(stateDir);
	const hasPluginStateSidecar = fileExists(pluginStateSidecarPath);
	const hasPendingPluginStateSidecarArchive = hasPendingSqliteSidecarArchive(pluginStateSidecarPath, PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES);
	const pluginInstallIndexPath = resolveLegacyInstalledPluginIndexStorePath({ stateDir });
	const hasPluginInstallIndex = fileExists(pluginInstallIndexPath);
	const debugProxyCaptureSidecar = detectLegacyDebugProxyCaptureSidecar(stateDir, env);
	const stateSchemaMigrations = detectOpenClawStateDatabaseSchemaMigrations({ env: {
		...env,
		OPENCLAW_STATE_DIR: stateDir
	} });
	const taskRunsSidecarPath = resolveLegacyTaskRunsSidecarPath(stateDir);
	const flowRunsSidecarPath = resolveLegacyFlowRunsSidecarPath(stateDir);
	const hasPendingTaskRunsSidecarArchive = hasPendingSqliteSidecarArchive(taskRunsSidecarPath, TASK_STATE_SQLITE_SIDECAR_SUFFIXES);
	const hasPendingFlowRunsSidecarArchive = hasPendingSqliteSidecarArchive(flowRunsSidecarPath, TASK_STATE_SQLITE_SIDECAR_SUFFIXES);
	const hasTaskStateSidecars = fileExists(taskRunsSidecarPath) || fileExists(flowRunsSidecarPath) || hasPendingTaskRunsSidecarArchive || hasPendingFlowRunsSidecarArchive;
	const deliveryQueuePaths = {
		outboundPath: resolveLegacyDeliveryQueuePath(stateDir, "delivery-queue"),
		sessionPath: resolveLegacyDeliveryQueuePath(stateDir, "session-delivery-queue")
	};
	const hasDeliveryQueues = listLegacyDeliveryQueueFiles(deliveryQueuePaths.outboundPath).length > 0 || listLegacyDeliveryQueueDeliveredMarkers(deliveryQueuePaths.outboundPath).length > 0 || listLegacyDeliveryQueueFiles(deliveryQueuePaths.sessionPath).length > 0 || listLegacyDeliveryQueueDeliveredMarkers(deliveryQueuePaths.sessionPath).length > 0;
	const voiceWake = {
		triggersPath: resolveLegacyVoiceWakeTriggersPath(stateDir),
		routingPath: resolveLegacyVoiceWakeRoutingPath(stateDir)
	};
	const hasVoiceWake = fileExists(voiceWake.triggersPath) || fileExists(voiceWake.routingPath);
	const updateCheck = { sourcePath: resolveLegacyUpdateCheckPath(stateDir) };
	const hasUpdateCheck = fileExists(updateCheck.sourcePath);
	const configHealth = { sourcePath: resolveLegacyConfigHealthPath(stateDir) };
	const hasConfigHealth = fileExists(configHealth.sourcePath);
	const pluginBindingApprovals = { sourcePath: resolveLegacyPluginBindingApprovalsPath(env, homedir) };
	const hasPluginBindingApprovals = path.resolve(path.dirname(pluginBindingApprovals.sourcePath)) === path.resolve(stateDir) && fileExists(pluginBindingApprovals.sourcePath);
	const currentConversationBindings = { sourcePath: resolveLegacyCurrentConversationBindingsPath(stateDir) };
	const hasCurrentConversationBindings = fileExists(currentConversationBindings.sourcePath);
	const tuiLastSessions = detectLegacyTuiLastSessions({
		stateDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const commitments = detectLegacyCommitments({
		stateDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const auditLogs = detectLegacyAuditLogs({
		stateDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const acpReplayLedger = detectLegacyAcpReplayLedger({
		stateDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const managedOutgoingImages = detectLegacyManagedOutgoingImages({
		stateDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const apns = detectLegacyApnsRegistrations({
		stateDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const deviceIdentity = detectLegacyDeviceIdentity({
		stateDir,
		env,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const mcpOauth = detectLegacyMcpOAuthStores({
		stateDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const restartSentinel = detectLegacyRestartSentinel({ stateDir });
	const workspace = detectLegacyWorkspaceState({
		cfg: params.cfg,
		stateDir,
		env,
		homedir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const webPush = detectLegacyWebPush({
		stateDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const nodeHost = detectLegacyNodeHostConfig({
		stateDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const subagentRegistry = detectLegacySubagentRegistry({
		stateDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const rescuePending = detectLegacyRescuePending({
		stateDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const configuredChannels = Object.entries(params.cfg.channels ?? {});
	const configuredAccountIds = Object.fromEntries(configuredChannels.map(([channelId, value]) => {
		const channelConfig = value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
		const accountIds = [
			...getChannelPlugin(channelId)?.config.listAccountIds(params.cfg) ?? [],
			...channelConfig?.accounts && typeof channelConfig.accounts === "object" && !Array.isArray(channelConfig.accounts) ? Object.keys(channelConfig.accounts) : [],
			...typeof channelConfig?.defaultAccount === "string" ? [channelConfig.defaultAccount] : [],
			...(params.cfg.bindings ?? []).flatMap((binding) => binding.match?.channel === channelId && typeof binding.match.accountId === "string" ? [binding.match.accountId] : [])
		];
		return [channelId, Array.from(new Set(accountIds.map((entry) => entry.trim()).filter(Boolean)))];
	}));
	const channelPairing = detectLegacyChannelPairingState({
		sourceDir: oauthDir,
		configuredChannelIds: configuredChannels.map(([channelId]) => channelId),
		configuredDefaultAccountIds: Object.fromEntries(configuredChannels.flatMap(([channelId, value]) => {
			const boundAccountId = params.cfg.bindings?.find((binding) => normalizeAgentId(binding.agentId) === targetAgentId && binding.match?.channel === channelId && typeof binding.match.accountId === "string")?.match.accountId;
			if (typeof boundAccountId === "string" && boundAccountId.trim()) return [[channelId, boundAccountId.trim()]];
			const defaultAccount = value && typeof value === "object" && !Array.isArray(value) ? value.defaultAccount : void 0;
			if (typeof defaultAccount === "string" && defaultAccount.trim()) return [[channelId, defaultAccount.trim()]];
			const plugin = getChannelPlugin(channelId);
			if (plugin) return [[channelId, resolveChannelDefaultAccountId({
				plugin,
				cfg: params.cfg
			})]];
			return [[channelId, configuredAccountIds[channelId]?.toSorted()[0] ?? "default"]];
		})),
		configuredAccountIds
	});
	const channelPlans = await collectChannelLegacyStateMigrationPlans({
		cfg: params.cfg,
		env,
		stateDir,
		oauthDir
	});
	const pluginPlanWarnings = [];
	const pluginPlans = stateSchemaMigrations.length > 0 ? [] : await collectPluginDoctorStateMigrationPlans({
		cfg: params.cfg,
		pluginDoctorConfig: params.pluginDoctorConfig,
		env,
		stateDir,
		oauthDir,
		includeDoctorOnly: params.doctorOnlyStateMigrations === true,
		warnings: pluginPlanWarnings
	});
	const preview = [];
	if (hasLegacySessions) preview.push(`- Sessions: ${sessionsLegacyDir} → ${sessionsTargetDir}`);
	if (legacyKeys.length > 0) preview.push(`- Sessions: canonicalize legacy keys in ${sessionsTargetStorePath}`);
	if (hasStaleSessionFiles) preview.push(`- Sessions: repair migrated transcript paths in ${sessionsTargetStorePath}`);
	if (hasLegacyAgentDir) preview.push(`- Agent dir: ${legacyAgentDir} → ${targetAgentDir}`);
	if (hasPluginStateSidecar) preview.push(`- Plugin state sidecar: ${pluginStateSidecarPath} → shared SQLite state`);
	else if (hasPendingPluginStateSidecarArchive) preview.push(`- Plugin state sidecar: finish archive cleanup for ${pluginStateSidecarPath}`);
	if (hasPluginInstallIndex) preview.push(`- Plugin install index: ${pluginInstallIndexPath} → shared SQLite state`);
	if (debugProxyCaptureSidecar.hasLegacy) preview.push(`- Debug proxy capture sidecar: ${debugProxyCaptureSidecar.sourcePath} → shared SQLite state`);
	if (stateSchemaMigrations.length > 0) {
		for (const migration of stateSchemaMigrations) preview.push(`- Shared SQLite schema: ${describeStateSchemaMigration(migration)}`);
		preview.push("- Rerun doctor after shared SQLite schema repair to detect plugin state migrations");
	}
	if (fileExists(taskRunsSidecarPath)) preview.push(`- Task registry sidecar: ${taskRunsSidecarPath} → shared SQLite state`);
	else if (hasPendingTaskRunsSidecarArchive) preview.push(`- Task registry sidecar: finish archive cleanup for ${taskRunsSidecarPath}`);
	if (fileExists(flowRunsSidecarPath)) preview.push(`- Task flow sidecar: ${flowRunsSidecarPath} → shared SQLite state`);
	else if (hasPendingFlowRunsSidecarArchive) preview.push(`- Task flow sidecar: finish archive cleanup for ${flowRunsSidecarPath}`);
	if (hasDeliveryQueues) preview.push("- Delivery queues: legacy JSON queue files → shared SQLite state");
	if (hasVoiceWake) preview.push("- Voice Wake settings: legacy JSON files → shared SQLite state");
	if (hasUpdateCheck) preview.push("- Update-check state: legacy JSON file → shared SQLite state");
	if (hasConfigHealth) preview.push("- Config health state: legacy JSON file → shared SQLite state");
	if (hasPluginBindingApprovals) preview.push("- Plugin binding approvals: legacy JSON file → shared SQLite state");
	if (hasCurrentConversationBindings) preview.push("- Current-conversation bindings: legacy JSON file → shared SQLite state");
	if (tuiLastSessions.hasLegacy) preview.push("- TUI last-session pointers: legacy JSON file → shared SQLite state");
	if (commitments.hasLegacy) preview.push("- Commitments: legacy JSON file → shared SQLite state");
	for (const source of auditLogs.sources) preview.push(`- ${source.label}: legacy JSONL file → shared SQLite state`);
	if (acpReplayLedger.hasLegacy) preview.push("- ACP replay ledger: legacy JSON file → shared SQLite state");
	if (managedOutgoingImages.hasLegacy) preview.push("- Managed outgoing images: legacy record JSON → shared SQLite state");
	if (apns.hasLegacy) preview.push("- APNs registrations: legacy JSON → shared SQLite state");
	if (deviceIdentity.hasLegacy) preview.push("- Primary device identity: legacy JSON → shared SQLite state");
	if (deviceIdentity.hasInvalidCanonical && !deviceIdentity.hasLegacy) preview.push("- Primary device identity: invalid SQLite row → new device identity");
	if (mcpOauth.hasLegacy) preview.push("- MCP OAuth credentials: legacy JSON → shared SQLite state");
	if (restartSentinel.hasLegacy) preview.push("- Restart sentinel: legacy JSON → shared SQLite state");
	if (workspace.hasLegacy) preview.push("- Workspace setup and attestations: legacy files → shared SQLite state");
	if (webPush.hasLegacy) preview.push("- Web Push subscriptions and VAPID identity: legacy JSON → shared SQLite state");
	if (nodeHost.hasLegacy) preview.push("- Node-host config: legacy node.json → shared SQLite state");
	if (subagentRegistry.hasLegacy) preview.push("- Subagent runs: discard retired transient subagents/runs.json state");
	if (rescuePending.hasLegacy) preview.push("- System-agent rescue approvals: discard retired pending JSON capabilities");
	if (channelPairing.hasLegacy) preview.push("- Channel pairing state: legacy JSON files → shared SQLite state");
	if (channelPlans.length > 0) preview.push(...channelPlans.map(buildLegacyMigrationPreview));
	if (pluginPlans.length > 0) preview.push(...pluginPlans.flatMap((plan) => plan.preview));
	return {
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations === true,
		targetAgentId,
		targetMainKey,
		targetScope,
		stateDir,
		oauthDir,
		sessions: {
			legacyDir: sessionsLegacyDir,
			legacyStorePath: sessionsLegacyStorePath,
			targetDir: sessionsTargetDir,
			targetStorePath: sessionsTargetStorePath,
			hasLegacy: hasLegacySessions || legacyKeys.length > 0 || hasStaleSessionFiles,
			legacyKeys,
			preserveAmbiguousKeys: sessionStoreOwnership.preserveAmbiguousKeys,
			preserveForeignMainAliases,
			targetStoreAliases: sessionStoreOwnership.targetStoreAliases
		},
		agentDir: {
			legacyDir: legacyAgentDir,
			targetDir: targetAgentDir,
			hasLegacy: hasLegacyAgentDir
		},
		channelPlans: {
			hasLegacy: channelPlans.length > 0,
			plans: channelPlans
		},
		pluginPlans: {
			hasLegacy: pluginPlans.length > 0,
			plans: pluginPlans
		},
		pluginStateSidecar: {
			sourcePath: pluginStateSidecarPath,
			hasLegacy: hasPluginStateSidecar || hasPendingPluginStateSidecarArchive
		},
		pluginInstallIndex: {
			sourcePath: pluginInstallIndexPath,
			hasLegacy: hasPluginInstallIndex
		},
		debugProxyCaptureSidecar,
		stateSchema: {
			hasLegacy: stateSchemaMigrations.length > 0,
			preview: stateSchemaMigrations.map((migration) => migration.path)
		},
		taskStateSidecars: {
			taskRunsPath: taskRunsSidecarPath,
			flowRunsPath: flowRunsSidecarPath,
			hasLegacy: hasTaskStateSidecars
		},
		deliveryQueues: {
			...deliveryQueuePaths,
			hasLegacy: hasDeliveryQueues
		},
		voiceWake: {
			...voiceWake,
			hasLegacy: hasVoiceWake
		},
		updateCheck: {
			...updateCheck,
			hasLegacy: hasUpdateCheck
		},
		configHealth: {
			...configHealth,
			hasLegacy: hasConfigHealth
		},
		pluginBindingApprovals: {
			...pluginBindingApprovals,
			hasLegacy: hasPluginBindingApprovals
		},
		currentConversationBindings: {
			...currentConversationBindings,
			hasLegacy: hasCurrentConversationBindings
		},
		tuiLastSessions,
		commitments,
		auditLogs,
		acpReplayLedger,
		managedOutgoingImages,
		apns,
		deviceIdentity,
		mcpOauth,
		restartSentinel,
		workspace,
		webPush,
		nodeHost,
		subagentRegistry,
		rescuePending,
		channelPairing,
		warnings: pluginPlanWarnings,
		notices: [],
		preview
	};
}
async function runPluginDoctorStateMigrationPlans(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	const refreshedPlans = await collectPluginDoctorStateMigrationPlans({
		cfg: params.config,
		env: params.env,
		stateDir: params.detected.stateDir,
		oauthDir: params.detected.oauthDir,
		includeDoctorOnly: params.detected.doctorOnlyStateMigrations,
		warnings
	});
	const hasDetectorFailure = warnings.length > 0;
	const migrated = await migratePluginDoctorStatePlans({
		plans: refreshedPlans.length > 0 || hasDetectorFailure ? refreshedPlans : params.detected.pluginPlans?.plans ?? [],
		config: params.config,
		env: params.env,
		stateDir: params.detected.stateDir,
		oauthDir: params.detected.oauthDir
	});
	changes.push(...migrated.changes);
	warnings.push(...migrated.warnings);
	notices.push(...migrated.notices ?? []);
	return notices.length > 0 ? {
		changes,
		warnings,
		notices
	} : {
		changes,
		warnings
	};
}
async function migratePluginDoctorStatePlans(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	if (params.plans.length === 0) return {
		changes,
		warnings
	};
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env: {
				...params.env,
				OPENCLAW_STATE_DIR: params.stateDir
			},
			pollIntervalMs: PLUGIN_DOCTOR_MIGRATION_LOCK_POLL_INTERVAL_MS,
			role: "sqlite-maintenance",
			timeoutMs: PLUGIN_DOCTOR_MIGRATION_LOCK_TIMEOUT_MS
		});
	} catch (error) {
		return {
			changes,
			warnings: [`Skipped plugin doctor state migrations because exclusive state ownership is unavailable: ${String(error)}`]
		};
	}
	if (!lock) return {
		changes,
		warnings: ["Skipped plugin doctor state migrations because exclusive state ownership is unavailable"]
	};
	try {
		for (const plan of params.plans) try {
			const result = await plan.migration.migrateLegacyState({
				config: params.config,
				env: params.env,
				stateDir: params.stateDir,
				oauthDir: params.oauthDir,
				context: createPluginDoctorStateMigrationContext(plan.pluginId, params.env)
			});
			changes.push(...result.changes);
			warnings.push(...result.warnings);
			notices.push(...result.notices ?? []);
		} catch (err) {
			warnings.push(`Failed migrating ${plan.migration.label}: ${String(err)}`);
		}
	} finally {
		await lock.release();
	}
	return notices.length > 0 ? {
		changes,
		warnings,
		notices
	} : {
		changes,
		warnings
	};
}
async function autoMigrateLegacyPluginDoctorState(params) {
	const env = params.env ?? process.env;
	const stateDirResult = await autoMigrateLegacyStateDir({
		env,
		homedir: params.homedir,
		log: params.log
	});
	const stateDir = resolveStateDir(env, params.homedir ?? os.homedir);
	const oauthDir = resolveOAuthDir(env, stateDir);
	const stateSchema = repairOpenClawStateDatabaseSchema({ env: {
		...env,
		OPENCLAW_STATE_DIR: stateDir
	} });
	const changes = [...stateDirResult.changes, ...stateSchema.changes];
	const warnings = [...stateDirResult.warnings, ...stateSchema.warnings];
	const notices = [...stateDirResult.notices ?? []];
	if (stateSchema.warnings.length > 0) return {
		migrated: stateDirResult.migrated || stateSchema.changes.length > 0,
		skipped: false,
		changes,
		warnings,
		...notices.length > 0 ? { notices } : {}
	};
	const plans = await collectPluginDoctorStateMigrationPlans({
		cfg: params.config,
		env,
		stateDir,
		oauthDir,
		warnings
	});
	const migrated = await migratePluginDoctorStatePlans({
		plans,
		config: params.config,
		env,
		stateDir,
		oauthDir
	});
	changes.push(...migrated.changes);
	warnings.push(...migrated.warnings);
	notices.push(...migrated.notices ?? []);
	return {
		migrated: stateDirResult.migrated || stateSchema.changes.length > 0 || plans.length > 0,
		skipped: false,
		changes,
		warnings,
		...notices.length > 0 ? { notices } : {}
	};
}
function migrateLegacyStateSchema(detected, env) {
	return repairOpenClawStateDatabaseSchema({ env: {
		...env,
		OPENCLAW_STATE_DIR: detected.stateDir
	} });
}
async function runLegacyStateMigrations(params) {
	const now = params.now ?? (() => Date.now());
	const detected = params.detected;
	const env = params.env ?? process.env;
	const stateSchema = migrateLegacyStateSchema(detected, env);
	if (detected.stateSchema.hasLegacy && stateSchema.warnings.length > 0) return stateSchema;
	const pluginStateSidecar = await migrateLegacyPluginStateSidecar({ stateDir: detected.stateDir });
	const pluginInstallIndex = await migrateLegacyInstalledPluginIndex({ stateDir: detected.stateDir });
	const debugProxyCaptureSidecar = migrateLegacyDebugProxyCaptureSidecar({
		stateDir: detected.stateDir,
		detected: detected.debugProxyCaptureSidecar
	});
	const taskStateSidecars = await migrateLegacyTaskStateSidecars({ stateDir: detected.stateDir });
	const deliveryQueues = await migrateLegacyDeliveryQueues({ stateDir: detected.stateDir });
	const voiceWake = migrateLegacyVoiceWakeSettings({
		detected: detected.voiceWake,
		stateDir: detected.stateDir
	});
	const updateCheck = migrateLegacyUpdateCheckState({
		detected: detected.updateCheck,
		stateDir: detected.stateDir
	});
	const configHealth = migrateLegacyConfigHealth({
		detected: detected.configHealth,
		stateDir: detected.stateDir
	});
	const pluginBindingApprovals = migrateLegacyPluginBindingApprovals({
		detected: detected.pluginBindingApprovals,
		stateDir: detected.stateDir
	});
	const currentConversationBindings = migrateLegacyCurrentConversationBindings({
		detected: detected.currentConversationBindings,
		stateDir: detected.stateDir
	});
	const tuiLastSessions = migrateLegacyTuiLastSessions({
		detected: detected.tuiLastSessions,
		stateDir: detected.stateDir
	});
	const commitments = migrateLegacyCommitments({
		detected: detected.commitments,
		stateDir: detected.stateDir
	});
	const auditLogs = await migrateLegacyAuditLogs({
		detected: detected.auditLogs,
		stateDir: detected.stateDir
	});
	const acpReplayLedger = await migrateLegacyAcpReplayLedger({
		detected: detected.acpReplayLedger,
		stateDir: detected.stateDir
	});
	const managedOutgoingImages = migrateLegacyManagedOutgoingImages({
		detected: detected.managedOutgoingImages,
		stateDir: detected.stateDir
	});
	const apns = await migrateLegacyApnsRegistrations({
		detected: detected.apns,
		env,
		stateDir: detected.stateDir
	});
	const deviceIdentity = await migrateLegacyDeviceIdentity({
		detected: detected.deviceIdentity,
		env,
		stateDir: detected.stateDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const mcpOauth = await migrateLegacyMcpOAuthStores({
		detected: detected.mcpOauth,
		env,
		stateDir: detected.stateDir
	});
	const restartSentinel = await migrateLegacyRestartSentinel({
		detected: detected.restartSentinel,
		env,
		stateDir: detected.stateDir
	});
	const workspace = await migrateLegacyWorkspaceState({
		detected: detected.workspace,
		env,
		stateDir: detected.stateDir
	});
	const webPush = await migrateLegacyWebPush({
		detected: detected.webPush,
		env,
		stateDir: detected.stateDir
	});
	const nodeHost = await migrateLegacyNodeHostConfig({
		detected: detected.nodeHost,
		env,
		stateDir: detected.stateDir
	});
	const subagentRegistry = await migrateLegacySubagentRegistry({
		detected: detected.subagentRegistry,
		env,
		stateDir: detected.stateDir
	});
	const rescuePending = discardLegacyRescuePending({
		detected: detected.rescuePending,
		stateDir: detected.stateDir
	});
	const channelPairing = migrateLegacyChannelPairingState({
		detected: detected.channelPairing,
		env: {
			...env,
			OPENCLAW_STATE_DIR: detected.stateDir
		}
	});
	const preSessionChannelPlans = await runLegacyMigrationPlans(detected.channelPlans.plans.filter((plan) => plan.kind === "plugin-state-import"));
	const pluginPlans = detected.stateSchema.hasLegacy ? {
		changes: [],
		warnings: []
	} : await runPluginDoctorStateMigrationPlans({
		detected,
		config: params.config ?? {},
		env
	});
	const sessions = await migrateLegacySessions(detected, now, { recoverCorruptTargetStore: params.recoverCorruptTargetStore });
	const acpSessionMetadata = await migrateLegacyAcpSessionMetadata({
		cfg: params.config ?? {},
		env: {
			...env,
			OPENCLAW_STATE_DIR: detected.stateDir
		},
		now
	});
	const agentDir = await migrateLegacyAgentDir(detected, now);
	const channelPlans = await runLegacyMigrationPlans(detected.channelPlans.plans.filter((plan) => plan.kind !== "plugin-state-import"));
	const notices = mergeNotices([
		pluginInstallIndex,
		updateCheck,
		tuiLastSessions,
		commitments,
		auditLogs,
		acpReplayLedger,
		managedOutgoingImages,
		apns,
		deviceIdentity,
		mcpOauth,
		restartSentinel,
		workspace,
		webPush,
		nodeHost,
		subagentRegistry,
		pluginPlans
	]);
	return {
		changes: [
			...stateSchema.changes,
			...pluginStateSidecar.changes,
			...pluginInstallIndex.changes,
			...debugProxyCaptureSidecar.changes,
			...taskStateSidecars.changes,
			...deliveryQueues.changes,
			...voiceWake.changes,
			...updateCheck.changes,
			...configHealth.changes,
			...pluginBindingApprovals.changes,
			...currentConversationBindings.changes,
			...tuiLastSessions.changes,
			...commitments.changes,
			...auditLogs.changes,
			...acpReplayLedger.changes,
			...managedOutgoingImages.changes,
			...apns.changes,
			...deviceIdentity.changes,
			...mcpOauth.changes,
			...restartSentinel.changes,
			...workspace.changes,
			...webPush.changes,
			...nodeHost.changes,
			...subagentRegistry.changes,
			...rescuePending.changes,
			...channelPairing.changes,
			...preSessionChannelPlans.changes,
			...pluginPlans.changes,
			...sessions.changes,
			...acpSessionMetadata.changes,
			...agentDir.changes,
			...channelPlans.changes
		],
		warnings: [
			...stateSchema.warnings,
			...detected.warnings,
			...pluginStateSidecar.warnings,
			...pluginInstallIndex.warnings,
			...debugProxyCaptureSidecar.warnings,
			...taskStateSidecars.warnings,
			...deliveryQueues.warnings,
			...voiceWake.warnings,
			...updateCheck.warnings,
			...configHealth.warnings,
			...pluginBindingApprovals.warnings,
			...currentConversationBindings.warnings,
			...tuiLastSessions.warnings,
			...commitments.warnings,
			...auditLogs.warnings,
			...acpReplayLedger.warnings,
			...managedOutgoingImages.warnings,
			...apns.warnings,
			...deviceIdentity.warnings,
			...mcpOauth.warnings,
			...restartSentinel.warnings,
			...workspace.warnings,
			...webPush.warnings,
			...nodeHost.warnings,
			...subagentRegistry.warnings,
			...rescuePending.warnings,
			...channelPairing.warnings,
			...preSessionChannelPlans.warnings,
			...pluginPlans.warnings,
			...sessions.warnings,
			...acpSessionMetadata.warnings,
			...agentDir.warnings,
			...channelPlans.warnings
		],
		...notices.length > 0 ? { notices } : {}
	};
}
/**
* Canonicalize orphaned raw session keys in all known agent session stores.
*
* Keys written by resolveSessionKey() used DEFAULT_AGENT_ID="main" regardless
* of the configured default agent; reads always use resolveSessionStoreKey()
* which canonicalizes via canonicalizeMainSessionAlias. This migration renames
* any orphaned raw keys to their canonical form in-place, merging with any
* existing canonical entry by preferring the most recently updated.
*
* Safe to run multiple times (idempotent). See #29683.
*/
async function autoMigrateLegacyState(params) {
	const env = params.env ?? process.env;
	const homedir = params.homedir ?? os.homedir;
	const migrationMode = params.doctorOnlyStateMigrations === true ? "doctor-repair" : "automatic";
	const initialStateDir = resolveStateDir(env, homedir);
	const checkKey = `${path.resolve(initialStateDir)}\0${migrationMode}`;
	if (autoMigrateChecked.has(checkKey)) return {
		migrated: false,
		skipped: true,
		changes: [],
		warnings: []
	};
	autoMigrateChecked.add(checkKey);
	const stateDirResult = await autoMigrateLegacyStateDir({
		env,
		homedir,
		log: params.log
	});
	const stateDir = resolveStateDir(env, homedir);
	autoMigrateChecked.add(`${path.resolve(stateDir)}\0${migrationMode}`);
	const stateSchema = repairOpenClawStateDatabaseSchema({ env: {
		...env,
		OPENCLAW_STATE_DIR: stateDir
	} });
	if (stateSchema.warnings.length > 0) return {
		migrated: stateDirResult.migrated || stateSchema.changes.length > 0,
		skipped: false,
		changes: [...stateDirResult.changes, ...stateSchema.changes],
		warnings: [...stateDirResult.warnings, ...stateSchema.warnings],
		...stateDirResult.notices?.length ? { notices: stateDirResult.notices } : {}
	};
	const pluginDoctorConfig = params.pluginDoctorConfig ?? params.cfg;
	const pluginSessionStoreAgentIds = listPluginDoctorSessionStoreAgentIds({
		config: pluginDoctorConfig,
		env,
		pluginIds: collectRelevantDoctorPluginIds(pluginDoctorConfig)
	});
	const sessionStoreOwnership = resolveSessionStoreOwnership({
		cfg: params.cfg,
		env,
		stateDir,
		targetAgentId: normalizeAgentId(resolveDefaultAgentId(params.cfg)),
		pluginSessionStoreAgentIds
	});
	const orphanKeys = await migrateOrphanedSessionKeys({
		cfg: params.cfg,
		env,
		additionalAgentIds: pluginSessionStoreAgentIds
	});
	const acpSessionMetadata = await migrateLegacyAcpSessionMetadata({
		cfg: params.cfg,
		env,
		now: params.now,
		pluginSessionStoreAgentIds
	});
	const logMigrationResults = (changes, warnings, notices) => {
		const logger = params.log ?? createSubsystemLogger("state-migrations");
		if (changes.length > 0) logger.info(`Auto-migrated legacy state:\n${changes.map((entry) => `- ${entry}`).join("\n")}`);
		if (warnings.length > 0) logger.warn(`Legacy state migration warnings:\n${warnings.map((entry) => `- ${entry}`).join("\n")}`);
		if (notices.length > 0) logger.info(`Legacy state migration notes:\n${notices.map((entry) => `- ${entry}`).join("\n")}`);
	};
	const detected = await detectLegacyStateMigrations({
		cfg: params.cfg,
		pluginDoctorConfig: params.pluginDoctorConfig,
		pluginSessionStoreAgentIds,
		sessionStoreOwnership,
		env,
		homedir: params.homedir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const deviceIdentity = await migrateLegacyDeviceIdentity({
		detected: detected.deviceIdentity,
		env,
		stateDir: detected.stateDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	if (env.OPENCLAW_AGENT_DIR?.trim() || env.PI_CODING_AGENT_DIR?.trim()) {
		const pluginStateSidecar = await migrateLegacyPluginStateSidecar({ stateDir: detected.stateDir });
		const pluginInstallIndex = await migrateLegacyInstalledPluginIndex({ stateDir: detected.stateDir });
		const debugProxyCaptureSidecar = migrateLegacyDebugProxyCaptureSidecar({
			stateDir: detected.stateDir,
			detected: detected.debugProxyCaptureSidecar
		});
		const taskStateSidecars = await migrateLegacyTaskStateSidecars({ stateDir: detected.stateDir });
		const deliveryQueues = await migrateLegacyDeliveryQueues({ stateDir: detected.stateDir });
		const voiceWake = migrateLegacyVoiceWakeSettings({
			detected: detected.voiceWake,
			stateDir: detected.stateDir
		});
		const updateCheck = migrateLegacyUpdateCheckState({
			detected: detected.updateCheck,
			stateDir: detected.stateDir
		});
		const configHealth = migrateLegacyConfigHealth({
			detected: detected.configHealth,
			stateDir: detected.stateDir
		});
		const pluginBindingApprovals = migrateLegacyPluginBindingApprovals({
			detected: detected.pluginBindingApprovals,
			stateDir: detected.stateDir
		});
		const currentConversationBindings = migrateLegacyCurrentConversationBindings({
			detected: detected.currentConversationBindings,
			stateDir: detected.stateDir
		});
		const restartSentinel = await migrateLegacyRestartSentinel({
			detected: detected.restartSentinel,
			env,
			stateDir: detected.stateDir
		});
		const channelPairing = migrateLegacyChannelPairingState({
			detected: detected.channelPairing,
			env: {
				...env,
				OPENCLAW_STATE_DIR: detected.stateDir
			}
		});
		const preSessionChannelPlans = await runLegacyMigrationPlans(detected.channelPlans.plans.filter((plan) => plan.kind === "plugin-state-import"));
		const pluginPlans = await runPluginDoctorStateMigrationPlans({
			detected,
			config: params.pluginDoctorConfig ?? params.cfg,
			env
		});
		const changes = [
			...stateDirResult.changes,
			...stateSchema.changes,
			...orphanKeys.changes,
			...acpSessionMetadata.changes,
			...pluginStateSidecar.changes,
			...pluginInstallIndex.changes,
			...debugProxyCaptureSidecar.changes,
			...taskStateSidecars.changes,
			...deliveryQueues.changes,
			...voiceWake.changes,
			...updateCheck.changes,
			...configHealth.changes,
			...pluginBindingApprovals.changes,
			...currentConversationBindings.changes,
			...deviceIdentity.changes,
			...restartSentinel.changes,
			...channelPairing.changes,
			...preSessionChannelPlans.changes,
			...pluginPlans.changes
		];
		const warnings = [
			...stateDirResult.warnings,
			...stateSchema.warnings,
			...detected.warnings,
			...orphanKeys.warnings,
			...acpSessionMetadata.warnings,
			...pluginStateSidecar.warnings,
			...pluginInstallIndex.warnings,
			...debugProxyCaptureSidecar.warnings,
			...taskStateSidecars.warnings,
			...deliveryQueues.warnings,
			...voiceWake.warnings,
			...updateCheck.warnings,
			...configHealth.warnings,
			...pluginBindingApprovals.warnings,
			...currentConversationBindings.warnings,
			...deviceIdentity.warnings,
			...restartSentinel.warnings,
			...channelPairing.warnings,
			...preSessionChannelPlans.warnings,
			...pluginPlans.warnings
		];
		const notices = mergeNotices([
			stateDirResult,
			detected,
			pluginInstallIndex,
			updateCheck,
			deviceIdentity,
			restartSentinel,
			pluginPlans
		]);
		logMigrationResults(changes, warnings, notices);
		return {
			migrated: stateDirResult.migrated || stateSchema.changes.length > 0 || orphanKeys.changes.length > 0 || acpSessionMetadata.changes.length > 0 || pluginStateSidecar.changes.length > 0 || pluginInstallIndex.changes.length > 0 || debugProxyCaptureSidecar.changes.length > 0 || taskStateSidecars.changes.length > 0 || deliveryQueues.changes.length > 0 || voiceWake.changes.length > 0 || updateCheck.changes.length > 0 || configHealth.changes.length > 0 || pluginBindingApprovals.changes.length > 0 || currentConversationBindings.changes.length > 0 || deviceIdentity.changes.length > 0 || restartSentinel.changes.length > 0 || channelPairing.changes.length > 0 || preSessionChannelPlans.changes.length > 0 || pluginPlans.changes.length > 0,
			skipped: true,
			changes,
			warnings,
			...notices.length > 0 ? { notices } : {}
		};
	}
	if (!detected.sessions.hasLegacy && !detected.agentDir.hasLegacy && !detected.channelPlans.hasLegacy && !detected.pluginPlans?.hasLegacy && !detected.pluginStateSidecar.hasLegacy && !detected.pluginInstallIndex.hasLegacy && !detected.debugProxyCaptureSidecar.hasLegacy && !detected.stateSchema.hasLegacy && !detected.taskStateSidecars.hasLegacy && !detected.deliveryQueues.hasLegacy && !detected.voiceWake.hasLegacy && !detected.updateCheck.hasLegacy && !detected.configHealth.hasLegacy && !detected.pluginBindingApprovals.hasLegacy && !detected.currentConversationBindings.hasLegacy && !detected.restartSentinel?.hasLegacy && !detected.workspace.hasLegacy && !detected.channelPairing.hasLegacy) {
		const changes = [
			...stateDirResult.changes,
			...stateSchema.changes,
			...orphanKeys.changes,
			...acpSessionMetadata.changes,
			...deviceIdentity.changes
		];
		const warnings = [
			...stateDirResult.warnings,
			...stateSchema.warnings,
			...detected.warnings,
			...orphanKeys.warnings,
			...acpSessionMetadata.warnings,
			...deviceIdentity.warnings
		];
		const notices = [
			...stateDirResult.notices ?? [],
			...detected.notices,
			...deviceIdentity.notices ?? []
		];
		logMigrationResults(changes, warnings, notices);
		return {
			migrated: stateDirResult.migrated || stateSchema.changes.length > 0 || orphanKeys.changes.length > 0 || acpSessionMetadata.changes.length > 0 || deviceIdentity.changes.length > 0,
			skipped: false,
			changes,
			warnings,
			...notices.length > 0 ? { notices } : {}
		};
	}
	const now = params.now ?? (() => Date.now());
	const pluginStateSidecar = await migrateLegacyPluginStateSidecar({ stateDir: detected.stateDir });
	const pluginInstallIndex = await migrateLegacyInstalledPluginIndex({ stateDir: detected.stateDir });
	const debugProxyCaptureSidecar = migrateLegacyDebugProxyCaptureSidecar({
		stateDir: detected.stateDir,
		detected: detected.debugProxyCaptureSidecar
	});
	const taskStateSidecars = await migrateLegacyTaskStateSidecars({ stateDir: detected.stateDir });
	const deliveryQueues = await migrateLegacyDeliveryQueues({ stateDir: detected.stateDir });
	const voiceWake = migrateLegacyVoiceWakeSettings({
		detected: detected.voiceWake,
		stateDir: detected.stateDir
	});
	const updateCheck = migrateLegacyUpdateCheckState({
		detected: detected.updateCheck,
		stateDir: detected.stateDir
	});
	const configHealth = migrateLegacyConfigHealth({
		detected: detected.configHealth,
		stateDir: detected.stateDir
	});
	const pluginBindingApprovals = migrateLegacyPluginBindingApprovals({
		detected: detected.pluginBindingApprovals,
		stateDir: detected.stateDir
	});
	const currentConversationBindings = migrateLegacyCurrentConversationBindings({
		detected: detected.currentConversationBindings,
		stateDir: detected.stateDir
	});
	const restartSentinel = await migrateLegacyRestartSentinel({
		detected: detected.restartSentinel,
		env,
		stateDir: detected.stateDir
	});
	const channelPairing = migrateLegacyChannelPairingState({
		detected: detected.channelPairing,
		env: {
			...env,
			OPENCLAW_STATE_DIR: detected.stateDir
		}
	});
	const preSessionChannelPlans = await runLegacyMigrationPlans(detected.channelPlans.plans.filter((plan) => plan.kind === "plugin-state-import"));
	const pluginPlans = await runPluginDoctorStateMigrationPlans({
		detected,
		config: params.pluginDoctorConfig ?? params.cfg,
		env
	});
	const sessions = await migrateLegacySessions(detected, now, { recoverCorruptTargetStore: params.recoverCorruptTargetStore });
	const postSessionAcpMetadata = await migrateLegacyAcpSessionMetadata({
		cfg: params.cfg,
		env,
		now,
		pluginSessionStoreAgentIds
	});
	const agentDir = await migrateLegacyAgentDir(detected, now);
	const channelPlans = await runLegacyMigrationPlans(detected.channelPlans.plans.filter((plan) => plan.kind !== "plugin-state-import"));
	const changes = [
		...stateDirResult.changes,
		...stateSchema.changes,
		...orphanKeys.changes,
		...acpSessionMetadata.changes,
		...pluginStateSidecar.changes,
		...pluginInstallIndex.changes,
		...debugProxyCaptureSidecar.changes,
		...taskStateSidecars.changes,
		...deliveryQueues.changes,
		...voiceWake.changes,
		...updateCheck.changes,
		...configHealth.changes,
		...pluginBindingApprovals.changes,
		...currentConversationBindings.changes,
		...deviceIdentity.changes,
		...restartSentinel.changes,
		...channelPairing.changes,
		...preSessionChannelPlans.changes,
		...pluginPlans.changes,
		...sessions.changes,
		...postSessionAcpMetadata.changes,
		...agentDir.changes,
		...channelPlans.changes
	];
	const warnings = [
		...stateDirResult.warnings,
		...stateSchema.warnings,
		...detected.warnings,
		...orphanKeys.warnings,
		...acpSessionMetadata.warnings,
		...pluginStateSidecar.warnings,
		...pluginInstallIndex.warnings,
		...debugProxyCaptureSidecar.warnings,
		...taskStateSidecars.warnings,
		...deliveryQueues.warnings,
		...voiceWake.warnings,
		...updateCheck.warnings,
		...configHealth.warnings,
		...pluginBindingApprovals.warnings,
		...currentConversationBindings.warnings,
		...deviceIdentity.warnings,
		...restartSentinel.warnings,
		...channelPairing.warnings,
		...preSessionChannelPlans.warnings,
		...pluginPlans.warnings,
		...sessions.warnings,
		...postSessionAcpMetadata.warnings,
		...agentDir.warnings,
		...channelPlans.warnings
	];
	const notices = mergeNotices([
		stateDirResult,
		detected,
		pluginInstallIndex,
		updateCheck,
		deviceIdentity,
		restartSentinel,
		pluginPlans
	]);
	logMigrationResults(changes, warnings, notices);
	return {
		migrated: changes.length > 0,
		skipped: false,
		changes,
		warnings,
		...notices.length > 0 ? { notices } : {}
	};
}
//#endregion
export { runLegacyStateMigrations as a, resetAutoMigrateLegacyStateDirForTest as c, migrateOrphanedSessionKeys as d, resetAutoMigrateLegacyStateForTest as i, resetAutoMigrateLegacyTaskStateSidecarsForTest as l, autoMigrateLegacyState as n, autoMigrateLegacyStateDir as o, detectLegacyStateMigrations as r, autoMigrateLegacyTaskStateSidecars as s, autoMigrateLegacyPluginDoctorState as t, migrateLegacyAgentDir as u };
