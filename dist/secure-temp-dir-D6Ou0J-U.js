import { r as getFsSafePythonConfig, t as canFallbackFromPythonError } from "./pinned-python-config-D-nZR8l7.js";
import { C as FsSafeError, i as isPathInside, m as assertNoUnsafeDeviceReadPath, n as hasNodeErrorCode, r as isNotFoundPathError, s as isSymlinkOpenError, t as assertNoNulPathInput } from "./path-DILYn_gk.js";
import { r as readFileHandleBounded } from "./bounded-read-xOtI_QIE.js";
import { t as sameFileIdentity } from "./file-identity-C0fBiekR.js";
import { a as withAsyncDirectoryGuards, c as createAsyncDirectoryGuard, l as createNearestExistingDirectoryGuard, o as assertAsyncDirectoryGuard } from "./guarded-mutation-C9yfXO_j.js";
import { a as runPinnedPythonOperation, c as syncDirectoryBestEffort, i as getFsSafeTestHooks, l as expandHomePrefix, o as validatePinnedOperationPayload, r as runPinnedWriteWithRenamePolicy, s as mkdirPathComponentsWithGuards, t as runPinnedCopyHelper } from "./pinned-write-LKmJLX8O.js";
import { r as resolveRootPath, t as ROOT_PATH_ALIAS_POLICIES } from "./root-path-D-mKQHrm.js";
import { t as stringifyJsonDocument } from "./json-stringify-DYDqVIo7.js";
import { n as registerTempPathForExit, t as serializePathWrite } from "./write-queue-BcabxPkk.js";
import { randomUUID } from "node:crypto";
import fs, { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os, { tmpdir } from "node:os";
import { pipeline } from "node:stream/promises";
import { Transform } from "node:stream";
//#region node_modules/@openclaw/fs-safe/dist/bounded-read-stream.js
function createMaxBytesTransform(maxBytes) {
	let bytes = 0;
	return new Transform({ transform(chunk, _encoding, callback) {
		const buffer = chunk instanceof Buffer ? chunk : Buffer.from(chunk);
		bytes += buffer.byteLength;
		if (bytes > maxBytes) {
			callback(new FsSafeError("too-large", `file exceeds limit of ${maxBytes} bytes (got at least ${bytes})`));
			return;
		}
		callback(null, buffer);
	} });
}
function createBoundedReadStream(opened, maxBytes) {
	const stream = opened.handle.createReadStream();
	return maxBytes === void 0 ? stream : stream.pipe(createMaxBytesTransform(maxBytes));
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/deny-mutations.js
async function pathExists(filePath) {
	try {
		await fs$1.lstat(filePath);
		return true;
	} catch (err) {
		if (!isNotFoundPathError(err)) throw err;
		return false;
	}
}
async function resolvePathViaExistingAncestor(targetPath) {
	const normalized = path.resolve(targetPath);
	let cursor = normalized;
	const missingSuffix = [];
	while (path.dirname(cursor) !== cursor && !await pathExists(cursor)) {
		missingSuffix.unshift(path.basename(cursor));
		cursor = path.dirname(cursor);
	}
	if (!await pathExists(cursor)) return normalized;
	try {
		const resolvedAncestor = path.resolve(await fs$1.realpath(cursor));
		return missingSuffix.length === 0 ? resolvedAncestor : path.resolve(resolvedAncestor, ...missingSuffix);
	} catch {
		return normalized;
	}
}
async function comparablePaths(rawPath) {
	assertNoNulPathInput(rawPath, "path contains a NUL byte");
	const resolved = path.resolve(rawPath);
	return /* @__PURE__ */ new Set([resolved, await resolvePathViaExistingAncestor(resolved)]);
}
function isSamePath(left, right) {
	return isPathInside(left, right) && isPathInside(right, left);
}
function hasPolicyEntries(policy) {
	return Boolean(policy?.paths?.length || policy?.prefixes?.length);
}
function policyPathEntries(entries) {
	const paths = [];
	for (const entry of entries ?? []) {
		if (entry.length === 0) throw new FsSafeError("invalid-path", "deny mutation paths must be non-empty");
		assertNoNulPathInput(entry, "deny mutation path contains a NUL byte");
		if (!path.isAbsolute(entry)) throw new FsSafeError("invalid-path", "deny mutation paths must be absolute");
		paths.push(entry);
	}
	return paths;
}
async function assertMutationNotDenied(filePath, policy, options = {}) {
	if (!hasPolicyEntries(policy)) return;
	const targetPaths = await comparablePaths(filePath);
	for (const deniedPath of policyPathEntries(policy.paths)) {
		const deniedPaths = await comparablePaths(deniedPath);
		for (const target of targetPaths) for (const denied of deniedPaths) if (isSamePath(denied, target) || options.protectAncestors === true && isPathInside(target, denied)) throw new FsSafeError("denied-path", "path is denied by denyMutations policy");
	}
	for (const deniedPrefix of policyPathEntries(policy.prefixes)) {
		const deniedPaths = await comparablePaths(deniedPrefix);
		for (const target of targetPaths) for (const denied of deniedPaths) if (isPathInside(denied, target) || options.protectAncestors === true && isPathInside(target, denied)) throw new FsSafeError("denied-path", "path is denied by denyMutations policy");
	}
}
function mergeDenyMutationPolicies(defaultPolicy, callPolicy) {
	if (!defaultPolicy) return callPolicy;
	if (!callPolicy) return defaultPolicy;
	return {
		paths: [...defaultPolicy.paths ?? [], ...callPolicy.paths ?? []],
		prefixes: [...defaultPolicy.prefixes ?? [], ...callPolicy.prefixes ?? []]
	};
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/opened-realpath.js
async function resolveOpenedFileRealPathForHandle(handle, ioPath) {
	const handleStat = await handle.stat();
	const fdCandidates = process.platform === "linux" ? [`/proc/self/fd/${handle.fd}`, `/dev/fd/${handle.fd}`] : process.platform === "win32" ? [] : [`/dev/fd/${handle.fd}`];
	for (const fdPath of fdCandidates) try {
		const fdRealPath = await fs$1.realpath(fdPath);
		if (sameFileIdentity(handleStat, await fs$1.stat(fdRealPath))) return fdRealPath;
	} catch {}
	try {
		const ioRealPath = await fs$1.realpath(ioPath);
		if (sameFileIdentity(handleStat, await fs$1.stat(ioRealPath))) return ioRealPath;
	} catch (err) {
		if (!isNotFoundPathError(err)) throw err;
	}
	const parentResolved = await resolveOpenedFileRealPathFromParent(handleStat, ioPath);
	if (parentResolved) return parentResolved;
	throw new FsSafeError("path-mismatch", "unable to resolve opened file path");
}
async function resolveOpenedFileRealPathFromParent(handleStat, ioPath) {
	let parentReal;
	try {
		parentReal = await fs$1.realpath(path.dirname(ioPath));
	} catch (err) {
		if (isNotFoundPathError(err)) return null;
		throw err;
	}
	let entries;
	try {
		entries = await fs$1.readdir(parentReal);
	} catch (err) {
		if (isNotFoundPathError(err)) return null;
		throw err;
	}
	for (const entry of entries.toSorted()) {
		const candidatePath = path.join(parentReal, entry);
		try {
			const candidateStat = await fs$1.lstat(candidatePath);
			if (candidateStat.isFile() && sameFileIdentity(handleStat, candidateStat)) return await fs$1.realpath(candidatePath);
		} catch (err) {
			if (!isNotFoundPathError(err)) throw err;
		}
	}
	return null;
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/pinned-helper.js
async function runPinnedHelper(operation, rootDir, payload) {
	validatePinnedOperationPayload(payload);
	return await runPinnedPythonOperation({
		operation,
		rootPath: rootDir,
		payload
	});
}
async function helperStat(rootDir, relativePath) {
	return await runPinnedHelper("stat", rootDir, { relativePath });
}
async function helperReaddir(rootDir, relativePath, withFileTypes) {
	return await runPinnedHelper("readdir", rootDir, {
		relativePath,
		withFileTypes
	});
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/pinned-path.js
function isPinnedPathHelperSpawnError(error) {
	return canFallbackFromPythonError(error);
}
async function runPinnedPathHelper(params) {
	try {
		await runPinnedHelper(params.operation, params.rootPath, { relativePath: params.relativePath });
	} catch (error) {
		if (error instanceof FsSafeError) throw error;
		throw new FsSafeError("helper-failed", "pinned path helper failed", { cause: error instanceof Error ? error : void 0 });
	}
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/path-policy.js
const PATH_ALIAS_POLICIES = ROOT_PATH_ALIAS_POLICIES;
async function assertNoPathAliasEscape(params) {
	const resolved = await resolveRootPath({
		absolutePath: params.absolutePath,
		rootPath: params.rootPath,
		boundaryLabel: params.boundaryLabel,
		policy: params.policy
	});
	if (params.policy?.allowFinalSymlinkForUnlink === true && resolved.kind === "symlink") return;
	await assertNoHardlinkedFinalPath({
		filePath: resolved.absolutePath,
		root: resolved.rootPath,
		boundaryLabel: params.boundaryLabel,
		allowFinalHardlinkForUnlink: params.policy?.allowFinalHardlinkForUnlink
	});
}
async function assertNoHardlinkedFinalPath(params) {
	if (params.allowFinalHardlinkForUnlink) return;
	let stat;
	try {
		stat = await fs$1.stat(params.filePath);
	} catch (err) {
		if (isNotFoundPathError(err)) return;
		throw err;
	}
	if (!stat.isFile()) return;
	if (stat.nlink > 1) throw new Error(`Hardlinked path is not allowed under ${params.boundaryLabel} (${shortPath(params.root)}): ${shortPath(params.filePath)}`);
}
function shortPath(value) {
	if (value.startsWith(os.homedir())) return `~${value.slice(os.homedir().length)}`;
	return value;
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/read-opened-file.js
async function readOpenedFileSafely(params) {
	if (params.maxBytes !== void 0 && params.opened.stat.size > params.maxBytes) throw new FsSafeError("too-large", `file exceeds limit of ${params.maxBytes} bytes (got ${params.opened.stat.size})`);
	return {
		buffer: params.maxBytes === void 0 ? await params.opened.handle.readFile() : await readFileHandleBounded(params.opened.handle, params.maxBytes),
		realPath: params.opened.realPath,
		stat: params.opened.stat
	};
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/path-stat.js
function pathStatFromStats(stat) {
	return {
		dev: Number(stat.dev),
		gid: Number(stat.gid),
		ino: Number(stat.ino),
		isDirectory: stat.isDirectory(),
		isFile: stat.isFile(),
		isSymbolicLink: stat.isSymbolicLink(),
		mode: stat.mode,
		mtimeMs: stat.mtimeMs,
		nlink: stat.nlink,
		size: stat.size,
		uid: stat.uid
	};
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/root-context.js
const ensureTrailingSep = (value) => value.endsWith(path.sep) ? value : value + path.sep;
function assertValidRootRelativePath(relativePath) {
	assertNoNulPathInput(relativePath, "relative path contains a NUL byte");
}
let cachedHomePath;
async function expandRelativePathWithHome(relativePath) {
	const rawHome = process.env.HOME || process.env.USERPROFILE || os.homedir();
	if (cachedHomePath?.raw !== rawHome) {
		let realHome = rawHome;
		try {
			realHome = await fs$1.realpath(rawHome);
		} catch {}
		cachedHomePath = {
			raw: rawHome,
			real: realHome
		};
	}
	return expandHomePrefix(relativePath, { home: cachedHomePath.real });
}
async function resolveRootContext(rootDir) {
	assertNoNulPathInput(rootDir, "root dir contains a NUL byte");
	let rootReal;
	try {
		rootReal = await fs$1.realpath(rootDir);
		if (!(await fs$1.stat(rootReal)).isDirectory()) throw new FsSafeError("invalid-path", "root dir is not a directory");
	} catch (err) {
		if (err instanceof FsSafeError) throw err;
		if (isNotFoundPathError(err)) throw new FsSafeError("not-found", "root dir not found");
		throw err;
	}
	return {
		rootDir: path.resolve(rootDir),
		rootReal,
		rootWithSep: ensureTrailingSep(rootReal)
	};
}
async function resolvePathInRoot(root, relativePath) {
	assertValidRootRelativePath(relativePath);
	const expanded = await expandRelativePathWithHome(relativePath);
	const resolved = path.resolve(root.rootWithSep, expanded);
	if (!isPathInside(root.rootWithSep, resolved)) throw new FsSafeError("outside-workspace", "file is outside workspace root");
	return {
		rootReal: root.rootReal,
		rootWithSep: root.rootWithSep,
		resolved
	};
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/root-errors.js
function isAlreadyExistsError(error) {
	return hasNodeErrorCode(error, "EEXIST") || /File exists|EEXIST/i.test(String(error));
}
function normalizePinnedWriteError(error) {
	if (error instanceof FsSafeError) return error;
	return new FsSafeError("invalid-path", "path is not a regular file under root", { cause: error instanceof Error ? error : void 0 });
}
function normalizePinnedPathError(error) {
	if (error instanceof FsSafeError) return error;
	return new FsSafeError("path-alias", "path is not under root", { cause: error instanceof Error ? error : void 0 });
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/root-impl.js
function logWarn(message) {
	if (process.env.FS_SAFE_DEBUG_WARNINGS === "1") console.warn(message);
}
const SUPPORTS_NOFOLLOW = process.platform !== "win32" && "O_NOFOLLOW" in constants;
const NONBLOCK_OPEN_FLAG = "O_NONBLOCK" in constants ? constants.O_NONBLOCK : 0;
const OPEN_READ_FLAGS = constants.O_RDONLY | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
const OPEN_READ_NONBLOCK_FLAGS = OPEN_READ_FLAGS | NONBLOCK_OPEN_FLAG;
const OPEN_READ_FOLLOW_FLAGS = constants.O_RDONLY;
const OPEN_READ_FOLLOW_NONBLOCK_FLAGS = OPEN_READ_FOLLOW_FLAGS | NONBLOCK_OPEN_FLAG;
const OPEN_WRITE_EXISTING_FLAGS = constants.O_WRONLY | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
const OPEN_WRITE_CREATE_FLAGS = constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
const OPEN_APPEND_EXISTING_FLAGS = constants.O_RDWR | constants.O_APPEND | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
const OPEN_APPEND_CREATE_FLAGS = constants.O_RDWR | constants.O_APPEND | constants.O_CREAT | constants.O_EXCL | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
const DEFAULT_ROOT_MAX_BYTES = 16 * 1024 * 1024;
function openResult(params) {
	return {
		handle: params.handle,
		realPath: params.realPath,
		stat: params.stat,
		[Symbol.asyncDispose]: () => params.handle.close().catch(() => void 0)
	};
}
async function openVerifiedLocalFile(filePath, options) {
	assertNoUnsafeDeviceReadPath(filePath);
	const fsSafeTestHooks = getFsSafeTestHooks();
	try {
		if ((await fs$1.lstat(filePath)).isDirectory()) throw new FsSafeError("not-file", "not a file");
		await fsSafeTestHooks?.afterPreOpenLstat?.(filePath);
	} catch (err) {
		if (err instanceof FsSafeError) throw err;
	}
	let handle;
	try {
		const openFlags = options?.symlinks === "follow-within-root" ? options?.nonBlockingRead ? OPEN_READ_FOLLOW_NONBLOCK_FLAGS : OPEN_READ_FOLLOW_FLAGS : options?.nonBlockingRead ? OPEN_READ_NONBLOCK_FLAGS : OPEN_READ_FLAGS;
		await fsSafeTestHooks?.beforeOpen?.(filePath, openFlags);
		handle = await fs$1.open(filePath, openFlags);
		try {
			await fsSafeTestHooks?.afterOpen?.(filePath, handle);
		} catch (err) {
			await handle.close().catch(() => {});
			throw err;
		}
	} catch (err) {
		if (isNotFoundPathError(err)) throw new FsSafeError("not-found", "file not found");
		if (isSymlinkOpenError(err)) throw new FsSafeError("symlink", "symlink open blocked", { cause: err });
		if (hasNodeErrorCode(err, "EISDIR")) throw new FsSafeError("not-file", "not a file");
		throw err;
	}
	try {
		const stat = await handle.stat();
		if (!stat.isFile()) throw new FsSafeError("not-file", "not a file");
		if (options?.hardlinks === "reject" && stat.nlink > 1) throw new FsSafeError("hardlink", "hardlinked path not allowed");
		if (options?.symlinks === "follow-within-root") {
			if (!sameFileIdentity(stat, await fs$1.stat(filePath))) throw new FsSafeError("path-mismatch", "path changed during read");
		} else {
			const pathStat = await fs$1.lstat(filePath);
			if (pathStat.isSymbolicLink()) throw new FsSafeError("symlink", "symlink not allowed");
			if (!sameFileIdentity(stat, pathStat)) throw new FsSafeError("path-mismatch", "path changed during read");
		}
		const realPath = await resolveOpenedFileRealPathForHandle(handle, filePath);
		const realStat = await fs$1.stat(realPath);
		if (options?.hardlinks === "reject" && realStat.nlink > 1) throw new FsSafeError("hardlink", "hardlinked path not allowed");
		if (!sameFileIdentity(stat, realStat)) throw new FsSafeError("path-mismatch", "path mismatch");
		return openResult({
			handle,
			realPath,
			stat
		});
	} catch (err) {
		await handle.close().catch(() => {});
		if (err instanceof FsSafeError) throw err;
		if (isNotFoundPathError(err)) throw new FsSafeError("not-found", "file not found");
		throw err;
	}
}
var RootHandle = class {
	rootDir;
	rootReal;
	rootWithSep;
	defaults;
	constructor(context, defaults = {}) {
		this.rootDir = context.rootDir;
		this.rootReal = context.rootReal;
		this.rootWithSep = context.rootWithSep;
		this.defaults = defaults;
	}
	get context() {
		return {
			rootDir: this.rootDir,
			rootReal: this.rootReal,
			rootWithSep: this.rootWithSep
		};
	}
	async resolve(relativePath) {
		return (await resolvePathInRoot(this.context, relativePath)).resolved;
	}
	async open(relativePath, options = {}) {
		return await openFileInRoot(this.context, {
			relativePath,
			...readDefaults(this.defaults),
			...options
		});
	}
	async read(relativePath, options = {}) {
		return await readFileInRoot(this.context, {
			relativePath,
			...readDefaults(this.defaults),
			...options
		});
	}
	async readBytes(relativePath, options = {}) {
		return (await this.read(relativePath, options)).buffer;
	}
	async readText(relativePath, options = {}) {
		const { encoding = "utf8", ...readOptions } = options;
		return (await this.read(relativePath, readOptions)).buffer.toString(encoding);
	}
	async readJson(relativePath, options = {}) {
		return JSON.parse(await this.readText(relativePath, options));
	}
	async readAbsolute(filePath, options = {}) {
		return await readPathInRoot(this.context, {
			filePath,
			...readDefaults(this.defaults),
			...options
		});
	}
	reader(options = {}) {
		return async (filePath) => {
			return (await this.readAbsolute(filePath, options)).buffer;
		};
	}
	async openWritable(relativePath, options = {}) {
		const writeMode = options.writeMode ?? "replace";
		return await openWritableFileInRoot(this.context, {
			relativePath,
			mkdir: this.defaults.mkdir,
			mode: this.defaults.mode,
			...options,
			denyMutations: mergeDenyMutationPolicies(this.defaults.denyMutations, options.denyMutations),
			append: writeMode === "append",
			truncateExisting: writeMode === "replace"
		});
	}
	async append(relativePath, data, options = {}) {
		await appendFileInRoot(this.context, {
			relativePath,
			data,
			mkdir: this.defaults.mkdir,
			mode: this.defaults.mode,
			...options,
			denyMutations: mergeDenyMutationPolicies(this.defaults.denyMutations, options.denyMutations)
		});
	}
	async remove(relativePath, options = {}) {
		assertValidRootRelativePath(relativePath);
		await removePathInRoot(this.context, {
			relativePath,
			denyMutations: mergeDenyMutationPolicies(this.defaults.denyMutations, options.denyMutations)
		});
	}
	async mkdir(relativePath, options = {}) {
		assertValidRootRelativePath(relativePath);
		await mkdirPathInRoot(this.context, {
			relativePath,
			denyMutations: mergeDenyMutationPolicies(this.defaults.denyMutations, options.denyMutations)
		});
	}
	async ensureRoot(options = {}) {
		await mkdirPathInRoot(this.context, {
			relativePath: "",
			allowRoot: true,
			denyMutations: mergeDenyMutationPolicies(this.defaults.denyMutations, options.denyMutations)
		});
	}
	async write(relativePath, data, options = {}) {
		await writeFileInRoot(this.context, {
			relativePath,
			data,
			mkdir: this.defaults.mkdir,
			mode: this.defaults.mode,
			renameIdentity: this.defaults.renameIdentity,
			...options,
			denyMutations: mergeDenyMutationPolicies(this.defaults.denyMutations, options.denyMutations)
		});
	}
	async create(relativePath, data, options = {}) {
		await writeFileInRoot(this.context, {
			relativePath,
			data,
			mkdir: this.defaults.mkdir,
			mode: this.defaults.mode,
			...options,
			denyMutations: mergeDenyMutationPolicies(this.defaults.denyMutations, options.denyMutations),
			overwrite: false
		});
	}
	async writeJson(relativePath, data, options = {}) {
		const { replacer, space, trailingNewline = true, ...writeOptions } = options;
		const json = stringifyJsonDocument(data, replacer, space);
		await this.write(relativePath, trailingNewline ? `${json}\n` : json, writeOptions);
	}
	async createJson(relativePath, data, options = {}) {
		const { replacer, space, trailingNewline = true, ...writeOptions } = options;
		const json = stringifyJsonDocument(data, replacer, space);
		await this.create(relativePath, trailingNewline ? `${json}\n` : json, writeOptions);
	}
	async copyIn(relativePath, sourcePath, options = {}) {
		assertValidRootRelativePath(relativePath);
		await copyFileInRoot(this.context, {
			sourcePath,
			relativePath,
			maxBytes: this.defaults.maxBytes,
			mkdir: this.defaults.mkdir,
			mode: this.defaults.mode,
			...options,
			denyMutations: mergeDenyMutationPolicies(this.defaults.denyMutations, options.denyMutations)
		});
	}
	async exists(relativePath) {
		try {
			await this.stat(relativePath);
			return true;
		} catch (err) {
			if (err instanceof FsSafeError && err.code === "not-found") return false;
			throw err;
		}
	}
	async stat(relativePath) {
		assertValidRootRelativePath(relativePath);
		try {
			return await helperStat(this.rootReal, relativePath);
		} catch (error) {
			if (canFallbackFromPythonError(error)) return await statPathFallback(this.context, relativePath);
			throw error;
		}
	}
	async list(relativePath, options = {}) {
		assertValidRootRelativePath(relativePath);
		try {
			return options.withFileTypes === true ? await helperReaddir(this.rootReal, relativePath, true) : await helperReaddir(this.rootReal, relativePath, false);
		} catch (error) {
			if (canFallbackFromPythonError(error)) return await listPathFallback(this.context, relativePath, options.withFileTypes === true);
			throw error;
		}
	}
	async move(fromRelative, toRelative, options = {}) {
		assertValidRootRelativePath(fromRelative);
		assertValidRootRelativePath(toRelative);
		const denyMutations = mergeDenyMutationPolicies(this.defaults.denyMutations, options.denyMutations);
		await assertMoveMutationAllowed(this.context, {
			fromRelative,
			toRelative,
			denyMutations
		});
		try {
			await runPinnedHelper("rename", this.rootReal, {
				from: fromRelative,
				overwrite: options.overwrite ?? false,
				to: toRelative
			});
		} catch (error) {
			if (canFallbackFromPythonError(error)) {
				await movePathFallback(this.context, {
					fromRelative,
					denyMutations,
					overwrite: options.overwrite ?? false,
					toRelative
				});
				return;
			}
			throw error;
		}
	}
};
function readDefaults(defaults) {
	return {
		hardlinks: defaults.hardlinks,
		maxBytes: defaults.maxBytes ?? 16777216,
		nonBlockingRead: defaults.nonBlockingRead,
		symlinks: defaults.symlinks
	};
}
async function root(rootDir, defaults = {}) {
	return new RootHandle(await resolveRootContext(rootDir), defaults);
}
async function openFileInRoot(root, params) {
	const { rootWithSep, resolved } = await resolvePathInRoot(root, params.relativePath);
	let opened;
	try {
		opened = await openVerifiedLocalFile(resolved, {
			nonBlockingRead: params.nonBlockingRead,
			symlinks: params.symlinks
		});
	} catch (err) {
		if (err instanceof FsSafeError) throw err;
		throw err;
	}
	if (params.hardlinks !== "allow" && opened.stat.nlink > 1) {
		await opened.handle.close().catch(() => {});
		throw new FsSafeError("hardlink", "hardlinked path not allowed");
	}
	if (!isPathInside(rootWithSep, opened.realPath)) {
		await opened.handle.close().catch(() => {});
		throw new FsSafeError("outside-workspace", "file is outside workspace root");
	}
	return opened;
}
async function readFileInRoot(root, params) {
	const opened = await openFileInRoot(root, params);
	try {
		return await readOpenedFileSafely({
			opened,
			maxBytes: params.maxBytes
		});
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
async function readPathInRoot(root, params) {
	const rootDir = root.rootDir;
	const candidatePath = path.isAbsolute(params.filePath) ? path.resolve(params.filePath) : path.resolve(rootDir, params.filePath);
	return await readFileInRoot(root, {
		relativePath: path.relative(rootDir, candidatePath),
		hardlinks: params.hardlinks,
		maxBytes: params.maxBytes,
		nonBlockingRead: params.nonBlockingRead,
		symlinks: params.symlinks
	});
}
async function readLocalFileSafely(params) {
	const opened = await openLocalFileSafely({ filePath: params.filePath });
	try {
		return await readOpenedFileSafely({
			opened,
			maxBytes: params.maxBytes
		});
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
async function openLocalFileSafely(params) {
	assertNoNulPathInput(params.filePath, "file path contains a NUL byte");
	return await openVerifiedLocalFile(params.filePath);
}
function emitWriteBoundaryWarning(reason) {
	logWarn(`security: fs-safe write boundary warning (${reason})`);
}
function buildAtomicWriteTempPath(targetPath) {
	const dir = path.dirname(targetPath);
	const base = path.basename(targetPath);
	return path.join(dir, `.${base}.${process.pid}.${randomUUID()}.tmp`);
}
function rootWriteQueueKey(root, relativePath) {
	return `${root.rootReal}\0${relativePath}`;
}
async function writeTempFileForAtomicReplace(params) {
	const tempHandle = await fs$1.open(params.tempPath, OPEN_WRITE_CREATE_FLAGS, params.mode);
	try {
		if (typeof params.data === "string") await tempHandle.writeFile(params.data, params.encoding ?? "utf8");
		else await tempHandle.writeFile(params.data);
		return await tempHandle.stat();
	} finally {
		await tempHandle.close().catch(() => {});
	}
}
async function verifyAtomicWriteResult(params) {
	const opened = await openVerifiedLocalFile(params.targetPath, { hardlinks: "reject" });
	try {
		if (!sameFileIdentity(opened.stat, params.expectedIdentity)) throw new FsSafeError("path-mismatch", "path changed during write");
		if (!isPathInside(params.root.rootWithSep, opened.realPath)) throw new FsSafeError("outside-workspace", "file is outside workspace root");
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
async function openWritableFileInRoot(root, params) {
	const { rootReal, rootWithSep, resolved } = await resolvePathInRoot(root, params.relativePath);
	await assertMutationNotDenied(resolved, params.denyMutations);
	try {
		await assertNoPathAliasEscape({
			absolutePath: resolved,
			rootPath: rootReal,
			boundaryLabel: "root"
		});
	} catch (err) {
		throw new FsSafeError("path-alias", "path alias escape blocked", { cause: err });
	}
	if (params.mkdir !== false) await withAsyncDirectoryGuards([await createNearestExistingDirectoryGuard(rootReal, path.dirname(resolved))], async () => {
		await fs$1.mkdir(path.dirname(resolved), { recursive: true });
	});
	let ioPath = resolved;
	try {
		const resolvedRealPath = await fs$1.realpath(resolved);
		if (!isPathInside(rootWithSep, resolvedRealPath)) throw new FsSafeError("outside-workspace", "file is outside workspace root");
		ioPath = resolvedRealPath;
	} catch (err) {
		if (err instanceof FsSafeError) throw err;
		if (!isNotFoundPathError(err)) throw err;
	}
	const mode = params.mode ?? 384;
	let handle;
	let createdForWrite = false;
	const existingFlags = params.append ? OPEN_APPEND_EXISTING_FLAGS : OPEN_WRITE_EXISTING_FLAGS;
	const createFlags = params.append ? OPEN_APPEND_CREATE_FLAGS : OPEN_WRITE_CREATE_FLAGS;
	try {
		try {
			handle = await fs$1.open(ioPath, existingFlags, mode);
		} catch (err) {
			if (!isNotFoundPathError(err)) throw err;
			handle = await fs$1.open(ioPath, createFlags, mode);
			createdForWrite = true;
		}
	} catch (err) {
		if (isNotFoundPathError(err)) throw new FsSafeError("not-found", "file not found");
		if (isSymlinkOpenError(err)) throw new FsSafeError("symlink", "symlink open blocked", { cause: err });
		if (hasNodeErrorCode(err, "EISDIR")) throw new FsSafeError("not-file", "not a file", { cause: err });
		throw err;
	}
	let realPathForCleanup = null;
	try {
		const stat = await handle.stat();
		if (!stat.isFile()) throw new FsSafeError("invalid-path", "path is not a regular file under root");
		if (stat.nlink > 1) throw new FsSafeError("hardlink", "hardlinked path not allowed");
		try {
			const lstat = await fs$1.lstat(ioPath);
			if (lstat.isSymbolicLink() || !lstat.isFile()) throw new FsSafeError(lstat.isSymbolicLink() ? "symlink" : "not-file", "path is not a regular file under root");
			if (!sameFileIdentity(stat, lstat)) throw new FsSafeError("path-mismatch", "path changed during write");
		} catch (err) {
			if (!isNotFoundPathError(err)) throw err;
		}
		const realPath = await resolveOpenedFileRealPathForHandle(handle, ioPath);
		realPathForCleanup = realPath;
		const realStat = await fs$1.stat(realPath);
		if (!sameFileIdentity(stat, realStat)) throw new FsSafeError("path-mismatch", "path mismatch");
		if (realStat.nlink > 1) throw new FsSafeError("hardlink", "hardlinked path not allowed");
		if (!isPathInside(rootWithSep, realPath)) throw new FsSafeError("outside-workspace", "file is outside workspace root");
		if (params.append !== true && params.truncateExisting !== false && !createdForWrite) await handle.truncate(0);
		return {
			handle,
			createdForWrite,
			realPath,
			stat,
			[Symbol.asyncDispose]: () => handle.close().catch(() => void 0)
		};
	} catch (err) {
		const cleanupCreatedPath = createdForWrite && err instanceof FsSafeError;
		const cleanupPath = realPathForCleanup ?? ioPath;
		await handle.close().catch(() => {});
		if (cleanupCreatedPath) await fs$1.rm(cleanupPath, { force: true }).catch(() => {});
		throw err;
	}
}
async function appendFileInRoot(root, params) {
	const target = await openWritableFileInRoot(root, {
		relativePath: params.relativePath,
		mkdir: params.mkdir,
		mode: params.mode,
		denyMutations: params.denyMutations,
		truncateExisting: false,
		append: true
	});
	try {
		let prefix = "";
		if (params.prependNewlineIfNeeded === true && !target.createdForWrite && target.stat.size > 0 && (typeof params.data === "string" && !params.data.startsWith("\n") || Buffer.isBuffer(params.data) && params.data.length > 0 && params.data[0] !== 10)) {
			const lastByte = Buffer.alloc(1);
			const { bytesRead } = await target.handle.read(lastByte, 0, 1, target.stat.size - 1);
			if (bytesRead === 1 && lastByte[0] !== 10) prefix = "\n";
		}
		if (typeof params.data === "string") await target.handle.appendFile(`${prefix}${params.data}`, params.encoding ?? "utf8");
		else {
			const payload = prefix.length > 0 ? Buffer.concat([Buffer.from(prefix, "utf8"), params.data]) : params.data;
			await target.handle.appendFile(payload);
		}
		await target.handle.sync();
		if (target.createdForWrite) await syncDirectoryBestEffort(path.dirname(target.realPath));
	} finally {
		await target.handle.close().catch(() => {});
	}
}
async function removePathInRoot(root, params) {
	const resolved = await resolvePinnedRemovePathInRoot(root, params.relativePath, params.denyMutations);
	if (process.platform === "win32") {
		await removePathFallback(resolved);
		return;
	}
	try {
		await runPinnedPathHelper({
			operation: "remove",
			rootPath: resolved.rootReal,
			relativePath: resolved.relativePosix
		});
	} catch (error) {
		if (isPinnedPathHelperSpawnError(error)) {
			await removePathFallback(resolved);
			return;
		}
		throw normalizePinnedPathError(error);
	}
}
async function mkdirPathInRoot(root, params) {
	const resolved = await resolvePinnedPathInRoot(root, params);
	if (process.platform === "win32") {
		await mkdirPathFallback(resolved);
		return;
	}
	try {
		await runPinnedPathHelper({
			operation: "mkdirp",
			rootPath: resolved.rootReal,
			relativePath: resolved.relativePosix
		});
	} catch (error) {
		if (isPinnedPathHelperSpawnError(error)) {
			await mkdirPathFallback(resolved);
			return;
		}
		throw normalizePinnedPathError(error);
	}
}
async function writeFileInRoot(root, params) {
	if (process.platform === "win32") {
		await serializePathWrite(rootWriteQueueKey(root, params.relativePath), async () => {
			await writeFileFallback(root, params);
		});
		return;
	}
	const pinned = await resolvePinnedWriteTargetInRoot(root, params.relativePath, params.mode, params.denyMutations);
	await serializePathWrite(pinned.targetPath, async () => {
		await commitPinnedWriteInRoot(root, pinned, params);
	});
}
async function commitPinnedWriteInRoot(root, pinned, params) {
	let identity;
	try {
		identity = await runPinnedWriteWithRenamePolicy({
			rootPath: pinned.rootReal,
			relativeParentPath: pinned.relativeParentPath,
			basename: pinned.basename,
			targetPath: pinned.targetPath,
			renameIdentity: params.renameIdentity,
			mkdir: params.mkdir !== false,
			mode: params.mode ?? pinned.mode,
			overwrite: params.overwrite,
			input: {
				kind: "buffer",
				data: params.data,
				encoding: params.encoding
			}
		});
	} catch (error) {
		const errorCode = error?.code;
		if (errorCode === "file_lock_stale" || errorCode === "file_lock_timeout") throw error;
		if (params.overwrite === false && isAlreadyExistsError(error)) throw new FsSafeError("already-exists", "file already exists", { cause: error instanceof Error ? error : void 0 });
		throw normalizePinnedWriteError(error);
	}
	try {
		await verifyAtomicWriteResult({
			root,
			targetPath: pinned.targetPath,
			expectedIdentity: identity
		});
	} catch (err) {
		emitWriteBoundaryWarning(`post-write verification failed: ${String(err)}`);
		throw err;
	}
}
async function copyFileInRoot(root, params) {
	assertValidRootRelativePath(params.relativePath);
	assertNoNulPathInput(params.sourcePath, "source path contains a NUL byte");
	const source = await openVerifiedLocalFile(params.sourcePath, { hardlinks: params.sourceHardlinks });
	if (params.maxBytes !== void 0 && source.stat.size > params.maxBytes) {
		await source.handle.close().catch(() => {});
		throw new FsSafeError("too-large", `file exceeds limit of ${params.maxBytes} bytes (got ${source.stat.size})`);
	}
	try {
		if (process.platform === "win32") {
			await serializePathWrite(rootWriteQueueKey(root, params.relativePath), async () => {
				await copyFileFallback(root, params, source);
			});
			return;
		}
		const pinned = await resolvePinnedWriteTargetInRoot(root, params.relativePath, params.mode, params.denyMutations);
		await serializePathWrite(pinned.targetPath, async () => {
			let identity;
			try {
				if (getFsSafePythonConfig().mode === "off") {
					await copyFileFallback(root, params, source);
					return;
				}
				identity = await runPinnedCopyHelper({
					rootPath: pinned.rootReal,
					relativeParentPath: pinned.relativeParentPath,
					basename: pinned.basename,
					mkdir: params.mkdir !== false,
					mode: pinned.mode,
					overwrite: true,
					maxBytes: params.maxBytes,
					sourcePath: source.realPath,
					sourceIdentity: {
						dev: source.stat.dev,
						ino: source.stat.ino
					}
				});
			} catch (error) {
				if (canFallbackFromPythonError(error)) {
					await copyFileFallback(root, params, source);
					return;
				}
				throw normalizePinnedWriteError(error);
			}
			try {
				await verifyAtomicWriteResult({
					root,
					targetPath: pinned.targetPath,
					expectedIdentity: identity
				});
			} catch (err) {
				emitWriteBoundaryWarning(`post-copy verification failed: ${String(err)}`);
				throw err;
			}
		});
	} finally {
		await source.handle.close().catch(() => {});
	}
}
async function resolvePinnedWriteTargetInRoot(root, relativePath, requestedMode, denyMutations) {
	const { rootReal, rootWithSep, resolved } = await resolvePathInRoot(root, relativePath);
	await assertMutationNotDenied(resolved, denyMutations);
	try {
		await assertNoPathAliasEscape({
			absolutePath: resolved,
			rootPath: rootReal,
			boundaryLabel: "root"
		});
	} catch (err) {
		throw new FsSafeError("path-alias", "path alias escape blocked", { cause: err });
	}
	const relativeResolved = path.relative(rootReal, resolved);
	if (path.isAbsolute(relativeResolved)) throw new FsSafeError("outside-workspace", "file is outside workspace root");
	const relativePosix = relativeResolved ? relativeResolved.split(path.sep).join(path.posix.sep) : "";
	const basename = path.posix.basename(relativePosix);
	if (!basename || basename === "." || basename === "/") throw new FsSafeError("invalid-path", "invalid target path");
	let mode = requestedMode ?? 384;
	try {
		const opened = await openFileInRoot(root, {
			relativePath,
			hardlinks: "reject",
			nonBlockingRead: true
		});
		try {
			mode = requestedMode ?? opened.stat.mode & 511;
			if (!isPathInside(rootWithSep, opened.realPath)) throw new FsSafeError("outside-workspace", "file is outside workspace root");
		} finally {
			await opened.handle.close().catch(() => {});
		}
	} catch (err) {
		if (!(err instanceof FsSafeError) || err.code !== "not-found") throw err;
	}
	return {
		rootReal,
		targetPath: resolved,
		relativeParentPath: path.posix.dirname(relativePosix) === "." ? "" : path.posix.dirname(relativePosix),
		basename,
		mode: mode || 384
	};
}
async function resolvePinnedPathInRoot(root, params) {
	return await resolvePinnedOperationPathInRoot(root, {
		allowRoot: params.allowRoot,
		denyMutations: params.denyMutations,
		protectDenyMutationAncestors: false,
		relativePath: params.relativePath,
		policy: PATH_ALIAS_POLICIES.strict
	});
}
async function resolvePinnedRemovePathInRoot(root, relativePath, denyMutations) {
	return await resolvePinnedOperationPathInRoot(root, {
		denyMutations,
		protectDenyMutationAncestors: true,
		relativePath,
		policy: PATH_ALIAS_POLICIES.unlinkTarget
	});
}
async function resolvePinnedOperationPathInRoot(root, params) {
	const resolved = await resolvePinnedRootPathInRoot(root, {
		relativePath: params.relativePath,
		policy: params.policy
	});
	const relativeResolved = path.relative(resolved.rootReal, resolved.canonicalPath);
	if ((relativeResolved === "" || relativeResolved === ".") && params.allowRoot === true) {
		await assertMutationNotDenied(resolved.canonicalPath, params.denyMutations);
		return {
			rootReal: resolved.rootReal,
			resolved: resolved.canonicalPath,
			relativePosix: ""
		};
	}
	const firstSegment = relativeResolved.split(path.sep)[0];
	if (relativeResolved === "" || relativeResolved === "." || firstSegment === ".." || path.isAbsolute(relativeResolved)) throw new FsSafeError("outside-workspace", "file is outside workspace root");
	const relativePosix = relativeResolved.split(path.sep).join(path.posix.sep);
	if (!isPathInside(resolved.rootWithSep, resolved.canonicalPath)) throw new FsSafeError("outside-workspace", "file is outside workspace root");
	await assertMutationNotDenied(resolved.canonicalPath, params.denyMutations, { protectAncestors: params.protectDenyMutationAncestors });
	return {
		rootReal: resolved.rootReal,
		resolved: resolved.canonicalPath,
		relativePosix
	};
}
async function resolvePinnedRootPathInRoot(root, params) {
	const rootReal = root.rootReal;
	let resolved;
	try {
		resolved = await resolveRootPath({
			absolutePath: path.resolve(rootReal, await expandRelativePathWithHome(params.relativePath)),
			rootPath: rootReal,
			rootCanonicalPath: rootReal,
			boundaryLabel: "root",
			policy: params.policy
		});
	} catch (err) {
		throw new FsSafeError("path-alias", "path alias escape blocked", { cause: err });
	}
	const rootWithSep = ensureTrailingSep(resolved.rootCanonicalPath);
	return {
		rootReal: resolved.rootCanonicalPath,
		rootWithSep,
		canonicalPath: resolved.canonicalPath
	};
}
async function removePathFallback(resolved) {
	const guard = await createAsyncDirectoryGuard(path.dirname(resolved.resolved));
	await getFsSafeTestHooks()?.beforeRootFallbackMutation?.("remove", resolved.resolved);
	await assertAsyncDirectoryGuard(guard);
	await ((await fs$1.lstat(resolved.resolved)).isDirectory() ? fs$1.rmdir(resolved.resolved) : fs$1.rm(resolved.resolved));
	await assertAsyncDirectoryGuard(guard).catch(() => void 0);
}
async function mkdirPathFallback(resolved) {
	await mkdirPathComponentsWithGuards({
		rootReal: resolved.rootReal,
		targetPath: resolved.resolved,
		beforeComponent: async (componentPath) => await getFsSafeTestHooks()?.beforeRootFallbackMutation?.("mkdir", componentPath)
	});
}
async function statPathFallback(root, relativePath) {
	const resolved = await resolvePinnedPathInRoot(root, {
		relativePath,
		allowRoot: true
	});
	try {
		return pathStatFromStats(await fs$1.lstat(resolved.resolved));
	} catch (error) {
		if (isNotFoundPathError(error)) throw new FsSafeError("not-found", "file not found", { cause: error instanceof Error ? error : void 0 });
		throw error;
	}
}
async function listPathFallback(root, relativePath, withFileTypes) {
	const resolved = await resolvePinnedPathInRoot(root, {
		relativePath,
		allowRoot: true
	});
	try {
		const sortedNames = (await fs$1.readdir(resolved.resolved)).toSorted();
		if (!withFileTypes) return sortedNames;
		const entries = [];
		for (const name of sortedNames) entries.push({
			name,
			...pathStatFromStats(await fs$1.lstat(path.join(resolved.resolved, name)))
		});
		return entries;
	} catch (error) {
		if (isNotFoundPathError(error)) throw new FsSafeError("not-found", "directory not found", { cause: error instanceof Error ? error : void 0 });
		throw error;
	}
}
async function assertMoveMutationAllowed(root, params) {
	await assertMutationNotDenied((await resolvePathInRoot(root, params.fromRelative)).resolved, params.denyMutations, { protectAncestors: true });
	await assertMutationNotDenied((await resolvePathInRoot(root, params.toRelative)).resolved, params.denyMutations, { protectAncestors: true });
}
async function movePathFallback(root, params) {
	const source = await resolvePathInRoot(root, params.fromRelative);
	await assertMutationNotDenied(source.resolved, params.denyMutations, { protectAncestors: true });
	await resolvePinnedRootPathInRoot(root, {
		relativePath: params.fromRelative,
		policy: PATH_ALIAS_POLICIES.strict
	});
	const target = await resolvePathInRoot(root, params.toRelative);
	await assertMutationNotDenied(target.resolved, params.denyMutations, { protectAncestors: true });
	await resolvePinnedRootPathInRoot(root, {
		relativePath: params.toRelative,
		policy: PATH_ALIAS_POLICIES.unlinkTarget
	});
	try {
		await assertNoPathAliasEscape({
			absolutePath: target.resolved,
			rootPath: target.rootReal,
			boundaryLabel: "root"
		});
	} catch (error) {
		throw new FsSafeError("path-alias", "path alias escape blocked", { cause: error instanceof Error ? error : void 0 });
	}
	let sourceStat;
	try {
		sourceStat = await fs$1.lstat(source.resolved);
	} catch (error) {
		if (isNotFoundPathError(error)) throw new FsSafeError("not-found", "file not found", { cause: error instanceof Error ? error : void 0 });
		throw error;
	}
	if (sourceStat.isSymbolicLink()) throw new FsSafeError("symlink", "symlink not allowed");
	if (sourceStat.isFile() && sourceStat.nlink > 1) throw new FsSafeError("hardlink", "hardlinked path not allowed");
	if (!params.overwrite && sourceStat.isDirectory()) throw new FsSafeError("invalid-path", "directory moves require overwrite: true");
	if (!params.overwrite) try {
		await fs$1.lstat(target.resolved);
		throw new FsSafeError("already-exists", "destination exists");
	} catch (error) {
		if (error instanceof FsSafeError) throw error;
		if (!isNotFoundPathError(error)) throw error;
	}
	const sourceParentGuard = await createAsyncDirectoryGuard(path.dirname(source.resolved));
	const targetParentGuard = await createNearestExistingDirectoryGuard(target.rootReal, path.dirname(target.resolved));
	await getFsSafeTestHooks()?.beforeRootFallbackMutation?.("move", target.resolved);
	await assertAsyncDirectoryGuard(sourceParentGuard);
	await assertAsyncDirectoryGuard(targetParentGuard);
	try {
		await fs$1.rename(source.resolved, target.resolved);
	} catch (error) {
		if (isNotFoundPathError(error)) throw new FsSafeError("not-found", "file not found", { cause: error instanceof Error ? error : void 0 });
		if (hasNodeErrorCode(error, "EEXIST")) throw new FsSafeError("already-exists", "destination exists", { cause: error instanceof Error ? error : void 0 });
		throw error;
	}
	await assertAsyncDirectoryGuard(targetParentGuard).catch(() => void 0);
}
async function writeFileFallback(root, params) {
	if (params.overwrite === false) {
		await writeMissingFileFallback(root, params);
		return;
	}
	const target = await openWritableFileInRoot(root, {
		relativePath: params.relativePath,
		mkdir: params.mkdir,
		mode: params.mode,
		denyMutations: params.denyMutations,
		truncateExisting: false
	});
	const destinationPath = target.realPath;
	const mode = params.mode ?? target.stat.mode & 511;
	await target.handle.close().catch(() => {});
	const destinationGuard = await createAsyncDirectoryGuard(path.dirname(destinationPath));
	let tempPath = null;
	let unregisterTempPath = null;
	try {
		tempPath = buildAtomicWriteTempPath(destinationPath);
		unregisterTempPath = registerTempPathForExit(tempPath);
		const writtenStat = await writeTempFileForAtomicReplace({
			tempPath,
			data: params.data,
			encoding: params.encoding,
			mode: mode || 384
		});
		const commitTempPath = tempPath;
		await withAsyncDirectoryGuards([destinationGuard], async () => {
			await fs$1.rename(commitTempPath, destinationPath);
		});
		tempPath = null;
		unregisterTempPath();
		unregisterTempPath = null;
		try {
			await verifyAtomicWriteResult({
				root,
				targetPath: destinationPath,
				expectedIdentity: writtenStat
			});
		} catch (err) {
			emitWriteBoundaryWarning(`post-write verification failed: ${String(err)}`);
			throw err;
		}
	} finally {
		if (tempPath) await fs$1.rm(tempPath, { force: true }).catch(() => {});
		unregisterTempPath?.();
	}
}
async function writeMissingFileFallback(root, params) {
	const { rootReal, resolved } = await resolvePathInRoot(root, params.relativePath);
	await assertMutationNotDenied(resolved, params.denyMutations);
	try {
		await assertNoPathAliasEscape({
			absolutePath: resolved,
			rootPath: rootReal,
			boundaryLabel: "root"
		});
	} catch (err) {
		throw new FsSafeError("path-alias", "path alias escape blocked", { cause: err });
	}
	if (params.mkdir !== false) await fs$1.mkdir(path.dirname(resolved), { recursive: true });
	const parentGuard = await createAsyncDirectoryGuard(path.dirname(resolved));
	let created = false;
	try {
		const { handle, writtenStat } = await withAsyncDirectoryGuards([parentGuard], async () => {
			const handle = await fs$1.open(resolved, OPEN_WRITE_CREATE_FLAGS, params.mode ?? 384);
			created = true;
			try {
				if (typeof params.data === "string") await handle.writeFile(params.data, params.encoding ?? "utf8");
				else await handle.writeFile(params.data);
				return {
					handle,
					writtenStat: await handle.stat()
				};
			} catch (error) {
				await handle.close().catch(() => void 0);
				throw error;
			}
		}, { onPostGuardFailure: async ({ handle }) => {
			created = false;
			await handle.close().catch(() => void 0);
		} });
		await handle.close();
		await verifyAtomicWriteResult({
			root,
			targetPath: resolved,
			expectedIdentity: writtenStat
		});
		created = false;
	} catch (err) {
		if (hasNodeErrorCode(err, "EEXIST")) throw new FsSafeError("already-exists", "file already exists", { cause: err instanceof Error ? err : void 0 });
		throw err;
	} finally {
		if (created) await fs$1.rm(resolved, { force: true }).catch(() => void 0);
	}
}
async function copyFileFallback(root, params, source) {
	let target = null;
	let sourceClosedByStream = false;
	let targetClosedByUs = false;
	let tempHandle = null;
	let tempPath = null;
	let unregisterTempPath = null;
	let tempClosedByStream = false;
	try {
		target = await openWritableFileInRoot(root, {
			relativePath: params.relativePath,
			mkdir: params.mkdir,
			mode: params.mode,
			denyMutations: params.denyMutations,
			truncateExisting: false
		});
		const destinationPath = target.realPath;
		const mode = params.mode ?? target.stat.mode & 511;
		await target.handle.close().catch(() => {});
		targetClosedByUs = true;
		const destinationGuard = await createAsyncDirectoryGuard(path.dirname(destinationPath));
		tempPath = buildAtomicWriteTempPath(destinationPath);
		unregisterTempPath = registerTempPathForExit(tempPath);
		tempHandle = await fs$1.open(tempPath, OPEN_WRITE_CREATE_FLAGS, mode || 384);
		const sourceStream = createBoundedReadStream(source, params.maxBytes);
		const targetStream = tempHandle.createWriteStream();
		sourceStream.once("close", () => {
			sourceClosedByStream = true;
		});
		targetStream.once("close", () => {
			tempClosedByStream = true;
		});
		await pipeline(sourceStream, targetStream);
		const writtenStat = await fs$1.stat(tempPath);
		if (!tempClosedByStream) {
			await tempHandle.close().catch(() => {});
			tempClosedByStream = true;
		}
		tempHandle = null;
		const commitTempPath = tempPath;
		await withAsyncDirectoryGuards([destinationGuard], async () => {
			await fs$1.rename(commitTempPath, destinationPath);
		});
		tempPath = null;
		unregisterTempPath();
		unregisterTempPath = null;
		try {
			await verifyAtomicWriteResult({
				root,
				targetPath: destinationPath,
				expectedIdentity: writtenStat
			});
		} catch (err) {
			emitWriteBoundaryWarning(`post-copy verification failed: ${String(err)}`);
			throw err;
		}
	} catch (err) {
		if (target?.createdForWrite) await fs$1.rm(target.realPath, { force: true }).catch(() => {});
		throw err;
	} finally {
		if (!sourceClosedByStream) await source.handle.close().catch(() => {});
		if (tempHandle && !tempClosedByStream) await tempHandle.close().catch(() => {});
		if (tempPath) await fs$1.rm(tempPath, { force: true }).catch(() => {});
		unregisterTempPath?.();
		if (target && !targetClosedByUs) await target.handle.close().catch(() => {});
	}
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/secure-temp-dir.js
function isNodeErrorWithCode(err, code) {
	return typeof err === "object" && err !== null && "code" in err && err.code === code;
}
function resolveSecureTempRoot(options) {
	const TMP_DIR_ACCESS_MODE = fs.constants.W_OK | fs.constants.X_OK;
	const accessSync = options.accessSync ?? fs.accessSync;
	const chmodSync = options.chmodSync ?? fs.chmodSync;
	const lstatSync = options.lstatSync ?? fs.lstatSync;
	const mkdirSync = options.mkdirSync ?? fs.mkdirSync;
	const warn = options.warn ?? ((message) => console.warn(message));
	const warningPrefix = options.warningPrefix ?? "[fs-safe]";
	const unsafeFallbackLabel = options.unsafeFallbackLabel ?? "secure temp dir";
	const getuid = options.getuid ?? (() => {
		try {
			return typeof process.getuid === "function" ? process.getuid() : void 0;
		} catch {
			return;
		}
	});
	const tmpdir$1 = typeof options.tmpdir === "function" ? options.tmpdir : tmpdir;
	const platform = options.platform ?? process.platform;
	const uid = getuid();
	const isSecureDirForUser = (st) => {
		if (uid === void 0) return true;
		if (typeof st.uid === "number" && st.uid !== uid) return false;
		if (typeof st.mode === "number" && (st.mode & 18) !== 0) return false;
		return true;
	};
	const fallback = () => {
		const base = tmpdir$1();
		const suffix = uid === void 0 ? options.fallbackPrefix : `${options.fallbackPrefix}-${uid}`;
		return (platform === "win32" ? path.win32.join : path.join)(base, suffix);
	};
	const isTrustedTmpDir = (st) => {
		return st.isDirectory() && !st.isSymbolicLink() && isSecureDirForUser(st);
	};
	const resolveDirState = (candidatePath) => {
		try {
			const candidate = lstatSync(candidatePath);
			if (!isTrustedTmpDir(candidate)) return "invalid";
			accessSync(candidatePath, TMP_DIR_ACCESS_MODE);
			return "available";
		} catch (err) {
			if (isNodeErrorWithCode(err, "ENOENT")) return "missing";
			return "invalid";
		}
	};
	const tryRepairWritableBits = (candidatePath) => {
		try {
			const st = lstatSync(candidatePath);
			if (!st.isDirectory() || st.isSymbolicLink()) return false;
			if (uid !== void 0 && typeof st.uid === "number" && st.uid !== uid) return false;
			if (typeof st.mode !== "number") return false;
			if ((st.mode & 18) === 0) return resolveDirState(candidatePath) === "available";
			try {
				chmodSync(candidatePath, 448);
			} catch (chmodErr) {
				if (isNodeErrorWithCode(chmodErr, "EPERM") || isNodeErrorWithCode(chmodErr, "EACCES") || isNodeErrorWithCode(chmodErr, "ENOENT")) return resolveDirState(candidatePath) === "available";
				throw chmodErr;
			}
			warn(`${warningPrefix} tightened permissions on temp dir: ${candidatePath}`);
			return resolveDirState(candidatePath) === "available";
		} catch {
			return false;
		}
	};
	const ensureTrustedFallbackDir = () => {
		const fallbackPath = fallback();
		const state = resolveDirState(fallbackPath);
		if (state === "available") return fallbackPath;
		if (state === "invalid") {
			if (tryRepairWritableBits(fallbackPath)) return fallbackPath;
			throw new Error(`Unsafe fallback ${unsafeFallbackLabel}: ${fallbackPath}`);
		}
		try {
			mkdirSync(fallbackPath, {
				recursive: true,
				mode: 448
			});
			chmodSync(fallbackPath, 448);
		} catch {
			throw new Error(`Unable to create fallback ${unsafeFallbackLabel}: ${fallbackPath}`);
		}
		if (resolveDirState(fallbackPath) !== "available" && !tryRepairWritableBits(fallbackPath)) throw new Error(`Unsafe fallback ${unsafeFallbackLabel}: ${fallbackPath}`);
		return fallbackPath;
	};
	if (options.skipPreferredOnWindows === true && platform === "win32") return ensureTrustedFallbackDir();
	if (!options.preferredDir) return ensureTrustedFallbackDir();
	const existingPreferredState = resolveDirState(options.preferredDir);
	if (existingPreferredState === "available") return options.preferredDir;
	if (existingPreferredState === "invalid") {
		if (tryRepairWritableBits(options.preferredDir)) return options.preferredDir;
		return ensureTrustedFallbackDir();
	}
	try {
		accessSync(path.dirname(options.preferredDir), TMP_DIR_ACCESS_MODE);
		mkdirSync(options.preferredDir, {
			recursive: true,
			mode: 448
		});
		chmodSync(options.preferredDir, 448);
		if (resolveDirState(options.preferredDir) !== "available" && !tryRepairWritableBits(options.preferredDir)) return ensureTrustedFallbackDir();
		return options.preferredDir;
	} catch {
		return ensureTrustedFallbackDir();
	}
}
//#endregion
export { root as a, resolveOpenedFileRealPathForHandle as c, readLocalFileSafely as i, DEFAULT_ROOT_MAX_BYTES as n, PATH_ALIAS_POLICIES as o, openLocalFileSafely as r, assertNoPathAliasEscape as s, resolveSecureTempRoot as t };
