import { I as OPENCLAW_AGENT_RUNTIME_ID, L as isDefaultAgentRuntimeId } from "./openai-routing-Cq9SwNpx.js";
import { n as resolvePersistedSessionRuntimeId } from "./session-runtime-compat-CGtM0hst.js";
import { n as resolveSessionModelRef } from "./session-model-ref-6iy2uTEN.js";
import { r as resolveEffectiveAgentRuntime } from "./thinking-runtime-g8O2MT43.js";
//#region src/gateway/worker-environments/placement-session-runtime.ts
function resolveWorkerPlacementSessionRuntime(params) {
	const persistedRuntime = resolvePersistedSessionRuntimeId(params.entry);
	if (persistedRuntime && !isDefaultAgentRuntimeId(persistedRuntime)) return persistedRuntime;
	const selectedModel = resolveSessionModelRef(params.cfg, params.entry, params.agentId);
	return resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: selectedModel.provider,
		modelId: selectedModel.model,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
}
function isWorkerPlacementSessionRuntimeSupported(runtime) {
	return runtime === OPENCLAW_AGENT_RUNTIME_ID;
}
//#endregion
export { resolveWorkerPlacementSessionRuntime as n, isWorkerPlacementSessionRuntimeSupported as t };
