import { a as getRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot, x as selectApplicableRuntimeConfig } from "./runtime-snapshot-BW7iP5ad.js";
import "./config-BOMcY2yX.js";
import { n as ToolInputError } from "./common-C39GdgQ7.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { r as onSubagentRegistryPersisted } from "./subagent-registry-state-D4-t_yGj.js";
import { u as getSubagentRunsByRunIds } from "./subagent-registry-CY9-zfiv.js";
import { t as resolveSwarmConfig } from "./swarm-config-BNK1oibW.js";
import { Type } from "typebox";
//#region src/agents/tool-runtime-config.ts
function resolveAgentRuntimeToolConfig(inputConfig) {
	const runtimeConfig = getRuntimeConfigSnapshot() ?? void 0;
	if (!runtimeConfig) return inputConfig;
	if (!inputConfig || inputConfig === runtimeConfig) return runtimeConfig;
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot() ?? void 0;
	if (!runtimeSourceConfig) return inputConfig;
	return selectApplicableRuntimeConfig({
		inputConfig,
		runtimeConfig,
		runtimeSourceConfig
	});
}
//#endregion
//#region src/agents/tools/agents-wait-tool.ts
const MAX_WAIT_IDS = 1e3;
const AgentsWaitToolSchema = Type.Object({
	ids: Type.Array(Type.String({ minLength: 1 }), {
		minItems: 1,
		maxItems: MAX_WAIT_IDS
	}),
	timeoutSeconds: Type.Optional(Type.Number({ minimum: 0 }))
});
function ownsRun(entry, currentSessionKeys) {
	const owner = entry.swarmRequesterSessionKey?.trim();
	if (!owner) return false;
	return (entry.swarmWaitOwnerSessionKeys && entry.swarmWaitOwnerSessionKeys.length > 0 ? entry.swarmWaitOwnerSessionKeys : [owner]).some((sessionKey) => currentSessionKeys.has(sessionKey));
}
function completionResult(entry) {
	const completion = entry.collectorCompletion;
	if (!completion) return;
	return {
		runId: entry.swarmRunId ?? entry.runId,
		status: completion.status,
		result: entry.completion?.resultText ?? entry.completion?.fallbackResultText ?? "",
		...completion.structured !== void 0 ? { structured: completion.structured } : {},
		...completion.schemaError ? { schemaError: completion.schemaError } : {},
		sessionKey: entry.childSessionKey,
		...entry.label ? { label: entry.label } : {},
		...completion.usage ? { usage: completion.usage } : {}
	};
}
/** Park one host bridge until its collector completes; registry writes wake it without polling. */
async function waitForCollectorCompletion(params) {
	const readCompletion = () => {
		const state = readWaitState([params.runId], params.currentSessionKeys);
		const error = state.errors?.[0];
		if (error) throw new ToolInputError(`agents.run ${error.error}: ${error.runId}`);
		return state.completed[0];
	};
	const immediate = readCompletion();
	if (immediate) return immediate;
	if (params.signal?.aborted) throw new ToolInputError("agents.run wait aborted.");
	return await new Promise((resolve, reject) => {
		let settled = false;
		const finish = (result) => {
			if (settled) return;
			settled = true;
			unsubscribe();
			params.signal?.removeEventListener("abort", onAbort);
			if (result instanceof Error) reject(result);
			else resolve(result);
		};
		const check = () => {
			try {
				const completion = readCompletion();
				if (completion) finish(completion);
			} catch (error) {
				finish(error instanceof Error ? error : new Error(String(error)));
			}
		};
		const onAbort = () => finish(new ToolInputError("agents.run wait aborted."));
		const unsubscribe = onSubagentRegistryPersisted(check);
		params.signal?.addEventListener("abort", onAbort, { once: true });
		if (params.signal?.aborted) onAbort();
		else check();
	});
}
function resolveWaitTargets(ids, currentSessionKeys) {
	const targets = [];
	const errors = [];
	const snapshot = getSubagentRunsByRunIds(ids);
	for (const runId of ids) {
		const entry = snapshot.entries.get(runId);
		if (!entry?.collect) errors.push({
			runId,
			error: "not_found"
		});
		else if (!ownsRun(entry, currentSessionKeys)) errors.push({
			runId,
			error: "not_owner"
		});
		else targets.push({
			runId,
			entry
		});
	}
	return {
		targets,
		errors
	};
}
function readResolvedWaitState(targets, errors) {
	const completed = [];
	const pending = [];
	for (const [inputIndex, { runId, entry }] of targets.entries()) {
		const result = completionResult(entry);
		if (result) completed.push({
			result,
			completedAt: entry.completion?.capturedAt ?? entry.endedAt ?? Number.MAX_SAFE_INTEGER,
			inputIndex
		});
		else pending.push(runId);
	}
	completed.sort((left, right) => left.completedAt - right.completedAt || left.inputIndex - right.inputIndex);
	return {
		completed: completed.map((entry) => entry.result),
		pending,
		...errors.length > 0 ? { errors } : {}
	};
}
function readWaitState(ids, currentSessionKeys) {
	const resolved = resolveWaitTargets(ids, currentSessionKeys);
	return readResolvedWaitState(resolved.targets, resolved.errors);
}
async function waitForCollector(params) {
	const deadline = Date.now() + params.timeoutMs;
	for (;;) {
		const state = readWaitState(params.ids, params.currentSessionKeys);
		if (state.completed.length > 0 || state.pending.length === 0 || Date.now() >= deadline) return state;
		await new Promise((resolve) => {
			const finish = () => {
				clearTimeout(timer);
				params.signal?.removeEventListener("abort", finish);
				resolve();
			};
			const timer = setTimeout(finish, Math.min(25, Math.max(0, deadline - Date.now())));
			params.signal?.addEventListener("abort", finish, { once: true });
		});
		if (params.signal?.aborted) return readWaitState(params.ids, params.currentSessionKeys);
	}
}
function createAgentsWaitTool(opts) {
	const swarm = resolveSwarmConfig(opts.config, opts.agentId);
	return {
		label: "Wait for Agents",
		name: "agents_wait",
		displaySummary: "Wait for collector children.",
		description: "Wait until one collector child completes, or until timeout.",
		parameters: AgentsWaitToolSchema,
		execute: async (_toolCallId, args, signal) => {
			const params = args;
			if (params.ids.length > MAX_WAIT_IDS) throw new ToolInputError(`agents_wait supports at most ${MAX_WAIT_IDS} ids.`);
			const ids = [...new Set(params.ids.map((id) => id.trim()).filter(Boolean))];
			const currentSessionKeys = new Set([opts.runSessionKey, opts.agentSessionKey].filter((key) => Boolean(key?.trim())));
			const requestedTimeout = typeof params.timeoutSeconds === "number" && Number.isFinite(params.timeoutSeconds) ? params.timeoutSeconds : 30;
			return jsonResult(await waitForCollector({
				ids,
				currentSessionKeys,
				timeoutMs: Math.min(Math.max(0, requestedTimeout), swarm.waitTimeoutSecondsMax) * 1e3,
				signal
			}));
		}
	};
}
const testing = {
	ownsRun,
	readResolvedWaitState,
	readWaitState,
	resolveWaitTargets,
	waitForCollector
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.agentsWaitToolTestApi")] = { testing };
//#endregion
//#region src/agents/swarm-code-mode.ts
/** Internal host-only metadata used to make Code Mode collector spawns replay-safe. */
const SWARM_CODE_MODE_IDEMPOTENCY_KEY = Symbol.for("openclaw.swarmCodeModeIdempotencyKey");
const SWARM_CODE_MODE_REQUEST_FINGERPRINT = Symbol.for("openclaw.swarmCodeModeRequestFingerprint");
//#endregion
export { resolveAgentRuntimeToolConfig as a, waitForCollectorCompletion as i, SWARM_CODE_MODE_REQUEST_FINGERPRINT as n, createAgentsWaitTool as r, SWARM_CODE_MODE_IDEMPOTENCY_KEY as t };
