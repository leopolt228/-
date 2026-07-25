import "./agent-scope-CrBA-6Gx.js";
import { n as listAgentIds, o as resolveAgentWorkspaceDir } from "./agent-scope-config-S7z_Yn4H.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-BHrNTqoH.js";
import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { $i as validateWorktreesCreateParams, Qi as validateWorktreesBranchesParams, ea as validateWorktreesGcParams, na as validateWorktreesRemoveParams, ra as validateWorktreesRestoreParams, ta as validateWorktreesListParams } from "./src-Cy32TawB.js";
import { a as WorktreeSnapshotError, o as managedWorktrees, s as resolveWorktreeCleanupLimits } from "./service-Bk3ahDIx.js";
import { t as createManagedWorktreeOwnerProtection } from "./owner-protection-Br7VEyYp.js";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
//#region src/gateway/server-methods/worktrees.ts
function invalidParams(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid worktrees parameters"));
}
function createWorktreesHandlers(service) {
	return {
		"worktrees.list": async ({ params, respond }) => {
			if (!validateWorktreesListParams(params)) {
				invalidParams(respond);
				return;
			}
			try {
				respond(true, { worktrees: await service.list() }, void 0);
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		},
		"worktrees.create": async ({ params, respond }) => {
			if (!validateWorktreesCreateParams(params)) {
				invalidParams(respond);
				return;
			}
			try {
				respond(true, await service.create({
					repoRoot: params.repoRoot,
					name: params.name,
					baseRef: params.baseRef,
					ownerKind: "manual"
				}), void 0);
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		},
		"worktrees.remove": async ({ params, respond }) => {
			if (!validateWorktreesRemoveParams(params)) {
				invalidParams(respond);
				return;
			}
			try {
				const result = await service.remove({
					id: params.id,
					reason: "manual-delete",
					force: params.force
				});
				respond(true, {
					removed: result.removed,
					...result.snapshotRef ? { snapshotRef: result.snapshotRef } : {},
					...result.snapshotError ? { snapshotError: result.snapshotError } : {}
				}, void 0);
			} catch (error) {
				if (error instanceof WorktreeSnapshotError) {
					respond(true, {
						removed: false,
						snapshotError: error.snapshotError
					}, void 0);
					return;
				}
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		},
		"worktrees.restore": async ({ params, respond }) => {
			if (!validateWorktreesRestoreParams(params)) {
				invalidParams(respond);
				return;
			}
			try {
				respond(true, await service.restore({ id: params.id }), void 0);
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		},
		"worktrees.branches": async ({ params, respond, context, client }) => {
			if (!validateWorktreesBranchesParams(params)) {
				invalidParams(respond);
				return;
			}
			if (!(Array.isArray(client?.connect.scopes) ? client.connect.scopes : []).includes("operator.admin")) {
				const cfg = context.getRuntimeConfig();
				const requested = await fs$1.realpath(params.repoRoot).catch(() => null);
				if (!(requested !== null && listAgentIds(cfg).some((agentId) => {
					try {
						return fs.realpathSync(resolveAgentWorkspaceDir(cfg, agentId)) === requested;
					} catch {
						return false;
					}
				}))) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `worktrees.branches outside configured agent workspaces requires gateway scope: ${ADMIN_SCOPE}`));
					return;
				}
			}
			try {
				respond(true, await service.listRepositoryBranches(params.repoRoot), void 0);
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		},
		"worktrees.gc": async ({ params, respond, context }) => {
			if (!validateWorktreesGcParams(params)) {
				invalidParams(respond);
				return;
			}
			try {
				const cfg = context.getRuntimeConfig();
				const limits = resolveWorktreeCleanupLimits();
				respond(true, await service.gc({
					limits,
					shouldProtectOwner: createManagedWorktreeOwnerProtection(cfg)
				}), void 0);
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		}
	};
}
const worktreesHandlers = createWorktreesHandlers(managedWorktrees);
//#endregion
export { createWorktreesHandlers, worktreesHandlers };
