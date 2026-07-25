import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-f-lb12_n.js";
import { n as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-C9geO1r1.js";
import { c as resolveAgentRunAbortLifecycleFields } from "./run-termination-BQ_P-sPi.js";
import { o as runWithModelFallback } from "./model-fallback-CVFSvXjG.js";
import { r as mergeEmbeddedAgentRunResultForModelFallbackExhaustion, t as classifyEmbeddedAgentRunResultForModelFallback } from "./result-fallback-classifier--iXpZDg_.js";
//#region src/agents/embedded-agent-runner/run-entry.ts
const PRESERVED_FOLLOWUP_RESULT_CODES = /* @__PURE__ */ new Set([
	"empty_result",
	"reasoning_only_result",
	"planning_only_result"
]);
function preserveFollowupResultForDelivery(classification) {
	if (!classification || !("code" in classification) || !classification.code || !PRESERVED_FOLLOWUP_RESULT_CODES.has(classification.code)) return classification;
	return {
		...classification,
		preserveResultOnExhaustion: true,
		preserveResultPriority: -1
	};
}
function resolveTerminalStatus(params) {
	const meta = params.result.meta;
	if (meta.stopReason === "timeout" || meta.timeoutPhase) return "timeout";
	if (params.fallbackExhausted || meta.aborted === true || meta.error || meta.stopReason === "error") return "error";
	return "ok";
}
function buildTerminal(params) {
	const meta = params.result.meta;
	const outcome = buildAgentRunTerminalOutcome({
		status: resolveTerminalStatus(params),
		error: meta.error?.message,
		stopReason: meta.stopReason,
		livenessState: meta.livenessState,
		timeoutPhase: meta.timeoutPhase,
		providerStarted: meta.providerStarted
	});
	const metadata = {};
	if (params.behavior.kind === "channel-delivery" || params.behavior.kind === "followup-delivery") for (const key of [
		"stopReason",
		"yielded",
		"timeoutPhase",
		"providerStarted",
		"aborted",
		"livenessState",
		"replayInvalid"
	]) {
		if (!Object.hasOwn(meta, key)) continue;
		metadata[key] = key in outcome ? outcome[key] : meta[key];
	}
	else {
		for (const key of [
			"stopReason",
			"livenessState",
			"timeoutPhase",
			"providerStarted"
		]) if (outcome[key] !== void 0) metadata[key] = outcome[key];
		if (typeof meta.aborted === "boolean") metadata.aborted = meta.aborted;
		if (meta.replayInvalid === true) metadata.replayInvalid = true;
		if (meta.yielded === true) metadata.yielded = true;
	}
	return {
		outcome,
		metadata
	};
}
/** Runs a fallback candidate chain and prepares its shared terminal settlement state. */
async function runEmbeddedAgentEntry(params) {
	let candidateIndex = 0;
	const committedSideEffect = params.behavior.kind === "command-rpc" ? params.behavior.hasCommittedSideEffect : void 0;
	const fallbackResult = await runWithModelFallback({
		...params.selection,
		...params.identity,
		abortSignal: params.abortSignal,
		resolveAgentHarnessRuntimeOverride: params.harness.resolveRuntimeOverride,
		prepareAgentHarnessRuntime: async ({ provider, model, agentHarnessRuntimeOverride }) => {
			const prepare = () => ensureSelectedAgentHarnessPlugin({
				config: params.selection.cfg,
				provider,
				modelId: model,
				agentId: params.identity.agentId,
				sessionKey: params.harness.sessionKey,
				agentHarnessId: agentHarnessRuntimeOverride,
				agentHarnessRuntimeOverride,
				workspaceDir: params.harness.workspaceDir
			});
			if (params.harness.preparation.kind === "measured") await params.harness.preparation.run(prepare);
			else await prepare();
		},
		onFallbackStep: params.onFallbackStep,
		...params.behavior.kind === "maintenance" ? {} : { classifyResult: ({ result, provider, model }) => {
			const classification = classifyEmbeddedAgentRunResultForModelFallback({
				result,
				provider,
				model,
				...params.behavior.kind === "channel-delivery" ? params.behavior.readDeliveryEvidence() : void 0
			});
			const effectiveClassification = params.behavior.kind === "followup-delivery" ? preserveFollowupResultForDelivery(classification) : classification;
			return effectiveClassification && committedSideEffect?.() ? void 0 : effectiveClassification;
		} },
		...committedSideEffect ? { canFallbackAfterError: () => !committedSideEffect() } : {},
		...params.behavior.kind === "maintenance" ? {} : { mergeExhaustedResult: ({ latestResult, preferredResult }) => mergeEmbeddedAgentRunResultForModelFallbackExhaustion({
			latestResult,
			preferredResult
		}) },
		run: async (provider, model, options) => {
			const isFallbackRetry = candidateIndex > 0;
			candidateIndex += 1;
			return params.runCandidate(provider, model, {
				allowTransientCooldownProbe: options?.allowTransientCooldownProbe,
				isFinalFallbackAttempt: options?.isFinalFallbackAttempt,
				isFallbackRetry
			});
		}
	});
	const abortFields = params.behavior.kind === "command-rpc" ? resolveAgentRunAbortLifecycleFields(params.abortSignal) : {};
	const result = abortFields.aborted === true ? {
		...fallbackResult.result,
		meta: {
			...fallbackResult.result.meta,
			...abortFields
		}
	} : fallbackResult.result;
	const settledResult = {
		...fallbackResult,
		outcome: fallbackResult.outcome === "exhausted" ? "exhausted" : "completed",
		result
	};
	const terminal = buildTerminal({
		result,
		fallbackExhausted: settledResult.outcome === "exhausted",
		behavior: params.behavior
	});
	let sessionOverrideSettled = false;
	const settleSessionOverride = async () => {
		if (sessionOverrideSettled) return;
		sessionOverrideSettled = true;
		if (settledResult.outcome === "completed" && params.sessionOverride.kind === "reconcile-completed") await params.sessionOverride.reconcile({
			provider: settledResult.provider,
			model: settledResult.model
		});
	};
	return {
		...settledResult,
		terminal,
		settleSessionOverride
	};
}
//#endregion
export { runEmbeddedAgentEntry as t };
