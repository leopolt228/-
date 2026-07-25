import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { A as resolvePositiveTimerTimeoutMs, a as addTimerTimeoutGraceMs } from "./number-coercion-Crk_c9KW.js";
import { a as asRecord } from "./record-coerce-DHZ4bFlT.js";
import { a as normalizeOptionalTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./number-runtime-C6TGSEc_.js";
import { C as resolveRealtimeVoiceAgentConsultToolPolicy, m as REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME } from "./session-log-runtime-GBoG4Ecc.js";
import "./realtime-voice-D9eMvxKo.js";
import { r as buildMeetingSoxAudioCommands } from "./meeting-runtime-BU1dxXzu.js";
//#region extensions/zoom-meetings/src/config.ts
function resolveZoomMeetingsGatewayOperationTimeoutMs(config) {
	return Math.max(6e4, addTimerTimeoutGraceMs(config.chrome.joinTimeoutMs, config.chrome.waitForInCallMs + config.chrome.joinTimeoutMs + 3e4) ?? 1);
}
const DEFAULT_AUDIO_BUFFER_BYTES = 4096;
const DEFAULT_AUDIO_FORMAT = "pcm16-24khz";
function buildSoxCommands(format, bufferBytes) {
	return buildMeetingSoxAudioCommands({
		bufferBytes,
		device: "BlackHole 2ch",
		deviceType: "coreaudio",
		format: format === "g711-ulaw-8khz" ? {
			sampleRate: 8e3,
			channels: 1,
			encoding: "mu-law",
			bits: 8
		} : {
			sampleRate: 24e3,
			channels: 1,
			encoding: "signed-integer",
			bits: 16,
			endian: "little"
		}
	});
}
const DEFAULT_SOX_COMMANDS = buildSoxCommands(DEFAULT_AUDIO_FORMAT, DEFAULT_AUDIO_BUFFER_BYTES);
const DEFAULT_ZOOM_MEETINGS_AUDIO_INPUT_COMMAND = DEFAULT_SOX_COMMANDS.inputCommand;
const DEFAULT_ZOOM_MEETINGS_AUDIO_OUTPUT_COMMAND = DEFAULT_SOX_COMMANDS.outputCommand;
const DEFAULT_REALTIME_INSTRUCTIONS = `You are joining a private Zoom meeting as an OpenClaw voice transport. Keep spoken replies brief and natural. In agent mode, wait for OpenClaw consult results and speak them exactly. In bidi mode, answer directly and call ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME} for deeper reasoning, current information, or tools.`;
const DEFAULT_CONFIG = {
	enabled: true,
	defaultMode: "agent",
	chrome: {
		audioBackend: "blackhole-2ch",
		audioFormat: DEFAULT_AUDIO_FORMAT,
		audioBufferBytes: DEFAULT_AUDIO_BUFFER_BYTES,
		launch: true,
		guestName: "OpenClaw Agent",
		reuseExistingTab: true,
		autoJoin: true,
		joinTimeoutMs: 3e4,
		waitForInCallMs: 6e4,
		audioInputCommand: [...DEFAULT_ZOOM_MEETINGS_AUDIO_INPUT_COMMAND],
		audioOutputCommand: [...DEFAULT_ZOOM_MEETINGS_AUDIO_OUTPUT_COMMAND],
		bargeInRmsThreshold: 650,
		bargeInPeakThreshold: 2500,
		bargeInCooldownMs: 900
	},
	chromeNode: {},
	realtime: {
		strategy: "agent",
		provider: "openai",
		transcriptionProvider: "openai",
		instructions: DEFAULT_REALTIME_INSTRUCTIONS,
		introMessage: "Say exactly: I'm here and listening.",
		toolPolicy: "safe-read-only",
		providers: {}
	}
};
function resolveBoolean(value, fallback) {
	return typeof value === "boolean" ? value : fallback;
}
function resolvePositiveNumber(value, fallback) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}
function resolveTimer(value, fallback) {
	return resolvePositiveTimerTimeoutMs(resolvePositiveNumber(value, fallback), fallback);
}
function resolveMode(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return normalized === "agent" || normalized === "bidi" || normalized === "transcribe" ? normalized : DEFAULT_CONFIG.defaultMode;
}
function resolveAudioFormat(value) {
	const normalized = normalizeOptionalLowercaseString(value)?.replaceAll("_", "-");
	return normalized === "g711-ulaw-8khz" ? normalized : DEFAULT_AUDIO_FORMAT;
}
function resolveProviders(value) {
	const providers = {};
	for (const [key, entry] of Object.entries(asRecord(value))) {
		const id = normalizeOptionalLowercaseString(key);
		if (id) providers[id] = asRecord(entry);
	}
	return providers;
}
function resolveZoomMeetingsConfig(input) {
	const raw = asRecord(input);
	const chrome = asRecord(raw.chrome);
	const chromeNode = asRecord(raw.chromeNode);
	const realtime = asRecord(raw.realtime);
	const audioFormat = resolveAudioFormat(chrome.audioFormat);
	const audioBufferBytes = Math.max(17, Math.trunc(resolvePositiveNumber(chrome.audioBufferBytes, DEFAULT_AUDIO_BUFFER_BYTES)));
	const generatedCommands = buildSoxCommands(audioFormat, audioBufferBytes);
	const provider = normalizeOptionalString(realtime.provider) ?? DEFAULT_CONFIG.realtime.provider;
	return {
		enabled: resolveBoolean(raw.enabled, DEFAULT_CONFIG.enabled),
		defaultMode: resolveMode(raw.defaultMode),
		chrome: {
			audioBackend: "blackhole-2ch",
			audioFormat,
			audioBufferBytes,
			launch: resolveBoolean(chrome.launch, DEFAULT_CONFIG.chrome.launch),
			browserProfile: normalizeOptionalString(chrome.browserProfile),
			guestName: normalizeOptionalString(chrome.guestName) ?? DEFAULT_CONFIG.chrome.guestName,
			reuseExistingTab: resolveBoolean(chrome.reuseExistingTab, DEFAULT_CONFIG.chrome.reuseExistingTab),
			autoJoin: resolveBoolean(chrome.autoJoin, DEFAULT_CONFIG.chrome.autoJoin),
			joinTimeoutMs: resolveTimer(chrome.joinTimeoutMs, DEFAULT_CONFIG.chrome.joinTimeoutMs),
			waitForInCallMs: resolveTimer(chrome.waitForInCallMs, DEFAULT_CONFIG.chrome.waitForInCallMs),
			audioInputCommand: normalizeOptionalTrimmedStringList(chrome.audioInputCommand) ?? generatedCommands.inputCommand,
			audioOutputCommand: normalizeOptionalTrimmedStringList(chrome.audioOutputCommand) ?? generatedCommands.outputCommand,
			bargeInInputCommand: normalizeOptionalTrimmedStringList(chrome.bargeInInputCommand),
			bargeInRmsThreshold: resolvePositiveNumber(chrome.bargeInRmsThreshold, DEFAULT_CONFIG.chrome.bargeInRmsThreshold),
			bargeInPeakThreshold: resolvePositiveNumber(chrome.bargeInPeakThreshold, DEFAULT_CONFIG.chrome.bargeInPeakThreshold),
			bargeInCooldownMs: resolveTimer(chrome.bargeInCooldownMs, DEFAULT_CONFIG.chrome.bargeInCooldownMs)
		},
		chromeNode: { node: normalizeOptionalString(chromeNode.node) },
		realtime: {
			strategy: normalizeOptionalLowercaseString(realtime.strategy) === "bidi" ? "bidi" : "agent",
			provider,
			transcriptionProvider: normalizeOptionalString(realtime.transcriptionProvider) ?? DEFAULT_CONFIG.realtime.transcriptionProvider,
			voiceProvider: normalizeOptionalString(realtime.voiceProvider),
			model: normalizeOptionalString(realtime.model),
			instructions: normalizeOptionalString(realtime.instructions) ?? DEFAULT_CONFIG.realtime.instructions,
			introMessage: typeof realtime.introMessage === "string" ? realtime.introMessage.trim() : DEFAULT_CONFIG.realtime.introMessage,
			agentId: normalizeOptionalString(realtime.agentId),
			toolPolicy: resolveRealtimeVoiceAgentConsultToolPolicy(realtime.toolPolicy, DEFAULT_CONFIG.realtime.toolPolicy),
			providers: resolveProviders(realtime.providers)
		}
	};
}
//#endregion
//#region extensions/zoom-meetings/src/errors.ts
var ZoomMeetingsInvalidRequestError = class extends Error {};
function zoomMeetingsInvalidRequest(message) {
	return new ZoomMeetingsInvalidRequestError(message);
}
//#endregion
//#region extensions/zoom-meetings/src/probe-timeout.ts
function resolveZoomMeetingsProbeTimeoutMs(input, fallback) {
	if (input === void 0) return Math.min(Math.max(fallback, 1), 12e4);
	if (!Number.isFinite(input) || input <= 0) throw zoomMeetingsInvalidRequest("timeoutMs must be a positive number");
	return Math.min(Math.trunc(input), 12e4);
}
//#endregion
export { DEFAULT_ZOOM_MEETINGS_AUDIO_OUTPUT_COMMAND as a, DEFAULT_ZOOM_MEETINGS_AUDIO_INPUT_COMMAND as i, ZoomMeetingsInvalidRequestError as n, resolveZoomMeetingsConfig as o, zoomMeetingsInvalidRequest as r, resolveZoomMeetingsGatewayOperationTimeoutMs as s, resolveZoomMeetingsProbeTimeoutMs as t };
