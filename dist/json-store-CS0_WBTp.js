import "./fs-safe-defaults-i5I9YK-y.js";
import { g as pathExists } from "./fs-safe-Dy0g6QwA.js";
import { c as tryReadJson, d as writeJsonSync, l as tryReadJsonSync, u as writeJson } from "./json--wG6OtAJ.js";
import "./json-files-2JJFkKam.js";
//#region src/plugin-sdk/json-store.ts
/** Read small JSON blobs synchronously for token/state caches. */
function loadJsonFile(filePath) {
	return tryReadJsonSync(filePath) ?? void 0;
}
/** Persist small JSON blobs synchronously with restrictive permissions. */
const saveJsonFile = writeJsonSync;
/** Read JSON from disk and fall back cleanly when the file is missing or invalid. */
async function readJsonFileWithFallback(filePath, fallback) {
	const parsed = await tryReadJson(filePath);
	if (parsed != null) return {
		value: parsed,
		exists: true
	};
	return {
		value: fallback,
		exists: await pathExists(filePath)
	};
}
/** Write JSON with secure file permissions and atomic replacement semantics. */
async function writeJsonFileAtomically(filePath, value) {
	await writeJson(filePath, value, {
		mode: 384,
		dirMode: 448,
		trailingNewline: true
	});
}
//#endregion
export { writeJsonFileAtomically as i, readJsonFileWithFallback as n, saveJsonFile as r, loadJsonFile as t };
