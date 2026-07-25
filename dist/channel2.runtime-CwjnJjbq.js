import { j as resolveTimerTimeoutMs } from "./number-coercion-Crk_c9KW.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import "./error-runtime-DUxkdoW4.js";
import "./number-runtime-C6TGSEc_.js";
import { t as collectZalouserSecurityAuditFindings } from "./security-audit-D6qm7VkA.js";
import { S as waitForZaloQrLogin, a as listZaloGroupMembers, c as logoutZaloProfile, i as listZaloFriendsMatching, n as getZaloUserInfo, s as listZaloGroupsMatching, x as startZaloQrLogin } from "./zalo-js-CR_CFuBA.js";
import { a as sendReactionZalouser, i as sendMessageZalouser } from "./send-BO_WIiu3.js";
//#region extensions/zalouser/src/probe.ts
async function probeZalouser(profile, timeoutMs) {
	try {
		let user;
		if (timeoutMs) {
			let timeout;
			try {
				user = await Promise.race([getZaloUserInfo(profile), new Promise((resolve) => {
					timeout = setTimeout(() => resolve(null), resolveTimerTimeoutMs(timeoutMs, 1e3, 1e3));
				})]);
			} finally {
				if (timeout) clearTimeout(timeout);
			}
		} else user = await getZaloUserInfo(profile);
		if (!user) return {
			ok: false,
			error: "Not authenticated"
		};
		return {
			ok: true,
			user
		};
	} catch (error) {
		return {
			ok: false,
			error: formatErrorMessage(error)
		};
	}
}
//#endregion
export { collectZalouserSecurityAuditFindings, getZaloUserInfo, listZaloFriendsMatching, listZaloGroupMembers, listZaloGroupsMatching, logoutZaloProfile, probeZalouser, sendMessageZalouser, sendReactionZalouser, startZaloQrLogin, waitForZaloQrLogin };
