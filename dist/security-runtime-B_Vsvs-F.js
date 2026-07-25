import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import "./redact-DNq_HeDt.js";
import "./errors-DdbcjW1Y.js";
import "./fs-safe-defaults-i5I9YK-y.js";
import "./fs-safe-Dy0g6QwA.js";
import { s as statRegularFileSync } from "./regular-file-D9KgyI-A.js";
import "./replace-file-C0afzsFb.js";
import "./path-guards-BrHe7pxx.js";
import "./private-file-store-BR9m_0ne.js";
import "./fs-safe-advanced-B0eXpnA9.js";
import "./proxy-env-Blb_nHo9.js";
import "./ssrf-eKWXIRoD.js";
import "./ports-BSfVrBR-.js";
import "./dm-policy-shared-CGPe5B6t.js";
import { i as wrapExternalContent } from "./external-content-DkHx38wP.js";
//#region src/security/channel-metadata.ts
const DEFAULT_MAX_CHARS = 800;
const DEFAULT_MAX_ENTRY_CHARS = 400;
function normalizeEntry(entry) {
	return entry.replace(/\s+/g, " ").trim();
}
function truncateText(value, maxChars) {
	if (maxChars <= 0) return "";
	if (value.length <= maxChars) return value;
	return `${truncateUtf16Safe(value, Math.max(0, maxChars - 3)).trimEnd()}...`;
}
/**
* Build bounded, externally wrapped channel metadata for prompt context.
* Channel-provided labels can be user-controlled, so callers must treat this as untrusted content.
*/
function buildUntrustedChannelMetadata(params) {
	const deduped = uniqueStrings(params.entries.map((entry) => typeof entry === "string" ? normalizeEntry(entry) : "").filter((entry) => Boolean(entry)).map((entry) => truncateText(entry, DEFAULT_MAX_ENTRY_CHARS)));
	if (deduped.length === 0) return;
	const body = deduped.join("\n");
	return wrapExternalContent(truncateText(`${`UNTRUSTED channel metadata (${params.source})`}\n${`${params.label}:\n${body}`}`, params.maxChars ?? DEFAULT_MAX_CHARS), {
		source: "channel_metadata",
		includeWarning: false
	});
}
//#endregion
//#region src/plugin-sdk/security-runtime.ts
/**
* @deprecated Broad public SDK barrel. Prefer focused security/SSRF/secret
* subpaths and avoid adding new imports here.
*/
/** Return whether a path resolves to a regular file, treating filesystem errors as missing. */
function fileExists(filePath) {
	try {
		return !statRegularFileSync(filePath).missing;
	} catch {
		return false;
	}
}
//#endregion
export { buildUntrustedChannelMetadata as n, fileExists as t };
