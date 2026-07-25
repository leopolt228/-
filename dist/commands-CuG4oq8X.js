import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { U as validateCommandsListParams } from "./src-Cy32TawB.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-BfprgHtb.js";
import { t as buildCommandsListResult } from "./commands-list-result-BCURPF6T.js";
//#region src/gateway/server-methods/commands.ts
/** Gateway handler for enumerating available chat/native commands. */
const commandsHandlers = { "commands.list": ({ params, respond, context }) => {
	if (!validateCommandsListParams(params)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid commands.list params: ${formatValidationErrors(validateCommandsListParams.errors)}`));
		return;
	}
	const resolved = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId,
		respond,
		cfg: context.getRuntimeConfig(),
		normalize: (rawAgentId) => typeof rawAgentId === "string" ? rawAgentId.trim() : void 0
	});
	if (!resolved) return;
	respond(true, buildCommandsListResult({
		cfg: resolved.cfg,
		agentId: resolved.agentId,
		provider: params.provider,
		scope: params.scope,
		includeArgs: params.includeArgs
	}), void 0);
} };
//#endregion
export { buildCommandsListResult, commandsHandlers };
