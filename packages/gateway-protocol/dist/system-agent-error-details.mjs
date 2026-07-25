// packages/gateway-protocol/src/system-agent-error-details.ts
var SystemAgentErrorDetailCodes = {
  SESSION_INVALIDATED: "system_agent_session_invalidated"
};
function buildSystemAgentSessionInvalidatedErrorDetails() {
  return { code: SystemAgentErrorDetailCodes.SESSION_INVALIDATED };
}
function readSystemAgentSessionInvalidatedErrorDetails(details) {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return void 0;
  }
  const code = details.code;
  return code === SystemAgentErrorDetailCodes.SESSION_INVALIDATED ? { code } : void 0;
}
export {
  SystemAgentErrorDetailCodes,
  buildSystemAgentSessionInvalidatedErrorDetails,
  readSystemAgentSessionInvalidatedErrorDetails
};
