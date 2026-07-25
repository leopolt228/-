import fs from "node:fs";
//#region node_modules/@openclaw/fs-safe/dist/temp-cleanup.js
const tempCleanupEntries = /* @__PURE__ */ new Map();
let cleanupRegistered = false;
function cleanupRegisteredTempPathsSync() {
	for (const entry of tempCleanupEntries.values()) try {
		fs.rmSync(entry.path, {
			force: true,
			recursive: entry.recursive
		});
	} catch {}
	tempCleanupEntries.clear();
}
function registerTempPathForExit(tempPath, options) {
	if (!cleanupRegistered) {
		cleanupRegistered = true;
		process.once("exit", cleanupRegisteredTempPathsSync);
	}
	tempCleanupEntries.set(tempPath, {
		path: tempPath,
		recursive: options?.recursive === true
	});
	return () => {
		tempCleanupEntries.delete(tempPath);
	};
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/write-queue.js
const writeQueues = /* @__PURE__ */ new Map();
async function serializePathWrite(key, run) {
	const previous = writeQueues.get(key) ?? Promise.resolve();
	const task = (async () => {
		await previous.catch(() => void 0);
		return await run();
	})();
	const done = task.then(() => void 0, () => void 0);
	writeQueues.set(key, done);
	try {
		return await task;
	} finally {
		if (writeQueues.get(key) === done) writeQueues.delete(key);
	}
}
//#endregion
export { registerTempPathForExit as n, serializePathWrite as t };
