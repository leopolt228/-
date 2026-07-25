import { n as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { t as closedObject } from "./closed-object-DY9fiMP-.js";
import { a as NonEmptyString } from "./primitives-DLJWVBVf.js";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/error-codes.ts
/** Missing operator-scope details shared by WebSocket and HTTP responses. */
const MissingScopeErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.MISSING_SCOPE),
	missingScope: NonEmptyString,
	requiredScopes: Type.Array(NonEmptyString, { minItems: 1 })
});
const McpAppViewExpiredErrorDetailsSchema = closedObject({ code: Type.Literal(GatewayErrorDetailCodes.MCP_APP_VIEW_EXPIRED) });
/** Structured details emitted by method-level authorization failures. */
const GatewayErrorDetailsSchema = Type.Union([MissingScopeErrorDetailsSchema, McpAppViewExpiredErrorDetailsSchema]);
/** Builds the canonical gateway error payload while preserving optional retry metadata. */
function errorShape(code, message, opts) {
	return {
		code,
		message,
		...opts
	};
}
/** Builds structured details for a missing operator scope. */
function buildMissingScopeErrorDetails(params) {
	const requiredScopes = params.requiredScopes.length > 0 ? [...params.requiredScopes] : [params.missingScope];
	return {
		code: GatewayErrorDetailCodes.MISSING_SCOPE,
		missingScope: params.missingScope,
		requiredScopes
	};
}
/** Builds a forbidden error for a missing operator scope without message parsing. */
function missingScopeErrorShape(params) {
	const details = buildMissingScopeErrorDetails(params);
	return errorShape(ErrorCodes.FORBIDDEN, `missing scope: ${params.missingScope}`, { details });
}
//#endregion
export { missingScopeErrorShape as a, errorShape as i, MissingScopeErrorDetailsSchema as n, buildMissingScopeErrorDetails as r, GatewayErrorDetailsSchema as t };
