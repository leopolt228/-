import { n as resolveClaudeThinkingProfile } from "./provider-claude-thinking-BW3KbSo8.js";
import "./provider-model-shared-Dzz3IkWT.js";
//#region extensions/opencode/provider-policy-api.ts
const GPT_56_THINKING_PROFILE = {
	levels: [
		{ id: "off" },
		{ id: "low" },
		{ id: "medium" },
		{ id: "high" },
		{ id: "xhigh" },
		{ id: "max" }
	],
	defaultLevel: "medium"
};
function isGpt56Model(modelId) {
	return /^gpt-5\.6(?:-|$)/u.test(modelId.trim().toLowerCase());
}
function resolveThinkingProfile(params) {
	if (isGpt56Model(params.modelId)) return GPT_56_THINKING_PROFILE;
	return resolveClaudeThinkingProfile(params.modelId);
}
//#endregion
export { resolveThinkingProfile as t };
