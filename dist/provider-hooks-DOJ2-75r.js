import { s as createGoogleThinkingStreamWrapper } from "./provider-stream-shared-BiURRLUJ.js";
import { a as buildProviderReplayFamilyHooks } from "./provider-model-shared-Dzz3IkWT.js";
import { r as buildProviderToolCompatFamilyHooks } from "./provider-tools-CnLdlRmT.js";
import { i as resolveGoogleThinkingProfile } from "./provider-policy-DagFxEZx.js";
import "./thinking-api-Ci3xyPwM.js";
//#region extensions/google/provider-hooks.ts
function classifyGoogleFailoverCode(code) {
	switch (code?.trim().toUpperCase()) {
		case "UNAVAILABLE": return "overloaded";
		case "DEADLINE_EXCEEDED": return "timeout";
		case "INTERNAL": return "server_error";
		default: return;
	}
}
const GOOGLE_GEMINI_PROVIDER_HOOKS = {
	...buildProviderReplayFamilyHooks({ family: "google-gemini" }),
	...buildProviderToolCompatFamilyHooks("gemini"),
	resolveThinkingProfile: (context) => resolveGoogleThinkingProfile(context),
	wrapStreamFn: createGoogleThinkingStreamWrapper,
	classifyFailoverReason: ({ code }) => classifyGoogleFailoverCode(code)
};
//#endregion
export { GOOGLE_GEMINI_PROVIDER_HOOKS as t };
