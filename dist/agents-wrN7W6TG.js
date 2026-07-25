import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { C as FsSafeError, i as isPathInside } from "./path-DILYn_gk.js";
import { u as movePathToTrash } from "./fs-safe-Dy0g6QwA.js";
import { a as root } from "./secure-temp-dir-D6Ou0J-U.js";
import "./utils-K2PjeLaV.js";
import "./path-guards-BrHe7pxx.js";
import { g as resolveSqliteDatabaseFilePaths } from "./openclaw-state-db-DkOMT2fb.js";
import "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { t as DEFAULT_AGENT_ID } from "./session-key-Drrs61Fd.js";
import { a as unregisterResolvedAgentDir, i as resolveRegisteredAgentIdForDir, n as normalizeAgentDirRegistryPath, r as registerResolvedAgentDir, t as isPathOwnedByAnotherRegisteredAgent } from "./agent-dir-registry-BO7DCtJc.js";
import { a as resolveAgentDir, n as listAgentIds, o as resolveAgentWorkspaceDir, t as listAgentEntries } from "./agent-scope-config-S7z_Yn4H.js";
import { d as readConfigFileSnapshotForWrite } from "./io-CEgS2K9F.js";
import { n as mutateConfigFileWithRetry, o as withConfigMutationExclusive } from "./config-BOMcY2yX.js";
import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { s as readAgentDeletionJournal } from "./agent-deletion-journal-DcL0of65.js";
import { F as unregisterOpenClawAgentDatabase, P as listOpenClawRegisteredAgentDatabases, R as resolveOpenClawAgentSqlitePath, r as closeOpenClawAgentDatabaseByPath, z as assertNoOpenClawAgentDatabaseLeases } from "./openclaw-agent-db-BZ3-lIlN.js";
import { c as resolveSessionTranscriptsDirForAgent } from "./paths-BpMRJ7TJ.js";
import { a as DEFAULT_MEMORY_FILENAME, c as DEFAULT_USER_FILENAME, d as ensureAgentWorkspace, i as DEFAULT_IDENTITY_FILENAME, m as isWorkspaceSetupCompleted, n as DEFAULT_BOOTSTRAP_FILENAME, o as DEFAULT_SOUL_FILENAME, r as DEFAULT_HEARTBEAT_FILENAME, s as DEFAULT_TOOLS_FILENAME, t as DEFAULT_AGENTS_FILENAME } from "./workspace-GYctLxSN.js";
import { a as deleteWorkspaceState, s as prepareWorkspaceStateDeletion } from "./workspace-state-store-CJi45lE9.js";
import { c as prepareLegacyWorkspaceStateReset, l as removeLegacyWorkspaceStateForReset } from "./workspace-legacy-state-BPkp3711.js";
import { t as purgeAgentSessionStoreEntries } from "./sessions-Uqhj6EXw.js";
import { o as listAgentsForGateway } from "./session-utils-CEU0rCPC.js";
import { i as claimCompletedAgentDeletion, n as AgentDeletionCommitUncertainError, r as beginAgentDeletion, t as AgentDeletionAuthorityRollbackError } from "./agent-lifecycle-registry-CkmkoYeX.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { it as withAgentExecApprovalsRemoved } from "./exec-approvals-BWcbplqx.js";
import { a as validateAgentsDeleteParams, c as validateAgentsFilesSetParams, i as validateAgentsCreateParams, l as validateAgentsListParams, o as validateAgentsFilesGetParams, s as validateAgentsFilesListParams, u as validateAgentsUpdateParams } from "./src-Cy32TawB.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
import { n as resolveAgentIdentity } from "./identity-DV846zOa.js";
import "./browser-maintenance-Ed_3rZlb.js";
import { a as mergeIdentityMarkdownContent, o as normalizeIdentityForFile, s as sanitizeAgentIdentityLine, t as createAgentIdentityConfig } from "./identity-file-CXrnLY30.js";
import { a as pruneAgentConfig, r as findAgentEntryIndex, t as applyAgentConfig } from "./agents.config-Bo0GN9nk.js";
import { t as createAgent } from "./agent-create-B15GkWI9.js";
import { t as loadOptionalServerMethodModelCatalog } from "./optional-model-catalog-CB9dD03E.js";
import { t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-7Oxg1rUI.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/gateway/server-methods/agents-config-mutations.ts
/** Typed precondition failure surfaced by agent mutation handlers as gateway errors. */
var AgentConfigPreconditionError = class extends Error {};
/** Checks the current config snapshot for a concrete agent entry. */
function isConfiguredAgent(cfg, agentId) {
	return findAgentEntryIndex(listAgentEntries(cfg), agentId) >= 0;
}
/** Updates an existing agent entry while preserving omitted fields. */
async function updateAgentConfigEntry(params) {
	await mutateConfigFileWithRetry({
		afterWrite: { mode: "auto" },
		mutate: (draft) => {
			if (!isConfiguredAgent(draft, params.agentId)) throw new AgentConfigPreconditionError(`agent "${params.agentId}" not found`);
			const latestNextConfig = applyAgentConfig(draft, {
				agentId: params.agentId,
				...params.name ? { name: params.name } : {},
				...params.workspace ? { workspace: params.workspace } : {},
				...params.model !== void 0 ? { model: params.model } : {},
				...params.identity ? { identity: params.identity } : {}
			});
			Object.assign(draft, latestNextConfig);
		}
	});
}
/** Removes an agent entry and returns filesystem roots the caller should clean up. */
async function deleteAgentConfigEntry(params) {
	const committed = await mutateConfigFileWithRetry({
		afterWrite: { mode: "auto" },
		mutate: (draft) => {
			if (!isConfiguredAgent(draft, params.agentId)) throw new AgentConfigPreconditionError(`agent "${params.agentId}" not found`);
			const workspaceDir = resolveAgentWorkspaceDir(draft, params.agentId);
			const agentDir = resolveAgentDir(draft, params.agentId);
			const sessionsDir = resolveSessionTranscriptsDirForAgent(params.agentId);
			const result = pruneAgentConfig(draft, params.agentId);
			Object.assign(draft, result.config);
			return {
				workspaceDir,
				agentDir,
				sessionsDir,
				removedBindings: result.removedBindings
			};
		}
	});
	return {
		nextConfig: committed.nextConfig,
		result: committed.result
	};
}
//#endregion
//#region src/gateway/server-methods/agents.ts
const BOOTSTRAP_FILE_NAMES = [
	DEFAULT_AGENTS_FILENAME,
	DEFAULT_SOUL_FILENAME,
	DEFAULT_TOOLS_FILENAME,
	DEFAULT_IDENTITY_FILENAME,
	DEFAULT_USER_FILENAME,
	DEFAULT_HEARTBEAT_FILENAME,
	DEFAULT_BOOTSTRAP_FILENAME
];
const BOOTSTRAP_FILE_NAMES_POST_ONBOARDING = BOOTSTRAP_FILE_NAMES.filter((name) => name !== DEFAULT_BOOTSTRAP_FILENAME);
const agentsHandlerDeps = {
	root,
	isWorkspaceSetupCompleted
};
const testing = {
	setDepsForTests(overrides) {
		if (overrides.isWorkspaceSetupCompleted) agentsHandlerDeps.isWorkspaceSetupCompleted = overrides.isWorkspaceSetupCompleted;
		if (overrides.root) agentsHandlerDeps.root = overrides.root;
	},
	resetDepsForTests() {
		agentsHandlerDeps.root = root;
		agentsHandlerDeps.isWorkspaceSetupCompleted = isWorkspaceSetupCompleted;
	}
};
const MEMORY_FILE_NAMES = [DEFAULT_MEMORY_FILENAME];
const ALLOWED_FILE_NAMES = /* @__PURE__ */ new Set([...BOOTSTRAP_FILE_NAMES, ...MEMORY_FILE_NAMES]);
function resolveAgentWorkspaceFileOrRespondError(params, respond, cfg) {
	const rawAgentId = params.agentId;
	const agentId = resolveAgentIdOrError(typeof rawAgentId === "string" || typeof rawAgentId === "number" ? String(rawAgentId) : "", cfg);
	if (!agentId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown agent id"));
		return null;
	}
	const rawName = params.name;
	const name = (typeof rawName === "string" || typeof rawName === "number" ? String(rawName) : "").trim();
	if (!ALLOWED_FILE_NAMES.has(name)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unsupported file "${name}"`));
		return null;
	}
	return {
		cfg,
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId),
		name
	};
}
function isRegularWorkspaceFileStat(stat) {
	const isFile = typeof stat.isFile === "function" ? stat.isFile() : stat.isFile;
	const isSymbolicLink = typeof stat.isSymbolicLink === "function" ? stat.isSymbolicLink() : stat.isSymbolicLink;
	return isFile && !isSymbolicLink && stat.nlink <= 1;
}
function toWorkspaceFileMeta(stat) {
	if (!isRegularWorkspaceFileStat(stat)) return null;
	return {
		size: stat.size,
		updatedAtMs: Math.floor(stat.mtimeMs)
	};
}
async function statWorkspaceFileSafely(workspaceRoot, workspaceDir, name) {
	try {
		return toWorkspaceFileMeta(workspaceRoot ? await workspaceRoot.stat(name) : await fs.lstat(path.join(workspaceDir, name)));
	} catch {
		if (!workspaceRoot) return null;
		try {
			return toWorkspaceFileMeta(await fs.lstat(path.join(workspaceDir, name)));
		} catch {
			return null;
		}
	}
}
async function openWorkspaceRootSafely(workspaceDir) {
	try {
		return await agentsHandlerDeps.root(workspaceDir);
	} catch {
		return null;
	}
}
async function listAgentFiles(workspaceDir, options) {
	const files = [];
	const workspaceRoot = await openWorkspaceRootSafely(workspaceDir);
	if (!workspaceRoot) return [...options?.hideBootstrap ? BOOTSTRAP_FILE_NAMES_POST_ONBOARDING : BOOTSTRAP_FILE_NAMES, DEFAULT_MEMORY_FILENAME].map((name) => ({
		name,
		path: path.join(workspaceDir, name),
		missing: true
	}));
	const bootstrapFileNames = options?.hideBootstrap ? BOOTSTRAP_FILE_NAMES_POST_ONBOARDING : BOOTSTRAP_FILE_NAMES;
	for (const name of bootstrapFileNames) {
		const filePath = path.join(workspaceDir, name);
		const meta = await statWorkspaceFileSafely(workspaceRoot, workspaceDir, name);
		if (meta) files.push({
			name,
			path: filePath,
			missing: false,
			size: meta.size,
			updatedAtMs: meta.updatedAtMs
		});
		else files.push({
			name,
			path: filePath,
			missing: true
		});
	}
	const primaryMeta = await statWorkspaceFileSafely(workspaceRoot, workspaceDir, DEFAULT_MEMORY_FILENAME);
	if (primaryMeta) files.push({
		name: DEFAULT_MEMORY_FILENAME,
		path: path.join(workspaceDir, DEFAULT_MEMORY_FILENAME),
		missing: false,
		size: primaryMeta.size,
		updatedAtMs: primaryMeta.updatedAtMs
	});
	else files.push({
		name: DEFAULT_MEMORY_FILENAME,
		path: path.join(workspaceDir, DEFAULT_MEMORY_FILENAME),
		missing: true
	});
	return files;
}
function resolveAgentIdOrError(agentIdRaw, cfg) {
	const agentId = normalizeAgentId(agentIdRaw);
	if (!new Set(listAgentIds(cfg)).has(agentId)) return null;
	return agentId;
}
function respondInvalidMethodParams(respond, method, errors) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params: ${formatValidationErrors(errors)}`));
}
function respondAgentNotFound(respond, agentId) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agent "${agentId}" not found`));
}
var AgentCleanupIdentityMismatchError = class extends Error {};
function cleanupFailure(pathname, error) {
	return { failed: {
		path: pathname,
		reason: (error instanceof Error && error.message ? error.message : String(error)) || "unknown error"
	} };
}
function cleanupPathIdentity(stat) {
	if (typeof stat?.dev !== "number" && typeof stat?.dev !== "bigint" || typeof stat.ino !== "number" && typeof stat.ino !== "bigint") return null;
	const dev = Number(stat.dev);
	const ino = Number(stat.ino);
	if (!Number.isSafeInteger(dev) || !Number.isSafeInteger(ino)) throw new Error("cleanup path identity exceeds the safe integer range");
	return {
		dev,
		ino
	};
}
async function statAgentCleanupPath(cleanupPath) {
	const parentPath = cleanupPath.parentPath;
	const parentRoot = await agentsHandlerDeps.root(parentPath, {
		hardlinks: "reject",
		symlinks: "reject"
	});
	if (path.resolve(parentRoot.rootReal) !== parentPath) throw new FsSafeError("path-mismatch", "cleanup path parent changed before deletion");
	const stat = await parentRoot.stat(path.basename(cleanupPath.trashPath));
	if (stat.isSymbolicLink !== (cleanupPath.kind === "symlink")) throw new AgentCleanupIdentityMismatchError(`cleanup path changed from ${cleanupPath.kind} before deletion`);
	if (stat.isFile && stat.nlink > 1) throw new AgentCleanupIdentityMismatchError("hardlinked cleanup replacement preserved");
	const identity = cleanupPathIdentity(stat);
	if (cleanupPath.preparedIdentity === null) {
		if (identity !== null) throw new AgentCleanupIdentityMismatchError("cleanup path appeared after deletion preparation");
	} else if (identity === null || identity.dev !== cleanupPath.preparedIdentity.dev || identity.ino !== cleanupPath.preparedIdentity.ino) throw new AgentCleanupIdentityMismatchError("cleanup path identity changed before deletion");
}
function isMissingCleanupPathError(error) {
	return error instanceof FsSafeError && error.code === "not-found" || error.code === "ENOENT";
}
async function removeAgentPath(cleanupPath) {
	const pathname = cleanupPath.path;
	const trashPath = cleanupPath.trashPath;
	try {
		await statAgentCleanupPath(cleanupPath);
	} catch (error) {
		if (error instanceof AgentCleanupIdentityMismatchError) return { skipped: {
			path: pathname,
			reason: error.message
		} };
		return isMissingCleanupPathError(error) ? { removed: {
			path: pathname,
			method: "missing"
		} } : cleanupFailure(pathname, error);
	}
	try {
		await movePathToTrash(trashPath);
		return { removed: {
			path: pathname,
			method: "trash"
		} };
	} catch (error) {
		if (error.code !== "ENOENT") return cleanupFailure(pathname, error);
		try {
			await statAgentCleanupPath(cleanupPath);
			return cleanupFailure(pathname, error);
		} catch (statError) {
			return isMissingCleanupPathError(statError) ? { removed: {
				path: pathname,
				method: "missing"
			} } : cleanupFailure(pathname, statError);
		}
	}
}
async function resolveAgentDeleteCleanupTarget(pathname) {
	let candidate = path.resolve(pathname);
	const missingSuffix = [];
	while (true) try {
		return path.resolve(await fs.realpath(candidate), ...missingSuffix);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		let candidateStat;
		try {
			candidateStat = await fs.lstat(candidate);
		} catch (statError) {
			if (statError.code !== "ENOENT") throw statError;
		}
		if (candidateStat?.isSymbolicLink()) {
			const linkTarget = await fs.readlink(candidate);
			const resolvedLinkTarget = await resolveAgentDeleteCleanupTarget(path.isAbsolute(linkTarget) ? linkTarget : path.resolve(path.dirname(candidate), linkTarget));
			return path.resolve(resolvedLinkTarget, ...missingSuffix);
		}
		const parent = path.dirname(candidate);
		if (parent === candidate) throw error;
		missingSuffix.unshift(path.basename(candidate));
		candidate = parent;
	}
}
async function prepareAgentDeleteCleanupPaths(paths, persistedPaths = []) {
	const uniquePaths = /* @__PURE__ */ new Map();
	const addPath = (candidate) => {
		const existing = uniquePaths.get(candidate.trashPath);
		if (!existing) {
			uniquePaths.set(candidate.trashPath, candidate);
			return;
		}
		existing.sourcePaths = [.../* @__PURE__ */ new Set([...existing.sourcePaths, ...candidate.sourcePaths])];
		existing.done ||= candidate.done;
		existing.note ??= candidate.note;
		existing.preparationError ??= candidate.preparationError;
		if (candidate.kind === "target") {
			existing.kind = "target";
			existing.canonicalPath = candidate.canonicalPath;
			existing.parentPath = candidate.parentPath;
			existing.trashCoversDescendants ||= candidate.trashCoversDescendants;
		}
	};
	if (persistedPaths.length > 0) for (const persistedPath of persistedPaths) {
		const journalPath = path.resolve(persistedPath.path);
		const trashPath = path.resolve(persistedPath.canonicalPath);
		addPath({
			path: journalPath,
			parentPath: path.resolve(persistedPath.parentPath),
			canonicalPath: normalizeAgentDirRegistryPath(trashPath),
			trashPath,
			trashCoversDescendants: persistedPath.coversDescendants,
			kind: persistedPath.kind,
			preparedIdentity: persistedPath.dev === null || persistedPath.ino === null ? null : {
				dev: persistedPath.dev,
				ino: persistedPath.ino
			},
			done: persistedPath.done,
			note: persistedPath.note,
			sourcePaths: persistedPath.sourcePaths.map((sourcePath) => path.resolve(sourcePath))
		});
	}
	for (const pathname of paths) {
		const sourcePath = path.resolve(pathname);
		let sourceParentPath = path.dirname(sourcePath);
		let resolvedPath = sourcePath;
		let preparationError;
		try {
			resolvedPath = await resolveAgentDeleteCleanupTarget(pathname);
			sourceParentPath = await resolveAgentDeleteCleanupTarget(path.dirname(sourcePath));
		} catch (error) {
			preparationError = error;
		}
		let sourceStat;
		try {
			sourceStat = await fs.lstat(pathname);
		} catch (error) {
			if (error.code !== "ENOENT") preparationError ??= error;
		}
		let targetStat = sourceStat;
		if (resolvedPath !== sourcePath) try {
			targetStat = await fs.lstat(resolvedPath);
		} catch (error) {
			if (error.code !== "ENOENT") preparationError ??= error;
			targetStat = void 0;
		}
		const canonicalPath = normalizeAgentDirRegistryPath(resolvedPath);
		let trashCoversDescendants = false;
		if (targetStat) trashCoversDescendants = !targetStat.isSymbolicLink();
		addPath({
			path: resolvedPath,
			parentPath: path.dirname(resolvedPath),
			canonicalPath,
			trashPath: resolvedPath,
			trashCoversDescendants,
			kind: "target",
			preparedIdentity: cleanupPathIdentity(targetStat),
			done: false,
			preparationError,
			sourcePaths: [sourcePath]
		});
		if (sourceStat?.isSymbolicLink() && sourcePath !== resolvedPath) addPath({
			path: sourcePath,
			parentPath: sourceParentPath,
			canonicalPath,
			trashPath: path.join(sourceParentPath, path.basename(sourcePath)),
			trashCoversDescendants: false,
			kind: "symlink",
			preparedIdentity: cleanupPathIdentity(sourceStat),
			done: false,
			sourcePaths: [sourcePath]
		});
	}
	const depth = (pathname) => path.relative(path.parse(pathname).root, pathname).split(path.sep).filter(Boolean).length;
	const cleanupDepth = (cleanupPath) => Math.max(depth(cleanupPath.canonicalPath), depth(cleanupPath.trashPath), ...cleanupPath.sourcePaths.map(depth));
	const compareFallback = (left, right) => {
		if (left.kind !== right.kind) return left.kind === "target" ? -1 : 1;
		const depthDifference = cleanupDepth(right) - cleanupDepth(left);
		if (depthDifference !== 0) return depthDifference;
		return depth(right.trashPath) - depth(left.trashPath) || left.trashPath.localeCompare(right.trashPath);
	};
	const mustPrecede = (left, right) => {
		if (left.kind !== right.kind) return left.kind === "target";
		if (isPathInside(right.trashPath, left.trashPath)) return true;
		if (isPathInside(left.trashPath, right.trashPath)) return false;
		const rightRoots = [right.trashPath, ...right.sourcePaths];
		return left.sourcePaths.some((leftSource) => rightRoots.some((rightRoot) => isPathInside(rightRoot, leftSource)));
	};
	const remaining = [...uniquePaths.values()].toSorted(compareFallback);
	const ordered = [];
	while (remaining.length > 0) {
		const nextIndex = remaining.findIndex((candidate, candidateIndex) => remaining.every((other, otherIndex) => otherIndex === candidateIndex || !mustPrecede(other, candidate)));
		ordered.push(...remaining.splice(Math.max(0, nextIndex), 1));
	}
	return ordered;
}
function cleanupPathCovers(cleanupPath, targetPath, canonicalTargetPath) {
	const trashTargetPath = path.resolve(targetPath);
	return cleanupPath.sourcePaths.includes(trashTargetPath) || cleanupPath.trashPath === trashTargetPath || cleanupPath.trashCoversDescendants && (cleanupPath.kind === "target" || isPathInside(cleanupPath.trashPath, trashTargetPath)) && isPathInside(cleanupPath.canonicalPath, canonicalTargetPath);
}
function resolveSurvivingDatabaseFilePaths(registeredDatabases, agentId) {
	return [...new Set(registeredDatabases.filter((entry) => normalizeAgentId(entry.agentId) !== agentId).flatMap((entry) => resolveSqliteDatabaseFilePaths(entry.path)).map((pathname) => normalizeAgentDirRegistryPath(pathname)))];
}
function isPathOwnedBySurvivingAgent(cfg, agentId, pathname, survivingDatabaseFilePaths = []) {
	const canonicalPath = normalizeAgentDirRegistryPath(pathname);
	return isPathOwnedByAnotherRegisteredAgent({
		agentId,
		pathname
	}) || findOverlappingWorkspaceAgentIds(cfg, agentId, pathname).length > 0 || survivingDatabaseFilePaths.some((databasePath) => databasePath === canonicalPath || isPathInside(databasePath, canonicalPath) || isPathInside(canonicalPath, databasePath));
}
function prepareAgentDeleteDatabases(cfg, agentId, agentDir) {
	const registeredDatabases = listOpenClawRegisteredAgentDatabases();
	const survivingDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(registeredDatabases, agentId);
	const registeredDatabasePaths = /* @__PURE__ */ new Set([resolveOpenClawAgentSqlitePath({
		agentId,
		path: path.join(agentDir, "openclaw-agent.sqlite")
	}), ...registeredDatabases.filter((entry) => normalizeAgentId(entry.agentId) === agentId).map((entry) => entry.path)]);
	const databasePaths = [...registeredDatabasePaths].filter((pathname) => resolveSqliteDatabaseFilePaths(pathname).every((filePath) => !isPathOwnedBySurvivingAgent(cfg, agentId, filePath, survivingDatabaseFilePaths)));
	for (const databasePath of databasePaths) closeOpenClawAgentDatabaseByPath(databasePath);
	assertNoOpenClawAgentDatabaseLeases(agentId);
	const fileGroups = databasePaths.map(resolveSqliteDatabaseFilePaths);
	const relocatedFileGroups = fileGroups.filter((fileGroup) => {
		const relative = path.relative(agentDir, fileGroup[0] ?? agentDir);
		return relative.startsWith("..") || path.isAbsolute(relative);
	});
	return {
		paths: databasePaths,
		registrationPaths: [...registeredDatabasePaths],
		fileGroups,
		relocatedFileGroups
	};
}
function unregisterAgentDeleteDatabases(agentId, databasePaths) {
	for (const databasePath of databasePaths) unregisterOpenClawAgentDatabase({
		agentId,
		path: databasePath
	});
}
function prepareJournaledAgentDirOwnership(cfg, agentId, agentDir) {
	for (const configuredAgentId of listAgentIds(cfg)) resolveAgentDir(cfg, configuredAgentId);
	if (resolveRegisteredAgentIdForDir(agentDir) !== void 0) return;
	registerResolvedAgentDir({
		agentId,
		agentDir
	});
}
function respondWorkspaceFileUnsafe(respond, name) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unsafe workspace file "${name}"`));
}
function respondWorkspaceFileMissing(params) {
	params.respond(true, {
		agentId: params.agentId,
		workspace: params.workspaceDir,
		file: {
			name: params.name,
			path: params.filePath,
			missing: true
		}
	}, void 0);
}
async function writeWorkspaceFileOrRespond(params) {
	await fs.mkdir(params.workspaceDir, { recursive: true });
	try {
		await (await agentsHandlerDeps.root(params.workspaceDir)).write(params.name, params.content, { encoding: "utf8" });
	} catch (err) {
		if (err instanceof FsSafeError) {
			respondWorkspaceFileUnsafe(params.respond, params.name);
			return false;
		}
		throw err;
	}
	return true;
}
async function readWorkspaceFileContent(workspaceDir, name) {
	try {
		return (await (await agentsHandlerDeps.root(workspaceDir)).read(name, {
			hardlinks: "reject",
			nonBlockingRead: true
		})).buffer.toString("utf-8");
	} catch (err) {
		if (err instanceof FsSafeError && err.code === "not-found") return;
		throw err;
	}
}
async function buildIdentityMarkdownForWrite(params) {
	let baseContent;
	if (params.preferFallbackWorkspaceContent && params.fallbackWorkspaceDir) {
		baseContent = await readWorkspaceFileContent(params.fallbackWorkspaceDir, DEFAULT_IDENTITY_FILENAME);
		if (baseContent === void 0) baseContent = await readWorkspaceFileContent(params.workspaceDir, DEFAULT_IDENTITY_FILENAME);
	} else {
		baseContent = await readWorkspaceFileContent(params.workspaceDir, DEFAULT_IDENTITY_FILENAME);
		if (baseContent === void 0 && params.fallbackWorkspaceDir) baseContent = await readWorkspaceFileContent(params.fallbackWorkspaceDir, DEFAULT_IDENTITY_FILENAME);
	}
	return mergeIdentityMarkdownContent(baseContent, params.identity);
}
async function buildIdentityMarkdownOrRespondUnsafe(params) {
	try {
		return await buildIdentityMarkdownForWrite(params);
	} catch (err) {
		if (err instanceof FsSafeError) {
			respondWorkspaceFileUnsafe(params.respond, DEFAULT_IDENTITY_FILENAME);
			return null;
		}
		throw err;
	}
}
const agentsHandlers = {
	"agents.list": async ({ params, respond, context }) => {
		if (!validateAgentsListParams(params)) {
			respondInvalidMethodParams(respond, "agents.list", validateAgentsListParams.errors);
			return;
		}
		respond(true, listAgentsForGateway(context.getRuntimeConfig(), await loadOptionalServerMethodModelCatalog(context, "agents.list", { logOnceKey: "agents.list" })), void 0);
	},
	"agents.create": async ({ params, respond }) => {
		if (!validateAgentsCreateParams(params)) {
			respondInvalidMethodParams(respond, "agents.create", validateAgentsCreateParams.errors);
			return;
		}
		const result = await createAgent({
			name: params.name,
			workspace: params.workspace,
			model: params.model,
			emoji: params.emoji,
			avatar: params.avatar
		});
		if (result.status === "error") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, result.message));
			return;
		}
		respond(true, {
			ok: true,
			agentId: result.agentId,
			name: result.name,
			workspace: result.workspace,
			...result.model ? { model: result.model } : {}
		}, void 0);
	},
	"agents.update": async ({ params, respond, context }) => {
		if (!validateAgentsUpdateParams(params)) {
			respondInvalidMethodParams(respond, "agents.update", validateAgentsUpdateParams.errors);
			return;
		}
		const cfg = context.getRuntimeConfig();
		const agentId = normalizeAgentId(params.agentId);
		if (!isConfiguredAgent(cfg, agentId)) {
			respondAgentNotFound(respond, agentId);
			return;
		}
		const workspaceDir = typeof params.workspace === "string" && params.workspace.trim() ? resolveUserPath(params.workspace.trim()) : void 0;
		const model = params.model === null ? null : normalizeOptionalString(params.model);
		const safeName = typeof params.name === "string" && params.name.trim() ? sanitizeAgentIdentityLine(params.name.trim()) : void 0;
		const identity = createAgentIdentityConfig({
			name: safeName,
			emoji: params.emoji,
			avatar: params.avatar
		});
		const hasIdentityFields = Boolean(identity);
		const agentConfigUpdate = {
			agentId,
			...safeName ? { name: safeName } : {},
			...workspaceDir ? { workspace: workspaceDir } : {},
			...model !== void 0 ? { model } : {},
			...identity ? { identity } : {}
		};
		const nextConfig = applyAgentConfig(cfg, agentConfigUpdate);
		let ensuredWorkspace;
		if (workspaceDir) ensuredWorkspace = await ensureAgentWorkspace({
			dir: workspaceDir,
			ensureBootstrapFiles: !Boolean(nextConfig.agents?.defaults?.skipBootstrap),
			skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles
		});
		const persistedIdentity = normalizeIdentityForFile(resolveAgentIdentity(nextConfig, agentId));
		if (persistedIdentity && (workspaceDir || hasIdentityFields)) {
			const identityWorkspaceDir = resolveAgentWorkspaceDir(nextConfig, agentId);
			const previousWorkspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
			const fallbackWorkspaceDir = workspaceDir && identityWorkspaceDir !== previousWorkspaceDir ? previousWorkspaceDir : void 0;
			const identityContent = await buildIdentityMarkdownOrRespondUnsafe({
				respond,
				workspaceDir: identityWorkspaceDir,
				identity: persistedIdentity,
				fallbackWorkspaceDir,
				preferFallbackWorkspaceContent: Boolean(fallbackWorkspaceDir) && ensuredWorkspace?.identityPathCreated === true
			});
			if (identityContent === null) return;
			if (!await writeWorkspaceFileOrRespond({
				respond,
				workspaceDir: identityWorkspaceDir,
				name: "IDENTITY.md",
				content: identityContent
			})) return;
		}
		try {
			await updateAgentConfigEntry(agentConfigUpdate);
		} catch (error) {
			if (error instanceof AgentConfigPreconditionError) {
				respondAgentNotFound(respond, agentId);
				return;
			}
			throw error;
		}
		respond(true, {
			ok: true,
			agentId
		}, void 0);
	},
	"agents.delete": async ({ params, respond, context }) => {
		if (!validateAgentsDeleteParams(params)) {
			respondInvalidMethodParams(respond, "agents.delete", validateAgentsDeleteParams.errors);
			return;
		}
		const cfg = context.getRuntimeConfig();
		const agentId = normalizeAgentId(params.agentId);
		if (agentId === "main") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `"${DEFAULT_AGENT_ID}" cannot be deleted`));
			return;
		}
		const existingJournal = readAgentDeletionJournal(agentId);
		if (!isConfiguredAgent(cfg, agentId) && (!existingJournal || existingJournal.cleanupCompleted)) {
			respondAgentNotFound(respond, agentId);
			return;
		}
		const requestedDeleteFiles = typeof params.deleteFiles === "boolean" ? params.deleteFiles : true;
		try {
			respond(true, await withConfigMutationExclusive(async (lockedConfig) => {
				let lockedJournal = readAgentDeletionJournal(agentId);
				const configured = isConfiguredAgent(lockedConfig, agentId);
				if (!configured && (!lockedJournal || lockedJournal.cleanupCompleted)) throw new AgentConfigPreconditionError(`agent "${agentId}" not found`);
				if (configured && lockedJournal?.cleanupCompleted) {
					const claimed = claimCompletedAgentDeletion(agentId, lockedJournal.operationId);
					const remainingJournal = readAgentDeletionJournal(agentId);
					if (!claimed && remainingJournal) throw new Error(`agent "${agentId}" deletion tombstone changed before fresh deletion`);
					lockedJournal = void 0;
				}
				const deleteFiles = lockedJournal?.deleteFiles ?? requestedDeleteFiles;
				const deletion = beginAgentDeletion(lockedJournal ?? {
					agentId,
					agentDir: resolveAgentDir(lockedConfig, agentId),
					workspaceDir: resolveAgentWorkspaceDir(lockedConfig, agentId),
					sessionsDir: resolveSessionTranscriptsDirForAgent(agentId),
					deleteFiles
				});
				const journal = deletion.entry;
				let rosterCommitted = !configured;
				let committed;
				let databasePlan;
				try {
					prepareJournaledAgentDirOwnership(lockedConfig, agentId, journal.agentDir);
					databasePlan = prepareAgentDeleteDatabases(lockedConfig, agentId, journal.agentDir);
					deletion.fenceDatabasePaths([...journal.databasePaths, ...databasePlan.fileGroups.flat()]);
					if (deleteFiles) {
						const fencedSourcePaths = new Set(journal.cleanupPaths.flatMap((cleanupPath) => cleanupPath.sourcePaths.map((sourcePath) => path.resolve(sourcePath))));
						const unfencedSourcePaths = [
							journal.workspaceDir,
							journal.agentDir,
							journal.sessionsDir,
							...journal.databasePaths
						].filter((sourcePath) => !fencedSourcePaths.has(path.resolve(sourcePath)));
						if (unfencedSourcePaths.length > 0) {
							const unfencedSourcePathSet = new Set(unfencedSourcePaths.map((sourcePath) => path.resolve(sourcePath)));
							const cleanupPlan = await prepareAgentDeleteCleanupPaths(unfencedSourcePaths, journal.cleanupPaths);
							const unresolvedPath = cleanupPlan.find((cleanupPath) => cleanupPath.preparationError !== void 0 && cleanupPath.sourcePaths.some((sourcePath) => unfencedSourcePathSet.has(path.resolve(sourcePath))));
							if (unresolvedPath) throw unresolvedPath.preparationError;
							deletion.fenceCleanupPaths(cleanupPlan.map(({ path: cleanupPath, trashPath, parentPath, kind, preparedIdentity, trashCoversDescendants, done, note, sourcePaths }) => {
								const journalPath = {
									path: cleanupPath,
									canonicalPath: trashPath,
									parentPath,
									kind,
									sourcePaths,
									dev: preparedIdentity?.dev ?? null,
									ino: preparedIdentity?.ino ?? null,
									coversDescendants: trashCoversDescendants,
									done
								};
								if (note) journalPath.note = note;
								return journalPath;
							}));
						}
					}
					await context.cron.removeAgentJobsTransactional(agentId, async () => await withAgentExecApprovalsRemoved(agentId, async () => {
						if (!rosterCommitted) {
							try {
								committed = await deleteAgentConfigEntry({ agentId });
							} catch (error) {
								try {
									if (!isConfiguredAgent((await readConfigFileSnapshotForWrite()).snapshot.sourceConfig, agentId)) {
										rosterCommitted = true;
										throw new AgentDeletionCommitUncertainError(error);
									}
								} catch (readError) {
									if (readError instanceof AgentDeletionCommitUncertainError) throw readError;
									throw new AgentDeletionCommitUncertainError(error);
								}
								throw error;
							}
							if (!committed.result) {
								rosterCommitted = !isConfiguredAgent(committed.nextConfig, agentId);
								const missingResultError = /* @__PURE__ */ new Error("agent delete config mutation did not return its target");
								if (rosterCommitted) throw new AgentDeletionCommitUncertainError(missingResultError);
								throw missingResultError;
							}
							rosterCommitted = true;
						}
					}));
					deletion.commit();
				} catch (error) {
					let canReleaseFence = !rosterCommitted && !lockedJournal && !(error instanceof AgentDeletionAuthorityRollbackError) && !(error instanceof AgentDeletionCommitUncertainError);
					if (canReleaseFence) try {
						canReleaseFence = isConfiguredAgent((await readConfigFileSnapshotForWrite()).snapshot.sourceConfig, agentId);
					} catch {
						canReleaseFence = false;
					}
					if (canReleaseFence) deletion.rollback();
					throw error;
				}
				const deleteResult = committed?.result ?? {
					agentDir: journal.agentDir,
					workspaceDir: journal.workspaceDir,
					sessionsDir: journal.sessionsDir,
					removedBindings: 0
				};
				const nextConfig = committed?.nextConfig ?? lockedConfig;
				const agentDirRegistryPath = normalizeAgentDirRegistryPath(deleteResult.agentDir);
				await purgeAgentSessionStoreEntries(lockedConfig, agentId);
				const removed = [];
				const failed = [];
				if (deleteFiles) {
					const survivingDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(listOpenClawRegisteredAgentDatabases(), agentId);
					const workspaceTrashEligible = !isPathOwnedBySurvivingAgent(nextConfig, agentId, deleteResult.workspaceDir, survivingDatabaseFilePaths);
					const agentDirTrashEligible = resolveRegisteredAgentIdForDir(deleteResult.agentDir) === agentId && !isPathOwnedBySurvivingAgent(nextConfig, agentId, deleteResult.agentDir, survivingDatabaseFilePaths);
					const sessionsDirTrashEligible = !isPathOwnedBySurvivingAgent(nextConfig, agentId, deleteResult.sessionsDir, survivingDatabaseFilePaths);
					const databaseFilePaths = [...(agentDirTrashEligible ? databasePlan?.relocatedFileGroups ?? [] : databasePlan?.fileGroups ?? []).flat(), ...journal.databasePaths].filter((pathname) => !isPathOwnedBySurvivingAgent(nextConfig, agentId, pathname, survivingDatabaseFilePaths));
					const eligibleSourcePaths = new Set([
						...workspaceTrashEligible ? [deleteResult.workspaceDir] : [],
						...agentDirTrashEligible ? [deleteResult.agentDir] : [],
						...sessionsDirTrashEligible ? [deleteResult.sessionsDir] : [],
						...databaseFilePaths
					].map((sourcePath) => path.resolve(sourcePath)));
					const cleanupPaths = (await prepareAgentDeleteCleanupPaths([], journal.cleanupPaths)).filter((cleanupPath) => cleanupPath.sourcePaths.some((sourcePath) => eligibleSourcePaths.has(sourcePath)) && (agentDirTrashEligible || !cleanupPathCovers(cleanupPath, deleteResult.agentDir, agentDirRegistryPath)));
					const workspaceCanonicalPath = normalizeAgentDirRegistryPath(deleteResult.workspaceDir);
					const workspaceCleanupPaths = cleanupPaths.filter((cleanupPath) => cleanupPathCovers(cleanupPath, deleteResult.workspaceDir, workspaceCanonicalPath));
					const legacyPlan = workspaceCleanupPaths.length > 0 ? prepareLegacyWorkspaceStateReset(deleteResult.workspaceDir) : void 0;
					const statePlan = workspaceCleanupPaths.length > 0 ? prepareWorkspaceStateDeletion(deleteResult.workspaceDir) : void 0;
					const outcomes = [];
					const completedCleanupPaths = new Set(cleanupPaths.filter((cleanupPath) => cleanupPath.done));
					const markCleanupPathDone = (cleanupPath, note) => {
						const canonicalPath = path.resolve(cleanupPath.trashPath);
						deletion.fenceCleanupPaths(journal.cleanupPaths.map((entry) => {
							if (path.resolve(entry.canonicalPath) !== canonicalPath || entry.kind !== cleanupPath.kind) return entry;
							const updated = Object.assign({}, entry, { done: true });
							if (note) updated.note = note;
							return updated;
						}));
						cleanupPath.done = true;
						cleanupPath.note = note;
						completedCleanupPaths.add(cleanupPath);
					};
					const protectedCleanupPaths = [];
					for (const cleanupPath of cleanupPaths) {
						if (cleanupPath.done) {
							let replacementPresent = true;
							let note = cleanupPath.note ?? "completed cleanup path is occupied; replacement preserved";
							try {
								await statAgentCleanupPath(cleanupPath);
							} catch (error) {
								if (isMissingCleanupPathError(error)) replacementPresent = false;
								else if (!(error instanceof AgentCleanupIdentityMismatchError)) note = "completed cleanup path could not be verified; replacement preserved";
							}
							if (replacementPresent) {
								markCleanupPathDone(cleanupPath, note);
								protectedCleanupPaths.push({
									cleanupPath,
									protectAliases: true,
									terminal: true,
									note
								});
							}
							continue;
						}
						const refreshedDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(listOpenClawRegisteredAgentDatabases(), agentId);
						const blockingProtection = protectedCleanupPaths.find(({ cleanupPath: protectedPath, protectAliases }) => (cleanupPath.kind !== "symlink" || protectAliases) && (protectedPath.canonicalPath === cleanupPath.canonicalPath || isPathInside(cleanupPath.canonicalPath, protectedPath.canonicalPath)) || [protectedPath.trashPath, ...protectAliases ? protectedPath.sourcePaths : []].some((protectedSourcePath) => protectedSourcePath === cleanupPath.trashPath || isPathInside(cleanupPath.trashPath, protectedSourcePath)));
						const ownedBySurvivor = isPathOwnedBySurvivingAgent(nextConfig, agentId, cleanupPath.path, refreshedDatabaseFilePaths) || cleanupPathCovers(cleanupPath, deleteResult.agentDir, agentDirRegistryPath) && resolveRegisteredAgentIdForDir(deleteResult.agentDir) !== agentId;
						if (blockingProtection || ownedBySurvivor) {
							const terminal = ownedBySurvivor || blockingProtection?.terminal === true;
							const note = ownedBySurvivor ? "replacement owned by a surviving agent" : blockingProtection?.note;
							if (terminal) markCleanupPathDone(cleanupPath, note ?? "protected replacement preserved");
							protectedCleanupPaths.push({
								cleanupPath,
								protectAliases: blockingProtection?.protectAliases ?? false,
								terminal,
								note
							});
							continue;
						}
						const outcome = cleanupPath.preparationError ? cleanupFailure(cleanupPath.path, cleanupPath.preparationError) : await removeAgentPath(cleanupPath);
						outcomes.push({
							cleanupPath,
							outcome
						});
						if ("removed" in outcome) markCleanupPathDone(cleanupPath);
						else if ("skipped" in outcome) {
							markCleanupPathDone(cleanupPath, outcome.skipped.reason);
							protectedCleanupPaths.push({
								cleanupPath,
								protectAliases: true,
								terminal: true,
								note: outcome.skipped.reason
							});
						} else protectedCleanupPaths.push({
							cleanupPath,
							protectAliases: true,
							terminal: false
						});
					}
					for (const { outcome } of outcomes) if ("removed" in outcome) removed.push(outcome.removed);
					else if ("failed" in outcome) failed.push(outcome.failed);
					if (workspaceCleanupPaths.length > 0 && workspaceCleanupPaths.every((cleanupPath) => completedCleanupPaths.has(cleanupPath)) && legacyPlan && statePlan) try {
						await removeLegacyWorkspaceStateForReset(legacyPlan);
						deleteWorkspaceState(statePlan);
					} catch {}
					const agentDirCleanupPaths = cleanupPaths.filter((cleanupPath) => cleanupPathCovers(cleanupPath, deleteResult.agentDir, agentDirRegistryPath));
					if (agentDirCleanupPaths.length > 0 && agentDirCleanupPaths.every((cleanupPath) => completedCleanupPaths.has(cleanupPath))) unregisterResolvedAgentDir({
						agentId,
						agentDir: agentDirRegistryPath
					});
				}
				if (failed.length === 0) {
					unregisterResolvedAgentDir({
						agentId,
						agentDir: agentDirRegistryPath
					});
					if (deleteFiles) unregisterAgentDeleteDatabases(agentId, databasePlan?.registrationPaths ?? []);
					deletion.finish();
				}
				return {
					ok: true,
					agentId,
					removedBindings: deleteResult.removedBindings,
					removed,
					failed
				};
			}), void 0);
		} catch (error) {
			if (error instanceof AgentConfigPreconditionError) {
				respondAgentNotFound(respond, agentId);
				return;
			}
			throw error;
		}
	},
	"agents.files.list": async ({ params, respond, context }) => {
		if (!validateAgentsFilesListParams(params)) {
			respondInvalidMethodParams(respond, "agents.files.list", validateAgentsFilesListParams.errors);
			return;
		}
		const cfg = context.getRuntimeConfig();
		const agentId = resolveAgentIdOrError(params.agentId, cfg);
		if (!agentId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown agent id"));
			return;
		}
		const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
		let hideBootstrap = false;
		try {
			hideBootstrap = await agentsHandlerDeps.isWorkspaceSetupCompleted(workspaceDir);
		} catch {}
		respond(true, {
			agentId,
			workspace: workspaceDir,
			files: await listAgentFiles(workspaceDir, { hideBootstrap })
		}, void 0);
	},
	"agents.files.get": async ({ params, respond, context }) => {
		if (!validateAgentsFilesGetParams(params)) {
			respondInvalidMethodParams(respond, "agents.files.get", validateAgentsFilesGetParams.errors);
			return;
		}
		const resolved = resolveAgentWorkspaceFileOrRespondError(params, respond, context.getRuntimeConfig());
		if (!resolved) return;
		const { agentId, workspaceDir, name } = resolved;
		const filePath = path.join(workspaceDir, name);
		let safeRead;
		try {
			safeRead = await (await agentsHandlerDeps.root(workspaceDir)).read(name, {
				hardlinks: "reject",
				nonBlockingRead: true
			});
		} catch (err) {
			if (err instanceof FsSafeError && err.code === "not-found") {
				respondWorkspaceFileMissing({
					respond,
					agentId,
					workspaceDir,
					name,
					filePath
				});
				return;
			}
			if (err instanceof FsSafeError) {
				respondWorkspaceFileUnsafe(respond, name);
				return;
			}
			throw err;
		}
		respond(true, {
			agentId,
			workspace: workspaceDir,
			file: {
				name,
				path: filePath,
				missing: false,
				size: safeRead.stat.size,
				updatedAtMs: Math.floor(safeRead.stat.mtimeMs),
				content: safeRead.buffer.toString("utf-8")
			}
		}, void 0);
	},
	"agents.files.set": async ({ params, respond, context }) => {
		if (!validateAgentsFilesSetParams(params)) {
			respondInvalidMethodParams(respond, "agents.files.set", validateAgentsFilesSetParams.errors);
			return;
		}
		const resolved = resolveAgentWorkspaceFileOrRespondError(params, respond, context.getRuntimeConfig());
		if (!resolved) return;
		const { agentId, workspaceDir, name } = resolved;
		await fs.mkdir(workspaceDir, { recursive: true });
		const filePath = path.join(workspaceDir, name);
		const content = params.content;
		let workspaceRoot;
		try {
			workspaceRoot = await agentsHandlerDeps.root(workspaceDir);
			await workspaceRoot.write(name, content, { encoding: "utf8" });
		} catch (err) {
			if (!(err instanceof FsSafeError)) throw err;
			respondWorkspaceFileUnsafe(respond, name);
			return;
		}
		const meta = await statWorkspaceFileSafely(workspaceRoot, workspaceDir, name);
		respond(true, {
			ok: true,
			agentId,
			workspace: workspaceDir,
			file: {
				name,
				path: filePath,
				missing: false,
				size: meta?.size,
				updatedAtMs: meta?.updatedAtMs,
				content
			}
		}, void 0);
	}
};
//#endregion
export { testing as n, agentsHandlers as t };
