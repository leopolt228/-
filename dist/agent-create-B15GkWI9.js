import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { C as FsSafeError } from "./path-DILYn_gk.js";
import "./fs-safe-Dy0g6QwA.js";
import { a as root } from "./secure-temp-dir-D6Ou0J-U.js";
import "./utils-K2PjeLaV.js";
import "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import "./session-key-Drrs61Fd.js";
import { a as resolveAgentDir, o as resolveAgentWorkspaceDir, t as listAgentEntries } from "./agent-scope-config-S7z_Yn4H.js";
import { a as transformConfigFileWithRetry, o as withConfigMutationExclusive } from "./config-BOMcY2yX.js";
import { s as readAgentDeletionJournal } from "./agent-deletion-journal-DcL0of65.js";
import { c as resolveSessionTranscriptsDirForAgent } from "./paths-BpMRJ7TJ.js";
import { n as isReservedSystemAgentId } from "./agent-id-BZRNsGar.js";
import { d as ensureAgentWorkspace, i as DEFAULT_IDENTITY_FILENAME } from "./workspace-GYctLxSN.js";
import { i as claimCompletedAgentDeletion } from "./agent-lifecycle-registry-CkmkoYeX.js";
import { a as mergeIdentityMarkdownContent, s as sanitizeAgentIdentityLine, t as createAgentIdentityConfig } from "./identity-file-CXrnLY30.js";
import { r as parseBindingSpecs, t as applyAgentBindings } from "./agents.bindings-DUon22eQ.js";
import { r as findAgentEntryIndex, t as applyAgentConfig } from "./agents.config-Bo0GN9nk.js";
import fs from "node:fs/promises";
//#region src/agents/agent-create.ts
var DuplicateAgentError = class extends Error {};
var InvalidAgentBindingsError = class extends Error {};
function createError(reason, message, agentId) {
	return {
		status: "error",
		reason,
		message,
		...agentId ? { agentId } : {}
	};
}
async function writeIdentityFile(params) {
	const workspaceRoot = await root(params.workspaceDir);
	let existing;
	try {
		existing = (await workspaceRoot.read(DEFAULT_IDENTITY_FILENAME, {
			hardlinks: "reject",
			nonBlockingRead: true
		})).buffer.toString("utf-8");
	} catch (error) {
		if (!(error instanceof FsSafeError && error.code === "not-found")) throw error;
	}
	const content = mergeIdentityMarkdownContent(existing, params.identity);
	await workspaceRoot.write(DEFAULT_IDENTITY_FILENAME, content, { encoding: "utf8" });
}
async function createAgent(params) {
	const rawName = params.name.trim();
	if (!rawName) return createError("invalid-name", "agent name is required");
	const agentId = normalizeAgentId(rawName);
	if (agentId === "main" || isReservedSystemAgentId(agentId)) return createError("reserved-id", `"${agentId}" is reserved`, agentId);
	const safeName = sanitizeAgentIdentityLine(rawName);
	const model = normalizeOptionalString(params.model);
	const identity = createAgentIdentityConfig({
		name: safeName,
		emoji: params.emoji,
		avatar: params.avatar
	}) ?? { name: safeName };
	const explicitWorkspace = params.workspace?.trim() ? resolveUserPath(params.workspace.trim()) : void 0;
	const explicitAgentDir = params.agentDir?.trim() ? resolveUserPath(params.agentDir.trim()) : void 0;
	const transformConfig = params.transformConfig ?? transformConfigFileWithRetry;
	try {
		return await withConfigMutationExclusive(async (lockedConfig) => {
			const deletion = readAgentDeletionJournal(agentId);
			if (deletion && !deletion.cleanupCompleted) return createError("deletion-pending", `agent "${agentId}" deletion cleanup is still pending`, agentId);
			let tombstoneClaimed = false;
			if (deletion?.cleanupCompleted && findAgentEntryIndex(listAgentEntries(lockedConfig), agentId) >= 0) {
				if (!claimCompletedAgentDeletion(agentId, deletion.operationId)) throw new Error(`agent "${agentId}" deletion tombstone changed during creation`);
				tombstoneClaimed = true;
			}
			const committed = await transformConfig({
				afterWrite: { mode: "auto" },
				maxAttempts: 1,
				transform: async (currentConfig) => {
					if (findAgentEntryIndex(listAgentEntries(currentConfig), agentId) >= 0) throw new DuplicateAgentError();
					const workspaceDir = explicitWorkspace ?? resolveAgentWorkspaceDir(currentConfig, agentId);
					const agentDir = explicitAgentDir ?? resolveAgentDir(currentConfig, agentId);
					let nextConfig = applyAgentConfig(currentConfig, {
						agentId,
						name: safeName,
						workspace: workspaceDir,
						agentDir,
						model,
						identity
					});
					const bindingParse = parseBindingSpecs({
						agentId,
						specs: params.bindingSpecs,
						config: nextConfig
					});
					if (bindingParse.errors.length > 0) throw new InvalidAgentBindingsError(bindingParse.errors.join("\n"));
					const bindingResult = bindingParse.bindings.length ? applyAgentBindings(nextConfig, bindingParse.bindings) : void 0;
					nextConfig = bindingResult?.config ?? nextConfig;
					const workspace = await ensureAgentWorkspace({
						dir: workspaceDir,
						ensureBootstrapFiles: !nextConfig.agents?.defaults?.skipBootstrap,
						skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles
					});
					if (workspace.dir !== workspaceDir) nextConfig = applyAgentConfig(nextConfig, {
						agentId,
						workspace: workspace.dir
					});
					await fs.mkdir(resolveSessionTranscriptsDirForAgent(agentId), { recursive: true });
					if (!workspace.bootstrapPending) await writeIdentityFile({
						workspaceDir: workspace.dir,
						identity
					});
					return {
						nextConfig,
						result: {
							status: "created",
							agentId,
							name: safeName,
							workspace: workspace.dir,
							agentDir,
							...model ? { model } : {},
							bootstrapPending: workspace.bootstrapPending === true,
							...bindingResult ? { bindingResult } : {}
						}
					};
				}
			});
			if (deletion?.cleanupCompleted && !tombstoneClaimed && committed.result?.status === "created" && !claimCompletedAgentDeletion(agentId, deletion.operationId)) throw new Error(`agent "${agentId}" deletion tombstone changed during creation`);
			return committed.result;
		});
	} catch (error) {
		if (error instanceof DuplicateAgentError) return createError("already-exists", `agent "${agentId}" already exists`, agentId);
		if (error instanceof InvalidAgentBindingsError) return createError("invalid-bindings", error.message, agentId);
		if (error instanceof FsSafeError) return createError("unsafe-identity-file", `unsafe workspace file "${DEFAULT_IDENTITY_FILENAME}"`, agentId);
		throw error;
	}
}
//#endregion
export { createAgent as t };
