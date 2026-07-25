import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { u as readResponseWithLimit } from "./http-body-g29H4gTR.js";
import { r as assertOkOrThrowHttpError } from "./provider-http-errors-DrOMjuGn.js";
import { r as extensionForMime } from "./mime-De36NoRj.js";
import { t as executeProviderOperationWithRetry } from "./operation-retry-Dmka1f2f.js";
import { n as createProviderOperationDeadline, o as fetchWithTimeoutGuarded, r as createProviderOperationTimeoutResolver } from "./shared-CpiwWgfg.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./response-limit-runtime-Bi_ekjFI.js";
import "./media-mime-Bp89ch9k.js";
import "./provider-http-D2uO-AEP.js";
//#region extensions/xai/video-generation-transport.ts
function resolveXaiVideoFetchTimeoutMs(timeoutMs, defaultTimeoutMs) {
	const resolved = typeof timeoutMs === "function" ? timeoutMs() : timeoutMs;
	return typeof resolved === "number" && Number.isFinite(resolved) && resolved > 0 ? resolved : defaultTimeoutMs;
}
async function fetchXaiVideoResponse(params) {
	return await executeProviderOperationWithRetry({
		provider: "xai",
		stage: params.stage,
		operation: async () => {
			const result = await fetchWithTimeoutGuarded(params.url, params.init, resolveXaiVideoFetchTimeoutMs(params.timeoutMs, params.defaultTimeoutMs), params.fetchFn, {
				...params.allowPrivateNetwork ? { ssrfPolicy: { allowPrivateNetwork: true } } : {},
				...params.dispatcherPolicy ? { dispatcherPolicy: params.dispatcherPolicy } : {},
				auditContext: params.auditContext
			});
			try {
				await assertOkOrThrowHttpError(result.response, params.requestFailedMessage);
				return result;
			} catch (error) {
				await result.release();
				throw error;
			}
		}
	});
}
async function downloadXaiVideo(params) {
	const deadline = createProviderOperationDeadline({
		timeoutMs: params.timeoutMs ?? params.defaultTimeoutMs,
		label: "xAI generated video download"
	});
	const timeoutMs = createProviderOperationTimeoutResolver({
		deadline,
		defaultTimeoutMs: deadline.timeoutMs ?? params.defaultTimeoutMs
	});
	const { response, release } = await fetchXaiVideoResponse({
		url: params.url,
		stage: "download",
		requestFailedMessage: "xAI generated video download failed",
		auditContext: "xai-video-download",
		init: { method: "GET" },
		timeoutMs,
		defaultTimeoutMs: params.defaultTimeoutMs,
		allowPrivateNetwork: params.allowPrivateNetwork,
		dispatcherPolicy: params.dispatcherPolicy,
		fetchFn: params.fetchFn
	});
	try {
		const mimeType = normalizeOptionalString(response.headers.get("content-type")) ?? "video/mp4";
		return {
			buffer: await readResponseWithLimit(response, params.maxBytes, {
				timeoutMs,
				onTimeout: ({ timeoutMs: bodyTimeoutMs }) => /* @__PURE__ */ new Error(`xAI generated video download timed out after ${deadline.timeoutMs ?? bodyTimeoutMs}ms`),
				onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`xAI generated video download exceeds ${maxBytes} bytes`)
			}),
			mimeType,
			fileName: `video-1.${extensionForMime(mimeType)?.slice(1) ?? "mp4"}`
		};
	} finally {
		await release();
	}
}
//#endregion
export { fetchXaiVideoResponse as n, downloadXaiVideo as t };
