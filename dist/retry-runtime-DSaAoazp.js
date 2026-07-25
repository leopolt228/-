import { c as asFiniteNumberInRange, y as parseStrictNonNegativeInteger } from "./number-coercion-Crk_c9KW.js";
import "./number-coercion-IpMOa8nH.js";
import "./retry-Cn-q-rcX.js";
import "./retry-policy-4afimgeb.js";
import { parseRetryAfterHttpDateMs } from "@openclaw/ai/internal/retry-after";
//#region src/infra/retry-after.ts
const RETRY_AFTER_HEADER_DELAY_RE = /^\d+$/;
const MAX_SAFE_RETRY_AFTER_SECONDS = Number.MAX_SAFE_INTEGER / 1e3;
/** Parses an RFC Retry-After header as delay seconds or any valid HTTP-date form. */
function parseRetryAfterHeaderSeconds(value, now = Date.now()) {
	if (!value) return;
	const trimmed = value.trim();
	if (RETRY_AFTER_HEADER_DELAY_RE.test(trimmed)) return asFiniteNumberInRange(parseStrictNonNegativeInteger(trimmed), {
		min: 0,
		max: MAX_SAFE_RETRY_AFTER_SECONDS
	});
	if (!Number.isFinite(now)) return;
	const retryAt = parseRetryAfterHttpDateMs(trimmed, now);
	return retryAt === void 0 ? void 0 : Math.max(0, (retryAt - now) / 1e3);
}
//#endregion
export { parseRetryAfterHeaderSeconds as t };
