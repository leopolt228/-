import { ImageMetadata } from "rastermill";

//#region src/media/audio-transcode.d.ts
/** Transcodes arbitrary audio input into mono Opus using a scoped temp workspace. */
declare function transcodeAudioBufferToOpus(params: {
  audioBuffer: Buffer;
  inputExtension?: string;
  inputFileName?: string;
  tempPrefix?: string;
  outputFileName?: string;
  timeoutMs?: number;
  sampleRateHz?: number;
  bitrate?: string;
  channels?: number; /** Maximum output duration passed to ffmpeg's `-t` option. */
  maxDurationSeconds?: number;
}): Promise<Buffer>;
/** Outcome for lightweight container transcodes that may be unsupported or intentionally skipped. */
type AudioContainerTranscodeOutcome = {
  ok: true;
  buffer: Buffer;
} | {
  ok: false;
  reason: "platform-unsupported" | "invalid-extension" | "noop-same-container" | "no-recipe" | "transcoder-failed";
  detail?: string;
};
/** Transcodes known audio container pairs, currently using macOS afconvert recipes where needed. */
declare function transcodeAudioBuffer(params: {
  audioBuffer: Buffer;
  sourceExtension: string;
  targetExtension: string;
  timeoutMs?: number;
}): Promise<AudioContainerTranscodeOutcome>;
//#endregion
//#region src/media/ffmpeg-exec.d.ts
/** Process limits and optional stdin payload for ffmpeg/ffprobe helper calls. */
type MediaExecOptions = {
  timeoutMs?: number;
  maxBufferBytes?: number;
  input?: Buffer | string;
};
/** Resolves ffmpeg from trusted system paths before command execution. */
declare function resolveFfmpegBin(): string;
/** Runs ffprobe with optional stdin input. */
declare function runFfprobe(args: string[], options?: MediaExecOptions): Promise<string>;
/** Runs ffmpeg with bounded timeout and buffer settings. */
declare function runFfmpeg(args: string[], options?: MediaExecOptions): Promise<string>;
/** Parses codec and positive sample rate from compact ffprobe stream output. */
declare function parseFfprobeCodecAndSampleRate(stdout: string): {
  codec: string | null;
  sampleRateHz: number | null;
};
//#endregion
//#region src/media/image-ops.d.ts
/** JPEG resize request passed through the media-runtime/plugin SDK surface. */
type ResizeToJpegParams = {
  buffer: Buffer;
  maxSide: number;
  quality: number;
  withoutEnlargement?: boolean;
};
/** Ordered JPEG quality ladder used when shrinking generated or attached images. */
declare const IMAGE_REDUCE_QUALITY_STEPS: readonly [85, 75, 65, 55, 45, 35];
/** Detects either OpenClaw's wrapper error or Rastermill's native unavailable error. */
declare function isImageProcessorUnavailableError(err: unknown): boolean;
/** Builds a descending, de-duplicated max-side search grid for iterative image resizing. */
declare function buildImageResizeSideGrid(maxSide: number, sideStart: number): number[];
/** Fully probes image dimensions through Rastermill when header-only metadata is insufficient. */
declare function getImageMetadata(buffer: Buffer): Promise<ImageMetadata | null>;
/** Resizes or encodes image bytes as JPEG through the shared image processor. */
declare function resizeToJpeg(params: ResizeToJpegParams): Promise<Buffer>;
/** Optimizes PNG bytes under a target size and returns the chosen search parameters. */
declare function optimizeImageToPng(buffer: Buffer, maxBytes: number, options?: {
  sides?: readonly number[];
}): Promise<{
  buffer: Buffer;
  optimizedSize: number;
  resizeSide: number;
  compressionLevel: number;
}>;
//#endregion
//#region src/media/video-dimensions.d.ts
/** Positive video dimensions reported by ffprobe for the first video stream. */
type VideoDimensions = {
  width: number;
  height: number;
};
/** Probes a video buffer through ffprobe stdin and treats probe failures as unknown dimensions. */
declare function probeVideoDimensions(buffer: Buffer): Promise<VideoDimensions | undefined>;
//#endregion
export { isImageProcessorUnavailableError as a, parseFfprobeCodecAndSampleRate as c, runFfprobe as d, transcodeAudioBuffer as f, getImageMetadata as i, resolveFfmpegBin as l, IMAGE_REDUCE_QUALITY_STEPS as n, optimizeImageToPng as o, transcodeAudioBufferToOpus as p, buildImageResizeSideGrid as r, resizeToJpeg as s, probeVideoDimensions as t, runFfmpeg as u };