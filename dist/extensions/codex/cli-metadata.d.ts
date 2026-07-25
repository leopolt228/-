import { t as OpenClawPluginDefinition } from "../../types-Bi5Leigi.js";
import { g as OpenClawPluginApi, v as OpenClawPluginConfigSchema, y as OpenClawPluginDefinition$1 } from "../../plugin-entry-Bj-pdgAt.js";

//#region extensions/codex/cli-metadata.d.ts
declare function registerCodexCliMetadata(api: OpenClawPluginApi): void;
declare const _default: {
  id: string;
  name: string;
  description: string;
  configSchema: OpenClawPluginConfigSchema;
  register: NonNullable<OpenClawPluginDefinition$1["register"]>;
} & Pick<OpenClawPluginDefinition, "kind" | "reload" | "nodeHostCommands" | "securityAuditCollectors">;
//#endregion
export { _default as default, registerCodexCliMetadata };