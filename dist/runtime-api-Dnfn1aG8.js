import "./text-chunking-CcRmx-1w.js";
import "./runtime-group-policy-CXo40VxH.js";
import "./ssrf-runtime-b7ye-Z-7.js";
import "./dangerous-name-runtime-cJriWyuh.js";
import "./channel-status-CDSjOGL5.js";
import "./channel-actions-CkrqGkMr.js";
import "./channel-feedback-DUquyVcz.js";
import "./channel-inbound-CsmpMLUZ.js";
import "./channel-outbound-D_Kkmr30.js";
import "./channel-pairing-aeyu-GFl.js";
import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
import "./webhook-request-guards-BwB_e49u.js";
import "./webhook-ingress-0GWTUyGu.js";
import "./webhook-targets-D0QbJdTx.js";
import "./config-api-CrRGdrRT.js";
//#region extensions/googlechat/src/runtime.ts
const { setRuntime: setGoogleChatRuntime, getRuntime: getGoogleChatRuntime } = createPluginRuntimeStore({
	pluginId: "googlechat",
	errorMessage: "Google Chat runtime not initialized"
});
//#endregion
export { setGoogleChatRuntime as n, getGoogleChatRuntime as t };
