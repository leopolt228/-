import { r as GuardedFetchOptions } from "./fetch-guard-BKvfwdRa.js";
import { Agent, AgentOptions } from "node:http";
import { AgentOptions as AgentOptions$1 } from "node:https";
//#region src/infra/net/proxy/proxy-tls.d.ts
/** TLS trust material passed to proxy clients for OpenClaw-managed HTTPS proxies. */
type ManagedProxyTlsOptions = Readonly<{
  ca?: string;
}>;
//#endregion
//#region src/infra/net/proxy/active-managed-proxy-tls.d.ts
type ManagedProxyTlsEnv$1 = NodeJS.ProcessEnv;
type ResolveActiveManagedProxyTlsOptionsParams = {
  proxyUrl?: string;
  env?: ManagedProxyTlsEnv$1;
};
/** Resolves managed proxy TLS trust only when the target proxy is OpenClaw's active proxy. */
declare function resolveActiveManagedProxyTlsOptions(params?: ResolveActiveManagedProxyTlsOptionsParams): ManagedProxyTlsOptions | undefined;
//#endregion
//#region src/infra/net/proxy/managed-proxy-undici.d.ts
type ManagedProxyTlsEnv = NodeJS.ProcessEnv;
type AddActiveManagedProxyTlsOptionsParams = {
  env?: ManagedProxyTlsEnv;
};
/** Adds active managed proxy TLS options to env proxy agent options. */
declare function addActiveManagedProxyTlsOptions(options: undefined, params?: AddActiveManagedProxyTlsOptionsParams): {
  proxyTls: ManagedProxyTlsOptions;
} | undefined;
/** Adds active managed proxy TLS options to explicit proxy agent options. */
declare function addActiveManagedProxyTlsOptions<TOptions extends object>(options: TOptions, params?: AddActiveManagedProxyTlsOptionsParams): TOptions | (TOptions & {
  proxyTls: Record<string, unknown>;
});
declare function addActiveManagedProxyTlsOptions<TOptions extends object>(options: TOptions | undefined, params?: AddActiveManagedProxyTlsOptionsParams): TOptions | (TOptions & {
  proxyTls: Record<string, unknown>;
}) | {
  proxyTls: ManagedProxyTlsOptions;
} | undefined;
//#endregion
//#region src/infra/net/node-proxy-agent.d.ts
type NodeProxyProtocol = "http" | "https";
type NodeProxyAgentOptions = AgentOptions & AgentOptions$1;
/** Selects either ambient env proxy resolution or a caller-supplied fixed proxy URL. */
type CreateNodeProxyAgentOptions = {
  mode: "env";
  targetUrl: string | URL;
  protocol?: NodeProxyProtocol;
  agentOptions?: NodeProxyAgentOptions;
} | {
  mode: "explicit";
  proxyUrl: string | URL;
  protocol?: NodeProxyProtocol;
  agentOptions?: NodeProxyAgentOptions;
};
/** Creates a Node HTTP(S) agent for explicit proxy URLs; unsupported protocols throw. */
declare function createNodeProxyAgent(options: Extract<CreateNodeProxyAgentOptions, {
  mode: "explicit";
}>): Agent;
/** Creates a Node HTTP(S) agent from env proxy settings, or undefined when bypassed. */
declare function createNodeProxyAgent(options: Extract<CreateNodeProxyAgentOptions, {
  mode: "env";
}>): Agent | undefined;
//#endregion
//#region src/plugin-sdk/fetch-runtime.d.ts
type GuardedFetchPresetOptions = Omit<GuardedFetchOptions, "mode" | "proxy" | "dangerouslyAllowEnvProxyWithoutPinnedDns">;
/** Apply the trusted-env-proxy guarded fetch preset without exposing raw mode strings to plugins. */
declare function withTrustedEnvProxyGuardedFetchMode(params: GuardedFetchPresetOptions): GuardedFetchOptions;
//#endregion
export { resolveActiveManagedProxyTlsOptions as a, addActiveManagedProxyTlsOptions as i, CreateNodeProxyAgentOptions as n, createNodeProxyAgent as r, withTrustedEnvProxyGuardedFetchMode as t };