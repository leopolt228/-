import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import { t as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-B5sNTTcg.js";
//#region src/agents/main-session-recovery-owner-release.ts
/** Schedules exact-row recovery only after the caller releases its lifecycle admission. */
function scheduleMainSessionRecoveryPendingTarget(target) {
	if (!target) return;
	import("./main-session-restart-recovery-DCHdN5ny.js").then(({ scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease }) => {
		scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease({
			expectedSessionId: target.sessionId,
			getConfig: getRuntimeConfig,
			getGatewayRuntime: getGatewayRecoveryRuntime,
			sessionKey: target.sessionKey,
			storePath: target.storePath
		});
	}, () => {});
}
//#endregion
export { scheduleMainSessionRecoveryPendingTarget as t };
