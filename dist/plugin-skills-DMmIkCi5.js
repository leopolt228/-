import { a as isPathInsideWithRealpath } from "./path-DILYn_gk.js";
import { o as walkDirectorySync } from "./fs-safe-Dy0g6QwA.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { t as CONFIG_DIR } from "./utils-K2PjeLaV.js";
import { r as hasKind } from "./slots-CqNa_aqs.js";
import { a as resolveEffectivePluginActivationState, i as normalizePluginsConfigWithResolver, o as resolveMemorySlotDecision } from "./manifest-registry-DkJa8Tn0.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-xuKL7EBL.js";
import "./scan-paths-DDS86KBZ.js";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-D3bC-EFj.js";
import fs from "node:fs";
import path from "node:path";
//#region src/skills/runtime/refresh-state.ts
const listeners = /* @__PURE__ */ new Set();
const workspaceVersions = /* @__PURE__ */ new Map();
const INITIAL_SKILLS_SNAPSHOT_VERSION = Date.now();
let globalVersion = INITIAL_SKILLS_SNAPSHOT_VERSION;
let listenerErrorHandler;
function bumpVersion(current) {
	const now = Date.now();
	return now <= current ? current + 1 : now;
}
function emit(event) {
	for (const listener of listeners) try {
		listener(event);
	} catch (err) {
		listenerErrorHandler?.(err);
	}
}
function setSkillsChangeListenerErrorHandler(handler) {
	listenerErrorHandler = handler;
}
function registerSkillsChangeListener(listener) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
function bumpSkillsSnapshotVersion(params) {
	const reason = params?.reason ?? "manual";
	const changedPath = params?.changedPath;
	if (params?.workspaceDir) {
		const next = bumpVersion(Math.max(globalVersion, workspaceVersions.get(params.workspaceDir) ?? 0));
		workspaceVersions.set(params.workspaceDir, next);
		emit({
			workspaceDir: params.workspaceDir,
			reason,
			changedPath
		});
		return next;
	}
	globalVersion = bumpVersion(globalVersion);
	emit({
		reason,
		changedPath
	});
	return globalVersion;
}
function getSkillsSnapshotVersion(workspaceDir) {
	if (!workspaceDir) return globalVersion;
	const local = workspaceVersions.get(workspaceDir) ?? 0;
	return Math.max(globalVersion, local);
}
function clearSkillsSnapshotVersionForWorkspace(workspaceDir) {
	const local = workspaceVersions.get(workspaceDir);
	if (typeof local === "number" && local > globalVersion) globalVersion = local;
	workspaceVersions.delete(workspaceDir);
}
function shouldRefreshSnapshotForVersion(cachedVersion, nextVersion) {
	const cached = typeof cachedVersion === "number" ? cachedVersion : 0;
	const next = typeof nextVersion === "number" ? nextVersion : 0;
	return next === 0 ? cached > 0 : cached < next;
}
function resetSkillsRefreshStateForTest() {
	listeners.clear();
	workspaceVersions.clear();
	globalVersion = INITIAL_SKILLS_SNAPSHOT_VERSION;
	listenerErrorHandler = void 0;
}
//#endregion
//#region src/skills/loading/plugin-skills.ts
const log = createSubsystemLogger("skills");
function resolvePluginSkillDirs(params) {
	const workspaceDir = (params.workspaceDir ?? "").trim();
	if (!workspaceDir) {
		publishPluginSkills([], { pluginSkillsDir: params.pluginSkillsDir });
		return [];
	}
	const config = params.config ?? {};
	const metadataSnapshot = resolvePluginMetadataSnapshot({
		workspaceDir,
		config,
		env: process.env,
		allowWorkspaceScopedCurrent: true
	});
	const registry = metadataSnapshot.manifestRegistry;
	if (registry.plugins.length === 0) {
		publishPluginSkills([], { pluginSkillsDir: params.pluginSkillsDir });
		return [];
	}
	const normalizedPlugins = normalizePluginsConfigWithResolver(config.plugins, metadataSnapshot.normalizePluginId);
	const acpRuntimeAvailable = isAcpRuntimeSpawnAvailable({ config });
	const memorySlot = normalizedPlugins.slots.memory;
	let selectedMemoryPluginId = null;
	const seen = /* @__PURE__ */ new Set();
	const resolved = [];
	for (const record of registry.plugins) {
		if (!record.skills || record.skills.length === 0) continue;
		if (!resolveEffectivePluginActivationState({
			id: record.id,
			origin: record.origin,
			config: normalizedPlugins,
			rootConfig: config,
			enabledByDefault: record.enabledByDefault
		}).activated) continue;
		if (!acpRuntimeAvailable && record.id === "acpx") continue;
		const memoryDecision = resolveMemorySlotDecision({
			id: record.id,
			kind: record.kind,
			slot: memorySlot,
			selectedId: selectedMemoryPluginId
		});
		if (!memoryDecision.enabled) continue;
		if (memoryDecision.selected && hasKind(record.kind, "memory")) selectedMemoryPluginId = record.id;
		for (const raw of record.skills) {
			const trimmed = raw.trim();
			if (!trimmed) continue;
			const candidate = path.resolve(record.rootDir, trimmed);
			if (!fs.existsSync(candidate)) {
				log.warn(`plugin skill path not found (${record.id}): ${candidate}`);
				continue;
			}
			if (!isPathInsideWithRealpath(record.rootDir, candidate, { requireRealpath: true })) {
				log.warn(`plugin skill path escapes plugin root (${record.id}): ${candidate}`);
				continue;
			}
			if (seen.has(candidate)) continue;
			seen.add(candidate);
			resolved.push(candidate);
		}
	}
	publishPluginSkills(resolved, { pluginSkillsDir: params.pluginSkillsDir });
	return resolved;
}
function resolveDefaultPluginSkillsDir() {
	return path.join(CONFIG_DIR, "plugin-skills");
}
function resolvePluginSkillLinkType(platform = process.platform) {
	return platform === "win32" ? "junction" : "dir";
}
/**
* Collect skill dir targets from a resolved directory.
* If the directory contains a direct SKILL.md it is published as-is.
* Otherwise child subdirectories that contain SKILL.md are expanded.
*/
function collectSkillTargets(dir, targets) {
	if (hasPublishableSkillFile({
		skillDir: dir,
		rootDir: dir
	})) {
		const basename = path.basename(dir);
		const existing = targets.get(basename);
		if (existing) {
			log.warn(`plugin skill name collision: "${basename}" resolves to both ${existing} and ${dir}; only the first will be published`);
			return;
		}
		targets.set(basename, dir);
		return;
	}
	const entries = walkDirectorySync(dir, {
		maxDepth: 1,
		symlinks: "skip",
		include: (entry) => entry.kind === "directory"
	}).entries;
	for (const entry of entries) {
		const childPath = entry.path;
		if (!hasPublishableSkillFile({
			skillDir: childPath,
			rootDir: dir
		})) continue;
		const basename = entry.name;
		const existing = targets.get(basename);
		if (existing) {
			log.warn(`plugin skill name collision: "${basename}" resolves to both ${existing} and ${childPath}; only the first will be published`);
			continue;
		}
		targets.set(basename, childPath);
	}
}
function hasPublishableSkillFile(params) {
	const skillMd = path.join(params.skillDir, "SKILL.md");
	let skillMdStat;
	try {
		skillMdStat = fs.lstatSync(skillMd);
	} catch {
		return false;
	}
	if (!skillMdStat.isFile() || skillMdStat.isSymbolicLink()) {
		log.warn(`plugin skill SKILL.md is not a regular file: ${skillMd}`);
		return false;
	}
	if (!isPathInsideWithRealpath(params.rootDir, skillMd, { requireRealpath: true })) {
		log.warn(`plugin skill SKILL.md escapes declared skill root: ${skillMd}`);
		return false;
	}
	return true;
}
/**
* Creates symlinks from each resolved plugin skill directory into the
* plugin skills directory (~/.openclaw/plugin-skills/) so the agent SDK can
* discover them at the conventional file-system path.
*
* The plugin-skills directory is fully owned by OpenClaw — every entry is
* a generated symlink. Cleanup of stale links is therefore safe.
*/
function publishPluginSkills(skillDirs, opts) {
	const pluginSkillsDir = opts?.pluginSkillsDir ?? resolveDefaultPluginSkillsDir();
	const managedTargets = /* @__PURE__ */ new Map();
	for (const dir of skillDirs) collectSkillTargets(dir, managedTargets);
	for (const [name, target] of managedTargets) {
		const linkPath = path.join(pluginSkillsDir, name);
		try {
			fs.mkdirSync(pluginSkillsDir, { recursive: true });
		} catch {}
		try {
			const existingEntry = fs.lstatSync(linkPath);
			if (existingEntry.isSymbolicLink()) {
				if (fs.readlinkSync(linkPath) === target) continue;
				removeGeneratedPluginSkillEntry(linkPath);
			} else if (isGeneratedPluginSkillEntry(existingEntry)) removeGeneratedPluginSkillEntry(linkPath);
			else {
				log.warn(`plugin skill entry is not a generated symlink: ${linkPath}`);
				continue;
			}
		} catch (err) {
			if (!isNotFoundError(err)) {
				log.warn(`failed to inspect plugin skill symlink "${linkPath}": ${String(err)}`);
				continue;
			}
		}
		try {
			fs.symlinkSync(target, linkPath, resolvePluginSkillLinkType());
		} catch (err) {
			log.warn(`failed to create plugin skill symlink "${linkPath}" → "${target}": ${String(err)}`);
		}
	}
	let existingEntries;
	try {
		existingEntries = fs.readdirSync(pluginSkillsDir, { withFileTypes: true });
	} catch {
		return;
	}
	for (const entry of existingEntries) {
		if (!isGeneratedPluginSkillEntry(entry)) continue;
		if (managedTargets.has(entry.name)) continue;
		removeGeneratedPluginSkillEntry(path.join(pluginSkillsDir, entry.name));
	}
}
function isGeneratedPluginSkillEntry(entry) {
	return entry.isSymbolicLink() || process.platform === "win32" && entry.isDirectory();
}
function removeGeneratedPluginSkillEntry(linkPath) {
	try {
		if (fs.lstatSync(linkPath).isSymbolicLink()) {
			fs.unlinkSync(linkPath);
			return;
		}
	} catch (err) {
		if (isNotFoundError(err)) return;
	}
	try {
		fs.rmSync(linkPath, {
			recursive: true,
			force: true
		});
	} catch {}
}
function isNotFoundError(err) {
	if (!err || typeof err !== "object") return false;
	const code = err.code;
	return code === "ENOENT" || code === "ENOTDIR";
}
//#endregion
export { registerSkillsChangeListener as a, shouldRefreshSnapshotForVersion as c, getSkillsSnapshotVersion as i, bumpSkillsSnapshotVersion as n, resetSkillsRefreshStateForTest as o, clearSkillsSnapshotVersionForWorkspace as r, setSkillsChangeListenerErrorHandler as s, resolvePluginSkillDirs as t };
