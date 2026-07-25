import { C as FsSafeError, i as isPathInside } from "./path-DILYn_gk.js";
import "./fs-safe-Dy0g6QwA.js";
import { a as root, c as resolveOpenedFileRealPathForHandle } from "./secure-temp-dir-D6Ou0J-U.js";
import { r as runCommandWithTimeout, t as runCommandBuffered } from "./exec-Cb0CNQNz.js";
import { createHash, randomBytes } from "node:crypto";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
//#region src/gateway/worker-environments/workspace-path-exclusions.ts
const DERIVED_WORKSPACE_DIRECTORY_NAMES = [
	"__pycache__",
	".pytest_cache",
	".mypy_cache",
	".ruff_cache",
	"node_modules"
];
const DERIVED_WORKSPACE_FILE_NAMES = [".DS_Store"];
const DERIVED_WORKSPACE_FILE_SUFFIXES = [".pyc", ".pyo"];
function isDerivedWorkspacePath(relativePath) {
	return relativePath.split("/").some((segment) => DERIVED_WORKSPACE_DIRECTORY_NAMES.includes(segment) || DERIVED_WORKSPACE_FILE_NAMES.includes(segment) || DERIVED_WORKSPACE_FILE_SUFFIXES.some((suffix) => segment.endsWith(suffix)));
}
const DERIVED_WORKSPACE_RSYNC_EXCLUDES = [
	...DERIVED_WORKSPACE_DIRECTORY_NAMES,
	...DERIVED_WORKSPACE_FILE_NAMES,
	...DERIVED_WORKSPACE_FILE_SUFFIXES.map((suffix) => `*${suffix}`)
];
//#endregion
//#region src/gateway/worker-environments/workspace-manifest.ts
const MAX_RECONCILIATION_ENTRIES = 25e3;
const MAX_RECONCILIATION_FILE_BYTES = 64 * 1024 * 1024;
const MAX_RECONCILIATION_TOTAL_BYTES = 256 * 1024 * 1024;
const MANIFEST_REF_PATTERN = /^sha256:([a-f0-9]{64})$/u;
const GIT_COMMIT_PATTERN = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u;
function manifestPath(value) {
	if (typeof value !== "string" || !value || value.includes("\\") || path.posix.isAbsolute(value) || path.posix.normalize(value) !== value || value === "." || value === ".." || value.startsWith("../")) throw new Error("Worker workspace manifest contains an unsafe path");
	return value;
}
function manifestMode(value) {
	if (!Number.isInteger(value) || value < 0 || value > 511) throw new Error("Worker workspace manifest contains an invalid mode");
	return value;
}
function gitFileMode(mode) {
	return (mode & 73) === 0 ? 420 : 493;
}
function compareManifestPaths(left, right) {
	return left.path < right.path ? -1 : left.path > right.path ? 1 : 0;
}
function parseRawEntry(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Worker workspace manifest contains an invalid entry");
	const entry = value;
	const entryPath = manifestPath(entry.path);
	const mode = manifestMode(entry.mode);
	if (entry.type === "directory") return {
		path: entryPath,
		type: "directory",
		mode
	};
	if (entry.type === "file") {
		if (!Number.isSafeInteger(entry.size) || entry.size < 0 || typeof entry.sha256 !== "string" || !/^[a-f0-9]{64}$/u.test(entry.sha256)) throw new Error("Worker workspace manifest contains invalid file metadata");
		return {
			path: entryPath,
			type: "file",
			mode: gitFileMode(mode),
			size: entry.size,
			sha256: entry.sha256
		};
	}
	if (entry.type === "symlink") {
		if (typeof entry.target !== "string" || !entry.target || entry.target.includes("\\") || path.posix.isAbsolute(entry.target) || path.win32.parse(entry.target).root !== "") throw new Error("Worker workspace manifest contains an unsafe symlink");
		const syntheticRoot = "/workspace";
		const resolved = path.posix.resolve(path.posix.dirname(`${syntheticRoot}/${entryPath}`), entry.target);
		if (resolved !== syntheticRoot && !resolved.startsWith(`${syntheticRoot}/`)) throw new Error("Worker workspace manifest symlink escapes its root");
		return {
			path: entryPath,
			type: "symlink",
			mode: 511,
			target: entry.target
		};
	}
	throw new Error("Worker workspace manifest contains an unsupported entry type");
}
function validateAndProjectEntries(values) {
	if (values.length > 25e4) throw new Error("Worker workspace manifest has too many entries");
	const rawEntries = values.map(parseRawEntry);
	let previous = "";
	const byPath = /* @__PURE__ */ new Map();
	for (const entry of rawEntries) {
		if (byPath.has(entry.path) || previous && previous >= entry.path) throw new Error("Worker workspace manifest paths are not unique and sorted");
		const segments = entry.path.split("/");
		for (let index = 1; index < segments.length; index += 1) if (byPath.get(segments.slice(0, index).join("/"))?.type !== "directory") throw new Error("Worker workspace manifest entry has a non-directory parent");
		byPath.set(entry.path, entry);
		previous = entry.path;
	}
	return {
		entries: rawEntries.filter((entry) => entry.type !== "directory" && !isDerivedWorkspacePath(entry.path)),
		directories: rawEntries.filter((entry) => entry.type === "directory" && !isDerivedWorkspacePath(entry.path)).map((entry) => entry.path)
	};
}
function serializeWorkerWorkspaceManifest(manifest) {
	return JSON.stringify({
		version: manifest.version,
		baseCommit: manifest.baseCommit,
		entries: [...(manifest.directories ?? []).filter((entryPath) => !isDerivedWorkspacePath(entryPath)).map((entryPath) => ({
			path: entryPath,
			type: "directory",
			mode: 448
		})), ...manifest.entries.filter((entry) => !isDerivedWorkspacePath(entry.path))].toSorted(compareManifestPaths)
	});
}
function parseWorkerWorkspaceManifest(raw, expectedRef) {
	if (Buffer.byteLength(raw) > 64 * 1024 * 1024) throw new Error("Worker workspace manifest exceeds the 64 MiB safety limit");
	const match = MANIFEST_REF_PATTERN.exec(expectedRef);
	if (!match) throw new Error("Worker workspace manifest reference is invalid");
	if (createHash("sha256").update(raw).digest("hex") !== match[1]) throw new Error("Worker workspace manifest digest does not match its reference");
	const value = JSON.parse(raw);
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Worker workspace manifest is invalid");
	const manifest = value;
	if (manifest.version !== 1 || manifest.baseCommit !== null && (typeof manifest.baseCommit !== "string" || !GIT_COMMIT_PATTERN.test(manifest.baseCommit)) || !Array.isArray(manifest.entries)) throw new Error("Worker workspace manifest has an unsupported shape");
	return {
		version: 1,
		baseCommit: manifest.baseCommit,
		...validateAndProjectEntries(manifest.entries)
	};
}
function parseJournalEntry(value) {
	const entry = parseRawEntry(value);
	if (entry.type === "directory") throw new Error("Worker workspace reconciliation journal contains a directory entry");
	return entry;
}
function serializeWorkerWorkspaceReconciliationPlan(journal) {
	return JSON.stringify({
		version: journal.version,
		temporaryNonce: journal.temporaryNonce,
		baseManifestRef: journal.baseManifestRef,
		currentManifestRef: journal.currentManifestRef,
		baseEntries: journal.baseEntries,
		appliedEntries: journal.appliedEntries,
		baseDirectories: journal.baseDirectories ?? [],
		appliedDirectories: journal.appliedDirectories ?? [],
		appliedManifestRef: journal.appliedManifestRef,
		baseTree: journal.baseTree,
		basePackSha256: journal.basePackSha256
	});
}
function parseWorkerWorkspaceReconciliationPlan(raw) {
	const value = JSON.parse(raw);
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Worker workspace reconciliation journal is invalid");
	const plan = value;
	if (plan.version !== 1 || typeof plan.temporaryNonce !== "string" || !/^[a-f0-9]{32}$/u.test(plan.temporaryNonce) || typeof plan.baseManifestRef !== "string" || !MANIFEST_REF_PATTERN.test(plan.baseManifestRef) || typeof plan.currentManifestRef !== "string" || !MANIFEST_REF_PATTERN.test(plan.currentManifestRef) || typeof plan.baseTree !== "string" || !/^[a-f0-9]{40}$/u.test(plan.baseTree) || typeof plan.basePackSha256 !== "string" || !/^[a-f0-9]{64}$/u.test(plan.basePackSha256) || !Array.isArray(plan.baseEntries) || !Array.isArray(plan.appliedEntries) || plan.baseDirectories !== void 0 && !Array.isArray(plan.baseDirectories) || plan.appliedDirectories !== void 0 && !Array.isArray(plan.appliedDirectories) || plan.appliedManifestRef !== void 0 && (typeof plan.appliedManifestRef !== "string" || !MANIFEST_REF_PATTERN.test(plan.appliedManifestRef)) || plan.baseEntries.length + plan.appliedEntries.length + (plan.baseDirectories?.length ?? 0) + (plan.appliedDirectories?.length ?? 0) > 25e3) throw new Error("Worker workspace reconciliation journal has an unsupported shape");
	const baseEntries = plan.baseEntries.map(parseJournalEntry);
	const appliedEntries = plan.appliedEntries.map(parseJournalEntry);
	const baseDirectories = (plan.baseDirectories ?? []).map(manifestPath);
	const appliedDirectories = (plan.appliedDirectories ?? []).map(manifestPath);
	for (const entries of [baseEntries, appliedEntries]) {
		const paths = entries.map((entry) => entry.path);
		if (new Set(paths).size !== paths.length) throw new Error("Worker workspace reconciliation journal has duplicate paths");
	}
	for (const directories of [baseDirectories, appliedDirectories]) if (new Set(directories).size !== directories.length) throw new Error("Worker workspace reconciliation journal has duplicate directories");
	return {
		version: 1,
		temporaryNonce: plan.temporaryNonce,
		baseManifestRef: plan.baseManifestRef,
		currentManifestRef: plan.currentManifestRef,
		baseEntries,
		appliedEntries,
		baseDirectories,
		appliedDirectories,
		appliedManifestRef: plan.appliedManifestRef,
		baseTree: plan.baseTree,
		basePackSha256: plan.basePackSha256
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-reconcile-derived-paths.ts
function reconciliationEntries(entries) {
	return entries.filter((entry) => !isDerivedWorkspacePath(entry.path));
}
function reconciliationDirectories(directories) {
	return (directories ?? []).filter((directory) => !isDerivedWorkspacePath(directory));
}
function localPath$1(root, relative) {
	return path.join(root, ...relative.split("/"));
}
async function removeDerivedWorkspaceDescendants(root, relativeDirectory) {
	for (const entry of await root.list(relativeDirectory, { withFileTypes: true })) {
		const child = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
		if (isDerivedWorkspacePath(child)) {
			await removeDerivedWorkspaceEntry(root, child, entry.isDirectory);
			continue;
		}
		if (entry.isDirectory) {
			await removeDerivedWorkspaceDescendants(root, child);
			if ((await root.list(child)).length === 0) await root.remove(child);
		}
	}
}
async function removeDerivedWorkspaceEntry(root, relativePath, isDirectory) {
	if (isDirectory) {
		let entries;
		try {
			entries = await root.list(relativePath, { withFileTypes: true });
		} catch (error) {
			if (!(error instanceof FsSafeError) || !["not-found", "path-alias"].includes(error.code)) throw error;
			entries = void 0;
		}
		for (const entry of entries ?? []) await removeDerivedWorkspaceEntry(root, `${relativePath}/${entry.name}`, entry.isDirectory);
	}
	await root.remove(relativePath).catch((error) => {
		if (!(error instanceof FsSafeError) || error.code !== "not-found") throw error;
	});
}
async function hasWorkspaceSymlinkAncestor(root, relativePath) {
	const segments = relativePath.split("/");
	for (let index = 1; index < segments.length; index += 1) if ((await fs$1.lstat(localPath$1(root, segments.slice(0, index).join("/"))).catch(() => void 0))?.isSymbolicLink()) return true;
	return false;
}
async function prepareNonDirectoryTargets(root$1, entries) {
	const workspaceRoot = await root(root$1);
	for (const entry of reconciliationEntries(entries)) {
		if (await hasWorkspaceSymlinkAncestor(root$1, entry.path)) continue;
		let stats;
		try {
			stats = await workspaceRoot.stat(entry.path);
		} catch (error) {
			if (error instanceof FsSafeError && ["not-found", "path-alias"].includes(error.code)) continue;
			throw error;
		}
		if (stats.isDirectory) {
			await removeDerivedWorkspaceDescendants(workspaceRoot, entry.path);
			if ((await workspaceRoot.list(entry.path)).length === 0) await workspaceRoot.remove(entry.path);
		}
	}
}
//#endregion
//#region src/gateway/worker-environments/workspace-reconcile-fs.ts
const PATCH_TIMEOUT_MS$1 = 10 * 6e4;
function localPath(root, relative) {
	return path.join(root, ...relative.split("/"));
}
async function readOpenedWorkspaceFile(params) {
	const before = await params.handle.stat();
	const realPath = await resolveOpenedFileRealPathForHandle(params.handle, params.expectedPath);
	if (!before.isFile() || params.root && !isPathInside(params.root, realPath)) throw new Error("Gateway workspace file changed while it was being read");
	if (before.size > 67108864) return { type: "unsupported" };
	const hash = createHash("sha256");
	const buffer = Buffer.allocUnsafe(64 * 1024);
	let size = 0;
	for (;;) {
		const { bytesRead } = await params.handle.read(buffer, 0, buffer.length, size);
		if (bytesRead === 0) break;
		size += bytesRead;
		if (size > 67108864) return { type: "unsupported" };
		hash.update(buffer.subarray(0, bytesRead));
	}
	const after = await params.handle.stat();
	if (after.size !== size || after.size !== before.size || after.mtimeMs !== before.mtimeMs || after.ctimeMs !== before.ctimeMs || after.ino !== before.ino || after.dev !== before.dev) throw new Error("Gateway workspace file changed while it was being read");
	return {
		type: "file",
		mode: gitFileMode(after.mode & 511),
		size,
		sha256: hash.digest("hex")
	};
}
async function readWorkspaceFileSnapshot(root, entryPath) {
	const absolute = localPath(root, entryPath);
	const handle = await fs$1.open(absolute, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
	try {
		return await readOpenedWorkspaceFile({
			handle,
			expectedPath: absolute,
			root
		});
	} finally {
		await handle.close();
	}
}
async function readAbsoluteFileSnapshot(absolute) {
	const handle = await fs$1.open(absolute, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
	try {
		return await readOpenedWorkspaceFile({
			handle,
			expectedPath: absolute
		});
	} finally {
		await handle.close();
	}
}
async function absoluteEntryMatches(absolute, entry) {
	const stats = await fs$1.lstat(absolute).catch(() => void 0);
	if (!stats) return false;
	if (entry.type === "symlink") return stats.isSymbolicLink() && await fs$1.readlink(absolute) === entry.target;
	if (!stats.isFile() || stats.isSymbolicLink()) return false;
	const snapshot = await readAbsoluteFileSnapshot(absolute).catch(() => void 0);
	return snapshot?.type === "file" && snapshot.mode === entry.mode && snapshot.size === entry.size && snapshot.sha256 === entry.sha256;
}
async function entryMatches(root, entry) {
	if (entry.type === "symlink") return await absoluteEntryMatches(localPath(root, entry.path), entry);
	const snapshot = await readWorkspaceFileSnapshot(root, entry.path).catch(() => void 0);
	return snapshot?.type === "file" && snapshot.mode === entry.mode && snapshot.size === entry.size && snapshot.sha256 === entry.sha256;
}
async function readWorkspaceTreeFile(params) {
	const listed = await runCommandBuffered([
		"git",
		"--literal-pathspecs",
		"-C",
		params.repositoryRoot,
		"ls-tree",
		"-z",
		"--full-tree",
		params.tree,
		"--",
		params.entry.path
	], {
		timeoutMs: PATCH_TIMEOUT_MS$1,
		maxOutputBytes: 1024 * 1024
	});
	if (listed.termination !== "exit" || listed.code !== 0) throw new Error(listed.stderr.toString("utf8").trim() || "git ls-tree failed");
	const record = listed.stdout;
	const terminator = record.indexOf(0);
	const separator = record.indexOf(9);
	if (terminator !== record.byteLength - 1 || separator < 0 || separator > terminator) throw new Error(`Cloud workspace recovery snapshot is missing: ${params.entry.path}`);
	const metadata = record.subarray(0, separator).toString("utf8");
	const match = /^100(?:644|755) blob ([a-f0-9]{40})$/u.exec(metadata);
	const listedPath = record.subarray(separator + 1, terminator);
	if (!match || !listedPath.equals(Buffer.from(params.entry.path))) throw new Error(`Cloud workspace recovery snapshot is invalid: ${params.entry.path}`);
	const blob = await runCommandBuffered([
		"git",
		"-C",
		params.repositoryRoot,
		"cat-file",
		"blob",
		match[1]
	], {
		timeoutMs: PATCH_TIMEOUT_MS$1,
		maxOutputBytes: 67108865
	});
	if (blob.termination !== "exit" || blob.code !== 0) throw new Error(blob.stderr.toString("utf8").trim() || "git cat-file failed");
	return blob.stdout;
}
async function directoryContainsOnlyJournalPaths(root, directory, paths, directories) {
	for (const name of await fs$1.readdir(localPath(root, directory))) {
		const child = `${directory}/${name}`;
		if (isDerivedWorkspacePath(child)) continue;
		const stats = await fs$1.lstat(localPath(root, child));
		if (stats.isDirectory() && !stats.isSymbolicLink()) {
			if (!directories.has(child) && !await directoryContainsOnlyDerivedWorkspaceEntries(root, child)) return false;
			if (directories.has(child) && !await directoryContainsOnlyJournalPaths(root, child, paths, directories)) return false;
		} else if (!paths.has(child)) return false;
	}
	return true;
}
async function directoryContainsOnlyDerivedWorkspaceEntries(root, directory) {
	const names = await fs$1.readdir(localPath(root, directory));
	let foundDerivedEntry = false;
	for (const name of names) {
		const child = `${directory}/${name}`;
		if (isDerivedWorkspacePath(child)) {
			foundDerivedEntry = true;
			continue;
		}
		const stats = await fs$1.lstat(localPath(root, child));
		if (!stats.isDirectory() || stats.isSymbolicLink() || !await directoryContainsOnlyDerivedWorkspaceEntries(root, child)) return false;
		foundDerivedEntry = true;
	}
	return foundDerivedEntry;
}
async function clearTemporaryWorkspace(repositoryRoot) {
	for (const name of await fs$1.readdir(repositoryRoot)) if (name !== ".git") await fs$1.rm(path.join(repositoryRoot, name), {
		recursive: true,
		force: true
	});
}
//#endregion
//#region src/gateway/worker-environments/workspace-reconcile-core.ts
const MAX_RECONCILIATION_PATH_BYTES = 64 * 1024 * 1024;
var ConcurrentWorkspacePathError = class extends Error {};
async function assertWorkspaceMatchesManifest(params) {
	const root = await fs$1.realpath(params.root);
	const expectedNodes = params.entries ? reconciliationEntries(params.entries) : [...manifestNodes(params.manifest).values()].filter((entry) => entry !== void 0);
	for (const entry of expectedNodes) if (!(entry.type === "file" || entry.type === "symlink" ? await entryMatches(root, entry) : sameEntry(await localWorkspaceNode(root, entry.path), entry))) throw new ConcurrentWorkspacePathError(`Gateway workspace changed after cloud dispatch: ${entry.path}`);
}
function sameEntry(left, right) {
	return JSON.stringify(left) === JSON.stringify(right);
}
function manifestNodes(manifest) {
	return new Map([...reconciliationDirectories(manifest.directories).map((entryPath) => [entryPath, {
		path: entryPath,
		type: "directory"
	}]), ...reconciliationEntries(manifest.entries).map((entry) => [entry.path, entry])]);
}
function hasPathAncestor(paths, entryPath) {
	const segments = entryPath.split("/");
	for (let index = 1; index < segments.length; index += 1) if (paths.has(segments.slice(0, index).join("/"))) return true;
	return false;
}
function isPortableWorkspaceSymlink(root, entryPath, target) {
	if (!target || target.includes("\\") || path.posix.isAbsolute(target) || path.win32.parse(target).root !== "") return false;
	const resolved = path.resolve(path.dirname(localPath(root, entryPath)), target);
	return resolved === root || resolved.startsWith(`${root}${path.sep}`);
}
async function localWorkspaceNode(root, entryPath) {
	const absolute = localPath(root, entryPath);
	const stats = await fs$1.lstat(absolute).catch((error) => {
		if (["ENOENT", "ENOTDIR"].includes(error.code ?? "")) return;
		throw error;
	});
	if (!stats) return;
	if (stats.isDirectory() && !stats.isSymbolicLink()) return {
		path: entryPath,
		type: "directory"
	};
	if (stats.isSymbolicLink()) return {
		path: entryPath,
		type: "symlink",
		mode: 511,
		target: await fs$1.readlink(absolute)
	};
	if (!stats.isFile()) return {
		path: entryPath,
		type: "unsupported"
	};
	const snapshot = await readWorkspaceFileSnapshot(root, entryPath);
	if (snapshot.type === "unsupported") return {
		path: entryPath,
		type: "unsupported"
	};
	return {
		path: entryPath,
		type: "file",
		mode: snapshot.mode,
		size: snapshot.size,
		sha256: snapshot.sha256
	};
}
async function localWorkspaceDescendantPaths(root, entryPaths) {
	const paths = [];
	const pending = [...entryPaths];
	let pathBytes = 0;
	let enumeratedEntries = 0;
	while (pending.length > 0) {
		const directory = pending.pop();
		const names = [];
		for await (const entry of await fs$1.opendir(localPath(root, directory))) {
			names.push(entry.name);
			enumeratedEntries += 1;
			if (enumeratedEntries > 25e3) throw new Error("Gateway workspace manifest has too many entries");
		}
		for (const name of names.toSorted()) {
			const childPath = `${directory}/${name}`;
			pathBytes += Buffer.byteLength(childPath);
			if (pathBytes > MAX_RECONCILIATION_PATH_BYTES) throw new Error("Gateway workspace manifest paths exceed their byte limit");
			if (isDerivedWorkspacePath(childPath)) continue;
			paths.push(childPath);
			const stats = await fs$1.lstat(localPath(root, childPath));
			if (stats.isDirectory() && !stats.isSymbolicLink()) pending.push(childPath);
		}
	}
	return paths;
}
async function readActualWorkspaceManifest(params) {
	const rawEntries = [];
	let totalBytes = 0;
	let traversedEntries = 0;
	let traversedPathBytes = 0;
	const addEntry = (entry, bytes = 0) => {
		totalBytes += bytes;
		if (totalBytes > 268435456) throw new Error("Gateway workspace manifest exceeds its byte limit");
		rawEntries.push(entry);
		if (rawEntries.length > 25e3) throw new Error("Gateway workspace manifest has too many entries");
	};
	const walk = async (relativeDirectory) => {
		const absoluteDirectory = relativeDirectory ? localPath(params.root, relativeDirectory) : params.root;
		let hasDerivedEntry = false;
		let hasNonDerivedEntry = false;
		for await (const directoryEntry of await fs$1.opendir(absoluteDirectory)) {
			const name = directoryEntry.name;
			const relative = relativeDirectory ? `${relativeDirectory}/${name}` : name;
			traversedEntries += 1;
			traversedPathBytes += Buffer.byteLength(relative);
			if (traversedEntries > 25e3) throw new Error("Gateway workspace manifest has too many entries");
			if (traversedPathBytes > MAX_RECONCILIATION_PATH_BYTES) throw new Error("Gateway workspace manifest paths exceed their byte limit");
			if (!relativeDirectory && name === ".git") continue;
			if (isDerivedWorkspacePath(relative)) {
				hasDerivedEntry = true;
				continue;
			}
			if (params.includePaths && !params.includePaths.has(relative)) continue;
			const absolute = localPath(params.root, relative);
			const stats = await fs$1.lstat(absolute);
			if (stats.isDirectory() && !stats.isSymbolicLink()) {
				const child = await walk(relative);
				if (child.included || params.preserveDirectories?.has(relative)) {
					addEntry({
						path: relative,
						type: "directory",
						mode: stats.mode & 511
					});
					hasNonDerivedEntry = true;
				} else hasDerivedEntry ||= child.hasDerivedEntry;
			} else if (stats.isSymbolicLink()) {
				hasNonDerivedEntry = true;
				const target = await fs$1.readlink(absolute);
				if (!isPortableWorkspaceSymlink(params.root, relative, target)) continue;
				addEntry({
					path: relative,
					type: "symlink",
					mode: 511,
					target
				}, Buffer.byteLength(target));
			} else if (stats.isFile()) {
				hasNonDerivedEntry = true;
				const snapshot = await readWorkspaceFileSnapshot(params.root, relative);
				if (snapshot.type === "unsupported") continue;
				addEntry({
					path: relative,
					type: "file",
					mode: snapshot.mode,
					size: snapshot.size,
					sha256: snapshot.sha256
				}, snapshot.size);
			} else {
				hasNonDerivedEntry = true;
				continue;
			}
		}
		return {
			hasDerivedEntry,
			included: hasNonDerivedEntry || !hasDerivedEntry
		};
	};
	await walk("");
	const directories = rawEntries.filter((entry) => entry.type === "directory").toSorted((left, right) => left.path.localeCompare(right.path));
	const manifest = {
		version: 1,
		baseCommit: params.baseCommit,
		entries: rawEntries.filter((entry) => entry.type !== "directory").toSorted((left, right) => left.path.localeCompare(right.path)),
		directories: directories.map((entry) => entry.path)
	};
	const raw = serializeWorkerWorkspaceManifest(manifest);
	return {
		manifestRef: `sha256:${createHash("sha256").update(raw).digest("hex")}`,
		manifest
	};
}
async function inspectAcceptedWorkerWorkspace(params) {
	const root = await fs$1.realpath(params.root);
	const preserveDirectories = new Set(reconciliationDirectories(params.current.directories));
	const actual = await readActualWorkspaceManifest({
		root,
		baseCommit: params.current.baseCommit,
		preserveDirectories
	});
	if (actual.manifestRef !== params.expectedManifestRef && !params.allowAdvancedLocalState) return;
	const preflight = await preflightWorkspaceApply({
		root,
		base: params.base,
		current: params.current
	});
	const conflictPaths = params.allowAdvancedLocalState ? retainedConflictPaths(preflight) : preflight.conflictPaths;
	return {
		...actual,
		conflictPaths,
		verifyLocalStable: async () => await assertActualWorkspaceManifest({
			root,
			expectedRef: actual.manifestRef,
			baseCommit: actual.manifest.baseCommit,
			preserveDirectories
		})
	};
}
async function assertActualWorkspaceManifest(params) {
	if ((await readActualWorkspaceManifest(params)).manifestRef !== params.expectedRef) throw new ConcurrentWorkspacePathError("Gateway workspace changed after cloud reconciliation");
}
function changedPaths(base, current) {
	const baseByPath = manifestNodes(base);
	const currentByPath = manifestNodes(current);
	return new Set([.../* @__PURE__ */ new Set([...baseByPath.keys(), ...currentByPath.keys()])].filter((entryPath) => !sameEntry(baseByPath.get(entryPath), currentByPath.get(entryPath))));
}
async function applyWorkspaceDirectoryChanges(params) {
	const workspaceRoot = await root(params.root, { mode: 448 });
	const baseNodes = manifestNodes(params.base);
	const currentNodes = manifestNodes(params.current);
	const directoryPaths = [...params.applyPaths].filter((entryPath) => baseNodes.get(entryPath)?.type === "directory" || currentNodes.get(entryPath)?.type === "directory");
	for (const entryPath of directoryPaths.toSorted()) if (currentNodes.get(entryPath)?.type === "directory") await workspaceRoot.mkdir(entryPath);
	const removedDirectoryPaths = directoryPaths.filter((entryPath) => baseNodes.get(entryPath)?.type === "directory" && !currentNodes.has(entryPath));
	for (const entryPath of removedDirectoryPaths.toSorted((left, right) => right.localeCompare(left))) {
		const baseDirectory = baseNodes.get(entryPath);
		let directoryState;
		try {
			directoryState = await workspaceRoot.stat(entryPath);
		} catch (error) {
			if (error instanceof FsSafeError && ["not-found", "path-alias"].includes(error.code)) continue;
			throw error;
		}
		if (!directoryState.isDirectory || baseDirectory?.type !== "directory") continue;
		let children;
		try {
			children = await workspaceRoot.list(entryPath);
		} catch (error) {
			if (error instanceof FsSafeError && ["not-found", "path-alias"].includes(error.code)) continue;
			throw error;
		}
		if (children.length > 0) continue;
		try {
			await workspaceRoot.remove(entryPath);
		} catch (error) {
			if (error instanceof FsSafeError && ["not-found", "path-alias"].includes(error.code)) continue;
			if ((await workspaceRoot.list(entryPath).catch(() => void 0))?.length) continue;
			throw error;
		}
	}
}
function hasReplacedBaseEntryAncestor(entryPath, baseByPath, currentByPath) {
	const segments = entryPath.split("/");
	for (let index = 1; index < segments.length; index += 1) {
		const ancestor = segments.slice(0, index).join("/");
		const baseEntry = baseByPath.get(ancestor);
		if (baseEntry && !sameEntry(baseEntry, currentByPath.get(ancestor))) return true;
	}
	return false;
}
async function preflightWorkspaceApply(params) {
	const baseNodes = manifestNodes(params.base);
	const currentNodes = manifestNodes(params.current);
	const manifestPaths = [.../* @__PURE__ */ new Set([...baseNodes.keys(), ...currentNodes.keys()])];
	const changed = new Set(manifestPaths.filter((entryPath) => !sameEntry(baseNodes.get(entryPath), currentNodes.get(entryPath))));
	const structurallyReplacedDirectories = new Set([...changed].filter((entryPath) => baseNodes.get(entryPath)?.type === "directory" && currentNodes.get(entryPath)?.type !== "directory"));
	const structuralRoots = [...structurallyReplacedDirectories].filter((entryPath) => !hasPathAncestor(structurallyReplacedDirectories, entryPath));
	const localStructuralRoots = [];
	for (const entryPath of structuralRoots) {
		const stats = await fs$1.lstat(localPath(params.root, entryPath)).catch(() => void 0);
		if (stats?.isDirectory() && !stats.isSymbolicLink()) localStructuralRoots.push(entryPath);
	}
	const localStructuralPaths = await localWorkspaceDescendantPaths(params.root, localStructuralRoots);
	const paths = [.../* @__PURE__ */ new Set([...changed, ...localStructuralPaths])].toSorted();
	const applyPaths = /* @__PURE__ */ new Set();
	const conflicts = /* @__PURE__ */ new Set();
	const blockingConflicts = /* @__PURE__ */ new Set();
	for (const entryPath of paths) {
		if (hasPathAncestor(blockingConflicts, entryPath)) continue;
		if (currentNodes.get(entryPath) === void 0 && !await fs$1.lstat(localPath(params.root, entryPath)).catch((error) => {
			if (["ENOENT", "ENOTDIR"].includes(error.code ?? "")) return;
			throw error;
		})) continue;
		const segments = entryPath.split("/");
		let localAncestorConflict = false;
		for (let index = 1; index < segments.length; index += 1) {
			const ancestor = segments.slice(0, index).join("/");
			const baseAncestor = baseNodes.get(ancestor);
			const currentAncestor = currentNodes.get(ancestor);
			if (!baseAncestor && !currentAncestor) {
				const localAncestor = await localWorkspaceNode(params.root, ancestor);
				if (localAncestor && localAncestor.type !== "directory") {
					conflicts.add(ancestor);
					blockingConflicts.add(ancestor);
					localAncestorConflict = true;
					break;
				}
				continue;
			}
			const localAncestor = await localWorkspaceNode(params.root, ancestor);
			const localStructurallyMatchesBase = localAncestor?.type === "directory" && baseAncestor?.type === "directory" ? true : sameEntry(localAncestor, baseAncestor);
			const localStructurallyMatchesCurrent = localAncestor?.type === "directory" && currentAncestor?.type === "directory" ? true : sameEntry(localAncestor, currentAncestor);
			if (!localStructurallyMatchesBase && !localStructurallyMatchesCurrent) {
				conflicts.add(ancestor);
				blockingConflicts.add(ancestor);
				localAncestorConflict = true;
				break;
			}
		}
		if (localAncestorConflict) continue;
		let local;
		let replacedBaseAncestor = false;
		for (let index = 1; index < segments.length; index += 1) {
			const ancestor = segments.slice(0, index).join("/");
			const baseAncestor = baseNodes.get(ancestor);
			if (baseAncestor && baseAncestor.type !== "directory" && !sameEntry(baseAncestor, currentNodes.get(ancestor)) && sameEntry(await localWorkspaceNode(params.root, ancestor), baseAncestor)) {
				replacedBaseAncestor = true;
				break;
			}
		}
		if (replacedBaseAncestor) local = void 0;
		else {
			local = await localWorkspaceNode(params.root, entryPath);
			if (local?.type === "directory" && (!baseNodes.has(entryPath) || !currentNodes.has(entryPath)) && currentNodes.get(entryPath)?.type !== "directory" && await directoryContainsOnlyDerivedWorkspaceEntries(params.root, entryPath)) local = void 0;
		}
		if (sameEntry(local, baseNodes.get(entryPath))) {
			if (changed.has(entryPath)) applyPaths.add(entryPath);
		} else if (!sameEntry(local, currentNodes.get(entryPath))) {
			conflicts.add(entryPath);
			const current = currentNodes.get(entryPath);
			if (current?.type === "directory" && local !== void 0 && local.type !== "directory" || current !== void 0 && current.type !== "directory" && local?.type === "directory") blockingConflicts.add(entryPath);
		}
	}
	const initialConflictPaths = Array.from(conflicts);
	for (const conflictPath of initialConflictPaths) {
		const segments = conflictPath.split("/");
		for (let index = 1; index < segments.length; index += 1) {
			const ancestor = segments.slice(0, index).join("/");
			const workerNode = currentNodes.get(ancestor);
			if (changed.has(ancestor) && workerNode && workerNode.type !== "directory") {
				conflicts.add(ancestor);
				blockingConflicts.add(ancestor);
				break;
			}
		}
	}
	const conflictPaths = [...conflicts].filter((entryPath) => !hasPathAncestor(blockingConflicts, entryPath)).toSorted();
	const blockingConflictPaths = [...blockingConflicts].filter((entryPath) => !hasPathAncestor(blockingConflicts, entryPath)).toSorted();
	const conflictPathSet = new Set(conflictPaths);
	const blockingConflictPathSet = new Set(blockingConflictPaths);
	for (const entryPath of applyPaths) if (conflictPathSet.has(entryPath) || hasPathAncestor(blockingConflictPathSet, entryPath)) applyPaths.delete(entryPath);
	return {
		applyPaths,
		conflictPaths,
		blockingConflictPaths
	};
}
function retainedConflictPaths(preflight, originalApplyPaths) {
	const retainedApplyPaths = [...preflight.applyPaths].filter((entryPath) => !originalApplyPaths?.has(entryPath) || !preflight.conflictPaths.some((conflictPath) => conflictPath.startsWith(`${entryPath}/`)));
	const conflicts = /* @__PURE__ */ new Set([...preflight.conflictPaths, ...retainedApplyPaths]);
	const blockingConflicts = new Set(preflight.blockingConflictPaths);
	return [...conflicts].filter((entryPath) => !hasPathAncestor(blockingConflicts, entryPath)).toSorted();
}
async function assertWorkspaceResultStable(params) {
	await assertWorkspaceMatchesManifest({
		root: params.root,
		manifest: params.current
	});
	const preflight = await preflightWorkspaceApply(params);
	const unstablePath = preflight.conflictPaths[0] ?? preflight.applyPaths.values().next().value;
	if (unstablePath) throw new ConcurrentWorkspacePathError(`Gateway workspace changed after cloud dispatch: ${unstablePath}`);
}
//#endregion
//#region src/gateway/worker-environments/workspace-reconcile-recovery.ts
const PATCH_TIMEOUT_MS = 10 * 6e4;
async function requireGit(cwd, args, input, env) {
	const result = await runCommandWithTimeout([
		"git",
		"-C",
		cwd,
		...args
	], {
		timeoutMs: PATCH_TIMEOUT_MS,
		...input ? { input } : {},
		...env ? { env } : {},
		maxOutputBytes: 1024 * 1024
	});
	if (result.termination !== "exit" || result.code !== 0) throw new Error((result.stderr || result.stdout || `git ${args[0]} failed`).trim());
	return result.stdout.trim();
}
async function materializeSnapshotEntry(params) {
	const target = localPath(params.root, params.entry.path);
	await fs$1.mkdir(path.dirname(target), {
		recursive: true,
		mode: 448
	});
	if (params.entry.type === "symlink") {
		await fs$1.symlink(params.entry.target, target);
		return;
	}
	if (params.content) await fs$1.writeFile(target, params.content, {
		mode: params.entry.mode,
		flag: "wx"
	});
	else if (params.sourceRoot) await fs$1.copyFile(localPath(params.sourceRoot, params.entry.path), target);
	else throw new Error(`Cloud workspace snapshot content is missing: ${params.entry.path}`);
	await fs$1.chmod(target, params.entry.mode);
	if (!await absoluteEntryMatches(target, params.entry)) throw new Error(`Cloud workspace staged payload is invalid: ${params.entry.path}`);
}
async function writeRawWorkspaceTree(params) {
	const blobs = [];
	let mark = 1;
	for (const entry of reconciliationEntries(params.entries).toSorted((left, right) => left.path.localeCompare(right.path))) {
		const content = entry.type === "symlink" ? Buffer.from(entry.target) : await fs$1.readFile(localPath(params.repositoryRoot, entry.path));
		blobs.push({
			entry,
			mark,
			content
		});
		mark += 1;
	}
	const ref = `refs/heads/openclaw-snapshot-${randomBytes(16).toString("hex")}`;
	const chunks = [];
	for (const blob of blobs) {
		chunks.push(Buffer.from(`blob\nmark :${blob.mark}\ndata ${blob.content.byteLength}\n`));
		chunks.push(blob.content, Buffer.from("\n"));
	}
	chunks.push(Buffer.from(`commit ${ref}\ncommitter OpenClaw <noreply@openclaw.ai> 0 +0000\ndata 0\ndeleteall\n`));
	for (const blob of blobs) {
		const mode = blob.entry.type === "symlink" ? "120000" : (blob.entry.mode & 73) !== 0 ? "100755" : "100644";
		chunks.push(Buffer.from(`M ${mode} :${blob.mark} ${JSON.stringify(blob.entry.path)}\n`));
	}
	chunks.push(Buffer.from("done\n"));
	const imported = await runCommandBuffered([
		"git",
		"-C",
		params.repositoryRoot,
		"fast-import",
		"--quiet"
	], {
		input: Buffer.concat(chunks),
		timeoutMs: PATCH_TIMEOUT_MS,
		maxOutputBytes: {
			stdout: 1024 * 1024,
			stderr: 1024 * 1024
		}
	});
	if (imported.termination !== "exit" || imported.code !== 0) throw new Error(imported.stderr.toString("utf8").trim() || "git fast-import failed");
	return await requireGit(params.repositoryRoot, ["rev-parse", `${ref}^{tree}`]);
}
async function createWorkspacePatch(params) {
	const temporary = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-workspace-patch-"));
	try {
		await requireGit(temporary, [
			"init",
			"--quiet",
			"--object-format=sha1"
		]);
		let bytes = 0;
		for (const entry of params.baseEntries) {
			let content;
			if (entry.type === "file") {
				if (entry.size > 67108864) throw new Error(`Cloud workspace rollback file is too large: ${entry.path}`);
				content = await fs$1.readFile(localPath(params.root, entry.path));
				bytes += content.byteLength;
			}
			if (bytes > 268435456) throw new Error("Cloud workspace rollback exceeds its byte limit");
			await materializeSnapshotEntry({
				root: temporary,
				entry,
				content
			});
		}
		const baseTree = await writeRawWorkspaceTree({
			repositoryRoot: temporary,
			entries: params.baseEntries
		});
		const packed = await runCommandBuffered([
			"git",
			"-C",
			temporary,
			"pack-objects",
			"--stdout",
			"--revs"
		], {
			input: Buffer.from(`${baseTree}\n`),
			timeoutMs: PATCH_TIMEOUT_MS,
			maxOutputBytes: {
				stdout: 268435457,
				stderr: 1024 * 1024
			}
		});
		if (packed.termination !== "exit" || packed.code !== 0) throw new Error(packed.stderr.toString("utf8").trim() || "git pack-objects failed");
		if (packed.stdout.byteLength > 268435456) throw new Error("Cloud workspace recovery snapshot exceeds its byte limit");
		for (const name of await fs$1.readdir(temporary)) if (name !== ".git") await fs$1.rm(path.join(temporary, name), {
			recursive: true,
			force: true
		});
		for (const entry of params.appliedEntries) await materializeSnapshotEntry({
			root: temporary,
			entry,
			sourceRoot: params.stagingRoot
		});
		const diff = await runCommandBuffered([
			"git",
			"-C",
			temporary,
			"diff",
			"--binary",
			"--full-index",
			"--no-renames",
			baseTree,
			await writeRawWorkspaceTree({
				repositoryRoot: temporary,
				entries: params.appliedEntries
			}),
			"--"
		], {
			timeoutMs: PATCH_TIMEOUT_MS,
			maxOutputBytes: {
				stdout: 268435457,
				stderr: 1024 * 1024
			}
		});
		if (diff.termination !== "exit" || diff.code !== 0) throw new Error(diff.stderr.toString("utf8").trim() || "git diff failed");
		if (diff.stdout.byteLength > 268435456) throw new Error("Cloud workspace patch exceeds its byte limit");
		return {
			patch: diff.stdout,
			baseTree,
			basePack: packed.stdout
		};
	} finally {
		await fs$1.rm(temporary, {
			recursive: true,
			force: true
		});
	}
}
async function applyWorkspacePatch(params) {
	if (params.patch.byteLength === 0) return;
	const temporary = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-no-git-"));
	try {
		await requireGit(params.root, [
			"apply",
			"--no-index",
			"--binary",
			"--whitespace=nowarn",
			...params.reverse ? ["--reverse"] : []
		], params.patch, { GIT_DIR: path.join(temporary, ".git") });
	} finally {
		await fs$1.rm(temporary, {
			recursive: true,
			force: true
		});
	}
}
function validateJournalSnapshot(journal) {
	if (journal.basePack.byteLength > 268435456 || !/^[a-f0-9]{40}$/u.test(journal.baseTree) || createHash("sha256").update(journal.basePack).digest("hex") !== journal.basePackSha256) throw new Error("Cloud workspace reconciliation recovery snapshot is invalid");
}
async function createWorkspaceRecoveryPatch(params) {
	const temporary = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-workspace-recovery-"));
	try {
		await requireGit(temporary, [
			"init",
			"--quiet",
			"--object-format=sha1"
		]);
		await requireGit(temporary, ["index-pack", "--stdin"], params.journal.basePack);
		await requireGit(temporary, [
			"cat-file",
			"-e",
			`${params.journal.baseTree}^{tree}`
		]);
		const baseEntries = reconciliationEntries(params.journal.baseEntries);
		const appliedEntries = reconciliationEntries(params.journal.appliedEntries);
		const baseByPath = new Map(baseEntries.map((entry) => [entry.path, entry]));
		const appliedByPath = new Map(appliedEntries.map((entry) => [entry.path, entry]));
		const paths = /* @__PURE__ */ new Set([...baseByPath.keys(), ...appliedByPath.keys()]);
		const directories = /* @__PURE__ */ new Set();
		for (const entryPath of paths) {
			const segments = entryPath.split("/");
			for (let index = 1; index < segments.length; index += 1) directories.add(segments.slice(0, index).join("/"));
		}
		const actualEntries = [];
		for (const entryPath of [...paths].toSorted()) {
			const absolute = localPath(params.root, entryPath);
			const stats = await fs$1.lstat(absolute).catch(() => void 0);
			if (!stats) {
				const baseEntry = baseByPath.get(entryPath);
				const appliedEntry = appliedByPath.get(entryPath);
				if (baseEntry && appliedEntry) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
				continue;
			}
			const baseEntry = baseByPath.get(entryPath);
			const appliedEntry = appliedByPath.get(entryPath);
			if (baseEntry && await entryMatches(params.root, baseEntry)) {
				actualEntries.push(baseEntry);
				continue;
			}
			if (appliedEntry && await entryMatches(params.root, appliedEntry)) {
				actualEntries.push(appliedEntry);
				continue;
			}
			if (!(stats.isDirectory() && !stats.isSymbolicLink() && (directories.has(entryPath) && await directoryContainsOnlyJournalPaths(params.root, entryPath, paths, directories) || await directoryContainsOnlyDerivedWorkspaceEntries(params.root, entryPath)))) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
		}
		for (const entry of actualEntries) await materializeSnapshotEntry({
			root: temporary,
			entry,
			sourceRoot: params.root
		});
		const actualTree = await writeRawWorkspaceTree({
			repositoryRoot: temporary,
			entries: actualEntries
		});
		let recoveryBaseTree = params.journal.baseTree;
		if (baseEntries.length !== params.journal.baseEntries.length) {
			await clearTemporaryWorkspace(temporary);
			for (const entry of baseEntries) await materializeSnapshotEntry({
				root: temporary,
				entry,
				content: entry.type === "file" ? await readWorkspaceTreeFile({
					repositoryRoot: temporary,
					tree: params.journal.baseTree,
					entry
				}) : void 0
			});
			recoveryBaseTree = await writeRawWorkspaceTree({
				repositoryRoot: temporary,
				entries: baseEntries
			});
			await clearTemporaryWorkspace(temporary);
		}
		const diff = await runCommandBuffered([
			"git",
			"-C",
			temporary,
			"diff",
			"--binary",
			"--full-index",
			"--no-renames",
			actualTree,
			recoveryBaseTree,
			"--"
		], {
			timeoutMs: PATCH_TIMEOUT_MS,
			maxOutputBytes: {
				stdout: 268435457,
				stderr: 1024 * 1024
			}
		});
		if (diff.termination !== "exit" || diff.code !== 0) throw new Error(diff.stderr.toString("utf8").trim() || "git recovery diff failed");
		if (diff.stdout.byteLength > 268435456) throw new Error("Cloud workspace recovery patch exceeds its byte limit");
		return diff.stdout;
	} finally {
		await fs$1.rm(temporary, {
			recursive: true,
			force: true
		});
	}
}
async function assertWorkspaceRecoveryBase(params) {
	await assertWorkspaceMatchesManifest({
		root: params.root,
		manifest: {
			version: 1,
			baseCommit: null,
			entries: params.journal.baseEntries
		}
	});
	const baseEntries = reconciliationEntries(params.journal.baseEntries);
	const appliedEntries = reconciliationEntries(params.journal.appliedEntries);
	const baseDirectoryPaths = new Set(reconciliationDirectories(params.journal.baseDirectories ?? []));
	const appliedDirectoryPaths = new Set(reconciliationDirectories(params.journal.appliedDirectories ?? []));
	for (const entryPath of baseDirectoryPaths) if ((await localWorkspaceNode(params.root, entryPath))?.type !== "directory") throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
	const basePaths = new Set(baseEntries.map((entry) => entry.path));
	const baseDirectories = /* @__PURE__ */ new Set();
	for (const entryPath of basePaths) {
		const segments = entryPath.split("/");
		for (let index = 1; index < segments.length; index += 1) baseDirectories.add(segments.slice(0, index).join("/"));
	}
	for (const entry of appliedEntries) {
		if (basePaths.has(entry.path)) continue;
		const existing = await fs$1.lstat(localPath(params.root, entry.path)).catch(() => void 0);
		if (existing?.isDirectory() && !existing.isSymbolicLink() && baseDirectories.has(entry.path) && await directoryContainsOnlyJournalPaths(params.root, entry.path, basePaths, baseDirectories)) continue;
		if (existing) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entry.path}`);
	}
	for (const entryPath of appliedDirectoryPaths) {
		if (baseDirectoryPaths.has(entryPath) || basePaths.has(entryPath)) continue;
		const node = await localWorkspaceNode(params.root, entryPath);
		if (node && !(node.type === "directory" && await directoryContainsOnlyDerivedWorkspaceEntries(params.root, entryPath))) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
	}
}
async function assertWorkspaceRecoveryDirectoriesRecoverable(params) {
	const baseDirectories = new Set(reconciliationDirectories(params.journal.baseDirectories));
	const appliedDirectories = new Set(reconciliationDirectories(params.journal.appliedDirectories));
	const baseEntries = new Map(reconciliationEntries(params.journal.baseEntries).map((entry) => [entry.path, entry]));
	const appliedEntries = new Map(reconciliationEntries(params.journal.appliedEntries).map((entry) => [entry.path, entry]));
	const appliedEntryPaths = new Set(appliedEntries.keys());
	const directoryPaths = /* @__PURE__ */ new Set([...baseDirectories, ...appliedDirectories]);
	for (const entryPath of directoryPaths) {
		const local = await localWorkspaceNode(params.root, entryPath);
		if (local?.type === "directory") {
			if (baseEntries.has(entryPath) && appliedDirectories.has(entryPath) && !await directoryContainsOnlyJournalPaths(params.root, entryPath, appliedEntryPaths, appliedDirectories)) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
			continue;
		}
		if (!local) {
			if (baseDirectories.has(entryPath) && appliedDirectories.has(entryPath)) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
			continue;
		}
		const baseEntry = baseEntries.get(entryPath);
		const appliedEntry = appliedEntries.get(entryPath);
		if (baseEntry && await entryMatches(params.root, baseEntry) || appliedEntry && await entryMatches(params.root, appliedEntry)) continue;
		throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
	}
}
async function restoreWorkspaceJournalDirectories(params) {
	const workspaceRoot = await root(params.root, { mode: 448 });
	const baseDirectories = reconciliationDirectories(params.journal.baseDirectories ?? []);
	const appliedDirectories = new Set(reconciliationDirectories(params.journal.appliedDirectories ?? []));
	for (const entryPath of baseDirectories.toSorted()) await workspaceRoot.mkdir(entryPath);
	const baseDirectoryPaths = new Set(baseDirectories);
	const baseEntryPaths = new Set(reconciliationEntries(params.journal.baseEntries).map((entry) => entry.path));
	for (const entryPath of [...appliedDirectories].toSorted((left, right) => right.localeCompare(left))) {
		if (baseDirectoryPaths.has(entryPath) || baseEntryPaths.has(entryPath)) continue;
		let children;
		try {
			children = await workspaceRoot.list(entryPath);
		} catch (error) {
			if (error instanceof FsSafeError && ["not-found", "path-alias"].includes(error.code)) continue;
			throw error;
		}
		if (children.length > 0) continue;
		try {
			await workspaceRoot.remove(entryPath);
		} catch (error) {
			if (error instanceof FsSafeError && ["not-found", "path-alias"].includes(error.code)) continue;
			if ((await workspaceRoot.list(entryPath).catch(() => void 0))?.length) continue;
			throw error;
		}
	}
}
async function recoverWorkerWorkspaceReconciliation(params) {
	if (params.journal.appliedManifestRef) throw new Error("Cloud workspace result is already applied and awaits fence acceptance");
	if (params.preservePaths?.size) throw new Error("Cloud workspace patch recovery cannot preserve partial paths");
	const root = await fs$1.realpath(params.root);
	validateJournalSnapshot(params.journal);
	try {
		await assertWorkspaceRecoveryBase({
			root,
			journal: params.journal
		});
		return;
	} catch {}
	await assertWorkspaceRecoveryDirectoriesRecoverable({
		root,
		journal: params.journal
	});
	const recoveryPatch = await createWorkspaceRecoveryPatch({
		root,
		journal: params.journal
	});
	await prepareNonDirectoryTargets(root, params.journal.baseEntries);
	await applyWorkspacePatch({
		root,
		patch: recoveryPatch
	});
	await restoreWorkspaceJournalDirectories({
		root,
		journal: params.journal
	});
	await assertWorkspaceRecoveryBase({
		root,
		journal: params.journal
	});
}
//#endregion
//#region src/gateway/worker-environments/workspace-reconcile-apply.ts
async function applyStagedWorkerWorkspace(params) {
	const root = await fs$1.realpath(params.root);
	const preserveDirectories = new Set(reconciliationDirectories(params.current.directories));
	const includePaths = params.current.baseCommit ? /* @__PURE__ */ new Set([...manifestNodes(params.base).keys(), ...manifestNodes(params.current).keys()]) : void 0;
	const preflight = await preflightWorkspaceApply({
		root,
		base: params.base,
		current: params.current
	});
	const changed = changedPaths(params.base, params.current);
	if (changed.size === 0) {
		const actual = await readActualWorkspaceManifest({
			root,
			baseCommit: params.current.baseCommit,
			preserveDirectories,
			includePaths
		});
		const finalPreflight = await preflightWorkspaceApply({
			root,
			base: params.base,
			current: params.current
		});
		await assertActualWorkspaceManifest({
			root,
			expectedRef: actual.manifestRef,
			baseCommit: actual.manifest.baseCommit,
			preserveDirectories,
			includePaths
		});
		const conflictPaths = retainedConflictPaths(finalPreflight, preflight.applyPaths);
		await params.publishAcceptedManifest?.({
			...actual,
			conflictPaths
		});
		params.journal.commit(actual.manifestRef);
		return {
			...actual,
			conflictPaths,
			verifyLocalStable: async () => await assertActualWorkspaceManifest({
				root,
				expectedRef: actual.manifestRef,
				baseCommit: actual.manifest.baseCommit,
				preserveDirectories,
				includePaths
			})
		};
	}
	const baseByPath = new Map(reconciliationEntries(params.base.entries).map((entry) => [entry.path, entry]));
	const currentByPath = new Map(reconciliationEntries(params.current.entries).map((entry) => [entry.path, entry]));
	const baseNodes = manifestNodes(params.base);
	const currentNodes = manifestNodes(params.current);
	const baseEntries = reconciliationEntries(params.base.entries).filter((entry) => changed.has(entry.path) && preflight.applyPaths.has(entry.path));
	const appliedEntries = [];
	for (const entry of reconciliationEntries(params.current.entries)) {
		if (!changed.has(entry.path) || !preflight.applyPaths.has(entry.path)) continue;
		if (!baseByPath.has(entry.path) && !hasReplacedBaseEntryAncestor(entry.path, baseByPath, currentByPath) && await entryMatches(root, entry)) continue;
		appliedEntries.push(entry);
	}
	const baseDirectories = [...preflight.applyPaths].filter((entryPath) => baseNodes.get(entryPath)?.type === "directory").toSorted();
	const appliedDirectories = [...preflight.applyPaths].filter((entryPath) => currentNodes.get(entryPath)?.type === "directory").toSorted();
	if (baseEntries.length + appliedEntries.length + baseDirectories.length + appliedDirectories.length > 25e3) throw new Error(`Cloud workspace reconciliation exceeds the ${MAX_RECONCILIATION_ENTRIES} entry limit`);
	const snapshot = await createWorkspacePatch({
		root,
		stagingRoot: params.stagingRoot,
		baseEntries,
		appliedEntries
	});
	const confirmedPreflight = await preflightWorkspaceApply({
		root,
		base: params.base,
		current: params.current
	});
	if (JSON.stringify([...confirmedPreflight.applyPaths].toSorted()) !== JSON.stringify([...preflight.applyPaths].toSorted()) || JSON.stringify(confirmedPreflight.conflictPaths) !== JSON.stringify(preflight.conflictPaths) || JSON.stringify(confirmedPreflight.blockingConflictPaths) !== JSON.stringify(preflight.blockingConflictPaths)) throw new ConcurrentWorkspacePathError("Gateway workspace changed while cloud reconciliation was being prepared");
	const journal = {
		version: 1,
		temporaryNonce: randomBytes(16).toString("hex"),
		baseManifestRef: params.baseManifestRef,
		currentManifestRef: params.currentManifestRef,
		baseEntries,
		appliedEntries,
		baseDirectories,
		appliedDirectories,
		baseTree: snapshot.baseTree,
		basePackSha256: createHash("sha256").update(snapshot.basePack).digest("hex"),
		basePack: snapshot.basePack
	};
	params.journal.begin(journal);
	try {
		await prepareNonDirectoryTargets(root, appliedEntries);
		await applyWorkspacePatch({
			root,
			patch: snapshot.patch
		});
		await applyWorkspaceDirectoryChanges({
			root,
			base: params.base,
			current: params.current,
			applyPaths: preflight.applyPaths
		});
		const actual = await readActualWorkspaceManifest({
			root,
			baseCommit: params.current.baseCommit,
			preserveDirectories,
			includePaths
		});
		const finalPreflight = await preflightWorkspaceApply({
			root,
			base: params.base,
			current: params.current
		});
		await assertActualWorkspaceManifest({
			root,
			expectedRef: actual.manifestRef,
			baseCommit: actual.manifest.baseCommit,
			preserveDirectories,
			includePaths
		});
		const conflictPaths = retainedConflictPaths(finalPreflight, preflight.applyPaths);
		await params.publishAcceptedManifest?.({
			...actual,
			conflictPaths
		});
		params.journal.commit(actual.manifestRef);
		return {
			...actual,
			conflictPaths,
			verifyLocalStable: async () => await assertActualWorkspaceManifest({
				root,
				expectedRef: actual.manifestRef,
				baseCommit: actual.manifest.baseCommit,
				preserveDirectories,
				includePaths
			})
		};
	} catch (error) {
		try {
			await recoverWorkerWorkspaceReconciliation({
				root,
				journal
			});
			params.journal.abort();
		} catch (rollbackError) {
			const recoveryError = new Error("Cloud reconciliation failed and rollback needs recovery", { cause: error });
			Object.defineProperty(recoveryError, "rollbackError", { value: rollbackError });
			throw recoveryError;
		}
		throw error;
	}
}
//#endregion
export { isDerivedWorkspacePath as S, serializeWorkerWorkspaceReconciliationPlan as _, changedPaths as a, DERIVED_WORKSPACE_FILE_SUFFIXES as b, absoluteEntryMatches as c, MAX_RECONCILIATION_ENTRIES as d, MAX_RECONCILIATION_FILE_BYTES as f, serializeWorkerWorkspaceManifest as g, parseWorkerWorkspaceReconciliationPlan as h, assertWorkspaceResultStable as i, localPath as l, parseWorkerWorkspaceManifest as m, recoverWorkerWorkspaceReconciliation as n, inspectAcceptedWorkerWorkspace as o, MAX_RECONCILIATION_TOTAL_BYTES as p, assertWorkspaceMatchesManifest as r, manifestNodes as s, applyStagedWorkerWorkspace as t, reconciliationEntries as u, DERIVED_WORKSPACE_DIRECTORY_NAMES as v, DERIVED_WORKSPACE_RSYNC_EXCLUDES as x, DERIVED_WORKSPACE_FILE_NAMES as y };
