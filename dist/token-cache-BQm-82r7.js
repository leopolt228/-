import { o as asDateTimestampMs } from "./number-coercion-Crk_c9KW.js";
import "./provider-request-config-DrrUROfX.js";
import "./number-runtime-C6TGSEc_.js";
import "./provider-auth-Bnib2g6h.js";
import "./domain-Bw0bH59M.js";
import { createHash } from "node:crypto";
//#region extensions/github-copilot/token-cache.ts
const COPILOT_TOKEN_CACHE_NAMESPACE = "token";
const COPILOT_TOKEN_CACHE_MAX_ENTRIES = 8;
function fingerprintCopilotSourceCredential(githubToken) {
	return createHash("sha256").update(githubToken).digest("hex");
}
function isCopilotTokenUsable(params) {
	const expiresAt = asDateTimestampMs(params.cache.expiresAt);
	const cacheDomain = params.cache.domain ?? "github.com";
	return params.cache.integrationId === "vscode-chat" && cacheDomain === params.domain && params.cache.sourceCredentialFingerprint === params.sourceCredentialFingerprint && expiresAt !== void 0 && expiresAt - (params.now ?? Date.now()) > 300 * 1e3;
}
function resolveCopilotTokenCache(params) {
	if (params.cachePath !== void 0 || params.loadJsonFileImpl !== void 0 || params.saveJsonFileImpl !== void 0) {
		const cachePath = params.cachePath?.trim() || "explicit-cache";
		const loadJsonFileFn = params.loadJsonFileImpl ?? (() => void 0);
		const saveJsonFileFn = params.saveJsonFileImpl ?? (() => void 0);
		return {
			path: cachePath,
			load: () => loadJsonFileFn(cachePath),
			save: (value) => saveJsonFileFn(cachePath, value)
		};
	}
	const store = params.openCacheStore?.();
	if (!store) return {
		path: "uncached",
		load: () => void 0,
		save: () => void 0
	};
	const key = `${params.domain}:${params.sourceCredentialFingerprint}`;
	return {
		path: "plugin-state",
		load: () => store.lookup(key),
		save: (value) => store.register(key, value, { ttlMs: Math.max(1, value.expiresAt - Date.now()) })
	};
}
//#endregion
export { resolveCopilotTokenCache as a, isCopilotTokenUsable as i, COPILOT_TOKEN_CACHE_NAMESPACE as n, fingerprintCopilotSourceCredential as r, COPILOT_TOKEN_CACHE_MAX_ENTRIES as t };
