import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { E as resolveExpiresAtMsFromEpochSeconds } from "./number-coercion-Crk_c9KW.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import { m as readProviderJsonResponse, o as createProviderHttpError } from "./provider-http-errors-DrOMjuGn.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-C7JzO8vD.js";
import { c as resolveProviderRequestHeaders } from "./provider-request-config-DrrUROfX.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./number-runtime-C6TGSEc_.js";
import { n as captureWsEvent } from "./runtime-ByW-vknB.js";
import "./proxy-capture-DdZihvlR.js";
import "./ssrf-runtime-b7ye-Z-7.js";
import "./provider-http-D2uO-AEP.js";
//#region extensions/openai/realtime-provider-shared.ts
const OPENAI_REALTIME_API_BASE_URL = "https://api.openai.com/v1";
const OPENAI_REALTIME_SSRF_POLICY = {
	allowRfc2544BenchmarkRange: true,
	allowIpv6UniqueLocalRange: true,
	hostnameAllowlist: [new URL(OPENAI_REALTIME_API_BASE_URL).hostname]
};
const OPENAI_REALTIME_CLIENT_SECRET_REQUEST_TIMEOUT_MS = 3e4;
const trimToUndefined = normalizeOptionalString;
function readRealtimeErrorDetail(error) {
	if (typeof error === "string" && error) return error;
	const message = asOptionalRecord(error)?.message;
	if (typeof message === "string" && message) return message;
	return "Unknown error";
}
function resolveOpenAIProviderConfigRecord(config) {
	return asOptionalRecord(asOptionalRecord(config.providers)?.openai) ?? asOptionalRecord(config.openai) ?? asOptionalRecord(config);
}
function captureOpenAIRealtimeWsClose(params) {
	captureWsEvent({
		url: params.url,
		direction: "local",
		kind: "ws-close",
		flowId: params.flowId,
		closeCode: typeof params.code === "number" ? params.code : void 0,
		meta: {
			provider: "openai",
			capability: params.capability,
			reason: Buffer.isBuffer(params.reasonBuffer) && params.reasonBuffer.length > 0 ? params.reasonBuffer.toString("utf8") : void 0
		}
	});
}
function readStringField(value, key) {
	if (!value || typeof value !== "object") return;
	const raw = value[key];
	return typeof raw === "string" && raw.trim() ? raw.trim() : void 0;
}
async function createOpenAIRealtimeSecret(params) {
	const { response, release } = await fetchWithSsrFGuard({
		url: params.url,
		init: {
			method: "POST",
			headers: resolveProviderRequestHeaders({
				provider: "openai",
				baseUrl: params.url,
				capability: "audio",
				transport: "http",
				defaultHeaders: {
					Authorization: `Bearer ${params.authToken}`,
					"Content-Type": "application/json"
				}
			}) ?? {
				Authorization: `Bearer ${params.authToken}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(params.body)
		},
		policy: OPENAI_REALTIME_SSRF_POLICY,
		timeoutMs: OPENAI_REALTIME_CLIENT_SECRET_REQUEST_TIMEOUT_MS,
		auditContext: params.auditContext
	});
	const payload = await (async () => {
		try {
			if (!response.ok) {
				const error = await createProviderHttpError(response, params.errorMessage);
				if (response.status === 401 && params.authRejectedMessage) error.message = params.authRejectedMessage;
				throw error;
			}
			return await readProviderJsonResponse(response, "openai.realtime-session");
		} finally {
			await release();
		}
	})();
	const nestedSecret = payload && typeof payload === "object" ? payload.client_secret : void 0;
	const clientSecret = readStringField(payload, "value") ?? readStringField(nestedSecret, "value");
	if (!clientSecret) throw new Error(params.missingValueMessage);
	const expiresAtMs = resolveExpiresAtMsFromEpochSeconds(payload && typeof payload === "object" ? payload.expires_at : void 0);
	return {
		value: clientSecret,
		...expiresAtMs === void 0 ? {} : { expiresAt: expiresAtMs }
	};
}
async function createOpenAIRealtimeClientSecret(params) {
	const url = `${OPENAI_REALTIME_API_BASE_URL}/realtime/client_secrets`;
	return createOpenAIRealtimeSecret({
		...params,
		url,
		body: { session: params.session },
		errorMessage: "OpenAI Realtime client secret failed",
		missingValueMessage: "OpenAI Realtime client secret response did not include a value"
	});
}
async function createOpenAIRealtimeTranscriptionClientSecret(params) {
	const url = `${OPENAI_REALTIME_API_BASE_URL}/realtime/client_secrets`;
	return createOpenAIRealtimeSecret({
		...params,
		url,
		body: { session: params.session },
		errorMessage: "OpenAI Realtime transcription client secret failed",
		missingValueMessage: "OpenAI Realtime transcription client secret response did not include a value"
	});
}
//#endregion
export { resolveOpenAIProviderConfigRecord as a, readRealtimeErrorDetail as i, createOpenAIRealtimeClientSecret as n, trimToUndefined as o, createOpenAIRealtimeTranscriptionClientSecret as r, captureOpenAIRealtimeWsClose as t };
