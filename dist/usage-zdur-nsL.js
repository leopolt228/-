import { m as readProviderJsonResponse } from "./provider-http-errors-DrOMjuGn.js";
import { v as buildCopilotIdeHeaders } from "./provider-request-config-DrrUROfX.js";
import "./provider-auth-Bnib2g6h.js";
import "./provider-http-D2uO-AEP.js";
import { n as PROVIDER_LABELS, r as clampPercent } from "./provider-usage.shared-C4x5KiVT.js";
import { c as buildUsageHttpErrorSnapshot, l as fetchJson } from "./provider-usage-BFXnDOg6.js";
import { t as PUBLIC_GITHUB_COPILOT_DOMAIN } from "./domain-Bw0bH59M.js";
//#region extensions/github-copilot/usage.ts
async function fetchCopilotUsage(token, timeoutMs, fetchFn, githubDomain = PUBLIC_GITHUB_COPILOT_DOMAIN) {
	const res = await fetchJson(`https://api.${githubDomain}/copilot_internal/user`, { headers: {
		Authorization: `token ${token}`,
		...buildCopilotIdeHeaders({ includeApiVersion: true })
	} }, timeoutMs, fetchFn);
	if (!res.ok) {
		await res.body?.cancel().catch(() => void 0);
		return buildUsageHttpErrorSnapshot({
			provider: "github-copilot",
			status: res.status
		});
	}
	const data = await readProviderJsonResponse(res, "github-copilot-usage");
	const windows = [];
	if (data.quota_snapshots?.premium_interactions) {
		const remaining = data.quota_snapshots.premium_interactions.percent_remaining;
		windows.push({
			label: "Premium",
			usedPercent: clampPercent(100 - (remaining ?? 0))
		});
	}
	if (data.quota_snapshots?.chat) {
		const remaining = data.quota_snapshots.chat.percent_remaining;
		windows.push({
			label: "Chat",
			usedPercent: clampPercent(100 - (remaining ?? 0))
		});
	}
	return {
		provider: "github-copilot",
		displayName: PROVIDER_LABELS["github-copilot"],
		windows,
		plan: data.copilot_plan
	};
}
//#endregion
export { fetchCopilotUsage as t };
