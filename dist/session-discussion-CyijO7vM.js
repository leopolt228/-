import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { n as getSessionDiscussionProvider } from "./session-discussion-registry-C3y7e-bP.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { Dn as validateSessionDiscussionOpenParams, En as validateSessionDiscussionInfoResult, On as validateSessionDiscussionOpenResult, Tn as validateSessionDiscussionInfoParams } from "./src-Cy32TawB.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
import { t as assertValidParams } from "./validation-5fLHFuIF.js";
//#region src/gateway/server-methods/session-discussion.ts
const sessionDiscussionHandlers = {
	"session.discussion.info": async ({ params, respond }) => {
		if (!assertValidParams(params, validateSessionDiscussionInfoParams, "session.discussion.info", respond)) return;
		const provider = getSessionDiscussionProvider();
		if (!provider) {
			respond(true, { state: "none" }, void 0);
			return;
		}
		try {
			const result = await provider.info({ sessionKey: params.sessionKey });
			if (!validateSessionDiscussionInfoResult(result)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `invalid session.discussion.info result: ${formatValidationErrors(validateSessionDiscussionInfoResult.errors)}`));
				return;
			}
			respond(true, result, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "session discussion provider failed"));
		}
	},
	"session.discussion.open": async ({ params, respond }) => {
		if (!assertValidParams(params, validateSessionDiscussionOpenParams, "session.discussion.open", respond)) return;
		const provider = getSessionDiscussionProvider();
		if (!provider) {
			respond(true, { state: "none" }, void 0);
			return;
		}
		try {
			const result = await provider.open({ sessionKey: params.sessionKey });
			if (!validateSessionDiscussionOpenResult(result)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `invalid session.discussion.open result: ${formatValidationErrors(validateSessionDiscussionOpenResult.errors)}`));
				return;
			}
			respond(true, result, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "session discussion provider failed"));
		}
	}
};
//#endregion
export { sessionDiscussionHandlers };
