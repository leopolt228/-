import { i as createDeepSeekV4OpenAICompatibleThinkingWrapper } from "./provider-stream-shared-BiURRLUJ.js";
import { t as isMiMoReasoningModelRef } from "./thinking-DyWL5q61.js";
//#region extensions/xiaomi/stream.ts
function createMiMoThinkingWrapper(baseStreamFn, thinkingLevel) {
	return createDeepSeekV4OpenAICompatibleThinkingWrapper({
		baseStreamFn,
		thinkingLevel,
		shouldPatchModel: isMiMoReasoningModelRef
	});
}
//#endregion
export { createMiMoThinkingWrapper as t };
