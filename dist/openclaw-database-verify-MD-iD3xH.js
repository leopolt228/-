import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { E as recordOpenClawDatabaseQuarantine, O as resolveOpenClawStateSqlitePath, o as recordOpenClawStateDatabaseOpenFailure } from "./openclaw-state-db-DkOMT2fb.js";
import { P as listOpenClawRegisteredAgentDatabases, d as recordOpenClawAgentDatabaseOpenFailure } from "./openclaw-agent-db-BZ3-lIlN.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";
import { Worker } from "node:worker_threads";
//#region src/state/openclaw-database-verify.impl.ts
const OPENCLAW_DATABASE_VERIFY_INITIAL_DELAY_MS = 5 * 6e4;
const OPENCLAW_DATABASE_VERIFY_INTERVAL_MS = 1440 * 6e4;
const log$1 = createSubsystemLogger("state/database-verify");
function toError(error) {
	return error instanceof Error ? error : new Error(String(error));
}
function resolveDatabaseVerifyWorkerUrl(currentModuleUrl = import.meta.url) {
	const currentPath = fileURLToPath(currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		return pathToFileURL(path.join(distRoot, "state", "openclaw-database-verify.worker.js"));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./openclaw-database-verify.worker${extension}`, currentModuleUrl);
}
function isVerifyResult(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const result = value;
	return typeof result.path === "string" && typeof result.ok === "boolean" && (result.error === void 0 || typeof result.error === "string") && (result.terminal === void 0 || typeof result.terminal === "boolean");
}
function runDatabaseVerifyWorker(targets, options = {}) {
	const workerUrl = options.workerUrl ?? resolveDatabaseVerifyWorkerUrl();
	const execArgv = workerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0;
	let worker;
	try {
		worker = new Worker(workerUrl, {
			workerData: targets,
			execArgv
		});
	} catch (error) {
		return Promise.reject(toError(error));
	}
	options.onWorker?.(worker);
	return new Promise((resolve, reject) => {
		let settled = false;
		const settle = (finish) => {
			if (settled) return;
			settled = true;
			worker.removeAllListeners();
			options.onWorker?.(void 0);
			finish();
		};
		worker.once("message", (message) => {
			settle(() => {
				if (!Array.isArray(message) || !message.every(isVerifyResult)) {
					reject(/* @__PURE__ */ new Error("database verification worker returned invalid results"));
					return;
				}
				resolve(message);
			});
		});
		worker.once("error", (error) => settle(() => reject(toError(error))));
		worker.once("exit", (code) => {
			if (code !== 0) settle(() => reject(/* @__PURE__ */ new Error(`database verification worker exited with code ${code}`)));
			else settle(() => reject(/* @__PURE__ */ new Error("database verification worker exited without results")));
		});
	});
}
/** Resolve the state database and current registered agent database paths. */
function collectOpenClawDatabaseVerifyTargets(options) {
	const targets = /* @__PURE__ */ new Map();
	const statePath = path.resolve(resolveOpenClawStateSqlitePath(options.env));
	if (existsSync(statePath)) targets.set(statePath, {
		kind: "state",
		label: "OpenClaw state database",
		path: statePath
	});
	let registeredDatabases = [];
	try {
		registeredDatabases = listOpenClawRegisteredAgentDatabases({ env: options.env });
	} catch (error) {
		log$1.warn("failed to collect registered agent databases for integrity verification", { error: String(error) });
	}
	for (const registered of registeredDatabases) {
		const agentPath = path.resolve(registered.path);
		if (!existsSync(agentPath) || targets.has(agentPath)) continue;
		targets.set(agentPath, {
			kind: "agent",
			label: `OpenClaw agent database ${registered.agentId}`,
			path: agentPath
		});
	}
	return [...targets.values()];
}
function createVerificationFailure(result) {
	const error = new Error(result.error ?? `SQLite integrity verification failed for ${result.path}`);
	error.name = "SqliteIntegrityError";
	return error;
}
/** Quarantine terminal failures and log the worker batch. */
function applyOpenClawDatabaseVerificationResults(options) {
	const targetByPath = new Map(options.targets.map((target) => [target.path, target]));
	for (const result of options.results) {
		const target = targetByPath.get(result.path);
		if (!target) continue;
		if (result.ok) {
			log$1.info("database integrity verification passed", {
				kind: target.kind,
				label: target.label,
				path: result.path
			});
			continue;
		}
		if (!result.terminal) {
			log$1.warn("database integrity verification was inconclusive", {
				kind: target.kind,
				label: target.label,
				path: result.path,
				error: result.error
			});
			continue;
		}
		if (!recordOpenClawDatabaseQuarantine({
			env: options.env,
			kind: target.kind,
			path: result.path,
			reason: result.error ?? `SQLite integrity verification failed for ${result.path}`
		})) log$1.error("failed to persist database quarantine; quarantine is process-local", {
			kind: target.kind,
			path: result.path
		});
		const error = createVerificationFailure(result);
		if (target.kind === "state") recordOpenClawStateDatabaseOpenFailure(result.path, error);
		else recordOpenClawAgentDatabaseOpenFailure(result.path, error);
		log$1.error("database integrity verification failed", {
			kind: target.kind,
			label: target.label,
			path: result.path,
			error: error.message
		});
	}
}
//#endregion
//#region src/state/openclaw-database-verify.ts
const log = createSubsystemLogger("state/database-verify");
/** Start the Gateway-owned delayed daily integrity verifier. */
function startOpenClawDatabaseIntegrityVerifier(options) {
	let activeWorker;
	let stopped = false;
	let timer;
	const schedule = (delayMs) => {
		timer = setTimeout(() => void run(), delayMs);
		timer.unref?.();
	};
	const run = async () => {
		timer = void 0;
		try {
			const targets = collectOpenClawDatabaseVerifyTargets(options);
			if (targets.length > 0) {
				const results = await runDatabaseVerifyWorker(targets, { onWorker: (worker) => {
					activeWorker = worker;
				} });
				if (!stopped) applyOpenClawDatabaseVerificationResults({
					...options,
					results,
					targets
				});
			}
		} catch (error) {
			if (!stopped) log.error("database integrity verifier failed", { error: String(error) });
		} finally {
			activeWorker = void 0;
			if (!stopped) schedule(OPENCLAW_DATABASE_VERIFY_INTERVAL_MS);
		}
	};
	schedule(OPENCLAW_DATABASE_VERIFY_INITIAL_DELAY_MS);
	return { stop: async () => {
		stopped = true;
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
		await activeWorker?.terminate();
		activeWorker = void 0;
	} };
}
//#endregion
export { startOpenClawDatabaseIntegrityVerifier };
