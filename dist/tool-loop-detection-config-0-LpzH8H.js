import "./agent-scope-CrBA-6Gx.js";
import { r as resolveAgentConfig } from "./agent-scope-config-S7z_Yn4H.js";
//#region src/agents/tool-loop-detection-config.ts
/** Resolves effective tool loop-detection config by overlaying agent settings on globals. */
function resolveToolLoopDetectionConfig(params) {
	const global = params.cfg?.tools?.loopDetection;
	const agent = params.agentId && params.cfg ? resolveAgentConfig(params.cfg, params.agentId)?.tools?.loopDetection : void 0;
	if (!agent) return global;
	if (!global) return agent;
	return { enabled: agent.enabled ?? global.enabled };
}
//#endregion
export { resolveToolLoopDetectionConfig as t };
