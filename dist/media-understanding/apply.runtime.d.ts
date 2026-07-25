import { i as OpenClawConfig } from "../types.openclaw-DAPZkTyD.js";
import { l as ImageContent } from "../types-CVnOkpxa.js";
import { i as MsgContext } from "../templating-CzGprbNA.js";
import { d as MediaUnderstandingProvider, l as MediaUnderstandingDecision, u as MediaUnderstandingOutput } from "../types-C8XeqxqU2.js";
import { t as ActiveMediaModel } from "../active-model-Cxn6sQSw.js";

//#region src/media-understanding/extracted-file-images.d.ts
type ExtractedFileImage = ImageContent & {
  attachmentIndex: number;
};
//#endregion
//#region src/media-understanding/apply.d.ts
type ApplyMediaUnderstandingResult = {
  outputs: MediaUnderstandingOutput[];
  decisions: MediaUnderstandingDecision[];
  extractedFileImages: ExtractedFileImage[];
  appliedImage: boolean;
  appliedAudio: boolean;
  appliedVideo: boolean;
  appliedFile: boolean;
};
declare function applyMediaUnderstanding(params: {
  ctx: MsgContext;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  providers?: Record<string, MediaUnderstandingProvider>;
  activeModel?: ActiveMediaModel; /** Preserve native-harness ownership of image, video, and file inputs while applying STT. */
  processingMode?: "audio-only";
}): Promise<ApplyMediaUnderstandingResult>;
//#endregion
export { applyMediaUnderstanding };