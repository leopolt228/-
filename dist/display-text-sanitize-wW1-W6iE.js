import { f as stripInternalRuntimeContext } from "./internal-runtime-context-BW7WOTKc.js";
import { r as stripInboundMetadata } from "./strip-inbound-meta-CbJ4Y6Dq.js";
import { n as stripMessageIdHints, t as stripEnvelope } from "./chat-envelope-br4jVgj4.js";
//#region src/auto-reply/reply/display-text-sanitize.ts
/** Removes internal runtime metadata before showing text to users. */
function stripInternalMetadataForDisplay(text) {
	return stripInboundMetadata(stripInternalRuntimeContext(text));
}
/** Removes user-envelope and message-id hints from display text. */
function stripUserEnvelopeForDisplay(text) {
	return stripMessageIdHints(stripEnvelope(stripInternalMetadataForDisplay(text)));
}
//#endregion
export { stripUserEnvelopeForDisplay as n, stripInternalMetadataForDisplay as t };
