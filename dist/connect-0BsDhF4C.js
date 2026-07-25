import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
//#region src/gateway/server-methods/connect.ts
/**
* Rejects `connect` after the WebSocket handshake already established identity.
*/
const connectHandlers = { connect: ({ respond }) => {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "connect is only valid as the first request"));
} };
//#endregion
export { connectHandlers };
