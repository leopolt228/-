import { accessSync, constants, readFileSync, realpathSync } from "node:fs";
import path from "node:path";
import os from "node:os";
//#region extensions/imessage/src/cli-path.ts
const localCliPathCache = /* @__PURE__ */ new Map();
const MACH_O_MAGICS = /* @__PURE__ */ new Set([
	"feedface",
	"feedfacf",
	"cefaedfe",
	"cffaedfe",
	"cafebabe",
	"cafebabf",
	"bebafeca",
	"bfbafeca"
]);
function safeHomeDir() {
	const home = process.env.HOME?.trim();
	if (home) return home;
	try {
		return os.homedir().trim() || void 0;
	} catch {
		return;
	}
}
function expandIMessageUserPath(value) {
	if (!value.startsWith("~")) return value;
	const home = safeHomeDir();
	return home ? value.replace(/^~(?=$|[\\/])/, home) : value;
}
function resolveIMessageExecutable(cliPath) {
	const expanded = expandIMessageUserPath(cliPath);
	if (expanded.includes(path.sep)) return expanded;
	for (const directory of (process.env.PATH ?? "").split(path.delimiter)) {
		if (!directory) continue;
		const candidate = path.join(directory, expanded);
		try {
			accessSync(candidate, constants.X_OK);
			return candidate;
		} catch {}
	}
}
function isMachOExecutable(filePath) {
	try {
		return MACH_O_MAGICS.has(readFileSync(realpathSync(filePath)).subarray(0, 4).toString("hex"));
	} catch {
		return false;
	}
}
function isProvenLocalIMessageCliPath(params) {
	if (params.remoteHost?.trim()) return false;
	const cliPath = params.cliPath.trim();
	const cacheKey = `${cliPath}\0${process.env.PATH ?? ""}`;
	const cached = localCliPathCache.get(cacheKey);
	if (cached !== void 0) return cached;
	const executable = resolveIMessageExecutable(cliPath);
	let local = executable ? isMachOExecutable(executable) : false;
	if (executable && !local) try {
		const match = readFileSync(realpathSync(executable), "utf8").match(/^#![^\r\n]+\r?\n\s*exec\s+(?:"([^"]+)"|'([^']+)'|(\S+))\s+"\$@"\s*$/u);
		const target = match?.[1] ?? match?.[2] ?? match?.[3];
		local = Boolean(target && path.isAbsolute(target) && isMachOExecutable(target));
	} catch {
		local = false;
	}
	localCliPathCache.set(cacheKey, local);
	return local;
}
function isLikelyLocalIMessageCliPath(params) {
	if (params.remoteHost?.trim()) return false;
	const cliPath = params.cliPath.trim();
	if (cliPath === "imsg") return true;
	if (path.basename(cliPath) !== "imsg") return false;
	try {
		return !/\bssh\b[\s\S]*\bimsg\b/u.test(readFileSync(expandIMessageUserPath(cliPath), "utf8"));
	} catch {
		return true;
	}
}
function defaultMessagesDbPath() {
	const home = safeHomeDir();
	return home ? path.join(home, "Library", "Messages", "chat.db") : void 0;
}
function resolveIMessageChatDbLookupPath(params) {
	const configured = params.dbPath?.trim();
	if (configured) return configured;
	if (!isLikelyLocalIMessageCliPath({
		cliPath: params.cliPath,
		remoteHost: params.remoteHost
	})) return;
	return defaultMessagesDbPath();
}
function resolveLocalIMessageChatDbPath(params) {
	if (!isProvenLocalIMessageCliPath({
		cliPath: params.cliPath,
		remoteHost: params.remoteHost
	})) return;
	const configured = params.dbPath?.trim();
	return configured ? expandIMessageUserPath(configured) : defaultMessagesDbPath();
}
//#endregion
export { resolveLocalIMessageChatDbPath as n, resolveIMessageChatDbLookupPath as t };
