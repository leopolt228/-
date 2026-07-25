import { c as getSession } from "./bash-process-registry-BrIqJ2bV.js";
import { t as getProcessSupervisor } from "./supervisor-Da_-xdZV.js";
//#region src/agents/bash-process-control.ts
function isBackgroundExecSessionActive(sessionId) {
	const session = getSession(sessionId);
	return Boolean(session?.backgrounded && !session.exited);
}
function cancelBackgroundExecSession(sessionId) {
	const session = getSession(sessionId);
	if (!session?.backgrounded || session.exited || session.finalizing) return false;
	const supervisor = getProcessSupervisor();
	const record = supervisor.getRecord(sessionId);
	if (!record || record.state === "exited") return false;
	supervisor.cancel(sessionId, "manual-cancel");
	return true;
}
//#endregion
export { isBackgroundExecSessionActive as n, cancelBackgroundExecSession as t };
