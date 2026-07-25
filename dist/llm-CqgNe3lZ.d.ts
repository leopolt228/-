import { _ as ProviderStreamOptions, a as AssistantMessageEventStreamContract, c as Context, f as Model, n as Api, r as AssistantMessage, v as SimpleStreamOptions } from "./types-CVnOkpxa.js";
import { calculateCost as calculateCost$1, clampThinkingLevel as clampThinkingLevel$1, getApiProvider, getApiProviders, getEnvApiKey as getEnvApiKey$1, parseStreamingJson as parseStreamingJson$1, sanitizeSurrogates as sanitizeSurrogates$1 } from "@openclaw/ai/internal/runtime";
import { adjustMaxTokensForThinking, buildBaseOptions, clampReasoning, transformMessages } from "@openclaw/ai/internal/shared";
import { ApiProvider } from "@openclaw/ai";
import { Agent } from "node:http";
import { Agent as Agent$1 } from "node:https";

//#region src/llm/stream.d.ts
declare function stream<TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions): AssistantMessageEventStreamContract;
declare function complete<TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions): Promise<AssistantMessage>;
declare function streamSimple<TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions): AssistantMessageEventStreamContract;
declare function completeSimple<TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions): Promise<AssistantMessage>;
//#endregion
//#region src/llm/utils/node-http-proxy.d.ts
/** HTTP(S) agent pair for Node fetch/client integrations that accept explicit agents. */
interface NodeHttpProxyAgents {
  httpAgent: Agent;
  httpsAgent: Agent$1;
}
/** Builds fixed HTTP and HTTPS proxy agents for a target URL, when env proxy config applies. */
declare function createHttpProxyAgentsForTarget(targetUrl: string | URL): NodeHttpProxyAgents | undefined;
//#endregion
export { streamSimple as _, clampReasoning as a, getApiProviders as c, sanitizeSurrogates$1 as d, transformMessages as f, stream as g, completeSimple as h, calculateCost$1 as i, getEnvApiKey$1 as l, complete as m, adjustMaxTokensForThinking as n, clampThinkingLevel$1 as o, createHttpProxyAgentsForTarget as p, buildBaseOptions as r, getApiProvider as s, ApiProvider as t, parseStreamingJson$1 as u };