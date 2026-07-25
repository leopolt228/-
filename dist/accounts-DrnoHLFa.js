import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { l as isSecretRef } from "./types.secrets-BgE_Zq2x.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { Nn as record, Rn as string, Zn as unknown } from "./schemas-CBJjibl3.js";
import { n as safeParseWithSchema, t as safeParseJsonWithSchema } from "./zod-parse-Bip-sZi_.js";
import { t as resolveAccountEntry } from "./account-lookup-DgErwy8P.js";
import { c as resolveMergedAccountConfig, t as createAccountListHelpers } from "./account-helpers-BAtt8fRD.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./text-utility-runtime-Bs8FhB83.js";
import { n as tryReadSecretFileSync } from "./secret-file-ByIO3VE7.js";
import "./secret-file-runtime-Dd4IayyB.js";
import "./secret-input-Dzjaaiwk.js";
import { i as mergePairLoopGuardConfig } from "./pair-loop-guard-runtime-D0pZ_1is.js";
import "./account-resolution-DWTS6EOM.js";
import "./extension-shared-C29nk9eH.js";
//#region extensions/googlechat/src/google-auth-limits.ts
const MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES = 64 * 1024;
//#endregion
//#region extensions/googlechat/src/accounts.ts
const ENV_SERVICE_ACCOUNT = "GOOGLE_CHAT_SERVICE_ACCOUNT";
const ENV_SERVICE_ACCOUNT_FILE = "GOOGLE_CHAT_SERVICE_ACCOUNT_FILE";
const JsonRecordSchema = record(string(), unknown());
const { listAccountIds: listGoogleChatAccountIds, resolveDefaultAccountId: resolveDefaultGoogleChatAccountId } = createAccountListHelpers("googlechat", { implicitDefaultAccount: {
	channelKeys: [
		"serviceAccount",
		"serviceAccountRef",
		"serviceAccountFile"
	],
	envVars: [ENV_SERVICE_ACCOUNT, ENV_SERVICE_ACCOUNT_FILE]
} });
function mergeGoogleChatAccountConfig(cfg, accountId) {
	const raw = cfg.channels?.["googlechat"] ?? {};
	const base = resolveMergedAccountConfig({
		channelConfig: raw,
		accounts: raw.accounts,
		accountId,
		omitKeys: ["defaultAccount"],
		nestedObjectKeys: ["botLoopProtection"]
	});
	const defaultAccountConfig = resolveAccountEntry(raw.accounts, "default") ?? {};
	if (accountId === "default") return base;
	const { enabled: _ignoredEnabled, dangerouslyAllowNameMatching: _ignoredDangerouslyAllowNameMatching, serviceAccount: _ignoredServiceAccount, serviceAccountRef: _ignoredServiceAccountRef, serviceAccountFile: _ignoredServiceAccountFile, ...defaultAccountShared } = defaultAccountConfig;
	const botLoopProtection = mergePairLoopGuardConfig(defaultAccountShared.botLoopProtection, base.botLoopProtection);
	return {
		...defaultAccountShared,
		...base,
		...botLoopProtection ? { botLoopProtection } : {}
	};
}
function resolveGoogleChatConfigAccessorAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? params.cfg.channels?.googlechat?.defaultAccount);
	return { config: mergeGoogleChatAccountConfig(params.cfg, accountId) };
}
function parseServiceAccount(value) {
	if (isSecretRef(value)) return null;
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) return null;
		return safeParseJsonWithSchema(JsonRecordSchema, trimmed);
	}
	return safeParseWithSchema(JsonRecordSchema, value);
}
function resolveCredentialsFromConfig(params) {
	const { account, accountId } = params;
	const inline = parseServiceAccount(account.serviceAccount);
	if (inline) return {
		credentials: inline,
		source: "inline",
		status: "available"
	};
	if (isSecretRef(account.serviceAccount)) throw new Error(`channels.googlechat.accounts.${accountId}.serviceAccount: unresolved SecretRef "${account.serviceAccount.source}:${account.serviceAccount.provider}:${account.serviceAccount.id}". Resolve this command against an active gateway runtime snapshot before reading it.`);
	if (isSecretRef(account.serviceAccountRef)) throw new Error(`channels.googlechat.accounts.${accountId}.serviceAccount: unresolved SecretRef "${account.serviceAccountRef.source}:${account.serviceAccountRef.provider}:${account.serviceAccountRef.id}". Resolve this command against an active gateway runtime snapshot before reading it.`);
	const file = normalizeOptionalString(account.serviceAccountFile);
	if (file) {
		const result = tryReadSecretFileSync(resolveUserPath(file), "Google Chat service account file", {
			maxBytes: MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES,
			rejectHardlinks: false,
			rejectSymlink: false
		}, { configPath: `channels.googlechat.accounts.${accountId}.serviceAccountFile` });
		return result.status === "available" ? {
			credentialsFile: file,
			source: "file",
			status: "available"
		} : {
			credentialsFile: file,
			source: "file",
			status: "configured_unavailable",
			diagnostic: result.diagnostic
		};
	}
	if (accountId === "default") {
		const envJson = process.env[ENV_SERVICE_ACCOUNT];
		const envInline = parseServiceAccount(envJson);
		if (envInline) return {
			credentials: envInline,
			source: "env",
			status: "available"
		};
		const envFile = normalizeOptionalString(process.env[ENV_SERVICE_ACCOUNT_FILE]);
		if (envFile) {
			const result = tryReadSecretFileSync(resolveUserPath(envFile), "Google Chat service account file", {
				maxBytes: MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES,
				rejectHardlinks: false,
				rejectSymlink: false
			}, { configPath: `env.${ENV_SERVICE_ACCOUNT_FILE}` });
			return result.status === "available" ? {
				credentialsFile: envFile,
				source: "env",
				status: "available"
			} : {
				credentialsFile: envFile,
				source: "env",
				status: "configured_unavailable",
				diagnostic: result.diagnostic
			};
		}
	}
	return {
		source: "none",
		status: "missing"
	};
}
function resolveGoogleChatAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? params.cfg.channels?.["googlechat"]?.defaultAccount);
	const baseEnabled = params.cfg.channels?.["googlechat"]?.enabled !== false;
	const merged = mergeGoogleChatAccountConfig(params.cfg, accountId);
	const accountEnabled = merged.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	const credentials = resolveCredentialsFromConfig({
		accountId,
		account: merged
	});
	return {
		accountId,
		name: normalizeOptionalString(merged.name),
		enabled,
		config: merged,
		credentialSource: credentials.source,
		credentials: credentials.credentials,
		credentialsFile: credentials.credentialsFile,
		tokenStatus: credentials.status,
		...credentials.diagnostic ? { credentialDiagnostics: [credentials.diagnostic] } : {}
	};
}
function listEnabledGoogleChatAccounts(cfg) {
	return listGoogleChatAccountIds(cfg).map((accountId) => resolveGoogleChatAccount({
		cfg,
		accountId
	})).filter((account) => account.enabled);
}
//#endregion
export { resolveGoogleChatConfigAccessorAccount as a, resolveGoogleChatAccount as i, listGoogleChatAccountIds as n, MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES as o, resolveDefaultGoogleChatAccountId as r, listEnabledGoogleChatAccounts as t };
