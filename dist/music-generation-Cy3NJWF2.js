import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { u as readResponseWithLimit } from "./http-body-g29H4gTR.js";
import { a as maxBytesForKind } from "./constants-Mf57IYS0.js";
import { r as extensionForMime } from "./mime-De36NoRj.js";
import { i as fetchProviderDownloadResponse, n as createProviderOperationDeadline, r as createProviderOperationTimeoutResolver } from "./shared-CpiwWgfg.js";
//#region src/music-generation/provider-assets.ts
function normalizeSpecificAudioMimeType(value) {
	const mimeType = normalizeOptionalString(value)?.split(";")[0]?.trim().toLowerCase();
	if (!mimeType || mimeType === "application/octet-stream" || mimeType === "binary/octet-stream") return;
	return mimeType;
}
function pushGeneratedMusicFileCandidate(candidates, value) {
	if (typeof value === "string") {
		const url = normalizeOptionalString(value);
		if (url) candidates.push({ url });
		return;
	}
	if (!isRecord(value)) return;
	const url = normalizeOptionalString(value.url);
	if (!url) return;
	candidates.push({
		url,
		...normalizeOptionalString(value.content_type) ? { mimeType: normalizeOptionalString(value.content_type) } : {},
		...normalizeOptionalString(value.file_name) ? { fileName: normalizeOptionalString(value.file_name) } : {}
	});
}
/** Extract URL/file candidates from common provider response keys. */
function extractGeneratedMusicFileCandidates(payload, keys = ["audio", "audio_file"]) {
	if (!isRecord(payload)) return [];
	const candidates = [];
	for (const key of keys) pushGeneratedMusicFileCandidate(candidates, payload[key]);
	return candidates;
}
/** Convert a base64 provider payload into a generated music asset. */
function generatedMusicAssetFromBase64(params) {
	const ext = extensionForMime(params.mimeType)?.replace(/^\./u, "") || "mp3";
	return {
		buffer: Buffer.from(params.base64, "base64"),
		mimeType: params.mimeType,
		fileName: params.fileName ?? `track-${(params.index ?? 0) + 1}.${ext}`
	};
}
/** Download a generated music URL with size limits and inferred audio metadata. */
async function downloadGeneratedMusicAsset(params) {
	const deadline = createProviderOperationDeadline({
		timeoutMs: params.timeoutMs,
		label: `${params.provider} generated music download`
	});
	const timeoutMs = createProviderOperationTimeoutResolver({
		deadline,
		defaultTimeoutMs: params.timeoutMs
	});
	const response = await fetchProviderDownloadResponse({
		url: params.candidate.url,
		init: { method: "GET" },
		deadline,
		fetchFn: params.fetchFn,
		provider: params.provider,
		requestFailedMessage: params.requestFailedMessage
	});
	const mimeType = normalizeSpecificAudioMimeType(response.headers.get("content-type")) ?? normalizeSpecificAudioMimeType(params.candidate.mimeType) ?? "audio/mpeg";
	const ext = extensionForMime(mimeType)?.replace(/^\./u, "") || "mp3";
	return {
		buffer: await readResponseWithLimit(response, params.maxBytes ?? maxBytesForKind("audio"), {
			timeoutMs,
			onTimeout: ({ timeoutMs: bodyTimeoutMs }) => /* @__PURE__ */ new Error(`${params.provider} generated music download timed out after ${deadline.timeoutMs ?? bodyTimeoutMs}ms`),
			onOverflow: ({ maxBytes: maxBytesLocal }) => /* @__PURE__ */ new Error(`${params.provider} generated music download exceeds ${maxBytesLocal} bytes`)
		}),
		mimeType,
		fileName: params.candidate.fileName ?? `track-${(params.index ?? 0) + 1}.${ext}`,
		metadata: { url: params.candidate.url }
	};
}
//#endregion
export { extractGeneratedMusicFileCandidates as n, generatedMusicAssetFromBase64 as r, downloadGeneratedMusicAsset as t };
