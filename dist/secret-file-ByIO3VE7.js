import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import "./fs-safe-defaults-i5I9YK-y.js";
import { C as FsSafeError } from "./path-DILYn_gk.js";
import "./utils-K2PjeLaV.js";
import { a as tryReadSecretFileSync$1, i as readSecretFileSync } from "./secret-file-TeYT5iMV.js";
//#region src/infra/secret-file.ts
function tryReadSecretFileSync(filePath, label, options = {}, diagnostic) {
	if ("credentialDiagnostic" in options) {
		const { credentialDiagnostic, ...readOptions } = options;
		if (!filePath?.trim()) return;
		try {
			return readSecretFileSync(filePath, label, readOptions);
		} catch (error) {
			if (!(error instanceof FsSafeError)) throw error;
			credentialDiagnostic.report({
				code: "CREDENTIAL_FILE_UNAVAILABLE",
				path: credentialDiagnostic.configPath,
				reason: error.code
			});
			return;
		}
	}
	if (!diagnostic) return tryReadSecretFileSync$1(filePath, label, options);
	if (!filePath?.trim()) return { status: "missing" };
	try {
		return {
			status: "available",
			value: readSecretFileSync(filePath, label, options)
		};
	} catch (error) {
		if (!(error instanceof FsSafeError)) throw error;
		return {
			status: "configured_unavailable",
			diagnostic: {
				code: "CREDENTIAL_FILE_UNAVAILABLE",
				path: diagnostic.configPath,
				reason: error.code
			}
		};
	}
}
/** @deprecated Use readSecretFileSync() or tryReadSecretFileSync(). */
function loadSecretFileSync(filePath, label, options = {}) {
	const resolvedPath = resolveUserPath(filePath.trim());
	if (!resolvedPath) return {
		ok: false,
		message: `${label} file path is empty.`
	};
	try {
		return {
			ok: true,
			secret: readSecretFileSync(filePath, label, options),
			resolvedPath
		};
	} catch (error) {
		return {
			ok: false,
			message: error instanceof Error ? error.message : String(error),
			resolvedPath,
			error
		};
	}
}
//#endregion
export { tryReadSecretFileSync as n, loadSecretFileSync as t };
