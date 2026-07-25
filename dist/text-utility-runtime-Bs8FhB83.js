import "./utils-K2PjeLaV.js";
import "./fetch-timeout-DqOAriJT.js";
import "./with-timeout-mEMkfIw9.js";
//#region src/plugin-sdk/text-utility-runtime.ts
/** Escapes text for safe insertion into HTML text and quoted attribute values. */
function escapeHtml(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
//#endregion
export { escapeHtml as t };
