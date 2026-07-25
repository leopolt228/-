import { _ as resolveSecretInputString, p as normalizeSecretInputString, s as coerceSecretRef } from "./types.secrets-BgE_Zq2x.js";
import { f as resolveNonEnvSecretRefApiKeyMarker } from "./model-auth-markers-Bqpoo9x7.js";
import { m as readProviderEnvValue } from "./web-search-provider-common-9xC_0p_Y.js";
import "./provider-auth-Bnib2g6h.js";
import "./secret-input-Dzjaaiwk.js";
import { i as canResolveEnvSecretRefInReadOnlyPath } from "./extension-shared-C29nk9eH.js";
import { i as resolveProviderWebSearchPluginConfig } from "./web-search-provider-config-CRGb0PI1.js";
import "./provider-web-search-CyddQoxo.js";
//#region extensions/xai/src/tool-auth-shared.ts
const XAI_API_KEY_ENV_VAR = "XAI_API_KEY";
const XAI_PROVIDER_ID = "xai";
function readConfiguredOrManagedApiKey(value) {
	const literal = normalizeSecretInputString(value);
	if (literal) return literal;
	const ref = coerceSecretRef(value);
	return ref ? resolveNonEnvSecretRefApiKeyMarker(ref.source) : void 0;
}
function readConfiguredRuntimeApiKey(value, path, cfg) {
	const resolved = resolveSecretInputString({
		value,
		path,
		defaults: cfg?.secrets?.defaults,
		mode: "inspect"
	});
	if (resolved.status === "available") return {
		status: "available",
		value: resolved.value
	};
	if (resolved.status === "missing") return { status: "missing" };
	if (resolved.ref.source !== "env") return { status: "blocked" };
	const envVarName = resolved.ref.id.trim();
	if (envVarName !== XAI_API_KEY_ENV_VAR) return { status: "blocked" };
	if (!canResolveEnvSecretRefInReadOnlyPath({
		cfg,
		provider: resolved.ref.provider,
		id: envVarName
	})) return { status: "blocked" };
	const envValue = normalizeSecretInputString(process.env[envVarName]);
	return envValue ? {
		status: "available",
		value: envValue
	} : { status: "missing" };
}
function readPluginXaiWebSearchApiKeyResult(cfg) {
	return readConfiguredRuntimeApiKey(resolveProviderWebSearchPluginConfig(cfg, "xai")?.apiKey, "plugins.entries.xai.config.webSearch.apiKey", cfg);
}
function resolveConfiguredXaiToolApiKeyResult(params) {
	const runtimePlugin = readPluginXaiWebSearchApiKeyResult(params.runtimeConfig);
	if (runtimePlugin.status === "available" || runtimePlugin.status === "blocked") return runtimePlugin;
	const sourcePlugin = readPluginXaiWebSearchApiKeyResult(params.sourceConfig);
	if (sourcePlugin.status === "available" || sourcePlugin.status === "blocked") return sourcePlugin;
	return { status: "missing" };
}
function hasXaiAuthProfile(auth) {
	return auth?.hasAuthForProvider?.(XAI_PROVIDER_ID) === true;
}
async function resolveXaiAuthProfileApiKey(auth) {
	return normalizeSecretInputString(await auth?.resolveApiKeyForProvider?.(XAI_PROVIDER_ID));
}
function resolveFallbackXaiAuth(cfg) {
	const pluginApiKey = readConfiguredOrManagedApiKey(resolveProviderWebSearchPluginConfig(cfg, "xai")?.apiKey);
	if (pluginApiKey) return {
		apiKey: pluginApiKey,
		source: "plugins.entries.xai.config.webSearch.apiKey"
	};
}
async function resolveXaiToolApiKeyWithAuth(params) {
	const configured = resolveConfiguredXaiToolApiKeyResult(params);
	if (configured.status === "available") return configured.value;
	if (configured.status === "blocked") return;
	return await resolveXaiAuthProfileApiKey(params.auth) ?? readProviderEnvValue([XAI_API_KEY_ENV_VAR]);
}
function isXaiToolEnabled(params) {
	if (params.enabled === false) return false;
	const configured = resolveConfiguredXaiToolApiKeyResult(params);
	if (configured.status === "available") return true;
	if (configured.status === "blocked") return false;
	return hasXaiAuthProfile(params.auth) || Boolean(readProviderEnvValue([XAI_API_KEY_ENV_VAR]));
}
//#endregion
export { resolveFallbackXaiAuth as n, resolveXaiToolApiKeyWithAuth as r, isXaiToolEnabled as t };
