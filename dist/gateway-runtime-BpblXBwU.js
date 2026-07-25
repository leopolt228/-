import "./net-DBokCmJs.js";
import "./auth-6en4RqxB.js";
import "./client-DpNJQtBd.js";
import "./node-command-policy-DMws3TUh.js";
import "./startup-auth-BBach1wy.js";
import "./gateway-rpc-BeSn3X6s.js";
import "./hosted-plugin-surface-url-C5u_O_hj.js";
import "./plugin-node-capability-9V7uhGk6.js";
import "./nodes.helpers-7n_NmUos.js";
//#region src/gateway/channel-status-patches.ts
/** Creates a connected-channel status patch with matching connection/event timestamps. */
function createConnectedChannelStatusPatch(at = Date.now()) {
	return {
		connected: true,
		lastConnectedAt: at,
		lastEventAt: at
	};
}
/** Creates a transport-activity patch for health/activity monitors. */
function createTransportActivityStatusPatch(at = Date.now()) {
	return { lastTransportActivityAt: at };
}
//#endregion
//#region src/plugin-sdk/gateway-runtime.ts
async function resolveAdvertisedLanHost() {
	return await (await import("./advertised-lan-host-D5L3aJjd.js")).resolveAdvertisedLanHost();
}
//#endregion
export { createConnectedChannelStatusPatch as n, createTransportActivityStatusPatch as r, resolveAdvertisedLanHost as t };
