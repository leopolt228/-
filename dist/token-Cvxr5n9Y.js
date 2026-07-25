import { E as resolveExpiresAtMsFromEpochSeconds, o as asDateTimestampMs, y as parseStrictNonNegativeInteger } from "./number-coercion-Crk_c9KW.js";
import { m as readProviderJsonResponse } from "./provider-http-errors-DrOMjuGn.js";
import { h as COPILOT_INTEGRATION_ID, v as buildCopilotIdeHeaders } from "./provider-request-config-DrrUROfX.js";
import "./number-runtime-C6TGSEc_.js";
import { n as deriveCopilotApiBaseUrlFromToken } from "./provider-auth-Bnib2g6h.js";
import "./provider-http-D2uO-AEP.js";
import { n as resolveGithubCopilotDomain } from "./domain-Bw0bH59M.js";
import { a as resolveCopilotTokenCache, i as isCopilotTokenUsable, r as fingerprintCopilotSourceCredential } from "./token-cache-BQm-82r7.js";
//#region extensions/github-copilot/token.ts
const DEFAULT_COPILOT_API_BASE_URL = "https://api.individual.githubcopilot.com";
const COPILOT_TOKEN_EXCHANGE_TIMEOUT_MS = 3e4;
let openConfiguredCacheStore;
/** Bind provider-scoped SQLite state when the bundled plugin registers. */
function configureCopilotTokenCacheStore(openCacheStore) {
	openConfiguredCacheStore = openCacheStore;
}
function copilotTokenUrl(domain) {
	return `https://api.${domain}/copilot_internal/v2/token`;
}
function copilotApiBaseFallback(domain) {
	return domain === "github.com" ? DEFAULT_COPILOT_API_BASE_URL : `https://copilot-api.${domain}`;
}
function resolveCopilotTokenExpiresAtMs(expiresAt) {
	const parsed = typeof expiresAt === "number" && Number.isFinite(expiresAt) ? expiresAt : typeof expiresAt === "string" && expiresAt.trim().length > 0 ? parseStrictNonNegativeInteger(expiresAt) : void 0;
	if (parsed === void 0) return;
	return parsed < 1e11 ? resolveExpiresAtMsFromEpochSeconds(parsed) : asDateTimestampMs(parsed);
}
function parseCopilotTokenResponse(value) {
	if (!value || typeof value !== "object") throw new Error("Unexpected response from GitHub Copilot token endpoint");
	const { token: credential, expires_at: expiresAt } = value;
	if (typeof credential !== "string" || credential.trim().length === 0) throw new Error("Copilot token response missing token");
	if (expiresAt === void 0 || expiresAt === null || typeof expiresAt === "string" && expiresAt.trim().length === 0) throw new Error("Copilot token response missing expires_at");
	const expiresAtMs = resolveCopilotTokenExpiresAtMs(expiresAt);
	if (expiresAtMs === void 0) throw new Error("Copilot token response has invalid expires_at");
	return {
		token: credential,
		expiresAt: expiresAtMs
	};
}
async function cancelUnreadResponseBody(response) {
	if (!response.bodyUsed) await response.body?.cancel().catch(() => void 0);
}
async function resolveCopilotApiToken(params) {
	const domain = resolveGithubCopilotDomain({
		env: params.env ?? process.env,
		explicit: params.githubDomain,
		config: params.config
	});
	const tokenUrl = copilotTokenUrl(domain);
	const apiBaseFallback = copilotApiBaseFallback(domain);
	const sourceCredentialFingerprint = fingerprintCopilotSourceCredential(params.githubToken);
	const cache = resolveCopilotTokenCache({
		domain,
		sourceCredentialFingerprint,
		...params.openCacheStore || openConfiguredCacheStore ? { openCacheStore: params.openCacheStore ?? openConfiguredCacheStore } : {},
		...params.cachePath !== void 0 ? { cachePath: params.cachePath } : {},
		...params.loadJsonFileImpl ? { loadJsonFileImpl: params.loadJsonFileImpl } : {},
		...params.saveJsonFileImpl ? { saveJsonFileImpl: params.saveJsonFileImpl } : {}
	});
	const cached = cache.load();
	if (cached && typeof cached.token === "string" && typeof cached.expiresAt === "number" && isCopilotTokenUsable({
		cache: cached,
		domain,
		sourceCredentialFingerprint
	})) {
		const { token: credential } = cached;
		return {
			token: credential,
			expiresAt: cached.expiresAt,
			source: `cache:${cache.path}`,
			baseUrl: deriveCopilotApiBaseUrlFromToken(cached.token) ?? apiBaseFallback
		};
	}
	const fetchImpl = params.fetchImpl ?? fetch;
	const signal = AbortSignal.timeout(COPILOT_TOKEN_EXCHANGE_TIMEOUT_MS);
	let payload;
	try {
		const response = await fetchImpl(tokenUrl, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${params.githubToken}`,
				"Copilot-Integration-Id": COPILOT_INTEGRATION_ID,
				...buildCopilotIdeHeaders({ includeApiVersion: true })
			},
			signal
		});
		if (!response.ok) {
			await cancelUnreadResponseBody(response);
			throw new Error(`Copilot token exchange failed: HTTP ${response.status}`);
		}
		payload = parseCopilotTokenResponse(await readProviderJsonResponse(response, "github-copilot.token"));
	} catch (error) {
		if (signal.aborted && error === signal.reason) throw new Error(`Copilot token exchange failed: timed out after ${COPILOT_TOKEN_EXCHANGE_TIMEOUT_MS}ms`, { cause: error });
		throw error;
	}
	const cachedPayload = {
		token: payload.token,
		expiresAt: payload.expiresAt,
		updatedAt: Date.now(),
		integrationId: COPILOT_INTEGRATION_ID,
		sourceCredentialFingerprint,
		domain
	};
	cache.save(cachedPayload);
	const { token: credential } = cachedPayload;
	return {
		token: credential,
		expiresAt: cachedPayload.expiresAt,
		source: `fetched:${tokenUrl}`,
		baseUrl: deriveCopilotApiBaseUrlFromToken(cachedPayload.token) ?? apiBaseFallback
	};
}
//#endregion
export { configureCopilotTokenCacheStore as n, resolveCopilotApiToken as r, DEFAULT_COPILOT_API_BASE_URL as t };
