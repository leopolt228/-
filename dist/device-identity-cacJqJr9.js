import { p as resolveGatewayLockDir, x as resolveStateDir } from "./paths-CHQRdQZ3.js";
import { $ as executeSqliteQueryTakeFirstSync, O as resolveOpenClawStateSqlitePath, Q as executeSqliteQuerySync, a as openOpenClawStateDatabase, c as runOpenClawStateWriteTransaction, et as getNodeSqliteKysely } from "./openclaw-state-db-DkOMT2fb.js";
import { i as requireNodeSqlite } from "./sqlite-transaction-DCHi8Wi-.js";
import { t as withOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CMHFJdRc.js";
import { d as signEd25519Payload, f as verifyEd25519Signature, i as deriveCanonicalEd25519PublicKeyRaw, l as normalizeEd25519PublicKeyBase64Url, r as deriveCanonicalEd25519PrivateKeyRaw, u as publicKeyRawBase64UrlFromEd25519Pem } from "./ed25519-signature-C0USCjHD.js";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/device-identity-coordinator.ts
const DEFAULT_BUSY_TIMEOUT_MS = 5e3;
var DeviceIdentityCoordinatorError = class extends Error {
	constructor(message, cause) {
		super(message);
		this.cause = cause;
		this.name = "DeviceIdentityCoordinatorError";
	}
};
function canonicalizeDatabasePath(databasePath) {
	const resolved = path.resolve(databasePath);
	try {
		return fs.realpathSync.native(resolved);
	} catch {
		const missingSegments = [];
		let current = resolved;
		while (true) {
			const parent = path.dirname(current);
			if (parent === current) return resolved;
			missingSegments.push(path.basename(current));
			current = parent;
			try {
				return path.join(fs.realpathSync.native(current), ...missingSegments.toReversed());
			} catch {}
		}
	}
}
function resolveDeviceIdentityCoordinatorPath(databasePath, lockDir = resolveGatewayLockDir()) {
	const canonicalPath = canonicalizeDatabasePath(databasePath);
	const databaseHash = crypto.createHash("sha256").update(canonicalPath).digest("hex").slice(0, 8);
	return path.join(lockDir, `device-identity.${databaseHash}.lock.sqlite`);
}
function ensurePrivateCoordinatorDirectory(lockDir) {
	let stats;
	try {
		stats = fs.lstatSync(lockDir);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		try {
			fs.mkdirSync(lockDir, { mode: 448 });
		} catch (mkdirError) {
			if (mkdirError.code !== "EEXIST") throw mkdirError;
		}
		stats = fs.lstatSync(lockDir);
	}
	if (stats.isSymbolicLink() || !stats.isDirectory()) throw new DeviceIdentityCoordinatorError("device identity coordinator directory must be a real directory");
	const uid = typeof process.getuid === "function" ? process.getuid() : void 0;
	if (uid !== void 0 && stats.uid !== uid) throw new DeviceIdentityCoordinatorError("device identity coordinator directory belongs to another user");
	if (process.platform !== "win32") {
		fs.chmodSync(lockDir, 448);
		const secured = fs.lstatSync(lockDir);
		if (secured.isSymbolicLink() || !secured.isDirectory() || (secured.mode & 63) !== 0) throw new DeviceIdentityCoordinatorError("device identity coordinator directory permissions are not private");
	}
}
function acquireDeviceIdentityCoordinator(params) {
	const coordinatorPath = resolveDeviceIdentityCoordinatorPath(params.databasePath, params.lockDir);
	ensurePrivateCoordinatorDirectory(path.dirname(coordinatorPath));
	const { DatabaseSync } = requireNodeSqlite();
	const database = new DatabaseSync(coordinatorPath);
	try {
		const timeout = Math.max(0, Math.trunc(params.busyTimeoutMs ?? DEFAULT_BUSY_TIMEOUT_MS));
		database.exec(`PRAGMA busy_timeout = ${timeout}; BEGIN EXCLUSIVE;`);
	} catch (error) {
		try {
			database.close();
		} catch {}
		throw new DeviceIdentityCoordinatorError("device identity migration or creation already owns this state database", error);
	}
	let released = false;
	return { release: () => {
		if (released) return;
		released = true;
		let releaseError;
		try {
			database.exec("ROLLBACK");
		} catch (error) {
			releaseError = error;
		}
		try {
			database.close();
		} catch (error) {
			releaseError ??= error;
		}
		if (releaseError) throw new DeviceIdentityCoordinatorError("failed to release device identity coordinator", releaseError);
	} };
}
//#endregion
//#region src/infra/device-identity-store.ts
const PRIMARY_DEVICE_IDENTITY_KEY = "primary";
var DeviceIdentityStorageError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "DeviceIdentityStorageError";
	}
};
function normalizeIdentityKey(key) {
	const normalized = key ?? "primary";
	if (normalized.length === 0 || normalized !== normalized.trim()) throw new DeviceIdentityStorageError("Device identity key must be a non-empty string without surrounding whitespace.");
	if (normalized.length > 128) throw new DeviceIdentityStorageError("Device identity key exceeds 128 characters.");
	return normalized;
}
function invalidStoredIdentityError(identityKey, cause) {
	return new DeviceIdentityStorageError(`SQLite contains an invalid persisted device identity "${identityKey}". Run "openclaw doctor --fix" before starting the gateway or connecting this client.`, cause === void 0 ? void 0 : { cause });
}
function fingerprintPublicKey(publicKeyPem) {
	const raw = deriveCanonicalEd25519PublicKeyRaw(publicKeyPem);
	return crypto.createHash("sha256").update(raw).digest("hex");
}
/** Generate canonical Ed25519 material before entering a synchronous write transaction. */
function generateStoredDeviceIdentity(now = Date.now()) {
	const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
	const publicKeyPem = publicKey.export({
		type: "spki",
		format: "pem"
	});
	const privateKeyPem = privateKey.export({
		type: "pkcs8",
		format: "pem"
	});
	return {
		deviceId: fingerprintPublicKey(publicKeyPem),
		publicKeyPem,
		privateKeyPem,
		createdAtMs: now
	};
}
function keyPairMatches(publicKeyPem, privateKeyPem) {
	try {
		deriveCanonicalEd25519PublicKeyRaw(publicKeyPem);
		deriveCanonicalEd25519PrivateKeyRaw(privateKeyPem);
		const publicKey = crypto.createPublicKey(publicKeyPem);
		const privateKey = crypto.createPrivateKey(privateKeyPem);
		if (publicKey.asymmetricKeyType !== "ed25519" || privateKey.asymmetricKeyType !== "ed25519") return false;
		const derivedPublicKey = crypto.createPublicKey(privateKeyPem).export({
			type: "spki",
			format: "der"
		});
		const storedPublicKey = publicKey.export({
			type: "spki",
			format: "der"
		});
		return Buffer.from(derivedPublicKey).equals(Buffer.from(storedPublicKey));
	} catch {
		return false;
	}
}
function parseCreatedAtMs(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}
/** Validate persisted key material and return the canonical runtime shape. */
function validateStoredDeviceIdentity(value, identityKey = PRIMARY_DEVICE_IDENTITY_KEY) {
	try {
		if (!value.deviceId || !/^[a-f0-9]{64}$/.test(value.deviceId) || !value.publicKeyPem || !value.privateKeyPem || parseCreatedAtMs(value.createdAtMs) === null || !keyPairMatches(value.publicKeyPem, value.privateKeyPem)) throw invalidStoredIdentityError(identityKey);
		if (fingerprintPublicKey(value.publicKeyPem) !== value.deviceId) throw invalidStoredIdentityError(identityKey);
		return {
			deviceId: value.deviceId,
			publicKeyPem: value.publicKeyPem,
			privateKeyPem: value.privateKeyPem
		};
	} catch (error) {
		if (error instanceof DeviceIdentityStorageError) throw error;
		throw invalidStoredIdentityError(identityKey, error);
	}
}
function rowToStoredIdentity(row, expectedIdentityKey) {
	if (row.identity_key !== expectedIdentityKey || typeof row.device_id !== "string" || typeof row.public_key_pem !== "string" || typeof row.private_key_pem !== "string" || parseCreatedAtMs(row.created_at_ms) === null || parseCreatedAtMs(row.updated_at_ms) === null) throw invalidStoredIdentityError(expectedIdentityKey);
	return {
		deviceId: row.device_id,
		publicKeyPem: row.public_key_pem,
		privateKeyPem: row.private_key_pem,
		createdAtMs: row.created_at_ms
	};
}
function salvageStoredIdentityRow(row, expectedIdentityKey, repairedAtMs) {
	if (row.identity_key !== expectedIdentityKey || typeof row.public_key_pem !== "string" || typeof row.private_key_pem !== "string") return null;
	try {
		const publicKey = crypto.createPublicKey(row.public_key_pem);
		const privateKey = crypto.createPrivateKey(row.private_key_pem);
		if (publicKey.asymmetricKeyType !== "ed25519" || privateKey.asymmetricKeyType !== "ed25519") return null;
		const canonicalPublicKeyPem = publicKey.export({
			type: "spki",
			format: "pem"
		});
		const canonicalPrivateKeyPem = privateKey.export({
			type: "pkcs8",
			format: "pem"
		});
		if (crypto.createPublicKey(canonicalPrivateKeyPem).export({
			type: "spki",
			format: "pem"
		}) !== canonicalPublicKeyPem) return null;
		const createdAtMs = parseCreatedAtMs(row.created_at_ms) ?? parseCreatedAtMs(row.updated_at_ms) ?? repairedAtMs;
		const salvaged = {
			deviceId: fingerprintPublicKey(canonicalPublicKeyPem),
			publicKeyPem: canonicalPublicKeyPem,
			privateKeyPem: canonicalPrivateKeyPem,
			createdAtMs
		};
		validateStoredDeviceIdentity(salvaged, expectedIdentityKey);
		return salvaged;
	} catch {
		return null;
	}
}
function storedIdentityToRow(identityKey, stored, updatedAtMs = stored.createdAtMs) {
	return {
		identity_key: identityKey,
		device_id: stored.deviceId,
		public_key_pem: stored.publicKeyPem,
		private_key_pem: stored.privateKeyPem,
		created_at_ms: stored.createdAtMs,
		updated_at_ms: updatedAtMs
	};
}
function readStoredIdentityRowFromDatabase(database, identityKey) {
	const db = getNodeSqliteKysely(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("device_identities").selectAll().where("identity_key", "=", identityKey)) ?? null;
}
function readStoredIdentityFromDatabase(database, identityKey) {
	const row = readStoredIdentityRowFromDatabase(database, identityKey);
	return row ? rowToStoredIdentity(row, identityKey) : null;
}
/** Resolve the concrete database and row identity used by process caches and diagnostics. */
function resolveDeviceIdentityStore(options = {}) {
	return {
		databasePath: path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env)),
		identityKey: normalizeIdentityKey(options.identityKey)
	};
}
/** Read through the writable shared-state lifecycle, validating any existing row. */
function readStoredDeviceIdentity(options = {}) {
	const resolved = resolveDeviceIdentityStore(options);
	const stored = readStoredIdentityFromDatabase(openOpenClawStateDatabase({
		env: options.env,
		path: resolved.databasePath
	}), resolved.identityKey);
	if (stored) validateStoredDeviceIdentity(stored, resolved.identityKey);
	return stored;
}
/** Read without creating, repairing, chmodding, or joining the writer lifecycle. */
function readStoredDeviceIdentityReadOnly(options = {}) {
	const resolved = resolveDeviceIdentityStore(options);
	try {
		fs.lstatSync(resolved.databasePath);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		return null;
	}
	return withOpenClawStateDatabaseReadOnly((database) => {
		const stored = readStoredIdentityFromDatabase(database, resolved.identityKey);
		if (stored) validateStoredDeviceIdentity(stored, resolved.identityKey);
		return stored;
	}, {
		env: options.env,
		path: resolved.databasePath
	});
}
/** Insert a candidate only when the key is still absent, then return the authoritative row. */
function insertStoredDeviceIdentityIfAbsent(candidate, options = {}) {
	const resolved = resolveDeviceIdentityStore(options);
	validateStoredDeviceIdentity(candidate, resolved.identityKey);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const existing = readStoredIdentityFromDatabase({ db }, resolved.identityKey);
		if (existing) validateStoredDeviceIdentity(existing, resolved.identityKey);
		else executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("device_identities").values(storedIdentityToRow(resolved.identityKey, candidate)).onConflict((conflict) => conflict.column("identity_key").doNothing()));
		const authoritative = readStoredIdentityFromDatabase({ db }, resolved.identityKey);
		if (!authoritative) throw new DeviceIdentityStorageError(`SQLite device identity "${resolved.identityKey}" was not durable after insert.`);
		validateStoredDeviceIdentity(authoritative, resolved.identityKey);
		return authoritative;
	}, {
		env: options.env,
		path: resolved.databasePath
	}, { operationLabel: "device-identity.create" });
}
/** Replace only an invalid authoritative row; preserve a valid concurrent winner. */
function repairInvalidStoredDeviceIdentity(candidate, options = {}) {
	const resolved = resolveDeviceIdentityStore(options);
	validateStoredDeviceIdentity(candidate, resolved.identityKey);
	return runOpenClawStateWriteTransaction(({ db }) => {
		let repaired = false;
		let rotated = false;
		let existingRow = null;
		try {
			existingRow = readStoredIdentityRowFromDatabase({ db }, resolved.identityKey);
			const existing = existingRow ? rowToStoredIdentity(existingRow, resolved.identityKey) : null;
			if (existing) {
				validateStoredDeviceIdentity(existing, resolved.identityKey);
				return {
					identity: existing,
					repaired,
					rotated
				};
			}
		} catch (error) {
			if (!(error instanceof DeviceIdentityStorageError)) throw error;
		}
		if (existingRow) {
			const salvaged = salvageStoredIdentityRow(existingRow, resolved.identityKey, candidate.createdAtMs);
			if (salvaged) {
				executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("device_identities").set({
					device_id: salvaged.deviceId,
					public_key_pem: salvaged.publicKeyPem,
					private_key_pem: salvaged.privateKeyPem,
					created_at_ms: salvaged.createdAtMs,
					updated_at_ms: candidate.createdAtMs
				}).where("identity_key", "=", resolved.identityKey));
				const authoritative = readStoredIdentityFromDatabase({ db }, resolved.identityKey);
				if (!authoritative) throw new DeviceIdentityStorageError(`SQLite device identity "${resolved.identityKey}" was not durable after repair.`);
				validateStoredDeviceIdentity(authoritative, resolved.identityKey);
				return {
					identity: authoritative,
					repaired: true,
					rotated
				};
			}
			executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("device_identities").where("identity_key", "=", resolved.identityKey));
		}
		repaired = true;
		rotated = true;
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("device_identities").values(storedIdentityToRow(resolved.identityKey, candidate)).onConflict((conflict) => conflict.column("identity_key").doNothing()));
		const authoritative = readStoredIdentityFromDatabase({ db }, resolved.identityKey);
		if (!authoritative) throw new DeviceIdentityStorageError(`SQLite device identity "${resolved.identityKey}" was not durable after repair.`);
		validateStoredDeviceIdentity(authoritative, resolved.identityKey);
		return {
			identity: authoritative,
			repaired,
			rotated
		};
	}, {
		env: options.env,
		path: resolved.databasePath
	}, { operationLabel: "device-identity.doctor-repair" });
}
//#endregion
//#region src/infra/device-identity.ts
const LEGACY_DEVICE_IDENTITY_RELATIVE_PATH = path.join("identity", "device.json");
const DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
const NATIVE_CLAIM_SUFFIX = ".native-importing";
var DeviceIdentityMigrationRequiredError = class extends Error {
	constructor(filePath) {
		super(`Legacy device identity exists at ${filePath}. Run "openclaw doctor --fix" before starting the gateway or connecting this client.`);
		this.name = "DeviceIdentityMigrationRequiredError";
	}
};
function toDeviceIdentity(stored) {
	return {
		deviceId: stored.deviceId,
		publicKeyPem: stored.publicKeyPem,
		privateKeyPem: stored.privateKeyPem
	};
}
function pathMayExist(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
function resolveLegacyStateDir(options) {
	if (options.env?.OPENCLAW_STATE_DIR?.trim()) return resolveStateDir(options.env);
	if (options.path) {
		const databaseDir = path.dirname(path.resolve(options.path));
		return path.basename(databaseDir) === "state" ? path.dirname(databaseDir) : databaseDir;
	}
	return resolveStateDir(options.env ?? process.env);
}
/** Exact retired file owned by Doctor migration code. */
function resolveLegacyDeviceIdentityPath(options = {}) {
	return path.join(resolveLegacyStateDir(options), LEGACY_DEVICE_IDENTITY_RELATIVE_PATH);
}
function assertNoPendingLegacyIdentity(options) {
	const { identityKey } = resolveDeviceIdentityStore(options);
	if (identityKey !== "primary") return;
	const legacyPath = resolveLegacyDeviceIdentityPath(options);
	if (pathMayExist(`${legacyPath}${DOCTOR_CLAIM_SUFFIX}`) || pathMayExist(`${legacyPath}${NATIVE_CLAIM_SUFFIX}`) || pathMayExist(legacyPath)) throw new DeviceIdentityMigrationRequiredError(legacyPath);
}
function withDeviceIdentityCoordinator(options, operation) {
	const resolved = resolveDeviceIdentityStore(options);
	const resolvedOptions = {
		...options,
		path: resolved.databasePath,
		identityKey: resolved.identityKey
	};
	const coordinator = acquireDeviceIdentityCoordinator({ databasePath: resolved.databasePath });
	let result;
	try {
		result = operation(resolved, resolvedOptions);
	} catch (operationError) {
		try {
			coordinator.release();
		} catch (releaseError) {
			throw new AggregateError([operationError, releaseError], "device identity operation and coordinator release both failed", { cause: releaseError });
		}
		throw operationError;
	}
	coordinator.release();
	return result;
}
function loadOrCreateDeviceIdentityOwned(options) {
	assertNoPendingLegacyIdentity(options);
	const existing = readStoredDeviceIdentity(options);
	if (existing) return toDeviceIdentity(existing);
	return toDeviceIdentity(insertStoredDeviceIdentityIfAbsent(generateStoredDeviceIdentity(), options));
}
/** Load a valid canonical identity or atomically create its SQLite row. */
function loadOrCreateDeviceIdentity(options = {}) {
	return withDeviceIdentityCoordinator(options, (_resolved, resolvedOptions) => loadOrCreateDeviceIdentityOwned(resolvedOptions));
}
const processDeviceIdentities = /* @__PURE__ */ new Map();
const MAX_PROCESS_DEVICE_IDENTITIES = 32;
/** Keep one authoritative identity stable for the lifetime of a state-dir process. */
function loadOrCreateProcessDeviceIdentity(options = {}) {
	return withDeviceIdentityCoordinator(options, (resolved, resolvedOptions) => {
		assertNoPendingLegacyIdentity(resolvedOptions);
		const cacheKey = `${resolved.databasePath}\0${resolved.identityKey}`;
		const cached = processDeviceIdentities.get(cacheKey);
		if (cached) return cached;
		const identity = loadOrCreateDeviceIdentityOwned(resolvedOptions);
		if (processDeviceIdentities.size >= MAX_PROCESS_DEVICE_IDENTITIES) {
			const oldestKey = processDeviceIdentities.keys().next().value;
			if (oldestKey !== void 0) processDeviceIdentities.delete(oldestKey);
		}
		processDeviceIdentities.set(cacheKey, identity);
		return identity;
	});
}
/** Load a valid persisted identity without creating or mutating SQLite state. */
function loadDeviceIdentityIfPresent(options = {}) {
	return withDeviceIdentityCoordinator(options, (_resolved, resolvedOptions) => {
		assertNoPendingLegacyIdentity(resolvedOptions);
		const stored = readStoredDeviceIdentityReadOnly(resolvedOptions);
		return stored ? toDeviceIdentity(stored) : null;
	});
}
/** Sign a UTF-8 payload with a PEM Ed25519 private key and return base64url bytes. */
function signDevicePayload(privateKeyPem, payload) {
	return signEd25519Payload(privateKeyPem, payload);
}
/** Normalize PEM or raw base64/base64url public keys to canonical raw base64url bytes. */
function normalizeDevicePublicKeyBase64Url(publicKey) {
	return normalizeEd25519PublicKeyBase64Url(publicKey);
}
/** Derive the stable device id from PEM or raw base64/base64url public key material. */
function deriveDeviceIdFromPublicKey(publicKey) {
	try {
		const normalized = normalizeEd25519PublicKeyBase64Url(publicKey);
		if (!normalized) return null;
		const raw = Buffer.from(normalized, "base64url");
		return crypto.createHash("sha256").update(raw).digest("hex");
	} catch {
		return null;
	}
}
/** Export a PEM Ed25519 public key as canonical raw base64url bytes. */
function publicKeyRawBase64UrlFromPem(publicKeyPem) {
	return publicKeyRawBase64UrlFromEd25519Pem(publicKeyPem);
}
/** Verify a UTF-8 payload signature against PEM or raw base64/base64url public key material. */
function verifyDeviceSignature(publicKey, payload, signatureBase64Url) {
	return verifyEd25519Signature({
		publicKey,
		payload,
		signatureBase64Url
	});
}
//#endregion
export { normalizeDevicePublicKeyBase64Url as a, verifyDeviceSignature as c, readStoredDeviceIdentityReadOnly as d, repairInvalidStoredDeviceIdentity as f, acquireDeviceIdentityCoordinator as h, loadOrCreateProcessDeviceIdentity as i, DeviceIdentityStorageError as l, validateStoredDeviceIdentity as m, loadDeviceIdentityIfPresent as n, publicKeyRawBase64UrlFromPem as o, resolveDeviceIdentityStore as p, loadOrCreateDeviceIdentity as r, signDevicePayload as s, deriveDeviceIdFromPublicKey as t, generateStoredDeviceIdentity as u };
