import { t as sameFileIdentity } from "./file-identity-C0fBiekR.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region node_modules/@openclaw/fs-safe/dist/sidecar-lock-reclaim.js
async function readSidecarLockSnapshot(lockPath) {
	try {
		const stat = await fs$1.lstat(lockPath);
		const raw = await fs$1.readFile(lockPath, "utf8");
		try {
			const parsed = JSON.parse(raw);
			return {
				raw,
				payload: parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null,
				stat
			};
		} catch {
			return {
				raw,
				payload: null,
				stat
			};
		}
	} catch (err) {
		if (err.code === "ENOENT") return null;
		throw err;
	}
}
function sidecarLockSnapshotMatches(current, observed) {
	if (observed.stat && current.stat && !sameFileIdentity(observed.stat, current.stat)) return false;
	if (observed.raw !== void 0) return current.raw === observed.raw;
	return observed.stat !== void 0 && current.stat !== void 0;
}
async function removeSidecarLockIfUnchanged(lockPath, observed) {
	const current = await readSidecarLockSnapshot(lockPath);
	if (!current || !observed || !sidecarLockSnapshotMatches(current, observed)) return false;
	await fs$1.rm(lockPath, { force: true }).catch(() => void 0);
	return true;
}
async function sidecarLockSnapshotStillPresent(lockPath, observed) {
	const current = await readSidecarLockSnapshot(lockPath);
	return !!current && !!observed && sidecarLockSnapshotMatches(current, observed);
}
async function sidecarReclaimGuardExists(pathname) {
	try {
		await fs$1.lstat(pathname);
		return true;
	} catch (err) {
		if (err.code === "ENOENT") return false;
		throw err;
	}
}
async function tryAcquireSidecarReclaimGuard(reclaimGuards, reclaimGuardPath) {
	try {
		await fs$1.mkdir(reclaimGuardPath);
		reclaimGuards.add(reclaimGuardPath);
		return true;
	} catch (err) {
		if (err.code === "EEXIST") return false;
		throw err;
	}
}
async function releaseSidecarReclaimGuard(reclaimGuards, reclaimGuardPath) {
	await fs$1.rmdir(reclaimGuardPath);
	reclaimGuards.delete(reclaimGuardPath);
}
async function removeStaleSidecarLockIfAllowed(params) {
	if (!params.shouldRemoveStaleLock || params.snapshot.raw === void 0) return "not-approved";
	if (!await sidecarLockSnapshotStillPresent(params.lockPath, params.snapshot)) return "changed";
	if (!await params.shouldRemoveStaleLock({
		lockPath: params.lockPath,
		normalizedTargetPath: params.normalizedTargetPath,
		raw: params.snapshot.raw,
		payload: params.snapshot.payload
	})) return "not-approved";
	if (!await sidecarLockSnapshotStillPresent(params.lockPath, params.snapshot)) return "changed";
	try {
		await fs$1.rm(params.lockPath);
		return "removed";
	} catch (err) {
		if (err.code === "ENOENT") return "changed";
		throw err;
	}
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/sidecar-lock.js
const GLOBAL_STATE_KEY = Symbol.for("fsSafe.sidecarLockManagers");
function getGlobalManagers() {
	const globalWithState = globalThis;
	if (!globalWithState[GLOBAL_STATE_KEY]) globalWithState[GLOBAL_STATE_KEY] = /* @__PURE__ */ new Map();
	return globalWithState[GLOBAL_STATE_KEY];
}
function resolveManagerState(key) {
	const managers = getGlobalManagers();
	let state = managers.get(key);
	if (!state) {
		state = {
			cleanupRegistered: false,
			held: /* @__PURE__ */ new Map(),
			reclaimCleanupRegistered: false,
			reclaimGuards: /* @__PURE__ */ new Set()
		};
		managers.set(key, state);
	} else {
		state.reclaimCleanupRegistered ??= false;
		state.reclaimGuards ??= /* @__PURE__ */ new Set();
	}
	return state;
}
function snapshotMatchesSync(lockPath, observed) {
	try {
		const stat = fs.lstatSync(lockPath);
		if (observed.stat && !sameFileIdentity(observed.stat, stat)) return false;
		return observed.raw === void 0 || fs.readFileSync(lockPath, "utf8") === observed.raw;
	} catch {
		return false;
	}
}
async function resolveNormalizedTargetPath(targetPath) {
	const resolved = path.resolve(targetPath);
	const dir = path.dirname(resolved);
	await fs$1.mkdir(dir, { recursive: true });
	try {
		return path.join(await fs$1.realpath(dir), path.basename(resolved));
	} catch {
		return resolved;
	}
}
function computeDelayMs(retry, attempt) {
	const minTimeout = retry.minTimeout ?? 50;
	const maxTimeout = retry.maxTimeout ?? 1e3;
	const factor = retry.factor ?? 1;
	const base = Math.min(maxTimeout, Math.max(minTimeout, minTimeout * factor ** attempt));
	const jitter = retry.randomize ? 1 + Math.random() : 1;
	return Math.min(maxTimeout, Math.round(base * jitter));
}
async function defaultShouldReclaim(params) {
	const createdAt = typeof params.payload?.createdAt === "string" ? params.payload.createdAt : "";
	const createdAtMs = Date.parse(createdAt);
	if (Number.isFinite(createdAtMs) && params.nowMs - createdAtMs > params.staleMs) return true;
	try {
		const stat = await fs$1.stat(params.lockPath);
		return params.nowMs - stat.mtimeMs > params.staleMs;
	} catch {
		return true;
	}
}
function releaseAllReclaimGuardsSync(state) {
	for (const reclaimGuardPath of state.reclaimGuards) try {
		fs.rmdirSync(reclaimGuardPath);
		state.reclaimGuards.delete(reclaimGuardPath);
	} catch {}
}
function releaseAllLocksSync(state) {
	for (const [normalizedTargetPath, held] of state.held) {
		held.handle.close().catch(() => void 0);
		try {
			if (snapshotMatchesSync(held.lockPath, held.snapshot)) fs.rmSync(held.lockPath, { force: true });
		} catch {}
		state.held.delete(normalizedTargetPath);
	}
	releaseAllReclaimGuardsSync(state);
}
async function releaseHeldLock(state, normalizedTargetPath, held, opts = {}) {
	if (state.held.get(normalizedTargetPath) !== held) return false;
	if (opts.force) held.count = 0;
	else {
		held.count -= 1;
		if (held.count > 0) return false;
	}
	if (held.releasePromise) {
		await held.releasePromise.catch(() => void 0);
		return true;
	}
	state.held.delete(normalizedTargetPath);
	held.releasePromise = (async () => {
		await held.handle.close().catch(() => void 0);
		await removeSidecarLockIfUnchanged(held.lockPath, held.snapshot);
	})();
	try {
		await held.releasePromise;
		return true;
	} finally {
		held.releasePromise = void 0;
	}
}
function createSidecarLockManager(key) {
	const state = resolveManagerState(key);
	function ensureExitCleanupRegistered() {
		if (!state.cleanupRegistered) {
			state.cleanupRegistered = true;
			state.reclaimCleanupRegistered = true;
			process.on("exit", () => releaseAllLocksSync(state));
			return;
		}
		if (!state.reclaimCleanupRegistered) {
			state.reclaimCleanupRegistered = true;
			process.on("exit", () => releaseAllReclaimGuardsSync(state));
		}
	}
	async function acquire(options) {
		ensureExitCleanupRegistered();
		const normalizedTargetPath = await resolveNormalizedTargetPath(options.targetPath);
		const lockPath = options.lockPath ?? `${normalizedTargetPath}.lock`;
		const held = state.held.get(normalizedTargetPath);
		if (held && options.allowReentrant) {
			held.count += 1;
			const release = () => releaseHeldLock(state, normalizedTargetPath, held).then(() => void 0);
			return {
				lockPath,
				normalizedTargetPath,
				release,
				[Symbol.asyncDispose]: release
			};
		}
		const startedAt = Date.now();
		const retry = options.retry ?? {};
		const maxRetries = options.timeoutMs === Number.POSITIVE_INFINITY ? void 0 : retry.retries;
		const reclaimGuardPath = `${lockPath}.reclaim`;
		let ownsReclaimGuard = false;
		let attempt = 0;
		const waitForRetry = async () => {
			const elapsed = Date.now() - startedAt;
			if (options.timeoutMs !== void 0 && options.timeoutMs !== Number.POSITIVE_INFINITY && elapsed >= options.timeoutMs || maxRetries !== void 0 && attempt >= maxRetries) throw Object.assign(/* @__PURE__ */ new Error(`file lock timeout for ${normalizedTargetPath}`), {
				code: "file_lock_timeout",
				lockPath,
				normalizedTargetPath
			});
			const remaining = options.timeoutMs === void 0 || options.timeoutMs === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : Math.max(0, options.timeoutMs - elapsed);
			const delay = Math.min(computeDelayMs(retry, attempt), remaining);
			attempt += 1;
			await new Promise((resolve) => setTimeout(resolve, delay));
		};
		try {
			while (true) {
				if (!ownsReclaimGuard && await sidecarReclaimGuardExists(reclaimGuardPath)) {
					await waitForRetry();
					continue;
				}
				let handle = null;
				try {
					handle = await fs$1.open(lockPath, "wx");
					const payload = await options.payload();
					const raw = `${JSON.stringify(payload, null, 2)}\n`;
					await handle.writeFile(raw, "utf8");
					const snapshot = {
						raw,
						payload,
						stat: await handle.stat()
					};
					const createdHeld = {
						count: 1,
						handle,
						lockPath,
						snapshot,
						acquiredAt: Date.now(),
						metadata: options.metadata ?? {}
					};
					state.held.set(normalizedTargetPath, createdHeld);
					if (ownsReclaimGuard) try {
						await releaseSidecarReclaimGuard(state.reclaimGuards, reclaimGuardPath);
						ownsReclaimGuard = false;
					} catch (err) {
						await releaseHeldLock(state, normalizedTargetPath, createdHeld, { force: true });
						throw err;
					}
					const release = () => releaseHeldLock(state, normalizedTargetPath, createdHeld).then(() => void 0);
					return {
						lockPath,
						normalizedTargetPath,
						release,
						[Symbol.asyncDispose]: release
					};
				} catch (err) {
					if (handle) {
						const failedSnapshot = { payload: null };
						try {
							failedSnapshot.stat = await handle.stat();
						} catch {}
						if (state.held.get(normalizedTargetPath)?.handle === handle) state.held.delete(normalizedTargetPath);
						await fs$1.rm(lockPath, { force: true }).catch(() => void 0);
						await handle.close().catch(() => void 0);
						await removeSidecarLockIfUnchanged(lockPath, failedSnapshot);
					}
					if (err.code !== "EEXIST") throw err;
					if (ownsReclaimGuard) {
						await releaseSidecarReclaimGuard(state.reclaimGuards, reclaimGuardPath);
						ownsReclaimGuard = false;
						continue;
					}
					const nowMs = Date.now();
					const snapshot = await readSidecarLockSnapshot(lockPath);
					if (!snapshot) continue;
					if (await (options.shouldReclaim ?? defaultShouldReclaim)({
						lockPath,
						normalizedTargetPath,
						payload: snapshot?.payload ?? null,
						staleMs: options.staleMs,
						nowMs,
						heldByThisProcess: state.held.has(normalizedTargetPath)
					})) {
						if (!await sidecarLockSnapshotStillPresent(lockPath, snapshot)) continue;
						if ((options.staleRecovery ?? "fail-closed") === "remove-if-unchanged") {
							if (!await tryAcquireSidecarReclaimGuard(state.reclaimGuards, reclaimGuardPath)) {
								await waitForRetry();
								continue;
							}
							ownsReclaimGuard = true;
							const removal = await removeStaleSidecarLockIfAllowed({
								lockPath,
								normalizedTargetPath,
								snapshot,
								shouldRemoveStaleLock: options.shouldRemoveStaleLock
							});
							if (removal === "removed" || removal === "changed") continue;
							await releaseSidecarReclaimGuard(state.reclaimGuards, reclaimGuardPath);
							ownsReclaimGuard = false;
						}
						throw Object.assign(/* @__PURE__ */ new Error(`file lock stale for ${normalizedTargetPath}`), {
							code: "file_lock_stale",
							lockPath,
							normalizedTargetPath
						});
					}
					await waitForRetry();
				}
			}
		} finally {
			if (ownsReclaimGuard) await releaseSidecarReclaimGuard(state.reclaimGuards, reclaimGuardPath).catch(() => void 0);
		}
	}
	async function withLock(options, fn) {
		const lock = await acquire(options);
		try {
			return await fn();
		} finally {
			await lock.release();
		}
	}
	async function drain() {
		for (const [normalizedTargetPath, held] of Array.from(state.held.entries())) await releaseHeldLock(state, normalizedTargetPath, held, { force: true }).catch(() => void 0);
	}
	function reset() {
		releaseAllLocksSync(state);
	}
	function heldEntries() {
		return Array.from(state.held.entries()).map(([normalizedTargetPath, held]) => ({
			normalizedTargetPath,
			lockPath: held.lockPath,
			acquiredAt: held.acquiredAt,
			metadata: held.metadata,
			forceRelease: () => releaseHeldLock(state, normalizedTargetPath, held, { force: true })
		}));
	}
	return {
		acquire,
		withLock,
		drain,
		reset,
		heldEntries
	};
}
async function withSidecarLock(targetPath, options, fn) {
	const manager = createSidecarLockManager(options.managerKey ?? `fs-safe.sidecar-lock:${targetPath}`);
	const { managerKey: _managerKey, ...acquireOptions } = options;
	return await manager.withLock({
		...acquireOptions,
		targetPath
	}, fn);
}
//#endregion
export { withSidecarLock as n, createSidecarLockManager as t };
