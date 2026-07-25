import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import "./utils-K2PjeLaV.js";
import "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { E as parseAgentSessionKey, s as classifySessionKeyShape } from "./session-key-Drrs61Fd.js";
import { c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir } from "./agent-scope-config-S7z_Yn4H.js";
import { a as logWarn } from "./logger-DT9z6GgH.js";
import { t as redactIdentifier } from "./redact-identifier-BjaGGxG8.js";
import { t as sanitizeForPromptLiteral } from "./sanitize-for-prompt-Drdy09dw.js";
//#region src/agents/workspace-run.ts
function resolveRunAgentId(params) {
	const rawSessionKey = params.sessionKey?.trim() ?? "";
	const shape = classifySessionKeyShape(rawSessionKey);
	if (shape === "malformed_agent") throw new Error("Malformed agent session key; refusing workspace resolution.");
	const explicit = typeof params.agentId === "string" && params.agentId.trim() ? normalizeAgentId(params.agentId) : void 0;
	if (explicit) return {
		agentId: explicit,
		agentIdSource: "explicit"
	};
	const defaultAgentId = resolveDefaultAgentId(params.config ?? {});
	if (shape === "missing" || shape === "legacy_or_alias") return {
		agentId: defaultAgentId || "main",
		agentIdSource: "default"
	};
	const parsed = parseAgentSessionKey(rawSessionKey);
	if (parsed?.agentId) return {
		agentId: normalizeAgentId(parsed.agentId),
		agentIdSource: "session_key"
	};
	return {
		agentId: defaultAgentId || "main",
		agentIdSource: "default"
	};
}
/** Redacts a run/session identifier for logs and prompts. */
function redactRunIdentifier(value) {
	return redactIdentifier(value, { len: 12 });
}
/** Resolves the workspace directory used for an agent run. */
function resolveRunWorkspaceDir(params) {
	const env = params.env ?? process.env;
	const requested = params.workspaceDir;
	const { agentId, agentIdSource } = resolveRunAgentId({
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		config: params.config
	});
	if (typeof requested === "string") {
		const trimmed = requested.trim();
		if (trimmed) {
			const sanitized = sanitizeForPromptLiteral(trimmed);
			if (sanitized !== trimmed) logWarn("Control/format characters stripped from workspaceDir (OC-19 hardening).");
			const workspaceDir = resolveUserPath(sanitized, env);
			return {
				workspaceDir,
				isCanonicalWorkspace: workspaceDir === resolveUserPath(resolveAgentWorkspaceDir(params.config ?? {}, agentId, env), env),
				usedFallback: false,
				agentId,
				agentIdSource
			};
		}
	}
	const fallbackReason = requested == null ? "missing" : typeof requested === "string" ? "blank" : "invalid_type";
	const fallbackWorkspace = resolveAgentWorkspaceDir(params.config ?? {}, agentId, env);
	const sanitizedFallback = sanitizeForPromptLiteral(fallbackWorkspace);
	if (sanitizedFallback !== fallbackWorkspace) logWarn("Control/format characters stripped from fallback workspaceDir (OC-19 hardening).");
	return {
		workspaceDir: resolveUserPath(sanitizedFallback, env),
		isCanonicalWorkspace: true,
		usedFallback: true,
		fallbackReason,
		agentId,
		agentIdSource
	};
}
//#endregion
export { resolveRunWorkspaceDir as n, redactRunIdentifier as t };
