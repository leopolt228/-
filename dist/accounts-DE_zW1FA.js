import { n as normalizeAccountId$1, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-C7N4Rwku.js";
import { t as resolveAccountEntry } from "./account-lookup-DgErwy8P.js";
import { n as tryReadSecretFileSync } from "./secret-file-ByIO3VE7.js";
import "./secret-file-runtime-Dd4IayyB.js";
import "./account-resolution-DWTS6EOM.js";
//#region extensions/line/src/accounts.ts
function readCredentialFile(filePath, configPath) {
	return tryReadSecretFileSync(filePath, "LINE credential file", { rejectSymlink: true }, { configPath });
}
function resolveToken(params) {
	const { accountId, baseConfig, accountConfig } = params;
	if (accountConfig?.channelAccessToken?.trim()) return {
		value: accountConfig.channelAccessToken.trim(),
		source: "config",
		status: "available"
	};
	if (accountConfig?.tokenFile?.trim()) {
		const result = readCredentialFile(accountConfig.tokenFile, `channels.line.accounts.${accountId}.tokenFile`);
		return result.status === "available" ? {
			value: result.value,
			source: "file",
			status: "available"
		} : {
			value: "",
			source: "file",
			status: "configured_unavailable",
			diagnostic: result.diagnostic
		};
	}
	if (accountId === "default") {
		if (baseConfig?.channelAccessToken?.trim()) return {
			value: baseConfig.channelAccessToken.trim(),
			source: "config",
			status: "available"
		};
		if (baseConfig?.tokenFile?.trim()) {
			const result = readCredentialFile(baseConfig.tokenFile, "channels.line.tokenFile");
			return result.status === "available" ? {
				value: result.value,
				source: "file",
				status: "available"
			} : {
				value: "",
				source: "file",
				status: "configured_unavailable",
				diagnostic: result.diagnostic
			};
		}
		const envToken = process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim();
		if (envToken) return {
			value: envToken,
			source: "env",
			status: "available"
		};
	}
	return {
		value: "",
		source: "none",
		status: "missing"
	};
}
function resolveSecret(params) {
	const { accountId, baseConfig, accountConfig } = params;
	if (accountConfig?.channelSecret?.trim()) return {
		value: accountConfig.channelSecret.trim(),
		source: "config",
		status: "available"
	};
	if (accountConfig?.secretFile?.trim()) {
		const result = readCredentialFile(accountConfig.secretFile, `channels.line.accounts.${accountId}.secretFile`);
		return result.status === "available" ? {
			value: result.value,
			source: "file",
			status: "available"
		} : {
			value: "",
			source: "file",
			status: "configured_unavailable",
			diagnostic: result.diagnostic
		};
	}
	if (accountId === "default") {
		if (baseConfig?.channelSecret?.trim()) return {
			value: baseConfig.channelSecret.trim(),
			source: "config",
			status: "available"
		};
		if (baseConfig?.secretFile?.trim()) {
			const result = readCredentialFile(baseConfig.secretFile, "channels.line.secretFile");
			return result.status === "available" ? {
				value: result.value,
				source: "file",
				status: "available"
			} : {
				value: "",
				source: "file",
				status: "configured_unavailable",
				diagnostic: result.diagnostic
			};
		}
		const envSecret = process.env.LINE_CHANNEL_SECRET?.trim();
		if (envSecret) return {
			value: envSecret,
			source: "env",
			status: "available"
		};
	}
	return {
		value: "",
		source: "none",
		status: "missing"
	};
}
function resolveLineAccount(params) {
	const cfg = params.cfg;
	const accountId = normalizeAccountId$1(params.accountId ?? resolveDefaultLineAccountId(cfg));
	const lineConfig = cfg.channels?.line;
	const accounts = lineConfig?.accounts;
	const accountConfig = resolveAccountEntry(accounts, accountId);
	const token = resolveToken({
		accountId,
		baseConfig: lineConfig,
		accountConfig
	});
	const secret = resolveSecret({
		accountId,
		baseConfig: lineConfig,
		accountConfig
	});
	const { accounts: _ignoredAccounts, defaultAccount: _ignoredDefaultAccount, ...lineBase } = lineConfig ?? {};
	const mergedConfig = {
		...lineBase,
		...accountConfig
	};
	const baseEnabled = lineConfig?.enabled !== false;
	const accountEnabled = accountConfig?.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	return {
		accountId,
		name: accountConfig?.name ?? (accountId === "default" ? lineConfig?.name : void 0),
		enabled,
		channelAccessToken: token.value,
		channelSecret: secret.value,
		tokenSource: token.source,
		signingSecretSource: secret.source,
		tokenStatus: token.status,
		signingSecretStatus: secret.status,
		...[token.diagnostic, secret.diagnostic].some(Boolean) ? { credentialDiagnostics: [token.diagnostic, secret.diagnostic].filter((diagnostic) => Boolean(diagnostic)) } : {},
		config: mergedConfig
	};
}
function listLineAccountIds(cfg) {
	const lineConfig = cfg.channels?.line;
	const accounts = lineConfig?.accounts;
	const ids = /* @__PURE__ */ new Set();
	if (lineConfig?.channelAccessToken?.trim() || lineConfig?.tokenFile || process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim()) ids.add(DEFAULT_ACCOUNT_ID);
	if (accounts) for (const id of Object.keys(accounts)) ids.add(id);
	return Array.from(ids);
}
function resolveDefaultLineAccountId(cfg) {
	const preferred = normalizeOptionalAccountId((cfg.channels?.line)?.defaultAccount);
	if (preferred && listLineAccountIds(cfg).some((accountId) => normalizeAccountId$1(accountId) === preferred)) return preferred;
	const ids = listLineAccountIds(cfg);
	if (ids.includes("default")) return DEFAULT_ACCOUNT_ID;
	return ids[0] ?? "default";
}
function normalizeAccountId(accountId) {
	return normalizeAccountId$1(accountId);
}
//#endregion
export { resolveLineAccount as i, normalizeAccountId as n, resolveDefaultLineAccountId as r, listLineAccountIds as t };
