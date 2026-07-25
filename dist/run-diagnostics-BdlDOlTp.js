import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { c as redactSensitiveText } from "./redact-DNq_HeDt.js";
import { B as formatUnknownError, G as tailText, H as normalizeCronRunDiagnostics$1, U as normalizeExitCode, V as isRecord, W as normalizeToolName } from "./openclaw-state-db-DkOMT2fb.js";
import { a as getReplyPayloadMetadata } from "./reply-payload-BtIUrr9c.js";
import { m as normalizeToolName$1 } from "./tool-policy-GYMCyycR.js";
import { n as isToolAllowedByPolicyName } from "./tool-policy-match-gf5E9Psx.js";
//#region src/cron/run-diagnostics.ts
/** Builds bounded, redacted diagnostics for cron run logs and UI surfaces. */
const MAX_SUMMARY_CHARS = 2e3;
const EXEC_DIAGNOSTIC_TAIL_CHARS = 2e3;
const WEB_SEARCH_TOOL_NAME = "web_search";
const MISSING_WEB_SEARCH_PROVIDER_DIAGNOSTIC_MESSAGE = "web_search tool requested in toolsAllow but no web search provider is selected. Configure one with: openclaw configure --section web, or set tools.web.search.provider.";
function toolsAllowRequestsWebSearch(toolsAllow) {
	const explicitAllow = (toolsAllow ?? []).filter((entry) => normalizeToolName$1(entry) !== "*");
	return explicitAllow.length > 0 && isToolAllowedByPolicyName(WEB_SEARCH_TOOL_NAME, { allow: explicitAllow });
}
function trimSummary(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	if (normalized.length <= MAX_SUMMARY_CHARS) return normalized;
	return `${truncateUtf16Safe(normalized, MAX_SUMMARY_CHARS - 1)}…`;
}
/** Returns the operator-facing summary for persisted cron diagnostics. */
function summarizeCronRunDiagnostics(diagnostics) {
	if (!diagnostics) return;
	return trimSummary(diagnostics.summary ?? diagnostics.entries[0]?.message);
}
/** Normalizes untrusted cron diagnostic payloads into bounded, redacted entries. */
function normalizeCronRunDiagnostics(value, opts) {
	return normalizeCronRunDiagnostics$1(value, {
		...opts,
		redactText: (text) => redactSensitiveText(text, { mode: "tools" })
	});
}
/** Merges cron diagnostics while choosing the highest-severity latest summary. */
function mergeCronRunDiagnostics(...values) {
	const entries = [];
	let summaryCandidate;
	for (const value of values) {
		const normalized = normalizeCronRunDiagnostics(value);
		if (!normalized) continue;
		const entryCandidate = normalized.entries.findLast((entry) => entry.severity === "error") ?? normalized.entries.findLast((entry) => entry.severity === "warn") ?? normalized.entries.findLast((entry) => entry.severity === "info");
		const summary = trimSummary(normalized.summary ?? entryCandidate?.message);
		if (summary) {
			const severity = entryCandidate?.severity === "error" ? 2 : entryCandidate?.severity === "warn" ? 1 : 0;
			const order = entries.length + normalized.entries.length;
			if (!summaryCandidate || severity > summaryCandidate.severity || severity === summaryCandidate.severity && order >= summaryCandidate.order) summaryCandidate = {
				summary,
				severity,
				order
			};
		}
		entries.push(...normalized.entries);
	}
	return normalizeCronRunDiagnostics({
		summary: summaryCandidate?.summary,
		entries
	});
}
/** Converts an arbitrary thrown cron error into a redacted diagnostic entry. */
function createCronRunDiagnosticsFromError(source, error, opts) {
	const message = formatUnknownError(error);
	return normalizeCronRunDiagnostics({
		summary: message,
		entries: [{
			ts: opts?.nowMs?.() ?? Date.now(),
			source,
			severity: opts?.severity ?? "error",
			message,
			toolName: opts?.toolName,
			exitCode: opts?.exitCode
		}]
	}, opts);
}
/** Reports a cron preflight warning for an explicitly allowed web_search with no provider. */
function createCronRunDiagnosticsFromMissingWebSearchProvider(params) {
	if (params.hasWebSearchProvider || !params.toolsAllow || params.toolsAllow.length === 0) return;
	if (!toolsAllowRequestsWebSearch(params.toolsAllow)) return;
	return normalizeCronRunDiagnostics({
		summary: MISSING_WEB_SEARCH_PROVIDER_DIAGNOSTIC_MESSAGE,
		entries: [{
			ts: params.nowMs?.() ?? Date.now(),
			source: "cron-preflight",
			severity: "warn",
			message: MISSING_WEB_SEARCH_PROVIDER_DIAGNOSTIC_MESSAGE,
			toolName: WEB_SEARCH_TOOL_NAME
		}]
	}, { nowMs: params.nowMs });
}
/** Extracts failed exec details from tool metadata into cron diagnostics. */
function createCronRunDiagnosticsFromExecDetails(details, opts) {
	if (!isRecord(details)) return;
	const status = typeof details.status === "string" ? details.status : void 0;
	const exitCode = normalizeExitCode(details.exitCode);
	if (!(status === "failed" || typeof exitCode === "number" && exitCode !== 0)) return;
	const aggregated = normalizeOptionalString(details.aggregated);
	const message = aggregated ? tailText(aggregated, EXEC_DIAGNOSTIC_TAIL_CHARS) : typeof exitCode === "number" ? `exec failed with exit code ${exitCode}` : "exec failed";
	return normalizeCronRunDiagnostics({
		summary: message,
		entries: [{
			ts: opts?.nowMs?.() ?? Date.now(),
			source: "exec",
			severity: opts?.finalStatus === "ok" ? "warn" : status === "failed" ? "error" : "warn",
			message,
			toolName: opts?.toolName,
			exitCode
		}]
	}, opts);
}
/** Extracts tool-call failure diagnostics from an agent reply payload. */
function createCronRunDiagnosticsFromToolPayload(payload, opts) {
	if (!isRecord(payload)) return;
	const toolName = normalizeToolName(payload.toolName) ?? normalizeToolName(payload.name);
	const detailsDiagnostics = createCronRunDiagnosticsFromExecDetails(payload.details, {
		nowMs: opts?.nowMs,
		toolName,
		finalStatus: opts?.finalStatus
	});
	const isError = payload.isError === true;
	const text = typeof payload.text === "string" ? payload.text : void 0;
	const isNonTerminalToolWarning = opts?.finalStatus === "ok" && getReplyPayloadMetadata(payload)?.nonTerminalToolErrorWarning === true;
	return mergeCronRunDiagnostics(detailsDiagnostics, isError && text ? createCronRunDiagnosticsFromError("tool", text, {
		severity: isNonTerminalToolWarning || opts?.finalStatus === "ok" ? "warn" : "error",
		nowMs: opts?.nowMs,
		toolName
	}) : void 0);
}
/** Extracts cron run diagnostics from agent result payloads and metadata. */
function createCronRunDiagnosticsFromAgentResult(result, opts) {
	const record = isRecord(result) ? result : {};
	const meta = record.meta && typeof record.meta === "object" ? record.meta : {};
	const diagnostics = [];
	const payloads = Array.isArray(record.payloads) ? record.payloads : [];
	for (const payload of payloads) diagnostics.push(createCronRunDiagnosticsFromToolPayload(payload, opts));
	const metaError = meta.error && typeof meta.error === "object" ? meta.error : void 0;
	if (typeof metaError?.message === "string") diagnostics.push(createCronRunDiagnosticsFromError("agent-run", metaError.message, opts));
	const failureSignal = meta.failureSignal && typeof meta.failureSignal === "object" ? meta.failureSignal : void 0;
	if (typeof failureSignal?.message === "string") diagnostics.push(createCronRunDiagnosticsFromError("tool", failureSignal.message, opts));
	return mergeCronRunDiagnostics(...diagnostics);
}
//#endregion
export { normalizeCronRunDiagnostics as a, mergeCronRunDiagnostics as i, createCronRunDiagnosticsFromError as n, summarizeCronRunDiagnostics as o, createCronRunDiagnosticsFromMissingWebSearchProvider as r, toolsAllowRequestsWebSearch as s, createCronRunDiagnosticsFromAgentResult as t };
