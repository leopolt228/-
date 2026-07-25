import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { a as resolveMainSessionKey } from "./main-session-C7kXMD8t.js";
import { Ot as resolveSessionEntryAccessTarget } from "./session-accessor-Mu3lv_Tl.js";
import { E as isAgentHarnessSessionStoreEntryProtected, S as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE, w as isAgentHarnessSessionKey } from "./store-DDuGv_UJ.js";
import "./sessions-Uqhj6EXw.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { i as createMcpAttachGrantServerConfig, o as getActiveMcpLoopbackRuntime } from "./mcp-http.loopback-runtime-BQw0DPFh.js";
import { r as mintAttachGrant, s as revokeAttachGrant } from "./mcp-grant-store-BXg0F56m.js";
import { n as ensureMcpLoopbackServer } from "./mcp-http-CsdDylrG.js";
//#region src/gateway/server-methods/attach.ts
function paramRecord(params) {
	return params && typeof params === "object" ? params : {};
}
function readString(params, key) {
	const value = params[key];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readPositiveNumber(params, key) {
	const value = params[key];
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : void 0;
}
const attachHandlers = {
	"attach.grant": async ({ params, respond, context }) => {
		const grantParams = paramRecord(params);
		const cfg = context.getRuntimeConfig();
		const sessionKey = readString(grantParams, "sessionKey") ?? resolveMainSessionKey(cfg);
		const harnessEntry = isAgentHarnessSessionKey(sessionKey) ? resolveSessionEntryAccessTarget({
			cfg,
			sessionKey
		}).entry : void 0;
		if (isAgentHarnessSessionKey(sessionKey) && (!harnessEntry || isAgentHarnessSessionStoreEntryProtected(sessionKey, harnessEntry))) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE));
			return;
		}
		await ensureMcpLoopbackServer();
		const runtime = getActiveMcpLoopbackRuntime();
		if (!runtime) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "mcp loopback server unavailable"));
			return;
		}
		const grant = mintAttachGrant({
			sessionKey,
			ttlMs: readPositiveNumber(grantParams, "ttlMs")
		});
		respond(true, {
			sessionKey: grant.sessionKey,
			token: grant.token,
			expiresAtMs: grant.expiresAtMs,
			mcpConfig: createMcpAttachGrantServerConfig(runtime.port),
			env: { OPENCLAW_MCP_TOKEN: grant.token }
		});
	},
	"attach.revoke": async ({ params, respond }) => {
		const token = readString(paramRecord(params), "token");
		if (!token) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "token is required"));
			return;
		}
		respond(true, { revoked: revokeAttachGrant(token) });
	}
};
//#endregion
export { attachHandlers };
