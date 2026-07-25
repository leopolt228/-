import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { R as resolveOpenClawAgentSqlitePath, f as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-BZ3-lIlN.js";
import { d as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-pPt31SN9.js";
import { c as deletePreparedSessionTranscriptProjectionChunkInTransaction, l as finalizePreparedSessionTranscriptProjectionInTransaction, o as appendPreparedSessionTranscriptProjectionChunkInTransaction, s as claimPreparedSessionTranscriptProjectionInTransaction, t as deleteOrphanedTranscriptIndexRowsInTransaction } from "./session-transcript-index-CuV_vDJQ.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { randomInt } from "node:crypto";
import path from "node:path";
import { Worker } from "node:worker_threads";
//#region src/config/sessions/session-transcript-reconcile.ts
const log = createSubsystemLogger("sessions/transcript-index");
const PROJECTION_WRITE_CHUNK_ROWS = 512;
const runningReconciles = /* @__PURE__ */ new Map();
function reconcileKey(params) {
	return resolveOpenClawAgentSqlitePath(params);
}
function resolveSessionTranscriptReconcileWorkerUrl(currentModuleUrl = import.meta.url) {
	const currentPath = fileURLToPath(currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		return pathToFileURL(path.join(distRoot, "config", "sessions", "session-transcript-reconcile.worker.js"));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./session-transcript-reconcile.worker${extension}`, currentModuleUrl);
}
function yieldToGateway() {
	return new Promise((resolve) => {
		setImmediate(resolve);
	});
}
function nextProjectionClaimId() {
	return -randomInt(1, 2 ** 47);
}
function normalizeReconcileError(error) {
	return error instanceof Error ? error : new Error(String(error));
}
function continueProjectionWorker(worker, accepted) {
	worker.postMessage({
		accepted,
		type: "continue"
	}, []);
}
async function runProjectionWrite(databaseOptions, operationLabel, operation) {
	return await runExclusiveSqliteSessionWrite(databaseOptions, async () => runOpenClawAgentWriteTransaction(operation, databaseOptions, { operationLabel }));
}
async function claimPreparedSessionTranscriptProjection(databaseOptions, plan) {
	const claimId = nextProjectionClaimId();
	if (!await runProjectionWrite(databaseOptions, "sessions.transcript-index.claim", (database) => claimPreparedSessionTranscriptProjectionInTransaction(database.db, plan, claimId))) return;
	let deleteResult = {
		hasMore: true,
		owned: true
	};
	while (deleteResult.hasMore && deleteResult.owned) {
		deleteResult = await runProjectionWrite(databaseOptions, "sessions.transcript-index.delete-chunk", (database) => deletePreparedSessionTranscriptProjectionChunkInTransaction(database.db, {
			maxRowsPerTable: PROJECTION_WRITE_CHUNK_ROWS,
			sessionId: plan.sessionId,
			claimId
		}));
		await yieldToGateway();
	}
	if (!deleteResult.owned) return;
	return {
		claimId,
		plan
	};
}
function decodeFtsChunk(chunk) {
	const decoder = new TextDecoder();
	return chunk.rows.map((row) => ({
		messageId: row.messageId,
		role: row.role,
		text: decoder.decode(chunk.textBytes.subarray(row.textByteOffset, row.textByteOffset + row.textByteLength)),
		timestamp: row.timestamp
	}));
}
async function appendPreparedProjectionChunk(databaseOptions, active, rows) {
	const owned = await runProjectionWrite(databaseOptions, "activeRows" in rows ? "sessions.transcript-index.active-chunk" : "sessions.transcript-index.fts-chunk", (database) => appendPreparedSessionTranscriptProjectionChunkInTransaction(database.db, {
		...rows,
		claimId: active.claimId,
		sessionId: active.plan.sessionId
	}));
	await yieldToGateway();
	return owned;
}
async function finalizePreparedProjection(databaseOptions, active) {
	return await runProjectionWrite(databaseOptions, "sessions.transcript-index.finalize", (database) => finalizePreparedSessionTranscriptProjectionInTransaction(database.db, active.plan, active.claimId));
}
/** Prepares full trees off-thread, then commits bounded chunks through the runtime writer owner. */
function reconcileSessionTranscriptIndexes(params) {
	const databasePath = resolveOpenClawAgentSqlitePath(params);
	const databaseOptions = {
		agentId: params.agentId,
		...params.env ? { env: params.env } : {},
		path: databasePath
	};
	const workerUrl = resolveSessionTranscriptReconcileWorkerUrl();
	const sourceWorkerExecArgv = workerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0;
	const input = {
		agentId: params.agentId,
		path: databasePath,
		...params.preferredSessionId ? { preferredSessionId: params.preferredSessionId } : {}
	};
	let worker;
	try {
		worker = new Worker(workerUrl, {
			workerData: input,
			execArgv: sourceWorkerExecArgv
		});
	} catch (error) {
		return Promise.reject(normalizeReconcileError(error));
	}
	return new Promise((resolve, reject) => {
		let active;
		let doneReceived = false;
		let reconciledSessions = 0;
		let settled = false;
		const settle = (finish, terminate) => {
			if (settled) return;
			settled = true;
			worker.removeAllListeners();
			if (terminate) worker.terminate();
			finish();
		};
		const handleMessage = async (message) => {
			if (message.type === "failed") {
				settle(() => reject(new Error(message.error)), false);
				return;
			}
			if (message.type === "done") {
				doneReceived = true;
				if (active) {
					settle(() => reject(/* @__PURE__ */ new Error("session transcript reconcile worker ended mid-plan")), true);
					return;
				}
				try {
					await runProjectionWrite(databaseOptions, "sessions.transcript-index.orphan-sweep", (database) => deleteOrphanedTranscriptIndexRowsInTransaction(database.db));
				} catch (error) {
					settle(() => reject(normalizeReconcileError(error)), true);
					return;
				}
				settle(() => resolve({ reconciledSessions }), false);
				return;
			}
			try {
				if (message.type === "plan-start") {
					if (active) throw new Error("session transcript reconcile worker started overlapping plans");
					active = await claimPreparedSessionTranscriptProjection(databaseOptions, message.plan);
					continueProjectionWorker(worker, active !== void 0);
					return;
				}
				if (!active || active.plan.sessionId !== message.sessionId) throw new Error("session transcript reconcile worker sent a chunk for no active plan");
				if (message.type === "plan-finish") {
					const finalized = await finalizePreparedProjection(databaseOptions, active);
					active = void 0;
					if (finalized) reconciledSessions += 1;
					continueProjectionWorker(worker, finalized);
					return;
				}
				const owned = await appendPreparedProjectionChunk(databaseOptions, active, message.type === "active-chunk" ? { activeRows: message.rows } : { ftsRows: decodeFtsChunk(message.chunk) });
				if (!owned) active = void 0;
				continueProjectionWorker(worker, owned);
			} catch (error) {
				settle(() => reject(normalizeReconcileError(error)), true);
			}
		};
		worker.on("message", (message) => {
			handleMessage(message);
		});
		worker.once("error", (error) => {
			settle(() => reject(normalizeReconcileError(error)), true);
		});
		worker.once("exit", (code) => {
			if (doneReceived && code === 0) return;
			settle(() => reject(/* @__PURE__ */ new Error(`session transcript reconcile worker exited with code ${code}`)), false);
		});
	});
}
/** Starts one deferred reconcile. No transcript rows are read on the caller's stack. */
function startSessionTranscriptIndexReconcile(params) {
	const key = reconcileKey(params);
	const running = runningReconciles.get(key);
	if (running) {
		running.pending = true;
		running.preferredSessionId ??= params.preferredSessionId;
		return;
	}
	const state = {
		pending: false,
		...params.preferredSessionId ? { preferredSessionId: params.preferredSessionId } : {}
	};
	state.promise = yieldToGateway().then(async () => {
		let reconciledSessions = 0;
		while (true) {
			state.pending = false;
			const preferredSessionId = state.preferredSessionId;
			delete state.preferredSessionId;
			const result = await reconcileSessionTranscriptIndexes({
				...params,
				...preferredSessionId ? { preferredSessionId } : {}
			});
			reconciledSessions += result.reconciledSessions;
			if (state.pending) continue;
			if (runningReconciles.get(key) === state) runningReconciles.delete(key);
			return { reconciledSessions };
		}
	}).catch(async (error) => {
		log.warn(`session transcript reconcile failed agent=${params.agentId} error=${error instanceof Error ? error.message : String(error)}`);
		const shouldHandoff = state.pending;
		const preferredSessionId = state.preferredSessionId;
		if (runningReconciles.get(key) === state) runningReconciles.delete(key);
		if (shouldHandoff) {
			startSessionTranscriptIndexReconcile({
				...params,
				...preferredSessionId ? { preferredSessionId } : {}
			});
			await waitForSessionTranscriptIndexReconcile(params);
		}
		return { reconciledSessions: 0 };
	});
	runningReconciles.set(key, state);
}
function isSessionTranscriptIndexReconcileRunning(params) {
	return runningReconciles.has(reconcileKey(params));
}
/** Test and maintenance wait hook for an already-scheduled reconcile. */
async function waitForSessionTranscriptIndexReconcile(params) {
	await runningReconciles.get(reconcileKey(params))?.promise;
}
//#endregion
export { waitForSessionTranscriptIndexReconcile as i, reconcileSessionTranscriptIndexes as n, startSessionTranscriptIndexReconcile as r, isSessionTranscriptIndexReconcileRunning as t };
