import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { S as resolveDateTimestampMs } from "./number-coercion-Crk_c9KW.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as sameFileIdentity } from "./file-identity-C0fBiekR.js";
import "./fs-safe-Dy0g6QwA.js";
import { a as root } from "./secure-temp-dir-D6Ou0J-U.js";
import { i as writeRuntimeJson } from "./runtime-ZHfN2VLf.js";
import { f as resolveHomeDir } from "./utils-K2PjeLaV.js";
import { t as sleep } from "./sleep-Ce8zcpEF.js";
import { s as resolveRuntimeServiceVersion } from "./version-CeFj_iGk.js";
import { u as writeJson } from "./json--wG6OtAJ.js";
import "./json-files-2JJFkKam.js";
import { O as resolveOpenClawStateSqlitePath } from "./openclaw-state-db-DkOMT2fb.js";
import "./fs-safe-advanced-B0eXpnA9.js";
import { r as createVerifiedSqliteSnapshot } from "./sqlite-snapshot-C3GpzwWH.js";
import { n as isPathWithin } from "./cleanup-utils-oyZbOUsW.js";
import { i as resolveBackupPlanFromDisk, n as buildBackupArchivePath, r as buildBackupArchiveRoot, t as buildBackupArchiveBasename } from "./backup-shared-BRGlElHq.js";
import { a as readLegacyAuditSourcePrefixSnapshotForBackup, d as prepareLegacyAuditRecords, f as serializePreparedAuditRecords, g as legacyAuditSourceGenerationKey, h as legacyAuditRawCheckpointKey, i as readLegacyAuditRecoverySourceForBackup, p as detectLegacyAuditLogs, r as findPreviousLegacyAuditRawCheckpoint, t as withLegacyAuditMigrationLease } from "./state-migrations.audit-coordination-Aiu1Gm2d.js";
import { createHash, randomUUID } from "node:crypto";
import { constants, createWriteStream } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { pipeline } from "node:stream/promises";
import { Transform } from "node:stream";
//#region src/state/openclaw-state-snapshot-sanitizer.ts
function tableExists(database, tableName) {
	return database.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName)?.ok === 1;
}
/** Remove coordination rows that must never survive restore. */
function sanitizeOpenClawStateLeaseRows(database) {
	if (tableExists(database, "state_leases")) database.prepare("DELETE FROM state_leases").run();
}
/** Remove transient rows whose restoration would replay work or extend private-data retention. */
function sanitizeOpenClawGlobalStateSnapshot(database) {
	sanitizeOpenClawStateLeaseRows(database);
	if (tableExists(database, "delivery_queue_entries")) database.prepare("DELETE FROM delivery_queue_entries").run();
	if (tableExists(database, "plugin_blob_entries")) database.prepare("DELETE FROM plugin_blob_entries WHERE expires_at IS NOT NULL").run();
}
//#endregion
//#region src/infra/backup-create-stream.ts
const BACKUP_ARCHIVE_IDLE_TIMEOUT_MS = 5 * 6e4;
async function writeArchiveStreamToFile(params) {
	const idleTimeoutMs = params.idleTimeoutMs ?? BACKUP_ARCHIVE_IDLE_TIMEOUT_MS;
	const controller = new AbortController();
	let idleTimer;
	let idleTimeoutError;
	const armIdleTimer = () => {
		if (idleTimer) clearTimeout(idleTimer);
		idleTimer = setTimeout(() => {
			idleTimeoutError = /* @__PURE__ */ new Error(`Backup archive write stalled: no data produced for ${idleTimeoutMs}ms`);
			params.archiveStream.destroy(idleTimeoutError);
			controller.abort(idleTimeoutError);
		}, idleTimeoutMs);
	};
	const progress = new Transform({ transform(chunk, _encoding, callback) {
		armIdleTimer();
		callback(null, chunk);
	} });
	armIdleTimer();
	try {
		await pipeline(params.archiveStream, progress, createWriteStream(params.archivePath, {
			flags: "wx",
			mode: 384
		}), { signal: controller.signal });
	} catch (err) {
		throw idleTimeoutError ?? err;
	} finally {
		if (idleTimer) clearTimeout(idleTimer);
	}
}
//#endregion
//#region src/infra/backup-tar-retry.ts
const BACKUP_TAR_MAX_ATTEMPTS = 3;
const BACKUP_TAR_BACKOFF_MS = [1e4, 2e4];
function isTarEofRaceError(err) {
	if (!err || typeof err !== "object") return false;
	if (err.code === "EOF") return true;
	const message = err.message ?? "";
	return /(did not encounter expected|encountered unexpected) EOF|TAR_BAD_ARCHIVE/i.test(message);
}
function resolveBackupTarAttemptTempPath(tempArchivePath, attempt) {
	return attempt === 1 ? tempArchivePath : `${tempArchivePath}.retry-${attempt}`;
}
function resolveBackupTarAttemptTempPaths(tempArchivePath) {
	return Array.from({ length: BACKUP_TAR_MAX_ATTEMPTS }, (_value, index) => resolveBackupTarAttemptTempPath(tempArchivePath, index + 1));
}
async function removeBackupTempArchiveBestEffort(tempArchivePath) {
	await fs$1.rm(tempArchivePath, { force: true }).catch(() => void 0);
}
async function writeTarArchiveWithRetry(params) {
	const sleepFn = params.sleepMs ?? sleep;
	let lastErr;
	const attemptTempArchivePaths = [];
	for (let attempt = 1; attempt <= BACKUP_TAR_MAX_ATTEMPTS; attempt += 1) {
		const attemptTempArchivePath = resolveBackupTarAttemptTempPath(params.tempArchivePath, attempt);
		attemptTempArchivePaths.push(attemptTempArchivePath);
		try {
			await params.runTar(attemptTempArchivePath);
			for (const staleTempArchivePath of attemptTempArchivePaths.slice(0, -1)) await removeBackupTempArchiveBestEffort(staleTempArchivePath);
			return attemptTempArchivePath;
		} catch (err) {
			lastErr = err;
			if (!isTarEofRaceError(err) || attempt === BACKUP_TAR_MAX_ATTEMPTS) {
				for (const staleTempArchivePath of attemptTempArchivePaths) await removeBackupTempArchiveBestEffort(staleTempArchivePath);
				break;
			}
			try {
				await fs$1.rm(attemptTempArchivePath, { force: true });
			} catch (cleanupErr) {
				const code = cleanupErr.code;
				if (code && code !== "ENOENT") params.log?.(`Backup archiver could not remove temp archive ${attemptTempArchivePath} between retries: ${code}. Continuing.`);
			}
			const backoff = BACKUP_TAR_BACKOFF_MS[attempt - 1] ?? 0;
			const offendingPath = err.path;
			params.log?.(`Backup archiver hit a live-write race${offendingPath ? ` on ${offendingPath}` : ""} (attempt ${attempt}/${BACKUP_TAR_MAX_ATTEMPTS}); retrying in ${Math.round(backoff / 1e3)}s.`);
			await sleepFn(backoff);
		}
	}
	const final = lastErr instanceof Error ? lastErr : new Error(String(lastErr));
	const offendingPath = lastErr?.path;
	const suffix = offendingPath ? ` (last offending path: ${offendingPath}, after ${BACKUP_TAR_MAX_ATTEMPTS} attempts)` : ` (after ${BACKUP_TAR_MAX_ATTEMPTS} attempts)`;
	throw new Error(`Backup archive write failed: ${final.message}${suffix}`, { cause: final });
}
//#endregion
//#region src/infra/backup-volatile-filter.ts
/**
* Paths that are known to change during a live backup and commonly trigger
* tar EOF errors. These files are actively appended to (logs, sockets, pid
* markers) while `tar.c()` is reading them, which races with the size recorded
* at `lstat()` time.
*
* Skipping them is safe: they are either recreated on startup, are transient
* by nature, or have durable equivalents elsewhere in state. Snapshotting a
* partial tail of a live log has no restoration value.
*/
const STATE_TRANSIENT_EXTENSIONS = /* @__PURE__ */ new Set([
	".sock",
	".pid",
	".tmp"
]);
function normalizePosix(input) {
	if (!input) return input;
	return path.posix.normalize(input.replaceAll("\\", "/"));
}
function isUnder(childPosix, parentPosix) {
	if (!parentPosix) return false;
	const p = parentPosix.endsWith("/") ? parentPosix : `${parentPosix}/`;
	return childPosix === parentPosix || childPosix.startsWith(p);
}
function hasExtension(filePosix, extensions) {
	const ext = path.posix.extname(filePosix).toLowerCase();
	return extensions.includes(ext);
}
function hasExtensionInSet(filePosix, extensions) {
	return extensions.has(path.posix.extname(filePosix).toLowerCase());
}
function isAgentSessionTranscriptPath(filePosix, stateDirPosix) {
	const agentsRoot = path.posix.join(stateDirPosix, "agents");
	if (!isUnder(filePosix, agentsRoot)) return false;
	const parts = path.posix.relative(agentsRoot, filePosix).split("/").filter(Boolean);
	return parts.length >= 3 && parts[1] === "sessions";
}
function filePathCandidates(input) {
	const normalized = normalizePosix(input);
	if (normalized.startsWith("/") || /^[A-Za-z]:\//u.test(normalized)) return [normalized];
	return [normalized, normalizePosix(`/${normalized}`)];
}
/**
* Returns true if the given absolute path should be skipped during backup
* because it is a live-mutation target.
*
* Rules:
*   - `{stateDir}/sessions/**`/`*.{jsonl,log}` (legacy)
*   - `{stateDir}/agents/<agentId>/sessions/**`/`*.{jsonl,log}`
*   - `{stateDir}/cron/runs/**`/`*.{jsonl,log}`
*   - `{stateDir}/logs/**`/`*.{jsonl,log}`
*   - `{stateDir}/{delivery-queue,session-delivery-queue}/**`/`*.{json,delivered,tmp}`
*   - `{stateDir}/**`/`*.{sock,pid,tmp}`
*/
function isVolatileBackupPath(absolutePath, plan) {
	if (!absolutePath) return false;
	const candidates = filePathCandidates(absolutePath);
	for (const stateDir of plan.stateDirs) {
		if (!stateDir) continue;
		const stateDirPosix = normalizePosix(stateDir);
		for (const filePosix of candidates) {
			if (isUnder(filePosix, path.posix.join(stateDirPosix, "sessions")) && hasExtension(filePosix, [".jsonl", ".log"])) return true;
			if (isAgentSessionTranscriptPath(filePosix, stateDirPosix) && hasExtension(filePosix, [".jsonl", ".log"])) return true;
			if (isUnder(filePosix, path.posix.join(stateDirPosix, "cron", "runs")) && hasExtension(filePosix, [".jsonl", ".log"])) return true;
			if (isUnder(filePosix, path.posix.join(stateDirPosix, "logs")) && hasExtension(filePosix, [".jsonl", ".log"])) return true;
			for (const queueDir of ["delivery-queue", "session-delivery-queue"]) if (isUnder(filePosix, path.posix.join(stateDirPosix, queueDir)) && hasExtension(filePosix, [
				".json",
				".delivered",
				".tmp"
			])) return true;
			if (isUnder(filePosix, stateDirPosix) && hasExtensionInSet(filePosix, STATE_TRANSIENT_EXTENSIONS)) return true;
		}
	}
	return false;
}
//#endregion
//#region src/infra/backup-volatile-stat-cache.ts
const VOLATILE_BACKUP_SYNTHETIC_STAT = {
	isBlockDevice: () => false,
	isCharacterDevice: () => false,
	isDirectory: () => false,
	isFIFO: () => false,
	isFile: () => false,
	isSocket: () => false,
	isSymbolicLink: () => false
};
var BackupVolatileStatCache = class extends Map {
	constructor(volatilePlan) {
		super();
		this.volatilePlan = volatilePlan;
	}
	get(key) {
		const cached = super.get(key);
		if (cached) return cached;
		return isVolatileBackupPath(key, this.volatilePlan) ? VOLATILE_BACKUP_SYNTHETIC_STAT : void 0;
	}
};
function createBackupVolatileStatCache(volatilePlan) {
	return new BackupVolatileStatCache(volatilePlan);
}
//#endregion
//#region src/infra/state-migrations.audit-backup.ts
const LEGACY_AUDIT_LOGICAL_PATHS = [
	{
		directory: "logs",
		basename: "config-audit.jsonl"
	},
	{
		directory: "audit",
		basename: "system-agent.jsonl"
	},
	{
		directory: "audit",
		basename: "crestodian.jsonl"
	}
];
async function hasLegacyAuditBackupSources(stateDir) {
	for (const logical of LEGACY_AUDIT_LOGICAL_PATHS) {
		let entries;
		try {
			entries = await fs$1.readdir(path.join(stateDir, logical.directory));
		} catch (error) {
			if (error.code === "ENOENT") continue;
			throw error;
		}
		const escaped = logical.basename.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
		const sourcePattern = new RegExp(`^(?:${escaped}|\\.${escaped}\\.doctor-importing(?:\\.(?:[2-9]|[1-9][0-9]+))?|${escaped}\\.migrated(?:\\.(?:[2-9]|[1-9][0-9]+))?\\.raw(?:\\.doctor-scrub-(?:progress|restore|staging))?)$`, "u");
		if (entries.some((entry) => sourcePattern.test(entry))) return true;
	}
	return false;
}
function isLegacyAuditMigrationBackupPath(sourcePath, stateDir) {
	const relativePath = path.relative(path.resolve(stateDir), path.resolve(sourcePath));
	if (!relativePath || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) return false;
	const directory = path.dirname(relativePath);
	const basename = path.basename(relativePath);
	for (const logical of LEGACY_AUDIT_LOGICAL_PATHS) {
		if (directory !== logical.directory) continue;
		if (basename === logical.basename) return true;
		const escaped = logical.basename.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
		const claimPattern = new RegExp(`^\\.${escaped}\\.doctor-importing(?:\\.(?:[2-9]|[1-9][0-9]+))?$`, "u");
		const rawPattern = new RegExp(`^${escaped}\\.migrated(?:\\.(?:[2-9]|[1-9][0-9]+))?\\.raw(?:\\.doctor-scrub-(?:progress|restore|staging))?$`, "u");
		if (claimPattern.test(basename) || rawPattern.test(basename)) return true;
	}
	return false;
}
/** Replaces live raw checkpoints with metadata for the transformed backup files. */
function rewriteLegacyAuditBackupCheckpoints(database, snapshots) {
	if (database.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get("diagnostic_events")?.ok !== 1) return;
	const scope = "migration.legacy-audit-raw";
	database.prepare("DELETE FROM diagnostic_events WHERE scope = ?").run(scope);
	const insert = database.prepare(`INSERT INTO diagnostic_events (
        scope, event_key, payload_json, created_at, sequence
      ) VALUES (?, ?, ?, ?, ?)`);
	let sequence = 1;
	for (const snapshot of snapshots) {
		if (!snapshot.checkpoint) continue;
		insert.run(scope, snapshot.checkpoint.key, JSON.stringify(snapshot.checkpoint.value), 0, sequence);
		sequence += 1;
	}
}
async function createLegacyAuditBackupSnapshotsOnce(params) {
	const detected = detectLegacyAuditLogs({
		stateDir: params.stateDir,
		doctorOnlyStateMigrations: true
	});
	if (detected.sources.length === 0) return [];
	const root$1 = await root(params.stateDir, {
		hardlinks: "reject",
		maxBytes: Number.MAX_SAFE_INTEGER,
		mkdir: false,
		mode: 384,
		symlinks: "reject"
	});
	const snapshots = [];
	for (const [index, source] of detected.sources.entries()) {
		const sourceRelativePath = path.relative(path.resolve(params.stateDir), source.sourcePath);
		const snapshot = source.storage === "raw-archive" ? await readLegacyAuditRecoverySourceForBackup(root$1, sourceRelativePath) : await readLegacyAuditSourcePrefixSnapshotForBackup(root$1, sourceRelativePath);
		const sourceGeneration = legacyAuditSourceGenerationKey(sourceRelativePath);
		const previousCheckpoint = source.storage === "raw-archive" ? findPreviousLegacyAuditRawCheckpoint(params.stateDir, sourceRelativePath) : void 0;
		const prepared = prepareLegacyAuditRecords(source, snapshot.raw, sourceGeneration, previousCheckpoint?.recordOrdinalBase ?? 0);
		if (!prepared.ok) throw new Error(`Legacy ${source.label} append archive cannot be sanitized for backup: ${prepared.warnings.join("; ")}`);
		const sourcePath = path.join(params.tempDir, `legacy-audit-raw-${index}.jsonl`);
		await fs$1.writeFile(sourcePath, prepared.sanitizedJsonl, { mode: 384 });
		let checkpoint;
		if (previousCheckpoint) {
			if (previousCheckpoint.recordCount > prepared.records.length) throw new Error(`Legacy ${source.label} append archive is shorter than its durable checkpoint`);
			const transformedPrefix = Buffer.from(serializePreparedAuditRecords(prepared.records.slice(0, previousCheckpoint.recordCount)), "utf8");
			const value = {
				...previousCheckpoint,
				dev: 0,
				ino: 0,
				mtimeMs: 0,
				size: transformedPrefix.length,
				contentHash: createHash("sha256").update(transformedPrefix).digest("hex")
			};
			checkpoint = {
				key: legacyAuditRawCheckpointKey(value),
				value
			};
		}
		snapshots.push({
			sourcePath,
			archiveSourcePath: source.sourcePath,
			...checkpoint ? { checkpoint } : {},
			skippedSourcePaths: /* @__PURE__ */ new Set([
				path.resolve(source.sourcePath),
				path.resolve(`${source.sourcePath}.doctor-scrub-progress`),
				path.resolve(`${source.sourcePath}.doctor-scrub-restore`),
				path.resolve(`${source.sourcePath}.doctor-scrub-staging`)
			])
		});
	}
	return snapshots;
}
async function createLegacyAuditBackupSnapshots(params) {
	let lastError;
	for (let attempt = 0; attempt < 3; attempt += 1) try {
		return await createLegacyAuditBackupSnapshotsOnce(params);
	} catch (error) {
		lastError = error;
		if (attempt < 2) await new Promise((resolve) => {
			setTimeout(resolve, 25);
		});
	}
	throw lastError;
}
//#endregion
//#region src/infra/backup-create.ts
const loadTarRuntime = createLazyRuntimeModule(() => import("tar"));
var BackupLinkCache = class extends Map {
	get(_key) {}
	set(_key, _value) {
		return this;
	}
};
async function resolveOutputPath(params) {
	const basename = buildBackupArchiveBasename(params.nowMs);
	const rawOutput = params.output?.trim();
	if (!rawOutput) {
		const cwd = path.resolve(process.cwd());
		const canonicalCwd = await fs$1.realpath(cwd).catch(() => cwd);
		const defaultDir = params.includedAssets.some((asset) => isPathWithin(canonicalCwd, asset.sourcePath)) ? resolveHomeDir() ?? path.dirname(params.stateDir) : cwd;
		return path.resolve(defaultDir, basename);
	}
	const resolved = resolveUserPath(rawOutput);
	if (rawOutput.endsWith("/") || rawOutput.endsWith("\\")) return path.join(resolved, basename);
	try {
		if ((await fs$1.stat(resolved)).isDirectory()) return path.join(resolved, basename);
	} catch {}
	return resolved;
}
async function assertOutputPathReady(outputPath) {
	try {
		await fs$1.access(outputPath);
		throw new Error(`Refusing to overwrite existing backup archive: ${outputPath}`);
	} catch (err) {
		if (err?.code === "ENOENT") return;
		throw err;
	}
}
function buildTempArchivePath(outputPath) {
	return `${outputPath}.${randomUUID()}.tmp`;
}
async function chooseBackupTempRoot(params) {
	const systemTmp = os.tmpdir();
	const canonicalSystemTmp = await canonicalizePathForContainment(systemTmp);
	if (!params.assets.some((asset) => isPathWithin(canonicalSystemTmp, asset.sourcePath))) return systemTmp;
	const fallback = path.dirname(params.outputPath);
	const canonicalFallback = await canonicalizePathForContainment(fallback);
	const fallbackInsideAsset = params.assets.find((asset) => isPathWithin(canonicalFallback, asset.sourcePath));
	if (fallbackInsideAsset) throw new Error(`Backup temp root cannot be placed outside every source path: ${systemTmp} and ${fallback} both overlap ${fallbackInsideAsset.sourcePath}.`);
	return fallback;
}
function isLinkUnsupportedError(code) {
	return code === "ENOTSUP" || code === "EOPNOTSUPP" || code === "EPERM";
}
async function publishTempArchive(params) {
	try {
		await fs$1.link(params.tempArchivePath, params.outputPath);
	} catch (err) {
		const code = err?.code;
		if (code === "EEXIST") throw new Error(`Refusing to overwrite existing backup archive: ${params.outputPath}`, { cause: err });
		if (!isLinkUnsupportedError(code)) throw err;
		try {
			await fs$1.copyFile(params.tempArchivePath, params.outputPath, constants.COPYFILE_EXCL);
		} catch (copyErr) {
			const copyCode = copyErr?.code;
			if (copyCode !== "EEXIST") await fs$1.rm(params.outputPath, { force: true }).catch(() => void 0);
			if (copyCode === "EEXIST") throw new Error(`Refusing to overwrite existing backup archive: ${params.outputPath}`, { cause: copyErr });
			throw copyErr;
		}
	}
	await fs$1.rm(params.tempArchivePath, { force: true });
}
async function canonicalizePathForContainment(targetPath) {
	const resolved = path.resolve(targetPath);
	const suffix = [];
	let probe = resolved;
	while (true) try {
		const realProbe = await fs$1.realpath(probe);
		return suffix.length === 0 ? realProbe : path.join(realProbe, ...suffix.toReversed());
	} catch {
		const parent = path.dirname(probe);
		if (parent === probe) return resolved;
		suffix.push(path.basename(probe));
		probe = parent;
	}
}
function buildManifest(params) {
	return {
		schemaVersion: 1,
		createdAt: params.createdAt,
		archiveRoot: params.archiveRoot,
		runtimeVersion: resolveRuntimeServiceVersion(),
		platform: process.platform,
		nodeVersion: process.version,
		options: {
			includeWorkspace: params.includeWorkspace,
			onlyConfig: params.onlyConfig
		},
		paths: {
			stateDir: params.stateDir,
			configPath: params.configPath,
			oauthDir: params.oauthDir,
			workspaceDirs: params.workspaceDirs
		},
		assets: params.assets.map((asset) => ({
			kind: asset.kind,
			sourcePath: asset.sourcePath,
			archivePath: asset.archivePath
		})),
		skipped: params.skipped.map((entry) => ({
			kind: entry.kind,
			sourcePath: entry.sourcePath,
			reason: entry.reason,
			coveredBy: entry.coveredBy
		}))
	};
}
function formatBackupCreateSummary(result) {
	const lines = [`Backup archive: ${result.archivePath}`];
	lines.push(`Included ${result.assets.length} path${result.assets.length === 1 ? "" : "s"}:`);
	for (const asset of result.assets) lines.push(`- ${asset.kind}: ${asset.displayPath}`);
	if (result.skipped.length > 0) {
		lines.push(`Skipped ${result.skipped.length} path${result.skipped.length === 1 ? "" : "s"}:`);
		for (const entry of result.skipped) if (entry.reason === "covered" && entry.coveredBy) lines.push(`- ${entry.kind}: ${entry.displayPath} (${entry.reason} by ${entry.coveredBy})`);
		else lines.push(`- ${entry.kind}: ${entry.displayPath} (${entry.reason})`);
	}
	if (result.dryRun) lines.push("Dry run only; archive was not written.");
	else {
		lines.push(`Created ${result.archivePath}`);
		if (result.skippedVolatileCount > 0) lines.push(`Skipped ${result.skippedVolatileCount} volatile file${result.skippedVolatileCount === 1 ? "" : "s"} (live sessions, cron logs, queues, sockets, pid/tmp).`);
		if (result.verified) lines.push("Archive verification: passed");
	}
	return lines;
}
function remapArchiveEntryPath(params) {
	const normalizedEntry = path.resolve(params.entryPath);
	if (normalizedEntry === params.manifestPath) return path.posix.join(params.archiveRoot, "manifest.json");
	const remappedSourcePath = params.sourcePathRemaps?.get(normalizedEntry);
	if (remappedSourcePath) return buildBackupArchivePath(params.archiveRoot, remappedSourcePath);
	return buildBackupArchivePath(params.archiveRoot, normalizedEntry);
}
function normalizeBackupFilterPath(value) {
	return value.replaceAll("\\", "/").replace(/\/+$/u, "");
}
const REINSTALLABLE_STATE_ROOTS = /* @__PURE__ */ new Set([
	"dev",
	"git",
	"npm",
	"npm-runtime",
	"tools"
]);
function buildStateBackupFilter(stateDir, preservedStatePaths = []) {
	const statePrefix = `${normalizeBackupFilterPath(stateDir)}/`;
	const resolvedPreservedPaths = preservedStatePaths.map((entry) => path.resolve(entry));
	return (filePath) => {
		const normalizedFilePath = normalizeBackupFilterPath(filePath);
		if (!normalizedFilePath.startsWith(statePrefix)) return true;
		const segments = normalizedFilePath.slice(statePrefix.length).split("/");
		if (REINSTALLABLE_STATE_ROOTS.has(segments[0] ?? "")) {
			const resolvedFilePath = path.resolve(filePath);
			return resolvedPreservedPaths.some((preservedPath) => isPathWithin(resolvedFilePath, preservedPath) || isPathWithin(preservedPath, resolvedFilePath));
		}
		return segments[0] !== "extensions" || !segments.includes("node_modules");
	};
}
const SQLITE_BACKUP_SOURCE_SUFFIXES = [
	"",
	"-wal",
	"-shm",
	"-journal"
];
const SQLITE_BACKUP_EXCLUDED_SUFFIXES = [".reindex-lock.sqlite"];
const SQLITE_BACKUP_REINDEX_TRANSIENT_PATTERN = /\.sqlite\.(?:backup|memory-reindex|tmp)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;
function isCanonicalAgentSqlitePathOrAncestor(sourcePath, stateDir) {
	const segments = path.relative(path.resolve(stateDir), path.resolve(sourcePath)).split(path.sep);
	if (segments[0] !== "agents" || !segments[1]) return false;
	if (segments.length === 2) return true;
	if (segments[2] !== "agent") return false;
	if (segments.length === 3) return true;
	if (segments.length !== 4) return false;
	return SQLITE_BACKUP_SOURCE_SUFFIXES.some((suffix) => segments[3] === `openclaw-agent.sqlite${suffix}`);
}
function isCanonicalAgentSqliteDatabasePath(sourcePath, stateDir) {
	const segments = path.relative(path.resolve(stateDir), path.resolve(sourcePath)).split(path.sep);
	return segments.length === 4 && segments[0] === "agents" && Boolean(segments[1]) && segments[2] === "agent" && segments[3] === "openclaw-agent.sqlite";
}
function isStatePackageContentPath(sourcePath, stateDir) {
	const resolvedStateDir = path.resolve(stateDir);
	const resolvedSourcePath = path.resolve(sourcePath);
	return isPathWithin(resolvedSourcePath, resolvedStateDir) && !isCanonicalAgentSqlitePathOrAncestor(resolvedSourcePath, resolvedStateDir) && path.relative(resolvedStateDir, resolvedSourcePath).split(path.sep).includes("node_modules");
}
function resolveSqliteBackupDatabasePath(sourcePath) {
	for (const suffix of SQLITE_BACKUP_SOURCE_SUFFIXES.slice(1)) if (sourcePath.endsWith(suffix)) {
		const databasePath = sourcePath.slice(0, -suffix.length);
		return databasePath.endsWith(".sqlite") ? databasePath : void 0;
	}
	return sourcePath.endsWith(".sqlite") ? sourcePath : void 0;
}
function resolveSqliteBackupBasePath(sourcePath) {
	for (const suffix of SQLITE_BACKUP_SOURCE_SUFFIXES.slice(1)) if (sourcePath.endsWith(suffix)) return sourcePath.slice(0, -suffix.length);
	return sourcePath;
}
function classifyStateSqliteBackupSourcePath(sourcePath, stateDir) {
	const resolvedSourcePath = path.resolve(sourcePath);
	if (!isPathWithin(resolvedSourcePath, stateDir)) return;
	if (isStatePackageContentPath(resolvedSourcePath, stateDir)) return;
	if (SQLITE_BACKUP_REINDEX_TRANSIENT_PATTERN.test(resolveSqliteBackupBasePath(resolvedSourcePath))) return "excluded";
	const databasePath = resolveSqliteBackupDatabasePath(resolvedSourcePath);
	if (!databasePath) return;
	return SQLITE_BACKUP_EXCLUDED_SUFFIXES.some((suffix) => databasePath.endsWith(suffix)) ? "excluded" : "sqlite";
}
function isBackupTarFilterFile(entry) {
	return "isFile" in entry ? entry.isFile() : entry.type === "File";
}
async function listStateSqlitePaths(params) {
	const snapshotPaths = /* @__PURE__ */ new Set();
	const discoveredSourcePaths = /* @__PURE__ */ new Set();
	const stateFilter = buildStateBackupFilter(params.stateDir, params.preservedStatePaths);
	async function visit(dir) {
		let entries;
		try {
			entries = await fs$1.readdir(dir, { withFileTypes: true });
		} catch {
			return;
		}
		for (const entry of entries) {
			const entryPath = path.join(dir, entry.name);
			if (entry.isSymbolicLink()) {
				if (isCanonicalAgentSqliteDatabasePath(entryPath, params.stateDir)) {
					let targetEntry;
					try {
						targetEntry = await fs$1.stat(entryPath);
					} catch (err) {
						throw new Error(`Canonical agent SQLite symlink cannot be snapshotted: ${entryPath}`, { cause: err });
					}
					if (!targetEntry.isFile()) throw new Error(`Canonical agent SQLite symlink must resolve to a regular file: ${entryPath}`);
					const resolvedEntryPath = path.resolve(entryPath);
					snapshotPaths.add(resolvedEntryPath);
					discoveredSourcePaths.add(resolvedEntryPath);
				}
				continue;
			}
			if (entry.isDirectory()) {
				if (stateFilter(entryPath) && !isStatePackageContentPath(entryPath, params.stateDir)) await visit(entryPath);
			} else if (entry.isFile() && stateFilter(entryPath) && !isStatePackageContentPath(entryPath, params.stateDir)) {
				const resolvedEntryPath = path.resolve(entryPath);
				if (resolveSqliteBackupDatabasePath(resolvedEntryPath)) discoveredSourcePaths.add(resolvedEntryPath);
				if (entry.name.endsWith(".sqlite") && !SQLITE_BACKUP_EXCLUDED_SUFFIXES.some((suffix) => entry.name.endsWith(suffix))) snapshotPaths.add(resolvedEntryPath);
			}
		}
	}
	await visit(params.stateDir);
	const globalStateSqlitePath = path.resolve(params.globalStateSqlitePath);
	let globalStateEntry;
	try {
		globalStateEntry = await fs$1.lstat(globalStateSqlitePath);
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}
	if (globalStateEntry?.isFile()) {
		snapshotPaths.add(globalStateSqlitePath);
		discoveredSourcePaths.add(globalStateSqlitePath);
	} else if (globalStateEntry?.isSymbolicLink()) {
		let targetEntry;
		try {
			targetEntry = await fs$1.stat(globalStateSqlitePath);
		} catch (err) {
			throw new Error(`Canonical global SQLite symlink cannot be snapshotted: ${globalStateSqlitePath}`, { cause: err });
		}
		if (!targetEntry.isFile()) throw new Error(`Canonical global SQLite symlink must resolve to a regular file: ${globalStateSqlitePath}`);
		snapshotPaths.add(globalStateSqlitePath);
		discoveredSourcePaths.add(globalStateSqlitePath);
	} else if (globalStateEntry) throw new Error(`Canonical global SQLite path must be a regular file or symlink to one: ${globalStateSqlitePath}`);
	return {
		snapshotPaths: [...snapshotPaths].toSorted((left, right) => left.localeCompare(right)),
		discoveredSourcePaths
	};
}
async function createStateSqliteBackupPlan(params) {
	const globalStateSqlitePath = path.resolve(resolveOpenClawStateSqlitePath({
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	}));
	const discovery = await listStateSqlitePaths({
		stateDir: params.stateDir,
		globalStateSqlitePath,
		preservedStatePaths: params.preservedStatePaths
	});
	const globalStateIdentity = await fs$1.stat(globalStateSqlitePath).catch((error) => {
		if (error.code === "ENOENT") return;
		throw error;
	});
	const canonicalGlobalSourcePath = globalStateIdentity ? await fs$1.realpath(globalStateSqlitePath) : globalStateSqlitePath;
	const canonicalAgentSources = await Promise.all(discovery.snapshotPaths.filter((sourcePath) => isCanonicalAgentSqliteDatabasePath(sourcePath, params.stateDir)).map(async (sourcePath) => ({
		identity: await fs$1.stat(sourcePath),
		sourcePath: await fs$1.realpath(sourcePath)
	})));
	const snapshots = [];
	for (const archiveSourcePath of discovery.snapshotPaths) {
		const archiveSourceIdentity = await fs$1.stat(archiveSourcePath);
		const isGlobalStateDatabase = globalStateIdentity !== void 0 && sameFileIdentity(globalStateIdentity, archiveSourceIdentity);
		const canonicalAgentSource = canonicalAgentSources.find((source) => sameFileIdentity(source.identity, archiveSourceIdentity));
		const sourceDatabasePath = isGlobalStateDatabase ? canonicalGlobalSourcePath : canonicalAgentSource?.sourcePath ?? archiveSourcePath;
		const sourcePath = path.join(params.tempDir, `openclaw-state-db-${snapshots.length}.sqlite`);
		try {
			await createVerifiedSqliteSnapshot({
				sourcePath: sourceDatabasePath,
				targetPath: sourcePath,
				transform: isGlobalStateDatabase ? (database) => {
					sanitizeOpenClawGlobalStateSnapshot(database);
					rewriteLegacyAuditBackupCheckpoints(database, params.legacyAuditSnapshots);
				} : canonicalAgentSource ? sanitizeOpenClawStateLeaseRows : void 0
			});
		} catch (err) {
			throw new Error(`SQLite database cannot be compacted safely for backup: ${archiveSourcePath}. ${formatErrorMessage(err)}. The source must pass full integrity checks and VACUUM INTO with its required SQLite capabilities; raw page backup was refused because it can retain deleted data.`, { cause: err });
		}
		snapshots.push({
			sourcePath,
			archiveSourcePath,
			skippedSourcePaths: new Set([archiveSourcePath, sourceDatabasePath].flatMap((databasePath) => SQLITE_BACKUP_SOURCE_SUFFIXES.map((suffix) => path.resolve(`${databasePath}${suffix}`))))
		});
	}
	return {
		snapshots,
		discoveredSourcePaths: discovery.discoveredSourcePaths
	};
}
async function createBackupArchive(opts = {}) {
	const nowMs = resolveDateTimestampMs(opts.nowMs);
	const archiveRoot = buildBackupArchiveRoot(nowMs);
	const onlyConfig = Boolean(opts.onlyConfig);
	const includeWorkspace = onlyConfig ? false : opts.includeWorkspace ?? true;
	const plan = await resolveBackupPlanFromDisk({
		includeWorkspace,
		onlyConfig,
		nowMs
	});
	const outputPath = await resolveOutputPath({
		output: opts.output,
		nowMs,
		includedAssets: plan.included,
		stateDir: plan.stateDir
	});
	if (plan.included.length === 0) throw new Error(onlyConfig ? "No OpenClaw config file was found to back up." : "No local OpenClaw state was found to back up.");
	const canonicalOutputPath = await canonicalizePathForContainment(outputPath);
	const overlappingAsset = plan.included.find((asset) => isPathWithin(canonicalOutputPath, asset.sourcePath));
	if (overlappingAsset) throw new Error(`Backup output must not be written inside a source path: ${outputPath} is inside ${overlappingAsset.sourcePath}`);
	if (!opts.dryRun) await assertOutputPathReady(outputPath);
	const createdAt = new Date(nowMs).toISOString();
	const result = {
		createdAt,
		archiveRoot,
		archivePath: outputPath,
		dryRun: Boolean(opts.dryRun),
		includeWorkspace,
		onlyConfig,
		verified: false,
		assets: plan.included,
		skipped: plan.skipped,
		skippedVolatileCount: 0
	};
	if (opts.dryRun) return result;
	await fs$1.mkdir(path.dirname(outputPath), { recursive: true });
	const tempRoot = await chooseBackupTempRoot({
		assets: result.assets,
		outputPath
	});
	await fs$1.mkdir(tempRoot, { recursive: true });
	const tempDir = await fs$1.mkdtemp(path.join(tempRoot, "openclaw-backup-"));
	const manifestPath = path.join(tempDir, "manifest.json");
	const tempArchivePath = buildTempArchivePath(outputPath);
	const tempArchiveCleanupPaths = resolveBackupTarAttemptTempPaths(tempArchivePath);
	const stateAsset = result.assets.find((asset) => asset.kind === "state");
	const preservedStatePaths = [
		plan.configPath,
		plan.oauthDir,
		...plan.skipped.filter((asset) => asset.kind === "workspace" && asset.reason === "covered").map((asset) => asset.sourcePath)
	].filter((entry) => stateAsset && isPathWithin(entry, stateAsset.sourcePath));
	try {
		const hasLegacyAuditSources = stateAsset ? await hasLegacyAuditBackupSources(stateAsset.sourcePath) : false;
		const createSnapshotPlans = async () => {
			const legacyAuditSnapshots = stateAsset && hasLegacyAuditSources ? await createLegacyAuditBackupSnapshots({
				stateDir: stateAsset.sourcePath,
				tempDir
			}) : [];
			return {
				legacyAuditSnapshots,
				stateSqliteBackup: stateAsset ? await createStateSqliteBackupPlan({
					stateDir: stateAsset.sourcePath,
					tempDir,
					preservedStatePaths,
					legacyAuditSnapshots
				}) : {
					snapshots: [],
					discoveredSourcePaths: /* @__PURE__ */ new Set()
				}
			};
		};
		const { legacyAuditSnapshots, stateSqliteBackup } = stateAsset && hasLegacyAuditSources ? await withLegacyAuditMigrationLease(stateAsset.sourcePath, createSnapshotPlans) : await createSnapshotPlans();
		const sourcePathRemaps = /* @__PURE__ */ new Map();
		const skippedStateSourcePaths = /* @__PURE__ */ new Set();
		for (const snapshot of stateSqliteBackup.snapshots) {
			sourcePathRemaps.set(path.resolve(snapshot.sourcePath), snapshot.archiveSourcePath);
			for (const skippedSourcePath of snapshot.skippedSourcePaths) skippedStateSourcePaths.add(skippedSourcePath);
		}
		for (const snapshot of legacyAuditSnapshots) {
			sourcePathRemaps.set(path.resolve(snapshot.sourcePath), snapshot.archiveSourcePath);
			for (const skippedSourcePath of snapshot.skippedSourcePaths) skippedStateSourcePaths.add(skippedSourcePath);
		}
		await writeJson(manifestPath, buildManifest({
			createdAt,
			archiveRoot,
			includeWorkspace,
			onlyConfig,
			assets: result.assets,
			skipped: result.skipped,
			stateDir: plan.stateDir,
			configPath: plan.configPath,
			oauthDir: plan.oauthDir,
			workspaceDirs: plan.workspaceDirs
		}), { trailingNewline: true });
		const tar = await loadTarRuntime();
		const stateFilter = stateAsset ? buildStateBackupFilter(stateAsset.sourcePath, preservedStatePaths) : void 0;
		const volatilePlan = { stateDirs: [stateAsset?.sourcePath ?? plan.stateDir] };
		let skippedVolatileCount = 0;
		const unexpectedSqliteSourcePaths = [];
		const tarFilter = (entryPath, entryStat) => {
			const resolvedEntryPath = path.resolve(entryPath);
			if (resolvedEntryPath === manifestPath) return true;
			if (stateFilter && !stateFilter(entryPath)) return false;
			if (stateAsset && isLegacyAuditMigrationBackupPath(resolvedEntryPath, stateAsset.sourcePath)) return false;
			const sqliteSourceKind = stateAsset ? classifyStateSqliteBackupSourcePath(resolvedEntryPath, stateAsset.sourcePath) : void 0;
			if (sqliteSourceKind === "excluded") return false;
			if (skippedStateSourcePaths.has(resolvedEntryPath)) return false;
			if (sqliteSourceKind === "sqlite" && stateSqliteBackup.discoveredSourcePaths.has(resolvedEntryPath)) return false;
			if (sqliteSourceKind === "sqlite" && isBackupTarFilterFile(entryStat)) {
				unexpectedSqliteSourcePaths.push(entryPath);
				return false;
			}
			if (isVolatileBackupPath(entryPath, volatilePlan)) {
				skippedVolatileCount += 1;
				return false;
			}
			return true;
		};
		const completedTempArchivePath = await writeTarArchiveWithRetry({
			tempArchivePath,
			log: opts.log,
			runTar: async (attemptTempArchivePath) => {
				skippedVolatileCount = 0;
				unexpectedSqliteSourcePaths.length = 0;
				await writeArchiveStreamToFile({
					archivePath: attemptTempArchivePath,
					archiveStream: tar.c({
						gzip: true,
						portable: true,
						preservePaths: true,
						linkCache: new BackupLinkCache(),
						statCache: createBackupVolatileStatCache(volatilePlan),
						filter: tarFilter,
						onWriteEntry: (entry) => {
							entry.path = remapArchiveEntryPath({
								entryPath: entry.path,
								manifestPath,
								archiveRoot,
								sourcePathRemaps
							});
						}
					}, [
						manifestPath,
						...stateSqliteBackup.snapshots.map((snapshot) => snapshot.sourcePath),
						...legacyAuditSnapshots.map((snapshot) => snapshot.sourcePath),
						...result.assets.map((asset) => asset.sourcePath)
					])
				});
				const unexpectedSqliteSourcePath = unexpectedSqliteSourcePaths[0];
				if (unexpectedSqliteSourcePath) throw new Error(`SQLite state appeared after snapshot discovery: ${unexpectedSqliteSourcePath}. Retry backup so it can be snapshotted.`);
			}
		});
		result.skippedVolatileCount = skippedVolatileCount;
		if (skippedVolatileCount > 0) opts.log?.(`Backup skipped ${skippedVolatileCount} volatile file${skippedVolatileCount === 1 ? "" : "s"} (live sessions, cron logs, queues, sockets, pid/tmp).`);
		await publishTempArchive({
			tempArchivePath: completedTempArchivePath,
			outputPath
		});
	} finally {
		for (const cleanupPath of tempArchiveCleanupPaths) await removeBackupTempArchiveBestEffort(cleanupPath);
		await fs$1.rm(tempDir, {
			recursive: true,
			force: true
		}).catch(() => void 0);
	}
	return result;
}
//#endregion
//#region src/commands/backup.ts
const backupVerifyRuntimeLoader = createLazyImportLoader(() => import("./backup-verify-BogK7jC_.js"));
function loadBackupVerifyRuntime() {
	return backupVerifyRuntimeLoader.load();
}
/** Create a backup archive, optionally verify it, and emit text or JSON output. */
async function backupCreateCommand(runtime, opts = {}) {
	const result = await createBackupArchive({
		...opts,
		log: opts.log ?? (opts.json ? void 0 : (message) => runtime.log(message))
	});
	if (opts.verify && !opts.dryRun) {
		const { backupVerifyCommand } = await loadBackupVerifyRuntime();
		await backupVerifyCommand({
			...runtime,
			log: () => {}
		}, {
			archive: result.archivePath,
			json: false
		});
		result.verified = true;
	}
	if (opts.json) writeRuntimeJson(runtime, result);
	else runtime.log(formatBackupCreateSummary(result).join("\n"));
	return result;
}
//#endregion
export { sanitizeOpenClawGlobalStateSnapshot as n, sanitizeOpenClawStateLeaseRows as r, backupCreateCommand as t };
