import { r as __exportAll } from "./rolldown-runtime-DE1ahGrs.js";
import { i as createAssistantMessageEventStream, n as validateToolCall, r as AssistantMessageEventStream, t as validateToolArguments } from "./validation-BnRQQL2Q.js";
import { i as streamSimple, n as completeSimple, r as stream, t as complete } from "./stream-CKgZbNR4.js";
import { r as resolveEnvNodeProxyUrlForTarget, t as createFixedNodeProxyAgentPair } from "./node-proxy-agent-DQDWFMx0.js";
import { calculateCost as calculateCost$1, clampThinkingLevel as clampThinkingLevel$1, getApiProvider, getApiProviders, getEnvApiKey as getEnvApiKey$1, parseStreamingJson as parseStreamingJson$1, sanitizeSurrogates as sanitizeSurrogates$1 } from "@openclaw/ai/internal/runtime";
import { adjustMaxTokensForThinking, buildBaseOptions, clampReasoning, transformMessages } from "@openclaw/ai/internal/shared";
//#region src/llm/utils/node-http-proxy.ts
/** Resolves the environment proxy URL that applies to a target URL. */
function resolveHttpProxyUrlForTarget(targetUrl) {
	return resolveEnvNodeProxyUrlForTarget(targetUrl);
}
/** Builds fixed HTTP and HTTPS proxy agents for a target URL, when env proxy config applies. */
function createHttpProxyAgentsForTarget(targetUrl) {
	const proxyUrl = resolveHttpProxyUrlForTarget(targetUrl);
	if (!proxyUrl) return;
	return createFixedNodeProxyAgentPair(proxyUrl);
}
//#endregion
//#region src/plugin-sdk/llm.ts
var llm_exports = /* @__PURE__ */ __exportAll({
	AssistantMessageEventStream: () => AssistantMessageEventStream,
	adjustMaxTokensForThinking: () => adjustMaxTokensForThinking,
	buildBaseOptions: () => buildBaseOptions,
	calculateCost: () => calculateCost$1,
	clampReasoning: () => clampReasoning,
	clampThinkingLevel: () => clampThinkingLevel$1,
	complete: () => complete,
	completeSimple: () => completeSimple,
	createAssistantMessageEventStream: () => createAssistantMessageEventStream,
	createHttpProxyAgentsForTarget: () => createHttpProxyAgentsForTarget,
	getApiProvider: () => getApiProvider,
	getApiProviders: () => getApiProviders,
	getEnvApiKey: () => getEnvApiKey$1,
	parseStreamingJson: () => parseStreamingJson$1,
	sanitizeSurrogates: () => sanitizeSurrogates$1,
	stream: () => stream,
	streamSimple: () => streamSimple,
	transformMessages: () => transformMessages,
	validateToolArguments: () => validateToolArguments,
	validateToolCall: () => validateToolCall
});
//#endregion
export { clampThinkingLevel$1 as a, getEnvApiKey$1 as c, sanitizeSurrogates$1 as d, transformMessages as f, clampReasoning as i, llm_exports as l, buildBaseOptions as n, getApiProvider as o, createHttpProxyAgentsForTarget as p, calculateCost$1 as r, getApiProviders as s, adjustMaxTokensForThinking as t, parseStreamingJson$1 as u };
