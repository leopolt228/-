import { j as resolveTimerTimeoutMs } from "./number-coercion-Crk_c9KW.js";
import "./number-runtime-C6TGSEc_.js";
//#region extensions/openai/openai-chatgpt-oauth-preflight.runtime.ts
const OPENAI_AUTH_PROBE_URL = "https://auth.openai.com/oauth/authorize?response_type=code&client_id=openclaw-preflight&redirect_uri=http%3A%2F%2Flocalhost%3A1455%2Fauth%2Fcallback&scope=openid+profile+email";
const TLS_CERT_ERROR_CODES = /* @__PURE__ */ new Set([
	"UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
	"UNABLE_TO_VERIFY_LEAF_SIGNATURE",
	"CERT_HAS_EXPIRED",
	"DEPTH_ZERO_SELF_SIGNED_CERT",
	"SELF_SIGNED_CERT_IN_CHAIN",
	"ERR_TLS_CERT_ALTNAME_INVALID"
]);
const TLS_CERT_ERROR_PATTERNS = [
	/unable to get local issuer certificate/i,
	/unable to verify the first certificate/i,
	/self[- ]signed certificate/i,
	/certificate has expired/i
];
function getErrorRecord(error) {
	return error && typeof error === "object" ? error : null;
}
function extractFailure(error) {
	const root = getErrorRecord(error);
	const rootCause = getErrorRecord(root?.cause);
	const code = typeof rootCause?.code === "string" ? rootCause.code : void 0;
	const message = typeof rootCause?.message === "string" ? rootCause.message : typeof root?.message === "string" ? root.message : String(error);
	return {
		code,
		message,
		kind: (code ? TLS_CERT_ERROR_CODES.has(code) : false) || TLS_CERT_ERROR_PATTERNS.some((pattern) => pattern.test(message)) ? "tls-cert" : "network"
	};
}
async function runOpenAIOAuthTlsPreflight(options) {
	const timeoutMs = resolveTimerTimeoutMs(options?.timeoutMs, 5e3);
	const fetchImpl = options?.fetchImpl ?? fetch;
	let response;
	try {
		response = await fetchImpl(OPENAI_AUTH_PROBE_URL, {
			method: "GET",
			redirect: "manual",
			signal: AbortSignal.timeout(timeoutMs)
		});
		return { ok: true };
	} catch (error) {
		const failure = extractFailure(error);
		return {
			ok: false,
			kind: failure.kind,
			code: failure.code,
			message: failure.message
		};
	} finally {
		if (response?.bodyUsed !== true) await response?.body?.cancel().catch(() => void 0);
	}
}
//#endregion
export { runOpenAIOAuthTlsPreflight as t };
