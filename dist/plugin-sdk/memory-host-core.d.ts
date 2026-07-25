import { i as OpenClawConfig } from "../types.openclaw-DAPZkTyD.js";
import { t as resolveSessionTranscriptsDirForAgent } from "../paths-D5wHh8Kz.js";
import { d as resolveDefaultAgentId, n as resolveSessionAgentId } from "../agent-scope-DmW8nZGH.js";
import { T as registerMemoryCorpusSupplement, a as MemoryPluginCapability, g as getMemoryCapabilityRegistration, l as MemoryPromptSectionBuilder, m as clearMemoryPluginState, o as MemoryPluginPublicArtifact, p as buildMemoryPromptSection, w as registerMemoryCapability, y as listActiveMemoryPublicArtifacts } from "../memory-state-BkRTpzLa.js";

//#region src/plugin-sdk/memory-host-core.d.ts
/** Lists public memory artifacts across all configured memory workspaces. */
declare function listMemoryHostPublicArtifacts(params: {
  cfg: OpenClawConfig;
}): Promise<MemoryPluginPublicArtifact[]>;
//#endregion
export { type MemoryPluginCapability, type MemoryPluginPublicArtifact, type MemoryPromptSectionBuilder, buildMemoryPromptSection as buildActiveMemoryPromptSection, clearMemoryPluginState, getMemoryCapabilityRegistration, listActiveMemoryPublicArtifacts, listMemoryHostPublicArtifacts, registerMemoryCapability, registerMemoryCorpusSupplement, resolveDefaultAgentId, resolveSessionAgentId, resolveSessionTranscriptsDirForAgent };