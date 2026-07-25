import { B as OpenClawPluginCommandDefinition, N as PluginInteractiveHandlerRegistration, z as AgentPromptSurfaceKind } from "./types-Bi5Leigi.js";

//#region src/plugins/command-registry-state.d.ts
type RegisteredPluginCommand = OpenClawPluginCommandDefinition & {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
  trustedOwnerStatusExposure?: true;
};
declare function clearPluginCommands(): void;
declare function listRegisteredPluginAgentPromptGuidance(params?: {
  surface?: AgentPromptSurfaceKind;
  includeLegacyGlobalGuidance?: boolean;
}): string[];
//#endregion
//#region src/plugins/interactive-state.d.ts
/** Registered interactive handler with owning plugin metadata. */
type RegisteredInteractiveHandler = PluginInteractiveHandlerRegistration & {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
  registryOwned?: true;
};
//#endregion
//#region src/plugins/interactive-registry.d.ts
/** Registration result for plugin interactive namespace handlers. */
type InteractiveRegistrationResult = {
  ok: boolean;
  error?: string;
};
/** Resolves a channel payload to a registered plugin interactive namespace handler. */
/** Registers one process-global interactive handler. */
declare function registerPluginInteractiveHandler(pluginId: string, registration: PluginInteractiveHandlerRegistration, opts?: {
  pluginName?: string;
  pluginRoot?: string;
}): InteractiveRegistrationResult;
/** Clears all active plugin interactive handlers. */
declare function clearPluginInteractiveHandlers(): void;
//#endregion
export { clearPluginCommands as a, RegisteredPluginCommand as i, registerPluginInteractiveHandler as n, listRegisteredPluginAgentPromptGuidance as o, RegisteredInteractiveHandler as r, clearPluginInteractiveHandlers as t };