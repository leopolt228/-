import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { tt as resolveContextEngine } from "./types-Bi5Leigi.js";

//#region src/context-engine/init.d.ts
declare function ensureContextEnginesInitialized(): void;
//#endregion
//#region src/agents/runtime-plugins.d.ts
/** Ensure standalone runtime plugins are loaded for the current agent context. */
declare function ensureRuntimePluginsLoaded(params: {
  config?: OpenClawConfig;
  workspaceDir?: string | null;
  allowGatewaySubagentBinding?: boolean;
}): void;
//#endregion
export { ensureContextEnginesInitialized, ensureRuntimePluginsLoaded, resolveContextEngine };