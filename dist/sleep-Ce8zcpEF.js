import { j as resolveTimerTimeoutMs } from "./number-coercion-Crk_c9KW.js";
import "./number-coercion-IpMOa8nH.js";
//#region src/utils/sleep.ts
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, resolveTimerTimeoutMs(ms, 0, 0));
	});
}
//#endregion
export { sleep as t };
