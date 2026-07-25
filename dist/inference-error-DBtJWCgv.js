//#region src/system-agent/inference-error.ts
/** Safe public error for an OpenClaw turn that could not complete with intelligence. */
var SystemAgentInferenceUnavailableError = class extends Error {
	constructor(stage, failures = []) {
		super("OpenClaw could not reach working inference. Run `openclaw onboard` to reconnect and live-test AI, then try again.");
		this.stage = stage;
		this.failures = failures;
		this.code = "SYSTEM_AGENT_INFERENCE_UNAVAILABLE";
		this.name = "SystemAgentInferenceUnavailableError";
	}
};
function isSystemAgentInferenceUnavailableError(error) {
	return error instanceof SystemAgentInferenceUnavailableError || error instanceof Error && "code" in error && error.code === "SYSTEM_AGENT_INFERENCE_UNAVAILABLE";
}
//#endregion
export { isSystemAgentInferenceUnavailableError as n, SystemAgentInferenceUnavailableError as t };
