import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import { a as resolveMainSessionKey } from "./main-session-C7kXMD8t.js";
//#region src/config/sessions/main-session.runtime.ts
/** Resolves the main session key from the active runtime config. */
function resolveMainSessionKeyFromConfig() {
	return resolveMainSessionKey(getRuntimeConfig());
}
//#endregion
export { resolveMainSessionKeyFromConfig as t };
