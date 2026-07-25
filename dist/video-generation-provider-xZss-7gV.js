import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { u as asSafeIntegerInRange } from "./number-coercion-Crk_c9KW.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { u as readResponseWithLimit } from "./http-body-g29H4gTR.js";
import { m as readProviderJsonResponse, r as assertOkOrThrowHttpError } from "./provider-http-errors-DrOMjuGn.js";
import { r as extensionForMime } from "./mime-De36NoRj.js";
import { c as postJsonRequest, h as resolveProviderOperationTimeoutMs, i as fetchProviderDownloadResponse, n as createProviderOperationDeadline, p as resolveProviderHttpRequestConfig, r as createProviderOperationTimeoutResolver, s as pollProviderOperationJson } from "./shared-CpiwWgfg.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./response-limit-runtime-Bi_ekjFI.js";
import { r as isProviderApiKeyConfigured } from "./provider-auth-Bnib2g6h.js";
import "./media-mime-Bp89ch9k.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-Dde1buiB.js";
import "./provider-http-D2uO-AEP.js";
import { d as toImageDataUrl } from "./image-generation-pAFfF0km.js";
import { t as BYTEPLUS_BASE_URL } from "./models-CJ9TEUQT.js";
//#region extensions/byteplus/video-generation-provider.ts
/**
* BytePlus Seedance video generation provider implementation.
*/
const DEFAULT_BYTEPLUS_VIDEO_MODEL = "seedance-1-0-pro-250528";
const DEFAULT_TIMEOUT_MS = 12e4;
const POLL_INTERVAL_MS = 5e3;
const MAX_POLL_ATTEMPTS = 120;
const BYTEPLUS_SEED_MAX = 2147483647;
const BYTEPLUS_MIN_DURATION_SECONDS = 2;
const BYTEPLUS_MAX_DURATION_SECONDS = 12;
const DEFAULT_GENERATED_VIDEO_MAX_BYTES = 16 * 1024 * 1024;
async function readBytePlusJsonResponse(response, label) {
	const payload = await readProviderJsonResponse(response, label);
	if (!isRecord(payload)) throw new Error(`${label}: malformed JSON response`);
	return payload;
}
function readBytePlusTaskStatus(payload) {
	const status = normalizeOptionalString(payload.status);
	switch (status) {
		case "running":
		case "failed":
		case "queued":
		case "succeeded":
		case "cancelled": return status;
		case void 0: throw new Error("BytePlus video status response missing task status");
		default: throw new Error(`BytePlus video status response returned unknown task status: ${status}`);
	}
}
function readBytePlusErrorMessage(error) {
	return isRecord(error) ? normalizeOptionalString(error.message) : void 0;
}
function readBytePlusVideoUrl(payload) {
	const content = payload.content;
	if (content !== void 0 && !isRecord(content)) throw new Error("BytePlus video generation completed with malformed content");
	const videoUrl = normalizeOptionalString(content?.video_url);
	if (!videoUrl) throw new Error("BytePlus video generation completed without a video URL");
	return videoUrl;
}
function resolveBytePlusVideoBaseUrl(req) {
	return normalizeOptionalString(req.cfg?.models?.providers?.byteplus?.baseUrl) ?? BYTEPLUS_BASE_URL;
}
function resolveGeneratedVideoMaxBytes(req) {
	const configured = req.cfg.agents?.defaults?.mediaMaxMb;
	if (typeof configured === "number" && Number.isFinite(configured) && configured > 0) return Math.floor(configured * 1024 * 1024);
	return DEFAULT_GENERATED_VIDEO_MAX_BYTES;
}
function resolveBytePlusImageUrl(req) {
	const input = req.inputImages?.[0];
	if (!input) return;
	const inputUrl = normalizeOptionalString(input.url);
	if (inputUrl) return inputUrl;
	if (!input.buffer) throw new Error("BytePlus reference image is missing image data.");
	return toImageDataUrl({
		...input,
		buffer: input.buffer,
		defaultMimeType: "image/png"
	});
}
function resolveBytePlusSeed(value) {
	return asSafeIntegerInRange(value, {
		min: -1,
		max: BYTEPLUS_SEED_MAX
	});
}
function resolveBytePlusDurationSeconds(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	return asSafeIntegerInRange(Math.round(value), {
		min: BYTEPLUS_MIN_DURATION_SECONDS,
		max: BYTEPLUS_MAX_DURATION_SECONDS
	});
}
function readBytePlusDurationSeconds(value) {
	return asSafeIntegerInRange(value, {
		min: BYTEPLUS_MIN_DURATION_SECONDS,
		max: BYTEPLUS_MAX_DURATION_SECONDS
	});
}
async function pollBytePlusTask(params) {
	const deadline = createProviderOperationDeadline({
		timeoutMs: params.timeoutMs,
		label: `BytePlus video generation task ${params.taskId}`
	});
	return await pollProviderOperationJson({
		url: `${params.baseUrl}/contents/generations/tasks/${params.taskId}`,
		headers: params.headers,
		deadline,
		defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
		fetchFn: params.fetchFn,
		maxAttempts: MAX_POLL_ATTEMPTS,
		pollIntervalMs: POLL_INTERVAL_MS,
		requestFailedMessage: "BytePlus video status request failed",
		timeoutMessage: `BytePlus video generation task ${params.taskId} did not finish in time`,
		isComplete: (payload) => readBytePlusTaskStatus(payload) === "succeeded",
		getFailureMessage: (payload) => {
			const status = readBytePlusTaskStatus(payload);
			return status === "failed" || status === "cancelled" ? readBytePlusErrorMessage(payload.error) || "BytePlus video generation failed" : void 0;
		}
	});
}
async function downloadBytePlusVideo(params) {
	const deadline = createProviderOperationDeadline({
		timeoutMs: params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
		label: "BytePlus generated video download"
	});
	const timeoutMs = createProviderOperationTimeoutResolver({
		deadline,
		defaultTimeoutMs: deadline.timeoutMs ?? DEFAULT_TIMEOUT_MS
	});
	const response = await fetchProviderDownloadResponse({
		url: params.url,
		init: { method: "GET" },
		deadline,
		fetchFn: params.fetchFn,
		provider: "byteplus",
		requestFailedMessage: "BytePlus generated video download failed"
	});
	const mimeType = normalizeOptionalString(response.headers.get("content-type")) ?? "video/mp4";
	return {
		buffer: await readResponseWithLimit(response, params.maxBytes, {
			timeoutMs,
			onTimeout: ({ timeoutMs: bodyTimeoutMs }) => /* @__PURE__ */ new Error(`BytePlus generated video download timed out after ${deadline.timeoutMs ?? bodyTimeoutMs}ms`),
			onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`BytePlus generated video download exceeds ${maxBytes} bytes`)
		}),
		mimeType,
		fileName: `video-1.${extensionForMime(mimeType)?.slice(1) ?? "mp4"}`
	};
}
/** Builds the BytePlus video generation provider registered by the plugin. */
function buildBytePlusVideoGenerationProvider() {
	return {
		id: "byteplus",
		label: "BytePlus",
		defaultModel: DEFAULT_BYTEPLUS_VIDEO_MODEL,
		models: [DEFAULT_BYTEPLUS_VIDEO_MODEL, "seedance-1-5-pro-251215"],
		isConfigured: ({ agentDir }) => isProviderApiKeyConfigured({
			provider: "byteplus",
			agentDir
		}),
		capabilities: {
			providerOptions: {
				seed: "number",
				draft: "boolean",
				camera_fixed: "boolean"
			},
			generate: {
				maxVideos: 1,
				maxDurationSeconds: 12,
				supportsAspectRatio: true,
				supportsResolution: true,
				supportsAudio: true,
				supportsWatermark: true
			},
			imageToVideo: {
				enabled: true,
				maxVideos: 1,
				maxInputImages: 1,
				maxDurationSeconds: 12,
				supportsAspectRatio: true,
				supportsResolution: true,
				supportsAudio: true,
				supportsWatermark: true
			},
			videoToVideo: { enabled: false }
		},
		async generateVideo(req) {
			if ((req.inputVideos?.length ?? 0) > 0) throw new Error("BytePlus video generation does not support video reference inputs.");
			const auth = await resolveApiKeyForProvider({
				provider: "byteplus",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("BytePlus API key missing");
			const fetchFn = fetch;
			const deadline = createProviderOperationDeadline({
				timeoutMs: req.timeoutMs,
				label: "BytePlus video generation"
			});
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
				baseUrl: resolveBytePlusVideoBaseUrl(req),
				defaultBaseUrl: BYTEPLUS_BASE_URL,
				allowPrivateNetwork: false,
				defaultHeaders: {
					Authorization: `Bearer ${auth.apiKey}`,
					"Content-Type": "application/json"
				},
				provider: "byteplus",
				capability: "video",
				transport: "http"
			});
			const resolvedModel = normalizeOptionalString(req.model) || DEFAULT_BYTEPLUS_VIDEO_MODEL;
			const content = [{
				type: "text",
				text: req.prompt
			}];
			const imageUrl = resolveBytePlusImageUrl(req);
			if (imageUrl) content.push({
				type: "image_url",
				image_url: { url: imageUrl },
				role: "first_frame"
			});
			const body = {
				model: resolvedModel,
				content
			};
			const aspectRatio = normalizeOptionalString(req.aspectRatio);
			if (aspectRatio) body.ratio = aspectRatio;
			const resolution = normalizeOptionalString(req.resolution)?.toLowerCase();
			if (resolution) body.resolution = resolution;
			const duration = resolveBytePlusDurationSeconds(req.durationSeconds);
			if (duration !== void 0) body.duration = duration;
			if (typeof req.audio === "boolean") body.generate_audio = req.audio;
			if (typeof req.watermark === "boolean") body.watermark = req.watermark;
			const opts = req.providerOptions ?? {};
			const seed = resolveBytePlusSeed(opts.seed);
			const draft = opts.draft === true;
			const cameraFixed = typeof opts.camera_fixed === "boolean" ? opts.camera_fixed : void 0;
			if (seed != null) body.seed = seed;
			if (draft && !body.resolution) body.resolution = "480p";
			if (cameraFixed != null) body.camera_fixed = cameraFixed;
			const { response, release } = await postJsonRequest({
				url: `${baseUrl}/contents/generations/tasks`,
				headers,
				body,
				timeoutMs: resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: DEFAULT_TIMEOUT_MS
				}),
				fetchFn,
				allowPrivateNetwork,
				dispatcherPolicy
			});
			try {
				await assertOkOrThrowHttpError(response, "BytePlus video generation failed");
				const taskId = normalizeOptionalString((await readBytePlusJsonResponse(response, "BytePlus video generation failed")).id);
				if (!taskId) throw new Error("BytePlus video generation response missing task id");
				const completed = await pollBytePlusTask({
					taskId,
					headers,
					timeoutMs: resolveProviderOperationTimeoutMs({
						deadline,
						defaultTimeoutMs: DEFAULT_TIMEOUT_MS
					}),
					baseUrl,
					fetchFn
				});
				const videoUrl = readBytePlusVideoUrl(completed);
				return {
					videos: [await downloadBytePlusVideo({
						url: videoUrl,
						timeoutMs: createProviderOperationTimeoutResolver({
							deadline,
							defaultTimeoutMs: DEFAULT_TIMEOUT_MS
						}),
						fetchFn,
						maxBytes: resolveGeneratedVideoMaxBytes(req)
					})],
					model: normalizeOptionalString(completed.model) ?? resolvedModel,
					metadata: {
						taskId,
						status: normalizeOptionalString(completed.status),
						videoUrl,
						ratio: normalizeOptionalString(completed.ratio),
						resolution: normalizeOptionalString(completed.resolution),
						duration: readBytePlusDurationSeconds(completed.duration)
					}
				};
			} finally {
				await release();
			}
		}
	};
}
//#endregion
export { buildBytePlusVideoGenerationProvider as t };
