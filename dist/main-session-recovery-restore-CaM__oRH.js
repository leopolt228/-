import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { t as retryAsync } from "./retry-Cn-q-rcX.js";
import { t as scheduleMainSessionRecoveryPendingTarget } from "./main-session-recovery-owner-release-CKDi4nci.js";
//#region src/agents/main-session-recovery-restore.ts
const log = createSubsystemLogger("main-session-recovery");
const RESTORE_RETRY_DELAY_MS = 1e3;
const RESTORE_RETRY_MAX_DELAY_MS = 3e4;
async function restoreAdmittedRecoveryWithRetries(restore) {
	return await retryAsync(restore, 3, 25);
}
function scheduleAdmittedRecoveryRestore(restore, delayMs = RESTORE_RETRY_DELAY_MS) {
	setTimeout(() => {
		restoreAdmittedRecoveryWithRetries(restore).then((pendingRecovery) => {
			scheduleMainSessionRecoveryPendingTarget(pendingRecovery);
		}, (error) => {
			log.warn(`failed delayed admitted recovery restoration: ${formatErrorMessage(error)}`);
			scheduleAdmittedRecoveryRestore(restore, Math.min(delayMs * 2, RESTORE_RETRY_MAX_DELAY_MS));
		});
	}, delayMs).unref?.();
}
//#endregion
export { scheduleAdmittedRecoveryRestore as n, restoreAdmittedRecoveryWithRetries as t };
