import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
//#region src/media/local-roots.d.ts
/** Adds the active agent workspace to the default media roots without exposing all agent state. */
declare function getAgentScopedMediaLocalRoots(cfg: OpenClawConfig, agentId?: string): readonly string[];
//#endregion
//#region src/plugin-sdk/agent-media-payload.d.ts
/** Legacy agent media payload layout consumed by older agent adapters. */
type AgentMediaPayload = {
  MediaPath?: string;
  MediaType?: string;
  MediaUrl?: string;
  MediaPaths?: string[];
  MediaUrls?: string[];
  MediaTypes?: string[];
};
/** Convert outbound media descriptors into the legacy agent payload field layout. */
declare function buildAgentMediaPayload(mediaList: Array<{
  path: string;
  contentType?: string | null;
}>): AgentMediaPayload;
//#endregion
export { buildAgentMediaPayload as n, getAgentScopedMediaLocalRoots as r, AgentMediaPayload as t };