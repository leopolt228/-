import { s as normalizeGithubCopilotDomain } from "./oauth-CoapP-dc.js";
import "./provider-auth-Bnib2g6h.js";
//#region extensions/github-copilot/domain.ts
/** Public GitHub Copilot host used when no data-residency domain is configured. */
const PUBLIC_GITHUB_COPILOT_DOMAIN = "github.com";
function readConfiguredGithubCopilotDomain(config) {
	const params = config?.models?.providers?.["github-copilot"]?.params;
	const value = params && typeof params === "object" ? params.githubDomain : void 0;
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
/**
* Resolve the GitHub Copilot host for this provider from (in priority order) the
* `COPILOT_GITHUB_DOMAIN` env override, the persisted
* `models.providers.github-copilot.params.githubDomain` config, then public
* `github.com`. The result always passes through the SDK allowlist
* (`normalizeGithubCopilotDomain`) so an unsafe value fails closed.
*/
function resolveGithubCopilotDomain(params) {
	const fromEnv = (params?.env ?? process.env).COPILOT_GITHUB_DOMAIN?.trim();
	if (fromEnv) return normalizeGithubCopilotDomain(fromEnv);
	if (params?.explicit) return normalizeGithubCopilotDomain(params.explicit);
	return normalizeGithubCopilotDomain(readConfiguredGithubCopilotDomain(params?.config));
}
function withGithubCopilotDomainConfig(cfg, domain) {
	const models = cfg.models ?? {};
	const providers = models.providers ?? {};
	const provider = providers["github-copilot"];
	const params = provider?.params;
	const isDefault = domain === PUBLIC_GITHUB_COPILOT_DOMAIN;
	if (isDefault && !(params && "githubDomain" in params)) return cfg;
	const nextParams = { ...params };
	if (isDefault) delete nextParams.githubDomain;
	else nextParams.githubDomain = domain;
	const nextProviders = { ...providers };
	if (provider) nextProviders["github-copilot"] = {
		...provider,
		params: nextParams
	};
	else Object.assign(nextProviders, { "github-copilot": { params: nextParams } });
	return {
		...cfg,
		models: {
			...models,
			providers: nextProviders
		}
	};
}
//#endregion
export { resolveGithubCopilotDomain as n, withGithubCopilotDomainConfig as r, PUBLIC_GITHUB_COPILOT_DOMAIN as t };
