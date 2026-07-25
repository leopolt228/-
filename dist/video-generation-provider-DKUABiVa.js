import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { m as readProviderJsonResponse, r as assertOkOrThrowHttpError } from "./provider-http-errors-DrOMjuGn.js";
import { u as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-DrrUROfX.js";
import { c as postJsonRequest, g as waitProviderOperationPollInterval, h as resolveProviderOperationTimeoutMs, n as createProviderOperationDeadline, p as resolveProviderHttpRequestConfig, r as createProviderOperationTimeoutResolver } from "./shared-CpiwWgfg.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import { r as isProviderApiKeyConfigured } from "./provider-auth-Bnib2g6h.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-Dde1buiB.js";
import "./provider-http-D2uO-AEP.js";
import { d as toImageDataUrl } from "./image-generation-pAFfF0km.js";
import { n as fetchXaiVideoResponse, t as downloadXaiVideo } from "./video-generation-transport-BOqHMGpg.js";
//#region extensions/xai/video-generation-provider.ts
const DEFAULT_XAI_VIDEO_BASE_URL = "https://api.x.ai/v1";
const DEFAULT_XAI_VIDEO_MODEL = "grok-imagine-video";
const XAI_VIDEO_15_MODEL = "grok-imagine-video-1.5";
const XAI_VIDEO_15_MODEL_IDS = /* @__PURE__ */ new Set([
	XAI_VIDEO_15_MODEL,
	"grok-imagine-video-1.5-preview",
	"grok-imagine-video-1.5-2026-05-30"
]);
const DEFAULT_TIMEOUT_MS = 6e5;
const POLL_INTERVAL_MS = 5e3;
const MAX_POLL_ATTEMPTS = 120;
const XAI_VIDEO_ASPECT_RATIOS = /* @__PURE__ */ new Set([
	"1:1",
	"16:9",
	"9:16",
	"4:3",
	"3:4",
	"3:2",
	"2:3"
]);
const XAI_VIDEO_15_CAPABILITIES = {
	imageToVideo: {
		enabled: true,
		maxVideos: 1,
		maxInputImages: 1,
		maxDurationSeconds: 15,
		aspectRatios: [...XAI_VIDEO_ASPECT_RATIOS],
		resolutions: [
			"480P",
			"720P",
			"1080P"
		],
		supportsAspectRatio: true,
		supportsResolution: true
	},
	videoToVideo: { enabled: false }
};
const XAI_VIDEO_MALFORMED_RESPONSE = "xAI video generation response malformed";
const XAI_VIDEO_TERMINAL_FAILURE_STATUSES = /* @__PURE__ */ new Set([
	"failed",
	"error",
	"expired",
	"cancelled"
]);
const XAI_VIDEO_DEFAULT_DURATION_SECONDS = 8;
const XAI_VIDEO_DEFAULT_ASPECT_RATIO = "16:9";
const XAI_VIDEO_DEFAULT_RESOLUTION = "480p";
const DEFAULT_GENERATED_VIDEO_MAX_BYTES = 16 * 1024 * 1024;
async function readXaiVideoJson(response) {
	let payload;
	try {
		payload = await readProviderJsonResponse(response, "xAI video generation response");
	} catch (error) {
		if (error instanceof Error && error.message.endsWith(": malformed JSON response")) throw new Error(XAI_VIDEO_MALFORMED_RESPONSE, { cause: error });
		throw error;
	}
	if (!isRecord(payload)) throw new Error(XAI_VIDEO_MALFORMED_RESPONSE);
	return payload;
}
function xaiErrorMessage(payload) {
	const error = payload.error;
	if (error === void 0 || error === null) return;
	if (!isRecord(error)) throw new Error(XAI_VIDEO_MALFORMED_RESPONSE);
	return normalizeOptionalString(error.message);
}
function readXaiCreateResponse(payload) {
	return {
		request_id: normalizeOptionalString(payload.request_id),
		error: xaiErrorMessage(payload) ? { message: xaiErrorMessage(payload) } : null
	};
}
function readXaiStatusResponse(payload) {
	const video = payload.video;
	if (video !== void 0 && video !== null && !isRecord(video)) throw new Error(XAI_VIDEO_MALFORMED_RESPONSE);
	return {
		request_id: normalizeOptionalString(payload.request_id),
		status: normalizeOptionalString(payload.status) ?? "",
		video: isRecord(video) ? { url: normalizeOptionalString(video.url) } : null,
		error: xaiErrorMessage(payload) ? { message: xaiErrorMessage(payload) } : null
	};
}
function resolveXaiVideoBaseUrl(req) {
	return normalizeOptionalString(req.cfg?.models?.providers?.xai?.baseUrl) ?? DEFAULT_XAI_VIDEO_BASE_URL;
}
function resolveGeneratedVideoMaxBytes(req) {
	const configured = req.cfg.agents?.defaults?.mediaMaxMb;
	if (typeof configured === "number" && Number.isFinite(configured) && configured > 0) return Math.floor(configured * 1024 * 1024);
	return DEFAULT_GENERATED_VIDEO_MAX_BYTES;
}
function resolveImageUrl(input) {
	if (!input) return;
	const inputUrl = normalizeOptionalString(input.url);
	if (inputUrl) return inputUrl;
	if (!input.buffer) throw new Error("xAI image-to-video input is missing image data.");
	return toImageDataUrl({
		...input,
		buffer: input.buffer,
		defaultMimeType: "image/png"
	});
}
function resolveRequiredImageUrl(input) {
	const imageUrl = resolveImageUrl(input);
	if (!imageUrl) throw new Error("xAI image-to-video input is missing image data.");
	return imageUrl;
}
function isReferenceImage(input) {
	return normalizeOptionalString(input.role)?.toLowerCase() === "reference_image";
}
function isXaiVideo15Model(model) {
	const normalized = normalizeOptionalString(model);
	return normalized ? XAI_VIDEO_15_MODEL_IDS.has(normalized) : false;
}
function isFirstFrameImage(input) {
	const role = normalizeOptionalString(input.role)?.toLowerCase();
	return role === void 0 || role === "first_frame";
}
function validateXaiVideo15Request(req) {
	if (!isXaiVideo15Model(req.model)) return;
	if ((req.inputVideos?.length ?? 0) > 0) throw new Error("xAI grok-imagine-video-1.5 does not support video inputs.");
	const [inputImage, ...additionalImages] = req.inputImages ?? [];
	if (!inputImage || additionalImages.length > 0) throw new Error("xAI grok-imagine-video-1.5 requires exactly one first-frame image.");
	if (!isFirstFrameImage(inputImage)) throw new Error("xAI grok-imagine-video-1.5 supports only an ordinary or first_frame image.");
}
function resolveInputVideoUrl(input) {
	if (!input) return;
	const url = normalizeOptionalString(input.url);
	if (url) return url;
	if (input.buffer) throw new Error("xAI video editing currently requires a remote mp4 URL input.");
	throw new Error("xAI video editing input is missing video data.");
}
function resolveDurationSeconds(params) {
	if (typeof params.durationSeconds !== "number" || !Number.isFinite(params.durationSeconds)) return;
	const rounded = Math.round(params.durationSeconds);
	return Math.max(params.min ?? 1, Math.min(params.max ?? 15, rounded));
}
function resolveAspectRatio(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed || !XAI_VIDEO_ASPECT_RATIOS.has(trimmed)) return;
	return trimmed;
}
function resolveResolution(value, options) {
	if (typeof value !== "string") return;
	const normalized = value.trim().toLowerCase();
	if (normalized === "480p") return "480p";
	if (normalized === "720p") return "720p";
	if (normalized === "1080p") return options?.allow1080p ? "1080p" : "720p";
}
function resolveXaiVideoMode(req) {
	const hasVideoInput = (req.inputVideos?.length ?? 0) > 0;
	if (!hasVideoInput && (req.inputImages ?? []).some(isReferenceImage)) return "referenceToVideo";
	if (!hasVideoInput) return "generate";
	return typeof resolveDurationSeconds({
		durationSeconds: req.durationSeconds,
		min: 2,
		max: 10
	}) === "number" ? "extend" : "edit";
}
function buildCreateBody(req) {
	validateXaiVideo15Request(req);
	const inputImages = req.inputImages ?? [];
	const hasReferenceImages = inputImages.some(isReferenceImage);
	if (hasReferenceImages && !inputImages.every(isReferenceImage)) throw new Error("xAI reference-image video generation requires every image role to be reference_image.");
	if (!hasReferenceImages && inputImages.length > 1) throw new Error("xAI image-to-video generation supports at most one first-frame image.");
	if (hasReferenceImages && inputImages.length > 7) throw new Error("xAI reference-image video generation supports at most 7 reference images.");
	if ((req.inputVideos?.length ?? 0) > 1) throw new Error("xAI video generation supports at most one input video.");
	if ((req.inputImages?.length ?? 0) > 0 && (req.inputVideos?.length ?? 0) > 0) throw new Error("xAI video generation does not support image and video inputs together.");
	const mode = resolveXaiVideoMode(req);
	const body = {
		model: normalizeOptionalString(req.model) ?? DEFAULT_XAI_VIDEO_MODEL,
		prompt: req.prompt
	};
	if (mode === "generate") {
		const isVideo15 = isXaiVideo15Model(req.model);
		const imageUrl = resolveImageUrl(req.inputImages?.[0]);
		if (imageUrl) body.image = { url: imageUrl };
		body.duration = resolveDurationSeconds({
			durationSeconds: req.durationSeconds,
			min: 1,
			max: 15
		}) ?? XAI_VIDEO_DEFAULT_DURATION_SECONDS;
		const aspectRatio = resolveAspectRatio(req.aspectRatio);
		if (aspectRatio || !imageUrl) body.aspect_ratio = aspectRatio ?? XAI_VIDEO_DEFAULT_ASPECT_RATIO;
		body.resolution = resolveResolution(req.resolution, { allow1080p: isVideo15 }) ?? XAI_VIDEO_DEFAULT_RESOLUTION;
		return body;
	}
	if (mode === "referenceToVideo") {
		body.reference_images = inputImages.map((image) => ({ url: resolveRequiredImageUrl(image) }));
		body.duration = resolveDurationSeconds({
			durationSeconds: req.durationSeconds,
			min: 1,
			max: 10
		}) ?? XAI_VIDEO_DEFAULT_DURATION_SECONDS;
		body.aspect_ratio = resolveAspectRatio(req.aspectRatio) ?? XAI_VIDEO_DEFAULT_ASPECT_RATIO;
		body.resolution = resolveResolution(req.resolution) ?? XAI_VIDEO_DEFAULT_RESOLUTION;
		return body;
	}
	body.video = { url: resolveInputVideoUrl(req.inputVideos?.[0]) };
	if (mode === "extend") {
		const duration = resolveDurationSeconds({
			durationSeconds: req.durationSeconds,
			min: 2,
			max: 10
		});
		if (typeof duration === "number") body.duration = duration;
	}
	return body;
}
function resolveCreateEndpoint(req) {
	switch (resolveXaiVideoMode(req)) {
		case "edit": return "/videos/edits";
		case "extend": return "/videos/extensions";
		default: return "/videos/generations";
	}
}
async function pollXaiVideo(params) {
	const deadline = createProviderOperationDeadline({
		timeoutMs: params.timeoutMs,
		label: `xAI video generation request ${params.requestId}`
	});
	for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
		const { response, release } = await fetchXaiVideoResponse({
			url: `${params.baseUrl}/videos/${params.requestId}`,
			stage: "poll",
			requestFailedMessage: "xAI video status request failed",
			auditContext: "xai-video-status",
			init: {
				method: "GET",
				headers: params.headers
			},
			timeoutMs: createProviderOperationTimeoutResolver({
				deadline,
				defaultTimeoutMs: DEFAULT_TIMEOUT_MS
			}),
			defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
			allowPrivateNetwork: params.allowPrivateNetwork,
			dispatcherPolicy: params.dispatcherPolicy,
			fetchFn: params.fetchFn
		});
		const payload = await (async () => {
			try {
				return readXaiStatusResponse(await readXaiVideoJson(response));
			} finally {
				await release();
			}
		})();
		const normalizedStatus = payload.status.toLowerCase();
		if (normalizedStatus === "done") return payload;
		if (XAI_VIDEO_TERMINAL_FAILURE_STATUSES.has(normalizedStatus)) throw new Error(normalizeOptionalString(payload.error?.message) ?? `xAI video generation ${normalizedStatus}`);
		await waitProviderOperationPollInterval({
			deadline,
			pollIntervalMs: POLL_INTERVAL_MS
		});
	}
	throw new Error(`xAI video generation task ${params.requestId} did not finish in time`);
}
function buildXaiVideoGenerationProvider() {
	return {
		id: "xai",
		label: "xAI",
		defaultModel: DEFAULT_XAI_VIDEO_MODEL,
		defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
		models: [DEFAULT_XAI_VIDEO_MODEL, XAI_VIDEO_15_MODEL],
		catalogByModel: { [XAI_VIDEO_15_MODEL]: {
			capabilities: XAI_VIDEO_15_CAPABILITIES,
			modes: ["imageToVideo"]
		} },
		isConfigured: ({ agentDir }) => isProviderApiKeyConfigured({
			provider: "xai",
			agentDir
		}),
		capabilities: {
			generate: {
				maxVideos: 1,
				maxDurationSeconds: 15,
				aspectRatios: [...XAI_VIDEO_ASPECT_RATIOS],
				resolutions: ["480P", "720P"],
				supportsAspectRatio: true,
				supportsResolution: true
			},
			imageToVideo: {
				enabled: true,
				maxVideos: 1,
				maxInputImages: 7,
				maxDurationSeconds: 15,
				aspectRatios: [...XAI_VIDEO_ASPECT_RATIOS],
				resolutions: ["480P", "720P"],
				supportsAspectRatio: true,
				supportsResolution: true
			},
			videoToVideo: {
				enabled: true,
				maxVideos: 1,
				maxInputVideos: 1,
				maxDurationSeconds: 10,
				supportsAspectRatio: false,
				supportsResolution: false
			}
		},
		resolveModelCapabilities: ({ model }) => {
			if (!isXaiVideo15Model(model)) return;
			return XAI_VIDEO_15_CAPABILITIES;
		},
		async generateVideo(req) {
			const createBody = buildCreateBody(req);
			const createEndpoint = resolveCreateEndpoint(req);
			const auth = await resolveApiKeyForProvider({
				provider: "xai",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("xAI API key missing");
			const fetchFn = fetch;
			const deadline = createProviderOperationDeadline({
				timeoutMs: req.timeoutMs,
				label: "xAI video generation"
			});
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
				baseUrl: resolveXaiVideoBaseUrl(req),
				defaultBaseUrl: DEFAULT_XAI_VIDEO_BASE_URL,
				defaultHeaders: {
					Authorization: `Bearer ${auth.apiKey}`,
					"Content-Type": "application/json"
				},
				request: sanitizeConfiguredModelProviderRequest(req.cfg?.models?.providers?.xai?.request),
				provider: "xai",
				capability: "video",
				transport: "http"
			});
			const submitHeaders = new Headers(headers);
			submitHeaders.set("x-idempotency-key", crypto.randomUUID());
			const { response, release } = await postJsonRequest({
				url: `${baseUrl}${createEndpoint}`,
				headers: submitHeaders,
				body: createBody,
				timeoutMs: resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: DEFAULT_TIMEOUT_MS
				}),
				fetchFn,
				allowPrivateNetwork,
				dispatcherPolicy
			});
			try {
				await assertOkOrThrowHttpError(response, "xAI video generation failed");
				const submitted = readXaiCreateResponse(await readXaiVideoJson(response));
				const requestId = normalizeOptionalString(submitted.request_id);
				if (!requestId) throw new Error(normalizeOptionalString(submitted.error?.message) ?? "xAI video generation response missing request_id");
				const completed = await pollXaiVideo({
					requestId,
					headers,
					timeoutMs: resolveProviderOperationTimeoutMs({
						deadline,
						defaultTimeoutMs: DEFAULT_TIMEOUT_MS
					}),
					baseUrl,
					allowPrivateNetwork,
					dispatcherPolicy,
					fetchFn
				});
				const videoUrl = normalizeOptionalString(completed.video?.url);
				if (!videoUrl) throw new Error(XAI_VIDEO_MALFORMED_RESPONSE);
				return {
					videos: [await downloadXaiVideo({
						url: videoUrl,
						timeoutMs: createProviderOperationTimeoutResolver({
							deadline,
							defaultTimeoutMs: DEFAULT_TIMEOUT_MS
						}),
						defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
						allowPrivateNetwork,
						dispatcherPolicy,
						fetchFn,
						maxBytes: resolveGeneratedVideoMaxBytes(req)
					})],
					model: normalizeOptionalString(req.model) ?? DEFAULT_XAI_VIDEO_MODEL,
					metadata: {
						requestId,
						status: completed.status,
						videoUrl,
						mode: resolveXaiVideoMode(req)
					}
				};
			} finally {
				await release();
			}
		}
	};
}
//#endregion
export { buildXaiVideoGenerationProvider as t };
