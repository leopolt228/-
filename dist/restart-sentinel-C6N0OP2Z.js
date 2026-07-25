import { n as sliceUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { s as resolveRuntimeServiceVersion } from "./version-CeFj_iGk.js";
import { a as openOpenClawStateDatabase, c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-DkOMT2fb.js";
import { a as writeRestartSentinelRowSync, i as writeRestartSentinelRowIfRevisionSync, r as readRestartSentinelRowSync, t as deleteRestartSentinelRowSync } from "./restart-sentinel-store-B0gifhyi.js";
//#region src/infra/restart-sentinel.ts
const sentinelLog = createSubsystemLogger("restart-sentinel");
function formatDoctorNonInteractiveHint(env = process.env) {
	return `Recommended follow-up: run ${formatCliCommand("openclaw doctor --non-interactive", env)} in a terminal or approvals-capable OpenClaw surface.`;
}
async function writeRestartSentinel(payload, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => writeRestartSentinelRowSync(db, payload), { env }, { operationLabel: "restart-sentinel.write" });
}
function cloneRestartSentinelPayload(payload) {
	return structuredClone(payload);
}
async function rewriteRestartSentinel(rewrite, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const current = readRestartSentinelRowSync(db);
		if (current.kind !== "valid") return null;
		const nextPayload = rewrite(cloneRestartSentinelPayload(current.sentinel.payload));
		return nextPayload ? writeRestartSentinelRowIfRevisionSync(db, nextPayload, current.sentinel.revision) : null;
	}, { env }, { operationLabel: "restart-sentinel.rewrite-current" });
}
async function finalizeUpdateRestartSentinelRunningVersion(version = resolveRuntimeServiceVersion(process.env), env = process.env) {
	return await rewriteRestartSentinel((payload) => {
		if (payload.kind !== "update") return null;
		const stats = payload.stats ? { ...payload.stats } : {};
		const after = isRecord(stats.after) ? { ...stats.after } : {};
		if (after.version === version) return null;
		after.version = version;
		stats.after = after;
		return {
			...payload,
			stats
		};
	}, env);
}
async function markUpdateRestartSentinelFailure(reason, env = process.env) {
	return await rewriteRestartSentinel((payload) => {
		if (payload.kind !== "update") return null;
		const payloadWithoutContinuation = { ...payload };
		delete payloadWithoutContinuation.continuation;
		const stats = payload.stats ? { ...payload.stats } : {};
		stats.reason = reason;
		return {
			...payloadWithoutContinuation,
			status: "error",
			stats
		};
	}, env);
}
async function clearRestartSentinel(env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => deleteRestartSentinelRowSync(db), { env }, { operationLabel: "restart-sentinel.clear" });
}
async function clearRestartSentinelIfRevision(expectedRevision, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => deleteRestartSentinelRowSync(db, expectedRevision), { env }, { operationLabel: "restart-sentinel.clear-if-revision" });
}
function buildRestartSuccessContinuation(params) {
	const message = params.continuationMessage?.trim();
	if (message) return {
		kind: "agentTurn",
		message
	};
	return null;
}
async function readRestartSentinel(env = process.env) {
	try {
		const current = readRestartSentinelRowSync(openOpenClawStateDatabase({ env }).db);
		if (current.kind === "invalid") {
			sentinelLog.warn("Ignoring invalid typed restart sentinel row");
			return null;
		}
		return current.kind === "valid" ? current.sentinel : null;
	} catch (err) {
		sentinelLog.warn(`Failed to read restart sentinel: ${formatErrorMessage(err)}`);
		return null;
	}
}
async function hasRestartSentinel(env = process.env) {
	try {
		const current = readRestartSentinelRowSync(openOpenClawStateDatabase({ env }).db);
		if (current.kind === "invalid") {
			sentinelLog.warn("Ignoring invalid typed restart sentinel row");
			return false;
		}
		return current.kind === "valid";
	} catch (err) {
		sentinelLog.warn(`Failed to check restart sentinel: ${formatErrorMessage(err)}`);
		return false;
	}
}
function formatRestartSentinelMessage(payload) {
	const message = payload.message?.trim();
	if (message && (!payload.stats || payload.kind === "config-auto-recovery")) return message;
	const lines = [summarizeRestartSentinel(payload)];
	if (message) lines.push(message);
	const reason = payload.stats?.reason?.trim();
	if (reason && reason !== message) lines.push(`Reason: ${reason}`);
	if (payload.doctorHint?.trim()) lines.push(payload.doctorHint.trim());
	return lines.join("\n");
}
function isRestartRequiredConfigWriteSentinel(payload) {
	return (payload.kind === "config-apply" || payload.kind === "config-patch") && payload.status === "ok" && payload.stats?.requiresRestart === true;
}
function summarizeRestartSentinel(payload) {
	if (payload.kind === "config-auto-recovery") return "Gateway auto-recovery";
	if (isRestartRequiredConfigWriteSentinel(payload)) return `Gateway restart required${payload.stats?.mode ? ` (${payload.stats.mode})` : ""}`.trim();
	const kind = payload.kind;
	const status = payload.status;
	const mode = payload.stats?.mode ? ` (${payload.stats.mode})` : "";
	return `Gateway restart${kind === "restart" ? "" : ` ${kind}`} ${status}${mode}`.trim();
}
function trimLogTail(input, maxChars = 8e3) {
	if (!input) return null;
	const text = input.trimEnd();
	if (text.length <= maxChars) return text;
	return `…${sliceUtf16Safe(text, text.length - maxChars)}`;
}
//#endregion
export { formatDoctorNonInteractiveHint as a, markUpdateRestartSentinelFailure as c, trimLogTail as d, writeRestartSentinel as f, finalizeUpdateRestartSentinelRunningVersion as i, readRestartSentinel as l, clearRestartSentinel as n, formatRestartSentinelMessage as o, clearRestartSentinelIfRevision as r, hasRestartSentinel as s, buildRestartSuccessContinuation as t, summarizeRestartSentinel as u };
