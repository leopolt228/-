import "./fs-safe-defaults-i5I9YK-y.js";
import { C as FsSafeError } from "./path-DILYn_gk.js";
import { n as readFileDescriptorBoundedSync$1, t as readFileDescriptorBounded$1 } from "./bounded-read-xOtI_QIE.js";
//#region src/infra/boundary-file-read.ts
function preserveOpenClawOverflowError(error, maxBytes) {
	if (error instanceof FsSafeError && error.code === "too-large") throw new RangeError(`File exceeds ${maxBytes} bytes`, { cause: error });
	throw error;
}
/** Read a pinned descriptor without changing OpenClaw's user-facing overflow error. */
async function readFileDescriptorBounded(fd, maxBytes) {
	try {
		return await readFileDescriptorBounded$1(fd, maxBytes);
	} catch (error) {
		return preserveOpenClawOverflowError(error, maxBytes);
	}
}
/** Synchronous variant for callers that own a pinned descriptor. */
function readFileDescriptorBoundedSync(fd, maxBytes) {
	try {
		return readFileDescriptorBoundedSync$1(fd, maxBytes);
	} catch (error) {
		return preserveOpenClawOverflowError(error, maxBytes);
	}
}
//#endregion
export { readFileDescriptorBoundedSync as n, readFileDescriptorBounded as t };
