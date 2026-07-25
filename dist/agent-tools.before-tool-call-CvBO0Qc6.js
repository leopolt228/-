import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { a as createLazyRuntimeSurface } from "./lazy-runtime-B-Fc-m0I.js";
import { a as addTimerTimeoutGraceMs } from "./number-coercion-Crk_c9KW.js";
import { n as asNullableRecord } from "./record-coerce-DHZ4bFlT.js";
import { l as redactToolDetail } from "./redact-DNq_HeDt.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { T as freezeDiagnosticTraceContext, _ as onTrustedToolExecutionEvent, c as emitTrustedSecurityEvent, g as onTrustedInternalDiagnosticEvent, l as emitTrustedSkillUsedDiagnosticEvent, o as emitTrustedDiagnosticEvent, s as emitTrustedDiagnosticEventWithPrivateData, x as createChildDiagnosticTraceContext } from "./diagnostic-events-Dt41CZkD.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { g as isPlainObject } from "./utils-K2PjeLaV.js";
import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import "./config-BOMcY2yX.js";
import "./client-DpNJQtBd.js";
import { n as GatewayClientRequestError } from "./client-U9ekE9wL.js";
import { f as runOpenClawAgentWriteTransaction, u as openOpenClawAgentDatabase } from "./openclaw-agent-db-BZ3-lIlN.js";
import { x as getPluginSessionExtensionStateSync } from "./registry-BSBtFA2q.js";
import { c as getActivePluginRegistry } from "./runtime-BapEso0o.js";
import { d as getGlobalHookRunnerRegistry, t as getGlobalHookRunner } from "./hook-runner-global-C6QB2pJa.js";
import { i as resolveSandboxInputPath } from "./sandbox-paths-DEm0iftP.js";
import { jt as upsertSessionEntry, w as appendTranscriptMessage, yt as loadSessionEntry } from "./session-accessor-Mu3lv_Tl.js";
import { c as PluginApprovalResolutions } from "./types-BBjFssGr.js";
import { I as canonicalizePath } from "./curator-C_Aa3T0x.js";
import { n as resolveSkillTelemetrySource, r as resolveSkillTelemetrySourceValue } from "./source-9Jdpd6BI.js";
import { m as normalizeToolName } from "./tool-policy-GYMCyycR.js";
import { c as resolveAgentRunAbortLifecycleFields } from "./run-termination-BQ_P-sPi.js";
import { a as getCodeModeExecBeforeHookMetadataForToolKind, d as reconcileCodeModeExecBeforeHookParams, i as getCodeModeExecBeforeHookMetadata, l as normalizeCodeModeExecBeforeHookParams, u as normalizeCodeModeExecBeforeHookParamsForToolKind } from "./code-mode-control-tools-Byyzl1H3.js";
import { i as getPluginToolMeta, n as copyPluginToolMeta } from "./tools-DzbN4AH5.js";
import { i as diagnosticHttpStatusCode, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-CxJn_BAC.js";
import { n as resolveDiagnosticModelContentCapturePolicy, t as cloneDiagnosticContentValue } from "./diagnostic-llm-content-CU_-DTjY.js";
import { n as DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS, r as MAX_PLUGIN_APPROVAL_TIMEOUT_MS } from "./plugin-approvals-D2muXfhg.js";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-B7vhht0w.js";
import { i as resolveApprovalInitiatingSurfaceState, n as describeNativePluginApprovalClientSetup } from "./exec-approval-surface-BeBSG2sP.js";
import { t as resolveSkillWorkshopConfig } from "./config-1Nbesoes.js";
import { p as resolvePendingSkillProposal } from "./service-4WfHAV4N.js";
import { t as buildToolMutationState } from "./tool-mutation-D2Iez_1l.js";
import { t as buildOutboundSessionContext } from "./session-context-Cq_Z7k0n.js";
import { t as resolveSessionDeliveryTarget } from "./targets-session-CmHRr4hB.js";
import { i as normalizeFileToolPathParam } from "./agent-tools.params-BZyOAvBo.js";
import { S as BEFORE_TOOL_CALL_WRAPPED, _ as copyChannelAgentToolMeta, b as BEFORE_TOOL_CALL_HOOK_CONTEXT, c as copyToolTerminalPresentation, l as getToolTerminalPresentation, t as callGatewayTool, v as getChannelAgentToolMeta, x as BEFORE_TOOL_CALL_SOURCE_TOOL, y as BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS } from "./gateway-wQ1RjFk5.js";
import { a as resolveToolExecutionErrorKind, o as resolveToolResultFailureKind, t as formatToolExecutionErrorMessage } from "./tool-result-error-W5qOAoXI.js";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import os from "node:os";
//#region src/infra/embedded-mode.ts
let embeddedModeValue = false;
/** Sets the process-local embedded-mode flag used by UI and hosted runtimes. */
function setEmbeddedMode(value) {
	embeddedModeValue = value;
}
/** Returns whether the current process is running inside an embedded OpenClaw host. */
function isEmbeddedMode() {
	return embeddedModeValue;
}
//#endregion
//#region src/infra/embedded-plugin-approval-broker.ts
let activeBroker = null;
var EmbeddedPluginApprovalBroker = class {
	constructor() {
		this.pending = /* @__PURE__ */ new Map();
		this.listeners = /* @__PURE__ */ new Set();
	}
	subscribe(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
	listPending() {
		return [...this.pending.values()].map((entry) => entry.record);
	}
	async request(params) {
		if (params.signal?.aborted) throw params.signal.reason ?? /* @__PURE__ */ new Error("approval request aborted");
		const id = `plugin:${randomUUID()}`;
		const createdAtMs = Date.now();
		const record = {
			id,
			request: params.request,
			createdAtMs,
			expiresAtMs: createdAtMs + params.timeoutMs
		};
		let resolve;
		let reject;
		const decision = new Promise((resolvePromise, rejectPromise) => {
			resolve = resolvePromise;
			reject = rejectPromise;
		});
		const timer = setTimeout(() => {
			const entry = this.pending.get(id);
			if (!entry) return;
			this.pending.delete(id);
			entry.resolve(null);
			this.emit({
				event: "plugin.approval.removed",
				payload: { id }
			});
		}, params.timeoutMs);
		timer.unref?.();
		this.pending.set(id, {
			record,
			timer,
			resolve,
			reject
		});
		const abort = () => {
			const entry = this.pending.get(id);
			if (!entry) return;
			clearTimeout(entry.timer);
			this.pending.delete(id);
			entry.reject(params.signal?.reason ?? /* @__PURE__ */ new Error("approval request aborted"));
			this.emit({
				event: "plugin.approval.removed",
				payload: { id }
			});
		};
		params.signal?.addEventListener("abort", abort, { once: true });
		this.emit({
			event: "plugin.approval.requested",
			payload: record
		});
		try {
			return {
				id,
				decision: await decision
			};
		} finally {
			params.signal?.removeEventListener("abort", abort);
		}
	}
	resolve(id, decision) {
		const entry = this.pending.get(id);
		if (!entry || !resolveCanonicalPluginApprovalRequestAllowedDecisions(entry.record.request).includes(decision)) return false;
		clearTimeout(entry.timer);
		this.pending.delete(id);
		entry.resolve(decision);
		this.emit({
			event: "plugin.approval.resolved",
			payload: {
				id,
				decision,
				resolvedBy: "tui:embedded",
				ts: Date.now(),
				request: entry.record.request
			}
		});
		return true;
	}
	stop(reason = /* @__PURE__ */ new Error("embedded plugin approval broker stopped")) {
		for (const [id, entry] of this.pending) {
			clearTimeout(entry.timer);
			entry.reject(reason);
			this.emit({
				event: "plugin.approval.removed",
				payload: { id }
			});
		}
		this.pending.clear();
		this.listeners.clear();
	}
	emit(event) {
		for (const listener of this.listeners) listener(event);
	}
};
function setEmbeddedPluginApprovalBroker(broker) {
	activeBroker = broker;
}
function clearEmbeddedPluginApprovalBroker(broker) {
	if (activeBroker === broker) activeBroker = null;
}
function getEmbeddedPluginApprovalBroker() {
	return activeBroker;
}
//#endregion
//#region src/agents/apply-patch-paths.ts
/**
* Path extraction for the apply_patch envelope grammar.
* Used by pre-execution policy hooks that only need destination paths, not the
* full strict patch parser.
*/
/**
* Lightweight path extractor for the `apply_patch` envelope grammar.
*
* The full parser in `apply-patch.ts` validates and applies a patch end-to-end.
* Plugins running inside `before_tool_call` only need the destination paths so
* they can compute path policy decisions before the patch is applied. This
* helper walks the input lines and collects every path mentioned by:
*
*   - `*** Add File: <path>`
*   - `*** Update File: <path>`         (and the optional `*** Move to: <new>`
*                                         sub-marker that immediately follows)
*   - `*** Delete File: <path>`
*
* Unlike the strict parser, this helper is forgiving: it does not require the
* `*** Begin Patch` / `*** End Patch` envelope, it ignores non-marker lines
* while scanning the full input, and it may therefore still pick up marker-like
* lines that appear later in malformed input. Top-level hunk headers are matched
* after trimming leading whitespace, like the executor parser; marker-like patch
* body lines remain ignored while scanning an update hunk. Empty paths are dropped.
*
* The shape of the input mirrors how `apply_patch` receives it: either a
* string (the full patch text) or an object with an `input` field carrying the
* patch text. Anything else returns an empty array.
*/
const ADD_FILE_MARKER = "*** Add File: ";
const DELETE_FILE_MARKER = "*** Delete File: ";
const UPDATE_FILE_MARKER = "*** Update File: ";
const MOVE_TO_MARKER = "*** Move to: ";
function readPatchText(input) {
	if (typeof input === "string") return input;
	if (input && typeof input === "object" && "input" in input) {
		const candidate = input.input;
		if (typeof candidate === "string") return candidate;
	}
}
function normalizePatchPath(raw, options = {}) {
	if (raw.length === 0) return;
	const cwd = options.cwd ?? options.sandbox?.root ?? process.cwd();
	try {
		const resolved = options.sandbox ? options.sandbox.bridge.resolvePath({
			filePath: raw,
			cwd
		}) : void 0;
		const normalized = path.normalize(resolved ? resolved.hostPath ?? resolved.containerPath : resolveSandboxInputPath(raw, cwd));
		return normalized && normalized !== "." ? normalized : void 0;
	} catch {
		return;
	}
}
function pushPath(target, seen, raw, options) {
	const normalized = normalizePatchPath(raw, options);
	if (!normalized) return;
	if (seen.has(normalized)) return;
	seen.add(normalized);
	target.push(normalized);
}
function readMarkerPath(line, marker) {
	const candidate = normalizeMarkerHeaderLine(line);
	if (!candidate?.startsWith(marker)) return;
	return candidate.slice(marker.length);
}
function normalizeMarkerHeaderLine(line, options) {
	if (line === void 0) return;
	const startTrimmed = line.trimStart();
	if (!startTrimmed.startsWith("***")) return;
	const leadingWhitespace = line.length - startTrimmed.length;
	if (options?.allowSingleSpaceIndent === false && leadingWhitespace === 1 && line.startsWith(" ")) return;
	return startTrimmed.trimEnd();
}
/**
* Walk an apply_patch envelope and return every destination path found, in
* the order they appear. Duplicates are de-duplicated (the same file may be
* referenced multiple times within a single envelope). Returns `[]` for any
* input that is not a recognised envelope.
*/
function extractApplyPatchTargetPaths(input, options = {}) {
	const text = readPatchText(input);
	if (text === void 0 || text.length === 0) return [];
	const lines = text.split(/\r?\n/);
	const paths = [];
	const seen = /* @__PURE__ */ new Set();
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines.at(index);
		if (line === void 0) break;
		const addPath = readMarkerPath(line, ADD_FILE_MARKER);
		if (addPath !== void 0) {
			pushPath(paths, seen, addPath, options);
			while (index + 1 < lines.length && lines.at(index + 1)?.startsWith("+")) index += 1;
			continue;
		}
		const deletePath = readMarkerPath(line, DELETE_FILE_MARKER);
		if (deletePath !== void 0) {
			pushPath(paths, seen, deletePath, options);
			continue;
		}
		const updatePath = readMarkerPath(line, UPDATE_FILE_MARKER);
		if (updatePath !== void 0) {
			pushPath(paths, seen, updatePath, options);
			let lookahead = index + 1;
			while (lookahead < lines.length && lines.at(lookahead)?.trim() === "") lookahead += 1;
			const movePath = readMarkerPath(lines.at(lookahead), MOVE_TO_MARKER);
			if (movePath !== void 0) {
				pushPath(paths, seen, movePath, options);
				lookahead += 1;
			}
			while (lookahead < lines.length) {
				const lookaheadLine = lines.at(lookahead);
				if (lookaheadLine === void 0) break;
				if (lookaheadLine.trim() === "") {
					lookahead += 1;
					continue;
				}
				if (lookaheadLine.startsWith("***")) break;
				lookahead += 1;
			}
			index = lookahead - 1;
		}
	}
	return paths;
}
//#endregion
//#region src/plugins/host-tool-param-parsers.ts
/**
* Per-tool host-owned param derivers. Keep this map small and focused — every
* entry runs synchronously inside the before_tool_call hot path.
*/
const HOST_TOOL_PARAM_PARSERS = { apply_patch: (params, options) => {
	const paths = extractApplyPatchTargetPaths(params, options);
	return paths.length > 0 ? { derivedPaths: Object.freeze([...paths]) } : {};
} };
/**
* Derive host-owned metadata for a tool call. Returns an empty object when no
* parser is registered for the tool, which lets callers spread the result
* unconditionally without a nullability check.
*/
function deriveToolParams(toolName, params, options) {
	if (!Object.hasOwn(HOST_TOOL_PARAM_PARSERS, toolName)) return {};
	const parser = HOST_TOOL_PARAM_PARSERS[toolName];
	return parser ? parser(params, options) : {};
}
//#endregion
//#region src/plugins/trusted-tool-policy.ts
/** True when the supplied or active plugin registry has trusted tool policies. */
function hasTrustedToolPolicies(registry = getActivePluginRegistry()) {
	return copyTrustedPolicyRegistrations(registry).length > 0;
}
function unreadableTrustedPolicyRegistration() {
	return {
		pluginId: "unknown-plugin",
		source: "runtime",
		get policy() {
			throw new Error("trusted policy registration is unreadable");
		}
	};
}
function copyTrustedPolicyRegistrations(registry) {
	let policies;
	try {
		policies = registry?.trustedToolPolicies;
	} catch {
		return [unreadableTrustedPolicyRegistration()];
	}
	if (!policies) return [];
	try {
		if (!Array.isArray(policies)) return [unreadableTrustedPolicyRegistration()];
		return policies.map((policy) => policy);
	} catch {
		return [unreadableTrustedPolicyRegistration()];
	}
}
function readTrustedPolicyPluginId(registration) {
	try {
		const pluginId = registration.pluginId;
		return typeof pluginId === "string" && pluginId.trim() ? pluginId.trim() : void 0;
	} catch {
		return;
	}
}
function trustedPolicyDiagnosticPluginId(registration) {
	return readTrustedPolicyPluginId(registration) ?? "unknown-plugin";
}
function readTrustedPolicyPluginName(registration) {
	try {
		const pluginName = registration.pluginName;
		return typeof pluginName === "string" && pluginName.trim() ? pluginName.trim() : void 0;
	} catch {
		return;
	}
}
function readTrustedPolicy(registration) {
	try {
		const policy = registration.policy;
		return policy && typeof policy.evaluate === "function" ? {
			ok: true,
			policy
		} : { ok: false };
	} catch {
		return { ok: false };
	}
}
function readTrustedPolicyId(registration) {
	const fallback = trustedPolicyDiagnosticPluginId(registration);
	const policy = readTrustedPolicy(registration);
	if (!policy.ok) return fallback;
	try {
		const id = policy.policy.id;
		return typeof id === "string" && id.trim() ? id.trim() : fallback;
	} catch {
		return fallback;
	}
}
function trustedPolicyDefaultBlockReason(registration) {
	return `blocked by ${readTrustedPolicyId(registration)}`;
}
function trustedPolicyFailureResult(registration, detail) {
	return {
		block: true,
		blockReason: `${trustedPolicyDefaultBlockReason(registration)}: ${detail}`
	};
}
/** Lists trusted tool policies for status and diagnostics. */
function getTrustedToolPolicyDiagnosticEntries(registry = getActivePluginRegistry()) {
	return copyTrustedPolicyRegistrations(registry).map((registration) => {
		const entry = {
			id: readTrustedPolicyId(registration),
			pluginId: trustedPolicyDiagnosticPluginId(registration)
		};
		const pluginName = readTrustedPolicyPluginName(registration);
		if (pluginName) entry.pluginName = pluginName;
		return entry;
	});
}
function normalizeDerivedEventFields(value) {
	return Array.isArray(value?.derivedPaths) ? { derivedPaths: Object.freeze([...value.derivedPaths]) } : {};
}
function normalizeToolIdentity(value) {
	return {
		...value?.toolKind && { toolKind: value.toolKind },
		...value?.toolInputKind && { toolInputKind: value.toolInputKind }
	};
}
/** Runs trusted tool policies before a tool call and returns the first terminal decision. */
async function runTrustedToolPolicies(event, ctx, options) {
	const policies = copyTrustedPolicyRegistrations(options?.registry ?? getActivePluginRegistry());
	let adjustedParams = event.params;
	let hasAdjustedParams = false;
	let approval;
	const sessionExtensionStateCache = /* @__PURE__ */ new Map();
	let resolvedSessionConfig = options?.config;
	let didResolveSessionConfig = Boolean(options?.config);
	const resolveSessionConfig = () => {
		if (!didResolveSessionConfig) {
			didResolveSessionConfig = true;
			try {
				resolvedSessionConfig = getRuntimeConfig();
			} catch {
				resolvedSessionConfig = void 0;
			}
		}
		return resolvedSessionConfig;
	};
	const { derivedPaths, toolKind, toolInputKind, ...eventWithoutDerivedPaths } = event;
	const { toolKind: ctxToolKind, toolInputKind: ctxToolInputKind, ...ctxWithoutToolIdentity } = ctx;
	let currentDerivedEvent = normalizeDerivedEventFields({ derivedPaths });
	let currentEventToolIdentity = normalizeToolIdentity({
		toolKind,
		toolInputKind
	});
	let currentContextToolIdentity = normalizeToolIdentity({
		toolKind: ctxToolKind,
		toolInputKind: ctxToolInputKind
	});
	const buildEvent = () => {
		return {
			...eventWithoutDerivedPaths,
			params: adjustedParams,
			...currentEventToolIdentity,
			...currentDerivedEvent
		};
	};
	for (const registration of policies) {
		const pluginId = readTrustedPolicyPluginId(registration);
		if (!pluginId) return trustedPolicyFailureResult(registration, "policy owner is unreadable");
		const policyCtx = {
			...ctxWithoutToolIdentity,
			...currentContextToolIdentity,
			getSessionExtension: (namespace) => {
				const normalizedNamespace = namespace.trim();
				const cacheKey = pluginId;
				if (!sessionExtensionStateCache.has(cacheKey)) {
					const config = ctx.sessionKey ? resolveSessionConfig() : void 0;
					sessionExtensionStateCache.set(cacheKey, config ? getPluginSessionExtensionStateSync({
						cfg: config,
						pluginId,
						sessionKey: ctx.sessionKey
					}) : void 0);
				}
				const pluginState = sessionExtensionStateCache.get(cacheKey);
				if (!normalizedNamespace || !pluginState) return;
				return pluginState[normalizedNamespace];
			}
		};
		const policy = readTrustedPolicy(registration);
		if (!policy.ok) return trustedPolicyFailureResult(registration, "policy is unreadable");
		let decision;
		try {
			decision = await policy.policy.evaluate(buildEvent(), policyCtx);
		} catch {
			return trustedPolicyFailureResult(registration, "policy evaluation failed");
		}
		if (!decision) continue;
		try {
			if ("allow" in decision && decision.allow === false) return {
				block: true,
				blockReason: decision.reason ?? trustedPolicyDefaultBlockReason(registration)
			};
			if ("block" in decision && decision.block === true) return {
				...decision,
				blockReason: decision.blockReason ?? trustedPolicyDefaultBlockReason(registration)
			};
			if ("params" in decision && isPlainObject(decision.params)) {
				const normalized = options?.normalizeEvent?.({
					...eventWithoutDerivedPaths,
					params: decision.params,
					...currentEventToolIdentity,
					...currentDerivedEvent
				}, policyCtx);
				adjustedParams = normalized?.params ?? decision.params;
				if (normalized?.event) currentEventToolIdentity = normalizeToolIdentity(normalized.event);
				if (normalized?.ctx) currentContextToolIdentity = normalizeToolIdentity(normalized.ctx);
				else if (normalized?.event) currentContextToolIdentity = normalizeToolIdentity(normalized.event);
				hasAdjustedParams = true;
				currentDerivedEvent = normalizeDerivedEventFields(options?.deriveEvent?.(adjustedParams));
			}
			if ("requireApproval" in decision && decision.requireApproval && !approval) approval = decision.requireApproval;
		} catch {
			return trustedPolicyFailureResult(registration, "policy decision is unreadable");
		}
	}
	if (!hasAdjustedParams && !approval) return;
	return {
		...hasAdjustedParams ? { params: adjustedParams } : {},
		...approval ? { requireApproval: approval } : {}
	};
}
//#endregion
//#region src/skills/workshop/policy.ts
const SKILL_WORKSHOP_LIFECYCLE_ACTIONS = /* @__PURE__ */ new Set([
	"apply",
	"reject",
	"quarantine"
]);
const SKILL_WORKSHOP_APPROVAL_TIMEOUT_MS = 7e4;
function readLifecycleAction(params) {
	const action = asNullableRecord(params)?.action;
	if (typeof action !== "string" || !SKILL_WORKSHOP_LIFECYCLE_ACTIONS.has(action)) return;
	return action;
}
function lifecycleApprovalText(action) {
	if (action === "apply") return {
		title: "Apply workspace skill proposal",
		description: "Apply a pending workspace skill proposal into live workspace skills.",
		severity: "warning"
	};
	if (action === "reject") return {
		title: "Reject workspace skill proposal",
		description: "Reject a pending workspace skill proposal.",
		severity: "info"
	};
	return {
		title: "Quarantine workspace skill proposal",
		description: "Quarantine a pending workspace skill proposal.",
		severity: "info"
	};
}
function readOptionalString(record, key) {
	const value = record?.[key];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function formatBodySizeKb(content) {
	return (Buffer.byteLength(content, "utf8") / 1024).toFixed(1);
}
function formatApprovalField(value) {
	return value.replace(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, (character) => character === "\n" || character === "\r" || character === "\u2028" || character === "\u2029" ? "↵" : "�");
}
function buildLifecycleApprovalDescription(params) {
	const description = formatApprovalField(params.description);
	const requestedSkillName = formatApprovalField(params.skillName);
	const fixedLines = [
		`Proposal ID: ${params.proposalId}`,
		`Description: ${description}`,
		`Support files: ${params.supportFileCount}`,
		`Body size: ${params.bodySizeKb} KB`
	];
	const skillPrefix = "Target skill: ";
	const fixedLength = fixedLines.join("\n").length + 14 + fixedLines.length;
	const availableSkillNameLength = Math.max(1, 512 - fixedLength);
	const skillName = requestedSkillName.length <= availableSkillNameLength ? requestedSkillName : `${truncateUtf16Safe(requestedSkillName, Math.max(0, availableSkillNameLength - 1))}…`;
	return [
		fixedLines[0],
		`${skillPrefix}${skillName}`,
		...fixedLines.slice(1)
	].join("\n");
}
async function resolveLifecycleApprovalDescription(params) {
	if (!params.workspaceDir) return { description: params.fallback };
	const toolParams = asNullableRecord(params.toolParams);
	try {
		const proposal = await resolvePendingSkillProposal({
			proposalId: readOptionalString(toolParams, "proposal_id"),
			name: readOptionalString(toolParams, "name"),
			workspaceDir: params.workspaceDir
		});
		const record = proposal.record;
		return {
			description: buildLifecycleApprovalDescription({
				proposalId: record.id,
				skillName: record.target.skillName,
				description: record.description,
				supportFileCount: record.supportFiles?.length ?? 0,
				bodySizeKb: formatBodySizeKb(proposal.content)
			}),
			proposalId: record.id
		};
	} catch {
		return { description: params.fallback };
	}
}
function lifecycleApprovalTimeoutReason(proposalId) {
	return [
		"The Skill Workshop approval request expired without a decision.",
		`This lifecycle call left ${proposalId ? `Proposal ${proposalId}` : "the proposal"} unchanged and pending; check its current status in case another operator acted on it.`,
		"Decide in the Skill Workshop UI or run `openclaw skills workshop apply|reject|quarantine <id>`.",
		"Do not retry this tool call in a loop."
	].join(" ");
}
function resolveApprovalConfig(config) {
	if (config) return config;
	try {
		return getRuntimeConfig();
	} catch {
		return;
	}
}
/** Returns approval policy for skill workshop lifecycle tool calls. */
async function resolveSkillWorkshopToolApproval(params) {
	if (params.toolName !== "skill_workshop") return;
	const action = readLifecycleAction(params.toolParams);
	if (!action) return;
	if (resolveSkillWorkshopConfig(resolveApprovalConfig(params.config)).approvalPolicy === "auto") return;
	const text = lifecycleApprovalText(action);
	const approvalDescription = await resolveLifecycleApprovalDescription({
		toolParams: params.toolParams,
		workspaceDir: params.workspaceDir,
		fallback: text.description
	});
	return { requireApproval: {
		...text,
		description: approvalDescription.description,
		timeoutMs: SKILL_WORKSHOP_APPROVAL_TIMEOUT_MS,
		timeoutReason: lifecycleApprovalTimeoutReason(approvalDescription.proposalId),
		allowedDecisions: ["allow-once", "deny"]
	} };
}
//#endregion
//#region src/talk/client-voice-confirmation.ts
/** In-memory spoken confirmation binding for high-impact Talk actions. */
const CONFIRMATION_TTL_MS = 2 * 6e4;
const pendingConfirmations = /* @__PURE__ */ new Map();
let confirmationSeq = 0;
const approvedFingerprints = /* @__PURE__ */ new Map();
const recentUserUtterances = /* @__PURE__ */ new Map();
function confirmationScopeKey(agentId, voiceSessionId) {
	return `${agentId}\0${voiceSessionId}`;
}
function stableToolFingerprint(toolName, params) {
	const normalize = (value) => {
		if (Array.isArray(value)) return value.map(normalize);
		if (!value || typeof value !== "object") return value;
		return Object.fromEntries(Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, entry]) => [key, normalize(entry)]));
	};
	return createHash("sha256").update(`${toolName}\0${JSON.stringify(normalize(params))}`).digest("hex");
}
function requiresHighImpactVoiceConfirmation(toolName, params) {
	const normalizedTool = toolName.trim().toLowerCase();
	if (!buildToolMutationState(normalizedTool, params).mutatingAction) return false;
	if ([
		"message",
		"gateway",
		"nodes",
		"browser",
		"computer",
		"canvas",
		"cron",
		"process"
	].includes(normalizedTool)) return true;
	if ([
		"write",
		"edit",
		"apply_patch",
		"create_goal",
		"update_goal",
		"get_goal"
	].includes(normalizedTool)) return false;
	return true;
}
function consumeApprovedFingerprint(voiceSessionId, runId, fingerprint, now) {
	if (!runId) return false;
	const approved = approvedFingerprints.get(voiceSessionId)?.get(runId);
	const expiresAt = approved?.get(fingerprint);
	if (!expiresAt || expiresAt < now) {
		approved?.delete(fingerprint);
		return false;
	}
	approved?.delete(fingerprint);
	return true;
}
/** Record a finalized user utterance after the durable transcript append succeeds. */
function noteClientVoiceConfirmationUtterance(params) {
	recentUserUtterances.set(confirmationScopeKey(params.agentId, params.voiceSessionId), {
		text: params.text,
		timestamp: params.timestamp
	});
	if (REFUSAL_PATTERN.test(normalizeUtterance(params.text))) {
		for (const [confirmationId, confirmation] of pendingConfirmations) if (confirmation.agentId === params.agentId && confirmation.voiceSessionId === params.voiceSessionId && confirmation.createdAt < params.timestamp) pendingConfirmations.delete(confirmationId);
	}
}
/** Pause a high-impact action for one voice-bound run until its exact fingerprint is approved. */
function resolveClientVoiceToolConfirmationPolicy(params) {
	if (!params.agentId || !params.voiceSessionId) return { allowed: true };
	if (!requiresHighImpactVoiceConfirmation(params.toolName, params.toolParams)) return { allowed: true };
	if (params.isConfirmable && !params.isConfirmable()) return { allowed: true };
	const now = params.now ?? Date.now();
	const fingerprint = stableToolFingerprint(params.toolName, params.toolParams);
	if (consumeApprovedFingerprint(confirmationScopeKey(params.agentId, params.voiceSessionId), params.runId, fingerprint, now)) return { allowed: true };
	const confirmation = [...pendingConfirmations.values()].find((entry) => entry.voiceSessionId === params.voiceSessionId && entry.agentId === params.agentId && entry.runId === params.runId && entry.fingerprint === fingerprint && entry.expiresAt >= now) ?? {
		confirmationId: randomUUID(),
		agentId: params.agentId,
		voiceSessionId: params.voiceSessionId,
		...params.runId ? { runId: params.runId } : {},
		fingerprint,
		toolName: params.toolName,
		createdAt: now,
		seq: ++confirmationSeq,
		expiresAt: now + CONFIRMATION_TTL_MS
	};
	pendingConfirmations.set(confirmation.confirmationId, confirmation);
	return {
		allowed: false,
		reason: `VOICE_CONFIRMATION_REQUIRED:${confirmation.confirmationId} The high-impact voice action "${params.toolName}" was not executed. Ask the user for explicit spoken confirmation, then call openclaw_agent_consult again with this confirmationId.`
	};
}
const REFUSAL_PATTERN = /\b(no|don't|do not|cancel|stop|never mind)\b/;
function normalizeUtterance(text) {
	return text.trim().toLowerCase().replace(/[‘’ʼ]/g, "'").replace(/[,;:.!?]+/g, "").replace(/\s+/g, " ");
}
function isExplicitAffirmation(text) {
	const normalized = normalizeUtterance(text);
	if (REFUSAL_PATTERN.test(normalized)) return false;
	return /^(yes|yes do it|do it|confirm|confirmed|go ahead|proceed|send it|make the change|restart it)$/.test(normalized);
}
/** Bind a later affirmative utterance to one exact paused action. */
function authorizeClientVoiceConfirmation(params) {
	const confirmation = pendingConfirmations.get(params.confirmationId);
	const now = params.now ?? Date.now();
	if (!confirmation || confirmation.agentId !== params.agentId || confirmation.voiceSessionId !== params.voiceSessionId || confirmation.expiresAt < now) throw new Error("voice confirmation is missing, expired, or belongs to another action");
	for (const entry of pendingConfirmations.values()) if (entry.agentId === params.agentId && entry.voiceSessionId === params.voiceSessionId && entry.seq > confirmation.seq) throw new Error("a newer confirmation request supersedes this one; ask again");
	const scopeKey = confirmationScopeKey(params.agentId, params.voiceSessionId);
	const affirmation = recentUserUtterances.get(scopeKey);
	if (!affirmation || affirmation.timestamp <= confirmation.createdAt || !isExplicitAffirmation(affirmation.text)) throw new Error("explicit spoken confirmation was not found after the action request");
	return {
		agentId: params.agentId,
		voiceSessionId: params.voiceSessionId,
		confirmationId: params.confirmationId,
		fingerprint: confirmation.fingerprint,
		expiresAt: confirmation.expiresAt
	};
}
/** Bind a validated spoken grant to the one follow-up run and consume the challenge. */
function bindAuthorizedClientVoiceConfirmation(params) {
	const scopeKey = confirmationScopeKey(params.grant.agentId, params.grant.voiceSessionId);
	const approvedByRun = approvedFingerprints.get(scopeKey) ?? /* @__PURE__ */ new Map();
	const approved = approvedByRun.get(params.runId) ?? /* @__PURE__ */ new Map();
	approved.set(params.grant.fingerprint, params.grant.expiresAt);
	approvedByRun.set(params.runId, approved);
	approvedFingerprints.set(scopeKey, approvedByRun);
	pendingConfirmations.delete(params.grant.confirmationId);
	recentUserUtterances.delete(scopeKey);
}
/**
* Remove ephemeral confirmation state when the logical call closes. Approved
* grants for still-live consult runs survive: a spoken "yes" followed by hangup
* must not re-block the confirmed action its run is about to execute.
*/
function deactivateClientVoiceConfirmationSession(agentId, voiceSessionId, liveRunIds = []) {
	const scopeKey = confirmationScopeKey(agentId, voiceSessionId);
	recentUserUtterances.delete(scopeKey);
	const approvedByRun = approvedFingerprints.get(scopeKey);
	if (approvedByRun) {
		const live = new Set(liveRunIds);
		for (const runId of approvedByRun.keys()) if (!live.has(runId)) approvedByRun.delete(runId);
		if (approvedByRun.size === 0) approvedFingerprints.delete(scopeKey);
	}
	for (const [confirmationId, confirmation] of pendingConfirmations) if (confirmation.agentId === agentId && confirmation.voiceSessionId === voiceSessionId) pendingConfirmations.delete(confirmationId);
}
/** Drop a completed run's surviving grants once its lifecycle ends. */
function releaseClientVoiceConfirmationRun(agentId, voiceSessionId, runId) {
	const scopeKey = confirmationScopeKey(agentId, voiceSessionId);
	const approvedByRun = approvedFingerprints.get(scopeKey);
	if (!approvedByRun) return;
	approvedByRun.delete(runId);
	if (approvedByRun.size === 0) approvedFingerprints.delete(scopeKey);
}
/** Test-only reset for process-global state. */
function resetClientVoiceConfirmationStateForTest() {
	pendingConfirmations.clear();
	approvedFingerprints.clear();
	recentUserUtterances.clear();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.clientVoiceConfirmationTestApi")] = { resetClientVoiceConfirmationStateForTest };
//#endregion
//#region src/talk/client-voice-session-store.ts
/** SQLite-backed persistence for durable per-agent Talk voice-call records. */
const VOICE_SESSION_CACHE_SCOPE = "talk-client-voice-sessions";
const VOICE_SESSION_MAX_TRANSCRIPT_CHARS = 8e3;
const VOICE_SESSION_STALE_AFTER_MS = 360 * 6e4;
function parseVoiceSessionRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	if (record.version !== 1 || typeof record.voiceSessionId !== "string" || typeof record.agentId !== "string" || typeof record.sessionKey !== "string" || record.provider !== void 0 && (typeof record.provider !== "string" || !record.provider.trim()) || record.origin !== "client" && record.origin !== "relay" || record.status !== "open" && record.status !== "closed" || typeof record.createdAt !== "number" || typeof record.updatedAt !== "number") return;
	const consultRunIds = Array.isArray(record.consultRunIds) ? record.consultRunIds.filter((entry) => typeof entry === "string") : [];
	const effects = Array.isArray(record.effects) ? record.effects.filter((entry) => {
		if (!entry || typeof entry !== "object") return false;
		const effect = entry;
		return typeof effect.runId === "string" && typeof effect.toolName === "string" && typeof effect.startedAt === "number" && (effect.status === "started" || effect.status === "succeeded" || effect.status === "failed" || effect.status === "cancelled" || effect.status === "blocked");
	}) : [];
	const provider = record.provider?.trim();
	return {
		...record,
		...provider ? { provider } : {},
		consultRunIds,
		effects
	};
}
function parseStoredVoiceSessionRecord(valueJson) {
	if (typeof valueJson !== "string") return;
	try {
		return parseVoiceSessionRecord(JSON.parse(valueJson));
	} catch {
		return;
	}
}
function readVoiceSessionRecord(agentId, voiceSessionId) {
	return parseStoredVoiceSessionRecord(openOpenClawAgentDatabase({ agentId }).db.prepare("SELECT value_json FROM cache_entries WHERE scope = ? AND key = ?").get(VOICE_SESSION_CACHE_SCOPE, voiceSessionId)?.value_json);
}
function readVoiceSessionRecordInTransaction(database, voiceSessionId) {
	return parseStoredVoiceSessionRecord(database.db.prepare("SELECT value_json FROM cache_entries WHERE scope = ? AND key = ?").get(VOICE_SESSION_CACHE_SCOPE, voiceSessionId)?.value_json);
}
function writeVoiceSessionRecordInTransaction(database, record) {
	database.db.prepare(`INSERT INTO cache_entries (scope, key, value_json, blob, expires_at, updated_at)
       VALUES (?, ?, ?, NULL, NULL, ?)
       ON CONFLICT(scope, key) DO UPDATE SET
         value_json = excluded.value_json,
         updated_at = excluded.updated_at`).run(VOICE_SESSION_CACHE_SCOPE, record.voiceSessionId, JSON.stringify(record), record.updatedAt);
}
function assertVoiceSessionOwnership(record, params) {
	if (record.agentId !== params.agentId || record.sessionKey !== params.sessionKey) throw new Error("voice session does not belong to this agent session");
}
function operationKey(agentId, voiceSessionId) {
	return `${agentId}\0${voiceSessionId}`;
}
//#endregion
//#region src/talk/client-voice-session.ts
/** Durable per-agent voice-call records for Talk continuity and mutation evidence. */
const voiceSessionByRunId = /* @__PURE__ */ new Map();
const voiceSessionOperations = /* @__PURE__ */ new Map();
const deferredDigestConfigs = /* @__PURE__ */ new Map();
let unsubscribeToolEffects;
let unsubscribeRunCompletion;
function hasLiveConsultRun(record) {
	return record.consultRunIds.some((runId) => {
		const binding = voiceSessionByRunId.get(runId);
		return binding?.agentId === record.agentId && binding.voiceSessionId === record.voiceSessionId && binding.sessionKey === record.sessionKey;
	});
}
async function runVoiceSessionOperation(agentId, voiceSessionId, operation) {
	const key = operationKey(agentId, voiceSessionId);
	const current = (voiceSessionOperations.get(key) ?? Promise.resolve()).then(operation, operation);
	const settled = current.then(() => void 0, () => void 0);
	voiceSessionOperations.set(key, settled);
	settled.then(() => {
		if (voiceSessionOperations.get(key) === settled) voiceSessionOperations.delete(key);
	});
	return await current;
}
function effectStatus(event) {
	if (event.type === "tool.execution.started") return "started";
	if (event.type === "tool.execution.completed") return "succeeded";
	if (event.type === "tool.execution.blocked") return "blocked";
	return event.terminalReason === "cancelled" ? "cancelled" : "failed";
}
function recordClientVoiceToolEffect(event) {
	const runId = event.runId;
	if (!runId) return;
	const binding = voiceSessionByRunId.get(runId);
	if (!binding) return;
	runOpenClawAgentWriteTransaction((database) => {
		const record = readVoiceSessionRecordInTransaction(database, binding.voiceSessionId);
		if (!record) return;
		const existing = event.toolCallId ? record.effects.find((effect) => effect.runId === runId && effect.toolCallId === event.toolCallId) : record.effects.findLast((effect) => effect.runId === runId && effect.toolName === event.toolName && effect.status === "started");
		if (event.type !== "tool.execution.started" && !existing) return;
		if (event.type !== "tool.execution.started" && existing) {
			existing.status = effectStatus(event);
			existing.finishedAt = event.ts;
		} else if (event.mutatingAction === true && (!event.toolCallId || !existing)) record.effects.push({
			runId,
			...event.toolCallId ? { toolCallId: event.toolCallId } : {},
			toolName: event.toolName,
			startedAt: event.ts,
			status: "started"
		});
		record.updatedAt = Date.now();
		writeVoiceSessionRecordInTransaction(database, record);
	}, { agentId: binding.agentId });
}
function ensureToolEffectSubscription() {
	unsubscribeToolEffects ??= onTrustedToolExecutionEvent(recordClientVoiceToolEffect);
	unsubscribeRunCompletion ??= onTrustedInternalDiagnosticEvent((event) => {
		if (event.type !== "run.completed") return;
		const binding = voiceSessionByRunId.get(event.runId);
		if (!binding) return;
		voiceSessionByRunId.delete(event.runId);
		releaseClientVoiceConfirmationRun(binding.agentId, binding.voiceSessionId, event.runId);
		finishDeferredMutationDigest(binding).catch((error) => {
			console.warn(`[talk] deferred voice mutation digest failed: ${error instanceof Error ? error.message : String(error)}`);
		});
	});
}
/** Create a call record or resume the same open call across transport restarts. */
function createOrResumeClientVoiceSession(params) {
	const voiceSessionId = params.voiceSessionId?.trim() || randomUUID();
	const provider = params.provider?.trim() || void 0;
	const now = params.now ?? Date.now();
	runOpenClawAgentWriteTransaction((database) => {
		const existing = readVoiceSessionRecordInTransaction(database, voiceSessionId);
		if (existing) {
			assertVoiceSessionOwnership(existing, params);
			if (existing.origin !== params.origin) throw new Error("voice session origin does not match");
			if (existing.status !== "open") throw new Error("voice session is already closed");
			if (existing.provider && provider && existing.provider !== provider) throw new Error("voice session provider does not match");
			if (!existing.provider && provider) existing.provider = provider;
			if (params.transcriptCapable === true) existing.transcriptCapable = true;
			existing.updatedAt = now;
			writeVoiceSessionRecordInTransaction(database, existing);
			return;
		}
		writeVoiceSessionRecordInTransaction(database, {
			version: 1,
			voiceSessionId,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			...provider ? { provider } : {},
			origin: params.origin,
			...params.transcriptCapable === true ? { transcriptCapable: true } : {},
			status: "open",
			createdAt: now,
			updatedAt: now,
			consultRunIds: [],
			effects: []
		});
	}, { agentId: params.agentId });
	return voiceSessionId;
}
/** Ensure Talk has the same canonical agent-session row that chat turns append to. */
async function ensureClientVoiceAgentSessionEntry(params) {
	if (loadSessionEntry(params)?.sessionId) return;
	if (!(await upsertSessionEntry(params, {}))?.sessionId) throw new Error(`agent session could not be initialized (${params.sessionKey})`);
}
/** Correlate a consult run with its open call for confirmation and mutation evidence. */
function registerClientVoiceConsultRun(params) {
	let recordClosed = false;
	runOpenClawAgentWriteTransaction((database) => {
		const record = readVoiceSessionRecordInTransaction(database, params.voiceSessionId);
		if (!record) throw new Error("voice session not found");
		assertVoiceSessionOwnership(record, params);
		recordClosed = record.status === "closed";
		if (!record.consultRunIds.includes(params.runId)) {
			record.consultRunIds.push(params.runId);
			record.updatedAt = Date.now();
			writeVoiceSessionRecordInTransaction(database, record);
		}
	}, { agentId: params.agentId });
	voiceSessionByRunId.set(params.runId, {
		agentId: params.agentId,
		voiceSessionId: params.voiceSessionId,
		sessionKey: params.sessionKey
	});
	if (recordClosed && params.config) deferredDigestConfigs.set(operationKey(params.agentId, params.voiceSessionId), params.config);
	ensureToolEffectSubscription();
}
/** Return the open voice-call binding for one executing run. */
function resolveClientVoiceRunBinding(runId) {
	return runId ? voiceSessionByRunId.get(runId) : void 0;
}
/**
* Confirmation applies only when the session can observe spoken approvals:
* relay sessions (server hears utterances) or clients that report transcripts.
* Legacy clients without transcript reporting keep pre-gate behavior.
*/
function isClientVoiceSessionConfirmable(binding) {
	const record = readVoiceSessionRecord(binding.agentId, binding.voiceSessionId);
	return record?.origin === "relay" || record?.transcriptCapable === true || record?.hasUserTranscript === true;
}
/** Validate ownership and open state before starting a voice-bound consult. */
function assertClientVoiceSessionOpen(params) {
	const record = readVoiceSessionRecord(params.agentId, params.voiceSessionId);
	if (!record) throw new Error("voice session not found");
	assertVoiceSessionOwnership(record, params);
	if (record.status !== "open") throw new Error("voice session is closed");
	return record.origin;
}
/** Validate durable ownership without rejecting an idempotent close retry. */
function resolveClientVoiceSessionOrigin(params) {
	const record = readVoiceSessionRecord(params.agentId, params.voiceSessionId);
	if (!record) throw new Error("voice session not found");
	assertVoiceSessionOwnership(record, params);
	return record.origin;
}
/** Resolve the newest open client-owned call for legacy tool-call clients. */
function resolveOpenClientVoiceSessionId(params) {
	const rows = openOpenClawAgentDatabase({ agentId: params.agentId }).db.prepare("SELECT value_json FROM cache_entries WHERE scope = ? ORDER BY updated_at DESC").all(VOICE_SESSION_CACHE_SCOPE);
	let match;
	for (const row of rows) {
		const record = parseStoredVoiceSessionRecord(row.value_json);
		if (record?.origin === "client" && record.status === "open" && record.agentId === params.agentId && record.sessionKey === params.sessionKey) {
			if (match) return;
			match = record.voiceSessionId;
		}
	}
	return match;
}
function buildPersistedVoiceMessage(params) {
	const provenance = {
		kind: "realtime_voice",
		sourceChannel: "talk"
	};
	if (params.role === "user") return {
		role: "user",
		content: [{
			type: "text",
			text: params.text
		}],
		timestamp: params.timestamp,
		provenance
	};
	return {
		role: "assistant",
		content: [{
			type: "text",
			text: params.text
		}],
		api: "realtime",
		provider: params.provider,
		model: "realtime-voice",
		stopReason: "stop",
		timestamp: params.timestamp,
		provenance
	};
}
async function appendVoiceTranscript(params) {
	await runVoiceSessionOperation(params.agentId, params.voiceSessionId, async () => {
		const text = truncateUtf16Safe(params.text.trim(), VOICE_SESSION_MAX_TRANSCRIPT_CHARS);
		if (!text) return;
		const record = readVoiceSessionRecord(params.agentId, params.voiceSessionId);
		if (!record) throw new Error("voice session not found");
		assertVoiceSessionOwnership(record, params);
		if (record.status !== "open") throw new Error("voice session is closed");
		if (record.origin !== params.origin) throw new Error("voice session origin does not allow this transcript source");
		const sessionEntry = loadSessionEntry({
			agentId: params.agentId,
			sessionKey: params.sessionKey
		});
		if (!sessionEntry?.sessionId) throw new Error(`agent session not found (${params.sessionKey})`);
		const observedAt = Date.now();
		const timestamp = params.timestamp ?? observedAt;
		await appendTranscriptMessage({
			agentId: params.agentId,
			sessionId: sessionEntry.sessionId,
			sessionKey: params.sessionKey
		}, {
			...params.config ? { config: params.config } : {},
			eventId: `voice:${params.voiceSessionId}:${params.entryId}`,
			message: buildPersistedVoiceMessage({
				role: params.role,
				text,
				timestamp,
				provider: record.provider ?? "realtime"
			}),
			now: timestamp
		});
		runOpenClawAgentWriteTransaction((database) => {
			const current = readVoiceSessionRecordInTransaction(database, params.voiceSessionId);
			if (!current) throw new Error("voice session disappeared during transcript append");
			assertVoiceSessionOwnership(current, params);
			if (params.role === "user") current.hasUserTranscript = true;
			current.updatedAt = Date.now();
			writeVoiceSessionRecordInTransaction(database, current);
		}, { agentId: params.agentId });
		if (params.role === "user") noteClientVoiceConfirmationUtterance({
			agentId: params.agentId,
			voiceSessionId: params.voiceSessionId,
			text,
			timestamp: observedAt
		});
	});
}
/** Append one finalized client-owned transcript item idempotently. */
async function appendClientVoiceTranscript(params) {
	await appendVoiceTranscript({
		...params,
		origin: "client"
	});
}
/** Append one finalized relay-owned transcript item idempotently. */
async function appendRelayVoiceTranscript(params) {
	await appendVoiceTranscript({
		...params,
		origin: "relay"
	});
}
function formatMutationDigest(effects) {
	if (effects.length === 0) return;
	return ["Voice call changes", ...effects.slice(0, 12).map((effect) => `- ${effect.toolName}: ${effect.status === "started" ? "outcome not confirmed" : effect.status}`)].join("\n");
}
async function deliverMutationDigest(record, config, target, text) {
	const { sendDurableMessageBatch } = await import("./runtime-DjiAO-3g.js");
	const send = await sendDurableMessageBatch({
		cfg: config,
		channel: target.channel,
		to: target.to,
		...target.accountId ? { accountId: target.accountId } : {},
		...target.threadId != null ? { threadId: target.threadId } : {},
		payloads: [{ text }],
		durability: "required",
		requireUnknownSendReconciliation: true,
		session: buildOutboundSessionContext({
			cfg: config,
			agentId: record.agentId,
			sessionKey: record.sessionKey,
			policySessionKey: record.sessionKey
		})
	});
	if (send.status === "failed" || send.status === "partial_failed") throw send.error;
}
async function deliverMutationDigestOnce(record, config) {
	if (record.digestDeliveredAt) return;
	const text = formatMutationDigest(record.effects);
	if (!text) return;
	const target = resolveSessionDeliveryTarget({
		entry: loadSessionEntry({
			agentId: record.agentId,
			sessionKey: record.sessionKey
		}),
		requestedChannel: "last"
	});
	if (!target.channel || target.channel === "webchat" || !target.to) return;
	await deliverMutationDigest(record, config, {
		channel: target.channel,
		to: target.to,
		accountId: target.accountId,
		threadId: target.threadId
	}, text);
	const deliveredAt = Date.now();
	runOpenClawAgentWriteTransaction((database) => {
		const current = readVoiceSessionRecordInTransaction(database, record.voiceSessionId);
		if (!current || current.digestDeliveredAt) return;
		current.digestDeliveredAt = deliveredAt;
		current.updatedAt = deliveredAt;
		writeVoiceSessionRecordInTransaction(database, current);
	}, { agentId: record.agentId });
}
async function finishDeferredMutationDigest(binding) {
	const key = operationKey(binding.agentId, binding.voiceSessionId);
	const config = deferredDigestConfigs.get(key);
	if (!config) return;
	await runVoiceSessionOperation(binding.agentId, binding.voiceSessionId, async () => {
		const record = readVoiceSessionRecord(binding.agentId, binding.voiceSessionId);
		if (!record || record.status !== "closed" || hasLiveConsultRun(record)) return;
		await deliverMutationDigestOnce(record, config);
		deferredDigestConfigs.delete(key);
	});
}
/** Retry deferred digests whose delivery previously failed after the call closed. */
async function retryDeferredMutationDigests(agentId) {
	for (const key of Array.from(deferredDigestConfigs.keys())) {
		const [entryAgentId, voiceSessionId] = key.split("\0");
		if (entryAgentId !== agentId || !voiceSessionId) continue;
		try {
			await finishDeferredMutationDigest({
				agentId,
				voiceSessionId
			});
		} catch {}
	}
}
async function closeClientVoiceSessionInternal(params) {
	const existing = readVoiceSessionRecord(params.agentId, params.voiceSessionId);
	if (!existing) throw new Error("voice session not found");
	assertVoiceSessionOwnership(existing, params);
	const now = params.now ?? Date.now();
	runOpenClawAgentWriteTransaction((database) => {
		const current = readVoiceSessionRecordInTransaction(database, params.voiceSessionId);
		if (!current) throw new Error("voice session disappeared during close");
		assertVoiceSessionOwnership(current, params);
		if (current.status === "open") {
			current.status = "closed";
			current.closedAt = now;
			current.updatedAt = now;
			writeVoiceSessionRecordInTransaction(database, current);
		}
	}, { agentId: params.agentId });
	const closed = readVoiceSessionRecord(params.agentId, params.voiceSessionId);
	if (!closed) throw new Error("voice session disappeared after close");
	const liveRunIds = closed.consultRunIds.filter((runId) => {
		const binding = voiceSessionByRunId.get(runId);
		return binding?.voiceSessionId === params.voiceSessionId && binding.agentId === params.agentId;
	});
	deactivateClientVoiceConfirmationSession(params.agentId, params.voiceSessionId, liveRunIds);
	const key = operationKey(params.agentId, params.voiceSessionId);
	deferredDigestConfigs.set(key, params.config);
	if (hasLiveConsultRun(closed)) return;
	await deliverMutationDigestOnce(closed, params.config);
	deferredDigestConfigs.delete(key);
}
/** Close a logical voice call and deliver its mutation digest at most once. */
async function closeClientVoiceSession(params) {
	await runVoiceSessionOperation(params.agentId, params.voiceSessionId, async () => {
		await closeClientVoiceSessionInternal(params);
	});
}
/** Close abandoned open calls idle for the fixed six-hour recovery window. */
async function closeStaleClientVoiceSessions(params) {
	const now = params.now ?? Date.now();
	await retryDeferredMutationDigests(params.agentId);
	const stale = openOpenClawAgentDatabase({ agentId: params.agentId }).db.prepare("SELECT value_json FROM cache_entries WHERE scope = ? AND updated_at <= ?").all(VOICE_SESSION_CACHE_SCOPE, now - VOICE_SESSION_STALE_AFTER_MS).flatMap((row) => {
		const record = parseStoredVoiceSessionRecord(row.value_json);
		return record && record.status === "open" && record.voiceSessionId !== params.excludeVoiceSessionId ? [record] : [];
	});
	let closed = 0;
	for (const record of stale) try {
		await closeClientVoiceSession({
			agentId: params.agentId,
			sessionKey: record.sessionKey,
			voiceSessionId: record.voiceSessionId,
			config: params.config,
			now
		});
		closed += 1;
	} catch (error) {
		params.warn?.(`failed to close stale voice session ${record.voiceSessionId}: ${error instanceof Error ? error.message : String(error)}`);
	}
	return closed;
}
const clientVoiceSessionTesting = {
	readRecord: readVoiceSessionRecord,
	reset() {
		voiceSessionByRunId.clear();
		voiceSessionOperations.clear();
		deferredDigestConfigs.clear();
		unsubscribeToolEffects?.();
		unsubscribeToolEffects = void 0;
		unsubscribeRunCompletion?.();
		unsubscribeRunCompletion = void 0;
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.clientVoiceSessionTestApi")] = clientVoiceSessionTesting;
//#endregion
//#region src/agents/agent-tools.before-tool-call.state.ts
/**
* Shared before_tool_call state for adjusted tool params.
* The adapter and wrapper both consult this map so later execution can use the
* normalized payload selected by hook processing.
*/
const adjustedParamsByToolCallId = /* @__PURE__ */ new Map();
const preExecutionBlockedToolCallIds = /* @__PURE__ */ new Set();
const structuredReplaySafeToolCallIds = /* @__PURE__ */ new Set();
const startedToolCallIds = /* @__PURE__ */ new Set();
const trackedToolCallIds = /* @__PURE__ */ new Set();
function buildAdjustedParamsKey(params) {
	if (params.runId && params.runId.trim()) return `${params.runId}:${params.toolCallId}`;
	return params.toolCallId;
}
/** Consume and remove hook-adjusted params for a completed tool call. */
function consumeAdjustedParamsForToolCall(toolCallId, runId) {
	const key = buildAdjustedParamsKey({
		runId,
		toolCallId
	});
	const params = adjustedParamsByToolCallId.get(key);
	adjustedParamsByToolCallId.delete(key);
	return params;
}
/** Snapshot hook-adjusted params without consuming later outcome bookkeeping. */
function peekAdjustedParamsForToolCall(toolCallId, runId) {
	const key = buildAdjustedParamsKey({
		runId,
		toolCallId
	});
	const params = adjustedParamsByToolCallId.get(key);
	return params === void 0 ? void 0 : structuredClone(params);
}
/** Consume whether policy prevented the target tool from starting. */
function consumePreExecutionBlockedToolCall(toolCallId, runId) {
	const key = buildAdjustedParamsKey({
		runId,
		toolCallId
	});
	const blocked = preExecutionBlockedToolCallIds.has(key);
	preExecutionBlockedToolCallIds.delete(key);
	return blocked;
}
/** Snapshot whether policy prevented execution without stealing cleanup from the tool owner. */
function peekPreExecutionBlockedToolCall(toolCallId, runId) {
	return preExecutionBlockedToolCallIds.has(buildAdjustedParamsKey({
		runId,
		toolCallId
	}));
}
/** Record active wrapper ownership so a racing timeout can inspect the boundary. */
function recordToolExecutionTracked(toolCallId, runId) {
	trackedToolCallIds.add(buildAdjustedParamsKey({
		runId,
		toolCallId
	}));
}
function recordToolExecutionStarted(toolCallId, runId) {
	const key = buildAdjustedParamsKey({
		runId,
		toolCallId
	});
	trackedToolCallIds.add(key);
	startedToolCallIds.add(key);
}
/** Release execution-boundary evidence when the wrapped invocation settles. */
function clearTrackedToolExecution(toolCallId, runId) {
	const key = buildAdjustedParamsKey({
		runId,
		toolCallId
	});
	trackedToolCallIds.delete(key);
	startedToolCallIds.delete(key);
}
/**
* Consume exact in-flight execution state. Undefined means the wrapper already
* settled or the producer does not participate in OpenClaw boundary tracking.
*/
function consumeTrackedToolExecutionStarted(toolCallId, runId) {
	const key = buildAdjustedParamsKey({
		runId,
		toolCallId
	});
	const tracked = trackedToolCallIds.has(key);
	const started = startedToolCallIds.has(key);
	clearTrackedToolExecution(toolCallId, runId);
	return tracked ? started : void 0;
}
function recordStructuredReplaySafeToolCall(toolCallId, runId) {
	structuredReplaySafeToolCallIds.add(buildAdjustedParamsKey({
		runId,
		toolCallId
	}));
}
function consumeStructuredReplaySafeToolCall(toolCallId, runId) {
	const key = buildAdjustedParamsKey({
		runId,
		toolCallId
	});
	const replaySafe = structuredReplaySafeToolCallIds.has(key);
	structuredReplaySafeToolCallIds.delete(key);
	return replaySafe;
}
//#endregion
//#region src/agents/agent-tools.before-tool-call.ts
/**
* before_tool_call policy runtime for agent tools.
* Runs plugin hooks, trusted tool policies, approvals, diagnostics, loop
* detection, skill-use telemetry, and adjusted parameter tracking.
*/
function resolvePluginToolApprovalTimeoutMs(approval) {
	if (typeof approval.timeoutMs !== "number" || !Number.isFinite(approval.timeoutMs) || approval.timeoutMs <= 0) return DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS;
	return Math.min(Math.floor(approval.timeoutMs), MAX_PLUGIN_APPROVAL_TIMEOUT_MS);
}
function resolvePluginToolApprovalGatewayTimeoutMs(timeoutMs) {
	return addTimerTimeoutGraceMs(timeoutMs, 1e4) ?? 13e4;
}
/** Return whether before_tool_call hooks or trusted policies are active. */
function getBeforeToolCallPolicyDiagnosticState() {
	const policyRegistry = getGlobalHookRunnerRegistry() ?? void 0;
	return {
		hasBeforeToolCallHook: getGlobalHookRunner()?.hasHooks("before_tool_call") === true,
		trustedToolPolicies: getTrustedToolPolicyDiagnosticEntries(policyRegistry)
	};
}
/** Return true when any before_tool_call policy could affect tool execution. */
function hasBeforeToolCallPolicy() {
	const state = getBeforeToolCallPolicyDiagnosticState();
	return state.hasBeforeToolCallHook || state.trustedToolPolicies.length > 0;
}
const log = createSubsystemLogger("agents/tools");
const BEFORE_TOOL_CALL_HOOK_FAILURE_REASON = "Tool call blocked because before_tool_call hook failed";
const MAX_TRACKED_ADJUSTED_PARAMS = 1024;
const MAX_PENDING_TERMINAL_PRESENTATIONS = 1024;
const LOOP_WARNING_BUCKET_SIZE = 10;
const MAX_LOOP_WARNING_KEYS = 256;
const MAX_TERMINAL_PRESENTATION_CHARS = 2e3;
const pendingTerminalPresentationByToolCall = /* @__PURE__ */ new Map();
function resolveToolTerminalPresentation(params) {
	try {
		const sourceTool = params.tool[BEFORE_TOOL_CALL_SOURCE_TOOL];
		const text = getToolTerminalPresentation(sourceTool && typeof sourceTool === "object" ? sourceTool : params.tool)?.(params.toolParams, params.result)?.text.trim();
		if (!text) return;
		return truncateUtf16Safe(redactToolDetail(text), MAX_TERMINAL_PRESENTATION_CHARS);
	} catch (err) {
		log.warn(`terminal tool presentation failed: tool=${params.tool.name || "tool"} error=${String(err)}`);
		return;
	}
}
function rememberPendingTerminalPresentation(params) {
	if (!params.toolCallId || !params.ctx?.onToolOutcome) return;
	const key = buildAdjustedParamsKey({
		runId: params.ctx.runId,
		toolCallId: params.toolCallId
	});
	pendingTerminalPresentationByToolCall.set(key, {
		observer: params.ctx.onToolOutcome,
		tool: params.tool,
		toolParams: structuredClone(params.toolParams),
		toolCallOrdinal: params.toolCallOrdinal
	});
	while (pendingTerminalPresentationByToolCall.size > MAX_PENDING_TERMINAL_PRESENTATIONS) {
		const oldestKey = pendingTerminalPresentationByToolCall.keys().next().value;
		if (!oldestKey) break;
		pendingTerminalPresentationByToolCall.delete(oldestKey);
	}
}
/** Finalizes a trusted terminal summary after harness result middleware. */
function finalizeToolTerminalPresentation(params) {
	const key = buildAdjustedParamsKey({
		runId: params.runId,
		toolCallId: params.toolCallId
	});
	const pending = pendingTerminalPresentationByToolCall.get(key);
	pendingTerminalPresentationByToolCall.delete(key);
	const observer = pending?.observer ?? params.observer;
	if (!observer) return;
	const toolCallOrdinal = pending?.toolCallOrdinal ?? params.toolCallOrdinal;
	observer({
		toolName: pending?.tool.name || params.toolName || "tool",
		argsHash: "",
		resultHash: "",
		...toolCallOrdinal !== void 0 ? { toolCallOrdinal } : {},
		terminalPresentation: params.isError ? void 0 : pending ? resolveToolTerminalPresentation({
			tool: pending.tool,
			toolParams: pending.toolParams,
			result: params.result
		}) : void 0,
		presentationOnly: true
	});
}
/**
* Error used when before_tool_call intentionally vetoes a tool call.
*/
var BeforeToolCallBlockedError = class extends Error {
	constructor(reason) {
		super(reason);
		this.reason = reason;
		this.name = "BeforeToolCallBlockedError";
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.beforeToolCallBlockedErrorTestApi")] = { create(message) {
	return new BeforeToolCallBlockedError(message);
} };
var BeforeToolCallFailureError = class extends Error {
	constructor(message, disposition, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.disposition = disposition;
		this.name = "BeforeToolCallFailureError";
	}
};
function tagBeforeToolCallFailure(error, signal) {
	try {
		if (error instanceof BeforeToolCallFailureError) return error;
	} catch {}
	const message = formatToolExecutionErrorMessage(error, "before_tool_call failed");
	const disposition = resolveToolErrorDiagnostic(error, signal).terminalReason;
	return new BeforeToolCallFailureError(message, disposition, error);
}
/** Return the closed terminal disposition carried by a before-tool failure. */
function getBeforeToolCallFailureDisposition(error) {
	try {
		return error instanceof BeforeToolCallFailureError ? error.disposition : void 0;
	} catch {
		return;
	}
}
/** Remember hook-adjusted params for later adapter-side execution. */
function recordAdjustedParamsForToolCall(toolCallId, params, runId) {
	if (!toolCallId) return;
	const cloneResult = cloneParamsForAdjustedReplay(params);
	if (!cloneResult.ok) return;
	const adjustedParamsKey = buildAdjustedParamsKey({
		runId,
		toolCallId
	});
	adjustedParamsByToolCallId.set(adjustedParamsKey, cloneResult.value);
	if (adjustedParamsByToolCallId.size > MAX_TRACKED_ADJUSTED_PARAMS) {
		const oldest = adjustedParamsByToolCallId.keys().next().value;
		if (oldest) adjustedParamsByToolCallId.delete(oldest);
	}
}
function cloneParamsForAdjustedReplay(params) {
	try {
		return {
			ok: true,
			value: structuredClone(params)
		};
	} catch {
		return { ok: false };
	}
}
/** Record that one concrete core-owned tool call may use structured replay classification. */
function recordStructuredReplayTrustForToolCall(toolCallId, tool, runId) {
	if (!toolCallId || getPluginToolMeta(tool) || getChannelAgentToolMeta(tool)) return;
	recordStructuredReplaySafeToolCall(toolCallId, runId);
	while (structuredReplaySafeToolCallIds.size > MAX_TRACKED_ADJUSTED_PARAMS) {
		const oldest = structuredReplaySafeToolCallIds.values().next().value;
		if (!oldest) break;
		structuredReplaySafeToolCallIds.delete(oldest);
	}
}
/**
* Returns true when an error represents an intentional before_tool_call veto.
*/
function isBeforeToolCallBlockedError(err) {
	return err instanceof BeforeToolCallBlockedError;
}
const loadBeforeToolCallRuntime = createLazyRuntimeSurface(() => import("./agent-tools.before-tool-call.runtime.js"), ({ beforeToolCallRuntime }) => beforeToolCallRuntime);
function mergeParamsWithApprovalOverrides(originalParams, approvalParams) {
	if (approvalParams && isPlainObject(approvalParams)) {
		if (isPlainObject(originalParams)) return {
			...originalParams,
			...approvalParams
		};
		return approvalParams;
	}
	return originalParams;
}
function unwrapErrorCause(err) {
	try {
		if (!(err instanceof Error)) return err;
		const cause = Object.getOwnPropertyDescriptor(err, "cause");
		if (cause && "value" in cause && cause.value !== void 0) return cause.value;
	} catch {
		return err;
	}
	return err;
}
function resolveToolErrorDiagnostic(err, signal, errorCategory) {
	const cause = unwrapErrorCause(err);
	const errorCode = diagnosticHttpStatusCode(cause);
	const abortFields = resolveAgentRunAbortLifecycleFields(signal);
	const terminalReason = !abortFields.aborted ? resolveToolExecutionErrorKind(cause) : abortFields.stopReason === "timeout" ? "timed_out" : "cancelled";
	return {
		errorCategory: terminalReason === "cancelled" ? "aborted" : errorCategory ?? diagnosticErrorCategory(cause),
		terminalReason,
		...errorCode ? { errorCode } : {}
	};
}
function resolveToolResultTerminalDiagnostic(result, durationMs) {
	const failureKind = resolveToolResultFailureKind(result);
	if (!failureKind) return {
		type: "tool.execution.completed",
		durationMs
	};
	if (failureKind === "blocked") return {
		type: "tool.execution.blocked",
		deniedReason: "tool_result_blocked",
		reason: "tool_result_blocked"
	};
	return {
		type: "tool.execution.error",
		durationMs,
		errorCategory: "tool_result_error",
		terminalReason: failureKind
	};
}
function resolveToolDiagnosticIdentity(tool) {
	const pluginMeta = getPluginToolMeta(tool);
	if (pluginMeta) return pluginMeta.pluginId === "bundle-mcp" ? {
		toolSource: "mcp",
		toolOwner: pluginMeta.pluginId
	} : {
		toolSource: "plugin",
		toolOwner: pluginMeta.pluginId
	};
	const channelMeta = getChannelAgentToolMeta(tool);
	if (channelMeta) return {
		toolSource: "channel",
		toolOwner: channelMeta.channelId
	};
	return { toolSource: "core" };
}
function canonicalSkillFile(value) {
	const skillFile = value?.trim();
	return skillFile && path.isAbsolute(skillFile) ? canonicalizePath(path.resolve(skillFile)) : void 0;
}
function resolvedSkillUsageMatch(params) {
	const skillFile = canonicalSkillFile(params.skill.filePath);
	return {
		skillName: params.skill.name.trim(),
		skillSource: resolveSkillTelemetrySource(params.skill),
		activation: params.activation,
		...skillFile ? { skillFile } : {}
	};
}
function findResolvedSkillUsageMatch(params) {
	const skillName = params.skillName.trim();
	const candidates = (params.snapshot?.resolvedSkills ?? []).filter((skill) => skill.name.trim() === skillName);
	const skill = candidates.find((candidate) => resolveSkillTelemetrySource(candidate) === params.skillSource) ?? (candidates.length === 1 ? candidates[0] : void 0);
	return skill ? resolvedSkillUsageMatch({
		activation: params.activation,
		skill
	}) : void 0;
}
function resolveRelativeToolPath(candidate, ctx) {
	const trimmed = candidate.trim();
	if (!trimmed) return;
	if (trimmed.startsWith("node://")) return trimmed;
	if (trimmed === "~") return os.homedir();
	if (trimmed.startsWith("~/")) return path.resolve(os.homedir(), trimmed.slice(2));
	if (path.isAbsolute(trimmed)) return path.resolve(trimmed);
	const base = ctx?.workspaceDir ?? ctx?.cwd;
	return base ? path.resolve(base, trimmed) : void 0;
}
function readToolPathCandidates(params, ctx) {
	if (!isPlainObject(params)) return [];
	return (typeof params.path === "string" ? [params.path] : []).map((candidate) => resolveRelativeToolPath(normalizeFileToolPathParam(candidate), ctx)).filter((candidate) => Boolean(candidate));
}
function skillInstructionPaths(snapshot) {
	const matches = /* @__PURE__ */ new Map();
	for (const skill of snapshot?.resolvedSkills ?? []) {
		if (!(typeof skill.name === "string" ? skill.name.trim() : "")) continue;
		const match = resolvedSkillUsageMatch({
			activation: "read",
			skill
		});
		const filePath = typeof skill.filePath === "string" ? skill.filePath.trim() : "";
		if (filePath) {
			if (filePath.startsWith("node://")) matches.set(filePath, match);
			else if (path.isAbsolute(filePath)) matches.set(path.resolve(filePath), match);
		}
		const baseDir = typeof skill.baseDir === "string" ? skill.baseDir.trim() : "";
		if (baseDir && path.isAbsolute(baseDir)) matches.set(path.resolve(baseDir, "SKILL.md"), match);
	}
	return matches;
}
function materializedSkillInstructionPaths(paths) {
	const matches = /* @__PURE__ */ new Map();
	for (const entry of paths ?? []) matches.set(path.resolve(entry.readPath), {
		skillFile: entry.skillFile,
		skillName: entry.skillName,
		skillSource: entry.skillSource,
		activation: "read"
	});
	return matches;
}
function findSkillUsageMatch(params) {
	const command = params.ctx?.skillCommand;
	if (command) {
		const commandToolName = normalizeToolName(command.toolName ?? params.toolName);
		if (!commandToolName || commandToolName === params.toolName) {
			const skillSource = resolveSkillTelemetrySourceValue(command.skillSource);
			const snapshotMatch = findResolvedSkillUsageMatch({
				activation: "command",
				skillName: command.skillName,
				skillSource,
				snapshot: params.ctx?.skillsSnapshot
			});
			const skillFile = canonicalSkillFile(command.skillFile) ?? snapshotMatch?.skillFile;
			return {
				skillName: command.skillName,
				skillSource,
				activation: "command",
				...skillFile ? { skillFile } : {}
			};
		}
	}
	if (params.toolName !== "read") return;
	const skillPaths = params.ctx?.skillsSnapshot?.resolvedSkills?.length ? skillInstructionPaths(params.ctx.skillsSnapshot) : materializedSkillInstructionPaths(params.ctx?.skillUsagePaths);
	for (const candidate of readToolPathCandidates(params.toolParams, params.ctx)) {
		const match = skillPaths.get(candidate);
		if (match) return match;
	}
}
function emitSkillUsedDiagnostic(params) {
	const trace = params.ctx?.trace ? freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(params.ctx.trace)) : void 0;
	emitTrustedSkillUsedDiagnosticEvent({
		type: "skill.used",
		...params.ctx?.runId && { runId: params.ctx.runId },
		...params.ctx?.sessionKey && { sessionKey: params.ctx.sessionKey },
		...params.ctx?.sessionId && { sessionId: params.ctx.sessionId },
		...params.ctx?.agentId && { agentId: params.ctx.agentId },
		...trace && { trace },
		skillName: params.match.skillName,
		skillSource: params.match.skillSource,
		activation: params.match.activation,
		toolName: params.toolName,
		...params.toolCallId && { toolCallId: params.toolCallId }
	}, params.match.skillFile ? { skillUsage: { skillFile: params.match.skillFile } } : void 0);
}
function emitToolBlockedSecurityEvent(params) {
	const control = params.deniedReason === "tool-loop" ? {
		policyId: "tool-loop-detection",
		controlId: "tool-loop-detection",
		family: "authorization"
	} : params.deniedReason === "plugin-approval" ? {
		policyId: "plugin-tool-approval",
		controlId: "plugin-tool-approval",
		family: "approval"
	} : {
		policyId: "plugin-before-tool-call",
		controlId: "before-tool-call",
		family: "approval"
	};
	emitTrustedSecurityEvent({
		category: "tool",
		action: "tool.execution.blocked",
		outcome: "denied",
		severity: "medium",
		reason: params.deniedReason,
		...params.trace ? { trace: params.trace } : {},
		actor: { kind: "agent" },
		target: {
			kind: "tool",
			name: params.toolName,
			...params.toolIdentity.toolOwner ? { owner: params.toolIdentity.toolOwner } : {}
		},
		policy: {
			id: control.policyId,
			decision: "deny",
			reason: params.deniedReason
		},
		control: {
			id: control.controlId,
			family: control.family
		},
		attributes: {
			tool_source: params.toolIdentity.toolSource,
			...params.paramsSummary ? { params_kind: params.paramsSummary.kind } : {}
		}
	});
}
const warnedDeprecatedTimeoutBehaviorPluginIds = /* @__PURE__ */ new Set();
function warnDeprecatedApprovalTimeoutBehavior(approval) {
	if (approval.timeoutBehavior !== "allow") return;
	const pluginId = approval.pluginId ?? "unknown-plugin";
	if (warnedDeprecatedTimeoutBehaviorPluginIds.has(pluginId)) return;
	warnedDeprecatedTimeoutBehaviorPluginIds.add(pluginId);
	log.warn(`plugin '${pluginId}' sets deprecated requireApproval.timeoutBehavior:"allow"; the field is ignored and approvals fail closed on timeout (see docs/plugins/plugin-permission-requests.md)`);
}
function notifyPluginApprovalResolution(approval, resolution) {
	const onResolution = approval.onResolution;
	if (typeof onResolution !== "function") return;
	try {
		Promise.resolve(onResolution(resolution)).catch((err) => {
			log.warn(`plugin onResolution callback failed: ${String(err)}`);
		});
	} catch (err) {
		log.warn(`plugin onResolution callback failed: ${String(err)}`);
	}
}
function resolvePermittedPluginApprovalResolution(decision, allowedDecisions) {
	if ((decision === PluginApprovalResolutions.ALLOW_ONCE || decision === PluginApprovalResolutions.ALLOW_ALWAYS || decision === PluginApprovalResolutions.DENY) && allowedDecisions.includes(decision)) return decision;
	return PluginApprovalResolutions.TIMEOUT;
}
function buildPluginApprovalFailureReason(params) {
	const turnSourceChannel = params.ctx?.turnSourceChannel;
	if (!turnSourceChannel?.trim()) return params.fallbackReason;
	const nativePluginSurface = resolveApprovalInitiatingSurfaceState({
		channel: turnSourceChannel,
		accountId: params.ctx?.turnSourceAccountId,
		cfg: params.ctx?.config,
		approvalKind: "plugin"
	});
	const setupText = describeNativePluginApprovalClientSetup({
		channel: nativePluginSurface.channel,
		channelLabel: nativePluginSurface.channelLabel,
		accountId: nativePluginSurface.accountId
	});
	if (!setupText) return params.fallbackReason;
	if ((nativePluginSurface.kind === "disabled" ? nativePluginSurface : resolveApprovalInitiatingSurfaceState({
		channel: turnSourceChannel,
		accountId: params.ctx?.turnSourceAccountId,
		cfg: params.ctx?.config,
		approvalKind: "exec"
	})).kind !== "disabled") return params.fallbackReason;
	return `${params.fallbackReason}\n\n${setupText}`;
}
async function requestPluginToolApproval(params) {
	const approval = params.approval;
	const timeoutMs = resolvePluginToolApprovalTimeoutMs(approval);
	const gatewayTimeoutMs = resolvePluginToolApprovalGatewayTimeoutMs(timeoutMs);
	const allowedDecisions = resolveCanonicalPluginApprovalRequestAllowedDecisions(approval);
	let gatewayApprovalPhase = "none";
	try {
		const embeddedApprovalBroker = isEmbeddedMode() ? getEmbeddedPluginApprovalBroker() : null;
		if (embeddedApprovalBroker) {
			const decision = (await embeddedApprovalBroker.request({
				request: {
					pluginId: approval.pluginId,
					title: approval.title,
					description: approval.description,
					severity: approval.severity,
					allowedDecisions: approval.allowedDecisions,
					toolName: params.toolName,
					toolCallId: params.toolCallId,
					agentId: params.ctx?.agentId,
					sessionKey: params.ctx?.sessionKey,
					turnSourceChannel: params.ctx?.turnSourceChannel,
					turnSourceTo: params.ctx?.turnSourceTo,
					turnSourceAccountId: params.ctx?.turnSourceAccountId,
					turnSourceThreadId: params.ctx?.turnSourceThreadId
				},
				timeoutMs,
				signal: params.signal
			})).decision;
			const resolution = resolvePermittedPluginApprovalResolution(decision, allowedDecisions);
			notifyPluginApprovalResolution(approval, resolution);
			if (resolution === PluginApprovalResolutions.ALLOW_ONCE || resolution === PluginApprovalResolutions.ALLOW_ALWAYS) return {
				blocked: false,
				params: mergeParamsWithApprovalOverrides(params.baseParams, params.overrideParams),
				approvalResolution: resolution
			};
			if (resolution === PluginApprovalResolutions.DENY) return {
				blocked: true,
				kind: "failure",
				disposition: "blocked",
				deniedReason: "plugin-approval",
				reason: "Denied by user",
				params: params.baseParams
			};
			return approval.timeoutReason ? {
				blocked: true,
				kind: "veto",
				deniedReason: "plugin-approval",
				reason: approval.timeoutReason,
				params: params.baseParams
			} : {
				blocked: true,
				kind: "failure",
				disposition: "timed_out",
				deniedReason: "plugin-approval",
				reason: "Approval timed out",
				params: params.baseParams
			};
		}
		gatewayApprovalPhase = "request";
		const requestResult = await callGatewayTool("plugin.approval.request", { timeoutMs: gatewayTimeoutMs }, {
			pluginId: approval.pluginId,
			title: approval.title,
			description: approval.description,
			severity: approval.severity,
			allowedDecisions: approval.allowedDecisions,
			toolName: params.toolName,
			toolCallId: params.toolCallId,
			agentId: params.ctx?.agentId,
			sessionKey: params.ctx?.sessionKey,
			...params.ctx?.approvalReviewerDeviceId ? { approvalReviewerDeviceIds: [params.ctx.approvalReviewerDeviceId] } : {},
			turnSourceChannel: params.ctx?.turnSourceChannel,
			turnSourceTo: params.ctx?.turnSourceTo,
			turnSourceAccountId: params.ctx?.turnSourceAccountId,
			turnSourceThreadId: params.ctx?.turnSourceThreadId,
			timeoutMs,
			twoPhase: true
		}, { expectFinal: false });
		gatewayApprovalPhase = "none";
		const id = requestResult?.id;
		if (!id) {
			notifyPluginApprovalResolution(approval, PluginApprovalResolutions.CANCELLED);
			return {
				blocked: true,
				kind: "failure",
				disposition: "failed",
				deniedReason: "plugin-approval",
				reason: approval.description || "Plugin approval request failed",
				params: params.baseParams
			};
		}
		const hasImmediateDecision = Object.hasOwn(requestResult ?? {}, "decision");
		let decision;
		if (hasImmediateDecision) {
			decision = requestResult?.decision;
			if (decision === null) {
				notifyPluginApprovalResolution(approval, PluginApprovalResolutions.CANCELLED);
				return {
					blocked: true,
					kind: "failure",
					disposition: "failed",
					deniedReason: "plugin-approval",
					reason: buildPluginApprovalFailureReason({
						fallbackReason: "Plugin approval unavailable (no approval route)",
						ctx: params.ctx
					}),
					params: params.baseParams
				};
			}
		} else {
			gatewayApprovalPhase = "wait";
			const waitPromise = callGatewayTool("plugin.approval.waitDecision", { timeoutMs: gatewayTimeoutMs }, { id });
			let waitResult;
			if (params.signal) {
				let onAbort;
				const abortPromise = new Promise((_, reject) => {
					if (params.signal.aborted) {
						reject(toLintErrorObject(params.signal.reason, "Non-Error rejection"));
						return;
					}
					onAbort = () => reject(toLintErrorObject(params.signal.reason, "Non-Error rejection"));
					params.signal.addEventListener("abort", onAbort, { once: true });
				});
				try {
					waitResult = await Promise.race([waitPromise, abortPromise]);
				} finally {
					if (onAbort) params.signal.removeEventListener("abort", onAbort);
				}
			} else waitResult = await waitPromise;
			decision = waitResult?.id === id ? waitResult.decision : void 0;
		}
		const resolution = resolvePermittedPluginApprovalResolution(decision, allowedDecisions);
		notifyPluginApprovalResolution(approval, resolution);
		if (resolution === PluginApprovalResolutions.ALLOW_ONCE || resolution === PluginApprovalResolutions.ALLOW_ALWAYS) return {
			blocked: false,
			params: mergeParamsWithApprovalOverrides(params.baseParams, params.overrideParams),
			approvalResolution: resolution
		};
		if (resolution === PluginApprovalResolutions.DENY) return {
			blocked: true,
			kind: "failure",
			disposition: "blocked",
			deniedReason: "plugin-approval",
			reason: "Denied by user",
			params: params.baseParams
		};
		const fallbackTimeoutReason = approval.timeoutReason ?? "Approval timed out";
		const timeoutReason = requestResult?.deliveryRoute === "turn-source" ? buildPluginApprovalFailureReason({
			fallbackReason: fallbackTimeoutReason,
			ctx: params.ctx
		}) : fallbackTimeoutReason;
		return {
			blocked: true,
			kind: approval.timeoutReason ? "veto" : "failure",
			disposition: "timed_out",
			deniedReason: "plugin-approval",
			reason: timeoutReason,
			params: params.baseParams
		};
	} catch (err) {
		notifyPluginApprovalResolution(approval, PluginApprovalResolutions.CANCELLED);
		const signal = params.signal;
		if (signal?.aborted === true && (err === signal.reason || err instanceof Error && (err.name === "AbortError" || "cause" in err && err.cause === signal.reason))) {
			log.warn(`plugin approval wait cancelled by run abort: ${String(err)}`);
			return {
				blocked: true,
				kind: "failure",
				disposition: resolveToolErrorDiagnostic(err, signal).terminalReason,
				deniedReason: "plugin-approval",
				reason: "Approval cancelled (run aborted)",
				params: params.baseParams
			};
		}
		const invalidRequest = err instanceof GatewayClientRequestError && err.gatewayCode === "INVALID_REQUEST";
		const reason = invalidRequest && gatewayApprovalPhase === "request" ? `Plugin approval request rejected: ${formatErrorMessage(err)}` : invalidRequest && gatewayApprovalPhase === "wait" ? `Plugin approval no longer available: ${formatErrorMessage(err)}` : "Plugin approval required (gateway unavailable)";
		log.warn(`plugin approval gateway request failed; blocking tool call: ${String(err)}`);
		return {
			blocked: true,
			kind: "failure",
			disposition: resolveToolErrorDiagnostic(err, signal).terminalReason,
			deniedReason: "plugin-approval",
			reason,
			params: params.baseParams
		};
	}
}
/** Resolve a deferred plugin approval request at the later execution boundary. */
async function requestDeferredPluginToolApproval(params) {
	const deferred = params.deferredApproval;
	return requestPluginToolApproval({
		approval: deferred.approval,
		toolName: deferred.toolName,
		...deferred.toolCallId ? { toolCallId: deferred.toolCallId } : {},
		...deferred.ctx ? { ctx: deferred.ctx } : {},
		signal: params.signal,
		baseParams: deferred.baseParams,
		overrideParams: deferred.overrideParams
	});
}
/** Notify plugin approval callbacks that a deferred approval was cancelled. */
function cancelDeferredPluginToolApproval(deferredApproval) {
	notifyPluginApprovalResolution(deferredApproval.approval, PluginApprovalResolutions.CANCELLED);
}
async function resolveBeforeToolCallApprovalOutcome(params) {
	const approval = params.result?.requireApproval;
	if (!approval) return;
	warnDeprecatedApprovalTimeoutBehavior(approval);
	if (params.approvalMode === "defer") return {
		blocked: false,
		params: params.baseParams,
		deferredApproval: {
			approval,
			toolName: params.toolName,
			...params.toolCallId ? { toolCallId: params.toolCallId } : {},
			...params.ctx ? { ctx: params.ctx } : {},
			baseParams: params.baseParams,
			overrideParams: params.result?.params
		}
	};
	if (params.approvalMode === "report") {
		notifyPluginApprovalResolution(approval, PluginApprovalResolutions.CANCELLED);
		return {
			blocked: true,
			kind: "failure",
			disposition: "blocked",
			deniedReason: "plugin-approval",
			reason: approval.description || approval.title || "Plugin approval required",
			params: params.baseParams
		};
	}
	if (params.approvalMode === "deny") {
		notifyPluginApprovalResolution(approval, PluginApprovalResolutions.DENY);
		return {
			blocked: true,
			kind: "veto",
			deniedReason: "plugin-approval",
			reason: "approval_required",
			params: params.baseParams
		};
	}
	return await requestPluginToolApproval({
		approval,
		toolName: params.toolName,
		...params.toolCallId ? { toolCallId: params.toolCallId } : {},
		...params.ctx ? { ctx: params.ctx } : {},
		signal: params.signal,
		baseParams: params.baseParams,
		overrideParams: params.result?.params
	});
}
async function resolveSkillWorkshopApprovalForFinalParams(params) {
	return await resolveBeforeToolCallApprovalOutcome({
		result: await resolveSkillWorkshopToolApproval({
			toolName: params.toolName,
			toolParams: isPlainObject(params.params) ? params.params : {},
			...params.ctx?.config ? { config: params.ctx.config } : {},
			...params.ctx?.workspaceDir ? { workspaceDir: params.ctx.workspaceDir } : {}
		}),
		approvalMode: params.approvalMode,
		toolName: params.toolName,
		...params.toolCallId ? { toolCallId: params.toolCallId } : {},
		...params.ctx ? { ctx: params.ctx } : {},
		signal: params.signal,
		baseParams: params.params
	});
}
const preExecutionBlockedToolResults = /* @__PURE__ */ new WeakSet();
function isPreExecutionBlockedToolResult(result) {
	return result !== null && typeof result === "object" && preExecutionBlockedToolResults.has(result);
}
/** Build the standard terminal result for vetoed tool calls. */
function buildBlockedToolResult(params) {
	recordPreExecutionBlockedToolCall(params.toolCallId, params.runId);
	const result = {
		content: [{
			type: "text",
			text: params.reason
		}],
		details: {
			status: "blocked",
			deniedReason: params.deniedReason ?? "plugin-before-tool-call",
			reason: params.reason
		}
	};
	preExecutionBlockedToolResults.add(result);
	return result;
}
function buildToolContentPrivateData(policy, args) {
	if (!policy.toolInputs && !policy.toolOutputs) return;
	const toolContent = {};
	if (policy.toolInputs) toolContent.toolInput = cloneDiagnosticContentValue(args.input);
	if (args.includeOutput && policy.toolOutputs) toolContent.toolOutput = cloneDiagnosticContentValue(args.output);
	return Object.keys(toolContent).length > 0 ? { toolContent } : void 0;
}
function summarizeToolParams(params) {
	if (params === null) return { kind: "null" };
	if (params === void 0) return { kind: "undefined" };
	if (Array.isArray(params)) return {
		kind: "array",
		length: params.length
	};
	if (typeof params === "object") return { kind: "object" };
	if (typeof params === "string") return {
		kind: "string",
		length: params.length
	};
	if (typeof params === "number") return { kind: "number" };
	if (typeof params === "boolean") return { kind: "boolean" };
	return { kind: "other" };
}
function shouldEmitLoopWarning(state, warningKey, count) {
	if (!state.toolLoopWarningBuckets) state.toolLoopWarningBuckets = /* @__PURE__ */ new Map();
	const bucket = Math.floor(count / LOOP_WARNING_BUCKET_SIZE);
	if (bucket <= (state.toolLoopWarningBuckets.get(warningKey) ?? 0)) return false;
	state.toolLoopWarningBuckets.set(warningKey, bucket);
	if (state.toolLoopWarningBuckets.size > MAX_LOOP_WARNING_KEYS) {
		const oldest = state.toolLoopWarningBuckets.keys().next().value;
		if (oldest) state.toolLoopWarningBuckets.delete(oldest);
	}
	return true;
}
async function recordLoopOutcome(args) {
	if (!args.ctx?.sessionKey && !args.ctx?.sessionId) return;
	let recordedOutcome;
	try {
		const { getDiagnosticSessionState, recordToolCallOutcome } = await loadBeforeToolCallRuntime();
		const record = recordToolCallOutcome(getDiagnosticSessionState({
			sessionKey: args.ctx.sessionKey,
			sessionId: args.ctx.sessionId
		}), {
			toolName: args.toolName,
			toolParams: args.toolParams,
			toolCallId: args.toolCallId,
			result: args.result,
			error: args.error,
			config: args.ctx.loopDetection,
			...args.ctx.runId && { runId: args.ctx.runId }
		});
		if (record?.resultHash && args.ctx.onToolOutcome) recordedOutcome = {
			toolName: record.toolName,
			argsHash: record.argsHash,
			resultHash: record.resultHash,
			...args.toolCallOrdinal !== void 0 ? { toolCallOrdinal: args.toolCallOrdinal } : {},
			...args.terminalPresentation ? { terminalPresentation: args.terminalPresentation } : {}
		};
	} catch (err) {
		log.warn(`tool loop outcome tracking failed: tool=${args.toolName} error=${String(err)}`);
	}
	if (recordedOutcome) args.ctx.onToolOutcome?.(recordedOutcome);
}
/** Run the full before_tool_call policy chain for a pending tool call. */
async function runBeforeToolCallHook(args) {
	const toolName = normalizeToolName(args.toolName || "tool");
	const params = args.params;
	try {
		if (args.ctx?.sessionKey) {
			const { getDiagnosticSessionState, logToolLoopAction, detectToolCallLoop, recordToolCall } = await loadBeforeToolCallRuntime();
			const sessionState = getDiagnosticSessionState({
				sessionKey: args.ctx.sessionKey,
				sessionId: args.ctx.sessionId
			});
			const loopScope = args.ctx.runId ? { runId: args.ctx.runId } : void 0;
			const loopResult = detectToolCallLoop(sessionState, toolName, params, args.ctx.loopDetection, loopScope);
			if (loopResult.stuck) {
				if (loopResult.level === "critical") {
					log.error(`Blocking ${toolName} due to critical loop: ${loopResult.message}`);
					logToolLoopAction({
						sessionKey: args.ctx.sessionKey,
						sessionId: args.ctx.sessionId,
						toolName,
						level: "critical",
						action: "block",
						detector: loopResult.detector,
						count: loopResult.count,
						message: loopResult.message,
						pairedToolName: loopResult.pairedToolName
					});
					return {
						blocked: true,
						kind: "veto",
						deniedReason: "tool-loop",
						reason: loopResult.message,
						params
					};
				}
				const baseWarningKey = loopResult.warningKey ?? `${loopResult.detector}:${toolName}`;
				if (shouldEmitLoopWarning(sessionState, args.ctx.runId ? `${args.ctx.runId}:${baseWarningKey}` : baseWarningKey, loopResult.count)) {
					log.warn(`Loop warning for ${toolName}: ${loopResult.message}`);
					logToolLoopAction({
						sessionKey: args.ctx.sessionKey,
						sessionId: args.ctx.sessionId,
						toolName,
						level: "warning",
						action: "warn",
						detector: loopResult.detector,
						count: loopResult.count,
						message: loopResult.message,
						pairedToolName: loopResult.pairedToolName
					});
				}
			}
			if (args.ctx.loopDetection?.enabled !== false) recordToolCall(sessionState, toolName, params, args.toolCallId, args.ctx.loopDetection, loopScope);
		}
		const hookRunner = getGlobalHookRunner();
		const hasBeforeToolCallHooks = hookRunner?.hasHooks("before_tool_call") === true;
		const policyRegistry = getGlobalHookRunnerRegistry() ?? void 0;
		const shouldRunTrustedPolicies = hasTrustedToolPolicies(policyRegistry);
		const normalizedParams = isPlainObject(params) ? params : {};
		const initialCorePolicyResult = await resolveSkillWorkshopToolApproval({
			toolName,
			toolParams: normalizedParams,
			...args.ctx?.config ? { config: args.ctx.config } : {},
			...args.ctx?.workspaceDir ? { workspaceDir: args.ctx.workspaceDir } : {}
		});
		const voiceRun = resolveClientVoiceRunBinding(args.ctx?.runId);
		const voiceConfirmation = resolveClientVoiceToolConfirmationPolicy({
			agentId: voiceRun?.agentId,
			voiceSessionId: voiceRun?.voiceSessionId,
			runId: args.ctx?.runId,
			toolName,
			toolParams: normalizedParams,
			...voiceRun ? { isConfirmable: () => isClientVoiceSessionConfirmable(voiceRun) } : {}
		});
		if (!voiceConfirmation.allowed) return {
			blocked: true,
			kind: "veto",
			deniedReason: "plugin-before-tool-call",
			reason: voiceConfirmation.reason,
			params
		};
		if (!initialCorePolicyResult && !shouldRunTrustedPolicies && !hasBeforeToolCallHooks) return {
			blocked: false,
			params
		};
		const deriveOptions = args.ctx?.cwd || args.ctx?.sandbox ? {
			...args.ctx.cwd ? { cwd: args.ctx.cwd } : {},
			...args.ctx.sandbox ? { sandbox: args.ctx.sandbox } : {}
		} : void 0;
		const derivedToolParams = deriveToolParams(toolName, normalizedParams, deriveOptions);
		const deriveToolEventParams = (candidateParams) => {
			const derived = deriveToolParams(toolName, candidateParams, deriveOptions);
			return derived.derivedPaths ? { derivedPaths: derived.derivedPaths } : {};
		};
		const toolIdentity = {
			...args.toolKind && { toolKind: args.toolKind },
			...args.toolInputKind && { toolInputKind: args.toolInputKind }
		};
		const buildToolContext = (identity) => ({
			toolName,
			...identity,
			...args.ctx?.agentId && { agentId: args.ctx.agentId },
			...args.ctx?.sessionKey && { sessionKey: args.ctx.sessionKey },
			...args.ctx?.sessionId && { sessionId: args.ctx.sessionId },
			...args.ctx?.runId && { runId: args.ctx.runId },
			...args.ctx?.trace && { trace: freezeDiagnosticTraceContext(args.ctx.trace) },
			...args.toolCallId && { toolCallId: args.toolCallId },
			...args.ctx?.channelId && { channelId: args.ctx.channelId },
			...args.ctx?.requester ? { requester: args.ctx.requester } : {}
		});
		const toolContext = buildToolContext(toolIdentity);
		const trustedPolicyResult = shouldRunTrustedPolicies ? await runTrustedToolPolicies({
			toolName,
			params: normalizedParams,
			...toolIdentity,
			...args.ctx?.runId && { runId: args.ctx.runId },
			...args.toolCallId && { toolCallId: args.toolCallId },
			...derivedToolParams.derivedPaths ? { derivedPaths: derivedToolParams.derivedPaths } : {}
		}, toolContext, {
			...policyRegistry ? { registry: policyRegistry } : {},
			...args.ctx?.config ? { config: args.ctx.config } : {},
			deriveEvent: deriveToolEventParams,
			normalizeEvent(eventValue) {
				const normalizedEventParams = normalizeCodeModeExecBeforeHookParamsForToolKind({
					toolKind: eventValue.toolKind,
					params: eventValue.params
				});
				if (!isPlainObject(normalizedEventParams)) return;
				const normalizedEventIdentity = getCodeModeExecBeforeHookMetadataForToolKind({
					toolKind: eventValue.toolKind,
					params: normalizedEventParams
				});
				return {
					params: normalizedEventParams,
					...normalizedEventIdentity ? {
						event: normalizedEventIdentity,
						ctx: normalizedEventIdentity
					} : {}
				};
			}
		}) : void 0;
		if (trustedPolicyResult?.block) return {
			blocked: true,
			kind: "veto",
			deniedReason: "plugin-before-tool-call",
			reason: trustedPolicyResult.blockReason || "Tool call blocked by trusted plugin policy",
			params
		};
		let trustedApprovalParams;
		let trustedApprovalResolution;
		if (trustedPolicyResult?.requireApproval) {
			const approvalOutcome = await resolveBeforeToolCallApprovalOutcome({
				result: trustedPolicyResult,
				approvalMode: args.approvalMode,
				toolName,
				...args.toolCallId ? { toolCallId: args.toolCallId } : {},
				...args.ctx ? { ctx: args.ctx } : {},
				signal: args.signal,
				baseParams: params
			});
			if (approvalOutcome) {
				if (approvalOutcome.blocked) return approvalOutcome;
				if (approvalOutcome.deferredApproval) return approvalOutcome;
				trustedApprovalParams = approvalOutcome.params;
				trustedApprovalResolution = approvalOutcome.approvalResolution;
			}
		}
		const rawPolicyAdjustedParams = trustedApprovalParams ?? trustedPolicyResult?.params ?? params;
		const policyAdjustedParams = normalizeCodeModeExecBeforeHookParamsForToolKind({
			toolKind: args.toolKind,
			params: rawPolicyAdjustedParams
		});
		const policyAdjustedToolIdentity = getCodeModeExecBeforeHookMetadataForToolKind({
			toolKind: args.toolKind,
			params: policyAdjustedParams
		}) ?? toolIdentity;
		const policyAdjustedToolContext = buildToolContext(policyAdjustedToolIdentity);
		const policyAdjustedDerivedToolParams = trustedPolicyResult?.params && isPlainObject(policyAdjustedParams) ? deriveToolParams(toolName, policyAdjustedParams, deriveOptions) : derivedToolParams;
		if (!hasBeforeToolCallHooks) {
			const finalApprovalOutcome = await resolveSkillWorkshopApprovalForFinalParams({
				toolName,
				params: policyAdjustedParams,
				approvalMode: args.approvalMode,
				...args.toolCallId ? { toolCallId: args.toolCallId } : {},
				...args.ctx ? { ctx: args.ctx } : {},
				signal: args.signal
			});
			if (finalApprovalOutcome) return finalApprovalOutcome;
			const allowed = {
				blocked: false,
				params: policyAdjustedParams
			};
			if (trustedApprovalResolution) allowed.approvalResolution = trustedApprovalResolution;
			return allowed;
		}
		const hookEventParams = isPlainObject(policyAdjustedParams) ? policyAdjustedParams : {};
		const hookResult = await hookRunner.runBeforeToolCall({
			toolName,
			params: hookEventParams,
			...policyAdjustedToolIdentity,
			...args.ctx?.runId && { runId: args.ctx.runId },
			...args.toolCallId && { toolCallId: args.toolCallId },
			...policyAdjustedDerivedToolParams.derivedPaths ? { derivedPaths: policyAdjustedDerivedToolParams.derivedPaths } : {}
		}, policyAdjustedToolContext);
		if (hookResult?.block) return {
			blocked: true,
			kind: "veto",
			deniedReason: "plugin-before-tool-call",
			reason: hookResult.blockReason || "Tool call blocked by plugin hook",
			params: policyAdjustedParams
		};
		let finalParams = policyAdjustedParams;
		let finalApprovalResolution = trustedApprovalResolution;
		if (hookResult?.requireApproval) {
			const approvalOutcome = await resolveBeforeToolCallApprovalOutcome({
				result: hookResult,
				approvalMode: args.approvalMode,
				toolName,
				...args.toolCallId ? { toolCallId: args.toolCallId } : {},
				...args.ctx ? { ctx: args.ctx } : {},
				signal: args.signal,
				baseParams: policyAdjustedParams
			});
			if (approvalOutcome) {
				if (approvalOutcome.blocked) return approvalOutcome;
				if (approvalOutcome.deferredApproval) return approvalOutcome;
				finalParams = approvalOutcome.params;
				finalApprovalResolution = approvalOutcome.approvalResolution ?? finalApprovalResolution;
			}
		}
		if (hookResult?.params) finalParams = mergeParamsWithApprovalOverrides(finalParams, hookResult.params);
		const finalApprovalOutcome = await resolveSkillWorkshopApprovalForFinalParams({
			toolName,
			params: finalParams,
			approvalMode: args.approvalMode,
			...args.toolCallId ? { toolCallId: args.toolCallId } : {},
			...args.ctx ? { ctx: args.ctx } : {},
			signal: args.signal
		});
		if (finalApprovalOutcome) return finalApprovalOutcome;
		const allowed = {
			blocked: false,
			params: finalParams
		};
		if (finalApprovalResolution) allowed.approvalResolution = finalApprovalResolution;
		return allowed;
	} catch (err) {
		const toolCallId = args.toolCallId ? ` toolCallId=${args.toolCallId}` : "";
		const cause = unwrapErrorCause(err);
		log.error(`before_tool_call hook failed: tool=${toolName}${toolCallId} error=${String(cause)}`);
		return {
			blocked: true,
			kind: "failure",
			deniedReason: "plugin-before-tool-call",
			disposition: resolveToolErrorDiagnostic(cause, args.signal).terminalReason,
			reason: BEFORE_TOOL_CALL_HOOK_FAILURE_REASON,
			params
		};
	}
}
function wrapToolWithBeforeToolCallHook(tool, ctx, options = {}) {
	const execute = tool.execute;
	if (!execute) return tool;
	const toolName = tool.name || "tool";
	const diagnosticIdentity = resolveToolDiagnosticIdentity(tool);
	const hookOptions = {
		...options.approvalMode ? { approvalMode: options.approvalMode } : {},
		emitDiagnostics: options.emitDiagnostics !== false
	};
	const toolContentPolicy = resolveDiagnosticModelContentCapturePolicy(ctx?.config);
	const wrappedTool = {
		...tool,
		execute: async (toolCallId, params, signal, onUpdate) => {
			const toolCallOrdinal = ctx?.allocateToolOutcomeOrdinal?.(toolCallId);
			const preExecutionStartedAt = Date.now();
			const normalizedToolName = normalizeToolName(toolName || "tool");
			const trace = hookOptions.emitDiagnostics && ctx?.trace ? freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(ctx.trace)) : void 0;
			const buildEventBase = (toolParams) => ({
				...ctx?.runId && { runId: ctx.runId },
				...ctx?.sessionKey && { sessionKey: ctx.sessionKey },
				...ctx?.sessionId && { sessionId: ctx.sessionId },
				...ctx?.agentId && { agentId: ctx.agentId },
				...trace && { trace },
				toolName: normalizedToolName,
				...diagnosticIdentity,
				...toolCallId && { toolCallId },
				paramsSummary: summarizeToolParams(toolParams),
				mutatingAction: buildToolMutationState(normalizedToolName, toolParams).mutatingAction
			});
			const recordPreExecutionError = (error, toolParams, errorCategory) => {
				recordPreExecutionBlockedToolCall(toolCallId, ctx?.runId);
				if (!hookOptions.emitDiagnostics) return;
				emitTrustedDiagnosticEvent({
					type: "tool.execution.error",
					...buildEventBase(toolParams),
					durationMs: Date.now() - preExecutionStartedAt,
					...resolveToolErrorDiagnostic(error, signal, errorCategory)
				});
			};
			const recordPreExecutionDisposition = (toolParams, disposition, errorCategory, deniedReason) => {
				recordPreExecutionBlockedToolCall(toolCallId, ctx?.runId);
				if (!hookOptions.emitDiagnostics) return;
				const eventBase = buildEventBase(toolParams);
				if (disposition === "blocked") {
					const reason = deniedReason ?? "plugin-before-tool-call";
					emitTrustedDiagnosticEvent({
						type: "tool.execution.blocked",
						...eventBase,
						deniedReason: reason,
						reason
					});
					return;
				}
				emitTrustedDiagnosticEvent({
					type: "tool.execution.error",
					...eventBase,
					durationMs: Date.now() - preExecutionStartedAt,
					errorCategory: disposition === "cancelled" ? "aborted" : errorCategory,
					terminalReason: disposition
				});
			};
			const prepare = tool.prepareBeforeToolCallParams;
			let preparedParams;
			try {
				preparedParams = prepare ? await prepare(params, {
					...toolCallId ? { toolCallId } : {},
					...ctx ? { hookContext: ctx } : {},
					...signal ? { signal } : {}
				}) : params;
			} catch (error) {
				recordPreExecutionError(error, params, "tool_preparation");
				throw tagBeforeToolCallFailure(error, signal);
			}
			const hookParams = normalizeCodeModeExecBeforeHookParams({
				tool,
				params: preparedParams
			});
			const hookMetadata = getCodeModeExecBeforeHookMetadata({
				tool,
				params: preparedParams
			});
			let outcome;
			try {
				outcome = await runBeforeToolCallHook({
					toolName,
					params: hookParams,
					...hookMetadata,
					toolCallId,
					ctx,
					signal,
					approvalMode: hookOptions.approvalMode
				});
			} catch (error) {
				recordPreExecutionError(error, hookParams, "before_tool_call");
				throw tagBeforeToolCallFailure(error, signal);
			}
			if (outcome.blocked) {
				if (outcome.kind !== "veto") {
					recordPreExecutionDisposition(outcome.params ?? hookParams, outcome.disposition, outcome.deniedReason === "plugin-approval" ? "plugin_approval" : "before_tool_call", outcome.deniedReason);
					throw new BeforeToolCallFailureError(outcome.reason, outcome.disposition);
				}
				const eventBase = buildEventBase(outcome.params ?? hookParams);
				if (hookOptions.emitDiagnostics) {
					emitTrustedDiagnosticEvent({
						type: "tool.execution.blocked",
						...eventBase,
						reason: outcome.reason,
						deniedReason: outcome.deniedReason ?? "plugin-before-tool-call"
					});
					emitToolBlockedSecurityEvent({
						ctx,
						deniedReason: outcome.deniedReason ?? "plugin-before-tool-call",
						toolIdentity: diagnosticIdentity,
						toolName: normalizedToolName,
						trace,
						paramsSummary: eventBase.paramsSummary
					});
				}
				const blockedResult = buildBlockedToolResult({
					reason: outcome.reason,
					deniedReason: outcome.deniedReason ?? "plugin-before-tool-call",
					toolCallId,
					runId: ctx?.runId
				});
				await recordLoopOutcome({
					ctx,
					toolName: normalizedToolName,
					toolParams: outcome.params ?? hookParams,
					toolCallId,
					result: blockedResult,
					toolCallOrdinal
				});
				return blockedResult;
			}
			let executeParams;
			try {
				signal?.throwIfAborted();
				executeParams = reconcileCodeModeExecBeforeHookParams({
					tool,
					originalParams: preparedParams,
					hookParams,
					adjustedParams: outcome.params
				});
				executeParams = tool.finalizeBeforeToolCallParams?.(executeParams, preparedParams) ?? executeParams;
			} catch (error) {
				recordPreExecutionError(error, outcome.params ?? hookParams, "tool_preparation");
				throw tagBeforeToolCallFailure(error, signal);
			}
			recordAdjustedParamsForToolCall(toolCallId, executeParams, ctx?.runId);
			const eventBase = buildEventBase(executeParams);
			recordToolExecutionStarted(toolCallId, ctx?.runId);
			if (hookOptions.emitDiagnostics) emitTrustedDiagnosticEvent({
				type: "tool.execution.started",
				...eventBase
			});
			const startedAt = Date.now();
			try {
				const result = await execute(toolCallId, executeParams, signal, onUpdate);
				const durationMs = Date.now() - startedAt;
				const terminalPresentation = resolveToolTerminalPresentation({
					tool,
					toolParams: executeParams,
					result
				});
				await recordLoopOutcome({
					ctx,
					toolName: normalizedToolName,
					toolParams: executeParams,
					toolCallId,
					result,
					toolCallOrdinal,
					terminalPresentation
				});
				rememberPendingTerminalPresentation({
					ctx,
					tool,
					toolParams: executeParams,
					toolCallId,
					toolCallOrdinal
				});
				const skillMatch = findSkillUsageMatch({
					toolName: normalizedToolName,
					toolParams: executeParams,
					ctx
				});
				if (hookOptions.emitDiagnostics) {
					if (skillMatch) emitSkillUsedDiagnostic({
						ctx,
						match: skillMatch,
						toolName: normalizedToolName,
						toolCallId
					});
					const terminalEvent = resolveToolResultTerminalDiagnostic(result, durationMs);
					emitTrustedDiagnosticEventWithPrivateData({
						...eventBase,
						...terminalEvent
					}, buildToolContentPrivateData(toolContentPolicy, {
						input: executeParams,
						output: result,
						includeOutput: true
					}));
				}
				return result;
			} catch (err) {
				if (hookOptions.emitDiagnostics) emitTrustedDiagnosticEventWithPrivateData({
					type: "tool.execution.error",
					...eventBase,
					durationMs: Date.now() - startedAt,
					...resolveToolErrorDiagnostic(err, signal)
				}, buildToolContentPrivateData(toolContentPolicy, {
					input: executeParams,
					includeOutput: false
				}));
				await recordLoopOutcome({
					ctx,
					toolName: normalizedToolName,
					toolParams: executeParams,
					toolCallId,
					error: err,
					toolCallOrdinal
				});
				throw err;
			}
		}
	};
	const executeWithHooks = wrappedTool.execute;
	wrappedTool.execute = async (toolCallId, params, signal, onUpdate) => {
		recordToolExecutionTracked(toolCallId, ctx?.runId);
		try {
			return await executeWithHooks(toolCallId, params, signal, onUpdate);
		} finally {
			clearTrackedToolExecution(toolCallId, ctx?.runId);
		}
	};
	copyPluginToolMeta(tool, wrappedTool);
	copyChannelAgentToolMeta(tool, wrappedTool);
	copyToolTerminalPresentation(tool, wrappedTool);
	Object.defineProperty(wrappedTool, BEFORE_TOOL_CALL_WRAPPED, {
		value: true,
		enumerable: true
	});
	Object.defineProperty(wrappedTool, BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS, {
		value: hookOptions,
		enumerable: false
	});
	Object.defineProperty(wrappedTool, BEFORE_TOOL_CALL_SOURCE_TOOL, {
		value: tool,
		enumerable: false
	});
	Object.defineProperty(wrappedTool, BEFORE_TOOL_CALL_HOOK_CONTEXT, {
		value: ctx,
		enumerable: false
	});
	return wrappedTool;
}
/** Rebuild a before_tool_call wrapper while preserving the original source tool. */
function rewrapToolWithBeforeToolCallHook(tool, ctx, options = {}) {
	const taggedTool = tool;
	const source = taggedTool[BEFORE_TOOL_CALL_SOURCE_TOOL];
	const wrappedContext = taggedTool[BEFORE_TOOL_CALL_HOOK_CONTEXT];
	const preservedContext = wrappedContext && typeof wrappedContext === "object" ? wrappedContext : void 0;
	const sourceTool = source && typeof source === "object" ? source : tool;
	if (sourceTool === tool) return wrapToolWithBeforeToolCallHook(tool, ctx ?? preservedContext, options);
	const rewrapSource = {
		...tool,
		execute: sourceTool.execute
	};
	delete rewrapSource[BEFORE_TOOL_CALL_WRAPPED];
	copyPluginToolMeta(tool, rewrapSource);
	copyChannelAgentToolMeta(tool, rewrapSource);
	copyToolTerminalPresentation(tool, rewrapSource);
	return wrapToolWithBeforeToolCallHook(rewrapSource, ctx ?? preservedContext, options);
}
function recordPreExecutionBlockedToolCall(toolCallId, runId) {
	if (!toolCallId) return;
	preExecutionBlockedToolCallIds.add(buildAdjustedParamsKey({
		runId,
		toolCallId
	}));
	while (preExecutionBlockedToolCallIds.size > MAX_TRACKED_ADJUSTED_PARAMS) {
		const oldest = preExecutionBlockedToolCallIds.values().next().value;
		if (!oldest) break;
		preExecutionBlockedToolCallIds.delete(oldest);
	}
}
function toLintErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value, { cause: value });
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
//#endregion
export { resolveOpenClientVoiceSessionId as A, assertClientVoiceSessionOpen as C, ensureClientVoiceAgentSessionEntry as D, createOrResumeClientVoiceSession as E, setEmbeddedPluginApprovalBroker as F, isEmbeddedMode as I, setEmbeddedMode as L, bindAuthorizedClientVoiceConfirmation as M, EmbeddedPluginApprovalBroker as N, registerClientVoiceConsultRun as O, clearEmbeddedPluginApprovalBroker as P, appendRelayVoiceTranscript as S, closeStaleClientVoiceSessions as T, consumeStructuredReplaySafeToolCall as _, getBeforeToolCallPolicyDiagnosticState as a, peekPreExecutionBlockedToolCall as b, isPreExecutionBlockedToolResult as c, requestDeferredPluginToolApproval as d, rewrapToolWithBeforeToolCallHook as f, consumePreExecutionBlockedToolCall as g, consumeAdjustedParamsForToolCall as h, getBeforeToolCallFailureDisposition as i, authorizeClientVoiceConfirmation as j, resolveClientVoiceSessionOrigin as k, recordAdjustedParamsForToolCall as l, wrapToolWithBeforeToolCallHook as m, cancelDeferredPluginToolApproval as n, hasBeforeToolCallPolicy as o, runBeforeToolCallHook as p, finalizeToolTerminalPresentation as r, isBeforeToolCallBlockedError as s, buildBlockedToolResult as t, recordStructuredReplayTrustForToolCall as u, consumeTrackedToolExecutionStarted as v, closeClientVoiceSession as w, appendClientVoiceTranscript as x, peekAdjustedParamsForToolCall as y };
