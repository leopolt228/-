import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
//#region src/plugins/session-discussion-registry.ts
const log = createSubsystemLogger("plugins/session-discussion");
const SESSION_DISCUSSION_REGISTRY = Symbol.for("openclaw.sessionDiscussionRegistry");
function getRegistry() {
	const globalStore = globalThis;
	return globalStore[SESSION_DISCUSSION_REGISTRY] ??= {};
}
function registerSessionDiscussionProvider(provider) {
	const registry = getRegistry();
	if (registry.provider) log.warn(`replacing session discussion provider ${registry.provider.id} with ${provider.id}`);
	registry.provider = provider;
}
function getSessionDiscussionProvider() {
	return getRegistry().provider;
}
/** Clears the process-wide provider before a new active plugin registry is assembled. */
function clearSessionDiscussionProvider() {
	getRegistry().provider = void 0;
}
/** Restores the provider when a plugin registration transaction does not become active. */
function restoreSessionDiscussionProvider(provider) {
	getRegistry().provider = provider;
}
//#endregion
export { restoreSessionDiscussionProvider as i, getSessionDiscussionProvider as n, registerSessionDiscussionProvider as r, clearSessionDiscussionProvider as t };
