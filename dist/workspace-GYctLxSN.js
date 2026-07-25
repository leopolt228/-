import { t as resolveOpenClawPackageRoot } from "./openclaw-root-DSkQ6e_8.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { g as pathExists } from "./fs-safe-Dy0g6QwA.js";
import { r as openRootFile } from "./root-file-9jkyxRTl.js";
import { l as pathExists$1 } from "./utils-K2PjeLaV.js";
import { t as retryAsync } from "./retry-Cn-q-rcX.js";
import { t as readFileDescriptorBounded } from "./boundary-file-read-BgBHxIxZ.js";
import { C as isSubagentSessionKey, S as isCronSessionKey } from "./session-key-Drrs61Fd.js";
import { t as DEFAULT_AGENT_WORKSPACE_DIR } from "./workspace-default-h9TzWSvp.js";
import { r as runCommandWithTimeout } from "./exec-Cb0CNQNz.js";
import { t as extractFrontmatterBlock } from "./frontmatter-DPcHjFpj.js";
import { r as exactWorkspaceEntryExists, t as CANONICAL_ROOT_MEMORY_FILENAME } from "./root-memory-files-BK9Jyqph.js";
import { c as readWorkspaceStateSnapshot, i as clearExpiredWorkspaceStateForVanishedWorkspace, o as mergeWorkspaceSetupState, t as WORKSPACE_ATTESTATION_RECENT_MS, u as replaceWorkspaceAttestation } from "./workspace-state-store-CJi45lE9.js";
import { s as assertNoUnmigratedWorkspaceState } from "./workspace-legacy-state-BPkp3711.js";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/agents/workspace-bootstrap-read.ts
const MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES = 2 * 1024 * 1024;
async function readWorkspaceBootstrapFile(fd) {
	return (await readFileDescriptorBounded(fd, MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES)).toString("utf-8");
}
//#endregion
//#region src/agents/workspace-templates.ts
/**
* Workspace template directory discovery.
* Resolves source, docs, package, and fallback template locations with a small
* cache so setup flows can find templates in dev and packaged installs.
*/
const FALLBACK_TEMPLATE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../src/agents/templates");
const FALLBACK_DOCS_TEMPLATE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../docs/reference/templates");
let cachedTemplateDir;
let resolvingTemplateDir;
/** Resolves the primary workspace-template directory from package, cwd, or fallback paths. */
async function resolveWorkspaceTemplateDir(opts) {
	if (cachedTemplateDir) return cachedTemplateDir;
	if (resolvingTemplateDir) return resolvingTemplateDir;
	resolvingTemplateDir = (async () => {
		const moduleUrl = opts?.moduleUrl ?? import.meta.url;
		const argv1 = opts?.argv1 ?? process.argv[1];
		const cwd = opts?.cwd ?? process.cwd();
		const candidates = buildTemplateDirCandidates({
			packageRoot: await resolveOpenClawPackageRoot({
				moduleUrl,
				argv1,
				cwd
			}),
			cwd,
			relativeDir: path.join("src", "agents", "templates"),
			fallbackDir: FALLBACK_TEMPLATE_DIR
		});
		for (const candidate of candidates) if (await pathExists$1(candidate)) {
			cachedTemplateDir = candidate;
			return candidate;
		}
		cachedTemplateDir = candidates[0] ?? FALLBACK_TEMPLATE_DIR;
		return cachedTemplateDir;
	})();
	try {
		return await resolvingTemplateDir;
	} finally {
		resolvingTemplateDir = void 0;
	}
}
function buildTemplateDirCandidates(params) {
	return [
		params.packageRoot ? path.join(params.packageRoot, params.relativeDir) : null,
		params.cwd ? path.resolve(params.cwd, params.relativeDir) : null,
		params.fallbackDir
	].filter(Boolean);
}
async function resolveExistingTemplateDirs(candidates) {
	const dirs = [];
	for (const candidate of candidates) {
		if (dirs.includes(candidate)) continue;
		if (await pathExists$1(candidate)) dirs.push(candidate);
	}
	return dirs;
}
/** Resolves all existing workspace-template search directories, including docs templates. */
async function resolveWorkspaceTemplateSearchDirs(opts) {
	const moduleUrl = opts?.moduleUrl ?? import.meta.url;
	const argv1 = opts?.argv1 ?? process.argv[1];
	const cwd = opts?.cwd ?? process.cwd();
	const packageRoot = await resolveOpenClawPackageRoot({
		moduleUrl,
		argv1,
		cwd
	});
	const primary = await resolveWorkspaceTemplateDir(opts);
	return [primary, ...(await resolveExistingTemplateDirs(buildTemplateDirCandidates({
		packageRoot,
		cwd,
		relativeDir: path.join("docs", "reference", "templates"),
		fallbackDir: FALLBACK_DOCS_TEMPLATE_DIR
	}))).filter((candidate) => candidate !== primary)];
}
//#endregion
//#region src/agents/workspace.ts
/**
* Workspace bootstrap, template, state, and attestation helpers. This module
* creates and reads AGENTS/SOUL/TOOLS-style bootstrap files while guarding
* filesystem boundaries and recently-attested workspaces.
*/
const DEFAULT_AGENTS_FILENAME = "AGENTS.md";
const DEFAULT_SOUL_FILENAME = "SOUL.md";
const DEFAULT_TOOLS_FILENAME = "TOOLS.md";
const DEFAULT_IDENTITY_FILENAME = "IDENTITY.md";
const DEFAULT_USER_FILENAME = "USER.md";
const DEFAULT_HEARTBEAT_FILENAME = "HEARTBEAT.md";
const DEFAULT_BOOTSTRAP_FILENAME = "BOOTSTRAP.md";
const DEFAULT_MEMORY_FILENAME = CANONICAL_ROOT_MEMORY_FILENAME;
const WORKSPACE_ONBOARDING_PROFILE_FILENAMES = [
	DEFAULT_SOUL_FILENAME,
	DEFAULT_IDENTITY_FILENAME,
	DEFAULT_USER_FILENAME
];
const TRANSIENT_WORKSPACE_READ_CODES = /* @__PURE__ */ new Set([
	"EAGAIN",
	"EWOULDBLOCK",
	"EINTR"
]);
const TRANSIENT_WORKSPACE_READ_ERRNOS = /* @__PURE__ */ new Set([-11, -4]);
const TRANSIENT_WORKSPACE_READ_MESSAGE = /Unknown system error -(?:11|4)\b/i;
const workspaceTemplateCache = /* @__PURE__ */ new Map();
let gitAvailabilityPromise = null;
const workspaceFileCache = /* @__PURE__ */ new Map();
function workspaceFileIdentity(stat, canonicalPath) {
	return `${canonicalPath}|${stat.dev}:${stat.ino}:${stat.size}:${stat.mtimeMs}`;
}
async function readWorkspaceFileWithGuards(params) {
	try {
		return await retryAsync(async () => {
			const opened = await openRootFile({
				absolutePath: params.filePath,
				rootPath: params.workspaceDir,
				boundaryLabel: "workspace root",
				maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES
			});
			if (!opened.ok) {
				if (isTransientWorkspaceReadError(opened.error)) throw opened.error;
				workspaceFileCache.delete(params.filePath);
				return opened;
			}
			const identity = workspaceFileIdentity(opened.stat, opened.path);
			const cached = workspaceFileCache.get(params.filePath);
			if (cached && cached.identity === identity) {
				fs.closeSync(opened.fd);
				return {
					ok: true,
					content: cached.content
				};
			}
			try {
				const content = await readWorkspaceBootstrapFile(opened.fd);
				workspaceFileCache.set(params.filePath, {
					content,
					identity
				});
				return {
					ok: true,
					content
				};
			} finally {
				fs.closeSync(opened.fd);
			}
		}, {
			attempts: 3,
			minDelayMs: 50,
			maxDelayMs: 50,
			shouldRetry: (err) => isTransientWorkspaceReadError(err)
		});
	} catch (error) {
		workspaceFileCache.delete(params.filePath);
		return {
			ok: false,
			reason: "io",
			error
		};
	}
}
function stripFrontMatter(content) {
	return extractFrontmatterBlock(content)?.body.replace(/^\s+/, "") ?? content;
}
async function loadTemplate(name) {
	const cached = workspaceTemplateCache.get(name);
	if (cached) return cached;
	const pending = (async () => {
		const templateDirs = name === "HEARTBEAT.md" ? [await resolveWorkspaceTemplateDir()] : await resolveWorkspaceTemplateSearchDirs();
		const triedPaths = [];
		for (const templateDir of templateDirs) {
			const templatePath = path.join(templateDir, name);
			triedPaths.push(templatePath);
			try {
				return stripFrontMatter(await fs$1.readFile(templatePath, "utf-8"));
			} catch (error) {
				if (error?.code !== "ENOENT") throw error;
			}
		}
		throw new Error(`Missing workspace template: ${name} (${triedPaths.join(", ")}). Ensure workspace templates are packaged.`);
	})();
	workspaceTemplateCache.set(name, pending);
	try {
		return await pending;
	} catch (error) {
		workspaceTemplateCache.delete(name);
		throw error;
	}
}
/** Set of recognized bootstrap filenames for runtime validation */
const VALID_BOOTSTRAP_NAMES = /* @__PURE__ */ new Set([
	DEFAULT_AGENTS_FILENAME,
	DEFAULT_SOUL_FILENAME,
	DEFAULT_TOOLS_FILENAME,
	DEFAULT_IDENTITY_FILENAME,
	DEFAULT_USER_FILENAME,
	DEFAULT_HEARTBEAT_FILENAME,
	DEFAULT_BOOTSTRAP_FILENAME,
	DEFAULT_MEMORY_FILENAME
]);
const OPTIONAL_BOOTSTRAP_FILENAMES = /* @__PURE__ */ new Set([
	DEFAULT_SOUL_FILENAME,
	DEFAULT_IDENTITY_FILENAME,
	DEFAULT_USER_FILENAME,
	DEFAULT_HEARTBEAT_FILENAME
]);
const WORKSPACE_VANISHED_ERROR_CODE = "WORKSPACE_VANISHED";
var WorkspaceVanishedError = class extends Error {
	constructor(params) {
		super(`OpenClaw workspace appears to have disappeared after a recent initialization: ${params.workspaceDir}. Refusing to reseed BOOTSTRAP.md over a recently attested workspace. Restore the workspace or run a full OpenClaw reset if this reset was intentional.`);
		this.code = WORKSPACE_VANISHED_ERROR_CODE;
		this.name = "WorkspaceVanishedError";
		this.workspaceDir = params.workspaceDir;
	}
};
async function writeFileIfMissing(filePath, content) {
	try {
		await fs$1.writeFile(filePath, content, {
			encoding: "utf-8",
			flag: "wx"
		});
		return true;
	} catch (err) {
		if (err.code !== "EEXIST") throw err;
		return false;
	}
}
function isTransientWorkspaceReadError(error) {
	const fsError = error;
	if (fsError?.code && TRANSIENT_WORKSPACE_READ_CODES.has(fsError.code)) return true;
	if (typeof fsError?.errno === "number" && TRANSIENT_WORKSPACE_READ_ERRNOS.has(fsError.errno)) return true;
	return error instanceof Error && TRANSIENT_WORKSPACE_READ_MESSAGE.test(error.message);
}
async function fileContentDiffersFromTemplate(filePath, template) {
	try {
		return await retryAsync(async () => await fs$1.readFile(filePath, "utf-8") !== template, {
			attempts: 3,
			minDelayMs: 50,
			maxDelayMs: 50,
			shouldRetry: (err) => isTransientWorkspaceReadError(err)
		});
	} catch (err) {
		if (err.code === "ENOENT") return false;
		throw err;
	}
}
async function hasWorkspaceUserContentEvidence(dir, opts) {
	const indicators = [path.join(dir, "memory")];
	if (opts?.includeGit) indicators.push(path.join(dir, ".git"));
	for (const indicator of indicators) try {
		await fs$1.access(indicator);
		return true;
	} catch {}
	if (await exactWorkspaceEntryExists(dir, DEFAULT_MEMORY_FILENAME)) return true;
	return await hasWorkspaceSkillEvidence(dir);
}
async function hasWorkspaceSkillEvidence(dir) {
	try {
		const skillEntries = await fs$1.readdir(path.join(dir, "skills"), { withFileTypes: true });
		for (const entry of skillEntries) {
			if (!entry.isDirectory()) continue;
			try {
				await fs$1.access(path.join(dir, "skills", entry.name, "SKILL.md"));
				return true;
			} catch {}
		}
	} catch {}
	return false;
}
async function hasSkipBootstrapWorkspaceContentEvidence(dir) {
	try {
		const entries = await fs$1.readdir(dir, { withFileTypes: true });
		for (const entry of entries) {
			if (entry.name === ".DS_Store" || entry.name === ".openclaw" || entry.name === "openclaw-workspace-state.json") continue;
			if (entry.name === "skills" && entry.isDirectory()) {
				if (!await hasWorkspaceSkillEvidence(dir)) continue;
			}
			return true;
		}
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}
	return false;
}
async function workspaceProfileLooksConfigured(params) {
	return (await Promise.all(WORKSPACE_ONBOARDING_PROFILE_FILENAMES.map(async (fileName) => fileContentDiffersFromTemplate(path.join(params.dir, fileName), await loadTemplate(fileName))))).some(Boolean) || await hasWorkspaceUserContentEvidence(params.dir, { includeGit: params.includeGitEvidence });
}
async function workspaceRequiredBootstrapLooksCustomized(dir, opts) {
	const fileNames = [
		DEFAULT_AGENTS_FILENAME,
		DEFAULT_TOOLS_FILENAME,
		DEFAULT_HEARTBEAT_FILENAME
	];
	const generatedHashes = opts?.generatedHashes;
	if (generatedHashes && generatedHashes.size > 0) {
		for (const fileName of fileNames) {
			const filePath = path.join(dir, fileName);
			const generatedHash = generatedHashes.get(fileName);
			try {
				const content = await fs$1.readFile(filePath, "utf-8");
				const contentHash = createHash("sha256").update(content).digest("hex");
				if (!generatedHash || contentHash !== generatedHash) return true;
			} catch {}
		}
		return false;
	}
	return (await Promise.all(fileNames.map(async (fileName) => fileContentDiffersFromTemplate(path.join(dir, fileName), await loadTemplate(fileName))))).some(Boolean);
}
async function workspaceAttestedGeneratedFilesIntact(dir, generatedHashes) {
	if (!generatedHashes.has("AGENTS.md") || !generatedHashes.has("TOOLS.md")) return false;
	for (const [fileName, generatedHash] of generatedHashes) try {
		const content = await fs$1.readFile(path.join(dir, fileName), "utf-8");
		if (createHash("sha256").update(content).digest("hex") !== generatedHash) return false;
	} catch {
		return false;
	}
	return true;
}
async function workspaceHasBootstrapCompletionEvidence(params) {
	return await workspaceProfileLooksConfigured(params);
}
async function reconcileWorkspaceBootstrapCompletionState(params) {
	const bootstrapExists = params.bootstrapExists ?? await pathExists(params.bootstrapPath);
	if (typeof params.state.setupCompletedAt === "string" && params.state.setupCompletedAt.trim().length > 0) return {
		repaired: false,
		bootstrapExists,
		state: params.state
	};
	if (params.state.bootstrapSeededAt && !bootstrapExists) {
		const completedState = {
			...params.state,
			setupCompletedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		return {
			repaired: true,
			bootstrapExists: false,
			state: mergeWorkspaceSetupState(params.dir, completedState)
		};
	}
	if (!bootstrapExists || !await workspaceHasBootstrapCompletionEvidence({ dir: params.dir })) return {
		repaired: false,
		bootstrapExists,
		state: params.state
	};
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const repairedState = {
		...params.state,
		bootstrapSeededAt: params.state.bootstrapSeededAt ?? now,
		setupCompletedAt: now
	};
	const persistedState = mergeWorkspaceSetupState(params.dir, repairedState);
	try {
		await fs$1.rm(params.bootstrapPath, { force: true });
		return {
			repaired: true,
			bootstrapExists: false,
			state: persistedState
		};
	} catch {
		return {
			repaired: true,
			bootstrapExists: true,
			state: persistedState
		};
	}
}
async function collectGeneratedBootstrapHashes(dir) {
	const hashes = /* @__PURE__ */ new Map();
	const fileNames = [
		DEFAULT_AGENTS_FILENAME,
		DEFAULT_SOUL_FILENAME,
		DEFAULT_TOOLS_FILENAME,
		DEFAULT_IDENTITY_FILENAME,
		DEFAULT_USER_FILENAME,
		DEFAULT_HEARTBEAT_FILENAME
	];
	for (const fileName of fileNames) try {
		const content = await fs$1.readFile(path.join(dir, fileName), "utf-8");
		if (content === await loadTemplate(fileName)) hashes.set(fileName, createHash("sha256").update(content).digest("hex"));
	} catch {}
	return hashes;
}
function recentWorkspaceAttestation(attestation, nowMs = Date.now()) {
	if (!attestation) return;
	if (nowMs - attestation.attestedAtMs > 864e5) return;
	return attestation;
}
async function maybeWriteWorkspaceAttestation(dir) {
	try {
		replaceWorkspaceAttestation({
			workspaceDir: dir,
			attestedAtMs: Date.now(),
			generatedHashes: await collectGeneratedBootstrapHashes(dir)
		});
	} catch {}
}
function hasWorkspaceSetupStateMarker(state) {
	return Boolean(state.bootstrapSeededAt || state.setupCompletedAt);
}
function hasRecentWorkspaceSetupState(snapshot, nowMs = Date.now()) {
	if (!hasWorkspaceSetupStateMarker(snapshot.setup) || snapshot.setupUpdatedAtMs === void 0) return false;
	return nowMs - snapshot.setupUpdatedAtMs <= WORKSPACE_ATTESTATION_RECENT_MS;
}
async function workspaceAttestationHasSurvivalEvidence(params) {
	if (await pathExists(params.bootstrapPath)) return true;
	if (await workspaceRequiredBootstrapLooksCustomized(params.dir, { generatedHashes: params.attestation.generatedHashes })) return true;
	if (await workspaceProfileLooksConfigured({ dir: params.dir })) return true;
	return hasWorkspaceSetupStateMarker(params.state) && await workspaceAttestedGeneratedFilesIntact(params.dir, params.attestation.generatedHashes);
}
async function workspaceSetupStateHasSurvivalEvidence(params) {
	if (await pathExists(params.bootstrapPath)) return true;
	if (await hasWorkspaceUserContentEvidence(params.dir)) return true;
	const currentState = readCanonicalWorkspaceStateSnapshot(params.dir);
	if (currentState.setup.bootstrapSeededAt !== params.initialState.setup.bootstrapSeededAt || currentState.setup.setupCompletedAt !== params.initialState.setup.setupCompletedAt) return true;
	const generatedHashes = await collectGeneratedBootstrapHashes(params.dir);
	return [
		DEFAULT_AGENTS_FILENAME,
		DEFAULT_SOUL_FILENAME,
		DEFAULT_TOOLS_FILENAME,
		DEFAULT_IDENTITY_FILENAME,
		DEFAULT_USER_FILENAME,
		DEFAULT_HEARTBEAT_FILENAME
	].every((fileName) => generatedHashes.has(fileName));
}
function readCanonicalWorkspaceStateSnapshot(dir) {
	const snapshot = readWorkspaceStateSnapshot(dir);
	assertNoUnmigratedWorkspaceState({ workspaceDir: dir });
	return snapshot;
}
async function isWorkspaceSetupCompleted(dir) {
	const state = readCanonicalWorkspaceStateSnapshot(dir).setup;
	return typeof state.setupCompletedAt === "string" && state.setupCompletedAt.trim().length > 0;
}
async function resolveWorkspaceBootstrapStatus(dir) {
	const resolvedDir = resolveUserPath(dir);
	const state = readCanonicalWorkspaceStateSnapshot(resolvedDir).setup;
	if (typeof state.setupCompletedAt === "string" && state.setupCompletedAt.trim().length > 0) return "complete";
	if (!await pathExists(path.join(resolvedDir, "BOOTSTRAP.md"))) return "complete";
	return "pending";
}
async function isWorkspaceBootstrapPending(dir) {
	return await resolveWorkspaceBootstrapStatus(dir) === "pending";
}
async function hasGitRepo(dir) {
	try {
		await fs$1.stat(path.join(dir, ".git"));
		return true;
	} catch {
		return false;
	}
}
async function isGitAvailable() {
	if (gitAvailabilityPromise) return gitAvailabilityPromise;
	gitAvailabilityPromise = (async () => {
		try {
			return (await runCommandWithTimeout(["git", "--version"], { timeoutMs: 2e3 })).code === 0;
		} catch {
			return false;
		}
	})();
	return gitAvailabilityPromise;
}
async function ensureGitRepo(dir, isBrandNewWorkspace) {
	if (!isBrandNewWorkspace) return;
	if (await hasGitRepo(dir)) return;
	if (!await isGitAvailable()) return;
	try {
		await runCommandWithTimeout(["git", "init"], {
			cwd: dir,
			timeoutMs: 1e4
		});
	} catch {}
}
async function ensureAgentWorkspace(params) {
	const dir = resolveUserPath(params?.dir?.trim() ? params.dir.trim() : DEFAULT_AGENT_WORKSPACE_DIR);
	let initialState = readCanonicalWorkspaceStateSnapshot(dir);
	let reseedingExpiredWorkspaceState = false;
	const recentAttestation = recentWorkspaceAttestation(initialState.attestation);
	const recentSetupState = hasRecentWorkspaceSetupState(initialState);
	if (!await pathExists(dir)) {
		if (recentAttestation) throw new WorkspaceVanishedError({ workspaceDir: dir });
		if (!clearExpiredWorkspaceStateForVanishedWorkspace(dir)) throw new WorkspaceVanishedError({ workspaceDir: dir });
	}
	await fs$1.mkdir(dir, { recursive: true });
	const bootstrapPath = path.join(dir, DEFAULT_BOOTSTRAP_FILENAME);
	if (!params?.ensureBootstrapFiles) {
		const hasContentEvidence = await hasSkipBootstrapWorkspaceContentEvidence(dir);
		if (recentAttestation && !hasContentEvidence) throw new WorkspaceVanishedError({ workspaceDir: dir });
		if (hasWorkspaceSetupStateMarker(initialState.setup) && !initialState.attestation && !await workspaceSetupStateHasSurvivalEvidence({
			dir,
			bootstrapPath,
			initialState
		})) {
			if (recentSetupState || !clearExpiredWorkspaceStateForVanishedWorkspace(dir)) throw new WorkspaceVanishedError({ workspaceDir: dir });
		}
		if (hasContentEvidence) await maybeWriteWorkspaceAttestation(dir);
		return {
			dir,
			bootstrapPending: false
		};
	}
	const agentsPath = path.join(dir, DEFAULT_AGENTS_FILENAME);
	const soulPath = path.join(dir, DEFAULT_SOUL_FILENAME);
	const toolsPath = path.join(dir, DEFAULT_TOOLS_FILENAME);
	const identityPath = path.join(dir, DEFAULT_IDENTITY_FILENAME);
	const userPath = path.join(dir, DEFAULT_USER_FILENAME);
	const heartbeatPath = path.join(dir, DEFAULT_HEARTBEAT_FILENAME);
	const isBrandNewWorkspace = await (async () => {
		const paths = [...[
			agentsPath,
			soulPath,
			toolsPath,
			identityPath,
			userPath,
			heartbeatPath
		], path.join(dir, "memory")];
		return (await Promise.all(paths.map(async (p) => {
			try {
				await fs$1.access(p);
				return true;
			} catch {
				return false;
			}
		}))).every((v) => !v) && !await hasWorkspaceUserContentEvidence(dir);
	})();
	if (isBrandNewWorkspace) {
		if (recentAttestation) throw new WorkspaceVanishedError({ workspaceDir: dir });
		reseedingExpiredWorkspaceState = initialState.setupExists || Boolean(initialState.attestation);
		if (!clearExpiredWorkspaceStateForVanishedWorkspace(dir)) throw new WorkspaceVanishedError({ workspaceDir: dir });
	}
	if (initialState.attestation && !isBrandNewWorkspace) {
		if (!await workspaceAttestationHasSurvivalEvidence({
			dir,
			bootstrapPath,
			state: initialState.setup,
			attestation: initialState.attestation
		})) {
			if (recentAttestation) throw new WorkspaceVanishedError({ workspaceDir: dir });
			reseedingExpiredWorkspaceState = true;
			if (!clearExpiredWorkspaceStateForVanishedWorkspace(dir)) throw new WorkspaceVanishedError({ workspaceDir: dir });
		}
	} else if (hasWorkspaceSetupStateMarker(initialState.setup) && !isBrandNewWorkspace && !await workspaceSetupStateHasSurvivalEvidence({
		dir,
		bootstrapPath,
		initialState
	})) {
		if (recentSetupState) throw new WorkspaceVanishedError({ workspaceDir: dir });
		reseedingExpiredWorkspaceState = true;
		if (!clearExpiredWorkspaceStateForVanishedWorkspace(dir)) throw new WorkspaceVanishedError({ workspaceDir: dir });
	}
	const agentsTemplate = await loadTemplate(DEFAULT_AGENTS_FILENAME);
	const soulTemplate = await loadTemplate(DEFAULT_SOUL_FILENAME);
	const toolsTemplate = await loadTemplate(DEFAULT_TOOLS_FILENAME);
	const identityTemplate = await loadTemplate(DEFAULT_IDENTITY_FILENAME);
	const userTemplate = await loadTemplate(DEFAULT_USER_FILENAME);
	const heartbeatTemplate = await loadTemplate(DEFAULT_HEARTBEAT_FILENAME);
	initialState = readCanonicalWorkspaceStateSnapshot(dir);
	const skipOptionalBootstrapFiles = new Set(params?.skipOptionalBootstrapFiles ?? []);
	if (initialState.setup.setupCompletedAt) for (const filename of OPTIONAL_BOOTSTRAP_FILENAMES) skipOptionalBootstrapFiles.add(filename);
	const shouldWriteBootstrapFile = (fileName) => !OPTIONAL_BOOTSTRAP_FILENAMES.has(fileName) || !skipOptionalBootstrapFiles.has(fileName);
	await writeFileIfMissing(agentsPath, agentsTemplate);
	if (shouldWriteBootstrapFile("SOUL.md")) await writeFileIfMissing(soulPath, soulTemplate);
	await writeFileIfMissing(toolsPath, toolsTemplate);
	const identityPathCreated = shouldWriteBootstrapFile("IDENTITY.md") ? await writeFileIfMissing(identityPath, identityTemplate) : false;
	if (shouldWriteBootstrapFile("USER.md")) await writeFileIfMissing(userPath, userTemplate);
	if (shouldWriteBootstrapFile("HEARTBEAT.md")) await writeFileIfMissing(heartbeatPath, heartbeatTemplate);
	let state = readCanonicalWorkspaceStateSnapshot(dir).setup;
	let stateDirty = false;
	const markState = (next) => {
		state = {
			...state,
			...next
		};
		stateDirty = true;
	};
	const nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
	let bootstrapExists = await pathExists(bootstrapPath);
	if (!state.bootstrapSeededAt && bootstrapExists) markState({ bootstrapSeededAt: nowIso() });
	if (!state.setupCompletedAt) {
		const repair = await reconcileWorkspaceBootstrapCompletionState({
			dir,
			bootstrapPath,
			state,
			bootstrapExists
		});
		if (repair.repaired) {
			state = repair.state;
			stateDirty = false;
			bootstrapExists = repair.bootstrapExists;
		}
	}
	if (!state.bootstrapSeededAt && !state.setupCompletedAt && !bootstrapExists) if ((recentAttestation ? await workspaceRequiredBootstrapLooksCustomized(dir, { generatedHashes: recentAttestation.generatedHashes }) : false) || await workspaceProfileLooksConfigured({
		dir,
		includeGitEvidence: !reseedingExpiredWorkspaceState
	})) markState({ setupCompletedAt: nowIso() });
	else {
		if (!await writeFileIfMissing(bootstrapPath, await loadTemplate("BOOTSTRAP.md"))) bootstrapExists = await pathExists(bootstrapPath);
		else bootstrapExists = true;
		if (bootstrapExists && !state.bootstrapSeededAt) markState({ bootstrapSeededAt: nowIso() });
	}
	if (stateDirty) state = mergeWorkspaceSetupState(dir, state);
	await ensureGitRepo(dir, isBrandNewWorkspace);
	await maybeWriteWorkspaceAttestation(dir);
	return {
		dir,
		agentsPath,
		soulPath,
		toolsPath,
		identityPath,
		userPath,
		heartbeatPath,
		bootstrapPath,
		bootstrapPending: !state.setupCompletedAt && bootstrapExists,
		identityPathCreated
	};
}
async function loadWorkspaceBootstrapFiles(dir) {
	const resolvedDir = resolveUserPath(dir);
	const entries = [
		{
			name: DEFAULT_AGENTS_FILENAME,
			filePath: path.join(resolvedDir, DEFAULT_AGENTS_FILENAME)
		},
		{
			name: DEFAULT_SOUL_FILENAME,
			filePath: path.join(resolvedDir, DEFAULT_SOUL_FILENAME)
		},
		{
			name: DEFAULT_TOOLS_FILENAME,
			filePath: path.join(resolvedDir, DEFAULT_TOOLS_FILENAME)
		},
		{
			name: DEFAULT_IDENTITY_FILENAME,
			filePath: path.join(resolvedDir, DEFAULT_IDENTITY_FILENAME)
		},
		{
			name: DEFAULT_USER_FILENAME,
			filePath: path.join(resolvedDir, DEFAULT_USER_FILENAME)
		},
		{
			name: DEFAULT_HEARTBEAT_FILENAME,
			filePath: path.join(resolvedDir, DEFAULT_HEARTBEAT_FILENAME)
		},
		{
			name: DEFAULT_BOOTSTRAP_FILENAME,
			filePath: path.join(resolvedDir, DEFAULT_BOOTSTRAP_FILENAME)
		},
		{
			name: DEFAULT_MEMORY_FILENAME,
			filePath: path.join(resolvedDir, DEFAULT_MEMORY_FILENAME)
		}
	];
	const result = [];
	for (const entry of entries) {
		if (entry.name === DEFAULT_MEMORY_FILENAME && !await exactWorkspaceEntryExists(resolvedDir, DEFAULT_MEMORY_FILENAME)) continue;
		const loaded = await readWorkspaceFileWithGuards({
			filePath: entry.filePath,
			workspaceDir: resolvedDir
		});
		if (loaded.ok) result.push({
			name: entry.name,
			path: entry.filePath,
			content: loaded.content,
			missing: false
		});
		else result.push({
			name: entry.name,
			path: entry.filePath,
			missing: true
		});
	}
	return result;
}
const SUBAGENT_BOOTSTRAP_ALLOWLIST = /* @__PURE__ */ new Set([DEFAULT_AGENTS_FILENAME, DEFAULT_TOOLS_FILENAME]);
const CRON_BOOTSTRAP_ALLOWLIST = /* @__PURE__ */ new Set([
	DEFAULT_AGENTS_FILENAME,
	DEFAULT_TOOLS_FILENAME,
	DEFAULT_SOUL_FILENAME,
	DEFAULT_IDENTITY_FILENAME,
	DEFAULT_USER_FILENAME
]);
function filterBootstrapFilesForSession(files, sessionKey) {
	if (!sessionKey) return files;
	if (isSubagentSessionKey(sessionKey)) return files.filter((file) => SUBAGENT_BOOTSTRAP_ALLOWLIST.has(file.name));
	if (isCronSessionKey(sessionKey)) return files.filter((file) => CRON_BOOTSTRAP_ALLOWLIST.has(file.name));
	return files;
}
function hasGlobPattern(pattern) {
	return /[?*{}]/u.test(pattern);
}
function normalizeWorkspacePatternPath(value) {
	return value.replaceAll(path.sep, "/").replaceAll("\\", "/").replace(/^\.\/+/u, "");
}
function resolveGlobWalkRoot(pattern) {
	const normalized = normalizeWorkspacePatternPath(pattern);
	const globIndex = normalized.search(/[?*{}]/u);
	if (globIndex === -1) return normalized;
	const slashIndex = normalized.lastIndexOf("/", globIndex);
	return slashIndex === -1 ? "." : normalized.slice(0, slashIndex) || ".";
}
async function* walkWorkspaceFiles(workspaceDir, initialRelativeDir) {
	const stack = [initialRelativeDir === "." ? "" : initialRelativeDir];
	while (stack.length > 0) {
		const currentRelativeDir = stack.pop() ?? "";
		const currentDir = path.resolve(workspaceDir, currentRelativeDir);
		const relativeToWorkspace = path.relative(workspaceDir, currentDir);
		if (relativeToWorkspace.startsWith("..") || path.isAbsolute(relativeToWorkspace)) continue;
		let entries;
		try {
			entries = await fs$1.readdir(currentDir, { withFileTypes: true });
		} catch {
			continue;
		}
		for (const entry of entries) {
			const childRelativePath = currentRelativeDir ? path.join(currentRelativeDir, entry.name) : entry.name;
			if (entry.isDirectory()) {
				stack.push(childRelativePath);
				continue;
			}
			if (entry.isFile() || entry.isSymbolicLink()) yield normalizeWorkspacePatternPath(childRelativePath);
		}
	}
}
async function resolveExtraBootstrapPatternPaths(workspaceDir, pattern) {
	if (typeof fs$1.glob === "function") try {
		const matches = [];
		for await (const match of fs$1.glob(pattern, { cwd: workspaceDir })) matches.push(match);
		return matches;
	} catch {}
	if (typeof path.matchesGlob !== "function") return [pattern];
	const normalizedPattern = normalizeWorkspacePatternPath(pattern);
	const matches = [];
	for await (const candidate of walkWorkspaceFiles(workspaceDir, resolveGlobWalkRoot(normalizedPattern))) if (path.matchesGlob(candidate, normalizedPattern)) matches.push(candidate);
	return matches.length > 0 ? matches : [pattern];
}
async function loadExtraBootstrapFilesWithDiagnostics(dir, extraPatterns) {
	if (!extraPatterns.length) return {
		files: [],
		diagnostics: []
	};
	const resolvedDir = resolveUserPath(dir);
	const resolvedPaths = /* @__PURE__ */ new Set();
	for (const pattern of extraPatterns) if (hasGlobPattern(pattern)) {
		const matches = await resolveExtraBootstrapPatternPaths(resolvedDir, pattern);
		for (const match of matches) resolvedPaths.add(match);
	} else resolvedPaths.add(pattern);
	const files = [];
	const diagnostics = [];
	for (const relPath of resolvedPaths) {
		const filePath = path.resolve(resolvedDir, relPath);
		const baseName = path.basename(relPath);
		if (!VALID_BOOTSTRAP_NAMES.has(baseName)) {
			diagnostics.push({
				path: filePath,
				reason: "invalid-bootstrap-filename",
				detail: `unsupported bootstrap basename: ${baseName}`
			});
			continue;
		}
		const loaded = await readWorkspaceFileWithGuards({
			filePath,
			workspaceDir: resolvedDir
		});
		if (loaded.ok) {
			files.push({
				name: baseName,
				path: filePath,
				content: loaded.content,
				missing: false
			});
			continue;
		}
		const reason = loaded.reason === "path" ? "missing" : loaded.reason === "validation" ? "security" : "io";
		diagnostics.push({
			path: filePath,
			reason,
			detail: loaded.error instanceof Error ? loaded.error.message : typeof loaded.error === "string" ? loaded.error : reason
		});
	}
	return {
		files,
		diagnostics
	};
}
//#endregion
export { resolveWorkspaceBootstrapStatus as _, DEFAULT_MEMORY_FILENAME as a, MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES as b, DEFAULT_USER_FILENAME as c, ensureAgentWorkspace as d, filterBootstrapFilesForSession as f, loadWorkspaceBootstrapFiles as g, loadExtraBootstrapFilesWithDiagnostics as h, DEFAULT_IDENTITY_FILENAME as i, WORKSPACE_VANISHED_ERROR_CODE as l, isWorkspaceSetupCompleted as m, DEFAULT_BOOTSTRAP_FILENAME as n, DEFAULT_SOUL_FILENAME as o, isWorkspaceBootstrapPending as p, DEFAULT_HEARTBEAT_FILENAME as r, DEFAULT_TOOLS_FILENAME as s, DEFAULT_AGENTS_FILENAME as t, WorkspaceVanishedError as u, resolveWorkspaceTemplateDir as v, readWorkspaceBootstrapFile as x, resolveWorkspaceTemplateSearchDirs as y };
