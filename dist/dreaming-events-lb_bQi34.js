import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as appendMemoryHostEvent } from "./memory-host-events-DKbuA3R1.js";
import "./dreaming-shared-COCFY4u9.js";
import { n as resolveMemoryCoreTimestamp, t as resolveMemoryCoreNowMs } from "./time-bSrYId6Z.js";
//#region extensions/memory-core/src/dreaming-events.ts
async function appendFailedDreamingEvent(params) {
	try {
		await appendMemoryHostEvent(params.workspaceDir, {
			type: "memory.dream.completed",
			timestamp: resolveMemoryCoreTimestamp(resolveMemoryCoreNowMs(params.nowMs)),
			phase: params.phase,
			outcome: "failed",
			error: params.error,
			lineCount: 0,
			storageMode: params.storageMode
		});
	} catch (err) {
		params.logger.warn(`memory-core: failed to write ${params.phase} dreaming outcome event for workspace ${params.workspaceDir}: ${formatErrorMessage(err)}`);
	}
}
//#endregion
export { appendFailedDreamingEvent as t };
