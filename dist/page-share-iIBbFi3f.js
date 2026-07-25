import { o as requestHeartbeat } from "./heartbeat-wake-CH_r-5du.js";
import { a as enqueueSystemEvent } from "./system-events-BNfyhKS3.js";
import { t as resolveMainSessionKeyFromConfig } from "./main-session.runtime.js";
import { i as wrapExternalContent } from "./external-content-DkHx38wP.js";
import "./security-runtime-B_Vsvs-F.js";
import "./heartbeat-runtime-CdLNB40C.js";
import "./system-event-runtime-DPIF5atb.js";
//#region extensions/browser/src/browser/extension-relay/page-share.ts
const PAGE_SHARE_GATEWAY_REQUIRED_ERROR = "Send to OpenClaw needs the extension relay hosted by the Gateway (pair on the Gateway host or use direct Gateway pairing). Node-hosted relays are not supported yet.";
let pageShareSink = null;
function setPageShareSink(sink) {
	pageShareSink = sink;
}
function createGatewayPageShareSink() {
	return {
		enqueueSystemEvent,
		requestHeartbeat,
		resolveMainSessionKey: resolveMainSessionKeyFromConfig
	};
}
async function deliverPageShare(payload) {
	const sink = pageShareSink;
	if (!sink) throw new Error(PAGE_SHARE_GATEWAY_REQUIRED_ERROR);
	const note = payload.note?.trim();
	const body = payload.selection?.trim() || payload.content;
	const wrapped = wrapExternalContent(`Title: ${payload.title}\nURL: ${payload.url}\n\n${body}`, { source: "browser" });
	const text = `${["Page shared from the OpenClaw Chrome extension.", ...note ? [`Note: ${note}`] : []].join("\n")}\n\n${wrapped}`;
	await sink.enqueueSystemEvent(text, { sessionKey: sink.resolveMainSessionKey() });
	await sink.requestHeartbeat({
		source: "other",
		intent: "immediate",
		reason: "browser-page-share"
	});
}
//#endregion
export { setPageShareSink as i, createGatewayPageShareSink as n, deliverPageShare as r, PAGE_SHARE_GATEWAY_REQUIRED_ERROR as t };
