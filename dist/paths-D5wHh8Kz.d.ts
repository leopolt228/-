//#region src/config/sessions/paths.d.ts
declare function resolveSessionTranscriptsDirForAgent(agentId?: string, env?: NodeJS.ProcessEnv, homedir?: () => string): string;
declare function resolveStorePath(store?: string, opts?: {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
}): string;
//#endregion
export { resolveStorePath as n, resolveSessionTranscriptsDirForAgent as t };