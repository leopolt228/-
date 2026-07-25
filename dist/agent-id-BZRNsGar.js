import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
//#region src/system-agent/agent-id.ts
const SYSTEM_AGENT_ID = "openclaw";
const RESERVED_SYSTEM_AGENT_IDS = /* @__PURE__ */ new Set([normalizeAgentId(SYSTEM_AGENT_ID), normalizeAgentId("crestodian")]);
function isReservedSystemAgentId(agentId) {
	return RESERVED_SYSTEM_AGENT_IDS.has(normalizeAgentId(agentId));
}
//#endregion
export { isReservedSystemAgentId as n, SYSTEM_AGENT_ID as t };
