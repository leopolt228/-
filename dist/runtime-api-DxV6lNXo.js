import "./runtime-group-policy-CXo40VxH.js";
import "./ssrf-runtime-b7ye-Z-7.js";
import "./channel-inbound-CsmpMLUZ.js";
import "./channel-outbound-D_Kkmr30.js";
import "./channel-pairing-aeyu-GFl.js";
import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
//#region extensions/nextcloud-talk/src/runtime.ts
const { setRuntime: setNextcloudTalkRuntime, getRuntime: getNextcloudTalkRuntime } = createPluginRuntimeStore({
	pluginId: "nextcloud-talk",
	errorMessage: "Nextcloud Talk runtime not initialized"
});
//#endregion
export { setNextcloudTalkRuntime as n, getNextcloudTalkRuntime as t };
