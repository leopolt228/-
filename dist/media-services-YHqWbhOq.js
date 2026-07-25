import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { r as writeExternalFileWithinRoot } from "./fs-safe-Dy0g6QwA.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
import { n as tempWorkspaceSync, r as withTempWorkspace } from "./private-temp-workspace-HLulDJ5y.js";
import { n as runExec, r as runCommandWithTimeout } from "./exec-Cb0CNQNz.js";
import { t as resolveSystemBin } from "./resolve-system-bin-SYIpvbl7.js";
import { t as basenameFromAnyPath } from "./file-name-D1nUHSBH.js";
import "./image-ops-BFeNLIan.js";
import path from "node:path";
/** Default ffprobe timeout for lightweight metadata probes. */
const MEDIA_FFPROBE_TIMEOUT_MS = 1e4;
/** Default ffmpeg timeout for bounded media conversion work. */
const MEDIA_FFMPEG_TIMEOUT_MS = 45e3;
/** Maximum audio duration accepted by ffmpeg-backed media flows. */
const MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS = 1200;
//#endregion
//#region src/media/ffmpeg-exec.ts
function resolveExecOptions(defaultTimeoutMs, options) {
	return {
		input: options?.input,
		logOutput: false,
		maxBuffer: options?.maxBufferBytes ?? 10485760,
		timeoutMs: options?.timeoutMs ?? defaultTimeoutMs
	};
}
function requireSystemBin(name) {
	const resolved = resolveSystemBin(name, { trust: "standard" });
	if (!resolved) {
		const hint = process.platform === "darwin" ? "e.g. brew install ffmpeg" : "e.g. apt install ffmpeg / dnf install ffmpeg";
		throw new Error(`${name} not found in trusted system directories. Install it via your system package manager (${hint}).`);
	}
	return resolved;
}
/** Resolves ffmpeg from trusted system paths before command execution. */
function resolveFfmpegBin() {
	return requireSystemBin("ffmpeg");
}
/** Runs ffprobe with optional stdin input. */
async function runFfprobe(args, options) {
	const { stdout } = await runExec(requireSystemBin("ffprobe"), args, resolveExecOptions(MEDIA_FFPROBE_TIMEOUT_MS, options));
	return stdout;
}
/** Runs ffmpeg with bounded timeout and buffer settings. */
async function runFfmpeg(args, options) {
	const { stdout } = await runExec(resolveFfmpegBin(), args, resolveExecOptions(MEDIA_FFMPEG_TIMEOUT_MS, options));
	return stdout;
}
/** Splits ffprobe CSV-ish output into normalized lowercase fields. */
function parseFfprobeCsvFields(stdout, maxFields) {
	return stdout.trim().split(/[,\r\n]+/, maxFields).map((field) => normalizeLowercaseStringOrEmpty(field));
}
function parseFfprobeSampleRateHz(value) {
	if (!value || !/^\d+$/.test(value)) return null;
	const sampleRate = Number(value);
	return Number.isSafeInteger(sampleRate) && sampleRate > 0 ? sampleRate : null;
}
/** Parses codec and positive sample rate from compact ffprobe stream output. */
function parseFfprobeCodecAndSampleRate(stdout) {
	const [codecRaw, sampleRateRaw] = parseFfprobeCsvFields(stdout, 2);
	return {
		codec: codecRaw ? codecRaw : null,
		sampleRateHz: parseFfprobeSampleRateHz(sampleRateRaw)
	};
}
//#endregion
//#region src/media/audio-transcode.ts
const DEFAULT_OPUS_SAMPLE_RATE_HZ = 48e3;
const DEFAULT_OPUS_BITRATE = "64k";
const DEFAULT_OPUS_CHANNELS = 1;
const DEFAULT_TEMP_PREFIX = "audio-opus-";
const DEFAULT_OUTPUT_FILE_NAME = "voice.opus";
function normalizeAudioExtension(params) {
	const fromExtension = params.inputExtension?.trim();
	const normalized = (fromExtension ? fromExtension.startsWith(".") ? fromExtension : `.${fromExtension}` : path.extname(params.inputFileName ?? "")).toLowerCase();
	return /^\.[a-z0-9]{1,12}$/.test(normalized) ? normalized : ".audio";
}
function normalizeTempPrefix(value) {
	const sanitized = value?.trim().replace(/[^a-zA-Z0-9._-]/g, "-");
	if (!sanitized || sanitized === "." || sanitized === "..") return DEFAULT_TEMP_PREFIX;
	return sanitized.endsWith("-") ? sanitized : `${sanitized}-`;
}
function normalizeOutputFileName(value) {
	const baseName = basenameFromAnyPath(value?.trim() || DEFAULT_OUTPUT_FILE_NAME);
	if (/^[a-zA-Z0-9._-]{1,80}$/.test(baseName) && baseName !== "." && baseName !== "..") return baseName;
	return DEFAULT_OUTPUT_FILE_NAME;
}
function resolveMaxDurationSeconds(value) {
	if (value === void 0) return;
	if (!Number.isFinite(value) || value <= 0) throw new Error("maxDurationSeconds must be a positive finite number");
	return value;
}
/** Transcodes arbitrary audio input into mono Opus using a scoped temp workspace. */
async function transcodeAudioBufferToOpus(params) {
	const maxDurationSeconds = resolveMaxDurationSeconds(params.maxDurationSeconds);
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: normalizeTempPrefix(params.tempPrefix)
	}, async (workspace) => {
		const inputPath = await workspace.write(`input${normalizeAudioExtension(params)}`, params.audioBuffer);
		const outputFileName = normalizeOutputFileName(params.outputFileName);
		await writeExternalFileWithinRoot({
			rootDir: workspace.dir,
			path: outputFileName,
			write: async (outputPath) => {
				await runFfmpeg([
					"-hide_banner",
					"-loglevel",
					"error",
					"-y",
					"-i",
					inputPath,
					"-vn",
					"-sn",
					"-dn",
					...maxDurationSeconds === void 0 ? [] : ["-t", String(maxDurationSeconds)],
					"-c:a",
					"libopus",
					"-b:a",
					params.bitrate ?? DEFAULT_OPUS_BITRATE,
					"-ar",
					String(params.sampleRateHz ?? DEFAULT_OPUS_SAMPLE_RATE_HZ),
					"-ac",
					String(params.channels ?? DEFAULT_OPUS_CHANNELS),
					"-f",
					"opus",
					outputPath
				], { timeoutMs: params.timeoutMs });
			}
		});
		return await workspace.read(outputFileName);
	});
}
/** Transcodes known audio container pairs, currently using macOS afconvert recipes where needed. */
async function transcodeAudioBuffer(params) {
	const source = normalizeContainerExt(params.sourceExtension);
	const target = normalizeContainerExt(params.targetExtension);
	if (!source || !target) return {
		ok: false,
		reason: "invalid-extension"
	};
	if (source === target) return {
		ok: false,
		reason: "noop-same-container"
	};
	const recipe = pickAfconvertRecipe(source, target);
	if (!recipe) return {
		ok: false,
		reason: "no-recipe"
	};
	if (process.platform !== "darwin") return {
		ok: false,
		reason: "platform-unsupported"
	};
	const tmp = tempWorkspaceSync({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "tts-transcode-"
	});
	const inPath = tmp.write(`in.${source}`, params.audioBuffer);
	const outPath = tmp.path(`out.${target}`);
	try {
		const result = await runAfconvert({
			args: [
				...recipe,
				inPath,
				outPath
			],
			timeoutMs: params.timeoutMs ?? 5e3
		});
		if (!result.ok) return {
			ok: false,
			reason: "transcoder-failed",
			detail: result.detail
		};
		return {
			ok: true,
			buffer: tmp.read(`out.${target}`)
		};
	} catch (err) {
		return {
			ok: false,
			reason: "transcoder-failed",
			detail: err.message
		};
	} finally {
		tmp.cleanup();
	}
}
function normalizeContainerExt(ext) {
	const trimmed = ext.trim().toLowerCase().replace(/^\./, "");
	return /^[a-z0-9]{1,12}$/.test(trimmed) ? trimmed : void 0;
}
function pickAfconvertRecipe(_source, target) {
	if (target === "caf") return [
		"-f",
		"caff",
		"-d",
		"opus@24000",
		"-c",
		"1"
	];
}
async function runAfconvert(params) {
	try {
		const result = await runCommandWithTimeout(["/usr/bin/afconvert", ...params.args], {
			maxOutputBytes: 1024,
			timeoutMs: params.timeoutMs
		});
		if (result.termination === "timeout") return {
			ok: false,
			detail: `timeout-${params.timeoutMs}ms`
		};
		return result.code === 0 ? { ok: true } : {
			ok: false,
			detail: `exit-${result.code ?? "unknown"}`
		};
	} catch (err) {
		return {
			ok: false,
			detail: err instanceof Error ? err.message : String(err)
		};
	}
}
//#endregion
//#region src/media/video-dimensions.ts
function parsePositiveDimension(value) {
	if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) return;
	return value;
}
/** Parses ffprobe JSON output, accepting only positive integer first-stream dimensions. */
function parseFfprobeVideoDimensions(stdout) {
	let parsed;
	try {
		parsed = JSON.parse(stdout);
	} catch {
		return;
	}
	if (!parsed || typeof parsed !== "object") return;
	const streams = parsed.streams;
	const stream = Array.isArray(streams) ? streams[0] : void 0;
	if (!stream || typeof stream !== "object") return;
	const record = stream;
	const width = parsePositiveDimension(record.width);
	const height = parsePositiveDimension(record.height);
	return width && height ? {
		width,
		height
	} : void 0;
}
/** Probes a video buffer through ffprobe stdin and treats probe failures as unknown dimensions. */
async function probeVideoDimensions(buffer) {
	try {
		return parseFfprobeVideoDimensions(await runFfprobe([
			"-v",
			"error",
			"-select_streams",
			"v:0",
			"-show_entries",
			"stream=width,height",
			"-of",
			"json",
			"pipe:0"
		], { input: buffer }));
	} catch {
		return;
	}
}
//#endregion
export { resolveFfmpegBin as a, MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS as c, parseFfprobeCodecAndSampleRate as i, transcodeAudioBuffer as n, runFfmpeg as o, transcodeAudioBufferToOpus as r, runFfprobe as s, probeVideoDimensions as t };
