import "./agent-scope-CrBA-6Gx.js";
import { c as resolveDefaultAgentId, n as listAgentIds } from "./agent-scope-config-S7z_Yn4H.js";
import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
//#region src/gateway/server-methods/agent-id-shared.ts
/**
* Shared agent-id resolver for request handlers that accept optional agent ids.
*/
function resolveAgentIdOrRespondError(params) {
	const knownAgents = listAgentIds(params.cfg);
	const requestedAgentId = params.normalize(params.rawAgentId) ?? "";
	const agentId = requestedAgentId || resolveDefaultAgentId(params.cfg);
	if (requestedAgentId && !knownAgents.includes(agentId)) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown agent id "${requestedAgentId}"`));
		return null;
	}
	return {
		cfg: params.cfg,
		agentId
	};
}
//#endregion
export { resolveAgentIdOrRespondError as t };
