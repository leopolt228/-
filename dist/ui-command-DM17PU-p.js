import { a as hasGatewayClientCap, n as GATEWAY_CLIENT_IDS, t as GATEWAY_CLIENT_CAPS } from "./client-info-D4mGPeue.js";
import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { wi as validateUiCommandParams } from "./src-Cy32TawB.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/gateway/server-methods/ui-command.ts
const uiCommandHandlers = { "ui.command": ({ params, respond, context }) => {
	if (!validateUiCommandParams(params)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid ui.command params: ${formatValidationErrors(validateUiCommandParams.errors)}`));
		return;
	}
	const commandParams = params;
	const connIds = context.getClientConnIds?.((client) => client.connect.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI && hasGatewayClientCap(client.connect.caps, GATEWAY_CLIENT_CAPS.UI_COMMANDS)) ?? /* @__PURE__ */ new Set();
	if (connIds.size === 0) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "no ui client"));
		return;
	}
	context.broadcastToConnIds("ui.command", commandParams, connIds);
	respond(true, { ok: true });
} };
//#endregion
export { uiCommandHandlers };
